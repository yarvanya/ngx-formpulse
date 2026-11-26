import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {CodeExample} from '../../validator-page/code-example';

@Component({
  selector: 'fp-getting-started-page',
  imports: [MatCardModule, CodeExample],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './getting-started-page.scss',
  templateUrl: './getting-started-page.html'
})
export class GettingStartedPage {
  protected readonly installCommand = 'npm install ngx-formpulse';

  protected readonly usageExample = [
    'import {FormControl} from \'@angular/forms\';',
    'import {FpCountry, fpPostCode} from \'ngx-formpulse\';',
    '',
    'const postCode = new FormControl(\'\', [fpPostCode(FpCountry.UA)]);'
  ].join('\n');

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
