import React from "react";

export type PasswordProps = {
  id?: string,
  required?: boolean,
  name?: string,
  placeholder?: string,
  labelText?: string,
  errorText?: string,
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput({
  id = "id_password",
  required = true,
  name = "password",
  placeholder = "password",
  labelText = "Password",
  errorText,
  ...restProps
}: PasswordProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-md mb-1">{labelText}</label>
      <input
        type="password"
        id={id}
        required={required}
        placeholder={placeholder}
        name={name}
        className={`bg-inherit border-1 rounded-sm text-md p-1 ${errorText ? "border-red" : "border-overlay0"}`}
        {...restProps}
      />
      { errorText && <span className="text-red text-sm">{ errorText }</span> }
    </div>
  );
}
