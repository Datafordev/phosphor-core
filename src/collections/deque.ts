/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  each
} from '../algorithm/iteration';

import {
  assert, isInt
} from '../patterns/assertion';

import {
  IBidirectionalRange, IInputRange
} from '../range/types';


/**
 * A generic double ended queue data structure.
 */
export
class Deque<T> {
  /**
   * Construct a new deque.
   *
   * @param values - A range of initial values for the deque.
   */
  constructor(values?: IInputRange<T>) {
    if (values) each(values, value => { this.pushBack(value); });
  }

  /**
   * Test whether the deque is empty.
   *
   * @returns `true` if the deque is empty, `false` otherwise.
   *
   * #### Complexity
   * Constant.
   */
  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Get the length of the deque.
   *
   * @return The number of values in the deque.
   *
   * #### Complexity
   * Constant.
   */
  length(): number {
    return this._length;
  }

  /**
   * Create a range over the values in the deque.
   *
   * @returns A new bidirectional range for the deque.
   *
   * #### Complexity
   * Constant.
   */
  slice(): DequeRange<T> {
    return new DequeRange<T>(this._front, this._back, this._length);
  }

  /**
   * Get the value at the front of the deque.
   *
   * @returns The value at the front of the deque.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `peekFront()` on an empty deque is undefined.
   */
  peekFront(): T {
    assert(!this.isEmpty(), 'Deque#peekFront(): Deque is empty');
    return this._front.value;
  }

  /**
   * Get the value at the back of the deque.
   *
   * @returns The value at the back of the deque.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `peekBack()` on an empty deque is undefined.
   */
  peekBack(): T {
    assert(!this.isEmpty(), 'Deque#peekBack(): Deque is empty');
    return this._back.value;
  }

  /**
   * Add a value to the front of the deque.
   *
   * @param value - The value to add to the front of the deque.
   *
   * #### Complexity
   * Constant.
   *
   * #### Range Validity
   * No changes.
   */
  pushFront(value: T): void {
    let node = new DequeNode(value);
    if (this._length === 0) {
      this._front = node;
      this._back = node;
    } else {
      node.next = this._front;
      this._front.prev = node;
      this._front = node;
    }
    this._length++;
  }

  /**
   * Add a value to the back of the deque.
   *
   * @param value - The value to add to the back of the deque.
   *
   * #### Complexity
   * Constant.
   *
   * #### Range Validity
   * No changes.
   */
  pushBack(value: T): void {
    let node = new DequeNode(value);
    if (this._length === 0) {
      this._front = node;
      this._back = node;
    } else {
      node.prev = this._back;
      this._back.next = node;
      this._back = node;
    }
    this._length++;
  }

  /**
   * Remove and return the value at the front of the deque.
   *
   * @returns The value at the front of the deque.
   *
   * #### Complexity
   * Constant.
   *
   * #### Range Validity
   * Ranges pointing at the removed value are invalidated.
   *
   * #### Undefined Behavior
   * Calling `popFront()` on an empty deque is undefined.
   */
  popFront(): T {
    assert(!this.isEmpty(), 'Deque#popFront(): Deque is empty');
    let node = this._front;
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      this._front = node.next;
      this._front.prev = null;
      node.next = null;
    }
    this._length--;
    return node.value;
  }

  /**
   * Remove and return the value at the back of the deque.
   *
   * @returns The value at the back of the deque.
   *
   * #### Complexity
   * Constant.
   *
   * #### Range Validity
   * Ranges pointing at the removed value are invalidated.
   *
   * #### Undefined Behavior
   * Calling `popBack()` on an empty deque is undefined.
   */
  popBack(): T {
    assert(!this.isEmpty(), 'Deque#popBack(): Deque is empty');
    let node = this._back;
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      this._back = node.prev;
      this._back.next = null;
      node.prev = null;
    }
    this._length--;
    return node.value;
  }

  /**
   * Remove all values from the deque.
   *
   * #### Complexity
   * Constant (excluding GC).
   *
   * #### Range Validity
   * All ranges pointing to the deque are invalidated.
   */
  clear(): void {
    this._length = 0;
    this._front = null;
    this._back = null;
  }

  private _length = 0;
  private _front: DequeNode<T> = null;
  private _back: DequeNode<T> = null;
}


/**
 * The node type for a deque.
 *
 * #### Notes
 * User code will not typically interact with this type directly.
 */
export
class DequeNode<T> {
  /**
   * The next node the deque.
   */
  next: DequeNode<T> = null;

  /**
   * The previous node in the deque.
   */
  prev: DequeNode<T> = null;

  /**
   * The value for the node.
   */
  value: T;

  /**
   * Construct a new deque node.
   *
   * @param value - The value for the node.
   */
  constructor(value: T) {
    this.value = value;
  }
}


/**
 * A bidirectional range for a deque.
 */
export
class DequeRange<T> implements IBidirectionalRange<T> {
  /**
   * Construct a new deque range.
   *
   * @param front - The front of the deque.
   *
   * @param back - The back of the deque.
   *
   * @param length - The length of the deque.
   */
  constructor(front: DequeNode<T>, back: DequeNode<T>, length: number) {
    assert(isInt(length) && length >= 0, 'DequeRange(): Invalid length');
    this._length = length;
    this._front = front;
    this._back = back;
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
  slice(): DequeRange<T> {
    return new DequeRange<T>(this._front, this._back, this._length);
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
    assert(!this.isEmpty(), 'DequeRange#front(): Range is empty');
    return this._front.value;
  }

  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `back()` on an empty range is undefined.
   */
  back(): T {
    assert(!this.isEmpty(), 'DequeRange#back(): Range is empty');
    return this._back.value;
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
    assert(!this.isEmpty(), 'DequeRange#popFront(): Range is empty');
    let node = this._front;
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      this._front = node.next;
    }
    this._length--;
    return node.value;
  }

  /**
   * Remove and return the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `popBack()` on an empty range is undefined.
   */
  popBack(): T {
    assert(!this.isEmpty(), 'DequeRange#popBack(): Range is empty');
    let node = this._back;
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      this._back = node.prev;
    }
    this._length--;
    return node.value;
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
    assert(!this.isEmpty(), 'DequeRange#dropFront(): Range is empty');
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      this._front = this._front.next;
    }
    this._length--;
  }

  /**
   * Remove the value at the back of the range.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `dropBack()` on an empty range is undefined.
   */
  dropBack(): void {
    assert(!this.isEmpty(), 'DequeRange#dropBack(): Range is empty');
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      this._back = this._back.prev;
    }
    this._length--;
  }

  private _length: number;
  private _front: DequeNode<T>;
  private _back: DequeNode<T>;
}
