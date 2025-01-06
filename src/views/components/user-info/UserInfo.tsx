import {
  Button,
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

type Account = ReturnType<typeof useAccount>;
type Disconnect = ReturnType<typeof useDisconnect>;

type UserInfoProps = {
  address: Account["address"];
  chain: Account["chain"];
  chainId: Account["chainId"];
  disconnect: Disconnect["disconnect"];
};

export function UserInfo({
  address,
  chain,
  chainId,
  disconnect,
}: UserInfoProps) {
  if (!address) {
    return <>Missing an address</>;
  }
  if (!chain) {
    return <>Missing a chain</>;
  }
  if (!chainId) {
    return <>Missing a chainId</>;
  }

  return (
    <Group title="User info">
      <Card style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
        <ShowAddressWithDisconnect
          address={address}
          onDisconnect={() => disconnect()}
        />

        <NetworkSwitchInputSelect chainId={chain?.id?.toString()} />

        <Field name="test-payments">
          <Label>{chain.name} balance for test payments:</Label>
          <SegmentedInput subvariants={{ width: "full" }}>
            <Input
              type="text"
              variant="transparent"
              subvariants={{ width: "full" }}
            />
            <SegmentedInput.Segment>
              <ButtonLink
                target="_blank"
                rel="noopener noreferrer"
                href="http://google.com"
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
