"use client";

import React, { useEffect, useRef } from "react";

export type ModalProps = {
	children: React.ReactNode,
	onClickOutside?: () => void,
} & React.HTMLAttributes<HTMLDivElement>;

export default function Modal({
	children,
	className,
	onClickOutside,
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

	return (
		<div ref={modalRef} className={`modal ${className}`} {...restProps}>
			{children}
		</div>
	);
}
