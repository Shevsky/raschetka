import { Context, SessionFlavor } from 'grammy';

type SessionAccessor<S extends object> = {
  get value(): Nullish<S>;
  set value(value: Nullish<S>);
};

export function createSessionAccessor<S extends object>(key: string, ctx: Context): SessionAccessor<S> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patched = ctx as Context & SessionFlavor<Record<string, any>>;

  return {
    get value() {
      return patched.session[key];
    },
    set value(value) {
      patched.session[key] = value;
    }
  };
}
