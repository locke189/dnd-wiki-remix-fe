import { useFetcher } from '@remix-run/react';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '~/context/app.context';
import { debounce } from '~/lib/utils';

export const useSave = () => {
  const fetcher = useFetcher();
  const [submitted, setSubmitted] = useState(false);

  const appContext = useContext(AppContext);
  const { selectedCampaignId } = appContext || {};

  const onSave = (data: { [key: string]: unknown }, action?: string) => {
    if (submitted) return;
    setSubmitted(true);

    console.log('submitting', data);

    fetcher.submit(
      {
        campaignId: selectedCampaignId,
        data: JSON.stringify({
          ...data,
        }),
      },
      {
        method: 'POST',
        ...(action ? { action: action } : {}),
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  const onSaveDebounced = debounce(onSave, 500);

  return {
    onSave,
    onSaveDebounced,
  };
};
