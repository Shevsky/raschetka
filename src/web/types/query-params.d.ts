/** Параметры, которые могут быть использованы в query строке */
declare type QueryParams = { [K: string]: string | Array<string> | number | Array<number> | boolean | null | undefined | QueryParams };
