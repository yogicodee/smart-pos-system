import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { createTransactionSchema } from '../validations/TransactionValidation';

const transactionService = new TransactionService();

export class TransactionController {
  async index(req: Request, res: Response) {
    const { page, limit } = req.query;
    const transactions = await transactionService.getAllTransactions({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10
    });

    return res.status(200).json({
      status: 'success',
      data: transactions
    });
  }

  async store(req: Request, res: Response) {
    const validatedData = createTransactionSchema.parse(req.body);
    const transaction = await transactionService.processTransaction(validatedData);

    return res.status(201).json({
      status: 'success',
      message: 'Transaction processed successfully',
      data: transaction
    });
  }
}
