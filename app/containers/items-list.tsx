import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useEffect, useMemo, useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { ListTemplate } from '~/components/list-template';
import { TItem } from '~/types/item';
import React from 'react';
import { Button } from '~/components/ui/button';
import { ArrowUpDown, Filter } from 'lucide-react';
import { debounce } from '~/lib/utils';
import {
  DropdownMenu,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

type TItemsListProps = {
  items?: TItem[];
  rowSelection?: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  buttonLabel?: string;
  noPagination?: boolean;
};

function FilterDropdown({ column }: { column: Column<any, unknown> }) {
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant]
  );

  console.log('check', columnFilterValue);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0">
          <Filter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          key={''}
          className="capitalize"
          checked={columnFilterValue == ''}
          onCheckedChange={() => column.setFilterValue('')}
        >
          All
        </DropdownMenuCheckboxItem>
        {sortedUniqueValues.map((value) => (
          //dynamically generated select options from faceted values feature
          <DropdownMenuCheckboxItem
            key={value}
            className="capitalize"
            checked={columnFilterValue === value}
            onCheckedChange={() => column.setFilterValue(value)}
          >
            {value}
          </DropdownMenuCheckboxItem>
        ))}
        {/* {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const ItemsList: React.FC<TItemsListProps> = ({
  items,
  rowSelection,
  setRowSelection,
  buttonLabel,
  noPagination,
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<TItem>[] = useMemo(
    () => [
      ...(rowSelection
        ? [
            {
              id: 'select',
              header: ({ table }) => (
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
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
          ]
        : []),
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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'price',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="p-0"
            >
              Price
              <ArrowUpDown />
            </Button>
          );
        },
      },
      {
        accessorKey: 'type',
        meta: {
          filterVariant: 'select',
        },
        header: ({ column }) => {
          return (
            <div>
              <div className="flex gap-1 items-center">
                Type
                <Button
                  variant="ghost"
                  className="p-0"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                  }
                >
                  <ArrowUpDown />
                </Button>
                <FilterDropdown column={column} />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'rarity',
        header: ({ column }) => {
          return (
            <div>
              <div className="flex gap-1 items-center">
                Rarity
                <Button
                  variant="ghost"
                  className="p-0"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                  }
                >
                  <ArrowUpDown />
                </Button>
                <FilterDropdown column={column} />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'is_service',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Is Service
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'favorite',

        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Favorite
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
    ],
    [rowSelection]
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      select: true,
      main_image: false,
      name: true,
      description: true,
      price: true,
      type: true,
      rarity: true,
      is_service: false,
      favorite: false,
    });

  const table = useReactTable<TItem>({
    data: items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection ?? (() => {}),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: noPagination ? () => {} : setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    globalFilterFn: 'includesString',
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(),

    state: {
      rowSelection: rowSelection ?? {},
      columnFilters,
      pagination: noPagination ? { pageIndex: 0, pageSize: -1 } : pagination,
      sorting,
      columnVisibility,
    },
  });

  return (
    <ListTemplate<TItem>
      rowSelection={rowSelection}
      table={table}
      columns={columns}
      data={items ?? []}
      newDataComponent={
        <></>
        // <NewNpc>
        //   <Button type="button">
        //     <PlusCircleIcon />
        //   </Button>
        // </NewNpc>
      }
      buttonLabel={buttonLabel}
      title="Choose Items"
      description="Select the Items you want to add"
      selectionLabel="Selected Items"
      onlyTable
      noPagination={noPagination}
      showVisibility
    />
  );
};
