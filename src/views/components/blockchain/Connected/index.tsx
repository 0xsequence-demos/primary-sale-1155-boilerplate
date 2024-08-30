import {
  Box,
  Button,
  Card,
  Collapsible,
  Spinner,
  Text,
  useMediaQuery,
} from "@0xsequence/design-system";
import { Hex } from "viem";
import { useAccount, useDisconnect } from "wagmi";

import { ItemsForSale } from "../../ItemsForSale";
import { useContractInfo } from "../../../hooks/data";
import { useSalesCurrency } from "../../../hooks/useSalesCurrency";
import { getChain } from "../../../../ERC20/getChain";
import SwitchNetwork from "./SwitchNetwork";
import { getChainId, getNftTokenAddress, getSalesContractAddress } from "../../../../utils/primarySellHelpers";

const Connected = () => {
  const { address: userAddress, chainId, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: contractInfoData, isLoading: contractInfoIsLoading } =
    useContractInfo(
      getChainId(chainId),
      getNftTokenAddress(chainId),
    );
  const { data: currencyData } = useSalesCurrency(getChainId(chainId));

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
        {...(isMobile ? { flexDirection: "column" } : {})}
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

  const collectionName = contractInfoData?.name;
  const collectionDescription = contractInfoData?.extensions?.description;

  return (
    <Card
      justifyContent="center"
      alignItems="center"
      width="4"
      flexDirection="column"
      gap="3"
      style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}
    >
      {chain && <SwitchNetwork chain={chain} />}
      <Collapsible label="Collection Info">
        {contractInfoIsLoading ? (
          <Box justifyContent="center" alignItems="center">
            <Spinner />
          </Box>
        ) : (
          <Box gap="2" flexDirection="column">
            <Box gap="1" flexDirection="column">
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
            {collectionDescription && (
              <Box gap="1" flexDirection="column">
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
          </Box>
        )}
      </Collapsible>

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
      />

      <Button label="Disconnect" onClick={disconnect} />
    </Card>
  );
};

export default Connected;
