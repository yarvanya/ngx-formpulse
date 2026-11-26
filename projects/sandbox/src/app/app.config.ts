import {type ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {provideFormPulse} from 'ngx-formpulse';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({anchorScrolling: 'enabled', scrollPositionRestoration: 'top'})),
    provideClientHydration(withEventReplay()),
    provideFormPulse()
  ]
};
