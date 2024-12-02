import { PlusIcon } from 'lucide-react';
import { marked } from 'marked';
import React from 'react';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

export type TContentTodo = {
  title: string;
  content: string;
  used: boolean;
};

export type TContentTodoList = {
  data: TContentTodo[];
  setData: React.Dispatch<React.SetStateAction<TContentTodo[]>>;
  isEditing?: boolean;
  title?: string;
};

export const ContentTodoList: React.FC<TContentTodoList> = ({
  data,
  setData,
  isEditing = false,
  title,
}) => {
  return (
    <div className="pt-4">
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        {isEditing && (
          <Button
            onClick={() =>
              setData([{ title: '', content: '', used: false }, ...data])
            }
          >
            <PlusIcon size={12} />
          </Button>
        )}
      </header>
      <ul className="mt-4 flex flex-col gap-4">
        {data.map((item, index) => (
          <li key={index}>
            {isEditing ? (
              <div>
                <div className="flex justify-between items-center gap-4">
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const newData = [...data];
                      newData[index].title = e.target.value;
                      setData(newData);
                    }}
                  />
                  <div className="flex gap-4 items-center">
                    <Checkbox
                      id={index.toString() + 'used'}
                      checked={item.used}
                      onCheckedChange={(e) => {
                        const newData = [...data];
                        newData[index].used = !!e;
                        setData(newData);
                      }}
                    />
                    <Label>Used</Label>
                  </div>
                  <Button
                    variant={'destructive'}
                    onClick={() => setData(data.filter((_, i) => i !== index))}
                  >
                    Delete
                  </Button>
                </div>
                <Textarea
                  value={item.content}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[index].content = e.target.value;
                    setData(newData);
                  }}
                  className="h-80 my-4"
                />
              </div>
            ) : (
              <div>
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <div>
                        {item.used ? (
                          <span title="Secret Revealed">✅</span>
                        ) : (
                          <span title="Secret Untold">❌</span>
                        )}{' '}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div
                      className="markdown"
                      dangerouslySetInnerHTML={{
                        __html: item?.content
                          ? marked?.parse(item?.content)
                          : `<p>...</p>`,
                      }}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
