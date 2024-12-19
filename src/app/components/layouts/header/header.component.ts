import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [], 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'], 
})

export class HeaderComponent {
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target?.value;
    this.search.emit(value);
  }
}
