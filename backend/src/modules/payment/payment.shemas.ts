import z from "zod";

// createPaymentSchema
export const createPaymentSchema = z.object({
  order_id: z.number(),
});

// verifyPaymentSchema
export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export type verifyPaymentType = z.infer<typeof verifyPaymentSchema>;
