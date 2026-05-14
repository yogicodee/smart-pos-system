import { ProductRepository } from '../repositories/ProductRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { Product } from '../models/types';

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
    this.auditLogRepository = new AuditLogRepository();
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

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, userId: string = 'SYSTEM') {
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error('Invalid Category ID');
    }

    const product = await this.productRepository.create(data);

    await this.auditLogRepository.create({
      userId,
      userName: `User ${userId}`,
      action: 'CREATE_PRODUCT',
      module: 'INVENTORY',
      details: `Created product: ${product.name} (Stock: ${product.stock})`
    });

    return product;
  }

  async updateProduct(id: string, data: any, userId: string = 'SYSTEM') {
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

    await this.auditLogRepository.create({
      userId,
      userName: `User ${userId}`,
      action: 'UPDATE_PRODUCT',
      module: 'INVENTORY',
      details: `Updated product ${id}: ${Object.keys(data).join(', ')}`
    });

    return updated;
  }

  async deleteProduct(id: string, userId: string = 'SYSTEM') {
    const product = await this.productRepository.findById(id);
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new Error('Product not found');
    }

    await this.auditLogRepository.create({
      userId,
      userName: `User ${userId}`,
      action: 'DELETE_PRODUCT',
      module: 'INVENTORY',
      details: `Deleted product: ${product?.name || id}`
    });

    return true;
  }
}
