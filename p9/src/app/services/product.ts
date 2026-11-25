import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productData = signal<Product[]>([
    { productId: 'PROD-001', name: 'Wireless Mouse', category: 'Electronics',
      price: 24.99, stockQuantity: 150, sku: 'EL-WM-100', status: 'In Stock' },
    { productId: 'PROD-002', name: 'Mechanical Keyboard', category: 'Electronics',
      price: 89.99, stockQuantity: 42, sku: 'EL-KB-200', status: 'In Stock' },
    { productId: 'PROD-003', name: '27-inch 4K Monitor', category: 'Electronics',
      price: 329.00, stockQuantity: 0, sku: 'EL-MN-270', status: 'Out of Stock' },
    { productId: 'PROD-004', name: 'Ergonomic Office Chair', category: 'Furniture',
      price: 249.50, stockQuantity: 18, sku: 'FN-CH-400', status: 'In Stock' },
    { productId: 'PROD-005', name: 'Standing Desk', category: 'Furniture',
      price: 499.00, stockQuantity: 5, sku: 'FN-DK-500', status: 'Low Stock' },
    { productId: 'PROD-006', name: 'USB-C Hub', category: 'Accessories',
      price: 39.95, stockQuantity: 230, sku: 'AC-HB-600', status: 'In Stock' }
  ]);

  products = this.productData.asReadonly();

  // A computed Signal: the running total that p1-p4 recalculated by hand inside
  // the render loop. Angular recomputes it only when `products` actually changes.
  totalInventoryValue = computed(() =>
    this.products().reduce((total, product) => total + product.price * product.stockQuantity, 0)
  );

  addProduct(newProduct: Product): void {
    this.productData.update(list => [...list, newProduct]);
  }

  deleteProduct(indexToRemove: number): void {
    this.productData.update(list => list.filter((_, index) => index !== indexToRemove));
  }

  insertProduct(index: number, product: Product): void {
    this.productData.update(list => [
      ...list.slice(0, index),
      product,
      ...list.slice(index)
    ]);
  }

  isDuplicateId(productId: string, ignoreIndex = -1): boolean {
    return this.products().some(
      (product, index) => index !== ignoreIndex && product.productId === productId
    );
  }
}
