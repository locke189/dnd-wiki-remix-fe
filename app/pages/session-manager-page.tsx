import React, { useContext, useEffect } from 'react';
import { Link, Outlet, useFetcher } from '@remix-run/react';

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

import { useModelList } from '~/hooks/useModelList';
import { AppContext } from '~/context/app.context';
import { LocationsList } from '~/containers/locations-list';
import { PlayersList } from '~/containers/players-list';
import { Label } from '~/components/ui/label';
import { debounce } from '~/lib/utils';

type TSessionManagerPageProps = {
  gameSession?: TSession;
  isNew?: boolean;
};

export const SessionManagerPage: React.FC<TSessionManagerPageProps> = ({
  gameSession,
  isNew = false,
}) => {
  console.log('gameSession', gameSession);
  const [submitted, setSubmitted] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(isNew);
  const [secrets, setSecrets] = React.useState(gameSession?.secret_list || []);
  const [scenes, setScenes] = React.useState(gameSession?.scene_list || []);

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
    if (submitted) return;
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
        action: '/session/' + gameSession?.id + '/delete',
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  const onChange = () => {
    // submit form on change debounce to avoid multiple requests
    form.handleSubmit(onSubmit)();
  };

  const debounceOnChange = debounce(onChange, 500);

  return (
    // navbar
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          onChange={debounceOnChange}
        >
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
                <p className="text-xl text-slate-500 align-middle">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <EditableInput
                          fieldName="Date"
                          field={field}
                          edit={isEditing}
                          type="date"
                          noLabel
                        >
                          <CardDescription>
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'No date'}
                          </CardDescription>
                        </EditableInput>
                      </FormItem>
                    )}
                  />
                </p>
              </div>
              <div className="flex gap-3">
                <Link to={`/session-manager/${gameSession?.id}`}>
                  <Button type="button">Session Info</Button>
                </Link>
              </div>
            </header>
          </Portal>

          <div className="grid auto-rows-min gap-4 lg:grid-cols-12 grid-cols-8 mx-8 space-y-8">
            <div className="col-span-8 lg:col-span-8 mt-8 h-full">
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8 h-full">
                <FormField
                  control={form.control}
                  name="master_notes"
                  render={({ field }) => (
                    <>
                      <Label>DM Notes</Label>
                      <FormItem>
                        <FormControl>
                          <EditableText
                            fieldName="Notes"
                            field={field}
                            edit={true}
                            defaultOpen
                          />
                        </FormControl>
                      </FormItem>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-span-4 lg:col-span-4 h-full">
              <Card className="col-span-2 rounded-xl bg-muted/50 h-full">
                <CardContent className="pt-6 flex flex-col gap-3 ">
                  {isEditing ? (
                    <>
                      <PlayersList
                        players={playersInCampaign}
                        rowSelection={playerRowSelection}
                        setRowSelection={setPlayerRowSelection}
                        buttonLabel="Add Player"
                      />
                      <NpcList
                        npcs={npcsInCampaign}
                        rowSelection={npcRowSelection}
                        setRowSelection={setNpcRowSelection}
                        buttonLabel="Add NPC"
                      />
                      <LocationsList
                        locations={locationsInCampaign}
                        rowSelection={locationRowSelection}
                        setRowSelection={setLocationRowSelection}
                        buttonLabel="Add Location"
                      />
                    </>
                  ) : (
                    <>
                      <AvatarList<TPlayer>
                        data={playersInSession}
                        routePrefix={`/session-manager/${gameSession?.id}/player/`}
                        title="Players"
                      />
                      <AvatarList<TNpc>
                        data={npcsInSession}
                        routePrefix={`/session-manager/${gameSession?.id}/npc/`}
                        title="Npcs"
                      />
                      <AvatarList<TLocation>
                        data={locationsInSession}
                        routePrefix={`/session-manager/${gameSession?.id}/location/`}
                        title="Locations"
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      <div className="mt-8">
        <Outlet />
      </div>
    </>
  );
};
