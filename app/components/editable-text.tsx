import { FieldValues } from 'react-hook-form';
import { Textarea } from './ui/textarea';
import { marked } from 'marked';
import { Collapsible, CollapsibleTrigger } from './ui/collapsible';
import { CollapsibleContent } from './ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Separator } from './ui/separator';

export const EditableText: React.FC<{
  fieldName: string;
  field?: FieldValues;
  edit?: boolean;
  defaultOpen?: boolean;
}> = ({ fieldName, field, edit = false, defaultOpen = false }) => {
  const [isOpened, setIsOpened] = useState(defaultOpen);
  return (
    <article className="container mx-auto">
      <Collapsible defaultOpen={defaultOpen} open={isOpened}>
        <CollapsibleTrigger
          onClick={() => setIsOpened(!isOpened)}
          className="w-full"
        >
          <>
            <h2 className="text-xl font-bold my-4 w-full">
              <span className="flex gap-4">
                {!isOpened ? <ChevronDown /> : <ChevronRight />}
                {fieldName}
                {`${!field?.value ? ' - (Empty)' : ''}`}
              </span>
            </h2>
            <Separator />
          </>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-8">
          {edit ? (
            <>
              <Textarea {...field} className="h-80 my-4" />
            </>
          ) : (
            <>
              <div
                className="markdown"
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
