/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import expect = require('expect.js');

import {
  Queue, QueueIterator, QueueNode
} from '../../../lib/collections/queue';

describe('collections/queue', () => {

  describe('Queue', () => {

    describe('#constructor()', () => {

      it('should instantiate with no arguments', () => {
        let queue = new Queue();
        expect(queue).to.be.a(Queue);
      });

      it('should accept an array data source', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let queue = new Queue(data);
        expect(queue).to.be.a(Queue);
      });

    });

    describe('#isEmpty', () => {

      it('should return true for an empty queue', () => {
        let queue = new Queue();
        expect(queue.isEmpty).to.be(true);
      });

      it('should return false for a non-empty queue', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let queue = new Queue(data);
        expect(queue.isEmpty).to.be(false);
      });

    });

    describe('#length', () => {

      it('should return 0 for an empty queue', () => {
        let queue = new Queue();
        expect(queue.length).to.equal(0);
      });

      it('should return the number of items in a queue', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let queue = new Queue(data);
        expect(queue.length).to.equal(data.length);
      });

    });

    describe('#back', () => {

      it('should return the value at the back of a queue', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let queue = new Queue(data);
        expect(queue.back).to.equal(data[data.length - 1]);
      });

    });

    describe('#front', () => {

      it('should return the value at the front of a queue', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let queue = new Queue(data);
        expect(queue.front).to.equal(data[0]);
      });

    });

    describe('#iter()', () => {

      it('should return an iterator starting at the front of the queue', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let queue = new Queue(data);
        let iterator = queue.iter()
        expect(iterator).to.be.a(QueueIterator);
        expect(iterator.next()).to.equal(data[0]);
      });

    });

    describe('#pushBack()', () => {

      it('should add a value to the back of the queue', () => {
        let data = 99;
        let queue = new Queue();
        expect(queue.pushBack(data)).to.be(void 0);
        expect(queue.back).to.equal(data);
      });

    });

    describe('#popFront()', () => {

      it('should remove and return the value at the front of the queue', () => {
        let data = [99, 98];
        let queue = new Queue(data);
        expect(queue.popFront()).to.equal(data[0]);
        expect(queue.popFront()).to.equal(data[1]);
        expect(queue.popFront()).to.equal(void 0);
      });

    });

    describe('#clear()', () => {

      it('should remove all values from the queue', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let queue = new Queue(data);
        expect(queue.clear()).to.equal(void 0);
        expect(queue.popFront()).to.equal(void 0);
        expect(queue.length).to.equal(0);
      });

    });

  });

  describe('QueueIterator', () => {

    describe('#clone()', () => {

      it('should create a clone of the original iterator', () => {
        let data = [99, 98, 97, 96, 95];
        let iterator = (new Queue(data)).iter();
        let clone = iterator.clone();
        expect(clone).to.be.a(QueueIterator);
        for (let i = 0, len = data.length; i < len; ++i) {
          expect(iterator.next()).to.equal(clone.next());
        }
        expect(iterator.next() === void 0).to.equal(clone.next() === void 0);
      });

    });

    describe('#iter()', () => {

      it('should return `this`', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let iterator = (new Queue(data)).iter();
        expect(iterator.iter()).to.be(iterator);
      });

    });

  });


});
