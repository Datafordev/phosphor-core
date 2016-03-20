/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 * An object which produces an iterator over its values.
 *
 * #### Notes
 * Iterable objects are the target of the iteration algorithms.
 */
export
interface IIterable<T> {
  /**
   * Create an iterator over the object's values.
   *
   * @returns A new iterator which traverses the object's values.
   */
  iter(): IIterator<T>;
}


/**
 * An object which traverses a collection of values.
 *
 * #### Notes
 * For the convenience of API implementors, an iterator itself is an
 * iterable. Most concrete iterators will simply return `this` from
 * their `iter()` method.
 */
export
interface IIterator<T> extends IIterable<T> {
  /**
   * Create an independent clone of the iterator.
   *
   * @returns A new independent clone of the iterator.
   *
   * #### Notes
   * The cloned iterator can be consumed independently of the current
   * iterator. In essence, it is a copy of the iterator value stream
   * which starts at the current location. This can be useful for
   * lookahead and stream duplication.
   *
   * Most iterators can trivially support cloning. Those which cannot
   * should throw an exception and document the restriction.
   */
  clone(): IIterator<T>;

  /**
   * Get the next value in the collection.
   *
   * @returns The next value in the collection, or `undefined` if the
   *   iterator is exhausted.
   *
   * #### Notes
   * The `undefined` value is used to signal the end of iteration and
   * should therefore not be used as a value in a collection.
   *
   * The use of the `undefined` sentinel is an explicit design choice
   * which favors performance over purity. The ES6 iterator design of
   * returning a `{ value, done }` pair is suboptimal, as it requires
   * an object allocation on each iteration; and an `isDone()` method
   * increases implementation and runtime complexity.
   */
  next(): T;
}


/**
 * Create an array from an iterable of values.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @returns A new array of values from the iterable.
 */
export
function toArray<T>(iterable: IIterable<T>): T[] {
  let value: T;
  let result: T[] = [];
  let iter = iterable.iter();
  while ((value = iter.next()) !== void 0) {
    result[result.length] = value;
  }
  return result;
}


/**
 * Invoke a function for each value in an iterable.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @param fn - The callback function to invoke for each value in the
 *   iterable. The return value is ignored.
 *
 * #### Notes
 * Iteration cannot be terminated early.
 */
export
function each<T>(iterable: IIterable<T>, fn: (value: T) => void): void {
  let value: T;
  let iter = iterable.iter();
  while ((value = iter.next()) !== void 0) {
    fn(value);
  }
}


/**
 * Test whether all values in an iterable satisfy a predicate.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @param fn - The predicate function to invoke for each value in the
 *   iterable. It returns whether the value passes the test.
 *
 * @returns `true` if all values pass the test, `false` otherwise.
 *
 * #### Notes
 * Iteration terminates on the first `false` predicate result.
 */
export
function every<T>(iterable: IIterable<T>, fn: (value: T) => boolean): boolean {
  let value: T;
  let iter = iterable.iter();
  while ((value = iter.next()) !== void 0) {
    if (!fn(value)) return false;
  }
  return true;
}


/**
 * Test whether any value in an iterable satisfies a predicate.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @param fn - The predicate function to invoke for each value in the
 *   iterable. It returns whether the value passes the test.
 *
 * @returns `true` if any value passes the test, `false` otherwise.
 *
 * #### Notes
 * Iteration terminates on the first `true` predicate result.
 */
export
function some<T>(iterable: IIterable<T>, fn: (value: T) => boolean): boolean {
  let value: T;
  let iter = iterable.iter();
  while ((value = iter.next()) !== void 0) {
    if (fn(value)) return true;
  }
  return false;
}


/**
 * Filter an iterable for values which pass a test.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @param fn - The predicate function to invoke for each value in the
 *   iterable. It returns whether the value passes the test.
 *
 * @returns An iterator which yields the values which pass the test.
 */
export
function filter<T>(iterable: IIterable<T>, fn: (value: T) => boolean): FilterIterator<T> {
  return new FilterIterator<T>(iterable.iter(), fn);
}


/**
 * An iterator which yields values which pass a test.
 */
export
class FilterIterator<T> implements IIterator<T> {
  /**
   * Construct a new filter iterator.
   *
   * @param iter - The iterator of values of interest.
   *
   * @param fn - The predicate function to invoke for each value in
   *   the iterator. It returns whether the value passes the test.
   */
  constructor(iter: IIterator<T>, fn: (value: T) => boolean) {
    this.source = iter;
    this.fn = fn;
  }

  /**
   * The source iterator for the filter iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IIterator<T>;

  /**
   * The predicate function for the filter iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  fn: (value: T) => boolean;

  /**
   * Create an iterator over the object's values.
   *
   * @returns A reference to `this` iterator.
   */
  iter(): this {
    return this;
  }

  /**
   * Create an independent clone of the current iterator.
   *
   * @returns A new independent clone of the current iterator.
   *
   * #### Notes
   * The source iterator must be cloneable.
   *
   * The predicate function is shared among clones.
   */
  clone(): FilterIterator<T> {
    return new FilterIterator<T>(this.source.clone(), this.fn);
  }

  /**
   * Get the next value which passes the test.
   *
   * @returns The next value from the source iterator which passes
   *   the predicate, or `undefined` if the iterator is exhausted.
   */
  next(): T {
    let value: T;
    let fn = this.fn;
    let iter = this.source;
    while ((value = iter.next()) !== void 0) {
      if (fn(value)) return value;
    }
    return void 0;
  }
}


/**
 * Transform the values of an iterable with a mapping function.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @param fn - The mapping function to invoke for each value in the
 *   iterable. It returns the transformed value.
 *
 * @returns An iterator which yields the transformed values.
 */
export
function map<T, U>(iterable: IIterable<T>, fn: (value: T) => U): MapIterator<T, U> {
  return new MapIterator<T, U>(iterable.iter(), fn);
}


/**
 * An iterator which transforms values using a mapping function.
 */
export
class MapIterator<T, U> implements IIterator<U> {
  /**
   * Construct a new map iterator.
   *
   * @param iter - The iterator of values of interest.
   *
   * @param fn - The mapping function to invoke for each value in the
   *   iterator. It returns the transformed value.
   */
  constructor(iter: IIterator<T>, fn: (value: T) => U) {
    this.source = iter;
    this.fn = fn;
  }

  /**
   * The source iterator for the map iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IIterator<T>;

  /**
   * The mapping function for the map iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  fn: (value: T) => U;

  /**
   * Create an iterator over the object's values.
   *
   * @returns A reference to `this` iterator.
   */
  iter(): this {
    return this;
  }

  /**
   * Create an independent clone of the current iterator.
   *
   * @returns A new independent clone of the current iterator.
   *
   * #### Notes
   * The source iterator must be cloneable.
   *
   * The mapping function is shared among clones.
   */
  clone(): MapIterator<T, U> {
    return new MapIterator<T, U>(this.source.clone(), this.fn);
  }

  /**
   * Get the next mapped value from the source iterator.
   *
   * @returns The next value from the source iterator transformed
   *   by the mapper, or `undefined` if the iterator is exhausted.
   */
  next(): U {
    let value = this.source.next();
    if (value === void 0) {
      return void 0;
    }
    return this.fn.call(void 0, value);
  }
}


/**
 * Create an iterator of evenly spaced values.
 *
 * @param start - The starting value for the range, inclusive.
 *
 * @param stop - The stopping value for the range, exclusive.
 *
 * @param step - The distance between each generated value.
 *
 * @returns An iterator which generates evenly spaced values.
 *
 * #### Notes
 * In the single argument form of `range(stop)`, `start` defaults to
 * `0` and `step` defaults to `1`.
 *
 * In the two argument form of `range(start, stop)`, `step` defaults
 * to `1`.
 *
 * All values can be any real number, but `step` cannot be `0`.
 */
export
function range(start: number, stop?: number, step?: number): RangeIterator {
  if (stop === void 0) {
    stop = start;
    start = 0;
  }
  if (step === void 0) {
    step = 1;
  }
  return new RangeIterator(start, stop, step);
}


/**
 * An iterator which generates evenly spaced values.
 */
export
class RangeIterator implements IIterator<number> {
  /**
   * Get the number of steps needed to traverse a range.
   *
   * @param start - The starting value for the range, inclusive.
   *
   * @param stop - The stopping value for the range, exclusive.
   *
   * @param step - The non-zero distance between each value.
   *
   * @returns The number of steps need to traverse the range.
   */
  static stepCount(start: number, stop: number, step: number): number {
    if (start > stop && step > 0) {
      return 0;
    }
    if (start < stop && step < 0) {
      return 0;
    }
    return Math.ceil((stop - start) / step);
  }

  /**
   * Construct a new range iterator.
   *
   * @param start - The starting value for the range, inclusive.
   *
   * @param stop - The stopping value for the range, exclusive.
   *
   * @param step - The non-zero distance between each value.
   */
  constructor(start: number, stop: number, step: number) {
    if (step === 0) throw new Error('RangeIterator(): Step cannot be zero');
    this._index = 0;
    this._step = step;
    this._base = start;
    this._count = RangeIterator.stepCount(start, stop, step);
  }

  /**
   * Create an iterator over the object's values.
   *
   * @returns A reference to `this` iterator.
   */
  iter(): this {
    return this;
  }

  /**
   * Create an independent clone of the range iterator.
   *
   * @returns A new iterator starting with the current value.
   */
  clone(): RangeIterator {
    let start = this._base + this._step * this._index;
    let stop = this._base + this._step * this._count;
    return new RangeIterator(start, stop, this._step);
  }

  /**
   * Get the next value from the range.
   *
   * @returns The next value from the range, or `undefined` if the
   *   iterator is exhausted.
   */
  next(): number {
    if (this._index >= this._count) {
      return void 0;
    }
    return this._base + this._step * this._index++;
  }

  private _base: number;
  private _step: number;
  private _index: number;
  private _count: number;
}


/**
 * Attach an incremental index to an iterable.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @param start - The initial value of the index. The default is zero.
 *
 * @returns An iterator which yields `[index, value]` tuples.
 */
export
function enumerate<T>(iterable: IIterable<T>, start = 0): EnumerateIterator<T> {
  return new EnumerateIterator<T>(iterable.iter(), start);
}


/**
 * An iterator which attaches an incremental index to a source.
 */
export
class EnumerateIterator<T> implements IIterator<[number, T]> {
  /**
   * Construct a new enumerate iterator.
   *
   * @param iter - The iterator of values of interest.
   *
   * @param start - The initial value of the index.
   */
  constructor(iter: IIterator<T>, start: number) {
    this.source = iter;
    this.index = start;
  }

  /**
   * The source iterator for the enumerate iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IIterator<T>;

  /**
   * The current index for the enumerate iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  index: number;

  /**
   * Create an iterator over the object's values.
   *
   * @returns A reference to `this` iterator.
   */
  iter(): this {
    return this;
  }

  /**
   * Create an independent clone of the enumerate iterator.
   *
   * @returns A new iterator starting with the current value.
   *
   * #### Notes
   * The source iterator must be cloneable.
   */
  clone(): EnumerateIterator<T> {
    return new EnumerateIterator<T>(this.source.clone(), this.index);
  }

  /**
   * Get the next value from the enumeration.
   *
   * @returns The next value from the enumeration, or `undefined` if
   *   the iterator is exhausted.
   */
  next(): [number, T] {
    let value = this.source.next();
    if (value === void 0) {
      return void 0;
    }
    return [this.index++, value];
  }
}


/**
 * Iterate several iterables in lockstep.
 *
 * @param iterables - The iterables of interest.
 *
 * @returns An iterator which yields successive tuples of values where
 *   each value is taken in turn from the provided iterables. It will
 *   be as long as the shortest provided iterable.
 */
export
function zip<T>(...iterables: IIterable<T>[]): ZipIterator<T> {
  return new ZipIterator<T>(iterables.map(it => it.iter()));
}


/**
 * An iterator which iterates several sources in lockstep.
 */
export
class ZipIterator<T> implements IIterator<T[]> {
  /**
   * Construct a new zip iterator.
   *
   * @param iters - The iterators of interest.
   */
  constructor(iters: IIterator<T>[]) {
    this.sources = iters;
  }

  /**
   * The source iterators for the zip iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  sources: IIterator<T>[];

  /**
   * Create an iterator over the object's values.
   *
   * @returns A reference to `this` iterator.
   */
  iter(): this {
    return this;
  }

  /**
   * Create an independent clone of the zip iterator.
   *
   * @returns A new iterator starting with the current value.
   *
   * #### Notes
   * The source iterators must be cloneable.
   */
  clone(): ZipIterator<T> {
    return new ZipIterator<T>(this.sources.map(iter => iter.clone()));
  }

  /**
   * Get the next zipped value from the iterator.
   *
   * @returns The next zipped value from the iterator, or `undefined`
   *   when the first source iterator is exhausted.
   */
  next(): T[] {
    let iters = this.sources;
    let result = new Array<T>(iters.length);
    for (let i = 0, n = iters.length; i < n; ++i) {
      let value = iters[i].next();
      if (value === void 0) {
        return void 0;
      }
      result[i] = value;
    }
    return result;
  }
}


/**
 * Iterate over an iterable using a stepped increment.
 *
 * @param iterable - The iterable of values interest.
 *
 * @param step - The distance to step on each iteration. A value
 *   of less than `1` will behave the same as a value of `1`.
 *
 * @returns An iterator which traverses the iterable step-wise.
 */
export
function stride<T>(iterable: IIterable<T>, step: number): StrideIterator<T> {
  return new StrideIterator<T>(iterable.iter(), step);
}


/**
 * An iterator which traverses a source iterator step-wise.
 */
export
class StrideIterator<T> implements IIterator<T> {
  /**
   * Construct a new stride iterator.
   *
   * @param iter - The iterator of values interest.
   *
   * @param step - The distance to step on each iteration. A value
   *   of less than `1` will behave the same as a value of `1`.
   */
  constructor(iter: IIterator<T>, step: number) {
    this.source = iter;
    this.step = step;
  }

  /**
   * The source iterator for the stride iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IIterator<T>;

  /**
   * The distance to step on each iteration.
   *
   * #### Notes
   * A value of less than `1` will behave the same as a value of `1`.
   *
   * User code can get/set this value for advanced use cases.
   */
  step: number;

  /**
   * Create an iterator over the object's values.
   *
   * @returns A reference to `this` iterator.
   */
  iter(): this {
    return this;
  }

  /**
   * Create an independent clone of the stride iterator.
   *
   * @returns A new iterator starting with the current value.
   *
   * #### Notes
   * The source iterator must be cloneable.
   */
  clone(): StrideIterator<T> {
    return new StrideIterator<T>(this.source.clone(), this.step);
  }

  /**
   * Get the next stepped value from the iterator.
   *
   * @returns The next stepped value from the iterator, or `undefined`
   *   when the source iterator is exhausted.
   */
  next(): T {
    let value = this.source.next();
    if (value === void 0) {
      return void 0;
    }
    let step = this.step;
    while (--step > 0) {
      this.source.next();
    }
    return value;
  }
}
