import SavedData from '../savedData';
import uiLoading from './loading';
import uiHeader from './header';
import uiInfo from './information';
import uiTools from './tools';
import uiStats from './stats';

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
        uiLoading.reset();
        uiHeader.reset();
        uiInfo.reset();
        uiTools.reset();
        uiStats.reset();
        SavedData.clear();
    };
})();
