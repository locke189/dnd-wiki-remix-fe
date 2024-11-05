import { ChevronDown, Swords } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../components/ui/sidebar';
import { useLoaderData } from '@remix-run/react';
import { AppContext } from '~/context/app.context';
import { useContext } from 'react';

export type TAppSidebarHeaderProps = {
  campaigns: { name: string; id: number }[];
};

export const AppSidebarHeader: React.FC = () => {
  const { campaigns } = useLoaderData<TAppSidebarHeaderProps>();
  const context = useContext(AppContext);
  const selectedCampaign = campaigns.find(
    (campaign) => campaign.id === context?.selectedCampaignId
  );

  console.log('campaigns', campaigns);

  return (
    campaigns?.length > 0 && (
      <SidebarHeader className="py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12">
                  <div className="p-2 bg-black rounded text-white">
                    <Swords />
                  </div>
                  {selectedCampaign?.name}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                {campaigns.map(({ name, id }) => (
                  <DropdownMenuItem
                    key={id}
                    onClick={() => context?.setSelectedCampaignId(id)}
                  >
                    <span>{name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    )
  );
};
