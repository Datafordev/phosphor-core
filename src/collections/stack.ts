/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  forEach
} from '../algorithm/iteration';

import {
  assert, isInt
} from '../patterns/assertion';

import {
  IForwardRange, IInputRange
} from '../range/types';


/**
 * A generic LIFO stack data structure.
 */
export
class Stack<T> {
  /**
   * Construct a new stack.
   *
   * @param values - A range of initial values for the stack.
   */
  constructor(values?: IInputRange<T>) {
    if (values) forEach(values, value => { this.push(value); });
  }

  /**
   * Test whether the stack is empty.
   *
   * @returns `true` if the stack is empty, `false` otherwise.
   *
   * #### Complexity
   * Constant.
   */
  isEmpty(): boolean {
    return this._stack.length === 0;
  }

  /**
   * Get the length of the stack.
   *
   * @return The number of values in the stack.
   *
   * #### Complexity
   * Constant.
   */
  length(): number {
    return this._stack.length;
  }

  /**
   * Create a range over the values in the stack.
   *
   * @returns A new forward range for the stack.
   *
   * #### Complexity
   * Constant.
   */
  slice(): StackRange<T> {
    return new StackRange<T>(this._stack, this._stack.length);
  }

  /**
   * Get the value at the top of the stack.
   *
   * @returns The value at the top of the stack.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `peek()` on an empty stack is undefined.
   */
  peek(): T {
    assert(!this.isEmpty(), 'Stack#peek(): Stack is empty');
    return this._stack[this._stack.length - 1];
  }

  /**
   * Add a value to the top of the stack.
   *
   * @param value - The value to add to the top of the stack.
   *
   * #### Complexity
   * Constant.
   *
   * #### Range Validity
   * No changes.
   */
  push(value: T): void {
    this._stack.push(value);
  }

  /**
   * Remove and return the value at the top of the stack.
   *
   * @returns The value at the top of the stack.
   *
   * #### Complexity
   * Constant.
   *
   * #### Range Validity
   * Ranges pointing at the removed value are invalidated.
   *
   * #### Undefined Behavior
   * Calling `pop()` on an empty stack is undefined.
   */
  pop(): T {
    assert(!this.isEmpty(), 'Stack#pop(): Stack is empty');
    return this._stack.pop();
  }

  /**
   * Remove all values from the stack.
   *
   * #### Complexity
   * Constant (excluding GC).
   *
   * #### Range Validity
   * All ranges pointing to the stack are invalidated.
   */
  clear(): void {
    this._stack.length = 0;
  }

  private _stack: T[] = [];
}


/**
 * A forward range for a stack.
 */
export
class StackRange<T> implements IForwardRange<T> {
  /**
   * Construct a new stack range.
   *
   * @param stack - The stack of values.
   *
   * @param length - The length of the stack.
   */
  constructor(stack: T[], length: number) {
    assert(isInt(length) && length >= 0, 'StackRange(): Invalid length');
    this._length = length;
    this._stack = stack;
  }

  /**
   * Test whether the range is empty.
   *
   * @returns `true` if the range is empty, `false` otherwise.
   *
   * #### Complexity
   * Constant.
   */
  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Get the number of values remaining in the range.
   *
   * @returns The current length of the range.
   *
   * #### Complexity
   * Constant.
   */
  length(): number {
    return this._length;
  }

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   *
   * #### Complexity
   * Constant.
   */
  slice(): StackRange<T> {
    return new StackRange<T>(this._stack, this._length);
  }

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `front()` on an empty range is undefined.
   */
  front(): T {
    assert(!this.isEmpty(), 'StackRange#front(): Range is empty');
    return this._stack[this._length - 1];
  }

  /**
   * Remove and return the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `popFront()` on an empty range is undefined.
   */
  popFront(): T {
    assert(!this.isEmpty(), 'StackRange#popFront(): Range is empty');
    return this._stack[--this._length];
  }

  /**
   * Remove the value at the front of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `dropFront()` on an empty range is undefined.
   */
  dropFront(): void {
    assert(!this.isEmpty(), 'StackRange#dropFront(): Range is empty');
    this._length--;
  }

  private _length: number;
  private _stack: T[];
}
