import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { readItem } from '@directus/sdk';

import { getImageUrl } from '~/lib/utils';
import { TLocation } from '~/types/location';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';
import { SMLocationPage } from '~/pages/sm-location-page';

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

  const { locationId } = params;
  if (!locationId) {
    return redirect('/');
  }

  const location = await client.request(
    readItem('Locations', locationId, {
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
      <SMLocationPage location={location} key={location?.id} />
    </>
  );
}
