import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { getChain } from "../../config/ERC20/getChain";
import { Button } from "@0xsequence-demos/boilerplate-design-system";
import { useERC1155SaleContractCheckout } from "@0xsequence/checkout";
import { useSalesCurrency } from "../../contexts/SalesCurrencyContext";
import { useSalesConfig } from "../../contexts/SalesConfigContext";
import { useUserPaymentCurrencyBalance } from "../../hooks/useUserPaymentCurrencyBalance";

interface BuyWithCryptoCardButtonProps {
  tokenId: string;
  amount: number;
  resetAmount: () => void;
  setTxExplorerUrl: (url: string) => void;
  price: bigint;
  onPurchaseSuccess: () => void;
}

export const BuyWithCryptoCardButton = ({
  tokenId,
  amount,
  resetAmount,
  setTxExplorerUrl,
  price,
  onPurchaseSuccess,
}: BuyWithCryptoCardButtonProps) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const {
    address: userAddress,
    // chainId: chainIdUser
  } = useAccount();
  const saleConfig = useSalesConfig();
  const { openCheckoutModal } = useERC1155SaleContractCheckout({
    chain: saleConfig.chainId,
    contractAddress: saleConfig.salesContractAddress,
    wallet: userAddress!,
    collectionAddress: saleConfig.nftTokenAddress,
    items: [
      {
        tokenId: String(tokenId),
        quantity: String(amount),
      },
    ],
    onSuccess: (txnHash: string) => {
      const chainInfoResponse = getChain(saleConfig.chainId);
      if (chainInfoResponse)
        setTxExplorerUrl(
          `${chainInfoResponse?.blockExplorer?.rootUrl}tx/${txnHash}`,
        );
      resetAmount();
      console.log("success!", txnHash);
      onPurchaseSuccess();
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const nftPriceBigInt = price ? price : BigInt(0);
  const amountBigInt = BigInt(amount);
  const totalPrice = nftPriceBigInt * amountBigInt;
  const { info: currencyInfo } = useSalesCurrency();

  const userPaymentCurrencyBalance = useUserPaymentCurrencyBalance({
    address: userAddress,
  });

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
    <Button
      variant="primary"
      data-nsf={hasNsf}
      className="rounded-[0.5rem] w-full font-bold text-14 data-[nsf=true]:opacity-50"
      onClick={onClickBuy}
    >
      {hasNsf ? "Insufficient funds" : "Buy"}
    </Button>
  );
};
