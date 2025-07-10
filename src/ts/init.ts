import { uiInit } from './ui/init';
import { main } from './main';
import { logger } from 'bsmap';
import { PayloadType } from './types/main';
import { Settings } from './settings';

function webTag(tag: string[]): string {
   return `[${tag.join('::')}]`;
}

export async function init(): Promise<void> {
   logger.tagPrint = webTag;

   const url = new URL(location.href);

   Settings.init();
   const preset = url.searchParams.get('preset');
   Settings.props.checks.preset = preset || Settings.props.checks.preset;

   uiInit();

   const link = url.searchParams.get('url');
   if (link) {
      return main({ type: PayloadType.Url, data: link });
   }

   const id = url.searchParams.get('id');
   if (id) {
      return main({ type: PayloadType.Id, data: id });
   }

   const hash = url.searchParams.get('hash');
   if (hash) {
      return main({ type: PayloadType.Hash, data: hash });
   }
}
