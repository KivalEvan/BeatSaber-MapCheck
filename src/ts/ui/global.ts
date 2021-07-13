type LoadingStatusType = 'info' | 'download' | 'error';

const inputToggle = document.querySelectorAll<HTMLInputElement>('.input-toggle');
const loadingBar = document.querySelectorAll<HTMLElement>('.loading__bar');
const loadingBarError = 'loading__bar--error';
const loadingBarDownload = 'loading__bar--download';
const loadingText = document.querySelectorAll<HTMLElement>('.loading__text');

export const loadingStatus = (
    statusType: LoadingStatusType,
    statusString: string,
    percentage: number
): void => {
    loadingText.forEach((elem) => (elem.textContent = statusString));
    loadingBar.forEach((elem) => {
        elem.style.width = `${percentage}%`;
        statusType === 'error'
            ? elem.classList.add(loadingBarError)
            : elem.classList.remove(loadingBarError);
        statusType === 'download'
            ? elem.classList.add(loadingBarDownload)
            : elem.classList.remove(loadingBarDownload);
    });
};

export const toggleInput = (bool: boolean) => {
    inputToggle.forEach((input) => {
        input.disabled = bool;
    });
};
