import { useAccount } from "wagmi";

import { useTokenMetadata, useCollectionBalance } from "../../hooks/data";
import { ContractInfo, TokenMetadata } from "@0xsequence/indexer";
import { Collectible } from "../collectable/Collectable";
import { UnpackedSaleConfigurationProps } from "~/helpers";
import { CollectableSkeleton } from "~/components/collectable-skeleton/CollectableSkeleton";

interface ItemsForSaleProps {
  collectionAddress: string;
  chainId: number;
  totalMinted: string | undefined;
  totalSupply: string | 0;
  totalMintedNftsPercentaje: number;
  userPaymentCurrencyBalance: bigint | undefined;
  price: bigint;
  currencyDecimals: number | undefined;
  currencyData: ContractInfo | undefined;
  currencyIsLoading: boolean;
  saleConfiguration: UnpackedSaleConfigurationProps;
  refetchTotalMinted: () => void;
}

export const ItemsForSale = ({
  collectionAddress,
  chainId,
  totalMinted,
  totalSupply,
  totalMintedNftsPercentaje,
  userPaymentCurrencyBalance,
  price,
  currencyDecimals,
  currencyData,
  currencyIsLoading,
  saleConfiguration,
  refetchTotalMinted,
}: ItemsForSaleProps) => {
  const { address: userAddress } = useAccount();
  const {
    data: collectionBalanceData,
    isLoading: collectionBalanceIsLoading,
    refetch: refetchCollectionBalance,
  } = useCollectionBalance({
    accountAddress: userAddress || "",
    contractAddress: collectionAddress,
    chainId,
    includeMetadata: false,
    verifiedOnly: false,
  });
  const { data: tokenMetadatas, isLoading: tokenMetadatasLoading } =
    useTokenMetadata(
      chainId,
      collectionAddress,
      saleConfiguration.itemsForSale.map((item) => item.tokenId),
    );

  const isLoading =
    tokenMetadatasLoading || collectionBalanceIsLoading || currencyIsLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <CollectableSkeleton />
        <CollectableSkeleton />
        <CollectableSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {tokenMetadatas?.map((tokenMetadata: TokenMetadata) => {
        const collectibleBalance = collectionBalanceData?.find(
          (balance) => balance?.tokenID === tokenMetadata.tokenId,
        );

        return (
          <Collectible
            key={collectionAddress + tokenMetadata.tokenId}
            collectibleBalance={collectibleBalance}
            tokenMetadata={tokenMetadata}
            chainId={chainId}
            currencyData={currencyData}
            totalMintedNftsPercentaje={totalMintedNftsPercentaje}
            totalSupply={totalSupply}
            totalNftsMinted={totalMinted}
            userPaymentCurrencyBalance={userPaymentCurrencyBalance}
            price={price}
            currencyDecimals={currencyDecimals}
            saleConfiguration={saleConfiguration}
            refetchCollectionBalance={refetchCollectionBalance}
            refetchTotalMinted={refetchTotalMinted}
          />
        );
      })}
    </div>
  );
};
