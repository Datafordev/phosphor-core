/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 * A range which provides single-pass iteration.
 *
 * #### Notes
 * This is the most basic type of range.
 */
export
interface IInputRange<T> {
  /**
   * Test whether the range is empty.
   *
   * @returns `true` if the range is empty, `false` otherwise.
   *
   * #### Notes
   * This is always determinate, even if `length()` is `undefined`.
   */
  isEmpty(): boolean;

  /**
   * Get the number of values remaining in the range.
   *
   * @returns The current length of the range.
   *
   * #### Notes
   * If the length is infinite, `Infinity` is returned.
   *
   * If the length is finite but unknown, `undefined` is returned.
   *
   * If the length is finite and known, a positive integer is returned.
   *
   * If the range is iterated when empty, the behavior is undefined.
   */
  length(): number;

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * This does not change the length of the range.
   *
   * If the range is empty, the behavior is undefined.
   */
  front(): T;

  /**
   * Remove and return the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * If the range length is finite, it is reduced by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  popFront(): T;

  /**
   * Remove the value at the front of the range.
   *
   * #### Notes
   * When the value is not needed, this can be a more efficient
   * operation than `popFront()`.
   *
   * If the range length is finite, it is reduced by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropFront(): void;
}


/**
 * An input range which supports multi-pass iteration.
 */
export
interface IForwardRange<T> extends IInputRange<T> {
  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   *
   * #### Notes
   * The slice can be iterated independently of this range.
   */
  slice(): IForwardRange<T>;
}


/**
 * A forward range which supports backward iteration.
 */
export
interface IBidirectionalRange<T> extends IForwardRange<T> {
  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   *
   * #### Notes
   * The slice can be iterated independently of this range.
   */
  slice(): IBidirectionalRange<T>;

  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * This does not change the length of the range.
   *
   * If the range is empty, the behavior is undefined.
   */
  back(): T;

  /**
   * Remove and return the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * If the range length is finite, it is reduced by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  popBack(): T;

  /**
   * Remove the value at the back of the range.
   *
   * #### Notes
   * When the value is not needed, this can be a more efficient
   * operation than `popBack()`.
   *
   * If the range length is finite, it is reduced by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropBack(): void;
}


/**
 * A bidirectional range which supports random access.
 */
export
interface IRandomAccessRange<T> extends IBidirectionalRange<T> {
  /**
   * Create an independent slice of the range.
   *
   * @param start - The starting index of the slice, inclusive.
   *   The default is zero. Negative indices are not supported.
   *
   * @param stop - The ending index of the slice, exclusive. The
   *   default is the length of the range. Negative indices are
   *   not supported.
   *
   * @returns A new slice of the current range.
   *
   * #### Notes
   * The slice can be iterated independently of this range.
   *
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index is out of range, the behavior is undefined.
   */
  slice(start?: number, stop?: number): IRandomAccessRange<T>;

  /**
   * Get the value at a specific index in the range.
   *
   * @param index - The index of the value of interest. Negative
   *   indices are not supported.
   *
   * @returns The value at the specified index.
   *
   * #### Notes
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  at(index: number): T;
}


/**
 * An input range which supports mutation of the underlying data.
 */
export
interface IMutableInputRange<T> extends IInputRange<T> {
  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This overwrites the current value at the front of the range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront(value: T): void;
}


/**
 * A forward range which supports mutation of the underlying data.
 */
export
interface IMutableForwardRange<T> extends IMutableInputRange<T>, IForwardRange<T> {
  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   *
   * #### Notes
   * The slice can be iterated independently of this range.
   */
  slice(): IMutableForwardRange<T>;
}


/**
 * A bidirectional range which supports mutation of the underlying data.
 */
export
interface IMutableBidirectionalRange<T> extends IMutableForwardRange<T>, IBidirectionalRange<T> {
  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   *
   * #### Notes
   * The slice can be iterated independently of this range.
   */
  slice(): IMutableBidirectionalRange<T>;

  /**
   * Set the value at the back of the range.
   *
   * @param value - The value to set at the back of the range.
   *
   * #### Notes
   * This overwrites the current value at the back of the range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setBack(value: T): void;
}


/**
 * A random access range which supports mutation of the underlying data.
 */
export
interface IMutableRandomAccessRange<T> extends IMutableBidirectionalRange<T>, IRandomAccessRange<T> {
  /**
   * Create an independent slice of the range.
   *
   * @param start - The starting index of the slice, inclusive.
   *   The default is zero. Negative indices are not supported.
   *
   * @param stop - The ending index of the slice, exclusive. The
   *   default is the length of the range. Negative indices are
   *   not supported.
   *
   * @returns A new slice of the current range.
   *
   * #### Notes
   * The slice can be iterated independently of this range.
   *
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index is out of range, the behavior is undefined.
   */
  slice(start?: number, stop?: number): IMutableRandomAccessRange<T>;

  /**
   * Set the value at a specific index in the range.
   *
   * @param index - The index of the value of interest. Negative
   *   indices are not supported.
   *
   * @param value - The value to set at the specified index.
   *
   * #### Notes
   * This overwrites the current value at the specified index.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setAt(index: number, value: T): void;
}
