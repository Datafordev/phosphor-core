/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  each, IIterator
} from '../algorithm/iteration';


/**
 * A generic double ended queue data structure.
 */
export
class Deque<T> {
  /**
   * Construct a new deque.
   *
   * @param values - An iterator of initial values for the deque.
   */
  constructor(values?: IIterator<T>) {
    if (values) each(values, value => { this.pushBack(value); });
  }

  /**
   * Test whether the deque is empty.
   *
   * @returns `true` if the deque is empty, `false` otherwise.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  empty(): boolean {
    return this._length === 0;
  }

  /**
   * Get the length of the deque.
   *
   * @return The number of values in the deque.
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
   * Create an iterator over the values in the deque.
   *
   * @returns A new iterator starting at the front of the deque.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  iter(): DequeIterator<T> {
    return new DequeIterator<T>(this._front);
  }

  /**
   * Get the value at the front of the deque.
   *
   * @returns The value at the front of the deque, or `undefined` if
   *   the deque is empty.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  peekFront(): T {
    return this._front ? this._front.value : void 0;
  }

  /**
   * Get the value at the back of the deque.
   *
   * @returns The value at the back of the deque, or `undefined` if
   *   the deque is empty.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * No changes.
   */
  peekBack(): T {
    return this._back ? this._back.value : void 0;
  }

  /**
   * Add a value to the front of the deque.
   *
   * @param value - The value to add to the front of the deque.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
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
   * #### Iterator Validity
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
   * @returns The value at the front of the deque, or `undefined` if
   *   the deque is empty.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * Iterators pointing at the removed value are invalidated.
   */
  popFront(): T {
    if (this._length === 0) {
      return void 0;
    }
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
   * @returns The value at the back of the deque, or `undefined` if
   *   the deque is empty.
   *
   * #### Complexity
   * Constant.
   *
   * #### Iterator Validity
   * Iterators pointing at the removed value are invalidated.
   */
  popBack(): T {
    if (this._length === 0) {
      return void 0;
    }
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
   * Linear.
   *
   * #### Iterator Validity
   * All current iterators are invalidated.
   */
  clear(): void {
    let node = this._front;
    while (node) {
      let next = node.next;
      node.prev = null;
      node.next = null;
      node = next;
    }
    this._length = 0;
    this._front = null;
    this._back = null;
  }

  private _length = 0;
  private _front: DequeNode<T> = null;
  private _back: DequeNode<T> = null;
}


/**
 * An iterator for a deque.
 */
export
class DequeIterator<T> implements IIterator<T> {
  /**
   * Construct a new deque iterator.
   *
   * @param node - The node at the front of range.
   */
  constructor(node: DequeNode<T>) {
    this._node = node;
  }

  /**
   * Create an independent clone of the deque iterator.
   *
   * @returns A new independent clone of the deque iterator.
   */
  clone(): DequeIterator<T> {
    return new DequeIterator<T>(this._node);
  }

  /**
   * Get the next value from the deque.
   *
   * @returns The next value from the deque, or `undefined` if the
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

  private _node: DequeNode<T>;
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
