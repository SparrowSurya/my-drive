import React from "react";
import CsrfInput from "./csrf";

export type FormProps = {
  children: React.ReactNode,
  csrfToken?: string,
} & React.FormHTMLAttributes<HTMLFormElement>;

export default function Form({
  children,
  csrfToken,
  ...restProps
}: FormProps) {
  return (
    <form {...restProps}>
      { csrfToken && <CsrfInput name="csrfToken" csrfToken={csrfToken} /> }
      { children }
    </form>
  );
}
