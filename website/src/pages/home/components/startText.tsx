import { motion } from "framer-motion";

export default function StartText() {
  return (
    <motion.h1
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 1,
            ease: "backOut",
            staggerChildren: 0.5,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className="flex min-h-[calc(100dvh-112px)] flex-col items-center justify-center text-wrap text-center text-5xl font-thin sm:min-h-[calc(100dvh-124px)] sm:text-6xl md:min-h-[calc(100dvh-136px)] md:text-7xl lg:min-h-[calc(100dvh-160px)] lg:text-8xl xl:min-h-[calc(100dvh-192px)] xl:text-9xl"
    >
      <motion.span
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 1,
              ease: "backOut",
              staggerChildren: 0.5,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                duration: 1,
                ease: "easeInOut",
              },
            },
          }}
        >
          The{" "}
          <motion.strong
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 2.5, ease: "easeInOut" },
              },
            }}
          >
            Tech Toolkit
          </motion.strong>
        </motion.span>
        <motion.br />
        <motion.span
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 1, ease: "easeInOut" },
            },
          }}
        >
          you never knew
        </motion.span>
        <motion.br />
        <motion.strong
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 1, ease: "easeInOut" },
            },
          }}
        >
          you needed
        </motion.strong>
      </motion.span>
    </motion.h1>
  );
}
