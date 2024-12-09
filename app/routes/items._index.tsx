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
import { Portal } from '~/components/portal';
import { LAYOUT_PAGE_HEADER_PORTAL_ID } from '~/models/global';
import { Input } from '~/components/ui/input';
import { useContext, useState } from 'react';
import { AppContext } from '~/context/app.context';
import { ToggleIcon } from '~/components/toggle-icon';
import { useFavorite } from '~/hooks/set-favorite';
import { TItem } from '~/types/item';

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

  const items = await client.request(
    readItems('Items', {
      fields: ['*', 'campaigns.*'],
    })
  );

  const itemsWithImages = items.map((item) => {
    return {
      ...item,
      main_image: `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${item.main_image}`,
    };
  });

  return json({ isUserLoggedIn: true, items: itemsWithImages });
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    items: TItem[];
  } | null>();

  const [search, setSearch] = useState('');
  const { setFavorite } = useFavorite();
  const appContext = useContext(AppContext);

  const items =
    data?.items
      ?.filter((item) => {
        const inCampaign = item.campaigns?.some(
          (campaign) => campaign.campaigns_id === appContext?.selectedCampaignId
        );

        return (
          inCampaign && item.name.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name)) || [];

  return (
    // navbar
    <div className="grid auto-rows-min gap-4 lg:grid-cols-12 grid-cols-8 mx-8 space-y-10 mt-8">
      <Portal portalId={LAYOUT_PAGE_HEADER_PORTAL_ID}>
        <header className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">Items</h1>
        </header>
      </Portal>
      <div className="col-span-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="filter"
        />
      </div>
      <ImageList
        className="col-span-12"
        data={items.map((item) => ({
          id: item.id,
          imageUrl: item.main_image,
          name: item.name,
          url: `/item/${item.id}`,
          action: (
            <>
              <ToggleIcon
                isToggled={item.favorite}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setFavorite(!item.favorite, `/item/${item.id}`);
                }}
              />
            </>
          ),
        }))}
      />
    </div>
  );
}
