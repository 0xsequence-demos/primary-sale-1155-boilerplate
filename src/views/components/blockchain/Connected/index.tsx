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

interface GlobalSalesDetailsData {
  cost: bigint;
  endtime: bigint;
  merkleRoot: string;
  startTime: bigint;
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

  const collectionName = contractInfoData?.name;
  const collectionImage = contractInfoData?.extensions?.ogImage;
  const collectionDescription = contractInfoData?.extensions?.description;
  const totalSupply =
    (tokenSaleDetailsData as GlobalSalesDetailsData)?.startTime?.toString() ||
    0;

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
                  <Text
                    variant="normal"
                    color="text100"
                    style={{ fontWeight: "700" }}
                  >
                    Stock when the Primary Drop Sale was published:{" "}
                    {totalSupply}
                  </Text>
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
      />

      <Button label="Disconnect" onClick={disconnect} />
    </Card>
  );
};

export default Connected;
