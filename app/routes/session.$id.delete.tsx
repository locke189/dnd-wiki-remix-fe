import { ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { deleteItem } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function action({ request, params }: ActionFunctionArgs) {
  const { client, isUserLoggedIn, session } = await Auth(request);

  const { id } = params;

  if (!isUserLoggedIn || client === null || !id) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  await client.request(deleteItem('sessions', id));

  return redirect('/');
}
