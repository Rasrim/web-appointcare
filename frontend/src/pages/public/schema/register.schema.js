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
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits")
      .regex(/^9[87]\d{8}$/, "Phone must start with 9, second digit 8 or 7, then 8 more digits (e.g., 9869294659)"),
    gender: z
      .string()
      .min(1, "Gender is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(
        /[!@#$%^&*()_+\-={};":|,.<>/?]/,
        "Must contain at least one special character"
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