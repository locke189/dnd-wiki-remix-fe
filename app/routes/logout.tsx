import { LoaderFunctionArgs } from '@remix-run/node';
import { Auth } from '~/lib/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { logout } = await Auth(request);

  return await logout();
}
