import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'fp-getting-started-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started-page.html'
})
export class GettingStartedPage {
  protected readonly installCommand = 'npm install ngx-formpulse';
  protected readonly localeExample = [
    'import {ApplicationConfig} from \'@angular/core\';',
    'import {FpLocale, provideFormPulse} from \'ngx-formpulse\';',
    'import {fpLocaleUk} from \'ngx-formpulse/locales/uk\';',
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [provideFormPulse({locale: FpLocale.Uk, locales: [fpLocaleUk]})]',
    '};'
  ].join('\n');
}
