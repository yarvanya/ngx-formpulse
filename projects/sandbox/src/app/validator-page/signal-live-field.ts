import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {type FieldTree, FormField} from '@angular/forms/signals';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ErrorView} from './error-view';
import {FormControlsErrorsResolverPipe, type SignalFieldError} from './form-controls-errors-resolver-pipe';
import {ShowWhileTypingErrorStateMatcher} from './show-while-typing-error-state-matcher';
import {ValidityIndicator} from './validity-indicator';

const FIELD_REFERENCES = new Set(['fieldTree', 'formField']);

function toPlainError(signal_error: SignalFieldError): Readonly<Record<string, unknown>> {
  return Object.fromEntries(Object.entries(signal_error).filter((property_entry) => !FIELD_REFERENCES.has(property_entry[0])));
}

@Component({
  selector: 'fp-signal-live-field',
  imports: [FormField, MatFormFieldModule, MatInputModule, FormControlsErrorsResolverPipe, ErrorView, ValidityIndicator],
  providers: [{provide: ErrorStateMatcher, useClass: ShowWhileTypingErrorStateMatcher}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signal-live-field.html'
})
export class SignalLiveField {
  readonly field = input.required<FieldTree<string>>();
  readonly label = input.required<string>();

  protected readonly errors = computed(() => this.field()().errors());
  protected readonly plainErrors = computed(() => this.errors().map((signal_error) => toPlainError(signal_error)));
}
