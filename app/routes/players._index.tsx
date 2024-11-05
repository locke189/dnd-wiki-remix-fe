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
      fields: ['name', 'id', 'main_image'],
    })
  );

  const playersWithImages = players.map((player: any) => {
    return {
      ...player,
      main_image_url: `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${player.main_image}`,
      url: `/players/${player.id}`,
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
    players: {
      name: string;
      id: string;
      main_image: string;
      main_image_url: string;
      url: string;
    }[];
  } | null>();

  return (
    // navbar
    <ImageList
      title="Players"
      data={data?.players.map((player) => ({
        id: player.id,
        imageUrl: player.main_image_url,
        name: player.name,
        url: player.url,
      }))}
    />
  );
}
