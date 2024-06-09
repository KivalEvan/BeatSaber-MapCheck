/**
 * Maybe expanded upon in the future;
 */
export interface IFileSystem {
   readTextFile: (path: string) => Promise<string>;
   readTextFileSync: (path: string) => string;
   writeTextFile: (path: string, content: string) => Promise<void>;
   writeTextFileSync: (path: string, content: string) => void;
}
