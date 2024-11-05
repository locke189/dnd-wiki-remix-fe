import React from 'react';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ChevronUp, User2 } from 'lucide-react';
import { Link, useLoaderData } from '@remix-run/react';

interface AppSidebarFooterProps {
  // Define your prop types here
  user: {
    name: string;
    email: string;
  };
}

const AppSidebarFooter: React.FC = () => {
  const { user } = useLoaderData<AppSidebarFooterProps>();
  return (
    user && (
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user.email}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Link to={'logout'}>
                    <span>Sign out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    )
  );
};

export default AppSidebarFooter;
