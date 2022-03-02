/** Beatmap difficulty info custom data interface for Contributor.
 * ```ts
 * _role: string,
 * _name: string,
 * _iconPath: string
 * ```
 */
export interface Contributor {
    _role: string;
    _name: string;
    _iconPath: string;
    _base64?: string;
}
