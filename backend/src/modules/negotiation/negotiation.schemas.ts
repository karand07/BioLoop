import z from "zod";
import { ProposedBy } from "../../generated/prisma/enums.js";

export const negotiationSchema = z.object({
  request_id: z.number(),
  proposedBy: z.enum(ProposedBy),
  proposed_price: z.number("proposed price must be number").nonnegative(),
  message: z.string().optional(),
});

export type negotiationTypes = z.infer<typeof negotiationSchema>;
