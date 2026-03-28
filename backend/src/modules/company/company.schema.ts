import z from "zod";

export const companySchema = z.object({
  company_name: z.string().min(1, "Farm name is required"),
  business_type: z.string().min(1, "Business type is required"),
  address: z.string().min(1, "Farm address is required"),
  latitude: z
    .number()
    .min(-90, "Latitude must be >= -90")
    .max(90, "Latitude must be <= 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be >= -180")
    .max(180, "Longitude must be <= 180"),
  gst_number: z
    .string()
    .length(15, "Enter Valid GST number")
    .optional()
    .or(z.literal("")),
});

export const createCompanySchema = companySchema;

export type createCompanyType = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = companySchema.partial();

export type updateCompanyType = z.infer<typeof updateCompanySchema>;
