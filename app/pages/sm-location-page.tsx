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
import { cn, getLabelFromOptions } from '~/lib/utils';
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

type TSMLocationPageProps = {
  location?: TLocation;
  isNew?: boolean;
};

export const SMLocationPage: React.FC<TSMLocationPageProps> = ({
  location,
  isNew = false,
}) => {
  const [submitted, setSubmitted] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(isNew);
  const [selectedImageId, setSelectedImageId] = React.useState<string | null>(
    location?.main_image.split('/').pop() ?? null
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
  const { id } = useParams();

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
    // race: z.string().optional(),
    // age: z.string().optional(),
    // gender: z.string().optional(),
    // status: z.string().optional(),
    description: z.string().optional(),
    // story: z.string().optional(),
    master_notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location?.name ?? '',
      type: location?.type ?? '',
      parent_location: location?.parent_location ?? -1,
      // class: location?.class ?? '',
      // race: location?.race ?? '',
      // age: location?.age ?? '0',
      // gender: location?.gender ?? '',
      // story: location?.story ?? '',
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
          parent_location:
            values.parent_location === 0 ? null : values.parent_location,
          // Allied_Players: getSelectedPlayerRelations(playersRowSelection),
          // Locations: getSelectedLocationRelations(locationRowSelection),
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

  const parentLocation = locations?.find(
    (l) => l.id === location?.parent_location
  );

  const locationType = getLabelFromOptions({
    options: locationTypeOptions,
    value: location?.type || '',
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
                      backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.01), rgba(0, 0, 0, 0.8)), url('${location?.main_image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <CardTitle className="text-gray-50">{`${location?.name}`}</CardTitle>
                    <CardDescription className="text-gray-200">
                      <p>{`${locationType}`}</p>
                      {location?.parent_location && (
                        <Link
                          to={`/session-manager/${id}/location/${location?.parent_location}`}
                        >
                          <p className="underline cursor-pointer">
                            <small>{`${parentLocation?.name}`}</small>
                          </p>
                        </Link>
                      )}
                    </CardDescription>
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
                            title="Sub Locations"
                            data={location?.sub_locations}
                            routePrefix={`/session-manager/${id}/location/`}
                          />
                        </div>
                        <div>
                          <AvatarList<TNpc>
                            title="NPCs"
                            data={locationNpcs}
                            routePrefix={`/session-manager/${id}/npc/`}
                          />
                        </div>
                        <div>
                          <AvatarList<TParty>
                            title="Parties"
                            data={locationParties}
                            routePrefix={`/session-manager/${id}/party/`}
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
