import { Image } from "@nextui-org/react";
import {
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import handUrl from "@/assets/hand.png";

const vars = {
  className:
    "h-[16rem] rounded-none sm:h-[22rem] md:h-[32rem] lg:h-[36rem] xl:h-[40rem] 2xl:h-[44rem]",
  scrollInput: [0, 0.25, 1],
  posOutput: [250, 0, 0],
};

export function HandImage({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const [scope, animate] = useAnimate();
  const scroll = useScroll({
    target: scope,
    container: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const pos = useTransform(
    scroll.scrollYProgress,
    vars.scrollInput,
    vars.posOutput,
  );

  useMotionValueEvent(pos, "change", (pos) => {
    animate(
      scope.current,
      {
        x: pos,
        y: pos,
      },
      {
        bounce: 0,
      },
    );
  });

  const MotionImage = motion(Image);

  return (
    <motion.div
      initial={{
        x: vars.posOutput[0],
        y: vars.posOutput[0],
      }}

      ref={scope}
      className="relative flex w-fit items-center justify-end"
    >
      <MotionImage
        style={{
          aspectRatio: 1.2,
        }}
        className={vars.className}
        src={handUrl}
      />
    </motion.div>
  );
}
