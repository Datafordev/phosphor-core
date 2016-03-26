/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  IIterable, IIterator, Iterable, each
} from '../algorithm/iteration';


/**
 * A generic LIFO stack data structure.
 */
export
class Stack<T> implements IIterable<T> {
  /**
   * Construct a new stack.
   *
   * @param values - An iterator of initial values for the stack.
   */
  constructor(values?: Iterable<T>) {
    if (values) each(values, value => { this.pushBack(value); });
  }

  /**
   * Test whether the stack is empty.
   *
   * @returns `true` if the stack is empty, `false` otherwise.
   *
   * #### Notes
   * This is a read-only property.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  get isEmpty(): boolean {
    return this._stack.length === 0;
  }

  /**
   * Get the length of the stack.
   *
   * @return The number of values in the stack.
   *
   * #### Notes
   * This is a read-only property.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  get length(): number {
    return this._stack.length;
  }

  /**
   * Get the value at the back of the stack.
   *
   * @returns The value at the back of the stack, or `undefined` if
   *   the stack is empty.
   *
   * #### Notes
   * This is a read-only property.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  get back(): T {
    return this._stack[this._stack.length - 1];
  }

  /**
   * Create an iterator over the values in the stack.
   *
   * @returns A new iterator starting at the top of the stack.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  iter(): StackIterator<T> {
    return new StackIterator<T>(this._stack, this._stack.length - 1);
  }

  /**
   * Add a value to the back of the stack.
   *
   * @param value - The value to add to the back of the stack.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  pushBack(value: T): void {
    this._stack.push(value);
  }

  /**
   * Remove and return the value at the back of the stack.
   *
   * @returns The value at the back of the stack, or `undefined` if
   *   the stack is empty.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * Iterators pointing at the removed value are invalidated.
   */
  popBack(): T {
    return this._stack.pop();
  }

  /**
   * Remove all values from the stack.
   *
   * #### Complexity
   * Linear.
   *
   * #### Iterator Validity
   * All current iterators are invalidated.
   */
  clear(): void {
    this._stack.length = 0;
  }

  private _stack: T[] = [];
}


/**
 * An iterator for a stack.
 */
export
class StackIterator<T> implements IIterator<T> {
  /**
   * Construct a new stack iterator.
   *
   * @param stack - The stack of values of interest.
   *
   * @param index - The index of the top of the stack.
   */
  constructor(stack: T[], index: number) {
    this._stack = stack;
    this._index = index;
  }

  /**
   * Create an iterator over the object's values.
   *
   * @returns A reference to `this` iterator.
   */
  iter(): this {
    return this;
  }

  /**
   * Create an independent clone of the stack iterator.
   *
   * @returns A new iterator starting with the current value.
   */
  clone(): StackIterator<T> {
    return new StackIterator<T>(this._stack, this._index);
  }

  /**
   * Get the next value from the stack.
   *
   * @returns The next value from the stack, or `undefined` if the
   *   iterator is exhausted.
   */
  next(): T {
    if (this._index < 0 || this._index >= this._stack.length) {
      return void 0;
    }
    return this._stack[this._index--];
  }

  private _stack: T[];
  private _index: number;
}
