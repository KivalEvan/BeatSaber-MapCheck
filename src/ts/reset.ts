import LoadedData from './loadedData';
import UILoading from './ui/loading';
import UIHeader from './ui/header';
import UIInfo from './ui/information';
import UIChecks from './ui/checks/main';
import UISelection from './ui/selection';

const htmlResetButton: NodeListOf<HTMLInputElement> =
   document.querySelectorAll<HTMLInputElement>('.input__reset-button');

htmlResetButton.forEach((elem) => elem.addEventListener('click', reset));

export default function reset() {
   UILoading.reset();
   UIHeader.reset();
   UIInfo.reset();
   UIChecks.reset();
   UISelection.reset();
   LoadedData.clear();
}
