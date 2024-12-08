import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';

export const useFavorite = () => {
  const fetcher = useFetcher();
  const [submitted, setSubmitted] = useState(false);

  const setFavorite = (isFavorite: boolean) => {
    if (submitted) return;
    setSubmitted(true);

    fetcher.submit(
      {
        data: JSON.stringify({
          favorite: isFavorite,
        }),
      },
      {
        method: 'POST',
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  return {
    setFavorite,
  };
};
