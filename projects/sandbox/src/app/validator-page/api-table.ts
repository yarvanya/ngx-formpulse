import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatTableModule} from '@angular/material/table';

export interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly required: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'fp-api-table',
  imports: [MatTableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .table-scroll {
      overflow-x: auto;
      margin-bottom: var(--fp-space-large);
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 12px;
    }

    table {
      width: 100%;
    }

    caption {
      padding: var(--fp-space-medium);
      text-align: left;
      font: var(--mat-sys-title-medium);
    }
  `,
  template: `
    <div class="table-scroll" tabindex="0" role="region" [attr.aria-label]="caption()">
      <table mat-table [dataSource]="rows()">
        <caption>{{ caption() }}</caption>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef scope="col">Name</th>
          <td mat-cell *matCellDef="let apiRow"><code>{{ apiRow.name }}</code></td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef scope="col">Type</th>
          <td mat-cell *matCellDef="let apiRow"><code>{{ apiRow.type }}</code></td>
        </ng-container>
        <ng-container matColumnDef="required">
          <th mat-header-cell *matHeaderCellDef scope="col">Required</th>
          <td mat-cell *matCellDef="let apiRow">{{ apiRow.required }}</td>
        </ng-container>
        <ng-container matColumnDef="defaultValue">
          <th mat-header-cell *matHeaderCellDef scope="col">Default</th>
          <td mat-cell *matCellDef="let apiRow">{{ apiRow.defaultValue }}</td>
        </ng-container>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef scope="col">Description</th>
          <td mat-cell *matCellDef="let apiRow">{{ apiRow.description }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let apiRow; columns: columns"></tr>
      </table>
    </div>
  `
})
export class ApiTable {
  readonly caption = input.required<string>();
  readonly rows = input.required<readonly ApiRow[]>();

  protected readonly columns = ['name', 'type', 'required', 'defaultValue', 'description'];
}
