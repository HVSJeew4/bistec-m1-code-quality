import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  loading = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${disabled ? "btn-disabled" : ""} ${className}`.trim()}
      onClick={onClick}
    >
      {loading ? <span className="btn-spinner">Loading...</span> : children}
    </button>
  );
}
