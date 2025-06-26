import React from "react";

export type CsrfProps = {
  name: string,
  csrfToken: string,
};

export default function CsrfInput({
  name,
  csrfToken,
}: CsrfProps) {
  return (
    <input
      type="hidden"
      name={name}
      defaultValue={csrfToken}
    />
  );
}
