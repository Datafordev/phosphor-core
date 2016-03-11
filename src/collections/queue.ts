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
  IForwardRange, IInputRange
} from '../range/types';


/**
 * A generic FIFO queue data structure.
 */
export
class Queue<T> {
  /**
   * Construct a new queue.
   *
   * @param values - A range of initial values for the queue.
   */
  constructor(values?: IInputRange<T>) {
    if (values) each(values, value => { this.push(value); });
  }

  /**
   * Test whether the queue is empty.
   *
   * @returns `true` if the queue is empty, `false` otherwise.
   *
   * #### Complexity
   * Constant.
   */
  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Get the length of the queue.
   *
   * @return The number of values in the queue.
   *
   * #### Complexity
   * Constant.
   */
  length(): number {
    return this._length;
  }

  /**
   * Create a range over the values in the queue.
   *
   * @returns A new forward range for the queue.
   *
   * #### Complexity
   * Constant.
   */
  slice(): QueueRange<T> {
    return new QueueRange<T>(this._front, this._length);
  }

  /**
   * Get the value at the front of the queue.
   *
   * @returns The value at the front of the queue.
   *
   * #### Complexity
   * Constant.
   *
   * #### Undefined Behavior
   * Calling `peek()` on an empty queue.
   */
  peek(): T {
    assert(!this.isEmpty(), 'Queue#peek(): Queue is empty');
    return this._front.value;
  }

  /**
   * Add a value to the back of the queue.
   *
   * @param value - The value to add to the back of the queue.
   *
   * #### Complexity
   * Constant.
   *
   * #### Range Validity
   * No changes.
   */
  push(value: T): void {
    let node = new QueueNode(value);
    if (this._length === 0) {
      this._front = node;
      this._back = node;
    } else {
      this._back.next = node;
      this._back = node;
    }
    this._length++;
  }

  /**
   * Remove and return the value at the front of the queue.
   *
   * @returns The value at the front of the queue.
   *
   * #### Complexity
   * Constant.
   *
   * #### Range Validity
   * Ranges pointing at the removed value are invalidated.
   *
   * #### Undefined Behavior
   * Calling `pop()` on an empty queue.
   */
  pop(): T {
    assert(!this.isEmpty(), 'Queue#pop(): Queue is empty');
    let node = this._front;
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      this._front = node.next;
      node.next = null;
    }
    this._length--;
    return node.value;
  }

  /**
   * Remove all values from the queue.
   *
   * #### Complexity
   * Constant (excluding GC).
   *
   * #### Range Validity
   * All ranges pointing to the queue are invalidated.
   */
  clear(): void {
    this._length = 0;
    this._front = null;
    this._back = null;
  }

  private _length = 0;
  private _front: QueueNode<T> = null;
  private _back: QueueNode<T> = null;
}


/**
 * The node type for a queue.
 *
 * #### Notes
 * User code will not typically interact with this type directly.
 */
export
class QueueNode<T> {
  /**
   * The next node the queue.
   */
  next: QueueNode<T> = null;

  /**
   * The value for the node.
   */
  value: T;

  /**
   * Construct a new queue node.
   *
   * @param value - The value for the node.
   */
  constructor(value: T) {
    this.value = value;
  }
}


/**
 * A forward range for a queue.
 */
export
class QueueRange<T> implements IForwardRange<T> {
  /**
   * Construct a new queue range.
   *
   * @param front - The first node in the queue.
   *
   * @param length - The length of the queue.
   *
   * #### Undefined Behavior
   * A non-integer, negative, or invalid length.
   */
  constructor(front: QueueNode<T>, length: number) {
    assert(isInt(length) && length >= 0, 'QueueRange(): Invalid length');
    this._length = length;
    this._front = front;
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
  slice(): QueueRange<T> {
    return new QueueRange<T>(this._front, this._length);
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
   * Calling `front()` on an empty range.
   */
  front(): T {
    assert(!this.isEmpty(), 'QueueRange#front(): Range is empty');
    return this._front.value;
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
   * Calling `popFront()` on an empty range.
   */
  popFront(): T {
    assert(!this.isEmpty(), 'QueueRange#popFront(): Range is empty');
    let node = this._front;
    this._front = node.next;
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
   * Calling `dropFront()` on an empty range.
   */
  dropFront(): void {
    assert(!this.isEmpty(), 'QueueRange#dropFront(): Range is empty');
    this._front = this._front.next;
    this._length--;
  }

  private _length: number;
  private _front: QueueNode<T>;
}
