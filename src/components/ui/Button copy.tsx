import React from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export const Button = ({ className, ...props }: ButtonProps) => {
	return (
		<button className={`btn-primary ${className}`} {...props}>
			{props.children}
		</button>
	);
};
