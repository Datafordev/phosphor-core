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
  IBidirectionalRange, IForwardRange, IInputRange, IMutableBidirectionalRange,
  IMutableForwardRange, IMutableInputRange, IMutableRandomAccessRange,
  IRandomAccessRange
} from './types';

import {
  dropBackN, dropFrontN
} from './utils';


/**
 * Iterate a range in stepped increments.
 *
 * @param range - The range of interest.
 *
 * @param step - The distance to step on each iteration. This must be
 *   an integer greater than zero.
 *
 * @returns A range which iterates the source range step-wise.
 *
 * #### Notes
 * Each iteration of the stride range iterates the underlying source
 * range `step` number of times, subject to its limits.
 *
 * The returned range will have the capabilities of the provided range.
 * E.g. the returned range will support random access if the provided
 * range is random access.
 */
export
function stride<T>(range: IRandomAccessRange<T>, step: number): RandomStride<T>;
export
function stride<T>(range: IBidirectionalRange<T>, step: number): BidirectionalStride<T>;
export
function stride<T>(range: IForwardRange<T>, step: number): ForwardStride<T>;
export
function stride<T>(range: IInputRange<T>, step: number): InputStride<T>;
export
function stride(range: any, step: number): any {
  if (typeof range.at === 'function') {
    return new RandomStride(range, step);
  }
  if (typeof range.back === 'function') {
    return new BidirectionalStride(range, step);
  }
  if (typeof range.slice === 'function') {
    return new ForwardStride(range, step);
  }
  return new InputStride(range, step);
}


/**
 * The namespace attached to the `stride` range function.
 */
export
namespace stride {
  /**
   * Iterate a mutable range in stepped increments.
   *
   * @param range - The mutable range of interest.
   *
   * @param step - The distance to step on each iteration. This must be
   *   an integer greater than zero.
   *
   * @returns A mutable range which iterates the source range step-wise.
   *
   * #### Notes
   * Each iteration of the stride range iterates the underlying source
   * range `step` number of times, subject to its limits.
   *
   * The returned range will have the capabilities of the provided range.
   * E.g. the returned range will support random access if the provided
   * range is random access.
   */
  export
  function mutable<T>(range: IMutableRandomAccessRange<T>, step: number): MutableRandomStride<T>;
  export
  function mutable<T>(range: IMutableBidirectionalRange<T>, step: number): MutableBidirectionalStride<T>;
  export
  function mutable<T>(range: IMutableForwardRange<T>, step: number): MutableForwardStride<T>;
  export
  function mutable<T>(range: IMutableInputRange<T>, step: number): MutableInputStride<T>;
  export
  function mutable(range: any, step: number): any {
    if (typeof range.setAt === 'function') {
      return new MutableRandomStride(range, step);
    }
    if (typeof range.setBack === 'function') {
      return new MutableBidirectionalStride(range, step);
    }
    if (typeof range.slice === 'function') {
      return new MutableForwardStride(range, step);
    }
    return new MutableInputStride(range, step);
  }
}


/**
 * An input stride range.
 *
 * #### Notes
 * This iterates an input range in stepped increments.
 */
export
class InputStride<T> implements IInputRange<T> {
  /**
   * Construct a new input stride.
   *
   * @param source - The input range to be strided.
   *
   * @param step - The distance to step on each iteration.
   *   This must be an integer greater than zero.
   */
  constructor(source: IInputRange<T>, step: number) {
    assert(isInt(step) && step > 0, 'Invalid step');
    this.source = source;
    this.step = step;
  }

  /**
   * The source range for the stride range.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IInputRange<T>;

  /**
   * The distance to step on each iteration.
   *
   * #### Notes
   * This must be an integer greater than zero.
   *
   * User code can get/set this value for advanced use cases.
   */
  step: number;

  /**
   * Test whether the range is empty.
   *
   * @returns `true` if the range is empty, `false` otherwise.
   *
   * #### Notes
   * The range will be empty if the source range is empty.
   */
  isEmpty(): boolean {
    return this.source.isEmpty();
  }

  /**
   * Get the number of values remaining in the range.
   *
   * @returns The current length of the range.
   *
   * #### Notes
   * The length is `undefined` if the source length is `undefined`, and
   * infinite if the source length is infinite. Otherwise, the length
   * is the finite number of steps remaining.
   *
   * If the range is iterated when empty, the behavior is undefined.
   */
  length(): number {
    let len = this.source.length();
    if (len === void 0) return void 0;
    return Math.ceil(len / this.step);
  }

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * This returns the front of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  front(): T {
    return this.source.front();
  }

  /**
   * Remove and return the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * This fetches the value at the front of the source range, then
   * drops the front of the source range `step` number of times.
   *
   * The source range will not be modified if it becomes empty.
   */
  popFront(): T {
    let front = this.front();
    this.dropFront();
    return front;
  }

  /**
   * Remove the value at the front of the range.
   *
   * #### Notes
   * This drops the front of the source range `step` number of times.
   *
   * The source range will not be modified if it becomes empty.
   */
  dropFront(): void {
    dropFrontN(this.source, this.step);
  }
}


/**
 * A forward stride range.
 *
 * #### Notes
 * This iterates a forward range in stepped increments.
 */
export
class ForwardStride<T> extends InputStride<T> implements IForwardRange<T> {
  /**
   * Construct a new forward stride.
   *
   * @param source - The forward range to be strided.
   *
   * @param step - The distance to step on each iteration.
   */
  constructor(source: IForwardRange<T>, step: number) {
    super(source, step);
  }

  /**
   * The source range for the stride range.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IForwardRange<T>;

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): ForwardStride<T> {
    return new ForwardStride(this.source.slice(), this.step);
  }
}


/**
 * A bidirectional stride range.
 *
 * #### Notes
 * This iterates a bidirectional range in stepped increments.
 */
export
class BidirectionalStride<T> extends ForwardStride<T> implements IBidirectionalRange<T> {
  /**
   * Construct a new bidirectional stride.
   *
   * @param source - The bidirectional range to be strided.
   *
   * @param step - The distance to step on each iteration.
   */
  constructor(source: IBidirectionalRange<T>, step: number) {
    super(source, step);
  }

  /**
   * The source range for the stride range.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IBidirectionalRange<T>;

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): BidirectionalStride<T> {
    return new BidirectionalStride(this.source.slice(), this.step);
  }

  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * If the range length is indeterminate, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  back(): T {
    trimExtraValues(this.source, this.step);
    return this.source.back();
  }

  /**
   * Remove and return the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * This fetches the value at the back of the source range, then
   * drops the back of the source range `step` number of times.
   *
   * If the range length is indeterminate, the behavior is undefined.
   *
   * The source range will not be modified if it becomes empty.
   */
  popBack(): T {
    let back = this.back();
    this.dropBack();
    return back;
  }

  /**
   * Remove the value at the back of the range.
   *
   * #### Notes
   * This drops the back of the source range `step` number of times.
   *
   * The source range will not be modified if it becomes empty.
   */
  dropBack(): void {
    dropBackN(this.source, this.step);
  }
}


/**
 * A random access stride range.
 *
 * #### Notes
 * This iterates a random access range in stepped increments.
 */
export
class RandomStride<T> extends BidirectionalStride<T> implements IRandomAccessRange<T> {
  /**
   * Construct a new random access stride.
   *
   * @param source - The random access range to be strided.
   *
   * @param step - The distance to step on each iteration.
   */
  constructor(source: IRandomAccessRange<T>, step: number) {
    super(source, step);
  }

  /**
   * The source range for the stride range.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IRandomAccessRange<T>;

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
   * If the range length is indeterminate, the behavior is undefined.
   *
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index is out of range, the behavior is undefined.
   */
  slice(start = 0, stop = this.length()): RandomStride<T> {
    let begin = this.step * start;
    let end = this.step * stop;
    if (start !== stop) end -= (this.step - 1);
    return new RandomStride(this.source.slice(begin, end), this.step);
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
   * This returns the source range value at the stepped index.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  at(index: number): T {
    return this.source.at(this.step * index);
  }
}


/**
 * A mutable input stride range.
 *
 * #### Notes
 * This iterates a mutable input range in stepped increments.
 */
export
class MutableInputStride<T> extends InputStride<T> implements IMutableInputRange<T> {
  /**
   * Construct a new mutable input stride.
   *
   * @param source - The mutable input range to be strided.
   *
   * @param step - The distance to step on each iteration.
   */
  constructor(source: IMutableInputRange<T>, step: number) {
    super(source, step);
  }

  /**
   * The source range for the stride range.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IMutableInputRange<T>;

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This sets the value at the front of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront(value: T): void {
    this.source.setFront(value);
  }
}


/**
 * A mutable forward stride range.
 *
 * #### Notes
 * This iterates a mutable forward range in stepped increments.
 */
export
class MutableForwardStride<T> extends ForwardStride<T> implements IMutableForwardRange<T> {
  /**
   * Construct a new mutable forward stride.
   *
   * @param source - The mutable forward range to be strided.
   *
   * @param step - The distance to step on each iteration.
   */
  constructor(source: IMutableForwardRange<T>, step: number) {
    super(source, step);
  }

  /**
   * The source range for the stride range.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IMutableForwardRange<T>;

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): MutableForwardStride<T> {
    return new MutableForwardStride(this.source.slice(), this.step);
  }

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This sets the value at the front of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront: (value: T) => void; // mixin
}

// Apply the mixin methods.
MutableForwardStride.prototype.setFront = MutableInputStride.prototype.setFront;


/**
 * A mutable bidirectional stride range.
 *
 * #### Notes
 * This iterates a mutable bidirectional range in stepped increments.
 */
export
class MutableBidirectionalStride<T> extends BidirectionalStride<T> implements IMutableBidirectionalRange<T> {
  /**
   * Construct a new mutable bidirectional stride.
   *
   * @param source - The mutable bidirectional range to be strided.
   *
   * @param step - The distance to step on each iteration.
   */
  constructor(source: IMutableBidirectionalRange<T>, step: number) {
    super(source, step);
  }

  /**
   * The source range for the stride range.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IMutableBidirectionalRange<T>;

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): MutableBidirectionalStride<T> {
    return new MutableBidirectionalStride(this.source.slice(), this.step);
  }

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This sets the value at the front of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront: (value: T) => void; // mixin

  /**
   * Set the value at the back of the range.
   *
   * @param value - The value to set at the back of the range.
   *
   * #### Notes
   * This sets the value at the back of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setBack(value: T): void {
    trimExtraValues(this.source, this.step);
    this.source.setBack(value);
  }
}

// Apply the mixin methods.
MutableBidirectionalStride.prototype.setFront = MutableForwardStride.prototype.setFront;


/**
 * A mutable random access stride range.
 *
 * #### Notes
 * This iterates a mutable random access range in stepped increments.
 */
export
class MutableRandomStride<T> extends RandomStride<T> implements IMutableRandomAccessRange<T> {
  /**
   * Construct a new mutable random access stride.
   *
   * @param source - The mutable random access range to be strided.
   *
   * @param step - The distance to step on each iteration.
   */
  constructor(source: IMutableRandomAccessRange<T>, step: number) {
    super(source, step);
  }

  /**
   * The source range for the stride range.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IMutableRandomAccessRange<T>;

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
   * If the range length is indeterminate, the behavior is undefined.
   *
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index is out of range, the behavior is undefined.
   */
  slice(start = 0, stop = this.length()): MutableRandomStride<T> {
    let begin = this.step * start;
    let end = this.step * stop;
    if (start !== stop) end -= (this.step - 1);
    return new MutableRandomStride(this.source.slice(begin, end), this.step);
  }

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This sets the value at the front of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront: (value: T) => void; // mixin

  /**
   * Set the value at the back of the range.
   *
   * @param value - The value to set at the back of the range.
   *
   * #### Notes
   * This sets the value at the back of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setBack: (value: T) => void; // mixin

  /**
   * Set the value at a specific index in the range.
   *
   * @param index - The index of the value of interest. Negative
   *   indices are not supported.
   *
   * @param value - The value to set at the specified index.
   *
   * #### Notes
   * This sets the source range value at the stepped index.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setAt(index: number, value: T): void {
    this.source.setAt(this.step * index, value);
  }
}

// Apply the mixin methods.
MutableRandomStride.prototype.setFront = MutableBidirectionalStride.prototype.setFront;
MutableRandomStride.prototype.setBack = MutableBidirectionalStride.prototype.setBack;


/**
 * Trim any extra values from the back of the source range.
 *
 * @param source - The bidirectional range of interest.
 *
 * @param step - The step value for the stride.
 *
 * #### Notes
 * This ensures the `back()` of the source range will be an evenly
 * strided modulo of the step size.
 *
 * If the source length is indeterminate, the behavior is undefined.
 */
function trimExtraValues(source: IBidirectionalRange<any>, step: number): void {
  let len = source.length();
  let extra = len % step;
  if (extra > 0) {
    extra--;
  } else if (len > 0) {
    extra = Math.min(step, len) - 1;
  } else {
    extra = 0;
  }
  if (extra > 0) dropBackN(source, extra);
}
