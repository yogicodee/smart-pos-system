import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { TransactionController } from '../controllers/TransactionController';
import { ExportController } from '../controllers/ExportController';
import { authorize } from '../middleware/authMiddleware';

export const apiRouter = Router();
const productController = new ProductController();
const transactionController = new TransactionController();
const exportController = new ExportController();

// Product Routes
apiRouter.get('/products', productController.index);
apiRouter.get('/products/:id', productController.show);
apiRouter.post('/products', authorize('MANAGE_PRODUCTS'), productController.store);
apiRouter.put('/products/:id', authorize('MANAGE_PRODUCTS'), productController.update);
apiRouter.delete('/products/:id', authorize('MANAGE_PRODUCTS'), productController.destroy);

// Transaction Routes
apiRouter.get('/transactions', authorize('ACCESS_ANALYTICS'), transactionController.index);
apiRouter.post('/transactions', authorize('CREATE_TRANSACTION'), transactionController.store);

// Export Routes
apiRouter.get('/export/products/excel', authorize('EXPORT_REPORTS'), exportController.productsExcel);
apiRouter.get('/export/products/pdf', authorize('EXPORT_REPORTS'), exportController.productsPdf);
apiRouter.get('/export/transactions/excel', authorize('EXPORT_REPORTS'), exportController.transactionsExcel);
apiRouter.get('/export/transactions/pdf', authorize('EXPORT_REPORTS'), exportController.transactionsPdf);

// Status Route
apiRouter.get('/status', (req, res) => {
  res.json({ status: 'API is running' });
});
