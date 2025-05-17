import React, { ReactNode } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function AddLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
