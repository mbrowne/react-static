"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.buildConfig = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _path = _interopRequireDefault(require("path"));

var _chokidar = _interopRequireDefault(require("chokidar"));

var _resolveFrom = _interopRequireDefault(require("resolve-from"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _getDirname = _interopRequireDefault(require("../utils/getDirname"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// the default static.config.js location
var defaultConfig = {};
var DEFAULT_NAME_FOR_STATIC_CONFIG_FILE = 'static.config';

var DEFAULT_PATH_FOR_STATIC_CONFIG = _path.default.resolve(_path.default.join(process.cwd(), DEFAULT_NAME_FOR_STATIC_CONFIG_FILE));

var DEFAULT_ROUTES = [{
  path: '/'
}];
var DEFAULT_ENTRY = 'index';
var DEFAULT_EXTENSIONS = ['.js', '.jsx'];

var buildConfig =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var config,
        resolvePath,
        DIST,
        ASSETS,
        paths,
        siteRoot,
        basePath,
        publicPath,
        assetsPath,
        plugins,
        DEFAULT_ENTRY_PATH,
        resolvePlugin,
        configHook,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            config = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
            // path defaults
            config.paths = _objectSpread({
              root: _path.default.resolve(process.cwd()),
              src: 'src',
              dist: 'dist',
              temp: 'tmp',
              buildArtifacts: 'artifacts',
              devDist: 'tmp/dev-server',
              public: 'public',
              plugins: 'plugins',
              pages: 'src/pages',
              nodeModules: 'node_modules',
              assets: ''
            }, config.paths || {}); // Use the root to resolve all other relative paths

            resolvePath = function resolvePath(relativePath) {
              return _path.default.resolve(config.paths.root, relativePath);
            }; // Resolve all paths


            DIST = process.env.REACT_STATIC_ENV === 'development' ? resolvePath(config.paths.devDist || config.paths.dist) : resolvePath(config.paths.dist);
            ASSETS = _path.default.resolve(DIST, config.paths.assets);
            paths = {
              ROOT: config.paths.root,
              LOCAL_NODE_MODULES: _path.default.resolve((0, _getDirname.default)(), '../../node_modules'),
              SRC: resolvePath(config.paths.src),
              PAGES: resolvePath(config.paths.pages),
              DIST: DIST,
              ASSETS: ASSETS,
              PLUGINS: resolvePath(config.paths.plugins),
              TEMP: resolvePath(config.paths.temp),
              BUILD_ARTIFACTS: resolvePath(config.paths.buildArtifacts),
              PUBLIC: resolvePath(config.paths.public),
              NODE_MODULES: resolvePath(config.paths.nodeModules),
              EXCLUDE_MODULES: config.paths.excludeResolvedModules || resolvePath(config.paths.nodeModules),
              PACKAGE: resolvePath('package.json'),
              HTML_TEMPLATE: _path.default.join(DIST, 'index.html'),
              STATIC_DATA: _path.default.join(ASSETS, 'staticData')
            };
            siteRoot = '';
            basePath = '';

            if (process.env.REACT_STATIC_ENV === 'development') {
              basePath = (0, _utils.cleanSlashes)(config.devBasePath);
            } else if (process.env.REACT_STATIC_STAGING === 'true') {
              siteRoot = (0, _utils.cutPathToRoot)(config.stagingSiteRoot, '$1');
              basePath = (0, _utils.cleanSlashes)(config.stagingBasePath);
            } else {
              siteRoot = (0, _utils.cutPathToRoot)(config.siteRoot, '$1');
              basePath = (0, _utils.cleanSlashes)(config.basePath);
            }

            publicPath = "".concat((0, _utils.cleanSlashes)("".concat(siteRoot, "/").concat(basePath)), "/");
            assetsPath = (0, _utils.cleanSlashes)(config.assetsPath || paths.assets);

            if (assetsPath && !(0, _utils.isAbsoluteUrl)(assetsPath)) {
              assetsPath = "/".concat((0, _utils.cleanSlashes)("".concat(basePath, "/").concat(assetsPath)), "/");
            } // Add the project root as a plugin. This allows the dev
            // to use the plugin api directory in their project if they want


            plugins = _toConsumableArray(config.plugins || []).concat([paths.ROOT]);
            DEFAULT_ENTRY_PATH = _path.default.join(paths.SRC, DEFAULT_ENTRY); // Defaults

            config = _objectSpread({
              // Defaults
              entry: resolveModule(DEFAULT_ENTRY_PATH, config) || "".concat(DEFAULT_ENTRY_PATH, ".js"),
              getSiteData: function getSiteData() {
                return {};
              },
              prefetchRate: 5,
              maxThreads: Infinity,
              disableRoutePrefixing: false,
              outputFileRate: 100,
              extensions: DEFAULT_EXTENSIONS,
              getRoutes: function () {
                var _getRoutes = _asyncToGenerator(
                /*#__PURE__*/
                _regenerator.default.mark(function _callee() {
                  return _regenerator.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          return _context.abrupt("return", DEFAULT_ROUTES);

                        case 1:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                function getRoutes() {
                  return _getRoutes.apply(this, arguments);
                }

                return getRoutes;
              }(),
              minLoadTime: 200,
              disablePreload: false,
              disableRuntime: false,
              preloadPollInterval: 300
            }, config, {
              // Materialized Overrides
              plugins: plugins,
              paths: paths,
              babelExcludes: config.babelExcludes || [],
              siteRoot: siteRoot,
              basePath: basePath,
              publicPath: publicPath,
              assetsPath: assetsPath,
              extractCssChunks: config.extractCssChunks || false,
              inlineCss: config.inlineCss || false // Set env variables to be used client side

            });
            process.env.REACT_STATIC_MIN_LOAD_TIME = config.minLoadTime;
            process.env.REACT_STATIC_PREFETCH_RATE = config.prefetchRate;
            process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING = config.disableRoutePrefixing;
            process.env.REACT_STATIC_DISABLE_PRELOAD = config.disablePreload;
            process.env.REACT_STATIC_DISABLE_RUNTIME = config.disableRuntime;
            process.env.REACT_STATIC_PRELOAD_POLL_INTERVAL = config.preloadPollInterval;
            process.env.REACT_STATIC_TEMPLATES_PATH = _path.default.join(paths.BUILD_ARTIFACTS, 'react-static-templates.js');
            process.env.REACT_STATIC_PLUGINS_PATH = _path.default.join(paths.BUILD_ARTIFACTS, 'react-static-browser-plugins.js');
            process.env.REACT_STATIC_UNIVERSAL_PATH = require.resolve('react-universal-component');

            resolvePlugin = function resolvePlugin(originalLocation) {
              var options = {};

              if (Array.isArray(originalLocation)) {
                options = originalLocation[1] || {};
                originalLocation = originalLocation[0];
              }

              var location = [function () {
                // Absolute
                if (_fsExtra.default.pathExistsSync(originalLocation)) {
                  return originalLocation;
                }
              }, function () {
                // Absolute require
                try {
                  var found = require.resolve(originalLocation);

                  return found.includes('.') ? _path.default.resolve(found, '../') : found;
                } catch (err) {//
                }
              }, function () {
                // Plugins Dir
                var found = _path.default.resolve(paths.PLUGINS, originalLocation);

                if (_fsExtra.default.pathExistsSync(found)) {
                  return found;
                }
              }, function () {
                // Plugins Dir require
                try {
                  var found = (0, _resolveFrom.default)(paths.PLUGINS, originalLocation);
                  return found.includes('.') ? _path.default.resolve(found, '../') : found;
                } catch (err) {//
                }
              }, function () {
                // CWD
                var found = _path.default.resolve(process.cwd(), originalLocation);

                if (_fsExtra.default.pathExistsSync(found)) {
                  return found;
                }
              }, function () {
                // CWD require
                try {
                  var found = (0, _resolveFrom.default)(process.cwd(), originalLocation);
                  return found.includes('.') ? _path.default.resolve(found, '../') : found;
                } catch (err) {//
                }
              }, function () {
                if (process.env.NODE_ENV === 'test') {
                  // Allow plugins to be mocked
                  return 'mock-plugin';
                }
              }].reduce(function (prev, curr) {
                return prev || curr();
              }, null); // TODO: We have to do this because we don't have a good mock for process.cwd() :(

              if (!location) {
                throw new Error("Oh crap! Could not find a plugin directory for the plugin: \"".concat(originalLocation, "\". We must bail!"));
              }

              var nodeLocation = resolveModule(_path.default.join(location, 'node.api'), config);
              var browserLocation = resolveModule(_path.default.join(location, 'browser.api'), config);

              var getHooks = function getHooks() {
                return {};
              };

              try {
                // Get the hooks for the node api
                if (nodeLocation) {
                  getHooks = require(nodeLocation).default;
                }

                var resolvedPlugin = {
                  location: location,
                  nodeLocation: nodeLocation,
                  browserLocation: browserLocation,
                  options: options,
                  hooks: getHooks(options) || {} // Recursively resolve plugins

                };

                if (resolvedPlugin.plugins) {
                  resolvedPlugin.plugins = resolvedPlugin.plugins.map(resolvePlugin);
                }

                return resolvedPlugin;
              } catch (err) {
                console.error("The following error occurred in the plugin located at \"".concat(nodeLocation, "\""));
                throw err;
              }
            };

            config.plugins = config.plugins.map(resolvePlugin);
            configHook = (0, _utils.makeHookReducer)(config.plugins, 'config');
            _context2.next = 29;
            return configHook(config);

          case 29:
            config = _context2.sent;
            return _context2.abrupt("return", config);

          case 31:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function buildConfig() {
    return _ref.apply(this, arguments);
  };
}();

exports.buildConfig = buildConfig;

var buildConfigFromPath =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(configPath) {
    var config;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            delete require.cache[configPath];
            config = require(configPath).default;
            return _context3.abrupt("return", buildConfig(config));

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function buildConfigFromPath(_x) {
    return _ref2.apply(this, arguments);
  };
}(); // Retrieves the static.config.js from the current project directory


var _default =
/*#__PURE__*/
function () {
  var _getConfig = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee6() {
    var configPath,
        subscription,
        resolvedPath,
        noConfig,
        config,
        _args6 = arguments;
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            configPath = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : DEFAULT_PATH_FOR_STATIC_CONFIG;
            subscription = _args6.length > 1 ? _args6[1] : undefined;
            resolvedPath = resolveModule(configPath);
            noConfig = configPath === DEFAULT_PATH_FOR_STATIC_CONFIG && !resolvedPath;

            if (!noConfig) {
              _context6.next = 8;
              break;
            }

            if (!subscription) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("return", new Promise(
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            _regenerator.default.mark(function _callee4() {
              return _regenerator.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.t0 = subscription;
                      _context4.next = 3;
                      return buildConfig(defaultConfig);

                    case 3:
                      _context4.t1 = _context4.sent;
                      (0, _context4.t0)(_context4.t1);

                    case 5:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4, this);
            }))));

          case 7:
            return _context6.abrupt("return", buildConfig(defaultConfig));

          case 8:
            _context6.next = 10;
            return buildConfigFromPath(resolvedPath || configPath);

          case 10:
            config = _context6.sent;

            if (!subscription) {
              _context6.next = 13;
              break;
            }

            return _context6.abrupt("return", new Promise(function () {
              _chokidar.default.watch(resolvedPath).on('all',
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee5() {
                return _regenerator.default.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.t0 = subscription;
                        _context5.next = 3;
                        return buildConfigFromPath(resolvedPath);

                      case 3:
                        _context5.t1 = _context5.sent;
                        (0, _context5.t0)(_context5.t1);

                      case 5:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5, this);
              })));
            }));

          case 13:
            return _context6.abrupt("return", config);

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  function getConfig() {
    return _getConfig.apply(this, arguments);
  }

  return getConfig;
}();

exports.default = _default;

function resolveModule(path, config) {
  try {
    // Load any module extension that is supported by Node (.js, .mjs, .node, etc),
    // or that have been registered via Node require hooks (.jsx, .ts, etc)
    return require.resolve(path);
  } catch (_unused) {
    // Fallback to the extensions that have been registered with Babel
    var extensions = config && config.extensions || DEFAULT_EXTENSIONS;
    return extensions.map(function (ext) {
      return path + ext;
    }).find(_fsExtra.default.pathExistsSync);
  }
}

;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(defaultConfig, "defaultConfig", "/Users/mbrowne/GoogleDrive/www/react-static/react-static-fork/packages/react-static/src/static/getConfig.js");
  reactHotLoader.register(DEFAULT_NAME_FOR_STATIC_CONFIG_FILE, "DEFAULT_NAME_FOR_STATIC_CONFIG_FILE", "/Users/mbrowne/GoogleDrive/www/react-static/react-static-fork/packages/react-static/src/static/getConfig.js");
  reactHotLoader.register(DEFAULT_PATH_FOR_STATIC_CONFIG, "DEFAULT_PATH_FOR_STATIC_CONFIG", "/Users/mbrowne/GoogleDrive/www/react-static/react-static-fork/packages/react-static/src/static/getConfig.js");
  reactHotLoader.register(DEFAULT_ROUTES, "DEFAULT_ROUTES", "/Users/mbrowne/GoogleDrive/www/react-static/react-static-fork/packages/react-static/src/static/getConfig.js");
  reactHotLoader.register(DEFAULT_ENTRY, "DEFAULT_ENTRY", "/Users/mbrowne/GoogleDrive/www/react-static/react-static-fork/packages/react-static/src/static/getConfig.js");
  reactHotLoader.register(DEFAULT_EXTENSIONS, "DEFAULT_EXTENSIONS", "/Users/mbrowne/GoogleDrive/www/react-static/react-static-fork/packages/react-static/src/static/getConfig.js");
  reactHotLoader.register(buildConfig, "buildConfig", "/Users/mbrowne/GoogleDrive/www/react-static/react-static-fork/packages/react-static/src/static/getConfig.js");
  reactHotLoader.register(buildConfigFromPath, "buildConfigFromPath", "/Users/mbrowne/GoogleDrive/www/react-static/react-static-fork/packages/react-static/src/static/getConfig.js");
  reactHotLoader.register(resolveModule, "resolveModule", "/Users/mbrowne/GoogleDrive/www/react-static/react-static-fork/packages/react-static/src/static/getConfig.js");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();
//# sourceMappingURL=getConfig.js.map