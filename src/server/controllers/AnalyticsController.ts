import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
    async getStats(req: Request, res: Response) {
        try {
            const stats = await analyticsService.getDashboardStats();
            const chartData = await analyticsService.getSalesChartData();
            const topProducts = await analyticsService.getTopSellingProducts();

            return res.status(200).json({
                status: 'success',
                data: {
                    stats,
                    chartData,
                    topProducts
                }
            });
        } catch (error: any) {
            console.error('Analytics Error:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to fetch analytics data'
            });
        }
    }
}
