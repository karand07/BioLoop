import z from "zod";
import { ListingStatus } from "../../generated/prisma/enums.js";

export const wasteCategorySchema = z.object({
  name: z.string().min(1, "Name Required"),
  description: z.string().optional(),

  min_ref_price: z.number("Min price must be a number").nonnegative(),

  max_ref_price: z.number("Max price must be a number").nonnegative(),

  unit: z.string().min(1, "Unit is required"),
});

export type wasteCategoryType = z.infer<typeof wasteCategorySchema>;

export const updateWasteCategorySchema = wasteCategorySchema.partial();

export type updateWasteCategoryType = z.infer<typeof updateWasteCategorySchema>;

export const wasteListingsSchema = z.object({
  quantity: z.coerce.number("Max price must be a number").nonnegative(),

  asking_price: z.coerce.number("Max price must be a number").nonnegative(),

  description: z.string().optional(),
  available_from: z.coerce.date(),
  category_id: z.coerce.number("Category ID must be a number").nonnegative(),
  status: z.enum(ListingStatus).default("active"),
  images: z.string(),
});

export type wasteListingsType = z.infer<typeof wasteListingsSchema>;
export const updateWasteListingSchema = wasteListingsSchema.partial();
export type updateWasteListingType = z.infer<typeof updateWasteListingSchema>;
