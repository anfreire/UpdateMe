import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { DeviceKeys, DeviceType } from "../data";

const getDevice: (selected: Set<DeviceType>) => DeviceType | null = (
  selected,
) => {
  if (selected.size === 0) return null;
  return selected.values().next().value;
};

const deviceColors: Record<DeviceType, string> = {
  Android: "success",
  iOS: "warning",
  Windows: "primary",
  "Mac OS": "secondary",
  Linux: "danger",
};

export default function AdblockSelect({
  selected,
  setSelected,
}: {
  selected: DeviceType | null;
  setSelected: (selected: DeviceType | null) => void;
}) {
  const [_selected, _setSelected] = useState(new Set<DeviceType>());

  useEffect(() => {
    setSelected(getDevice(_selected) as DeviceType | null);
  }, [_selected, setSelected]);

  useEffect(() => {
    if (selected && selected !== getDevice(_selected))
      _setSelected(new Set([selected]));
  }, [selected]);
  return (
    <Select
      disableAnimation={false}
      aria-label="device"
      variant="flat"
      color={
        getDevice(_selected)
          ? (deviceColors[getDevice(_selected) as DeviceType] as any)
          : "default"
      }
      size="lg"
      placeholder="Select a device"
      selectionMode="single"
      selectedKeys={_selected}
      className="max-w-64"
      classNames={{
        value: "text-2xl text-center",
      }}
      onSelectionChange={_setSelected as any}
    >
      {DeviceKeys.map((device) => (
        <SelectItem
          title={device}
          aria-labelledby="device"
          classNames={{
            title: "text-xl",
          }}
          key={device}
          value={device}
        />
      ))}
    </Select>
  );
}
