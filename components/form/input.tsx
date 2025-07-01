import React from "react";

export type InputProps = {
  id: string,
  required?: boolean,
  name: string,
  placeholder?: string,
  labelText?: string,
  errorText?: string,
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  id,
  required = true,
  name,
  placeholder,
  labelText,
  errorText,
  ...restProps
}: InputProps) {
  return (
    <div className="flex flex-col">
      {
        labelText && (
          <label
            htmlFor={id}
            className="text-md mb-1"
          >{labelText}</label>
        )
      }
      <input
        type="text"
        id={id}
        required={required}
        placeholder={placeholder}
        name={name}
        className={`bg-inherit border-1 rounded-sm text-md p-1 ${errorText ? "border-red" : "border-overlay0"}`}
        {...restProps}
      />
      { errorText && <span className="text-red text-sm mt-1 ml-2">{ errorText }</span> }
    </div>
  );
}
