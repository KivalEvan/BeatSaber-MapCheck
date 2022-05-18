import { Tool, ToolArgs } from '../../types/mapcheck';
import UICheckbox from '../../ui/checkbox';
import { round } from '../../utils';

const name = ' Zero width/duration obstacle';

const tool: Tool = {
    name,
    description: 'Placeholder',
    type: 'obstacle',
    order: {
        input: 20,
        output: 70,
    },
    input: {
        enabled: true,
        params: {},
        html: UICheckbox.create(name, name, true, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run: run,
};

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
