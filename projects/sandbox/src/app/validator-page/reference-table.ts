import {ChangeDetectionStrategy, Component, computed, effect, input, signal, viewChild} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

export interface ReferenceColumn {
  readonly key: string;
  readonly header: string;
  readonly isCode: boolean;
}

export type ReferenceRow = Readonly<Record<string, string>>;

const PAGE_SIZE = 20;
const LARGE_PAGE_SIZE = 50;
const ALL_ROWS_PAGE_SIZE = 250;
const PAGE_SIZE_OPTIONS = [PAGE_SIZE, LARGE_PAGE_SIZE, ALL_ROWS_PAGE_SIZE];

@Component({
  selector: 'fp-reference-table',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatTableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './reference-table.scss',
  templateUrl: './reference-table.html'
})
export class ReferenceTable {
  readonly caption = input.required<string>();
  readonly columns = input.required<readonly ReferenceColumn[]>();
  readonly rows = input.required<readonly ReferenceRow[]>();
  readonly isSearchable = input(false);

  protected readonly pageSize = PAGE_SIZE;
  protected readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  protected readonly searchText = signal('');
  protected readonly columnKeys = computed(() => this.columns().map((reference_column) => reference_column.key));
  protected readonly dataSource = new MatTableDataSource<ReferenceRow>([]);

  private readonly paginator = viewChild(MatPaginator);

  constructor() {
    effect(() => {
      this.dataSource.data = [...this.rows()];
    });
    effect(() => {
      this.dataSource.filter = this.searchText().trim().toLowerCase();
    });
    effect(() => {
      const paginator = this.paginator();
      if (paginator !== undefined) {
        this.dataSource.paginator = paginator;
      }
    });
  }
}
