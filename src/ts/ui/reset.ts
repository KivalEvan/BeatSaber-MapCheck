import SavedData from '../savedData';
import * as uiLoading from './loading';
import * as uiHeader from './header';
import * as uiInfo from './information';
import * as uiTools from './tools';
import * as uiStats from './stats';

const htmlResetButton =
    document.querySelectorAll<HTMLInputElement>('.input__reset-button');
htmlResetButton.forEach((elem) => elem.addEventListener('click', resetHandler));

function resetHandler(): void {
    uiLoading.loadingReset();
    uiHeader.reset();
    uiInfo.reset();
    uiTools.reset();
    uiStats.reset();
    SavedData.clear();
}

export default resetHandler;
