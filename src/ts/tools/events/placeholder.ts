import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';

const tool: Tool = {
    name: 'Placeholder',
    description: 'Placeholder',
    type: 'event',
    order: {
        input: 0,
        output: 0,
    },
    input: {
        enabled: false,
        params: {},
    },
    output: {
        result: null,
    },
    run: check,
};

function check(mapSettings: BeatmapSettings, mapData: beatmap.map.BeatmapSetData): void {
    return;
}

export default tool;
