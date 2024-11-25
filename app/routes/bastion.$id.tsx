import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { readItem, updateItem } from '@directus/sdk';

import { getImageUrl } from '~/lib/utils';
import { TLocation } from '~/types/location';
import { LocationPage } from '~/pages/location-page';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';
import { BastionPage } from '~/pages/bastion-page';
import { TBastion } from '~/types/bastion';

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
    updateItem('bastion', id, data as object)
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

  const bastion = await client.request(
    readItem('bastion', id, {
      fields: [
        '*',
        'campaigns.*',
        'sessions.*',
        'sub_locations.*',
        'player.*',
        'npcs.*',
        'items.*',
      ],
    })
  );

  return json({
    isUserLoggedIn: true,
    bastion: {
      ...bastion,
      main_image: getImageUrl(bastion.main_image),
      player: {
        ...bastion.player,
        main_image: getImageUrl(bastion.player.main_image),
      },
    },
  });
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    bastion: TBastion;
  } | null>();

  const { bastion } = data || {};

  return (
    // navbar
    <>
      <BastionPage bastion={bastion} key={bastion?.id} />
    </>
  );
}
