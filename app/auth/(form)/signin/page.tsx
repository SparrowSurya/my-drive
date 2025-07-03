import { Metadata } from "next";
import SigninForm from "./form";


export const metadata: Metadata = {
  title: "Drive: LogIn",
};

export default function SigninPage() {
  return (
    <>
      <h2 className="font-bold text-2xl text-center mb-5">Signin with Credentials</h2>
      <SigninForm />
    </>
  );
}
