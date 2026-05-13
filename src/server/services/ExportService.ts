import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { ProductRepository } from '../repositories/ProductRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { ProductWithCategory, Transaction } from '../models/types';

export class ExportService {
  private productRepo = new ProductRepository();
  private transactionRepo = new TransactionRepository();

  async exportProductsToExcel(filters: { search?: string; categoryId?: string }) {
    const { data: products } = await this.productRepo.findAll({ ...filters, limit: 1000 });
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    products.forEach(p => {
      worksheet.addRow({
        id: p.id,
        name: p.name,
        category: p.category?.name || 'N/A',
        price: p.price,
        stock: p.stock,
        createdAt: p.createdAt.toISOString()
      });
    });

    // Summary at the bottom
    worksheet.addRow({});
    worksheet.addRow({ name: 'TOTAL PRODUCTS', price: products.length });

    // Basic styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEFEFEF' }
    };

    return workbook;
  }

  async exportProductsToPDF(filters: { search?: string; categoryId?: string }) {
    const { data: products } = await this.productRepo.findAll({ ...filters, limit: 1000 });
    const doc = new PDFDocument({ margin: 50 });

    // Header
    doc.fontSize(20).text('Smart POS - Product Catalog', { align: 'center' });
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown();

    // Summary Section
    doc.fontSize(12).font('Helvetica-Bold').text('Inventory Summary');
    doc.fontSize(10).font('Helvetica').text(`Total Varieties: ${products.length}`);
    doc.text(`Low Stock Items: ${products.filter(p => p.stock < 10).length}`);
    doc.moveDown();

    // Table Header
    const tableTop = 180;
    const col1 = 50;
    const col2 = 150;
    const col3 = 300;
    const col4 = 400;
    const col5 = 480;

    doc.font('Helvetica-Bold');
    doc.text('Name', col1, tableTop);
    doc.text('Category', col2, tableTop);
    doc.text('Stock', col3, tableTop);
    doc.text('Price', col4, tableTop);
    doc.text('Value', col5, tableTop);
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table Rows
    let rowPos = tableTop + 25;
    doc.font('Helvetica');
    
    products.forEach(p => {
      if (rowPos > 700) { doc.addPage(); rowPos = 50; }
      
      doc.text(p.name, col1, rowPos, { width: 90 });
      doc.text(p.category?.name || 'N/A', col2, rowPos);
      doc.text(p.stock.toString(), col3, rowPos);
      doc.text(`Rp ${p.price.toLocaleString()}`, col4, rowPos);
      doc.text(`Rp ${(p.stock * p.price).toLocaleString()}`, col5, rowPos);
      
      rowPos += 20;
    });

    doc.end();
    return doc;
  }

  async exportTransactionsToExcel(filters: { from?: string; to?: string }) {
    // In a real app, we'd add filters to TransactionRepository
    const { data: transactions } = await this.transactionRepo.findAll({ limit: 1000 });
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 25 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Items', key: 'items', width: 10 },
      { header: 'Date', key: 'date', width: 25 },
    ];

    let totalRevenue = 0;
    transactions.forEach(t => {
      totalRevenue += t.totalAmount;
      worksheet.addRow({
        id: t.id,
        amount: t.totalAmount,
        items: t.items.length,
        date: t.createdAt.toISOString()
      });
    });

    worksheet.addRow({});
    worksheet.addRow({ id: 'TOTAL TRANSACTIONS', amount: transactions.length });
    worksheet.addRow({ id: 'TOTAL REVENUE', amount: totalRevenue });

    worksheet.getRow(1).font = { bold: true };
    return workbook;
  }

  async exportTransactionsToPDF() {
    const { data: transactions } = await this.transactionRepo.findAll({ limit: 1000 });
    const doc = new PDFDocument({ margin: 50 });

    doc.fontSize(20).text('Smart POS - Transaction Report', { align: 'center' });
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown();

    const totalRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
    doc.fontSize(12).font('Helvetica-Bold').text('Financial Summary');
    doc.fontSize(10).font('Helvetica').text(`Total Revenue: Rp ${totalRevenue.toLocaleString()}`);
    doc.text(`Volume: ${transactions.length} sales`);
    doc.moveDown();

    const tableTop = 180;
    doc.font('Helvetica-Bold');
    doc.text('Transaction ID', 50, tableTop);
    doc.text('Date', 200, tableTop);
    doc.text('Items', 350, tableTop);
    doc.text('Total Amount', 450, tableTop);
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let rowPos = tableTop + 25;
    doc.font('Helvetica');
    
    transactions.forEach(t => {
      if (rowPos > 700) { doc.addPage(); rowPos = 50; }
      
      doc.text(t.id.substring(0, 12) + '...', 50, rowPos);
      doc.text(t.createdAt.toLocaleString(), 200, rowPos);
      doc.text(t.items.length.toString(), 350, rowPos);
      doc.text(`Rp ${t.totalAmount.toLocaleString()}`, 450, rowPos);
      
      rowPos += 20;
    });

    doc.end();
    return doc;
  }
}
