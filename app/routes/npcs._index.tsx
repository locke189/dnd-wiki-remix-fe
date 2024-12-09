import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { readItems } from '@directus/sdk';
import { ImageList } from '~/components/image-list';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';
import { Portal } from '~/components/portal';
import { LAYOUT_PAGE_HEADER_PORTAL_ID } from '~/models/global';
import { Input } from '~/components/ui/input';
import { useContext, useState } from 'react';
import { AppContext } from '~/context/app.context';
import { TNpc } from '~/types/npc';
import { ToggleIcon } from '~/components/toggle-icon';
import { useFavorite } from '~/hooks/set-favorite';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const npcs = await client.request(
    readItems('Npc', {
      fields: ['*', 'campaigns.*'],
    })
  );

  const npcsWithImages = npcs.map((npc) => {
    return {
      ...npc,
      main_image: `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${npc.main_image}`,
    };
  });

  return json({ isUserLoggedIn: true, npcs: npcsWithImages });
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    npcs: TNpc[];
  } | null>();

  const [search, setSearch] = useState('');
  const { setFavorite } = useFavorite();
  const appContext = useContext(AppContext);

  const npcs =
    data?.npcs
      ?.filter((player) => {
        const inCampaign = player.campaigns?.some(
          (campaign) => campaign.campaigns_id === appContext?.selectedCampaignId
        );

        return (
          inCampaign && player.name.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name)) || [];

  return (
    // navbar
    <div className="grid auto-rows-min gap-4 lg:grid-cols-12 grid-cols-8 mx-8 space-y-10 mt-8">
      <Portal portalId={LAYOUT_PAGE_HEADER_PORTAL_ID}>
        <header className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">NPCs</h1>
        </header>
      </Portal>
      <div className="col-span-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="filter"
        />
      </div>
      <ImageList
        className="col-span-12"
        data={npcs.map((npc) => ({
          id: npc.id,
          imageUrl: npc.main_image,
          name: npc.name,
          url: `/npc/${npc.id}`,
          action: (
            <>
              <ToggleIcon
                isToggled={npc.favorite}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setFavorite(!npc.favorite, `/npc/${npc.id}`);
                }}
              />
            </>
          ),
        }))}
      />
    </div>
  );
}
