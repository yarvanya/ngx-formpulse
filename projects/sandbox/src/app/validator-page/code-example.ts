import {LiveAnnouncer} from '@angular/cdk/a11y';
import {ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, signal, untracked} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {type CodeLanguage, highlightCode} from './code-highlighter';

type CopyState = 'idle' | 'copied' | 'failed';

const COPY_STATE_DURATION_MILLISECONDS = 2000;

const COPY_ICONS: Readonly<Record<CopyState, string>> = {
  idle: 'content_copy',
  copied: 'check',
  failed: 'error'
};

const COPY_TOOLTIPS: Readonly<Record<CopyState, string>> = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Copy failed'
};

@Component({
  selector: 'fp-code-example',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './code-example.scss',
  template: `
    <figure class="code-example">
      <figcaption>
        <span class="code-title">{{ title() }}</span>
        <button mat-icon-button type="button" [attr.aria-label]="buttonLabel()" [matTooltip]="copyTooltip()" (click)="copyCode()">
          <mat-icon>{{ copyIcon() }}</mat-icon>
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

  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly copyState = signal<CopyState>('idle');
  protected readonly highlightedCode = computed(() => highlightCode(this.code(), this.language()));
  protected readonly copyIcon = computed(() => COPY_ICONS[this.copyState()]);
  protected readonly copyTooltip = computed(() => COPY_TOOLTIPS[this.copyState()]);
  protected readonly buttonLabel = computed(() => (this.copyState() === 'copied' ? `Copied ${this.title()} code` : `Copy ${this.title()} code`));

  constructor() {
    effect(() => {
      this.code();
      untracked(() => {
        this.copyState.set('idle');
      });
    });
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.resetTimer);
    });
  }

  protected async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.showCopyState('copied', `${this.title()} code copied to the clipboard.`);
    } catch {
      this.showCopyState('failed', `Could not copy the ${this.title()} code.`);
    }
  }

  private showCopyState(copy_state: CopyState, announcement: string): void {
    this.copyState.set(copy_state);
    void this.liveAnnouncer.announce(announcement, 'polite');
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => {
      this.copyState.set('idle');
    }, COPY_STATE_DURATION_MILLISECONDS);
  }
}
