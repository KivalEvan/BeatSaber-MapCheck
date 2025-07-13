import { Settings } from '../../settings';
import {
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputType,
   OutputStatus,
} from '../../types';

const name = 'April Fools';
const description = 'xdd.';
const enabled = true;

const tool: ICheck = {
   name,
   description,
   type: CheckType.GENERAL,
   order: {
      input: CheckInputOrder.APRIL_FOOLS,
      output: CheckOutputOrder.APRIL_FOOLS,
   },
   input: {
      params: { enabled },
   },
   run,
};

function run(args: CheckArgs): ICheckOutput[] {
   const aprilFirst = new Date('01 April 1984');
   const currDate = new Date();
   const isAprilFirst =
      aprilFirst.getDate() === currDate.getDate() && aprilFirst.getMonth() === currDate.getMonth();

   if (!Settings.props.aprilFooled && isAprilFirst) {
      const htmlContainer = document.createElement('div');
      const htmlLink = <HTMLAnchorElement>document.createElement('a');
      htmlLink.text = 'this link for more info.';
      htmlLink.href = 'https://youtu.be/dQw4w9WgXcQ';
      htmlLink.addEventListener('click', function () {
         Settings.props.aprilFooled = 1;
         Settings.save();
      });
      htmlContainer.innerHTML = `<b><span title="Info: no action necessary, take note."> ⚠️ </span>AI generated content detected:</b> this may violate TOS, please refer to `;
      htmlContainer.append(htmlLink);

      return [{ type: OutputType.HTML, label: '', value: [htmlContainer] }];
   }
   return [];
}

export default tool;
