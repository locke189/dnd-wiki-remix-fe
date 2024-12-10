import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { ColumnDef, flexRender, useReactTable } from '@tanstack/react-table';

import { Input } from '~/components/ui/input';
import { debounce } from '~/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export type TListTemplate<T> = {
  rowSelection?: Record<string, boolean>;
  buttonLabel?: string;
  table: ReturnType<typeof useReactTable<T>>;
  columns: ColumnDef<T>[];
  data: T[];
  newDataComponent: React.ReactNode;
  title?: string;
  description?: string;
  selectionLabel?: string;
  onlyTable?: boolean;
  noPagination?: boolean;
  showVisibility?: boolean;
};

export function ListTemplate<T extends { name: string }>({
  rowSelection,
  buttonLabel,
  table,
  columns,
  data,
  newDataComponent,
  title,
  description,
  selectionLabel,
  onlyTable,
  noPagination,
  showVisibility,
}: TListTemplate<T>) {
  const onChange = (e) => table.setGlobalFilter(String(e.target.value));
  const debouncedOnChange = debounce(onChange, 300);

  console.log(table.getHeaderGroups());

  const ListTable = (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4">
        <Input
          placeholder="Find..."
          value={table.globalFilter}
          onChange={debouncedOnChange}
          className="max-w-sm"
        />
        <div className="flex gap-4">
          {newDataComponent && newDataComponent}
          {showVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <Table className="relative">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {!noPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );

  return onlyTable ? (
    ListTable
  ) : (
    <div>
      <Dialog onOpenChange={() => table.setGlobalFilter('')}>
        <DialogTrigger asChild>
          <Button variant="outline">{buttonLabel ?? 'Choose'}</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit">
          <DialogHeader>
            <DialogTitle>{title ?? 'Choose NPCs'}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {ListTable}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="mt-3">
        {`${selectionLabel ? selectionLabel : 'Selected'}`}:{' '}
        {Object.keys(rowSelection ?? {})
          .map((index) => data?.[Number(index)]?.name ?? '')
          .join(', ')}
      </p>
    </div>
  );
}
