export type FilterTypeChange<T extends { [P in keyof T]: T[P] }> = {
   [P in keyof T]?: T[P] extends { [P in keyof T]: T[P] }
      ? [keyof T[P]]
      : T[P] extends Array<T[P]>
        ? never
        : T[P] | T[P][];
};

export interface IFilter<T extends { [P in keyof T]: T[P] }> {
   include?: FilterTypeChange<T>;
   exclude?: FilterTypeChange<T>;
}
