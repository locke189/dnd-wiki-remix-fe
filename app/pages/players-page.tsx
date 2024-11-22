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

import { TPlayer } from '~/types/player';
import { TSession } from '~/types/session';
import {
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

type TPlayerPageProps = {
  player?: TPlayer;
  isNew?: boolean;
};

export const PlayerPage: React.FC<TPlayerPageProps> = ({
  player,
  isNew = false,
}) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(isNew);

  const appContext = useContext(AppContext);
  const { npcs, selectedCampaignId, sessions } = appContext || {};

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
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
          Allied_npcs: getSelectedNpcRelations(npcRowSelection),
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
                {!isEditing && (
                  <p className="text-xl text-slate-500 align-middle">
                    {`${player?.gender} - ${player?.race} - ${player?.class} - ${player?.age} `}
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
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

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
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="col-span-4 lg:col-span-4">
              <Card className="col-span-2 rounded-xl bg-muted/50 ">
                <CardHeader
                  className="rounded-t-xl bg-muted/50 h-[200px]"
                  style={{
                    backgroundImage: `url('${player?.main_image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></CardHeader>
                <CardContent className="pt-6">
                  {!isEditing && (
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
                          <AvatarList<TNpc>
                            title="Allied NPCs"
                            data={playerNpcs}
                            routePrefix="/npc/"
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
                        </div>
                      </div>
                    </>
                  )}
                  {isEditing && (
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
                              <FormControl>
                                <EditableInput
                                  fieldName="Age"
                                  field={field}
                                  edit={isEditing}
                                  type="text"
                                >
                                  <CardDescription>
                                    {field?.value}
                                  </CardDescription>
                                </EditableInput>
                              </FormControl>
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
                        <NpcList
                          npcs={npcsInCampaign}
                          rowSelection={npcRowSelection}
                          setRowSelection={setNpcRowSelection}
                          buttonLabel="Choose Allied NPCs"
                        />
                      </>
                    </div>
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
