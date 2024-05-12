import HomeAdsSVG from "./adsSVG";

export default function HomeAds({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center lg:min-h-[max(100dvh,750px)]">
      <HomeAdsSVG />
    </div>
  );
}
