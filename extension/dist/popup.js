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
    maskNameEnabled: document.getElementById("mask-name-enabled"),
    backendModeEnabled: document.getElementById("backend-mode-enabled"),
    openNhiSection: document.getElementById("open-nhi-section"),
    openNhiBtn: document.getElementById("open-nhi-btn"),
    nhiNeedsLoginSection: document.getElementById("nhi-needs-login-section"),
    nhiReloadBtn: document.getElementById("nhi-reload-btn"),
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
  var NHI_LOGIN_URL = "https://myhealthbank.nhi.gov.tw/IHKE3000/IHKE3095S01";
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
  var _storedIdNo = null;
  var _nhiTabId = null;
  async function loadPatientOverride() {
    const { patientOverride } = await chrome.storage.local.get("patientOverride");
    _storedIdNo = patientOverride?.id_no || null;
    if (patientOverride) {
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
    if (!ov || !ov.name) {
      els.ovSummary.textContent = "\u672A\u8A2D\u5B9A";
      if (card)
        card.dataset.state = "empty";
    } else {
      summaryText = _maybeMask(ov.name);
      els.ovSummary.textContent = `\u2713 ${summaryText}`;
      if (card)
        card.dataset.state = "filled";
    }
    if (els.activePatient && els.activePatientValue) {
      const showActive = _step2Confirmed && !!summaryText;
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
    ov.id_no = prevStored?.id_no || _generateAutoPatientId();
    _storedIdNo = ov.id_no;
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
    setStatus(`\u2705 \u75C5\u4EBA\u8EAB\u4EFD\u5DF2\u8A18\u4F4F\uFF1A${_maybeMask(ov.name)}`, "success");
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
  function _stepNumGlyph(n) {
    return n === 1 ? "\u2460" : n === 2 ? "\u2461" : "\u2462";
  }
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
    const syncRunning = _latestStatus?.running === true;
    els.syncApiBtn.disabled = syncRunning || tooltipReason !== "";
    els.syncApiBtn.title = syncRunning ? "" : tooltipReason;
    if (els.syncBlockedReason) {
      const show = !syncRunning && inlineMsg !== "";
      els.syncBlockedReason.hidden = !show;
      if (show) {
        els.syncBlockedReason.textContent = "";
        const msgEl = document.createElement("span");
        msgEl.className = "cta-reason-msg";
        msgEl.textContent = `\u26A0\uFE0F ${inlineMsg}`;
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
    const haveBackendPatient = _backendPatient.state === "present";
    els.launchBtn.disabled = !(currentMode() === "backend" && _connState === "ok" && !!ov?.id_no && haveBackendPatient);
    els.launchBtn.title = currentMode() !== "backend" ? "\u8ACB\u5207\u5230\u300C\u{1F3E5} \u672C\u6A5F\u5F8C\u7AEF (\u9032\u968E)\u300D\u6A21\u5F0F" : _connState !== "ok" ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : !ov?.id_no ? "\u56DE \u2461 \u60A8\u7684\u8CC7\u6599\uFF1A\u8ACB\u586B\u75C5\u4EBA\u8CC7\u6599" : !haveBackendPatient ? "\u5F8C\u7AEF\u5C1A\u7121\u6B64\u75C5\u4EBA\u8CC7\u6599 \u2014 \u5148\u6309\u300C\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6216\u4E0B\u65B9\u300C\u628A\u672C\u5730\u6A94\u6848\u4E0A\u50B3\u5230\u5F8C\u7AEF\u300D" : "";
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
    els.pushLocalBtn.textContent = "\u628A\u672C\u5730\u6A94\u6848\u4E0A\u50B3\u5230\u5F8C\u7AEF";
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
    if (!_nhiTabId) {
      await chrome.tabs.create({ url: NHI_LOGIN_URL });
      window.close();
      return;
    }
    try {
      await chrome.tabs.update(_nhiTabId, { url: NHI_LOGIN_URL, active: true });
    } catch {
    }
    window.close();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes)
      _refreshLocalBundleState();
  });
  async function loadBackendModeEnabled() {
    const { backendModeEnabled } = await chrome.storage.local.get("backendModeEnabled");
    const enabled = backendModeEnabled === true;
    els.backendModeEnabled.checked = enabled;
    document.body.dataset.backendEnabled = enabled ? "true" : "false";
  }
  els.backendModeEnabled?.addEventListener("change", async () => {
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
      _connState = "unknown";
      _connFailReason = null;
      _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
      _renderConnBanner();
      _renderDataState();
      _refreshButtonStates();
    }
  });
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
    await loadMaskNameEnabled();
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
    _nhiTabId = onNhi ? tab.id : null;
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
        progress: "\u958B\u59CB\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026",
        phase: "starting",
        started: Date.now(),
        ts: Date.now()
      }
    });
    setStatus("\u958B\u59CB\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026", "info");
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
      setStatus("\u9084\u6C92\u6709\u75C5\u4EBA\u8EAB\u5206\u8B49 \u2014 \u8ACB\u5148\u6309\u300C\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6293\u4E00\u6B21", "error");
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
  [els.ovName, els.ovBirthDate, els.ovGender].forEach(
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIwNzQwODY2YCBcdTIxOTIgYFAxMjA3NCoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpKSB7XG4gICAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICAgIHJldHVybiBsb2luYztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKExPSU5DX01BUCkpIHtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrZXkudG9Mb3dlckNhc2UoKSl9YCkudGVzdChjb21iaW5lZCkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tYmluZWQuaW5jbHVkZXMoa2V5LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICByZXR1cm4gbG9pbmM7XG4gICAgfVxuICB9XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQsIG1hc2tOYW1lIH0gZnJvbSBcIkBuaGktZmhpci1icmlkZ2UvbWFwcGVyXCI7XG5cbmNvbnN0IERFRkFVTFRfQkFDS0VORCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDEwXCI7XG4vLyBEZWZhdWx0IFNNQVJUIGFwcCBmb3IgYSBmcmVzaCBpbnN0YWxsLiBVc2VycyBjYW4gb3ZlcnJpZGUgdmlhXG4vLyB0aGUgJ1x1MjY5OVx1RkUwRiBcdTkwMzJcdTk2OEVcdThBMkRcdTVCOUEgXHUyMTkyIFNNQVJUIEFwcCBMYXVuY2ggVVJMJyBmaWVsZDsgdGhlIHZhbHVlIGlzXG4vLyBwZXJzaXN0ZWQgaW4gY2hyb21lLnN0b3JhZ2UubG9jYWwgdW5kZXIgYHNtYXJ0QXBwTGF1bmNoVXJsYC5cbmNvbnN0IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSCA9IFwiaHR0cHM6Ly92b2hvMDAwMC5naXRodWIuaW8vbWVkaWNhbC1ub3RlLXNtYXJ0LW9uLWZoaXIvc21hcnQvbGF1bmNoXCI7XG5cbi8vIFRydWUgaWYgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlIChyZWFsIHNpdGUpLlxuZnVuY3Rpb24gaXNOaGlUYWIodXJsKSB7XG4gIGlmICghdXJsKSByZXR1cm4gZmFsc2U7XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmw7XG4gICAgcmV0dXJuIC9teWhlYWx0aGJhbmtcXC5uaGlcXC5nb3ZcXC50dy8udGVzdCh1Lmhvc3RuYW1lKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IERFRkFVTFRfTU9ERSA9IFwibG9jYWxcIjtcblxuY29uc3QgZWxzID0ge1xuICBtb2RlUmFkaW9zOiAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwic3luYy1tb2RlXCJdJyksXG4gIGJhY2tlbmRVcmw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja2VuZC11cmxcIiksXG4gIHN5bmNBcGlLZXk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGkta2V5XCIpLFxuICBzbWFydEFwcFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbWFydC1hcHAtdXJsXCIpLFxuICBzeW5jQXBpQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN5bmMtYXBpLWJ0blwiKSxcbiAgc3luY0Jsb2NrZWRSZWFzb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1ibG9ja2VkLXJlYXNvblwiKSxcbiAgYXBpU3luY1JhbmdlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwaS1zeW5jLXJhbmdlXCIpLFxuICBzdG9wQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0b3AtYnRuXCIpLFxuICBvdk5hbWU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtbmFtZVwiKSxcbiAgb3ZCaXJ0aERhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtYmlydGgtZGF0ZVwiKSxcbiAgb3ZHZW5kZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtZ2VuZGVyXCIpLFxuICBvdlNhdmVCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Ytc2F2ZS1idG5cIiksXG4gIG92Q2xlYXJCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtY2xlYXItYnRuXCIpLFxuICBvdlN1bW1hcnk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcnJpZGUtc3VtbWFyeVwiKSxcbiAgcGF0aWVudE92ZXJyaWRlRGV0YWlsczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXRpZW50LW92ZXJyaWRlXCIpLFxuICBsYXVuY2hCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGF1bmNoLWJ0blwiKSxcbiAgc3RhdHVzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXR1c1wiKSxcbiAgZGFzaGJvYXJkTGluazogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXNoYm9hcmQtbGlua1wiKSxcbiAgcGVuZGluZ0J1bmRsZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwZW5kaW5nLWJ1bmRsZVwiKSxcbiAgZG93bmxvYWRCdW5kbGVCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZG93bmxvYWQtYnVuZGxlLWJ0blwiKSxcbiAgY2xlYXJCdW5kbGVCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xlYXItYnVuZGxlLWJ0blwiKSxcbiAgLy8gYnVuZGxlTWV0YSBsZWdhY3kgaWQgcmVtb3ZlZCBpbiB0aGUgcGFuZWwtbWVyZ2U7IGZpbGVuYW1lK3NpemUgbm93XG4gIC8vIGxpdmUgaW4gZGVkaWNhdGVkICNidW5kbGUtZmlsZW5hbWUgLyAjYnVuZGxlLXNpemVhZ2UgZWxlbWVudHNcbiAgLy8gYmVsb3cuXG4gIGNvbm5CYW5uZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1iYW5uZXJcIiksXG4gIGNvbm5TZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tc2VjdGlvblwiKSxcbiAgY29ubk1pbmk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1taW5pXCIpLFxuICBjb25uTXNnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tbXNnXCIpLFxuICBjb25uUmV0cnlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1yZXRyeS1idG5cIiksXG4gIGNvbm5IZWxwOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4taGVscFwiKSxcbiAgZGF0YVN0YXRlU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRhLXN0YXRlLXNlY3Rpb25cIiksXG4gIGJhY2tlbmRTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXN0YXRlXCIpLFxuICBsb2NhbFN0YXRlUm93OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvY2FsLXN0YXRlLXJvd1wiKSxcbiAgbG9jYWxTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2NhbC1zdGF0ZVwiKSxcbiAgcHVzaExvY2FsQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB1c2gtbG9jYWwtYnRuXCIpLFxuICBzeW5jU3RhdHVzSGludDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLXN0YXR1cy1oaW50XCIpLFxuICBtYXNrTmFtZUVuYWJsZWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFzay1uYW1lLWVuYWJsZWRcIiksXG4gIGJhY2tlbmRNb2RlRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLW1vZGUtZW5hYmxlZFwiKSxcbiAgb3Blbk5oaVNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1uaGktc2VjdGlvblwiKSxcbiAgb3Blbk5oaUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW5oaS1idG5cIiksXG4gIG5oaU5lZWRzTG9naW5TZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5oaS1uZWVkcy1sb2dpbi1zZWN0aW9uXCIpLFxuICBuaGlSZWxvYWRCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmhpLXJlbG9hZC1idG5cIiksXG4gIGxvZ2luT2tTZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luLW9rLXNlY3Rpb25cIiksXG4gIHdpemFyZFN0ZXBwZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2l6YXJkLXN0ZXBwZXJcIiksXG4gIHJlc3VsdFpvbmU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0LXpvbmVcIiksXG4gIGFjdGl2ZVBhdGllbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWN0aXZlLXBhdGllbnRcIiksXG4gIGFjdGl2ZVBhdGllbnRWYWx1ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY3RpdmUtcGF0aWVudC12YWx1ZVwiKSxcbiAgYnVuZGxlTWV0YUJsb2NrOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1bmRsZS1tZXRhLWJsb2NrXCIpLFxuICBidW5kbGVGaWxlbmFtZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidW5kbGUtZmlsZW5hbWVcIiksXG4gIGJ1bmRsZVNpemVhZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVuZGxlLXNpemVhZ2VcIiksXG59O1xuXG5jb25zdCBOSElfTEFORElORyA9IFwiaHR0cHM6Ly9teWhlYWx0aGJhbmsubmhpLmdvdi50dy9JSEtFMzAwMFwiO1xuLy8gRGlyZWN0IFVSTCBvZiB0aGUgbG9naW4gcGlja2VyIHBhZ2UgKGEgZ2VuZXJpYyBsYW5kaW5nIFx1MjE5MiBsb2dpbiByZWRpcmVjdFxuLy8gaGFwcGVucyBhdXRvbWF0aWNhbGx5IGZvciB1bmF1dGhlbnRpY2F0ZWQgdmlzaXRzLCBidXQgZ29pbmcgc3RyYWlnaHRcbi8vIGhlcmUgYWxzbyBoYW5kbGVzIHVzZXJzIHNpdHRpbmcgb24gYSBwdWJsaWMgc3ViLXBhZ2UgbGlrZSBcdTU1NEZcdTdCNTRcdTVDMDhcdTUzNDBcbi8vIHdoZXJlIGEgcGxhaW4gcmVsb2FkIHdvdWxkIGp1c3QgcmUtcmVuZGVyIHRoZSBzYW1lIHVuLWF1dGggcGFnZSkuXG5jb25zdCBOSElfTE9HSU5fVVJMID0gXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3L0lIS0UzMDAwL0lIS0UzMDk1UzAxXCI7XG5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcblxuLy8gUGVyc2lzdGVkLXN0YXRlIGtleXMuIEJhY2tlbmQgVVJMIGFuZCBBUEkga2V5IHBlcnNpc3QgYWNyb3NzIGJyb3dzZXIgc2Vzc2lvbnMuXG5hc3luYyBmdW5jdGlvbiBsb2FkQmFja2VuZFVybCgpIHtcbiAgY29uc3QgeyBiYWNrZW5kVXJsLCBzeW5jQXBpS2V5LCBzbWFydEFwcExhdW5jaFVybCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFxuICAgIFtcImJhY2tlbmRVcmxcIiwgXCJzeW5jQXBpS2V5XCIsIFwic21hcnRBcHBMYXVuY2hVcmxcIl1cbiAgKTtcbiAgZWxzLmJhY2tlbmRVcmwudmFsdWUgPSBiYWNrZW5kVXJsIHx8IERFRkFVTFRfQkFDS0VORDtcbiAgZWxzLnN5bmNBcGlLZXkudmFsdWUgPSBzeW5jQXBpS2V5IHx8IFwiXCI7XG4gIGVscy5zbWFydEFwcFVybC52YWx1ZSA9IHNtYXJ0QXBwTGF1bmNoVXJsIHx8IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSDtcbiAgZWxzLmRhc2hib2FyZExpbmsuaHJlZiA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnJlcGxhY2UoLzo4MDEwLiokLywgXCI6MzAxMFwiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBhdGllbnQgb3ZlcnJpZGUgKG1hbnVhbCBOSEkgaWRlbnRpdHkpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBkb2Vzbid0IGV4cG9zZSB0aGUgdXNlcidzIG5hdGlvbmFsIElEIGluIHRoZSBVUkwuIFRoZSB1c2VyXG4vLyBmaWxscyB0aGVzZSBvbmNlIGFuZCB0aGV5J3JlIHNlbnQgd2l0aCBldmVyeSB1cGxvYWQgY2FsbCB1bnRpbCBjbGVhcmVkLlxuXG4vLyBpZF9ubyBpcyBubyBsb25nZXIgYSBVSSBmaWVsZCwgc28gZ2V0UGF0aWVudE92ZXJyaWRlKCkgKHN5bmMsIGNhbGxlZFxuLy8gaW4gbWFueSBob3QgcGF0aHMpIGNhbid0IHJlYWQgaXQgZnJvbSB0aGUgZm9ybS4gQ2FjaGUgaXQgaGVyZSBmcm9tXG4vLyBzdG9yYWdlOyBsb2FkUGF0aWVudE92ZXJyaWRlIC8gc2F2ZVBhdGllbnRPdmVycmlkZSAvIGNsZWFyIGtlZXAgaXRcbi8vIGZyZXNoLCBhbmQgYXBwbHlTeW5jU3RhdHVzIHBva2VzIGl0IHdoZW4gYmFja2dyb3VuZCBzd2FwcyB0aGVcbi8vIHBsYWNlaG9sZGVyIGZvciB0aGUgcmVhbCBjaWQuXG5sZXQgX3N0b3JlZElkTm8gPSBudWxsO1xuXG4vLyBOSEkgdGFiIGlkLCBjYXB0dXJlZCBpbiBpbml0KCkgd2hlbiB0aGUgYWN0aXZlIHRhYiBpcyB0aGUgTkhJIHBhZ2UuXG4vLyBVc2VkIGJ5IHRoZSBcIlx1OTFDRFx1NjVCMFx1NjU3NFx1NzQwNlx1OTgwMVx1OTc2MlwiIGJ1dHRvbiBpbiB0aGUgbmVlZHMtbG9naW4gYmFubmVyIHNvIHRoZVxuLy8gdXNlciBkb2Vzbid0IGhhdmUgdG8ga25vdyBGNSAvIHN3aXRjaCB0YWJzIHRoZW1zZWx2ZXMuXG5sZXQgX25oaVRhYklkID0gbnVsbDtcblxuYXN5bmMgZnVuY3Rpb24gbG9hZFBhdGllbnRPdmVycmlkZSgpIHtcbiAgY29uc3QgeyBwYXRpZW50T3ZlcnJpZGUgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInBhdGllbnRPdmVycmlkZVwiKTtcbiAgX3N0b3JlZElkTm8gPSBwYXRpZW50T3ZlcnJpZGU/LmlkX25vIHx8IG51bGw7XG4gIGlmIChwYXRpZW50T3ZlcnJpZGUpIHtcbiAgICBlbHMub3ZOYW1lLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIjtcbiAgICBlbHMub3ZCaXJ0aERhdGUudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuYmlydGhfZGF0ZSB8fCBcIlwiO1xuICAgIGVscy5vdkdlbmRlci52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5nZW5kZXIgfHwgXCJcIjtcbiAgfVxuICAvLyBBIHN0b3JlZCBvdmVycmlkZSB3aXRoIGJvdGggcmVxdWlyZWQgZmllbGRzIGNvdW50cyBhcyBcInN0ZXAgMlxuICAvLyBhbHJlYWR5IGNvbmZpcm1lZFwiIFx1MjAxNCByZXR1cm5pbmcgdXNlciBzaG91bGRuJ3QgYmUgZm9yY2VkIHRvIGNsaWNrXG4gIC8vIFx1MjcxMyBcdTc4QkFcdTVCOUEgYWdhaW4gdG8gYWR2YW5jZSB0aGUgd2l6YXJkLlxuICBfbWFya1N0ZXAyQ29uZmlybWVkKFxuICAgICEhKHBhdGllbnRPdmVycmlkZT8uZ2VuZGVyICYmIHBhdGllbnRPdmVycmlkZT8uYmlydGhfZGF0ZSksXG4gICk7XG4gIC8vIFBhdGllbnQgcGFuZWwgaXMgbm93IGFsd2F5cy1leHBhbmRlZCAoc3RlcCAyIG93bnMgaXRzIG93biBwYWdlKTtcbiAgLy8gdGhlIHByZXZpb3VzIGNvbGxhcHNlLXdoZW4tY29uZmlybWVkIGJlaGF2aW91ciB3YXMgYSBsZWZ0b3ZlciBmcm9tXG4gIC8vIHRoZSBzaW5nbGUtc2Nyb2xsIGxheW91dC5cbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xufVxuXG5mdW5jdGlvbiBnZXRQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIC8vIFJldHVybnMge2lkX25vLCBuYW1lPywgYmlydGhfZGF0ZT8sIGdlbmRlcj99LlxuICAvLyBpZF9ubyBjb21lcyBmcm9tIHRoZSBzdG9yYWdlIGNhY2hlIChfc3RvcmVkSWRObykgc2luY2UgaXQncyBub1xuICAvLyBsb25nZXIgYSBVSSBmaWVsZCBcdTIwMTQgaXQncyBhdXRvLW1pbnRlZCBhdCBzYXZlIHRpbWUgYW5kIHJlcGxhY2VkXG4gIC8vIHdpdGggdGhlIHJlYWwgY2lkIGJ5IGJhY2tncm91bmQncyBOSEkgZmV0Y2ggb24gZmlyc3Qgc3luYy5cbiAgLy8gUmV0dXJucyBudWxsIHdoZW4gbm90aGluZyBpZGVudGlmeWluZyBpcyBmaWxsZWQuXG4gIGNvbnN0IG5hbWUgPSBlbHMub3ZOYW1lLnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgYmlydGhfZGF0ZSA9IGVscy5vdkJpcnRoRGF0ZS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGdlbmRlciA9IGVscy5vdkdlbmRlci52YWx1ZTtcbiAgaWYgKCFfc3RvcmVkSWRObyAmJiAhbmFtZSAmJiAhYmlydGhfZGF0ZSAmJiAhZ2VuZGVyKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgb3V0ID0ge307XG4gIGlmIChfc3RvcmVkSWRObykgb3V0LmlkX25vID0gX3N0b3JlZElkTm87XG4gIGlmIChuYW1lKSBvdXQubmFtZSA9IG5hbWU7XG4gIGlmIChiaXJ0aF9kYXRlKSBvdXQuYmlydGhfZGF0ZSA9IGJpcnRoX2RhdGU7XG4gIGlmIChnZW5kZXIpIG91dC5nZW5kZXIgPSBnZW5kZXI7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIHBhdGllbnQgY2FyZCdzIGJpcnRoLWRhdGUgaW5wdXQuIFJldHVybnMgbnVsbCB3aGVuIE9LLFxuICogb3RoZXJ3aXNlIGEgdXNlci1mYWNpbmcgZXJyb3Igc3RyaW5nLiBSZWFkcyBkaXJlY3RseSBmcm9tIHRoZVxuICogPGlucHV0IHR5cGU9XCJkYXRlXCI+IHNvIHdlIGNhbiBkZXRlY3QgcGFydGlhbC1pbnB1dCBzdGF0ZXMgdGhhdFxuICogQ2hyb21lIHJlcG9ydHMgdGhyb3VnaCBgdmFsaWRpdHkuYmFkSW5wdXRgICh0aGUgaW5wdXQncyBgLnZhbHVlYFxuICogaXMgXCJcIiBpbiB0aGF0IGNhc2UsIGluZGlzdGluZ3Vpc2hhYmxlIGZyb20gXCJibGFua1wiIGJ5IHN0cmluZyBjaGVja1xuICogYWxvbmUgXHUyMDE0IHRoYXQncyB3aHkgdGhlIG9sZCB2ZXJzaW9uIG9mIHRoaXMgZnVuY3Rpb24gbGV0IHBhcnRpYWxcbiAqIHllYXItb25seSBlbnRyaWVzIHNsaXAgdGhyb3VnaCkuXG4gKlxuICogQWxsb3dlZCBzdGF0ZXM6XG4gKiAgIC0gZ2VudWluZWx5IGVtcHR5ICh0aGUgZmllbGQgaXMgb3B0aW9uYWwpXG4gKiAgIC0gZnVsbCBJU08gWVlZWS1NTS1ERCB0aGF0IHJvdW5kLXRyaXBzIHRocm91Z2ggRGF0ZSgpXG4gKiBSZWplY3RlZDpcbiAqICAgLSB5ZWFyLW9ubHkgLyB5ZWFyK21vbnRoOiB0aGUgaW5wdXQgcmVuZGVycyBibGFuayB2YWx1ZSBidXRcbiAqICAgICB2YWxpZGl0eS5iYWRJbnB1dCBpcyB0cnVlXG4gKiAgIC0gZGF0ZXMgaW4gdGhlIGZ1dHVyZVxuICogICAtIGltcGxhdXNpYmx5IG9sZCBkYXRlcyAoeWVhciA8IDE5MDApXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlQmlydGhEYXRlKCkge1xuICBjb25zdCBlbCA9IGVscy5vdkJpcnRoRGF0ZTtcbiAgaWYgKCFlbCkgcmV0dXJuIG51bGw7XG4gIC8vIENocm9tZSdzIG5hdGl2ZSBkYXRlIGlucHV0OiBwYXJ0aWFsIGVudHJ5IChqdXN0IHllYXIsIGp1c3QgeXl5eS1tbSlcbiAgLy8gc3VyZmFjZXMgaGVyZSBldmVuIHRob3VnaCAudmFsdWUgaXMgXCJcIi5cbiAgaWYgKGVsLnZhbGlkaXR5ICYmIGVsLnZhbGlkaXR5LmJhZElucHV0KSB7XG4gICAgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU4QUNCXHU1ODZCXHU1QjhDXHU2NTc0XHU1RTc0XHU2NzA4XHU2NUU1XCI7XG4gIH1cbiAgY29uc3QgcyA9IChlbC52YWx1ZSB8fCBcIlwiKS50cmltKCk7XG4gIC8vIEJpcnRoIGRhdGUgaXMgbm93IHJlcXVpcmVkIFx1MjAxNCBhZ2UgYWZmZWN0cyBldmVyeSByZWZlcmVuY2UgcmFuZ2VcbiAgLy8gYW5kIGFueSBkb3duc3RyZWFtIGFnZS1iYXNlZCBVSTsgZW1wdHkgaW5wdXQgbGV0cyBhIHR5cG8gLyBicm93c2VyXG4gIC8vIHF1aXJrIHNpbGVudGx5IHByb3BhZ2F0ZSBhcyBOYU4uXG4gIGlmICghcykgcmV0dXJuIFwiXHU4QUNCXHU1ODZCXHU3NTFGXHU2NUU1XCI7XG4gIGlmICghL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QocykpIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1OEFDQlx1NTg2Qlx1NUI4Q1x1NjU3NFx1NUU3NFx1NjcwOFx1NjVFNVwiO1xuICBjb25zdCBbeSwgbSwgZF0gPSBzLnNwbGl0KFwiLVwiKS5tYXAoTnVtYmVyKTtcbiAgY29uc3QgZHQgPSBuZXcgRGF0ZShzICsgXCJUMDA6MDA6MDBaXCIpO1xuICBpZiAoXG4gICAgTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkgfHxcbiAgICBkdC5nZXRVVENGdWxsWWVhcigpICE9PSB5IHx8XG4gICAgZHQuZ2V0VVRDTW9udGgoKSArIDEgIT09IG0gfHxcbiAgICBkdC5nZXRVVENEYXRlKCkgIT09IGRcbiAgKSB7XG4gICAgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU0RTBEXHU2NjJGXHU2NzA5XHU2NTQ4XHU2NUU1XHU2NzFGXCI7XG4gIH1cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgaWYgKGR0LmdldFRpbWUoKSA+IG5vdy5nZXRUaW1lKCkpIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1NEUwRFx1ODBGRFx1NjYyRlx1NjcyQVx1NEY4NlwiO1xuICBpZiAoeSA8IDE5MDApIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1NUU3NFx1NEVGRFx1NTkyQVx1NjVFOVx1RkYwQ1x1OEFDQlx1NzhCQVx1OEE4RFwiO1xuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gUmFuZG9tIFwiYXV0by1YWFhYWFhYWFwiIFx1MjAxNCA4IGhleCBjaGFycyBmcm9tIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgc29cbi8vIGV2ZXJ5IGZyZXNoIHBvcHVwIGluc3RhbGwgZ2V0cyBhIGRpZmZlcmVudCBJRCBhbmQgcmUtc3luY3MgYXJlIHN0YWJsZS5cbmZ1bmN0aW9uIF9nZW5lcmF0ZUF1dG9QYXRpZW50SWQoKSB7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICBjb25zdCBoZXggPSBBcnJheS5mcm9tKGJ5dGVzLCAoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgXCIwXCIpKS5qb2luKFwiXCIpO1xuICByZXR1cm4gYGF1dG8tJHtoZXh9YDtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgY2FyZCA9IGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzO1xuICBsZXQgc3VtbWFyeVRleHQgPSBcIlwiO1xuICAvLyBJZGVudGl0eSBzdW1tYXJ5IGlzIG5hbWUtb25seSBub3cuIFRoZSBpZF9ubyBmaWVsZCBpcyBwdXJlbHlcbiAgLy8gaW50ZXJuYWwgKGF1dG8tbWludGVkIG9uIHNhdmUgXHUyMTkyIHN3YXBwZWQgZm9yIHJlYWwgTkhJIGNpZCBvbiBmaXJzdFxuICAvLyBzeW5jKSBhbmQgc2hvd2luZyBpdCB0byB1c2VycyBcdTIwMTQgbWFza2VkIG9yIG90aGVyd2lzZSBcdTIwMTQgd2FzIGp1c3RcbiAgLy8gbm9pc2U6IFx1NkMxMVx1NzczRSBkb24ndCBuZWVkIHRoZWlyIG93biBJRCBlY2hvZWQgYmFjaywgYW5kIHRoZSBhdXRvLVxuICAvLyBwbGFjZWhvbGRlciBzdHJpbmcgKGF1dG8tWFhYWFhYWFgpIGlzIG1lYW5pbmdsZXNzIHRvIHRoZW0uIE5hbWVcbiAgLy8gaXMgcmVxdWlyZWQgYXMgb2YgdGhlIHN0ZXAtMiBwcm9tb3Rpb24sIHNvIHdlIGNhbiByZWx5IG9uIGl0LlxuICBpZiAoIW92IHx8ICFvdi5uYW1lKSB7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2NzJBXHU4QTJEXHU1QjlBXCI7XG4gICAgaWYgKGNhcmQpIGNhcmQuZGF0YXNldC5zdGF0ZSA9IFwiZW1wdHlcIjtcbiAgfSBlbHNlIHtcbiAgICAvLyBOYW1lIGZvbGxvd3MgdGhlIG1hc2sgdG9nZ2xlIChcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjggXHU5ODEwXHU4QTJEXHU5NURDID0gXHU3NzFGXHU1NDBEIC9cbiAgICAvLyBtdWx0aS1wYXRpZW50IGRlbW8gXHU5NThCXHU1NTVGID0gXHU5MDZFXHU3RjY5KS5cbiAgICBzdW1tYXJ5VGV4dCA9IF9tYXliZU1hc2sob3YubmFtZSk7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IGBcdTI3MTMgJHtzdW1tYXJ5VGV4dH1gO1xuICAgIGlmIChjYXJkKSBjYXJkLmRhdGFzZXQuc3RhdGUgPSBcImZpbGxlZFwiO1xuICB9XG4gIC8vIE1pcnJvciBvbnRvIHN0ZXAgMydzIFwiXHU1M0Q2XHU1Rjk3XHU1QzBEXHU4QzYxXCIgYmFubmVyIHNvIHRoZSB1c2VyIGtub3dzIHdob1xuICAvLyB0aGV5J3JlIGFib3V0IHRvIGZldGNoIHdpdGhvdXQgc2Nyb2xsaW5nIGJhY2sgdG8gc3RlcCAyLiBPbmx5XG4gIC8vIHdoZW4gc3RlcCAyIGhhcyBiZWVuIGNvbmZpcm1lZCAod2hpY2ggbm93IGltcGxpZXMgYSBzYXZlZCBuYW1lKS5cbiAgaWYgKGVscy5hY3RpdmVQYXRpZW50ICYmIGVscy5hY3RpdmVQYXRpZW50VmFsdWUpIHtcbiAgICBjb25zdCBzaG93QWN0aXZlID0gX3N0ZXAyQ29uZmlybWVkICYmICEhc3VtbWFyeVRleHQ7XG4gICAgZWxzLmFjdGl2ZVBhdGllbnQuaGlkZGVuID0gIXNob3dBY3RpdmU7XG4gICAgaWYgKHNob3dBY3RpdmUpIGVscy5hY3RpdmVQYXRpZW50VmFsdWUudGV4dENvbnRlbnQgPSBzdW1tYXJ5VGV4dDtcbiAgfVxuICAvLyBCb3RoIGxhdW5jaCArIHN5bmMgZW5hYmxlZCBzdGF0ZSBkZXBlbmQgb24gcGF0aWVudCArIG1vZGUgKyBjb25uLlxuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBDaGFuZ2luZyBwYXRpZW50IElEIGludmFsaWRhdGVzOiAoYSkgYmFja2VuZC1zdGF0ZSBjYWNoZSAobmV3XG4gIC8vIHBhdGllbnQgbWlnaHQgbm90IGJlIG9uIGJhY2tlbmQpOyAoYikgbG9jYWwtYnVuZGxlIHJvdyBpbiB0aGVcbiAgLy8gZGF0YS1zdGF0ZSBjYXJkOyAoYykgdGhlIFx1RDgzRFx1RENFNSBkb3dubG9hZCBidW5kbGUgc2VjdGlvbiwgd2hpY2ggd291bGRcbiAgLy8gb3RoZXJ3aXNlIHN0aWxsIHNob3cgdGhlIHByZXZpb3VzIHBhdGllbnQncyBzdGFzaGVkIGZpbGU7IChkKVxuICAvLyB0aGUgbGFzdCBjb21wbGV0ZWQgc3luYydzIHN1Y2Nlc3MgbWVzc2FnZSwgd2hpY2ggd2FzIHRhZ2dlZCBmb3JcbiAgLy8gdGhlIHByZXZpb3VzIHBhdGllbnQuXG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbiAgX2NsZWFyU3RhbGVTeW5jU3RhdHVzKGdldFBhdGllbnRPdmVycmlkZSgpKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIF9jb25uU3RhdGUgPT09IFwib2tcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xufVxuXG4vLyBEcm9wIGEgXCJcdTI3MDUgXHU1NDBDXHU2QjY1XHU1QjhDXHU2MjEwIFx1MjAyNlwiIHN0YXR1cyBiYW5uZXIgdGhhdCB3YXMgcmVjb3JkZWQgZm9yIGFcbi8vIGRpZmZlcmVudCBwYXRpZW50LiBNaWQtZmxpZ2h0IHN5bmNzIGFyZSBsZWZ0IGFsb25lIChzdGF0dXMucnVubmluZylcbi8vIHNvIHRoZSB1c2VyIGNhbiBzdGlsbCBzZWUgcHJvZ3Jlc3Mgb2YgdGhlIGluLWZsaWdodCBzeW5jLlxuZnVuY3Rpb24gX2NsZWFyU3RhbGVTeW5jU3RhdHVzKG92KSB7XG4gIGlmICghX2xhdGVzdFN0YXR1cykgcmV0dXJuO1xuICBpZiAoX2xhdGVzdFN0YXR1cy5ydW5uaW5nKSByZXR1cm47XG4gIGlmICghX2xhdGVzdFN0YXR1cy5oaXN0bm8pIHJldHVybjtcbiAgaWYgKG92Py5pZF9ubyA9PT0gX2xhdGVzdFN0YXR1cy5oaXN0bm8pIHJldHVybjtcbiAgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG4gIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwic3luY1N0YXR1c1wiKS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIC8vIEdlbmRlciArIGJpcnRoX2RhdGUgKyBuYW1lIGFyZSByZXF1aXJlZC4gaWRfbm8gaXMgdGhlIG9ubHkgb3B0aW9uYWxcbiAgLy8gZmllbGQgXHUyMDE0IGl0J3MgYXV0by1mZXRjaGVkIGZyb20gTkhJIG9uIHN5bmMsIG5ldmVyIHVzZXItZW50ZXJlZC5cbiAgaWYgKCFlbHMub3ZHZW5kZXIudmFsdWUpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU4QUNCXHU5MDc4XHU2NEM3XHU2MDI3XHU1MjI1XCIsIFwiZXJyb3JcIik7XG4gICAgZWxzLm92R2VuZGVyLmZvY3VzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGRvYkVycm9yID0gdmFsaWRhdGVCaXJ0aERhdGUoKTtcbiAgaWYgKGRvYkVycm9yKSB7XG4gICAgc2V0U3RhdHVzKGBcdTI2RDQgJHtkb2JFcnJvcn1gLCBcImVycm9yXCIpO1xuICAgIGVscy5vdkJpcnRoRGF0ZS5mb2N1cygpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWVscy5vdk5hbWUudmFsdWUudHJpbSgpKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1OEFDQlx1NTg2Qlx1NUJFQlx1NTlEM1x1NTQwRFwiLCBcImVycm9yXCIpO1xuICAgIGVscy5vdk5hbWUuZm9jdXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gQnVpbGQgdGhlIG92ZXJyaWRlIGRpcmVjdGx5IHNvIHdlIGRvbid0IGRlcGVuZCBvblxuICAvLyBnZXRQYXRpZW50T3ZlcnJpZGUncyBudWxsLXJldHVybiBcdTIwMTQgdGhlIHJlcXVpcmVkLWZpZWxkIHBhdGggYWJvdmVcbiAgLy8gaGFzIGFscmVhZHkgdmFsaWRhdGVkIHdoYXQgbWF0dGVycy5cbiAgY29uc3Qgb3YgPSB7XG4gICAgbmFtZTogZWxzLm92TmFtZS52YWx1ZS50cmltKCkgfHwgbnVsbCxcbiAgICBiaXJ0aF9kYXRlOiBlbHMub3ZCaXJ0aERhdGUudmFsdWUudHJpbSgpLFxuICAgIGdlbmRlcjogZWxzLm92R2VuZGVyLnZhbHVlLFxuICB9O1xuICBpZiAoIW92Lm5hbWUpIGRlbGV0ZSBvdi5uYW1lO1xuICAvLyBpZF9ubyBpcyBubyBsb25nZXIgYSBVSSBmaWVsZC4gUmV1c2UgdGhlIHByZXZpb3VzbHkgc3RvcmVkXG4gIC8vIHBsYWNlaG9sZGVyIGlmIG9uZSBleGlzdHMgKHNvIHJlLXNhdmVzIGRvbid0IGtlZXAgbWludGluZyBuZXcgSURzXG4gIC8vIGFuZCBvcnBoYW5pbmcgYmFja2VuZCByZXNvdXJjZXMga2V5ZWQgb24gdGhlIG9sZCBvbmUpOyBvdGhlcndpc2VcbiAgLy8gbWludCBhIGZyZXNoIGF1dG8tWFhYWC4gYmFja2dyb3VuZCdzIE5ISSBmZXRjaCBzd2FwcyB0aGlzIGZvciB0aGVcbiAgLy8gcmVhbCBjaWQgb24gZmlyc3Qgc3luYy5cbiAgLy9cbiAgLy8gVGhlIHNhbWUgcmVhZCBhbHNvIGZlZWRzIHRoZSBpZGVudGl0eS1zd2l0Y2ggZGV0ZWN0aW9uIGJlbG93LlxuICBjb25zdCBwcmV2U3RvcmVkID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInBhdGllbnRPdmVycmlkZVwiKSlcbiAgICAucGF0aWVudE92ZXJyaWRlO1xuICBvdi5pZF9ubyA9IHByZXZTdG9yZWQ/LmlkX25vIHx8IF9nZW5lcmF0ZUF1dG9QYXRpZW50SWQoKTtcbiAgX3N0b3JlZElkTm8gPSBvdi5pZF9ubztcblxuICBjb25zdCBwYXRpZW50Q2hhbmdlZCA9XG4gICAgcHJldlN0b3JlZD8uaWRfbm8gJiYgb3YuaWRfbm8gJiYgcHJldlN0b3JlZC5pZF9ubyAhPT0gb3YuaWRfbm87XG5cbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcGF0aWVudE92ZXJyaWRlOiBvdiB9KTtcblxuICBpZiAocGF0aWVudENoYW5nZWQpIHtcbiAgICAvLyAxLiBkcm9wIHRoZSBwcmlvciBsb2NhbCBGSElSIGJ1bmRsZSAoZG93bmxvYWQgYnV0dG9uIGNvbnRlbnQpXG4gICAgLy8gMi4gZHJvcCB0aGUgU1cncyBsYXN0IHN5bmMgc3RhdHVzIHNvIHRoZSByZXN1bHQgem9uZSBkb2Vzbid0XG4gICAgLy8gICAga2VlcCBzaG93aW5nIFwiXHUyNzA1IFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgQSBcdTc2ODQgODEgXHU3QjQ2XHUyMDI2XCJcbiAgICAvLyAzLiBkcm9wIHRoZSBpbi1wb3B1cCBsYXRlc3Qtc3RhdHVzIHNuYXBzaG90XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFBFTkRJTkdfQlVORExFX0tFWSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIGF3YWl0IGNocm9tZS5ydW50aW1lXG4gICAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImNsZWFyU3luY1N0YXR1c1wiIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge30pO1xuICAgIF9sYXRlc3RTdGF0dXMgPSBudWxsO1xuICAgIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgfVxuXG4gIF9tYXJrU3RlcDJDb25maXJtZWQodHJ1ZSk7XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgLy8gU3VjY2Vzc2Z1bCBzYXZlIGlzIFRIRSBpbnRlbnRpb25hbCBzdGVwLTIgY29tcGxldGlvbiBldmVudCBcdTIwMTQgdGhpc1xuICAvLyBpcyB3aGVyZSB0aGUgd2l6YXJkIGlzIGFsbG93ZWQgdG8gYWR2YW5jZSBmb3J3YXJkLlxuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfbWF5YmVBdXRvQWR2YW5jZSgpO1xuICAvLyBNYWtlIGNsZWFyIHRoaXMgaXMgdGhlIGlkZW50aXR5IHNhdmUsIG5vdCBhIG1lZGljYWwtcmVjb3JkIHN5bmMgXHUyMDE0XG4gIC8vIFx1MzAwQ1x1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1MzAwRGFsb25lIHJlYWRzIGFzIFwicGF0aWVudCBkYXRhXCIgKG1lZGljYWwpIGZvciBzb21lIHVzZXJzLlxuICAvLyBpZF9ubyBpbnRlbnRpb25hbGx5IG9taXR0ZWQ6IGl0J3MgYW4gaW50ZXJuYWwga2V5IChhdXRvLVhYWFggb3JcbiAgLy8gdGhlIHJlYWwgY2lkIHN3YXBwZWQgaW4gb24gZmlyc3Qgc3luYyksIHNob3duIGluIG5laXRoZXIgc3VtbWFyeVxuICAvLyBub3IgdG9hc3Qgc2luY2UgdXNlcnMgZG9uJ3QgbmVlZCB0aGVpciBvd24gSUQgZWNob2VkIGJhY2suXG4gIHNldFN0YXR1cyhgXHUyNzA1IFx1NzVDNVx1NEVCQVx1OEVBQlx1NEVGRFx1NURGMlx1OEExOFx1NEY0Rlx1RkYxQSR7X21heWJlTWFzayhvdi5uYW1lKX1gLCBcInN1Y2Nlc3NcIik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNsZWFyUGF0aWVudE92ZXJyaWRlKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoXCJwYXRpZW50T3ZlcnJpZGVcIik7XG4gIF9zdG9yZWRJZE5vID0gbnVsbDtcbiAgZWxzLm92TmFtZS52YWx1ZSA9IFwiXCI7XG4gIGVscy5vdkJpcnRoRGF0ZS52YWx1ZSA9IFwiXCI7XG4gIGVscy5vdkdlbmRlci52YWx1ZSA9IFwiXCI7XG4gIF9tYXJrU3RlcDJDb25maXJtZWQoZmFsc2UpO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIHNldFN0YXR1cyhcIlx1NURGMlx1NkUwNVx1OTY2NFx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiLCBcImluZm9cIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCYWNrZW5kIGNvbm5lY3Rpb24gc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gU2luZ2xlIHNvdXJjZSBvZiB0cnV0aDogYF9jb25uU3RhdGVgIHJlZmxlY3RzIHRoZSBsYXRlc3QgYmFja2VuZFxuLy8gY29ubmVjdGl2aXR5IGNoZWNrLiBCb3RoIHRoZSBiYW5uZXIgVUkgYW5kIHRoZSBlbmFibGVkLXN0YXRlIG9mIHRoZVxuLy8gXHVEODNEXHVEQ0U1IFN5bmMgLyBcdUQ4M0RcdURFODAgTGF1bmNoIGJ1dHRvbnMgcmVhZCBmcm9tIGl0LlxuLy9cbi8vIFN0YXRlczpcbi8vICAgXCJ1bmtub3duXCIgIFx1MjAxNCBub3QgeWV0IGNoZWNrZWQgKGUuZy4gZmlyc3QgcGFpbnQgaW4gbG9jYWwgbW9kZSlcbi8vICAgXCJjaGVja2luZ1wiIFx1MjAxNCBmZXRjaCBpbiBmbGlnaHRcbi8vICAgXCJva1wiICAgICAgIFx1MjAxNCBHRVQgL2ZoaXIvbWV0YWRhdGEgcmV0dXJuZWQgYSBGSElSIENhcGFiaWxpdHlTdGF0ZW1lbnRcbi8vICAgXCJmYWlsXCIgICAgIFx1MjAxNCBhbnl0aGluZyBlbHNlOyBgX2Nvbm5GYWlsUmVhc29uYCBjYXJyaWVzIGRldGFpbFxuLy9cbi8vIEJhY2tlbmQgY29ubmVjdGl2aXR5IGlzIHRyZWF0ZWQgYXMgYSAqcHJlcmVxdWlzaXRlKiBmb3IgYmFja2VuZCBtb2RlLFxuLy8gbm90IGFzIGEgcGVyLWFjdGlvbiBjaGVjay4gU3dpdGNoaW5nIHRvIGJhY2tlbmQgbW9kZSB0cmlnZ2VycyBhIHRlc3Rcbi8vIGltbWVkaWF0ZWx5OyBmYWlsdXJlIHNob3dzIGEgYmFubmVyIHdpdGggYWN0aW9uYWJsZSBndWlkYW5jZSBhbmRcbi8vIGRpc2FibGVzIGJvdGggYWN0aW9uIGJ1dHRvbnMgdW50aWwgY29ubmVjdGl2aXR5IHJlY292ZXJzLlxuXG5sZXQgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiO1xubGV0IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7IC8vIHsga2luZDogXCJuby1wZXJtaXNzaW9uXCIgfCBcIm5vLXVybFwiIHwgXCJuZXR3b3JrXCIgfCBcInRpbWVvdXRcIiB8IFwiaHR0cFwiIHwgXCJub3QtZmhpclwiLCBkZXRhaWw/IH1cblxuLy8gQmFubmVyIGNvcHkuIERyb3AgdGhlIGxlYWRpbmcgXHUyNzE3IFx1MjAxNCB0aGUgcmVkIGRvdCBsZWZ0IG9mIHRoZSB0ZXh0IGlzXG4vLyBhbHJlYWR5IHRoZSBcImZhaWxcIiBzaWduYWwsIGFuZCB0aGUgcm93IHdhcyByZWFkaW5nIFwiXHUyNUNGIFx1MjcxNyBcdTkwMjNcdTRFMERcdTRFMEFcdTVGOENcdTdBRUZcIlxuLy8gPSB0aHJlZSBpbmRpY2F0b3JzIHN0YWNrZWQuXG5jb25zdCBfQ09OTl9MQUJFTFMgPSB7XG4gIHVua25vd246IFwiXHU2NzJBXHU2QUEyXHU2RTJDXCIsXG4gIGNoZWNraW5nOiBcIlx1NkFBMlx1NkUyQ1x1NEUyRFx1MjAyNlwiLFxuICBvazogKCkgPT4gYFx1NURGMlx1OTAyM1x1N0REQSBcdTIwMTQgJHtlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCl9YCxcbiAgZmFpbDogKCkgPT4ge1xuICAgIGNvbnN0IHIgPSBfY29ubkZhaWxSZWFzb24gfHwge307XG4gICAgcmV0dXJuICh7XG4gICAgICBcIm5vLXVybFwiOiBcIlx1NjcyQVx1OEEyRFx1NUI5QSBCYWNrZW5kIFVSTFwiLFxuICAgICAgXCJuby1wZXJtaXNzaW9uXCI6IFwiXHU2NzJBXHU2Mzg4XHU2QjBBXHU5MDIzXHU3RERBXCIsXG4gICAgICBcIm5ldHdvcmtcIjogXCJcdTkwMjNcdTRFMERcdTRFMEFcdTVGOENcdTdBRUZcIixcbiAgICAgIFwidGltZW91dFwiOiBcIlx1OTAyM1x1N0REQVx1OTAzRVx1NjY0MlwiLFxuICAgICAgXCJodHRwXCI6IGBIVFRQICR7ci5kZXRhaWwgfHwgXCJcIn1gLnRyaW0oKSxcbiAgICAgIFwibm90LWZoaXJcIjogXCJcdTU2REVcdTYxQzlcdTRFMERcdTY2MkYgRkhJUlwiLFxuICAgIH0pW3Iua2luZF0gPz8gXCJcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTdcIjtcbiAgfSxcbn07XG5cbmNvbnN0IF9DT05OX0hFTFAgPSB7XG4gIFwibm8tdXJsXCI6ICAgICAgICBcIlx1OEFDQlx1NTIzMFx1MzAwQ1x1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QVx1MzAwRFx1NTg2Qlx1NTE2NSBCYWNrZW5kIFVSTFx1RkYwQ1x1NEY4Qlx1NTk4MiA8Y29kZT5odHRwOi8vbG9jYWxob3N0OjgwMTA8L2NvZGU+XHUzMDAyXCIsXG4gIFwibm8tcGVybWlzc2lvblwiOiBcIkNocm9tZSBcdTk2M0JcdTY0Q0JcdTRFODZcdThERThcdTRGODZcdTZFOTBcdThBQ0JcdTZDNDJcdTMwMDJcdThBQ0JcdTkxQ0RcdTY1QjBcdTk1OEIgcG9wdXBcdUZGMENcdTc1NzZcdTZCMEFcdTk2NTBcdTVDMERcdThBNzFcdTY4NDZcdThERjNcdTUxRkFcdTY2NDJcdTYzMDlcdTMwMENcdTUxNDFcdThBMzFcdTMwMERcdTMwMDJcIixcbiAgXCJuZXR3b3JrXCI6ICAgICAgIFwiXHU1RjhDXHU3QUVGXHU1M0VGXHU4MEZEXHU5MDg0XHU2QzkyXHU1NTVGXHU1MkQ1XHUzMDAyXHU4QUNCXHU1N0Y3XHU4ODRDXHVGRjFBPGJyPjxjb2RlPmRvY2tlciBjb21wb3NlIHVwIC1kPC9jb2RlPjxicj5cdTc4QkFcdThBOEQgYmFja2VuZCBcdTVCQjlcdTU2NjhcdThERDFcdThENzdcdTRGODZcdTUxOERcdTkxQ0RcdThBNjZcdTMwMDJcIixcbiAgXCJ0aW1lb3V0XCI6ICAgICAgIFwiNSBcdTc5RDJcdTUxNjdcdTZDOTJcdTY1MzZcdTUyMzBcdTU2REVcdTYxQzkgXHUyMDE0IGJhY2tlbmQgXHU1M0VGXHU4MEZEXHU5MDg0XHU1NzI4XHU1NTVGXHU1MkQ1XHU0RTJEXHVGRjBDXHU3QjQ5IDMwIFx1NzlEMlx1NTE4RFx1NjMwOVx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcImh0dHBcIjogICAgICAgICAgXCJCYWNrZW5kIFx1NTZERVx1NjFDOVx1OTMyRlx1OEFBNFx1NzJDMFx1NjE0Qlx1NzhCQ1x1MzAwMlx1NkFBMlx1NjdFNSBiYWNrZW5kIFx1NzY4NCBsb2dcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgbG9ncyBiYWNrZW5kPC9jb2RlPlwiLFxuICBcIm5vdC1maGlyXCI6ICAgICAgXCJcdTkwMTlcdTUwMEIgVVJMIFx1NTZERVx1NEU4Nlx1Njc3MVx1ODk3Rlx1RkYwQ1x1NEY0Nlx1NEUwRFx1NjYyRiBGSElSIENhcGFiaWxpdHlTdGF0ZW1lbnRcdTMwMDJcdTc4QkFcdThBOEQgQmFja2VuZCBVUkwgXHU2MzA3XHU1NDExIE5ISS1GSElSLUJyaWRnZSBcdTc2ODQgL2ZoaXIgXHU2ODM5XHU3NkVFXHU5MzA0XHUzMDAyXCIsXG59O1xuXG5mdW5jdGlvbiBfcmVuZGVyQ29ubkJhbm5lcigpIHtcbiAgY29uc3QgYmFubmVyID0gZWxzLmNvbm5CYW5uZXI7XG4gIGlmICghYmFubmVyKSByZXR1cm47XG4gIGJhbm5lci5kYXRhc2V0LnN0YXRlID0gX2Nvbm5TdGF0ZTtcbiAgLy8gTWlycm9yIHN0YXRlIG9udG8gdGhlIG91dGVyIC5jb25uLWJsb2NrIHNvIHRoZSB3cmFwcGVyIGJvcmRlclxuICAvLyAod2hpY2ggaG9sZHMgYmFubmVyICsgaGVscCBib2R5IGluc2lkZSBPTkUgY2FyZCkgdHJhY2tzIHRoZSBzYW1lXG4gIC8vIGNvbG9yIHRoZSBiYW5uZXIgaXMgdXNpbmcuXG4gIGlmIChlbHMuY29ublNlY3Rpb24pIGVscy5jb25uU2VjdGlvbi5kYXRhc2V0LnN0YXRlID0gX2Nvbm5TdGF0ZTtcbiAgY29uc3QgbGFiZWwgPSBfQ09OTl9MQUJFTFNbX2Nvbm5TdGF0ZV07XG4gIGVscy5jb25uTXNnLnRleHRDb250ZW50ID0gdHlwZW9mIGxhYmVsID09PSBcImZ1bmN0aW9uXCIgPyBsYWJlbCgpIDogbGFiZWw7XG4gIGVscy5jb25uUmV0cnlCdG4uaGlkZGVuID0gX2Nvbm5TdGF0ZSAhPT0gXCJmYWlsXCI7XG4gIGlmIChfY29ublN0YXRlID09PSBcImZhaWxcIiAmJiBfY29ubkZhaWxSZWFzb24/LmtpbmQpIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gZmFsc2U7XG4gICAgZWxzLmNvbm5IZWxwLmlubmVySFRNTCA9IF9DT05OX0hFTFBbX2Nvbm5GYWlsUmVhc29uLmtpbmRdID8/IFwiXCI7XG4gIH0gZWxzZSB7XG4gICAgZWxzLmNvbm5IZWxwLmhpZGRlbiA9IHRydWU7XG4gICAgZWxzLmNvbm5IZWxwLmlubmVySFRNTCA9IFwiXCI7XG4gIH1cblxuICAvLyBDb21wYWN0LXBpbGwgdnMgZnVsbC1iYW5uZXIgc3dhcDogd2hlbiBldmVyeXRoaW5nJ3MgZmluZSwgc2hyaW5rIHRvXG4gIC8vIGEgc21hbGwgZ3JlZW4gcGlsbCBpbiB0aGUgaGVhZGVyIHNvIHRoZSBwb3B1cCBib2R5IGhhcyBtb3JlIHJvb21cbiAgLy8gZm9yIGFjdGlvbmFibGUgY29udGVudC4gQW55dGhpbmcgZWxzZSAodW5rbm93biAvIGNoZWNraW5nIC8gZmFpbClcbiAgLy8ga2VlcHMgdGhlIGZ1bGwgYmFubmVyIHNvIHByb2dyZXNzICsgZXJyb3IgaGVscCBoYXMgc3BhY2UgdG8gcmVuZGVyLlxuICBjb25zdCBpc09rID0gX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICBpZiAoZWxzLmNvbm5TZWN0aW9uKSBlbHMuY29ublNlY3Rpb24uaGlkZGVuID0gaXNPaztcbiAgaWYgKGVscy5jb25uTWluaSkge1xuICAgIGVscy5jb25uTWluaS5oaWRkZW4gPSAhaXNPaztcbiAgICBpZiAoaXNPaykgZWxzLmNvbm5NaW5pLnRpdGxlID0gYFx1NURGMlx1OTAyM1x1N0REQSBcdTIwMTQgJHtlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCl9YDtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgMy1zdGVwIHdpemFyZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBDb25jZXB0dWFsbHk6XG4vLyAgIFN0ZXAgMSBcdTIwMTQgXHU3NjdCXHU1MTY1XHVGRjFBb24gTkhJIHRhYiArIHNlc3Npb24gdG9rZW4gaXMgdmFsaWRcbi8vICAgU3RlcCAyIFx1MjAxNCBcdThBMkRcdTVCOUFcdUZGMUFnZW5kZXIgZmlsbGVkICsgKG1vZGU9PWxvY2FsIE9SIGJhY2tlbmQgcmVhY2hhYmxlKVxuLy8gICAgICAgICAgICAgICAgKyBiaXJ0aF9kYXRlIGlmIGVudGVyZWQgbXVzdCBiZSB2YWxpZFxuLy8gICBTdGVwIDMgXHUyMDE0IFx1NTNENlx1NUY5N1x1RkYxQXRoZSBhY3Rpb24gaXRzZWxmIChzeW5jIENUQSwgc3RhdHVzLCByZXN1bHRzKVxuLy9cbi8vIFN0ZXBzIGF1dG8tYWR2YW5jZSB3aGVuIHRoZWlyIHByZWNvbmRpdGlvbiBmbGlwcyBncmVlbjsgdXNlcnMgY2FuXG4vLyBjbGljayB0aGUgc3RlcHBlciB0byByZXZpc2l0IGFueSBzdGVwLiBXZSBuZXZlciBhdXRvLXN0ZXAgQkFDSyBvblxuLy8gc3RhdGUgY2hhbmdlIFx1MjAxNCBvbmNlIHRoZSB1c2VyIGhhcyBtb3ZlZCBmb3J3YXJkLCBvbmx5IGFuIGV4cGxpY2l0XG4vLyBzdGVwcGVyIGNsaWNrIGJyaW5ncyB0aGVtIGJhY2suIE90aGVyd2lzZSBvcGVuaW5nIHRoZSBwb3B1cCBtaWQtXG4vLyBzeW5jIHdvdWxkIGplcmsgdGhlbSBiYWNrIHRvIHN0ZXAgMS5cbmxldCBfYWN0aXZlU3RlcCA9IDE7XG5sZXQgX3dpemFyZEluaXRpYWxpemVkID0gZmFsc2U7XG4vLyBTdGVwIDIgaXMgXCJkb25lXCIgb25seSBhZnRlciB0aGUgdXNlciBoYXMgY2xpY2tlZCBcdTI3MTMgXHU3OEJBXHU1QjlBIHdpdGggdmFsaWRcbi8vIGlucHV0cy4gV2UgdHJhY2sgdGhpcyB3aXRoIGEgYm9vbGVhbiByYXRoZXIgdGhhbiByZWFkaW5nIGxpdmUgRE9NXG4vLyBzdGF0ZSBcdTIwMTQgb3RoZXJ3aXNlIHRoZSB3aXphcmQgd291bGQgYXV0by1hZHZhbmNlIHRoZSBtb21lbnQgdGhlXG4vLyBmaWVsZHMgaGFwcGVuZWQgdG8gbG9vayByaWdodCwgYmVmb3JlIHRoZSB1c2VyIGhhZCBhIGNoYW5jZSB0b1xuLy8gcmV2aWV3LiBGbGlwcGVkIHRydWUgaW4gc2F2ZVBhdGllbnRPdmVycmlkZSBzdWNjZXNzLCBmYWxzZSBpblxuLy8gY2xlYXJQYXRpZW50T3ZlcnJpZGUgYW5kIG9uIGEgbG9hZCB0aGF0IHlpZWxkcyBubyBzYXZlZCByZWNvcmQuXG5sZXQgX3N0ZXAyQ29uZmlybWVkID0gZmFsc2U7XG5cbi8vIFN0ZXAgbnVtYmVyIHJlbmRlcmVkIGFzIGEgY2lyY2xlZCBkaWdpdCBnbHlwaCBcdTIwMTQgbWF0Y2hlcyB0aGVcbi8vIFwiXHU1NkRFIFx1MjQ2MCBcdTc2N0JcdTUxNjVcIiBjb3B5IGVsc2V3aGVyZSBpbiB0aGUgcG9wdXAgYW5kIHRoZSB3aXphcmQgc3RlcHBlciBsYWJlbHMuXG5mdW5jdGlvbiBfc3RlcE51bUdseXBoKG4pIHtcbiAgcmV0dXJuIG4gPT09IDEgPyBcIlx1MjQ2MFwiIDogbiA9PT0gMiA/IFwiXHUyNDYxXCIgOiBcIlx1MjQ2MlwiO1xufVxuXG5mdW5jdGlvbiBfbWFya1N0ZXAyQ29uZmlybWVkKHllcykge1xuICBfc3RlcDJDb25maXJtZWQgPSAhIXllcztcbn1cblxuZnVuY3Rpb24gX2lzU3RlcERvbmUoc3RlcCkge1xuICBjb25zdCBvbk5oaSA9ICFlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgY29uc3QgbG9nZ2VkSW4gPSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluICE9PSBcIm5vXCI7XG4gIHN3aXRjaCAoc3RlcCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBvbk5oaSAmJiBsb2dnZWRJbjtcbiAgICBjYXNlIDI6XG4gICAgICAvLyBDb25maXJtZWQgPSB1c2VyIGNsaWNrZWQgXHUyNzEzIFx1NzhCQVx1NUI5QSBBTkQgdGhlIG92ZXJyaWRlIGlzIGN1cnJlbnRseVxuICAgICAgLy8gdmFsaWQgKHNvIHJldmlzaXRzIHdpdGggYSBub3ctaW52YWxpZCBvdmVycmlkZSBkb24ndCBzaG93IGFcbiAgICAgIC8vIGZhbHNlIGdyZWVuIGNoZWNrKS5cbiAgICAgIHJldHVybiBfc3RlcDJDb25maXJtZWQ7XG4gICAgY2FzZSAzOlxuICAgICAgLy8gU3RlcCAzIGlzIHRoZSB0ZXJtaW5hbCBhY3Rpb24gc3RlcDsgbmV2ZXIgXCJkb25lXCIgZm9yIHByb2dyZXNzXG4gICAgICAvLyBwdXJwb3NlcyAodGhlIHN1Y2Nlc3MgYmFubmVyIGluc2lkZSB0aGUgc3RlcCBpcyB0aGUgaW5kaWNhdG9yKS5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9zZXRBY3RpdmVTdGVwKG4sIG9wdHMgPSB7fSkge1xuICBjb25zdCBjbGFtcGVkID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oMywgbikpO1xuICBfYWN0aXZlU3RlcCA9IGNsYW1wZWQ7XG4gIGRvY3VtZW50LmJvZHkuZGF0YXNldC5hY3RpdmVTdGVwID0gU3RyaW5nKGNsYW1wZWQpO1xuICBfcmVmcmVzaFdpemFyZFVpKCk7XG4gIGlmICghb3B0cy5zaWxlbnQpIHtcbiAgICAvLyBBdXRvLXNjcm9sbCB0aGUgcG9wdXAgdG8gdGhlIHRvcCBvZiB0aGUgc3RlcCBzbyB1c2VycyBhbHdheXNcbiAgICAvLyBzZWUgdGhlIHN0ZXAgaGVhZGVyIC8gZmlyc3QgaW5wdXQgYWZ0ZXIgbmF2aWdhdGlvbi5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IDAsIGJlaGF2aW9yOiBcInNtb290aFwiIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWZyZXNoV2l6YXJkVWkoKSB7XG4gIGlmICghZWxzLndpemFyZFN0ZXBwZXIpIHJldHVybjtcbiAgY29uc3QgbGlzID0gZWxzLndpemFyZFN0ZXBwZXIucXVlcnlTZWxlY3RvckFsbChcImxpW2RhdGEtc3RlcF1cIik7XG4gIGZvciAoY29uc3QgbGkgb2YgbGlzKSB7XG4gICAgY29uc3QgbiA9IE51bWJlcihsaS5kYXRhc2V0LnN0ZXApO1xuICAgIGNvbnN0IGlzQWN0aXZlID0gbiA9PT0gX2FjdGl2ZVN0ZXA7XG4gICAgY29uc3QgaXNEb25lID0gX2lzU3RlcERvbmUobik7XG4gICAgaWYgKGlzQWN0aXZlKSBsaS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWN1cnJlbnRcIiwgXCJ0cnVlXCIpO1xuICAgIGVsc2UgbGkucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIpO1xuICAgIGlmIChpc0RvbmUpIGxpLmRhdGFzZXQuZG9uZSA9IFwidHJ1ZVwiO1xuICAgIGVsc2UgZGVsZXRlIGxpLmRhdGFzZXQuZG9uZTtcbiAgfVxuICAvLyBTdGVwIDEncyB0aHJlZSBzdWItY2FyZHMgKG9mZi1uaGkgLyBuZWVkcy1sb2dpbiAvIGxvZ2luLW9rKSBhcmVcbiAgLy8gbXV0dWFsbHkgZXhjbHVzaXZlIFx1MjAxNCBwaWNrIHRoZSBvbmUgdGhhdCBtYXRjaGVzIGN1cnJlbnQgc3RhdGUuXG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBsb2dnZWRJbiA9IGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW4gIT09IFwibm9cIjtcbiAgaWYgKGVscy5vcGVuTmhpU2VjdGlvbilcbiAgICBlbHMub3Blbk5oaVNlY3Rpb24uaGlkZGVuID0gb25OaGk7XG4gIGlmIChlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24pXG4gICAgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9ICFvbk5oaSB8fCBsb2dnZWRJbjtcbiAgaWYgKGVscy5sb2dpbk9rU2VjdGlvbilcbiAgICBlbHMubG9naW5Pa1NlY3Rpb24uaGlkZGVuID0gIShvbk5oaSAmJiBsb2dnZWRJbik7XG5cbiAgX3JlZnJlc2hSZXN1bHRab25lKCk7XG59XG5cbi8vIFNob3cvaGlkZSBzdGVwLTMgcmVzdWx0IGNhcmRzIGJhc2VkIG9uIHdoZXRoZXIgZWFjaCBoYXMgY29udGVudC5cbi8vIEVtcHR5IGNhcmRzIChlLmcuIGEgc3VtbWFyeSBjYXJkIHdpdGggbm8gc3RhdHVzICsgbm8gZGF0YS1zdGF0ZSBpblxuLy8gbG9jYWwgbW9kZSBwcmUtc3luYykgdXNlZCB0byByZW5kZXIgYXMgYSBibGFuayBzdHJpcGUgXHUyMDE0IG5vdyB0aGV5XG4vLyBzdGF5IGNvbGxhcHNlZCBpbmRpdmlkdWFsbHksIGFuZCB0aGUgd2hvbGUgem9uZSBnb2VzIGF3YXkgd2hlbiBhbGxcbi8vIHRocmVlIGNhcmRzIHdvdWxkIGJlIGVtcHR5LlxuZnVuY3Rpb24gX3JlZnJlc2hSZXN1bHRab25lKCkge1xuICBpZiAoIWVscy5yZXN1bHRab25lKSByZXR1cm47XG4gIGNvbnN0IGhhc1N0YXR1cyA9IChlbHMuc3RhdHVzPy50ZXh0Q29udGVudCA/PyBcIlwiKS50cmltKCkgIT09IFwiXCI7XG4gIGNvbnN0IGRhdGFTdGF0ZVNob3duID1cbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbiAmJiAhZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuO1xuICBjb25zdCBidW5kbGVTaG93biA9XG4gICAgZWxzLnBlbmRpbmdCdW5kbGUgJiYgIWVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbjtcbiAgLy8gTGF1bmNoIGJ1dHRvbiBvbmx5IGNvdW50cyB3aGVuIHVzYWJsZSBcdTIwMTQgYmFja2VuZCBtb2RlICsgdGhlIHBhdGllbnRcbiAgLy8gYWN0dWFsbHkgZXhpc3RzIG9uIHRoZSBiYWNrZW5kIChgbGF1bmNoQnRuLmRpc2FibGVkID09PSBmYWxzZWApLlxuICAvLyBBIHBlcm1hLWRpc2FibGVkIGJ1dHRvbiBzaG91bGRuJ3QgcGluIHRoZSB6b25lIG9wZW4uXG4gIGNvbnN0IGxhdW5jaFVzYWJsZSA9XG4gICAgY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiYgZWxzLmxhdW5jaEJ0biAmJiAhZWxzLmxhdW5jaEJ0bi5kaXNhYmxlZDtcblxuICAvLyBIaWRlIHRoZSBlbnRpcmUgcmVzdWx0IHNlY3Rpb24gKHRoZSBkaXZpZGVyICsgZXZlcnl0aGluZyBhZnRlcikgd2hlblxuICAvLyB0aGVyZSdzIG5vdGhpbmcgbWVhbmluZ2Z1bCB0byBzaG93LlxuICBlbHMucmVzdWx0Wm9uZS5oaWRkZW4gPSAhKGhhc1N0YXR1cyB8fCBidW5kbGVTaG93biB8fCBkYXRhU3RhdGVTaG93biB8fCBsYXVuY2hVc2FibGUpO1xuXG4gIC8vIEJ1bmRsZSBmaWxlbmFtZSAvIHNpemUgYmxvY2sgZm9sbG93cyBidW5kbGUgdmlzaWJpbGl0eS5cbiAgaWYgKGVscy5idW5kbGVNZXRhQmxvY2spIHtcbiAgICBlbHMuYnVuZGxlTWV0YUJsb2NrLmhpZGRlbiA9ICFidW5kbGVTaG93bjtcbiAgfVxuICAvLyBMYXVuY2ggYnV0dG9uIGhpZGUtd2hlbi1ub3QtdXNhYmxlIHNvIHRoZSAubmV4dC1hY3Rpb25zIHJvd1xuICAvLyBkb2Vzbid0IHNob3cgYSBwZXJtYS1kaXNhYmxlZCBvdXRsaW5lIGJ1dHRvbiBuZXh0IHRvIG5vdGhpbmcuXG4gIGlmIChlbHMubGF1bmNoQnRuKSB7XG4gICAgZWxzLmxhdW5jaEJ0bi5oaWRkZW4gPSBjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiB8fCAhbGF1bmNoVXNhYmxlO1xuICB9XG5cbiAgLy8gRGVtb3RlIHRoZSBcdTUzRDZcdTVGOTcgQ1RBIG9uY2Ugd2UgaGF2ZSBhIHJlc3VsdCArIGEgdXNhYmxlIG5leHQtc3RlcFxuICAvLyBhY3Rpb24uIFRoZSBcInByaW1hcnkgYWN0aW9uXCIgYmF0b24gcGFzc2VzIHRvIFx1NEUwQlx1OEYwOSAvIFx1OTU4Qlx1NTU1RiBBcHAgc29cbiAgLy8gdGhlIHVzZXIncyBleWUgbGFuZHMgb24gd2hhdCdzIG5leHQsIG5vdCBvbiBcInJlZG8gdGhlIHRoaW5nXCIuXG4gIGNvbnN0IGhhc1Jlc3VsdEFydGlmYWN0ID0gYnVuZGxlU2hvd24gfHwgbGF1bmNoVXNhYmxlO1xuICBpZiAoZWxzLnN5bmNBcGlCdG4pIHtcbiAgICBjb25zdCBzaG91bGREZW1vdGUgPSBoYXNSZXN1bHRBcnRpZmFjdCAmJiAhZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQ7XG4gICAgZWxzLnN5bmNBcGlCdG4uY2xhc3NMaXN0LnRvZ2dsZShcImlzLXNlY29uZGFyeVwiLCBzaG91bGREZW1vdGUpO1xuICAgIC8vIFJlbGFiZWwgdG8gbWF0Y2ggdGhlIG5ldyByb2xlLiBXaGlsZSB0aGUgc3luYyBpcyBydW5uaW5nIHdlIGtlZXBcbiAgICAvLyB0aGUgcHJvbXB0IG1pZC1yZW5kZXIgdGV4dCBhbG9uZSAoYXBwbHlTeW5jU3RhdHVzIG93bnMgdGhhdCkuXG4gICAgaWYgKCFfbGF0ZXN0U3RhdHVzPy5ydW5uaW5nKSB7XG4gICAgICBlbHMuc3luY0FwaUJ0bi50ZXh0Q29udGVudCA9IHNob3VsZERlbW90ZVxuICAgICAgICA/IFwiXHU5MUNEXHU2NUIwXHU1M0Q2XHU1Rjk3XCJcbiAgICAgICAgOiBcIlx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfbWF5YmVBdXRvQWR2YW5jZSgpIHtcbiAgLy8gT25seSBhZHZhbmNlIGZvcndhcmQsIG5ldmVyIGJhY2suIFNhdmUgdXNlcidzIHBsYWNlIGlmIHRoZXkndmVcbiAgLy8gY2xpY2tlZCBpbnRvIGEgbGF0ZXIgc3RlcCBtYW51YWxseS5cbiAgaWYgKF9hY3RpdmVTdGVwID09PSAxICYmIF9pc1N0ZXBEb25lKDEpKSBfc2V0QWN0aXZlU3RlcCgyKTtcbiAgZWxzZSBpZiAoX2FjdGl2ZVN0ZXAgPT09IDIgJiYgX2lzU3RlcERvbmUoMikpIF9zZXRBY3RpdmVTdGVwKDMpO1xufVxuXG5mdW5jdGlvbiBfaW5pdFdpemFyZCgpIHtcbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgcmV0dXJuO1xuICBfd2l6YXJkSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAvLyBJbml0aWFsIHN0ZXA6IHdoaWNoZXZlciBpcyB0aGUgRklSU1Qgbm90LXlldC1kb25lIHN0ZXAgYXQgcG9wdXAgb3Blbi5cbiAgLy8gRmlyc3QtdGltZSB1c2VyIFx1MjE5MiBzdGVwIDEuIFJldHVybmluZyB1c2VyIHdpdGggdmFsaWQgc2Vzc2lvbiArIHNhdmVkXG4gIC8vIHBhdGllbnQgXHUyMTkyIHN0ZXAgMy5cbiAgY29uc3Qgc3RhcnQgPSBfaXNTdGVwRG9uZSgxKSA/IChfaXNTdGVwRG9uZSgyKSA/IDMgOiAyKSA6IDE7XG4gIF9zZXRBY3RpdmVTdGVwKHN0YXJ0LCB7IHNpbGVudDogdHJ1ZSB9KTtcblxuICAvLyBTdGVwcGVyIGNsaWNrcyBcdTIxOTIganVtcFxuICBmb3IgKGNvbnN0IGxpIG9mIGVscy53aXphcmRTdGVwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVtkYXRhLXN0ZXBdXCIpKSB7XG4gICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IF9zZXRBY3RpdmVTdGVwKE51bWJlcihsaS5kYXRhc2V0LnN0ZXApKSk7XG4gICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiIHx8IGUua2V5ID09PSBcIiBcIikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIF9zZXRBY3RpdmVTdGVwKE51bWJlcihsaS5kYXRhc2V0LnN0ZXApKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaEJ1dHRvblN0YXRlcygpIHtcbiAgLy8gU3luYyBidXR0b24uIENvbmRpdGlvbnMsIGluIHByaW9yaXR5IG9yZGVyOlxuICAvLyAgIDEuIG9uIGFuIE5ISSB0YWJcbiAgLy8gICAyLiBsb2dnZWQgaW4gdG8gTkhJIChkZXRlY3RlZCB2aWEgYmFja2dyb3VuZCBwcmUtZmxpZ2h0KVxuICAvLyAgIDMuIGJhY2tlbmQgbW9kZSBcdTIxOTIgYmFja2VuZCBjb25uZWN0ZWRcbiAgLy8gICA0LiBnZW5kZXIgZmlsbGVkIChvdGhlciBwYXRpZW50IGZpZWxkcyBhbGwgb3B0aW9uYWwpXG4gIC8vIFdoYXRldmVyIGJsb2NrcyB0aGUgQ1RBIGFsc28gZ2V0cyBzdXJmYWNlZCBhcyBhbiBpbmxpbmUgbWVzc2FnZVxuICAvLyBiZWxvdyB0aGUgYnV0dG9uIFx1MjAxNCB0b29sdGlwcyBhcmUgaW52aXNpYmxlIGluIHRoZSAzNjBweCBwb3B1cC5cbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBjb25zdCBtb2RlT2sgPSBjdXJyZW50TW9kZSgpID09PSBcImxvY2FsXCIgfHwgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICAvLyBTdGVwIDIgaGFyZCByZXF1aXJlbWVudHM6IGdlbmRlciwgYmlydGhfZGF0ZSAodmFsaWQpLCBhbmQgbmFtZS5cbiAgLy8gVHJhY2tlZCBhcyBvbmUgcm9sbGVkLXVwIGZsYWcgc28gdGhlIGJsb2NrZWQtQ1RBIHN0cmlwIHNheXNcbiAgLy8gXCJjb21wbGV0ZSB0aGUgYmFzaWMgaW5mb1wiIGdlbmVyaWNhbGx5IHJlZ2FyZGxlc3Mgb2Ygd2hpY2ggZmllbGRcbiAgLy8gaXMgbWlzc2luZyBmaXJzdC5cbiAgY29uc3Qgc3RlcDJCYXNpY09rID0gISFlbHMub3ZHZW5kZXI/LnZhbHVlICYmICEhZWxzLm92TmFtZT8udmFsdWU/LnRyaW0oKTtcbiAgY29uc3QgZG9iRXJyb3IgPSB2YWxpZGF0ZUJpcnRoRGF0ZSgpO1xuXG4gIC8vIEVhY2ggYmxvY2tpbmcgcmVhc29uIG5hbWVzIHRoZSBzdGVwIHRoYXQgbmVlZHMgYXR0ZW50aW9uLiBNb2RlICtcbiAgLy8gY29ubmVjdGlvbiBub3cgbGl2ZSBpbiBzdGVwIDMgYWxvbmdzaWRlIHRoZSBDVEEgaXRzZWxmLCBzbyB0aG9zZVxuICAvLyByZWFzb25zIHJlZmVyZW5jZSB3aGF0J3MgZGlyZWN0bHkgYWJvdmUgdGhlIGJ1dHRvbiByYXRoZXIgdGhhblxuICAvLyBzZW5kaW5nIHRoZSB1c2VyIGJhY2sgdGhyb3VnaCB0aGUgc3RlcHBlci5cbiAgLy9cbiAgLy8gRVhDRVBUIHRoZSBjb25uLWZhaWxlZCBjYXNlOiB0aGUgY29ubiBiYW5uZXIgZGlyZWN0bHkgYWJvdmUgdGhlXG4gIC8vIENUQSBhbHJlYWR5IHNob3V0cyBcIlx1MjcxNyBcdTkwMjNcdTRFMERcdTRFMEFcdTVGOENcdTdBRUZcIiArIHJldHJ5IGJ1dHRvbiArIGhlbHAuIEFkZGluZ1xuICAvLyBhbm90aGVyIGlubGluZSBzdHJpcCBqdXN0IHRvIHJlcGVhdCB0aGUgc2FtZSBmYWN0ICh3aXRoIGEgc2xpZ2h0bHlcbiAgLy8gbG9uZ2VyIHNlbnRlbmNlKSBpcyBub2lzZSBcdTIwMTQgc2lsZW50bHkgZGlzYWJsZSB0aGUgQ1RBIGluc3RlYWQsIHdpdGhcbiAgLy8gYSB0b29sdGlwIGV4cGxhbmF0aW9uLiBpbmxpbmVSZWFzb24gaXMgd2hhdCBzaG93cyBpbiB0aGUgd2FybmluZ1xuICAvLyBzdHJpcDsgdG9vbHRpcFJlYXNvbiBpcyB3aGF0IHRoZSBkaXNhYmxlZCBidXR0b24gYWR2ZXJ0aXNlcyBvbiBob3Zlci5cbiAgLy8gUmVhc29uIGZvciBibG9ja2VkIENUQS4gaW5saW5lTXNnIHJlbmRlcnMgaW4gdGhlIHdhcm5pbmcgc3RyaXA7XG4gIC8vIHRvb2x0aXAgaXMgd2hhdCB0aGUgZGlzYWJsZWQgYnV0dG9uIGFkdmVydGlzZXMgb24gaG92ZXI7IGp1bXBUb1xuICAvLyAod2hlbiBzZXQpIG1ha2VzIHRoZSBzdHJpcCBhIGNsaWNrYWJsZSBzaG9ydGN1dCBiYWNrIHRvIHRoYXQgc3RlcC5cbiAgbGV0IGlubGluZU1zZyA9IFwiXCI7XG4gIGxldCBqdW1wVG8gPSBudWxsOyAgICAgICAvLyB7IHN0ZXA6IDF8MiwgbGFiZWw6IFwiXHU3NjdCXHU1MTY1XCIgfCBcIlx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVwiIH1cbiAgbGV0IHRvb2x0aXBSZWFzb24gPSBcIlwiO1xuICBpZiAoIW9uTmhpKSB7XG4gICAgaW5saW5lTXNnID0gXCJcdThBQ0JcdTUyMDdcdTUyMzBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTUyMDZcdTk4MDFcIjtcbiAgICBqdW1wVG8gPSB7IHN0ZXA6IDEsIGxhYmVsOiBcIlx1NzY3Qlx1NTE2NVwiIH07XG4gIH0gZWxzZSBpZiAoIWxvZ2dlZEluKSB7XG4gICAgaW5saW5lTXNnID0gXCJcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTUyMDZcdTk4MDFcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcIjtcbiAgICBqdW1wVG8gPSB7IHN0ZXA6IDEsIGxhYmVsOiBcIlx1NzY3Qlx1NTE2NVwiIH07XG4gIH0gZWxzZSBpZiAoIXN0ZXAyQmFzaWNPaykge1xuICAgIC8vIERvbid0IGVudW1lcmF0ZSB3aGljaCBmaWVsZCBpcyBtaXNzaW5nIFx1MjAxNCB0aGVyZSBjb3VsZCBiZSBtb3JlXG4gICAgLy8gdGhhbiBvbmUgKGdlbmRlciwgbmFtZSwgYm90aCksIGFuZCBzdGVwIDIgYWxyZWFkeSBtYXJrcyBlYWNoXG4gICAgLy8gcmVxdWlyZWQgZmllbGQgd2l0aCBhIHJlZCAqIHRoZSB1c2VyIHdpbGwgc2VlIGFmdGVyIHRoZSBvbmUtXG4gICAgLy8gY2xpY2sganVtcC4gS2VlcCB0aGUgbWVzc2FnZSBhYm91dCB0aGUgaGlnaC1sZXZlbCBhY3Rpb25cbiAgICAvLyAoY29tcGxldGUgKyBjb25maXJtKS5cbiAgICBpbmxpbmVNc2cgPSBcIlx1OEFDQlx1NUI4Q1x1NjIxMFx1NTdGQVx1NjcyQ1x1OENDN1x1NjU5OVx1NEUyNlx1NjMwOVx1NzhCQVx1NUI5QVwiO1xuICAgIGp1bXBUbyA9IHsgc3RlcDogMiwgbGFiZWw6IFwiXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XCIgfTtcbiAgfSBlbHNlIGlmIChkb2JFcnJvcikge1xuICAgIGlubGluZU1zZyA9IGRvYkVycm9yO1xuICAgIGp1bXBUbyA9IHsgc3RlcDogMiwgbGFiZWw6IFwiXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XCIgfTtcbiAgfSBlbHNlIGlmICghbW9kZU9rKSB7XG4gICAgaW5saW5lTXNnID0gXCJcIjsgICAgICAgICAgICAgICAgIC8vIGNvbm4gYmFubmVyIGFib3ZlIGNhcnJpZXMgdGhlIG1lc3NhZ2VcbiAgICB0b29sdGlwUmVhc29uID0gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIjtcbiAgfVxuICBpZiAoanVtcFRvKSB0b29sdGlwUmVhc29uID0gYFx1NTZERSAke19zdGVwTnVtR2x5cGgoanVtcFRvLnN0ZXApfSAke2p1bXBUby5sYWJlbH1cdUZGMUEke2lubGluZU1zZ31gO1xuXG4gIC8vIERvbid0IGZsaXAgdGhlIENUQSBiYWNrIHRvIGVuYWJsZWQgaWYgYSBzeW5jIGlzIGN1cnJlbnRseSBydW5uaW5nXG4gIC8vIFx1MjAxNCB0aGUgU1cgdXBkYXRlcyBgcGF0aWVudE92ZXJyaWRlYCBtaWQtc3luYyAoYXV0by1mZXRjaGVkIGNpZCksXG4gIC8vIHdoaWNoIHRyaWdnZXJzIHN0b3JhZ2Uub25DaGFuZ2VkIFx1MjE5MiBsb2FkUGF0aWVudE92ZXJyaWRlIFx1MjE5MlxuICAvLyBfcmVmcmVzaEJ1dHRvblN0YXRlcy4gV2l0aG91dCB0aGlzIGd1YXJkIHRoZSBidXR0b24gd291bGQgcmUtZW5hYmxlXG4gIC8vIGhhbGZ3YXkgdGhyb3VnaCBhIHN5bmMgYW5kIHRoZSB1c2VyIGNvdWxkIGNsaWNrIGl0IGFnYWluLlxuICBjb25zdCBzeW5jUnVubmluZyA9IF9sYXRlc3RTdGF0dXM/LnJ1bm5pbmcgPT09IHRydWU7XG4gIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gc3luY1J1bm5pbmcgfHwgdG9vbHRpcFJlYXNvbiAhPT0gXCJcIjtcbiAgZWxzLnN5bmNBcGlCdG4udGl0bGUgPSBzeW5jUnVubmluZyA/IFwiXCIgOiB0b29sdGlwUmVhc29uO1xuICBpZiAoZWxzLnN5bmNCbG9ja2VkUmVhc29uKSB7XG4gICAgY29uc3Qgc2hvdyA9ICFzeW5jUnVubmluZyAmJiBpbmxpbmVNc2cgIT09IFwiXCI7XG4gICAgZWxzLnN5bmNCbG9ja2VkUmVhc29uLmhpZGRlbiA9ICFzaG93O1xuICAgIGlmIChzaG93KSB7XG4gICAgICAvLyBCdWlsZCB0aGUgc3RyaXAncyBjb250ZW50OiBcIlx1MjZBMCB7bXNnfSAgICBcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NSBcdTIxOTJcIiBzbyB0aGVcbiAgICAgIC8vIHVzZXIgc2VlcyBib3RoIHRoZSByZWFzb24gYW5kIHdoZXJlIHRoZSBjbGljayB3aWxsIHRha2UgdGhlbS5cbiAgICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICBjb25zdCBtc2dFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgbXNnRWwuY2xhc3NOYW1lID0gXCJjdGEtcmVhc29uLW1zZ1wiO1xuICAgICAgbXNnRWwudGV4dENvbnRlbnQgPSBgXHUyNkEwXHVGRTBGICR7aW5saW5lTXNnfWA7XG4gICAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24uYXBwZW5kQ2hpbGQobXNnRWwpO1xuICAgICAgaWYgKGp1bXBUbykge1xuICAgICAgICBjb25zdCBqdW1wRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAganVtcEVsLmNsYXNzTmFtZSA9IFwiY3RhLXJlYXNvbi1qdW1wXCI7XG4gICAgICAgIGp1bXBFbC50ZXh0Q29udGVudCA9IGBcdTU2REUgJHtfc3RlcE51bUdseXBoKGp1bXBUby5zdGVwKX0gJHtqdW1wVG8ubGFiZWx9IFx1MjE5MmA7XG4gICAgICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi5hcHBlbmRDaGlsZChqdW1wRWwpO1xuICAgICAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24uZGF0YXNldC50YXJnZXRTdGVwID0gU3RyaW5nKGp1bXBUby5zdGVwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBlbHMuc3luY0Jsb2NrZWRSZWFzb24uZGF0YXNldC50YXJnZXRTdGVwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBNaXJyb3IgdGhlIHN0b3AtYnV0dG9uIHZpc2liaWxpdHkgc28gdGhlIHVzZXIgY2FuIGFsd2F5cyBjYW5jZWxcbiAgLy8gbWlkLXN5bmMgZXZlbiBpZiB0aGUgcG9wdXAgcmUtcmVuZGVycyBkdWUgdG8gb25DaGFuZ2VkLlxuICBpZiAoZWxzLnN0b3BCdG4pIGVscy5zdG9wQnRuLmhpZGRlbiA9ICFzeW5jUnVubmluZztcblxuICAvLyBMYXVuY2ggYnV0dG9uOiBiYWNrZW5kIG1vZGUgKyBjb25uIG9rICsgcGF0aWVudCBzZXQgKyBiYWNrZW5kXG4gIC8vIGFjdHVhbGx5IGhhcyB0aGlzIHBhdGllbnQgKG90aGVyd2lzZSB0aGUgU01BUlQgYXBwIGxhdW5jaGVzIGludG9cbiAgLy8gYW4gZW1wdHkgRkhJUiBzdG9yZSBcdTIwMTQgY29uZnVzaW5nIGJsYW5rIHNjcmVlbikuXG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGNvbnN0IGhhdmVCYWNrZW5kUGF0aWVudCA9IF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCI7XG4gIGVscy5sYXVuY2hCdG4uZGlzYWJsZWQgPSAhKFxuICAgIGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmXG4gICAgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiICYmXG4gICAgISFvdj8uaWRfbm8gJiZcbiAgICBoYXZlQmFja2VuZFBhdGllbnRcbiAgKTtcbiAgZWxzLmxhdW5jaEJ0bi50aXRsZSA9XG4gICAgY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgID8gXCJcdThBQ0JcdTUyMDdcdTUyMzBcdTMwMENcdUQ4M0NcdURGRTUgXHU2NzJDXHU2QTVGXHU1RjhDXHU3QUVGIChcdTkwMzJcdTk2OEUpXHUzMDBEXHU2QTIxXHU1RjBGXCIgOlxuICAgIF9jb25uU3RhdGUgIT09IFwib2tcIiAgICAgICAgICAgPyBcIlx1NUY4Q1x1N0FFRlx1NUMxQVx1NjcyQVx1OTAyM1x1N0REQVwiIDpcbiAgICAhb3Y/LmlkX25vICAgICAgICAgICAgICAgICAgICA/IFwiXHU1NkRFIFx1MjQ2MSBcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcdUZGMUFcdThBQ0JcdTU4NkJcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIiA6XG4gICAgIWhhdmVCYWNrZW5kUGF0aWVudCAgICAgICAgICAgPyBcIlx1NUY4Q1x1N0FFRlx1NUMxQVx1NzEyMVx1NkI2NFx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OSBcdTIwMTQgXHU1MTQ4XHU2MzA5XHUzMDBDXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUzMDBEXHU2MjE2XHU0RTBCXHU2NUI5XHUzMDBDXHU2MjhBXHU2NzJDXHU1NzMwXHU2QTk0XHU2ODQ4XHU0RTBBXHU1MEIzXHU1MjMwXHU1RjhDXHU3QUVGXHUzMDBEXCIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIjtcblxuICAvLyBSZWZyZXNoIHRoZSBzdGVwcGVyIFVJIG9uIGV2ZXJ5IHN0YXRlIGNoYW5nZSwgYnV0IERPTidUIGF1dG8tXG4gIC8vIGFkdmFuY2UgZnJvbSBoZXJlIFx1MjAxNCBpbmNpZGVudGFsIGlucHV0IGNoYW5nZXMgKHR5cGluZyBpbiBhIGZpZWxkXG4gIC8vIHdoaWxlIHJldmlzaXRpbmcgc3RlcCAyKSBzaG91bGRuJ3QgeWFuayB0aGUgdXNlciBmb3J3YXJkLiBBdXRvLVxuICAvLyBhZHZhbmNlIGlzIG9ubHkgZmlyZWQgZnJvbSB0aGUgZXZlbnRzIHRoYXQgc2lnbmFsIGludGVudDpcbiAgLy8gICAtIGxvZ2luIHByb2JlIGZsaXBwaW5nIHRvIHRydWUgXHUyMTkyIGZvcndhcmQgaW50byBzdGVwIDJcbiAgLy8gICAtIHNhdmVQYXRpZW50T3ZlcnJpZGUgc3VjY2VzcyBcdTIxOTIgZm9yd2FyZCBpbnRvIHN0ZXAgM1xuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFdpemFyZFVpKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpIHtcbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpO1xuICBpZiAoIXVybCkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vLXVybFwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG4gIF9jb25uU3RhdGUgPSBcImNoZWNraW5nXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG5cbiAgY29uc3QgcGVybSA9IGF3YWl0IGVuc3VyZUJhY2tlbmRQZXJtaXNzaW9uKHVybCk7XG4gIGlmICghcGVybS5vaykge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vLXBlcm1pc3Npb25cIiB9O1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7IHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGN0cmwgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBjdHJsLmFib3J0KCksIDUwMDApO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3VybC5yZXBsYWNlKC9cXC8kLywgXCJcIil9L2ZoaXIvbWV0YWRhdGFgLCB7IHNpZ25hbDogY3RybC5zaWduYWwgfSk7XG4gICAgaWYgKCFyZXMub2spIHtcbiAgICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcImh0dHBcIiwgZGV0YWlsOiByZXMuc3RhdHVzIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXMuanNvbigpLmNhdGNoKCgpID0+IG51bGwpO1xuICAgICAgaWYgKGJvZHk/LnJlc291cmNlVHlwZSAhPT0gXCJDYXBhYmlsaXR5U3RhdGVtZW50XCIpIHtcbiAgICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm90LWZoaXJcIiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2Nvbm5TdGF0ZSA9IFwib2tcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7XG4gICAgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0XCIgOiBcIm5ldHdvcmtcIiB9O1xuICB9IGZpbmFsbHkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gIH1cblxuICBfcmVuZGVyQ29ubkJhbm5lcigpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBXaGVuZXZlciBjb25uZWN0aXZpdHkgZmxpcHMsIHJlLWNoZWNrIHdoZXRoZXIgdGhpcyBwYXRpZW50IGFscmVhZHlcbiAgLy8gZXhpc3RzIG9uIGJhY2tlbmQuIChTdGFsZSBcIl9iYWNrZW5kUGF0aWVudFwiIHN0YXRlIHdvdWxkIG90aGVyd2lzZVxuICAvLyBjYXVzZSBMYXVuY2ggdG8gbG9vayBlbmFibGVkIC8gZGlzYWJsZWQgd3JvbmdseS4pXG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICByZXR1cm4gX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xufVxuXG5lbHMuY29ublJldHJ5QnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGVzdEJhY2tlbmRDb25uZWN0aW9uKTtcblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgXHUyMTk0IGxvY2FsIGRhdGEtc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gSW5kZXBlbmRlbnQgb2YgdGhlIGNvbm5lY3Rpb24gYmFubmVyICh3aGljaCBvbmx5IHRlbGxzIHVzIFwiY2FuIHdlXG4vLyByZWFjaCB0aGUgYmFja2VuZFwiKS4gVGhpcyBjYXJkIGFuc3dlcnMgdHdvIHF1ZXN0aW9uczpcbi8vXG4vLyAgIDEuIERvZXMgdGhlIGJhY2tlbmQgYWxyZWFkeSBoYXZlIHRoaXMgcGF0aWVudCdzIGRhdGE/XG4vLyAgICAgIFx1MjE5MiBkcml2ZXMgd2hldGhlciBcdUQ4M0RcdURFODAgTGF1bmNoIGlzIGFsbG93ZWQgYXQgYWxsIChMYXVuY2ggb24gYW5cbi8vICAgICAgICBlbXB0eSBiYWNrZW5kIGdpdmVzIGEgY29uZnVzaW5nIFNNQVJULWFwcCBibGFuaykuXG4vLyAgIDIuIERvZXMgdGhlIHVzZXIgaGF2ZSBhIGxvY2FsIEJ1bmRsZSB0aGF0J3MgbmV3ZXIgdGhhbiB0aGVcbi8vICAgICAgYmFja2VuZCdzIHZpZXc/XG4vLyAgICAgIFx1MjE5MiBvZmZlciBcIlx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlIFx1NTIzMFx1NUY4Q1x1N0FFRlwiIHRvIHB1c2ggaXQgdmlhIC9maGlyL2ltcG9ydFxuLy8gICAgICAgIHdpdGhvdXQgcmUtZmV0Y2hpbmcgTkhJIChmYXN0LCBub24tZGVzdHJ1Y3RpdmU6IHN0YWJsZSBJRHNcbi8vICAgICAgICB1cHNlcnQgc28gYmFja2VuZCByZXNvdXJjZXMganVzdCBidW1wIHZlcnNpb25JZCkuXG4vL1xuLy8gV2UgZG9uJ3Qgc2Vjb25kLWd1ZXNzIHRoZSB1c2VyOiBldmVuIHdoZW4gbG9jYWwgaXMgY2xlYXJseSBuZXdlcixcbi8vIExhdW5jaCBzdGF5cyBlbmFibGVkIGlmIHRoZSBiYWNrZW5kIGhhcyB0aGUgcGF0aWVudCBcdTIwMTQgdGhleSBtYXlcbi8vIGdlbnVpbmVseSB3YW50IHRvIGxvb2sgYXQgdGhlIG9sZGVyIHN0YXRlLiBUaGUgVUkgbGF5cyBvdXQgYm90aFxuLy8gc2lkZXM7IHVzZXIgZGVjaWRlcy5cblxubGV0IF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbi8vICAgc3RhdGU6IFwidW5rbm93blwiIHwgXCJjaGVja2luZ1wiIHwgXCJhYnNlbnRcIiB8IFwicHJlc2VudFwiIHwgXCJmYWlsXCJcbmxldCBfbG9jYWxCdW5kbGUgPSB7IGV4aXN0czogZmFsc2UsIGNvdW50OiAwLCBnZW5lcmF0ZWRBdDogMCwgcGF0aWVudElkOiBudWxsIH07XG5cbmZ1bmN0aW9uIF9mbXRUaW1lU2hvcnQoaXNvKSB7XG4gIGlmICghaXNvKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XG4gIGlmIChOdW1iZXIuaXNOYU4oZC5nZXRUaW1lKCkpKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gIHJldHVybiBgJHtkLmdldE1vbnRoKCkgKyAxfS8ke2QuZ2V0RGF0ZSgpfSAke3BhZChkLmdldEhvdXJzKCkpfToke3BhZChkLmdldE1pbnV0ZXMoKSl9YDtcbn1cblxuZnVuY3Rpb24gX2ZtdFJlbGF0aXZlKG1zKSB7XG4gIGNvbnN0IGRpZmYgPSBEYXRlLm5vdygpIC0gbXM7XG4gIGlmIChkaWZmIDwgNjBfMDAwKSByZXR1cm4gYCR7TWF0aC5tYXgoMSwgTWF0aC5yb3VuZChkaWZmIC8gMTAwMCkpfSBcdTc5RDJcdTUyNERgO1xuICBpZiAoZGlmZiA8IDM2MDBfMDAwKSByZXR1cm4gYCR7TWF0aC5yb3VuZChkaWZmIC8gNjBfMDAwKX0gXHU1MjA2XHU5NDE4XHU1MjREYDtcbiAgaWYgKGRpZmYgPCA4Nl80MDBfMDAwKSByZXR1cm4gYCR7TWF0aC5yb3VuZChkaWZmIC8gMzYwMF8wMDApfSBcdTVDMEZcdTY2NDJcdTUyNERgO1xuICByZXR1cm4gX2ZtdFRpbWVTaG9ydChuZXcgRGF0ZShtcykudG9JU09TdHJpbmcoKSk7XG59XG5cbmZ1bmN0aW9uIF9yZW5kZXJEYXRhU3RhdGUoKSB7XG4gIC8vIFNlY3Rpb24gb25seSB2aXNpYmxlIGluIGJhY2tlbmQgbW9kZSAoaGFuZGxlZCBieSAuYmFja2VuZC1vbmx5IENTUyksXG4gIC8vIGJ1dCB3ZSBhbHNvIGV4cGxpY2l0bHkgaGlkZSB3aGVuIHRoZSBwb3B1cCBoYXMgbm8gcGF0aWVudF9vdmVycmlkZVxuICAvLyBzZXQsIHNpbmNlIGJvdGggY2hlY2tzIGtleSBvZmYgcGF0aWVudF9pZC5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiIHx8ICFvdj8uaWRfbm8pIHtcbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChlbHMuc3luY1N0YXR1c0hpbnQpIGVscy5zeW5jU3RhdHVzSGludC5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENhcmQgc2VydmVzIGFzIGFuIGFsZXJ0LCBub3QgYSBkYXNoYm9hcmQgXHUyMDE0IHNob3cgb25seSB3aGVuIHRoZXJlJ3NcbiAgLy8gc29tZXRoaW5nIGFjdGlvbmFibGUgLyB3b3J0aCBmbGFnZ2luZy4gSGlkZSB3aGVuOlxuICAvLyAgIC0gYmFja2VuZCBoYXMgdGhpcyBwYXRpZW50IEFORCBubyBsb2NhbCBidW5kbGUgdG8gY29tcGFyZSBhZ2FpbnN0XG4gIC8vICAgICAoTGF1bmNoIGlzIGVuYWJsZWQgXHUyMTkyIHRoYXQncyB0aGUgc2lnbmFsIGV2ZXJ5dGhpbmcncyBmaW5lKSwgb3JcbiAgLy8gICAtIGJvdGggc2lkZXMgYWdyZWUgb24gY291bnQgKGFscmVhZHkgaW4gc3luYywgbm8gdXBsb2FkIG5lZWRlZCkuXG4gIC8vIFRoZSByZW1haW5pbmcgc3RhdGVzIChjaGVja2luZyAvIGZhaWwgLyBhYnNlbnQgLyBjb3VudCBtaXNtYXRjaCkgYWxsXG4gIC8vIGVpdGhlciBuZWVkIHVzZXIgYXR0ZW50aW9uIG9yIGFyZSB0cmFuc2llbnQgbG9hZGluZyBmZWVkYmFjay5cbiAgY29uc3QgbG9jYWxNYXRjaGVzID0gX2xvY2FsQnVuZGxlLmV4aXN0cyAmJiBfbG9jYWxCdW5kbGUucGF0aWVudElkID09PSBvdi5pZF9ubztcbiAgY29uc3QgaW5TeW5jID1cbiAgICBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiICYmXG4gICAgbG9jYWxNYXRjaGVzICYmXG4gICAgX2JhY2tlbmRQYXRpZW50LmNvdW50ID09PSBfbG9jYWxCdW5kbGUuY291bnQ7XG4gIC8vIFF1aWV0IFwiXHUyNzEzIFx1NURGMlx1NTQwQ1x1NkI2NVwiIGhpbnQgc2l0cyB1bmRlciB0aGUgZG93bmxvYWQgYnV0dG9uIHdoZW4gaW4tc3luYyBcdTIwMTRcbiAgLy8gZ2l2ZXMgdGhlIHVzZXIgYSB0aW55IGFja25vd2xlZGdlbWVudCBpbnN0ZWFkIG9mIHRvdGFsIHNpbGVuY2UuXG4gIGlmIChlbHMuc3luY1N0YXR1c0hpbnQpIGVscy5zeW5jU3RhdHVzSGludC5oaWRkZW4gPSAhaW5TeW5jO1xuICBjb25zdCBub3RoaW5nVG9TaG93ID1cbiAgICBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiICYmICghbG9jYWxNYXRjaGVzIHx8IGluU3luYyk7XG4gIGlmIChub3RoaW5nVG9TaG93KSB7XG4gICAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gZmFsc2U7XG5cbiAgLy8gQmFja2VuZCByb3dcbiAgY29uc3QgYnMgPSBlbHMuYmFja2VuZFN0YXRlO1xuICBzd2l0Y2ggKF9iYWNrZW5kUGF0aWVudC5zdGF0ZSkge1xuICAgIGNhc2UgXCJjaGVja2luZ1wiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1NkFBMlx1NjdFNVx1NEUyRFx1MjAyNlwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImFic2VudFwiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZSBlbXB0eVwiO1xuICAgICAgLy8gQ2FyZCBzaXRzIGluc2lkZSB0aGUgcmVzdWx0IHpvbmUgbmV4dCB0byB0aGUgXHVEODNEXHVERDA0IFx1NTNENlx1NUY5NyBDVEEgYW5kXG4gICAgICAvLyB0aGUgXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCMyBidXR0b24gXHUyMDE0IHBvaW50aW5nIGF0IHRoZW0gd2l0aCB0ZXh0IHdvdWxkIGJlXG4gICAgICAvLyBkb3VibGUtdGFsay4gSnVzdCBzdGF0ZSB0aGUgZmFjdC5cbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTI2QTAgXHU1QzFBXHU3MTIxXHU2QjY0XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicHJlc2VudFwiOiB7XG4gICAgICBjb25zdCBjb3VudCA9IF9iYWNrZW5kUGF0aWVudC5jb3VudDtcbiAgICAgIGNvbnN0IHRzID0gX2JhY2tlbmRQYXRpZW50Lmxhc3RVcGRhdGVkO1xuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZSBva1wiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBgXHUyNzEzICR7Y291bnQgPiAwID8gYCR7Y291bnR9IFx1N0I0NiBcdTAwQjcgYCA6IFwiXCJ9XHU2NzAwXHU1RjhDXHU2NkY0XHU2NUIwICR7X2ZtdFRpbWVTaG9ydCh0cykgfHwgXCIodW5rbm93bilcIn1gO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJmYWlsXCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIGZhaWxcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTI3MTcgXHU2QUEyXHU2N0U1XHU1OTMxXHU2NTU3XHVGRjA4XHU3NzBCXHU5MDIzXHU3RERBIGJhbm5lclx1RkYwOVwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWVcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTIwMTRcIjtcbiAgfVxuXG4gIC8vIExvY2FsIHJvdyBcdTIwMTQgc2hvdyBvbmx5IHdoZW4gdGhlIHBlbmRpbmcgYnVuZGxlIG1hdGNoZXMgdGhpcyBwYXRpZW50LlxuICAvLyAobG9jYWxNYXRjaGVzIHdhcyBjb21wdXRlZCBhYm92ZSBmb3IgdGhlIGVhcmx5LXJldHVybiBjaGVjay4pXG4gIGlmIChsb2NhbE1hdGNoZXMpIHtcbiAgICBlbHMubG9jYWxTdGF0ZVJvdy5oaWRkZW4gPSBmYWxzZTtcbiAgICBlbHMubG9jYWxTdGF0ZS5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIG9rXCI7XG4gICAgZWxzLmxvY2FsU3RhdGUudGV4dENvbnRlbnQgPVxuICAgICAgYFx1MjcxMyAke19sb2NhbEJ1bmRsZS5jb3VudH0gXHU3QjQ2IFx1MDBCNyAke19mbXRSZWxhdGl2ZShfbG9jYWxCdW5kbGUuZ2VuZXJhdGVkQXQpfVx1NzUyMlx1NzUxRmA7XG4gIH0gZWxzZSB7XG4gICAgZWxzLmxvY2FsU3RhdGVSb3cuaGlkZGVuID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFwiXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGVcIiBidXR0b24gc2hvd3Mgb25seSB3aGVuIHRoZXJlJ3MgYSBsb2NhbCBidW5kbGVcbiAgLy8gZm9yIHRoaXMgcGF0aWVudC4gV2UgZG9uJ3QgcmVhY2ggdGhpcyBicmFuY2ggd2hlbiBpbi1zeW5jICh0aGVcbiAgLy8gd2hvbGUgc2VjdGlvbiBnZXRzIGhpZGRlbiBhYm92ZSksIHNvIG5vIG5lZWQgZm9yIGEgc2VwYXJhdGVcbiAgLy8gZGlzYWJsZWQgc3RhdGUgXHUyMDE0IHdoZW4gdGhlIGJ1dHRvbiBzaG93cywgdXBsb2FkIGlzIGFsd2F5cyBtZWFuaW5nZnVsLlxuICBlbHMucHVzaExvY2FsQnRuLmhpZGRlbiA9ICFsb2NhbE1hdGNoZXM7XG4gIGVscy5wdXNoTG9jYWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50aXRsZSA9IFwiXCI7XG4gIGVscy5wdXNoTG9jYWxCdG4udGV4dENvbnRlbnQgPSBcIlx1NjI4QVx1NjcyQ1x1NTczMFx1NkE5NFx1Njg0OFx1NEUwQVx1NTBCM1x1NTIzMFx1NUY4Q1x1N0FFRlwiO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIF9sb2NhbEJ1bmRsZSA9IHBlbmRpbmdcbiAgICA/IHtcbiAgICAgICAgZXhpc3RzOiB0cnVlLFxuICAgICAgICBjb3VudDogQXJyYXkuaXNBcnJheShKU09OLnBhcnNlKHBlbmRpbmcuanNvbik/LmVudHJ5KVxuICAgICAgICAgID8gSlNPTi5wYXJzZShwZW5kaW5nLmpzb24pLmVudHJ5Lmxlbmd0aFxuICAgICAgICAgIDogMCxcbiAgICAgICAgZ2VuZXJhdGVkQXQ6IHBlbmRpbmcuZ2VuZXJhdGVkQXQgfHwgMCxcbiAgICAgICAgcGF0aWVudElkOiBwZW5kaW5nLnBhdGllbnRJZCB8fCBudWxsLFxuICAgICAgfVxuICAgIDogeyBleGlzdHM6IGZhbHNlLCBjb3VudDogMCwgZ2VuZXJhdGVkQXQ6IDAsIHBhdGllbnRJZDogbnVsbCB9O1xuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoZWNrQmFja2VuZFBhdGllbnQoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmIChjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiB8fCAhb3Y/LmlkX25vIHx8IF9jb25uU3RhdGUgIT09IFwib2tcIikge1xuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJjaGVja2luZ1wiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuXG4gIGNvbnN0IHVybCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gIGNvbnN0IGtleSA9IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgaGVhZGVycyA9IGtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBrZXkgfSA6IHt9O1xuICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIHRoZSBoYXNoZWQgRkhJUiBpZCwgbmV2ZXIgdW5kZXIgdGhlIHJhd1xuICAvLyBuYXRpb25hbCBJRCBcdTIwMTQgcXVlcnkgLyBleHBvcnQgYnkgdGhlIGhhc2hlZCBmb3JtLlxuICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKG92LmlkX25vKTtcbiAgdHJ5IHtcbiAgICBjb25zdCBwciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9QYXRpZW50LyR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWAsIHsgaGVhZGVycyB9KTtcbiAgICBpZiAocHIuc3RhdHVzID09PSA0MDQpIHtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiYWJzZW50XCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXByLm9rKSB7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImZhaWxcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgICBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBhdGllbnQgPSBhd2FpdCBwci5qc29uKCk7XG4gICAgY29uc3QgbGFzdFVwZGF0ZWQgPSBwYXRpZW50Py5tZXRhPy5sYXN0VXBkYXRlZCA/PyBudWxsO1xuICAgIC8vIENvdW50IHZpYSAvZmhpci9leHBvcnQgXHUyMDE0IHNsaWdodGx5IGhlYXZpZXIgYnV0IGl0J3MgdGhlIG9ubHlcbiAgICAvLyBvZmYtdGhlLXNoZWxmIHdheSB0byBnZXQgdG90YWwgcmVzb3VyY2VzIGZvciBhIHBhdGllbnQuIENhcCBieVxuICAgIC8vIDVzIHRpbWVvdXQgc28gYSBzbG93IGJhY2tlbmQgZG9lc24ndCBsb2NrIHRoZSBwb3B1cCBmb3JldmVyLlxuICAgIGxldCBjb3VudCA9IDA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGN0cmwgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gY3RybC5hYm9ydCgpLCA1MDAwKTtcbiAgICAgIGNvbnN0IGVyID0gYXdhaXQgZmV0Y2goYCR7dXJsfS9maGlyL2V4cG9ydD9wYXRpZW50PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWAsIHtcbiAgICAgICAgaGVhZGVycywgc2lnbmFsOiBjdHJsLnNpZ25hbCxcbiAgICAgIH0pO1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIGlmIChlci5vaykge1xuICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCBlci5qc29uKCk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJ1bmRsZS5lbnRyeSkpIGNvdW50ID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogbGVhdmUgY291bnQgPSAwOyBub3QgZmF0YWwgKi8gfVxuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwicHJlc2VudFwiLCBjb3VudCwgbGFzdFVwZGF0ZWQgfTtcbiAgfSBjYXRjaCAoX2UpIHtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImZhaWxcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gIH1cbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwdXNoTG9jYWxCdW5kbGVUb0JhY2tlbmQoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3Y/LmlkX25vIHx8ICFfbG9jYWxCdW5kbGUuZXhpc3RzIHx8IF9sb2NhbEJ1bmRsZS5wYXRpZW50SWQgIT09IG92LmlkX25vKSByZXR1cm47XG4gIGNvbnN0IHVybCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gIGNvbnN0IGtleSA9IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgaGVhZGVycyA9IHtcbiAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAuLi4oa2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGtleSB9IDoge30pLFxuICB9O1xuICBlbHMucHVzaExvY2FsQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50ZXh0Q29udGVudCA9IFwiXHU0RTBBXHU1MEIzXHU0RTJEXHUyMDI2XCI7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICAgIGlmICghcGVuZGluZz8uanNvbikgdGhyb3cgbmV3IEVycm9yKFwibm8gbG9jYWwgYnVuZGxlXCIpO1xuICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvaW1wb3J0YCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIiwgaGVhZGVycywgYm9keTogcGVuZGluZy5qc29uLFxuICAgIH0pO1xuICAgIGlmICghci5vaykge1xuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHIudGV4dCgpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7ci5zdGF0dXN9OiAke3RleHQuc2xpY2UoMCwgMTIwKX1gKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgci5qc29uKCk7XG4gICAgc2V0U3RhdHVzKGBcdTI3MDUgXHU1REYyXHU0RTBBXHU1MEIzICR7cmVzdWx0LmltcG9ydGVkID8/IFwiP1wifSBcdTdCNDZcdTUyMzBcdTVGOENcdTdBRUZgLCBcInN1Y2Nlc3NcIik7XG4gICAgYXdhaXQgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgc2V0U3RhdHVzKGBcdTI2RDQgXHU0RTBBXHU1MEIzXHU1OTMxXHU2NTU3XHVGRjFBJHtlLm1lc3NhZ2V9YCwgXCJlcnJvclwiKTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBfcmVuZGVyRGF0YVN0YXRlKCkgKGFscmVhZHkgY2FsbGVkIGZyb20gY2hlY2tCYWNrZW5kUGF0aWVudCBvblxuICAgIC8vIHN1Y2Nlc3MpIGRlY2lkZXMgdGhlIHJpZ2h0IGRpc2FibGVkIHN0YXRlICsgbGFiZWwgYmFzZWQgb25cbiAgICAvLyB3aGV0aGVyIGJhY2tlbmQgYW5kIGxvY2FsIGFncmVlLiBDYWxsIGl0IGhlcmUgdG9vIHRvIGNvdmVyIHRoZVxuICAgIC8vIGZhaWx1cmUgcGF0aCB0aGF0IHNraXBwZWQgY2hlY2tCYWNrZW5kUGF0aWVudC5cbiAgICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gIH1cbn1cblxuZWxzLnB1c2hMb2NhbEJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1c2hMb2NhbEJ1bmRsZVRvQmFja2VuZCk7XG5cbi8vIFRoZSBibG9ja2VkLXJlYXNvbiB3YXJuaW5nIHN0cmlwIGRvdWJsZXMgYXMgYSBcImp1bXAgYmFjayB0byB0aGVcbi8vIHJlbGV2YW50IHN0ZXBcIiBidXR0b24gd2hlbiB0aGVyZSdzIGEga25vd24gdGFyZ2V0IHN0ZXAuIENsaWNrXG4vLyBhbnl3aGVyZSBvbiBpdCB0byBuYXZpZ2F0ZTsgdGhlIHRyYWlsaW5nIFwiXHU1NkRFIFx1MjQ2MCBcdTc2N0JcdTUxNjUgXHUyMTkyXCIgaGludFxuLy8gdGVsZWdyYXBocyB3aGVyZSB0aGUgY2xpY2sgd2lsbCBsYW5kLlxuZWxzLnN5bmNCbG9ja2VkUmVhc29uPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjb25zdCB0YXJnZXQgPSBOdW1iZXIoZWxzLnN5bmNCbG9ja2VkUmVhc29uLmRhdGFzZXQudGFyZ2V0U3RlcCk7XG4gIGlmICh0YXJnZXQgPj0gMSAmJiB0YXJnZXQgPD0gMykgX3NldEFjdGl2ZVN0ZXAodGFyZ2V0KTtcbn0pO1xuXG4vLyBcIlx1RDgzRFx1REQxNyBcdTk1OEJcdTU1NUZcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTc2N0JcdTUxNjVcIiBcdTIwMTQgb3BlbnMgdGhlIE5ISSBsYW5kaW5nIHBhZ2Ugc28gdGhlIHVzZXJcbi8vIGRvZXNuJ3QgaGF2ZSB0byByZW1lbWJlciAvIGdvb2dsZSB0aGUgVVJMLiBDbG9zZXMgdGhlIHBvcHVwIHNvXG4vLyB0aGV5IGRvbid0IGhhdmUgdG8gZGlzbWlzcyBpdCBtYW51YWxseSBhZnRlciB0aGUgbmV3IHRhYiBvcGVucy5cbmVscy5vcGVuTmhpQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICBhd2FpdCBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IE5ISV9MQU5ESU5HIH0pO1xuICB3aW5kb3cuY2xvc2UoKTtcbn0pO1xuXG4vLyBcIlx1NTI0RFx1NUY4MFx1NzY3Qlx1NTE2NVx1OTgwMVx1OTc2MlwiIGluc2lkZSB0aGUgbmVlZHMtbG9naW4gYmFubmVyLiBDb3ZlcnMgYm90aDpcbi8vICAgMS4gU2Vzc2lvbiBleHBpcmVkIHNpbGVudGx5IHdoaWxlIG9uIGEgbG9nZ2VkLWluIHBhZ2UgKGxvb2tzXG4vLyAgICAgIFwic3RpbGwgbG9nZ2VkIGluXCIgdG8gdGhlIHVzZXIgXHUyMTkyIHRoZXkncmUgY29uZnVzZWQgd2h5IHdlIHNheVxuLy8gICAgICBvdGhlcndpc2UpLlxuLy8gICAyLiBVc2VyIGlzIG9uIGEgcHVibGljIHN1Yi1wYWdlIGxpa2UgXHU1NTRGXHU3QjU0XHU1QzA4XHU1MzQwIFx1MjAxNCBhIHBsYWluIHJlbG9hZFxuLy8gICAgICB3b3VsZCBqdXN0IHJlLXJlbmRlciB0aGUgc2FtZSB1bi1hdXRoIHBhZ2Ugd2l0aG91dCBzdXJmYWNpbmdcbi8vICAgICAgYSBsb2dpbiBmb3JtLiBOYXZpZ2F0aW5nIGRpcmVjdGx5IHRvIHRoZSBsb2dpbiBVUkwgaGFuZGxlc1xuLy8gICAgICBib3RoIGNhc2VzIGlkZW50aWNhbGx5LlxuLy8gRHJpdmVzIGNocm9tZS50YWJzLnVwZGF0ZSB3aXRoIGEgdXJsIHNvIHRoZSBleGlzdGluZyBOSEkgdGFiXG4vLyBnb2VzIHN0cmFpZ2h0IHRvIHRoZSBsb2dpbiBwaWNrZXI7IGZvY3VzZXMgKyBjbG9zZXMgcG9wdXAgc28gdGhlXG4vLyB1c2VyIGxhbmRzIG9uIHRoZSBwYWdlIHRoZXkgbmVlZCB0byBhY3Qgb24uXG5lbHMubmhpUmVsb2FkQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICBpZiAoIV9uaGlUYWJJZCkge1xuICAgIC8vIERlZmVuc2l2ZTogYmFubmVyIHNob3VsZG4ndCBiZSB2aXNpYmxlIHdoZW4gb2ZmLU5ISSwgYnV0IGlmXG4gICAgLy8gc29tZXRoaW5nIHdlbnQgc2lkZXdheXMganVzdCBvcGVuIHRoZSBsb2dpbiBwYWdlIGluIGEgbmV3IHRhYi5cbiAgICBhd2FpdCBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IE5ISV9MT0dJTl9VUkwgfSk7XG4gICAgd2luZG93LmNsb3NlKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgYXdhaXQgY2hyb21lLnRhYnMudXBkYXRlKF9uaGlUYWJJZCwgeyB1cmw6IE5ISV9MT0dJTl9VUkwsIGFjdGl2ZTogdHJ1ZSB9KTtcbiAgfSBjYXRjaCB7fVxuICB3aW5kb3cuY2xvc2UoKTtcbn0pO1xuXG4vLyBMb2NhbCBidW5kbGUgc3RhdGUgY2hhbmdlcyB3aGVuZXZlciB0aGUgU1cgc3Rhc2hlcyBhIG5ldyBzeW5jLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgUEVORElOR19CVU5ETEVfS0VZIGluIGNoYW5nZXMpIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBCYWNrZW5kIG1vZGUgZmVhdHVyZSBnYXRlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTGF5cGVyc29uIGRlZmF1bHQ6IGJhY2tlbmQgbW9kZSAoRG9ja2VyIHNlcnZlciArIERhc2hib2FyZCArIFNNQVJUXG4vLyBBcHApIGlzIGhpZGRlbiBiZWhpbmQgYSB0b2dnbGUgaW4gXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBLiBXaGVuIE9GRiAoZGVmYXVsdCksIHRoZVxuLy8gbW9kZS10b2dnbGUgcm93IGluIHN0ZXAgMyBkb2Vzbid0IHJlbmRlciBhbmQgc3luY01vZGUgaXMgZm9yY2VkIHRvXG4vLyBcImxvY2FsXCIgcmVnYXJkbGVzcyBvZiB3aGF0J3MgaW4gc3RvcmFnZS5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRCYWNrZW5kTW9kZUVuYWJsZWQoKSB7XG4gIGNvbnN0IHsgYmFja2VuZE1vZGVFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJiYWNrZW5kTW9kZUVuYWJsZWRcIik7XG4gIGNvbnN0IGVuYWJsZWQgPSBiYWNrZW5kTW9kZUVuYWJsZWQgPT09IHRydWU7XG4gIGVscy5iYWNrZW5kTW9kZUVuYWJsZWQuY2hlY2tlZCA9IGVuYWJsZWQ7XG4gIGRvY3VtZW50LmJvZHkuZGF0YXNldC5iYWNrZW5kRW5hYmxlZCA9IGVuYWJsZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIjtcbn1cblxuZWxzLmJhY2tlbmRNb2RlRW5hYmxlZD8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGVuYWJsZWQgPSBlbHMuYmFja2VuZE1vZGVFbmFibGVkLmNoZWNrZWQ7XG4gIGRvY3VtZW50LmJvZHkuZGF0YXNldC5iYWNrZW5kRW5hYmxlZCA9IGVuYWJsZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIjtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgYmFja2VuZE1vZGVFbmFibGVkOiBlbmFibGVkIH0pO1xuICBpZiAoZW5hYmxlZCkge1xuICAgIC8vIEF1dG8tc3dpdGNoIHRvIGJhY2tlbmQgbW9kZSBzbyB0aGUgdXNlciBpbW1lZGlhdGVseSBzZWVzIHRoZVxuICAgIC8vIG1vZGUgdGFiICsgdGhlIGJhY2tlbmQgY29uZmlnIGZpZWxkcyB0aGV5IGp1c3QgdW5sb2NrZWQuIEJlYXRzXG4gICAgLy8gXCJJIGVuYWJsZWQgaXQgYnV0IG5vdGhpbmcgaGFwcGVuZWRcIi5cbiAgICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgci5jaGVja2VkID0gci52YWx1ZSA9PT0gXCJiYWNrZW5kXCI7XG4gICAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBcImJhY2tlbmRcIjtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jTW9kZTogXCJiYWNrZW5kXCIgfSk7XG4gICAgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yY2UgYmFjayB0byBsb2NhbDsgY2xlYXIgYW55IGxlZnRvdmVyIGJhY2tlbmQgY29ubmVjdGlvbiBzdGF0ZVxuICAgIC8vIHNvIHRoZSBuZXh0IHRpbWUgdGhleSByZS1lbmFibGUgaXQgZG9lc24ndCBzaG93IHN0YWxlIFwiXHU1REYyXHU5MDIzXHU3RERBXCIuXG4gICAgZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHIuY2hlY2tlZCA9IHIudmFsdWUgPT09IFwibG9jYWxcIjtcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IFwibG9jYWxcIjtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jTW9kZTogXCJsb2NhbFwiIH0pO1xuICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICB9XG59KTtcblxuLy8gXHUyNTAwXHUyNTAwIFN5bmMgbW9kZSAobG9jYWwgfCBiYWNrZW5kKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmFzeW5jIGZ1bmN0aW9uIGxvYWRTeW5jTW9kZSgpIHtcbiAgY29uc3QgeyBzeW5jTW9kZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic3luY01vZGVcIik7XG4gIC8vIEJhY2tlbmQgbW9kZSBkaXNhYmxlZCBpbiBcdTkwMzJcdTk2OEVcdThBMkRcdTVCOUEgXHUyMTkyIGlnbm9yZSBhbnkgc3RvcmVkIGJhY2tlbmQgbW9kZS5cbiAgY29uc3QgYmFja2VuZEVuYWJsZWQgPSBkb2N1bWVudC5ib2R5LmRhdGFzZXQuYmFja2VuZEVuYWJsZWQgPT09IFwidHJ1ZVwiO1xuICBjb25zdCBtb2RlID0gKGJhY2tlbmRFbmFibGVkICYmIHN5bmNNb2RlID09PSBcImJhY2tlbmRcIikgPyBcImJhY2tlbmRcIiA6IERFRkFVTFRfTU9ERTtcbiAgZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHIuY2hlY2tlZCA9IHIudmFsdWUgPT09IG1vZGU7XG4gIGRvY3VtZW50LmJvZHkuZGF0YXNldC5tb2RlID0gbW9kZTtcbiAgaWYgKG1vZGUgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgLy8gQXV0by10ZXN0IG9uIG9wZW4gc28gdGhlIHVzZXIgc2VlcyBzdGF0dXMgd2l0aG91dCBjbGlja2luZy4gQXdhaXRpbmdcbiAgICAvLyBoZXJlIHNlcmlhbGl6ZXMgdGhlIHJlc3Qgb2YgaW5pdCgpIHVudGlsIHdlIGtub3cgdGhlIGFuc3dlci5cbiAgICBhd2FpdCB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgfSBlbHNlIHtcbiAgICBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjdXJyZW50TW9kZSgpIHtcbiAgZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIGlmIChyLmNoZWNrZWQpIHJldHVybiByLnZhbHVlO1xuICByZXR1cm4gREVGQVVMVF9NT0RFO1xufVxuXG5mb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkge1xuICByLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGUgPSBjdXJyZW50TW9kZSgpO1xuICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5tb2RlID0gbW9kZTtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jTW9kZTogbW9kZSB9KTtcbiAgICBpZiAobW9kZSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICAgIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpOyAvLyB0cmlnZ2VycyBjaGVja0JhY2tlbmRQYXRpZW50IG9uIHN1Y2Nlc3NcbiAgICB9IGVsc2Uge1xuICAgICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmVscy5iYWNrZW5kVXJsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBiYWNrZW5kVXJsOiBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkgfSk7XG4gIGVscy5kYXNoYm9hcmRMaW5rLmhyZWYgPSBlbHMuYmFja2VuZFVybC52YWx1ZS5yZXBsYWNlKC86ODAxMC4qJC8sIFwiOjMwMTBcIik7XG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG59KTtcbmVscy5zeW5jQXBpS2V5LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jQXBpS2V5OiBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCkgfSk7XG59KTtcbi8vIE1hc2stcGF0aWVudC1uYW1lIHRvZ2dsZSBcdTIwMTQgZGVmYXVsdHMgT0ZGIChjaXRpemVucyBkb3dubG9hZGluZyB0aGVpclxuLy8gb3duIGRhdGEgZG9uJ3QgbmVlZCBhbm9ueW1pemF0aW9uKS4gV2hlbiBPTjogcG9wdXAgc3VtbWFyeSwgRkhJUlxuLy8gQnVuZGxlIG91dHB1dCwgc3luYy1sb2csIGFuZCBOSEkgcmVwb3J0IG5hcnJhdGl2ZSBhbGwgdXNlIHRoZVxuLy8gbWFza2VkIGZvcm0gKFx1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU5MEVET1x1NjVCMCkgaW5zdGVhZCBvZiB0aGUgcmVhbCBuYW1lLlxubGV0IF9tYXNrTmFtZUVuYWJsZWQgPSBmYWxzZTtcbmFzeW5jIGZ1bmN0aW9uIGxvYWRNYXNrTmFtZUVuYWJsZWQoKSB7XG4gIGNvbnN0IHsgbWFza05hbWVFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJtYXNrTmFtZUVuYWJsZWRcIik7XG4gIF9tYXNrTmFtZUVuYWJsZWQgPSBtYXNrTmFtZUVuYWJsZWQgPT09IHRydWU7XG4gIGlmIChlbHMubWFza05hbWVFbmFibGVkKSBlbHMubWFza05hbWVFbmFibGVkLmNoZWNrZWQgPSBfbWFza05hbWVFbmFibGVkO1xufVxuXG5mdW5jdGlvbiBfbWF5YmVNYXNrKG5hbWUpIHtcbiAgcmV0dXJuIF9tYXNrTmFtZUVuYWJsZWQgPyBtYXNrTmFtZShuYW1lKSA6IG5hbWUgfHwgXCJcIjtcbn1cblxuZWxzLm1hc2tOYW1lRW5hYmxlZD8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBhc3luYyAoKSA9PiB7XG4gIF9tYXNrTmFtZUVuYWJsZWQgPSBlbHMubWFza05hbWVFbmFibGVkLmNoZWNrZWQ7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IG1hc2tOYW1lRW5hYmxlZDogX21hc2tOYW1lRW5hYmxlZCB9KTtcbiAgLy8gUmUtcmVuZGVyIHBvcHVwIGNocm9tZSAoc3VtbWFyeSBsaW5lIGlzIHRoZSBvbmx5IHNwb3QgdGhhdCByZWFkc1xuICAvLyBfbWF5YmVNYXNrIHJlYWN0aXZlbHk7IGV2ZXJ5d2hlcmUgZWxzZSBzYW1wbGVzIGl0IGp1c3QtaW4tdGltZSkuXG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbn0pO1xuXG5lbHMuc21hcnRBcHBVcmwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIC8vIFBlcnNpc3QgdHJpbW1lZCB2YWx1ZS4gRW1wdHkgc3RyaW5nIFx1MjE5MiByZXN0b3JlIGRlZmF1bHQgb24gbmV4dCBsb2FkLlxuICBjb25zdCB2ID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKTtcbiAgaWYgKHYpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzbWFydEFwcExhdW5jaFVybDogdiB9KTtcbiAgfSBlbHNlIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoXCJzbWFydEFwcExhdW5jaFVybFwiKTtcbiAgICBlbHMuc21hcnRBcHBVcmwudmFsdWUgPSBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBzZXRTdGF0dXModGV4dCwga2luZCwgYnJlYWtkb3duKSB7XG4gIC8vIEJ1aWxkIHdpdGggRE9NIEFQSSBcdTIwMTQgYXZvaWRzIGlubmVySFRNTCAvIFhTUyByaXNrLlxuICAvLyBicmVha2Rvd24gaXMgYW4gYXJyYXkgb2YgbWl4ZWQgZW50cmllczpcbiAgLy8gICAtIHBoYXNlIHRpbWluZ3MgcHJlZml4ZWQgd2l0aCBcIlx1MjNGMVwiICBcdTIxOTIgXHU5NjhFXHU2QkI1XHU4MDE3XHU2NjQyXG4gIC8vICAgLSBwZXItZW5kcG9pbnQgY291bnRzICAgICAgICAgICAgICAgIFx1MjE5MiBcdTU0MDQgZW5kcG9pbnQgXHU2MjkzXHU1MjMwXHU1RTdFXHU3QjQ2XG4gIC8vIEJvdGgga2luZHMgYXJlIHR1Y2tlZCBpbnNpZGUgYSBzaW5nbGUgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIiB0b2dnbGUgc28gdGhlXG4gIC8vIHBvcHVwIHN0YXlzIGNvbXBhY3QgYnkgZGVmYXVsdC5cbiAgZWxzLnN0YXR1cy5jbGFzc05hbWUgPSBraW5kIHx8IFwiXCI7XG4gIGVscy5zdGF0dXMudGV4dENvbnRlbnQgPSBcIlwiO1xuICBpZiAoIXRleHQgJiYgIShicmVha2Rvd24gJiYgYnJlYWtkb3duLmxlbmd0aCkpIHJldHVybjtcbiAgZWxzLnN0YXR1cy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0IHx8IFwiXCIpKTtcbiAgaWYgKGJyZWFrZG93biAmJiBicmVha2Rvd24ubGVuZ3RoKSB7XG4gICAgY29uc3QgcGhhc2VSb3dzID0gYnJlYWtkb3duLmZpbHRlcigoYikgPT4gYi5zdGFydHNXaXRoKFwiXHUyM0YxXCIpKTtcbiAgICBjb25zdCBvdGhlclJvd3MgPSBicmVha2Rvd24uZmlsdGVyKChiKSA9PiAhYi5zdGFydHNXaXRoKFwiXHUyM0YxXCIpKTtcblxuICAgIGNvbnN0IGRldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGV0YWlsc1wiKTtcbiAgICBkZXRhaWxzLmNsYXNzTmFtZSA9IFwic3RhdHVzLWRldGFpbFwiO1xuICAgIGNvbnN0IHN1bW1hcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3VtbWFyeVwiKTtcbiAgICBzdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIjtcbiAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHN1bW1hcnkpO1xuXG4gICAgaWYgKG90aGVyUm93cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgYm9keS5jbGFzc05hbWUgPSBcInN0YXR1cy1icmVha2Rvd25cIjtcbiAgICAgIC8vIE9uZSBpdGVtIHBlciBsaW5lIHNvIFwiXHU1QzMxXHU5MUFCIDEyIFx1N0I0NiAvIFx1ODY1NVx1NjVCOSA4OCBcdTdCNDYgLyBcdTZBQTJcdTlBNTcgNDEyIFx1N0I0NlwiXG4gICAgICAvLyBpcyByZWFkYWJsZTsgdGhlIDM2MHB4IHBvcHVwIHdvdWxkIGhhdmUgd3JhcHBlZCBhIGZsYXRcbiAgICAgIC8vIHNlcGFyYXRvci1qb2luZWQgc3RyaW5nIGludG8gYSB0YW5nbGVkIG1lc3MuXG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiBvdGhlclJvd3MpIHtcbiAgICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxpbmUudGV4dENvbnRlbnQgPSByb3c7XG4gICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQobGluZSk7XG4gICAgICB9XG4gICAgICBkZXRhaWxzLmFwcGVuZENoaWxkKGJvZHkpO1xuICAgIH1cbiAgICBpZiAocGhhc2VSb3dzLmxlbmd0aCkge1xuICAgICAgLy8gUGhhc2UgdGltaW5ncyBhcmUgZGV2IGluZm8gXHUyMDE0IHR1Y2sgdGhlbSBpbnNpZGUgYSBzZWNvbmQgdG9nZ2xlXG4gICAgICAvLyBzbyBlbmQgdXNlcnMgZG9uJ3Qgc2VlIFwibmhpLXBhcmFsbGVsPThzXCIgcmlnaHQgYWZ0ZXIgYSBzdWNjZXNzXG4gICAgICAvLyBiYW5uZXIgYW5kIHRoaW5rIHNvbWV0aGluZydzIHdyb25nLlxuICAgICAgY29uc3QgdGVjaERldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGV0YWlsc1wiKTtcbiAgICAgIHRlY2hEZXRhaWxzLmNsYXNzTmFtZSA9IFwic3RhdHVzLWRldGFpbCBzdGF0dXMtdGVjaFwiO1xuICAgICAgY29uc3QgdGVjaFN1bW1hcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3VtbWFyeVwiKTtcbiAgICAgIHRlY2hTdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTYyODBcdTg4NTNcdTdEMzBcdTdCQzBcIjtcbiAgICAgIHRlY2hEZXRhaWxzLmFwcGVuZENoaWxkKHRlY2hTdW1tYXJ5KTtcbiAgICAgIGNvbnN0IHBoYXNlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBwaGFzZXMuY2xhc3NOYW1lID0gXCJzdGF0dXMtcGhhc2VzXCI7XG4gICAgICBwaGFzZXMudGV4dENvbnRlbnQgPSBwaGFzZVJvd3MubWFwKChwKSA9PiBwLnJlcGxhY2UoL15cdTIzRjFcXHMqLywgXCJcIikpLmpvaW4oXCIgXHUwMEI3IFwiKTtcbiAgICAgIHRlY2hEZXRhaWxzLmFwcGVuZENoaWxkKHBoYXNlcyk7XG4gICAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHRlY2hEZXRhaWxzKTtcbiAgICB9XG4gICAgZWxzLnN0YXR1cy5hcHBlbmRDaGlsZChkZXRhaWxzKTtcbiAgfVxuICAvLyBTdGF0dXMgdmlzaWJpbGl0eSBkcml2ZXMgd2hldGhlciB0aGUgcmVzdWx0IHpvbmUgc2hvd3MgYXQgYWxsLlxuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWN0aXZlVGFiKCkge1xuICBjb25zdCBbdGFiXSA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICByZXR1cm4gdGFiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGVuZGluZyBGSElSIEJ1bmRsZSAobG9jYWwtbW9kZSByZXN1bHQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEJhY2tncm91bmQgc3Rhc2hlcyB0aGUgZ2VuZXJhdGVkIEJ1bmRsZSBpbnRvIGNocm9tZS5zdG9yYWdlLmxvY2FsXG4vLyB1bmRlciBgcGVuZGluZ0ZoaXJCdW5kbGVgLiBQb3B1cCByZW5kZXJzIGEgZG93bmxvYWQgYnV0dG9uLiBVc2VyIG11c3Rcbi8vIGNsaWNrIHRvIGFjdHVhbGx5IHRyaWdnZXIgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBcdTIwMTQgdGhlIGZpbGUgbmV2ZXJcbi8vIGhpdHMgdGhlIGRpc2sgdW5zb2xpY2l0ZWQuXG5cbmZ1bmN0aW9uIF9mbXRCeXRlcyhuKSB7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwMjQgKiAxMDI0KSByZXR1cm4gYCR7KG4gLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gIHJldHVybiBgJHsobiAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMil9IE1CYDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZyB8fCAhcGVuZGluZy5qc29uKSB7XG4gICAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gSWYgdGhlIHVzZXIgaGFzIHN3aXRjaGVkIG92ZXJyaWRlIHRvIGEgZGlmZmVyZW50IHBhdGllbnQsIHRoZVxuICAvLyBzdGFzaGVkIGJ1bmRsZSBpcyBmb3IgdGhlICpwcmV2aW91cyogcGF0aWVudC4gSGlkZSBpdCBzbyB0aGV5XG4gIC8vIGNhbid0IGFjY2lkZW50YWxseSBkb3dubG9hZCB0aGUgd3JvbmcgZmlsZS4gVGhlIGJ1bmRsZSBzdGF5cyBpblxuICAvLyBzdG9yYWdlOyByZS1lbnRlcmluZyB0aGUgbWF0Y2hpbmcgb3ZlcnJpZGUgd2lsbCBzdXJmYWNlIGl0IGFnYWluLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAob3Y/LmlkX25vICYmIHBlbmRpbmcucGF0aWVudElkICYmIHBlbmRpbmcucGF0aWVudElkICE9PSBvdi5pZF9ubykge1xuICAgIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IGZhbHNlO1xuICAvLyBGaWxlbmFtZSArIHNpemVhZ2UgbGl2ZSBpbiBzZXBhcmF0ZSBzaWJsaW5nIGVsZW1lbnRzIGluIHRoZSBuZXdcbiAgLy8gc2luZ2xlLXBhbmVsIGxheW91dCBzbyB3ZSBqdXN0IHVwZGF0ZSBlYWNoIGRpcmVjdGx5LlxuICBjb25zdCBhZ28gPSBwZW5kaW5nLmdlbmVyYXRlZEF0ID8gX2ZtdFJlbGF0aXZlKHBlbmRpbmcuZ2VuZXJhdGVkQXQpIDogXCJcIjtcbiAgaWYgKGVscy5idW5kbGVGaWxlbmFtZSkge1xuICAgIGVscy5idW5kbGVGaWxlbmFtZS50ZXh0Q29udGVudCA9IHBlbmRpbmcuZmlsZW5hbWU7XG4gICAgZWxzLmJ1bmRsZUZpbGVuYW1lLnRpdGxlID0gcGVuZGluZy5maWxlbmFtZTtcbiAgfVxuICBpZiAoZWxzLmJ1bmRsZVNpemVhZ2UpIHtcbiAgICBlbHMuYnVuZGxlU2l6ZWFnZS50ZXh0Q29udGVudCA9IGAke19mbXRCeXRlcyhwZW5kaW5nLmJ5dGVzIHx8IDApfSR7YWdvID8gYCBcdTAwQjcgJHthZ299YCA6IFwiXCJ9YDtcbiAgfVxuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZG93bmxvYWRQZW5kaW5nQnVuZGxlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBpZiAoIXBlbmRpbmcpIHJldHVybjtcbiAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtwZW5kaW5nLmpzb25dLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vZmhpcitqc29uXCIgfSk7XG4gIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gIHRyeSB7XG4gICAgYXdhaXQgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCh7IHVybCwgZmlsZW5hbWU6IHBlbmRpbmcuZmlsZW5hbWUsIHNhdmVBczogZmFsc2UgfSk7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gUmVsZWFzZSBhZnRlciBhIHRpY2sgc28gdGhlIGRvd25sb2FkIGhhcyB0aW1lIHRvIHN0YXJ0LlxuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCA1MDAwKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBjbGVhclBlbmRpbmdCdW5kbGUoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBhd2FpdCByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuICAvLyBDbGVhcmluZyB0aGUgZG93bmxvYWQgaXMgdGhlIHVzZXIncyBcIkknbSBkb25lIHdpdGggdGhpcyByZXN1bHRcIlxuICAvLyBnZXN0dXJlIFx1MjAxNCB3aXBlIHRoZSBjb21wbGV0aW9uIHN0YXR1cyBiYW5uZXIgdG9vIHNvIHRoZSByZXN1bHQgem9uZVxuICAvLyBjb2xsYXBzZXMgZW50aXJlbHkgaW5zdGVhZCBvZiBsaW5nZXJpbmcgd2l0aCBhIHN0YWxlIFwiXHUyNzA1IFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMFwiXG4gIC8vIGFuZCBubyBkb3dubG9hZCBidXR0b24gbmV4dCB0byBpdC5cbiAgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG4gIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgYXdhaXQgY2hyb21lLnJ1bnRpbWVcbiAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImNsZWFyU3luY1N0YXR1c1wiIH0pXG4gICAgLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuZWxzLmRvd25sb2FkQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBkb3dubG9hZFBlbmRpbmdCdW5kbGUpO1xuZWxzLmNsZWFyQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhclBlbmRpbmdCdW5kbGUpO1xuXG4vLyBMaXZlIHVwZGF0ZSB3aGVuIGJhY2tncm91bmQgc3Rhc2hlcyBhIG5ldyBidW5kbGUgd2hpbGUgcG9wdXAgaXMgb3Blbi5cbi8vIChOb3RlOiBhbm90aGVyIG9uQ2hhbmdlZCBsaXN0ZW5lciBlYXJsaWVyIGluIHRoZSBmaWxlIHJlZnJlc2hlcyB0aGVcbi8vIGRhdGEtc3RhdGUgY2FyZDsgd2UgbGVhdmUgdGhhdCBvbmUgc2VwYXJhdGUgc28gZmFpbHVyZSBvZiBlaXRoZXIgcGF0aFxuLy8gZG9lc24ndCB0YWtlIHRoZSBvdGhlciBkb3duLilcbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIFBFTkRJTkdfQlVORExFX0tFWSBpbiBjaGFuZ2VzKSByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xufSk7XG5cbi8vIEJhY2tncm91bmQtc2lkZSBmbG93IGNhbiBtdXRhdGUgdGhlIHBhdGllbnRPdmVycmlkZSBtaWQtc3luYyBcdTIwMTQgbW9zdFxuLy8gaW1wb3J0YW50bHkgX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpIHN3YXBzIHRoZSBhdXRvLVhYWFhYWFhYXG4vLyBwbGFjZWhvbGRlciBmb3IgdGhlIHJlYWwgTkhJIGNpZC4gV2l0aG91dCB0aGlzIGxpc3RlbmVyIHRoZSBwb3B1cFxuLy8gaW5wdXRzIHN0YXllZCBzdGFsZSwgcmVmcmVzaFBlbmRpbmdCdW5kbGUncyBwYXRpZW50LW1hdGNoIGNoZWNrXG4vLyB0aGVuIGNvbXBhcmVkIG9sZCBpbnB1dCB2YWx1ZSB2cy4gZnJlc2ggYnVuZGxlLnBhdGllbnRJZCBhbmQgaGlkXG4vLyB0aGUgZG93bmxvYWQgYnV0dG9uLiBSZWxvYWQgdGhlIG92ZXJyaWRlIGludG8gdGhlIGlucHV0cyB3aGVuZXZlclxuLy8gc3RvcmFnZSBjaGFuZ2VzIHNvIGV2ZXJ5IGRvd25zdHJlYW0gZ3VhcmQgc2VlcyBjb25zaXN0ZW50IHZhbHVlcy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIGNoYW5nZXMucGF0aWVudE92ZXJyaWRlKSBsb2FkUGF0aWVudE92ZXJyaWRlKCk7XG59KTtcblxuLy8gXHUyNTAwXHUyNTAwIFx1MjREOCBIZWxwLWljb24gdG9vbHRpcCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBPbmUgc2hhcmVkIDxkaXY+IGFwcGVuZGVkIHRvIHRoZSBwb3B1cCBib2R5LiBPbiBob3ZlciBvZiBhbnlcbi8vIC5oZWxwLWljb24sIHdlIGNvcHkgaXRzIGRhdGEtdGlwIHRleHQgYW5kIHBvc2l0aW9uIHRoZSB0b29sdGlwXG4vLyBpbnNpZGUgdGhlIHBvcHVwLCBjbGFtcGluZyB0byBpdHMgdmlld3BvcnQgc28gaXQgY2FuJ3QgY2xpcCBvZmZcbi8vIGVpdGhlciBlZGdlIHJlZ2FyZGxlc3Mgb2Ygd2hlcmUgdGhlIGljb24gc2l0cy4gKENTUyBwc2V1ZG8tZWxlbWVudHNcbi8vIGNhbid0IGJlIG1lYXN1cmVkLCBzbyBhIHB1cmUtQ1NTIGFwcHJvYWNoIGluZXZpdGFibHkgcGlja3Mgb25lXG4vLyBhbmNob3Igc2lkZSBhbmQgYnJlYWtzIGZvciBpY29ucyBvbiB0aGUgb3RoZXIgc2lkZSBvZiB0aGUgcG9wdXAuKVxuY29uc3QgX2hlbHBUaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuX2hlbHBUaXAuY2xhc3NOYW1lID0gXCJoZWxwLXRvb2x0aXBcIjtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoX2hlbHBUaXApO1xuXG5jb25zdCBWSUVXUE9SVF9NQVJHSU4gPSA2OyAvLyBrZWVwIHRoaXMgbWFueSBweCBjbGVhciBvZiBwb3B1cCBlZGdlc1xuXG5mdW5jdGlvbiBfc2hvd0hlbHBUb29sdGlwKGljb24pIHtcbiAgX2hlbHBUaXAudGV4dENvbnRlbnQgPSBpY29uLmRhdGFzZXQudGlwIHx8IGljb24uZ2V0QXR0cmlidXRlKFwiZGF0YS10aXBcIikgfHwgXCJcIjtcbiAgX2hlbHBUaXAuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG5cbiAgLy8gTWVhc3VyZSBub3cgdGhhdCBjb250ZW50IGlzIHNldC5cbiAgY29uc3QgaWNvblJlY3QgPSBpY29uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB0aXBSZWN0ID0gX2hlbHBUaXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHZpZXdwb3J0VyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcbiAgY29uc3Qgdmlld3BvcnRIID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcblxuICAvLyBIb3Jpem9udGFsOiBwcmVmZXIgY2VudGVyZWQgb24gdGhlIGljb247IGNsYW1wIGludG8gW21hcmdpbiwgdnctdGlwLW1hcmdpbl0uXG4gIGxldCBsZWZ0ID0gaWNvblJlY3QubGVmdCArIGljb25SZWN0LndpZHRoIC8gMiAtIHRpcFJlY3Qud2lkdGggLyAyO1xuICBpZiAobGVmdCA8IFZJRVdQT1JUX01BUkdJTikgbGVmdCA9IFZJRVdQT1JUX01BUkdJTjtcbiAgaWYgKGxlZnQgKyB0aXBSZWN0LndpZHRoID4gdmlld3BvcnRXIC0gVklFV1BPUlRfTUFSR0lOKSB7XG4gICAgbGVmdCA9IHZpZXdwb3J0VyAtIFZJRVdQT1JUX01BUkdJTiAtIHRpcFJlY3Qud2lkdGg7XG4gIH1cbiAgLy8gVmVydGljYWw6IHByZWZlciBhYm92ZSB0aGUgaWNvbjsgZmxpcCBiZWxvdyBpZiB0aGVyZSdzIG5vIHJvb20gdXAgdG9wLlxuICBsZXQgdG9wID0gaWNvblJlY3QudG9wIC0gdGlwUmVjdC5oZWlnaHQgLSA2O1xuICBpZiAodG9wIDwgVklFV1BPUlRfTUFSR0lOKSB0b3AgPSBpY29uUmVjdC5ib3R0b20gKyA2O1xuICAvLyBGaW5hbCBzYWZldHk6IGNsYW1wIGludG8gdmlld3BvcnQgc28gdmVyeSBsb25nIHRvb2x0aXBzIGNhbid0IGJsZWVkXG4gIC8vIG9mZiB0aGUgYm90dG9tIGVpdGhlci5cbiAgaWYgKHRvcCArIHRpcFJlY3QuaGVpZ2h0ID4gdmlld3BvcnRIIC0gVklFV1BPUlRfTUFSR0lOKSB7XG4gICAgdG9wID0gTWF0aC5tYXgoVklFV1BPUlRfTUFSR0lOLCB2aWV3cG9ydEggLSBWSUVXUE9SVF9NQVJHSU4gLSB0aXBSZWN0LmhlaWdodCk7XG4gIH1cblxuICBfaGVscFRpcC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gIF9oZWxwVGlwLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG59XG5cbmZ1bmN0aW9uIF9oaWRlSGVscFRvb2x0aXAoKSB7XG4gIF9oZWxwVGlwLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xufVxuXG4vLyBEZWxlZ2F0ZWQgaG92ZXIgaGFuZGxlcnMgXHUyMDE0IHdvcmtzIGZvciBpY29ucyBhZGRlZCBhZnRlciBwb3B1cCBsb2FkIHRvb1xuLy8gKGUuZy4gd2hlbiBtb2RlIHRvZ2dsZSByZXZlYWxzIGJhY2tlbmQtb25seSBmaWVsZHMpLlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCAoZSkgPT4ge1xuICBjb25zdCBpY29uID0gZS50YXJnZXQuY2xvc2VzdD8uKFwiLmhlbHAtaWNvblwiKTtcbiAgaWYgKGljb24pIF9zaG93SGVscFRvb2x0aXAoaWNvbik7XG59KTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCAoZSkgPT4ge1xuICBjb25zdCBpY29uID0gZS50YXJnZXQuY2xvc2VzdD8uKFwiLmhlbHAtaWNvblwiKTtcbiAgaWYgKGljb24pIF9oaWRlSGVscFRvb2x0aXAoKTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBpbml0KCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZlcnNpb25cIikudGV4dENvbnRlbnQgPVxuICAgIFwidlwiICsgY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW4tb2stbmV4dFwiKVxuICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IF9zZXRBY3RpdmVTdGVwKDIpKTtcblxuICBhd2FpdCBsb2FkTWFza05hbWVFbmFibGVkKCk7XG5cbiAgLy8gU2VlZCBsb2NhbCBidW5kbGUgc3RhdGUgZnJvbSBzdG9yYWdlIHNvIHRoZSBkYXRhLXN0YXRlIGNhcmQgaXNcbiAgLy8gcG9wdWxhdGVkIGFzIHNvb24gYXMgdGhlIHBvcHVwIHJlbmRlcnMgKG5vIGZsYXNoIG9mIFwiXHU2NzJBXHU3NTIyXHU3NTFGXCIpLlxuICBhd2FpdCBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcblxuICAvLyBPcmRlciBtYXR0ZXJzOiBsb2FkQmFja2VuZFVybCBwb3B1bGF0ZXMgZWxzLmJhY2tlbmRVcmwudmFsdWUsIHdoaWNoXG4gIC8vIGxvYWRTeW5jTW9kZSgpIHJlYWRzIHZpYSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKS4gUmV2ZXJzZSB0aGlzIGFuZFxuICAvLyB0aGUgYXV0by10ZXN0IHNlZXMgYW4gZW1wdHkgVVJMIGFuZCBmYWxzZWx5IHJlcG9ydHMgXCJcdTY3MkFcdThBMkRcdTVCOUEgQmFja2VuZCBVUkxcIlxuICAvLyBvbiBldmVyeSBwb3B1cCBvcGVuLiBsb2FkQmFja2VuZE1vZGVFbmFibGVkIGFsc28gaGFzIHRvIGxhbmQgYmVmb3JlXG4gIC8vIGxvYWRTeW5jTW9kZTogdGhlIGxhdHRlciBjb25zdWx0cyBib2R5W2RhdGEtYmFja2VuZC1lbmFibGVkXSB0b1xuICAvLyBkZWNpZGUgd2hldGhlciBhIHN0b3JlZCBcImJhY2tlbmRcIiBtb2RlIGlzIGhvbm9yZWQgb3IgZm9yY2VkIHRvIGxvY2FsLlxuICBhd2FpdCBsb2FkQmFja2VuZE1vZGVFbmFibGVkKCk7XG4gIGF3YWl0IGxvYWRCYWNrZW5kVXJsKCk7XG4gIGF3YWl0IGxvYWRTeW5jTW9kZSgpO1xuICBhd2FpdCBsb2FkUGF0aWVudE92ZXJyaWRlKCk7XG4gIGF3YWl0IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG5cbiAgY29uc3QgdGFiID0gYXdhaXQgZ2V0QWN0aXZlVGFiKCk7XG4gIGlmICghdGFiPy51cmwpIHtcbiAgICBzZXRTdGF0dXMoXCJubyBhY3RpdmUgdGFiXCIsIFwiZXJyb3JcIik7XG4gICAgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFN5bmMgcmVxdWlyZXMgYmVpbmcgb24gYW4gTkhJIHRhYiBzbyBjb29raWVzL3Nlc3Npb24gYXJlIHVzYWJsZSBmcm9tXG4gIC8vIHRoZSBTVy4gRmxhZyB2aWEgZGF0YXNldCBzbyBfcmVmcmVzaEJ1dHRvblN0YXRlcyBjYW4gY29tYmluZSB0aGlzXG4gIC8vIHdpdGggdGhlIG1vZGUgKyBjb25uIHN0YXRlLiBXaGVuIG9mZi1OSEksIGFsc28gc3VyZmFjZSB0aGVcbiAgLy8gXCJcdUQ4M0RcdUREMTcgXHU5NThCXHU1NTVGXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU3NjdCXHU1MTY1XCIgYmFubmVyIHNvIHVzZXJzIGRvbid0IHdvbmRlciB3aGVyZSB0byBnby5cbiAgY29uc3Qgb25OaGkgPSBpc05oaVRhYih0YWIudXJsKTtcbiAgaWYgKG9uTmhpKSBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGVsc2UgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgaWYgKGVscy5vcGVuTmhpU2VjdGlvbikgZWxzLm9wZW5OaGlTZWN0aW9uLmhpZGRlbiA9IG9uTmhpO1xuICAvLyBTdGFzaCB0aGUgTkhJIHRhYiBpZCBzbyB0aGUgXCJcdTkxQ0RcdTY1QjBcdTY1NzRcdTc0MDZcdTk4MDFcdTk3NjJcIiBidXR0b24gaW5zaWRlIHRoZVxuICAvLyBuZWVkcy1sb2dpbiBiYW5uZXIgY2FuIHJlbG9hZCBpdCB3aXRob3V0IGhhdmluZyB0byByZS1xdWVyeSB0YWJzLlxuICBfbmhpVGFiSWQgPSBvbk5oaSA/IHRhYi5pZCA6IG51bGw7XG5cbiAgLy8gV2hlbiBvbiB0aGUgTkhJIHRhYiwgYXNrIGJhY2tncm91bmQgdG8gdmVyaWZ5IHRoZXJlJ3MgYW4gYWN0aXZlXG4gIC8vIHNlc3Npb24uIFRoZSBTVyBwcm9iZXMgSUhLRTM0MTAgd2l0aCBzZXNzaW9uU3RvcmFnZS50b2tlbiBcdTIwMTQgY2hlYXBcbiAgLy8gYW5kIG9ubHkgc3VjY2VlZHMgd2hlbiB0aGUgdXNlciBoYXMgbG9nZ2VkIGluLiBBbnl0aGluZyBidXQgYHRydWVgXG4gIC8vIChmYWxzZSwgbnVsbCwgb3Igbm8gcmVzcG9uc2UpIG1ha2VzIHVzIGFzc3VtZSBcIm5vdCBsb2dnZWQgaW5cIiBzb1xuICAvLyB0aGUgdXNlciBzZWVzIHRoZSBhY3Rpb25hYmxlIGJhbm5lciBpbnN0ZWFkIG9mIG1hc2hpbmcgdGhlIENUQVxuICAvLyBpbnRvIGEgZGVsYXllZCBcIlx1RDgzRFx1REQxMiBcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcIiBzdGF0dXMuXG4gIGlmIChvbk5oaSAmJiB0YWIuaWQpIHtcbiAgICBjaHJvbWUucnVudGltZVxuICAgICAgLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJjaGVja05oaUxvZ2luXCIsIHRhYklkOiB0YWIuaWQgfSlcbiAgICAgIC50aGVuKChyZXNwKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvZ2dlZEluID0gcmVzcD8ubG9nZ2VkSW4gPT09IHRydWU7XG4gICAgICAgIGlmIChsb2dnZWRJbikgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgICAgIGVsc2UgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiA9IFwibm9cIjtcbiAgICAgICAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbikge1xuICAgICAgICAgIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSBsb2dnZWRJbjtcbiAgICAgICAgfVxuICAgICAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgICAvLyBMb2dpbiBwcm9iZSBjb21wbGV0aW5nIHBvc2l0aXZlbHkgaXMgdGhlIHN0ZXAtMSBpbnRlbnRpb25hbFxuICAgICAgICAvLyBjb21wbGV0aW9uIGV2ZW50IFx1MjAxNCBhZHZhbmNlIHRoZSB3aXphcmQgb25jZSBpZiB0aGUgdXNlciBpc1xuICAgICAgICAvLyBjdXJyZW50bHkgbG9va2luZyBhdCBzdGVwIDEuXG4gICAgICAgIGlmIChsb2dnZWRJbiAmJiBfd2l6YXJkSW5pdGlhbGl6ZWQpIF9tYXliZUF1dG9BZHZhbmNlKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgLy8gSWYgdGhlIHByb2JlIGZhaWxzIChTVyB1bnJlYWNoYWJsZSwgZXRjKSwgZG9uJ3QgcHVuaXNoIHRoZVxuICAgICAgICAvLyB1c2VyIFx1MjAxNCBsZWF2ZSB0aGUgQ1RBIGVuYWJsZWQgYW5kIGxldCB0aGUgc3luYydzIG93biBzZXNzaW9uXG4gICAgICAgIC8vIGNoZWNrIHN1cmZhY2UgYSByZWFsIGVycm9yIGlmIG5lZWRlZC5cbiAgICAgICAgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgICAgIGlmIChlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24pIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgICAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbikgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gIH1cblxuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuXG4gIC8vIFN0YXJ0IHRoZSB3aXphcmQgQUZURVIgYWxsIGluaXRpYWwgc3RhdGUgaXMgbG9hZGVkIFx1MjAxNCB0aGlzIHBpY2tzXG4gIC8vIHRoZSBjb3JyZWN0IHN0YXJ0aW5nIHN0ZXAgKGUuZy4gcmV0dXJuaW5nIHVzZXIgd2l0aCB2YWxpZCBzZXNzaW9uXG4gIC8vIGxhbmRzIG9uIHN0ZXAgMyBkaXJlY3RseSkuXG4gIF9pbml0V2l6YXJkKCk7XG5cbiAgLy8gUmUtYXR0YWNoIHRvIGFueSBzeW5jIHRoYXQncyBjdXJyZW50bHkgcnVubmluZyBpbiB0aGUgc2VydmljZSB3b3JrZXIuXG4gIC8vIFRoaXMgaXMgd2hhdCBsZXRzIHRoZSB1c2VyIGNsb3NlICsgcmVvcGVuIHRoZSBwb3B1cCBtaWQtc3luYy5cbiAgYXdhaXQgcmVmcmVzaFN5bmNTdGF0dXNGcm9tQmFja2dyb3VuZCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZWZyZXNoU3luY1N0YXR1c0Zyb21CYWNrZ3JvdW5kKCkge1xuICBjb25zdCBzdGF0dXMgPSBhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiZ2V0U3luY1N0YXR1c1wiIH0pLmNhdGNoKCgpID0+IG51bGwpO1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBhcHBseVN5bmNTdGF0dXMoc3RhdHVzKTtcbn1cblxuLy8gTGF0ZXN0IHN0YXR1cyBzbmFwc2hvdCBcdTIwMTQga2VlcGluZyBpdCBsZXRzIHRoZSBsaXZlLWVsYXBzZWQgdGlja2VyXG4vLyByZXBhaW50IHRoZSBzYW1lIHByb2dyZXNzIHRleHQgd2l0aCBhbiB1cGRhdGVkIGBbTnNdYCBwcmVmaXggZXZlcnlcbi8vIHNlY29uZCB3aXRob3V0IHNwYW1taW5nIGNocm9tZS5zdG9yYWdlIGZyb20gdGhlIHNlcnZpY2Ugd29ya2VyLlxubGV0IF9sYXRlc3RTdGF0dXMgPSBudWxsO1xubGV0IF9lbGFwc2VkVGlja2VySWQgPSBudWxsO1xuXG5mdW5jdGlvbiBfZm10RWxhcHNlZChtcykge1xuICBpZiAobXMgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gMTAwMCl9c2A7XG4gIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gNjBfMDAwKX1tJHtNYXRoLnJvdW5kKChtcyAlIDYwXzAwMCkgLyAxMDAwKX1zYDtcbn1cblxuZnVuY3Rpb24gX3JlbmRlclN0YXR1cygpIHtcbiAgY29uc3Qgc3RhdHVzID0gX2xhdGVzdFN0YXR1cztcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgbGV0IHRleHQgPSBzdGF0dXMucHJvZ3Jlc3MgfHwgXCIoc3luYyBcdTkwMzJcdTg4NENcdTRFMkQpXCI7XG4gIGlmIChzdGF0dXMucnVubmluZyAmJiBzdGF0dXMuc3RhcnRlZCkge1xuICAgIGNvbnN0IGVsYXBzZWQgPSBEYXRlLm5vdygpIC0gc3RhdHVzLnN0YXJ0ZWQ7XG4gICAgdGV4dCA9IGBcdTIzRjEgJHtfZm10RWxhcHNlZChlbGFwc2VkKX0gXHUwMEI3ICR7dGV4dH1gO1xuICB9XG4gIGNvbnN0IGtpbmQgPSBzdGF0dXMucnVubmluZyA/IFwiaW5mb1wiIDogKHN0YXR1cy5waGFzZSA9PT0gXCJlcnJvclwiID8gXCJlcnJvclwiIDogXCJzdWNjZXNzXCIpO1xuICBjb25zdCBicmVha2Rvd24gPSBzdGF0dXMucnVubmluZyA/IG51bGwgOiBzdGF0dXMuYnJlYWtkb3duO1xuICBzZXRTdGF0dXModGV4dCwga2luZCwgYnJlYWtkb3duKTtcbn1cblxuZnVuY3Rpb24gYXBwbHlTeW5jU3RhdHVzKHN0YXR1cykge1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBfbGF0ZXN0U3RhdHVzID0gc3RhdHVzO1xuICBfcmVuZGVyU3RhdHVzKCk7XG4gIC8vIFN0YXR1cyBiYW5uZXIgbGl2ZXMgaW5zaWRlIHN0ZXAgMyBcdTIwMTQgZm9yY2UtanVtcCB0aGVyZSBzbyBpdCdzXG4gIC8vIGFjdHVhbGx5IHZpc2libGUuIFJ1bm5pbmcgc3luYyBPUiBhIGZyZXNoIGNvbXBsZXRpb24gYm90aCB3YXJyYW50XG4gIC8vIGJlaW5nIG9uIHRoZSByZXN1bHQgc3RlcC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCAmJiBfYWN0aXZlU3RlcCAhPT0gMykge1xuICAgIF9zZXRBY3RpdmVTdGVwKDMsIHsgc2lsZW50OiB0cnVlIH0pO1xuICB9XG4gIGlmIChzdGF0dXMucnVubmluZykge1xuICAgIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBlbHMuc3luY0FwaUJ0bi50ZXh0Q29udGVudCA9IFwiXHU1M0Q2XHU1Rjk3XHU0RTJEXHUyMDI2XCI7XG4gICAgZWxzLnN0b3BCdG4uaGlkZGVuID0gZmFsc2U7XG4gICAgaWYgKCFfZWxhcHNlZFRpY2tlcklkKSB7XG4gICAgICBfZWxhcHNlZFRpY2tlcklkID0gc2V0SW50ZXJ2YWwoX3JlbmRlclN0YXR1cywgMTAwMCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGVscy5zdG9wQnRuLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF9lbGFwc2VkVGlja2VySWQpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoX2VsYXBzZWRUaWNrZXJJZCk7XG4gICAgICBfZWxhcHNlZFRpY2tlcklkID0gbnVsbDtcbiAgICB9XG4gICAgLy8gUmUtZGVyaXZlIHN5bmMgYnV0dG9uIGVuYWJsZWQgc3RhdGUgZnJvbSBtb2RlL2Nvbm4vTkhJLXRhYiBpbnN0ZWFkXG4gICAgLy8gb2YgdW5jb25kaXRpb25hbGx5IGVuYWJsaW5nIFx1MjAxNCBrZWVwcyB0aGUgYnV0dG9uIGRpc2FibGVkIHdoZW4gd2VcbiAgICAvLyBrbm93IHdlIHNob3VsZG4ndCBzeW5jIChlLmcuIGJhY2tlbmQgZG93biwgb2ZmLU5ISSB0YWIpLlxuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgLy8gU3luYyBqdXN0IGZpbmlzaGVkIFx1MjAxNCBib3RoIHNpZGVzIG1heSBoYXZlIGNoYW5nZWQgKGJhY2tlbmQgZ290XG4gICAgLy8gbmV3IHJlc291cmNlcyBpbiBiYWNrZW5kIG1vZGUsIGxvY2FsIGJ1bmRsZSB3YXMgc3Rhc2hlZCBpbiBlaXRoZXJcbiAgICAvLyBtb2RlKS4gUmVmcmVzaCBkYXRhLXN0YXRlIGNhcmQgc28gdGhlIHVzZXIgc2VlcyB1cC10by1kYXRlIGNvdW50cy5cbiAgICBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcbiAgICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiYgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIH1cbn1cblxuLy8gU3RvcCB0aGUgaW4tcHJvZ3Jlc3Mgc3luYy4gVHdvLXByb25nZWQgc28gaXQgd29ya3MgZXZlbiB3aGVuIHRoZVxuLy8gc2VydmljZSB3b3JrZXIgaGFzIGRpZWQ6ICgxKSB0ZWxsIHRoZSBTVyB0byBzZXQgaXRzIGNhbmNlbCBmbGFnLFxuLy8gKDIpIHdyaXRlIHN0b3JhZ2UgZGlyZWN0bHkgdG8gcnVubmluZzpmYWxzZSBzbyB0aGUgcG9wdXAgVUkgdW5mcmVlemVzXG4vLyBpbW1lZGlhdGVseSBldmVuIGlmIHRoZSBTVyBtZXNzYWdlIGNhbid0IGJlIGRlbGl2ZXJlZC5cbmFzeW5jIGZ1bmN0aW9uIHN0b3BTeW5jKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgcHJvZ3Jlc3M6IFwiXHUyNkQ0IFx1NTA1Q1x1NkI2Mlx1NEUyRFx1RkYwQ1x1NkI2M1x1NTcyOFx1NkUwNVx1OTY2NFx1OTBFOFx1NTIwNlx1OENDN1x1NjU5OVx1MjAyNlwiLFxuICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICB0czogRGF0ZS5ub3coKSxcbiAgICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9KTtcbiAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NTA1Q1x1NkI2Mlx1NEUyRFx1RkYwQ1x1NkI2M1x1NTcyOFx1NkUwNVx1OTY2NFx1OTBFOFx1NTIwNlx1OENDN1x1NjU5OVx1MjAyNlwiLCBcImluZm9cIik7XG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzdG9wU3luY1wiIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgZWxzLnN0b3BCdG4uaGlkZGVuID0gdHJ1ZTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbn1cblxuLy8gTGl2ZSBwcm9ncmVzcyB1cGRhdGVzIFx1MjAxNCBsaXN0ZW4gb24gY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkIHNvIHdlIGdldFxuLy8gZXZlcnkgdXBkYXRlIHRoZSBTVyB3cml0ZXMsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgU1cncyBicm9hZGNhc3Rcbi8vIHNlbmRNZXNzYWdlIHJlYWNoZWQgdXMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBjaGFuZ2VzLnN5bmNTdGF0dXMpIHtcbiAgICBhcHBseVN5bmNTdGF0dXMoY2hhbmdlcy5zeW5jU3RhdHVzLm5ld1ZhbHVlKTtcbiAgfVxufSk7XG5cbi8vIChMZWdhY3kgaW4tbWVtb3J5IGJyb2FkY2FzdCBzdGlsbCBsaXN0ZW5lZCB0byBhcyBhIGJhY2t1cC4pXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZykgPT4ge1xuICBpZiAobXNnPy50eXBlID09PSBcInN5bmNQcm9ncmVzc1wiKSB7XG4gICAgYXBwbHlTeW5jU3RhdHVzKG1zZy5zdGF0dXMpO1xuICB9XG59KTtcblxuLy8gUHJlLWZsaWdodCBkZXRlY3Rpb24gZm9yIE5ISSBsb2dpbiBzdGF0ZS4gVHdvIHNpZ25hbHMgKGVpdGhlciB0cmlnZ2Vycyk6XG4vLyAgMS4gVVJMIGlzIGluIE5ISSBhdXRoIG5hbWVzcGFjZSAoSUhLRTMwOTlTeHgpIFx1MjAxNCBsb2dpbiAvIElDIGNhcmQgcGFnZXNcbi8vICAyLiBQYWdlIGNvbnRhaW5zIGEgcGFzc3dvcmQgaW5wdXQgb3Iga25vd24gbG9nZ2VkLW91dCBwaHJhc2VzXG5hc3luYyBmdW5jdGlvbiBpc09uTmhpTG9naW5QYWdlKHRhYklkLCB1cmwpIHtcbiAgaWYgKHVybD8ucGF0aG5hbWUgJiYgL0lIS0UzMDk5Ly50ZXN0KHVybC5wYXRobmFtZSkpIHJldHVybiB0cnVlO1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXScpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY29uc3QgdGV4dCA9IChkb2N1bWVudC5ib2R5Py5pbm5lclRleHQgfHwgXCJcIikudHJpbSgpO1xuICAgICAgICBjb25zdCBwaHJhc2VzID0gW1xuICAgICAgICAgIFwiXHU4QUNCXHU0RjdGXHU3NTI4XHU1MDY1XHU0RkREXHU1MzYxXCIsIFwiXHU4QUNCXHU2M0QyXHU1MTY1XHU1MDY1XHU0RkREXHU1MzYxXCIsIFwiXHU4QUNCXHU2M0QyXHU1MTY1XHU2MEE4XHU3Njg0XHU1MDY1XHU0RkREXHU1MzYxXCIsXG4gICAgICAgICAgXCJcdTc2N0JcdTUxNjVcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0FcIiwgXCJcdTc2N0JcdTUxNjVcdTU5MzFcdTY1NTdcIiwgXCJcdThBQ0JcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcIixcbiAgICAgICAgICBcIlNlc3Npb24gXHU1REYyXHU5MDNFXHU2NjQyXCIsIFwic2Vzc2lvbiBcdTVERjJcdTkwM0VcdTY2NDJcIiwgXCJcdTVERjJcdTkwM0VcdTY2NDJcIixcbiAgICAgICAgICBcIlx1OEFDQlx1NEVFNVx1NTA2NVx1NEZERFx1NTM2MVx1NzY3Qlx1NTE2NVwiLFxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gcGhyYXNlcy5zb21lKChwKSA9PiB0ZXh0LmluY2x1ZGVzKHApKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gXHUyNkExIE5ISSBBUEktZGlyZWN0IHN5bmMgXHUyMDE0IHByaW1hcnkgcGF0aC4gSGl0cyBOSEkncyB1bmRlcmx5aW5nIEpTT05cbi8vIGVuZHBvaW50cyBpbiBwYXJhbGxlbCBhbmQgcG9zdHMgYWRhcHRlZCBpdGVtcyB0byAvc3luYy91cGxvYWQtc3RydWN0dXJlZC5cbi8vIFJlcXVpcmVzIHBhdGllbnRfb3ZlcnJpZGUgdG8gYmUgZmlsbGVkLlxuLy8gQ29udmVydCBhIGJhY2tlbmQgVVJMIFx1MjE5MiB0aGUgb3JpZ2luLXBhdHRlcm4gQ2hyb21lIHdhbnRzIGZvciBwZXJtaXNzaW9uXG4vLyByZXF1ZXN0cy4gXCJodHRwOi8vMTkyLjE2OC4xLjU6ODAxMFwiIFx1MjE5MiBcImh0dHA6Ly8xOTIuMTY4LjEuNTo4MDEwLypcIi5cbi8vIFJldHVybnMgbnVsbCB3aGVuIHRoZSBVUkwgaXNuJ3QgcGFyc2VhYmxlIHNvIHRoZSBjYWxsZXIgY2FuIHNob3J0LWNpcmN1aXQuXG5mdW5jdGlvbiBfb3JpZ2luUGF0dGVybkZvcih1cmwpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gbmV3IFVSTCh1cmwpO1xuICAgIHJldHVybiBgJHt1LnByb3RvY29sfS8vJHt1Lmhvc3R9LypgO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBCYWNrZW5kLW1vZGUgcHJlLWZsaWdodDogZW5zdXJlIHRoZSBleHRlbnNpb24gaGFzIGhvc3QgcGVybWlzc2lvbiBmb3Jcbi8vIHRoZSB1c2VyLWNvbmZpZ3VyZWQgYmFja2VuZCBVUkwuIExvY2FsaG9zdCAvIDEyNy4wLjAuMSBhcmUgY292ZXJlZCBieVxuLy8gdGhlIGRlZmF1bHQgbWFuaWZlc3QgaG9zdF9wZXJtaXNzaW9uczsgcmVtb3RlIC8gTEFOIC8gcHJvZHVjdGlvbiBVUkxzXG4vLyBuZWVkIGEgb25lLXRpbWUgdXNlciBncmFudC4gTXVzdCBydW4gZnJvbSBhIHVzZXIgZ2VzdHVyZSAoYnV0dG9uIGNsaWNrKS5cbmFzeW5jIGZ1bmN0aW9uIGVuc3VyZUJhY2tlbmRQZXJtaXNzaW9uKGJhY2tlbmRVcmwpIHtcbiAgY29uc3QgcGF0dGVybiA9IF9vcmlnaW5QYXR0ZXJuRm9yKGJhY2tlbmRVcmwpO1xuICBpZiAoIXBhdHRlcm4pIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgQmFja2VuZCBVUkwgXHU3MTIxXHU2Q0Q1XHU4OUUzXHU2NzkwOiAke2JhY2tlbmRVcmx9YCB9O1xuICBjb25zdCBhbHJlYWR5ID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHsgb3JpZ2luczogW3BhdHRlcm5dIH0pO1xuICBpZiAoYWxyZWFkeSkgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgbGV0IGdyYW50ZWQ7XG4gIHRyeSB7XG4gICAgZ3JhbnRlZCA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5yZXF1ZXN0KHsgb3JpZ2luczogW3BhdHRlcm5dIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCByZWFzb246IGBcdTZCMEFcdTk2NTBcdThBQ0JcdTZDNDJcdTU5MzFcdTY1NTc6ICR7ZS5tZXNzYWdlfWAgfTtcbiAgfVxuICByZXR1cm4gZ3JhbnRlZFxuICAgID8geyBvazogdHJ1ZSB9XG4gICAgOiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgXHU2NzJBXHU2Mzg4XHU2QjBBXHU5MDIzXHU3RERBXHU1MjMwICR7cGF0dGVybn0gXHUyMDE0IFx1NTNENlx1NkQ4OGAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYXBpU3luY05oaSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdikge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTU2REUgXHUyNDYxIFx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVx1RkYxQVx1OEFDQlx1OTA3OFx1NjRDN1x1NjAyN1x1NTIyNVx1MzAwMVx1NTg2Qlx1NzUxRlx1NjVFNVx1NUY4Q1x1NjMwOVx1NzhCQVx1NUI5QVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFByZS1mbGlnaHQ6IGNoZWNrIHdlJ3JlIG9uIGFuIE5ISSB0YWIgc28gY29va2llcyBhcmUgdXNhYmxlIGZyb20gU1cuXG4gIGNvbnN0IHRhYiA9IGF3YWl0IGdldEFjdGl2ZVRhYigpO1xuICBsZXQgdXJsO1xuICB0cnkgeyB1cmwgPSBuZXcgVVJMKHRhYi51cmwpOyB9IGNhdGNoIHsgc2V0U3RhdHVzKFwiYWN0aXZlIHRhYiBoYXMgbm8gVVJMXCIsIFwiZXJyb3JcIik7IHJldHVybjsgfVxuICBjb25zdCBvbkxvZ2luID0gYXdhaXQgaXNPbk5oaUxvZ2luUGFnZSh0YWIuaWQsIHVybCk7XG4gIGlmIChvbkxvZ2luKSB7XG4gICAgc2V0U3RhdHVzKFwiXHVEODNEXHVERDEyIFx1NTZERSBcdTI0NjAgXHU3NjdCXHU1MTY1XHVGRjFBXHU1QzFBXHU2NzJBXHU3NjdCXHU1MTY1XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQmFja2VuZCBtb2RlOiByZS12ZXJpZnkgY29ubmVjdGl2aXR5IHJpZ2h0IGhlcmUgZXZlbiBpZiB0aGUgYmFubmVyXG4gIC8vIGxhc3Qgc2FpZCBvay4gQmV0d2VlbiB0aGUgcHJldmlvdXMgY2hlY2sgYW5kIHRoaXMgY2xpY2sgdGhlIHVzZXJcbiAgLy8gbWF5IGhhdmUgc3RvcHBlZCBkb2NrZXI7IHdpdGhvdXQgYSBmcmVzaCBwcm9iZSB3ZSdkIHN0YXJ0IGFuIHVwbG9hZFxuICAvLyB0aGF0IGZhaWxzIG1pZC1mbGlnaHQgYWZ0ZXIgcGFydGlhbCBkYXRhIGhhcyBoaXQgKG9yIGZhaWxlZCB0byBoaXQpXG4gIC8vIHRoZSBiYWNrZW5kLiBDaGVhcCAoXHUyMjY0NXMpIGFuZCBzYXZlcyBhIGxvdCBvZiBjb25mdXNpb24uXG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikge1xuICAgIGNvbnN0IG9rID0gYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gICAgaWYgKCFvaykge1xuICAgICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NUY4Q1x1N0FFRlx1OTAyM1x1N0REQVx1NTkzMVx1NjU1NyBcdTIwMTQgXHU4QUNCXHU3NzBCXHU5ODAyXHU5MEU4IGJhbm5lciBcdTc2ODRcdThBQUFcdTY2MEVcIiwgXCJlcnJvclwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBzeW5jU3RhdHVzOiB7XG4gICAgICBydW5uaW5nOiB0cnVlLFxuICAgICAgcHJvZ3Jlc3M6IFwiXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsXG4gICAgICBwaGFzZTogXCJzdGFydGluZ1wiLCBzdGFydGVkOiBEYXRlLm5vdygpLCB0czogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9KTtcbiAgc2V0U3RhdHVzKFwiXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcblxuICAvLyBDb21wdXRlIGRhdGUgcmFuZ2UgZnJvbSB0aGUgZHJvcGRvd24uIFwiMVwiID0gTkhJJ3MgZGVmYXVsdCB3aW5kb3c7XG4gIC8vIGFueXRoaW5nIGVsc2UgaXMgXCJ0b2RheSBiYWNrIE4geWVhcnNcIi4gSGVscGVyIGluc2lkZSBiYWNrZ3JvdW5kLmpzXG4gIC8vIGNvbnZlcnRzIHRvIFx1NkMxMVx1NTcwQiBmb3IgTkhJJ3MgQVBJLlxuICBjb25zdCByYW5nZVNlbCA9IGVscy5hcGlTeW5jUmFuZ2U/LnZhbHVlIHx8IFwiM1wiO1xuICBsZXQgZGF0ZVJhbmdlID0gbnVsbDtcbiAgY29uc3QgUkFOR0VfTEFCRUxTID0ge1xuICAgIFwiMVwiOiAgIFwiXHU2NzAwXHU4RkQxIDEgXHU1RTc0XCIsXG4gICAgXCIzXCI6ICAgXCJcdTY3MDBcdThGRDEgMyBcdTVFNzRcIixcbiAgICBcIjVcIjogICBcIlx1NjcwMFx1OEZEMSA1IFx1NUU3NFwiLFxuICAgIFwiMTBcIjogIFwiXHU2NzAwXHU4RkQxIDEwIFx1NUU3NFwiLFxuICAgIFwiYWxsXCI6IFwiXHU1MTY4XHU5MEU4XHU2Qjc3XHU1M0YyXHU3RDAwXHU5MzA0XCIsXG4gIH07XG4gIGNvbnN0IGRhdGVSYW5nZUxhYmVsID0gUkFOR0VfTEFCRUxTW3JhbmdlU2VsXSB8fCBgXHU2NzAwXHU4RkQxICR7cmFuZ2VTZWx9IFx1NUU3NGA7XG4gIGlmIChyYW5nZVNlbCAhPT0gXCIxXCIpIHtcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZW5kID0gdG9kYXkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgbGV0IHN0YXJ0O1xuICAgIGlmIChyYW5nZVNlbCA9PT0gXCJhbGxcIikge1xuICAgICAgc3RhcnQgPSBcIjIwMDEtMDEtMDFcIjsgIC8vIFx1NkMxMVx1NTcwQiA5MCBcdTIwMTQgZmFyIGVub3VnaCBiYWNrIGZvciBhbnkgY2xpbmljYWwgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB5ZWFycyA9IHBhcnNlSW50KHJhbmdlU2VsLCAxMCk7XG4gICAgICBjb25zdCBzID0gbmV3IERhdGUodG9kYXkpO1xuICAgICAgcy5zZXRGdWxsWWVhcihzLmdldEZ1bGxZZWFyKCkgLSB5ZWFycyk7XG4gICAgICBzdGFydCA9IHMudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICAgIGRhdGVSYW5nZSA9IHsgc3RhcnQsIGVuZCB9O1xuICB9XG5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIHR5cGU6IFwic3RhcnROaGlBcGlTeW5jXCIsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdGFiSWQ6IHRhYi5pZCxcbiAgICAgIG1vZGU6IGN1cnJlbnRNb2RlKCksXG4gICAgICBiYWNrZW5kOiBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCksXG4gICAgICBzeW5jQXBpS2V5OiBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCksXG4gICAgICBuaGlCYXNlOiBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHdcIixcbiAgICAgIHBhdGllbnRPdmVycmlkZTogb3YsXG4gICAgICBkYXRlUmFuZ2UsXG4gICAgICBkYXRlUmFuZ2VMYWJlbCxcbiAgICB9LFxuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxhdW5jaCgpIHtcbiAgY29uc3QgYmFja2VuZCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKTtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgcmF3SWQgPSBvdj8uaWRfbm87XG4gIGNvbnN0IHNtYXJ0QXBwTGF1bmNoID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKSB8fCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIGlmICghcmF3SWQpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTkwODRcdTZDOTJcdTY3MDlcdTc1QzVcdTRFQkFcdThFQUJcdTUyMDZcdThCNDkgXHUyMDE0IFx1OEFDQlx1NTE0OFx1NjMwOVx1MzAwQ1x1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MzAwRFx1NjI5M1x1NEUwMFx1NkIyMVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBCYWNrZW5kIHRyYWNrcyBQYXRpZW50IHVuZGVyIGl0cyBoYXNoZWQgRkhJUiBpZCwgbm90IHRoZSByYXcgbmF0aW9uYWwgSUQuXG4gIGNvbnN0IHBhdGllbnRJZCA9IGRlcml2ZVBhdGllbnRJZChyYXdJZCk7XG4gIC8vIFJlLXRlc3QgY29ubmVjdGlvbiBldmVuIGlmIGJhbm5lciBzaG93cyBvayBcdTIwMTQgYmFja2VuZCBtYXkgaGF2ZSBnb25lXG4gIC8vIGRvd24gc2luY2UgdGhlIGxhc3QgcHJvYmUuXG4gIGNvbnN0IG9rID0gYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIGlmICghb2spIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1RjhDXHU3QUVGXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3IFx1MjAxNCBcdThBQ0JcdTc3MEJcdTk4MDJcdTkwRTggYmFubmVyIFx1NzY4NFx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZXRTdGF0dXMoXCJcdTVFRkFcdTdBQ0IgbGF1bmNoIGNvbnRleHRcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3NtYXJ0L2xhdW5jaC1jb250ZXh0YCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGF0aWVudF9pZDogcGF0aWVudElkIH0pLFxuICAgIH0pO1xuICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYCR7cmVzLnN0YXR1c306ICR7YXdhaXQgcmVzLnRleHQoKX1gKTtcbiAgICBjb25zdCB7IGxhdW5jaCB9ID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHsgaXNzOiBgJHtiYWNrZW5kfS9maGlyYCwgbGF1bmNoIH0pO1xuICAgIC8vIEFwcGVuZCBpc3MgKyBsYXVuY2ggcGFyYW1zLCByZXNwZWN0aW5nIGFueSBleGlzdGluZyBxdWVyeSBzdHJpbmcuXG4gICAgY29uc3Qgc2VwID0gc21hcnRBcHBMYXVuY2guaW5jbHVkZXMoXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGAke3NtYXJ0QXBwTGF1bmNofSR7c2VwfSR7cGFyYW1zfWAgfSk7XG4gICAgd2luZG93LmNsb3NlKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1Mjc0QyBMYXVuY2ggXHU1OTMxXHU2NTU3XHVGRjFBJHtlLm1lc3NhZ2V9YCwgXCJlcnJvclwiKTtcbiAgfVxufVxuXG5lbHMuc3luY0FwaUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXBpU3luY05oaSk7XG5lbHMuc3RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RvcFN5bmMpO1xuZWxzLm92U2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2F2ZVBhdGllbnRPdmVycmlkZSk7XG5lbHMub3ZDbGVhckJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJQYXRpZW50T3ZlcnJpZGUpO1xuW2Vscy5vdk5hbWUsIGVscy5vdkJpcnRoRGF0ZSwgZWxzLm92R2VuZGVyXS5mb3JFYWNoKChlbCkgPT5cbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkpXG4pO1xuZWxzLmxhdW5jaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGF1bmNoKTtcblxuLy8gXCJcdTUzRDZcdTVGOTdcdTVDMERcdThDNjFcIiBiYW5uZXI6IGNsaWNrIC8gRW50ZXIgLyBTcGFjZSBqdW1wcyBiYWNrIHRvIHN0ZXAgMiBhbmRcbi8vIGV4cGFuZHMgdGhlIHBhdGllbnQgY2FyZCBzbyB0aGUgdXNlciBjYW4gYWRqdXN0IHRoZSBpZGVudGl0eS5cbmZ1bmN0aW9uIF9nb3RvU3RlcDJFZGl0KCkge1xuICBfc2V0QWN0aXZlU3RlcCgyKTtcbn1cbmVscy5hY3RpdmVQYXRpZW50Py5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2dvdG9TdGVwMkVkaXQpO1xuZWxzLmFjdGl2ZVBhdGllbnQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gIGlmIChlLmtleSA9PT0gXCJFbnRlclwiIHx8IGUua2V5ID09PSBcIiBcIikge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBfZ290b1N0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LEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxL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TSxZQUFZLGdCQUFnQixLQUFLO0FBR3ZDLFVBQU0sS0FBSyxNQUFNLHNCQUFzQjtBQUN2QyxRQUFJLENBQUMsSUFBSTtBQUNQLGdCQUFVLHlHQUE4QixPQUFPO0FBQy9DO0FBQUEsSUFDRjtBQUNBLGNBQVUscUNBQXNCLE1BQU07QUFDdEMsUUFBSTtBQUNGLFlBQU0sTUFBTSxNQUFNLE1BQU0sR0FBRyxPQUFPLHlCQUF5QjtBQUFBLFFBQ3pELFFBQVE7QUFBQSxRQUNSLFNBQVMsRUFBRSxnQkFBZ0IsbUJBQW1CO0FBQUEsUUFDOUMsTUFBTSxLQUFLLFVBQVUsRUFBRSxZQUFZLFVBQVUsQ0FBQztBQUFBLE1BQ2hELENBQUM7QUFDRCxVQUFJLENBQUMsSUFBSTtBQUFJLGNBQU0sSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxFQUFFO0FBQ2pFLFlBQU0sRUFBRSxRQUFBQyxRQUFPLElBQUksTUFBTSxJQUFJLEtBQUs7QUFDbEMsWUFBTSxTQUFTLElBQUksZ0JBQWdCLEVBQUUsS0FBSyxHQUFHLE9BQU8sU0FBUyxRQUFBQSxRQUFPLENBQUM7QUFFckUsWUFBTSxNQUFNLGVBQWUsU0FBUyxHQUFHLElBQUksTUFBTTtBQUNqRCxhQUFPLEtBQUssT0FBTyxFQUFFLEtBQUssR0FBRyxjQUFjLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDO0FBQzlELGFBQU8sTUFBTTtBQUFBLElBQ2YsU0FBUyxHQUFHO0FBQ1YsZ0JBQVUsbUNBQWUsRUFBRSxPQUFPLElBQUksT0FBTztBQUFBLElBQy9DO0FBQUEsRUFDRjtBQUVBLE1BQUksV0FBVyxpQkFBaUIsU0FBUyxVQUFVO0FBQ25ELE1BQUksUUFBUSxpQkFBaUIsU0FBUyxRQUFRO0FBQzlDLE1BQUksVUFBVSxpQkFBaUIsU0FBUyxtQkFBbUI7QUFDM0QsTUFBSSxXQUFXLGlCQUFpQixTQUFTLG9CQUFvQjtBQUM3RCxHQUFDLElBQUksUUFBUSxJQUFJLGFBQWEsSUFBSSxRQUFRLEVBQUU7QUFBQSxJQUFRLENBQUMsT0FDbkQsR0FBRyxpQkFBaUIsU0FBUyxzQkFBc0I7QUFBQSxFQUNyRDtBQUNBLE1BQUksVUFBVSxpQkFBaUIsU0FBUyxNQUFNO0FBSTlDLFdBQVMsaUJBQWlCO0FBQ3hCLG1CQUFlLENBQUM7QUFBQSxFQUNsQjtBQUNBLE1BQUksZUFBZSxpQkFBaUIsU0FBUyxjQUFjO0FBQzNELE1BQUksZUFBZSxpQkFBaUIsV0FBVyxDQUFDLE1BQU07QUFDcEQsUUFBSSxFQUFFLFFBQVEsV0FBVyxFQUFFLFFBQVEsS0FBSztBQUN0QyxRQUFFLGVBQWU7QUFDakIscUJBQWU7QUFBQSxJQUNqQjtBQUFBLEVBQ0YsQ0FBQztBQUVELE9BQUs7IiwKICAibmFtZXMiOiBbImNyeXB0byIsICJCdWZmZXIiLCAiYmxvY2tzIiwgImV4cG9ydHMiLCAibGF1bmNoIl0KfQo=
