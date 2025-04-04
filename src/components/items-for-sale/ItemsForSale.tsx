import { useAccount } from "wagmi";
import { useTokenMetadata, useCollectionBalance } from "../../hooks/data";
import { Collectible } from "../collectable/Collectable";
import { CollectableSkeleton } from "../collectable/CollectableSkeleton";
import { TokenMetadata } from "@0xsequence/metadata";
import { useSalesCurrency } from "../../contexts/SalesCurrencyContext";
import { useSalesConfig } from "../../contexts/SalesConfigContext";
import { useSalesDetails } from "../../contexts/SalesDetailsContext";

export const ItemsForSale = () => {
  const { address: userAddress } = useAccount();
  const nftSalesData = useSalesDetails();

  const price = nftSalesData?.cost || BigInt(0);

  const saleConfig = useSalesConfig();
  const {
    data: collectionBalanceData,
    isLoading: collectionBalanceIsLoading,
    refetch: refetchCollectionBalance,
  } = useCollectionBalance({
    accountAddress: userAddress || "",
    contractAddress: saleConfig.nftTokenAddress,
    chainId: saleConfig.chainId,
    includeMetadata: false,
    verifiedOnly: false,
  });
  const { data: tokenMetadatas, isLoading: tokenMetadatasLoading } =
    useTokenMetadata(
      saleConfig.chainId,
      saleConfig.nftTokenAddress,
      saleConfig.itemsForSale.map((item) => item.tokenId),
    );

  const { isLoading: isCurrencyInfoLoading } = useSalesCurrency();

  const isLoading =
    tokenMetadatasLoading ||
    collectionBalanceIsLoading ||
    isCurrencyInfoLoading;

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
                key={saleConfig.nftTokenAddress + tokenMetadata.tokenId}
                collectibleBalance={collectibleBalance}
                tokenMetadata={tokenMetadata}
                price={price}
                onPurchaseSuccess={() => {
                  refetchCollectionBalance();
                  nftSalesData.refetchTotalMinted();
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
