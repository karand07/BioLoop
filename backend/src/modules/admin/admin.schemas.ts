import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  unit: z.string(),
  min_ref_price: z.number().positive(),
  max_ref_price: z.number().positive(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const assignLogisticsSchema = z.object({
  logistics_id: z.number(),
});

export type createCategoryType = z.infer<typeof createCategorySchema>;
export type updateCategoryType = z.infer<typeof updateCategorySchema>;