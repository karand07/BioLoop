import { prisma } from "../../lib/prisma.js";
import { requestTypes } from "./orderRequest.schemas.js";

class RequestServices {
  async create(
    { listing_id, requested_quantity, offered_price, message }: requestTypes,
    userId: number,
  ) {
    // check listing exists and is active
    const listing = await prisma.waste_Listings.findUnique({
      where: { listing_id },
    });
    if (!listing) {
      throw new Error("Listing not found");
    }
    if (listing.status !== "active") {
      throw new Error("Listing is no longer available");
    }

    // check company hasn't already sent a request on this listing
    const existingRequest = await prisma.order_Request.findFirst({
      where: { listing_id, company_id: userId },
    });
    if (existingRequest) {
      throw new Error("You have already sent a request on this listing");
    }

    const request = await prisma.order_Request.create({
      data: {
        listing_id,
        company_id: userId,
        farmer_id: listing.farmer_id,
        requested_quantity,
        offered_price,
        message,
      },
    });
    return request;
  }

  async getMySentRequests(userId: number) {
    const requests = await prisma.order_Request.findMany({
      where: { company_id: userId },
      include: {
        listing: {
          include: { category: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
    return requests;
  }

  async cancelRequest(request_id: number, userId: number) {
    const request = await prisma.order_Request.findUnique({
      where: { request_id },
    });
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.company_id !== userId) {
      throw new Error("Unauthorized");
    }
    if (request.status !== "pending") {
      throw new Error("Only pending requests can be cancelled");
    }

    const deleted = await prisma.order_Request.delete({
      where: { request_id },
    });
    return deleted;
  }

  async getIncomingRequests(userId: number) {
    const requests = await prisma.order_Request.findMany({
      where: { farmer_id: userId, is_active: true },
      include: {
        company: true,
        listing: {
          include: { category: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
    return requests;
  }

  async acceptRequest(request_id: number, userId: number) {
    const request = await prisma.order_Request.findUnique({
      where: { request_id },
    });
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.farmer_id !== userId) {
      throw new Error("Unauthorized");
    }
    if (request.status !== "pending") {
      throw new Error("Request is no longer pending");
    }

    const [acceptedRequest] = await prisma.$transaction([
      // 1. Accept this request
      prisma.order_Request.update({
        where: { request_id },
        data: { status: "negotiating" },
      }),
      // 2. Auto-reject all other requests on same listing
      prisma.order_Request.updateMany({
        where: {
          listing_id: request.listing_id,
          request_id: { not: request_id },
        },
        data: { status: "auto_rejected", is_active: false },
      }),
      // 3. Mark listing as sold
      prisma.waste_Listings.update({
        where: { listing_id: request.listing_id },
        data: { status: "sold" },
      }),
    ]);
    return acceptedRequest;
  }

  async rejectRequest(request_id: number, userId: number) {
    const request = await prisma.order_Request.findUnique({
      where: { request_id },
    });
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.farmer_id !== userId) {
      throw new Error("Unauthorized");
    }
    if (request.status !== "pending") {
      throw new Error("Only pending requests can be rejected");
    }

    const updated = await prisma.order_Request.update({
      where: { request_id },
      data: { status: "rejected", is_active: false },
    });
    return updated;
  }

  async respond(request_id: number, userId: number, status: 'accepted' | 'rejected' | 'negotiated', negotiated_price?: number) {
    const request = await prisma.order_Request.findUnique({
      where: { request_id },
      include: { listing: true }
    });

    if (!request) throw new Error("Request not found");
    if (request.farmer_id !== userId) throw new Error("Unauthorized");
    if (request.status !== "pending" && request.status !== "negotiating") throw new Error("Request is no longer in a valid state for response");

    if (status === 'rejected') {
      return await prisma.order_Request.update({
        where: { request_id },
        data: { status: 'rejected', is_active: false }
      });
    }

    if (status === 'negotiated') {
      return await prisma.$transaction(async (tx) => {
        const updatedRequest = await tx.order_Request.update({
          where: { request_id },
          data: { status: 'negotiating', offered_price: negotiated_price || request.offered_price }
        });

        await tx.negotiation.create({
          data: {
            request_id,
            proposed_price: negotiated_price || request.offered_price,
            proposed_by: 'farmer',
            message: 'Farmer started negotiation'
          }
        });

        return updatedRequest;
      });
    }

    if (status === 'accepted') {
      // Calculate order details
      const farmer = await prisma.farmerProfile.findUnique({ where: { farmer_id: request.farmer_id } });
      const company = await prisma.companyProfile.findUnique({ where: { company_id: request.company_id } });

      const { calculateDistance } = await import("../utils/calculateDistance.js");
      const distanceKm = await calculateDistance(
        { lat: Number(farmer!.latitude), lng: Number(farmer!.longitude) },
        { lat: Number(company!.latitude), lng: Number(company!.longitude) }
      );

      const ratePerKm = 15;
      const baseCharge = 200;
      const deliveryCost = baseCharge + distanceKm * ratePerKm;
      const finalPrice = negotiated_price || request.offered_price;
      const platformCommission = Number(finalPrice) * 0.03;
      const totalAmount = Number(finalPrice) * Number(request.requested_quantity) + deliveryCost + platformCommission;

      return await prisma.$transaction(async (tx) => {
        // 1. Create Order
        const order = await tx.order.create({
          data: {
            request_id,
            farmer_id: request.farmer_id,
            company_id: request.company_id,
            final_price: finalPrice,
            quantity: request.requested_quantity,
            delivery_cost: deliveryCost,
            platform_commission: platformCommission,
            total_amount: totalAmount,
            status: 'confirmed'
          }
        });

        // 2. Update Request
        await tx.order_Request.update({
          where: { request_id },
          data: { status: 'accepted', is_active: false }
        });

        // 3. Mark Listing as Sold
        await tx.waste_Listings.update({
          where: { listing_id: request.listing_id },
          data: { status: 'sold' }
        });

        // 4. Reject other requests
        await tx.order_Request.updateMany({
          where: { listing_id: request.listing_id, request_id: { not: request_id } },
          data: { status: 'auto_rejected', is_active: false }
        });

        return order;
      });
    }
  }

  async getRequestById(request_id: number, userId: number) {
    const request = await prisma.order_Request.findUnique({
      where: { request_id },
      include: {
        listing: { include: { category: true } },
        company: true,
        negotiations: { orderBy: { created_at: "asc" } },
      },
    });
    if (!request) {
      throw new Error("Request not found");
    }
    // only farmer of listing or company that sent it can view
    if (request.farmer_id !== userId && request.company_id !== userId) {
      throw new Error("Unauthorized");
    }
    return request;
  }
}

export const requestServices = new RequestServices();
