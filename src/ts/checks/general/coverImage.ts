import {
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIHeader } from '../../ui/header';
import { State } from '../../state';
import { Settings } from '../../settings';
import { UIInput } from '../../ui/helpers/input';

const name = 'Validate Cover Image';
const description = 'Validate cover image.';
const enabled = true;

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name,
   description,
   enabled,
);

function update() {
   htmlInput.checked = tool.input.params.enabled;
}

const tool: ICheck = {
   name,
   description,
   type: CheckType.GENERAL,
   order: {
      input: CheckInputOrder.GENERAL_COVER_IMAGE,
      output: CheckOutputOrder.GENERAL_COVER_IMAGE,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(): ICheckOutput[] {
   const img = new Image();
   const src = UIHeader.getCoverImage();

   const results: ICheckOutput[] = [];
   if (State.flag.coverImage && src !== null) {
      img.src = src;
      if (img.width !== img.height) {
         results.push({
            type: OutputType.STRING,
            label: 'Cover image is not square',
            value: 'resize to fit square',
            status: OutputStatus.ERROR,
         });
      }
      if (img.width < 256 || img.height < 256) {
         results.push({
            type: OutputType.STRING,
            label: 'Cover image is too small',
            value: 'require at least 256x256',
            status: OutputStatus.ERROR,
         });
      }
   } else {
      results.push({
         type: OutputType.STRING,
         label: 'No cover image',
         value: Settings.props.load.imageCover
            ? 'could not be loaded or found'
            : 'no cover image option is enabled',
      });
   }

   return results;
}

export default tool;
