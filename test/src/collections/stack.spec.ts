/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import expect = require('expect.js');

import {
  Stack, StackIterator
} from '../../../lib/collections/stack';

describe('collections/stack', () => {

  describe('Stack', () => {

    describe('#constructor()', () => {

      it('should instantiate with no arguments', () => {
        let stack = new Stack();
        expect(stack).to.be.a(Stack);
      });

      it('should accept an array data source', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let stack = new Stack(data);
        expect(stack).to.be.a(Stack);
      });

    });

    describe('#isEmpty', () => {

      it('should return true for an empty stack', () => {
        let stack = new Stack();
        expect(stack.isEmpty).to.be(true);
      });

      it('should return false for a non-empty stack', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let stack = new Stack(data);
        expect(stack.isEmpty).to.be(false);
      });

    });

    describe('#length', () => {

      it('should return 0 for an empty stack', () => {
        let stack = new Stack();
        expect(stack.length).to.equal(0);
      });

      it('should return the number of items in a stack', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let stack = new Stack(data);
        expect(stack.length).to.equal(data.length);
      });

    });

    describe('#back', () => {

      it('should return the value at the back of a stack', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let stack = new Stack(data);
        expect(stack.back).to.equal(data[data.length - 1]);
      });

    });

    describe('#iter()', () => {

      it('should return an iterator starting at the top of the stack', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let stack = new Stack(data);
        let iterator = stack.iter()
        expect(iterator).to.be.a(StackIterator);
        expect(iterator.next()).to.equal(data[data.length - 1]);
      });

    });

    describe('#pushBack()', () => {

      it('should add a value to the back of the stack', () => {
        let data = 99;
        let stack = new Stack();
        expect(stack.pushBack(data)).to.be(void 0);
        expect(stack.popBack()).to.equal(data);
      });

    });

    describe('#popBack()', () => {

      it('should remove and return the value at the back of the stack', () => {
        let data = 99;
        let stack = new Stack();
        expect(stack.pushBack(data)).to.equal(void 0);
        expect(stack.popBack()).to.equal(data);
        expect(stack.popBack()).to.equal(void 0);
      });

    });

    describe('#clear()', () => {

      it('should remove all values from the stack', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let stack = new Stack(data);
        expect(stack.clear()).to.equal(void 0);
        expect(stack.popBack()).to.equal(void 0);
        expect(stack.length).to.equal(0);
      });

    });

  });

  describe('StackIterator', () => {

    describe('#clone()', () => {

      it('should create a clone of the original iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let iterator = new StackIterator(data, data.length - 1);
        let clone = iterator.clone();
        expect(clone).to.be.a(StackIterator);
        for (let i = 0, len = data.length; i < len; ++i) {
          expect(iterator.next()).to.equal(clone.next());
        }
        expect(iterator.next() === void 0).to.equal(clone.next() === void 0);
      });

    });

    describe('#iter()', () => {

      it('should return `this`', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let iterator = new StackIterator(data, data.length - 1);
        expect(iterator.iter()).to.be(iterator);
      });

    });

  });


});
