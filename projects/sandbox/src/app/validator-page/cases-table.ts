import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';

export interface ValidatorCaseRow {
  readonly description: string;
  readonly value: string;
  readonly options: string;
  readonly isValid: boolean;
}

@Component({
  selector: 'fp-cases-table',
  imports: [MatButtonModule, MatIconModule, MatTableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cases-table.scss',
  template: `
    <div class="table-scroll" tabindex="0" role="region" aria-label="Test cases">
      <table mat-table [dataSource]="rows()">
        <caption class="visually-hidden">Every unit-test case</caption>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef scope="col">Case</th>
          <td mat-cell *matCellDef="let caseRow">{{ caseRow.description }}</td>
        </ng-container>
        <ng-container matColumnDef="value">
          <th mat-header-cell *matHeaderCellDef scope="col">Value</th>
          <td mat-cell *matCellDef="let caseRow"><code>{{ caseRow.value }}</code></td>
        </ng-container>
        <ng-container matColumnDef="options">
          <th mat-header-cell *matHeaderCellDef scope="col">Options</th>
          <td mat-cell *matCellDef="let caseRow">{{ caseRow.options }}</td>
        </ng-container>
        <ng-container matColumnDef="expected">
          <th mat-header-cell *matHeaderCellDef scope="col">Expected</th>
          <td mat-cell *matCellDef="let caseRow">
            <span class="result" [class.result-valid]="caseRow.isValid">
              <mat-icon aria-hidden="true">{{ caseRow.isValid ? 'check_circle' : 'cancel' }}</mat-icon>
              {{ caseRow.isValid ? 'valid' : 'invalid' }}
            </span>
          </td>
        </ng-container>
        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef scope="col"><span class="visually-hidden">Action</span></th>
          <td mat-cell *matCellDef="let caseRow; let rowIndex = index">
            <button mat-stroked-button type="button" (click)="applied.emit(rowIndex)">
              Apply<span class="visually-hidden"> case: {{ caseRow.description }}</span>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let caseRow; columns: columns"></tr>
      </table>
    </div>
  `
})
export class CasesTable {
  readonly rows = input.required<readonly ValidatorCaseRow[]>();
  readonly applied = output<number>();

  protected readonly columns = ['description', 'value', 'options', 'expected', 'action'];
}
