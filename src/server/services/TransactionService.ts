import { TransactionRepository } from '../repositories/TransactionRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { Transaction, TransactionItem } from '../models/types';

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private productRepository: ProductRepository;
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.productRepository = new ProductRepository();
    this.auditLogRepository = new AuditLogRepository();
  }

  async processTransaction(data: { paidAmount: number; items: { productId: string; quantity: number }[] }, userId: string = 'SYSTEM') {
    const transactionId = Math.random().toString(36).substr(2, 9);
    const transactionItems: TransactionItem[] = [];
    let totalAmount = 0;

    // Phase 1: Logic & Validation
    for (const item of data.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      transactionItems.push({
        id: Math.random().toString(36).substr(2, 9),
        transactionId,
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });
    }

    if (data.paidAmount < totalAmount) {
      throw new Error(`Insufficient payment. Total is ${totalAmount}`);
    }

    // Phase 2: Action - Deduct Stock
    for (const item of transactionItems) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        await this.productRepository.update(item.productId, {
          stock: product.stock - item.quantity
        });
      }
    }

    // Phase 3: Persist Transaction
    const transaction: Transaction = {
      id: transactionId,
      totalAmount,
      paidAmount: data.paidAmount,
      changeAmount: data.paidAmount - totalAmount,
      items: transactionItems,
      createdAt: new Date()
    };

    const savedTransaction = await this.transactionRepository.create(transaction);

    // Audit Logging
    await this.auditLogRepository.create({
      userId,
      userName: userId === 'SYSTEM' ? 'Automated System' : `User ${userId}`,
      action: 'CREATE_TRANSACTION',
      module: 'POS_TERMINAL',
      details: `Sold ${transactionItems.length} items for Rp ${totalAmount.toLocaleString()}`
    });

    return savedTransaction;
  }

  async getAllTransactions(params: any) {
    return await this.transactionRepository.findAll(params);
  }
}
