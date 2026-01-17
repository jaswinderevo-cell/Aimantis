import { TargetAndTransition } from "framer-motion";

//for dates & months carousel
export const slideVariants = (cellWidth: number) => {
  return {
    enter: (direction: "left" | "right"): TargetAndTransition => ({
      x: direction === "left" ? -cellWidth : cellWidth,
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
    },
    exit: (direction: "left" | "right"): TargetAndTransition => ({
      x: direction === "left" ? cellWidth : -cellWidth,
      opacity: 0,
      position: "absolute",
    }),
  };
};

//for side bar

export const sidebarVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};
