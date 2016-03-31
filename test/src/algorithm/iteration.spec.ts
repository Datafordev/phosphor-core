/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import expect = require('expect.js');

import {
  ArrayIterator, EnumerateIterator, FilterIterator,
  MapIterator, StrideIterator, ZipIterator,
  each, enumerate, every, filter, map, some, stride, toArray, zip
} from '../../../lib/algorithm/iteration';


describe('algorithm/iteration', () => {

  describe('ArrayIterator', () => {

    describe('#constructor()', () => {

      it('should create an array iterator from a source', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let iterator = new ArrayIterator(data);
        expect(toArray<number>(iterator)).to.eql(data);
      });

    });

    describe('#clone()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let iterator = new ArrayIterator(data);
        let cloned = iterator.clone();
        expect(cloned).to.be.an(ArrayIterator);
        expect(toArray<number>(cloned)).to.eql(data);
      });

    });

    describe('#iter()', () => {

      it('should return an interator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let iterator = new ArrayIterator(data);
        expect(iterator.iter()).to.be.an(ArrayIterator);
        expect(toArray<number>(iterator.iter())).to.eql(data);
      });

    });

    describe('#next()', () => {

      it('should return the next item in an iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let iterator = new ArrayIterator(data);
        expect(iterator.next()).to.be(data[0]);
        expect(iterator.next()).to.be(data[1]);
        expect(iterator.next()).to.be(data[2]);
        expect(iterator.next()).to.be(data[3]);
        expect(iterator.next()).to.be(data[4]);
        expect(iterator.next()).to.be(data[5]);
        expect(iterator.next()).to.be(void 0);
      });

    });

  });

  describe('EnumerateIterator', () => {

    describe('#constructor()', () => {

      it('should create an enumerate iterator from a source', () => {
        let data = [1, 2, 4, 8, 16, 32];
        let wanted = [[0, 1], [1, 2], [2, 4], [3, 8], [4, 16], [5, 32]];
        let iterator = new EnumerateIterator(new ArrayIterator(data), 0);
        expect(toArray<[number, number]>(iterator)).to.eql(wanted);
      });

    });

    describe('#clone()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [1, 2, 4, 8, 16, 32];
        let wanted = [[0, 1], [1, 2], [2, 4], [3, 8], [4, 16], [5, 32]];
        let iterator = new EnumerateIterator(new ArrayIterator(data), 0);
        let cloned = iterator.clone();
        expect(cloned).to.be.an(EnumerateIterator);
        expect(toArray<[number, number]>(cloned)).to.eql(wanted);
      });

    });

    describe('#iter()', () => {

      it('should return an interator', () => {
        let data = [1, 2, 4, 8, 16, 32];
        let wanted = [[0, 1], [1, 2], [2, 4], [3, 8], [4, 16], [5, 32]];
        let iterator = new EnumerateIterator(new ArrayIterator(data), 0);
        expect(iterator.iter()).to.be.an(EnumerateIterator);
        expect(toArray<[number, number]>(iterator.iter())).to.eql(wanted);
      });

    });

    describe('#next()', () => {

      it('should return the next item in an iterator', () => {
        let data = [1, 2, 4, 8, 16, 32];
        let wanted = [[0, 1], [1, 2], [2, 4], [3, 8], [4, 16], [5, 32]];
        let iterator = new EnumerateIterator(new ArrayIterator(data), 0);
        expect(iterator.next()).to.eql(wanted[0]);
        expect(iterator.next()).to.eql(wanted[1]);
        expect(iterator.next()).to.eql(wanted[2]);
        expect(iterator.next()).to.eql(wanted[3]);
        expect(iterator.next()).to.eql(wanted[4]);
        expect(iterator.next()).to.eql(wanted[5]);
        expect(iterator.next()).to.be(void 0);
      });

    });

  });

  describe('FilterIterator', () => {

    describe('#constructor()', () => {

      it('should create a filter iterator from a source and filter', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let filter = (x: number) => !!(x % 2);
        let wanted = [1, 3, 5];
        let iterator = new FilterIterator(new ArrayIterator(data), filter);
        expect(toArray<number>(iterator)).to.eql(wanted);
      });

    });

    describe('#clone()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let filter = (x: number) => !!(x % 2);
        let wanted = [1, 3, 5];
        let iterator = new FilterIterator(new ArrayIterator(data), filter);
        let cloned = iterator.clone();
        expect(cloned).to.be.a(FilterIterator);
        expect(toArray<number>(cloned)).to.eql(wanted);
      });

    });

    describe('#iter()', () => {

      it('should return an interator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let filter = (x: number) => !!(x % 2);
        let wanted = [1, 3, 5];
        let iterator = new FilterIterator(new ArrayIterator(data), filter);
        expect(iterator.iter()).to.be.a(FilterIterator);
        expect(toArray<number>(iterator.iter())).to.eql(wanted);
      });

    });

    describe('#next()', () => {

      it('should return the next item in an iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let filter = (x: number) => !!(x % 2);
        let wanted = [1, 3, 5];
        let iterator = new FilterIterator(new ArrayIterator(data), filter);
        expect(iterator.next()).to.be(wanted[0]);
        expect(iterator.next()).to.be(wanted[1]);
        expect(iterator.next()).to.be(wanted[2]);
        expect(iterator.next()).to.be(void 0);
      });

    });

  });

  describe('MapIterator', () => {

    describe('#constructor()', () => {

      it('should create a map iterator from a source and transformer', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let transformer = (x: number) => 2**x;
        let wanted = [1, 2, 4, 8, 16, 32];
        let iterator = new MapIterator(new ArrayIterator(data), transformer);
        expect(toArray<number>(iterator)).to.eql(wanted);
      });

    });

    describe('#clone()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let transformer = (x: number) => 2**x;
        let wanted = [1, 2, 4, 8, 16, 32];
        let iterator = new MapIterator(new ArrayIterator(data), transformer);
        let cloned = iterator.clone();
        expect(cloned).to.be.a(MapIterator);
        expect(toArray<number>(cloned)).to.eql(wanted);
      });

    });

    describe('#iter()', () => {

      it('should return an interator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let transformer = (x: number) => 2**x;
        let wanted = [1, 2, 4, 8, 16, 32];
        let iterator = new MapIterator(new ArrayIterator(data), transformer);
        expect(iterator.iter()).to.be.a(MapIterator);
        expect(toArray<number>(iterator.iter())).to.eql(wanted);
      });

    });

    describe('#next()', () => {

      it('should return the next item in an iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let transformer = (x: number) => 2**x;
        let wanted = [1, 2, 4, 8, 16, 32];
        let iterator = new MapIterator(new ArrayIterator(data), transformer);
        expect(iterator.next()).to.be(wanted[0]);
        expect(iterator.next()).to.be(wanted[1]);
        expect(iterator.next()).to.be(wanted[2]);
        expect(iterator.next()).to.be(wanted[3]);
        expect(iterator.next()).to.be(wanted[4]);
        expect(iterator.next()).to.be(wanted[5]);
        expect(iterator.next()).to.be(void 0);
      });

    });

  });

  describe('StrideIterator', () => {

    describe('#constructor()', () => {

      it('should create a map iterator from a source and a step value', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let step = 2;
        let wanted = [0, 2, 4];
        let iterator = new StrideIterator(new ArrayIterator(data), step);
        expect(toArray<number>(iterator)).to.eql(wanted);
      });

    });

    describe('#clone()', () => {

      it('should create a clone from the original iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let step = 2;
        let wanted = [0, 2, 4];
        let iterator = new StrideIterator(new ArrayIterator(data), step);
        let cloned = iterator.clone();
        expect(cloned).to.be.a(StrideIterator);
        expect(toArray<number>(cloned)).to.eql(wanted);
      });

    });

    describe('#iter()', () => {

      it('should return an interator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let step = 2;
        let wanted = [0, 2, 4];
        let iterator = new StrideIterator(new ArrayIterator(data), step);
        expect(iterator.iter()).to.be.a(StrideIterator);
        expect(toArray<number>(iterator.iter())).to.eql(wanted);
      });

    });

    describe('#next()', () => {

      it('should return the next item in an iterator', () => {
        let data = [0, 1, 2, 3, 4, 5];
        let step = 2;
        let wanted = [0, 2, 4];
        let iterator = new StrideIterator(new ArrayIterator(data), step);
        expect(iterator.next()).to.be(wanted[0]);
        expect(iterator.next()).to.be(wanted[1]);
        expect(iterator.next()).to.be(wanted[2]);
        expect(iterator.next()).to.be(void 0);
      });

    });

  });

  describe('ZipIterator', () => {

    describe('#constructor()', () => {

      it('should create a map iterator from a source and transformer', () => {
        let dataA = new ArrayIterator([1, 2, 3, 4, 5]);
        let dataB = new ArrayIterator([1, 4, 9, 16, 25]);
        let dataC = new ArrayIterator([1, 8, 27, 64, 125]);
        let data = [dataA, dataB, dataC];
        let wanted = [
          [1, 1, 1],
          [2, 4, 8],
          [3, 9, 27],
          [4, 16, 64],
          [5, 25, 125]
        ];
        let iterator = new ZipIterator<number>(data);
        let result: Array<number[]> = [];
        let value: number[];
        while ((value = iterator.next()) !== void 0) {
          result.push(value);
        }
        expect(result).to.eql(wanted);
      });

    });

    describe('#clone()', () => {

      it('should create a clone from the original iterator', () => {
        let dataA = new ArrayIterator([1, 2, 3, 4, 5]);
        let dataB = new ArrayIterator([1, 4, 9, 16, 25]);
        let dataC = new ArrayIterator([1, 8, 27, 64, 125]);
        let data = [dataA, dataB, dataC];
        let wanted = [
          [1, 1, 1],
          [2, 4, 8],
          [3, 9, 27],
          [4, 16, 64],
          [5, 25, 125]
        ];
        let iterator = new ZipIterator<number>(data);
        let cloned = iterator.clone();
        let result: Array<number[]> = [];
        let value: number[];
        while ((value = cloned.next()) !== void 0) {
          result.push(value);
        }
        expect(cloned).to.be.a(ZipIterator);
        expect(result).to.eql(wanted);
      });

    });

    describe('#iter()', () => {

      it('should return an interator', () => {
        let dataA = new ArrayIterator([1, 2, 3, 4, 5]);
        let dataB = new ArrayIterator([1, 4, 9, 16, 25]);
        let dataC = new ArrayIterator([1, 8, 27, 64, 125]);
        let data = [dataA, dataB, dataC];
        let wanted = [
          [1, 1, 1],
          [2, 4, 8],
          [3, 9, 27],
          [4, 16, 64],
          [5, 25, 125]
        ];
        let iterator = new ZipIterator<number>(data);
        let result: Array<number[]> = [];
        let value: number[];
        while ((value = iterator.iter().next()) !== void 0) {
          result.push(value);
        }
        expect(iterator).to.be.a(ZipIterator);
        expect(result).to.eql(wanted);
      });

    });

    describe('#next()', () => {

      it('should return the next item in an iterator', () => {
        let dataA = new ArrayIterator([1, 2, 3, 4, 5]);
        let dataB = new ArrayIterator([1, 4, 9, 16, 25]);
        let dataC = new ArrayIterator([1, 8, 27, 64, 125]);
        let data = [dataA, dataB, dataC];
        let wanted = [
          [1, 1, 1],
          [2, 4, 8],
          [3, 9, 27],
          [4, 16, 64],
          [5, 25, 125]
        ];
        let iterator = new ZipIterator<number>(data);
        expect(iterator.next()).to.eql(wanted[0]);
        expect(iterator.next()).to.eql(wanted[1]);
        expect(iterator.next()).to.eql(wanted[2]);
        expect(iterator.next()).to.eql(wanted[3]);
        expect(iterator.next()).to.eql(wanted[4]);
        expect(iterator.next()).to.be(void 0);
      });

    });

  });

  describe('toArray<T>()', () => {

    it('should create an array from iterator', () => {
      let data = [0, 1, 2, 3, 4, 5];
      let result = toArray<number>(new ArrayIterator(data));
      expect(result).to.be.an('array');
      expect(result).to.eql(data);
    });

  });

  describe('each()', () => {

    it('should visit every item in an iterable', () => {
      let data = [1, 2, 3, 4, 5];
      let result = 0;
      each<number>(new ArrayIterator(data), x => result += x);
      expect(result).to.be(15);
    });

  });

  describe('enumerate()', () => {

    it('should return an enumerate iterator', () => {
      let data = [1, 2, 4, 8, 16, 32];
      let iterator = enumerate<number>(new ArrayIterator(data));
      expect(iterator).to.be.an(EnumerateIterator);
    });

  });

  describe('every()', () => {

    it('should verify all items in an iterable satisfy a condition', () => {
      let data = [1, 2, 3, 4, 5];
      let valid = every<number>(new ArrayIterator(data), x => x > 0);
      let invalid = every<number>(new ArrayIterator(data), x => x > 4);
      expect(valid).to.be(true);
      expect(invalid).to.be(false);
    });

  });

  describe('filter()', () => {

    it('should return a filtered iterator', () => {
      let data = [0, 1, 2, 3, 4, 5];
      let iterator = filter<number>(new ArrayIterator(data), x => !!(x % 2));
      expect(iterator).to.be.a(FilterIterator);
    });

  });

  describe('map()', () => {

    it('should return a transformed iterator', () => {
      let data = [0, 1, 2, 3, 4, 5];
      let iterator = map<number, number>(new ArrayIterator(data), x => 2**x);
      expect(iterator).to.be.a(MapIterator);
    });

  });

  describe('some()', () => {

    it('should verify some items in an iterable satisfy a condition', () => {
      let data = [1, 2, 3, 4, 5];
      let valid = some<number>(new ArrayIterator(data), x => x > 4);
      let invalid = some<number>(new ArrayIterator(data), x => x < 0);
      expect(valid).to.be(true);
      expect(invalid).to.be(false);
    });

  });

  describe('stride()', () => {

    it('should return an iterator with stepped values of the source', () => {
      let data = [0, 1, 2, 3, 4, 5];
      let iterator = stride<number>(new ArrayIterator(data), 2);
      expect(iterator).to.be.a(StrideIterator);
    });

  });

  describe('zip()', () => {

    it('should return an iterator with transposed values sources', () => {
      let dataA = new ArrayIterator([1, 2, 3, 4, 5]);
      let dataB = new ArrayIterator([1, 4, 9, 16, 25]);
      let dataC = new ArrayIterator([1, 8, 27, 64, 125]);
      let iterator = zip<number>(dataA, dataB, dataC);
      expect(iterator).to.be.a(ZipIterator);
    });

  });

});
