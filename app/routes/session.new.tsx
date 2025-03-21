import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useParams } from '@remix-run/react';
import { createItem } from '@directus/sdk';

import { SessionPage } from '~/pages/session-page';
import { TSession } from '~/types/session';
import { AppContext } from '~/context/app.context';
import { useContext } from 'react';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';

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

  client.setToken(user?.token);
  const body = await request.formData();

  const data = JSON.parse(String(body.get('data')));

  const gameSession = await client.request(
    createItem('sessions', data as object)
  );

  return redirect(`/session/${gameSession.id}`);
}

export default function Index() {
  const { id } = useParams();

  const appContext = useContext(AppContext);
  const { selectedCampaignId } = appContext;

  const emptySession: TSession = {
    name: '',
    date: new Date().toISOString(),
    campaign: selectedCampaignId,
    id: 0,
    players: [],
    Npcs: [],
    Locations: [],
  };

  return (
    // navbar
    <>
      <SessionPage gameSession={emptySession} key={id} isNew={true} />
    </>
  );
}
