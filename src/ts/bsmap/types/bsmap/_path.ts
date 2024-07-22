/**
 * Maybe expanded upon in the future;
 */
export interface IPath {
   resolve: (...pathSegments: string[]) => string;
   basename: (path: string, suffix?: string) => string;
}
