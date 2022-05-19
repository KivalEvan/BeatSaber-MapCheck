import SavedData from '../savedData';
import UILoading from './loading';
import UIHeader from './header';
import UIInfo from './information';
import UITools from './tools';
import UIStats from './stats';

const htmlResetButton: NodeListOf<HTMLInputElement> =
    document.querySelectorAll<HTMLInputElement>('.input__reset-button');

htmlResetButton.forEach((elem) => elem.addEventListener('click', resetHandler));

export default function resetHandler() {
    UILoading.reset();
    UIHeader.reset();
    UIInfo.reset();
    UITools.reset();
    UIStats.reset();
    SavedData.clear();
}
