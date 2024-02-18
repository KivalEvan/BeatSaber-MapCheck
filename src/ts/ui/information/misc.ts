import { EnvironmentRename } from '../../beatmap/shared/environment';
import { toHhmmss } from '../../utils';
import {
   htmlTableMappers,
   htmlTableLighters,
   htmlTableEnvironmentId,
   htmlTableInformation,
   htmlTableRequirements,
   htmlTableSuggestions,
   htmlTableTimeSpend,
   htmlTableVersion,
   htmlTableWarnings,
} from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setVersion(ver?: string): void {
   if (ver == null) {
      hideTableRow(htmlTableVersion);
      return;
   }
   displayTableRow(htmlTableVersion, ver);
}

export function setMappers(mappers?: string[]): void {
   if (mappers == null || !mappers.length) {
      hideTableRow(htmlTableMappers);
      return;
   }
   let textContent = mappers.join(', ');
   displayTableRow(htmlTableMappers, textContent);
}

export function setLighters(lighters?: string[]): void {
   if (lighters == null || !lighters.length) {
      hideTableRow(htmlTableLighters);
      return;
   }
   let textContent = lighters.join(', ');
   displayTableRow(htmlTableLighters, textContent);
}

export function setEnvironmentId(env?: string): void {
   if (env == null) {
      hideTableRow(htmlTableEnvironmentId);
      return;
   }
   let textContent =
      (EnvironmentRename[env as keyof typeof EnvironmentRename] || 'Unknown') + ' Environment';
   if (!EnvironmentRename[env as keyof typeof EnvironmentRename]) {
      textContent += ` (${env})`;
   }
   displayTableRow(htmlTableEnvironmentId, textContent);
}

export function setTimeSpend(num?: number): void {
   if (num == null) {
      hideTableRow(htmlTableTimeSpend);
      return;
   }
   displayTableRow(htmlTableTimeSpend, toHhmmss(num));
}

export function setRequirements(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableRequirements);
      return;
   }
   displayTableRow(htmlTableRequirements, arr.join(', '));
}

export function setSuggestions(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableSuggestions);
      return;
   }
   displayTableRow(htmlTableSuggestions, arr.join(', '));
}

export function setInformation(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableInformation);
      return;
   }
   displayTableRow(htmlTableInformation, arr);
}

export function setWarnings(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableWarnings);
      return;
   }
   displayTableRow(htmlTableWarnings, arr);
}
