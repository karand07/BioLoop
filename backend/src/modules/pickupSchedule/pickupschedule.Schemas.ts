import z from "zod";

export const proposeSlotsSchema = z.object({
  order_id: z.number(),
  proposed_slots: z.array(z.string()).min(2).max(3),
});

export const confirmSlotSchema = z.object({
  order_id: z.number(),
  confirmed_slot: z.string(),
});

export type proposeSlotsType = z.infer<typeof proposeSlotsSchema>;
export type confirmSlotType = z.infer<typeof confirmSlotSchema>;