/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 * A type alias for a slot function.
 *
 * @param T - The type of the sender.
 *
 * @param U - The type of the signal args.
 *
 * #### Notes
 * A slot function is invoked when a signal to which it is connected is
 * emitted.
 *
 * The signal `args` are typically the most important information for a
 * slot. Therefore, the `sender` is passed as the second argument so it
 * can be easily ignored when not needed.
 */
export
type Slot<T, U> = (args: U, sender: T) => void;


/**
 * An object used for type-safe inter-object communication.
 *
 * #### Notes
 * Signals provide a type-safe implementation of the publish-subscribe
 * pattern. An object (publisher) declares which signals it will emit,
 * and consumers connect callbacks (subscribers) to those signals. The
 * subscribers are invoked whenever the publisher emits the signal.
 *
 * #### Example
 * ```typescript
 * import { Signal } from 'phosphor-core/lib/patterns/signaling';
 *
 * class MyClass {
 *
 *   constructor(name: string) {
 *     this._name = name;
 *   }
 *
 *   get name(): string {
 *     return this._name;
 *   }
 *
 *   get value(): number {
 *     return this._value;
 *   }
 *
 *   set value(value: number) {
 *     if (value === this._value) {
 *       return;
 *     }
 *     this._value = value;
 *     MyClass.valueChanged.emit(this, value);
 *   }
 *
 *   private _name: string;
 *   private _value = 0;
 * }
 *
 * namespace MyClass {
 *   export const valueChanged = new Signal<MyClass, number>();
 * }
 *
 * function logger(value: number, sender: MyClass): void {
 *   console.log(sender.name, value);
 * }
 *
 * let m1 = new MyClass('foo');
 * let m2 = new MyClass('bar');
 *
 * MyClass.valueChanged.connect(m1, logger);
 * MyClass.valueChanged.connect(m2, logger);
 *
 * m1.value = 42;  // logs: foo 42
 * m2.value = 17;  // logs: bar 17
 * ```
 */
export
class Signal<T, U> {
  /**
   * Connect a slot to the signal.
   *
   * @param sender - The object emitting the signal.
   *
   * @param slot - The function to invoke when the signal is emitted.
   *   It will be passed the emitted args and the sender object.
   *
   * @param thisArg - The object to use as the `this` context in the
   *   function. If provided, this must be a non-primitive object.
   *
   * @returns `true` if the connection succeeds, `false` otherwise.
   *
   * #### Notes
   * Connected slots are invoked synchronously, in the order in which
   * they are connected.
   *
   * Signal connections are unique. If a connection already exists for
   * the given `slot` and `thisArg`, this method returns `false`.
   *
   * A newly connected slot will not be invoked until the next time the
   * signal is emitted, even if the slot is connected while the signal
   * is being emitted.
   *
   * #### Example
   * ```typescript
   * // connect a method
   * SomeClass.valueChanged.connect(someObject, myObject.onValueChanged, myObject);
   *
   * // connect a plain function
   * SomeClass.valueChanged.connect(someObject, myCallback);
   * ```
   */
  connect(sender: T, slot: Slot<T, U>, thisArg?: any): boolean {
    return connect(sender, this._sid, slot, thisArg);
  }

  /**
   * Disconnect a slot from the signal.
   *
   * @param sender - The object emitting the signal.
   *
   * @param slot - The slot function connected to the signal.
   *
   * @param thisArg - The `this` context for the slot function.
   *
   * @returns `true` if the connection is removed, `false` otherwise.
   *
   * #### Notes
   * A disconnected slot will no longer be invoked, even if the slot
   * is disconnected while the signal is being emitted.
   *
   * If no connection exists for the given `slot` and `thisArg`, this
   * method returns `false`.
   *
   * #### Example
   * ```typescript
   * // disconnect a method
   * SomeClass.valueChanged.disconnect(someObject, myObject.onValueChanged, myObject);
   *
   * // disconnect a plain function
   * SomeClass.valueChanged.disconnect(someObject, myCallback);
   * ```
   */
  disconnect(sender: T, slot: Slot<T, U>, thisArg?: any): boolean {
    return disconnect(sender, this._sid, slot, thisArg);
  }

  /**
   * Emit a signal and invoke the connected slots.
   *
   * @param sender - The object emitting the signal.
   *
   * @param args - The args object to pass to the slots.
   *
   * #### Notes
   * Exceptions thrown by connected slots will be caught and logged.
   *
   * #### Example
   * ```typescript
   * SomeClass.valueChanged.emit(someObject, 42);
   * ```
   */
  emit(sender: T, args: U): void {
    emit(sender, this._sid, args);
  }

  private _sid = nextSID();
}


/**
 * A struct which holds connection data.
 */
class Connection {
  /**
   * The slot connected to the signal.
   */
  slot: Slot<any, any> = null;

  /**
   * The `this` context for the slot.
   */
  thisArg: any = null;

  /**
   * The next connection in the receivers list.
   *
   * #### Notes
   * These are the connections from a single sender to the many
   * receivers which are invoked when that signal is emitted.
   */
  nextReceiver: Connection = null;

  /**
   * The next connection in the senders list.
   *
   * #### Notes
   * These are the connections from a single receiver to the many
   * senders which emit signals which invoke that receiver.
   */
  nextSender: Connection = null;
}


/**
 * A map which holds connections for an owner object.
 */
interface IConnectionMap {
  /**
   * The list of sender connections for the object.
   *
   * #### Notes
   * These are all connections for which the owner is the receiver.
   *
   * The list can be traversed through the `nextSender` property.
   */
  senders?: Connection;

  /**
   * A mapping of specific signal id to receiver connection.
   *
   * #### Notes
   * These are the connections for which the owner is the sender.
   *
   * The list can be traversed through the `nextReceiver` property.
   */
  [sid: string]: Connection;
}


/**
 * A weak mapping of connection owner to connection map.
 */
const ownerData = new WeakMap<any, IConnectionMap>();


/**
 * A function which computes successive unique signal ids.
 */
const nextSID = (() => {
  let id = 0;
  return () => {
    let rand = Math.random();
    let stem = `${rand}`.slice(2);
    return `sid-${stem}-${id++}`;
  };
})();


/**
 * Lookup the connection map for a connection owner.
 *
 * This will create the map if one does not already exist.
 */
function ensureMap(owner: any): IConnectionMap {
  let map = ownerData.get(owner);
  if (map !== void 0) return map;
  map = Object.create(null);
  ownerData.set(owner, map);
  return map;
}


/**
 * Connect a slot to a signal.
 *
 * @param sender - The object emitting the signal.
 *
 * @param sid - The unique id of the signal.
 *
 * @param slot - The slot to connect to the signal.
 *
 * @param thisArg - The `this` context for the slot.
 *
 * @returns `true` if the connection succeeds, `false` otherwise.
 *
 * #### Notes
 * Connected slots are invoked synchronously, in the order in which
 * they are connected.
 *
 * Signal connections are unique. If a connection already exists for
 * the given `slot` and `thisArg`, this function returns `false`.
 *
 * A newly connected slot will not be invoked until the next time the
 * signal is emitted, even if the slot is connected while the signal
 * is being emitted.
 */
function connect(sender: any, sid: string, slot: Slot<any, any>, thisArg?: any): boolean {
  // Coerce a `null` thisArg to `undefined`.
  thisArg = thisArg || void 0;

  // Check if a connection already exists, and bail if found.
  let senderMap = ensureMap(sender);
  let head = senderMap[sid] || null;
  for (let conn = head; conn !== null; conn = conn.nextReceiver) {
    if (conn.slot === slot && conn.thisArg === thisArg) {
      return false;
    }
  }

  // Create a new connection.
  let conn = new Connection();
  conn.slot = slot;
  conn.thisArg = thisArg;

  // Add the connection to the sender's list of receivers.
  conn.nextReceiver = head;
  senderMap[sid] = conn;

  // Add the connection to the receiver's list of senders.
  let receiverMap = ensureMap(thisArg || slot);
  conn.nextSender = receiverMap.senders || null;
  receiverMap.senders = conn;

  // Indicate a successful connection.
  return true;
}


/**
 * Disconnect a slot from a signal.
 *
 * @param sender - The object emitting the signal.
 *
 * @param sid - The unique id of the signal.
 *
 * @param slot - The slot to disconnect from the signal.
 *
 * @param thisArg - The `this` context for the slot.
 *
 * @returns `true` if the connection is removed, `false` otherwise.
 *
 * #### Notes
 * A disconnected slot will no longer be invoked, even if the slot
 * is disconnected while the signal is being emitted.
 *
 * If no connection exists for the given `slot` and `thisArg`, this
 * function returns `false`.
 */
function disconnect(sender: any, sid: string, slot: Slot<any, any>, thisArg?: any): boolean {
  // Coerce a `null` thisArg to `undefined`.
  thisArg = thisArg || void 0;

  // Lookup the sender map.
  let senderMap = ownerData.get(sender);
  if (senderMap === void 0) {
    return false;
  }

  // Lookup the head of the receiver list.
  let head = senderMap[sid];
  if (head === void 0) {
    return false;
  }

  // Setup a variable to store the removed connection.
  let target: Connection = null;

  // Remove the connection from the sender's list of receivers.
  let rConn = head;
  let rPrev: Connection = null;
  for (; rConn !== null; rPrev = rConn, rConn = rConn.nextReceiver) {
    if (rConn.slot === slot && rConn.thisArg === thisArg) {
      if (rPrev === null && rConn.nextReceiver === null) {
        delete senderMap[sid];
      } else if (rPrev === null) {
        senderMap[sid] = rConn.nextReceiver;
      } else {
        rPrev.nextReceiver = rConn.nextReceiver;
      }
      target = rConn;
      break;
    }
  }

  // Bail if the connection was not found.
  if (target === null) {
    return false;
  }

  // Lookup the receiver map, which is guaranteed to exist.
  let receiverMap = ownerData.get(thisArg || slot);

  // Remove the connection from the receiver's list of senders.
  let sPrev: Connection = null;
  let sConn = receiverMap.senders || null;
  for (; sConn !== null; sPrev = sConn, sConn = sConn.nextSender) {
    if (sConn === target) {
      if (sPrev === null && sConn.nextSender === null) {
        delete receiverMap.senders;
      } else if (sPrev === null) {
        receiverMap.senders = sConn.nextSender;
      } else {
        sPrev.nextSender = sConn.nextSender;
      }
      break;
    }
  }

  // Clear the content of the target connection.
  target.slot = null;
  target.thisArg = null;
  target.nextSender = null;
  target.nextReceiver = null;

  // Indicate successful disconnection.
  return true;
}


/**
 * Emit a signal and invoke the connected slots.
 *
 * @param sender - The object emitting the signal.
 *
 * @param sid - The unique id of the signal to emit.
 *
 * @param args - The args object to pass to the slots.
 *
 * #### Notes
 * Exceptions thrown by connected slots will be caught and logged.
 */
function emit(sender: any, sid: string, args: any): void {
  // If there is no connection map, there is nothing to do.
  let map = ownerData.get(sender);
  if (map === void 0) {
    return;
  }

  // Lookup the first connection in the receiver list.
  let conn = map[sid];
  if (conn === void 0) {
    return;
  }

  // Dispatch the slots for the for the signal.
  recursiveEmit(conn, sender, args);
}


/**
 * Recursively invoke the the receivers in a connection list.
 *
 * @param conn - A connection in the list of receivers.
 *
 * @param sender - The sender object emitting the signal.
 *
 * @param args - The arguments emitted with the signal.
 *
 * #### Notes
 * This function recursively traverses the list and invokes the last
 * connection in the list first. This has the effect of capturing a
 * snapshot of the list in the recursive stack frames. As the stack
 * unwinds, any non-empty connection is invoked.
 */
function recursiveEmit(conn: Connection, sender: any, args: any): void {
  if (conn.nextReceiver !== null) {
    recursiveEmit(conn.nextReceiver, sender, args);
  }
  if (conn.slot !== null) {
    invokeSlot(conn, sender, args);
  }
}


/**
 * Safely invoke a non-empty connection.
 *
 * @param conn - The connection which holds the slot.
 *
 * @param sender - The sender object emitting the signal.
 *
 * @param args - The arguments emitted with the signal.
 *
 * #### Notes
 * Any exception thrown by the slot will be caught and logged.
 */
function invokeSlot(conn: Connection, sender: any, args: any): void {
  try {
    conn.slot.call(conn.thisArg, args, sender);
  } catch (err) {
    console.error(err);
  }
}
