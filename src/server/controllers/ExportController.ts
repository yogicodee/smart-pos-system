import { Request, Response } from 'express';
import { ExportService } from '../services/ExportService';

export class ExportController {
  private exportService = new ExportService();

  async productsExcel(req: Request, res: Response) {
    try {
      const { search, categoryId } = req.query;
      const workbook = await this.exportService.exportProductsToExcel({
        search: search as string,
        categoryId: categoryId as string
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=products.xlsx'
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Failed to export products to Excel' });
    }
  }

  async productsPdf(req: Request, res: Response) {
    try {
      const { search, categoryId } = req.query;
      const doc = await this.exportService.exportProductsToPDF({
        search: search as string,
        categoryId: categoryId as string
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=products.pdf');

      doc.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Failed to export products to PDF' });
    }
  }

  async transactionsExcel(req: Request, res: Response) {
    try {
      const workbook = await this.exportService.exportTransactionsToExcel({});

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=transactions.xlsx'
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Failed to export transactions to Excel' });
    }
  }

  async transactionsPdf(req: Request, res: Response) {
    try {
      const doc = await this.exportService.exportTransactionsToPDF();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');

      doc.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Failed to export transactions to PDF' });
    }
  }
}
