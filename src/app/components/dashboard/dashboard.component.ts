import { Component } from '@angular/core';
import { HeaderComponent } from '../layouts/header/header.component';
import { SliderComponent } from '../slider/slider.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { LocalStorageService } from '../../services/LocalStorageService';

interface dataProducts {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
  };
  quantity: number | undefined
}

interface CartProduct {
  id: number;
  quantity: number;
}
@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SliderComponent, ShoppingCartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  dataProducts: dataProducts[] = [];
  random10Products: dataProducts[] = [];
  visibleProducts: dataProducts[] = [];
  filter: string = '';
  itemsAmount = 0;
  cart: CartProduct[] = [];
  productsInCart: dataProducts[] = []
  productToAdd: number | null = null

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.getProducts().then(() => {
      this.cart = this.localStorageService.getItem('cart') ?? [];
      this.productsInCart = this.dataProducts.filter(product =>
        this.cart.some(cartItem => cartItem.id === product.id)
      ).map(product => {
        const cartItem = this.cart.find(cartItem => cartItem.id === product.id);
        return { ...product, quantity: cartItem?.quantity };
      });
      this.productsInCart = [...this.productsInCart];
    });
  }

  private async getProducts(): Promise<void> {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      const products = await response.json();
      this.dataProducts = products.map((product: any) => {
        return {
          ...product,
          images: this.parseImages(product.images)
        }
      });

      this.random10Products = this.dataProducts.slice(0, 10)
      this.loadMore();
    } catch (error) {
    }

  }

  loadMore(): void {
    this.itemsAmount += 10
    this.visibleProducts = this.dataProducts.slice(0, this.itemsAmount)
  }

  addProductToCart(id: number): void {
    const product = this.dataProducts.find(product => product.id === id);
    if (!product) {
      return;
    }
  
    const productInCart = this.cart.find(item => item.id === id);
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      this.cart.push({ id, quantity: 1 });
    }
    this.localStorageService.setItem('cart', this.cart);
  
    this.productsInCart = this.dataProducts.filter(product =>
      this.cart.some(cartItem => cartItem.id === product.id)
    ).map(product => {
      const cartItem = this.cart.find(cartItem => cartItem.id === product.id);
      return { ...product, quantity: cartItem?.quantity };
    });

    this.productsInCart = [...this.productsInCart];
  }
  


  getProduct(id: number): CartProduct | null {
    const products: CartProduct[] | null = this.localStorageService.getItem('cart')
    if (products === null) {
      return null
    }
    const product = products.find(product => product.id === id)
    if (!product) {
      return null
    }
    return product
  }

  onProductChange(newValue: number): void {
    this.addProductToCart(newValue)
  }

  onProductRemoved(productId: number): void {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.productsInCart = this.productsInCart.filter(product => product.id !== productId);
    this.localStorageService.setItem('cart', this.cart);
  }

  onSearch(value: string) {
    this.filter = value
    const filteredProducts = this.dataProducts.filter(product => product.title.toLowerCase().includes(value.toLowerCase()))
    this.visibleProducts = filteredProducts
    if (value === '') {
      this.visibleProducts = this.dataProducts.slice(0, this.itemsAmount)
    }
  }

  private parseImages(images: string): string[] {
    try {
      const parsedImages = JSON.parse(images);
      return parsedImages.map((image: string) => image.replace(/^"|"$/g, '').replace(/\\/g, ''));
    } catch (error) {
      console.error('Error al parsear las imágenes:', error);
      return [];
    }
  }
}
