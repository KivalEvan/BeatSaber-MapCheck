import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';

const tool: Tool = {
    name: 'Placeholder',
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 0,
        output: 0,
    },
    input: {
        enabled: false,
        params: {},
    },
    output: {},
    run: check,
};

function check(mapSettings: BeatmapSettings): void {
    return;
}

export default tool;