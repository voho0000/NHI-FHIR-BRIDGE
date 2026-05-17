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

  // ../packages/mapper/src/helpers.ts
  var import_js_sha1 = __toESM(require_sha1(), 1);
  function maskId(id, char = "*") {
    const s = (id ?? "").trim();
    if (!s) return s;
    if (/^[A-Z][12]\d{8}$/.test(s)) return s.slice(0, 6) + char.repeat(4);
    if (s.startsWith("auto-")) return s;
    if (s.length > 6) return s.slice(0, 2) + char.repeat(s.length - 4) + s.slice(-2);
    return s;
  }
  function maskName(name) {
    const trimmed = (name ?? "").trim();
    if (!trimmed || trimmed === "Unknown") return trimmed;
    if (/\s/.test(trimmed)) {
      const parts = trimmed.split(/\s+/);
      if (parts.length === 1) return parts[0];
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
    if (chars.length <= 1) return trimmed;
    if (chars.length === 2) return `${chars[0]}O`;
    return chars[0] + "O".repeat(chars.length - 2) + chars[chars.length - 1];
  }

  // ../packages/mapper/src/observation.ts
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
    if (!url) return false;
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
    bundleMeta: document.getElementById("bundle-meta"),
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
    openNhiBtn: document.getElementById("open-nhi-btn")
  };
  var NHI_LANDING = "https://myhealthbank.nhi.gov.tw/IHKE3000";
  var PENDING_BUNDLE_KEY = "pendingFhirBundle";
  async function loadBackendUrl() {
    const { backendUrl, syncApiKey, smartAppLaunchUrl } = await chrome.storage.sync.get(
      ["backendUrl", "syncApiKey", "smartAppLaunchUrl"]
    );
    els.backendUrl.value = backendUrl || DEFAULT_BACKEND;
    els.syncApiKey.value = syncApiKey || "";
    els.smartAppUrl.value = smartAppLaunchUrl || DEFAULT_SMART_APP_LAUNCH;
    els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
  }
  async function loadPatientOverride() {
    const { patientOverride } = await chrome.storage.sync.get("patientOverride");
    if (patientOverride) {
      els.ovIdNo.value = patientOverride.id_no || "";
      els.ovName.value = patientOverride.name || "";
      els.ovBirthDate.value = patientOverride.birth_date || "";
      els.ovGender.value = patientOverride.gender || "";
    }
    if (els.patientOverrideDetails) {
      els.patientOverrideDetails.open = !patientOverride?.id_no;
    }
    refreshOverrideSummary();
  }
  function getPatientOverride() {
    const id_no = els.ovIdNo.value.trim();
    const name = els.ovName.value.trim();
    if (!id_no && !name) return null;
    const out = id_no ? { id_no } : {};
    if (name) out.name = name;
    const birth_date = els.ovBirthDate.value.trim();
    const gender = els.ovGender.value;
    if (birth_date) out.birth_date = birth_date;
    if (gender) out.gender = gender;
    return out;
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
    if (!ov) {
      els.ovSummary.textContent = "\u672A\u8A2D\u5B9A";
      if (card) card.dataset.state = "empty";
    } else {
      const parts = [maskId(ov.id_no)];
      if (ov.name) parts.push(_maybeMask(ov.name));
      els.ovSummary.textContent = `\u2713 ${parts.join("  \xB7  ")}`;
      if (card) card.dataset.state = "filled";
    }
    _refreshButtonStates();
    _renderDataState();
    refreshPendingBundle();
    _clearStaleSyncStatus(getPatientOverride());
    if (currentMode() === "backend" && _connState === "ok") checkBackendPatient();
  }
  function _clearStaleSyncStatus(ov) {
    if (!_latestStatus) return;
    if (_latestStatus.running) return;
    if (!_latestStatus.histno) return;
    if (ov?.id_no === _latestStatus.histno) return;
    _latestStatus = null;
    setStatus("", null);
    chrome.storage.local.remove("syncStatus").catch(() => {
    });
  }
  async function savePatientOverride() {
    const ov = getPatientOverride();
    if (!ov) {
      setStatus("\u26D4 \u8ACB\u81F3\u5C11\u586B\u5BEB\u59D3\u540D\u6216\u8EAB\u5206\u8B49\u5B57\u865F", "error");
      return;
    }
    if (!ov.id_no) {
      ov.id_no = _generateAutoPatientId();
      els.ovIdNo.value = ov.id_no;
    }
    await chrome.storage.sync.set({ patientOverride: ov });
    refreshOverrideSummary();
    if (els.patientOverrideDetails) els.patientOverrideDetails.open = false;
    const displayName = ov.name ? ` (${_maybeMask(ov.name)})` : "";
    setStatus(`\u2705 \u75C5\u4EBA\u8EAB\u4EFD\u5DF2\u8A18\u4F4F\uFF1A${maskId(ov.id_no)}${displayName}`, "success");
  }
  async function clearPatientOverride() {
    await chrome.storage.sync.remove("patientOverride");
    els.ovIdNo.value = "";
    els.ovName.value = "";
    els.ovBirthDate.value = "";
    els.ovGender.value = "";
    refreshOverrideSummary();
    if (els.patientOverrideDetails) els.patientOverrideDetails.open = true;
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
        "no-url": "\u2717 \u672A\u8A2D\u5B9A Backend URL",
        "no-permission": "\u2717 \u672A\u6388\u6B0A\u9023\u7DDA",
        "network": "\u2717 \u9023\u4E0D\u4E0A\u5F8C\u7AEF",
        "timeout": "\u2717 \u9023\u7DDA\u903E\u6642",
        "http": `\u2717 HTTP ${r.detail || ""}`.trim(),
        "not-fhir": "\u2717 \u56DE\u61C9\u4E0D\u662F FHIR"
      }[r.kind] ?? "\u2717 \u9023\u7DDA\u5931\u6557";
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
    if (!banner) return;
    banner.dataset.state = _connState;
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
    if (els.connSection) els.connSection.hidden = isOk;
    if (els.connMini) {
      els.connMini.hidden = !isOk;
      if (isOk) els.connMini.title = `\u5DF2\u9023\u7DDA \u2014 ${els.backendUrl.value.trim()}`;
    }
  }
  function _refreshButtonStates() {
    const onNhi = !els.syncApiBtn.dataset.offNhi;
    const modeOk = currentMode() === "local" || _connState === "ok";
    els.syncApiBtn.disabled = !(onNhi && modeOk);
    els.syncApiBtn.title = !onNhi ? "\u8ACB\u5148\u5207\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801\u518D\u53D6\u5F97\u8CC7\u6599" : !modeOk ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : "";
    const ov = getPatientOverride();
    const haveBackendPatient = _backendPatient.state === "present";
    els.launchBtn.disabled = !(currentMode() === "backend" && _connState === "ok" && !!ov?.id_no && haveBackendPatient);
    els.launchBtn.title = currentMode() !== "backend" ? "\u8ACB\u5207\u5230\u300C\u4E0A\u50B3\u5F8C\u7AEF\u300D\u6A21\u5F0F" : _connState !== "ok" ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : !ov?.id_no ? "\u8ACB\u5148\u586B\u75C5\u4EBA\u8CC7\u6599" : !haveBackendPatient ? "\u5F8C\u7AEF\u5C1A\u7121\u6B64\u75C5\u4EBA\u7684\u8CC7\u6599 \u2014 \u8ACB\u5148\u53D6\u5F97\u8CC7\u6599\u6216\u4E0A\u50B3\u672C\u5730\u6A94\u6848" : "";
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
    if (currentMode() === "backend") checkBackendPatient();
    return _connState === "ok";
  }
  els.connRetryBtn?.addEventListener("click", testBackendConnection);
  var _backendPatient = { state: "unknown", count: 0, lastUpdated: null };
  var _localBundle = { exists: false, count: 0, generatedAt: 0, patientId: null };
  function _fmtTimeShort(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function _fmtRelative(ms) {
    const diff = Date.now() - ms;
    if (diff < 6e4) return `${Math.max(1, Math.round(diff / 1e3))} \u79D2\u524D`;
    if (diff < 36e5) return `${Math.round(diff / 6e4)} \u5206\u9418\u524D`;
    if (diff < 864e5) return `${Math.round(diff / 36e5)} \u5C0F\u6642\u524D`;
    return _fmtTimeShort(new Date(ms).toISOString());
  }
  function _renderDataState() {
    const ov = getPatientOverride();
    if (currentMode() !== "backend" || !ov?.id_no) {
      els.dataStateSection.hidden = true;
      if (els.syncStatusHint) els.syncStatusHint.hidden = true;
      return;
    }
    const localMatches = _localBundle.exists && _localBundle.patientId === ov.id_no;
    const inSync = _backendPatient.state === "present" && localMatches && _backendPatient.count === _localBundle.count;
    if (els.syncStatusHint) els.syncStatusHint.hidden = !inSync;
    const nothingToShow = _backendPatient.state === "present" && (!localMatches || inSync);
    if (nothingToShow) {
      els.dataStateSection.hidden = true;
      return;
    }
    els.dataStateSection.hidden = false;
    const bs = els.backendState;
    switch (_backendPatient.state) {
      case "checking":
        bs.className = "data-state-value";
        bs.textContent = "\u6AA2\u67E5\u4E2D\u2026";
        break;
      case "absent":
        bs.className = "data-state-value empty";
        bs.textContent = localMatches ? "\u26A0 \u5C1A\u7121\u6B64\u75C5\u4EBA \u2014 \u8ACB\u6309\u4E0A\u65B9\u300C\u{1F504} \u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6216\u4E0B\u65B9\u300C\u{1F4E4} \u628A\u672C\u5730\u6A94\u6848\u4E0A\u50B3\u5230\u5F8C\u7AEF\u300D" : "\u26A0 \u5C1A\u7121\u6B64\u75C5\u4EBA \u2014 \u8ACB\u6309\u4E0A\u65B9\u300C\u{1F504} \u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6293\u8CC7\u6599\u5230\u5F8C\u7AEF";
        break;
      case "present": {
        const count = _backendPatient.count;
        const ts = _backendPatient.lastUpdated;
        bs.className = "data-state-value ok";
        bs.textContent = `\u2713 ${count > 0 ? `${count} \u7B46 \xB7 ` : ""}\u6700\u5F8C\u66F4\u65B0 ${_fmtTimeShort(ts) || "(unknown)"}`;
        break;
      }
      case "fail":
        bs.className = "data-state-value fail";
        bs.textContent = "\u2717 \u6AA2\u67E5\u5931\u6557\uFF08\u770B\u9023\u7DDA banner\uFF09";
        break;
      default:
        bs.className = "data-state-value";
        bs.textContent = "\u2014";
    }
    if (localMatches) {
      els.localStateRow.hidden = false;
      els.localState.className = "data-state-value ok";
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
    try {
      const pr = await fetch(`${url}/fhir/Patient/${encodeURIComponent(ov.id_no)}`, { headers });
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
        const er = await fetch(`${url}/fhir/export?patient=${encodeURIComponent(ov.id_no)}`, {
          headers,
          signal: ctrl.signal
        });
        clearTimeout(timer);
        if (er.ok) {
          const bundle = await er.json();
          if (Array.isArray(bundle.entry)) count = bundle.entry.length;
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
    if (!ov?.id_no || !_localBundle.exists || _localBundle.patientId !== ov.id_no) return;
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
      if (!pending?.json) throw new Error("no local bundle");
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
    if (area === "local" && PENDING_BUNDLE_KEY in changes) _refreshLocalBundleState();
  });
  async function loadSyncMode() {
    const { syncMode } = await chrome.storage.sync.get("syncMode");
    const mode = syncMode === "backend" ? "backend" : DEFAULT_MODE;
    for (const r of els.modeRadios()) r.checked = r.value === mode;
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
    for (const r of els.modeRadios()) if (r.checked) return r.value;
    return DEFAULT_MODE;
  }
  for (const r of els.modeRadios()) {
    r.addEventListener("change", () => {
      const mode = currentMode();
      document.body.dataset.mode = mode;
      chrome.storage.sync.set({ syncMode: mode });
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
    chrome.storage.sync.set({ backendUrl: els.backendUrl.value.trim() });
    els.dashboardLink.href = els.backendUrl.value.replace(/:8010.*$/, ":3010");
    if (currentMode() === "backend") testBackendConnection();
  });
  els.syncApiKey.addEventListener("change", () => {
    chrome.storage.sync.set({ syncApiKey: els.syncApiKey.value.trim() });
  });
  async function loadSidebarEnabled() {
    const { sidebarEnabled } = await chrome.storage.sync.get("sidebarEnabled");
    els.sidebarEnabled.checked = sidebarEnabled !== false;
  }
  els.sidebarEnabled?.addEventListener("change", () => {
    chrome.storage.sync.set({ sidebarEnabled: els.sidebarEnabled.checked });
  });
  var _maskNameEnabled = false;
  async function loadMaskNameEnabled() {
    const { maskNameEnabled } = await chrome.storage.sync.get("maskNameEnabled");
    _maskNameEnabled = maskNameEnabled === true;
    if (els.maskNameEnabled) els.maskNameEnabled.checked = _maskNameEnabled;
  }
  function _maybeMask(name) {
    return _maskNameEnabled ? maskName(name) : name || "";
  }
  els.maskNameEnabled?.addEventListener("change", async () => {
    _maskNameEnabled = els.maskNameEnabled.checked;
    await chrome.storage.sync.set({ maskNameEnabled: _maskNameEnabled });
    refreshOverrideSummary();
  });
  els.smartAppUrl.addEventListener("change", () => {
    const v = els.smartAppUrl.value.trim();
    if (v) {
      chrome.storage.sync.set({ smartAppLaunchUrl: v });
    } else {
      chrome.storage.sync.remove("smartAppLaunchUrl");
      els.smartAppUrl.value = DEFAULT_SMART_APP_LAUNCH;
    }
  });
  function setStatus(text, kind, breakdown) {
    els.status.className = kind || "";
    els.status.textContent = "";
    if (!text && !(breakdown && breakdown.length)) return;
    els.status.appendChild(document.createTextNode(text || ""));
    if (breakdown && breakdown.length) {
      const phaseRows = breakdown.filter((b) => b.startsWith("\u23F1"));
      const otherRows = breakdown.filter((b) => !b.startsWith("\u23F1"));
      const details = document.createElement("details");
      details.className = "status-detail";
      const summary = document.createElement("summary");
      summary.textContent = "\u67E5\u770B\u660E\u7D30";
      details.appendChild(summary);
      if (phaseRows.length) {
        const phases = document.createElement("div");
        phases.className = "status-phases";
        phases.textContent = phaseRows.map((p) => p.replace(/^⏱\s*/, "")).join(" \xB7 ");
        details.appendChild(phases);
      }
      if (otherRows.length) {
        const body = document.createElement("div");
        body.className = "status-breakdown";
        body.textContent = otherRows.join(" \xB7 ");
        details.appendChild(body);
      }
      els.status.appendChild(details);
    }
  }
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }
  function _fmtBytes(n) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  }
  async function refreshPendingBundle() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    if (!pending || !pending.json) {
      els.pendingBundle.hidden = true;
      return;
    }
    const ov = getPatientOverride();
    if (ov?.id_no && pending.patientId && pending.patientId !== ov.id_no) {
      els.pendingBundle.hidden = true;
      return;
    }
    els.pendingBundle.hidden = false;
    const ago = pending.generatedAt ? `${Math.max(1, Math.round((Date.now() - pending.generatedAt) / 1e3))} \u79D2\u524D` : "";
    els.bundleMeta.textContent = `${pending.filename} \xB7 ${_fmtBytes(pending.bytes || 0)}${ago ? ` \xB7 ${ago}` : ""}`;
  }
  async function downloadPendingBundle() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.local.get(PENDING_BUNDLE_KEY);
    if (!pending) return;
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
  }
  els.downloadBundleBtn.addEventListener("click", downloadPendingBundle);
  els.clearBundleBtn.addEventListener("click", clearPendingBundle);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes) refreshPendingBundle();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.patientOverride) loadPatientOverride();
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
    if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;
    if (left + tipRect.width > viewportW - VIEWPORT_MARGIN) {
      left = viewportW - VIEWPORT_MARGIN - tipRect.width;
    }
    let top = iconRect.top - tipRect.height - 6;
    if (top < VIEWPORT_MARGIN) top = iconRect.bottom + 6;
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
    if (icon) _showHelpTooltip(icon);
  });
  document.addEventListener("mouseout", (e) => {
    const icon = e.target.closest?.(".help-icon");
    if (icon) _hideHelpTooltip();
  });
  async function init() {
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
    if (onNhi) delete els.syncApiBtn.dataset.offNhi;
    else els.syncApiBtn.dataset.offNhi = "1";
    if (els.openNhiSection) els.openNhiSection.hidden = onNhi;
    _refreshButtonStates();
    await refreshSyncStatusFromBackground();
  }
  async function refreshSyncStatusFromBackground() {
    const status = await chrome.runtime.sendMessage({ type: "getSyncStatus" }).catch(() => null);
    if (!status) return;
    applySyncStatus(status);
  }
  var _latestStatus = null;
  var _elapsedTickerId = null;
  function _fmtElapsed(ms) {
    if (ms < 6e4) return `${Math.floor(ms / 1e3)}s`;
    return `${Math.floor(ms / 6e4)}m${Math.round(ms % 6e4 / 1e3)}s`;
  }
  function _renderStatus() {
    const status = _latestStatus;
    if (!status) return;
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
    if (!status) return;
    _latestStatus = status;
    _renderStatus();
    if (status.running) {
      els.syncApiBtn.disabled = true;
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
      if (currentMode() === "backend" && _connState === "ok") checkBackendPatient();
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
    if (url?.pathname && /IHKE3099/.test(url.pathname)) return true;
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          if (document.querySelector('input[type="password"]')) return true;
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
    if (!pattern) return { ok: false, reason: `Backend URL \u7121\u6CD5\u89E3\u6790: ${backendUrl}` };
    const already = await chrome.permissions.contains({ origins: [pattern] });
    if (already) return { ok: true };
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
      setStatus("\u26D4 \u8ACB\u5148\u586B\u5BEB\u4E0A\u65B9\u75C5\u4EBA\u8CC7\u6599\uFF08\u8EAB\u5206\u8B49\u5B57\u865F\uFF09", "error");
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
      setStatus("\u{1F512} \u5C1A\u672A\u767B\u5165\u5065\u4FDD\u5B58\u647A \u2014 \u8ACB\u5148\u4EE5\u5065\u4FDD\u5361\u767B\u5165\u5F8C\u518D\u8A66", "error");
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
    const patientId = ov?.id_no;
    const smartAppLaunch = els.smartAppUrl.value.trim() || DEFAULT_SMART_APP_LAUNCH;
    if (!patientId) {
      setStatus("\u6C92\u6709\u75C5\u4EBA\u8EAB\u5206\u8B49\u5B57\u865F\u53EF\u4EE5 launch \u2014 \u8ACB\u5148\u586B\u5BEB\u75C5\u4EBA\u8CC7\u6599", "error");
      return;
    }
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
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIGFzIHRoZSBQeXRob24gbWFwcGVyc1xuICogc28gcmUtc3luY3MgdXBzZXJ0IHRoZSBzYW1lIHJlc291cmNlIGluc3RlYWQgb2YgY3JlYXRpbmcgZHVwbGljYXRlcy5cbiAqXG4gKiBVc2VzIGBqcy1zaGExYCAocHVyZSBKUykgaW5zdGVhZCBvZiBgbm9kZTpjcnlwdG9gIHNvIHRoZSBzYW1lIG1hcHBlclxuICogY29kZSBydW5zIHVubW9kaWZpZWQgaW4gdGhlIENocm9tZSBleHRlbnNpb24ncyBsb2NhbC1vbmx5IG1vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVJZChwYXRpZW50SWQ6IHN0cmluZywgLi4ucGFydHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgY29uc3Qga2V5ID0gW3BhdGllbnRJZCwgLi4ucGFydHNdLmpvaW4oXCJ8XCIpO1xuICByZXR1cm4gc2hhMShrZXkpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBQYXJ0aWFsbHktYW5vbnltaXplIGEgcGF0aWVudCBuYW1lLiBBcHBsaWVkIGluIG1hcFBhdGllbnQgc28gZXZlcnlcbiAqIEZISVIgcmVzb3VyY2UgdGhhdCBmbG93cyBvdXQgb2YgdGhpcyBjb2RlYmFzZSAoZG93bmxvYWRlZCBCdW5kbGUsXG4gKiBiYWNrZW5kIEZISVIgc3RvcmUsIGRhc2hib2FyZCwgU01BUlQgYXBwIGxhdW5jaGVzKSBzZWVzIHRoZSBtYXNrZWRcbiAqIGZvcm0uIFRoZSB1c2VyJ3MgcmF3IGlucHV0IGlzIHN0aWxsIGtlcHQgaW4gY2hyb21lLnN0b3JhZ2Ugc28gdGhleVxuICogY2FuIHJldmlldyB3aGF0IHdhcyBlbnRlcmVkLCBidXQgaXQgbmV2ZXIgbGVhdmVzIFBhdGllbnQgY29udGV4dC5cbiAqXG4gKiBSdWxlcyAoVGFpd2FuIC8gQ0pLIGNvbnZlbnRpb24pOlxuICogICAtIDEgY2hhciAgICAgXHUyMTkyIGtlZXAgYXMtaXMgKG5vdGhpbmcgdG8gbWFzaylcbiAqICAgLSAyIGNoYXJzICAgIFx1MjE5MiBrZWVwIGZpcnN0LCByZXBsYWNlIHNlY29uZCB3aXRoIE8gICAgXHU3MzhCXHU2NjBFIFx1MjE5MiBcdTczOEJPXG4gKiAgIC0gMysgY2hhcnMgICBcdTIxOTIga2VlcCBmaXJzdCArIGxhc3QsIG1pZGRsZSBhbGwgTyAgICAgIFx1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU5MEVET1x1NjVCMFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHU2Nzk3XHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTY3OTdPT1x1NjVCMFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHU0RTJEXHU1Q0Y2XHU1MDY1XHU2QjIxXHU5MENFIFx1MjE5MiBcdTRFMkRPT09cdTkwQ0VcbiAqXG4gKiBXZXN0ZXJuIG5hbWVzIChjb250YWluIHdoaXRlc3BhY2UpOiBzcGxpdCBvbiBzcGFjZSwga2VlcCBmaXJzdCArXG4gKiBsYXN0IHRva2VucywgcGFydGlhbC1tYXNrIHRoZSBsYXN0IGFuZCBtaWRkbGU6XG4gKiAgIEpvaG4gU21pdGggXHUyMTkyIEpvaG4gUyoqKlxuICogICBKb2huIFEgU21pdGggXHUyMTkyIEpvaG4gKioqIFNtaXRoXG4gKi9cbi8qKlxuICogSGFsZi1tYXNrIGEgVGFpd2FuIG5hdGlvbmFsIElEIGZvciBzaG91bGRlci1zdXJmaW5nLXNhZmUgZGlzcGxheS5cbiAqIE1hdGNoZXMgTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSdzIG93biBgaGlkYCBjb252ZW50aW9uIChmaXJzdCA2IHZpc2libGUsIGxhc3RcbiAqIDQgaGlkZGVuKTogYFAxMjA3NDA4NjZgIFx1MjE5MiBgUDEyMDc0KioqKmAuXG4gKlxuICogYGNoYXJgIGRlZmF1bHRzIHRvIGAqYCBmb3IgcG9wdXAvdG9hc3QgZGlzcGxheS4gVXNlIGBYYCBmb3IgZmlsZW5hbWVzXG4gKiBzaW5jZSBgKmAgaXMgaW52YWxpZCBpbiBXaW5kb3dzIHBhdGhzLiBUaGUgYXV0by1nZW5lcmF0ZWRcbiAqIGBhdXRvLVhYWFhYWFhYYCBwbGFjZWhvbGRlcnMgZmxvdyB0aHJvdWdoIHVuY2hhbmdlZCAoYWxyZWFkeVxuICogbm9uLWlkZW50aWZ5aW5nKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hc2tJZChpZDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCwgY2hhciA9IFwiKlwiKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IChpZCA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghcykgcmV0dXJuIHM7XG4gIGlmICgvXltBLVpdWzEyXVxcZHs4fSQvLnRlc3QocykpIHJldHVybiBzLnNsaWNlKDAsIDYpICsgY2hhci5yZXBlYXQoNCk7XG4gIGlmIChzLnN0YXJ0c1dpdGgoXCJhdXRvLVwiKSkgcmV0dXJuIHM7XG4gIGlmIChzLmxlbmd0aCA+IDYpIHJldHVybiBzLnNsaWNlKDAsIDIpICsgY2hhci5yZXBlYXQocy5sZW5ndGggLSA0KSArIHMuc2xpY2UoLTIpO1xuICByZXR1cm4gcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hc2tOYW1lKG5hbWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBjb25zdCB0cmltbWVkID0gKG5hbWUgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXRyaW1tZWQgfHwgdHJpbW1lZCA9PT0gXCJVbmtub3duXCIpIHJldHVybiB0cmltbWVkO1xuXG4gIGlmICgvXFxzLy50ZXN0KHRyaW1tZWQpKSB7XG4gICAgY29uc3QgcGFydHMgPSB0cmltbWVkLnNwbGl0KC9cXHMrLyk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHBhcnRzWzBdITtcbiAgICBjb25zdCBmaXJzdCA9IHBhcnRzWzBdITtcbiAgICBjb25zdCBsYXN0ID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0hO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIC8vIEZpeGVkIDMgc3RhcnMgcmVnYXJkbGVzcyBvZiBvcmlnaW5hbCBsZW5ndGggXHUyMDE0IGRvbid0IGxlYWsgaG93XG4gICAgICAvLyBsb25nIHRoZSBzdXJuYW1lIHdhcyB2aWEgbWFzayBsZW5ndGguXG4gICAgICBjb25zdCBsYXN0TWFza2VkID0gbGFzdC5sZW5ndGggPD0gMSA/IGxhc3QgOiBgJHtsYXN0WzBdfSoqKmA7XG4gICAgICByZXR1cm4gYCR7Zmlyc3R9ICR7bGFzdE1hc2tlZH1gO1xuICAgIH1cbiAgICBjb25zdCBtaWRkbGVzID0gcGFydHMuc2xpY2UoMSwgLTEpLm1hcCgoKSA9PiBcIioqKlwiKTtcbiAgICByZXR1cm4gW2ZpcnN0LCAuLi5taWRkbGVzLCBsYXN0XS5qb2luKFwiIFwiKTtcbiAgfVxuXG4gIC8vIENKSyAvIHNpbmdsZS10b2tlbiBwYXRoLiBJdGVyYXRlIGNvZGVwb2ludHMgKG5vdCBVVEYtMTYgdW5pdHMpIHNvXG4gIC8vIHN1cnJvZ2F0ZS1wYWlyIGNoYXJhY3RlcnMgY2FuJ3QgZ2V0IHNwbGl0IG1pZC1jaGFyYWN0ZXIuXG4gIGNvbnN0IGNoYXJzID0gQXJyYXkuZnJvbSh0cmltbWVkKTtcbiAgaWYgKGNoYXJzLmxlbmd0aCA8PSAxKSByZXR1cm4gdHJpbW1lZDtcbiAgaWYgKGNoYXJzLmxlbmd0aCA9PT0gMikgcmV0dXJuIGAke2NoYXJzWzBdfU9gO1xuICByZXR1cm4gY2hhcnNbMF0gKyBcIk9cIi5yZXBlYXQoY2hhcnMubGVuZ3RoIC0gMikgKyBjaGFyc1tjaGFycy5sZW5ndGggLSAxXTtcbn1cbiIsICIvKipcbiAqIE9ic2VydmF0aW9uIG1hcHBlciBcdTIwMTQgc2luZ2xlLXJvdyBhbmQgcGFuZWwtZ3JvdXBlZCB2YXJpYW50cy5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvb2JzZXJ2YXRpb24ucHlgICgxMjEyIGxpbmVzKS4gSW5jbHVkZXM6XG4gKiAgIC0gbWFwT2JzZXJ2YXRpb24ocmF3LCBwYXRpZW50SWQpIFx1MjE5MiBzaW5nbGUgT2JzZXJ2YXRpb25cbiAqICAgLSBtYXBPYnNlcnZhdGlvbnNHcm91cGVkKGl0ZW1zLCBwYXRpZW50SWQpIFx1MjE5MiBEaWFnbm9zdGljUmVwb3J0ICsgT2JzZXJ2YXRpb25zXG4gKiAgIC0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIFx1MjAxNCBjcm9zcy1wYWdlIGRlZHVwIGtleVxuICogICAtIGZpbmRMb2luYywgYnVpbGRDb2RpbmdzLCBtYXBJbnRlcnByZXRhdGlvbiwgZGVyaXZlSW50ZXJwcmV0YXRpb25cbiAqICAgLSBkZWR1cGVDcm9zc0Zvcm1hdCwgY29tYmluZUJwSXRlbXMsIGdyb3VwQnlPcmRlckNvZGVcbiAqICAgLSBpbmZlclNwZWNpbWVuXG4gKlxuICogRnVuY3Rpb25hbCBwYXJpdHkgd2l0aCB0aGUgUHl0aG9uIGltcGxlbWVudGF0aW9uIGlzIHRoZSBnb2FsLiBGaWVsZFxuICogb3JkZXIgaW4gdGhlIGVtaXR0ZWQgcmVzb3VyY2VzIG1heSBkaWZmZXIgKEpTIG9iamVjdCBsaXRlcmFsIG9yZGVyKVxuICogYnV0IGNvbnRlbnQgaXMgaWRlbnRpY2FsLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQge1xuICBESVNQTEFZX0ZJUlNUX0NPREVTLFxuICBMT0lOQ19ESVNQTEFZLFxuICBMT0lOQ19NQVAsXG4gIE5ISV9UT19MT0lOQyxcbiAgUEFORUxfTE9JTkNfTUFQLFxufSBmcm9tIFwiLi9sb2luYy10YWJsZXNcIjtcbmltcG9ydCB7XG4gIHR5cGUgUXVhbnRpdHksXG4gIHR5cGUgUmFuZ2VFbnRyeSxcbiAgcGFyc2VSYW5nZSxcbiAgcGFyc2VSYW5nZU11bHRpLFxuICB0b1VjdW0sXG4gIHRyeVBhcnNlUXVhbnRpdHksXG59IGZyb20gXCIuL3BhcnNlcnNcIjtcblxuLy8gXHUyNTAwXHUyNTAwIEltYWdpbmcgZGV0ZWN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBJTUFHSU5HX0tFWVdPUkRTOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBbXG4gIFwidWx0cmFzb3VuZFwiLFxuICBcInNvbm9ncmFtXCIsXG4gIFwic29ub2dyYXBoeVwiLFxuICBcImVjaG9cIixcbiAgXCJjdCBcIixcbiAgXCJjdC9cIixcbiAgXCJjdC1cIixcbiAgXCJjb21wdXRlZCB0b21vZ3JhcGh5XCIsXG4gIFwibXJpXCIsXG4gIFwibWFnbmV0aWMgcmVzb25hbmNlXCIsXG4gIFwieC1yYXlcIixcbiAgXCJ4cmF5XCIsXG4gIFwieCByYXlcIixcbiAgXCJtYW1tb2dyYXBoeVwiLFxuICBcIm1hbW1vXCIsXG4gIFwiZWtnXCIsXG4gIFwiZWNnXCIsXG4gIFwiZWxlY3Ryb2NhcmRpb2dyYW1cIixcbiAgXCJlbmRvc2NvcFwiLFxuICBcImNvbG9ub3Njb3BcIixcbiAgXCJnYXN0cm9zY29wXCIsXG4gIFwiYnJvbmNob3Njb3BcIixcbiAgXCJwZXQvY3RcIixcbiAgXCJwZXQgXCIsXG4gIFwic3BlY3RcIixcbiAgXCJcdTVGNzFcdTUwQ0ZcIixcbiAgXCJcdThEODVcdTk3RjNcdTZDRTJcIixcbiAgXCJcdTk2RkJcdTgxNjZcdTY1QjdcdTVDNjRcIixcbiAgXCJcdTY4MzhcdTc4QzFcdTUxNzFcdTYzMkZcIixcbiAgXCJcdTVGQzNcdTk2RkJcdTU3MTZcIixcbiAgXCJcdTUxNjdcdTg5OTZcdTkzRTFcIixcbiAgXCJcdTRFNzNcdTYyM0ZcdTY1MURcdTVGNzFcIixcbl07XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheTogc3RyaW5nLCBjb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgaGF5c3RhY2sgPSBgJHtkaXNwbGF5fSAke2NvZGV9YC50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gSU1BR0lOR19LRVlXT1JEUy5zb21lKChrdykgPT4gaGF5c3RhY2suaW5jbHVkZXMoa3cpKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExPSU5DIGxvb2t1cCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTkhJX0xBQl9DT0RFX1JFID0gL15cXGR7NCw2fVtBLVpdJC87XG5cbmZ1bmN0aW9uIGlzQXNjaWlPbmx5KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocy5jaGFyQ29kZUF0KGkpID4gMTI3KSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJpbWFyeSBMT0lOQyBmb3IgdGhpcyBsYWIuIFBhbmVsLWF3YXJlIGxvb2t1cDpcbiAqICAgQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgXHUyMTkyIHVzZSBOSElfVE9fTE9JTkMgZGlyZWN0bHkuXG4gKiAgIEIuIFBhbmVsIGNvZGUgT1IgdW5rbm93biBjb2RlIFx1MjE5MiB3YWxrIExPSU5DX01BUCBieSBkaXNwbGF5IGtleXdvcmQuXG4gKiAgIEMuIEZhbGxiYWNrOiBwYW5lbC1sZXZlbCBMT0lOQyBmcm9tIE5ISV9UT19MT0lOQyBpZiBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9pbmMoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgd2lucyBvdXRyaWdodC5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMgJiYgIURJU1BMQVlfRklSU1RfQ09ERVMuaGFzKGNvZGUpKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG5cbiAgY29uc3QgY29tYmluZWQgPSBgJHtjb2RlfSAke2Rpc3BsYXl9YC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIEIxLiBQYW5lbC1zcGVjaWZpYyBrZXl3b3JkIG1hcCBydW5zIEJFRk9SRSB0aGUgZ2xvYmFsIG9uZS5cbiAgaWYgKGNvZGUgaW4gUEFORUxfTE9JTkNfTUFQKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXMoUEFORUxfTE9JTkNfTUFQW2NvZGVdISkpIHtcbiAgICAgIGlmIChpc0FzY2lpT25seShrZXkpKSB7XG4gICAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa2V5LnRvTG93ZXJDYXNlKCkpfWApLnRlc3QoY29tYmluZWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNvbWJpbmVkLmluY2x1ZGVzKGtleS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICByZXR1cm4gbG9pbmM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQi4gRGlzcGxheS1rZXl3b3JkIHNlYXJjaC5cbiAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXMoTE9JTkNfTUFQKSkge1xuICAgIGlmIChpc0FzY2lpT25seShrZXkpKSB7XG4gICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICByZXR1cm4gbG9pbmM7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgIHJldHVybiBsb2luYztcbiAgICB9XG4gIH1cblxuICAvLyBDLiBQYW5lbCBjb2RlIHdpdGggbm8gcmVjb2duaXNlZCBpdGVtIGRpc3BsYXkgXHUyMTkyIGZhbGwgYmFjay5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMpIHtcbiAgICByZXR1cm4gTkhJX1RPX0xPSU5DW2NvZGVdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIE9ic2VydmF0aW9uLmNvZGUuY29kaW5nW10gbGlzdC5cbiAqIFByaW9yaXR5OiBMT0lOQyBcdTIxOTIgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgbG9jYWwgZmFsbGJhY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvZGluZ3MoXG4gIGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGRpc3BsYXk6IHN0cmluZyxcbiAgbG9pbmM6IHN0cmluZyB8IG51bGwsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10ge1xuICBjb25zdCBjb2RpbmdzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10gPSBbXTtcbiAgaWYgKGxvaW5jKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsXG4gICAgICBjb2RlOiBsb2luYyxcbiAgICAgIGRpc3BsYXk6IExPSU5DX0RJU1BMQVlbbG9pbmNdID8/IGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgY29uc3QgY29kZVN0ciA9IChjb2RlID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKGNvZGVTdHIgJiYgTkhJX0xBQl9DT0RFX1JFLnRlc3QoY29kZVN0cikpIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLk5ISV9NRURJQ0FMX09SREVSX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyLFxuICAgICAgZGlzcGxheSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERSxcbiAgICAgIGNvZGU6IGNvZGVTdHIgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGNvZGluZ3M7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBJbnRlcnByZXRhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU5URVJQX1NZUyA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92My1PYnNlcnZhdGlvbkludGVycHJldGF0aW9uXCI7XG5cbmZ1bmN0aW9uIGludGVycENvZGluZyhjb2RlOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICByZXR1cm4geyBzeXN0ZW06IElOVEVSUF9TWVMsIGNvZGUsIGRpc3BsYXkgfTtcbn1cblxuY29uc3QgSU5URVJQX1RBQkxFOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgaGlnaDogW1wiSFwiLCBcIkhpZ2hcIl0sXG4gIGxvdzogW1wiTFwiLCBcIkxvd1wiXSxcbiAgbm9ybWFsOiBbXCJOXCIsIFwiTm9ybWFsXCJdLFxuICBjcml0aWNhbDogW1wiQUFcIiwgXCJDcml0aWNhbCBhYm5vcm1hbFwiXSxcbiAgYWJub3JtYWw6IFtcIkFcIiwgXCJBYm5vcm1hbFwiXSxcbiAgcG9zaXRpdmU6IFtcIlBPU1wiLCBcIlBvc2l0aXZlXCJdLFxuICBuZWdhdGl2ZTogW1wiTkVHXCIsIFwiTmVnYXRpdmVcIl0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWFwSW50ZXJwcmV0YXRpb24oXG4gIGludGVycDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgY29uc3Qga2V5ID0gKGludGVycCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBlbnRyeSA9IElOVEVSUF9UQUJMRVtrZXldO1xuICBpZiAoIWVudHJ5KSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGludGVycENvZGluZyhlbnRyeVswXSwgZW50cnlbMV0pO1xufVxuXG4vLyBQb3NpdGl2ZSBtYXJrZXJzIFx1MjAxNCBcInRoaXMgaXMgZGV0ZWN0ZWQgLyBhYm5vcm1hbFwiLlxuY29uc3QgUE9TX01BUktFUlMgPVxuICAvXlxccyooPzpwb3NpdGl2ZXxwb3N8cmVhY3RpdmV8ZGV0ZWN0ZWR8YWJub3JtYWx8cHJlc2VudHx0cmFjZXxbMS00XT9cXHMqXFwrKD86XFxzKltcXCtcXC1dKSopXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG4vLyBOZWdhdGl2ZSBtYXJrZXJzIFx1MjAxNCBleHBsaWNpdGx5IG5vcm1hbC9hYnNlbnQuXG5jb25zdCBORUdfTUFSS0VSUyA9XG4gIC9eXFxzKig/Om5lZ2F0aXZlfG5lZ3xub25yZWFjdGl2ZXxub25bLVxcc10/cmVhY3RpdmV8bm90Wy1cXHNdP2RldGVjdGVkfG5kfGFic2VudHxub25lfG5vcm1hbHwwfFstXHUyMDE0XHUyMDEzXSspXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG5mdW5jdGlvbiBjbGFzc2lmeVF1YWxpdGF0aXZlKHRleHQ6IHVua25vd24pOiBcInBvc1wiIHwgXCJuZWdcIiB8IG51bGwge1xuICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IFN0cmluZyh0ZXh0KS50cmltKCk7XG4gIGlmIChzLnN0YXJ0c1dpdGgoXCJbXCIpICYmIHMuZW5kc1dpdGgoXCJdXCIpKSB7XG4gICAgcyA9IHMuc2xpY2UoMSwgLTEpLnRyaW0oKTtcbiAgfVxuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBpZiAoTkVHX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwibmVnXCI7XG4gIGlmIChQT1NfTUFSS0VSUy50ZXN0KHMpKSByZXR1cm4gXCJwb3NcIjtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgdmFsdWVSYXc6IHN0cmluZyxcbiAgcXR5OiBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgcnI6IFJhbmdlRW50cnkgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIC8vIDEuIE51bWVyaWMgcGF0aC5cbiAgaWYgKHF0eSAmJiB0eXBlb2YgcXR5LnZhbHVlID09PSBcIm51bWJlclwiICYmIHJyKSB7XG4gICAgY29uc3QgdiA9IHF0eS52YWx1ZTtcbiAgICBjb25zdCBsbyA9IHJyLmxvdz8udmFsdWU7XG4gICAgY29uc3QgaGkgPSByci5oaWdoPy52YWx1ZTtcbiAgICBpZiAodHlwZW9mIGhpID09PSBcIm51bWJlclwiICYmIHYgPiBoaSkgcmV0dXJuIGludGVycENvZGluZyhcIkhcIiwgXCJIaWdoXCIpO1xuICAgIGlmICh0eXBlb2YgbG8gPT09IFwibnVtYmVyXCIgJiYgdiA8IGxvKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTFwiLCBcIkxvd1wiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiIHx8IHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyAyLiBRdWFsaXRhdGl2ZSBwYXRoLlxuICBjb25zdCB2YWxLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZSh2YWx1ZVJhdyk7XG4gIGNvbnN0IHJlZlRleHQgPSBycj8udGV4dCA/PyBcIlwiO1xuICBjb25zdCByZWZLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZShyZWZUZXh0KTtcbiAgaWYgKHZhbEtpbmQgPT09IG51bGwpIHJldHVybiBudWxsO1xuICBpZiAocmVmS2luZCA9PT0gXCJuZWdcIikge1xuICAgIGlmICh2YWxLaW5kID09PSBcInBvc1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiQVwiLCBcIkFibm9ybWFsXCIpO1xuICAgIGlmICh2YWxLaW5kID09PSBcIm5lZ1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTlwiLCBcIk5vcm1hbFwiKTtcbiAgfVxuICByZXR1cm4gdmFsS2luZCA9PT0gXCJwb3NcIiA/IGludGVycENvZGluZyhcIlBPU1wiLCBcIlBvc2l0aXZlXCIpIDogaW50ZXJwQ29kaW5nKFwiTkVHXCIsIFwiTmVnYXRpdmVcIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBDYW5vbmljYWwgbGFiIGtleSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTEFCX1NZTk9OWU1TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBEaWFiZXRlc1xuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXHU3Q0Q2XHU1MzE2XHU4ODQwXHU4MjcyXHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCJIQkExQ1wiLFxuICBcIkdMWUNBVEVEIEhFTU9HTE9CSU5cIjogXCJIQkExQ1wiLFxuICBIQkExQzogXCJIQkExQ1wiLFxuICBBMUM6IFwiSEJBMUNcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcIkZBU1RJTkcgR0xVQ09TRVwiOiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcdTg0NjFcdTg0MDRcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBcdTg4NDBcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBHTFVDT1NFOiBcIkdMVUNPU0VcIixcbiAgLy8gQ0JDXG4gIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJXQkNcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIldCQ1wiLFxuICBXQkM6IFwiV0JDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJSQkNcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIlJCQ1wiLFxuICBSQkM6IFwiUkJDXCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCJIRU1PR0xPQklOXCIsXG4gIEhFTU9HTE9CSU46IFwiSEVNT0dMT0JJTlwiLFxuICBIR0I6IFwiSEVNT0dMT0JJTlwiLFxuICBcdTg4NDBcdTVCQjlcdTdBNERcdTZCRDQ6IFwiSEVNQVRPQ1JJVFwiLFxuICBIRU1BVE9DUklUOiBcIkhFTUFUT0NSSVRcIixcbiAgSENUOiBcIkhFTUFUT0NSSVRcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIlBMQVRFTEVUXCIsXG4gIFBMQVRFTEVUOiBcIlBMQVRFTEVUXCIsXG4gIFBMVDogXCJQTEFURUxFVFwiLFxuICAvLyBDQkMgaW5kaWNlcyAoMTAtY2hhciBhbmQgNy1jaGFyIENKSyBmb3JtcyBiZWF0IGJhcmUgXHU3RDA1XHU4ODQwXHU3NDAzKVxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjBcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjA6IFwiTUNIXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1NkZDM1x1NUVBNjogXCJNQ0hDXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1OUFENFx1N0E0RDogXCJNQ1ZcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzXHU1MjA2XHU1RTAzXHU1QkVDXHU1RUE2OiBcIlJEV1wiLFxuICBNQ1Y6IFwiTUNWXCIsXG4gIE1DSDogXCJNQ0hcIixcbiAgTUNIQzogXCJNQ0hDXCIsXG4gIFJEVzogXCJSRFdcIixcbiAgLy8gQ0JDIGRpZmZlcmVudGlhbFxuICBcdTU1RENcdTRFMkRcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiTkVVVFJPUEhJTFwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTkxNzhcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTlFN0NcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiQkFTT1BISUxcIixcbiAgXHU2RENCXHU1REY0XHU3NDAzOiBcIkxZTVBIT0NZVEVcIixcbiAgXHU1NUFFXHU2ODM4XHU3NDAzOiBcIk1PTk9DWVRFXCIsXG4gIEVPU0lOT1BISUxTOiBcIkVPU0lOT1BISUxcIixcbiAgRU9TSU5PUEhJTDogXCJFT1NJTk9QSElMXCIsXG4gIE5FVVRST1BISUxTOiBcIk5FVVRST1BISUxcIixcbiAgTkVVVFJPUEhJTDogXCJORVVUUk9QSElMXCIsXG4gIEJBU09QSElMUzogXCJCQVNPUEhJTFwiLFxuICBCQVNPUEhJTDogXCJCQVNPUEhJTFwiLFxuICBMWU1QSE9DWVRFUzogXCJMWU1QSE9DWVRFXCIsXG4gIExZTVBIT0NZVEU6IFwiTFlNUEhPQ1lURVwiLFxuICBNT05PQ1lURVM6IFwiTU9OT0NZVEVcIixcbiAgTU9OT0NZVEU6IFwiTU9OT0NZVEVcIixcbiAgLy8gTGlwaWQgXHUyMDE0IExETC9IREwgbXVzdCBwcmVjZWRlIGJhcmUgQ0hPTEVTVEVST0wuXG4gIFwiTERMIENIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ0hPTEVTVEVST0xcIjogXCJMRExfQ1wiLFxuICBcIkhETCBDSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFwiSERMLUNIT0xFU1RFUk9MXCI6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiTERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkhETF9DXCIsXG4gIFx1ODg0MFx1NkUwNVx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlRPVEFMIENIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTEVTVEVST0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTDogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTRFMDlcdTkxNzhcdTc1MThcdTZDQjlcdTkxNkY6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFRSSUdMWUNFUklERTogXCJUUklHTFlDRVJJREVcIixcbiAgXCJIREwtQ1wiOiBcIkhETF9DXCIsXG4gIEhETDogXCJIRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiSERMX0NcIixcbiAgXCJMREwtQyhESVJFQ1QpXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ1wiOiBcIkxETF9DXCIsXG4gIExETDogXCJMRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiTERMX0NcIixcbiAgLy8gUmVuYWwgXHUyMDE0IHVyaW5lIGNyZWF0aW5pbmUgdmFyaWFudHMgYmVmb3JlIHNlcnVtLlxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlVSSU5FIENSRUFUSU5JTkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVBXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNTBcdTkxNzg6IFwiQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoQilcIjogXCJDUkVBVElOSU5FXCIsXG4gIENSRUFUSU5JTkU6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JUTjogXCJDUkVBVElOSU5FXCIsXG4gIEVHRlI6IFwiRUdGUlwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiQlVOXCIsXG4gIEJVTjogXCJCVU5cIixcbiAgXHU1QzNGXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlVSSU5FX1BIXCIsXG4gIFx1NUMzRlx1NkRCMlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiUEhcIixcbiAgXHU1QzNGXHU5MTc4OiBcIlVSSUNfQUNJRFwiLFxuICBcIlVSSUMgQUNJRFwiOiBcIlVSSUNfQUNJRFwiLFxuICBVUklDX0FDSUQ6IFwiVVJJQ19BQ0lEXCIsXG4gIC8vIExpdmVyXG4gIEFTVDogXCJBU1RcIixcbiAgQUxUOiBcIkFMVFwiLFxuICBHT1Q6IFwiQVNUXCIsXG4gIEdQVDogXCJBTFRcIixcbiAgXHU4MUJEXHU3RDA1XHU3RDIwOiBcIkJJTElSVUJJTlwiLFxuICBCSUxJUlVCSU46IFwiQklMSVJVQklOXCIsXG4gIFx1NzY3RFx1ODZDQlx1NzY3RDogXCJBTEJVTUlOXCIsXG4gIEFMQlVNSU46IFwiQUxCVU1JTlwiLFxuICAvLyBDYXJkaWFjXG4gIFx1NUZDM1x1ODA4Q1x1NjVDQlx1OEY0OVx1ODZDQlx1NzY3RDogXCJUUk9QT05JTlwiLFxuICBUUk9QT05JTjogXCJUUk9QT05JTlwiLFxuICBCTlA6IFwiQk5QXCIsXG4gIFx1NUZDM1x1ODFERjogXCJUUk9QT05JTlwiLFxuICAvLyBUaHlyb2lkXG4gIFx1NzUzMlx1NzJDMFx1ODE3QVx1NTIzQVx1NkZDMFx1N0QyMDogXCJUU0hcIixcbiAgVFNIOiBcIlRTSFwiLFxuICBcdTZFMzhcdTk2RTJcdTc1MzJcdTcyQzBcdTgxN0FcdTdEMjA6IFwiRlJFRV9UNFwiLFxuICBcIkZSRUUgVDRcIjogXCJGUkVFX1Q0XCIsXG4gIEZUNDogXCJGUkVFX1Q0XCIsXG4gIC8vIE1pc2NcbiAgQ1x1NTNDRFx1NjFDOVx1NjAyN1x1ODZDQlx1NzY3RDogXCJDUlBcIixcbiAgXCJDLVJFQUNUSVZFIFBST1RFSU5cIjogXCJDUlBcIixcbiAgQ1JQOiBcIkNSUFwiLFxuICBcIkhTLUNSUFwiOiBcIkhTX0NSUFwiLFxuICBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUY6IFwiUFNBXCIsXG4gIFBTQTogXCJQU0FcIixcbiAgXHU5NDM1XHU4NkNCXHU3NjdEOiBcIkZFUlJJVElOXCIsXG4gIEZFUlJJVElOOiBcIkZFUlJJVElOXCIsXG4gIFx1ODQ0OVx1OTE3ODogXCJGT0xBVEVcIixcbiAgRk9MQVRFOiBcIkZPTEFURVwiLFxuICBcdTdEQURcdTc1MUZcdTdEMjBCMTI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVQgQjEyXCI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVRBTUlOIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFx1NzZBRVx1OENFQVx1N0QyMDogXCJDT1JUSVNPTFwiLFxuICBDT1JUSVNPTDogXCJDT1JUSVNPTFwiLFxuICBcdTY4ODVcdTZCRDI6IFwiUlBSXCIsXG4gIFJQUjogXCJSUFJcIixcbiAgXHU5NkIxXHU3NDAzXHU4M0NDXHU2Mjk3XHU1MzlGOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBDUllQQUc6IFwiQ1JZUFRPQ09DQ0FMX0FHXCIsXG4gIFx1ODg0MFx1NkMyODogXCJBTU1PTklBXCIsXG4gIEFNTU9OSUE6IFwiQU1NT05JQVwiLFxuICBcdTUxRERcdTg4NDBcdTkxNzZcdTUzOUZcdTY2NDJcdTk1OTM6IFwiUFRcIixcbiAgQVBUVDogXCJBUFRUXCIsXG4gIElOUjogXCJJTlJcIixcbn07XG5cbi8vIFByZS1zb3J0IGtleXMgbG9uZ2VzdC1maXJzdCBzbyBsb25nZXIvbW9yZS1zcGVjaWZpYyBtYXRjaGVzIHdpbi5cbmNvbnN0IExBQl9TWU5PTllNX0tFWVNfU09SVEVEID0gT2JqZWN0LmtleXMoTEFCX1NZTk9OWU1TKS5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbExhYktleShkaXNwbGF5OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFkaXNwbGF5KSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcyA9IGRpc3BsYXkudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBcIlwiO1xuICBjb25zdCBzVXBwZXIgPSBzLnRvVXBwZXJDYXNlKCk7XG4gIGZvciAoY29uc3Qga2V5IG9mIExBQl9TWU5PTllNX0tFWVNfU09SVEVEKSB7XG4gICAgY29uc3Qga3UgPSBrZXkudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa3UpKSB7XG4gICAgICAvLyBMZWFkaW5nIHdvcmQtYm91bmRhcnkgb25seSBcdTIwMTQgXCJBU1RcIiBpbnNpZGUgXCJESUFTVE9MSUNcIiBzaG91bGQgbm90IG1hdGNoLlxuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrdSl9YCkudGVzdChzVXBwZXIpKSB7XG4gICAgICAgIHJldHVybiBMQUJfU1lOT05ZTVNba2V5XSE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzVXBwZXIuaW5jbHVkZXMoa3UpKSB7XG4gICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBhbmVsIGdyb3VwaW5nIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICAgIGlmIChjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmKSBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGlzRW5nbGlzaERvbWluYW50KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgbGF0aW4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIHtcbiAgICBjb25zdCBjcCA9IGNoLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGNwIDwgMTI4ICYmIC9bQS1aYS16XS8udGVzdChjaCkpIGxhdGluKys7XG4gIH1cbiAgcmV0dXJuIGxhdGluID49IDIgJiYgY2prQ2hhcnMocykgPT09IDA7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAodjogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGxldCBzID0gU3RyaW5nKHYpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXChbXildKlxcKS9nLCBcIlwiKS50cmltKCk7XG4gIHMgPSBzLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWx1ZSkudHJpbSgpO1xuICByZXR1cm4gcyAhPT0gXCJcIiAmJiBzICE9PSBcIlx1MjAxNFwiICYmIHMgIT09IFwiLVwiICYmIHMgIT09IFwiTi9BXCIgJiYgcyAhPT0gXCJudWxsXCI7XG59XG5cbmNvbnN0IE1FQU5JTkdGVUxfSU5URVJQUyA9IG5ldyBTZXQoW1xuICBcIm5vcm1hbFwiLFxuICBcImFibm9ybWFsXCIsXG4gIFwiaGlnaFwiLFxuICBcImxvd1wiLFxuICBcImNyaXRpY2FsXCIsXG4gIFwicG9zaXRpdmVcIixcbiAgXCJuZWdhdGl2ZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIGRlZHVwZVBhbmVsSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5VmFsdWUgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgayA9IG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAoaXQudmFsdWUpO1xuICAgIGNvbnN0IGdyb3VwID0gYnlWYWx1ZS5nZXQoayk7XG4gICAgaWYgKGdyb3VwKSBncm91cC5wdXNoKGl0KTtcbiAgICBlbHNlIGJ5VmFsdWUuc2V0KGssIFtpdF0pO1xuICB9XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgZ3JvdXAgb2YgYnlWYWx1ZS52YWx1ZXMoKSkge1xuICAgIGlmIChncm91cC5sZW5ndGggPT09IDEpIHtcbiAgICAgIG91dC5wdXNoKGdyb3VwWzBdISk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgY2prSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGNqa0NoYXJzKFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpID49IDIpO1xuICAgIGNvbnN0IGVuSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGlzRW5nbGlzaERvbWluYW50KFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpKTtcbiAgICBpZiAoY2prSXRlbXMubGVuZ3RoID4gMCAmJiBlbkl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIG91dC5wdXNoKGVuSXRlbXNbMF0hKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0LnB1c2goLi4uZ3JvdXApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zOiBhbnlbXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgcmF3IG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFyYXcgfHwgdHlwZW9mIHJhdyAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gICAgaWYgKGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheSwgcmF3LmNvZGUgfHwgXCJcIikpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICAgIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICAgIGNvbnN0IGhhc01lYW5pbmdmdWxJbnRlcnAgPSBNRUFOSU5HRlVMX0lOVEVSUFMuaGFzKGludGVycCk7XG4gICAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgY29udGludWU7XG4gICAgb3V0LnB1c2gocmF3KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBkZWR1cGVDcm9zc0Zvcm1hdChpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3Qgb3JkZXJDb2RlID0gKGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nID0+XG4gICAgKChpdC5vcmRlcl9jb2RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG5cbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgbGV0IGlkeENvdW50ZXIgPSAwO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICBjb25zdCB2ID0gU3RyaW5nKGl0ZW0udmFsdWUgPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHVuaXQgPSAoKGl0ZW0udW5pdCBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgICBpZiAoIXYpIHtcbiAgICAgIGJ5S2V5LnNldChgX19ub19kZWR1cF9ffCR7aWR4Q291bnRlcisrfWAsIGl0ZW0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IFtcbiAgICAgIChpdGVtLmRhdGUgYXMgc3RyaW5nKSA/PyBcIlwiLFxuICAgICAgdi50b0xvd2VyQ2FzZSgpLFxuICAgICAgdW5pdC50b0xvd2VyQ2FzZSgpLFxuICAgICAgb3JkZXJDb2RlKGl0ZW0pLFxuICAgIF0uam9pbihcInxcIik7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBieUtleS5nZXQoa2V5KTtcbiAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvLyBQcmVmZXIgdGhlIHJvdyB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGNsaW5pY2FsIHJlYWRzKS5cbiAgICBsZXQgcHJpbWFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBsZXQgc2Vjb25kYXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIGlmIChjamtDaGFycyhpdGVtLmRpc3BsYXkgPz8gXCJcIikgPCBjamtDaGFycyhleGlzdGluZy5kaXNwbGF5ID8/IFwiXCIpKSB7XG4gICAgICBwcmltYXJ5ID0gaXRlbTtcbiAgICAgIHNlY29uZGFyeSA9IGV4aXN0aW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmltYXJ5ID0gZXhpc3Rpbmc7XG4gICAgICBzZWNvbmRhcnkgPSBpdGVtO1xuICAgIH1cbiAgICBjb25zdCBtZXJnZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgW1wib3JkZXJfY29kZVwiLCBcIm9yZGVyX25hbWVcIiwgXCJob3NwaXRhbFwiLCBcImNvZGVcIl0pIHtcbiAgICAgIGlmICghbWVyZ2VkW2ZdICYmIHNlY29uZGFyeVtmXSkgbWVyZ2VkW2ZdID0gc2Vjb25kYXJ5W2ZdO1xuICAgIH1cbiAgICBieUtleS5zZXQoa2V5LCBtZXJnZWQpO1xuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKGJ5S2V5LnZhbHVlcygpKTtcbn1cblxuaW50ZXJmYWNlIEJwQ29tcG9uZW50IHtcbiAgbG9pbmM6IHN0cmluZztcbiAgZGlzcGxheTogc3RyaW5nO1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0OiBzdHJpbmc7XG4gIGludGVycHJldGF0aW9uX3RleHQ6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gY29tYmluZUJwSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgeyBzeXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT47IGRpYXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT4gfVxuICA+KCk7XG4gIGNvbnN0IHBhc3NUaHJvdWdoOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGRpc3AgPSBTdHJpbmcoaXQuZGlzcGxheSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGtleSA9IGAke2l0LmRhdGUgPz8gXCJcIn18JHtpdC5ob3NwaXRhbCA/PyBcIlwifWA7XG4gICAgaWYgKGRpc3AuaW5jbHVkZXMoXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5zeXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIGlmIChkaXNwLmluY2x1ZGVzKFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpKSB7XG4gICAgICBjb25zdCB2ID0gYnlLZXkuZ2V0KGtleSkgPz8ge307XG4gICAgICB2LmRpYXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhc3NUaHJvdWdoLnB1c2goaXQpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgcGFydHMgb2YgYnlLZXkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBzID0gcGFydHMuc3lzdG9saWM7XG4gICAgY29uc3QgZCA9IHBhcnRzLmRpYXN0b2xpYztcbiAgICBjb25zdCBwcmltYXJ5ID0gcyA/PyBkO1xuICAgIGlmICghcHJpbWFyeSkgY29udGludWU7XG4gICAgY29uc3QgY29tcG9uZW50czogQnBDb21wb25lbnRbXSA9IFtdO1xuICAgIGNvbnN0IHRyeUFkZCA9IChzcmM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQsIGxvaW5jOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFzcmMpIHJldHVybjtcbiAgICAgIGNvbnN0IHZhbCA9IHNyYy52YWx1ZTtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBcIlwiIHx8IHZhbCA9PT0gXCItXCIgfHwgdmFsID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgICBjb25zdCBudW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcodmFsKS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG51bSkpIHJldHVybjtcbiAgICAgIGNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgIGxvaW5jLFxuICAgICAgICBkaXNwbGF5LFxuICAgICAgICB2YWx1ZTogbnVtLFxuICAgICAgICB1bml0OiBzcmMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgaW50ZXJwcmV0YXRpb25fdGV4dDogc3JjLnJlZmVyZW5jZV9yYW5nZSB8fCBcIlwiLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB0cnlBZGQocywgXCI4NDgwLTZcIiwgXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKTtcbiAgICB0cnlBZGQoZCwgXCI4NDYyLTRcIiwgXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBjb25zdCBjb21iaW5lZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4ucHJpbWFyeSB9O1xuICAgIGNvbWJpbmVkLmRpc3BsYXkgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfbmFtZSA9IFwiQmxvb2QgUHJlc3N1cmVcIjtcbiAgICBjb21iaW5lZC5jYXRlZ29yeSA9IFwidml0YWwtc2lnbnNcIjtcbiAgICBjb21iaW5lZC5icF9jb21wb25lbnRzID0gY29tcG9uZW50cztcbiAgICBjb21iaW5lZC5icF9wYW5lbF9sb2luYyA9IFwiODUzNTQtOVwiO1xuICAgIGNvbWJpbmVkLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIGNvbWJpbmVkLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgcGFzc1Rocm91Z2gucHVzaChjb21iaW5lZCk7XG4gIH1cblxuICByZXR1cm4gcGFzc1Rocm91Z2g7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTcGVjaW1lbiBpbmZlcmVuY2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IFNQRUNJTUVOX1JVTEVTOiBSZWFkb25seUFycmF5PFtSZWdFeHAsIHN0cmluZ10+ID0gW1xuICBbL1x1NUMzRnx1cmluZXx1cmluYWx5L2ksIFwiVXJpbmVcIl0sXG4gIFsvXHU3Q0RFfFx1NEZCRlx1NkY1Qlx1ODg0MHxzdG9vbHxmZWNhbHxmYWVjYWx8b2NjdWx0XFxzKmJsb29kL2ksIFwiU3Rvb2xcIl0sXG4gIFsvXHU3NUYwfHNwdXR1bS9pLCBcIlNwdXR1bVwiXSxcbiAgWy9cdTgxNjZcdTgxMEFcdTZEQjJ8Y3NmfGNlcmVicm9zcGluYWwvaSwgXCJDZXJlYnJvc3BpbmFsIGZsdWlkXCJdLFxuICBbL1x1ODBGOFx1NkMzNHxwbGV1cmFsL2ksIFwiUGxldXJhbCBmbHVpZFwiXSxcbiAgWy9cdTgxNzlcdTZDMzR8YXNjaXRlc3xwZXJpdG9uZWFsL2ksIFwiUGVyaXRvbmVhbCBmbHVpZFwiXSxcbiAgWy9cdTk2NzBcdTkwNTN8XHU2MkI5XHU3MjQ3fGNlcnZpY2FsfHBhcFxccypzbWVhcnx2YWdpbmFsL2ksIFwiQ2VydmljYWwvVmFnaW5hbFwiXSxcbiAgWy9cdTk1RENcdTdCQzBcdTZEQjJ8c3lub3ZpYWx8am9pbnRcXHMqZmx1aWQvaSwgXCJTeW5vdmlhbCBmbHVpZFwiXSxcbiAgWy9cdTdGOEFcdTZDMzR8YW1uaW90aWMvaSwgXCJBbW5pb3RpYyBmbHVpZFwiXSxcbiAgWy9cdTlBQThcdTlBRDN8Ym9uZVxccyptYXJyb3cvaSwgXCJCb25lIG1hcnJvd1wiXSxcbl07XG5cbmZ1bmN0aW9uIGluZmVyU3BlY2ltZW4oLi4uaGludHM6IEFycmF5PHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ+KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGJsb2IgPSBoaW50c1xuICAgIC5maWx0ZXIoKGgpOiBoIGlzIHN0cmluZyA9PiBCb29sZWFuKGgpKVxuICAgIC5qb2luKFwiIFwiKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIWJsb2IpIHJldHVybiBudWxsO1xuICBmb3IgKGNvbnN0IFtwYXR0ZXJuLCBsYWJlbF0gb2YgU1BFQ0lNRU5fUlVMRVMpIHtcbiAgICBpZiAocGF0dGVybi50ZXN0KGJsb2IpKSByZXR1cm4gbGFiZWw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNYXAgc2luZ2xlIE9ic2VydmF0aW9uIChub24tZ3JvdXBlZCBwYXRoKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIGNvZGUpKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICBpZiAoIWhhc1ZhbHVlICYmICFoYXNNZWFuaW5nZnVsSW50ZXJwKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSwgcmF3LmRhdGUgPz8gXCJcIik7XG4gIGNvbnN0IGxvaW5jID0gZmluZExvaW5jKGNvZGUsIGRpc3BsYXkpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IFwibGFib3JhdG9yeVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCByciA9IHBhcnNlUmFuZ2UoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnIpIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gW3JyXTtcbiAgfVxuXG4gIGNvbnN0IGludGVycENvZGluZ1Jlc3VsdCA9XG4gICAgbWFwSW50ZXJwcmV0YXRpb24oaW50ZXJwKSB8fFxuICAgIGRlcml2ZUludGVycHJldGF0aW9uKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCA/IFN0cmluZyh2YWx1ZSkgOiBcIlwiLFxuICAgICAgcmVzb3VyY2UudmFsdWVRdWFudGl0eSBhcyBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgICAgIChyZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSBhcyBSYW5nZUVudHJ5W10gfCB1bmRlZmluZWQpPy5bMF0sXG4gICAgKTtcbiAgaWYgKGludGVycENvZGluZ1Jlc3VsdCkge1xuICAgIHJlc291cmNlLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbaW50ZXJwQ29kaW5nUmVzdWx0XSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJ1aWxkIG9ic2VydmF0aW9uIHdpdGhpbiBhIHBhbmVsICh3aXRoIGNhbm9uaWNhbCBsYWIga2V5IGlkKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gYnVpbGRPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbiAgcGFuZWxDb2RlOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIC8vIEJQIHBhbmVsOiBwcmVidWlsdCBieSBjb21iaW5lQnBJdGVtcy5cbiAgaWYgKHJhdy5icF9jb21wb25lbnRzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJvYnNcIiwgXCJCUF9QQU5FTFwiLCBkYXRlLCBob3NwaXRhbCk7XG4gICAgY29uc3QgY29tcG9uZW50UmVzb3VyY2VzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYyBvZiByYXcuYnBfY29tcG9uZW50cyBhcyBCcENvbXBvbmVudFtdKSB7XG4gICAgICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgICAgICB2YWx1ZTogYy52YWx1ZSxcbiAgICAgICAgdW5pdDogYy51bml0IHx8IFwibW1IZ1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiB0b1VjdW0oYy51bml0KSA/PyBcIm1tW0hnXVwiLFxuICAgICAgfTtcbiAgICAgIGNvbXBvbmVudFJlc291cmNlcy5wdXNoKHtcbiAgICAgICAgY29kZToge1xuICAgICAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIiwgY29kZTogYy5sb2luYywgZGlzcGxheTogYy5kaXNwbGF5IH1dLFxuICAgICAgICAgIHRleHQ6IGMuZGlzcGxheSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWVRdWFudGl0eTogcXR5LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGJwT2JzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgICBpZDogb2JzSWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgY29kZTogXCJ2aXRhbC1zaWduc1wiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgICAgICAgY29kZTogcmF3LmJwX3BhbmVsX2xvaW5jID8/IFwiODUzNTQtOVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IFwiQmxvb2QgUHJlc3N1cmVcIixcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgY29tcG9uZW50OiBjb21wb25lbnRSZXNvdXJjZXMsXG4gICAgfTtcbiAgICBpZiAoZGF0ZSkgYnBPYnMuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtkYXRlfVQwMDowMDowMCswODowMGA7XG4gICAgaWYgKGhvc3BpdGFsKSBicE9icy5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgICByZXR1cm4gYnBPYnM7XG4gIH1cblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IChwYW5lbENvZGUgPyBTdHJpbmcocGFuZWxDb2RlKSA6IFwiXCIpIHx8IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCBjYW5vbmljYWwgPSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgfHwgZGlzcGxheTtcbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIGNhbm9uaWNhbCwgcmF3LmRhdGUgPz8gXCJcIiwgcmF3Lmhvc3BpdGFsID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCBjYXRDb2RlID0gcmF3LmNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiO1xuICBjb25zdCBDQVRfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBsYWJvcmF0b3J5OiBcIkxhYm9yYXRvcnlcIixcbiAgICBcInZpdGFsLXNpZ25zXCI6IFwiVml0YWwgU2lnbnNcIixcbiAgICBpbWFnaW5nOiBcIkltYWdpbmdcIixcbiAgICBwcm9jZWR1cmU6IFwiUHJvY2VkdXJlXCIsXG4gICAgXCJzb2NpYWwtaGlzdG9yeVwiOiBcIlNvY2lhbCBIaXN0b3J5XCIsXG4gICAgc3VydmV5OiBcIlN1cnZleVwiLFxuICAgIGV4YW06IFwiRXhhbVwiLFxuICAgIHRoZXJhcHk6IFwiVGhlcmFweVwiLFxuICAgIGFjdGl2aXR5OiBcIkFjdGl2aXR5XCIsXG4gIH07XG4gIGNvbnN0IGNhdERpc3BsYXkgPVxuICAgIENBVF9ESVNQTEFZW2NhdENvZGVdID8/IGNhdENvZGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYXRDb2RlLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgaWQ6IG9ic0lkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICBjYXRlZ29yeTogW1xuICAgICAge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogY2F0Q29kZSxcbiAgICAgICAgICAgIGRpc3BsYXk6IGNhdERpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuaG9zcGl0YWwpIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IHJhdy5ob3NwaXRhbCB9XTtcbiAgY29uc3Qgc3BlY2ltZW4gPSBpbmZlclNwZWNpbWVuKHJhdy5vcmRlcl9uYW1lLCByYXcuZGlzcGxheSwgcmF3LmNvZGUpO1xuICBpZiAoc3BlY2ltZW4pIHJlc291cmNlLnNwZWNpbWVuID0geyBkaXNwbGF5OiBzcGVjaW1lbiB9O1xuXG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBpZiAoaGFzVmFsdWUpIHtcbiAgICBjb25zdCBxdHkgPSB0cnlQYXJzZVF1YW50aXR5KFN0cmluZyh2YWx1ZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChxdHkpIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgPSBxdHk7XG4gICAgZWxzZSByZXNvdXJjZS52YWx1ZVN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBpZiAocmF3LnJlZmVyZW5jZV9yYW5nZSkge1xuICAgIGNvbnN0IHJycyA9IHBhcnNlUmFuZ2VNdWx0aShTdHJpbmcocmF3LnJlZmVyZW5jZV9yYW5nZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChycnMubGVuZ3RoID4gMCkgcmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgPSBycnM7XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBHcm91cCBieSAob3JkZXJfY29kZSwgZGF0ZSwgaG9zcGl0YWwpIFx1MjE5MiBEUiArIE9ic2VydmF0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZ3JvdXBCeU9yZGVyQ29kZShcbiAgY2xlYW5lZDogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGxldCB3b3JraW5nID0gZGVkdXBlQ3Jvc3NGb3JtYXQoY2xlYW5lZCk7XG4gIHdvcmtpbmcgPSBjb21iaW5lQnBJdGVtcyh3b3JraW5nKTtcblxuICBjb25zdCBncm91cHMgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBjb25zdCBrZXlNZXRhID0gbmV3IE1hcDxzdHJpbmcsIHsgZ3JvdXBLZXlDb2RlOiBzdHJpbmc7IGRhdGU6IHN0cmluZzsgaG9zcGl0YWw6IHN0cmluZyB9PigpO1xuICBmb3IgKGNvbnN0IHJhdyBvZiB3b3JraW5nKSB7XG4gICAgY29uc3QgZ3JvdXBLZXlDb2RlID0gcmF3Lm9yZGVyX2NvZGUgfHwgcmF3LmNvZGUgfHwgcmF3LmRpc3BsYXkgfHwgXCJcIjtcbiAgICBjb25zdCBkYXRlID0gcmF3LmRhdGUgPz8gXCJcIjtcbiAgICBjb25zdCBob3NwaXRhbCA9IHJhdy5ob3NwaXRhbCA/PyBcIlwiO1xuICAgIGNvbnN0IGtleSA9IGAke2dyb3VwS2V5Q29kZX18JHtkYXRlfXwke2hvc3BpdGFsfWA7XG4gICAgY29uc3QgYXJyID0gZ3JvdXBzLmdldChrZXkpO1xuICAgIGlmIChhcnIpIGFyci5wdXNoKHJhdyk7XG4gICAgZWxzZSB7XG4gICAgICBncm91cHMuc2V0KGtleSwgW3Jhd10pO1xuICAgICAga2V5TWV0YS5zZXQoa2V5LCB7IGdyb3VwS2V5Q29kZTogU3RyaW5nKGdyb3VwS2V5Q29kZSksIGRhdGUsIGhvc3BpdGFsIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgW2tleSwgaXRlbXNdIG9mIGdyb3Vwcy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBtZXRhID0ga2V5TWV0YS5nZXQoa2V5KSE7XG4gICAgY29uc3QgZGVkdXBlZCA9IGRlZHVwZVBhbmVsSXRlbXMoaXRlbXMpO1xuXG4gICAgY29uc3Qgb2JzUmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgICBjb25zdCBzZWVuT2JzSWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBpdCBvZiBkZWR1cGVkKSB7XG4gICAgICBjb25zdCBvYnMgPSBidWlsZE9ic2VydmF0aW9uKGl0LCBwYXRpZW50SWQsIG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICAgIGlmICghb2JzKSBjb250aW51ZTtcbiAgICAgIGlmIChzZWVuT2JzSWRzLmhhcyhvYnMuaWQpKSBjb250aW51ZTtcbiAgICAgIHNlZW5PYnNJZHMuYWRkKG9icy5pZCk7XG4gICAgICBvYnNSZXNvdXJjZXMucHVzaChvYnMpO1xuICAgIH1cbiAgICBpZiAob2JzUmVzb3VyY2VzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG5cbiAgICAvLyBCUCBwYW5lbDogZW1pdCBPYnNlcnZhdGlvbiBkaXJlY3RseSAobm8gRFIgd3JhcHBlcikuXG4gICAgY29uc3QgaXNCcFBhbmVsID0gZGVkdXBlZC5ldmVyeSgoaXQpID0+IGl0LmJwX2NvbXBvbmVudHMgfHwgaXQuZGlzcGxheSA9PT0gXCJCbG9vZCBQcmVzc3VyZVwiKTtcbiAgICBpZiAoaXNCcFBhbmVsKSB7XG4gICAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JkZXJOYW1lID0gZGVkdXBlZC5maW5kKChpdCkgPT4gaXQub3JkZXJfbmFtZSk/Lm9yZGVyX25hbWUgPz8gbnVsbDtcbiAgICBjb25zdCBtZW1iZXJLZXlzID0gQXJyYXkuZnJvbShcbiAgICAgIG5ldyBTZXQoZGVkdXBlZC5maWx0ZXIoKGl0KSA9PiBpdC5kaXNwbGF5KS5tYXAoKGl0KSA9PiBjYW5vbmljYWxMYWJLZXkoaXQuZGlzcGxheSkpKSxcbiAgICApLnNvcnQoKTtcbiAgICBjb25zdCBwYW5lbFNpZ25hdHVyZSA9IG1lbWJlcktleXMuam9pbihcIixcIikgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICBjb25zdCBkcklkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIkRSXCIsIHBhbmVsU2lnbmF0dXJlLCBtZXRhLmRhdGUsIG1ldGEuaG9zcGl0YWwpO1xuXG4gICAgbGV0IHBhbmVsVGl0bGU6IHN0cmluZztcbiAgICBpZiAoZGVkdXBlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHNpbmdsZURpc3BsYXkgPSBkZWR1cGVkWzBdIS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBwYW5lbFRpdGxlID0gc2luZ2xlRGlzcGxheSB8fCBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWxUaXRsZSA9IG9yZGVyTmFtZSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGRyQ29kZVN5c3RlbSA9IE5ISV9MQUJfQ09ERV9SRS50ZXN0KFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgPz8gXCJcIilcbiAgICAgID8gc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX0xBQl9DT0RFO1xuXG4gICAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICByZXNvdXJjZVR5cGU6IFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICAgICAgaWQ6IGRySWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjItMDA3NFwiLFxuICAgICAgICAgICAgICBjb2RlOiBcIkxBQlwiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIkxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjb2RlOiB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogZHJDb2RlU3lzdGVtLFxuICAgICAgICAgICAgY29kZTogU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKSB8fCBcIlVOS05PV05cIixcbiAgICAgICAgICAgIGRpc3BsYXk6IHBhbmVsVGl0bGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogcGFuZWxUaXRsZSxcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgcmVzdWx0OiBvYnNSZXNvdXJjZXMubWFwKChvKSA9PiAoeyByZWZlcmVuY2U6IGBPYnNlcnZhdGlvbi8ke28uaWR9YCB9KSksXG4gICAgfTtcbiAgICBpZiAobWV0YS5kYXRlKSBkci5lZmZlY3RpdmVEYXRlVGltZSA9IGAke21ldGEuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChtZXRhLmhvc3BpdGFsKSBkci5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBtZXRhLmhvc3BpdGFsIH1dO1xuXG4gICAgb3V0LnB1c2goZHIpO1xuICAgIG91dC5wdXNoKC4uLm9ic1Jlc291cmNlcyk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgY2xlYW5lZCA9IGZpbHRlckxhYlJvd3MocmF3SXRlbXMpO1xuICByZXR1cm4gZ3JvdXBCeU9yZGVyQ29kZShjbGVhbmVkLCBwYXRpZW50SWQpO1xufVxuIiwgIi8vIE5ISS1GSElSIEJyaWRnZSBwb3B1cCBsb2dpYy5cbi8vXG4vLyBGbG93OlxuLy8gICAxLiBPbiBvcGVuLCBjaGVjayB0aGUgYWN0aXZlIHRhYiBpcyBhbiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHBhZ2UuXG4vLyAgIDIuIFVzZXIgY29uZmlybXMgcGF0aWVudCBpZGVudGl0eSAoXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGKSBpbiB0aGUgcGF0aWVudC1vdmVycmlkZSBjYXJkLlxuLy8gICAzLiBDbGlja3MgXCJcdUQ4M0RcdURDRTUgXHU1NDBDXHU2QjY1XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XCIgXHUyMTkyIGJhY2tncm91bmQgcnVucyBydW5OaGlBcGlTeW5jKCkuXG4vLyAgIDQuIFByb2dyZXNzIHN0cmVhbWVkIGJhY2sgdmlhIGNocm9tZS5zdG9yYWdlLmxvY2FsLnN5bmNTdGF0dXMuXG4vLyAgIDUuIEFmdGVyIHN5bmMgY29tcGxldGVzLCBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU1NUYgU01BUlQgQXBwXCIgbGF1bmNoZXMgd2l0aCB0aGF0IHBhdGllbnQuXG5cbmltcG9ydCB7IG1hc2tJZCwgbWFza05hbWUgfSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgREVGQVVMVF9CQUNLRU5EID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMTBcIjtcbi8vIERlZmF1bHQgU01BUlQgYXBwIGZvciBhIGZyZXNoIGluc3RhbGwuIFVzZXJzIGNhbiBvdmVycmlkZSB2aWFcbi8vIHRoZSAnXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgU01BUlQgQXBwIExhdW5jaCBVUkwnIGZpZWxkOyB0aGUgdmFsdWUgaXNcbi8vIHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZS5zeW5jIHVuZGVyIGBzbWFydEFwcExhdW5jaFVybGAuXG5jb25zdCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0ggPSBcImh0dHBzOi8vdm9obzAwMDAuZ2l0aHViLmlvL21lZGljYWwtbm90ZS1zbWFydC1vbi1maGlyL3NtYXJ0L2xhdW5jaFwiO1xuXG4vLyBUcnVlIGlmIHRoZSBhY3RpdmUgdGFiIGlzIGFuIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgcGFnZSAocmVhbCBzaXRlKS5cbmZ1bmN0aW9uIGlzTmhpVGFiKHVybCkge1xuICBpZiAoIXVybCkgcmV0dXJuIGZhbHNlO1xuICB0cnkge1xuICAgIGNvbnN0IHUgPSB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiID8gbmV3IFVSTCh1cmwpIDogdXJsO1xuICAgIHJldHVybiAvbXloZWFsdGhiYW5rXFwubmhpXFwuZ292XFwudHcvLnRlc3QodS5ob3N0bmFtZSk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5jb25zdCBERUZBVUxUX01PREUgPSBcImxvY2FsXCI7XG5cbmNvbnN0IGVscyA9IHtcbiAgbW9kZVJhZGlvczogKCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInN5bmMtbW9kZVwiXScpLFxuICBiYWNrZW5kVXJsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhY2tlbmQtdXJsXCIpLFxuICBzeW5jQXBpS2V5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN5bmMtYXBpLWtleVwiKSxcbiAgc21hcnRBcHBVcmw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic21hcnQtYXBwLXVybFwiKSxcbiAgc3luY0FwaUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWFwaS1idG5cIiksXG4gIGFwaVN5bmNSYW5nZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcGktc3luYy1yYW5nZVwiKSxcbiAgc3RvcEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wLWJ0blwiKSxcbiAgb3ZJZE5vOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWlkLW5vXCIpLFxuICBvdk5hbWU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtbmFtZVwiKSxcbiAgb3ZCaXJ0aERhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtYmlydGgtZGF0ZVwiKSxcbiAgb3ZHZW5kZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtZ2VuZGVyXCIpLFxuICBvdlNhdmVCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Ytc2F2ZS1idG5cIiksXG4gIG92Q2xlYXJCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtY2xlYXItYnRuXCIpLFxuICBvdlN1bW1hcnk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcnJpZGUtc3VtbWFyeVwiKSxcbiAgcGF0aWVudE92ZXJyaWRlRGV0YWlsczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXRpZW50LW92ZXJyaWRlXCIpLFxuICBsYXVuY2hCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGF1bmNoLWJ0blwiKSxcbiAgc3RhdHVzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXR1c1wiKSxcbiAgZGFzaGJvYXJkTGluazogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXNoYm9hcmQtbGlua1wiKSxcbiAgcGVuZGluZ0J1bmRsZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwZW5kaW5nLWJ1bmRsZVwiKSxcbiAgZG93bmxvYWRCdW5kbGVCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZG93bmxvYWQtYnVuZGxlLWJ0blwiKSxcbiAgY2xlYXJCdW5kbGVCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xlYXItYnVuZGxlLWJ0blwiKSxcbiAgYnVuZGxlTWV0YTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidW5kbGUtbWV0YVwiKSxcbiAgY29ubkJhbm5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLWJhbm5lclwiKSxcbiAgY29ublNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1zZWN0aW9uXCIpLFxuICBjb25uTWluaTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLW1pbmlcIiksXG4gIGNvbm5Nc2c6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1tc2dcIiksXG4gIGNvbm5SZXRyeUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLXJldHJ5LWJ0blwiKSxcbiAgY29ubkhlbHA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1oZWxwXCIpLFxuICBkYXRhU3RhdGVTZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGEtc3RhdGUtc2VjdGlvblwiKSxcbiAgYmFja2VuZFN0YXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhY2tlbmQtc3RhdGVcIiksXG4gIGxvY2FsU3RhdGVSb3c6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9jYWwtc3RhdGUtcm93XCIpLFxuICBsb2NhbFN0YXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvY2FsLXN0YXRlXCIpLFxuICBwdXNoTG9jYWxCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHVzaC1sb2NhbC1idG5cIiksXG4gIHN5bmNTdGF0dXNIaW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN5bmMtc3RhdHVzLWhpbnRcIiksXG4gIHNpZGViYXJFbmFibGVkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZGViYXItZW5hYmxlZFwiKSxcbiAgbWFza05hbWVFbmFibGVkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hc2stbmFtZS1lbmFibGVkXCIpLFxuICBvcGVuTmhpU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW5oaS1zZWN0aW9uXCIpLFxuICBvcGVuTmhpQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tbmhpLWJ0blwiKSxcbn07XG5cbmNvbnN0IE5ISV9MQU5ESU5HID0gXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3L0lIS0UzMDAwXCI7XG5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcblxuLy8gUGVyc2lzdGVkLXN0YXRlIGtleXMuIEJhY2tlbmQgVVJMIGFuZCBBUEkga2V5IHBlcnNpc3QgYWNyb3NzIGJyb3dzZXIgc2Vzc2lvbnMuXG5hc3luYyBmdW5jdGlvbiBsb2FkQmFja2VuZFVybCgpIHtcbiAgY29uc3QgeyBiYWNrZW5kVXJsLCBzeW5jQXBpS2V5LCBzbWFydEFwcExhdW5jaFVybCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXG4gICAgW1wiYmFja2VuZFVybFwiLCBcInN5bmNBcGlLZXlcIiwgXCJzbWFydEFwcExhdW5jaFVybFwiXVxuICApO1xuICBlbHMuYmFja2VuZFVybC52YWx1ZSA9IGJhY2tlbmRVcmwgfHwgREVGQVVMVF9CQUNLRU5EO1xuICBlbHMuc3luY0FwaUtleS52YWx1ZSA9IHN5bmNBcGlLZXkgfHwgXCJcIjtcbiAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gc21hcnRBcHBMYXVuY2hVcmwgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGF0aWVudCBvdmVycmlkZSAobWFudWFsIE5ISSBpZGVudGl0eSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGRvZXNuJ3QgZXhwb3NlIHRoZSB1c2VyJ3MgbmF0aW9uYWwgSUQgaW4gdGhlIFVSTC4gVGhlIHVzZXJcbi8vIGZpbGxzIHRoZXNlIG9uY2UgYW5kIHRoZXkncmUgc2VudCB3aXRoIGV2ZXJ5IHVwbG9hZCBjYWxsIHVudGlsIGNsZWFyZWQuXG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGNvbnN0IHsgcGF0aWVudE92ZXJyaWRlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcInBhdGllbnRPdmVycmlkZVwiKTtcbiAgaWYgKHBhdGllbnRPdmVycmlkZSkge1xuICAgIGVscy5vdklkTm8udmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIjtcbiAgICBlbHMub3ZOYW1lLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIjtcbiAgICBlbHMub3ZCaXJ0aERhdGUudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuYmlydGhfZGF0ZSB8fCBcIlwiO1xuICAgIGVscy5vdkdlbmRlci52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5nZW5kZXIgfHwgXCJcIjtcbiAgfVxuICAvLyBGaXJzdC10aW1lIFVYOiBpZiBubyBpZF9ubyBpcyBzdG9yZWQsIGF1dG8tZXhwYW5kIHRoZSBwYXRpZW50LWRhdGFcbiAgLy8gZGV0YWlscyBzbyB0aGUgdXNlciBpbW1lZGlhdGVseSBzZWVzIHRoZSByZXF1aXJlZCBmaWVsZHMuIE9uY2VcbiAgLy8gdGhleSd2ZSBzYXZlZCBhIHZhbHVlLCBkZWZhdWx0IHRvIGNvbGxhcHNlZC5cbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSB7XG4gICAgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9ICFwYXRpZW50T3ZlcnJpZGU/LmlkX25vO1xuICB9XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aWVudE92ZXJyaWRlKCkge1xuICAvLyBSZXR1cm5zIHtpZF9ubywgbmFtZSwgYmlydGhfZGF0ZSwgZ2VuZGVyfS5cbiAgLy8gaWRfbm8gaXMgb3B0aW9uYWwgaW4gdGhlIFVJOyBpZiBibGFuayB0aGUgcG9wdXAgYXV0by1nZW5lcmF0ZXMgYW5cbiAgLy8gXCJhdXRvLVhYWFhYWFhYXCIgaWRlbnRpZmllciBhdCBzYXZlIHRpbWUuIFJldHVybnMgbnVsbCB3aGVuIGJvdGhcbiAgLy8gaWRfbm8gYW5kIG5hbWUgYXJlIGVtcHR5IChub3RoaW5nIGlkZW50aWZ5aW5nIHRvIHNhdmUpLlxuICBjb25zdCBpZF9ubyA9IGVscy5vdklkTm8udmFsdWUudHJpbSgpO1xuICBjb25zdCBuYW1lID0gZWxzLm92TmFtZS52YWx1ZS50cmltKCk7XG4gIGlmICghaWRfbm8gJiYgIW5hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBvdXQgPSBpZF9ubyA/IHsgaWRfbm8gfSA6IHt9O1xuICBpZiAobmFtZSkgb3V0Lm5hbWUgPSBuYW1lO1xuICBjb25zdCBiaXJ0aF9kYXRlID0gZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgZ2VuZGVyID0gZWxzLm92R2VuZGVyLnZhbHVlO1xuICBpZiAoYmlydGhfZGF0ZSkgb3V0LmJpcnRoX2RhdGUgPSBiaXJ0aF9kYXRlO1xuICBpZiAoZ2VuZGVyKSBvdXQuZ2VuZGVyID0gZ2VuZGVyO1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyBSYW5kb20gXCJhdXRvLVhYWFhYWFhYXCIgXHUyMDE0IDggaGV4IGNoYXJzIGZyb20gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyBzb1xuLy8gZXZlcnkgZnJlc2ggcG9wdXAgaW5zdGFsbCBnZXRzIGEgZGlmZmVyZW50IElEIGFuZCByZS1zeW5jcyBhcmUgc3RhYmxlLlxuZnVuY3Rpb24gX2dlbmVyYXRlQXV0b1BhdGllbnRJZCgpIHtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gIGNvbnN0IGhleCA9IEFycmF5LmZyb20oYnl0ZXMsIChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpLmpvaW4oXCJcIik7XG4gIHJldHVybiBgYXV0by0ke2hleH1gO1xufVxuXG5mdW5jdGlvbiByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBjYXJkID0gZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHM7XG4gIGlmICghb3YpIHtcbiAgICBlbHMub3ZTdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTY3MkFcdThBMkRcdTVCOUFcIjtcbiAgICBpZiAoY2FyZCkgY2FyZC5kYXRhc2V0LnN0YXRlID0gXCJlbXB0eVwiO1xuICB9IGVsc2Uge1xuICAgIC8vIElEIGFsd2F5cyBzaG93biBoYWxmLW1hc2tlZCAoUDEyMDc0MDg2NiBcdTIxOTIgUDEyMDc0KioqKikgXHUyMDE0IHRoYXRcbiAgICAvLyBtYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gVUkgY29udmVudGlvbiBhbmQgcmVtb3ZlcyBhIHN0YWJsZVxuICAgIC8vIHNob3VsZGVyLXN1cmZpbmcgdGFyZ2V0LiBSYXcgdmFsdWUgc3RpbGwgaW4gY2hyb21lLnN0b3JhZ2UgYW5kXG4gICAgLy8gdmlzaWJsZSBpbiB0aGUgaW5wdXQgZmllbGQgd2hlbiB0aGUgY2FyZCBpcyBleHBhbmRlZC5cbiAgICAvLyBOYW1lIGZvbGxvd3MgdGhlIHRvZ2dsZSAoXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4IFx1OTgxMFx1OEEyRFx1OTVEQyA9IFx1NzcxRlx1NTQwRCAvIG11bHRpLXBhdGllbnRcbiAgICAvLyBkZW1vIFx1OTU4Qlx1NTU1RiA9IFx1OTA2RVx1N0Y2OSkuXG4gICAgY29uc3QgcGFydHMgPSBbbWFza0lkKG92LmlkX25vKV07XG4gICAgaWYgKG92Lm5hbWUpIHBhcnRzLnB1c2goX21heWJlTWFzayhvdi5uYW1lKSk7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IGBcdTI3MTMgJHtwYXJ0cy5qb2luKFwiICBcdTAwQjcgIFwiKX1gO1xuICAgIGlmIChjYXJkKSBjYXJkLmRhdGFzZXQuc3RhdGUgPSBcImZpbGxlZFwiO1xuICB9XG4gIC8vIEJvdGggbGF1bmNoICsgc3luYyBlbmFibGVkIHN0YXRlIGRlcGVuZCBvbiBwYXRpZW50ICsgbW9kZSArIGNvbm4uXG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIENoYW5naW5nIHBhdGllbnQgSUQgaW52YWxpZGF0ZXM6IChhKSBiYWNrZW5kLXN0YXRlIGNhY2hlIChuZXdcbiAgLy8gcGF0aWVudCBtaWdodCBub3QgYmUgb24gYmFja2VuZCk7IChiKSBsb2NhbC1idW5kbGUgcm93IGluIHRoZVxuICAvLyBkYXRhLXN0YXRlIGNhcmQ7IChjKSB0aGUgXHVEODNEXHVEQ0U1IGRvd25sb2FkIGJ1bmRsZSBzZWN0aW9uLCB3aGljaCB3b3VsZFxuICAvLyBvdGhlcndpc2Ugc3RpbGwgc2hvdyB0aGUgcHJldmlvdXMgcGF0aWVudCdzIHN0YXNoZWQgZmlsZTsgKGQpXG4gIC8vIHRoZSBsYXN0IGNvbXBsZXRlZCBzeW5jJ3Mgc3VjY2VzcyBtZXNzYWdlLCB3aGljaCB3YXMgdGFnZ2VkIGZvclxuICAvLyB0aGUgcHJldmlvdXMgcGF0aWVudC5cbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuICBfY2xlYXJTdGFsZVN5bmNTdGF0dXMoZ2V0UGF0aWVudE92ZXJyaWRlKCkpO1xuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiYgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG59XG5cbi8vIERyb3AgYSBcIlx1MjcwNSBcdTU0MENcdTZCNjVcdTVCOENcdTYyMTAgXHUyMDI2XCIgc3RhdHVzIGJhbm5lciB0aGF0IHdhcyByZWNvcmRlZCBmb3IgYVxuLy8gZGlmZmVyZW50IHBhdGllbnQuIE1pZC1mbGlnaHQgc3luY3MgYXJlIGxlZnQgYWxvbmUgKHN0YXR1cy5ydW5uaW5nKVxuLy8gc28gdGhlIHVzZXIgY2FuIHN0aWxsIHNlZSBwcm9ncmVzcyBvZiB0aGUgaW4tZmxpZ2h0IHN5bmMuXG5mdW5jdGlvbiBfY2xlYXJTdGFsZVN5bmNTdGF0dXMob3YpIHtcbiAgaWYgKCFfbGF0ZXN0U3RhdHVzKSByZXR1cm47XG4gIGlmIChfbGF0ZXN0U3RhdHVzLnJ1bm5pbmcpIHJldHVybjtcbiAgaWYgKCFfbGF0ZXN0U3RhdHVzLmhpc3RubykgcmV0dXJuO1xuICBpZiAob3Y/LmlkX25vID09PSBfbGF0ZXN0U3RhdHVzLmhpc3RubykgcmV0dXJuO1xuICBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbiAgc2V0U3RhdHVzKFwiXCIsIG51bGwpO1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoXCJzeW5jU3RhdHVzXCIpLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2F2ZVBhdGllbnRPdmVycmlkZSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdikge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdThBQ0JcdTgxRjNcdTVDMTFcdTU4NkJcdTVCRUJcdTU5RDNcdTU0MERcdTYyMTZcdThFQUJcdTUyMDZcdThCNDlcdTVCNTdcdTg2NUZcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gSUQgYXV0by1nZW5lcmF0aW9uOiBpZiB1c2VyIGxlZnQgaWRfbm8gYmxhbmssIG1pbnQgYW4gXCJhdXRvLVhYWFhcIlxuICAvLyBhbmQgc3Rhc2ggaXQgaW4gdGhlIFVJIHNvIHN1YnNlcXVlbnQgcmUtc3luY3MgdXNlIHRoZSBzYW1lIEZISVJcbiAgLy8gUGF0aWVudC5pZCAoc3RvcmFnZSBwZXJzaXN0ZW5jZSBrZWVwcyBpdCBzdGFibGUgYWNyb3NzIHJlLW9wZW5zKS5cbiAgaWYgKCFvdi5pZF9ubykge1xuICAgIG92LmlkX25vID0gX2dlbmVyYXRlQXV0b1BhdGllbnRJZCgpO1xuICAgIGVscy5vdklkTm8udmFsdWUgPSBvdi5pZF9ubztcbiAgfVxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHBhdGllbnRPdmVycmlkZTogb3YgfSk7XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSBlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscy5vcGVuID0gZmFsc2U7XG4gIC8vIE1ha2UgY2xlYXIgdGhpcyBpcyB0aGUgaWRlbnRpdHkgc2F2ZSwgbm90IGEgbWVkaWNhbC1yZWNvcmQgc3luYyBcdTIwMTRcbiAgLy8gXHUzMDBDXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XHUzMDBEYWxvbmUgcmVhZHMgYXMgXCJwYXRpZW50IGRhdGFcIiAobWVkaWNhbCkgZm9yIHNvbWUgdXNlcnMuXG4gIC8vIElEIGhhbGYtbWFza2VkIGluIHRoZSB0b2FzdCBmb3IgdGhlIHNhbWUgc2hvdWxkZXItc3VyZmluZyByZWFzb25cbiAgLy8gYXMgdGhlIHN1bW1hcnkgbGluZSBhYm92ZS5cbiAgY29uc3QgZGlzcGxheU5hbWUgPSBvdi5uYW1lID8gYCAoJHtfbWF5YmVNYXNrKG92Lm5hbWUpfSlgIDogXCJcIjtcbiAgc2V0U3RhdHVzKGBcdTI3MDUgXHU3NUM1XHU0RUJBXHU4RUFCXHU0RUZEXHU1REYyXHU4QTE4XHU0RjRGXHVGRjFBJHttYXNrSWQob3YuaWRfbm8pfSR7ZGlzcGxheU5hbWV9YCwgXCJzdWNjZXNzXCIpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjbGVhclBhdGllbnRPdmVycmlkZSgpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoXCJwYXRpZW50T3ZlcnJpZGVcIik7XG4gIGVscy5vdklkTm8udmFsdWUgPSBcIlwiO1xuICBlbHMub3ZOYW1lLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92QmlydGhEYXRlLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92R2VuZGVyLnZhbHVlID0gXCJcIjtcbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xuICBpZiAoZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMpIGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzLm9wZW4gPSB0cnVlO1xuICBzZXRTdGF0dXMoXCJcdTVERjJcdTZFMDVcdTk2NjRcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIiwgXCJpbmZvXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBjb25uZWN0aW9uIHN0YXRlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGg6IGBfY29ublN0YXRlYCByZWZsZWN0cyB0aGUgbGF0ZXN0IGJhY2tlbmRcbi8vIGNvbm5lY3Rpdml0eSBjaGVjay4gQm90aCB0aGUgYmFubmVyIFVJIGFuZCB0aGUgZW5hYmxlZC1zdGF0ZSBvZiB0aGVcbi8vIFx1RDgzRFx1RENFNSBTeW5jIC8gXHVEODNEXHVERTgwIExhdW5jaCBidXR0b25zIHJlYWQgZnJvbSBpdC5cbi8vXG4vLyBTdGF0ZXM6XG4vLyAgIFwidW5rbm93blwiICBcdTIwMTQgbm90IHlldCBjaGVja2VkIChlLmcuIGZpcnN0IHBhaW50IGluIGxvY2FsIG1vZGUpXG4vLyAgIFwiY2hlY2tpbmdcIiBcdTIwMTQgZmV0Y2ggaW4gZmxpZ2h0XG4vLyAgIFwib2tcIiAgICAgICBcdTIwMTQgR0VUIC9maGlyL21ldGFkYXRhIHJldHVybmVkIGEgRkhJUiBDYXBhYmlsaXR5U3RhdGVtZW50XG4vLyAgIFwiZmFpbFwiICAgICBcdTIwMTQgYW55dGhpbmcgZWxzZTsgYF9jb25uRmFpbFJlYXNvbmAgY2FycmllcyBkZXRhaWxcbi8vXG4vLyBCYWNrZW5kIGNvbm5lY3Rpdml0eSBpcyB0cmVhdGVkIGFzIGEgKnByZXJlcXVpc2l0ZSogZm9yIGJhY2tlbmQgbW9kZSxcbi8vIG5vdCBhcyBhIHBlci1hY3Rpb24gY2hlY2suIFN3aXRjaGluZyB0byBiYWNrZW5kIG1vZGUgdHJpZ2dlcnMgYSB0ZXN0XG4vLyBpbW1lZGlhdGVseTsgZmFpbHVyZSBzaG93cyBhIGJhbm5lciB3aXRoIGFjdGlvbmFibGUgZ3VpZGFuY2UgYW5kXG4vLyBkaXNhYmxlcyBib3RoIGFjdGlvbiBidXR0b25zIHVudGlsIGNvbm5lY3Rpdml0eSByZWNvdmVycy5cblxubGV0IF9jb25uU3RhdGUgPSBcInVua25vd25cIjtcbmxldCBfY29ubkZhaWxSZWFzb24gPSBudWxsOyAvLyB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIHwgXCJuby11cmxcIiB8IFwibmV0d29ya1wiIHwgXCJ0aW1lb3V0XCIgfCBcImh0dHBcIiB8IFwibm90LWZoaXJcIiwgZGV0YWlsPyB9XG5cbmNvbnN0IF9DT05OX0xBQkVMUyA9IHtcbiAgdW5rbm93bjogXCJcdTY3MkFcdTZBQTJcdTZFMkNcIixcbiAgY2hlY2tpbmc6IFwiXHU2QUEyXHU2RTJDXHU0RTJEXHUyMDI2XCIsXG4gIG9rOiAoKSA9PiBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gLFxuICBmYWlsOiAoKSA9PiB7XG4gICAgY29uc3QgciA9IF9jb25uRmFpbFJlYXNvbiB8fCB7fTtcbiAgICByZXR1cm4gKHtcbiAgICAgIFwibm8tdXJsXCI6IFwiXHUyNzE3IFx1NjcyQVx1OEEyRFx1NUI5QSBCYWNrZW5kIFVSTFwiLFxuICAgICAgXCJuby1wZXJtaXNzaW9uXCI6IFwiXHUyNzE3IFx1NjcyQVx1NjM4OFx1NkIwQVx1OTAyM1x1N0REQVwiLFxuICAgICAgXCJuZXR3b3JrXCI6IFwiXHUyNzE3IFx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiLFxuICAgICAgXCJ0aW1lb3V0XCI6IFwiXHUyNzE3IFx1OTAyM1x1N0REQVx1OTAzRVx1NjY0MlwiLFxuICAgICAgXCJodHRwXCI6IGBcdTI3MTcgSFRUUCAke3IuZGV0YWlsIHx8IFwiXCJ9YC50cmltKCksXG4gICAgICBcIm5vdC1maGlyXCI6IFwiXHUyNzE3IFx1NTZERVx1NjFDOVx1NEUwRFx1NjYyRiBGSElSXCIsXG4gICAgfSlbci5raW5kXSA/PyBcIlx1MjcxNyBcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTdcIjtcbiAgfSxcbn07XG5cbmNvbnN0IF9DT05OX0hFTFAgPSB7XG4gIFwibm8tdXJsXCI6ICAgICAgICBcIlx1OEFDQlx1NTIzMFx1MzAwQ1x1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QVx1MzAwRFx1NTg2Qlx1NTE2NSBCYWNrZW5kIFVSTFx1RkYwQ1x1NEY4Qlx1NTk4MiA8Y29kZT5odHRwOi8vbG9jYWxob3N0OjgwMTA8L2NvZGU+XHUzMDAyXCIsXG4gIFwibm8tcGVybWlzc2lvblwiOiBcIkNocm9tZSBcdTk2M0JcdTY0Q0JcdTRFODZcdThERThcdTRGODZcdTZFOTBcdThBQ0JcdTZDNDJcdTMwMDJcdThBQ0JcdTkxQ0RcdTY1QjBcdTk1OEIgcG9wdXBcdUZGMENcdTc1NzZcdTZCMEFcdTk2NTBcdTVDMERcdThBNzFcdTY4NDZcdThERjNcdTUxRkFcdTY2NDJcdTYzMDlcdTMwMENcdTUxNDFcdThBMzFcdTMwMERcdTMwMDJcIixcbiAgXCJuZXR3b3JrXCI6ICAgICAgIFwiXHU1RjhDXHU3QUVGXHU1M0VGXHU4MEZEXHU5MDg0XHU2QzkyXHU1NTVGXHU1MkQ1XHUzMDAyXHU4QUNCXHU1N0Y3XHU4ODRDXHVGRjFBPGJyPjxjb2RlPmRvY2tlciBjb21wb3NlIHVwIC1kPC9jb2RlPjxicj5cdTc4QkFcdThBOEQgYmFja2VuZCBcdTVCQjlcdTU2NjhcdThERDFcdThENzdcdTRGODZcdTUxOERcdTkxQ0RcdThBNjZcdTMwMDJcIixcbiAgXCJ0aW1lb3V0XCI6ICAgICAgIFwiNSBcdTc5RDJcdTUxNjdcdTZDOTJcdTY1MzZcdTUyMzBcdTU2REVcdTYxQzkgXHUyMDE0IGJhY2tlbmQgXHU1M0VGXHU4MEZEXHU5MDg0XHU1NzI4XHU1NTVGXHU1MkQ1XHU0RTJEXHVGRjBDXHU3QjQ5IDMwIFx1NzlEMlx1NTE4RFx1NjMwOVx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcImh0dHBcIjogICAgICAgICAgXCJCYWNrZW5kIFx1NTZERVx1NjFDOVx1OTMyRlx1OEFBNFx1NzJDMFx1NjE0Qlx1NzhCQ1x1MzAwMlx1NkFBMlx1NjdFNSBiYWNrZW5kIFx1NzY4NCBsb2dcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgbG9ncyBiYWNrZW5kPC9jb2RlPlwiLFxuICBcIm5vdC1maGlyXCI6ICAgICAgXCJcdTkwMTlcdTUwMEIgVVJMIFx1NTZERVx1NEU4Nlx1Njc3MVx1ODk3Rlx1RkYwQ1x1NEY0Nlx1NEUwRFx1NjYyRiBGSElSIENhcGFiaWxpdHlTdGF0ZW1lbnRcdTMwMDJcdTc4QkFcdThBOEQgQmFja2VuZCBVUkwgXHU2MzA3XHU1NDExIE5ISS1GSElSLUJyaWRnZSBcdTc2ODQgL2ZoaXIgXHU2ODM5XHU3NkVFXHU5MzA0XHUzMDAyXCIsXG59O1xuXG5mdW5jdGlvbiBfcmVuZGVyQ29ubkJhbm5lcigpIHtcbiAgY29uc3QgYmFubmVyID0gZWxzLmNvbm5CYW5uZXI7XG4gIGlmICghYmFubmVyKSByZXR1cm47XG4gIGJhbm5lci5kYXRhc2V0LnN0YXRlID0gX2Nvbm5TdGF0ZTtcbiAgY29uc3QgbGFiZWwgPSBfQ09OTl9MQUJFTFNbX2Nvbm5TdGF0ZV07XG4gIGVscy5jb25uTXNnLnRleHRDb250ZW50ID0gdHlwZW9mIGxhYmVsID09PSBcImZ1bmN0aW9uXCIgPyBsYWJlbCgpIDogbGFiZWw7XG4gIGVscy5jb25uUmV0cnlCdG4uaGlkZGVuID0gX2Nvbm5TdGF0ZSAhPT0gXCJmYWlsXCI7XG4gIGlmIChfY29ublN0YXRlID09PSBcImZhaWxcIiAmJiBfY29ubkZhaWxSZWFzb24/LmtpbmQpIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gZmFsc2U7XG4gICAgZWxzLmNvbm5IZWxwLmlubmVySFRNTCA9IF9DT05OX0hFTFBbX2Nvbm5GYWlsUmVhc29uLmtpbmRdID8/IFwiXCI7XG4gIH0gZWxzZSB7XG4gICAgZWxzLmNvbm5IZWxwLmhpZGRlbiA9IHRydWU7XG4gICAgZWxzLmNvbm5IZWxwLmlubmVySFRNTCA9IFwiXCI7XG4gIH1cblxuICAvLyBDb21wYWN0LXBpbGwgdnMgZnVsbC1iYW5uZXIgc3dhcDogd2hlbiBldmVyeXRoaW5nJ3MgZmluZSwgc2hyaW5rIHRvXG4gIC8vIGEgc21hbGwgZ3JlZW4gcGlsbCBpbiB0aGUgaGVhZGVyIHNvIHRoZSBwb3B1cCBib2R5IGhhcyBtb3JlIHJvb21cbiAgLy8gZm9yIGFjdGlvbmFibGUgY29udGVudC4gQW55dGhpbmcgZWxzZSAodW5rbm93biAvIGNoZWNraW5nIC8gZmFpbClcbiAgLy8ga2VlcHMgdGhlIGZ1bGwgYmFubmVyIHNvIHByb2dyZXNzICsgZXJyb3IgaGVscCBoYXMgc3BhY2UgdG8gcmVuZGVyLlxuICBjb25zdCBpc09rID0gX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICBpZiAoZWxzLmNvbm5TZWN0aW9uKSBlbHMuY29ublNlY3Rpb24uaGlkZGVuID0gaXNPaztcbiAgaWYgKGVscy5jb25uTWluaSkge1xuICAgIGVscy5jb25uTWluaS5oaWRkZW4gPSAhaXNPaztcbiAgICBpZiAoaXNPaykgZWxzLmNvbm5NaW5pLnRpdGxlID0gYFx1NURGMlx1OTAyM1x1N0REQSBcdTIwMTQgJHtlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCl9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaEJ1dHRvblN0YXRlcygpIHtcbiAgLy8gU3luYyBidXR0b246IE5ISSB0YWIgcmVxdWlyZWQgKHNldCBlbHNld2hlcmUgdmlhIHN5bmNBcGlCdG4uZGlzYWJsZWQpLlxuICAvLyBJbiBiYWNrZW5kIG1vZGUsIGFkZGl0aW9uYWxseSByZXF1aXJlIGNvbm4gPT09IG9rLlxuICAvLyBJbiBsb2NhbCBtb2RlLCBjb25uIGRvZXNuJ3QgYXBwbHkuXG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBtb2RlT2sgPSBjdXJyZW50TW9kZSgpID09PSBcImxvY2FsXCIgfHwgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9ICEob25OaGkgJiYgbW9kZU9rKTtcbiAgZWxzLnN5bmNBcGlCdG4udGl0bGUgPSAhb25OaGlcbiAgICA/IFwiXHU4QUNCXHU1MTQ4XHU1MjA3XHU1MjMwXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU1MjA2XHU5ODAxXHU1MThEXHU1M0Q2XHU1Rjk3XHU4Q0M3XHU2NTk5XCJcbiAgICA6ICghbW9kZU9rID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIiA6IFwiXCIpO1xuXG4gIC8vIExhdW5jaCBidXR0b246IGJhY2tlbmQgbW9kZSArIGNvbm4gb2sgKyBwYXRpZW50IHNldCArIGJhY2tlbmRcbiAgLy8gYWN0dWFsbHkgaGFzIHRoaXMgcGF0aWVudCAob3RoZXJ3aXNlIHRoZSBTTUFSVCBhcHAgbGF1bmNoZXMgaW50b1xuICAvLyBhbiBlbXB0eSBGSElSIHN0b3JlIFx1MjAxNCBjb25mdXNpbmcgYmxhbmsgc2NyZWVuKS5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgaGF2ZUJhY2tlbmRQYXRpZW50ID0gX2JhY2tlbmRQYXRpZW50LnN0YXRlID09PSBcInByZXNlbnRcIjtcbiAgZWxzLmxhdW5jaEJ0bi5kaXNhYmxlZCA9ICEoXG4gICAgY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiZcbiAgICBfY29ublN0YXRlID09PSBcIm9rXCIgJiZcbiAgICAhIW92Py5pZF9ubyAmJlxuICAgIGhhdmVCYWNrZW5kUGF0aWVudFxuICApO1xuICBlbHMubGF1bmNoQnRuLnRpdGxlID1cbiAgICBjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiAgPyBcIlx1OEFDQlx1NTIwN1x1NTIzMFx1MzAwQ1x1NEUwQVx1NTBCM1x1NUY4Q1x1N0FFRlx1MzAwRFx1NkEyMVx1NUYwRlwiIDpcbiAgICBfY29ublN0YXRlICE9PSBcIm9rXCIgICAgICAgICAgID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIiA6XG4gICAgIW92Py5pZF9ubyAgICAgICAgICAgICAgICAgICAgPyBcIlx1OEFDQlx1NTE0OFx1NTg2Qlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiIDpcbiAgICAhaGF2ZUJhY2tlbmRQYXRpZW50ICAgICAgICAgICA/IFwiXHU1RjhDXHU3QUVGXHU1QzFBXHU3MTIxXHU2QjY0XHU3NUM1XHU0RUJBXHU3Njg0XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTUxNDhcdTUzRDZcdTVGOTdcdThDQzdcdTY1OTlcdTYyMTZcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzBcdTZBOTRcdTY4NDhcIiA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiO1xufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKSB7XG4gIGNvbnN0IHVybCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKTtcbiAgaWYgKCF1cmwpIHtcbiAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJuby11cmxcIiB9O1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7IHJldHVybiBmYWxzZTtcbiAgfVxuICBfY29ublN0YXRlID0gXCJjaGVja2luZ1wiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuXG4gIGNvbnN0IHBlcm0gPSBhd2FpdCBlbnN1cmVCYWNrZW5kUGVybWlzc2lvbih1cmwpO1xuICBpZiAoIXBlcm0ub2spIHtcbiAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJuby1wZXJtaXNzaW9uXCIgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpOyByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjdHJsID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gY3RybC5hYm9ydCgpLCA1MDAwKTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt1cmwucmVwbGFjZSgvXFwvJC8sIFwiXCIpfS9maGlyL21ldGFkYXRhYCwgeyBzaWduYWw6IGN0cmwuc2lnbmFsIH0pO1xuICAgIGlmICghcmVzLm9rKSB7XG4gICAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJodHRwXCIsIGRldGFpbDogcmVzLnN0YXR1cyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVzLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcbiAgICAgIGlmIChib2R5Py5yZXNvdXJjZVR5cGUgIT09IFwiQ2FwYWJpbGl0eVN0YXRlbWVudFwiKSB7XG4gICAgICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vdC1maGlyXCIgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9jb25uU3RhdGUgPSBcIm9rXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiO1xuICAgIF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dFwiIDogXCJuZXR3b3JrXCIgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICB9XG5cbiAgX3JlbmRlckNvbm5CYW5uZXIoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgLy8gV2hlbmV2ZXIgY29ubmVjdGl2aXR5IGZsaXBzLCByZS1jaGVjayB3aGV0aGVyIHRoaXMgcGF0aWVudCBhbHJlYWR5XG4gIC8vIGV4aXN0cyBvbiBiYWNrZW5kLiAoU3RhbGUgXCJfYmFja2VuZFBhdGllbnRcIiBzdGF0ZSB3b3VsZCBvdGhlcndpc2VcbiAgLy8gY2F1c2UgTGF1bmNoIHRvIGxvb2sgZW5hYmxlZCAvIGRpc2FibGVkIHdyb25nbHkuKVxuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgcmV0dXJuIF9jb25uU3RhdGUgPT09IFwib2tcIjtcbn1cblxuZWxzLmNvbm5SZXRyeUJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRlc3RCYWNrZW5kQ29ubmVjdGlvbik7XG5cbi8vIFx1MjUwMFx1MjUwMCBCYWNrZW5kIFx1MjE5NCBsb2NhbCBkYXRhLXN0YXRlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEluZGVwZW5kZW50IG9mIHRoZSBjb25uZWN0aW9uIGJhbm5lciAod2hpY2ggb25seSB0ZWxscyB1cyBcImNhbiB3ZVxuLy8gcmVhY2ggdGhlIGJhY2tlbmRcIikuIFRoaXMgY2FyZCBhbnN3ZXJzIHR3byBxdWVzdGlvbnM6XG4vL1xuLy8gICAxLiBEb2VzIHRoZSBiYWNrZW5kIGFscmVhZHkgaGF2ZSB0aGlzIHBhdGllbnQncyBkYXRhP1xuLy8gICAgICBcdTIxOTIgZHJpdmVzIHdoZXRoZXIgXHVEODNEXHVERTgwIExhdW5jaCBpcyBhbGxvd2VkIGF0IGFsbCAoTGF1bmNoIG9uIGFuXG4vLyAgICAgICAgZW1wdHkgYmFja2VuZCBnaXZlcyBhIGNvbmZ1c2luZyBTTUFSVC1hcHAgYmxhbmspLlxuLy8gICAyLiBEb2VzIHRoZSB1c2VyIGhhdmUgYSBsb2NhbCBCdW5kbGUgdGhhdCdzIG5ld2VyIHRoYW4gdGhlXG4vLyAgICAgIGJhY2tlbmQncyB2aWV3P1xuLy8gICAgICBcdTIxOTIgb2ZmZXIgXCJcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzXHU2NzJDXHU1NzMwIEJ1bmRsZSBcdTUyMzBcdTVGOENcdTdBRUZcIiB0byBwdXNoIGl0IHZpYSAvZmhpci9pbXBvcnRcbi8vICAgICAgICB3aXRob3V0IHJlLWZldGNoaW5nIE5ISSAoZmFzdCwgbm9uLWRlc3RydWN0aXZlOiBzdGFibGUgSURzXG4vLyAgICAgICAgdXBzZXJ0IHNvIGJhY2tlbmQgcmVzb3VyY2VzIGp1c3QgYnVtcCB2ZXJzaW9uSWQpLlxuLy9cbi8vIFdlIGRvbid0IHNlY29uZC1ndWVzcyB0aGUgdXNlcjogZXZlbiB3aGVuIGxvY2FsIGlzIGNsZWFybHkgbmV3ZXIsXG4vLyBMYXVuY2ggc3RheXMgZW5hYmxlZCBpZiB0aGUgYmFja2VuZCBoYXMgdGhlIHBhdGllbnQgXHUyMDE0IHRoZXkgbWF5XG4vLyBnZW51aW5lbHkgd2FudCB0byBsb29rIGF0IHRoZSBvbGRlciBzdGF0ZS4gVGhlIFVJIGxheXMgb3V0IGJvdGhcbi8vIHNpZGVzOyB1c2VyIGRlY2lkZXMuXG5cbmxldCBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4vLyAgIHN0YXRlOiBcInVua25vd25cIiB8IFwiY2hlY2tpbmdcIiB8IFwiYWJzZW50XCIgfCBcInByZXNlbnRcIiB8IFwiZmFpbFwiXG5sZXQgX2xvY2FsQnVuZGxlID0geyBleGlzdHM6IGZhbHNlLCBjb3VudDogMCwgZ2VuZXJhdGVkQXQ6IDAsIHBhdGllbnRJZDogbnVsbCB9O1xuXG5mdW5jdGlvbiBfZm10VGltZVNob3J0KGlzbykge1xuICBpZiAoIWlzbykgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShpc28pO1xuICBpZiAoTnVtYmVyLmlzTmFOKGQuZ2V0VGltZSgpKSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgXCIwXCIpO1xuICByZXR1cm4gYCR7ZC5nZXRNb250aCgpICsgMX0vJHtkLmdldERhdGUoKX0gJHtwYWQoZC5nZXRIb3VycygpKX06JHtwYWQoZC5nZXRNaW51dGVzKCkpfWA7XG59XG5cbmZ1bmN0aW9uIF9mbXRSZWxhdGl2ZShtcykge1xuICBjb25zdCBkaWZmID0gRGF0ZS5ub3coKSAtIG1zO1xuICBpZiAoZGlmZiA8IDYwXzAwMCkgcmV0dXJuIGAke01hdGgubWF4KDEsIE1hdGgucm91bmQoZGlmZiAvIDEwMDApKX0gXHU3OUQyXHU1MjREYDtcbiAgaWYgKGRpZmYgPCAzNjAwXzAwMCkgcmV0dXJuIGAke01hdGgucm91bmQoZGlmZiAvIDYwXzAwMCl9IFx1NTIwNlx1OTQxOFx1NTI0RGA7XG4gIGlmIChkaWZmIDwgODZfNDAwXzAwMCkgcmV0dXJuIGAke01hdGgucm91bmQoZGlmZiAvIDM2MDBfMDAwKX0gXHU1QzBGXHU2NjQyXHU1MjREYDtcbiAgcmV0dXJuIF9mbXRUaW1lU2hvcnQobmV3IERhdGUobXMpLnRvSVNPU3RyaW5nKCkpO1xufVxuXG5mdW5jdGlvbiBfcmVuZGVyRGF0YVN0YXRlKCkge1xuICAvLyBTZWN0aW9uIG9ubHkgdmlzaWJsZSBpbiBiYWNrZW5kIG1vZGUgKGhhbmRsZWQgYnkgLmJhY2tlbmQtb25seSBDU1MpLFxuICAvLyBidXQgd2UgYWxzbyBleHBsaWNpdGx5IGhpZGUgd2hlbiB0aGUgcG9wdXAgaGFzIG5vIHBhdGllbnRfb3ZlcnJpZGVcbiAgLy8gc2V0LCBzaW5jZSBib3RoIGNoZWNrcyBrZXkgb2ZmIHBhdGllbnRfaWQuXG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmIChjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiB8fCAhb3Y/LmlkX25vKSB7XG4gICAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoZWxzLnN5bmNTdGF0dXNIaW50KSBlbHMuc3luY1N0YXR1c0hpbnQuaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBDYXJkIHNlcnZlcyBhcyBhbiBhbGVydCwgbm90IGEgZGFzaGJvYXJkIFx1MjAxNCBzaG93IG9ubHkgd2hlbiB0aGVyZSdzXG4gIC8vIHNvbWV0aGluZyBhY3Rpb25hYmxlIC8gd29ydGggZmxhZ2dpbmcuIEhpZGUgd2hlbjpcbiAgLy8gICAtIGJhY2tlbmQgaGFzIHRoaXMgcGF0aWVudCBBTkQgbm8gbG9jYWwgYnVuZGxlIHRvIGNvbXBhcmUgYWdhaW5zdFxuICAvLyAgICAgKExhdW5jaCBpcyBlbmFibGVkIFx1MjE5MiB0aGF0J3MgdGhlIHNpZ25hbCBldmVyeXRoaW5nJ3MgZmluZSksIG9yXG4gIC8vICAgLSBib3RoIHNpZGVzIGFncmVlIG9uIGNvdW50IChhbHJlYWR5IGluIHN5bmMsIG5vIHVwbG9hZCBuZWVkZWQpLlxuICAvLyBUaGUgcmVtYWluaW5nIHN0YXRlcyAoY2hlY2tpbmcgLyBmYWlsIC8gYWJzZW50IC8gY291bnQgbWlzbWF0Y2gpIGFsbFxuICAvLyBlaXRoZXIgbmVlZCB1c2VyIGF0dGVudGlvbiBvciBhcmUgdHJhbnNpZW50IGxvYWRpbmcgZmVlZGJhY2suXG4gIGNvbnN0IGxvY2FsTWF0Y2hlcyA9IF9sb2NhbEJ1bmRsZS5leGlzdHMgJiYgX2xvY2FsQnVuZGxlLnBhdGllbnRJZCA9PT0gb3YuaWRfbm87XG4gIGNvbnN0IGluU3luYyA9XG4gICAgX2JhY2tlbmRQYXRpZW50LnN0YXRlID09PSBcInByZXNlbnRcIiAmJlxuICAgIGxvY2FsTWF0Y2hlcyAmJlxuICAgIF9iYWNrZW5kUGF0aWVudC5jb3VudCA9PT0gX2xvY2FsQnVuZGxlLmNvdW50O1xuICAvLyBRdWlldCBcIlx1MjcxMyBcdTVERjJcdTU0MENcdTZCNjVcIiBoaW50IHNpdHMgdW5kZXIgdGhlIGRvd25sb2FkIGJ1dHRvbiB3aGVuIGluLXN5bmMgXHUyMDE0XG4gIC8vIGdpdmVzIHRoZSB1c2VyIGEgdGlueSBhY2tub3dsZWRnZW1lbnQgaW5zdGVhZCBvZiB0b3RhbCBzaWxlbmNlLlxuICBpZiAoZWxzLnN5bmNTdGF0dXNIaW50KSBlbHMuc3luY1N0YXR1c0hpbnQuaGlkZGVuID0gIWluU3luYztcbiAgY29uc3Qgbm90aGluZ1RvU2hvdyA9XG4gICAgX2JhY2tlbmRQYXRpZW50LnN0YXRlID09PSBcInByZXNlbnRcIiAmJiAoIWxvY2FsTWF0Y2hlcyB8fCBpblN5bmMpO1xuICBpZiAobm90aGluZ1RvU2hvdykge1xuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbiA9IGZhbHNlO1xuXG4gIC8vIEJhY2tlbmQgcm93XG4gIGNvbnN0IGJzID0gZWxzLmJhY2tlbmRTdGF0ZTtcbiAgc3dpdGNoIChfYmFja2VuZFBhdGllbnQuc3RhdGUpIHtcbiAgICBjYXNlIFwiY2hlY2tpbmdcIjpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1NkFBMlx1NjdFNVx1NEUyRFx1MjAyNlwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImFic2VudFwiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJkYXRhLXN0YXRlLXZhbHVlIGVtcHR5XCI7XG4gICAgICAvLyBDYXJkIHNpdHMgKmJlbG93KiB0aGUgXHVEODNEXHVERDA0IFx1NTQwQ1x1NkI2NSBidXR0b24uIE9ubHkgbWVudGlvbiB0aGUgbG9jYWwtXG4gICAgICAvLyB1cGxvYWQgYWx0ZXJuYXRpdmUgd2hlbiBhIG1hdGNoaW5nIHBlbmRpbmcgQnVuZGxlIGFjdHVhbGx5XG4gICAgICAvLyBleGlzdHMgKG90aGVyd2lzZSB0aGUgdXNlciBnb2VzIGh1bnRpbmcgZm9yIGFuIHVwbG9hZCBidXR0b25cbiAgICAgIC8vIHRoYXQncyBub3QgdGhlcmUgYW5kIGNvbmNsdWRlcyBcInRoZXJlJ3Mgbm8gc3luYyBidXR0b24gYXQgYWxsXCIpLlxuICAgICAgYnMudGV4dENvbnRlbnQgPSBsb2NhbE1hdGNoZXNcbiAgICAgICAgPyBcIlx1MjZBMCBcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkEgXHUyMDE0IFx1OEFDQlx1NjMwOVx1NEUwQVx1NjVCOVx1MzAwQ1x1RDgzRFx1REQwNCBcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTMwMERcdTYyMTZcdTRFMEJcdTY1QjlcdTMwMENcdUQ4M0RcdURDRTQgXHU2MjhBXHU2NzJDXHU1NzMwXHU2QTk0XHU2ODQ4XHU0RTBBXHU1MEIzXHU1MjMwXHU1RjhDXHU3QUVGXHUzMDBEXCJcbiAgICAgICAgOiBcIlx1MjZBMCBcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkEgXHUyMDE0IFx1OEFDQlx1NjMwOVx1NEUwQVx1NjVCOVx1MzAwQ1x1RDgzRFx1REQwNCBcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTMwMERcdTYyOTNcdThDQzdcdTY1OTlcdTUyMzBcdTVGOENcdTdBRUZcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJwcmVzZW50XCI6IHtcbiAgICAgIGNvbnN0IGNvdW50ID0gX2JhY2tlbmRQYXRpZW50LmNvdW50O1xuICAgICAgY29uc3QgdHMgPSBfYmFja2VuZFBhdGllbnQubGFzdFVwZGF0ZWQ7XG4gICAgICBicy5jbGFzc05hbWUgPSBcImRhdGEtc3RhdGUtdmFsdWUgb2tcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gYFx1MjcxMyAke2NvdW50ID4gMCA/IGAke2NvdW50fSBcdTdCNDYgXHUwMEI3IGAgOiBcIlwifVx1NjcwMFx1NUY4Q1x1NjZGNFx1NjVCMCAke19mbXRUaW1lU2hvcnQodHMpIHx8IFwiKHVua25vd24pXCJ9YDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiZmFpbFwiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJkYXRhLXN0YXRlLXZhbHVlIGZhaWxcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTI3MTcgXHU2QUEyXHU2N0U1XHU1OTMxXHU2NTU3XHVGRjA4XHU3NzBCXHU5MDIzXHU3RERBIGJhbm5lclx1RkYwOVwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjAxNFwiO1xuICB9XG5cbiAgLy8gTG9jYWwgcm93IFx1MjAxNCBzaG93IG9ubHkgd2hlbiB0aGUgcGVuZGluZyBidW5kbGUgbWF0Y2hlcyB0aGlzIHBhdGllbnQuXG4gIC8vIChsb2NhbE1hdGNoZXMgd2FzIGNvbXB1dGVkIGFib3ZlIGZvciB0aGUgZWFybHktcmV0dXJuIGNoZWNrLilcbiAgaWYgKGxvY2FsTWF0Y2hlcykge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IGZhbHNlO1xuICAgIGVscy5sb2NhbFN0YXRlLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZSBva1wiO1xuICAgIGVscy5sb2NhbFN0YXRlLnRleHRDb250ZW50ID1cbiAgICAgIGBcdTI3MTMgJHtfbG9jYWxCdW5kbGUuY291bnR9IFx1N0I0NiBcdTAwQjcgJHtfZm10UmVsYXRpdmUoX2xvY2FsQnVuZGxlLmdlbmVyYXRlZEF0KX1cdTc1MjJcdTc1MUZgO1xuICB9IGVsc2Uge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IHRydWU7XG4gIH1cblxuICAvLyBcIlx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlXCIgYnV0dG9uIHNob3dzIG9ubHkgd2hlbiB0aGVyZSdzIGEgbG9jYWwgYnVuZGxlXG4gIC8vIGZvciB0aGlzIHBhdGllbnQuIFdlIGRvbid0IHJlYWNoIHRoaXMgYnJhbmNoIHdoZW4gaW4tc3luYyAodGhlXG4gIC8vIHdob2xlIHNlY3Rpb24gZ2V0cyBoaWRkZW4gYWJvdmUpLCBzbyBubyBuZWVkIGZvciBhIHNlcGFyYXRlXG4gIC8vIGRpc2FibGVkIHN0YXRlIFx1MjAxNCB3aGVuIHRoZSBidXR0b24gc2hvd3MsIHVwbG9hZCBpcyBhbHdheXMgbWVhbmluZ2Z1bC5cbiAgZWxzLnB1c2hMb2NhbEJ0bi5oaWRkZW4gPSAhbG9jYWxNYXRjaGVzO1xuICBlbHMucHVzaExvY2FsQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gIGVscy5wdXNoTG9jYWxCdG4udGl0bGUgPSBcIlwiO1xuICBlbHMucHVzaExvY2FsQnRuLnRleHRDb250ZW50ID0gXCJcdUQ4M0RcdURDRTQgXHU2MjhBXHU2NzJDXHU1NzMwXHU2QTk0XHU2ODQ4XHU0RTBBXHU1MEIzXHU1MjMwXHU1RjhDXHU3QUVGXCI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpIHtcbiAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgX2xvY2FsQnVuZGxlID0gcGVuZGluZ1xuICAgID8ge1xuICAgICAgICBleGlzdHM6IHRydWUsXG4gICAgICAgIGNvdW50OiBBcnJheS5pc0FycmF5KEpTT04ucGFyc2UocGVuZGluZy5qc29uKT8uZW50cnkpXG4gICAgICAgICAgPyBKU09OLnBhcnNlKHBlbmRpbmcuanNvbikuZW50cnkubGVuZ3RoXG4gICAgICAgICAgOiAwLFxuICAgICAgICBnZW5lcmF0ZWRBdDogcGVuZGluZy5nZW5lcmF0ZWRBdCB8fCAwLFxuICAgICAgICBwYXRpZW50SWQ6IHBlbmRpbmcucGF0aWVudElkIHx8IG51bGwsXG4gICAgICB9XG4gICAgOiB7IGV4aXN0czogZmFsc2UsIGNvdW50OiAwLCBnZW5lcmF0ZWRBdDogMCwgcGF0aWVudElkOiBudWxsIH07XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tCYWNrZW5kUGF0aWVudCgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiIHx8ICFvdj8uaWRfbm8gfHwgX2Nvbm5TdGF0ZSAhPT0gXCJva1wiKSB7XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIHJldHVybjtcbiAgfVxuICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImNoZWNraW5nXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG5cbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgY29uc3Qga2V5ID0gZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpO1xuICBjb25zdCBoZWFkZXJzID0ga2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGtleSB9IDoge307XG4gIHRyeSB7XG4gICAgY29uc3QgcHIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvUGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChvdi5pZF9ubyl9YCwgeyBoZWFkZXJzIH0pO1xuICAgIGlmIChwci5zdGF0dXMgPT09IDQwNCkge1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJhYnNlbnRcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgICBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghcHIub2spIHtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiZmFpbFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGF0aWVudCA9IGF3YWl0IHByLmpzb24oKTtcbiAgICBjb25zdCBsYXN0VXBkYXRlZCA9IHBhdGllbnQ/Lm1ldGE/Lmxhc3RVcGRhdGVkID8/IG51bGw7XG4gICAgLy8gQ291bnQgdmlhIC9maGlyL2V4cG9ydCBcdTIwMTQgc2xpZ2h0bHkgaGVhdmllciBidXQgaXQncyB0aGUgb25seVxuICAgIC8vIG9mZi10aGUtc2hlbGYgd2F5IHRvIGdldCB0b3RhbCByZXNvdXJjZXMgZm9yIGEgcGF0aWVudC4gQ2FwIGJ5XG4gICAgLy8gNXMgdGltZW91dCBzbyBhIHNsb3cgYmFja2VuZCBkb2Vzbid0IGxvY2sgdGhlIHBvcHVwIGZvcmV2ZXIuXG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBjdHJsLmFib3J0KCksIDUwMDApO1xuICAgICAgY29uc3QgZXIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvZXhwb3J0P3BhdGllbnQ9JHtlbmNvZGVVUklDb21wb25lbnQob3YuaWRfbm8pfWAsIHtcbiAgICAgICAgaGVhZGVycywgc2lnbmFsOiBjdHJsLnNpZ25hbCxcbiAgICAgIH0pO1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIGlmIChlci5vaykge1xuICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCBlci5qc29uKCk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJ1bmRsZS5lbnRyeSkpIGNvdW50ID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogbGVhdmUgY291bnQgPSAwOyBub3QgZmF0YWwgKi8gfVxuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwicHJlc2VudFwiLCBjb3VudCwgbGFzdFVwZGF0ZWQgfTtcbiAgfSBjYXRjaCAoX2UpIHtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImZhaWxcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gIH1cbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwdXNoTG9jYWxCdW5kbGVUb0JhY2tlbmQoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3Y/LmlkX25vIHx8ICFfbG9jYWxCdW5kbGUuZXhpc3RzIHx8IF9sb2NhbEJ1bmRsZS5wYXRpZW50SWQgIT09IG92LmlkX25vKSByZXR1cm47XG4gIGNvbnN0IHVybCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gIGNvbnN0IGtleSA9IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgaGVhZGVycyA9IHtcbiAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAuLi4oa2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGtleSB9IDoge30pLFxuICB9O1xuICBlbHMucHVzaExvY2FsQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50ZXh0Q29udGVudCA9IFwiXHU0RTBBXHU1MEIzXHU0RTJEXHUyMDI2XCI7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICAgIGlmICghcGVuZGluZz8uanNvbikgdGhyb3cgbmV3IEVycm9yKFwibm8gbG9jYWwgYnVuZGxlXCIpO1xuICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvaW1wb3J0YCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIiwgaGVhZGVycywgYm9keTogcGVuZGluZy5qc29uLFxuICAgIH0pO1xuICAgIGlmICghci5vaykge1xuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHIudGV4dCgpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7ci5zdGF0dXN9OiAke3RleHQuc2xpY2UoMCwgMTIwKX1gKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgci5qc29uKCk7XG4gICAgc2V0U3RhdHVzKGBcdTI3MDUgXHU1REYyXHU0RTBBXHU1MEIzICR7cmVzdWx0LmltcG9ydGVkID8/IFwiP1wifSBcdTdCNDZcdTUyMzBcdTVGOENcdTdBRUZgLCBcInN1Y2Nlc3NcIik7XG4gICAgYXdhaXQgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgc2V0U3RhdHVzKGBcdTI2RDQgXHU0RTBBXHU1MEIzXHU1OTMxXHU2NTU3XHVGRjFBJHtlLm1lc3NhZ2V9YCwgXCJlcnJvclwiKTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBfcmVuZGVyRGF0YVN0YXRlKCkgKGFscmVhZHkgY2FsbGVkIGZyb20gY2hlY2tCYWNrZW5kUGF0aWVudCBvblxuICAgIC8vIHN1Y2Nlc3MpIGRlY2lkZXMgdGhlIHJpZ2h0IGRpc2FibGVkIHN0YXRlICsgbGFiZWwgYmFzZWQgb25cbiAgICAvLyB3aGV0aGVyIGJhY2tlbmQgYW5kIGxvY2FsIGFncmVlLiBDYWxsIGl0IGhlcmUgdG9vIHRvIGNvdmVyIHRoZVxuICAgIC8vIGZhaWx1cmUgcGF0aCB0aGF0IHNraXBwZWQgY2hlY2tCYWNrZW5kUGF0aWVudC5cbiAgICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gIH1cbn1cblxuZWxzLnB1c2hMb2NhbEJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1c2hMb2NhbEJ1bmRsZVRvQmFja2VuZCk7XG5cbi8vIFwiXHVEODNEXHVERDE3IFx1OTU4Qlx1NTU1Rlx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NzY3Qlx1NTE2NVwiIFx1MjAxNCBvcGVucyB0aGUgTkhJIGxhbmRpbmcgcGFnZSBzbyB0aGUgdXNlclxuLy8gZG9lc24ndCBoYXZlIHRvIHJlbWVtYmVyIC8gZ29vZ2xlIHRoZSBVUkwuIENsb3NlcyB0aGUgcG9wdXAgc29cbi8vIHRoZXkgZG9uJ3QgaGF2ZSB0byBkaXNtaXNzIGl0IG1hbnVhbGx5IGFmdGVyIHRoZSBuZXcgdGFiIG9wZW5zLlxuZWxzLm9wZW5OaGlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gIGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogTkhJX0xBTkRJTkcgfSk7XG4gIHdpbmRvdy5jbG9zZSgpO1xufSk7XG5cbi8vIExvY2FsIGJ1bmRsZSBzdGF0ZSBjaGFuZ2VzIHdoZW5ldmVyIHRoZSBTVyBzdGFzaGVzIGEgbmV3IHN5bmMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBQRU5ESU5HX0JVTkRMRV9LRVkgaW4gY2hhbmdlcykgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG59KTtcblxuLy8gXHUyNTAwXHUyNTAwIFN5bmMgbW9kZSAobG9jYWwgfCBiYWNrZW5kKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmFzeW5jIGZ1bmN0aW9uIGxvYWRTeW5jTW9kZSgpIHtcbiAgY29uc3QgeyBzeW5jTW9kZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXCJzeW5jTW9kZVwiKTtcbiAgY29uc3QgbW9kZSA9IHN5bmNNb2RlID09PSBcImJhY2tlbmRcIiA/IFwiYmFja2VuZFwiIDogREVGQVVMVF9NT0RFO1xuICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgci5jaGVja2VkID0gci52YWx1ZSA9PT0gbW9kZTtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBtb2RlO1xuICBpZiAobW9kZSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICAvLyBBdXRvLXRlc3Qgb24gb3BlbiBzbyB0aGUgdXNlciBzZWVzIHN0YXR1cyB3aXRob3V0IGNsaWNraW5nLiBBd2FpdGluZ1xuICAgIC8vIGhlcmUgc2VyaWFsaXplcyB0aGUgcmVzdCBvZiBpbml0KCkgdW50aWwgd2Uga25vdyB0aGUgYW5zd2VyLlxuICAgIGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICB9IGVsc2Uge1xuICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGN1cnJlbnRNb2RlKCkge1xuICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgaWYgKHIuY2hlY2tlZCkgcmV0dXJuIHIudmFsdWU7XG4gIHJldHVybiBERUZBVUxUX01PREU7XG59XG5cbmZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSB7XG4gIHIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKCk7XG4gICAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBtb2RlO1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc3luY01vZGU6IG1vZGUgfSk7XG4gICAgaWYgKG1vZGUgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgICB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTsgLy8gdHJpZ2dlcnMgY2hlY2tCYWNrZW5kUGF0aWVudCBvbiBzdWNjZXNzXG4gICAgfSBlbHNlIHtcbiAgICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5lbHMuYmFja2VuZFVybC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBiYWNrZW5kVXJsOiBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkgfSk7XG4gIGVscy5kYXNoYm9hcmRMaW5rLmhyZWYgPSBlbHMuYmFja2VuZFVybC52YWx1ZS5yZXBsYWNlKC86ODAxMC4qJC8sIFwiOjMwMTBcIik7XG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG59KTtcbmVscy5zeW5jQXBpS2V5LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHN5bmNBcGlLZXk6IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKSB9KTtcbn0pO1xuLy8gU2lkZWJhciBcIlx1RDgzRFx1RENDQiBcdTUyQTlcdTc0MDZcIiB0b2dnbGUgXHUyMDE0IHBlcnNpc3RzIGluIGNocm9tZS5zdG9yYWdlLnN5bmMgc28gdGhlXG4vLyBwcmVmZXJlbmNlIGlzIHN0aWNreSBhY3Jvc3MgcmVpbnN0YWxscy4gc2lkZWJhci5qcyBsaXN0ZW5zIHRvIHRoZVxuLy8gc2FtZSBrZXkgYW5kIGhpZGVzIGl0c2VsZiB3aGVuIHNldCB0byBmYWxzZS5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRTaWRlYmFyRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBzaWRlYmFyRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXCJzaWRlYmFyRW5hYmxlZFwiKTtcbiAgZWxzLnNpZGViYXJFbmFibGVkLmNoZWNrZWQgPSBzaWRlYmFyRW5hYmxlZCAhPT0gZmFsc2U7IC8vIGRlZmF1bHQgT05cbn1cblxuZWxzLnNpZGViYXJFbmFibGVkPy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBzaWRlYmFyRW5hYmxlZDogZWxzLnNpZGViYXJFbmFibGVkLmNoZWNrZWQgfSk7XG59KTtcblxuLy8gTWFzay1wYXRpZW50LW5hbWUgdG9nZ2xlIFx1MjAxNCBkZWZhdWx0cyBPRkYgKGNpdGl6ZW5zIGRvd25sb2FkaW5nIHRoZWlyXG4vLyBvd24gZGF0YSBkb24ndCBuZWVkIGFub255bWl6YXRpb24pLiBXaGVuIE9OOiBwb3B1cCBzdW1tYXJ5LCBGSElSXG4vLyBCdW5kbGUgb3V0cHV0LCBzeW5jLWxvZywgYW5kIE5ISSByZXBvcnQgbmFycmF0aXZlIGFsbCB1c2UgdGhlXG4vLyBtYXNrZWQgZm9ybSAoXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwKSBpbnN0ZWFkIG9mIHRoZSByZWFsIG5hbWUuXG5sZXQgX21hc2tOYW1lRW5hYmxlZCA9IGZhbHNlO1xuYXN5bmMgZnVuY3Rpb24gbG9hZE1hc2tOYW1lRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBtYXNrTmFtZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFwibWFza05hbWVFbmFibGVkXCIpO1xuICBfbWFza05hbWVFbmFibGVkID0gbWFza05hbWVFbmFibGVkID09PSB0cnVlO1xuICBpZiAoZWxzLm1hc2tOYW1lRW5hYmxlZCkgZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkID0gX21hc2tOYW1lRW5hYmxlZDtcbn1cblxuZnVuY3Rpb24gX21heWJlTWFzayhuYW1lKSB7XG4gIHJldHVybiBfbWFza05hbWVFbmFibGVkID8gbWFza05hbWUobmFtZSkgOiBuYW1lIHx8IFwiXCI7XG59XG5cbmVscy5tYXNrTmFtZUVuYWJsZWQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICBfbWFza05hbWVFbmFibGVkID0gZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IG1hc2tOYW1lRW5hYmxlZDogX21hc2tOYW1lRW5hYmxlZCB9KTtcbiAgLy8gUmUtcmVuZGVyIHBvcHVwIGNocm9tZSAoc3VtbWFyeSBsaW5lIGlzIHRoZSBvbmx5IHNwb3QgdGhhdCByZWFkc1xuICAvLyBfbWF5YmVNYXNrIHJlYWN0aXZlbHk7IGV2ZXJ5d2hlcmUgZWxzZSBzYW1wbGVzIGl0IGp1c3QtaW4tdGltZSkuXG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbn0pO1xuXG5lbHMuc21hcnRBcHBVcmwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIC8vIFBlcnNpc3QgdHJpbW1lZCB2YWx1ZS4gRW1wdHkgc3RyaW5nIFx1MjE5MiByZXN0b3JlIGRlZmF1bHQgb24gbmV4dCBsb2FkLlxuICBjb25zdCB2ID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKTtcbiAgaWYgKHYpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHNtYXJ0QXBwTGF1bmNoVXJsOiB2IH0pO1xuICB9IGVsc2Uge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMucmVtb3ZlKFwic21hcnRBcHBMYXVuY2hVcmxcIik7XG4gICAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICB9XG59KTtcblxuZnVuY3Rpb24gc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93bikge1xuICAvLyBCdWlsZCB3aXRoIERPTSBBUEkgXHUyMDE0IGF2b2lkcyBpbm5lckhUTUwgLyBYU1Mgcmlzay5cbiAgLy8gYnJlYWtkb3duIGlzIGFuIGFycmF5IG9mIG1peGVkIGVudHJpZXM6XG4gIC8vICAgLSBwaGFzZSB0aW1pbmdzIHByZWZpeGVkIHdpdGggXCJcdTIzRjFcIiAgXHUyMTkyIFx1OTY4RVx1NkJCNVx1ODAxN1x1NjY0MlxuICAvLyAgIC0gcGVyLWVuZHBvaW50IGNvdW50cyAgICAgICAgICAgICAgICBcdTIxOTIgXHU1NDA0IGVuZHBvaW50IFx1NjI5M1x1NTIzMFx1NUU3RVx1N0I0NlxuICAvLyBCb3RoIGtpbmRzIGFyZSB0dWNrZWQgaW5zaWRlIGEgc2luZ2xlIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgdG9nZ2xlIHNvIHRoZVxuICAvLyBwb3B1cCBzdGF5cyBjb21wYWN0IGJ5IGRlZmF1bHQuXG4gIGVscy5zdGF0dXMuY2xhc3NOYW1lID0ga2luZCB8fCBcIlwiO1xuICBlbHMuc3RhdHVzLnRleHRDb250ZW50ID0gXCJcIjtcbiAgaWYgKCF0ZXh0ICYmICEoYnJlYWtkb3duICYmIGJyZWFrZG93bi5sZW5ndGgpKSByZXR1cm47XG4gIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCB8fCBcIlwiKSk7XG4gIGlmIChicmVha2Rvd24gJiYgYnJlYWtkb3duLmxlbmd0aCkge1xuICAgIGNvbnN0IHBoYXNlUm93cyA9IGJyZWFrZG93bi5maWx0ZXIoKGIpID0+IGIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG4gICAgY29uc3Qgb3RoZXJSb3dzID0gYnJlYWtkb3duLmZpbHRlcigoYikgPT4gIWIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgZGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWxcIjtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgc3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCI7XG4gICAgZGV0YWlscy5hcHBlbmRDaGlsZChzdW1tYXJ5KTtcblxuICAgIGlmIChwaGFzZVJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwaGFzZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgcGhhc2VzLmNsYXNzTmFtZSA9IFwic3RhdHVzLXBoYXNlc1wiO1xuICAgICAgcGhhc2VzLnRleHRDb250ZW50ID0gcGhhc2VSb3dzLm1hcCgocCkgPT4gcC5yZXBsYWNlKC9eXHUyM0YxXFxzKi8sIFwiXCIpKS5qb2luKFwiIFx1MDBCNyBcIik7XG4gICAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHBoYXNlcyk7XG4gICAgfVxuICAgIGlmIChvdGhlclJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGJvZHkuY2xhc3NOYW1lID0gXCJzdGF0dXMtYnJlYWtkb3duXCI7XG4gICAgICBib2R5LnRleHRDb250ZW50ID0gb3RoZXJSb3dzLmpvaW4oXCIgXHUwMEI3IFwiKTtcbiAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuICAgIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWN0aXZlVGFiKCkge1xuICBjb25zdCBbdGFiXSA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICByZXR1cm4gdGFiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGVuZGluZyBGSElSIEJ1bmRsZSAobG9jYWwtbW9kZSByZXN1bHQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEJhY2tncm91bmQgc3Rhc2hlcyB0aGUgZ2VuZXJhdGVkIEJ1bmRsZSBpbnRvIGNocm9tZS5zdG9yYWdlLmxvY2FsXG4vLyB1bmRlciBgcGVuZGluZ0ZoaXJCdW5kbGVgLiBQb3B1cCByZW5kZXJzIGEgZG93bmxvYWQgYnV0dG9uLiBVc2VyIG11c3Rcbi8vIGNsaWNrIHRvIGFjdHVhbGx5IHRyaWdnZXIgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBcdTIwMTQgdGhlIGZpbGUgbmV2ZXJcbi8vIGhpdHMgdGhlIGRpc2sgdW5zb2xpY2l0ZWQuXG5cbmZ1bmN0aW9uIF9mbXRCeXRlcyhuKSB7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwMjQgKiAxMDI0KSByZXR1cm4gYCR7KG4gLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gIHJldHVybiBgJHsobiAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMil9IE1CYDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZyB8fCAhcGVuZGluZy5qc29uKSB7XG4gICAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gSWYgdGhlIHVzZXIgaGFzIHN3aXRjaGVkIG92ZXJyaWRlIHRvIGEgZGlmZmVyZW50IHBhdGllbnQsIHRoZVxuICAvLyBzdGFzaGVkIGJ1bmRsZSBpcyBmb3IgdGhlICpwcmV2aW91cyogcGF0aWVudC4gSGlkZSBpdCBzbyB0aGV5XG4gIC8vIGNhbid0IGFjY2lkZW50YWxseSBkb3dubG9hZCB0aGUgd3JvbmcgZmlsZS4gVGhlIGJ1bmRsZSBzdGF5cyBpblxuICAvLyBzdG9yYWdlOyByZS1lbnRlcmluZyB0aGUgbWF0Y2hpbmcgb3ZlcnJpZGUgd2lsbCBzdXJmYWNlIGl0IGFnYWluLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAob3Y/LmlkX25vICYmIHBlbmRpbmcucGF0aWVudElkICYmIHBlbmRpbmcucGF0aWVudElkICE9PSBvdi5pZF9ubykge1xuICAgIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IGZhbHNlO1xuICBjb25zdCBhZ28gPSBwZW5kaW5nLmdlbmVyYXRlZEF0XG4gICAgPyBgJHtNYXRoLm1heCgxLCBNYXRoLnJvdW5kKChEYXRlLm5vdygpIC0gcGVuZGluZy5nZW5lcmF0ZWRBdCkgLyAxMDAwKSl9IFx1NzlEMlx1NTI0RGBcbiAgICA6IFwiXCI7XG4gIGVscy5idW5kbGVNZXRhLnRleHRDb250ZW50ID0gYCR7cGVuZGluZy5maWxlbmFtZX0gXHUwMEI3ICR7X2ZtdEJ5dGVzKHBlbmRpbmcuYnl0ZXMgfHwgMCl9JHthZ28gPyBgIFx1MDBCNyAke2Fnb31gIDogXCJcIn1gO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkb3dubG9hZFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZykgcmV0dXJuO1xuICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3BlbmRpbmcuanNvbl0sIHsgdHlwZTogXCJhcHBsaWNhdGlvbi9maGlyK2pzb25cIiB9KTtcbiAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkKHsgdXJsLCBmaWxlbmFtZTogcGVuZGluZy5maWxlbmFtZSwgc2F2ZUFzOiBmYWxzZSB9KTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBSZWxlYXNlIGFmdGVyIGEgdGljayBzbyB0aGUgZG93bmxvYWQgaGFzIHRpbWUgdG8gc3RhcnQuXG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDUwMDApO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNsZWFyUGVuZGluZ0J1bmRsZSgpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGF3YWl0IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG59XG5cbmVscy5kb3dubG9hZEJ1bmRsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG93bmxvYWRQZW5kaW5nQnVuZGxlKTtcbmVscy5jbGVhckJ1bmRsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJQZW5kaW5nQnVuZGxlKTtcblxuLy8gTGl2ZSB1cGRhdGUgd2hlbiBiYWNrZ3JvdW5kIHN0YXNoZXMgYSBuZXcgYnVuZGxlIHdoaWxlIHBvcHVwIGlzIG9wZW4uXG4vLyAoTm90ZTogYW5vdGhlciBvbkNoYW5nZWQgbGlzdGVuZXIgZWFybGllciBpbiB0aGUgZmlsZSByZWZyZXNoZXMgdGhlXG4vLyBkYXRhLXN0YXRlIGNhcmQ7IHdlIGxlYXZlIHRoYXQgb25lIHNlcGFyYXRlIHNvIGZhaWx1cmUgb2YgZWl0aGVyIHBhdGhcbi8vIGRvZXNuJ3QgdGFrZSB0aGUgb3RoZXIgZG93bi4pXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBQRU5ESU5HX0JVTkRMRV9LRVkgaW4gY2hhbmdlcykgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbn0pO1xuXG4vLyBCYWNrZ3JvdW5kLXNpZGUgZmxvdyBjYW4gbXV0YXRlIHRoZSBwYXRpZW50T3ZlcnJpZGUgbWlkLXN5bmMgXHUyMDE0IG1vc3Rcbi8vIGltcG9ydGFudGx5IF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaSBzd2FwcyB0aGUgYXV0by1YWFhYWFhYWFxuLy8gcGxhY2Vob2xkZXIgZm9yIHRoZSByZWFsIE5ISSBjaWQuIFdpdGhvdXQgdGhpcyBsaXN0ZW5lciB0aGUgcG9wdXBcbi8vIGlucHV0cyBzdGF5ZWQgc3RhbGUsIHJlZnJlc2hQZW5kaW5nQnVuZGxlJ3MgcGF0aWVudC1tYXRjaCBjaGVja1xuLy8gdGhlbiBjb21wYXJlZCBvbGQgaW5wdXQgdmFsdWUgdnMuIGZyZXNoIGJ1bmRsZS5wYXRpZW50SWQgYW5kIGhpZFxuLy8gdGhlIGRvd25sb2FkIGJ1dHRvbi4gUmVsb2FkIHRoZSBvdmVycmlkZSBpbnRvIHRoZSBpbnB1dHMgd2hlbmV2ZXJcbi8vIHN0b3JhZ2UgY2hhbmdlcyBzbyBldmVyeSBkb3duc3RyZWFtIGd1YXJkIHNlZXMgY29uc2lzdGVudCB2YWx1ZXMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwic3luY1wiICYmIGNoYW5nZXMucGF0aWVudE92ZXJyaWRlKSBsb2FkUGF0aWVudE92ZXJyaWRlKCk7XG59KTtcblxuLy8gXHUyNTAwXHUyNTAwIFx1MjREOCBIZWxwLWljb24gdG9vbHRpcCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBPbmUgc2hhcmVkIDxkaXY+IGFwcGVuZGVkIHRvIHRoZSBwb3B1cCBib2R5LiBPbiBob3ZlciBvZiBhbnlcbi8vIC5oZWxwLWljb24sIHdlIGNvcHkgaXRzIGRhdGEtdGlwIHRleHQgYW5kIHBvc2l0aW9uIHRoZSB0b29sdGlwXG4vLyBpbnNpZGUgdGhlIHBvcHVwLCBjbGFtcGluZyB0byBpdHMgdmlld3BvcnQgc28gaXQgY2FuJ3QgY2xpcCBvZmZcbi8vIGVpdGhlciBlZGdlIHJlZ2FyZGxlc3Mgb2Ygd2hlcmUgdGhlIGljb24gc2l0cy4gKENTUyBwc2V1ZG8tZWxlbWVudHNcbi8vIGNhbid0IGJlIG1lYXN1cmVkLCBzbyBhIHB1cmUtQ1NTIGFwcHJvYWNoIGluZXZpdGFibHkgcGlja3Mgb25lXG4vLyBhbmNob3Igc2lkZSBhbmQgYnJlYWtzIGZvciBpY29ucyBvbiB0aGUgb3RoZXIgc2lkZSBvZiB0aGUgcG9wdXAuKVxuY29uc3QgX2hlbHBUaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuX2hlbHBUaXAuY2xhc3NOYW1lID0gXCJoZWxwLXRvb2x0aXBcIjtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoX2hlbHBUaXApO1xuXG5jb25zdCBWSUVXUE9SVF9NQVJHSU4gPSA2OyAvLyBrZWVwIHRoaXMgbWFueSBweCBjbGVhciBvZiBwb3B1cCBlZGdlc1xuXG5mdW5jdGlvbiBfc2hvd0hlbHBUb29sdGlwKGljb24pIHtcbiAgX2hlbHBUaXAudGV4dENvbnRlbnQgPSBpY29uLmRhdGFzZXQudGlwIHx8IGljb24uZ2V0QXR0cmlidXRlKFwiZGF0YS10aXBcIikgfHwgXCJcIjtcbiAgX2hlbHBUaXAuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG5cbiAgLy8gTWVhc3VyZSBub3cgdGhhdCBjb250ZW50IGlzIHNldC5cbiAgY29uc3QgaWNvblJlY3QgPSBpY29uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB0aXBSZWN0ID0gX2hlbHBUaXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHZpZXdwb3J0VyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcbiAgY29uc3Qgdmlld3BvcnRIID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcblxuICAvLyBIb3Jpem9udGFsOiBwcmVmZXIgY2VudGVyZWQgb24gdGhlIGljb247IGNsYW1wIGludG8gW21hcmdpbiwgdnctdGlwLW1hcmdpbl0uXG4gIGxldCBsZWZ0ID0gaWNvblJlY3QubGVmdCArIGljb25SZWN0LndpZHRoIC8gMiAtIHRpcFJlY3Qud2lkdGggLyAyO1xuICBpZiAobGVmdCA8IFZJRVdQT1JUX01BUkdJTikgbGVmdCA9IFZJRVdQT1JUX01BUkdJTjtcbiAgaWYgKGxlZnQgKyB0aXBSZWN0LndpZHRoID4gdmlld3BvcnRXIC0gVklFV1BPUlRfTUFSR0lOKSB7XG4gICAgbGVmdCA9IHZpZXdwb3J0VyAtIFZJRVdQT1JUX01BUkdJTiAtIHRpcFJlY3Qud2lkdGg7XG4gIH1cbiAgLy8gVmVydGljYWw6IHByZWZlciBhYm92ZSB0aGUgaWNvbjsgZmxpcCBiZWxvdyBpZiB0aGVyZSdzIG5vIHJvb20gdXAgdG9wLlxuICBsZXQgdG9wID0gaWNvblJlY3QudG9wIC0gdGlwUmVjdC5oZWlnaHQgLSA2O1xuICBpZiAodG9wIDwgVklFV1BPUlRfTUFSR0lOKSB0b3AgPSBpY29uUmVjdC5ib3R0b20gKyA2O1xuICAvLyBGaW5hbCBzYWZldHk6IGNsYW1wIGludG8gdmlld3BvcnQgc28gdmVyeSBsb25nIHRvb2x0aXBzIGNhbid0IGJsZWVkXG4gIC8vIG9mZiB0aGUgYm90dG9tIGVpdGhlci5cbiAgaWYgKHRvcCArIHRpcFJlY3QuaGVpZ2h0ID4gdmlld3BvcnRIIC0gVklFV1BPUlRfTUFSR0lOKSB7XG4gICAgdG9wID0gTWF0aC5tYXgoVklFV1BPUlRfTUFSR0lOLCB2aWV3cG9ydEggLSBWSUVXUE9SVF9NQVJHSU4gLSB0aXBSZWN0LmhlaWdodCk7XG4gIH1cblxuICBfaGVscFRpcC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gIF9oZWxwVGlwLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG59XG5cbmZ1bmN0aW9uIF9oaWRlSGVscFRvb2x0aXAoKSB7XG4gIF9oZWxwVGlwLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xufVxuXG4vLyBEZWxlZ2F0ZWQgaG92ZXIgaGFuZGxlcnMgXHUyMDE0IHdvcmtzIGZvciBpY29ucyBhZGRlZCBhZnRlciBwb3B1cCBsb2FkIHRvb1xuLy8gKGUuZy4gd2hlbiBtb2RlIHRvZ2dsZSByZXZlYWxzIGJhY2tlbmQtb25seSBmaWVsZHMpLlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCAoZSkgPT4ge1xuICBjb25zdCBpY29uID0gZS50YXJnZXQuY2xvc2VzdD8uKFwiLmhlbHAtaWNvblwiKTtcbiAgaWYgKGljb24pIF9zaG93SGVscFRvb2x0aXAoaWNvbik7XG59KTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCAoZSkgPT4ge1xuICBjb25zdCBpY29uID0gZS50YXJnZXQuY2xvc2VzdD8uKFwiLmhlbHAtaWNvblwiKTtcbiAgaWYgKGljb24pIF9oaWRlSGVscFRvb2x0aXAoKTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBpbml0KCkge1xuICBhd2FpdCBsb2FkU2lkZWJhckVuYWJsZWQoKTtcbiAgYXdhaXQgbG9hZE1hc2tOYW1lRW5hYmxlZCgpO1xuXG4gIC8vIFNlZWQgbG9jYWwgYnVuZGxlIHN0YXRlIGZyb20gc3RvcmFnZSBzbyB0aGUgZGF0YS1zdGF0ZSBjYXJkIGlzXG4gIC8vIHBvcHVsYXRlZCBhcyBzb29uIGFzIHRoZSBwb3B1cCByZW5kZXJzIChubyBmbGFzaCBvZiBcIlx1NjcyQVx1NzUyMlx1NzUxRlwiKS5cbiAgYXdhaXQgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG5cbiAgLy8gT3JkZXIgbWF0dGVyczogbG9hZEJhY2tlbmRVcmwgcG9wdWxhdGVzIGVscy5iYWNrZW5kVXJsLnZhbHVlLCB3aGljaFxuICAvLyBsb2FkU3luY01vZGUoKSByZWFkcyB2aWEgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCkuIFJldmVyc2UgdGhpcyBhbmRcbiAgLy8gdGhlIGF1dG8tdGVzdCBzZWVzIGFuIGVtcHR5IFVSTCBhbmQgZmFsc2VseSByZXBvcnRzIFwiXHU2NzJBXHU4QTJEXHU1QjlBIEJhY2tlbmQgVVJMXCJcbiAgLy8gb24gZXZlcnkgcG9wdXAgb3Blbi5cbiAgYXdhaXQgbG9hZEJhY2tlbmRVcmwoKTtcbiAgYXdhaXQgbG9hZFN5bmNNb2RlKCk7XG4gIGF3YWl0IGxvYWRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgYXdhaXQgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcblxuICBjb25zdCB0YWIgPSBhd2FpdCBnZXRBY3RpdmVUYWIoKTtcbiAgaWYgKCF0YWI/LnVybCkge1xuICAgIHNldFN0YXR1cyhcIm5vIGFjdGl2ZSB0YWJcIiwgXCJlcnJvclwiKTtcbiAgICBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaSA9IFwiMVwiO1xuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU3luYyByZXF1aXJlcyBiZWluZyBvbiBhbiBOSEkgdGFiIHNvIGNvb2tpZXMvc2Vzc2lvbiBhcmUgdXNhYmxlIGZyb21cbiAgLy8gdGhlIFNXLiBGbGFnIHZpYSBkYXRhc2V0IHNvIF9yZWZyZXNoQnV0dG9uU3RhdGVzIGNhbiBjb21iaW5lIHRoaXNcbiAgLy8gd2l0aCB0aGUgbW9kZSArIGNvbm4gc3RhdGUuIFdoZW4gb2ZmLU5ISSwgYWxzbyBzdXJmYWNlIHRoZVxuICAvLyBcIlx1RDgzRFx1REQxNyBcdTk1OEJcdTU1NUZcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTc2N0JcdTUxNjVcIiBiYW5uZXIgc28gdXNlcnMgZG9uJ3Qgd29uZGVyIHdoZXJlIHRvIGdvLlxuICBjb25zdCBvbk5oaSA9IGlzTmhpVGFiKHRhYi51cmwpO1xuICBpZiAob25OaGkpIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgZWxzZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaSA9IFwiMVwiO1xuICBpZiAoZWxzLm9wZW5OaGlTZWN0aW9uKSBlbHMub3Blbk5oaVNlY3Rpb24uaGlkZGVuID0gb25OaGk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG5cbiAgLy8gUmUtYXR0YWNoIHRvIGFueSBzeW5jIHRoYXQncyBjdXJyZW50bHkgcnVubmluZyBpbiB0aGUgc2VydmljZSB3b3JrZXIuXG4gIC8vIFRoaXMgaXMgd2hhdCBsZXRzIHRoZSB1c2VyIGNsb3NlICsgcmVvcGVuIHRoZSBwb3B1cCBtaWQtc3luYy5cbiAgYXdhaXQgcmVmcmVzaFN5bmNTdGF0dXNGcm9tQmFja2dyb3VuZCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZWZyZXNoU3luY1N0YXR1c0Zyb21CYWNrZ3JvdW5kKCkge1xuICBjb25zdCBzdGF0dXMgPSBhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiZ2V0U3luY1N0YXR1c1wiIH0pLmNhdGNoKCgpID0+IG51bGwpO1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBhcHBseVN5bmNTdGF0dXMoc3RhdHVzKTtcbn1cblxuLy8gTGF0ZXN0IHN0YXR1cyBzbmFwc2hvdCBcdTIwMTQga2VlcGluZyBpdCBsZXRzIHRoZSBsaXZlLWVsYXBzZWQgdGlja2VyXG4vLyByZXBhaW50IHRoZSBzYW1lIHByb2dyZXNzIHRleHQgd2l0aCBhbiB1cGRhdGVkIGBbTnNdYCBwcmVmaXggZXZlcnlcbi8vIHNlY29uZCB3aXRob3V0IHNwYW1taW5nIGNocm9tZS5zdG9yYWdlIGZyb20gdGhlIHNlcnZpY2Ugd29ya2VyLlxubGV0IF9sYXRlc3RTdGF0dXMgPSBudWxsO1xubGV0IF9lbGFwc2VkVGlja2VySWQgPSBudWxsO1xuXG5mdW5jdGlvbiBfZm10RWxhcHNlZChtcykge1xuICBpZiAobXMgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gMTAwMCl9c2A7XG4gIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gNjBfMDAwKX1tJHtNYXRoLnJvdW5kKChtcyAlIDYwXzAwMCkgLyAxMDAwKX1zYDtcbn1cblxuZnVuY3Rpb24gX3JlbmRlclN0YXR1cygpIHtcbiAgY29uc3Qgc3RhdHVzID0gX2xhdGVzdFN0YXR1cztcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgbGV0IHRleHQgPSBzdGF0dXMucHJvZ3Jlc3MgfHwgXCIoc3luYyBcdTkwMzJcdTg4NENcdTRFMkQpXCI7XG4gIGlmIChzdGF0dXMucnVubmluZyAmJiBzdGF0dXMuc3RhcnRlZCkge1xuICAgIGNvbnN0IGVsYXBzZWQgPSBEYXRlLm5vdygpIC0gc3RhdHVzLnN0YXJ0ZWQ7XG4gICAgdGV4dCA9IGBcdTIzRjEgJHtfZm10RWxhcHNlZChlbGFwc2VkKX0gXHUwMEI3ICR7dGV4dH1gO1xuICB9XG4gIGNvbnN0IGtpbmQgPSBzdGF0dXMucnVubmluZyA/IFwiaW5mb1wiIDogKHN0YXR1cy5waGFzZSA9PT0gXCJlcnJvclwiID8gXCJlcnJvclwiIDogXCJzdWNjZXNzXCIpO1xuICBjb25zdCBicmVha2Rvd24gPSBzdGF0dXMucnVubmluZyA/IG51bGwgOiBzdGF0dXMuYnJlYWtkb3duO1xuICBzZXRTdGF0dXModGV4dCwga2luZCwgYnJlYWtkb3duKTtcbn1cblxuZnVuY3Rpb24gYXBwbHlTeW5jU3RhdHVzKHN0YXR1cykge1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBfbGF0ZXN0U3RhdHVzID0gc3RhdHVzO1xuICBfcmVuZGVyU3RhdHVzKCk7XG4gIGlmIChzdGF0dXMucnVubmluZykge1xuICAgIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSBmYWxzZTtcbiAgICBpZiAoIV9lbGFwc2VkVGlja2VySWQpIHtcbiAgICAgIF9lbGFwc2VkVGlja2VySWQgPSBzZXRJbnRlcnZhbChfcmVuZGVyU3RhdHVzLCAxMDAwKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZWxzLnN0b3BCdG4uaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoX2VsYXBzZWRUaWNrZXJJZCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChfZWxhcHNlZFRpY2tlcklkKTtcbiAgICAgIF9lbGFwc2VkVGlja2VySWQgPSBudWxsO1xuICAgIH1cbiAgICAvLyBSZS1kZXJpdmUgc3luYyBidXR0b24gZW5hYmxlZCBzdGF0ZSBmcm9tIG1vZGUvY29ubi9OSEktdGFiIGluc3RlYWRcbiAgICAvLyBvZiB1bmNvbmRpdGlvbmFsbHkgZW5hYmxpbmcgXHUyMDE0IGtlZXBzIHRoZSBidXR0b24gZGlzYWJsZWQgd2hlbiB3ZVxuICAgIC8vIGtub3cgd2Ugc2hvdWxkbid0IHN5bmMgKGUuZy4gYmFja2VuZCBkb3duLCBvZmYtTkhJIHRhYikuXG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAvLyBTeW5jIGp1c3QgZmluaXNoZWQgXHUyMDE0IGJvdGggc2lkZXMgbWF5IGhhdmUgY2hhbmdlZCAoYmFja2VuZCBnb3RcbiAgICAvLyBuZXcgcmVzb3VyY2VzIGluIGJhY2tlbmQgbW9kZSwgbG9jYWwgYnVuZGxlIHdhcyBzdGFzaGVkIGluIGVpdGhlclxuICAgIC8vIG1vZGUpLiBSZWZyZXNoIGRhdGEtc3RhdGUgY2FyZCBzbyB0aGUgdXNlciBzZWVzIHVwLXRvLWRhdGUgY291bnRzLlxuICAgIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xuICAgIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBfY29ublN0YXRlID09PSBcIm9rXCIpIGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgfVxufVxuXG4vLyBTdG9wIHRoZSBpbi1wcm9ncmVzcyBzeW5jLiBUd28tcHJvbmdlZCBzbyBpdCB3b3JrcyBldmVuIHdoZW4gdGhlXG4vLyBzZXJ2aWNlIHdvcmtlciBoYXMgZGllZDogKDEpIHRlbGwgdGhlIFNXIHRvIHNldCBpdHMgY2FuY2VsIGZsYWcsXG4vLyAoMikgd3JpdGUgc3RvcmFnZSBkaXJlY3RseSB0byBydW5uaW5nOmZhbHNlIHNvIHRoZSBwb3B1cCBVSSB1bmZyZWV6ZXNcbi8vIGltbWVkaWF0ZWx5IGV2ZW4gaWYgdGhlIFNXIG1lc3NhZ2UgY2FuJ3QgYmUgZGVsaXZlcmVkLlxuYXN5bmMgZnVuY3Rpb24gc3RvcFN5bmMoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgc3luY1N0YXR1czoge1xuICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1MDVDXHU2QjYyXHU0RTJEXHVGRjBDXHU2QjYzXHU1NzI4XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5XHUyMDI2XCIsXG4gICAgICBwaGFzZTogXCJjYW5jZWxsZWRcIixcbiAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0pO1xuICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1MDVDXHU2QjYyXHU0RTJEXHVGRjBDXHU2QjYzXHU1NzI4XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcInN0b3BTeW5jXCIgfSkuY2F0Y2goKCkgPT4ge30pO1xuICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSB0cnVlO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xufVxuXG4vLyBMaXZlIHByb2dyZXNzIHVwZGF0ZXMgXHUyMDE0IGxpc3RlbiBvbiBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQgc28gd2UgZ2V0XG4vLyBldmVyeSB1cGRhdGUgdGhlIFNXIHdyaXRlcywgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoZSBTVydzIGJyb2FkY2FzdFxuLy8gc2VuZE1lc3NhZ2UgcmVhY2hlZCB1cy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIGNoYW5nZXMuc3luY1N0YXR1cykge1xuICAgIGFwcGx5U3luY1N0YXR1cyhjaGFuZ2VzLnN5bmNTdGF0dXMubmV3VmFsdWUpO1xuICB9XG59KTtcblxuLy8gKExlZ2FjeSBpbi1tZW1vcnkgYnJvYWRjYXN0IHN0aWxsIGxpc3RlbmVkIHRvIGFzIGEgYmFja3VwLilcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnKSA9PiB7XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3luY1Byb2dyZXNzXCIpIHtcbiAgICBhcHBseVN5bmNTdGF0dXMobXNnLnN0YXR1cyk7XG4gIH1cbn0pO1xuXG4vLyBQcmUtZmxpZ2h0IGRldGVjdGlvbiBmb3IgTkhJIGxvZ2luIHN0YXRlLiBUd28gc2lnbmFscyAoZWl0aGVyIHRyaWdnZXJzKTpcbi8vICAxLiBVUkwgaXMgaW4gTkhJIGF1dGggbmFtZXNwYWNlIChJSEtFMzA5OVN4eCkgXHUyMDE0IGxvZ2luIC8gSUMgY2FyZCBwYWdlc1xuLy8gIDIuIFBhZ2UgY29udGFpbnMgYSBwYXNzd29yZCBpbnB1dCBvciBrbm93biBsb2dnZWQtb3V0IHBocmFzZXNcbmFzeW5jIGZ1bmN0aW9uIGlzT25OaGlMb2dpblBhZ2UodGFiSWQsIHVybCkge1xuICBpZiAodXJsPy5wYXRobmFtZSAmJiAvSUhLRTMwOTkvLnRlc3QodXJsLnBhdGhuYW1lKSkgcmV0dXJuIHRydWU7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdJykpIHJldHVybiB0cnVlO1xuICAgICAgICBjb25zdCB0ZXh0ID0gKGRvY3VtZW50LmJvZHk/LmlubmVyVGV4dCB8fCBcIlwiKS50cmltKCk7XG4gICAgICAgIGNvbnN0IHBocmFzZXMgPSBbXG4gICAgICAgICAgXCJcdThBQ0JcdTRGN0ZcdTc1MjhcdTUwNjVcdTRGRERcdTUzNjFcIiwgXCJcdThBQ0JcdTYzRDJcdTUxNjVcdTUwNjVcdTRGRERcdTUzNjFcIiwgXCJcdThBQ0JcdTYzRDJcdTUxNjVcdTYwQThcdTc2ODRcdTUwNjVcdTRGRERcdTUzNjFcIixcbiAgICAgICAgICBcIlx1NzY3Qlx1NTE2NVx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QVwiLCBcIlx1NzY3Qlx1NTE2NVx1NTkzMVx1NjU1N1wiLCBcIlx1OEFDQlx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVwiLFxuICAgICAgICAgIFwiU2Vzc2lvbiBcdTVERjJcdTkwM0VcdTY2NDJcIiwgXCJzZXNzaW9uIFx1NURGMlx1OTAzRVx1NjY0MlwiLCBcIlx1NURGMlx1OTAzRVx1NjY0MlwiLFxuICAgICAgICAgIFwiXHU4QUNCXHU0RUU1XHU1MDY1XHU0RkREXHU1MzYxXHU3NjdCXHU1MTY1XCIsXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBwaHJhc2VzLnNvbWUoKHApID0+IHRleHQuaW5jbHVkZXMocCkpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBcdTI2QTEgTkhJIEFQSS1kaXJlY3Qgc3luYyBcdTIwMTQgcHJpbWFyeSBwYXRoLiBIaXRzIE5ISSdzIHVuZGVybHlpbmcgSlNPTlxuLy8gZW5kcG9pbnRzIGluIHBhcmFsbGVsIGFuZCBwb3N0cyBhZGFwdGVkIGl0ZW1zIHRvIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkLlxuLy8gUmVxdWlyZXMgcGF0aWVudF9vdmVycmlkZSB0byBiZSBmaWxsZWQuXG4vLyBDb252ZXJ0IGEgYmFja2VuZCBVUkwgXHUyMTkyIHRoZSBvcmlnaW4tcGF0dGVybiBDaHJvbWUgd2FudHMgZm9yIHBlcm1pc3Npb25cbi8vIHJlcXVlc3RzLiBcImh0dHA6Ly8xOTIuMTY4LjEuNTo4MDEwXCIgXHUyMTkyIFwiaHR0cDovLzE5Mi4xNjguMS41OjgwMTAvKlwiLlxuLy8gUmV0dXJucyBudWxsIHdoZW4gdGhlIFVSTCBpc24ndCBwYXJzZWFibGUgc28gdGhlIGNhbGxlciBjYW4gc2hvcnQtY2lyY3VpdC5cbmZ1bmN0aW9uIF9vcmlnaW5QYXR0ZXJuRm9yKHVybCkge1xuICB0cnkge1xuICAgIGNvbnN0IHUgPSBuZXcgVVJMKHVybCk7XG4gICAgcmV0dXJuIGAke3UucHJvdG9jb2x9Ly8ke3UuaG9zdH0vKmA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8vIEJhY2tlbmQtbW9kZSBwcmUtZmxpZ2h0OiBlbnN1cmUgdGhlIGV4dGVuc2lvbiBoYXMgaG9zdCBwZXJtaXNzaW9uIGZvclxuLy8gdGhlIHVzZXItY29uZmlndXJlZCBiYWNrZW5kIFVSTC4gTG9jYWxob3N0IC8gMTI3LjAuMC4xIGFyZSBjb3ZlcmVkIGJ5XG4vLyB0aGUgZGVmYXVsdCBtYW5pZmVzdCBob3N0X3Blcm1pc3Npb25zOyByZW1vdGUgLyBMQU4gLyBwcm9kdWN0aW9uIFVSTHNcbi8vIG5lZWQgYSBvbmUtdGltZSB1c2VyIGdyYW50LiBNdXN0IHJ1biBmcm9tIGEgdXNlciBnZXN0dXJlIChidXR0b24gY2xpY2spLlxuYXN5bmMgZnVuY3Rpb24gZW5zdXJlQmFja2VuZFBlcm1pc3Npb24oYmFja2VuZFVybCkge1xuICBjb25zdCBwYXR0ZXJuID0gX29yaWdpblBhdHRlcm5Gb3IoYmFja2VuZFVybCk7XG4gIGlmICghcGF0dGVybikgcmV0dXJuIHsgb2s6IGZhbHNlLCByZWFzb246IGBCYWNrZW5kIFVSTCBcdTcxMjFcdTZDRDVcdTg5RTNcdTY3OTA6ICR7YmFja2VuZFVybH1gIH07XG4gIGNvbnN0IGFscmVhZHkgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMuY29udGFpbnMoeyBvcmlnaW5zOiBbcGF0dGVybl0gfSk7XG4gIGlmIChhbHJlYWR5KSByZXR1cm4geyBvazogdHJ1ZSB9O1xuICBsZXQgZ3JhbnRlZDtcbiAgdHJ5IHtcbiAgICBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLnJlcXVlc3QoeyBvcmlnaW5zOiBbcGF0dGVybl0gfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIHJlYXNvbjogYFx1NkIwQVx1OTY1MFx1OEFDQlx1NkM0Mlx1NTkzMVx1NjU1NzogJHtlLm1lc3NhZ2V9YCB9O1xuICB9XG4gIHJldHVybiBncmFudGVkXG4gICAgPyB7IG9rOiB0cnVlIH1cbiAgICA6IHsgb2s6IGZhbHNlLCByZWFzb246IGBcdTY3MkFcdTYzODhcdTZCMEFcdTkwMjNcdTdEREFcdTUyMzAgJHtwYXR0ZXJufSBcdTIwMTQgXHU1M0Q2XHU2RDg4YCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBhcGlTeW5jTmhpKCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoIW92KSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1OEFDQlx1NTE0OFx1NTg2Qlx1NUJFQlx1NEUwQVx1NjVCOVx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1RkYwOFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1Rlx1RkYwOVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFByZS1mbGlnaHQ6IGNoZWNrIHdlJ3JlIG9uIGFuIE5ISSB0YWIgc28gY29va2llcyBhcmUgdXNhYmxlIGZyb20gU1cuXG4gIGNvbnN0IHRhYiA9IGF3YWl0IGdldEFjdGl2ZVRhYigpO1xuICBsZXQgdXJsO1xuICB0cnkgeyB1cmwgPSBuZXcgVVJMKHRhYi51cmwpOyB9IGNhdGNoIHsgc2V0U3RhdHVzKFwiYWN0aXZlIHRhYiBoYXMgbm8gVVJMXCIsIFwiZXJyb3JcIik7IHJldHVybjsgfVxuICBjb25zdCBvbkxvZ2luID0gYXdhaXQgaXNPbk5oaUxvZ2luUGFnZSh0YWIuaWQsIHVybCk7XG4gIGlmIChvbkxvZ2luKSB7XG4gICAgc2V0U3RhdHVzKFwiXHVEODNEXHVERDEyIFx1NUMxQVx1NjcyQVx1NzY3Qlx1NTE2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBcdTIwMTQgXHU4QUNCXHU1MTQ4XHU0RUU1XHU1MDY1XHU0RkREXHU1MzYxXHU3NjdCXHU1MTY1XHU1RjhDXHU1MThEXHU4QTY2XCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQmFja2VuZCBtb2RlOiByZS12ZXJpZnkgY29ubmVjdGl2aXR5IHJpZ2h0IGhlcmUgZXZlbiBpZiB0aGUgYmFubmVyXG4gIC8vIGxhc3Qgc2FpZCBvay4gQmV0d2VlbiB0aGUgcHJldmlvdXMgY2hlY2sgYW5kIHRoaXMgY2xpY2sgdGhlIHVzZXJcbiAgLy8gbWF5IGhhdmUgc3RvcHBlZCBkb2NrZXI7IHdpdGhvdXQgYSBmcmVzaCBwcm9iZSB3ZSdkIHN0YXJ0IGFuIHVwbG9hZFxuICAvLyB0aGF0IGZhaWxzIG1pZC1mbGlnaHQgYWZ0ZXIgcGFydGlhbCBkYXRhIGhhcyBoaXQgKG9yIGZhaWxlZCB0byBoaXQpXG4gIC8vIHRoZSBiYWNrZW5kLiBDaGVhcCAoXHUyMjY0NXMpIGFuZCBzYXZlcyBhIGxvdCBvZiBjb25mdXNpb24uXG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikge1xuICAgIGNvbnN0IG9rID0gYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gICAgaWYgKCFvaykge1xuICAgICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NUY4Q1x1N0FFRlx1OTAyM1x1N0REQVx1NTkzMVx1NjU1NyBcdTIwMTQgXHU4QUNCXHU3NzBCXHU5ODAyXHU5MEU4IGJhbm5lciBcdTc2ODRcdThBQUFcdTY2MEVcIiwgXCJlcnJvclwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBzeW5jU3RhdHVzOiB7XG4gICAgICBydW5uaW5nOiB0cnVlLFxuICAgICAgcHJvZ3Jlc3M6IFwiXHVEODNEXHVERTgwIFx1OTU4Qlx1NTlDQlx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MjAyNlwiLFxuICAgICAgcGhhc2U6IFwic3RhcnRpbmdcIiwgc3RhcnRlZDogRGF0ZS5ub3coKSwgdHM6IERhdGUubm93KCksXG4gICAgfSxcbiAgfSk7XG4gIHNldFN0YXR1cyhcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIiwgXCJpbmZvXCIpO1xuXG4gIC8vIENvbXB1dGUgZGF0ZSByYW5nZSBmcm9tIHRoZSBkcm9wZG93bi4gXCIxXCIgPSBOSEkncyBkZWZhdWx0IHdpbmRvdztcbiAgLy8gYW55dGhpbmcgZWxzZSBpcyBcInRvZGF5IGJhY2sgTiB5ZWFyc1wiLiBIZWxwZXIgaW5zaWRlIGJhY2tncm91bmQuanNcbiAgLy8gY29udmVydHMgdG8gXHU2QzExXHU1NzBCIGZvciBOSEkncyBBUEkuXG4gIGNvbnN0IHJhbmdlU2VsID0gZWxzLmFwaVN5bmNSYW5nZT8udmFsdWUgfHwgXCIzXCI7XG4gIGxldCBkYXRlUmFuZ2UgPSBudWxsO1xuICBjb25zdCBSQU5HRV9MQUJFTFMgPSB7XG4gICAgXCIxXCI6ICAgXCJcdTY3MDBcdThGRDEgMSBcdTVFNzRcIixcbiAgICBcIjNcIjogICBcIlx1NjcwMFx1OEZEMSAzIFx1NUU3NFwiLFxuICAgIFwiNVwiOiAgIFwiXHU2NzAwXHU4RkQxIDUgXHU1RTc0XCIsXG4gICAgXCIxMFwiOiAgXCJcdTY3MDBcdThGRDEgMTAgXHU1RTc0XCIsXG4gICAgXCJhbGxcIjogXCJcdTUxNjhcdTkwRThcdTZCNzdcdTUzRjJcdTdEMDBcdTkzMDRcIixcbiAgfTtcbiAgY29uc3QgZGF0ZVJhbmdlTGFiZWwgPSBSQU5HRV9MQUJFTFNbcmFuZ2VTZWxdIHx8IGBcdTY3MDBcdThGRDEgJHtyYW5nZVNlbH0gXHU1RTc0YDtcbiAgaWYgKHJhbmdlU2VsICE9PSBcIjFcIikge1xuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBlbmQgPSB0b2RheS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKTtcbiAgICBsZXQgc3RhcnQ7XG4gICAgaWYgKHJhbmdlU2VsID09PSBcImFsbFwiKSB7XG4gICAgICBzdGFydCA9IFwiMjAwMS0wMS0wMVwiOyAgLy8gXHU2QzExXHU1NzBCIDkwIFx1MjAxNCBmYXIgZW5vdWdoIGJhY2sgZm9yIGFueSBjbGluaWNhbCBjYXNlXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHllYXJzID0gcGFyc2VJbnQocmFuZ2VTZWwsIDEwKTtcbiAgICAgIGNvbnN0IHMgPSBuZXcgRGF0ZSh0b2RheSk7XG4gICAgICBzLnNldEZ1bGxZZWFyKHMuZ2V0RnVsbFllYXIoKSAtIHllYXJzKTtcbiAgICAgIHN0YXJ0ID0gcy50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKTtcbiAgICB9XG4gICAgZGF0ZVJhbmdlID0geyBzdGFydCwgZW5kIH07XG4gIH1cblxuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgdHlwZTogXCJzdGFydE5oaUFwaVN5bmNcIixcbiAgICBwYXlsb2FkOiB7XG4gICAgICB0YWJJZDogdGFiLmlkLFxuICAgICAgbW9kZTogY3VycmVudE1vZGUoKSxcbiAgICAgIGJhY2tlbmQ6IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKSxcbiAgICAgIHN5bmNBcGlLZXk6IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKSxcbiAgICAgIG5oaUJhc2U6IFwiaHR0cHM6Ly9teWhlYWx0aGJhbmsubmhpLmdvdi50d1wiLFxuICAgICAgcGF0aWVudE92ZXJyaWRlOiBvdixcbiAgICAgIGRhdGVSYW5nZSxcbiAgICAgIGRhdGVSYW5nZUxhYmVsLFxuICAgIH0sXG4gIH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbGF1bmNoKCkge1xuICBjb25zdCBiYWNrZW5kID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpO1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBwYXRpZW50SWQgPSBvdj8uaWRfbm87XG4gIGNvbnN0IHNtYXJ0QXBwTGF1bmNoID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKSB8fCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIGlmICghcGF0aWVudElkKSB7XG4gICAgc2V0U3RhdHVzKFwiXHU2QzkyXHU2NzA5XHU3NUM1XHU0RUJBXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGXHU1M0VGXHU0RUU1IGxhdW5jaCBcdTIwMTQgXHU4QUNCXHU1MTQ4XHU1ODZCXHU1QkVCXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIFJlLXRlc3QgY29ubmVjdGlvbiBldmVuIGlmIGJhbm5lciBzaG93cyBvayBcdTIwMTQgYmFja2VuZCBtYXkgaGF2ZSBnb25lXG4gIC8vIGRvd24gc2luY2UgdGhlIGxhc3QgcHJvYmUuXG4gIGNvbnN0IG9rID0gYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIGlmICghb2spIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1RjhDXHU3QUVGXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3IFx1MjAxNCBcdThBQ0JcdTc3MEJcdTk4MDJcdTkwRTggYmFubmVyIFx1NzY4NFx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZXRTdGF0dXMoXCJcdTVFRkFcdTdBQ0IgbGF1bmNoIGNvbnRleHRcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3NtYXJ0L2xhdW5jaC1jb250ZXh0YCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGF0aWVudF9pZDogcGF0aWVudElkIH0pLFxuICAgIH0pO1xuICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYCR7cmVzLnN0YXR1c306ICR7YXdhaXQgcmVzLnRleHQoKX1gKTtcbiAgICBjb25zdCB7IGxhdW5jaCB9ID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHsgaXNzOiBgJHtiYWNrZW5kfS9maGlyYCwgbGF1bmNoIH0pO1xuICAgIC8vIEFwcGVuZCBpc3MgKyBsYXVuY2ggcGFyYW1zLCByZXNwZWN0aW5nIGFueSBleGlzdGluZyBxdWVyeSBzdHJpbmcuXG4gICAgY29uc3Qgc2VwID0gc21hcnRBcHBMYXVuY2guaW5jbHVkZXMoXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGAke3NtYXJ0QXBwTGF1bmNofSR7c2VwfSR7cGFyYW1zfWAgfSk7XG4gICAgd2luZG93LmNsb3NlKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1Mjc0QyBMYXVuY2ggXHU1OTMxXHU2NTU3XHVGRjFBJHtlLm1lc3NhZ2V9YCwgXCJlcnJvclwiKTtcbiAgfVxufVxuXG5lbHMuc3luY0FwaUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXBpU3luY05oaSk7XG5lbHMuc3RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RvcFN5bmMpO1xuZWxzLm92U2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2F2ZVBhdGllbnRPdmVycmlkZSk7XG5lbHMub3ZDbGVhckJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJQYXRpZW50T3ZlcnJpZGUpO1xuW2Vscy5vdklkTm8sIGVscy5vdk5hbWUsIGVscy5vdkJpcnRoRGF0ZSwgZWxzLm92R2VuZGVyXS5mb3JFYWNoKChlbCkgPT5cbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkpXG4pO1xuZWxzLmxhdW5jaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGF1bmNoKTtcbmluaXQoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBU0EsT0FBQyxXQUFXO0FBQ1Y7QUFFQSxZQUFJLGNBQWM7QUFDbEIsWUFBSSxpQkFBaUI7QUFDckIsWUFBSSxTQUFTLE9BQU8sV0FBVztBQUMvQixZQUFJLE9BQU8sU0FBUyxTQUFTLENBQUM7QUFDOUIsWUFBSSxLQUFLLG1CQUFtQjtBQUMxQixtQkFBUztBQUFBLFFBQ1g7QUFDQSxZQUFJLGFBQWEsQ0FBQyxVQUFVLE9BQU8sU0FBUztBQUM1QyxZQUFJLFVBQVUsQ0FBQyxLQUFLLHNCQUFzQixPQUFPLFlBQVksWUFBWSxRQUFRLFlBQVksUUFBUSxTQUFTO0FBQzlHLFlBQUksU0FBUztBQUNYLGlCQUFPO0FBQUEsUUFDVCxXQUFXLFlBQVk7QUFDckIsaUJBQU87QUFBQSxRQUNUO0FBQ0EsWUFBSSxZQUFZLENBQUMsS0FBSyx3QkFBd0IsT0FBTyxXQUFXLFlBQVksT0FBTztBQUNuRixZQUFJLE1BQU0sT0FBTyxXQUFXLGNBQWMsT0FBTztBQUNqRCxZQUFJLGVBQWUsQ0FBQyxLQUFLLDJCQUEyQixPQUFPLGdCQUFnQjtBQUMzRSxZQUFJLFlBQVksbUJBQW1CLE1BQU0sRUFBRTtBQUMzQyxZQUFJLFFBQVEsQ0FBQyxhQUFhLFNBQVMsT0FBTyxHQUFHO0FBQzdDLFlBQUksUUFBUSxDQUFDLElBQUks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Q2pCO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUMsRUFBRSxNQUFNLE1BQU07QUFBQSxJQUFDLENBQUM7QUFBQSxFQUNuQjtBQUVBLGlCQUFlLFNBQVM7QUFDdEIsVUFBTSxVQUFVLElBQUksV0FBVyxNQUFNLEtBQUs7QUFDMUMsVUFBTSxLQUFLLG1CQUFtQjtBQUM5QixVQUFNLFlBQVksSUFBSTtBQUN0QixVQUFNLGlCQUFpQixJQUFJLFlBQVksTUFBTSxLQUFLLEtBQUs7QUFDdkQsUUFBSSxDQUFDLFdBQVc7QUFDZCxnQkFBVSxxSUFBaUMsT0FBTztBQUNsRDtBQUFBLElBQ0Y7QUFHQSxVQUFNLEtBQUssTUFBTSxzQkFBc0I7QUFDdkMsUUFBSSxDQUFDLElBQUk7QUFDUCxnQkFBVSx5R0FBOEIsT0FBTztBQUMvQztBQUFBLElBQ0Y7QUFDQSxjQUFVLHFDQUFzQixNQUFNO0FBQ3RDLFFBQUk7QUFDRixZQUFNLE1BQU0sTUFBTSxNQUFNLEdBQUcsT0FBTyx5QkFBeUI7QUFBQSxRQUN6RCxRQUFRO0FBQUEsUUFDUixTQUFTLEVBQUUsZ0JBQWdCLG1CQUFtQjtBQUFBLFFBQzlDLE1BQU0sS0FBSyxVQUFVLEVBQUUsWUFBWSxVQUFVLENBQUM7QUFBQSxNQUNoRCxDQUFDO0FBQ0QsVUFBSSxDQUFDLElBQUksR0FBSSxPQUFNLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsRUFBRTtBQUNqRSxZQUFNLEVBQUUsUUFBQUMsUUFBTyxJQUFJLE1BQU0sSUFBSSxLQUFLO0FBQ2xDLFlBQU0sU0FBUyxJQUFJLGdCQUFnQixFQUFFLEtBQUssR0FBRyxPQUFPLFNBQVMsUUFBQUEsUUFBTyxDQUFDO0FBRXJFLFlBQU0sTUFBTSxlQUFlLFNBQVMsR0FBRyxJQUFJLE1BQU07QUFDakQsYUFBTyxLQUFLLE9BQU8sRUFBRSxLQUFLLEdBQUcsY0FBYyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQztBQUM5RCxhQUFPLE1BQU07QUFBQSxJQUNmLFNBQVMsR0FBRztBQUNWLGdCQUFVLG1DQUFlLEVBQUUsT0FBTyxJQUFJLE9BQU87QUFBQSxJQUMvQztBQUFBLEVBQ0Y7QUFFQSxNQUFJLFdBQVcsaUJBQWlCLFNBQVMsVUFBVTtBQUNuRCxNQUFJLFFBQVEsaUJBQWlCLFNBQVMsUUFBUTtBQUM5QyxNQUFJLFVBQVUsaUJBQWlCLFNBQVMsbUJBQW1CO0FBQzNELE1BQUksV0FBVyxpQkFBaUIsU0FBUyxvQkFBb0I7QUFDN0QsR0FBQyxJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUksYUFBYSxJQUFJLFFBQVEsRUFBRTtBQUFBLElBQVEsQ0FBQyxPQUMvRCxHQUFHLGlCQUFpQixTQUFTLHNCQUFzQjtBQUFBLEVBQ3JEO0FBQ0EsTUFBSSxVQUFVLGlCQUFpQixTQUFTLE1BQU07QUFDOUMsT0FBSzsiLAogICJuYW1lcyI6IFsiY3J5cHRvIiwgIkJ1ZmZlciIsICJibG9ja3MiLCAiZXhwb3J0cyIsICJsYXVuY2giXQp9Cg==
