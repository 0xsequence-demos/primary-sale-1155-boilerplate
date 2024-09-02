import { Box, Text, Spinner } from "@0xsequence/design-system";
import { useAccount } from "wagmi";

import { useTokenMetadata, useCollectionBalance } from "../../hooks/data";
import { useSalesCurrency } from "../../hooks/useSalesCurrency";
import { itemsForSales } from "../../constants";
import { TokenMetadata } from "@0xsequence/indexer";
import { Collectible } from "./Collectible";

interface ItemsForSaleProps {
  collectionAddress: string;
  chainId: number;
}

export const ItemsForSale = ({
  collectionAddress,
  chainId,
}: ItemsForSaleProps) => {
  const { address: userAddress } = useAccount();
  const { data: collectionBalanceData, isLoading: collectionBalanceIsLoading } =
    useCollectionBalance({
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
      itemsForSales.map((item) => item.tokenId),
    );

  const { data: currencyData, isLoading: currencyIsLoading } =
    useSalesCurrency(chainId);

  const isLoading =
    tokenMetadatasLoading || collectionBalanceIsLoading || currencyIsLoading;

  if (isLoading) {
    return (
      <Box
        margin="2"
        color="text100"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="2"
      >
        <Text color="text100">Loading...</Text>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box width="full">
      <Box marginBottom="6">
        <Text variant="xlarge" fontWeight="bold">
          Available items
        </Text>
      </Box>
      <Box
        flexDirection={"row"}
        alignItems="center"
        flexWrap="wrap"
        gap="6"
        style={{
          maxWidth: "50rem",
        }}
      >
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
            />
          );
        })}
      </Box>
    </Box>
  );
};
