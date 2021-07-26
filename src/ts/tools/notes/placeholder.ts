import * as beatmap from '../../beatmap';
import { MapSettings, Tool } from '..';

const tool: Tool = {
    name: 'Placeholder',
    description: 'Placeholder',
    type: 'note',
    level: 'info',
    order: 0,
    input: {
        option: {
            enabled: false,
        },
    },
    output: {
        result: '',
        console() {
            return this.result;
        },
    },
    run: check,
};

function check(mapSettings: MapSettings, mapData: BeatmapData): number {
    return 0;
}

export default tool;
