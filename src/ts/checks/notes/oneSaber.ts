import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { printResult, printResultTime } from '../helpers';

const name = 'One Saber';
const description = 'Check for one saber.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_ONE_SABER,
      output: ToolOutputOrder.NOTES_ONE_SABER,
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

function run(args: ToolArgs) {
   let notOneSaberNote: number[] | undefined;
   let whyisthisonesaber = false;
   let isOneSaber =
      args.beatmap!.settings.characteristic === 'OneSaber' ||
      args.beatmap!.settings.customData.oneSaber;
   if (isOneSaber) {
      notOneSaberNote = args.beatmap!.data.colorNotes.filter((n) => n.isRed()).map((n) => n.time);
   } else {
      const hasBlueNote = args.beatmap!.data.colorNotes.filter((n) => n.isBlue()).length > 0;
      const hasRedNote = args.beatmap!.data.colorNotes.filter((n) => n.isRed()).length > 0;
      whyisthisonesaber = hasBlueNote ? !hasRedNote : hasRedNote;
   }

   if (notOneSaberNote?.length) {
      tool.output.html = printResultTime(
         'Wrong One Saber Note',
         notOneSaberNote,
         args.settings.timeProcessor,
         'error',
      );
   } else if (whyisthisonesaber) {
      tool.output.html = printResult(
         'Unintended One Saber',
         'One Saber gameplay outside of One Saber characteristic',
         'rank',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
