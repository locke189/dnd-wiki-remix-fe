import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { readItems } from '@directus/sdk';
import { ImageList } from '~/components/image-list';
import { TPlayer } from '~/types/player';
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

  return json({ isUserLoggedIn: true, players: playersWithImages });
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
