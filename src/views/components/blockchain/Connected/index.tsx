import {
  Box,
  Button,
  Card,
  Collapsible,
  Image,
  Spinner,
  Text,
  useMediaQuery,
} from "@0xsequence/design-system";
import { Hex } from "viem";
import { useAccount, useDisconnect, useReadContract } from "wagmi";

import { ItemsForSale } from "../../ItemsForSale";
import { useContractInfo } from "../../../hooks/data";
import { useSalesCurrency } from "../../../hooks/useSalesCurrency";
import { getChain } from "../../../../ERC20/getChain";
import SwitchNetwork from "./SwitchNetwork";
import {
  getChainId,
  getNftTokenAddress,
  getSalesContractAddress,
} from "../../../../utils/primarySellHelpers";
import { SALES_CONTRACT_ABI } from "../../../constants/abi";
import { NFT_TOKEN_CONTRACT_ABI } from "../../../constants/nft_token_contract_abi";
import ProgressBar from "../../ProgressBar";
import { ERC20_ABI } from "../../../../ERC20/ERC20_abi";
import { erc20TokenDecimals, nativeTokenDecimals } from "../../../constants";

function calculateMintedPercentage(minted: number, totalMax: number): number {
  if (totalMax <= 0) {
    return 0;
  }

  const percentage = (minted / totalMax) * 100;
  return Math.floor(percentage);
}

interface GlobalSalesDetailsData {
  cost: bigint;
  endtime: bigint;
  merkleRoot: string;
  startTime: bigint;
  supplyCap: bigint;
}

const Connected = () => {
  const { address: userAddress, chainId, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: contractInfoData, isLoading: contractInfoIsLoading } =
    useContractInfo(getChainId(chainId), getNftTokenAddress(chainId));
  const { data: currencyData } = useSalesCurrency(getChainId(chainId));

  const {
    data: tokenSaleDetailsData,
    isLoading: tokenSaleDetailsDataIsLoading,
  } = useReadContract({
    abi: SALES_CONTRACT_ABI,
    functionName: "globalSaleDetails",
    chainId: chainId,
    address: getSalesContractAddress(chainId),
  });

  const {
    data: userPaymentCurrencyBalance,
    // isLoading: userPaymentCurrencyBalanceIsLoading,
  } = useReadContract(
    currencyData?.address && userAddress
      ? {
          abi: ERC20_ABI,
          functionName: "balanceOf",
          chainId: chainId,
          address: currencyData.address as `0x${string}`,
          args: [userAddress],
          query: {
            refetchInterval: 30000,
            enabled: Boolean(currencyData?.address && userAddress),
          },
        }
      : undefined,
  );

  const {
    data: nftsMinted,
    // isLoading: nftsMintedIsLoading,
  } = useReadContract({
    abi: NFT_TOKEN_CONTRACT_ABI,
    functionName: "totalSupply",
    chainId: chainId,
    address: getNftTokenAddress(chainId),
  });

  const AddressDisplay = ({
    label,
    address,
    chainId,
  }: {
    label: string;
    address: string | Hex | undefined;
    chainId: number;
  }) => {
    const isMobile = useMediaQuery("isMobile");

    return (
      <Box
        justifyContent="space-between"
        {...(isMobile ? { flexDirection: "column" } : { textAlign: "left" })}
      >
        <Text variant="normal" color="text100" style={{ minWidth: 205 }}>
          {label}: &nbsp;
        </Text>
        <Text
          variant="normal"
          as="a"
          color="text100"
          href={`${getChain(chainId)?.explorerUrl}/address/${address}`}
          target="_blank"
          rel="noreferrer"
          ellipsis
        >
          {address}
        </Text>
      </Box>
    );
  };

  const collectionName: string | undefined = contractInfoData?.name;
  const collectionImage = contractInfoData?.extensions?.ogImage;
  const collectionDescription = contractInfoData?.extensions?.description;
  const totalSupply =
    (tokenSaleDetailsData as GlobalSalesDetailsData)?.supplyCap?.toString() ||
    0;
  const formattedNftsMinted = nftsMinted?.toString();
  const totalMintedNftsPercentaje = calculateMintedPercentage(
    Number(nftsMinted),
    Number(totalSupply),
  );

  return (
    <Card
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="3"
      style={{ width: "100%", margin: "0 auto" }}
    >
      <Box display="flex" justifyContent="flex-end" style={{ width: "100%" }}>
        {chain && <SwitchNetwork chain={chain} />}
      </Box>
      <Box width="full" paddingLeft="10" paddingRight="10">
        {contractInfoIsLoading ? (
          <Box justifyContent="center" alignItems="center">
            <Spinner />
          </Box>
        ) : (
          <Box gap="2" flexDirection="column">
            <h1>Sequence Primary Drop Sale Boilerplate</h1>
            <h2 className="homepage__marginBtNormal">Embedded Wallet</h2>
            <div>
              <Image
                src={collectionImage}
                alt={collectionName}
                style={{ width: "20rem", height: "auto" }}
              />
            </div>
            <Box display="flex" justifyContent="space-between">
              <Box gap="1" flexDirection="column" textAlign="left">
                <Text
                  variant="normal"
                  color="text100"
                  style={{ fontWeight: "700" }}
                >
                  Name:
                </Text>
                <Text variant="normal" color="text100">
                  {collectionName}
                </Text>
              </Box>
              <Box>
                {!tokenSaleDetailsDataIsLoading ? (
                  <Box display="flex" flexDirection="column" gap="4">
                    <Box display="flex" justifyContent="space-between">
                      <Text
                        variant="normal"
                        color="text100"
                        style={{ fontWeight: "700" }}
                      >
                        {totalMintedNftsPercentaje}% Minted
                      </Text>
                      <Text
                        variant="normal"
                        color="text100"
                        style={{ fontWeight: "700" }}
                      >
                        {formattedNftsMinted}/{totalSupply}
                      </Text>
                    </Box>
                    <ProgressBar percentage={totalMintedNftsPercentaje} />
                  </Box>
                ) : (
                  <Spinner />
                )}
              </Box>
            </Box>
            {collectionDescription && (
              <Box gap="1" flexDirection="column" textAlign="left">
                <Text
                  variant="normal"
                  color="text100"
                  style={{ fontWeight: "700" }}
                >
                  Description:
                </Text>
                <Text variant="normal" color="text100">
                  {collectionDescription}
                </Text>
              </Box>
            )}
            {userPaymentCurrencyBalance?.toString() && (
              <Box gap="1" flexDirection="column" textAlign="left">
                <Text
                  variant="normal"
                  color="text100"
                  style={{ fontWeight: "700" }}
                >
                  User Payment Currency Balance:
                </Text>
                <Text variant="normal" color="text100">
                  $
                  {Number(userPaymentCurrencyBalance) /
                    (currencyData?.address ==
                    "0x0000000000000000000000000000000000000000"
                      ? nativeTokenDecimals
                      : erc20TokenDecimals)}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {chainId && (
        <Collapsible label="Stuff for Nerds">
          <Box gap="1" flexDirection="column">
            <AddressDisplay
              label="User Address"
              address={userAddress}
              chainId={chainId}
            />
            <AddressDisplay
              label="Sales Contract"
              address={getSalesContractAddress(chainId)}
              chainId={chainId}
            />
            <AddressDisplay
              label="NFT token Contract"
              address={getNftTokenAddress(chainId)}
              chainId={chainId}
            />
            <AddressDisplay
              label="Payment currency Address"
              address={currencyData?.address || ""}
              chainId={chainId}
            />
          </Box>
        </Collapsible>
      )}

      <ItemsForSale
        chainId={getChainId(chainId)}
        collectionAddress={getNftTokenAddress(chainId)}
        totalMinted={formattedNftsMinted}
        totalSupply={totalSupply}
        totalMintedNftsPercentaje={totalMintedNftsPercentaje}
        userPaymentCurrencyBalance={userPaymentCurrencyBalance}
      />

      <Button label="Disconnect" onClick={disconnect} />
    </Card>
  );
};

export default Connected;
