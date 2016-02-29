/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IInputRange, IBidirectionalRange
} from '../types';


/**
 * Drop the front `n` values from an input range.
 *
 * @param range - The input range of interest.
 *
 * @param n - The number of values to drop from the range.
 *
 * #### Notes
 * This function will not attempt to drop from an empty range.
 */
export
function dropFront(range: IInputRange<any>, n: number): void {
  for (let i = 0; i < n && !range.isEmpty(); ++i) range.dropFront();
}


/**
 * Drop the back `n` values from a bidirectional range.
 *
 * @param range - The bidirectional range of interest.
 *
 * @param n - The number of values to drop from the range.
 *
 * #### Notes
 * This function will not attempt to drop from an empty range.
 */
export
function dropBack(range: IBidirectionalRange<any>, n: number): void {
  for (let i = 0; i < n && !range.isEmpty(); ++i) range.dropBack();
}
