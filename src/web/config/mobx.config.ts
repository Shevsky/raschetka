import { configure } from 'mobx';

export function configureMobX(): void {
  configure({
    enforceActions: 'observed',
    useProxies: 'always'
  });
}
