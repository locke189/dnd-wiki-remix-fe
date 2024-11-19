import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData, useParams } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readFiles, readItem, readItems, updateItem } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';

import { SessionPage } from '~/pages/session-page';
import { getImageUrl } from '~/lib/utils';
import { TSession } from '~/types/session';
import { TPlayer } from '~/types/player';
import { TNpc } from '~/types/npc';
import { TLocation } from '~/types/location';
import { TImage } from '~/types/images';
import { TCampaign } from '~/types/campaigns';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders, session } = await Auth(
    request
  );

  const { id } = params;

  if (!isUserLoggedIn || client === null || !id) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const gameSession = await client.request(
    readItem('sessions', id, {
      fields: ['*', 'players.*', 'Npcs.*', 'Locations.*'],
    })
  );

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

  return json(
    {
      isUserLoggedIn: true,
      gameSession,
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
    },
    {
      headers: {
        ...(await getRequestHeaders()),
      },
    }
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders, session } = await Auth(
    request
  );

  const body = await request.formData();
  const { id } = params;

  if (!isUserLoggedIn || client === null || !id) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const data = JSON.parse(String(body.get('data')));

  const gameSession = await client.request(
    updateItem('sessions', id, data as object)
  );

  return json(
    { data: gameSession },
    {
      headers: {
        ...(await getRequestHeaders()),
      },
    }
  );
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

  console.log('data', data);

  const { gameSession, players, npcs, locations } = data || {};
  return (
    // navbar
    <SessionPage
      gameSession={gameSession}
      key={id}
      players={players}
      npcs={npcs}
      locations={locations}
    />
  );
}
