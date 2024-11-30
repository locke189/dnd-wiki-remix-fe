import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { readItem, updateItem } from '@directus/sdk';

import { NpcPage } from '~/pages/npc-page';
import { TNpc } from '~/types/npc';
import { getImageUrl } from '~/lib/utils';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const body = await request.formData();
  const { id } = params;

  if (!id) {
    return redirect('/login');
  }

  const data = JSON.parse(String(body.get('data')));

  const gameSession = await client.request(
    updateItem('Npc', id, data as object)
  );

  return json({ data: gameSession });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const { id } = params;

  if (!id) {
    return redirect('/');
  }

  const npc = await client.request(
    readItem('Npc', id, {
      fields: [
        '*',
        'campaigns.*',
        'Allied_Players.*',
        'sessions.*',
        'Locations.*',
        'Parties.*',
      ],
    })
  );

  return json({
    isUserLoggedIn: true,
    npc: { ...npc, main_image: getImageUrl(npc.main_image) },
  });
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
