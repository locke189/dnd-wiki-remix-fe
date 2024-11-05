import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readItem } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders, session } = await Auth(
    request
  );

  const { id } = params;

  if (!isUserLoggedIn || client === null || !id) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const location = await client.request(
    readItem('Locations', id, {
      fields: ['*'],
    })
  );

  const locationWithImages = {
    ...location,
    main_image_url: `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${location.main_image}`,
  };

  return json(
    { isUserLoggedIn: true, location: locationWithImages },
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
    location: {
      name: string;
      id: string;
      main_image?: string;
      main_image_url?: string;
      description?: string;
      master_notes?: string;
    };
  } | null>();

  const { location } = data || {};

  return (
    // navbar
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
          <Card className="aspect-video rounded-xl bg-muted/50 flex items-center relative">
            {location?.main_image_url && (
              <Avatar className="h-full w-full rounded-xl absolute ">
                <AvatarImage
                  src={location?.main_image_url}
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </Card>
          <Card className="aspect-video rounded-xl bg-muted/50">
            <CardHeader>
              <CardTitle>{location?.name}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
          </Card>
          <Card className="aspect-video rounded-xl bg-muted/50"></Card>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
          {location?.description && (
            <article className="container mx-auto">
              <h2 className="text-xl font-bold my-4">Description</h2>
              <p className="text-base">{location?.description}</p>
            </article>
          )}
          {location?.master_notes && (
            <article className="container mx-auto my-8">
              <h2 className="text-xl font-bold my-4">Notes</h2>
              <p className="text-base">{location?.master_notes}</p>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
