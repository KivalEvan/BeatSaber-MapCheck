import SavedData from '../savedData';
import UILoading from './loading';
import UIHeader from './header';
import UIInfo from './information';
import UITools from './tools';
import UIStats from './stats';

export default new (class UIReset {
    private htmlResetButton: NodeListOf<HTMLInputElement>;

    constructor() {
        this.htmlResetButton =
            document.querySelectorAll<HTMLInputElement>('.input__reset-button');
        this.htmlResetButton.forEach((elem) =>
            elem.addEventListener('click', this.resetHandler)
        );
    }

    resetHandler = () => {
        UILoading.reset();
        UIHeader.reset();
        UIInfo.reset();
        UITools.reset();
        UIStats.reset();
        SavedData.clear();
    };
})();
