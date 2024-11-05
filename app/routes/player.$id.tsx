import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readItem } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

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

  const player = await client.request(
    readItem('Player', id, {
      fields: ['*'],
    })
  );

  const playerWithImages = {
    ...player,
    main_image_url: `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${player.main_image}`,
  };

  return json(
    { isUserLoggedIn: true, player: playerWithImages },
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
    player: {
      name: string;
      id: string;
      main_image?: string;
      main_image_url?: string;
      class?: string;
      race?: string;
      story?: string;
      goals?: string;
      private_goals?: string;
      url?: string;
    };
  } | null>();

  const { player } = data || {};

  return (
    // navbar
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
          <Card className="aspect-video rounded-xl bg-muted/50 flex items-center relative">
            {player?.main_image_url && (
              <Avatar className="h-full w-full rounded-xl absolute ">
                <AvatarImage
                  src={player?.main_image_url}
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </Card>
          <Card className="aspect-video rounded-xl bg-muted/50">
            <CardHeader>
              <CardTitle>{player?.name}</CardTitle>
              <CardDescription>
                {player?.class} - {player?.race}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="aspect-video rounded-xl bg-muted/50"></Card>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
          {player?.story && (
            <article className="container mx-auto">
              <h2 className="text-xl font-bold my-4">Story</h2>
              <p className="text-base">{player?.story}</p>
            </article>
          )}
          {player?.goals && (
            <article className="container mx-auto my-8">
              <h2 className="text-xl font-bold my-4">Goals</h2>
              <p className="text-base">{player?.goals}</p>
            </article>
          )}
          {player?.private_goals && (
            <article className="container mx-auto my-8">
              <h2 className="text-xl font-bold my-4">Private Goals</h2>
              <p className="text-base">{player?.private_goals}</p>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
