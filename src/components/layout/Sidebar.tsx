import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../../server/models/types';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: any) => void;
  userRole: UserRole;
}

export function Sidebar({ activeView, onViewChange, userRole }: SidebarProps) {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER] 
    },
    { 
      id: 'inventory', 
      label: 'Inventory', 
      icon: <Package size={20} />, 
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER] 
    },
    { 
      id: 'pos', 
      label: 'Terminal', 
      icon: <ShoppingCart size={20} />, 
      roles: [UserRole.ADMIN, UserRole.CASHIER] 
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: <Users size={20} />, 
      roles: [UserRole.ADMIN] 
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 hidden lg:flex">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <div className="w-5 h-5 border-2 border-white rotate-45"></div>
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">SmartPOS</h1>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Enterprise</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">Main Menu</div>
        
        {menuItems.filter(item => item.roles.includes(userRole)).map(item => (
          <NavItem 
            key={item.id}
            active={activeView === item.id} 
            icon={item.icon} 
            label={item.label} 
            onClick={() => onViewChange(item.id)} 
          />
        ))}

        <div className="pt-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">System</div>
        {userRole === UserRole.ADMIN && (
          <NavItem icon={<ShieldCheck size={20} />} label="Security Logs" />
        )}
        <NavItem icon={<Settings size={20} />} label="General Settings" />
      </nav>

      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white overflow-hidden p-0.5">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole === UserRole.ADMIN ? 'Felix' : userRole === UserRole.MANAGER ? 'Aneka' : 'Toby'}`} 
              alt="avatar" 
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate uppercase tracking-tight">
              {userRole === UserRole.ADMIN ? 'Alex Rivera' : userRole === UserRole.MANAGER ? 'Manager View' : 'Cashier Unit'}
            </p>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{userRole}</p>
          </div>
        </div>
        <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-medium">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({ active, icon, label, onClick }: { active?: boolean, icon: ReactNode, label: string, onClick?: () => void, key?: any }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative
        ${active 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }
      `}
    >
      <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>{icon}</span>
      <span className="text-sm font-bold flex-1 text-left">{label}</span>
      {active ? (
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      ) : (
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />
      )}
    </button>
  );
}
