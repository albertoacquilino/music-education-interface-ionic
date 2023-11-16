import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'score',
    pathMatch: 'full',
  },
  {
    path: 'scroll-image-page',
    loadComponent: () => import('./components/scroll-image-selector/scroll-image-test-page')
      .then((m) => m.ScrollImagePage),
  }, {
    path: 'score',
    loadComponent: () => import('./components/score/score.component')
      .then((m) => m.ScoreComponent),
  }
];
