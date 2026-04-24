import { prisma } from "../../lib/prisma.js";
import { createNotification } from "../utils/createNotification.js";

 
class AdminServices{
async getAllUsers(role?: string) {
  const users = await prisma.users.findMany({
    where: role ? { role: role as any } : {},
    select: {
      id: true,
      email: true,
      role: true,
      phone: true,
      is_verified: true,
      created_at: true,
      farmer_profile: true,
      company_profile: true,
      logistics_profile: true,
    },
    orderBy: { created_at: "desc" },
  });
  return users;
}
async verifyUser(user_id: number) {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.is_verified) {
    throw new Error("User is already verified");
  }

  const updated = await prisma.users.update({
    where: { id: user_id },
    data: { is_verified: true },
  });

  // notify user
  await createNotification(
    user_id,
    "Account Verified",
    "Your account has been verified successfully",
    "system",
  );
  return updated;
}
async blockUser(user_id: number) {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const updated = await prisma.users.update({
    where: { id: user_id },
    data: { is_verified: false },
  });
  return updated;
}
async deleteUser(user_id: number) {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const deleted = await prisma.users.delete({
    where: { id: user_id },
  });
  return deleted;
}
async getAllCategories() {
  const categories = await prisma.waste_Category.findMany({
    orderBy: { name: "asc" },
  });
  return categories;
}
async assignLogistics(order_id: number, logistics_id: number) {
  const order = await prisma.order.findUnique({
    where: { order_id },
  });
  if (!order) {
    throw new Error("Order not found");
  }

  const logistics = await prisma.logisticsProfile.findUnique({
    where: { logistics_id },
  });
  if (!logistics) {
    throw new Error("Logistics partner not found");
  }

  const schedule = await prisma.pickup_Schedule.findUnique({
    where: { order_id },
  });
  if (!schedule) {
    throw new Error("Pickup schedule not found for this order");
  }

  const updated = await prisma.pickup_Schedule.update({
    where: { order_id },
    data: { logistics_id },
  });

  // notify logistics partner
  await createNotification(
    logistics_id,
    "New Pickup Assigned",
    "A new pickup order has been assigned to you",
    "logistics",
  );
  return updated;
}
async getAllOrders(status?: string) {
  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : {},
    include: {
      farmer: true,
      company: true,
      request: {
        include: {
          listing: { include: { category: true } },
        },
      },
      payment: true,
      pickup_schedule: true,
      payouts: true,
    },
    orderBy: { created_at: "desc" },
  });
  return orders;
}
async getDashboardStats() {
  const [
    totalUsers,
    totalFarmers,
    totalCompanies,
    totalListings,
    activeListings,
    totalOrders,
    completedOrders,
    disputedOrders,
    totalRevenue,
  ] = await prisma.$transaction([
    prisma.users.count(),
    prisma.users.count({ where: { role: "farmer" } }),
    prisma.users.count({ where: { role: "company" } }),
    prisma.waste_Listings.count(),
    prisma.waste_Listings.count({ where: { status: "active" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "closed" } }),
    prisma.order.count({ where: { status: "disputed" } }),
    prisma.payment.aggregate({
      where: { status: "released" },
      _sum: { amount: true },
    }),
  ]);

  return {
    users: { total: totalUsers, farmers: totalFarmers, companies: totalCompanies },
    listings: { total: totalListings, active: activeListings },
    orders: { total: totalOrders, completed: completedOrders, disputed: disputedOrders },
    revenue: { total: totalRevenue._sum.amount ?? 0 },
  };
}

async getPlatformSettings() {
  let settings = await prisma.platformSettings.findFirst();
  if (!settings) {
    settings = await prisma.platformSettings.create({
      data: {
        commission_rate: 5.00,
        min_order_value: 500.00,
        base_logistics_rate: 50.00,
      },
    });
  }
  return settings;
}

async updatePlatformSettings(data: any) {
  const settings = await prisma.platformSettings.findFirst();
  if (!settings) {
    return await prisma.platformSettings.create({
      data: {
        ...data
      }
    });
  }
  return await prisma.platformSettings.update({
    where: { id: settings.id },
    data: {
      ...data
    }
  });
}
}

export const adminServices = new AdminServices();