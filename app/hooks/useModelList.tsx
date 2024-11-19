import { useCallback, useMemo, useState } from 'react';

export type TRelationship = Record<string, boolean>;

export type TUseModelList<T, M> = {
  relations: T[];
  relationsKey: keyof T;
  data: M extends { id: number; campaigns: { campaigns_id: number }[] }
    ? M[]
    : never;
  selectedCampaignId: number;
};

export function useModelList<T, M>({
  relations,
  relationsKey,
  data,
  selectedCampaignId,
}: TUseModelList<T, M>) {
  const dataInCampaign = useMemo(
    () =>
      data?.filter((item) =>
        item.campaigns.some(
          (campaign) => campaign.campaigns_id === selectedCampaignId
        )
      ),
    [data, selectedCampaignId]
  );

  const getInitialRowSelection = useCallback(() => {
    const selection: { [key: number]: boolean } = {};
    dataInCampaign?.forEach((item, index) => {
      if (relations.some((n) => n[relationsKey] === item.id)) {
        selection[index] = true;
      }
    });
    return selection;
  }, [dataInCampaign, relations, relationsKey]);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
    getInitialRowSelection()
  );

  const getSelectedNpcRelations = (RowSelection: Record<string, boolean>) =>
    dataInCampaign
      ?.filter((item, index) =>
        Object.keys(RowSelection).includes(String(index))
      )
      .map((item) => ({ [relationsKey]: item.id }));

  return {
    rowSelection,
    setRowSelection,
    dataInCampaign,
    getSelectedNpcRelations,
  };
}
