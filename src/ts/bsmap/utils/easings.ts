// taken from Aeroluna's Heck easing animation
import type { EasingFunction, Easings } from '../types/easings.ts';

const PI = Math.PI;
const HALFPI = Math.PI / 2;

const easeOutBounce = (x: number) => {
   if (x < 4 / 11.0) return (121 * x * x) / 16.0;
   if (x < 8 / 11.0) return (363 / 40.0) * x * x - (99 / 10.0) * x + 17 / 5.0;
   if (x < 9 / 10.0) {
      return (4356 / 361.0) * x * x - (35442 / 1805.0) * x + 16061 / 1805.0;
   }
   return (54 / 5) * x * x - (513 / 25.0) * x + 268 / 25.0;
};

const easeInBounce = (x: number) => 1 - easeOutBounce(1 - x);

const easeInOutBounce = (x: number) =>
   x < 0.5 ? 0.5 * easeInBounce(x * 2) : 0.5 * easeOutBounce(x * 2 - 1) + 0.5;

/** Mapped easings function. */
export const EasingsFn: {
   readonly [easing in Easings]: EasingFunction;
} = {
   easeLinear: (x) => x,
   easeStep: (x) => x,
   easeInQuad: (x) => Math.pow(x, 2),
   easeOutQuad: (x) => x * (2 - x),
   easeInOutQuad: (x) => (x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x),
   easeInCubic: (x) => Math.pow(x, 3),
   easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
   easeInOutCubic: (x) => (x < 0.5 ? 4 * Math.pow(x, 3) : (x - 1) * (2 * x - 2) * (2 * x - 2) + 1),
   easeInQuart: (x) => Math.pow(x, 4),
   easeOutQuart: (x) => 1 - Math.pow(1 - x, 4),
   easeInOutQuart: (x) => (x < 0.5 ? 8 * Math.pow(x, 4) : 1 - 8 * Math.pow(1 - x, 4)),
   easeInQuint: (x) => Math.pow(x, 5),
   easeOutQuint: (x) => 1 - Math.pow(1 - x, 5),
   easeInOutQuint: (x) => (x < 0.5 ? 16 * Math.pow(x, 5) : 1 - 16 * Math.pow(1 - x, 5)),
   easeInSine: (x) => Math.sin((x - 1) * HALFPI) + 1,
   easeOutSine: (x) => Math.sin(x * HALFPI),
   easeInOutSine: (x) => 0.5 * (1 - Math.cos(x * PI)),
   easeInCirc: (x) => 1 - Math.sqrt(1 - x * x),
   easeOutCirc: (x) => Math.sqrt((2 - x) * x),
   easeInOutCirc: (x) =>
      x < 0.5
         ? 0.5 * (1 - Math.sqrt(1 - 4 * (x * x)))
         : 0.5 * (Math.sqrt(-(2 * x - 3) * (2 * x - 1)) + 1),
   easeInExpo: (x) => (x <= 0.0 ? x : Math.pow(2, 10 * (x - 1))),
   easeOutExpo: (x) => (x >= 1.0 ? x : 1 - Math.pow(2, -10 * x)),
   easeInOutExpo: (x) => {
      if (x == 0.0 || x >= 1.0) {
         return x;
      }

      if (x < 0.5) {
         return 0.5 * Math.pow(2, 20 * x - 10);
      }

      return -0.5 * Math.pow(2, -20 * x + 10) + 1;
   },
   easeInElastic: (x) => Math.sin(13 * HALFPI * x) * Math.pow(2, 10 * (x - 1)),
   easeOutElastic: (x) => Math.sin(-13 * HALFPI * (x + 1)) * Math.pow(2, -10 * x) + 1,
   easeInOutElastic: (x) => {
      if (x < 0.5) {
         return 0.5 * Math.sin(13 * HALFPI * (2 * x)) * Math.pow(2, 10 * (2 * x - 1));
      }

      return 0.5 * (Math.sin(-13 * HALFPI * (2 * x)) * Math.pow(2, -10 * (2 * x - 1)) + 2);
   },
   easeInBack: (x) => x * x * x - x * Math.sin(x * PI),
   easeOutBack: (x) => {
      const f = 1 - x;
      return 1 - (f * f * f - f * Math.sin(f * PI));
   },
   easeInOutBack: (x) => {
      if (x < 0.5) {
         const f = 2 * x;
         return 0.5 * (f * f * f - f * Math.sin(f * PI));
      } else {
         const f = 1 - (2 * x - 1);
         return 0.5 * (1 - (f * f * f - f * Math.sin(f * PI))) + 0.5;
      }
   },
   easeInBounce,
   easeOutBounce,
   easeInOutBounce,
} as const;
