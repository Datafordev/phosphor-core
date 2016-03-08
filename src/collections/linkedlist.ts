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
    assert(this._length >= 0, 'LinkedList#isEmpty(): Invalid state');
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
    assert(this._length >= 0, 'LinkedList#length(): Invalid state');
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
    assert(!this.isEmpty(), 'LinkedList#front(): List is empty');
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
    assert(!this.isEmpty(), 'LinkedList#back(): List is empty');
    return this._back.value;
  }

  /**
   * Create a range which is a view on the list.
   *
   * @returns A new bidirectional range for the list.
   *
   * #### Notes
   * Modifying the list invalidates all outstanding ranges.
   *
   * Use of an invalidated range is undefined behavior.
   */
  slice(): LinkedListRange<T> {
    return new LinkedListRange<T>(this._length, this._front, this._back);
  }

  /**
   * Insert a value at the front of the list.
   *
   * @param value - The value to insert at the front of the list.
   *
   * #### Notes
   * This increases the list length by one.
   *
   * This invalidates all outstanding ranges for the list.
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
   * This invalidates all outstanding ranges for the list.
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
   * This invalidates all outstanding ranges for the list.
   *
   * This has `O(1)` complexity.
   */
  removeFront(): void {
    assert(!this.isEmpty(), 'LinkedList#removeFront(): List is empty');
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
   * Remove the value at the back of the list.
   *
   * #### Notes
   * This decreases the list length by one.
   *
   * If the list is empty, the behavior is undefined.
   *
   * This invalidates all outstanding ranges for the list.
   *
   * This has `O(1)` complexity.
   */
  removeBack(): void {
    assert(!this.isEmpty(), 'LinkedList#removeBack(): List is empty');
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
   * This is a no-op if the list is empty.
   *
   * This invalidates all outstanding ranges for the list.
   *
   * This has `O(n)` complexity.
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
  private _front: LinkedListNode<T> = null;
  private _back: LinkedListNode<T> = null;
}


/**
 * A bidirectional range for a linked list.
 */
export
class LinkedListRange<T> implements IBidirectionalRange<T> {
  /**
   * Construct a new linked list range.
   *
   * @param length - The current length of the list.
   *
   * @param front - The front of the list.
   *
   * @param back - The back of the list.
   */
  constructor(length: number, front: LinkedListNode<T>, back: LinkedListNode<T>) {
    assert(isInt(length) && length >= 0, 'LinkedListRange(): Invalid length');
    assert(!!front === !!back, 'LinkedListRange(): Invalid arguments');
    this._length = length;
    this._front = front;
    this._back = back;
  }

  /**
   * Test whether the range is empty.
   *
   * @returns `true` if the range is empty, `false` otherwise.
   */
  isEmpty(): boolean {
    assert(this._length >= 0, 'LinkedListRange#isEmpty(): Invalid state');
    return this._length === 0;
  }

  /**
   * Get the number of values remaining in the range.
   *
   * @returns The current length of the range.
   */
  length(): number {
    assert(this._length >= 0, 'LinkedListRange#length(): Invalid state');
    return this._length;
  }

  /**
   * Get the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * This does not change the length of the range.
   *
   * If the range is empty, the behavior is undefined.
   */
  front(): T {
    assert(!this.isEmpty(), 'LinkedListRange#front(): Invalid state');
    return this._front.value;
  }

  /**
   * Get the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * This does not change the length of the range.
   *
   * If the range is empty, the behavior is undefined.
   */
  back(): T {
    assert(!this.isEmpty(), 'LinkedListRange#back(): Invalid state');
    return this._back.value;
  }

  /**
   * Remove and return the value at the front of the range.
   *
   * @returns The value at the front of the range.
   *
   * #### Notes
   * This reduces the range length by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  popFront(): T {
    let front = this.front();
    this.dropFront();
    return front;
  }

  /**
   * Remove and return the value at the back of the range.
   *
   * @returns The value at the back of the range.
   *
   * #### Notes
   * This reduces the range length by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  popBack(): T {
    let back = this.back();
    this.dropBack();
    return back;
  }

  /**
   * Remove the value at the front of the range.
   *
   * #### Notes
   * This reduces the range length by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropFront(): void {
    assert(!this.isEmpty(), 'LinkedListRange#dropFront(): Invalid state');
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
   * #### Notes
   * This reduces the range length by one.
   *
   * If the range is empty, the behavior is undefined.
   */
  dropBack(): void {
    assert(!this.isEmpty(), 'LinkedListRange#dropBack(): Invalid state');
    if (this._length === 1) {
      this._front = null;
      this._back = null;
    } else {
      this._back = this._back.prev;
    }
    this._length--;
  }

  /**
   * Create an independent slice of the range.
   *
   * @returns A new slice of the current range.
   */
  slice(): LinkedListRange<T> {
    return new LinkedListRange<T>(this._length, this._front, this._back);
  }

  private _length: number;
  private _front: LinkedListNode<T>;
  private _back: LinkedListNode<T>;
}


/**
 * The node type for a linked list.
 *
 * #### Notes
 * User code will not typically interact with this type directly.
 */
export
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
