import { IBeatmapItem, IBeatmapSettings, Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';

const defaultPrec = [8, 6];

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
    const { prec } = <{ prec: number[] }>tool.input.params;

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
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Off-beat precision [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
