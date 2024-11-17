import React, { useEffect } from 'react';
import { Link, useFetcher } from '@remix-run/react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { EditableText } from '~/components/editable-text';
import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { EditableInput } from '~/components/editable-input';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import { SessionPlayers } from '~/containers/session-players';
import { TPlayer } from '~/types/player';
import { TSession } from '~/types/session';
import { LAYOUT_PAGE_HEADER_PORTAL_ID } from '~/models/global';
import { Portal } from '~/components/portal';
import { TNpc } from '~/types/npc';
import { SessionNpcs } from '~/containers/session-npcs';
import { TLocation } from '~/types/location';
import { SessionLocations } from '~/containers/session-locations';

type TSessionPageProps = {
  gameSession?: TSession;
  players?: TPlayer[];
  npcs?: TNpc[];
  locations?: TLocation[];
};

export const SessionPage: React.FC<TSessionPageProps> = ({
  gameSession,
  players,
  npcs,
  locations,
}) => {
  const [sumbitted, setSubmitted] = React.useState(false);
  const [rowSelectionPlayers, setRowSelectionPlayers] = React.useState({});
  const [rowSelectionNpcs, setRowSelectionNpcs] = React.useState({});
  const [rowSelectionLocations, setRowSelectionLocations] = React.useState({});

  const [isEditing, setIsEditing] = React.useState(false);

  const fetcher = useFetcher();
  // const isLoading = fetcher.state === 'loading';

  const formSchema = z.object({
    name: z.string().optional(),
    date: z.date().optional(),
    recap: z.string().optional(),
    master_start: z.string().optional(),
    master_scenes: z.string().optional(),
    master_secrets: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: gameSession?.name,
      date:
        typeof gameSession?.date === 'string'
          ? (new Date(gameSession?.date) as unknown as Date)
          : new Date(),
      recap: gameSession?.recap ?? '',
      master_start: gameSession?.master_start ?? '',
      master_scenes: gameSession?.master_scenes ?? '',
      master_secrets: gameSession?.master_secrets ?? '',
    },
  });

  const playersInSession = players?.filter((player) =>
    gameSession?.players?.find((p) => p.Player_id === player.id)
  );

  const npcsInSession = npcs?.filter((npc) =>
    gameSession?.Npcs?.find((n) => n.Npc_id === npc.id)
  );

  const locationsInSession = locations?.filter((location) =>
    gameSession?.Locations?.find((l) => l.Locations_id === location.id)
  );

  const selectedPlayers = players
    ?.filter((player, index) =>
      Object.keys(rowSelectionPlayers).includes(String(index))
    )
    .map((player) => ({ Player_id: player.id }));

  const selectedNpcs = npcs
    ?.filter((npc, index) =>
      Object.keys(rowSelectionNpcs).includes(String(index))
    )
    .map((npc) => ({ Npc_id: npc.id }));

  const selectedLocations = locations
    ?.filter((location) =>
      gameSession?.Locations?.some((l) => l.Locations_id === location.id)
    )
    .map((location) => ({ Locations_id: location.id }));

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSubmitted(true);
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
          players: selectedPlayers,
          Npcs: selectedNpcs,
          Locations: selectedLocations,
        }),
      },
      {
        method: 'POST',
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && sumbitted) {
      setSubmitted(false);
    }
  }, [fetcher.state, fetcher.data, sumbitted]);

  return (
    // navbar
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
              <Card className=" rounded-xl bg-muted/50 h-full">
                <CardHeader>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <EditableInput
                            fieldName="Name"
                            field={field}
                            edit={isEditing}
                            type="text"
                          >
                            <CardTitle>{field?.value}</CardTitle>
                          </EditableInput>
                        </FormControl>
                      </FormItem>
                    )}
                  />
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
                </CardHeader>
                <CardDescription className="px-6 pb-6">
                  {isEditing ? (
                    <SessionPlayers
                      players={players}
                      gameSession={gameSession}
                      rowSelection={rowSelectionPlayers}
                      setRowSelection={setRowSelectionPlayers}
                    />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <h2 className="text-lg font-bold">Players</h2>
                      <ul className="flex flex-row gap-2 flex-wrap">
                        {playersInSession?.map((player) => (
                          <li key={player.id}>
                            <Link to={`/player/${player.id}`}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Avatar>
                                      <AvatarImage src={player.main_image} />
                                      <AvatarFallback>
                                        {player.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{player.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardDescription>
              </Card>
              <Card className=" rounded-xl bg-muted/50 flex relative h-full">
                <CardDescription className="px-6 pb-6 py-6">
                  {isEditing ? (
                    <SessionNpcs
                      {...{
                        npcs,
                        gameSession,
                        rowSelection: rowSelectionNpcs,
                        setRowSelection: setRowSelectionNpcs,
                      }}
                    />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <h2 className="text-lg font-bold">NPCs</h2>
                      <ul className="flex flex-row gap-2 flex-wrap">
                        {npcsInSession?.map((npc) => (
                          <li key={npc.id}>
                            <Link to={`/npc/${npc.id}`}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Avatar>
                                      <AvatarImage src={npc.main_image} />
                                      <AvatarFallback>
                                        {npc.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{npc.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardDescription>
              </Card>
              <Card className=" rounded-xl bg-muted/50 flex relative h-full">
                <CardDescription className="px-6 pb-6 py-6">
                  {isEditing ? (
                    <SessionLocations
                      locations={locations}
                      gameSession={gameSession}
                      rowSelection={rowSelectionLocations}
                      setRowSelection={setRowSelectionLocations}
                    />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <h2 className="text-lg font-bold">Locations</h2>
                      <ul className="flex flex-row gap-2 flex-wrap">
                        {locationsInSession?.map((location) => (
                          <li key={location.id}>
                            <Link to={`/location/${location.id}`}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Avatar>
                                      <AvatarImage src={location.main_image} />
                                      <AvatarFallback>
                                        {location.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{location.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardDescription>
              </Card>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Portal portalId={LAYOUT_PAGE_HEADER_PORTAL_ID}>
            <Button
              onClick={() => {
                setIsEditing(!isEditing);
                isEditing && form.handleSubmit(onSubmit)();
              }}
              type="button"
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </Portal>
        </form>
      </Form>
    </>
  );
};
