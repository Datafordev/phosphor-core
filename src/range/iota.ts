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
  IRandomAccessRange
} from './types';


/**
 * Create a range of evenly spaced values.
 *
 * @param start - The starting value for the range, inclusive.
 *
 * @param stop - The stopping value for the range, exclusive.
 *
 * @param step - The distance between each generated value.
 *
 * @returns A range which generates evenly spaced values.
 *
 * #### Notes
 * In the single argument form of `iota(stop)`, `start` defaults to
 * `0` and `step` defaults to `1`.
 *
 * In the two argument form of `iota(start, stop)`, `step` defaults
 * to `1`.
 *
 * All values can be any real number, but `step` cannot be `0`.
 */
export
function iota(stop: number): Iota;
export
function iota(start: number, stop: number): Iota;
export
function iota(start: number, stop: number, step: number): Iota;
export
function iota(a: number, b?: number, c?: number): Iota {
  let start: number;
  let stop: number;
  let step: number;
  if (b === void 0) {
    start = 0;
    stop = a;
    step = 1;
  } else if (c === void 0) {
    start = a;
    stop = b;
    step = 1;
  } else {
    start = a;
    stop = b;
    step = c;
  }
  return new Iota(start, stop, step);
}


/**
 * A range which generates evenly spaced values.
 */
export
class Iota implements IRandomAccessRange<number> {
  /**
   * Construct a new iota range.
   *
   * @param start - The starting value for the range, inclusive.
   *
   * @param stop - The stopping value for the range, exclusive.
   *
   * @param step - The non-zero distance between each value.
   */
  constructor(start: number, stop: number, step: number) {
    assert(step !== 0, 'Iota(): Step cannot be zero');
    this._start = 0;
    this._step = step;
    this._base = start;
    this._stop = getStepCount(start, stop, step);
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
   * @returns The current number of values in the range.
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
   *   The default is zero.
   *
   * @param stop - The ending index of the slice, exclusive. The
   *   default is the length of the range.
   *
   * @returns A new slice of the current range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * A non-integer, negative, or out of range index.
   *
   * A stop value less than the start value.
   */
  slice(start = 0, stop = this.length()): Iota {
    assert(isInt(start) && start >= 0 && start <= this.length(), 'Iota#slice(): Invalid index');
    assert(isInt(stop) && stop >= start && stop <= this.length(), 'Iota#slice(): Invalid index');
    let begin = this._base + this._step * (this._start + start);
    let end = this._base + this._step * (this._start + stop);
    return new Iota(begin, end, this._step);
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
   * Calling `front()` on an empty range.
   */
  front(): number {
    assert(!this.isEmpty(), 'Iota#front(): Range is empty');
    return this._base + this._step * this._start;
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
   * Calling `back()` on an empty range.
   */
  back(): number {
    assert(!this.isEmpty(), 'Iota#back(): Range is empty');
    return this._base + this._step * (this._stop - 1);
  }

  /**
   * Get the value at a specific index in the range.
   *
   * @param index - The index of the value of interest.
   *
   * @returns The value at the specified index.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `at()` on an empty range.
   *
   * A non-integer, negative, or out of range index.
   */
  at(index: number): number {
    assert(isInt(index) && index >= 0 && index < this.length(), 'Iota#at(): Invalid index');
    return this._base + this._step * (this._start + index);
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
   * Calling `popFront()` on an empty range.
   */
  popFront(): number {
    assert(!this.isEmpty(), 'Iota#popFront(): Range is empty');
    return this._base + this._step * this._start++;
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
   * Calling `popBack()` on an empty range.
   */
  popBack(): number {
    assert(!this.isEmpty(), 'Iota#popBack(): Range is empty');
    return this._base + this._step * --this._stop;
  }

  /**
   * Remove the value at the front of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `dropFront()` on an empty range.
   */
  dropFront(): void {
    assert(!this.isEmpty(), 'Iota#dropFront(): Range is empty');
    this._start++;
  }

  /**
   * Remove the value at the back of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `dropBack()` on an empty range.
   */
  dropBack(): void {
    assert(!this.isEmpty(), 'Iota#dropBack(): Range is empty');
    this._stop--;
  }

  private _step: number;
  private _base: number;
  private _start: number;
  private _stop: number;
}


/**
 * Get the number of steps needed to traverse the range.
 *
 * @param start - The starting value for the range, inclusive.
 *
 * @param stop - The stopping value for the range, exclusive.
 *
 * @param step - The non-zero distance between each value.
 *
 * @returns The number of steps need to traverse the range.
 */
function getStepCount(start: number, stop: number, step: number): number {
  if (start >= stop && step > 0) {
    return 0;
  }
  if (start <= stop && step < 0) {
    return 0;
  }
  return Math.ceil((stop - start) / step);
}
