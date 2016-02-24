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
  IMutableRandomAccessRange, IRandomAccessRange
} from '../range/interfaces';


/**
 * A namespace which holds extended array functionality.
 */
export
namespace ArrayExt {
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
   * If the stop index out of range, the behavior is undefined.
   */
  export
  function slice<T>(array: T[], start = 0, stop = array.length): Range<T> {
    return new Range<T>(array, start, stop);
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
   * If the stop index out of range, the behavior is undefined.
   */
  export
  function mutableSlice<T>(array: T[], start = 0, stop = array.length): MutableRange<T> {
    return new MutableRange<T>(array, start, stop);
  }

  /**
   * A random access range for an array.
   */
  export
  class Range<T> implements IRandomAccessRange<T> {
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
     * If the stop index out of range, the behavior is undefined.
     */
    constructor(array: T[], start: number, stop: number) {
      if (__DEBUG__) {
        assert(isInt(start) && start >= 0 && start <= array.length, 'Invalid Index!');
        assert(isInt(stop) && stop >= start && stop <= array.length, 'Invalid Index!');
      }
      this._array = array;
      this._a = start;
      this._b = stop;
    }

    /**
     * Test whether the range is empty.
     *
     * @returns `true` if the range is empty, `false` otherwise.
     */
    isEmpty(): boolean {
      return this._a >= this._b;
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
      if (__DEBUG__) {
        assert(this._a <= this._b, 'Range Violation!');
      }
      return this._b - this._a;
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
      if (__DEBUG__) {
        assert(this._a < this._b, 'Range Violation!');
      }
      return this._array[this._a];
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
      if (__DEBUG__) {
        assert(this._a < this._b, 'Range Violation!');
      }
      return this._array[this._b - 1];
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
      if (__DEBUG__) {
        assert(isInt(index) && index >= 0 && index < this.length(), 'Invalid Index!');
      }
      return this._array[this._a + index];
    }

    /**
     * Remove the value at the front of the range.
     *
     * #### Notes
     * If the range is empty, the behavior is undefined.
     */
    dropFront(): void {
      if (__DEBUG__) {
        assert(this._a < this._b, 'Range Violation!');
      }
      this._a++;
    }

    /**
     * Remove the value at the back of the range.
     *
     * #### Notes
     * If the range is empty, the behavior is undefined.
     */
    dropBack(): void {
      if (__DEBUG__) {
        assert(this._a < this._b, 'Range Violation!');
      }
      this._b--;
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
     * If the stop index out of range, the behavior is undefined.
     */
    slice(start = 0, stop = this.length()): Range<T> {
      if (__DEBUG__) {
        assert(isInt(start) && start >= 0 && start <= this.length(), 'Invalid Index!');
        assert(isInt(stop) && stop >= start && stop <= this.length(), 'Invalid Index!');
      }
      return new Range(this._array, this._a + start, this._a + stop);
    }

    protected _array: T[];
    protected _a: number;
    protected _b: number;
  }

  /**
   * A mutable random access range for an array.
   */
  export
  class MutableRange<T> extends Range<T> implements IMutableRandomAccessRange<T> {
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
      if (__DEBUG__) {
        assert(this._a < this._b, 'Range Violation!');
      }
      this._array[this._a] = value;
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
      if (__DEBUG__) {
        assert(this._a < this._b, 'Range Violation!');
      }
      this._array[this._b - 1] = value;
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
      if (__DEBUG__) {
        assert(isInt(index) && index >= 0 && index < this.length(), 'Invalid Index!');
      }
      this._array[this._a + index] = value;
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
     * If the stop index out of range, the behavior is undefined.
     */
    slice(start = 0, stop = this.length()): MutableRange<T> {
      if (__DEBUG__) {
        assert(isInt(start) && start >= 0 && start <= this.length(), 'Invalid Index!');
        assert(isInt(stop) && stop >= start && stop <= this.length(), 'Invalid Index!');
      }
      return new MutableRange(this._array, this._a + start, this._a + stop);
    }
  }
}
