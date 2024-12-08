import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { createItem } from '@directus/sdk';

import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';
import { PartyPage } from '~/pages/party-page';
import { TParty } from '~/types/party';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  return json({
    isUserLoggedIn: true,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  //url
  const url = new URL(request.headers.get('Referer') || '');
  console.log(url, url.pathname, request);

  client.setToken(user?.token);

  const body = await request.formData();

  console.log('creating party', body);

  const data = JSON.parse(String(body.get('data')));

  const newParty = await client.request(createItem('Parties', data as object));

  return url.pathname === '/party/new'
    ? redirect(`/party/${newParty.id}`)
    : json({ data: newParty });
}

export default function Index() {
  const emptyParty: TParty = {
    id: 0,
    name: '',
    description: '',
    main_image: '',
    players: [],
    npcs: [],
    locations: [],
    status: '',
    campaigns: [],
    master_notes: '',
  };

  return (
    // navbar
    <PartyPage party={emptyParty} isNew />
  );
}
