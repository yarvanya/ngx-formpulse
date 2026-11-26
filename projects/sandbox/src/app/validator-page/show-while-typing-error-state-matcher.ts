import {Injectable} from '@angular/core';
import type {AbstractControl, FormGroupDirective, NgForm} from '@angular/forms';
import type {Field} from '@angular/forms/signals';
import type {ErrorStateMatcher} from '@angular/material/core';

@Injectable()
export class ShowWhileTypingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, parent_form: FormGroupDirective | NgForm | null): boolean {
    return control !== null && control.invalid && (control.dirty || control.touched || parent_form?.submitted === true);
  }

  isSignalErrorState(field_tree: Field<unknown> | null): boolean {
    if (field_tree === null) {
      return false;
    }
    const fieldState = field_tree();
    const hasValue = fieldState.value() !== '' && fieldState.value() !== null;
    return fieldState.invalid() && (fieldState.dirty() || fieldState.touched() || hasValue);
  }
}
