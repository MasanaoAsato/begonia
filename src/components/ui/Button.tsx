import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
	return (
		<button className={`btn-primary ${className}`} {...props}>
			{children}
		</button>
	);
};
