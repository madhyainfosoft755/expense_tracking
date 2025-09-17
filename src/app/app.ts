// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { NxWelcome } from './nx-welcome';

// @Component({
//   imports: [NxWelcome, RouterModule],
//   selector: 'app-root',
//   templateUrl: './app.html',
//   styleUrl: './app.scss',
// })
// export class App {
//   protected title = 'expense_tracking';
// }


import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {}