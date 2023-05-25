import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'scroll-image-page',
    loadComponent: () => import('./scroll-image-selector/scroll-image-test-page')
      .then((m) => m.ScrollImagePage),
  }
];
