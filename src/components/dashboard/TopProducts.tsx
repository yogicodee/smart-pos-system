import { Package, TrendingUp } from 'lucide-react';

const products = [
  { name: 'Smartphone X', sales: 45, revenue: 'Rp 225M', color: 'bg-blue-100 text-blue-600' },
  { name: 'Coffee Beans', sales: 32, revenue: 'Rp 2.4M', color: 'bg-amber-100 text-amber-600' },
  { name: 'Wireless Earbuds', sales: 28, revenue: 'Rp 14M', color: 'bg-indigo-100 text-indigo-600' }
];

export function TopProducts() {
  return (
    <div className="space-y-4 mt-4">
      {products.map((p, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${p.color}`}>
              <Package size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{p.name}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{p.sales} Sales</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-700">{p.revenue}</p>
            <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-500 font-bold">
              <TrendingUp size={10} /> +12%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
