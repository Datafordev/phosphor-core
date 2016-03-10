/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  assert, isInt
} from '../patterns/assertion';

import {
  IInputRange, IMutableRandomAccessRange, IRandomAccessRange
} from '../range/types';


/**
 * Convert a finite input range into an array.
 *
 * @param range - The finite input range of values.
 *
 * @returns A new array of values taken from the range.
 *
 * #### Notes
 * This greedily consumes the input range until it is empty.
 */
export
function toArray<T>(range: IInputRange<T>): T[] {
  let result = new Array<T>(range.length() || 0);
  for (let i = 0; !range.isEmpty(); ++i) {
    result[i] = range.popFront();
  }
  return result;
}


/**
 * Create a range for a subset of an array.
 *
 * @param array - The array of interest.
 *
 * @param start - The starting index of the slice, inclusive.
 *   The default is zero. Negative indices are not supported.
 *
 * @param stop - The ending index of the slice, exclusive. The
 *   default is the length of the array. Negative indices are
 *   not supported.
 *
 * @returns A new range for a slice of the array.
 *
 * #### Range Validity
 * Removing a value from the array invalidates all ranges which
 * point to the removed value or any following value.
 *
 * #### Undefined Behavior
 * An out of range start or stop index is undefined.
 */
export
function slice<T>(array: T[], start = 0, stop = array.length): ArrayRange<T> {
  return new ArrayRange<T>(array, start, stop);
}


/**
 * Create a mutable range for a subset of an array.
 *
 * @param array - The array of interest.
 *
 * @param start - The starting index of the slice, inclusive.
 *   The default is zero. Negative indices are not supported.
 *
 * @param stop - The ending index of the slice, exclusive. The
 *   default is the length of the array. Negative indices are
 *   not supported.
 *
 * @returns A new mutable range for a slice of the array.
 *
 * #### Range Validity
 * Removing a value from the array invalidates all ranges which
 * point to the removed value or any following value.
 *
 * #### Undefined Behavior
 * An out of range start or stop index is undefined.
 */
export
function mutableSlice<T>(array: T[], start = 0, stop = array.length): MutableArrayRange<T> {
  return new MutableArrayRange<T>(array, start, stop);
}


/**
 * A random access range for an array.
 */
export
class ArrayRange<T> implements IRandomAccessRange<T> {
  /**
   * Construct a new array range.
   *
   * @param array - The array source for the range.
   *
   * @param start - The start index of the range, inclusive.
   *
   * @param stop - The end index of the range, exclusive.
   */
  constructor(array: T[], start: number, stop: number) {
    assert(isInt(start) && start >= 0 && start <= array.length, 'ArrayRange(): Invalid index');
    assert(isInt(stop) && stop >= start && stop <= array.length, 'ArrayRange(): Invalid index');
    this._array = array;
    this._start = start;
    this._stop = stop;
  }

  /**
   * Test whether the range is empty.
   *
   * @returns `true` if the range is empty, `false` otherwise.
   *
   * #### Complexity
   * Constant.
   */
  isEmpty(): boolean {
    return this._stop === this._start;
  }

  /**
   * Get the number of values remaining in the range.
   *
   * @returns The current length of the range.
   *
   * #### Complexity
   * Constant.
   */
  length(): number {
    return this._stop - this._start;
  }

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
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * An out of range start or stop index is undefined.
   */
  slice(start = 0, stop = this.length()): ArrayRange<T> {
    assert(isInt(start) && start >= 0 && start <= this.length(), 'ArrayRange#slice(): Invalid index');
    assert(isInt(stop) && stop >= start && stop <= this.length(), 'ArrayRange#slice(): Invalid index');
    return new ArrayRange(this._array, this._start + start, this._start + stop);
  }

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `front()` on an empty range is undefined.
   */
  front(): T {
    assert(!this.isEmpty(), 'ArrayRange#front(): Range is empty');
    return this._array[this._start];
  }

  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `back()` on an empty range is undefined.
   */
  back(): T {
    assert(!this.isEmpty(), 'ArrayRange#back(): Range is empty');
    return this._array[this._stop - 1];
  }

  /**
   * Get the value at a specific index in the range.
   *
   * @param index - The index of the value of interest. Negative
   *   indices are not supported.
   *
   * @returns The value at the specified index.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `at()` on an empty range is undefined.
   *
   * An out of range index is undefined.
   */
  at(index: number): T {
    assert(isInt(index) && index >= 0 && index < this.length(), 'ArrayRange#at(): Invalid index');
    return this._array[this._start + index];
  }

  /**
   * Remove and return the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `popFront()` on an empty range is undefined.
   */
  popFront(): T {
    assert(!this.isEmpty(), 'ArrayRange#popFront(): Range is empty');
    return this._array[this._start++];
  }

  /**
   * Remove and return the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `popBack()` on an empty range is undefined.
   */
  popBack(): T {
    assert(!this.isEmpty(), 'ArrayRange#popBack(): Range is empty');
    return this._array[--this._stop];
  }

  /**
   * Remove the value at the front of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `dropFront()` on an empty range is undefined.
   */
  dropFront(): void {
    assert(!this.isEmpty(), 'ArrayRange#dropFront(): Range is empty');
    this._start++;
  }

  /**
   * Remove the value at the back of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `dropBack()` on an empty range is undefined.
   */
  dropBack(): void {
    assert(!this.isEmpty(), 'ArrayRange#dropBack(): Range is empty');
    this._stop--;
  }

  protected _array: T[];
  protected _start: number;
  protected _stop: number;
}


/**
 * A mutable random access range for an array.
 */
export
class MutableArrayRange<T> extends ArrayRange<T> implements IMutableRandomAccessRange<T> {
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
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * An out of range start or stop index is undefined.
   */
  slice(start = 0, stop = this.length()): MutableArrayRange<T> {
    assert(isInt(start) && start >= 0 && start <= this.length(), 'MutableArrayRange#slice(): Invalid index');
    assert(isInt(stop) && stop >= start && stop <= this.length(), 'MutableArrayRange#slice(): Invalid index');
    return new MutableArrayRange(this._array, this._start + start, this._start + stop);
  }

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `setFront()` on an empty range is undefined.
   */
  setFront(value: T): void {
    assert(!this.isEmpty(), 'MutableArrayRange#setFront(): Range is empty');
    this._array[this._start] = value;
  }

  /**
   * Set the value at the back of the range.
   *
   * @param value - The value to set at the back of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `setBack()` on an empty range is undefined.
   */
  setBack(value: T): void {
    assert(!this.isEmpty(), 'MutableArrayRange#setBack(): Range is empty');
    this._array[this._stop - 1] = value;
  }

  /**
   * Set the value at a specific index in the range.
   *
   * @param index - The index of the value of interest. Negative
   *   indices are not supported.
   *
   * @param value - The value to set at the specified index.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `setAt()` on an empty range is undefined.
   *
   * An out of range index is undefined.
   */
  setAt(index: number, value: T): void {
    assert(isInt(index) && index >= 0 && index < this.length(), 'MutableArrayRange#setAt(): Invalid index');
    this._array[this._start + index] = value;
  }
}
