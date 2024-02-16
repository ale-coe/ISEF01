import { MatPaginatorIntl } from '@angular/material/paginator';

const rangeLabel = (page: number, pageSize: number, length: number) => {
  if (!length || !pageSize) {
    return `0 von ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} von ${length}`;
};

export function germanPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Fragen pro Seite:';
  paginatorIntl.nextPageLabel = 'Nächste Seite';
  paginatorIntl.previousPageLabel = 'Vorherige Seite';
  paginatorIntl.getRangeLabel = rangeLabel;

  return paginatorIntl;
}
