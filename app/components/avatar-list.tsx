import { Link } from '@remix-run/react';
import { TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { getLocationTypeData } from '~/lib/locations';

export type TAvatarListProps<T> = {
  data?: T[];
  routePrefix: string;
  title: string;
};

export const AvatarList = <
  T extends { id: number; name: string; main_image: string }
>({
  data,
  routePrefix,
  title,
}: TAvatarListProps<T>) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">{title}</h2>
      <ul className="flex flex-row gap-2 flex-wrap">
        {data?.map((item) => (
          <li key={item.id}>
            <Link to={`${routePrefix}${item.id}`}>
              <HoverCard>
                <HoverCardTrigger>
                  <Avatar>
                    <AvatarImage
                      src={item.main_image}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {item.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-2 items-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        className="h-20 w-20 object-cover"
                        src={item.main_image}
                      />
                      <AvatarFallback className="h-20 w-20">
                        {item.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-3 w-60">
                      <h4 className="text-sm font-semibold">{item.name}</h4>
                      <p className="text-xs line-clamp-3">
                        <span>
                          {item?.class && item?.race
                            ? `${item.class} - ${item.race}`
                            : item?.description
                            ? item.description
                            : ''}
                        </span>
                      </p>
                      <div className="flex items-center pt-2">
                        <span className="text-xs text-muted-foreground flex gap-4 items-center">
                          {item?.url && (
                            <Link to={item.url}>Character Sheet</Link>
                          )}
                          {item?.type && (
                            <>
                              {getLocationTypeData(item.type).icon}{' '}
                              {getLocationTypeData(item.type).name}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
