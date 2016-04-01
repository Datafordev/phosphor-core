/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 * An object which can be the target of the iteration algorithms.
 *
 * #### Notes
 * An iterable object is either a builtin array-like object, or a user
 * defined object which implements the [[IIterable]] interface.
 */
export
type Iterable<T> = IIterable<T> | IArrayLike<T>;


/**
 * An object which can produce an iterator over its values.
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
 * An object which behaves like an array for property access.
 *
 * #### Notes
 * This interface represents the builtin JS array-like objects which
 * have a length and index-based property access.
 */
export
interface IArrayLike<T> {
  /**
   * The length of the object.
   */
  length: number;

  /**
   * The index-based property accessor.
   */
  [index: number]: T;
}


/**
 * Create an iterator for an iterable object.
 *
 * @param iterable - The iterable object of interest.
 *
 * @returns A new iterator for the iterable object.
 */
export
function iter<T>(iterable: Iterable<T>): IIterator<T> {
  let it: IIterator<T>;
  if (typeof (iterable as any).iter === 'function') {
    it = (iterable as IIterable<T>).iter();
  } else {
    it = new ArrayIterator(iterable as IArrayLike<T>, 0);
  }
  return it;
}


/**
 * Create an array from an iterable of values.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @returns A new array of values from the iterable.
 */
export
function toArray<T>(iterable: Iterable<T>): T[] {
  let value: T;
  let result: T[] = [];
  let it = iter(iterable);
  while ((value = it.next()) !== void 0) {
    result[result.length] = value;
  }
  return result;
}


/**
 * An iterator for an array-like object.
 *
 * #### Notes
 * This iterator can be used for any builtin JS array-like object.
 */
export
class ArrayIterator<T> implements IIterator<T> {
  /**
   * Construct a new array iterator.
   *
   * @param source - The array-like object of interest.
   *
   * @param start - The starting index for iteration.
   */
  constructor(source: IArrayLike<T>, start: number) {
    this.source = source;
    this.index = start;
  }

  /**
   * The source array for the array iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IArrayLike<T>;

  /**
   * The current index for the array iterator.
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
   * Create an independent clone of the current iterator.
   *
   * @returns A new independent clone of the current iterator.
   *
   * #### Notes
   * The source array is shared among clones.
   */
  clone(): ArrayIterator<T> {
    return new ArrayIterator<T>(this.source, this.index);
  }

  /**
   * Get the next value from the source array.
   *
   * @returns The next value from the source array, or `undefined`
   *   if the iterator is exhausted.
   */
  next(): T {
    if (this.index >= this.source.length) {
      return void 0;
    }
    return this.source[this.index++];
  }
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
function each<T>(iterable: Iterable<T>, fn: (value: T) => void): void {
  let value: T;
  let it = iter(iterable);
  while ((value = it.next()) !== void 0) {
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
function every<T>(iterable: Iterable<T>, fn: (value: T) => boolean): boolean {
  let value: T;
  let it = iter(iterable);
  while ((value = it.next()) !== void 0) {
    if (!fn(value)) return false;
  }
  return true;
}


/**
 * Summarize all values in an iterable using a reducer function.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @param fn - The reducer function to invoke for each value in the
 *   iterable. It returns a new accumulator value.
 *
 * @param initialValue - The initial value for the accumulator passed
 *   to the reducer function.
 *
 * @returns the accumulated value.
 *
 * #### Notes
 * The reduce function follows the conventions of the browser native function
 * Array.prototype.reduce, the following rules apply:
 *
 * If iterator is empty, initial value is required and is what reduce returns.
 *
 * If iterator is empty and no initial value is supplied,
 * reduce will throw a type error.
 *
 * If iterator contains only a single item and no initial value is supplied,
 * the reducer function is never invoked and reduce returns the sole item.
 *
 * If iterator contains only a single item and an initial value is supplied,
 * the reducer function is invoked and reduce returns that invocations's
 * return value.
 *
 * If iterator has multiple items and no initial value is supplied,
 * the first time the reducer function is called, its accumulator argument
 * is the iterator's first item and its second argument is the iterator's
 * next item.
 */
export
function reduce<T>(iterable: Iterable<T>, fn: (accumulator: T, value: T) => T, initialValue?: T): T;
export
function reduce<T, U>(iterable: IIterable<T>, fn: (accumulator: U, value: T) => U, initialValue: U): U;
export
function reduce<T>(iterable: IIterable<T>, fn: (accumulator: any, value: T) => any, initialValue?: any): any {
  let it = iter(iterable);
  let first = it.next();
  let second: T;
  let next: T;
  let accumulator = initialValue;

  // If iterator is empty, initial value is required and is what reduce returns.
  if (first === void 0 && initialValue === void 0) {
    throw new TypeError('Cannot reduce empty iterator without initial value.');
  }

  // If iterator is empty and no initial value is supplied,
  // reduce will throw a type error.
  if (first === void 0) {
    return initialValue;
  }

  // If iterator contains only a single item and no initial value is supplied,
  // the reducer function is never invoked and reduce returns the sole item.
  second = it.next();
  if (second === void 0 && initialValue === void 0) {
    return first;
  }

  // If iterator contains only a single item and an initial value is supplied,
  // the reducer function is invoked and reduce returns that invocations's
  // return value.
  if (second === void 0) {
    return fn(initialValue, first);
  }

  // If iterator has multiple items and no initial value is supplied,
  // the first time the reducer function is called, its accumulator argument
  // is the iterator's first item and its second argument is the iterator's
  // next item.
  //
  // Otherwise, because first and second have already been captured from the
  // iterator, they must be used to calculate the current accumulated value.
  if (initialValue === void 0) {
    accumulator = fn(first, second);
  } else {
    accumulator = fn(fn(initialValue, first), second);
  }

  while ((next = it.next()) !== void 0) {
    accumulator = fn(accumulator, next);
  }
  return accumulator;
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
function some<T>(iterable: Iterable<T>, fn: (value: T) => boolean): boolean {
  let value: T;
  let it = iter(iterable);
  while ((value = it.next()) !== void 0) {
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
function filter<T>(iterable: Iterable<T>, fn: (value: T) => boolean): FilterIterator<T> {
  return new FilterIterator<T>(iter(iterable), fn);
}


/**
 * An iterator which yields values which pass a test.
 */
export
class FilterIterator<T> implements IIterator<T> {
  /**
   * Construct a new filter iterator.
   *
   * @param source - The iterator of values of interest.
   *
   * @param fn - The predicate function to invoke for each value in
   *   the iterator. It returns whether the value passes the test.
   */
  constructor(source: IIterator<T>, fn: (value: T) => boolean) {
    this.source = source;
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
    let it = this.source;
    while ((value = it.next()) !== void 0) {
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
function map<T, U>(iterable: Iterable<T>, fn: (value: T) => U): MapIterator<T, U> {
  return new MapIterator<T, U>(iter(iterable), fn);
}


/**
 * An iterator which transforms values using a mapping function.
 */
export
class MapIterator<T, U> implements IIterator<U> {
  /**
   * Construct a new map iterator.
   *
   * @param source - The iterator of values of interest.
   *
   * @param fn - The mapping function to invoke for each value in the
   *   iterator. It returns the transformed value.
   */
  constructor(source: IIterator<T>, fn: (value: T) => U) {
    this.source = source;
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
 * Attach an incremental index to an iterable.
 *
 * @param iterable - The iterable of values of interest.
 *
 * @param start - The initial value of the index. The default is zero.
 *
 * @returns An iterator which yields `[index, value]` tuples.
 */
export
function enumerate<T>(iterable: Iterable<T>, start = 0): EnumerateIterator<T> {
  return new EnumerateIterator<T>(iter(iterable), start);
}


/**
 * An iterator which attaches an incremental index to a source.
 */
export
class EnumerateIterator<T> implements IIterator<[number, T]> {
  /**
   * Construct a new enumerate iterator.
   *
   * @param source - The iterator of values of interest.
   *
   * @param start - The initial value of the index.
   */
  constructor(source: IIterator<T>, start: number) {
    this.source = source;
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
function zip<T>(...iterables: Iterable<T>[]): ZipIterator<T> {
  return new ZipIterator<T>(iterables.map(iter));
}


/**
 * An iterator which iterates several sources in lockstep.
 */
export
class ZipIterator<T> implements IIterator<T[]> {
  /**
   * Construct a new zip iterator.
   *
   * @param source - The iterators of interest.
   */
  constructor(source: IIterator<T>[]) {
    this.source = source;
  }

  /**
   * The array of source iterators for the zip iterator.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IIterator<T>[];

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
    return new ZipIterator<T>(this.source.map(it => it.clone()));
  }

  /**
   * Get the next zipped value from the iterator.
   *
   * @returns The next zipped value from the iterator, or `undefined`
   *   when the first source iterator is exhausted.
   */
  next(): T[] {
    let iters = this.source;
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
 * @param iterable - The iterable of values of interest.
 *
 * @param step - The distance to step on each iteration. A value
 *   of less than `1` will behave the same as a value of `1`.
 *
 * @returns An iterator which traverses the iterable step-wise.
 */
export
function stride<T>(iterable: Iterable<T>, step: number): StrideIterator<T> {
  return new StrideIterator<T>(iter(iterable), step);
}


/**
 * An iterator which traverses a source iterator step-wise.
 */
export
class StrideIterator<T> implements IIterator<T> {
  /**
   * Construct a new stride iterator.
   *
   * @param source - The iterator of values of interest.
   *
   * @param step - The distance to step on each iteration. A value
   *   of less than `1` will behave the same as a value of `1`.
   */
  constructor(source: IIterator<T>, step: number) {
    this.source = source;
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
