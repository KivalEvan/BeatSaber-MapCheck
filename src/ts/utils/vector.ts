export function vectorLerp<T extends number[]>(a: T, b: T, t: number): T {
   const res = [];
   for (let i = 0; i < a.length; i++) {
      res.push(a[i] + (b[i] - a[i]) * t);
   }
   return res as T;
}

export function vectorRotate<T extends number[]>(v: T, theta: number): T {
   return [
      v[0] * Math.cos(theta) - v[1] * Math.sin(theta),
      v[0] * Math.sin(theta) + v[1] * Math.cos(theta),
   ] as T;
}
