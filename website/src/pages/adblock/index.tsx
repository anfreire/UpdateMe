import "@/src/index.css";
import { useEffect } from "react";
import AdblockSelect from "./components/select";
import Adguard from "./components/adguard";
import { useUrlParam } from "@/src/hooks/useURLParam";
import { DeviceType } from "./data";

export default function AdBlock() {
  const { value: selected, update: setSelected } = useUrlParam("device");

  useEffect(() => {
    if (!selected) setSelected(null);
    else setSelected(selected as DeviceType);
  }, []);
  return (
    <div className="smart-x-padding smart-y-padding flex h-screen-no-navbar flex-col items-center gap-4 overflow-y-auto">
      <AdblockSelect selected={selected as any} setSelected={setSelected} />
      {selected && <Adguard device={selected as DeviceType} />}
    </div>
  );
}
