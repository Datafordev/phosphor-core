/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  ArrayIterator, IArrayLike, IIterable
} from './iteration';


/**
 * An object which can be the target of sequence algorithms.
 *
 * #### Notes
 * A sequence is either a builtin array-like object, or a user defined
 * object which implements [[ISequence]].
 */
export
type Sequence<T> = ISequence<T> | IArrayLike<T>;


/**
 * An object which can be the target of mutable sequence algorithms.
 *
 * #### Notes
 * A mutable sequence is either a builtin mutable array-like object,
 * or a user defined object which implements [[IMutableSequence]].
 */
export
type MutableSequence<T> = IMutableSequence<T> | IArrayLike<T>;


/**
 * A finite-length sequence of indexable values.
 */
export
interface ISequence<T> extends IIterable<T> {
  /**
   * The length of the sequence.
   *
   * #### Notes
   * This is a read-only property.
   */
  length: number;

  /**
   * Get the value at the specified index.
   *
   * @param index - The positive integer index of interest.
   *
   * @returns The value at the specified index.
   *
   * #### Notes
   * For performance, **no bounds checking is performed**.
   */
  at(index: number): T;
}


/**
 * A sequence which allows mutation of the underlying values.
 */
export
interface IMutableSequence<T> extends ISequence<T> {
  /**
   * Set the value at the specified index.
   *
   * @param index - The positive integer index of interest.
   *
   * @param value - The value to set at the specified index.
   *
   * #### Notes
   * For performance, **no bounds checking is performed**.
   */
  set(index: number, value: T): void;
}


/**
 * Cast an object into a sequence.
 *
 * @param object - The sequence-like object of interest.
 *
 * @returns An object which implements [[ISequence]].
 *
 * #### Notes
 * If the object already implements [[ISequence]], it will be returned
 * directly. Otherwise, the object is a builtin array-like object, and
 * a new array sequence will be returned.
 */
export
function asSequence<T>(object: Sequence<T>): ISequence<T> {
  let sequence: ISequence<T>;
  if (typeof (object as any).at === 'function') {
    sequence = object as ISequence<T>;
  } else {
    sequence = new ArraySequence(object as IArrayLike<T>);
  }
  return sequence;
}


/**
 * Cast an object into a mutable sequence.
 *
 * @param object - The sequence-like object of interest.
 *
 * @returns An object which implements [[IMutableSequence]].
 *
 * #### Notes
 * If the object already implements [[IMutableSequence]], it will be
 * returned directly. Otherwise, the object is a builtin array-like
 * object, and a new mutable array sequence will be returned.
 */
export
function asMutableSequence<T>(object: MutableSequence<T>): IMutableSequence<T> {
  let sequence: IMutableSequence<T>;
  if (typeof (object as any).set === 'function') {
    sequence = object as IMutableSequence<T>;
  } else {
    sequence = new MutableArraySequence(object as IArrayLike<T>);
  }
  return sequence;
}


/**
 * A sequence for an array-like object.
 *
 * #### Notes
 * This sequence can be used for any builtin JS array-like object.
 */
export
class ArraySequence<T> implements ISequence<T> {
  /**
   * Construct a new array sequence.
   *
   * @param source - The array-like object of interest.
   */
  constructor(source: IArrayLike<T>) {
    this.source = source;
  }

  /**
   * The source array for the array sequence.
   *
   * #### Notes
   * User code can get/set this value for advanced use cases.
   */
  source: IArrayLike<T>;

  /**
   * The length of the sequence.
   *
   * #### Notes
   * This is a read-only property.
   */
  get length(): number {
    return this.source.length;
  }

  /**
   * Create an iterator over the object's values.
   *
   * @returns A new iterator which traverses the object's values.
   */
  iter(): ArrayIterator<T> {
    return new ArrayIterator(this.source, 0);
  }

  /**
   * Get the value at the specified index.
   *
   * @param index - The positive integer index of interest.
   *
   * @returns The value at the specified index.
   *
   * #### Notes
   * For performance, **no bounds checking is performed**.
   */
  at(index: number): T {
    return this.source[index];
  }
}


/**
 * A sequence for a mutable array-like object.
 *
 * #### Notes
 * This sequence can be used for any builtin JS array-like object.
 */
export
class MutableArraySequence<T> extends ArraySequence<T> implements IMutableSequence<T> {
  /**
   * Set the value at the specified index.
   *
   * @param index - The positive integer index of interest.
   *
   * @param value - The value to set at the specified index.
   *
   * #### Notes
   * For performance, **no bounds checking is performed**.
   */
  set(index: number, value: T): void {
    this.source[index] = value;
  }
}
