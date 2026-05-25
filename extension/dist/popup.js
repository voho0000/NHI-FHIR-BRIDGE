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
    const _norm = (v) => v == null ? "" : String(v);
    const patientChanged = !!prevStored && (_norm(prevStored.id_no) !== _norm(ov.id_no) || _norm(prevStored.name) !== _norm(ov.name) || _norm(prevStored.gender) !== _norm(ov.gender) || _norm(prevStored.birth_date) !== _norm(ov.birth_date));
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBPTkxZIGFcbiAqIGhhc2hlZCBQYXRpZW50LmlkIChlLmcuIHZpYSBhbiBIVFRQIGFjY2VzcyBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGVcbiAqIH4zME0gVGFpd2FuZXNlIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdFxuICogdGhpcyBiZWNhdXNlIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3XG4gKiBuYXRpb25hbCBJRCBpbiBhbnkgbGVha2VkIEJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBCdW5kbGUtbGVha1xuICogc2NlbmFyaW9zIGRpc2Nsb3NlIGJvdGggZmllbGRzIHRvZ2V0aGVyLCBzbyBhIHNhbHQgd291bGQgbm90IG1vdmVcbiAqIHRoZSBuZWVkbGUgdGhlcmUuIFRoZSByZW1haW5pbmcgc2luZ2xlLWZpZWxkIGxlYWsgdmVjdG9yIGlzIEhUVFBcbiAqIGFjY2VzcyBsb2dzOyBkZXBsb3ltZW50cyBzaG91bGQgc2NydWIgYC9maGlyL1BhdGllbnQvW14vXStgIHBhdGhzXG4gKiBhbmQgYD9wYXRpZW50PWAgcXVlcnkgc3RyaW5ncyBhdCB0aGUgcmV2ZXJzZS1wcm94eSBsYXllciAoc2VlXG4gKiBBUkNISVRFQ1RVUkUubWQgXHUwMEE3XCJQYXRpZW50LmlkIFx1NTNDRFx1NjNBOFx1OThBOFx1OTZBQVx1ODIwN1x1N0RFOVx1ODlFM1wiKS5cbiAqXG4gKiBVc2VzIGBqcy1zaGExYCAocHVyZSBKUykgaW5zdGVhZCBvZiBgbm9kZTpjcnlwdG9gIHNvIHRoZSBzYW1lIG1hcHBlclxuICogY29kZSBydW5zIHVubW9kaWZpZWQgaW4gdGhlIENocm9tZSBleHRlbnNpb24ncyBsb2NhbC1vbmx5IG1vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVJZChwYXRpZW50SWQ6IHN0cmluZywgLi4ucGFydHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW3BhdGllbnRJZCwgLi4ucGFydHNdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogTWFwIGEgcmF3IG5hdGlvbmFsIElEIChvciBhbnkgcGF0aWVudCBpZGVudGlmaWVyKSB0byBpdHMgMzItY2hhciBoZXhcbiAqIEZISVIgYFBhdGllbnQuaWRgLiBUaGUgcmF3IHZhbHVlIGlzIGtlcHQgaW4gYFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlYFxuICogXHUyMDE0IG9ubHkgdGhlIEZISVIgbG9naWNhbCBpZCBpcyBoYXNoZWQgc28gaXQgZG9lc24ndCBsZWFrIGludG8gVVJMcyxcbiAqIHN1YmplY3QucmVmZXJlbmNlIGZpZWxkcywgYXVkaXQgbG9ncywgb3IgU01BUlQgdG9rZW4gcGF5bG9hZHMuXG4gKlxuICogRkhJUiBSNCBcdTAwQTcyLjIwIHNheXMgXCJsb2dpY2FsIGlkIFx1MjAyNiBTSE9VTEQgTk9UIGNvbnRhaW4gaWRlbnRpZnlpbmdcbiAqIGluZm9ybWF0aW9uXCIgXHUyMDE0IHRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVQYXRpZW50SWQobmF0aW9uYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW1wicGF0aWVudFwiLCBuYXRpb25hbElkXS5qb2luKFwifFwiKSkuc2xpY2UoMCwgMzIpO1xufVxuXG4vKipcbiAqIFBhcnRpYWxseS1hbm9ueW1pemUgYSBwYXRpZW50IG5hbWUuIEFwcGxpZWQgaW4gbWFwUGF0aWVudCBzbyBldmVyeVxuICogRkhJUiByZXNvdXJjZSB0aGF0IGZsb3dzIG91dCBvZiB0aGlzIGNvZGViYXNlIChkb3dubG9hZGVkIEJ1bmRsZSxcbiAqIGJhY2tlbmQgRkhJUiBzdG9yZSwgZGFzaGJvYXJkLCBTTUFSVCBhcHAgbGF1bmNoZXMpIHNlZXMgdGhlIG1hc2tlZFxuICogZm9ybS4gVGhlIHVzZXIncyByYXcgaW5wdXQgaXMgc3RpbGwga2VwdCBpbiBjaHJvbWUuc3RvcmFnZSBzbyB0aGV5XG4gKiBjYW4gcmV2aWV3IHdoYXQgd2FzIGVudGVyZWQsIGJ1dCBpdCBuZXZlciBsZWF2ZXMgUGF0aWVudCBjb250ZXh0LlxuICpcbiAqIFJ1bGVzIChUYWl3YW4gLyBDSksgY29udmVudGlvbik6XG4gKiAgIC0gMSBjaGFyICAgICBcdTIxOTIga2VlcCBhcy1pcyAobm90aGluZyB0byBtYXNrKVxuICogICAtIDIgY2hhcnMgICAgXHUyMTkyIGtlZXAgZmlyc3QsIHJlcGxhY2Ugc2Vjb25kIHdpdGggTyAgICBcdTczOEJcdTY2MEUgXHUyMTkyIFx1NzM4Qk9cbiAqICAgLSAzKyBjaGFycyAgIFx1MjE5MiBrZWVwIGZpcnN0ICsgbGFzdCwgbWlkZGxlIGFsbCBPICAgICAgXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTY3OTdcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1Njc5N09PXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTRFMkRcdTVDRjZcdTUwNjVcdTZCMjFcdTkwQ0UgXHUyMTkyIFx1NEUyRE9PT1x1OTBDRVxuICpcbiAqIFdlc3Rlcm4gbmFtZXMgKGNvbnRhaW4gd2hpdGVzcGFjZSk6IHNwbGl0IG9uIHNwYWNlLCBrZWVwIGZpcnN0ICtcbiAqIGxhc3QgdG9rZW5zLCBwYXJ0aWFsLW1hc2sgdGhlIGxhc3QgYW5kIG1pZGRsZTpcbiAqICAgSm9obiBTbWl0aCBcdTIxOTIgSm9obiBTKioqXG4gKiAgIEpvaG4gUSBTbWl0aCBcdTIxOTIgSm9obiAqKiogU21pdGhcbiAqL1xuLyoqXG4gKiBIYWxmLW1hc2sgYSBUYWl3YW4gbmF0aW9uYWwgSUQgZm9yIHNob3VsZGVyLXN1cmZpbmctc2FmZSBkaXNwbGF5LlxuICogTWF0Y2hlcyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBJ3Mgb3duIGBoaWRgIGNvbnZlbnRpb24gKGZpcnN0IDYgdmlzaWJsZSwgbGFzdFxuICogNCBoaWRkZW4pOiBgUDEyMzQ1MDg2NmAgXHUyMTkyIGBQMTIzNDUqKioqYC5cbiAqXG4gKiBgY2hhcmAgZGVmYXVsdHMgdG8gYCpgIGZvciBwb3B1cC90b2FzdCBkaXNwbGF5LiBVc2UgYFhgIGZvciBmaWxlbmFtZXNcbiAqIHNpbmNlIGAqYCBpcyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIFRoZSBhdXRvLWdlbmVyYXRlZFxuICogYGF1dG8tWFhYWFhYWFhgIHBsYWNlaG9sZGVycyBmbG93IHRocm91Z2ggdW5jaGFuZ2VkIChhbHJlYWR5XG4gKiBub24taWRlbnRpZnlpbmcpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFza0lkKGlkOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjaGFyID0gXCIqXCIpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKGlkID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gcztcbiAgaWYgKC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChzKSkgcmV0dXJuIHMuc2xpY2UoMCwgNikgKyBjaGFyLnJlcGVhdCg0KTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gcztcbiAgaWYgKHMubGVuZ3RoID4gNikgcmV0dXJuIHMuc2xpY2UoMCwgMikgKyBjaGFyLnJlcGVhdChzLmxlbmd0aCAtIDQpICsgcy5zbGljZSgtMik7XG4gIHJldHVybiBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFza05hbWUobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSAobmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghdHJpbW1lZCB8fCB0cmltbWVkID09PSBcIlVua25vd25cIikgcmV0dXJuIHRyaW1tZWQ7XG5cbiAgaWYgKC9cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoL1xccysvKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSByZXR1cm4gcGFydHNbMF0hO1xuICAgIGNvbnN0IGZpcnN0ID0gcGFydHNbMF0hO1xuICAgIGNvbnN0IGxhc3QgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSE7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gRml4ZWQgMyBzdGFycyByZWdhcmRsZXNzIG9mIG9yaWdpbmFsIGxlbmd0aCBcdTIwMTQgZG9uJ3QgbGVhayBob3dcbiAgICAgIC8vIGxvbmcgdGhlIHN1cm5hbWUgd2FzIHZpYSBtYXNrIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxhc3RNYXNrZWQgPSBsYXN0Lmxlbmd0aCA8PSAxID8gbGFzdCA6IGAke2xhc3RbMF19KioqYDtcbiAgICAgIHJldHVybiBgJHtmaXJzdH0gJHtsYXN0TWFza2VkfWA7XG4gICAgfVxuICAgIGNvbnN0IG1pZGRsZXMgPSBwYXJ0cy5zbGljZSgxLCAtMSkubWFwKCgpID0+IFwiKioqXCIpO1xuICAgIHJldHVybiBbZmlyc3QsIC4uLm1pZGRsZXMsIGxhc3RdLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgLy8gQ0pLIC8gc2luZ2xlLXRva2VuIHBhdGguIEl0ZXJhdGUgY29kZXBvaW50cyAobm90IFVURi0xNiB1bml0cykgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyBjYW4ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKHRyaW1tZWQpO1xuICBpZiAoY2hhcnMubGVuZ3RoIDw9IDEpIHJldHVybiB0cmltbWVkO1xuICBpZiAoY2hhcnMubGVuZ3RoID09PSAyKSByZXR1cm4gYCR7Y2hhcnNbMF19T2A7XG4gIHJldHVybiBjaGFyc1swXSArIFwiT1wiLnJlcGVhdChjaGFycy5sZW5ndGggLSAyKSArIGNoYXJzW2NoYXJzLmxlbmd0aCAtIDFdO1xufVxuIiwgIi8qKlxuICogT2JzZXJ2YXRpb24gbWFwcGVyIFx1MjAxNCBzaW5nbGUtcm93IGFuZCBwYW5lbC1ncm91cGVkIHZhcmlhbnRzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9vYnNlcnZhdGlvbi5weWAgKDEyMTIgbGluZXMpLiBJbmNsdWRlczpcbiAqICAgLSBtYXBPYnNlcnZhdGlvbihyYXcsIHBhdGllbnRJZCkgXHUyMTkyIHNpbmdsZSBPYnNlcnZhdGlvblxuICogICAtIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQoaXRlbXMsIHBhdGllbnRJZCkgXHUyMTkyIERpYWdub3N0aWNSZXBvcnQgKyBPYnNlcnZhdGlvbnNcbiAqICAgLSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgXHUyMDE0IGNyb3NzLXBhZ2UgZGVkdXAga2V5XG4gKiAgIC0gZmluZExvaW5jLCBidWlsZENvZGluZ3MsIG1hcEludGVycHJldGF0aW9uLCBkZXJpdmVJbnRlcnByZXRhdGlvblxuICogICAtIGRlZHVwZUNyb3NzRm9ybWF0LCBjb21iaW5lQnBJdGVtcywgZ3JvdXBCeU9yZGVyQ29kZVxuICogICAtIGluZmVyU3BlY2ltZW5cbiAqXG4gKiBGdW5jdGlvbmFsIHBhcml0eSB3aXRoIHRoZSBQeXRob24gaW1wbGVtZW50YXRpb24gaXMgdGhlIGdvYWwuIEZpZWxkXG4gKiBvcmRlciBpbiB0aGUgZW1pdHRlZCByZXNvdXJjZXMgbWF5IGRpZmZlciAoSlMgb2JqZWN0IGxpdGVyYWwgb3JkZXIpXG4gKiBidXQgY29udGVudCBpcyBpZGVudGljYWwuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB7XG4gIERJU1BMQVlfRklSU1RfQ09ERVMsXG4gIExPSU5DX0RJU1BMQVksXG4gIExPSU5DX01BUCxcbiAgTkhJX1RPX0xPSU5DLFxuICBQQU5FTF9MT0lOQ19NQVAsXG59IGZyb20gXCIuL2xvaW5jLXRhYmxlc1wiO1xuaW1wb3J0IHtcbiAgdHlwZSBRdWFudGl0eSxcbiAgdHlwZSBSYW5nZUVudHJ5LFxuICBwYXJzZVJhbmdlLFxuICBwYXJzZVJhbmdlTXVsdGksXG4gIHRvVWN1bSxcbiAgdHJ5UGFyc2VRdWFudGl0eSxcbn0gZnJvbSBcIi4vcGFyc2Vyc1wiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW1hZ2luZyBkZXRlY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElNQUdJTkdfS0VZV09SRFM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgXCJ1bHRyYXNvdW5kXCIsXG4gIFwic29ub2dyYW1cIixcbiAgXCJzb25vZ3JhcGh5XCIsXG4gIFwiZWNob1wiLFxuICBcImN0IFwiLFxuICBcImN0L1wiLFxuICBcImN0LVwiLFxuICBcImNvbXB1dGVkIHRvbW9ncmFwaHlcIixcbiAgXCJtcmlcIixcbiAgXCJtYWduZXRpYyByZXNvbmFuY2VcIixcbiAgXCJ4LXJheVwiLFxuICBcInhyYXlcIixcbiAgXCJ4IHJheVwiLFxuICBcIm1hbW1vZ3JhcGh5XCIsXG4gIFwibWFtbW9cIixcbiAgXCJla2dcIixcbiAgXCJlY2dcIixcbiAgXCJlbGVjdHJvY2FyZGlvZ3JhbVwiLFxuICBcImVuZG9zY29wXCIsXG4gIFwiY29sb25vc2NvcFwiLFxuICBcImdhc3Ryb3Njb3BcIixcbiAgXCJicm9uY2hvc2NvcFwiLFxuICBcInBldC9jdFwiLFxuICBcInBldCBcIixcbiAgXCJzcGVjdFwiLFxuICBcIlx1NUY3MVx1NTBDRlwiLFxuICBcIlx1OEQ4NVx1OTdGM1x1NkNFMlwiLFxuICBcIlx1OTZGQlx1ODE2Nlx1NjVCN1x1NUM2NFwiLFxuICBcIlx1NjgzOFx1NzhDMVx1NTE3MVx1NjMyRlwiLFxuICBcIlx1NUZDM1x1OTZGQlx1NTcxNlwiLFxuICBcIlx1NTE2N1x1ODk5Nlx1OTNFMVwiLFxuICBcIlx1NEU3M1x1NjIzRlx1NjUxRFx1NUY3MVwiLFxuXTtcblxuZnVuY3Rpb24gbG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5OiBzdHJpbmcsIGNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBoYXlzdGFjayA9IGAke2Rpc3BsYXl9ICR7Y29kZX1gLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBJTUFHSU5HX0tFWVdPUkRTLnNvbWUoKGt3KSA9PiBoYXlzdGFjay5pbmNsdWRlcyhrdykpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTE9JTkMgbG9va3VwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBOSElfTEFCX0NPREVfUkUgPSAvXlxcZHs0LDZ9W0EtWl0kLztcblxuZnVuY3Rpb24gaXNBc2NpaU9ubHkoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgPiAxMjcpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuXG4vLyBDaGVjayB3aGV0aGVyIGEgc2luZ2xlIExPSU5DX01BUCBrZXkgbWF0Y2hlcyB0aGUgbGFiJ3MgY29tYmluZWRcbi8vIChjb2RlICsgZGlzcGxheSkgc3RyaW5nLiBUd28gcnVsZXM6XG4vL1xuLy8gMS4gQVNDSUkga2V5czogYFxcYjxrZXk+XFxiYCBcdTIwMTQgd29yZCBib3VuZGFyaWVzIG9uIEJPVEggc2lkZXMuIFRoZVxuLy8gICAgbm8tdHJhaWxpbmctYm91bmRhcnkgc2VtYW50aWMgb2YgdGhlIG9sZGVyIGBcXGI8a2V5PmAgbWF0Y2hlclxuLy8gICAgY2F1c2VkIHNob3J0IGtleXMgbGlrZSBcImhiXCIgKEhlbW9nbG9iaW4pIHRvIGluY29ycmVjdGx5IG1hdGNoXG4vLyAgICBsb25nZXIgdGVybXMgbGlrZSBcImhic2FnXCIgKEhCc0FnKSBhbmQgXCJwaG9zcGhhdGVcIiAobWF0Y2hlZCBieVxuLy8gICAgXCJwaFwiKS4gUmVxdWlyaW5nIGFuIGVuZCBib3VuZGFyeSBtZWFucyBcImhiXCIgb25seSBtYXRjaGVzIHdoZW5cbi8vICAgIGl0IHN0YW5kcyBhcyBpdHMgb3duIHdvcmQuXG4vL1xuLy8gMi4gQ0pLIC8gbm9uLUFTQ0lJIGtleXM6IHBsYWluIHN1YnN0cmluZyBpbmNsdWRlcygpLiBcXGIgZG9lc24ndFxuLy8gICAgc2VtYW50aWNhbGx5IHdvcmsgZm9yIENKSyAobm8gd29yZC1jaGFyYWN0ZXIgY2xhc3MgY29uY2VwdCkuXG5mdW5jdGlvbiBfa2V5d29yZE1hdGNoZXMoa2V5OiBzdHJpbmcsIGNvbWJpbmVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgayA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoayl9XFxcXGJgKS50ZXN0KGNvbWJpbmVkKTtcbiAgfVxuICByZXR1cm4gY29tYmluZWQuaW5jbHVkZXMoayk7XG59XG5cbi8vIFBpY2sgdGhlIExPTkdFU1QgbWF0Y2hpbmcga2V5IGZyb20gdGhlIHRhYmxlLCBub3QgdGhlIGZpcnN0LiBBdm9pZHNcbi8vIHRoZSBzYW1lIGJ1ZyBmYW1pbHkgZnJvbSBhIHNlY29uZCBhbmdsZTogaHlwaGVuYXRlZCBrZXlzIGxpa2Vcbi8vIFwibGRsLWNob2xlc3Rlcm9sXCIgc2hhcmUgYSBgXFxiLi4uXFxiYCBib3VuZGFyeSBhdCB0aGUgaHlwaGVuLCBzbyBcImxkbFwiXG4vLyAoMyBjaGFycykgYWxzbyBtYXRjaGVzIGEgXCJsZGwtY2hvbGVzdGVyb2xcIiBzdHJpbmcuIExvbmdlc3QtbWF0Y2hcbi8vIG1ha2VzIHRoZSBtb3JlIHNwZWNpZmljIGtleSB3aW4gcmVnYXJkbGVzcyBvZiBpbnNlcnRpb24gb3JkZXIsIHNvXG4vLyB0aGUgYnJpdHRsZSBcImxvbmcgbXVzdCBhcHBlYXIgYmVmb3JlIHNob3J0XCIgY29tbWVudHMgc2NhdHRlcmVkXG4vLyB0aHJvdWdoIExPSU5DX01BUCBiZWNvbWUgdW5uZWNlc3NhcnkuXG5mdW5jdGlvbiBfZmluZExvbmdlc3RNYXRjaChcbiAgY29tYmluZWQ6IHN0cmluZyxcbiAgdGFibGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgbGV0IGJlc3RMb2luYzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBiZXN0S2V5TGVuID0gMDtcbiAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXModGFibGUpKSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiBiZXN0S2V5TGVuICYmIF9rZXl3b3JkTWF0Y2hlcyhrZXksIGNvbWJpbmVkKSkge1xuICAgICAgYmVzdExvaW5jID0gbG9pbmM7XG4gICAgICBiZXN0S2V5TGVuID0ga2V5Lmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJlc3RMb2luYztcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJpbWFyeSBMT0lOQyBmb3IgdGhpcyBsYWIuIFBhbmVsLWF3YXJlIGxvb2t1cDpcbiAqICAgQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgXHUyMTkyIHVzZSBOSElfVE9fTE9JTkMgZGlyZWN0bHkuXG4gKiAgIEIuIFBhbmVsIGNvZGUgT1IgdW5rbm93biBjb2RlIFx1MjE5MiB3YWxrIExPSU5DX01BUCBieSBkaXNwbGF5IGtleXdvcmRcbiAqICAgICAgKGxvbmdlc3Qta2V5IG1hdGNoIHdpbnMsIGJvdGgtc2lkZSB3b3JkIGJvdW5kYXJpZXMgZW5mb3JjZWQpLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGNvbnN0IGhpdCA9IF9maW5kTG9uZ2VzdE1hdGNoKGNvbWJpbmVkLCBQQU5FTF9MT0lOQ19NQVBbY29kZV0hKTtcbiAgICBpZiAoaGl0KSByZXR1cm4gaGl0O1xuICB9XG5cbiAgLy8gQi4gRGlzcGxheS1rZXl3b3JkIHNlYXJjaC5cbiAgY29uc3QgaGl0ID0gX2ZpbmRMb25nZXN0TWF0Y2goY29tYmluZWQsIExPSU5DX01BUCk7XG4gIGlmIChoaXQpIHJldHVybiBoaXQ7XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIC8vIFNvdXJjZS1wcm9ncmFtbWUgdGFnIFx1MjAxNCBzZXQgd2hlbiB0aGUgYWRhcHRlciBwdWxsZWQgdGhpcyBvYnNlcnZhdGlvblxuICAvLyBvdXQgb2YgYSBzcGVjaWZpYyBOSEkgc2NyZWVuaW5nIHByb2dyYW1tZSAoZS5nLiBhZGFwdEFkdWx0UHJldmVudGl2ZVxuICAvLyBzZXRzIHNvdXJjZV9wcm9ncmFtPVwiYWR1bHQtcHJldmVudGl2ZVwiKS4gU3VyZmFjZWQgdmlhIE9ic2VydmF0aW9uLlxuICAvLyBtZXRhLnRhZyBzbyBkb3duc3RyZWFtIFNNQVJUIGFwcHMgY2FuIGZpbHRlciBieSBfdGFnIHdpdGhvdXQgbmVlZGluZ1xuICAvLyB0byBrbm93IGFib3V0IG91ciBpbnRlcm5hbCBmaWVsZCBuYW1lcy5cbiAgaWYgKHJhdy5zb3VyY2VfcHJvZ3JhbSkge1xuICAgIHJlc291cmNlLm1ldGEudGFnID0gW1xuICAgICAge1xuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL25oaS1maGlyLWJyaWRnZS9zb3VyY2UtcHJvZ3JhbVwiLFxuICAgICAgICBjb2RlOiBTdHJpbmcocmF3LnNvdXJjZV9wcm9ncmFtKSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQsIG1hc2tJZCwgbWFza05hbWUgfSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgREVGQVVMVF9CQUNLRU5EID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMTBcIjtcbi8vIERlZmF1bHQgU01BUlQgYXBwIGZvciBhIGZyZXNoIGluc3RhbGwuIFVzZXJzIGNhbiBvdmVycmlkZSB2aWFcbi8vIHRoZSAnXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgU01BUlQgQXBwIExhdW5jaCBVUkwnIGZpZWxkOyB0aGUgdmFsdWUgaXNcbi8vIHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlciBgc21hcnRBcHBMYXVuY2hVcmxgLlxuY29uc3QgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpci9zbWFydC9sYXVuY2hcIjtcblxuLy8gVHJ1ZSBpZiB0aGUgYWN0aXZlIHRhYiBpcyBhbiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHBhZ2UgKHJlYWwgc2l0ZSkuXG5mdW5jdGlvbiBpc05oaVRhYih1cmwpIHtcbiAgaWYgKCF1cmwpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IG5ldyBVUkwodXJsKSA6IHVybDtcbiAgICByZXR1cm4gL215aGVhbHRoYmFua1xcLm5oaVxcLmdvdlxcLnR3Ly50ZXN0KHUuaG9zdG5hbWUpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgREVGQVVMVF9NT0RFID0gXCJsb2NhbFwiO1xuXG5jb25zdCBlbHMgPSB7XG4gIG1vZGVSYWRpb3M6ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzeW5jLW1vZGVcIl0nKSxcbiAgYmFja2VuZFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXVybFwiKSxcbiAgc3luY0FwaUtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWFwaS1rZXlcIiksXG4gIHNtYXJ0QXBwVXJsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNtYXJ0LWFwcC11cmxcIiksXG4gIHN5bmNBcGlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGktYnRuXCIpLFxuICBzeW5jQmxvY2tlZFJlYXNvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWJsb2NrZWQtcmVhc29uXCIpLFxuICBhcGlTeW5jUmFuZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBpLXN5bmMtcmFuZ2VcIiksXG4gIHN0b3BCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIiksXG4gIG92TmFtZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1uYW1lXCIpLFxuICBvdkJpcnRoRGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1iaXJ0aC1kYXRlXCIpLFxuICBvdkdlbmRlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1nZW5kZXJcIiksXG4gIG92U2F2ZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1zYXZlLWJ0blwiKSxcbiAgb3ZDbGVhckJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1jbGVhci1idG5cIiksXG4gIG92U3VtbWFyeTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVycmlkZS1zdW1tYXJ5XCIpLFxuICBwYXRpZW50T3ZlcnJpZGVEZXRhaWxzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdGllbnQtb3ZlcnJpZGVcIiksXG4gIGxhdW5jaEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXVuY2gtYnRuXCIpLFxuICBzdGF0dXM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhdHVzXCIpLFxuICBkYXNoYm9hcmRMaW5rOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhc2hib2FyZC1saW5rXCIpLFxuICBwZW5kaW5nQnVuZGxlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBlbmRpbmctYnVuZGxlXCIpLFxuICBkb3dubG9hZEJ1bmRsZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkb3dubG9hZC1idW5kbGUtYnRuXCIpLFxuICBjbGVhckJ1bmRsZUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbGVhci1idW5kbGUtYnRuXCIpLFxuICAvLyBidW5kbGVNZXRhIGxlZ2FjeSBpZCByZW1vdmVkIGluIHRoZSBwYW5lbC1tZXJnZTsgZmlsZW5hbWUrc2l6ZSBub3dcbiAgLy8gbGl2ZSBpbiBkZWRpY2F0ZWQgI2J1bmRsZS1maWxlbmFtZSAvICNidW5kbGUtc2l6ZWFnZSBlbGVtZW50c1xuICAvLyBiZWxvdy5cbiAgY29ubkJhbm5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLWJhbm5lclwiKSxcbiAgY29ublNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1zZWN0aW9uXCIpLFxuICBjb25uTWluaTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLW1pbmlcIiksXG4gIGNvbm5Nc2c6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1tc2dcIiksXG4gIGNvbm5SZXRyeUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLXJldHJ5LWJ0blwiKSxcbiAgY29ubkhlbHA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1oZWxwXCIpLFxuICBkYXRhU3RhdGVTZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGEtc3RhdGUtc2VjdGlvblwiKSxcbiAgYmFja2VuZFN0YXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhY2tlbmQtc3RhdGVcIiksXG4gIGxvY2FsU3RhdGVSb3c6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9jYWwtc3RhdGUtcm93XCIpLFxuICBsb2NhbFN0YXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvY2FsLXN0YXRlXCIpLFxuICBwdXNoTG9jYWxCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHVzaC1sb2NhbC1idG5cIiksXG4gIHN5bmNTdGF0dXNIaW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN5bmMtc3RhdHVzLWhpbnRcIiksXG4gIG1hc2tOYW1lRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXNrLW5hbWUtZW5hYmxlZFwiKSxcbiAgYmFja2VuZE1vZGVFbmFibGVkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhY2tlbmQtbW9kZS1lbmFibGVkXCIpLFxuICBvcGVuTmhpU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW5oaS1zZWN0aW9uXCIpLFxuICBvcGVuTmhpQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tbmhpLWJ0blwiKSxcbiAgbmhpTmVlZHNMb2dpblNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmhpLW5lZWRzLWxvZ2luLXNlY3Rpb25cIiksXG4gIG5oaVJlbG9hZEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuaGktcmVsb2FkLWJ0blwiKSxcbiAgbG9naW5Pa1NlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW4tb2stc2VjdGlvblwiKSxcbiAgd2l6YXJkU3RlcHBlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aXphcmQtc3RlcHBlclwiKSxcbiAgcmVzdWx0Wm9uZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHQtem9uZVwiKSxcbiAgYWN0aXZlUGF0aWVudDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY3RpdmUtcGF0aWVudFwiKSxcbiAgYWN0aXZlUGF0aWVudFZhbHVlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFjdGl2ZS1wYXRpZW50LXZhbHVlXCIpLFxuICBidW5kbGVNZXRhQmxvY2s6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVuZGxlLW1ldGEtYmxvY2tcIiksXG4gIGJ1bmRsZUZpbGVuYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1bmRsZS1maWxlbmFtZVwiKSxcbiAgYnVuZGxlU2l6ZWFnZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidW5kbGUtc2l6ZWFnZVwiKSxcbn07XG5cbmNvbnN0IE5ISV9MQU5ESU5HID0gXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3L0lIS0UzMDAwXCI7XG4vLyBEaXJlY3QgVVJMIG9mIHRoZSBsb2dpbiBwaWNrZXIgcGFnZSAoYSBnZW5lcmljIGxhbmRpbmcgXHUyMTkyIGxvZ2luIHJlZGlyZWN0XG4vLyBoYXBwZW5zIGF1dG9tYXRpY2FsbHkgZm9yIHVuYXV0aGVudGljYXRlZCB2aXNpdHMsIGJ1dCBnb2luZyBzdHJhaWdodFxuLy8gaGVyZSBhbHNvIGhhbmRsZXMgdXNlcnMgc2l0dGluZyBvbiBhIHB1YmxpYyBzdWItcGFnZSBsaWtlIFx1NTU0Rlx1N0I1NFx1NUMwOFx1NTM0MFxuLy8gd2hlcmUgYSBwbGFpbiByZWxvYWQgd291bGQganVzdCByZS1yZW5kZXIgdGhlIHNhbWUgdW4tYXV0aCBwYWdlKS5cbmNvbnN0IE5ISV9MT0dJTl9VUkwgPSBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHcvSUhLRTMwMDAvSUhLRTMwOTVTMDFcIjtcblxuY29uc3QgUEVORElOR19CVU5ETEVfS0VZID0gXCJwZW5kaW5nRmhpckJ1bmRsZVwiO1xuXG4vLyBQZXJzaXN0ZWQtc3RhdGUga2V5cy4gQmFja2VuZCBVUkwgYW5kIEFQSSBrZXkgcGVyc2lzdCBhY3Jvc3MgYnJvd3NlciBzZXNzaW9ucy5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRCYWNrZW5kVXJsKCkge1xuICBjb25zdCB7IGJhY2tlbmRVcmwsIHN5bmNBcGlLZXksIHNtYXJ0QXBwTGF1bmNoVXJsIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXG4gICAgW1wiYmFja2VuZFVybFwiLCBcInN5bmNBcGlLZXlcIiwgXCJzbWFydEFwcExhdW5jaFVybFwiXVxuICApO1xuICBlbHMuYmFja2VuZFVybC52YWx1ZSA9IGJhY2tlbmRVcmwgfHwgREVGQVVMVF9CQUNLRU5EO1xuICBlbHMuc3luY0FwaUtleS52YWx1ZSA9IHN5bmNBcGlLZXkgfHwgXCJcIjtcbiAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gc21hcnRBcHBMYXVuY2hVcmwgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGF0aWVudCBvdmVycmlkZSAobWFudWFsIE5ISSBpZGVudGl0eSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGRvZXNuJ3QgZXhwb3NlIHRoZSB1c2VyJ3MgbmF0aW9uYWwgSUQgaW4gdGhlIFVSTC4gVGhlIHVzZXJcbi8vIGZpbGxzIHRoZXNlIG9uY2UgYW5kIHRoZXkncmUgc2VudCB3aXRoIGV2ZXJ5IHVwbG9hZCBjYWxsIHVudGlsIGNsZWFyZWQuXG5cbi8vIGlkX25vIGlzIG5vIGxvbmdlciBhIFVJIGZpZWxkLCBzbyBnZXRQYXRpZW50T3ZlcnJpZGUoKSAoc3luYywgY2FsbGVkXG4vLyBpbiBtYW55IGhvdCBwYXRocykgY2FuJ3QgcmVhZCBpdCBmcm9tIHRoZSBmb3JtLiBDYWNoZSBpdCBoZXJlIGZyb21cbi8vIHN0b3JhZ2U7IGxvYWRQYXRpZW50T3ZlcnJpZGUgLyBzYXZlUGF0aWVudE92ZXJyaWRlIC8gY2xlYXIga2VlcCBpdFxuLy8gZnJlc2gsIGFuZCBhcHBseVN5bmNTdGF0dXMgcG9rZXMgaXQgd2hlbiBiYWNrZ3JvdW5kIHN3YXBzIHRoZVxuLy8gcGxhY2Vob2xkZXIgZm9yIHRoZSByZWFsIGNpZC5cbmxldCBfc3RvcmVkSWRObyA9IG51bGw7XG5cbi8vIE5ISSB0YWIgaWQsIGNhcHR1cmVkIGluIGluaXQoKSB3aGVuIHRoZSBhY3RpdmUgdGFiIGlzIHRoZSBOSEkgcGFnZS5cbi8vIFVzZWQgYnkgdGhlIFwiXHU5MUNEXHU2NUIwXHU2NTc0XHU3NDA2XHU5ODAxXHU5NzYyXCIgYnV0dG9uIGluIHRoZSBuZWVkcy1sb2dpbiBiYW5uZXIgc28gdGhlXG4vLyB1c2VyIGRvZXNuJ3QgaGF2ZSB0byBrbm93IEY1IC8gc3dpdGNoIHRhYnMgdGhlbXNlbHZlcy5cbmxldCBfbmhpVGFiSWQgPSBudWxsO1xuXG5hc3luYyBmdW5jdGlvbiBsb2FkUGF0aWVudE92ZXJyaWRlKCkge1xuICBjb25zdCB7IHBhdGllbnRPdmVycmlkZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwicGF0aWVudE92ZXJyaWRlXCIpO1xuICBfc3RvcmVkSWRObyA9IHBhdGllbnRPdmVycmlkZT8uaWRfbm8gfHwgbnVsbDtcbiAgaWYgKHBhdGllbnRPdmVycmlkZSkge1xuICAgIGVscy5vdk5hbWUudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiO1xuICAgIGVscy5vdkJpcnRoRGF0ZS52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5iaXJ0aF9kYXRlIHx8IFwiXCI7XG4gICAgZWxzLm92R2VuZGVyLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmdlbmRlciB8fCBcIlwiO1xuICB9XG4gIC8vIEEgc3RvcmVkIG92ZXJyaWRlIHdpdGggYm90aCByZXF1aXJlZCBmaWVsZHMgY291bnRzIGFzIFwic3RlcCAyXG4gIC8vIGFscmVhZHkgY29uZmlybWVkXCIgXHUyMDE0IHJldHVybmluZyB1c2VyIHNob3VsZG4ndCBiZSBmb3JjZWQgdG8gY2xpY2tcbiAgLy8gXHUyNzEzIFx1NzhCQVx1NUI5QSBhZ2FpbiB0byBhZHZhbmNlIHRoZSB3aXphcmQuXG4gIF9tYXJrU3RlcDJDb25maXJtZWQoXG4gICAgISEocGF0aWVudE92ZXJyaWRlPy5nZW5kZXIgJiYgcGF0aWVudE92ZXJyaWRlPy5iaXJ0aF9kYXRlKSxcbiAgKTtcbiAgLy8gUGF0aWVudCBwYW5lbCBpcyBub3cgYWx3YXlzLWV4cGFuZGVkIChzdGVwIDIgb3ducyBpdHMgb3duIHBhZ2UpO1xuICAvLyB0aGUgcHJldmlvdXMgY29sbGFwc2Utd2hlbi1jb25maXJtZWQgYmVoYXZpb3VyIHdhcyBhIGxlZnRvdmVyIGZyb21cbiAgLy8gdGhlIHNpbmdsZS1zY3JvbGwgbGF5b3V0LlxuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG59XG5cbmZ1bmN0aW9uIGdldFBhdGllbnRPdmVycmlkZSgpIHtcbiAgLy8gUmV0dXJucyB7aWRfbm8sIG5hbWU/LCBiaXJ0aF9kYXRlPywgZ2VuZGVyP30uXG4gIC8vIGlkX25vIGNvbWVzIGZyb20gdGhlIHN0b3JhZ2UgY2FjaGUgKF9zdG9yZWRJZE5vKSBzaW5jZSBpdCdzIG5vXG4gIC8vIGxvbmdlciBhIFVJIGZpZWxkIFx1MjAxNCBpdCdzIGF1dG8tbWludGVkIGF0IHNhdmUgdGltZSBhbmQgcmVwbGFjZWRcbiAgLy8gd2l0aCB0aGUgcmVhbCBjaWQgYnkgYmFja2dyb3VuZCdzIE5ISSBmZXRjaCBvbiBmaXJzdCBzeW5jLlxuICAvLyBSZXR1cm5zIG51bGwgd2hlbiBub3RoaW5nIGlkZW50aWZ5aW5nIGlzIGZpbGxlZC5cbiAgY29uc3QgbmFtZSA9IGVscy5vdk5hbWUudmFsdWUudHJpbSgpO1xuICBjb25zdCBiaXJ0aF9kYXRlID0gZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgZ2VuZGVyID0gZWxzLm92R2VuZGVyLnZhbHVlO1xuICBpZiAoIV9zdG9yZWRJZE5vICYmICFuYW1lICYmICFiaXJ0aF9kYXRlICYmICFnZW5kZXIpIHJldHVybiBudWxsO1xuICBjb25zdCBvdXQgPSB7fTtcbiAgaWYgKF9zdG9yZWRJZE5vKSBvdXQuaWRfbm8gPSBfc3RvcmVkSWRObztcbiAgaWYgKG5hbWUpIG91dC5uYW1lID0gbmFtZTtcbiAgaWYgKGJpcnRoX2RhdGUpIG91dC5iaXJ0aF9kYXRlID0gYmlydGhfZGF0ZTtcbiAgaWYgKGdlbmRlcikgb3V0LmdlbmRlciA9IGdlbmRlcjtcbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB0aGUgcGF0aWVudCBjYXJkJ3MgYmlydGgtZGF0ZSBpbnB1dC4gUmV0dXJucyBudWxsIHdoZW4gT0ssXG4gKiBvdGhlcndpc2UgYSB1c2VyLWZhY2luZyBlcnJvciBzdHJpbmcuIFJlYWRzIGRpcmVjdGx5IGZyb20gdGhlXG4gKiA8aW5wdXQgdHlwZT1cImRhdGVcIj4gc28gd2UgY2FuIGRldGVjdCBwYXJ0aWFsLWlucHV0IHN0YXRlcyB0aGF0XG4gKiBDaHJvbWUgcmVwb3J0cyB0aHJvdWdoIGB2YWxpZGl0eS5iYWRJbnB1dGAgKHRoZSBpbnB1dCdzIGAudmFsdWVgXG4gKiBpcyBcIlwiIGluIHRoYXQgY2FzZSwgaW5kaXN0aW5ndWlzaGFibGUgZnJvbSBcImJsYW5rXCIgYnkgc3RyaW5nIGNoZWNrXG4gKiBhbG9uZSBcdTIwMTQgdGhhdCdzIHdoeSB0aGUgb2xkIHZlcnNpb24gb2YgdGhpcyBmdW5jdGlvbiBsZXQgcGFydGlhbFxuICogeWVhci1vbmx5IGVudHJpZXMgc2xpcCB0aHJvdWdoKS5cbiAqXG4gKiBBbGxvd2VkIHN0YXRlczpcbiAqICAgLSBnZW51aW5lbHkgZW1wdHkgKHRoZSBmaWVsZCBpcyBvcHRpb25hbClcbiAqICAgLSBmdWxsIElTTyBZWVlZLU1NLUREIHRoYXQgcm91bmQtdHJpcHMgdGhyb3VnaCBEYXRlKClcbiAqIFJlamVjdGVkOlxuICogICAtIHllYXItb25seSAvIHllYXIrbW9udGg6IHRoZSBpbnB1dCByZW5kZXJzIGJsYW5rIHZhbHVlIGJ1dFxuICogICAgIHZhbGlkaXR5LmJhZElucHV0IGlzIHRydWVcbiAqICAgLSBkYXRlcyBpbiB0aGUgZnV0dXJlXG4gKiAgIC0gaW1wbGF1c2libHkgb2xkIGRhdGVzICh5ZWFyIDwgMTkwMClcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVCaXJ0aERhdGUoKSB7XG4gIGNvbnN0IGVsID0gZWxzLm92QmlydGhEYXRlO1xuICBpZiAoIWVsKSByZXR1cm4gbnVsbDtcbiAgLy8gQ2hyb21lJ3MgbmF0aXZlIGRhdGUgaW5wdXQ6IHBhcnRpYWwgZW50cnkgKGp1c3QgeWVhciwganVzdCB5eXl5LW1tKVxuICAvLyBzdXJmYWNlcyBoZXJlIGV2ZW4gdGhvdWdoIC52YWx1ZSBpcyBcIlwiLlxuICBpZiAoZWwudmFsaWRpdHkgJiYgZWwudmFsaWRpdHkuYmFkSW5wdXQpIHtcbiAgICByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdThBQ0JcdTU4NkJcdTVCOENcdTY1NzRcdTVFNzRcdTY3MDhcdTY1RTVcIjtcbiAgfVxuICBjb25zdCBzID0gKGVsLnZhbHVlIHx8IFwiXCIpLnRyaW0oKTtcbiAgLy8gQmlydGggZGF0ZSBpcyBub3cgcmVxdWlyZWQgXHUyMDE0IGFnZSBhZmZlY3RzIGV2ZXJ5IHJlZmVyZW5jZSByYW5nZVxuICAvLyBhbmQgYW55IGRvd25zdHJlYW0gYWdlLWJhc2VkIFVJOyBlbXB0eSBpbnB1dCBsZXRzIGEgdHlwbyAvIGJyb3dzZXJcbiAgLy8gcXVpcmsgc2lsZW50bHkgcHJvcGFnYXRlIGFzIE5hTi5cbiAgaWYgKCFzKSByZXR1cm4gXCJcdThBQ0JcdTU4NkJcdTc1MUZcdTY1RTVcIjtcbiAgaWYgKCEvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC8udGVzdChzKSkgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU4QUNCXHU1ODZCXHU1QjhDXHU2NTc0XHU1RTc0XHU2NzA4XHU2NUU1XCI7XG4gIGNvbnN0IFt5LCBtLCBkXSA9IHMuc3BsaXQoXCItXCIpLm1hcChOdW1iZXIpO1xuICBjb25zdCBkdCA9IG5ldyBEYXRlKHMgKyBcIlQwMDowMDowMFpcIik7XG4gIGlmIChcbiAgICBOdW1iZXIuaXNOYU4oZHQuZ2V0VGltZSgpKSB8fFxuICAgIGR0LmdldFVUQ0Z1bGxZZWFyKCkgIT09IHkgfHxcbiAgICBkdC5nZXRVVENNb250aCgpICsgMSAhPT0gbSB8fFxuICAgIGR0LmdldFVUQ0RhdGUoKSAhPT0gZFxuICApIHtcbiAgICByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdTRFMERcdTY2MkZcdTY3MDlcdTY1NDhcdTY1RTVcdTY3MUZcIjtcbiAgfVxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBpZiAoZHQuZ2V0VGltZSgpID4gbm93LmdldFRpbWUoKSkgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU0RTBEXHU4MEZEXHU2NjJGXHU2NzJBXHU0Rjg2XCI7XG4gIGlmICh5IDwgMTkwMCkgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU1RTc0XHU0RUZEXHU1OTJBXHU2NUU5XHVGRjBDXHU4QUNCXHU3OEJBXHU4QThEXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBSYW5kb20gXCJhdXRvLVhYWFhYWFhYXCIgXHUyMDE0IDggaGV4IGNoYXJzIGZyb20gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyBzb1xuLy8gZXZlcnkgZnJlc2ggcG9wdXAgaW5zdGFsbCBnZXRzIGEgZGlmZmVyZW50IElEIGFuZCByZS1zeW5jcyBhcmUgc3RhYmxlLlxuZnVuY3Rpb24gX2dlbmVyYXRlQXV0b1BhdGllbnRJZCgpIHtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gIGNvbnN0IGhleCA9IEFycmF5LmZyb20oYnl0ZXMsIChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpLmpvaW4oXCJcIik7XG4gIHJldHVybiBgYXV0by0ke2hleH1gO1xufVxuXG4vLyBGb3JtYXQgaWRfbm8gZm9yIGRpc3BsYXkuIFJlYWwgTkhJIGNpZHMgKFAxMjM0NTA4NjYgXHUyMTkyIFAxMjM0NSoqKiopXG4vLyBnZXQgc2hvd24gaGFsZi1tYXNrZWQgc28gdGhlIHVzZXIgaGFzIHZpc3VhbCBjb25maXJtYXRpb24gd2Vcbi8vIGNhcHR1cmVkIHRoZWlyIHJlYWwgaWRlbnRpdHkuIFRoZSBpbnRlcm5hbCBhdXRvLVhYWFhYWFhYIHBsYWNlaG9sZGVyXG4vLyBpcyBoaWRkZW4gXHUyMDE0IGl0J3MgYSBzeXN0ZW0tZ2VuZXJhdGVkIHN0cmluZyB0aGF0IG1lYW5zIG5vdGhpbmcgdG9cbi8vIHRoZSB1c2VyIGFuZCBqdXN0IGNyZWF0ZXMgXCJ3aGF0J3MgdGhhdCBnaWJiZXJpc2g/XCIgZnJpY3Rpb24gdW50aWxcbi8vIHRoZSByZWFsIGNpZCBhcnJpdmVzIHZpYSBiYWNrZ3JvdW5kJ3MgTkhJIGZldGNoIG9uIGZpcnN0IHN5bmMuXG5mdW5jdGlvbiBfZGlzcGxheUlkKGlkTm8pIHtcbiAgaWYgKCFpZE5vIHx8IGlkTm8uc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gXCJcIjtcbiAgcmV0dXJuIG1hc2tJZChpZE5vKTtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgY2FyZCA9IGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzO1xuICBsZXQgc3VtbWFyeVRleHQgPSBcIlwiO1xuICBpZiAoIW92IHx8ICFvdi5uYW1lKSB7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2NzJBXHU4QTJEXHU1QjlBXCI7XG4gICAgaWYgKGNhcmQpIGNhcmQuZGF0YXNldC5zdGF0ZSA9IFwiZW1wdHlcIjtcbiAgfSBlbHNlIHtcbiAgICAvLyBOYW1lIChtYXNrIHRvZ2dsZTogXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4IFx1OTgxMFx1OEEyRFx1OTVEQyA9IFx1NzcxRlx1NTQwRCAvIG11bHRpLXBhdGllbnQgZGVtb1xuICAgIC8vIFx1OTU4Qlx1NTU1RiA9IFx1OTA2RVx1N0Y2OSkgKyBtYXNrZWQgcmVhbCBjaWQgd2hlbiBhdmFpbGFibGUuIEF1dG8tcGxhY2Vob2xkZXJcbiAgICAvLyBpcyBzdXBwcmVzc2VkIHZpYSBfZGlzcGxheUlkLlxuICAgIGNvbnN0IHBhcnRzID0gW19tYXliZU1hc2sob3YubmFtZSldO1xuICAgIGNvbnN0IGlkTGFiZWwgPSBfZGlzcGxheUlkKG92LmlkX25vKTtcbiAgICBpZiAoaWRMYWJlbCkgcGFydHMucHVzaChpZExhYmVsKTtcbiAgICBzdW1tYXJ5VGV4dCA9IHBhcnRzLmpvaW4oXCIgIFx1MDBCNyAgXCIpO1xuICAgIGVscy5vdlN1bW1hcnkudGV4dENvbnRlbnQgPSBgXHUyNzEzICR7c3VtbWFyeVRleHR9YDtcbiAgICBpZiAoY2FyZCkgY2FyZC5kYXRhc2V0LnN0YXRlID0gXCJmaWxsZWRcIjtcbiAgfVxuICAvLyBNaXJyb3Igb250byBzdGVwIDMncyBcIlx1NTNENlx1NUY5N1x1NUMwRFx1OEM2MVwiIGJhbm5lciBzbyB0aGUgdXNlciBrbm93cyB3aG9cbiAgLy8gdGhleSdyZSBhYm91dCB0byBmZXRjaCB3aXRob3V0IHNjcm9sbGluZyBiYWNrIHRvIHN0ZXAgMi4gT25seVxuICAvLyB3aGVuIHN0ZXAgMiBoYXMgYmVlbiBjb25maXJtZWQgKHdoaWNoIG5vdyBpbXBsaWVzIGEgc2F2ZWQgbmFtZSkuXG4gIGlmIChlbHMuYWN0aXZlUGF0aWVudCAmJiBlbHMuYWN0aXZlUGF0aWVudFZhbHVlKSB7XG4gICAgY29uc3Qgc2hvd0FjdGl2ZSA9IF9zdGVwMkNvbmZpcm1lZCAmJiAhIXN1bW1hcnlUZXh0O1xuICAgIGVscy5hY3RpdmVQYXRpZW50LmhpZGRlbiA9ICFzaG93QWN0aXZlO1xuICAgIGlmIChzaG93QWN0aXZlKSBlbHMuYWN0aXZlUGF0aWVudFZhbHVlLnRleHRDb250ZW50ID0gc3VtbWFyeVRleHQ7XG4gIH1cbiAgLy8gQm90aCBsYXVuY2ggKyBzeW5jIGVuYWJsZWQgc3RhdGUgZGVwZW5kIG9uIHBhdGllbnQgKyBtb2RlICsgY29ubi5cbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgLy8gQ2hhbmdpbmcgcGF0aWVudCBJRCBpbnZhbGlkYXRlczogKGEpIGJhY2tlbmQtc3RhdGUgY2FjaGUgKG5ld1xuICAvLyBwYXRpZW50IG1pZ2h0IG5vdCBiZSBvbiBiYWNrZW5kKTsgKGIpIGxvY2FsLWJ1bmRsZSByb3cgaW4gdGhlXG4gIC8vIGRhdGEtc3RhdGUgY2FyZDsgKGMpIHRoZSBcdUQ4M0RcdURDRTUgZG93bmxvYWQgYnVuZGxlIHNlY3Rpb24sIHdoaWNoIHdvdWxkXG4gIC8vIG90aGVyd2lzZSBzdGlsbCBzaG93IHRoZSBwcmV2aW91cyBwYXRpZW50J3Mgc3Rhc2hlZCBmaWxlOyAoZClcbiAgLy8gdGhlIGxhc3QgY29tcGxldGVkIHN5bmMncyBzdWNjZXNzIG1lc3NhZ2UsIHdoaWNoIHdhcyB0YWdnZWQgZm9yXG4gIC8vIHRoZSBwcmV2aW91cyBwYXRpZW50LlxuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG4gIF9jbGVhclN0YWxlU3luY1N0YXR1cyhnZXRQYXRpZW50T3ZlcnJpZGUoKSk7XG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBfY29ublN0YXRlID09PSBcIm9rXCIpIGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbn1cblxuLy8gRHJvcCBhIFwiXHUyNzA1IFx1NTQwQ1x1NkI2NVx1NUI4Q1x1NjIxMCBcdTIwMjZcIiBzdGF0dXMgYmFubmVyIHRoYXQgd2FzIHJlY29yZGVkIGZvciBhXG4vLyBkaWZmZXJlbnQgcGF0aWVudC4gTWlkLWZsaWdodCBzeW5jcyBhcmUgbGVmdCBhbG9uZSAoc3RhdHVzLnJ1bm5pbmcpXG4vLyBzbyB0aGUgdXNlciBjYW4gc3RpbGwgc2VlIHByb2dyZXNzIG9mIHRoZSBpbi1mbGlnaHQgc3luYy5cbmZ1bmN0aW9uIF9jbGVhclN0YWxlU3luY1N0YXR1cyhvdikge1xuICBpZiAoIV9sYXRlc3RTdGF0dXMpIHJldHVybjtcbiAgaWYgKF9sYXRlc3RTdGF0dXMucnVubmluZykgcmV0dXJuO1xuICBpZiAoIV9sYXRlc3RTdGF0dXMuaGlzdG5vKSByZXR1cm47XG4gIGlmIChvdj8uaWRfbm8gPT09IF9sYXRlc3RTdGF0dXMuaGlzdG5vKSByZXR1cm47XG4gIF9sYXRlc3RTdGF0dXMgPSBudWxsO1xuICBzZXRTdGF0dXMoXCJcIiwgbnVsbCk7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInN5bmNTdGF0dXNcIikuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzYXZlUGF0aWVudE92ZXJyaWRlKCkge1xuICAvLyBHZW5kZXIgKyBiaXJ0aF9kYXRlICsgbmFtZSBhcmUgcmVxdWlyZWQuIGlkX25vIGlzIHRoZSBvbmx5IG9wdGlvbmFsXG4gIC8vIGZpZWxkIFx1MjAxNCBpdCdzIGF1dG8tZmV0Y2hlZCBmcm9tIE5ISSBvbiBzeW5jLCBuZXZlciB1c2VyLWVudGVyZWQuXG4gIGlmICghZWxzLm92R2VuZGVyLnZhbHVlKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1OEFDQlx1OTA3OFx1NjRDN1x1NjAyN1x1NTIyNVwiLCBcImVycm9yXCIpO1xuICAgIGVscy5vdkdlbmRlci5mb2N1cygpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBkb2JFcnJvciA9IHZhbGlkYXRlQmlydGhEYXRlKCk7XG4gIGlmIChkb2JFcnJvcikge1xuICAgIHNldFN0YXR1cyhgXHUyNkQ0ICR7ZG9iRXJyb3J9YCwgXCJlcnJvclwiKTtcbiAgICBlbHMub3ZCaXJ0aERhdGUuZm9jdXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFlbHMub3ZOYW1lLnZhbHVlLnRyaW0oKSkge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdThBQ0JcdTU4NkJcdTVCRUJcdTU5RDNcdTU0MERcIiwgXCJlcnJvclwiKTtcbiAgICBlbHMub3ZOYW1lLmZvY3VzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIEJ1aWxkIHRoZSBvdmVycmlkZSBkaXJlY3RseSBzbyB3ZSBkb24ndCBkZXBlbmQgb25cbiAgLy8gZ2V0UGF0aWVudE92ZXJyaWRlJ3MgbnVsbC1yZXR1cm4gXHUyMDE0IHRoZSByZXF1aXJlZC1maWVsZCBwYXRoIGFib3ZlXG4gIC8vIGhhcyBhbHJlYWR5IHZhbGlkYXRlZCB3aGF0IG1hdHRlcnMuXG4gIGNvbnN0IG92ID0ge1xuICAgIG5hbWU6IGVscy5vdk5hbWUudmFsdWUudHJpbSgpIHx8IG51bGwsXG4gICAgYmlydGhfZGF0ZTogZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKSxcbiAgICBnZW5kZXI6IGVscy5vdkdlbmRlci52YWx1ZSxcbiAgfTtcbiAgaWYgKCFvdi5uYW1lKSBkZWxldGUgb3YubmFtZTtcbiAgLy8gaWRfbm8gaXMgbm8gbG9uZ2VyIGEgVUkgZmllbGQuIFJldXNlIHRoZSBwcmV2aW91c2x5IHN0b3JlZFxuICAvLyBwbGFjZWhvbGRlciBpZiBvbmUgZXhpc3RzIChzbyByZS1zYXZlcyBkb24ndCBrZWVwIG1pbnRpbmcgbmV3IElEc1xuICAvLyBhbmQgb3JwaGFuaW5nIGJhY2tlbmQgcmVzb3VyY2VzIGtleWVkIG9uIHRoZSBvbGQgb25lKTsgb3RoZXJ3aXNlXG4gIC8vIG1pbnQgYSBmcmVzaCBhdXRvLVhYWFguIGJhY2tncm91bmQncyBOSEkgZmV0Y2ggc3dhcHMgdGhpcyBmb3IgdGhlXG4gIC8vIHJlYWwgY2lkIG9uIGZpcnN0IHN5bmMuXG4gIC8vXG4gIC8vIFRoZSBzYW1lIHJlYWQgYWxzbyBmZWVkcyB0aGUgaWRlbnRpdHktc3dpdGNoIGRldGVjdGlvbiBiZWxvdy5cbiAgY29uc3QgcHJldlN0b3JlZCA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJwYXRpZW50T3ZlcnJpZGVcIikpXG4gICAgLnBhdGllbnRPdmVycmlkZTtcbiAgb3YuaWRfbm8gPSBwcmV2U3RvcmVkPy5pZF9ubyB8fCBfZ2VuZXJhdGVBdXRvUGF0aWVudElkKCk7XG4gIF9zdG9yZWRJZE5vID0gb3YuaWRfbm87XG5cbiAgLy8gSWRlbnRpdHktY2hhbmdlIGRldGVjdGlvbi4gQW55IG9mIHRoZXNlIGZpZWxkIGNoYW5nZXMgdHJlYXRzIHRoZVxuICAvLyBzYXZlIGFzIFwic3dpdGNoZWQgdG8gYSBkaWZmZXJlbnQgcGVyc29uXCI6XG4gIC8vICAgLSBpZF9ubzogICAgICAgTkhJIGFjY291bnQgc3dhcCAoYXV0by1mZXRjaGVkIGZyb20gc2Vzc2lvbilcbiAgLy8gICAtIG5hbWU6ICAgICAgICBtYW51YWxseSBlZGl0aW5nIG5hbWUgKG1vc3QgY29tbW9uIGluIGNsaW5pY1xuICAvLyAgICAgICAgICAgICAgICAgIHNldHRpbmc6IGRvY3RvciBzd2FwcyBwYXRpZW50cyBvbiB0aGUgc2FtZSBOSElcbiAgLy8gICAgICAgICAgICAgICAgICBzZXNzaW9uLCBvciBmaXhlcyBhIHdyb25nIGlkZW50aXR5KVxuICAvLyAgIC0gZ2VuZGVyOiAgICAgIGlkZW50aXR5LWRlZmluaW5nOyBhbHNvIGFmZmVjdHMgc2V4LXN0cmF0aWZpZWRcbiAgLy8gICAgICAgICAgICAgICAgICByZWZlcmVuY2UgcmFuZ2VzIGZvciBsYWJzXG4gIC8vICAgLSBiaXJ0aF9kYXRlOiAgc2FtZSBwZXJzb24gY2FuJ3QgaGF2ZSB0d28gRE9Cc1xuICAvL1xuICAvLyBBbnkgb2YgdGhlc2UgY2hhbmdpbmcgXHUyMTkyIGRyb3AgdGhlIHByZXZpb3VzbHktY2FwdHVyZWQgYnVuZGxlIHNvXG4gIC8vIHRoZSB1c2VyIGNhbid0IGFjY2lkZW50YWxseSBkb3dubG9hZCBhIEpTT04gZmlsZSBsYWJlbGxlZCB3aXRoXG4gIC8vIHRoZSBORVcgcGF0aWVudCdzIGlkZW50aXR5IGJ1dCBwb3B1bGF0ZWQgd2l0aCB0aGUgT0xEIHBhdGllbnQnc1xuICAvLyBtZWRpY2FsIHJlY29yZHMuIFBISSBzYWZldHkgPiBjb252ZW5pZW5jZSBvZiBcIkkganVzdCBmaXhlZCBhXG4gIC8vIHR5cG9cIiAod2hpY2ggbG9zZXMgYXQgbW9zdCBvbmUgY2xpY2sgdG8gcmUtc3luYykuXG4gIGNvbnN0IF9ub3JtID0gKHYpID0+ICh2ID09IG51bGwgPyBcIlwiIDogU3RyaW5nKHYpKTtcbiAgY29uc3QgcGF0aWVudENoYW5nZWQgPSAhIXByZXZTdG9yZWQgJiYgKFxuICAgIF9ub3JtKHByZXZTdG9yZWQuaWRfbm8pICE9PSBfbm9ybShvdi5pZF9ubykgfHxcbiAgICBfbm9ybShwcmV2U3RvcmVkLm5hbWUpICE9PSBfbm9ybShvdi5uYW1lKSB8fFxuICAgIF9ub3JtKHByZXZTdG9yZWQuZ2VuZGVyKSAhPT0gX25vcm0ob3YuZ2VuZGVyKSB8fFxuICAgIF9ub3JtKHByZXZTdG9yZWQuYmlydGhfZGF0ZSkgIT09IF9ub3JtKG92LmJpcnRoX2RhdGUpXG4gICk7XG5cbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcGF0aWVudE92ZXJyaWRlOiBvdiB9KTtcblxuICBpZiAocGF0aWVudENoYW5nZWQpIHtcbiAgICAvLyAxLiBkcm9wIHRoZSBwcmlvciBsb2NhbCBGSElSIGJ1bmRsZSAoZG93bmxvYWQgYnV0dG9uIGNvbnRlbnQpXG4gICAgLy8gMi4gZHJvcCB0aGUgU1cncyBsYXN0IHN5bmMgc3RhdHVzIHNvIHRoZSByZXN1bHQgem9uZSBkb2Vzbid0XG4gICAgLy8gICAga2VlcCBzaG93aW5nIFwiXHUyNzA1IFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgQSBcdTc2ODQgODEgXHU3QjQ2XHUyMDI2XCJcbiAgICAvLyAzLiBkcm9wIHRoZSBpbi1wb3B1cCBsYXRlc3Qtc3RhdHVzIHNuYXBzaG90XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFBFTkRJTkdfQlVORExFX0tFWSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIGF3YWl0IGNocm9tZS5ydW50aW1lXG4gICAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImNsZWFyU3luY1N0YXR1c1wiIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge30pO1xuICAgIF9sYXRlc3RTdGF0dXMgPSBudWxsO1xuICAgIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgfVxuXG4gIF9tYXJrU3RlcDJDb25maXJtZWQodHJ1ZSk7XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgLy8gU3VjY2Vzc2Z1bCBzYXZlIGlzIFRIRSBpbnRlbnRpb25hbCBzdGVwLTIgY29tcGxldGlvbiBldmVudCBcdTIwMTQgdGhpc1xuICAvLyBpcyB3aGVyZSB0aGUgd2l6YXJkIGlzIGFsbG93ZWQgdG8gYWR2YW5jZSBmb3J3YXJkLlxuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfbWF5YmVBdXRvQWR2YW5jZSgpO1xuICAvLyBNYWtlIGNsZWFyIHRoaXMgaXMgdGhlIGlkZW50aXR5IHNhdmUsIG5vdCBhIG1lZGljYWwtcmVjb3JkIHN5bmMgXHUyMDE0XG4gIC8vIFx1MzAwQ1x1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1MzAwRGFsb25lIHJlYWRzIGFzIFwicGF0aWVudCBkYXRhXCIgKG1lZGljYWwpIGZvciBzb21lIHVzZXJzLlxuICAvLyBfZGlzcGxheUlkIHN1cHByZXNzZXMgdGhlIGF1dG8tWFhYWCBwbGFjZWhvbGRlciAobm8gdmFsdWUgdG8gdGhlXG4gIC8vIHVzZXIpIGJ1dCBrZWVwcyB0aGUgbWFza2VkIHJlYWwgY2lkIChQMTIzNDUqKioqKSB3aGVuIGl0J3NcbiAgLy8gYXZhaWxhYmxlIFx1MjAxNCBjb25maXJtcyB3ZSBjYXB0dXJlZCB0aGVpciBhY3R1YWwgaWRlbnRpdHkuXG4gIGNvbnN0IGlkTGFiZWwgPSBfZGlzcGxheUlkKG92LmlkX25vKTtcbiAgY29uc3QgdGFpbCA9IGlkTGFiZWwgPyBgIFx1MDBCNyAke2lkTGFiZWx9YCA6IFwiXCI7XG4gIHNldFN0YXR1cyhgXHUyNzA1IFx1NzVDNVx1NEVCQVx1OEVBQlx1NEVGRFx1NURGMlx1OEExOFx1NEY0Rlx1RkYxQSR7X21heWJlTWFzayhvdi5uYW1lKX0ke3RhaWx9YCwgXCJzdWNjZXNzXCIpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjbGVhclBhdGllbnRPdmVycmlkZSgpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwicGF0aWVudE92ZXJyaWRlXCIpO1xuICBfc3RvcmVkSWRObyA9IG51bGw7XG4gIGVscy5vdk5hbWUudmFsdWUgPSBcIlwiO1xuICBlbHMub3ZCaXJ0aERhdGUudmFsdWUgPSBcIlwiO1xuICBlbHMub3ZHZW5kZXIudmFsdWUgPSBcIlwiO1xuICBfbWFya1N0ZXAyQ29uZmlybWVkKGZhbHNlKTtcbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICBzZXRTdGF0dXMoXCJcdTVERjJcdTZFMDVcdTk2NjRcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIiwgXCJpbmZvXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBjb25uZWN0aW9uIHN0YXRlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGg6IGBfY29ublN0YXRlYCByZWZsZWN0cyB0aGUgbGF0ZXN0IGJhY2tlbmRcbi8vIGNvbm5lY3Rpdml0eSBjaGVjay4gQm90aCB0aGUgYmFubmVyIFVJIGFuZCB0aGUgZW5hYmxlZC1zdGF0ZSBvZiB0aGVcbi8vIFx1RDgzRFx1RENFNSBTeW5jIC8gXHVEODNEXHVERTgwIExhdW5jaCBidXR0b25zIHJlYWQgZnJvbSBpdC5cbi8vXG4vLyBTdGF0ZXM6XG4vLyAgIFwidW5rbm93blwiICBcdTIwMTQgbm90IHlldCBjaGVja2VkIChlLmcuIGZpcnN0IHBhaW50IGluIGxvY2FsIG1vZGUpXG4vLyAgIFwiY2hlY2tpbmdcIiBcdTIwMTQgZmV0Y2ggaW4gZmxpZ2h0XG4vLyAgIFwib2tcIiAgICAgICBcdTIwMTQgR0VUIC9maGlyL21ldGFkYXRhIHJldHVybmVkIGEgRkhJUiBDYXBhYmlsaXR5U3RhdGVtZW50XG4vLyAgIFwiZmFpbFwiICAgICBcdTIwMTQgYW55dGhpbmcgZWxzZTsgYF9jb25uRmFpbFJlYXNvbmAgY2FycmllcyBkZXRhaWxcbi8vXG4vLyBCYWNrZW5kIGNvbm5lY3Rpdml0eSBpcyB0cmVhdGVkIGFzIGEgKnByZXJlcXVpc2l0ZSogZm9yIGJhY2tlbmQgbW9kZSxcbi8vIG5vdCBhcyBhIHBlci1hY3Rpb24gY2hlY2suIFN3aXRjaGluZyB0byBiYWNrZW5kIG1vZGUgdHJpZ2dlcnMgYSB0ZXN0XG4vLyBpbW1lZGlhdGVseTsgZmFpbHVyZSBzaG93cyBhIGJhbm5lciB3aXRoIGFjdGlvbmFibGUgZ3VpZGFuY2UgYW5kXG4vLyBkaXNhYmxlcyBib3RoIGFjdGlvbiBidXR0b25zIHVudGlsIGNvbm5lY3Rpdml0eSByZWNvdmVycy5cblxubGV0IF9jb25uU3RhdGUgPSBcInVua25vd25cIjtcbmxldCBfY29ubkZhaWxSZWFzb24gPSBudWxsOyAvLyB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIHwgXCJuby11cmxcIiB8IFwibmV0d29ya1wiIHwgXCJ0aW1lb3V0XCIgfCBcImh0dHBcIiB8IFwibm90LWZoaXJcIiwgZGV0YWlsPyB9XG5cbi8vIEJhbm5lciBjb3B5LiBEcm9wIHRoZSBsZWFkaW5nIFx1MjcxNyBcdTIwMTQgdGhlIHJlZCBkb3QgbGVmdCBvZiB0aGUgdGV4dCBpc1xuLy8gYWxyZWFkeSB0aGUgXCJmYWlsXCIgc2lnbmFsLCBhbmQgdGhlIHJvdyB3YXMgcmVhZGluZyBcIlx1MjVDRiBcdTI3MTcgXHU5MDIzXHU0RTBEXHU0RTBBXHU1RjhDXHU3QUVGXCJcbi8vID0gdGhyZWUgaW5kaWNhdG9ycyBzdGFja2VkLlxuY29uc3QgX0NPTk5fTEFCRUxTID0ge1xuICB1bmtub3duOiBcIlx1NjcyQVx1NkFBMlx1NkUyQ1wiLFxuICBjaGVja2luZzogXCJcdTZBQTJcdTZFMkNcdTRFMkRcdTIwMjZcIixcbiAgb2s6ICgpID0+IGBcdTVERjJcdTkwMjNcdTdEREEgXHUyMDE0ICR7ZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpfWAsXG4gIGZhaWw6ICgpID0+IHtcbiAgICBjb25zdCByID0gX2Nvbm5GYWlsUmVhc29uIHx8IHt9O1xuICAgIHJldHVybiAoe1xuICAgICAgXCJuby11cmxcIjogXCJcdTY3MkFcdThBMkRcdTVCOUEgQmFja2VuZCBVUkxcIixcbiAgICAgIFwibm8tcGVybWlzc2lvblwiOiBcIlx1NjcyQVx1NjM4OFx1NkIwQVx1OTAyM1x1N0REQVwiLFxuICAgICAgXCJuZXR3b3JrXCI6IFwiXHU5MDIzXHU0RTBEXHU0RTBBXHU1RjhDXHU3QUVGXCIsXG4gICAgICBcInRpbWVvdXRcIjogXCJcdTkwMjNcdTdEREFcdTkwM0VcdTY2NDJcIixcbiAgICAgIFwiaHR0cFwiOiBgSFRUUCAke3IuZGV0YWlsIHx8IFwiXCJ9YC50cmltKCksXG4gICAgICBcIm5vdC1maGlyXCI6IFwiXHU1NkRFXHU2MUM5XHU0RTBEXHU2NjJGIEZISVJcIixcbiAgICB9KVtyLmtpbmRdID8/IFwiXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3XCI7XG4gIH0sXG59O1xuXG5jb25zdCBfQ09OTl9IRUxQID0ge1xuICBcIm5vLXVybFwiOiAgICAgICAgXCJcdThBQ0JcdTUyMzBcdTMwMENcdTkwMzJcdTk2OEVcdThBMkRcdTVCOUFcdTMwMERcdTU4NkJcdTUxNjUgQmFja2VuZCBVUkxcdUZGMENcdTRGOEJcdTU5ODIgPGNvZGU+aHR0cDovL2xvY2FsaG9zdDo4MDEwPC9jb2RlPlx1MzAwMlwiLFxuICBcIm5vLXBlcm1pc3Npb25cIjogXCJDaHJvbWUgXHU5NjNCXHU2NENCXHU0RTg2XHU4REU4XHU0Rjg2XHU2RTkwXHU4QUNCXHU2QzQyXHUzMDAyXHU4QUNCXHU5MUNEXHU2NUIwXHU5NThCIHBvcHVwXHVGRjBDXHU3NTc2XHU2QjBBXHU5NjUwXHU1QzBEXHU4QTcxXHU2ODQ2XHU4REYzXHU1MUZBXHU2NjQyXHU2MzA5XHUzMDBDXHU1MTQxXHU4QTMxXHUzMDBEXHUzMDAyXCIsXG4gIFwibmV0d29ya1wiOiAgICAgICBcIlx1NUY4Q1x1N0FFRlx1NTNFRlx1ODBGRFx1OTA4NFx1NkM5Mlx1NTU1Rlx1NTJENVx1MzAwMlx1OEFDQlx1NTdGN1x1ODg0Q1x1RkYxQTxicj48Y29kZT5kb2NrZXIgY29tcG9zZSB1cCAtZDwvY29kZT48YnI+XHU3OEJBXHU4QThEIGJhY2tlbmQgXHU1QkI5XHU1NjY4XHU4REQxXHU4RDc3XHU0Rjg2XHU1MThEXHU5MUNEXHU4QTY2XHUzMDAyXCIsXG4gIFwidGltZW91dFwiOiAgICAgICBcIjUgXHU3OUQyXHU1MTY3XHU2QzkyXHU2NTM2XHU1MjMwXHU1NkRFXHU2MUM5IFx1MjAxNCBiYWNrZW5kIFx1NTNFRlx1ODBGRFx1OTA4NFx1NTcyOFx1NTU1Rlx1NTJENVx1NEUyRFx1RkYwQ1x1N0I0OSAzMCBcdTc5RDJcdTUxOERcdTYzMDlcdTkxQ0RcdThBNjZcdTMwMDJcIixcbiAgXCJodHRwXCI6ICAgICAgICAgIFwiQmFja2VuZCBcdTU2REVcdTYxQzlcdTkzMkZcdThBQTRcdTcyQzBcdTYxNEJcdTc4QkNcdTMwMDJcdTZBQTJcdTY3RTUgYmFja2VuZCBcdTc2ODQgbG9nXHVGRjFBPGJyPjxjb2RlPmRvY2tlciBjb21wb3NlIGxvZ3MgYmFja2VuZDwvY29kZT5cIixcbiAgXCJub3QtZmhpclwiOiAgICAgIFwiXHU5MDE5XHU1MDBCIFVSTCBcdTU2REVcdTRFODZcdTY3NzFcdTg5N0ZcdUZGMENcdTRGNDZcdTRFMERcdTY2MkYgRkhJUiBDYXBhYmlsaXR5U3RhdGVtZW50XHUzMDAyXHU3OEJBXHU4QThEIEJhY2tlbmQgVVJMIFx1NjMwN1x1NTQxMSBOSEktRkhJUi1CcmlkZ2UgXHU3Njg0IC9maGlyIFx1NjgzOVx1NzZFRVx1OTMwNFx1MzAwMlwiLFxufTtcblxuZnVuY3Rpb24gX3JlbmRlckNvbm5CYW5uZXIoKSB7XG4gIGNvbnN0IGJhbm5lciA9IGVscy5jb25uQmFubmVyO1xuICBpZiAoIWJhbm5lcikgcmV0dXJuO1xuICBiYW5uZXIuZGF0YXNldC5zdGF0ZSA9IF9jb25uU3RhdGU7XG4gIC8vIE1pcnJvciBzdGF0ZSBvbnRvIHRoZSBvdXRlciAuY29ubi1ibG9jayBzbyB0aGUgd3JhcHBlciBib3JkZXJcbiAgLy8gKHdoaWNoIGhvbGRzIGJhbm5lciArIGhlbHAgYm9keSBpbnNpZGUgT05FIGNhcmQpIHRyYWNrcyB0aGUgc2FtZVxuICAvLyBjb2xvciB0aGUgYmFubmVyIGlzIHVzaW5nLlxuICBpZiAoZWxzLmNvbm5TZWN0aW9uKSBlbHMuY29ublNlY3Rpb24uZGF0YXNldC5zdGF0ZSA9IF9jb25uU3RhdGU7XG4gIGNvbnN0IGxhYmVsID0gX0NPTk5fTEFCRUxTW19jb25uU3RhdGVdO1xuICBlbHMuY29ubk1zZy50ZXh0Q29udGVudCA9IHR5cGVvZiBsYWJlbCA9PT0gXCJmdW5jdGlvblwiID8gbGFiZWwoKSA6IGxhYmVsO1xuICBlbHMuY29ublJldHJ5QnRuLmhpZGRlbiA9IF9jb25uU3RhdGUgIT09IFwiZmFpbFwiO1xuICBpZiAoX2Nvbm5TdGF0ZSA9PT0gXCJmYWlsXCIgJiYgX2Nvbm5GYWlsUmVhc29uPy5raW5kKSB7XG4gICAgZWxzLmNvbm5IZWxwLmhpZGRlbiA9IGZhbHNlO1xuICAgIGVscy5jb25uSGVscC5pbm5lckhUTUwgPSBfQ09OTl9IRUxQW19jb25uRmFpbFJlYXNvbi5raW5kXSA/PyBcIlwiO1xuICB9IGVsc2Uge1xuICAgIGVscy5jb25uSGVscC5oaWRkZW4gPSB0cnVlO1xuICAgIGVscy5jb25uSGVscC5pbm5lckhUTUwgPSBcIlwiO1xuICB9XG5cbiAgLy8gQ29tcGFjdC1waWxsIHZzIGZ1bGwtYmFubmVyIHN3YXA6IHdoZW4gZXZlcnl0aGluZydzIGZpbmUsIHNocmluayB0b1xuICAvLyBhIHNtYWxsIGdyZWVuIHBpbGwgaW4gdGhlIGhlYWRlciBzbyB0aGUgcG9wdXAgYm9keSBoYXMgbW9yZSByb29tXG4gIC8vIGZvciBhY3Rpb25hYmxlIGNvbnRlbnQuIEFueXRoaW5nIGVsc2UgKHVua25vd24gLyBjaGVja2luZyAvIGZhaWwpXG4gIC8vIGtlZXBzIHRoZSBmdWxsIGJhbm5lciBzbyBwcm9ncmVzcyArIGVycm9yIGhlbHAgaGFzIHNwYWNlIHRvIHJlbmRlci5cbiAgY29uc3QgaXNPayA9IF9jb25uU3RhdGUgPT09IFwib2tcIjtcbiAgaWYgKGVscy5jb25uU2VjdGlvbikgZWxzLmNvbm5TZWN0aW9uLmhpZGRlbiA9IGlzT2s7XG4gIGlmIChlbHMuY29ubk1pbmkpIHtcbiAgICBlbHMuY29ubk1pbmkuaGlkZGVuID0gIWlzT2s7XG4gICAgaWYgKGlzT2spIGVscy5jb25uTWluaS50aXRsZSA9IGBcdTVERjJcdTkwMjNcdTdEREEgXHUyMDE0ICR7ZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpfWA7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIDMtc3RlcCB3aXphcmQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gQ29uY2VwdHVhbGx5OlxuLy8gICBTdGVwIDEgXHUyMDE0IFx1NzY3Qlx1NTE2NVx1RkYxQW9uIE5ISSB0YWIgKyBzZXNzaW9uIHRva2VuIGlzIHZhbGlkXG4vLyAgIFN0ZXAgMiBcdTIwMTQgXHU4QTJEXHU1QjlBXHVGRjFBZ2VuZGVyIGZpbGxlZCArIChtb2RlPT1sb2NhbCBPUiBiYWNrZW5kIHJlYWNoYWJsZSlcbi8vICAgICAgICAgICAgICAgICsgYmlydGhfZGF0ZSBpZiBlbnRlcmVkIG11c3QgYmUgdmFsaWRcbi8vICAgU3RlcCAzIFx1MjAxNCBcdTUzRDZcdTVGOTdcdUZGMUF0aGUgYWN0aW9uIGl0c2VsZiAoc3luYyBDVEEsIHN0YXR1cywgcmVzdWx0cylcbi8vXG4vLyBTdGVwcyBhdXRvLWFkdmFuY2Ugd2hlbiB0aGVpciBwcmVjb25kaXRpb24gZmxpcHMgZ3JlZW47IHVzZXJzIGNhblxuLy8gY2xpY2sgdGhlIHN0ZXBwZXIgdG8gcmV2aXNpdCBhbnkgc3RlcC4gV2UgbmV2ZXIgYXV0by1zdGVwIEJBQ0sgb25cbi8vIHN0YXRlIGNoYW5nZSBcdTIwMTQgb25jZSB0aGUgdXNlciBoYXMgbW92ZWQgZm9yd2FyZCwgb25seSBhbiBleHBsaWNpdFxuLy8gc3RlcHBlciBjbGljayBicmluZ3MgdGhlbSBiYWNrLiBPdGhlcndpc2Ugb3BlbmluZyB0aGUgcG9wdXAgbWlkLVxuLy8gc3luYyB3b3VsZCBqZXJrIHRoZW0gYmFjayB0byBzdGVwIDEuXG5sZXQgX2FjdGl2ZVN0ZXAgPSAxO1xubGV0IF93aXphcmRJbml0aWFsaXplZCA9IGZhbHNlO1xuLy8gU3RlcCAyIGlzIFwiZG9uZVwiIG9ubHkgYWZ0ZXIgdGhlIHVzZXIgaGFzIGNsaWNrZWQgXHUyNzEzIFx1NzhCQVx1NUI5QSB3aXRoIHZhbGlkXG4vLyBpbnB1dHMuIFdlIHRyYWNrIHRoaXMgd2l0aCBhIGJvb2xlYW4gcmF0aGVyIHRoYW4gcmVhZGluZyBsaXZlIERPTVxuLy8gc3RhdGUgXHUyMDE0IG90aGVyd2lzZSB0aGUgd2l6YXJkIHdvdWxkIGF1dG8tYWR2YW5jZSB0aGUgbW9tZW50IHRoZVxuLy8gZmllbGRzIGhhcHBlbmVkIHRvIGxvb2sgcmlnaHQsIGJlZm9yZSB0aGUgdXNlciBoYWQgYSBjaGFuY2UgdG9cbi8vIHJldmlldy4gRmxpcHBlZCB0cnVlIGluIHNhdmVQYXRpZW50T3ZlcnJpZGUgc3VjY2VzcywgZmFsc2UgaW5cbi8vIGNsZWFyUGF0aWVudE92ZXJyaWRlIGFuZCBvbiBhIGxvYWQgdGhhdCB5aWVsZHMgbm8gc2F2ZWQgcmVjb3JkLlxubGV0IF9zdGVwMkNvbmZpcm1lZCA9IGZhbHNlO1xuXG4vLyBTdGVwIG51bWJlciByZW5kZXJlZCBhcyBhIGNpcmNsZWQgZGlnaXQgZ2x5cGggXHUyMDE0IG1hdGNoZXMgdGhlXG4vLyBcIlx1NTZERSBcdTI0NjAgXHU3NjdCXHU1MTY1XCIgY29weSBlbHNld2hlcmUgaW4gdGhlIHBvcHVwIGFuZCB0aGUgd2l6YXJkIHN0ZXBwZXIgbGFiZWxzLlxuZnVuY3Rpb24gX3N0ZXBOdW1HbHlwaChuKSB7XG4gIHJldHVybiBuID09PSAxID8gXCJcdTI0NjBcIiA6IG4gPT09IDIgPyBcIlx1MjQ2MVwiIDogXCJcdTI0NjJcIjtcbn1cblxuZnVuY3Rpb24gX21hcmtTdGVwMkNvbmZpcm1lZCh5ZXMpIHtcbiAgX3N0ZXAyQ29uZmlybWVkID0gISF5ZXM7XG59XG5cbmZ1bmN0aW9uIF9pc1N0ZXBEb25lKHN0ZXApIHtcbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBzd2l0Y2ggKHN0ZXApIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gb25OaGkgJiYgbG9nZ2VkSW47XG4gICAgY2FzZSAyOlxuICAgICAgLy8gQ29uZmlybWVkID0gdXNlciBjbGlja2VkIFx1MjcxMyBcdTc4QkFcdTVCOUEgQU5EIHRoZSBvdmVycmlkZSBpcyBjdXJyZW50bHlcbiAgICAgIC8vIHZhbGlkIChzbyByZXZpc2l0cyB3aXRoIGEgbm93LWludmFsaWQgb3ZlcnJpZGUgZG9uJ3Qgc2hvdyBhXG4gICAgICAvLyBmYWxzZSBncmVlbiBjaGVjaykuXG4gICAgICByZXR1cm4gX3N0ZXAyQ29uZmlybWVkO1xuICAgIGNhc2UgMzpcbiAgICAgIC8vIFN0ZXAgMyBpcyB0aGUgdGVybWluYWwgYWN0aW9uIHN0ZXA7IG5ldmVyIFwiZG9uZVwiIGZvciBwcm9ncmVzc1xuICAgICAgLy8gcHVycG9zZXMgKHRoZSBzdWNjZXNzIGJhbm5lciBpbnNpZGUgdGhlIHN0ZXAgaXMgdGhlIGluZGljYXRvcikuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfc2V0QWN0aXZlU3RlcChuLCBvcHRzID0ge30pIHtcbiAgY29uc3QgY2xhbXBlZCA9IE1hdGgubWF4KDEsIE1hdGgubWluKDMsIG4pKTtcbiAgX2FjdGl2ZVN0ZXAgPSBjbGFtcGVkO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuYWN0aXZlU3RlcCA9IFN0cmluZyhjbGFtcGVkKTtcbiAgX3JlZnJlc2hXaXphcmRVaSgpO1xuICBpZiAoIW9wdHMuc2lsZW50KSB7XG4gICAgLy8gQXV0by1zY3JvbGwgdGhlIHBvcHVwIHRvIHRoZSB0b3Agb2YgdGhlIHN0ZXAgc28gdXNlcnMgYWx3YXlzXG4gICAgLy8gc2VlIHRoZSBzdGVwIGhlYWRlciAvIGZpcnN0IGlucHV0IGFmdGVyIG5hdmlnYXRpb24uXG4gICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaFdpemFyZFVpKCkge1xuICBpZiAoIWVscy53aXphcmRTdGVwcGVyKSByZXR1cm47XG4gIGNvbnN0IGxpcyA9IGVscy53aXphcmRTdGVwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVtkYXRhLXN0ZXBdXCIpO1xuICBmb3IgKGNvbnN0IGxpIG9mIGxpcykge1xuICAgIGNvbnN0IG4gPSBOdW1iZXIobGkuZGF0YXNldC5zdGVwKTtcbiAgICBjb25zdCBpc0FjdGl2ZSA9IG4gPT09IF9hY3RpdmVTdGVwO1xuICAgIGNvbnN0IGlzRG9uZSA9IF9pc1N0ZXBEb25lKG4pO1xuICAgIGlmIChpc0FjdGl2ZSkgbGkuc2V0QXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIsIFwidHJ1ZVwiKTtcbiAgICBlbHNlIGxpLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiKTtcbiAgICBpZiAoaXNEb25lKSBsaS5kYXRhc2V0LmRvbmUgPSBcInRydWVcIjtcbiAgICBlbHNlIGRlbGV0ZSBsaS5kYXRhc2V0LmRvbmU7XG4gIH1cbiAgLy8gU3RlcCAxJ3MgdGhyZWUgc3ViLWNhcmRzIChvZmYtbmhpIC8gbmVlZHMtbG9naW4gLyBsb2dpbi1vaykgYXJlXG4gIC8vIG11dHVhbGx5IGV4Y2x1c2l2ZSBcdTIwMTQgcGljayB0aGUgb25lIHRoYXQgbWF0Y2hlcyBjdXJyZW50IHN0YXRlLlxuICBjb25zdCBvbk5oaSA9ICFlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgY29uc3QgbG9nZ2VkSW4gPSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluICE9PSBcIm5vXCI7XG4gIGlmIChlbHMub3Blbk5oaVNlY3Rpb24pXG4gICAgZWxzLm9wZW5OaGlTZWN0aW9uLmhpZGRlbiA9IG9uTmhpO1xuICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKVxuICAgIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSAhb25OaGkgfHwgbG9nZ2VkSW47XG4gIGlmIChlbHMubG9naW5Pa1NlY3Rpb24pXG4gICAgZWxzLmxvZ2luT2tTZWN0aW9uLmhpZGRlbiA9ICEob25OaGkgJiYgbG9nZ2VkSW4pO1xuXG4gIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xufVxuXG4vLyBTaG93L2hpZGUgc3RlcC0zIHJlc3VsdCBjYXJkcyBiYXNlZCBvbiB3aGV0aGVyIGVhY2ggaGFzIGNvbnRlbnQuXG4vLyBFbXB0eSBjYXJkcyAoZS5nLiBhIHN1bW1hcnkgY2FyZCB3aXRoIG5vIHN0YXR1cyArIG5vIGRhdGEtc3RhdGUgaW5cbi8vIGxvY2FsIG1vZGUgcHJlLXN5bmMpIHVzZWQgdG8gcmVuZGVyIGFzIGEgYmxhbmsgc3RyaXBlIFx1MjAxNCBub3cgdGhleVxuLy8gc3RheSBjb2xsYXBzZWQgaW5kaXZpZHVhbGx5LCBhbmQgdGhlIHdob2xlIHpvbmUgZ29lcyBhd2F5IHdoZW4gYWxsXG4vLyB0aHJlZSBjYXJkcyB3b3VsZCBiZSBlbXB0eS5cbmZ1bmN0aW9uIF9yZWZyZXNoUmVzdWx0Wm9uZSgpIHtcbiAgaWYgKCFlbHMucmVzdWx0Wm9uZSkgcmV0dXJuO1xuICBjb25zdCBoYXNTdGF0dXMgPSAoZWxzLnN0YXR1cz8udGV4dENvbnRlbnQgPz8gXCJcIikudHJpbSgpICE9PSBcIlwiO1xuICBjb25zdCBkYXRhU3RhdGVTaG93biA9XG4gICAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24gJiYgIWVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbjtcbiAgY29uc3QgYnVuZGxlU2hvd24gPVxuICAgIGVscy5wZW5kaW5nQnVuZGxlICYmICFlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW47XG4gIC8vIExhdW5jaCBidXR0b24gb25seSBjb3VudHMgd2hlbiB1c2FibGUgXHUyMDE0IGJhY2tlbmQgbW9kZSArIHRoZSBwYXRpZW50XG4gIC8vIGFjdHVhbGx5IGV4aXN0cyBvbiB0aGUgYmFja2VuZCAoYGxhdW5jaEJ0bi5kaXNhYmxlZCA9PT0gZmFsc2VgKS5cbiAgLy8gQSBwZXJtYS1kaXNhYmxlZCBidXR0b24gc2hvdWxkbid0IHBpbiB0aGUgem9uZSBvcGVuLlxuICBjb25zdCBsYXVuY2hVc2FibGUgPVxuICAgIGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIGVscy5sYXVuY2hCdG4gJiYgIWVscy5sYXVuY2hCdG4uZGlzYWJsZWQ7XG5cbiAgLy8gSGlkZSB0aGUgZW50aXJlIHJlc3VsdCBzZWN0aW9uICh0aGUgZGl2aWRlciArIGV2ZXJ5dGhpbmcgYWZ0ZXIpIHdoZW5cbiAgLy8gdGhlcmUncyBub3RoaW5nIG1lYW5pbmdmdWwgdG8gc2hvdy5cbiAgZWxzLnJlc3VsdFpvbmUuaGlkZGVuID0gIShoYXNTdGF0dXMgfHwgYnVuZGxlU2hvd24gfHwgZGF0YVN0YXRlU2hvd24gfHwgbGF1bmNoVXNhYmxlKTtcblxuICAvLyBCdW5kbGUgZmlsZW5hbWUgLyBzaXplIGJsb2NrIGZvbGxvd3MgYnVuZGxlIHZpc2liaWxpdHkuXG4gIGlmIChlbHMuYnVuZGxlTWV0YUJsb2NrKSB7XG4gICAgZWxzLmJ1bmRsZU1ldGFCbG9jay5oaWRkZW4gPSAhYnVuZGxlU2hvd247XG4gIH1cbiAgLy8gTGF1bmNoIGJ1dHRvbiBoaWRlLXdoZW4tbm90LXVzYWJsZSBzbyB0aGUgLm5leHQtYWN0aW9ucyByb3dcbiAgLy8gZG9lc24ndCBzaG93IGEgcGVybWEtZGlzYWJsZWQgb3V0bGluZSBidXR0b24gbmV4dCB0byBub3RoaW5nLlxuICBpZiAoZWxzLmxhdW5jaEJ0bikge1xuICAgIGVscy5sYXVuY2hCdG4uaGlkZGVuID0gY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIWxhdW5jaFVzYWJsZTtcbiAgfVxuXG4gIC8vIERlbW90ZSB0aGUgXHU1M0Q2XHU1Rjk3IENUQSBvbmNlIHdlIGhhdmUgYSByZXN1bHQgKyBhIHVzYWJsZSBuZXh0LXN0ZXBcbiAgLy8gYWN0aW9uLiBUaGUgXCJwcmltYXJ5IGFjdGlvblwiIGJhdG9uIHBhc3NlcyB0byBcdTRFMEJcdThGMDkgLyBcdTk1OEJcdTU1NUYgQXBwIHNvXG4gIC8vIHRoZSB1c2VyJ3MgZXllIGxhbmRzIG9uIHdoYXQncyBuZXh0LCBub3Qgb24gXCJyZWRvIHRoZSB0aGluZ1wiLlxuICBjb25zdCBoYXNSZXN1bHRBcnRpZmFjdCA9IGJ1bmRsZVNob3duIHx8IGxhdW5jaFVzYWJsZTtcbiAgaWYgKGVscy5zeW5jQXBpQnRuKSB7XG4gICAgY29uc3Qgc2hvdWxkRGVtb3RlID0gaGFzUmVzdWx0QXJ0aWZhY3QgJiYgIWVscy5zeW5jQXBpQnRuLmRpc2FibGVkO1xuICAgIGVscy5zeW5jQXBpQnRuLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1zZWNvbmRhcnlcIiwgc2hvdWxkRGVtb3RlKTtcbiAgICAvLyBSZWxhYmVsIHRvIG1hdGNoIHRoZSBuZXcgcm9sZS4gV2hpbGUgdGhlIHN5bmMgaXMgcnVubmluZyB3ZSBrZWVwXG4gICAgLy8gdGhlIHByb21wdCBtaWQtcmVuZGVyIHRleHQgYWxvbmUgKGFwcGx5U3luY1N0YXR1cyBvd25zIHRoYXQpLlxuICAgIGlmICghX2xhdGVzdFN0YXR1cz8ucnVubmluZykge1xuICAgICAgZWxzLnN5bmNBcGlCdG4udGV4dENvbnRlbnQgPSBzaG91bGREZW1vdGVcbiAgICAgICAgPyBcIlx1OTFDRFx1NjVCMFx1NTNENlx1NUY5N1wiXG4gICAgICAgIDogXCJcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcIjtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX21heWJlQXV0b0FkdmFuY2UoKSB7XG4gIC8vIE9ubHkgYWR2YW5jZSBmb3J3YXJkLCBuZXZlciBiYWNrLiBTYXZlIHVzZXIncyBwbGFjZSBpZiB0aGV5J3ZlXG4gIC8vIGNsaWNrZWQgaW50byBhIGxhdGVyIHN0ZXAgbWFudWFsbHkuXG4gIGlmIChfYWN0aXZlU3RlcCA9PT0gMSAmJiBfaXNTdGVwRG9uZSgxKSkgX3NldEFjdGl2ZVN0ZXAoMik7XG4gIGVsc2UgaWYgKF9hY3RpdmVTdGVwID09PSAyICYmIF9pc1N0ZXBEb25lKDIpKSBfc2V0QWN0aXZlU3RlcCgzKTtcbn1cblxuZnVuY3Rpb24gX2luaXRXaXphcmQoKSB7XG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIHJldHVybjtcbiAgX3dpemFyZEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgLy8gSW5pdGlhbCBzdGVwOiB3aGljaGV2ZXIgaXMgdGhlIEZJUlNUIG5vdC15ZXQtZG9uZSBzdGVwIGF0IHBvcHVwIG9wZW4uXG4gIC8vIEZpcnN0LXRpbWUgdXNlciBcdTIxOTIgc3RlcCAxLiBSZXR1cm5pbmcgdXNlciB3aXRoIHZhbGlkIHNlc3Npb24gKyBzYXZlZFxuICAvLyBwYXRpZW50IFx1MjE5MiBzdGVwIDMuXG4gIGNvbnN0IHN0YXJ0ID0gX2lzU3RlcERvbmUoMSkgPyAoX2lzU3RlcERvbmUoMikgPyAzIDogMikgOiAxO1xuICBfc2V0QWN0aXZlU3RlcChzdGFydCwgeyBzaWxlbnQ6IHRydWUgfSk7XG5cbiAgLy8gU3RlcHBlciBjbGlja3MgXHUyMTkyIGp1bXBcbiAgZm9yIChjb25zdCBsaSBvZiBlbHMud2l6YXJkU3RlcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwibGlbZGF0YS1zdGVwXVwiKSkge1xuICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBfc2V0QWN0aXZlU3RlcChOdW1iZXIobGkuZGF0YXNldC5zdGVwKSkpO1xuICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIiB8fCBlLmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBfc2V0QWN0aXZlU3RlcChOdW1iZXIobGkuZGF0YXNldC5zdGVwKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlZnJlc2hCdXR0b25TdGF0ZXMoKSB7XG4gIC8vIFN5bmMgYnV0dG9uLiBDb25kaXRpb25zLCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgLy8gICAxLiBvbiBhbiBOSEkgdGFiXG4gIC8vICAgMi4gbG9nZ2VkIGluIHRvIE5ISSAoZGV0ZWN0ZWQgdmlhIGJhY2tncm91bmQgcHJlLWZsaWdodClcbiAgLy8gICAzLiBiYWNrZW5kIG1vZGUgXHUyMTkyIGJhY2tlbmQgY29ubmVjdGVkXG4gIC8vICAgNC4gZ2VuZGVyIGZpbGxlZCAob3RoZXIgcGF0aWVudCBmaWVsZHMgYWxsIG9wdGlvbmFsKVxuICAvLyBXaGF0ZXZlciBibG9ja3MgdGhlIENUQSBhbHNvIGdldHMgc3VyZmFjZWQgYXMgYW4gaW5saW5lIG1lc3NhZ2VcbiAgLy8gYmVsb3cgdGhlIGJ1dHRvbiBcdTIwMTQgdG9vbHRpcHMgYXJlIGludmlzaWJsZSBpbiB0aGUgMzYwcHggcG9wdXAuXG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBsb2dnZWRJbiA9IGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW4gIT09IFwibm9cIjtcbiAgY29uc3QgbW9kZU9rID0gY3VycmVudE1vZGUoKSA9PT0gXCJsb2NhbFwiIHx8IF9jb25uU3RhdGUgPT09IFwib2tcIjtcbiAgLy8gU3RlcCAyIGhhcmQgcmVxdWlyZW1lbnRzOiBnZW5kZXIsIGJpcnRoX2RhdGUgKHZhbGlkKSwgYW5kIG5hbWUuXG4gIC8vIFRyYWNrZWQgYXMgb25lIHJvbGxlZC11cCBmbGFnIHNvIHRoZSBibG9ja2VkLUNUQSBzdHJpcCBzYXlzXG4gIC8vIFwiY29tcGxldGUgdGhlIGJhc2ljIGluZm9cIiBnZW5lcmljYWxseSByZWdhcmRsZXNzIG9mIHdoaWNoIGZpZWxkXG4gIC8vIGlzIG1pc3NpbmcgZmlyc3QuXG4gIGNvbnN0IHN0ZXAyQmFzaWNPayA9ICEhZWxzLm92R2VuZGVyPy52YWx1ZSAmJiAhIWVscy5vdk5hbWU/LnZhbHVlPy50cmltKCk7XG4gIGNvbnN0IGRvYkVycm9yID0gdmFsaWRhdGVCaXJ0aERhdGUoKTtcblxuICAvLyBFYWNoIGJsb2NraW5nIHJlYXNvbiBuYW1lcyB0aGUgc3RlcCB0aGF0IG5lZWRzIGF0dGVudGlvbi4gTW9kZSArXG4gIC8vIGNvbm5lY3Rpb24gbm93IGxpdmUgaW4gc3RlcCAzIGFsb25nc2lkZSB0aGUgQ1RBIGl0c2VsZiwgc28gdGhvc2VcbiAgLy8gcmVhc29ucyByZWZlcmVuY2Ugd2hhdCdzIGRpcmVjdGx5IGFib3ZlIHRoZSBidXR0b24gcmF0aGVyIHRoYW5cbiAgLy8gc2VuZGluZyB0aGUgdXNlciBiYWNrIHRocm91Z2ggdGhlIHN0ZXBwZXIuXG4gIC8vXG4gIC8vIEVYQ0VQVCB0aGUgY29ubi1mYWlsZWQgY2FzZTogdGhlIGNvbm4gYmFubmVyIGRpcmVjdGx5IGFib3ZlIHRoZVxuICAvLyBDVEEgYWxyZWFkeSBzaG91dHMgXCJcdTI3MTcgXHU5MDIzXHU0RTBEXHU0RTBBXHU1RjhDXHU3QUVGXCIgKyByZXRyeSBidXR0b24gKyBoZWxwLiBBZGRpbmdcbiAgLy8gYW5vdGhlciBpbmxpbmUgc3RyaXAganVzdCB0byByZXBlYXQgdGhlIHNhbWUgZmFjdCAod2l0aCBhIHNsaWdodGx5XG4gIC8vIGxvbmdlciBzZW50ZW5jZSkgaXMgbm9pc2UgXHUyMDE0IHNpbGVudGx5IGRpc2FibGUgdGhlIENUQSBpbnN0ZWFkLCB3aXRoXG4gIC8vIGEgdG9vbHRpcCBleHBsYW5hdGlvbi4gaW5saW5lUmVhc29uIGlzIHdoYXQgc2hvd3MgaW4gdGhlIHdhcm5pbmdcbiAgLy8gc3RyaXA7IHRvb2x0aXBSZWFzb24gaXMgd2hhdCB0aGUgZGlzYWJsZWQgYnV0dG9uIGFkdmVydGlzZXMgb24gaG92ZXIuXG4gIC8vIFJlYXNvbiBmb3IgYmxvY2tlZCBDVEEuIGlubGluZU1zZyByZW5kZXJzIGluIHRoZSB3YXJuaW5nIHN0cmlwO1xuICAvLyB0b29sdGlwIGlzIHdoYXQgdGhlIGRpc2FibGVkIGJ1dHRvbiBhZHZlcnRpc2VzIG9uIGhvdmVyOyBqdW1wVG9cbiAgLy8gKHdoZW4gc2V0KSBtYWtlcyB0aGUgc3RyaXAgYSBjbGlja2FibGUgc2hvcnRjdXQgYmFjayB0byB0aGF0IHN0ZXAuXG4gIGxldCBpbmxpbmVNc2cgPSBcIlwiO1xuICBsZXQganVtcFRvID0gbnVsbDsgICAgICAgLy8geyBzdGVwOiAxfDIsIGxhYmVsOiBcIlx1NzY3Qlx1NTE2NVwiIHwgXCJcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcIiB9XG4gIGxldCB0b29sdGlwUmVhc29uID0gXCJcIjtcbiAgaWYgKCFvbk5oaSkge1xuICAgIGlubGluZU1zZyA9IFwiXHU4QUNCXHU1MjA3XHU1MjMwXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU1MjA2XHU5ODAxXCI7XG4gICAganVtcFRvID0geyBzdGVwOiAxLCBsYWJlbDogXCJcdTc2N0JcdTUxNjVcIiB9O1xuICB9IGVsc2UgaWYgKCFsb2dnZWRJbikge1xuICAgIGlubGluZU1zZyA9IFwiXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU1MjA2XHU5ODAxXHU1QzFBXHU2NzJBXHU3NjdCXHU1MTY1XCI7XG4gICAganVtcFRvID0geyBzdGVwOiAxLCBsYWJlbDogXCJcdTc2N0JcdTUxNjVcIiB9O1xuICB9IGVsc2UgaWYgKCFzdGVwMkJhc2ljT2spIHtcbiAgICAvLyBEb24ndCBlbnVtZXJhdGUgd2hpY2ggZmllbGQgaXMgbWlzc2luZyBcdTIwMTQgdGhlcmUgY291bGQgYmUgbW9yZVxuICAgIC8vIHRoYW4gb25lIChnZW5kZXIsIG5hbWUsIGJvdGgpLCBhbmQgc3RlcCAyIGFscmVhZHkgbWFya3MgZWFjaFxuICAgIC8vIHJlcXVpcmVkIGZpZWxkIHdpdGggYSByZWQgKiB0aGUgdXNlciB3aWxsIHNlZSBhZnRlciB0aGUgb25lLVxuICAgIC8vIGNsaWNrIGp1bXAuIEtlZXAgdGhlIG1lc3NhZ2UgYWJvdXQgdGhlIGhpZ2gtbGV2ZWwgYWN0aW9uXG4gICAgLy8gKGNvbXBsZXRlICsgY29uZmlybSkuXG4gICAgaW5saW5lTXNnID0gXCJcdThBQ0JcdTVCOENcdTYyMTBcdTU3RkFcdTY3MkNcdThDQzdcdTY1OTlcdTRFMjZcdTYzMDlcdTc4QkFcdTVCOUFcIjtcbiAgICBqdW1wVG8gPSB7IHN0ZXA6IDIsIGxhYmVsOiBcIlx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVwiIH07XG4gIH0gZWxzZSBpZiAoZG9iRXJyb3IpIHtcbiAgICBpbmxpbmVNc2cgPSBkb2JFcnJvcjtcbiAgICBqdW1wVG8gPSB7IHN0ZXA6IDIsIGxhYmVsOiBcIlx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVwiIH07XG4gIH0gZWxzZSBpZiAoIW1vZGVPaykge1xuICAgIGlubGluZU1zZyA9IFwiXCI7ICAgICAgICAgICAgICAgICAvLyBjb25uIGJhbm5lciBhYm92ZSBjYXJyaWVzIHRoZSBtZXNzYWdlXG4gICAgdG9vbHRpcFJlYXNvbiA9IFwiXHU1RjhDXHU3QUVGXHU1QzFBXHU2NzJBXHU5MDIzXHU3RERBXCI7XG4gIH1cbiAgaWYgKGp1bXBUbykgdG9vbHRpcFJlYXNvbiA9IGBcdTU2REUgJHtfc3RlcE51bUdseXBoKGp1bXBUby5zdGVwKX0gJHtqdW1wVG8ubGFiZWx9XHVGRjFBJHtpbmxpbmVNc2d9YDtcblxuICAvLyBEb24ndCBmbGlwIHRoZSBDVEEgYmFjayB0byBlbmFibGVkIGlmIGEgc3luYyBpcyBjdXJyZW50bHkgcnVubmluZ1xuICAvLyBcdTIwMTQgdGhlIFNXIHVwZGF0ZXMgYHBhdGllbnRPdmVycmlkZWAgbWlkLXN5bmMgKGF1dG8tZmV0Y2hlZCBjaWQpLFxuICAvLyB3aGljaCB0cmlnZ2VycyBzdG9yYWdlLm9uQ2hhbmdlZCBcdTIxOTIgbG9hZFBhdGllbnRPdmVycmlkZSBcdTIxOTJcbiAgLy8gX3JlZnJlc2hCdXR0b25TdGF0ZXMuIFdpdGhvdXQgdGhpcyBndWFyZCB0aGUgYnV0dG9uIHdvdWxkIHJlLWVuYWJsZVxuICAvLyBoYWxmd2F5IHRocm91Z2ggYSBzeW5jIGFuZCB0aGUgdXNlciBjb3VsZCBjbGljayBpdCBhZ2Fpbi5cbiAgY29uc3Qgc3luY1J1bm5pbmcgPSBfbGF0ZXN0U3RhdHVzPy5ydW5uaW5nID09PSB0cnVlO1xuICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHN5bmNSdW5uaW5nIHx8IHRvb2x0aXBSZWFzb24gIT09IFwiXCI7XG4gIGVscy5zeW5jQXBpQnRuLnRpdGxlID0gc3luY1J1bm5pbmcgPyBcIlwiIDogdG9vbHRpcFJlYXNvbjtcbiAgaWYgKGVscy5zeW5jQmxvY2tlZFJlYXNvbikge1xuICAgIGNvbnN0IHNob3cgPSAhc3luY1J1bm5pbmcgJiYgaW5saW5lTXNnICE9PSBcIlwiO1xuICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi5oaWRkZW4gPSAhc2hvdztcbiAgICBpZiAoc2hvdykge1xuICAgICAgLy8gQnVpbGQgdGhlIHN0cmlwJ3MgY29udGVudDogXCJcdTI2QTAge21zZ30gICAgXHU1NkRFIFx1MjQ2MCBcdTc2N0JcdTUxNjUgXHUyMTkyXCIgc28gdGhlXG4gICAgICAvLyB1c2VyIHNlZXMgYm90aCB0aGUgcmVhc29uIGFuZCB3aGVyZSB0aGUgY2xpY2sgd2lsbCB0YWtlIHRoZW0uXG4gICAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24udGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgY29uc3QgbXNnRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIG1zZ0VsLmNsYXNzTmFtZSA9IFwiY3RhLXJlYXNvbi1tc2dcIjtcbiAgICAgIG1zZ0VsLnRleHRDb250ZW50ID0gYFx1MjZBMFx1RkUwRiAke2lubGluZU1zZ31gO1xuICAgICAgZWxzLnN5bmNCbG9ja2VkUmVhc29uLmFwcGVuZENoaWxkKG1zZ0VsKTtcbiAgICAgIGlmIChqdW1wVG8pIHtcbiAgICAgICAgY29uc3QganVtcEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIGp1bXBFbC5jbGFzc05hbWUgPSBcImN0YS1yZWFzb24tanVtcFwiO1xuICAgICAgICBqdW1wRWwudGV4dENvbnRlbnQgPSBgXHU1NkRFICR7X3N0ZXBOdW1HbHlwaChqdW1wVG8uc3RlcCl9ICR7anVtcFRvLmxhYmVsfSBcdTIxOTJgO1xuICAgICAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24uYXBwZW5kQ2hpbGQoanVtcEVsKTtcbiAgICAgICAgZWxzLnN5bmNCbG9ja2VkUmVhc29uLmRhdGFzZXQudGFyZ2V0U3RlcCA9IFN0cmluZyhqdW1wVG8uc3RlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgZWxzLnN5bmNCbG9ja2VkUmVhc29uLmRhdGFzZXQudGFyZ2V0U3RlcDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gTWlycm9yIHRoZSBzdG9wLWJ1dHRvbiB2aXNpYmlsaXR5IHNvIHRoZSB1c2VyIGNhbiBhbHdheXMgY2FuY2VsXG4gIC8vIG1pZC1zeW5jIGV2ZW4gaWYgdGhlIHBvcHVwIHJlLXJlbmRlcnMgZHVlIHRvIG9uQ2hhbmdlZC5cbiAgaWYgKGVscy5zdG9wQnRuKSBlbHMuc3RvcEJ0bi5oaWRkZW4gPSAhc3luY1J1bm5pbmc7XG5cbiAgLy8gTGF1bmNoIGJ1dHRvbjogYmFja2VuZCBtb2RlICsgY29ubiBvayArIHBhdGllbnQgc2V0ICsgYmFja2VuZFxuICAvLyBhY3R1YWxseSBoYXMgdGhpcyBwYXRpZW50IChvdGhlcndpc2UgdGhlIFNNQVJUIGFwcCBsYXVuY2hlcyBpbnRvXG4gIC8vIGFuIGVtcHR5IEZISVIgc3RvcmUgXHUyMDE0IGNvbmZ1c2luZyBibGFuayBzY3JlZW4pLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBoYXZlQmFja2VuZFBhdGllbnQgPSBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiO1xuICBlbHMubGF1bmNoQnRuLmRpc2FibGVkID0gIShcbiAgICBjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJlxuICAgIF9jb25uU3RhdGUgPT09IFwib2tcIiAmJlxuICAgICEhb3Y/LmlkX25vICYmXG4gICAgaGF2ZUJhY2tlbmRQYXRpZW50XG4gICk7XG4gIGVscy5sYXVuY2hCdG4udGl0bGUgPVxuICAgIGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiICA/IFwiXHU4QUNCXHU1MjA3XHU1MjMwXHUzMDBDXHVEODNDXHVERkU1IFx1NjcyQ1x1NkE1Rlx1NUY4Q1x1N0FFRiAoXHU5MDMyXHU5NjhFKVx1MzAwRFx1NkEyMVx1NUYwRlwiIDpcbiAgICBfY29ublN0YXRlICE9PSBcIm9rXCIgICAgICAgICAgID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIiA6XG4gICAgIW92Py5pZF9ubyAgICAgICAgICAgICAgICAgICAgPyBcIlx1NTZERSBcdTI0NjEgXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XHVGRjFBXHU4QUNCXHU1ODZCXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCIgOlxuICAgICFoYXZlQmFja2VuZFBhdGllbnQgICAgICAgICAgID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTkgXHUyMDE0IFx1NTE0OFx1NjMwOVx1MzAwQ1x1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MzAwRFx1NjIxNlx1NEUwQlx1NjVCOVx1MzAwQ1x1NjI4QVx1NjcyQ1x1NTczMFx1NkE5NFx1Njg0OFx1NEUwQVx1NTBCM1x1NTIzMFx1NUY4Q1x1N0FFRlx1MzAwRFwiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCI7XG5cbiAgLy8gUmVmcmVzaCB0aGUgc3RlcHBlciBVSSBvbiBldmVyeSBzdGF0ZSBjaGFuZ2UsIGJ1dCBET04nVCBhdXRvLVxuICAvLyBhZHZhbmNlIGZyb20gaGVyZSBcdTIwMTQgaW5jaWRlbnRhbCBpbnB1dCBjaGFuZ2VzICh0eXBpbmcgaW4gYSBmaWVsZFxuICAvLyB3aGlsZSByZXZpc2l0aW5nIHN0ZXAgMikgc2hvdWxkbid0IHlhbmsgdGhlIHVzZXIgZm9yd2FyZC4gQXV0by1cbiAgLy8gYWR2YW5jZSBpcyBvbmx5IGZpcmVkIGZyb20gdGhlIGV2ZW50cyB0aGF0IHNpZ25hbCBpbnRlbnQ6XG4gIC8vICAgLSBsb2dpbiBwcm9iZSBmbGlwcGluZyB0byB0cnVlIFx1MjE5MiBmb3J3YXJkIGludG8gc3RlcCAyXG4gIC8vICAgLSBzYXZlUGF0aWVudE92ZXJyaWRlIHN1Y2Nlc3MgXHUyMTkyIGZvcndhcmQgaW50byBzdGVwIDNcbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hXaXphcmRVaSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKSB7XG4gIGNvbnN0IHVybCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKTtcbiAgaWYgKCF1cmwpIHtcbiAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJuby11cmxcIiB9O1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7IHJldHVybiBmYWxzZTtcbiAgfVxuICBfY29ublN0YXRlID0gXCJjaGVja2luZ1wiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuXG4gIGNvbnN0IHBlcm0gPSBhd2FpdCBlbnN1cmVCYWNrZW5kUGVybWlzc2lvbih1cmwpO1xuICBpZiAoIXBlcm0ub2spIHtcbiAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJuby1wZXJtaXNzaW9uXCIgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpOyByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjdHJsID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gY3RybC5hYm9ydCgpLCA1MDAwKTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt1cmwucmVwbGFjZSgvXFwvJC8sIFwiXCIpfS9maGlyL21ldGFkYXRhYCwgeyBzaWduYWw6IGN0cmwuc2lnbmFsIH0pO1xuICAgIGlmICghcmVzLm9rKSB7XG4gICAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJodHRwXCIsIGRldGFpbDogcmVzLnN0YXR1cyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVzLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcbiAgICAgIGlmIChib2R5Py5yZXNvdXJjZVR5cGUgIT09IFwiQ2FwYWJpbGl0eVN0YXRlbWVudFwiKSB7XG4gICAgICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vdC1maGlyXCIgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9jb25uU3RhdGUgPSBcIm9rXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiO1xuICAgIF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dFwiIDogXCJuZXR3b3JrXCIgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICB9XG5cbiAgX3JlbmRlckNvbm5CYW5uZXIoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgLy8gV2hlbmV2ZXIgY29ubmVjdGl2aXR5IGZsaXBzLCByZS1jaGVjayB3aGV0aGVyIHRoaXMgcGF0aWVudCBhbHJlYWR5XG4gIC8vIGV4aXN0cyBvbiBiYWNrZW5kLiAoU3RhbGUgXCJfYmFja2VuZFBhdGllbnRcIiBzdGF0ZSB3b3VsZCBvdGhlcndpc2VcbiAgLy8gY2F1c2UgTGF1bmNoIHRvIGxvb2sgZW5hYmxlZCAvIGRpc2FibGVkIHdyb25nbHkuKVxuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgcmV0dXJuIF9jb25uU3RhdGUgPT09IFwib2tcIjtcbn1cblxuZWxzLmNvbm5SZXRyeUJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRlc3RCYWNrZW5kQ29ubmVjdGlvbik7XG5cbi8vIFx1MjUwMFx1MjUwMCBCYWNrZW5kIFx1MjE5NCBsb2NhbCBkYXRhLXN0YXRlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEluZGVwZW5kZW50IG9mIHRoZSBjb25uZWN0aW9uIGJhbm5lciAod2hpY2ggb25seSB0ZWxscyB1cyBcImNhbiB3ZVxuLy8gcmVhY2ggdGhlIGJhY2tlbmRcIikuIFRoaXMgY2FyZCBhbnN3ZXJzIHR3byBxdWVzdGlvbnM6XG4vL1xuLy8gICAxLiBEb2VzIHRoZSBiYWNrZW5kIGFscmVhZHkgaGF2ZSB0aGlzIHBhdGllbnQncyBkYXRhP1xuLy8gICAgICBcdTIxOTIgZHJpdmVzIHdoZXRoZXIgXHVEODNEXHVERTgwIExhdW5jaCBpcyBhbGxvd2VkIGF0IGFsbCAoTGF1bmNoIG9uIGFuXG4vLyAgICAgICAgZW1wdHkgYmFja2VuZCBnaXZlcyBhIGNvbmZ1c2luZyBTTUFSVC1hcHAgYmxhbmspLlxuLy8gICAyLiBEb2VzIHRoZSB1c2VyIGhhdmUgYSBsb2NhbCBCdW5kbGUgdGhhdCdzIG5ld2VyIHRoYW4gdGhlXG4vLyAgICAgIGJhY2tlbmQncyB2aWV3P1xuLy8gICAgICBcdTIxOTIgb2ZmZXIgXCJcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzXHU2NzJDXHU1NzMwIEJ1bmRsZSBcdTUyMzBcdTVGOENcdTdBRUZcIiB0byBwdXNoIGl0IHZpYSAvZmhpci9pbXBvcnRcbi8vICAgICAgICB3aXRob3V0IHJlLWZldGNoaW5nIE5ISSAoZmFzdCwgbm9uLWRlc3RydWN0aXZlOiBzdGFibGUgSURzXG4vLyAgICAgICAgdXBzZXJ0IHNvIGJhY2tlbmQgcmVzb3VyY2VzIGp1c3QgYnVtcCB2ZXJzaW9uSWQpLlxuLy9cbi8vIFdlIGRvbid0IHNlY29uZC1ndWVzcyB0aGUgdXNlcjogZXZlbiB3aGVuIGxvY2FsIGlzIGNsZWFybHkgbmV3ZXIsXG4vLyBMYXVuY2ggc3RheXMgZW5hYmxlZCBpZiB0aGUgYmFja2VuZCBoYXMgdGhlIHBhdGllbnQgXHUyMDE0IHRoZXkgbWF5XG4vLyBnZW51aW5lbHkgd2FudCB0byBsb29rIGF0IHRoZSBvbGRlciBzdGF0ZS4gVGhlIFVJIGxheXMgb3V0IGJvdGhcbi8vIHNpZGVzOyB1c2VyIGRlY2lkZXMuXG5cbmxldCBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4vLyAgIHN0YXRlOiBcInVua25vd25cIiB8IFwiY2hlY2tpbmdcIiB8IFwiYWJzZW50XCIgfCBcInByZXNlbnRcIiB8IFwiZmFpbFwiXG5sZXQgX2xvY2FsQnVuZGxlID0geyBleGlzdHM6IGZhbHNlLCBjb3VudDogMCwgZ2VuZXJhdGVkQXQ6IDAsIHBhdGllbnRJZDogbnVsbCB9O1xuXG5mdW5jdGlvbiBfZm10VGltZVNob3J0KGlzbykge1xuICBpZiAoIWlzbykgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IGQgPSBuZXcgRGF0ZShpc28pO1xuICBpZiAoTnVtYmVyLmlzTmFOKGQuZ2V0VGltZSgpKSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgXCIwXCIpO1xuICByZXR1cm4gYCR7ZC5nZXRNb250aCgpICsgMX0vJHtkLmdldERhdGUoKX0gJHtwYWQoZC5nZXRIb3VycygpKX06JHtwYWQoZC5nZXRNaW51dGVzKCkpfWA7XG59XG5cbmZ1bmN0aW9uIF9mbXRSZWxhdGl2ZShtcykge1xuICBjb25zdCBkaWZmID0gRGF0ZS5ub3coKSAtIG1zO1xuICBpZiAoZGlmZiA8IDYwXzAwMCkgcmV0dXJuIGAke01hdGgubWF4KDEsIE1hdGgucm91bmQoZGlmZiAvIDEwMDApKX0gXHU3OUQyXHU1MjREYDtcbiAgaWYgKGRpZmYgPCAzNjAwXzAwMCkgcmV0dXJuIGAke01hdGgucm91bmQoZGlmZiAvIDYwXzAwMCl9IFx1NTIwNlx1OTQxOFx1NTI0RGA7XG4gIGlmIChkaWZmIDwgODZfNDAwXzAwMCkgcmV0dXJuIGAke01hdGgucm91bmQoZGlmZiAvIDM2MDBfMDAwKX0gXHU1QzBGXHU2NjQyXHU1MjREYDtcbiAgcmV0dXJuIF9mbXRUaW1lU2hvcnQobmV3IERhdGUobXMpLnRvSVNPU3RyaW5nKCkpO1xufVxuXG5mdW5jdGlvbiBfcmVuZGVyRGF0YVN0YXRlKCkge1xuICAvLyBTZWN0aW9uIG9ubHkgdmlzaWJsZSBpbiBiYWNrZW5kIG1vZGUgKGhhbmRsZWQgYnkgLmJhY2tlbmQtb25seSBDU1MpLFxuICAvLyBidXQgd2UgYWxzbyBleHBsaWNpdGx5IGhpZGUgd2hlbiB0aGUgcG9wdXAgaGFzIG5vIHBhdGllbnRfb3ZlcnJpZGVcbiAgLy8gc2V0LCBzaW5jZSBib3RoIGNoZWNrcyBrZXkgb2ZmIHBhdGllbnRfaWQuXG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmIChjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiB8fCAhb3Y/LmlkX25vKSB7XG4gICAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoZWxzLnN5bmNTdGF0dXNIaW50KSBlbHMuc3luY1N0YXR1c0hpbnQuaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBDYXJkIHNlcnZlcyBhcyBhbiBhbGVydCwgbm90IGEgZGFzaGJvYXJkIFx1MjAxNCBzaG93IG9ubHkgd2hlbiB0aGVyZSdzXG4gIC8vIHNvbWV0aGluZyBhY3Rpb25hYmxlIC8gd29ydGggZmxhZ2dpbmcuIEhpZGUgd2hlbjpcbiAgLy8gICAtIGJhY2tlbmQgaGFzIHRoaXMgcGF0aWVudCBBTkQgbm8gbG9jYWwgYnVuZGxlIHRvIGNvbXBhcmUgYWdhaW5zdFxuICAvLyAgICAgKExhdW5jaCBpcyBlbmFibGVkIFx1MjE5MiB0aGF0J3MgdGhlIHNpZ25hbCBldmVyeXRoaW5nJ3MgZmluZSksIG9yXG4gIC8vICAgLSBib3RoIHNpZGVzIGFncmVlIG9uIGNvdW50IChhbHJlYWR5IGluIHN5bmMsIG5vIHVwbG9hZCBuZWVkZWQpLlxuICAvLyBUaGUgcmVtYWluaW5nIHN0YXRlcyAoY2hlY2tpbmcgLyBmYWlsIC8gYWJzZW50IC8gY291bnQgbWlzbWF0Y2gpIGFsbFxuICAvLyBlaXRoZXIgbmVlZCB1c2VyIGF0dGVudGlvbiBvciBhcmUgdHJhbnNpZW50IGxvYWRpbmcgZmVlZGJhY2suXG4gIGNvbnN0IGxvY2FsTWF0Y2hlcyA9IF9sb2NhbEJ1bmRsZS5leGlzdHMgJiYgX2xvY2FsQnVuZGxlLnBhdGllbnRJZCA9PT0gb3YuaWRfbm87XG4gIGNvbnN0IGluU3luYyA9XG4gICAgX2JhY2tlbmRQYXRpZW50LnN0YXRlID09PSBcInByZXNlbnRcIiAmJlxuICAgIGxvY2FsTWF0Y2hlcyAmJlxuICAgIF9iYWNrZW5kUGF0aWVudC5jb3VudCA9PT0gX2xvY2FsQnVuZGxlLmNvdW50O1xuICAvLyBRdWlldCBcIlx1MjcxMyBcdTVERjJcdTU0MENcdTZCNjVcIiBoaW50IHNpdHMgdW5kZXIgdGhlIGRvd25sb2FkIGJ1dHRvbiB3aGVuIGluLXN5bmMgXHUyMDE0XG4gIC8vIGdpdmVzIHRoZSB1c2VyIGEgdGlueSBhY2tub3dsZWRnZW1lbnQgaW5zdGVhZCBvZiB0b3RhbCBzaWxlbmNlLlxuICBpZiAoZWxzLnN5bmNTdGF0dXNIaW50KSBlbHMuc3luY1N0YXR1c0hpbnQuaGlkZGVuID0gIWluU3luYztcbiAgY29uc3Qgbm90aGluZ1RvU2hvdyA9XG4gICAgX2JhY2tlbmRQYXRpZW50LnN0YXRlID09PSBcInByZXNlbnRcIiAmJiAoIWxvY2FsTWF0Y2hlcyB8fCBpblN5bmMpO1xuICBpZiAobm90aGluZ1RvU2hvdykge1xuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbiA9IGZhbHNlO1xuXG4gIC8vIEJhY2tlbmQgcm93XG4gIGNvbnN0IGJzID0gZWxzLmJhY2tlbmRTdGF0ZTtcbiAgc3dpdGNoIChfYmFja2VuZFBhdGllbnQuc3RhdGUpIHtcbiAgICBjYXNlIFwiY2hlY2tpbmdcIjpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWVcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTZBQTJcdTY3RTVcdTRFMkRcdTIwMjZcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJhYnNlbnRcIjpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWUgZW1wdHlcIjtcbiAgICAgIC8vIENhcmQgc2l0cyBpbnNpZGUgdGhlIHJlc3VsdCB6b25lIG5leHQgdG8gdGhlIFx1RDgzRFx1REQwNCBcdTUzRDZcdTVGOTcgQ1RBIGFuZFxuICAgICAgLy8gdGhlIFx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjMgYnV0dG9uIFx1MjAxNCBwb2ludGluZyBhdCB0aGVtIHdpdGggdGV4dCB3b3VsZCBiZVxuICAgICAgLy8gZG91YmxlLXRhbGsuIEp1c3Qgc3RhdGUgdGhlIGZhY3QuXG4gICAgICBicy50ZXh0Q29udGVudCA9IFwiXHUyNkEwIFx1NUMxQVx1NzEyMVx1NkI2NFx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInByZXNlbnRcIjoge1xuICAgICAgY29uc3QgY291bnQgPSBfYmFja2VuZFBhdGllbnQuY291bnQ7XG4gICAgICBjb25zdCB0cyA9IF9iYWNrZW5kUGF0aWVudC5sYXN0VXBkYXRlZDtcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWUgb2tcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gYFx1MjcxMyAke2NvdW50ID4gMCA/IGAke2NvdW50fSBcdTdCNDYgXHUwMEI3IGAgOiBcIlwifVx1NjcwMFx1NUY4Q1x1NjZGNFx1NjVCMCAke19mbXRUaW1lU2hvcnQodHMpIHx8IFwiKHVua25vd24pXCJ9YDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiZmFpbFwiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZSBmYWlsXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IFwiXHUyNzE3IFx1NkFBMlx1NjdFNVx1NTkzMVx1NjU1N1x1RkYwOFx1NzcwQlx1OTAyM1x1N0REQSBiYW5uZXJcdUZGMDlcIjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IFwiXHUyMDE0XCI7XG4gIH1cblxuICAvLyBMb2NhbCByb3cgXHUyMDE0IHNob3cgb25seSB3aGVuIHRoZSBwZW5kaW5nIGJ1bmRsZSBtYXRjaGVzIHRoaXMgcGF0aWVudC5cbiAgLy8gKGxvY2FsTWF0Y2hlcyB3YXMgY29tcHV0ZWQgYWJvdmUgZm9yIHRoZSBlYXJseS1yZXR1cm4gY2hlY2suKVxuICBpZiAobG9jYWxNYXRjaGVzKSB7XG4gICAgZWxzLmxvY2FsU3RhdGVSb3cuaGlkZGVuID0gZmFsc2U7XG4gICAgZWxzLmxvY2FsU3RhdGUuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZSBva1wiO1xuICAgIGVscy5sb2NhbFN0YXRlLnRleHRDb250ZW50ID1cbiAgICAgIGBcdTI3MTMgJHtfbG9jYWxCdW5kbGUuY291bnR9IFx1N0I0NiBcdTAwQjcgJHtfZm10UmVsYXRpdmUoX2xvY2FsQnVuZGxlLmdlbmVyYXRlZEF0KX1cdTc1MjJcdTc1MUZgO1xuICB9IGVsc2Uge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IHRydWU7XG4gIH1cblxuICAvLyBcIlx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlXCIgYnV0dG9uIHNob3dzIG9ubHkgd2hlbiB0aGVyZSdzIGEgbG9jYWwgYnVuZGxlXG4gIC8vIGZvciB0aGlzIHBhdGllbnQuIFdlIGRvbid0IHJlYWNoIHRoaXMgYnJhbmNoIHdoZW4gaW4tc3luYyAodGhlXG4gIC8vIHdob2xlIHNlY3Rpb24gZ2V0cyBoaWRkZW4gYWJvdmUpLCBzbyBubyBuZWVkIGZvciBhIHNlcGFyYXRlXG4gIC8vIGRpc2FibGVkIHN0YXRlIFx1MjAxNCB3aGVuIHRoZSBidXR0b24gc2hvd3MsIHVwbG9hZCBpcyBhbHdheXMgbWVhbmluZ2Z1bC5cbiAgZWxzLnB1c2hMb2NhbEJ0bi5oaWRkZW4gPSAhbG9jYWxNYXRjaGVzO1xuICBlbHMucHVzaExvY2FsQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gIGVscy5wdXNoTG9jYWxCdG4udGl0bGUgPSBcIlwiO1xuICBlbHMucHVzaExvY2FsQnRuLnRleHRDb250ZW50ID0gXCJcdTYyOEFcdTY3MkNcdTU3MzBcdTZBOTRcdTY4NDhcdTRFMEFcdTUwQjNcdTUyMzBcdTVGOENcdTdBRUZcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBfbG9jYWxCdW5kbGUgPSBwZW5kaW5nXG4gICAgPyB7XG4gICAgICAgIGV4aXN0czogdHJ1ZSxcbiAgICAgICAgY291bnQ6IEFycmF5LmlzQXJyYXkoSlNPTi5wYXJzZShwZW5kaW5nLmpzb24pPy5lbnRyeSlcbiAgICAgICAgICA/IEpTT04ucGFyc2UocGVuZGluZy5qc29uKS5lbnRyeS5sZW5ndGhcbiAgICAgICAgICA6IDAsXG4gICAgICAgIGdlbmVyYXRlZEF0OiBwZW5kaW5nLmdlbmVyYXRlZEF0IHx8IDAsXG4gICAgICAgIHBhdGllbnRJZDogcGVuZGluZy5wYXRpZW50SWQgfHwgbnVsbCxcbiAgICAgIH1cbiAgICA6IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGVja0JhY2tlbmRQYXRpZW50KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubyB8fCBfY29ublN0YXRlICE9PSBcIm9rXCIpIHtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiY2hlY2tpbmdcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcblxuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICBjb25zdCBrZXkgPSBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGhlYWRlcnMgPSBrZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjoga2V5IH0gOiB7fTtcbiAgLy8gQmFja2VuZCBzdG9yZXMgUGF0aWVudCB1bmRlciB0aGUgaGFzaGVkIEZISVIgaWQsIG5ldmVyIHVuZGVyIHRoZSByYXdcbiAgLy8gbmF0aW9uYWwgSUQgXHUyMDE0IHF1ZXJ5IC8gZXhwb3J0IGJ5IHRoZSBoYXNoZWQgZm9ybS5cbiAgY29uc3QgZmhpclBpZCA9IGRlcml2ZVBhdGllbnRJZChvdi5pZF9ubyk7XG4gIHRyeSB7XG4gICAgY29uc3QgcHIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvUGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLCB7IGhlYWRlcnMgfSk7XG4gICAgaWYgKHByLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImFic2VudFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFwci5vaykge1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJmYWlsXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwYXRpZW50ID0gYXdhaXQgcHIuanNvbigpO1xuICAgIGNvbnN0IGxhc3RVcGRhdGVkID0gcGF0aWVudD8ubWV0YT8ubGFzdFVwZGF0ZWQgPz8gbnVsbDtcbiAgICAvLyBDb3VudCB2aWEgL2ZoaXIvZXhwb3J0IFx1MjAxNCBzbGlnaHRseSBoZWF2aWVyIGJ1dCBpdCdzIHRoZSBvbmx5XG4gICAgLy8gb2ZmLXRoZS1zaGVsZiB3YXkgdG8gZ2V0IHRvdGFsIHJlc291cmNlcyBmb3IgYSBwYXRpZW50LiBDYXAgYnlcbiAgICAvLyA1cyB0aW1lb3V0IHNvIGEgc2xvdyBiYWNrZW5kIGRvZXNuJ3QgbG9jayB0aGUgcG9wdXAgZm9yZXZlci5cbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjdHJsID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gICAgICBjb25zdCBlciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLCB7XG4gICAgICAgIGhlYWRlcnMsIHNpZ25hbDogY3RybC5zaWduYWwsXG4gICAgICB9KTtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICBpZiAoZXIub2spIHtcbiAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgZXIuanNvbigpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShidW5kbGUuZW50cnkpKSBjb3VudCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIGxlYXZlIGNvdW50ID0gMDsgbm90IGZhdGFsICovIH1cbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInByZXNlbnRcIiwgY291bnQsIGxhc3RVcGRhdGVkIH07XG4gIH0gY2F0Y2ggKF9lKSB7XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJmYWlsXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICB9XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHVzaExvY2FsQnVuZGxlVG9CYWNrZW5kKCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoIW92Py5pZF9ubyB8fCAhX2xvY2FsQnVuZGxlLmV4aXN0cyB8fCBfbG9jYWxCdW5kbGUucGF0aWVudElkICE9PSBvdi5pZF9ubykgcmV0dXJuO1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICBjb25zdCBrZXkgPSBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgLi4uKGtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBrZXkgfSA6IHt9KSxcbiAgfTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIGVscy5wdXNoTG9jYWxCdG4udGV4dENvbnRlbnQgPSBcIlx1NEUwQVx1NTBCM1x1NEUyRFx1MjAyNlwiO1xuICB0cnkge1xuICAgIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgICBpZiAoIXBlbmRpbmc/Lmpzb24pIHRocm93IG5ldyBFcnJvcihcIm5vIGxvY2FsIGJ1bmRsZVwiKTtcbiAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7dXJsfS9maGlyL2ltcG9ydGAsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsIGhlYWRlcnMsIGJvZHk6IHBlbmRpbmcuanNvbixcbiAgICB9KTtcbiAgICBpZiAoIXIub2spIHtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByLnRleHQoKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Iuc3RhdHVzfTogJHt0ZXh0LnNsaWNlKDAsIDEyMCl9YCk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHIuanNvbigpO1xuICAgIHNldFN0YXR1cyhgXHUyNzA1IFx1NURGMlx1NEUwQVx1NTBCMyAke3Jlc3VsdC5pbXBvcnRlZCA/PyBcIj9cIn0gXHU3QjQ2XHU1MjMwXHU1RjhDXHU3QUVGYCwgXCJzdWNjZXNzXCIpO1xuICAgIGF3YWl0IGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNldFN0YXR1cyhgXHUyNkQ0IFx1NEUwQVx1NTBCM1x1NTkzMVx1NjU1N1x1RkYxQSR7ZS5tZXNzYWdlfWAsIFwiZXJyb3JcIik7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gX3JlbmRlckRhdGFTdGF0ZSgpIChhbHJlYWR5IGNhbGxlZCBmcm9tIGNoZWNrQmFja2VuZFBhdGllbnQgb25cbiAgICAvLyBzdWNjZXNzKSBkZWNpZGVzIHRoZSByaWdodCBkaXNhYmxlZCBzdGF0ZSArIGxhYmVsIGJhc2VkIG9uXG4gICAgLy8gd2hldGhlciBiYWNrZW5kIGFuZCBsb2NhbCBhZ3JlZS4gQ2FsbCBpdCBoZXJlIHRvbyB0byBjb3ZlciB0aGVcbiAgICAvLyBmYWlsdXJlIHBhdGggdGhhdCBza2lwcGVkIGNoZWNrQmFja2VuZFBhdGllbnQuXG4gICAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICB9XG59XG5cbmVscy5wdXNoTG9jYWxCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdXNoTG9jYWxCdW5kbGVUb0JhY2tlbmQpO1xuXG4vLyBUaGUgYmxvY2tlZC1yZWFzb24gd2FybmluZyBzdHJpcCBkb3VibGVzIGFzIGEgXCJqdW1wIGJhY2sgdG8gdGhlXG4vLyByZWxldmFudCBzdGVwXCIgYnV0dG9uIHdoZW4gdGhlcmUncyBhIGtub3duIHRhcmdldCBzdGVwLiBDbGlja1xuLy8gYW55d2hlcmUgb24gaXQgdG8gbmF2aWdhdGU7IHRoZSB0cmFpbGluZyBcIlx1NTZERSBcdTI0NjAgXHU3NjdCXHU1MTY1IFx1MjE5MlwiIGhpbnRcbi8vIHRlbGVncmFwaHMgd2hlcmUgdGhlIGNsaWNrIHdpbGwgbGFuZC5cbmVscy5zeW5jQmxvY2tlZFJlYXNvbj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY29uc3QgdGFyZ2V0ID0gTnVtYmVyKGVscy5zeW5jQmxvY2tlZFJlYXNvbi5kYXRhc2V0LnRhcmdldFN0ZXApO1xuICBpZiAodGFyZ2V0ID49IDEgJiYgdGFyZ2V0IDw9IDMpIF9zZXRBY3RpdmVTdGVwKHRhcmdldCk7XG59KTtcblxuLy8gXCJcdUQ4M0RcdUREMTcgXHU5NThCXHU1NTVGXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU3NjdCXHU1MTY1XCIgXHUyMDE0IG9wZW5zIHRoZSBOSEkgbGFuZGluZyBwYWdlIHNvIHRoZSB1c2VyXG4vLyBkb2Vzbid0IGhhdmUgdG8gcmVtZW1iZXIgLyBnb29nbGUgdGhlIFVSTC4gQ2xvc2VzIHRoZSBwb3B1cCBzb1xuLy8gdGhleSBkb24ndCBoYXZlIHRvIGRpc21pc3MgaXQgbWFudWFsbHkgYWZ0ZXIgdGhlIG5ldyB0YWIgb3BlbnMuXG5lbHMub3Blbk5oaUJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcbiAgYXdhaXQgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBOSElfTEFORElORyB9KTtcbiAgd2luZG93LmNsb3NlKCk7XG59KTtcblxuLy8gXCJcdTUyNERcdTVGODBcdTc2N0JcdTUxNjVcdTk4MDFcdTk3NjJcIiBpbnNpZGUgdGhlIG5lZWRzLWxvZ2luIGJhbm5lci4gQ292ZXJzIGJvdGg6XG4vLyAgIDEuIFNlc3Npb24gZXhwaXJlZCBzaWxlbnRseSB3aGlsZSBvbiBhIGxvZ2dlZC1pbiBwYWdlIChsb29rc1xuLy8gICAgICBcInN0aWxsIGxvZ2dlZCBpblwiIHRvIHRoZSB1c2VyIFx1MjE5MiB0aGV5J3JlIGNvbmZ1c2VkIHdoeSB3ZSBzYXlcbi8vICAgICAgb3RoZXJ3aXNlKS5cbi8vICAgMi4gVXNlciBpcyBvbiBhIHB1YmxpYyBzdWItcGFnZSBsaWtlIFx1NTU0Rlx1N0I1NFx1NUMwOFx1NTM0MCBcdTIwMTQgYSBwbGFpbiByZWxvYWRcbi8vICAgICAgd291bGQganVzdCByZS1yZW5kZXIgdGhlIHNhbWUgdW4tYXV0aCBwYWdlIHdpdGhvdXQgc3VyZmFjaW5nXG4vLyAgICAgIGEgbG9naW4gZm9ybS4gTmF2aWdhdGluZyBkaXJlY3RseSB0byB0aGUgbG9naW4gVVJMIGhhbmRsZXNcbi8vICAgICAgYm90aCBjYXNlcyBpZGVudGljYWxseS5cbi8vIERyaXZlcyBjaHJvbWUudGFicy51cGRhdGUgd2l0aCBhIHVybCBzbyB0aGUgZXhpc3RpbmcgTkhJIHRhYlxuLy8gZ29lcyBzdHJhaWdodCB0byB0aGUgbG9naW4gcGlja2VyOyBmb2N1c2VzICsgY2xvc2VzIHBvcHVwIHNvIHRoZVxuLy8gdXNlciBsYW5kcyBvbiB0aGUgcGFnZSB0aGV5IG5lZWQgdG8gYWN0IG9uLlxuZWxzLm5oaVJlbG9hZEJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcbiAgaWYgKCFfbmhpVGFiSWQpIHtcbiAgICAvLyBEZWZlbnNpdmU6IGJhbm5lciBzaG91bGRuJ3QgYmUgdmlzaWJsZSB3aGVuIG9mZi1OSEksIGJ1dCBpZlxuICAgIC8vIHNvbWV0aGluZyB3ZW50IHNpZGV3YXlzIGp1c3Qgb3BlbiB0aGUgbG9naW4gcGFnZSBpbiBhIG5ldyB0YWIuXG4gICAgYXdhaXQgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBOSElfTE9HSU5fVVJMIH0pO1xuICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIGF3YWl0IGNocm9tZS50YWJzLnVwZGF0ZShfbmhpVGFiSWQsIHsgdXJsOiBOSElfTE9HSU5fVVJMLCBhY3RpdmU6IHRydWUgfSk7XG4gIH0gY2F0Y2gge31cbiAgd2luZG93LmNsb3NlKCk7XG59KTtcblxuLy8gTG9jYWwgYnVuZGxlIHN0YXRlIGNoYW5nZXMgd2hlbmV2ZXIgdGhlIFNXIHN0YXNoZXMgYSBuZXcgc3luYy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIFBFTkRJTkdfQlVORExFX0tFWSBpbiBjaGFuZ2VzKSBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBtb2RlIGZlYXR1cmUgZ2F0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIExheXBlcnNvbiBkZWZhdWx0OiBiYWNrZW5kIG1vZGUgKERvY2tlciBzZXJ2ZXIgKyBEYXNoYm9hcmQgKyBTTUFSVFxuLy8gQXBwKSBpcyBoaWRkZW4gYmVoaW5kIGEgdG9nZ2xlIGluIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QS4gV2hlbiBPRkYgKGRlZmF1bHQpLCB0aGVcbi8vIG1vZGUtdG9nZ2xlIHJvdyBpbiBzdGVwIDMgZG9lc24ndCByZW5kZXIgYW5kIHN5bmNNb2RlIGlzIGZvcmNlZCB0b1xuLy8gXCJsb2NhbFwiIHJlZ2FyZGxlc3Mgb2Ygd2hhdCdzIGluIHN0b3JhZ2UuXG5hc3luYyBmdW5jdGlvbiBsb2FkQmFja2VuZE1vZGVFbmFibGVkKCkge1xuICBjb25zdCB7IGJhY2tlbmRNb2RlRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwiYmFja2VuZE1vZGVFbmFibGVkXCIpO1xuICBjb25zdCBlbmFibGVkID0gYmFja2VuZE1vZGVFbmFibGVkID09PSB0cnVlO1xuICBlbHMuYmFja2VuZE1vZGVFbmFibGVkLmNoZWNrZWQgPSBlbmFibGVkO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuYmFja2VuZEVuYWJsZWQgPSBlbmFibGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCI7XG59XG5cbmVscy5iYWNrZW5kTW9kZUVuYWJsZWQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBlbmFibGVkID0gZWxzLmJhY2tlbmRNb2RlRW5hYmxlZC5jaGVja2VkO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuYmFja2VuZEVuYWJsZWQgPSBlbmFibGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCI7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IGJhY2tlbmRNb2RlRW5hYmxlZDogZW5hYmxlZCB9KTtcbiAgaWYgKGVuYWJsZWQpIHtcbiAgICAvLyBBdXRvLXN3aXRjaCB0byBiYWNrZW5kIG1vZGUgc28gdGhlIHVzZXIgaW1tZWRpYXRlbHkgc2VlcyB0aGVcbiAgICAvLyBtb2RlIHRhYiArIHRoZSBiYWNrZW5kIGNvbmZpZyBmaWVsZHMgdGhleSBqdXN0IHVubG9ja2VkLiBCZWF0c1xuICAgIC8vIFwiSSBlbmFibGVkIGl0IGJ1dCBub3RoaW5nIGhhcHBlbmVkXCIuXG4gICAgZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHIuY2hlY2tlZCA9IHIudmFsdWUgPT09IFwiYmFja2VuZFwiO1xuICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5tb2RlID0gXCJiYWNrZW5kXCI7XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY01vZGU6IFwiYmFja2VuZFwiIH0pO1xuICAgIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICB9IGVsc2Uge1xuICAgIC8vIEZvcmNlIGJhY2sgdG8gbG9jYWw7IGNsZWFyIGFueSBsZWZ0b3ZlciBiYWNrZW5kIGNvbm5lY3Rpb24gc3RhdGVcbiAgICAvLyBzbyB0aGUgbmV4dCB0aW1lIHRoZXkgcmUtZW5hYmxlIGl0IGRvZXNuJ3Qgc2hvdyBzdGFsZSBcIlx1NURGMlx1OTAyM1x1N0REQVwiLlxuICAgIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSByLmNoZWNrZWQgPSByLnZhbHVlID09PSBcImxvY2FsXCI7XG4gICAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBcImxvY2FsXCI7XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY01vZGU6IFwibG9jYWxcIiB9KTtcbiAgICBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgfVxufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBTeW5jIG1vZGUgKGxvY2FsIHwgYmFja2VuZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5hc3luYyBmdW5jdGlvbiBsb2FkU3luY01vZGUoKSB7XG4gIGNvbnN0IHsgc3luY01vZGUgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInN5bmNNb2RlXCIpO1xuICAvLyBCYWNrZW5kIG1vZGUgZGlzYWJsZWQgaW4gXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBIFx1MjE5MiBpZ25vcmUgYW55IHN0b3JlZCBiYWNrZW5kIG1vZGUuXG4gIGNvbnN0IGJhY2tlbmRFbmFibGVkID0gZG9jdW1lbnQuYm9keS5kYXRhc2V0LmJhY2tlbmRFbmFibGVkID09PSBcInRydWVcIjtcbiAgY29uc3QgbW9kZSA9IChiYWNrZW5kRW5hYmxlZCAmJiBzeW5jTW9kZSA9PT0gXCJiYWNrZW5kXCIpID8gXCJiYWNrZW5kXCIgOiBERUZBVUxUX01PREU7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSByLmNoZWNrZWQgPSByLnZhbHVlID09PSBtb2RlO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gIGlmIChtb2RlID09PSBcImJhY2tlbmRcIikge1xuICAgIC8vIEF1dG8tdGVzdCBvbiBvcGVuIHNvIHRoZSB1c2VyIHNlZXMgc3RhdHVzIHdpdGhvdXQgY2xpY2tpbmcuIEF3YWl0aW5nXG4gICAgLy8gaGVyZSBzZXJpYWxpemVzIHRoZSByZXN0IG9mIGluaXQoKSB1bnRpbCB3ZSBrbm93IHRoZSBhbnN3ZXIuXG4gICAgYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3VycmVudE1vZGUoKSB7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSBpZiAoci5jaGVja2VkKSByZXR1cm4gci52YWx1ZTtcbiAgcmV0dXJuIERFRkFVTFRfTU9ERTtcbn1cblxuZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHtcbiAgci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RlID0gY3VycmVudE1vZGUoKTtcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY01vZGU6IG1vZGUgfSk7XG4gICAgaWYgKG1vZGUgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgICB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTsgLy8gdHJpZ2dlcnMgY2hlY2tCYWNrZW5kUGF0aWVudCBvbiBzdWNjZXNzXG4gICAgfSBlbHNlIHtcbiAgICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5lbHMuYmFja2VuZFVybC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgYmFja2VuZFVybDogZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpIH0pO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xufSk7XG5lbHMuc3luY0FwaUtleS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpIH0pO1xufSk7XG4vLyBNYXNrLXBhdGllbnQtbmFtZSB0b2dnbGUgXHUyMDE0IGRlZmF1bHRzIE9GRiAoY2l0aXplbnMgZG93bmxvYWRpbmcgdGhlaXJcbi8vIG93biBkYXRhIGRvbid0IG5lZWQgYW5vbnltaXphdGlvbikuIFdoZW4gT046IHBvcHVwIHN1bW1hcnksIEZISVJcbi8vIEJ1bmRsZSBvdXRwdXQsIHN5bmMtbG9nLCBhbmQgTkhJIHJlcG9ydCBuYXJyYXRpdmUgYWxsIHVzZSB0aGVcbi8vIG1hc2tlZCBmb3JtIChcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjApIGluc3RlYWQgb2YgdGhlIHJlYWwgbmFtZS5cbmxldCBfbWFza05hbWVFbmFibGVkID0gZmFsc2U7XG5hc3luYyBmdW5jdGlvbiBsb2FkTWFza05hbWVFbmFibGVkKCkge1xuICBjb25zdCB7IG1hc2tOYW1lRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwibWFza05hbWVFbmFibGVkXCIpO1xuICBfbWFza05hbWVFbmFibGVkID0gbWFza05hbWVFbmFibGVkID09PSB0cnVlO1xuICBpZiAoZWxzLm1hc2tOYW1lRW5hYmxlZCkgZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkID0gX21hc2tOYW1lRW5hYmxlZDtcbn1cblxuZnVuY3Rpb24gX21heWJlTWFzayhuYW1lKSB7XG4gIHJldHVybiBfbWFza05hbWVFbmFibGVkID8gbWFza05hbWUobmFtZSkgOiBuYW1lIHx8IFwiXCI7XG59XG5cbmVscy5tYXNrTmFtZUVuYWJsZWQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICBfbWFza05hbWVFbmFibGVkID0gZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBtYXNrTmFtZUVuYWJsZWQ6IF9tYXNrTmFtZUVuYWJsZWQgfSk7XG4gIC8vIFJlLXJlbmRlciBwb3B1cCBjaHJvbWUgKHN1bW1hcnkgbGluZSBpcyB0aGUgb25seSBzcG90IHRoYXQgcmVhZHNcbiAgLy8gX21heWJlTWFzayByZWFjdGl2ZWx5OyBldmVyeXdoZXJlIGVsc2Ugc2FtcGxlcyBpdCBqdXN0LWluLXRpbWUpLlxuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG59KTtcblxuZWxzLnNtYXJ0QXBwVXJsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAvLyBQZXJzaXN0IHRyaW1tZWQgdmFsdWUuIEVtcHR5IHN0cmluZyBcdTIxOTIgcmVzdG9yZSBkZWZhdWx0IG9uIG5leHQgbG9hZC5cbiAgY29uc3QgdiA9IGVscy5zbWFydEFwcFVybC52YWx1ZS50cmltKCk7XG4gIGlmICh2KSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc21hcnRBcHBMYXVuY2hVcmw6IHYgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwic21hcnRBcHBMYXVuY2hVcmxcIik7XG4gICAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICB9XG59KTtcblxuZnVuY3Rpb24gc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93biwgZXJyb3JzKSB7XG4gIC8vIEJ1aWxkIHdpdGggRE9NIEFQSSBcdTIwMTQgYXZvaWRzIGlubmVySFRNTCAvIFhTUyByaXNrLlxuICAvLyBicmVha2Rvd24gaXMgYW4gYXJyYXkgb2YgbWl4ZWQgZW50cmllczpcbiAgLy8gICAtIHBoYXNlIHRpbWluZ3MgcHJlZml4ZWQgd2l0aCBcIlx1MjNGMVwiICBcdTIxOTIgXHU5NjhFXHU2QkI1XHU4MDE3XHU2NjQyXG4gIC8vICAgLSBwZXItZW5kcG9pbnQgY291bnRzICAgICAgICAgICAgICAgIFx1MjE5MiBcdTU0MDQgZW5kcG9pbnQgXHU2MjkzXHU1MjMwXHU1RTdFXHU3QjQ2XG4gIC8vIGVycm9ycyAob3B0aW9uYWwpIGlzIHRoZSByYXcgYCR7ZXB9OiAke21zZ31gIHN0cmluZ3MgZnJvbSB0aGUgU1csXG4gIC8vIHN1cmZhY2VkIHVuZGVyIGEgXCJcdTU5MzFcdTY1NTdcdTY2MEVcdTdEMzBcIiBzdWItc2VjdGlvbiBzbyB0aGUgdXNlciBjYW4gc2VlIHdoYXRcbiAgLy8gdGhlIFwiTiBcdTk4MDVcdTU5MzFcdTY1NTdcIiBzdW1tYXJ5IGFjdHVhbGx5IHBvaW50cyBhdCAobm8gbG9uZ2VyIERldlRvb2xzLW9ubHkpLlxuICAvLyBCb3RoIGdyb3VwcyBhcmUgdHVja2VkIGluc2lkZSBhIHNpbmdsZSBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiIHRvZ2dsZSBzbyB0aGVcbiAgLy8gcG9wdXAgc3RheXMgY29tcGFjdCBieSBkZWZhdWx0LlxuICBlbHMuc3RhdHVzLmNsYXNzTmFtZSA9IGtpbmQgfHwgXCJcIjtcbiAgZWxzLnN0YXR1cy50ZXh0Q29udGVudCA9IFwiXCI7XG4gIGNvbnN0IGhhc0Vycm9ycyA9IEFycmF5LmlzQXJyYXkoZXJyb3JzKSAmJiBlcnJvcnMubGVuZ3RoID4gMDtcbiAgaWYgKCF0ZXh0ICYmICEoYnJlYWtkb3duICYmIGJyZWFrZG93bi5sZW5ndGgpICYmICFoYXNFcnJvcnMpIHJldHVybjtcbiAgZWxzLnN0YXR1cy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0IHx8IFwiXCIpKTtcbiAgaWYgKChicmVha2Rvd24gJiYgYnJlYWtkb3duLmxlbmd0aCkgfHwgaGFzRXJyb3JzKSB7XG4gICAgY29uc3QgYmQgPSBicmVha2Rvd24gfHwgW107XG4gICAgY29uc3QgcGhhc2VSb3dzID0gYmQuZmlsdGVyKChiKSA9PiBiLnN0YXJ0c1dpdGgoXCJcdTIzRjFcIikpO1xuICAgIGNvbnN0IG90aGVyUm93cyA9IGJkLmZpbHRlcigoYikgPT4gIWIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgZGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWxcIjtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgc3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCI7XG4gICAgZGV0YWlscy5hcHBlbmRDaGlsZChzdW1tYXJ5KTtcblxuICAgIGlmIChvdGhlclJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGJvZHkuY2xhc3NOYW1lID0gXCJzdGF0dXMtYnJlYWtkb3duXCI7XG4gICAgICAvLyBPbmUgaXRlbSBwZXIgbGluZSBzbyBcIlx1NUMzMVx1OTFBQiAxMiBcdTdCNDYgLyBcdTg2NTVcdTY1QjkgODggXHU3QjQ2IC8gXHU2QUEyXHU5QTU3IDQxMiBcdTdCNDZcIlxuICAgICAgLy8gaXMgcmVhZGFibGU7IHRoZSAzNjBweCBwb3B1cCB3b3VsZCBoYXZlIHdyYXBwZWQgYSBmbGF0XG4gICAgICAvLyBzZXBhcmF0b3Itam9pbmVkIHN0cmluZyBpbnRvIGEgdGFuZ2xlZCBtZXNzLlxuICAgICAgZm9yIChjb25zdCByb3cgb2Ygb3RoZXJSb3dzKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsaW5lLnRleHRDb250ZW50ID0gcm93O1xuICAgICAgICBib2R5LmFwcGVuZENoaWxkKGxpbmUpO1xuICAgICAgfVxuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZChib2R5KTtcbiAgICB9XG4gICAgaWYgKGhhc0Vycm9ycykge1xuICAgICAgLy8gRmFpbHVyZS1kZXRhaWwgbmVzdGVkIHNlY3Rpb24uIFBlci1lcnJvciByYXcgbWVzc2FnZXMgYXJlXG4gICAgICAvLyBkZXYtaXNoIChlLmcuIFwiaW1hZ2luZyBkZXRhaWw6IEhUVFAgNTA0XCIpIGJ1dCBzdXJmYWNpbmcgdGhlbVxuICAgICAgLy8gYmVhdHMgdGhlIHByZXZpb3VzIFwiTiBcdTk4MDVcdTU5MzFcdTY1NTcgXHUyMDE0IERldlRvb2xzIHRvIHJlYWRcIiBVWC4gRm9sZGVkXG4gICAgICAvLyBieSBkZWZhdWx0IHNvIHRoZSBzdWNjZXNzIHN1bW1hcnkgc3RheXMgdGhlIGRvbWluYW50IHNpZ25hbFxuICAgICAgLy8gd2hlbiBzb21ldGhpbmcgZGlkIHN0aWxsIGdldCB0aHJvdWdoLlxuICAgICAgY29uc3QgZXJyRGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkZXRhaWxzXCIpO1xuICAgICAgZXJyRGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWwgc3RhdHVzLWVycm9yc1wiO1xuICAgICAgY29uc3QgZXJyU3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xuICAgICAgZXJyU3VtbWFyeS50ZXh0Q29udGVudCA9IGBcdTU5MzFcdTY1NTdcdTY2MEVcdTdEMzBcdUZGMDgke2Vycm9ycy5sZW5ndGh9XHVGRjA5YDtcbiAgICAgIGVyckRldGFpbHMuYXBwZW5kQ2hpbGQoZXJyU3VtbWFyeSk7XG4gICAgICBjb25zdCBlcnJCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGVyckJvZHkuY2xhc3NOYW1lID0gXCJzdGF0dXMtZXJyb3ItbGlzdFwiO1xuICAgICAgZm9yIChjb25zdCBlIG9mIGVycm9ycykge1xuICAgICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGluZS50ZXh0Q29udGVudCA9IGBcdTIwMjIgJHtlfWA7XG4gICAgICAgIGVyckJvZHkuYXBwZW5kQ2hpbGQobGluZSk7XG4gICAgICB9XG4gICAgICBlcnJEZXRhaWxzLmFwcGVuZENoaWxkKGVyckJvZHkpO1xuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZChlcnJEZXRhaWxzKTtcbiAgICB9XG4gICAgaWYgKHBoYXNlUm93cy5sZW5ndGgpIHtcbiAgICAgIC8vIFBoYXNlIHRpbWluZ3MgYXJlIGRldiBpbmZvIFx1MjAxNCB0dWNrIHRoZW0gaW5zaWRlIGEgc2Vjb25kIHRvZ2dsZVxuICAgICAgLy8gc28gZW5kIHVzZXJzIGRvbid0IHNlZSBcIm5oaS1wYXJhbGxlbD04c1wiIHJpZ2h0IGFmdGVyIGEgc3VjY2Vzc1xuICAgICAgLy8gYmFubmVyIGFuZCB0aGluayBzb21ldGhpbmcncyB3cm9uZy5cbiAgICAgIGNvbnN0IHRlY2hEZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgICB0ZWNoRGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWwgc3RhdHVzLXRlY2hcIjtcbiAgICAgIGNvbnN0IHRlY2hTdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgICB0ZWNoU3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2MjgwXHU4ODUzXHU3RDMwXHU3QkMwXCI7XG4gICAgICB0ZWNoRGV0YWlscy5hcHBlbmRDaGlsZCh0ZWNoU3VtbWFyeSk7XG4gICAgICBjb25zdCBwaGFzZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgcGhhc2VzLmNsYXNzTmFtZSA9IFwic3RhdHVzLXBoYXNlc1wiO1xuICAgICAgcGhhc2VzLnRleHRDb250ZW50ID0gcGhhc2VSb3dzLm1hcCgocCkgPT4gcC5yZXBsYWNlKC9eXHUyM0YxXFxzKi8sIFwiXCIpKS5qb2luKFwiIFx1MDBCNyBcIik7XG4gICAgICB0ZWNoRGV0YWlscy5hcHBlbmRDaGlsZChwaGFzZXMpO1xuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZCh0ZWNoRGV0YWlscyk7XG4gICAgfVxuICAgIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG4gIH1cbiAgLy8gU3RhdHVzIHZpc2liaWxpdHkgZHJpdmVzIHdoZXRoZXIgdGhlIHJlc3VsdCB6b25lIHNob3dzIGF0IGFsbC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFjdGl2ZVRhYigpIHtcbiAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KTtcbiAgcmV0dXJuIHRhYjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBlbmRpbmcgRkhJUiBCdW5kbGUgKGxvY2FsLW1vZGUgcmVzdWx0KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBCYWNrZ3JvdW5kIHN0YXNoZXMgdGhlIGdlbmVyYXRlZCBCdW5kbGUgaW50byBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gdW5kZXIgYHBlbmRpbmdGaGlyQnVuZGxlYC4gUG9wdXAgcmVuZGVycyBhIGRvd25sb2FkIGJ1dHRvbi4gVXNlciBtdXN0XG4vLyBjbGljayB0byBhY3R1YWxseSB0cmlnZ2VyIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgXHUyMDE0IHRoZSBmaWxlIG5ldmVyXG4vLyBoaXRzIHRoZSBkaXNrIHVuc29saWNpdGVkLlxuXG5mdW5jdGlvbiBfZm10Qnl0ZXMobikge1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDI0ICogMTAyNCkgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAoMTAyNCAqIDEwMjQpKS50b0ZpeGVkKDIpfSBNQmA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBpZiAoIXBlbmRpbmcgfHwgIXBlbmRpbmcuanNvbikge1xuICAgIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIElmIHRoZSB1c2VyIGhhcyBzd2l0Y2hlZCBvdmVycmlkZSB0byBhIGRpZmZlcmVudCBwYXRpZW50LCB0aGVcbiAgLy8gc3Rhc2hlZCBidW5kbGUgaXMgZm9yIHRoZSAqcHJldmlvdXMqIHBhdGllbnQuIEhpZGUgaXQgc28gdGhleVxuICAvLyBjYW4ndCBhY2NpZGVudGFsbHkgZG93bmxvYWQgdGhlIHdyb25nIGZpbGUuIFRoZSBidW5kbGUgc3RheXMgaW5cbiAgLy8gc3RvcmFnZTsgcmUtZW50ZXJpbmcgdGhlIG1hdGNoaW5nIG92ZXJyaWRlIHdpbGwgc3VyZmFjZSBpdCBhZ2Fpbi5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKG92Py5pZF9ubyAmJiBwZW5kaW5nLnBhdGllbnRJZCAmJiBwZW5kaW5nLnBhdGllbnRJZCAhPT0gb3YuaWRfbm8pIHtcbiAgICBlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xuICAgIHJldHVybjtcbiAgfVxuICBlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW4gPSBmYWxzZTtcbiAgLy8gRmlsZW5hbWUgKyBzaXplYWdlIGxpdmUgaW4gc2VwYXJhdGUgc2libGluZyBlbGVtZW50cyBpbiB0aGUgbmV3XG4gIC8vIHNpbmdsZS1wYW5lbCBsYXlvdXQgc28gd2UganVzdCB1cGRhdGUgZWFjaCBkaXJlY3RseS5cbiAgY29uc3QgYWdvID0gcGVuZGluZy5nZW5lcmF0ZWRBdCA/IF9mbXRSZWxhdGl2ZShwZW5kaW5nLmdlbmVyYXRlZEF0KSA6IFwiXCI7XG4gIGlmIChlbHMuYnVuZGxlRmlsZW5hbWUpIHtcbiAgICBlbHMuYnVuZGxlRmlsZW5hbWUudGV4dENvbnRlbnQgPSBwZW5kaW5nLmZpbGVuYW1lO1xuICAgIGVscy5idW5kbGVGaWxlbmFtZS50aXRsZSA9IHBlbmRpbmcuZmlsZW5hbWU7XG4gIH1cbiAgaWYgKGVscy5idW5kbGVTaXplYWdlKSB7XG4gICAgZWxzLmJ1bmRsZVNpemVhZ2UudGV4dENvbnRlbnQgPSBgJHtfZm10Qnl0ZXMocGVuZGluZy5ieXRlcyB8fCAwKX0ke2FnbyA/IGAgXHUwMEI3ICR7YWdvfWAgOiBcIlwifWA7XG4gIH1cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkUGVuZGluZ0J1bmRsZSgpIHtcbiAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgaWYgKCFwZW5kaW5nKSByZXR1cm47XG4gIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbcGVuZGluZy5qc29uXSwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2ZoaXIranNvblwiIH0pO1xuICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICB0cnkge1xuICAgIGF3YWl0IGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQoeyB1cmwsIGZpbGVuYW1lOiBwZW5kaW5nLmZpbGVuYW1lLCBzYXZlQXM6IGZhbHNlIH0pO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIFJlbGVhc2UgYWZ0ZXIgYSB0aWNrIHNvIHRoZSBkb3dubG9hZCBoYXMgdGltZSB0byBzdGFydC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgNTAwMCk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJQZW5kaW5nQnVuZGxlKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgYXdhaXQgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbiAgLy8gQ2xlYXJpbmcgdGhlIGRvd25sb2FkIGlzIHRoZSB1c2VyJ3MgXCJJJ20gZG9uZSB3aXRoIHRoaXMgcmVzdWx0XCJcbiAgLy8gZ2VzdHVyZSBcdTIwMTQgd2lwZSB0aGUgY29tcGxldGlvbiBzdGF0dXMgYmFubmVyIHRvbyBzbyB0aGUgcmVzdWx0IHpvbmVcbiAgLy8gY29sbGFwc2VzIGVudGlyZWx5IGluc3RlYWQgb2YgbGluZ2VyaW5nIHdpdGggYSBzdGFsZSBcIlx1MjcwNSBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTBcIlxuICAvLyBhbmQgbm8gZG93bmxvYWQgYnV0dG9uIG5leHQgdG8gaXQuXG4gIF9sYXRlc3RTdGF0dXMgPSBudWxsO1xuICBzZXRTdGF0dXMoXCJcIiwgbnVsbCk7XG4gIGF3YWl0IGNocm9tZS5ydW50aW1lXG4gICAgLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJjbGVhclN5bmNTdGF0dXNcIiB9KVxuICAgIC5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmVscy5kb3dubG9hZEJ1bmRsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG93bmxvYWRQZW5kaW5nQnVuZGxlKTtcbmVscy5jbGVhckJ1bmRsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJQZW5kaW5nQnVuZGxlKTtcblxuLy8gTGl2ZSB1cGRhdGUgd2hlbiBiYWNrZ3JvdW5kIHN0YXNoZXMgYSBuZXcgYnVuZGxlIHdoaWxlIHBvcHVwIGlzIG9wZW4uXG4vLyAoTm90ZTogYW5vdGhlciBvbkNoYW5nZWQgbGlzdGVuZXIgZWFybGllciBpbiB0aGUgZmlsZSByZWZyZXNoZXMgdGhlXG4vLyBkYXRhLXN0YXRlIGNhcmQ7IHdlIGxlYXZlIHRoYXQgb25lIHNlcGFyYXRlIHNvIGZhaWx1cmUgb2YgZWl0aGVyIHBhdGhcbi8vIGRvZXNuJ3QgdGFrZSB0aGUgb3RoZXIgZG93bi4pXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBQRU5ESU5HX0JVTkRMRV9LRVkgaW4gY2hhbmdlcykgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbn0pO1xuXG4vLyBCYWNrZ3JvdW5kLXNpZGUgZmxvdyBjYW4gbXV0YXRlIHRoZSBwYXRpZW50T3ZlcnJpZGUgbWlkLXN5bmMgXHUyMDE0IG1vc3Rcbi8vIGltcG9ydGFudGx5IF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaSBzd2FwcyB0aGUgYXV0by1YWFhYWFhYWFxuLy8gcGxhY2Vob2xkZXIgZm9yIHRoZSByZWFsIE5ISSBjaWQuIFdpdGhvdXQgdGhpcyBsaXN0ZW5lciB0aGUgcG9wdXBcbi8vIGlucHV0cyBzdGF5ZWQgc3RhbGUsIHJlZnJlc2hQZW5kaW5nQnVuZGxlJ3MgcGF0aWVudC1tYXRjaCBjaGVja1xuLy8gdGhlbiBjb21wYXJlZCBvbGQgaW5wdXQgdmFsdWUgdnMuIGZyZXNoIGJ1bmRsZS5wYXRpZW50SWQgYW5kIGhpZFxuLy8gdGhlIGRvd25sb2FkIGJ1dHRvbi4gUmVsb2FkIHRoZSBvdmVycmlkZSBpbnRvIHRoZSBpbnB1dHMgd2hlbmV2ZXJcbi8vIHN0b3JhZ2UgY2hhbmdlcyBzbyBldmVyeSBkb3duc3RyZWFtIGd1YXJkIHNlZXMgY29uc2lzdGVudCB2YWx1ZXMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBjaGFuZ2VzLnBhdGllbnRPdmVycmlkZSkgbG9hZFBhdGllbnRPdmVycmlkZSgpO1xufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBcdTI0RDggSGVscC1pY29uIHRvb2x0aXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gT25lIHNoYXJlZCA8ZGl2PiBhcHBlbmRlZCB0byB0aGUgcG9wdXAgYm9keS4gT24gaG92ZXIgb2YgYW55XG4vLyAuaGVscC1pY29uLCB3ZSBjb3B5IGl0cyBkYXRhLXRpcCB0ZXh0IGFuZCBwb3NpdGlvbiB0aGUgdG9vbHRpcFxuLy8gaW5zaWRlIHRoZSBwb3B1cCwgY2xhbXBpbmcgdG8gaXRzIHZpZXdwb3J0IHNvIGl0IGNhbid0IGNsaXAgb2ZmXG4vLyBlaXRoZXIgZWRnZSByZWdhcmRsZXNzIG9mIHdoZXJlIHRoZSBpY29uIHNpdHMuIChDU1MgcHNldWRvLWVsZW1lbnRzXG4vLyBjYW4ndCBiZSBtZWFzdXJlZCwgc28gYSBwdXJlLUNTUyBhcHByb2FjaCBpbmV2aXRhYmx5IHBpY2tzIG9uZVxuLy8gYW5jaG9yIHNpZGUgYW5kIGJyZWFrcyBmb3IgaWNvbnMgb24gdGhlIG90aGVyIHNpZGUgb2YgdGhlIHBvcHVwLilcbmNvbnN0IF9oZWxwVGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbl9oZWxwVGlwLmNsYXNzTmFtZSA9IFwiaGVscC10b29sdGlwXCI7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9oZWxwVGlwKTtcblxuY29uc3QgVklFV1BPUlRfTUFSR0lOID0gNjsgLy8ga2VlcCB0aGlzIG1hbnkgcHggY2xlYXIgb2YgcG9wdXAgZWRnZXNcblxuZnVuY3Rpb24gX3Nob3dIZWxwVG9vbHRpcChpY29uKSB7XG4gIF9oZWxwVGlwLnRleHRDb250ZW50ID0gaWNvbi5kYXRhc2V0LnRpcCB8fCBpY29uLmdldEF0dHJpYnV0ZShcImRhdGEtdGlwXCIpIHx8IFwiXCI7XG4gIF9oZWxwVGlwLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpO1xuXG4gIC8vIE1lYXN1cmUgbm93IHRoYXQgY29udGVudCBpcyBzZXQuXG4gIGNvbnN0IGljb25SZWN0ID0gaWNvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgdGlwUmVjdCA9IF9oZWxwVGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB2aWV3cG9ydFcgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIGNvbnN0IHZpZXdwb3J0SCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cbiAgLy8gSG9yaXpvbnRhbDogcHJlZmVyIGNlbnRlcmVkIG9uIHRoZSBpY29uOyBjbGFtcCBpbnRvIFttYXJnaW4sIHZ3LXRpcC1tYXJnaW5dLlxuICBsZXQgbGVmdCA9IGljb25SZWN0LmxlZnQgKyBpY29uUmVjdC53aWR0aCAvIDIgLSB0aXBSZWN0LndpZHRoIC8gMjtcbiAgaWYgKGxlZnQgPCBWSUVXUE9SVF9NQVJHSU4pIGxlZnQgPSBWSUVXUE9SVF9NQVJHSU47XG4gIGlmIChsZWZ0ICsgdGlwUmVjdC53aWR0aCA+IHZpZXdwb3J0VyAtIFZJRVdQT1JUX01BUkdJTikge1xuICAgIGxlZnQgPSB2aWV3cG9ydFcgLSBWSUVXUE9SVF9NQVJHSU4gLSB0aXBSZWN0LndpZHRoO1xuICB9XG4gIC8vIFZlcnRpY2FsOiBwcmVmZXIgYWJvdmUgdGhlIGljb247IGZsaXAgYmVsb3cgaWYgdGhlcmUncyBubyByb29tIHVwIHRvcC5cbiAgbGV0IHRvcCA9IGljb25SZWN0LnRvcCAtIHRpcFJlY3QuaGVpZ2h0IC0gNjtcbiAgaWYgKHRvcCA8IFZJRVdQT1JUX01BUkdJTikgdG9wID0gaWNvblJlY3QuYm90dG9tICsgNjtcbiAgLy8gRmluYWwgc2FmZXR5OiBjbGFtcCBpbnRvIHZpZXdwb3J0IHNvIHZlcnkgbG9uZyB0b29sdGlwcyBjYW4ndCBibGVlZFxuICAvLyBvZmYgdGhlIGJvdHRvbSBlaXRoZXIuXG4gIGlmICh0b3AgKyB0aXBSZWN0LmhlaWdodCA+IHZpZXdwb3J0SCAtIFZJRVdQT1JUX01BUkdJTikge1xuICAgIHRvcCA9IE1hdGgubWF4KFZJRVdQT1JUX01BUkdJTiwgdmlld3BvcnRIIC0gVklFV1BPUlRfTUFSR0lOIC0gdGlwUmVjdC5oZWlnaHQpO1xuICB9XG5cbiAgX2hlbHBUaXAuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICBfaGVscFRpcC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xufVxuXG5mdW5jdGlvbiBfaGlkZUhlbHBUb29sdGlwKCkge1xuICBfaGVscFRpcC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbn1cblxuLy8gRGVsZWdhdGVkIGhvdmVyIGhhbmRsZXJzIFx1MjAxNCB3b3JrcyBmb3IgaWNvbnMgYWRkZWQgYWZ0ZXIgcG9wdXAgbG9hZCB0b29cbi8vIChlLmcuIHdoZW4gbW9kZSB0b2dnbGUgcmV2ZWFscyBiYWNrZW5kLW9ubHkgZmllbGRzKS5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+IHtcbiAgY29uc3QgaWNvbiA9IGUudGFyZ2V0LmNsb3Nlc3Q/LihcIi5oZWxwLWljb25cIik7XG4gIGlmIChpY29uKSBfc2hvd0hlbHBUb29sdGlwKGljb24pO1xufSk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKGUpID0+IHtcbiAgY29uc3QgaWNvbiA9IGUudGFyZ2V0LmNsb3Nlc3Q/LihcIi5oZWxwLWljb25cIik7XG4gIGlmIChpY29uKSBfaGlkZUhlbHBUb29sdGlwKCk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2ZXJzaW9uXCIpLnRleHRDb250ZW50ID1cbiAgICBcInZcIiArIGNocm9tZS5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbjtcblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luLW9rLW5leHRcIilcbiAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBfc2V0QWN0aXZlU3RlcCgyKSk7XG5cbiAgYXdhaXQgbG9hZE1hc2tOYW1lRW5hYmxlZCgpO1xuXG4gIC8vIFNlZWQgbG9jYWwgYnVuZGxlIHN0YXRlIGZyb20gc3RvcmFnZSBzbyB0aGUgZGF0YS1zdGF0ZSBjYXJkIGlzXG4gIC8vIHBvcHVsYXRlZCBhcyBzb29uIGFzIHRoZSBwb3B1cCByZW5kZXJzIChubyBmbGFzaCBvZiBcIlx1NjcyQVx1NzUyMlx1NzUxRlwiKS5cbiAgYXdhaXQgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG5cbiAgLy8gT3JkZXIgbWF0dGVyczogbG9hZEJhY2tlbmRVcmwgcG9wdWxhdGVzIGVscy5iYWNrZW5kVXJsLnZhbHVlLCB3aGljaFxuICAvLyBsb2FkU3luY01vZGUoKSByZWFkcyB2aWEgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCkuIFJldmVyc2UgdGhpcyBhbmRcbiAgLy8gdGhlIGF1dG8tdGVzdCBzZWVzIGFuIGVtcHR5IFVSTCBhbmQgZmFsc2VseSByZXBvcnRzIFwiXHU2NzJBXHU4QTJEXHU1QjlBIEJhY2tlbmQgVVJMXCJcbiAgLy8gb24gZXZlcnkgcG9wdXAgb3Blbi4gbG9hZEJhY2tlbmRNb2RlRW5hYmxlZCBhbHNvIGhhcyB0byBsYW5kIGJlZm9yZVxuICAvLyBsb2FkU3luY01vZGU6IHRoZSBsYXR0ZXIgY29uc3VsdHMgYm9keVtkYXRhLWJhY2tlbmQtZW5hYmxlZF0gdG9cbiAgLy8gZGVjaWRlIHdoZXRoZXIgYSBzdG9yZWQgXCJiYWNrZW5kXCIgbW9kZSBpcyBob25vcmVkIG9yIGZvcmNlZCB0byBsb2NhbC5cbiAgYXdhaXQgbG9hZEJhY2tlbmRNb2RlRW5hYmxlZCgpO1xuICBhd2FpdCBsb2FkQmFja2VuZFVybCgpO1xuICBhd2FpdCBsb2FkU3luY01vZGUoKTtcbiAgYXdhaXQgbG9hZFBhdGllbnRPdmVycmlkZSgpO1xuICBhd2FpdCByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuXG4gIGNvbnN0IHRhYiA9IGF3YWl0IGdldEFjdGl2ZVRhYigpO1xuICBpZiAoIXRhYj8udXJsKSB7XG4gICAgc2V0U3RhdHVzKFwibm8gYWN0aXZlIHRhYlwiLCBcImVycm9yXCIpO1xuICAgIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpID0gXCIxXCI7XG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBTeW5jIHJlcXVpcmVzIGJlaW5nIG9uIGFuIE5ISSB0YWIgc28gY29va2llcy9zZXNzaW9uIGFyZSB1c2FibGUgZnJvbVxuICAvLyB0aGUgU1cuIEZsYWcgdmlhIGRhdGFzZXQgc28gX3JlZnJlc2hCdXR0b25TdGF0ZXMgY2FuIGNvbWJpbmUgdGhpc1xuICAvLyB3aXRoIHRoZSBtb2RlICsgY29ubiBzdGF0ZS4gV2hlbiBvZmYtTkhJLCBhbHNvIHN1cmZhY2UgdGhlXG4gIC8vIFwiXHVEODNEXHVERDE3IFx1OTU4Qlx1NTU1Rlx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NzY3Qlx1NTE2NVwiIGJhbm5lciBzbyB1c2VycyBkb24ndCB3b25kZXIgd2hlcmUgdG8gZ28uXG4gIGNvbnN0IG9uTmhpID0gaXNOaGlUYWIodGFiLnVybCk7XG4gIGlmIChvbk5oaSkgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBlbHNlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpID0gXCIxXCI7XG4gIGlmIChlbHMub3Blbk5oaVNlY3Rpb24pIGVscy5vcGVuTmhpU2VjdGlvbi5oaWRkZW4gPSBvbk5oaTtcbiAgLy8gU3Rhc2ggdGhlIE5ISSB0YWIgaWQgc28gdGhlIFwiXHU5MUNEXHU2NUIwXHU2NTc0XHU3NDA2XHU5ODAxXHU5NzYyXCIgYnV0dG9uIGluc2lkZSB0aGVcbiAgLy8gbmVlZHMtbG9naW4gYmFubmVyIGNhbiByZWxvYWQgaXQgd2l0aG91dCBoYXZpbmcgdG8gcmUtcXVlcnkgdGFicy5cbiAgX25oaVRhYklkID0gb25OaGkgPyB0YWIuaWQgOiBudWxsO1xuXG4gIC8vIFdoZW4gb24gdGhlIE5ISSB0YWIsIGFzayBiYWNrZ3JvdW5kIHRvIHZlcmlmeSB0aGVyZSdzIGFuIGFjdGl2ZVxuICAvLyBzZXNzaW9uLiBUaGUgU1cgcHJvYmVzIElIS0UzNDEwIHdpdGggc2Vzc2lvblN0b3JhZ2UudG9rZW4gXHUyMDE0IGNoZWFwXG4gIC8vIGFuZCBvbmx5IHN1Y2NlZWRzIHdoZW4gdGhlIHVzZXIgaGFzIGxvZ2dlZCBpbi4gQW55dGhpbmcgYnV0IGB0cnVlYFxuICAvLyAoZmFsc2UsIG51bGwsIG9yIG5vIHJlc3BvbnNlKSBtYWtlcyB1cyBhc3N1bWUgXCJub3QgbG9nZ2VkIGluXCIgc29cbiAgLy8gdGhlIHVzZXIgc2VlcyB0aGUgYWN0aW9uYWJsZSBiYW5uZXIgaW5zdGVhZCBvZiBtYXNoaW5nIHRoZSBDVEFcbiAgLy8gaW50byBhIGRlbGF5ZWQgXCJcdUQ4M0RcdUREMTIgXHU1QzFBXHU2NzJBXHU3NjdCXHU1MTY1XCIgc3RhdHVzLlxuICBpZiAob25OaGkgJiYgdGFiLmlkKSB7XG4gICAgY2hyb21lLnJ1bnRpbWVcbiAgICAgIC5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiY2hlY2tOaGlMb2dpblwiLCB0YWJJZDogdGFiLmlkIH0pXG4gICAgICAudGhlbigocmVzcCkgPT4ge1xuICAgICAgICBjb25zdCBsb2dnZWRJbiA9IHJlc3A/LmxvZ2dlZEluID09PSB0cnVlO1xuICAgICAgICBpZiAobG9nZ2VkSW4pIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluO1xuICAgICAgICBlbHNlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW4gPSBcIm5vXCI7XG4gICAgICAgIGlmIChlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24pIHtcbiAgICAgICAgICBlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24uaGlkZGVuID0gbG9nZ2VkSW47XG4gICAgICAgIH1cbiAgICAgICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgICAgLy8gTG9naW4gcHJvYmUgY29tcGxldGluZyBwb3NpdGl2ZWx5IGlzIHRoZSBzdGVwLTEgaW50ZW50aW9uYWxcbiAgICAgICAgLy8gY29tcGxldGlvbiBldmVudCBcdTIwMTQgYWR2YW5jZSB0aGUgd2l6YXJkIG9uY2UgaWYgdGhlIHVzZXIgaXNcbiAgICAgICAgLy8gY3VycmVudGx5IGxvb2tpbmcgYXQgc3RlcCAxLlxuICAgICAgICBpZiAobG9nZ2VkSW4gJiYgX3dpemFyZEluaXRpYWxpemVkKSBfbWF5YmVBdXRvQWR2YW5jZSgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIC8vIElmIHRoZSBwcm9iZSBmYWlscyAoU1cgdW5yZWFjaGFibGUsIGV0YyksIGRvbid0IHB1bmlzaCB0aGVcbiAgICAgICAgLy8gdXNlciBcdTIwMTQgbGVhdmUgdGhlIENUQSBlbmFibGVkIGFuZCBsZXQgdGhlIHN5bmMncyBvd24gc2Vzc2lvblxuICAgICAgICAvLyBjaGVjayBzdXJmYWNlIGEgcmVhbCBlcnJvciBpZiBuZWVkZWQuXG4gICAgICAgIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluO1xuICAgICAgICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKSBlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluO1xuICAgIGlmIChlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24pIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICB9XG5cbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcblxuICAvLyBTdGFydCB0aGUgd2l6YXJkIEFGVEVSIGFsbCBpbml0aWFsIHN0YXRlIGlzIGxvYWRlZCBcdTIwMTQgdGhpcyBwaWNrc1xuICAvLyB0aGUgY29ycmVjdCBzdGFydGluZyBzdGVwIChlLmcuIHJldHVybmluZyB1c2VyIHdpdGggdmFsaWQgc2Vzc2lvblxuICAvLyBsYW5kcyBvbiBzdGVwIDMgZGlyZWN0bHkpLlxuICBfaW5pdFdpemFyZCgpO1xuXG4gIC8vIFJlLWF0dGFjaCB0byBhbnkgc3luYyB0aGF0J3MgY3VycmVudGx5IHJ1bm5pbmcgaW4gdGhlIHNlcnZpY2Ugd29ya2VyLlxuICAvLyBUaGlzIGlzIHdoYXQgbGV0cyB0aGUgdXNlciBjbG9zZSArIHJlb3BlbiB0aGUgcG9wdXAgbWlkLXN5bmMuXG4gIGF3YWl0IHJlZnJlc2hTeW5jU3RhdHVzRnJvbUJhY2tncm91bmQoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFN5bmNTdGF0dXNGcm9tQmFja2dyb3VuZCgpIHtcbiAgY29uc3Qgc3RhdHVzID0gYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImdldFN5bmNTdGF0dXNcIiB9KS5jYXRjaCgoKSA9PiBudWxsKTtcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgYXBwbHlTeW5jU3RhdHVzKHN0YXR1cyk7XG59XG5cbi8vIExhdGVzdCBzdGF0dXMgc25hcHNob3QgXHUyMDE0IGtlZXBpbmcgaXQgbGV0cyB0aGUgbGl2ZS1lbGFwc2VkIHRpY2tlclxuLy8gcmVwYWludCB0aGUgc2FtZSBwcm9ncmVzcyB0ZXh0IHdpdGggYW4gdXBkYXRlZCBgW05zXWAgcHJlZml4IGV2ZXJ5XG4vLyBzZWNvbmQgd2l0aG91dCBzcGFtbWluZyBjaHJvbWUuc3RvcmFnZSBmcm9tIHRoZSBzZXJ2aWNlIHdvcmtlci5cbmxldCBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbmxldCBfZWxhcHNlZFRpY2tlcklkID0gbnVsbDtcblxuZnVuY3Rpb24gX2ZtdEVsYXBzZWQobXMpIHtcbiAgaWYgKG1zIDwgNjBfMDAwKSByZXR1cm4gYCR7TWF0aC5mbG9vcihtcyAvIDEwMDApfXNgO1xuICByZXR1cm4gYCR7TWF0aC5mbG9vcihtcyAvIDYwXzAwMCl9bSR7TWF0aC5yb3VuZCgobXMgJSA2MF8wMDApIC8gMTAwMCl9c2A7XG59XG5cbmZ1bmN0aW9uIF9yZW5kZXJTdGF0dXMoKSB7XG4gIGNvbnN0IHN0YXR1cyA9IF9sYXRlc3RTdGF0dXM7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIGxldCB0ZXh0ID0gc3RhdHVzLnByb2dyZXNzIHx8IFwiKHN5bmMgXHU5MDMyXHU4ODRDXHU0RTJEKVwiO1xuICBpZiAoc3RhdHVzLnJ1bm5pbmcgJiYgc3RhdHVzLnN0YXJ0ZWQpIHtcbiAgICBjb25zdCBlbGFwc2VkID0gRGF0ZS5ub3coKSAtIHN0YXR1cy5zdGFydGVkO1xuICAgIHRleHQgPSBgXHUyM0YxICR7X2ZtdEVsYXBzZWQoZWxhcHNlZCl9IFx1MDBCNyAke3RleHR9YDtcbiAgfVxuICBjb25zdCBraW5kID0gc3RhdHVzLnJ1bm5pbmcgPyBcImluZm9cIiA6IChzdGF0dXMucGhhc2UgPT09IFwiZXJyb3JcIiA/IFwiZXJyb3JcIiA6IFwic3VjY2Vzc1wiKTtcbiAgY29uc3QgYnJlYWtkb3duID0gc3RhdHVzLnJ1bm5pbmcgPyBudWxsIDogc3RhdHVzLmJyZWFrZG93bjtcbiAgY29uc3QgZXJyb3JzID0gc3RhdHVzLnJ1bm5pbmcgPyBudWxsIDogc3RhdHVzLmVycm9ycztcbiAgc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93biwgZXJyb3JzKTtcbn1cblxuZnVuY3Rpb24gYXBwbHlTeW5jU3RhdHVzKHN0YXR1cykge1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBfbGF0ZXN0U3RhdHVzID0gc3RhdHVzO1xuICBfcmVuZGVyU3RhdHVzKCk7XG4gIC8vIFN0YXR1cyBiYW5uZXIgbGl2ZXMgaW5zaWRlIHN0ZXAgMyBcdTIwMTQgZm9yY2UtanVtcCB0aGVyZSBzbyBpdCdzXG4gIC8vIGFjdHVhbGx5IHZpc2libGUuIFJ1bm5pbmcgc3luYyBPUiBhIGZyZXNoIGNvbXBsZXRpb24gYm90aCB3YXJyYW50XG4gIC8vIGJlaW5nIG9uIHRoZSByZXN1bHQgc3RlcC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCAmJiBfYWN0aXZlU3RlcCAhPT0gMykge1xuICAgIF9zZXRBY3RpdmVTdGVwKDMsIHsgc2lsZW50OiB0cnVlIH0pO1xuICB9XG4gIGlmIChzdGF0dXMucnVubmluZykge1xuICAgIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBlbHMuc3luY0FwaUJ0bi50ZXh0Q29udGVudCA9IFwiXHU1M0Q2XHU1Rjk3XHU0RTJEXHUyMDI2XCI7XG4gICAgZWxzLnN0b3BCdG4uaGlkZGVuID0gZmFsc2U7XG4gICAgaWYgKCFfZWxhcHNlZFRpY2tlcklkKSB7XG4gICAgICBfZWxhcHNlZFRpY2tlcklkID0gc2V0SW50ZXJ2YWwoX3JlbmRlclN0YXR1cywgMTAwMCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGVscy5zdG9wQnRuLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF9lbGFwc2VkVGlja2VySWQpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoX2VsYXBzZWRUaWNrZXJJZCk7XG4gICAgICBfZWxhcHNlZFRpY2tlcklkID0gbnVsbDtcbiAgICB9XG4gICAgLy8gUmUtZGVyaXZlIHN5bmMgYnV0dG9uIGVuYWJsZWQgc3RhdGUgZnJvbSBtb2RlL2Nvbm4vTkhJLXRhYiBpbnN0ZWFkXG4gICAgLy8gb2YgdW5jb25kaXRpb25hbGx5IGVuYWJsaW5nIFx1MjAxNCBrZWVwcyB0aGUgYnV0dG9uIGRpc2FibGVkIHdoZW4gd2VcbiAgICAvLyBrbm93IHdlIHNob3VsZG4ndCBzeW5jIChlLmcuIGJhY2tlbmQgZG93biwgb2ZmLU5ISSB0YWIpLlxuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgLy8gU3luYyBqdXN0IGZpbmlzaGVkIFx1MjAxNCBib3RoIHNpZGVzIG1heSBoYXZlIGNoYW5nZWQgKGJhY2tlbmQgZ290XG4gICAgLy8gbmV3IHJlc291cmNlcyBpbiBiYWNrZW5kIG1vZGUsIGxvY2FsIGJ1bmRsZSB3YXMgc3Rhc2hlZCBpbiBlaXRoZXJcbiAgICAvLyBtb2RlKS4gUmVmcmVzaCBkYXRhLXN0YXRlIGNhcmQgc28gdGhlIHVzZXIgc2VlcyB1cC10by1kYXRlIGNvdW50cy5cbiAgICBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcbiAgICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiYgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIH1cbn1cblxuLy8gU3RvcCB0aGUgaW4tcHJvZ3Jlc3Mgc3luYy4gVHdvLXByb25nZWQgc28gaXQgd29ya3MgZXZlbiB3aGVuIHRoZVxuLy8gc2VydmljZSB3b3JrZXIgaGFzIGRpZWQ6ICgxKSB0ZWxsIHRoZSBTVyB0byBzZXQgaXRzIGNhbmNlbCBmbGFnLFxuLy8gKDIpIHdyaXRlIHN0b3JhZ2UgZGlyZWN0bHkgdG8gcnVubmluZzpmYWxzZSBzbyB0aGUgcG9wdXAgVUkgdW5mcmVlemVzXG4vLyBpbW1lZGlhdGVseSBldmVuIGlmIHRoZSBTVyBtZXNzYWdlIGNhbid0IGJlIGRlbGl2ZXJlZC5cbmFzeW5jIGZ1bmN0aW9uIHN0b3BTeW5jKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgcHJvZ3Jlc3M6IFwiXHUyNkQ0IFx1NTA1Q1x1NkI2Mlx1NEUyRFx1RkYwQ1x1NkI2M1x1NTcyOFx1NkUwNVx1OTY2NFx1OTBFOFx1NTIwNlx1OENDN1x1NjU5OVx1MjAyNlwiLFxuICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICB0czogRGF0ZS5ub3coKSxcbiAgICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9KTtcbiAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NTA1Q1x1NkI2Mlx1NEUyRFx1RkYwQ1x1NkI2M1x1NTcyOFx1NkUwNVx1OTY2NFx1OTBFOFx1NTIwNlx1OENDN1x1NjU5OVx1MjAyNlwiLCBcImluZm9cIik7XG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzdG9wU3luY1wiIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgZWxzLnN0b3BCdG4uaGlkZGVuID0gdHJ1ZTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbn1cblxuLy8gTGl2ZSBwcm9ncmVzcyB1cGRhdGVzIFx1MjAxNCBsaXN0ZW4gb24gY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkIHNvIHdlIGdldFxuLy8gZXZlcnkgdXBkYXRlIHRoZSBTVyB3cml0ZXMsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgU1cncyBicm9hZGNhc3Rcbi8vIHNlbmRNZXNzYWdlIHJlYWNoZWQgdXMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBjaGFuZ2VzLnN5bmNTdGF0dXMpIHtcbiAgICBhcHBseVN5bmNTdGF0dXMoY2hhbmdlcy5zeW5jU3RhdHVzLm5ld1ZhbHVlKTtcbiAgfVxufSk7XG5cbi8vIChMZWdhY3kgaW4tbWVtb3J5IGJyb2FkY2FzdCBzdGlsbCBsaXN0ZW5lZCB0byBhcyBhIGJhY2t1cC4pXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZykgPT4ge1xuICBpZiAobXNnPy50eXBlID09PSBcInN5bmNQcm9ncmVzc1wiKSB7XG4gICAgYXBwbHlTeW5jU3RhdHVzKG1zZy5zdGF0dXMpO1xuICB9XG59KTtcblxuLy8gUHJlLWZsaWdodCBkZXRlY3Rpb24gZm9yIE5ISSBsb2dpbiBzdGF0ZS4gVHdvIHNpZ25hbHMgKGVpdGhlciB0cmlnZ2Vycyk6XG4vLyAgMS4gVVJMIGlzIGluIE5ISSBhdXRoIG5hbWVzcGFjZSAoSUhLRTMwOTlTeHgpIFx1MjAxNCBsb2dpbiAvIElDIGNhcmQgcGFnZXNcbi8vICAyLiBQYWdlIGNvbnRhaW5zIGEgcGFzc3dvcmQgaW5wdXQgb3Iga25vd24gbG9nZ2VkLW91dCBwaHJhc2VzXG5hc3luYyBmdW5jdGlvbiBpc09uTmhpTG9naW5QYWdlKHRhYklkLCB1cmwpIHtcbiAgaWYgKHVybD8ucGF0aG5hbWUgJiYgL0lIS0UzMDk5Ly50ZXN0KHVybC5wYXRobmFtZSkpIHJldHVybiB0cnVlO1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXScpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY29uc3QgdGV4dCA9IChkb2N1bWVudC5ib2R5Py5pbm5lclRleHQgfHwgXCJcIikudHJpbSgpO1xuICAgICAgICBjb25zdCBwaHJhc2VzID0gW1xuICAgICAgICAgIFwiXHU4QUNCXHU0RjdGXHU3NTI4XHU1MDY1XHU0RkREXHU1MzYxXCIsIFwiXHU4QUNCXHU2M0QyXHU1MTY1XHU1MDY1XHU0RkREXHU1MzYxXCIsIFwiXHU4QUNCXHU2M0QyXHU1MTY1XHU2MEE4XHU3Njg0XHU1MDY1XHU0RkREXHU1MzYxXCIsXG4gICAgICAgICAgXCJcdTc2N0JcdTUxNjVcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0FcIiwgXCJcdTc2N0JcdTUxNjVcdTU5MzFcdTY1NTdcIiwgXCJcdThBQ0JcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcIixcbiAgICAgICAgICBcIlNlc3Npb24gXHU1REYyXHU5MDNFXHU2NjQyXCIsIFwic2Vzc2lvbiBcdTVERjJcdTkwM0VcdTY2NDJcIiwgXCJcdTVERjJcdTkwM0VcdTY2NDJcIixcbiAgICAgICAgICBcIlx1OEFDQlx1NEVFNVx1NTA2NVx1NEZERFx1NTM2MVx1NzY3Qlx1NTE2NVwiLFxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gcGhyYXNlcy5zb21lKChwKSA9PiB0ZXh0LmluY2x1ZGVzKHApKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gXHUyNkExIE5ISSBBUEktZGlyZWN0IHN5bmMgXHUyMDE0IHByaW1hcnkgcGF0aC4gSGl0cyBOSEkncyB1bmRlcmx5aW5nIEpTT05cbi8vIGVuZHBvaW50cyBpbiBwYXJhbGxlbCBhbmQgcG9zdHMgYWRhcHRlZCBpdGVtcyB0byAvc3luYy91cGxvYWQtc3RydWN0dXJlZC5cbi8vIFJlcXVpcmVzIHBhdGllbnRfb3ZlcnJpZGUgdG8gYmUgZmlsbGVkLlxuLy8gQ29udmVydCBhIGJhY2tlbmQgVVJMIFx1MjE5MiB0aGUgb3JpZ2luLXBhdHRlcm4gQ2hyb21lIHdhbnRzIGZvciBwZXJtaXNzaW9uXG4vLyByZXF1ZXN0cy4gXCJodHRwOi8vMTkyLjE2OC4xLjU6ODAxMFwiIFx1MjE5MiBcImh0dHA6Ly8xOTIuMTY4LjEuNTo4MDEwLypcIi5cbi8vIFJldHVybnMgbnVsbCB3aGVuIHRoZSBVUkwgaXNuJ3QgcGFyc2VhYmxlIHNvIHRoZSBjYWxsZXIgY2FuIHNob3J0LWNpcmN1aXQuXG5mdW5jdGlvbiBfb3JpZ2luUGF0dGVybkZvcih1cmwpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gbmV3IFVSTCh1cmwpO1xuICAgIHJldHVybiBgJHt1LnByb3RvY29sfS8vJHt1Lmhvc3R9LypgO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBCYWNrZW5kLW1vZGUgcHJlLWZsaWdodDogZW5zdXJlIHRoZSBleHRlbnNpb24gaGFzIGhvc3QgcGVybWlzc2lvbiBmb3Jcbi8vIHRoZSB1c2VyLWNvbmZpZ3VyZWQgYmFja2VuZCBVUkwuIExvY2FsaG9zdCAvIDEyNy4wLjAuMSBhcmUgY292ZXJlZCBieVxuLy8gdGhlIGRlZmF1bHQgbWFuaWZlc3QgaG9zdF9wZXJtaXNzaW9uczsgcmVtb3RlIC8gTEFOIC8gcHJvZHVjdGlvbiBVUkxzXG4vLyBuZWVkIGEgb25lLXRpbWUgdXNlciBncmFudC4gTXVzdCBydW4gZnJvbSBhIHVzZXIgZ2VzdHVyZSAoYnV0dG9uIGNsaWNrKS5cbmFzeW5jIGZ1bmN0aW9uIGVuc3VyZUJhY2tlbmRQZXJtaXNzaW9uKGJhY2tlbmRVcmwpIHtcbiAgY29uc3QgcGF0dGVybiA9IF9vcmlnaW5QYXR0ZXJuRm9yKGJhY2tlbmRVcmwpO1xuICBpZiAoIXBhdHRlcm4pIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgQmFja2VuZCBVUkwgXHU3MTIxXHU2Q0Q1XHU4OUUzXHU2NzkwOiAke2JhY2tlbmRVcmx9YCB9O1xuICBjb25zdCBhbHJlYWR5ID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHsgb3JpZ2luczogW3BhdHRlcm5dIH0pO1xuICBpZiAoYWxyZWFkeSkgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgbGV0IGdyYW50ZWQ7XG4gIHRyeSB7XG4gICAgZ3JhbnRlZCA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5yZXF1ZXN0KHsgb3JpZ2luczogW3BhdHRlcm5dIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCByZWFzb246IGBcdTZCMEFcdTk2NTBcdThBQ0JcdTZDNDJcdTU5MzFcdTY1NTc6ICR7ZS5tZXNzYWdlfWAgfTtcbiAgfVxuICByZXR1cm4gZ3JhbnRlZFxuICAgID8geyBvazogdHJ1ZSB9XG4gICAgOiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgXHU2NzJBXHU2Mzg4XHU2QjBBXHU5MDIzXHU3RERBXHU1MjMwICR7cGF0dGVybn0gXHUyMDE0IFx1NTNENlx1NkQ4OGAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYXBpU3luY05oaSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdikge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTU2REUgXHUyNDYxIFx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVx1RkYxQVx1OEFDQlx1OTA3OFx1NjRDN1x1NjAyN1x1NTIyNVx1MzAwMVx1NTg2Qlx1NzUxRlx1NjVFNVx1NUY4Q1x1NjMwOVx1NzhCQVx1NUI5QVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFByZS1mbGlnaHQ6IGNoZWNrIHdlJ3JlIG9uIGFuIE5ISSB0YWIgc28gY29va2llcyBhcmUgdXNhYmxlIGZyb20gU1cuXG4gIGNvbnN0IHRhYiA9IGF3YWl0IGdldEFjdGl2ZVRhYigpO1xuICBsZXQgdXJsO1xuICB0cnkgeyB1cmwgPSBuZXcgVVJMKHRhYi51cmwpOyB9IGNhdGNoIHsgc2V0U3RhdHVzKFwiYWN0aXZlIHRhYiBoYXMgbm8gVVJMXCIsIFwiZXJyb3JcIik7IHJldHVybjsgfVxuICBjb25zdCBvbkxvZ2luID0gYXdhaXQgaXNPbk5oaUxvZ2luUGFnZSh0YWIuaWQsIHVybCk7XG4gIGlmIChvbkxvZ2luKSB7XG4gICAgc2V0U3RhdHVzKFwiXHVEODNEXHVERDEyIFx1NTZERSBcdTI0NjAgXHU3NjdCXHU1MTY1XHVGRjFBXHU1QzFBXHU2NzJBXHU3NjdCXHU1MTY1XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQmFja2VuZCBtb2RlOiByZS12ZXJpZnkgY29ubmVjdGl2aXR5IHJpZ2h0IGhlcmUgZXZlbiBpZiB0aGUgYmFubmVyXG4gIC8vIGxhc3Qgc2FpZCBvay4gQmV0d2VlbiB0aGUgcHJldmlvdXMgY2hlY2sgYW5kIHRoaXMgY2xpY2sgdGhlIHVzZXJcbiAgLy8gbWF5IGhhdmUgc3RvcHBlZCBkb2NrZXI7IHdpdGhvdXQgYSBmcmVzaCBwcm9iZSB3ZSdkIHN0YXJ0IGFuIHVwbG9hZFxuICAvLyB0aGF0IGZhaWxzIG1pZC1mbGlnaHQgYWZ0ZXIgcGFydGlhbCBkYXRhIGhhcyBoaXQgKG9yIGZhaWxlZCB0byBoaXQpXG4gIC8vIHRoZSBiYWNrZW5kLiBDaGVhcCAoXHUyMjY0NXMpIGFuZCBzYXZlcyBhIGxvdCBvZiBjb25mdXNpb24uXG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikge1xuICAgIGNvbnN0IG9rID0gYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gICAgaWYgKCFvaykge1xuICAgICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NUY4Q1x1N0FFRlx1OTAyM1x1N0REQVx1NTkzMVx1NjU1NyBcdTIwMTQgXHU4QUNCXHU3NzBCXHU5ODAyXHU5MEU4IGJhbm5lciBcdTc2ODRcdThBQUFcdTY2MEVcIiwgXCJlcnJvclwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBzeW5jU3RhdHVzOiB7XG4gICAgICBydW5uaW5nOiB0cnVlLFxuICAgICAgcHJvZ3Jlc3M6IFwiXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsXG4gICAgICBwaGFzZTogXCJzdGFydGluZ1wiLCBzdGFydGVkOiBEYXRlLm5vdygpLCB0czogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9KTtcbiAgc2V0U3RhdHVzKFwiXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcblxuICAvLyBDb21wdXRlIGRhdGUgcmFuZ2UgZnJvbSB0aGUgZHJvcGRvd24uIFwiMVwiID0gTkhJJ3MgZGVmYXVsdCB3aW5kb3c7XG4gIC8vIGFueXRoaW5nIGVsc2UgaXMgXCJ0b2RheSBiYWNrIE4geWVhcnNcIi4gSGVscGVyIGluc2lkZSBiYWNrZ3JvdW5kLmpzXG4gIC8vIGNvbnZlcnRzIHRvIFx1NkMxMVx1NTcwQiBmb3IgTkhJJ3MgQVBJLlxuICBjb25zdCByYW5nZVNlbCA9IGVscy5hcGlTeW5jUmFuZ2U/LnZhbHVlIHx8IFwiM1wiO1xuICBsZXQgZGF0ZVJhbmdlID0gbnVsbDtcbiAgY29uc3QgUkFOR0VfTEFCRUxTID0ge1xuICAgIFwiMVwiOiAgIFwiXHU2NzAwXHU4RkQxIDEgXHU1RTc0XCIsXG4gICAgXCIzXCI6ICAgXCJcdTY3MDBcdThGRDEgMyBcdTVFNzRcIixcbiAgICBcIjVcIjogICBcIlx1NjcwMFx1OEZEMSA1IFx1NUU3NFwiLFxuICAgIFwiMTBcIjogIFwiXHU2NzAwXHU4RkQxIDEwIFx1NUU3NFwiLFxuICAgIFwiYWxsXCI6IFwiXHU1MTY4XHU5MEU4XHU2Qjc3XHU1M0YyXHU3RDAwXHU5MzA0XCIsXG4gIH07XG4gIGNvbnN0IGRhdGVSYW5nZUxhYmVsID0gUkFOR0VfTEFCRUxTW3JhbmdlU2VsXSB8fCBgXHU2NzAwXHU4RkQxICR7cmFuZ2VTZWx9IFx1NUU3NGA7XG4gIGlmIChyYW5nZVNlbCAhPT0gXCIxXCIpIHtcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZW5kID0gdG9kYXkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgbGV0IHN0YXJ0O1xuICAgIGlmIChyYW5nZVNlbCA9PT0gXCJhbGxcIikge1xuICAgICAgc3RhcnQgPSBcIjIwMDEtMDEtMDFcIjsgIC8vIFx1NkMxMVx1NTcwQiA5MCBcdTIwMTQgZmFyIGVub3VnaCBiYWNrIGZvciBhbnkgY2xpbmljYWwgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB5ZWFycyA9IHBhcnNlSW50KHJhbmdlU2VsLCAxMCk7XG4gICAgICBjb25zdCBzID0gbmV3IERhdGUodG9kYXkpO1xuICAgICAgcy5zZXRGdWxsWWVhcihzLmdldEZ1bGxZZWFyKCkgLSB5ZWFycyk7XG4gICAgICBzdGFydCA9IHMudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICAgIGRhdGVSYW5nZSA9IHsgc3RhcnQsIGVuZCB9O1xuICB9XG5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIHR5cGU6IFwic3RhcnROaGlBcGlTeW5jXCIsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdGFiSWQ6IHRhYi5pZCxcbiAgICAgIG1vZGU6IGN1cnJlbnRNb2RlKCksXG4gICAgICBiYWNrZW5kOiBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCksXG4gICAgICBzeW5jQXBpS2V5OiBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCksXG4gICAgICBuaGlCYXNlOiBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHdcIixcbiAgICAgIHBhdGllbnRPdmVycmlkZTogb3YsXG4gICAgICBkYXRlUmFuZ2UsXG4gICAgICBkYXRlUmFuZ2VMYWJlbCxcbiAgICB9LFxuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxhdW5jaCgpIHtcbiAgY29uc3QgYmFja2VuZCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKTtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgcmF3SWQgPSBvdj8uaWRfbm87XG4gIGNvbnN0IHNtYXJ0QXBwTGF1bmNoID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKSB8fCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIGlmICghcmF3SWQpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTkwODRcdTZDOTJcdTY3MDlcdTc1QzVcdTRFQkFcdThFQUJcdTUyMDZcdThCNDkgXHUyMDE0IFx1OEFDQlx1NTE0OFx1NjMwOVx1MzAwQ1x1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MzAwRFx1NjI5M1x1NEUwMFx1NkIyMVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBCYWNrZW5kIHRyYWNrcyBQYXRpZW50IHVuZGVyIGl0cyBoYXNoZWQgRkhJUiBpZCwgbm90IHRoZSByYXcgbmF0aW9uYWwgSUQuXG4gIGNvbnN0IHBhdGllbnRJZCA9IGRlcml2ZVBhdGllbnRJZChyYXdJZCk7XG4gIC8vIFJlLXRlc3QgY29ubmVjdGlvbiBldmVuIGlmIGJhbm5lciBzaG93cyBvayBcdTIwMTQgYmFja2VuZCBtYXkgaGF2ZSBnb25lXG4gIC8vIGRvd24gc2luY2UgdGhlIGxhc3QgcHJvYmUuXG4gIGNvbnN0IG9rID0gYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIGlmICghb2spIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1RjhDXHU3QUVGXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3IFx1MjAxNCBcdThBQ0JcdTc3MEJcdTk4MDJcdTkwRTggYmFubmVyIFx1NzY4NFx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZXRTdGF0dXMoXCJcdTVFRkFcdTdBQ0IgbGF1bmNoIGNvbnRleHRcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3NtYXJ0L2xhdW5jaC1jb250ZXh0YCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGF0aWVudF9pZDogcGF0aWVudElkIH0pLFxuICAgIH0pO1xuICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYCR7cmVzLnN0YXR1c306ICR7YXdhaXQgcmVzLnRleHQoKX1gKTtcbiAgICBjb25zdCB7IGxhdW5jaCB9ID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHsgaXNzOiBgJHtiYWNrZW5kfS9maGlyYCwgbGF1bmNoIH0pO1xuICAgIC8vIEFwcGVuZCBpc3MgKyBsYXVuY2ggcGFyYW1zLCByZXNwZWN0aW5nIGFueSBleGlzdGluZyBxdWVyeSBzdHJpbmcuXG4gICAgY29uc3Qgc2VwID0gc21hcnRBcHBMYXVuY2guaW5jbHVkZXMoXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGAke3NtYXJ0QXBwTGF1bmNofSR7c2VwfSR7cGFyYW1zfWAgfSk7XG4gICAgd2luZG93LmNsb3NlKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1Mjc0QyBMYXVuY2ggXHU1OTMxXHU2NTU3XHVGRjFBJHtlLm1lc3NhZ2V9YCwgXCJlcnJvclwiKTtcbiAgfVxufVxuXG5lbHMuc3luY0FwaUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXBpU3luY05oaSk7XG5lbHMuc3RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RvcFN5bmMpO1xuZWxzLm92U2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2F2ZVBhdGllbnRPdmVycmlkZSk7XG5lbHMub3ZDbGVhckJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJQYXRpZW50T3ZlcnJpZGUpO1xuW2Vscy5vdk5hbWUsIGVscy5vdkJpcnRoRGF0ZSwgZWxzLm92R2VuZGVyXS5mb3JFYWNoKChlbCkgPT5cbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkpXG4pO1xuZWxzLmxhdW5jaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGF1bmNoKTtcblxuLy8gXCJcdTUzRDZcdTVGOTdcdTVDMERcdThDNjFcIiBiYW5uZXI6IGNsaWNrIC8gRW50ZXIgLyBTcGFjZSBqdW1wcyBiYWNrIHRvIHN0ZXAgMiBhbmRcbi8vIGV4cGFuZHMgdGhlIHBhdGllbnQgY2FyZCBzbyB0aGUgdXNlciBjYW4gYWRqdXN0IHRoZSBpZGVudGl0eS5cbmZ1bmN0aW9uIF9nb3RvU3RlcDJFZGl0KCkge1xuICBfc2V0QWN0aXZlU3RlcCgyKTtcbn1cbmVscy5hY3RpdmVQYXRpZW50Py5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2dvdG9TdGVwMkVkaXQpO1xuZWxzLmFjdGl2ZVBhdGllbnQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gIGlmIChlLmtleSA9PT0gXCJFbnRlclwiIHx8IGUua2V5ID09PSBcIiBcIikge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBfZ290b1N0ZXAyRWRpdCgpO1xuICB9XG59KTtcblxuaW5pdCgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFTQSxPQUFDLFdBQVc7QUFDVjtBQUVBLFlBQUksY0FBYztBQUNsQixZQUFJLGlCQUFpQjtBQUNyQixZ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SSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSTtBQUFBLFFBQzNEO0FBRUEsYUFBSyxVQUFVLFdBQVcsS0FBSyxVQUFVO0FBRXpDLGFBQUssVUFBVSxTQUFTLFdBQVk7QUFDbEMsZUFBSyxTQUFT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QUUsT0FBTyxJQUFJLE9BQU87QUFBQSxJQUMvQztBQUFBLEVBQ0Y7QUFFQSxNQUFJLFdBQVcsaUJBQWlCLFNBQVMsVUFBVTtBQUNuRCxNQUFJLFFBQVEsaUJBQWlCLFNBQVMsUUFBUTtBQUM5QyxNQUFJLFVBQVUsaUJBQWlCLFNBQVMsbUJBQW1CO0FBQzNELE1BQUksV0FBVyxpQkFBaUIsU0FBUyxvQkFBb0I7QUFDN0QsR0FBQyxJQUFJLFFBQVEsSUFBSSxhQUFhLElBQUksUUFBUSxFQUFFO0FBQUEsSUFBUSxDQUFDLE9BQ25ELEdBQUcsaUJBQWlCLFNBQVMsc0JBQXNCO0FBQUEsRUFDckQ7QUFDQSxNQUFJLFVBQVUsaUJBQWlCLFNBQVMsTUFBTTtBQUk5QyxXQUFTLGlCQUFpQjtBQUN4QixtQkFBZSxDQUFDO0FBQUEsRUFDbEI7QUFDQSxNQUFJLGVBQWUsaUJBQWlCLFNBQVMsY0FBYztBQUMzRCxNQUFJLGVBQWUsaUJBQWlCLFdBQVcsQ0FBQyxNQUFNO0FBQ3BELFFBQUksRUFBRSxRQUFRLFdBQVcsRUFBRSxRQUFRLEtBQUs7QUFDdEMsUUFBRSxlQUFlO0FBQ2pCLHFCQUFlO0FBQUEsSUFDakI7QUFBQSxFQUNGLENBQUM7QUFFRCxPQUFLOyIsCiAgIm5hbWVzIjogWyJjcnlwdG8iLCAiQnVmZmVyIiwgImJsb2NrcyIsICJleHBvcnRzIiwgImxhdW5jaCJdCn0K
