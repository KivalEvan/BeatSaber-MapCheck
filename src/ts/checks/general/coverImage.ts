import { ITool, IToolOutput, ToolInputOrder, ToolOutputOrder } from '../../types';
import uiHeader from '../../ui/header';
import flag from '../../flag';
import settings from '../../settings';
import UIInput from '../../ui/helpers/input';

const name = 'Validate Cover Image';
const description = 'Validate cover image.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_COVER_IMAGE,
      output: ToolOutputOrder.GENERAL_COVER_IMAGE,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.params.enabled = this.checked;
            },
            name,
            description,
            enabled,
         ),
      ),
   },
   run,
};

function run(): IToolOutput[] {
   const img = new Image();
   const src = uiHeader.getCoverImage();

   const results: IToolOutput[] = [];
   if (flag.loading.coverImage && src !== null) {
      img.src = src;
      if (img.width !== img.height) {
         results.push({
            type: 'string',
            label: 'Cover image is not square',
            value: 'resize to fit square',
            symbol: 'error',
         });
      }
      if (img.width < 256 || img.height < 256) {
         results.push({
            type: 'string',
            label: 'Cover image is too small',
            value: 'require at least 256x256',
            symbol: 'error',
         });
      }
   } else {
      results.push({
         type: 'string',
         label: 'No cover image',
         value: settings.load.imageCover
            ? 'could not be loaded or found'
            : 'no cover image option is enabled',
      });
   }

   return results;
}

export default tool;
