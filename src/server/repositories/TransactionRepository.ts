import { Transaction } from '../models/types';
import { transactions } from '../database/db';

export class TransactionRepository {
  async create(data: Transaction): Promise<Transaction> {
    transactions.push(data);
    return data;
  }

  async findAll(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = params;
    const total = transactions.length;
    const sorted = [...transactions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const from = (page - 1) * limit;
    const to = from + limit;
    
    return {
      data: sorted.slice(from, to),
      total,
      currentPage: page,
      lastPage: Math.ceil(total / limit)
    };
  }
}
