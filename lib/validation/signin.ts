import { z } from "zod";

const password = z.string().min(3, "password should contain atleast 3 characters");

const SigninSchema = z.object({
  email: z.string().email(),
  password,
  confirmPassword: password,
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "passwords do not match",
});

export default SigninSchema;
