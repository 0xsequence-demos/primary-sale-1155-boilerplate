import { useAccount } from "wagmi";

import { useTokenMetadata, useCollectionBalance } from "../../hooks/data";
import { ContractInfo, TokenMetadata } from "@0xsequence/indexer";
import { Collectible } from "../collectable/Collectable";
import { UnpackedSaleConfigurationProps } from "~/helpers";
import { CollectableSkeleton } from "~/components/collectable/CollectableSkeleton";

interface ItemsForSaleProps {
  collectionAddress: string;
  chainId: number;
  totalMinted: string | undefined;
  totalSupply: string | 0;
  totalMintedNftsPercentage: number;
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
  totalMintedNftsPercentage,
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

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {isLoading ? (
        <>
          <CollectableSkeleton />
          <CollectableSkeleton />
          <CollectableSkeleton />
        </>
      ) : (
        <>
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
                totalMintedNftsPercentage={totalMintedNftsPercentage}
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
        </>
      )}
    </div>
  );
};
