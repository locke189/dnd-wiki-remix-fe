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
    updateItem('Locations', id, data as object)
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

  const location = await client.request(
    readItem('Locations', id, {
      fields: [
        '*',
        'campaigns.*',
        'sessions.*',
        'sub_locations.*',
        'Npcs.*',
        'Parties.*',
        'items.*',
      ],
    })
  );

  return json({
    isUserLoggedIn: true,
    location: {
      ...location,
      main_image: getImageUrl(location.main_image),
      sub_locations: location.sub_locations.map((l: TLocation) => ({
        ...l,
        main_image: getImageUrl(l.main_image),
      })),
    },
  });
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    location: TLocation;
  } | null>();

  const { location } = data || {};

  return (
    // navbar
    <>
      <LocationPage location={location} key={location?.id} />
    </>
  );
}
