import type { NodeDetail } from "@/contexts/NodeDetailsContext";
import DeleteButton from "./DeleteButton";
import GenerateCommandButton from "./GenerateCommandButton";
import EditButton from "./EditButton";
import BillingButton from "./BillingButton";
import TrafficButton from "./TrafficButton";

const ActionButtons = ({
  node,
  settings,
  isSnapshotBackend,
}: {
  node: NodeDetail;
  settings: any;
  isSnapshotBackend: boolean;
}) => {
  return (
    <div className="flex items-center gap-4">
      <GenerateCommandButton
        node={node}
        settings={settings}
        isSnapshotBackend={isSnapshotBackend}
      />
      <EditButton node={node} />
      <TrafficButton
        node={node}
        defaultTimezone={settings?.traffic_default_timezone ?? ""}
      />
      <BillingButton node={node} />
      <DeleteButton node={node} />
    </div>
  );
};

export default ActionButtons;
