import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FpLocale} from 'ngx-formpulse';

const LANGUAGE_NAMES = new Intl.DisplayNames(['en'], {type: 'language'});

@Component({
  selector: 'fp-locale-switcher',
  imports: [MatFormFieldModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-label>Message language</mat-label>
      <mat-select [value]="locale()" (valueChange)="locale.set($event)">
        @for (localeOption of localeOptions; track localeOption.locale) {
          <mat-option [value]="localeOption.locale">{{ localeOption.name }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `
})
export class LocaleSwitcher {
  readonly locale = model.required<FpLocale>();

  protected readonly localeOptions = Object.values(FpLocale).map((locale) => ({locale, name: LANGUAGE_NAMES.of(locale) ?? locale}));
}
