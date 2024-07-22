import type { Version } from './version.ts';

interface IDataCheckBase {
   readonly type: string | string[]; // string array because there'll soon be having to check both
   readonly version: Version;
   readonly array?: boolean;
   readonly optional?: boolean;
}

export interface IDataCheckPrimitive extends IDataCheckBase {
   readonly type: 'string' | 'boolean';
}

export interface IDataCheckNumber extends IDataCheckBase {
   readonly type: 'number';
   readonly int?: boolean;
   readonly unsigned?: boolean;
}

export interface IDataCheckObject extends IDataCheckBase {
   readonly type: 'object' | 'array';
   readonly check: { [key: string]: IDataCheck };
}

export type IDataCheck = IDataCheckPrimitive | IDataCheckNumber | IDataCheckObject;
