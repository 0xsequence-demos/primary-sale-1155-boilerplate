import { useContractInfo } from "../hooks/data";
import { useSalesCurrency } from "../hooks/useSalesCurrency";

import { UnpackedSaleConfigurationProps } from "../helpers";

import { Card, Divider, Group } from "boilerplate-design-system";
import { ItemsForSale } from "../components/items-for-sale/ItemsForSale";
import { AddressList } from "../components/address-list/AddressList";
import { AddressListItem } from "../components/address-list/AddressListItem";
import { PrimarySale } from "../components/primary-sale/PrimarySale";
import { useNFTSales } from "../hooks/useNFTSales";
import { getChain } from "../config/ERC20/getChain";
import { useNetworkBalance } from "../hooks/useNetworkBalance";

export function Connected(props: {
  userAddress: `0x${string}`;
  chainId: number;
  saleConfiguration: UnpackedSaleConfigurationProps;
}) {
  const { saleConfiguration, chainId, userAddress } = props;

  const nftSalesData = useNFTSales({ chainId });

  const { data: currencyData, isLoading: currencyDataIsLoading } =
    useSalesCurrency(saleConfiguration);

  const balance = useNetworkBalance({
    address: userAddress,
    saleConfiguration,
  });

  const { data: contractInfoData } = useContractInfo(
    saleConfiguration.chainId,
    saleConfiguration.nftTokenAddress,
  );

  const collection = {
    name: contractInfoData?.name,
    image: contractInfoData?.logoURI,
    description: contractInfoData?.extensions?.description,
  };

  const price = nftSalesData?.cost || BigInt(0);

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
  if (currencyData.info) {
    addressListData.push([
      "Payment Currency Address",
      currencyData.info.address,
    ]);
  }

  const urlBase = chainId
    ? getChain(chainId)?.blockExplorer?.rootUrl
    : undefined;

  return (
    <div className="flex flex-col gap-12">
      <Group title="Primary Sale Info">
        <Card className="flex flex-col gap-5 bg-white/10 border border-white/10 backdrop-blur-sm text-center p-0">
          <div className="p-4">
            <PrimarySale collection={collection} nftSalesData={nftSalesData} />
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
          userPaymentCurrencyBalance={balance}
          price={price}
          currencyDecimals={currencyData.decimals}
          currencyInfo={currencyData.info}
          currencyIsLoading={currencyDataIsLoading}
          saleConfiguration={saleConfiguration}
          refetchTotalMinted={nftSalesData.refetchTotalMinted}
        />
      </Group>
      <Divider />
    </div>
  );
}

export default Connected;
