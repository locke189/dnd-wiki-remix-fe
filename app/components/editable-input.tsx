import { FieldValues } from 'react-hook-form';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { FormControl, FormLabel } from './ui/form';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';

type TEditableInputProps = {
  fieldName: string;
  field: FieldValues;
  edit: boolean;
  children: React.ReactNode;
  type: 'text' | 'date' | 'email' | 'password';
};

export const EditableInput: React.FC<TEditableInputProps> = ({
  fieldName,
  field,
  edit,
  children,
  type = 'text',
}) => {
  return edit ? (
    <>
      {type === 'date' && (
        <>
          <FormLabel>{fieldName}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </>
      )}
      {type === 'text' && (
        <>
          <Label>{fieldName}</Label>
          <Input {...field} />
        </>
      )}
    </>
  ) : (
    <>{children}</>
  );
};
