import { useQueryClient } from "@tanstack/react-query";
import { useCheckoutModal, CheckoutSettings } from "@0xsequence/kit-checkout";
import { Chain, encodeFunctionData, Hex, toHex } from "viem";
import { Box, Button, Text } from "@0xsequence/design-system";
import {
  usePublicClient,
  useWalletClient,
  useAccount,
  useReadContract,
  useSendTransaction,
  useSwitchChain,
} from "wagmi";
import { ERC20 } from "../../../ERC20/ERC20";

import { SALES_CONTRACT_ABI } from "../../constants/abi";
import { SALES_CONTRACT_ADDRESS, CHAIN_ID } from "../../constants";
import { useSalesCurrency } from "../../hooks/useSalesCurrency";
import { useEffect, useState } from "react";
import { getChain } from "../../../ERC20/getChain";
interface BuyWithCryptoCardButtonProps {
  tokenId: string;
  collectionAddress: string;
  chainId: number;
}

export const BuyWithCryptoCardButton = ({
  tokenId,
  collectionAddress,
  chainId,
}: BuyWithCryptoCardButtonProps) => {
  const queryClient = useQueryClient();
  const { triggerCheckout } = useCheckoutModal();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address: userAddress, chainId: chainIdUser } = useAccount();
  const [chainInfo, setChainInfo] = useState<{[key: string] : any}>({});
  const { 
    data: txnData,
    sendTransaction,
    isPending: isPendingSendTxn,
    error,
    reset,
  } = useSendTransaction();
  const { data: currencyData, isLoading: currencyIsLoading } =
    useSalesCurrency();
  // const { switchChainAsync } = useSwitchChain();

  interface TokenSaleDetailData {
    cost: bigint;
  }

  const {
    data: tokenSaleDetailsData,
    isLoading: tokenSaleDetailsDataIsLoading,
  } = useReadContract({
    abi: SALES_CONTRACT_ABI,
    functionName: "tokenSaleDetails",
    chainId: CHAIN_ID,
    address: SALES_CONTRACT_ADDRESS,
    args: [BigInt(tokenId)],
  });

  const currencyPrice = (
    (tokenSaleDetailsData as TokenSaleDetailData)?.cost || 0n
  ).toString();

  const onClickBuy = async () => {
    if (!publicClient || !walletClient || !userAddress || !currencyData || isPendingSendTxn) {
      return;
    }

    /**
     * Mint tokens.
     * @param to Address to mint tokens to.
     * @param tokenIds Token IDs to mint.
     * @param amounts Amounts of tokens to mint.
     * @param data Data to pass if receiver is contract.
     * @param expectedPaymentToken ERC20 token address to accept payment in. address(0) indicates ETH.
     * @param maxTotal Maximum amount of payment tokens.
     * @param proof Merkle proof for allowlist minting.
     * @notice Sale must be active for all tokens.
     * @dev tokenIds must be sorted ascending without duplicates.
     * @dev An empty proof is supplied when no proof is required.
     */
    const allowance = await ERC20.getAllowance(currencyData.address, userAddress, SALES_CONTRACT_ADDRESS, chainId);

    if (!allowance || allowance === 0n) {
      const res = await ERC20.approveInfinite(currencyData.address, SALES_CONTRACT_ADDRESS, walletClient);
    }
    const calldata = encodeFunctionData({
      abi: SALES_CONTRACT_ABI,
      functionName: "mint",
      args: [
        userAddress,
        [BigInt(tokenId)],
        // Amount of nfts that are going to be purchased
        [BigInt(1)],
        toHex(0),
        currencyData.address,
        // Here the exact price of the NFTs must be established (USDC = 6 decimals) (Native currency = 18 decimals)
        BigInt(10000),
        [toHex(0, { size: 32 })],
      ],
    });

    const transactionParameters = {
      to: SALES_CONTRACT_ADDRESS as `0x${string}`,
      data: calldata,
      value: BigInt(0),
    };

    sendTransaction(transactionParameters);
  };

  useEffect(() => {
    if (!chainId) return;
    const chainInfoResponse = getChain(chainId);
    if (chainInfoResponse) {
      setChainInfo(chainInfoResponse)
    }
  }, [chainId]);

  return (
    <>
      {error && <span>{JSON.stringify(error)}</span>}
      {txnData && (
        <Box display="flex" flexDirection="column" marginBottom="3">
          <Text variant="large" color="text100">
            Purchase Completed Succesfully
          </Text>
          <a href={`${chainInfo.explorerUrl}/tx/${txnData}`} target="_blank" rel="noopener noreferrer">
            <span>
              View transaction in explorer
            </span>
            <br/>
            <span>(Chain {chainInfo.name})</span>
          </a>
        </Box>
      )}
      <Button
        loading={currencyIsLoading || tokenSaleDetailsDataIsLoading}
        size="sm"
        variant="primary"
        label={!isPendingSendTxn ? "Purchase" : "Purchasing..."}
        shape="square"
        width="full"
        onClick={onClickBuy}
      />
    </>
  );
};
