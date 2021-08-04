import { clearData } from '../savedData';
import * as uiLoading from './loading';
import * as uiHeader from './header';
import * as uiInfo from './info';
import * as uiTools from './tools';
import * as uiStats from './stats';

const htmlResetButton = document.querySelectorAll<HTMLInputElement>('.input__reset-button');
htmlResetButton.forEach((elem) => elem.addEventListener('click', resetHandler));

function resetHandler(): void {
    uiLoading.reset();
    uiHeader.reset();
    uiInfo.reset();
    uiTools.reset();
    uiStats.reset();
    clearData();
}

export default resetHandler;
