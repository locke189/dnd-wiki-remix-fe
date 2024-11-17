import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readItems } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';
import { ImageList } from '~/components/image-list';
import { TPlayer } from '~/types/player';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders, session } = await Auth(
    request
  );

  if (!isUserLoggedIn || client === null) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const players = await client.request(
    readItems('Player', {
      fields: ['*'],
    })
  );

  const playersWithImages = players.map((player) => {
    return {
      ...player,
      main_image: `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${player.main_image}`,
    };
  });

  return json(
    { isUserLoggedIn: true, players: playersWithImages },
    {
      headers: {
        ...(await getRequestHeaders()),
      },
    }
  );
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    players: TPlayer[];
  } | null>();

  return (
    // navbar
    <ImageList
      title="Players"
      data={data?.players.map((player) => ({
        id: player.id,
        imageUrl: player.main_image,
        name: player.name,
        url: `/players/${player.id}`,
      }))}
    />
  );
}
