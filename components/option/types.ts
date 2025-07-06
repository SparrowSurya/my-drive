import React from "react";

export type Option = {
  leading?: React.ReactNode,
  label: string,
  trailing?: string | React.ReactNode,
  props?: React.HTMLAttributes<HTMLDivElement>,
};
