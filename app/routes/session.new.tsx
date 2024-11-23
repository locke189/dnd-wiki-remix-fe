import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData, useParams } from '@remix-run/react';
import { createItem, readFiles, readItems } from '@directus/sdk';

import { SessionPage } from '~/pages/session-page';
import { getImageUrl } from '~/lib/utils';
import { TSession } from '~/types/session';
import { TPlayer } from '~/types/player';
import { TNpc } from '~/types/npc';
import { TLocation } from '~/types/location';
import { TImage } from '~/types/images';
import { TCampaign } from '~/types/campaigns';
import { AppContext } from '~/context/app.context';
import { useContext } from 'react';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';

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

  const players = await client.request(
    readItems('Player', {
      fields: ['*', 'campaigns.*'],
    })
  );

  const locations = await client.request(
    readItems('Locations', {
      fields: ['*', 'campaigns.*', 'Locations.*'],
    })
  );

  const campaigns = await client.request(
    readItems('campaigns', {
      fields: ['*'],
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

  return json({
    isUserLoggedIn: true,
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
    campaigns,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);
  const body = await request.formData();

  const data = JSON.parse(String(body.get('data')));

  const gameSession = await client.request(
    createItem('sessions', data as object)
  );

  return redirect(`/session/${gameSession.id}`);
}

export default function Index() {
  const { id } = useParams();
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    gameSession: TSession;
    players?: TPlayer[];
    npcs?: TNpc[];
    locations?: TLocation[];
    images?: TImage[];
    campaigns?: TCampaign[];
  }>();

  const { players, locations } = data || {};

  const appContext = useContext(AppContext);
  const { selectedCampaignId } = appContext;

  const emptySession: TSession = {
    name: '',
    date: new Date().toISOString(),
    campaign: selectedCampaignId,
    id: 0,
    players: [],
    Npcs: [],
    Locations: [],
  };

  return (
    // navbar
    <>
      <SessionPage
        gameSession={emptySession}
        key={id}
        players={players}
        locations={locations}
        isNew={true}
      />
    </>
  );
}
