import React from "react";

interface CompanyLayoutProps {
  children: React.ReactNode;
  params: {
    companyId: string;
  };
}

export default function CompanyLayout({ children, params }: CompanyLayoutProps) {
  return <>{children}</>;
}
