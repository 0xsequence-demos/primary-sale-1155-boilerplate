import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";

import { useContractInfo } from "../hooks/data";
import { useSalesCurrency } from "../hooks/useSalesCurrency";

import { SALES_CONTRACT_ABI } from "../config/sales/salesContractAbi";
import { NFT_TOKEN_CONTRACT_ABI } from "../config/nft-token/nftTokenContractAbi";
import { ERC20_ABI } from "../config/ERC20/ERC20_abi";

import { calculateMintedPercentage, getSaleConfiguration } from "../helpers";

// UI - Library
import { Card, Divider, Group } from "boilerplate-design-system";
// UI - Local
import { ItemsForSale } from "../components/items-for-sale/ItemsForSale";
// import { UserInfo } from "../components/user-info/UserInfo";
import { PrimarySaleSkeleton } from "../components/primary-sale/PrimarySaleSkeleton";
import { AddressList } from "../components/address-list/AddressList";
import { AddressListItem } from "../components/address-list/AddressListItem";
import { PrimarySale } from "../components/primary-sale/PrimarySale";
import { useNFTSales } from "../hooks/useNFTSales";
import { getChain } from "../config/ERC20/getChain";

interface GlobalSalesDetailsData {
  cost: bigint;
  endtime: bigint;
  merkleRoot: string;
  startTime: bigint;
  supplyCap: bigint;
}

export function Connected() {
  const { address: userAddress, chainId } = useAccount();
  const minting = useNFTSales({ chainId });

  // Setup the sale configuration based on the chainId
  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId],
  );

  // Fetch the contract info
  const { data: contractInfoData, isLoading: contractInfoIsLoading } =
    useContractInfo(
      saleConfiguration.chainId,
      saleConfiguration.nftTokenAddress,
    );

  // Fetch the currency data
  const { data: currencyData, isLoading: currencyDataIsLoading } =
    useSalesCurrency(saleConfiguration);

  // Fetch the token sale details data
  const {
    data: tokenSaleDetailsData,
    // isLoading: tokenSaleDetailsDataIsLoading,
  } = useReadContract({
    abi: SALES_CONTRACT_ABI,
    functionName: "globalSaleDetails",
    chainId: chainId,
    address: saleConfiguration.salesContractAddress,
  });

  // Fetch the user payment currency balance
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

  // Fetch the total minted NFTs
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

  const collection = {
    name: contractInfoData?.name,
    image: contractInfoData?.extensions?.ogImage,
    description: contractInfoData?.extensions?.description,
  };

  const totalSupply =
    (tokenSaleDetailsData as GlobalSalesDetailsData)?.supplyCap?.toString() ||
    0;

  const price =
    (tokenSaleDetailsData as GlobalSalesDetailsData)?.cost || BigInt(0);

  const totalMintedNftsPercentage = calculateMintedPercentage(
    Number(nftsMinted),
    Number(totalSupply),
  );
  const currencyDecimals: number | undefined = currencyData?.decimals;

  const addressListData: Array<[string, string]> = [];

  if (userAddress) {
    addressListData.push(["User Address", userAddress]);
  }
  addressListData.push([
    "Sales Contract",
    saleConfiguration.salesContractAddress,
  ]);
  addressListData.push([
    "NFT Token Contract",
    saleConfiguration.nftTokenAddress,
  ]);
  if (currencyData) {
    addressListData.push(["Payment Currency Address", currencyData?.address]);
  }

  const urlBase = chainId
    ? getChain(chainId)?.blockExplorer?.rootUrl
    : undefined;

  return (
    <div className="flex flex-col gap-12">
      {/* <UserInfo
        balance={{
          value: userPaymentCurrencyBalance,
          decimals: currencyDecimals,
        }}
        address={userAddress}
        chain={chain}
        chainId={chainId}
        disconnect={disconnect}
      /> */}

      <Group title="Primary Sale Info">
        <Card className="flex flex-col gap-5 bg-white/10 border border-white/10 backdrop-blur-sm text-center p-0">
          <div className="p-4">
            {contractInfoIsLoading ? (
              <PrimarySaleSkeleton />
            ) : (
              <>
                {minting ? (
                  <PrimarySale collection={collection} minting={minting} />
                ) : null}
              </>
            )}
          </div>
          {chainId && (
            <Card
              collapsable
              title="Extra info for nerds"
              className="border-t border-white/10 rounded-none bg-transparent"
            >
              <AddressList>
                {addressListData.map((data) => (
                  <AddressListItem
                    key={data[0]}
                    label={data[0]}
                    address={data[1]}
                    url={urlBase ? `${urlBase}address/` : ""}
                  />
                ))}
              </AddressList>
            </Card>
          )}
        </Card>
      </Group>
      <Divider />

      <Group>
        <ItemsForSale
          chainId={saleConfiguration.chainId}
          collectionAddress={saleConfiguration.nftTokenAddress}
          totalSupply={totalSupply}
          totalMintedNftsPercentage={totalMintedNftsPercentage}
          userPaymentCurrencyBalance={userPaymentCurrencyBalance}
          price={price}
          currencyDecimals={currencyDecimals}
          currencyData={currencyData}
          currencyIsLoading={currencyDataIsLoading}
          saleConfiguration={saleConfiguration}
          refetchTotalMinted={refetchTotalMinted}
        />
      </Group>
      <Divider />
    </div>
  );
}

export default Connected;
