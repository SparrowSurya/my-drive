"use client";

import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { faMagnifyingGlass, faXmark, faSliders } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import { Input } from "@/components/form";
import usePageView from "@/hooks/usePageView";
import { PageView } from "@/contexts/pageView";


export type ContentSearchInputProps = React.HTMLAttributes<HTMLFormElement>;

export default function ContentSearchInput(props: Readonly<ContentSearchInputProps>) {
  const fieldName = "query";
  const formRef = useRef<HTMLFormElement| null>(null);
  const router = useRouter()
  const searchParams = useSearchParams();
  const page = usePageView();
  const query = page === PageView.search ? (searchParams.get('q') ?? "") : "";
  const [value, setValue] = useState(query);

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const query = data.get(fieldName)?.toString() || "";
    const params = new URLSearchParams({ q: query });
    const url = `/drive/search?${params.toString()}`;
    router.push(url);
  };

  return (
    <form {...props} ref={formRef} onSubmit={onSubmit}>
      <div className="flex flex-row items-center bg-surface0 gap-3 p-2 rounded-4xl">
        <Icon icon={faMagnifyingGlass} hover onClick={() => formRef.current?.requestSubmit()} />
        <Input
          id="id_search"
          name={fieldName}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search in Drive"
          className="text-lg focus:outline-none caret-rosewater font-poppins border-none"
          autoComplete="off"
        />
        {value !== "" && <Icon icon={faXmark} hover onClick={() => setValue("")} />}
        <Icon icon={faSliders} hover />
      </div>
    </form>
  );
}
