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
  assert
} from '../patterns/assertion';

import {
  IBidirectionalRange, IInputRange
} from '../range/types';


/**
 * A generic doubly linked list container.
 */
export
class LinkedList<T> {
  /**
   * Construct a new linked list.
   *
   * @param items - An input range of initial items for the list.
   */
  constructor(items?: IInputRange<T>) {
    if (items) forEach(items, item => { this.insertBack(item); });
  }

  /**
   * Test whether the list is empty.
   *
   * @returns `true` if the list is empty, `false` otherwise.
   *
   * #### Notes
   * This has `O(1)` complexity.
   */
  isEmpty(): boolean {
    assert(this._length >= 0);
    return this._length === 0;
  }

  /**
   * Get the length of the list.
   *
   * @return The number of values in the list.
   *
   * #### Notes
   * This has `O(1)` complexity.
   */
  length(): number {
    assert(this._length >= 0);
    return this._length;
  }

  /**
   * Get the value at the front of the list.
   *
   * @returns The value at the front of the list.
   *
   * #### Notes
   * If the list is empty, the behavior is undefined.
   *
   * This has `O(1)` complexity.
   */
  front(): T {
    assert(!this.isEmpty());
    return this._front.value;
  }

  /**
   * Get the value at the back of the list.
   *
   * @returns The value at the back of the list.
   *
   * #### Notes
   * If the list is empty, the behavior is undefined.
   *
   * This has `O(1)` complexity.
   */
  back(): T {
    assert(!this.isEmpty());
    return this._back.value;
  }

  // /**
  //  *
  //  */
  // slice(): LinkedListRange {

  // }

  /**
   * Insert a value at the front of the list.
   *
   * @param value - The value to insert at the front of the list.
   *
   * #### Notes
   * This increases the list length by one.
   *
   * This has `O(1)` complexity.
   */
  insertFront(value: T): void {
    let node = new LinkedListNode(value);
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
   * Insert a value at the back of the list.
   *
   * @param value - The value to insert at the back of the list.
   *
   * #### Notes
   * This increases the list length by one.
   *
   * This has `O(1)` complexity.
   */
  insertBack(value: T): void {
    let node = new LinkedListNode(value);
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
   * Remove the value at the front of the list.
   *
   * #### Notes
   * This decreases the list length by one.
   *
   * If the list is empty, the behavior is undefined.
   *
   * This has `O(1)` complexity.
   */
  removeFront(): void {
    assert(!this.isEmpty());
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      let node = this._front;
      this._front = node.next;
      this._front.prev = null;
      node.next = null;
    }
    this._length--;
  }

  /**
   * Remove the value at the front of the list.
   *
   * #### Notes
   * This decreases the list length by one.
   *
   * If the list is empty, the behavior is undefined.
   *
   * This has `O(1)` complexity.
   */
  removeBack(): void {
    assert(!this.isEmpty());
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      let node = this._back;
      this._back = node.prev;
      this._back.next = null;
      node.prev = null;
    }
    this._length--;
  }

  /**
   * Remove all values in the list.
   *
   * #### Notes
   * This resets the list length to zero.
   *
   * If the list is empty, the behavior is undefined.
   *
   * This has `O(1)` complexity.
   */
  clear(): void {
    this._length = 0;
    this._front = null;
    this._back = null;
  }

  private _length = 0;
  private _front: LinkedListNode<T> = null;
  private _back: LinkedListNode<T> = null;
}


/**
 * The node type for a linked list.
 *
 * #### Notes
 * User code will not typically interact will type directly.
 */
class LinkedListNode<T> {
  /**
   * The next node the chain.
   */
  next: LinkedListNode<T> = null;

  /**
   * The previous node in the chain.
   */
  prev: LinkedListNode<T> = null;

  /**
   * The value for the node.
   */
  value: T;

  /**
   * Construct a new linked list node.
   *
   * @param value - The value for the node.
   */
  constructor(value: T) {
    this.value = value;
  }
}
