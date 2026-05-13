import { Category } from '../models/types';
import { categories } from '../database/db';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return categories;
  }

  async findById(id: string): Promise<Category | undefined> {
    return categories.find(c => c.id === id);
  }
}
