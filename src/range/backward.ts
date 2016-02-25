/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IBidirectionalRange, IMutableBidirectionalRange, IMutableRandomAccessRange,
  IRandomAccessRange
} from './types';


/**
 * Iterate a bidirectional range in reverse order.
 *
 * @param range - The bidirectional range of interest.
 *
 * @returns A range which iterates the given range in reverse.
 *
 * #### Notes
 * If a random access range is provided, the returned range will also
 * support random access.
 */
export
function backward<T>(range: IRandomAccessRange<T>): RandomBackward<T>;
export
function backward<T>(range: IBidirectionalRange<T>): BidirectionalBackward<T>;
export
function backward<T>(range: any): any {
  if (typeof range.at === 'function') {
    return new RandomBackward<T>(range);
  }
  return new BidirectionalBackward<T>(range);
}


/**
 * The namespace attached to the `backward` range function.
 */
export
namespace backward {
  /**
   * Iterate a mutable bidirectional range in reverse order.
   *
   * @param range - The mutable bidirectional range of interest.
   *
   * @returns A mutable range which iterates the given range in reverse.
   *
   * #### Notes
   * If a random access range is provided, the returned range will also
   * support random access.
   */
  export
  function mutable<T>(range: IMutableRandomAccessRange<T>): MutableRandomBackward<T>;
  export
  function mutable<T>(range: IMutableBidirectionalRange<T>): MutableBidirectionalBackward<T>;
  export
  function mutable<T>(range: any): any {
    if (typeof range.setAt === 'function') {
      return new MutableRandomBackward<T>(range);
    }
    return new MutableBidirectionalBackward<T>(range);
  }
}


/**
 * A bidirectional backward range.
 *
 * #### Notes
 * This range iterates a bidirectional range in reverse.
 */
export
class BidirectionalBackward<T> implements IBidirectionalRange<T> {
  /**
   * Construct a new bidirectional backward range.
   *
   * @param source - The bidirectional range to iterate.
   */
  constructor(source: IBidirectionalRange<T>) {
    this.source = source;
  }

  /**
   * The source range for the backward range.
   */
  source: IBidirectionalRange<T>;

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
   * This returns the length of the source range.
   *
   * If the range is iterated when empty, the behavior is undefined.
   */
  length(): number {
    return this.source.length();
  }

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * This returns the value from the back of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  front(): T {
    return this.source.back();
  }

  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * This returns the value from the front of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  back(): T {
    return this.source.front();
  }

  /**
   * Drop the value at the front of the range.
   *
   * #### Notes
   * This drops the value at the back of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropFront(): void {
    this.source.dropBack();
  }

  /**
   * Drop the value at the back of the range.
   *
   * #### Notes
   * This drops the value at the front of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropBack(): void {
    this.source.dropFront();
  }

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): BidirectionalBackward<T> {
    return new BidirectionalBackward<T>(this.source.slice());
  }
}


/**
 * A random access backward range.
 *
 * #### Notes
 * This range iterates a random access range in reverse.
 */
export
class RandomBackward<T> extends BidirectionalBackward<T> implements IRandomAccessRange<T> {
  /**
   * Construct a new random access backward range.
   *
   * @param source - The random access range to iterate.
   */
  constructor(source: IRandomAccessRange<T>) {
    super(source);
  }

  /**
   * The source range for the backward range.
   */
  source: IRandomAccessRange<T>;

  /**
   * Get the value at a specific index in the range.
   *
   * @param index - The index of the value of interest. Negative
   *   indices are not supported.
   *
   * @returns The value at the specified index.
   *
   * #### Notes
   * This returns the source range value at the reversed index.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  at(index: number): T {
    return this.source.at(this.source.length() - index - 1);
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
  slice(start?: number, stop?: number): RandomBackward<T> {
    let len = this.source.length();
    if (start === void 0) start = 0;
    if (stop === void 0) stop = len;
    return new RandomBackward<T>(this.source.slice(len - stop, len - start));
  }
}


/**
 * A mutable bidirectional backward range.
 *
 * #### Notes
 * This range iterates a mutable bidirectional range in reverse.
 */
export
class MutableBidirectionalBackward<T> extends BidirectionalBackward<T> implements IMutableBidirectionalRange<T> {
  /**
   * Construct a new mutable backward range.
   *
   * @param source - The mutable bidirectional range to iterate.
   */
  constructor(source: IMutableBidirectionalRange<T>) {
    super(source);
  }

  /**
   * The source range for the backward range.
   */
  source: IMutableBidirectionalRange<T>;

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This sets the value at the back of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront(value: T): void {
    this.source.setBack(value);
  }

  /**
   * Set the value at the back of the range.
   *
   * @param value - The value to set at the back of the range.
   *
   * #### Notes
   * This sets the value at the front of the source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  setBack(value: T): void {
    this.source.setFront(value);
  }

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): MutableBidirectionalBackward<T> {
    return new MutableBidirectionalBackward<T>(this.source.slice());
  }
}


/**
 * A mutable random access backward range.
 *
 * #### Notes
 * This range iterates a mutable random access range in reverse.
 */
export
class MutableRandomBackward<T> extends RandomBackward<T> implements IMutableRandomAccessRange<T> {
  /**
   * Construct a new mutable random access backward range.
   *
   * @param source - The mutable random access range to iterate.
   */
  constructor(source: IMutableRandomAccessRange<T>) {
    super(source);
  }

  /**
   * The source range for the backward range.
   */
  source: IMutableRandomAccessRange<T>;

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This sets the value at the back of the source range.
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
   * This sets the value at the front of the source range.
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
   * This sets the source range value at the reversed index.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setAt(index: number, value: T): void {
    this.source.setAt(this.source.length() - index - 1, value);
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
  slice(start?: number, stop?: number): MutableRandomBackward<T> {
    let len = this.source.length();
    if (start === void 0) start = 0;
    if (stop === void 0) stop = len;
    return new MutableRandomBackward<T>(this.source.slice(len - stop, len - start));
  }
}

// Apply the mixin methods.
MutableRandomBackward.prototype.setFront = MutableBidirectionalBackward.prototype.setFront;
MutableRandomBackward.prototype.setBack = MutableBidirectionalBackward.prototype.setBack;
