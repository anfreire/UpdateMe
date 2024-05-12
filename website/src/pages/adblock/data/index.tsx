import { Button, Kbd } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { AdblockListItemProps } from "../components/listItem";
import AdGuard from "../utils";
import Command from "@/src/common/command";

export type Devices1Type = "Android" | "Windows" | "iOS";
export const Devices1Keys: Devices1Type[] = ["Android", "Windows", "iOS"];

export type Devices2Type = "Mac OS" | "Linux";
export const Devices2Keys: Devices2Type[] = ["Mac OS", "Linux"];

export type DeviceType = Devices1Type | Devices2Type;
export const DeviceKeys: DeviceType[] = [
  "Android",
  "iOS",
  "Linux",
  "Mac OS",
  "Windows",
];

export const stepsDevices1: Record<Devices1Type, AdblockListItemProps[]> = {
  Android: [
    {
      step: "Go to Settings → Network & Internet (or Wi-Fi & Internet)",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/android-dns-01.jpg",
    },
    {
      step: "Select Advanced → Private DNS",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/android-dns-02.jpg",
    },
    {
      step: (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          Select Private DNS provider and enter
          <Command command="dns.adguard.com" />
        </div>
      ),
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/android-dns-03.jpg",
    },
    {
      step: <span className="text-xl">Click Save</span>,
    },
  ],
  iOS: [
    {
      step: "Download configuration profile",
      child: (
        <Button
          onClick={() =>
            AdGuard.downlaodIOS().then((res) => {
              !res && toast.error("Failed to download");
            })
          }
        >
          Download
        </Button>
      ),
    },
    {
      step: "Open the Settings app on your device.",
      src: "https://cdn.adguard.info/website/adguard-dns.io/apple-preferences-icon.svg",
    },
    {
      step: "Tap Profile Downloaded",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/ios-dns-01.jpg",
    },
    {
      step: "Tap Install and follow the onscreen instructions",
      src: " https://cdn.adguard.info/website/adguard-dns.io/screenshots/ios-dns-02.jpg",
    },
  ],
  Windows: [
    {
      step: "Go to Start menu → Control Panel",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-01.jpg",
    },
    {
      step: "Select Network and Internet",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-02.jpg",
    },
    {
      step: "Click Network and Sharing Center",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-03.jpg",
    },
    {
      step: "In the left panel, select Change Adapter Settings",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-04.jpg",
    },
    {
      step: "Click the Wi-Fi network to which you are connected",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-05.jpg",
    },
    {
      step: (
        <>
          In the option bar, select Change settings of this connection. If the
          option is hidden, click the chevron icon.
          <br />
          Alternatively, right-click the connection icon and select Properties
        </>
      ),
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-06.jpg",
    },
    {
      step: "Select Internet Protocol Version 4 (TCP/IPv4)",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-07.jpg",
    },
    {
      step: "Click Properties",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-08.jpg",
    },
    {
      step: "Select Use the following DNS server addresses",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-09.jpg",
    },
    {
      step: (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          Enter the address below as Preferred DNS server
          <Command command="94.140.14.14" />
          Enter the address below as Alternate DNS server
          <Command command="94.140.15.15" />
        </div>
      ),
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-10.jpg",
    },
    {
      step: "Click OK",
    },
    {
      step: "Select Internet Protocol Version 6 (TCP/IPv6) and click Properties",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-11.jpg",
    },
    {
      step: "Select Use the following DNS server addresses",
      src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/windows-dns-12.jpg",
    },
    {
      step: (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          Enter the address below as Preferred DNS server
          <Command command="2a10:50c0::ad1:ff" />
          Enter the address below as Alternate DNS server
          <Command command="2a10:50c0::ad2:ff" />
        </div>
      ),
    },
    {
      step: "Click OK",
    },
    {
      step: "Click Close",
    },
  ],
};

export const stepsDevices2: Record<
  Devices2Type,
  Record<string, AdblockListItemProps[]>
> = {
  Linux: {
    "Graphical User Interface": [
      {
        step: "Open System or System Settings, depending on your version",
      },
      {
        step: "Select Wi-Fi for wireless connections or Network for cable connections and click the cogwheel next to the required connection",
      },
      {
        step: "Select IPv4",
      },
      {
        step: (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            Enter the adresses below as DNS servers
            <Command command="94.140.14.14" />
            <Command command="94.140.15.15" />
          </div>
        ),
      },
      {
        step: "Turn off the Automatic switch next to the DNS field",
      },
      {
        step: "Click Apply",
      },
      {
        step: "Select IPv6",
      },
      {
        step: (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            Enter the adresses below as DNS servers
            <Command command="2a10:50c0::ad1:ff" />
            <Command command="2a10:50c0::ad2:ff" />
          </div>
        ),
      },
      {
        step: "Turn off the Automatic switch next to the DNS field",
      },
      {
        step: "Click Apply",
      },
      {
        step: "Restart your network to apply changes",
      },
    ],
    Terminal: [
      {
        step: "Open the Terminal",
      },
      {
        step: (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            In the command line, type:
            <Command command="sudo nano /etc/resolv.conf" />
          </div>
        ),
      },
      {
        step: (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            When the text editor opens, enter the addresses below as DNS servers
            <strong>IPv4</strong>
            <Command command="94.140.14.14" />
            <Command command="94.140.15.15" />
            <strong>IPv6</strong>
            <Command command="2a10:50c0::ad1:ff" />
            <Command command="2a10:50c0::ad2:ff" />
          </div>
        ),
      },
      {
        step: (
          <div className="flex flex-row items-center justify-center gap-4 text-center">
            Press <Kbd keys={["ctrl"]}>O</Kbd> to save the file
          </div>
        ),
      },
      {
        step: (
          <div className="flex flex-row items-center justify-center gap-4 text-center">
            Press <Kbd keys={["enter"]} />
          </div>
        ),
      },
      {
        step: (
          <div className="flex flex-row items-center justify-center gap-4 text-center">
            Press <Kbd keys={["ctrl"]}>X</Kbd> to exit
          </div>
        ),
      },
      {
        step: (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            In the command line, enter:
            <Command command="sudo /etc/init.d/networking restart" />
          </div>
        ),
      },
      {
        step: (
          <div className="flex flex-row items-center justify-center gap-4 text-center">
            Press <Kbd keys={["enter"]} />
          </div>
        ),
      },
      {
        step: "Close the Terminal",
      },
    ],
  },
  "Mac OS": {
    "Big Sur 11.6 and above": [
      {
        step: "Download configuration profile",
        child: (
          <Button
            onClick={() =>
              AdGuard.downlaodMacOS().then((res) => {
                !res && toast.error("Failed to download");
              })
            }
          >
            Download
          </Button>
        ),
      },
      {
        step: "Open the Settings app on your device",
        src: "https://cdn.adguard.info/website/adguard-dns.io/apple-preferences-icon.svg",
      },
      {
        step: "Select Profiles",
        src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/macos-dns-new-01.jpg",
      },
      {
        step: "Select the downloaded AdGuard DNS profile and click Install",
        src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/macos-dns-new-02.jpg",
      },
    ],
    "Older versions": [
      {
        step: "Open the Settings app on your device",
        src: "https://cdn.adguard.info/website/adguard-dns.io/apple-preferences-icon.svg",
      },
      {
        step: "Select Network",
        src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/macos-dns-old-01.jpg",
      },
      {
        step: "Select your network interface from the sidebar",
        src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/macos-dns-old-02.jpg",
      },
      {
        step: "Click Advanced",
        src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/macos-dns-old-03.jpg",
      },
      {
        step: "Select the DNS tab",
        src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/macos-dns-old-04.jpg",
      },
      {
        step: (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            Click the Add button at the bottom of the DNS Servers list.
            <br />
            Enter the addresses below for the required DNS servers
            <Command command="94.140.14.14" />
            <Command command="94.140.15.15" />
          </div>
        ),
        src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/macos-dns-old-05.jpg",
      },
      {
        step: "Click OK",
        src: "https://cdn.adguard.info/website/adguard-dns.io/screenshots/macos-dns-old-06.jpg",
      },
    ],
  },
};
