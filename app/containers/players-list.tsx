import {
  ColumnDef,
  getCoreRowModel,
  OnChangeFn,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Checkbox } from '~/components/ui/checkbox';
import { ListTemplate } from '~/components/ui/list-template';
import { TPlayer } from '~/types/player';

type TPlayersListProps = {
  players?: TPlayer[];
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  buttonLabel?: string;
};

export const PlayersList: React.FC<TPlayersListProps> = ({
  players,
  rowSelection,
  setRowSelection,
  buttonLabel,
}) => {
  const columns: ColumnDef<TPlayer>[] = [
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

  const table = useReactTable<TPlayer>({
    data: players ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <ListTemplate<TPlayer>
      rowSelection={rowSelection}
      table={table}
      columns={columns}
      data={players ?? []}
      newDataComponent={undefined}
      buttonLabel={buttonLabel}
      title="Choose Players"
      description="Select players to add to the session"
      selectionLabel="Selected Players"
    />
  );
};
