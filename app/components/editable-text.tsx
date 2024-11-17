import { FieldValues } from 'react-hook-form';
import { Textarea } from './ui/textarea';
import { marked } from 'marked';
import { Collapsible, CollapsibleTrigger } from './ui/collapsible';
import { CollapsibleContent } from './ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export const EditableText: React.FC<{
  fieldName: string;
  field?: FieldValues;
  edit?: boolean;
  defaultOpen?: boolean;
}> = ({ fieldName, field, edit = false, defaultOpen = false }) => {
  const [isOpened, setIsOpened] = useState(defaultOpen);
  return (
    <article className="container mx-auto">
      <Collapsible
        defaultOpen={defaultOpen}
        open={isOpened}
        onClick={() => setIsOpened(!isOpened)}
      >
        <CollapsibleTrigger>
          <h2 className="text-xl font-bold my-4">
            <span className="flex gap-4">
              {!isOpened ? <ChevronDown /> : <ChevronRight />}
              {fieldName}
              {`${!field?.value ? ' - (Empty)' : ''}`}
            </span>
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {edit ? (
            <>
              <Textarea {...field} className="h-80 my-4" />
            </>
          ) : (
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: field?.value ? marked?.parse(field?.value) : '',
                }}
              />
            </>
          )}
        </CollapsibleContent>
      </Collapsible>
    </article>
  );
};
