import React, { useCallback, useContext, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';

import { Card, CardContent, CardDescription } from '~/components/ui/card';
import { EditableText } from '~/components/editable-text';
import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { EditableInput } from '~/components/editable-input';
import { format } from 'date-fns';

import { TPlayer, TPlayerRelationship } from '~/types/player';
import { TSession } from '~/types/session';
import { LAYOUT_PAGE_HEADER_PORTAL_ID } from '~/models/global';
import { Portal } from '~/components/portal';
import { TNpc, TNpcRelationship } from '~/types/npc';
import { NpcList } from '~/containers/npc-list';
import { TLocation, TLocationsRelationship } from '~/types/location';
import { AvatarList } from '~/components/avatar-list';
import { Pen, Save, Trash } from 'lucide-react';
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
import { useModelList } from '~/hooks/useModelList';
import { AppContext } from '~/context/app.context';
import { LocationsList } from '~/containers/locations-list';
import { PlayersList } from '~/containers/players-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ContentTodoList } from '~/containers/content-todo-list';

type TSMSessionPageProps = {
  gameSession?: TSession;
  isNew?: boolean;
};

export const SMSessionPage: React.FC<TSMSessionPageProps> = ({
  gameSession,
  isNew = false,
}) => {
  console.log('gameSession', gameSession);
  const [submitted, setSubmitted] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(isNew);
  const [secrets, setSecrets] = React.useState(gameSession?.secret_list || []);
  const [scenes, setScenes] = React.useState(gameSession?.scene_list || []);
  const [encounters, setEncounters] = React.useState(
    gameSession?.encounters || []
  );

  const fetcher = useFetcher();
  // const isLoading = fetcher.state === 'loading';

  const appContext = useContext(AppContext);
  const { locations, npcs, selectedCampaignId, players } = appContext || {};

  const {
    rowSelection: npcRowSelection,
    getSelectedRelations: getSelectedNpcRelations,
    setRowSelection: setNpcRowSelection,
    dataInCampaign: npcsInCampaign,
  } = useModelList<TNpcRelationship, TNpc>({
    relations: gameSession?.Npcs || [],
    relationsKey: 'Npc_id',
    data: npcs || [],
    selectedCampaignId: gameSession?.campaign ?? selectedCampaignId ?? 0,
  });

  const {
    dataInCampaign: locationsInCampaign,
    rowSelection: locationRowSelection,
    setRowSelection: setLocationRowSelection,
    getSelectedRelations: getSelectedLocationRelations,
  } = useModelList<TLocationsRelationship, TLocation>({
    relations: gameSession?.Locations || [],
    relationsKey: 'Locations_id',
    data: locations || [],
    selectedCampaignId: gameSession?.campaign ?? selectedCampaignId ?? 0,
  });

  const {
    rowSelection: playerRowSelection,
    getSelectedRelations: getSelectedPlayerRelations,
    setRowSelection: setPlayerRowSelection,
    dataInCampaign: playersInCampaign,
  } = useModelList<TPlayerRelationship, TPlayer>({
    relations: gameSession?.players || [],
    relationsKey: 'Player_id',
    data: players || [],
    selectedCampaignId: gameSession?.campaign ?? selectedCampaignId ?? 0,
  });

  const formSchema = z.object({
    name: z.string().optional(),
    date: z.date().optional(),
    recap: z.string().optional(),
    master_start: z.string().optional(),
    master_scenes: z.string().optional(),
    master_secrets: z.string().optional(),
    master_notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: gameSession?.name ?? '',
      date:
        typeof gameSession?.date === 'string'
          ? (new Date(gameSession?.date) as unknown as Date)
          : new Date(),
      recap: gameSession?.recap ?? '',
      master_start: gameSession?.master_start ?? '',
      master_scenes: gameSession?.master_scenes ?? '',
      master_secrets: gameSession?.master_secrets ?? '',
      master_notes: gameSession?.master_notes ?? '',
    },
  });

  const playersInSession = players?.filter((player) =>
    gameSession?.players?.find((p) => p.Player_id === player.id)
  );

  const npcsInSession = npcs?.filter((npc) =>
    gameSession?.Npcs?.find((n) => n.Npc_id === npc.id)
  );

  const locationsInSession = locationsInCampaign?.filter((location) =>
    gameSession?.Locations?.find((l) => l.Locations_id === location.id)
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('submitting');
    setSubmitted(true);
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
          players: getSelectedPlayerRelations(playerRowSelection),
          Npcs: getSelectedNpcRelations(npcRowSelection),
          Locations: getSelectedLocationRelations(locationRowSelection),
          campaign: gameSession?.campaign,
          secret_list: secrets,
          scene_list: scenes,
          encounters: encounters,
        }),
      },
      {
        method: 'POST',
      }
    );
  };

  const onSubmitEncounters = (state: boolean, index: number) => {
    setSubmitted(true);
    const newEncounterElement = { ...encounters[index] };
    newEncounterElement.used = state;
    const newEncounters = [
      ...encounters.slice(0, index),
      newEncounterElement,
      ...encounters.slice(index + 1),
    ];

    fetcher.submit(
      {
        data: JSON.stringify({ encounters: newEncounters }),
      },
      {
        method: 'POST',
        action: '/session/' + gameSession?.id,
      }
    );
  };

  const onSubmitScenes = (state: boolean, index: number) => {
    setSubmitted(true);
    const newSceneElement = { ...scenes[index] };
    newSceneElement.used = state;
    const newScenes = [
      ...scenes.slice(0, index),
      newSceneElement,
      ...scenes.slice(index + 1),
    ];

    fetcher.submit(
      {
        data: JSON.stringify({ scene_list: newScenes }),
      },
      {
        method: 'POST',
        action: '/session/' + gameSession?.id,
      }
    );
  };

  const onSubmitSecrets = (state: boolean, index: number) => {
    setSubmitted(true);
    const newSecretElement = { ...secrets[index] };
    newSecretElement.used = state;
    const newSecrets = [
      ...secrets.slice(0, index),
      newSecretElement,
      ...secrets.slice(index + 1),
    ];

    fetcher.submit(
      {
        data: JSON.stringify({ secret_list: newSecrets }),
      },
      {
        method: 'POST',
        action: '/session/' + gameSession?.id,
      }
    );
  };

  const onDelete = () => {
    setSubmitted(true);
    fetcher.submit(
      {},
      {
        method: 'POST',
        action: '/session/' + gameSession?.id + '/delete',
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted && fetcher.data) {
      setSubmitted(false);
      if (fetcher.data?.gameSession) {
        setScenes(fetcher.data.gameSession.scene_list);
        setSecrets(fetcher.data.gameSession.secret_list);
        setEncounters(fetcher.data.gameSession.encounters);
      }
    }
  }, [fetcher.state, fetcher.data, submitted]);

  return (
    // navbar
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-h">
          <div className="grid auto-rows-min gap-4 lg:grid-cols-12 grid-cols-8 mx-8 space-y-8">
            <div className="col-span-12 lg:col-span-12 mt-8">
              <div className="h-[400px] flex-1 rounded-xl bg-muted/50 p-8 pt-4 relative overflow-auto">
                <Tabs defaultValue="recap" className="w-full">
                  <TabsList className="sticky top-0 my-0">
                    <TabsTrigger value="recap">Recap</TabsTrigger>
                    <TabsTrigger value="master_start">Strong Start</TabsTrigger>
                    {gameSession?.master_scenes && (
                      <TabsTrigger value="master_scenes">
                        Possible Scenes (Deprecated)
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="scene-list">Scenes</TabsTrigger>

                    {gameSession?.master_secrets && (
                      <TabsTrigger value="master_secrets">
                        Secrets (deprecated)
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="secrets-list">Secrets</TabsTrigger>
                    <TabsTrigger value="encounters">Encounters</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recap">
                    <FormField
                      control={form.control}
                      name="recap"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <EditableText
                              fieldName="Recap"
                              field={field}
                              edit={isEditing}
                              defaultOpen
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="master_start">
                    <FormField
                      control={form.control}
                      name="master_start"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <EditableText
                              fieldName="Strong Start"
                              field={field}
                              edit={isEditing}
                              defaultOpen
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  {gameSession?.master_scenes && (
                    <TabsContent value="master_scenes">
                      <FormField
                        control={form.control}
                        name="master_scenes"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <EditableText
                                fieldName="Possible Scenes"
                                field={field}
                                edit={isEditing}
                                defaultOpen
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  )}
                  <TabsContent value="scene-list">
                    <ContentTodoList
                      data={scenes}
                      setData={setScenes}
                      isEditing={isEditing}
                      title="Scenes"
                      enableCheckmark
                      onCheckmarkChange={onSubmitScenes}
                    />
                  </TabsContent>
                  {gameSession?.master_secrets && (
                    <TabsContent value="master_secrets">
                      <FormField
                        control={form.control}
                        name="master_secrets"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <EditableText
                                fieldName="Secrets"
                                field={field}
                                edit={isEditing}
                                defaultOpen
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  )}
                  <TabsContent value="secrets-list">
                    <ContentTodoList
                      data={secrets}
                      setData={setSecrets}
                      isEditing={isEditing}
                      title="Possible Secrets"
                      enableCheckmark
                      onCheckmarkChange={onSubmitSecrets}
                    />
                  </TabsContent>
                  <TabsContent value="encounters">
                    <ContentTodoList
                      data={encounters}
                      setData={setEncounters}
                      isEditing={false}
                      title="Possible Secrets"
                      showUrl
                      enableCheckmark
                      onCheckmarkChange={onSubmitEncounters}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
