import type { LooseAutocomplete } from '../../utils.ts';
import type { GenericFilename } from '../shared/filename.ts';
import type { IWrapBaseItem } from './baseItem.ts';

export interface IWrapBaseFileAttribute {
   filename: LooseAutocomplete<GenericFilename>;

   /**
    * Upon load by any mean, this value is set by their corresponding implementation.
    * This can be used to implicitly save by version if not given explicitly.
    *
    * It is advisable to not explicitly set this value unless you know what you are doing.
    *
    * @default -1 prevents from saving entirely.
    */
   version: number;
}

export interface IWrapBaseFile extends IWrapBaseFileAttribute {
   setFilename(filename: this['filename']): this;
}

export type IWrapBeatmapFile = IWrapBaseFile & IWrapBaseItem;
