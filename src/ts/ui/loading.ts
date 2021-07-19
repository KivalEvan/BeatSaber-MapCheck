type LoadingStatusType = 'info' | 'download' | 'error';

const htmlLoadingBar = document.querySelectorAll<HTMLElement>('.loading__bar');
const htmlLoadingBarError = 'loading__bar--error';
const htmlLoadingBarDownload = 'loading__bar--download';
const htmlLoadingText = document.querySelectorAll<HTMLElement>('.loading__text');

export const status = (
    statusType: LoadingStatusType,
    statusString: string,
    percentage: number = 100
): void => {
    htmlLoadingText.forEach((elem) => (elem.textContent = statusString));
    htmlLoadingBar.forEach((elem) => {
        elem.style.width = `${percentage}%`;
        statusType === 'error'
            ? elem.classList.add(htmlLoadingBarError)
            : elem.classList.remove(htmlLoadingBarError);
        statusType === 'download'
            ? elem.classList.add(htmlLoadingBarDownload)
            : elem.classList.remove(htmlLoadingBarDownload);
    });
};

export const reset = (): void => {};

export default {
    status,
    reset,
};
