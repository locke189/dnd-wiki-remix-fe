import { Link } from '@remix-run/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../components/ui/navigation-menu';
import React from 'react';
import { PersonStanding } from 'lucide-react';

type NavBarProps = {
  isUserLoggedIn: boolean;
  players?: { name: string; id: string }[];
};

export const NavBar: React.FC<NavBarProps> = ({
  isUserLoggedIn,
  players = [],
}) => {
  return (
    <nav className="flex justify-between items-center py-4 px-32 bg-stone-50">
      <div className="flex gap-8 items-center">
        <img
          src="/dnd-logo-blk.png"
          alt="DnD Wiki"
          className="w-10 h-10 object-cover"
        ></img>
        <h1 className="text-4xl font-bod">The Realm Record</h1>
      </div>
      <ul className="flex space-x-4">
        {isUserLoggedIn ? (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Campaigns</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/campaigns"
                        >
                          <PersonStanding className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Campaigns
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore all the campaigns.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Players</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/players"
                        >
                          <PersonStanding className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Players
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore detailed character histories, backgrounds,
                            and achievements. Uncover the stories, choices, and
                            deeds that have shaped each adventurer’s path.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    {players?.length > 0 && (
                      <ul>
                        {players?.map((player) => (
                          <li key={player.id}>
                            <Link to={`/players/${player.id}`}>
                              {player.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* <ListItem href="/docs" title="Introduction">
                      Re-usable components built using Radix UI and Tailwind
                      CSS.
                    </ListItem>
                    <ListItem href="/docs/installation" title="Installation">
                      How to install dependencies and structure your app.
                    </ListItem>
                    <ListItem
                      href="/docs/primitives/typography"
                      title="Typography"
                    >
                      Styles for headings, paragraphs, lists...etc
                    </ListItem> */}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/logout" className={navigationMenuTriggerStyle()}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Logout
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <>
            <li>
              <a href="/login">Login</a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
