import { useState, ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Alert({
  children,
  variant = "info",
  dismissible = false,
  onDismiss,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`alert alert-${variant}`}>
      <div className="alert-content">{children}</div>
      {dismissible && (
        <button
          className="alert-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          &times;
        </button>
      )}
    </div>
  );
}
