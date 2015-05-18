(function(){
var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }

  var registry = {}, seen = {};
  var FAILED = false;

  var uuid = 0;

  function tryFinally(tryable, finalizer) {
    try {
      return tryable();
    } finally {
      finalizer();
    }
  }

  function unsupportedModule(length) {
    throw new Error("an unsupported module was defined, expected `define(name, deps, module)` instead got: `" + length + "` arguments to define`");
  }

  var defaultDeps = ['require', 'exports', 'module'];

  function Module(name, deps, callback, exports) {
    this.id       = uuid++;
    this.name     = name;
    this.deps     = !deps.length && callback.length ? defaultDeps : deps;
    this.exports  = exports || { };
    this.callback = callback;
    this.state    = undefined;
    this._require  = undefined;
  }


  Module.prototype.makeRequire = function() {
    var name = this.name;

    return this._require || (this._require = function(dep) {
      return require(resolve(dep, name));
    });
  }

  define = function(name, deps, callback) {
    if (arguments.length < 2) {
      unsupportedModule(arguments.length);
    }

    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }

    registry[name] = new Module(name, deps, callback);
  };

  // we don't support all of AMD
  // define.amd = {};
  // we will support petals...
  define.petal = { };

  function Alias(path) {
    this.name = path;
  }

  define.alias = function(path) {
    return new Alias(path);
  };

  function reify(mod, name, seen) {
    var deps = mod.deps;
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    // TODO: new Module
    // TODO: seen refactor
    var module = { };

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        module.exports = reified[i] = seen;
      } else if (dep === 'require') {
        reified[i] = mod.makeRequire();
      } else if (dep === 'module') {
        mod.exports = seen;
        module = reified[i] = mod;
      } else {
        reified[i] = requireFrom(resolve(dep, name), name);
      }
    }

    return {
      deps: reified,
      module: module
    };
  }

  function requireFrom(name, origin) {
    var mod = registry[name];
    if (!mod) {
      throw new Error('Could not find module `' + name + '` imported from `' + origin + '`');
    }
    return require(name);
  }

  function missingModule(name) {
    throw new Error('Could not find module ' + name);
  }
  requirejs = require = requireModule = function(name) {
    var mod = registry[name];


    if (mod && mod.callback instanceof Alias) {
      mod = registry[mod.callback.name];
    }

    if (!mod) { missingModule(name); }

    if (mod.state !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    tryFinally(function() {
      reified = reify(mod, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    }, function() {
      if (!loaded) {
        mod.state = FAILED;
      }
    });

    var obj;
    if (module === undefined && reified.module.exports) {
      obj = reified.module.exports;
    } else {
      obj = seen[name] = module;
    }

    if (obj !== null &&
        (typeof obj === 'object' || typeof obj === 'function') &&
          obj['default'] === undefined) {
      obj['default'] = obj;
    }

    return (seen[name] = obj);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase = nameParts.slice(0, -1);

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') {
        if (parentBase.length === 0) {
          throw new Error('Cannot access parent module of root');
        }
        parentBase.pop();
      } else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

define("ember-cli-app-version", ["ember-cli-app-version/index", "ember", "exports"], function(__index__, __Ember__, __exports__) {
  "use strict";
  __Ember__["default"].keys(__index__).forEach(function(key){
    __exports__[key] = __index__[key];
  });
});

define("ember-cli-content-security-policy", ["ember-cli-content-security-policy/index", "ember", "exports"], function(__index__, __Ember__, __exports__) {
  "use strict";
  __Ember__["default"].keys(__index__).forEach(function(key){
    __exports__[key] = __index__[key];
  });
});

define("ember-islands", ["ember-islands/index", "ember", "exports"], function(__index__, __Ember__, __exports__) {
  "use strict";
  __Ember__["default"].keys(__index__).forEach(function(key){
    __exports__[key] = __index__[key];
  });
});

define('ember-islands/deactivate-routing', ['exports', 'ember'], function (exports, Ember) {

  'use strict';



  exports['default'] = deactivateRouting;
  var noop = Ember['default'].K;
  function deactivateRouting(application) {
    if (application.startRouting) {
      application.startRouting = noop;
    } else if (application.__deprecatedInstance__ && application.__deprecatedInstance__.startRouting) {
      application.__deprecatedInstance__.startRouting = noop;
    } else {
      Ember['default'].assert("ember-islands doesn't know how to cancel routing for this" + "version of Ember. Please report this issue to https://github.com/mitchlloyd/ember-islands" + "with the version of Ember you are using (Ember.VERSION)");
    }
  }

});
define('ember-islands/render-components', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.getRenderComponentFor = getRenderComponentFor;

  // Do a little dance with Ember to create a function that can render
  // components for the given application.
  exports['default'] = renderComponents;
  var assert = Ember['default'].assert;
  var $ = Ember['default'].$;
  function getRenderComponentFor(application) {
    var container = application.__container__;
    var componentLookup = container.lookup('component-lookup:main');

    return function renderComponent(name, attributes, element) {
      var component = componentLookup.lookupFactory(name, container);
      assert('ember-islands could not find a component named "' + name + '" in your Ember appliction.', component);

      // Temporary fix for bug in `replaceIn`
      $(element).empty();
      component.create(attributes).replaceIn(element);
    };
  }

  function componentAttributes(element) {
    var attrs;
    var attrsJSON = element.getAttribute('data-attrs');

    if (attrsJSON) {
      attrs = JSON.parse(attrsJSON);
    } else {
      attrs = {};
    }

    attrs.innerContent = element.innerHTML;
    return attrs;
  }
  function renderComponents(application) {
    var renderComponent = getRenderComponentFor(application);

    $('[data-component]').each(function () {
      var name = this.getAttribute('data-component');
      var attrs = componentAttributes(this);
      renderComponent(name, attrs, this);
    });
  }

});
/* global requirejs, require, define */
define('giftwrap-internal/container-injector', ['exports'], function (exports) {
  if (window.Ember) {
    define('ember', ['exports'], function(exports) {
      exports.default = window.Ember;
    });
  }
  exports.install = function(app) {
    for (var moduleName in requirejs.entries) {
      var m = /giftwrap\/([^\/]+)s\/(.*)/.exec(moduleName);
      if (m) {
        var type = m[1];
        var name = m[2];
        app.register(type + ":" + name, require(moduleName).default);
        app.register(type + ":" + require('ember')['default'].String.camelize(name), require(moduleName).default);
      }
    }
  };
  exports.require = require;
  exports.define = require;
  exports.env = require('giftwrap/config/environment').default;
});
define('giftwrap/config/environment', ['exports'], function (exports) {
  exports.default = {};
});

define('giftwrap/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('giftwrap/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('giftwrap/initializers/app-version', ['exports', 'giftwrap/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('giftwrap/initializers/boot-ember-islands', ['exports', 'ember', 'ember-islands/deactivate-routing', 'ember-islands/render-components'], function (exports, Ember, deactivateRouting, renderComponents) {

  'use strict';

  exports.initialize = initialize;

  var get = Ember['default'].get;
  function initialize(registry, application) {
    if (get(application, 'EMBER_ISLANDS.bypass')) {
      return;
    }

    deactivateRouting['default'](application);
    renderComponents['default'](application);
  }

  ;

  exports['default'] = {
    name: 'boot-ember-islands',
    after: 'registerComponentLookup',
    initialize: initialize
  };

});
define('giftwrap/initializers/export-application-global', ['exports', 'ember', 'giftwrap/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
window.GiftWrap = require('giftwrap-internal/container-injector');})();//# sourceMappingURL=addons.map