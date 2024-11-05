import { Link } from '@remix-run/react';

export type TImageListProps = {
  title?: string;
  data?: {
    id: string;
    imageUrl: string;
    name: string;
    url: string;
  }[];
};

export const ImageList: React.FC<TImageListProps> = ({ title, data }) => {
  return (
    <section className="container mx-auto">
      <h1 className="my-8 text-2xl font-bold">{title}</h1>
      <div className="flex gap-7">
        {data?.map(({ id, imageUrl, name, url }) => (
          <Link key={id} to={`${url}`}>
            <div>
              {imageUrl && (
                <img
                  className="object-cover h-40 x-40 radius-lg"
                  src={imageUrl}
                  alt={name}
                />
              )}
              <h2 className="text-lg">{name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
