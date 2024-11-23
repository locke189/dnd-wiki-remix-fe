import { ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { deleteItem } from '@directus/sdk';
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

  const { id } = params;

  if (!id) {
    return redirect('/');
  }

  await client.request(deleteItem('sessions', id));

  return redirect('/');
}
