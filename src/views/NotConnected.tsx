import { useOpenConnectModal } from "@0xsequence/kit";
import { Button, Card } from "boilerplate-design-system";

export function NotConnected() {
  const { setOpenConnectModal } = useOpenConnectModal();

  return (
    <Card variant="none">
      <Button
        variant="primary"
        onClick={() => setOpenConnectModal(true)}
        className="px-8"
      >
        Connect
      </Button>
    </Card>
  );
}
