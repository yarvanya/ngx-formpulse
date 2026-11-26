import {Pipe, type PipeTransform} from '@angular/core';
import type {ValidationErrors} from '@angular/forms';
import {isObject, isString} from '../utilities/core.utility';

export interface SignalFieldError {
  readonly kind: string;
  readonly message?: string;
}

interface ResolvedError {
  readonly key: string;
  readonly message: string | undefined;
}

const BUILT_IN_MESSAGES: Readonly<Partial<Record<string, string>>> = {
  required: 'This field is required.',
  email: 'Enter a valid email address.',
  minlength: 'The value is too short.',
  maxlength: 'The value is too long.',
  min: 'The value is too small.',
  max: 'The value is too large.',
  pattern: 'The value has an invalid format.'
};

const FALLBACK_MESSAGE = 'The value is invalid.';

function readMessage(error_value: unknown): string | undefined {
  if (!isObject(error_value) || !('message' in error_value)) {
    return undefined;
  }
  return isString(error_value.message) ? error_value.message : undefined;
}

function readFirstError(control_errors: ValidationErrors | readonly SignalFieldError[] | null | undefined): ResolvedError | undefined {
  if (control_errors === null || control_errors === undefined) {
    return undefined;
  }
  if (Array.isArray(control_errors)) {
    const signalErrors: readonly SignalFieldError[] = control_errors;
    const [firstError] = signalErrors;
    return firstError === undefined ? undefined : {key: firstError.kind, message: firstError.message};
  }
  const [firstEntry] = Object.entries(control_errors);
  return firstEntry === undefined ? undefined : {key: firstEntry[0], message: readMessage(firstEntry[1])};
}

@Pipe({name: 'formControlsErrorsResolver'})
export class FormControlsErrorsResolverPipe implements PipeTransform {
  transform(control_errors: ValidationErrors | readonly SignalFieldError[] | null | undefined): string | null {
    const firstError = readFirstError(control_errors);
    if (firstError === undefined) {
      return null;
    }
    return firstError.message ?? BUILT_IN_MESSAGES[firstError.key] ?? FALLBACK_MESSAGE;
  }
}
