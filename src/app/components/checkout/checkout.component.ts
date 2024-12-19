import { Component } from '@angular/core';
import { LocalStorageService } from '../../services/LocalStorageService';
import { ShoppingCartComponent } from "../shopping-cart/shopping-cart.component";
import { RouterLink } from '@angular/router';

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

@Component({
  selector: 'app-checkout',
  imports: [ShoppingCartComponent, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  dataProducts: dataProducts[] = []
  cart: dataProducts[] = []
  productsInCart: dataProducts[] = []

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
      const response = await fetch('https://api.escuelajs.co/api/v1/products')
      this.dataProducts = await response.json()
    } catch (error) {
      console.log(error)
    }

  }
}
