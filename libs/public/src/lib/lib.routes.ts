import { Route } from '@angular/router';
import { Public } from './public/public';

import { HomeComponent } from './home/home.component';

export const publicRoutes: Route[] = [
    {
    path: '',
    component: Public,
    children: [
      {path: '', component: HomeComponent},
    ]
  }
];
