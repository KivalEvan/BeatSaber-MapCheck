import { ISavedData } from './types/mapcheck/savedData';

export default new (class SavedData implements ISavedData {
    beatmapInfo;
    beatmapDifficulty = [];
    contributors = [];
    analysis = { general: { html: [] }, map: [] };
    duration = 0;

    clear() {}
})();
