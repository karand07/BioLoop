import z from "zod";

export const farmSchema = z.object({
  farm_name: z.string().min(1, "Farm name is required"),
  farm_address: z.string().min(1, "Farm address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),

  latitude: z
    .number()
    .min(-90, "Latitude must be >= -90")
    .max(90, "Latitude must be <= 90"),

  longitude: z
    .number()
    .min(-180, "Longitude must be >= -180")
    .max(180, "Longitude must be <= 180"),

  land_size_acres: z.number().positive("Land size must be positive"),
});

export const createFarmSchema = farmSchema;

export type createFarmerType = z.infer<typeof createFarmSchema>;

export const updateFarmSchema = farmSchema.partial();

export type updateFarmerType = z.infer<typeof updateFarmSchema>;
