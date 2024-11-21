import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readItem, updateItem } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { getImageUrl } from '~/lib/utils';
import { TLocation } from '~/types/location';
import { LocationPage } from '~/pages/location-page';

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
    updateItem('Locations', id, data as object)
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

  return json(
    {
      isUserLoggedIn: true,
      location: { ...location, main_image: getImageUrl(location.main_image) },
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
