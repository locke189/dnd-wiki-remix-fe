import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  OnChangeFn,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { ListTemplate } from '~/components/list-template';
import { TParty } from '~/types/party';

type TPartiesListProps = {
  parties?: TParty[];
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  buttonLabel?: string;
};

export const PartiesList: React.FC<TPartiesListProps> = ({
  parties,
  rowSelection,
  setRowSelection,
  buttonLabel,
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });

  const columns: ColumnDef<TParty>[] = [
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
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable<TParty>({
    data: parties ?? [],
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

  return (
    <ListTemplate<TParty>
      rowSelection={rowSelection}
      table={table}
      columns={columns}
      data={parties ?? []}
      newDataComponent={
        <></>
        // <NewNpc>
        //   <Button type="button">
        //     <PlusCircleIcon />
        //   </Button>
        // </NewNpc>
      }
      buttonLabel={buttonLabel}
      title="Choose Parties"
      description="Select the parties you want to add"
      selectionLabel="Selected Parties"
    />
  );
};
