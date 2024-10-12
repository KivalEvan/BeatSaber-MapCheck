import * as ui from './ui';
import main from './main';

export default (async function () {
   ui.init();

   const url = new URL(location.href);
   const link = url.searchParams.get('url');
   const id = url.searchParams.get('id');
   const hash = url.searchParams.get('hash');

   if (id || link || hash) {
      await main({ link, id, hash });
   }
})();
