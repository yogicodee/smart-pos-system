import { ProductRepository } from '../repositories/ProductRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Product } from '../models/types';

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async getAllProducts(params: { search?: string; page?: number; limit?: number }) {
    return await this.productRepository.findAll(params);
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    // Validate category existence
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error('Invalid Category ID');
    }

    return await this.productRepository.create(data);
  }

  async updateProduct(id: string, data: any) {
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('Invalid Category ID');
      }
    }

    const updated = await this.productRepository.update(id, data);
    if (!updated) {
      throw new Error('Product not found');
    }
    return updated;
  }

  async deleteProduct(id: string) {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new Error('Product not found');
    }
    return true;
  }
}
