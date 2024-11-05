import { Link, useLoaderData } from '@remix-run/react';
import {
  Blend,
  Bot,
  Church,
  Gamepad2,
  Hotel,
  House,
  LandPlot,
  Map,
  Mountain,
  Sailboat,
  Sparkles,
  Swords,
  TreePalm,
  User2,
  UtensilsCrossed,
} from 'lucide-react';
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar';
import { AppContext } from '~/context/app.context';

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

export type TNPC = {
  id: number;
  name: string;
  campaigns: { campaigns_id: number }[];
};

export type TLocationType =
  | 'plane'
  | 'realm'
  | 'island'
  | 'region'
  | 'ship'
  | 'city'
  | 'town'
  | 'inn_tavern_shop'
  | 'temple_shrine'
  | 'dungeon_cave'
  | 'place_road';

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
  npcs: TNPC[];
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

  const mapLocationTypeToIcon = (type: TLocationType) => {
    switch (type) {
      case 'plane':
        return <Sparkles />;
      case 'realm':
        return <Blend />;
      case 'island':
        return <TreePalm />;
      case 'region':
        return <LandPlot />;
      case 'ship':
        return <Sailboat />;
      case 'city':
        return <Hotel />;
      case 'town':
        return <House />;
      case 'inn_tavern_shop':
        return <UtensilsCrossed />;
      case 'temple_shrine':
        return <Church />;
      case 'dungeon_cave':
        return <Swords />;
      case 'place_road':
        return <Mountain />;
      default:
        return <Map />;
    }
  };

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
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <div>
                      {mapLocationTypeToIcon(location.type)}
                      <span>{location.name}</span>
                    </div>
                  </SidebarMenuButton>
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
                </CollapsibleTrigger>
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
