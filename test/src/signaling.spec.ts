/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import expect = require('expect.js');

import {
  Signal, clearSignalData, disconnectReceiver, disconnectSender
} from '../../lib/signaling';


class TestObject {

  private _testObjectStructuralProperty: any;
}


namespace TestObject {

  export const one = new Signal<TestObject, void>();

  export const two = new Signal<TestObject, number>();

  export const three = new Signal<TestObject, string[]>();
}


class ExtendedObject extends TestObject {

  notifyCount = 0;

  onNotify(): void {
    this.notifyCount++;
  }
}


class TestHandler {

  name = '';

  oneCount = 0;

  twoValue = 0;

  twoSender: TestObject = null;

  onOne(): void {
    this.oneCount++;
  }

  onTwo(sender: TestObject, args: number): void {
    this.twoSender = sender;
    this.twoValue = args;
  }

  onThree(sender: TestObject, args: string[]): void {
    args.push(this.name);
  }

  onThrow(): void {
    throw new Error();
  }
}


describe('signaling', () => {

  describe('Signal', () => {

    describe('#connect()', () => {

      it('should return true on success', () => {
        let obj = new TestObject();
        let handler = new TestHandler();
        let c1 = TestObject.one.connect(obj, handler.onOne, handler);
        expect(c1).to.be(true);
      });

      it('should return false on failure', () => {
        let obj = new TestObject();
        let handler = new TestHandler();
        let c1 = TestObject.one.connect(obj, handler.onOne, handler);
        let c2 = TestObject.one.connect(obj, handler.onOne, handler);
        expect(c1).to.be(true);
        expect(c2).to.be(false);
      });

      it('should connect plain functions', () => {
        let obj = new TestObject();
        let handler = new TestHandler();
        let c1 = TestObject.one.connect(obj, handler.onThrow);
        expect(c1).to.be(true);
      });

      it('should ignore duplicate connections', () => {
        let obj = new TestObject();
        let handler = new TestHandler();
        let c1 = TestObject.one.connect(obj, handler.onOne, handler);
        let c2 = TestObject.one.connect(obj, handler.onOne, handler);
        let c3 = TestObject.two.connect(obj, handler.onTwo, handler);
        let c4 = TestObject.two.connect(obj, handler.onTwo, handler);
        TestObject.one.emit(obj, void 0);
        TestObject.two.emit(obj, 42);
        expect(c1).to.be(true);
        expect(c2).to.be(false);
        expect(c3).to.be(true);
        expect(c4).to.be(false);
        expect(handler.oneCount).to.be(1);
        expect(handler.twoValue).to.be(42);
      });

    });

    describe('#disconnect()', () => {

      it('should return true on success', () => {
        let obj = new TestObject();
        let handler = new TestHandler();
        TestObject.one.connect(obj, handler.onOne, handler);
        let d1 = TestObject.one.disconnect(obj, handler.onOne, handler);
        expect(d1).to.be(true);
      });

      it('should return false on failure', () => {
        let obj = new TestObject();
        let handler = new TestHandler();
        let d1 = TestObject.one.disconnect(obj, handler.onOne, handler);
        expect(d1).to.be(false);
      });

      it('should disconnect plain functions', () => {
        let obj = new TestObject();
        let handler = new TestHandler();
        TestObject.one.connect(obj, handler.onThrow);
        expect(TestObject.one.disconnect(obj, handler.onThrow)).to.be(true);
        expect(() => TestObject.one.emit(obj, void 0)).to.not.throwError();
      });

      it('should disconnect a specific signal', () => {
        let obj1 = new TestObject();
        let obj2 = new TestObject();
        let obj3 = new TestObject();
        let handler1 = new TestHandler();
        let handler2 = new TestHandler();
        let handler3 = new TestHandler();
        TestObject.one.connect(obj1, handler1.onOne, handler1);
        TestObject.one.connect(obj2, handler2.onOne, handler2);
        TestObject.one.connect(obj1, handler3.onOne, handler3);
        TestObject.one.connect(obj2, handler3.onOne, handler3);
        TestObject.one.connect(obj3, handler3.onOne, handler3);
        let d1 = TestObject.one.disconnect(obj1, handler1.onOne, handler1);
        let d2 = TestObject.one.disconnect(obj1, handler1.onOne, handler1);
        let d3 = TestObject.one.disconnect(obj2, handler3.onOne, handler3);
        TestObject.one.emit(obj1, void 0);
        TestObject.one.emit(obj2, void 0);
        TestObject.one.emit(obj3, void 0);
        expect(d1).to.be(true);
        expect(d2).to.be(false);
        expect(d3).to.be(true);
        expect(handler1.oneCount).to.be(0);
        expect(handler2.oneCount).to.be(1);
        expect(handler3.oneCount).to.be(2);
      });

    });

    describe('#emit()', () => {

      it('should pass the sender and args to the handlers', () => {
        let obj = new TestObject();
        let handler1 = new TestHandler();
        let handler2 = new TestHandler();
        TestObject.two.connect(obj, handler1.onTwo, handler1);
        TestObject.two.connect(obj, handler2.onTwo, handler2);
        TestObject.two.emit(obj, 15);
        expect(handler1.twoSender).to.be(obj);
        expect(handler2.twoSender).to.be(obj);
        expect(handler1.twoValue).to.be(15);
        expect(handler2.twoValue).to.be(15);
      });

      it('should invoke handlers in connection order', () => {
        let obj = new TestObject();
        let handler1 = new TestHandler();
        let handler2 = new TestHandler();
        let handler3 = new TestHandler();
        handler1.name = 'foo';
        handler2.name = 'bar';
        handler3.name = 'baz';
        TestObject.three.connect(obj, handler1.onThree, handler1);
        TestObject.one.connect(obj, handler1.onOne, handler1);
        TestObject.three.connect(obj, handler2.onThree, handler2);
        TestObject.three.connect(obj, handler3.onThree, handler3);
        let names: string[] = [];
        TestObject.three.emit(obj, names);
        TestObject.one.emit(obj, void 0);
        expect(names).to.eql(['foo', 'bar', 'baz']);
        expect(handler1.oneCount).to.be(1);
        expect(handler2.oneCount).to.be(0);
      });

      it('should catch any exceptions in handlers', () => {
        let obj = new TestObject();
        let handler1 = new TestHandler();
        let handler2 = new TestHandler();
        let handler3 = new TestHandler();
        handler1.name = 'foo';
        handler2.name = 'bar';
        handler3.name = 'baz';
        TestObject.three.connect(obj, handler1.onThree, handler1);
        TestObject.three.connect(obj, handler2.onThrow, handler2);
        TestObject.three.connect(obj, handler3.onThree, handler3);
        let threw = false;
        let names1: string[] = [];
        try {
          TestObject.three.emit(obj, names1);
        } catch (e) {
          threw = true;
        }
        expect(threw).to.be(false);
        expect(names1).to.eql(['foo', 'baz']);
      });

      it('should not invoke signals added during emission', () =>  {
        let obj = new TestObject();
        let handler1 = new TestHandler();
        let handler2 = new TestHandler();
        let handler3 = new TestHandler();
        handler1.name = 'foo';
        handler2.name = 'bar';
        handler3.name = 'baz';
        let adder = {
          add: () => {
            TestObject.three.connect(obj, handler3.onThree, handler3);
          },
        };
        TestObject.three.connect(obj, handler1.onThree, handler1);
        TestObject.three.connect(obj, handler2.onThree, handler2);
        TestObject.three.connect(obj, adder.add, adder);
        let names1: string[] = [];
        TestObject.three.emit(obj, names1);
        TestObject.three.disconnect(obj, adder.add, adder);
        let names2: string[] = [];
        TestObject.three.emit(obj, names2);
        expect(names1).to.eql(['foo', 'bar']);
        expect(names2).to.eql(['foo', 'bar', 'baz']);
      });

      it('should not invoke signals removed during emission', () => {
        let obj = new TestObject();
        let handler1 = new TestHandler();
        let handler2 = new TestHandler();
        let handler3 = new TestHandler();
        handler1.name = 'foo';
        handler2.name = 'bar';
        handler3.name = 'baz';
        let remover = {
          remove: () => {
            TestObject.three.disconnect(obj, handler3.onThree, handler3);
          },
        };
        TestObject.three.connect(obj, handler1.onThree, handler1);
        TestObject.three.connect(obj, handler2.onThree, handler2);
        TestObject.three.connect(obj, remover.remove, remover);
        TestObject.three.connect(obj, handler3.onThree, handler3);
        let names: string[] = [];
        TestObject.three.emit(obj, names);
        expect(names).to.eql(['foo', 'bar']);
      });

    });

  });

  describe('disconnectSender()', () => {

    it('should disconnect all signals from a specific sender', () => {
      let obj1 = new TestObject();
      let obj2 = new TestObject();
      let handler1 = new TestHandler();
      let handler2 = new TestHandler();
      TestObject.one.connect(obj1, handler1.onOne, handler1);
      TestObject.one.connect(obj1, handler2.onOne, handler2);
      TestObject.one.connect(obj2, handler1.onOne, handler1);
      TestObject.one.connect(obj2, handler2.onOne, handler2);
      disconnectSender(obj1);
      TestObject.one.emit(obj1, void 0);
      TestObject.one.emit(obj2, void 0);
      expect(handler1.oneCount).to.be(1);
      expect(handler2.oneCount).to.be(1);
    });

    it('should be a no-op if the sender is not connected', () => {
      expect(() => disconnectSender({})).to.not.throwError();
    });

  });

  describe('disconnectReceiver()', () => {

    it('should disconnect all signals from a specific receiver', () => {
      let obj1 = new TestObject();
      let obj2 = new TestObject();
      let handler1 = new TestHandler();
      let handler2 = new TestHandler();
      TestObject.one.connect(obj1, handler1.onOne, handler1);
      TestObject.one.connect(obj1, handler2.onOne, handler2);
      TestObject.one.connect(obj2, handler1.onOne, handler1);
      TestObject.one.connect(obj2, handler2.onOne, handler2);
      TestObject.two.connect(obj2, handler1.onTwo, handler1);
      TestObject.two.connect(obj2, handler2.onTwo, handler2);
      disconnectReceiver(handler1);
      TestObject.one.emit(obj1, void 0);
      TestObject.one.emit(obj2, void 0);
      TestObject.two.emit(obj2, 42);
      expect(handler1.oneCount).to.be(0);
      expect(handler2.oneCount).to.be(2);
      expect(handler1.twoValue).to.be(0);
      expect(handler2.twoValue).to.be(42);
    });

    it('should be a no-op if the receiver is not connected', () => {
      expect(() => disconnectReceiver({})).to.not.throwError();
    });

  });

  describe('clearSignalData()', () => {

    it('should clear all signal data associated with an object', () => {
      let counter = 0;
      let onCount = () => { counter++ };
      let ext1 = new ExtendedObject();
      let ext2 = new ExtendedObject();
      ExtendedObject.one.connect(ext1, ext1.onNotify, ext1);
      ExtendedObject.one.connect(ext1, ext2.onNotify, ext2);
      ExtendedObject.one.connect(ext1, onCount);
      ExtendedObject.one.connect(ext2, ext1.onNotify, ext1);
      ExtendedObject.one.connect(ext2, ext2.onNotify, ext2);
      ExtendedObject.one.connect(ext2, onCount);
      clearSignalData(ext1);
      ExtendedObject.one.emit(ext1, void 0);
      ExtendedObject.one.emit(ext2, void 0);
      expect(ext1.notifyCount).to.be(0);
      expect(ext2.notifyCount).to.be(1);
      expect(counter).to.be(1);
    });

  });

  context('https://github.com/phosphorjs/phosphor-signaling/issues/5', () => {

    it('should handle connect after disconnect and emit', () => {
      let obj = new TestObject();
      let handler = new TestHandler();
      let c1 = TestObject.one.connect(obj, handler.onOne, handler);
      expect(c1).to.be(true);
      TestObject.one.disconnect(obj, handler.onOne, handler);
      TestObject.one.emit(obj, void 0);
      let c2 = TestObject.one.connect(obj, handler.onOne, handler);
      expect(c2).to.be(true);
    });

  });

  context('https://github.com/phosphorjs/phosphor-signaling/issues/8', () => {

    it('should handle disconnecting sender after receiver', () => {
      let obj = new TestObject();
      let handler = new TestHandler();
      TestObject.one.connect(obj, handler.onOne, handler);
      disconnectReceiver(handler);
      disconnectSender(obj);
      TestObject.one.emit(obj, void 0);
      expect(handler.oneCount).to.be(0);
    });

    it('should handle disconnecting receiver after sender', () => {
      let obj = new TestObject();
      let handler = new TestHandler();
      TestObject.one.connect(obj, handler.onOne, handler);
      disconnectSender(obj);
      disconnectReceiver(handler);
      TestObject.one.emit(obj, void 0);
      expect(handler.oneCount).to.be(0);
    });

  });

});
