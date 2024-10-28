import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect, useFetcher, useLoaderData } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email().min(2).max(50),
  password: z.string().min(2).max(50),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const { isUserLoggedIn, getRequestHeaders, session } = await Auth(request);

  if (isUserLoggedIn) {
    // Redirect to the home page if they are already signed in.
    return redirect('/');
  }

  const error = session.get('error');
  session.unset('error');

  return json(
    { error },
    {
      headers: {
        ...(await getRequestHeaders()),
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const { login } = await Auth(request);
  return await login();
}

export default function Index() {
  const data = useLoaderData<{
    error: string | null;
  }>();
  // login screen
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== 'idle';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    fetcher.submit(values, { method: 'post' });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Login</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-8 space-y-4">
          {data.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{data.error}</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>The email you registered.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  This is your private password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
