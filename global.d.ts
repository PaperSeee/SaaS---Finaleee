import { ElementType } from "react";

declare module "framer-motion" {
  interface HTMLMotionProps<Element extends ElementType> {
    className?: string;
  }
  interface SVGMotionProps<SVGElement extends ElementType> {
    className?: string;
  }
}

declare global {
  // Ensures this file is treated as a module and the augmentation is global
}
