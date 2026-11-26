import {type SchemaPath, validate} from '@angular/forms/signals';
import type {FpError} from 'ngx-formpulse';

export function applySignalValidator<TValue>(
  schema_path: SchemaPath<TValue>,
  validator_key: string,
  value_check: (control_value: unknown) => FpError | null
): void {
  validate(schema_path, (field_context) => {
    const validationError = value_check(field_context.value());
    return validationError === null ? null : {...validationError, kind: validator_key};
  });
}
