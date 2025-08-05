import { Router } from '@remix-run/router';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { deferProxy } from '~/utils/misc/defer-proxy';

let _router: Nullish<Router> = null;

export const router = deferProxy(() => _router);

export function configureRouter(routes: Array<RouteObject>): void {
  _router = createBrowserRouter(routes);
}
