type LoadingStatusType = 'info' | 'download' | 'error';

const logPrefix = 'UI Loading: ';

const htmlLoadingBar = document.querySelector<HTMLElement>('.loading__bar');
const htmlLoadingBarError = 'loading__bar--error';
const htmlLoadingBarDownload = 'loading__bar--download';
const htmlLoadingText = document.querySelector<HTMLElement>('.loading__text');

if (!htmlLoadingBar || !htmlLoadingText) {
    console.error(logPrefix + 'loading component is missing part');
}

export const loadingStatus = (
    statusType: LoadingStatusType,
    statusString: string,
    percentage: number = 100
): void => {
    if (!htmlLoadingBar || !htmlLoadingText) {
        console.error(logPrefix + 'could not process, missing HTML element');
        return;
    }
    htmlLoadingText.textContent = statusString;
    htmlLoadingBar.style.width = `${percentage}%`;
    statusType === 'error'
        ? htmlLoadingBar.classList.add(htmlLoadingBarError)
        : htmlLoadingBar.classList.remove(htmlLoadingBarError);
    statusType === 'download'
        ? htmlLoadingBar.classList.add(htmlLoadingBarDownload)
        : htmlLoadingBar.classList.remove(htmlLoadingBarDownload);
};

export const loadingReset = (): void => {
    loadingStatus('info', 'No map loaded', 0);
};
