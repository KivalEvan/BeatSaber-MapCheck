export class UIInfoHTML {
   static htmlTableVersion: HTMLElement;
   static htmlTableMappers: HTMLElement;
   static htmlTableLighters: HTMLElement;
   static htmlTableEnvironmentId: HTMLElement;
   static htmlTablePlayTime: HTMLElement;
   static htmlTableTimeSpend: HTMLElement;
   static htmlTableColorScheme: HTMLElement;
   static htmlTableCustomColor: HTMLElement;
   static htmlTableRequirements: HTMLElement;
   static htmlTableSuggestions: HTMLElement;
   static htmlTableInformation: HTMLElement;
   static htmlTableWarnings: HTMLElement;
   static htmlTableBookmarks: HTMLElement;
   static htmlTableBPMChanges: HTMLElement;
   static htmlTableEnvironmentEnhancement: HTMLElement;
   static htmlTablePointDefinitions: HTMLElement;
   static htmlTableCustomEvents: HTMLElement;
   static htmlTableElements: NodeListOf<HTMLElement>;
   static htmlTableContents: NodeListOf<HTMLElement>;

   static init(): void {
      UIInfoHTML.htmlTableVersion = document.querySelector('.info__version')!;
      UIInfoHTML.htmlTableMappers = document.querySelector('.info__mappers')!;
      UIInfoHTML.htmlTableLighters = document.querySelector('.info__lighters')!;
      UIInfoHTML.htmlTableEnvironmentId = document.querySelector('.info__environmentId')!;
      UIInfoHTML.htmlTablePlayTime = document.querySelector('.info__play-time')!;
      UIInfoHTML.htmlTableTimeSpend = document.querySelector('.info__time-spend')!;
      UIInfoHTML.htmlTableColorScheme = document.querySelector('.info__color-scheme')!;
      UIInfoHTML.htmlTableCustomColor = document.querySelector('.info__custom-color')!;
      UIInfoHTML.htmlTableRequirements = document.querySelector('.info__requirements')!;
      UIInfoHTML.htmlTableSuggestions = document.querySelector('.info__suggestions')!;
      UIInfoHTML.htmlTableInformation = document.querySelector('.info__information')!;
      UIInfoHTML.htmlTableWarnings = document.querySelector('.info__warnings')!;
      UIInfoHTML.htmlTableBookmarks = document.querySelector('.info__bookmarks')!;
      UIInfoHTML.htmlTableBPMChanges = document.querySelector('.info__bpm-changes')!;
      UIInfoHTML.htmlTableEnvironmentEnhancement = document.querySelector(
         '.info__environment-enhancement',
      )!;
      UIInfoHTML.htmlTablePointDefinitions = document.querySelector('.info__point-definitions')!;
      UIInfoHTML.htmlTableCustomEvents = document.querySelector('.info__custom-events')!;
      UIInfoHTML.htmlTableElements = document.querySelectorAll('.info__table-element')!;
      UIInfoHTML.htmlTableContents = document.querySelectorAll('.info__table-contents')!;
   }
}
