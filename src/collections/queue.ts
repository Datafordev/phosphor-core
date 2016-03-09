/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
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
  IInputRange
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
    if (values) forEach(values, value => { this.push(value); });
  }

  /**
   * Test whether the queue is empty.
   *
   * @returns `true` if the queue is empty, `false` otherwise.
   *
   * #### Notes
   * This has `O(1)` complexity.
   */
  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Get the length of the queue.
   *
   * @return The number of values in the queue.
   *
   * #### Notes
   * This has `O(1)` complexity.
   */
  length(): number {
    return this._length;
  }

  /**
   * Get the value at the front of the queue.
   *
   * @returns The value at the front of the queue.
   *
   * #### Notes
   * If the queue is empty, the behavior is undefined.
   *
   * This has `O(1)` complexity.
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
   * #### Notes
   * This increases the queue length by one.
   *
   * This has `O(1)` complexity.
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
   * #### Notes
   * This decreases the queue length by one.
   *
   * If the queue is empty, the behavior is undefined.
   *
   * This has `O(1)` complexity.
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
   * #### Notes
   * This resets the queue length to zero.
   *
   * This is a no-op if the queue is empty.
   *
   * This has `O(1)` complexity.
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
