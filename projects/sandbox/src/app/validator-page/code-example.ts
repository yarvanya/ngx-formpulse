import {ChangeDetectionStrategy, Component, computed, input, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {type CodeLanguage, highlightCode} from './code-highlighter';

@Component({
  selector: 'fp-code-example',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './code-example.scss',
  template: `
    <figure class="code-example">
      <figcaption>
        <span class="code-title">{{ title() }}</span>
        <button
          mat-icon-button
          type="button"
          [attr.aria-label]="(isCopied() ? 'Copied ' : 'Copy ') + title() + ' code'"
          [matTooltip]="isCopied() ? 'Copied' : 'Copy'"
          (click)="copyCode()">
          <mat-icon>{{ isCopied() ? 'check' : 'content_copy' }}</mat-icon>
        </button>
      </figcaption>
      <pre tabindex="0"><code [class]="'language-' + language()" [innerHTML]="highlightedCode()"></code></pre>
    </figure>
  `
})
export class CodeExample {
  readonly title = input.required<string>();
  readonly code = input.required<string>();
  readonly language = input<CodeLanguage>('typescript');

  protected readonly isCopied = signal(false);
  protected readonly highlightedCode = computed(() => highlightCode(this.code(), this.language()));

  protected async copyCode(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.isCopied.set(true);
  }
}
