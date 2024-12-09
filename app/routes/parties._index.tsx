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
import { TLocation } from '~/types/location';
import { TParty } from '~/types/party';

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

  const parties = await client.request(
    readItems('Parties', {
      fields: ['*', 'campaigns.*'],
    })
  );

  const partiesWithImages = parties.map((party) => {
    return {
      ...party,
      main_image: `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${party.main_image}`,
    };
  });

  return json({ isUserLoggedIn: true, parties: partiesWithImages });
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    parties: TParty[];
  } | null>();

  const [search, setSearch] = useState('');
  const { setFavorite } = useFavorite();
  const appContext = useContext(AppContext);

  const parties =
    data?.parties
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
          <h1 className="text-2xl font-bold">Parties/Factions</h1>
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
        data={parties.map((party) => ({
          id: party.id,
          imageUrl: party.main_image,
          name: party.name,
          url: `/party/${party.id}`,
          action: (
            <>
              <ToggleIcon
                isToggled={party.favorite}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setFavorite(!party.favorite, `/party/${party.id}`);
                }}
              />
            </>
          ),
        }))}
      />
    </div>
  );
}
