/** Standard color object
 * ```ts
 * r: float,
 * g: float,
 * b: float,
 * a?: float
 * ```
 */
export interface ColorObject {
    r: number;
    g: number;
    b: number;
    a?: number;
}

/** Standard color array
 * ```ts
 * const color = [red, green, blue] || [red, green, blue, alpha];
 * ```
 */
export type ColorArray = [number, number, number, number?];
