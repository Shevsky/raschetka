import { Router, RouterState } from '@remix-run/router';
import { observable } from 'mobx';
import { Subscription } from 'rxjs';

export class ObservableQueryParam<T extends JSONValue> {
  readonly #router: Router;
  readonly #name: string;
  readonly #init: () => T;
  readonly #subscription = new Subscription();

  @observable accessor value!: T;

  constructor(router: Router, name: string, init: () => T) {
    this.#router = router;
    this.#name = name;
    this.#init = init;
  }

  init(): void {
    const defaultValue = this.#init();
    const initialValue = this.#read(this.#router.state);

    this.#subscription.add(
      this.#router.subscribe((state) => {
        this.value = this.#read(state) ?? defaultValue;
      })
    );

    if (initialValue) {
      this.set(null, true);
    } else {
      this.value = defaultValue;
    }
  }

  set(value: Nullish<T>, replace?: boolean): void {
    const params = new URLSearchParams(this.#router.state.location.search);

    if (value === null || value === undefined) {
      params.delete(this.#name);
    } else {
      params.set(this.#name, JSON.stringify(value));
    }

    void this.#router.navigate(`?${params.toString()}`, { replace });
  }

  cleanup(): void {
    this.#subscription.unsubscribe();
  }

  #read(state: RouterState): Nullish<T> {
    const params = new URLSearchParams(state.location.search);

    if (params.has(this.#name)) {
      const value = params.get(this.#name)!;

      return JSON.parse(value);
    }

    return null;
  }
}
