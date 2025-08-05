import { ComponentType, ReactNode, useCallback, useEffect, useSyncExternalStore } from 'react';

type MountPoint = 'alert' | 'modal' | 'footer';

class MountPointStore {
  readonly #contents = new Map<MountPoint, Nullish<ReactNode>>();
  readonly #subscriptions = new Map<MountPoint, Set<VoidFunction>>();

  mounted = (point: MountPoint): boolean => {
    return this.#contents.has(point);
  };

  mount = (point: MountPoint, content: ReactNode): VoidFunction => {
    this.#contents.set(point, content);
    this.#trigger(point);

    return () => {
      if (this.#contents.get(point) === content) {
        this.#contents.set(point, null);
        this.#trigger(point);
      }
    };
  };

  unmount = (point: MountPoint): void => {
    this.#contents.set(point, null);
    this.#trigger(point);
  };

  subscribe = (point: MountPoint, callback: VoidFunction): VoidFunction => {
    if (!this.#subscriptions.has(point)) {
      this.#subscriptions.set(point, new Set());
    }

    this.#subscriptions.get(point)!.add(callback);

    return () => {
      this.#subscriptions.get(point)?.delete(callback);
    };
  };

  take = (point: MountPoint): Nullish<ReactNode> => {
    return this.#contents.get(point);
  };

  #trigger = (point: MountPoint): void => {
    if (this.#subscriptions.has(point)) {
      for (const callback of this.#subscriptions.get(point)!) {
        callback();
      }
    }
  };
}

const mountPointStore = new MountPointStore();

export const isMountedAtPoint = mountPointStore.mounted;
export const mountAtPoint = mountPointStore.mount;
export const unmountAtPoint = mountPointStore.unmount;

export function useMountedAtPoint(point: MountPoint): Nullish<ReactNode> {
  const subscribe = useCallback((onStoreChange: VoidFunction) => mountPointStore.subscribe(point, onStoreChange), []);
  const getSnapshot = useCallback(() => mountPointStore.take(point), [point]);

  return useSyncExternalStore(subscribe, getSnapshot);
}

export function mounted<T extends object = object>(point: MountPoint, Component: ComponentType<T>): ComponentType<T> {
  return (props: T) => {
    const content = <Component {...props} />;

    useEffect(() => {
      return mountPointStore.mount(point, content);
    }, [content]);

    return null;
  };
}
