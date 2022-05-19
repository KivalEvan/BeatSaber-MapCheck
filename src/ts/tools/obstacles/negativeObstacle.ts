import { Tool, ToolArgs } from '../../types/mapcheck';
import UICheckbox from '../../ui/checkbox';
import { round } from '../../utils';

const name = ' Negative obstacle';

const tool: Tool = {
    name,
    description: 'Placeholder',
    type: 'obstacle',
    order: {
        input: 30,
        output: 80,
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
    run,
};

function check(map: ToolArgs) {
    const { obstacles } = map.difficulty!.data;
    if (
        map.info._customData?._requirements?.includes('Mapping Extensions') ||
        map.info._customData?._requirements?.includes('Noodle Extensions')
    ) {
        return [];
    }
    return obstacles.filter((o) => o.hasNegative()).map((o) => o.time);
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Negative obstacle [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
