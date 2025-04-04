import { Image } from "boilerplate-design-system";
import { MintedProgressBar } from "../minted-progress-bar/MintedProgressBar";

type Collection = {
  name?: string;
  image?: string;
  description?: string;
};

type nftSalesDetails = {
  percentage: number;
  value: number;
  total: number;
};

type PrimarySaleProps = {
  collection: Collection;
  nftSalesData: nftSalesDetails;
};

export function PrimarySale({ collection, nftSalesData }: PrimarySaleProps) {
  return (
    <div className="flex gap-4 w-full sm:flex-row flex-col text-left">
      {collection.image ? (
        <Image
          src={collection.image}
          alt={collection.name}
          className="sm:w-[8rem] w-full max-w-[28rem] mx-auto aspect-square rounded-[0.5rem]"
        />
      ) : null}
      <div className="flex flex-col items-start w-full">
        <div className="flex items-start flex-col flex-1 gap-2">
          <h3 className="text-20 font-bold leading-tight">{collection.name}</h3>
          {collection.description ? (
            <p className="text-14">{collection.description}</p>
          ) : null}
        </div>
        <div className="mt-auto mb-0 w-full pt-4">
          <MintedProgressBar
            mintedPercentage={nftSalesData.percentage}
            mintedValue={nftSalesData.value}
            supplyValue={nftSalesData.total}
            showTotalMintedPercentage
          />
        </div>
      </div>
    </div>
  );
}
