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

export type TListTemplate<T> = {
  rowSelection: Record<string, boolean>;
  buttonLabel?: string;
  table: ReturnType<typeof useReactTable<T>>;
  columns: ColumnDef<T>[];
  data: T[];
  newDataComponent: React.ReactNode;
  title?: string;
  description?: string;
  selectionLabel?: string;
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
}: TListTemplate<T>) {
  return (
    <div>
      <Dialog onOpenChange={() => table.setGlobalFilter('')}>
        <DialogTrigger asChild>
          <Button variant="outline">{buttonLabel ?? 'Choose'}</Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{title ?? 'Choose NPCs'}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="rounded-md border">
            <div className="flex items-center justify-between p-4">
              <Input
                placeholder="Filter..."
                value={table.globalFilter}
                onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                className="max-w-sm"
              />
              {newDataComponent && newDataComponent}
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
          </div>
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
        {Object.keys(rowSelection)
          .map((index) => data?.[Number(index)]?.name ?? '')
          .join(', ')}
      </p>
    </div>
  );
}
