import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ChevronRight, CircleOff } from 'lucide-react';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { TImage } from '~/types/images';
import { ScrollBar } from './ui/scroll-area';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { z } from 'zod';
import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { Input } from './ui/input';
import { useFileUpload } from '~/hooks/useFileUpload';
import { FormLabel } from './ui/form';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { set } from 'date-fns';

export type TImageChooser = {
  images: TImage[];
  selectedImageId: string;
  setSelectedImageId: (id: string) => void;
  children?: React.ReactNode;
};

export const ImageChooser: React.FC<TImageChooser> = ({
  images,
  selectedImageId,
  setSelectedImageId,
}) => {
  const [chooseImage, setChooseImage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const fetcher = useFetcher({ key: 'image' });

  const selectedImage = images.find((image) => image.id === selectedImageId);

  // get tags from images, and remove duplicates
  const tags = images
    .map((image) => image.tags)
    .flat()
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .sort((a, b) => a?.localeCompare?.(b, undefined, { sensitivity: 'base' }));

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
      setSelectedImageId(fetcher.data?.image?.id);
      setChooseImage(false);
    }
  }, [fetcher.state, fetcher.data, submitted, setSelectedImageId]);

  const handleFileChange = () => {
    if (!file) return;

    setSubmitted(true);

    const fileData = new FormData();
    fileData.append(
      'tags',
      `["upload", ${uploadTags
        .split(',')
        .map((tag) => tag.trim())
        .map((tag) => `"${tag}"`)
        .join(', ')}]`
    );
    fileData.append('file', file[0]);
    fetcher.submit(fileData, {
      method: 'POST',
      encType: 'multipart/form-data',
      action: '/upload',
    });
  };

  const [file, setFile] = useState<FileList | null>(null);
  const [uploadTags, setUploadTags] = useState<string>('');

  // filter images based on tags
  const filteredImages = images.filter((image) =>
    filters.every((filter) => image?.tags?.includes(filter))
  );

  return (
    <>
      <Dialog
        open={chooseImage}
        onOpenChange={() => setChooseImage(!chooseImage)}
      >
        <DialogTrigger asChild>
          <div className="flex flex-wrap gap-3 p-4 justify-center">
            <div
              className="w-32 h-32 flex items-center justify-center border"
              role="button"
              tabIndex={0}
              onClick={() => setChooseImage(true)}
              onKeyDown={() => setChooseImage(true)}
            >
              {selectedImageId && (
                <img
                  src={selectedImage?.src}
                  alt={selectedImage?.id}
                  className="w-full h-full object-cover rounded-md"
                />
              )}
              {!selectedImageId && <CircleOff />}
            </div>
          </div>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New NPC</DialogTitle>
            </DialogHeader>
            <ScrollArea className="w-auto whitespace-nowrap rounded-md border h-80 overflow-auto">
              {chooseImage && (
                <div className="flex flex-wrap gap-3 p-4 justify-center">
                  <div
                    className="w-20 h-20 flex items-center justify-center border"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setChooseImage(false);
                      setSelectedImageId('0');
                    }}
                    onKeyDown={() => {
                      setChooseImage(false);
                      setSelectedImageId('0');
                    }}
                  >
                    <CircleOff />
                  </div>
                  {filteredImages?.map((image) => (
                    <div
                      key={image.id}
                      className="w-20 h-20"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setChooseImage(false);
                        setSelectedImageId(image.id);
                      }}
                      onKeyDown={() => {
                        setChooseImage(false);
                        setSelectedImageId(image.id);
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.id}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            <Collapsible>
              <CollapsibleTrigger>
                <div className="flex gap-2">
                  <ChevronRight />
                  Tags
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ScrollArea className="w-auto whitespace-nowrap rounded-md border h-40 overflow-auto p-2">
                  <div className="flex gap-3 flex-wrap">
                    {tags.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (filters.includes(tag)) {
                            setFilters(
                              filters.filter((filter) => filter !== tag)
                            );
                          } else {
                            setFilters([...filters, tag]);
                          }
                        }}
                        variant={
                          filters.includes(tag) ? 'default' : 'secondary'
                        }
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger>
                <div className="flex gap-2">
                  <ChevronRight />
                  Upload
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-4">
                  <Input
                    name="upload-tags"
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                  />
                  <div className="flex gap-3">
                    <Input
                      type="file"
                      name="my-file"
                      onChange={(e) => setFile(e.target.files)}
                    />
                    <Button type="button" onClick={handleFileChange}>
                      Upload
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};
