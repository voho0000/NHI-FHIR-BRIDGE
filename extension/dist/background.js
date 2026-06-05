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
          var crypto = require_crypto();
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
              return crypto.createHash("sha1").update(message, "utf8").digest("hex");
            } else {
              if (message === null || message === void 0) {
                throw new Error(INPUT_ERROR);
              } else if (message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
              }
            }
            if (isArray(message) || isView(message) || message.constructor === Buffer2) {
              return crypto.createHash("sha1").update(bufferFrom(message)).digest("hex");
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

  // src/background/constants.ts
  var STORAGE_KEY = "syncStatus";
  var NHI_HOST = "myhealthbank.nhi.gov.tw";
  var CANCEL_ERROR = "__SYNC_CANCELLED__";
  var SESSION_EXPIRED_ERROR = "__SESSION_EXPIRED__";
  var PENDING_BUNDLE_KEY = "pendingFhirBundle";
  var PENDING_BUNDLE_JSON_KEY = "pendingFhirBundleJson";
  var PENDING_BUNDLE_TTL_MS = 60 * 60 * 1e3;
  var PENDING_BUNDLE_SWEEP_ALARM = "pending-bundle-sweep";
  var PENDING_IMAGING_KEY_PREFIX = "nhiImagingPending:";
  var PENDING_IMAGING_TTL_MS = 8 * 24 * 60 * 60 * 1e3;
  var NHI_BEARER_TOKEN_KEY = "nhiBearerToken";
  var NHI_BEARER_TOKEN_TTL_MS = 30 * 60 * 1e3;
  var IMAGING_PREP_POLL_ALARM = "imaging-prep-poll";
  var IMAGING_PREP_STATE_KEY = "imagingPrepState";
  var IMAGING_PREP_BASE_KEY = "imagingPrepBase";
  var IMAGING_PREP_MAX_MS = 30 * 60 * 1e3;
  var IMAGING_PREP_POLL_INTERVAL_MIN = 1;
  var DEBUG_STASH_BODY_SAMPLES = false;
  var LOCAL_PAGE_TYPE_ORDER = [
    "encounters",
    "observations",
    "medications",
    "conditions",
    "allergies",
    "diagnostic_reports",
    "procedures",
    "immunizations",
    "care_plans",
    // 出院病摘 — emitted after the inpatient detail fan-out in the
    // orchestrator. Sits at the end so encounters/observations linking
    // has settled before DocumentReference's context.encounter is
    // dereferenced by validators.
    "document_references"
  ];
  var SYNC_KEYS_TO_MIGRATE = [
    "backendUrl",
    "syncApiKey",
    "smartAppLaunchUrl",
    "patientOverride",
    "syncMode",
    "maskNameEnabled"
  ];

  // src/background/auth.ts
  async function checkNhiLoginState(tabId) {
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: async () => {
          const t = sessionStorage.getItem("token");
          if (!t)
            return false;
          try {
            const r = await fetch("/api/ihke3000/ihke3410s01/page_load", {
              credentials: "same-origin",
              headers: { Accept: "application/json", Authorization: `Bearer ${t}` }
            });
            return r.ok;
          } catch {
            return false;
          }
        }
      });
      return typeof result === "boolean" ? result : null;
    } catch {
      return null;
    }
  }
  async function maybeFetchPatientIdFromNhi(tabId, patientOverride) {
    const current = patientOverride.id_no || "";
    let resolved = patientOverride;
    let cid = null;
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: async () => {
          const t = sessionStorage.getItem("token");
          if (!t)
            return null;
          try {
            const r = await fetch("/api/ihke3000/ihke3410s01/page_load", {
              credentials: "same-origin",
              headers: { Accept: "application/json", Authorization: `Bearer ${t}` }
            });
            if (!r.ok)
              return null;
            const body = await r.json();
            return body?.cid || null;
          } catch {
            return null;
          }
        }
      });
      if (result && /^[A-Z][12]\d{8}$/.test(result))
        cid = result;
    } catch (e) {
      console.warn("[NHI sync] IHKE3410 cid fetch failed:", e?.message ?? e);
    }
    if (cid && cid !== current) {
      resolved = { ...patientOverride, id_no: cid };
      await chrome.storage.local.set({ patientOverride: resolved }).catch(() => {
      });
      const switchedRealPatients = current && !current.startsWith("auto-") && current !== cid;
      if (switchedRealPatients) {
        await chrome.storage.local.remove([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]).catch(() => {
        });
      }
    }
    return resolved;
  }

  // ../packages/mapper/src/systems.ts
  var NHI_MEDICAL_ORDER_CODE = "https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code";
  var NHI_DRUG_CODE = "https://twcore.mohw.gov.tw/CodeSystem/nhi-drug-code";
  var TW_NATIONAL_ID = "https://twcore.mohw.gov.tw/IdentifierSystem/national-id";
  var HIS_LOCAL_LAB_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-lab";
  var HIS_LOCAL_MEDICATION_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-medication";
  var HIS_LOCAL_REPORT_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-report";
  var HIS_LOCAL_CONDITION_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-condition";
  var HIS_LOCAL_PROCEDURE_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-procedure";
  var HIS_LOCAL_ALLERGEN_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-allergen";
  var HIS_LOCAL_PATIENT_MRN = "https://nhi-fhir-bridge.local/IdentifierSystem/his-mrn";
  var ENCOUNTER_KIND_SYSTEM = "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind";
  var ENCOUNTER_CHANNEL_SYSTEM = "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel";
  var NHI_CARE_PLAN_PROGRAM = "https://nhi-fhir-bridge.github.io/CodeSystem/nhi-care-plan-program";
  var LOINC = "http://loinc.org";
  var SNOMED_CT = "http://snomed.info/sct";
  var ICD_10_CM = "http://hl7.org/fhir/sid/icd-10-cm";
  var ICD_10_PCS = "http://hl7.org/fhir/sid/icd-10-pcs";

  // ../packages/mapper/src/helpers.ts
  var import_js_sha1 = __toESM(require_sha1(), 1);
  function stableId(patientId, ...parts) {
    return (0, import_js_sha1.sha1)([patientId, ...parts].join("|")).slice(0, 32);
  }
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

  // ../packages/mapper/src/allergy.ts
  var ALLOWED_CATEGORIES = /* @__PURE__ */ new Set(["medication", "food", "environment", "biologic"]);
  var ALLOWED_CRITICALITY = /* @__PURE__ */ new Set(["high", "low", "unable-to-assess"]);
  function mapSystem(systemHint) {
    const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
    if (s.includes("snomed"))
      return SNOMED_CT;
    if (s.includes("rxnorm"))
      return "http://www.nlm.nih.gov/research/umls/rxnorm";
    return HIS_LOCAL_ALLERGEN_CODE;
  }
  function mapAllergyIntolerance(raw, patientId) {
    const display = raw.display ?? "Unknown Allergen";
    const code = raw.code;
    const system = mapSystem(raw.system ?? "");
    const resource = {
      resourceType: "AllergyIntolerance",
      id: stableId(patientId, code || display, raw.recorded_date ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      patient: { reference: `Patient/${patientId}` },
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
            code: "active"
          }
        ]
      },
      verificationStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
            code: "confirmed"
          }
        ]
      },
      code: {
        coding: [{ system, code: code || display, display }],
        text: display
      }
    };
    const category = raw.category ?? "";
    if (ALLOWED_CATEGORIES.has(category)) {
      resource.category = [category];
    }
    const criticality = raw.criticality ?? "";
    if (ALLOWED_CRITICALITY.has(criticality)) {
      resource.criticality = criticality;
    }
    if (raw.recorded_date) {
      resource.recordedDate = `${raw.recorded_date}T00:00:00+08:00`;
    }
    const reactionNote = raw.reaction ?? "";
    if (reactionNote) {
      resource.reaction = [{ description: reactionNote }];
    }
    return resource;
  }

  // ../packages/mapper/src/careplan.ts
  function mapCarePlan(raw, patientId) {
    const title = (raw.title ?? "").trim();
    if (!title)
      return null;
    const status = raw.status === "completed" ? "completed" : "active";
    const start = (raw.period_start ?? "").trim();
    const end = (raw.period_end ?? "").trim();
    const resource = {
      resourceType: "CarePlan",
      // Stable id keys on patient + title + start. Re-enrolment in the same
      // programme on a different 收案日 is a distinct CarePlan; a re-sync of
      // the same enrolment collapses to one resource (deterministic hash).
      id: stableId(patientId, title, start),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      // CarePlan.status (1..1, request-status ValueSet) + intent (1..1) are
      // both required by FHIR R4.
      status,
      intent: "plan",
      title,
      subject: { reference: `Patient/${patientId}` }
    };
    const description = (raw.description ?? "").trim();
    if (description) {
      resource.description = description;
    }
    if (start || end) {
      const period = {};
      if (start)
        period.start = `${start}T00:00:00+08:00`;
      if (end)
        period.end = `${end}T00:00:00+08:00`;
      resource.period = period;
    }
    const category = { text: "NHI \u7167\u8B77\u8A08\u756B" };
    const programCode = (raw.program_code ?? "").trim();
    if (programCode) {
      category.coding = [{ system: NHI_CARE_PLAN_PROGRAM, code: programCode }];
    }
    resource.category = [category];
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.author = { display: hospital };
    }
    return resource;
  }

  // ../packages/mapper/src/condition.ts
  var ICD10_CATEGORY_RE = /^[A-Z][0-9A-Z]{2}$/;
  function normalizeIcd10Cm(code) {
    if (!code || code.includes("."))
      return code ?? "";
    const s = code.trim().toUpperCase();
    if (s.length <= 3)
      return s;
    const head = s.slice(0, 3);
    const tail = s.slice(3);
    if (ICD10_CATEGORY_RE.test(head)) {
      return `${head}.${tail}`;
    }
    return s;
  }
  function mapSystem2(systemHint) {
    const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
    if (s.includes("snomed"))
      return SNOMED_CT;
    if (s.includes("icd-10") || s.includes("icd10")) {
      return ICD_10_CM;
    }
    return HIS_LOCAL_CONDITION_CODE;
  }
  function mapCondition(raw, patientId) {
    const display = raw.display ?? "Unknown Condition";
    let code = raw.code;
    const system = mapSystem2(raw.system ?? "");
    if (system === ICD_10_CM && code) {
      code = normalizeIcd10Cm(code);
    }
    const resource = {
      resourceType: "Condition",
      // Stable id falls back to display when no code is present (catastrophic
      // illness rows from IHKE3209 carry the Chinese narrative only). Mirrors
      // the same `code || display` pattern in diagnostic-report.ts and
      // allergy.ts — avoids hash collisions between two same-day code-less
      // conditions.
      id: stableId(patientId, code || display, raw.onset_date ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      subject: { reference: `Patient/${patientId}` },
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: raw.clinical_status ?? "active"
          }
        ]
      },
      verificationStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
            code: "confirmed"
          }
        ]
      }
    };
    if (raw.category) {
      resource.category = [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/condition-category",
              code: raw.category
            }
          ]
        }
      ];
    }
    resource.code = {
      coding: [{ system, code: code || display, display }],
      text: display
    };
    const severity = raw.severity ?? "";
    if (severity) {
      resource.severity = { text: severity };
    }
    if (raw.onset_date) {
      resource.onsetDateTime = `${raw.onset_date}T00:00:00+08:00`;
    }
    if (raw.recorded_date) {
      resource.recordedDate = `${raw.recorded_date}T00:00:00+08:00`;
    }
    return resource;
  }

  // ../packages/mapper/src/diagnostic-report.ts
  var V2_0074 = "http://terminology.hl7.org/CodeSystem/v2-0074";
  var CATEGORY_MAP = {
    LAB: [V2_0074, "LAB", "Laboratory"],
    RAD: [V2_0074, "RAD", "Radiology"],
    CAR: [V2_0074, "CAR", "Cardiology"],
    PATH: [V2_0074, "PAT", "Pathology"]
  };
  var LAB_UNIT_RE = /\d+(?:\.\d+)?\s*(?:%|mg\/dL|g\/dL|mmol\/L|U\/L|IU\/L|mIU\/L|ng\/mL|μg\/dL|ug\/dL|pg\/mL|fL|\/uL|10\^?\d+\/uL|x10\^?\d+\/uL|sec|秒|copies\/mL)/;
  function looksLikeLabValueOnly(conclusion) {
    if (!conclusion)
      return true;
    const text = conclusion.trim();
    if (text.length > 100)
      return false;
    if (LAB_UNIT_RE.test(text))
      return true;
    return false;
  }
  function mapDiagnosticReport(raw, patientId) {
    const conclusion = (raw.conclusion ?? "").trim();
    const rawJpgs = Array.isArray(raw.jpgBase64s) ? raw.jpgBase64s.filter((s) => typeof s === "string" && s.length > 0) : typeof raw.jpgBase64 === "string" && raw.jpgBase64.length > 0 ? [raw.jpgBase64] : [];
    if (!conclusion && rawJpgs.length === 0)
      return null;
    const catKeyRaw = String(raw.category ?? "").toUpperCase();
    if (catKeyRaw === "LAB" && conclusion && looksLikeLabValueOnly(conclusion)) {
      return null;
    }
    const display = raw.display ?? "Unknown Report";
    const code = raw.code;
    const systemHint = raw.system ?? "";
    const system = typeof systemHint === "string" && systemHint.toUpperCase() === "LOINC" ? LOINC : HIS_LOCAL_REPORT_CODE;
    const idDiscriminator = raw.iplCaseSeqNo ? `${code || display}|${raw.iplCaseSeqNo}` : code || display;
    const resource = {
      resourceType: "DiagnosticReport",
      id: stableId(patientId, idDiscriminator, raw.date ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: raw.status ?? "final",
      subject: { reference: `Patient/${patientId}` },
      code: {
        coding: [{ system, code: code || display, display }],
        text: display
      }
    };
    if (conclusion)
      resource.conclusion = conclusion;
    const catEntry = CATEGORY_MAP[catKeyRaw];
    if (catEntry) {
      const [catSys, catCode, catDisplay] = catEntry;
      resource.category = [{ coding: [{ system: catSys, code: catCode, display: catDisplay }] }];
    }
    if (raw.date) {
      resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
    }
    if (raw.issued) {
      resource.issued = `${raw.issued}T00:00:00+08:00`;
    } else if (raw.date) {
      resource.issued = `${raw.date}T00:00:00+08:00`;
    }
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.performer = [{ display: hospital }];
    }
    if (raw.rid && raw.ctype) {
      resource.meta.tag = [
        {
          system: "http://nhi-fhir-bridge/nhi-imaging-row",
          code: `${raw.rid}|${raw.ctype}`
        }
      ];
    }
    if (rawJpgs.length > 0) {
      resource.presentedForm = rawJpgs.map((b64, i) => {
        const size = Math.floor(b64.length * 3 / 4);
        const title = rawJpgs.length > 1 ? `${display} (frame ${i + 1}/${rawJpgs.length})` : display;
        return {
          contentType: "image/jpeg",
          data: b64,
          size,
          title
        };
      });
    }
    return resource;
  }

  // ../packages/mapper/src/document-reference.ts
  var import_js_sha12 = __toESM(require_sha1(), 1);
  var LOINC2 = "http://loinc.org";
  var LOINC_DISCHARGE_SUMMARY = "18842-5";
  var LOINC_DISCHARGE_SUMMARY_DISPLAY = "Discharge summary";
  var DOC_CATEGORY_SYSTEM = "http://hl7.org/fhir/us/core/CodeSystem/us-core-documentreference-category";
  function getNodeBuffer() {
    const g = globalThis;
    if (g && g.Buffer && typeof g.Buffer.from === "function")
      return g.Buffer;
    return null;
  }
  function utf8ToBase64(s) {
    const NodeBuffer = getNodeBuffer();
    if (NodeBuffer) {
      return NodeBuffer.from(s, "utf8").toString("base64");
    }
    return btoa(unescape(encodeURIComponent(s)));
  }
  function sha1OfHtml(html) {
    return (0, import_js_sha12.sha1)(html);
  }
  function extractRecordDateIso(html) {
    const m = html.match(/記錄日期時間[：:][^0-9]*(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (!m)
      return null;
    const yyyy = m[1];
    const mm = String(m[2]).padStart(2, "0");
    const dd = String(m[3]).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  function buildAttachment(html, title) {
    const data = utf8ToBase64(html);
    return {
      contentType: "text/html",
      language: "zh-TW",
      data,
      title,
      // FHIR R4 Attachment.size: "Number of bytes of content (if url
      // provided)" — the binary length, NOT the base64-string length.
      // For UTF-8 HTML this is the encoded byte count.
      size: (() => {
        const NodeBuffer = getNodeBuffer();
        return NodeBuffer ? NodeBuffer.byteLength(html, "utf8") : new Blob([html]).size;
      })(),
      hash: sha1OfHtml(html)
    };
  }
  function mapDischargeSummaryDocRef(raw, patientId) {
    const html = String(raw?.html ?? "");
    if (!html || html.length < 10)
      return null;
    const admissionDate = String(raw?.admission_date ?? "");
    const dischargeDate = String(raw?.discharge_date ?? "");
    if (!admissionDate)
      return null;
    const hospital = String(raw?.hospital ?? "").trim();
    const rowId2 = String(raw?.row_id ?? "").trim();
    const recordDate = String(raw?.record_date ?? "").trim() || extractRecordDateIso(html) || dischargeDate || admissionDate;
    const encounterId = stableId(patientId, admissionDate, "IMP", hospital);
    const id = stableId(
      patientId,
      "discharge-summary",
      rowId2 || `${hospital}|${admissionDate}|${dischargeDate}`
    );
    const periodLabel = admissionDate && dischargeDate ? `${admissionDate}~${dischargeDate}` : admissionDate;
    const title = hospital ? `\u51FA\u9662\u75C5\u6458 \u2014 ${hospital} ${periodLabel}` : `\u51FA\u9662\u75C5\u6458 ${periodLabel}`;
    const resource = {
      resourceType: "DocumentReference",
      id,
      meta: {
        versionId: "1",
        source: "nhi-fhir-bridge/scraper",
        // bridge-namespaced tag mirrors v0.12.3 nhi-source-channel and
        // v0.15 nhi-imaging-row patterns. Informational; FHIR R4 spec
        // says applications not aware of the tag system MUST ignore it.
        tag: [
          {
            system: "http://nhi-fhir-bridge/nhi-source",
            code: "ihke3309-getxml"
          }
        ]
      },
      status: "current",
      type: {
        coding: [
          {
            system: LOINC2,
            code: LOINC_DISCHARGE_SUMMARY,
            display: LOINC_DISCHARGE_SUMMARY_DISPLAY
          }
        ],
        text: "\u51FA\u9662\u75C5\u6458"
      },
      category: [
        {
          coding: [
            {
              system: DOC_CATEGORY_SYSTEM,
              code: "clinical-note",
              display: "Clinical Note"
            }
          ]
        }
      ],
      subject: { reference: `Patient/${patientId}` },
      date: `${recordDate}T00:00:00+08:00`,
      content: [
        {
          attachment: buildAttachment(html, title)
        }
      ],
      context: {
        encounter: [{ reference: `Encounter/${encounterId}` }],
        period: {
          start: `${admissionDate}T00:00:00+08:00`,
          ...dischargeDate ? { end: `${dischargeDate}T23:59:59+08:00` } : {}
        }
      }
    };
    if (hospital) {
      resource.custodian = { display: hospital };
    }
    if (rowId2) {
      resource.identifier = [
        { system: "http://nhi-fhir-bridge/nhi-inpatient-row", value: rowId2 }
      ];
    }
    return resource;
  }

  // ../packages/mapper/src/encounter.ts
  var KIND_CODE_MAP = {
    \u9580\u8A3A: "outpatient",
    \u6025\u8A3A: "emergency",
    \u4F4F\u9662: "inpatient",
    \u85E5\u5C40: "pharmacy"
  };
  var CHANNEL_CODE_MAP = {
    \u7533\u5831\u8CC7\u6599: "claims",
    IC\u5361\u8CC7\u6599: "ic-card"
  };
  function buildTypeEntry(text, system, codeMap) {
    const coding = { system, display: text };
    const code = codeMap[text];
    if (code)
      coding.code = code;
    return { text, coding: [coding] };
  }
  var ACTCODE_SYSTEM = "http://terminology.hl7.org/CodeSystem/v3-ActCode";
  var CLASS_MAP = {
    AMB: [ACTCODE_SYSTEM, "AMB", "ambulatory"],
    IMP: [ACTCODE_SYSTEM, "IMP", "inpatient encounter"],
    EMER: [ACTCODE_SYSTEM, "EMER", "emergency"]
  };
  function mapEncounter(raw, patientId) {
    const encClass = String(raw.class ?? "AMB").toUpperCase();
    const classEntry = CLASS_MAP[encClass] ?? CLASS_MAP.AMB;
    const resource = {
      resourceType: "Encounter",
      id: stableId(patientId, raw.date ?? "", encClass, (raw.hospital ?? "").trim()),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "finished",
      class: {
        system: classEntry[0],
        code: classEntry[1],
        display: classEntry[2]
      },
      subject: { reference: `Patient/${patientId}` }
    };
    const kind = (raw.kind ?? "").trim();
    const channel = (raw.channel ?? "").trim();
    const types = [];
    if (kind)
      types.push(buildTypeEntry(kind, ENCOUNTER_KIND_SYSTEM, KIND_CODE_MAP));
    if (channel) {
      types.push(buildTypeEntry(channel, ENCOUNTER_CHANNEL_SYSTEM, CHANNEL_CODE_MAP));
    }
    if (types.length === 0) {
      const typeDisplay = (raw.type_display ?? "").trim();
      if (typeDisplay)
        types.push({ text: typeDisplay });
    }
    if (types.length > 0) {
      resource.type = types;
    }
    const period = {};
    if (raw.date)
      period.start = `${raw.date}T00:00:00+08:00`;
    if (raw.end_date)
      period.end = `${raw.end_date}T00:00:00+08:00`;
    if (Object.keys(period).length > 0) {
      resource.period = period;
    }
    const department = raw.department ?? "";
    const provider = raw.provider ?? "";
    if (department || provider) {
      const participant = {};
      if (provider)
        participant.individual = { display: provider };
      resource.participant = Object.keys(participant).length > 0 ? [participant] : [];
      if (department) {
        resource.serviceType = { text: department };
      }
    }
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.serviceProvider = { display: hospital };
    }
    const reasonCodes = [];
    const reason = (raw.reason ?? "").trim();
    const reasonZh = (raw.reason_zh ?? "").trim();
    const reasonCode = (raw.reason_code ?? "").trim();
    if (reason || reasonZh || reasonCode) {
      const rc = {};
      if (reasonCode) {
        const displayPlain = reason.replace(new RegExp(`^${reasonCode}\\s+`), "").trim();
        rc.coding = [
          {
            system: "http://hl7.org/fhir/sid/icd-10-cm",
            code: reasonCode,
            display: displayPlain || reason || reasonZh
          }
        ];
      }
      rc.text = reasonZh || reason;
      reasonCodes.push(rc);
    }
    const secondaries = Array.isArray(raw.secondary_diagnoses) ? raw.secondary_diagnoses : [];
    for (const sec of secondaries) {
      const code = (sec?.code ?? "").trim();
      const nameEn = (sec?.name_en ?? "").trim();
      const nameZh = (sec?.name_zh ?? "").trim();
      if (!code && !nameEn && !nameZh)
        continue;
      const entry = {};
      if (code) {
        entry.coding = [
          {
            system: "http://hl7.org/fhir/sid/icd-10-cm",
            code,
            display: nameEn || nameZh
          }
        ];
      }
      entry.text = code ? `${code} ${nameZh || nameEn}`.trim() : nameZh || nameEn;
      reasonCodes.push(entry);
    }
    if (reasonCodes.length > 0) {
      resource.reasonCode = reasonCodes;
    }
    const discharge = raw.discharge_disposition ?? "";
    if (discharge) {
      resource.hospitalization = { dischargeDisposition: { text: discharge } };
    }
    const clinicalNote = (raw.clinical_note ?? "").trim();
    if (clinicalNote) {
      resource.note = [{ text: clinicalNote }];
    }
    return resource;
  }

  // ../packages/mapper/src/immunization.ts
  function mapImmunization(raw, patientId) {
    const vaccineName = (raw.vaccine_name ?? "").trim();
    const date = (raw.date ?? "").trim();
    if (!vaccineName || !date)
      return null;
    const resource = {
      resourceType: "Immunization",
      // Stable id uses date + vaccine name + lot — same vaccine same day
      // with the same lot collapses (NHI rare edge case); different lots
      // would be distinct Immunizations.
      id: stableId(patientId, vaccineName, date, raw.lot_number ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "completed",
      vaccineCode: {
        // No terminology coding — NHI gives Chinese name only. SMART
        // apps render .text for both patient and clinical views (the
        // v0.8.0 bilingual fallback contract: if English absent, text
        // is the only display).
        text: vaccineName
      },
      patient: { reference: `Patient/${patientId}` },
      occurrenceDateTime: `${date}T00:00:00+08:00`
    };
    const lotNumber = (raw.lot_number ?? "").trim();
    if (lotNumber) {
      resource.lotNumber = lotNumber;
    }
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.performer = [{ actor: { display: hospital } }];
    }
    const source = (raw.source ?? "").trim();
    if (source) {
      resource.note = [{ text: `\u4F86\u6E90: ${source}` }];
    }
    return resource;
  }

  // ../packages/mapper/src/medication.ts
  function isCjk(ch) {
    const cp = ch.codePointAt(0) ?? 0;
    return cp >= 19968 && cp <= 40959;
  }
  function cjkChars(s) {
    if (!s)
      return 0;
    let n = 0;
    for (const ch of s)
      if (isCjk(ch))
        n++;
    return n;
  }
  var EN_CHUNK_G = /[A-Z][A-Z0-9.%/\-"'\s]{3,}/g;
  function canonicalDrugKey(name) {
    const s = (name ?? "").toUpperCase();
    const chunks = [...s.matchAll(EN_CHUNK_G)].map((m) => m[0]);
    if (chunks.length === 0) {
      return (name ?? "").trim().toLowerCase();
    }
    let longest = chunks.reduce((a, b) => b.length > a.length ? b : a).trim();
    for (const sep of [" - ", " \u2013 ", " / "]) {
      if (longest.includes(sep)) {
        longest = longest.split(sep)[0];
      }
    }
    return longest.replace(/\s+/g, " ").trim().toLowerCase();
  }
  function medStatus(authoredIso, durationDays) {
    if (!authoredIso)
      return "completed";
    const datePart = String(authoredIso).slice(0, 10);
    const parsed = /* @__PURE__ */ new Date(`${datePart}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()))
      return "completed";
    let days;
    if (durationDays === null || durationDays === void 0 || durationDays === "") {
      days = null;
    } else {
      const n = Number.parseInt(String(durationDays), 10);
      days = Number.isFinite(n) ? n : null;
    }
    if (days === null)
      days = 90;
    const end = new Date(parsed.getTime());
    end.setUTCDate(end.getUTCDate() + days);
    const today = /* @__PURE__ */ new Date();
    today.setUTCHours(0, 0, 0, 0);
    return end >= today ? "active" : "completed";
  }
  function mapMedicationRequest(raw, patientId) {
    const drugName = (raw.drug_name ?? "").trim();
    if (!drugName)
      return null;
    const medId = stableId(patientId, canonicalDrugKey(drugName), raw.date ?? "");
    const drugCode = (raw.code ?? "").trim();
    const coding = {
      system: drugCode ? NHI_DRUG_CODE : HIS_LOCAL_MEDICATION_CODE,
      code: drugCode || drugName,
      display: drugName
    };
    const drugNameZh = (raw.drug_name_zh ?? "").trim() || drugName;
    const resource = {
      resourceType: "MedicationRequest",
      id: medId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: medStatus(raw.date ?? "", raw.duration_days),
      intent: "order",
      medicationCodeableConcept: {
        coding: [coding],
        text: drugNameZh
      },
      subject: { reference: `Patient/${patientId}` }
    };
    if (raw.date) {
      resource.authoredOn = `${raw.date}T00:00:00+08:00`;
    }
    const courseOfTherapy = (raw.course_of_therapy ?? "").trim();
    if (courseOfTherapy === "continuous") {
      resource.courseOfTherapyType = {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
            code: "continuous",
            display: "Continuous long term therapy"
          }
        ],
        text: "Continuous long term therapy"
      };
    }
    const drugClass = (raw.drug_class ?? "").trim();
    const drugClassZh = (raw.drug_class_zh ?? "").trim();
    if (drugClass || drugClassZh) {
      const cat = {};
      if (drugClass)
        cat.coding = [{ display: drugClass }];
      cat.text = drugClassZh || drugClass;
      resource.category = [cat];
    }
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.requester = { display: hospital };
    }
    const dosage = {};
    const parts = [];
    for (const k of ["dose", "unit", "frequency"]) {
      if (raw[k])
        parts.push(String(raw[k]));
    }
    if (parts.length > 0) {
      dosage.text = parts.join(" ");
    } else if (raw.dosage_text) {
      const t = String(raw.dosage_text).trim();
      if (t)
        dosage.text = t;
    } else {
      const qtyRaw2 = raw.quantity;
      const qtyNum = qtyRaw2 !== null && qtyRaw2 !== void 0 && qtyRaw2 !== "" ? Number.parseFloat(String(qtyRaw2).replace(/,/g, "")) : Number.NaN;
      const daysNum = Number.parseInt(String(raw.duration_days ?? 0), 10);
      if (Number.isFinite(qtyNum) && qtyNum > 0 && Number.isFinite(daysNum) && daysNum > 0) {
        const qtyStr = Number.isInteger(qtyNum) ? String(qtyNum) : String(qtyNum);
        const perDay = qtyNum / daysNum;
        const perDayStr = Number.isInteger(perDay) ? String(perDay) : Number.parseFloat(perDay.toFixed(2)).toString();
        dosage.text = `${qtyStr} dose(s) over ${daysNum} day(s) (\u2248 ${perDayStr}/day)`;
      }
    }
    if (raw.route) {
      dosage.route = {
        coding: [{ system: "http://snomed.info/sct", display: raw.route }]
      };
    }
    if (Object.keys(dosage).length > 0) {
      resource.dosageInstruction = [dosage];
    }
    const dr = {};
    const qtyRaw = raw.quantity;
    if (qtyRaw !== null && qtyRaw !== void 0 && qtyRaw !== "") {
      const qtyNum = Number.parseFloat(String(qtyRaw).replace(/,/g, ""));
      if (Number.isFinite(qtyNum)) {
        dr.quantity = { value: qtyNum };
      }
    }
    if (raw.duration_days) {
      const days = Number.parseInt(String(raw.duration_days), 10);
      if (Number.isFinite(days)) {
        dr.expectedSupplyDuration = {
          value: days,
          unit: "days",
          system: "http://unitsofmeasure.org",
          code: "d"
        };
      }
    }
    const endDate = (raw.end_date ?? "").trim();
    if (raw.date && endDate && endDate !== raw.date) {
      dr.validityPeriod = {
        start: `${raw.date}T00:00:00+08:00`,
        end: `${endDate}T23:59:59+08:00`
      };
    }
    if (Object.keys(dr).length > 0) {
      resource.dispenseRequest = dr;
    }
    const indication = (raw.indication ?? "").trim();
    const indicationZh = (raw.indication_zh ?? "").trim();
    const indicationCode = (raw.indication_code ?? "").trim();
    if (indication || indicationZh || indicationCode) {
      const rc = {};
      if (indicationCode) {
        rc.coding = [
          {
            system: ICD_10_CM,
            code: normalizeIcd10Cm(indicationCode),
            display: indication || indicationZh || indicationCode
          }
        ];
      }
      const nameZh = indicationZh || indication;
      if (nameZh) {
        rc.text = indicationCode ? `${indicationCode} ${nameZh}`.trim() : nameZh;
      }
      resource.reasonCode = [rc];
    }
    return resource;
  }
  function mapMedicationsDedup(rawItems, patientId) {
    const byKey = /* @__PURE__ */ new Map();
    for (const item of rawItems) {
      if (!item || typeof item !== "object")
        continue;
      const drugName = (item.drug_name ?? "").trim();
      if (!drugName)
        continue;
      const datePart = (item.date ?? "").slice(0, 10);
      const key = `${datePart}|${canonicalDrugKey(drugName)}`;
      const existing = byKey.get(key);
      if (existing === void 0) {
        byKey.set(key, item);
      } else {
        if (cjkChars(drugName) < cjkChars(existing.drug_name ?? "")) {
          byKey.set(key, item);
        }
      }
    }
    const out = [];
    for (const item of byKey.values()) {
      const m = mapMedicationRequest(item, patientId);
      if (m !== null)
        out.push(m);
    }
    return out;
  }

  // ../packages/mapper/src/loinc-tables.ts
  var NHI_TO_LOINC = {
    // ── Haematology ────────────────────────────────────
    "08002C": "6690-2",
    // 白血球計數 — Leukocytes #/vol Blood Auto
    "08003C": "718-7",
    // 血色素檢查 — Hemoglobin Mass/vol Blood
    "08006C": "777-3",
    // 血小板計數 — Platelets #/vol Blood Auto
    "08013C": "57021-8",
    // 白血球分類計數 — CBC W Auto Diff panel
    "08128B": "47286-0",
    // 骨髓細胞形態判讀合併細胞分類計數
    // TODO(panel, v0.9.10 audit): 08128B reports morphology + per-cell
    // counts as multi-row. Low priority because bone marrow rarely
    // surfaces in 健康存摺 + SMART app shows raw display text per row,
    // so the visible-bug surface is small. Promote to DISPLAY_FIRST_CODES
    // + add PANEL_LOINC_MAP if SMART app dev reports the issue.
    // ── Chemistry ─────────────────────────────────────
    "09011C": "17861-6",
    // 鈣 — Calcium Mass/vol S/P
    "09015C": "2160-0",
    // 肌酸酐、血 — Creatinine Mass/vol S/P
    "09016C": "2161-8",
    // 肌酐、尿 — Creatinine Mass/vol Urine
    "09025C": "1920-8",
    // AST/GOT — Aspartate aminotransferase Act S/P
    "09026C": "1742-6",
    // ALT/GPT — Alanine aminotransferase Act S/P
    "09029C": "1975-2",
    // 膽紅素總量 — Bilirubin total Mass/vol S/P
    "09030C": "1968-7",
    // 直接膽紅素 — Bilirubin direct Mass/vol S/P
    "09033C": "2532-0",
    // 乳酸脫氫脢 — LDH Activity S/P
    "09038C": "1751-7",
    // 白蛋白 — Albumin Mass/vol S/P
    "09138C": "35672-5",
    // 直接/總膽紅素比值
    "12112B": "1751-7",
    // 白蛋白(免疫比濁法) — Albumin Mass/vol S/P
    "24007B": "1995-0",
    // 血漿游離鈣 — Calcium ionized Moles/vol S/P
    // ── Hormones ──────────────────────────────────────
    "09121C": "2986-8",
    // 睪丸酯醇免疫分析 — Testosterone Mass/vol S/P
    "27021B": "2991-8",
    // 睪丸脂醇放射免疫分析 — Testosterone Free S/P
    // 09125C / 09127C corrected after dual-reviewer audit — the earlier
    // values (3016-3 was TSH, 10501-5 was LH) were just wrong copy-
    // pastes. Source for the new values: TWNHIFHIR PAS ConceptMap.
    "09125C": "83098-4",
    // 濾泡刺激素免疫分析 — Follitropin (FSH) Immunoassay S/P
    "09127C": "83096-8",
    // 二氫基春情素免疫分析 — Estradiol Immunoassay S/P
    // ── Tumor markers ─────────────────────────────────
    "12007C": "1834-1",
    // α-胎兒蛋白 (AFP) — Mass/vol S/P
    "27049C": "1834-1",
    // 甲-胎兒蛋白 (AFP, RIA)
    "12081C": "83112-3",
    // PSA (EIA/LIA) — Mass/vol S/P Immunoassay
    "12198C": "83113-1",
    // Free PSA — Mass/vol S/P Immunoassay
    "27052C": "2857-1",
    // 攝護腺特異抗原 (PSA) — Mass/vol S/P
    "27083B": "10886-0",
    // 游離PSA (RIA)
    // 12052B β2-微球蛋白 — previously mapped to 10873-8 which is actually
    // 'Beta-2-Microglobulin [Mass/time] in 24 hour Urine' (timed urine
    // collection, verified loinc.org/10873-8/). Taiwan 12052B billing is
    // typically a serum order; 1952-1 is the verified serum-or-plasma LOINC
    // (Component=Beta-2-Microglobulin, Property=MCnc) — loinc.org/1952-1/.
    "12052B": "1952-1",
    // β2-microglobulin — Mass/vol S/P
    // ── Immunology / proteins ─────────────────────────
    "09065B": "90991-1",
    // 蛋白電泳分析 — panel LOINC (sub-rows
    // routed via DISPLAY_FIRST_CODES + PANEL_LOINC_MAP since v0.10.0;
    // this entry is fallback for empty display)
    // 12028B (免疫擴散法) / 12029B (免疫比濁法) IgM — previously both mapped to
    // LOINC 14002-0 which is actually 'IgM [Units/volume] in Cord blood'
    // (neonatal specimen, verified loinc.org/14002-0/); that was removed in
    // the 2026-05-19 audit. v0.13.5 (SMART app dev report 2026-06-03, Bug B):
    // now mapped to 2472-9, verified as 'IgM [Mass/volume] in Serum or Plasma'
    // (Component=IgM, Property=MCnc, System=Ser/Plas, Method NULL → method-
    // independent, covers both immunodiffusion + nephelometry) — loinc.org/
    // 2472-9/ 2026-06-03. Symmetric with IgG 12025B→2465-3, IgA 12027B→2458-8.
    "12028B": "2472-9",
    // IgM 免疫擴散法 — Mass/vol S/P
    "12029B": "2472-9",
    // IgM 免疫比濁法 — Mass/vol S/P
    "12103B": "95801-7",
    // 免疫電泳分析
    "12160B": "15189-4",
    // IgG κ/λ
    "12171B": "17351-8",
    // 抗嗜中性球細胞質抗體 (ANCA)
    "12204B": "20584-9",
    // 白血球表面標記 — Lymphocyte subset panel
    // (sub-rows routed via DISPLAY_FIRST_CODES + PANEL_LOINC_MAP since
    // v0.10.0; this entry is fallback for empty display)
    "25013B": "44596-5",
    // 螢光切片檢查
    // ── Hepatitis ─────────────────────────────────────
    "14030C": "5195-3",
    // HBsAg
    "14031C": "5195-3",
    // HBsAg
    "14032C": "5196-1",
    // HBsAg (Mass/vol)
    "14051C": "13955-0",
    // HCV Ab
    "27033C": "5197-9",
    // HBsAg RIA
    // ── Pathology / cytology / IHC ────────────────────
    "12195B": "18474-7",
    // Her-2/neu ISH
    "27061B": "14130-9",
    // 動情激素接受體 (ER)
    "27062B": "10861-3",
    // 黃體激素接受體 (PR)
    "30103B": "83052-1",
    // PD-L1 IHC
    // ── Audiology / pulmonary ─────────────────────────
    "17009B": "24341-0",
    // 一氧化碳肺瀰散量 — DLCO panel (sub-rows
    // routed via DISPLAY_FIRST_CODES + PANEL_LOINC_MAP since v0.10.0;
    // this entry is fallback for empty display)
    // 22001C 純音聽力檢查 — previously mapped to LOINC 45498-3 which is
    // actually 'Hearing [Minimum Data Set]' (an MDS long-term-care survey
    // item, NOT a pure-tone audiometry measurement; verified loinc.org/
    // 45498-3/ 2026-05-29). Wrong analyte type entirely. Leaving unmapped;
    // falls through to NHI-code-only coding. v0.12.0 audit.
    // 22015B 詐聾聽力檢查 — same wrong 45498-3 mapping. Removed.
    // 22025B 自記聽力檢查 — previously mapped to LOINC 46530-2 which is
    // actually 'Sensory status - hearing and ability to understand spoken
    // language [OASIS]' (an OASIS home-health survey item, verified
    // loinc.org/46530-2/ 2026-05-29). Wrong type. Leaving unmapped.
    // ═════════════════════════════════════════════════════════════════
    // SUPPLEMENTAL (not in PAS ConceptMap — hand-curated from common
    // NHI codes seen in 健康存摺. LOINC verified against loinc.org
    // canonical names. Method-specific codes (e.g. hs-CRP) pick the
    // specific LOINC; general-method codes pick the most common form.
    // If 健保署 publishes an authoritative broader ConceptMap later,
    // replace this section in one pass.
    // ═════════════════════════════════════════════════════════════════
    // ── Glucose / HbA1c ───────────────────────────────
    "09005C": "1558-6",
    // 空腹血糖 (Glu-AC) — Fasting glucose Mass/vol S/P
    "09140C": "2345-7",
    // 血糖-餐後/隨機 — Glucose Mass/vol S/P (general)
    "09006C": "4548-4",
    // 醣化血紅素 (HbA1c) — Hemoglobin A1c/Hgb.total Blood
    // ── Renal / electrolytes ─────────────────────────
    "09002C": "3094-0",
    // BUN — Urea nitrogen Mass/vol S/P
    "09013C": "3084-1",
    // Uric Acid — Urate Mass/vol S/P
    "09021C": "2951-2",
    // Na — Sodium Moles/vol S/P
    "09022C": "2823-3",
    // K  — Potassium Moles/vol S/P
    "09024C": "2028-9",
    // CO2 — Carbon dioxide Moles/vol S/P
    "09012C": "2777-1",
    // Inorganic P — Phosphate Mass/vol S/P
    "09046B": "19123-9",
    // Mg — Magnesium Mass/vol S/P
    // ── Lipid panel ───────────────────────────────────
    "09001C": "2093-3",
    // T-Cholesterol — Cholesterol Mass/vol S/P
    "09004C": "2571-8",
    // TG — Triglyceride Mass/vol S/P
    "09043C": "2085-9",
    // HDL — HDL cholesterol Mass/vol S/P
    "09044C": "13457-7",
    // LDL — LDL cholesterol (calculated) Mass/vol S/P
    // ── Liver function ────────────────────────────────
    "09027C": "6768-6",
    // ALK-P — Alkaline phosphatase Activity S/P
    "09031C": "2324-2",
    // γ-GT — Gamma glutamyl transferase Activity S/P
    "09035C": "2500-7",
    // TIBC — Iron binding capacity Mass/vol S/P
    // 09037C 血氨 (Ammonia) — previously mapped to LOINC 1827-5 which is
    // actually 'Alpha 1 antitrypsin MS [Mass/volume] in Serum or Plasma'
    // (verified loinc.org/1827-5/); that was removed in the 2026-05-19 audit.
    // v0.13.5 (SMART app dev report 2026-06-03, Bug B): now mapped. NOTE the
    // bug report's suggested 1827-1 does NOT exist in LOINC (verified
    // loinc.org/1827-1/ → "code does not exist"; likely a typo off the old
    // 1827-5). Ammonia is ALWAYS plasma (never serum — NH3 analytic
    // stability), so System=Plas is settled; mass-vs-molar depends on the
    // lab's reported unit:
    //   22763-7  Ammonia [Mass/volume] in Plasma  (MCnc, µg/dL — default)
    //   16362-6  Ammonia [Moles/volume] in Plasma (SCnc, µmol/L)
    // Both verified at loinc.org 2026-06-03. Default is the µg/dL mass form
    // (台灣傳統 / 台北榮總 慣用單位); observation.ts ammoniaLoincFix() switches
    // to the molar LOINC when the row's unit is µmol/L, so the LOINC's
    // property class always matches the shipped unit (avoids the v0.12.0
    // Free T4 LOINC↔unit-mismatch class).
    "09037C": "22763-7",
    // 血氨 (Ammonia) — Mass/vol Plasma; molar unit → 16362-6 via ammoniaLoincFix
    "09064C": "3040-3",
    // Lipase — Activity S/P
    "09059B": "14118-4",
    // Lactate — Mass/vol Plasma
    // ── Hematology extras ─────────────────────────────
    "08004C": "4544-3",
    // HCT — Hematocrit volume fraction Blood
    "08008C": "14196-0",
    // Reticulocyte — Reticulocytes/100 RBC
    "08010C": "711-2",
    // Eosinophil count — #/vol Blood
    "08011C": "24317-0",
    // CBC panel — Hematology panel Blood
    "08026C": "6301-6",
    // PT/INR — INR Platelet poor plasma
    "08036C": "14979-9",
    // APTT — Platelet poor plasma
    // v0.12.0 audit fix: 2692-7 typo; LOINC 2692-7 does NOT exist in the
    // LOINC database (verified loinc.org/2692-7/ → not found, suggests
    // 2692-2). Correct LOINC for serum/plasma osmolality is 2692-2,
    // "Osmolality of Serum or Plasma" (verified loinc.org/2692-2/).
    "08075C": "2692-2",
    // Osmolality — Serum or Plasma
    "08079B": "30240-6",
    // D-dimer — Plt poor plasma
    // ── Coag panel members (kept here as fallback) ────────
    // 08026C PT/INR is a 2-row panel (PT in seconds + INR). Promoted to
    // DISPLAY_FIRST_CODES so per-item displays route via PANEL_LOINC_MAP;
    // this entry is only consumed when the display is empty/unrecognised,
    // in which case INR is the safer default (more clinically tracked).
    // ── Thyroid ───────────────────────────────────────
    // Free T4 has TWO valid LOINCs that differ only in unit-system:
    //   3024-7  Component=Thyroxine.free, Property=MCnc (Mass conc, ng/dL)
    //   14920-3 Component=Thyroxine.free, Property=SCnc (Molar conc, pmol/L)
    // Both are Free T4 — neither is Total T4. Earlier history:
    //   - Original mapping was 3024-7 (correct: matches Taiwan ng/dL labs).
    //   - Commit 9da5e5b changed it to 14920-3 on the premise that 3024-7
    //     was Total T4. That premise was inverted (verified loinc.org/3024-7/
    //     — Component is "Thyroxine.free"); the change introduced a LOINC↔unit
    //     mismatch (molar LOINC paired with a ng/dL value).
    //   - Restoring 3024-7 here so the LOINC's property class (MCnc) matches
    //     the unit field (ng/dL) Taiwan labs ship. See docs/LOINC_AUDIT_2026_05_19.md
    //     section F for full evidence.
    "09106C": "3024-7",
    // Free T4 — Thyroxine (T4) free [Mass/volume] S/P
    "09112C": "3016-3",
    // TSH — Thyrotropin S/P
    // ── Cardiac markers ───────────────────────────────
    "09099C": "10839-9",
    // Troponin I — Troponin I cardiac S/P
    "12192C": "33959-8",
    // Procalcitonin — S/P
    "12193C": "33762-6",
    // NT-proBNP — Mass/vol S/P
    // ── Vitamins / cofactors ──────────────────────────
    "09129C": "2132-9",
    // Vit B12 — Cobalamin Mass/vol S/P
    "09130C": "2284-8",
    // Folate — Mass/vol S/P
    "09113C": "2143-6",
    // Cortisol — Mass/vol S/P
    "12116C": "2276-4",
    // Ferritin — Mass/vol S/P
    // ── Acute phase / inflammation ───────────────────
    // 12015C is the generic NHI CRP order — most clinical contexts in 健保
    // send a regular (not hs-) CRP, so map to 1988-5. If a 院所 specifically
    // bills hs-CRP it will land on a different code (e.g. 12189C).
    "12015C": "1988-5",
    // CRP — C reactive protein Mass/vol S/P
    "12053C": "5048-4",
    // ANA — Antinuclear Ab Titer S/P
    // 12056B 抗粒線體抗體 (AMA) — previously mapped to LOINC 16124-0 which is
    // actually 'Cryptococcus sp Ab [Titer] in Serum' (隱球菌抗體, a fungal
    // serology — verified loinc.org/16124-0/ 2026-06-03). Completely wrong
    // analyte: AMA is the key marker for primary biliary cholangitis (PBC),
    // NOT an infection marker. Bug reported by SMART app dev 2026-06-03
    // (嘉基 12056B, value '1:20(-)' → wrongly classified as 黴菌血清學).
    // 20483-4 verified as the canonical AMA titer LOINC (Component=
    // Mitochondria Ab, Property=Titr, System=Ser, Scale=SemiQn, Method NULL
    // → method-independent, fits the titer value) — loinc.org/20483-4/.
    "12056B": "20483-4",
    // 抗粒線體抗體 (AMA) — Mitochondria Ab [Titer] Serum
    // ── Urinalysis ────────────────────────────────────
    "06012C": "5778-6",
    // Urine appearance — Color
    "06013C": "24356-8",
    // 尿生化 panel — Urinalysis macroscopic panel
    "07001C": "14563-1",
    // Stool occult blood
    "09134C": "58453-2",
    // iFOBT quantitative — Hemoglobin Mass/vol Stool by IA
    "12111C": "2161-8",
    // Urine Creatinine — same LOINC as 09016C
    // ── Serology / immunology ────────────────────────
    "12001C": "5292-8",
    // RPR — Serum/Plasma
    "12021C": "2039-6",
    // CEA — Mass/vol S/P
    "12025B": "2465-3",
    // IgG — Mass/vol S/P
    "12027B": "2458-8",
    // IgA — Mass/vol S/P
    "12031C": "19113-0",
    // IgE — Mass/vol S/P
    // 12069B Cryptococcus Ag — previously mapped to LOINC 5132-6 which is
    // actually 'DNA single strand Ab [Units/volume] in Serum' (anti-ssDNA,
    // lupus serology — verified loinc.org/5132-6/). Completely wrong
    // analyte. Leaving unmapped; falls through to NHI-code-only coding.
    // See docs/LOINC_AUDIT_2026_05_19.md.
    "12079C": "24108-3",
    // CA 19-9 — Mass/vol S/P
    // ── Blood type ────────────────────────────────────
    // v0.11.11 (SMART app dev bug 4 2026-05-29 + loinc.org audit):
    // 882-1 is the COMBINED "ABO and Rh group [Type] in Blood" — its
    // answer list is "O Pos / O Neg / A Pos…AB Neg", not appropriate
    // for ABO-only OR Rh-only rows. Splitting per loinc.org audit:
    //   883-9   ABO group [Type] in Blood              — 11001C ABO
    //   10331-7 Rh [Type] in Blood                     — 11003C Rh(D)
    //   890-4   Antibody screen [Presence] in Blood    — 11004C unchanged
    // Each LOINC verified at loinc.org 2026-05-29 (Component / Property /
    // System / Method confirmed appropriate for standalone analyte).
    "11001C": "883-9",
    // ABO group [Type] in Blood (BLDBK)
    "11003C": "10331-7",
    // Rh [Type] in Blood (BLDBK)
    "11004C": "890-4",
    // 抗體反應 — Antibody screen
    // ── Microbiology cultures ────────────────────────
    // 13007C 細菌培養 — previously mapped to LOINC 14219-0 which is
    // actually 'HTLV I p26 Ab in Serum' (verified at loinc.org). The
    // right family is 6463-4 / 11268-0 (Bacteria identified by aerobe
    // culture) but the source row doesn't tell us specimen — leaving
    // unmapped so we don't lie. Falls through to NHI-code-only coding.
    // 13013C TB Culture — previously mapped to LOINC 31952-5 which is
    // actually 'Rinderpest virus Ag [Presence] in Exudate' (cattle
    // morbillivirus, verified loinc.org/31952-5/). Wrong organism entirely.
    // Leaving unmapped; falls through to NHI-code-only coding. See
    // docs/LOINC_AUDIT_2026_05_19.md.
    "13016B": "600-7",
    // Blood Culture — Bacteria identified in Blood
    // ── Virology ──────────────────────────────────────
    // 14004B CMV IgG — previously mapped to LOINC 7849-3 which is actually
    // 'Taenia solium larva IgM Ab [Presence] in Serum' (pork tapeworm,
    // verified loinc.org/7849-3/). No verified canonical replacement found
    // in this pass (candidates 5126-8 / 5125-0 are IgM or method-specific,
    // 22592-9 / 22591-1 / 16125-5 returned HTTP 500 on every retry).
    // Leaving unmapped; falls through to NHI-code-only coding.
    "14048B": "7853-5",
    // CMV IgM — Cytomegalovirus IgM Ab [Units/volume] S/P
    //   restored after audit: 14048B previously mapped to 7850-1 which is
    //   'Taenia solium larva Ab' (verified loinc.org/7850-1/). 7853-5
    //   verified as the canonical CMV IgM LOINC (Component=Cytomegalovirus
    //   Ab.IgM, Property=ACnc) — loinc.org/7853-5/.
    "14066C": "80383-3",
    // Influenza A — Ag Respiratory
    "14084C": "94558-4"
    // SARS-CoV-2 Ag — Respiratory
    // 12184C CMV DNA quant PCR — previously mapped to LOINC 88157-3 which
    // is actually 'Microscopic observation [Identifier] in Semen by Acid
    // fast stain' (semen AFB, verified loinc.org/88157-3/ 2026-05-29).
    // Completely wrong analyte + specimen. Leaving unmapped; falls through
    // to NHI-code-only coding. v0.12.0 audit.
    // ── Mycobacterium / acid-fast (added after audit) ─
    // 13025C 抗酸性濃縮抹片染色檢查 — previously mapped to LOINC 29260-7
    // which is actually 'Monocytes Abnormal [#/volume] in Blood by Manual
    // count' (verified loinc.org/29260-7/ 2026-05-29). Wrong analyte
    // (hematology, not microbiology). Leaving unmapped. v0.12.0 audit.
    // 13026C 抗酸菌培養 — previously mapped to LOINC 29553-5 which is
    // actually 'Age calculated' (verified loinc.org/29553-5/ 2026-05-29).
    // Completely unrelated to mycobacteria. Leaving unmapped. v0.12.0 audit.
    // ── ABG panel (09041B) ────────────────────────────
    // Intentionally NOT mapped here — 09041B is a panel order that
    // unfolds into many items (pH / pCO2 / pO2 / HCO3 / TCO2 / SBE /
    // ABE / SBC / SAT). Mapping the panel code to "pH" would mis-label
    // every non-pH row that shares this NHI code. Each item is
    // resolved via _LOINC_MAP display-keyword fallback below; 09041B
    // also appears in _DISPLAY_FIRST_CODES so display always wins.
    // ── Body fluid / synovial fluid panel (16008C unfolds; the
    // member items rely on display keywords for specimen-aware
    // LOINCs). Parent code maps to synovial fluid analysis panel. ──
    // 16008C 滑液檢查 — previously mapped to LOINC 33903-6 which is
    // actually 'Ketones [Presence] in Urine' (verified loinc.org).
    // Leaving unmapped; the panel falls through to NHI-coding only
    // and the per-item displays in _LOINC_MAP carry their own LOINCs
    // where known.
  };
  var DISPLAY_FIRST_CODES = /* @__PURE__ */ new Set([
    "08011C",
    // CBC panel
    "08013C",
    // CBC w/ auto diff panel
    "06013C",
    // Urinalysis macroscopic panel
    "09015C",
    // Serum creatinine — Taiwan labs report eGFR as a piggyback
    // sub-row on the same Crea billing code. Without panel-mode handling,
    // every row under 09015C (incl. the eGFR one) got LOINC 2160-0
    // (Creatinine), causing SMART apps to display eGFR=33 as CREA=33 mg/dL
    // — an instant fatal-looking false reading (real CREA ~1.94, real eGFR
    // is CKD stage 3a). Bug report 2026-05-27 (Part 2).
    "09041B",
    // ABG panel
    "16008C",
    // Synovial / body-fluid panel
    "08026C",
    // PT/INR — Taiwan labs bill PT (seconds) AND INR under the
    // same 08026C code as two sub-rows. Without panel-mode handling, both
    // collapsed to LOINC 6301-6 (INR). For warfarin monitoring this is
    // patient-safety-adjacent: a trend chart would plot PT seconds (~12)
    // and INR (~2.5) on the same series, or label a PT=12 row as "INR=12"
    // (instantly looks like critical anticoagulation overdose). v0.9.10.
    "08036C",
    // APTT — Taiwan labs bill BOTH "APTT" (seconds, normal ~25-35)
    // AND "Heparin治療範圍參考倍數" / "APTT data/mean" (ratio, normal ~1.0)
    // under the same 08036C code. Without panel-mode handling, both
    // collapsed to LOINC 14979-9 (APTT time, seconds) — the ratio row's
    // value of 1.08 displayed under an APTT-time trend column would read
    // as a fatally low APTT, or scientifically nonsensical seconds unit
    // for a ratio. SMART app dev report 2026-05-29. LOINC verified at
    // loinc.org: 14979-9 Property=Time (seconds), 63561-5 Property=RelTime
    // (actual/normal ratio). v0.11.9.
    // ── CBC component billing codes (v0.9.10, bug report Part 5) ─────
    // These are SINGLE-analyte billing codes (one analyte per code, NOT
    // panels). Why are they here? Hospital LIS labelling errors swap
    // displays across CBC siblings: 嘉基's bundle billed 08004C (HCT)
    // but the row's display text was "HGB" with value 13 g/dL — clearly
    // a hemoglobin measurement mis-billed as HCT, or a label/display
    // swap inside the LIS. Trusting the NHI code returned LOINC 4544-3
    // (HCT) for a hemoglobin row → SMART app's HCT trend column showed
    // 13 (impossible for HCT, normal 30-50%). Promoting these to
    // display-first lets unambiguous display text ("HGB", "HCT", "Hb",
    // "Ht") override the LIS billing-swap. SCOPED to CBC family ONLY —
    // we don't generalize to other single-test codes because outside
    // CBC the display strings are less standardized and the risk of
    // wrong over-ride is higher. v0.9.10 Part 5.
    "08002C",
    // WBC count (Leukocytes)
    "08003C",
    // Hemoglobin
    "08004C",
    // Hematocrit
    "08006C",
    // Platelets
    // ── Urine creatinine sibling codes (v0.9.10 Part 6 N2) ──
    // Promoted to defend against the UACR billing pattern: hospitals
    // bill both legs of the ratio (microalbumin + urine creatinine)
    // under one creatinine code and distinguish by display text. Without
    // display routing, microalbumin rows return LOINC 2161-8 (creatinine).
    // See URINE_BIOCHEM_KEYS const for the analyte map.
    "09016C",
    // 肌酐、尿 — Urine creatinine billing
    "12111C",
    // Urine Creatinine (alternate billing)
    // ── Specialised panels (v0.10.0 — completing the v0.9.10 TODO list)
    // Same reasoning as CBC umbrella + urine: each billing code unfolds
    // into multiple sub-rows with distinct LOINCs. Previously deferred
    // under TODO(panel) comments in NHI_TO_LOINC; now activated with
    // verified LOINCs.
    "09065B",
    // SPE — albumin/α1/α2/β/γ globulin fractions + A/G ratio
    "12204B",
    // Flow cytometry CD markers — CD3/CD4/CD8/CD19/CD56/ratio
    "17009B"
    // DLCO — DLCO + VA + DLCO/VA
  ]);
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
  var PANEL_LOINC_MAP = {
    // ── Urinalysis (06013C) ──────────────────────────────
    // All routine dipstick items reside on a single NHI billing code.
    // Without this table they'd all collapse to the panel LOINC 24356-8,
    // losing per-item granularity that's clinically useful (e.g.
    // bilirubin vs urobilinogen for liver workup).
    "06013C": {
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
      "creatinine, urine": "2161-8"
    },
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
  var LOINC_MAP = {
    // ── Glucose ───────────────────────────────────────
    // Display-keyword fallback only kicks in when NO NHI code is
    // present (dashboard rows, LLM-extracted text). When the NHI code
    // IS present, 09005C → 1558-6 (Fasting) and 09140C → 2345-7
    // (generic) wins directly via _NHI_TO_LOINC.
    //
    // Faithful-transport principle: the bridge does NOT re-interpret
    // display strings like "FINGER SUGAR" as a different LOINC — it
    // preserves the raw display in `code.text` and the original NHI
    // code in `code.coding`. The SMART app does specimen/method-aware
    // grouping on the consumer side (see SMART app handoff doc).
    "fasting glucose": "1558-6",
    \u7A7A\u8179\u8840\u7CD6: "1558-6",
    "glu-ac": "1558-6",
    "glucose ac": "1558-6",
    glucose: "2345-7",
    \u8840\u7CD6: "2345-7",
    glu: "2345-7",
    // HbA1c MUST appear before generic "hb" entries so the longest-prefix
    // match wins for the "HbA1c" display string. Other A1c synonyms…
    hba1c: "4548-4",
    \u91A3\u5316\u8840\u7D05\u7D20: "4548-4",
    a1c: "4548-4",
    hemoglobin: "718-7",
    \u8840\u7D05\u7D20: "718-7",
    hgb: "718-7",
    hb: "718-7",
    // CBC diff — eosinophil count must precede the bare 'wbc'/'白血球'
    // keys (which would otherwise win as substrings).
    // 711-2 verified at loinc.org: 'Eosinophils [#/volume] in Blood
    // by Automated count'.
    \u55DC\u9178\u6027\u767D\u8840\u7403: "711-2",
    \u55DC\u4F0A\u7D05\u6027\u767D\u8840\u7403: "711-2",
    eosinophil: "711-2",
    eosinophils: "711-2",
    // Other diff cells — added v0.9.10 Part 6 N7 (long庚嘉義 row had
    // display="Neutrophil" with EMPTY coding array, ie. no NHI code
    // context for panel routing to kick in). When no NHI code, fall
    // back to /100 leukocytes form since that's the dominant diff
    // context in Taiwan LIS. Absolute-count form has its own dedicated
    // billing codes (08010C eosinophil count etc.) that resolve via
    // NHI_TO_LOINC path A before this global table is consulted.
    "neutrophilic segment": "770-8",
    neutrophil: "770-8",
    neutrophils: "770-8",
    segmented: "770-8",
    segment: "770-8",
    segments: "770-8",
    \u55DC\u4E2D\u6027\u767D\u8840\u7403: "770-8",
    \u55DC\u4E2D\u6027\u7403: "770-8",
    \u4E2D\u6027\u7403: "770-8",
    lymphocyte: "736-9",
    lymphocytes: "736-9",
    \u6DCB\u5DF4\u767D\u8840\u7403: "736-9",
    \u6DCB\u5DF4\u7403: "736-9",
    \u6DCB\u5DF4\u7D30\u80DE: "736-9",
    monocyte: "5905-5",
    monocytes: "5905-5",
    \u55AE\u6838\u767D\u8840\u7403: "5905-5",
    \u55AE\u6838\u7403: "5905-5",
    basophil: "706-2",
    basophils: "706-2",
    \u55DC\u9E7C\u6027\u767D\u8840\u7403: "706-2",
    \u55DC\u9E7C: "706-2",
    // Microalbumin (urine) — same Part 6 N7 reasoning: when no NHI
    // code arrives, "Micro Albumin" / "MALB" display should still
    // route to the right LOINC instead of falling to null.
    "micro-albumin": "14957-5",
    microalbumin: "14957-5",
    "micro albumin": "14957-5",
    malb: "14957-5",
    \u5FAE\u5C0F\u767D\u86CB\u767D: "14957-5",
    wbc: "6690-2",
    \u767D\u8840\u7403: "6690-2",
    platelet: "777-3",
    \u8840\u5C0F\u677F: "777-3",
    plt: "777-3",
    // RBC + RBC indices — verified LOINCs (loinc.org):
    // 789-8  Erythrocytes #/vol Blood Auto              → RBC
    // 785-6  Erythrocyte mean corpuscular hemoglobin    → MCH
    // Long CJK forms first (LDL/cholesterol pattern) so '平均紅血球
    // 血色素' wins over 紅血球.
    \u5E73\u5747\u7D05\u8840\u7403\u8840\u8272\u7D20: "785-6",
    rbc: "789-8",
    \u7D05\u8840\u7403: "789-8",
    mch: "785-6",
    // Urine creatinine — MUST appear before generic 'creatinine' so
    // rows like 'U-CRE 尿液肌酸酐' or 'Creatinine(U)' resolve to the
    // urine LOINC (2161-8) instead of being shadowed by the serum
    // default (2160-0). Same longest-specific-first ordering as
    // the fasting-vs-random glucose block.
    "urine creatinine": "2161-8",
    "creatinine urine": "2161-8",
    "creatinine(u)": "2161-8",
    "u-cre": "2161-8",
    "u-crea": "2161-8",
    \u5C3F\u6DB2\u808C\u9178\u9150: "2161-8",
    creatinine: "2160-0",
    \u808C\u9178\u9150: "2160-0",
    \u808C\u9150\u9178: "2160-0",
    // Taiwan variant spelling
    crea: "2160-0",
    bun: "3094-0",
    \u5C3F\u7D20\u6C2E: "3094-0",
    ast: "1920-8",
    alt: "1742-6",
    ferritin: "2276-4",
    \u8840\u6E05\u9435\u86CB\u767D: "2276-4",
    ferr: "2276-4",
    // Vital-signs from 成人預防保健 (IHKE3402) — separate code namespace
    // but the lookup is by display-name substring, same as for labs.
    "body height": "8302-2",
    "body weight": "29463-7",
    bmi: "39156-5",
    // Waist circumference — measurement LOINC (8280-0). 56086-2 is
    // the 'Adult Waist Circumference Protocol' code, which is a
    // survey/protocol descriptor, NOT a numeric measurement
    // (verified at loinc.org). NHI 健保 reports a single waistline
    // number per visit, so the measurement code is correct.
    "waist circumference": "8280-0",
    "systolic blood pressure": "8480-6",
    "diastolic blood pressure": "8462-4",
    // Lipid panel — ORDER MATTERS. LDL/HDL variants MUST precede the
    // generic 'cholesterol' key so a row labelled 'LDL CHOLESTEROL'
    // resolves to 13457-7 (LDL calculated) and 'HDL CHOLESTEROL' to
    // 2085-9, instead of falling to 2093-3 (total cholesterol) via the
    // 'cholesterol' substring. Same canonical ordering as _LAB_SYNONYMS.
    "ldl cholesterol": "13457-7",
    "ldl-cholesterol": "13457-7",
    \u4F4E\u5BC6\u5EA6\u81BD\u56FA\u9187: "13457-7",
    \u4F4E\u5BC6\u5EA6\u8102\u86CB\u767D\u81BD\u56FA\u9187: "13457-7",
    // 13457-7 = LDL cholesterol (calculated) — matches the NHI 09044C
    // billing code's intent (Taiwan labs predominantly report calculated
    // LDL via Friedewald). Keep consistent with _NHI_TO_LOINC["09044C"].
    "ldl-c": "13457-7",
    ldl: "13457-7",
    "hdl cholesterol": "2085-9",
    "hdl-cholesterol": "2085-9",
    \u9AD8\u5BC6\u5EA6\u81BD\u56FA\u9187: "2085-9",
    \u9AD8\u5BC6\u5EA6\u8102\u86CB\u767D\u81BD\u56FA\u9187: "2085-9",
    "hdl-c": "2085-9",
    hdl: "2085-9",
    // Total cholesterol — bare 'cholesterol' only fires AFTER the
    // LDL/HDL-prefixed variants above have been checked.
    "total cholesterol": "2093-3",
    "t-cholesterol": "2093-3",
    \u8840\u6E05\u7E3D\u81BD\u56FA\u9187: "2093-3",
    \u7E3D\u81BD\u56FA\u9187: "2093-3",
    cholesterol: "2093-3",
    triglyceride: "2571-8",
    \u4E09\u9178\u7518\u6CB9\u916F: "2571-8",
    "uric acid": "3084-1",
    egfr: "33914-3",
    hbsag: "5196-1",
    "anti-hcv": "16128-1",
    // Urine protein (display fallback for the no-NHI-code path that
    // comes from IHKE3402 vitals + adult-preventive supplements).
    "urine protein": "20454-5",
    // Protein Mass/vol Urine
    "u-pro": "20454-5",
    \u5C3F\u86CB\u767D: "20454-5",
    // ABG panel components — 09041B parent code in NHI_TO_LOINC; each
    // member's display ("pCO2", "pO2", "HCO3", "TCO2", "SBE/ABE",
    // "SBC", "SAT" / "SaO2") falls to its own LOINC.
    // pH MUST come before pco2/po2 so the bare "pH" display lands here.
    ph: "11558-4",
    // pH of Arterial blood
    pco2: "2019-8",
    // Carbon dioxide pp in Arterial blood
    po2: "2703-7",
    // Oxygen pp in Arterial blood
    hco3: "1959-6",
    // Bicarbonate Moles/vol Arterial
    bicarbonate: "1959-6",
    tco2: "2028-9",
    // Total CO2 Moles/vol Arterial
    // Bug report 2026-05-27 Part 3 C1: SBE and ABE were both mapped to
    // 11555-0 ("Base excess in Arterial blood by calculation"), so SMART
    // apps that pivot by LOINC collapsed two clinically distinct analytes
    // into one column. ABE is the actual (non-standardised) base excess;
    // SBE is the standardised pH-7.40 / Hb-5 g/dL value. Different normal
    // ranges, different clinical interpretation. Splitting per bug report.
    // (Previous sbc → 1925-7 mapping kept as-is: SBC is rarely reported
    // in Taiwan ABG; if it ever collides with the new ABE → 1925-7 in a
    // single bundle, the SMART app will need to disambiguate via code.text
    // — left as a known follow-up rather than guessing a new SBC LOINC.)
    abe: "1925-7",
    // ABE — Base excess in Blood by calculation
    "a.b.e": "1925-7",
    // period-separated abbrev (v0.11.4 audit)
    "actual base excess": "1925-7",
    sbe: "1927-3",
    // SBE — Base excess in Arterial blood adjusted to pH 7.40
    "s.b.e": "1927-3",
    "standard base excess": "1927-3",
    sbc: "1925-7",
    // SBC — Standard bicarbonate Arterial (legacy mapping; see comment above)
    saturat: "2713-6",
    // O2 saturation Arterial
    sao2: "2713-6",
    sat: "2713-6",
    // NHI display shows just "SAT"
    // Synovial / body-fluid components (16008C parent above).
    "sf.color": "5778-6",
    // Color of Body fluid (reuse Urine color spec OK)
    // NOTE: 8255-2 / 13948-5 previously listed here both turned out
    // to be unrelated LOINCs (verified loinc.org — 8255-2 is
    // 'Service comment 13', 13948-5 is 'Coccidioides immitis IgM
    // Ab'). Body-fluid Appearance / RBC don't have well-attested
    // LOINCs in our table yet — falling through to code.text-only
    // is safer than emitting a misleading LOINC. To add later,
    // verify each against loinc.org first.
    "sf.wbc": "26466-3",
    // WBC #/vol Body fluid
    "sf.neutrophil": "10328-6",
    // Neutrophils/100 leukocytes in Body fluid
    "sf.lympho": "13046-8"
    // Lymphocytes #/vol Body fluid
  };
  var LOINC_DISPLAY = {
    // ── Urinalysis (06013C panel sub-items) ──────────
    // Most critical block — NHI's "Color 尿 顏  ..." style labels are
    // what triggers downstream Chinese-substring labelling bugs.
    "5803-2": "pH of Urine",
    "5811-5": "Specific gravity of Urine",
    "5770-3": "Bilirubin Urine Ql",
    "5802-4": "Nitrite Urine Ql",
    "5778-6": "Color of Urine",
    "5767-9": "Appearance of Urine",
    "5818-0": "Urobilinogen Urine Ql",
    "20454-5": "Protein Mass/Vol in Urine",
    // v0.12.2 (SMART app dev v0.12.1 audit 2026-05-29): quantitative
    // urine protein LOINC. Verified at loinc.org/2888-6/ —
    //   Component=Protein, Property=MCnc (Mass concentration),
    //   System=Urine, Scale=Qn (Quantitative), Class=UA.
    // Distinct from 20454-5 which is Property=PrThr (Presence) /
    // Scale=Ord (Ordinal) — dipstick presence test. Bridge routes
    // numeric mg/dL values to 2888-6 and qualitative dipstick values
    // (Negative / Trace / 1+ / "4+ (2000)" combined) to 20454-5 — see
    // classifyUrineProteinValue() in observation.ts.
    "2888-6": "Protein [Mass/volume] in Urine",
    "14957-5": "Microalbumin Mass/Vol in Urine",
    "14959-1": "Microalbumin/Creatinine Ratio in Urine",
    "5792-7": "Glucose Urine Ql",
    "5797-6": "Ketones Urine Ql",
    "5794-3": "Hemoglobin Urine Ql",
    "5799-2": "Leukocytes Urine Ql",
    "24356-8": "Urinalysis Macro Panel",
    // ALL entries below use the LOINC canonical 'Long Common Name'
    // as accepted by the TWNHIFHIR validator. Source: loinc.org for
    // each code, cross-checked against the validator's reported
    // 'Valid display is one of N choices' for displays we previously
    // got wrong (45 LOINCs found in the P333333333 validation run).
    // When updating, copy the exact en-US long name from loinc.org —
    // the validator is sensitive to spelling / punctuation.
    //
    // ── Urinalysis (06013C panel sub-items) ──────────
    // ── ABG (09041B panel) — not in validator output; loinc.org sourced
    "11558-4": "pH of Arterial blood",
    "2019-8": "Carbon dioxide [Partial pressure] in Arterial blood",
    "2703-7": "Oxygen [Partial pressure] in Arterial blood",
    "1959-6": "Bicarbonate [Moles/volume] in Arterial blood",
    "2028-9": "Carbon dioxide [Moles/volume] in Serum or Plasma",
    "11555-0": "Base excess in Arterial blood by calculation",
    "1925-7": "Bicarbonate [Moles/volume] in Arterial blood --standard",
    "2713-6": "Oxygen saturation in Arterial blood",
    // ── Glucose ──────────────────────────────────────
    "1558-6": "Fasting glucose [Mass/volume] in Serum or Plasma",
    "2345-7": "Glucose [Mass/volume] in Serum or Plasma",
    // ── Hematology ───────────────────────────────────
    "718-7": "Hemoglobin [Mass/volume] in Blood",
    "4548-4": "Hemoglobin A1c/Hemoglobin.total in Blood",
    "6690-2": "Leukocytes [#/volume] in Blood by Automated count",
    "777-3": "Platelets [#/volume] in Blood by Automated count",
    "789-8": "Erythrocytes [#/volume] in Blood by Automated count",
    "785-6": "MCH [Entitic mass] by Automated count",
    "711-2": "Eosinophils [#/volume] in Blood by Automated count",
    // v0.11.12 FHIR R4 audit (2026-05-29): coverage sweep — LOINCs
    // routed to by mapper but missing from LOINC_DISPLAY. Without
    // entries here, Coding.display falls back to the raw row display
    // ("Meta-Myelocyte" / "紅血球分佈變異數" / etc) which violates the
    // FHIR R4 rule that Coding.display "follows the rules of the system"
    // (= LOINC Long Common Name). All entries below are the Long Common
    // Name fetched verbatim from loinc.org 2026-05-29.
    "740-1": "Metamyelocytes/Leukocytes in Blood by Manual count",
    "764-1": "Band form neutrophils/Leukocytes in Blood by Manual count",
    // CBC indices (v0.11.11 expanded variant routing → these LOINCs)
    "786-4": "MCHC [Entitic Mass/volume] in Red Blood Cells by Automated count",
    "787-2": "MCV [Entitic mean volume] in Red Blood Cells by Automated count",
    "788-0": "Erythrocyte [DistWidth] in Blood by Automated count",
    // v0.11.10 LOINC_SHORT_TEXT entries that lacked LOINC_DISPLAY twins
    "2143-6": "Cortisol [Mass/volume] in Serum or Plasma",
    "2132-9": "Cobalamin (Vitamin B12) [Mass/volume] in Serum or Plasma",
    "2284-8": "Folate [Mass/volume] in Serum or Plasma",
    "83112-3": "Prostate specific Ag [Mass/volume] in Serum or Plasma by Immunoassay",
    "4544-3": "Hematocrit [Volume Fraction] of Blood by Automated count",
    "57021-8": "CBC W Auto Differential panel - Blood",
    "24317-0": "Hemogram and platelets WO differential panel - Blood",
    // ── Clinical Documents ───────────────────────────
    // v0.16+ (2026-06-05): discharge summary DocumentReference.type.
    // Verified at loinc.org/18842-5/ — Component=Discharge summary note,
    // Class=DOC.ONTOLOGY, Scale=Doc, Status=Active. Long Common Name is
    // simply "Discharge summary" (no setting/role qualifier — code is
    // the universal document-type entry across all care settings).
    "18842-5": "Discharge summary",
    // ── Chemistry / liver / renal ────────────────────
    "1920-8": "Aspartate aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    "1742-6": "Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    "2160-0": "Creatinine [Mass/volume] in Serum or Plasma",
    "2161-8": "Creatinine [Mass/volume] in Urine",
    "33914-3": "Glomerular filtration rate [Volume Rate/Area] in Serum or Plasma by Creatinine-based formula (MDRD)/1.73 sq M",
    "3094-0": "Urea nitrogen [Mass/volume] in Serum or Plasma",
    "3084-1": "Urate [Mass/volume] in Serum or Plasma",
    "2951-2": "Sodium [Moles/volume] in Serum or Plasma",
    "2823-3": "Potassium [Moles/volume] in Serum or Plasma",
    "1975-2": "Bilirubin.total [Mass/volume] in Serum or Plasma",
    "1968-7": "Bilirubin.direct [Mass/volume] in Serum or Plasma",
    "1751-7": "Albumin [Mass/volume] in Serum or Plasma",
    "2885-2": "Protein [Mass/volume] in Serum or Plasma",
    // v0.11.11 — Total Protein
    "2532-0": "Lactate dehydrogenase [Enzymatic activity/volume] in Serum or Plasma",
    "6768-6": "Alkaline phosphatase [Enzymatic activity/volume] in Serum or Plasma",
    "2324-2": "Gamma glutamyl transferase [Enzymatic activity/volume] in Serum or Plasma",
    "17861-6": "Calcium [Mass/volume] in Serum or Plasma",
    // ── Lipid panel ──────────────────────────────────
    "2093-3": "Cholesterol [Mass/volume] in Serum or Plasma",
    "2571-8": "Triglyceride [Mass/volume] in Serum or Plasma",
    "2085-9": "Cholesterol in HDL [Mass/volume] in Serum or Plasma",
    "13457-7": "Cholesterol in LDL [Mass/volume] in Serum or Plasma by calculation",
    // ── Thyroid / hormones ───────────────────────────
    "3016-3": "Thyrotropin [Units/volume] in Serum or Plasma",
    "3024-7": "Thyroxine (T4) free [Mass/volume] in Serum or Plasma",
    "14920-3": "Thyroxine (T4) free [Moles/volume] in Serum or Plasma",
    "2986-8": "Testosterone [Mass/volume] in Serum or Plasma",
    "83098-4": "Follitropin [Units/volume] in Serum or Plasma by Immunoassay",
    "83096-8": "Estradiol (E2) [Mass/volume] in Serum or Plasma by Immunoassay",
    // ── Cardiac / inflammation ───────────────────────
    "10839-9": "Troponin I.cardiac [Mass/volume] in Serum or Plasma",
    "33762-6": "Natriuretic peptide.B prohormone N-Terminal [Mass/volume] in Serum or Plasma",
    "1988-5": "C reactive protein [Mass/volume] in Serum or Plasma",
    "33959-8": "Procalcitonin [Mass/volume] in Serum or Plasma",
    // ── Hepatitis / serology ─────────────────────────
    "5195-3": "Hepatitis B virus surface Ag [Presence] in Serum",
    "5196-1": "Hepatitis B virus surface Ag [Units/volume] in Serum",
    "16128-1": "Hepatitis C virus Ab [Presence] in Serum",
    "13955-0": "Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay",
    // ── Virology (audit 2026-05-19) ──────────────────
    "7853-5": "Cytomegalovirus IgM Ab [Units/volume] in Serum or Plasma",
    // ── Tumor markers / proteins (audit 2026-05-19) ──
    "1952-1": "Beta-2-Microglobulin [Mass/volume] in Serum or Plasma",
    // ── Blood type (v0.11.11 — ABO/Rh split from combined 882-1) ──
    "883-9": "ABO group [Type] in Blood",
    "10331-7": "Rh [Type] in Blood",
    "890-4": "Blood group antibody screen [Presence] in Serum or Plasma",
    // ── Coagulation ──────────────────────────────────
    "5902-2": "Prothrombin time (PT) in Platelet poor plasma by Coagulation assay",
    // v0.11.9 audit: previously labelled "Prothrombin time (PT) Control...".
    // loinc.org canonical is actually "Prothrombin time (PT) actual/Normal..."
    // (Component=Prothrombin time actual/Normal, Property=RelTime — a RATIO,
    // not a control reading). See PANEL_LOINC_MAP['08026C'] comment.
    "5894-1": "Prothrombin time (PT) actual/Normal in Platelet poor plasma by Coagulation assay",
    "6301-6": "INR in Platelet poor plasma by Coagulation assay",
    "14979-9": "aPTT in Platelet poor plasma by Coagulation assay",
    // v0.11.9 (SMART app dev report 2026-05-29): added APTT ratio LOINC.
    // 08036C bills both APTT (seconds, 14979-9) AND APTT ratio (63561-5) as
    // sub-rows; without per-LOINC display, the ratio row inherited APTT
    // time's display and looked like a fatal coagulation reading.
    "63561-5": "aPTT in Platelet poor plasma by Coagulation assay --actual/normal",
    "30240-6": "Fibrin D-dimer [Mass/volume] in Platelet poor plasma",
    // ── Body fluid (16008C panel members; v0.9.10) ───
    "26466-3": "Leukocytes [#/volume] in Body fluid by Manual count",
    "10328-6": "Neutrophils/100 leukocytes in Body fluid",
    "13046-8": "Lymphocytes [#/volume] in Body fluid",
    // ── SPE fractions (09065B; v0.10.0) ──────────────
    "2865-7": "Albumin [Mass/volume] in Serum or Plasma by Electrophoresis",
    "2867-3": "Globulin.alpha 1 [Mass/volume] in Serum or Plasma by Electrophoresis",
    "2868-1": "Globulin.alpha 2 [Mass/volume] in Serum or Plasma by Electrophoresis",
    "2869-9": "Globulin.beta [Mass/volume] in Serum or Plasma by Electrophoresis",
    "2871-5": "Globulin.gamma [Mass/volume] in Serum or Plasma by Electrophoresis",
    "1759-0": "Albumin/Globulin [Mass Ratio] in Serum or Plasma",
    // ── Flow cytometry CD (12204B; v0.10.0) ──────────
    "8124-0": "CD3 cells [#/area] in Blood",
    "8123-2": "CD4 cells [#/area] in Blood",
    "8128-1": "CD8 cells [#/area] in Blood",
    "8118-2": "CD19 cells [#/area] in Blood",
    "8125-7": "CD56 cells [#/area] in Blood",
    "8112-5": "CD16+CD56 cells [#/area] in Blood",
    "54218-3": "CD4/CD8 [Ratio] in Blood",
    // ── DLCO (17009B; v0.10.0) ───────────────────────
    "19850-7": "Alveolar volume [Volume]",
    "19911-7": "Transfer factor coefficient for carbon monoxide (DLCO/VA)",
    // ── Vital signs (IHKE3402) ───────────────────────
    "8302-2": "Body height",
    "29463-7": "Body weight",
    "39156-5": "Body mass index (BMI) [Ratio]",
    "8280-0": "Waist Circumference at umbilicus by Tape measure",
    "8480-6": "Systolic blood pressure",
    "8462-4": "Diastolic blood pressure",
    "85354-9": "Blood pressure panel with all children optional",
    // ── v0.12.0 legacy sweep (46 entries) ─────────────
    // All Long Common Names below WebFetch-verified at loinc.org
    // 2026-05-29 for the LOINCs already routed to by the bridge but
    // missing LOINC_DISPLAY entries. Without these, Coding.display fell
    // back to raw row display — FHIR R4 violation ("follow rules of the
    // system"). Audit during this sweep also found 6 incorrect mappings
    // + 1 invalid LOINC (2692-7) which were corrected in NHI_TO_LOINC
    // above (12184C / 22001C / 22015B / 22025B / 13025C / 13026C
    // unmapped; 08075C 2692-7 → 2692-2 typo fix).
    // CBC differential percentages
    "706-2": "Basophils/Leukocytes in Blood by Automated count",
    "713-8": "Eosinophils/Leukocytes in Blood by Automated count",
    "736-9": "Lymphocytes/Leukocytes in Blood by Automated count",
    "770-8": "Neutrophils/Leukocytes in Blood by Automated count",
    "5905-5": "Monocytes/Leukocytes in Blood by Automated count",
    // Tumor markers
    "1834-1": "Alpha-1-Fetoprotein [Mass/volume] in Serum or Plasma",
    "2039-6": "Carcinoembryonic Ag [Mass/volume] in Serum or Plasma",
    "2857-1": "Prostate specific Ag [Mass/volume] in Serum or Plasma",
    "10861-3": "Progesterone receptor [Mass/mass] in Tissue",
    "10886-0": "Prostate Specific Ag Free [Mass/volume] in Serum or Plasma",
    "24108-3": "Cancer Ag 19-9 [Units/volume] in Serum or Plasma",
    "83113-1": "Prostate Specific Ag Free [Mass/volume] in Serum or Plasma by Immunoassay",
    // Hepatitis / virology
    "5197-9": "Hepatitis B virus surface Ag [Presence] in Serum by Radioimmunoassay (RIA)",
    "14118-4": "Lactate [Mass/volume] in Serum or Plasma",
    "80383-3": "Influenza virus B Ag [Presence] in Upper respiratory specimen by Rapid immunoassay",
    "94558-4": "SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory system specimen by Rapid immunoassay",
    // Immunology / autoimmune
    "5048-4": "Nuclear Ab [Titer] in Serum by Immunofluorescence",
    // 5292-8 is canonically the VDRL LOINC; bridge maps NHI 12001C (RPR
    // billing) here because RPR + VDRL are clinically interchangeable
    // serology methods for the same anti-cardiolipin antibody. Display
    // follows the LOINC's own canonical name (VDRL) per FHIR R4.
    "5292-8": "Reagin Ab [Presence] in Serum by VDRL",
    "15189-4": "Kappa light chains/Lambda light chains [Mass Ratio] in Serum",
    // 16124-0 (Cryptococcus sp Ab) removed — it was only referenced by the
    // buggy 12056B mapping (see NHI_TO_LOINC); no NHI code legitimately maps
    // to it (12069B Cryptococcus Ag is left unmapped). 20483-4 is its
    // replacement: the correct AMA titer LOINC now used by 12056B.
    "20483-4": "Mitochondria Ab [Titer] in Serum",
    "17351-8": "Neutrophil cytoplasmic Ab [Presence] in Serum",
    "20584-9": "Leukocytes [#/volume] in Specimen by Automated count",
    "47286-0": "Differential panel - Bone marrow",
    "95801-7": "Immunoglobulin light chains.free and IFE panel - Urine",
    // Pathology / IHC
    "18474-7": "HER2 Ag [Presence] in Tissue by Immune stain",
    "14130-9": "Estrogen receptor [Moles/mass] in Tissue",
    "14196-0": "Reticulocytes [#/volume] in Blood",
    "35672-5": "Bilirubin.direct/Bilirubin.total in Serum or Plasma",
    "83052-1": "PD-L1 by clone 22C3 [Presence] in Tissue by Immune stain",
    // ABG / Pulmonary
    "24341-0": "Gas and Carbon Monoxide Panel - Arterial blood",
    "44596-5": "IgG Ag [Presence] in Skin by Immunofluorescence",
    // Chemistry (general)
    "1927-3": "Base excess in Venous blood by calculation",
    "1995-0": "Calcium.ionized [Moles/volume] in Serum or Plasma",
    // Ammonia (NHI 09037C) — both forms carried so LOINC_DISPLAY stays in
    // sync whichever ammoniaLoincFix() selects based on the row's unit.
    "22763-7": "Ammonia [Mass/volume] in Plasma",
    "16362-6": "Ammonia [Moles/volume] in Plasma",
    "14563-1": "Hemoglobin [Presence] in Stool from gastrointestinal --1st specimen",
    "2276-4": "Ferritin [Mass/volume] in Serum or Plasma",
    "2458-8": "IgA [Mass/volume] in Serum or Plasma",
    "2465-3": "IgG [Mass/volume] in Serum or Plasma",
    "2472-9": "IgM [Mass/volume] in Serum or Plasma",
    "2500-7": "Iron binding capacity [Mass/volume] in Serum or Plasma",
    "2692-2": "Osmolality of Serum or Plasma",
    // typo fix from 2692-7
    "2777-1": "Phosphate [Mass/volume] in Serum or Plasma",
    "2991-8": "Testosterone Free [Mass/volume] in Serum or Plasma",
    "3040-3": "Lipase [Enzymatic activity/volume] in Serum or Plasma",
    "19113-0": "IgE [Units/volume] in Serum or Plasma",
    "19123-9": "Magnesium [Mass/volume] in Serum or Plasma",
    // Stool / GI
    "58453-2": "Hemoglobin [Mass/volume] in Stool from gastrointestinal lower by Immunoassay",
    // Microbiology
    "600-7": "Bacteria identified in Blood by Culture",
    // SPE panel parent
    "90991-1": "Protein electrophoresis and M protein isotype panel - Serum or Plasma"
  };
  var LOINC_SHORT_TEXT = {
    // ── Coagulation panel (08036C / 08026C) ──────────
    "14979-9": "APTT",
    "63561-5": "APTT (ratio)",
    "5902-2": "PT",
    "6301-6": "INR",
    "5894-1": "PT (ratio)",
    // v0.11.9: 5894-1 is PT actual/normal RATIO
    // (Property=RelTime), NOT PT Control as previously (incorrectly) labelled.
    // See LOINC_DISPLAY comment for full audit trail.
    //
    // ── Single-analyte panels (v0.11.10) ─────────────
    // SMART app dev report 2026-05-29 Category B + C: bridge previously
    // shipped DR title and obs.text from two different sources for
    // these single-analyte panels — DR title from order_name (with NHI-
    // catalog method suffix like 「免疫分析」), obs.text from row display
    // (lab-shorthand or alternate Chinese). Unifying via LOINC_SHORT_TEXT
    // means both DR title and obs.text resolve to the same clean
    // clinical short name when the row's NHI code maps to one of these
    // LOINCs (via NHI_TO_LOINC path A).
    //
    // Each LOINC below verified via WebFetch loinc.org 2026-05-29 —
    // Component / Property / System / Method all confirmed appropriate
    // for the Taiwan NHI billing context:
    //   4548-4   Hemoglobin A1c/Hemoglobin.total, MFr, Blood (NGSP %; Taiwan default)
    //   1975-2   Bilirubin total, MCnc, Ser/Plas
    //   10839-9  Troponin I.cardiac, MCnc, Ser/Plas
    //   13457-7  Cholesterol in LDL (calculated), MCnc, Ser/Plas
    //   3016-3   Thyrotropin (TSH), ACnc, Ser/Plas
    //   2143-6   Cortisol, MCnc, Ser/Plas
    //   2132-9   Cobalamin (Vitamin B12), MCnc, Ser/Plas
    //   2284-8   Folate, MCnc, Ser/Plas
    //   83112-3  Prostate specific Ag, MCnc, Ser/Plas, IA (covers EIA/LIA both)
    "4548-4": "HbA1c",
    // NHI 09006C (was: DR "醣化血紅素" / obs "Hb-A1c")
    "1975-2": "Total Bilirubin",
    // NHI 09029C (was: DR "膽紅素總量" / obs "全膽紅素")
    "10839-9": "Troponin I",
    // NHI 09099C (was: DR "心肌旋轉蛋白Ｉ" fullwidth)
    "13457-7": "LDL-C",
    // NHI 09044C (was: DR "低密度脂蛋白－膽固醇" / obs "LDL-C(direct)")
    "3016-3": "TSH",
    // NHI 09112C (was: DR "甲狀腺刺激素免疫分析" / obs "甲狀腺刺激素")
    "2143-6": "Cortisol",
    // NHI 09113C (was: DR "皮質素免疫分析")
    "2132-9": "Vitamin B12",
    // NHI 09129C (was: DR "維生素B12免疫分析")
    "2284-8": "Folate",
    // NHI 09130C (was: DR "葉酸免疫分析")
    "83112-3": "PSA",
    // NHI 12081C (was: DR "攝護腺特異抗原(EIA/LIA法)")
    // v0.12.1 (SMART app dev bug 8' 2026-05-29): urine total protein
    // observations had DR title "全蛋白" (ambiguous NHI catalog name —
    // can mean serum or urine total protein) while the obs itself was
    // correctly LOINC 20454-5 (Protein Mass/Vol in Urine). Clinicians
    // reading the DR header assumed serum TP. Clean short text resolves
    // both DR title and obs.code.text to "Urine Protein" — disambiguating
    // the specimen explicitly. LOINC_DISPLAY[20454-5] already correctly
    // reads "Protein Mass/Vol in Urine" (catalog-faithful, FHIR R4 OK).
    "20454-5": "Urine Protein",
    // v0.12.2: quantitative urine protein. Same clean label as the
    // qualitative twin so SMART app per-LOINC pivot shows both under
    // the same column header "Urine Protein"; the LOINC code itself
    // disambiguates which scale (Ord vs Qn) downstream consumers see.
    "2888-6": "Urine Protein",
    // v0.13 — CBC sub-analytes (08011C / 08013C) ─────────
    // App dev (MediPrisma) soft request 2026-05-30: bridge ships these
    // 12 CBC LOINCs but `obs.code.text` varies (Hb / 血色素 / Hemoglobin /
    // HGB depending on hospital LIS). SMART apps doing cross-hospital
    // trend display need to maintain an alias table to merge them. With
    // SHORT_TEXT entries here PLUS the clean-match gate in
    // mapObservation / buildObservation (CBC_CANONICAL_TEXT_LOINCS check
    // → only canonicalize when findLoincDetailed.cleanMatch === true),
    // app-side alias table can retire.
    //
    // Mis-tag canary preservation: when a CBC panel sub-row's display
    // doesn't match any PANEL_LOINC_MAP["08011C"] key explicitly, the
    // row falls to the panel-default LOINC via findLoinc path C
    // (cleanMatch=false). In that case the raw display is preserved as
    // obs.code.text — letting downstream reviewers spot the mis-tag.
    // This is the lesson from v0.11.9 Bug 6 (帶狀嗜中性白血球 silently
    // routed to 770-8 panel default before the variant key was added).
    //
    // Short labels chosen to match clinical convention (Taiwan EHR
    // standard column headers). NOT LOINC's verbose long name — that
    // already lives in coding[loinc].display per LOINC_DISPLAY.
    "770-8": "Neutrophils %",
    "736-9": "Lymphocytes %",
    "5905-5": "Monocytes %",
    "713-8": "Eosinophils %",
    "706-2": "Basophils %",
    "4544-3": "HCT",
    "718-7": "Hb",
    "777-3": "Platelet",
    "787-2": "MCV",
    "786-4": "MCHC",
    "788-0": "RDW",
    "789-8": "RBC"
  };
  var CBC_CANONICAL_TEXT_LOINCS = /* @__PURE__ */ new Set([
    "770-8",
    "736-9",
    "5905-5",
    "713-8",
    "706-2",
    "4544-3",
    "718-7",
    "777-3",
    "787-2",
    "786-4",
    "788-0",
    "789-8"
  ]);
  var NHI_CODE_PANEL_NAME = {
    // v0.11.10 FHIR R4 compliance audit (2026-05-29): values must match
    // the NHI catalog's authoritative panel name verbatim — this map is
    // also consulted by `buildCodings` as the fallback for
    // `Observation.code.coding[nhi].display` when `raw.order_name` is
    // missing, and Coding.display per FHIR R4 must "follow the rules of
    // the system". Treating my paraphrase ("ABO 血型測定") as the NHI
    // catalog name would be wrong on both counts (FHIR semantic + faithful
    // transport). NHI 健保 catalog formal names confirmed via the SMART
    // app dev's bug report enumeration of observed DR titles.
    "11001C": "ABO\u8840\u578B\u6E2C\u5B9A\u6AA2\u9A57",
    "11003C": "RH\uFF08D\uFF09\u578B\u6AA2\u9A57",
    "11004C": "\u6297\u9AD4\u53CD\u61C9 (\u4E0D\u898F\u5247\u6297\u9AD4)"
  };

  // ../packages/mapper/src/parsers.ts
  var UCUM_SYSTEM = "http://unitsofmeasure.org";
  var FULLWIDTH_OPS = [
    ["\uFF1E", ">"],
    ["\uFF1C", "<"],
    ["\u2267", ">="],
    ["\u2266", "<="],
    ["\u2265", ">="],
    ["\u2264", "<="]
  ];
  function translateFullwidth(s) {
    let out = s;
    for (const [from, to] of FULLWIDTH_OPS) {
      if (out.includes(from)) {
        out = out.split(from).join(to);
      }
    }
    return out;
  }
  var COMPARATOR_RE = /^\s*(<=|>=|<|>)\s*(.+)$/;
  var RR_LOWHIGH_BRACKETS = /^\s*\[\s*([^\]]*)\s*\]\s*\[\s*([^\]]*)\s*\]\s*$/;
  var RR_DASH_RANGE = /(-?\d+(?:\.\d+)?)\s*[-~–]\s*(-?\d+(?:\.\d+)?)/;
  var RR_COMPARATOR = /^\s*(<=|>=|<|>)\s*(-?\d+(?:\.\d+)?)\s*$/;
  var RR_SEX_NUM_G = /(男性|女性|男|女|M|F)\s*[:：]?\s*(?:[<>≧≦]=?)?\s*(-?\d+(?:\.\d+)?)/g;
  var RR_SINGLE_BRACKET = /^\s*\[\s*(.+?)\s*\]\s*$/;
  var RR_QUALITATIVE_PAREN = /^\s*(Normal|正常|Nonreactive|Non-reactive)\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)\s*$/i;
  var SEX_TO_FHIR = {
    \u7537\u6027: ["male", "Male"],
    \u7537: ["male", "Male"],
    M: ["male", "Male"],
    \u5973\u6027: ["female", "Female"],
    \u5973: ["female", "Female"],
    F: ["female", "Female"]
  };
  var UCUM_OVERRIDES = {
    // Fullwidth → ASCII
    "\uFF05": "%",
    // Case-sensitive UCUM (Eq is 'eq', not 'Eq')
    "mEq/L": "meq/L",
    "meq/l": "meq/L",
    // BP profile fixed-value: mm[Hg] not mmHg
    mmHg: "mm[Hg]",
    MMHG: "mm[Hg]",
    // Common Chinese 'no unit' placeholders → drop UCUM code
    \u7121: null,
    "": null,
    "\u2014": null,
    "-": null
  };
  function toUcum(unit) {
    if (!unit)
      return null;
    if (Object.prototype.hasOwnProperty.call(UCUM_OVERRIDES, unit)) {
      return UCUM_OVERRIDES[unit] ?? null;
    }
    return unit;
  }
  function makeQuantity(value, unit) {
    const q = { value };
    if (unit) {
      q.unit = unit;
      q.system = UCUM_SYSTEM;
      q.code = unit;
    }
    return q;
  }
  function tryParseFloat(s) {
    if (s === "" || s == null)
      return null;
    const trimmed = s.trim();
    if (trimmed === "")
      return null;
    const n = Number(trimmed);
    if (Number.isNaN(n))
      return null;
    return n;
  }
  function parseRangeMulti(rawRange, unit) {
    const s = translateFullwidth((rawRange || "").trim());
    if (!s)
      return [];
    const lowBySex = {};
    const highBySex = {};
    let usedMulti = false;
    const m = s.match(RR_LOWHIGH_BRACKETS);
    if (m) {
      const lowBlob = m[1] ?? "";
      const highBlob = m[2] ?? "";
      for (const sm of lowBlob.matchAll(RR_SEX_NUM_G)) {
        if (sm[1] && sm[2])
          lowBySex[sm[1]] = sm[2];
      }
      for (const sm of highBlob.matchAll(RR_SEX_NUM_G)) {
        if (sm[1] && sm[2])
          highBySex[sm[1]] = sm[2];
      }
      usedMulti = Object.keys(lowBySex).length > 0 || Object.keys(highBySex).length > 0;
    } else {
      const single = s.match(RR_SINGLE_BRACKET);
      if (single) {
        const inner = single[1] ?? "";
        for (const sm of inner.matchAll(RR_SEX_NUM_G)) {
          const sexKey = sm[1] ?? "";
          const valStr = sm[2] ?? "";
          const pat = new RegExp(`${escapeRegex(sexKey)}\\s*[:\uFF1A]?\\s*([<>\u2267\u2266]=?)?\\s*-?\\d`);
          const cm = inner.match(pat);
          const op = cm?.[1] ?? "";
          if (op === ">" || op === ">=") {
            lowBySex[sexKey] = valStr;
          } else if (op === "<" || op === "<=") {
            highBySex[sexKey] = valStr;
          } else {
            lowBySex[sexKey] = valStr;
          }
        }
        usedMulti = Object.keys(lowBySex).length > 0 || Object.keys(highBySex).length > 0;
      }
    }
    if (usedMulti) {
      const entries = [];
      const allSexKeys = [];
      for (const k of [...Object.keys(lowBySex), ...Object.keys(highBySex)]) {
        if (!allSexKeys.includes(k))
          allSexKeys.push(k);
      }
      for (const sexKey of allSexKeys) {
        const mapping = SEX_TO_FHIR[sexKey];
        if (!mapping)
          continue;
        const [fhirCode, fhirDisplay] = mapping;
        const entry = {
          text: rawRange,
          appliesTo: [
            {
              coding: [
                {
                  system: "http://hl7.org/fhir/administrative-gender",
                  code: fhirCode,
                  display: fhirDisplay
                }
              ],
              text: fhirDisplay
            }
          ]
        };
        if (sexKey in lowBySex) {
          const v = tryParseFloat(lowBySex[sexKey]);
          if (v !== null)
            entry.low = makeQuantity(v, unit);
        }
        if (sexKey in highBySex) {
          const v = tryParseFloat(highBySex[sexKey]);
          if (v !== null)
            entry.high = makeQuantity(v, unit);
        }
        entries.push(entry);
      }
      if (entries.length > 0) {
        const seen = /* @__PURE__ */ new Set();
        const out = [];
        for (const e of entries) {
          const c = e.appliesTo?.[0]?.coding?.[0]?.code;
          if (!c || seen.has(c))
            continue;
          seen.add(c);
          out.push(e);
        }
        return out;
      }
    }
    const one = parseRange(rawRange, unit);
    return one ? [one] : [];
  }
  function parseRange(rawRange, unit) {
    const s = translateFullwidth((rawRange || "").trim());
    if (!s)
      return null;
    if (_looksLikeInterpretationText(s)) {
      return { text: rawRange, interpretationText: s };
    }
    const entry = { text: rawRange };
    const m = s.match(RR_LOWHIGH_BRACKETS);
    if (m) {
      const lo = (m[1] ?? "").trim();
      const hi = (m[2] ?? "").trim();
      const isHiEmpty = !hi || hi === "\u7121" || hi === "\u7A7A\u767D";
      const isLoEmpty = !lo || lo === "\u7121" || lo === "\u7A7A\u767D";
      if (hi && isLoEmpty) {
        const spec = _tryExtractSpecimenThreshold(hi, unit);
        if (spec)
          return { text: rawRange, ...spec };
      }
      if (lo && isHiEmpty) {
        const spec = _tryExtractSpecimenThreshold(lo, unit);
        if (spec)
          return { text: rawRange, ...spec };
      }
      if (lo && !_looksNumericLike(lo) && isHiEmpty) {
        return { text: lo };
      }
      if (hi && !_looksNumericLike(hi) && isLoEmpty) {
        return { text: hi };
      }
      for (const [side, sideVal] of [
        ["low", lo],
        ["high", hi]
      ]) {
        if (!sideVal || sideVal === "\u7121" || sideVal === "\u7A7A\u767D")
          continue;
        const asFloat = tryParseFloat(sideVal);
        if (asFloat !== null) {
          entry[side] = makeQuantity(asFloat, unit);
          continue;
        }
        const dm = sideVal.match(RR_DASH_RANGE);
        if (dm && side === "low" && entry.high === void 0) {
          const v1 = tryParseFloat(dm[1]);
          const v2 = tryParseFloat(dm[2]);
          if (v1 !== null && v2 !== null) {
            entry.low = makeQuantity(v1, unit);
            entry.high = makeQuantity(v2, unit);
            continue;
          }
        }
        const cm = sideVal.match(RR_COMPARATOR);
        if (cm) {
          const v = tryParseFloat(cm[2]);
          if (v !== null) {
            const op = cm[1];
            if (op === ">" || op === ">=") {
              entry.low = makeQuantity(v, unit);
            } else {
              entry.high = makeQuantity(v, unit);
            }
            continue;
          }
        }
        const qm = sideVal.match(RR_QUALITATIVE_PAREN);
        if (qm) {
          const v = tryParseFloat(qm[2]);
          if (v !== null) {
            entry.high = makeQuantity(v, unit);
          }
        }
      }
      return entry;
    }
    const dashMatch = s.match(RR_DASH_RANGE);
    if (dashMatch) {
      const v1 = tryParseFloat(dashMatch[1]);
      const v2 = tryParseFloat(dashMatch[2]);
      if (v1 !== null && v2 !== null) {
        entry.low = makeQuantity(v1, unit);
        entry.high = makeQuantity(v2, unit);
      }
      return entry;
    }
    const cmpMatch = s.match(RR_COMPARATOR);
    if (cmpMatch) {
      const v = tryParseFloat(cmpMatch[2]);
      if (v !== null) {
        const op = cmpMatch[1];
        if (op === ">" || op === ">=") {
          entry.low = makeQuantity(v, unit);
        } else {
          entry.high = makeQuantity(v, unit);
        }
      }
      return entry;
    }
    return entry;
  }
  function tryParseQuantity(rawValue, unit) {
    if (rawValue === null || rawValue === void 0)
      return null;
    let s = translateFullwidth(String(rawValue).trim());
    let comparator = null;
    const cm = s.match(COMPARATOR_RE);
    if (cm) {
      comparator = cm[1] ?? null;
      s = (cm[2] ?? "").trim();
    }
    let v = tryParseFloat(s.replace(/,/g, ""));
    if (v === null) {
      const parenIdx = s.indexOf("(");
      if (parenIdx > 0) {
        const leading = s.slice(0, parenIdx).trim().replace(/,/g, "");
        v = tryParseFloat(leading);
        if (v === null && /^(?:[\d.]+\+|trace|positive|negative)/i.test(leading)) {
          return null;
        }
      }
      if (v === null) {
        const m = s.match(/\(\s*([+\-\d.,]+)\s*\)/);
        if (m && m[1]) {
          v = tryParseFloat(m[1].replace(/,/g, ""));
        }
      }
    }
    if (v === null)
      return null;
    const ucumCode = toUcum(unit);
    const qty = {
      value: v,
      system: UCUM_SYSTEM
    };
    if (unit) {
      qty.unit = unit;
    }
    if (ucumCode !== null) {
      qty.code = ucumCode;
    }
    if (comparator) {
      qty.comparator = comparator;
    }
    return qty;
  }
  function _looksLikeInterpretationText(s) {
    const t = s.trim();
    if (!t)
      return false;
    if (t === "\u6B63\u5E38" || t === "\u7570\u5E38" || t === "\u967D\u6027" || t === "\u9670\u6027")
      return true;
    if (t.startsWith("["))
      return false;
    if (t.includes("-") || t.includes("~") || /[<>≦≧≤≥]/.test(t))
      return false;
    return t.includes("\u5EFA\u8B70") || t.includes("\u8ACB\u6D3D\u8A62") || t.includes("\u8ACB\u806F\u7D61") || t.includes("\u898B\u5099\u8A3B");
  }
  function _looksNumericLike(s) {
    return /\d/.test(s) || /[<>≦≧≤≥]/.test(s);
  }
  function _tryExtractSpecimenThreshold(s, unit) {
    const m = s.match(/^([^<>≦≧≤≥]+?)\s*([<>≦≧≤≥]=?)\s*([\d.]+)$/);
    if (!m)
      return null;
    const specimen = (m[1] ?? "").trim();
    const op = (m[2] ?? "").trim();
    const v = tryParseFloat(m[3] ?? "");
    if (!specimen || v === null)
      return null;
    const result = {
      appliesTo: [{ text: specimen }]
    };
    if (op === ">" || op === "\u2267" || op === "\u2265" || op === ">=") {
      result.low = makeQuantity(v, unit);
    } else {
      result.high = makeQuantity(v, unit);
    }
    return result;
  }
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // ../packages/mapper/src/observation.ts
  var QC_CONTROL_PATTERNS = [
    /\bnor\.?\s*plasma\b/i,
    // Nor.plasma / Nor plasma / Norplasma
    /\bnormal\s+plasma\b/i,
    /\babn\.?\s*plasma\b/i,
    // Abn.plasma
    /\babnormal\s+plasma\b/i,
    /\bcontrol\s+(mean|plasma)\b/i,
    // "Control mean" / "Control plasma"
    /\bqc\s+(mean|control|plasma)\b/i,
    /對照血漿/,
    /控制血漿/,
    // v0.11.9 (SMART app dev report 2026-05-29): broaden from /正常血漿平均/
    // → /正常血漿.*平均/ so we catch '正常血漿APTT平均值' / '正常血漿PT平均值'
    // variants where the analyte name is wedged between '正常血漿' prefix
    // and '平均' suffix. Original literal pattern only matched bare
    // '正常血漿平均' (no analyte token in the middle).
    /正常血漿.*平均/
  ];
  function looksLikeQcControl(display) {
    if (!display)
      return false;
    return QC_CONTROL_PATTERNS.some((re) => re.test(display));
  }
  var QUALITY_FLAG_PATTERNS = [
    /^溶血\s*$/,
    // 溶血 (hemolysis)
    /^脂血\s*$/,
    // 脂血 (lipemia)
    /^黃疸\s*$/,
    // 黃疸 (icterus)
    /^hemoly[sz]is\s*$/i,
    /^lipemia\s*$/i,
    /^icteric?\s*$/i,
    /^icterus\s*$/i
  ];
  var NARRATIVE_ROW_PATTERNS = [
    /^[\s:：;；,，.。\-—－]+$/,
    // pure punctuation (incl. fullwidth)
    /comment\b/i,
    /\bnote\b/i,
    /^備註/,
    // 備註 (note)
    /^註\s*[:：]/
  ];
  function looksLikeQualityFlag(display) {
    if (!display)
      return false;
    return QUALITY_FLAG_PATTERNS.some((re) => re.test(display));
  }
  function looksLikeNarrativeRow(display) {
    if (!display)
      return false;
    return NARRATIVE_ROW_PATTERNS.some((re) => re.test(display));
  }
  function normalizeFullwidth(s) {
    if (!s)
      return "";
    return String(s).replace(
      /[！-～]/g,
      (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248)
    );
  }
  var NHI_LAB_CODE_RE = /^\d{4,6}[A-Z]$/;
  function isAsciiOnly(s) {
    for (let i = 0; i < s.length; i++) {
      if (s.charCodeAt(i) > 127)
        return false;
    }
    return true;
  }
  function escapeRegex2(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function _keywordMatches(key, combined) {
    const k = key.toLowerCase();
    if (isAsciiOnly(key)) {
      return new RegExp(`\\b${escapeRegex2(k)}\\b`).test(combined);
    }
    return combined.includes(k);
  }
  function _findLongestMatch(combined, table) {
    let bestLoinc = null;
    let bestKeyLen = 0;
    for (const [key, loinc] of Object.entries(table)) {
      if (key.length > bestKeyLen && _keywordMatches(key, combined)) {
        bestLoinc = loinc;
        bestKeyLen = key.length;
      }
    }
    return bestLoinc;
  }
  function findLoincDetailed(code, display) {
    if (code && code in NHI_TO_LOINC && !DISPLAY_FIRST_CODES.has(code)) {
      return { loinc: NHI_TO_LOINC[code] ?? null, cleanMatch: true };
    }
    const combined = `${code} ${display}`.toLowerCase();
    if (code in PANEL_LOINC_MAP) {
      const hit2 = _findLongestMatch(combined, PANEL_LOINC_MAP[code]);
      if (hit2)
        return { loinc: hit2, cleanMatch: true };
    }
    const hit = _findLongestMatch(combined, LOINC_MAP);
    if (hit)
      return { loinc: hit, cleanMatch: true };
    if (code && code in NHI_TO_LOINC) {
      return { loinc: NHI_TO_LOINC[code] ?? null, cleanMatch: false };
    }
    return { loinc: null, cleanMatch: false };
  }
  function buildCodings(code, display, loinc, nhiPanelName) {
    const codings = [];
    if (loinc) {
      codings.push({
        system: "http://loinc.org",
        code: loinc,
        display: LOINC_DISPLAY[loinc] ?? display
      });
    }
    const codeStr = (code ?? "").trim();
    if (codeStr && NHI_LAB_CODE_RE.test(codeStr)) {
      codings.push({
        system: NHI_MEDICAL_ORDER_CODE,
        code: codeStr,
        display: nhiPanelName || display
      });
    } else {
      codings.push({
        system: HIS_LOCAL_LAB_CODE,
        code: codeStr || display,
        display
      });
    }
    return codings;
  }
  var INTERP_SYS = "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation";
  function interpCoding(code, display) {
    return { system: INTERP_SYS, code, display };
  }
  var INTERP_TABLE = {
    high: ["H", "High"],
    low: ["L", "Low"],
    normal: ["N", "Normal"],
    critical: ["AA", "Critical abnormal"],
    abnormal: ["A", "Abnormal"],
    positive: ["POS", "Positive"],
    negative: ["NEG", "Negative"]
  };
  function mapInterpretation(interp) {
    const key = (interp ?? "").toLowerCase();
    const entry = INTERP_TABLE[key];
    if (!entry)
      return null;
    return interpCoding(entry[0], entry[1]);
  }
  var POS_MARKERS = /^\s*(?:positive|pos|reactive|detected|abnormal|present|trace|[1-4]?\s*\+(?:\s*[\+\-])*)\s*(?:\(.*\))?\s*$/i;
  var NEG_MARKERS = /^\s*(?:negative|neg|nonreactive|non[-\s]?reactive|not[-\s]?detected|nd|absent|none|normal|0|[-—–]+)\s*(?:\(.*\))?\s*$/i;
  function classifyQualitative(text) {
    if (text === null || text === void 0)
      return null;
    let s = String(text).trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      s = s.slice(1, -1).trim();
    }
    if (!s)
      return null;
    if (NEG_MARKERS.test(s))
      return "neg";
    if (POS_MARKERS.test(s))
      return "pos";
    return null;
  }
  function deriveInterpretation(valueRaw, qty, rr) {
    if (qty && typeof qty.value === "number" && rr) {
      const v = qty.value;
      const lo = rr.low?.value;
      const hi = rr.high?.value;
      if (typeof hi === "number" && v > hi)
        return interpCoding("H", "High");
      if (typeof lo === "number" && v < lo)
        return interpCoding("L", "Low");
      if (typeof lo === "number" || typeof hi === "number")
        return interpCoding("N", "Normal");
      return null;
    }
    const valKind = classifyQualitative(valueRaw);
    const refText = rr?.text ?? "";
    const refKind = classifyQualitative(refText);
    if (valKind === null)
      return null;
    if (refKind === "neg") {
      if (valKind === "pos")
        return interpCoding("A", "Abnormal");
      if (valKind === "neg")
        return interpCoding("N", "Normal");
    }
    return valKind === "pos" ? interpCoding("POS", "Positive") : interpCoding("NEG", "Negative");
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
  function canonicalLabKey(display, code) {
    if (!display)
      return "";
    const s = display.trim();
    if (!s)
      return "";
    const sUpper = s.toUpperCase();
    if (code) {
      const codeUpper = code.toUpperCase();
      const scoped = CODE_SCOPED_SYNONYMS[codeUpper];
      if (scoped) {
        if (scoped[sUpper])
          return scoped[sUpper];
        if (scoped[s])
          return scoped[s];
        for (const key of CODE_SCOPED_CJK_KEYS_SORTED[codeUpper] ?? []) {
          if (s.includes(key))
            return scoped[key];
        }
      }
    }
    for (const key of LAB_SYNONYM_KEYS_SORTED) {
      const ku = key.toUpperCase();
      if (isAsciiOnly(ku)) {
        if (new RegExp(`\\b${escapeRegex2(ku)}`).test(sUpper)) {
          return LAB_SYNONYMS[key];
        }
      } else if (sUpper.includes(ku)) {
        return LAB_SYNONYMS[key];
      }
    }
    return s.toLowerCase().replace(/\s+/g, " ").trim();
  }
  function cjkChars2(s) {
    if (!s)
      return 0;
    let n = 0;
    for (const ch of s) {
      const cp = ch.codePointAt(0) ?? 0;
      if (cp >= 19968 && cp <= 40959)
        n++;
    }
    return n;
  }
  function isEnglishDominant(s) {
    let latin = 0;
    for (const ch of s) {
      const cp = ch.charCodeAt(0);
      if (cp < 128 && /[A-Za-z]/.test(ch))
        latin++;
    }
    return latin >= 2 && cjkChars2(s) === 0;
  }
  function normalizeValueForDedup(v) {
    if (v === null || v === void 0)
      return "";
    let s = String(v).trim().toLowerCase();
    s = s.replace(/\([^)]*\)/g, "").trim();
    s = s.replace(/\s+/g, " ");
    return s;
  }
  function isMeaningfulValue(value) {
    if (value === null || value === void 0)
      return false;
    const s = String(value).trim();
    return s !== "" && s !== "\u2014" && s !== "-" && s !== "N/A" && s !== "null";
  }
  var PLACEHOLDER_UNIT_RE = /^(?:空白空白|空白|n\/a|n\.a\.?|nil|無|null|none|未|—|–|-{1,3})$/i;
  function _canonicalizeUnit(display, _code, rawUnit) {
    let u = (rawUnit ?? "").trim();
    if (PLACEHOLDER_UNIT_RE.test(u)) {
      u = "";
    }
    const isBogus = u === "" || u === "N" || u === "n";
    if (isBogus) {
      if (/egfr|estimated\s*gfr|estimated\s*glomerular|腎絲球過濾率/i.test(display)) {
        return "mL/min/1.73m2";
      }
      return u;
    }
    let normalized = u;
    normalized = normalized.replace(/㎡/g, "m2").replace(/㎝/g, "cm").replace(/㎠/g, "mm").replace(/㎢/g, "km");
    normalized = normalized.replace(/\bgm(\s*\/)/gi, "g$1");
    normalized = normalized.replace(/\/d[lL]\.?/g, "/dL");
    normalized = normalized.replace(/\/(\d*)l\b/g, "/$1L");
    if (normalized === "\u500D\u6578" || normalized === "\u500D") {
      return "{ratio}";
    }
    return normalized;
  }
  var MEANINGFUL_INTERPS = /* @__PURE__ */ new Set([
    "normal",
    "abnormal",
    "high",
    "low",
    "critical",
    "positive",
    "negative"
  ]);
  function dedupePanelItems(items) {
    const byKey = /* @__PURE__ */ new Map();
    for (const it of items) {
      const k = `${normalizeValueForDedup(it.value)}|${String(it.display ?? "").toLowerCase().trim()}`;
      const group = byKey.get(k);
      if (group)
        group.push(it);
      else
        byKey.set(k, [it]);
    }
    const out = [];
    for (const group of byKey.values()) {
      if (group.length === 1) {
        out.push(group[0]);
        continue;
      }
      const cjkItems = group.filter((g) => cjkChars2(String(g.display ?? "")) >= 2);
      const enItems = group.filter((g) => isEnglishDominant(String(g.display ?? "")));
      if (cjkItems.length > 0 && enItems.length > 0) {
        out.push(enItems[0]);
      } else {
        out.push(...group);
      }
    }
    return out;
  }
  function filterLabRows(rawItems) {
    const out = [];
    for (const raw of rawItems) {
      if (!raw || typeof raw !== "object")
        continue;
      const display = raw.display || raw.code || "";
      if (looksLikeQcControl(String(display)))
        continue;
      if (looksLikeQualityFlag(String(display)))
        continue;
      if (looksLikeNarrativeRow(String(display)))
        continue;
      const value = raw.value;
      const interp = (raw.interpretation ?? "").toString().toLowerCase();
      const hasValue = isMeaningfulValue(value);
      const hasMeaningfulInterp = MEANINGFUL_INTERPS.has(interp);
      if (!hasValue && !hasMeaningfulInterp)
        continue;
      out.push(raw);
    }
    return out;
  }
  function dedupNhiCrossChannelPairs(items) {
    const groups = /* @__PURE__ */ new Map();
    const order = [];
    for (const item of items) {
      const code = String(item.code ?? item.order_code ?? "").trim();
      const date = String(item.date ?? "").trim();
      const hospital = String(item.hospital ?? "").trim();
      const value = String(item.value ?? "").trim();
      const display = String(item.display ?? "").trim();
      const { loinc } = findLoincDetailed(code, display);
      const key = `${code}|${loinc ?? "_"}|${date}|${hospital}|${value}`;
      if (!groups.has(key)) {
        groups.set(key, []);
        order.push(key);
      }
      groups.get(key).push(item);
    }
    const out = [];
    for (const key of order) {
      const group = groups.get(key);
      if (group.length < 2) {
        out.push(...group);
        continue;
      }
      const aRows = group.filter(
        (r) => String(r.nhi_source_channel ?? "").toUpperCase() === "A"
      );
      const bRows = group.filter(
        (r) => String(r.nhi_source_channel ?? "").toUpperCase() === "B"
      );
      if (aRows.length > 0 && bRows.length > 0) {
        out.push(...aRows);
      } else {
        out.push(...group);
      }
    }
    return out;
  }
  function dedupeCrossFormat(items) {
    const orderCode = (it) => (it.order_code ?? "").trim().toUpperCase();
    const byKey = /* @__PURE__ */ new Map();
    let idxCounter = 0;
    for (const item of items) {
      const v = String(item.value ?? "").trim();
      const rawUnit = (item.unit ?? "").trim();
      const unit = rawUnit;
      if (!v) {
        byKey.set(`__no_dedup__|${idxCounter++}`, item);
        continue;
      }
      const key = [
        item.date ?? "",
        v.toLowerCase(),
        unit.toLowerCase(),
        orderCode(item),
        String(item.display ?? "").toLowerCase().trim()
      ].join("|");
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, item);
        continue;
      }
      let primary;
      let secondary;
      if (cjkChars2(item.display ?? "") < cjkChars2(existing.display ?? "")) {
        primary = item;
        secondary = existing;
      } else {
        primary = existing;
        secondary = item;
      }
      const merged = { ...primary };
      for (const f of ["order_code", "order_name", "hospital", "code"]) {
        if (!merged[f] && secondary[f])
          merged[f] = secondary[f];
      }
      byKey.set(key, merged);
    }
    return Array.from(byKey.values());
  }
  function combineBpItems(items) {
    const byKey = /* @__PURE__ */ new Map();
    const passThrough = [];
    for (const it of items) {
      const disp = String(it.display ?? "").toLowerCase();
      const key = `${it.date ?? ""}|${it.hospital ?? ""}`;
      if (disp.includes("systolic blood pressure")) {
        const v = byKey.get(key) ?? {};
        v.systolic = it;
        byKey.set(key, v);
      } else if (disp.includes("diastolic blood pressure")) {
        const v = byKey.get(key) ?? {};
        v.diastolic = it;
        byKey.set(key, v);
      } else {
        passThrough.push(it);
      }
    }
    for (const parts of byKey.values()) {
      const s = parts.systolic;
      const d = parts.diastolic;
      const primary = s ?? d;
      if (!primary)
        continue;
      const components = [];
      const tryAdd = (src, loinc, display) => {
        if (!src)
          return;
        const val = src.value;
        if (val === null || val === void 0 || val === "" || val === "-" || val === "\u2014")
          return;
        const num = Number.parseFloat(String(val).replace(/,/g, ""));
        if (!Number.isFinite(num))
          return;
        components.push({
          loinc,
          display,
          value: num,
          unit: src.unit || "mmHg",
          interpretation_text: src.reference_range || ""
        });
      };
      tryAdd(s, "8480-6", "Systolic blood pressure");
      tryAdd(d, "8462-4", "Diastolic blood pressure");
      if (components.length === 0)
        continue;
      const combined = { ...primary };
      combined.display = "Blood Pressure";
      combined.code = "";
      combined.order_code = "";
      combined.order_name = "Blood Pressure";
      combined.category = "vital-signs";
      combined.bp_components = components;
      combined.bp_panel_loinc = "85354-9";
      combined.value = void 0;
      combined.unit = void 0;
      passThrough.push(combined);
    }
    return passThrough;
  }
  var URINE_MARKERS_RE = /尿液|尿道|尿沉渣|尿沈渣|尿生化|尿常規|尿液檢查|尿糖|尿蛋白|尿細胞|尿酮體?|尿膽紅素|尿膽素原|尿微量白蛋白|尿白蛋白|尿微白蛋白|小便|\(尿(?:液)?\)|urinaly|urinal|\burine\b|u-malb|u-acr|u-cre|u-mab|u-pcr/i;
  var OTHER_SPECIMEN_RULES = [
    [/糞|便潛血|stool|fecal|faecal|occult\s*blood/i, "Stool"],
    [/痰|sputum/i, "Sputum"],
    [/腦脊液|csf|cerebrospinal/i, "Cerebrospinal fluid"],
    [/胸水|pleural/i, "Pleural fluid"],
    [/腹水|ascites|peritoneal/i, "Peritoneal fluid"],
    [/陰道|抹片|cervical|pap\s*smear|vaginal/i, "Cervical/Vaginal"],
    [/關節液|synovial|joint\s*fluid/i, "Synovial fluid"],
    [/羊水|amniotic/i, "Amniotic fluid"],
    [/骨髓|bone\s*marrow/i, "Bone marrow"]
  ];
  var NHI_CODE_PREFIX_SPECIMEN = {
    "06": "Urine",
    // 06013C 尿生化檢查 / 06014C 尿沉渣 / urinalysis family
    "08": "Blood",
    // 08003C 血色素 / 08004C HCT / 08011C CBC / 08013C diff
    "09": "Blood",
    // Chemistry — vast majority blood/serum (exceptions in override)
    "11": "Blood",
    // 11001C ABO / 11003C RH / 11004C antibody — blood typing
    "12": "Blood",
    // 12007C AFP / 12021C CEA / 12025B Ig-G / 12053C ANA …
    "13": "Blood",
    // Specialty serum (less common)
    "14": "Blood",
    // Specialty serum (e.g. coagulation panels)
    "24": "Blood",
    // e.g. 24007B 血漿游離鈣
    "27": "Blood"
    // Specialty serum / RIA hormones (e.g. 27021B testosterone free)
  };
  var NHI_CODE_SPECIMEN_OVERRIDE = {
    "09016C": "Urine"
    // 肌酐、尿 — Urine creatinine (the official urine-crea code)
  };
  function nhiCodeSpecimen(code) {
    const c = String(code ?? "").trim().toUpperCase();
    if (!c)
      return null;
    if (c in NHI_CODE_SPECIMEN_OVERRIDE)
      return NHI_CODE_SPECIMEN_OVERRIDE[c] ?? null;
    const prefix = c.slice(0, 2);
    return NHI_CODE_PREFIX_SPECIMEN[prefix] ?? null;
  }
  function inferSpecimen(orderName, display, code) {
    const displayStr = String(display ?? "");
    const orderStr = String(orderName ?? "");
    if (URINE_MARKERS_RE.test(displayStr))
      return "Urine";
    const blob = `${orderStr} ${displayStr}`.toLowerCase();
    for (const [pattern, label] of OTHER_SPECIMEN_RULES) {
      if (pattern.test(blob))
        return label;
    }
    const codeDefault = nhiCodeSpecimen(code);
    if (codeDefault)
      return codeDefault;
    if (URINE_MARKERS_RE.test(orderStr))
      return "Urine";
    return null;
  }
  var RATIO_TO_TIME_LOINC = {
    "6301-6": "5902-2",
    // INR → PT (Prothrombin time, sec)
    "63561-5": "14979-9",
    // APTT actual/normal ratio → APTT time (sec)
    "5894-1": "5902-2"
    // PT actual/Normal ratio → PT time (sec)
  };
  var TIME_UNIT_RE = /^(?:sec|s|seconds?|秒)$/i;
  function structuralLoincFix(loinc, rawUnit) {
    if (!loinc)
      return loinc;
    const sibling = RATIO_TO_TIME_LOINC[loinc];
    if (!sibling)
      return loinc;
    const u = String(rawUnit ?? "").trim();
    if (TIME_UNIT_RE.test(u)) {
      return sibling;
    }
    return loinc;
  }
  var URINE_PROTEIN_QUALITATIVE_LOINC = "20454-5";
  var URINE_PROTEIN_QUANTITATIVE_LOINC = "2888-6";
  var URINE_PROTEIN_COMBINED_RE = /^(?:[\d.]+\+|trace|positive|negative|\+|-)\s*[(（]/i;
  var URINE_PROTEIN_NUMERIC_RE = /^[\d.]+$/;
  var URINE_PROTEIN_MASS_UNIT_RE = /^mg\s*\/\s*d\s*l$/i;
  var NHI_SOURCE_CHANNEL_SYSTEM = "http://nhi-fhir-bridge/nhi-source-channel";
  function appendNhiSourceChannelTag(resource, raw) {
    const code = String(raw.nhi_source_channel ?? "").trim().toUpperCase();
    if (!code)
      return;
    const displayName = String(raw.nhi_source_channel_name ?? "").trim();
    const tag = {
      system: NHI_SOURCE_CHANNEL_SYSTEM,
      code
    };
    if (displayName)
      tag.display = displayName;
    if (!resource.meta)
      resource.meta = { versionId: "1", source: "nhi-fhir-bridge/scraper" };
    if (!Array.isArray(resource.meta.tag))
      resource.meta.tag = [];
    resource.meta.tag.push(tag);
  }
  var NHI_VISIT_DATE_SYSTEM = "http://nhi-fhir-bridge/nhi-visit-date";
  function appendNhiVisitDateTag(resource, raw) {
    const visitDate = String(raw.nhi_visit_date ?? "").trim();
    if (!visitDate)
      return;
    if (!resource.meta)
      resource.meta = { versionId: "1", source: "nhi-fhir-bridge/scraper" };
    if (!Array.isArray(resource.meta.tag))
      resource.meta.tag = [];
    resource.meta.tag.push({
      system: NHI_VISIT_DATE_SYSTEM,
      code: visitDate
    });
  }
  function resolveObsCodeText(loinc, code, display, cleanMatch) {
    const shortTextAllowed = !!loinc && !!LOINC_SHORT_TEXT[loinc] && (!CBC_CANONICAL_TEXT_LOINCS.has(loinc) || cleanMatch);
    const shortText = shortTextAllowed && loinc ? LOINC_SHORT_TEXT[loinc] : void 0;
    return normalizeFullwidth(
      shortText || NHI_CODE_PANEL_NAME[code] || display || "Unknown Lab"
    );
  }
  function urineProteinLoincFix(loinc, rawValue, rawUnit) {
    if (loinc !== URINE_PROTEIN_QUALITATIVE_LOINC)
      return loinc;
    const v = String(rawValue ?? "").trim();
    const u = String(rawUnit ?? "").trim();
    if (URINE_PROTEIN_COMBINED_RE.test(v)) {
      return URINE_PROTEIN_QUALITATIVE_LOINC;
    }
    if (URINE_PROTEIN_NUMERIC_RE.test(v) && URINE_PROTEIN_MASS_UNIT_RE.test(u)) {
      return URINE_PROTEIN_QUANTITATIVE_LOINC;
    }
    return URINE_PROTEIN_QUALITATIVE_LOINC;
  }
  var AMMONIA_MASS_LOINC = "22763-7";
  var AMMONIA_MOLAR_LOINC = "16362-6";
  var AMMONIA_MOLAR_UNIT_RE = /mol\s*\/\s*l/i;
  function ammoniaLoincFix(loinc, rawUnit) {
    if (loinc !== AMMONIA_MASS_LOINC)
      return loinc;
    const u = String(rawUnit ?? "").trim();
    if (AMMONIA_MOLAR_UNIT_RE.test(u))
      return AMMONIA_MOLAR_LOINC;
    return AMMONIA_MASS_LOINC;
  }
  function mapObservation(raw, patientId) {
    const display = raw.display || raw.code || "";
    const code = raw.code || "";
    if (looksLikeQcControl(String(display)))
      return null;
    const value = raw.value;
    const interp = (raw.interpretation ?? "").toString().toLowerCase();
    const hasValue = isMeaningfulValue(value);
    const hasMeaningfulInterp = MEANINGFUL_INTERPS.has(interp);
    if (!hasValue && !hasMeaningfulInterp)
      return null;
    const obsId = stableId(patientId, code, raw.date ?? "");
    const lookup = findLoincDetailed(code, display);
    let loinc = lookup.loinc;
    loinc = structuralLoincFix(loinc, raw.unit);
    loinc = urineProteinLoincFix(loinc, value, raw.unit);
    loinc = ammoniaLoincFix(loinc, raw.unit);
    const resource = {
      resourceType: "Observation",
      id: obsId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "laboratory",
              display: "Laboratory"
            }
          ]
        }
      ],
      code: {
        coding: buildCodings(
          code,
          display,
          loinc,
          String(raw.order_name ?? "") || NHI_CODE_PANEL_NAME[code] || void 0
        ),
        // v0.11.9 / v0.11.10 / v0.13: see resolveObsCodeText() — CBC LOINCs
        // gate on cleanMatch, others keep "always SHORT_TEXT" behaviour.
        text: resolveObsCodeText(loinc, code, display, lookup.cleanMatch)
      },
      subject: { reference: `Patient/${patientId}` }
    };
    if (raw.source_program) {
      resource.meta.tag = [
        {
          system: "http://nhi-fhir-bridge/source-program",
          code: String(raw.source_program)
        }
      ];
    }
    appendNhiSourceChannelTag(resource, raw);
    appendNhiVisitDateTag(resource, raw);
    if (raw.date) {
      resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
    }
    if (hasValue) {
      const unit = _canonicalizeUnit(display, code, raw.unit ?? "");
      const qty = tryParseQuantity(String(value), unit);
      if (qty)
        resource.valueQuantity = qty;
      else
        resource.valueString = String(value);
    }
    let _interpFromRange = null;
    if (raw.reference_range) {
      const rr = parseRange(String(raw.reference_range), raw.unit ?? "");
      if (rr) {
        if (rr.interpretationText) {
          _interpFromRange = rr.interpretationText;
        } else {
          resource.referenceRange = [rr];
        }
      }
    }
    const interpCodingResult = mapInterpretation(interp) || deriveInterpretation(
      value !== null && value !== void 0 ? String(value) : "",
      resource.valueQuantity,
      resource.referenceRange?.[0]
    );
    if (interpCodingResult) {
      resource.interpretation = [{ coding: [interpCodingResult] }];
    } else if (_interpFromRange) {
      const coded = mapInterpretation(_interpFromRange.toLowerCase());
      resource.interpretation = coded ? [{ coding: [coded], text: _interpFromRange }] : [{ text: _interpFromRange }];
    }
    return resource;
  }
  function buildObservation(raw, patientId, panelCode) {
    if (raw.bp_components) {
      const date = raw.date ?? "";
      const hospital = raw.hospital ?? "";
      const obsId2 = stableId(patientId, "obs", "BP_PANEL", date, hospital);
      const componentResources = [];
      for (const c of raw.bp_components) {
        const qty = {
          value: c.value,
          unit: c.unit || "mmHg",
          system: "http://unitsofmeasure.org",
          code: toUcum(c.unit) ?? "mm[Hg]"
        };
        componentResources.push({
          code: {
            coding: [{ system: "http://loinc.org", code: c.loinc, display: c.display }],
            text: c.display
          },
          valueQuantity: qty
        });
      }
      const bpObs = {
        resourceType: "Observation",
        id: obsId2,
        meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
        status: "final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/observation-category",
                code: "vital-signs",
                display: "Vital Signs"
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: raw.bp_panel_loinc ?? "85354-9",
              display: "Blood pressure panel"
            }
          ],
          text: "Blood Pressure"
        },
        subject: { reference: `Patient/${patientId}` },
        component: componentResources
      };
      if (date)
        bpObs.effectiveDateTime = `${date}T00:00:00+08:00`;
      if (hospital)
        bpObs.performer = [{ display: hospital }];
      return bpObs;
    }
    const display = raw.display || raw.code || "";
    const code = (panelCode ? String(panelCode) : "") || raw.order_code || raw.code || "";
    const value = raw.value;
    const interp = (raw.interpretation ?? "").toString().toLowerCase();
    const canonical = canonicalLabKey(display, code) || display;
    const obsId = stableId(
      patientId,
      "obs",
      canonical,
      raw.date ?? "",
      raw.hospital ?? "",
      code,
      String(raw.value ?? ""),
      String(raw.unit ?? ""),
      String(raw.nhi_source_channel ?? "")
    );
    const lookup = findLoincDetailed(code, display);
    let loinc = lookup.loinc;
    loinc = structuralLoincFix(loinc, raw.unit);
    loinc = urineProteinLoincFix(loinc, value, raw.unit);
    loinc = ammoniaLoincFix(loinc, raw.unit);
    const catCode = raw.category || "laboratory";
    const CAT_DISPLAY = {
      laboratory: "Laboratory",
      "vital-signs": "Vital Signs",
      imaging: "Imaging",
      procedure: "Procedure",
      "social-history": "Social History",
      survey: "Survey",
      exam: "Exam",
      therapy: "Therapy",
      activity: "Activity"
    };
    const catDisplay = CAT_DISPLAY[catCode] ?? catCode.charAt(0).toUpperCase() + catCode.slice(1).toLowerCase();
    const resource = {
      resourceType: "Observation",
      id: obsId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: catCode,
              display: catDisplay
            }
          ]
        }
      ],
      code: {
        // v0.11.9 (Category A): pass the panel-level NHI catalog name to
        // buildCodings so coding[nhi].display becomes the panel name (e.g.
        // "ABO血型測定檢驗") instead of the row-level LIS display ("血型
        // 鑑定"). Order: raw.order_name (scraper-provided NHI catalog
        // value) → NHI_CODE_PANEL_NAME override → fall back to display
        // via buildCodings.
        coding: buildCodings(
          code,
          display,
          loinc,
          String(raw.order_name ?? "") || NHI_CODE_PANEL_NAME[code] || void 0
        ),
        // v0.11.9 / v0.11.10 / v0.13: precedence (high → low):
        //   1. LOINC_SHORT_TEXT override — gated on cleanMatch for CBC
        //      LOINCs (CBC_CANONICAL_TEXT_LOINCS), always-on otherwise.
        //      See resolveObsCodeText() + findLoincDetailed() docstrings.
        //   2. NHI_CODE_PANEL_NAME override (when LIS ships a generic
        //      display under an NHI code that has a canonical specific
        //      name in the NHI catalog, e.g. 11001C "血型鑑定" →
        //      "ABO 血型測定" so SMART app can distinguish ABO/Rh/Antibody)
        //   3. Raw display (LIS-supplied analyte name) — also the
        //      fallback that preserves the v0.11.9 Bug 6 mis-tag canary
        //      when CBC LOINC is reached via path-C panel default.
        //   4. "Unknown Lab" sentinel
        // v0.11.10: normalizeFullwidth() applied so fullwidth ASCII chars
        // (e.g. 09099C 「心肌旋轉蛋白Ｉ」) become halfwidth in our label.
        text: resolveObsCodeText(loinc, code, display, lookup.cleanMatch)
      },
      subject: { reference: `Patient/${patientId}` }
    };
    if (raw.date)
      resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
    if (raw.hospital)
      resource.performer = [{ display: raw.hospital }];
    const specimen = inferSpecimen(raw.order_name, raw.display, raw.code);
    if (specimen)
      resource.specimen = { display: specimen };
    appendNhiSourceChannelTag(resource, raw);
    appendNhiVisitDateTag(resource, raw);
    const hasValue = isMeaningfulValue(value);
    if (hasValue) {
      const unit = _canonicalizeUnit(display, code, raw.unit ?? "");
      const qty = tryParseQuantity(String(value), unit);
      if (qty)
        resource.valueQuantity = qty;
      else
        resource.valueString = String(value);
    }
    let _interpFromRange = null;
    if (raw.reference_range) {
      const rrs = parseRangeMulti(String(raw.reference_range), raw.unit ?? "");
      const realRanges = rrs.filter((r) => !r.interpretationText);
      if (realRanges.length > 0)
        resource.referenceRange = realRanges;
      const flagged = rrs.find((r) => r.interpretationText);
      if (flagged?.interpretationText)
        _interpFromRange = flagged.interpretationText;
    }
    const interpCodingResult = mapInterpretation(interp) || deriveInterpretation(
      value !== null && value !== void 0 ? String(value) : "",
      resource.valueQuantity,
      resource.referenceRange?.[0]
    );
    if (interpCodingResult) {
      resource.interpretation = [{ coding: [interpCodingResult] }];
    } else if (_interpFromRange) {
      const coded = mapInterpretation(_interpFromRange.toLowerCase());
      resource.interpretation = coded ? [{ coding: [coded], text: _interpFromRange }] : [{ text: _interpFromRange }];
    }
    return resource;
  }
  function groupByOrderCode(cleaned, patientId) {
    let working = dedupeCrossFormat(cleaned);
    working = combineBpItems(working);
    const groups = /* @__PURE__ */ new Map();
    const keyMeta = /* @__PURE__ */ new Map();
    for (const raw of working) {
      const groupKeyCode = raw.order_code || raw.code || raw.display || "";
      const date = raw.date ?? "";
      const hospital = raw.hospital ?? "";
      const key = `${groupKeyCode}|${date}|${hospital}`;
      const arr = groups.get(key);
      if (arr)
        arr.push(raw);
      else {
        groups.set(key, [raw]);
        keyMeta.set(key, { groupKeyCode: String(groupKeyCode), date, hospital });
      }
    }
    const out = [];
    for (const [key, items] of groups.entries()) {
      const meta = keyMeta.get(key);
      const deduped = dedupePanelItems(items);
      const obsResources = [];
      const seenObsIds = /* @__PURE__ */ new Set();
      for (const it of deduped) {
        const obs = buildObservation(it, patientId, meta.groupKeyCode);
        if (!obs)
          continue;
        if (seenObsIds.has(obs.id))
          continue;
        seenObsIds.add(obs.id);
        obsResources.push(obs);
      }
      if (obsResources.length === 0)
        continue;
      const isBpPanel = deduped.every((it) => it.bp_components || it.display === "Blood Pressure");
      if (isBpPanel) {
        out.push(...obsResources);
        continue;
      }
      const orderName = deduped.find((it) => it.order_name)?.order_name ?? null;
      const memberKeys = Array.from(
        new Set(
          deduped.filter((it) => it.display).map((it) => canonicalLabKey(it.display, String(meta.groupKeyCode)))
        )
      ).sort();
      const panelSignature = memberKeys.join(",") || String(meta.groupKeyCode);
      const drId = stableId(
        patientId,
        "DR",
        panelSignature,
        meta.date,
        meta.hospital,
        String(meta.groupKeyCode)
      );
      const groupCodeStr = String(meta.groupKeyCode);
      let panelLoinc = NHI_TO_LOINC[groupCodeStr];
      if (!panelLoinc && obsResources.length > 0) {
        const obsLoincs = /* @__PURE__ */ new Set();
        for (const obs of obsResources) {
          const loinc = obs.code?.coding?.find(
            (c) => c?.system === "http://loinc.org"
          )?.code;
          if (loinc)
            obsLoincs.add(loinc);
        }
        if (obsLoincs.size === 1) {
          panelLoinc = [...obsLoincs][0];
        }
      }
      const loincShortText = panelLoinc ? LOINC_SHORT_TEXT[panelLoinc] : void 0;
      let panelTitle;
      if (deduped.length === 1) {
        const singleDisplay = deduped[0].display ?? "";
        panelTitle = loincShortText || NHI_CODE_PANEL_NAME[groupCodeStr] || orderName || singleDisplay || groupCodeStr;
      } else {
        const allSameAnalyte = !DISPLAY_FIRST_CODES.has(groupCodeStr);
        panelTitle = allSameAnalyte && loincShortText || orderName || NHI_CODE_PANEL_NAME[groupCodeStr] || groupCodeStr;
      }
      const drCodeSystem = NHI_LAB_CODE_RE.test(String(meta.groupKeyCode) ?? "") ? NHI_MEDICAL_ORDER_CODE : HIS_LOCAL_LAB_CODE;
      const drCodingDisplay = orderName || NHI_CODE_PANEL_NAME[groupCodeStr] || panelTitle;
      const drText = normalizeFullwidth(panelTitle);
      const dr = {
        resourceType: "DiagnosticReport",
        id: drId,
        meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
        status: "final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                code: "LAB",
                display: "Laboratory"
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: drCodeSystem,
              code: String(meta.groupKeyCode) || "UNKNOWN",
              display: drCodingDisplay
            }
          ],
          text: drText
        },
        subject: { reference: `Patient/${patientId}` },
        result: obsResources.map((o) => ({ reference: `Observation/${o.id}` }))
      };
      if (meta.date)
        dr.effectiveDateTime = `${meta.date}T00:00:00+08:00`;
      if (meta.hospital)
        dr.performer = [{ display: meta.hospital }];
      if (obsResources.length === 1 && obsResources[0]?.code) {
        const obs = obsResources[0];
        const obsLoinc = obs.code.coding?.find(
          (c) => c?.system === "http://loinc.org"
        )?.code;
        const panelLoinc2 = NHI_TO_LOINC[groupCodeStr];
        if (!obsLoinc || obsLoinc === panelLoinc2) {
          obs.code.text = drText;
        }
      }
      out.push(dr);
      out.push(...obsResources);
    }
    return out;
  }
  function mapObservationsGrouped(rawItems, patientId) {
    const cleaned = filterLabRows(rawItems);
    const dedupedChannel = dedupNhiCrossChannelPairs(cleaned);
    return groupByOrderCode(dedupedChannel, patientId);
  }

  // ../packages/mapper/src/procedure.ts
  function mapSystem3(systemHint) {
    const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
    if (s.includes("snomed"))
      return SNOMED_CT;
    if (s.includes("icd"))
      return ICD_10_PCS;
    return HIS_LOCAL_PROCEDURE_CODE;
  }
  function mapProcedure(raw, patientId) {
    const note = (raw.note ?? "").trim();
    const bodySite = (raw.body_site ?? "").trim();
    if (!note && !bodySite)
      return null;
    const display = raw.display ?? "Unknown Procedure";
    const displayZh = (raw.display_zh ?? "").trim() || display;
    const code = raw.code;
    const system = mapSystem3(raw.system ?? "");
    const resource = {
      resourceType: "Procedure",
      id: stableId(patientId, code || display, raw.date ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: raw.status ?? "completed",
      subject: { reference: `Patient/${patientId}` },
      code: {
        coding: [{ system, code: code || display, display }],
        text: displayZh
      }
    };
    if (raw.date) {
      resource.performedDateTime = `${raw.date}T00:00:00+08:00`;
    }
    if (bodySite) {
      resource.bodySite = [{ text: bodySite }];
    }
    if (note) {
      resource.note = [{ text: note }];
    }
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.performer = [{ actor: { display: hospital } }];
    }
    return resource;
  }

  // ../packages/mapper/src/dispatch.ts
  var LIST_HANDLERS = {
    observations: [mapObservation, "observations"],
    medications: [mapMedicationRequest, "medications"],
    conditions: [mapCondition, "conditions"],
    allergies: [mapAllergyIntolerance, "allergies"],
    diagnostic_reports: [mapDiagnosticReport, "diagnostic_reports"],
    procedures: [mapProcedure, "procedures"],
    encounters: [mapEncounter, "encounters"],
    immunizations: [mapImmunization, "immunizations"],
    care_plans: [mapCarePlan, "care_plans"],
    // 出院病摘 (NHI IHKE3309S02/getxml) — DocumentReference carrying the
    // NHI-rendered HTML verbatim. One row per inpatient stay with
    // has_XML=Y. See document-reference.ts for the faithful-transport
    // rationale.
    document_references: [mapDischargeSummaryDocRef, "document_references"]
  };
  var GROUP_HANDLERS = {
    observations: mapObservationsGrouped,
    medications: mapMedicationsDedup
  };

  // ../packages/mapper/src/imaging-dedup.ts
  function frameContentHash(b64) {
    let h = 5381;
    const cap = Math.min(b64.length, 16384);
    for (let i = 0; i < cap; i++) {
      h = (h << 5) + h + b64.charCodeAt(i) | 0;
    }
    return `${h >>> 0}:${b64.length}`;
  }
  function dedupImagingItems(items) {
    if (!Array.isArray(items) || items.length === 0)
      return items;
    let unkCounter = 0;
    const groups = /* @__PURE__ */ new Map();
    for (const it of items) {
      if (!it)
        continue;
      const code = String(it.code ?? "");
      const date = String(it.date ?? "");
      const hospital = String(it.hospital ?? "");
      const key = code || date || hospital ? `${code}|${date}|${hospital}` : `__unknown_${unkCounter++}`;
      const arr = groups.get(key);
      if (arr)
        arr.push(it);
      else
        groups.set(key, [it]);
    }
    const out = [];
    for (const group of groups.values()) {
      if (group.length === 1) {
        out.push(group[0]);
        continue;
      }
      let emptySentinel = 0;
      const byHash = /* @__PURE__ */ new Map();
      for (const it of group) {
        const frames = framesOf(it);
        const h = frames.length > 0 ? frameContentHash(frames[0]) : `__empty_${emptySentinel++}`;
        const arr = byHash.get(h);
        if (arr)
          arr.push(it);
        else
          byHash.set(h, [it]);
      }
      const merged = [];
      for (const bucket of byHash.values()) {
        if (bucket.length === 1) {
          merged.push(bucket[0]);
          continue;
        }
        const winnerBase = bucket.reduce(
          (a, b) => (b.conclusion?.length ?? 0) > (a.conclusion?.length ?? 0) ? b : a
        );
        const winner = { ...winnerBase };
        const seenHashes = /* @__PURE__ */ new Set();
        const unionFrames = [];
        for (const it of bucket) {
          for (const f of framesOf(it)) {
            const h = frameContentHash(f);
            if (seenHashes.has(h))
              continue;
            seenHashes.add(h);
            unionFrames.push(f);
          }
        }
        if (unionFrames.length > 0) {
          winner.jpgBase64s = unionFrames;
        }
        merged.push(winner);
      }
      const narrativeOnly = merged.filter(isNarrativeOnly);
      const imageItems = merged.filter(hasFrames);
      if (narrativeOnly.length === 1 && imageItems.length === 1) {
        const narr = narrativeOnly[0];
        const img = imageItems[0];
        for (const k of Object.keys(narr)) {
          const imgVal = img[k];
          const narrVal = narr[k];
          const isMissing = imgVal == null || imgVal === "" || Array.isArray(imgVal) && imgVal.length === 0;
          if (isMissing && narrVal != null && narrVal !== "") {
            img[k] = narrVal;
          }
        }
        out.push(img);
        for (const it of merged) {
          if (it !== narr && it !== img)
            out.push(it);
        }
      } else {
        out.push(...merged);
      }
    }
    function contentSignatureOf(item) {
      const frames = framesOf(item);
      if (frames.length === 0)
        return null;
      const hashes = frames.map(frameContentHash).sort();
      return hashes.join("|");
    }
    const finalOut = [];
    const byContentKey = /* @__PURE__ */ new Map();
    for (const it of out) {
      const sig = contentSignatureOf(it);
      if (!sig) {
        finalOut.push(it);
        continue;
      }
      const date = String(it.date ?? "");
      const hospital = String(it.hospital ?? "");
      if (!date || !hospital) {
        finalOut.push(it);
        continue;
      }
      const key = `${date}|${hospital}|${sig}`;
      const existing = byContentKey.get(key);
      if (!existing) {
        byContentKey.set(key, { item: it, index: finalOut.length });
        finalOut.push(it);
        continue;
      }
      const existingCode = String(existing.item.code ?? "");
      const itCode = String(it.code ?? "");
      if (itCode < existingCode) {
        finalOut[existing.index] = it;
        byContentKey.set(key, { item: it, index: existing.index });
      }
    }
    return finalOut;
  }
  function framesOf(item) {
    if (Array.isArray(item.jpgBase64s)) {
      return item.jpgBase64s.filter(
        (s) => typeof s === "string" && s.length > 0
      );
    }
    if (typeof item.jpgBase64 === "string" && item.jpgBase64.length > 0) {
      return [item.jpgBase64];
    }
    return [];
  }
  function isNarrativeOnly(item) {
    return framesOf(item).length === 0 && typeof item.conclusion === "string" && item.conclusion.length > 0;
  }
  function hasFrames(item) {
    return framesOf(item).length > 0;
  }

  // ../packages/mapper/src/link.ts
  var ENCOUNTER_LINKABLE = /* @__PURE__ */ new Set([
    "Observation",
    "MedicationRequest",
    "DiagnosticReport",
    "Procedure",
    "Condition",
    "AllergyIntolerance"
  ]);
  function resourceDate(r) {
    for (const key of [
      "effectiveDateTime",
      "authoredOn",
      "performedDateTime",
      "onsetDateTime",
      "recordedDate",
      "issued"
    ]) {
      const v = r[key];
      if (v)
        return String(v).slice(0, 10);
    }
    for (const key of ["effectivePeriod", "performedPeriod"]) {
      const period = r[key];
      if (period && typeof period === "object" && period.start) {
        return String(period.start).slice(0, 10);
      }
    }
    return "";
  }
  function resourceHospital(r) {
    for (const p of r.performer ?? []) {
      if (!p || typeof p !== "object")
        continue;
      if (typeof p.display === "string" && p.display)
        return p.display;
      const actor = p.actor;
      if (actor && typeof actor === "object" && typeof actor.display === "string" && actor.display) {
        return actor.display;
      }
    }
    const req = r.requester ?? {};
    if (req && typeof req === "object" && req.display)
      return req.display;
    return "";
  }
  function dedupAdmissionDayAmb(resources) {
    const impStarts = /* @__PURE__ */ new Set();
    for (const r of resources) {
      if (r.resourceType !== "Encounter")
        continue;
      if ((r.class ?? {}).code !== "IMP")
        continue;
      const hosp = (r.serviceProvider ?? {}).display ?? "";
      const start = String((r.period ?? {}).start ?? "").slice(0, 10);
      if (hosp && start)
        impStarts.add(`${hosp} ${start}`);
    }
    if (impStarts.size === 0)
      return resources;
    return resources.filter((r) => {
      if (r.resourceType === "Encounter" && (r.class ?? {}).code === "AMB") {
        const hosp = (r.serviceProvider ?? {}).display ?? "";
        const start = String((r.period ?? {}).start ?? "").slice(0, 10);
        if (impStarts.has(`${hosp} ${start}`))
          return false;
      }
      return true;
    });
  }
  function linkEncountersInResources(candidates, resources) {
    if (candidates.length === 0)
      return;
    const exactIndex = /* @__PURE__ */ new Map();
    const impByHosp = /* @__PURE__ */ new Map();
    for (const e of candidates) {
      if (e.resourceType !== "Encounter")
        continue;
      const hosp = (e.serviceProvider ?? {}).display ?? "";
      const start = String((e.period ?? {}).start ?? "").slice(0, 10);
      if (!hosp || !start)
        continue;
      const key = `${hosp} ${start}`;
      const arr = exactIndex.get(key) ?? [];
      arr.push(e.id);
      exactIndex.set(key, arr);
      const cls = (e.class ?? {}).code ?? "";
      if (cls === "IMP") {
        const end = String((e.period ?? {}).end ?? "").slice(0, 10);
        if (end) {
          const list = impByHosp.get(hosp) ?? [];
          list.push([start, end, e.id]);
          impByHosp.set(hosp, list);
        }
      }
    }
    if (exactIndex.size === 0 && impByHosp.size === 0)
      return;
    for (const r of resources) {
      if (!ENCOUNTER_LINKABLE.has(r.resourceType))
        continue;
      if (r.encounter || r.context)
        continue;
      const hosp = resourceHospital(r);
      const date = resourceDate(r);
      if (!hosp || !date)
        continue;
      const matches = [...exactIndex.get(`${hosp} ${date}`) ?? []];
      if (matches.length === 0) {
        for (const [start, end, eid] of impByHosp.get(hosp) ?? []) {
          if (start <= date && date <= end)
            matches.push(eid);
        }
      }
      if (matches.length !== 1)
        continue;
      r.encounter = { reference: `Encounter/${matches[0]}` };
    }
  }
  function resolveSexStratifiedRanges(patient, resources) {
    if (!patient)
      return;
    const gender = String(patient.gender ?? "").toLowerCase();
    if (gender !== "male" && gender !== "female")
      return;
    for (const r of resources) {
      if (r.resourceType !== "Observation")
        continue;
      const rrs = r.referenceRange ?? [];
      if (rrs.length < 2)
        continue;
      let match = null;
      for (const entry of rrs) {
        for (const ap of entry.appliesTo ?? []) {
          for (const c of ap.coding ?? []) {
            if (String(c.code ?? "").toLowerCase() === gender) {
              match = entry;
              break;
            }
          }
          if (match)
            break;
        }
        if (match)
          break;
      }
      if (!match)
        continue;
      r.referenceRange = [match];
      const valStr = String((r.valueQuantity ?? {}).value ?? "") || String(r.valueString ?? "");
      const newInterp = deriveInterpretation(valStr, r.valueQuantity ?? null, match);
      if (newInterp) {
        r.interpretation = [{ coding: [newInterp] }];
      }
    }
  }

  // ../packages/mapper/src/patient.ts
  var TW_NATIONAL_ID_RE = /^[A-Z][12]\d{8}$/;
  function looksLikeTwNationalId(value) {
    if (!value)
      return false;
    return TW_NATIONAL_ID_RE.test(value.trim().toUpperCase());
  }
  function mapPatient(raw) {
    const rawId = String(raw.identifier ?? raw.id ?? "unknown");
    const patientId = derivePatientId(rawId);
    const nameText = (raw.name ?? null) || "Unknown";
    const phone = (raw.phone ?? null) || "";
    const address = (raw.address ?? null) || "";
    const [family, given] = splitName(nameText);
    const nameEntry = { use: "official", text: nameText };
    if (family)
      nameEntry.family = family;
    if (given.length > 0)
      nameEntry.given = given;
    const resource = {
      resourceType: "Patient",
      id: patientId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      identifier: [
        {
          use: "official",
          system: looksLikeTwNationalId(rawId) ? TW_NATIONAL_ID : HIS_LOCAL_PATIENT_MRN,
          value: rawId
        }
      ],
      name: [nameEntry],
      gender: mapGender(raw.gender)
    };
    const birthDate = raw.birthDate;
    if (birthDate)
      resource.birthDate = birthDate;
    if (phone) {
      resource.telecom = [{ system: "phone", use: "home", value: phone }];
    }
    if (address) {
      resource.address = [{ use: "home", text: address }];
    }
    return resource;
  }
  function splitName(fullName) {
    const name = (fullName ?? "").trim();
    if (!name || name === "Unknown")
      return ["", []];
    if (/\s/.test(name)) {
      const parts = name.split(/\s+/);
      return [parts[parts.length - 1], parts.slice(0, -1)];
    }
    const codepoints = Array.from(name);
    return codepoints.length > 1 ? [codepoints[0], [codepoints.slice(1).join("")]] : [name, []];
  }
  function mapGender(gender) {
    const g = typeof gender === "string" ? gender.toLowerCase() : "";
    if (["male", "m", "\u7537", "\u7537\u6027"].includes(g))
      return "male";
    if (["female", "f", "\u5973", "\u5973\u6027"].includes(g))
      return "female";
    return "unknown";
  }

  // src/background/backend-upload.ts
  async function postStructured(backend, page_type, items, syncApiKey, patientOverride) {
    const r = await fetch(`${backend}/sync/upload-structured`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}
      },
      body: JSON.stringify({
        page_type,
        host: NHI_HOST,
        items,
        patient_override: patientOverride || null
      })
    });
    if (!r.ok)
      throw new Error(`POST upload-structured ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return await r.json();
  }
  async function exportPatientBundle(backend, syncApiKey, patientId) {
    const fhirPid = derivePatientId(patientId);
    const expUrl = `${backend}/fhir/export?patient=${encodeURIComponent(fhirPid)}`;
    const r = await fetch(expUrl, {
      headers: syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}
    });
    if (!r.ok)
      throw new Error(`HTTP ${r.status}`);
    return await r.json();
  }
  async function deletePartialPatientData(backend, syncApiKey, patientId) {
    const fhirPid = derivePatientId(patientId);
    await fetch(`${backend}/sync/patient/${encodeURIComponent(fhirPid)}`, {
      method: "DELETE",
      headers: syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}
    });
  }
  async function postSyncLog(backend, syncApiKey, logBody) {
    await fetch(`${backend}/sync/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}
      },
      body: JSON.stringify(logBody)
    });
  }

  // src/background/badge.ts
  var UNSEEN_KEY = "unseenSyncResult";
  var ICON_SIZES = [16, 32, 48];
  var DOT_COLOR = "#d70015";
  var RING_COLOR = "#ffffff";
  var PLAIN_ICON_PATH = {
    16: "icons/icon-16.png",
    32: "icons/icon-32.png",
    48: "icons/icon-48.png"
  };
  async function _buildDottedIcon(size) {
    const url = chrome.runtime.getURL(`icons/icon-${size}.png`);
    const blob = await (await fetch(url)).blob();
    const bmp = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bmp, 0, 0, size, size);
    const r = Math.max(3, Math.round(size * 0.17));
    const ring = Math.max(1, Math.round(size * 0.05));
    const cx = size - r;
    const cy = r;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = RING_COLOR;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r - ring, 0, 2 * Math.PI);
    ctx.fillStyle = DOT_COLOR;
    ctx.fill();
    return ctx.getImageData(0, 0, size, size);
  }
  async function _paintDot() {
    try {
      const imageData = {};
      for (const s of ICON_SIZES)
        imageData[s] = await _buildDottedIcon(s);
      await chrome.action.setIcon({ imageData });
    } catch {
    }
  }
  async function showResultBadge(count) {
    const n = Number(count) || 0;
    if (n <= 0) {
      await clearResultBadge();
      return;
    }
    await chrome.storage.local.set({ [UNSEEN_KEY]: true }).catch(() => {
    });
    await _paintDot();
  }
  async function clearResultBadge() {
    try {
      await chrome.action.setIcon({ path: PLAIN_ICON_PATH });
    } catch {
    }
    await chrome.storage.local.remove(UNSEEN_KEY).catch(() => {
    });
  }
  async function restoreResultBadge() {
    try {
      const { [UNSEEN_KEY]: unseen } = await chrome.storage.local.get(UNSEEN_KEY);
      if (unseen)
        await _paintDot();
    } catch {
    }
  }

  // src/background/imaging-prep-poll.ts
  async function startPrepPolling(patientId, initialCount, baseUrl) {
    if (!patientId || initialCount <= 0)
      return;
    const now = Date.now();
    const state = {
      patientId,
      startedAt: now,
      initialCount,
      count: initialCount,
      lastPolledAt: 0,
      pollAttempts: 0,
      status: "polling"
    };
    await chrome.storage.local.set({
      [IMAGING_PREP_STATE_KEY]: state,
      [IMAGING_PREP_BASE_KEY]: baseUrl
    });
    chrome.alarms.create(IMAGING_PREP_POLL_ALARM, {
      periodInMinutes: IMAGING_PREP_POLL_INTERVAL_MIN,
      delayInMinutes: IMAGING_PREP_POLL_INTERVAL_MIN
    });
  }
  async function stopPrepPolling(opts) {
    await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {
    });
    if (!opts?.keepState) {
      await chrome.storage.local.remove([IMAGING_PREP_STATE_KEY, IMAGING_PREP_BASE_KEY]).catch(() => {
      });
    }
  }
  async function _loadBearerToken(patientId) {
    const obj = await chrome.storage.local.get(NHI_BEARER_TOKEN_KEY);
    const stash = obj[NHI_BEARER_TOKEN_KEY];
    if (!stash)
      return null;
    if (stash.patientId !== patientId)
      return null;
    if (Date.now() - stash.savedAt > NHI_BEARER_TOKEN_TTL_MS)
      return null;
    return stash.token || null;
  }
  async function _writeState(state) {
    await chrome.storage.local.set({ [IMAGING_PREP_STATE_KEY]: state });
  }
  async function pollPrepCount() {
    const stored = await chrome.storage.local.get([IMAGING_PREP_STATE_KEY, IMAGING_PREP_BASE_KEY]);
    const state = stored[IMAGING_PREP_STATE_KEY];
    const baseUrl = stored[IMAGING_PREP_BASE_KEY];
    if (!state || !baseUrl) {
      await stopPrepPolling();
      return;
    }
    if (Date.now() - state.startedAt >= IMAGING_PREP_MAX_MS) {
      await _writeState({ ...state, status: "timeout" });
      await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {
      });
      return;
    }
    const token = await _loadBearerToken(state.patientId);
    if (!token) {
      await _writeState({ ...state, status: "session-expired" });
      await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {
      });
      return;
    }
    const url = `${baseUrl}/api/ihke3000/ihke3408s01/page_load?s_type=&s_sort=A1&_=${Date.now()}`;
    let nextCount = state.count;
    try {
      const r = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      if (r.status === 401 || r.status === 403) {
        await _writeState({ ...state, status: "session-expired" });
        await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {
        });
        return;
      }
      if (!r.ok) {
        await _writeState({
          ...state,
          pollAttempts: state.pollAttempts + 1,
          lastPolledAt: Date.now(),
          error: `HTTP ${r.status}`
        });
        return;
      }
      const body = await r.json();
      const list = body && body.sp_IHKE3408S01_data || [];
      let c = 0;
      for (const row of list) {
        const status = String(row?.jpG_STATUS ?? row?.jpg_STATUS ?? "");
        if (status === "0")
          c++;
      }
      nextCount = c;
    } catch (e) {
      await _writeState({
        ...state,
        pollAttempts: state.pollAttempts + 1,
        lastPolledAt: Date.now(),
        error: String(e?.message || e)
      });
      return;
    }
    const isReady = nextCount === 0;
    await _writeState({
      ...state,
      count: nextCount,
      pollAttempts: state.pollAttempts + 1,
      lastPolledAt: Date.now(),
      status: isReady ? "ready" : "polling",
      error: void 0
    });
    if (isReady) {
      await chrome.alarms.clear(IMAGING_PREP_POLL_ALARM).catch(() => {
      });
    }
  }

  // src/background/storage-migration.ts
  async function migrateSyncToLocal() {
    try {
      const synced = await chrome.storage.sync.get(SYNC_KEYS_TO_MIGRATE);
      const present = Object.fromEntries(Object.entries(synced).filter(([, v]) => v !== void 0));
      if (Object.keys(present).length === 0)
        return;
      const local = await chrome.storage.local.get(Object.keys(present));
      const toWrite = Object.fromEntries(
        Object.entries(present).filter(([k]) => local[k] === void 0)
      );
      if (Object.keys(toWrite).length > 0) {
        await chrome.storage.local.set(toWrite);
      }
      await chrome.storage.sync.remove(Object.keys(present));
    } catch {
    }
  }
  async function sweepStaleLocalKeys() {
    try {
      const all = await chrome.storage.local.get(null);
      const stale = Object.keys(all).filter(
        (k) => k === "pendingFhirBundle" || k.startsWith("__sampleBody_")
      );
      if (stale.length)
        await chrome.storage.local.remove(stale);
    } catch {
    }
  }
  async function sweepPendingBundleIfStale() {
    try {
      const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
      if (!pending)
        return;
      const age = Date.now() - (pending.generatedAt || 0);
      if (age > PENDING_BUNDLE_TTL_MS) {
        await chrome.storage.local.remove([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]);
      }
    } catch {
    }
  }

  // src/nhi-adapters.ts
  function rocToISO(rocDate) {
    if (!rocDate)
      return "";
    const m = String(rocDate).match(/^(\d{2,3})[/.-](\d{1,2})[/.-](\d{1,2})/);
    if (!m)
      return "";
    const y = Number.parseInt(m[1], 10) + 1911;
    return `${y}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  }
  function rocChineseToISO(rocDate) {
    if (!rocDate)
      return "";
    const s = String(rocDate).trim();
    const m = s.match(/(\d{2,3})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?/);
    if (!m)
      return rocToISO(s);
    const y = Number.parseInt(m[1], 10) + 1911;
    return `${y}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  }
  function pickEnglish(s) {
    if (s === null || s === void 0)
      return "";
    const str = String(s);
    const idx = str.indexOf("||");
    if (idx === -1)
      return str.trim();
    const en = str.slice(idx + 2).trim();
    return en || str.slice(0, idx).trim();
  }
  function pickChinese(s) {
    if (s === null || s === void 0)
      return "";
    const str = String(s);
    const idx = str.indexOf("||");
    if (idx === -1)
      return str.trim();
    const zh = str.slice(0, idx).trim();
    return zh || str.slice(idx + 2).trim();
  }
  function _cleanLabName(s) {
    if (s === null || s === void 0)
      return "";
    return String(s).trim().replace(/[,，;；]+\s*$/, "").trim();
  }
  function adaptLabItem(item) {
    if (!item || typeof item !== "object")
      return null;
    const date = rocToISO(item.reaL_INSPECT_DATE || item.real_inspect_date || item.funC_DATE);
    const value = item.assaY_VALUE;
    if (!date || value === void 0 || value === null || value === "")
      return null;
    const fullName = _cleanLabName(item.assaY_ITEM_NAME) || _cleanLabName(item.order_shortname) || _cleanLabName(item.ordeR_NAME);
    const orderCode = String(item.ordeR_CODE || "").trim();
    return {
      date,
      order_code: orderCode,
      order_name: item.ordeR_NAME || "",
      // Prefer the NHI 醫令碼 ("09140C") as the FHIR coding code so the
      // downstream observation mapper routes it under NHI_MEDICAL_ORDER_
      // CODE system. SMART apps group lab tests by coding code; using
      // free-text here is what causes "Crea" and "Crea," to be split
      // into two distinct tests. Fallback to the cleaned display when
      // NHI doesn't supply an order code (older / edge-case rows).
      code: orderCode || fullName,
      display: fullName,
      value: String(value),
      unit: item.uniT_DATA || "",
      reference_range: item.consulT_VALUE || item.short_CONSULT_VALUE || "",
      hospital: item.hosP_ABBR || "",
      // v0.12.3: NHI ships the same measurement under two upload
      // channels — orI_TYPE = "A" (特約醫事機構不定期上傳, real-time) or
      // "B" (定期上傳, batch sync). Verified 2026-05-29 via direct
      // /api/ihke3000/ihke3409s01/page_load inspection: 92 of 113 dup
      // pairs in the user's v0.12.1 bundle are NHI-side A+B pairs for
      // the same draw, not bridge transformer artifacts. Surfacing the
      // channel here lets the downstream mapper emit it as
      // Observation.meta.tag so SMART apps can dedupe-by-source as a UI
      // choice without violating the bridge's strict-no-dedup rule.
      nhi_source_channel: String(item.orI_TYPE || "").toUpperCase() || null,
      nhi_source_channel_name: String(item.orI_TYPE_NAME || "") || null,
      // v0.13: surface NHI 就醫日期 (funC_DATE) separately from `date`
      // (which prefers reaL_INSPECT_DATE per the v0.6.1 fix). Downstream
      // mapper emits via Observation.meta.tag so SMART apps can detect
      // visit-vs-inspect-date gaps — verified real-world case 2026-05-30:
      // 長庚嘉義 09006C HbA1c row has reaL_INSPECT_DATE=2025-12-09 but
      // funC_DATE=2025-09-16, ~3 months apart, likely hospital late report
      // or roving outpatient order. effectiveDateTime stays 12/9 per
      // FHIR "physiologically relevant time"; visit date rides in meta.tag.
      // Faithful-transport: bridge does NOT pick which is "correct".
      nhi_visit_date: rocToISO(item.funC_DATE || item.func_DATE) || null
    };
  }
  function adaptMedicationFromDetail(drug, visit, options) {
    if (!drug || typeof drug !== "object")
      return null;
    const date = rocToISO(visit?.func_DATE || visit?.func_date || "");
    const rawDrugName = drug.drug_name || drug.druG_NAME || "";
    const drug_name = pickEnglish(rawDrugName);
    if (!date || !drug_name)
      return null;
    const end_date = rocToISO(visit?.cure_E_DATE || visit?.cure_e_date || "");
    const days = Number(drug.order_drug_day || drug.order_DRUG_DAY || 0);
    const is_chronic = !!options?.is_chronic;
    const drug_name_zh = drug.drug_name2 || drug.druG_NAME2 || pickChinese(rawDrugName);
    const rawIndication = visit?.icd9cm_CODE_CNAME || visit?.icd9cm_name || "";
    const stripIcdPrefix = (s) => s.replace(/^[A-Z0-9.]+\/\s*/, "");
    const indication = stripIcdPrefix(pickEnglish(rawIndication));
    const indication_zh = visit?.icd9cm_CODE_CNAME2 || visit?.icd9cm_code_cname2 || stripIcdPrefix(pickChinese(rawIndication));
    const dosageText = drug.drug_freq || drug.druG_FREQ || drug.drug_FREQ || drug.frequency || drug.FREQUENCY || drug.drug_use || drug.druG_USE || drug.drug_USE || drug.usage || drug.USAGE || drug.sig || drug.SIG || drug.dosage || drug.DOSAGE || "";
    return {
      date,
      // Only emit when meaningfully populated AND different from start.
      // Suppressing the same-day case keeps OPD / 藥局 resources tight.
      end_date: end_date && end_date !== date ? end_date : "",
      drug_name,
      drug_name_zh,
      code: drug.order_code || drug.ordeR_CODE || "",
      // List endpoint doesn't expose dose/frequency/route — only days + qty.
      dose: "",
      frequency: "",
      route: "",
      // Raw NHI 用法 text — passes verbatim into the mapper so SMART apps
      // see at least the literal sig string even before any structured
      // BID/TID/PC parsing is added. Empty when NHI fixture didn't carry
      // any recognised 用法 field.
      dosage_text: String(dosageText).trim(),
      quantity: drug.order_qty || drug.order_QTY || "",
      duration_days: Number.isFinite(days) ? days : 0,
      indication,
      indication_zh,
      indication_code: visit?.icd9cm_CODE || visit?.icd9cm_code || "",
      drug_class: pickEnglish(drug.act || ""),
      drug_class_zh: pickChinese(drug.act || ""),
      hospital: visit?.hosp_ABBR || visit?.hosp_abbr || "",
      // Mapper reads this to set MedicationRequest.courseOfTherapyType.
      course_of_therapy: is_chronic ? "continuous" : ""
    };
  }
  function adaptMedication() {
    return null;
  }
  function adaptChronicListStub() {
    return null;
  }
  function adaptImagingListStub() {
    return null;
  }
  function adaptCatastrophicIllness(item) {
    if (!item || typeof item !== "object")
      return null;
    const display = pickEnglish(item.icD10CM_CNAME || item.icd10cm_cname || "");
    if (!display)
      return null;
    return {
      display,
      code: "",
      system: "",
      onset_date: rocToISO(item.valiD_S_DATE || item.valid_s_date || ""),
      recorded_date: rocToISO(item.valiD_S_DATE || item.valid_s_date || ""),
      category: "problem-list-item",
      severity: "Severe (\u91CD\u5927\u50B7\u75C5)",
      hospital: item.hosP_ABBR || item.hosp_abbr || "",
      clinical_status: "active"
    };
  }
  function adaptAdultPreventive(row) {
    if (!row || typeof row !== "object")
      return null;
    const date = rocToISO(row.firsT_DIAG_DATE || "");
    if (!date)
      return null;
    const hospital = row.hosP_ABBR || row.hosp_ABBR || "";
    const out = [];
    function push(display, value, unit, refRange, category, code) {
      if (value === void 0 || value === null)
        return;
      const v = String(value).trim();
      if (v === "" || v === "\u2014")
        return;
      out.push({
        date,
        hospital,
        category: category || "laboratory",
        order_code: code || "",
        order_name: display,
        code: code || display,
        display,
        value: v,
        unit: unit || "",
        reference_range: refRange || "",
        // Source-programme tag — added to Observation.meta.tag by the
        // mapper; lets SMART apps filter / categorize "this came from
        // 成人預防保健 screening".
        source_program: "adult-preventive"
      });
    }
    push("Body Height", row.height, "cm", "", "vital-signs");
    push("Body Weight", row.weight, "kg", "", "vital-signs");
    push("BMI", row.bmi, "kg/m2", "", "vital-signs");
    push("Waist Circumference", row.waistline, "cm", "", "vital-signs");
    push(
      "Systolic Blood Pressure",
      row.basE_SBP,
      "mmHg",
      row.bloD_PRESS_RESULT_TEXT || "",
      "vital-signs"
    );
    push(
      "Diastolic Blood Pressure",
      row.basE_EBP,
      "mmHg",
      row.bloD_PRESS_RESULT_TEXT || "",
      "vital-signs"
    );
    push("Cholesterol", row.cho, "mg/dL", "", "laboratory", "09001C");
    push("Triglyceride", row.bloD_TG, "mg/dL", "", "laboratory", "09004C");
    push("HDL", row.hdl, "mg/dL", "", "laboratory", "09043C");
    push("LDL", row.ldl, "mg/dL", "", "laboratory", "09044C");
    push("SGOT (AST)", row.sgot, "U/L", row.lF_DIAG_RESULT_TEXT || "", "laboratory", "09025C");
    push("SGPT (ALT)", row.sgpt, "U/L", row.lF_DIAG_RESULT_TEXT || "", "laboratory", "09026C");
    push(
      "Glu-AC",
      row.s_09005C,
      "mg/dL",
      row.s_09005C_DIAG_RESULT_TEXT || "",
      "laboratory",
      "09005C"
    );
    push("BUN", row.urinE_BUN, "mg/dL", "", "laboratory", "09002C");
    push("Creatinine", row.bloD_CREAT, "mg/dL", "", "laboratory", "09015C");
    push("eGFR", row.egfr, "mL/min/1.73m2", row.rF_DIAG_RESULT_TEXT || "");
    push("Urine Protein", row.urinE_PROTEIN_TEXT || "", "", "");
    push("HBsAg", row.hbsaG_TEXT || "", "", row.hbV_RESULT_TEXT || "", "laboratory", "14032C");
    push("Anti-HCV", row.antI_HCV_TEXT || "", "", row.hcV_RESULT_TEXT || "", "laboratory", "14051C");
    push("Uric Acid", row.uriC_ACID, "mg/dL", "", "laboratory", "09013C");
    push("\u4EE3\u8B1D\u75C7\u5019\u7FA4\u7BE9\u6AA2 (Metabolic Syndrome Screening)", row.metA_SYNDR_RESULT_TEXT, "", "");
    return out;
  }
  function adaptInpatientEncounter(item, options) {
    if (!item || typeof item !== "object")
      return null;
    const start = rocToISO(item.in_DATE || item.func_DATE || "");
    const end = rocToISO(item.out_DATE || "");
    if (!start)
      return null;
    const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
    const s02Primary = options?.primary_diagnosis;
    const icdCode = s02Primary?.code || item.icd9cm_CODE || item.icd9cm_code || "";
    let icdName;
    let icdName_zh;
    if (s02Primary && (s02Primary.name_en || s02Primary.name_zh)) {
      icdName = s02Primary.name_en || s02Primary.name_zh;
      icdName_zh = s02Primary.name_zh || s02Primary.name_en;
    } else {
      const rawIcdName = item.icd9cm_CODE_CNAME || item.icd9cm_name || "";
      icdName = stripIcdPrefix(pickEnglish(rawIcdName));
      icdName_zh = stripIcdPrefix(pickChinese(rawIcdName));
    }
    const _channel = item.ori_type_name || item.orI_TYPE_NAME || "\u7533\u5831\u8CC7\u6599";
    return {
      date: start,
      end_date: end,
      class: "IMP",
      kind: "\u4F4F\u9662",
      channel: _channel,
      type_display: "\u4F4F\u9662",
      department: "",
      provider: "",
      reason: icdName ? icdCode ? `${icdCode} ${icdName}` : icdName : "",
      reason_zh: icdName_zh ? icdCode ? `${icdCode} ${icdName_zh}` : icdName_zh : "",
      reason_code: icdCode,
      secondary_diagnoses: options && Array.isArray(options.secondary_diagnoses) ? options.secondary_diagnoses : [],
      hospital: item.hosp_ABBR || item.hosp_abbr || "",
      row_id: item.row_ID || item.row_id || ""
    };
  }
  function adaptEncounterFromMedExpense(item, classHint, options) {
    if (!item || typeof item !== "object")
      return null;
    const date = rocToISO(item.funC_DATE || item.func_DATE || item.func_date || "");
    if (!date)
      return null;
    const stripIcdPrefix = (s) => s.replace(/^[A-Z0-9.]+\/\s*/, "");
    const s02Primary = options?.primary_diagnosis;
    const icdCode = s02Primary?.code || item.icD9CM_CODE || item.icd9cm_CODE || item.icd9cm_code || "";
    let icdName;
    let icdName_zh;
    if (s02Primary && (s02Primary.name_en || s02Primary.name_zh)) {
      icdName = s02Primary.name_en || s02Primary.name_zh;
      icdName_zh = s02Primary.name_zh || s02Primary.name_en;
    } else {
      const rawIcdName = item.icD9CM_CODE_CNAME || item.icd9cm_CODE_CNAME || item.icd9cm_name || "";
      icdName = stripIcdPrefix(pickEnglish(rawIcdName));
      icdName_zh = stripIcdPrefix(pickChinese(rawIcdName));
    }
    const hospital = item.hosP_ABBR || item.hosp_ABBR || item.hosp_abbr || "";
    const isPharmacy = options && options.pharmacy === true || /藥局|藥房/.test(hospital);
    const _channel = item.ori_type_name || item.orI_TYPE_NAME || "";
    const _kind = isPharmacy ? "\u85E5\u5C40" : classHint === "EMER" ? "\u6025\u8A3A" : classHint === "IMP" ? "\u4F4F\u9662" : "\u9580\u8A3A";
    return {
      date,
      end_date: "",
      class: classHint || "AMB",
      kind: _kind,
      channel: _channel,
      // Legacy single-string field. The mapper now reads kind + channel
      // and ignores this when either is set; kept here so external
      // consumers that grep the adapter output don't suddenly break.
      type_display: isPharmacy ? "\u85E5\u5C40" : _channel,
      department: "",
      provider: "",
      // English reason (clinical) and Chinese reason (patient-facing) are
      // sourced from the same bilingual NHI field; mapper places English
      // into reasonCode[0].coding[0].display and Chinese into .text.
      reason: icdName ? icdCode ? `${icdCode} ${icdName}` : icdName : "",
      reason_zh: icdName_zh ? icdCode ? `${icdCode} ${icdName_zh}` : icdName_zh : "",
      reason_code: icdCode,
      // Secondary diagnoses (次診斷) come from IHKE3303S02 detail fan-out
      // — list endpoint only exposes the primary ICD. The mapper appends
      // one Encounter.reasonCode[] entry per secondary, preserving order
      // (primary first, then 次診斷1, 2, 3, ... up to 4 observed in live
      // NHI data). Empty array when caller didn't fetch detail or NHI
      // returned no secondaries.
      secondary_diagnoses: options && Array.isArray(options.secondary_diagnoses) ? options.secondary_diagnoses : [],
      hospital,
      // Pass through for the eventual IHKE3303S02 detail fetch (Phase B).
      row_id: item.roW_ID || item.row_id || ""
    };
  }
  function adaptImmunization(item) {
    if (!item || typeof item !== "object")
      return null;
    const date = rocToISO(item.inoculatE_D || item.inoculate_d || "");
    const rawName = String(item.codE_CNAME || item.code_cname || "").trim();
    if (!date || !rawName)
      return null;
    const lotMatch = rawName.match(/[（(]\s*批號\s*([^)）]+?)\s*[)）]/);
    const lotNumber = lotMatch ? lotMatch[1].trim() : "";
    const cleanName = rawName.replace(/[（(]\s*批號\s*[^)）]+\s*[)）]/, "").trim();
    return {
      date,
      vaccine_name: cleanName || rawName,
      lot_number: lotNumber,
      hospital: item.hosP_ABBR || item.hosp_abbr || "",
      // NHI's source-of-record marker; preserved on the resource as
      // performer-org context (疾病管制署 = Taiwan CDC).
      source: item.source || ""
    };
  }
  function adaptCarePlan(item) {
    if (!item || typeof item !== "object")
      return null;
    const title = String(item.mhbt_name || item.mhbT_NAME || "").trim();
    if (!title)
      return null;
    const start = rocChineseToISO(item.case_date || item.casE_DATE || "");
    const end = rocChineseToISO(item.close_date || item.closE_DATE || "");
    return {
      title,
      description: String(item.mhbt_memo || item.mhbT_MEMO || "").trim(),
      period_start: start,
      period_end: end,
      // A 結案日 means the programme has ended.
      status: end ? "completed" : "active",
      hospital: String(item.hosp_abbr || item.hosP_ABBR || "").trim(),
      hospital_id: String(item.hosp_id || item.hosP_ID || "").trim(),
      // NHI programme code, when present (e.g. "IHKE3505S01"). `prgcode` is
      // often null — `|| ""` collapses null/undefined cleanly. Surfaced as a
      // CarePlan.category coding downstream.
      program_code: String(item.prgcode || item.prgCode || item.prgCODE || "").trim()
    };
  }
  function adaptAllergy(item) {
    if (!item || typeof item !== "object")
      return null;
    const allergen = item.allergen_name || item.alleR_NAME || item.medname || item.druG_NAME || item.allergen || "";
    if (!allergen)
      return null;
    return {
      recorded_date: rocToISO(item.funC_DATE || item.recorD_DATE || ""),
      display: allergen,
      category: "medication",
      criticality: "unable-to-assess",
      reaction: item.reactioN || item.symptom || ""
    };
  }
  function adaptProcedureListStub() {
    return null;
  }
  function adaptProcedureFromDetail(item) {
    if (!item || typeof item !== "object")
      return null;
    const subList = Array.isArray(item.sp_IHKE3308S04_data_list) ? item.sp_IHKE3308S04_data_list : [];
    const exeDate = subList.length > 0 ? subList[0].exe_S_DATE || subList[0].exe_s_date || "" : "";
    const date = rocToISO(exeDate || item.func_DATE || item.func_date || "");
    const opCode = item.op_CODE || item.op_code || "";
    const rawOpName = item.op_CODE_CNAME || item.op_code_cname || "";
    const opName = pickEnglish(rawOpName);
    const opName_zh = pickChinese(rawOpName);
    const stripCode = (s) => (s || "").replace(/^[A-Z0-9]+\//, "").trim();
    const display = stripCode(opName) || opName.trim();
    const display_zh = stripCode(opName_zh);
    if (!date || !display)
      return null;
    const reasonCode = item.icd9cm_CODE || item.icd9cm_code || "";
    const reasonName = (pickEnglish(item.icd9cm_CODE_CNAME || item.icd9cm_code_cname || "") || "").replace(/^[A-Z0-9]+\//, "").trim();
    const noteParts = [];
    if (reasonName) {
      noteParts.push(reasonCode ? `Reason: ${reasonCode} ${reasonName}` : `Reason: ${reasonName}`);
    }
    for (const sub of subList) {
      const subName = pickEnglish(sub.order_CODE_NAME || sub.order_code_name || "").trim();
      const subCode = sub.order_CODE || sub.order_code || "";
      if (subName) {
        noteParts.push(subCode ? `\u65BD\u4F5C: ${subName} (NHI ${subCode})` : `\u65BD\u4F5C: ${subName}`);
      }
    }
    return {
      date,
      code: opCode,
      // Hint for mapProcedure.mapSystem — "icd-10-pcs" string contains
      // "icd", so the mapper assigns systems.ICD_10_PCS.
      system: opCode ? "icd-10-pcs" : "",
      display,
      display_zh,
      note: noteParts.join(" / "),
      body_site: "",
      hospital: item.hosp_ABBR || item.hosp_abbr || ""
    };
  }
  function adaptImagingReportFromDetail(item, ctx) {
    if (!item || typeof item !== "object")
      return null;
    const date = rocToISO(
      item.real_INSPECT_DATE || item.real_inspect_date || item.main_tit || item.main_TIT || item.func_DATE || item.func_date || ""
    );
    const display = pickEnglish(item.order_NAME || item.order_name || "");
    const conclusion = (item.desc || "").trim();
    if (!date || !display || !conclusion)
      return null;
    return {
      date,
      code: item.order_CODE || item.order_code || "",
      system: "",
      display,
      category: "RAD",
      conclusion,
      hospital: item.hosp_ABBR || item.hosp_abbr || "",
      // NHI separates the exam date (func_DATE) from the report-upload
      // timestamp (assay_UPLOAD_DATE). The latter is when the report
      // was finalised in NHI's system — maps to DiagnosticReport.issued.
      // Falls back to None if NHI didn't ship one.
      issued: rocToISO((item.assay_UPLOAD_DATE || "").split(/\s+/)[0]),
      // Per-row routing keys for the imaging-JPEG opt-in flow. Always
      // emitted so a post-fetch step can match jpegResults back onto the
      // exact narrative this came from (multiple rows share order_CODE).
      rid: ctx?.rid || "",
      ctype: ctx?.ctype || ""
    };
  }
  function adaptImageOnlyReportFromMeta(meta, ctx) {
    if (!meta)
      return null;
    const date = rocToISO(meta.date || meta.funcDate || "");
    const display = pickEnglish(meta.orderName || "");
    if (!date || !display)
      return null;
    return {
      date,
      code: meta.orderCode || "",
      system: "",
      display,
      category: "RAD",
      conclusion: "",
      hospital: meta.hospital || "",
      issued: rocToISO((meta.assayUploadDate || "").split(/\s+/)[0]),
      rid: ctx?.rid || "",
      ctype: ctx?.ctype || "",
      imageOnly: true
    };
  }

  // src/nhi-endpoints.ts
  var ENDPOINT_LABEL_ZH = {
    encounters: "\u5C31\u91AB",
    inpatient: "\u4F4F\u9662",
    inpatient_legacy: "\u4F4F\u9662\uFF08\u820A\uFF09",
    procedures: "\u624B\u8853 / \u8655\u7F6E",
    medications: "\u8655\u65B9\u85E5\u54C1",
    chronic_prescriptions: "\u6162\u6027\u8655\u65B9\u7B8B",
    allergies: "\u85E5\u7269\u904E\u654F",
    allergies_b: "\u85E5\u7269\u904E\u654F\uFF08B\uFF09",
    adult_preventive: "\u6210\u4EBA\u5065\u6AA2",
    cancer_screening: "\u764C\u75C7\u7BE9\u6AA2",
    imaging: "\u5F71\u50CF\u6AA2\u67E5",
    other_labs: "\u6AA2\u9A57",
    catastrophic_illness: "\u91CD\u5927\u50B7\u75C5",
    immunizations: "\u75AB\u82D7",
    care_plans: "\u7167\u8B77\u8A08\u756B"
  };
  var NHI_API_ENDPOINTS = [
    // encounters / procedures don't have a /search variant (404). page_load
    // silently ignores s_date / e_date — verified the array length is
    // identical with or without dates. Date filter is effectively unsupported
    // for these endpoints; they return all data in NHI's lifetime window.
    // Encounter source: IHKE3303S01 (醫療費用申報). The /page_load variant
    // is window-limited to ~1 year (returned 51 visits ending 114/05);
    // /search accepts s_date / e_date and goes back further (162 visits
    // to 112/05 for the same patient). Since labs/meds extend to 3y via
    // their own /search endpoints, encounter MUST also use /search or
    // the (hospital, date) linker has nothing to match against for older
    // lab dates.
    {
      name: "encounters",
      path: "/api/ihke3000/ihke3303s01/search?s_date=&e_date=",
      page_type: "encounters",
      adapt: adaptEncounterFromMedExpense,
      supportsDateRange: true
    },
    // Inpatient (住院) — IHKE3309S01 is the primary list with in_DATE/out_DATE
    // span. IHKE3308S01 carries a small set of older 住院 records with the
    // same fields (func_DATE in some rows instead of in_DATE; adapter
    // handles both). Both feed the same encounter mapper.
    {
      name: "inpatient",
      path: "/api/ihke3000/ihke3309s01/page_load",
      page_type: "encounters",
      adapt: adaptInpatientEncounter
    },
    {
      name: "inpatient_legacy",
      path: "/api/ihke3000/ihke3308s01/page_load",
      page_type: "encounters",
      adapt: adaptInpatientEncounter
    },
    // Procedures (IHKE3301S05) list only has order-level metadata —
    // no ICD-10-PCS code and no actual performed-date. The full
    // record lives at IHKE3308S02 (sub-list carries exe_S_DATE +
    // NHI 醫令碼 per execution). Same 2-step fan-out pattern as
    // imaging; see _fetchProcedureDetailsInTab.
    {
      name: "procedures",
      path: "/api/ihke3000/ihke3301s05/page_load",
      page_type: "procedures",
      adapt: adaptProcedureListStub
    },
    // medications: page_load only accepts empty dates (HTTP 400 otherwise).
    // The /search endpoint is what the SPA hits when user picks a custom
    // date range and accepts ISO 西元 dates with dashes (2023-01-01).
    // Confirmed via DevTools observation of the 篩選 panel submit.
    {
      name: "medications",
      path: "/api/ihke3000/ihke3306s01/search?s_date=&e_date=&s_sort=A1&s_type=A",
      page_type: "medications",
      adapt: adaptMedication,
      supportsDateRange: true
    },
    // 慢性處方箋 (refill="Y") — separate list endpoint from medications.
    // ~52 of 126 entries overlap with IHKE3306S01; the rest are
    // chronic-only and would be missed if we relied on regular list alone.
    // The chronic detail fan-out runs BEFORE the medication fan-out and
    // its row_IDs are passed to the medication fan-out as skip-set so
    // each row is fetched once. See _fetchChronicMedicationDetailsInTab
    // in background.js. Detail endpoint is the same IHKE3306S02 as
    // regular meds; ctype must equal the list row's ori_TYPE (1=門診,
    // 2=IC卡, 8=藥局), not hardcoded to 8.
    {
      name: "chronic_prescriptions",
      path: "/api/ihke3000/IHKE3307S01/page_load",
      page_type: "medications",
      adapt: adaptChronicListStub
    },
    {
      name: "allergies",
      path: "/api/ihke3000/ihke3202s01/SP_IHKE3202S01",
      page_type: "allergies",
      adapt: adaptAllergy
    },
    {
      name: "allergies_b",
      path: "/api/ihke3000/ihke3202s01/SP_IHKE3202S04",
      page_type: "allergies",
      adapt: adaptAllergy
    },
    // 成人預防保健結果 (IHKE3402S01): one row per screening, contains
    // BMI / vitals / lipid panel / LFT / RFT / Hep B/C / uric acid all
    // pre-computed by NHI's screening programme. adaptAdultPreventive
    // returns an array (one Observation per measurement) so the
    // adapter-call loop flattens it.
    {
      name: "adult_preventive",
      path: "/api/ihke3000/ihke3402s01/SP_IHKE3402S01",
      page_type: "observations",
      adapt: adaptAdultPreventive
    },
    {
      name: "cancer_screening",
      path: "/api/ihke3000/ihke3404s01/SP_IHKE3404S01",
      page_type: "observations",
      adapt: adaptLabItem
    },
    // glucose (IHKE3406S01) + lipid (IHKE3407S01) are subsets of
    // other_labs (IHKE3409S01) per NHI's data model — fetching them
    // separately just creates dup observations, so we skip them.
    // Imaging list (IHKE3408S01) only carries order-level data; full
    // narrative report lives at IHKE3408S02. We do a 2-step fetch (see
    // _fetchImagingDetailsInTab) to grab the report, then map to a real
    // DiagnosticReport. The list adapter is a no-op stub like medications.
    // imaging: search endpoint accepts ISO date range like medications.
    {
      name: "imaging",
      path: "/api/ihke3000/ihke3408s01/search?s_type=&s_date=&e_date=&s_sort=A1",
      page_type: "diagnostic_reports",
      adapt: adaptImagingListStub,
      supportsDateRange: true
    },
    // other_labs already uses /search; same ISO-dash date format works.
    {
      name: "other_labs",
      path: "/api/ihke3000/ihke3409s01/search?s_type=&s_date=&e_date=&s_sort=A1",
      page_type: "observations",
      adapt: adaptLabItem,
      supportsDateRange: true
    },
    // IHKE3209S01 (重大傷病) — NHI-vetted catastrophic-illness registry.
    // Each row → a FHIR Condition with category=problem-list-item, the
    // closest 健康存摺 equivalent to a curated problem list. Endpoint
    // doesn't accept date params (NHI returns currently-valid certs only).
    {
      name: "catastrophic_illness",
      path: "/api/ihke3000/ihke3209s01/SP_IHKE3209S01",
      page_type: "conditions",
      adapt: adaptCatastrophicIllness
    },
    // IHKE3203S01 (預防接種紀錄 / 疫苗) — Taiwan CDC sourced. Each row
    // → FHIR Immunization. NHI ships Chinese-only vaccine names with
    // batch number inlined as "(批號XXX)"; adapter splits the lot.
    // No date range parameter (NHI returns all historical vaccinations).
    {
      name: "immunizations",
      path: "/api/ihke3000/ihke3203s01/SP_IHKE3203S01",
      page_type: "immunizations",
      adapt: adaptImmunization
    },
    // IHKE3213S01 (我參與的照護計畫) — NHI case-management / 衛教 programme
    // enrolments. Each myplan[] row → a FHIR CarePlan. The page_load
    // response also carries physiology / bloodsugar / bloodlipid widget
    // arrays; adaptCarePlan keys off mhbt_name so only the care-plan rows
    // produce resources (extractList merges all data arrays). No date-range
    // param — NHI returns the patient's full enrolment history.
    {
      name: "care_plans",
      path: "/api/ihke3000/IHKE3213S01/page_load",
      page_type: "care_plans",
      adapt: adaptCarePlan
    }
  ];

  // src/background/patient-override.ts
  function applyDateRangeToPath(path, dateRange) {
    if (!dateRange || !dateRange.start && !dateRange.end)
      return path;
    const s = (dateRange.start || "").slice(0, 10);
    const e = (dateRange.end || "").slice(0, 10);
    let p = path;
    if (/[?&]s_date=/.test(p)) {
      p = p.replace(/([?&]s_date=)[^&]*/, `$1${s}`);
    } else {
      p += `${p.includes("?") ? "&" : "?"}s_date=${s}`;
    }
    if (/[?&]e_date=/.test(p)) {
      p = p.replace(/([?&]e_date=)[^&]*/, `$1${e}`);
    } else {
      p += `&e_date=${e}`;
    }
    return p;
  }
  async function isMaskEnabled() {
    try {
      const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
      return maskNameEnabled === true;
    } catch {
      return false;
    }
  }
  function buildOverridePatient(ov, maskEnabled) {
    const displayName = maskEnabled ? maskName(ov.name || "") : ov.name || "";
    const raw = {
      id: ov.id_no,
      identifier: ov.id_no,
      name: displayName || ov.id_no
    };
    if (ov.birth_date)
      raw.birthDate = ov.birth_date;
    if (ov.gender)
      raw.gender = ov.gender;
    return mapPatient(raw);
  }
  function replaceNameDeep(value, needle, replacement) {
    if (!needle || needle === replacement)
      return value;
    if (typeof value === "string")
      return value.split(needle).join(replacement);
    if (Array.isArray(value))
      return value.map((v) => replaceNameDeep(v, needle, replacement));
    if (value && typeof value === "object") {
      const out = {};
      for (const k in value)
        out[k] = replaceNameDeep(value[k], needle, replacement);
      return out;
    }
    return value;
  }

  // src/background/bundle.ts
  function assembleLocalBundle(byType, patientOverride, maskEnabled) {
    const patient = buildOverridePatient(patientOverride, maskEnabled);
    const pid = patient.id;
    const all = [patient];
    for (const pt of LOCAL_PAGE_TYPE_ORDER) {
      const items = byType[pt];
      if (!items || items.length === 0)
        continue;
      let mapped;
      if (GROUP_HANDLERS[pt]) {
        mapped = GROUP_HANDLERS[pt](items, pid);
      } else if (LIST_HANDLERS[pt]) {
        const [fn] = LIST_HANDLERS[pt];
        mapped = items.filter((it) => it && typeof it === "object").map((it) => fn(it, pid)).filter((r) => r !== null);
      } else {
        continue;
      }
      if (pt === "encounters")
        mapped = dedupAdmissionDayAmb(mapped);
      all.push(...mapped);
    }
    const seen = /* @__PURE__ */ new Set();
    const unique = [];
    for (const r of all) {
      const key = `${r.resourceType}/${r.id}`;
      if (seen.has(key))
        continue;
      seen.add(key);
      unique.push(r);
    }
    linkEncountersInResources(unique, unique);
    resolveSexStratifiedRanges(patient, unique);
    const bridgeVersion = chrome.runtime.getManifest()?.version || "unknown";
    return {
      resourceType: "Bundle",
      type: "collection",
      timestamp: (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d+Z$/, "Z"),
      meta: {
        tag: [
          {
            system: "https://github.com/voho0000/NHI-FHIR-BRIDGE/bridge-version",
            code: bridgeVersion,
            display: `NHI-FHIR-Bridge v${bridgeVersion}`
          }
        ]
      },
      entry: unique.map((r) => ({
        fullUrl: `${r.resourceType}/${r.id}`,
        resource: r
      }))
    };
  }
  async function stashFhirBundle(bundle, patientId, dateRange, fetchImagingEnabled = false) {
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const maskedPid = maskId(patientId || "unknown", "X");
    const safePid = maskedPid.replace(/[^A-Za-z0-9_-]/g, "_");
    const compact = (d) => (d || "").slice(0, 10).replace(/-/g, "");
    let s;
    let e;
    if (dateRange && (dateRange.start || dateRange.end)) {
      s = compact(dateRange.start) || fmt(now);
      e = compact(dateRange.end) || fmt(now);
    } else {
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      s = fmt(oneYearAgo);
      e = fmt(now);
    }
    const version = chrome.runtime.getManifest()?.version || "unknown";
    const imgSuffix = fetchImagingEnabled ? "-img" : "";
    const filename = `nhi-${safePid}-${s}-${e}-v${version}${imgSuffix}.json`;
    const json = JSON.stringify(bundle, null, 2);
    const bytes = json.length;
    const entryCount = Array.isArray(bundle?.entry) ? bundle.entry.length : 0;
    await chrome.storage.local.set({
      [PENDING_BUNDLE_KEY]: {
        filename,
        bytes,
        generatedAt: Date.now(),
        patientId: patientId || null,
        hasJson: true,
        entryCount
      },
      [PENDING_BUNDLE_JSON_KEY]: { json }
    });
    return { filename, bytes };
  }

  // src/background/nhi-detail-fetchers.ts
  async function fetchDetailsInTab(tabId, baseUrl, items, spec) {
    if (items.length === 0)
      return [];
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (base, reqs, cfg) => {
        const token = sessionStorage.getItem("token");
        if (!token)
          return { error: "SESSION_EXPIRED" };
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return { error: "SESSION_EXPIRED" };
        }
        const auth = `Bearer ${token}`;
        async function fetchOne(rowId2, ctype) {
          const url = `${base}/api/ihke3000/${cfg.path}/page_load?crid=${encodeURIComponent(rowId2)}&ctype=${encodeURIComponent(ctype)}`;
          const ac = new AbortController();
          const t = setTimeout(() => ac.abort(), 3e4);
          try {
            const r = await fetch(url, {
              method: "GET",
              credentials: "same-origin",
              signal: ac.signal,
              headers: { Accept: "application/json", Authorization: auth }
            });
            clearTimeout(t);
            if (r.status === 401 || r.status === 403)
              return { error: "SESSION_EXPIRED" };
            if (!r.ok)
              return { error: `HTTP ${r.status}` };
            return { body: await r.json() };
          } catch (e) {
            clearTimeout(t);
            return { error: e.name === "AbortError" ? "timeout 30s" : String(e?.message || e) };
          }
        }
        function hasData(body) {
          const main = Array.isArray(body?.[cfg.mainDataKey]) ? body[cfg.mainDataKey] : [];
          if (cfg.presence === "drugs") {
            return main.some(
              (v) => Array.isArray(v?.[cfg.drugListKey]) && v[cfg.drugListKey].length > 0
            );
          }
          return main.length > 0;
        }
        function ctypeSeq(rowCtype) {
          const seq = [];
          if (cfg.useRowCtype && rowCtype)
            seq.push(rowCtype);
          for (const ct of cfg.ctypes) {
            if (!seq.map(String).includes(String(ct)))
              seq.push(ct);
          }
          return seq;
        }
        async function one(rowId2, rowCtype) {
          const seq = ctypeSeq(rowCtype);
          if (cfg.presence === "none")
            return await fetchOne(rowId2, seq[0]);
          let lastOk = null;
          for (const ct of seq) {
            const r = await fetchOne(rowId2, ct);
            if (r.error === "SESSION_EXPIRED")
              return r;
            if (r.error)
              continue;
            if (hasData(r.body))
              return r;
            lastOk = r;
          }
          if (cfg.fallback === "fetch")
            return await fetchOne(rowId2, cfg.fallbackCtype);
          if (cfg.fallback === "last-ok")
            return lastOk || { error: "no detail body" };
          if (cfg.fallback === "null")
            return null;
          return { body: null };
        }
        const out = new Array(reqs.length);
        let next = 0;
        const CONC = 3;
        async function worker() {
          while (next < reqs.length) {
            const i = next++;
            await new Promise((r) => setTimeout(r, Math.random() * 50));
            out[i] = await one(reqs[i].row_ID, reqs[i].ctype);
          }
        }
        const ws = [];
        for (let w = 0; w < CONC && w < reqs.length; w++)
          ws.push(worker());
        await Promise.all(ws);
        return { results: out };
      },
      args: [baseUrl, items, spec]
    });
    if (result?.error === "SESSION_EXPIRED")
      throw new Error(SESSION_EXPIRED_ERROR);
    return result?.results || [];
  }
  var MEDICATION_SPEC = {
    path: "IHKE3306S02",
    mainDataKey: "ihke3306S02_main_data",
    drugListKey: "sp_IHKE3306S03_data_list",
    ctypes: [2, 1, 3, 4],
    useRowCtype: false,
    presence: "drugs",
    fallback: "fetch",
    fallbackCtype: 2
  };
  var CHRONIC_MEDICATION_SPEC = {
    path: "IHKE3306S02",
    mainDataKey: "ihke3306S02_main_data",
    drugListKey: "sp_IHKE3306S03_data_list",
    ctypes: [1, 2, 8, 3, 4],
    useRowCtype: true,
    presence: "drugs",
    fallback: "null"
  };
  var IMAGING_SPEC = {
    path: "IHKE3408S02",
    mainDataKey: "ihke3408S02_main_data",
    ctypes: [],
    useRowCtype: true,
    presence: "none"
  };
  var PROCEDURE_SPEC = {
    path: "IHKE3308S02",
    mainDataKey: "ihke3308S02_main_data",
    ctypes: ["3", "5", "1", "2", "4"],
    useRowCtype: true,
    presence: "main",
    fallback: "last-ok"
  };
  var ENCOUNTER_SPEC = {
    path: "IHKE3303S02",
    mainDataKey: "ihke3303S02_main_data",
    ctypes: [2, 1, 3, 4, 5],
    useRowCtype: false,
    presence: "main",
    fallback: "empty-body"
  };
  var INPATIENT_SPEC = {
    path: "IHKE3309S02",
    mainDataKey: "ihke3309S02_main_data",
    ctypes: [3, 2, 1],
    useRowCtype: false,
    presence: "main",
    fallback: "empty-body"
  };
  function rowId(v) {
    return v.row_ID || v.rowid || v.rowID || "";
  }
  function collectDrugs(results, spec, adaptOpts) {
    const drugs = [];
    for (const r of results) {
      if (!r || r.error || !r.body)
        continue;
      const main = Array.isArray(r.body[spec.mainDataKey]) ? r.body[spec.mainDataKey] : [];
      for (const visit of main) {
        const drugList = Array.isArray(visit[spec.drugListKey]) ? visit[spec.drugListKey] : [];
        for (const d of drugList) {
          const adapted = adaptMedicationFromDetail(d, visit, adaptOpts);
          if (adapted)
            drugs.push(adapted);
        }
      }
    }
    return drugs;
  }
  function byVisitIndex(reqs, results) {
    const byIdx = /* @__PURE__ */ new Map();
    for (let i = 0; i < reqs.length; i++) {
      byIdx.set(reqs[i].idx, results[i]?.body || null);
    }
    return byIdx;
  }
  async function fetchMedicationDetails({ tabId, baseUrl, visits, skipRowIds }) {
    const skip = skipRowIds instanceof Set ? skipRowIds : new Set(skipRowIds || []);
    const reqs = visits.map((v) => ({ row_ID: rowId(v) })).filter((r) => r.row_ID && !skip.has(r.row_ID));
    const results = await fetchDetailsInTab(tabId, baseUrl, reqs, MEDICATION_SPEC);
    return collectDrugs(results, MEDICATION_SPEC, null);
  }
  async function fetchChronicMedicationDetails({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v) => ({ row_ID: rowId(v), ctype: String(v.ori_TYPE || v.ori_type || "") })).filter((r) => r.row_ID);
    const results = await fetchDetailsInTab(tabId, baseUrl, reqs, CHRONIC_MEDICATION_SPEC);
    return collectDrugs(results, CHRONIC_MEDICATION_SPEC, { is_chronic: true });
  }
  async function fetchImagingDetails({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v, listIdx) => ({
      row_ID: rowId(v),
      ctype: v.ori_TYPE || v.ori_type || "A",
      listIdx
    })).filter((r) => r.row_ID);
    const results = await fetchDetailsInTab(tabId, baseUrl, reqs, IMAGING_SPEC);
    const reports = [];
    const jpegCandidates = [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (!r || r.error || !r.body)
        continue;
      const main = Array.isArray(r.body[IMAGING_SPEC.mainDataKey]) ? r.body[IMAGING_SPEC.mainDataKey] : [];
      const ctx = { rid: reqs[i]?.row_ID || "", ctype: String(reqs[i]?.ctype || "") };
      const listRow = visits[reqs[i]?.listIdx ?? -1];
      const status = String(listRow?.jpG_STATUS ?? listRow?.jpg_STATUS ?? listRow?.JPG_STATUS ?? "");
      const listIplSeq = String(
        listRow?.ipL_CASE_SEQ_NO ?? listRow?.ipl_CASE_SEQ_NO ?? listRow?.IPL_CASE_SEQ_NO ?? ""
      );
      const hasReadyBytes = status === "1" && !!listIplSeq && listIplSeq !== "-";
      const isPreparing = status === "0";
      const needsTrigger = status === "A";
      const isCandidate = hasReadyBytes || isPreparing || needsTrigger;
      for (const visit of main) {
        const adapted = adaptImagingReportFromDetail(visit, ctx);
        if (adapted)
          reports.push(adapted);
        if (!isCandidate)
          continue;
        jpegCandidates.push({
          rid: ctx.rid,
          ctype: ctx.ctype,
          iplCaseSeqNo: listIplSeq,
          needsTrigger,
          // v0.15.7: surfaced so pollFetchImagingJpegs categorises this
          // row as "preparing" (try fetch, fall back to waiting) instead
          // of routing it through the cached or trigger paths.
          isPreparing,
          // Index of this row in the IHKE3408S01 list response. NHI's
          // Vue list page renders one 詳細資料 button per row in the
          // same order — so detailBtns[listIdx] in the DOM is THIS
          // row's button. The Vue-click trigger flow uses this to
          // avoid having to introspect Vue's list component state.
          listIdx: reqs[i]?.listIdx ?? -1,
          // mainMeta fed into adaptImageOnlyReportFromMeta when the
          // narrative path returns null but the JPG fetcher succeeds —
          // AND used as the shape-match key in pollFetchImagingJpegs to
          // recover bytes after NHI re-keys the rid post-prep.
          //
          // CRITICAL: shape-match keys (date / orderCode / hospital)
          // MUST come from the S01 list row (listRow) — NOT from the
          // S02 detail body (visit) — because the shapeMap built during
          // the in-loop list refresh ALSO uses S01 fields. If we
          // source mainMeta from S02 and S01 happens to format the
          // same value differently (e.g. hospital name short vs full,
          // date with/without leading zeros), shape match silently fails
          // for that row and bridge wrongly leaves it as triggered-waiting.
          // Verified live 2026-06-05: 2/7 cap=Infinity triggers ended up
          // waiting despite NHI having prep'd them, because S02's hospital
          // / date / code values mismatched S01's. Visit (S02) fallback
          // covers the rare case where listRow doesn't have a field.
          mainMeta: {
            date: listRow?.real_INSPECT_DATE || listRow?.real_inspect_date || visit.real_INSPECT_DATE || visit.real_inspect_date || visit.main_tit || visit.main_TIT || visit.func_DATE || visit.func_date || "",
            orderCode: listRow?.order_CODE || listRow?.order_code || visit.order_CODE || visit.order_code || "",
            orderName: listRow?.order_NAME || listRow?.order_name || visit.order_NAME || visit.order_name || "",
            hospital: listRow?.hosp_ABBR || listRow?.hosp_abbr || visit.hosp_ABBR || visit.hosp_abbr || "",
            assayUploadDate: visit.assay_UPLOAD_DATE || "",
            funcDate: visit.func_DATE || visit.func_date || "",
            radiMsv: visit.radi_MSV || visit.radi_msv || "",
            imgSize: visit.img_SIZE || visit.img_size || ""
          },
          // Whether the narrative adapter produced a DR for this row.
          // When false AND we later land jpgBase64 → synthesize an
          // image-only DR via adaptImageOnlyReportFromMeta.
          hasNarrativeReport: !!adapted
        });
      }
    }
    return { reports, jpegCandidates };
  }
  async function fetchProcedureDetails({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v) => ({
      row_ID: v.row_ID || v.row_id || v.rowid || v.rowID || "",
      ctype: v.ori_type || v.ori_TYPE || ""
    })).filter((r) => r.row_ID);
    const results = await fetchDetailsInTab(tabId, baseUrl, reqs, PROCEDURE_SPEC);
    const procedures = [];
    for (const r of results) {
      if (!r || r.error || !r.body)
        continue;
      const main = Array.isArray(r.body[PROCEDURE_SPEC.mainDataKey]) ? r.body[PROCEDURE_SPEC.mainDataKey] : [];
      for (const row of main) {
        const adapted = adaptProcedureFromDetail(row);
        if (adapted)
          procedures.push(adapted);
      }
    }
    return procedures;
  }
  async function fetchEncounterDetails({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v, idx) => ({ idx, row_ID: v.roW_ID || v.row_ID || "" })).filter((r) => r.row_ID);
    if (reqs.length === 0)
      return /* @__PURE__ */ new Map();
    const results = await fetchDetailsInTab(tabId, baseUrl, reqs, ENCOUNTER_SPEC);
    return byVisitIndex(reqs, results);
  }
  async function fetchInpatientDetails({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v, idx) => ({ idx, row_ID: v.row_ID || v.row_id || v.roW_ID || "" })).filter((r) => r.row_ID);
    if (reqs.length === 0)
      return /* @__PURE__ */ new Map();
    const results = await fetchDetailsInTab(tabId, baseUrl, reqs, INPATIENT_SPEC);
    return byVisitIndex(reqs, results);
  }

  // src/background/sync-state.ts
  var _cancelled = false;
  var _activeSyncCtx = null;
  var _activeImagingTabId = null;
  function isCancelled() {
    return _cancelled;
  }
  function resetCancelled() {
    _cancelled = false;
  }
  function requestCancel() {
    _cancelled = true;
  }
  function getActiveSyncCtx() {
    return _activeSyncCtx;
  }
  function setActiveSyncCtx(ctx) {
    _activeSyncCtx = ctx;
  }
  function getActiveImagingTabId() {
    return _activeImagingTabId;
  }
  function setActiveImagingTabId(tabId) {
    _activeImagingTabId = tabId;
  }
  async function setStatus(partial) {
    if (_cancelled)
      return;
    const prev = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] || {};
    const next = { ...prev, ...partial, ts: Date.now() };
    await chrome.storage.local.set({ [STORAGE_KEY]: next });
    chrome.runtime.sendMessage({ type: "syncProgress", status: next }).catch(() => {
    });
  }
  async function withProgressTimer(makeLabel, fn) {
    const start = Date.now();
    await setStatus({ progress: makeLabel(0) });
    const interval = setInterval(() => {
      const elapsed = Math.round((Date.now() - start) / 1e3);
      setStatus({ progress: makeLabel(elapsed) }).catch(() => {
      });
    }, 3e3);
    try {
      return await fn();
    } finally {
      clearInterval(interval);
    }
  }

  // src/background/nhi-imaging-jpeg.ts
  var POLL_INTERVAL_MS = 15e3;
  var TIMEOUT_MS = 9e4;
  var INITIAL_WAIT_MS = 15e3;
  var MAX_TRIGGER_PER_SYNC_DEV = Number.POSITIVE_INFINITY;
  var SW_TRIGGER_LOOP_WALL_CLOCK_MS = 9e4;
  var SW_TRIGGER_INTER_STEP_MS = 300;
  async function swPostNhiJson(url, body, token, timeoutMs = 15e3) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const r = await fetch(url, {
        method: "POST",
        credentials: "include",
        signal: ac.signal,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(body)
      });
      clearTimeout(t);
      if (r.status === 401 || r.status === 403) {
        return { error: "SESSION_EXPIRED" };
      }
      if (!r.ok)
        return { error: `HTTP ${r.status}` };
      return { body: await r.json() };
    } catch (e) {
      clearTimeout(t);
      return {
        error: e?.name === "AbortError" ? `timeout ${Math.round(timeoutMs / 1e3)}s` : String(e?.message || e)
      };
    }
  }
  async function triggerImagingRowsViaSwFetch(baseUrl, patientId, requests) {
    if (!Array.isArray(requests) || requests.length === 0)
      return [];
    const triggerable = requests.filter((r) => r.needsTrigger);
    const outcomes = requests.map((r) => ({
      rid: r.rid,
      ctype: r.ctype,
      ok: !r.needsTrigger,
      reason: r.needsTrigger ? "not-attempted" : void 0
    }));
    if (triggerable.length === 0)
      return outcomes;
    if (isCancelled())
      throw new Error(CANCEL_ERROR);
    const token = await loadBearerToken(patientId);
    if (!token) {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const triggerStart = Date.now();
    let successfulTriggers = 0;
    const scriptResults = [];
    for (const r of triggerable) {
      if (isCancelled())
        throw new Error(CANCEL_ERROR);
      if (successfulTriggers >= MAX_TRIGGER_PER_SYNC_DEV) {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: false,
          reason: "dev-cap-skipped"
        });
        continue;
      }
      if (Date.now() - triggerStart > SW_TRIGGER_LOOP_WALL_CLOCK_MS) {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: false,
          reason: "trigger-phase-timeout"
        });
        continue;
      }
      const detailUrl = `${baseUrl}/api/ihke3000/IHKE3408S02/page_load?crid=${encodeURIComponent(r.rid)}&ctype=${encodeURIComponent(r.ctype)}`;
      const addUrl = `${baseUrl}/api/ihke3000/IHKE3408S02/add`;
      const setupResp = await swFetchNhiJson(detailUrl, token);
      if (setupResp.error === "SESSION_EXPIRED") {
        throw new Error(SESSION_EXPIRED_ERROR);
      }
      if (setupResp.error) {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: false,
          reason: `setup-get-error: ${setupResp.error}`
        });
        continue;
      }
      const setupMain = setupResp.body?.ihke3408S02_main_data?.[0];
      const setupStatus = String(setupMain?.jpg_STATUS ?? "");
      if (setupStatus === "0") {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: true,
          reason: "already-preparing",
          newStatus: "0"
        });
        successfulTriggers++;
        continue;
      }
      if (setupStatus === "1") {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: true,
          reason: "already-ready",
          newStatus: "1"
        });
        successfulTriggers++;
        continue;
      }
      const rownum = setupMain?.rownum;
      if (!rownum || typeof rownum !== "string") {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: false,
          reason: "no-rownum-in-detail-body"
        });
        continue;
      }
      await sleep(SW_TRIGGER_INTER_STEP_MS);
      const addResp = await swPostNhiJson(addUrl, { ipl_CASE_SEQ_NO: rownum }, token);
      if (addResp.error === "SESSION_EXPIRED") {
        throw new Error(SESSION_EXPIRED_ERROR);
      }
      if (addResp.error) {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: false,
          reason: `add-post-error: ${addResp.error}`
        });
        continue;
      }
      const ackStatus = String(addResp.body?.status ?? "");
      if (ackStatus && ackStatus !== "Y") {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: false,
          reason: `add-rejected-${ackStatus}`
        });
        continue;
      }
      await sleep(SW_TRIGGER_INTER_STEP_MS);
      const verifyResp = await swFetchNhiJson(detailUrl, token);
      if (verifyResp.error === "SESSION_EXPIRED") {
        throw new Error(SESSION_EXPIRED_ERROR);
      }
      if (verifyResp.error) {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: true,
          reason: `verify-${verifyResp.error}`
        });
        successfulTriggers++;
        continue;
      }
      const main = verifyResp.body?.ihke3408S02_main_data?.[0];
      const newStatus = String(main?.jpg_STATUS ?? "");
      if (newStatus === "0") {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: true,
          reason: "trigger-confirmed",
          newStatus
        });
        successfulTriggers++;
      } else if (newStatus === "1") {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: true,
          reason: "trigger-already-ready",
          newStatus
        });
        successfulTriggers++;
      } else if (newStatus === "A") {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: false,
          reason: "direct-api-silent-fail",
          newStatus
        });
      } else {
        scriptResults.push({
          rid: r.rid,
          ctype: r.ctype,
          ok: false,
          reason: `nhi-unexpected-status-${newStatus || "blank"}`,
          newStatus
        });
      }
    }
    for (const sr of scriptResults) {
      const i = requests.findIndex((x) => x.rid === sr.rid && x.ctype === sr.ctype);
      if (i >= 0) {
        outcomes[i].ok = sr.ok;
        outcomes[i].reason = sr.reason;
      }
    }
    return outcomes;
  }
  async function pollFetchImagingJpegs(tabId, baseUrl, requests, triggerOutcomes) {
    if (!Array.isArray(requests) || requests.length === 0)
      return [];
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (base, reqs, outcomes, tuning) => {
        const token = sessionStorage.getItem("token");
        if (!token)
          return { error: "SESSION_EXPIRED" };
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return { error: "SESSION_EXPIRED" };
        }
        const auth = `Bearer ${token}`;
        const out = reqs.map((r) => ({
          rid: r.rid,
          ctype: r.ctype,
          iplCaseSeqNo: r.iplCaseSeqNo || null,
          jpgBase64s: [],
          outcome: "triggered-waiting"
        }));
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        async function httpGetJson(url) {
          const ac = new AbortController();
          const t = setTimeout(() => ac.abort(), 3e4);
          try {
            const r = await fetch(url, {
              method: "GET",
              credentials: "same-origin",
              signal: ac.signal,
              headers: {
                Accept: "application/json",
                Authorization: auth,
                "X-Requested-With": "XMLHttpRequest"
              }
            });
            clearTimeout(t);
            if (r.status === 401 || r.status === 403) {
              return { error: "SESSION_EXPIRED" };
            }
            if (!r.ok)
              return { error: `HTTP ${r.status}` };
            return { body: await r.json() };
          } catch (e) {
            clearTimeout(t);
            return {
              error: e?.name === "AbortError" ? "timeout 30s" : String(e?.message || e)
            };
          }
        }
        function readBase64Jpgs(body) {
          if (!body || typeof body !== "object")
            return [];
          if (Array.isArray(body.pics) && body.pics.length > 0) {
            const acc = [];
            for (const p of body.pics) {
              if (typeof p === "string" && p.length > 1e3)
                acc.push(p);
            }
            if (acc.length > 0)
              return acc;
          }
          for (const k of ["img", "imG", "jpg", "base64", "imgBase64", "data"]) {
            const v = body[k];
            if (typeof v === "string" && v.length > 1e3)
              return [v];
          }
          return [];
        }
        async function fetchJpg(seqNo) {
          const u = `${base}/api/ihke3000/IHKE3408S03/page_load?IPL_CASE_SEQ_NO=${encodeURIComponent(seqNo)}`;
          return await httpGetJson(u);
        }
        const STEP_A_BATCH_SIZE = 5;
        const STEP_A_RETRY_ATTEMPTS = 2;
        const STEP_C_BATCH_SIZE = 5;
        async function runBatched(items, size, fn) {
          const results = [];
          for (let i = 0; i < items.length; i += size) {
            const batchResults = await Promise.all(items.slice(i, i + size).map(fn));
            for (const r of batchResults)
              results.push(r);
          }
          return results;
        }
        function isTransientFetchError(errStr, gotBodyButNoBase64) {
          if (gotBodyButNoBase64)
            return true;
          if (!errStr)
            return false;
          return errStr.includes("timeout") || errStr.includes("HTTP 5") || errStr.includes("HTTP 429") || errStr.includes("Failed to fetch") || errStr.includes("NetworkError");
        }
        async function fetchJpgWithRetry(seqNo, attempts) {
          let lastErr = "";
          for (let attempt = 1; attempt <= attempts; attempt++) {
            const r = await fetchJpg(seqNo);
            if (r.error === "SESSION_EXPIRED")
              return r;
            if (!r.error) {
              const b64s = readBase64Jpgs(r.body);
              if (b64s.length > 0)
                return { body: r.body, b64s };
              if (attempt < attempts && isTransientFetchError("", true)) {
                await sleep(1500);
                continue;
              }
              return { error: "no base64 in response" };
            }
            lastErr = String(r.error);
            if (attempt < attempts && isTransientFetchError(lastErr, false)) {
              await sleep(1500);
              continue;
            }
            return { error: lastErr };
          }
          return { error: lastErr || "exhausted retries" };
        }
        async function refreshSeqMap() {
          const url = `${base}/api/ihke3000/ihke3408s01/page_load?s_type=&s_sort=A1&_=${Date.now()}`;
          const r = await httpGetJson(url);
          if (r.error || !r.body)
            return /* @__PURE__ */ new Map();
          const list = r.body.sp_IHKE3408S01_data || [];
          const m = /* @__PURE__ */ new Map();
          for (const row of list) {
            const seq = String(row?.ipL_CASE_SEQ_NO ?? row?.ipl_CASE_SEQ_NO ?? "");
            if (seq && seq !== "-" && row?.row_ID) {
              m.set(String(row.row_ID), seq);
            }
          }
          return m;
        }
        const readyIdx = [];
        const preparingIdx = [];
        const triggeredIdx = [];
        for (let i = 0; i < reqs.length; i++) {
          const r = reqs[i];
          const outc = outcomes[i];
          if (r.isPreparing) {
            preparingIdx.push(i);
          } else if (!r.needsTrigger) {
            readyIdx.push(i);
          } else if (outc?.ok) {
            triggeredIdx.push(i);
          } else {
            out[i].outcome = "trigger-failed";
            out[i].error = outc?.reason || "unknown";
          }
        }
        const stepAItems = [
          ...readyIdx.map((i) => ({ i, isPreparingRow: false })),
          ...preparingIdx.map((i) => ({ i, isPreparingRow: true }))
        ];
        await runBatched(stepAItems, STEP_A_BATCH_SIZE, async (it) => {
          const seqNo = reqs[it.i].iplCaseSeqNo;
          if (!seqNo || seqNo === "-") {
            if (it.isPreparingRow) {
              out[it.i].outcome = "triggered-waiting";
              out[it.i].error = "preparing-no-seq";
            } else {
              out[it.i].outcome = "fetch-failed";
              out[it.i].error = "missing seq for ready row";
            }
            return;
          }
          const r = await fetchJpgWithRetry(seqNo, STEP_A_RETRY_ATTEMPTS);
          if (r.error === "SESSION_EXPIRED")
            return;
          if (r.error) {
            if (it.isPreparingRow) {
              out[it.i].outcome = "triggered-waiting";
              out[it.i].error = `preparing: ${r.error}`;
            } else {
              out[it.i].outcome = "fetch-failed";
              out[it.i].error = r.error;
            }
            return;
          }
          if (!r.b64s || r.b64s.length === 0) {
            if (it.isPreparingRow) {
              out[it.i].outcome = "triggered-waiting";
              out[it.i].error = "preparing: no bytes yet";
            } else {
              out[it.i].outcome = "fetch-failed";
              out[it.i].error = "no base64 in response";
            }
            return;
          }
          out[it.i].outcome = "ready";
          out[it.i].jpgBase64s = r.b64s;
        });
        const t0 = Date.now();
        if (triggeredIdx.length > 0) {
          await sleep(tuning.initialWaitMs);
        }
        async function refreshSeqMapAndShapeMap() {
          const url = `${base}/api/ihke3000/ihke3408s01/page_load?s_type=&s_sort=A1&_=${Date.now()}`;
          const r = await httpGetJson(url);
          const seqMap = /* @__PURE__ */ new Map();
          const shapeMap = /* @__PURE__ */ new Map();
          if (r.error || !r.body)
            return { seqMap, shapeMap };
          const list = r.body.sp_IHKE3408S01_data || [];
          for (const row of list) {
            const seq = String(row?.ipL_CASE_SEQ_NO ?? row?.ipl_CASE_SEQ_NO ?? "");
            const rid = String(row?.row_ID ?? "");
            if (seq && seq !== "-" && rid) {
              seqMap.set(rid, seq);
              const status = String(row?.jpG_STATUS ?? row?.jpg_STATUS ?? "");
              const oriType = String(row?.ori_TYPE ?? row?.ori_type ?? "");
              if (status === "1" && oriType === "E") {
                const code = String(row?.order_CODE ?? row?.order_code ?? "");
                const date = String(row?.real_INSPECT_DATE ?? row?.real_inspect_date ?? "");
                const hospital = String(row?.hosp_ABBR ?? row?.hosp_abbr ?? "");
                const sig = `${code}|${date}|${hospital}|${oriType}`;
                if (!shapeMap.has(sig))
                  shapeMap.set(sig, []);
                shapeMap.get(sig).push({ rid, seq });
              }
            }
          }
          return { seqMap, shapeMap };
        }
        const consumedRids = /* @__PURE__ */ new Set();
        for (let i = 0; i < reqs.length; i++) {
          if (!reqs[i].needsTrigger && reqs[i].rid) {
            consumedRids.add(String(reqs[i].rid));
          }
        }
        function resolveSeqForReq(req, seqMap, shapeMap) {
          const directSeq = seqMap.get(String(req.rid));
          if (directSeq) {
            consumedRids.add(String(req.rid));
            return { seq: directSeq, rid: String(req.rid) };
          }
          const meta = req.mainMeta || {};
          const sig = `${meta.orderCode || ""}|${meta.date || ""}|${meta.hospital || ""}|${req.ctype || ""}`;
          const candidates = shapeMap.get(sig);
          if (!candidates || candidates.length === 0)
            return null;
          for (const c of candidates) {
            if (!consumedRids.has(c.rid)) {
              consumedRids.add(c.rid);
              return c;
            }
          }
          return null;
        }
        const pending = [...triggeredIdx];
        while (pending.length > 0 && Date.now() - t0 < tuning.timeoutMs) {
          const { seqMap, shapeMap } = await refreshSeqMapAndShapeMap();
          const stillPending = [];
          const assignments = [];
          for (const i of pending) {
            const r = resolveSeqForReq(reqs[i], seqMap, shapeMap);
            if (r)
              assignments.push({ i, seq: r.seq, rid: r.rid });
            else
              stillPending.push(i);
          }
          await runBatched(assignments, STEP_C_BATCH_SIZE, async (a) => {
            const r = await fetchJpg(a.seq);
            if (r.error === "SESSION_EXPIRED") {
              stillPending.push(a.i);
              return;
            }
            if (r.error) {
              stillPending.push(a.i);
              return;
            }
            const b64s = readBase64Jpgs(r.body);
            if (b64s.length > 0) {
              out[a.i].iplCaseSeqNo = a.seq;
              out[a.i].outcome = "triggered-ready";
              out[a.i].jpgBase64s = b64s;
            } else {
              stillPending.push(a.i);
            }
          });
          pending.length = 0;
          pending.push(...stillPending);
          if (pending.length === 0)
            break;
          await sleep(tuning.pollIntervalMs);
        }
        if (pending.length > 0) {
          const { seqMap, shapeMap } = await refreshSeqMapAndShapeMap();
          const assignments = [];
          for (const i of pending) {
            const r = resolveSeqForReq(reqs[i], seqMap, shapeMap);
            if (r)
              assignments.push({ i, seq: r.seq, rid: r.rid });
          }
          await runBatched(assignments, STEP_C_BATCH_SIZE, async (a) => {
            const r = await fetchJpg(a.seq);
            if (r.error)
              return;
            const b64s = readBase64Jpgs(r.body);
            if (b64s.length > 0) {
              out[a.i].iplCaseSeqNo = a.seq;
              out[a.i].outcome = "triggered-ready";
              out[a.i].jpgBase64s = b64s;
            }
          });
        }
        return { results: out };
      },
      args: [
        baseUrl,
        requests,
        triggerOutcomes,
        {
          initialWaitMs: INITIAL_WAIT_MS,
          pollIntervalMs: POLL_INTERVAL_MS,
          timeoutMs: TIMEOUT_MS
        }
      ]
    });
    if (result?.error === "SESSION_EXPIRED") {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    return result?.results || [];
  }
  function pendingKey(patientId) {
    return `${PENDING_IMAGING_KEY_PREFIX}${patientId}`;
  }
  async function loadPendingImaging(patientId) {
    if (!patientId)
      return [];
    const key = pendingKey(patientId);
    const obj = await chrome.storage.local.get(key);
    const stash = obj[key];
    if (!stash || !Array.isArray(stash.rows))
      return [];
    const now = Date.now();
    const fresh = stash.rows.filter(
      (r) => r && typeof r.rid === "string" && typeof r.ctype === "string" && typeof r.triggeredAt === "number" && now - r.triggeredAt < PENDING_IMAGING_TTL_MS
    );
    if (fresh.length !== stash.rows.length) {
      if (fresh.length === 0) {
        await chrome.storage.local.remove(key);
      } else {
        await chrome.storage.local.set({
          [key]: { rows: fresh, updatedAt: now }
        });
      }
    }
    return fresh;
  }
  async function appendPendingImaging(patientId, newRows) {
    if (!patientId || newRows.length === 0)
      return;
    const key = pendingKey(patientId);
    const existing = await loadPendingImaging(patientId);
    const now = Date.now();
    const byKey = /* @__PURE__ */ new Map();
    for (const r of existing) {
      byKey.set(`${r.rid}|${r.ctype}`, r);
    }
    let updated = 0;
    for (const r of newRows) {
      if (!r.rid || !r.ctype)
        continue;
      const k = `${r.rid}|${r.ctype}`;
      const found = byKey.get(k);
      if (found) {
        found.triggeredAt = now;
        updated++;
      } else {
        byKey.set(k, { rid: r.rid, ctype: r.ctype, triggeredAt: now });
      }
    }
    await chrome.storage.local.set({
      [key]: { rows: Array.from(byKey.values()), updatedAt: now }
    });
    if (updated > 0) {
      console.info(`[pending] upsert: ${updated} re-triggered rows refreshed triggeredAt`);
    }
  }
  async function removePendingImaging(patientId, removeKeys) {
    if (!patientId || removeKeys.size === 0)
      return;
    const key = pendingKey(patientId);
    const existing = await loadPendingImaging(patientId);
    const remaining = existing.filter((r) => !removeKeys.has(`${r.rid}|${r.ctype}`));
    if (remaining.length === existing.length)
      return;
    if (remaining.length === 0) {
      await chrome.storage.local.remove(key);
    } else {
      await chrome.storage.local.set({
        [key]: { rows: remaining, updatedAt: Date.now() }
      });
    }
  }
  async function saveBearerTokenForBgPoll(tabId, patientId) {
    try {
      const [res] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => sessionStorage.getItem("token")
      });
      const token = res?.result;
      if (typeof token === "string" && token.length > 0) {
        await chrome.storage.local.set({
          [NHI_BEARER_TOKEN_KEY]: {
            token,
            patientId,
            savedAt: Date.now()
          }
        });
      }
    } catch {
    }
  }
  async function loadBearerToken(patientId) {
    const obj = await chrome.storage.local.get(NHI_BEARER_TOKEN_KEY);
    const stash = obj[NHI_BEARER_TOKEN_KEY];
    if (!stash || stash.patientId !== patientId)
      return null;
    if (Date.now() - stash.savedAt > NHI_BEARER_TOKEN_TTL_MS)
      return null;
    return stash.token || null;
  }
  async function swFetchNhiJson(url, token, timeoutMs = 15e3) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const r = await fetch(url, {
        method: "GET",
        credentials: "include",
        signal: ac.signal,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      clearTimeout(t);
      if (r.status === 401 || r.status === 403) {
        return { error: "SESSION_EXPIRED" };
      }
      if (!r.ok)
        return { error: `HTTP ${r.status}` };
      return { body: await r.json() };
    } catch (e) {
      clearTimeout(t);
      return {
        error: e?.name === "AbortError" ? `timeout ${Math.round(timeoutMs / 1e3)}s` : String(e?.message || e)
      };
    }
  }
  function readBase64JpgsFromBody(body) {
    if (!body || typeof body !== "object")
      return [];
    if (Array.isArray(body.pics) && body.pics.length > 0) {
      const acc = [];
      for (const p of body.pics) {
        if (typeof p === "string" && p.length > 1e3)
          acc.push(p);
      }
      if (acc.length > 0)
        return acc;
    }
    return [];
  }
  async function sweepPendingImaging(baseUrl, patientId) {
    if (!patientId)
      return [];
    const pending = await loadPendingImaging(patientId);
    if (pending.length === 0)
      return [];
    const token = await loadBearerToken(patientId);
    if (!token) {
      console.warn(
        "[sweep] no bearer token snapshot for patient",
        patientId,
        "\u2014 treating as session-expired"
      );
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    const listUrl = `${baseUrl}/api/ihke3000/ihke3408s01/page_load?s_type=&s_sort=A1&_=${Date.now()}`;
    const listResp = await swFetchNhiJson(listUrl, token);
    if (listResp.error === "SESSION_EXPIRED") {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    if (listResp.error || !listResp.body) {
      console.warn("[sweep] list refresh failed:", listResp.error);
      return [];
    }
    const list = listResp.body.sp_IHKE3408S01_data || [];
    const seqByRid = /* @__PURE__ */ new Map();
    const oriTypeByRid = /* @__PURE__ */ new Map();
    let rowsWithSeq = 0;
    for (const row of list) {
      const seq = String(row?.ipL_CASE_SEQ_NO ?? row?.ipl_CASE_SEQ_NO ?? row?.IPL_CASE_SEQ_NO ?? "");
      const rid = String(row?.row_ID ?? row?.rowid ?? row?.rowID ?? row?.roW_ID ?? "");
      const oriType = String(row?.ori_TYPE ?? row?.ori_type ?? "");
      if (rid)
        oriTypeByRid.set(rid, oriType);
      if (seq && seq !== "-" && rid) {
        seqByRid.set(rid, seq);
        rowsWithSeq++;
      }
    }
    const evictKeys = /* @__PURE__ */ new Set();
    for (const p of pending) {
      const rid = String(p.rid);
      const oriInList = oriTypeByRid.get(rid);
      if (oriInList === void 0) {
        evictKeys.add(`${p.rid}|${p.ctype}`);
      }
    }
    if (evictKeys.size > 0) {
      console.info(
        `[sweep] auto-evicting ${evictKeys.size} stale pending entries (rid missing from current list)`
      );
      try {
        await removePendingImaging(patientId, evictKeys);
      } catch {
      }
    }
    const livePending = pending.filter((p) => !evictKeys.has(`${p.rid}|${p.ctype}`));
    if (livePending.length === 0) {
      console.info("[sweep] all pending entries evicted, nothing to fetch");
      return [];
    }
    console.info(`[sweep] list returned ${list.length} rows, ${rowsWithSeq} with seq populated`);
    if (list.length > 0) {
      const sample = list.slice(0, 3).map((r) => ({
        row_ID: r?.row_ID ?? r?.rowid ?? r?.rowID ?? r?.roW_ID ?? "(missing)",
        jpG_STATUS: r?.jpG_STATUS ?? r?.jpg_STATUS ?? r?.JPG_STATUS ?? "(missing)",
        ipL_CASE_SEQ_NO: r?.ipL_CASE_SEQ_NO ?? r?.ipl_CASE_SEQ_NO ?? r?.IPL_CASE_SEQ_NO ?? "(missing)"
      }));
      console.info("[sweep] list sample (first 3 rows):", sample);
    }
    console.info(
      `[sweep] live pending rids (${livePending.length}/${pending.length}, after evict):`,
      livePending.slice(0, 5).map((p) => p.rid),
      pending.length > 5 ? `(+${pending.length - 5} more)` : ""
    );
    const SWEEP_BATCH_SIZE = 5;
    async function runSweepBatched(items, size, fn) {
      const results = [];
      for (let i = 0; i < items.length; i += size) {
        const batchResults = await Promise.all(items.slice(i, i + size).map(fn));
        for (const r of batchResults)
          results.push(r);
      }
      return results;
    }
    const SESSION_SENTINEL = Symbol("session-expired");
    const settled = await runSweepBatched(livePending, SWEEP_BATCH_SIZE, async (p) => {
      const seq = seqByRid.get(String(p.rid));
      if (!seq) {
        return {
          rid: p.rid,
          ctype: p.ctype,
          iplCaseSeqNo: null,
          jpgBase64s: [],
          outcome: "triggered-waiting"
        };
      }
      const u = `${baseUrl}/api/ihke3000/IHKE3408S03/page_load?IPL_CASE_SEQ_NO=${encodeURIComponent(seq)}`;
      const r = await swFetchNhiJson(u, token);
      if (r.error === "SESSION_EXPIRED") {
        return SESSION_SENTINEL;
      }
      if (r.error) {
        return {
          rid: p.rid,
          ctype: p.ctype,
          iplCaseSeqNo: seq,
          jpgBase64s: [],
          outcome: "triggered-waiting",
          error: r.error
        };
      }
      const b64s = readBase64JpgsFromBody(r.body);
      if (b64s.length === 0) {
        return {
          rid: p.rid,
          ctype: p.ctype,
          iplCaseSeqNo: seq,
          jpgBase64s: [],
          outcome: "triggered-waiting"
        };
      }
      return {
        rid: p.rid,
        ctype: p.ctype,
        iplCaseSeqNo: seq,
        jpgBase64s: b64s,
        outcome: "triggered-ready"
      };
    });
    if (settled.some((x) => x === SESSION_SENTINEL)) {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    return settled;
  }
  function raceTimeout(p, ms, label) {
    return Promise.race([
      p,
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error(`${label} timeout ${Math.round(ms / 1e3)}s`)), ms)
      )
    ]);
  }
  async function sweepPendingImagingWithTimeout(baseUrl, patientId, timeoutMs = 6e4) {
    return raceTimeout(sweepPendingImaging(baseUrl, patientId), timeoutMs, "sweep");
  }

  // src/background/discharge-summary-fetcher.ts
  async function fetchDischargeSummaryHtmls({
    tabId,
    baseUrl,
    candidates
  }) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return /* @__PURE__ */ new Map();
    }
    const reqs = candidates.filter((c) => c?.rowId);
    if (reqs.length === 0)
      return /* @__PURE__ */ new Map();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (base, items) => {
        const token = sessionStorage.getItem("token");
        if (!token)
          return { error: "SESSION_EXPIRED" };
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return { error: "SESSION_EXPIRED" };
        }
        const auth = `Bearer ${token}`;
        async function fetchOne(rowId2, ctype) {
          const url = `${base}/api/ihke3000/IHKE3309S02/getxml?crid=${encodeURIComponent(rowId2)}&ctype=${encodeURIComponent(ctype || "3")}`;
          const ac = new AbortController();
          const t = setTimeout(() => ac.abort(), 2e4);
          try {
            const r = await fetch(url, {
              method: "GET",
              credentials: "same-origin",
              signal: ac.signal,
              headers: { Accept: "application/json", Authorization: auth }
            });
            clearTimeout(t);
            if (r.status === 401 || r.status === 403)
              return { error: "SESSION_EXPIRED" };
            if (!r.ok)
              return { error: `HTTP ${r.status}` };
            const body = await r.json();
            const html = body && typeof body.file_name === "string" && body.file_name.length > 0 ? body.file_name : null;
            if (!html)
              return { error: "no html in body" };
            return { html };
          } catch (e) {
            clearTimeout(t);
            return { error: e?.name === "AbortError" ? "timeout 20s" : String(e?.message || e) };
          }
        }
        const out = new Array(items.length);
        let next = 0;
        const CONC = 3;
        async function worker() {
          while (next < items.length) {
            const i = next++;
            await new Promise((r) => setTimeout(r, Math.random() * 50));
            const item = items[i];
            if (!item)
              continue;
            const res = await fetchOne(item.rowId, item.ctype);
            if ("html" in res && typeof res.html === "string") {
              out[i] = { rowId: item.rowId, html: res.html };
            } else {
              out[i] = { rowId: item.rowId, error: res.error || "unknown" };
            }
          }
        }
        const ws = [];
        for (let w = 0; w < CONC && w < items.length; w++)
          ws.push(worker());
        await Promise.all(ws);
        return { results: out };
      },
      args: [baseUrl, reqs]
    });
    if (result?.error === "SESSION_EXPIRED") {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    const results = result?.results || [];
    const map = /* @__PURE__ */ new Map();
    for (const r of results) {
      if (r && r.rowId && typeof r.html === "string" && r.html.length > 0) {
        map.set(r.rowId, r.html);
      }
    }
    return map;
  }

  // src/background/nhi-list-fetch.ts
  async function fetchNhiListsInTab(tabId, fetchSpec) {
    let settledRaw;
    try {
      [{ result: settledRaw }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: async (specs) => {
          const token = sessionStorage.getItem("token");
          if (!token)
            return [{ error: "SESSION_EXPIRED" }];
          const auth = `Bearer ${token}`;
          if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
            return [{ error: "SESSION_EXPIRED" }];
          }
          async function fetchOne(s, ms) {
            const ac = new AbortController();
            const timer = setTimeout(() => ac.abort(), ms);
            try {
              const r = await fetch(s.url, {
                method: s.method,
                credentials: "same-origin",
                signal: ac.signal,
                headers: { Accept: "application/json", Authorization: auth }
              });
              clearTimeout(timer);
              const ct = r.headers.get("content-type") || "";
              if (r.status === 401 || r.status === 403) {
                return { name: s.name, error: "SESSION_EXPIRED" };
              }
              if (!r.ok)
                return { name: s.name, error: `HTTP ${r.status}` };
              if (!ct.includes("application/json")) {
                return { name: s.name, error: `non-JSON (ct=${ct})` };
              }
              let body;
              try {
                body = await r.json();
              } catch (e) {
                return { name: s.name, error: `JSON parse: ${e.message}` };
              }
              return { name: s.name, body };
            } catch (e) {
              clearTimeout(timer);
              if (e.name === "AbortError")
                return { name: s.name, error: "timeout 60s" };
              return { name: s.name, error: String(e?.message || e) };
            }
          }
          const CONCURRENCY = 3;
          const JITTER_MS = 200;
          const results = new Array(specs.length);
          let nextIdx = 0;
          async function worker() {
            while (nextIdx < specs.length) {
              const i = nextIdx++;
              await new Promise((r) => setTimeout(r, Math.random() * JITTER_MS));
              results[i] = await fetchOne(specs[i], 6e4);
            }
          }
          const workers = [];
          for (let w = 0; w < CONCURRENCY && w < specs.length; w++) {
            workers.push(worker());
          }
          await Promise.all(workers);
          return results;
        },
        args: [fetchSpec]
      });
    } catch (e) {
      throw new Error(`executeScript failed: ${e.message}`);
    }
    if (settledRaw.some((r) => r.error === "SESSION_EXPIRED")) {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    return settledRaw;
  }
  function extractList(body) {
    if (Array.isArray(body))
      return body;
    if (!body || typeof body !== "object")
      return [];
    let arrayKeys = Object.entries(body).filter(
      ([_, v]) => Array.isArray(v)
    );
    if (arrayKeys.length === 0)
      return [];
    if (arrayKeys.length === 1)
      return arrayKeys[0][1];
    const HELPER_RE = /select|option|dropdown|filter|sort|lookup/i;
    const dataKeys = arrayKeys.filter(([k]) => !HELPER_RE.test(k));
    if (dataKeys.length === 1)
      return dataKeys[0][1];
    if (dataKeys.length === 0)
      return arrayKeys[0][1];
    arrayKeys = dataKeys;
    const merged = [];
    for (const [k, v] of arrayKeys) {
      for (const item of v) {
        if (item && typeof item === "object") {
          merged.push({ ...item, __section: k });
        } else {
          merged.push(item);
        }
      }
    }
    return merged;
  }
  function adaptSettledLists(settledRaw) {
    return settledRaw.map((r, i) => {
      const ep = NHI_API_ENDPOINTS[i];
      if (r.error) {
        return { status: "rejected", reason: { message: `${ep.name}: ${r.error}` } };
      }
      const list = extractList(r.body);
      const items = [];
      for (const it of list) {
        const r2 = ep.adapt(it);
        if (r2 === null || r2 === void 0)
          continue;
        if (Array.isArray(r2)) {
          for (const x of r2)
            if (x)
              items.push(x);
        } else {
          items.push(r2);
        }
      }
      let bodySample = null;
      if (list.length > 0 && items.length === 0) {
        bodySample = JSON.stringify({
          topLevelKeys: Array.isArray(r.body) ? null : Object.keys(r.body || {}).slice(0, 10),
          wasArray: Array.isArray(r.body),
          firstItem: list[0] ?? null,
          secondItem: list[1] ?? null
        }).slice(0, 4e3);
      }
      return {
        status: "fulfilled",
        value: { ep, items, raw_count: list.length, bodySample, rawList: list }
      };
    });
  }

  // src/background/s02-detail.ts
  function pickS02MainRow(body) {
    if (!body || typeof body !== "object")
      return null;
    for (const k of Object.keys(body)) {
      if (/^ihke\d+S02_main_data$/i.test(k) && Array.isArray(body[k]) && body[k].length > 0) {
        return body[k][0];
      }
    }
    return null;
  }
  function classFromS02Detail(body) {
    const main = pickS02MainRow(body);
    if (!main)
      return null;
    const tn = String(main.hosp_DATA_TYPE_NAME || "");
    if (tn.includes("\u6025"))
      return "EMER";
    if (tn.includes("\u4F4F\u9662"))
      return "IMP";
    return "AMB";
  }
  function primaryIcdFromS02Detail(body) {
    const main = pickS02MainRow(body);
    if (!main)
      return null;
    const codeName = main.icd9cm_CODE_CNAME || main.icd9cm_code_cname || "";
    if (!codeName)
      return null;
    const code = main.icd9cm_CODE || main.icd9cm_code || "";
    const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
    const pickHalf = (s, half) => {
      const str = String(s || "");
      const idx = str.indexOf("||");
      if (idx === -1)
        return str.trim();
      if (half === "zh")
        return str.slice(0, idx).trim() || str.slice(idx + 2).trim();
      return str.slice(idx + 2).trim() || str.slice(0, idx).trim();
    };
    const name_en = stripIcdPrefix(pickHalf(codeName, "en"));
    const name_zh = stripIcdPrefix(pickHalf(codeName, "zh"));
    if (!code && !name_en && !name_zh)
      return null;
    return { code, name_en, name_zh };
  }
  function secondaryIcdsFromS02Detail(body) {
    const main = pickS02MainRow(body);
    if (!main)
      return [];
    const list = Array.isArray(main.icdcode_data) ? main.icdcode_data : [];
    const out = [];
    const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
    const pickHalf = (s, half) => {
      const str = String(s || "");
      const idx = str.indexOf("||");
      if (idx === -1)
        return str.trim();
      if (half === "zh")
        return str.slice(0, idx).trim() || str.slice(idx + 2).trim();
      return str.slice(idx + 2).trim() || str.slice(0, idx).trim();
    };
    for (const item of list) {
      const codeName = item?.icd_code_name || item?.icd_CODE_NAME || "";
      const codeMatch = String(codeName).match(/^([A-Z0-9.]+)\//);
      const code = codeMatch ? codeMatch[1] : "";
      const name_en = stripIcdPrefix(pickHalf(codeName, "en"));
      const name_zh = stripIcdPrefix(pickHalf(codeName, "zh"));
      if (!code && !name_en && !name_zh)
        continue;
      out.push({ code, name_en, name_zh });
    }
    return out;
  }

  // src/background/sync-orchestrator.ts
  async function runNhiApiSync({
    tabId,
    mode,
    backend,
    syncApiKey,
    nhiBase,
    patientOverride,
    dateRange,
    dateRangeLabel,
    fetchImagingEnabled
  }) {
    resetCancelled();
    const BASE = nhiBase || `https://${NHI_HOST}`;
    if (!patientOverride) {
      await chrome.storage.local.set({
        syncStatus: {
          running: false,
          progress: "\u26D4 \u8ACB\u5148\u5230\u300C\u2461 \u60A8\u7684\u8CC7\u6599\u300D\u586B\u5BEB\u8CC7\u6599\u5F8C\u518D\u8A66",
          phase: "error",
          ts: Date.now(),
          completed: Date.now()
        }
      });
      return;
    }
    if (!tabId) {
      throw new Error("API sync requires NHI tab id (cookies are first-party)");
    }
    patientOverride = await maybeFetchPatientIdFromNhi(tabId, patientOverride);
    if (fetchImagingEnabled && patientOverride.id_no) {
      try {
        await saveBearerTokenForBgPoll(tabId, patientOverride.id_no);
      } catch {
      }
    }
    setActiveSyncCtx({ backend, syncApiKey, patientId: patientOverride.id_no });
    const _t0 = Date.now();
    const _phases = [];
    let _phaseStart = _t0;
    const _markPhase = (name) => {
      const now = Date.now();
      _phases.push({ name, ms: now - _phaseStart });
      _phaseStart = now;
    };
    await setStatus({
      running: true,
      progress: "\u{1F680} \u958B\u59CB\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026",
      phase: "init",
      started: _t0,
      totalResources: 0,
      host: NHI_HOST,
      errors: []
    });
    await clearResultBadge();
    await chrome.storage.local.remove([PENDING_BUNDLE_KEY, PENDING_BUNDLE_JSON_KEY]).catch(() => {
    });
    await stopPrepPolling().catch(() => {
    });
    const fetchSpec = NHI_API_ENDPOINTS.map((ep) => {
      const path = ep.supportsDateRange ? applyDateRangeToPath(ep.path, dateRange) : ep.path;
      return { name: ep.name, url: BASE + path, method: "GET" };
    });
    const settledRaw = await fetchNhiListsInTab(tabId, fetchSpec);
    const errors = [];
    const settled = adaptSettledLists(settledRaw);
    _markPhase("nhi-parallel");
    const pharmacyRowIds = /* @__PURE__ */ new Set();
    for (const name of ["medications", "chronic_prescriptions"]) {
      const idx = NHI_API_ENDPOINTS.findIndex((e) => e.name === name);
      if (idx < 0 || settled[idx]?.status !== "fulfilled")
        continue;
      for (const v of settled[idx].value.rawList || []) {
        const id = v.row_ID || v.rowid || v.rowID;
        const oriTypeName = v.ori_TYPE_NAME || v.ori_type_name || "";
        if (id && oriTypeName.includes("\u85E5\u5C40")) {
          pharmacyRowIds.add(id);
        }
      }
    }
    const encIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "encounters");
    if (encIdx >= 0 && settled[encIdx].status === "fulfilled") {
      const visits = settled[encIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const detailMap = await withProgressTimer(
            (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5C31\u91AB\u7D00\u9304\u8A73\u60C5\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5C31\u91AB\u7D00\u9304\u8A73\u60C5\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
            () => fetchEncounterDetails({ tabId, baseUrl: BASE, visits })
          );
          const reAdapted = [];
          for (let i = 0; i < visits.length; i++) {
            const detail = detailMap?.get(i) || null;
            const cls = classFromS02Detail(detail) || "AMB";
            const secondaryDiagnoses = secondaryIcdsFromS02Detail(detail);
            const primaryDiagnosis = primaryIcdFromS02Detail(detail);
            const visit = visits[i];
            const rowId2 = visit.roW_ID || visit.row_id || visit.row_ID;
            const isPharmacy = rowId2 ? pharmacyRowIds.has(rowId2) : false;
            const it = adaptEncounterFromMedExpense(visit, cls, {
              pharmacy: isPharmacy,
              primary_diagnosis: primaryDiagnosis,
              secondary_diagnoses: secondaryDiagnoses
            });
            if (it)
              reAdapted.push(it);
          }
          settled[encIdx].value.items = reAdapted;
          settled[encIdx].value.raw_count = reAdapted.length;
        } catch (e) {
          errors.push(`encounter detail: ${e.message}`);
        }
      }
    }
    _markPhase("encounter-detail");
    const dischargeSummaryItems = [];
    let dischargeCandidates = 0;
    let dischargeFetched = 0;
    let dischargeFetchFailed = 0;
    const inpIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "inpatient");
    if (inpIdx >= 0 && settled[inpIdx].status === "fulfilled") {
      const visits = settled[inpIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const detailMap = await withProgressTimer(
            (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u4F4F\u9662\u7D00\u9304\u8A73\u60C5\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u4F4F\u9662\u7D00\u9304\u8A73\u60C5\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
            () => fetchInpatientDetails({ tabId, baseUrl: BASE, visits })
          );
          const reAdapted = [];
          const dischargeCandidatesRaw = [];
          for (let i = 0; i < visits.length; i++) {
            const detail = detailMap?.get(i) || null;
            const primaryDiagnosis = primaryIcdFromS02Detail(detail);
            const secondaryDiagnoses = secondaryIcdsFromS02Detail(detail);
            const it = adaptInpatientEncounter(visits[i], {
              primary_diagnosis: primaryDiagnosis,
              secondary_diagnoses: secondaryDiagnoses
            });
            if (it)
              reAdapted.push(it);
            const mainRow = pickS02MainRow(detail);
            const hasXml = String(mainRow?.has_XML || mainRow?.has_xml || "").toUpperCase() === "Y";
            if (!hasXml)
              continue;
            const v = visits[i];
            const rowId2 = String(v?.row_ID || v?.row_id || v?.roW_ID || "");
            if (!rowId2)
              continue;
            dischargeCandidatesRaw.push({
              rowId: rowId2,
              // ctype=3 (住院) — same value the detail page_load uses.
              // Hardcoded because IHKE3309S02 only returns data for ctype=3
              // and the modal's "查看檔案" link always sends t=3.
              ctype: "3",
              hospital: String(v?.hosp_ABBR || v?.hosp_abbr || ""),
              admissionDate: rocToISO(v?.in_DATE || v?.func_DATE || "") || "",
              dischargeDate: rocToISO(v?.out_DATE || "") || ""
            });
          }
          settled[inpIdx].value.items = reAdapted;
          settled[inpIdx].value.raw_count = reAdapted.length;
          dischargeCandidates = dischargeCandidatesRaw.length;
          if (dischargeCandidatesRaw.length > 0) {
            try {
              const htmlMap = await withProgressTimer(
                (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${dischargeCandidatesRaw.length} \u4EFD\u51FA\u9662\u75C5\u6458\u2026` : `\u{1F4E5} \u53D6\u5F97 ${dischargeCandidatesRaw.length} \u4EFD\u51FA\u9662\u75C5\u6458\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
                () => fetchDischargeSummaryHtmls({
                  tabId,
                  baseUrl: BASE,
                  candidates: dischargeCandidatesRaw.map(({ rowId: rowId2, ctype }) => ({ rowId: rowId2, ctype }))
                })
              );
              for (const cand of dischargeCandidatesRaw) {
                const html = htmlMap.get(cand.rowId);
                if (!html) {
                  dischargeFetchFailed++;
                  continue;
                }
                dischargeFetched++;
                dischargeSummaryItems.push({
                  html,
                  row_id: cand.rowId,
                  hospital: cand.hospital,
                  admission_date: cand.admissionDate,
                  discharge_date: cand.dischargeDate
                });
              }
            } catch (e) {
              errors.push(`discharge summary: ${e?.message || e}`);
            }
          }
        } catch (e) {
          errors.push(`inpatient detail: ${e.message}`);
        }
      }
    }
    _markPhase("inpatient-detail");
    const imgIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "imaging");
    let imagingJpegCandidates = [];
    if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
      const visits = settled[imgIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const detail = await withProgressTimer(
            (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5F71\u50CF\u6AA2\u67E5\u5831\u544A\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5F71\u50CF\u6AA2\u67E5\u5831\u544A\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
            () => fetchImagingDetails({ tabId, baseUrl: BASE, visits })
          );
          settled[imgIdx].value.items = detail.reports;
          settled[imgIdx].value.raw_count = detail.reports.length;
          settled[imgIdx].value.visitCount = visits.length;
          imagingJpegCandidates = detail.jpegCandidates || [];
        } catch (e) {
          errors.push(`imaging detail: ${e.message}`);
        }
      }
    }
    _markPhase("imaging-detail");
    let imagingSweepPromise = null;
    let pendingImagingRows = [];
    let polledCandidates = imagingJpegCandidates;
    if (fetchImagingEnabled && imagingJpegCandidates.length > 0 && patientOverride.id_no) {
      try {
        pendingImagingRows = await loadPendingImaging(patientOverride.id_no);
        if (pendingImagingRows.length > 0) {
          const pendingTriggeredAt = new Map(
            pendingImagingRows.map((p) => [`${p.rid}|${p.ctype}`, p.triggeredAt])
          );
          const STUCK_RETRY_MS = 10 * 60 * 1e3;
          const _nowForRetry = Date.now();
          polledCandidates = imagingJpegCandidates.filter((c) => {
            if (!c.needsTrigger)
              return true;
            const triggeredAt = pendingTriggeredAt.get(`${c.rid}|${c.ctype}`);
            if (triggeredAt === void 0)
              return true;
            return _nowForRetry - triggeredAt >= STUCK_RETRY_MS;
          });
        }
      } catch (e) {
        errors.push(`imaging pending load: ${e.message}`);
      }
    }
    let imagingPromise = null;
    const _imagingStartedAt = Date.now();
    if (isCancelled())
      throw new Error(CANCEL_ERROR);
    if (fetchImagingEnabled && polledCandidates.length > 0) {
      const _toTrigger = polledCandidates.filter((c) => c.needsTrigger).length;
      await setStatus({
        progress: `\u{1F5BC}\uFE0F \u958B\u59CB\u9810\u5099\u5F71\u50CF\uFF08\u80CC\u666F\u50B3\u9001\u89F8\u767C\u8ACB\u6C42\uFF0C\u5171 ${_toTrigger} \u5F35\uFF0C\u4E0D\u5F71\u97FF\u60A8\u6B63\u5728\u770B\u7684\u5206\u9801\uFF09\u2026`,
        phase: "imaging"
      });
      imagingPromise = (async () => {
        try {
          const triggerOutcomes = await triggerImagingRowsViaSwFetch(
            BASE,
            patientOverride.id_no,
            polledCandidates
          );
          return await pollFetchImagingJpegs(tabId, BASE, polledCandidates, triggerOutcomes);
        } catch (e) {
          errors.push(`imaging: ${e.message}`);
          return [];
        }
      })();
    }
    if (fetchImagingEnabled && pendingImagingRows.length > 0 && patientOverride.id_no) {
      imagingSweepPromise = sweepPendingImagingWithTimeout(BASE, patientOverride.id_no, 6e4).catch(
        (e) => {
          errors.push(`\u524D\u6B21\u5F71\u50CF\u88DC\u6293: ${e.message}`);
          return [];
        }
      );
    }
    _markPhase("imaging-kickoff");
    const _imgPending = imagingPromise !== null || imagingSweepPromise !== null;
    const _withImgTag = (msg) => _imgPending ? `${msg} \xB7 \u{1F5BC}\uFE0F \u5F71\u50CF\u6E96\u5099\u4E2D` : msg;
    const procIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "procedures");
    if (procIdx >= 0 && settled[procIdx].status === "fulfilled") {
      const visits = settled[procIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const procs = await withProgressTimer(
            (sec) => _withImgTag(
              sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u8655\u7F6E/\u624B\u8853\u8A73\u60C5\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u8655\u7F6E/\u624B\u8853\u8A73\u60C5\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`
            ),
            () => fetchProcedureDetails({ tabId, baseUrl: BASE, visits })
          );
          settled[procIdx].value.items = procs;
          settled[procIdx].value.raw_count = procs.length;
          settled[procIdx].value.visitCount = visits.length;
        } catch (e) {
          errors.push(`procedures detail: ${e.message}`);
        }
      }
    }
    _markPhase("procedures-detail");
    const chronicRowIds = /* @__PURE__ */ new Set();
    const chronicIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "chronic_prescriptions");
    if (chronicIdx >= 0 && settled[chronicIdx].status === "fulfilled") {
      const visits = settled[chronicIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const drugItems = await withProgressTimer(
            (sec) => _withImgTag(
              sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u6162\u6027\u8655\u65B9\u7B8B\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u6162\u6027\u8655\u65B9\u7B8B\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`
            ),
            () => fetchChronicMedicationDetails({ tabId, baseUrl: BASE, visits })
          );
          settled[chronicIdx].value.items = drugItems;
          settled[chronicIdx].value.visitCount = visits.length;
          settled[chronicIdx].value.raw_count = drugItems.length;
          for (const v of visits) {
            const id = v.row_ID || v.rowid || v.rowID;
            if (id)
              chronicRowIds.add(id);
          }
        } catch (e) {
          errors.push(`chronic prescriptions detail: ${e.message}`);
        }
      }
    }
    _markPhase("chronic-detail");
    const medIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "medications");
    if (medIdx >= 0 && settled[medIdx].status === "fulfilled") {
      const visits = settled[medIdx].value.rawList || [];
      if (visits.length > 0) {
        const remaining = visits.filter((v) => {
          const id = v.row_ID || v.rowid || v.rowID;
          return id && !chronicRowIds.has(id);
        }).length;
        try {
          const drugItems = await withProgressTimer(
            (sec) => _withImgTag(
              sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${remaining} \u7B46\u7528\u85E5\u660E\u7D30\u2026` : `\u{1F4E5} \u53D6\u5F97 ${remaining} \u7B46\u7528\u85E5\u660E\u7D30\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`
            ),
            () => fetchMedicationDetails({
              tabId,
              baseUrl: BASE,
              visits,
              skipRowIds: chronicRowIds
            })
          );
          settled[medIdx].value.items = drugItems;
          settled[medIdx].value.visitCount = visits.length;
          settled[medIdx].value.raw_count = drugItems.length;
        } catch (e) {
          errors.push(`medications detail: ${e.message}`);
        }
      }
    }
    _markPhase("medication-detail");
    if (imagingPromise || imagingSweepPromise) {
      try {
        const N = imagingJpegCandidates.length;
        const needsTrigger = polledCandidates.filter((c) => c.needsTrigger).length;
        const alreadyPending = pendingImagingRows.length;
        const jpegResults = await withProgressTimer(
          (sec) => {
            const pendingPart = alreadyPending > 0 ? `\uFF1B\u524D\u6B21 ${alreadyPending} \u5F35\u88DC\u6293\u4E2D` : "";
            const head = needsTrigger > 0 ? `\u{1F5BC}\uFE0F \u7B49\u5019\u5065\u4FDD\u7F72\u56DE\u50B3\u5F71\u50CF\uFF08\u672C\u6B21\u5DF2\u8ACB\u6C42 ${needsTrigger} \u5F35${pendingPart}\uFF09` : alreadyPending > 0 ? `\u{1F5BC}\uFE0F \u7B49\u5019\u5065\u4FDD\u7F72\u56DE\u50B3\u5F71\u50CF${pendingPart}\u2026` : `\u{1F5BC}\uFE0F \u7B49\u5019\u5065\u4FDD\u7F72\u56DE\u50B3\u5F71\u50CF\uFF08\u5171 ${N} \u5F35\uFF09\u2026`;
            return sec === 0 ? `${head}\u2026` : `${head}\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`;
          },
          async () => {
            const [pollRes, sweepRes] = await Promise.all([
              imagingPromise ?? Promise.resolve([]),
              imagingSweepPromise ?? Promise.resolve([])
            ]);
            return { pollRes, sweepRes };
          }
        );
        const mergedMap = /* @__PURE__ */ new Map();
        for (const r of jpegResults.pollRes ?? []) {
          if (!r)
            continue;
          mergedMap.set(`${r.rid}|${r.ctype}`, r);
        }
        for (const r of jpegResults.sweepRes ?? []) {
          if (!r)
            continue;
          const k = `${r.rid}|${r.ctype}`;
          const existing = mergedMap.get(k);
          if (!existing || Array.isArray(r.jpgBase64s) && r.jpgBase64s.length > 0) {
            mergedMap.set(k, r);
          }
        }
        const allResults = Array.from(mergedMap.values());
        if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
          settled[imgIdx].value.jpegResults = allResults;
          const readyCount = allResults.filter(
            (r) => Array.isArray(r.jpgBase64s) && r.jpgBase64s.length > 0
          ).length;
          const frameCount = allResults.reduce(
            (n, r) => n + (Array.isArray(r.jpgBase64s) ? r.jpgBase64s.length : 0),
            0
          );
          settled[imgIdx].value.jpegReadyCount = readyCount;
          settled[imgIdx].value.jpegTotal = allResults.length;
          settled[imgIdx].value.jpegFrameCount = frameCount;
          settled[imgIdx].value.jpegCacheHitCount = allResults.filter(
            (r) => r.outcome === "ready"
          ).length;
          settled[imgIdx].value.jpegFreshTriggerCount = allResults.filter(
            (r) => r.outcome === "triggered-ready"
          ).length;
          const trigFailed = allResults.filter((r) => r.outcome === "trigger-failed");
          const realFailures = trigFailed.filter((r) => r.error !== "dev-cap-skipped");
          settled[imgIdx].value.jpegDevCapSkippedCount = trigFailed.filter(
            (r) => r.error === "dev-cap-skipped"
          ).length;
          settled[imgIdx].value.jpegNhiSilentFailCount = realFailures.filter(
            (r) => r.error === "nhi-silent-fail"
          ).length;
          settled[imgIdx].value.jpegTriggerFailedCount = realFailures.filter(
            (r) => r.error !== "nhi-silent-fail"
          ).length;
          const reasonCounts = /* @__PURE__ */ new Map();
          for (const r of realFailures) {
            const reason = String(r.error || "unknown");
            reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
          }
          settled[imgIdx].value.jpegTriggerFailReasons = Array.from(reasonCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
          const pendingKeysSnap = new Set(pendingImagingRows.map((p) => `${p.rid}|${p.ctype}`));
          const waitingResults = allResults.filter((r) => r.outcome === "triggered-waiting");
          settled[imgIdx].value.jpegTriggeredWaitingCount = waitingResults.length;
          settled[imgIdx].value.jpegTriggeredWaitingNewCount = waitingResults.filter(
            (r) => !pendingKeysSnap.has(`${r.rid}|${r.ctype}`)
          ).length;
          settled[imgIdx].value.jpegTriggeredWaitingCarriedCount = waitingResults.filter(
            (r) => pendingKeysSnap.has(`${r.rid}|${r.ctype}`)
          ).length;
          settled[imgIdx].value.jpegTimeoutCount = allResults.filter(
            (r) => r.outcome === "timeout"
          ).length;
          settled[imgIdx].value.jpegFetchFailedCount = allResults.filter(
            (r) => r.outcome === "fetch-failed"
          ).length;
          const fetchFailReasonCounts = /* @__PURE__ */ new Map();
          for (const r of allResults) {
            if (r?.outcome !== "fetch-failed")
              continue;
            const reason = String(r.error || "unknown");
            fetchFailReasonCounts.set(reason, (fetchFailReasonCounts.get(reason) ?? 0) + 1);
          }
          settled[imgIdx].value.jpegFetchFailReasons = Array.from(fetchFailReasonCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
          const resultByKey = /* @__PURE__ */ new Map();
          for (const r of allResults) {
            if (!Array.isArray(r?.jpgBase64s) || r.jpgBase64s.length === 0)
              continue;
            resultByKey.set(`${r.rid}|${r.ctype}`, r);
          }
          const items = settled[imgIdx].value.items || [];
          const matchedKeys = /* @__PURE__ */ new Set();
          for (const item of items) {
            if (!item)
              continue;
            const key = `${item.rid || ""}|${item.ctype || ""}`;
            const match = resultByKey.get(key);
            if (match) {
              item.jpgBase64s = match.jpgBase64s;
              item.iplCaseSeqNo = match.iplCaseSeqNo || null;
              matchedKeys.add(key);
            }
          }
          for (const cand of imagingJpegCandidates) {
            if (cand.hasNarrativeReport)
              continue;
            const key = `${cand.rid}|${cand.ctype}`;
            const match = resultByKey.get(key);
            if (!match || !Array.isArray(match.jpgBase64s) || match.jpgBase64s.length === 0) {
              continue;
            }
            const synth = adaptImageOnlyReportFromMeta(cand.mainMeta, {
              rid: cand.rid,
              ctype: cand.ctype
            });
            if (!synth)
              continue;
            synth.jpgBase64s = match.jpgBase64s;
            synth.iplCaseSeqNo = match.iplCaseSeqNo || null;
            items.push(synth);
            matchedKeys.add(key);
          }
          settled[imgIdx].value.items = items;
          settled[imgIdx].value.raw_count = items.length;
          if (patientOverride.id_no) {
            try {
              const pendingKeysSet = new Set(pendingImagingRows.map((p) => `${p.rid}|${p.ctype}`));
              const removeKeys = /* @__PURE__ */ new Set();
              for (const k of matchedKeys) {
                if (pendingKeysSet.has(k))
                  removeKeys.add(k);
              }
              if (removeKeys.size > 0) {
                await removePendingImaging(patientOverride.id_no, removeKeys);
              }
              const waiting = allResults.filter((r) => r.outcome === "triggered-waiting").map((r) => ({ rid: r.rid, ctype: r.ctype }));
              if (waiting.length > 0) {
                await appendPendingImaging(patientOverride.id_no, waiting);
              }
            } catch (e) {
              errors.push(`imaging pending update: ${e.message}`);
            }
          }
        }
      } catch (e) {
        errors.push(`imaging jpeg await: ${e.message}`);
      }
    }
    _markPhase("imaging-jpeg-await");
    const byType = {};
    const breakdown = [];
    for (let i = 0; i < settled.length; i++) {
      const ep = NHI_API_ENDPOINTS[i];
      const s = settled[i];
      const label = ENDPOINT_LABEL_ZH[ep.name] ?? ep.name;
      if (s.status === "rejected") {
        errors.push(`${ep.name}: ${s.reason.message}`);
        breakdown.push(`\u274C ${label}\uFF1A\u53D6\u5F97\u5931\u6557`);
        continue;
      }
      const { items, raw_count } = s.value;
      if (raw_count === 0)
        continue;
      let line;
      if (items.length > raw_count && raw_count > 0) {
        line = `${label}\uFF1A${raw_count} \u7B46 \u2192 ${items.length} \u9805`;
      } else {
        line = `${label}\uFF1A${items.length} \u7B46`;
      }
      breakdown.push(line);
      if (ep.name === "imaging" && typeof s.value.jpegTotal === "number") {
        const ready = s.value.jpegReadyCount ?? 0;
        const total2 = s.value.jpegTotal ?? 0;
        const frames = s.value.jpegFrameCount ?? 0;
        const cache = s.value.jpegCacheHitCount ?? 0;
        const fresh = s.value.jpegFreshTriggerCount ?? 0;
        const trigFail = s.value.jpegTriggerFailedCount ?? 0;
        const silentFail = s.value.jpegNhiSilentFailCount ?? 0;
        const capSkipped = s.value.jpegDevCapSkippedCount ?? 0;
        const waiting = s.value.jpegTriggeredWaitingCount ?? 0;
        const waitingNew = s.value.jpegTriggeredWaitingNewCount ?? 0;
        const waitingCarried = s.value.jpegTriggeredWaitingCarriedCount ?? 0;
        const timeout = s.value.jpegTimeoutCount ?? 0;
        const fetchFail = s.value.jpegFetchFailedCount ?? 0;
        const totalItems = (items?.length ?? 0) || 0;
        const narrativeOnly = Math.max(0, totalItems - total2);
        let imagingLine = frames > ready ? `\u3000\u542B ${ready}/${total2} \u7B46\u5F71\u50CF (${frames} frames)` : `\u3000\u542B ${ready}/${total2} \u5F35\u5F71\u50CF`;
        if (narrativeOnly > 0) {
          imagingLine += `\uFF0C\u53E6 ${narrativeOnly} \u7B46\u50C5\u6558\u8FF0`;
        }
        const parts = [];
        parts.push(`${cache} \u5DF2\u5FEB\u53D6`);
        parts.push(`${fresh} \u672C\u6B21\u65B0\u6293`);
        parts.push(`${waitingNew} \u7B49\u5019\u5065\u4FDD\u5099\u9F4A`);
        parts.push(`${waitingCarried} \u524D\u6B21\u7B49\u5019`);
        parts.push(`${trigFail} \u89F8\u767C\u5931\u6557`);
        parts.push(`${silentFail} \u5065\u5EB7\u5B58\u647A\u62D2\u6536`);
        parts.push(`${fetchFail} \u6293\u53D6\u5931\u6557`);
        if (capSkipped > 0)
          parts.push(`${capSkipped} dev-cap-skip`);
        if (timeout > 0)
          parts.push(`${timeout} timeout`);
        imagingLine += ` \xB7 ${parts.join(" / ")}`;
        const reasons = s.value.jpegTriggerFailReasons;
        if (Array.isArray(reasons) && reasons.length > 0) {
          const reasonStr = reasons.map(([r, n]) => n > 1 ? `${r}\xD7${n}` : r).join(", ");
          imagingLine += ` (trigger failures: ${reasonStr})`;
        }
        const fetchReasons = s.value.jpegFetchFailReasons;
        if (Array.isArray(fetchReasons) && fetchReasons.length > 0) {
          const reasonStr = fetchReasons.map(([r, n]) => n > 1 ? `${r}\xD7${n}` : r).join(", ");
          imagingLine += ` (fetch failures: ${reasonStr})`;
        }
        breakdown.push(imagingLine);
      }
      if (DEBUG_STASH_BODY_SAMPLES && raw_count > 0 && items.length === 0) {
        try {
          await chrome.storage.local.set({
            [`__sampleBody_${ep.name}`]: s.value.bodySample || "n/a"
          });
        } catch {
        }
      }
      if (ep.name === "inpatient" && dischargeCandidates > 0) {
        const parts = [`${dischargeFetched}/${dischargeCandidates} \u51FA\u9662\u75C5\u6458`];
        if (dischargeFetchFailed > 0)
          parts.push(`${dischargeFetchFailed} \u6293\u53D6\u5931\u6557`);
        breakdown.push(`\u3000${parts.join(" / ")}`);
      }
      if (items.length === 0)
        continue;
      byType[ep.page_type] = byType[ep.page_type] || [];
      byType[ep.page_type].push(...items);
    }
    if (dischargeSummaryItems.length > 0) {
      byType["document_references"] = byType["document_references"] || [];
      byType["document_references"].push(...dischargeSummaryItems);
    }
    const drBucket = byType.diagnostic_reports;
    if (Array.isArray(drBucket) && drBucket.length > 0) {
      const before = drBucket.length;
      byType.diagnostic_reports = dedupImagingItems(drBucket);
      const after = byType.diagnostic_reports.length;
      if (after < before) {
        console.info(
          `[imaging-dedup] ${before} \u2192 ${after} items (collapsed ${before - after} multi-channel duplicates)`
        );
      }
    }
    const maskEnabled = await isMaskEnabled();
    if (maskEnabled && patientOverride.name) {
      const replacement = maskName(patientOverride.name);
      for (const key of Object.keys(byType)) {
        byType[key] = replaceNameDeep(byType[key], patientOverride.name, replacement);
      }
    }
    let total = 0;
    let _localFilename = null;
    if (mode === "local") {
      if (isCancelled())
        throw new Error(CANCEL_ERROR);
      await setStatus({ progress: "\u{1F9EC} \u8F49\u63DB\u70BA\u5065\u5EB7\u7D00\u9304\u6A94\u2026", totalResources: 0 });
      let bundle;
      try {
        bundle = assembleLocalBundle(byType, patientOverride, maskEnabled);
      } catch (e) {
        errors.push(`local mapping: ${e.message}`);
        bundle = null;
      }
      if (bundle) {
        total = bundle.entry.length;
        await setStatus({ progress: `\u{1F4BE} \u6E96\u5099 ${total} \u7B46\u5065\u5EB7\u8CC7\u6599\u2026`, totalResources: total });
        try {
          const dl = await stashFhirBundle(
            bundle,
            patientOverride.id_no,
            dateRange,
            fetchImagingEnabled
          );
          _localFilename = dl.filename;
        } catch (e) {
          errors.push(`stash bundle: ${e.message}`);
        }
      }
    } else {
      const uploadOverride = maskEnabled && patientOverride.name ? { ...patientOverride, name: maskName(patientOverride.name) } : patientOverride;
      for (const [page_type, items] of Object.entries(byType)) {
        if (isCancelled())
          throw new Error(CANCEL_ERROR);
        await setStatus({
          progress: `\u2B06\uFE0F \u4E0A\u50B3 ${ENDPOINT_LABEL_ZH[page_type] ?? page_type}\uFF08${items.length} \u7B46\uFF09\u2026`,
          totalResources: total
        });
        try {
          const data = await postStructured(backend, page_type, items, syncApiKey, uploadOverride);
          total += data.count || 0;
        } catch (e) {
          errors.push(`upload ${page_type}: ${e.message}`);
        }
      }
      if (patientOverride.id_no && total > 0) {
        try {
          await setStatus({ progress: "\u{1F4E6} \u6574\u7406\u4F3A\u670D\u5668\u4E0A\u7684\u5B8C\u6574\u8CC7\u6599\u2026", totalResources: total });
          const bundle = await exportPatientBundle(backend, syncApiKey, patientOverride.id_no);
          const dl = await stashFhirBundle(
            bundle,
            patientOverride.id_no,
            dateRange,
            fetchImagingEnabled
          );
          _localFilename = dl.filename;
          if (Array.isArray(bundle.entry) && bundle.entry.length > 0) {
            total = bundle.entry.length;
          }
        } catch (e) {
          errors.push(`export bundle: ${e.message}`);
        }
      }
    }
    _markPhase(mode === "local" ? "assemble+stash" : "backend-upload");
    const _elapsedMs = Date.now() - _t0;
    const _elapsedStr = _elapsedMs < 6e4 ? `${(_elapsedMs / 1e3).toFixed(1)}s` : `${Math.floor(_elapsedMs / 6e4)}m${Math.round(_elapsedMs % 6e4 / 1e3)}s`;
    const _localTail = "";
    const _successVerb = mode === "local" ? "\u5DF2\u7522\u751F" : "\u5DF2\u66F4\u65B0";
    const _phaseLines = _phases.map((p) => `\u23F1 ${p.name}=${(p.ms / 1e3).toFixed(1)}s`);
    const _fullBreakdown = [...breakdown, ..._phaseLines];
    const _waitingCount = imgIdx >= 0 && settled[imgIdx].status === "fulfilled" ? settled[imgIdx].value.jpegTriggeredWaitingCount ?? 0 : 0;
    const _fetchFailCount = imgIdx >= 0 && settled[imgIdx].status === "fulfilled" ? settled[imgIdx].value.jpegFetchFailedCount ?? 0 : 0;
    let _imagingTail = "";
    if (_waitingCount > 0 && _fetchFailCount > 0) {
      _imagingTail = `\uFF08\u5065\u5EB7\u5B58\u647A\u6B63\u5728\u6E96\u5099 ${_waitingCount} \u5F35\u5F71\u50CF\u3001\u53E6 ${_fetchFailCount} \u5F35\u5F71\u50CF\u56E0\u7DB2\u8DEF\u554F\u984C\u672A\u6293\u5230\uFF0C\u8ACB\u904E 5\u201310 \u5206\u9418\u5F8C\u518D\u6309\u300C\u53D6\u5F97\u5065\u5EB7\u5B58\u647A\u8CC7\u6599\u300D\u5373\u53EF\u88DC\u9F4A\uFF09`;
    } else if (_waitingCount > 0) {
      _imagingTail = `\uFF08\u5065\u5EB7\u5B58\u647A\u6B63\u5728\u6E96\u5099 ${_waitingCount} \u5F35\u5F71\u50CF\uFF0C\u8ACB\u904E 5\u201310 \u5206\u9418\u5F8C\u518D\u6309\u300C\u53D6\u5F97\u5065\u5EB7\u5B58\u647A\u8CC7\u6599\u300D\u5373\u53EF\u88DC\u9F4A\uFF09`;
    } else if (_fetchFailCount > 0) {
      _imagingTail = `\uFF08${_fetchFailCount} \u5F35\u5F71\u50CF\u56E0\u7DB2\u8DEF\u554F\u984C\u672A\u6293\u5230\uFF0C\u8ACB\u518D\u6309\u4E00\u6B21\u300C\u53D6\u5F97\u5065\u5EB7\u5B58\u647A\u8CC7\u6599\u300D\u5373\u53EF\u88DC\u6293\uFF09`;
    }
    const _waitingTail = _imagingTail;
    let _summaryLine;
    if (errors.length) {
      _summaryLine = `\u26A0\uFE0F \u53D6\u5F97\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF0C${errors.length} \u9805\u5931\u6557\uFF08${_elapsedStr}\uFF09${_localTail}${_waitingTail}`;
    } else if (total === 0) {
      _summaryLine = `\u26A0\uFE0F \u53D6\u5F97\u5B8C\u6210\u4F46\u6C92\u6293\u5230\u4EFB\u4F55\u8CC7\u6599\uFF08${_elapsedStr}\uFF09\u2014 \u5065\u4FDD\u5B58\u647A session \u53EF\u80FD\u904E\u671F\uFF0C\u8ACB\u56DE\u8A72\u5206\u9801\u91CD\u65B0\u767B\u5165\uFF1B\u6216\u62C9\u9577\u300C\u65E5\u671F\u7BC4\u570D\u300D\u518D\u8A66\u3002`;
    } else {
      _summaryLine = `\u2705 \u53D6\u5F97\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF08${_elapsedStr}\uFF09${_localTail}${_waitingTail}`;
    }
    await setStatus({
      running: false,
      progress: _summaryLine,
      phase: "done",
      totalResources: total,
      completed: Date.now(),
      elapsedMs: _elapsedMs,
      // Per-endpoint breakdown for the popup's '查看明細' collapsible.
      breakdown: _fullBreakdown,
      errors,
      histno: patientOverride.id_no,
      mode,
      localFilename: _localFilename
    });
    await showResultBadge(total);
    if (fetchImagingEnabled && patientOverride.id_no && _waitingCount > 0 && !errors.length) {
      try {
        await startPrepPolling(patientOverride.id_no, _waitingCount, BASE);
      } catch (e) {
        console.warn("[imaging-prep-poll] start failed:", e);
      }
    }
    if (mode !== "local")
      try {
        await postSyncLog(backend, syncApiKey, {
          status: errors.length ? "partial" : "success",
          patient_id: patientOverride.id_no || "",
          // /sync/log lands in the dashboard's sync-history row. Only
          // mask when the user has opted in — otherwise dashboard sees
          // the raw name they typed (consistent with "民眾自用" default).
          patient_name: maskEnabled ? maskName(patientOverride.name || "") : patientOverride.name || "",
          total,
          breakdown,
          date_range: dateRangeLabel || "",
          elapsed_ms: _elapsedMs,
          started_at: new Date(_t0).toISOString(),
          errors
        });
      } catch (e) {
        console.warn("[NHI sync] failed to write history log:", e);
      }
    setActiveSyncCtx(null);
  }

  // src/background.ts
  chrome.runtime.onInstalled.addListener(async () => {
    await migrateSyncToLocal();
    await sweepStaleLocalKeys();
  });
  chrome.runtime.onStartup?.addListener?.(() => {
    migrateSyncToLocal();
    restoreResultBadge();
  });
  migrateSyncToLocal();
  restoreResultBadge();
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (sender?.id !== chrome.runtime.id)
      return;
    if (msg?.type === "startNhiApiSync") {
      runNhiApiSync(msg.payload).then(
        () => {
          try {
            sendResponse({ ok: true });
          } catch {
          }
        },
        async (e) => {
          if (e?.message === CANCEL_ERROR) {
            try {
              sendResponse({ ok: true, cancelled: true });
            } catch {
            }
            return;
          }
          if (e?.message === SESSION_EXPIRED_ERROR) {
            await chrome.storage.local.set({
              syncStatus: {
                running: false,
                progress: "\u{1F512} \u5065\u4FDD\u5B58\u647A\u767B\u5165\u903E\u6642 \u2014 \u8ACB\u56DE\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801\u91CD\u65B0\u767B\u5165\uFF0C\u7136\u5F8C\u518D\u6309\u300C\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D",
                phase: "session_expired",
                ts: Date.now(),
                completed: Date.now()
              }
            });
            try {
              sendResponse({ ok: false, expired: true });
            } catch {
            }
            return;
          }
          console.error("runNhiApiSync failed", e);
          await setStatus({ running: false, progress: `\u274C ${e.message}`, phase: "error" });
          try {
            sendResponse({ ok: false, error: e.message });
          } catch {
          }
        }
      );
      return true;
    }
    if (msg?.type === "stopSync") {
      requestCancel();
      const imagingTabId = getActiveImagingTabId();
      if (imagingTabId != null) {
        chrome.tabs.remove(imagingTabId).catch(() => {
        });
        setActiveImagingTabId(null);
      }
      const ctx = getActiveSyncCtx();
      if (ctx?.patientId && ctx.backend) {
        (async () => {
          try {
            await deletePartialPatientData(ctx.backend, ctx.syncApiKey, ctx.patientId);
            const prev = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] || {};
            await chrome.storage.local.set({
              [STORAGE_KEY]: {
                ...prev,
                running: false,
                progress: "\u26D4 \u5DF2\u505C\u6B62\u4E26\u6E05\u9664\u90E8\u5206\u8CC7\u6599 \u2014 \u8ACB\u91CD\u65B0\u53D6\u5F97",
                phase: "cancelled",
                ts: Date.now(),
                completed: Date.now()
              }
            });
          } catch (e) {
            console.warn("[NHI sync] cancel wipe failed:", e);
          }
        })();
      }
      setActiveSyncCtx(null);
      stopPrepPolling().catch(() => {
      });
      try {
        sendResponse({ ok: true });
      } catch {
      }
      return true;
    }
    if (msg?.type === "dismissPrepBanner") {
      stopPrepPolling().then(() => {
        try {
          sendResponse({ ok: true });
        } catch {
        }
      }).catch(() => {
        try {
          sendResponse({ ok: false });
        } catch {
        }
      });
      return true;
    }
    if (msg?.type === "getSyncStatus") {
      chrome.storage.local.get(STORAGE_KEY).then((data) => sendResponse(data[STORAGE_KEY] || null));
      return true;
    }
    if (msg?.type === "clearSyncStatus") {
      chrome.storage.local.remove(STORAGE_KEY).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }));
      return true;
    }
    if (msg?.type === "markSyncSeen") {
      clearResultBadge().then(() => {
        try {
          sendResponse({ ok: true });
        } catch {
        }
      });
      return true;
    }
    if (msg?.type === "checkNhiLogin") {
      checkNhiLoginState(msg.tabId).then(
        (state) => {
          try {
            sendResponse({ loggedIn: state });
          } catch {
          }
        },
        () => {
          try {
            sendResponse({ loggedIn: null });
          } catch {
          }
        }
      );
      return true;
    }
  });
  chrome.alarms.create("sw-keepalive", { periodInMinutes: 0.34 });
  chrome.alarms.create(PENDING_BUNDLE_SWEEP_ALARM, { periodInMinutes: 10 });
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === PENDING_BUNDLE_SWEEP_ALARM) {
      await sweepPendingBundleIfStale().catch(() => {
      });
    }
    if (alarm.name === IMAGING_PREP_POLL_ALARM) {
      await pollPrepCount().catch((e) => {
        console.warn("[imaging-prep-poll] cycle failed:", e);
      });
    }
  });
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
