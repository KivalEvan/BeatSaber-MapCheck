import type * as general from '../general/index.ts';
import type * as notes from '../notes/index.ts';
import type * as obstacles from '../obstacles/index.ts';
import type * as events from '../events/index.ts';
import type * as others from '../others/index.ts';
import type { ITool } from '../../types/index.ts';

type Crawl<T> = T extends { [key: string]: ITool }
   ? { [key in keyof T]: { params: T[key]['input']['params'] } }
   : never;

export type InputParamsList = Crawl<typeof general> &
   Crawl<typeof notes> &
   Crawl<typeof obstacles> &
   Crawl<typeof events> &
   Crawl<typeof others>;
