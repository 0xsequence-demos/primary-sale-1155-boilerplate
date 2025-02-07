import { Children, cloneElement, type ReactElement } from "react";
import { getChain } from "~/config/ERC20/getChain";

export function AddressList({
  children,
  chainId,
}: {
  children: ReactElement | ReactElement[];
  chainId: number;
}) {
  const url = `${getChain(chainId)?.blockExplorer?.rootUrl}/address/`;

  const childrenWithProps = Children.map(
    children as ReactElement | ReactElement[],
    (child: ReactElement) =>
      cloneElement(child, {
        url,
        ...child.props,
      }),
  );

  return (
    <ul className="flex flex-col gap-4 text-14 text-left leading-tight">
      {childrenWithProps}
    </ul>
  );
}
