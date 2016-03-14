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
 * The returned range will have the capabilities of the source range.
 */
export
function backward<T>(range: IRandomAccessRange<T>): RandomBackward<T>;
export
function backward<T>(range: IBidirectionalRange<T>): BidirectionalBackward<T>;
export
function backward(range: any): any {
  if (typeof range.at === 'function') {
    return new RandomBackward(range);
  }
  return new BidirectionalBackward(range);
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
   * The returned range will have the capabilities of the source range.
   */
  export
  function mutable<T>(range: IMutableRandomAccessRange<T>): MutableRandomBackward<T>;
  export
  function mutable<T>(range: IMutableBidirectionalRange<T>): MutableBidirectionalBackward<T>;
  export
  function mutable(range: any): any {
    if (typeof range.setAt === 'function') {
      return new MutableRandomBackward(range);
    }
    return new MutableBidirectionalBackward(range);
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
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
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
   * #### Undefined Behavior
   * Calling `length()` on an empty range.
   */
  length(): number {
    return this.source.length();
  }

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): BidirectionalBackward<T> {
    return new BidirectionalBackward<T>(this.source.slice());
  }

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * This returns the value at the back of the source range.
   *
   * #### Undefined Behavior
   * Calling `front()` on an empty range.
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
   * This returns the value at the front of the source range.
   *
   * #### Undefined Behavior
   * Calling `back()` on an empty range.
   */
  back(): T {
    return this.source.front();
  }

  /**
   * Remove and return the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * This pops the value at the back of the source range.
   *
   * #### Undefined Behavior
   * Calling `popFront()` on an empty range.
   */
  popFront(): T {
    return this.source.popBack();
  }

  /**
   * Remove and return the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * This pops the value at the front of the source range.
   *
   * #### Undefined Behavior
   * Calling `popBack()` on an empty range.
   */
  popBack(): T {
    return this.source.popFront();
  }

  /**
   * Remove the value at the front of the range.
   *
   * #### Notes
   * This drops the value at the back of the source range.
   *
   * #### Undefined Behavior
   * Calling `dropFront()` on an empty range.
   */
  dropFront(): void {
    this.source.dropBack();
  }

  /**
   * Remove the value at the back of the range.
   *
   * #### Notes
   * This drops the value at the front of the source range.
   *
   * #### Undefined Behavior
   * Calling `dropBack()` on an empty range.
   */
  dropBack(): void {
    this.source.dropFront();
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
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IRandomAccessRange<T>;

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
   * #### Undefined Behavior
   * An indeterminate range length.
   *
   * A non-integer, negative, or out of range index.
   *
   * A stop value less than the start value.
   */
  slice(start?: number, stop?: number): RandomBackward<T> {
    let len = this.source.length();
    if (start === void 0) start = 0;
    if (stop === void 0) stop = len;
    return new RandomBackward<T>(this.source.slice(len - stop, len - start));
  }

  /**
   * Get the value at a specific index in the range.
   *
   * @param index - The index of the value of interest.
   *
   * @returns The value at the specified index.
   *
   * #### Notes
   * This returns the source range value at the reversed index.
   *
   * #### Undefined Behavior
   * An indeterminate range length.
   *
   * A non-integer, negative, or out of range index.
   *
   * A stop value less than the start value.
   */
  at(index: number): T {
    return this.source.at(this.source.length() - index - 1);
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
  slice(): MutableBidirectionalBackward<T> {
    return new MutableBidirectionalBackward<T>(this.source.slice());
  }

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This sets the value at the back of the source range.
   *
   * #### Undefined Behavior
   * Calling `setFront()` on an empty range.
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
   * #### Undefined Behavior
   * Calling `setBack()` on an empty range.
   */
  setBack(value: T): void {
    this.source.setFront(value);
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
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IMutableRandomAccessRange<T>;

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
   * #### Undefined Behavior
   * An indeterminate range length.
   *
   * A non-integer, negative, or out of range index.
   *
   * A stop value less than the start value.
   */
  slice(start?: number, stop?: number): MutableRandomBackward<T> {
    let len = this.source.length();
    if (start === void 0) start = 0;
    if (stop === void 0) stop = len;
    return new MutableRandomBackward<T>(this.source.slice(len - stop, len - start));
  }

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This sets the value at the back of the source range.
   *
   * #### Undefined Behavior
   * Calling `setFront()` on an empty range.
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
   * #### Undefined Behavior
   * Calling `setBack()` on an empty range.
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
   * #### Undefined Behavior
   * An indeterminate range length.
   *
   * A non-integer, negative, or out of range index.
   *
   * A stop value less than the start value.
   */
  setAt(index: number, value: T): void {
    this.source.setAt(this.source.length() - index - 1, value);
  }
}

// Apply the mixin methods.
MutableRandomBackward.prototype.setFront = MutableBidirectionalBackward.prototype.setFront;
MutableRandomBackward.prototype.setBack = MutableBidirectionalBackward.prototype.setBack;
