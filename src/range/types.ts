/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 * A range which provides single-use iteration.
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
   */
  isEmpty(): boolean;

  /**
   * Get the number of values remaining in the range.
   *
   * @returns The length of the range. If the length is infinite,
   *   `Infinity` is returned. If the length is finite but unknown,
   *   `undefined` is returned.
   *
   * #### Notes
   * If the range is iterated when empty, the behavior is undefined.
   */
  length(): number;

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   */
  front(): T;

  /**
   * Discard the value at the front of the range.
   *
   * #### Notes
   * This steps the front of the range to the next value.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropFront(): void;
}


/**
 * An input range which can be sliced into a new range.
 */
export
interface IForwardRange<T> extends IInputRange<T> {
  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   *
   * #### Notes
   * The returned range can be iterated independently of the current
   * range. This can be useful for lookahead and range duplication.
   */
  slice(): IForwardRange<T>;
}


/**
 * A forward range which can also be iterated from the back.
 */
export
interface IBidirectionalRange<T> extends IForwardRange<T> {
  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   */
  back(): T;

  /**
   * Discard the value at the back of the range.
   *
   * #### Notes
   * This steps the back of the range to the next value.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropBack(): void;

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   *
   * #### Notes
   * The returned range can be iterated independently of the current
   * range. This can be useful for lookahead and range duplication.
   */
  slice(): IBidirectionalRange<T>;
}


/**
 * A bidirectional range which also supports random access.
 */
export
interface IRandomAccessRange<T> extends IBidirectionalRange<T> {
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
   * The returned range can be iterated independently of the current
   * range. This can be useful for lookahead and range duplication.
   *
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index out of range, the behavior is undefined.
   */
  slice(start?: number, stop?: number): IRandomAccessRange<T>;
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
   * The returned range can be iterated independently of the current
   * range. This can be useful for lookahead and range duplication.
   */
  slice(): IMutableForwardRange<T>;
}


/**
 * A bidirectional range which supports mutation of the underlying data.
 */
export
interface IMutableBidirectionalRange<T> extends IMutableForwardRange<T>, IBidirectionalRange<T> {
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

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   *
   * #### Notes
   * The returned range can be iterated independently of the current
   * range. This can be useful for lookahead and range duplication.
   */
  slice(): IMutableBidirectionalRange<T>;
}


/**
 * A random access range which supports mutation of the underlying data.
 */
export
interface IMutableRandomAccessRange<T> extends IMutableBidirectionalRange<T>, IRandomAccessRange<T> {
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
   * The returned range can be iterated independently of the current
   * range. This can be useful for lookahead and range duplication.
   *
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index out of range, the behavior is undefined.
   */
  slice(start?: number, stop?: number): IMutableRandomAccessRange<T>;
}
