import React, { useContext, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';

import { Card, CardContent, CardHeader } from '~/components/ui/card';

import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { EditableInput } from '~/components/editable-input';

import { LAYOUT_PAGE_HEADER_PORTAL_ID } from '~/models/global';
import { Portal } from '~/components/portal';
import { TNpc, TNpcRelationship } from '~/types/npc';
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

import { NpcList } from '~/containers/npc-list';
import { ImageChooser } from '~/components/image-chooser';
import { TBastion } from '~/types/bastion';
import { TPlayer } from '~/types/player';

type TBastionPageProps = {
  bastion?: TBastion;
  isNew?: boolean;
};

export const BastionPage: React.FC<TBastionPageProps> = ({
  bastion,
  isNew = false,
}) => {
  const [submitted, setSubmitted] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(isNew);
  const [selectedImageId, setSelectedImageId] = React.useState<string>(
    bastion?.main_image.split('/').pop() ?? ''
  );

  const appContext = useContext(AppContext);
  const { npcs, selectedCampaignId, images } = appContext || {};

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
    relations: bastion?.npcs || [],
    relationsKey: 'Npc_id',
    data: npcs || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  }); // sessions

  // const isLoading = fetcher.state === 'loading';

  const formSchema = z.object({
    name: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: bastion?.name ?? '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Submitting');
    setSubmitted(true);
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
          npcs: getSelectedNpcRelations(npcsRowSelection),
          main_image: selectedImageId ?? null,
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
        action: '/bastion/' + bastion?.id + '/delete',
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  // const locationSessions = useMemo(() => {
  //   return location?.sessions
  //     ?.map((session) => {
  //       return sessions?.find((s) => s.id == session.sessions_id);
  //     })
  //     .sort((a, b) => {
  //       return (
  //         new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime()
  //       );
  //     });
  // }, [location?.sessions, sessions]);

  // console.log('npcSessions', npcSessions, npc?.sessions, sessions);

  const bastionNpcs = npcs?.filter((npc) =>
    bastion?.npcs?.find((p) => p.Npc_id === npc.id)
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
                {/* Rooms */}
              </div>
            </div>
            <div className="col-span-4 lg:col-span-4">
              <Card className="col-span-2 rounded-xl bg-muted/50 ">
                {!isEditing && (
                  <CardHeader
                    className="rounded-t-xl bg-muted/50 h-[300px]"
                    style={{
                      backgroundImage: `url('${bastion?.main_image}')`,
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
                          <AvatarList<TPlayer>
                            title="Owner"
                            data={bastion?.player ? [bastion.player] : []}
                            routePrefix="/player/"
                          />
                        </div>
                        <div>
                          <AvatarList<TNpc>
                            title="NPCs"
                            data={bastionNpcs}
                            routePrefix="/npc/"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <div className="my-4 flex flex-col gap-2">
                        <h2 className="text-lg font-bold">NPCs</h2>
                        <NpcList
                          npcs={npcsInCampaign}
                          rowSelection={npcsRowSelection}
                          setRowSelection={setNpcRowSelection}
                          buttonLabel="Choose NPCs"
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
