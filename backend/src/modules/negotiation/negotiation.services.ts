import { randomInt } from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import { calculateDistance } from "../utils/calculateDistance.js";
import { negotiationTypes } from "./negotiation.schemas.js";

class NegotiationServices {
  async sendOffer(
    { request_id, proposed_price, message }: negotiationTypes,
    userId: number,
    userRole: string,
  ) {
    // check request exists and is negotiating
    const request = await prisma.order_Request.findUnique({
      where: { request_id },
    });
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.status !== "negotiating") {
      throw new Error("Request is not in negotiation stage");
    }

    // check user is part of this request
    if (request.farmer_id !== userId && request.company_id !== userId) {
      throw new Error("Unauthorized");
    }

    // check last offer wasn't made by same side
    const lastOffer = await prisma.negotiation.findFirst({
      where: { request_id },
      orderBy: { created_at: "desc" },
    });
    if (lastOffer && lastOffer.proposed_by === userRole) {
      throw new Error(
        "Wait for the other party to respond before sending another offer",
      );
    }

    const offer = await prisma.negotiation.create({
      data: {
        request_id,
        proposed_by: userRole === "farmer" ? "farmer" : "company",
        proposed_price,
        message,
      },
    });
    return offer;
  }

  async getNegotiationHistory(request_id: number, userId: number) {
    const request = await prisma.order_Request.findUnique({
      where: { request_id },
    });
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.farmer_id !== userId && request.company_id !== userId) {
      throw new Error("Unauthorized");
    }

    const negotiations = await prisma.negotiation.findMany({
      where: { request_id },
      orderBy: { created_at: "asc" },
    });
    return negotiations;
  }

  async finalizeNegotiation(
    request_id: number,
    userId: number,
    userRole: string,
  ) {
    const request = await prisma.order_Request.findUnique({
      where: { request_id },
    });
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.status !== "negotiating") {
      throw new Error("Request is not in negotiation stage");
    }
    if (request.farmer_id !== userId && request.company_id !== userId) {
      throw new Error("Unauthorized");
    }

    // only the side that did NOT make last offer can finalize
    const lastOffer = await prisma.negotiation.findFirst({
      where: { request_id },
      orderBy: { created_at: "desc" },
    });
    if (!lastOffer) {
      throw new Error("No offers made yet");
    }
    if (lastOffer.proposed_by === userRole) {
      throw new Error(
        "You cannot finalize your own offer, wait for other party to accept",
      );
    }

    // calculate delivery cost
    const farmer = await prisma.farmerProfile.findUnique({
      where: { farmer_id: request.farmer_id },
    });
    const company = await prisma.companyProfile.findUnique({
      where: { company_id: request.company_id },
    });

    const distanceKm = await calculateDistance(
      { lat: Number(farmer!.latitude), lng: Number(farmer!.longitude) },
      { lat: Number(company!.latitude), lng: Number(company!.longitude) },
    );

    const ratePerKm = 15; // you can move this to admin settings later
    const baseCharge = 200;
    const deliveryCost = baseCharge + distanceKm * ratePerKm;
    const platformCommission = Number(lastOffer.proposed_price) * 0.03; // 3%
    const totalAmount =
      Number(lastOffer.proposed_price) + deliveryCost + platformCommission;

    // create order + update request status in one transaction
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          request_id,
          farmer_id: request.farmer_id,
          company_id: request.company_id,
          final_price: lastOffer.proposed_price,
          quantity: request.requested_quantity,
          delivery_cost: deliveryCost,
          platform_commission: platformCommission,
          total_amount: totalAmount,
          status: "confirmed",
        },
      }),
      prisma.order_Request.update({
        where: { request_id },
        data: { status: "accepted" },
      }),
    ]);
    return order;
  }
}
export const negotiationServices = new NegotiationServices();
