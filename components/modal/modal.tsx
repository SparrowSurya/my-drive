"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
	children: React.ReactNode,
	onClickOutside?: () => void,
	portal?: string,
} & React.HTMLAttributes<HTMLDivElement>;

export default function Modal({
	children,
	className,
	onClickOutside,
	portal,
	...restProps
}: Readonly<ModalProps>) {
	const modalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (
				modalRef.current
				&& event.target instanceof Node
				&& !modalRef.current.contains(event.target)
				&& onClickOutside
			) {
				onClickOutside();
			}
		};
		document.addEventListener("mousedown", clickHandler);

		return () => document.removeEventListener("mousedown", clickHandler);
	}, [onClickOutside]);

	const modal = (
		<div ref={modalRef} className={`modal ${className ?? ""}`} {...restProps}>
			{children}
		</div>
	);

	if (!!portal) {
		return createPortal(modal, document.getElementById(portal)!);
	}
	return modal;
}
