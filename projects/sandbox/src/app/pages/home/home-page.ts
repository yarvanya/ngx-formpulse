import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {CodeExample} from '../../validator-page/code-example';

interface Feature {
  readonly icon: string;
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'fp-home-page',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, CodeExample],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-page.scss',
  templateUrl: './home-page.html'
})
export class HomePage {
  protected readonly installCommand = 'npm install ngx-formpulse';

  protected readonly features: readonly Feature[] = [
    {icon: 'bolt', title: 'One line per validator', text: 'Import a function and add it to a control. No modules, no providers.'},
    {icon: 'verified', title: 'Typed parameters and errors', text: 'Enums instead of magic strings, typed error objects with a ready message.'},
    {icon: 'translate', title: 'Seven languages', text: 'English out of the box; Ukrainian, Spanish, Portuguese, Polish, German and French on demand.'},
    {icon: 'sync_alt', title: 'Reactive and Signal Forms', text: 'The same validators and error shapes in both form systems.'},
    {icon: 'inventory_2', title: 'Zero dependencies', text: 'Tree-shakable and SSR-safe: you ship only what you import.'},
    {icon: 'fact_check', title: 'Tested to the last branch', text: '100% unit-test coverage, type tests and end-to-end tests for every validator.'}
  ];
}
