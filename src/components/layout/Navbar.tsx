import { Search, Bell, Menu } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      <div className="relative flex-1 max-w-md hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Quick search... (⌘K)" 
          className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-xl relative transition-all group">
          <Bell size={20} className="group-hover:text-indigo-500" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-none">Alex Rivera</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
        </div>
      </div>
    </header>
  );
}
