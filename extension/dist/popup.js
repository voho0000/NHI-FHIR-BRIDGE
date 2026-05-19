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
  function derivePatientId(nationalId) {
    return (0, import_js_sha1.sha1)(["patient", nationalId].join("|")).slice(0, 32);
  }
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
    if (!_storedIdNo && !name && !birth_date && !gender) return null;
    const out = {};
    if (_storedIdNo) out.id_no = _storedIdNo;
    if (name) out.name = name;
    if (birth_date) out.birth_date = birth_date;
    if (gender) out.gender = gender;
    return out;
  }
  function validateBirthDate() {
    const el = els.ovBirthDate;
    if (!el) return null;
    if (el.validity && el.validity.badInput) {
      return "\u751F\u65E5\u8ACB\u586B\u5B8C\u6574\u5E74\u6708\u65E5";
    }
    const s = (el.value || "").trim();
    if (!s) return "\u8ACB\u586B\u751F\u65E5";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return "\u751F\u65E5\u8ACB\u586B\u5B8C\u6574\u5E74\u6708\u65E5";
    const [y, m, d] = s.split("-").map(Number);
    const dt = /* @__PURE__ */ new Date(s + "T00:00:00Z");
    if (Number.isNaN(dt.getTime()) || dt.getUTCFullYear() !== y || dt.getUTCMonth() + 1 !== m || dt.getUTCDate() !== d) {
      return "\u751F\u65E5\u4E0D\u662F\u6709\u6548\u65E5\u671F";
    }
    const now = /* @__PURE__ */ new Date();
    if (dt.getTime() > now.getTime()) return "\u751F\u65E5\u4E0D\u80FD\u662F\u672A\u4F86";
    if (y < 1900) return "\u751F\u65E5\u5E74\u4EFD\u592A\u65E9\uFF0C\u8ACB\u78BA\u8A8D";
    return null;
  }
  function _generateAutoPatientId() {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `auto-${hex}`;
  }
  function _displayId(idNo) {
    if (!idNo || idNo.startsWith("auto-")) return "";
    return maskId(idNo);
  }
  function refreshOverrideSummary() {
    const ov = getPatientOverride();
    const card = els.patientOverrideDetails;
    let summaryText = "";
    if (!ov || !ov.name) {
      els.ovSummary.textContent = "\u672A\u8A2D\u5B9A";
      if (card) card.dataset.state = "empty";
    } else {
      const parts = [_maybeMask(ov.name)];
      const idLabel = _displayId(ov.id_no);
      if (idLabel) parts.push(idLabel);
      summaryText = parts.join("  \xB7  ");
      els.ovSummary.textContent = `\u2713 ${summaryText}`;
      if (card) card.dataset.state = "filled";
    }
    if (els.activePatient && els.activePatientValue) {
      const showActive = _step2Confirmed && !!summaryText;
      els.activePatient.hidden = !showActive;
      if (showActive) els.activePatientValue.textContent = summaryText;
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
    if (!ov.name) delete ov.name;
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
    if (_wizardInitialized) _maybeAutoAdvance();
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
    if (!banner) return;
    banner.dataset.state = _connState;
    if (els.connSection) els.connSection.dataset.state = _connState;
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
    if (!els.wizardStepper) return;
    const lis = els.wizardStepper.querySelectorAll("li[data-step]");
    for (const li of lis) {
      const n = Number(li.dataset.step);
      const isActive = n === _activeStep;
      const isDone = _isStepDone(n);
      if (isActive) li.setAttribute("aria-current", "true");
      else li.removeAttribute("aria-current");
      if (isDone) li.dataset.done = "true";
      else delete li.dataset.done;
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
    if (!els.resultZone) return;
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
    if (_activeStep === 1 && _isStepDone(1)) _setActiveStep(2);
    else if (_activeStep === 2 && _isStepDone(2)) _setActiveStep(3);
  }
  function _initWizard() {
    if (_wizardInitialized) return;
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
    if (jumpTo) tooltipReason = `\u56DE ${_stepNumGlyph(jumpTo.step)} ${jumpTo.label}\uFF1A${inlineMsg}`;
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
    if (els.stopBtn) els.stopBtn.hidden = !syncRunning;
    const ov = getPatientOverride();
    const haveBackendPatient = _backendPatient.state === "present";
    els.launchBtn.disabled = !(currentMode() === "backend" && _connState === "ok" && !!ov?.id_no && haveBackendPatient);
    els.launchBtn.title = currentMode() !== "backend" ? "\u8ACB\u5207\u5230\u300C\u{1F3E5} \u672C\u6A5F\u5F8C\u7AEF (\u9032\u968E)\u300D\u6A21\u5F0F" : _connState !== "ok" ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : !ov?.id_no ? "\u56DE \u2461 \u60A8\u7684\u8CC7\u6599\uFF1A\u8ACB\u586B\u75C5\u4EBA\u8CC7\u6599" : !haveBackendPatient ? "\u5F8C\u7AEF\u5C1A\u7121\u6B64\u75C5\u4EBA\u8CC7\u6599 \u2014 \u5148\u6309\u300C\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6216\u4E0B\u65B9\u300C\u628A\u672C\u5730\u6A94\u6848\u4E0A\u50B3\u5230\u5F8C\u7AEF\u300D" : "";
    if (_wizardInitialized) _refreshWizardUi();
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
  els.syncBlockedReason?.addEventListener("click", () => {
    const target = Number(els.syncBlockedReason.dataset.targetStep);
    if (target >= 1 && target <= 3) _setActiveStep(target);
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
    if (area === "local" && PENDING_BUNDLE_KEY in changes) _refreshLocalBundleState();
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
      for (const r of els.modeRadios()) r.checked = r.value === "backend";
      document.body.dataset.mode = "backend";
      await chrome.storage.local.set({ syncMode: "backend" });
      testBackendConnection();
    } else {
      for (const r of els.modeRadios()) r.checked = r.value === "local";
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
    if (currentMode() === "backend") testBackendConnection();
  });
  els.syncApiKey.addEventListener("change", () => {
    chrome.storage.local.set({ syncApiKey: els.syncApiKey.value.trim() });
  });
  var _maskNameEnabled = false;
  async function loadMaskNameEnabled() {
    const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
    _maskNameEnabled = maskNameEnabled === true;
    if (els.maskNameEnabled) els.maskNameEnabled.checked = _maskNameEnabled;
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
  function setStatus(text, kind, breakdown, errors) {
    els.status.className = kind || "";
    els.status.textContent = "";
    const hasErrors = Array.isArray(errors) && errors.length > 0;
    if (!text && !(breakdown && breakdown.length) && !hasErrors) return;
    els.status.appendChild(document.createTextNode(text || ""));
    if (breakdown && breakdown.length || hasErrors) {
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
          const line = document.createElement("div");
          line.textContent = row;
          body.appendChild(line);
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
        phases.textContent = phaseRows.map((p) => p.replace(/^⏱\s*/, "")).join(" \xB7 ");
        techDetails.appendChild(phases);
        details.appendChild(techDetails);
      }
      els.status.appendChild(details);
    }
    if (_wizardInitialized) _refreshResultZone();
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
      if (_wizardInitialized) _refreshResultZone();
      return;
    }
    const ov = getPatientOverride();
    if (ov?.id_no && pending.patientId && pending.patientId !== ov.id_no) {
      els.pendingBundle.hidden = true;
      if (_wizardInitialized) _refreshResultZone();
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
    if (_wizardInitialized) _refreshResultZone();
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
    _latestStatus = null;
    setStatus("", null);
    await chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {
    });
  }
  els.downloadBundleBtn.addEventListener("click", downloadPendingBundle);
  els.clearBundleBtn.addEventListener("click", clearPendingBundle);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes) refreshPendingBundle();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.patientOverride) loadPatientOverride();
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
    if (onNhi) delete els.syncApiBtn.dataset.offNhi;
    else els.syncApiBtn.dataset.offNhi = "1";
    if (els.openNhiSection) els.openNhiSection.hidden = onNhi;
    _nhiTabId = onNhi ? tab.id : null;
    if (onNhi && tab.id) {
      chrome.runtime.sendMessage({ type: "checkNhiLogin", tabId: tab.id }).then((resp) => {
        const loggedIn = resp?.loggedIn === true;
        if (loggedIn) delete els.syncApiBtn.dataset.nhiLoggedIn;
        else els.syncApiBtn.dataset.nhiLoggedIn = "no";
        if (els.nhiNeedsLoginSection) {
          els.nhiNeedsLoginSection.hidden = loggedIn;
        }
        _refreshButtonStates();
        if (loggedIn && _wizardInitialized) _maybeAutoAdvance();
      }).catch(() => {
        delete els.syncApiBtn.dataset.nhiLoggedIn;
        if (els.nhiNeedsLoginSection) els.nhiNeedsLoginSection.hidden = true;
        _refreshButtonStates();
      });
    } else {
      delete els.syncApiBtn.dataset.nhiLoggedIn;
      if (els.nhiNeedsLoginSection) els.nhiNeedsLoginSection.hidden = true;
    }
    _refreshButtonStates();
    _initWizard();
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
    const errors = status.running ? null : status.errors;
    setStatus(text, kind, breakdown, errors);
  }
  function applySyncStatus(status) {
    if (!status) return;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBPTkxZIGFcbiAqIGhhc2hlZCBQYXRpZW50LmlkIChlLmcuIHZpYSBhbiBIVFRQIGFjY2VzcyBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGVcbiAqIH4zME0gVGFpd2FuZXNlIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdFxuICogdGhpcyBiZWNhdXNlIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3XG4gKiBuYXRpb25hbCBJRCBpbiBhbnkgbGVha2VkIEJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBCdW5kbGUtbGVha1xuICogc2NlbmFyaW9zIGRpc2Nsb3NlIGJvdGggZmllbGRzIHRvZ2V0aGVyLCBzbyBhIHNhbHQgd291bGQgbm90IG1vdmVcbiAqIHRoZSBuZWVkbGUgdGhlcmUuIFRoZSByZW1haW5pbmcgc2luZ2xlLWZpZWxkIGxlYWsgdmVjdG9yIGlzIEhUVFBcbiAqIGFjY2VzcyBsb2dzOyBkZXBsb3ltZW50cyBzaG91bGQgc2NydWIgYC9maGlyL1BhdGllbnQvW14vXStgIHBhdGhzXG4gKiBhbmQgYD9wYXRpZW50PWAgcXVlcnkgc3RyaW5ncyBhdCB0aGUgcmV2ZXJzZS1wcm94eSBsYXllciAoc2VlXG4gKiBBUkNISVRFQ1RVUkUubWQgXHUwMEE3XCJQYXRpZW50LmlkIFx1NTNDRFx1NjNBOFx1OThBOFx1OTZBQVx1ODIwN1x1N0RFOVx1ODlFM1wiKS5cbiAqXG4gKiBVc2VzIGBqcy1zaGExYCAocHVyZSBKUykgaW5zdGVhZCBvZiBgbm9kZTpjcnlwdG9gIHNvIHRoZSBzYW1lIG1hcHBlclxuICogY29kZSBydW5zIHVubW9kaWZpZWQgaW4gdGhlIENocm9tZSBleHRlbnNpb24ncyBsb2NhbC1vbmx5IG1vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVJZChwYXRpZW50SWQ6IHN0cmluZywgLi4ucGFydHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW3BhdGllbnRJZCwgLi4ucGFydHNdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogTWFwIGEgcmF3IG5hdGlvbmFsIElEIChvciBhbnkgcGF0aWVudCBpZGVudGlmaWVyKSB0byBpdHMgMzItY2hhciBoZXhcbiAqIEZISVIgYFBhdGllbnQuaWRgLiBUaGUgcmF3IHZhbHVlIGlzIGtlcHQgaW4gYFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlYFxuICogXHUyMDE0IG9ubHkgdGhlIEZISVIgbG9naWNhbCBpZCBpcyBoYXNoZWQgc28gaXQgZG9lc24ndCBsZWFrIGludG8gVVJMcyxcbiAqIHN1YmplY3QucmVmZXJlbmNlIGZpZWxkcywgYXVkaXQgbG9ncywgb3IgU01BUlQgdG9rZW4gcGF5bG9hZHMuXG4gKlxuICogRkhJUiBSNCBcdTAwQTcyLjIwIHNheXMgXCJsb2dpY2FsIGlkIFx1MjAyNiBTSE9VTEQgTk9UIGNvbnRhaW4gaWRlbnRpZnlpbmdcbiAqIGluZm9ybWF0aW9uXCIgXHUyMDE0IHRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVQYXRpZW50SWQobmF0aW9uYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW1wicGF0aWVudFwiLCBuYXRpb25hbElkXS5qb2luKFwifFwiKSkuc2xpY2UoMCwgMzIpO1xufVxuXG4vKipcbiAqIFBhcnRpYWxseS1hbm9ueW1pemUgYSBwYXRpZW50IG5hbWUuIEFwcGxpZWQgaW4gbWFwUGF0aWVudCBzbyBldmVyeVxuICogRkhJUiByZXNvdXJjZSB0aGF0IGZsb3dzIG91dCBvZiB0aGlzIGNvZGViYXNlIChkb3dubG9hZGVkIEJ1bmRsZSxcbiAqIGJhY2tlbmQgRkhJUiBzdG9yZSwgZGFzaGJvYXJkLCBTTUFSVCBhcHAgbGF1bmNoZXMpIHNlZXMgdGhlIG1hc2tlZFxuICogZm9ybS4gVGhlIHVzZXIncyByYXcgaW5wdXQgaXMgc3RpbGwga2VwdCBpbiBjaHJvbWUuc3RvcmFnZSBzbyB0aGV5XG4gKiBjYW4gcmV2aWV3IHdoYXQgd2FzIGVudGVyZWQsIGJ1dCBpdCBuZXZlciBsZWF2ZXMgUGF0aWVudCBjb250ZXh0LlxuICpcbiAqIFJ1bGVzIChUYWl3YW4gLyBDSksgY29udmVudGlvbik6XG4gKiAgIC0gMSBjaGFyICAgICBcdTIxOTIga2VlcCBhcy1pcyAobm90aGluZyB0byBtYXNrKVxuICogICAtIDIgY2hhcnMgICAgXHUyMTkyIGtlZXAgZmlyc3QsIHJlcGxhY2Ugc2Vjb25kIHdpdGggTyAgICBcdTczOEJcdTY2MEUgXHUyMTkyIFx1NzM4Qk9cbiAqICAgLSAzKyBjaGFycyAgIFx1MjE5MiBrZWVwIGZpcnN0ICsgbGFzdCwgbWlkZGxlIGFsbCBPICAgICAgXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTY3OTdcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1Njc5N09PXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTRFMkRcdTVDRjZcdTUwNjVcdTZCMjFcdTkwQ0UgXHUyMTkyIFx1NEUyRE9PT1x1OTBDRVxuICpcbiAqIFdlc3Rlcm4gbmFtZXMgKGNvbnRhaW4gd2hpdGVzcGFjZSk6IHNwbGl0IG9uIHNwYWNlLCBrZWVwIGZpcnN0ICtcbiAqIGxhc3QgdG9rZW5zLCBwYXJ0aWFsLW1hc2sgdGhlIGxhc3QgYW5kIG1pZGRsZTpcbiAqICAgSm9obiBTbWl0aCBcdTIxOTIgSm9obiBTKioqXG4gKiAgIEpvaG4gUSBTbWl0aCBcdTIxOTIgSm9obiAqKiogU21pdGhcbiAqL1xuLyoqXG4gKiBIYWxmLW1hc2sgYSBUYWl3YW4gbmF0aW9uYWwgSUQgZm9yIHNob3VsZGVyLXN1cmZpbmctc2FmZSBkaXNwbGF5LlxuICogTWF0Y2hlcyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBJ3Mgb3duIGBoaWRgIGNvbnZlbnRpb24gKGZpcnN0IDYgdmlzaWJsZSwgbGFzdFxuICogNCBoaWRkZW4pOiBgUDEyMzQ1MDg2NmAgXHUyMTkyIGBQMTIzNDUqKioqYC5cbiAqXG4gKiBgY2hhcmAgZGVmYXVsdHMgdG8gYCpgIGZvciBwb3B1cC90b2FzdCBkaXNwbGF5LiBVc2UgYFhgIGZvciBmaWxlbmFtZXNcbiAqIHNpbmNlIGAqYCBpcyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIFRoZSBhdXRvLWdlbmVyYXRlZFxuICogYGF1dG8tWFhYWFhYWFhgIHBsYWNlaG9sZGVycyBmbG93IHRocm91Z2ggdW5jaGFuZ2VkIChhbHJlYWR5XG4gKiBub24taWRlbnRpZnlpbmcpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFza0lkKGlkOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjaGFyID0gXCIqXCIpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKGlkID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gcztcbiAgaWYgKC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChzKSkgcmV0dXJuIHMuc2xpY2UoMCwgNikgKyBjaGFyLnJlcGVhdCg0KTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gcztcbiAgaWYgKHMubGVuZ3RoID4gNikgcmV0dXJuIHMuc2xpY2UoMCwgMikgKyBjaGFyLnJlcGVhdChzLmxlbmd0aCAtIDQpICsgcy5zbGljZSgtMik7XG4gIHJldHVybiBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFza05hbWUobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSAobmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghdHJpbW1lZCB8fCB0cmltbWVkID09PSBcIlVua25vd25cIikgcmV0dXJuIHRyaW1tZWQ7XG5cbiAgaWYgKC9cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoL1xccysvKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSByZXR1cm4gcGFydHNbMF0hO1xuICAgIGNvbnN0IGZpcnN0ID0gcGFydHNbMF0hO1xuICAgIGNvbnN0IGxhc3QgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSE7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gRml4ZWQgMyBzdGFycyByZWdhcmRsZXNzIG9mIG9yaWdpbmFsIGxlbmd0aCBcdTIwMTQgZG9uJ3QgbGVhayBob3dcbiAgICAgIC8vIGxvbmcgdGhlIHN1cm5hbWUgd2FzIHZpYSBtYXNrIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxhc3RNYXNrZWQgPSBsYXN0Lmxlbmd0aCA8PSAxID8gbGFzdCA6IGAke2xhc3RbMF19KioqYDtcbiAgICAgIHJldHVybiBgJHtmaXJzdH0gJHtsYXN0TWFza2VkfWA7XG4gICAgfVxuICAgIGNvbnN0IG1pZGRsZXMgPSBwYXJ0cy5zbGljZSgxLCAtMSkubWFwKCgpID0+IFwiKioqXCIpO1xuICAgIHJldHVybiBbZmlyc3QsIC4uLm1pZGRsZXMsIGxhc3RdLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgLy8gQ0pLIC8gc2luZ2xlLXRva2VuIHBhdGguIEl0ZXJhdGUgY29kZXBvaW50cyAobm90IFVURi0xNiB1bml0cykgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyBjYW4ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKHRyaW1tZWQpO1xuICBpZiAoY2hhcnMubGVuZ3RoIDw9IDEpIHJldHVybiB0cmltbWVkO1xuICBpZiAoY2hhcnMubGVuZ3RoID09PSAyKSByZXR1cm4gYCR7Y2hhcnNbMF19T2A7XG4gIHJldHVybiBjaGFyc1swXSArIFwiT1wiLnJlcGVhdChjaGFycy5sZW5ndGggLSAyKSArIGNoYXJzW2NoYXJzLmxlbmd0aCAtIDFdO1xufVxuIiwgIi8qKlxuICogT2JzZXJ2YXRpb24gbWFwcGVyIFx1MjAxNCBzaW5nbGUtcm93IGFuZCBwYW5lbC1ncm91cGVkIHZhcmlhbnRzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9vYnNlcnZhdGlvbi5weWAgKDEyMTIgbGluZXMpLiBJbmNsdWRlczpcbiAqICAgLSBtYXBPYnNlcnZhdGlvbihyYXcsIHBhdGllbnRJZCkgXHUyMTkyIHNpbmdsZSBPYnNlcnZhdGlvblxuICogICAtIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQoaXRlbXMsIHBhdGllbnRJZCkgXHUyMTkyIERpYWdub3N0aWNSZXBvcnQgKyBPYnNlcnZhdGlvbnNcbiAqICAgLSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgXHUyMDE0IGNyb3NzLXBhZ2UgZGVkdXAga2V5XG4gKiAgIC0gZmluZExvaW5jLCBidWlsZENvZGluZ3MsIG1hcEludGVycHJldGF0aW9uLCBkZXJpdmVJbnRlcnByZXRhdGlvblxuICogICAtIGRlZHVwZUNyb3NzRm9ybWF0LCBjb21iaW5lQnBJdGVtcywgZ3JvdXBCeU9yZGVyQ29kZVxuICogICAtIGluZmVyU3BlY2ltZW5cbiAqXG4gKiBGdW5jdGlvbmFsIHBhcml0eSB3aXRoIHRoZSBQeXRob24gaW1wbGVtZW50YXRpb24gaXMgdGhlIGdvYWwuIEZpZWxkXG4gKiBvcmRlciBpbiB0aGUgZW1pdHRlZCByZXNvdXJjZXMgbWF5IGRpZmZlciAoSlMgb2JqZWN0IGxpdGVyYWwgb3JkZXIpXG4gKiBidXQgY29udGVudCBpcyBpZGVudGljYWwuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB7XG4gIERJU1BMQVlfRklSU1RfQ09ERVMsXG4gIExPSU5DX0RJU1BMQVksXG4gIExPSU5DX01BUCxcbiAgTkhJX1RPX0xPSU5DLFxuICBQQU5FTF9MT0lOQ19NQVAsXG59IGZyb20gXCIuL2xvaW5jLXRhYmxlc1wiO1xuaW1wb3J0IHtcbiAgdHlwZSBRdWFudGl0eSxcbiAgdHlwZSBSYW5nZUVudHJ5LFxuICBwYXJzZVJhbmdlLFxuICBwYXJzZVJhbmdlTXVsdGksXG4gIHRvVWN1bSxcbiAgdHJ5UGFyc2VRdWFudGl0eSxcbn0gZnJvbSBcIi4vcGFyc2Vyc1wiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW1hZ2luZyBkZXRlY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElNQUdJTkdfS0VZV09SRFM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgXCJ1bHRyYXNvdW5kXCIsXG4gIFwic29ub2dyYW1cIixcbiAgXCJzb25vZ3JhcGh5XCIsXG4gIFwiZWNob1wiLFxuICBcImN0IFwiLFxuICBcImN0L1wiLFxuICBcImN0LVwiLFxuICBcImNvbXB1dGVkIHRvbW9ncmFwaHlcIixcbiAgXCJtcmlcIixcbiAgXCJtYWduZXRpYyByZXNvbmFuY2VcIixcbiAgXCJ4LXJheVwiLFxuICBcInhyYXlcIixcbiAgXCJ4IHJheVwiLFxuICBcIm1hbW1vZ3JhcGh5XCIsXG4gIFwibWFtbW9cIixcbiAgXCJla2dcIixcbiAgXCJlY2dcIixcbiAgXCJlbGVjdHJvY2FyZGlvZ3JhbVwiLFxuICBcImVuZG9zY29wXCIsXG4gIFwiY29sb25vc2NvcFwiLFxuICBcImdhc3Ryb3Njb3BcIixcbiAgXCJicm9uY2hvc2NvcFwiLFxuICBcInBldC9jdFwiLFxuICBcInBldCBcIixcbiAgXCJzcGVjdFwiLFxuICBcIlx1NUY3MVx1NTBDRlwiLFxuICBcIlx1OEQ4NVx1OTdGM1x1NkNFMlwiLFxuICBcIlx1OTZGQlx1ODE2Nlx1NjVCN1x1NUM2NFwiLFxuICBcIlx1NjgzOFx1NzhDMVx1NTE3MVx1NjMyRlwiLFxuICBcIlx1NUZDM1x1OTZGQlx1NTcxNlwiLFxuICBcIlx1NTE2N1x1ODk5Nlx1OTNFMVwiLFxuICBcIlx1NEU3M1x1NjIzRlx1NjUxRFx1NUY3MVwiLFxuXTtcblxuZnVuY3Rpb24gbG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5OiBzdHJpbmcsIGNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBoYXlzdGFjayA9IGAke2Rpc3BsYXl9ICR7Y29kZX1gLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBJTUFHSU5HX0tFWVdPUkRTLnNvbWUoKGt3KSA9PiBoYXlzdGFjay5pbmNsdWRlcyhrdykpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTE9JTkMgbG9va3VwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBOSElfTEFCX0NPREVfUkUgPSAvXlxcZHs0LDZ9W0EtWl0kLztcblxuZnVuY3Rpb24gaXNBc2NpaU9ubHkoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgPiAxMjcpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuXG4vLyBDaGVjayB3aGV0aGVyIGEgc2luZ2xlIExPSU5DX01BUCBrZXkgbWF0Y2hlcyB0aGUgbGFiJ3MgY29tYmluZWRcbi8vIChjb2RlICsgZGlzcGxheSkgc3RyaW5nLiBUd28gcnVsZXM6XG4vL1xuLy8gMS4gQVNDSUkga2V5czogYFxcYjxrZXk+XFxiYCBcdTIwMTQgd29yZCBib3VuZGFyaWVzIG9uIEJPVEggc2lkZXMuIFRoZVxuLy8gICAgbm8tdHJhaWxpbmctYm91bmRhcnkgc2VtYW50aWMgb2YgdGhlIG9sZGVyIGBcXGI8a2V5PmAgbWF0Y2hlclxuLy8gICAgY2F1c2VkIHNob3J0IGtleXMgbGlrZSBcImhiXCIgKEhlbW9nbG9iaW4pIHRvIGluY29ycmVjdGx5IG1hdGNoXG4vLyAgICBsb25nZXIgdGVybXMgbGlrZSBcImhic2FnXCIgKEhCc0FnKSBhbmQgXCJwaG9zcGhhdGVcIiAobWF0Y2hlZCBieVxuLy8gICAgXCJwaFwiKS4gUmVxdWlyaW5nIGFuIGVuZCBib3VuZGFyeSBtZWFucyBcImhiXCIgb25seSBtYXRjaGVzIHdoZW5cbi8vICAgIGl0IHN0YW5kcyBhcyBpdHMgb3duIHdvcmQuXG4vL1xuLy8gMi4gQ0pLIC8gbm9uLUFTQ0lJIGtleXM6IHBsYWluIHN1YnN0cmluZyBpbmNsdWRlcygpLiBcXGIgZG9lc24ndFxuLy8gICAgc2VtYW50aWNhbGx5IHdvcmsgZm9yIENKSyAobm8gd29yZC1jaGFyYWN0ZXIgY2xhc3MgY29uY2VwdCkuXG5mdW5jdGlvbiBfa2V5d29yZE1hdGNoZXMoa2V5OiBzdHJpbmcsIGNvbWJpbmVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgayA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoayl9XFxcXGJgKS50ZXN0KGNvbWJpbmVkKTtcbiAgfVxuICByZXR1cm4gY29tYmluZWQuaW5jbHVkZXMoayk7XG59XG5cbi8vIFBpY2sgdGhlIExPTkdFU1QgbWF0Y2hpbmcga2V5IGZyb20gdGhlIHRhYmxlLCBub3QgdGhlIGZpcnN0LiBBdm9pZHNcbi8vIHRoZSBzYW1lIGJ1ZyBmYW1pbHkgZnJvbSBhIHNlY29uZCBhbmdsZTogaHlwaGVuYXRlZCBrZXlzIGxpa2Vcbi8vIFwibGRsLWNob2xlc3Rlcm9sXCIgc2hhcmUgYSBgXFxiLi4uXFxiYCBib3VuZGFyeSBhdCB0aGUgaHlwaGVuLCBzbyBcImxkbFwiXG4vLyAoMyBjaGFycykgYWxzbyBtYXRjaGVzIGEgXCJsZGwtY2hvbGVzdGVyb2xcIiBzdHJpbmcuIExvbmdlc3QtbWF0Y2hcbi8vIG1ha2VzIHRoZSBtb3JlIHNwZWNpZmljIGtleSB3aW4gcmVnYXJkbGVzcyBvZiBpbnNlcnRpb24gb3JkZXIsIHNvXG4vLyB0aGUgYnJpdHRsZSBcImxvbmcgbXVzdCBhcHBlYXIgYmVmb3JlIHNob3J0XCIgY29tbWVudHMgc2NhdHRlcmVkXG4vLyB0aHJvdWdoIExPSU5DX01BUCBiZWNvbWUgdW5uZWNlc3NhcnkuXG5mdW5jdGlvbiBfZmluZExvbmdlc3RNYXRjaChcbiAgY29tYmluZWQ6IHN0cmluZyxcbiAgdGFibGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgbGV0IGJlc3RMb2luYzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBiZXN0S2V5TGVuID0gMDtcbiAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXModGFibGUpKSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiBiZXN0S2V5TGVuICYmIF9rZXl3b3JkTWF0Y2hlcyhrZXksIGNvbWJpbmVkKSkge1xuICAgICAgYmVzdExvaW5jID0gbG9pbmM7XG4gICAgICBiZXN0S2V5TGVuID0ga2V5Lmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJlc3RMb2luYztcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJpbWFyeSBMT0lOQyBmb3IgdGhpcyBsYWIuIFBhbmVsLWF3YXJlIGxvb2t1cDpcbiAqICAgQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgXHUyMTkyIHVzZSBOSElfVE9fTE9JTkMgZGlyZWN0bHkuXG4gKiAgIEIuIFBhbmVsIGNvZGUgT1IgdW5rbm93biBjb2RlIFx1MjE5MiB3YWxrIExPSU5DX01BUCBieSBkaXNwbGF5IGtleXdvcmRcbiAqICAgICAgKGxvbmdlc3Qta2V5IG1hdGNoIHdpbnMsIGJvdGgtc2lkZSB3b3JkIGJvdW5kYXJpZXMgZW5mb3JjZWQpLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGNvbnN0IGhpdCA9IF9maW5kTG9uZ2VzdE1hdGNoKGNvbWJpbmVkLCBQQU5FTF9MT0lOQ19NQVBbY29kZV0hKTtcbiAgICBpZiAoaGl0KSByZXR1cm4gaGl0O1xuICB9XG5cbiAgLy8gQi4gRGlzcGxheS1rZXl3b3JkIHNlYXJjaC5cbiAgY29uc3QgaGl0ID0gX2ZpbmRMb25nZXN0TWF0Y2goY29tYmluZWQsIExPSU5DX01BUCk7XG4gIGlmIChoaXQpIHJldHVybiBoaXQ7XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIC8vIFNvdXJjZS1wcm9ncmFtbWUgdGFnIFx1MjAxNCBzZXQgd2hlbiB0aGUgYWRhcHRlciBwdWxsZWQgdGhpcyBvYnNlcnZhdGlvblxuICAvLyBvdXQgb2YgYSBzcGVjaWZpYyBOSEkgc2NyZWVuaW5nIHByb2dyYW1tZSAoZS5nLiBhZGFwdEFkdWx0UHJldmVudGl2ZVxuICAvLyBzZXRzIHNvdXJjZV9wcm9ncmFtPVwiYWR1bHQtcHJldmVudGl2ZVwiKS4gU3VyZmFjZWQgdmlhIE9ic2VydmF0aW9uLlxuICAvLyBtZXRhLnRhZyBzbyBkb3duc3RyZWFtIFNNQVJUIGFwcHMgY2FuIGZpbHRlciBieSBfdGFnIHdpdGhvdXQgbmVlZGluZ1xuICAvLyB0byBrbm93IGFib3V0IG91ciBpbnRlcm5hbCBmaWVsZCBuYW1lcy5cbiAgaWYgKHJhdy5zb3VyY2VfcHJvZ3JhbSkge1xuICAgIHJlc291cmNlLm1ldGEudGFnID0gW1xuICAgICAge1xuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL25oaS1maGlyLWJyaWRnZS9zb3VyY2UtcHJvZ3JhbVwiLFxuICAgICAgICBjb2RlOiBTdHJpbmcocmF3LnNvdXJjZV9wcm9ncmFtKSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQsIG1hc2tJZCwgbWFza05hbWUgfSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgREVGQVVMVF9CQUNLRU5EID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMTBcIjtcbi8vIERlZmF1bHQgU01BUlQgYXBwIGZvciBhIGZyZXNoIGluc3RhbGwuIFVzZXJzIGNhbiBvdmVycmlkZSB2aWFcbi8vIHRoZSAnXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgU01BUlQgQXBwIExhdW5jaCBVUkwnIGZpZWxkOyB0aGUgdmFsdWUgaXNcbi8vIHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlciBgc21hcnRBcHBMYXVuY2hVcmxgLlxuY29uc3QgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpci9zbWFydC9sYXVuY2hcIjtcblxuLy8gVHJ1ZSBpZiB0aGUgYWN0aXZlIHRhYiBpcyBhbiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHBhZ2UgKHJlYWwgc2l0ZSkuXG5mdW5jdGlvbiBpc05oaVRhYih1cmwpIHtcbiAgaWYgKCF1cmwpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IG5ldyBVUkwodXJsKSA6IHVybDtcbiAgICByZXR1cm4gL215aGVhbHRoYmFua1xcLm5oaVxcLmdvdlxcLnR3Ly50ZXN0KHUuaG9zdG5hbWUpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgREVGQVVMVF9NT0RFID0gXCJsb2NhbFwiO1xuXG5jb25zdCBlbHMgPSB7XG4gIG1vZGVSYWRpb3M6ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzeW5jLW1vZGVcIl0nKSxcbiAgYmFja2VuZFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXVybFwiKSxcbiAgc3luY0FwaUtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWFwaS1rZXlcIiksXG4gIHNtYXJ0QXBwVXJsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNtYXJ0LWFwcC11cmxcIiksXG4gIHN5bmNBcGlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGktYnRuXCIpLFxuICBzeW5jQmxvY2tlZFJlYXNvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWJsb2NrZWQtcmVhc29uXCIpLFxuICBhcGlTeW5jUmFuZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBpLXN5bmMtcmFuZ2VcIiksXG4gIHN0b3BCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIiksXG4gIG92TmFtZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1uYW1lXCIpLFxuICBvdkJpcnRoRGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1iaXJ0aC1kYXRlXCIpLFxuICBvdkdlbmRlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1nZW5kZXJcIiksXG4gIG92U2F2ZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1zYXZlLWJ0blwiKSxcbiAgb3ZDbGVhckJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1jbGVhci1idG5cIiksXG4gIG92U3VtbWFyeTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVycmlkZS1zdW1tYXJ5XCIpLFxuICBwYXRpZW50T3ZlcnJpZGVEZXRhaWxzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdGllbnQtb3ZlcnJpZGVcIiksXG4gIGxhdW5jaEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXVuY2gtYnRuXCIpLFxuICBzdGF0dXM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhdHVzXCIpLFxuICBkYXNoYm9hcmRMaW5rOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhc2hib2FyZC1saW5rXCIpLFxuICBwZW5kaW5nQnVuZGxlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBlbmRpbmctYnVuZGxlXCIpLFxuICBkb3dubG9hZEJ1bmRsZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkb3dubG9hZC1idW5kbGUtYnRuXCIpLFxuICBjbGVhckJ1bmRsZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbGVhci1idW5kbGUtYnRuXCIpLFxuICAvLyBidW5kbGVNZXRhIGxlZ2FjeSBpZCByZW1vdmVkIGluIHRoZSBwYW5lbC1tZXJnZTsgZmlsZW5hbWUrc2l6ZSBub3dcbiAgLy8gbGl2ZSBpbiBkZWRpY2F0ZWQgI2J1bmRsZS1maWxlbmFtZSAvICNidW5kbGUtc2l6ZWFnZSBlbGVtZW50c1xuICAvLyBiZWxvdy5cbiAgY29ubkJhbm5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLWJhbm5lclwiKSxcbiAgY29ublNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1zZWN0aW9uXCIpLFxuICBjb25uTWluaTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLW1pbmlcIiksXG4gIGNvbm5Nc2c6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1tc2dcIiksXG4gIGNvbm5SZXRyeUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLXJldHJ5LWJ0blwiKSxcbiAgY29ubkhlbHA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1oZWxwXCIpLFxuICBkYXRhU3RhdGVTZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGEtc3RhdGUtc2VjdGlvblwiKSxcbiAgYmFja2VuZFN0YXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhY2tlbmQtc3RhdGVcIiksXG4gIGxvY2FsU3RhdGVSb3c6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9jYWwtc3RhdGUtcm93XCIpLFxuICBsb2NhbFN0YXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvY2FsLXN0YXRlXCIpLFxuICBwdXNoTG9jYWxCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHVzaC1sb2NhbC1idG5cIiksXG4gIHN5bmNTdGF0dXNIaW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN5bmMtc3RhdHVzLWhpbnRcIiksXG4gIG1hc2tOYW1lRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXNrLW5hbWUtZW5hYmxlZFwiKSxcbiAgYmFja2VuZE1vZGVFbmFibGVkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhY2tlbmQtbW9kZS1lbmFibGVkXCIpLFxuICBvcGVuTmhpU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW5oaS1zZWN0aW9uXCIpLFxuICBvcGVuTmhpQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tbmhpLWJ0blwiKSxcbiAgbmhpTmVlZHNMb2dpblNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmhpLW5lZWRzLWxvZ2luLXNlY3Rpb25cIiksXG4gIG5oaVJlbG9hZEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuaGktcmVsb2FkLWJ0blwiKSxcbiAgbG9naW5Pa1NlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW4tb2stc2VjdGlvblwiKSxcbiAgd2l6YXJkU3RlcHBlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aXphcmQtc3RlcHBlclwiKSxcbiAgcmVzdWx0Wm9uZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHQtem9uZVwiKSxcbiAgYWN0aXZlUGF0aWVudDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY3RpdmUtcGF0aWVudFwiKSxcbiAgYWN0aXZlUGF0aWVudFZhbHVlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFjdGl2ZS1wYXRpZW50LXZhbHVlXCIpLFxuICBidW5kbGVNZXRhQmxvY2s6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVuZGxlLW1ldGEtYmxvY2tcIiksXG4gIGJ1bmRsZUZpbGVuYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1bmRsZS1maWxlbmFtZVwiKSxcbiAgYnVuZGxlU2l6ZWFnZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidW5kbGUtc2l6ZWFnZVwiKSxcbn07XG5cbmNvbnN0IE5ISV9MQU5ESU5HID0gXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3L0lIS0UzMDAwXCI7XG4vLyBEaXJlY3QgVVJMIG9mIHRoZSBsb2dpbiBwaWNrZXIgcGFnZSAoYSBnZW5lcmljIGxhbmRpbmcgXHUyMTkyIGxvZ2luIHJlZGlyZWN0XG4vLyBoYXBwZW5zIGF1dG9tYXRpY2FsbHkgZm9yIHVuYXV0aGVudGljYXRlZCB2aXNpdHMsIGJ1dCBnb2luZyBzdHJhaWdodFxuLy8gaGVyZSBhbHNvIGhhbmRsZXMgdXNlcnMgc2l0dGluZyBvbiBhIHB1YmxpYyBzdWItcGFnZSBsaWtlIFx1NTU0Rlx1N0I1NFx1NUMwOFx1NTM0MFxuLy8gd2hlcmUgYSBwbGFpbiByZWxvYWQgd291bGQganVzdCByZS1yZW5kZXIgdGhlIHNhbWUgdW4tYXV0aCBwYWdlKS5cbmNvbnN0IE5ISV9MT0dJTl9VUkwgPSBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHcvSUhLRTMwMDAvSUhLRTMwOTVTMDFcIjtcblxuY29uc3QgUEVORElOR19CVU5ETEVfS0VZID0gXCJwZW5kaW5nRmhpckJ1bmRsZVwiO1xuXG4vLyBQZXJzaXN0ZWQtc3RhdGUga2V5cy4gQmFja2VuZCBVUkwgYW5kIEFQSSBrZXkgcGVyc2lzdCBhY3Jvc3MgYnJvd3NlciBzZXNzaW9ucy5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRCYWNrZW5kVXJsKCkge1xuICBjb25zdCB7IGJhY2tlbmRVcmwsIHN5bmNBcGlLZXksIHNtYXJ0QXBwTGF1bmNoVXJsIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXG4gICAgW1wiYmFja2VuZFVybFwiLCBcInN5bmNBcGlLZXlcIiwgXCJzbWFydEFwcExhdW5jaFVybFwiXVxuICApO1xuICBlbHMuYmFja2VuZFVybC52YWx1ZSA9IGJhY2tlbmRVcmwgfHwgREVGQVVMVF9CQUNLRU5EO1xuICBlbHMuc3luY0FwaUtleS52YWx1ZSA9IHN5bmNBcGlLZXkgfHwgXCJcIjtcbiAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gc21hcnRBcHBMYXVuY2hVcmwgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGF0aWVudCBvdmVycmlkZSAobWFudWFsIE5ISSBpZGVudGl0eSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGRvZXNuJ3QgZXhwb3NlIHRoZSB1c2VyJ3MgbmF0aW9uYWwgSUQgaW4gdGhlIFVSTC4gVGhlIHVzZXJcbi8vIGZpbGxzIHRoZXNlIG9uY2UgYW5kIHRoZXkncmUgc2VudCB3aXRoIGV2ZXJ5IHVwbG9hZCBjYWxsIHVudGlsIGNsZWFyZWQuXG5cbi8vIGlkX25vIGlzIG5vIGxvbmdlciBhIFVJIGZpZWxkLCBzbyBnZXRQYXRpZW50T3ZlcnJpZGUoKSAoc3luYywgY2FsbGVkXG4vLyBpbiBtYW55IGhvdCBwYXRocykgY2FuJ3QgcmVhZCBpdCBmcm9tIHRoZSBmb3JtLiBDYWNoZSBpdCBoZXJlIGZyb21cbi8vIHN0b3JhZ2U7IGxvYWRQYXRpZW50T3ZlcnJpZGUgLyBzYXZlUGF0aWVudE92ZXJyaWRlIC8gY2xlYXIga2VlcCBpdFxuLy8gZnJlc2gsIGFuZCBhcHBseVN5bmNTdGF0dXMgcG9rZXMgaXQgd2hlbiBiYWNrZ3JvdW5kIHN3YXBzIHRoZVxuLy8gcGxhY2Vob2xkZXIgZm9yIHRoZSByZWFsIGNpZC5cbmxldCBfc3RvcmVkSWRObyA9IG51bGw7XG5cbi8vIE5ISSB0YWIgaWQsIGNhcHR1cmVkIGluIGluaXQoKSB3aGVuIHRoZSBhY3RpdmUgdGFiIGlzIHRoZSBOSEkgcGFnZS5cbi8vIFVzZWQgYnkgdGhlIFwiXHU5MUNEXHU2NUIwXHU2NTc0XHU3NDA2XHU5ODAxXHU5NzYyXCIgYnV0dG9uIGluIHRoZSBuZWVkcy1sb2dpbiBiYW5uZXIgc28gdGhlXG4vLyB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBrbm93IEY1IC8gc3dpdGNoIHRhYnMgdGhlbXNlbHZlcy5cbmxldCBfbmhpVGFiSWQgPSBudWxsO1xuXG5hc3luYyBmdW5jdGlvbiBsb2FkUGF0aWVudE92ZXJyaWRlKCkge1xuICBjb25zdCB7IHBhdGllbnRPdmVycmlkZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwicGF0aWVudE92ZXJyaWRlXCIpO1xuICBfc3RvcmVkSWRObyA9IHBhdGllbnRPdmVycmlkZT8uaWRfbm8gfHwgbnVsbDtcbiAgaWYgKHBhdGllbnRPdmVycmlkZSkge1xuICAgIGVscy5vdk5hbWUudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiO1xuICAgIGVscy5vdkJpcnRoRGF0ZS52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5iaXJ0aF9kYXRlIHx8IFwiXCI7XG4gICAgZWxzLm92R2VuZGVyLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmdlbmRlciB8fCBcIlwiO1xuICB9XG4gIC8vIEEgc3RvcmVkIG92ZXJyaWRlIHdpdGggYm90aCByZXF1aXJlZCBmaWVsZHMgY291bnRzIGFzIFwic3RlcCAyXG4gIC8vIGFscmVhZHkgY29uZmlybWVkXCIgXHUyMDE0IHJldHVybmluZyB1c2VyIHNob3VsZG4ndCBiZSBmb3JjZWQgdG8gY2xpY2tcbiAgLy8gXHUyNzEzIFx1NzhCQVx1NUI5QSBhZ2FpbiB0byBhZHZhbmNlIHRoZSB3aXphcmQuXG4gIF9tYXJrU3RlcDJDb25maXJtZWQoXG4gICAgISEocGF0aWVudE92ZXJyaWRlPy5nZW5kZXIgJiYgcGF0aWVudE92ZXJyaWRlPy5iaXJ0aF9kYXRlKSxcbiAgKTtcbiAgLy8gUGF0aWVudCBwYW5lbCBpcyBub3cgYWx3YXlzLWV4cGFuZGVkIChzdGVwIDIgb3ducyBpdHMgb3duIHBhZ2UpO1xuICAvLyB0aGUgcHJldmlvdXMgY29sbGFwc2Utd2hlbi1jb25maXJtZWQgYmVoYXZpb3VyIHdhcyBhIGxlZnRvdmVyIGZyb21cbiAgLy8gdGhlIHNpbmdsZS1zY3JvbGwgbGF5b3V0LlxuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG59XG5cbmZ1bmN0aW9uIGdldFBhdGllbnRPdmVycmlkZSgpIHtcbiAgLy8gUmV0dXJucyB7aWRfbm8sIG5hbWU/LCBiaXJ0aF9kYXRlPywgZ2VuZGVyP30uXG4gIC8vIGlkX25vIGNvbWVzIGZyb20gdGhlIHN0b3JhZ2UgY2FjaGUgKF9zdG9yZWRJZE5vKSBzaW5jZSBpdCdzIG5vXG4gIC8vIGxvbmdlciBhIFVJIGZpZWxkIFx1MjAxNCBpdCdzIGF1dG8tbWludGVkIGF0IHNhdmUgdGltZSBhbmQgcmVwbGFjZWRcbiAgLy8gd2l0aCB0aGUgcmVhbCBjaWQgYnkgYmFja2dyb3VuZCdzIE5ISSBmZXRjaCBvbiBmaXJzdCBzeW5jLlxuICAvLyBSZXR1cm5zIG51bGwgd2hlbiBub3RoaW5nIGlkZW50aWZ5aW5nIGlzIGZpbGxlZC5cbiAgY29uc3QgbmFtZSA9IGVscy5vdk5hbWUudmFsdWUudHJpbSgpO1xuICBjb25zdCBiaXJ0aF9kYXRlID0gZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgZ2VuZGVyID0gZWxzLm92R2VuZGVyLnZhbHVlO1xuICBpZiAoIV9zdG9yZWRJZE5vICYmICFuYW1lICYmICFiaXJ0aF9kYXRlICYmICFnZW5kZXIpIHJldHVybiBudWxsO1xuICBjb25zdCBvdXQgPSB7fTtcbiAgaWYgKF9zdG9yZWRJZE5vKSBvdXQuaWRfbm8gPSBfc3RvcmVkSWRObztcbiAgaWYgKG5hbWUpIG91dC5uYW1lID0gbmFtZTtcbiAgaWYgKGJpcnRoX2RhdGUpIG91dC5iaXJ0aF9kYXRlID0gYmlydGhfZGF0ZTtcbiAgaWYgKGdlbmRlcikgb3V0LmdlbmRlciA9IGdlbmRlcjtcbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB0aGUgcGF0aWVudCBjYXJkJ3MgYmlydGgtZGF0ZSBpbnB1dC4gUmV0dXJucyBudWxsIHdoZW4gT0ssXG4gKiBvdGhlcndpc2UgYSB1c2VyLWZhY2luZyBlcnJvciBzdHJpbmcuIFJlYWRzIGRpcmVjdGx5IGZyb20gdGhlXG4gKiA8aW5wdXQgdHlwZT1cImRhdGVcIj4gc28gd2UgY2FuIGRldGVjdCBwYXJ0aWFsLWlucHV0IHN0YXRlcyB0aGF0XG4gKiBDaHJvbWUgcmVwb3J0cyB0aHJvdWdoIGB2YWxpZGl0eS5iYWRJbnB1dGAgKHRoZSBpbnB1dCdzIGAudmFsdWVgXG4gKiBpcyBcIlwiIGluIHRoYXQgY2FzZSwgaW5kaXN0aW5ndWlzaGFibGUgZnJvbSBcImJsYW5rXCIgYnkgc3RyaW5nIGNoZWNrXG4gKiBhbG9uZSBcdTIwMTQgdGhhdCdzIHdoeSB0aGUgb2xkIHZlcnNpb24gb2YgdGhpcyBmdW5jdGlvbiBsZXQgcGFydGlhbFxuICogeWVhci1vbmx5IGVudHJpZXMgc2xpcCB0aHJvdWdoKS5cbiAqXG4gKiBBbGxvd2VkIHN0YXRlczpcbiAqICAgLSBnZW51aW5lbHkgZW1wdHkgKHRoZSBmaWVsZCBpcyBvcHRpb25hbClcbiAqICAgLSBmdWxsIElTTyBZWVlZLU1NLUREIHRoYXQgcm91bmQtdHJpcHMgdGhyb3VnaCBEYXRlKClcbiAqIFJlamVjdGVkOlxuICogICAtIHllYXItb25seSAvIHllYXIrbW9udGg6IHRoZSBpbnB1dCByZW5kZXJzIGJsYW5rIHZhbHVlIGJ1dFxuICogICAgIHZhbGlkaXR5LmJhZElucHV0IGlzIHRydWVcbiAqICAgLSBkYXRlcyBpbiB0aGUgZnV0dXJlXG4gKiAgIC0gaW1wbGF1c2libHkgb2xkIGRhdGVzICh5ZWFyIDwgMTkwMClcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVCaXJ0aERhdGUoKSB7XG4gIGNvbnN0IGVsID0gZWxzLm92QmlydGhEYXRlO1xuICBpZiAoIWVsKSByZXR1cm4gbnVsbDtcbiAgLy8gQ2hyb21lJ3MgbmF0aXZlIGRhdGUgaW5wdXQ6IHBhcnRpYWwgZW50cnkgKGp1c3QgeWVhciwganVzdCB5eXl5LW1tKVxuICAvLyBzdXJmYWNlcyBoZXJlIGV2ZW4gdGhvdWdoIC52YWx1ZSBpcyBcIlwiLlxuICBpZiAoZWwudmFsaWRpdHkgJiYgZWwudmFsaWRpdHkuYmFkSW5wdXQpIHtcbiAgICByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdThBQ0JcdTU4NkJcdTVCOENcdTY1NzRcdTVFNzRcdTY3MDhcdTY1RTVcIjtcbiAgfVxuICBjb25zdCBzID0gKGVsLnZhbHVlIHx8IFwiXCIpLnRyaW0oKTtcbiAgLy8gQmlydGggZGF0ZSBpcyBub3cgcmVxdWlyZWQgXHUyMDE0IGFnZSBhZmZlY3RzIGV2ZXJ5IHJlZmVyZW5jZSByYW5nZVxuICAvLyBhbmQgYW55IGRvd25zdHJlYW0gYWdlLWJhc2VkIFVJOyBlbXB0eSBpbnB1dCBsZXRzIGEgdHlwbyAvIGJyb3dzZXJcbiAgLy8gcXVpcmsgc2lsZW50bHkgcHJvcGFnYXRlIGFzIE5hTi5cbiAgaWYgKCFzKSByZXR1cm4gXCJcdThBQ0JcdTU4NkJcdTc1MUZcdTY1RTVcIjtcbiAgaWYgKCEvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC8udGVzdChzKSkgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU4QUNCXHU1ODZCXHU1QjhDXHU2NTc0XHU1RTc0XHU2NzA4XHU2NUU1XCI7XG4gIGNvbnN0IFt5LCBtLCBkXSA9IHMuc3BsaXQoXCItXCIpLm1hcChOdW1iZXIpO1xuICBjb25zdCBkdCA9IG5ldyBEYXRlKHMgKyBcIlQwMDowMDowMFpcIik7XG4gIGlmIChcbiAgICBOdW1iZXIuaXNOYU4oZHQuZ2V0VGltZSgpKSB8fFxuICAgIGR0LmdldFVUQ0Z1bGxZZWFyKCkgIT09IHkgfHxcbiAgICBkdC5nZXRVVENNb250aCgpICsgMSAhPT0gbSB8fFxuICAgIGR0LmdldFVUQ0RhdGUoKSAhPT0gZFxuICApIHtcbiAgICByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdTRFMERcdTY2MkZcdTY3MDlcdTY1NDhcdTY1RTVcdTY3MUZcIjtcbiAgfVxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBpZiAoZHQuZ2V0VGltZSgpID4gbm93LmdldFRpbWUoKSkgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU0RTBEXHU4MEZEXHU2NjJGXHU2NzJBXHU0Rjg2XCI7XG4gIGlmICh5IDwgMTkwMCkgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU1RTc0XHU0RUZEXHU1OTJBXHU2NUU5XHVGRjBDXHU4QUNCXHU3OEJBXHU4QThEXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBSYW5kb20gXCJhdXRvLVhYWFhYWFhYXCIgXHUyMDE0IDggaGV4IGNoYXJzIGZyb20gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyBzb1xuLy8gZXZlcnkgZnJlc2ggcG9wdXAgaW5zdGFsbCBnZXRzIGEgZGlmZmVyZW50IElEIGFuZCByZS1zeW5jcyBhcmUgc3RhYmxlLlxuZnVuY3Rpb24gX2dlbmVyYXRlQXV0b1BhdGllbnRJZCgpIHtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gIGNvbnN0IGhleCA9IEFycmF5LmZyb20oYnl0ZXMsIChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpLmpvaW4oXCJcIik7XG4gIHJldHVybiBgYXV0by0ke2hleH1gO1xufVxuXG4vLyBGb3JtYXQgaWRfbm8gZm9yIGRpc3BsYXkuIFJlYWwgTkhJIGNpZHMgKFAxMjM0NTA4NjYgXHUyMTkyIFAxMjM0NSoqKiopXG4vLyBnZXQgc2hvd24gaGFsZi1tYXNrZWQgc28gdGhlIHVzZXIgaGFzIHZpc3VhbCBjb25maXJtYXRpb24gd2Vcbi8vIGNhcHR1cmVkIHRoZWlyIHJlYWwgaWRlbnRpdHkuIFRoZSBpbnRlcm5hbCBhdXRvLVhYWFhYWFhYIHBsYWNlaG9sZGVyXG4vLyBpcyBoaWRkZW4gXHUyMDE0IGl0J3MgYSBzeXN0ZW0tZ2VuZXJhdGVkIHN0cmluZyB0aGF0IG1lYW5zIG5vdGhpbmcgdG9cbi8vIHRoZSB1c2VyIGFuZCBqdXN0IGNyZWF0ZXMgXCJ3aGF0J3MgdGhhdCBnaWJiZXJpc2g/XCIgZnJpY3Rpb24gdW50aWxcbi8vIHRoZSByZWFsIGNpZCBhcnJpdmVzIHZpYSBiYWNrZ3JvdW5kJ3MgTkhJIGZldGNoIG9uIGZpcnN0IHN5bmMuXG5mdW5jdGlvbiBfZGlzcGxheUlkKGlkTm8pIHtcbiAgaWYgKCFpZE5vIHx8IGlkTm8uc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gXCJcIjtcbiAgcmV0dXJuIG1hc2tJZChpZE5vKTtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgY2FyZCA9IGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzO1xuICBsZXQgc3VtbWFyeVRleHQgPSBcIlwiO1xuICBpZiAoIW92IHx8ICFvdi5uYW1lKSB7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2NzJBXHU4QTJEXHU1QjlBXCI7XG4gICAgaWYgKGNhcmQpIGNhcmQuZGF0YXNldC5zdGF0ZSA9IFwiZW1wdHlcIjtcbiAgfSBlbHNlIHtcbiAgICAvLyBOYW1lIChtYXNrIHRvZ2dsZTogXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4IFx1OTgxMFx1OEEyRFx1OTVEQyA9IFx1NzcxRlx1NTQwRCAvIG11bHRpLXBhdGllbnQgZGVtb1xuICAgIC8vIFx1OTU4Qlx1NTU1RiA9IFx1OTA2RVx1N0Y2OSkgKyBtYXNrZWQgcmVhbCBjaWQgd2hlbiBhdmFpbGFibGUuIEF1dG8tcGxhY2Vob2xkZXJcbiAgICAvLyBpcyBzdXBwcmVzc2VkIHZpYSBfZGlzcGxheUlkLlxuICAgIGNvbnN0IHBhcnRzID0gW19tYXliZU1hc2sob3YubmFtZSldO1xuICAgIGNvbnN0IGlkTGFiZWwgPSBfZGlzcGxheUlkKG92LmlkX25vKTtcbiAgICBpZiAoaWRMYWJlbCkgcGFydHMucHVzaChpZExhYmVsKTtcbiAgICBzdW1tYXJ5VGV4dCA9IHBhcnRzLmpvaW4oXCIgIFx1MDBCNyAgXCIpO1xuICAgIGVscy5vdlN1bW1hcnkudGV4dENvbnRlbnQgPSBgXHUyNzEzICR7c3VtbWFyeVRleHR9YDtcbiAgICBpZiAoY2FyZCkgY2FyZC5kYXRhc2V0LnN0YXRlID0gXCJmaWxsZWRcIjtcbiAgfVxuICAvLyBNaXJyb3Igb250byBzdGVwIDMncyBcIlx1NTNENlx1NUY5N1x1NUMwRFx1OEM2MVwiIGJhbm5lciBzbyB0aGUgdXNlciBrbm93cyB3aG9cbiAgLy8gdGhleSdyZSBhYm91dCB0byBmZXRjaCB3aXRob3V0IHNjcm9sbGluZyBiYWNrIHRvIHN0ZXAgMi4gT25seVxuICAvLyB3aGVuIHN0ZXAgMiBoYXMgYmVlbiBjb25maXJtZWQgKHdoaWNoIG5vdyBpbXBsaWVzIGEgc2F2ZWQgbmFtZSkuXG4gIGlmIChlbHMuYWN0aXZlUGF0aWVudCAmJiBlbHMuYWN0aXZlUGF0aWVudFZhbHVlKSB7XG4gICAgY29uc3Qgc2hvd0FjdGl2ZSA9IF9zdGVwMkNvbmZpcm1lZCAmJiAhIXN1bW1hcnlUZXh0O1xuICAgIGVscy5hY3RpdmVQYXRpZW50LmhpZGRlbiA9ICFzaG93QWN0aXZlO1xuICAgIGlmIChzaG93QWN0aXZlKSBlbHMuYWN0aXZlUGF0aWVudFZhbHVlLnRleHRDb250ZW50ID0gc3VtbWFyeVRleHQ7XG4gIH1cbiAgLy8gQm90aCBsYXVuY2ggKyBzeW5jIGVuYWJsZWQgc3RhdGUgZGVwZW5kIG9uIHBhdGllbnQgKyBtb2RlICsgY29ubi5cbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgLy8gQ2hhbmdpbmcgcGF0aWVudCBJRCBpbnZhbGlkYXRlczogKGEpIGJhY2tlbmQtc3RhdGUgY2FjaGUgKG5ld1xuICAvLyBwYXRpZW50IG1pZ2h0IG5vdCBiZSBvbiBiYWNrZW5kKTsgKGIpIGxvY2FsLWJ1bmRsZSByb3cgaW4gdGhlXG4gIC8vIGRhdGEtc3RhdGUgY2FyZDsgKGMpIHRoZSBcdUQ4M0RcdURDRTUgZG93bmxvYWQgYnVuZGxlIHNlY3Rpb24sIHdoaWNoIHdvdWxkXG4gIC8vIG90aGVyd2lzZSBzdGlsbCBzaG93IHRoZSBwcmV2aW91cyBwYXRpZW50J3Mgc3Rhc2hlZCBmaWxlOyAoZClcbiAgLy8gdGhlIGxhc3QgY29tcGxldGVkIHN5bmMncyBzdWNjZXNzIG1lc3NhZ2UsIHdoaWNoIHdhcyB0YWdnZWQgZm9yXG4gIC8vIHRoZSBwcmV2aW91cyBwYXRpZW50LlxuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG4gIF9jbGVhclN0YWxlU3luY1N0YXR1cyhnZXRQYXRpZW50T3ZlcnJpZGUoKSk7XG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBfY29ublN0YXRlID09PSBcIm9rXCIpIGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbn1cblxuLy8gRHJvcCBhIFwiXHUyNzA1IFx1NTQwQ1x1NkI2NVx1NUI4Q1x1NjIxMCBcdTIwMjZcIiBzdGF0dXMgYmFubmVyIHRoYXQgd2FzIHJlY29yZGVkIGZvciBhXG4vLyBkaWZmZXJlbnQgcGF0aWVudC4gTWlkLWZsaWdodCBzeW5jcyBhcmUgbGVmdCBhbG9uZSAoc3RhdHVzLnJ1bm5pbmcpXG4vLyBzbyB0aGUgdXNlciBjYW4gc3RpbGwgc2VlIHByb2dyZXNzIG9mIHRoZSBpbi1mbGlnaHQgc3luYy5cbmZ1bmN0aW9uIF9jbGVhclN0YWxlU3luY1N0YXR1cyhvdikge1xuICBpZiAoIV9sYXRlc3RTdGF0dXMpIHJldHVybjtcbiAgaWYgKF9sYXRlc3RTdGF0dXMucnVubmluZykgcmV0dXJuO1xuICBpZiAoIV9sYXRlc3RTdGF0dXMuaGlzdG5vKSByZXR1cm47XG4gIGlmIChvdj8uaWRfbm8gPT09IF9sYXRlc3RTdGF0dXMuaGlzdG5vKSByZXR1cm47XG4gIF9sYXRlc3RTdGF0dXMgPSBudWxsO1xuICBzZXRTdGF0dXMoXCJcIiwgbnVsbCk7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInN5bmNTdGF0dXNcIikuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzYXZlUGF0aWVudE92ZXJyaWRlKCkge1xuICAvLyBHZW5kZXIgKyBiaXJ0aF9kYXRlICsgbmFtZSBhcmUgcmVxdWlyZWQuIGlkX25vIGlzIHRoZSBvbmx5IG9wdGlvbmFsXG4gIC8vIGZpZWxkIFx1MjAxNCBpdCdzIGF1dG8tZmV0Y2hlZCBmcm9tIE5ISSBvbiBzeW5jLCBuZXZlciB1c2VyLWVudGVyZWQuXG4gIGlmICghZWxzLm92R2VuZGVyLnZhbHVlKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1OEFDQlx1OTA3OFx1NjRDN1x1NjAyN1x1NTIyNVwiLCBcImVycm9yXCIpO1xuICAgIGVscy5vdkdlbmRlci5mb2N1cygpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBkb2JFcnJvciA9IHZhbGlkYXRlQmlydGhEYXRlKCk7XG4gIGlmIChkb2JFcnJvcikge1xuICAgIHNldFN0YXR1cyhgXHUyNkQ0ICR7ZG9iRXJyb3J9YCwgXCJlcnJvclwiKTtcbiAgICBlbHMub3ZCaXJ0aERhdGUuZm9jdXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFlbHMub3ZOYW1lLnZhbHVlLnRyaW0oKSkge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdThBQ0JcdTU4NkJcdTVCRUJcdTU5RDNcdTU0MERcIiwgXCJlcnJvclwiKTtcbiAgICBlbHMub3ZOYW1lLmZvY3VzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIEJ1aWxkIHRoZSBvdmVycmlkZSBkaXJlY3RseSBzbyB3ZSBkb24ndCBkZXBlbmQgb25cbiAgLy8gZ2V0UGF0aWVudE92ZXJyaWRlJ3MgbnVsbC1yZXR1cm4gXHUyMDE0IHRoZSByZXF1aXJlZC1maWVsZCBwYXRoIGFib3ZlXG4gIC8vIGhhcyBhbHJlYWR5IHZhbGlkYXRlZCB3aGF0IG1hdHRlcnMuXG4gIGNvbnN0IG92ID0ge1xuICAgIG5hbWU6IGVscy5vdk5hbWUudmFsdWUudHJpbSgpIHx8IG51bGwsXG4gICAgYmlydGhfZGF0ZTogZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKSxcbiAgICBnZW5kZXI6IGVscy5vdkdlbmRlci52YWx1ZSxcbiAgfTtcbiAgaWYgKCFvdi5uYW1lKSBkZWxldGUgb3YubmFtZTtcbiAgLy8gaWRfbm8gaXMgbm8gbG9uZ2VyIGEgVUkgZmllbGQuIFJldXNlIHRoZSBwcmV2aW91c2x5IHN0b3JlZFxuICAvLyBwbGFjZWhvbGRlciBpZiBvbmUgZXhpc3RzIChzbyByZS1zYXZlcyBkb24ndCBrZWVwIG1pbnRpbmcgbmV3IElEc1xuICAvLyBhbmQgb3JwaGFuaW5nIGJhY2tlbmQgcmVzb3VyY2VzIGtleWVkIG9uIHRoZSBvbGQgb25lKTsgb3RoZXJ3aXNlXG4gIC8vIG1pbnQgYSBmcmVzaCBhdXRvLVhYWFguIGJhY2tncm91bmQncyBOSEkgZmV0Y2ggc3dhcHMgdGhpcyBmb3IgdGhlXG4gIC8vIHJlYWwgY2lkIG9uIGZpcnN0IHN5bmMuXG4gIC8vXG4gIC8vIFRoZSBzYW1lIHJlYWQgYWxzbyBmZWVkcyB0aGUgaWRlbnRpdHktc3dpdGNoIGRldGVjdGlvbiBiZWxvdy5cbiAgY29uc3QgcHJldlN0b3JlZCA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJwYXRpZW50T3ZlcnJpZGVcIikpXG4gICAgLnBhdGllbnRPdmVycmlkZTtcbiAgb3YuaWRfbm8gPSBwcmV2U3RvcmVkPy5pZF9ubyB8fCBfZ2VuZXJhdGVBdXRvUGF0aWVudElkKCk7XG4gIF9zdG9yZWRJZE5vID0gb3YuaWRfbm87XG5cbiAgY29uc3QgcGF0aWVudENoYW5nZWQgPVxuICAgIHByZXZTdG9yZWQ/LmlkX25vICYmIG92LmlkX25vICYmIHByZXZTdG9yZWQuaWRfbm8gIT09IG92LmlkX25vO1xuXG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHBhdGllbnRPdmVycmlkZTogb3YgfSk7XG5cbiAgaWYgKHBhdGllbnRDaGFuZ2VkKSB7XG4gICAgLy8gMS4gZHJvcCB0aGUgcHJpb3IgbG9jYWwgRkhJUiBidW5kbGUgKGRvd25sb2FkIGJ1dHRvbiBjb250ZW50KVxuICAgIC8vIDIuIGRyb3AgdGhlIFNXJ3MgbGFzdCBzeW5jIHN0YXR1cyBzbyB0aGUgcmVzdWx0IHpvbmUgZG9lc24ndFxuICAgIC8vICAgIGtlZXAgc2hvd2luZyBcIlx1MjcwNSBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTAgXHUwMEI3IEEgXHU3Njg0IDgxIFx1N0I0Nlx1MjAyNlwiXG4gICAgLy8gMy4gZHJvcCB0aGUgaW4tcG9wdXAgbGF0ZXN0LXN0YXR1cyBzbmFwc2hvdFxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICBhd2FpdCBjaHJvbWUucnVudGltZVxuICAgICAgLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJjbGVhclN5bmNTdGF0dXNcIiB9KVxuICAgICAgLmNhdGNoKCgpID0+IHt9KTtcbiAgICBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbiAgICBzZXRTdGF0dXMoXCJcIiwgbnVsbCk7XG4gIH1cblxuICBfbWFya1N0ZXAyQ29uZmlybWVkKHRydWUpO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIFN1Y2Nlc3NmdWwgc2F2ZSBpcyBUSEUgaW50ZW50aW9uYWwgc3RlcC0yIGNvbXBsZXRpb24gZXZlbnQgXHUyMDE0IHRoaXNcbiAgLy8gaXMgd2hlcmUgdGhlIHdpemFyZCBpcyBhbGxvd2VkIHRvIGFkdmFuY2UgZm9yd2FyZC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX21heWJlQXV0b0FkdmFuY2UoKTtcbiAgLy8gTWFrZSBjbGVhciB0aGlzIGlzIHRoZSBpZGVudGl0eSBzYXZlLCBub3QgYSBtZWRpY2FsLXJlY29yZCBzeW5jIFx1MjAxNFxuICAvLyBcdTMwMENcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcdTMwMERhbG9uZSByZWFkcyBhcyBcInBhdGllbnQgZGF0YVwiIChtZWRpY2FsKSBmb3Igc29tZSB1c2Vycy5cbiAgLy8gX2Rpc3BsYXlJZCBzdXBwcmVzc2VzIHRoZSBhdXRvLVhYWFggcGxhY2Vob2xkZXIgKG5vIHZhbHVlIHRvIHRoZVxuICAvLyB1c2VyKSBidXQga2VlcHMgdGhlIG1hc2tlZCByZWFsIGNpZCAoUDEyMzQ1KioqKikgd2hlbiBpdCdzXG4gIC8vIGF2YWlsYWJsZSBcdTIwMTQgY29uZmlybXMgd2UgY2FwdHVyZWQgdGhlaXIgYWN0dWFsIGlkZW50aXR5LlxuICBjb25zdCBpZExhYmVsID0gX2Rpc3BsYXlJZChvdi5pZF9ubyk7XG4gIGNvbnN0IHRhaWwgPSBpZExhYmVsID8gYCBcdTAwQjcgJHtpZExhYmVsfWAgOiBcIlwiO1xuICBzZXRTdGF0dXMoYFx1MjcwNSBcdTc1QzVcdTRFQkFcdThFQUJcdTRFRkRcdTVERjJcdThBMThcdTRGNEZcdUZGMUEke19tYXliZU1hc2sob3YubmFtZSl9JHt0YWlsfWAsIFwic3VjY2Vzc1wiKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInBhdGllbnRPdmVycmlkZVwiKTtcbiAgX3N0b3JlZElkTm8gPSBudWxsO1xuICBlbHMub3ZOYW1lLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92QmlydGhEYXRlLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92R2VuZGVyLnZhbHVlID0gXCJcIjtcbiAgX21hcmtTdGVwMkNvbmZpcm1lZChmYWxzZSk7XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgc2V0U3RhdHVzKFwiXHU1REYyXHU2RTA1XHU5NjY0XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCIsIFwiaW5mb1wiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgY29ubmVjdGlvbiBzdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBTaW5nbGUgc291cmNlIG9mIHRydXRoOiBgX2Nvbm5TdGF0ZWAgcmVmbGVjdHMgdGhlIGxhdGVzdCBiYWNrZW5kXG4vLyBjb25uZWN0aXZpdHkgY2hlY2suIEJvdGggdGhlIGJhbm5lciBVSSBhbmQgdGhlIGVuYWJsZWQtc3RhdGUgb2YgdGhlXG4vLyBcdUQ4M0RcdURDRTUgU3luYyAvIFx1RDgzRFx1REU4MCBMYXVuY2ggYnV0dG9ucyByZWFkIGZyb20gaXQuXG4vL1xuLy8gU3RhdGVzOlxuLy8gICBcInVua25vd25cIiAgXHUyMDE0IG5vdCB5ZXQgY2hlY2tlZCAoZS5nLiBmaXJzdCBwYWludCBpbiBsb2NhbCBtb2RlKVxuLy8gICBcImNoZWNraW5nXCIgXHUyMDE0IGZldGNoIGluIGZsaWdodFxuLy8gICBcIm9rXCIgICAgICAgXHUyMDE0IEdFVCAvZmhpci9tZXRhZGF0YSByZXR1cm5lZCBhIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFxuLy8gICBcImZhaWxcIiAgICAgXHUyMDE0IGFueXRoaW5nIGVsc2U7IGBfY29ubkZhaWxSZWFzb25gIGNhcnJpZXMgZGV0YWlsXG4vL1xuLy8gQmFja2VuZCBjb25uZWN0aXZpdHkgaXMgdHJlYXRlZCBhcyBhICpwcmVyZXF1aXNpdGUqIGZvciBiYWNrZW5kIG1vZGUsXG4vLyBub3QgYXMgYSBwZXItYWN0aW9uIGNoZWNrLiBTd2l0Y2hpbmcgdG8gYmFja2VuZCBtb2RlIHRyaWdnZXJzIGEgdGVzdFxuLy8gaW1tZWRpYXRlbHk7IGZhaWx1cmUgc2hvd3MgYSBiYW5uZXIgd2l0aCBhY3Rpb25hYmxlIGd1aWRhbmNlIGFuZFxuLy8gZGlzYWJsZXMgYm90aCBhY3Rpb24gYnV0dG9ucyB1bnRpbCBjb25uZWN0aXZpdHkgcmVjb3ZlcnMuXG5cbmxldCBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7XG5sZXQgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDsgLy8geyBraW5kOiBcIm5vLXBlcm1pc3Npb25cIiB8IFwibm8tdXJsXCIgfCBcIm5ldHdvcmtcIiB8IFwidGltZW91dFwiIHwgXCJodHRwXCIgfCBcIm5vdC1maGlyXCIsIGRldGFpbD8gfVxuXG4vLyBCYW5uZXIgY29weS4gRHJvcCB0aGUgbGVhZGluZyBcdTI3MTcgXHUyMDE0IHRoZSByZWQgZG90IGxlZnQgb2YgdGhlIHRleHQgaXNcbi8vIGFscmVhZHkgdGhlIFwiZmFpbFwiIHNpZ25hbCwgYW5kIHRoZSByb3cgd2FzIHJlYWRpbmcgXCJcdTI1Q0YgXHUyNzE3IFx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiXG4vLyA9IHRocmVlIGluZGljYXRvcnMgc3RhY2tlZC5cbmNvbnN0IF9DT05OX0xBQkVMUyA9IHtcbiAgdW5rbm93bjogXCJcdTY3MkFcdTZBQTJcdTZFMkNcIixcbiAgY2hlY2tpbmc6IFwiXHU2QUEyXHU2RTJDXHU0RTJEXHUyMDI2XCIsXG4gIG9rOiAoKSA9PiBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gLFxuICBmYWlsOiAoKSA9PiB7XG4gICAgY29uc3QgciA9IF9jb25uRmFpbFJlYXNvbiB8fCB7fTtcbiAgICByZXR1cm4gKHtcbiAgICAgIFwibm8tdXJsXCI6IFwiXHU2NzJBXHU4QTJEXHU1QjlBIEJhY2tlbmQgVVJMXCIsXG4gICAgICBcIm5vLXBlcm1pc3Npb25cIjogXCJcdTY3MkFcdTYzODhcdTZCMEFcdTkwMjNcdTdEREFcIixcbiAgICAgIFwibmV0d29ya1wiOiBcIlx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiLFxuICAgICAgXCJ0aW1lb3V0XCI6IFwiXHU5MDIzXHU3RERBXHU5MDNFXHU2NjQyXCIsXG4gICAgICBcImh0dHBcIjogYEhUVFAgJHtyLmRldGFpbCB8fCBcIlwifWAudHJpbSgpLFxuICAgICAgXCJub3QtZmhpclwiOiBcIlx1NTZERVx1NjFDOVx1NEUwRFx1NjYyRiBGSElSXCIsXG4gICAgfSlbci5raW5kXSA/PyBcIlx1OTAyM1x1N0REQVx1NTkzMVx1NjU1N1wiO1xuICB9LFxufTtcblxuY29uc3QgX0NPTk5fSEVMUCA9IHtcbiAgXCJuby11cmxcIjogICAgICAgIFwiXHU4QUNCXHU1MjMwXHUzMDBDXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBXHUzMDBEXHU1ODZCXHU1MTY1IEJhY2tlbmQgVVJMXHVGRjBDXHU0RjhCXHU1OTgyIDxjb2RlPmh0dHA6Ly9sb2NhbGhvc3Q6ODAxMDwvY29kZT5cdTMwMDJcIixcbiAgXCJuby1wZXJtaXNzaW9uXCI6IFwiQ2hyb21lIFx1OTYzQlx1NjRDQlx1NEU4Nlx1OERFOFx1NEY4Nlx1NkU5MFx1OEFDQlx1NkM0Mlx1MzAwMlx1OEFDQlx1OTFDRFx1NjVCMFx1OTU4QiBwb3B1cFx1RkYwQ1x1NzU3Nlx1NkIwQVx1OTY1MFx1NUMwRFx1OEE3MVx1Njg0Nlx1OERGM1x1NTFGQVx1NjY0Mlx1NjMwOVx1MzAwQ1x1NTE0MVx1OEEzMVx1MzAwRFx1MzAwMlwiLFxuICBcIm5ldHdvcmtcIjogICAgICAgXCJcdTVGOENcdTdBRUZcdTUzRUZcdTgwRkRcdTkwODRcdTZDOTJcdTU1NUZcdTUyRDVcdTMwMDJcdThBQ0JcdTU3RjdcdTg4NENcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgdXAgLWQ8L2NvZGU+PGJyPlx1NzhCQVx1OEE4RCBiYWNrZW5kIFx1NUJCOVx1NTY2OFx1OEREMVx1OEQ3N1x1NEY4Nlx1NTE4RFx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcInRpbWVvdXRcIjogICAgICAgXCI1IFx1NzlEMlx1NTE2N1x1NkM5Mlx1NjUzNlx1NTIzMFx1NTZERVx1NjFDOSBcdTIwMTQgYmFja2VuZCBcdTUzRUZcdTgwRkRcdTkwODRcdTU3MjhcdTU1NUZcdTUyRDVcdTRFMkRcdUZGMENcdTdCNDkgMzAgXHU3OUQyXHU1MThEXHU2MzA5XHU5MUNEXHU4QTY2XHUzMDAyXCIsXG4gIFwiaHR0cFwiOiAgICAgICAgICBcIkJhY2tlbmQgXHU1NkRFXHU2MUM5XHU5MzJGXHU4QUE0XHU3MkMwXHU2MTRCXHU3OEJDXHUzMDAyXHU2QUEyXHU2N0U1IGJhY2tlbmQgXHU3Njg0IGxvZ1x1RkYxQTxicj48Y29kZT5kb2NrZXIgY29tcG9zZSBsb2dzIGJhY2tlbmQ8L2NvZGU+XCIsXG4gIFwibm90LWZoaXJcIjogICAgICBcIlx1OTAxOVx1NTAwQiBVUkwgXHU1NkRFXHU0RTg2XHU2NzcxXHU4OTdGXHVGRjBDXHU0RjQ2XHU0RTBEXHU2NjJGIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFx1MzAwMlx1NzhCQVx1OEE4RCBCYWNrZW5kIFVSTCBcdTYzMDdcdTU0MTEgTkhJLUZISVItQnJpZGdlIFx1NzY4NCAvZmhpciBcdTY4MzlcdTc2RUVcdTkzMDRcdTMwMDJcIixcbn07XG5cbmZ1bmN0aW9uIF9yZW5kZXJDb25uQmFubmVyKCkge1xuICBjb25zdCBiYW5uZXIgPSBlbHMuY29ubkJhbm5lcjtcbiAgaWYgKCFiYW5uZXIpIHJldHVybjtcbiAgYmFubmVyLmRhdGFzZXQuc3RhdGUgPSBfY29ublN0YXRlO1xuICAvLyBNaXJyb3Igc3RhdGUgb250byB0aGUgb3V0ZXIgLmNvbm4tYmxvY2sgc28gdGhlIHdyYXBwZXIgYm9yZGVyXG4gIC8vICh3aGljaCBob2xkcyBiYW5uZXIgKyBoZWxwIGJvZHkgaW5zaWRlIE9ORSBjYXJkKSB0cmFja3MgdGhlIHNhbWVcbiAgLy8gY29sb3IgdGhlIGJhbm5lciBpcyB1c2luZy5cbiAgaWYgKGVscy5jb25uU2VjdGlvbikgZWxzLmNvbm5TZWN0aW9uLmRhdGFzZXQuc3RhdGUgPSBfY29ublN0YXRlO1xuICBjb25zdCBsYWJlbCA9IF9DT05OX0xBQkVMU1tfY29ublN0YXRlXTtcbiAgZWxzLmNvbm5Nc2cudGV4dENvbnRlbnQgPSB0eXBlb2YgbGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IGxhYmVsKCkgOiBsYWJlbDtcbiAgZWxzLmNvbm5SZXRyeUJ0bi5oaWRkZW4gPSBfY29ublN0YXRlICE9PSBcImZhaWxcIjtcbiAgaWYgKF9jb25uU3RhdGUgPT09IFwiZmFpbFwiICYmIF9jb25uRmFpbFJlYXNvbj8ua2luZCkge1xuICAgIGVscy5jb25uSGVscC5oaWRkZW4gPSBmYWxzZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gX0NPTk5fSEVMUFtfY29ubkZhaWxSZWFzb24ua2luZF0gPz8gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gdHJ1ZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gXCJcIjtcbiAgfVxuXG4gIC8vIENvbXBhY3QtcGlsbCB2cyBmdWxsLWJhbm5lciBzd2FwOiB3aGVuIGV2ZXJ5dGhpbmcncyBmaW5lLCBzaHJpbmsgdG9cbiAgLy8gYSBzbWFsbCBncmVlbiBwaWxsIGluIHRoZSBoZWFkZXIgc28gdGhlIHBvcHVwIGJvZHkgaGFzIG1vcmUgcm9vbVxuICAvLyBmb3IgYWN0aW9uYWJsZSBjb250ZW50LiBBbnl0aGluZyBlbHNlICh1bmtub3duIC8gY2hlY2tpbmcgLyBmYWlsKVxuICAvLyBrZWVwcyB0aGUgZnVsbCBiYW5uZXIgc28gcHJvZ3Jlc3MgKyBlcnJvciBoZWxwIGhhcyBzcGFjZSB0byByZW5kZXIuXG4gIGNvbnN0IGlzT2sgPSBfY29ublN0YXRlID09PSBcIm9rXCI7XG4gIGlmIChlbHMuY29ublNlY3Rpb24pIGVscy5jb25uU2VjdGlvbi5oaWRkZW4gPSBpc09rO1xuICBpZiAoZWxzLmNvbm5NaW5pKSB7XG4gICAgZWxzLmNvbm5NaW5pLmhpZGRlbiA9ICFpc09rO1xuICAgIGlmIChpc09rKSBlbHMuY29ubk1pbmkudGl0bGUgPSBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCAzLXN0ZXAgd2l6YXJkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIENvbmNlcHR1YWxseTpcbi8vICAgU3RlcCAxIFx1MjAxNCBcdTc2N0JcdTUxNjVcdUZGMUFvbiBOSEkgdGFiICsgc2Vzc2lvbiB0b2tlbiBpcyB2YWxpZFxuLy8gICBTdGVwIDIgXHUyMDE0IFx1OEEyRFx1NUI5QVx1RkYxQWdlbmRlciBmaWxsZWQgKyAobW9kZT09bG9jYWwgT1IgYmFja2VuZCByZWFjaGFibGUpXG4vLyAgICAgICAgICAgICAgICArIGJpcnRoX2RhdGUgaWYgZW50ZXJlZCBtdXN0IGJlIHZhbGlkXG4vLyAgIFN0ZXAgMyBcdTIwMTQgXHU1M0Q2XHU1Rjk3XHVGRjFBdGhlIGFjdGlvbiBpdHNlbGYgKHN5bmMgQ1RBLCBzdGF0dXMsIHJlc3VsdHMpXG4vL1xuLy8gU3RlcHMgYXV0by1hZHZhbmNlIHdoZW4gdGhlaXIgcHJlY29uZGl0aW9uIGZsaXBzIGdyZWVuOyB1c2VycyBjYW5cbi8vIGNsaWNrIHRoZSBzdGVwcGVyIHRvIHJldmlzaXQgYW55IHN0ZXAuIFdlIG5ldmVyIGF1dG8tc3RlcCBCQUNLIG9uXG4vLyBzdGF0ZSBjaGFuZ2UgXHUyMDE0IG9uY2UgdGhlIHVzZXIgaGFzIG1vdmVkIGZvcndhcmQsIG9ubHkgYW4gZXhwbGljaXRcbi8vIHN0ZXBwZXIgY2xpY2sgYnJpbmdzIHRoZW0gYmFjay4gT3RoZXJ3aXNlIG9wZW5pbmcgdGhlIHBvcHVwIG1pZC1cbi8vIHN5bmMgd291bGQgamVyayB0aGVtIGJhY2sgdG8gc3RlcCAxLlxubGV0IF9hY3RpdmVTdGVwID0gMTtcbmxldCBfd2l6YXJkSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbi8vIFN0ZXAgMiBpcyBcImRvbmVcIiBvbmx5IGFmdGVyIHRoZSB1c2VyIGhhcyBjbGlja2VkIFx1MjcxMyBcdTc4QkFcdTVCOUEgd2l0aCB2YWxpZFxuLy8gaW5wdXRzLiBXZSB0cmFjayB0aGlzIHdpdGggYSBib29sZWFuIHJhdGhlciB0aGFuIHJlYWRpbmcgbGl2ZSBET01cbi8vIHN0YXRlIFx1MjAxNCBvdGhlcndpc2UgdGhlIHdpemFyZCB3b3VsZCBhdXRvLWFkdmFuY2UgdGhlIG1vbWVudCB0aGVcbi8vIGZpZWxkcyBoYXBwZW5lZCB0byBsb29rIHJpZ2h0LCBiZWZvcmUgdGhlIHVzZXIgaGFkIGEgY2hhbmNlIHRvXG4vLyByZXZpZXcuIEZsaXBwZWQgdHJ1ZSBpbiBzYXZlUGF0aWVudE92ZXJyaWRlIHN1Y2Nlc3MsIGZhbHNlIGluXG4vLyBjbGVhclBhdGllbnRPdmVycmlkZSBhbmQgb24gYSBsb2FkIHRoYXQgeWllbGRzIG5vIHNhdmVkIHJlY29yZC5cbmxldCBfc3RlcDJDb25maXJtZWQgPSBmYWxzZTtcblxuLy8gU3RlcCBudW1iZXIgcmVuZGVyZWQgYXMgYSBjaXJjbGVkIGRpZ2l0IGdseXBoIFx1MjAxNCBtYXRjaGVzIHRoZVxuLy8gXCJcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NVwiIGNvcHkgZWxzZXdoZXJlIGluIHRoZSBwb3B1cCBhbmQgdGhlIHdpemFyZCBzdGVwcGVyIGxhYmVscy5cbmZ1bmN0aW9uIF9zdGVwTnVtR2x5cGgobikge1xuICByZXR1cm4gbiA9PT0gMSA/IFwiXHUyNDYwXCIgOiBuID09PSAyID8gXCJcdTI0NjFcIiA6IFwiXHUyNDYyXCI7XG59XG5cbmZ1bmN0aW9uIF9tYXJrU3RlcDJDb25maXJtZWQoeWVzKSB7XG4gIF9zdGVwMkNvbmZpcm1lZCA9ICEheWVzO1xufVxuXG5mdW5jdGlvbiBfaXNTdGVwRG9uZShzdGVwKSB7XG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBsb2dnZWRJbiA9IGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW4gIT09IFwibm9cIjtcbiAgc3dpdGNoIChzdGVwKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIG9uTmhpICYmIGxvZ2dlZEluO1xuICAgIGNhc2UgMjpcbiAgICAgIC8vIENvbmZpcm1lZCA9IHVzZXIgY2xpY2tlZCBcdTI3MTMgXHU3OEJBXHU1QjlBIEFORCB0aGUgb3ZlcnJpZGUgaXMgY3VycmVudGx5XG4gICAgICAvLyB2YWxpZCAoc28gcmV2aXNpdHMgd2l0aCBhIG5vdy1pbnZhbGlkIG92ZXJyaWRlIGRvbid0IHNob3cgYVxuICAgICAgLy8gZmFsc2UgZ3JlZW4gY2hlY2spLlxuICAgICAgcmV0dXJuIF9zdGVwMkNvbmZpcm1lZDtcbiAgICBjYXNlIDM6XG4gICAgICAvLyBTdGVwIDMgaXMgdGhlIHRlcm1pbmFsIGFjdGlvbiBzdGVwOyBuZXZlciBcImRvbmVcIiBmb3IgcHJvZ3Jlc3NcbiAgICAgIC8vIHB1cnBvc2VzICh0aGUgc3VjY2VzcyBiYW5uZXIgaW5zaWRlIHRoZSBzdGVwIGlzIHRoZSBpbmRpY2F0b3IpLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3NldEFjdGl2ZVN0ZXAobiwgb3B0cyA9IHt9KSB7XG4gIGNvbnN0IGNsYW1wZWQgPSBNYXRoLm1heCgxLCBNYXRoLm1pbigzLCBuKSk7XG4gIF9hY3RpdmVTdGVwID0gY2xhbXBlZDtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LmFjdGl2ZVN0ZXAgPSBTdHJpbmcoY2xhbXBlZCk7XG4gIF9yZWZyZXNoV2l6YXJkVWkoKTtcbiAgaWYgKCFvcHRzLnNpbGVudCkge1xuICAgIC8vIEF1dG8tc2Nyb2xsIHRoZSBwb3B1cCB0byB0aGUgdG9wIG9mIHRoZSBzdGVwIHNvIHVzZXJzIGFsd2F5c1xuICAgIC8vIHNlZSB0aGUgc3RlcCBoZWFkZXIgLyBmaXJzdCBpbnB1dCBhZnRlciBuYXZpZ2F0aW9uLlxuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6IFwic21vb3RoXCIgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlZnJlc2hXaXphcmRVaSgpIHtcbiAgaWYgKCFlbHMud2l6YXJkU3RlcHBlcikgcmV0dXJuO1xuICBjb25zdCBsaXMgPSBlbHMud2l6YXJkU3RlcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwibGlbZGF0YS1zdGVwXVwiKTtcbiAgZm9yIChjb25zdCBsaSBvZiBsaXMpIHtcbiAgICBjb25zdCBuID0gTnVtYmVyKGxpLmRhdGFzZXQuc3RlcCk7XG4gICAgY29uc3QgaXNBY3RpdmUgPSBuID09PSBfYWN0aXZlU3RlcDtcbiAgICBjb25zdCBpc0RvbmUgPSBfaXNTdGVwRG9uZShuKTtcbiAgICBpZiAoaXNBY3RpdmUpIGxpLnNldEF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiLCBcInRydWVcIik7XG4gICAgZWxzZSBsaS5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWN1cnJlbnRcIik7XG4gICAgaWYgKGlzRG9uZSkgbGkuZGF0YXNldC5kb25lID0gXCJ0cnVlXCI7XG4gICAgZWxzZSBkZWxldGUgbGkuZGF0YXNldC5kb25lO1xuICB9XG4gIC8vIFN0ZXAgMSdzIHRocmVlIHN1Yi1jYXJkcyAob2ZmLW5oaSAvIG5lZWRzLWxvZ2luIC8gbG9naW4tb2spIGFyZVxuICAvLyBtdXR1YWxseSBleGNsdXNpdmUgXHUyMDE0IHBpY2sgdGhlIG9uZSB0aGF0IG1hdGNoZXMgY3VycmVudCBzdGF0ZS5cbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBpZiAoZWxzLm9wZW5OaGlTZWN0aW9uKVxuICAgIGVscy5vcGVuTmhpU2VjdGlvbi5oaWRkZW4gPSBvbk5oaTtcbiAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbilcbiAgICBlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24uaGlkZGVuID0gIW9uTmhpIHx8IGxvZ2dlZEluO1xuICBpZiAoZWxzLmxvZ2luT2tTZWN0aW9uKVxuICAgIGVscy5sb2dpbk9rU2VjdGlvbi5oaWRkZW4gPSAhKG9uTmhpICYmIGxvZ2dlZEluKTtcblxuICBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbn1cblxuLy8gU2hvdy9oaWRlIHN0ZXAtMyByZXN1bHQgY2FyZHMgYmFzZWQgb24gd2hldGhlciBlYWNoIGhhcyBjb250ZW50LlxuLy8gRW1wdHkgY2FyZHMgKGUuZy4gYSBzdW1tYXJ5IGNhcmQgd2l0aCBubyBzdGF0dXMgKyBubyBkYXRhLXN0YXRlIGluXG4vLyBsb2NhbCBtb2RlIHByZS1zeW5jKSB1c2VkIHRvIHJlbmRlciBhcyBhIGJsYW5rIHN0cmlwZSBcdTIwMTQgbm93IHRoZXlcbi8vIHN0YXkgY29sbGFwc2VkIGluZGl2aWR1YWxseSwgYW5kIHRoZSB3aG9sZSB6b25lIGdvZXMgYXdheSB3aGVuIGFsbFxuLy8gdGhyZWUgY2FyZHMgd291bGQgYmUgZW1wdHkuXG5mdW5jdGlvbiBfcmVmcmVzaFJlc3VsdFpvbmUoKSB7XG4gIGlmICghZWxzLnJlc3VsdFpvbmUpIHJldHVybjtcbiAgY29uc3QgaGFzU3RhdHVzID0gKGVscy5zdGF0dXM/LnRleHRDb250ZW50ID8/IFwiXCIpLnRyaW0oKSAhPT0gXCJcIjtcbiAgY29uc3QgZGF0YVN0YXRlU2hvd24gPVxuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uICYmICFlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW47XG4gIGNvbnN0IGJ1bmRsZVNob3duID1cbiAgICBlbHMucGVuZGluZ0J1bmRsZSAmJiAhZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuO1xuICAvLyBMYXVuY2ggYnV0dG9uIG9ubHkgY291bnRzIHdoZW4gdXNhYmxlIFx1MjAxNCBiYWNrZW5kIG1vZGUgKyB0aGUgcGF0aWVudFxuICAvLyBhY3R1YWxseSBleGlzdHMgb24gdGhlIGJhY2tlbmQgKGBsYXVuY2hCdG4uZGlzYWJsZWQgPT09IGZhbHNlYCkuXG4gIC8vIEEgcGVybWEtZGlzYWJsZWQgYnV0dG9uIHNob3VsZG4ndCBwaW4gdGhlIHpvbmUgb3Blbi5cbiAgY29uc3QgbGF1bmNoVXNhYmxlID1cbiAgICBjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBlbHMubGF1bmNoQnRuICYmICFlbHMubGF1bmNoQnRuLmRpc2FibGVkO1xuXG4gIC8vIEhpZGUgdGhlIGVudGlyZSByZXN1bHQgc2VjdGlvbiAodGhlIGRpdmlkZXIgKyBldmVyeXRoaW5nIGFmdGVyKSB3aGVuXG4gIC8vIHRoZXJlJ3Mgbm90aGluZyBtZWFuaW5nZnVsIHRvIHNob3cuXG4gIGVscy5yZXN1bHRab25lLmhpZGRlbiA9ICEoaGFzU3RhdHVzIHx8IGJ1bmRsZVNob3duIHx8IGRhdGFTdGF0ZVNob3duIHx8IGxhdW5jaFVzYWJsZSk7XG5cbiAgLy8gQnVuZGxlIGZpbGVuYW1lIC8gc2l6ZSBibG9jayBmb2xsb3dzIGJ1bmRsZSB2aXNpYmlsaXR5LlxuICBpZiAoZWxzLmJ1bmRsZU1ldGFCbG9jaykge1xuICAgIGVscy5idW5kbGVNZXRhQmxvY2suaGlkZGVuID0gIWJ1bmRsZVNob3duO1xuICB9XG4gIC8vIExhdW5jaCBidXR0b24gaGlkZS13aGVuLW5vdC11c2FibGUgc28gdGhlIC5uZXh0LWFjdGlvbnMgcm93XG4gIC8vIGRvZXNuJ3Qgc2hvdyBhIHBlcm1hLWRpc2FibGVkIG91dGxpbmUgYnV0dG9uIG5leHQgdG8gbm90aGluZy5cbiAgaWYgKGVscy5sYXVuY2hCdG4pIHtcbiAgICBlbHMubGF1bmNoQnRuLmhpZGRlbiA9IGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiIHx8ICFsYXVuY2hVc2FibGU7XG4gIH1cblxuICAvLyBEZW1vdGUgdGhlIFx1NTNENlx1NUY5NyBDVEEgb25jZSB3ZSBoYXZlIGEgcmVzdWx0ICsgYSB1c2FibGUgbmV4dC1zdGVwXG4gIC8vIGFjdGlvbi4gVGhlIFwicHJpbWFyeSBhY3Rpb25cIiBiYXRvbiBwYXNzZXMgdG8gXHU0RTBCXHU4RjA5IC8gXHU5NThCXHU1NTVGIEFwcCBzb1xuICAvLyB0aGUgdXNlcidzIGV5ZSBsYW5kcyBvbiB3aGF0J3MgbmV4dCwgbm90IG9uIFwicmVkbyB0aGUgdGhpbmdcIi5cbiAgY29uc3QgaGFzUmVzdWx0QXJ0aWZhY3QgPSBidW5kbGVTaG93biB8fCBsYXVuY2hVc2FibGU7XG4gIGlmIChlbHMuc3luY0FwaUJ0bikge1xuICAgIGNvbnN0IHNob3VsZERlbW90ZSA9IGhhc1Jlc3VsdEFydGlmYWN0ICYmICFlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZDtcbiAgICBlbHMuc3luY0FwaUJ0bi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtc2Vjb25kYXJ5XCIsIHNob3VsZERlbW90ZSk7XG4gICAgLy8gUmVsYWJlbCB0byBtYXRjaCB0aGUgbmV3IHJvbGUuIFdoaWxlIHRoZSBzeW5jIGlzIHJ1bm5pbmcgd2Uga2VlcFxuICAgIC8vIHRoZSBwcm9tcHQgbWlkLXJlbmRlciB0ZXh0IGFsb25lIChhcHBseVN5bmNTdGF0dXMgb3ducyB0aGF0KS5cbiAgICBpZiAoIV9sYXRlc3RTdGF0dXM/LnJ1bm5pbmcpIHtcbiAgICAgIGVscy5zeW5jQXBpQnRuLnRleHRDb250ZW50ID0gc2hvdWxkRGVtb3RlXG4gICAgICAgID8gXCJcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIlxuICAgICAgICA6IFwiXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XCI7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9tYXliZUF1dG9BZHZhbmNlKCkge1xuICAvLyBPbmx5IGFkdmFuY2UgZm9yd2FyZCwgbmV2ZXIgYmFjay4gU2F2ZSB1c2VyJ3MgcGxhY2UgaWYgdGhleSd2ZVxuICAvLyBjbGlja2VkIGludG8gYSBsYXRlciBzdGVwIG1hbnVhbGx5LlxuICBpZiAoX2FjdGl2ZVN0ZXAgPT09IDEgJiYgX2lzU3RlcERvbmUoMSkpIF9zZXRBY3RpdmVTdGVwKDIpO1xuICBlbHNlIGlmIChfYWN0aXZlU3RlcCA9PT0gMiAmJiBfaXNTdGVwRG9uZSgyKSkgX3NldEFjdGl2ZVN0ZXAoMyk7XG59XG5cbmZ1bmN0aW9uIF9pbml0V2l6YXJkKCkge1xuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSByZXR1cm47XG4gIF93aXphcmRJbml0aWFsaXplZCA9IHRydWU7XG4gIC8vIEluaXRpYWwgc3RlcDogd2hpY2hldmVyIGlzIHRoZSBGSVJTVCBub3QteWV0LWRvbmUgc3RlcCBhdCBwb3B1cCBvcGVuLlxuICAvLyBGaXJzdC10aW1lIHVzZXIgXHUyMTkyIHN0ZXAgMS4gUmV0dXJuaW5nIHVzZXIgd2l0aCB2YWxpZCBzZXNzaW9uICsgc2F2ZWRcbiAgLy8gcGF0aWVudCBcdTIxOTIgc3RlcCAzLlxuICBjb25zdCBzdGFydCA9IF9pc1N0ZXBEb25lKDEpID8gKF9pc1N0ZXBEb25lKDIpID8gMyA6IDIpIDogMTtcbiAgX3NldEFjdGl2ZVN0ZXAoc3RhcnQsIHsgc2lsZW50OiB0cnVlIH0pO1xuXG4gIC8vIFN0ZXBwZXIgY2xpY2tzIFx1MjE5MiBqdW1wXG4gIGZvciAoY29uc3QgbGkgb2YgZWxzLndpemFyZFN0ZXBwZXIucXVlcnlTZWxlY3RvckFsbChcImxpW2RhdGEtc3RlcF1cIikpIHtcbiAgICBsaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gX3NldEFjdGl2ZVN0ZXAoTnVtYmVyKGxpLmRhdGFzZXQuc3RlcCkpKTtcbiAgICBsaS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiIFwiKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgX3NldEFjdGl2ZVN0ZXAoTnVtYmVyKGxpLmRhdGFzZXQuc3RlcCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCkge1xuICAvLyBTeW5jIGJ1dHRvbi4gQ29uZGl0aW9ucywgaW4gcHJpb3JpdHkgb3JkZXI6XG4gIC8vICAgMS4gb24gYW4gTkhJIHRhYlxuICAvLyAgIDIuIGxvZ2dlZCBpbiB0byBOSEkgKGRldGVjdGVkIHZpYSBiYWNrZ3JvdW5kIHByZS1mbGlnaHQpXG4gIC8vICAgMy4gYmFja2VuZCBtb2RlIFx1MjE5MiBiYWNrZW5kIGNvbm5lY3RlZFxuICAvLyAgIDQuIGdlbmRlciBmaWxsZWQgKG90aGVyIHBhdGllbnQgZmllbGRzIGFsbCBvcHRpb25hbClcbiAgLy8gV2hhdGV2ZXIgYmxvY2tzIHRoZSBDVEEgYWxzbyBnZXRzIHN1cmZhY2VkIGFzIGFuIGlubGluZSBtZXNzYWdlXG4gIC8vIGJlbG93IHRoZSBidXR0b24gXHUyMDE0IHRvb2x0aXBzIGFyZSBpbnZpc2libGUgaW4gdGhlIDM2MHB4IHBvcHVwLlxuICBjb25zdCBvbk5oaSA9ICFlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgY29uc3QgbG9nZ2VkSW4gPSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluICE9PSBcIm5vXCI7XG4gIGNvbnN0IG1vZGVPayA9IGN1cnJlbnRNb2RlKCkgPT09IFwibG9jYWxcIiB8fCBfY29ublN0YXRlID09PSBcIm9rXCI7XG4gIC8vIFN0ZXAgMiBoYXJkIHJlcXVpcmVtZW50czogZ2VuZGVyLCBiaXJ0aF9kYXRlICh2YWxpZCksIGFuZCBuYW1lLlxuICAvLyBUcmFja2VkIGFzIG9uZSByb2xsZWQtdXAgZmxhZyBzbyB0aGUgYmxvY2tlZC1DVEEgc3RyaXAgc2F5c1xuICAvLyBcImNvbXBsZXRlIHRoZSBiYXNpYyBpbmZvXCIgZ2VuZXJpY2FsbHkgcmVnYXJkbGVzcyBvZiB3aGljaCBmaWVsZFxuICAvLyBpcyBtaXNzaW5nIGZpcnN0LlxuICBjb25zdCBzdGVwMkJhc2ljT2sgPSAhIWVscy5vdkdlbmRlcj8udmFsdWUgJiYgISFlbHMub3ZOYW1lPy52YWx1ZT8udHJpbSgpO1xuICBjb25zdCBkb2JFcnJvciA9IHZhbGlkYXRlQmlydGhEYXRlKCk7XG5cbiAgLy8gRWFjaCBibG9ja2luZyByZWFzb24gbmFtZXMgdGhlIHN0ZXAgdGhhdCBuZWVkcyBhdHRlbnRpb24uIE1vZGUgK1xuICAvLyBjb25uZWN0aW9uIG5vdyBsaXZlIGluIHN0ZXAgMyBhbG9uZ3NpZGUgdGhlIENUQSBpdHNlbGYsIHNvIHRob3NlXG4gIC8vIHJlYXNvbnMgcmVmZXJlbmNlIHdoYXQncyBkaXJlY3RseSBhYm92ZSB0aGUgYnV0dG9uIHJhdGhlciB0aGFuXG4gIC8vIHNlbmRpbmcgdGhlIHVzZXIgYmFjayB0aHJvdWdoIHRoZSBzdGVwcGVyLlxuICAvL1xuICAvLyBFWENFUFQgdGhlIGNvbm4tZmFpbGVkIGNhc2U6IHRoZSBjb25uIGJhbm5lciBkaXJlY3RseSBhYm92ZSB0aGVcbiAgLy8gQ1RBIGFscmVhZHkgc2hvdXRzIFwiXHUyNzE3IFx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiICsgcmV0cnkgYnV0dG9uICsgaGVscC4gQWRkaW5nXG4gIC8vIGFub3RoZXIgaW5saW5lIHN0cmlwIGp1c3QgdG8gcmVwZWF0IHRoZSBzYW1lIGZhY3QgKHdpdGggYSBzbGlnaHRseVxuICAvLyBsb25nZXIgc2VudGVuY2UpIGlzIG5vaXNlIFx1MjAxNCBzaWxlbnRseSBkaXNhYmxlIHRoZSBDVEEgaW5zdGVhZCwgd2l0aFxuICAvLyBhIHRvb2x0aXAgZXhwbGFuYXRpb24uIGlubGluZVJlYXNvbiBpcyB3aGF0IHNob3dzIGluIHRoZSB3YXJuaW5nXG4gIC8vIHN0cmlwOyB0b29sdGlwUmVhc29uIGlzIHdoYXQgdGhlIGRpc2FibGVkIGJ1dHRvbiBhZHZlcnRpc2VzIG9uIGhvdmVyLlxuICAvLyBSZWFzb24gZm9yIGJsb2NrZWQgQ1RBLiBpbmxpbmVNc2cgcmVuZGVycyBpbiB0aGUgd2FybmluZyBzdHJpcDtcbiAgLy8gdG9vbHRpcCBpcyB3aGF0IHRoZSBkaXNhYmxlZCBidXR0b24gYWR2ZXJ0aXNlcyBvbiBob3ZlcjsganVtcFRvXG4gIC8vICh3aGVuIHNldCkgbWFrZXMgdGhlIHN0cmlwIGEgY2xpY2thYmxlIHNob3J0Y3V0IGJhY2sgdG8gdGhhdCBzdGVwLlxuICBsZXQgaW5saW5lTXNnID0gXCJcIjtcbiAgbGV0IGp1bXBUbyA9IG51bGw7ICAgICAgIC8vIHsgc3RlcDogMXwyLCBsYWJlbDogXCJcdTc2N0JcdTUxNjVcIiB8IFwiXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XCIgfVxuICBsZXQgdG9vbHRpcFJlYXNvbiA9IFwiXCI7XG4gIGlmICghb25OaGkpIHtcbiAgICBpbmxpbmVNc2cgPSBcIlx1OEFDQlx1NTIwN1x1NTIzMFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NTIwNlx1OTgwMVwiO1xuICAgIGp1bXBUbyA9IHsgc3RlcDogMSwgbGFiZWw6IFwiXHU3NjdCXHU1MTY1XCIgfTtcbiAgfSBlbHNlIGlmICghbG9nZ2VkSW4pIHtcbiAgICBpbmxpbmVNc2cgPSBcIlx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NTIwNlx1OTgwMVx1NUMxQVx1NjcyQVx1NzY3Qlx1NTE2NVwiO1xuICAgIGp1bXBUbyA9IHsgc3RlcDogMSwgbGFiZWw6IFwiXHU3NjdCXHU1MTY1XCIgfTtcbiAgfSBlbHNlIGlmICghc3RlcDJCYXNpY09rKSB7XG4gICAgLy8gRG9uJ3QgZW51bWVyYXRlIHdoaWNoIGZpZWxkIGlzIG1pc3NpbmcgXHUyMDE0IHRoZXJlIGNvdWxkIGJlIG1vcmVcbiAgICAvLyB0aGFuIG9uZSAoZ2VuZGVyLCBuYW1lLCBib3RoKSwgYW5kIHN0ZXAgMiBhbHJlYWR5IG1hcmtzIGVhY2hcbiAgICAvLyByZXF1aXJlZCBmaWVsZCB3aXRoIGEgcmVkICogdGhlIHVzZXIgd2lsbCBzZWUgYWZ0ZXIgdGhlIG9uZS1cbiAgICAvLyBjbGljayBqdW1wLiBLZWVwIHRoZSBtZXNzYWdlIGFib3V0IHRoZSBoaWdoLWxldmVsIGFjdGlvblxuICAgIC8vIChjb21wbGV0ZSArIGNvbmZpcm0pLlxuICAgIGlubGluZU1zZyA9IFwiXHU4QUNCXHU1QjhDXHU2MjEwXHU1N0ZBXHU2NzJDXHU4Q0M3XHU2NTk5XHU0RTI2XHU2MzA5XHU3OEJBXHU1QjlBXCI7XG4gICAganVtcFRvID0geyBzdGVwOiAyLCBsYWJlbDogXCJcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcIiB9O1xuICB9IGVsc2UgaWYgKGRvYkVycm9yKSB7XG4gICAgaW5saW5lTXNnID0gZG9iRXJyb3I7XG4gICAganVtcFRvID0geyBzdGVwOiAyLCBsYWJlbDogXCJcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcIiB9O1xuICB9IGVsc2UgaWYgKCFtb2RlT2spIHtcbiAgICBpbmxpbmVNc2cgPSBcIlwiOyAgICAgICAgICAgICAgICAgLy8gY29ubiBiYW5uZXIgYWJvdmUgY2FycmllcyB0aGUgbWVzc2FnZVxuICAgIHRvb2x0aXBSZWFzb24gPSBcIlx1NUY4Q1x1N0FFRlx1NUMxQVx1NjcyQVx1OTAyM1x1N0REQVwiO1xuICB9XG4gIGlmIChqdW1wVG8pIHRvb2x0aXBSZWFzb24gPSBgXHU1NkRFICR7X3N0ZXBOdW1HbHlwaChqdW1wVG8uc3RlcCl9ICR7anVtcFRvLmxhYmVsfVx1RkYxQSR7aW5saW5lTXNnfWA7XG5cbiAgLy8gRG9uJ3QgZmxpcCB0aGUgQ1RBIGJhY2sgdG8gZW5hYmxlZCBpZiBhIHN5bmMgaXMgY3VycmVudGx5IHJ1bm5pbmdcbiAgLy8gXHUyMDE0IHRoZSBTVyB1cGRhdGVzIGBwYXRpZW50T3ZlcnJpZGVgIG1pZC1zeW5jIChhdXRvLWZldGNoZWQgY2lkKSxcbiAgLy8gd2hpY2ggdHJpZ2dlcnMgc3RvcmFnZS5vbkNoYW5nZWQgXHUyMTkyIGxvYWRQYXRpZW50T3ZlcnJpZGUgXHUyMTkyXG4gIC8vIF9yZWZyZXNoQnV0dG9uU3RhdGVzLiBXaXRob3V0IHRoaXMgZ3VhcmQgdGhlIGJ1dHRvbiB3b3VsZCByZS1lbmFibGVcbiAgLy8gaGFsZndheSB0aHJvdWdoIGEgc3luYyBhbmQgdGhlIHVzZXIgY291bGQgY2xpY2sgaXQgYWdhaW4uXG4gIGNvbnN0IHN5bmNSdW5uaW5nID0gX2xhdGVzdFN0YXR1cz8ucnVubmluZyA9PT0gdHJ1ZTtcbiAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSBzeW5jUnVubmluZyB8fCB0b29sdGlwUmVhc29uICE9PSBcIlwiO1xuICBlbHMuc3luY0FwaUJ0bi50aXRsZSA9IHN5bmNSdW5uaW5nID8gXCJcIiA6IHRvb2x0aXBSZWFzb247XG4gIGlmIChlbHMuc3luY0Jsb2NrZWRSZWFzb24pIHtcbiAgICBjb25zdCBzaG93ID0gIXN5bmNSdW5uaW5nICYmIGlubGluZU1zZyAhPT0gXCJcIjtcbiAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24uaGlkZGVuID0gIXNob3c7XG4gICAgaWYgKHNob3cpIHtcbiAgICAgIC8vIEJ1aWxkIHRoZSBzdHJpcCdzIGNvbnRlbnQ6IFwiXHUyNkEwIHttc2d9ICAgIFx1NTZERSBcdTI0NjAgXHU3NjdCXHU1MTY1IFx1MjE5MlwiIHNvIHRoZVxuICAgICAgLy8gdXNlciBzZWVzIGJvdGggdGhlIHJlYXNvbiBhbmQgd2hlcmUgdGhlIGNsaWNrIHdpbGwgdGFrZSB0aGVtLlxuICAgICAgZWxzLnN5bmNCbG9ja2VkUmVhc29uLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgIGNvbnN0IG1zZ0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBtc2dFbC5jbGFzc05hbWUgPSBcImN0YS1yZWFzb24tbXNnXCI7XG4gICAgICBtc2dFbC50ZXh0Q29udGVudCA9IGBcdTI2QTBcdUZFMEYgJHtpbmxpbmVNc2d9YDtcbiAgICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi5hcHBlbmRDaGlsZChtc2dFbCk7XG4gICAgICBpZiAoanVtcFRvKSB7XG4gICAgICAgIGNvbnN0IGp1bXBFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBqdW1wRWwuY2xhc3NOYW1lID0gXCJjdGEtcmVhc29uLWp1bXBcIjtcbiAgICAgICAganVtcEVsLnRleHRDb250ZW50ID0gYFx1NTZERSAke19zdGVwTnVtR2x5cGgoanVtcFRvLnN0ZXApfSAke2p1bXBUby5sYWJlbH0gXHUyMTkyYDtcbiAgICAgICAgZWxzLnN5bmNCbG9ja2VkUmVhc29uLmFwcGVuZENoaWxkKGp1bXBFbCk7XG4gICAgICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi5kYXRhc2V0LnRhcmdldFN0ZXAgPSBTdHJpbmcoanVtcFRvLnN0ZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGVscy5zeW5jQmxvY2tlZFJlYXNvbi5kYXRhc2V0LnRhcmdldFN0ZXA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIE1pcnJvciB0aGUgc3RvcC1idXR0b24gdmlzaWJpbGl0eSBzbyB0aGUgdXNlciBjYW4gYWx3YXlzIGNhbmNlbFxuICAvLyBtaWQtc3luYyBldmVuIGlmIHRoZSBwb3B1cCByZS1yZW5kZXJzIGR1ZSB0byBvbkNoYW5nZWQuXG4gIGlmIChlbHMuc3RvcEJ0bikgZWxzLnN0b3BCdG4uaGlkZGVuID0gIXN5bmNSdW5uaW5nO1xuXG4gIC8vIExhdW5jaCBidXR0b246IGJhY2tlbmQgbW9kZSArIGNvbm4gb2sgKyBwYXRpZW50IHNldCArIGJhY2tlbmRcbiAgLy8gYWN0dWFsbHkgaGFzIHRoaXMgcGF0aWVudCAob3RoZXJ3aXNlIHRoZSBTTUFSVCBhcHAgbGF1bmNoZXMgaW50b1xuICAvLyBhbiBlbXB0eSBGSElSIHN0b3JlIFx1MjAxNCBjb25mdXNpbmcgYmxhbmsgc2NyZWVuKS5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgaGF2ZUJhY2tlbmRQYXRpZW50ID0gX2JhY2tlbmRQYXRpZW50LnN0YXRlID09PSBcInByZXNlbnRcIjtcbiAgZWxzLmxhdW5jaEJ0bi5kaXNhYmxlZCA9ICEoXG4gICAgY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiZcbiAgICBfY29ublN0YXRlID09PSBcIm9rXCIgJiZcbiAgICAhIW92Py5pZF9ubyAmJlxuICAgIGhhdmVCYWNrZW5kUGF0aWVudFxuICApO1xuICBlbHMubGF1bmNoQnRuLnRpdGxlID1cbiAgICBjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiAgPyBcIlx1OEFDQlx1NTIwN1x1NTIzMFx1MzAwQ1x1RDgzQ1x1REZFNSBcdTY3MkNcdTZBNUZcdTVGOENcdTdBRUYgKFx1OTAzMlx1OTY4RSlcdTMwMERcdTZBMjFcdTVGMEZcIiA6XG4gICAgX2Nvbm5TdGF0ZSAhPT0gXCJva1wiICAgICAgICAgICA/IFwiXHU1RjhDXHU3QUVGXHU1QzFBXHU2NzJBXHU5MDIzXHU3RERBXCIgOlxuICAgICFvdj8uaWRfbm8gICAgICAgICAgICAgICAgICAgID8gXCJcdTU2REUgXHUyNDYxIFx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVx1RkYxQVx1OEFDQlx1NTg2Qlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiIDpcbiAgICAhaGF2ZUJhY2tlbmRQYXRpZW50ICAgICAgICAgICA/IFwiXHU1RjhDXHU3QUVGXHU1QzFBXHU3MTIxXHU2QjY0XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5IFx1MjAxNCBcdTUxNDhcdTYzMDlcdTMwMENcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTMwMERcdTYyMTZcdTRFMEJcdTY1QjlcdTMwMENcdTYyOEFcdTY3MkNcdTU3MzBcdTZBOTRcdTY4NDhcdTRFMEFcdTUwQjNcdTUyMzBcdTVGOENcdTdBRUZcdTMwMERcIiA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiO1xuXG4gIC8vIFJlZnJlc2ggdGhlIHN0ZXBwZXIgVUkgb24gZXZlcnkgc3RhdGUgY2hhbmdlLCBidXQgRE9OJ1QgYXV0by1cbiAgLy8gYWR2YW5jZSBmcm9tIGhlcmUgXHUyMDE0IGluY2lkZW50YWwgaW5wdXQgY2hhbmdlcyAodHlwaW5nIGluIGEgZmllbGRcbiAgLy8gd2hpbGUgcmV2aXNpdGluZyBzdGVwIDIpIHNob3VsZG4ndCB5YW5rIHRoZSB1c2VyIGZvcndhcmQuIEF1dG8tXG4gIC8vIGFkdmFuY2UgaXMgb25seSBmaXJlZCBmcm9tIHRoZSBldmVudHMgdGhhdCBzaWduYWwgaW50ZW50OlxuICAvLyAgIC0gbG9naW4gcHJvYmUgZmxpcHBpbmcgdG8gdHJ1ZSBcdTIxOTIgZm9yd2FyZCBpbnRvIHN0ZXAgMlxuICAvLyAgIC0gc2F2ZVBhdGllbnRPdmVycmlkZSBzdWNjZXNzIFx1MjE5MiBmb3J3YXJkIGludG8gc3RlcCAzXG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoV2l6YXJkVWkoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdEJhY2tlbmRDb25uZWN0aW9uKCkge1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGlmICghdXJsKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tdXJsXCIgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpOyByZXR1cm4gZmFsc2U7XG4gIH1cbiAgX2Nvbm5TdGF0ZSA9IFwiY2hlY2tpbmdcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcblxuICBjb25zdCBwZXJtID0gYXdhaXQgZW5zdXJlQmFja2VuZFBlcm1pc3Npb24odXJsKTtcbiAgaWYgKCFwZXJtLm9rKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dXJsLnJlcGxhY2UoL1xcLyQvLCBcIlwiKX0vZmhpci9tZXRhZGF0YWAsIHsgc2lnbmFsOiBjdHJsLnNpZ25hbCB9KTtcbiAgICBpZiAoIXJlcy5vaykge1xuICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwiaHR0cFwiLCBkZXRhaWw6IHJlcy5zdGF0dXMgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcy5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCk7XG4gICAgICBpZiAoYm9keT8ucmVzb3VyY2VUeXBlICE9PSBcIkNhcGFiaWxpdHlTdGF0ZW1lbnRcIikge1xuICAgICAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJub3QtZmhpclwiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfY29ublN0YXRlID0gXCJva1wiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjtcbiAgICBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXRcIiA6IFwibmV0d29ya1wiIH07XG4gIH0gZmluYWxseSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgfVxuXG4gIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIFdoZW5ldmVyIGNvbm5lY3Rpdml0eSBmbGlwcywgcmUtY2hlY2sgd2hldGhlciB0aGlzIHBhdGllbnQgYWxyZWFkeVxuICAvLyBleGlzdHMgb24gYmFja2VuZC4gKFN0YWxlIFwiX2JhY2tlbmRQYXRpZW50XCIgc3RhdGUgd291bGQgb3RoZXJ3aXNlXG4gIC8vIGNhdXNlIExhdW5jaCB0byBsb29rIGVuYWJsZWQgLyBkaXNhYmxlZCB3cm9uZ2x5LilcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIHJldHVybiBfY29ublN0YXRlID09PSBcIm9rXCI7XG59XG5cbmVscy5jb25uUmV0cnlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0ZXN0QmFja2VuZENvbm5lY3Rpb24pO1xuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBcdTIxOTQgbG9jYWwgZGF0YS1zdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBJbmRlcGVuZGVudCBvZiB0aGUgY29ubmVjdGlvbiBiYW5uZXIgKHdoaWNoIG9ubHkgdGVsbHMgdXMgXCJjYW4gd2Vcbi8vIHJlYWNoIHRoZSBiYWNrZW5kXCIpLiBUaGlzIGNhcmQgYW5zd2VycyB0d28gcXVlc3Rpb25zOlxuLy9cbi8vICAgMS4gRG9lcyB0aGUgYmFja2VuZCBhbHJlYWR5IGhhdmUgdGhpcyBwYXRpZW50J3MgZGF0YT9cbi8vICAgICAgXHUyMTkyIGRyaXZlcyB3aGV0aGVyIFx1RDgzRFx1REU4MCBMYXVuY2ggaXMgYWxsb3dlZCBhdCBhbGwgKExhdW5jaCBvbiBhblxuLy8gICAgICAgIGVtcHR5IGJhY2tlbmQgZ2l2ZXMgYSBjb25mdXNpbmcgU01BUlQtYXBwIGJsYW5rKS5cbi8vICAgMi4gRG9lcyB0aGUgdXNlciBoYXZlIGEgbG9jYWwgQnVuZGxlIHRoYXQncyBuZXdlciB0aGFuIHRoZVxuLy8gICAgICBiYWNrZW5kJ3Mgdmlldz9cbi8vICAgICAgXHUyMTkyIG9mZmVyIFwiXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGUgXHU1MjMwXHU1RjhDXHU3QUVGXCIgdG8gcHVzaCBpdCB2aWEgL2ZoaXIvaW1wb3J0XG4vLyAgICAgICAgd2l0aG91dCByZS1mZXRjaGluZyBOSEkgKGZhc3QsIG5vbi1kZXN0cnVjdGl2ZTogc3RhYmxlIElEc1xuLy8gICAgICAgIHVwc2VydCBzbyBiYWNrZW5kIHJlc291cmNlcyBqdXN0IGJ1bXAgdmVyc2lvbklkKS5cbi8vXG4vLyBXZSBkb24ndCBzZWNvbmQtZ3Vlc3MgdGhlIHVzZXI6IGV2ZW4gd2hlbiBsb2NhbCBpcyBjbGVhcmx5IG5ld2VyLFxuLy8gTGF1bmNoIHN0YXlzIGVuYWJsZWQgaWYgdGhlIGJhY2tlbmQgaGFzIHRoZSBwYXRpZW50IFx1MjAxNCB0aGV5IG1heVxuLy8gZ2VudWluZWx5IHdhbnQgdG8gbG9vayBhdCB0aGUgb2xkZXIgc3RhdGUuIFRoZSBVSSBsYXlzIG91dCBib3RoXG4vLyBzaWRlczsgdXNlciBkZWNpZGVzLlxuXG5sZXQgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuLy8gICBzdGF0ZTogXCJ1bmtub3duXCIgfCBcImNoZWNraW5nXCIgfCBcImFic2VudFwiIHwgXCJwcmVzZW50XCIgfCBcImZhaWxcIlxubGV0IF9sb2NhbEJ1bmRsZSA9IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcblxuZnVuY3Rpb24gX2ZtdFRpbWVTaG9ydChpc28pIHtcbiAgaWYgKCFpc28pIHJldHVybiBcIlwiO1xuICBjb25zdCBkID0gbmV3IERhdGUoaXNvKTtcbiAgaWYgKE51bWJlci5pc05hTihkLmdldFRpbWUoKSkpIHJldHVybiBcIlwiO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgcmV0dXJuIGAke2QuZ2V0TW9udGgoKSArIDF9LyR7ZC5nZXREYXRlKCl9ICR7cGFkKGQuZ2V0SG91cnMoKSl9OiR7cGFkKGQuZ2V0TWludXRlcygpKX1gO1xufVxuXG5mdW5jdGlvbiBfZm10UmVsYXRpdmUobXMpIHtcbiAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBtcztcbiAgaWYgKGRpZmYgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGRpZmYgLyAxMDAwKSl9IFx1NzlEMlx1NTI0RGA7XG4gIGlmIChkaWZmIDwgMzYwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyA2MF8wMDApfSBcdTUyMDZcdTk0MThcdTUyNERgO1xuICBpZiAoZGlmZiA8IDg2XzQwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyAzNjAwXzAwMCl9IFx1NUMwRlx1NjY0Mlx1NTI0RGA7XG4gIHJldHVybiBfZm10VGltZVNob3J0KG5ldyBEYXRlKG1zKS50b0lTT1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gX3JlbmRlckRhdGFTdGF0ZSgpIHtcbiAgLy8gU2VjdGlvbiBvbmx5IHZpc2libGUgaW4gYmFja2VuZCBtb2RlIChoYW5kbGVkIGJ5IC5iYWNrZW5kLW9ubHkgQ1NTKSxcbiAgLy8gYnV0IHdlIGFsc28gZXhwbGljaXRseSBoaWRlIHdoZW4gdGhlIHBvcHVwIGhhcyBubyBwYXRpZW50X292ZXJyaWRlXG4gIC8vIHNldCwgc2luY2UgYm90aCBjaGVja3Mga2V5IG9mZiBwYXRpZW50X2lkLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubykge1xuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ2FyZCBzZXJ2ZXMgYXMgYW4gYWxlcnQsIG5vdCBhIGRhc2hib2FyZCBcdTIwMTQgc2hvdyBvbmx5IHdoZW4gdGhlcmUnc1xuICAvLyBzb21ldGhpbmcgYWN0aW9uYWJsZSAvIHdvcnRoIGZsYWdnaW5nLiBIaWRlIHdoZW46XG4gIC8vICAgLSBiYWNrZW5kIGhhcyB0aGlzIHBhdGllbnQgQU5EIG5vIGxvY2FsIGJ1bmRsZSB0byBjb21wYXJlIGFnYWluc3RcbiAgLy8gICAgIChMYXVuY2ggaXMgZW5hYmxlZCBcdTIxOTIgdGhhdCdzIHRoZSBzaWduYWwgZXZlcnl0aGluZydzIGZpbmUpLCBvclxuICAvLyAgIC0gYm90aCBzaWRlcyBhZ3JlZSBvbiBjb3VudCAoYWxyZWFkeSBpbiBzeW5jLCBubyB1cGxvYWQgbmVlZGVkKS5cbiAgLy8gVGhlIHJlbWFpbmluZyBzdGF0ZXMgKGNoZWNraW5nIC8gZmFpbCAvIGFic2VudCAvIGNvdW50IG1pc21hdGNoKSBhbGxcbiAgLy8gZWl0aGVyIG5lZWQgdXNlciBhdHRlbnRpb24gb3IgYXJlIHRyYW5zaWVudCBsb2FkaW5nIGZlZWRiYWNrLlxuICBjb25zdCBsb2NhbE1hdGNoZXMgPSBfbG9jYWxCdW5kbGUuZXhpc3RzICYmIF9sb2NhbEJ1bmRsZS5wYXRpZW50SWQgPT09IG92LmlkX25vO1xuICBjb25zdCBpblN5bmMgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiZcbiAgICBsb2NhbE1hdGNoZXMgJiZcbiAgICBfYmFja2VuZFBhdGllbnQuY291bnQgPT09IF9sb2NhbEJ1bmRsZS5jb3VudDtcbiAgLy8gUXVpZXQgXCJcdTI3MTMgXHU1REYyXHU1NDBDXHU2QjY1XCIgaGludCBzaXRzIHVuZGVyIHRoZSBkb3dubG9hZCBidXR0b24gd2hlbiBpbi1zeW5jIFx1MjAxNFxuICAvLyBnaXZlcyB0aGUgdXNlciBhIHRpbnkgYWNrbm93bGVkZ2VtZW50IGluc3RlYWQgb2YgdG90YWwgc2lsZW5jZS5cbiAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9ICFpblN5bmM7XG4gIGNvbnN0IG5vdGhpbmdUb1Nob3cgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiYgKCFsb2NhbE1hdGNoZXMgfHwgaW5TeW5jKTtcbiAgaWYgKG5vdGhpbmdUb1Nob3cpIHtcbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSBmYWxzZTtcblxuICAvLyBCYWNrZW5kIHJvd1xuICBjb25zdCBicyA9IGVscy5iYWNrZW5kU3RhdGU7XG4gIHN3aXRjaCAoX2JhY2tlbmRQYXRpZW50LnN0YXRlKSB7XG4gICAgY2FzZSBcImNoZWNraW5nXCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IFwiXHU2QUEyXHU2N0U1XHU0RTJEXHUyMDI2XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiYWJzZW50XCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIGVtcHR5XCI7XG4gICAgICAvLyBDYXJkIHNpdHMgaW5zaWRlIHRoZSByZXN1bHQgem9uZSBuZXh0IHRvIHRoZSBcdUQ4M0RcdUREMDQgXHU1M0Q2XHU1Rjk3IENUQSBhbmRcbiAgICAgIC8vIHRoZSBcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzIGJ1dHRvbiBcdTIwMTQgcG9pbnRpbmcgYXQgdGhlbSB3aXRoIHRleHQgd291bGQgYmVcbiAgICAgIC8vIGRvdWJsZS10YWxrLiBKdXN0IHN0YXRlIHRoZSBmYWN0LlxuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjZBMCBcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJwcmVzZW50XCI6IHtcbiAgICAgIGNvbnN0IGNvdW50ID0gX2JhY2tlbmRQYXRpZW50LmNvdW50O1xuICAgICAgY29uc3QgdHMgPSBfYmFja2VuZFBhdGllbnQubGFzdFVwZGF0ZWQ7XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIG9rXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IGBcdTI3MTMgJHtjb3VudCA+IDAgPyBgJHtjb3VudH0gXHU3QjQ2IFx1MDBCNyBgIDogXCJcIn1cdTY3MDBcdTVGOENcdTY2RjRcdTY1QjAgJHtfZm10VGltZVNob3J0KHRzKSB8fCBcIih1bmtub3duKVwifWA7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcImZhaWxcIjpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWUgZmFpbFwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjcxNyBcdTZBQTJcdTY3RTVcdTU5MzFcdTY1NTdcdUZGMDhcdTc3MEJcdTkwMjNcdTdEREEgYmFubmVyXHVGRjA5XCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjAxNFwiO1xuICB9XG5cbiAgLy8gTG9jYWwgcm93IFx1MjAxNCBzaG93IG9ubHkgd2hlbiB0aGUgcGVuZGluZyBidW5kbGUgbWF0Y2hlcyB0aGlzIHBhdGllbnQuXG4gIC8vIChsb2NhbE1hdGNoZXMgd2FzIGNvbXB1dGVkIGFib3ZlIGZvciB0aGUgZWFybHktcmV0dXJuIGNoZWNrLilcbiAgaWYgKGxvY2FsTWF0Y2hlcykge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IGZhbHNlO1xuICAgIGVscy5sb2NhbFN0YXRlLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWUgb2tcIjtcbiAgICBlbHMubG9jYWxTdGF0ZS50ZXh0Q29udGVudCA9XG4gICAgICBgXHUyNzEzICR7X2xvY2FsQnVuZGxlLmNvdW50fSBcdTdCNDYgXHUwMEI3ICR7X2ZtdFJlbGF0aXZlKF9sb2NhbEJ1bmRsZS5nZW5lcmF0ZWRBdCl9XHU3NTIyXHU3NTFGYDtcbiAgfSBlbHNlIHtcbiAgICBlbHMubG9jYWxTdGF0ZVJvdy5oaWRkZW4gPSB0cnVlO1xuICB9XG5cbiAgLy8gXCJcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzXHU2NzJDXHU1NzMwIEJ1bmRsZVwiIGJ1dHRvbiBzaG93cyBvbmx5IHdoZW4gdGhlcmUncyBhIGxvY2FsIGJ1bmRsZVxuICAvLyBmb3IgdGhpcyBwYXRpZW50LiBXZSBkb24ndCByZWFjaCB0aGlzIGJyYW5jaCB3aGVuIGluLXN5bmMgKHRoZVxuICAvLyB3aG9sZSBzZWN0aW9uIGdldHMgaGlkZGVuIGFib3ZlKSwgc28gbm8gbmVlZCBmb3IgYSBzZXBhcmF0ZVxuICAvLyBkaXNhYmxlZCBzdGF0ZSBcdTIwMTQgd2hlbiB0aGUgYnV0dG9uIHNob3dzLCB1cGxvYWQgaXMgYWx3YXlzIG1lYW5pbmdmdWwuXG4gIGVscy5wdXNoTG9jYWxCdG4uaGlkZGVuID0gIWxvY2FsTWF0Y2hlcztcbiAgZWxzLnB1c2hMb2NhbEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICBlbHMucHVzaExvY2FsQnRuLnRpdGxlID0gXCJcIjtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50ZXh0Q29udGVudCA9IFwiXHU2MjhBXHU2NzJDXHU1NzMwXHU2QTk0XHU2ODQ4XHU0RTBBXHU1MEIzXHU1MjMwXHU1RjhDXHU3QUVGXCI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpIHtcbiAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgX2xvY2FsQnVuZGxlID0gcGVuZGluZ1xuICAgID8ge1xuICAgICAgICBleGlzdHM6IHRydWUsXG4gICAgICAgIGNvdW50OiBBcnJheS5pc0FycmF5KEpTT04ucGFyc2UocGVuZGluZy5qc29uKT8uZW50cnkpXG4gICAgICAgICAgPyBKU09OLnBhcnNlKHBlbmRpbmcuanNvbikuZW50cnkubGVuZ3RoXG4gICAgICAgICAgOiAwLFxuICAgICAgICBnZW5lcmF0ZWRBdDogcGVuZGluZy5nZW5lcmF0ZWRBdCB8fCAwLFxuICAgICAgICBwYXRpZW50SWQ6IHBlbmRpbmcucGF0aWVudElkIHx8IG51bGwsXG4gICAgICB9XG4gICAgOiB7IGV4aXN0czogZmFsc2UsIGNvdW50OiAwLCBnZW5lcmF0ZWRBdDogMCwgcGF0aWVudElkOiBudWxsIH07XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tCYWNrZW5kUGF0aWVudCgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiIHx8ICFvdj8uaWRfbm8gfHwgX2Nvbm5TdGF0ZSAhPT0gXCJva1wiKSB7XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIHJldHVybjtcbiAgfVxuICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImNoZWNraW5nXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG5cbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgY29uc3Qga2V5ID0gZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpO1xuICBjb25zdCBoZWFkZXJzID0ga2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGtleSB9IDoge307XG4gIC8vIEJhY2tlbmQgc3RvcmVzIFBhdGllbnQgdW5kZXIgdGhlIGhhc2hlZCBGSElSIGlkLCBuZXZlciB1bmRlciB0aGUgcmF3XG4gIC8vIG5hdGlvbmFsIElEIFx1MjAxNCBxdWVyeSAvIGV4cG9ydCBieSB0aGUgaGFzaGVkIGZvcm0uXG4gIGNvbnN0IGZoaXJQaWQgPSBkZXJpdmVQYXRpZW50SWQob3YuaWRfbm8pO1xuICB0cnkge1xuICAgIGNvbnN0IHByID0gYXdhaXQgZmV0Y2goYCR7dXJsfS9maGlyL1BhdGllbnQvJHtlbmNvZGVVUklDb21wb25lbnQoZmhpclBpZCl9YCwgeyBoZWFkZXJzIH0pO1xuICAgIGlmIChwci5zdGF0dXMgPT09IDQwNCkge1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJhYnNlbnRcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgICBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghcHIub2spIHtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiZmFpbFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGF0aWVudCA9IGF3YWl0IHByLmpzb24oKTtcbiAgICBjb25zdCBsYXN0VXBkYXRlZCA9IHBhdGllbnQ/Lm1ldGE/Lmxhc3RVcGRhdGVkID8/IG51bGw7XG4gICAgLy8gQ291bnQgdmlhIC9maGlyL2V4cG9ydCBcdTIwMTQgc2xpZ2h0bHkgaGVhdmllciBidXQgaXQncyB0aGUgb25seVxuICAgIC8vIG9mZi10aGUtc2hlbGYgd2F5IHRvIGdldCB0b3RhbCByZXNvdXJjZXMgZm9yIGEgcGF0aWVudC4gQ2FwIGJ5XG4gICAgLy8gNXMgdGltZW91dCBzbyBhIHNsb3cgYmFja2VuZCBkb2Vzbid0IGxvY2sgdGhlIHBvcHVwIGZvcmV2ZXIuXG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBjdHJsLmFib3J0KCksIDUwMDApO1xuICAgICAgY29uc3QgZXIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvZXhwb3J0P3BhdGllbnQ9JHtlbmNvZGVVUklDb21wb25lbnQoZmhpclBpZCl9YCwge1xuICAgICAgICBoZWFkZXJzLCBzaWduYWw6IGN0cmwuc2lnbmFsLFxuICAgICAgfSk7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgaWYgKGVyLm9rKSB7XG4gICAgICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IGVyLmpzb24oKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYnVuZGxlLmVudHJ5KSkgY291bnQgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiBsZWF2ZSBjb3VudCA9IDA7IG5vdCBmYXRhbCAqLyB9XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJwcmVzZW50XCIsIGNvdW50LCBsYXN0VXBkYXRlZCB9O1xuICB9IGNhdGNoIChfZSkge1xuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiZmFpbFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgfVxuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHB1c2hMb2NhbEJ1bmRsZVRvQmFja2VuZCgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdj8uaWRfbm8gfHwgIV9sb2NhbEJ1bmRsZS5leGlzdHMgfHwgX2xvY2FsQnVuZGxlLnBhdGllbnRJZCAhPT0gb3YuaWRfbm8pIHJldHVybjtcbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgY29uc3Qga2V5ID0gZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpO1xuICBjb25zdCBoZWFkZXJzID0ge1xuICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIC4uLihrZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjoga2V5IH0gOiB7fSksXG4gIH07XG4gIGVscy5wdXNoTG9jYWxCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBlbHMucHVzaExvY2FsQnRuLnRleHRDb250ZW50ID0gXCJcdTRFMEFcdTUwQjNcdTRFMkRcdTIwMjZcIjtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gICAgaWYgKCFwZW5kaW5nPy5qc29uKSB0aHJvdyBuZXcgRXJyb3IoXCJubyBsb2NhbCBidW5kbGVcIik7XG4gICAgY29uc3QgciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9pbXBvcnRgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLCBoZWFkZXJzLCBib2R5OiBwZW5kaW5nLmpzb24sXG4gICAgfSk7XG4gICAgaWYgKCFyLm9rKSB7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgci50ZXh0KCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyLnN0YXR1c306ICR7dGV4dC5zbGljZSgwLCAxMjApfWApO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByLmpzb24oKTtcbiAgICBzZXRTdGF0dXMoYFx1MjcwNSBcdTVERjJcdTRFMEFcdTUwQjMgJHtyZXN1bHQuaW1wb3J0ZWQgPz8gXCI/XCJ9IFx1N0I0Nlx1NTIzMFx1NUY4Q1x1N0FFRmAsIFwic3VjY2Vzc1wiKTtcbiAgICBhd2FpdCBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1MjZENCBcdTRFMEFcdTUwQjNcdTU5MzFcdTY1NTdcdUZGMUEke2UubWVzc2FnZX1gLCBcImVycm9yXCIpO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIF9yZW5kZXJEYXRhU3RhdGUoKSAoYWxyZWFkeSBjYWxsZWQgZnJvbSBjaGVja0JhY2tlbmRQYXRpZW50IG9uXG4gICAgLy8gc3VjY2VzcykgZGVjaWRlcyB0aGUgcmlnaHQgZGlzYWJsZWQgc3RhdGUgKyBsYWJlbCBiYXNlZCBvblxuICAgIC8vIHdoZXRoZXIgYmFja2VuZCBhbmQgbG9jYWwgYWdyZWUuIENhbGwgaXQgaGVyZSB0b28gdG8gY292ZXIgdGhlXG4gICAgLy8gZmFpbHVyZSBwYXRoIHRoYXQgc2tpcHBlZCBjaGVja0JhY2tlbmRQYXRpZW50LlxuICAgIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgfVxufVxuXG5lbHMucHVzaExvY2FsQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVzaExvY2FsQnVuZGxlVG9CYWNrZW5kKTtcblxuLy8gVGhlIGJsb2NrZWQtcmVhc29uIHdhcm5pbmcgc3RyaXAgZG91YmxlcyBhcyBhIFwianVtcCBiYWNrIHRvIHRoZVxuLy8gcmVsZXZhbnQgc3RlcFwiIGJ1dHRvbiB3aGVuIHRoZXJlJ3MgYSBrbm93biB0YXJnZXQgc3RlcC4gQ2xpY2tcbi8vIGFueXdoZXJlIG9uIGl0IHRvIG5hdmlnYXRlOyB0aGUgdHJhaWxpbmcgXCJcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NSBcdTIxOTJcIiBoaW50XG4vLyB0ZWxlZ3JhcGhzIHdoZXJlIHRoZSBjbGljayB3aWxsIGxhbmQuXG5lbHMuc3luY0Jsb2NrZWRSZWFzb24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGNvbnN0IHRhcmdldCA9IE51bWJlcihlbHMuc3luY0Jsb2NrZWRSZWFzb24uZGF0YXNldC50YXJnZXRTdGVwKTtcbiAgaWYgKHRhcmdldCA+PSAxICYmIHRhcmdldCA8PSAzKSBfc2V0QWN0aXZlU3RlcCh0YXJnZXQpO1xufSk7XG5cbi8vIFwiXHVEODNEXHVERDE3IFx1OTU4Qlx1NTU1Rlx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NzY3Qlx1NTE2NVwiIFx1MjAxNCBvcGVucyB0aGUgTkhJIGxhbmRpbmcgcGFnZSBzbyB0aGUgdXNlclxuLy8gZG9lc24ndCBoYXZlIHRvIHJlbWVtYmVyIC8gZ29vZ2xlIHRoZSBVUkwuIENsb3NlcyB0aGUgcG9wdXAgc29cbi8vIHRoZXkgZG9uJ3QgaGF2ZSB0byBkaXNtaXNzIGl0IG1hbnVhbGx5IGFmdGVyIHRoZSBuZXcgdGFiIG9wZW5zLlxuZWxzLm9wZW5OaGlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gIGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogTkhJX0xBTkRJTkcgfSk7XG4gIHdpbmRvdy5jbG9zZSgpO1xufSk7XG5cbi8vIFwiXHU1MjREXHU1RjgwXHU3NjdCXHU1MTY1XHU5ODAxXHU5NzYyXCIgaW5zaWRlIHRoZSBuZWVkcy1sb2dpbiBiYW5uZXIuIENvdmVycyBib3RoOlxuLy8gICAxLiBTZXNzaW9uIGV4cGlyZWQgc2lsZW50bHkgd2hpbGUgb24gYSBsb2dnZWQtaW4gcGFnZSAobG9va3Ncbi8vICAgICAgXCJzdGlsbCBsb2dnZWQgaW5cIiB0byB0aGUgdXNlciBcdTIxOTIgdGhleSdyZSBjb25mdXNlZCB3aHkgd2Ugc2F5XG4vLyAgICAgIG90aGVyd2lzZSkuXG4vLyAgIDIuIFVzZXIgaXMgb24gYSBwdWJsaWMgc3ViLXBhZ2UgbGlrZSBcdTU1NEZcdTdCNTRcdTVDMDhcdTUzNDAgXHUyMDE0IGEgcGxhaW4gcmVsb2FkXG4vLyAgICAgIHdvdWxkIGp1c3QgcmUtcmVuZGVyIHRoZSBzYW1lIHVuLWF1dGggcGFnZSB3aXRob3V0IHN1cmZhY2luZ1xuLy8gICAgICBhIGxvZ2luIGZvcm0uIE5hdmlnYXRpbmcgZGlyZWN0bHkgdG8gdGhlIGxvZ2luIFVSTCBoYW5kbGVzXG4vLyAgICAgIGJvdGggY2FzZXMgaWRlbnRpY2FsbHkuXG4vLyBEcml2ZXMgY2hyb21lLnRhYnMudXBkYXRlIHdpdGggYSB1cmwgc28gdGhlIGV4aXN0aW5nIE5ISSB0YWJcbi8vIGdvZXMgc3RyYWlnaHQgdG8gdGhlIGxvZ2luIHBpY2tlcjsgZm9jdXNlcyArIGNsb3NlcyBwb3B1cCBzbyB0aGVcbi8vIHVzZXIgbGFuZHMgb24gdGhlIHBhZ2UgdGhleSBuZWVkIHRvIGFjdCBvbi5cbmVscy5uaGlSZWxvYWRCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gIGlmICghX25oaVRhYklkKSB7XG4gICAgLy8gRGVmZW5zaXZlOiBiYW5uZXIgc2hvdWxkbid0IGJlIHZpc2libGUgd2hlbiBvZmYtTkhJLCBidXQgaWZcbiAgICAvLyBzb21ldGhpbmcgd2VudCBzaWRld2F5cyBqdXN0IG9wZW4gdGhlIGxvZ2luIHBhZ2UgaW4gYSBuZXcgdGFiLlxuICAgIGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogTkhJX0xPR0lOX1VSTCB9KTtcbiAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBhd2FpdCBjaHJvbWUudGFicy51cGRhdGUoX25oaVRhYklkLCB7IHVybDogTkhJX0xPR0lOX1VSTCwgYWN0aXZlOiB0cnVlIH0pO1xuICB9IGNhdGNoIHt9XG4gIHdpbmRvdy5jbG9zZSgpO1xufSk7XG5cbi8vIExvY2FsIGJ1bmRsZSBzdGF0ZSBjaGFuZ2VzIHdoZW5ldmVyIHRoZSBTVyBzdGFzaGVzIGEgbmV3IHN5bmMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBQRU5ESU5HX0JVTkRMRV9LRVkgaW4gY2hhbmdlcykgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG59KTtcblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgbW9kZSBmZWF0dXJlIGdhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBMYXlwZXJzb24gZGVmYXVsdDogYmFja2VuZCBtb2RlIChEb2NrZXIgc2VydmVyICsgRGFzaGJvYXJkICsgU01BUlRcbi8vIEFwcCkgaXMgaGlkZGVuIGJlaGluZCBhIHRvZ2dsZSBpbiBcdTkwMzJcdTk2OEVcdThBMkRcdTVCOUEuIFdoZW4gT0ZGIChkZWZhdWx0KSwgdGhlXG4vLyBtb2RlLXRvZ2dsZSByb3cgaW4gc3RlcCAzIGRvZXNuJ3QgcmVuZGVyIGFuZCBzeW5jTW9kZSBpcyBmb3JjZWQgdG9cbi8vIFwibG9jYWxcIiByZWdhcmRsZXNzIG9mIHdoYXQncyBpbiBzdG9yYWdlLlxuYXN5bmMgZnVuY3Rpb24gbG9hZEJhY2tlbmRNb2RlRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBiYWNrZW5kTW9kZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcImJhY2tlbmRNb2RlRW5hYmxlZFwiKTtcbiAgY29uc3QgZW5hYmxlZCA9IGJhY2tlbmRNb2RlRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgZWxzLmJhY2tlbmRNb2RlRW5hYmxlZC5jaGVja2VkID0gZW5hYmxlZDtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LmJhY2tlbmRFbmFibGVkID0gZW5hYmxlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiO1xufVxuXG5lbHMuYmFja2VuZE1vZGVFbmFibGVkPy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgZW5hYmxlZCA9IGVscy5iYWNrZW5kTW9kZUVuYWJsZWQuY2hlY2tlZDtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LmJhY2tlbmRFbmFibGVkID0gZW5hYmxlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBiYWNrZW5kTW9kZUVuYWJsZWQ6IGVuYWJsZWQgfSk7XG4gIGlmIChlbmFibGVkKSB7XG4gICAgLy8gQXV0by1zd2l0Y2ggdG8gYmFja2VuZCBtb2RlIHNvIHRoZSB1c2VyIGltbWVkaWF0ZWx5IHNlZXMgdGhlXG4gICAgLy8gbW9kZSB0YWIgKyB0aGUgYmFja2VuZCBjb25maWcgZmllbGRzIHRoZXkganVzdCB1bmxvY2tlZC4gQmVhdHNcbiAgICAvLyBcIkkgZW5hYmxlZCBpdCBidXQgbm90aGluZyBoYXBwZW5lZFwiLlxuICAgIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSByLmNoZWNrZWQgPSByLnZhbHVlID09PSBcImJhY2tlbmRcIjtcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IFwiYmFja2VuZFwiO1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNNb2RlOiBcImJhY2tlbmRcIiB9KTtcbiAgICB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3JjZSBiYWNrIHRvIGxvY2FsOyBjbGVhciBhbnkgbGVmdG92ZXIgYmFja2VuZCBjb25uZWN0aW9uIHN0YXRlXG4gICAgLy8gc28gdGhlIG5leHQgdGltZSB0aGV5IHJlLWVuYWJsZSBpdCBkb2Vzbid0IHNob3cgc3RhbGUgXCJcdTVERjJcdTkwMjNcdTdEREFcIi5cbiAgICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgci5jaGVja2VkID0gci52YWx1ZSA9PT0gXCJsb2NhbFwiO1xuICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5tb2RlID0gXCJsb2NhbFwiO1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNNb2RlOiBcImxvY2FsXCIgfSk7XG4gICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIH1cbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgU3luYyBtb2RlIChsb2NhbCB8IGJhY2tlbmQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuYXN5bmMgZnVuY3Rpb24gbG9hZFN5bmNNb2RlKCkge1xuICBjb25zdCB7IHN5bmNNb2RlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJzeW5jTW9kZVwiKTtcbiAgLy8gQmFja2VuZCBtb2RlIGRpc2FibGVkIGluIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgaWdub3JlIGFueSBzdG9yZWQgYmFja2VuZCBtb2RlLlxuICBjb25zdCBiYWNrZW5kRW5hYmxlZCA9IGRvY3VtZW50LmJvZHkuZGF0YXNldC5iYWNrZW5kRW5hYmxlZCA9PT0gXCJ0cnVlXCI7XG4gIGNvbnN0IG1vZGUgPSAoYmFja2VuZEVuYWJsZWQgJiYgc3luY01vZGUgPT09IFwiYmFja2VuZFwiKSA/IFwiYmFja2VuZFwiIDogREVGQVVMVF9NT0RFO1xuICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgci5jaGVja2VkID0gci52YWx1ZSA9PT0gbW9kZTtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBtb2RlO1xuICBpZiAobW9kZSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICAvLyBBdXRvLXRlc3Qgb24gb3BlbiBzbyB0aGUgdXNlciBzZWVzIHN0YXR1cyB3aXRob3V0IGNsaWNraW5nLiBBd2FpdGluZ1xuICAgIC8vIGhlcmUgc2VyaWFsaXplcyB0aGUgcmVzdCBvZiBpbml0KCkgdW50aWwgd2Uga25vdyB0aGUgYW5zd2VyLlxuICAgIGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICB9IGVsc2Uge1xuICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGN1cnJlbnRNb2RlKCkge1xuICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgaWYgKHIuY2hlY2tlZCkgcmV0dXJuIHIudmFsdWU7XG4gIHJldHVybiBERUZBVUxUX01PREU7XG59XG5cbmZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSB7XG4gIHIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKCk7XG4gICAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBtb2RlO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNNb2RlOiBtb2RlIH0pO1xuICAgIGlmIChtb2RlID09PSBcImJhY2tlbmRcIikge1xuICAgICAgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7IC8vIHRyaWdnZXJzIGNoZWNrQmFja2VuZFBhdGllbnQgb24gc3VjY2Vzc1xuICAgIH0gZWxzZSB7XG4gICAgICBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZWxzLmJhY2tlbmRVcmwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IGJhY2tlbmRVcmw6IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKSB9KTtcbiAgZWxzLmRhc2hib2FyZExpbmsuaHJlZiA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnJlcGxhY2UoLzo4MDEwLiokLywgXCI6MzAxMFwiKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbn0pO1xuZWxzLnN5bmNBcGlLZXkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNBcGlLZXk6IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKSB9KTtcbn0pO1xuLy8gTWFzay1wYXRpZW50LW5hbWUgdG9nZ2xlIFx1MjAxNCBkZWZhdWx0cyBPRkYgKGNpdGl6ZW5zIGRvd25sb2FkaW5nIHRoZWlyXG4vLyBvd24gZGF0YSBkb24ndCBuZWVkIGFub255bWl6YXRpb24pLiBXaGVuIE9OOiBwb3B1cCBzdW1tYXJ5LCBGSElSXG4vLyBCdW5kbGUgb3V0cHV0LCBzeW5jLWxvZywgYW5kIE5ISSByZXBvcnQgbmFycmF0aXZlIGFsbCB1c2UgdGhlXG4vLyBtYXNrZWQgZm9ybSAoXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwKSBpbnN0ZWFkIG9mIHRoZSByZWFsIG5hbWUuXG5sZXQgX21hc2tOYW1lRW5hYmxlZCA9IGZhbHNlO1xuYXN5bmMgZnVuY3Rpb24gbG9hZE1hc2tOYW1lRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBtYXNrTmFtZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcIm1hc2tOYW1lRW5hYmxlZFwiKTtcbiAgX21hc2tOYW1lRW5hYmxlZCA9IG1hc2tOYW1lRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgaWYgKGVscy5tYXNrTmFtZUVuYWJsZWQpIGVscy5tYXNrTmFtZUVuYWJsZWQuY2hlY2tlZCA9IF9tYXNrTmFtZUVuYWJsZWQ7XG59XG5cbmZ1bmN0aW9uIF9tYXliZU1hc2sobmFtZSkge1xuICByZXR1cm4gX21hc2tOYW1lRW5hYmxlZCA/IG1hc2tOYW1lKG5hbWUpIDogbmFtZSB8fCBcIlwiO1xufVxuXG5lbHMubWFza05hbWVFbmFibGVkPy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGFzeW5jICgpID0+IHtcbiAgX21hc2tOYW1lRW5hYmxlZCA9IGVscy5tYXNrTmFtZUVuYWJsZWQuY2hlY2tlZDtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgbWFza05hbWVFbmFibGVkOiBfbWFza05hbWVFbmFibGVkIH0pO1xuICAvLyBSZS1yZW5kZXIgcG9wdXAgY2hyb21lIChzdW1tYXJ5IGxpbmUgaXMgdGhlIG9ubHkgc3BvdCB0aGF0IHJlYWRzXG4gIC8vIF9tYXliZU1hc2sgcmVhY3RpdmVseTsgZXZlcnl3aGVyZSBlbHNlIHNhbXBsZXMgaXQganVzdC1pbi10aW1lKS5cbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xufSk7XG5cbmVscy5zbWFydEFwcFVybC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgLy8gUGVyc2lzdCB0cmltbWVkIHZhbHVlLiBFbXB0eSBzdHJpbmcgXHUyMTkyIHJlc3RvcmUgZGVmYXVsdCBvbiBuZXh0IGxvYWQuXG4gIGNvbnN0IHYgPSBlbHMuc21hcnRBcHBVcmwudmFsdWUudHJpbSgpO1xuICBpZiAodikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNtYXJ0QXBwTGF1bmNoVXJsOiB2IH0pO1xuICB9IGVsc2Uge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInNtYXJ0QXBwTGF1bmNoVXJsXCIpO1xuICAgIGVscy5zbWFydEFwcFVybC52YWx1ZSA9IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSDtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIHNldFN0YXR1cyh0ZXh0LCBraW5kLCBicmVha2Rvd24sIGVycm9ycykge1xuICAvLyBCdWlsZCB3aXRoIERPTSBBUEkgXHUyMDE0IGF2b2lkcyBpbm5lckhUTUwgLyBYU1Mgcmlzay5cbiAgLy8gYnJlYWtkb3duIGlzIGFuIGFycmF5IG9mIG1peGVkIGVudHJpZXM6XG4gIC8vICAgLSBwaGFzZSB0aW1pbmdzIHByZWZpeGVkIHdpdGggXCJcdTIzRjFcIiAgXHUyMTkyIFx1OTY4RVx1NkJCNVx1ODAxN1x1NjY0MlxuICAvLyAgIC0gcGVyLWVuZHBvaW50IGNvdW50cyAgICAgICAgICAgICAgICBcdTIxOTIgXHU1NDA0IGVuZHBvaW50IFx1NjI5M1x1NTIzMFx1NUU3RVx1N0I0NlxuICAvLyBlcnJvcnMgKG9wdGlvbmFsKSBpcyB0aGUgcmF3IGAke2VwfTogJHttc2d9YCBzdHJpbmdzIGZyb20gdGhlIFNXLFxuICAvLyBzdXJmYWNlZCB1bmRlciBhIFwiXHU1OTMxXHU2NTU3XHU2NjBFXHU3RDMwXCIgc3ViLXNlY3Rpb24gc28gdGhlIHVzZXIgY2FuIHNlZSB3aGF0XG4gIC8vIHRoZSBcIk4gXHU5ODA1XHU1OTMxXHU2NTU3XCIgc3VtbWFyeSBhY3R1YWxseSBwb2ludHMgYXQgKG5vIGxvbmdlciBEZXZUb29scy1vbmx5KS5cbiAgLy8gQm90aCBncm91cHMgYXJlIHR1Y2tlZCBpbnNpZGUgYSBzaW5nbGUgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIiB0b2dnbGUgc28gdGhlXG4gIC8vIHBvcHVwIHN0YXlzIGNvbXBhY3QgYnkgZGVmYXVsdC5cbiAgZWxzLnN0YXR1cy5jbGFzc05hbWUgPSBraW5kIHx8IFwiXCI7XG4gIGVscy5zdGF0dXMudGV4dENvbnRlbnQgPSBcIlwiO1xuICBjb25zdCBoYXNFcnJvcnMgPSBBcnJheS5pc0FycmF5KGVycm9ycykgJiYgZXJyb3JzLmxlbmd0aCA+IDA7XG4gIGlmICghdGV4dCAmJiAhKGJyZWFrZG93biAmJiBicmVha2Rvd24ubGVuZ3RoKSAmJiAhaGFzRXJyb3JzKSByZXR1cm47XG4gIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCB8fCBcIlwiKSk7XG4gIGlmICgoYnJlYWtkb3duICYmIGJyZWFrZG93bi5sZW5ndGgpIHx8IGhhc0Vycm9ycykge1xuICAgIGNvbnN0IGJkID0gYnJlYWtkb3duIHx8IFtdO1xuICAgIGNvbnN0IHBoYXNlUm93cyA9IGJkLmZpbHRlcigoYikgPT4gYi5zdGFydHNXaXRoKFwiXHUyM0YxXCIpKTtcbiAgICBjb25zdCBvdGhlclJvd3MgPSBiZC5maWx0ZXIoKGIpID0+ICFiLnN0YXJ0c1dpdGgoXCJcdTIzRjFcIikpO1xuXG4gICAgY29uc3QgZGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkZXRhaWxzXCIpO1xuICAgIGRldGFpbHMuY2xhc3NOYW1lID0gXCJzdGF0dXMtZGV0YWlsXCI7XG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xuICAgIHN1bW1hcnkudGV4dENvbnRlbnQgPSBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiO1xuICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoc3VtbWFyeSk7XG5cbiAgICBpZiAob3RoZXJSb3dzLmxlbmd0aCkge1xuICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBib2R5LmNsYXNzTmFtZSA9IFwic3RhdHVzLWJyZWFrZG93blwiO1xuICAgICAgLy8gT25lIGl0ZW0gcGVyIGxpbmUgc28gXCJcdTVDMzFcdTkxQUIgMTIgXHU3QjQ2IC8gXHU4NjU1XHU2NUI5IDg4IFx1N0I0NiAvIFx1NkFBMlx1OUE1NyA0MTIgXHU3QjQ2XCJcbiAgICAgIC8vIGlzIHJlYWRhYmxlOyB0aGUgMzYwcHggcG9wdXAgd291bGQgaGF2ZSB3cmFwcGVkIGEgZmxhdFxuICAgICAgLy8gc2VwYXJhdG9yLWpvaW5lZCBzdHJpbmcgaW50byBhIHRhbmdsZWQgbWVzcy5cbiAgICAgIGZvciAoY29uc3Qgcm93IG9mIG90aGVyUm93cykge1xuICAgICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGluZS50ZXh0Q29udGVudCA9IHJvdztcbiAgICAgICAgYm9keS5hcHBlbmRDaGlsZChsaW5lKTtcbiAgICAgIH1cbiAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuICAgIGlmIChoYXNFcnJvcnMpIHtcbiAgICAgIC8vIEZhaWx1cmUtZGV0YWlsIG5lc3RlZCBzZWN0aW9uLiBQZXItZXJyb3IgcmF3IG1lc3NhZ2VzIGFyZVxuICAgICAgLy8gZGV2LWlzaCAoZS5nLiBcImltYWdpbmcgZGV0YWlsOiBIVFRQIDUwNFwiKSBidXQgc3VyZmFjaW5nIHRoZW1cbiAgICAgIC8vIGJlYXRzIHRoZSBwcmV2aW91cyBcIk4gXHU5ODA1XHU1OTMxXHU2NTU3IFx1MjAxNCBEZXZUb29scyB0byByZWFkXCIgVVguIEZvbGRlZFxuICAgICAgLy8gYnkgZGVmYXVsdCBzbyB0aGUgc3VjY2VzcyBzdW1tYXJ5IHN0YXlzIHRoZSBkb21pbmFudCBzaWduYWxcbiAgICAgIC8vIHdoZW4gc29tZXRoaW5nIGRpZCBzdGlsbCBnZXQgdGhyb3VnaC5cbiAgICAgIGNvbnN0IGVyckRldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGV0YWlsc1wiKTtcbiAgICAgIGVyckRldGFpbHMuY2xhc3NOYW1lID0gXCJzdGF0dXMtZGV0YWlsIHN0YXR1cy1lcnJvcnNcIjtcbiAgICAgIGNvbnN0IGVyclN1bW1hcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3VtbWFyeVwiKTtcbiAgICAgIGVyclN1bW1hcnkudGV4dENvbnRlbnQgPSBgXHU1OTMxXHU2NTU3XHU2NjBFXHU3RDMwXHVGRjA4JHtlcnJvcnMubGVuZ3RofVx1RkYwOWA7XG4gICAgICBlcnJEZXRhaWxzLmFwcGVuZENoaWxkKGVyclN1bW1hcnkpO1xuICAgICAgY29uc3QgZXJyQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBlcnJCb2R5LmNsYXNzTmFtZSA9IFwic3RhdHVzLWVycm9yLWxpc3RcIjtcbiAgICAgIGZvciAoY29uc3QgZSBvZiBlcnJvcnMpIHtcbiAgICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxpbmUudGV4dENvbnRlbnQgPSBgXHUyMDIyICR7ZX1gO1xuICAgICAgICBlcnJCb2R5LmFwcGVuZENoaWxkKGxpbmUpO1xuICAgICAgfVxuICAgICAgZXJyRGV0YWlscy5hcHBlbmRDaGlsZChlcnJCb2R5KTtcbiAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoZXJyRGV0YWlscyk7XG4gICAgfVxuICAgIGlmIChwaGFzZVJvd3MubGVuZ3RoKSB7XG4gICAgICAvLyBQaGFzZSB0aW1pbmdzIGFyZSBkZXYgaW5mbyBcdTIwMTQgdHVjayB0aGVtIGluc2lkZSBhIHNlY29uZCB0b2dnbGVcbiAgICAgIC8vIHNvIGVuZCB1c2VycyBkb24ndCBzZWUgXCJuaGktcGFyYWxsZWw9OHNcIiByaWdodCBhZnRlciBhIHN1Y2Nlc3NcbiAgICAgIC8vIGJhbm5lciBhbmQgdGhpbmsgc29tZXRoaW5nJ3Mgd3JvbmcuXG4gICAgICBjb25zdCB0ZWNoRGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkZXRhaWxzXCIpO1xuICAgICAgdGVjaERldGFpbHMuY2xhc3NOYW1lID0gXCJzdGF0dXMtZGV0YWlsIHN0YXR1cy10ZWNoXCI7XG4gICAgICBjb25zdCB0ZWNoU3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xuICAgICAgdGVjaFN1bW1hcnkudGV4dENvbnRlbnQgPSBcIlx1NjI4MFx1ODg1M1x1N0QzMFx1N0JDMFwiO1xuICAgICAgdGVjaERldGFpbHMuYXBwZW5kQ2hpbGQodGVjaFN1bW1hcnkpO1xuICAgICAgY29uc3QgcGhhc2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHBoYXNlcy5jbGFzc05hbWUgPSBcInN0YXR1cy1waGFzZXNcIjtcbiAgICAgIHBoYXNlcy50ZXh0Q29udGVudCA9IHBoYXNlUm93cy5tYXAoKHApID0+IHAucmVwbGFjZSgvXlx1MjNGMVxccyovLCBcIlwiKSkuam9pbihcIiBcdTAwQjcgXCIpO1xuICAgICAgdGVjaERldGFpbHMuYXBwZW5kQ2hpbGQocGhhc2VzKTtcbiAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQodGVjaERldGFpbHMpO1xuICAgIH1cbiAgICBlbHMuc3RhdHVzLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuICB9XG4gIC8vIFN0YXR1cyB2aXNpYmlsaXR5IGRyaXZlcyB3aGV0aGVyIHRoZSByZXN1bHQgem9uZSBzaG93cyBhdCBhbGwuXG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBY3RpdmVUYWIoKSB7XG4gIGNvbnN0IFt0YWJdID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSk7XG4gIHJldHVybiB0YWI7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQZW5kaW5nIEZISVIgQnVuZGxlIChsb2NhbC1tb2RlIHJlc3VsdCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gQmFja2dyb3VuZCBzdGFzaGVzIHRoZSBnZW5lcmF0ZWQgQnVuZGxlIGludG8gY2hyb21lLnN0b3JhZ2UubG9jYWxcbi8vIHVuZGVyIGBwZW5kaW5nRmhpckJ1bmRsZWAuIFBvcHVwIHJlbmRlcnMgYSBkb3dubG9hZCBidXR0b24uIFVzZXIgbXVzdFxuLy8gY2xpY2sgdG8gYWN0dWFsbHkgdHJpZ2dlciBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIFx1MjAxNCB0aGUgZmlsZSBuZXZlclxuLy8gaGl0cyB0aGUgZGlzayB1bnNvbGljaXRlZC5cblxuZnVuY3Rpb24gX2ZtdEJ5dGVzKG4pIHtcbiAgaWYgKG4gPCAxMDI0KSByZXR1cm4gYCR7bn0gQmA7XG4gIGlmIChuIDwgMTAyNCAqIDEwMjQpIHJldHVybiBgJHsobiAvIDEwMjQpLnRvRml4ZWQoMSl9IEtCYDtcbiAgcmV0dXJuIGAkeyhuIC8gKDEwMjQgKiAxMDI0KSkudG9GaXhlZCgyKX0gTUJgO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZWZyZXNoUGVuZGluZ0J1bmRsZSgpIHtcbiAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgaWYgKCFwZW5kaW5nIHx8ICFwZW5kaW5nLmpzb24pIHtcbiAgICBlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBJZiB0aGUgdXNlciBoYXMgc3dpdGNoZWQgb3ZlcnJpZGUgdG8gYSBkaWZmZXJlbnQgcGF0aWVudCwgdGhlXG4gIC8vIHN0YXNoZWQgYnVuZGxlIGlzIGZvciB0aGUgKnByZXZpb3VzKiBwYXRpZW50LiBIaWRlIGl0IHNvIHRoZXlcbiAgLy8gY2FuJ3QgYWNjaWRlbnRhbGx5IGRvd25sb2FkIHRoZSB3cm9uZyBmaWxlLiBUaGUgYnVuZGxlIHN0YXlzIGluXG4gIC8vIHN0b3JhZ2U7IHJlLWVudGVyaW5nIHRoZSBtYXRjaGluZyBvdmVycmlkZSB3aWxsIHN1cmZhY2UgaXQgYWdhaW4uXG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmIChvdj8uaWRfbm8gJiYgcGVuZGluZy5wYXRpZW50SWQgJiYgcGVuZGluZy5wYXRpZW50SWQgIT09IG92LmlkX25vKSB7XG4gICAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gZmFsc2U7XG4gIC8vIEZpbGVuYW1lICsgc2l6ZWFnZSBsaXZlIGluIHNlcGFyYXRlIHNpYmxpbmcgZWxlbWVudHMgaW4gdGhlIG5ld1xuICAvLyBzaW5nbGUtcGFuZWwgbGF5b3V0IHNvIHdlIGp1c3QgdXBkYXRlIGVhY2ggZGlyZWN0bHkuXG4gIGNvbnN0IGFnbyA9IHBlbmRpbmcuZ2VuZXJhdGVkQXQgPyBfZm10UmVsYXRpdmUocGVuZGluZy5nZW5lcmF0ZWRBdCkgOiBcIlwiO1xuICBpZiAoZWxzLmJ1bmRsZUZpbGVuYW1lKSB7XG4gICAgZWxzLmJ1bmRsZUZpbGVuYW1lLnRleHRDb250ZW50ID0gcGVuZGluZy5maWxlbmFtZTtcbiAgICBlbHMuYnVuZGxlRmlsZW5hbWUudGl0bGUgPSBwZW5kaW5nLmZpbGVuYW1lO1xuICB9XG4gIGlmIChlbHMuYnVuZGxlU2l6ZWFnZSkge1xuICAgIGVscy5idW5kbGVTaXplYWdlLnRleHRDb250ZW50ID0gYCR7X2ZtdEJ5dGVzKHBlbmRpbmcuYnl0ZXMgfHwgMCl9JHthZ28gPyBgIFx1MDBCNyAke2Fnb31gIDogXCJcIn1gO1xuICB9XG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkb3dubG9hZFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZykgcmV0dXJuO1xuICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3BlbmRpbmcuanNvbl0sIHsgdHlwZTogXCJhcHBsaWNhdGlvbi9maGlyK2pzb25cIiB9KTtcbiAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkKHsgdXJsLCBmaWxlbmFtZTogcGVuZGluZy5maWxlbmFtZSwgc2F2ZUFzOiBmYWxzZSB9KTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBSZWxlYXNlIGFmdGVyIGEgdGljayBzbyB0aGUgZG93bmxvYWQgaGFzIHRpbWUgdG8gc3RhcnQuXG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDUwMDApO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNsZWFyUGVuZGluZ0J1bmRsZSgpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGF3YWl0IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG4gIC8vIENsZWFyaW5nIHRoZSBkb3dubG9hZCBpcyB0aGUgdXNlcidzIFwiSSdtIGRvbmUgd2l0aCB0aGlzIHJlc3VsdFwiXG4gIC8vIGdlc3R1cmUgXHUyMDE0IHdpcGUgdGhlIGNvbXBsZXRpb24gc3RhdHVzIGJhbm5lciB0b28gc28gdGhlIHJlc3VsdCB6b25lXG4gIC8vIGNvbGxhcHNlcyBlbnRpcmVseSBpbnN0ZWFkIG9mIGxpbmdlcmluZyB3aXRoIGEgc3RhbGUgXCJcdTI3MDUgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwXCJcbiAgLy8gYW5kIG5vIGRvd25sb2FkIGJ1dHRvbiBuZXh0IHRvIGl0LlxuICBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbiAgc2V0U3RhdHVzKFwiXCIsIG51bGwpO1xuICBhd2FpdCBjaHJvbWUucnVudGltZVxuICAgIC5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiY2xlYXJTeW5jU3RhdHVzXCIgfSlcbiAgICAuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5lbHMuZG93bmxvYWRCdW5kbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRvd25sb2FkUGVuZGluZ0J1bmRsZSk7XG5lbHMuY2xlYXJCdW5kbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsZWFyUGVuZGluZ0J1bmRsZSk7XG5cbi8vIExpdmUgdXBkYXRlIHdoZW4gYmFja2dyb3VuZCBzdGFzaGVzIGEgbmV3IGJ1bmRsZSB3aGlsZSBwb3B1cCBpcyBvcGVuLlxuLy8gKE5vdGU6IGFub3RoZXIgb25DaGFuZ2VkIGxpc3RlbmVyIGVhcmxpZXIgaW4gdGhlIGZpbGUgcmVmcmVzaGVzIHRoZVxuLy8gZGF0YS1zdGF0ZSBjYXJkOyB3ZSBsZWF2ZSB0aGF0IG9uZSBzZXBhcmF0ZSBzbyBmYWlsdXJlIG9mIGVpdGhlciBwYXRoXG4vLyBkb2Vzbid0IHRha2UgdGhlIG90aGVyIGRvd24uKVxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgUEVORElOR19CVU5ETEVfS0VZIGluIGNoYW5nZXMpIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG59KTtcblxuLy8gQmFja2dyb3VuZC1zaWRlIGZsb3cgY2FuIG11dGF0ZSB0aGUgcGF0aWVudE92ZXJyaWRlIG1pZC1zeW5jIFx1MjAxNCBtb3N0XG4vLyBpbXBvcnRhbnRseSBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkgc3dhcHMgdGhlIGF1dG8tWFhYWFhYWFhcbi8vIHBsYWNlaG9sZGVyIGZvciB0aGUgcmVhbCBOSEkgY2lkLiBXaXRob3V0IHRoaXMgbGlzdGVuZXIgdGhlIHBvcHVwXG4vLyBpbnB1dHMgc3RheWVkIHN0YWxlLCByZWZyZXNoUGVuZGluZ0J1bmRsZSdzIHBhdGllbnQtbWF0Y2ggY2hlY2tcbi8vIHRoZW4gY29tcGFyZWQgb2xkIGlucHV0IHZhbHVlIHZzLiBmcmVzaCBidW5kbGUucGF0aWVudElkIGFuZCBoaWRcbi8vIHRoZSBkb3dubG9hZCBidXR0b24uIFJlbG9hZCB0aGUgb3ZlcnJpZGUgaW50byB0aGUgaW5wdXRzIHdoZW5ldmVyXG4vLyBzdG9yYWdlIGNoYW5nZXMgc28gZXZlcnkgZG93bnN0cmVhbSBndWFyZCBzZWVzIGNvbnNpc3RlbnQgdmFsdWVzLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgY2hhbmdlcy5wYXRpZW50T3ZlcnJpZGUpIGxvYWRQYXRpZW50T3ZlcnJpZGUoKTtcbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgXHUyNEQ4IEhlbHAtaWNvbiB0b29sdGlwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIE9uZSBzaGFyZWQgPGRpdj4gYXBwZW5kZWQgdG8gdGhlIHBvcHVwIGJvZHkuIE9uIGhvdmVyIG9mIGFueVxuLy8gLmhlbHAtaWNvbiwgd2UgY29weSBpdHMgZGF0YS10aXAgdGV4dCBhbmQgcG9zaXRpb24gdGhlIHRvb2x0aXBcbi8vIGluc2lkZSB0aGUgcG9wdXAsIGNsYW1waW5nIHRvIGl0cyB2aWV3cG9ydCBzbyBpdCBjYW4ndCBjbGlwIG9mZlxuLy8gZWl0aGVyIGVkZ2UgcmVnYXJkbGVzcyBvZiB3aGVyZSB0aGUgaWNvbiBzaXRzLiAoQ1NTIHBzZXVkby1lbGVtZW50c1xuLy8gY2FuJ3QgYmUgbWVhc3VyZWQsIHNvIGEgcHVyZS1DU1MgYXBwcm9hY2ggaW5ldml0YWJseSBwaWNrcyBvbmVcbi8vIGFuY2hvciBzaWRlIGFuZCBicmVha3MgZm9yIGljb25zIG9uIHRoZSBvdGhlciBzaWRlIG9mIHRoZSBwb3B1cC4pXG5jb25zdCBfaGVscFRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5faGVscFRpcC5jbGFzc05hbWUgPSBcImhlbHAtdG9vbHRpcFwiO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChfaGVscFRpcCk7XG5cbmNvbnN0IFZJRVdQT1JUX01BUkdJTiA9IDY7IC8vIGtlZXAgdGhpcyBtYW55IHB4IGNsZWFyIG9mIHBvcHVwIGVkZ2VzXG5cbmZ1bmN0aW9uIF9zaG93SGVscFRvb2x0aXAoaWNvbikge1xuICBfaGVscFRpcC50ZXh0Q29udGVudCA9IGljb24uZGF0YXNldC50aXAgfHwgaWNvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRpcFwiKSB8fCBcIlwiO1xuICBfaGVscFRpcC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKTtcblxuICAvLyBNZWFzdXJlIG5vdyB0aGF0IGNvbnRlbnQgaXMgc2V0LlxuICBjb25zdCBpY29uUmVjdCA9IGljb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHRpcFJlY3QgPSBfaGVscFRpcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3Qgdmlld3BvcnRXID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICBjb25zdCB2aWV3cG9ydEggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXG4gIC8vIEhvcml6b250YWw6IHByZWZlciBjZW50ZXJlZCBvbiB0aGUgaWNvbjsgY2xhbXAgaW50byBbbWFyZ2luLCB2dy10aXAtbWFyZ2luXS5cbiAgbGV0IGxlZnQgPSBpY29uUmVjdC5sZWZ0ICsgaWNvblJlY3Qud2lkdGggLyAyIC0gdGlwUmVjdC53aWR0aCAvIDI7XG4gIGlmIChsZWZ0IDwgVklFV1BPUlRfTUFSR0lOKSBsZWZ0ID0gVklFV1BPUlRfTUFSR0lOO1xuICBpZiAobGVmdCArIHRpcFJlY3Qud2lkdGggPiB2aWV3cG9ydFcgLSBWSUVXUE9SVF9NQVJHSU4pIHtcbiAgICBsZWZ0ID0gdmlld3BvcnRXIC0gVklFV1BPUlRfTUFSR0lOIC0gdGlwUmVjdC53aWR0aDtcbiAgfVxuICAvLyBWZXJ0aWNhbDogcHJlZmVyIGFib3ZlIHRoZSBpY29uOyBmbGlwIGJlbG93IGlmIHRoZXJlJ3Mgbm8gcm9vbSB1cCB0b3AuXG4gIGxldCB0b3AgPSBpY29uUmVjdC50b3AgLSB0aXBSZWN0LmhlaWdodCAtIDY7XG4gIGlmICh0b3AgPCBWSUVXUE9SVF9NQVJHSU4pIHRvcCA9IGljb25SZWN0LmJvdHRvbSArIDY7XG4gIC8vIEZpbmFsIHNhZmV0eTogY2xhbXAgaW50byB2aWV3cG9ydCBzbyB2ZXJ5IGxvbmcgdG9vbHRpcHMgY2FuJ3QgYmxlZWRcbiAgLy8gb2ZmIHRoZSBib3R0b20gZWl0aGVyLlxuICBpZiAodG9wICsgdGlwUmVjdC5oZWlnaHQgPiB2aWV3cG9ydEggLSBWSUVXUE9SVF9NQVJHSU4pIHtcbiAgICB0b3AgPSBNYXRoLm1heChWSUVXUE9SVF9NQVJHSU4sIHZpZXdwb3J0SCAtIFZJRVdQT1JUX01BUkdJTiAtIHRpcFJlY3QuaGVpZ2h0KTtcbiAgfVxuXG4gIF9oZWxwVGlwLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgX2hlbHBUaXAuc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcbn1cblxuZnVuY3Rpb24gX2hpZGVIZWxwVG9vbHRpcCgpIHtcbiAgX2hlbHBUaXAuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG59XG5cbi8vIERlbGVnYXRlZCBob3ZlciBoYW5kbGVycyBcdTIwMTQgd29ya3MgZm9yIGljb25zIGFkZGVkIGFmdGVyIHBvcHVwIGxvYWQgdG9vXG4vLyAoZS5nLiB3aGVuIG1vZGUgdG9nZ2xlIHJldmVhbHMgYmFja2VuZC1vbmx5IGZpZWxkcykuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIChlKSA9PiB7XG4gIGNvbnN0IGljb24gPSBlLnRhcmdldC5jbG9zZXN0Py4oXCIuaGVscC1pY29uXCIpO1xuICBpZiAoaWNvbikgX3Nob3dIZWxwVG9vbHRpcChpY29uKTtcbn0pO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIChlKSA9PiB7XG4gIGNvbnN0IGljb24gPSBlLnRhcmdldC5jbG9zZXN0Py4oXCIuaGVscC1pY29uXCIpO1xuICBpZiAoaWNvbikgX2hpZGVIZWxwVG9vbHRpcCgpO1xufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmVyc2lvblwiKS50ZXh0Q29udGVudCA9XG4gICAgXCJ2XCIgKyBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb247XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1vay1uZXh0XCIpXG4gICAgPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gX3NldEFjdGl2ZVN0ZXAoMikpO1xuXG4gIGF3YWl0IGxvYWRNYXNrTmFtZUVuYWJsZWQoKTtcblxuICAvLyBTZWVkIGxvY2FsIGJ1bmRsZSBzdGF0ZSBmcm9tIHN0b3JhZ2Ugc28gdGhlIGRhdGEtc3RhdGUgY2FyZCBpc1xuICAvLyBwb3B1bGF0ZWQgYXMgc29vbiBhcyB0aGUgcG9wdXAgcmVuZGVycyAobm8gZmxhc2ggb2YgXCJcdTY3MkFcdTc1MjJcdTc1MUZcIikuXG4gIGF3YWl0IF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xuXG4gIC8vIE9yZGVyIG1hdHRlcnM6IGxvYWRCYWNrZW5kVXJsIHBvcHVsYXRlcyBlbHMuYmFja2VuZFVybC52YWx1ZSwgd2hpY2hcbiAgLy8gbG9hZFN5bmNNb2RlKCkgcmVhZHMgdmlhIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpLiBSZXZlcnNlIHRoaXMgYW5kXG4gIC8vIHRoZSBhdXRvLXRlc3Qgc2VlcyBhbiBlbXB0eSBVUkwgYW5kIGZhbHNlbHkgcmVwb3J0cyBcIlx1NjcyQVx1OEEyRFx1NUI5QSBCYWNrZW5kIFVSTFwiXG4gIC8vIG9uIGV2ZXJ5IHBvcHVwIG9wZW4uIGxvYWRCYWNrZW5kTW9kZUVuYWJsZWQgYWxzbyBoYXMgdG8gbGFuZCBiZWZvcmVcbiAgLy8gbG9hZFN5bmNNb2RlOiB0aGUgbGF0dGVyIGNvbnN1bHRzIGJvZHlbZGF0YS1iYWNrZW5kLWVuYWJsZWRdIHRvXG4gIC8vIGRlY2lkZSB3aGV0aGVyIGEgc3RvcmVkIFwiYmFja2VuZFwiIG1vZGUgaXMgaG9ub3JlZCBvciBmb3JjZWQgdG8gbG9jYWwuXG4gIGF3YWl0IGxvYWRCYWNrZW5kTW9kZUVuYWJsZWQoKTtcbiAgYXdhaXQgbG9hZEJhY2tlbmRVcmwoKTtcbiAgYXdhaXQgbG9hZFN5bmNNb2RlKCk7XG4gIGF3YWl0IGxvYWRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgYXdhaXQgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcblxuICBjb25zdCB0YWIgPSBhd2FpdCBnZXRBY3RpdmVUYWIoKTtcbiAgaWYgKCF0YWI/LnVybCkge1xuICAgIHNldFN0YXR1cyhcIm5vIGFjdGl2ZSB0YWJcIiwgXCJlcnJvclwiKTtcbiAgICBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaSA9IFwiMVwiO1xuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU3luYyByZXF1aXJlcyBiZWluZyBvbiBhbiBOSEkgdGFiIHNvIGNvb2tpZXMvc2Vzc2lvbiBhcmUgdXNhYmxlIGZyb21cbiAgLy8gdGhlIFNXLiBGbGFnIHZpYSBkYXRhc2V0IHNvIF9yZWZyZXNoQnV0dG9uU3RhdGVzIGNhbiBjb21iaW5lIHRoaXNcbiAgLy8gd2l0aCB0aGUgbW9kZSArIGNvbm4gc3RhdGUuIFdoZW4gb2ZmLU5ISSwgYWxzbyBzdXJmYWNlIHRoZVxuICAvLyBcIlx1RDgzRFx1REQxNyBcdTk1OEJcdTU1NUZcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTc2N0JcdTUxNjVcIiBiYW5uZXIgc28gdXNlcnMgZG9uJ3Qgd29uZGVyIHdoZXJlIHRvIGdvLlxuICBjb25zdCBvbk5oaSA9IGlzTmhpVGFiKHRhYi51cmwpO1xuICBpZiAob25OaGkpIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgZWxzZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaSA9IFwiMVwiO1xuICBpZiAoZWxzLm9wZW5OaGlTZWN0aW9uKSBlbHMub3Blbk5oaVNlY3Rpb24uaGlkZGVuID0gb25OaGk7XG4gIC8vIFN0YXNoIHRoZSBOSEkgdGFiIGlkIHNvIHRoZSBcIlx1OTFDRFx1NjVCMFx1NjU3NFx1NzQwNlx1OTgwMVx1OTc2MlwiIGJ1dHRvbiBpbnNpZGUgdGhlXG4gIC8vIG5lZWRzLWxvZ2luIGJhbm5lciBjYW4gcmVsb2FkIGl0IHdpdGhvdXQgaGF2aW5nIHRvIHJlLXF1ZXJ5IHRhYnMuXG4gIF9uaGlUYWJJZCA9IG9uTmhpID8gdGFiLmlkIDogbnVsbDtcblxuICAvLyBXaGVuIG9uIHRoZSBOSEkgdGFiLCBhc2sgYmFja2dyb3VuZCB0byB2ZXJpZnkgdGhlcmUncyBhbiBhY3RpdmVcbiAgLy8gc2Vzc2lvbi4gVGhlIFNXIHByb2JlcyBJSEtFMzQxMCB3aXRoIHNlc3Npb25TdG9yYWdlLnRva2VuIFx1MjAxNCBjaGVhcFxuICAvLyBhbmQgb25seSBzdWNjZWVkcyB3aGVuIHRoZSB1c2VyIGhhcyBsb2dnZWQgaW4uIEFueXRoaW5nIGJ1dCBgdHJ1ZWBcbiAgLy8gKGZhbHNlLCBudWxsLCBvciBubyByZXNwb25zZSkgbWFrZXMgdXMgYXNzdW1lIFwibm90IGxvZ2dlZCBpblwiIHNvXG4gIC8vIHRoZSB1c2VyIHNlZXMgdGhlIGFjdGlvbmFibGUgYmFubmVyIGluc3RlYWQgb2YgbWFzaGluZyB0aGUgQ1RBXG4gIC8vIGludG8gYSBkZWxheWVkIFwiXHVEODNEXHVERDEyIFx1NUMxQVx1NjcyQVx1NzY3Qlx1NTE2NVwiIHN0YXR1cy5cbiAgaWYgKG9uTmhpICYmIHRhYi5pZCkge1xuICAgIGNocm9tZS5ydW50aW1lXG4gICAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImNoZWNrTmhpTG9naW5cIiwgdGFiSWQ6IHRhYi5pZCB9KVxuICAgICAgLnRoZW4oKHJlc3ApID0+IHtcbiAgICAgICAgY29uc3QgbG9nZ2VkSW4gPSByZXNwPy5sb2dnZWRJbiA9PT0gdHJ1ZTtcbiAgICAgICAgaWYgKGxvZ2dlZEluKSBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbjtcbiAgICAgICAgZWxzZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluID0gXCJub1wiO1xuICAgICAgICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKSB7XG4gICAgICAgICAgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9IGxvZ2dlZEluO1xuICAgICAgICB9XG4gICAgICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICAgIC8vIExvZ2luIHByb2JlIGNvbXBsZXRpbmcgcG9zaXRpdmVseSBpcyB0aGUgc3RlcC0xIGludGVudGlvbmFsXG4gICAgICAgIC8vIGNvbXBsZXRpb24gZXZlbnQgXHUyMDE0IGFkdmFuY2UgdGhlIHdpemFyZCBvbmNlIGlmIHRoZSB1c2VyIGlzXG4gICAgICAgIC8vIGN1cnJlbnRseSBsb29raW5nIGF0IHN0ZXAgMS5cbiAgICAgICAgaWYgKGxvZ2dlZEluICYmIF93aXphcmRJbml0aWFsaXplZCkgX21heWJlQXV0b0FkdmFuY2UoKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAvLyBJZiB0aGUgcHJvYmUgZmFpbHMgKFNXIHVucmVhY2hhYmxlLCBldGMpLCBkb24ndCBwdW5pc2ggdGhlXG4gICAgICAgIC8vIHVzZXIgXHUyMDE0IGxlYXZlIHRoZSBDVEEgZW5hYmxlZCBhbmQgbGV0IHRoZSBzeW5jJ3Mgb3duIHNlc3Npb25cbiAgICAgICAgLy8gY2hlY2sgc3VyZmFjZSBhIHJlYWwgZXJyb3IgaWYgbmVlZGVkLlxuICAgICAgICBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbjtcbiAgICAgICAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbikgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbjtcbiAgICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKSBlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgfVxuXG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG5cbiAgLy8gU3RhcnQgdGhlIHdpemFyZCBBRlRFUiBhbGwgaW5pdGlhbCBzdGF0ZSBpcyBsb2FkZWQgXHUyMDE0IHRoaXMgcGlja3NcbiAgLy8gdGhlIGNvcnJlY3Qgc3RhcnRpbmcgc3RlcCAoZS5nLiByZXR1cm5pbmcgdXNlciB3aXRoIHZhbGlkIHNlc3Npb25cbiAgLy8gbGFuZHMgb24gc3RlcCAzIGRpcmVjdGx5KS5cbiAgX2luaXRXaXphcmQoKTtcblxuICAvLyBSZS1hdHRhY2ggdG8gYW55IHN5bmMgdGhhdCdzIGN1cnJlbnRseSBydW5uaW5nIGluIHRoZSBzZXJ2aWNlIHdvcmtlci5cbiAgLy8gVGhpcyBpcyB3aGF0IGxldHMgdGhlIHVzZXIgY2xvc2UgKyByZW9wZW4gdGhlIHBvcHVwIG1pZC1zeW5jLlxuICBhd2FpdCByZWZyZXNoU3luY1N0YXR1c0Zyb21CYWNrZ3JvdW5kKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hTeW5jU3RhdHVzRnJvbUJhY2tncm91bmQoKSB7XG4gIGNvbnN0IHN0YXR1cyA9IGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJnZXRTeW5jU3RhdHVzXCIgfSkuY2F0Y2goKCkgPT4gbnVsbCk7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIGFwcGx5U3luY1N0YXR1cyhzdGF0dXMpO1xufVxuXG4vLyBMYXRlc3Qgc3RhdHVzIHNuYXBzaG90IFx1MjAxNCBrZWVwaW5nIGl0IGxldHMgdGhlIGxpdmUtZWxhcHNlZCB0aWNrZXJcbi8vIHJlcGFpbnQgdGhlIHNhbWUgcHJvZ3Jlc3MgdGV4dCB3aXRoIGFuIHVwZGF0ZWQgYFtOc11gIHByZWZpeCBldmVyeVxuLy8gc2Vjb25kIHdpdGhvdXQgc3BhbW1pbmcgY2hyb21lLnN0b3JhZ2UgZnJvbSB0aGUgc2VydmljZSB3b3JrZXIuXG5sZXQgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG5sZXQgX2VsYXBzZWRUaWNrZXJJZCA9IG51bGw7XG5cbmZ1bmN0aW9uIF9mbXRFbGFwc2VkKG1zKSB7XG4gIGlmIChtcyA8IDYwXzAwMCkgcmV0dXJuIGAke01hdGguZmxvb3IobXMgLyAxMDAwKX1zYDtcbiAgcmV0dXJuIGAke01hdGguZmxvb3IobXMgLyA2MF8wMDApfW0ke01hdGgucm91bmQoKG1zICUgNjBfMDAwKSAvIDEwMDApfXNgO1xufVxuXG5mdW5jdGlvbiBfcmVuZGVyU3RhdHVzKCkge1xuICBjb25zdCBzdGF0dXMgPSBfbGF0ZXN0U3RhdHVzO1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBsZXQgdGV4dCA9IHN0YXR1cy5wcm9ncmVzcyB8fCBcIihzeW5jIFx1OTAzMlx1ODg0Q1x1NEUyRClcIjtcbiAgaWYgKHN0YXR1cy5ydW5uaW5nICYmIHN0YXR1cy5zdGFydGVkKSB7XG4gICAgY29uc3QgZWxhcHNlZCA9IERhdGUubm93KCkgLSBzdGF0dXMuc3RhcnRlZDtcbiAgICB0ZXh0ID0gYFx1MjNGMSAke19mbXRFbGFwc2VkKGVsYXBzZWQpfSBcdTAwQjcgJHt0ZXh0fWA7XG4gIH1cbiAgY29uc3Qga2luZCA9IHN0YXR1cy5ydW5uaW5nID8gXCJpbmZvXCIgOiAoc3RhdHVzLnBoYXNlID09PSBcImVycm9yXCIgPyBcImVycm9yXCIgOiBcInN1Y2Nlc3NcIik7XG4gIGNvbnN0IGJyZWFrZG93biA9IHN0YXR1cy5ydW5uaW5nID8gbnVsbCA6IHN0YXR1cy5icmVha2Rvd247XG4gIGNvbnN0IGVycm9ycyA9IHN0YXR1cy5ydW5uaW5nID8gbnVsbCA6IHN0YXR1cy5lcnJvcnM7XG4gIHNldFN0YXR1cyh0ZXh0LCBraW5kLCBicmVha2Rvd24sIGVycm9ycyk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5U3luY1N0YXR1cyhzdGF0dXMpIHtcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgX2xhdGVzdFN0YXR1cyA9IHN0YXR1cztcbiAgX3JlbmRlclN0YXR1cygpO1xuICAvLyBTdGF0dXMgYmFubmVyIGxpdmVzIGluc2lkZSBzdGVwIDMgXHUyMDE0IGZvcmNlLWp1bXAgdGhlcmUgc28gaXQnc1xuICAvLyBhY3R1YWxseSB2aXNpYmxlLiBSdW5uaW5nIHN5bmMgT1IgYSBmcmVzaCBjb21wbGV0aW9uIGJvdGggd2FycmFudFxuICAvLyBiZWluZyBvbiB0aGUgcmVzdWx0IHN0ZXAuXG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQgJiYgX2FjdGl2ZVN0ZXAgIT09IDMpIHtcbiAgICBfc2V0QWN0aXZlU3RlcCgzLCB7IHNpbGVudDogdHJ1ZSB9KTtcbiAgfVxuICBpZiAoc3RhdHVzLnJ1bm5pbmcpIHtcbiAgICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgZWxzLnN5bmNBcGlCdG4udGV4dENvbnRlbnQgPSBcIlx1NTNENlx1NUY5N1x1NEUyRFx1MjAyNlwiO1xuICAgIGVscy5zdG9wQnRuLmhpZGRlbiA9IGZhbHNlO1xuICAgIGlmICghX2VsYXBzZWRUaWNrZXJJZCkge1xuICAgICAgX2VsYXBzZWRUaWNrZXJJZCA9IHNldEludGVydmFsKF9yZW5kZXJTdGF0dXMsIDEwMDApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChfZWxhcHNlZFRpY2tlcklkKSB7XG4gICAgICBjbGVhckludGVydmFsKF9lbGFwc2VkVGlja2VySWQpO1xuICAgICAgX2VsYXBzZWRUaWNrZXJJZCA9IG51bGw7XG4gICAgfVxuICAgIC8vIFJlLWRlcml2ZSBzeW5jIGJ1dHRvbiBlbmFibGVkIHN0YXRlIGZyb20gbW9kZS9jb25uL05ISS10YWIgaW5zdGVhZFxuICAgIC8vIG9mIHVuY29uZGl0aW9uYWxseSBlbmFibGluZyBcdTIwMTQga2VlcHMgdGhlIGJ1dHRvbiBkaXNhYmxlZCB3aGVuIHdlXG4gICAgLy8ga25vdyB3ZSBzaG91bGRuJ3Qgc3luYyAoZS5nLiBiYWNrZW5kIGRvd24sIG9mZi1OSEkgdGFiKS5cbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIC8vIFN5bmMganVzdCBmaW5pc2hlZCBcdTIwMTQgYm90aCBzaWRlcyBtYXkgaGF2ZSBjaGFuZ2VkIChiYWNrZW5kIGdvdFxuICAgIC8vIG5ldyByZXNvdXJjZXMgaW4gYmFja2VuZCBtb2RlLCBsb2NhbCBidW5kbGUgd2FzIHN0YXNoZWQgaW4gZWl0aGVyXG4gICAgLy8gbW9kZSkuIFJlZnJlc2ggZGF0YS1zdGF0ZSBjYXJkIHNvIHRoZSB1c2VyIHNlZXMgdXAtdG8tZGF0ZSBjb3VudHMuXG4gICAgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG4gICAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIF9jb25uU3RhdGUgPT09IFwib2tcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICB9XG59XG5cbi8vIFN0b3AgdGhlIGluLXByb2dyZXNzIHN5bmMuIFR3by1wcm9uZ2VkIHNvIGl0IHdvcmtzIGV2ZW4gd2hlbiB0aGVcbi8vIHNlcnZpY2Ugd29ya2VyIGhhcyBkaWVkOiAoMSkgdGVsbCB0aGUgU1cgdG8gc2V0IGl0cyBjYW5jZWwgZmxhZyxcbi8vICgyKSB3cml0ZSBzdG9yYWdlIGRpcmVjdGx5IHRvIHJ1bm5pbmc6ZmFsc2Ugc28gdGhlIHBvcHVwIFVJIHVuZnJlZXplc1xuLy8gaW1tZWRpYXRlbHkgZXZlbiBpZiB0aGUgU1cgbWVzc2FnZSBjYW4ndCBiZSBkZWxpdmVyZWQuXG5hc3luYyBmdW5jdGlvbiBzdG9wU3luYygpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBzeW5jU3RhdHVzOiB7XG4gICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdTUwNUNcdTZCNjJcdTRFMkRcdUZGMENcdTZCNjNcdTU3MjhcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTlcdTIwMjZcIixcbiAgICAgIHBoYXNlOiBcImNhbmNlbGxlZFwiLFxuICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgfSxcbiAgfSk7XG4gIHNldFN0YXR1cyhcIlx1MjZENCBcdTUwNUNcdTZCNjJcdTRFMkRcdUZGMENcdTZCNjNcdTU3MjhcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTlcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwic3RvcFN5bmNcIiB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIGVscy5zdG9wQnRuLmhpZGRlbiA9IHRydWU7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG59XG5cbi8vIExpdmUgcHJvZ3Jlc3MgdXBkYXRlcyBcdTIwMTQgbGlzdGVuIG9uIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZCBzbyB3ZSBnZXRcbi8vIGV2ZXJ5IHVwZGF0ZSB0aGUgU1cgd3JpdGVzLCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhlIFNXJ3MgYnJvYWRjYXN0XG4vLyBzZW5kTWVzc2FnZSByZWFjaGVkIHVzLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgY2hhbmdlcy5zeW5jU3RhdHVzKSB7XG4gICAgYXBwbHlTeW5jU3RhdHVzKGNoYW5nZXMuc3luY1N0YXR1cy5uZXdWYWx1ZSk7XG4gIH1cbn0pO1xuXG4vLyAoTGVnYWN5IGluLW1lbW9yeSBicm9hZGNhc3Qgc3RpbGwgbGlzdGVuZWQgdG8gYXMgYSBiYWNrdXAuKVxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2cpID0+IHtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzeW5jUHJvZ3Jlc3NcIikge1xuICAgIGFwcGx5U3luY1N0YXR1cyhtc2cuc3RhdHVzKTtcbiAgfVxufSk7XG5cbi8vIFByZS1mbGlnaHQgZGV0ZWN0aW9uIGZvciBOSEkgbG9naW4gc3RhdGUuIFR3byBzaWduYWxzIChlaXRoZXIgdHJpZ2dlcnMpOlxuLy8gIDEuIFVSTCBpcyBpbiBOSEkgYXV0aCBuYW1lc3BhY2UgKElIS0UzMDk5U3h4KSBcdTIwMTQgbG9naW4gLyBJQyBjYXJkIHBhZ2VzXG4vLyAgMi4gUGFnZSBjb250YWlucyBhIHBhc3N3b3JkIGlucHV0IG9yIGtub3duIGxvZ2dlZC1vdXQgcGhyYXNlc1xuYXN5bmMgZnVuY3Rpb24gaXNPbk5oaUxvZ2luUGFnZSh0YWJJZCwgdXJsKSB7XG4gIGlmICh1cmw/LnBhdGhuYW1lICYmIC9JSEtFMzA5OS8udGVzdCh1cmwucGF0aG5hbWUpKSByZXR1cm4gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiAoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIGNvbnN0IHRleHQgPSAoZG9jdW1lbnQuYm9keT8uaW5uZXJUZXh0IHx8IFwiXCIpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgcGhyYXNlcyA9IFtcbiAgICAgICAgICBcIlx1OEFDQlx1NEY3Rlx1NzUyOFx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NjBBOFx1NzY4NFx1NTA2NVx1NEZERFx1NTM2MVwiLFxuICAgICAgICAgIFwiXHU3NjdCXHU1MTY1XHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBXCIsIFwiXHU3NjdCXHU1MTY1XHU1OTMxXHU2NTU3XCIsIFwiXHU4QUNCXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XCIsXG4gICAgICAgICAgXCJTZXNzaW9uIFx1NURGMlx1OTAzRVx1NjY0MlwiLCBcInNlc3Npb24gXHU1REYyXHU5MDNFXHU2NjQyXCIsIFwiXHU1REYyXHU5MDNFXHU2NjQyXCIsXG4gICAgICAgICAgXCJcdThBQ0JcdTRFRTVcdTUwNjVcdTRGRERcdTUzNjFcdTc2N0JcdTUxNjVcIixcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIHBocmFzZXMuc29tZSgocCkgPT4gdGV4dC5pbmNsdWRlcyhwKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1MjZBMSBOSEkgQVBJLWRpcmVjdCBzeW5jIFx1MjAxNCBwcmltYXJ5IHBhdGguIEhpdHMgTkhJJ3MgdW5kZXJseWluZyBKU09OXG4vLyBlbmRwb2ludHMgaW4gcGFyYWxsZWwgYW5kIHBvc3RzIGFkYXB0ZWQgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQuXG4vLyBSZXF1aXJlcyBwYXRpZW50X292ZXJyaWRlIHRvIGJlIGZpbGxlZC5cbi8vIENvbnZlcnQgYSBiYWNrZW5kIFVSTCBcdTIxOTIgdGhlIG9yaWdpbi1wYXR0ZXJuIENocm9tZSB3YW50cyBmb3IgcGVybWlzc2lvblxuLy8gcmVxdWVzdHMuIFwiaHR0cDovLzE5Mi4xNjguMS41OjgwMTBcIiBcdTIxOTIgXCJodHRwOi8vMTkyLjE2OC4xLjU6ODAxMC8qXCIuXG4vLyBSZXR1cm5zIG51bGwgd2hlbiB0aGUgVVJMIGlzbid0IHBhcnNlYWJsZSBzbyB0aGUgY2FsbGVyIGNhbiBzaG9ydC1jaXJjdWl0LlxuZnVuY3Rpb24gX29yaWdpblBhdHRlcm5Gb3IodXJsKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IG5ldyBVUkwodXJsKTtcbiAgICByZXR1cm4gYCR7dS5wcm90b2NvbH0vLyR7dS5ob3N0fS8qYDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gQmFja2VuZC1tb2RlIHByZS1mbGlnaHQ6IGVuc3VyZSB0aGUgZXh0ZW5zaW9uIGhhcyBob3N0IHBlcm1pc3Npb24gZm9yXG4vLyB0aGUgdXNlci1jb25maWd1cmVkIGJhY2tlbmQgVVJMLiBMb2NhbGhvc3QgLyAxMjcuMC4wLjEgYXJlIGNvdmVyZWQgYnlcbi8vIHRoZSBkZWZhdWx0IG1hbmlmZXN0IGhvc3RfcGVybWlzc2lvbnM7IHJlbW90ZSAvIExBTiAvIHByb2R1Y3Rpb24gVVJMc1xuLy8gbmVlZCBhIG9uZS10aW1lIHVzZXIgZ3JhbnQuIE11c3QgcnVuIGZyb20gYSB1c2VyIGdlc3R1cmUgKGJ1dHRvbiBjbGljaykuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVCYWNrZW5kUGVybWlzc2lvbihiYWNrZW5kVXJsKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBfb3JpZ2luUGF0dGVybkZvcihiYWNrZW5kVXJsKTtcbiAgaWYgKCFwYXR0ZXJuKSByZXR1cm4geyBvazogZmFsc2UsIHJlYXNvbjogYEJhY2tlbmQgVVJMIFx1NzEyMVx1NkNENVx1ODlFM1x1Njc5MDogJHtiYWNrZW5kVXJsfWAgfTtcbiAgY29uc3QgYWxyZWFkeSA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5jb250YWlucyh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgaWYgKGFscmVhZHkpIHJldHVybiB7IG9rOiB0cnVlIH07XG4gIGxldCBncmFudGVkO1xuICB0cnkge1xuICAgIGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgXHU2QjBBXHU5NjUwXHU4QUNCXHU2QzQyXHU1OTMxXHU2NTU3OiAke2UubWVzc2FnZX1gIH07XG4gIH1cbiAgcmV0dXJuIGdyYW50ZWRcbiAgICA/IHsgb2s6IHRydWUgfVxuICAgIDogeyBvazogZmFsc2UsIHJlYXNvbjogYFx1NjcyQVx1NjM4OFx1NkIwQVx1OTAyM1x1N0REQVx1NTIzMCAke3BhdHRlcm59IFx1MjAxNCBcdTUzRDZcdTZEODhgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFwaVN5bmNOaGkoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3YpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1NkRFIFx1MjQ2MSBcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcdUZGMUFcdThBQ0JcdTkwNzhcdTY0QzdcdTYwMjdcdTUyMjVcdTMwMDFcdTU4NkJcdTc1MUZcdTY1RTVcdTVGOENcdTYzMDlcdTc4QkFcdTVCOUFcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBQcmUtZmxpZ2h0OiBjaGVjayB3ZSdyZSBvbiBhbiBOSEkgdGFiIHNvIGNvb2tpZXMgYXJlIHVzYWJsZSBmcm9tIFNXLlxuICBjb25zdCB0YWIgPSBhd2FpdCBnZXRBY3RpdmVUYWIoKTtcbiAgbGV0IHVybDtcbiAgdHJ5IHsgdXJsID0gbmV3IFVSTCh0YWIudXJsKTsgfSBjYXRjaCB7IHNldFN0YXR1cyhcImFjdGl2ZSB0YWIgaGFzIG5vIFVSTFwiLCBcImVycm9yXCIpOyByZXR1cm47IH1cbiAgY29uc3Qgb25Mb2dpbiA9IGF3YWl0IGlzT25OaGlMb2dpblBhZ2UodGFiLmlkLCB1cmwpO1xuICBpZiAob25Mb2dpbikge1xuICAgIHNldFN0YXR1cyhcIlx1RDgzRFx1REQxMiBcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NVx1RkYxQVx1NUMxQVx1NjcyQVx1NzY3Qlx1NTE2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJhY2tlbmQgbW9kZTogcmUtdmVyaWZ5IGNvbm5lY3Rpdml0eSByaWdodCBoZXJlIGV2ZW4gaWYgdGhlIGJhbm5lclxuICAvLyBsYXN0IHNhaWQgb2suIEJldHdlZW4gdGhlIHByZXZpb3VzIGNoZWNrIGFuZCB0aGlzIGNsaWNrIHRoZSB1c2VyXG4gIC8vIG1heSBoYXZlIHN0b3BwZWQgZG9ja2VyOyB3aXRob3V0IGEgZnJlc2ggcHJvYmUgd2UnZCBzdGFydCBhbiB1cGxvYWRcbiAgLy8gdGhhdCBmYWlscyBtaWQtZmxpZ2h0IGFmdGVyIHBhcnRpYWwgZGF0YSBoYXMgaGl0IChvciBmYWlsZWQgdG8gaGl0KVxuICAvLyB0aGUgYmFja2VuZC4gQ2hlYXAgKFx1MjI2NDVzKSBhbmQgc2F2ZXMgYSBsb3Qgb2YgY29uZnVzaW9uLlxuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICBjb25zdCBvayA9IGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICAgIGlmICghb2spIHtcbiAgICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTVGOENcdTdBRUZcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTcgXHUyMDE0IFx1OEFDQlx1NzcwQlx1OTgwMlx1OTBFOCBiYW5uZXIgXHU3Njg0XHU4QUFBXHU2NjBFXCIsIFwiZXJyb3JcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgc3luY1N0YXR1czoge1xuICAgICAgcnVubmluZzogdHJ1ZSxcbiAgICAgIHByb2dyZXNzOiBcIlx1OTU4Qlx1NTlDQlx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MjAyNlwiLFxuICAgICAgcGhhc2U6IFwic3RhcnRpbmdcIiwgc3RhcnRlZDogRGF0ZS5ub3coKSwgdHM6IERhdGUubm93KCksXG4gICAgfSxcbiAgfSk7XG4gIHNldFN0YXR1cyhcIlx1OTU4Qlx1NTlDQlx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MjAyNlwiLCBcImluZm9cIik7XG5cbiAgLy8gQ29tcHV0ZSBkYXRlIHJhbmdlIGZyb20gdGhlIGRyb3Bkb3duLiBcIjFcIiA9IE5ISSdzIGRlZmF1bHQgd2luZG93O1xuICAvLyBhbnl0aGluZyBlbHNlIGlzIFwidG9kYXkgYmFjayBOIHllYXJzXCIuIEhlbHBlciBpbnNpZGUgYmFja2dyb3VuZC5qc1xuICAvLyBjb252ZXJ0cyB0byBcdTZDMTFcdTU3MEIgZm9yIE5ISSdzIEFQSS5cbiAgY29uc3QgcmFuZ2VTZWwgPSBlbHMuYXBpU3luY1JhbmdlPy52YWx1ZSB8fCBcIjNcIjtcbiAgbGV0IGRhdGVSYW5nZSA9IG51bGw7XG4gIGNvbnN0IFJBTkdFX0xBQkVMUyA9IHtcbiAgICBcIjFcIjogICBcIlx1NjcwMFx1OEZEMSAxIFx1NUU3NFwiLFxuICAgIFwiM1wiOiAgIFwiXHU2NzAwXHU4RkQxIDMgXHU1RTc0XCIsXG4gICAgXCI1XCI6ICAgXCJcdTY3MDBcdThGRDEgNSBcdTVFNzRcIixcbiAgICBcIjEwXCI6ICBcIlx1NjcwMFx1OEZEMSAxMCBcdTVFNzRcIixcbiAgICBcImFsbFwiOiBcIlx1NTE2OFx1OTBFOFx1NkI3N1x1NTNGMlx1N0QwMFx1OTMwNFwiLFxuICB9O1xuICBjb25zdCBkYXRlUmFuZ2VMYWJlbCA9IFJBTkdFX0xBQkVMU1tyYW5nZVNlbF0gfHwgYFx1NjcwMFx1OEZEMSAke3JhbmdlU2VsfSBcdTVFNzRgO1xuICBpZiAocmFuZ2VTZWwgIT09IFwiMVwiKSB7XG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGVuZCA9IHRvZGF5LnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgIGxldCBzdGFydDtcbiAgICBpZiAocmFuZ2VTZWwgPT09IFwiYWxsXCIpIHtcbiAgICAgIHN0YXJ0ID0gXCIyMDAxLTAxLTAxXCI7ICAvLyBcdTZDMTFcdTU3MEIgOTAgXHUyMDE0IGZhciBlbm91Z2ggYmFjayBmb3IgYW55IGNsaW5pY2FsIGNhc2VcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeWVhcnMgPSBwYXJzZUludChyYW5nZVNlbCwgMTApO1xuICAgICAgY29uc3QgcyA9IG5ldyBEYXRlKHRvZGF5KTtcbiAgICAgIHMuc2V0RnVsbFllYXIocy5nZXRGdWxsWWVhcigpIC0geWVhcnMpO1xuICAgICAgc3RhcnQgPSBzLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgIH1cbiAgICBkYXRlUmFuZ2UgPSB7IHN0YXJ0LCBlbmQgfTtcbiAgfVxuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcInN0YXJ0TmhpQXBpU3luY1wiLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIHRhYklkOiB0YWIuaWQsXG4gICAgICBtb2RlOiBjdXJyZW50TW9kZSgpLFxuICAgICAgYmFja2VuZDogZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLFxuICAgICAgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpLFxuICAgICAgbmhpQmFzZTogXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3XCIsXG4gICAgICBwYXRpZW50T3ZlcnJpZGU6IG92LFxuICAgICAgZGF0ZVJhbmdlLFxuICAgICAgZGF0ZVJhbmdlTGFiZWwsXG4gICAgfSxcbiAgfSkuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsYXVuY2goKSB7XG4gIGNvbnN0IGJhY2tlbmQgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGNvbnN0IHJhd0lkID0gb3Y/LmlkX25vO1xuICBjb25zdCBzbWFydEFwcExhdW5jaCA9IGVscy5zbWFydEFwcFVybC52YWx1ZS50cmltKCkgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBpZiAoIXJhd0lkKSB7XG4gICAgc2V0U3RhdHVzKFwiXHU5MDg0XHU2QzkyXHU2NzA5XHU3NUM1XHU0RUJBXHU4RUFCXHU1MjA2XHU4QjQ5IFx1MjAxNCBcdThBQ0JcdTUxNDhcdTYzMDlcdTMwMENcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTMwMERcdTYyOTNcdTRFMDBcdTZCMjFcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gQmFja2VuZCB0cmFja3MgUGF0aWVudCB1bmRlciBpdHMgaGFzaGVkIEZISVIgaWQsIG5vdCB0aGUgcmF3IG5hdGlvbmFsIElELlxuICBjb25zdCBwYXRpZW50SWQgPSBkZXJpdmVQYXRpZW50SWQocmF3SWQpO1xuICAvLyBSZS10ZXN0IGNvbm5lY3Rpb24gZXZlbiBpZiBiYW5uZXIgc2hvd3Mgb2sgXHUyMDE0IGJhY2tlbmQgbWF5IGhhdmUgZ29uZVxuICAvLyBkb3duIHNpbmNlIHRoZSBsYXN0IHByb2JlLlxuICBjb25zdCBvayA9IGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICBpZiAoIW9rKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NUY4Q1x1N0FFRlx1OTAyM1x1N0REQVx1NTkzMVx1NjU1NyBcdTIwMTQgXHU4QUNCXHU3NzBCXHU5ODAyXHU5MEU4IGJhbm5lciBcdTc2ODRcdThBQUFcdTY2MEVcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgc2V0U3RhdHVzKFwiXHU1RUZBXHU3QUNCIGxhdW5jaCBjb250ZXh0XHUyMDI2XCIsIFwiaW5mb1wiKTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zbWFydC9sYXVuY2gtY29udGV4dGAsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhdGllbnRfaWQ6IHBhdGllbnRJZCB9KSxcbiAgICB9KTtcbiAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKGAke3Jlcy5zdGF0dXN9OiAke2F3YWl0IHJlcy50ZXh0KCl9YCk7XG4gICAgY29uc3QgeyBsYXVuY2ggfSA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7IGlzczogYCR7YmFja2VuZH0vZmhpcmAsIGxhdW5jaCB9KTtcbiAgICAvLyBBcHBlbmQgaXNzICsgbGF1bmNoIHBhcmFtcywgcmVzcGVjdGluZyBhbnkgZXhpc3RpbmcgcXVlcnkgc3RyaW5nLlxuICAgIGNvbnN0IHNlcCA9IHNtYXJ0QXBwTGF1bmNoLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCI7XG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBgJHtzbWFydEFwcExhdW5jaH0ke3NlcH0ke3BhcmFtc31gIH0pO1xuICAgIHdpbmRvdy5jbG9zZSgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgc2V0U3RhdHVzKGBcdTI3NEMgTGF1bmNoIFx1NTkzMVx1NjU1N1x1RkYxQSR7ZS5tZXNzYWdlfWAsIFwiZXJyb3JcIik7XG4gIH1cbn1cblxuZWxzLnN5bmNBcGlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFwaVN5bmNOaGkpO1xuZWxzLnN0b3BCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0b3BTeW5jKTtcbmVscy5vdlNhdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNhdmVQYXRpZW50T3ZlcnJpZGUpO1xuZWxzLm92Q2xlYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsZWFyUGF0aWVudE92ZXJyaWRlKTtcbltlbHMub3ZOYW1lLCBlbHMub3ZCaXJ0aERhdGUsIGVscy5vdkdlbmRlcl0uZm9yRWFjaCgoZWwpID0+XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KVxuKTtcbmVscy5sYXVuY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxhdW5jaCk7XG5cbi8vIFwiXHU1M0Q2XHU1Rjk3XHU1QzBEXHU4QzYxXCIgYmFubmVyOiBjbGljayAvIEVudGVyIC8gU3BhY2UganVtcHMgYmFjayB0byBzdGVwIDIgYW5kXG4vLyBleHBhbmRzIHRoZSBwYXRpZW50IGNhcmQgc28gdGhlIHVzZXIgY2FuIGFkanVzdCB0aGUgaWRlbnRpdHkuXG5mdW5jdGlvbiBfZ290b1N0ZXAyRWRpdCgpIHtcbiAgX3NldEFjdGl2ZVN0ZXAoMik7XG59XG5lbHMuYWN0aXZlUGF0aWVudD8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9nb3RvU3RlcDJFZGl0KTtcbmVscy5hY3RpdmVQYXRpZW50Py5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIiB8fCBlLmtleSA9PT0gXCIgXCIpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgX2dvdG9TdGVwMkVkaXQoKTtcbiAgfVxufSk7XG5cbmluaXQoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBU0EsT0FBQyxXQUFXO0FBQ1Y7QUFFQSxZQUFJLGNBQWM7QUFDbEIsWUFBSSxpQkFBaUI7QUFDckIsWUFBSSxTQUFTLE9BQU8sV0FBVztBQUMvQixZQUFJLE9BQU8sU0FBUyxTQUFTLENBQUM7QUFDOUIsWUFBSSxLQUFLLG1CQUFtQjtBQUMxQixtQkFBUztBQUFBLFFBQ1g7QUFDQSxZQUFJLGFBQWEsQ0FBQyxVQUFVLE9BQU8sU0FBUztBQUM1QyxZQUFJLFVBQVUsQ0FBQyxLQUFLLHNCQUFzQixPQUFPLFlBQVksWUFBWSxRQUFRLFlBQVksUUFBUSxTQUFTO0FBQzlHLFlBQUksU0FBUztBQUNYLGlCQUFPO0FBQUEsUUFDVCxXQUFXLFlBQVk7QUFDckIsaUJBQU87QUFBQSxRQUNUO0FBQ0EsWUFBSSxZQUFZLENBQUMsS0FBSyx3QkFBd0IsT0FBTyxXQUFXLFlBQVksT0FBTztBQUNuRixZQUFJLE1BQU0sT0FBTyxXQUFXLGNBQWMsT0FBTztBQUNqRCxZQUFJLGVBQWUsQ0FBQyxLQUFLLDJCQUEyQixPQUFPLGdCQUFnQjtBQUMzRSxZQUFJLFlBQVksbUJBQW1CLE1BQU0sRUFBRTtBQUMzQyxZQUFJLFFBQVEsQ0FBQyxhQUFhLFNBQVMsT0FBTyxHQUFHO0FBQzdDLFlBQUksUUFBUSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7QUFDekIsWUFBSSxlQUFlLENBQUMsT0FBTyxTQUFTLFVBQVUsYUFBYTtBQUUzRCxZQUFJLFNBQVMsQ0FBQztBQUVkLFlBQUksVUFBVSxNQUFNO0FBQ3BCLFlBQUksS0FBSyxzQkFBc0IsQ0FBQyxTQUFTO0FBQ3ZDLG9CQUFVLFNBQVUsS0FBSztBQUN2QixtQkFBTyxPQUFPLFVBQVUsU0FBUyxLQUFLLEdBQUcsTUFBTTtBQUFBLFVBQ2pEO0FBQUEsUUFDRjtBQUVBLFlBQUksU0FBUyxZQUFZO0FBQ3pCLFlBQUksaUJBQWlCLEtBQUssbUNBQW1DLENBQUMsU0FBUztBQUNyRSxtQkFBUyxTQUFVLEtBQUs7QUFDdEIsbUJBQU8sT0FBTyxRQUFRLFlBQVksSUFBSSxVQUFVLElBQUksT0FBTyxnQkFBZ0I7QUFBQSxVQUM3RTtBQUFBLFFBQ0Y7QUFHQSxZQUFJLGdCQUFnQixTQUFVLFNBQVM7QUFDckMsY0FBSSxPQUFPLE9BQU87QUFDbEIsY0FBSSxTQUFTLFVBQVU7QUFDckIsbUJBQU8sQ0FBQyxTQUFTLElBQUk7QUFBQSxVQUN2QjtBQUNBLGNBQUksU0FBUyxZQUFZLFlBQVksTUFBTTtBQUN6QyxrQkFBTSxJQUFJLE1BQU0sV0FBVztBQUFBLFVBQzdCO0FBQ0EsY0FBSSxnQkFBZ0IsUUFBUSxnQkFBZ0IsYUFBYTtBQUN2RCxtQkFBTyxDQUFDLElBQUksV0FBVyxPQUFPLEdBQUcsS0FBSztBQUFBLFVBQ3hDO0FBQ0EsY0FBSSxDQUFDLFFBQVEsT0FBTyxLQUFLLENBQUMsT0FBTyxPQUFPLEdBQUc7QUFDekMsa0JBQU0sSUFBSSxNQUFNLFdBQVc7QUFBQSxVQUM3QjtBQUNBLGlCQUFPLENBQUMsU0FBUyxLQUFLO0FBQUEsUUFDeEI7QUFFQSxZQUFJLHFCQUFxQixTQUFVLFlBQVk7QUFDN0MsaUJBQU8sU0FBVSxTQUFTO0FBQ3hCLG1CQUFPLElBQUksS0FBSyxJQUFJLEVBQUUsT0FBTyxPQUFPLEVBQUUsVUFBVSxFQUFFO0FBQUEsVUFDcEQ7QUFBQSxRQUNGO0FBRUEsWUFBSSxlQUFlLFdBQVk7QUFDN0IsY0FBSSxTQUFTLG1CQUFtQixLQUFLO0FBQ3JDLGNBQUksU0FBUztBQUNYLHFCQUFTLFNBQVMsTUFBTTtBQUFBLFVBQzFCO0FBQ0EsaUJBQU8sU0FBUyxXQUFZO0FBQzFCLG1CQUFPLElBQUksS0FBSztBQUFBLFVBQ2xCO0FBQ0EsaUJBQU8sU0FBUyxTQUFVLFNBQVM7QUFDakMsbUJBQU8sT0FBTyxPQUFPLEVBQUUsT0FBTyxPQUFPO0FBQUEsVUFDdkM7QUFDQSxtQkFBUyxJQUFJLEdBQUcsSUFBSSxhQUFhLFFBQVEsRUFBRSxHQUFHO0FBQzVDLGdCQUFJLE9BQU8sYUFBYSxDQUFDO0FBQ3pCLG1CQUFPLElBQUksSUFBSSxtQkFBbUIsSUFBSTtBQUFBLFVBQ3hDO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBRUEsWUFBSSxXQUFXLFNBQVUsUUFBUTtBQUMvQixjQUFJQSxVQUFTO0FBQ2IsY0FBSUMsVUFBUyxpQkFBa0I7QUFDL0IsY0FBSTtBQUNKLGNBQUlBLFFBQU8sUUFBUSxDQUFDLEtBQUssd0JBQXdCO0FBQy9DLHlCQUFhQSxRQUFPO0FBQUEsVUFDdEIsT0FBTztBQUNMLHlCQUFhLFNBQVUsU0FBUztBQUM5QixxQkFBTyxJQUFJQSxRQUFPLE9BQU87QUFBQSxZQUMzQjtBQUFBLFVBQ0Y7QUFDQSxjQUFJLGFBQWEsU0FBVSxTQUFTO0FBQ2xDLGdCQUFJLE9BQU8sWUFBWSxVQUFVO0FBQy9CLHFCQUFPRCxRQUFPLFdBQVcsTUFBTSxFQUFFLE9BQU8sU0FBUyxNQUFNLEVBQUUsT0FBTyxLQUFLO0FBQUEsWUFDdkUsT0FBTztBQUNMLGtCQUFJLFlBQVksUUFBUSxZQUFZLFFBQVc7QUFDN0Msc0JBQU0sSUFBSSxNQUFNLFdBQVc7QUFBQSxjQUM3QixXQUFXLFFBQVEsZ0JBQWdCLGFBQWE7QUFDOUMsMEJBQVUsSUFBSSxXQUFXLE9BQU87QUFBQSxjQUNsQztBQUFBLFlBQ0Y7QUFDQSxnQkFBSSxRQUFRLE9BQU8sS0FBSyxPQUFPLE9BQU8sS0FDcEMsUUFBUSxnQkFBZ0JDLFNBQVE7QUFDaEMscUJBQU9ELFFBQU8sV0FBVyxNQUFNLEVBQUUsT0FBTyxXQUFXLE9BQU8sQ0FBQyxFQUFFLE9BQU8sS0FBSztBQUFBLFlBQzNFLE9BQU87QUFDTCxxQkFBTyxPQUFPLE9BQU87QUFBQSxZQUN2QjtBQUFBLFVBQ0Y7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxZQUFJLHlCQUF5QixTQUFVLFlBQVk7QUFDakQsaUJBQU8sU0FBVSxLQUFLLFNBQVM7QUFDN0IsbUJBQU8sSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFLE9BQU8sT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUFBLFVBQzdEO0FBQUEsUUFDRjtBQUVBLFlBQUksbUJBQW1CLFdBQVk7QUFDakMsY0FBSSxTQUFTLHVCQUF1QixLQUFLO0FBQ3pDLGlCQUFPLFNBQVMsU0FBVSxLQUFLO0FBQzdCLG1CQUFPLElBQUksU0FBUyxHQUFHO0FBQUEsVUFDekI7QUFDQSxpQkFBTyxTQUFTLFNBQVUsS0FBSyxTQUFTO0FBQ3RDLG1CQUFPLE9BQU8sT0FBTyxHQUFHLEVBQUUsT0FBTyxPQUFPO0FBQUEsVUFDMUM7QUFDQSxtQkFBUyxJQUFJLEdBQUcsSUFBSSxhQUFhLFFBQVEsRUFBRSxHQUFHO0FBQzVDLGdCQUFJLE9BQU8sYUFBYSxDQUFDO0FBQ3pCLG1CQUFPLElBQUksSUFBSSx1QkFBdUIsSUFBSTtBQUFBLFVBQzVDO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBRUEsaUJBQVMsS0FBSyxjQUFjO0FBQzFCLGNBQUksY0FBYztBQUNoQixtQkFBTyxDQUFDLElBQUksT0FBTyxFQUFFLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQ3pELE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUM1QyxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUUsSUFDOUMsT0FBTyxFQUFFLElBQUksT0FBTyxFQUFFLElBQUksT0FBTyxFQUFFLElBQUksT0FBTyxFQUFFLElBQUk7QUFDcEQsaUJBQUssU0FBUztBQUFBLFVBQ2hCLE9BQU87QUFDTCxpQkFBSyxTQUFTLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQUEsVUFDbEU7QUFFQSxlQUFLLEtBQUs7QUFDVixlQUFLLEtBQUs7QUFDVixlQUFLLEtBQUs7QUFDVixlQUFLLEtBQUs7QUFDVixlQUFLLEtBQUs7QUFFVixlQUFLLFFBQVEsS0FBSyxRQUFRLEtBQUssUUFBUSxLQUFLLFNBQVM7QUFDckQsZUFBSyxZQUFZLEtBQUssU0FBUztBQUMvQixlQUFLLFFBQVE7QUFBQSxRQUNmO0FBRUEsYUFBSyxVQUFVLFNBQVMsU0FBVSxTQUFTO0FBQ3pDLGNBQUksS0FBSyxXQUFXO0FBQ2xCLGtCQUFNLElBQUksTUFBTSxjQUFjO0FBQUEsVUFDaEM7QUFFQSxjQUFJLFNBQVMsY0FBYyxPQUFPO0FBQ2xDLG9CQUFVLE9BQU8sQ0FBQztBQUNsQixjQUFJLFdBQVcsT0FBTyxDQUFDO0FBQ3ZCLGNBQUksTUFBTSxRQUFRLEdBQUcsR0FBRyxTQUFTLFFBQVEsVUFBVSxHQUFHRSxVQUFTLEtBQUs7QUFFcEUsaUJBQU8sUUFBUSxRQUFRO0FBQ3JCLGdCQUFJLEtBQUssUUFBUTtBQUNmLG1CQUFLLFNBQVM7QUFDZCxjQUFBQSxRQUFPLENBQUMsSUFBSSxLQUFLO0FBQ2pCLG1CQUFLLFFBQVFBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUMxREEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQzVDQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFDOUNBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUFJO0FBQUEsWUFDdEQ7QUFFQSxnQkFBRyxVQUFVO0FBQ1gsbUJBQUssSUFBSSxLQUFLLE9BQU8sUUFBUSxVQUFVLElBQUksSUFBSSxFQUFFLE9BQU87QUFDdEQsdUJBQU8sUUFBUSxXQUFXLEtBQUs7QUFDL0Isb0JBQUksT0FBTyxLQUFNO0FBQ2Ysa0JBQUFBLFFBQU8sTUFBTSxDQUFDLEtBQUssUUFBUSxNQUFNLE1BQU0sQ0FBQztBQUFBLGdCQUMxQyxXQUFXLE9BQU8sTUFBTztBQUN2QixrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFRLFNBQVMsTUFBTyxNQUFNLE1BQU0sQ0FBQztBQUN6RCxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFRLE9BQU8sT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUFBLGdCQUM1RCxXQUFXLE9BQU8sU0FBVSxRQUFRLE9BQVE7QUFDMUMsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUSxTQUFTLE9BQVEsTUFBTSxNQUFNLENBQUM7QUFDMUQsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUyxTQUFTLElBQUssT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUNsRSxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFRLE9BQU8sT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUFBLGdCQUM1RCxPQUFPO0FBQ0wseUJBQU8sVUFBYSxPQUFPLFNBQVUsS0FBTyxRQUFRLFdBQVcsRUFBRSxLQUFLLElBQUk7QUFDMUUsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUSxTQUFTLE9BQVEsTUFBTSxNQUFNLENBQUM7QUFDMUQsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUyxTQUFTLEtBQU0sT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUNuRSxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFTLFNBQVMsSUFBSyxPQUFVLE1BQU0sTUFBTSxDQUFDO0FBQ2xFLGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVEsT0FBTyxPQUFVLE1BQU0sTUFBTSxDQUFDO0FBQUEsZ0JBQzVEO0FBQUEsY0FDRjtBQUFBLFlBQ0YsT0FBTztBQUNMLG1CQUFLLElBQUksS0FBSyxPQUFPLFFBQVEsVUFBVSxJQUFJLElBQUksRUFBRSxPQUFPO0FBQ3RELGdCQUFBQSxRQUFPLE1BQU0sQ0FBQyxLQUFLLFFBQVEsS0FBSyxLQUFLLE1BQU0sTUFBTSxDQUFDO0FBQUEsY0FDcEQ7QUFBQSxZQUNGO0FBRUEsaUJBQUssZ0JBQWdCO0FBQ3JCLGlCQUFLLFNBQVMsSUFBSSxLQUFLO0FBQ3ZCLGdCQUFJLEtBQUssSUFBSTtBQUNYLG1CQUFLLFFBQVFBLFFBQU8sRUFBRTtBQUN0QixtQkFBSyxRQUFRLElBQUk7QUFDakIsbUJBQUssS0FBSztBQUNWLG1CQUFLLFNBQVM7QUFBQSxZQUNoQixPQUFPO0FBQ0wsbUJBQUssUUFBUTtBQUFBLFlBQ2Y7QUFBQSxVQUNGO0FBQ0EsY0FBSSxLQUFLLFFBQVEsWUFBWTtBQUMzQixpQkFBSyxVQUFVLEtBQUssUUFBUSxjQUFjO0FBQzFDLGlCQUFLLFFBQVEsS0FBSyxRQUFRO0FBQUEsVUFDNUI7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxhQUFLLFVBQVUsV0FBVyxXQUFZO0FBQ3BDLGNBQUksS0FBSyxXQUFXO0FBQ2xCO0FBQUEsVUFDRjtBQUNBLGVBQUssWUFBWTtBQUNqQixjQUFJQSxVQUFTLEtBQUssUUFBUSxJQUFJLEtBQUs7QUFDbkMsVUFBQUEsUUFBTyxFQUFFLElBQUksS0FBSztBQUNsQixVQUFBQSxRQUFPLE1BQU0sQ0FBQyxLQUFLLE1BQU0sSUFBSSxDQUFDO0FBQzlCLGVBQUssUUFBUUEsUUFBTyxFQUFFO0FBQ3RCLGNBQUksS0FBSyxJQUFJO0FBQ1gsZ0JBQUksQ0FBQyxLQUFLLFFBQVE7QUFDaEIsbUJBQUssS0FBSztBQUFBLFlBQ1o7QUFDQSxZQUFBQSxRQUFPLENBQUMsSUFBSSxLQUFLO0FBQ2pCLFlBQUFBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUM3Q0EsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQzVDQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFDOUNBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUFJO0FBQUEsVUFDdEQ7QUFDQSxVQUFBQSxRQUFPLEVBQUUsSUFBSSxLQUFLLFVBQVUsSUFBSSxLQUFLLFVBQVU7QUFDL0MsVUFBQUEsUUFBTyxFQUFFLElBQUksS0FBSyxTQUFTO0FBQzNCLGVBQUssS0FBSztBQUFBLFFBQ1o7QUFFQSxhQUFLLFVBQVUsT0FBTyxXQUFZO0FBQ2hDLGNBQUksSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLO0FBQ2pFLGNBQUksR0FBRyxHQUFHLEdBQUdBLFVBQVMsS0FBSztBQUUzQixlQUFJLElBQUksSUFBSSxJQUFJLElBQUksRUFBRSxHQUFHO0FBQ3ZCLGdCQUFJQSxRQUFPLElBQUksQ0FBQyxJQUFJQSxRQUFPLElBQUksQ0FBQyxJQUFJQSxRQUFPLElBQUksRUFBRSxJQUFJQSxRQUFPLElBQUksRUFBRTtBQUNsRSxZQUFBQSxRQUFPLENBQUMsSUFBTSxLQUFLLElBQU0sTUFBTTtBQUFBLFVBQ2pDO0FBRUEsZUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRztBQUN6QixnQkFBSyxJQUFJLElBQU8sQ0FBQyxJQUFLO0FBQ3RCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sQ0FBQyxLQUFLO0FBQzFDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTyxDQUFDLElBQUs7QUFDdEIsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU8sQ0FBQyxJQUFLO0FBQ3RCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUssSUFBSSxJQUFPLENBQUMsSUFBSztBQUN0QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTyxDQUFDLElBQUs7QUFDdEIsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUFBLFVBQ3pCO0FBRUEsaUJBQU0sSUFBSSxJQUFJLEtBQUssR0FBRztBQUNwQixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLENBQUMsS0FBSztBQUMxQyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBQUEsVUFDekI7QUFFQSxpQkFBTSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ3BCLGdCQUFLLElBQUksSUFBTSxJQUFJLElBQU0sSUFBSTtBQUM3QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLENBQUMsS0FBSztBQUMxQyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU0sSUFBSSxJQUFNLElBQUk7QUFDN0IsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU0sSUFBSSxJQUFNLElBQUk7QUFDN0IsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU0sSUFBSSxJQUFNLElBQUk7QUFDN0IsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU0sSUFBSSxJQUFNLElBQUk7QUFDN0IsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUFBLFVBQ3pCO0FBRUEsaUJBQU0sSUFBSSxJQUFJLEtBQUssR0FBRztBQUNwQixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxZQUFZQSxRQUFPLENBQUMsS0FBSztBQUN6QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxZQUFZQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzdDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLFlBQVlBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDN0MsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksWUFBWUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM3QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxZQUFZQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzdDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBQUEsVUFDekI7QUFFQSxlQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFDekIsZUFBSyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQ3pCLGVBQUssS0FBSyxLQUFLLEtBQUssS0FBSztBQUN6QixlQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFDekIsZUFBSyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQUEsUUFDM0I7QUFFQSxhQUFLLFVBQVUsTUFBTSxXQUFZO0FBQy9CLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLO0FBRXRFLGlCQUFPLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUk7QUFBQSxRQUMzRDtBQUVBLGFBQUssVUFBVSxXQUFXLEtBQUssVUFBVTtBQUV6QyxhQUFLLFVBQVUsU0FBUyxXQUFZO0FBQ2xDLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLO0FBRXRFLGlCQUFPO0FBQUEsWUFDSixPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxJQUFLO0FBQUEsWUFBTSxLQUFLO0FBQUEsWUFDL0QsT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sSUFBSztB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QUEsUUFDekQsUUFBUTtBQUFBLFFBQ1IsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUI7QUFBQSxRQUM5QyxNQUFNLEtBQUssVUFBVSxFQUFFLFlBQVksVUFBVSxDQUFDO0FBQUEsTUFDaEQsQ0FBQztBQUNELFVBQUksQ0FBQyxJQUFJLEdBQUksT0FBTSxJQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLEVBQUU7QUFDakUsWUFBTSxFQUFFLFFBQUFDLFFBQU8sSUFBSSxNQUFNLElBQUksS0FBSztBQUNsQyxZQUFNLFNBQVMsSUFBSSxnQkFBZ0IsRUFBRSxLQUFLLEdBQUcsT0FBTyxTQUFTLFFBQUFBLFFBQU8sQ0FBQztBQUVyRSxZQUFNLE1BQU0sZUFBZSxTQUFTLEdBQUcsSUFBSSxNQUFNO0FBQ2pELGFBQU8sS0FBSyxPQUFPLEVBQUUsS0FBSyxHQUFHLGNBQWMsR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUM7QUFDOUQsYUFBTyxNQUFNO0FBQUEsSUFDZixTQUFTLEdBQUc7QUFDVixnQkFBVSxtQ0FBZSxFQUFFLE9BQU8sSUFBSSxPQUFPO0FBQUEsSUFDL0M7QUFBQSxFQUNGO0FBRUEsTUFBSSxXQUFXLGlCQUFpQixTQUFTLFVBQVU7QUFDbkQsTUFBSSxRQUFRLGlCQUFpQixTQUFTLFFBQVE7QUFDOUMsTUFBSSxVQUFVLGlCQUFpQixTQUFTLG1CQUFtQjtBQUMzRCxNQUFJLFdBQVcsaUJBQWlCLFNBQVMsb0JBQW9CO0FBQzdELEdBQUMsSUFBSSxRQUFRLElBQUksYUFBYSxJQUFJLFFBQVEsRUFBRTtBQUFBLElBQVEsQ0FBQyxPQUNuRCxHQUFHLGlCQUFpQixTQUFTLHNCQUFzQjtBQUFBLEVBQ3JEO0FBQ0EsTUFBSSxVQUFVLGlCQUFpQixTQUFTLE1BQU07QUFJOUMsV0FBUyxpQkFBaUI7QUFDeEIsbUJBQWUsQ0FBQztBQUFBLEVBQ2xCO0FBQ0EsTUFBSSxlQUFlLGlCQUFpQixTQUFTLGNBQWM7QUFDM0QsTUFBSSxlQUFlLGlCQUFpQixXQUFXLENBQUMsTUFBTTtBQUNwRCxRQUFJLEVBQUUsUUFBUSxXQUFXLEVBQUUsUUFBUSxLQUFLO0FBQ3RDLFFBQUUsZUFBZTtBQUNqQixxQkFBZTtBQUFBLElBQ2pCO0FBQUEsRUFDRixDQUFDO0FBRUQsT0FBSzsiLAogICJuYW1lcyI6IFsiY3J5cHRvIiwgIkJ1ZmZlciIsICJibG9ja3MiLCAiZXhwb3J0cyIsICJsYXVuY2giXQp9Cg==
