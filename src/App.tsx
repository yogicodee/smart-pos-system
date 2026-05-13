import { useState, useEffect } from 'react';
import { Search, Trash2, Edit, ShoppingCart, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './components/dashboard/DashboardView';
import { Card, CardHeader, CardBody } from './components/ui/Card';
import { UserRole } from './server/models/types';

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  category?: { name: string };
  description: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'dashboard' | 'inventory' | 'pos' | 'users'>('dashboard');
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${searchTerm}`);
      const json = await res.json();
      if (json.status === 'success') {
        setProducts(json.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    if (view !== 'pos') setView('pos');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Role': userRole
        },
        body: JSON.stringify({
          paidAmount,
          items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity }))
        })
      });
      const json = await res.json();
      if (json.status === 'success') {
        alert('Transaction Success!');
        setCart([]);
        setPaidAmount(0);
        fetchProducts();
        setView('dashboard');
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalCart = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const canAccess = (requiredRoles: UserRole[]) => requiredRoles.includes(userRole);

  return (
    <Layout activeView={view} onViewChange={setView} userRole={userRole}>
      {/* RBAC Emulator Toolbar */}
      <div className="mb-8 p-4 bg-indigo-50/50 backdrop-blur-sm rounded-2xl border-2 border-indigo-100/50 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ShieldAlert size={80} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <ShieldAlert size={16} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900 block leading-tight">RBAC Emulator</span>
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Select view profile for demo</span>
          </div>
        </div>
        <div className="flex bg-white/50 p-1 rounded-xl border border-indigo-100 gap-1 overflow-x-auto max-w-full">
          {Object.values(UserRole).map(role => (
            <button 
              key={role}
              onClick={() => {
                setUserRole(role);
                setView('dashboard');
              }}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${userRole === role ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-indigo-400 hover:text-indigo-600 hover:bg-white'}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {view === 'dashboard' && <DashboardView userRole={userRole} />}
      
      {view === 'inventory' && (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Inventory</h2>
                <p className="text-slate-500 mt-1 font-medium">Manage your product catalog and stock levels.</p>
              </div>
              
              {canAccess([UserRole.ADMIN, UserRole.MANAGER]) && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                    <a 
                      href="/api/export/products/pdf" 
                      target="_blank"
                      className="px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest border-r border-slate-100"
                    >
                      PDF
                    </a>
                    <a 
                      href="/api/export/products/excel" 
                      target="_blank"
                      className="px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-all uppercase tracking-widest"
                    >
                      Excel
                    </a>
                  </div>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all">
                    Add New Product
                  </button>
                </div>
              )}
            </div>

          <Card>
            <CardHeader>
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter inventory..." 
                  className="w-full bg-slate-50 border-none rounded-xl py-2 pl-12 pr-4 text-xs focus:ring-2 focus:ring-indigo-100 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <th className="px-8 py-5">Product Details</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5 text-right">Price</th>
                    <th className="px-8 py-5">Stock Level</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-8 py-6 h-16"></td>
                      </tr>
                    ))
                  ) : products.map((product) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={product.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1 font-medium italic truncate max-w-[200px]">{product.description}</div>
                      </td>
                      <td className="px-8 py-6 uppercase">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right font-mono font-bold text-slate-700">
                        Rp {product.price.toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${product.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${Math.min(product.stock, 100)}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-bold ${product.stock < 10 ? 'text-rose-500' : 'text-slate-500'}`}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {view === 'pos' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">POS Terminal</h2>
                <p className="text-slate-500 mt-1 font-medium">Capture transaction data in real-time.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">
                  Favorites
                </button>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30">
                    <Search size={14} />
                  </span>
                  <input type="text" placeholder="FILTER_PRODUCTS..." className="pl-8 pr-4 py-2 border-none bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-indigo-100" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(p => (
                <Card 
                  key={p.id} 
                  className="hover:scale-[1.02] cursor-pointer group transition-all"
                >
                  <CardBody className="p-5 flex flex-col justify-between h-40" onClick={() => addToCart(p)}>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{p.category?.name || 'GENERIC'}</div>
                      <h4 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mt-1">{p.name}</h4>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-slate-50">
                      <span className="text-sm font-mono font-black text-slate-900">Rp {p.price.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase">STOCK: {p.stock}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-8 h-full">
            <Card className="sticky top-28 h-[calc(100vh-160px)] flex flex-col border-2 border-indigo-100 shadow-2xl shadow-indigo-100">
              <CardHeader className="bg-indigo-600 text-white border-none py-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} />
                  <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Active Session</h3>
                </div>
                <button 
                  onClick={() => setCart([])}
                  className="text-[9px] font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded hover:bg-white/30"
                >
                  Clear All
                </button>
              </CardHeader>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                      <ShoppingCart size={32} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono italic">EMPTY_CART_PENDING_INPUT</p>
                  </div>
                ) : cart.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="flex justify-between items-start pb-4 border-b border-slate-50 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900 uppercase">{item.product.name}</p>
                      <p className="text-[10px] font-medium text-slate-400 font-mono">
                        {item.quantity} units @ {item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                        <p className="text-xs font-mono font-black text-indigo-600">
                          Rp {(item.quantity * item.product.price).toLocaleString()}
                        </p>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[9px] font-bold text-rose-400 hover:text-rose-600 uppercase tracking-tighter"
                        >
                          Revoke
                        </button>
                      </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-5 rounded-b-2xl">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>Rp {totalCart.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-3">
                    <span>Total Bill</span>
                    <span>Rp {totalCart.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Amount Tendered</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-500">Rp</span>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-10 pr-4 text-lg font-black focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                      value={paidAmount || ''}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                    />
                  </div>
                </div>

                {paidAmount >= totalCart && totalCart > 0 && (
                  <div className="bg-emerald-50 p-4 rounded-xl flex justify-between items-center text-emerald-700 animate-in fade-in slide-in-from-top-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Tender Change</span>
                    <span className="text-lg font-black font-mono">Rp {(paidAmount - totalCart).toLocaleString()}</span>
                  </div>
                )}

                <button 
                  onClick={checkout}
                  disabled={cart.length === 0 || paidAmount < totalCart}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-20 disabled:scale-100 disabled:shadow-none"
                >
                  Confirm & Print Receipt
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
}


