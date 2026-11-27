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
    path: 'validators/email',
    title: 'fpEmail | FormPulse',
    loadComponent: async () => (await import('./validators/email/email-page')).EmailPage
  },
  {
    path: 'validators/post-code',
    title: 'fpPostCode | FormPulse',
    loadComponent: async () => (await import('./validators/post-code/post-code-page')).PostCodePage
  },
  {
    path: '**',
    redirectTo: ''
  }
];
