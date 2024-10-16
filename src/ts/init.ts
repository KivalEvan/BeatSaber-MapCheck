import * as ui from './ui';
import main from './main';
import { logger } from 'bsmap';

export default (async function () {
   logger.tagPrint = (tag: string[], level: number): string => {
      return `[${tag.join('::')}]`;
   };
   ui.init();

   const url = new URL(location.href);
   const link = url.searchParams.get('url');
   const id = url.searchParams.get('id');
   const hash = url.searchParams.get('hash');

   if (id || link || hash) {
      await main({ link, id, hash });
   }
})();
