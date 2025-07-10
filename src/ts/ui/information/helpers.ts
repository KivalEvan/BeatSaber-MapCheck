import { Settings } from '../../settings';

export function hideTableRow<T extends HTMLElement>(elem: T): void {
   const tableElem = elem.querySelector('.info__table-element');
   const tableContent = tableElem?.querySelector('.info__table-content');
   if (tableContent) {
      tableContent.innerHTML = '';
   }
   elem.classList.add('hidden');
}

let paginatedContent: {
   [key: string]: {
      content: (string | HTMLElement)[];
      html: HTMLElement;
      page: number;
      nextCb: (() => void) | null;
      prevCb: (() => void) | null;
      cb: (() => void) | null;
   };
} = {};
export function clearPaginatedTable(): void {
   paginatedContent = {};
}

function updatePageNumber(html: HTMLElement, str: string) {
   html.textContent = str;
}

function updateNextPageClosure(identifier: string, callback: () => void) {
   const item = paginatedContent[identifier];
   return function updateNextPageCallback() {
      item.page++;
      if (item.page * Settings.props.infoRowCount >= item.content.length) {
         item.page = 0;
      }
      callback();
   };
}

function updatePrevPageClosure(identifier: string, callback: () => void) {
   const item = paginatedContent[identifier];
   return function updateNextPageCallback() {
      item.page--;
      if (item.page < 0) {
         item.page = Math.ceil(item.content.length / Settings.props.infoRowCount) - 1;
      }
      callback();
   };
}

function updateTableClosure(identifier: string, htmlPage: HTMLElement) {
   const item = paginatedContent[identifier];
   return function updateTableCallback() {
      const filtered = item.content.slice(
         item.page * Settings.props.infoRowCount,
         item.page * Settings.props.infoRowCount + Settings.props.infoRowCount,
      );
      updatePageNumber(
         htmlPage,
         `${item.page + 1} / ${Math.ceil(item.content.length / Settings.props.infoRowCount)}`,
      );
      while (item.html.firstChild) {
         item.html.removeChild(item.html.firstChild);
      }
      filtered.forEach((c: string | HTMLElement) => {
         if (typeof c === 'string') {
            const temp = document.createElement('div');
            temp.textContent = c;
            item.html.appendChild(temp);
         } else {
            item.html.appendChild(c);
         }
      });
   };
}
export function displayTableRow<T extends HTMLElement>(
   elem: T,
   content: string | string[] | HTMLElement[],
   identifier = '',
): void {
   const tableElem = elem.querySelector<HTMLDivElement>('.info__table-element');
   if (!tableElem) {
      return;
   }
   const tableContent = tableElem.querySelector<HTMLDivElement>('.info__table-content');
   if (tableContent) {
      while (tableContent.firstChild) {
         tableContent.removeChild(tableContent.firstChild);
      }
      if (typeof content === 'string') {
         tableContent.textContent = content;
      } else if (identifier) {
         const paginateNext = tableElem.querySelector<HTMLButtonElement>(
            '.info__table-paginate-button--next',
         )!;
         const paginatePrev = tableElem.querySelector<HTMLButtonElement>(
            '.info__table-paginate-button--prev',
         )!;
         const paginateCount = tableElem.querySelector<HTMLDivElement>(
            '.info__table-paginate-total',
         )!;
         paginateCount.textContent = `${content.length}`;
         const paginatePage = tableElem.querySelector<HTMLDivElement>(
            '.info__table-paginate-page',
         )!;
         if (identifier in paginatedContent) {
            paginateNext.removeEventListener('click', paginatedContent[identifier].nextCb!);
            paginatePrev.removeEventListener('click', paginatedContent[identifier].prevCb!);
         }
         paginatedContent[identifier] = {
            content: content,
            html: tableContent,
            page: 0,
            nextCb: null,
            prevCb: null,
            cb: null,
         };
         paginatedContent[identifier].cb = updateTableClosure(identifier, paginatePage);
         const updateNextPageCb = updateNextPageClosure(
            identifier,
            paginatedContent[identifier].cb,
         );
         const updatePrevPageCb = updatePrevPageClosure(
            identifier,
            paginatedContent[identifier].cb,
         );
         if (paginateNext) {
            paginateNext.addEventListener('click', updateNextPageCb);
            paginatedContent[identifier].nextCb = updateNextPageCb;
         }
         if (paginatePrev) {
            paginatePrev.addEventListener('click', updatePrevPageCb);
            paginatedContent[identifier].prevCb = updatePrevPageCb;
         }
         paginatedContent[identifier].cb();
      } else {
         while (tableContent.firstChild) {
            tableContent.removeChild(tableContent.firstChild);
         }
         content.forEach((c: string | HTMLElement) => {
            if (typeof c === 'string') {
               const temp = document.createElement('div');
               temp.textContent = c;
               tableContent.appendChild(temp);
            } else {
               tableContent.appendChild(c);
            }
         });
      }
   }
   elem.classList.remove('hidden');
}

export function updateTableRow(): void {
   Object.keys(paginatedContent).forEach((k) => {
      paginatedContent[k].page = 0;
      paginatedContent[k].cb?.();
   });
}
