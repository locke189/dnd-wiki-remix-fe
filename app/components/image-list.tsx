import { Link } from '@remix-run/react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import React from 'react';

export type TImageListProps = {
  title?: string;
  className?: string;
  data?: {
    id: number;
    imageUrl: string;
    name: string;
    description?: string;
    url: string;
    action: React.ReactNode;
  }[];
};

export const ImageList: React.FC<TImageListProps> = ({
  title,
  data,
  className,
}) => {
  return (
    <section className={className}>
      {title && <h1 className="my-8 text-2xl font-bold">{title}</h1>}
      <div className="grid grid-cols-12 gap-x-12 gap-y-4">
        {data?.map(({ id, imageUrl, name, url, description, action }) => (
          <Link
            key={id}
            to={`${url}`}
            className="col-span-4 lg:col-span-3 sm:col-span-12"
          >
            <Card>
              <CardHeader
                className="rounded-xl bg-muted/50 h-[300px] flex flex-col justify-end"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.01), rgba(0, 0, 0, 0.8)), url('${imageUrl}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* {imageUrl && (
                <img
                className="object-cover h-60 w-full radius-lg object-top"
                src={imageUrl}
                alt={name}
                />
                )} */}
                <div className="flex justify-between">
                  <CardTitle className="text-gray-50">{name}</CardTitle>
                  {action && action}
                </div>
                <CardDescription className="text-gray-200">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
