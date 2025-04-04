import { Card, Divider, Group } from "boilerplate-design-system";
import { ItemsForSale } from "../components/items-for-sale/ItemsForSale";
import { AddressList } from "../components/address-list/AddressList";
import { AddressListItem } from "../components/address-list/AddressListItem";
import { PrimarySale } from "../components/primary-sale/PrimarySale";
import { getChain } from "../config/ERC20/getChain";
import { useSalesCurrency } from "../contexts/SalesCurrencyContext";
import { useSalesConfig } from "../contexts/SalesConfigContext";
import { Address } from "viem";

export default function Connected(props: {
  userAddress: Address;
  chainId: number;
}) {
  const { chainId, userAddress } = props;

  const saleConfig = useSalesConfig();

  const { info: currencyInfo } = useSalesCurrency();

  const addressListData: Array<[string, string]> = [];

  if (userAddress) {
    addressListData.push(["User Address", userAddress]);
  }
  addressListData.push(["Sales Contract", saleConfig.salesContractAddress]);
  addressListData.push(["NFT Token Contract", saleConfig.nftTokenAddress]);
  if (currencyInfo) {
    addressListData.push(["Payment Currency Address", currencyInfo.address]);
  }

  const urlBase = chainId
    ? getChain(chainId)?.blockExplorer?.rootUrl
    : undefined;

  return (
    <div className="flex flex-col gap-12">
      <Group title="Primary Sale Info">
        <Card className="flex flex-col gap-5 bg-white/10 border border-white/10 backdrop-blur-sm text-center p-0">
          <div className="p-4">
            <PrimarySale />
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
        <ItemsForSale />
      </Group>
      <Divider />
    </div>
  );
}
