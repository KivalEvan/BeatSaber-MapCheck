import { isBlueNoteColor, isRedNoteColor } from 'bsmap';
import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';

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

const tool: ICheck = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_ONE_SABER,
      output: CheckOutputOrder.NOTES_ONE_SABER,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: CheckArgs): ICheckOutput[] {
   let notOneSaberNote;
   let whyisthisonesaber = false;
   let isOneSaber =
      args.beatmap.info.characteristic === 'OneSaber' || args.beatmap.info.customData.oneSaber;
   if (isOneSaber) {
      notOneSaberNote = args.beatmap.data.difficulty.colorNotes.filter((n) =>
         isRedNoteColor(n.color),
      );
   } else {
      const hasBlueNote =
         args.beatmap.data.difficulty.colorNotes.filter((n) => isBlueNoteColor(n.color)).length > 0;
      const hasRedNote =
         args.beatmap.data.difficulty.colorNotes.filter((n) => isRedNoteColor(n.color)).length > 0;
      whyisthisonesaber = hasBlueNote !== hasRedNote;
   }

   if (notOneSaberNote!?.length) {
      return [
         {
            status: OutputStatus.ERROR,
            label: 'Wrong One Saber Note',
            type: OutputType.TIME,
            value: notOneSaberNote!,
         },
      ];
   } else if (whyisthisonesaber) {
      return [
         {
            status: OutputStatus.RANK,
            label: 'Unintended One Saber',
            type: OutputType.STRING,
            value: 'One Saber gameplay outside of One Saber characteristic',
         },
      ];
   }
   return [];
}

export default tool;
