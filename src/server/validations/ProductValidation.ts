import { z } from 'zod';

export const createProductSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  name: z.string().min(1, 'Product name is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  price: z.number().min(0, 'Price cannot be negative'),
  description: z.string().optional().default('')
});

export const updateProductSchema = createProductSchema.partial();
