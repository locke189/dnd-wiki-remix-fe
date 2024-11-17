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

type TSessionPageProps = {
  gameSession?: TSession;
  players?: TPlayer[];
};

export const SessionPage: React.FC<TSessionPageProps> = ({
  gameSession,
  players,
}) => {
  const [sumbitted, setSubmitted] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState({});
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

  const selectedPlayers = players
    ?.filter((player, index) =>
      Object.keys(rowSelection).includes(String(index))
    )
    .map((player) => ({ Player_id: player.id }));
  console.log('Selected Players', selectedPlayers);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Submitting');
    setSubmitted(true);

    console.log(JSON.stringify({ players: selectedPlayers }));
    fetcher.submit(
      {
        data: JSON.stringify({ ...values, players: selectedPlayers }),
      },
      {
        method: 'POST',
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && sumbitted) {
      console.log(fetcher.data);
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
                      rowSelection={rowSelection}
                      setRowSelection={setRowSelection}
                    />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <h2 className="text-lg font-bold">Players</h2>
                      <ul className="flex flex-row gap-2">
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
              <Card className=" rounded-xl bg-muted/50 flex items-center relative h-full"></Card>
              <Card className=" rounded-xl bg-muted/50 h-full">
                <Button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    isEditing && form.handleSubmit(onSubmit)();
                  }}
                  type="button"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
                {/* <Button type="submit">Save</Button> */}
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
        </form>
      </Form>
    </>
  );
};
