import { zodResolver } from '@hookform/resolvers/zod';
import { DialogPortal } from '@radix-ui/react-dialog';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { Check, ChevronsUpDown, CircleOff } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { AppContext } from '~/context/app.context';
import { getLocationOptions } from '~/lib/locations';
import { cn } from '~/lib/utils';
import { locationTypeOptions } from '~/models/global';
import { TCampaign } from '~/types/campaigns';
import { TImage } from '~/types/images';
import { TLocation } from '~/types/location';

type TNewLocationProps = {
  children: React.ReactNode;
};

export const NewLocation: React.FC<TNewLocationProps> = ({ children }) => {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const [selectedImageId, setSelectedImageId] = useState('0');
  const [chooseImage, setChooseImage] = useState(false);
  const [imageFilters, setImageFilters] = useState<string[]>([]);

  // TODO: move this to the context
  const data = useLoaderData();
  const images = data?.images as TImage[];
  const campaigns = data?.campaigns as TCampaign[];
  const locations = data?.locations as TLocation[];

  const appContext = useContext(AppContext);
  const selectedCampaignId = appContext?.selectedCampaignId;

  const fetcher = useFetcher();

  const formSchema = z.object({
    name: z.string().optional(),
    type: z.string().optional(),
    parent_location: z.number().optional(),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSubmitted(true);
    console.log('Submitting...');
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
          ...(Number(selectedImageId) && { image: Number(selectedImageId) }),
          campaigns: [
            {
              campaigns_id: selectedCampaignId,
            },
          ],
        }),
      },
      {
        method: 'POST',
        action: '/new-location?index',
      }
    );
  };

  const onRandomize = () => {
    // const randomNpc = randomizeNPC();
    // form.setValue('name', randomNpc.name);
    // form.setValue('gender', randomNpc.gender);
    // form.setValue('class', randomNpc.class);
    // form.setValue('race', randomNpc.race);
    // form.setValue('description', randomNpc.description);
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
      setOpen(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  const selectedImage = images.find((image) => image.id === selectedImageId);

  const onFormChange = () => {
    const selectedType = form.getValues('type');
    // update filters if values are not empty
    setImageFilters([selectedType ?? ''].filter(Boolean));
  };

  const filteredImages = images.filter((image) => {
    return imageFilters.every((filter) => {
      return image.tags?.includes(filter);
    });
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogPortal>
          <DialogContent className="max-w-xl">
            <Form {...form}>
              <form
                onChange={onFormChange}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <DialogHeader>
                  <DialogTitle>New Location</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 my-4">
                  <div className="grid grid-cols-2 gap-x-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Name" type="text" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a location type..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locationTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-x-3">
                    {/* <FormField
                      control={form.control}
                      name="parent_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a parent location..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getLocationOptions(locations).map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    /> */}
                    <FormField
                      control={form.control}
                      name="parent_location"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Parent Location</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    'w-full justify-between',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? getLocationOptions(locations).find(
                                        (location) =>
                                          location.value === field.value
                                      )?.label
                                    : 'Select location'}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[526px] p-0">
                              <Command>
                                <CommandInput placeholder="Search location..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No language found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {getLocationOptions(locations).map(
                                      (location) => (
                                        <CommandItem
                                          value={location.label}
                                          key={location.value}
                                          onSelect={() => {
                                            form.setValue(
                                              'parent_location',
                                              location.value
                                            );
                                          }}
                                        >
                                          {location.label}
                                          <Check
                                            className={cn(
                                              'ml-auto',
                                              location.value === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                        </CommandItem>
                                      )
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <ScrollArea className="w-auto whitespace-nowrap rounded-md border h-40">
                    {!chooseImage && (
                      <div className="flex flex-wrap gap-3 p-4 justify-center">
                        <div
                          className="w-32 h-32 flex items-center justify-center border"
                          role="button"
                          tabIndex={0}
                          onClick={() => setChooseImage(true)}
                          onKeyDown={() => setChooseImage(true)}
                        >
                          {selectedImage && (
                            <img
                              src={selectedImage.src}
                              alt={selectedImage.id}
                              className="w-full h-full object-cover rounded-md"
                            />
                          )}
                          {!selectedImage && <CircleOff />}
                        </div>
                      </div>
                    )}
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
                        {filteredImages.map((image) => (
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

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Description..." />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="sm:justify-between">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <div className="flex gap-3">
                    {/* <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onRandomize()}
                    >
                      Randomize
                    </Button> */}
                    <Button
                      type="button"
                      onClick={() => {
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};
