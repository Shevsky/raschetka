import { FunctionComponent, use } from 'react';
import { LoaderFunction, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

export type LoaderArgs<T extends string> = {
  request: Request;
  params: PathParams<T>;
};

export function createLoader<P extends object>(factory: (args: LoaderFunctionArgs) => Promise<P>): LoaderFunction {
  return (args: LoaderFunctionArgs) => {
    return { promise: factory(args) };
  };
}

export function withLoader<P extends object>(Component: FunctionComponent<P>): FunctionComponent {
  return () => {
    const { promise } = useLoaderData() as { promise: Promise<P> };
    const data = use(promise);

    return <Component {...data} />;
  };
}
