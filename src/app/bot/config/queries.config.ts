import { identityProxy } from '~/utils/misc/identity-proxy';

class QueryData {
  readonly #id: string;

  constructor(id: string) {
    this.#id = id;
  }

  get regex(): RegExp {
    return new RegExp(`^${this.#id}_(.+)`);
  }

  with(value: string): string {
    return `${this.#id}_${value}`;
  }

  empty(): string {
    return `${this.#id}_null`;
  }
}

// Все callback query объявляются здесь ⬇️ чтобы их имена точно не пересекались и были уникальными
export const {
  startCheckGroupQuery,
  doneCheckGroupQuery,
  cancelCheckGroupQuery,
  cancelCheckQuery,
  seeCreatedChecksQuery,
  seeAssignedChecksQuery,
  backToMeQuery
} = identityProxy((id) => new QueryData(id));
