import { ScrollArea } from '@radix-ui/react-scroll-area';
import { CircleOff } from 'lucide-react';
import { useState } from 'react';
import { TImage } from '~/types/images';
import { ScrollBar } from './ui/scroll-area';

export type TImageChooser = {
  images: TImage[];
};

export const ImageChooser: React.FC<TImageChooser> = ({ images }) => {
  const [chooseImage, setChooseImage] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState('0');

  const selectedImage = images.find((image) => image.id === selectedImageId);

  return (
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
          {images?.map((image) => (
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
  );
};
