import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readItem, updateItem } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';

import { NpcPage } from '~/pages/npc-page';
import { TNpc } from '~/types/npc';
import { getImageUrl } from '~/lib/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

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
    updateItem('Npc', id, data as object)
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

  const npc = await client.request(
    readItem('Npc', id, {
      fields: [
        '*',
        'campaigns.*',
        'Allied_Players.*',
        'sessions.*',
        'Locations.*',
      ],
    })
  );

  return json(
    {
      isUserLoggedIn: true,
      npc: { ...npc, main_image: getImageUrl(npc.main_image) },
    },
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
    npc: TNpc;
  }>();

  const { npc } = data || {};

  return (
    // navbar
    <>
      <NpcPage npc={npc} key={npc.id} />
    </>
  );
}
