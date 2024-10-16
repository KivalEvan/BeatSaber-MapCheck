import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { ObjectContainerType } from '../../types/checks/container';
import UIInput from '../../ui/helpers/input';

const name = 'One Saber';
const description = 'Check for one saber.';
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

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_ONE_SABER,
      output: ToolOutputOrder.NOTES_ONE_SABER,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: ToolArgs): IToolOutput[] {
   let notOneSaberNote;
   let whyisthisonesaber = false;
   let isOneSaber =
      args.beatmap.settings.characteristic === 'OneSaber' ||
      args.beatmap.settings.customData.oneSaber;
   if (isOneSaber) {
      notOneSaberNote = args.beatmap.data.colorNotes.filter((n) => n.isRed());
   } else {
      const hasBlueNote = args.beatmap.data.colorNotes.filter((n) => n.isBlue()).length > 0;
      const hasRedNote = args.beatmap.data.colorNotes.filter((n) => n.isRed()).length > 0;
      whyisthisonesaber = hasBlueNote ? !hasRedNote : hasRedNote;
   }

   if (notOneSaberNote!?.length) {
      return [
         {
            type: 'time',
            label: 'Wrong One Saber Note',
            value: notOneSaberNote!,
            symbol: 'error',
         },
      ];
   } else if (whyisthisonesaber) {
      return [
         {
            type: 'string',
            label: 'Unintended One Saber',
            value: 'One Saber gameplay outside of One Saber characteristic',
            symbol: 'rank',
         },
      ];
   }
   return [];
}

export default tool;
