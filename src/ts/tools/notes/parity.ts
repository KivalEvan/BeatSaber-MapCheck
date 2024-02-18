import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UISelect from '../../ui/helpers/select';
import Parity from '../../analyzers/parity/parity';
import swing from '../../analyzers/swing/swing';
import { NoteContainer, NoteContainerBomb } from '../../types/beatmap/wrapper/container';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { NoteColor } from '../../beatmap/shared/constants';

const name = 'Parity Check';
const description = 'Perform parity check.';
const enabled = false;

const htmlContainer = document.createElement('div');
const htmlSelectRotation = UISelect.create(
   'input__tools-parity-rotation',
   'Wrist rotation type: ',
   'div',
   '',
   { text: 'Normal', value: '90' },
   { text: 'Extended', value: '135' },
   { text: 'Squid', value: '180' },
);
const htmlSelectParityLeft = UISelect.create(
   'input__tools-parity-left',
   'Left hand parity: ',
   'div',
   '',
   { text: 'Auto', value: 'auto' },
   { text: 'Forehand', value: 'forehand' },
   { text: 'Backhand', value: 'backhand' },
);
const htmlSelectParityRight = UISelect.create(
   'input__tools-parity-right',
   'Right hand parity: ',
   'div',
   '',
   { text: 'Auto', value: 'auto' },
   { text: 'Forehand', value: 'forehand' },
   { text: 'Backhand', value: 'backhand' },
);

htmlContainer.appendChild(
   UIInput.createBlock(
      UIInput.createCheckbox(
         function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
         },
         name + ' (EXPERIMENTAL)',
         description,
         enabled,
      ),
   ),
);

const tool: Tool<{ warningThres: number; errorThres: number; allowedRot: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_PARITY,
      output: ToolOutputOrder.NOTES_PARITY,
   },
   input: {
      enabled,
      params: {
         warningThres: 90,
         errorThres: 45,
         allowedRot: 90,
      },
      html: htmlContainer,
   },
   output: {
      html: null,
   },
   run,
};

function inputSelectRotateHandler(this: HTMLInputElement) {}
function inputSelectParityHandler(this: HTMLInputElement) {}

function check(map: ToolArgs) {
   const { bpm } = map.settings;
   const { noteContainer } = map.difficulty!;
   const { warningThres, errorThres, allowedRot } = <
      {
         warningThres: number;
         errorThres: number;
         allowedRot: number;
      }
   >tool.input.params;

   const lastNote: { [key: number]: NoteContainer } = {};
   const swingNoteArray: { [key: number]: NoteContainer[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const bombContext: { [key: number]: NoteContainerBomb[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const lastBombContext: { [key: number]: NoteContainerBomb[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const swingParity: { [key: number]: Parity } = {
      [NoteColor.RED]: new Parity(noteContainer, 0, warningThres, errorThres, allowedRot),
      [NoteColor.BLUE]: new Parity(noteContainer, 1, warningThres, errorThres, allowedRot),
   };
   const parity: { warning: number[]; error: number[] } = {
      warning: [],
      error: [],
   };
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const note = noteContainer[i];
      if (note.type === 'note' && lastNote[note.data.color]) {
         if (swing.next(note, lastNote[note.data.color], bpm, swingNoteArray[note.data.color])) {
            // check previous swing parity
            const parityStatus = swingParity[note.data.color].check(
               swingNoteArray[note.data.color],
               lastBombContext[note.data.color],
            );
            switch (parityStatus) {
               case 'warning': {
                  parity.warning.push(swingNoteArray[note.data.color][0].data.time);
                  break;
               }
               case 'error': {
                  parity.error.push(swingNoteArray[note.data.color][0].data.time);
                  break;
               }
            }
            swingParity[note.data.color].next(
               swingNoteArray[note.data.color],
               lastBombContext[note.data.color],
            );
            lastBombContext[note.data.color] = bombContext[note.data.color];
            bombContext[note.data.color] = [];
            swingNoteArray[note.data.color] = [];
         }
      }
      if (note.type === 'bomb') {
         bombContext[NoteColor.RED].push(note);
         bombContext[NoteColor.BLUE].push(note);
      }
      if (note.type === 'note') {
         lastNote[note.data.color] = note;
         swingNoteArray[note.data.color].push(note);
      }
   }
   // final
   for (let i = 0; i < 2; i++) {
      if (lastNote[i]) {
         const parityStatus = swingParity[i].check(swingNoteArray[i], bombContext[i]);
         switch (parityStatus) {
            case 'warning': {
               parity.warning.push(swingNoteArray[i][0].data.time);
               break;
            }
            case 'error': {
               parity.error.push(swingNoteArray[i][0].data.time);
               break;
            }
         }
      }
   }
   return parity;
}

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(map);
   result.warning = result.warning
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      })
      .sort((a, b) => a - b);
   result.error = result.error
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      })
      .sort((a, b) => a - b);

   const htmlResult: HTMLElement[] = [];
   if (result.warning.length) {
      htmlResult.push(
         printResultTime('Parity warning', result.warning, map.settings.bpm, 'warning'),
      );
   }
   if (result.error.length) {
      htmlResult.push(printResultTime('Parity error', result.error, map.settings.bpm, 'error'));
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
