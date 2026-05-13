import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { UserRole } from '../../server/models/types';

interface LayoutProps {
  children: ReactNode;
  activeView: any;
  onViewChange: (view: any) => void;
  userRole: UserRole;
}

export function Layout({ children, activeView, onViewChange, userRole }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar activeView={activeView} onViewChange={onViewChange} userRole={userRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-8 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
