(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // (disabled):../node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "(disabled):../node_modules/buffer/index.js"() {
    }
  });

  // ../node_modules/js-sha1/src/sha1.js
  var require_sha1 = __commonJS({
    "../node_modules/js-sha1/src/sha1.js"(exports, module) {
      (function() {
        "use strict";
        var INPUT_ERROR = "input is invalid type";
        var FINALIZE_ERROR = "finalize already called";
        var WINDOW = typeof window === "object";
        var root = WINDOW ? window : {};
        if (root.JS_SHA1_NO_WINDOW) {
          WINDOW = false;
        }
        var WEB_WORKER = !WINDOW && typeof self === "object";
        var NODE_JS = !root.JS_SHA1_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
        if (NODE_JS) {
          root = global;
        } else if (WEB_WORKER) {
          root = self;
        }
        var COMMON_JS = !root.JS_SHA1_NO_COMMON_JS && typeof module === "object" && module.exports;
        var AMD = typeof define === "function" && define.amd;
        var ARRAY_BUFFER = !root.JS_SHA1_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
        var HEX_CHARS = "0123456789abcdef".split("");
        var EXTRA = [-2147483648, 8388608, 32768, 128];
        var SHIFT = [24, 16, 8, 0];
        var OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"];
        var blocks = [];
        var isArray = Array.isArray;
        if (root.JS_SHA1_NO_NODE_JS || !isArray) {
          isArray = function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
          };
        }
        var isView = ArrayBuffer.isView;
        if (ARRAY_BUFFER && (root.JS_SHA1_NO_ARRAY_BUFFER_IS_VIEW || !isView)) {
          isView = function(obj) {
            return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
          };
        }
        var formatMessage = function(message) {
          var type = typeof message;
          if (type === "string") {
            return [message, true];
          }
          if (type !== "object" || message === null) {
            throw new Error(INPUT_ERROR);
          }
          if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
            return [new Uint8Array(message), false];
          }
          if (!isArray(message) && !isView(message)) {
            throw new Error(INPUT_ERROR);
          }
          return [message, false];
        };
        var createOutputMethod = function(outputType) {
          return function(message) {
            return new Sha1(true).update(message)[outputType]();
          };
        };
        var createMethod = function() {
          var method = createOutputMethod("hex");
          if (NODE_JS) {
            method = nodeWrap(method);
          }
          method.create = function() {
            return new Sha1();
          };
          method.update = function(message) {
            return method.create().update(message);
          };
          for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method[type] = createOutputMethod(type);
          }
          return method;
        };
        var nodeWrap = function(method) {
          var crypto2 = require_crypto();
          var Buffer2 = require_buffer().Buffer;
          var bufferFrom;
          if (Buffer2.from && !root.JS_SHA1_NO_BUFFER_FROM) {
            bufferFrom = Buffer2.from;
          } else {
            bufferFrom = function(message) {
              return new Buffer2(message);
            };
          }
          var nodeMethod = function(message) {
            if (typeof message === "string") {
              return crypto2.createHash("sha1").update(message, "utf8").digest("hex");
            } else {
              if (message === null || message === void 0) {
                throw new Error(INPUT_ERROR);
              } else if (message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
              }
            }
            if (isArray(message) || isView(message) || message.constructor === Buffer2) {
              return crypto2.createHash("sha1").update(bufferFrom(message)).digest("hex");
            } else {
              return method(message);
            }
          };
          return nodeMethod;
        };
        var createHmacOutputMethod = function(outputType) {
          return function(key, message) {
            return new HmacSha1(key, true).update(message)[outputType]();
          };
        };
        var createHmacMethod = function() {
          var method = createHmacOutputMethod("hex");
          method.create = function(key) {
            return new HmacSha1(key);
          };
          method.update = function(key, message) {
            return method.create(key).update(message);
          };
          for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method[type] = createHmacOutputMethod(type);
          }
          return method;
        };
        function Sha1(sharedMemory) {
          if (sharedMemory) {
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            this.blocks = blocks;
          } else {
            this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          }
          this.h0 = 1732584193;
          this.h1 = 4023233417;
          this.h2 = 2562383102;
          this.h3 = 271733878;
          this.h4 = 3285377520;
          this.block = this.start = this.bytes = this.hBytes = 0;
          this.finalized = this.hashed = false;
          this.first = true;
        }
        Sha1.prototype.update = function(message) {
          if (this.finalized) {
            throw new Error(FINALIZE_ERROR);
          }
          var result = formatMessage(message);
          message = result[0];
          var isString = result[1];
          var code, index = 0, i, length = message.length || 0, blocks2 = this.blocks;
          while (index < length) {
            if (this.hashed) {
              this.hashed = false;
              blocks2[0] = this.block;
              this.block = blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
            }
            if (isString) {
              for (i = this.start; index < length && i < 64; ++index) {
                code = message.charCodeAt(index);
                if (code < 128) {
                  blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
                } else if (code < 2048) {
                  blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else if (code < 55296 || code >= 57344) {
                  blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else {
                  code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                  blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                }
              }
            } else {
              for (i = this.start; index < length && i < 64; ++index) {
                blocks2[i >>> 2] |= message[index] << SHIFT[i++ & 3];
              }
            }
            this.lastByteIndex = i;
            this.bytes += i - this.start;
            if (i >= 64) {
              this.block = blocks2[16];
              this.start = i - 64;
              this.hash();
              this.hashed = true;
            } else {
              this.start = i;
            }
          }
          if (this.bytes > 4294967295) {
            this.hBytes += this.bytes / 4294967296 << 0;
            this.bytes = this.bytes % 4294967296;
          }
          return this;
        };
        Sha1.prototype.finalize = function() {
          if (this.finalized) {
            return;
          }
          this.finalized = true;
          var blocks2 = this.blocks, i = this.lastByteIndex;
          blocks2[16] = this.block;
          blocks2[i >>> 2] |= EXTRA[i & 3];
          this.block = blocks2[16];
          if (i >= 56) {
            if (!this.hashed) {
              this.hash();
            }
            blocks2[0] = this.block;
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          blocks2[14] = this.hBytes << 3 | this.bytes >>> 29;
          blocks2[15] = this.bytes << 3;
          this.hash();
        };
        Sha1.prototype.hash = function() {
          var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4;
          var f, j, t, blocks2 = this.blocks;
          for (j = 16; j < 80; ++j) {
            t = blocks2[j - 3] ^ blocks2[j - 8] ^ blocks2[j - 14] ^ blocks2[j - 16];
            blocks2[j] = t << 1 | t >>> 31;
          }
          for (j = 0; j < 20; j += 5) {
            f = b & c | ~b & d;
            t = a << 5 | a >>> 27;
            e = t + f + e + 1518500249 + blocks2[j] << 0;
            b = b << 30 | b >>> 2;
            f = a & b | ~a & c;
            t = e << 5 | e >>> 27;
            d = t + f + d + 1518500249 + blocks2[j + 1] << 0;
            a = a << 30 | a >>> 2;
            f = e & a | ~e & b;
            t = d << 5 | d >>> 27;
            c = t + f + c + 1518500249 + blocks2[j + 2] << 0;
            e = e << 30 | e >>> 2;
            f = d & e | ~d & a;
            t = c << 5 | c >>> 27;
            b = t + f + b + 1518500249 + blocks2[j + 3] << 0;
            d = d << 30 | d >>> 2;
            f = c & d | ~c & e;
            t = b << 5 | b >>> 27;
            a = t + f + a + 1518500249 + blocks2[j + 4] << 0;
            c = c << 30 | c >>> 2;
          }
          for (; j < 40; j += 5) {
            f = b ^ c ^ d;
            t = a << 5 | a >>> 27;
            e = t + f + e + 1859775393 + blocks2[j] << 0;
            b = b << 30 | b >>> 2;
            f = a ^ b ^ c;
            t = e << 5 | e >>> 27;
            d = t + f + d + 1859775393 + blocks2[j + 1] << 0;
            a = a << 30 | a >>> 2;
            f = e ^ a ^ b;
            t = d << 5 | d >>> 27;
            c = t + f + c + 1859775393 + blocks2[j + 2] << 0;
            e = e << 30 | e >>> 2;
            f = d ^ e ^ a;
            t = c << 5 | c >>> 27;
            b = t + f + b + 1859775393 + blocks2[j + 3] << 0;
            d = d << 30 | d >>> 2;
            f = c ^ d ^ e;
            t = b << 5 | b >>> 27;
            a = t + f + a + 1859775393 + blocks2[j + 4] << 0;
            c = c << 30 | c >>> 2;
          }
          for (; j < 60; j += 5) {
            f = b & c | b & d | c & d;
            t = a << 5 | a >>> 27;
            e = t + f + e - 1894007588 + blocks2[j] << 0;
            b = b << 30 | b >>> 2;
            f = a & b | a & c | b & c;
            t = e << 5 | e >>> 27;
            d = t + f + d - 1894007588 + blocks2[j + 1] << 0;
            a = a << 30 | a >>> 2;
            f = e & a | e & b | a & b;
            t = d << 5 | d >>> 27;
            c = t + f + c - 1894007588 + blocks2[j + 2] << 0;
            e = e << 30 | e >>> 2;
            f = d & e | d & a | e & a;
            t = c << 5 | c >>> 27;
            b = t + f + b - 1894007588 + blocks2[j + 3] << 0;
            d = d << 30 | d >>> 2;
            f = c & d | c & e | d & e;
            t = b << 5 | b >>> 27;
            a = t + f + a - 1894007588 + blocks2[j + 4] << 0;
            c = c << 30 | c >>> 2;
          }
          for (; j < 80; j += 5) {
            f = b ^ c ^ d;
            t = a << 5 | a >>> 27;
            e = t + f + e - 899497514 + blocks2[j] << 0;
            b = b << 30 | b >>> 2;
            f = a ^ b ^ c;
            t = e << 5 | e >>> 27;
            d = t + f + d - 899497514 + blocks2[j + 1] << 0;
            a = a << 30 | a >>> 2;
            f = e ^ a ^ b;
            t = d << 5 | d >>> 27;
            c = t + f + c - 899497514 + blocks2[j + 2] << 0;
            e = e << 30 | e >>> 2;
            f = d ^ e ^ a;
            t = c << 5 | c >>> 27;
            b = t + f + b - 899497514 + blocks2[j + 3] << 0;
            d = d << 30 | d >>> 2;
            f = c ^ d ^ e;
            t = b << 5 | b >>> 27;
            a = t + f + a - 899497514 + blocks2[j + 4] << 0;
            c = c << 30 | c >>> 2;
          }
          this.h0 = this.h0 + a << 0;
          this.h1 = this.h1 + b << 0;
          this.h2 = this.h2 + c << 0;
          this.h3 = this.h3 + d << 0;
          this.h4 = this.h4 + e << 0;
        };
        Sha1.prototype.hex = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;
          return HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >>> 28 & 15] + HEX_CHARS[h4 >>> 24 & 15] + HEX_CHARS[h4 >>> 20 & 15] + HEX_CHARS[h4 >>> 16 & 15] + HEX_CHARS[h4 >>> 12 & 15] + HEX_CHARS[h4 >>> 8 & 15] + HEX_CHARS[h4 >>> 4 & 15] + HEX_CHARS[h4 & 15];
        };
        Sha1.prototype.toString = Sha1.prototype.hex;
        Sha1.prototype.digest = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;
          return [
            h0 >>> 24 & 255,
            h0 >>> 16 & 255,
            h0 >>> 8 & 255,
            h0 & 255,
            h1 >>> 24 & 255,
            h1 >>> 16 & 255,
            h1 >>> 8 & 255,
            h1 & 255,
            h2 >>> 24 & 255,
            h2 >>> 16 & 255,
            h2 >>> 8 & 255,
            h2 & 255,
            h3 >>> 24 & 255,
            h3 >>> 16 & 255,
            h3 >>> 8 & 255,
            h3 & 255,
            h4 >>> 24 & 255,
            h4 >>> 16 & 255,
            h4 >>> 8 & 255,
            h4 & 255
          ];
        };
        Sha1.prototype.array = Sha1.prototype.digest;
        Sha1.prototype.arrayBuffer = function() {
          this.finalize();
          var buffer = new ArrayBuffer(20);
          var dataView = new DataView(buffer);
          dataView.setUint32(0, this.h0);
          dataView.setUint32(4, this.h1);
          dataView.setUint32(8, this.h2);
          dataView.setUint32(12, this.h3);
          dataView.setUint32(16, this.h4);
          return buffer;
        };
        function HmacSha1(key, sharedMemory) {
          var i, result = formatMessage(key);
          key = result[0];
          if (result[1]) {
            var bytes = [], length = key.length, index = 0, code;
            for (i = 0; i < length; ++i) {
              code = key.charCodeAt(i);
              if (code < 128) {
                bytes[index++] = code;
              } else if (code < 2048) {
                bytes[index++] = 192 | code >>> 6;
                bytes[index++] = 128 | code & 63;
              } else if (code < 55296 || code >= 57344) {
                bytes[index++] = 224 | code >>> 12;
                bytes[index++] = 128 | code >>> 6 & 63;
                bytes[index++] = 128 | code & 63;
              } else {
                code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
                bytes[index++] = 240 | code >>> 18;
                bytes[index++] = 128 | code >>> 12 & 63;
                bytes[index++] = 128 | code >>> 6 & 63;
                bytes[index++] = 128 | code & 63;
              }
            }
            key = bytes;
          }
          if (key.length > 64) {
            key = new Sha1(true).update(key).array();
          }
          var oKeyPad = [], iKeyPad = [];
          for (i = 0; i < 64; ++i) {
            var b = key[i] || 0;
            oKeyPad[i] = 92 ^ b;
            iKeyPad[i] = 54 ^ b;
          }
          Sha1.call(this, sharedMemory);
          this.update(iKeyPad);
          this.oKeyPad = oKeyPad;
          this.inner = true;
          this.sharedMemory = sharedMemory;
        }
        HmacSha1.prototype = new Sha1();
        HmacSha1.prototype.finalize = function() {
          Sha1.prototype.finalize.call(this);
          if (this.inner) {
            this.inner = false;
            var innerHash = this.array();
            Sha1.call(this, this.sharedMemory);
            this.update(this.oKeyPad);
            this.update(innerHash);
            Sha1.prototype.finalize.call(this);
          }
        };
        var exports2 = createMethod();
        exports2.sha1 = exports2;
        exports2.sha1.hmac = createHmacMethod();
        if (COMMON_JS) {
          module.exports = exports2;
        } else {
          root.sha1 = exports2;
          if (AMD) {
            define(function() {
              return exports2;
            });
          }
        }
      })();
    }
  });

  // src/popup/constants.ts
  var DEFAULT_BACKEND = "http://localhost:8010";
  var DEFAULT_SMART_APP_LAUNCH = "https://voho0000.github.io/medical-note-smart-on-fhir/smart/launch";
  var STANDALONE_SMART_APP_URL = "https://voho0000.github.io/medical-note-smart-on-fhir/";
  var DEFAULT_MODE = "local";
  var NHI_LANDING = "https://myhealthbank.nhi.gov.tw/IHKE3000";
  var NHI_LOGIN_URL = "https://myhealthbank.nhi.gov.tw/IHKE3000/IHKE3095S01";
  var PENDING_BUNDLE_KEY = "pendingFhirBundle";
  var PENDING_BUNDLE_JSON_KEY = "pendingFhirBundleJson";
  var RANGE_LABELS = {
    "1": "\u6700\u8FD1 1 \u5E74",
    "3": "\u6700\u8FD1 3 \u5E74",
    "5": "\u6700\u8FD1 5 \u5E74",
    "10": "\u6700\u8FD1 10 \u5E74",
    all: "\u5168\u90E8\u6B77\u53F2\u7D00\u9304"
  };
  var VIEWPORT_MARGIN = 6;

  // src/popup/els.ts
  var byId = (id) => document.getElementById(id);
  var els = {
    // live NodeList; callers read .value/.checked off each radio
    modeRadios: () => document.querySelectorAll('input[name="sync-mode"]'),
    backendUrl: byId("backend-url"),
    syncApiKey: byId("sync-api-key"),
    smartAppUrl: byId("smart-app-url"),
    syncApiBtn: byId("sync-api-btn"),
    syncBlockedReason: byId("sync-blocked-reason"),
    apiSyncRange: byId("api-sync-range"),
    stopBtn: byId("stop-btn"),
    // v0.16.0: imaging prep banner — appears post-sync when NHI is still
    // preparing N images. Lives in imaging-prep-banner.ts.
    prepBanner: byId("imaging-prep-banner"),
    prepTitle: byId("prep-title"),
    prepProgress: byId("prep-progress"),
    prepCloseBtn: byId("prep-close-btn"),
    prepCtaBtn: byId("prep-cta-btn"),
    ovName: byId("ov-name"),
    ovBirthDate: byId("ov-birth-date"),
    ovGender: byId("ov-gender"),
    ovSaveBtn: byId("ov-save-btn"),
    ovClearBtn: byId("ov-clear-btn"),
    ovSummary: byId("override-summary"),
    patientOverrideDetails: byId("patient-override"),
    launchBtn: byId("launch-btn"),
    openSmartAppBtn: byId("open-smart-app-btn"),
    openSettingsBtn: byId("open-settings-btn"),
    settingsBackBtn: byId("settings-back-btn"),
    status: byId("status"),
    dashboardLink: byId("dashboard-link"),
    pendingBundle: byId("pending-bundle"),
    downloadBundleBtn: byId("download-bundle-btn"),
    clearBundleBtn: byId("clear-bundle-btn"),
    // bundleMeta legacy id removed in the panel-merge; filename+size now
    // live in dedicated #bundle-filename / #bundle-sizeage elements
    // below.
    connBanner: byId("conn-banner"),
    connSection: byId("conn-section"),
    connMini: byId("conn-mini"),
    connMsg: byId("conn-msg"),
    connRetryBtn: byId("conn-retry-btn"),
    connHelp: byId("conn-help"),
    dataStateSection: byId("data-state-section"),
    backendState: byId("backend-state"),
    localStateRow: byId("local-state-row"),
    localState: byId("local-state"),
    pushLocalBtn: byId("push-local-btn"),
    syncStatusHint: byId("sync-status-hint"),
    maskNameEnabled: byId("mask-name-enabled"),
    backendModeEnabled: byId("backend-mode-enabled"),
    fetchImagingEnabled: byId("fetch-imaging-enabled"),
    openNhiSection: byId("open-nhi-section"),
    openNhiBtn: byId("open-nhi-btn"),
    nhiNeedsLoginSection: byId("nhi-needs-login-section"),
    nhiReloadBtn: byId("nhi-reload-btn"),
    loginOkSection: byId("login-ok-section"),
    wizardStepper: byId("wizard-stepper"),
    resultZone: byId("result-zone"),
    activePatient: byId("active-patient"),
    activePatientValue: byId("active-patient-value"),
    bundleMetaBlock: byId("bundle-meta-block"),
    bundleFilename: byId("bundle-filename"),
    bundleSizeage: byId("bundle-sizeage")
  };

  // ../packages/mapper/src/helpers.ts
  var import_js_sha1 = __toESM(require_sha1(), 1);
  function derivePatientId(nationalId) {
    return (0, import_js_sha1.sha1)(["patient", nationalId].join("|")).slice(0, 32);
  }
  function maskId(id, char = "*") {
    const s = (id ?? "").trim();
    if (!s)
      return s;
    if (/^[A-Z][12]\d{8}$/.test(s))
      return s.slice(0, 6) + char.repeat(4);
    if (s.startsWith("auto-"))
      return s;
    if (s.length > 6)
      return s.slice(0, 2) + char.repeat(s.length - 4) + s.slice(-2);
    return s;
  }
  function effectiveFhirPatientId(idNo, deidentify) {
    return derivePatientId(deidentify ? maskId(idNo, "X") : idNo);
  }
  function maskName(name) {
    const trimmed = (name ?? "").trim();
    if (!trimmed || trimmed === "Unknown")
      return trimmed;
    if (/\s/.test(trimmed)) {
      const parts = trimmed.split(/\s+/);
      if (parts.length === 1)
        return parts[0];
      const first = parts[0];
      const last = parts[parts.length - 1];
      if (parts.length === 2) {
        const lastMasked = last.length <= 1 ? last : `${last[0]}***`;
        return `${first} ${lastMasked}`;
      }
      const middles = parts.slice(1, -1).map(() => "***");
      return [first, ...middles, last].join(" ");
    }
    const chars = Array.from(trimmed);
    if (chars.length <= 1)
      return trimmed;
    if (chars.length === 2)
      return `${chars[0]}O`;
    return chars[0] + "O".repeat(chars.length - 2) + chars[chars.length - 1];
  }

  // ../packages/mapper/src/document-reference.ts
  var import_js_sha12 = __toESM(require_sha1(), 1);

  // ../packages/mapper/src/loinc-tables.ts
  var CBC_COMPONENT_KEYS = {
    // Hemoglobin — variant CJK 血色素 / 血紅蛋白 added v0.11.4 audit
    // (Taiwan medical texts use all three interchangeably).
    hemoglobin: "718-7",
    \u8840\u7D05\u7D20: "718-7",
    \u8840\u8272\u7D20: "718-7",
    \u8840\u7D05\u86CB\u767D: "718-7",
    hgb: "718-7",
    hb: "718-7",
    "hb.": "718-7",
    // Hematocrit (HCT) — Taiwan LIS shortens to "Ht" / "H.t.". The
    // ".ascii" period-separated forms (e.g. "M.C.V.") added v0.11.4 —
    // they bypass \bMCV\b matching because intra-word periods break
    // the word boundary. Key WITHOUT trailing period covers both
    // "M.C.V" and "M.C.V." inputs (trailing period creates a \b on
    // the closing letter, key's regex `\bm\.c\.v\b` matches the "M.C.V"
    // prefix of "M.C.V." just fine).
    hematocrit: "4544-3",
    \u8840\u7403\u5BB9\u7A4D\u6BD4: "4544-3",
    // v0.11.11 (SMART app dev bug 2 + 5 2026-05-29): variants observed
    // in user's v0.11.9 bundle. "血球容積比值測定" was previously
    // matching the global LOINC_MAP fallback to a panel LOINC; "血球比容值"
    // is a sibling phrasing.
    \u8840\u7403\u5BB9\u7A4D\u6BD4\u503C: "4544-3",
    \u8840\u7403\u5BB9\u7A4D\u6BD4\u503C\u6E2C\u5B9A: "4544-3",
    \u8840\u7403\u6BD4\u5BB9\u503C: "4544-3",
    \u8840\u7403\u6BD4\u5BB9\u503C\u6E2C\u5B9A: "4544-3",
    \u8840\u7403\u6BD4\u5BB9: "4544-3",
    \u8840\u6BD4\u5BB9: "4544-3",
    \u7D05\u8840\u7403\u5BB9\u7A4D: "4544-3",
    // alt phrasing — RBC volume = hematocrit
    hct: "4544-3",
    ht: "4544-3",
    "h.t.": "4544-3",
    "h.t": "4544-3",
    "%ht": "4544-3",
    // RBC — period-separated abbrev added
    \u7D05\u8840\u7403: "789-8",
    rbc: "789-8",
    "r.b.c": "789-8",
    // WBC — period-separated abbrev added
    \u767D\u8840\u7403: "6690-2",
    wbc: "6690-2",
    "w.b.c": "6690-2",
    // Platelet
    platelet: "777-3",
    \u8840\u5C0F\u677F: "777-3",
    plt: "777-3",
    // CBC indices — period-separated abbrev forms added v0.11.4.
    // Order matters: longer "m.c.h.c" must register before "m.c.h"
    // is even considered (_findLongestMatch picks longest match
    // regardless of insertion order, so insertion order here is for
    // readability only).
    "m.c.v": "787-2",
    "m.c.h.c": "786-4",
    "m.c.h": "785-6",
    // ── v0.12.1 (SMART app dev bug 5'/6'/7' 2026-05-29): explicit
    // "EN(中文)" parenthetical variants from the 2024-01-22 hospital's
    // CBC display format. Same rationale as the CBC_DIFF_KEYS additions
    // above: guarantee longest-match wins over panel-default fallback.
    "mcv(\u5E73\u5747\u7D05\u8840\u7403\u5BB9\u7A4D)": "787-2",
    "mch(\u5E73\u5747\u7D05\u8840\u7403\u8840\u8272\u7D20)": "785-6",
    "mchc(\u5E73\u5747\u7D05\u8840\u7403\u6FC3\u5EA6)": "786-4",
    "mchc(\u5E73\u5747\u7D05\u8840\u7403\u8840\u8272\u7D20\u6FC3\u5EA6)": "786-4",
    "rdw(\u7D05\u8840\u7403\u5206\u5E03\u5BEC\u5EA6)": "788-0",
    "rdw(\u5E73\u5747\u7D05\u8840\u7403\u5BEC\u5EA6)": "788-0",
    // observed variant in user's bundle
    "rdw(\u7D05\u8840\u7403\u5206\u4F48\u5BEC\u5EA6)": "788-0",
    "wbc(\u767D\u8840\u7403\u8A08\u6578)": "6690-2",
    "rbc(\u7D05\u8840\u7403\u8A08\u6578)": "789-8",
    "hb(\u8840\u7D05\u7D20)": "718-7",
    "hb(\u8840\u8272\u7D20)": "718-7",
    "hgb(\u8840\u7D05\u7D20)": "718-7",
    "hgb(\u8840\u8272\u7D20)": "718-7",
    "hct(\u8840\u7403\u5BB9\u7A4D\u6BD4)": "4544-3",
    "ht(\u8840\u7403\u5BB9\u7A4D\u6BD4)": "4544-3",
    "platelet(\u8840\u5C0F\u677F)": "777-3",
    "plt(\u8840\u5C0F\u677F)": "777-3",
    // ── v0.11.11 (SMART app dev bug 5 2026-05-29): variants observed
    // in user's v0.11.9 bundle that previously fell through to global
    // LOINC_MAP "紅血球" → 789-8 (RBC count) — 5 distinct CBC indices
    // all wrongly tagged as RBC count (48 records).
    //
    // 紅血球分**佈**變異數 (LIS variant of 紅血球分**布**寬度) → RDW.
    //   LOINC 788-0 already verified v0.11.4.
    // 紅血球**平均**容積 (word order variant of **平均**紅血球容積) → MCV.
    //   LOINC 787-2 already verified.
    // 紅血球色素 → MCH (mean corpuscular hemoglobin).
    //   LOINC 785-6 already verified.
    // 紅血球色素濃度 → MCHC. LOINC 786-4 already verified.
    // Add 變異 + 體積 cross variants for robustness against future LIS
    // quirks; longest-match semantics keep RBC ("紅血球") from winning
    // over the longer compound keys.
    \u7D05\u8840\u7403\u5206\u4F48\u8B8A\u7570\u6578: "788-0",
    \u7D05\u8840\u7403\u5206\u5E03\u8B8A\u7570\u6578: "788-0",
    // 布 variant
    \u7D05\u8840\u7403\u5206\u5E03\u8B8A\u7570: "788-0",
    \u7D05\u8840\u7403\u5206\u4F48\u8B8A\u7570: "788-0",
    \u7D05\u8840\u7403\u9AD4\u7A4D\u5206\u4F48: "788-0",
    \u7D05\u8840\u7403\u9AD4\u7A4D\u5206\u5E03: "788-0",
    \u7D05\u8840\u7403\u5E73\u5747\u5BB9\u7A4D: "787-2",
    \u7D05\u8840\u7403\u5E73\u5747\u9AD4\u7A4D: "787-2",
    \u7D05\u8840\u7403\u8272\u7D20\u6FC3\u5EA6: "786-4",
    // MCHC (must precede 紅血球色素 for longest-match clarity)
    \u7D05\u8840\u7403\u8272\u7D20: "785-6",
    // MCH
    \u7D05\u8840\u7403\u5E73\u5747\u8840\u8272\u7D20\u6FC3\u5EA6: "786-4",
    \u7D05\u8840\u7403\u5E73\u5747\u8840\u8272\u7D20: "785-6"
  };
  var CBC_DIFF_KEYS = {
    // Neutrophil + Taiwan variants (incl. v0.9.10 Part 4 "Segment" fix
    // + v0.11.4 audit additions: bare "Neut" / "Neut." short forms +
    // 多核球 / 多形核球 alternate CJK terms — Taiwan haematology textbook
    // synonyms for neutrophil).
    "neutrophilic segment": "770-8",
    // Neutrophils/100 leukocytes
    neutrophil: "770-8",
    neutrophils: "770-8",
    segmented: "770-8",
    segment: "770-8",
    segments: "770-8",
    seg: "770-8",
    "seg.": "770-8",
    neut: "770-8",
    "neut.": "770-8",
    "neut. seg": "770-8",
    "neut seg": "770-8",
    \u55DC\u4E2D\u6027\u767D\u8840\u7403: "770-8",
    \u55DC\u4E2D\u6027\u7403: "770-8",
    \u4E2D\u6027\u7403: "770-8",
    \u591A\u6838\u7403: "770-8",
    \u591A\u5F62\u6838\u7403: "770-8",
    // Lymphocyte — v0.11.4 audit added "Lym" / "Lym." / "Lymph" / "Lymph."
    // / "Lymph cell" short forms + bare 淋巴 CJK.
    lymphocyte: "736-9",
    // Lymphocytes/100 leukocytes
    lymphocytes: "736-9",
    "lymph cell": "736-9",
    lymph: "736-9",
    "lymph.": "736-9",
    lym: "736-9",
    "lym.": "736-9",
    \u6DCB\u5DF4\u767D\u8840\u7403: "736-9",
    \u6DCB\u5DF4\u7403: "736-9",
    \u6DCB\u5DF4\u7D30\u80DE: "736-9",
    \u6DCB\u5DF4: "736-9",
    // Monocyte
    monocyte: "5905-5",
    // Monocytes/100 leukocytes
    monocytes: "5905-5",
    \u55AE\u6838\u767D\u8840\u7403: "5905-5",
    \u55AE\u6838\u7403: "5905-5",
    // Eosinophil (% form in CBC diff context, NOT 711-2 #/vol)
    eosinophil: "713-8",
    eosinophils: "713-8",
    \u55DC\u9178\u6027\u767D\u8840\u7403: "713-8",
    \u55DC\u9178: "713-8",
    \u55DC\u4F0A\u7D05\u6027\u767D\u8840\u7403: "713-8",
    \u55DC\u4F0A\u7D05: "713-8",
    // Basophil
    basophil: "706-2",
    basophils: "706-2",
    \u55DC\u9E7C\u6027\u767D\u8840\u7403: "706-2",
    \u55DC\u9E7C: "706-2",
    // v0.12.1 (SMART app dev bug 5'/6'/7' 2026-05-29): one hospital
    // (2024-01-22 records) ships CBC diff displays in the format
    // "EN(中文)" — e.g. "Basophils(嗜鹼性白血球)". Existing keys
    // SHOULD match via _findLongestMatch substring on the EN part,
    // but the user's v0.11.13 bundle showed these rows routing to
    // 6690-2 (panel-default WBC). Adding explicit parenthetical
    // variants as the longest matching keys guarantees the right
    // routing regardless of which code path the rows take.
    "basophils(\u55DC\u9E7C\u6027\u767D\u8840\u7403)": "706-2",
    "basophil(\u55DC\u9E7C\u6027\u767D\u8840\u7403)": "706-2",
    "eosinophils(\u55DC\u9178\u6027\u767D\u8840\u7403)": "713-8",
    "eosinophil(\u55DC\u9178\u6027\u767D\u8840\u7403)": "713-8",
    "lymphocytes(\u6DCB\u5DF4\u767D\u8840\u7403)": "736-9",
    "lymphocyte(\u6DCB\u5DF4\u767D\u8840\u7403)": "736-9",
    "monocytes(\u55AE\u6838\u767D\u8840\u7403)": "5905-5",
    "monocyte(\u55AE\u6838\u767D\u8840\u7403)": "5905-5",
    "neutrophilic segment(\u55DC\u4E2D\u6027\u767D\u8840\u7403)": "770-8",
    "neutrophil(\u55DC\u4E2D\u6027\u767D\u8840\u7403)": "770-8",
    "neutrophils(\u55DC\u4E2D\u6027\u767D\u8840\u7403)": "770-8",
    "segment(\u55DC\u4E2D\u6027\u767D\u8840\u7403)": "770-8",
    // ── Maturation-stage neutrophils (v0.11.11) ────────────────────
    // SMART app dev bug 2 + 6 2026-05-29: Metamyelocyte ("後骨髓球") and
    // Band ("帶狀嗜中性白血球") rows were falling to the panel LOINC
    // 57021-8 (CBC W Diff panel) or 770-8 (Segment neutrophils). Both
    // are immature neutrophil maturation stages distinct from total /
    // segmented neutrophils; each has its own LOINC verified at
    // loinc.org 2026-05-29:
    //   740-1  Metamyelocytes/Leukocytes in Blood by Manual count (NFr)
    //   764-1  Band form neutrophils/Leukocytes in Blood by Manual count (NFr)
    // Adding to CBC_DIFF_KEYS so they're available under every CBC
    // sibling code (08002C/08003C/08004C/08006C/08011C/08013C).
    metamyelocyte: "740-1",
    metamyelocytes: "740-1",
    "meta-myelocyte": "740-1",
    "meta myelocyte": "740-1",
    \u5F8C\u9AA8\u9AD3\u7403: "740-1",
    band: "764-1",
    bands: "764-1",
    "band form": "764-1",
    "band cell": "764-1",
    \u5E36\u72C0\u55DC\u4E2D\u6027\u767D\u8840\u7403: "764-1",
    \u5E36\u72C0: "764-1",
    \u687F\u72C0\u6838: "764-1"
    // alt name 桿狀核細胞
  };
  var URINE_BIOCHEM_KEYS = {
    // Microalbumin variants (specimen + analyte)
    "micro-albumin": "14957-5",
    // Microalbumin Mass/vol Urine
    microalbumin: "14957-5",
    "micro albumin": "14957-5",
    "u-malb": "14957-5",
    "malb(u)": "14957-5",
    "malb.": "14957-5",
    malb: "14957-5",
    \u5FAE\u5C0F\u767D\u86CB\u767D: "14957-5",
    \u5C3F\u5FAE\u91CF\u767D\u86CB\u767D: "14957-5",
    \u5C3F\u767D\u86CB\u767D: "14957-5",
    // UACR (Microalbumin/Creatinine ratio Urine)
    uacr: "14959-1",
    "u-acr": "14959-1",
    "alb/cre": "14959-1",
    "albumin/creatinine": "14959-1",
    // Urine creatinine variants
    "urine creatinine": "2161-8",
    "creatinine urine": "2161-8",
    "creatinine(u)": "2161-8",
    "u-cre": "2161-8",
    "u-crea": "2161-8",
    \u5C3F\u6DB2\u808C\u9178\u9150: "2161-8",
    \u5C3F\u808C\u9178\u9150: "2161-8",
    creatinine: "2161-8",
    // bare — within 09016C/12111C scope, default to urine
    crea: "2161-8",
    \u808C\u9178\u9150: "2161-8"
  };
  var URINALYSIS_ANALYTE_KEYS = {
    // Order matters: longer/more-specific keys before generic ones
    // (matches _LOINC_MAP iteration semantics — first hit wins).
    "specific gravity": "5811-5",
    // Specific gravity Urine
    "sp.gravity": "5811-5",
    "sp gravity": "5811-5",
    \u6BD4\u91CD: "5811-5",
    "micro-albumin": "14957-5",
    // Microalbumin Mass/vol Urine
    microalbumin: "14957-5",
    "malb(u)": "14957-5",
    malb: "14957-5",
    \u5FAE\u5C0F\u767D\u86CB\u767D: "14957-5",
    // v0.12.1 (caught during v0.11.7 test re-run after LOINC_SHORT_TEXT
    // for 20454-5 was added — both 微白蛋白 displays were silently
    // routing to bare "蛋白" → 20454-5 (urine protein) instead of
    // their correct microalbumin/UACR LOINCs). Longer specific keys
    // ensure correct routing via _findLongestMatch.
    \u5FAE\u767D\u86CB\u767D: "14957-5",
    "\u5FAE\u767D\u86CB\u767D(\u5C3F)": "14957-5",
    "\u5FAE\u767D\u86CB\u767D(\u5C3F)(\u534A\u5B9A\u91CF)": "14957-5",
    "\u5FAE\u767D\u86CB\u767D(\u5C3F\u6DB2)": "14957-5",
    \u5C3F\u5FAE\u91CF\u767D\u86CB\u767D: "14957-5",
    \u5C3F\u767D\u86CB\u767D: "14957-5",
    "u-malb": "14957-5",
    uacr: "14959-1",
    // Microalbumin/Creatinine ratio Urine
    "\u5FAE\u767D\u86CB\u767D/\u808C\u9150\u9178\u6BD4\u503C": "14959-1",
    "\u5FAE\u767D\u86CB\u767D/\u808C\u9150\u9178\u6BD4\u503C(\u534A\u5B9A\u91CF)": "14959-1",
    "\u808C\u9150\u9178\u6BD4\u503C": "14959-1",
    "\u808C\u9178\u9150\u6BD4\u503C": "14959-1",
    "alb/cre": "14959-1",
    "albumin/creatinine": "14959-1",
    "u-acr": "14959-1",
    "urine glucose": "5792-7",
    sugar: "5792-7",
    // NHI '尿糖' / 'Sugar' under 06013C
    \u5C3F\u7CD6: "5792-7",
    urobilinogen: "5818-0",
    // Urobilinogen Urine Ql
    \u5C3F\u81BD\u7D20\u539F: "5818-0",
    bilirubin: "5770-3",
    // Bilirubin Urine Ql
    \u5C3F\u81BD\u7D05\u7D20: "5770-3",
    // v0.13.1 (LOINC-based dedup migration audit 2026-05-30): bare
    // "膽紅素" was missing — only the 尿- prefixed form was registered.
    // PANEL_LOINC_MAP is code-scoped to 06013C urinalysis context, so
    // adding the bare term here doesn't cross-pollute serum 膽紅素 (which
    // routes via 09029C → NHI_TO_LOINC = 1975-2).
    // WebFetch loinc.org/5770-3 verified 2026-06-02: Long Common Name
    // "Bilirubin.total [Presence] in Urine by Test strip" — Component
    // Bilirubin / Property PrThr / System Urine / Scale Ord / Method
    // Test strip → correct urine-dipstick context for 06013C. ✅
    \u81BD\u7D05\u7D20: "5770-3",
    nitrite: "5802-4",
    // Nitrite Urine
    \u4E9E\u785D\u9178: "5802-4",
    ketones: "5797-6",
    // Ketones Urine
    ketone: "5797-6",
    \u916E\u9AD4: "5797-6",
    protein: "20454-5",
    // Protein Mass/vol Urine
    \u5C3F\u86CB\u767D: "20454-5",
    \u86CB\u767D: "20454-5",
    leukocyte: "5799-2",
    // Leukocytes Urine
    leu: "5799-2",
    \u767D\u8840\u7403\u916F\u9176: "5799-2",
    // v0.11.11 (SMART app dev bug 7 2026-05-29): variant character 脢
    // (not 酶) observed under 06013C in user's v0.11.9 bundle. Without
    // this entry path-B missed and fell to global LOINC_MAP "白血球" →
    // 6690-2 (blood WBC count) — wrong specimen + wrong analyte (4
    // records affected).
    \u767D\u8840\u7403\u916F\u8122: "5799-2",
    \u767D\u8840\u7403\u8102\u9176: "5799-2",
    // also seen — 脂 vs 酯
    \u767D\u8840\u7403\u8102\u8122: "5799-2",
    \u767D\u8840\u7403\u916F\u985E: "5799-2",
    // observed in some HIS as descriptive name
    blood: "5794-3",
    // Hemoglobin Urine Ql
    \u6F5B\u8840: "5794-3",
    \u8272: "5778-6",
    // Color of Urine (CJK substring)
    color: "5778-6",
    turbidity: "5767-9",
    // Appearance of Urine
    appearance: "5767-9",
    \u5916\u89C0: "5767-9",
    // v0.13.1 (app dev urinalysis A/B audit 2026-06-02): NHI B-channel
    // ships "濁度" where A-channel ships "Turbidity". Without this key
    // 濁度 fell to path-C panel default 24356-8 (Urinalysis complete
    // panel) → diverged from Turbidity's 5767-9 → looked like a dup pair
    // AND carried the wrong LOINC. WebFetch loinc.org/5767-9 verified
    // 2026-06-02: Long Common Name "Appearance of Urine" — System Urine,
    // Property Aper, Scale Nom. Taiwan urinalysis 濁度/Turbidity is the
    // standard urine appearance/clarity test. ✅
    \u6FC1\u5EA6: "5767-9",
    ph: "5803-2",
    // pH of Urine (urine-specific, NOT
    // the arterial 11558-4 that the
    // global map points to)
    \u9178\u9E7C\u5EA6: "5803-2",
    // v0.13.1 (same audit): B-channel "酸鹼值" vs A-channel "pH". Note
    // 酸鹼值 (值) ≠ 酸鹼度 (度) — only the latter was registered, so 酸鹼值
    // fell to panel default 24356-8. Code-scoped to 06013C so no clash
    // with 09041B ABG's "酸鹼值" → 11558-4 (arterial pH). WebFetch
    // loinc.org/5803-2 verified 2026-06-02: "pH of Urine by Test strip"
    // — Component pH, System Urine. ✅
    \u9178\u9E7C\u503C: "5803-2",
    glucose: "5792-7",
    // Last in this block so 'urine
    // ── v0.11.4 audit — Taiwan dipstick abbrev variants ──
    // Without these the abbreviated displays ("Bili" / "KET" / "OB" /
    // "NIT" / "UBG" / "URO" / "SG" / "Colour" / "WBC esterase") fell
    // to path-C and got LOINC 24356-8 (Urinalysis panel). Some also
    // shadowed by global LOINC_MAP keys (e.g. "WBC esterase" matched
    // global "wbc" → 6690-2 BLOOD WBC, wrong specimen).
    "u-bili": "5770-3",
    bili: "5770-3",
    ket: "5797-6",
    ob: "5794-3",
    "ob.": "5794-3",
    "occult blood": "5794-3",
    nit: "5802-4",
    ubg: "5818-0",
    uro: "5818-0",
    sg: "5811-5",
    "s.g": "5811-5",
    colour: "5778-6",
    // UK spelling
    "wbc esterase": "5799-2",
    // blocks global "wbc" → 6690-2 shadow
    // v0.12.2 (SMART app dev v0.12.1 audit 2026-05-29): hospital
    // 長庚嘉義 ships urine creatinine rows under NHI 06013C (尿生化
    // panel) — NOT under 09015C as the v0.12.1 fix targeted. Without
    // explicit urine variants here, "肌酸酐(尿液)(半定量)" routed via
    // LOINC_MAP global "肌酸酐" → 2160-0 serum LOINC under 06013C
    // billing (4 rows affected in user's v0.12.1 bundle). Mirror the
    // same urine creatinine variants from PANEL_LOINC_MAP["09015C"]
    // — longest-match guarantees urine LOINC 2161-8 wins over generic.
    "\u808C\u9178\u9150(\u5C3F\u6DB2)(\u534A\u5B9A\u91CF)": "2161-8",
    "\u808C\u9178\u9150(\u5C3F\u6DB2)": "2161-8",
    "\u808C\u9178\u9150(\u5C3F)": "2161-8",
    "\u808C\u9178\u9150(u)": "2161-8",
    // ASCII keys ending in ")" fail \b regex boundary at end of match
    // (same \b-non-word-char-no-boundary issue documented in v0.11.13
    // APTT ratio fix). Use opening-paren-only form so \b at end fires
    // on the word char preceding ")" — "creatinine(u" matches inside
    // "creatinine(u)" with \b after "u".
    "creatinine(u": "2161-8",
    "creatinine(urine": "2161-8",
    // v0.13.1 (app dev urinalysis A/B audit 2026-06-02): A-channel ships
    // the abbreviation "CREA(U)(半定量)" — "creatinine(u" did NOT match
    // (no "creatinine" substring in "crea(u)"), so it fell to global
    // LOINC_MAP "crea" → 2160-0 SERUM creatinine while the B-channel
    // "肌酸酐(尿液)" correctly got urine 2161-8. Add the abbreviated
    // opening-paren form. Same verified LOINC 2161-8 "Creatinine
    // [Mass/volume] in Urine" — WebFetch loinc.org/2161-8 confirmed
    // 2026-06-02 (System Urine). ✅
    "crea(u": "2161-8",
    "crea(urine": "2161-8",
    "u-creatinine": "2161-8",
    "urine creatinine": "2161-8",
    "creatinine, urine": "2161-8",
    // ── Sediment microscopy sub-analytes (v0.18.2, 2026-06-09) ──
    // 06012C 尿液一般檢查 also ships URINE SEDIMENT MICROSCOPY items the
    // dipstick-only 06013C bundles never carried. Each LOINC WebFetch-
    // verified at loinc.org 2026-06-09 (rule #5):
    //   5787-7  Epithelial cells [#/area] Urine sed Microscopy HPF (Qn)
    //   5821-4  Leukocytes [#/area] Urine sed Microscopy HPF (Qn)
    //   5808-1  Erythrocytes [#/volume] Urine sed Microscopy HPF (Qn)
    //   25145-4 Bacteria [Presence] Urine sed Light microscopy (Ord)
    //   5783-6  Unidentified crystals [Presence] Urine sed (Ord)
    // Count-form keys (白血球計數/紅血球計數) outrank the dipstick
    // leukocyte-esterase key (白血球酯脢→5799-2) by longest-match; there is
    // deliberately NO bare 白血球/紅血球/wbc/rbc key — it would shadow the
    // esterase dipstick or fall through to the BLOOD CBC LOINCs in the
    // global map (wrong specimen).
    \u4E0A\u76AE\u7D30\u80DE: "5787-7",
    "epi cell": "5787-7",
    epithelial: "5787-7",
    \u767D\u8840\u7403\u8A08\u6578: "5821-4",
    \u7D05\u8840\u7403\u8A08\u6578: "5808-1",
    \u7D30\u83CC: "25145-4",
    bacteria: "25145-4",
    \u7D50\u6676: "5783-6",
    crystal: "5783-6",
    crystals: "5783-6",
    // 尿膽素元 — real-world 元/原 spelling variant of urobilinogen (the
    // dipstick key above is 尿膽素原). English "Urobilinogen" already routes
    // it; cover the CJK-only 元 form too.
    \u5C3F\u81BD\u7D20\u5143: "5818-0",
    \u81BD\u7D20\u5143: "5818-0"
    // 黏液/Mucus intentionally UNMAPPED → falls to Step-C panel default
    // 24356-8 (no clean generic urine-mucus LOINC on loinc.org; keeping it
    // unmapped leaves the mis-tag canary visible per rule #8 vs guessing).
  };
  var PANEL_LOINC_MAP = {
    // ── Urinalysis: 06012C + 06013C share ONE analyte table ──────
    // v0.18.2 (2026-06-09): both urinalysis panel codes route display-first
    // through URINALYSIS_ANALYTE_KEYS. 06012C was previously NOT registered
    // as a panel and short-circuited (NHI_TO_LOINC Step A) to 5778-6 "Color
    // of Urine", collapsing all 18 sub-analytes. See rule #10.
    "06012C": URINALYSIS_ANALYTE_KEYS,
    "06013C": URINALYSIS_ANALYTE_KEYS,
    // ── ABG panel (09041B) ───────────────────────────────
    // 09041B has DISPLAY_FIRST_CODES but no PANEL_LOINC_MAP entry until
    // v0.11.4 — relied on global LOINC_MAP for routing, which works for
    // the canonical abbreviations (pH/pCO2/pO2/HCO3/TCO2/SaO2) but
    // missed period-separated forms (P.CO2 / T.CO2 / p.H.) + Chinese
    // descriptive names (酸鹼值 / 二氧化碳分壓 / 氧分壓 / 血氧飽和度).
    // Panel-scoped table now covers Taiwan LIS variants. Global entries
    // kept for backward compat (Mode A bundles older than v0.11.4 may
    // still rely on global path).
    "09041B": {
      // pH variants
      "p.h.": "11558-4",
      "p.h": "11558-4",
      \u9178\u9E7C\u503C: "11558-4",
      // pCO2 variants
      "p.co2": "2019-8",
      \u4E8C\u6C27\u5316\u78B3\u5206\u58D3: "2019-8",
      // pO2 variants
      \u6C27\u5206\u58D3: "2703-7",
      // HCO3 variants
      "hco3-": "1959-6",
      \u78B3\u9178\u6C2B\u6839: "1959-6",
      \u91CD\u78B3\u9178: "1959-6",
      // TCO2 variants
      "t.co2": "2028-9",
      "total co2": "2028-9",
      "total carbon dioxide": "2028-9",
      // SaO2 / O2 saturation variants
      "o2 saturation": "2713-6",
      "o2 sat": "2713-6",
      saturation: "2713-6",
      \u8840\u6C27\u98FD\u548C\u5EA6: "2713-6"
    },
    // ── CBC basic panel (08011C) ─────────────────────────
    // NHI 08011C bills the basic CBC items (RBC + indices, HGB, HCT,
    // PLT, WBC). Without per-item LOINCs under the panel, MCV / MCHC /
    // RDW were being shadowed:
    //   • MCV "平均紅血球容積" → matched global "紅血球" → 789-8 (RBC) ✗
    //   • MCHC "MCHC" → no key matched → fell back to panel 24317-0 ✗
    //   • RDW → no key matched → fell back to panel 24317-0 ✗
    //   • Basophil / Lymphocyte / Monocyte → fell to "白血球" → 6690-2 ✗
    // Panel-scoped table runs BEFORE the global one so the longer,
    // specific CJK / ASCII keys win. All LOINCs verified at loinc.org
    // (Long Common Name documented inline). Bug report 2026-05-27.
    "08011C": {
      // RBC indices — longer CJK keys first so they beat the bare
      // "紅血球" key in the global LOINC_MAP path. (longest-key-wins
      // semantics in _findLongestMatch make insertion order irrelevant
      // within this dict but readability still benefits.)
      \u5E73\u5747\u7D05\u8840\u7403\u5BB9\u7A4D: "787-2",
      // MCV — Erythrocyte mean corpuscular volume
      \u5E73\u5747\u7D05\u8840\u7403\u9AD4\u7A4D: "787-2",
      mcv: "787-2",
      \u5E73\u5747\u7D05\u8840\u7403\u8840\u8272\u7D20\u6FC3\u5EA6: "786-4",
      // MCHC — Erythrocytes mean corpuscular HGB concentration
      mchc: "786-4",
      \u5E73\u5747\u7D05\u8840\u7403\u8840\u8272\u7D20: "785-6",
      // MCH — Erythrocyte mean corpuscular hemoglobin
      mch: "785-6",
      \u7D05\u8840\u7403\u5206\u5E03\u5BEC\u5EA6: "788-0",
      // RDW — Erythrocyte distribution width
      \u7D05\u8840\u7403\u9AD4\u7A4D\u5206\u4F48\u5BEC\u5EA6: "788-0",
      rdw: "788-0",
      // CBC basic counts — shared with the single-analyte billing codes
      // (08002C / 08003C / 08004C / 08006C) below; see
      // CBC_COMPONENT_KEYS const below for the source of truth.
      ...CBC_COMPONENT_KEYS,
      // v0.12.2 (SMART app dev v0.12.1 audit 2026-05-29): hospital
      // 中國北港醫 ships CBC differential rows under BOTH 08013C (CBC W
      // diff billing) AND 08011C (CBC-8項 umbrella billing) for the
      // same draw. v0.11.11 spread CBC_DIFF_KEYS into 08013C but NOT
      // into 08011C — so the 08011C-billed diff rows still fell back
      // to panel-default 6690-2 (WBC count) for all diff cells. Mirror
      // the spread so per-analyte LOINCs (706-2 Basophils / 713-8
      // Eosinophils / 736-9 Lymphocytes / 770-8 Neutrophils / 5905-5
      // Monocytes / 740-1 Metamyelocyte / 764-1 Band) win regardless
      // of which CBC NHI code the hospital bills under.
      ...CBC_DIFF_KEYS
    },
    // ── CBC sibling billing codes (v0.9.10 Part 5 + Part 6) ──
    // Single-analyte billing codes promoted to display-first so when a
    // hospital LIS swaps display vs code (e.g. row billed 08004C HCT
    // but display text reads "HGB"), the unambiguous display wins. Each
    // sibling spreads BOTH CBC_COMPONENT_KEYS (basic counts) AND
    // CBC_DIFF_KEYS (differential percentages) — hospitals bill the
    // diff rows under whatever CBC code their LIS uses (中國北港醫
    // observed billing diff under 08002C WBC count; bug report Part 6
    // bug N3). Fallback path C still hits NHI_TO_LOINC entry for empty/
    // unrecognised displays.
    "08002C": { ...CBC_COMPONENT_KEYS, ...CBC_DIFF_KEYS },
    // WBC count billing
    "08003C": { ...CBC_COMPONENT_KEYS, ...CBC_DIFF_KEYS },
    // Hemoglobin billing
    "08004C": { ...CBC_COMPONENT_KEYS, ...CBC_DIFF_KEYS },
    // Hematocrit billing
    "08006C": { ...CBC_COMPONENT_KEYS, ...CBC_DIFF_KEYS },
    // Platelet count billing
    // ── Urine creatinine sibling codes (v0.9.10 Part 6 N2) ──
    // See URINE_BIOCHEM_KEYS const docstring. When hospital bills UACR
    // workup under 09016C / 12111C, the actual analyte (microalbumin
    // vs creatinine vs UACR ratio) is distinguished only by display.
    "09016C": URINE_BIOCHEM_KEYS,
    "12111C": URINE_BIOCHEM_KEYS,
    // ── Serum protein electrophoresis (09065B; v0.10.0) ─────
    // SPE reports 5 fractions (Albumin / α1 / α2 / β / γ globulins) plus
    // A/G ratio. Each fraction has its own LOINC verified at loinc.org.
    // Previously all 6 sub-rows collapsed to 90991-1 (SPE panel LOINC) —
    // SMART app pivot-by-LOINC merged everything into one column.
    "09065B": {
      // Specific fractions — long names first (longest-match wins)
      "alpha-1 globulin": "2867-3",
      "alpha 1 globulin": "2867-3",
      "\u03B11-globulin": "2867-3",
      \u03B11: "2867-3",
      "alpha-2 globulin": "2868-1",
      "alpha 2 globulin": "2868-1",
      "\u03B12-globulin": "2868-1",
      \u03B12: "2868-1",
      "beta globulin": "2869-9",
      "\u03B2-globulin": "2869-9",
      \u03B2: "2869-9",
      "gamma globulin": "2871-5",
      "\u03B3-globulin": "2871-5",
      \u03B3: "2871-5",
      "a/g ratio": "1759-0",
      // Albumin/Globulin ratio
      "a/g": "1759-0",
      "alb/glb": "1759-0",
      // v0.11.11 (SMART app dev bug 3a 2026-05-29): Total Protein (T.P)
      // row was inheriting the SPE panel LOINC 90991-1. T.P is the total
      // serum protein measurement, distinct LOINC.
      // 2885-2 verified at loinc.org 2026-05-29:
      //   Component=Protein, Property=MCnc, System=Ser/Plas (Class=CHEM)
      "total protein": "2885-2",
      "t.p": "2885-2",
      "t. p": "2885-2",
      "t p": "2885-2",
      tp: "2885-2",
      \u7E3D\u86CB\u767D: "2885-2",
      \u8840\u6E05\u7E3D\u86CB\u767D: "2885-2",
      \u7E3D\u86CB\u767D\u8CEA: "2885-2",
      albumin: "2865-7",
      // Albumin in SPE context (Sercon-MoMt/MS)
      \u767D\u86CB\u767D: "2865-7",
      alb: "2865-7"
    },
    // ── Flow cytometry CD markers (12204B; v0.10.0) ─────────
    // Lymphocyte surface markers — each CD subtype has its own LOINC.
    // Previously all CD3/CD4/CD8/CD19/CD56/ratio rows collapsed to
    // 20584-9 (Lymphocyte subset panel). Critical for HIV monitoring
    // (CD4 absolute count is the actionable indicator).
    "12204B": {
      // v0.11.4 audit fix: trailing "+" in keys breaks \b regex boundary
      // (+ is non-word, end-of-string after non-word has no \b). Keys
      // dropped trailing + so "CD3+/CD4+" display still matches via the
      // "cd3+/cd4" prefix substring. Keys with leading + and bare CD#
      // also need careful ordering — _findLongestMatch picks longest
      // match, so combined ratio keys must outrank bare cd3/cd4/cd8 by
      // length to avoid CD3 winning over the CD3+/CD4+ ratio entry.
      "cd3+/cd4": "8123-2",
      // CD3+/CD4+ ratio → CD4 helper LOINC
      "cd3+/cd8": "8128-1",
      // CD3+/CD8+ ratio → CD8 helper LOINC
      "cd4/cd8 ratio": "54218-3",
      "cd4/cd8": "54218-3",
      "cd8/cd4": "54218-3",
      "cd16+cd56": "8112-5",
      "cd16/cd56": "8112-5",
      cd3: "8124-0",
      // CD3 #/area in Blood
      cd4: "8123-2",
      // CD4 #/area in Blood
      cd8: "8128-1",
      // CD8 #/area in Blood
      cd19: "8118-2",
      // CD19 #/area in Blood (B cell)
      cd16: "8112-5",
      // CD16 + CD56 (NK cell)
      cd56: "8125-7"
      // CD56 #/area in Blood (NK cell)
    },
    // ── DLCO (17009B; v0.10.0) ──────────────────────────────
    // Carbon monoxide diffusing capacity test — reports DLCO + alveolar
    // volume (VA) + DLCO/VA ratio as 3 sub-rows. LOINCs verified at
    // loinc.org. Pulmonary function rarely surfaces in 健康存摺 but the
    // panel exists for completeness.
    "17009B": {
      "dlco/va": "19911-7",
      // DLCO/VA ratio
      "dlco/alveolar volume": "19911-7",
      "kco": "19911-7",
      // Transfer coefficient (same as DLCO/VA)
      dlco: "24341-0",
      // Diffusing capacity for CO
      "dlco sb": "24341-0",
      // Single-breath variant
      \u4E00\u6C27\u5316\u78B3\u80BA\u7030\u6563\u91CF: "24341-0",
      "va": "19850-7",
      // Alveolar volume
      "alveolar volume": "19850-7",
      "\u80BA\u6CE1\u5BB9\u7A4D": "19850-7"
    },
    // ── Serum creatinine + eGFR piggyback (09015C) ──────
    // NHI bills creatinine under 09015C; Taiwan labs auto-calculate eGFR
    // (CKD-EPI / MDRD) and append it as a separate sub-row using the
    // SAME 09015C billing code, distinguished only by display text.
    // Without this panel-scoped table, every 09015C row inherited LOINC
    // 2160-0 (serum creatinine) and SMART apps routed eGFR values into
    // the creatinine column — patient-safety issue (eGFR=33 displayed as
    // CREA=33 mg/dL is instantly mistaken for acute kidney failure).
    //
    // MDRD (33914-3) is the default per Taiwan KDIGO guidelines. Newer
    // CKD-EPI formulas (62238-1, 88293-6, 98979-8) covered as well so a
    // single panel entry handles whichever formula the lab uses. The
    // explicit creatinine entries are duplicated from the global LOINC_MAP
    // so the panel is self-contained.
    "09015C": {
      egfr: "33914-3",
      // eGFR — Glomerular filtration rate (MDRD default)
      "estimated gfr": "33914-3",
      "estimated glomerular filtration rate": "33914-3",
      "glomerular filtration rate": "33914-3",
      "gfr-est": "33914-3",
      // v0.11.4 audit
      "gfr est": "33914-3",
      \u814E\u7D72\u7403\u904E\u6FFE\u7387: "33914-3",
      \u4F30\u7B97\u814E\u7D72\u7403\u904E\u6FFE\u7387: "33914-3",
      creatinine: "2160-0",
      crea: "2160-0",
      \u808C\u9178\u9150: "2160-0",
      \u808C\u9150\u9178: "2160-0",
      \u8840\u4E2D\u808C\u9178\u9150: "2160-0",
      // v0.12.1 (SMART app dev bug 10 2026-05-29): some hospitals bill
      // urine creatinine under serum-billing code 09015C with the
      // display annotating "(尿液)". Without explicit urine variants
      // here, longest-match returns the bare "肌酸酐" key → 2160-0
      // serum LOINC even though the row is urine. Longer urine-
      // annotated keys win. 2161-8 = "Creatinine [Mass/volume] in
      // Urine" (verified at loinc.org/2161-8/ earlier).
      "\u808C\u9178\u9150(\u5C3F\u6DB2)(\u534A\u5B9A\u91CF)": "2161-8",
      "\u808C\u9178\u9150(\u5C3F\u6DB2)": "2161-8",
      "\u808C\u9178\u9150(\u5C3F)": "2161-8",
      "\u808C\u9178\u9150(u)": "2161-8",
      // ASCII keys ending in ")" fail \b regex boundary at end of match
      // (same \b-non-word-char-no-boundary issue documented in v0.11.13
      // APTT ratio fix). Use opening-paren-only form so \b at end fires
      // on the word char preceding ")" — "creatinine(u" matches inside
      // "creatinine(u)" with \b after "u".
      "creatinine(u": "2161-8",
      "creatinine(urine": "2161-8",
      // v0.13.1 (app dev urinalysis A/B audit 2026-06-02): A-channel ships
      // the abbreviation "CREA(U)(半定量)" — "creatinine(u" did NOT match
      // (no "creatinine" substring in "crea(u)"), so it fell to global
      // LOINC_MAP "crea" → 2160-0 SERUM creatinine while the B-channel
      // "肌酸酐(尿液)" correctly got urine 2161-8. Add the abbreviated
      // opening-paren form. Same verified LOINC 2161-8 "Creatinine
      // [Mass/volume] in Urine" — WebFetch loinc.org/2161-8 confirmed
      // 2026-06-02 (System Urine). ✅
      "crea(u": "2161-8",
      "crea(urine": "2161-8",
      "u-creatinine": "2161-8",
      "urine creatinine": "2161-8",
      "creatinine, urine": "2161-8"
    },
    // ── PT/INR panel (08026C) ────────────────────────────
    // Taiwan labs bill PT (seconds) and INR (ratio) under the SAME 08026C
    // code, distinguished only by display string. Without this panel
    // table both rows mapped to LOINC 6301-6 (INR); a warfarin trend
    // view would plot a PT=12 sec point as INR=12 (instant overdose
    // alarm) or merge PT and INR into one series. Each LOINC verified
    // at loinc.org:
    //   5902-2  Prothrombin time (PT) in Platelet poor plasma by
    //           Coagulation assay
    //   6301-6  INR in Platelet poor plasma by Coagulation assay
    //   5894-1  Prothrombin time (PT) Control in Platelet poor plasma
    //           by Coagulation assay
    // Order is longest-key-wins inside _findLongestMatch so insertion
    // order doesn't matter, but readability benefits from
    // longest-specific first.
    "08026C": {
      "international normalized ratio": "6301-6",
      // v0.11.9 (SMART app dev report 2026-05-29 + loinc.org audit):
      // 5894-1's canonical name is "Prothrombin time (PT) actual/Normal"
      // — Component=Prothrombin time actual/Normal, Property=RelTime
      // (a RATIO, not a control reading). Earlier v0.9.10 mapping of
      // "PT control" / "對照" / "對照組" / "prothrombin time control"
      // → 5894-1 was based on the misread that 5894-1 was a "control"
      // LOINC. It is NOT — these displays describe lab QC control plasma
      // readings, which have no clinical LOINC fit and are already
      // candidates for the QC filter (looksLikeQcControl). Removing the
      // wrong LOINC mapping so any "Control PT" rows that slip past the
      // QC filter fall back to NHI-coding-only, rather than being
      // mis-labelled as a PT-ratio analyte.
      "prothrombin time": "5902-2",
      "pt (sec)": "5902-2",
      "pt sec": "5902-2",
      "pt-sec": "5902-2",
      \u51DD\u8840\u9176\u539F\u6642\u9593: "5902-2",
      \u51DD\u8840\u6642\u9593: "5902-2",
      // Bug report 2026-05-27 v0.11.1: 長庚嘉義 LIS prints "P.T" (dot-
      // separated initials). `_keywordMatches` uses \b...\b regex on
      // ASCII keys, and the period in "p.t" breaks the implicit word
      // boundary that "pt" relied on — so `pt` key never matched and
      // path-C fallback returned NHI_TO_LOINC = 6301-6 (INR) for a
      // 11.9 sec PT measurement. Patient-safety-adjacent: SMART app
      // would plot 11.9 in the INR column (looks like fatal INR=11.9
      // → emergency reversal). Adding period-separated variants.
      "p.t": "5902-2",
      "p . t": "5902-2",
      "p t": "5902-2",
      inr: "6301-6",
      pt: "5902-2"
    },
    // ── APTT panel (08036C) ──────────────────────────────
    // Taiwan labs bill TWO sub-rows under 08036C:
    //   1. "APTT" / "活化部份凝血活酶時間" — value in seconds (~25-35 sec
    //      normal). LOINC 14979-9 (aPTT in PPP, Property=Time).
    //   2. "Heparin治療範圍參考倍數" / "APTT data/mean" / "APTT actual/normal"
    //      — ratio (patient APTT / lab normal mean), value ~1.0 ± dimensionless.
    //      LOINC 63561-5 (aPTT actual/normal in PPP, Property=RelTime).
    // Before v0.11.9 BOTH rows mapped to 14979-9 — a ratio value of 1.08
    // displayed under APTT-time column would read as fatally low APTT
    // (normal lower bound ~25 sec), or render seconds units on a unitless
    // ratio. SMART app dev report 2026-05-29.
    //
    // LOINC verified at loinc.org (2026-05-29):
    //   14979-9 Component=aPTT, Property=Time, System=PPP (seconds)
    //   63561-5 Component=aPTT actual/normal, Property=RelTime, System=PPP (ratio)
    //
    // Longest-key-wins via _findLongestMatch — so the longer ratio
    // synonyms get priority over the bare "APTT" → time fallback when
    // a row's display contains both substrings.
    "08036C": {
      // Ratio variants — Taiwan LIS shows "Heparin治療範圍參考倍數"
      // (Heparin therapeutic range reference multiplier) when reporting
      // the APTT ratio for heparin monitoring. Also "APTT data/mean"
      // (denominator-explicit form) and "actual/normal" verbiage.
      heparin\u6CBB\u7642\u7BC4\u570D\u53C3\u8003\u500D\u6578: "63561-5",
      heparin\u6CBB\u7642\u7BC4\u570D: "63561-5",
      \u6CBB\u7642\u7BC4\u570D\u53C3\u8003\u500D\u6578: "63561-5",
      \u53C3\u8003\u500D\u6578: "63561-5",
      "aptt data/mean": "63561-5",
      "aptt actual/normal": "63561-5",
      "aptt ratio": "63561-5",
      "aptt mean": "63561-5",
      // v0.11.13: parenthesised variant ("APTT (ratio)" with space + paren)
      // observed in v0.11.10 lockdown test. \b-bounded "aptt (ratio)" key
      // doesn't match at the trailing ")" (non-word char has no \b before
      // end of string). Workaround: add bare "ratio" key — \b around the
      // ASCII word "ratio" matches even inside parens, longest-match wins
      // over bare "aptt" (5 chars > 4). Combined with "{ratio}" unit
      // pre-canonicalisation, this routes the ratio analyte cleanly.
      ratio: "63561-5",
      "aptt-ratio": "63561-5",
      // Bare time variants — fall through to seconds LOINC.
      aptt: "14979-9",
      "a.p.t.t": "14979-9",
      \u6D3B\u5316\u90E8\u4EFD\u51DD\u8840\u6D3B\u9176\u6642\u9593: "14979-9",
      \u90E8\u4EFD\u51DD\u8840\u6D3B\u9176\u6642\u9593: "14979-9",
      \u51DD\u8840\u6D3B\u9176\u6642\u9593: "14979-9"
    },
    // ── Synovial / body-fluid panel (16008C) ─────────────
    // 16008C bills the full body-fluid analysis: appearance / color /
    // WBC count / differential. Each sub-item has its own specimen-
    // aware LOINC. Panel-scoped table runs before the global one so
    // shorter generic keys (e.g. global "wbc" → 6690-2 blood WBC)
    // can't shadow the body-fluid specific LOINCs. Each LOINC verified
    // at loinc.org:
    //   5778-6  Color of Urine (re-used for body-fluid color; cell-counter
    //           descriptive LOINC, specimen-agnostic in practice)
    //   26466-3 Leukocytes [#/volume] in Body fluid by Manual count
    //   10328-6 Neutrophils/100 leukocytes in Body fluid
    //   13046-8 Lymphocytes [#/volume] in Body fluid
    // The "sf.*" notation matches Taiwan LIS prefixes ("SF" = Synovial
    // Fluid) that appear in raw display text.
    "16008C": {
      "sf.neutrophil": "10328-6",
      "sf neutrophil": "10328-6",
      neutrophil: "10328-6",
      "sf.lympho": "13046-8",
      "sf lympho": "13046-8",
      "sf.lymphocyte": "13046-8",
      lymphocyte: "13046-8",
      lymphocytes: "13046-8",
      "sf.wbc": "26466-3",
      "sf wbc": "26466-3",
      wbc: "26466-3",
      leukocyte: "26466-3",
      leukocytes: "26466-3",
      "sf.color": "5778-6",
      "sf color": "5778-6",
      color: "5778-6",
      \u984F\u8272: "5778-6"
    },
    // ── CBC with auto diff (08013C) ──────────────────────
    // 08013C reports each cell type as a PERCENT of leukocytes (per 100),
    // distinct LOINCs from the absolute-count series (08010C Eosinophil
    // count → 711-2 is a different billing code with the count semantics).
    // Adding these here so under 08013C the diff entries route to the
    // /100 leukocytes LOINCs instead of falling to global eosinophil
    // count or "白血球" → WBC.
    "08013C": {
      // Differential percentages — shared with the CBC sibling billing
      // codes (08002C / 08003C / 08004C / 08006C) above; see
      // CBC_DIFF_KEYS const for the source of truth (includes singular
      // "Segment" Part 4 fix + 淋巴白血球 / 單核白血球 / 嗜中性白血球
      // wider CJK variants added v0.9.10 Part 6 N3).
      ...CBC_DIFF_KEYS,
      // v0.11.11 (SMART app dev bug 2 2026-05-29): basic CBC component
      // displays (Hct, Hb, RBC indices) also appear under 08013C diff
      // panel printout in some Taiwan LIS. Without these mappings, e.g.
      // "Hct(血球容積比)" rows previously fell to panel LOINC 57021-8
      // (CBC W Auto Diff panel). Adding the shared component keys here
      // routes basic CBC entries to their canonical LOINCs.
      ...CBC_COMPONENT_KEYS,
      // WBC absolute count can also appear on the diff panel printout.
      \u767D\u8840\u7403: "6690-2",
      wbc: "6690-2"
    }
  };

  // ../packages/mapper/src/observation.ts
  function isAsciiOnly(s) {
    for (let i = 0; i < s.length; i++) {
      if (s.charCodeAt(i) > 127)
        return false;
    }
    return true;
  }
  var LAB_SYNONYMS = {
    // Diabetes
    \u91A3\u5316\u8840\u7D05\u7D20: "HBA1C",
    \u7CD6\u5316\u8840\u8272\u7D20: "HBA1C",
    \u7CD6\u5316\u8840\u7D05\u7D20: "HBA1C",
    "GLYCATED HEMOGLOBIN": "HBA1C",
    HBA1C: "HBA1C",
    A1C: "HBA1C",
    \u7A7A\u8179\u8840\u7CD6: "GLUCOSE_FASTING",
    "FASTING GLUCOSE": "GLUCOSE_FASTING",
    \u8461\u8404\u7CD6: "GLUCOSE",
    \u8840\u7CD6: "GLUCOSE",
    GLUCOSE: "GLUCOSE",
    // CBC
    \u767D\u8840\u7403\u8A08\u6578: "WBC",
    \u767D\u8840\u7403: "WBC",
    WBC: "WBC",
    \u7D05\u8840\u7403\u8A08\u6578: "RBC",
    \u7D05\u8840\u7403: "RBC",
    RBC: "RBC",
    \u8840\u7D05\u7D20: "HEMOGLOBIN",
    \u8840\u8272\u7D20: "HEMOGLOBIN",
    HEMOGLOBIN: "HEMOGLOBIN",
    HGB: "HEMOGLOBIN",
    // v0.11.7 pre-existing gap (defensive): "Hb" was missing from
    // LAB_SYNONYMS so Hb display canonical → "hb" (fallback), not
    // HEMOGLOBIN → cross-language merge with "血紅素" never happened.
    HB: "HEMOGLOBIN",
    \u8840\u5BB9\u7A4D\u6BD4: "HEMATOCRIT",
    HEMATOCRIT: "HEMATOCRIT",
    HCT: "HEMATOCRIT",
    \u8840\u5C0F\u677F: "PLATELET",
    PLATELET: "PLATELET",
    PLT: "PLATELET",
    // CBC indices (10-char and 7-char CJK forms beat bare 紅血球)
    \u5E73\u5747\u7D05\u8840\u7403\u8840\u8272\u7D20\u6FC3\u5EA6: "MCHC",
    \u5E73\u5747\u7D05\u8840\u7403\u8840\u8272\u7D20: "MCH",
    \u5E73\u5747\u7D05\u8840\u7403\u6FC3\u5EA6: "MCHC",
    \u5E73\u5747\u7D05\u8840\u7403\u9AD4\u7A4D: "MCV",
    \u7D05\u8840\u7403\u5206\u5E03\u5BEC\u5EA6: "RDW",
    MCV: "MCV",
    MCH: "MCH",
    MCHC: "MCHC",
    RDW: "RDW",
    // CBC differential
    \u55DC\u4E2D\u6027\u767D\u8840\u7403: "NEUTROPHIL",
    \u55DC\u4F0A\u7D05\u6027\u767D\u8840\u7403: "EOSINOPHIL",
    \u55DC\u9178\u6027\u767D\u8840\u7403: "EOSINOPHIL",
    \u55DC\u9E7C\u6027\u767D\u8840\u7403: "BASOPHIL",
    \u6DCB\u5DF4\u7403: "LYMPHOCYTE",
    \u55AE\u6838\u7403: "MONOCYTE",
    EOSINOPHILS: "EOSINOPHIL",
    EOSINOPHIL: "EOSINOPHIL",
    NEUTROPHILS: "NEUTROPHIL",
    NEUTROPHIL: "NEUTROPHIL",
    BASOPHILS: "BASOPHIL",
    BASOPHIL: "BASOPHIL",
    LYMPHOCYTES: "LYMPHOCYTE",
    LYMPHOCYTE: "LYMPHOCYTE",
    MONOCYTES: "MONOCYTE",
    MONOCYTE: "MONOCYTE",
    // Lipid — LDL/HDL must precede bare CHOLESTEROL.
    "LDL CHOLESTEROL": "LDL_C",
    "LDL-CHOLESTEROL": "LDL_C",
    "HDL CHOLESTEROL": "HDL_C",
    "HDL-CHOLESTEROL": "HDL_C",
    \u4F4E\u5BC6\u5EA6\u81BD\u56FA\u9187: "LDL_C",
    \u9AD8\u5BC6\u5EA6\u81BD\u56FA\u9187: "HDL_C",
    \u4F4E\u5BC6\u5EA6\u8102\u86CB\u767D\u81BD\u56FA\u9187: "LDL_C",
    \u9AD8\u5BC6\u5EA6\u8102\u86CB\u767D\u81BD\u56FA\u9187: "HDL_C",
    \u8840\u6E05\u7E3D\u81BD\u56FA\u9187: "TOTAL_CHOLESTEROL",
    \u7E3D\u81BD\u56FA\u9187: "TOTAL_CHOLESTEROL",
    "T-CHOLESTEROL": "TOTAL_CHOLESTEROL",
    "T-CHOL": "TOTAL_CHOLESTEROL",
    "TOTAL CHOLESTEROL": "TOTAL_CHOLESTEROL",
    CHOLESTEROL: "TOTAL_CHOLESTEROL",
    CHOL: "TOTAL_CHOLESTEROL",
    \u4E09\u9178\u7518\u6CB9\u916F: "TRIGLYCERIDE",
    TRIGLYCERIDE: "TRIGLYCERIDE",
    "HDL-C": "HDL_C",
    HDL: "HDL_C",
    \u9AD8\u5BC6\u5EA6\u8102\u86CB\u767D: "HDL_C",
    "LDL-C(DIRECT)": "LDL_C",
    "LDL-C": "LDL_C",
    LDL: "LDL_C",
    \u4F4E\u5BC6\u5EA6\u8102\u86CB\u767D: "LDL_C",
    // Renal — urine creatinine variants before serum.
    // v0.11.7 fix (bug 2026-05-28): added longer-keyed entries for
    // 肌酸酐(尿液) / 微白蛋白/肌酐酸比值 so urinalysis half-quantitative
    // rows don't collide with serum creatinine via shorter "肌酸酐" key.
    // Original short keys (肌酸酐 / 肌酐酸 → CREATININE) preserved for
    // serum rows; longer urinalysis-specific keys take priority via
    // longest-match in canonicalLabKey.
    "\u5FAE\u767D\u86CB\u767D/\u808C\u9150\u9178\u6BD4\u503C": "UACR",
    UACR: "UACR",
    "MALB/CRE": "UACR",
    "ALB/CRE": "UACR",
    "\u808C\u9178\u9150(\u5C3F\u6DB2)": "URINE_CREATININE",
    \u5C3F\u6DB2\u808C\u9178\u9150: "URINE_CREATININE",
    "URINE CREATININE": "URINE_CREATININE",
    "CREATININE(U)": "URINE_CREATININE",
    "CREATININE-U": "URINE_CREATININE",
    "CREA(U)": "URINE_CREATININE",
    "CREA-U": "URINE_CREATININE",
    "U-CRE": "URINE_CREATININE",
    "U-CREA": "URINE_CREATININE",
    \u808C\u9178\u9150: "CREATININE",
    \u808C\u9150\u9178: "CREATININE",
    "CREATININE(B)": "CREATININE",
    CREATININE: "CREATININE",
    CREA: "CREATININE",
    CRTN: "CREATININE",
    EGFR: "EGFR",
    \u5C3F\u7D20\u6C2E: "BUN",
    BUN: "BUN",
    \u5C3F\u9178\u9E7C\u5EA6: "URINE_PH",
    \u5C3F\u6DB2\u9178\u9E7C\u5EA6: "URINE_PH",
    \u9178\u9E7C\u5EA6: "PH",
    \u5C3F\u9178: "URIC_ACID",
    "URIC ACID": "URIC_ACID",
    URIC_ACID: "URIC_ACID",
    // Liver
    AST: "AST",
    ALT: "ALT",
    GOT: "AST",
    GPT: "ALT",
    \u81BD\u7D05\u7D20: "BILIRUBIN",
    BILIRUBIN: "BILIRUBIN",
    // v0.11.7 (bug 2026-05-28): longer keys for urinalysis to prevent
    // collision with serum analytes — 微白蛋白(尿) wasn't 白蛋白; 白血
    // 球酯脢 wasn't blood 白血球. Longer keys take priority via
    // longest-match sorting.
    "\u5FAE\u767D\u86CB\u767D(\u5C3F)": "URINE_MICROALBUMIN",
    "\u5FAE\u767D\u86CB\u767D": "URINE_MICROALBUMIN",
    "MALB(U)": "URINE_MICROALBUMIN",
    MICROALBUMIN: "URINE_MICROALBUMIN",
    \u767D\u86CB\u767D: "ALBUMIN",
    ALBUMIN: "ALBUMIN",
    \u767D\u8840\u7403\u916F\u8122: "URINE_LEU_ESTERASE",
    \u767D\u8840\u7403\u916F\u9176: "URINE_LEU_ESTERASE",
    "WBC ESTERASE": "URINE_LEU_ESTERASE",
    "LEUKOCYTE ESTERASE": "URINE_LEU_ESTERASE",
    // Cardiac
    \u5FC3\u808C\u65CB\u8F49\u86CB\u767D: "TROPONIN",
    TROPONIN: "TROPONIN",
    BNP: "BNP",
    \u5FC3\u81DF: "TROPONIN",
    // Thyroid
    \u7532\u72C0\u817A\u523A\u6FC0\u7D20: "TSH",
    TSH: "TSH",
    \u6E38\u96E2\u7532\u72C0\u817A\u7D20: "FREE_T4",
    "FREE T4": "FREE_T4",
    FT4: "FREE_T4",
    // Misc
    C\u53CD\u61C9\u6027\u86CB\u767D: "CRP",
    "C-REACTIVE PROTEIN": "CRP",
    CRP: "CRP",
    "HS-CRP": "HS_CRP",
    \u651D\u8B77\u817A\u7279\u7570\u6297\u539F: "PSA",
    PSA: "PSA",
    \u9435\u86CB\u767D: "FERRITIN",
    FERRITIN: "FERRITIN",
    \u8449\u9178: "FOLATE",
    FOLATE: "FOLATE",
    \u7DAD\u751F\u7D20B12: "VITAMIN_B12",
    "VIT B12": "VITAMIN_B12",
    "VITAMIN B12": "VITAMIN_B12",
    \u76AE\u8CEA\u7D20: "CORTISOL",
    CORTISOL: "CORTISOL",
    \u6885\u6BD2: "RPR",
    RPR: "RPR",
    \u96B1\u7403\u83CC\u6297\u539F: "CRYPTOCOCCAL_AG",
    CRYPAG: "CRYPTOCOCCAL_AG",
    \u8840\u6C28: "AMMONIA",
    AMMONIA: "AMMONIA",
    \u51DD\u8840\u9176\u539F\u6642\u9593: "PT",
    APTT: "APTT",
    INR: "INR"
  };
  var LAB_SYNONYM_KEYS_SORTED = Object.keys(LAB_SYNONYMS).sort((a, b) => b.length - a.length);
  var URINALYSIS_PANEL_SYNONYMS = {
    // English / abbreviation variants
    GLUCOSE: "URINE_GLUCOSE",
    "U-SUGAR": "URINE_GLUCOSE",
    SUGAR: "URINE_GLUCOSE",
    "U-GLUCOSE": "URINE_GLUCOSE",
    COLOR: "URINE_COLOR",
    COLOUR: "URINE_COLOR",
    BLOOD: "URINE_OCCULT_BLOOD",
    "U-BLOOD": "URINE_OCCULT_BLOOD",
    OB: "URINE_OCCULT_BLOOD",
    "OCCULT BLOOD": "URINE_OCCULT_BLOOD",
    PROTEIN: "URINE_PROTEIN",
    "U-PRO": "URINE_PROTEIN",
    "U-PROTEIN": "URINE_PROTEIN",
    KETONE: "URINE_KETONES",
    KETONES: "URINE_KETONES",
    KET: "URINE_KETONES",
    NITRITE: "URINE_NITRITE",
    NIT: "URINE_NITRITE",
    TURBIDITY: "URINE_TURBIDITY",
    "SP.GRAVITY": "URINE_SG",
    SG: "URINE_SG",
    "S.G.": "URINE_SG",
    "S.G": "URINE_SG",
    "SPECIFIC GRAVITY": "URINE_SG",
    UROBILINOGEN: "URINE_UROBILINOGEN",
    UBG: "URINE_UROBILINOGEN",
    URO: "URINE_UROBILINOGEN",
    // pH variants — v0.11.7 missing in initial commit; user reported
    // pH (英) + 酸鹼值 (中) still as 2 rows in 06013C bundle.
    PH: "URINE_PH",
    "P.H.": "URINE_PH",
    "P.H": "URINE_PH",
    "U-PH": "URINE_PH",
    // Bilirubin variants — separate from serum BILIRUBIN so urine
    // bilirubin (06013C) doesn't cross-panel-collide with serum
    // total bilirubin (09029C). Within scope, English "Bilirubin" and
    // CJK 膽紅素 both → URINE_BILIRUBIN → merge as 1 row.
    BILIRUBIN: "URINE_BILIRUBIN",
    BILI: "URINE_BILIRUBIN",
    "U-BILI": "URINE_BILIRUBIN",
    // CJK variants — paired with English above so cross-language dedup works
    \u5C3F\u7CD6: "URINE_GLUCOSE",
    \u984F\u8272: "URINE_COLOR",
    \u5C3F\u6F5B\u8840: "URINE_OCCULT_BLOOD",
    \u5C3F\u86CB\u767D: "URINE_PROTEIN",
    \u916E\u9AD4: "URINE_KETONES",
    \u4E9E\u785D\u9178\u9E7D: "URINE_NITRITE",
    \u6FC1\u5EA6: "URINE_TURBIDITY",
    \u6BD4\u91CD: "URINE_SG",
    \u5C3F\u81BD\u7D20\u539F: "URINE_UROBILINOGEN",
    \u9178\u9E7C\u503C: "URINE_PH",
    \u9178\u9E7C\u5EA6: "URINE_PH",
    \u81BD\u7D05\u7D20: "URINE_BILIRUBIN"
  };
  var CODE_SCOPED_SYNONYMS = {
    "06013C": URINALYSIS_PANEL_SYNONYMS
  };
  var CODE_SCOPED_CJK_KEYS_SORTED = Object.fromEntries(
    Object.entries(CODE_SCOPED_SYNONYMS).map(([code, table]) => [
      code,
      Object.keys(table).filter((k) => !isAsciiOnly(k)).sort((a, b) => b.length - a.length)
    ])
  );

  // src/popup/state.ts
  var state = {
    connState: "unknown",
    connFailReason: null,
    backendPatient: { state: "unknown", count: 0, lastUpdated: null },
    localBundle: { exists: false, count: 0, generatedAt: 0, patientId: null },
    activeStep: 1,
    wizardInitialized: false,
    step2Confirmed: false,
    latestStatus: null,
    nhiTabId: null
  };

  // src/popup/utils.ts
  function isNhiTab(url) {
    if (!url)
      return false;
    try {
      const u = typeof url === "string" ? new URL(url) : url;
      return /myhealthbank\.nhi\.gov\.tw/.test(u.hostname);
    } catch {
      return false;
    }
  }
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }
  function currentMode() {
    for (const r of els.modeRadios())
      if (r.checked)
        return r.value;
    return DEFAULT_MODE;
  }
  function _fmtTimeShort(iso) {
    if (!iso)
      return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()))
      return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function _fmtRelative(ms) {
    const diff = Date.now() - ms;
    if (diff < 6e4)
      return `${Math.max(1, Math.round(diff / 1e3))} \u79D2\u524D`;
    if (diff < 36e5)
      return `${Math.round(diff / 6e4)} \u5206\u9418\u524D`;
    if (diff < 864e5)
      return `${Math.round(diff / 36e5)} \u5C0F\u6642\u524D`;
    return _fmtTimeShort(new Date(ms).toISOString());
  }
  function _fmtBytes(n) {
    if (n < 1024)
      return `${n} B`;
    if (n < 1024 * 1024)
      return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  }
  function _fmtElapsed(ms) {
    if (ms < 6e4)
      return `${Math.floor(ms / 1e3)}s`;
    return `${Math.floor(ms / 6e4)}m${Math.round(ms % 6e4 / 1e3)}s`;
  }
  function _stepNumGlyph(n) {
    return n === 1 ? "\u2460" : n === 2 ? "\u2461" : n === 3 ? "\u2462" : "\u2463";
  }
  function _generateAutoPatientId() {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `auto-${hex}`;
  }
  function _displayId(idNo) {
    if (!idNo || idNo.startsWith("auto-"))
      return "";
    return maskId(idNo);
  }
  function _ageFromBirthDate(iso) {
    if (!iso || typeof iso !== "string")
      return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()))
      return null;
    const now = /* @__PURE__ */ new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || m === 0 && now.getDate() < d.getDate())
      age--;
    if (age < 0 || age > 150)
      return null;
    return age;
  }
  function _genderZh(code) {
    if (code === "male")
      return "\u7537";
    if (code === "female")
      return "\u5973";
    if (code === "other")
      return "\u5176\u4ED6";
    return "";
  }
  function _originPatternFor(url) {
    try {
      const u = new URL(url);
      return `${u.protocol}//${u.host}/*`;
    } catch {
      return null;
    }
  }
  function _isSafeSmartAppUrl(s) {
    try {
      const u = new URL(s);
      if (u.protocol === "https:")
        return true;
      if (u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // src/popup/wizard.ts
  function _markStep2Confirmed(yes) {
    state.step2Confirmed = !!yes;
  }
  function _isStepDone(step) {
    const onNhi = !els.syncApiBtn.dataset.offNhi;
    const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
    switch (step) {
      case 1:
        return onNhi && loggedIn;
      case 2:
        return state.step2Confirmed;
      case 3:
        return !!els.pendingBundle && !els.pendingBundle.hidden;
      case 4:
        return false;
      default:
        return false;
    }
  }
  var ACTIVE_STEP_LS_KEY = "nhi-bridge:activeStep";
  function _restoreActiveStepFromCache() {
    try {
      const raw = localStorage.getItem(ACTIVE_STEP_LS_KEY);
      if (!raw)
        return;
      const n = Number(raw);
      if (Number.isFinite(n) && n >= 1 && n <= 4) {
        state.activeStep = n;
        document.body.dataset.activeStep = String(n);
      }
    } catch {
    }
  }
  function _setActiveStep(n, opts = {}) {
    const clamped = Math.max(1, Math.min(4, n));
    state.activeStep = clamped;
    document.body.dataset.activeStep = String(clamped);
    try {
      localStorage.setItem(ACTIVE_STEP_LS_KEY, String(clamped));
    } catch {
    }
    _refreshWizardUi();
    if (!opts.silent) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  function _refreshWizardUi() {
    if (!els.wizardStepper)
      return;
    const lis = els.wizardStepper.querySelectorAll("li[data-step]");
    for (const li of lis) {
      const n = Number(li.dataset.step);
      const isActive = n === state.activeStep;
      const isDone = _isStepDone(n);
      if (isActive)
        li.setAttribute("aria-current", "true");
      else
        li.removeAttribute("aria-current");
      if (isDone)
        li.dataset.done = "true";
      else
        delete li.dataset.done;
    }
    const onNhi = !els.syncApiBtn.dataset.offNhi;
    const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
    if (els.openNhiSection)
      els.openNhiSection.hidden = onNhi;
    if (els.nhiNeedsLoginSection)
      els.nhiNeedsLoginSection.hidden = !onNhi || loggedIn;
    if (els.loginOkSection)
      els.loginOkSection.hidden = !(onNhi && loggedIn);
    _refreshResultZone();
  }
  function _refreshResultZone() {
    if (!els.resultZone)
      return;
    const hasStatus = (els.status?.textContent ?? "").trim() !== "";
    const dataStateShown = els.dataStateSection && !els.dataStateSection.hidden;
    const bundleShown = els.pendingBundle && !els.pendingBundle.hidden;
    const launchUsable = currentMode() === "backend" && els.launchBtn && !els.launchBtn.disabled;
    els.resultZone.hidden = !(hasStatus || bundleShown || dataStateShown || launchUsable);
    if (els.bundleMetaBlock) {
      els.bundleMetaBlock.hidden = !bundleShown;
    }
    if (els.launchBtn) {
      els.launchBtn.hidden = currentMode() !== "backend" || !launchUsable;
    }
    const hasResultArtifact = bundleShown || launchUsable;
    if (els.syncApiBtn) {
      const shouldDemote = hasResultArtifact && !els.syncApiBtn.disabled;
      els.syncApiBtn.classList.toggle("is-secondary", shouldDemote);
      if (!state.latestStatus?.running) {
        els.syncApiBtn.textContent = shouldDemote ? "\u91CD\u65B0\u53D6\u5F97" : "\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599";
      }
    }
  }
  function _maybeAutoAdvance() {
    if (state.activeStep === 1 && _isStepDone(1))
      _setActiveStep(2);
    else if (state.activeStep === 2 && _isStepDone(2))
      _setActiveStep(3);
  }
  function _initWizard() {
    if (state.wizardInitialized)
      return;
    state.wizardInitialized = true;
    let start;
    if (!_isStepDone(1))
      start = 1;
    else if (!_isStepDone(2))
      start = 2;
    else if (!_isStepDone(3))
      start = 3;
    else
      start = 4;
    _setActiveStep(start, { silent: true });
    for (const li of els.wizardStepper.querySelectorAll("li[data-step]")) {
      li.addEventListener("click", () => _setActiveStep(Number(li.dataset.step)));
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          _setActiveStep(Number(li.dataset.step));
        }
      });
    }
  }
  function _refreshButtonStates() {
    const onNhi = !els.syncApiBtn.dataset.offNhi;
    const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
    const modeOk = currentMode() === "local" || state.connState === "ok";
    const step2BasicOk = !!els.ovGender?.value && !!els.ovName?.value?.trim();
    const dobError = validateBirthDate();
    let inlineMsg = "";
    let jumpTo = null;
    let tooltipReason = "";
    if (!onNhi) {
      inlineMsg = "\u8ACB\u5207\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801";
      jumpTo = { step: 1, label: "\u767B\u5165" };
    } else if (!loggedIn) {
      inlineMsg = "\u5065\u4FDD\u5B58\u647A\u5206\u9801\u5C1A\u672A\u767B\u5165";
      jumpTo = { step: 1, label: "\u767B\u5165" };
    } else if (!step2BasicOk) {
      inlineMsg = "\u8ACB\u5B8C\u6210\u57FA\u672C\u8CC7\u6599\u4E26\u6309\u78BA\u5B9A";
      jumpTo = { step: 2, label: "\u60A8\u7684\u8CC7\u6599" };
    } else if (dobError) {
      inlineMsg = dobError;
      jumpTo = { step: 2, label: "\u60A8\u7684\u8CC7\u6599" };
    } else if (!modeOk) {
      inlineMsg = "";
      tooltipReason = "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA";
    }
    if (jumpTo)
      tooltipReason = `\u56DE ${_stepNumGlyph(jumpTo.step)} ${jumpTo.label}\uFF1A${inlineMsg}`;
    const syncRunning = state.latestStatus?.running === true;
    els.syncApiBtn.disabled = syncRunning || tooltipReason !== "";
    els.syncApiBtn.title = syncRunning ? "" : tooltipReason;
    if (els.syncBlockedReason) {
      const show = !syncRunning && inlineMsg !== "";
      els.syncBlockedReason.hidden = !show;
      if (show) {
        els.syncBlockedReason.textContent = "";
        const msgEl = document.createElement("span");
        msgEl.className = "cta-reason-msg";
        msgEl.textContent = `\u2192 ${inlineMsg}`;
        els.syncBlockedReason.appendChild(msgEl);
        if (jumpTo) {
          const jumpEl = document.createElement("span");
          jumpEl.className = "cta-reason-jump";
          jumpEl.textContent = `\u56DE ${_stepNumGlyph(jumpTo.step)} ${jumpTo.label} \u2192`;
          els.syncBlockedReason.appendChild(jumpEl);
          els.syncBlockedReason.dataset.targetStep = String(jumpTo.step);
        } else {
          delete els.syncBlockedReason.dataset.targetStep;
        }
      }
    }
    if (els.stopBtn)
      els.stopBtn.hidden = !syncRunning;
    const ov = getPatientOverride();
    const haveBackendPatient = state.backendPatient.state === "present";
    els.launchBtn.disabled = !(currentMode() === "backend" && state.connState === "ok" && !!ov?.id_no && haveBackendPatient);
    els.launchBtn.title = currentMode() !== "backend" ? "\u8ACB\u5207\u5230\u300C\u{1F3E5} \u672C\u6A5F\u4F3A\u670D\u5668 (\u9032\u968E)\u300D\u6A21\u5F0F" : state.connState !== "ok" ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : !ov?.id_no ? "\u8ACB\u56DE\u5230\u300C\u2461 \u60A8\u7684\u8CC7\u6599\u300D\u586B\u5BEB\u8CC7\u6599" : !haveBackendPatient ? "\u672C\u6A5F\u4F3A\u670D\u5668\u9084\u6C92\u6709\u9019\u4F4D\u7684\u8CC7\u6599 \u2014 \u5148\u6309\u300C\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6216\u4E0B\u65B9\u300C\u628A\u9019\u6B21\u8CC7\u6599\u50B3\u5230\u672C\u6A5F\u4F3A\u670D\u5668\u300D" : "";
    if (state.wizardInitialized)
      _refreshWizardUi();
  }

  // src/popup/status.ts
  var _elapsedTickerId = null;
  function setStatus(text, kind, breakdown, errors, action) {
    els.status.className = kind || "";
    els.status.textContent = "";
    const hasErrors = Array.isArray(errors) && errors.length > 0;
    if (!text && !breakdown?.length && !hasErrors)
      return;
    const header = document.createElement("div");
    header.className = "status-header";
    const textSpan = document.createElement("span");
    textSpan.className = "status-text";
    textSpan.textContent = text || "";
    header.appendChild(textSpan);
    const running = state.latestStatus?.running === true;
    if (!running) {
      const dismissBtn = document.createElement("button");
      dismissBtn.type = "button";
      dismissBtn.className = "status-dismiss";
      dismissBtn.textContent = "\u2715";
      dismissBtn.title = "\u6E05\u9664\u9019\u5247\u8A0A\u606F";
      dismissBtn.setAttribute("aria-label", "\u6E05\u9664\u8A0A\u606F");
      dismissBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {
        });
        state.latestStatus = null;
        setStatus("", null);
      });
      header.appendChild(dismissBtn);
    }
    els.status.appendChild(header);
    if (action && typeof action.onClick === "function") {
      const actionBtn = document.createElement("button");
      actionBtn.type = "button";
      actionBtn.className = "status-action";
      actionBtn.textContent = action.label;
      actionBtn.addEventListener("click", action.onClick);
      els.status.appendChild(actionBtn);
    }
    if (breakdown?.length || hasErrors) {
      const bd = breakdown || [];
      const phaseRows = bd.filter((b) => b.startsWith("\u23F1"));
      const otherRows = bd.filter((b) => !b.startsWith("\u23F1"));
      const details = document.createElement("details");
      details.className = "status-detail";
      const summary = document.createElement("summary");
      summary.textContent = "\u67E5\u770B\u660E\u7D30";
      details.appendChild(summary);
      if (otherRows.length) {
        const body = document.createElement("div");
        body.className = "status-breakdown";
        for (const row of otherRows) {
          const lineEl = document.createElement("div");
          lineEl.className = "br-row";
          const colonIdx = row.indexOf("\uFF1A");
          if (colonIdx > 0 && colonIdx < row.length - 1) {
            const labelSpan = document.createElement("span");
            labelSpan.className = "br-label";
            labelSpan.textContent = row.slice(0, colonIdx);
            const valueSpan = document.createElement("span");
            valueSpan.className = "br-value";
            valueSpan.textContent = row.slice(colonIdx + 1).trim();
            lineEl.appendChild(labelSpan);
            lineEl.appendChild(valueSpan);
          } else {
            lineEl.classList.add("br-row-plain");
            lineEl.textContent = row;
          }
          body.appendChild(lineEl);
        }
        details.appendChild(body);
      }
      if (hasErrors) {
        const errDetails = document.createElement("details");
        errDetails.className = "status-detail status-errors";
        const errSummary = document.createElement("summary");
        errSummary.textContent = `\u5931\u6557\u660E\u7D30\uFF08${errors.length}\uFF09`;
        errDetails.appendChild(errSummary);
        const errBody = document.createElement("div");
        errBody.className = "status-error-list";
        for (const e of errors) {
          const line = document.createElement("div");
          line.textContent = `\u2022 ${e}`;
          errBody.appendChild(line);
        }
        errDetails.appendChild(errBody);
        details.appendChild(errDetails);
      }
      if (phaseRows.length) {
        const techDetails = document.createElement("details");
        techDetails.className = "status-detail status-tech";
        const techSummary = document.createElement("summary");
        techSummary.textContent = "\u6280\u8853\u7D30\u7BC0";
        techDetails.appendChild(techSummary);
        const phases = document.createElement("div");
        phases.className = "status-phases";
        for (const raw of phaseRows) {
          const clean = raw.replace(/^⏱\s*/, "");
          const eqIdx = clean.indexOf("=");
          const rowEl = document.createElement("div");
          rowEl.className = "ph-row";
          if (eqIdx > 0 && eqIdx < clean.length - 1) {
            const labelSpan = document.createElement("span");
            labelSpan.className = "ph-label";
            labelSpan.textContent = clean.slice(0, eqIdx);
            const valueSpan = document.createElement("span");
            valueSpan.className = "ph-value";
            valueSpan.textContent = clean.slice(eqIdx + 1);
            rowEl.appendChild(labelSpan);
            rowEl.appendChild(valueSpan);
          } else {
            rowEl.textContent = clean;
          }
          phases.appendChild(rowEl);
        }
        techDetails.appendChild(phases);
        details.appendChild(techDetails);
      }
      els.status.appendChild(details);
    }
    if (state.wizardInitialized)
      _refreshResultZone();
  }
  async function refreshSyncStatusFromBackground() {
    const status = await chrome.runtime.sendMessage({ type: "getSyncStatus" }).catch(() => null);
    if (!status)
      return;
    applySyncStatus(status);
  }
  function _renderStatus() {
    const status = state.latestStatus;
    if (!status)
      return;
    let text = status.progress || "(sync \u9032\u884C\u4E2D)";
    text = text.replace(/\s*[—-]\s*接著至\s*④.*$/u, "").trim();
    if (status.running && status.started) {
      const elapsed = Date.now() - status.started;
      text = `\u23F1 ${_fmtElapsed(elapsed)} \xB7 ${text}`;
    }
    const kind = status.running ? "info" : status.phase === "error" ? "error" : "success";
    const breakdown = status.running ? null : status.breakdown;
    const errors = status.running ? null : status.errors;
    let action = null;
    if (status.phase === "downloaded") {
      action = {
        label: "\u2192 \u81F3 \u2463 \u67E5\u770B \u958B\u555F\u300C\u91AB\u6790 MediPrisma\u300D",
        onClick: () => _setActiveStep(4)
      };
    }
    setStatus(text, kind, breakdown, errors, action);
  }
  function applySyncStatus(status) {
    if (!status)
      return;
    const prev = state.latestStatus;
    state.latestStatus = status;
    _renderStatus();
    const isIncrementalUpdate = prev?.phase === "done" && status.phase === "done" && !status.running && !prev.running;
    if (state.wizardInitialized && state.activeStep !== 3 && !isIncrementalUpdate) {
      _setActiveStep(3, { silent: true });
    }
    if (status.running) {
      els.syncApiBtn.disabled = true;
      els.syncApiBtn.textContent = "\u53D6\u5F97\u4E2D\u2026";
      els.stopBtn.hidden = false;
      if (!_elapsedTickerId) {
        _elapsedTickerId = setInterval(_renderStatus, 1e3);
      }
    } else {
      els.stopBtn.hidden = true;
      if (_elapsedTickerId) {
        clearInterval(_elapsedTickerId);
        _elapsedTickerId = null;
      }
      _refreshButtonStates();
      _refreshLocalBundleState();
      if (currentMode() === "backend" && state.connState === "ok")
        checkBackendPatient();
    }
  }
  async function stopSync() {
    await chrome.storage.local.set({
      syncStatus: {
        running: false,
        progress: "\u26D4 \u505C\u6B62\u4E2D\uFF0C\u6B63\u5728\u6E05\u9664\u90E8\u5206\u8CC7\u6599\u2026",
        phase: "cancelled",
        ts: Date.now(),
        completed: Date.now()
      }
    });
    setStatus("\u26D4 \u505C\u6B62\u4E2D\uFF0C\u6B63\u5728\u6E05\u9664\u90E8\u5206\u8CC7\u6599\u2026", "info");
    chrome.runtime.sendMessage({ type: "stopSync" }).catch(() => {
    });
    els.stopBtn.hidden = true;
    _refreshButtonStates();
  }

  // src/popup/data-state.ts
  function _renderDataState() {
    const ov = getPatientOverride();
    if (currentMode() !== "backend" || !ov?.id_no) {
      els.dataStateSection.hidden = true;
      if (els.syncStatusHint)
        els.syncStatusHint.hidden = true;
      return;
    }
    const localMatches = state.localBundle.exists && state.localBundle.patientId === ov.id_no;
    const inSync = state.backendPatient.state === "present" && localMatches && state.backendPatient.count === state.localBundle.count;
    if (els.syncStatusHint)
      els.syncStatusHint.hidden = !inSync;
    const nothingToShow = state.backendPatient.state === "present" && (!localMatches || inSync);
    if (nothingToShow) {
      els.dataStateSection.hidden = true;
      return;
    }
    els.dataStateSection.hidden = false;
    const bs = els.backendState;
    switch (state.backendPatient.state) {
      case "checking":
        bs.className = "state-value";
        bs.textContent = "\u6AA2\u67E5\u4E2D\u2026";
        break;
      case "absent":
        bs.className = "state-value empty";
        bs.textContent = "\u26A0 \u672C\u6A5F\u4F3A\u670D\u5668\u9084\u6C92\u6709\u9019\u4F4D\u7684\u8CC7\u6599";
        break;
      case "present": {
        const count = state.backendPatient.count;
        const ts = state.backendPatient.lastUpdated;
        bs.className = "state-value ok";
        bs.textContent = `\u2713 ${count > 0 ? `${count} \u7B46 \xB7 ` : ""}\u6700\u5F8C\u66F4\u65B0 ${_fmtTimeShort(ts) || "(unknown)"}`;
        break;
      }
      case "fail":
        bs.className = "state-value fail";
        bs.textContent = "\u2717 \u78BA\u8A8D\u5931\u6557\uFF08\u8ACB\u770B\u4E0A\u65B9\u63D0\u793A\uFF09";
        break;
      default:
        bs.className = "state-value";
        bs.textContent = "\u2014";
    }
    if (localMatches) {
      els.localStateRow.hidden = false;
      els.localState.className = "state-value ok";
      els.localState.textContent = `\u2713 ${state.localBundle.count} \u7B46 \xB7 ${_fmtRelative(state.localBundle.generatedAt)}\u7522\u751F`;
    } else {
      els.localStateRow.hidden = true;
    }
    els.pushLocalBtn.hidden = !localMatches;
    els.pushLocalBtn.disabled = false;
    els.pushLocalBtn.title = "";
    els.pushLocalBtn.textContent = "\u628A\u9019\u6B21\u8CC7\u6599\u50B3\u5230\u672C\u6A5F\u4F3A\u670D\u5668";
  }
  async function _refreshLocalBundleState() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    state.localBundle = pending ? {
      exists: true,
      count: pending.entryCount || 0,
      generatedAt: pending.generatedAt || 0,
      patientId: pending.patientId || null
    } : { exists: false, count: 0, generatedAt: 0, patientId: null };
    _renderDataState();
  }
  async function checkBackendPatient() {
    const ov = getPatientOverride();
    if (currentMode() !== "backend" || !ov?.id_no || state.connState !== "ok") {
      state.backendPatient = { state: "unknown", count: 0, lastUpdated: null };
      _renderDataState();
      _refreshButtonStates();
      return;
    }
    state.backendPatient = { state: "checking", count: 0, lastUpdated: null };
    _renderDataState();
    const url = els.backendUrl.value.trim().replace(/\/$/, "");
    const key = els.syncApiKey.value.trim();
    const headers = key ? { "X-Sync-API-Key": key } : {};
    const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
    const fhirPid = effectiveFhirPatientId(ov.id_no, maskNameEnabled === true);
    try {
      const pr = await fetch(`${url}/fhir/Patient/${encodeURIComponent(fhirPid)}`, { headers });
      if (pr.status === 404) {
        state.backendPatient = { state: "absent", count: 0, lastUpdated: null };
        _renderDataState();
        _refreshButtonStates();
        return;
      }
      if (!pr.ok) {
        state.backendPatient = { state: "fail", count: 0, lastUpdated: null };
        _renderDataState();
        _refreshButtonStates();
        return;
      }
      const patient = await pr.json();
      const lastUpdated = patient?.meta?.lastUpdated ?? null;
      let count = 0;
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 5e3);
        const er = await fetch(`${url}/fhir/export?patient=${encodeURIComponent(fhirPid)}`, {
          headers,
          signal: ctrl.signal
        });
        clearTimeout(timer);
        if (er.ok) {
          const bundle = await er.json();
          if (Array.isArray(bundle.entry))
            count = bundle.entry.length;
        }
      } catch {
      }
      state.backendPatient = { state: "present", count, lastUpdated };
    } catch (_e) {
      state.backendPatient = { state: "fail", count: 0, lastUpdated: null };
    }
    _renderDataState();
    _refreshButtonStates();
  }
  async function pushLocalBundleToBackend() {
    const ov = getPatientOverride();
    if (!ov?.id_no || !state.localBundle.exists || state.localBundle.patientId !== ov.id_no)
      return;
    const url = els.backendUrl.value.trim().replace(/\/$/, "");
    const key = els.syncApiKey.value.trim();
    const headers = {
      "Content-Type": "application/json",
      ...key ? { "X-Sync-API-Key": key } : {}
    };
    els.pushLocalBtn.disabled = true;
    els.pushLocalBtn.textContent = "\u50B3\u9001\u4E2D\u2026";
    try {
      const stored = await chrome.storage.local.get([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]);
      const pending = stored[PENDING_BUNDLE_KEY];
      const jsonRecord = stored[PENDING_BUNDLE_JSON_KEY];
      if (!pending || !jsonRecord?.json)
        throw new Error("no local bundle");
      const r = await fetch(`${url}/fhir/import`, {
        method: "POST",
        headers,
        body: jsonRecord.json
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`HTTP ${r.status}: ${text.slice(0, 120)}`);
      }
      const result = await r.json();
      setStatus(`\u2705 \u5DF2\u4E0A\u50B3 ${result.imported ?? "?"} \u7B46\u5230\u5F8C\u7AEF`, "success");
      await checkBackendPatient();
    } catch (e) {
      setStatus(`\u26D4 \u4E0A\u50B3\u5931\u6557\uFF1A${e.message}`, "error");
    } finally {
      _renderDataState();
    }
  }

  // src/popup/patient-form.ts
  var _storedIdNo = null;
  var _maskNameEnabled = false;
  async function loadPatientOverride() {
    const { patientOverride } = await chrome.storage.local.get("patientOverride");
    _storedIdNo = patientOverride?.id_no || null;
    if (patientOverride) {
      els.ovName.value = patientOverride.name || "";
      els.ovBirthDate.value = patientOverride.birth_date || "";
      els.ovGender.value = patientOverride.gender || "";
    }
    _markStep2Confirmed(!!(patientOverride?.gender && patientOverride?.birth_date));
    refreshOverrideSummary();
  }
  function getPatientOverride() {
    const name = els.ovName.value.trim();
    const birth_date = els.ovBirthDate.value.trim();
    const gender = els.ovGender.value;
    if (!_storedIdNo && !name && !birth_date && !gender)
      return null;
    const out = {};
    if (_storedIdNo)
      out.id_no = _storedIdNo;
    if (name)
      out.name = name;
    if (birth_date)
      out.birth_date = birth_date;
    if (gender)
      out.gender = gender;
    return out;
  }
  function validateBirthDate() {
    const el = els.ovBirthDate;
    if (!el)
      return null;
    if (el.validity?.badInput) {
      return "\u751F\u65E5\u8ACB\u586B\u5B8C\u6574\u5E74\u6708\u65E5";
    }
    const s = (el.value || "").trim();
    if (!s)
      return "\u8ACB\u586B\u751F\u65E5";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s))
      return "\u751F\u65E5\u8ACB\u586B\u5B8C\u6574\u5E74\u6708\u65E5";
    const [y, m, d] = s.split("-").map(Number);
    const dt = /* @__PURE__ */ new Date(`${s}T00:00:00Z`);
    if (Number.isNaN(dt.getTime()) || dt.getUTCFullYear() !== y || dt.getUTCMonth() + 1 !== m || dt.getUTCDate() !== d) {
      return "\u751F\u65E5\u4E0D\u662F\u6709\u6548\u65E5\u671F";
    }
    const now = /* @__PURE__ */ new Date();
    if (dt.getTime() > now.getTime())
      return "\u751F\u65E5\u4E0D\u80FD\u662F\u672A\u4F86";
    if (y < 1900)
      return "\u751F\u65E5\u5E74\u4EFD\u592A\u65E9\uFF0C\u8ACB\u78BA\u8A8D";
    return null;
  }
  function refreshOverrideSummary() {
    const ov = getPatientOverride();
    const card = els.patientOverrideDetails;
    let summaryText = "";
    if (!ov || !ov.name) {
      els.ovSummary.textContent = "\u672A\u8A2D\u5B9A";
      if (card)
        card.dataset.state = "empty";
    } else {
      const parts = [_maybeMask(ov.name)];
      if (ov.birth_date) {
        const age = _ageFromBirthDate(ov.birth_date);
        if (age != null)
          parts.push(`${age}\u6B72`);
      }
      if (ov.gender) {
        const g = _genderZh(ov.gender);
        if (g)
          parts.push(g);
      }
      const idLabel = _displayId(ov.id_no);
      if (idLabel)
        parts.push(idLabel);
      summaryText = parts.join("  \xB7  ");
      els.ovSummary.textContent = `\u2713 ${summaryText}`;
      if (card)
        card.dataset.state = "filled";
    }
    if (els.activePatient && els.activePatientValue) {
      const showActive = state.step2Confirmed && !!summaryText;
      els.activePatient.hidden = !showActive;
      if (showActive)
        els.activePatientValue.textContent = summaryText;
    }
    _refreshButtonStates();
    _renderDataState();
    refreshPendingBundle();
    _clearStaleSyncStatus(getPatientOverride());
    if (currentMode() === "backend" && state.connState === "ok")
      checkBackendPatient();
  }
  function _clearStaleSyncStatus(ov) {
    if (!state.latestStatus)
      return;
    if (state.latestStatus.running)
      return;
    if (!state.latestStatus.histno)
      return;
    if (ov?.id_no === state.latestStatus.histno)
      return;
    state.latestStatus = null;
    setStatus("", null);
    chrome.storage.local.remove("syncStatus").catch(() => {
    });
  }
  async function savePatientOverride() {
    if (!els.ovGender.value) {
      setStatus("\u26D4 \u8ACB\u9078\u64C7\u6027\u5225", "error");
      els.ovGender.focus();
      return;
    }
    const dobError = validateBirthDate();
    if (dobError) {
      setStatus(`\u26D4 ${dobError}`, "error");
      els.ovBirthDate.focus();
      return;
    }
    if (!els.ovName.value.trim()) {
      setStatus("\u26D4 \u8ACB\u586B\u5BEB\u59D3\u540D", "error");
      els.ovName.focus();
      return;
    }
    const ov = {
      name: els.ovName.value.trim() || null,
      birth_date: els.ovBirthDate.value.trim(),
      gender: els.ovGender.value
    };
    if (!ov.name)
      delete ov.name;
    const prevStored = (await chrome.storage.local.get("patientOverride")).patientOverride;
    const _norm = (v) => v == null ? "" : String(v);
    const patientChanged = !!prevStored && (_norm(prevStored.name) !== _norm(ov.name) || _norm(prevStored.gender) !== _norm(ov.gender) || _norm(prevStored.birth_date) !== _norm(ov.birth_date));
    if (patientChanged) {
      ov.id_no = _generateAutoPatientId();
    } else {
      ov.id_no = prevStored?.id_no || _generateAutoPatientId();
    }
    _storedIdNo = ov.id_no;
    await chrome.storage.local.set({ patientOverride: ov });
    if (patientChanged) {
      await chrome.storage.local.remove([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]).catch(() => {
      });
      await chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {
      });
      state.latestStatus = null;
      setStatus("", null);
      state.backendPatient = { state: "checking", count: 0, lastUpdated: null };
      state.localBundle = { exists: false, count: 0, generatedAt: 0, patientId: null };
    }
    _markStep2Confirmed(true);
    refreshOverrideSummary();
    _refreshButtonStates();
    if (state.wizardInitialized)
      _maybeAutoAdvance();
    const idLabel = _displayId(ov.id_no);
    const tail = idLabel ? ` \xB7 ${idLabel}` : "";
    setStatus(`\u2705 \u75C5\u4EBA\u8EAB\u4EFD\u5DF2\u8A18\u4F4F\uFF1A${_maybeMask(ov.name)}${tail}`, "success");
  }
  async function clearPatientOverride() {
    await chrome.storage.local.remove("patientOverride");
    _storedIdNo = null;
    els.ovName.value = "";
    els.ovBirthDate.value = "";
    els.ovGender.value = "";
    _markStep2Confirmed(false);
    refreshOverrideSummary();
    _refreshButtonStates();
    setStatus("\u5DF2\u6E05\u9664\u75C5\u4EBA\u8CC7\u6599", "info");
  }
  async function loadMaskNameEnabled() {
    const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
    _maskNameEnabled = maskNameEnabled === true;
    if (els.maskNameEnabled)
      els.maskNameEnabled.checked = _maskNameEnabled;
  }
  function _maybeMask(name) {
    return _maskNameEnabled ? maskName(name) : name || "";
  }
  async function onMaskNameToggle() {
    _maskNameEnabled = els.maskNameEnabled.checked;
    await chrome.storage.local.set({ maskNameEnabled: _maskNameEnabled });
    refreshOverrideSummary();
  }

  // src/popup/bundle.ts
  async function refreshPendingBundle() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    console.info(
      "[popup] refreshPendingBundle:",
      pending ? `${((pending.bytes || 0) / 1024 / 1024).toFixed(2)} MB, generatedAt=${pending.generatedAt ? new Date(pending.generatedAt).toLocaleTimeString() : "(none)"}` : "(no pending bundle)"
    );
    if (!pending) {
      els.pendingBundle.hidden = true;
      if (state.wizardInitialized)
        _refreshResultZone();
      return;
    }
    const ov = getPatientOverride();
    if (ov?.id_no && pending.patientId && pending.patientId !== ov.id_no) {
      els.pendingBundle.hidden = true;
      if (state.wizardInitialized)
        _refreshResultZone();
      return;
    }
    els.pendingBundle.hidden = false;
    const ago = pending.generatedAt ? _fmtRelative(pending.generatedAt) : "";
    if (els.bundleFilename) {
      els.bundleFilename.textContent = pending.filename;
      els.bundleFilename.title = pending.filename;
    }
    if (els.bundleSizeage) {
      const parts = [_fmtBytes(pending.bytes || 0)];
      if (ago)
        parts.push(ago);
      els.bundleSizeage.textContent = parts.join(" \xB7 ");
    }
    if (els.downloadBundleBtn) {
      els.downloadBundleBtn.hidden = !pending.hasJson;
      els.downloadBundleBtn.textContent = "\u4E0B\u8F09\u5065\u5EB7\u7D00\u9304\u6A94";
    }
    if (state.wizardInitialized)
      _refreshResultZone();
  }
  async function _transitionStatusToDownloaded(bytes) {
    try {
      const { syncStatus } = await chrome.storage.local.get("syncStatus");
      if (!syncStatus || syncStatus.phase === "downloaded")
        return;
      const total = syncStatus.totalResources ?? 0;
      const sizeStr = bytes ? ` \xB7 ${_fmtBytes(bytes)}` : "";
      const next = {
        ...syncStatus,
        progress: `\u2705 \u5DF2\u4E0B\u8F09\u5065\u5EB7\u7D00\u9304\u6A94\uFF08\u5171 ${total} \u7B46${sizeStr}\uFF09`,
        phase: "downloaded",
        ts: Date.now()
      };
      await chrome.storage.local.set({ syncStatus: next });
    } catch {
    }
  }
  async function downloadPendingBundle() {
    const stored = await chrome.storage.local.get([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]);
    const pending = stored[PENDING_BUNDLE_KEY];
    const jsonRecord = stored[PENDING_BUNDLE_JSON_KEY];
    if (!pending || !jsonRecord?.json)
      return;
    const blob = new Blob([jsonRecord.json], { type: "application/fhir+json" });
    const url = URL.createObjectURL(blob);
    let downloadId = null;
    try {
      downloadId = await chrome.downloads.download({
        url,
        filename: pending.filename,
        saveAs: true
      });
    } catch (e) {
      setTimeout(() => URL.revokeObjectURL(url), 5e3);
      return;
    }
    if (downloadId == null) {
      setTimeout(() => URL.revokeObjectURL(url), 5e3);
      return;
    }
    const _onChange = (delta) => {
      if (delta.id !== downloadId)
        return;
      const final = delta.state?.current;
      if (final === "complete") {
        chrome.storage.local.remove([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]).catch(() => {
        });
        chrome.downloads.onChanged.removeListener(_onChange);
        _transitionStatusToDownloaded(pending.bytes);
      } else if (final === "interrupted") {
        chrome.downloads.onChanged.removeListener(_onChange);
      }
    };
    chrome.downloads.onChanged.addListener(_onChange);
    setTimeout(() => URL.revokeObjectURL(url), 5e3);
  }
  async function clearPendingBundle() {
    await chrome.storage.local.remove([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]);
    await refreshPendingBundle();
    state.latestStatus = null;
    setStatus("", null);
    await chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {
    });
  }

  // src/popup/connection.ts
  async function loadBackendUrl() {
    const { backendUrl, syncApiKey, smartAppLaunchUrl } = await chrome.storage.local.get([
      "backendUrl",
      "syncApiKey",
      "smartAppLaunchUrl"
    ]);
    els.backendUrl.value = backendUrl || DEFAULT_BACKEND;
    els.syncApiKey.value = syncApiKey || "";
    els.smartAppUrl.value = smartAppLaunchUrl || DEFAULT_SMART_APP_LAUNCH;
    els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
  }
  var _CONN_LABELS = {
    unknown: "\u5C1A\u672A\u6AA2\u67E5",
    checking: "\u78BA\u8A8D\u4E2D\u2026",
    ok: () => `\u5DF2\u9023\u7DDA \u2014 ${els.backendUrl.value.trim()}`,
    fail: () => {
      const r = state.connFailReason || {};
      return {
        "no-url": "\u672A\u8A2D\u5B9A Backend URL",
        "no-permission": "\u672A\u6388\u6B0A\u9023\u7DDA",
        network: "\u9023\u4E0D\u4E0A\u5F8C\u7AEF",
        timeout: "\u9023\u7DDA\u903E\u6642",
        http: `HTTP ${r.detail || ""}`.trim(),
        "not-fhir": "\u56DE\u61C9\u4E0D\u662F FHIR"
      }[r.kind] ?? "\u9023\u7DDA\u5931\u6557";
    }
  };
  var _CONN_HELP = {
    "no-url": "\u8ACB\u5230\u300C\u9032\u968E\u8A2D\u5B9A\u300D\u586B\u5165 Backend URL\uFF0C\u4F8B\u5982 <code>http://localhost:8010</code>\u3002",
    "no-permission": "Chrome \u963B\u64CB\u4E86\u8DE8\u4F86\u6E90\u8ACB\u6C42\u3002\u8ACB\u91CD\u65B0\u958B popup\uFF0C\u7576\u6B0A\u9650\u5C0D\u8A71\u6846\u8DF3\u51FA\u6642\u6309\u300C\u5141\u8A31\u300D\u3002",
    network: "\u5F8C\u7AEF\u53EF\u80FD\u9084\u6C92\u555F\u52D5\u3002\u8ACB\u57F7\u884C\uFF1A<br><code>docker compose up -d</code><br>\u78BA\u8A8D backend \u5BB9\u5668\u8DD1\u8D77\u4F86\u518D\u91CD\u8A66\u3002",
    timeout: "5 \u79D2\u5167\u6C92\u6536\u5230\u56DE\u61C9 \u2014 backend \u53EF\u80FD\u9084\u5728\u555F\u52D5\u4E2D\uFF0C\u7B49 30 \u79D2\u518D\u6309\u91CD\u8A66\u3002",
    http: "Backend \u56DE\u61C9\u932F\u8AA4\u72C0\u614B\u78BC\u3002\u6AA2\u67E5 backend \u7684 log\uFF1A<br><code>docker compose logs backend</code>",
    "not-fhir": "\u9019\u500B URL \u56DE\u4E86\u6771\u897F\uFF0C\u4F46\u4E0D\u662F FHIR CapabilityStatement\u3002\u78BA\u8A8D Backend URL \u6307\u5411 NHI-FHIR-Bridge \u7684 /fhir \u6839\u76EE\u9304\u3002"
  };
  function _renderConnBanner() {
    const banner = els.connBanner;
    if (!banner)
      return;
    banner.dataset.state = state.connState;
    if (els.connSection)
      els.connSection.dataset.state = state.connState;
    const label = _CONN_LABELS[state.connState];
    els.connMsg.textContent = typeof label === "function" ? label() : label;
    els.connRetryBtn.hidden = state.connState !== "fail";
    if (state.connState === "fail" && state.connFailReason?.kind) {
      els.connHelp.hidden = false;
      els.connHelp.innerHTML = _CONN_HELP[state.connFailReason.kind] ?? "";
    } else {
      els.connHelp.hidden = true;
      els.connHelp.innerHTML = "";
    }
    const isOk = state.connState === "ok";
    if (els.connSection)
      els.connSection.hidden = isOk;
    if (els.connMini) {
      els.connMini.hidden = !isOk;
      if (isOk)
        els.connMini.title = `\u5DF2\u9023\u7DDA \u2014 ${els.backendUrl.value.trim()}`;
    }
  }
  async function ensureBackendPermission(backendUrl) {
    const pattern = _originPatternFor(backendUrl);
    if (!pattern)
      return { ok: false, reason: `Backend URL \u7121\u6CD5\u89E3\u6790: ${backendUrl}` };
    const already = await chrome.permissions.contains({ origins: [pattern] });
    if (already)
      return { ok: true };
    let granted;
    try {
      granted = await chrome.permissions.request({ origins: [pattern] });
    } catch (e) {
      return { ok: false, reason: `\u6B0A\u9650\u8ACB\u6C42\u5931\u6557: ${e.message}` };
    }
    return granted ? { ok: true } : { ok: false, reason: `\u672A\u6388\u6B0A\u9023\u7DDA\u5230 ${pattern} \u2014 \u53D6\u6D88` };
  }
  async function testBackendConnection() {
    const url = els.backendUrl.value.trim();
    if (!url) {
      state.connState = "fail";
      state.connFailReason = { kind: "no-url" };
      _renderConnBanner();
      _refreshButtonStates();
      return false;
    }
    state.connState = "checking";
    state.connFailReason = null;
    _renderConnBanner();
    _refreshButtonStates();
    const perm = await ensureBackendPermission(url);
    if (!perm.ok) {
      state.connState = "fail";
      state.connFailReason = { kind: "no-permission" };
      _renderConnBanner();
      _refreshButtonStates();
      return false;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5e3);
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/fhir/metadata`, { signal: ctrl.signal });
      if (!res.ok) {
        state.connState = "fail";
        state.connFailReason = { kind: "http", detail: res.status };
      } else {
        const body = await res.json().catch(() => null);
        if (body?.resourceType !== "CapabilityStatement") {
          state.connState = "fail";
          state.connFailReason = { kind: "not-fhir" };
        } else {
          state.connState = "ok";
          state.connFailReason = null;
        }
      }
    } catch (e) {
      state.connState = "fail";
      state.connFailReason = { kind: e.name === "AbortError" ? "timeout" : "network" };
    } finally {
      clearTimeout(timer);
    }
    _renderConnBanner();
    _refreshButtonStates();
    if (currentMode() === "backend")
      checkBackendPatient();
    return state.connState === "ok";
  }
  async function loadBackendModeEnabled() {
    const { backendModeEnabled } = await chrome.storage.local.get("backendModeEnabled");
    const enabled = backendModeEnabled === true;
    els.backendModeEnabled.checked = enabled;
    document.body.dataset.backendEnabled = enabled ? "true" : "false";
  }
  async function onBackendModeToggle() {
    const enabled = els.backendModeEnabled.checked;
    document.body.dataset.backendEnabled = enabled ? "true" : "false";
    await chrome.storage.local.set({ backendModeEnabled: enabled });
    if (enabled) {
      for (const r of els.modeRadios())
        r.checked = r.value === "backend";
      document.body.dataset.mode = "backend";
      await chrome.storage.local.set({ syncMode: "backend" });
      testBackendConnection();
    } else {
      for (const r of els.modeRadios())
        r.checked = r.value === "local";
      document.body.dataset.mode = "local";
      await chrome.storage.local.set({ syncMode: "local" });
      state.connState = "unknown";
      state.connFailReason = null;
      state.backendPatient = { state: "unknown", count: 0, lastUpdated: null };
      _renderConnBanner();
      _renderDataState();
      _refreshButtonStates();
    }
  }
  async function loadSyncMode() {
    const { syncMode } = await chrome.storage.local.get("syncMode");
    const backendEnabled = document.body.dataset.backendEnabled === "true";
    const mode = backendEnabled && syncMode === "backend" ? "backend" : DEFAULT_MODE;
    for (const r of els.modeRadios())
      r.checked = r.value === mode;
    document.body.dataset.mode = mode;
    if (mode === "backend") {
      await testBackendConnection();
    } else {
      state.connState = "unknown";
      state.connFailReason = null;
      _renderConnBanner();
    }
  }
  function onModeChange() {
    const mode = currentMode();
    document.body.dataset.mode = mode;
    chrome.storage.local.set({ syncMode: mode });
    if (mode === "backend") {
      testBackendConnection();
    } else {
      state.connState = "unknown";
      state.connFailReason = null;
      state.backendPatient = { state: "unknown", count: 0, lastUpdated: null };
      _renderConnBanner();
      _renderDataState();
      _refreshButtonStates();
    }
  }
  function onBackendUrlChange() {
    chrome.storage.local.set({ backendUrl: els.backendUrl.value.trim() });
    els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
    if (currentMode() === "backend")
      testBackendConnection();
  }

  // src/popup/sync-client.ts
  async function isOnNhiLoginPage(tabId, url) {
    if (url?.pathname && /IHKE3099/.test(url.pathname))
      return true;
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          if (document.querySelector('input[type="password"]'))
            return true;
          const text = (document.body?.innerText || "").trim();
          const phrases = [
            "\u8ACB\u4F7F\u7528\u5065\u4FDD\u5361",
            "\u8ACB\u63D2\u5165\u5065\u4FDD\u5361",
            "\u8ACB\u63D2\u5165\u60A8\u7684\u5065\u4FDD\u5361",
            "\u767B\u5165\u5065\u5EB7\u5B58\u647A",
            "\u767B\u5165\u5931\u6557",
            "\u8ACB\u91CD\u65B0\u767B\u5165",
            "Session \u5DF2\u903E\u6642",
            "session \u5DF2\u903E\u6642",
            "\u5DF2\u903E\u6642",
            "\u8ACB\u4EE5\u5065\u4FDD\u5361\u767B\u5165"
          ];
          return phrases.some((p) => text.includes(p));
        }
      });
      return !!result;
    } catch {
      return false;
    }
  }
  async function apiSyncNhi() {
    const ov = getPatientOverride();
    if (!ov) {
      setStatus("\u26D4 \u8ACB\u56DE\u5230\u300C\u2461 \u60A8\u7684\u8CC7\u6599\u300D\uFF0C\u586B\u597D\u6027\u5225\u3001\u751F\u65E5\u5F8C\u6309\u300C\u5132\u5B58\u300D", "error");
      return;
    }
    const tab = await getActiveTab();
    let url;
    try {
      url = new URL(tab.url);
    } catch {
      setStatus("active tab has no URL", "error");
      return;
    }
    const onLogin = await isOnNhiLoginPage(tab.id, url);
    if (onLogin) {
      setStatus("\u{1F512} \u9084\u6C92\u767B\u5165\u5065\u4FDD\u5B58\u647A \u2014 \u8ACB\u56DE\u5230\u300C\u2460 \u767B\u5165\u300D", "error");
      return;
    }
    if (currentMode() === "backend") {
      const ok = await testBackendConnection();
      if (!ok) {
        setStatus("\u26D4 \u9023\u4E0D\u4E0A\u672C\u6A5F\u4F3A\u670D\u5668 \u2014 \u8ACB\u770B\u4E0A\u65B9\u63D0\u793A\u8AAA\u660E", "error");
        return;
      }
    }
    els.syncApiBtn.disabled = true;
    await chrome.storage.local.set({
      syncStatus: {
        running: true,
        progress: "\u958B\u59CB\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026",
        phase: "starting",
        started: Date.now(),
        ts: Date.now()
      }
    });
    setStatus("\u958B\u59CB\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026", "info");
    const rangeSel = els.apiSyncRange?.value || "3";
    let dateRange = null;
    const dateRangeLabel = RANGE_LABELS[rangeSel] || `\u6700\u8FD1 ${rangeSel} \u5E74`;
    if (rangeSel !== "1") {
      const today = /* @__PURE__ */ new Date();
      const end = today.toISOString().slice(0, 10);
      let start;
      if (rangeSel === "all") {
        start = "2001-01-01";
      } else {
        const years = Number.parseInt(rangeSel, 10);
        const s = new Date(today);
        s.setFullYear(s.getFullYear() - years);
        start = s.toISOString().slice(0, 10);
      }
      dateRange = { start, end };
    }
    chrome.runtime.sendMessage({
      type: "startNhiApiSync",
      payload: {
        tabId: tab.id,
        mode: currentMode(),
        backend: els.backendUrl.value.trim(),
        syncApiKey: els.syncApiKey.value.trim(),
        nhiBase: "https://myhealthbank.nhi.gov.tw",
        patientOverride: ov,
        dateRange,
        dateRangeLabel,
        fetchImagingEnabled: els.fetchImagingEnabled?.checked === true
      }
    }).catch(() => {
    });
  }
  async function launch() {
    const backend = els.backendUrl.value.trim();
    const ov = getPatientOverride();
    const rawId = ov?.id_no;
    const smartAppLaunch = els.smartAppUrl.value.trim() || DEFAULT_SMART_APP_LAUNCH;
    if (!_isSafeSmartAppUrl(smartAppLaunch)) {
      setStatus("\u26D4 SMART App URL \u4E0D\u5B89\u5168\uFF08\u5FC5\u9808 https:// \u6216\u672C\u6A5F\uFF09\uFF1B\u8ACB\u5230\u9032\u968E\u8A2D\u5B9A\u4FEE\u6B63\u3002", "error");
      return;
    }
    if (!rawId) {
      setStatus("\u9084\u6C92\u6709\u8EAB\u5206\u8CC7\u6599 \u2014 \u8ACB\u5148\u6309\u300C\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u4E00\u6B21", "error");
      return;
    }
    const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
    const patientId = effectiveFhirPatientId(rawId, maskNameEnabled === true);
    const ok = await testBackendConnection();
    if (!ok) {
      setStatus("\u26D4 \u9023\u4E0D\u4E0A\u672C\u6A5F\u4F3A\u670D\u5668 \u2014 \u8ACB\u770B\u4E0A\u65B9\u63D0\u793A\u8AAA\u660E", "error");
      return;
    }
    setStatus("\u6E96\u5099\u958B\u555F\u91AB\u6790\u2026", "info");
    try {
      const res = await fetch(`${backend}/smart/launch-context`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId })
      });
      if (!res.ok)
        throw new Error(`${res.status}: ${await res.text()}`);
      const { launch: launch2 } = await res.json();
      const params = new URLSearchParams({ iss: `${backend}/fhir`, launch: launch2 });
      const sep = smartAppLaunch.includes("?") ? "&" : "?";
      chrome.tabs.create({ url: `${smartAppLaunch}${sep}${params}` });
      window.close();
    } catch (e) {
      setStatus(`\u274C \u958B\u555F\u91AB\u6790\u5931\u6557\uFF1A${e.message}`, "error");
    }
  }
  function onSmartAppUrlChange() {
    const v = els.smartAppUrl.value.trim();
    if (!v) {
      chrome.storage.local.remove("smartAppLaunchUrl");
      els.smartAppUrl.value = DEFAULT_SMART_APP_LAUNCH;
      return;
    }
    if (!_isSafeSmartAppUrl(v)) {
      setStatus("\u26D4 SMART App URL \u5FC5\u9808\u662F https:// \u6216\u672C\u6A5F (http://localhost)\uFF1B\u5DF2\u9084\u539F\u9810\u8A2D\u3002", "error");
      chrome.storage.local.remove("smartAppLaunchUrl");
      els.smartAppUrl.value = DEFAULT_SMART_APP_LAUNCH;
      return;
    }
    chrome.storage.local.set({ smartAppLaunchUrl: v });
  }

  // src/popup/imaging-prep-banner.ts
  var IMAGING_PREP_STATE_KEY = "imagingPrepState";
  function _elapsedText(state2) {
    const ms = Date.now() - state2.startedAt;
    const minutes = Math.max(0, Math.floor(ms / 6e4));
    if (minutes < 1)
      return "\u525B\u958B\u59CB";
    if (minutes === 1)
      return "\u5DF2\u7B49\u5019 1 \u5206\u9418";
    return `\u5DF2\u7B49\u5019 ${minutes} \u5206\u9418`;
  }
  function _render(state2) {
    const banner = els.prepBanner;
    if (!banner)
      return;
    if (!state2) {
      banner.hidden = true;
      return;
    }
    banner.hidden = false;
    const title = els.prepTitle;
    const progress = els.prepProgress;
    const cta = els.prepCtaBtn;
    const IMAGING_PREP_MAX_MS = 30 * 60 * 1e3;
    const overdue = Date.now() - state2.startedAt >= IMAGING_PREP_MAX_MS;
    const status = state2.status === "polling" && overdue ? "timeout" : state2.status;
    banner.dataset.state = status;
    if (status === "ready") {
      title.textContent = "\u2705 \u5F71\u50CF\u5DF2\u5099\u9F4A";
      progress.textContent = `\u5065\u4FDD\u7F72\u5DF2\u6E96\u5099\u597D ${state2.initialCount} \u5F35\u5F71\u50CF\uFF0C\u6309\u4E0B\u65B9\u6309\u9215\u53D6\u5F97\u6700\u65B0\u8CC7\u6599\u3002`;
      cta.hidden = false;
    } else if (status === "unavailable") {
      title.textContent = "\u2139\uFE0F \u90E8\u5206\u5F71\u50CF\u5065\u4FDD\u7F72\u7121\u6CD5\u63D0\u4F9B";
      progress.textContent = `\u6709 ${state2.initialCount} \u5F35\u5F71\u50CF\u5065\u4FDD\u7F72\u76EE\u524D\u7121\u6CD5\u5099\u9F4A\uFF08\u5E38\u898B\u65BC\u8F03\u820A\u7684\u6AA2\u67E5\uFF09\uFF0C\u9019\u4E9B\u9805\u76EE\u53EA\u6703\u6709\u6587\u5B57\u5831\u544A\uFF0C\u5176\u9918\u8CC7\u6599\u5DF2\u53EF\u4E0B\u8F09\u3002`;
      cta.hidden = true;
    } else if (status === "timeout") {
      title.textContent = "\u23F1 \u7B49\u5019\u903E\u6642\uFF08\u5DF2\u8D85\u904E 30 \u5206\u9418\uFF09";
      progress.textContent = `\u4ECD\u6709 ${state2.count || state2.initialCount} \u5F35\u5F71\u50CF\u5C1A\u672A\u5099\u9F4A\uFF0C\u5065\u4FDD\u7F72\u53EF\u80FD\u7121\u6CD5\u63D0\u4F9B\u3002\u53EF\u6309\u4E0B\u65B9\u6309\u9215\u518D\u8A66\u4E00\u6B21\uFF0C\u6216\u95DC\u9589\u6B64\u63D0\u793A\uFF08\u6587\u5B57\u5831\u544A\u5DF2\u53EF\u4E0B\u8F09\uFF09\u3002`;
      cta.hidden = false;
    } else if (status === "session-expired") {
      title.textContent = "\u{1F512} \u5065\u4FDD\u5B58\u647A\u767B\u5165\u903E\u6642";
      progress.textContent = "\u8ACB\u5148\u56DE\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801\u91CD\u65B0\u767B\u5165\uFF0C\u518D\u6309\u4E0B\u65B9\u6309\u9215\u5373\u53EF\u7E7C\u7E8C\u53D6\u5F97\u3002";
      cta.hidden = false;
    } else {
      title.textContent = "\u{1F5BC}\uFE0F \u5065\u4FDD\u7F72\u6E96\u5099\u4E2D";
      progress.textContent = `\u5269 ${state2.count} / ${state2.initialCount} \u5F35 \xB7 ${_elapsedText(state2)}`;
      cta.hidden = true;
    }
  }
  async function _loadInitial() {
    try {
      const obj = await chrome.storage.local.get(IMAGING_PREP_STATE_KEY);
      const state2 = obj[IMAGING_PREP_STATE_KEY] || null;
      _render(state2);
    } catch (e) {
      console.warn("[imaging-prep-banner] initial load failed:", e);
    }
  }
  function initImagingPrepBanner() {
    if (!els.prepBanner)
      return;
    _loadInitial();
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local")
        return;
      if (!(IMAGING_PREP_STATE_KEY in changes))
        return;
      const newVal = changes[IMAGING_PREP_STATE_KEY]?.newValue || null;
      _render(newVal);
    });
    els.prepCloseBtn?.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "dismissPrepBanner" }).catch(() => {
        _render(null);
      });
    });
    els.prepCtaBtn?.addEventListener("click", () => {
      apiSyncNhi();
    });
  }

  // src/popup/imaging-toggle.ts
  async function loadFetchImagingEnabled() {
    const { fetchImagingEnabled } = await chrome.storage.local.get("fetchImagingEnabled");
    if (els.fetchImagingEnabled) {
      els.fetchImagingEnabled.checked = fetchImagingEnabled === true;
    }
  }
  async function onFetchImagingToggle() {
    await chrome.storage.local.set({
      fetchImagingEnabled: els.fetchImagingEnabled.checked === true
    });
  }

  // src/popup/tooltip.ts
  var _helpTip = document.createElement("div");
  _helpTip.className = "help-tooltip";
  document.body.appendChild(_helpTip);
  function _showHelpTooltip(icon) {
    _helpTip.textContent = icon.dataset.tip || icon.getAttribute("data-tip") || "";
    _helpTip.classList.add("visible");
    const iconRect = icon.getBoundingClientRect();
    const tipRect = _helpTip.getBoundingClientRect();
    const viewportW = document.documentElement.clientWidth;
    const viewportH = document.documentElement.clientHeight;
    let left = iconRect.left + iconRect.width / 2 - tipRect.width / 2;
    if (left < VIEWPORT_MARGIN)
      left = VIEWPORT_MARGIN;
    if (left + tipRect.width > viewportW - VIEWPORT_MARGIN) {
      left = viewportW - VIEWPORT_MARGIN - tipRect.width;
    }
    let top = iconRect.top - tipRect.height - 6;
    if (top < VIEWPORT_MARGIN)
      top = iconRect.bottom + 6;
    if (top + tipRect.height > viewportH - VIEWPORT_MARGIN) {
      top = Math.max(VIEWPORT_MARGIN, viewportH - VIEWPORT_MARGIN - tipRect.height);
    }
    _helpTip.style.left = `${left}px`;
    _helpTip.style.top = `${top}px`;
  }
  function _hideHelpTooltip() {
    _helpTip.classList.remove("visible");
  }

  // src/popup.ts
  _restoreActiveStepFromCache();
  async function init() {
    document.getElementById("version").textContent = `v${chrome.runtime.getManifest().version}`;
    chrome.runtime.sendMessage({ type: "markSyncSeen" }).catch(() => {
    });
    document.getElementById("login-ok-next")?.addEventListener("click", () => _setActiveStep(2));
    await loadMaskNameEnabled();
    await loadFetchImagingEnabled();
    initImagingPrepBanner();
    await _refreshLocalBundleState();
    await loadBackendModeEnabled();
    await loadBackendUrl();
    await loadSyncMode();
    await loadPatientOverride();
    await refreshPendingBundle();
    const tab = await getActiveTab();
    if (!tab?.url) {
      setStatus("no active tab", "error");
      els.syncApiBtn.dataset.offNhi = "1";
      _refreshButtonStates();
      return;
    }
    const onNhi = isNhiTab(tab.url);
    if (onNhi)
      delete els.syncApiBtn.dataset.offNhi;
    else
      els.syncApiBtn.dataset.offNhi = "1";
    if (els.openNhiSection)
      els.openNhiSection.hidden = onNhi;
    state.nhiTabId = onNhi ? tab.id : null;
    if (onNhi && tab.id) {
      chrome.runtime.sendMessage({ type: "checkNhiLogin", tabId: tab.id }).then((resp) => {
        const loggedIn = resp?.loggedIn === true;
        if (loggedIn)
          delete els.syncApiBtn.dataset.nhiLoggedIn;
        else
          els.syncApiBtn.dataset.nhiLoggedIn = "no";
        if (els.nhiNeedsLoginSection) {
          els.nhiNeedsLoginSection.hidden = loggedIn;
        }
        _refreshButtonStates();
        if (loggedIn && state.wizardInitialized)
          _maybeAutoAdvance();
      }).catch(() => {
        delete els.syncApiBtn.dataset.nhiLoggedIn;
        if (els.nhiNeedsLoginSection)
          els.nhiNeedsLoginSection.hidden = true;
        _refreshButtonStates();
      });
    } else {
      delete els.syncApiBtn.dataset.nhiLoggedIn;
      if (els.nhiNeedsLoginSection)
        els.nhiNeedsLoginSection.hidden = true;
    }
    _refreshButtonStates();
    _initWizard();
    await refreshSyncStatusFromBackground();
  }
  function _openSettingsView() {
    document.body.dataset.view = "settings";
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function _closeSettingsView() {
    delete document.body.dataset.view;
    _refreshWizardUi();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  els.connRetryBtn?.addEventListener("click", testBackendConnection);
  els.pushLocalBtn?.addEventListener("click", pushLocalBundleToBackend);
  els.syncBlockedReason?.addEventListener("click", () => {
    const target = Number(els.syncBlockedReason.dataset.targetStep);
    if (target >= 1 && target <= 3)
      _setActiveStep(target);
  });
  els.openNhiBtn?.addEventListener("click", async () => {
    await chrome.tabs.create({ url: NHI_LANDING });
    window.close();
  });
  els.nhiReloadBtn?.addEventListener("click", async () => {
    if (!state.nhiTabId) {
      await chrome.tabs.create({ url: NHI_LOGIN_URL });
      window.close();
      return;
    }
    try {
      await chrome.tabs.update(state.nhiTabId, { url: NHI_LOGIN_URL, active: true });
    } catch {
    }
    window.close();
  });
  els.backendModeEnabled?.addEventListener("change", onBackendModeToggle);
  for (const r of els.modeRadios()) {
    r.addEventListener("change", onModeChange);
  }
  els.backendUrl.addEventListener("change", onBackendUrlChange);
  els.syncApiKey.addEventListener("change", () => {
    chrome.storage.local.set({ syncApiKey: els.syncApiKey.value.trim() });
  });
  els.maskNameEnabled?.addEventListener("change", onMaskNameToggle);
  els.fetchImagingEnabled?.addEventListener("change", onFetchImagingToggle);
  els.smartAppUrl.addEventListener("change", onSmartAppUrlChange);
  els.downloadBundleBtn.addEventListener("click", downloadPendingBundle);
  els.clearBundleBtn.addEventListener("click", clearPendingBundle);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes)
      _refreshLocalBundleState();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes)
      refreshPendingBundle();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.patientOverride)
      loadPatientOverride();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.syncStatus) {
      applySyncStatus(changes.syncStatus.newValue);
    }
  });
  chrome.runtime.onMessage.addListener((msg, sender) => {
    if (sender?.id !== chrome.runtime.id)
      return;
    if (msg?.type === "syncProgress") {
      applySyncStatus(msg.status);
    }
  });
  document.addEventListener("mouseover", (e) => {
    const icon = e.target.closest?.(".help-icon");
    if (icon)
      _showHelpTooltip(icon);
  });
  document.addEventListener("mouseout", (e) => {
    const icon = e.target.closest?.(".help-icon");
    if (icon)
      _hideHelpTooltip();
  });
  els.syncApiBtn.addEventListener("click", apiSyncNhi);
  els.stopBtn.addEventListener("click", stopSync);
  els.ovSaveBtn.addEventListener("click", savePatientOverride);
  els.ovClearBtn.addEventListener("click", clearPatientOverride);
  [els.ovName, els.ovBirthDate, els.ovGender].forEach(
    (el) => el.addEventListener("input", refreshOverrideSummary)
  );
  els.launchBtn.addEventListener("click", launch);
  els.openSmartAppBtn?.addEventListener("click", () => {
    chrome.tabs.create({ url: STANDALONE_SMART_APP_URL });
  });
  els.openSettingsBtn?.addEventListener("click", _openSettingsView);
  els.settingsBackBtn?.addEventListener("click", _closeSettingsView);
  els.activePatient?.addEventListener("click", () => _setActiveStep(2));
  els.activePatient?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      _setActiveStep(2);
    }
  });
  init();
})();
/*! Bundled license information:

js-sha1/src/sha1.js:
  (*
   * [js-sha1]{@link https://github.com/emn178/js-sha1}
   *
   * @version 0.7.0
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2024
   * @license MIT
   *)
*/
