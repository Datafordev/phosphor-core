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
 * This is the most basic type of all ranges.
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
   * Retrieve the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   */
  front(): T;

  /**
   * Remove the value at the front of the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   *
   * This method does not return a value. It can be more efficient for
   * a range to advance without looking up a value, and simple methods
   * are easier for the JIT to inline.
   */
  popFront(): void;
}


/**
 * A range which can save the current location.
 */
export
interface IForwardRange<T> extends IInputRange<T> {
  /**
   * Create a clone of the range at the current location.
   *
   * @returns An independent clone of the current range.
   *
   * #### Notes
   * The returned clone can be used to iterate independently of the
   * original range. This is useful for lookahead and duplication.
   */
  save(): this;
}


/**
 * A range which can be consumed from the front and back.
 */
export
interface IBidirectionalRange<T> extends IForwardRange<T> {
  /**
   * Retrieve the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   */
  back(): T;

  /**
   * Remove the value at the back of the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   *
   * This method does not return a value. It can be more efficient for
   * a range to advance without looking up a value, and simple methods
   * are easier for the JIT to inline.
   */
  popBack(): void;
}


/**
 * A range which provides random access iteration.
 */
export
interface IRandomAccessRange<T> extends IBidirectionalRange<T> {
  /**
   * Get the number of items remaining in the range.
   *
   * @returns The current number of items in the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   */
  length(): number;

  /**
   * Get the item in the range at the given index.
   *
   * @param index - The index of the item of interest.
   *
   * @returns The item at the specified index.
   *
   * #### Notes
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  at(index: number): T;
}


/**
 * An input range which supports mutation.
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
 * A forward range which supports mutation.
 */
export
interface IMutableForwardRange<T> extends IMutableInputRange<T>, IForwardRange<T> { }


/**
 * A bidirectional range which supports mutation.
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
}


/**
 * A random access range which supports mutation.
 */
export
interface IMutableRandomAccessRange<T> extends IMutableBidirectionalRange<T>, IRandomAccessRange<T> {
  /**
   * Set the value at the given index.
   *
   * @param index - The index to modify.
   *
   * @param value - The value to set at the index.
   *
   * #### Notes
   * This overwrites the current value at the given index.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setAt(index: number, value: T): void;
}
