import LoadedData from '../loadedData';
import UILoading from './loading';
import UIHeader from './header';
import UIInfo from './information';
import UIChecks from './checks';
import UIStats from './stats';

const htmlResetButton: NodeListOf<HTMLInputElement> =
   document.querySelectorAll<HTMLInputElement>('.input__reset-button');

htmlResetButton.forEach((elem) => elem.addEventListener('click', resetHandler));

export default function resetHandler() {
   UILoading.reset();
   UIHeader.reset();
   UIInfo.reset();
   UIChecks.reset();
   UIStats.reset();
   LoadedData.clear();
}
