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
import { UIInput } from '../../ui/helpers/input';
import { ObjectContainerType } from '../../types/container';
import * as types from 'bsmap/types';
import { PrecalculateKey } from '../../types/precalculate';
import { shortRotDistance } from 'bsmap/utils';
import { isNoteSwingable } from '../../utils/beatmap';

const name = 'Parallel Notes';
const description = 'Also known as Lollope, note that are parallel to each other.';
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
      input: CheckInputOrder.NOTES_PARALLEL_NOTES,
      output: CheckOutputOrder.NOTES_PARALLEL_NOTES,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(args: CheckArgs) {
   const noteContainer = args.beatmap.noteContainer.filter(
      (n) => n.type === ObjectContainerType.BOMB || n.type === ObjectContainerType.COLOR,
   );

   const result: types.wrapper.IWrapColorNote[] = [];
   // to avoid multiple of stack popping up, ignore anything within this time
   let lastTime: number = 0;
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const currentNote = noteContainer[i];
      if (
         currentNote.type !== ObjectContainerType.COLOR ||
         currentNote.data.customData[PrecalculateKey.SECOND_TIME] < lastTime + 0.01
      ) {
         continue;
      }
      for (let j = i + 1; j < len; j++) {
         const compareTo = noteContainer[j];
         if (
            compareTo.data.customData[PrecalculateKey.SECOND_TIME] >
            currentNote.data.customData[PrecalculateKey.SECOND_TIME] + 0.01
         ) {
            break;
         }

         if (
            compareTo.type !== ObjectContainerType.COLOR ||
            currentNote.data.color !== compareTo.data.color ||
            currentNote.data.direction === types.NoteDirection.ANY ||
            compareTo.data.direction === types.NoteDirection.ANY ||
            shortRotDistance(
               currentNote.data.customData[PrecalculateKey.ANGLE],
               compareTo.data.customData[PrecalculateKey.ANGLE],
               360,
            ) > 45
         ) {
            continue;
         }

         // if note is not within swingable path, then we can assume it is parallel note
         if (!isNoteSwingable(currentNote.data, compareTo.data, 30)) {
            result.push(currentNote.data);
            lastTime = currentNote.data.customData[PrecalculateKey.SECOND_TIME];
         }
      }
   }
   return result;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.ERROR,
            label: 'Parallel notes',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
