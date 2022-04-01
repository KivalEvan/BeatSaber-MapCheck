import { UILoadingStatusType } from '../types/mapcheck/ui/loading';

const logPrefix = 'UI Loading: ';

export default new (class UILoading {
    private htmlLoadingBar: HTMLElement;
    private htmlLoadingBarError = 'loading__bar--error';
    private htmlLoadingBarDownload = 'loading__bar--download';
    private htmlLoadingText: HTMLElement;

    constructor() {
        this.htmlLoadingBar = document.querySelector('.loading__bar')!;
        this.htmlLoadingText = document.querySelector('.loading__text')!;

        if (!this.htmlLoadingBar || !this.htmlLoadingText) {
            throw new Error(logPrefix + 'loading component is missing part');
        }
    }
    status = (
        statusType: UILoadingStatusType,
        statusString: string,
        percentage: number = 100
    ): void => {
        this.htmlLoadingText.textContent = statusString;
        this.htmlLoadingBar.style.width = `${percentage}%`;
        statusType === 'error'
            ? this.htmlLoadingBar.classList.add(this.htmlLoadingBarError)
            : this.htmlLoadingBar.classList.remove(this.htmlLoadingBarError);
        statusType === 'download'
            ? this.htmlLoadingBar.classList.add(this.htmlLoadingBarDownload)
            : this.htmlLoadingBar.classList.remove(this.htmlLoadingBarDownload);
    };

    reset = (): void => {
        this.status('info', 'No map loaded', 0);
    };
})();
