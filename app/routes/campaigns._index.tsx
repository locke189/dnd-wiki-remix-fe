import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { readItems } from '@directus/sdk';
import { ImageList } from '~/components/image-list';
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

  return json({ isUserLoggedIn: !!user, campaigns: campaignsWithImages });
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
