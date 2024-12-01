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
import { TLocation } from '~/types/location';
import { LocationPage } from '~/pages/location-page';

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

  client.setToken(user?.token);

  const body = await request.formData();

  console.log('creating Location', body);

  const data = JSON.parse(String(body.get('data')));

  const newLocation = await client.request(
    createItem('Locations', data as object)
  );

  return url.pathname === '/location/new'
    ? redirect(`/location/${newLocation.id}`)
    : json({ data: newLocation });
}

export default function Index() {
  const { id } = useParams();

  // const appContext = useContext(AppContext);
  // const { selectedCampaignId } = appContext;

  const emptyLocation: TLocation = {
    id: 0,
    status: 'draft',
    name: '',
    type: 'plane',
    image: '',
    main_image: '',
    description: '',
    master_notes: '',
    parent_location: 0,
    campaigns: [],
    Npcs: [],
    sessions: [],
    sub_locations: [],
    Parties: [],
    items: [],
  };

  return (
    // navbar
    <>
      <LocationPage location={emptyLocation} key={id} isNew={true} />
    </>
  );
}
