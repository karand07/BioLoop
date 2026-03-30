import z from "zod";
// import { ListingStatus } from "../../generated/prisma/enums.js";

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

// export const wasteListingsSchema = z.object({
//     quantity : z
//     .number("Max price must be a number")
//     .nonnegative(),

//     asking_price : z
//     .number("Max price must be a number")
//     .nonnegative(),

//     description: z.string().optional(),
//     images : z.string(),
//     available_from:z.date(),
//     status:z.enum(ListingStatus)
// })

// export type wasteListingsType = z.infer<typeof wasteListingsSchema>;
