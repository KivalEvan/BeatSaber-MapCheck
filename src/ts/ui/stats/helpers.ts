import { NoteContainerType, INoteContainer } from '../../types/checks/container';

export function getFilteredContainer(container: INoteContainer[], value: string) {
   switch (value) {
      case 'note':
         return container.filter((n) => n.type === NoteContainerType.COLOR);
      case 'red':
         return container.filter((n) => n.type === NoteContainerType.COLOR && n.data.color === 0);
      case 'blue':
         return container.filter((n) => n.type === NoteContainerType.COLOR && n.data.color === 1);
      case 'arc':
         return container.filter((n) => n.type === NoteContainerType.ARC);
      case 'arc0':
         return container.filter((n) => n.type === NoteContainerType.ARC && n.data.color === 0);
      case 'arc1':
         return container.filter((n) => n.type === NoteContainerType.ARC && n.data.color === 1);
      case 'chain':
         return container.filter((n) => n.type === NoteContainerType.CHAIN);
      case 'chain0':
         return container.filter((n) => n.type === NoteContainerType.CHAIN && n.data.color === 0);
      case 'chain1':
         return container.filter((n) => n.type === NoteContainerType.CHAIN && n.data.color === 1);
      case 'bomb':
         return container.filter((n) => n.type === NoteContainerType.BOMB);
      default:
         return container;
   }
}
