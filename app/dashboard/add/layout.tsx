import { ReactNode } from 'react';

interface AddLayoutProps {
  children: ReactNode;
}

export default function AddLayout({ children }: AddLayoutProps) {
  return children;
}
