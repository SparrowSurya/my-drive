"use client";

import React, { useEffect, useRef } from "react";

export default function Modal({
	children,
	className,
	style,
	onClickOutside,
}: Readonly<{
	children: React.ReactNode,
	className?: string,
	style?: React.CSSProperties,
	divProps?: React.HTMLAttributes<HTMLDivElement>,
	onClickOutside: () => void,
}>) {
	const modalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (
				modalRef.current
				&& event.target instanceof Node
				&& !modalRef.current.contains(event.target)
			) {
				onClickOutside();
			}
		};
		document.addEventListener("mousedown", clickHandler);

		return () => document.removeEventListener("mousedown", clickHandler);
	}, [onClickOutside]);

	return (
		<div className={className} style={style} ref={modalRef}>
			{children}
		</div>
	);
}
