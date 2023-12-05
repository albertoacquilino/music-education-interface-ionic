import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'scroll-image-page',
    loadComponent: () => import('./components/scroll-image-selector/scroll-image-test-page')
      .then((m) => m.ScrollImagePage),
  }, {
    path: 'score',
    loadComponent: () => import('./pages/score-test.component')
      .then((m) => m.ScoreComponentTest),
  }, {
    path: 'dynamics',
    loadComponent: () => import('./pages/dynamics-test.component')
      .then((m) => m.ScoreComponentTest),
  }
];
