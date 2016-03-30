/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import expect = require('expect.js');

import {
  IArrayLike, IIterable, IIterator, Iterable,
  ArrayIterator, EnumerateIterator, MapIterator, StrideIterator, ZipIterator,
  iter, toArray, each, enumerate, every, filter, map, some, stride, zip
} from '../../../lib/algorithm/iteration';


describe('algorithm/iteration', () => {

  describe('ArrayIterator', () => {

    describe('#clone() and #iter()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let original = new ArrayIterator(data);
        let result = toArray<number>(original.clone().iter());
        expect(result).to.eql(data);
      });

    });

  });

  describe('EnumerateIterator', () => {

    describe('#clone() and #iter()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [1, 2, 4, 8, 16, 32];
        let wanted = [[0, 1], [1, 2], [2, 4], [3, 8], [4, 16], [5, 32]];
        let enumerated = enumerate<number>(new ArrayIterator(data));
        let cloned = enumerated.clone().iter();
        expect(toArray<[number, number]>(cloned.clone())).to.eql(wanted);
      });

    });

  });

  describe('FilterIterator', () => {

    describe('#clone() and #iter()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let wanted = [1, 3, 5];
        let filtered = filter<number>(new ArrayIterator(data), x => !!(x % 2));
        let cloned = filtered.clone().iter();
        let result: Array<number> = [];
        let value: number;
        while ((value = cloned.next()) !== void 0) {
          result.push(value);
        }
        expect(result).to.eql(wanted);
      });

    });

  });

  describe('MapIterator', () => {

    describe('#clone() and #iter()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let wanted = [1, 2, 4, 8, 16, 32];
        let mapped = map<number, number>(new ArrayIterator(data), x => 2**x);
        let cloned = mapped.clone().iter();
        let result: Array<number> = [];
        let value: number;
        while ((value = cloned.next()) !== void 0) {
          result.push(value);
        }
        expect(result).to.eql(wanted);
      });

    });

  });

  describe('StrideIterator', () => {

    describe('#clone() and #iter()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let wanted = [0, 2, 4];
        let strode = stride<number>(new ArrayIterator(data), 2);
        let cloned = strode.clone().iter();
        let result: Array<number> = [];
        let value: number;
        while ((value = cloned.next()) !== void 0) {
          result.push(value);
        }
        expect(result).to.eql(wanted);
      });

    });

  });

  describe('ZipIterator', () => {

    describe('#clone() and #iter()', () => {

      it('should create a clone from the original iterator', () => {
        let dataA = new ArrayIterator([1, 2, 3, 4, 5]);
        let dataB = new ArrayIterator([1, 4, 9, 16, 25]);
        let dataC = new ArrayIterator([1, 8, 27, 64, 125]);
        let wanted = [
          [1, 1, 1],
          [2, 4, 8],
          [3, 9, 27],
          [4, 16, 64],
          [5, 25, 125]
        ];
        let zipped = zip<number>(dataA, dataB, dataC);
        let cloned = zipped.clone().iter();
        let result: Array<number[]> = [];
        let value: number[];
        while ((value = cloned.next()) !== void 0) {
          result.push(value);
        }
        expect(result).to.eql(wanted);
      });

    });

  });

  describe('toArray<T>()', () => {

    it('should create an array from iterator', () => {
      let data = [0, 1, 2, 3, 4, 5];
      let result = toArray<number>(new ArrayIterator(data));
      expect(result).to.eql(data);
    });

  });

  describe('each<T>()', () => {

    it('should visit every item in an iterable', () => {
      let data = [1, 2, 3, 4, 5];
      let result = 0;
      each<number>(new ArrayIterator(data), x => result += x)
      expect(result).to.be(15);
    });

  });

  describe('enumerate<T>()', () => {

    it('should return a transformed iterator', () => {
      let data = [1, 2, 4, 8, 16, 32];
      let wanted = [[0, 1], [1, 2], [2, 4], [3, 8], [4, 16], [5, 32]];
      let enumerated = enumerate<number>(new ArrayIterator(data));
      let result: Array<[number, number]> = [];
      let value: [number, number];
      while ((value = enumerated.next()) !== void 0) {
        result.push(value);
      }
      expect(result).to.eql(wanted);
    });

  });

  describe('every<T>()', () => {

    it('should verify all items in an iterable satisfy a condition', () => {
      let data = [1, 2, 3, 4, 5];
      let valid = every<number>(new ArrayIterator(data), x => x > 0);
      let invalid = every<number>(new ArrayIterator(data), x => x > 4);
      expect(valid).to.be(true);
      expect(invalid).to.be(false);
    });

  });

  describe('filter<T>()', () => {

    it('should return a filtered iterator', () => {
      let data = [0, 1, 2, 3, 4, 5];
      let wanted = [1, 3, 5];
      let filtered = filter<number>(new ArrayIterator(data), x => !!(x % 2));
      let result: Array<number> = [];
      let value: number;
      while ((value = filtered.next()) !== void 0) {
        result.push(value);
      }
      expect(result).to.eql(wanted);
    });

  });

  describe('map<T, U>()', () => {

    it('should return a transformed iterator', () => {
      let data = [0, 1, 2, 3, 4, 5];
      let wanted = [1, 2, 4, 8, 16, 32];
      let mapped = map<number, number>(new ArrayIterator(data), x => 2**x);
      let result: Array<number> = [];
      let value: number;
      while ((value = mapped.next()) !== void 0) {
        result.push(value);
      }
      expect(result).to.eql(wanted);
    });

  });

  describe('some<T>()', () => {

    it('should verify some items in an iterable satisfy a condition', () => {
      let data = [1, 2, 3, 4, 5];
      let valid = some<number>(new ArrayIterator(data), x => x > 4);
      let invalid = some<number>(new ArrayIterator(data), x => x < 0);
      expect(valid).to.be(true);
      expect(invalid).to.be(false);
    });

  });

  describe('stride<T>()', () => {

    it('should return an iterator with stepped values of the source', () => {
      let data = [0, 1, 2, 3, 4, 5];
      let wanted = [0, 2, 4];
      let strode = stride<number>(new ArrayIterator(data), 2);
      let result: Array<number> = [];
      let value: number;
      while ((value = strode.next()) !== void 0) {
        result.push(value);
      }
      expect(result).to.eql(wanted);
    });

  });

  describe('zip<T>()', () => {

    it('should return an iterator with transposed values sources', () => {
      let dataA = new ArrayIterator([1, 2, 3, 4, 5]);
      let dataB = new ArrayIterator([1, 4, 9, 16, 25]);
      let dataC = new ArrayIterator([1, 8, 27, 64, 125]);
      let wanted = [
        [1, 1, 1],
        [2, 4, 8],
        [3, 9, 27],
        [4, 16, 64],
        [5, 25, 125]
      ];
      let zipped = zip<number>(dataA, dataB, dataC);
      let result: Array<number[]> = [];
      let value: number[];
      while ((value = zipped.next()) !== void 0) {
        result.push(value);
      }
      expect(result).to.eql(wanted);
    });

  });

});
