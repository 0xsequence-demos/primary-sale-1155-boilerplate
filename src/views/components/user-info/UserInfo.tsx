import {
  Card,
  Field,
  Group,
  Input,
  Label,
  ButtonLink,
  SegmentedInput,
  ShowAddressWithDisconnect,
  Svg,
} from "boilerplate-design-system";
import { NetworkSwitchInputSelect } from "../network-switch-input-select/NetworkSwitchInputSelect";
import { useAccount, useDisconnect } from "wagmi";
import { formatPriceWithDecimals } from "../../../utils/primarySales/helpers";

type Account = ReturnType<typeof useAccount>;
type Disconnect = ReturnType<typeof useDisconnect>;

type UserInfoProps = {
  balance: {
    value?: bigint;
    decimals?: number;
  };
  address?: Account["address"];
  chain?: Account["chain"];
  chainId?: Account["chainId"];
  disconnect: Disconnect["disconnect"];
};

export function UserInfo({
  balance,
  address,
  chain,
  disconnect,
}: UserInfoProps) {
  return (
    <Group title="User info">
      <Card style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
        <ShowAddressWithDisconnect
          address={address}
          onDisconnect={() => disconnect()}
        />

        <NetworkSwitchInputSelect chainId={chain?.id?.toString()} />

        <Field name="test-payments">
          <Label>{chain?.name} balance for test payments:</Label>
          <SegmentedInput subvariants={{ width: "full" }}>
            <Input
              type="text"
              variant="transparent"
              defaultValue={
                balance.value && balance.decimals
                  ? formatPriceWithDecimals(balance.value, balance.decimals)
                  : ""
              }
              subvariants={{ width: "full" }}
              readOnly
            />
            <SegmentedInput.Segment>
              <ButtonLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://faucet.circle.com/"
                variant="tiny"
                className="self-center flex-shrink-0"
              >
                <Svg name="ExternalLink" width="16" />
                Get test currency
              </ButtonLink>
            </SegmentedInput.Segment>
          </SegmentedInput>
        </Field>
      </Card>
    </Group>
  );
}
