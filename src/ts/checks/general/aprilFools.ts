import settings from '../../settings';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';

const name = 'April Fools';
const description = 'xdd.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.APRIL_FOOLS,
      output: ToolOutputOrder.APRIL_FOOLS,
   },
   input: {
      params: { enabled },
   },
   run,
};

function run(args: ToolArgs): IToolOutput[] {
   const aprilFirst = new Date('01 April 1984');
   const currDate = new Date();
   const isAprilFirst =
      aprilFirst.getDate() === currDate.getDate() && aprilFirst.getMonth() === currDate.getMonth();

   if (!settings.aprilFooled && isAprilFirst) {
      const htmlContainer = document.createElement('div');
      const htmlLink = <HTMLAnchorElement>document.createElement('a');
      htmlLink.text = 'this link for more info.';
      htmlLink.href = 'https://youtu.be/dQw4w9WgXcQ';
      htmlLink.addEventListener('click', function () {
         settings.aprilFooled = 1;
         settings.save();
      });
      htmlContainer.innerHTML = `<b><span title="Info: no action necessary, take note."> ⚠️ </span>AI generated content detected:</b> this may violate TOS, please refer to `;
      htmlContainer.append(htmlLink);

      return [{ type: 'html', label: '', value: [htmlContainer] }];
   }
   return [];
}

export default tool;
