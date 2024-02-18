import { Tool, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import uiHeader from '../../ui/header';
import flag from '../../flag';
import settings from '../../settings';
import { printResult } from '../helpers';
import UIInput from '../../ui/helpers/input';

const name = 'Validate Cover Image';
const description = 'Validate cover image.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_COVER_IMAGE,
      output: ToolOutputOrder.GENERAL_COVER_IMAGE,
   },
   input: {
      enabled,
      params: {},
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name,
            description,
            enabled,
         ),
      ),
   },
   output: {
      html: null,
   },
   run,
};

function run() {
   const img = new Image();
   const src = uiHeader.getCoverImage();

   const htmlResult: HTMLElement[] = [];
   if (flag.loading.coverImage && src !== null) {
      img.src = src;
      if (img.width !== img.height) {
         htmlResult.push(printResult('Cover image is not square', 'resize to fit square', 'error'));
      }
      if (img.width < 256 || img.height < 256) {
         htmlResult.push(
            printResult('Cover image is too small', 'require at least 256x256', 'error'),
         );
      }
   } else {
      htmlResult.push(
         printResult(
            'No cover image',
            settings.load.imageCover
               ? 'could not be loaded or found'
               : 'no cover image option is enabled',
         ),
      );
   }

   if (htmlResult.length) {
      const htmlContainer = document.createElement('div');
      htmlResult.forEach((h) => htmlContainer.append(h));
      tool.output.html = htmlContainer;
   } else {
      tool.output.html = null;
   }
}

export default tool;
