import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  selector: 'app-shopping-cart',
  imports: [RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  @Input() dataCart: dataProducts[] = [];
  @Input() hideCheckoutBtn: boolean = false;
  @Output() productRemoved = new EventEmitter<number>();
  open: boolean = false;
  total: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataCart']) {
      this.calculateTotal();
    }
  }

  deleteProduct(id: number) {
    this.dataCart = this.dataCart.filter(product => product.id !== id);
    this.productRemoved.emit(id);
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.dataCart.reduce((acc, product) => acc + (product.price * (product.quantity || 1)), 0);
  }

  setOpen(open: boolean) {
    this.open = open;
  }
}
