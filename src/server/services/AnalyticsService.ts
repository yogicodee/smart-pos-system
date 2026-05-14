import { TransactionRepository } from '../repositories/TransactionRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';

export interface DashboardStats {
    totalRevenue: number;
    totalTransactions: number;
    totalProducts: number;
    lowStockProducts: number;
    salesGrowth: number; // percentage
}

export interface ChartData {
    name: string;
    total: number;
}

export class AnalyticsService {
    private transactionRepo = new TransactionRepository();
    private productRepo = new ProductRepository();

    async getDashboardStats(): Promise<DashboardStats> {
        const { data: transactions } = await this.transactionRepo.findAll({ limit: 1000 });
        const { data: products } = await this.productRepo.findAll({ limit: 1000 });

        const totalRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
        const lowStockProducts = products.filter(p => p.stock < 10).length;

        // Simple growth calculation demo (comparing with a static baseline for this mock)
        const salesGrowth = transactions.length > 0 ? 12.5 : 0;

        return {
            totalRevenue,
            totalTransactions: transactions.length,
            totalProducts: products.length,
            lowStockProducts,
            salesGrowth
        };
    }

    async getSalesChartData(): Promise<ChartData[]> {
        const { data: transactions } = await this.transactionRepo.findAll({ limit: 1000 });

        // Group by day for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dailyTotal = transactions
                .filter(t => t.createdAt.toISOString().split('T')[0] === date)
                .reduce((acc, t) => acc + t.totalAmount, 0);

            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            return {
                name: dayName,
                total: dailyTotal
            };
        });
    }

    async getTopSellingProducts() {
        const { data: transactions } = await this.transactionRepo.findAll({ limit: 1000 });
        const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

        transactions.forEach(t => {
            t.items.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].revenue += item.subtotal;
            });
        });

        return Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }
}
