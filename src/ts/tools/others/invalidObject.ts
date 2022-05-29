import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';

const name = 'Invalid Object';
const description = 'Validate beatmap object to be compatible with vanilla (ignores for modded).';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'other',
    order: {
        input: ToolInputOrder.OTHERS_INVALID_OBJECT,
        output: ToolOutputOrder.OTHERS_INVALID_OBJECT,
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

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const { colorNotes, bombNotes, obstacles, basicBeatmapEvents, sliders, burstSliders } = map.difficulty.data;

    let noteResult: number[] = [];
    let obstacleResult: number[] = [];
    let bombResult: number[] = [];
    let sliderResult: number[] = [];
    let burstSliderResult: number[] = [];
    if (!map.difficulty.info._customData?._requirements?.includes('Mapping Extensions')) {
        if (map.difficulty.info._customData?._requirements?.includes('Noodle Extensions')) {
            noteResult = colorNotes.filter((n) => n.hasMappingExtensions()).map((n) => n.time);
            obstacleResult = obstacles.filter((o) => o.hasMappingExtensions()).map((o) => o.time);
            bombResult = bombNotes.filter((n) => n.hasMappingExtensions()).map((n) => n.time);
            sliderResult = sliders.filter((o) => o.hasMappingExtensions()).map((o) => o.time);
            burstSliderResult = burstSliders.filter((o) => o.hasMappingExtensions()).map((o) => o.time);
        } else {
            noteResult = colorNotes.filter((n) => !n.isValid()).map((n) => n.time);
            obstacleResult = obstacles.filter((o) => !o.isValid()).map((o) => o.time);
            bombResult = bombNotes.filter((b) => !b.isValid()).map((b) => b.time);
            sliderResult = sliders.filter((s) => !s.isValid()).map((s) => s.time);
            burstSliderResult = burstSliders.filter((bs) => !bs.isValid()).map((bs) => bs.time);
        }
    }
    const eventResult = basicBeatmapEvents.filter((e) => !e.isValid()).map((e) => e.time);

    const htmlResult: HTMLElement[] = [];
    if (noteResult.length) {
        htmlResult.push(printResultTime('Invalid note', noteResult, map.settings.bpm));
    }
    if (bombResult.length) {
        htmlResult.push(printResultTime('Invalid bomb', bombResult, map.settings.bpm));
    }
    if (sliderResult.length) {
        htmlResult.push(printResultTime('Invalid arc', sliderResult, map.settings.bpm));
    }
    if (burstSliderResult.length) {
        htmlResult.push(printResultTime('Invalid chain', burstSliderResult, map.settings.bpm));
    }
    if (obstacleResult.length) {
        htmlResult.push(printResultTime('Invalid obstacle', obstacleResult, map.settings.bpm));
    }
    if (eventResult.length) {
        htmlResult.push(printResultTime('Invalid event', eventResult, map.settings.bpm));
    }

    if (htmlResult.length) {
        const htmlContainer = document.createElement('div');
        htmlResult.forEach((h) => htmlContainer.append(h));
        tool.output.html = htmlContainer;
    } else {
        tool.output.html = null;
    }
}

export default tool;
