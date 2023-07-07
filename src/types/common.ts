export type Nullable<T> = T | undefined | null;

export type Reader = () => AsyncGenerator<string, void>;
