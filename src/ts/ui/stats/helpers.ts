import { NoteContainer } from '../../types/beatmap/wrapper/container';

export function getFilteredContainer(container: NoteContainer[], value: string) {
   switch (value) {
      case 'note':
         return container.filter((n) => n.type === 'note');
      case 'red':
         return container.filter((n) => n.type === 'note' && n.data.color === 0);
      case 'blue':
         return container.filter((n) => n.type === 'note' && n.data.color === 1);
      case 'arc':
         return container.filter((n) => n.type === 'arc');
      case 'redArc':
         return container.filter((n) => n.type === 'arc' && n.data.color === 0);
      case 'blueArc':
         return container.filter((n) => n.type === 'arc' && n.data.color === 1);
      case 'chain':
         return container.filter((n) => n.type === 'chain');
      case 'redChain':
         return container.filter((n) => n.type === 'chain' && n.data.color === 0);
      case 'blueChain':
         return container.filter((n) => n.type === 'chain' && n.data.color === 1);
      case 'bomb':
         return container.filter((n) => n.type === 'bomb');
      default:
         return container;
   }
}
