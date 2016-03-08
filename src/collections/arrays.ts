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
 */
export
function asArray<T>(range: IInputRange<T>): T[] {
  let result = new Array<T>(range.length() || 0);
  for (let i = 0; !range.isEmpty(); ++i) {
    result[i] = range.popFront();
  }
  return result;
}


/**
 * Create a range which is a view on a subset of an array.
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
 * @returns A new range which views a slice of the array.
 *
 * #### Notes
 * If the start index is out of range, the behavior is undefined.
 *
 * If the stop index is out of range, the behavior is undefined.
 */
export
function slice<T>(array: T[], start = 0, stop = array.length): ArrayRange<T> {
  return new ArrayRange<T>(array, start, stop);
}


/**
 * Create a mutable range which is a view on a subset of an array.
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
 * @returns A new mutable range which views a slice of the array.
 *
 * #### Notes
 * If the start index is out of range, the behavior is undefined.
 *
 * If the stop index is out of range, the behavior is undefined.
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
   *
   * #### Notes
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index is out of range, the behavior is undefined.
   */
  constructor(array: T[], start: number, stop: number) {
    assert(isInt(start) && start >= 0 && start <= array.length, 'Invalid index');
    assert(isInt(stop) && stop >= start && stop <= array.length, 'Invalid index');
    this._array = array;
    this._start = start;
    this._stop = stop;
  }

  /**
   * Test whether the range is empty.
   *
   * @returns `true` if the range is empty, `false` otherwise.
   */
  isEmpty(): boolean {
    assert(this._stop >= this._start, 'Range violation');
    return this._stop === this._start;
  }

  /**
   * Get the number of values remaining in the range.
   *
   * @returns The current number of values in the range.
   *
   * #### Notes
   * If the range is iterated when empty, the behavior is undefined.
   */
  length(): number {
    assert(this._stop >= this._start, 'Range violation');
    return this._stop - this._start;
  }

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   */
  front(): T {
    assert(!this.isEmpty(), 'Range violation');
    return this._array[this._start];
  }

  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   */
  back(): T {
    assert(!this.isEmpty(), 'Range violation');
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
   * #### Notes
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  at(index: number): T {
    assert(isInt(index) && index >= 0 && index < this.length(), 'Invalid index');
    return this._array[this._start + index];
  }

  /**
   * Remove the value at the front of the range.
   *
   * #### Notes
   * This reduces the range length by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  popFront(): void {
    assert(!this.isEmpty(), 'Range violation');
    this._start++;
  }

  /**
   * Remove the value at the back of the range.
   *
   * #### Notes
   * This reduces the range length by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  popBack(): void {
    assert(!this.isEmpty(), 'Range violation');
    this._stop--;
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
   * #### Notes
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index is out of range, the behavior is undefined.
   */
  slice(start = 0, stop = this.length()): ArrayRange<T> {
    assert(isInt(start) && start >= 0 && start <= this.length(), 'Invalid index');
    assert(isInt(stop) && stop >= start && stop <= this.length(), 'Invalid index');
    return new ArrayRange(this._array, this._start + start, this._start + stop);
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
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This overwrites the current value at the front of the range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront(value: T): void {
    assert(!this.isEmpty(), 'Range violation');
    this._array[this._start] = value;
  }

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
  setBack(value: T): void {
    assert(!this.isEmpty(), 'Range violation');
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
   * #### Notes
   * This overwrites the current value at the specified index.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setAt(index: number, value: T): void {
    assert(isInt(index) && index >= 0 && index < this.length(), 'Invalid index');
    this._array[this._start + index] = value;
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
   * #### Notes
   * The returned range can be iterated independently of the current
   * range. This can be useful for lookahead and range duplication.
   *
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index is out of range, the behavior is undefined.
   */
  slice(start = 0, stop = this.length()): MutableArrayRange<T> {
    assert(isInt(start) && start >= 0 && start <= this.length(), 'Invalid index');
    assert(isInt(stop) && stop >= start && stop <= this.length(), 'Invalid index');
    return new MutableArrayRange(this._array, this._start + start, this._start + stop);
  }
}
