import type { Vector2 } from '../../types/vector.ts';
import { degToRad, radToDeg } from '../../utils/math.ts';

/** Create points around circle, higher precision is more accurate. */
export function createCircle(radius: number, precision: number, angleOffset?: number): Vector2[] {
   const points: Vector2[] = [];
   angleOffset = angleOffset || 0;
   const offset = degToRad(angleOffset % 360);
   for (let i = 0; i < precision; i++) {
      points.push([
         radius * Math.cos(((2 * Math.PI) / precision + offset) * i),
         radius * Math.sin(((2 * Math.PI) / precision + offset) * i),
      ]);
   }
   return points;
}

export function drawPolygon(
   radius: number,
   sides: number,
   options?: { angleOffset?: number; type?: 'inscribed' | 'circumscribed' },
): {
   coordinates: Vector2[];
   rotations: number[];
   sizes: number[];
} {
   const opt = {
      angleOffset: options?.angleOffset ?? 0,
      type: options?.type ?? 'inscribed',
   };

   if (sides < 3) {
      throw new Error('sides cannot be less than 3');
   }
   if (radius === 0) {
      throw new Error('radius cannot be 0');
   }

   const coordinates: Vector2[] = [];
   const rotations: number[] = [];
   const sizes: number[] = [];
   const offset = degToRad(((opt.angleOffset % 360) + 360) % 360);
   let coordinateNext: Vector2 | undefined;
   const length = 2 * radius * Math.sin(Math.PI / sides);
   for (let i = 0; i < sides; i++) {
      const coordinate: Vector2 = coordinateNext ?? [
         radius * Math.cos(offset + ((2 * Math.PI) / sides) * i),
         radius * Math.sin(offset + ((2 * Math.PI) / sides) * i),
      ];
      coordinateNext = [
         radius * Math.cos(offset + ((2 * Math.PI) / sides) * (i + 1)),
         radius * Math.sin(offset + ((2 * Math.PI) / sides) * (i + 1)),
      ];
      const rotation =
         (-90 +
            radToDeg(
               Math.atan2(coordinateNext[1] - coordinate[1], coordinateNext[0] - coordinate[0]),
            ) +
            360) %
         360;
      coordinates.push(coordinate);
      rotations.push(rotation);
      sizes.push(length);
   }
   return { coordinates, rotations, sizes };
}

export function drawPath(path: Vector2[]): {
   coordinates: Vector2[];
   rotations: number[];
   sizes: number[];
} {
   const coordinates: Vector2[] = [];
   const rotations: number[] = [];
   const sizes: number[] = [];
   let coordinateNext: Vector2 | undefined;
   for (let i = 0; i < path.length - 1; i++) {
      const coordinate: Vector2 = coordinateNext ?? [path[i][0], path[i][1]];
      coordinateNext = [path[i + 1][0], path[i + 1][1]];
      const rotation =
         (-90 +
            radToDeg(
               Math.atan2(coordinateNext[1] - coordinate[1], coordinateNext[0] - coordinate[0]),
            ) +
            360) %
         360;
      const size =
         Math.sqrt(
            Math.pow(coordinateNext[0] - coordinate[0], 2) +
               Math.pow(coordinateNext[1] - coordinate[1], 2),
         ) * 2;
      coordinates.push(coordinate);
      rotations.push(rotation);
      sizes.push(size);
   }
   return { coordinates, rotations, sizes };
}
