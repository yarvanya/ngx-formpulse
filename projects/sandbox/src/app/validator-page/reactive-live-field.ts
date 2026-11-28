import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {type FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {map, startWith, switchMap} from 'rxjs';
import {ErrorView} from './error-view';
import {FormControlsErrorsResolverPipe} from './form-controls-errors-resolver-pipe';
import {ShowWhileTypingErrorStateMatcher} from './show-while-typing-error-state-matcher';
import {ValidityIndicator} from './validity-indicator';

@Component({
  selector: 'fp-reactive-live-field',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormControlsErrorsResolverPipe, ErrorView, ValidityIndicator],
  providers: [{provide: ErrorStateMatcher, useClass: ShowWhileTypingErrorStateMatcher}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive-live-field.html'
})
export class ReactiveLiveField {
  readonly control = input.required<FormControl<string>>();
  readonly label = input.required<string>();

  protected readonly errors = toSignal(
    toObservable(this.control).pipe(
      switchMap((form_control) => form_control.events.pipe(
        startWith(null),
        map(() => form_control.errors)
      ))
    ),
    {initialValue: null}
  );
}
