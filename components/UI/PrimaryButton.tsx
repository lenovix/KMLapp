import { ReactNode, MouseEventHandler } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  className?: string;
  icon?: ReactNode; // 👉 icon element
  iconPosition?: "left" | "right"; // 👉 posisi icon
}

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
  icon,
  iconPosition = "left",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 ${className}`}
    >
      {/* ICON LEFT */}
      {icon && iconPosition === "left" && <span>{icon}</span>}

      {/* TEXT */}
      <span>{children}</span>

      {/* ICON RIGHT */}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}
