import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
}

const Button: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
  const className = variant ? `btn-${variant}` : "btn-default";

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
