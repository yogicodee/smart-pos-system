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

export function DashboardView({ userRole }: DashboardViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">System Dashboard</h2>
        <p className="text-slate-500 mt-1 font-medium">
          Welcome back, {userRole === UserRole.ADMIN ? 'Alex' : 'Staff'}. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Products" 
          value="128" 
          icon={<Package />} 
          trend={{ value: '12%', isPositive: true }} 
        />
        <StatsCard 
          title="Daily Sales" 
          value="Rp 12.4M" 
          icon={<ShoppingCart />} 
          trend={{ value: '8%', isPositive: true }} 
        />
        <StatsCard 
          title="New Customers" 
          value="24" 
          icon={<TrendingUp />} 
          trend={{ value: '3%', isPositive: false }} 
        />
        <StatsCard 
          title="Low Stock Items" 
          value="7" 
          icon={<AlertCircle />} 
          className="bg-rose-50 border-rose-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Sales Performance</h3>
            <select className="bg-slate-50 border-none text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </CardHeader>
          <CardBody>
            <SalesAnalytics />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Top Selling</h3>
          </CardHeader>
          <CardBody>
            <TopProducts />
            <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">
              View All Products
            </button>
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
                  className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-all uppercase tracking-widest"
                >
                  PDF
                </a>
                <a 
                  href="/api/export/transactions/excel" 
                  target="_blank"
                  className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-all uppercase tracking-widest"
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
