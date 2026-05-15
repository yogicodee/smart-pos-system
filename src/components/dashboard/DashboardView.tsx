import { motion } from 'motion/react';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { SalesAnalytics } from './SalesAnalytics';
import { RecentTransactions } from './RecentTransactions';
import { TopProducts } from './TopProducts';

import { UserRole } from '../../server/models/types';

interface DashboardViewProps {
  userRole: UserRole;
}

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { SalesAnalytics } from './SalesAnalytics';
import { RecentTransactions } from './RecentTransactions';
import { TopProducts } from './TopProducts';

import { UserRole } from '../../server/models/types';

interface DashboardViewProps {
  userRole: UserRole;
}

export function DashboardView({ userRole }: DashboardViewProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics', {
        headers: { 'X-User-Role': userRole }
      });
      const json = await res.json();
      if (json.status === 'success') {
        setData(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [userRole]);

  const stats = data?.stats || {
    totalRevenue: 0,
    totalTransactions: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    salesGrowth: 0
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">System Dashboard</h2>
          <p className="text-slate-500 mt-1 font-medium">
            Welcome back, {userRole === UserRole.ADMIN ? 'Alex' : 'Staff'}. Here's what's happening today.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchAnalytics(); }}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Gross Revenue"
          value={`Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          icon={<TrendingUp />}
          trend={{ value: `${stats.salesGrowth}%`, isPositive: true }}
          className="border-indigo-100"
        />
        <StatsCard
          title="Daily Activity"
          value={stats.totalTransactions.toString()}
          icon={<ShoppingCart />}
          trend={{ value: 'Live', isPositive: true }}
        />
        <StatsCard
          title="Available SKU"
          value={stats.totalProducts.toString()}
          icon={<Package />}
          trend={{ value: 'Updated', isPositive: true }}
        />
        <StatsCard
          title="Low Stock Warning"
          value={stats.lowStockProducts.toString()}
          icon={<AlertCircle />}
          className={stats.lowStockProducts > 0 ? "bg-rose-50 border-rose-100" : ""}
          trend={stats.lowStockProducts > 0 ? { value: 'Critical', isPositive: false } : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Revenue Trend</h3>
            <div className="flex items-center gap-2 text-[10px] uppercase font-black text-indigo-600">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              Live Tracking
            </div>
          </CardHeader>
          <CardBody>
            <SalesAnalytics data={data?.chartData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Top Performance</h3>
          </CardHeader>
          <CardBody>
            <TopProducts products={data?.topProducts} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <h1 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Recent Activity</h1>
            {userRole !== UserRole.CASHIER && (
              <div className="flex gap-2">
                <a
                  href="/api/export/transactions/pdf"
                  target="_blank"
                  className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-all uppercase tracking-widest border border-indigo-100"
                >
                  PDF
                </a>
                <a
                  href="/api/export/transactions/excel"
                  target="_blank"
                  className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-all uppercase tracking-widest border border-emerald-100"
                >
                  EXCEL
                </a>
              </div>
            )}
          </CardHeader>
          <CardBody>
            <RecentTransactions />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

