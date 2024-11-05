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
import { readItems, readMe } from '@directus/sdk';
import { NavBar } from './containers/navbar';
import SidebarLayout from './containers/sidabarLayout';
import { useContext, useState } from 'react';
import { AppContext } from './context/app.context';

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
    readItems('sessions', {
      fields: ['name', 'id', 'date', 'campaign'],
    })
  );

  const npcs = await client.request(
    readItems('Npc', {
      fields: ['name', 'id', 'campaigns.campaigns_id'],
    })
  );

  const locations = await client.request(
    readItems('Locations', {
      fields: [
        'name',
        'id',
        'parent_location',
        'Locations',
        'campaigns.campaigns_id',
        'type',
      ],
    })
  );

  const campaigns = await client.request(
    readItems('campaigns', {
      fields: ['name', 'id'],
    })
  );

  return json(
    {
      isUserLoggedIn: true,
      players,
      user,
      sessions,
      locations,
      campaigns,
      npcs,
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
    players: {
      name: string;
      id: string;
    };
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
