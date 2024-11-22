import { zodResolver } from '@hookform/resolvers/zod';
import { DialogPortal } from '@radix-ui/react-dialog';
import { useFetcher } from '@remix-run/react';
import { CircleOff } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ImageChooser } from '~/components/image-chooser';
import { Button } from '~/components/ui/button';
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
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
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
import { randomizeNPC } from '~/lib/utils';
import { classOptions, genderOptions, raceOptions } from '~/models/global';
// import { TCampaign } from '~/types/campaigns';
// import { TImage } from '~/types/images';

type TNewNpc = {
  children: React.ReactNode;
};

export const NewNpc: React.FC<TNewNpc> = ({ children }) => {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const [selectedImageId, setSelectedImageId] = useState('0');
  // const [chooseImage, setChooseImage] = useState(false);
  // const [imageFilters, setImageFilters] = useState<string[]>(['npc']);`

  const appContext = useContext(AppContext);
  const selectedCampaignId = appContext?.selectedCampaignId;
  const images = appContext?.images;
  // const campaigns = appContext?.campaigns;

  const fetcher = useFetcher();

  const formSchema = z.object({
    name: z.string().optional(),
    gender: z.string().optional(),
    race: z.string().optional(),
    class: z.string().optional(),
    description: z.string().optional(),
    story: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      gender: '',
      race: '',
      class: '',
      description: '',
      story: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSubmitted(true);
    console.log('Submitting...');
    fetcher.submit(
      {
        data: JSON.stringify({
          ...values,
          ...(selectedImageId && {
            main_image: selectedImageId,
          }),
          campaigns: [
            {
              campaigns_id: selectedCampaignId,
            },
          ],
        }),
      },
      {
        method: 'POST',
        action: '/new-npc?index',
      }
    );
  };

  const onRandomize = () => {
    const randomNpc = randomizeNPC();
    form.setValue('name', randomNpc.name);
    form.setValue('gender', randomNpc.gender);
    form.setValue('class', randomNpc.class);
    form.setValue('race', randomNpc.race);
    form.setValue('description', randomNpc.description);
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && submitted) {
      setSubmitted(false);
      setOpen(false);
    }
  }, [fetcher.state, fetcher.data, submitted]);

  // const selectedImage = images.find((image) => image.id === selectedImageId);

  // const onFormChange = () => {
  //   const selectedGender = form.getValues('gender');
  //   const selectedRace = form.getValues('race');
  //   // update filters if values are not empty
  //   setImageFilters(
  //     [selectedGender ?? '', selectedRace ?? '', 'npc'].filter(Boolean)
  //   );
  // };

  // const filteredImages = images?.filter((image) => {
  //   return imageFilters.every((filter) => {
  //     return image.tags?.includes(filter);
  //   });
  // });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogPortal>
          <DialogContent className="max-w-xl">
            <Form {...form}>
              <form
                // onChange={onFormChange}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <DialogHeader>
                  <DialogTitle>New NPC</DialogTitle>
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
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a gender..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genderOptions.map((option) => (
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
                  <div className="grid grid-cols-2 gap-x-3">
                    <FormField
                      control={form.control}
                      name="race"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Race</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a race..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {raceOptions.map((option) => (
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
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a class..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classOptions.map((option) => (
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

                  {/* <ScrollArea className="w-auto whitespace-nowrap rounded-md border h-40">
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
                  </ScrollArea> */}

                  <ImageChooser
                    images={images ?? []}
                    selectedImageId={selectedImageId}
                    setSelectedImageId={setSelectedImageId}
                  />

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
                  <FormField
                    control={form.control}
                    name="story"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Story..." />
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
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onRandomize()}
                    >
                      Randomize
                    </Button>
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
