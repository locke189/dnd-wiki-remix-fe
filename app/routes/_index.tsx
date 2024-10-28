import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readMe } from '@directus/sdk';
import { NavBar } from '~/containers/navbar';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
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
      <NavBar isUserLoggedIn={data?.isUserLoggedIn ?? false} />
      <div className="container mx-auto p-4 text-black my-11 rounded-lg bg-stone-200/75 min-h-80 flex justify-between">
        <div className="flex flex-col justify-center w-2/3 p-8">
          <h2 className="text-2xl font-bold">Discover the World of Faerun!</h2>
          <p className="text-lg">
            Dive into a rich archive of lore, characters, and ongoing quests
            from our latest campaign. Here, you’ll find everything you need to
            navigate the lands, track key players, and stay informed on current
            missions. Whether you’re preparing for the next session or
            revisiting past encounters, this is your portal to the adventure.
          </p>
        </div>
        <img
          src="/DND_Art9.png"
          alt="Dungeons and Dragons"
          className="rounded-lg object-cover w-1/3"
        ></img>
      </div>
    </>
  );
}
