import { HandImage } from "./hand";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useAnimate,
} from "framer-motion";
import { Button } from "@nextui-org/react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeAndroid({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const [scope1, animate1] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const scroll1 = useScroll({
    target: scope1,
    container: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const scroll2 = useScroll({
    target: scope2,
    container: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const pos1 = useTransform(scroll1.scrollYProgress, [0, 0.25, 1], [100, 0, 0]);
  const pos2 = useTransform(scroll2.scrollYProgress, [0, 0.25, 1], [100, 0, 0]);

  useMotionValueEvent(pos1, "change", (pos) => {
    animate1(
      scope1.current,
      {
        opacity: (pos / 100) * -1 + 1,
        x: `-${pos}%`,
      },
      {
        bounce: 0,
      },
    );
  });

  useMotionValueEvent(pos2, "change", (pos) => {
    animate2(
      scope2.current,
      {
        opacity: (pos / 100) * -1 + 1,
        x: `-${pos}%`,
      },
      {
        bounce: 0,
      },
    );
  });

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center lg:min-h-[max(100dvh,750px)]">
      <div className="relative flex w-full flex-row items-center">
        <motion.div className="flex w-full flex-col gap-4">
          <motion.h1
            initial={{
              opacity: 0,
              x: "-100%",
            }}
            ref={scope1}
            className="pl-2 text-center text-2xl font-thin sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl"
          >
            Collection of your favorite apps
          </motion.h1>
          <motion.h1
            initial={{
              opacity: 0,
              x: "-100%",
            }}
            ref={scope2}
            className="pl-2 text-center text-2xl font-thin sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl"
          >
            With Bleeding Edge Updates
          </motion.h1>
        </motion.div>
        <HandImage containerRef={containerRef} />
      </div>
      <Link to="/android">
        <Button size="lg" endContent={<ExternalLink />} color="success">
          Android App
        </Button>
      </Link>
    </div>
  );
}
