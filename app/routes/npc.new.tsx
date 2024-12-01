import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useParams } from '@remix-run/react';
import { createItem } from '@directus/sdk';

import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';
import { TNpc } from '~/types/npc';
import { NpcPage } from '~/pages/npc-page';

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

  console.log('creating npc', body);

  const data = JSON.parse(String(body.get('data')));

  const newNpc = await client.request(createItem('Npc', data as object));

  return url.pathname === '/npc/new'
    ? redirect(`/npc/${newNpc.id}`)
    : json({ data: newNpc });
}

export default function Index() {
  const { id } = useParams();

  // const appContext = useContext(AppContext);
  // const { selectedCampaignId } = appContext;

  const emptyNpc: TNpc = {
    name: '',
    id: 0,
    Locations: [],
    race: '',
    class: '',
    gender: '',
    status: '',
    age: '',
    main_image: '',
    description: '',
    story: '',
    master_notes: '',
    Allied_Players: [],
    campaigns: [],
    sessions: [],
    Parties: [],
    Items: [],
  };

  return (
    // navbar
    <>
      <NpcPage npc={emptyNpc} key={id} isNew={true} />
    </>
  );
}
