import { createItem } from '@directus/sdk';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const body = await request.formData();

  console.log('creating npc', body);

  const data = JSON.parse(String(body.get('data')));

  const gameSession = await client.request(createItem('Npc', data as object));

  return json({ data: gameSession });
}
