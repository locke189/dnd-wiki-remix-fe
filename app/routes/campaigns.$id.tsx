import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { readItem } from '@directus/sdk';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { client } from '~/lib/directus.server';
import { authenticator } from '~/lib/authentication.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const { id } = params;
  if (!id) {
    return redirect('/');
  }

  const campaign = await client.request(
    readItem('campaigns', id, {
      fields: ['*'],
    })
  );

  const campaignWithImages = {
    ...campaign,
    imageUrl: campaign.image
      ? `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${campaign?.image}`
      : '',
  };

  return json({ isUserLoggedIn: true, campaign: campaignWithImages });
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    campaign: {
      name: string;
      id: string;
      image?: string;
      imageUrl?: string;
      description?: string;
    };
  } | null>();

  const { campaign } = data || {};

  return (
    // navbar
    <>
      <header className="container mx-auto p-10 rounded-sm bg-slate-400">
        <div className="flex gap-7">
          <div className="overflow-hidden h-40 x-40 rounded-full">
            <img
              className="object-cover h-40 x-40 radius-lg"
              src={campaign?.imageUrl}
              alt={campaign?.name}
            />
          </div>
          <div className="flex flex-col gap-4 justify-center">
            <h1 className="text-5xl font-bold">{campaign?.name}</h1>
          </div>
        </div>
      </header>
      <section className="container mx-auto my-8 grid grid-cols-12 gap-8">
        <main className="col-span-8">
          {campaign?.description && (
            <article className="container mx-auto my-8">
              <h2 className="text-xl font-bold my-4">Background Story</h2>
              <p className="text-base">{campaign?.description}</p>
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
