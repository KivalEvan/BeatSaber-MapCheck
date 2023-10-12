type Curve =
   | 'Sine'
   | 'Quad'
   | 'Cubic'
   | 'Quart'
   | 'Quint'
   | 'Expo'
   | 'Circ'
   | 'Back'
   | 'Elastic'
   | 'Bounce';

type Transition = 'In' | 'Out' | 'InOut';

export type Easings = `ease${Transition}${Curve}` | 'easeLinear' | 'easeStep';

export type EasingFunction = (x: number) => number;
