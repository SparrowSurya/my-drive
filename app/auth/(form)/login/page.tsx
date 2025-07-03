import { Metadata } from "next";
import LoginForm from "./form";


export const metadata: Metadata = {
  title: "Drive: Login"
};

export default function LoginPage() {
  return (
    <>
      <h2 className="font-bold text-2xl text-center mb-5">Login with Credentials</h2>
      <LoginForm />
    </>
  );
}
