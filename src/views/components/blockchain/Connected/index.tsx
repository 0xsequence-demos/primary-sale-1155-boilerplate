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
  formatPriceWithDecimals,
  getSaleConfiguration,
} from "../../../../utils/primarySales/helpers";
import { SALES_CONTRACT_ABI } from "../../../../utils/primarySales/abis/salesContractAbi";
import { NFT_TOKEN_CONTRACT_ABI } from "../../../../utils/primarySales/abis/nftTokenContractAbi";
import ProgressBar from "../../ProgressBar";
import { ERC20_ABI } from "../../../../ERC20/ERC20_abi";
import { useMemo } from "react";
import { UserInfo } from "../../user-info/UserInfo";
import { Group } from "boilerplate-design-system";

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
  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId]
  );
  const { data: contractInfoData, isLoading: contractInfoIsLoading } =
    useContractInfo(
      saleConfiguration.chainId,
      saleConfiguration.nftTokenAddress
    );
  const { data: currencyData, isLoading: currencyDataIsLoading } =
    useSalesCurrency(saleConfiguration);

  const {
    data: tokenSaleDetailsData,
    isLoading: tokenSaleDetailsDataIsLoading,
  } = useReadContract({
    abi: SALES_CONTRACT_ABI,
    functionName: "globalSaleDetails",
    chainId: chainId,
    address: saleConfiguration.salesContractAddress,
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
      : undefined
  );

  const {
    data: nftsMinted,
    // isLoading: nftsMintedIsLoading,
    refetch: refetchTotalMinted,
  } = useReadContract({
    abi: NFT_TOKEN_CONTRACT_ABI,
    functionName: "totalSupply",
    chainId: chainId,
    address: saleConfiguration.nftTokenAddress,
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

  const UserInfoDisplay = ({
    label,
    value,
  }: {
    label: string;
    value: string | Hex | undefined;
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
        <Text variant="normal" color="text100" ellipsis>
          {value}
        </Text>
      </Box>
    );
  };

  const collectionName: string | undefined = contractInfoData?.name;
  const collectionImage = contractInfoData?.extensions?.ogImage;
  const collectionDescription: string | undefined =
    contractInfoData?.extensions?.description;
  const totalSupply =
    (tokenSaleDetailsData as GlobalSalesDetailsData)?.supplyCap?.toString() ||
    0;
  const price =
    (tokenSaleDetailsData as GlobalSalesDetailsData)?.cost || BigInt(0);
  const formattedNftsMinted = nftsMinted?.toString();
  const totalMintedNftsPercentaje = calculateMintedPercentage(
    Number(nftsMinted),
    Number(totalSupply)
  );
  const currencyDecimals: number | undefined = currencyData?.decimals;

  return (
    // <Card
    //   justifyContent="center"
    //   alignItems="center"
    //   flexDirection="column"
    //   gap="3"
    //   style={{ width: "100%", margin: "0 auto" }}
    // >
    <div>
      <UserInfo
        address={userAddress}
        chain={chain}
        chainId={chainId}
        disconnect={disconnect}
      />

      {/* <Box display="flex" justifyContent="flex-end" style={{ width: "100%" }}>
        {chain && <SwitchNetwork chain={chain} />}
      </Box> */}
      <Group title="Primary Sale Info">
        <Card>
          {contractInfoIsLoading ? (
            <Box justifyContent="center" alignItems="center">
              <Spinner />
            </Box>
          ) : (
            <div className="flex gap-4">
              <Image
                src={collectionImage}
                alt={collectionName}
                style={{
                  width: "8rem",
                  height: "auto",
                  borderRadius: "0.5rem",
                }}
              />
              <div className="flex items-start flex-col">
                <h3 className="text-20 font-bold">{collectionName}</h3>
                {collectionDescription ? <p>{collectionDescription}</p> : null}
              </div>
            </div>
          )}
        </Card>
      </Group>

      {chainId && (
        <Collapsible label="Extra info for nerds">
          <Box gap="1" flexDirection="column">
            <AddressDisplay
              label="User Address"
              address={userAddress}
              chainId={chainId}
            />
            <AddressDisplay
              label="Sales Contract"
              address={saleConfiguration.salesContractAddress}
              chainId={chainId}
            />
            <AddressDisplay
              label="NFT token Contract"
              address={saleConfiguration.nftTokenAddress}
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
      {chainId &&
        userPaymentCurrencyBalance &&
        userAddress &&
        currencyData &&
        currencyDecimals && (
          <Collapsible label="User information">
            <AddressDisplay
              label="User Address"
              address={userAddress}
              chainId={chainId}
            />
            <AddressDisplay
              label="Payment currency Address"
              address={currencyData?.address}
              chainId={chainId}
            />
            <UserInfoDisplay
              label="User Payment Currency Balance"
              value={`$${formatPriceWithDecimals(userPaymentCurrencyBalance, currencyDecimals)}`}
            />
          </Collapsible>
        )}
      <ItemsForSale
        chainId={saleConfiguration.chainId}
        collectionAddress={saleConfiguration.nftTokenAddress}
        totalMinted={formattedNftsMinted}
        totalSupply={totalSupply}
        totalMintedNftsPercentaje={totalMintedNftsPercentaje}
        userPaymentCurrencyBalance={userPaymentCurrencyBalance}
        price={price}
        currencyDecimals={currencyDecimals}
        currencyData={currencyData}
        currencyIsLoading={currencyDataIsLoading}
        saleConfiguration={saleConfiguration}
        refetchTotalMinted={refetchTotalMinted}
      />

      {/* </Card> */}
    </div>
  );
};

export default Connected;
