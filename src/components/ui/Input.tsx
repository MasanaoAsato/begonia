import React from "react";

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "children">;

export const Input = ({ className, ...props }: InputProps) => {
	return <input className={`input-primary ${className ?? ""}`} {...props} />;
};
