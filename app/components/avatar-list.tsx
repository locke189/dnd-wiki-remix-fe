import { Link } from '@remix-run/react';
import { TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export type TAvatarListProps<T> = {
  data?: T[];
  routePrefix: string;
};

export const AvatarList = <
  T extends { id: number; name: string; main_image: string }
>({
  data,
  routePrefix,
}: TAvatarListProps<T>) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">NPCs</h2>
      <ul className="flex flex-row gap-2 flex-wrap">
        {data?.map((item) => (
          <li key={item.id}>
            <Link to={`${routePrefix}${item.id}`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar>
                      <AvatarImage src={item.main_image} />
                      <AvatarFallback>
                        {item.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
