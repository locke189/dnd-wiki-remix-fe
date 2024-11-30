import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData, useParams } from '@remix-run/react';
import { readItem, updateItem } from '@directus/sdk';

import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';
import { getImageUrl } from '~/lib/utils';
import { PartyPage } from '~/pages/party-page';
import { TParty } from '~/types/party';

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

  const { id } = params;

  if (!id) {
    return redirect('/');
  }

  const party = await client.request(
    readItem('Parties', id, {
      fields: ['*', 'players.*', 'npcs.*', 'locations.*'],
    })
  );

  return json({
    isUserLoggedIn: true,
    party: {
      ...party,
      main_image: getImageUrl(party.main_image),
    },
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const body = await request.formData();
  const { id } = params;

  if (!id) {
    return redirect('/');
  }

  const data = JSON.parse(String(body.get('data')));

  const party = await client.request(updateItem('Parties', id, data as object));

  return json({ data: party });
}

export default function Index() {
  const { id } = useParams();
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    party: TParty;
  }>();

  const { party } = data || {};
  console.log(data);

  return (
    console.log(data),
    (
      // navbar
      <PartyPage party={party} key={id} />
    )
  );
}
