import { Box, Text, TokenImage, Skeleton } from "@0xsequence/design-system";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

import {
  SALES_CONTRACT_ADDRESS_AMOY,
  CHAIN_ID_AMOY,
  CHAIN_ID_ARBITRUM_SEPOLIA,
  SALES_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA,
} from "../../constants";
import { SALES_CONTRACT_ABI } from "../../constants/abi";

interface CollectibleCardContentProps {
  tokenId: string;
  amountOwned: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

interface TokenSaleDetailsData {
  cost: bigint;
}

export const CollectibleCardContent = ({
  tokenId,
  amountOwned,
  logoURI,
  name,
  decimals,
  chainId,
}: CollectibleCardContentProps) => {
  const {
    data: tokenSaleDetailsData,
    isLoading: tokenSaleDetailsDataIsLoading,
  } = useReadContract({
    abi: SALES_CONTRACT_ABI,
    functionName: "tokenSaleDetails",
    chainId:
      chainId === CHAIN_ID_AMOY ? CHAIN_ID_AMOY : CHAIN_ID_ARBITRUM_SEPOLIA,
    address:
      chainId === CHAIN_ID_AMOY
        ? SALES_CONTRACT_ADDRESS_AMOY
        : SALES_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA,
    args: [BigInt(tokenId)],
  });

  const price = (tokenSaleDetailsData as TokenSaleDetailsData)?.cost || 0n;

  const priceFormatted = formatUnits(BigInt(price), decimals);

  return (
    <>
      <Text variant="small" color="text100">
        {`Token Id: ${tokenId}`}
      </Text>
      <Text variant="small" color="text100">
        {`Amount Owned: ${amountOwned}`}
      </Text>
      <Box flexDirection="row" gap="1" alignItems="center">
        <Text variant="small" color="text100">
          {`Price: ${tokenSaleDetailsDataIsLoading ? "" : priceFormatted}`}
        </Text>
        {tokenSaleDetailsDataIsLoading && (
          <Skeleton style={{ width: 20, height: 16 }} />
        )}
        <TokenImage size="xs" src={logoURI} />
      </Box>
      <Text color="text100">{name}</Text>
    </>
  );
};