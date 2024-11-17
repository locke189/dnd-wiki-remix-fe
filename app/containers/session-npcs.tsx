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
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  OnChangeFn,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { TSession } from '~/types/session';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { TNpc } from '~/types/npc';
import { Input } from '~/components/ui/input';

type TSessionNpcsProps = {
  gameSession?: TSession;
  npcs?: TNpc[];
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
};

export const SessionNpcs: React.FC<TSessionNpcsProps> = ({
  npcs,
  gameSession,
  rowSelection,
  setRowSelection,
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });

  const columns: ColumnDef<TNpc>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'main_image',
      header: '',
      cell: ({ row }) => {
        const image = String(row.getValue('main_image'));
        const fallback = String(row.getValue('name'));

        return (
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>
              {fallback
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'class',
      header: 'Class',
    },
    {
      accessorKey: 'race',
      header: 'Race',
    },
  ];

  const npcsInCampaign = useMemo(
    () =>
      npcs?.filter((npc) =>
        npc.campaigns.some(
          (campaign) => campaign.campaigns_id === gameSession?.campaign
        )
      ),
    [npcs, gameSession]
  );

  const getInitialRowSelection = useCallback(() => {
    const selection: { [key: number]: boolean } = {};
    npcsInCampaign?.forEach((npc, index) => {
      if (gameSession?.Npcs.some((n) => n.Npc_id === npc.id)) {
        selection[index] = true;
      }
    });
    return selection;
  }, [gameSession, npcsInCampaign]);

  // const [rowSelection, setRowSelection] = useState(getInitialRowSelection());

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable<TNpc>({
    data: npcsInCampaign ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    globalFilterFn: 'includesString',
    state: {
      rowSelection,
      columnFilters,
      pagination,
    },
  });

  useEffect(() => {
    setRowSelection(getInitialRowSelection());
  }, [getInitialRowSelection, setRowSelection]);

  return (
    <>
      <Dialog onOpenChange={() => table.setGlobalFilter('')}>
        <DialogTrigger asChild>
          <Button variant="outline">Choose NPCs</Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Choose Players</DialogTitle>
            <DialogDescription>
              Select the NPCs in this session
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter..."
              value={table.globalFilter}
              onChange={(e) => table.setGlobalFilter(String(e.target.value))}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
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
        Selected Npcs:{' '}
        {Object.keys(rowSelection)
          .map((index) => npcsInCampaign?.[index].name)
          .join(', ')}
      </p>
    </>
  );
};
