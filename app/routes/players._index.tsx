import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readItems } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';

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
    }[];
  } | null>();

  return (
    // navbar
    <section className="container mx-auto">
      <h1 className="my-8 text-2xl font-bold">Players</h1>
      <div className="flex gap-7">
        {data?.players?.map((player) => (
          <Link key={player.id} to={`/players/${player.id}`}>
            <div>
              <img
                className="object-cover h-40 x-40 radius-lg"
                src={player.main_image_url}
                alt={player.name}
              />
              <h2 className="text-lg">{player.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
