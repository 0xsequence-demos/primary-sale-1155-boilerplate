import { BuyWithCryptoCardButton } from "../buy-with-crypto-card-button/BuyWithCryptoCardButton";
import { useState } from "react";
import { TokenMetadata } from "@0xsequence/metadata";
import { formatPriceWithDecimals } from "../../helpers";

import { Form, Svg, Image } from "@0xsequence-demos/boilerplate-design-system";
import { useSalesCurrency } from "../../contexts/SalesCurrencyContext";

interface CollectibleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collectibleBalance: { [key: string]: any } | undefined;
  tokenMetadata: TokenMetadata;
  price: bigint;
  onPurchaseSuccess: () => void;
}

export const Collectible = ({
  collectibleBalance,
  tokenMetadata,
  price,
  onPurchaseSuccess,
}: CollectibleProps) => {
  const [amount, setAmount] = useState(0);
  const [txExplorerUrl, setTxExplorerUrl] = useState("");
  const { info: currencyInfo } = useSalesCurrency();
  const logoURI = currencyInfo?.logoURI;

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

  const formattedPrice =
    currencyInfo !== undefined
      ? formatPriceWithDecimals(price, currencyInfo.decimals)
      : 0;

  return (
    <div className="bg-grey-900 p-4 text-left rounded-[1rem] flex flex-col gap-3">
      {tokenMetadata?.image ? (
        <Image
          className=" w-full max-w-[28rem] mx-auto aspect-square rounded-[0.5rem]"
          src={tokenMetadata?.image}
        />
      ) : (
        <div className=" w-full max-w-[28rem] mx-auto aspect-square rounded-[0.5rem] bg-grey-800"></div>
      )}

      <span className="text-10 font-bold">
        Token id: {tokenMetadata?.tokenId || ""}
      </span>
      <span className="text-20 font-bold leading-tight">
        {tokenMetadata?.name || ""}
      </span>

      <div className="mt-auto mb-0 flex flex-col gap-4 pt-4">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-12 font-medium text-grey-50 ">Price</span>
            <span className="text-14 font-bold inline-flex items-center gap-1">
              {!logoURI ? (
                <span className="size-4 bg-grey-800"></span>
              ) : (
                <Image src={logoURI} style={{ width: 20, height: 20 }} />
              )}
              {formattedPrice}
            </span>
          </div>
          <div className="flex flex-col items-end text-end">
            <span className="text-grey-50 font-medium text-12">Owned</span>
            <span className="text-white font-bold text-14">{amountOwned}</span>
          </div>
        </div>

        <Form className="flex flex-col gap-3">
          <div className="flex items-center border border-grey-600 rounded-[0.5rem]">
            <button
              type="button"
              onClick={decreaseAmount}
              className="size-12 flex items-center justify-center"
            >
              <Svg
                name="Subtract"
                className="text-white size-4"
                alt="Decrease quantity"
              />
            </button>
            <span className="flex-1 text-center">{amount}</span>
            <button
              type="button"
              onClick={increaseAmount}
              className="size-12 flex items-center justify-center"
            >
              <Svg
                name="Add"
                className="text-white size-4"
                alt="Increase quantity"
              />
            </button>
          </div>

          <BuyWithCryptoCardButton
            amount={amount}
            tokenId={tokenMetadata.tokenId}
            resetAmount={resetAmount}
            setTxExplorerUrl={setTxExplorerUrl}
            price={price}
            onPurchaseSuccess={onPurchaseSuccess}
          />
        </Form>
        {txExplorerUrl && (
          <a
            href={txExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-12 text-grey-50 inline-flex items-center gap-1"
          >
            <Svg name="ExternalLink" className="size-4" />
            <span className="underline">View latest transaction</span>
          </a>
        )}
      </div>
    </div>
  );
};
