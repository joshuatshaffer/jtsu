import {
  iterEntries,
  iterEntriesBigint,
  iterFilter,
  iterFlatMap,
  iterMap,
} from "./tree-shakable";

class IterableWithUtils<T> implements Iterable<T> {
  constructor(private readonly values: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    return this.values[Symbol.iterator]();
  }

  /**
   * Like {@link Array.map}, but for any iterable.
   *
   * The callback function is not given indices. If you need indices,
   * use `iter(values).entries().map(([index, value]) => {...})`.
   */
  map<U>(fn: (value: T) => U) {
    return new IterableWithUtils(iterMap(this.values, fn));
  }

  /**
   * Like {@link Array.filter}, but for any iterable.
   */
  filter<S extends T>(
    predicate: (value: T) => value is S
  ): IterableWithUtils<S>;

  filter(predicate: (value: T) => boolean): IterableWithUtils<T>;

  filter(predicate: (value: T) => boolean) {
    return new IterableWithUtils(iterFilter(this.values, predicate));
  }

  /**
   * Like {@link Array.flatMap}, but for any iterable.
   */
  flatMap<U>(fn: (value: T) => U | Iterable<U>) {
    return new IterableWithUtils(iterFlatMap(this.values, fn));
  }

  /**
   * Like {@link Array.entries}, but for any iterable.
   */
  entries() {
    return new IterableWithUtils(iterEntries(this.values));
  }

  /**
   * Like {@link entries}, but uses a bigint for the index.
   */
  entriesBigint() {
    return new IterableWithUtils(iterEntriesBigint(this.values));
  }

  toArray() {
    return [...this.values];
  }
}

export function iter<T>(values: Iterable<T>) {
  return new IterableWithUtils(values);
}
