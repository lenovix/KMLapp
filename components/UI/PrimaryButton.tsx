import { ReactNode, MouseEventHandler } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  className?: string;

  icon?: ReactNode;
  iconPosition?: "left" | "right";
  variant?: "primary" | "link" | "outline";
  size?: "sm" | "md" | "lg";

  // tambahan baru
  align?: "left" | "center" | "right";
  fullWidth?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  gap?: string; // contoh "gap-1", "gap-2"
  disabled?: boolean;
}

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
  icon,
  iconPosition = "left",
  variant = "primary",
  size = "md",

  align = "center",
  fullWidth = false,
  rounded = "md",
  gap = "gap-1",
  disabled = false,
}: PrimaryButtonProps) {
  const base = `
    inline-flex items-center
    ${gap}
    transition
    ${fullWidth ? "w-full justify-center" : ""}
    ${align === "left" ? "justify-start" : ""}
    ${align === "center" ? "justify-center" : ""}
    ${align === "right" ? "justify-end" : ""}
    ${rounded === "none" ? "rounded-none" : ""}
    ${rounded === "sm" ? "rounded-sm" : ""}
    ${rounded === "md" ? "rounded" : ""}
    ${rounded === "lg" ? "rounded-lg" : ""}
    ${rounded === "xl" ? "rounded-xl" : ""}
    ${rounded === "full" ? "rounded-full" : ""}
  `;

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    link: "text-blue-300 hover:underline",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
