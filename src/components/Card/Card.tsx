import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  image?: string;
  actions?: ReactNode;
  className?: string;
}

export function Card({
  title,
  children,
  image,
  actions,
  className = "",
}: CardProps) {
  return (
    <div className={`card ${className}`.trim()}>
      {image && <img className="card-image" src={image} alt={title || ""} />}
      {title && (
        <div className="card-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="card-body">{children}</div>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
}
