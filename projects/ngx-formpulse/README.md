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
