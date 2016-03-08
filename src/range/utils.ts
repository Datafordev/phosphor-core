/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IInputRange, IBidirectionalRange
} from './types';


/**
 * Drop the front of an input range `n` times.
 *
 * @param range - The input range of interest.
 *
 * @param n - The number of times to pop the front of the range.
 *
 * #### Notes
 * This function will not attempt to drop from an empty range.
 */
export
function dropFrontN(range: IInputRange<any>, n: number): void {
  for (let i = 0; i < n && !range.isEmpty(); ++i) range.dropFront();
}


/**
 * Drop the back of a bidirectional range `n` times.
 *
 * @param range - The bidirectional range of interest.
 *
 * @param n - The number of times to pop the back of the range.
 *
 * #### Notes
 * This function will not attempt to drop from an empty range.
 */
export
function dropBackN(range: IBidirectionalRange<any>, n: number): void {
  for (let i = 0; i < n && !range.isEmpty(); ++i) range.dropBack();
}
