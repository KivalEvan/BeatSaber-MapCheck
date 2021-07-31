import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';

export const check = (mapSettings: BeatmapSettings, mapData: beatmap.map.BeatmapSetData): void => {
    return;
};

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

export default tool;
