import { Box, Text } from "@0xsequence/design-system";

interface NftsMintedProgressBarProps {
  mintedNftsPercentaje: number;
  mintedNftPercentaje: number;
  tokenId: string | number;
  mintedNft: number;
  mintedNfts: number;
  totalSupply: number;
}

const nftProgressColor = "rgb(0, 123, 255)";
const otherNftsProgressColor = "#B8B8B8";

const NftsMintedProgressBar = ({
  mintedNftsPercentaje,
  mintedNftPercentaje,
  tokenId,
  mintedNft,
  mintedNfts,
  totalSupply,
}: NftsMintedProgressBarProps) => {
  const otherNftsMintedValue = mintedNfts - mintedNft;
  return (
    <Box display="flex" flexDirection="column">
      <Text variant="normal" fontWeight="bold">
        NFTs minted details:
      </Text>
      <Box marginBottom="4">
        <Text
          variant="normal"
          fontWeight="bold"
          style={{ color: nftProgressColor }}
        >
          {`NFT #${tokenId} (${mintedNft})`}
        </Text>
        <Text variant="normal" fontWeight="bold">
          {` | `}
        </Text>
        <Text
          variant="normal"
          fontWeight="bold"
          style={{ color: otherNftsProgressColor }}
        >
          {`Other NFTs (${otherNftsMintedValue})`}
        </Text>
        <Text variant="normal" fontWeight="bold">
          {` | `}
        </Text>
        <Text variant="normal" fontWeight="bold">
          {`Limit supply (${totalSupply})`}
        </Text>
      </Box>
      <Box
        borderRadius="lg"
        overflow="hidden"
        height="5"
        position="relative"
        style={{ width: "25rem", backgroundColor: "#e0e0e0", border: "none" }}
      >
        <Box
          position="absolute"
          left="0"
          height="full"
          borderRightRadius="lg"
          style={{
            width: `${mintedNftsPercentaje}%`,
            backgroundColor: otherNftsProgressColor,
            transition: "width 0.5s ease-in-out",
          }}
        ></Box>
        <Box
          position="absolute"
          height="full"
          borderRightRadius="lg"
          left="0"
          style={{
            width: `${mintedNftPercentaje}%`,
            backgroundColor: nftProgressColor,
            transition: "width 0.5s ease-in-out",
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default NftsMintedProgressBar;
