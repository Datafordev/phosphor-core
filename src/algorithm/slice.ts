/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IIterable
} from './iteration';


/**
 * A finite-length sequence of indexable values.
 *
 * #### Notes
 * A slice is commonly used to provide a view into a collection.
 */
export
interface ISlice<T> extends IIterable<T> {
  /**
   * The length of the slice.
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
   * @returns The value at the specified index, or `undefined` if
   *   the index is non-integral, negative, or is out of range.
   */
  get(index: number): T;
}


/**
 * A slice which allows mutation of the underlying values.
 */
export
interface IMutableSlice<T> extends ISlice<T> {
  /**
   * Set the value at the specified index.
   *
   * @param index - The positive integer index of interest.
   *
   * @param value - The value to set at the specified index.
   *
   * #### Notes
   * This is a no-op if the index is non-integral, negative, or
   * is out of range.
   */
  set(index: number, value: T): void;
}
