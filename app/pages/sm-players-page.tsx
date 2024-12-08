import React, { useContext, useEffect, useMemo } from 'react';
import { Link, useFetcher } from '@remix-run/react';

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

import { TPlayer } from '~/types/player';
import { TSession } from '~/types/session';
import {
  ageOptions,
  classOptions,
  genderOptions,
  LAYOUT_PAGE_HEADER_PORTAL_ID,
  raceOptions,
} from '~/models/global';
import { Portal } from '~/components/portal';
import { TNpc, TNpcRelationship } from '~/types/npc';
import { NpcList } from '~/containers/npc-list';
import { ExternalLink, Pen, Save, Trash } from 'lucide-react';
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
import { AvatarList } from '~/components/avatar-list';
import { ImageChooser } from '~/components/image-chooser';
import { TBastion, TBastionRelationship } from '~/types/bastion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { BastionList } from '~/containers/bastion-list';
import { TParty, TPartyRelationship } from '~/types/party';
import { PartiesList } from '~/containers/parties-list';
import { TItem, TItemRelationship } from '~/types/item';
import { ItemsList } from '~/containers/items-list';
import { getLabelFromOptions } from '~/lib/utils';

type TSMPlayerPageProps = {
  player?: TPlayer;
  isNew?: boolean;
};

export const SMPlayerPage: React.FC<TSMPlayerPageProps> = ({
  player,
  isNew = false,
}) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(isNew);
  const [selectedImageId, setSelectedImageId] = React.useState(
    player?.main_image.split('/').pop() ?? ''
  );

  const appContext = useContext(AppContext);
  const {
    npcs,
    selectedCampaignId,
    sessions,
    images,
    bastions,
    parties,
    items,
  } = appContext || {};

  const fetcher = useFetcher();
  const {
    rowSelection: npcRowSelection,
    getSelectedRelations: getSelectedNpcRelations,
    setRowSelection: setNpcRowSelection,
    dataInCampaign: npcsInCampaign,
  } = useModelList<TNpcRelationship, TNpc>({
    relations: player?.Allied_npcs || [],
    relationsKey: 'Npc_id',
    data: npcs || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  });

  const {
    rowSelection: bastionRowSelection,
    getSelectedRelations: getSelectedBastionRelations,
    setRowSelection: setBastionRowSelection,
    dataInCampaign: bastionsInCampaign,
  } = useModelList<TBastionRelationship, TBastion>({
    relations: player?.bastions || [],
    relationsKey: 'bastion_id',
    data: bastions || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  });

  const {
    rowSelection: partyRowSelection,
    getSelectedRelations: getSelectedPartyRelations,
    setRowSelection: setPartyRowSelection,
    dataInCampaign: partiesInCampaign,
  } = useModelList<TPartyRelationship, TParty>({
    relations: player?.Parties || [],
    relationsKey: 'Parties_id',
    data: parties || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  });

  const {
    rowSelection: itemRowSelection,
    getSelectedRelations: getSelectedItemRelations,
    setRowSelection: setItemRowSelection,
  } = useModelList<TItemRelationship, TItem>({
    relations: player?.items || [],
    relationsKey: 'Items_id',
    data: items || [],
  });

  // const isLoading = fetcher.state === 'loading';

  const formSchema = z.object({
    name: z.string().optional(),
    class: z.string().optional(),
    race: z.string().optional(),
    age: z.string().optional(),
    gender: z.string().optional(),
    // status: z.string().optional(),
    story: z.string().optional(),
    goals: z.string().optional(),
    private_goals: z.string().optional(),
    url: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: player?.name ?? '',
      class: player?.class ?? '',
      race: player?.race ?? '',
      age: player?.age ?? '',
      // status: player?.status ?? '',
      story: player?.story ?? '',
      goals: player?.goals ?? '',
      private_goals: player?.private_goals ?? '',
      url: player?.url ?? '',
      gender: player?.gender ?? '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSubmitted(true);
    console.log('submittng', getSelectedNpcRelations(npcRowSelection));
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
          Allied_npcs: getSelectedNpcRelations(npcRowSelection),
          // bastions: getSelectedBastionRelations(bastionRowSelection),
          Parties: getSelectedPartyRelations(partyRowSelection),
          main_image: selectedImageId ?? null,
          items: getSelectedItemRelations(itemRowSelection),
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
        action: '/player/' + player?.id + '/delete',
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  const playerSessions = useMemo(() => {
    return player?.sessions
      ?.map((session) => {
        return sessions?.find((s) => s.id == session.sessions_id);
      })
      .sort((a, b) => {
        return (
          new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime()
        );
      });
  }, [player?.sessions, sessions]);

  const playerNpcs = npcs?.filter((npc) =>
    player?.Allied_npcs?.find((n) => n.Npc_id === npc.id)
  );

  const playerParties = parties?.filter((party) =>
    player?.Parties?.find((p) => p.Parties_id === party.id)
  );

  const playerItems = items?.filter((item) =>
    player?.items?.find((i) => i.Items_id === item.id)
  );

  return (
    // navbar
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid auto-rows-min gap-4 lg:grid-cols-12 grid-cols-8 mx-8 space-y-8">
            <div className="col-span-8 lg:col-span-8 mt-8">
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
                <Tabs defaultValue="story" className="w-full">
                  <TabsList>
                    <TabsTrigger value="story">Story</TabsTrigger>
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                    <TabsTrigger value="private_goals">
                      Private Goals
                    </TabsTrigger>
                  </TabsList>
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
                  <TabsContent value="goals">
                    <FormField
                      control={form.control}
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <EditableText
                              fieldName="Goals"
                              field={field}
                              edit={isEditing}
                              defaultOpen
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="private_goals">
                    <FormField
                      control={form.control}
                      name="private_goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <EditableText
                              fieldName="Private Goals"
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
                      backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.01), rgba(0, 0, 0, 0.8)), url('${player?.main_image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <CardTitle className="text-gray-50">
                      {player?.name}
                    </CardTitle>
                    <CardDescription className="text-gray-200">
                      {getLabelFromOptions({
                        options: raceOptions,
                        value: player?.race ?? '',
                      })}{' '}
                      {getLabelFromOptions({
                        options: classOptions,
                        value: player?.class ?? '',
                      })}
                    </CardDescription>
                  </CardHeader>
                )}
                <CardContent className="pt-6">
                  <>
                    <div className="flex flex-col gap-4">
                      {player?.url && (
                        <Button variant="outline">
                          <Link
                            to={player?.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex gap-2"
                          >
                            Character Sheet
                            <ExternalLink />
                          </Link>
                        </Button>
                      )}
                      <div>
                        <AvatarList<TParty>
                          title="Parties"
                          data={playerParties}
                          routePrefix="/party/"
                        />
                      </div>
                      {/* <div>
                        <AvatarList<TNpc>
                          title="Allied NPCs"
                          data={playerNpcs}
                          routePrefix="/npc/"
                        />
                      </div>
                      <div>
                        <AvatarList<TBastion>
                          title="Bastions"
                          data={player?.bastions ?? []}
                          routePrefix="/bastion/"
                        />
                      </div>
                      <div>
                        <AvatarList<TItem>
                          title="Items"
                          data={playerItems ?? []}
                          routePrefix="/item/"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-bold">Sessions</h2>
                        <ScrollArea className="h-32 w-full rounded-md border">
                          <div className="p-4" key={1}>
                            {playerSessions?.map((session?: TSession) => (
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
                      </div> */}
                    </div>
                  </>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
