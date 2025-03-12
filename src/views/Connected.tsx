import { useState } from "react";
import { AnimatePresence } from "framer-motion";

// UI - Library
import { Button, Form, Group, Image } from "boilerplate-design-system";
import { Modal } from "@0xsequence/design-system";
import { Pack } from "~/components/pack";
// UI - Local

const packs = [
  {
    id: 1,
    category: "standard",
    name: "Standard Pack",
    image: "packs/Standard_Normal_1.webp",
    price: "$3.99",
  },
  {
    id: 2,
    category: "arcana",
    name: "Arcana Pack",
    image: "packs/Arcana_Normal_1.webp",
    price: "$7.99",
  },
  {
    id: 3,
    category: "buffoon",
    name: "Buffoon Pack",
    image: "packs/Buffoon_Normal_2.webp",
    price: "$12.99",
  },
  {
    id: 4,
    category: "celestial",
    name: "Celestial Pack",
    image: "packs/Celestial_Normal_1.webp",
    price: "$19.99",
  },
  {
    id: 5,
    category: "spectral",
    name: "Spectral Pack",
    image: "packs/Spectral_Normal_1.webp",
    price: "$19.99",
  },
] as const;

export type Pack = (typeof packs)[number];

export function Connected() {
  const [openModal, setOpenModal] = useState(false);
  const [_, setSelectedPack] = useState<Pack["category"]>();

  // const { address: userAddress, chainId } = useAccount();
  // // Fetch the token sale details data
  // const {
  //   data: tokenSaleDetailsData,
  //   // isLoading: tokenSaleDetailsDataIsLoading,
  // } = useReadContract({
  //   abi: SALES_CONTRACT_ABI,
  //   functionName: "globalSaleDetails",
  //   chainId: chainId,
  //   address: saleConfiguration.salesContractAddress,
  // });
  //
  // // Fetch the user payment currency balance
  // const {
  //   data: userPaymentCurrencyBalance,
  //   // isLoading: userPaymentCurrencyBalanceIsLoading,
  // } = useReadContract(
  //   currencyData?.address && userAddress
  //     ? {
  //         abi: ERC20_ABI,
  //         functionName: "balanceOf",
  //         chainId: chainId,
  //         address: currencyData.address as `0x${string}`,
  //         args: [userAddress],
  //         query: {
  //           refetchInterval: 30000,
  //           enabled: Boolean(currencyData?.address && userAddress),
  //         },
  //       }
  //     : undefined,
  // );
  //
  // // Fetch the total minted NFTs
  // const {
  //   data: nftsMinted,
  //   // isLoading: nftsMintedIsLoading,
  //   refetch: refetchTotalMinted,
  // } = useReadContract({
  //   abi: NFT_TOKEN_CONTRACT_ABI,
  //   functionName: "totalSupply",
  //   chainId: chainId,
  //   address: saleConfiguration.nftTokenAddress,
  // });

  const buyPack = (pack: Pack["category"]) => {
    setSelectedPack(pack);
    setOpenModal(true);
  };

  return (
    <>
      <Group>
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-grey-900 p-4 text-left rounded-[1rem] flex flex-col gap-3"
            >
              <Image
                className=" w-full max-w-[28rem] mx-auto aspect-auto rounded-[0.5rem]"
                src={pack.image}
              />
              <div className="mt-auto mb-0 flex flex-col gap-4 pt-4">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-12 font-medium text-grey-50 ">
                      Price
                    </span>
                    <span className="text-14 font-bold inline-flex items-center gap-1">
                      {pack.price}
                    </span>
                  </div>
                </div>

                <Form className="flex flex-col gap-3">
                  <Button
                    type="button"
                    onClick={() => buyPack(pack.category)}
                    className="font-bold flex items-center justify-center"
                  >
                    Buy now
                  </Button>

                  {/* <BuyWithCryptoCardButton */}
                  {/*   amount={amount} */}
                  {/*   chainId={chainId} */}
                  {/*   collectionAddress={saleConfiguration.nftTokenAddress} */}
                  {/*   tokenId={tokenMetadata.tokenId} */}
                  {/*   resetAmount={resetAmount} */}
                  {/*   setTxExplorerUrl={setTxExplorerUrl} */}
                  {/*   userPaymentCurrencyBalance={userPaymentCurrencyBalance} */}
                  {/*   price={price} */}
                  {/*   currencyData={currencyData} */}
                  {/*   refetchCollectionBalance={refetchCollectionBalance} */}
                  {/*   refetchTotalMinted={refetchTotalMinted} */}
                  {/*   refetchNftsMinted={refetchNftsMinted} */}
                  {/* /> */}
                </Form>
              </div>
            </div>
          ))}
        </div>
      </Group>
      <AnimatePresence>
        {openModal && (
          <Modal
            scroll={false}
            onClose={() => {
              setOpenModal(false);
              setSelectedPack(undefined);
            }}
          >
            <Pack />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default Connected;
