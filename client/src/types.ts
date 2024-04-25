export interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  cart_quantity: number;
}
