import { Version } from './version';

interface DataCheckBase {
    type: string | string[]; // string array because there'll soon be having to check both
    version: Version;
    optional?: boolean;
}

export interface DataCheckPrimitive extends DataCheckBase {
    type: 'string' | 'boolean';
}

export interface DataCheckNumber extends DataCheckBase {
    type: 'number';
    int?: boolean;
    unsigned?: boolean;
}

export interface DataCheckObject extends DataCheckBase {
    type: 'object' | 'array';
    check: { [key: string]: DataCheck };
}

export type DataCheck = DataCheckPrimitive | DataCheckNumber | DataCheckObject;
