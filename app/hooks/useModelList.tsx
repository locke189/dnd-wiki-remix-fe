import { useCallback, useMemo, useState } from 'react';

export type TRelationship = Record<string, boolean>;

export type TModel = {
  id: number;
  campaigns?: { campaigns_id: number }[];
  campaign?: number;
};

export type TUseModelList<T, M extends TModel> = {
  relations: T[];
  relationsKey: keyof T;
  data: M[];
  selectedCampaignId: number;
};

export function useModelList<T, M extends TModel>({
  relations,
  relationsKey,
  data,
  selectedCampaignId,
}: TUseModelList<T, M>) {
  const dataInCampaign = useMemo(
    () =>
      data?.filter(
        (item) =>
          item.campaigns?.some(
            (campaign) => campaign.campaigns_id === selectedCampaignId
          ) || item.campaign === selectedCampaignId
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

  const getSelectedRelations = (RowSelection: Record<string, boolean>) =>
    dataInCampaign
      ?.filter((item, index) =>
        Object.keys(RowSelection).includes(String(index))
      )
      .map((item) => ({ [relationsKey]: item.id }));

  return {
    rowSelection,
    setRowSelection,
    dataInCampaign,
    getSelectedRelations,
  };
}
