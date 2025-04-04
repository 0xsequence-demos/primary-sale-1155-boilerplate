import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { getChain } from "../../config/ERC20/getChain";
import { useMemo } from "react";
import { getSaleConfiguration } from "../../helpers";
import { ContractInfo } from "@0xsequence/metadata";
import { Button } from "boilerplate-design-system";
import { useERC1155SaleContractCheckout } from "@0xsequence/checkout";

interface BuyWithCryptoCardButtonProps {
  tokenId: string;
  collectionAddress: string;
  chainId: number;
  amount: number;
  resetAmount: () => void;
  setTxExplorerUrl: (url: string) => void;
  userPaymentCurrencyBalance: bigint | undefined;
  price: bigint;
  currencyInfo: ContractInfo | undefined;
  refetchCollectionBalance: () => void;
  refetchTotalMinted: () => void;
}

export const BuyWithCryptoCardButton = ({
  tokenId,
  // collectionAddress,
  chainId,
  amount,
  resetAmount,
  setTxExplorerUrl,
  userPaymentCurrencyBalance,
  price,
  currencyInfo,
  refetchCollectionBalance,
  refetchTotalMinted,
}: BuyWithCryptoCardButtonProps) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const {
    address: userAddress,
    // chainId: chainIdUser
  } = useAccount();
  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId],
  );
  const { openCheckoutModal } = useERC1155SaleContractCheckout({
    chain: saleConfiguration.chainId,
    contractAddress: saleConfiguration.salesContractAddress,
    wallet: userAddress!,
    collectionAddress: saleConfiguration.nftTokenAddress,
    items: [
      {
        tokenId: String(tokenId),
        quantity: String(amount),
      },
    ],
    onSuccess: (txnHash: string) => {
      const chainInfoResponse = getChain(chainId);
      if (chainInfoResponse)
        setTxExplorerUrl(
          `${chainInfoResponse?.blockExplorer?.rootUrl}tx/${txnHash}`,
        );
      resetAmount();
      refetchCollectionBalance();
      refetchTotalMinted();
      console.log("success!", txnHash);
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const nftPriceBigInt = price ? price : BigInt(0);
  const amountBigInt = BigInt(amount);
  const totalPrice = nftPriceBigInt * amountBigInt;

  const onClickBuy = () => {
    if (
      !publicClient ||
      !walletClient ||
      !userAddress ||
      !currencyInfo ||
      amount <= 0 ||
      !userPaymentCurrencyBalance?.toString() ||
      userPaymentCurrencyBalance < totalPrice
    ) {
      return;
    }
    openCheckoutModal();
  };

  const hasNsf =
    userPaymentCurrencyBalance?.toString() &&
    (userPaymentCurrencyBalance?.toString() === "0" ||
      userPaymentCurrencyBalance < totalPrice);

  return (
    <>
      <Button
        variant="primary"
        data-nsf={hasNsf}
        className="rounded-[0.5rem] w-full font-bold text-14 data-[nsf=true]:opacity-50"
        onClick={onClickBuy}
      >
        {hasNsf ? "Insufficient funds" : "Buy"}
      </Button>
    </>
  );
};
