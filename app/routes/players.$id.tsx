import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readItem, readItems } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

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

  const player = await client.request(
    readItem('Player', id, {
      fields: ['*'],
    })
  );

  console.log('player', player);

  const playerWithImages = {
    ...player,
    main_image_url: `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${player.main_image}`,
  };

  return json(
    { isUserLoggedIn: true, player: playerWithImages },
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
    player: {
      name: string;
      id: string;
      main_image?: string;
      main_image_url?: string;
      age?: string;
      class?: string;
      race?: string;
      background_story?: string;
      plot?: string;
    };
  } | null>();

  console.log('this data', data, data?.player?.secrets);

  const { player } = data || {};

  return (
    // navbar
    <>
      <header className="container mx-auto p-10 rounded-sm bg-slate-400">
        <div className="flex gap-7">
          <div className="overflow-hidden h-40 x-40 rounded-full">
            <img
              className="object-cover h-40 x-40 radius-lg"
              src={player?.main_image_url}
              alt={player?.name}
            />
          </div>
          <div className="flex flex-col gap-4 justify-center">
            <h1 className="text-5xl font-bold">{player?.name}</h1>
            <p className="text-2xl font-bold">
              {player?.race} - {player?.class}
            </p>
          </div>
        </div>
      </header>
      <section className="container mx-auto my-8 grid grid-cols-12 gap-8">
        <main className="col-span-8">
          {player?.background_story && (
            <article className="container mx-auto my-8">
              <h2 className="text-xl font-bold my-4">Background Story</h2>
              <p className="text-base">{player?.background_story}</p>
            </article>
          )}
          {player?.plot && (
            <article className="container mx-auto my-8">
              <h2 className="text-xl font-bold my-4">DM ONLY: Plot</h2>
              <p className="text-base">{player?.plot}</p>
            </article>
          )}
        </main>
        <div className="col-span-1"></div>
        <aside className="col-span-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Key Items</AccordionTrigger>
              <AccordionContent>This is a Key Item</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Allies</AccordionTrigger>
              <AccordionContent>Sildar Halwinter</AccordionContent>
              <AccordionContent>Astoria</AccordionContent>
              <AccordionContent>Glint</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Quests</AccordionTrigger>
              <AccordionContent>Sildar Halwinter</AccordionContent>
              <AccordionContent>Astoria</AccordionContent>
              <AccordionContent>Glint</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Secrets</AccordionTrigger>
              <AccordionContent>Sildar Halwinter</AccordionContent>
              <AccordionContent>Astoria</AccordionContent>
              <AccordionContent>Glint</AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>
      </section>
    </>
  );
}
