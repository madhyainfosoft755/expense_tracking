import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-client-admin',
  imports: [CommonModule],
  template: `
    <div class="p-5 bg-green-200">
      <h1 class="text-2xl font-bold text-center text-blue-700">Admin</h1>
    </div>
  `,
  styleUrl: './client_admin.scss',
})
export class ClientAdmin {}
