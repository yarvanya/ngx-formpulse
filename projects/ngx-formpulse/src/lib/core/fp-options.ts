import type {FpError} from './fp-error';
import type {FpLocale} from './fp-locale';
import type {FpMessage} from './fp-message';

/**
 * Options shared by every FormPulse validator; passed as the last argument.
 *
 * @typeParam TError - The error of the validator the options belong to.
 *
 * @example
 * ```ts
 * fpPostCode(FpCountry.UA, {locale: FpLocale.En, message: 'Check the postal code.'});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#options
 */
export interface FpBaseOptions<TError extends FpError = FpError> {
  readonly locale?: FpLocale;
  readonly message?: FpMessage<TError>;
}
