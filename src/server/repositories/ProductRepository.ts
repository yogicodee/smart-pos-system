import { Product, ProductWithCategory } from '../models/types';
import { products, categories } from '../database/db';

export class ProductRepository {
  async findAll(params: { search?: string; page?: number; limit?: number }) {
    const { search, page = 1, limit = 10 } = params;
    
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = filtered.length;
    const from = (page - 1) * limit;
    const to = from + limit;
    const data = filtered.slice(from, to).map(p => ({
      ...p,
      category: categories.find(c => c.id === p.categoryId)
    }));

    return {
      data,
      total,
      currentPage: page,
      lastPage: Math.ceil(total / limit),
      perPage: limit
    };
  }

  async findById(id: string): Promise<ProductWithCategory | undefined> {
    const product = products.find(p => p.id === id);
    if (!product) return undefined;
    
    return {
      ...product,
      category: categories.find(c => c.id === product.categoryId)
    };
  }

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(newProduct);
    return newProduct;
  }

  async update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | undefined> {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date()
    };
    return products[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    return true;
  }
}
