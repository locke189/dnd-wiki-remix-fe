import { TCampaignDate } from '~/types/campaigns';
import { Input } from './ui/input';
import { Label } from './ui/label';
import React, { ChangeEventHandler } from 'react';
import { getHarptosDate, getHarptosMonth } from '~/models/date';

export type TCustomDatePickerProps = {
  date: TCampaignDate;
  setDate: (date: TCampaignDate) => void;
  className?: string;
  // type: 'harptos';
};

export const CustomDatePicker: React.FC<TCustomDatePickerProps> = ({
  date,
  setDate,
  className,
}) => {
  const monthModel = getHarptosMonth(date.month);

  const setMonth: ChangeEventHandler<HTMLInputElement> = (e) => {
    const month = parseInt(e.target.value, 10);
    setDate({ ...date, month });
  };

  const setDay: ChangeEventHandler<HTMLInputElement> = (e) => {
    const day = parseInt(e.target.value, 10);
    setDate({ ...date, date: day });
  };

  const setYear: ChangeEventHandler<HTMLInputElement> = (e) => {
    const year = parseInt(e.target.value, 10);
    setDate({ ...date, year });
  };

  return (
    <div className={className}>
      <div className="flex gap-2 items-center">
        <Label>Month</Label>
        <Input
          type="number"
          value={date.month}
          min={1}
          max={12}
          onChange={setMonth}
        />
        <Label>Day</Label>
        <Input
          type="number"
          value={date.date}
          min={1}
          max={monthModel?.days}
          onChange={setDay}
        />
        <Label>Year</Label>
        <Input
          type="number"
          value={date.year}
          min={1578}
          max={1580}
          onChange={setYear}
        />
      </div>
      <p className="text-md">
        {getHarptosDate(date.month, date.date, date.year)}
      </p>
    </div>
  );
};
