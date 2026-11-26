import type {FpError, FpErrorParameters} from './fp-error';

/**
 * Custom error message: a static string, a string with `{parameterName}` placeholders, or a
 * function of the error parameters.
 *
 * @typeParam TError - The FormPulse error the message describes.
 *
 * @example
 * ```ts
 * const fixed: FpMessage = 'Invalid value.';
 * const template: FpMessage = 'Expected format: {expectedFormat}.';
 * const computed: FpMessage<PostCodeError> = (error_parameters) => `Use ${error_parameters.expectedFormat}.`;
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#messages
 */
export type FpMessage<TError extends FpError = FpError> = string | ((error_parameters: FpErrorParameters<TError>) => string);
