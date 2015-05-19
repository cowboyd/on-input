/**
* immstruct v1.4.0
* Authors: Mikael Brevik, @torgeir
***************************************/
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.immstruct=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';
var Structure = _dereq_('./src/structure');

/**
 * Creates a new instance of Immstruct, having it's own list
 * of Structure instances.
 *
 * ### Examples:
 *
 *     var ImmstructInstance = require('immstruct').Immstruct;
 *     var immstruct = new ImmstructInstance();
 *     var structure = immstruct.get({ data: });
 *
 * @property {Array} instances Array of `Structure` instances.
 *
 * @class {Immstruct}
 * @constructor
 * @returns {Immstruct}
 * @api public
 */
function Immstruct () {
  if (!(this instanceof Immstruct)) {
    return new Immstruct();
  }

  this._instances = {};
}

/**
 *
 * Gets or creates a new instance of {Structure}. Provide optional
 * key to be able to retrieve it from list of instances. If no key
 * is provided, a random key will be generated.
 *
 * ### Examples:
 * ```js
 * var immstruct = require('immstruct');
 * var structure = immstruct.get('myStruct', { foo: 'Hello' });
 * ```
 * @param {String} [key] - defaults to random string
 * @param {Object|Immutable} [data] - defaults to empty data
 *
 * @returns {Structure}
 * @module immstruct.get
 * @api public
 */
Immstruct.prototype.get = function (key, data) {
  return getInstance(this, {
    key: key,
    data: data
  });
};

/**
 *
 * Get list of all instances created.
 *
 * @param {String} [name] - Name of the instance to get. If undefined get all instances
 *
 * @returns {Array}
 * @module immstruct.getInstances
 * @api public
 */
Immstruct.prototype.instance = function (name) {
  if (name) return this._instances[name];
  return this._instances;
};

/**
 * Clear the entire list of `Structure` instances from the Immstruct
 * instance. You would do this to start from scratch, freeing up memory.
 *
 * ### Examples:
 *
 *     var immstruct = require('immstruct');
 *     immstruct.clear();
 *
 * @module immstruct.clear
 * @api public
 */
Immstruct.prototype.clear = function () {
  this._instances = {};
};

/**
 * Remove one `Structure` instance from the Immstruct instances list.
 * Provided by key
 *
 * ### Examples:
 *
 *     var immstruct = require('immstruct');
 *     immstruct('myKey', { foo: 'hello' });
 *     immstruct.remove('myKey');
 *
 * @param {String} key
 *
 * @module immstruct.remove
 * @api public
 * @returns {Boolean}
 */
Immstruct.prototype.remove = function (key) {
  return delete this._instances[key];
};


/**
 * Gets or creates a new instance of `Structure` with history (undo/redo)
 * activated per default. Same usage and signature as regular `Immstruct.get`.

 * Provide optional key to be able to retrieve it from list of instances.
 * If no key is provided, a random key will be generated.
 *
 * Provide optional limit to cap the last number of history references
 * that will be kept. Once limit is reached, a new history record
 * shifts off the oldest record. The default if omitted is Infinity.
 * Setting to 0 is the as not having history enabled in the first place.
 *
 * ### Examples:
 *
 *     var immstruct = require('immstruct');
 *     var structure = immstruct.withHistory('myStruct', 10, { foo: 'Hello' });
 *     var structure = immstruct.withHistory(10, { foo: 'Hello' });
 *     var structure = immstruct.withHistory('myStruct', { foo: 'Hello' });
 *     var structure = immstruct.withHistory({ foo: 'Hello' });
 *
 * @param {String} [key] - defaults to random string
 * @param {Number} [limit] - defaults to Infinity
 * @param {Object|Immutable} [data] - defaults to empty data
 *
 * @module immstruct.withHistory
 * @api public
 * @returns {Structure}
 */
Immstruct.prototype.withHistory = function (key, limit, data) {
  return getInstance(this, {
    key: key,
    data: data,
    history: true,
    historyLimit: limit
  });
};

var inst = new Immstruct();

/**
 * This is a default instance of `Immstruct` as well as a shortcut for
 * creating `Structure` instances (See `Immstruct.get` and `Immstruct`).
 * This is what is returned from `require('immstruct')`.
 *
 * From `Immstruct.get`:
 * Gets or creates a new instance of {Structure} in the default Immstruct
 * instance. A link to `immstruct.get()`. Provide optional
 * key to be able to retrieve it from list of instances. If no key
 * is provided, a random key will be generated.
 *
 * ### Examples:
 *
 *     var immstruct = require('immstruct');
 *     var structure = immstruct('myStruct', { foo: 'Hello' });
 *     var structure2 = immstruct.withHistory({ bar: 'Bye' });
 *     immstruct.remove('myStruct');
 *     // ...
 *
 * @param {String} [key] - defaults to random string
 * @param {Object|Immutable} [data] - defaults to empty data
 *
 * @api public
 * @see {@link Immstruct}
 * @see {Immstruct.prototype.get}
 * @module immstruct
 * @class {Immstruct}
 * @returns {Structure|Function}
 */
module.exports = function (key, data) {
  return getInstance(inst, {
    key: key,
    data: data
  });
};

module.exports.withHistory = function (key, limit, data) {
  return getInstance(inst, {
    key: key,
    data: data,
    history: true,
    historyLimit: limit
  });
};

module.exports.Structure = Structure;
module.exports.Immstruct = Immstruct;
module.exports.clear     = inst.clear.bind(inst);
module.exports.remove    = inst.remove.bind(inst);
module.exports.get       = inst.get.bind(inst);
module.exports.instance = function (name) {
  if (name) return inst._instances[name];
  return inst._instances;
};

function getInstance (obj, options) {
  if (typeof options.key === 'object') {
    options.data = options.key;
    options.key = void 0;
  } else if (typeof options.key === 'number') {
    options.data = options.historyLimit;
    options.historyLimit = options.key;
    options.key = void 0;
  } else if (typeof options.historyLimit === 'object') {
    options.data = options.historyLimit;
    options.historyLimit = void 0;
  }

  if (options.key && obj._instances[options.key]) {
    return obj._instances[options.key];
  }

  var newInstance = new Structure(options);
  obj._instances[newInstance.key] = newInstance;
  return newInstance;
}

},{"./src/structure":4}],2:[function(_dereq_,module,exports){
'use strict';

//
// We store our EE objects in a plain object whose properties are event names.
// If `Object.create(null)` is not supported we prefix the event names with a
// `~` to make sure that the built-in object properties are not overridden or
// used as an attack vector.
// We also assume that `Object.create(null)` is available when the event name
// is an ES6 Symbol.
//
var prefix = typeof Object.create !== 'function' ? '~' : false;

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} once Only emit once
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Holds the assigned EventEmitters by name.
 *
 * @type {Object}
 * @private
 */
EventEmitter.prototype._events = undefined;

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @param {Boolean} exists We only need to know if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events && this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (this._events[evt].fn) return [this._events[evt].fn];

  for (var i = 0, l = this._events[evt].length, ee = new Array(l); i < l; i++) {
    ee[i] = this._events[evt][i].fn;
  }

  return ee;
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return this;

  var listeners = this._events[evt]
    , events = [];

  if (fn) {
    if (listeners.fn) {
      if (
           listeners.fn !== fn
        || (once && !listeners.once)
        || (context && listeners.context !== context)
      ) {
        events.push(listeners);
      }
    } else {
      for (var i = 0, length = listeners.length; i < length; i++) {
        if (
             listeners[i].fn !== fn
          || (once && !listeners[i].once)
          || (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) {
    this._events[evt] = events.length === 1 ? events[0] : events;
  } else {
    delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[prefix ? prefix + event : event];
  else this._events = prefix ? {} : Object.create(null);

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Expose the module.
//
module.exports = EventEmitter;

},{}],3:[function(_dereq_,module,exports){
/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Cursor is expected to be required in a node or other CommonJS context:
 *
 *     var Cursor = require('immutable/contrib/cursor');
 *
 * If you wish to use it in the browser, please check out Browserify or WebPack!
 */

var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var Iterable = Immutable.Iterable;
var Iterator = Iterable.Iterator;
var Seq = Immutable.Seq;
var Map = Immutable.Map;


function cursorFrom(rootData, keyPath, onChange) {
  if (arguments.length === 1) {
    keyPath = [];
  } else if (typeof keyPath === 'function') {
    onChange = keyPath;
    keyPath = [];
  } else {
    keyPath = valToKeyPath(keyPath);
  }
  return makeCursor(rootData, keyPath, onChange);
}


var KeyedCursorPrototype = Object.create(Seq.Keyed.prototype);
var IndexedCursorPrototype = Object.create(Seq.Indexed.prototype);

function KeyedCursor(rootData, keyPath, onChange, size) {
  this.size = size;
  this._rootData = rootData;
  this._keyPath = keyPath;
  this._onChange = onChange;
}
KeyedCursorPrototype.constructor = KeyedCursor;

function IndexedCursor(rootData, keyPath, onChange, size) {
  this.size = size;
  this._rootData = rootData;
  this._keyPath = keyPath;
  this._onChange = onChange;
}
IndexedCursorPrototype.constructor = IndexedCursor;

KeyedCursorPrototype.toString = function() {
  return this.__toString('Cursor {', '}');
}
IndexedCursorPrototype.toString = function() {
  return this.__toString('Cursor [', ']');
}

KeyedCursorPrototype.deref =
KeyedCursorPrototype.valueOf =
IndexedCursorPrototype.deref =
IndexedCursorPrototype.valueOf = function(notSetValue) {
  return this._rootData.getIn(this._keyPath, notSetValue);
}

KeyedCursorPrototype.get =
IndexedCursorPrototype.get = function(key, notSetValue) {
  return this.getIn([key], notSetValue);
}

KeyedCursorPrototype.getIn =
IndexedCursorPrototype.getIn = function(keyPath, notSetValue) {
  keyPath = listToKeyPath(keyPath);
  if (keyPath.length === 0) {
    return this;
  }
  var value = this._rootData.getIn(newKeyPath(this._keyPath, keyPath), NOT_SET);
  return value === NOT_SET ? notSetValue : wrappedValue(this, keyPath, value);
}

IndexedCursorPrototype.set =
KeyedCursorPrototype.set = function(key, value) {
  return updateCursor(this, function (m) { return m.set(key, value); }, [key]);
}

IndexedCursorPrototype.push = function(/* values */) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.push.apply(m, args);
  });
}

IndexedCursorPrototype.pop = function() {
  return updateCursor(this, function (m) {
    return m.pop();
  });
}

IndexedCursorPrototype.unshift = function(/* values */) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.unshift.apply(m, args);
  });
}

IndexedCursorPrototype.shift = function() {
  return updateCursor(this, function (m) {
    return m.shift();
  });
}

IndexedCursorPrototype.setIn =
KeyedCursorPrototype.setIn = Map.prototype.setIn;

KeyedCursorPrototype.remove =
KeyedCursorPrototype['delete'] =
IndexedCursorPrototype.remove =
IndexedCursorPrototype['delete'] = function(key) {
  return updateCursor(this, function (m) { return m.remove(key); }, [key]);
}

IndexedCursorPrototype.removeIn =
IndexedCursorPrototype.deleteIn =
KeyedCursorPrototype.removeIn =
KeyedCursorPrototype.deleteIn = Map.prototype.deleteIn;

KeyedCursorPrototype.clear =
IndexedCursorPrototype.clear = function() {
  return updateCursor(this, function (m) { return m.clear(); });
}

IndexedCursorPrototype.update =
KeyedCursorPrototype.update = function(keyOrFn, notSetValue, updater) {
  return arguments.length === 1 ?
    updateCursor(this, keyOrFn) :
    this.updateIn([keyOrFn], notSetValue, updater);
}

IndexedCursorPrototype.updateIn =
KeyedCursorPrototype.updateIn = function(keyPath, notSetValue, updater) {
  return updateCursor(this, function (m) {
    return m.updateIn(keyPath, notSetValue, updater);
  }, keyPath);
}

IndexedCursorPrototype.merge =
KeyedCursorPrototype.merge = function(/*...iters*/) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.merge.apply(m, args);
  });
}

IndexedCursorPrototype.mergeWith =
KeyedCursorPrototype.mergeWith = function(merger/*, ...iters*/) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.mergeWith.apply(m, args);
  });
}

IndexedCursorPrototype.mergeIn =
KeyedCursorPrototype.mergeIn = Map.prototype.mergeIn;

IndexedCursorPrototype.mergeDeep =
KeyedCursorPrototype.mergeDeep = function(/*...iters*/) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.mergeDeep.apply(m, args);
  });
}

IndexedCursorPrototype.mergeDeepWith =
KeyedCursorPrototype.mergeDeepWith = function(merger/*, ...iters*/) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.mergeDeepWith.apply(m, args);
  });
}

IndexedCursorPrototype.mergeDeepIn =
KeyedCursorPrototype.mergeDeepIn = Map.prototype.mergeDeepIn;

KeyedCursorPrototype.withMutations =
IndexedCursorPrototype.withMutations = function(fn) {
  return updateCursor(this, function (m) {
    return (m || Map()).withMutations(fn);
  });
}

KeyedCursorPrototype.cursor =
IndexedCursorPrototype.cursor = function(subKeyPath) {
  subKeyPath = valToKeyPath(subKeyPath);
  return subKeyPath.length === 0 ? this : subCursor(this, subKeyPath);
}

/**
 * All iterables need to implement __iterate
 */
KeyedCursorPrototype.__iterate =
IndexedCursorPrototype.__iterate = function(fn, reverse) {
  var cursor = this;
  var deref = cursor.deref();
  return deref && deref.__iterate ? deref.__iterate(
    function (v, k) { return fn(wrappedValue(cursor, [k], v), k, cursor); },
    reverse
  ) : 0;
}

/**
 * All iterables need to implement __iterator
 */
KeyedCursorPrototype.__iterator =
IndexedCursorPrototype.__iterator = function(type, reverse) {
  var deref = this.deref();
  var cursor = this;
  var iterator = deref && deref.__iterator &&
    deref.__iterator(Iterator.ENTRIES, reverse);
  return new Iterator(function () {
    if (!iterator) {
      return { value: undefined, done: true };
    }
    var step = iterator.next();
    if (step.done) {
      return step;
    }
    var entry = step.value;
    var k = entry[0];
    var v = wrappedValue(cursor, [k], entry[1]);
    return {
      value: type === Iterator.KEYS ? k : type === Iterator.VALUES ? v : [k, v],
      done: false
    };
  });
}

KeyedCursor.prototype = KeyedCursorPrototype;
IndexedCursor.prototype = IndexedCursorPrototype;


var NOT_SET = {}; // Sentinel value

function makeCursor(rootData, keyPath, onChange, value) {
  if (arguments.length < 4) {
    value = rootData.getIn(keyPath);
  }
  var size = value && value.size;
  var CursorClass = Iterable.isIndexed(value) ? IndexedCursor : KeyedCursor;
  return new CursorClass(rootData, keyPath, onChange, size);
}

function wrappedValue(cursor, keyPath, value) {
  return Iterable.isIterable(value) ? subCursor(cursor, keyPath, value) : value;
}

function subCursor(cursor, keyPath, value) {
  if (arguments.length < 3) {
    return makeCursor( // call without value
      cursor._rootData,
      newKeyPath(cursor._keyPath, keyPath),
      cursor._onChange
    );
  }
  return makeCursor(
    cursor._rootData,
    newKeyPath(cursor._keyPath, keyPath),
    cursor._onChange,
    value
  );
}

function updateCursor(cursor, changeFn, changeKeyPath) {
  var deepChange = arguments.length > 2;
  var newRootData = cursor._rootData.updateIn(
    cursor._keyPath,
    deepChange ? Map() : undefined,
    changeFn
  );
  var keyPath = cursor._keyPath || [];
  var result = cursor._onChange && cursor._onChange.call(
    undefined,
    newRootData,
    cursor._rootData,
    deepChange ? newKeyPath(keyPath, changeKeyPath) : keyPath
  );
  if (result !== undefined) {
    newRootData = result;
  }
  return makeCursor(newRootData, cursor._keyPath, cursor._onChange);
}

function newKeyPath(head, tail) {
  return head.concat(listToKeyPath(tail));
}

function listToKeyPath(list) {
  return Array.isArray(list) ? list : Immutable.Iterable(list).toArray();
}

function valToKeyPath(val) {
  return Array.isArray(val) ? val :
    Iterable.isIterable(val) ? val.toArray() :
    [val];
}

exports.from = cursorFrom;

},{"immutable":undefined}],4:[function(_dereq_,module,exports){
(function (global){
'use strict';

var Immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);
var Cursor = _dereq_('immutable/contrib/cursor/index');
var EventEmitter = _dereq_('eventemitter3');
var utils = _dereq_('./utils');

var LISTENER_SENTINEL = {};

 /**
 * Creates a new `Structure` instance. Also accessible through
 * `Immstruct.Structre`.
 *
 * ### Examples:
 *
 *     var Structure = require('immstruct/structure');
 *     var s = new Structure({ data: { foo: 'bar' }});
 *
 *     // Or:
 *     // var Structure = require('immstruct').Structure;
 *
 * ### Options
 *
 * ```
 * {
 *   key: String, // Defaults to random string
 *   data: Object|Immutable, // defaults to empty Map
 *   history: Boolean, // Defaults to false
 *   historyLimit: Number, // If history enabled, Defaults to Infinity
 * }
 * ```
 *
 * @property {Immutable.List} history `Immutable.List` with history.
 * @property {Object|Immutable} current Provided data as immutable data
 * @property {String} key Generated or provided key.
 *
 *
 * @param {{ key: String, data: Object, history: Boolean }} [options] - defaults to random key and empty data (immutable structure). No history
 *
 * @constructor
 * @class {Structure}
 * @returns {Structure}
 * @api public
 */
function Structure (options) {
  var self = this;

  options = options || {};
  if (!(this instanceof Structure)) {
    return new Structure(options);
  }

  this.key = options.key || utils.generateRandomKey();

  this._queuedChange = false;
  this.current = options.data;
  if (!isImmutableStructure(this.current) || !this.current) {
    this.current = Immutable.fromJS(this.current || {});
  }

  if (!!options.history) {
    this.history = Immutable.List.of(this.current);
    this._currentRevision = 0;
    this._historyLimit = (typeof options.historyLimit === 'number') ?
      options.historyLimit :
      Infinity;
  }

  this._referencelisteners = Immutable.Map();
  this.on('swap', function (newData, oldData, keyPath) {
    var path, args = [keyPath, newData, oldData];
    if (!keyPath || keyPath.length === 0) {
      return emit(self._referencelisteners, newData, oldData, [], args);
    }
    path = keyPath[0];
    emit(self._referencelisteners.get(path), newData.get(path), oldData.get(path),
      keyPath.slice(1), args);
  });

  EventEmitter.call(this, arguments);
}
inherits(Structure, EventEmitter);
module.exports = Structure;

function emit(map, newData, oldData, path, args) {
  if (!map || newData === oldData) return;
  map.get(LISTENER_SENTINEL, []).forEach(function (fn) {
    fn.apply(null, args);
  });

  if (path.length > 0) {
    var nextPathRoot = path[0];
    if (!newData.get) return;
    return emit(map.get(nextPathRoot), newData.get(nextPathRoot),
      oldData.get(nextPathRoot), path.slice(1), args);
  }

  map.forEach(function(value, key) {
    if (key === LISTENER_SENTINEL) return;
    var passedNewData = (newData && newData.get) ? newData.get(key) : newData;
    var passedOldData = (oldData && oldData.get) ? oldData.get(key) : oldData;
    emit(value, passedNewData, passedOldData, [], args);
  });
}

/**
 * Create a Immutable.js Cursor for a given `path` on the `current` structure (see `Structure.current`).
 * Changes made through created cursor will cause a `swap` event to happen (see `Events`).
 *
 * ### Examples:
 *
 *     var Structure = require('immstruct/structure');
 *     var s = new Structure({ data: { foo: 'bar', a: { b: 'foo' } }});
 *     s.cursor().set('foo', 'hello');
 *     s.cursor('foo').update(function () { return 'Changed'; });
 *     s.cursor(['a', 'b']).update(function () { return 'bar'; });
 *
 * See more examples in the [tests](https://github.com/omniscientjs/immstruct/blob/master/tests/structure_test.js)
 *
 * @param {String|Array} [path] - defaults to empty string. Can be array for path. See Immutable.js Cursors
 *
 * @api public
 * @module structure.cursor
 * @returns {Cursor} Gives a Cursor from Immutable.js
 */
Structure.prototype.cursor = function (path) {
  var self = this;
  path = valToKeyPath(path) || [];

  if (!this.current) {
    throw new Error('No structure loaded.');
  }

  var changeListener = function (newRoot, oldRoot, path) {
    if(self.current === oldRoot) {
      self.current = newRoot;
    } else if(!hasIn(newRoot, path)) {
      // Othewise an out-of-sync change occured. We ignore `oldRoot`, and focus on
      // changes at path `path`, and sync this to `self.current`.
      self.current = self.current.removeIn(path);
    } else {
      // Update an existing path or add a new path within the current map.
      self.current = self.current.setIn(path, newRoot.getIn(path));
    }

    return self.current;
  };

  changeListener = handleHistory(this, changeListener);
  changeListener = handleSwap(this, changeListener);
  changeListener = handlePersisting(this, changeListener);
  return Cursor.from(self.current, path, changeListener);
};

/**
 * Creates a reference. A reference can be a pointer to a cursor, allowing
 * you to create cursors for a specific path any time. This is essentially
 * a way to have "always updated cursors" or Reference Cursors. See example
 * for better understanding the concept.
 *
 * References also allow you to listen for changes specific for a path.
 *
 * ### Examples:
 *
 *     var structure = immstruct({
 *       someBox: { message: 'Hello World!' }
 *     });
 *     var ref = structure.reference(['someBox']);
 *
 *     var unobserve = ref.observe(function () {
 *       // Called when data the path 'someBox' is changed.
 *       // Also called when the data at ['someBox', 'message'] is changed.
 *     });
 *
 *     // Update the data using the ref
 *     ref.cursor().update(function () { return 'updated'; });
 *
 *     // Update the data using the initial structure
 *     structure.cursor(['someBox', 'message']).update(function () { return 'updated again'; });
 *
 *     // Remove the listener
 *     unobserve();
 *
 * See more examples in the [readme](https://github.com/omniscientjs/immstruct)
 *
 * @param {String|Array} [path] - defaults to empty string. Can be array for path. See Immutable.js Cursors
 *
 * @api public
 * @module structure.reference
 * @returns {Reference}
 * @constructor
 */
Structure.prototype.reference = function (path) {
  if (isCursor(path) && path._keyPath) {
    path = path._keyPath;
  }

  path = valToKeyPath(path) || [];

  var self = this,
      cursor = this.cursor(path),
      unobservers = Immutable.Set();

  function cursorRefresher() {cursor = self.cursor(path); }
  function _subscribe (path, fn) {
    self._referencelisteners = subscribe(self._referencelisteners, path, fn);
  }
  function _unsubscribe (path, fn) {
    self._referencelisteners = unsubscribe(self._referencelisteners, path, fn);
  }

  _subscribe(path, cursorRefresher);

  return {
    /**
     * Observe for changes on a reference.
     *
     * ### Examples:
     *
     *     var ref = structure.reference(['someBox']);
     *
     *     var unobserve = ref.observe('delete', function () {
     *       // Called when data the path 'someBox' is removed from the structure.
     *     });
     *
     * See more examples in the [readme](https://github.com/omniscientjs/immstruct)
     *
     * ### Event names
     * Event names can be either
     *
     *  * `add`: When new data/value is added
     *  * `delete`: When data/value is removed
     *  * `change`: When data/value is updated and it existed before
     *  * `swap`: When cursor is updated (new information is set). Emits no values. One use case for this is to re-render design components
     *
     * @param {String} [eventName] - Type of change
     * @param {Function} callback - Callback when referenced data is swapped
     *
     * @api public
     * @module reference.observe
     * @returns {Function} Function for removing observer (unobserve)
     */
    observe: function (eventName, newFn) {
      if (typeof eventName === 'function') {
        newFn = eventName;
        eventName = void 0;
      }
      if (this._dead || typeof newFn !== 'function') return;
      if (eventName && eventName !== 'swap') {
        newFn = onlyOnEvent(eventName, newFn);
      }

      _subscribe(path, newFn);
      unobservers = unobservers.add(newFn);

      return function unobserve () {
        _unsubscribe(path, newFn);
      };
    },

    /**
     * Create a new, updated, cursor from the base path provded to the
     * reference. This returns a Immutable.js Cursor as the regular
     * cursor method. You can also provide a sub-path to create a reference
     * in a deeper level.
     *
     * ### Examples:
     *
     *     var ref = structure.reference(['someBox']);
     *     var cursor = ref.cursor('someSubPath');
     *     var cursor2 = ref.cursor();
     *
     * See more examples in the [readme](https://github.com/omniscientjs/immstruct)
     *
     * @param {String} [subpath] - Subpath to a deeper structure
     *
     * @api public
     * @module reference.cursor
     * @returns {Cursor} Immutable.js cursor
     */
    cursor: function (subPath) {
      if (this._dead) return void 0;
      subPath = valToKeyPath(subPath);
      if (subPath) return cursor.cursor(subPath);
      return cursor;
    },

    /**
     * Remove all observers from reference.
     *
     * @api public
     * @module reference.unobserveAll
     * @returns {Void}
     */
    unobserveAll: function (destroy) {
      if (this._dead) return void 0;
      unobservers.forEach(function(fn) {
        _unsubscribe(path, fn);
      });

      if (destroy) {
        _unsubscribe(path, cursorRefresher);
      }
    },

    /**
     * Destroy reference. Unobserve all observers, set all endpoints of reference to dead.
     * For cleaning up memory.
     *
     * @api public
     * @module reference.destroy
     * @returns {Void}
     */
    destroy: function () {
      cursor = void 0;
      this.unobserveAll(true);

      this._dead = true;
      this.observe = void 0;
      this.unobserveAll = void 0;
      this.cursor = void 0;
      this.destroy = void 0;

      cursorRefresher = void 0;
      _unsubscribe = void 0;
      _subscribe = void 0;
    }
  };
};

/**
 * Force emitting swap event. Pass on new, old and keypath passed to swap.
 * If newData is `null` current will be used.
 *
 * @param {Object} newData - Immutable object for the new data to emit
 * @param {Object} oldData - Immutable object for the old data to emit
 * @param {String} keyPath - Structure path (in tree) to where the changes occured.
 *
 * @api public
 * @module structure.forceHasSwapped
 * @returns {Void}
 */
Structure.prototype.forceHasSwapped = function (newData, oldData, keyPath) {
  this.emit('swap', newData || this.current, oldData, keyPath);
  possiblyEmitAnimationFrameEvent(this, newData || this.current, oldData, keyPath);
};


/**
 * Undo IFF history is activated and there are steps to undo. Returns new current
 * immutable structure.
 *
 * **Will NOT emit swap when redo. You have to do this yourself**.
 *
 * Define number of steps to undo in param.
 *
 * @param {Number} steps - Number of steps to undo
 *
 * @api public
 * @module structure.undo
 * @returns {Object} New Immutable structure after undo
 */
Structure.prototype.undo = function(steps) {
  this._currentRevision -= steps || 1;
  if (this._currentRevision < 0) {
    this._currentRevision = 0;
  }

  this.current = this.history.get(this._currentRevision);
  return this.current;
};

/**
 * Redo IFF history is activated and you can redo. Returns new current immutable structure.
 * Define number of steps to redo in param.
 * **Will NOT emit swap when redo. You have to do this yourself**.
 *
 * @param {Number} head - Number of steps to head to in redo
 *
 * @api public
 * @module structure.redo
 * @returns {Object} New Immutable structure after redo
 */
Structure.prototype.redo = function(head) {
  this._currentRevision += head || 1;
  if (this._currentRevision > this.history.count() - 1) {
    this._currentRevision = this.history.count() - 1;
  }

  this.current = this.history.get(this._currentRevision);
  return this.current;
};

/**
 * Undo IFF history is activated and passed `structure` exists in history.
 * Returns the same immutable structure as passed as argument.
 *
 * **Will NOT emit swap after undo. You have to do this yourself**.
 *
 * @param {Object} structure - Immutable structure to redo until
 *
 * @api public
 * @module structure.undoUntil
 * @returns {Object} New Immutable structure after undo
 */
Structure.prototype.undoUntil = function(structure) {
  this._currentRevision = this.history.indexOf(structure);
  this.current = structure;

  return structure;
};


function subscribe(listeners, path, fn) {
  return listeners.updateIn(path.concat(LISTENER_SENTINEL), Immutable.OrderedSet(), function(old) {
    return old.add(fn);
  });
}

function unsubscribe(listeners, path, fn) {
  return listeners.updateIn(path.concat(LISTENER_SENTINEL), Immutable.OrderedSet(), function(old) {
    return old.remove(fn);
  });
}

// Private decorators.

// Update history if history is active
function handleHistory (emitter, fn) {
  return function (newData, oldData, path) {
    var newStructure = fn.apply(fn, arguments);
    if (!emitter.history || (newData === oldData)) return newStructure;

    emitter.history = emitter.history
      .take(++emitter._currentRevision)
      .push(emitter.current);

    if (emitter.history.size > emitter._historyLimit) {
      emitter.history = emitter.history.takeLast(emitter._historyLimit);
      emitter._currentRevision -= (emitter.history.size - emitter._historyLimit);
    }

    return newStructure;
  };
}

var _requestAnimationFrame = (typeof window !== 'undefined' && window.requestAnimationFrame) || function () { };

// Update history if history is active
function possiblyEmitAnimationFrameEvent (emitter, newStructure, oldData, keyPath) {
  if (emitter._queuedChange) return;
  emitter._queuedChange = true;

  _requestAnimationFrame(function () {
    emitter._queuedChange = false;
    emitter.emit('next-animation-frame', newStructure, oldData, keyPath);
  });
}

// Emit swap event on values are swapped
function handleSwap (emitter, fn) {
  return function (newData, oldData, keyPath) {
    var newStructure = fn.apply(fn, arguments);
    if(newData === oldData) return newStructure;

    emitter.emit('swap', newStructure, oldData, keyPath);
    possiblyEmitAnimationFrameEvent(emitter, newStructure, oldData, keyPath);

    return newStructure;
  };
}

// Map changes to update events (delete/change/add).
function handlePersisting (emitter, fn) {
  return function (newData, oldData, path) {
    var newStructure = fn.apply(fn, arguments);
    if(newData === oldData) return newStructure;
    var info = analyze(newData, oldData, path);

    if (info.eventName) {
      emitter.emit.apply(emitter, [info.eventName].concat(info.args));
    }
    return newStructure;
  };
}

// Private helpers.

function unobserver(listenerNs, observerFn) {
  return function() {
    var fnIndex = listenerNs.indexOf(observerFn);
    if (fnIndex > -1) {
      listenerNs.splice(fnIndex, 1);
    }
  }
}

function analyze (newData, oldData, path) {
  var oldObject = oldData && oldData.getIn(path);
  var newObject = newData && newData.getIn(path);

  var inOld = oldData && hasIn(oldData, path);
  var inNew = newData && hasIn(newData, path);

  var args, eventName;

  if (inOld && !inNew) {
    eventName = 'delete';
    args = [path, oldObject];
  } else if (inOld && inNew) {
    eventName = 'change';
    args = [path, newObject, oldObject];
  } else if (!inOld && inNew) {
    eventName = 'add';
    args = [path, newObject];
  }

  return {
    eventName: eventName,
    args: args
  };
}

// Check if path exists.
var NOT_SET = {};
function hasIn(cursor, path) {
  if(cursor.hasIn) return cursor.hasIn(path);
  return cursor.getIn(path, NOT_SET) !== NOT_SET;
}

function onlyOnEvent(eventName, fn) {
  return function (keyPath, newData, oldData) {
    var info = analyze(newData, oldData, keyPath);
    if (info.eventName !== eventName) return;
    return fn.apply(fn, info.args);
  };
}

function isCursor (potential) {
  return potential && typeof potential.deref === 'function';
}

// Check if passed structure is existing immutable structure.
// From https://github.com/facebook/immutable-js/wiki/Upgrading-to-Immutable-v3#additional-changes
var immutableCheckers = [
  {name: 'Iterable', method: 'isIterable' },
  {name: 'Seq', method: 'isSeq'},
  {name: 'Map', method: 'isMap'},
  {name: 'OrderedMap', method: 'isOrderedMap'},
  {name: 'List', method: 'isList'},
  {name: 'Stack', method: 'isStack'},
  {name: 'Set', method: 'isSet'}
];
function isImmutableStructure (data) {
  return immutableCheckers.some(function (checkItem) {
    return immutableSafeCheck(checkItem.name, checkItem.method, data);
  });
}

function immutableSafeCheck (ns, method, data) {
  return Immutable[ns] && Immutable[ns][method] && Immutable[ns][method](data);
}

function valToKeyPath(val) {
  if (typeof val === 'undefined') {
    return val;
  }
  return Array.isArray(val) ? val :
    immutableSafeCheck('Iterable', 'isIterable', val) ?
      val.toArray() : [val];
}

function inherits (c, p) {
  var e = {};
  Object.getOwnPropertyNames(c.prototype).forEach(function (k) {
    e[k] = Object.getOwnPropertyDescriptor(c.prototype, k)
  });
  c.prototype = Object.create(p.prototype, e)
  c.super = p
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":5,"eventemitter3":2,"immutable/contrib/cursor/index":3}],5:[function(_dereq_,module,exports){
'use strict';

module.exports.generateRandomKey = function (len) {
  len = len || 10;
  return Math.random().toString(36).substring(2).substring(0, len);
};
},{}]},{},[1])(1)
});