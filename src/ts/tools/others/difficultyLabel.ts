import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';

const tool: Tool = {
    name: 'Difficulty Label',
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 0,
        output: 0,
    },
    input: {
        enabled: true,
        params: {},
    },
    output: {
        html: null,
    },
    run: run,
};

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = mapSet._info._customData?._difficultyLabel;

    if (result && result.length > 30) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Difficulty label is too long (${result.length} characters):</b> exceeded 30 max characters by ranking criteria`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
