import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export function Card({ children, className = '', title, icon, badge }: CardProps) {
  return (
    <div className={`bg-card border border-border rounded-lg p-6 shadow-sm ${className}`}>
      {(title || icon || badge) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary">{icon}</div>}
            {title && <h3 className="text-lg text-card-foreground">{title}</h3>}
          </div>
          {badge && badge}
        </div>
      )}
      {children}
    </div>
  );
}
