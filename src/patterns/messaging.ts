/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  each
} from '../algorithm/iteration';

import {
  Queue
} from '../collections/queue';


/**
 * A message which can be delivered to a message handler.
 *
 * #### Notes
 * This class may be subclassed to create complex message types.
 *
 * **See also:** [[postMessage]] and [[sendMessage]].
 */
export
class Message {
  /**
   * Construct a new message.
   *
   * @param type - The type of the message.
   */
  constructor(type: string) {
    this._type = type;
  }

  /**
   * The type of the message.
   *
   * #### Notes
   * This value can be used to cast the message to a derived type.
   *
   * This is a read-only property.
   */
  get type(): string {
    return this._type;
  }

  private _type: string;
}


/**
 * An object which handles messages.
 *
 * #### Notes
 * A message handler is a simple way of defining a type which can act
 * upon on a large variety of external input without requiring a large
 * abstract API surface. This is particularly useful in the context of
 * widget frameworks where the number of distinct message types can be
 * unbounded.
 *
 * **See also:** [[postMessage]] and [[sendMessage]].
 */
export
interface IMessageHandler {
  /**
   * Process a message sent to the handler.
   *
   * @param msg - The message to be processed.
   */
  processMessage(msg: Message): void;
}


/**
 * A function which intercepts messages sent to a message handler.
 *
 * @param handler - The target handler of the message.
 *
 * @param msg - The message to be sent to the handler.
 *
 * @returns `true` if the message should continue to be processed
 *   as normal, or `false` if processing should cease immediately.
 *
 * #### Notes
 * A message hook is useful for intercepting or spying on messages
 * sent to message handlers which were either not created by the
 * consumer, or when subclassing the handler is not feasible.
 *
 * If the hook returns `false`, no other message hooks will be
 * invoked and the message will not be delivered to the handler.
 *
 * If all installed message hooks return `true`, the message will
 * be delivered to the handler for processing.
 *
 * **See also:** [[installMessageHook]] and [[removeMessageHook]]
 */
export
type MessageHook = (handler: IMessageHandler, msg: Message) => boolean;


/**
 * Send a message to a message handler to process immediately.
 *
 * @param handler - The handler which should process the message.
 *
 * @param msg - The message to deliver to the handler.
 *
 * #### Notes
 * The message will first be sent through any installed message hooks
 * for the handler. If the message passes all hooks, it will then be
 * delivered to the `processMessage` method of the handler.
 *
 * The message will not be conflated with pending posted messages.
 *
 * Exceptions in hooks and handlers will be caught and logged.
 */
export
function sendMessage(handler: IMessageHandler, msg: Message): void {
  MessageLoop.sendMessage(handler, msg);
}


/**
 * Post a message to the message handler to process in the future.
 *
 * @param handler - The handler which should process the message.
 *
 * @param msg - The message to post to the handler.
 *
 * #### Notes
 * The message will be conflated with the pending posted messages for
 * the handler, if possible. If the message is not conflated, it will
 * be queued for normal delivery on the next cycle of the event loop.
 *
 * Exceptions in hooks and handlers will be caught and logged.
 */
export
function postMessage(handler: IMessageHandler, msg: Message): void {
  MessageLoop.postMessage(handler, msg);
}


/**
 * Install a message hook for a message handler.
 *
 * @param handler - The message handler of interest.
 *
 * @param hook - The message hook to install.
 *
 * #### Notes
 * A message hook is invoked before a message is delivered to the
 * handler. If the hook returns `false` from its [[hookMessage]]
 * method, no other hooks will be invoked and the message will
 * not be delivered to the handler.
 *
 * The most recently installed message hook is executed first.
 *
 * If the hook is already installed, it will be moved to the front.
 *
 * **See also:** [[removeMessageHook]]
 */
export
function installMessageHook(handler: IMessageHandler, hook: MessageHook): void {
  MessageLoop.installMessageHook(handler, hook);
}


/**
 * Remove an installed message hook for a message handler.
 *
 * @param handler - The message handler of interest.
 *
 * @param hook - The message hook to remove.
 *
 * #### Notes
 * If the hook is not installed, this is a no-op.
 *
 * It is safe to call this function while the hook is executing.
 */
export
function removeMessageHook(handler: IMessageHandler, hook: MessageHook): void {
  MessageLoop.removeMessageHook(handler, hook);
}


/**
 * Clear all message data associated with a message handler.
 *
 * @param handler - The message handler of interest.
 *
 * #### Notes
 * This will clear all pending messages and hooks for the handler.
 */
export
function clearMessageData(handler: IMessageHandler): void {
  MessageLoop.clearMessageData(handler);
}


/**
 * The namespace for the global message loop.
 */
namespace MessageLoop {
  /**
   * Send a message to a handler for immediate processing.
   *
   * This will first call all message hooks for the handler. If any
   * hook rejects the message, the message will not be delivered.
   */
  export
  function sendMessage(handler: IMessageHandler, msg: Message): void {
    // Handle the common case of no message hooks first.
    let node = hooks.get(handler);
    if (node === void 0) {
      invokeHandler(handler, msg);
      return;
    }

    // Run the message hooks. Bail early if any hook returns false.
    for (; node !== null; node = node.next) {
      if (node.hook !== null && !invokeHook(node.hook, handler, msg)) {
        return;
      }
    }

    // All message hooks returned true. Invoke the handler.
    invokeHandler(handler, msg);
  }

  /**
   * Post a message to handler for processing if the future.
   *
   * This will first conflate the message, if possible. If it cannot
   * be conflated, it will be queued for delivery on the next cycle
   * of the event loop.
   */
  export
  function postMessage(handler: IMessageHandler, msg: Message): void {
    // Handle the common case a non-conflatable message first.
    if (true) {
      enqueueMessage(handler, msg);
      return;
    }

    // Conflate message if possible, and bail early.

    // The message was not conflatable. Enqueue the message.
    enqueueMessage(handler, msg);
  }

  /**
   * Install a message hook for a handler.
   *
   * This will first remove the hook if it exists, then install the
   * hook in front of other hooks for the handler.
   */
  export
  function installMessageHook(handler: IMessageHandler, hook: MessageHook): void {
    // Remove the hook if it's already installed.
    removeMessageHook(handler, hook);

    // Install the hook at the front of the list.
    let next = hooks.get(handler) || null;
    hooks.set(handler, { next, hook });
  }

  /**
   * Remove a message hook for a handler, if it exists.
   */
  export
  function removeMessageHook(handler: IMessageHandler, hook: MessageHook): void {
    let prev: HookNode = null;
    let root = hooks.get(handler) || null;
    for (let node = root; node !== null; node = node.next) {
      if (node.hook === hook) {
        if (prev === null && node.next === null) {
          hooks.delete(handler);
        } else if (prev === null) {
          hooks.set(handler, node.next);
        } else {
          prev.next = node.next;
        }
        node.hook = null;
        return;
      }
    }
  }

  /**
   *
   */
  export
  function clearMessageData(handler: IMessageHandler): void {
    //
    let node = hooks.get(handler);
    if (node !== void 0) {
      for (; node !== null; node = node.next) {
        node.hook = null;
      }
      hooks.delete(handler);
    }

    //
    each(queue, posted => {
      if (posted.handler === handler) {
        posted.handler = null;
      }
    });
  }

  /**
   *
   */
  type PostedMessage = { handler: IMessageHandler, msg: Message };

  /**
   *
   */
  type HookNode = { next: HookNode, hook: MessageHook };

  /**
   *
   */
  const queue = new Queue<PostedMessage>();

  /**
   *
   */
  const hooks = new WeakMap<IMessageHandler, HookNode>();

  /**
   * A local reference to an event loop hook.
   */
  const raf = (() => {
    let ok = typeof requestAnimationFrame === 'function';
    return ok ? requestAnimationFrame : setImmediate;
  })();

  /**
   *
   */

  /**
   *
   */
  function invokeHook(hook: MessageHook, handler: IMessageHandler, msg: Message): boolean {
    let result = true;
    try {
      result = hook(handler, msg);
    } catch (err) {
      console.error(err);
    }
    return result;
  }

  /**
   *
   */
  function invokeHandler(handler: IMessageHandler, msg: Message): void {
    try {
      handler.processMessage(msg);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   *
   */
  function enqueueMessage(handler: IMessageHandler, msg: Message): void {

  }
}
