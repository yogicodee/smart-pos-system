import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions?limit=5')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setTransactions(json.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>)}
  </div>;

  if (transactions.length === 0) return (
    <div className="py-20 flex flex-col items-center justify-center text-slate-300 space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
        <ShoppingCart size={32} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono italic">No transaction data available</p>
    </div>
  );

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
            <th className="pb-3 px-2">ID</th>
            <th className="pb-3 px-2">Amount</th>
            <th className="pb-3 px-2">Items</th>
            <th className="pb-3 px-2">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {transactions.map((tx) => (
            <tr key={tx.id} className="text-sm group hover:bg-slate-50 transition-colors">
              <td className="py-4 px-2 font-mono text-xs text-slate-400">#{tx.id.substring(0, 8)}</td>
              <td className="py-4 px-2 font-bold text-slate-700">Rp {tx.totalAmount.toLocaleString()}</td>
              <td className="py-4 px-2 text-slate-500">{tx.items.length} items</td>
              <td className="py-4 px-2 text-slate-400 text-xs">
                {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
