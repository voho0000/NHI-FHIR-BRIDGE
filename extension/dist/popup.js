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

  // (disabled):../../../../node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "(disabled):../../../../node_modules/buffer/index.js"() {
    }
  });

  // ../../../../node_modules/js-sha1/src/sha1.js
  var require_sha1 = __commonJS({
    "../../../../node_modules/js-sha1/src/sha1.js"(exports, module) {
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

  // ../../../../packages/mapper/src/helpers.ts
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

  // ../../../../packages/mapper/src/observation.ts
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
    HEMOGLOBIN: "HEMOGLOBIN",
    HGB: "HEMOGLOBIN",
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
    \u767D\u86CB\u767D: "ALBUMIN",
    ALBUMIN: "ALBUMIN",
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

  // src/popup.js
  var DEFAULT_BACKEND = "http://localhost:8010";
  var DEFAULT_SMART_APP_LAUNCH = "https://voho0000.github.io/medical-note-smart-on-fhir/smart/launch";
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
  var DEFAULT_MODE = "local";
  var els = {
    modeRadios: () => document.querySelectorAll('input[name="sync-mode"]'),
    backendUrl: document.getElementById("backend-url"),
    syncApiKey: document.getElementById("sync-api-key"),
    smartAppUrl: document.getElementById("smart-app-url"),
    syncApiBtn: document.getElementById("sync-api-btn"),
    syncBlockedReason: document.getElementById("sync-blocked-reason"),
    apiSyncRange: document.getElementById("api-sync-range"),
    stopBtn: document.getElementById("stop-btn"),
    ovIdNo: document.getElementById("ov-id-no"),
    ovName: document.getElementById("ov-name"),
    ovBirthDate: document.getElementById("ov-birth-date"),
    ovGender: document.getElementById("ov-gender"),
    ovSaveBtn: document.getElementById("ov-save-btn"),
    ovClearBtn: document.getElementById("ov-clear-btn"),
    ovSummary: document.getElementById("override-summary"),
    patientOverrideDetails: document.getElementById("patient-override"),
    launchBtn: document.getElementById("launch-btn"),
    status: document.getElementById("status"),
    dashboardLink: document.getElementById("dashboard-link"),
    pendingBundle: document.getElementById("pending-bundle"),
    downloadBundleBtn: document.getElementById("download-bundle-btn"),
    clearBundleBtn: document.getElementById("clear-bundle-btn"),
    // bundleMeta legacy id removed in the panel-merge; filename+size now
    // live in dedicated #bundle-filename / #bundle-sizeage elements
    // below.
    connBanner: document.getElementById("conn-banner"),
    connSection: document.getElementById("conn-section"),
    connMini: document.getElementById("conn-mini"),
    connMsg: document.getElementById("conn-msg"),
    connRetryBtn: document.getElementById("conn-retry-btn"),
    connHelp: document.getElementById("conn-help"),
    dataStateSection: document.getElementById("data-state-section"),
    backendState: document.getElementById("backend-state"),
    localStateRow: document.getElementById("local-state-row"),
    localState: document.getElementById("local-state"),
    pushLocalBtn: document.getElementById("push-local-btn"),
    syncStatusHint: document.getElementById("sync-status-hint"),
    sidebarEnabled: document.getElementById("sidebar-enabled"),
    maskNameEnabled: document.getElementById("mask-name-enabled"),
    openNhiSection: document.getElementById("open-nhi-section"),
    openNhiBtn: document.getElementById("open-nhi-btn"),
    nhiNeedsLoginSection: document.getElementById("nhi-needs-login-section"),
    loginOkSection: document.getElementById("login-ok-section"),
    wizardStepper: document.getElementById("wizard-stepper"),
    resultZone: document.getElementById("result-zone"),
    activePatient: document.getElementById("active-patient"),
    activePatientValue: document.getElementById("active-patient-value"),
    bundleMetaBlock: document.getElementById("bundle-meta-block"),
    bundleFilename: document.getElementById("bundle-filename"),
    bundleSizeage: document.getElementById("bundle-sizeage")
  };
  var NHI_LANDING = "https://myhealthbank.nhi.gov.tw/IHKE3000";
  var PENDING_BUNDLE_KEY = "pendingFhirBundle";
  async function loadBackendUrl() {
    const { backendUrl, syncApiKey, smartAppLaunchUrl } = await chrome.storage.local.get(
      ["backendUrl", "syncApiKey", "smartAppLaunchUrl"]
    );
    els.backendUrl.value = backendUrl || DEFAULT_BACKEND;
    els.syncApiKey.value = syncApiKey || "";
    els.smartAppUrl.value = smartAppLaunchUrl || DEFAULT_SMART_APP_LAUNCH;
    els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
  }
  async function loadPatientOverride() {
    const { patientOverride } = await chrome.storage.local.get("patientOverride");
    if (patientOverride) {
      els.ovIdNo.value = patientOverride.id_no || "";
      els.ovName.value = patientOverride.name || "";
      els.ovBirthDate.value = patientOverride.birth_date || "";
      els.ovGender.value = patientOverride.gender || "";
    }
    _markStep2Confirmed(
      !!(patientOverride?.gender && patientOverride?.birth_date)
    );
    refreshOverrideSummary();
  }
  function getPatientOverride() {
    const id_no = els.ovIdNo.value.trim();
    const name = els.ovName.value.trim();
    if (!id_no && !name)
      return null;
    const out = id_no ? { id_no } : {};
    if (name)
      out.name = name;
    const birth_date = els.ovBirthDate.value.trim();
    const gender = els.ovGender.value;
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
    if (el.validity && el.validity.badInput) {
      return "\u751F\u65E5\u8ACB\u586B\u5B8C\u6574\u5E74\u6708\u65E5";
    }
    const s = (el.value || "").trim();
    if (!s)
      return "\u8ACB\u586B\u751F\u65E5";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s))
      return "\u751F\u65E5\u8ACB\u586B\u5B8C\u6574\u5E74\u6708\u65E5";
    const [y, m, d] = s.split("-").map(Number);
    const dt = /* @__PURE__ */ new Date(s + "T00:00:00Z");
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
  function _generateAutoPatientId() {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `auto-${hex}`;
  }
  function refreshOverrideSummary() {
    const ov = getPatientOverride();
    const card = els.patientOverrideDetails;
    let summaryText = "";
    if (!ov) {
      els.ovSummary.textContent = "\u672A\u8A2D\u5B9A";
      if (card)
        card.dataset.state = "empty";
    } else {
      const parts = [];
      if (ov.name)
        parts.push(_maybeMask(ov.name));
      parts.push(maskId(ov.id_no));
      summaryText = parts.join("  \xB7  ");
      els.ovSummary.textContent = `\u2713 ${summaryText}`;
      if (card)
        card.dataset.state = "filled";
    }
    if (els.activePatient && els.activePatientValue) {
      const showActive = _step2Confirmed && !!ov?.id_no;
      els.activePatient.hidden = !showActive;
      if (showActive)
        els.activePatientValue.textContent = summaryText;
    }
    _refreshButtonStates();
    _renderDataState();
    refreshPendingBundle();
    _clearStaleSyncStatus(getPatientOverride());
    if (currentMode() === "backend" && _connState === "ok")
      checkBackendPatient();
  }
  function _clearStaleSyncStatus(ov) {
    if (!_latestStatus)
      return;
    if (_latestStatus.running)
      return;
    if (!_latestStatus.histno)
      return;
    if (ov?.id_no === _latestStatus.histno)
      return;
    _latestStatus = null;
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
    const ov = {
      id_no: els.ovIdNo.value.trim() || null,
      name: els.ovName.value.trim() || null,
      birth_date: els.ovBirthDate.value.trim(),
      gender: els.ovGender.value
    };
    if (!ov.id_no)
      delete ov.id_no;
    if (!ov.name)
      delete ov.name;
    if (!ov.id_no) {
      ov.id_no = _generateAutoPatientId();
      els.ovIdNo.value = ov.id_no;
    }
    const prevStored = (await chrome.storage.local.get("patientOverride")).patientOverride;
    const patientChanged = prevStored?.id_no && ov.id_no && prevStored.id_no !== ov.id_no;
    await chrome.storage.local.set({ patientOverride: ov });
    if (patientChanged) {
      await chrome.storage.local.remove(PENDING_BUNDLE_KEY).catch(() => {
      });
      await chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {
      });
      _latestStatus = null;
      setStatus("", null);
    }
    _markStep2Confirmed(true);
    refreshOverrideSummary();
    _refreshButtonStates();
    if (_wizardInitialized)
      _maybeAutoAdvance();
    const displayName = ov.name ? ` (${_maybeMask(ov.name)})` : "";
    setStatus(`\u2705 \u75C5\u4EBA\u8EAB\u4EFD\u5DF2\u8A18\u4F4F\uFF1A${maskId(ov.id_no)}${displayName}`, "success");
  }
  async function clearPatientOverride() {
    await chrome.storage.local.remove("patientOverride");
    els.ovIdNo.value = "";
    els.ovName.value = "";
    els.ovBirthDate.value = "";
    els.ovGender.value = "";
    _markStep2Confirmed(false);
    refreshOverrideSummary();
    _refreshButtonStates();
    setStatus("\u5DF2\u6E05\u9664\u75C5\u4EBA\u8CC7\u6599", "info");
  }
  var _connState = "unknown";
  var _connFailReason = null;
  var _CONN_LABELS = {
    unknown: "\u672A\u6AA2\u6E2C",
    checking: "\u6AA2\u6E2C\u4E2D\u2026",
    ok: () => `\u5DF2\u9023\u7DDA \u2014 ${els.backendUrl.value.trim()}`,
    fail: () => {
      const r = _connFailReason || {};
      return {
        "no-url": "\u672A\u8A2D\u5B9A Backend URL",
        "no-permission": "\u672A\u6388\u6B0A\u9023\u7DDA",
        "network": "\u9023\u4E0D\u4E0A\u5F8C\u7AEF",
        "timeout": "\u9023\u7DDA\u903E\u6642",
        "http": `HTTP ${r.detail || ""}`.trim(),
        "not-fhir": "\u56DE\u61C9\u4E0D\u662F FHIR"
      }[r.kind] ?? "\u9023\u7DDA\u5931\u6557";
    }
  };
  var _CONN_HELP = {
    "no-url": "\u8ACB\u5230\u300C\u9032\u968E\u8A2D\u5B9A\u300D\u586B\u5165 Backend URL\uFF0C\u4F8B\u5982 <code>http://localhost:8010</code>\u3002",
    "no-permission": "Chrome \u963B\u64CB\u4E86\u8DE8\u4F86\u6E90\u8ACB\u6C42\u3002\u8ACB\u91CD\u65B0\u958B popup\uFF0C\u7576\u6B0A\u9650\u5C0D\u8A71\u6846\u8DF3\u51FA\u6642\u6309\u300C\u5141\u8A31\u300D\u3002",
    "network": "\u5F8C\u7AEF\u53EF\u80FD\u9084\u6C92\u555F\u52D5\u3002\u8ACB\u57F7\u884C\uFF1A<br><code>docker compose up -d</code><br>\u78BA\u8A8D backend \u5BB9\u5668\u8DD1\u8D77\u4F86\u518D\u91CD\u8A66\u3002",
    "timeout": "5 \u79D2\u5167\u6C92\u6536\u5230\u56DE\u61C9 \u2014 backend \u53EF\u80FD\u9084\u5728\u555F\u52D5\u4E2D\uFF0C\u7B49 30 \u79D2\u518D\u6309\u91CD\u8A66\u3002",
    "http": "Backend \u56DE\u61C9\u932F\u8AA4\u72C0\u614B\u78BC\u3002\u6AA2\u67E5 backend \u7684 log\uFF1A<br><code>docker compose logs backend</code>",
    "not-fhir": "\u9019\u500B URL \u56DE\u4E86\u6771\u897F\uFF0C\u4F46\u4E0D\u662F FHIR CapabilityStatement\u3002\u78BA\u8A8D Backend URL \u6307\u5411 NHI-FHIR-Bridge \u7684 /fhir \u6839\u76EE\u9304\u3002"
  };
  function _renderConnBanner() {
    const banner = els.connBanner;
    if (!banner)
      return;
    banner.dataset.state = _connState;
    if (els.connSection)
      els.connSection.dataset.state = _connState;
    const label = _CONN_LABELS[_connState];
    els.connMsg.textContent = typeof label === "function" ? label() : label;
    els.connRetryBtn.hidden = _connState !== "fail";
    if (_connState === "fail" && _connFailReason?.kind) {
      els.connHelp.hidden = false;
      els.connHelp.innerHTML = _CONN_HELP[_connFailReason.kind] ?? "";
    } else {
      els.connHelp.hidden = true;
      els.connHelp.innerHTML = "";
    }
    const isOk = _connState === "ok";
    if (els.connSection)
      els.connSection.hidden = isOk;
    if (els.connMini) {
      els.connMini.hidden = !isOk;
      if (isOk)
        els.connMini.title = `\u5DF2\u9023\u7DDA \u2014 ${els.backendUrl.value.trim()}`;
    }
  }
  var _activeStep = 1;
  var _wizardInitialized = false;
  var _step2Confirmed = false;
  function _markStep2Confirmed(yes) {
    _step2Confirmed = !!yes;
  }
  function _isStepDone(step) {
    const onNhi = !els.syncApiBtn.dataset.offNhi;
    const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
    switch (step) {
      case 1:
        return onNhi && loggedIn;
      case 2:
        return _step2Confirmed;
      case 3:
        return false;
      default:
        return false;
    }
  }
  function _setActiveStep(n, opts = {}) {
    const clamped = Math.max(1, Math.min(3, n));
    _activeStep = clamped;
    document.body.dataset.activeStep = String(clamped);
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
      const isActive = n === _activeStep;
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
      if (!_latestStatus?.running) {
        els.syncApiBtn.textContent = shouldDemote ? "\u91CD\u65B0\u53D6\u5F97" : "\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599";
      }
    }
  }
  function _maybeAutoAdvance() {
    if (_activeStep === 1 && _isStepDone(1))
      _setActiveStep(2);
    else if (_activeStep === 2 && _isStepDone(2))
      _setActiveStep(3);
  }
  function _initWizard() {
    if (_wizardInitialized)
      return;
    _wizardInitialized = true;
    const start = _isStepDone(1) ? _isStepDone(2) ? 3 : 2 : 1;
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
    const modeOk = currentMode() === "local" || _connState === "ok";
    const genderOk = !!els.ovGender?.value;
    const dobError = validateBirthDate();
    let inlineReason = "";
    let tooltipReason = "";
    if (!onNhi) {
      inlineReason = tooltipReason = "\u56DE \u2460 \u767B\u5165\uFF1A\u8ACB\u5207\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801";
    } else if (!loggedIn) {
      inlineReason = tooltipReason = "\u56DE \u2460 \u767B\u5165\uFF1A\u5065\u4FDD\u5B58\u647A\u5206\u9801\u5C1A\u672A\u767B\u5165";
    } else if (!genderOk) {
      inlineReason = tooltipReason = "\u56DE \u2461 \u60A8\u7684\u8CC7\u6599\uFF1A\u8ACB\u9078\u64C7\u6027\u5225\u4E26\u6309\u78BA\u5B9A";
    } else if (dobError) {
      inlineReason = tooltipReason = `\u56DE \u2461 \u60A8\u7684\u8CC7\u6599\uFF1A${dobError}`;
    } else if (!modeOk) {
      inlineReason = "";
      tooltipReason = "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA";
    }
    const reason = tooltipReason;
    const syncRunning = _latestStatus?.running === true;
    els.syncApiBtn.disabled = syncRunning || tooltipReason !== "";
    els.syncApiBtn.title = syncRunning ? "" : tooltipReason;
    if (els.syncBlockedReason) {
      els.syncBlockedReason.textContent = !syncRunning && inlineReason ? `\u26A0\uFE0F ${inlineReason}` : "";
      els.syncBlockedReason.hidden = syncRunning || inlineReason === "";
    }
    if (els.stopBtn)
      els.stopBtn.hidden = !syncRunning;
    const ov = getPatientOverride();
    const haveBackendPatient = _backendPatient.state === "present";
    els.launchBtn.disabled = !(currentMode() === "backend" && _connState === "ok" && !!ov?.id_no && haveBackendPatient);
    els.launchBtn.title = currentMode() !== "backend" ? "\u8ACB\u5207\u5230\u300C\u{1F3E5} \u672C\u6A5F\u5F8C\u7AEF (\u9032\u968E)\u300D\u6A21\u5F0F" : _connState !== "ok" ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : !ov?.id_no ? "\u56DE \u2461 \u60A8\u7684\u8CC7\u6599\uFF1A\u8ACB\u586B\u75C5\u4EBA\u8CC7\u6599" : !haveBackendPatient ? "\u5F8C\u7AEF\u5C1A\u7121\u6B64\u75C5\u4EBA\u8CC7\u6599 \u2014 \u5148\u6309\u300C\u{1F504} \u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6216\u4E0B\u65B9\u300C\u{1F4E4} \u628A\u672C\u5730\u6A94\u6848\u4E0A\u50B3\u5230\u5F8C\u7AEF\u300D" : "";
    if (_wizardInitialized)
      _refreshWizardUi();
  }
  async function testBackendConnection() {
    const url = els.backendUrl.value.trim();
    if (!url) {
      _connState = "fail";
      _connFailReason = { kind: "no-url" };
      _renderConnBanner();
      _refreshButtonStates();
      return false;
    }
    _connState = "checking";
    _connFailReason = null;
    _renderConnBanner();
    _refreshButtonStates();
    const perm = await ensureBackendPermission(url);
    if (!perm.ok) {
      _connState = "fail";
      _connFailReason = { kind: "no-permission" };
      _renderConnBanner();
      _refreshButtonStates();
      return false;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5e3);
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/fhir/metadata`, { signal: ctrl.signal });
      if (!res.ok) {
        _connState = "fail";
        _connFailReason = { kind: "http", detail: res.status };
      } else {
        const body = await res.json().catch(() => null);
        if (body?.resourceType !== "CapabilityStatement") {
          _connState = "fail";
          _connFailReason = { kind: "not-fhir" };
        } else {
          _connState = "ok";
          _connFailReason = null;
        }
      }
    } catch (e) {
      _connState = "fail";
      _connFailReason = { kind: e.name === "AbortError" ? "timeout" : "network" };
    } finally {
      clearTimeout(timer);
    }
    _renderConnBanner();
    _refreshButtonStates();
    if (currentMode() === "backend")
      checkBackendPatient();
    return _connState === "ok";
  }
  els.connRetryBtn?.addEventListener("click", testBackendConnection);
  var _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
  var _localBundle = { exists: false, count: 0, generatedAt: 0, patientId: null };
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
  function _renderDataState() {
    const ov = getPatientOverride();
    if (currentMode() !== "backend" || !ov?.id_no) {
      els.dataStateSection.hidden = true;
      if (els.syncStatusHint)
        els.syncStatusHint.hidden = true;
      return;
    }
    const localMatches = _localBundle.exists && _localBundle.patientId === ov.id_no;
    const inSync = _backendPatient.state === "present" && localMatches && _backendPatient.count === _localBundle.count;
    if (els.syncStatusHint)
      els.syncStatusHint.hidden = !inSync;
    const nothingToShow = _backendPatient.state === "present" && (!localMatches || inSync);
    if (nothingToShow) {
      els.dataStateSection.hidden = true;
      return;
    }
    els.dataStateSection.hidden = false;
    const bs = els.backendState;
    switch (_backendPatient.state) {
      case "checking":
        bs.className = "state-value";
        bs.textContent = "\u6AA2\u67E5\u4E2D\u2026";
        break;
      case "absent":
        bs.className = "state-value empty";
        bs.textContent = "\u26A0 \u5C1A\u7121\u6B64\u75C5\u4EBA\u8CC7\u6599";
        break;
      case "present": {
        const count = _backendPatient.count;
        const ts = _backendPatient.lastUpdated;
        bs.className = "state-value ok";
        bs.textContent = `\u2713 ${count > 0 ? `${count} \u7B46 \xB7 ` : ""}\u6700\u5F8C\u66F4\u65B0 ${_fmtTimeShort(ts) || "(unknown)"}`;
        break;
      }
      case "fail":
        bs.className = "state-value fail";
        bs.textContent = "\u2717 \u6AA2\u67E5\u5931\u6557\uFF08\u770B\u9023\u7DDA banner\uFF09";
        break;
      default:
        bs.className = "state-value";
        bs.textContent = "\u2014";
    }
    if (localMatches) {
      els.localStateRow.hidden = false;
      els.localState.className = "state-value ok";
      els.localState.textContent = `\u2713 ${_localBundle.count} \u7B46 \xB7 ${_fmtRelative(_localBundle.generatedAt)}\u7522\u751F`;
    } else {
      els.localStateRow.hidden = true;
    }
    els.pushLocalBtn.hidden = !localMatches;
    els.pushLocalBtn.disabled = false;
    els.pushLocalBtn.title = "";
    els.pushLocalBtn.textContent = "\u{1F4E4} \u628A\u672C\u5730\u6A94\u6848\u4E0A\u50B3\u5230\u5F8C\u7AEF";
  }
  async function _refreshLocalBundleState() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    _localBundle = pending ? {
      exists: true,
      count: Array.isArray(JSON.parse(pending.json)?.entry) ? JSON.parse(pending.json).entry.length : 0,
      generatedAt: pending.generatedAt || 0,
      patientId: pending.patientId || null
    } : { exists: false, count: 0, generatedAt: 0, patientId: null };
    _renderDataState();
  }
  async function checkBackendPatient() {
    const ov = getPatientOverride();
    if (currentMode() !== "backend" || !ov?.id_no || _connState !== "ok") {
      _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
      _renderDataState();
      _refreshButtonStates();
      return;
    }
    _backendPatient = { state: "checking", count: 0, lastUpdated: null };
    _renderDataState();
    const url = els.backendUrl.value.trim().replace(/\/$/, "");
    const key = els.syncApiKey.value.trim();
    const headers = key ? { "X-Sync-API-Key": key } : {};
    const fhirPid = derivePatientId(ov.id_no);
    try {
      const pr = await fetch(`${url}/fhir/Patient/${encodeURIComponent(fhirPid)}`, { headers });
      if (pr.status === 404) {
        _backendPatient = { state: "absent", count: 0, lastUpdated: null };
        _renderDataState();
        _refreshButtonStates();
        return;
      }
      if (!pr.ok) {
        _backendPatient = { state: "fail", count: 0, lastUpdated: null };
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
      _backendPatient = { state: "present", count, lastUpdated };
    } catch (_e) {
      _backendPatient = { state: "fail", count: 0, lastUpdated: null };
    }
    _renderDataState();
    _refreshButtonStates();
  }
  async function pushLocalBundleToBackend() {
    const ov = getPatientOverride();
    if (!ov?.id_no || !_localBundle.exists || _localBundle.patientId !== ov.id_no)
      return;
    const url = els.backendUrl.value.trim().replace(/\/$/, "");
    const key = els.syncApiKey.value.trim();
    const headers = {
      "Content-Type": "application/json",
      ...key ? { "X-Sync-API-Key": key } : {}
    };
    els.pushLocalBtn.disabled = true;
    els.pushLocalBtn.textContent = "\u4E0A\u50B3\u4E2D\u2026";
    try {
      const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
      if (!pending?.json)
        throw new Error("no local bundle");
      const r = await fetch(`${url}/fhir/import`, {
        method: "POST",
        headers,
        body: pending.json
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
  els.pushLocalBtn?.addEventListener("click", pushLocalBundleToBackend);
  els.openNhiBtn?.addEventListener("click", async () => {
    await chrome.tabs.create({ url: NHI_LANDING });
    window.close();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes)
      _refreshLocalBundleState();
  });
  async function loadSyncMode() {
    const { syncMode } = await chrome.storage.local.get("syncMode");
    const mode = syncMode === "backend" ? "backend" : DEFAULT_MODE;
    for (const r of els.modeRadios())
      r.checked = r.value === mode;
    document.body.dataset.mode = mode;
    if (mode === "backend") {
      await testBackendConnection();
    } else {
      _connState = "unknown";
      _connFailReason = null;
      _renderConnBanner();
    }
  }
  function currentMode() {
    for (const r of els.modeRadios())
      if (r.checked)
        return r.value;
    return DEFAULT_MODE;
  }
  for (const r of els.modeRadios()) {
    r.addEventListener("change", () => {
      const mode = currentMode();
      document.body.dataset.mode = mode;
      chrome.storage.local.set({ syncMode: mode });
      if (mode === "backend") {
        testBackendConnection();
      } else {
        _connState = "unknown";
        _connFailReason = null;
        _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
        _renderConnBanner();
        _renderDataState();
        _refreshButtonStates();
      }
    });
  }
  els.backendUrl.addEventListener("change", () => {
    chrome.storage.local.set({ backendUrl: els.backendUrl.value.trim() });
    els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
    if (currentMode() === "backend")
      testBackendConnection();
  });
  els.syncApiKey.addEventListener("change", () => {
    chrome.storage.local.set({ syncApiKey: els.syncApiKey.value.trim() });
  });
  async function loadSidebarEnabled() {
    const { sidebarEnabled } = await chrome.storage.local.get("sidebarEnabled");
    els.sidebarEnabled.checked = sidebarEnabled !== false;
  }
  els.sidebarEnabled?.addEventListener("change", () => {
    chrome.storage.local.set({ sidebarEnabled: els.sidebarEnabled.checked });
  });
  var _maskNameEnabled = false;
  async function loadMaskNameEnabled() {
    const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
    _maskNameEnabled = maskNameEnabled === true;
    if (els.maskNameEnabled)
      els.maskNameEnabled.checked = _maskNameEnabled;
  }
  function _maybeMask(name) {
    return _maskNameEnabled ? maskName(name) : name || "";
  }
  els.maskNameEnabled?.addEventListener("change", async () => {
    _maskNameEnabled = els.maskNameEnabled.checked;
    await chrome.storage.local.set({ maskNameEnabled: _maskNameEnabled });
    refreshOverrideSummary();
  });
  els.smartAppUrl.addEventListener("change", () => {
    const v = els.smartAppUrl.value.trim();
    if (v) {
      chrome.storage.local.set({ smartAppLaunchUrl: v });
    } else {
      chrome.storage.local.remove("smartAppLaunchUrl");
      els.smartAppUrl.value = DEFAULT_SMART_APP_LAUNCH;
    }
  });
  function setStatus(text, kind, breakdown) {
    els.status.className = kind || "";
    els.status.textContent = "";
    if (!text && !(breakdown && breakdown.length))
      return;
    els.status.appendChild(document.createTextNode(text || ""));
    if (breakdown && breakdown.length) {
      const phaseRows = breakdown.filter((b) => b.startsWith("\u23F1"));
      const otherRows = breakdown.filter((b) => !b.startsWith("\u23F1"));
      const details = document.createElement("details");
      details.className = "status-detail";
      const summary = document.createElement("summary");
      summary.textContent = "\u67E5\u770B\u660E\u7D30";
      details.appendChild(summary);
      if (otherRows.length) {
        const body = document.createElement("div");
        body.className = "status-breakdown";
        for (const row of otherRows) {
          const line = document.createElement("div");
          line.textContent = row;
          body.appendChild(line);
        }
        details.appendChild(body);
      }
      if (phaseRows.length) {
        const techDetails = document.createElement("details");
        techDetails.className = "status-detail status-tech";
        const techSummary = document.createElement("summary");
        techSummary.textContent = "\u6280\u8853\u7D30\u7BC0";
        techDetails.appendChild(techSummary);
        const phases = document.createElement("div");
        phases.className = "status-phases";
        phases.textContent = phaseRows.map((p) => p.replace(/^⏱\s*/, "")).join(" \xB7 ");
        techDetails.appendChild(phases);
        details.appendChild(techDetails);
      }
      els.status.appendChild(details);
    }
    if (_wizardInitialized)
      _refreshResultZone();
  }
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }
  function _fmtBytes(n) {
    if (n < 1024)
      return `${n} B`;
    if (n < 1024 * 1024)
      return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  }
  async function refreshPendingBundle() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    if (!pending || !pending.json) {
      els.pendingBundle.hidden = true;
      if (_wizardInitialized)
        _refreshResultZone();
      return;
    }
    const ov = getPatientOverride();
    if (ov?.id_no && pending.patientId && pending.patientId !== ov.id_no) {
      els.pendingBundle.hidden = true;
      if (_wizardInitialized)
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
      els.bundleSizeage.textContent = `${_fmtBytes(pending.bytes || 0)}${ago ? ` \xB7 ${ago}` : ""}`;
    }
    if (_wizardInitialized)
      _refreshResultZone();
  }
  async function downloadPendingBundle() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    if (!pending)
      return;
    const blob = new Blob([pending.json], { type: "application/fhir+json" });
    const url = URL.createObjectURL(blob);
    try {
      await chrome.downloads.download({ url, filename: pending.filename, saveAs: false });
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 5e3);
    }
  }
  async function clearPendingBundle() {
    await chrome.storage.local.remove(PENDING_BUNDLE_KEY);
    await refreshPendingBundle();
    _latestStatus = null;
    setStatus("", null);
    await chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {
    });
  }
  els.downloadBundleBtn.addEventListener("click", downloadPendingBundle);
  els.clearBundleBtn.addEventListener("click", clearPendingBundle);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes)
      refreshPendingBundle();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.patientOverride)
      loadPatientOverride();
  });
  var _helpTip = document.createElement("div");
  _helpTip.className = "help-tooltip";
  document.body.appendChild(_helpTip);
  var VIEWPORT_MARGIN = 6;
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
  async function init() {
    document.getElementById("version").textContent = "v" + chrome.runtime.getManifest().version;
    document.getElementById("login-ok-next")?.addEventListener("click", () => _setActiveStep(2));
    await loadSidebarEnabled();
    await loadMaskNameEnabled();
    await _refreshLocalBundleState();
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
        if (loggedIn && _wizardInitialized)
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
  async function refreshSyncStatusFromBackground() {
    const status = await chrome.runtime.sendMessage({ type: "getSyncStatus" }).catch(() => null);
    if (!status)
      return;
    applySyncStatus(status);
  }
  var _latestStatus = null;
  var _elapsedTickerId = null;
  function _fmtElapsed(ms) {
    if (ms < 6e4)
      return `${Math.floor(ms / 1e3)}s`;
    return `${Math.floor(ms / 6e4)}m${Math.round(ms % 6e4 / 1e3)}s`;
  }
  function _renderStatus() {
    const status = _latestStatus;
    if (!status)
      return;
    let text = status.progress || "(sync \u9032\u884C\u4E2D)";
    if (status.running && status.started) {
      const elapsed = Date.now() - status.started;
      text = `\u23F1 ${_fmtElapsed(elapsed)} \xB7 ${text}`;
    }
    const kind = status.running ? "info" : status.phase === "error" ? "error" : "success";
    const breakdown = status.running ? null : status.breakdown;
    setStatus(text, kind, breakdown);
  }
  function applySyncStatus(status) {
    if (!status)
      return;
    _latestStatus = status;
    _renderStatus();
    if (_wizardInitialized && _activeStep !== 3) {
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
      if (currentMode() === "backend" && _connState === "ok")
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
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.syncStatus) {
      applySyncStatus(changes.syncStatus.newValue);
    }
  });
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "syncProgress") {
      applySyncStatus(msg.status);
    }
  });
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
  function _originPatternFor(url) {
    try {
      const u = new URL(url);
      return `${u.protocol}//${u.host}/*`;
    } catch {
      return null;
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
  async function apiSyncNhi() {
    const ov = getPatientOverride();
    if (!ov) {
      setStatus("\u26D4 \u56DE \u2461 \u60A8\u7684\u8CC7\u6599\uFF1A\u8ACB\u9078\u64C7\u6027\u5225\u3001\u586B\u751F\u65E5\u5F8C\u6309\u78BA\u5B9A", "error");
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
      setStatus("\u{1F512} \u56DE \u2460 \u767B\u5165\uFF1A\u5C1A\u672A\u767B\u5165\u5065\u4FDD\u5B58\u647A", "error");
      return;
    }
    if (currentMode() === "backend") {
      const ok = await testBackendConnection();
      if (!ok) {
        setStatus("\u26D4 \u5F8C\u7AEF\u9023\u7DDA\u5931\u6557 \u2014 \u8ACB\u770B\u9802\u90E8 banner \u7684\u8AAA\u660E", "error");
        return;
      }
    }
    els.syncApiBtn.disabled = true;
    await chrome.storage.local.set({
      syncStatus: {
        running: true,
        progress: "\u{1F680} \u958B\u59CB\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026",
        phase: "starting",
        started: Date.now(),
        ts: Date.now()
      }
    });
    setStatus("\u{1F680} \u958B\u59CB\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026", "info");
    const rangeSel = els.apiSyncRange?.value || "3";
    let dateRange = null;
    const RANGE_LABELS = {
      "1": "\u6700\u8FD1 1 \u5E74",
      "3": "\u6700\u8FD1 3 \u5E74",
      "5": "\u6700\u8FD1 5 \u5E74",
      "10": "\u6700\u8FD1 10 \u5E74",
      "all": "\u5168\u90E8\u6B77\u53F2\u7D00\u9304"
    };
    const dateRangeLabel = RANGE_LABELS[rangeSel] || `\u6700\u8FD1 ${rangeSel} \u5E74`;
    if (rangeSel !== "1") {
      const today = /* @__PURE__ */ new Date();
      const end = today.toISOString().slice(0, 10);
      let start;
      if (rangeSel === "all") {
        start = "2001-01-01";
      } else {
        const years = parseInt(rangeSel, 10);
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
        dateRangeLabel
      }
    }).catch(() => {
    });
  }
  async function launch() {
    const backend = els.backendUrl.value.trim();
    const ov = getPatientOverride();
    const rawId = ov?.id_no;
    const smartAppLaunch = els.smartAppUrl.value.trim() || DEFAULT_SMART_APP_LAUNCH;
    if (!rawId) {
      setStatus("\u26D4 \u9084\u6C92\u6709\u75C5\u4EBA\u8EAB\u5206\u8B49 \u2014 \u8ACB\u5148\u6309\u300C\u{1F504} \u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6293\u4E00\u6B21", "error");
      return;
    }
    const patientId = derivePatientId(rawId);
    const ok = await testBackendConnection();
    if (!ok) {
      setStatus("\u26D4 \u5F8C\u7AEF\u9023\u7DDA\u5931\u6557 \u2014 \u8ACB\u770B\u9802\u90E8 banner \u7684\u8AAA\u660E", "error");
      return;
    }
    setStatus("\u5EFA\u7ACB launch context\u2026", "info");
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
      setStatus(`\u274C Launch \u5931\u6557\uFF1A${e.message}`, "error");
    }
  }
  els.syncApiBtn.addEventListener("click", apiSyncNhi);
  els.stopBtn.addEventListener("click", stopSync);
  els.ovSaveBtn.addEventListener("click", savePatientOverride);
  els.ovClearBtn.addEventListener("click", clearPatientOverride);
  [els.ovIdNo, els.ovName, els.ovBirthDate, els.ovGender].forEach(
    (el) => el.addEventListener("input", refreshOverrideSummary)
  );
  els.launchBtn.addEventListener("click", launch);
  function _gotoStep2Edit() {
    _setActiveStep(2);
  }
  els.activePatient?.addEventListener("click", _gotoStep2Edit);
  els.activePatient?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      _gotoStep2Edit();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIwNzQwODY2YCBcdTIxOTIgYFAxMjA3NCoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpKSB7XG4gICAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICAgIHJldHVybiBsb2luYztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKExPSU5DX01BUCkpIHtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrZXkudG9Mb3dlckNhc2UoKSl9YCkudGVzdChjb21iaW5lZCkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tYmluZWQuaW5jbHVkZXMoa2V5LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICByZXR1cm4gbG9pbmM7XG4gICAgfVxuICB9XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQsIG1hc2tJZCwgbWFza05hbWUgfSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgREVGQVVMVF9CQUNLRU5EID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMTBcIjtcbi8vIERlZmF1bHQgU01BUlQgYXBwIGZvciBhIGZyZXNoIGluc3RhbGwuIFVzZXJzIGNhbiBvdmVycmlkZSB2aWFcbi8vIHRoZSAnXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgU01BUlQgQXBwIExhdW5jaCBVUkwnIGZpZWxkOyB0aGUgdmFsdWUgaXNcbi8vIHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlciBgc21hcnRBcHBMYXVuY2hVcmxgLlxuY29uc3QgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpci9zbWFydC9sYXVuY2hcIjtcblxuLy8gVHJ1ZSBpZiB0aGUgYWN0aXZlIHRhYiBpcyBhbiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHBhZ2UgKHJlYWwgc2l0ZSkuXG5mdW5jdGlvbiBpc05oaVRhYih1cmwpIHtcbiAgaWYgKCF1cmwpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IG5ldyBVUkwodXJsKSA6IHVybDtcbiAgICByZXR1cm4gL215aGVhbHRoYmFua1xcLm5oaVxcLmdvdlxcLnR3Ly50ZXN0KHUuaG9zdG5hbWUpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgREVGQVVMVF9NT0RFID0gXCJsb2NhbFwiO1xuXG5jb25zdCBlbHMgPSB7XG4gIG1vZGVSYWRpb3M6ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzeW5jLW1vZGVcIl0nKSxcbiAgYmFja2VuZFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXVybFwiKSxcbiAgc3luY0FwaUtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWFwaS1rZXlcIiksXG4gIHNtYXJ0QXBwVXJsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNtYXJ0LWFwcC11cmxcIiksXG4gIHN5bmNBcGlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGktYnRuXCIpLFxuICBzeW5jQmxvY2tlZFJlYXNvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWJsb2NrZWQtcmVhc29uXCIpLFxuICBhcGlTeW5jUmFuZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBpLXN5bmMtcmFuZ2VcIiksXG4gIHN0b3BCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIiksXG4gIG92SWRObzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1pZC1ub1wiKSxcbiAgb3ZOYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LW5hbWVcIiksXG4gIG92QmlydGhEYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWJpcnRoLWRhdGVcIiksXG4gIG92R2VuZGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWdlbmRlclwiKSxcbiAgb3ZTYXZlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LXNhdmUtYnRuXCIpLFxuICBvdkNsZWFyQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWNsZWFyLWJ0blwiKSxcbiAgb3ZTdW1tYXJ5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJyaWRlLXN1bW1hcnlcIiksXG4gIHBhdGllbnRPdmVycmlkZURldGFpbHM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF0aWVudC1vdmVycmlkZVwiKSxcbiAgbGF1bmNoQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdW5jaC1idG5cIiksXG4gIHN0YXR1czogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGF0dXNcIiksXG4gIGRhc2hib2FyZExpbms6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFzaGJvYXJkLWxpbmtcIiksXG4gIHBlbmRpbmdCdW5kbGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGVuZGluZy1idW5kbGVcIiksXG4gIGRvd25sb2FkQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvd25sb2FkLWJ1bmRsZS1idG5cIiksXG4gIGNsZWFyQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyLWJ1bmRsZS1idG5cIiksXG4gIC8vIGJ1bmRsZU1ldGEgbGVnYWN5IGlkIHJlbW92ZWQgaW4gdGhlIHBhbmVsLW1lcmdlOyBmaWxlbmFtZStzaXplIG5vd1xuICAvLyBsaXZlIGluIGRlZGljYXRlZCAjYnVuZGxlLWZpbGVuYW1lIC8gI2J1bmRsZS1zaXplYWdlIGVsZW1lbnRzXG4gIC8vIGJlbG93LlxuICBjb25uQmFubmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tYmFubmVyXCIpLFxuICBjb25uU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLXNlY3Rpb25cIiksXG4gIGNvbm5NaW5pOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tbWluaVwiKSxcbiAgY29ubk1zZzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLW1zZ1wiKSxcbiAgY29ublJldHJ5QnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tcmV0cnktYnRuXCIpLFxuICBjb25uSGVscDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLWhlbHBcIiksXG4gIGRhdGFTdGF0ZVNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0YS1zdGF0ZS1zZWN0aW9uXCIpLFxuICBiYWNrZW5kU3RhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja2VuZC1zdGF0ZVwiKSxcbiAgbG9jYWxTdGF0ZVJvdzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2NhbC1zdGF0ZS1yb3dcIiksXG4gIGxvY2FsU3RhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9jYWwtc3RhdGVcIiksXG4gIHB1c2hMb2NhbEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwdXNoLWxvY2FsLWJ0blwiKSxcbiAgc3luY1N0YXR1c0hpbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1zdGF0dXMtaGludFwiKSxcbiAgc2lkZWJhckVuYWJsZWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci1lbmFibGVkXCIpLFxuICBtYXNrTmFtZUVuYWJsZWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFzay1uYW1lLWVuYWJsZWRcIiksXG4gIG9wZW5OaGlTZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tbmhpLXNlY3Rpb25cIiksXG4gIG9wZW5OaGlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1uaGktYnRuXCIpLFxuICBuaGlOZWVkc0xvZ2luU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuaGktbmVlZHMtbG9naW4tc2VjdGlvblwiKSxcbiAgbG9naW5Pa1NlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW4tb2stc2VjdGlvblwiKSxcbiAgd2l6YXJkU3RlcHBlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aXphcmQtc3RlcHBlclwiKSxcbiAgcmVzdWx0Wm9uZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHQtem9uZVwiKSxcbiAgYWN0aXZlUGF0aWVudDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY3RpdmUtcGF0aWVudFwiKSxcbiAgYWN0aXZlUGF0aWVudFZhbHVlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFjdGl2ZS1wYXRpZW50LXZhbHVlXCIpLFxuICBidW5kbGVNZXRhQmxvY2s6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVuZGxlLW1ldGEtYmxvY2tcIiksXG4gIGJ1bmRsZUZpbGVuYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1bmRsZS1maWxlbmFtZVwiKSxcbiAgYnVuZGxlU2l6ZWFnZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidW5kbGUtc2l6ZWFnZVwiKSxcbn07XG5cbmNvbnN0IE5ISV9MQU5ESU5HID0gXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3L0lIS0UzMDAwXCI7XG5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcblxuLy8gUGVyc2lzdGVkLXN0YXRlIGtleXMuIEJhY2tlbmQgVVJMIGFuZCBBUEkga2V5IHBlcnNpc3QgYWNyb3NzIGJyb3dzZXIgc2Vzc2lvbnMuXG5hc3luYyBmdW5jdGlvbiBsb2FkQmFja2VuZFVybCgpIHtcbiAgY29uc3QgeyBiYWNrZW5kVXJsLCBzeW5jQXBpS2V5LCBzbWFydEFwcExhdW5jaFVybCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFxuICAgIFtcImJhY2tlbmRVcmxcIiwgXCJzeW5jQXBpS2V5XCIsIFwic21hcnRBcHBMYXVuY2hVcmxcIl1cbiAgKTtcbiAgZWxzLmJhY2tlbmRVcmwudmFsdWUgPSBiYWNrZW5kVXJsIHx8IERFRkFVTFRfQkFDS0VORDtcbiAgZWxzLnN5bmNBcGlLZXkudmFsdWUgPSBzeW5jQXBpS2V5IHx8IFwiXCI7XG4gIGVscy5zbWFydEFwcFVybC52YWx1ZSA9IHNtYXJ0QXBwTGF1bmNoVXJsIHx8IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSDtcbiAgZWxzLmRhc2hib2FyZExpbmsuaHJlZiA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnJlcGxhY2UoLzo4MDEwLiokLywgXCI6MzAxMFwiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBhdGllbnQgb3ZlcnJpZGUgKG1hbnVhbCBOSEkgaWRlbnRpdHkpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBkb2Vzbid0IGV4cG9zZSB0aGUgdXNlcidzIG5hdGlvbmFsIElEIGluIHRoZSBVUkwuIFRoZSB1c2VyXG4vLyBmaWxscyB0aGVzZSBvbmNlIGFuZCB0aGV5J3JlIHNlbnQgd2l0aCBldmVyeSB1cGxvYWQgY2FsbCB1bnRpbCBjbGVhcmVkLlxuXG5hc3luYyBmdW5jdGlvbiBsb2FkUGF0aWVudE92ZXJyaWRlKCkge1xuICBjb25zdCB7IHBhdGllbnRPdmVycmlkZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwicGF0aWVudE92ZXJyaWRlXCIpO1xuICBpZiAocGF0aWVudE92ZXJyaWRlKSB7XG4gICAgZWxzLm92SWROby52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5pZF9ubyB8fCBcIlwiO1xuICAgIGVscy5vdk5hbWUudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiO1xuICAgIGVscy5vdkJpcnRoRGF0ZS52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5iaXJ0aF9kYXRlIHx8IFwiXCI7XG4gICAgZWxzLm92R2VuZGVyLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmdlbmRlciB8fCBcIlwiO1xuICB9XG4gIC8vIEEgc3RvcmVkIG92ZXJyaWRlIHdpdGggYm90aCByZXF1aXJlZCBmaWVsZHMgY291bnRzIGFzIFwic3RlcCAyXG4gIC8vIGFscmVhZHkgY29uZmlybWVkXCIgXHUyMDE0IHJldHVybmluZyB1c2VyIHNob3VsZG4ndCBiZSBmb3JjZWQgdG8gY2xpY2tcbiAgLy8gXHUyNzEzIFx1NzhCQVx1NUI5QSBhZ2FpbiB0byBhZHZhbmNlIHRoZSB3aXphcmQuXG4gIF9tYXJrU3RlcDJDb25maXJtZWQoXG4gICAgISEocGF0aWVudE92ZXJyaWRlPy5nZW5kZXIgJiYgcGF0aWVudE92ZXJyaWRlPy5iaXJ0aF9kYXRlKSxcbiAgKTtcbiAgLy8gUGF0aWVudCBwYW5lbCBpcyBub3cgYWx3YXlzLWV4cGFuZGVkIChzdGVwIDIgb3ducyBpdHMgb3duIHBhZ2UpO1xuICAvLyB0aGUgcHJldmlvdXMgY29sbGFwc2Utd2hlbi1jb25maXJtZWQgYmVoYXZpb3VyIHdhcyBhIGxlZnRvdmVyIGZyb21cbiAgLy8gdGhlIHNpbmdsZS1zY3JvbGwgbGF5b3V0LlxuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG59XG5cbmZ1bmN0aW9uIGdldFBhdGllbnRPdmVycmlkZSgpIHtcbiAgLy8gUmV0dXJucyB7aWRfbm8sIG5hbWUsIGJpcnRoX2RhdGUsIGdlbmRlcn0uXG4gIC8vIGlkX25vIGlzIG9wdGlvbmFsIGluIHRoZSBVSTsgaWYgYmxhbmsgdGhlIHBvcHVwIGF1dG8tZ2VuZXJhdGVzIGFuXG4gIC8vIFwiYXV0by1YWFhYWFhYWFwiIGlkZW50aWZpZXIgYXQgc2F2ZSB0aW1lLiBSZXR1cm5zIG51bGwgd2hlbiBib3RoXG4gIC8vIGlkX25vIGFuZCBuYW1lIGFyZSBlbXB0eSAobm90aGluZyBpZGVudGlmeWluZyB0byBzYXZlKS5cbiAgY29uc3QgaWRfbm8gPSBlbHMub3ZJZE5vLnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgbmFtZSA9IGVscy5vdk5hbWUudmFsdWUudHJpbSgpO1xuICBpZiAoIWlkX25vICYmICFuYW1lKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgb3V0ID0gaWRfbm8gPyB7IGlkX25vIH0gOiB7fTtcbiAgaWYgKG5hbWUpIG91dC5uYW1lID0gbmFtZTtcbiAgY29uc3QgYmlydGhfZGF0ZSA9IGVscy5vdkJpcnRoRGF0ZS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGdlbmRlciA9IGVscy5vdkdlbmRlci52YWx1ZTtcbiAgaWYgKGJpcnRoX2RhdGUpIG91dC5iaXJ0aF9kYXRlID0gYmlydGhfZGF0ZTtcbiAgaWYgKGdlbmRlcikgb3V0LmdlbmRlciA9IGdlbmRlcjtcbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB0aGUgcGF0aWVudCBjYXJkJ3MgYmlydGgtZGF0ZSBpbnB1dC4gUmV0dXJucyBudWxsIHdoZW4gT0ssXG4gKiBvdGhlcndpc2UgYSB1c2VyLWZhY2luZyBlcnJvciBzdHJpbmcuIFJlYWRzIGRpcmVjdGx5IGZyb20gdGhlXG4gKiA8aW5wdXQgdHlwZT1cImRhdGVcIj4gc28gd2UgY2FuIGRldGVjdCBwYXJ0aWFsLWlucHV0IHN0YXRlcyB0aGF0XG4gKiBDaHJvbWUgcmVwb3J0cyB0aHJvdWdoIGB2YWxpZGl0eS5iYWRJbnB1dGAgKHRoZSBpbnB1dCdzIGAudmFsdWVgXG4gKiBpcyBcIlwiIGluIHRoYXQgY2FzZSwgaW5kaXN0aW5ndWlzaGFibGUgZnJvbSBcImJsYW5rXCIgYnkgc3RyaW5nIGNoZWNrXG4gKiBhbG9uZSBcdTIwMTQgdGhhdCdzIHdoeSB0aGUgb2xkIHZlcnNpb24gb2YgdGhpcyBmdW5jdGlvbiBsZXQgcGFydGlhbFxuICogeWVhci1vbmx5IGVudHJpZXMgc2xpcCB0aHJvdWdoKS5cbiAqXG4gKiBBbGxvd2VkIHN0YXRlczpcbiAqICAgLSBnZW51aW5lbHkgZW1wdHkgKHRoZSBmaWVsZCBpcyBvcHRpb25hbClcbiAqICAgLSBmdWxsIElTTyBZWVlZLU1NLUREIHRoYXQgcm91bmQtdHJpcHMgdGhyb3VnaCBEYXRlKClcbiAqIFJlamVjdGVkOlxuICogICAtIHllYXItb25seSAvIHllYXIrbW9udGg6IHRoZSBpbnB1dCByZW5kZXJzIGJsYW5rIHZhbHVlIGJ1dFxuICogICAgIHZhbGlkaXR5LmJhZElucHV0IGlzIHRydWVcbiAqICAgLSBkYXRlcyBpbiB0aGUgZnV0dXJlXG4gKiAgIC0gaW1wbGF1c2libHkgb2xkIGRhdGVzICh5ZWFyIDwgMTkwMClcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVCaXJ0aERhdGUoKSB7XG4gIGNvbnN0IGVsID0gZWxzLm92QmlydGhEYXRlO1xuICBpZiAoIWVsKSByZXR1cm4gbnVsbDtcbiAgLy8gQ2hyb21lJ3MgbmF0aXZlIGRhdGUgaW5wdXQ6IHBhcnRpYWwgZW50cnkgKGp1c3QgeWVhciwganVzdCB5eXl5LW1tKVxuICAvLyBzdXJmYWNlcyBoZXJlIGV2ZW4gdGhvdWdoIC52YWx1ZSBpcyBcIlwiLlxuICBpZiAoZWwudmFsaWRpdHkgJiYgZWwudmFsaWRpdHkuYmFkSW5wdXQpIHtcbiAgICByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdThBQ0JcdTU4NkJcdTVCOENcdTY1NzRcdTVFNzRcdTY3MDhcdTY1RTVcIjtcbiAgfVxuICBjb25zdCBzID0gKGVsLnZhbHVlIHx8IFwiXCIpLnRyaW0oKTtcbiAgLy8gQmlydGggZGF0ZSBpcyBub3cgcmVxdWlyZWQgXHUyMDE0IGFnZSBhZmZlY3RzIGV2ZXJ5IHJlZmVyZW5jZSByYW5nZVxuICAvLyBhbmQgYW55IGRvd25zdHJlYW0gYWdlLWJhc2VkIFVJOyBlbXB0eSBpbnB1dCBsZXRzIGEgdHlwbyAvIGJyb3dzZXJcbiAgLy8gcXVpcmsgc2lsZW50bHkgcHJvcGFnYXRlIGFzIE5hTi5cbiAgaWYgKCFzKSByZXR1cm4gXCJcdThBQ0JcdTU4NkJcdTc1MUZcdTY1RTVcIjtcbiAgaWYgKCEvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC8udGVzdChzKSkgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU4QUNCXHU1ODZCXHU1QjhDXHU2NTc0XHU1RTc0XHU2NzA4XHU2NUU1XCI7XG4gIGNvbnN0IFt5LCBtLCBkXSA9IHMuc3BsaXQoXCItXCIpLm1hcChOdW1iZXIpO1xuICBjb25zdCBkdCA9IG5ldyBEYXRlKHMgKyBcIlQwMDowMDowMFpcIik7XG4gIGlmIChcbiAgICBOdW1iZXIuaXNOYU4oZHQuZ2V0VGltZSgpKSB8fFxuICAgIGR0LmdldFVUQ0Z1bGxZZWFyKCkgIT09IHkgfHxcbiAgICBkdC5nZXRVVENNb250aCgpICsgMSAhPT0gbSB8fFxuICAgIGR0LmdldFVUQ0RhdGUoKSAhPT0gZFxuICApIHtcbiAgICByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdTRFMERcdTY2MkZcdTY3MDlcdTY1NDhcdTY1RTVcdTY3MUZcIjtcbiAgfVxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBpZiAoZHQuZ2V0VGltZSgpID4gbm93LmdldFRpbWUoKSkgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU0RTBEXHU4MEZEXHU2NjJGXHU2NzJBXHU0Rjg2XCI7XG4gIGlmICh5IDwgMTkwMCkgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU1RTc0XHU0RUZEXHU1OTJBXHU2NUU5XHVGRjBDXHU4QUNCXHU3OEJBXHU4QThEXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBSYW5kb20gXCJhdXRvLVhYWFhYWFhYXCIgXHUyMDE0IDggaGV4IGNoYXJzIGZyb20gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyBzb1xuLy8gZXZlcnkgZnJlc2ggcG9wdXAgaW5zdGFsbCBnZXRzIGEgZGlmZmVyZW50IElEIGFuZCByZS1zeW5jcyBhcmUgc3RhYmxlLlxuZnVuY3Rpb24gX2dlbmVyYXRlQXV0b1BhdGllbnRJZCgpIHtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gIGNvbnN0IGhleCA9IEFycmF5LmZyb20oYnl0ZXMsIChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpLmpvaW4oXCJcIik7XG4gIHJldHVybiBgYXV0by0ke2hleH1gO1xufVxuXG5mdW5jdGlvbiByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBjYXJkID0gZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHM7XG4gIGxldCBzdW1tYXJ5VGV4dCA9IFwiXCI7XG4gIGlmICghb3YpIHtcbiAgICBlbHMub3ZTdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTY3MkFcdThBMkRcdTVCOUFcIjtcbiAgICBpZiAoY2FyZCkgY2FyZC5kYXRhc2V0LnN0YXRlID0gXCJlbXB0eVwiO1xuICB9IGVsc2Uge1xuICAgIC8vIE5hbWUgZmlyc3QgKHdoZW4gcHJlc2VudCksIHRoZW4gbWFza2VkIElELiBOYW1lIFx1MjE5MiBcInRoZSBwYXRpZW50XG4gICAgLy8gSSdtIHdvcmtpbmcgd2l0aFwiIHJlYWRzIG5hdHVyYWxseSBmaXJzdDsgSUQgaXMgdGhlIHRlY2huaWNhbFxuICAgIC8vIGRldGFpbC4gUHJldmlvdXNseSB0aGUgb3JkZXIgd2FzIHJldmVyc2VkLCBwdXR0aW5nIGBQMTIwNzQqKioqYFxuICAgIC8vIGFoZWFkIG9mIHRoZSBhY3R1YWwgcGVyc29uJ3MgbmFtZS5cbiAgICAvLyBJRCBhbHdheXMgaGFsZi1tYXNrZWQgKFAxMjA3NDA4NjYgXHUyMTkyIFAxMjA3NCoqKiopIFx1MjAxNCBtYXRjaGVzIE5ISVxuICAgIC8vIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSdzIG93biBVSSBjb252ZW50aW9uIGFuZCByZW1vdmVzIGEgc3RhYmxlIHNob3VsZGVyLVxuICAgIC8vIHN1cmZpbmcgdGFyZ2V0LiBSYXcgdmFsdWUgc3RpbGwgaW4gc3RvcmFnZSArIHRoZSBpbnB1dCBmaWVsZC5cbiAgICAvLyBOYW1lIGZvbGxvd3MgdGhlIG1hc2sgdG9nZ2xlIChcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjggXHU5ODEwXHU4QTJEXHU5NURDID0gXHU3NzFGXHU1NDBEIC9cbiAgICAvLyBtdWx0aS1wYXRpZW50IGRlbW8gXHU5NThCXHU1NTVGID0gXHU5MDZFXHU3RjY5KS5cbiAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgIGlmIChvdi5uYW1lKSBwYXJ0cy5wdXNoKF9tYXliZU1hc2sob3YubmFtZSkpO1xuICAgIHBhcnRzLnB1c2gobWFza0lkKG92LmlkX25vKSk7XG4gICAgc3VtbWFyeVRleHQgPSBwYXJ0cy5qb2luKFwiICBcdTAwQjcgIFwiKTtcbiAgICBlbHMub3ZTdW1tYXJ5LnRleHRDb250ZW50ID0gYFx1MjcxMyAke3N1bW1hcnlUZXh0fWA7XG4gICAgaWYgKGNhcmQpIGNhcmQuZGF0YXNldC5zdGF0ZSA9IFwiZmlsbGVkXCI7XG4gIH1cbiAgLy8gTWlycm9yIHRoZSBzYW1lIHN1bW1hcnkgb250byBzdGVwIDMncyBcIlx1NTNENlx1NUY5N1x1NUMwRFx1OEM2MVwiIGJhbm5lciBzbyB0aGVcbiAgLy8gdXNlciBrbm93cyB3aG8gdGhleSdyZSBhYm91dCB0byBmZXRjaCB3aXRob3V0IHNjcm9sbGluZyBiYWNrIHRvXG4gIC8vIHN0ZXAgMi4gT25seSB3aGVuIHN0ZXAgMiBoYXMgYmVlbiBjb25maXJtZWQgQU5EIHRoZSBvdmVycmlkZVxuICAvLyBhY3R1YWxseSBoYXMgYW4gaWRfbm8uXG4gIGlmIChlbHMuYWN0aXZlUGF0aWVudCAmJiBlbHMuYWN0aXZlUGF0aWVudFZhbHVlKSB7XG4gICAgY29uc3Qgc2hvd0FjdGl2ZSA9IF9zdGVwMkNvbmZpcm1lZCAmJiAhIW92Py5pZF9ubztcbiAgICBlbHMuYWN0aXZlUGF0aWVudC5oaWRkZW4gPSAhc2hvd0FjdGl2ZTtcbiAgICBpZiAoc2hvd0FjdGl2ZSkgZWxzLmFjdGl2ZVBhdGllbnRWYWx1ZS50ZXh0Q29udGVudCA9IHN1bW1hcnlUZXh0O1xuICB9XG4gIC8vIEJvdGggbGF1bmNoICsgc3luYyBlbmFibGVkIHN0YXRlIGRlcGVuZCBvbiBwYXRpZW50ICsgbW9kZSArIGNvbm4uXG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIENoYW5naW5nIHBhdGllbnQgSUQgaW52YWxpZGF0ZXM6IChhKSBiYWNrZW5kLXN0YXRlIGNhY2hlIChuZXdcbiAgLy8gcGF0aWVudCBtaWdodCBub3QgYmUgb24gYmFja2VuZCk7IChiKSBsb2NhbC1idW5kbGUgcm93IGluIHRoZVxuICAvLyBkYXRhLXN0YXRlIGNhcmQ7IChjKSB0aGUgXHVEODNEXHVEQ0U1IGRvd25sb2FkIGJ1bmRsZSBzZWN0aW9uLCB3aGljaCB3b3VsZFxuICAvLyBvdGhlcndpc2Ugc3RpbGwgc2hvdyB0aGUgcHJldmlvdXMgcGF0aWVudCdzIHN0YXNoZWQgZmlsZTsgKGQpXG4gIC8vIHRoZSBsYXN0IGNvbXBsZXRlZCBzeW5jJ3Mgc3VjY2VzcyBtZXNzYWdlLCB3aGljaCB3YXMgdGFnZ2VkIGZvclxuICAvLyB0aGUgcHJldmlvdXMgcGF0aWVudC5cbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuICBfY2xlYXJTdGFsZVN5bmNTdGF0dXMoZ2V0UGF0aWVudE92ZXJyaWRlKCkpO1xuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiYgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG59XG5cbi8vIERyb3AgYSBcIlx1MjcwNSBcdTU0MENcdTZCNjVcdTVCOENcdTYyMTAgXHUyMDI2XCIgc3RhdHVzIGJhbm5lciB0aGF0IHdhcyByZWNvcmRlZCBmb3IgYVxuLy8gZGlmZmVyZW50IHBhdGllbnQuIE1pZC1mbGlnaHQgc3luY3MgYXJlIGxlZnQgYWxvbmUgKHN0YXR1cy5ydW5uaW5nKVxuLy8gc28gdGhlIHVzZXIgY2FuIHN0aWxsIHNlZSBwcm9ncmVzcyBvZiB0aGUgaW4tZmxpZ2h0IHN5bmMuXG5mdW5jdGlvbiBfY2xlYXJTdGFsZVN5bmNTdGF0dXMob3YpIHtcbiAgaWYgKCFfbGF0ZXN0U3RhdHVzKSByZXR1cm47XG4gIGlmIChfbGF0ZXN0U3RhdHVzLnJ1bm5pbmcpIHJldHVybjtcbiAgaWYgKCFfbGF0ZXN0U3RhdHVzLmhpc3RubykgcmV0dXJuO1xuICBpZiAob3Y/LmlkX25vID09PSBfbGF0ZXN0U3RhdHVzLmhpc3RubykgcmV0dXJuO1xuICBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbiAgc2V0U3RhdHVzKFwiXCIsIG51bGwpO1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoXCJzeW5jU3RhdHVzXCIpLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2F2ZVBhdGllbnRPdmVycmlkZSgpIHtcbiAgLy8gR2VuZGVyICsgYmlydGhfZGF0ZSBhcmUgcmVxdWlyZWQuIGlkX25vIC8gbmFtZSBhcmUgb3B0aW9uYWwgXHUyMDE0XG4gIC8vIGlkX25vIHdpbGwgYmUgYXV0by1mZXRjaGVkIG9uIHN5bmMsIG5hbWUgY2FuIGJlIGxlZnQgYmxhbmsgb3IgZmFrZS5cbiAgaWYgKCFlbHMub3ZHZW5kZXIudmFsdWUpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU4QUNCXHU5MDc4XHU2NEM3XHU2MDI3XHU1MjI1XCIsIFwiZXJyb3JcIik7XG4gICAgZWxzLm92R2VuZGVyLmZvY3VzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGRvYkVycm9yID0gdmFsaWRhdGVCaXJ0aERhdGUoKTtcbiAgaWYgKGRvYkVycm9yKSB7XG4gICAgc2V0U3RhdHVzKGBcdTI2RDQgJHtkb2JFcnJvcn1gLCBcImVycm9yXCIpO1xuICAgIGVscy5vdkJpcnRoRGF0ZS5mb2N1cygpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBCdWlsZCB0aGUgb3ZlcnJpZGUgZGlyZWN0bHkgc28gd2UgZG9uJ3QgZGVwZW5kIG9uXG4gIC8vIGdldFBhdGllbnRPdmVycmlkZSdzIFwibXVzdCBoYXZlIGlkX25vIG9yIG5hbWVcIiBudWxsLXJldHVybiBcdTIwMTQgdGhlXG4gIC8vIHJlcXVpcmVkLWZpZWxkIHBhdGggYWJvdmUgaGFzIGFscmVhZHkgdmFsaWRhdGVkIHdoYXQgbWF0dGVycy5cbiAgY29uc3Qgb3YgPSB7XG4gICAgaWRfbm86IGVscy5vdklkTm8udmFsdWUudHJpbSgpIHx8IG51bGwsXG4gICAgbmFtZTogZWxzLm92TmFtZS52YWx1ZS50cmltKCkgfHwgbnVsbCxcbiAgICBiaXJ0aF9kYXRlOiBlbHMub3ZCaXJ0aERhdGUudmFsdWUudHJpbSgpLFxuICAgIGdlbmRlcjogZWxzLm92R2VuZGVyLnZhbHVlLFxuICB9O1xuICBpZiAoIW92LmlkX25vKSBkZWxldGUgb3YuaWRfbm87XG4gIGlmICghb3YubmFtZSkgZGVsZXRlIG92Lm5hbWU7XG4gIC8vIElEIGF1dG8tZ2VuZXJhdGlvbjogaWYgdXNlciBsZWZ0IGlkX25vIGJsYW5rLCBtaW50IGFuIFwiYXV0by1YWFhYXCJcbiAgLy8gYW5kIHN0YXNoIGl0IGluIHRoZSBVSSBzbyBzdWJzZXF1ZW50IHJlLXN5bmNzIHVzZSB0aGUgc2FtZSBGSElSXG4gIC8vIFBhdGllbnQuaWQgKHN0b3JhZ2UgcGVyc2lzdGVuY2Uga2VlcHMgaXQgc3RhYmxlIGFjcm9zcyByZS1vcGVucykuXG4gIGlmICghb3YuaWRfbm8pIHtcbiAgICBvdi5pZF9ubyA9IF9nZW5lcmF0ZUF1dG9QYXRpZW50SWQoKTtcbiAgICBlbHMub3ZJZE5vLnZhbHVlID0gb3YuaWRfbm87XG4gIH1cblxuICAvLyBEZXRlY3QgaWRlbnRpdHkgc3dpdGNoOiBpZiB0aGUgcHJldmlvdXMgc2F2ZWQgb3ZlcnJpZGUgd2FzIGZvciBhXG4gIC8vIGRpZmZlcmVudCBwYXRpZW50LCB0aGUgcmVzdWx0LXpvbmUgY29udGVudHMgKHBlbmRpbmcgYnVuZGxlIGZyb21cbiAgLy8gcGF0aWVudCBBJ3Mgc3luYywgbGFzdCBjb21wbGV0aW9uIHN0YXR1cyB3aXRoIEEncyBpZCwgYmFja2VuZFxuICAvLyBwcmVzZW5jZSBjYWNoZSwgZXRjLikgYXJlIHN0YWxlIFx1MjAxNCBudWtlIHRoZW0gc28gc3RlcCAzIGRvZXNuJ3RcbiAgLy8gbWlzbGVhZGluZ2x5IGNhcnJ5IEEncyBsZWZ0b3ZlcnMgaW50byBCJ3MgY29udGV4dC5cbiAgY29uc3QgcHJldlN0b3JlZCA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJwYXRpZW50T3ZlcnJpZGVcIikpXG4gICAgLnBhdGllbnRPdmVycmlkZTtcbiAgY29uc3QgcGF0aWVudENoYW5nZWQgPVxuICAgIHByZXZTdG9yZWQ/LmlkX25vICYmIG92LmlkX25vICYmIHByZXZTdG9yZWQuaWRfbm8gIT09IG92LmlkX25vO1xuXG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHBhdGllbnRPdmVycmlkZTogb3YgfSk7XG5cbiAgaWYgKHBhdGllbnRDaGFuZ2VkKSB7XG4gICAgLy8gMS4gZHJvcCB0aGUgcHJpb3IgbG9jYWwgRkhJUiBidW5kbGUgKGRvd25sb2FkIGJ1dHRvbiBjb250ZW50KVxuICAgIC8vIDIuIGRyb3AgdGhlIFNXJ3MgbGFzdCBzeW5jIHN0YXR1cyBzbyB0aGUgcmVzdWx0IHpvbmUgZG9lc24ndFxuICAgIC8vICAgIGtlZXAgc2hvd2luZyBcIlx1MjcwNSBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTAgXHUwMEI3IEEgXHU3Njg0IDgxIFx1N0I0Nlx1MjAyNlwiXG4gICAgLy8gMy4gZHJvcCB0aGUgaW4tcG9wdXAgbGF0ZXN0LXN0YXR1cyBzbmFwc2hvdFxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICBhd2FpdCBjaHJvbWUucnVudGltZVxuICAgICAgLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJjbGVhclN5bmNTdGF0dXNcIiB9KVxuICAgICAgLmNhdGNoKCgpID0+IHt9KTtcbiAgICBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbiAgICBzZXRTdGF0dXMoXCJcIiwgbnVsbCk7XG4gIH1cblxuICBfbWFya1N0ZXAyQ29uZmlybWVkKHRydWUpO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIFN1Y2Nlc3NmdWwgc2F2ZSBpcyBUSEUgaW50ZW50aW9uYWwgc3RlcC0yIGNvbXBsZXRpb24gZXZlbnQgXHUyMDE0IHRoaXNcbiAgLy8gaXMgd2hlcmUgdGhlIHdpemFyZCBpcyBhbGxvd2VkIHRvIGFkdmFuY2UgZm9yd2FyZC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX21heWJlQXV0b0FkdmFuY2UoKTtcbiAgLy8gTWFrZSBjbGVhciB0aGlzIGlzIHRoZSBpZGVudGl0eSBzYXZlLCBub3QgYSBtZWRpY2FsLXJlY29yZCBzeW5jIFx1MjAxNFxuICAvLyBcdTMwMENcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcdTMwMERhbG9uZSByZWFkcyBhcyBcInBhdGllbnQgZGF0YVwiIChtZWRpY2FsKSBmb3Igc29tZSB1c2Vycy5cbiAgLy8gSUQgaGFsZi1tYXNrZWQgaW4gdGhlIHRvYXN0IGZvciB0aGUgc2FtZSBzaG91bGRlci1zdXJmaW5nIHJlYXNvblxuICAvLyBhcyB0aGUgc3VtbWFyeSBsaW5lIGFib3ZlLlxuICBjb25zdCBkaXNwbGF5TmFtZSA9IG92Lm5hbWUgPyBgICgke19tYXliZU1hc2sob3YubmFtZSl9KWAgOiBcIlwiO1xuICBzZXRTdGF0dXMoYFx1MjcwNSBcdTc1QzVcdTRFQkFcdThFQUJcdTRFRkRcdTVERjJcdThBMThcdTRGNEZcdUZGMUEke21hc2tJZChvdi5pZF9ubyl9JHtkaXNwbGF5TmFtZX1gLCBcInN1Y2Nlc3NcIik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNsZWFyUGF0aWVudE92ZXJyaWRlKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoXCJwYXRpZW50T3ZlcnJpZGVcIik7XG4gIGVscy5vdklkTm8udmFsdWUgPSBcIlwiO1xuICBlbHMub3ZOYW1lLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92QmlydGhEYXRlLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92R2VuZGVyLnZhbHVlID0gXCJcIjtcbiAgX21hcmtTdGVwMkNvbmZpcm1lZChmYWxzZSk7XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgc2V0U3RhdHVzKFwiXHU1REYyXHU2RTA1XHU5NjY0XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCIsIFwiaW5mb1wiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgY29ubmVjdGlvbiBzdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBTaW5nbGUgc291cmNlIG9mIHRydXRoOiBgX2Nvbm5TdGF0ZWAgcmVmbGVjdHMgdGhlIGxhdGVzdCBiYWNrZW5kXG4vLyBjb25uZWN0aXZpdHkgY2hlY2suIEJvdGggdGhlIGJhbm5lciBVSSBhbmQgdGhlIGVuYWJsZWQtc3RhdGUgb2YgdGhlXG4vLyBcdUQ4M0RcdURDRTUgU3luYyAvIFx1RDgzRFx1REU4MCBMYXVuY2ggYnV0dG9ucyByZWFkIGZyb20gaXQuXG4vL1xuLy8gU3RhdGVzOlxuLy8gICBcInVua25vd25cIiAgXHUyMDE0IG5vdCB5ZXQgY2hlY2tlZCAoZS5nLiBmaXJzdCBwYWludCBpbiBsb2NhbCBtb2RlKVxuLy8gICBcImNoZWNraW5nXCIgXHUyMDE0IGZldGNoIGluIGZsaWdodFxuLy8gICBcIm9rXCIgICAgICAgXHUyMDE0IEdFVCAvZmhpci9tZXRhZGF0YSByZXR1cm5lZCBhIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFxuLy8gICBcImZhaWxcIiAgICAgXHUyMDE0IGFueXRoaW5nIGVsc2U7IGBfY29ubkZhaWxSZWFzb25gIGNhcnJpZXMgZGV0YWlsXG4vL1xuLy8gQmFja2VuZCBjb25uZWN0aXZpdHkgaXMgdHJlYXRlZCBhcyBhICpwcmVyZXF1aXNpdGUqIGZvciBiYWNrZW5kIG1vZGUsXG4vLyBub3QgYXMgYSBwZXItYWN0aW9uIGNoZWNrLiBTd2l0Y2hpbmcgdG8gYmFja2VuZCBtb2RlIHRyaWdnZXJzIGEgdGVzdFxuLy8gaW1tZWRpYXRlbHk7IGZhaWx1cmUgc2hvd3MgYSBiYW5uZXIgd2l0aCBhY3Rpb25hYmxlIGd1aWRhbmNlIGFuZFxuLy8gZGlzYWJsZXMgYm90aCBhY3Rpb24gYnV0dG9ucyB1bnRpbCBjb25uZWN0aXZpdHkgcmVjb3ZlcnMuXG5cbmxldCBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7XG5sZXQgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDsgLy8geyBraW5kOiBcIm5vLXBlcm1pc3Npb25cIiB8IFwibm8tdXJsXCIgfCBcIm5ldHdvcmtcIiB8IFwidGltZW91dFwiIHwgXCJodHRwXCIgfCBcIm5vdC1maGlyXCIsIGRldGFpbD8gfVxuXG4vLyBCYW5uZXIgY29weS4gRHJvcCB0aGUgbGVhZGluZyBcdTI3MTcgXHUyMDE0IHRoZSByZWQgZG90IGxlZnQgb2YgdGhlIHRleHQgaXNcbi8vIGFscmVhZHkgdGhlIFwiZmFpbFwiIHNpZ25hbCwgYW5kIHRoZSByb3cgd2FzIHJlYWRpbmcgXCJcdTI1Q0YgXHUyNzE3IFx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiXG4vLyA9IHRocmVlIGluZGljYXRvcnMgc3RhY2tlZC5cbmNvbnN0IF9DT05OX0xBQkVMUyA9IHtcbiAgdW5rbm93bjogXCJcdTY3MkFcdTZBQTJcdTZFMkNcIixcbiAgY2hlY2tpbmc6IFwiXHU2QUEyXHU2RTJDXHU0RTJEXHUyMDI2XCIsXG4gIG9rOiAoKSA9PiBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gLFxuICBmYWlsOiAoKSA9PiB7XG4gICAgY29uc3QgciA9IF9jb25uRmFpbFJlYXNvbiB8fCB7fTtcbiAgICByZXR1cm4gKHtcbiAgICAgIFwibm8tdXJsXCI6IFwiXHU2NzJBXHU4QTJEXHU1QjlBIEJhY2tlbmQgVVJMXCIsXG4gICAgICBcIm5vLXBlcm1pc3Npb25cIjogXCJcdTY3MkFcdTYzODhcdTZCMEFcdTkwMjNcdTdEREFcIixcbiAgICAgIFwibmV0d29ya1wiOiBcIlx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiLFxuICAgICAgXCJ0aW1lb3V0XCI6IFwiXHU5MDIzXHU3RERBXHU5MDNFXHU2NjQyXCIsXG4gICAgICBcImh0dHBcIjogYEhUVFAgJHtyLmRldGFpbCB8fCBcIlwifWAudHJpbSgpLFxuICAgICAgXCJub3QtZmhpclwiOiBcIlx1NTZERVx1NjFDOVx1NEUwRFx1NjYyRiBGSElSXCIsXG4gICAgfSlbci5raW5kXSA/PyBcIlx1OTAyM1x1N0REQVx1NTkzMVx1NjU1N1wiO1xuICB9LFxufTtcblxuY29uc3QgX0NPTk5fSEVMUCA9IHtcbiAgXCJuby11cmxcIjogICAgICAgIFwiXHU4QUNCXHU1MjMwXHUzMDBDXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBXHUzMDBEXHU1ODZCXHU1MTY1IEJhY2tlbmQgVVJMXHVGRjBDXHU0RjhCXHU1OTgyIDxjb2RlPmh0dHA6Ly9sb2NhbGhvc3Q6ODAxMDwvY29kZT5cdTMwMDJcIixcbiAgXCJuby1wZXJtaXNzaW9uXCI6IFwiQ2hyb21lIFx1OTYzQlx1NjRDQlx1NEU4Nlx1OERFOFx1NEY4Nlx1NkU5MFx1OEFDQlx1NkM0Mlx1MzAwMlx1OEFDQlx1OTFDRFx1NjVCMFx1OTU4QiBwb3B1cFx1RkYwQ1x1NzU3Nlx1NkIwQVx1OTY1MFx1NUMwRFx1OEE3MVx1Njg0Nlx1OERGM1x1NTFGQVx1NjY0Mlx1NjMwOVx1MzAwQ1x1NTE0MVx1OEEzMVx1MzAwRFx1MzAwMlwiLFxuICBcIm5ldHdvcmtcIjogICAgICAgXCJcdTVGOENcdTdBRUZcdTUzRUZcdTgwRkRcdTkwODRcdTZDOTJcdTU1NUZcdTUyRDVcdTMwMDJcdThBQ0JcdTU3RjdcdTg4NENcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgdXAgLWQ8L2NvZGU+PGJyPlx1NzhCQVx1OEE4RCBiYWNrZW5kIFx1NUJCOVx1NTY2OFx1OEREMVx1OEQ3N1x1NEY4Nlx1NTE4RFx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcInRpbWVvdXRcIjogICAgICAgXCI1IFx1NzlEMlx1NTE2N1x1NkM5Mlx1NjUzNlx1NTIzMFx1NTZERVx1NjFDOSBcdTIwMTQgYmFja2VuZCBcdTUzRUZcdTgwRkRcdTkwODRcdTU3MjhcdTU1NUZcdTUyRDVcdTRFMkRcdUZGMENcdTdCNDkgMzAgXHU3OUQyXHU1MThEXHU2MzA5XHU5MUNEXHU4QTY2XHUzMDAyXCIsXG4gIFwiaHR0cFwiOiAgICAgICAgICBcIkJhY2tlbmQgXHU1NkRFXHU2MUM5XHU5MzJGXHU4QUE0XHU3MkMwXHU2MTRCXHU3OEJDXHUzMDAyXHU2QUEyXHU2N0U1IGJhY2tlbmQgXHU3Njg0IGxvZ1x1RkYxQTxicj48Y29kZT5kb2NrZXIgY29tcG9zZSBsb2dzIGJhY2tlbmQ8L2NvZGU+XCIsXG4gIFwibm90LWZoaXJcIjogICAgICBcIlx1OTAxOVx1NTAwQiBVUkwgXHU1NkRFXHU0RTg2XHU2NzcxXHU4OTdGXHVGRjBDXHU0RjQ2XHU0RTBEXHU2NjJGIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFx1MzAwMlx1NzhCQVx1OEE4RCBCYWNrZW5kIFVSTCBcdTYzMDdcdTU0MTEgTkhJLUZISVItQnJpZGdlIFx1NzY4NCAvZmhpciBcdTY4MzlcdTc2RUVcdTkzMDRcdTMwMDJcIixcbn07XG5cbmZ1bmN0aW9uIF9yZW5kZXJDb25uQmFubmVyKCkge1xuICBjb25zdCBiYW5uZXIgPSBlbHMuY29ubkJhbm5lcjtcbiAgaWYgKCFiYW5uZXIpIHJldHVybjtcbiAgYmFubmVyLmRhdGFzZXQuc3RhdGUgPSBfY29ublN0YXRlO1xuICAvLyBNaXJyb3Igc3RhdGUgb250byB0aGUgb3V0ZXIgLmNvbm4tYmxvY2sgc28gdGhlIHdyYXBwZXIgYm9yZGVyXG4gIC8vICh3aGljaCBob2xkcyBiYW5uZXIgKyBoZWxwIGJvZHkgaW5zaWRlIE9ORSBjYXJkKSB0cmFja3MgdGhlIHNhbWVcbiAgLy8gY29sb3IgdGhlIGJhbm5lciBpcyB1c2luZy5cbiAgaWYgKGVscy5jb25uU2VjdGlvbikgZWxzLmNvbm5TZWN0aW9uLmRhdGFzZXQuc3RhdGUgPSBfY29ublN0YXRlO1xuICBjb25zdCBsYWJlbCA9IF9DT05OX0xBQkVMU1tfY29ublN0YXRlXTtcbiAgZWxzLmNvbm5Nc2cudGV4dENvbnRlbnQgPSB0eXBlb2YgbGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IGxhYmVsKCkgOiBsYWJlbDtcbiAgZWxzLmNvbm5SZXRyeUJ0bi5oaWRkZW4gPSBfY29ublN0YXRlICE9PSBcImZhaWxcIjtcbiAgaWYgKF9jb25uU3RhdGUgPT09IFwiZmFpbFwiICYmIF9jb25uRmFpbFJlYXNvbj8ua2luZCkge1xuICAgIGVscy5jb25uSGVscC5oaWRkZW4gPSBmYWxzZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gX0NPTk5fSEVMUFtfY29ubkZhaWxSZWFzb24ua2luZF0gPz8gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gdHJ1ZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gXCJcIjtcbiAgfVxuXG4gIC8vIENvbXBhY3QtcGlsbCB2cyBmdWxsLWJhbm5lciBzd2FwOiB3aGVuIGV2ZXJ5dGhpbmcncyBmaW5lLCBzaHJpbmsgdG9cbiAgLy8gYSBzbWFsbCBncmVlbiBwaWxsIGluIHRoZSBoZWFkZXIgc28gdGhlIHBvcHVwIGJvZHkgaGFzIG1vcmUgcm9vbVxuICAvLyBmb3IgYWN0aW9uYWJsZSBjb250ZW50LiBBbnl0aGluZyBlbHNlICh1bmtub3duIC8gY2hlY2tpbmcgLyBmYWlsKVxuICAvLyBrZWVwcyB0aGUgZnVsbCBiYW5uZXIgc28gcHJvZ3Jlc3MgKyBlcnJvciBoZWxwIGhhcyBzcGFjZSB0byByZW5kZXIuXG4gIGNvbnN0IGlzT2sgPSBfY29ublN0YXRlID09PSBcIm9rXCI7XG4gIGlmIChlbHMuY29ublNlY3Rpb24pIGVscy5jb25uU2VjdGlvbi5oaWRkZW4gPSBpc09rO1xuICBpZiAoZWxzLmNvbm5NaW5pKSB7XG4gICAgZWxzLmNvbm5NaW5pLmhpZGRlbiA9ICFpc09rO1xuICAgIGlmIChpc09rKSBlbHMuY29ubk1pbmkudGl0bGUgPSBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCAzLXN0ZXAgd2l6YXJkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIENvbmNlcHR1YWxseTpcbi8vICAgU3RlcCAxIFx1MjAxNCBcdTc2N0JcdTUxNjVcdUZGMUFvbiBOSEkgdGFiICsgc2Vzc2lvbiB0b2tlbiBpcyB2YWxpZFxuLy8gICBTdGVwIDIgXHUyMDE0IFx1OEEyRFx1NUI5QVx1RkYxQWdlbmRlciBmaWxsZWQgKyAobW9kZT09bG9jYWwgT1IgYmFja2VuZCByZWFjaGFibGUpXG4vLyAgICAgICAgICAgICAgICArIGJpcnRoX2RhdGUgaWYgZW50ZXJlZCBtdXN0IGJlIHZhbGlkXG4vLyAgIFN0ZXAgMyBcdTIwMTQgXHU1M0Q2XHU1Rjk3XHVGRjFBdGhlIGFjdGlvbiBpdHNlbGYgKHN5bmMgQ1RBLCBzdGF0dXMsIHJlc3VsdHMpXG4vL1xuLy8gU3RlcHMgYXV0by1hZHZhbmNlIHdoZW4gdGhlaXIgcHJlY29uZGl0aW9uIGZsaXBzIGdyZWVuOyB1c2VycyBjYW5cbi8vIGNsaWNrIHRoZSBzdGVwcGVyIHRvIHJldmlzaXQgYW55IHN0ZXAuIFdlIG5ldmVyIGF1dG8tc3RlcCBCQUNLIG9uXG4vLyBzdGF0ZSBjaGFuZ2UgXHUyMDE0IG9uY2UgdGhlIHVzZXIgaGFzIG1vdmVkIGZvcndhcmQsIG9ubHkgYW4gZXhwbGljaXRcbi8vIHN0ZXBwZXIgY2xpY2sgYnJpbmdzIHRoZW0gYmFjay4gT3RoZXJ3aXNlIG9wZW5pbmcgdGhlIHBvcHVwIG1pZC1cbi8vIHN5bmMgd291bGQgamVyayB0aGVtIGJhY2sgdG8gc3RlcCAxLlxubGV0IF9hY3RpdmVTdGVwID0gMTtcbmxldCBfd2l6YXJkSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbi8vIFN0ZXAgMiBpcyBcImRvbmVcIiBvbmx5IGFmdGVyIHRoZSB1c2VyIGhhcyBjbGlja2VkIFx1MjcxMyBcdTc4QkFcdTVCOUEgd2l0aCB2YWxpZFxuLy8gaW5wdXRzLiBXZSB0cmFjayB0aGlzIHdpdGggYSBib29sZWFuIHJhdGhlciB0aGFuIHJlYWRpbmcgbGl2ZSBET01cbi8vIHN0YXRlIFx1MjAxNCBvdGhlcndpc2UgdGhlIHdpemFyZCB3b3VsZCBhdXRvLWFkdmFuY2UgdGhlIG1vbWVudCB0aGVcbi8vIGZpZWxkcyBoYXBwZW5lZCB0byBsb29rIHJpZ2h0LCBiZWZvcmUgdGhlIHVzZXIgaGFkIGEgY2hhbmNlIHRvXG4vLyByZXZpZXcuIEZsaXBwZWQgdHJ1ZSBpbiBzYXZlUGF0aWVudE92ZXJyaWRlIHN1Y2Nlc3MsIGZhbHNlIGluXG4vLyBjbGVhclBhdGllbnRPdmVycmlkZSBhbmQgb24gYSBsb2FkIHRoYXQgeWllbGRzIG5vIHNhdmVkIHJlY29yZC5cbmxldCBfc3RlcDJDb25maXJtZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gX21hcmtTdGVwMkNvbmZpcm1lZCh5ZXMpIHtcbiAgX3N0ZXAyQ29uZmlybWVkID0gISF5ZXM7XG59XG5cbmZ1bmN0aW9uIF9pc1N0ZXBEb25lKHN0ZXApIHtcbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBzd2l0Y2ggKHN0ZXApIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gb25OaGkgJiYgbG9nZ2VkSW47XG4gICAgY2FzZSAyOlxuICAgICAgLy8gQ29uZmlybWVkID0gdXNlciBjbGlja2VkIFx1MjcxMyBcdTc4QkFcdTVCOUEgQU5EIHRoZSBvdmVycmlkZSBpcyBjdXJyZW50bHlcbiAgICAgIC8vIHZhbGlkIChzbyByZXZpc2l0cyB3aXRoIGEgbm93LWludmFsaWQgb3ZlcnJpZGUgZG9uJ3Qgc2hvdyBhXG4gICAgICAvLyBmYWxzZSBncmVlbiBjaGVjaykuXG4gICAgICByZXR1cm4gX3N0ZXAyQ29uZmlybWVkO1xuICAgIGNhc2UgMzpcbiAgICAgIC8vIFN0ZXAgMyBpcyB0aGUgdGVybWluYWwgYWN0aW9uIHN0ZXA7IG5ldmVyIFwiZG9uZVwiIGZvciBwcm9ncmVzc1xuICAgICAgLy8gcHVycG9zZXMgKHRoZSBzdWNjZXNzIGJhbm5lciBpbnNpZGUgdGhlIHN0ZXAgaXMgdGhlIGluZGljYXRvcikuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfc2V0QWN0aXZlU3RlcChuLCBvcHRzID0ge30pIHtcbiAgY29uc3QgY2xhbXBlZCA9IE1hdGgubWF4KDEsIE1hdGgubWluKDMsIG4pKTtcbiAgX2FjdGl2ZVN0ZXAgPSBjbGFtcGVkO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuYWN0aXZlU3RlcCA9IFN0cmluZyhjbGFtcGVkKTtcbiAgX3JlZnJlc2hXaXphcmRVaSgpO1xuICBpZiAoIW9wdHMuc2lsZW50KSB7XG4gICAgLy8gQXV0by1zY3JvbGwgdGhlIHBvcHVwIHRvIHRoZSB0b3Agb2YgdGhlIHN0ZXAgc28gdXNlcnMgYWx3YXlzXG4gICAgLy8gc2VlIHRoZSBzdGVwIGhlYWRlciAvIGZpcnN0IGlucHV0IGFmdGVyIG5hdmlnYXRpb24uXG4gICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaFdpemFyZFVpKCkge1xuICBpZiAoIWVscy53aXphcmRTdGVwcGVyKSByZXR1cm47XG4gIGNvbnN0IGxpcyA9IGVscy53aXphcmRTdGVwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVtkYXRhLXN0ZXBdXCIpO1xuICBmb3IgKGNvbnN0IGxpIG9mIGxpcykge1xuICAgIGNvbnN0IG4gPSBOdW1iZXIobGkuZGF0YXNldC5zdGVwKTtcbiAgICBjb25zdCBpc0FjdGl2ZSA9IG4gPT09IF9hY3RpdmVTdGVwO1xuICAgIGNvbnN0IGlzRG9uZSA9IF9pc1N0ZXBEb25lKG4pO1xuICAgIGlmIChpc0FjdGl2ZSkgbGkuc2V0QXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIsIFwidHJ1ZVwiKTtcbiAgICBlbHNlIGxpLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiKTtcbiAgICBpZiAoaXNEb25lKSBsaS5kYXRhc2V0LmRvbmUgPSBcInRydWVcIjtcbiAgICBlbHNlIGRlbGV0ZSBsaS5kYXRhc2V0LmRvbmU7XG4gIH1cbiAgLy8gU3RlcCAxJ3MgdGhyZWUgc3ViLWNhcmRzIChvZmYtbmhpIC8gbmVlZHMtbG9naW4gLyBsb2dpbi1vaykgYXJlXG4gIC8vIG11dHVhbGx5IGV4Y2x1c2l2ZSBcdTIwMTQgcGljayB0aGUgb25lIHRoYXQgbWF0Y2hlcyBjdXJyZW50IHN0YXRlLlxuICBjb25zdCBvbk5oaSA9ICFlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgY29uc3QgbG9nZ2VkSW4gPSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluICE9PSBcIm5vXCI7XG4gIGlmIChlbHMub3Blbk5oaVNlY3Rpb24pXG4gICAgZWxzLm9wZW5OaGlTZWN0aW9uLmhpZGRlbiA9IG9uTmhpO1xuICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKVxuICAgIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSAhb25OaGkgfHwgbG9nZ2VkSW47XG4gIGlmIChlbHMubG9naW5Pa1NlY3Rpb24pXG4gICAgZWxzLmxvZ2luT2tTZWN0aW9uLmhpZGRlbiA9ICEob25OaGkgJiYgbG9nZ2VkSW4pO1xuXG4gIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xufVxuXG4vLyBTaG93L2hpZGUgc3RlcC0zIHJlc3VsdCBjYXJkcyBiYXNlZCBvbiB3aGV0aGVyIGVhY2ggaGFzIGNvbnRlbnQuXG4vLyBFbXB0eSBjYXJkcyAoZS5nLiBhIHN1bW1hcnkgY2FyZCB3aXRoIG5vIHN0YXR1cyArIG5vIGRhdGEtc3RhdGUgaW5cbi8vIGxvY2FsIG1vZGUgcHJlLXN5bmMpIHVzZWQgdG8gcmVuZGVyIGFzIGEgYmxhbmsgc3RyaXBlIFx1MjAxNCBub3cgdGhleVxuLy8gc3RheSBjb2xsYXBzZWQgaW5kaXZpZHVhbGx5LCBhbmQgdGhlIHdob2xlIHpvbmUgZ29lcyBhd2F5IHdoZW4gYWxsXG4vLyB0aHJlZSBjYXJkcyB3b3VsZCBiZSBlbXB0eS5cbmZ1bmN0aW9uIF9yZWZyZXNoUmVzdWx0Wm9uZSgpIHtcbiAgaWYgKCFlbHMucmVzdWx0Wm9uZSkgcmV0dXJuO1xuICBjb25zdCBoYXNTdGF0dXMgPSAoZWxzLnN0YXR1cz8udGV4dENvbnRlbnQgPz8gXCJcIikudHJpbSgpICE9PSBcIlwiO1xuICBjb25zdCBkYXRhU3RhdGVTaG93biA9XG4gICAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24gJiYgIWVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbjtcbiAgY29uc3QgYnVuZGxlU2hvd24gPVxuICAgIGVscy5wZW5kaW5nQnVuZGxlICYmICFlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW47XG4gIC8vIExhdW5jaCBidXR0b24gb25seSBjb3VudHMgd2hlbiB1c2FibGUgXHUyMDE0IGJhY2tlbmQgbW9kZSArIHRoZSBwYXRpZW50XG4gIC8vIGFjdHVhbGx5IGV4aXN0cyBvbiB0aGUgYmFja2VuZCAoYGxhdW5jaEJ0bi5kaXNhYmxlZCA9PT0gZmFsc2VgKS5cbiAgLy8gQSBwZXJtYS1kaXNhYmxlZCBidXR0b24gc2hvdWxkbid0IHBpbiB0aGUgem9uZSBvcGVuLlxuICBjb25zdCBsYXVuY2hVc2FibGUgPVxuICAgIGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIGVscy5sYXVuY2hCdG4gJiYgIWVscy5sYXVuY2hCdG4uZGlzYWJsZWQ7XG5cbiAgLy8gSGlkZSB0aGUgZW50aXJlIHJlc3VsdCBzZWN0aW9uICh0aGUgZGl2aWRlciArIGV2ZXJ5dGhpbmcgYWZ0ZXIpIHdoZW5cbiAgLy8gdGhlcmUncyBub3RoaW5nIG1lYW5pbmdmdWwgdG8gc2hvdy5cbiAgZWxzLnJlc3VsdFpvbmUuaGlkZGVuID0gIShoYXNTdGF0dXMgfHwgYnVuZGxlU2hvd24gfHwgZGF0YVN0YXRlU2hvd24gfHwgbGF1bmNoVXNhYmxlKTtcblxuICAvLyBCdW5kbGUgZmlsZW5hbWUgLyBzaXplIGJsb2NrIGZvbGxvd3MgYnVuZGxlIHZpc2liaWxpdHkuXG4gIGlmIChlbHMuYnVuZGxlTWV0YUJsb2NrKSB7XG4gICAgZWxzLmJ1bmRsZU1ldGFCbG9jay5oaWRkZW4gPSAhYnVuZGxlU2hvd247XG4gIH1cbiAgLy8gTGF1bmNoIGJ1dHRvbiBoaWRlLXdoZW4tbm90LXVzYWJsZSBzbyB0aGUgLm5leHQtYWN0aW9ucyByb3dcbiAgLy8gZG9lc24ndCBzaG93IGEgcGVybWEtZGlzYWJsZWQgb3V0bGluZSBidXR0b24gbmV4dCB0byBub3RoaW5nLlxuICBpZiAoZWxzLmxhdW5jaEJ0bikge1xuICAgIGVscy5sYXVuY2hCdG4uaGlkZGVuID0gY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIWxhdW5jaFVzYWJsZTtcbiAgfVxuXG4gIC8vIERlbW90ZSB0aGUgXHU1M0Q2XHU1Rjk3IENUQSBvbmNlIHdlIGhhdmUgYSByZXN1bHQgKyBhIHVzYWJsZSBuZXh0LXN0ZXBcbiAgLy8gYWN0aW9uLiBUaGUgXCJwcmltYXJ5IGFjdGlvblwiIGJhdG9uIHBhc3NlcyB0byBcdTRFMEJcdThGMDkgLyBcdTk1OEJcdTU1NUYgQXBwIHNvXG4gIC8vIHRoZSB1c2VyJ3MgZXllIGxhbmRzIG9uIHdoYXQncyBuZXh0LCBub3Qgb24gXCJyZWRvIHRoZSB0aGluZ1wiLlxuICBjb25zdCBoYXNSZXN1bHRBcnRpZmFjdCA9IGJ1bmRsZVNob3duIHx8IGxhdW5jaFVzYWJsZTtcbiAgaWYgKGVscy5zeW5jQXBpQnRuKSB7XG4gICAgY29uc3Qgc2hvdWxkRGVtb3RlID0gaGFzUmVzdWx0QXJ0aWZhY3QgJiYgIWVscy5zeW5jQXBpQnRuLmRpc2FibGVkO1xuICAgIGVscy5zeW5jQXBpQnRuLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1zZWNvbmRhcnlcIiwgc2hvdWxkRGVtb3RlKTtcbiAgICAvLyBSZWxhYmVsIHRvIG1hdGNoIHRoZSBuZXcgcm9sZS4gV2hpbGUgdGhlIHN5bmMgaXMgcnVubmluZyB3ZSBrZWVwXG4gICAgLy8gdGhlIHByb21wdCBtaWQtcmVuZGVyIHRleHQgYWxvbmUgKGFwcGx5U3luY1N0YXR1cyBvd25zIHRoYXQpLlxuICAgIGlmICghX2xhdGVzdFN0YXR1cz8ucnVubmluZykge1xuICAgICAgZWxzLnN5bmNBcGlCdG4udGV4dENvbnRlbnQgPSBzaG91bGREZW1vdGVcbiAgICAgICAgPyBcIlx1OTFDRFx1NjVCMFx1NTNENlx1NUY5N1wiXG4gICAgICAgIDogXCJcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcIjtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX21heWJlQXV0b0FkdmFuY2UoKSB7XG4gIC8vIE9ubHkgYWR2YW5jZSBmb3J3YXJkLCBuZXZlciBiYWNrLiBTYXZlIHVzZXIncyBwbGFjZSBpZiB0aGV5J3ZlXG4gIC8vIGNsaWNrZWQgaW50byBhIGxhdGVyIHN0ZXAgbWFudWFsbHkuXG4gIGlmIChfYWN0aXZlU3RlcCA9PT0gMSAmJiBfaXNTdGVwRG9uZSgxKSkgX3NldEFjdGl2ZVN0ZXAoMik7XG4gIGVsc2UgaWYgKF9hY3RpdmVTdGVwID09PSAyICYmIF9pc1N0ZXBEb25lKDIpKSBfc2V0QWN0aXZlU3RlcCgzKTtcbn1cblxuZnVuY3Rpb24gX2luaXRXaXphcmQoKSB7XG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIHJldHVybjtcbiAgX3dpemFyZEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgLy8gSW5pdGlhbCBzdGVwOiB3aGljaGV2ZXIgaXMgdGhlIEZJUlNUIG5vdC15ZXQtZG9uZSBzdGVwIGF0IHBvcHVwIG9wZW4uXG4gIC8vIEZpcnN0LXRpbWUgdXNlciBcdTIxOTIgc3RlcCAxLiBSZXR1cm5pbmcgdXNlciB3aXRoIHZhbGlkIHNlc3Npb24gKyBzYXZlZFxuICAvLyBwYXRpZW50IFx1MjE5MiBzdGVwIDMuXG4gIGNvbnN0IHN0YXJ0ID0gX2lzU3RlcERvbmUoMSkgPyAoX2lzU3RlcERvbmUoMikgPyAzIDogMikgOiAxO1xuICBfc2V0QWN0aXZlU3RlcChzdGFydCwgeyBzaWxlbnQ6IHRydWUgfSk7XG5cbiAgLy8gU3RlcHBlciBjbGlja3MgXHUyMTkyIGp1bXBcbiAgZm9yIChjb25zdCBsaSBvZiBlbHMud2l6YXJkU3RlcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwibGlbZGF0YS1zdGVwXVwiKSkge1xuICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBfc2V0QWN0aXZlU3RlcChOdW1iZXIobGkuZGF0YXNldC5zdGVwKSkpO1xuICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIiB8fCBlLmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBfc2V0QWN0aXZlU3RlcChOdW1iZXIobGkuZGF0YXNldC5zdGVwKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlZnJlc2hCdXR0b25TdGF0ZXMoKSB7XG4gIC8vIFN5bmMgYnV0dG9uLiBDb25kaXRpb25zLCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgLy8gICAxLiBvbiBhbiBOSEkgdGFiXG4gIC8vICAgMi4gbG9nZ2VkIGluIHRvIE5ISSAoZGV0ZWN0ZWQgdmlhIGJhY2tncm91bmQgcHJlLWZsaWdodClcbiAgLy8gICAzLiBiYWNrZW5kIG1vZGUgXHUyMTkyIGJhY2tlbmQgY29ubmVjdGVkXG4gIC8vICAgNC4gZ2VuZGVyIGZpbGxlZCAob3RoZXIgcGF0aWVudCBmaWVsZHMgYWxsIG9wdGlvbmFsKVxuICAvLyBXaGF0ZXZlciBibG9ja3MgdGhlIENUQSBhbHNvIGdldHMgc3VyZmFjZWQgYXMgYW4gaW5saW5lIG1lc3NhZ2VcbiAgLy8gYmVsb3cgdGhlIGJ1dHRvbiBcdTIwMTQgdG9vbHRpcHMgYXJlIGludmlzaWJsZSBpbiB0aGUgMzYwcHggcG9wdXAuXG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBsb2dnZWRJbiA9IGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW4gIT09IFwibm9cIjtcbiAgY29uc3QgbW9kZU9rID0gY3VycmVudE1vZGUoKSA9PT0gXCJsb2NhbFwiIHx8IF9jb25uU3RhdGUgPT09IFwib2tcIjtcbiAgY29uc3QgZ2VuZGVyT2sgPSAhIWVscy5vdkdlbmRlcj8udmFsdWU7XG4gIGNvbnN0IGRvYkVycm9yID0gdmFsaWRhdGVCaXJ0aERhdGUoKTtcblxuICAvLyBFYWNoIGJsb2NraW5nIHJlYXNvbiBuYW1lcyB0aGUgc3RlcCB0aGF0IG5lZWRzIGF0dGVudGlvbi4gTW9kZSArXG4gIC8vIGNvbm5lY3Rpb24gbm93IGxpdmUgaW4gc3RlcCAzIGFsb25nc2lkZSB0aGUgQ1RBIGl0c2VsZiwgc28gdGhvc2VcbiAgLy8gcmVhc29ucyByZWZlcmVuY2Ugd2hhdCdzIGRpcmVjdGx5IGFib3ZlIHRoZSBidXR0b24gcmF0aGVyIHRoYW5cbiAgLy8gc2VuZGluZyB0aGUgdXNlciBiYWNrIHRocm91Z2ggdGhlIHN0ZXBwZXIuXG4gIC8vXG4gIC8vIEVYQ0VQVCB0aGUgY29ubi1mYWlsZWQgY2FzZTogdGhlIGNvbm4gYmFubmVyIGRpcmVjdGx5IGFib3ZlIHRoZVxuICAvLyBDVEEgYWxyZWFkeSBzaG91dHMgXCJcdTI3MTcgXHU5MDIzXHU0RTBEXHU0RTBBXHU1RjhDXHU3QUVGXCIgKyByZXRyeSBidXR0b24gKyBoZWxwLiBBZGRpbmdcbiAgLy8gYW5vdGhlciBpbmxpbmUgc3RyaXAganVzdCB0byByZXBlYXQgdGhlIHNhbWUgZmFjdCAod2l0aCBhIHNsaWdodGx5XG4gIC8vIGxvbmdlciBzZW50ZW5jZSkgaXMgbm9pc2UgXHUyMDE0IHNpbGVudGx5IGRpc2FibGUgdGhlIENUQSBpbnN0ZWFkLCB3aXRoXG4gIC8vIGEgdG9vbHRpcCBleHBsYW5hdGlvbi4gaW5saW5lUmVhc29uIGlzIHdoYXQgc2hvd3MgaW4gdGhlIHdhcm5pbmdcbiAgLy8gc3RyaXA7IHRvb2x0aXBSZWFzb24gaXMgd2hhdCB0aGUgZGlzYWJsZWQgYnV0dG9uIGFkdmVydGlzZXMgb24gaG92ZXIuXG4gIGxldCBpbmxpbmVSZWFzb24gPSBcIlwiO1xuICBsZXQgdG9vbHRpcFJlYXNvbiA9IFwiXCI7XG4gIGlmICghb25OaGkpIHtcbiAgICBpbmxpbmVSZWFzb24gPSB0b29sdGlwUmVhc29uID0gXCJcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NVx1RkYxQVx1OEFDQlx1NTIwN1x1NTIzMFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NTIwNlx1OTgwMVwiO1xuICB9IGVsc2UgaWYgKCFsb2dnZWRJbikge1xuICAgIGlubGluZVJlYXNvbiA9IHRvb2x0aXBSZWFzb24gPSBcIlx1NTZERSBcdTI0NjAgXHU3NjdCXHU1MTY1XHVGRjFBXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU1MjA2XHU5ODAxXHU1QzFBXHU2NzJBXHU3NjdCXHU1MTY1XCI7XG4gIH0gZWxzZSBpZiAoIWdlbmRlck9rKSB7XG4gICAgaW5saW5lUmVhc29uID0gdG9vbHRpcFJlYXNvbiA9IFwiXHU1NkRFIFx1MjQ2MSBcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcdUZGMUFcdThBQ0JcdTkwNzhcdTY0QzdcdTYwMjdcdTUyMjVcdTRFMjZcdTYzMDlcdTc4QkFcdTVCOUFcIjtcbiAgfSBlbHNlIGlmIChkb2JFcnJvcikge1xuICAgIGlubGluZVJlYXNvbiA9IHRvb2x0aXBSZWFzb24gPSBgXHU1NkRFIFx1MjQ2MSBcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcdUZGMUEke2RvYkVycm9yfWA7XG4gIH0gZWxzZSBpZiAoIW1vZGVPaykge1xuICAgIGlubGluZVJlYXNvbiA9IFwiXCI7ICAgICAgICAgICAgICAvLyBjb25uIGJhbm5lciBhYm92ZSBjYXJyaWVzIHRoZSBtZXNzYWdlXG4gICAgdG9vbHRpcFJlYXNvbiA9IFwiXHU1RjhDXHU3QUVGXHU1QzFBXHU2NzJBXHU5MDIzXHU3RERBXCI7XG4gIH1cbiAgY29uc3QgcmVhc29uID0gdG9vbHRpcFJlYXNvbjtcblxuICAvLyBEb24ndCBmbGlwIHRoZSBDVEEgYmFjayB0byBlbmFibGVkIGlmIGEgc3luYyBpcyBjdXJyZW50bHkgcnVubmluZ1xuICAvLyBcdTIwMTQgdGhlIFNXIHVwZGF0ZXMgYHBhdGllbnRPdmVycmlkZWAgbWlkLXN5bmMgKGF1dG8tZmV0Y2hlZCBjaWQpLFxuICAvLyB3aGljaCB0cmlnZ2VycyBzdG9yYWdlLm9uQ2hhbmdlZCBcdTIxOTIgbG9hZFBhdGllbnRPdmVycmlkZSBcdTIxOTJcbiAgLy8gX3JlZnJlc2hCdXR0b25TdGF0ZXMuIFdpdGhvdXQgdGhpcyBndWFyZCB0aGUgYnV0dG9uIHdvdWxkIHJlLWVuYWJsZVxuICAvLyBoYWxmd2F5IHRocm91Z2ggYSBzeW5jIGFuZCB0aGUgdXNlciBjb3VsZCBjbGljayBpdCBhZ2Fpbi5cbiAgY29uc3Qgc3luY1J1bm5pbmcgPSBfbGF0ZXN0U3RhdHVzPy5ydW5uaW5nID09PSB0cnVlO1xuICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHN5bmNSdW5uaW5nIHx8IHRvb2x0aXBSZWFzb24gIT09IFwiXCI7XG4gIGVscy5zeW5jQXBpQnRuLnRpdGxlID0gc3luY1J1bm5pbmcgPyBcIlwiIDogdG9vbHRpcFJlYXNvbjtcbiAgaWYgKGVscy5zeW5jQmxvY2tlZFJlYXNvbikge1xuICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi50ZXh0Q29udGVudCA9ICFzeW5jUnVubmluZyAmJiBpbmxpbmVSZWFzb24gPyBgXHUyNkEwXHVGRTBGICR7aW5saW5lUmVhc29ufWAgOiBcIlwiO1xuICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi5oaWRkZW4gPSBzeW5jUnVubmluZyB8fCBpbmxpbmVSZWFzb24gPT09IFwiXCI7XG4gIH1cbiAgLy8gTWlycm9yIHRoZSBzdG9wLWJ1dHRvbiB2aXNpYmlsaXR5IHNvIHRoZSB1c2VyIGNhbiBhbHdheXMgY2FuY2VsXG4gIC8vIG1pZC1zeW5jIGV2ZW4gaWYgdGhlIHBvcHVwIHJlLXJlbmRlcnMgZHVlIHRvIG9uQ2hhbmdlZC5cbiAgaWYgKGVscy5zdG9wQnRuKSBlbHMuc3RvcEJ0bi5oaWRkZW4gPSAhc3luY1J1bm5pbmc7XG5cbiAgLy8gTGF1bmNoIGJ1dHRvbjogYmFja2VuZCBtb2RlICsgY29ubiBvayArIHBhdGllbnQgc2V0ICsgYmFja2VuZFxuICAvLyBhY3R1YWxseSBoYXMgdGhpcyBwYXRpZW50IChvdGhlcndpc2UgdGhlIFNNQVJUIGFwcCBsYXVuY2hlcyBpbnRvXG4gIC8vIGFuIGVtcHR5IEZISVIgc3RvcmUgXHUyMDE0IGNvbmZ1c2luZyBibGFuayBzY3JlZW4pLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBoYXZlQmFja2VuZFBhdGllbnQgPSBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiO1xuICBlbHMubGF1bmNoQnRuLmRpc2FibGVkID0gIShcbiAgICBjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJlxuICAgIF9jb25uU3RhdGUgPT09IFwib2tcIiAmJlxuICAgICEhb3Y/LmlkX25vICYmXG4gICAgaGF2ZUJhY2tlbmRQYXRpZW50XG4gICk7XG4gIGVscy5sYXVuY2hCdG4udGl0bGUgPVxuICAgIGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiICA/IFwiXHU4QUNCXHU1MjA3XHU1MjMwXHUzMDBDXHVEODNDXHVERkU1IFx1NjcyQ1x1NkE1Rlx1NUY4Q1x1N0FFRiAoXHU5MDMyXHU5NjhFKVx1MzAwRFx1NkEyMVx1NUYwRlwiIDpcbiAgICBfY29ublN0YXRlICE9PSBcIm9rXCIgICAgICAgICAgID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIiA6XG4gICAgIW92Py5pZF9ubyAgICAgICAgICAgICAgICAgICAgPyBcIlx1NTZERSBcdTI0NjEgXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XHVGRjFBXHU4QUNCXHU1ODZCXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCIgOlxuICAgICFoYXZlQmFja2VuZFBhdGllbnQgICAgICAgICAgID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTkgXHUyMDE0IFx1NTE0OFx1NjMwOVx1MzAwQ1x1RDgzRFx1REQwNCBcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTMwMERcdTYyMTZcdTRFMEJcdTY1QjlcdTMwMENcdUQ4M0RcdURDRTQgXHU2MjhBXHU2NzJDXHU1NzMwXHU2QTk0XHU2ODQ4XHU0RTBBXHU1MEIzXHU1MjMwXHU1RjhDXHU3QUVGXHUzMDBEXCIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIjtcblxuICAvLyBSZWZyZXNoIHRoZSBzdGVwcGVyIFVJIG9uIGV2ZXJ5IHN0YXRlIGNoYW5nZSwgYnV0IERPTidUIGF1dG8tXG4gIC8vIGFkdmFuY2UgZnJvbSBoZXJlIFx1MjAxNCBpbmNpZGVudGFsIGlucHV0IGNoYW5nZXMgKHR5cGluZyBpbiBhIGZpZWxkXG4gIC8vIHdoaWxlIHJldmlzaXRpbmcgc3RlcCAyKSBzaG91bGRuJ3QgeWFuayB0aGUgdXNlciBmb3J3YXJkLiBBdXRvLVxuICAvLyBhZHZhbmNlIGlzIG9ubHkgZmlyZWQgZnJvbSB0aGUgZXZlbnRzIHRoYXQgc2lnbmFsIGludGVudDpcbiAgLy8gICAtIGxvZ2luIHByb2JlIGZsaXBwaW5nIHRvIHRydWUgXHUyMTkyIGZvcndhcmQgaW50byBzdGVwIDJcbiAgLy8gICAtIHNhdmVQYXRpZW50T3ZlcnJpZGUgc3VjY2VzcyBcdTIxOTIgZm9yd2FyZCBpbnRvIHN0ZXAgM1xuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFdpemFyZFVpKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpIHtcbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpO1xuICBpZiAoIXVybCkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vLXVybFwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG4gIF9jb25uU3RhdGUgPSBcImNoZWNraW5nXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG5cbiAgY29uc3QgcGVybSA9IGF3YWl0IGVuc3VyZUJhY2tlbmRQZXJtaXNzaW9uKHVybCk7XG4gIGlmICghcGVybS5vaykge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vLXBlcm1pc3Npb25cIiB9O1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7IHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGN0cmwgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBjdHJsLmFib3J0KCksIDUwMDApO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3VybC5yZXBsYWNlKC9cXC8kLywgXCJcIil9L2ZoaXIvbWV0YWRhdGFgLCB7IHNpZ25hbDogY3RybC5zaWduYWwgfSk7XG4gICAgaWYgKCFyZXMub2spIHtcbiAgICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcImh0dHBcIiwgZGV0YWlsOiByZXMuc3RhdHVzIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXMuanNvbigpLmNhdGNoKCgpID0+IG51bGwpO1xuICAgICAgaWYgKGJvZHk/LnJlc291cmNlVHlwZSAhPT0gXCJDYXBhYmlsaXR5U3RhdGVtZW50XCIpIHtcbiAgICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm90LWZoaXJcIiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2Nvbm5TdGF0ZSA9IFwib2tcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7XG4gICAgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0XCIgOiBcIm5ldHdvcmtcIiB9O1xuICB9IGZpbmFsbHkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gIH1cblxuICBfcmVuZGVyQ29ubkJhbm5lcigpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBXaGVuZXZlciBjb25uZWN0aXZpdHkgZmxpcHMsIHJlLWNoZWNrIHdoZXRoZXIgdGhpcyBwYXRpZW50IGFscmVhZHlcbiAgLy8gZXhpc3RzIG9uIGJhY2tlbmQuIChTdGFsZSBcIl9iYWNrZW5kUGF0aWVudFwiIHN0YXRlIHdvdWxkIG90aGVyd2lzZVxuICAvLyBjYXVzZSBMYXVuY2ggdG8gbG9vayBlbmFibGVkIC8gZGlzYWJsZWQgd3JvbmdseS4pXG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICByZXR1cm4gX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xufVxuXG5lbHMuY29ublJldHJ5QnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGVzdEJhY2tlbmRDb25uZWN0aW9uKTtcblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgXHUyMTk0IGxvY2FsIGRhdGEtc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gSW5kZXBlbmRlbnQgb2YgdGhlIGNvbm5lY3Rpb24gYmFubmVyICh3aGljaCBvbmx5IHRlbGxzIHVzIFwiY2FuIHdlXG4vLyByZWFjaCB0aGUgYmFja2VuZFwiKS4gVGhpcyBjYXJkIGFuc3dlcnMgdHdvIHF1ZXN0aW9uczpcbi8vXG4vLyAgIDEuIERvZXMgdGhlIGJhY2tlbmQgYWxyZWFkeSBoYXZlIHRoaXMgcGF0aWVudCdzIGRhdGE/XG4vLyAgICAgIFx1MjE5MiBkcml2ZXMgd2hldGhlciBcdUQ4M0RcdURFODAgTGF1bmNoIGlzIGFsbG93ZWQgYXQgYWxsIChMYXVuY2ggb24gYW5cbi8vICAgICAgICBlbXB0eSBiYWNrZW5kIGdpdmVzIGEgY29uZnVzaW5nIFNNQVJULWFwcCBibGFuaykuXG4vLyAgIDIuIERvZXMgdGhlIHVzZXIgaGF2ZSBhIGxvY2FsIEJ1bmRsZSB0aGF0J3MgbmV3ZXIgdGhhbiB0aGVcbi8vICAgICAgYmFja2VuZCdzIHZpZXc/XG4vLyAgICAgIFx1MjE5MiBvZmZlciBcIlx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlIFx1NTIzMFx1NUY4Q1x1N0FFRlwiIHRvIHB1c2ggaXQgdmlhIC9maGlyL2ltcG9ydFxuLy8gICAgICAgIHdpdGhvdXQgcmUtZmV0Y2hpbmcgTkhJIChmYXN0LCBub24tZGVzdHJ1Y3RpdmU6IHN0YWJsZSBJRHNcbi8vICAgICAgICB1cHNlcnQgc28gYmFja2VuZCByZXNvdXJjZXMganVzdCBidW1wIHZlcnNpb25JZCkuXG4vL1xuLy8gV2UgZG9uJ3Qgc2Vjb25kLWd1ZXNzIHRoZSB1c2VyOiBldmVuIHdoZW4gbG9jYWwgaXMgY2xlYXJseSBuZXdlcixcbi8vIExhdW5jaCBzdGF5cyBlbmFibGVkIGlmIHRoZSBiYWNrZW5kIGhhcyB0aGUgcGF0aWVudCBcdTIwMTQgdGhleSBtYXlcbi8vIGdlbnVpbmVseSB3YW50IHRvIGxvb2sgYXQgdGhlIG9sZGVyIHN0YXRlLiBUaGUgVUkgbGF5cyBvdXQgYm90aFxuLy8gc2lkZXM7IHVzZXIgZGVjaWRlcy5cblxubGV0IF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbi8vICAgc3RhdGU6IFwidW5rbm93blwiIHwgXCJjaGVja2luZ1wiIHwgXCJhYnNlbnRcIiB8IFwicHJlc2VudFwiIHwgXCJmYWlsXCJcbmxldCBfbG9jYWxCdW5kbGUgPSB7IGV4aXN0czogZmFsc2UsIGNvdW50OiAwLCBnZW5lcmF0ZWRBdDogMCwgcGF0aWVudElkOiBudWxsIH07XG5cbmZ1bmN0aW9uIF9mbXRUaW1lU2hvcnQoaXNvKSB7XG4gIGlmICghaXNvKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XG4gIGlmIChOdW1iZXIuaXNOYU4oZC5nZXRUaW1lKCkpKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gIHJldHVybiBgJHtkLmdldE1vbnRoKCkgKyAxfS8ke2QuZ2V0RGF0ZSgpfSAke3BhZChkLmdldEhvdXJzKCkpfToke3BhZChkLmdldE1pbnV0ZXMoKSl9YDtcbn1cblxuZnVuY3Rpb24gX2ZtdFJlbGF0aXZlKG1zKSB7XG4gIGNvbnN0IGRpZmYgPSBEYXRlLm5vdygpIC0gbXM7XG4gIGlmIChkaWZmIDwgNjBfMDAwKSByZXR1cm4gYCR7TWF0aC5tYXgoMSwgTWF0aC5yb3VuZChkaWZmIC8gMTAwMCkpfSBcdTc5RDJcdTUyNERgO1xuICBpZiAoZGlmZiA8IDM2MDBfMDAwKSByZXR1cm4gYCR7TWF0aC5yb3VuZChkaWZmIC8gNjBfMDAwKX0gXHU1MjA2XHU5NDE4XHU1MjREYDtcbiAgaWYgKGRpZmYgPCA4Nl80MDBfMDAwKSByZXR1cm4gYCR7TWF0aC5yb3VuZChkaWZmIC8gMzYwMF8wMDApfSBcdTVDMEZcdTY2NDJcdTUyNERgO1xuICByZXR1cm4gX2ZtdFRpbWVTaG9ydChuZXcgRGF0ZShtcykudG9JU09TdHJpbmcoKSk7XG59XG5cbmZ1bmN0aW9uIF9yZW5kZXJEYXRhU3RhdGUoKSB7XG4gIC8vIFNlY3Rpb24gb25seSB2aXNpYmxlIGluIGJhY2tlbmQgbW9kZSAoaGFuZGxlZCBieSAuYmFja2VuZC1vbmx5IENTUyksXG4gIC8vIGJ1dCB3ZSBhbHNvIGV4cGxpY2l0bHkgaGlkZSB3aGVuIHRoZSBwb3B1cCBoYXMgbm8gcGF0aWVudF9vdmVycmlkZVxuICAvLyBzZXQsIHNpbmNlIGJvdGggY2hlY2tzIGtleSBvZmYgcGF0aWVudF9pZC5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiIHx8ICFvdj8uaWRfbm8pIHtcbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChlbHMuc3luY1N0YXR1c0hpbnQpIGVscy5zeW5jU3RhdHVzSGludC5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENhcmQgc2VydmVzIGFzIGFuIGFsZXJ0LCBub3QgYSBkYXNoYm9hcmQgXHUyMDE0IHNob3cgb25seSB3aGVuIHRoZXJlJ3NcbiAgLy8gc29tZXRoaW5nIGFjdGlvbmFibGUgLyB3b3J0aCBmbGFnZ2luZy4gSGlkZSB3aGVuOlxuICAvLyAgIC0gYmFja2VuZCBoYXMgdGhpcyBwYXRpZW50IEFORCBubyBsb2NhbCBidW5kbGUgdG8gY29tcGFyZSBhZ2FpbnN0XG4gIC8vICAgICAoTGF1bmNoIGlzIGVuYWJsZWQgXHUyMTkyIHRoYXQncyB0aGUgc2lnbmFsIGV2ZXJ5dGhpbmcncyBmaW5lKSwgb3JcbiAgLy8gICAtIGJvdGggc2lkZXMgYWdyZWUgb24gY291bnQgKGFscmVhZHkgaW4gc3luYywgbm8gdXBsb2FkIG5lZWRlZCkuXG4gIC8vIFRoZSByZW1haW5pbmcgc3RhdGVzIChjaGVja2luZyAvIGZhaWwgLyBhYnNlbnQgLyBjb3VudCBtaXNtYXRjaCkgYWxsXG4gIC8vIGVpdGhlciBuZWVkIHVzZXIgYXR0ZW50aW9uIG9yIGFyZSB0cmFuc2llbnQgbG9hZGluZyBmZWVkYmFjay5cbiAgY29uc3QgbG9jYWxNYXRjaGVzID0gX2xvY2FsQnVuZGxlLmV4aXN0cyAmJiBfbG9jYWxCdW5kbGUucGF0aWVudElkID09PSBvdi5pZF9ubztcbiAgY29uc3QgaW5TeW5jID1cbiAgICBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiICYmXG4gICAgbG9jYWxNYXRjaGVzICYmXG4gICAgX2JhY2tlbmRQYXRpZW50LmNvdW50ID09PSBfbG9jYWxCdW5kbGUuY291bnQ7XG4gIC8vIFF1aWV0IFwiXHUyNzEzIFx1NURGMlx1NTQwQ1x1NkI2NVwiIGhpbnQgc2l0cyB1bmRlciB0aGUgZG93bmxvYWQgYnV0dG9uIHdoZW4gaW4tc3luYyBcdTIwMTRcbiAgLy8gZ2l2ZXMgdGhlIHVzZXIgYSB0aW55IGFja25vd2xlZGdlbWVudCBpbnN0ZWFkIG9mIHRvdGFsIHNpbGVuY2UuXG4gIGlmIChlbHMuc3luY1N0YXR1c0hpbnQpIGVscy5zeW5jU3RhdHVzSGludC5oaWRkZW4gPSAhaW5TeW5jO1xuICBjb25zdCBub3RoaW5nVG9TaG93ID1cbiAgICBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiICYmICghbG9jYWxNYXRjaGVzIHx8IGluU3luYyk7XG4gIGlmIChub3RoaW5nVG9TaG93KSB7XG4gICAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gZmFsc2U7XG5cbiAgLy8gQmFja2VuZCByb3dcbiAgY29uc3QgYnMgPSBlbHMuYmFja2VuZFN0YXRlO1xuICBzd2l0Y2ggKF9iYWNrZW5kUGF0aWVudC5zdGF0ZSkge1xuICAgIGNhc2UgXCJjaGVja2luZ1wiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1NkFBMlx1NjdFNVx1NEUyRFx1MjAyNlwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImFic2VudFwiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZSBlbXB0eVwiO1xuICAgICAgLy8gQ2FyZCBzaXRzIGluc2lkZSB0aGUgcmVzdWx0IHpvbmUgbmV4dCB0byB0aGUgXHVEODNEXHVERDA0IFx1NTNENlx1NUY5NyBDVEEgYW5kXG4gICAgICAvLyB0aGUgXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCMyBidXR0b24gXHUyMDE0IHBvaW50aW5nIGF0IHRoZW0gd2l0aCB0ZXh0IHdvdWxkIGJlXG4gICAgICAvLyBkb3VibGUtdGFsay4gSnVzdCBzdGF0ZSB0aGUgZmFjdC5cbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTI2QTAgXHU1QzFBXHU3MTIxXHU2QjY0XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicHJlc2VudFwiOiB7XG4gICAgICBjb25zdCBjb3VudCA9IF9iYWNrZW5kUGF0aWVudC5jb3VudDtcbiAgICAgIGNvbnN0IHRzID0gX2JhY2tlbmRQYXRpZW50Lmxhc3RVcGRhdGVkO1xuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZSBva1wiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBgXHUyNzEzICR7Y291bnQgPiAwID8gYCR7Y291bnR9IFx1N0I0NiBcdTAwQjcgYCA6IFwiXCJ9XHU2NzAwXHU1RjhDXHU2NkY0XHU2NUIwICR7X2ZtdFRpbWVTaG9ydCh0cykgfHwgXCIodW5rbm93bilcIn1gO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJmYWlsXCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIGZhaWxcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTI3MTcgXHU2QUEyXHU2N0U1XHU1OTMxXHU2NTU3XHVGRjA4XHU3NzBCXHU5MDIzXHU3RERBIGJhbm5lclx1RkYwOVwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWVcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTIwMTRcIjtcbiAgfVxuXG4gIC8vIExvY2FsIHJvdyBcdTIwMTQgc2hvdyBvbmx5IHdoZW4gdGhlIHBlbmRpbmcgYnVuZGxlIG1hdGNoZXMgdGhpcyBwYXRpZW50LlxuICAvLyAobG9jYWxNYXRjaGVzIHdhcyBjb21wdXRlZCBhYm92ZSBmb3IgdGhlIGVhcmx5LXJldHVybiBjaGVjay4pXG4gIGlmIChsb2NhbE1hdGNoZXMpIHtcbiAgICBlbHMubG9jYWxTdGF0ZVJvdy5oaWRkZW4gPSBmYWxzZTtcbiAgICBlbHMubG9jYWxTdGF0ZS5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIG9rXCI7XG4gICAgZWxzLmxvY2FsU3RhdGUudGV4dENvbnRlbnQgPVxuICAgICAgYFx1MjcxMyAke19sb2NhbEJ1bmRsZS5jb3VudH0gXHU3QjQ2IFx1MDBCNyAke19mbXRSZWxhdGl2ZShfbG9jYWxCdW5kbGUuZ2VuZXJhdGVkQXQpfVx1NzUyMlx1NzUxRmA7XG4gIH0gZWxzZSB7XG4gICAgZWxzLmxvY2FsU3RhdGVSb3cuaGlkZGVuID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFwiXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGVcIiBidXR0b24gc2hvd3Mgb25seSB3aGVuIHRoZXJlJ3MgYSBsb2NhbCBidW5kbGVcbiAgLy8gZm9yIHRoaXMgcGF0aWVudC4gV2UgZG9uJ3QgcmVhY2ggdGhpcyBicmFuY2ggd2hlbiBpbi1zeW5jICh0aGVcbiAgLy8gd2hvbGUgc2VjdGlvbiBnZXRzIGhpZGRlbiBhYm92ZSksIHNvIG5vIG5lZWQgZm9yIGEgc2VwYXJhdGVcbiAgLy8gZGlzYWJsZWQgc3RhdGUgXHUyMDE0IHdoZW4gdGhlIGJ1dHRvbiBzaG93cywgdXBsb2FkIGlzIGFsd2F5cyBtZWFuaW5nZnVsLlxuICBlbHMucHVzaExvY2FsQnRuLmhpZGRlbiA9ICFsb2NhbE1hdGNoZXM7XG4gIGVscy5wdXNoTG9jYWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50aXRsZSA9IFwiXCI7XG4gIGVscy5wdXNoTG9jYWxCdG4udGV4dENvbnRlbnQgPSBcIlx1RDgzRFx1RENFNCBcdTYyOEFcdTY3MkNcdTU3MzBcdTZBOTRcdTY4NDhcdTRFMEFcdTUwQjNcdTUyMzBcdTVGOENcdTdBRUZcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBfbG9jYWxCdW5kbGUgPSBwZW5kaW5nXG4gICAgPyB7XG4gICAgICAgIGV4aXN0czogdHJ1ZSxcbiAgICAgICAgY291bnQ6IEFycmF5LmlzQXJyYXkoSlNPTi5wYXJzZShwZW5kaW5nLmpzb24pPy5lbnRyeSlcbiAgICAgICAgICA/IEpTT04ucGFyc2UocGVuZGluZy5qc29uKS5lbnRyeS5sZW5ndGhcbiAgICAgICAgICA6IDAsXG4gICAgICAgIGdlbmVyYXRlZEF0OiBwZW5kaW5nLmdlbmVyYXRlZEF0IHx8IDAsXG4gICAgICAgIHBhdGllbnRJZDogcGVuZGluZy5wYXRpZW50SWQgfHwgbnVsbCxcbiAgICAgIH1cbiAgICA6IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGVja0JhY2tlbmRQYXRpZW50KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubyB8fCBfY29ublN0YXRlICE9PSBcIm9rXCIpIHtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiY2hlY2tpbmdcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcblxuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICBjb25zdCBrZXkgPSBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGhlYWRlcnMgPSBrZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjoga2V5IH0gOiB7fTtcbiAgLy8gQmFja2VuZCBzdG9yZXMgUGF0aWVudCB1bmRlciB0aGUgaGFzaGVkIEZISVIgaWQsIG5ldmVyIHVuZGVyIHRoZSByYXdcbiAgLy8gbmF0aW9uYWwgSUQgXHUyMDE0IHF1ZXJ5IC8gZXhwb3J0IGJ5IHRoZSBoYXNoZWQgZm9ybS5cbiAgY29uc3QgZmhpclBpZCA9IGRlcml2ZVBhdGllbnRJZChvdi5pZF9ubyk7XG4gIHRyeSB7XG4gICAgY29uc3QgcHIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvUGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLCB7IGhlYWRlcnMgfSk7XG4gICAgaWYgKHByLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImFic2VudFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFwci5vaykge1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJmYWlsXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwYXRpZW50ID0gYXdhaXQgcHIuanNvbigpO1xuICAgIGNvbnN0IGxhc3RVcGRhdGVkID0gcGF0aWVudD8ubWV0YT8ubGFzdFVwZGF0ZWQgPz8gbnVsbDtcbiAgICAvLyBDb3VudCB2aWEgL2ZoaXIvZXhwb3J0IFx1MjAxNCBzbGlnaHRseSBoZWF2aWVyIGJ1dCBpdCdzIHRoZSBvbmx5XG4gICAgLy8gb2ZmLXRoZS1zaGVsZiB3YXkgdG8gZ2V0IHRvdGFsIHJlc291cmNlcyBmb3IgYSBwYXRpZW50LiBDYXAgYnlcbiAgICAvLyA1cyB0aW1lb3V0IHNvIGEgc2xvdyBiYWNrZW5kIGRvZXNuJ3QgbG9jayB0aGUgcG9wdXAgZm9yZXZlci5cbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjdHJsID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gICAgICBjb25zdCBlciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLCB7XG4gICAgICAgIGhlYWRlcnMsIHNpZ25hbDogY3RybC5zaWduYWwsXG4gICAgICB9KTtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICBpZiAoZXIub2spIHtcbiAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgZXIuanNvbigpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShidW5kbGUuZW50cnkpKSBjb3VudCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIGxlYXZlIGNvdW50ID0gMDsgbm90IGZhdGFsICovIH1cbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInByZXNlbnRcIiwgY291bnQsIGxhc3RVcGRhdGVkIH07XG4gIH0gY2F0Y2ggKF9lKSB7XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJmYWlsXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICB9XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHVzaExvY2FsQnVuZGxlVG9CYWNrZW5kKCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoIW92Py5pZF9ubyB8fCAhX2xvY2FsQnVuZGxlLmV4aXN0cyB8fCBfbG9jYWxCdW5kbGUucGF0aWVudElkICE9PSBvdi5pZF9ubykgcmV0dXJuO1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICBjb25zdCBrZXkgPSBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgLi4uKGtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBrZXkgfSA6IHt9KSxcbiAgfTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIGVscy5wdXNoTG9jYWxCdG4udGV4dENvbnRlbnQgPSBcIlx1NEUwQVx1NTBCM1x1NEUyRFx1MjAyNlwiO1xuICB0cnkge1xuICAgIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgICBpZiAoIXBlbmRpbmc/Lmpzb24pIHRocm93IG5ldyBFcnJvcihcIm5vIGxvY2FsIGJ1bmRsZVwiKTtcbiAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7dXJsfS9maGlyL2ltcG9ydGAsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsIGhlYWRlcnMsIGJvZHk6IHBlbmRpbmcuanNvbixcbiAgICB9KTtcbiAgICBpZiAoIXIub2spIHtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByLnRleHQoKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Iuc3RhdHVzfTogJHt0ZXh0LnNsaWNlKDAsIDEyMCl9YCk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHIuanNvbigpO1xuICAgIHNldFN0YXR1cyhgXHUyNzA1IFx1NURGMlx1NEUwQVx1NTBCMyAke3Jlc3VsdC5pbXBvcnRlZCA/PyBcIj9cIn0gXHU3QjQ2XHU1MjMwXHU1RjhDXHU3QUVGYCwgXCJzdWNjZXNzXCIpO1xuICAgIGF3YWl0IGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNldFN0YXR1cyhgXHUyNkQ0IFx1NEUwQVx1NTBCM1x1NTkzMVx1NjU1N1x1RkYxQSR7ZS5tZXNzYWdlfWAsIFwiZXJyb3JcIik7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gX3JlbmRlckRhdGFTdGF0ZSgpIChhbHJlYWR5IGNhbGxlZCBmcm9tIGNoZWNrQmFja2VuZFBhdGllbnQgb25cbiAgICAvLyBzdWNjZXNzKSBkZWNpZGVzIHRoZSByaWdodCBkaXNhYmxlZCBzdGF0ZSArIGxhYmVsIGJhc2VkIG9uXG4gICAgLy8gd2hldGhlciBiYWNrZW5kIGFuZCBsb2NhbCBhZ3JlZS4gQ2FsbCBpdCBoZXJlIHRvbyB0byBjb3ZlciB0aGVcbiAgICAvLyBmYWlsdXJlIHBhdGggdGhhdCBza2lwcGVkIGNoZWNrQmFja2VuZFBhdGllbnQuXG4gICAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICB9XG59XG5cbmVscy5wdXNoTG9jYWxCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdXNoTG9jYWxCdW5kbGVUb0JhY2tlbmQpO1xuXG4vLyBcIlx1RDgzRFx1REQxNyBcdTk1OEJcdTU1NUZcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTc2N0JcdTUxNjVcIiBcdTIwMTQgb3BlbnMgdGhlIE5ISSBsYW5kaW5nIHBhZ2Ugc28gdGhlIHVzZXJcbi8vIGRvZXNuJ3QgaGF2ZSB0byByZW1lbWJlciAvIGdvb2dsZSB0aGUgVVJMLiBDbG9zZXMgdGhlIHBvcHVwIHNvXG4vLyB0aGV5IGRvbid0IGhhdmUgdG8gZGlzbWlzcyBpdCBtYW51YWxseSBhZnRlciB0aGUgbmV3IHRhYiBvcGVucy5cbmVscy5vcGVuTmhpQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICBhd2FpdCBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IE5ISV9MQU5ESU5HIH0pO1xuICB3aW5kb3cuY2xvc2UoKTtcbn0pO1xuXG4vLyBMb2NhbCBidW5kbGUgc3RhdGUgY2hhbmdlcyB3aGVuZXZlciB0aGUgU1cgc3Rhc2hlcyBhIG5ldyBzeW5jLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgUEVORElOR19CVU5ETEVfS0VZIGluIGNoYW5nZXMpIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBTeW5jIG1vZGUgKGxvY2FsIHwgYmFja2VuZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5hc3luYyBmdW5jdGlvbiBsb2FkU3luY01vZGUoKSB7XG4gIGNvbnN0IHsgc3luY01vZGUgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInN5bmNNb2RlXCIpO1xuICBjb25zdCBtb2RlID0gc3luY01vZGUgPT09IFwiYmFja2VuZFwiID8gXCJiYWNrZW5kXCIgOiBERUZBVUxUX01PREU7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSByLmNoZWNrZWQgPSByLnZhbHVlID09PSBtb2RlO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gIGlmIChtb2RlID09PSBcImJhY2tlbmRcIikge1xuICAgIC8vIEF1dG8tdGVzdCBvbiBvcGVuIHNvIHRoZSB1c2VyIHNlZXMgc3RhdHVzIHdpdGhvdXQgY2xpY2tpbmcuIEF3YWl0aW5nXG4gICAgLy8gaGVyZSBzZXJpYWxpemVzIHRoZSByZXN0IG9mIGluaXQoKSB1bnRpbCB3ZSBrbm93IHRoZSBhbnN3ZXIuXG4gICAgYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3VycmVudE1vZGUoKSB7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSBpZiAoci5jaGVja2VkKSByZXR1cm4gci52YWx1ZTtcbiAgcmV0dXJuIERFRkFVTFRfTU9ERTtcbn1cblxuZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHtcbiAgci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RlID0gY3VycmVudE1vZGUoKTtcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY01vZGU6IG1vZGUgfSk7XG4gICAgaWYgKG1vZGUgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgICB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTsgLy8gdHJpZ2dlcnMgY2hlY2tCYWNrZW5kUGF0aWVudCBvbiBzdWNjZXNzXG4gICAgfSBlbHNlIHtcbiAgICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5lbHMuYmFja2VuZFVybC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgYmFja2VuZFVybDogZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpIH0pO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xufSk7XG5lbHMuc3luY0FwaUtleS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpIH0pO1xufSk7XG4vLyBTaWRlYmFyIFwiXHVEODNEXHVEQ0NCIFx1NTJBOVx1NzQwNlwiIHRvZ2dsZSBcdTIwMTQgcGVyc2lzdHMgaW4gY2hyb21lLnN0b3JhZ2UubG9jYWwgc28gdGhlXG4vLyBwcmVmZXJlbmNlIGlzIHN0aWNreSBhY3Jvc3MgcmVpbnN0YWxscy4gc2lkZWJhci5qcyBsaXN0ZW5zIHRvIHRoZVxuLy8gc2FtZSBrZXkgYW5kIGhpZGVzIGl0c2VsZiB3aGVuIHNldCB0byBmYWxzZS5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRTaWRlYmFyRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBzaWRlYmFyRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic2lkZWJhckVuYWJsZWRcIik7XG4gIGVscy5zaWRlYmFyRW5hYmxlZC5jaGVja2VkID0gc2lkZWJhckVuYWJsZWQgIT09IGZhbHNlOyAvLyBkZWZhdWx0IE9OXG59XG5cbmVscy5zaWRlYmFyRW5hYmxlZD8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNpZGViYXJFbmFibGVkOiBlbHMuc2lkZWJhckVuYWJsZWQuY2hlY2tlZCB9KTtcbn0pO1xuXG4vLyBNYXNrLXBhdGllbnQtbmFtZSB0b2dnbGUgXHUyMDE0IGRlZmF1bHRzIE9GRiAoY2l0aXplbnMgZG93bmxvYWRpbmcgdGhlaXJcbi8vIG93biBkYXRhIGRvbid0IG5lZWQgYW5vbnltaXphdGlvbikuIFdoZW4gT046IHBvcHVwIHN1bW1hcnksIEZISVJcbi8vIEJ1bmRsZSBvdXRwdXQsIHN5bmMtbG9nLCBhbmQgTkhJIHJlcG9ydCBuYXJyYXRpdmUgYWxsIHVzZSB0aGVcbi8vIG1hc2tlZCBmb3JtIChcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjApIGluc3RlYWQgb2YgdGhlIHJlYWwgbmFtZS5cbmxldCBfbWFza05hbWVFbmFibGVkID0gZmFsc2U7XG5hc3luYyBmdW5jdGlvbiBsb2FkTWFza05hbWVFbmFibGVkKCkge1xuICBjb25zdCB7IG1hc2tOYW1lRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwibWFza05hbWVFbmFibGVkXCIpO1xuICBfbWFza05hbWVFbmFibGVkID0gbWFza05hbWVFbmFibGVkID09PSB0cnVlO1xuICBpZiAoZWxzLm1hc2tOYW1lRW5hYmxlZCkgZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkID0gX21hc2tOYW1lRW5hYmxlZDtcbn1cblxuZnVuY3Rpb24gX21heWJlTWFzayhuYW1lKSB7XG4gIHJldHVybiBfbWFza05hbWVFbmFibGVkID8gbWFza05hbWUobmFtZSkgOiBuYW1lIHx8IFwiXCI7XG59XG5cbmVscy5tYXNrTmFtZUVuYWJsZWQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICBfbWFza05hbWVFbmFibGVkID0gZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBtYXNrTmFtZUVuYWJsZWQ6IF9tYXNrTmFtZUVuYWJsZWQgfSk7XG4gIC8vIFJlLXJlbmRlciBwb3B1cCBjaHJvbWUgKHN1bW1hcnkgbGluZSBpcyB0aGUgb25seSBzcG90IHRoYXQgcmVhZHNcbiAgLy8gX21heWJlTWFzayByZWFjdGl2ZWx5OyBldmVyeXdoZXJlIGVsc2Ugc2FtcGxlcyBpdCBqdXN0LWluLXRpbWUpLlxuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG59KTtcblxuZWxzLnNtYXJ0QXBwVXJsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAvLyBQZXJzaXN0IHRyaW1tZWQgdmFsdWUuIEVtcHR5IHN0cmluZyBcdTIxOTIgcmVzdG9yZSBkZWZhdWx0IG9uIG5leHQgbG9hZC5cbiAgY29uc3QgdiA9IGVscy5zbWFydEFwcFVybC52YWx1ZS50cmltKCk7XG4gIGlmICh2KSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc21hcnRBcHBMYXVuY2hVcmw6IHYgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwic21hcnRBcHBMYXVuY2hVcmxcIik7XG4gICAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICB9XG59KTtcblxuZnVuY3Rpb24gc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93bikge1xuICAvLyBCdWlsZCB3aXRoIERPTSBBUEkgXHUyMDE0IGF2b2lkcyBpbm5lckhUTUwgLyBYU1Mgcmlzay5cbiAgLy8gYnJlYWtkb3duIGlzIGFuIGFycmF5IG9mIG1peGVkIGVudHJpZXM6XG4gIC8vICAgLSBwaGFzZSB0aW1pbmdzIHByZWZpeGVkIHdpdGggXCJcdTIzRjFcIiAgXHUyMTkyIFx1OTY4RVx1NkJCNVx1ODAxN1x1NjY0MlxuICAvLyAgIC0gcGVyLWVuZHBvaW50IGNvdW50cyAgICAgICAgICAgICAgICBcdTIxOTIgXHU1NDA0IGVuZHBvaW50IFx1NjI5M1x1NTIzMFx1NUU3RVx1N0I0NlxuICAvLyBCb3RoIGtpbmRzIGFyZSB0dWNrZWQgaW5zaWRlIGEgc2luZ2xlIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgdG9nZ2xlIHNvIHRoZVxuICAvLyBwb3B1cCBzdGF5cyBjb21wYWN0IGJ5IGRlZmF1bHQuXG4gIGVscy5zdGF0dXMuY2xhc3NOYW1lID0ga2luZCB8fCBcIlwiO1xuICBlbHMuc3RhdHVzLnRleHRDb250ZW50ID0gXCJcIjtcbiAgaWYgKCF0ZXh0ICYmICEoYnJlYWtkb3duICYmIGJyZWFrZG93bi5sZW5ndGgpKSByZXR1cm47XG4gIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCB8fCBcIlwiKSk7XG4gIGlmIChicmVha2Rvd24gJiYgYnJlYWtkb3duLmxlbmd0aCkge1xuICAgIGNvbnN0IHBoYXNlUm93cyA9IGJyZWFrZG93bi5maWx0ZXIoKGIpID0+IGIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG4gICAgY29uc3Qgb3RoZXJSb3dzID0gYnJlYWtkb3duLmZpbHRlcigoYikgPT4gIWIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgZGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWxcIjtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgc3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCI7XG4gICAgZGV0YWlscy5hcHBlbmRDaGlsZChzdW1tYXJ5KTtcblxuICAgIGlmIChvdGhlclJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGJvZHkuY2xhc3NOYW1lID0gXCJzdGF0dXMtYnJlYWtkb3duXCI7XG4gICAgICAvLyBPbmUgaXRlbSBwZXIgbGluZSBzbyBcIlx1NUMzMVx1OTFBQiAxMiBcdTdCNDYgLyBcdTg2NTVcdTY1QjkgODggXHU3QjQ2IC8gXHU2QUEyXHU5QTU3IDQxMiBcdTdCNDZcIlxuICAgICAgLy8gaXMgcmVhZGFibGU7IHRoZSAzNjBweCBwb3B1cCB3b3VsZCBoYXZlIHdyYXBwZWQgYSBmbGF0XG4gICAgICAvLyBzZXBhcmF0b3Itam9pbmVkIHN0cmluZyBpbnRvIGEgdGFuZ2xlZCBtZXNzLlxuICAgICAgZm9yIChjb25zdCByb3cgb2Ygb3RoZXJSb3dzKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsaW5lLnRleHRDb250ZW50ID0gcm93O1xuICAgICAgICBib2R5LmFwcGVuZENoaWxkKGxpbmUpO1xuICAgICAgfVxuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZChib2R5KTtcbiAgICB9XG4gICAgaWYgKHBoYXNlUm93cy5sZW5ndGgpIHtcbiAgICAgIC8vIFBoYXNlIHRpbWluZ3MgYXJlIGRldiBpbmZvIFx1MjAxNCB0dWNrIHRoZW0gaW5zaWRlIGEgc2Vjb25kIHRvZ2dsZVxuICAgICAgLy8gc28gZW5kIHVzZXJzIGRvbid0IHNlZSBcIm5oaS1wYXJhbGxlbD04c1wiIHJpZ2h0IGFmdGVyIGEgc3VjY2Vzc1xuICAgICAgLy8gYmFubmVyIGFuZCB0aGluayBzb21ldGhpbmcncyB3cm9uZy5cbiAgICAgIGNvbnN0IHRlY2hEZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgICB0ZWNoRGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWwgc3RhdHVzLXRlY2hcIjtcbiAgICAgIGNvbnN0IHRlY2hTdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgICB0ZWNoU3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2MjgwXHU4ODUzXHU3RDMwXHU3QkMwXCI7XG4gICAgICB0ZWNoRGV0YWlscy5hcHBlbmRDaGlsZCh0ZWNoU3VtbWFyeSk7XG4gICAgICBjb25zdCBwaGFzZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgcGhhc2VzLmNsYXNzTmFtZSA9IFwic3RhdHVzLXBoYXNlc1wiO1xuICAgICAgcGhhc2VzLnRleHRDb250ZW50ID0gcGhhc2VSb3dzLm1hcCgocCkgPT4gcC5yZXBsYWNlKC9eXHUyM0YxXFxzKi8sIFwiXCIpKS5qb2luKFwiIFx1MDBCNyBcIik7XG4gICAgICB0ZWNoRGV0YWlscy5hcHBlbmRDaGlsZChwaGFzZXMpO1xuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZCh0ZWNoRGV0YWlscyk7XG4gICAgfVxuICAgIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG4gIH1cbiAgLy8gU3RhdHVzIHZpc2liaWxpdHkgZHJpdmVzIHdoZXRoZXIgdGhlIHJlc3VsdCB6b25lIHNob3dzIGF0IGFsbC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFjdGl2ZVRhYigpIHtcbiAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KTtcbiAgcmV0dXJuIHRhYjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBlbmRpbmcgRkhJUiBCdW5kbGUgKGxvY2FsLW1vZGUgcmVzdWx0KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBCYWNrZ3JvdW5kIHN0YXNoZXMgdGhlIGdlbmVyYXRlZCBCdW5kbGUgaW50byBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gdW5kZXIgYHBlbmRpbmdGaGlyQnVuZGxlYC4gUG9wdXAgcmVuZGVycyBhIGRvd25sb2FkIGJ1dHRvbi4gVXNlciBtdXN0XG4vLyBjbGljayB0byBhY3R1YWxseSB0cmlnZ2VyIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgXHUyMDE0IHRoZSBmaWxlIG5ldmVyXG4vLyBoaXRzIHRoZSBkaXNrIHVuc29saWNpdGVkLlxuXG5mdW5jdGlvbiBfZm10Qnl0ZXMobikge1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDI0ICogMTAyNCkgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAoMTAyNCAqIDEwMjQpKS50b0ZpeGVkKDIpfSBNQmA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBpZiAoIXBlbmRpbmcgfHwgIXBlbmRpbmcuanNvbikge1xuICAgIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIElmIHRoZSB1c2VyIGhhcyBzd2l0Y2hlZCBvdmVycmlkZSB0byBhIGRpZmZlcmVudCBwYXRpZW50LCB0aGVcbiAgLy8gc3Rhc2hlZCBidW5kbGUgaXMgZm9yIHRoZSAqcHJldmlvdXMqIHBhdGllbnQuIEhpZGUgaXQgc28gdGhleVxuICAvLyBjYW4ndCBhY2NpZGVudGFsbHkgZG93bmxvYWQgdGhlIHdyb25nIGZpbGUuIFRoZSBidW5kbGUgc3RheXMgaW5cbiAgLy8gc3RvcmFnZTsgcmUtZW50ZXJpbmcgdGhlIG1hdGNoaW5nIG92ZXJyaWRlIHdpbGwgc3VyZmFjZSBpdCBhZ2Fpbi5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKG92Py5pZF9ubyAmJiBwZW5kaW5nLnBhdGllbnRJZCAmJiBwZW5kaW5nLnBhdGllbnRJZCAhPT0gb3YuaWRfbm8pIHtcbiAgICBlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xuICAgIHJldHVybjtcbiAgfVxuICBlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW4gPSBmYWxzZTtcbiAgLy8gRmlsZW5hbWUgKyBzaXplYWdlIGxpdmUgaW4gc2VwYXJhdGUgc2libGluZyBlbGVtZW50cyBpbiB0aGUgbmV3XG4gIC8vIHNpbmdsZS1wYW5lbCBsYXlvdXQgc28gd2UganVzdCB1cGRhdGUgZWFjaCBkaXJlY3RseS5cbiAgY29uc3QgYWdvID0gcGVuZGluZy5nZW5lcmF0ZWRBdCA/IF9mbXRSZWxhdGl2ZShwZW5kaW5nLmdlbmVyYXRlZEF0KSA6IFwiXCI7XG4gIGlmIChlbHMuYnVuZGxlRmlsZW5hbWUpIHtcbiAgICBlbHMuYnVuZGxlRmlsZW5hbWUudGV4dENvbnRlbnQgPSBwZW5kaW5nLmZpbGVuYW1lO1xuICAgIGVscy5idW5kbGVGaWxlbmFtZS50aXRsZSA9IHBlbmRpbmcuZmlsZW5hbWU7XG4gIH1cbiAgaWYgKGVscy5idW5kbGVTaXplYWdlKSB7XG4gICAgZWxzLmJ1bmRsZVNpemVhZ2UudGV4dENvbnRlbnQgPSBgJHtfZm10Qnl0ZXMocGVuZGluZy5ieXRlcyB8fCAwKX0ke2FnbyA/IGAgXHUwMEI3ICR7YWdvfWAgOiBcIlwifWA7XG4gIH1cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkUGVuZGluZ0J1bmRsZSgpIHtcbiAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgaWYgKCFwZW5kaW5nKSByZXR1cm47XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbcGVuZGluZy5qc29uXSwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2ZoaXIranNvblwiIH0pO1xuICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICB0cnkge1xuICAgIGF3YWl0IGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQoeyB1cmwsIGZpbGVuYW1lOiBwZW5kaW5nLmZpbGVuYW1lLCBzYXZlQXM6IGZhbHNlIH0pO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIFJlbGVhc2UgYWZ0ZXIgYSB0aWNrIHNvIHRoZSBkb3dubG9hZCBoYXMgdGltZSB0byBzdGFydC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgNTAwMCk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJQZW5kaW5nQnVuZGxlKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgYXdhaXQgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbiAgLy8gQ2xlYXJpbmcgdGhlIGRvd25sb2FkIGlzIHRoZSB1c2VyJ3MgXCJJJ20gZG9uZSB3aXRoIHRoaXMgcmVzdWx0XCJcbiAgLy8gZ2VzdHVyZSBcdTIwMTQgd2lwZSB0aGUgY29tcGxldGlvbiBzdGF0dXMgYmFubmVyIHRvbyBzbyB0aGUgcmVzdWx0IHpvbmVcbiAgLy8gY29sbGFwc2VzIGVudGlyZWx5IGluc3RlYWQgb2YgbGluZ2VyaW5nIHdpdGggYSBzdGFsZSBcIlx1MjcwNSBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTBcIlxuICAvLyBhbmQgbm8gZG93bmxvYWQgYnV0dG9uIG5leHQgdG8gaXQuXG4gIF9sYXRlc3RTdGF0dXMgPSBudWxsO1xuICBzZXRTdGF0dXMoXCJcIiwgbnVsbCk7XG4gIGF3YWl0IGNocm9tZS5ydW50aW1lXG4gICAgLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJjbGVhclN5bmNTdGF0dXNcIiB9KVxuICAgIC5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmVscy5kb3dubG9hZEJ1bmRsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG93bmxvYWRQZW5kaW5nQnVuZGxlKTtcbmVscy5jbGVhckJ1bmRsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJQZW5kaW5nQnVuZGxlKTtcblxuLy8gTGl2ZSB1cGRhdGUgd2hlbiBiYWNrZ3JvdW5kIHN0YXNoZXMgYSBuZXcgYnVuZGxlIHdoaWxlIHBvcHVwIGlzIG9wZW4uXG4vLyAoTm90ZTogYW5vdGhlciBvbkNoYW5nZWQgbGlzdGVuZXIgZWFybGllciBpbiB0aGUgZmlsZSByZWZyZXNoZXMgdGhlXG4vLyBkYXRhLXN0YXRlIGNhcmQ7IHdlIGxlYXZlIHRoYXQgb25lIHNlcGFyYXRlIHNvIGZhaWx1cmUgb2YgZWl0aGVyIHBhdGhcbi8vIGRvZXNuJ3QgdGFrZSB0aGUgb3RoZXIgZG93bi4pXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBQRU5ESU5HX0JVTkRMRV9LRVkgaW4gY2hhbmdlcykgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbn0pO1xuXG4vLyBCYWNrZ3JvdW5kLXNpZGUgZmxvdyBjYW4gbXV0YXRlIHRoZSBwYXRpZW50T3ZlcnJpZGUgbWlkLXN5bmMgXHUyMDE0IG1vc3Rcbi8vIGltcG9ydGFudGx5IF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaSBzd2FwcyB0aGUgYXV0by1YWFhYWFhYWFxuLy8gcGxhY2Vob2xkZXIgZm9yIHRoZSByZWFsIE5ISSBjaWQuIFdpdGhvdXQgdGhpcyBsaXN0ZW5lciB0aGUgcG9wdXBcbi8vIGlucHV0cyBzdGF5ZWQgc3RhbGUsIHJlZnJlc2hQZW5kaW5nQnVuZGxlJ3MgcGF0aWVudC1tYXRjaCBjaGVja1xuLy8gdGhlbiBjb21wYXJlZCBvbGQgaW5wdXQgdmFsdWUgdnMuIGZyZXNoIGJ1bmRsZS5wYXRpZW50SWQgYW5kIGhpZFxuLy8gdGhlIGRvd25sb2FkIGJ1dHRvbi4gUmVsb2FkIHRoZSBvdmVycmlkZSBpbnRvIHRoZSBpbnB1dHMgd2hlbmV2ZXJcbi8vIHN0b3JhZ2UgY2hhbmdlcyBzbyBldmVyeSBkb3duc3RyZWFtIGd1YXJkIHNlZXMgY29uc2lzdGVudCB2YWx1ZXMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBjaGFuZ2VzLnBhdGllbnRPdmVycmlkZSkgbG9hZFBhdGllbnRPdmVycmlkZSgpO1xufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBcdTI0RDggSGVscC1pY29uIHRvb2x0aXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gT25lIHNoYXJlZCA8ZGl2PiBhcHBlbmRlZCB0byB0aGUgcG9wdXAgYm9keS4gT24gaG92ZXIgb2YgYW55XG4vLyAuaGVscC1pY29uLCB3ZSBjb3B5IGl0cyBkYXRhLXRpcCB0ZXh0IGFuZCBwb3NpdGlvbiB0aGUgdG9vbHRpcFxuLy8gaW5zaWRlIHRoZSBwb3B1cCwgY2xhbXBpbmcgdG8gaXRzIHZpZXdwb3J0IHNvIGl0IGNhbid0IGNsaXAgb2ZmXG4vLyBlaXRoZXIgZWRnZSByZWdhcmRsZXNzIG9mIHdoZXJlIHRoZSBpY29uIHNpdHMuIChDU1MgcHNldWRvLWVsZW1lbnRzXG4vLyBjYW4ndCBiZSBtZWFzdXJlZCwgc28gYSBwdXJlLUNTUyBhcHByb2FjaCBpbmV2aXRhYmx5IHBpY2tzIG9uZVxuLy8gYW5jaG9yIHNpZGUgYW5kIGJyZWFrcyBmb3IgaWNvbnMgb24gdGhlIG90aGVyIHNpZGUgb2YgdGhlIHBvcHVwLilcbmNvbnN0IF9oZWxwVGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbl9oZWxwVGlwLmNsYXNzTmFtZSA9IFwiaGVscC10b29sdGlwXCI7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9oZWxwVGlwKTtcblxuY29uc3QgVklFV1BPUlRfTUFSR0lOID0gNjsgLy8ga2VlcCB0aGlzIG1hbnkgcHggY2xlYXIgb2YgcG9wdXAgZWRnZXNcblxuZnVuY3Rpb24gX3Nob3dIZWxwVG9vbHRpcChpY29uKSB7XG4gIF9oZWxwVGlwLnRleHRDb250ZW50ID0gaWNvbi5kYXRhc2V0LnRpcCB8fCBpY29uLmdldEF0dHJpYnV0ZShcImRhdGEtdGlwXCIpIHx8IFwiXCI7XG4gIF9oZWxwVGlwLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpO1xuXG4gIC8vIE1lYXN1cmUgbm93IHRoYXQgY29udGVudCBpcyBzZXQuXG4gIGNvbnN0IGljb25SZWN0ID0gaWNvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgdGlwUmVjdCA9IF9oZWxwVGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB2aWV3cG9ydFcgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIGNvbnN0IHZpZXdwb3J0SCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cbiAgLy8gSG9yaXpvbnRhbDogcHJlZmVyIGNlbnRlcmVkIG9uIHRoZSBpY29uOyBjbGFtcCBpbnRvIFttYXJnaW4sIHZ3LXRpcC1tYXJnaW5dLlxuICBsZXQgbGVmdCA9IGljb25SZWN0LmxlZnQgKyBpY29uUmVjdC53aWR0aCAvIDIgLSB0aXBSZWN0LndpZHRoIC8gMjtcbiAgaWYgKGxlZnQgPCBWSUVXUE9SVF9NQVJHSU4pIGxlZnQgPSBWSUVXUE9SVF9NQVJHSU47XG4gIGlmIChsZWZ0ICsgdGlwUmVjdC53aWR0aCA+IHZpZXdwb3J0VyAtIFZJRVdQT1JUX01BUkdJTikge1xuICAgIGxlZnQgPSB2aWV3cG9ydFcgLSBWSUVXUE9SVF9NQVJHSU4gLSB0aXBSZWN0LndpZHRoO1xuICB9XG4gIC8vIFZlcnRpY2FsOiBwcmVmZXIgYWJvdmUgdGhlIGljb247IGZsaXAgYmVsb3cgaWYgdGhlcmUncyBubyByb29tIHVwIHRvcC5cbiAgbGV0IHRvcCA9IGljb25SZWN0LnRvcCAtIHRpcFJlY3QuaGVpZ2h0IC0gNjtcbiAgaWYgKHRvcCA8IFZJRVdQT1JUX01BUkdJTikgdG9wID0gaWNvblJlY3QuYm90dG9tICsgNjtcbiAgLy8gRmluYWwgc2FmZXR5OiBjbGFtcCBpbnRvIHZpZXdwb3J0IHNvIHZlcnkgbG9uZyB0b29sdGlwcyBjYW4ndCBibGVlZFxuICAvLyBvZmYgdGhlIGJvdHRvbSBlaXRoZXIuXG4gIGlmICh0b3AgKyB0aXBSZWN0LmhlaWdodCA+IHZpZXdwb3J0SCAtIFZJRVdQT1JUX01BUkdJTikge1xuICAgIHRvcCA9IE1hdGgubWF4KFZJRVdQT1JUX01BUkdJTiwgdmlld3BvcnRIIC0gVklFV1BPUlRfTUFSR0lOIC0gdGlwUmVjdC5oZWlnaHQpO1xuICB9XG5cbiAgX2hlbHBUaXAuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICBfaGVscFRpcC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xufVxuXG5mdW5jdGlvbiBfaGlkZUhlbHBUb29sdGlwKCkge1xuICBfaGVscFRpcC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbn1cblxuLy8gRGVsZWdhdGVkIGhvdmVyIGhhbmRsZXJzIFx1MjAxNCB3b3JrcyBmb3IgaWNvbnMgYWRkZWQgYWZ0ZXIgcG9wdXAgbG9hZCB0b29cbi8vIChlLmcuIHdoZW4gbW9kZSB0b2dnbGUgcmV2ZWFscyBiYWNrZW5kLW9ubHkgZmllbGRzKS5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+IHtcbiAgY29uc3QgaWNvbiA9IGUudGFyZ2V0LmNsb3Nlc3Q/LihcIi5oZWxwLWljb25cIik7XG4gIGlmIChpY29uKSBfc2hvd0hlbHBUb29sdGlwKGljb24pO1xufSk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKGUpID0+IHtcbiAgY29uc3QgaWNvbiA9IGUudGFyZ2V0LmNsb3Nlc3Q/LihcIi5oZWxwLWljb25cIik7XG4gIGlmIChpY29uKSBfaGlkZUhlbHBUb29sdGlwKCk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2ZXJzaW9uXCIpLnRleHRDb250ZW50ID1cbiAgICBcInZcIiArIGNocm9tZS5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbjtcblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luLW9rLW5leHRcIilcbiAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBfc2V0QWN0aXZlU3RlcCgyKSk7XG5cbiAgYXdhaXQgbG9hZFNpZGViYXJFbmFibGVkKCk7XG4gIGF3YWl0IGxvYWRNYXNrTmFtZUVuYWJsZWQoKTtcblxuICAvLyBTZWVkIGxvY2FsIGJ1bmRsZSBzdGF0ZSBmcm9tIHN0b3JhZ2Ugc28gdGhlIGRhdGEtc3RhdGUgY2FyZCBpc1xuICAvLyBwb3B1bGF0ZWQgYXMgc29vbiBhcyB0aGUgcG9wdXAgcmVuZGVycyAobm8gZmxhc2ggb2YgXCJcdTY3MkFcdTc1MjJcdTc1MUZcIikuXG4gIGF3YWl0IF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xuXG4gIC8vIE9yZGVyIG1hdHRlcnM6IGxvYWRCYWNrZW5kVXJsIHBvcHVsYXRlcyBlbHMuYmFja2VuZFVybC52YWx1ZSwgd2hpY2hcbiAgLy8gbG9hZFN5bmNNb2RlKCkgcmVhZHMgdmlhIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpLiBSZXZlcnNlIHRoaXMgYW5kXG4gIC8vIHRoZSBhdXRvLXRlc3Qgc2VlcyBhbiBlbXB0eSBVUkwgYW5kIGZhbHNlbHkgcmVwb3J0cyBcIlx1NjcyQVx1OEEyRFx1NUI5QSBCYWNrZW5kIFVSTFwiXG4gIC8vIG9uIGV2ZXJ5IHBvcHVwIG9wZW4uXG4gIGF3YWl0IGxvYWRCYWNrZW5kVXJsKCk7XG4gIGF3YWl0IGxvYWRTeW5jTW9kZSgpO1xuICBhd2FpdCBsb2FkUGF0aWVudE92ZXJyaWRlKCk7XG4gIGF3YWl0IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG5cbiAgY29uc3QgdGFiID0gYXdhaXQgZ2V0QWN0aXZlVGFiKCk7XG4gIGlmICghdGFiPy51cmwpIHtcbiAgICBzZXRTdGF0dXMoXCJubyBhY3RpdmUgdGFiXCIsIFwiZXJyb3JcIik7XG4gICAgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFN5bmMgcmVxdWlyZXMgYmVpbmcgb24gYW4gTkhJIHRhYiBzbyBjb29raWVzL3Nlc3Npb24gYXJlIHVzYWJsZSBmcm9tXG4gIC8vIHRoZSBTVy4gRmxhZyB2aWEgZGF0YXNldCBzbyBfcmVmcmVzaEJ1dHRvblN0YXRlcyBjYW4gY29tYmluZSB0aGlzXG4gIC8vIHdpdGggdGhlIG1vZGUgKyBjb25uIHN0YXRlLiBXaGVuIG9mZi1OSEksIGFsc28gc3VyZmFjZSB0aGVcbiAgLy8gXCJcdUQ4M0RcdUREMTcgXHU5NThCXHU1NTVGXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU3NjdCXHU1MTY1XCIgYmFubmVyIHNvIHVzZXJzIGRvbid0IHdvbmRlciB3aGVyZSB0byBnby5cbiAgY29uc3Qgb25OaGkgPSBpc05oaVRhYih0YWIudXJsKTtcbiAgaWYgKG9uTmhpKSBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGVsc2UgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgaWYgKGVscy5vcGVuTmhpU2VjdGlvbikgZWxzLm9wZW5OaGlTZWN0aW9uLmhpZGRlbiA9IG9uTmhpO1xuXG4gIC8vIFdoZW4gb24gdGhlIE5ISSB0YWIsIGFzayBiYWNrZ3JvdW5kIHRvIHZlcmlmeSB0aGVyZSdzIGFuIGFjdGl2ZVxuICAvLyBzZXNzaW9uLiBUaGUgU1cgcHJvYmVzIElIS0UzNDEwIHdpdGggc2Vzc2lvblN0b3JhZ2UudG9rZW4gXHUyMDE0IGNoZWFwXG4gIC8vIGFuZCBvbmx5IHN1Y2NlZWRzIHdoZW4gdGhlIHVzZXIgaGFzIGxvZ2dlZCBpbi4gQW55dGhpbmcgYnV0IGB0cnVlYFxuICAvLyAoZmFsc2UsIG51bGwsIG9yIG5vIHJlc3BvbnNlKSBtYWtlcyB1cyBhc3N1bWUgXCJub3QgbG9nZ2VkIGluXCIgc29cbiAgLy8gdGhlIHVzZXIgc2VlcyB0aGUgYWN0aW9uYWJsZSBiYW5uZXIgaW5zdGVhZCBvZiBtYXNoaW5nIHRoZSBDVEFcbiAgLy8gaW50byBhIGRlbGF5ZWQgXCJcdUQ4M0RcdUREMTIgXHU1QzFBXHU2NzJBXHU3NjdCXHU1MTY1XCIgc3RhdHVzLlxuICBpZiAob25OaGkgJiYgdGFiLmlkKSB7XG4gICAgY2hyb21lLnJ1bnRpbWVcbiAgICAgIC5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiY2hlY2tOaGlMb2dpblwiLCB0YWJJZDogdGFiLmlkIH0pXG4gICAgICAudGhlbigocmVzcCkgPT4ge1xuICAgICAgICBjb25zdCBsb2dnZWRJbiA9IHJlc3A/LmxvZ2dlZEluID09PSB0cnVlO1xuICAgICAgICBpZiAobG9nZ2VkSW4pIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluO1xuICAgICAgICBlbHNlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW4gPSBcIm5vXCI7XG4gICAgICAgIGlmIChlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24pIHtcbiAgICAgICAgICBlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24uaGlkZGVuID0gbG9nZ2VkSW47XG4gICAgICAgIH1cbiAgICAgICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgICAgLy8gTG9naW4gcHJvYmUgY29tcGxldGluZyBwb3NpdGl2ZWx5IGlzIHRoZSBzdGVwLTEgaW50ZW50aW9uYWxcbiAgICAgICAgLy8gY29tcGxldGlvbiBldmVudCBcdTIwMTQgYWR2YW5jZSB0aGUgd2l6YXJkIG9uY2UgaWYgdGhlIHVzZXIgaXNcbiAgICAgICAgLy8gY3VycmVudGx5IGxvb2tpbmcgYXQgc3RlcCAxLlxuICAgICAgICBpZiAobG9nZ2VkSW4gJiYgX3dpemFyZEluaXRpYWxpemVkKSBfbWF5YmVBdXRvQWR2YW5jZSgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIC8vIElmIHRoZSBwcm9iZSBmYWlscyAoU1cgdW5yZWFjaGFibGUsIGV0YyksIGRvbid0IHB1bmlzaCB0aGVcbiAgICAgICAgLy8gdXNlciBcdTIwMTQgbGVhdmUgdGhlIENUQSBlbmFibGVkIGFuZCBsZXQgdGhlIHN5bmMncyBvd24gc2Vzc2lvblxuICAgICAgICAvLyBjaGVjayBzdXJmYWNlIGEgcmVhbCBlcnJvciBpZiBuZWVkZWQuXG4gICAgICAgIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluO1xuICAgICAgICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKSBlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluO1xuICAgIGlmIChlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24pIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICB9XG5cbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcblxuICAvLyBTdGFydCB0aGUgd2l6YXJkIEFGVEVSIGFsbCBpbml0aWFsIHN0YXRlIGlzIGxvYWRlZCBcdTIwMTQgdGhpcyBwaWNrc1xuICAvLyB0aGUgY29ycmVjdCBzdGFydGluZyBzdGVwIChlLmcuIHJldHVybmluZyB1c2VyIHdpdGggdmFsaWQgc2Vzc2lvblxuICAvLyBsYW5kcyBvbiBzdGVwIDMgZGlyZWN0bHkpLlxuICBfaW5pdFdpemFyZCgpO1xuXG4gIC8vIFJlLWF0dGFjaCB0byBhbnkgc3luYyB0aGF0J3MgY3VycmVudGx5IHJ1bm5pbmcgaW4gdGhlIHNlcnZpY2Ugd29ya2VyLlxuICAvLyBUaGlzIGlzIHdoYXQgbGV0cyB0aGUgdXNlciBjbG9zZSArIHJlb3BlbiB0aGUgcG9wdXAgbWlkLXN5bmMuXG4gIGF3YWl0IHJlZnJlc2hTeW5jU3RhdHVzRnJvbUJhY2tncm91bmQoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFN5bmNTdGF0dXNGcm9tQmFja2dyb3VuZCgpIHtcbiAgY29uc3Qgc3RhdHVzID0gYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImdldFN5bmNTdGF0dXNcIiB9KS5jYXRjaCgoKSA9PiBudWxsKTtcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgYXBwbHlTeW5jU3RhdHVzKHN0YXR1cyk7XG59XG5cbi8vIExhdGVzdCBzdGF0dXMgc25hcHNob3QgXHUyMDE0IGtlZXBpbmcgaXQgbGV0cyB0aGUgbGl2ZS1lbGFwc2VkIHRpY2tlclxuLy8gcmVwYWludCB0aGUgc2FtZSBwcm9ncmVzcyB0ZXh0IHdpdGggYW4gdXBkYXRlZCBgW05zXWAgcHJlZml4IGV2ZXJ5XG4vLyBzZWNvbmQgd2l0aG91dCBzcGFtbWluZyBjaHJvbWUuc3RvcmFnZSBmcm9tIHRoZSBzZXJ2aWNlIHdvcmtlci5cbmxldCBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbmxldCBfZWxhcHNlZFRpY2tlcklkID0gbnVsbDtcblxuZnVuY3Rpb24gX2ZtdEVsYXBzZWQobXMpIHtcbiAgaWYgKG1zIDwgNjBfMDAwKSByZXR1cm4gYCR7TWF0aC5mbG9vcihtcyAvIDEwMDApfXNgO1xuICByZXR1cm4gYCR7TWF0aC5mbG9vcihtcyAvIDYwXzAwMCl9bSR7TWF0aC5yb3VuZCgobXMgJSA2MF8wMDApIC8gMTAwMCl9c2A7XG59XG5cbmZ1bmN0aW9uIF9yZW5kZXJTdGF0dXMoKSB7XG4gIGNvbnN0IHN0YXR1cyA9IF9sYXRlc3RTdGF0dXM7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIGxldCB0ZXh0ID0gc3RhdHVzLnByb2dyZXNzIHx8IFwiKHN5bmMgXHU5MDMyXHU4ODRDXHU0RTJEKVwiO1xuICBpZiAoc3RhdHVzLnJ1bm5pbmcgJiYgc3RhdHVzLnN0YXJ0ZWQpIHtcbiAgICBjb25zdCBlbGFwc2VkID0gRGF0ZS5ub3coKSAtIHN0YXR1cy5zdGFydGVkO1xuICAgIHRleHQgPSBgXHUyM0YxICR7X2ZtdEVsYXBzZWQoZWxhcHNlZCl9IFx1MDBCNyAke3RleHR9YDtcbiAgfVxuICBjb25zdCBraW5kID0gc3RhdHVzLnJ1bm5pbmcgPyBcImluZm9cIiA6IChzdGF0dXMucGhhc2UgPT09IFwiZXJyb3JcIiA/IFwiZXJyb3JcIiA6IFwic3VjY2Vzc1wiKTtcbiAgY29uc3QgYnJlYWtkb3duID0gc3RhdHVzLnJ1bm5pbmcgPyBudWxsIDogc3RhdHVzLmJyZWFrZG93bjtcbiAgc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93bik7XG59XG5cbmZ1bmN0aW9uIGFwcGx5U3luY1N0YXR1cyhzdGF0dXMpIHtcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgX2xhdGVzdFN0YXR1cyA9IHN0YXR1cztcbiAgX3JlbmRlclN0YXR1cygpO1xuICAvLyBTdGF0dXMgYmFubmVyIGxpdmVzIGluc2lkZSBzdGVwIDMgXHUyMDE0IGZvcmNlLWp1bXAgdGhlcmUgc28gaXQnc1xuICAvLyBhY3R1YWxseSB2aXNpYmxlLiBSdW5uaW5nIHN5bmMgT1IgYSBmcmVzaCBjb21wbGV0aW9uIGJvdGggd2FycmFudFxuICAvLyBiZWluZyBvbiB0aGUgcmVzdWx0IHN0ZXAuXG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQgJiYgX2FjdGl2ZVN0ZXAgIT09IDMpIHtcbiAgICBfc2V0QWN0aXZlU3RlcCgzLCB7IHNpbGVudDogdHJ1ZSB9KTtcbiAgfVxuICBpZiAoc3RhdHVzLnJ1bm5pbmcpIHtcbiAgICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgZWxzLnN5bmNBcGlCdG4udGV4dENvbnRlbnQgPSBcIlx1NTNENlx1NUY5N1x1NEUyRFx1MjAyNlwiO1xuICAgIGVscy5zdG9wQnRuLmhpZGRlbiA9IGZhbHNlO1xuICAgIGlmICghX2VsYXBzZWRUaWNrZXJJZCkge1xuICAgICAgX2VsYXBzZWRUaWNrZXJJZCA9IHNldEludGVydmFsKF9yZW5kZXJTdGF0dXMsIDEwMDApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChfZWxhcHNlZFRpY2tlcklkKSB7XG4gICAgICBjbGVhckludGVydmFsKF9lbGFwc2VkVGlja2VySWQpO1xuICAgICAgX2VsYXBzZWRUaWNrZXJJZCA9IG51bGw7XG4gICAgfVxuICAgIC8vIFJlLWRlcml2ZSBzeW5jIGJ1dHRvbiBlbmFibGVkIHN0YXRlIGZyb20gbW9kZS9jb25uL05ISS10YWIgaW5zdGVhZFxuICAgIC8vIG9mIHVuY29uZGl0aW9uYWxseSBlbmFibGluZyBcdTIwMTQga2VlcHMgdGhlIGJ1dHRvbiBkaXNhYmxlZCB3aGVuIHdlXG4gICAgLy8ga25vdyB3ZSBzaG91bGRuJ3Qgc3luYyAoZS5nLiBiYWNrZW5kIGRvd24sIG9mZi1OSEkgdGFiKS5cbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIC8vIFN5bmMganVzdCBmaW5pc2hlZCBcdTIwMTQgYm90aCBzaWRlcyBtYXkgaGF2ZSBjaGFuZ2VkIChiYWNrZW5kIGdvdFxuICAgIC8vIG5ldyByZXNvdXJjZXMgaW4gYmFja2VuZCBtb2RlLCBsb2NhbCBidW5kbGUgd2FzIHN0YXNoZWQgaW4gZWl0aGVyXG4gICAgLy8gbW9kZSkuIFJlZnJlc2ggZGF0YS1zdGF0ZSBjYXJkIHNvIHRoZSB1c2VyIHNlZXMgdXAtdG8tZGF0ZSBjb3VudHMuXG4gICAgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG4gICAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIF9jb25uU3RhdGUgPT09IFwib2tcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICB9XG59XG5cbi8vIFN0b3AgdGhlIGluLXByb2dyZXNzIHN5bmMuIFR3by1wcm9uZ2VkIHNvIGl0IHdvcmtzIGV2ZW4gd2hlbiB0aGVcbi8vIHNlcnZpY2Ugd29ya2VyIGhhcyBkaWVkOiAoMSkgdGVsbCB0aGUgU1cgdG8gc2V0IGl0cyBjYW5jZWwgZmxhZyxcbi8vICgyKSB3cml0ZSBzdG9yYWdlIGRpcmVjdGx5IHRvIHJ1bm5pbmc6ZmFsc2Ugc28gdGhlIHBvcHVwIFVJIHVuZnJlZXplc1xuLy8gaW1tZWRpYXRlbHkgZXZlbiBpZiB0aGUgU1cgbWVzc2FnZSBjYW4ndCBiZSBkZWxpdmVyZWQuXG5hc3luYyBmdW5jdGlvbiBzdG9wU3luYygpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBzeW5jU3RhdHVzOiB7XG4gICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdTUwNUNcdTZCNjJcdTRFMkRcdUZGMENcdTZCNjNcdTU3MjhcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTlcdTIwMjZcIixcbiAgICAgIHBoYXNlOiBcImNhbmNlbGxlZFwiLFxuICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgfSxcbiAgfSk7XG4gIHNldFN0YXR1cyhcIlx1MjZENCBcdTUwNUNcdTZCNjJcdTRFMkRcdUZGMENcdTZCNjNcdTU3MjhcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTlcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwic3RvcFN5bmNcIiB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIGVscy5zdG9wQnRuLmhpZGRlbiA9IHRydWU7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG59XG5cbi8vIExpdmUgcHJvZ3Jlc3MgdXBkYXRlcyBcdTIwMTQgbGlzdGVuIG9uIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZCBzbyB3ZSBnZXRcbi8vIGV2ZXJ5IHVwZGF0ZSB0aGUgU1cgd3JpdGVzLCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhlIFNXJ3MgYnJvYWRjYXN0XG4vLyBzZW5kTWVzc2FnZSByZWFjaGVkIHVzLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgY2hhbmdlcy5zeW5jU3RhdHVzKSB7XG4gICAgYXBwbHlTeW5jU3RhdHVzKGNoYW5nZXMuc3luY1N0YXR1cy5uZXdWYWx1ZSk7XG4gIH1cbn0pO1xuXG4vLyAoTGVnYWN5IGluLW1lbW9yeSBicm9hZGNhc3Qgc3RpbGwgbGlzdGVuZWQgdG8gYXMgYSBiYWNrdXAuKVxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2cpID0+IHtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzeW5jUHJvZ3Jlc3NcIikge1xuICAgIGFwcGx5U3luY1N0YXR1cyhtc2cuc3RhdHVzKTtcbiAgfVxufSk7XG5cbi8vIFByZS1mbGlnaHQgZGV0ZWN0aW9uIGZvciBOSEkgbG9naW4gc3RhdGUuIFR3byBzaWduYWxzIChlaXRoZXIgdHJpZ2dlcnMpOlxuLy8gIDEuIFVSTCBpcyBpbiBOSEkgYXV0aCBuYW1lc3BhY2UgKElIS0UzMDk5U3h4KSBcdTIwMTQgbG9naW4gLyBJQyBjYXJkIHBhZ2VzXG4vLyAgMi4gUGFnZSBjb250YWlucyBhIHBhc3N3b3JkIGlucHV0IG9yIGtub3duIGxvZ2dlZC1vdXQgcGhyYXNlc1xuYXN5bmMgZnVuY3Rpb24gaXNPbk5oaUxvZ2luUGFnZSh0YWJJZCwgdXJsKSB7XG4gIGlmICh1cmw/LnBhdGhuYW1lICYmIC9JSEtFMzA5OS8udGVzdCh1cmwucGF0aG5hbWUpKSByZXR1cm4gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiAoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIGNvbnN0IHRleHQgPSAoZG9jdW1lbnQuYm9keT8uaW5uZXJUZXh0IHx8IFwiXCIpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgcGhyYXNlcyA9IFtcbiAgICAgICAgICBcIlx1OEFDQlx1NEY3Rlx1NzUyOFx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NjBBOFx1NzY4NFx1NTA2NVx1NEZERFx1NTM2MVwiLFxuICAgICAgICAgIFwiXHU3NjdCXHU1MTY1XHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBXCIsIFwiXHU3NjdCXHU1MTY1XHU1OTMxXHU2NTU3XCIsIFwiXHU4QUNCXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XCIsXG4gICAgICAgICAgXCJTZXNzaW9uIFx1NURGMlx1OTAzRVx1NjY0MlwiLCBcInNlc3Npb24gXHU1REYyXHU5MDNFXHU2NjQyXCIsIFwiXHU1REYyXHU5MDNFXHU2NjQyXCIsXG4gICAgICAgICAgXCJcdThBQ0JcdTRFRTVcdTUwNjVcdTRGRERcdTUzNjFcdTc2N0JcdTUxNjVcIixcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIHBocmFzZXMuc29tZSgocCkgPT4gdGV4dC5pbmNsdWRlcyhwKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1MjZBMSBOSEkgQVBJLWRpcmVjdCBzeW5jIFx1MjAxNCBwcmltYXJ5IHBhdGguIEhpdHMgTkhJJ3MgdW5kZXJseWluZyBKU09OXG4vLyBlbmRwb2ludHMgaW4gcGFyYWxsZWwgYW5kIHBvc3RzIGFkYXB0ZWQgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQuXG4vLyBSZXF1aXJlcyBwYXRpZW50X292ZXJyaWRlIHRvIGJlIGZpbGxlZC5cbi8vIENvbnZlcnQgYSBiYWNrZW5kIFVSTCBcdTIxOTIgdGhlIG9yaWdpbi1wYXR0ZXJuIENocm9tZSB3YW50cyBmb3IgcGVybWlzc2lvblxuLy8gcmVxdWVzdHMuIFwiaHR0cDovLzE5Mi4xNjguMS41OjgwMTBcIiBcdTIxOTIgXCJodHRwOi8vMTkyLjE2OC4xLjU6ODAxMC8qXCIuXG4vLyBSZXR1cm5zIG51bGwgd2hlbiB0aGUgVVJMIGlzbid0IHBhcnNlYWJsZSBzbyB0aGUgY2FsbGVyIGNhbiBzaG9ydC1jaXJjdWl0LlxuZnVuY3Rpb24gX29yaWdpblBhdHRlcm5Gb3IodXJsKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IG5ldyBVUkwodXJsKTtcbiAgICByZXR1cm4gYCR7dS5wcm90b2NvbH0vLyR7dS5ob3N0fS8qYDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gQmFja2VuZC1tb2RlIHByZS1mbGlnaHQ6IGVuc3VyZSB0aGUgZXh0ZW5zaW9uIGhhcyBob3N0IHBlcm1pc3Npb24gZm9yXG4vLyB0aGUgdXNlci1jb25maWd1cmVkIGJhY2tlbmQgVVJMLiBMb2NhbGhvc3QgLyAxMjcuMC4wLjEgYXJlIGNvdmVyZWQgYnlcbi8vIHRoZSBkZWZhdWx0IG1hbmlmZXN0IGhvc3RfcGVybWlzc2lvbnM7IHJlbW90ZSAvIExBTiAvIHByb2R1Y3Rpb24gVVJMc1xuLy8gbmVlZCBhIG9uZS10aW1lIHVzZXIgZ3JhbnQuIE11c3QgcnVuIGZyb20gYSB1c2VyIGdlc3R1cmUgKGJ1dHRvbiBjbGljaykuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVCYWNrZW5kUGVybWlzc2lvbihiYWNrZW5kVXJsKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBfb3JpZ2luUGF0dGVybkZvcihiYWNrZW5kVXJsKTtcbiAgaWYgKCFwYXR0ZXJuKSByZXR1cm4geyBvazogZmFsc2UsIHJlYXNvbjogYEJhY2tlbmQgVVJMIFx1NzEyMVx1NkNENVx1ODlFM1x1Njc5MDogJHtiYWNrZW5kVXJsfWAgfTtcbiAgY29uc3QgYWxyZWFkeSA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5jb250YWlucyh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgaWYgKGFscmVhZHkpIHJldHVybiB7IG9rOiB0cnVlIH07XG4gIGxldCBncmFudGVkO1xuICB0cnkge1xuICAgIGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgXHU2QjBBXHU5NjUwXHU4QUNCXHU2QzQyXHU1OTMxXHU2NTU3OiAke2UubWVzc2FnZX1gIH07XG4gIH1cbiAgcmV0dXJuIGdyYW50ZWRcbiAgICA/IHsgb2s6IHRydWUgfVxuICAgIDogeyBvazogZmFsc2UsIHJlYXNvbjogYFx1NjcyQVx1NjM4OFx1NkIwQVx1OTAyM1x1N0REQVx1NTIzMCAke3BhdHRlcm59IFx1MjAxNCBcdTUzRDZcdTZEODhgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFwaVN5bmNOaGkoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3YpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1NkRFIFx1MjQ2MSBcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcdUZGMUFcdThBQ0JcdTkwNzhcdTY0QzdcdTYwMjdcdTUyMjVcdTMwMDFcdTU4NkJcdTc1MUZcdTY1RTVcdTVGOENcdTYzMDlcdTc4QkFcdTVCOUFcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBQcmUtZmxpZ2h0OiBjaGVjayB3ZSdyZSBvbiBhbiBOSEkgdGFiIHNvIGNvb2tpZXMgYXJlIHVzYWJsZSBmcm9tIFNXLlxuICBjb25zdCB0YWIgPSBhd2FpdCBnZXRBY3RpdmVUYWIoKTtcbiAgbGV0IHVybDtcbiAgdHJ5IHsgdXJsID0gbmV3IFVSTCh0YWIudXJsKTsgfSBjYXRjaCB7IHNldFN0YXR1cyhcImFjdGl2ZSB0YWIgaGFzIG5vIFVSTFwiLCBcImVycm9yXCIpOyByZXR1cm47IH1cbiAgY29uc3Qgb25Mb2dpbiA9IGF3YWl0IGlzT25OaGlMb2dpblBhZ2UodGFiLmlkLCB1cmwpO1xuICBpZiAob25Mb2dpbikge1xuICAgIHNldFN0YXR1cyhcIlx1RDgzRFx1REQxMiBcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NVx1RkYxQVx1NUMxQVx1NjcyQVx1NzY3Qlx1NTE2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJhY2tlbmQgbW9kZTogcmUtdmVyaWZ5IGNvbm5lY3Rpdml0eSByaWdodCBoZXJlIGV2ZW4gaWYgdGhlIGJhbm5lclxuICAvLyBsYXN0IHNhaWQgb2suIEJldHdlZW4gdGhlIHByZXZpb3VzIGNoZWNrIGFuZCB0aGlzIGNsaWNrIHRoZSB1c2VyXG4gIC8vIG1heSBoYXZlIHN0b3BwZWQgZG9ja2VyOyB3aXRob3V0IGEgZnJlc2ggcHJvYmUgd2UnZCBzdGFydCBhbiB1cGxvYWRcbiAgLy8gdGhhdCBmYWlscyBtaWQtZmxpZ2h0IGFmdGVyIHBhcnRpYWwgZGF0YSBoYXMgaGl0IChvciBmYWlsZWQgdG8gaGl0KVxuICAvLyB0aGUgYmFja2VuZC4gQ2hlYXAgKFx1MjI2NDVzKSBhbmQgc2F2ZXMgYSBsb3Qgb2YgY29uZnVzaW9uLlxuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICBjb25zdCBvayA9IGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICAgIGlmICghb2spIHtcbiAgICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTVGOENcdTdBRUZcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTcgXHUyMDE0IFx1OEFDQlx1NzcwQlx1OTgwMlx1OTBFOCBiYW5uZXIgXHU3Njg0XHU4QUFBXHU2NjBFXCIsIFwiZXJyb3JcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgc3luY1N0YXR1czoge1xuICAgICAgcnVubmluZzogdHJ1ZSxcbiAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIixcbiAgICAgIHBoYXNlOiBcInN0YXJ0aW5nXCIsIHN0YXJ0ZWQ6IERhdGUubm93KCksIHRzOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0pO1xuICBzZXRTdGF0dXMoXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcblxuICAvLyBDb21wdXRlIGRhdGUgcmFuZ2UgZnJvbSB0aGUgZHJvcGRvd24uIFwiMVwiID0gTkhJJ3MgZGVmYXVsdCB3aW5kb3c7XG4gIC8vIGFueXRoaW5nIGVsc2UgaXMgXCJ0b2RheSBiYWNrIE4geWVhcnNcIi4gSGVscGVyIGluc2lkZSBiYWNrZ3JvdW5kLmpzXG4gIC8vIGNvbnZlcnRzIHRvIFx1NkMxMVx1NTcwQiBmb3IgTkhJJ3MgQVBJLlxuICBjb25zdCByYW5nZVNlbCA9IGVscy5hcGlTeW5jUmFuZ2U/LnZhbHVlIHx8IFwiM1wiO1xuICBsZXQgZGF0ZVJhbmdlID0gbnVsbDtcbiAgY29uc3QgUkFOR0VfTEFCRUxTID0ge1xuICAgIFwiMVwiOiAgIFwiXHU2NzAwXHU4RkQxIDEgXHU1RTc0XCIsXG4gICAgXCIzXCI6ICAgXCJcdTY3MDBcdThGRDEgMyBcdTVFNzRcIixcbiAgICBcIjVcIjogICBcIlx1NjcwMFx1OEZEMSA1IFx1NUU3NFwiLFxuICAgIFwiMTBcIjogIFwiXHU2NzAwXHU4RkQxIDEwIFx1NUU3NFwiLFxuICAgIFwiYWxsXCI6IFwiXHU1MTY4XHU5MEU4XHU2Qjc3XHU1M0YyXHU3RDAwXHU5MzA0XCIsXG4gIH07XG4gIGNvbnN0IGRhdGVSYW5nZUxhYmVsID0gUkFOR0VfTEFCRUxTW3JhbmdlU2VsXSB8fCBgXHU2NzAwXHU4RkQxICR7cmFuZ2VTZWx9IFx1NUU3NGA7XG4gIGlmIChyYW5nZVNlbCAhPT0gXCIxXCIpIHtcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZW5kID0gdG9kYXkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgbGV0IHN0YXJ0O1xuICAgIGlmIChyYW5nZVNlbCA9PT0gXCJhbGxcIikge1xuICAgICAgc3RhcnQgPSBcIjIwMDEtMDEtMDFcIjsgIC8vIFx1NkMxMVx1NTcwQiA5MCBcdTIwMTQgZmFyIGVub3VnaCBiYWNrIGZvciBhbnkgY2xpbmljYWwgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB5ZWFycyA9IHBhcnNlSW50KHJhbmdlU2VsLCAxMCk7XG4gICAgICBjb25zdCBzID0gbmV3IERhdGUodG9kYXkpO1xuICAgICAgcy5zZXRGdWxsWWVhcihzLmdldEZ1bGxZZWFyKCkgLSB5ZWFycyk7XG4gICAgICBzdGFydCA9IHMudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICAgIGRhdGVSYW5nZSA9IHsgc3RhcnQsIGVuZCB9O1xuICB9XG5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIHR5cGU6IFwic3RhcnROaGlBcGlTeW5jXCIsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdGFiSWQ6IHRhYi5pZCxcbiAgICAgIG1vZGU6IGN1cnJlbnRNb2RlKCksXG4gICAgICBiYWNrZW5kOiBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCksXG4gICAgICBzeW5jQXBpS2V5OiBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCksXG4gICAgICBuaGlCYXNlOiBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHdcIixcbiAgICAgIHBhdGllbnRPdmVycmlkZTogb3YsXG4gICAgICBkYXRlUmFuZ2UsXG4gICAgICBkYXRlUmFuZ2VMYWJlbCxcbiAgICB9LFxuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxhdW5jaCgpIHtcbiAgY29uc3QgYmFja2VuZCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKTtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgcmF3SWQgPSBvdj8uaWRfbm87XG4gIGNvbnN0IHNtYXJ0QXBwTGF1bmNoID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKSB8fCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIGlmICghcmF3SWQpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU5MDg0XHU2QzkyXHU2NzA5XHU3NUM1XHU0RUJBXHU4RUFCXHU1MjA2XHU4QjQ5IFx1MjAxNCBcdThBQ0JcdTUxNDhcdTYzMDlcdTMwMENcdUQ4M0RcdUREMDQgXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUzMDBEXHU2MjkzXHU0RTAwXHU2QjIxXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIEJhY2tlbmQgdHJhY2tzIFBhdGllbnQgdW5kZXIgaXRzIGhhc2hlZCBGSElSIGlkLCBub3QgdGhlIHJhdyBuYXRpb25hbCBJRC5cbiAgY29uc3QgcGF0aWVudElkID0gZGVyaXZlUGF0aWVudElkKHJhd0lkKTtcbiAgLy8gUmUtdGVzdCBjb25uZWN0aW9uIGV2ZW4gaWYgYmFubmVyIHNob3dzIG9rIFx1MjAxNCBiYWNrZW5kIG1heSBoYXZlIGdvbmVcbiAgLy8gZG93biBzaW5jZSB0aGUgbGFzdCBwcm9iZS5cbiAgY29uc3Qgb2sgPSBhd2FpdCB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgaWYgKCFvaykge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTVGOENcdTdBRUZcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTcgXHUyMDE0IFx1OEFDQlx1NzcwQlx1OTgwMlx1OTBFOCBiYW5uZXIgXHU3Njg0XHU4QUFBXHU2NjBFXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNldFN0YXR1cyhcIlx1NUVGQVx1N0FDQiBsYXVuY2ggY29udGV4dFx1MjAyNlwiLCBcImluZm9cIik7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc21hcnQvbGF1bmNoLWNvbnRleHRgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXRpZW50X2lkOiBwYXRpZW50SWQgfSksXG4gICAgfSk7XG4gICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgJHtyZXMuc3RhdHVzfTogJHthd2FpdCByZXMudGV4dCgpfWApO1xuICAgIGNvbnN0IHsgbGF1bmNoIH0gPSBhd2FpdCByZXMuanNvbigpO1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoeyBpc3M6IGAke2JhY2tlbmR9L2ZoaXJgLCBsYXVuY2ggfSk7XG4gICAgLy8gQXBwZW5kIGlzcyArIGxhdW5jaCBwYXJhbXMsIHJlc3BlY3RpbmcgYW55IGV4aXN0aW5nIHF1ZXJ5IHN0cmluZy5cbiAgICBjb25zdCBzZXAgPSBzbWFydEFwcExhdW5jaC5pbmNsdWRlcyhcIj9cIikgPyBcIiZcIiA6IFwiP1wiO1xuICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogYCR7c21hcnRBcHBMYXVuY2h9JHtzZXB9JHtwYXJhbXN9YCB9KTtcbiAgICB3aW5kb3cuY2xvc2UoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNldFN0YXR1cyhgXHUyNzRDIExhdW5jaCBcdTU5MzFcdTY1NTdcdUZGMUEke2UubWVzc2FnZX1gLCBcImVycm9yXCIpO1xuICB9XG59XG5cbmVscy5zeW5jQXBpQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhcGlTeW5jTmhpKTtcbmVscy5zdG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdG9wU3luYyk7XG5lbHMub3ZTYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzYXZlUGF0aWVudE92ZXJyaWRlKTtcbmVscy5vdkNsZWFyQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhclBhdGllbnRPdmVycmlkZSk7XG5bZWxzLm92SWRObywgZWxzLm92TmFtZSwgZWxzLm92QmlydGhEYXRlLCBlbHMub3ZHZW5kZXJdLmZvckVhY2goKGVsKSA9PlxuICBlbC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSlcbik7XG5lbHMubGF1bmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsYXVuY2gpO1xuXG4vLyBcIlx1NTNENlx1NUY5N1x1NUMwRFx1OEM2MVwiIGJhbm5lcjogY2xpY2sgLyBFbnRlciAvIFNwYWNlIGp1bXBzIGJhY2sgdG8gc3RlcCAyIGFuZFxuLy8gZXhwYW5kcyB0aGUgcGF0aWVudCBjYXJkIHNvIHRoZSB1c2VyIGNhbiBhZGp1c3QgdGhlIGlkZW50aXR5LlxuZnVuY3Rpb24gX2dvdG9TdGVwMkVkaXQoKSB7XG4gIF9zZXRBY3RpdmVTdGVwKDIpO1xufVxuZWxzLmFjdGl2ZVBhdGllbnQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfZ290b1N0ZXAyRWRpdCk7XG5lbHMuYWN0aXZlUGF0aWVudD8uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiIFwiKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF9nb3RvU3RlcDJFZGl0KCk7XG4gIH1cbn0pO1xuXG5pbml0KCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQVNBLE9BQUMsV0FBVztBQUNWO0FBRUEsWUFBSSxjQUFjO0FBQ2xCLFlBQUksaUJBQWlCO0FBQ3JCLFlBQUksU0FBUyxPQUFPLFdBQVc7QUFDL0IsWUFBSSxPQUFPLFNBQVMsU0FBUyxDQUFDO0FBQzlCLFlBQUksS0FBSyxtQkFBbUI7QUFDMUIsbUJBQVM7QUFBQSxRQUNYO0FBQ0EsWUFBSSxhQUFhLENBQUMsVUFBVSxPQUFPLFNBQVM7QUFDNUMsWUFBSSxVQUFVLENBQUMsS0FBSyxzQkFBc0IsT0FBTyxZQUFZLFlBQVksUUFBUSxZQUFZLFFBQVEsU0FBUztBQUM5RyxZQUFJLFNBQVM7QUFDWCxpQkFBTztBQUFBLFFBQ1QsV0FBVyxZQUFZO0FBQ3JCLGlCQUFPO0FBQUEsUUFDVDtBQUNBLFlBQUksWUFBWSxDQUFDLEtBQUssd0JBQXdCLE9BQU8sV0FBVyxZQUFZLE9BQU87QUFDbkYsWUFBSSxNQUFNLE9BQU8sV0FBVyxjQUFjLE9BQU87QUFDakQsWUFBSSxlQUFlLENBQUMsS0FBSywyQkFBMkIsT0FBTyxnQkFBZ0I7QUFDM0UsWUFBSSxZQUFZLG1CQUFtQixNQUFNLEVBQUU7QUFDM0MsWUFBSSxRQUFRLENBQUMsYUFBYSxTQUFTLE9BQU8sR0FBRztBQUM3QyxZQUFJLFFBQVEsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDO0FBQ3pCLFlBQUksZUFBZSxDQUFDLE9BQU8sU0FBUyxVQUFVLGFBQWE7QUFFM0QsWUFBSSxTQUFTLENBQUM7QUFFZCxZQUFJLFVBQVUsTUFBTTtBQUNwQixZQUFJLEtBQUssc0JBQXNCLENBQUMsU0FBUztBQUN2QyxvQkFBVSxTQUFVLEtBQUs7QUFDdkIsbUJBQU8sT0FBTyxVQUFVLFNBQVMsS0FBSyxHQUFHLE1BQU07QUFBQSxVQUNqRDtBQUFBLFFBQ0Y7QUFFQSxZQUFJLFNBQVMsWUFBWTtBQUN6QixZQUFJLGlCQUFpQixLQUFLLG1DQUFtQyxDQUFDLFNBQVM7QUFDckUsbUJBQVMsU0FBVSxLQUFLO0FBQ3RCLG1CQUFPLE9BQU8sUUFBUSxZQUFZLElBQUksVUFBVSxJQUFJLE9BQU8sZ0JBQWdCO0FBQUEsVUFDN0U7QUFBQSxRQUNGO0FBR0EsWUFBSSxnQkFBZ0IsU0FBVSxTQUFTO0FBQ3JDLGNBQUksT0FBTyxPQUFPO0FBQ2xCLGNBQUksU0FBUyxVQUFVO0FBQ3JCLG1CQUFPLENBQUMsU0FBUyxJQUFJO0FBQUEsVUFDdkI7QUFDQSxjQUFJLFNBQVMsWUFBWSxZQUFZLE1BQU07QUFDekMsa0JBQU0sSUFBSSxNQUFNLFdBQVc7QUFBQSxVQUM3QjtBQUNBLGNBQUksZ0JBQWdCLFFBQVEsZ0JBQWdCLGFBQWE7QUFDdkQsbUJBQU8sQ0FBQyxJQUFJLFdBQVcsT0FBTyxHQUFHLEtBQUs7QUFBQSxVQUN4QztBQUNBLGNBQUksQ0FBQyxRQUFRLE9BQU8sS0FBSyxDQUFDLE9BQU8sT0FBTyxHQUFHO0FBQ3pDLGtCQUFNLElBQUksTUFBTSxXQUFXO0FBQUEsVUFDN0I7QUFDQSxpQkFBTyxDQUFDLFNBQVMsS0FBSztBQUFBLFFBQ3hCO0FBRUEsWUFBSSxxQkFBcUIsU0FBVSxZQUFZO0FBQzdDLGlCQUFPLFNBQVUsU0FBUztBQUN4QixtQkFBTyxJQUFJLEtBQUssSUFBSSxFQUFFLE9BQU8sT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUFBLFVBQ3BEO0FBQUEsUUFDRjtBQUVBLFlBQUksZUFBZSxXQUFZO0FBQzdCLGNBQUksU0FBUyxtQkFBbUIsS0FBSztBQUNyQyxjQUFJLFNBQVM7QUFDWCxxQkFBUyxTQUFTLE1BQU07QUFBQSxVQUMxQjtBQUNBLGlCQUFPLFNBQVMsV0FBWTtBQUMxQixtQkFBTyxJQUFJLEtBQUs7QUFBQSxVQUNsQjtBQUNBLGlCQUFPLFNBQVMsU0FBVSxTQUFTO0FBQ2pDLG1CQUFPLE9BQU8sT0FBTyxFQUFFLE9BQU8sT0FBTztBQUFBLFVBQ3ZDO0FBQ0EsbUJBQVMsSUFBSSxHQUFHLElBQUksYUFBYSxRQUFRLEVBQUUsR0FBRztBQUM1QyxnQkFBSSxPQUFPLGFBQWEsQ0FBQztBQUN6QixtQkFBTyxJQUFJLElBQUksbUJBQW1CLElBQUk7QUFBQSxVQUN4QztBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUVBLFlBQUksV0FBVyxTQUFVLFFBQVE7QUFDL0IsY0FBSUEsVUFBUztBQUNiLGNBQUlDLFVBQVMsaUJBQWtCO0FBQy9CLGNBQUk7QUFDSixjQUFJQSxRQUFPLFFBQVEsQ0FBQyxLQUFLLHdCQUF3QjtBQUMvQyx5QkFBYUEsUUFBTztBQUFBLFVBQ3RCLE9BQU87QUFDTCx5QkFBYSxTQUFVLFNBQVM7QUFDOUIscUJBQU8sSUFBSUEsUUFBTyxPQUFPO0FBQUEsWUFDM0I7QUFBQSxVQUNGO0FBQ0EsY0FBSSxhQUFhLFNBQVUsU0FBUztBQUNsQyxnQkFBSSxPQUFPLFlBQVksVUFBVTtBQUMvQixxQkFBT0QsUUFBTyxXQUFXLE1BQU0sRUFBRSxPQUFPLFNBQVMsTUFBTSxFQUFFLE9BQU8sS0FBSztBQUFBLFlBQ3ZFLE9BQU87QUFDTCxrQkFBSSxZQUFZLFFBQVEsWUFBWSxRQUFXO0FBQzdDLHNCQUFNLElBQUksTUFBTSxXQUFXO0FBQUEsY0FDN0IsV0FBVyxRQUFRLGdCQUFnQixhQUFhO0FBQzlDLDBCQUFVLElBQUksV0FBVyxPQUFPO0FBQUEsY0FDbEM7QUFBQSxZQUNGO0FBQ0EsZ0JBQUksUUFBUSxPQUFPLEtBQUssT0FBTyxPQUFPLEtBQ3BDLFFBQVEsZ0JBQWdCQyxTQUFRO0FBQ2hDLHFCQUFPRCxRQUFPLFdBQVcsTUFBTSxFQUFFLE9BQU8sV0FBVyxPQUFPLENBQUMsRUFBRSxPQUFPLEtBQUs7QUFBQSxZQUMzRSxPQUFPO0FBQ0wscUJBQU8sT0FBTyxPQUFPO0FBQUEsWUFDdkI7QUFBQSxVQUNGO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBRUEsWUFBSSx5QkFBeUIsU0FBVSxZQUFZO0FBQ2pELGlCQUFPLFNBQVUsS0FBSyxTQUFTO0FBQzdCLG1CQUFPLElBQUksU0FBUyxLQUFLLElBQUksRUFBRSxPQUFPLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFBQSxVQUM3RDtBQUFBLFFBQ0Y7QUFFQSxZQUFJLG1CQUFtQixXQUFZO0FBQ2pDLGNBQUksU0FBUyx1QkFBdUIsS0FBSztBQUN6QyxpQkFBTyxTQUFTLFNBQVUsS0FBSztBQUM3QixtQkFBTyxJQUFJLFNBQVMsR0FBRztBQUFBLFVBQ3pCO0FBQ0EsaUJBQU8sU0FBUyxTQUFVLEtBQUssU0FBUztBQUN0QyxtQkFBTyxPQUFPLE9BQU8sR0FBRyxFQUFFLE9BQU8sT0FBTztBQUFBLFVBQzFDO0FBQ0EsbUJBQVMsSUFBSSxHQUFHLElBQUksYUFBYSxRQUFRLEVBQUUsR0FBRztBQUM1QyxnQkFBSSxPQUFPLGFBQWEsQ0FBQztBQUN6QixtQkFBTyxJQUFJLElBQUksdUJBQXVCLElBQUk7QUFBQSxVQUM1QztBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUVBLGlCQUFTLEtBQUssY0FBYztBQUMxQixjQUFJLGNBQWM7QUFDaEIsbUJBQU8sQ0FBQyxJQUFJLE9BQU8sRUFBRSxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUN6RCxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsSUFDNUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxFQUFFLElBQUksT0FBTyxFQUFFLElBQzlDLE9BQU8sRUFBRSxJQUFJLE9BQU8sRUFBRSxJQUFJLE9BQU8sRUFBRSxJQUFJLE9BQU8sRUFBRSxJQUFJO0FBQ3BELGlCQUFLLFNBQVM7QUFBQSxVQUNoQixPQUFPO0FBQ0wsaUJBQUssU0FBUyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUFBLFVBQ2xFO0FBRUEsZUFBSyxLQUFLO0FBQ1YsZUFBSyxLQUFLO0FBQ1YsZUFBSyxLQUFLO0FBQ1YsZUFBSyxLQUFLO0FBQ1YsZUFBSyxLQUFLO0FBRVYsZUFBSyxRQUFRLEtBQUssUUFBUSxLQUFLLFFBQVEsS0FBSyxTQUFTO0FBQ3JELGVBQUssWUFBWSxLQUFLLFNBQVM7QUFDL0IsZUFBSyxRQUFRO0FBQUEsUUFDZjtBQUVBLGFBQUssVUFBVSxTQUFTLFNBQVUsU0FBUztBQUN6QyxjQUFJLEtBQUssV0FBVztBQUNsQixrQkFBTSxJQUFJLE1BQU0sY0FBYztBQUFBLFVBQ2hDO0FBRUEsY0FBSSxTQUFTLGNBQWMsT0FBTztBQUNsQyxvQkFBVSxPQUFPLENBQUM7QUFDbEIsY0FBSSxXQUFXLE9BQU8sQ0FBQztBQUN2QixjQUFJLE1BQU0sUUFBUSxHQUFHLEdBQUcsU0FBUyxRQUFRLFVBQVUsR0FBR0UsVUFBUyxLQUFLO0FBRXBFLGlCQUFPLFFBQVEsUUFBUTtBQUNyQixnQkFBSSxLQUFLLFFBQVE7QUFDZixtQkFBSyxTQUFTO0FBQ2QsY0FBQUEsUUFBTyxDQUFDLElBQUksS0FBSztBQUNqQixtQkFBSyxRQUFRQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFDMURBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUM1Q0EsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQzlDQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFBSTtBQUFBLFlBQ3REO0FBRUEsZ0JBQUcsVUFBVTtBQUNYLG1CQUFLLElBQUksS0FBSyxPQUFPLFFBQVEsVUFBVSxJQUFJLElBQUksRUFBRSxPQUFPO0FBQ3RELHVCQUFPLFFBQVEsV0FBVyxLQUFLO0FBQy9CLG9CQUFJLE9BQU8sS0FBTTtBQUNmLGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxLQUFLLFFBQVEsTUFBTSxNQUFNLENBQUM7QUFBQSxnQkFDMUMsV0FBVyxPQUFPLE1BQU87QUFDdkIsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUSxTQUFTLE1BQU8sTUFBTSxNQUFNLENBQUM7QUFDekQsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUSxPQUFPLE9BQVUsTUFBTSxNQUFNLENBQUM7QUFBQSxnQkFDNUQsV0FBVyxPQUFPLFNBQVUsUUFBUSxPQUFRO0FBQzFDLGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVEsU0FBUyxPQUFRLE1BQU0sTUFBTSxDQUFDO0FBQzFELGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVMsU0FBUyxJQUFLLE9BQVUsTUFBTSxNQUFNLENBQUM7QUFDbEUsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUSxPQUFPLE9BQVUsTUFBTSxNQUFNLENBQUM7QUFBQSxnQkFDNUQsT0FBTztBQUNMLHlCQUFPLFVBQWEsT0FBTyxTQUFVLEtBQU8sUUFBUSxXQUFXLEVBQUUsS0FBSyxJQUFJO0FBQzFFLGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVEsU0FBUyxPQUFRLE1BQU0sTUFBTSxDQUFDO0FBQzFELGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVMsU0FBUyxLQUFNLE9BQVUsTUFBTSxNQUFNLENBQUM7QUFDbkUsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUyxTQUFTLElBQUssT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUNsRSxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFRLE9BQU8sT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUFBLGdCQUM1RDtBQUFBLGNBQ0Y7QUFBQSxZQUNGLE9BQU87QUFDTCxtQkFBSyxJQUFJLEtBQUssT0FBTyxRQUFRLFVBQVUsSUFBSSxJQUFJLEVBQUUsT0FBTztBQUN0RCxnQkFBQUEsUUFBTyxNQUFNLENBQUMsS0FBSyxRQUFRLEtBQUssS0FBSyxNQUFNLE1BQU0sQ0FBQztBQUFBLGNBQ3BEO0FBQUEsWUFDRjtBQUVBLGlCQUFLLGdCQUFnQjtBQUNyQixpQkFBSyxTQUFTLElBQUksS0FBSztBQUN2QixnQkFBSSxLQUFLLElBQUk7QUFDWCxtQkFBSyxRQUFRQSxRQUFPLEVBQUU7QUFDdEIsbUJBQUssUUFBUSxJQUFJO0FBQ2pCLG1CQUFLLEtBQUs7QUFDVixtQkFBSyxTQUFTO0FBQUEsWUFDaEIsT0FBTztBQUNMLG1CQUFLLFFBQVE7QUFBQSxZQUNmO0FBQUEsVUFDRjtBQUNBLGNBQUksS0FBSyxRQUFRLFlBQVk7QUFDM0IsaUJBQUssVUFBVSxLQUFLLFFBQVEsY0FBYztBQUMxQyxpQkFBSyxRQUFRLEtBQUssUUFBUTtBQUFBLFVBQzVCO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBRUEsYUFBSyxVQUFVLFdBQVcsV0FBWTtBQUNwQyxjQUFJLEtBQUssV0FBVztBQUNsQjtBQUFBLFVBQ0Y7QUFDQSxlQUFLLFlBQVk7QUFDakIsY0FBSUEsVUFBUyxLQUFLLFFBQVEsSUFBSSxLQUFLO0FBQ25DLFVBQUFBLFFBQU8sRUFBRSxJQUFJLEtBQUs7QUFDbEIsVUFBQUEsUUFBTyxNQUFNLENBQUMsS0FBSyxNQUFNLElBQUksQ0FBQztBQUM5QixlQUFLLFFBQVFBLFFBQU8sRUFBRTtBQUN0QixjQUFJLEtBQUssSUFBSTtBQUNYLGdCQUFJLENBQUMsS0FBSyxRQUFRO0FBQ2hCLG1CQUFLLEtBQUs7QUFBQSxZQUNaO0FBQ0EsWUFBQUEsUUFBTyxDQUFDLElBQUksS0FBSztBQUNqQixZQUFBQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFDN0NBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUM1Q0EsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQzlDQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFBSTtBQUFBLFVBQ3REO0FBQ0EsVUFBQUEsUUFBTyxFQUFFLElBQUksS0FBSyxVQUFVLElBQUksS0FBSyxVQUFVO0FBQy9DLFVBQUFBLFFBQU8sRUFBRSxJQUFJLEtBQUssU0FBUztBQUMzQixlQUFLLEtBQUs7QUFBQSxRQUNaO0FBRUEsYUFBSyxVQUFVLE9BQU8sV0FBWTtBQUNoQyxjQUFJLElBQUksS0FBSyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksS0FBSztBQUNqRSxjQUFJLEdBQUcsR0FBRyxHQUFHQSxVQUFTLEtBQUs7QUFFM0IsZUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsR0FBRztBQUN2QixnQkFBSUEsUUFBTyxJQUFJLENBQUMsSUFBSUEsUUFBTyxJQUFJLENBQUMsSUFBSUEsUUFBTyxJQUFJLEVBQUUsSUFBSUEsUUFBTyxJQUFJLEVBQUU7QUFDbEUsWUFBQUEsUUFBTyxDQUFDLElBQU0sS0FBSyxJQUFNLE1BQU07QUFBQSxVQUNqQztBQUVBLGVBQUksSUFBSSxHQUFHLElBQUksSUFBSSxLQUFLLEdBQUc7QUFDekIsZ0JBQUssSUFBSSxJQUFPLENBQUMsSUFBSztBQUN0QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLENBQUMsS0FBSztBQUMxQyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU8sQ0FBQyxJQUFLO0FBQ3RCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUssSUFBSSxJQUFPLENBQUMsSUFBSztBQUN0QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTyxDQUFDLElBQUs7QUFDdEIsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU8sQ0FBQyxJQUFLO0FBQ3RCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFBQSxVQUN6QjtBQUVBLGlCQUFNLElBQUksSUFBSSxLQUFLLEdBQUc7QUFDcEIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxDQUFDLEtBQUs7QUFDMUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUFBLFVBQ3pCO0FBRUEsaUJBQU0sSUFBSSxJQUFJLEtBQUssR0FBRztBQUNwQixnQkFBSyxJQUFJLElBQU0sSUFBSSxJQUFNLElBQUk7QUFDN0IsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxDQUFDLEtBQUs7QUFDMUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUssSUFBSSxJQUFNLElBQUksSUFBTSxJQUFJO0FBQzdCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUssSUFBSSxJQUFNLElBQUksSUFBTSxJQUFJO0FBQzdCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUssSUFBSSxJQUFNLElBQUksSUFBTSxJQUFJO0FBQzdCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUssSUFBSSxJQUFNLElBQUksSUFBTSxJQUFJO0FBQzdCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFBQSxVQUN6QjtBQUVBLGlCQUFNLElBQUksSUFBSSxLQUFLLEdBQUc7QUFDcEIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksWUFBWUEsUUFBTyxDQUFDLEtBQUs7QUFDekMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksWUFBWUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM3QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxZQUFZQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzdDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLFlBQVlBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDN0MsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksWUFBWUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM3QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUFBLFVBQ3pCO0FBRUEsZUFBSyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQ3pCLGVBQUssS0FBSyxLQUFLLEtBQUssS0FBSztBQUN6QixlQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFDekIsZUFBSyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQ3pCLGVBQUssS0FBSyxLQUFLLEtBQUssS0FBSztBQUFBLFFBQzNCO0FBRUEsYUFBSyxVQUFVLE1BQU0sV0FBWTtBQUMvQixlQUFLLFNBQVM7QUFFZCxjQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSztBQUV0RSxpQkFBTyxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJO0FBQUEsUUFDM0Q7QUFFQSxhQUFLLFVBQVUsV0FBVyxLQUFLLFVBQVU7QUFFekMsYUFBSyxVQUFV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
