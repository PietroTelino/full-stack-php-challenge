import React from "react";
import "./page-container.css";

export default function PageContainer({
  children,
  maxWidth = 980,
}: {
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <div className="page">
      <div className="page__content" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
