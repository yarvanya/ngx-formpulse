/**
 * Error object produced by a failed FormPulse validator.
 *
 * It always carries a human-readable `message` resolved in the active locale, plus the
 * validator-specific parameters.
 *
 * @typeParam TParameters - Validator-specific parameters, e.g. the country of a postal code.
 *
 * @example
 * ```ts
 * type PostCodeError = FpError<{country: FpCountry | null; expectedFormat: string}>;
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#errors
 */
export type FpError<TParameters extends object = object> = Readonly<TParameters> & {
  readonly message: string;
};

/**
 * Parameters of a FormPulse error without its `message`; the input of a message function.
 *
 * @typeParam TError - The FormPulse error type.
 *
 * @example
 * ```ts
 * const toText = (error_parameters: FpErrorParameters<PostCodeError>): string => error_parameters.expectedFormat;
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#errors
 */
export type FpErrorParameters<TError extends FpError> = Omit<TError, 'message'>;
