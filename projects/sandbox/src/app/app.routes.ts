import type {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'FormPulse: typed validators for Angular forms',
    loadComponent: async () => (await import('./pages/home/home-page')).HomePage
  },
  {
    path: 'getting-started',
    title: 'Getting started | FormPulse',
    loadComponent: async () => (await import('./pages/getting-started/getting-started-page')).GettingStartedPage
  },
  {
    path: '**',
    redirectTo: ''
  }
];
