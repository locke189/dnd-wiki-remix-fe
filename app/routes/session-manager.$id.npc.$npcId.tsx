import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { readItem } from '@directus/sdk';

import { NpcPage, SMNpcPage } from '~/pages/sm-npc-page';
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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const { npcId } = params;

  if (!npcId) {
    return redirect('/');
  }

  const npc = await client.request(
    readItem('Npc', npcId, {
      fields: [
        '*',
        'campaigns.*',
        'Allied_Players.*',
        'sessions.*',
        'Locations.*',
        'Parties.*',
        'Items.*',
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
      <SMNpcPage npc={npc} key={npc.id} />
    </>
  );
}
