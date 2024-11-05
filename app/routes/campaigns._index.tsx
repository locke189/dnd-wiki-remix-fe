import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readItems } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';
import { ImageList } from '~/components/image-list';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders, session } = await Auth(
    request
  );

  if (!isUserLoggedIn || client === null) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const campaigns = await client.request(
    readItems('campaigns', {
      fields: ['name', 'id', 'image'],
    })
  );

  const campaignsWithImages = campaigns.map((campaign: any) => {
    return {
      ...campaign,
      imageUrl: campaign.Image
        ? `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${campaign?.image}`
        : '',
      url: `/campaigns/${campaign.id}`,
    };
  });

  return json(
    { isUserLoggedIn: true, campaigns: campaignsWithImages },
    {
      headers: {
        ...(await getRequestHeaders()),
      },
    }
  );
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    campaigns: {
      name: string;
      id: string;
      image: string;
      imageUrl: string;
      url: string;
    }[];
  } | null>();

  return (
    // navbar
    <ImageList
      title="Players"
      data={data?.campaigns.map((campaign) => ({
        id: campaign.id,
        imageUrl: campaign.imageUrl,
        name: campaign.name,
        url: campaign.url,
      }))}
    />
  );
}
