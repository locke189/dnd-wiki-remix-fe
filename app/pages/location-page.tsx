import React, { useContext, useEffect, useMemo } from 'react';
import { Link, useFetcher } from '@remix-run/react';

import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { EditableText } from '~/components/editable-text';
import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { EditableInput } from '~/components/editable-input';

import { TSession } from '~/types/session';
import {
  LAYOUT_PAGE_HEADER_PORTAL_ID,
  locationTypeOptions,
} from '~/models/global';
import { Portal } from '~/components/portal';
import { TNpc, TNpcRelationship } from '~/types/npc';
import { AvatarList } from '~/components/avatar-list';
import { Check, ChevronsUpDown, Pen, Save, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { useModelList } from '~/hooks/useModelList';
import { AppContext } from '~/context/app.context';
import { TLocation } from '~/types/location';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import { getLocationOptions, getLocationTypeData } from '~/lib/locations';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { NpcList } from '~/containers/npc-list';
import { ImageChooser } from '~/components/image-chooser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { TParty, TPartyRelationship } from '~/types/party';
import { PartiesList } from '~/containers/parties-list';
import { TItem, TItemRelationship } from '~/types/item';
import { ItemsList } from '~/containers/items-list';
import { ContentTodoList, TContentTodo } from '~/containers/content-todo-list';

type TLocationPageProps = {
  location?: TLocation;
  isNew?: boolean;
};

export const LocationPage: React.FC<TLocationPageProps> = ({
  location,
  isNew = false,
}) => {
  const [submitted, setSubmitted] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(isNew);
  const [selectedImageId, setSelectedImageId] = React.useState<string | null>(
    location?.main_image.split('/').pop() ?? null
  );
  const [selectedMapImageId, setSelectedMapImageId] = React.useState<
    string | null
  >(location?.map_image.split('/').pop() ?? null);
  const [selectedDMMapImageId, setSelectedDMMapImageId] = React.useState<
    string | null
  >(location?.dm_map_image.split('/').pop() ?? null);

  const [rooms, setRooms] = React.useState<TContentTodo[]>(
    location?.rooms ?? []
  );

  const appContext = useContext(AppContext);
  const {
    sessions,
    npcs,
    locations,
    selectedCampaignId,
    images,
    parties,
    items,
  } = appContext || {};

  const fetcher = useFetcher();

  // const {
  //   rowSelection: playersRowSelection,
  //   getSelectedRelations: getSelectedPlayerRelations,
  //   setRowSelection: setPlayerRowSelection,
  //   dataInCampaign: playersInCampaign,
  // } = useModelList<TPlayerRelationship, TPlayer>({
  //   relations: npc?.Allied_Players || [],
  //   relationsKey: 'Player_id',
  //   data: players || [],
  //   selectedCampaignId: selectedCampaignId ?? 0,
  // });

  const {
    dataInCampaign: npcsInCampaign,
    rowSelection: npcsRowSelection,
    getSelectedRelations: getSelectedNpcRelations,
    setRowSelection: setNpcRowSelection,
  } = useModelList<TNpcRelationship, TNpc>({
    relations: location?.Npcs || [],
    relationsKey: 'Npc_id',
    data: npcs || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  }); // sessions

  const {
    dataInCampaign: partiesInCampaign,
    rowSelection: partiesRowSelection,
    getSelectedRelations: getSelectedPartiesRelations,
    setRowSelection: setPartiesRowSelection,
  } = useModelList<TPartyRelationship, TParty>({
    relations: location?.Parties || [],
    relationsKey: 'Parties_id',
    data: parties || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  });

  const {
    dataInCampaign: itemsInCampaign,
    rowSelection: itemsRowSelection,
    getSelectedRelations: getSelectedItemsRelations,
    setRowSelection: setItemsRowSelection,
  } = useModelList<TItemRelationship, TItem>({
    relations: location?.items || [],
    relationsKey: 'Items_id',
    data: items || [],
  });

  // const isLoading = fetcher.state === 'loading';

  const formSchema = z.object({
    name: z.string().optional(),
    type: z.string().optional(),
    parent_location: z.number().optional(),
    description: z.string().optional(),
    master_notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location?.name ?? '',
      type: location?.type ?? '',
      parent_location: location?.parent_location ?? -1,
      description: location?.description ?? '',
      master_notes: location?.master_notes ?? '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Submitting', values.parent_location);
    setSubmitted(true);
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
          Npcs: getSelectedNpcRelations(npcsRowSelection),
          ...(selectedImageId && {
            main_image: selectedImageId,
          }),
          ...(selectedMapImageId && {
            map_image: selectedMapImageId,
          }),
          ...(selectedDMMapImageId && {
            dm_map_image: selectedDMMapImageId,
          }),
          rooms: rooms,
          parent_location:
            values.parent_location === 0 ? null : values.parent_location,
          Parties: getSelectedPartiesRelations(partiesRowSelection),
          items: getSelectedItemsRelations(itemsRowSelection),
          ...(isNew && {
            campaigns: [
              {
                campaigns_id: selectedCampaignId,
              },
            ],
          }),
        }),
      },
      {
        method: 'POST',
      }
    );
  };

  const onDelete = () => {
    setSubmitted(true);
    fetcher.submit(
      {},
      {
        method: 'POST',
        action: '/location/' + location?.id + '/delete',
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  const locationSessions = useMemo(() => {
    return location?.sessions
      ?.map((session) => {
        return sessions?.find((s) => s.id == session.sessions_id);
      })
      .sort((a, b) => {
        return (
          new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime()
        );
      });
  }, [location?.sessions, sessions]);

  // console.log('npcSessions', npcSessions, npc?.sessions, sessions);

  const locationNpcs = npcs?.filter((npc) =>
    location?.Npcs?.find((p) => p.Npc_id === npc.id)
  );

  const locationParties = parties?.filter((party) =>
    location?.Parties?.find((p) => p.Parties_id === party.id)
  );

  const locationItems = items?.filter((item) =>
    location?.items?.find((p) => p.Items_id === item.id)
  );

  return (
    // navbar
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Portal portalId={LAYOUT_PAGE_HEADER_PORTAL_ID}>
            <header className="flex justify-between items-center w-full">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-0 flex items-center">
                      <FormControl>
                        <EditableInput
                          fieldName="Name"
                          field={field}
                          edit={isEditing}
                          type="text"
                          noLabel
                          placeholder="Name..."
                        >
                          <h1 className="text-2xl font-bold">{field?.value}</h1>
                        </EditableInput>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {!isEditing && location?.type && (
                  <p className="text-xl text-slate-500 align-middle flex items-center gap-2">
                    {getLocationTypeData(location?.type).icon}
                    {`${getLocationTypeData(location?.type).name}`}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                {!isNew && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive">
                        <Trash />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this player.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => onDelete()}
                          >
                            <Trash />
                            Delete
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    isEditing && form.handleSubmit(onSubmit)();
                  }}
                  type="button"
                >
                  {isEditing ? (
                    <>
                      <Save /> Save
                    </>
                  ) : (
                    <>
                      <Pen /> Edit
                    </>
                  )}
                </Button>
              </div>
            </header>
          </Portal>
          <div className="grid auto-rows-min gap-4 lg:grid-cols-12 grid-cols-8 mx-8 space-y-8">
            <div className="col-span-8 lg:col-span-8 mt-8">
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="master_notes">Notes</TabsTrigger>
                    {location?.type === 'inn_tavern_shop' && (
                      <TabsTrigger value="items">Items</TabsTrigger>
                    )}
                    {location?.type === 'dungeon_cave' && (
                      <TabsTrigger value="map">Map</TabsTrigger>
                    )}
                    {location?.type === 'dungeon_cave' && (
                      <TabsTrigger value="dm-map">DM Map</TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="description">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <EditableText
                              fieldName="Description"
                              field={field}
                              edit={isEditing}
                              defaultOpen
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="master_notes">
                    <FormField
                      control={form.control}
                      name="master_notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <EditableText
                              fieldName="Notes"
                              field={field}
                              edit={isEditing}
                              defaultOpen
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  {location?.type === 'inn_tavern_shop' && (
                    <TabsContent value="items">
                      <ItemsList
                        items={items}
                        buttonLabel="Choose Items"
                        onlyTable
                        noPagination
                      />
                    </TabsContent>
                  )}
                  {location?.type === 'dungeon_cave' && (
                    <TabsContent value="map">
                      <div className="h-96 bg-muted/50 rounded-xl">
                        {!isEditing && location.map_image && (
                          <img
                            src={location.map_image}
                            alt="Map"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        )}
                        {isEditing && (
                          <ImageChooser
                            images={images ?? []}
                            selectedImageId={selectedMapImageId}
                            setSelectedImageId={setSelectedMapImageId}
                          />
                        )}
                      </div>
                    </TabsContent>
                  )}
                  {location?.type === 'dungeon_cave' && (
                    <TabsContent value="dm-map">
                      <div className="h-96 bg-muted/50 rounded-xl">
                        {!isEditing && location.dm_map_image && (
                          <img
                            src={location.dm_map_image}
                            alt="Map"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        )}
                        {isEditing && (
                          <ImageChooser
                            images={images ?? []}
                            selectedImageId={selectedDMMapImageId}
                            setSelectedImageId={setSelectedDMMapImageId}
                          />
                        )}
                      </div>
                      <ContentTodoList
                        data={rooms}
                        setData={setRooms}
                        title="Rooms"
                        isEditing={isEditing}
                      />
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>
            <div className="col-span-4 lg:col-span-4">
              <Card className="col-span-2 rounded-xl bg-muted/50 ">
                {!isEditing && (
                  <CardHeader
                    className="rounded-t-xl bg-muted/50 h-[300px]"
                    style={{
                      backgroundImage: `url('${location?.main_image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></CardHeader>
                )}
                {isEditing && (
                  <ImageChooser
                    images={images ?? []}
                    selectedImageId={selectedImageId}
                    setSelectedImageId={setSelectedImageId}
                  />
                )}
                <CardContent className="pt-6">
                  {!isEditing && (
                    <>
                      <div className="flex flex-col gap-4">
                        <div>
                          <AvatarList<TLocation>
                            title="Sub Locations"
                            data={location?.sub_locations}
                            routePrefix="/location/"
                          />
                        </div>
                        <div>
                          <AvatarList<TNpc>
                            title="NPCs"
                            data={locationNpcs}
                            routePrefix="/npc/"
                          />
                        </div>
                        <div>
                          <AvatarList<TParty>
                            title="Parties"
                            data={locationParties}
                            routePrefix="/party/"
                          />
                        </div>
                        <div>
                          <AvatarList<TItem>
                            title="Items"
                            data={locationItems}
                            routePrefix="/item/"
                          />
                        </div>
                        {(locationSessions ?? []).length > 0 && (
                          <div className="flex flex-col gap-2">
                            <h2 className="text-lg font-bold">Sessions</h2>
                            <ScrollArea className="h-32 w-full rounded-md border">
                              <div className="p-4" key={1}>
                                {locationSessions?.map((session?: TSession) => (
                                  <Link
                                    to={'/session/' + session?.id}
                                    key={session?.id}
                                  >
                                    <div className="text-sm">
                                      {session?.name}
                                    </div>
                                    <Separator className="my-2" />
                                  </Link>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <div
                        className={
                          isEditing
                            ? 'grid space-y-0 auto-rows-min md:grid-cols-2 gap-2'
                            : ''
                        }
                      >
                        <>
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a location type..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {locationTypeOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </>
                      </div>
                      <div className="my-4 flex flex-col gap-2">
                        <FormField
                          control={form.control}
                          name="parent_location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parent Location</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        'w-full justify-between',
                                        !field.value && 'text-muted-foreground'
                                      )}
                                    >
                                      {field?.value ?? -1 > 0
                                        ? getLocationOptions(
                                            locations ?? []
                                          ).find(
                                            (location) =>
                                              location.value === field.value
                                          )?.label ?? 'Select'
                                        : 'Select'}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[526px] p-0">
                                  <Command>
                                    <CommandInput placeholder="Search location..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No language found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        <CommandItem
                                          value={'none'}
                                          onSelect={() => {
                                            form.setValue(
                                              'parent_location',
                                              -1
                                            );
                                          }}
                                        >
                                          None
                                          <Check
                                            className={cn(
                                              'ml-auto',
                                              -1 === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                        </CommandItem>
                                        {getLocationOptions(
                                          locations ?? []
                                        ).map((location) => (
                                          <CommandItem
                                            value={location.label}
                                            key={location.value}
                                            onSelect={() => {
                                              form.setValue(
                                                'parent_location',
                                                location.value
                                              );
                                            }}
                                          >
                                            {location.label}
                                            <Check
                                              className={cn(
                                                'ml-auto',
                                                location.value === field.value
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <h2 className="text-lg font-bold">NPCs</h2>
                        <NpcList
                          npcs={npcsInCampaign}
                          rowSelection={npcsRowSelection}
                          setRowSelection={setNpcRowSelection}
                          buttonLabel="Choose NPCs"
                        />
                        <PartiesList
                          parties={partiesInCampaign}
                          rowSelection={partiesRowSelection}
                          setRowSelection={setPartiesRowSelection}
                          buttonLabel="Choose Parties"
                        />
                        <ItemsList
                          items={itemsInCampaign}
                          rowSelection={itemsRowSelection}
                          setRowSelection={setItemsRowSelection}
                          buttonLabel="Choose Items"
                          onlyKeyItems
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
