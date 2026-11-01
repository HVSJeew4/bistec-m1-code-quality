import { ChangeEvent, FocusEvent } from "react";

interface InputProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  label?: string;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required = false,
  label,
  onFocus,
  onBlur,
}: InputProps) {
  const id = label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined;

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required"> *</span>}
        </label>
      )}
      <input
        id={id}
        className={`input ${error ? "input-error" : ""}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className="input-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
