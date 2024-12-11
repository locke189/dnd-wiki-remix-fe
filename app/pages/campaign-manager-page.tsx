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
import { TCampaign } from '~/types/campaigns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Updater, RowSelectionState } from '@tanstack/react-table';

type TCampaignManagerPageProps = {
  isNew?: boolean;
};

export const CampaignManagerPage: React.FC<TCampaignManagerPageProps> = ({
  isNew = false,
}) => {
  const [submitted, setSubmitted] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(isNew);

  const fetcher = useFetcher();
  // const isLoading = fetcher.state === 'loading';

  const appContext = useContext(AppContext);
  const { locations, npcs, selectedCampaignId, players, campaigns } =
    appContext || {};

  const campaign = campaigns.find((c) => c.id === selectedCampaignId);

  console.log('campaign', campaigns, selectedCampaignId, campaign);

  const formSchema = z.object({
    name: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign?.name ?? '',
    },
  });

  const {
    rowSelection: playerRowSelection,
    getSelectedRelations: getSelectedPlayerRelations,
    setRowSelection: setPlayerRowSelection,
    dataInCampaign: playersInCampaign,
  } = useModelList<TPlayerRelationship, TPlayer>({
    relations: campaign?.players || [],
    relationsKey: 'Player_id',
    data: players || [],
    selectedCampaignId: selectedCampaignId ?? 0,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (submitted) return;
    setSubmitted(true);
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
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
        action: '/campaign/' + campaign?.id + '/delete',
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  // const onChange = () => {
  //   // submit form on change debounce to avoid multiple requests
  //   form.handleSubmit(onSubmit)();
  // };

  // const debounceOnChange = debounce(onChange, 500);

  return (
    // navbar
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          // onChange={debounceOnChange}
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
              </div>
              <div className="flex gap-3">
                <Button type="button" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
                <Button type="button" onClick={onDelete}>
                  Delete
                </Button>
              </div>
            </header>
          </Portal>

          <div className="grid auto-rows-min gap-4 lg:grid-cols-12 grid-cols-8 mx-8 space-y-8">
            <main className="col-span-8 lg:col-span-12 mt-8 h-full">
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8 h-full">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="players">Players</TabsTrigger>
                    <TabsTrigger value="npcs">NPCs</TabsTrigger>
                    <TabsTrigger value="locations">Locations</TabsTrigger>
                    <TabsTrigger value="parties">Parties/Factions</TabsTrigger>
                    <TabsTrigger value="bastions">Bastions</TabsTrigger>
                    <TabsTrigger value="items">Items</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general">
                    <p>General</p>
                  </TabsContent>
                  <TabsContent value="sessions">
                    <p>Sessions</p>
                  </TabsContent>
                  <TabsContent value="players">
                    <p>Players</p>
                    <PlayersList
                      players={players ?? []}
                      rowSelection={playerRowSelection}
                      setRowSelection={setPlayerRowSelection}
                      noPagination
                      onlyTable
                    />
                  </TabsContent>
                  <TabsContent value="npcs">
                    <p>NPCs</p>
                  </TabsContent>
                  <TabsContent value="locations">
                    <p>Locations</p>
                  </TabsContent>
                  <TabsContent value="parties">
                    <p>Parties/Factions</p>
                  </TabsContent>
                  <TabsContent value="bastions">
                    <p>Bastions</p>
                  </TabsContent>
                  <TabsContent value="items">
                    <p>Items</p>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>
        </form>
      </Form>
      <div className="mt-8">
        <Outlet />
      </div>
    </>
  );
};
