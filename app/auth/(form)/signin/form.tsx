"use client";

import { SubmitEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Form, EmailInput, PasswordInput, Input } from "@/components/form";
import { SigninSchema }  from "@/lib/schema";


type FormError = {
  name?: string[],
  email?: string[],
  password?: string[],
  confirmPassword?: string[],
  message?: string,
};

export default function SigninForm() {
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl");
  const [errors, setErrors] = useState<FormError | null>(null);
  const [submit, setSubmit] = useState<boolean>(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmit(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const result = SigninSchema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setSubmit(false);
      return;
    }

    const response = await signIn("credentials", { ...result.data, redirect: false });
    const { error, status } = response!;
    if (status !== 200) {
      setErrors({ message: error! });
      setSubmit(false);
    } else {
      const url = callbackUrl ? decodeURIComponent(callbackUrl) : "/drive/my-drive";
      router.push(url);
    }
  }

  return (
    <>
      { errors?.message && <div className="text-red text-center border border-red py-2 mb-5">{`❗${errors.message}`}</div> }
      <Form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-3 font-poppins"
      >
        <Input
          id="id_name"
          name="name"
          labelText="Username"
          placeholder="Your username"
          errorText={errors?.name?.[0]}
        />
        <EmailInput errorText={errors?.email?.[0]} />
        <PasswordInput errorText={errors?.password?.[0]} />
        <PasswordInput
          labelText="Confirm Password"
          id="id_confirm_password"
          name="confirmPassword"
          errorText={errors?.confirmPassword?.[0]}
        />
        <button
          type="submit"
          disabled={submit}
          className="text-md text-base bg-mauve rounded-sm py-1.5 mt-5 cursor-pointer hover:bg-mauve/90 disabled:bg-surface0 disabled:text-subtext1"
        >
          { submit ? "Submitting..." : "Signin" }
        </button>
        <p className="text-md text-center">
          Already registered?
          <Link href="/auth/login" className="ml-1 text-blue hover:text-lavender">Login here</Link>
        </p>
      </Form>
    </>
  );
}
