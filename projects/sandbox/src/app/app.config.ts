import {type ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideEnvironmentInitializer} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {provideFormPulse} from 'ngx-formpulse';
import {fpLocaleDe} from 'ngx-formpulse/locales/de';
import {fpLocaleEs} from 'ngx-formpulse/locales/es';
import {fpLocaleFr} from 'ngx-formpulse/locales/fr';
import {fpLocalePl} from 'ngx-formpulse/locales/pl';
import {fpLocalePt} from 'ngx-formpulse/locales/pt';
import {fpLocaleUk} from 'ngx-formpulse/locales/uk';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({anchorScrolling: 'enabled', scrollPositionRestoration: 'top'})),
    provideClientHydration(withEventReplay()),
    provideEnvironmentInitializer(() => {
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
    }),
    provideFormPulse({locales: [fpLocaleUk, fpLocaleEs, fpLocalePt, fpLocalePl, fpLocaleDe, fpLocaleFr]})
  ]
};
