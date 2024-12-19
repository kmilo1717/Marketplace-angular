import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
}

interface CartProduct {
  id: number;
  quantity: number;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})

export class SliderComponent implements AfterViewInit {
  @Input() dataProducts: dataProducts[] = [];
  @Output() productToAdd: EventEmitter<number> = new EventEmitter();

  @ViewChild('carousel') carousel!: ElementRef;

  private scrollInterval: any;
  private scrollAmount = 300;
  private _productToAdd: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private localStorageService: LocalStorageService) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.carousel && this.carousel.nativeElement) {
        const carousel = this.carousel.nativeElement;
        carousel.addEventListener('mouseenter', this.pauseScrolling.bind(this));
        carousel.addEventListener('mouseleave', this.startScrolling.bind(this));
        this.startScrolling();
      }
    }
  }

  private startScrolling(): void {
    if (this.carousel && this.carousel.nativeElement) {
      const carousel = this.carousel.nativeElement;
      let scrollAmount = 0;

      if (!this.scrollInterval) {
        this.scrollInterval = setInterval(() => {
          if (scrollAmount < carousel.scrollWidth) {
            carousel.scrollTo({
              left: scrollAmount,
              behavior: 'smooth'
            });
            scrollAmount += 300;
          } else {
            carousel.scrollTo({
              left: 0,
              behavior: 'smooth'
            });
            scrollAmount = 0;
          }
        }, 2000);
      }
    }
  }

  scrollLeft(): void {
    if (this.carousel && this.carousel.nativeElement) {
      const carousel = this.carousel.nativeElement;
      carousel.scrollBy({
        left: -this.scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    if (this.carousel && this.carousel.nativeElement) {
      const carousel = this.carousel.nativeElement;
      carousel.scrollBy({
        left: this.scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  private pauseScrolling(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }
  
  set setProductToAdd(value: number | null) {
    if (!value) return;
    this._productToAdd = value;
    this.productToAdd.emit(value);
  }

  addProductToCart(id: number): void {
    this.productToAdd.emit(id);
  }
  
}
