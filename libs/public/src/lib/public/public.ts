import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-public',
  imports: [CommonModule, RouterModule],
  templateUrl: './public.html',
  template: `<router-outlet></router-outlet>`,
})
export class Public {}
