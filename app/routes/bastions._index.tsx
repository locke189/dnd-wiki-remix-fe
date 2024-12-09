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
import { ToggleIcon } from '~/components/toggle-icon';
import { useFavorite } from '~/hooks/set-favorite';
import { TBastion } from '~/types/bastion';

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

  const bastion = await client.request(
    readItems('bastion', {
      fields: ['*', 'campaigns.*', 'player.*'],
    })
  );

  const bastionWithImages = bastion.map((bastion) => {
    return {
      ...bastion,
      main_image: `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${bastion.main_image}`,
    };
  });

  return json({ isUserLoggedIn: true, bastions: bastionWithImages });
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    bastions: TBastion[];
  } | null>();

  const [search, setSearch] = useState('');
  const { setFavorite } = useFavorite();
  const appContext = useContext(AppContext);

  const bastions =
    data?.bastions
      ?.filter((bastion) => {
        const inCampaign = bastion.campaigns?.some(
          (campaign) => campaign.campaigns_id === appContext?.selectedCampaignId
        );

        return (
          inCampaign &&
          bastion.name.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name)) || [];

  console.log(data?.bastions);

  return (
    // navbar
    <div className="grid auto-rows-min gap-4 lg:grid-cols-12 grid-cols-8 mx-8 space-y-10 mt-8">
      <Portal portalId={LAYOUT_PAGE_HEADER_PORTAL_ID}>
        <header className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">Bastions</h1>
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
        data={bastions.map((bastion) => ({
          id: bastion.id,
          imageUrl: bastion.main_image,
          name: bastion.name,
          description: bastion.player.name,
          url: `/bastion/${bastion.id}`,
          action: (
            <>
              <ToggleIcon
                isToggled={bastion.favorite}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setFavorite(!bastion.favorite, `/bastion/${bastion.id}`);
                }}
              />
            </>
          ),
        }))}
      />
    </div>
  );
}
