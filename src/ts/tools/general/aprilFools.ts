import settings from '../../settings';
import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';

const name = 'April Fools';
const description = 'xdd.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.APRIL_FOOLS,
      output: ToolOutputOrder.APRIL_FOOLS,
   },
   input: {
      enabled,
      params: {},
   },
   output: {
      html: null,
   },
   run,
};

function run(map: ToolArgs) {
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
         settings.aprilFooled = true;
         settings.save();
      });
      htmlContainer.innerHTML = `<b><span title="Info: no action necessary, take note."> ⚠️ </span>AI generated content detected:</b> this may violate TOS, please refer to `;
      htmlContainer.append(htmlLink);

      tool.output.html = htmlContainer;
   } else {
      tool.output.html = null;
   }
}

export default tool;
