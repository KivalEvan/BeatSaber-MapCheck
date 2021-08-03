import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import * as swing from '../swing';

const defaultPrec = [4, 3];

const htmlContainer = document.createElement('div');
const htmlInputPrec = document.createElement('input');
const htmlLabelPrec = document.createElement('label');

htmlLabelPrec.textContent = 'Acceptable beat precision: ';
htmlLabelPrec.htmlFor = 'input__tools-prec';
htmlInputPrec.id = 'input__tools-prec';
htmlInputPrec.className = 'input-toggle input--small';
htmlInputPrec.type = 'text';
htmlInputPrec.value = defaultPrec.join(' ');
htmlInputPrec.addEventListener('change', inputPrecHandler);

htmlContainer.appendChild(htmlLabelPrec);
htmlContainer.appendChild(htmlInputPrec);

const tool: Tool = {
    name: 'Acceptable Beat Precision',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 10,
        output: 110,
    },
    input: {
        enabled: true,
        params: {
            prec: [...defaultPrec],
        },
        html: htmlContainer,
    },
    output: {
        html: null,
    },
    run: run,
};

function inputPrecHandler(this: HTMLInputElement) {
    tool.input.params.prec = this.value
        .trim()
        .split(' ')
        .map((x) => parseInt(x))
        .filter((x) => (x > 0 ? !Number.isNaN(x) : false));
    this.value = tool.input.params.prec.join(' ');
}

function check(mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) {
    const { _bpm: bpm } = mapSettings;
    const { _notes: notes } = mapSet._data;
    // god this hurt me, but typescript sees this as number instead of number[]
    const { prec } = <{ prec: number[] }>tool.input.params;

    return swing
        .getEffectiveBPMSwingNote(notes, bpm)
        .map((n) => n._time)
        .filter((x, i, ary) => {
            return !i || x !== ary[i - 1];
        })
        .filter((n) => {
            if (!prec.length) {
                return false;
            }
            for (let i = 0; i < prec.length; i++) {
                if ((bpm.adjustTime(n) + 0.001) % (1 / prec[i]) < 0.01) {
                    return false;
                }
            }
            return true;
        });
}

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Off-beat precision [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
