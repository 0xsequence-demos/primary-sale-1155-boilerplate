import {
  Box,
  Card,
  Collapsible,
  Image,
  Spinner,
  Text,
  useMediaQuery,
} from "@0xsequence/design-system";
import { Hex } from "viem";
import { useAccount, useDisconnect, useReadContract } from "wagmi";

import { ItemsForSale } from "../components/items-for-sale/ItemsForSale";
import { useContractInfo } from "../hooks/data";
import { useSalesCurrency } from "../hooks/useSalesCurrency";
import { getChain } from "~/config/ERC20/getChain";

import { SALES_CONTRACT_ABI } from "~/config/sales/salesContractAbi";
import { NFT_TOKEN_CONTRACT_ABI } from "~/config/nft-token/nftTokenContractAbi";
import { ERC20_ABI } from "~/config/ERC20/ERC20_abi";
import { useMemo } from "react";
import { UserInfo } from "../components/user-info/UserInfo";
import { Group } from "boilerplate-design-system";
import { getSaleConfiguration } from "~/helpers";
import { MintedProgressBar } from "~/components/minted-progress-bar/MintedProgressBar";

const calculateMintedPercentage = (minted: number, totalMax: number): number =>
  totalMax <= 0 ? 0 : Math.floor((minted / totalMax) * 100);

interface GlobalSalesDetailsData {
  cost: bigint;
  endtime: bigint;
  merkleRoot: string;
  startTime: bigint;
  supplyCap: bigint;
}

export const Connected = () => {
  const { address: userAddress, chainId, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId],
  );
  const { data: contractInfoData, isLoading: contractInfoIsLoading } =
    useContractInfo(
      saleConfiguration.chainId,
      saleConfiguration.nftTokenAddress,
    );
  const { data: currencyData, isLoading: currencyDataIsLoading } =
    useSalesCurrency(saleConfiguration);

  const {
    data: tokenSaleDetailsData,
    // isLoading: tokenSaleDetailsDataIsLoading,
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
      : undefined,
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

  // const UserInfoDisplay = ({
  //   label,
  //   value,
  // }: {
  //   label: string;
  //   value: string | Hex | undefined;
  // }) => {
  //   const isMobile = useMediaQuery("isMobile");

  //   return (
  //     <Box
  //       justifyContent="space-between"
  //       {...(isMobile ? { flexDirection: "column" } : { textAlign: "left" })}
  //     >
  //       <Text variant="normal" color="text100" style={{ minWidth: 205 }}>
  //         {label}: &nbsp;
  //       </Text>
  //       <Text variant="normal" color="text100" ellipsis>
  //         {value}
  //       </Text>
  //     </Box>
  //   );
  // };

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
    Number(totalSupply),
  );
  const currencyDecimals: number | undefined = currencyData?.decimals;

  return (
    <div className="flex flex-col gap-12">
      <UserInfo
        balance={{
          value: userPaymentCurrencyBalance,
          decimals: currencyDecimals,
        }}
        address={userAddress}
        chain={chain}
        chainId={chainId}
        disconnect={disconnect}
      />

      {/* <Box display="flex" justifyContent="flex-end" style={{ width: "100%" }}>
        {chain && <SwitchNetwork chain={chain} />}
      </Box> */}
      <Group title="Primary Sale Info">
        <Card className="flex flex-col gap-4">
          {contractInfoIsLoading ? (
            <Box justifyContent="center" alignItems="center">
              <Spinner />
            </Box>
          ) : (
            <div className="flex gap-4 w-full">
              <Image
                src={collectionImage}
                alt={collectionName}
                style={{
                  width: "8rem",
                  height: "auto",
                  borderRadius: "0.5rem",
                }}
              />
              <div className="flex flex-col items-start w-full">
                <div className="flex items-start flex-col flex-1">
                  <h3 className="text-20 font-bold">{collectionName}</h3>
                  {collectionDescription ? (
                    <p>{collectionDescription}</p>
                  ) : null}
                </div>
                <div className="mt-auto mb-0 w-full">
                  <MintedProgressBar
                    mintedPercentage={totalMintedNftsPercentaje}
                    mintedValue={Number(nftsMinted)}
                    supplyValue={Number(totalSupply)}
                    showTotalMintedPercentage
                  />
                </div>
              </div>
            </div>
          )}

          {chainId && (
            <Collapsible label="Extra info for nerds">
              <div className="flex flex-col gap-1">
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
              </div>
            </Collapsible>
          )}
        </Card>
      </Group>
      {/* {chainId &&
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
        )} */}
      <Group>
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
      </Group>
    </div>
  );
};

export default Connected;
