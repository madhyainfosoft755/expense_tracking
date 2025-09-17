import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Expense Reporting by
        <a href="https://mistpl.com" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">MISTPL</a>
    </div>`,
    imports: []
})
export class AppFooterComponent {}