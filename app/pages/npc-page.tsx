import React, { useContext, useEffect, useMemo } from 'react';
import { Link, useFetcher } from '@remix-run/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '~/components/ui/card';
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
} from '~/components/ui/form';
import { EditableInput } from '~/components/editable-input';

import { TPlayer, TPlayerRelationship } from '~/types/player';
import { TSession } from '~/types/session';
import {
  ageOptions,
  classOptions,
  entityCategoryOptions,
  genderOptions,
  jobOptions,
  LAYOUT_PAGE_HEADER_PORTAL_ID,
  raceOptions,
} from '~/models/global';
import { Portal } from '~/components/portal';
import { TNpc } from '~/types/npc';
import { AvatarList } from '~/components/avatar-list';
import { Pen, Save, Shuffle, Trash } from 'lucide-react';
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
import { PlayersList } from '~/containers/players-list';
import { TLocation, TLocationsRelationship } from '~/types/location';
import { LocationsList } from '~/containers/locations-list';
import { ImageChooser } from '~/components/image-chooser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { TParty, TPartyRelationship } from '~/types/party';
import { PartiesList } from '~/containers/parties-list';
import { TItem, TItemRelationship } from '~/types/item';
import { ItemsList } from '~/containers/items-list';
import { getLabelFromOptions, randomizeNPC } from '~/lib/utils';
import { getRandomBackstory } from '~/models/backstory';
import { ToggleIcon } from '~/components/toggle-icon';
import { useFavorite } from '~/hooks/set-favorite';

type TNpcPageProps = {
  npc?: TNpc;
  isNew?: boolean;
};

export const NpcPage: React.FC<TNpcPageProps> = ({ npc, isNew = false }) => {
  const [submitted, setSubmitted] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(isNew);
  const [selectedImageId, setSelectedImageId] = React.useState(
    npc?.main_image.split('/').pop() ?? ''
  );
  const { setFavorite } = useFavorite();

  const appContext = useContext(AppContext);
  const {
    sessions,
    players,
    locations,
    selectedCampaignId,
    images,
    parties,
    items,
  } = appContext || {};

  const fetcher = useFetcher();
  const {
    rowSelection: playersRowSelection,
    getSelectedRelations: getSelectedPlayerRelations,
    setRowSelection: setPlayerRowSelection,
    dataInCampaign: playersInCampaign,
  } = useModelList<TPlayerRelationship, TPlayer>({
    relations: npc?.Allied_Players || [],
    relationsKey: 'Player_id',
    data: players || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  });

  const {
    rowSelection: partyRowSelection,
    getSelectedRelations: getSelectedPartyRelations,
    setRowSelection: setPartyRowSelection,
    dataInCampaign: partiesInCampaign,
  } = useModelList<TPartyRelationship, TParty>({
    relations: npc?.Parties || [],
    relationsKey: 'Parties_id',
    data: parties || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  });

  const {
    rowSelection: itemsRowSelection,
    getSelectedRelations: getSelectedItemsRelations,
    setRowSelection: setItemsRowSelection,
  } = useModelList<TItemRelationship, TItem>({
    relations: npc?.Items || [],
    relationsKey: 'Items_id',
    data: items || [],
  });

  const {
    dataInCampaign: locationsInCampaign,
    rowSelection: locationRowSelection,
    getSelectedRelations: getSelectedLocationRelations,
    setRowSelection: setLocationRowSelection,
  } = useModelList<TLocationsRelationship, TLocation>({
    relations: npc?.Locations || [],
    relationsKey: 'Locations_id',
    data: locations || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  }); // sessions

  // const isLoading = fetcher.state === 'loading';

  const formSchema = z.object({
    name: z.string().optional(),
    class: z.string().optional(),
    race: z.string().optional(),
    age: z.string().optional(),
    gender: z.string().optional(),
    job: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    description: z.string().optional(),
    story: z.string().optional(),
    master_notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: npc?.name ?? '',
      class: npc?.class ?? '',
      race: npc?.race ?? '',
      age: npc?.age ?? '0',
      gender: npc?.gender ?? '',
      story: npc?.story ?? '',
      description: npc?.description ?? '',
      master_notes: npc?.master_notes ?? '',
      job: npc?.job ?? '',
      category: npc?.category ?? '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Submitting');
    setSubmitted(true);
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
          Allied_Players: getSelectedPlayerRelations(playersRowSelection),
          Locations: getSelectedLocationRelations(locationRowSelection),
          Parties: getSelectedPartyRelations(partyRowSelection),
          Items: getSelectedItemsRelations(itemsRowSelection),
          ...(selectedImageId && {
            main_image: selectedImageId,
          }),
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
        action: '/Npc/' + npc?.id + '/delete',
      }
    );
  };

  const onRandomize = () => {
    const randomNpc = randomizeNPC();
    form.setValue('name', randomNpc.name);
    form.setValue('gender', randomNpc.gender);
    form.setValue('class', randomNpc.class);
    form.setValue('race', randomNpc.race);
    form.setValue('description', randomNpc.description);
    form.setValue('story', getRandomBackstory());
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  const npcSessions = useMemo(() => {
    return npc?.sessions
      ?.map((session) => {
        return sessions?.find((s) => s.id == session.sessions_id);
      })
      .sort((a, b) => {
        return (
          new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime()
        );
      });
  }, [npc?.sessions, sessions]);

  const npcPlayers = players?.filter((player) =>
    npc?.Allied_Players?.find((p) => p.Player_id === player.id)
  );

  const npcLocations = locations?.filter((location) =>
    npc?.Locations?.find((l) => l.Locations_id === location.id)
  );

  const npcParties = parties?.filter((party) =>
    npc?.Parties?.find((p) => p.Parties_id === party.id)
  );

  const npcItems = items?.filter((item) =>
    npc?.Items?.find((i) => i.Items_id === item.id)
  );

  const genderLabel = getLabelFromOptions({
    options: genderOptions,
    value: npc?.gender ?? '',
  });
  const raceLabel = getLabelFromOptions({
    options: raceOptions,
    value: npc?.race ?? '',
  });
  const classLabel = getLabelFromOptions({
    options: classOptions,
    value: npc?.class ?? '',
  });
  // const ageLabel = getLabelFromOptions({
  //   options: ageOptions,
  //   value: npc?.age ?? '',
  // });

  const jobLabel = getLabelFromOptions({
    options: genderOptions,
    value: npc?.job ?? '',
  });

  const categoryLabel = getLabelFromOptions({
    options: genderOptions,
    value: npc?.category ?? '',
  });

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
                {!isNew && (
                  <ToggleIcon
                    isToggled={npc?.favorite ?? false}
                    onClick={() => setFavorite(!npc?.favorite)}
                  />
                )}
                {!isEditing && (
                  <div>
                    <p className="text-md text-slate-500 align-middle">
                      {`${jobLabel} - ${categoryLabel}`}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {isNew && (
                  <Button
                    type="button"
                    onClick={() => {
                      onRandomize();
                    }}
                  >
                    <>
                      <Shuffle /> Randomize
                    </>
                  </Button>
                )}
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
                    <TabsTrigger value="story">Story</TabsTrigger>
                    <TabsTrigger value="master_notes">Notes</TabsTrigger>
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
                  <TabsContent value="story">
                    <FormField
                      control={form.control}
                      name="story"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <EditableText
                              fieldName="Story"
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
                </Tabs>
              </div>
            </div>
            <div className="col-span-4 lg:col-span-4">
              <Card className="col-span-2 rounded-xl bg-muted/50 ">
                {!isEditing && (
                  <CardHeader
                    className="rounded-t-xl bg-muted/50 h-[300px]"
                    style={{
                      backgroundImage: `url('${npc?.main_image}')`,
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
                        <p className="text-lg font-bold">{`${genderLabel} ${raceLabel} - ${classLabel}`}</p>
                        <div>
                          <AvatarList<TLocation>
                            title="Locations"
                            data={npcLocations}
                            routePrefix="/location/"
                          />
                        </div>
                        <div>
                          <AvatarList<TPlayer>
                            title="Allied Players"
                            data={npcPlayers}
                            routePrefix="/player/"
                          />
                        </div>
                        <div>
                          <AvatarList<TParty>
                            title="Parties"
                            data={npcParties}
                            routePrefix="/party/"
                          />
                        </div>
                        <div>
                          <AvatarList<TItem>
                            title="Items"
                            data={npcItems}
                            routePrefix="/item/"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <h2 className="text-lg font-bold">Sessions</h2>
                          <ScrollArea className="h-32 w-full rounded-md border">
                            <div className="p-4" key={1}>
                              {npcSessions?.map((session?: TSession) => (
                                <Link
                                  to={'/session/' + session?.id}
                                  key={session?.id}
                                >
                                  <div className="text-sm">{session?.name}</div>
                                  <Separator className="my-2" />
                                </Link>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
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
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an age..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {ageOptions.map((option) => (
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

                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a gender..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {genderOptions.map((option) => (
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
                          <FormField
                            control={form.control}
                            name="race"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Race</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a race..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {raceOptions.map((option) => (
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
                          <FormField
                            control={form.control}
                            name="class"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Class</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a class..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {classOptions.map((option) => (
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
                          <FormField
                            control={form.control}
                            name="job"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a job..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {jobOptions.map((option) => (
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
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a category..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {entityCategoryOptions.map((option) => (
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
                        <h2 className="text-lg font-bold">Allied Players</h2>
                        <PlayersList
                          players={playersInCampaign}
                          rowSelection={playersRowSelection}
                          setRowSelection={setPlayerRowSelection}
                          buttonLabel="Choose Allied Players"
                        />
                        <h2 className="text-lg font-bold">Locations</h2>
                        <LocationsList
                          locations={locationsInCampaign}
                          rowSelection={locationRowSelection}
                          setRowSelection={setLocationRowSelection}
                          buttonLabel="Choose Locations"
                        />
                        <h2 className="text-lg font-bold">Parties/Factions</h2>
                        <PartiesList
                          parties={partiesInCampaign}
                          rowSelection={partyRowSelection}
                          setRowSelection={setPartyRowSelection}
                          buttonLabel="Choose Parties"
                        />
                        <h2 className="text-lg font-bold">Items</h2>
                        <ItemsList
                          items={items}
                          rowSelection={itemsRowSelection}
                          setRowSelection={setItemsRowSelection}
                          buttonLabel="Choose Items"
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
