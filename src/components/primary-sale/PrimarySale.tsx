import { Image } from "boilerplate-design-system";
import { MintedProgressBar } from "../minted-progress-bar/MintedProgressBar";
import { useContractInfo } from "../../hooks/data";
import { useSalesConfig } from "../../contexts/SalesConfigContext";
import { useSalesDetails } from "../../contexts/SalesDetailsContext";

export function PrimarySale() {
  const saleConfig = useSalesConfig();
  const { data: contractInfoData } = useContractInfo(
    saleConfig.chainId,
    saleConfig.nftTokenAddress,
  );

  const name = contractInfoData?.name;
  const image = contractInfoData?.logoURI;
  const description = contractInfoData?.extensions?.description;

  const nftSalesData = useSalesDetails();

  return (
    <div className="flex gap-4 w-full sm:flex-row flex-col text-left">
      {image ? (
        <Image
          src={image}
          alt={name}
          className="sm:w-[8rem] w-full max-w-[28rem] mx-auto aspect-square rounded-[0.5rem]"
        />
      ) : null}
      <div className="flex flex-col items-start w-full">
        <div className="flex items-start flex-col flex-1 gap-2">
          <h3 className="text-20 font-bold leading-tight">{name}</h3>
          {description ? <p className="text-14">{description}</p> : null}
        </div>
        <div className="mt-auto mb-0 w-full pt-4">
          <MintedProgressBar
            mintedPercentage={nftSalesData.percentage}
            mintedValue={nftSalesData.totalSupply}
            supplyValue={nftSalesData.supplyCap}
            showTotalMintedPercentage
          />
        </div>
      </div>
    </div>
  );
}
