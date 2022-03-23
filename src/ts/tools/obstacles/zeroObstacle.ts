import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Zero width/duration obstacle';
htmlLabelCheck.htmlFor = 'input__tools-zero-obstacle-check';
htmlInputCheck.id = 'input__tools-zero-obstacle-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Negative Obstacle',
    description: 'Placeholder',
    type: 'obstacle',
    order: {
        input: 20,
        output: 70,
    },
    input: {
        enabled: htmlInputCheck.checked,
        params: {},
        html: htmlContainer,
    },
    output: {
        html: null,
    },
    run: run,
};

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function check(map: ToolArgs) {
    const { obstacles } = map.difficulty.data;
    return obstacles.filter((o) => o.hasZero()).map((o) => o.time);
}

function run(map: ToolArgs) {
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Zero width/duration obstacle [${
            result.length
        }]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
