import {BreakpointObserver} from '@angular/cdk/layout';
import {DOCUMENT} from '@angular/common';
import {afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {map} from 'rxjs';
import {NAVIGATION_SECTIONS} from './navigation-links';

const WIDE_SCREEN_QUERY = '(min-width: 960px)';

@Component({
  selector: 'fp-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {
  protected readonly repositoryUrl = 'https://github.com/yarvanya/ngx-formpulse';
  protected readonly navigationSections = NAVIGATION_SECTIONS;

  protected readonly isWideScreen = toSignal(
    inject(BreakpointObserver).observe(WIDE_SCREEN_QUERY).pipe(map((breakpoint_state) => breakpoint_state.matches)),
    {initialValue: true}
  );

  protected readonly isNavigationOpenOnNarrowScreen = signal(false);
  protected readonly isNavigationOpen = computed(() => this.isWideScreen() || this.isNavigationOpenOnNarrowScreen());

  constructor() {
    const hostDocument = inject(DOCUMENT);
    afterNextRender(() => {
      hostDocument.documentElement.dataset['appReady'] = 'true';
    });
  }

  protected skipToMainContent(click_event: Event, main_content: HTMLElement): void {
    click_event.preventDefault();
    main_content.focus();
  }

  protected closeNavigationOnNarrowScreen(): void {
    this.isNavigationOpenOnNarrowScreen.set(false);
  }
}
