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
import { TItem } from '~/types/item';
import { ItemPage } from '~/pages/item-page';

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

  const item = await client.request(
    readItem('Items', id, {
      fields: ['*', 'Players.*', 'Npcs.*', 'Locations.*'],
    })
  );

  return json({
    isUserLoggedIn: true,
    item: {
      ...item,
      main_image: getImageUrl(item.main_image),
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

  const party = await client.request(updateItem('Items', id, data as object));

  return json({ data: party });
}

export default function Index() {
  const { id } = useParams();
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    item: TItem;
  }>();

  const { item } = data || {};

  return (
    // navbar
    <ItemPage item={item} key={id} />
  );
}
