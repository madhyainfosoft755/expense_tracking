import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from '@shared';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TestComponent],
  template: `
    <div class="p-5 bg-green-200">
      <h1 class="text-2xl font-bold text-center text-blue-700">Home</h1>
      <lib-test-component></lib-test-component>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  constructor() {
    console.log('HomeComponent loaded');
  }
}
