import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';

const name = 'Negative obstacle';
const description = 'Look for obstacle with negative value.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'obstacle',
    order: {
        input: ToolInputOrder.OBSTACLES_NEGATIVE,
        output: ToolOutputOrder.OBSTACLES_NEGATIVE,
    },
    input: {
        enabled,
        params: {},
        html: UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
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
        map.difficulty!.info._customData?._requirements?.includes('Mapping Extensions') ||
        map.difficulty!.info._customData?._requirements?.includes('Noodle Extensions')
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
        tool.output.html = printResultTime('Negative obstacle', result, map.settings.bpm);
    } else {
        tool.output.html = null;
    }
}

export default tool;
