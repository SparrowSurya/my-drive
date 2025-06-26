import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3, "password should contains atleast 3 characters"),
});

export default LoginSchema;
