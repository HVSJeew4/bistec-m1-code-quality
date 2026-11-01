import { useState, useRef, useEffect } from "react";

interface DropdownItem {
  value: string;
  label: string;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function Dropdown({
  items,
  value,
  onChange,
  placeholder = "Select...",
  label,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => item.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (itemValue: string) => {
    onChange?.(itemValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="dropdown" ref={ref}>
      {label && <span className="dropdown-label">{label}</span>}
      <div
        className={`dropdown-trigger ${isOpen ? "dropdown-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
      >
        {selectedItem ? selectedItem.label : placeholder}
      </div>
      {isOpen && (
        <ul className="dropdown-menu" role="listbox">
          {items.map((item) => (
            <li
              key={item.value}
              className={`dropdown-item ${item.value === value ? "dropdown-item-selected" : ""}`}
              onClick={() => handleSelect(item.value)}
              role="option"
              aria-selected={item.value === value}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
