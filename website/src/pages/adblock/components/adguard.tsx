import { Divider, Tab, Tabs } from "@nextui-org/react";
import Source from "../../music/common/source";
import {
  DeviceType,
  Devices1Type,
  Devices2Type,
  stepsDevices1,
  stepsDevices2,
} from "../data";
import AdblockListItem from "./listItem";
import { useEffect, useState } from "react";

const Devices1 = ({ device }: { device: Devices1Type }) => (
  <ul className="w-full sm:my-2 md:my-4 lg:my-6 xl:my-8 2xl:my-10">
    {device in stepsDevices1 &&
      stepsDevices1[device].map((step, index) => (
        <div key={index}>
          <AdblockListItem step={step.step} src={step.src} child={step.child} />
          {index !== stepsDevices1[device].length - 1 && <Divider />}
        </div>
      ))}
  </ul>
);

const Devices2 = ({ device }: { device: Devices2Type }) => {
  const [tabs, setTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  useEffect(() => {
    setTabs(Object.keys(stepsDevices2[device]));
    setActiveTab(Object.keys(stepsDevices2[device])[0]);
    return () => {
      setTabs([]);
      setActiveTab("");
    };
  }, [device]);
  return tabs.length > 0 &&
    activeTab !== "" &&
    stepsDevices2[device] !== undefined &&
    stepsDevices2[device][activeTab] !== undefined ? (
    <>
      <Tabs
        className="mt-8"
        size="lg"
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
      >
        {tabs.map((tab) => (
          <Tab key={tab} title={tab} />
        ))}
      </Tabs>
      <ul className="w-full sm:my-2 md:my-4 lg:my-6 xl:my-8 2xl:my-10">
        {stepsDevices2[device][activeTab].map((step, index) => (
          <div key={index}>
            <AdblockListItem
              step={step.step}
              src={step.src}
              child={step.child}
            />
            {index !== stepsDevices2[device][activeTab].length - 1 && (
              <Divider />
            )}
          </div>
        ))}
      </ul>
    </>
  ) : null;
};

export default function Adguard({ device }: { device: DeviceType }) {
  return (
    <div className="flex h-fit flex-col items-center">
      {device in stepsDevices1 ? (
        <Devices1 device={device as Devices1Type} />
      ) : (
        <Devices2 device={device as Devices2Type} />
      )}

      <div>
        <Source link="https://adguard-dns.io/en/public-dns.html" />
      </div>
    </div>
  );
}
