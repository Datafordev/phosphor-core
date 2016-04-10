/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IterableOrArrayLike, iter
} from './iteration';

import {
  SequenceOrArrayLike, asSequence
} from './sequence';


/**
 * Find the first value in an iterable which matches a predicate.
 *
 * @param object - The iterable or array-like object to search.
 *
 * @param fn - The predicate function to apply to the values.
 *
 * @returns The first matching value, or `undefined` if no matching
 *   value is found.
 *
 * #### Complexity
 * Linear.
 *
 * #### Example
 * ```typescript
 * import { find } from 'phosphor-core/lib/algorithm/searching';
 *
 * interface IAnimal { species: string, name: string };
 *
 * function isCat(value: IAnimal): boolean {
 *   return value.species === 'cat';
 * }
 *
 * let data: IAnimal[] = [
 *   { species: 'dog', name: 'spot' },
 *   { species: 'cat', name: 'fluffy' },
 *   { species: 'alligator', name: 'pocho' },
 * ];
 *
 * find(data, isCat).name;  // 'fluffy'
 * ```
 */
export
function find<T>(object: IterableOrArrayLike<T>, fn: (value: T) => boolean): T {
  let value: T;
  let it = iter(object);
  while ((value = it.next()) !== void 0) {
    if (fn(value)) {
      return value;
    }
  }
  return void 0;
}


/**
 * Find the index of the first occurrence of a value in a sequence.
 *
 * @param object - The sequence or array-like object to search.
 *
 * @param value - The value to locate in the sequence. Values are
 *   compared using strict `===` equality.
 *
 * @param fromIndex - The starting index of the search. The default
 *   value is `0`.
 *
 * @returns The index of the first occurrence of the value, or `-1`
 *   if the value is not found.
 *
 * #### Complexity
 * Linear.
 *
 * #### Undefined Behavior
 * A `fromIndex` which is non-integral or `< 0`.
 *
 * #### Example
 * ```typescript
 * import { indexOf } from 'phosphor-core/lib/algorithm/searching';
 *
 * let data = ['one', 'two', 'three', 'four', 'one'];
 * indexOf(data, 'red');     // -1
 * indexOf(data, 'one');     // 0
 * indexOf(data, 'one', 1);  // 4
 * indexOf(data, 'two', 2);  // -1
 * ```
 */
export
function indexOf<T>(object: SequenceOrArrayLike<T>, value: T, fromIndex?: number): number {
  let length = object.length;
  if (length === 0) {
    return -1;
  }
  let start: number;
  if (fromIndex === void 0) {
    start = 0;
  } else {
    start = fromIndex;
  }
  let seq = asSequence(object);
  for (let i = start; i < length; ++i) {
    if (seq.at(i) === value) {
      return i;
    }
  }
  return -1;
}


/**
 * Find the index of the last occurrence of a value in a sequence.
 *
 * @param object - The sequence or array-like object to search.
 *
 * @param value - The value to locate in the sequence. Values are
 *   compared using strict `===` equality.
 *
 * @param fromIndex - The starting index of the search. The default
 *   value is `length - 1`.
 *
 * @returns The index of the last occurrence of the value, or `-1`
 *   if the value is not found.
 *
 * #### Complexity
 * Linear.
 *
 * #### Undefined Behavior
 * A `fromIndex` which is non-integral or `>= length`.
 *
 * #### Example
 * ```typescript
 * import { lastIndexOf } from 'phosphor-core/lib/algorithm/searching';
 *
 * let data = ['one', 'two', 'three', 'four', 'one'];
 * lastIndexOf(data, 'red');     // -1
 * lastIndexOf(data, 'one');     // 4
 * lastIndexOf(data, 'one', 1);  // 0
 * lastIndexOf(data, 'two', 2);  // 1
 * ```
 */
export
function lastIndexOf<T>(object: SequenceOrArrayLike<T>, value: T, fromIndex?: number): number {
  let length = object.length;
  if (length === 0) {
    return -1;
  }
  let start: number;
  if (fromIndex === void 0) {
    start = length - 1;
  } else {
    start = fromIndex;
  }
  let seq = asSequence(object);
  for (let i = start; i >= 0; --i) {
    if (seq.at(i) === value) {
      return i;
    }
  }
  return -1;
}


/**
 * Find the index of the first value which matches a predicate.
 *
 * @param object - The sequence or array-like object to search.
 *
 * @param fn - The predicate function to apply to the values.
 *
 * @param fromIndex - The starting index of the search. The default
 *   value is `0`.
 *
 * @returns The index of the first matching value, or `-1` if no
 *   matching value is found.
 *
 * #### Complexity
 * Linear.
 *
 * #### Undefined Behavior
 * A `fromIndex` which is non-integral or `< 0`.
 *
 * Modifying the length of the sequence while searching.
 *
 * #### Example
 * ```typescript
 * import { findIndex } from 'phosphor-core/lib/algorithm/searching';
 *
 * function isEven(value: number): boolean {
 *   return value % 2 === 0;
 * }
 *
 * let data = [1, 2, 3, 4, 3, 2, 1];
 * findIndex(data, isEven);     // 1
 * findIndex(data, isEven, 4);  // 5
 * findIndex(data, isEven, 6);  // -1
 * ```
 */
export
function findIndex<T>(object: SequenceOrArrayLike<T>, fn: (value: T, index: number) => boolean, fromIndex?: number): number {
  let length = object.length;
  if (length === 0) {
    return -1;
  }
  let start: number;
  if (fromIndex === void 0) {
    start = 0;
  } else {
    start = fromIndex;
  }
  let seq = asSequence(object);
  for (let i = start; i < length; ++i) {
    if (fn(seq.at(i), i)) {
      return i;
    }
  }
  return -1;
}


/**
 * Find the index of the last value which matches a predicate.
 *
 * @param object - The sequence or array-like object to search.
 *
 * @param fn - The predicate function to apply to the values.
 *
 * @param fromIndex - The starting index of the search. The default
 *   value is `length - 1`.
 *
 * @returns The index of the last matching value, or `-1` if no
 *   matching value is found.
 *
 * #### Complexity
 * Linear.
 *
 * #### Undefined Behavior
 * A `fromIndex` which is non-integral or `>= length`.
 *
 * Modifying the length of the sequence while searching.
 *
 * #### Example
 * ```typescript
 * import { findLastIndex } from 'phosphor-core/lib/algorithm/searching';
 *
 * function isEven(value: number): boolean {
 *   return value % 2 === 0;
 * }
 *
 * let data = [1, 2, 3, 4, 3, 2, 1];
 * findLastIndex(data, isEven);     // 5
 * findLastIndex(data, isEven, 4);  // 3
 * findLastIndex(data, isEven, 0);  // -1
 * ```
 */
export
function findLastIndex<T>(object: SequenceOrArrayLike<T>, fn: (value: T, index: number) => boolean, fromIndex?: number): number {
  let length = object.length;
  if (length === 0) {
    return -1;
  }
  let start: number;
  if (fromIndex === void 0) {
    start = length - 1;
  } else {
    start = fromIndex;
  }
  let seq = asSequence(object);
  for (let i = start; i >= 0; --i) {
    if (fn(seq.at(i), i)) {
      return i;
    }
  }
  return -1;
}


/**
 * Find the index of the first element which compares `>=` to a value.
 *
 * @param sequence - The sequence or array-like object to search.
 *   It must be sorted in ascending order.
 *
 * @param value - The value to locate in the sequence.
 *
 * @param fn - The 3-way comparison function to apply to the values.
 *   It should return `< 0` if an element is less than a value, `0` if
 *   an element is equal to a value, or `> 0` if an element is greater
 *   than a value.
 *
 * @returns The index of the first element which compares `>=` to the
 *   value, or `length` if there is no such element.
 *
 * #### Complexity
 * Logarithmic.
 *
 * #### Undefined Behavior
 * A sequence which is not sorted in ascending order.
 *
 * Modifying the length of the sequence while searching.
 *
 * #### Example
 * ```typescript
 * import { lowerBound } from 'phosphor-core/lib/algorithm/searching';
 *
 * function numberCmp(a: number, b: number): number {
 *   return a - b;
 * }
 *
 * let data = [0, 3, 4, 7, 7, 9];
 * lowerBound(data, 0, numberCmp);   // 0
 * lowerBound(data, 6, numberCmp);   // 3
 * lowerBound(data, 7, numberCmp);   // 3
 * lowerBound(data, -1, numberCmp);  // 0
 * lowerBound(data, 10, numberCmp);  // 6
 * ```
 */
export
function lowerBound<T, U>(object: SequenceOrArrayLike<T>, value: U, fn: (element: T, value: U) => number): number {
  let n = object.length;
  if (n === 0) {
    return 0;
  }
  let begin = 0;
  let half: number;
  let middle: number;
  let seq = asSequence(object);
  while (n > 0) {
    half = n / 2 | 0;
    middle = begin + half;
    if (fn(seq.at(middle), value) < 0) {
      begin = middle + 1;
      n -= half + 1;
    } else {
      n = half;
    }
  }
  return begin;
}


/**
 * Find the index of the first element which compares `>` than a value.
 *
 * @param sequence - The sequence or array-like object to search.
 *   It must be sorted in ascending order.
 *
 * @param value - The value to locate in the sequence.
 *
 * @param fn - The 3-way comparison function to apply to the values.
 *   It should return `< 0` if an element is less than a value, `0` if
 *   an element is equal to a value, or `> 0` if an element is greater
 *   than a value.
 *
 * @returns The index of the first element which compares `>` than the
 *   value, or `length` if there is no such element.
 *
 * #### Complexity
 * Logarithmic.
 *
 * #### Undefined Behavior
 * A sequence which is not sorted in ascending order.
 *
 * Modifying the length of the sequence while searching.
 *
 * #### Example
 * ```typescript
 * import { upperBound } from 'phosphor-core/lib/algorithm/searching';
 *
 * function numberCmp(a: number, b: number): number {
 *   return a - b;
 * }
 *
 * let data = [0, 3, 4, 7, 7, 9];
 * upperBound(data, 0, numberCmp);   // 1
 * upperBound(data, 6, numberCmp);   // 3
 * upperBound(data, 7, numberCmp);   // 5
 * upperBound(data, -1, numberCmp);  // 0
 * upperBound(data, 10, numberCmp);  // 6
 * ```
 */
export
function upperBound<T, U>(object: SequenceOrArrayLike<T>, value: U, fn: (element: T, value: U) => number): number {
  let n = object.length;
  if (n === 0) {
    return 0;
  }
  let begin = 0;
  let half: number;
  let middle: number;
  let seq = asSequence(object);
  while (n > 0) {
    half = n / 2 | 0;
    middle = begin + half;
    if (fn(seq.at(middle), value) > 0) {
      n = half;
    } else {
      begin = middle + 1;
      n -= half + 1;
    }
  }
  return begin;
}
