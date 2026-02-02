import z from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full Name is required")
      .min(2, "Full Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    gender: z
      .string()
      .min(1, "Gender is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*()_+\-={};":|,.<>/?]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    birthDate: z
      .string()
      .optional()
      .refine((date) => !date || new Date(date) < new Date(), {
        message: "Birth date must be in the past",
      }),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must agree to the Terms and Conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });