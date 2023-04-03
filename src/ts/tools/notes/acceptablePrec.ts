import {
    IBeatmapItem,
    IBeatmapSettings,
    Tool,
    ToolArgs,
    ToolInputOrder,
    ToolOutputOrder,
} from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';

const name = 'Acceptable Beat Precision';
const description = 'Validate note timing placement is within timing precision.\ni.e: 1/8 1/6 1/x';
const enabled = true;

const defaultPrec = [8, 6];

const htmlContainer = UICheckbox.create(
    name + ': ',
    description,
    enabled,
    function (this: HTMLInputElement) {
        tool.input.enabled = this.checked;
    },
);
const htmlInputPrec = document.createElement('input');

htmlInputPrec.id = 'input__tools-prec';
htmlInputPrec.className = 'input-toggle input--small';
htmlInputPrec.type = 'text';
htmlInputPrec.value = defaultPrec.join(' ');
htmlInputPrec.addEventListener('change', inputPrecHandler);

htmlContainer.appendChild(htmlInputPrec);

const tool: Tool<{ prec: number[] }> = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_ACCEPTABLE_PRECISION,
        output: ToolOutputOrder.NOTES_ACCEPTABLE_PRECISION,
    },
    input: {
        enabled,
        params: {
            prec: [...defaultPrec],
        },
        html: htmlContainer,
    },
    output: {
        html: null,
    },
    run,
};

function inputPrecHandler(this: HTMLInputElement) {
    tool.input.params.prec = this.value
        .trim()
        .split(' ')
        .map((x) => parseInt(x))
        .filter((x) => (x > 0 ? !Number.isNaN(x) : false));
    this.value = tool.input.params.prec.join(' ');
}

function check(settings: IBeatmapSettings, difficulty: IBeatmapItem) {
    const { bpm } = settings;
    const swingContainer = difficulty.swingAnalysis.container;
    // god this hurt me, but typescript sees this as number instead of number[]
    const { prec } = tool.input.params;

    return swingContainer
        .map((n) => n.time)
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

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map.settings, map.difficulty);

    if (result.length) {
        tool.output.html = printResultTime(
            'Off-beat precision',
            result,
            map.settings.bpm,
            'warning',
        );
    } else {
        tool.output.html = null;
    }
}

export default tool;
