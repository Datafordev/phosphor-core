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
 *
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
 *
 */
export
namespace zip {
  /**
   *
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
 *
 */
export
class InputZip<T> implements IInputRange<T[]> {
  /**
   *
   */
  constructor(sources: IInputRange<T>[]) {
    this.sources = sources;
  }

  /**
   *
   */
  sources: IInputRange<T>[];

  /**
   *
   */
  isEmpty(): boolean {
    if (this.sources.length === 0) return true;
    return this.sources.some(src => src.isEmpty());
  }

  /**
   *
   */
  front(): T[] {
    return this.sources.map(src => src.front());
  }

  /**
   *
   */
  dropFront(): void {
    this.sources.forEach(src => { src.dropFront(); });
  }
}


/**
 *
 */
export
class ForwardZip<T> extends InputZip<T> implements IForwardRange<T[]> {
  /**
   *
   */
  constructor(sources: IForwardRange<T>[]) {
    super(sources);
  }

  /**
   *
   */
  sources: IForwardRange<T>[];

  /**
   *
   */
  slice(): ForwardZip<T> {
    return new ForwardZip<T>(this.sources.map(src => src.slice()));
  }
}


/**
 *
 */
export
class BidirectionalZip<T> extends ForwardZip<T> implements IBidirectionalRange<T[]> {
  /**
   *
   */
  constructor(sources: IBidirectionalRange<T>[]) {
    super(sources);
  }

  /**
   *
   */
  sources: IBidirectionalRange<T>[];

  /**
   *
   */
  back(): T[] {
    return this.sources.map(src => src.back());
  }

  /**
   *
   */
  dropBack(): void {
    this.sources.forEach(src => { src.dropBack(); });
  }

  /**
   *
   */
  slice(): BidirectionalZip<T> {
    return new BidirectionalZip<T>(this.sources.map(src => src.slice()));
  }
}


/**
 *
 */
export
class RandomZip<T> extends BidirectionalZip<T> implements IRandomAccessRange<T[]> {
  /**
   *
   */
  constructor(sources: IRandomAccessRange<T>[]) {
    super(sources);
  }

  /**
   *
   */
  sources: IRandomAccessRange<T>[];

  /**
   *
   */
  length(): number {
    if (this.sources.length === 0) return 0;
    return this.sources.reduce((v, s) => Math.min(v, s.length()), Infinity);
  }

  /**
   *
   */
  at(index: number): T[] {
    return this.sources.map(src => src.at(index));
  }

  /**
   *
   */
  slice(start = 0, stop = this.length()): RandomZip<T> {
    return new RandomZip<T>(this.sources.map(src => src.slice(start, stop)));
  }
}


/**
 *
 */
export
class MutableInputZip<T> extends InputZip<T> implements IMutableInputRange<T[]> {
  /**
   *
   */
  constructor(sources: IMutableInputRange<T>[]) {
    super(sources);
  }

  /**
   *
   */
  sources: IMutableInputRange<T>[];

  /**
   *
   */
  setFront(value: T[]): void {
    this.sources.forEach((src, i) => { src.setFront(value[i]); });
  }
}


/**
 *
 */
export
class MutableForwardZip<T> extends ForwardZip<T> implements IMutableForwardRange<T[]> {
  /**
   *
   */
  constructor(sources: IMutableForwardRange<T>[]) {
    super(sources);
  }

  /**
   *
   */
  sources: IMutableForwardRange<T>[];

  /**
   *
   */
  setFront: (value: T[]) => void; // mixin

  /**
   *
   */
  slice(): MutableForwardZip<T> {
    return new MutableForwardZip<T>(this.sources.map(src => src.slice()));
  }
}

// Apply the mixin methods.
MutableForwardZip.prototype.setFront = MutableInputZip.prototype.setFront;


/**
 *
 */
export
class MutableBidirectionalZip<T> extends BidirectionalZip<T> implements IMutableBidirectionalRange<T[]> {
  /**
   *
   */
  constructor(sources: IMutableBidirectionalRange<T>[]) {
    super(sources);
  }

  /**
   *
   */
  sources: IMutableBidirectionalRange<T>[];

  /**
   *
   */
  setFront: (value: T[]) => void; // mixin

  /**
   *
   */
  setBack(value: T[]): void {
    this.sources.forEach((src, i) => { src.setBack(value[i]); });
  }

  /**
   *
   */
  slice(): MutableBidirectionalZip<T> {
    return new MutableBidirectionalZip<T>(this.sources.map(src => src.slice()));
  }
}

// Apply the mixin methods.
MutableBidirectionalZip.prototype.setFront = MutableForwardZip.prototype.setFront;


/**
 *
 */
export
class MutableRandomZip<T> extends RandomZip<T> implements IMutableRandomAccessRange<T[]> {
  /**
   *
   */
  constructor(sources: IMutableRandomAccessRange<T>[]) {
    super(sources);
  }

  /**
   *
   */
  sources: IMutableRandomAccessRange<T>[];

  /**
   *
   */
  setFront: (value: T[]) => void; // mixin

  /**
   *
   */
  setBack: (value: T[]) => void; // mixin

  /**
   *
   */
  setAt(index: number, value: T[]): void {
    this.sources.forEach((src, i) => { src.setAt(index, value[i]); });
  }

  /**
   *
   */
  slice(): MutableRandomZip<T> {
    return new MutableRandomZip<T>(this.sources.map(src => src.slice()));
  }
}

// Apply the mixin methods.
MutableRandomZip.prototype.setFront = MutableBidirectionalZip.prototype.setFront;
MutableRandomZip.prototype.setBack = MutableBidirectionalZip.prototype.setBack;


/**
 *
 */
function haveMethod(objects: any[], name: string): boolean {
  return objects.every(obj => typeof obj[name] === 'function');
}
