"use client";

import useContentView from "@/hooks/useContentView";
import Icon from "./icon";
import { faBars, faThLarge } from "@fortawesome/free-solid-svg-icons";

export type ContentViewToggleButtonProps = {
  visible?: boolean,
};

export default function ContentViewToggleButton({ visible = true }: Readonly<ContentViewToggleButtonProps>) {
  const { view, updateView } = useContentView();
  const gridView = view == 'grid';

  if (!visible) return null;

  return (
    <div className="inline-flex items-center rounded-full border shadow-sm overflow-hidden">
      <button
        className={`flex items-center justify-center transition px-3 gap-0 ${ gridView ? "" : "bg-surface1"}`}
        onClick={() => updateView('list')}
      >
        <Icon icon={faBars} />
      </button>
      <button
        className={`flex items-center justify-center transition px-3 gap-0 border-l ${ gridView ? "bg-surface1" : ""}`}
        onClick={() => updateView('grid')}
      >
        <Icon icon={faThLarge} />
      </button>
    </div>
  );
}