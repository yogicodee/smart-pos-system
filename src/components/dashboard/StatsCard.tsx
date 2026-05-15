import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className = '' }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 shadow-inner">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
          {trend && (
            <span className={`text-xs font-bold ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
