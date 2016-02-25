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
} from './types';


/**
 * Iterate several ranges simultaneously.
 *
 * @param ranges - The ranges of interest.
 *
 * @returns A range which yields successive tuples of values where each
 *   value is taken in turn from the provided ranges.
 *
 * #### Notes
 * The returned range will have the capabilities of the lowest common
 * denominator of the provided ranges. E.g. the returned range will
 * support random access iff all provided ranges are random access.
 *
 * The returned range is as long as the shortest provided range.
 */
export
function zip<T>(...ranges: IRandomAccessRange<T>[]): RandomZip<T[]>;
export
function zip<T>(...ranges: IBidirectionalRange<T>[]): BidirectionalZip<T[]>;
export
function zip<T>(...ranges: IForwardRange<T>[]): ForwardZip<T[]>;
export
function zip<T>(...ranges: IInputRange<T>[]): InputZip<T[]>;
export
function zip<T>(...ranges: any[]): any {
  if (haveMethod(ranges, 'at')) {
    return new RandomZip<T>(ranges);
  }
  if (haveMethod(ranges, 'back')) {
    return new BidirectionalZip<T>(ranges);
  }
  if (haveMethod(ranges, 'slice')) {
    return new ForwardZip<T>(ranges);
  }
  return new InputZip<T>(ranges);
}


/**
 * The namespace attached to the `zip` range function.
 */
export
namespace zip {
  /**
   * Iterate several mutable ranges simultaneously.
   *
   * @param ranges - The mutable ranges of interest.
   *
   * @returns A range which yields successive tuples of values where each
   *   value is taken in turn from the provided ranges.
   *
   * #### Notes
   * Mutable zip ranges are useful for modifying two or more ranges in
   * lockstep. For example, a zip range can be used to sort one range
   * in concert with another by using a suitable comparison function.
   *
   * The returned range will have the capabilities of the lowest common
   * denominator of the provided ranges. E.g. the returned range will
   * support random access iff all provided ranges are random access.
   *
   * The returned range is as long as the shortest provided range.
   */
  export
  function mutable<T>(...ranges: IMutableRandomAccessRange<T>[]): MutableRandomZip<T[]>;
  export
  function mutable<T>(...ranges: IMutableBidirectionalRange<T>[]): MutableBidirectionalZip<T[]>;
  export
  function mutable<T>(...ranges: IMutableForwardRange<T>[]): MutableForwardZip<T[]>;
  export
  function mutable<T>(...ranges: IMutableInputRange<T>[]): MutableInputZip<T[]>;
  export
  function mutable<T>(...ranges: any[]): any {
    if (haveMethod(ranges, 'setAt')) {
      return new MutableRandomZip<T>(ranges);
    }
    if (haveMethod(ranges, 'setBack')) {
      return new MutableBidirectionalZip<T>(ranges);
    }
    if (haveMethod(ranges, 'slice')) {
      return new MutableForwardZip<T>(ranges);
    }
    return new MutableInputZip<T>(ranges);
  }
}


/**
 * An input zip range.
 *
 * #### Notes
 * This range iterates several input ranges in lockstep.
 */
export
class InputZip<T> implements IInputRange<T[]> {
  /**
   * Construct a new input zip range.
   *
   * @param sources - The input ranges to be zipped.
   */
  constructor(sources: IInputRange<T>[]) {
    this.sources = sources;
  }

  /**
   * The source ranges for the zip range.
   */
  sources: IInputRange<T>[];

  /**
   * Test whether the range is empty.
   *
   * @returns `true` if the range is empty, `false` otherwise.
   *
   * #### Notes
   * This range will be empty when any of the source ranges are empty.
   */
  isEmpty(): boolean {
    if (this.sources.length === 0) return true;
    return this.sources.some(src => src.isEmpty());
  }

  /**
   * Get the current length of the range.
   *
   * @returns The current length of the range.
   *
   * #### Notes
   * This is the minimum of the lengths of the source ranges.
   *
   * If the length of any source range is `undefined`, the computed
   * length will also be `undefined`.
   *
   * If the range is iterated when empty, the behavior is undefined.
   */
  length(): number {
    if (this.sources.length === 0) return 0;
    let n = this.sources.reduce((v, s) => Math.min(v, s.length()), Infinity);
    return n === n ? n : void 0; // `n` is `NaN` when a length is `undefined`
  }

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * This returns a tuple of the front value of each source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  front(): T[] {
    return this.sources.map(src => src.front());
  }

  /**
   * Drop the value at the front of the range.
   *
   * #### Notes
   * This will drop the value at the front of each source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropFront(): void {
    this.sources.forEach(src => { src.dropFront(); });
  }
}


/**
 * A forward zip range.
 *
 * #### Notes
 * This range iterates several forward ranges in lockstep.
 */
export
class ForwardZip<T> extends InputZip<T> implements IForwardRange<T[]> {
  /**
   * Construct a new forward zip range.
   *
   * @param sources - The forward ranges to be zipped.
   */
  constructor(sources: IForwardRange<T>[]) {
    super(sources);
  }

  /**
   * The source ranges for the zip range.
   */
  sources: IForwardRange<T>[];

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): ForwardZip<T> {
    return new ForwardZip<T>(this.sources.map(src => src.slice()));
  }
}


/**
 * A bidirectional zip range.
 *
 * #### Notes
 * This range iterates several bidirectional ranges in lockstep.
 */
export
class BidirectionalZip<T> extends ForwardZip<T> implements IBidirectionalRange<T[]> {
  /**
   * Construct a new bidirectional zip range.
   *
   * @param sources - The bidirectional ranges to be zipped.
   */
  constructor(sources: IBidirectionalRange<T>[]) {
    super(sources);
  }

  /**
   * The source ranges for the zip range.
   */
  sources: IBidirectionalRange<T>[];

  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * This returns a tuple of the back value of each source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  back(): T[] {
    return this.sources.map(src => src.back());
  }

  /**
   * Drop the value at the back of the range.
   *
   * #### Notes
   * This will drop the value at the back of each source range.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropBack(): void {
    this.sources.forEach(src => { src.dropBack(); });
  }

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): BidirectionalZip<T> {
    return new BidirectionalZip<T>(this.sources.map(src => src.slice()));
  }
}


/**
 * A random access zip range.
 *
 * #### Notes
 * This range iterates several random access ranges in lockstep.
 */
export
class RandomZip<T> extends BidirectionalZip<T> implements IRandomAccessRange<T[]> {
  /**
   * Construct a new random access zip range.
   *
   * @param sources - The random access ranges to be zipped.
   */
  constructor(sources: IRandomAccessRange<T>[]) {
    super(sources);
  }

  /**
   * The source ranges for the zip range.
   */
  sources: IRandomAccessRange<T>[];

  /**
   * Get the value at a specific index in the range.
   *
   * @param index - The index of the value of interest. Negative
   *   indices are not supported.
   *
   * @returns The value at the specified index.
   *
   * #### Notes
   * This returns a tuple of the indexed value of each source range.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  at(index: number): T[] {
    return this.sources.map(src => src.at(index));
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
  slice(start = 0, stop = this.length()): RandomZip<T> {
    return new RandomZip<T>(this.sources.map(src => src.slice(start, stop)));
  }
}


/**
 * A mutable input zip range.
 *
 * #### Notes
 * This range iterates several mutable input ranges in lockstep.
 */
export
class MutableInputZip<T> extends InputZip<T> implements IMutableInputRange<T[]> {
  /**
   * Construct a new mutable input zip range.
   *
   * @param sources - The mutable input ranges to be zipped.
   */
  constructor(sources: IMutableInputRange<T>[]) {
    super(sources);
  }

  /**
   * The source ranges for the zip range.
   */
  sources: IMutableInputRange<T>[];

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This unpacks the tuple and sets each value at the front of the
   * respective source range.
   *
   * If the length of the tuple does not match the number of source
   * ranges, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront(value: T[]): void {
    this.sources.forEach((src, i) => { src.setFront(value[i]); });
  }
}


/**
 * A mutable forward zip range.
 *
 * #### Notes
 * This range iterates several mutable forward ranges in lockstep.
 */
export
class MutableForwardZip<T> extends ForwardZip<T> implements IMutableForwardRange<T[]> {
  /**
   * Construct a new mutable forward zip range.
   *
   * @param sources - The mutable forward ranges to be zipped.
   */
  constructor(sources: IMutableForwardRange<T>[]) {
    super(sources);
  }

  /**
   * The source ranges for the zip range.
   */
  sources: IMutableForwardRange<T>[];

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This unpacks the tuple and sets each value at the front of the
   * respective source range.
   *
   * If the length of the tuple does not match the number of source
   * ranges, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront: (value: T[]) => void; // mixin

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): MutableForwardZip<T> {
    return new MutableForwardZip<T>(this.sources.map(src => src.slice()));
  }
}

// Apply the mixin methods.
MutableForwardZip.prototype.setFront = MutableInputZip.prototype.setFront;


/**
 * A mutable bidirectional zip range.
 *
 * #### Notes
 * This range iterates several mutable bidirectional ranges in lockstep.
 */
export
class MutableBidirectionalZip<T> extends BidirectionalZip<T> implements IMutableBidirectionalRange<T[]> {
  /**
   * Construct a new mutable bidirectional zip range.
   *
   * @param sources - The mutable bidirectional ranges to be zipped.
   */
  constructor(sources: IMutableBidirectionalRange<T>[]) {
    super(sources);
  }

  /**
   * The source ranges for the zip range.
   */
  sources: IMutableBidirectionalRange<T>[];

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This unpacks the tuple and sets each value at the front of the
   * respective source range.
   *
   * If the length of the tuple does not match the number of source
   * ranges, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront: (value: T[]) => void; // mixin

  /**
   * Set the value at the back of the range.
   *
   * @param value - The value to set at the back of the range.
   *
   * #### Notes
   * This unpacks the tuple and sets each value at the back of the
   * respective source range.
   *
   * If the length of the tuple does not match the number of source
   * ranges, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setBack(value: T[]): void {
    this.sources.forEach((src, i) => { src.setBack(value[i]); });
  }

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): MutableBidirectionalZip<T> {
    return new MutableBidirectionalZip<T>(this.sources.map(src => src.slice()));
  }
}

// Apply the mixin methods.
MutableBidirectionalZip.prototype.setFront = MutableForwardZip.prototype.setFront;


/**
 * A mutable random access zip range.
 *
 * #### Notes
 * This range iterates several mutable random access ranges in lockstep.
 */
export
class MutableRandomZip<T> extends RandomZip<T> implements IMutableRandomAccessRange<T[]> {
  /**
   * Construct a new mutable random access zip range.
   *
   * @param sources - The mutable random access ranges to be zipped.
   */
  constructor(sources: IMutableRandomAccessRange<T>[]) {
    super(sources);
  }

  /**
   * The source ranges for the zip range.
   */
  sources: IMutableRandomAccessRange<T>[];

  /**
   * Set the value at the front of the range.
   *
   * @param value - The value to set at the front of the range.
   *
   * #### Notes
   * This unpacks the tuple and sets each value at the front of the
   * respective source range.
   *
   * If the length of the tuple does not match the number of source
   * ranges, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setFront: (value: T[]) => void; // mixin

  /**
   * Set the value at the back of the range.
   *
   * @param value - The value to set at the back of the range.
   *
   * #### Notes
   * This unpacks the tuple and sets each value at the back of the
   * respective source range.
   *
   * If the length of the tuple does not match the number of source
   * ranges, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setBack: (value: T[]) => void; // mixin

  /**
   * Set the value at a specific index in the range.
   *
   * @param index - The index of the value of interest. Negative
   *   indices are not supported.
   *
   * @param value - The value to set at the specified index.
   *
   * #### Notes
   * This unpacks the tuple and sets each value at the index of the
   * respective source range.
   *
   * If the index is out of range, the behavior is undefined.
   *
   * If the range is empty, the behavior is undefined.
   */
  setAt(index: number, value: T[]): void {
    this.sources.forEach((src, i) => { src.setAt(index, value[i]); });
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
  slice(start = 0, stop = this.length()): MutableRandomZip<T> {
    return new MutableRandomZip<T>(this.sources.map(src => src.slice(start, stop)));
  }
}

// Apply the mixin methods.
MutableRandomZip.prototype.setFront = MutableBidirectionalZip.prototype.setFront;
MutableRandomZip.prototype.setBack = MutableBidirectionalZip.prototype.setBack;


/**
 * Test whether every object has a method with the given name.
 */
function haveMethod(objects: any[], name: string): boolean {
  return objects.every(obj => typeof obj[name] === 'function');
}
