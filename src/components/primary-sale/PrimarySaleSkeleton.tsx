import { MintedProgressBar } from "../minted-progress-bar/MintedProgressBar";

export function PrimarySaleSkeleton() {
  return (
    <div className="flex gap-4 w-full sm:flex-row flex-col text-left">
      <div className="sm:w-[8rem] w-full max-w-[28rem] mx-auto aspect-square rounded-[0.5rem] bg-grey-800 flex-shrink-0"></div>
      <div className="flex flex-col items-start w-full">
        <div className="flex items-start flex-col flex-1 gap-2">
          <h3 className="text-20 font-bold leading-tight">--</h3>
          <p className="text-14">--</p>
        </div>
        <div className="mt-auto mb-0 w-full pt-4">
          <MintedProgressBar
            mintedPercentage={0}
            mintedValue={Number(0)}
            supplyValue={Number(0)}
            showTotalMintedPercentage
          />
        </div>
      </div>
    </div>
  );
}
