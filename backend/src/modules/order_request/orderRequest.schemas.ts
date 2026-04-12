import z from "zod";
import { RequestStatus } from "../../generated/prisma/enums.js";

export const requestShema = z.object({
  listing_id: z.number("request_id required"),
  requested_quantity: z.number("quantity must be a number").nonnegative(),
  offered_price: z.number("offered price must be a number").nonnegative(),
  message: z.string().optional(),
  status: z.enum(RequestStatus).default("pending"),
  is_active: z.boolean().default(true),
});

export type requestTypes = z.infer<typeof requestShema>;

export const updateRequestSchema = requestShema.partial();
export type updateRequestTypes = z.infer<typeof updateRequestSchema>;
