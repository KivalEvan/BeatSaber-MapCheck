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

export type Easings = `ease${Transition}${Curve}` | 'easeStep' | 'easeLinear';
/**
 * Due to license incompatibility, these are excluded.
 */
export type EasingsExclude =
    | `ease${Transition}${'Sine' | 'Expo' | 'Circ' | 'Back' | 'Elastic' | 'Bounce'}`
    | 'easeStep';
