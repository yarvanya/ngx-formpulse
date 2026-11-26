import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'fp-source-note',
  imports: [MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .source-note {
      border-radius: var(--fp-radius);
      background: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-on-tertiary-container);
    }

    mat-card-content {
      display: flex;
      gap: var(--fp-space-medium);
      align-items: flex-start;
    }

    p {
      margin: 0 0 var(--fp-space-small);
    }

    a {
      color: inherit;
      font-weight: 600;
    }
  `,
  template: `
    <mat-card appearance="filled" class="source-note">
      <aside aria-label="Data source">
        <mat-card-content>
          <mat-icon aria-hidden="true">info</mat-icon>
          <div>
            <p>
              Data source:
              <a [href]="sourceUrl()" target="_blank" rel="noopener noreferrer">{{ sourceName() }}<span class="visually-hidden"> (opens in a new tab)</span></a>,
              {{ license() }}.
            </p>
            <p>FormPulse checks the format, not that the value exists.</p>
          </div>
        </mat-card-content>
      </aside>
    </mat-card>
  `
})
export class SourceNote {
  readonly sourceName = input.required<string>();
  readonly sourceUrl = input.required<string>();
  readonly license = input.required<string>();
}
