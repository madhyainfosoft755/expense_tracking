// import { Routes } from '@angular/router';
// import { AppLayout } from './layout/component/app.layout';
// import { Dashboard } from './pages/dashboard/dashboard';
// import { Documentation } from './pages/documentation/documentation';
// import { Landing } from './pages/landing/landing';
// import { Notfound } from './pages/notfound/notfound';

// export const appRoutes: Routes = [
//     {
//         path: '',
//         component: AppLayout,
//         children: [
//             { path: '', component: Dashboard },
//             { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') },
//             { path: 'documentation', component: Documentation },
//             { path: 'pages', loadChildren: () => import('./pages/pages.routes') }
//         ]
//     },
//     { path: 'landing', component: Landing },
//     { path: 'notfound', component: Notfound },
//     { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') },
//     { path: '**', redirectTo: '/notfound' }
// ];




import { Route } from '@angular/router';

import { appSuperadminAuthGuard, authGuard, clientAdminAuthGuard, clientSuperadminAuthGuard, LoginComponent, siteAdminAuthGuard, userAuthGuard } from '@auth';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [authGuard],
    component: LoginComponent,
    data: { title: 'Login' },
  },
  {
    path: 'forgot-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@auth').then(m => m.ForgotPasswordComponent),
    data: { title: 'Forgot Password' },
  },
  {
    path: 'reset-password/:token',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@auth').then(m => m.ResetPasswordComponent),
    data: { title: 'Reset Password' },
  },
//   {
//     path: 'public',
//     loadChildren: () => import('public/Routes').then((m) => m!.remoteRoutes),
//   },
//   {
//     path: 'site-admin',
//     canActivate: [siteAdminAuthGuard],
//     loadChildren: () =>
//       import('site_admin/Routes').then((m) => m!.remoteRoutes),
//   },
//   {
//     path: 'admin',
//     canActivate: [clientAdminAuthGuard],
//     loadChildren: () =>
//       import('client_admin/Routes').then((m) => m!.remoteRoutes),
//   },
//   {
//     path: 'app-superadmin',
//     canActivate: [appSuperadminAuthGuard],
//     loadChildren: () =>
//       import('app_superadmin/Routes').then((m) => m!.remoteRoutes),
//   },
//   {
//     path: 'superadmin',
//     canActivate: [clientSuperadminAuthGuard],
//     loadChildren: () =>
//       import('client_superadmin/Routes').then((m) => m!.remoteRoutes),
//   },
//   {
//     path: 'user',
//     canActivate: [userAuthGuard],
//     loadChildren: () => import('user/Routes').then((m) => m!.remoteRoutes),
//   },
];
