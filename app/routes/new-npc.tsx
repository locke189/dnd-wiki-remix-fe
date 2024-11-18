import { createItem } from '@directus/sdk';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Auth } from '~/lib/auth.server';
import { commitSession } from '~/lib/sessions.server';

export async function action({ request }: ActionFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders, session } = await Auth(
    request
  );

  const body = await request.formData();

  console.log('creating npc', body);

  if (!isUserLoggedIn || client === null) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const data = JSON.parse(String(body.get('data')));

  const gameSession = await client.request(createItem('Npc', data as object));

  return json(
    { data: gameSession },
    {
      headers: {
        ...(await getRequestHeaders()),
      },
    }
  );
}
