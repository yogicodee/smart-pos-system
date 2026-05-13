import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { createProductSchema, updateProductSchema } from '../validations/ProductValidation';

const productService = new ProductService();

export class ProductController {
  async index(req: Request, res: Response) {
    const { search, page, limit } = req.query;
    
    const products = await productService.getAllProducts({
      search: search as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10
    });

    return res.status(200).json({
      status: 'success',
      data: products
    });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    
    return res.status(200).json({
      status: 'success',
      data: product
    });
  }

  async store(req: Request, res: Response) {
    const validatedData = createProductSchema.parse(req.body);
    const product = await productService.createProduct(validatedData);

    return res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const validatedData = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(id, validatedData);

    return res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: product
    });
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    await productService.deleteProduct(id);

    return res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  }
}
