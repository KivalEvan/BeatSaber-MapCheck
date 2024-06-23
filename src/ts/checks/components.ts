import * as general from './general';
import * as notes from './notes';
import * as obstacles from './obstacles';
import * as events from './events';
import * as others from './others';
import { ITool } from '../types/checks/check';

export default class AnalysisComponent {
   private constructor() {}

   private static getNote(): ITool[] {
      return Object.keys(notes).map((key) => notes[key as keyof typeof notes]);
   };

   private static getObstacle(): ITool[] {
      return Object.keys(obstacles).map((key) => obstacles[key as keyof typeof obstacles]);
   };

   private static getEvent(): ITool[] {
      return Object.keys(events).map((key) => events[key as keyof typeof events]);
   };

   private static getOther(): ITool[] {
      return Object.keys(others).map((key) => others[key as keyof typeof others]);
   };

   static getGeneral(): ITool[] {
      return Object.keys(general).map((key) => general[key as keyof typeof general]);
   };

   static getDifficulty(): ITool[] {
      return [...this.getNote(), ...this.getObstacle(), ...this.getEvent(), ...this.getOther()];
   };

   static getAll(): ITool[] {
      return [
         ...this.getNote(),
         ...this.getObstacle(),
         ...this.getEvent(),
         ...this.getOther(),
         ...this.getGeneral(),
      ];
   };
}
