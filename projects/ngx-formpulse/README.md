# FormPulse

Strictly typed, zero-dependency validators for Angular **Reactive Forms** and **Signal Forms**.

> FormPulse is in active development. Nothing is published to npm before 1.0.0.

## Why FormPulse

- **One line per validator.** Import a function and add it to a control. No modules or providers.
- **Typed parameters and errors.** Enumerable parameters come from exported enums; every error is a
  typed object with a ready `message`.
- **Localized.** English out of the box; Ukrainian, Spanish, Portuguese, Polish, German and French
  as opt-in, tree-shakable locale packs.
- **Two form worlds, one validator.** The same validators work in Reactive Forms and Signal Forms
  with identical error shapes.
- **Zero runtime dependencies, SSR-safe.**

## Install

```bash
npm install ngx-formpulse
```

Requires Angular 22.

## Validators

### fpEmail

Validates an email address: the HTML5 `type=email` grammar tightened with the RFC rules.

```ts
import {FormControl} from '@angular/forms';
import {fpEmail} from 'ngx-formpulse';

new FormControl('', [fpEmail()]);
new FormControl('', [fpEmail({strict: true})]);
```

Signal Forms:

```ts
import {form} from '@angular/forms/signals';
import {fpEmail} from 'ngx-formpulse/signals';

form(model, (path) => {
  fpEmail(path.email);
});
```

- Error `errors.fpEmail`: `{message}`.
- Before `@`: 1–64 characters of RFC 5322 `atext`; dots only between characters.
- Domain: labels of letters, digits and inner hyphens (1–63 each); a top-level domain of 2+ letters or punycode (`xn--…`) is required, so `user@company` is invalid.
- The address has at most 254 characters. ASCII only; quoted parts, IP addresses and display names are invalid.
- Empty values are valid; a value of spaces only is invalid. Surrounding spaces are ignored unless `strict: true`.
- Checks the format, not that the mailbox exists.

### fpPostCode

Validates a postal code against the format of one country, or of any supported country.

```ts
import {FormControl} from '@angular/forms';
import {FpCountry, fpPostCode} from 'ngx-formpulse';

new FormControl('', [fpPostCode(FpCountry.UA)]);
new FormControl('', [fpPostCode(FpCountry.GB, {strict: true})]);
new FormControl('', [fpPostCode()]);
```

Signal Forms:

```ts
import {form} from '@angular/forms/signals';
import {FpCountry} from 'ngx-formpulse';
import {fpPostCode} from 'ngx-formpulse/signals';

form(model, (path) => {
  fpPostCode(path.postCode, FpCountry.UA);
});
```

- Error `errors.fpPostCode`: `{country, examples, message}`.
- Empty values are valid; a value of spaces only is invalid. A country without postal codes accepts any other value.
- The country can be `null` (any country). In Signal Forms it can be a function, e.g. `() => model().country`, so the rule follows another field.
- Tolerant by default (surrounding spaces, letter case); `strict: true` matches exactly.
- Checks the format, not that the postal code exists.
- Data: [Google libaddressinput](https://github.com/google/libaddressinput) (Apache-2.0), see `NOTICE`.

### fpRequired

Requires a value of any type: text, numbers, checkboxes, lists, files and dates.

```ts
import {FormControl} from '@angular/forms';
import {fpRequired} from 'ngx-formpulse';

new FormControl('', [fpRequired()]);
new FormControl<number | null>(null, [fpRequired({message: 'Enter a quantity.'})]);
```

Signal Forms (also marks the field as required, so the input gets the `required` attribute):

```ts
import {form} from '@angular/forms/signals';
import {fpRequired} from 'ngx-formpulse/signals';

form(model, (path) => {
  fpRequired(path.name);
  fpRequired(path.languages);
});
```

- Error `errors.fpRequired`: `{message}`.
- Missing: `null`, `undefined`, empty text, text of spaces only, `NaN`, an invalid `Date`, an empty array, `Set`, `Map` or `FileList`.
- Filled: every other value, including `0`, `false` and `{}`. An untouched checkbox (`null`) is missing; `false` is a real answer.
- Reactive Forms: Angular shows the required marker only for its own `Validators.required`, so add a visual asterisk yourself.

## Configuration

Optional. Without configuration every message is English.

```ts
import {ApplicationConfig} from '@angular/core';
import {FpLocale, provideFormPulse} from 'ngx-formpulse';
import {fpLocaleUk} from 'ngx-formpulse/locales/uk';

export const appConfig: ApplicationConfig = {
  providers: [provideFormPulse({locale: FpLocale.Uk, locales: [fpLocaleUk]})]
};
```

### Localization

`locale` sets the default locale (English when omitted). `locales` registers the packs you need;
registering a pack never changes the default. Packs you do not import never reach your bundle.

### Messages

Every validator accepts `message`: a string, a string with `{parameterName}` placeholders, or a
function of the error parameters. Priority: inline message → `provideFormPulse({messages})` →
locale pack → English.

### Errors

Each failed validator reports an error under its own key (for example `errors.fpPostCode`), with
`message` and the validator-specific parameters.

### Options

Every validator takes an optional last argument with at least `locale` and `message`.

## Development

```bash
npm ci
npm start          # sandbox on http://localhost:1000
npm run verify     # every quality gate, in CI order
```

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © Ivan Yarymovych
