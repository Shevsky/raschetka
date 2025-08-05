/** Параметры внутри path */
declare type PathParams<T extends string> = Partial<import('react-router-dom').Params<import('react-router-dom').ParamParseKey<T>>>;
