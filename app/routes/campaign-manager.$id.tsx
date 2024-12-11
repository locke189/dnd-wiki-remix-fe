import { readItem, updateItem } from '@directus/sdk';
import {
  ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';

import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';
import { CampaignManagerPage } from '~/pages/campaign-manager-page';

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
  console.log('saving campaign');

  const body = await request.formData();
  const { id } = params;
  if (!id) {
    return redirect('/');
  }

  const data = JSON.parse(String(body.get('data')));

  const campaign = await client.request(
    updateItem('campaigns', id, data as object)
  );

  return json({ data: campaign });
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

  const campaign = await client.request(
    readItem('campaigns', id, {
      fields: ['*'],
    })
  );

  return json({
    isUserLoggedIn: true,
    campaign,
  });
}

export default function Index() {
  return (
    // navbar
    <CampaignManagerPage />
  );
}
