import UISelect from '../helpers/select';
import SavedData from '../../savedData';
import { round } from '../../utils';
import { IInfoData } from '../../types';
import { IBeatmapItem } from '../../types/mapcheck';
import { NoteContainer } from '../../types/beatmap/v3/container';
import { countDirection } from '../../analyzers/stats/note';

import { logPrefix, prefix } from './constants';
import { getFilteredContainer } from './helpers';

function noteAngleSelectHandler(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    const id = target.id.replace(`${prefix}table-select-angle-`, '').split('-');

    const mode = id[0];
    const diff = id[1];
    const noteContainer = SavedData.beatmapDifficulty.find(
        (set) => set.characteristic === mode && set.difficulty === diff,
    )?.noteContainer;
    if (!noteContainer) {
        console.error(logPrefix + 'note could not be found');
        return;
    }
    const filteredContainer = getFilteredContainer(noteContainer, target.value);
    const htmlTableBody = document.querySelector(`#${prefix}table-angle-${mode}-${diff}`);
    if (!htmlTableBody) {
        console.error(logPrefix + 'table could not be found');
        return;
    }
    htmlTableBody.innerHTML = noteAngleTableString(filteredContainer);
}

// TODO: use angle instead of cut direction
function noteAngleTableString(notes: NoteContainer[]): string {
    const totalNote = notes.length || 1;
    const cutOrder = [4, 0, 5, 2, 8, 3, 6, 1, 7];
    let htmlString = '';
    for (let i = 0; i < 3; i++) {
        htmlString += '<tr>';
        for (let j = 0; j < 3; j++) {
            let count = countDirection(notes, cutOrder[i * 3 + j]);
            htmlString += `<td class="${prefix}table-element">${count}<br>(${round(
                (count / totalNote) * 100,
                1,
            )}%)</td>`;
        }
        htmlString += `</tr>`;
    }
    return htmlString;
}

export function createNoteAngleTable(mapInfo: IInfoData, mapData: IBeatmapItem): HTMLTableElement {
    const htmlSelect = UISelect.create(
        `${prefix}table-select-angle-${mapData.characteristic}-${mapData.difficulty}`,
        'Note Angle: ',
        'caption',
        `${prefix}table-caption`,
        { text: 'All', value: 'all' },
        { text: 'Note Only', value: 'note' },
        { text: 'Red Note', value: 'red' },
        { text: 'Blue Note', value: 'blue' },
        { text: 'Arc Only', value: 'arc' },
        { text: 'Red Arc', value: 'redArc' },
        { text: 'Blue Arc', value: 'blueArc' },
        { text: 'Chain Only', value: 'chain' },
        { text: 'Red Chain', value: 'redChain' },
        { text: 'Blue Chain', value: 'blueChain' },
    );
    htmlSelect.querySelector<HTMLSelectElement>('select')?.addEventListener('change', noteAngleSelectHandler);

    let htmlString = `<tbody id="${prefix}table-angle-${mapData.characteristic}-${
        mapData.difficulty
    }">${noteAngleTableString(mapData.noteContainer)}</tbody>`;

    const htmlTable = document.createElement('table');
    htmlTable.className = prefix + 'table';
    htmlTable.innerHTML = htmlString;
    htmlTable.prepend(htmlSelect);

    return htmlTable;
}
