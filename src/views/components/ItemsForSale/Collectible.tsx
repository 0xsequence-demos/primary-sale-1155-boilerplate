import {
  Box,
  Card,
  Skeleton,
  Text,
  useMediaQuery,
} from "@0xsequence/design-system";
import CollectibleTileImage from "../CollectibleTileImage";
import { BuyWithCryptoCardButton } from "./BuyWithCreditCardButton";
import { getNftTokenAddress } from "../../../utils/primarySellHelpers";
import { useEffect, useState } from "react";
import { TokenMetadata } from "@0xsequence/indexer";
import { toast } from "react-toastify";
import { SendTransactionErrorType } from "viem";
import { nftPrice } from "../../constants";
import NftsMintedProgressBar from "../AlternativeProgressBar";
import { NFT_TOKEN_CONTRACT_ABI } from "../../constants/nft_token_contract_abi";
import { useReadContract } from "wagmi";

interface CollectibleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collectibleBalance: { [key: string]: any } | undefined;
  tokenMetadata: TokenMetadata;
  chainId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currencyData: { [key: string]: any } | undefined;
  nftsMintedPercentaje: number;
  totalSupply: string | 0;
  totalNftsMinted: string | undefined;
}

function calculateMintedPercentage(minted: number, totalMax: number): number {
  if (totalMax <= 0) {
    return 0;
  }

  const percentage = (minted / totalMax) * 100;
  return Math.floor(percentage);
}

export const Collectible = ({
  collectibleBalance,
  tokenMetadata,
  chainId,
  currencyData,
  nftsMintedPercentaje,
  totalSupply,
  totalNftsMinted,
}: CollectibleProps) => {
  const isMobile = useMediaQuery("isMobile");
  const [amount, setAmount] = useState(0);
  const [txExplorerUrl, setTxExplorerUrl] = useState("");
  const [txError, setTxError] = useState<SendTransactionErrorType | null>(null);
  const logoURI = currencyData?.logoURI;
  const {
    data: nftsMinted,
    // isLoading: nftsMintedIsLoading,
  } = useReadContract({
    abi: NFT_TOKEN_CONTRACT_ABI,
    functionName: "tokenSupply",
    chainId: chainId,
    address: getNftTokenAddress(chainId),
    args: [BigInt(tokenMetadata?.tokenId)],
  });

  const amountOwned: string = collectibleBalance?.balance || "0";
  const increaseAmount = () => {
    setAmount(amount + 1);
  };

  const decreaseAmount = () => {
    if (amount === 0) return;
    setAmount(amount - 1);
  };

  const resetAmount = () => {
    setAmount(0);
  };

  const mintedNftPercentaje = calculateMintedPercentage(
    Number(nftsMinted),
    Number(totalSupply),
  );

  useEffect(() => {
    if (!txError || JSON.stringify(txError) === "{}") return;
    toast(`Error to purchase NFT`, { type: "error" });
    console.error(txError);
  }, [txError]);

  return (
    <Box
      padding="1"
      width="full"
      flexDirection="column"
      style={{
        flexBasis: isMobile ? "100%" : "50%",
        width: "fit-content",
        maxWidth: "50rem",
      }}
    >
      <Card>
        <Box flexDirection="row" gap="6">
          <CollectibleTileImage imageUrl={tokenMetadata?.image || ""} />
          <Box display="flex" flexDirection="column" gap="6">
            <Text variant="large" fontWeight="bold" color="text100">
              {tokenMetadata?.name || ""}
            </Text>
            <Text
              variant="normal"
              fontWeight="bold"
              color="text100"
              style={{ textAlign: "left" }}
            >
              Token id: {tokenMetadata?.tokenId || ""}
            </Text>
            <NftsMintedProgressBar
              mintedNftsPercentaje={nftsMintedPercentaje}
              mintedNftPercentaje={mintedNftPercentaje}
              tokenId={tokenMetadata?.tokenId || ""}
              mintedNft={Number(nftsMinted)}
              mintedNfts={Number(totalNftsMinted)}
              totalSupply={Number(totalSupply)}
            />
            <Box display="flex" justifyContent="space-between" gap="4">
              <Box flexDirection="row" gap="2">
                <Text
                  variant="normal"
                  fontWeight="bold"
                  color="text100"
                  style={{ textAlign: "left" }}
                >
                  Price: {nftPrice}
                </Text>
                {!logoURI ? (
                  <Skeleton style={{ width: 20, height: 20 }} />
                ) : (
                  // <TokenImage
                  //   // src="https://metadata.sequence.app/projects/30957/collections/690/image.png"
                  //   withNetwork="amoy"
                  //   symbol="matic"
                  //   style={{ width: 20, height: 20 }}
                  // />
                  <></>
                )}
              </Box>
              <Text
                variant="normal"
                fontWeight="bold"
                color="text100"
                style={{ textAlign: "left" }}
              >
                Amount Owned: {amountOwned}
              </Text>
            </Box>
            <Box
              display="flex"
              padding="4"
              borderRadius="lg"
              gap="4"
              style={{ backgroundColor: "rgba(32, 32, 32, 1)", width: "25rem" }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap="8"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  width: "fit-content",
                  padding: "0.5rem 1rem",
                }}
                borderRadius="lg"
              >
                <Text
                  variant="large"
                  fontWeight="bold"
                  onClick={decreaseAmount}
                  style={{
                    cursor: "pointer",
                    color: "#ffffff",
                    fontWeight: 900,
                  }}
                >
                  -
                </Text>
                <Text
                  variant="large"
                  fontWeight="bold"
                  style={{ color: "#ffffff" }}
                >
                  {amount}
                </Text>
                <Text
                  variant="large"
                  fontWeight="bold"
                  onClick={increaseAmount}
                  style={{
                    cursor: "pointer",
                    color: "#ffffff",
                    fontWeight: 900,
                  }}
                >
                  +
                </Text>
              </Box>
              <BuyWithCryptoCardButton
                amount={amount}
                chainId={chainId}
                collectionAddress={getNftTokenAddress(chainId)}
                tokenId={tokenMetadata.tokenId}
                resetAmount={resetAmount}
                setTxExplorerUrl={setTxExplorerUrl}
                setTxError={setTxError}
              />
            </Box>
            {txError && JSON.stringify(txError) != "{}" && (
              <span>Error to purchase NFT. Details in console</span>
            )}
            {txExplorerUrl && (
              <Box display="flex" flexDirection="column" marginBottom="3">
                <Text variant="large" color="text100">
                  Purchase Completed Succesfully
                </Text>
                <a
                  href={txExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View transaction in explorer</span>
                  <br />
                </a>
              </Box>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
