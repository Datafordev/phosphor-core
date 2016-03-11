/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IInputRange
} from '../range/types';


/**
 * Invoke a function for each value in a range.
 *
 * @param range - The input range of values to iterate.
 *
 * @param fn - The callback function to invoke for each value.
 *
 * #### Notes
 * This function greedily iterates the range and invokes the callback
 * once for each value. Iteration cannot be terminated early.
 *
 * The callback is provided the value and the zero-based index of the
 * current iteration.
 *
 * The callback should not modify the length of the range.
 */
export
function each<T>(range: IInputRange<T>, fn: (value: T, index: number) => void): void {
  for (let i = 0; !range.isEmpty(); ++i) {
    fn(range.popFront(), i);
  }
}
