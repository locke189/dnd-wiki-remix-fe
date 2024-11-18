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
import { Input } from '~/components/ui/input';
import { TLocation, TLocationType } from '~/types/location';
import { getLocationTypeData } from '~/lib/locations';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import { NewLocation } from './new-location';
import { Plus } from 'lucide-react';

type TSessionLocationsProps = {
  gameSession?: TSession;
  locations?: TLocation[];
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
};

export const SessionLocations: React.FC<TSessionLocationsProps> = ({
  locations,
  gameSession,
  rowSelection,
  setRowSelection,
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });

  const columns: ColumnDef<TLocation>[] = [
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
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span>{getLocationTypeData(row.getValue('type')).icon}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getLocationTypeData(row.getValue('type')).name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'parent_location',
      header: 'Parent Location',
      cell: ({ row }) => {
        const parentLocation = locations?.find(
          (location) => location.id === row.getValue('parent_location')
        );

        return parentLocation ? (
          <span>{parentLocation.name}</span>
        ) : (
          <span>None</span>
        );
      },
    },
    {
      accessorKey: 'Locations',
      header: 'Sub Locations',
      cell: ({ row }) => {
        const subLocations: TLocation[] = row.getValue('Locations');

        return subLocations.length ? (
          <span className="truncate">
            {subLocations.map((sl) => sl.name).join(', ')}
          </span>
        ) : (
          <span>None</span>
        );
      },
    },
  ];

  const locationsInCampaign = useMemo(
    () =>
      locations?.filter((location) =>
        location.campaigns.some(
          (campaign) => campaign.campaigns_id === gameSession?.campaign
        )
      ),
    [locations, gameSession]
  );

  const getInitialRowSelection = useCallback(() => {
    const selection: { [key: number]: boolean } = {};
    locationsInCampaign?.forEach((location, index) => {
      if (gameSession?.Locations.some((n) => n.Locations_id === location.id)) {
        selection[index] = true;
      }
    });
    return selection;
  }, [gameSession, locationsInCampaign]);

  // const [rowSelection, setRowSelection] = useState(getInitialRowSelection());

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable<TLocation>({
    data: locationsInCampaign ?? [],
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
          <Button variant="outline">Choose locations</Button>
        </DialogTrigger>
        <DialogContent className="max-w-fit">
          <DialogHeader>
            <DialogTitle>Choose Locations</DialogTitle>
            <DialogDescription>
              Select the locations in this session
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border">
            <div className="flex items-center justify-between p-4">
              <Input
                placeholder="Filter..."
                value={table.globalFilter}
                onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                className="max-w-sm"
              />
              <NewLocation>
                <Button variant={'outline'} onClick={() => {}}>
                  <Plus />
                </Button>
              </NewLocation>
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
        Selected Locations:{' '}
        {Object.keys(rowSelection)
          .map((index) => locationsInCampaign?.[index].name)
          .join(', ')}
      </p>
    </>
  );
};
