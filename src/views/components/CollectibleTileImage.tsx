import { Image } from "@0xsequence/design-system";

interface CollectibleTileImageProps {
  imageUrl?: string;
}

const CollectibleTileImage = ({ imageUrl }: CollectibleTileImageProps) => {
  return (
    <Image className="aspect-square w-full rounded-[0.5rem]" src={imageUrl} />
  );
};

export default CollectibleTileImage;
