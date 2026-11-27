import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'fp-error-view',
  imports: [JsonPipe, MatExpansionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      margin-top: var(--fp-space-medium);
    }

    pre {
      margin: 0;
      overflow-x: auto;
      font-size: 0.875rem;
    }
  `,
  template: `
    <mat-expansion-panel class="error-view">
      <mat-expansion-panel-header>
        <mat-panel-title>Error object</mat-panel-title>
        <mat-panel-description>{{ errors() === null ? 'no errors' : 'has errors' }}</mat-panel-description>
      </mat-expansion-panel-header>
      <pre tabindex="0"><code>{{ errors() | json }}</code></pre>
    </mat-expansion-panel>
  `
})
export class ErrorView {
  readonly errors = input.required<unknown>();
}
