interface NftsMintedProgressBarProps {
  mintedNftsPercentage: number;
  mintedNftCount: number;
  tokenId: string | number;
  totalMintedNftsPercentage: number;
  totalMintedNfts: number;
  totalSupply: number;
}
const NftsMintedProgressBar = ({
  mintedNftsPercentage,
  totalMintedNftsPercentage,
  // tokenId,
  mintedNftCount,
  // totalMintedNfts,
  totalSupply,
}: NftsMintedProgressBarProps) => {
  // const otherNftsMintedValue = totalMintedNfts - mintedNftCount;

  return (
    <div className="flex flex-col gap-1 ">
      <span className="text-12 font-medium">
        {mintedNftCount}/{totalSupply} Minted
      </span>

      <div className="w-full h-[12px] rounded-full overflow-hidden bg-grey-700 relative">
        <div
          className="absolute left-0 h-full rounded-full z-[100] bg-indigo-400"
          style={{
            width: `${mintedNftsPercentage}%`,
            transition: "width 0.5s ease-in-out",
          }}
        ></div>

        <div
          className="absolute left-0 h-full rounded-full z-[50] bg-grey-500"
          style={{
            width: `${totalMintedNftsPercentage}%`,
            transition: "width 0.5s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
};

export default NftsMintedProgressBar;
