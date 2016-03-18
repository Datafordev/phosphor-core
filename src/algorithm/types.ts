/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 * An object which traverses a collection of values.
 */
export
interface IIterator<T> {
  /**
   * Create an independent clone of the current iterator.
   *
   * @returns A new independent clone of the current iterator.
   *
   * #### Notes
   * The cloned iterator can be consumed independently of the current
   * iterator. In essence, it is a copy of the iterator value stream
   * which starts at the current iterator location. This can be useful
   * for iterator lookahead and stream duplication.
   *
   * Most iterators can trivially support cloning. Those which cannot
   * (a single pass iterator) should throw an exception and document
   * that they cannot be cloned.
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
   * which favors performance over purity. The ES6 method of returning
   * a `{ value, done }` pair is undesirable as it requires an object
   * allocation on each iteration, and an `isDone()` method increases
   * implementation and runtime complexity.
   */
  next(): T;
}
