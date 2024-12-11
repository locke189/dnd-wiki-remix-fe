import {
  json,
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

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  return json({
    isUserLoggedIn: true,
  });
}

export default function Index() {
  return (
    // navbar
    <CampaignManagerPage />
  );
}
