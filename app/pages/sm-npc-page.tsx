import React, { useContext, useEffect, useMemo } from 'react';
import { Link, useFetcher, useParams } from '@remix-run/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

type TSMNpcPageProps = {
  npc?: TNpc;
  isNew?: boolean;
};

export const SMNpcPage: React.FC<TSMNpcPageProps> = ({
  npc,
  isNew = false,
}) => {
  const params = useParams();

  const [submitted, setSubmitted] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(isNew);
  const [selectedImageId, setSelectedImageId] = React.useState(
    npc?.main_image.split('/').pop() ?? ''
  );

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
  const ageLabel = getLabelFromOptions({
    options: ageOptions,
    value: npc?.age ?? '',
  });

  const jobLabel = getLabelFromOptions({
    options: jobOptions,
    value: npc?.job ?? '',
  });

  const categoryLabel = getLabelFromOptions({
    options: entityCategoryOptions,
    value: npc?.category ?? '',
  });

  return (
    // navbar
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    className="rounded-t-xl bg-muted/50 h-[300px] flex flex-col justify-end"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.01), rgba(0, 0, 0, 0.8)), url('${npc?.main_image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <CardTitle className="text-gray-50">{`${npc?.name}${
                      jobLabel ? ` (${jobLabel})` : ''
                    }`}</CardTitle>
                    <CardDescription className="text-gray-200">{`${genderLabel} ${raceLabel} - ${classLabel}`}</CardDescription>
                  </CardHeader>
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
                            title="Locations"
                            data={npcLocations}
                            routePrefix={`/session-manager/${params.id}/location/`}
                          />
                        </div>
                        <div>
                          <AvatarList<TPlayer>
                            title="Allied Players"
                            data={npcPlayers}
                            routePrefix={`/session-manager/${params.id}/player/`}
                          />
                        </div>
                        <div>
                          <AvatarList<TParty>
                            title="Parties"
                            data={npcParties}
                            routePrefix={`/session-manager/${params.id}/party/`}
                          />
                        </div>
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
