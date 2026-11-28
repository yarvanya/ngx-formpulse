import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'fp-validity-indicator',
  imports: [MatIconModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      padding: 0 12px;
    }

    .validity-icon {
      display: inline-flex;
      border-radius: 50%;
      color: var(--fp-invalid);
      cursor: help;
    }

    .validity-icon:focus-visible {
      outline: 2px solid var(--mat-sys-primary);
      outline-offset: 2px;
    }

    .validity-valid {
      color: var(--fp-valid);
    }
  `,
  template: `
    <span
      class="validity-icon"
      role="img"
      tabindex="0"
      [class.validity-valid]="isValid()"
      [attr.aria-label]="accessibleText()"
      [matTooltip]="statusText()"
      matTooltipPosition="above"
    ><mat-icon aria-hidden="true">{{ isValid() ? 'check_circle' : 'cancel' }}</mat-icon></span>
  `
})
export class ValidityIndicator {
  readonly isValid = input.required<boolean>();

  protected readonly statusText = computed(() => (this.isValid() ? 'Valid' : 'Invalid'));
  protected readonly accessibleText = computed(() => (this.isValid() ? 'Validity: valid' : 'Validity: invalid'));
}
