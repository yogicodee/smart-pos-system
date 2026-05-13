import { z } from 'zod';

export const createTransactionSchema = z.object({
  paidAmount: z.number().min(0),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive()
  })).min(1, 'At least one item is required')
});
