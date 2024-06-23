import { ObjectContainerType, IObjectContainer } from '../../types/checks/container';

export function getFilteredContainer(container: IObjectContainer[], value: string) {
   switch (value) {
      case 'note':
         return container.filter((n) => n.type === ObjectContainerType.COLOR);
      case 'red':
         return container.filter((n) => n.type === ObjectContainerType.COLOR && n.data.color === 0);
      case 'blue':
         return container.filter((n) => n.type === ObjectContainerType.COLOR && n.data.color === 1);
      case 'arc':
         return container.filter((n) => n.type === ObjectContainerType.ARC);
      case 'arc0':
         return container.filter((n) => n.type === ObjectContainerType.ARC && n.data.color === 0);
      case 'arc1':
         return container.filter((n) => n.type === ObjectContainerType.ARC && n.data.color === 1);
      case 'chain':
         return container.filter((n) => n.type === ObjectContainerType.CHAIN);
      case 'chain0':
         return container.filter((n) => n.type === ObjectContainerType.CHAIN && n.data.color === 0);
      case 'chain1':
         return container.filter((n) => n.type === ObjectContainerType.CHAIN && n.data.color === 1);
      case 'bomb':
         return container.filter((n) => n.type === ObjectContainerType.BOMB);
      default:
         return container;
   }
}
