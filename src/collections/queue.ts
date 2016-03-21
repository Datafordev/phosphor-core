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
  IIterable, IIterator
} from '../algorithm/types';


/**
 * A generic FIFO queue data structure.
 */
export
class Queue<T> implements IIterable<T> {
  /**
   * Construct a new queue.
   *
   * @param values - An iterator of initial values for the queue.
   */
  constructor(values?: IIterator<T>) {
    if (values) each(values, value => { this.push(value); });
  }

  /**
   * Test whether the queue is empty.
   *
   * @returns `true` if the queue is empty, `false` otherwise.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
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
   *
   * #### Iterator Validity
   * No changes.
   */
  length(): number {
    return this._length;
  }

  /**
   * Create an iterator over the values in the queue.
   *
   * @returns A new iterator starting at the front of the queue.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  iter(): QueueIterator<T> {
    return new QueueIterator<T>(this._front);
  }

  /**
   * Get the value at the front of the queue.
   *
   * @returns The value at the front of the queue, or `undefined` if
   *   the queue is empty.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  peek(): T {
    return this._front ? this._front.value : void 0;
  }

  /**
   * Add a value to the back of the queue.
   *
   * @param value - The value to add to the back of the queue.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
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
   * @returns The value at the front of the queue, or `undefined` if
   *   the queue is empty.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * Iterators pointing at the removed value are invalidated.
   */
  pop(): T {
    if (this._length === 0) {
      return void 0;
    }
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
   * Linear.
   *
   * #### Iterator Validity
   * All current iterators are invalidated.
   */
  clear(): void {
    let node = this._front;
    while (node) {
      let next = node.next;
      node.next = null;
      node = next;
    }
    this._length = 0;
    this._front = null;
    this._back = null;
  }

  private _length = 0;
  private _front: QueueNode<T> = null;
  private _back: QueueNode<T> = null;
}


/**
 * An iterator for a queue.
 */
export
class QueueIterator<T> implements IIterator<T> {
  /**
   * Construct a new queue iterator.
   *
   * @param node - The node at the front of range.
   */
  constructor(node: QueueNode<T>) {
    this._node = node;
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
   * Create an independent clone of the queue iterator.
   *
   * @returns A new iterator starting with the current value.
   */
  clone(): QueueIterator<T> {
    return new QueueIterator<T>(this._node);
  }

  /**
   * Get the next value from the queue.
   *
   * @returns The next value from the queue, or `undefined` if the
   *   iterator is exhausted.
   */
  next(): T {
    if (!this._node) {
      return void 0;
    }
    let value = this._node.value;
    this._node = this._node.next;
    return value;
  }

  private _node: QueueNode<T>;
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
