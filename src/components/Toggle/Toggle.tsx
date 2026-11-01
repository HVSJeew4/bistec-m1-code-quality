import { useState } from "react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({
  checked: controlledChecked,
  onChange,
  label,
  disabled = false,
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleClick = () => {
    if (disabled) return;
    setInternalChecked(!isChecked);
  };

  return (
    <label className={`toggle ${disabled ? "toggle-disabled" : ""}`}>
      <div
        className={`toggle-track ${isChecked ? "toggle-checked" : ""}`}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        role="switch"
        aria-checked={isChecked}
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="toggle-thumb" />
      </div>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
}
