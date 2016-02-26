/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IBidirectionalRange, IForwardRange, IInputRange, IRandomAccessRange
} from './types';


/**
 * Iterate a range with an attached incremental index.
 *
 * @param range - The range of interest.
 *
 * @param start - The initial value of the index. The default is zero.
 *
 * #### Notes
 * Each element produced by an enumerate range is a 2-tuple of the form
 * `[index, value]` where the index is incremented on each iteration.
 *
 * The returned range will have the capabilities of the provided range.
 * E.g. the returned range will support random access if the provided
 * ranges is random access.
 */
export
function enumerate<T>(range: IRandomAccessRange<T>, start?: number): RandomEnumerate<T>;
export
function enumerate<T>(range: IBidirectionalRange<T>, start?: number): BidirectionalEnumerate<T>;
export
function enumerate<T>(range: IForwardRange<T>, start?: number): ForwardEnumerate<T>;
export
function enumerate<T>(range: IInputRange<T>, start?: number): InputEnumerate<T>;
export
function enumerate<T>(range: any, start = 0): any {
  if (typeof range.at === 'function') {
    return new RandomEnumerate(range, start);
  }
  if (typeof range.back === 'function') {
    return new BidirectionalEnumerate(range, start);
  }
  if (typeof range.slice === 'function') {
    return new ForwardEnumerate(range, start);
  }
  return new InputEnumerate(range, start);
}


/**
 * An input enumerate range.
 *
 * #### Notes
 * This range iterates a range with an attached incremental index.
 */
export
class InputEnumerate<T> implements IInputRange<[number, T]> {
  /**
   * Construct a new input enumerate range.
   *
   * @param source - The input range to be enumerated.
   *
   * @param start - The initial value of the index.
   */
  constructor(source: IInputRange<T>, start: number) {
    this.source = source;
    this.index = start;
  }

  /**
   * The source range for the enumerate range.
   */
  source: IInputRange<T>;

  /**
   * The current index for the enumerate range.
   */
  index: number;

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
   * This returns a tuple of the enumerated `[index, value]`.
   *
   * If the range is empty, the behavior is undefined.
   */
  front(): [number, T] {
    return [this.index, this.source.front()];
  }

  /**
   * Drop the value at the front of the range.
   *
   * #### Notes
   * This drops the value at the front of the source range and
   * increments the enumerator index.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropFront(): void {
    this.source.dropFront();
    this.index++;
  }
}


/**
 * A forward enumerate range.
 *
 * #### Notes
 * This range iterates a range with an attached incremental index.
 */
export
class ForwardEnumerate<T> extends InputEnumerate<T> implements IForwardRange<[number, T]> {
  /**
   * Construct a new forward enumerate range.
   *
   * @param source - The forward range to be enumerated.
   *
   * @param start - The initial value of the enumerator.
   */
  constructor(source: IForwardRange<T>, start: number) {
    super(source, start);
  }

  /**
   * The source range for the enumerate range.
   */
  source: IForwardRange<T>;

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): ForwardEnumerate<T> {
    return new ForwardEnumerate<T>(this.source.slice(), this.index);
  }
}


/**
 * A bidirectional enumerate range.
 *
 * #### Notes
 * This range iterates a range with an attached incremental index.
 */
export
class BidirectionalEnumerate<T> extends ForwardEnumerate<T> implements IBidirectionalRange<[number, T]> {
  /**
   * Construct a new bidirectional enumerate range.
   *
   * @param source - The bidirectional range to be enumerated.
   *
   * @param start - The initial value of the enumerator.
   */
  constructor(source: IBidirectionalRange<T>, start: number) {
    super(source, start);
  }

  /**
   * The source range for the enumerate range.
   */
  source: IBidirectionalRange<T>;

  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * This returns a tuple of the enumerated `[index, value]`.
   *
   * If the range length is indeterminate, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  back(): [number, T] {
    return [this.index + this.source.length() - 1, this.source.back()];
  }

  /**
   * Drop the value at the back of the range.
   *
   * #### Notes
   * If the range is empty, the behavior is undefined.
   */
  dropBack(): void {
    this.source.dropBack();
  }

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): BidirectionalEnumerate<T> {
    return new BidirectionalEnumerate<T>(this.source.slice(), this.index);
  }
}


/**
 * A random access enumerate range.
 *
 * #### Notes
 * This range iterates a range with an attached incremental index.
 */
export
class RandomEnumerate<T> extends BidirectionalEnumerate<T> implements IRandomAccessRange<[number, T]> {
  /**
   * Construct a new random access enumerate range.
   *
   * @param source - The random access range to be enumerated.
   *
   * @param start - The initial value of the enumerator.
   */
  constructor(source: IRandomAccessRange<T>, start: number) {
    super(source, start);
  }

  /**
   * The source range for the enumerate range.
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
   * If the range length is indeterminate, the behavior is undefined.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  at(index: number): [number, T] {
    return [this.index + index, this.source.at(index)];
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
   * If the range length is indeterminate, the behavior is undefined.
   *
   * If the start index is out of range, the behavior is undefined.
   *
   * If the stop index out of range, the behavior is undefined.
   */
  slice(start = 0, stop = this.length()): RandomEnumerate<T> {
    return new RandomEnumerate<T>(this.source.slice(start, stop), this.index + start);
  }
}
