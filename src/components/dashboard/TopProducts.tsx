import { Package, TrendingUp } from 'lucide-react';

const products = [
  { name: 'Smartphone X', sales: 45, revenue: 'Rp 225M', color: 'bg-blue-100 text-blue-600' },
  { name: 'Coffee Beans', sales: 32, revenue: 'Rp 2.4M', color: 'bg-amber-100 text-amber-600' },
  { name: 'Wireless Earbuds', sales: 28, revenue: 'Rp 14M', color: 'bg-indigo-100 text-indigo-600' }
];

export function TopProducts({ products = [] }: { products?: any[] }) {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-amber-100 text-amber-600',
    'bg-indigo-100 text-indigo-600',
    'bg-emerald-100 text-emerald-600',
    'bg-purple-100 text-purple-600'
  ];

  if (products.length === 0) return (
    <div className="py-12 text-center text-slate-300 font-mono text-[10px] uppercase tracking-widest italic">
      Waiting for first sales...
    </div>
  );

  return (
    <div className="space-y-4 mt-4">
      {products.map((p, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[i % colors.length]}`}>
              <Package size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{p.name}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{p.quantity} Sales</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-700">Rp {p.revenue.toLocaleString()}</p>
            <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-500 font-bold uppercase">
              <TrendingUp size={10} /> Profitable
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

