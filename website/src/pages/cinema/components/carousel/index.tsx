import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import "@/src/index.css";
import { moviesData } from "../../data";
import Controllers from "./controllers";
import Slide from "./singleMovie";

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [
      Autoplay({
        delay: 3000,
      }),
    ],
  );

  const [play, setPlay] = useState(true);

  useEffect(() => {
    if (emblaApi) {
      setPlay((emblaApi as any).plugins().autoplay.isPlaying());
      emblaApi.on("autoplay:play" as any, () => setPlay(true));
      emblaApi.on("autoplay:stop" as any, () => setPlay(false));
    }
    return () => {
      if (emblaApi) {
        emblaApi.off("autoplay:play" as any, () => setPlay(true));
        emblaApi.off("autoplay:stop" as any, () => setPlay(false));
      }
    };
  }, [emblaApi]);

  return (
    <div className="flex h-screen-no-navbar w-full flex-col items-center justify-center gap-10">
      <div ref={emblaRef} className="w-full overflow-hidden">
        <div className="flex w-full">
          {Object.keys(moviesData).map((name) => (
            <Slide key={name} name={name} />
          ))}
        </div>
      </div>
      <Controllers play={play} emblaApi={emblaApi} />
    </div>
  );
}
