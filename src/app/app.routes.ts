import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/signin/signin.page').then(m => m.SigninPage),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  },

  {
    path: 'home',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsComponent),
    children: [
      {
        path: 'exercise',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'tuner',
        loadComponent: () => import('./pages/pitchlite/pitchlite.page').then(m => m.PitchComponent),
      },

      {
        path: '',
        redirectTo: 'exercise',
        pathMatch: 'full',
      }
    ]
  },

  {
    path: 'scroll-image-page',
    loadComponent: () => import('./components/scroll-image-selector/scroll-image-test-page').then(m => m.ScrollImagePage),
  },
  {
    path: 'score',
    loadComponent: () => import('./pages/score-test.component').then(m => m.ScoreComponentTest),
  },
  {
    path: 'dynamics',
    loadComponent: () => import('./pages/dynamics-test.component').then(m => m.ScoreComponentTest),
  }
];
