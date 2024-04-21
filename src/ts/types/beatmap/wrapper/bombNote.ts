// deno-lint-ignore-file no-explicit-any
import type { IWrapGridObject, IWrapGridObjectAttribute } from './gridObject.ts';

export interface IWrapBombNoteAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapGridObjectAttribute<T> {}

export interface IWrapBombNote<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapGridObject<T>,
      IWrapBombNoteAttribute<T> {}
