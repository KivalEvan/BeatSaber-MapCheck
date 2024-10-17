import * as types from 'bsmap/types';
import loadedData from '../../loadedData';
import { getSelectedCharacteristic, getSelectedDifficulty } from '../selection';
import { colorFrom, colorToHex, random } from 'bsmap/utils';
import { IToolOutputTime } from '../../types/checks/check';

const htmlOutSelected = document.querySelector('.checks__output-button')! as HTMLInputElement;

export function funnyInit() {}

htmlOutSelected.addEventListener('click', exportHandler);
function exportHandler() {
   const characteristic = getSelectedCharacteristic();
   const difficulty = getSelectedDifficulty();
   if (!characteristic || !difficulty) {
      return;
   }

   const analysis = loadedData.analysis?.beatmap.find(
      (set) => set.difficulty === difficulty && set.characteristic === characteristic,
   );
   if (!analysis) {
      return;
   }

   const difficultyColor: { [k in types.DifficultyName]: string } = {
      Easy: '3cb472',
      Normal: '57b0f4',
      Hard: 'ff6347',
      Expert: 'c02a43',
      ExpertPlus: '8f48db',
      'Expert+': '8f48db',
   };
   const randomColor = colorToHex(
      colorFrom(random(0, 360), random(0.6, 0.8), random(0.75, 0.875), 'hsva'),
   )
      .slice(1)
      .toUpperCase();
   const timed: types.external.IBookmarks = {
      name: 'Map Check Auto-generated',
      difficulty,
      characteristic,
      color: difficultyColor[difficulty] ?? randomColor,
      bookmarks: analysis.output
         .filter((h) => h.type === 'time')
         .flatMap((h) => {
            const x = h as IToolOutputTime;
            return x.value.map((v) => {
               return {
                  beat: v.time,
                  label: x.label,
                  text: '',
               } as types.external.IBookmarkElement;
            });
         })
         .sort((a, b) => a.beat - b.beat),
   };

   const blob = new Blob([JSON.stringify(timed, null, 2)], {
      type: 'application/json',
   });

   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `MC.${characteristic}.${difficulty}.bookmarks.dat`;
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   URL.revokeObjectURL(url);
}
