import "@/src/index.css";
import { ScrollShadow } from "@nextui-org/react";
import StartText from "./components/startText";
import HomeAndroid from "./components/android";
import { useRef } from "react";
import HomeAds from "./components/ads";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <ScrollShadow
      ref={containerRef}
      className="smart-y-padding flex h-screen-no-navbar w-full flex-col items-center overflow-y-auto"
    >
      <StartText />
      <HomeAndroid containerRef={containerRef} />
      <HomeAds containerRef={containerRef} />
    </ScrollShadow>
  );
}
