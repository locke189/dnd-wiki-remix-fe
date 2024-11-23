import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData, useParams } from '@remix-run/react';
import { readFiles, readItem, readItems, updateItem } from '@directus/sdk';

import { SessionPage } from '~/pages/session-page';
import { getImageUrl } from '~/lib/utils';
import { TSession } from '~/types/session';
import { TPlayer } from '~/types/player';
import { TLocation } from '~/types/location';
import { TImage } from '~/types/images';
import { TCampaign } from '~/types/campaigns';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const { id } = params;

  if (!id) {
    return redirect('/');
  }

  const gameSession = await client.request(
    readItem('sessions', id, {
      fields: ['*', 'players.*', 'Npcs.*', 'Locations.*'],
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
    gameSession,
    players: players.map((player) => ({
      ...player,
      main_image: getImageUrl(player.main_image),
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

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const body = await request.formData();
  const { id } = params;

  if (!id) {
    return redirect('/');
  }

  const data = JSON.parse(String(body.get('data')));

  const gameSession = await client.request(
    updateItem('sessions', id, data as object)
  );

  return json({ data: gameSession });
}

export default function Index() {
  const { id } = useParams();
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    gameSession: TSession;
    players?: TPlayer[];
    locations?: TLocation[];
    images?: TImage[];
    campaigns?: TCampaign[];
  }>();

  const { gameSession, players, locations } = data || {};
  return (
    // navbar
    <SessionPage
      gameSession={gameSession}
      key={id}
      players={players}
      locations={locations}
    />
  );
}
