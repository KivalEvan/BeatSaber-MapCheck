import swing from '../../analyzers/swing/swing';
import { IBeatmapItem, Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Varying swing speed';
htmlLabelCheck.htmlFor = 'input__tools-vary-swing-check';
htmlInputCheck.id = 'input__tools-vary-swing-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Varying Swing Speed',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 20,
        output: 130,
    },
    input: {
        enabled: htmlInputCheck.checked,
        params: {},
        html: htmlContainer,
    },
    output: {
        html: null,
    },
    run,
};

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function check(difficulty: IBeatmapItem) {
    const { swingAnalysis } = difficulty;
    return swingAnalysis.container
        .filter((n) => Math.abs(n.minSpeed - n.maxSpeed) > 0.002)
        .map((n) => n.time)
        .filter((x, i, ary) => {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map.difficulty);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Varying swing speed [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
