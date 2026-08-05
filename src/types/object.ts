export type TObjectWithRequiredKeys<T, K = keyof T> = K extends keyof T
  ? { [key: string]: T }
  : { [key in keyof K]: T };

export type TObjectWithOptionalKeys<T, K> = { [key in keyof K]?: T };

export type TObject<T, K = keyof T, O extends 'optional' | 'required' = 'required'> = O extends 'optional'
  ? TObjectWithOptionalKeys<T, K>
  : TObjectWithRequiredKeys<T, K>;

export type TObjectArray<T> = Array<keyof T>;
