/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import expect = require('expect.js');

import {
  Deque, DequeIterator
} from '../../../lib/collections/deque';

describe('collections/deque', () => {

  describe('Deque', () => {

    describe('#constructor()', () => {

      it('should instantiate with no arguments', () => {
        let deque = new Deque();
        expect(deque).to.be.a(Deque);
      });

      it('should accept an array data source', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let deque = new Deque(data);
        expect(deque).to.be.a(Deque);
      });

    });

    describe('#isEmpty', () => {

      it('should return true for an empty deque', () => {
        let deque = new Deque();
        expect(deque.isEmpty).to.be(true);
      });

      it('should return false for a non-empty deque', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let deque = new Deque(data);
        expect(deque.isEmpty).to.be(false);
      });

    });

    describe('#length', () => {

      it('should return 0 for an empty deque', () => {
        let deque = new Deque();
        expect(deque.length).to.equal(0);
      });

      it('should return the number of items in a deque', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let deque = new Deque(data);
        expect(deque.length).to.equal(data.length);
      });

    });

    describe('#back', () => {

      it('should return the value at the back of a deque', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let deque = new Deque(data);
        expect(deque.back).to.equal(data[data.length - 1]);
      });

    });

    describe('#front', () => {

      it('should return the value at the front of a deque', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let deque = new Deque(data);
        expect(deque.front).to.equal(data[0]);
      });

    });

    describe('#iter()', () => {

      it('should return an iterator starting at the front of the deque', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let deque = new Deque(data);
        let iterator = deque.iter()
        expect(iterator).to.be.a(DequeIterator);
        expect(iterator.next()).to.equal(data[0]);
      });

    });

    describe('#pushBack()', () => {

      it('should add a value to the back of the deque', () => {
        let data = 99;
        let deque = new Deque([1, 2, 3, 4]);
        expect(deque.pushBack(data)).to.be(void 0);
        expect(deque.back).to.equal(data);
      });

    });

    describe('#pushFront()', () => {

      it('should add a value to the front of the deque', () => {
        let data = 99;
        let deque = new Deque([1, 2, 3, 4]);
        expect(deque.pushFront(data)).to.be(void 0);
        expect(deque.front).to.equal(data);
      });

      it('should add a value to the front of an empty deque', () => {
        let data = 99;
        let deque = new Deque();
        expect(deque.pushFront(data)).to.be(void 0);
        expect(deque.front).to.equal(data);
      });

    });


    describe('#popBack()', () => {

      it('should remove and return the value at the back of the deque', () => {
        let data = [99, 98, 97];
        let deque = new Deque(data);
        expect(deque.popBack()).to.equal(data[2]);
        expect(deque.popBack()).to.equal(data[1]);
        expect(deque.popBack()).to.equal(data[0]);
        expect(deque.popBack()).to.equal(void 0);
      });

    });

    describe('#popFront()', () => {

      it('should remove and return the value at the front of the deque', () => {
        let data = [99, 98, 97];
        let deque = new Deque(data);
        expect(deque.popFront()).to.equal(data[0]);
        expect(deque.popFront()).to.equal(data[1]);
        expect(deque.popFront()).to.equal(data[2]);
        expect(deque.popFront()).to.equal(void 0);
      });

    });

    describe('#clear()', () => {

      it('should remove all values from the deque', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let deque = new Deque(data);
        expect(deque.clear()).to.equal(void 0);
        expect(deque.back).to.equal(void 0);
        expect(deque.front).to.equal(void 0);
        expect(deque.popFront()).to.equal(void 0);
        expect(deque.length).to.equal(0);
      });

    });

  });

  describe('DequeIterator', () => {

    describe('#clone()', () => {

      it('should create a clone of the original iterator', () => {
        let data = [99, 98, 97, 96, 95];
        let iterator = (new Deque(data)).iter();
        let clone = iterator.clone();
        expect(clone).to.be.a(DequeIterator);
        for (let i = 0, len = data.length; i < len; ++i) {
          expect(iterator.next()).to.equal(clone.next());
        }
        expect(iterator.next() === void 0).to.equal(clone.next() === void 0);
      });

    });

    describe('#iter()', () => {

      it('should return `this`', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let iterator = (new Deque(data)).iter();
        expect(iterator.iter()).to.be(iterator);
      });

    });

  });

});
