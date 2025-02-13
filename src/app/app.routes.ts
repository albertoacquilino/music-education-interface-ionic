/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { Routes } from '@angular/router';
// import { authGuard } from './guards/auth.guards';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // {
  //   path: '',
  //   loadComponent: () => import('./pages/signin/signin.page').then(m => m.SigninPage),
  //   canActivate: [authGuard]
  // },
  // {
  //   path: 'signup',
  //   loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage),
  // },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  // },

  // {
  //   path: 'profile',
  //   loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
  // },

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

  // {
  //   path: 'scroll-image-page',
  //   loadComponent: () => import('./components/scroll-image-selector/scroll-image-test-page').then(m => m.ScrollImagePage),
  // },
  // {
  //   path: 'score',
  //   loadComponent: () => import('./pages/score-test.component').then(m => m.ScoreComponentTest),
  // },
  // {
  //   path: 'dynamics',
  //   loadComponent: () => import('./pages/dynamics-test.component').then(m => m.ScoreComponentTest),
  // }
];
