import z from "zod";
import { VehicleType } from "../../generated/prisma/enums.js";

export const logisticsSchema = z.object({
  vehicle_type: z.enum(VehicleType, "Invalid vechicle type"),
  vehicle_number: z
    .string()
    .regex(
      /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/,
      "Invalid vehicle number format",
    ),
  service_area: z.string().min(1, "Service area is required"),
});

export const createLogisticsSchema = logisticsSchema;

export type createLogisticsType = z.infer<typeof createLogisticsSchema>;

export const updateLogisticsSchema = logisticsSchema.partial();

export type updateLogisticsType = z.infer<typeof updateLogisticsSchema>;
