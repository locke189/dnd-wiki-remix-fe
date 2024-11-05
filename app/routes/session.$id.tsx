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
      fields: ['*'],
    })
  );

  return json(
    { isUserLoggedIn: true, gameSession },
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
    gameSession: {
      name: string;
      id: string;
      date?: string;
      recap?: string;
      master_start?: string;
      master_scenes?: string;
      master_secrets?: string;
    };
  } | null>();

  const { gameSession } = data || {};

  return (
    // navbar
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
          <Card className="aspect-video rounded-xl bg-muted/50">
            <CardHeader>
              <CardTitle>{gameSession?.name}</CardTitle>
              <CardDescription>{gameSession?.date}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="aspect-video rounded-xl bg-muted/50 flex items-center relative"></Card>
          <Card className="aspect-video rounded-xl bg-muted/50"></Card>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
          {gameSession?.recap && (
            <article className="container mx-auto">
              <h2 className="text-xl font-bold my-4">Recap</h2>
              <p className="text-base">{gameSession?.recap}</p>
            </article>
          )}
          {gameSession?.master_start && (
            <article className="container mx-auto my-8">
              <h2 className="text-xl font-bold my-4">Strong Start</h2>
              <p className="text-base">{gameSession?.master_start}</p>
            </article>
          )}
          {gameSession?.master_scenes && (
            <article className="container mx-auto my-8">
              <h2 className="text-xl font-bold my-4">Possible Scenes</h2>
              <p className="text-base">{gameSession?.master_scenes}</p>
            </article>
          )}
          {gameSession?.master_secrets && (
            <article className="container mx-auto my-8">
              <h2 className="text-xl font-bold my-4">Secrets</h2>
              <p className="text-base">{gameSession?.master_secrets}</p>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
