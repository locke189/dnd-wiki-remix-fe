import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';

import './tailwind.css';
import { Auth } from './lib/auth.server';
import { readFiles, readItems, readMe } from '@directus/sdk';
import { NavBar } from './containers/navbar';
import SidebarLayout from './containers/sidabarLayout';
import { useState } from 'react';
import { AppContext } from './context/app.context';
import { getImageUrl } from './lib/utils';
import { TNpc } from './types/npc';
import { TPlayer } from './types/player';
import { TLocation } from './types/location';
import { TImage } from './types/images';
import { TSession } from './types/session';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders, refreshClientToken } =
    await Auth(request);

  if (!isUserLoggedIn || client === null) {
    return json(
      { isUserLoggedIn: false },
      {
        headers: {
          ...(await getRequestHeaders()),
        },
      }
    );
  }

  const user = await client.request(
    readMe({
      fields: ['*'],
    })
  );

  const players = await client.request(
    readItems('Player', {
      fields: ['name', 'id', 'campaigns.campaigns_id'],
    })
  );

  const sessions = await client.request(
    readItems('sessions', { fields: ['id', 'name', 'date', 'campaign'] })
  );

  const npcs = await client.request(
    readItems('Npc', {
      fields: ['name', 'id', 'class', 'main_image', 'campaigns.campaigns_id'],
    })
  );

  const locations = await client.request(
    readItems('Locations', {
      fields: [
        'name',
        'id',
        'parent_location',
        'sub_locations',
        'campaigns.campaigns_id',
        'type',
        'sessions.sessions_id',
        'main_image',
      ],
    })
  );

  const campaigns = await client.request(
    readItems('campaigns', {
      fields: ['name', 'id'],
    })
  );

  const images = await client.request(
    readFiles({
      query: {
        filter: {
          type: {
            _eq: 'image',
          },
        },
      },
      limit: -1,
    })
  );

  return json(
    {
      isUserLoggedIn: true,
      user,
      sessions,
      campaigns,
      players: players.map((player) => ({
        ...player,
        main_image: getImageUrl(player.main_image),
      })),
      npcs: npcs.map((npc) => ({
        ...npc,
        main_image: getImageUrl(npc.main_image),
      })),
      locations: locations.map((location) => ({
        ...location,
        main_image: getImageUrl(location.main_image),
      })),
      images: images.map((image) => ({
        ...image,
        src: getImageUrl(image.id),
      })),
    },
    {
      headers: {
        ...(await getRequestHeaders()),
      },
    }
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    npcs: TNpc[];
    players: TPlayer[];
    locations: TLocation[];
    images: TImage[];
    sessions: TSession[];
  } | null>();
  const [selectedCampaignId, setSelectedCampaignId] = useState<number>(2);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* layout */}
        <AppContext.Provider
          value={{
            selectedCampaignId,
            setSelectedCampaignId,
            npcs: data?.npcs ?? [],
            players: data?.players ?? [],
            locations: data?.locations ?? [],
            images: data?.images ?? [],
            campaigns: [],
            sessions: data?.sessions ?? [],
          }}
        >
          {!data?.isUserLoggedIn ? (
            <>
              <NavBar isUserLoggedIn={data?.isUserLoggedIn ?? false} />
              {children}
            </>
          ) : (
            <SidebarLayout>{children}</SidebarLayout>
          )}
        </AppContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
