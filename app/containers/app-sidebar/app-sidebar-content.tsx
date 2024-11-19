import { Link, useLoaderData } from '@remix-run/react';
import { Bot, ChevronDown, Gamepad2, Map, Plus, User2 } from 'lucide-react';
import { ReactNode, useContext } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar';
import { AppContext } from '~/context/app.context';
import { mapLocationTypeToIcon } from '~/lib/locations';
import { TLocationType } from '~/types/location';
import { TNpc } from '~/types/npc';

export type TSession = {
  id: number;
  name: string;
  date: string;
  campaign: number;
};

export type TPlayer = {
  id: number;
  name: string;
  campaigns: { campaigns_id: number }[];
};

export type TLocation = {
  id: number;
  name: string;
  campaigns: { campaigns_id: number }[];
  Locations: number[];
  parent_location: number;
  type: TLocationType;
};

export type TAppSidebarContentProps = {
  sessions: TSession[];
  players: TPlayer[];
  npcs: TNpc[];
  locations: TLocation[];
};

export const AppSidebarContent: React.FC = () => {
  const { sessions, players, npcs, locations } =
    useLoaderData<TAppSidebarContentProps>();
  const context = useContext(AppContext);

  const selectedCampaignSessions = sessions
    .filter((session) => session.campaign === context?.selectedCampaignId)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const selectedCampaignPlayers = players
    .filter((player) =>
      player.campaigns.some(
        (campaign) => campaign.campaigns_id === context?.selectedCampaignId
      )
    )
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const selectedCampaignNPCs = npcs
    .filter((npc) =>
      npc.campaigns.some(
        (campaign) => campaign.campaigns_id === context?.selectedCampaignId
      )
    )
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const getLocationsDom: (parent: null | number) => ReactNode = (
    parent = null
  ) => {
    const locationsDom = locations
      .filter(
        (location) =>
          location.parent_location === parent &&
          location.campaigns.some(
            (campaign) => campaign.campaigns_id === context?.selectedCampaignId
          )
      )
      .sort((a, b) => (a.type > b.type ? -1 : 1))
      .map((location) => {
        if (location.Locations.length > 0) {
          return (
            <Collapsible className="group/collapsible" key={location.id}>
              <SidebarMenuItem className="pr-0 mr-0">
                <Link to={`/location/${location.id}`}>
                  <SidebarMenuButton asChild>
                    <div>
                      {mapLocationTypeToIcon(location.type)}
                      <span>{location.name}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction>
                    <ChevronDown /> <span className="sr-only">New Npc</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="pr-0 mr-0">
                    {getLocationsDom(location.id)}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        } else {
          return (
            <SidebarMenuSubItem key={location.id} className="pr-0 mr-0">
              <SidebarMenuButton asChild>
                <Link to={`/location/${location.id}`}>
                  {mapLocationTypeToIcon(location.type)}
                  <span>{location.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuSubItem>
          );
        }
      });

    return locationsDom;
  };

  const dom = getLocationsDom(null);

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <div>
                      <Gamepad2 />
                      <span>Sessions</span>
                    </div>
                  </SidebarMenuButton>
                  {/* <SidebarMenuAction>
                    <Plus /> <span className="sr-only">New Session</span>
                  </SidebarMenuAction> */}
                </CollapsibleTrigger>
                <SidebarMenuAction asChild>
                  <Link to="/session/new">
                    <Plus /> <span className="sr-only">New Session</span>
                  </Link>
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {selectedCampaignSessions?.map((session) => (
                      <SidebarMenuSubItem key={session.name}>
                        <Link to={`/session/${session.id}`}>
                          {session.name}
                        </Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <div>
                      <User2 />
                      <span>Players</span>
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {selectedCampaignPlayers?.map((player) => (
                      <SidebarMenuSubItem key={player.name}>
                        <Link to={`/player/${player.id}`}>{player.name}</Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <div>
                      <Bot />
                      <span>NPCs</span>
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <SidebarMenuAction asChild>
                  <Link to="/npc/new">
                    <Plus /> <span className="sr-only">New Npc</span>
                  </Link>
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {selectedCampaignNPCs?.map((npc) => (
                      <SidebarMenuSubItem key={npc.name}>
                        <Link to={`/npc/${npc.id}`}>{npc.name}</Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <div>
                      <Map />
                      <span>Locations</span>
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <SidebarMenuAction asChild>
                  <Link to="/location/new">
                    <Plus /> <span className="sr-only">New Location</span>
                  </Link>
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub className="pr-0 mr-0">{dom}</SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
