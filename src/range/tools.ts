/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IBidirectionalRange, IForwardRange, IInputRange, IMutableBidirectionalRange,
  IMutableForwardRange, IMutableInputRange, IMutableRandomAccessRange,
  IRandomAccessRange
} from './interfaces';


/**
 * Create a range which iterates a bidirectional range in reverse.
 *
 * @param range - The bidirectional range of interest.
 *
 * @returns A new range which iterates the given range in reverse.
 *
 * #### Notes
 * If a mutable and/or random access range is provided, the returned
 * range will also be mutable and/or random access.
 */
export
function retro<T>(range: IMutableRandomAccessRange<T>): retro.MutRandRange<T>;
export
function retro<T>(range: IRandomAccessRange<T>): retro.RandRange<T>;
export
function retro<T>(range: IMutableBidirectionalRange<T>): retro.MutRange<T>;
export
function retro<T>(range: IBidirectionalRange<T>): retro.Range<T>;
export
function retro<T>(range: any): any {
  if (typeof range.setAt === 'function') {
    return new retro.MutRandRange<T>(range);
  }
  if (typeof range.at === 'function') {
    return new retro.RandRange<T>(range);
  }
  if (typeof range.setBack === 'function') {
    return new retro.MutRange<T>(range);
  }
  return new retro.Range<T>(range);
}


/**
 * The namespace which holds the retro range implementations.
 */
export
namespace retro {
  /**
   * A bidirectional retro range.
   */
  export
  class Range<T> implements IBidirectionalRange<T> {
    /**
     * Construct a new retro range.
     *
     * @param source - The bidirectional range to iterate.
     */
    constructor(source: IBidirectionalRange<T>) {
      this.source = source;
    }

    /**
     * The original range provided during construction.
     */
    source: IBidirectionalRange<T>;

    /**
     * Test whether the range is empty.
     *
     * @returns `true` if the range is empty, `false` otherwise.
     *
     * #### Notes
     * This is equivalent to `isEmpty()` on the source range.
     */
    isEmpty(): boolean {
      return this.source.isEmpty();
    }

    /**
     * Get the value at the front of the range.
     *
     * @returns The value at the front of the range.
     *
     * #### Notes
     * This is equivalent to `back()` on the source range.
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
     * This is equivalent to `front()` on the source range.
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
     * This is equivalent to `dropBack()` on the source range.
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
     * This is equivalent to `dropFront()` on the source range.
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
    slice(): Range<T> {
      return new Range<T>(this.source.slice());
    }
  }

  /**
   * A mutable bidirectional retro range.
   */
  export
  class MutRange<T> extends Range<T> implements IMutableBidirectionalRange<T> {
    /**
     * Construct a new mutable retro range.
     *
     * @param source - The mutable bidirectional range to iterate.
     */
    constructor(source: IMutableBidirectionalRange<T>) {
      super(source);
    }

    /**
     * The source range for the retro range.
     */
    source: IMutableBidirectionalRange<T>;

    /**
     * Set the value at the front of the range.
     *
     * @param value - The value to set at the front of the range.
     *
     * #### Notes
     * This is equivalent to `setBack()` on the source range.
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
     * This is equivalent to `setFront()` on the source range.
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
    slice(): MutRange<T> {
      return new MutRange<T>(this.source.slice());
    }
  }

  /**
   * A random access retro range.
   */
  export
  class RandRange<T> extends Range<T> implements IRandomAccessRange<T> {
    /**
     * Construct a new random access retro range.
     *
     * @param source - The random access range to iterate.
     */
    constructor(source: IRandomAccessRange<T>) {
      super(source);
    }

    /**
     * The source range for the retro range.
     */
    source: IRandomAccessRange<T>;

    /**
     * Get the current length of the range.
     *
     * @returns The current length of the range.
     *
     * #### Notes
     * This is equivalent to `length()` on the source range.
     *
     * If the range is iterated when empty, the behavior is undefined.
     */
    length(): number {
      return this.source.length();
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
    slice(start?: number, stop?: number): RandRange<T> {
      let len = this.source.length();
      if (start === void 0) start = 0;
      if (stop === void 0) stop = len;
      return new RandRange<T>(this.source.slice(len - stop, len - start));
    }
  }

  /**
   * A mutable random access retro range.
   */
  export
  class MutRandRange<T> extends RandRange<T> implements IMutableRandomAccessRange<T> {
    /**
     * Construct a new mutable random access retro range.
     *
     * @param source - The mutable random access range to iterate.
     */
    constructor(source: IMutableRandomAccessRange<T>) {
      super(source);
    }

    /**
     * The source range for the retro range.
     */
    source: IMutableRandomAccessRange<T>;

    /**
     * Set the value at the front of the range.
     *
     * @param value - The value to set at the front of the range.
     *
     * #### Notes
     * This is equivalent to `setBack()` on the source range.
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
     * This is equivalent to `setFront()` on the source range.
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
    slice(start?: number, stop?: number): MutRandRange<T> {
      let len = this.source.length();
      if (start === void 0) start = 0;
      if (stop === void 0) stop = len;
      return new MutRandRange<T>(this.source.slice(len - stop, len - start));
    }
  }

  // Apply the relevant mixin methods.
  MutRandRange.prototype.setFront = MutRange.prototype.setFront;
  MutRandRange.prototype.setBack = MutRange.prototype.setBack;
}
