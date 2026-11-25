export interface Product {
  productId: string;
  name: string;
  category: string;
  price: number;         // a real number, not the string an input box hands back
  stockQuantity: number;
  sku: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}
