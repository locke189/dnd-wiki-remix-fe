import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readMe } from '@directus/sdk';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders } = await Auth(request);

  if (!isUserLoggedIn || client === null) {
    return json({ isUserLoggedIn: false });
  }

  const user = await client.request(
    readMe({
      fields: ['*'],
    })
  );

  console.log('user', user);

  return json(
    { isUserLoggedIn: true },
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
  } | null>();

  return (
    // navbar
    <>
      {data?.isUserLoggedIn ? (
        <div className="container mx-auto p-4 text-black my-11 rounded-lg bg-stone-200/75 min-h-80 flex justify-between">
          <div className="flex flex-col justify-center w-2/3 p-8">
            <h2 className="text-2xl font-bold">
              Discover the World of Faerun!
            </h2>
            <p className="text-lg">
              Dive into a rich archive of lore, characters, and ongoing quests
              from our latest campaign. Here, you’ll find everything you need to
              navigate the lands, track key players, and stay informed on
              current missions. Whether you’re preparing for the next session or
              revisiting past encounters, this is your portal to the adventure.
            </p>
          </div>
          <img
            src="/DND_Art9.png"
            alt="Dungeons and Dragons"
            className="rounded-lg object-cover w-1/3"
          ></img>
        </div>
      ) : (
        <div className="container mx-auto p-4 text-black my-11 rounded-lg bg-stone-200/75 min-h-80 flex justify-between">
          <div className="flex flex-col justify-center w-2/3 p-8">
            <h2 className="text-2xl font-bold">Welcome to the Realm Record!</h2>
            <p className="text-lg">
              The Realm Record is a digital archive of our Dungeons & Dragons
              campaign. Here, you can explore character histories, review past
              quests, and track the ongoing adventures of our party. Dive into
              the lore, discover the secrets, and join us on our journey through
              the realms.
            </p>
          </div>
          <img
            src="/DND_Art9.png"
            alt="Dungeons and Dragons"
            className="rounded-lg object-cover w-1/3"
          ></img>
        </div>
      )}
    </>
  );
}
