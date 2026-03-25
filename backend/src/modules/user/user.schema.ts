import z from "zod";

export const userSchema = z.object({
  email: z.email("Enter Valid Email"),
  password: z
    .string()
    .min(4, "Minimum 4 character")
    .max(15, "password is to long"),
  role: z.enum(["farmer", "company", "admin", "logistics"]),
  phone: z
    .string()
    .length(10, "enter valid mobile no.")
    .regex(/^[0-9]+$/, "phone must contain only digits"),
});

export type userInputType = z.infer<typeof userSchema>;

export const registerSchema = userSchema.pick({
  email: true,
  password: true,
  role: true,
  phone: true,
});

export type registerType = z.infer<typeof registerSchema>;

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export type loginType = z.infer<typeof loginSchema>;
