import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'pitchlite',
        loadComponent: () => import('./pages/pitchlite/pitchlite.page').then(m => m.PitchComponent),
      },
      {
        path: 'tuner',
        loadComponent: () => import('./pages/tuner/tuner.page').then(m => m.TunerComponent)
      },
      {
        path: '',
        redirectTo: 'home',
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

// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: 'home',
//     loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
//   },
//   {
//     path: '',
//     redirectTo: 'home',
//     pathMatch: 'full',
//   },
//   {
//     path: 'pitchlite',
//     loadComponent: () => import('./pages/pitchlite/pitchlite.page').then((m) => m.PitchComponent)
//   },
//   {
//     path: 'tuner',
//     loadComponent: () => import('./pages/tuner/tuner.page').then((m) => m.TunerComponent)
//   },
//   {
//     path: 'scroll-image-page',
//     loadComponent: () => import('./components/scroll-image-selector/scroll-image-test-page')
//       .then((m) => m.ScrollImagePage),
//   }, {
//     path: 'score',
//     loadComponent: () => import('./pages/score-test.component')
//       .then((m) => m.ScoreComponentTest),
//   }, {
//     path: 'dynamics',
//     loadComponent: () => import('./pages/dynamics-test.component')
//       .then((m) => m.ScoreComponentTest),
//   }

// ];
