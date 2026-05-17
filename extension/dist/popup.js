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
    openNhiBtn: document.getElementById("open-nhi-btn"),
    nhiNeedsLoginSection: document.getElementById("nhi-needs-login-section"),
    loginOkSection: document.getElementById("login-ok-section"),
    wizardStepper: document.getElementById("wizard-stepper")
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
    if (els.patientOverrideDetails) {
      const hasRequired = !!patientOverride?.gender && !!patientOverride?.birth_date;
      els.patientOverrideDetails.open = !hasRequired;
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
  function refreshOverrideSummary() {
    const ov = getPatientOverride();
    const card = els.patientOverrideDetails;
    if (!ov) {
      els.ovSummary.textContent = "\u672A\u8A2D\u5B9A";
      if (card) card.dataset.state = "empty";
    } else {
      const parts = [];
      if (ov.name) parts.push(_maybeMask(ov.name));
      parts.push(maskId(ov.id_no));
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
    if (!ov.id_no) delete ov.id_no;
    if (!ov.name) delete ov.name;
    if (!ov.id_no) {
      ov.id_no = _generateAutoPatientId();
      els.ovIdNo.value = ov.id_no;
    }
    await chrome.storage.local.set({ patientOverride: ov });
    refreshOverrideSummary();
    _refreshButtonStates();
    if (els.patientOverrideDetails) els.patientOverrideDetails.open = false;
    const displayName = ov.name ? ` (${_maybeMask(ov.name)})` : "";
    setStatus(`\u2705 \u75C5\u4EBA\u8EAB\u4EFD\u5DF2\u8A18\u4F4F\uFF1A${maskId(ov.id_no)}${displayName}`, "success");
  }
  async function clearPatientOverride() {
    await chrome.storage.local.remove("patientOverride");
    els.ovIdNo.value = "";
    els.ovName.value = "";
    els.ovBirthDate.value = "";
    els.ovGender.value = "";
    refreshOverrideSummary();
    _refreshButtonStates();
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
  var _activeStep = 1;
  var _wizardInitialized = false;
  function _isStepDone(step) {
    const onNhi = !els.syncApiBtn.dataset.offNhi;
    const loggedIn = els.syncApiBtn.dataset.nhiLoggedIn !== "no";
    const genderOk = !!els.ovGender?.value;
    const dobError = validateBirthDate();
    switch (step) {
      case 1:
        return onNhi && loggedIn;
      case 2:
        return genderOk && !dobError;
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
    const genderOk = !!els.ovGender?.value;
    const dobError = validateBirthDate();
    let reason = "";
    if (!onNhi) reason = "\u56DE \u2460 \u767B\u5165\uFF1A\u8ACB\u5207\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801";
    else if (!loggedIn) reason = "\u56DE \u2460 \u767B\u5165\uFF1A\u5065\u4FDD\u5B58\u647A\u5206\u9801\u5C1A\u672A\u767B\u5165";
    else if (!genderOk) reason = "\u56DE \u2461 \u60A8\u7684\u8CC7\u6599\uFF1A\u8ACB\u9078\u64C7\u6027\u5225\u4E26\u6309\u78BA\u5B9A";
    else if (dobError) reason = `\u56DE \u2461 \u60A8\u7684\u8CC7\u6599\uFF1A${dobError}`;
    else if (!modeOk) reason = "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA \u2014 \u770B\u4E0A\u65B9\u7D05\u8272\u63D0\u793A\uFF0C\u6216\u6539\u56DE\u300C\u{1F4BE} \u4E0B\u8F09\u5230\u96FB\u8166\u300D";
    els.syncApiBtn.disabled = reason !== "";
    els.syncApiBtn.title = reason;
    if (els.syncBlockedReason) {
      els.syncBlockedReason.textContent = reason ? `\u26A0\uFE0F ${reason}` : "";
      els.syncBlockedReason.hidden = reason === "";
    }
    const ov = getPatientOverride();
    const haveBackendPatient = _backendPatient.state === "present";
    els.launchBtn.disabled = !(currentMode() === "backend" && _connState === "ok" && !!ov?.id_no && haveBackendPatient);
    els.launchBtn.title = currentMode() !== "backend" ? "\u8ACB\u5207\u5230\u300C\u{1F3E5} \u672C\u6A5F\u5F8C\u7AEF (\u9032\u968E)\u300D\u6A21\u5F0F" : _connState !== "ok" ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : !ov?.id_no ? "\u56DE \u2461 \u60A8\u7684\u8CC7\u6599\uFF1A\u8ACB\u586B\u75C5\u4EBA\u8CC7\u6599" : !haveBackendPatient ? "\u5F8C\u7AEF\u5C1A\u7121\u6B64\u75C5\u4EBA\u8CC7\u6599 \u2014 \u5148\u6309\u300C\u{1F504} \u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6216\u4E0B\u65B9\u300C\u{1F4E4} \u628A\u672C\u5730\u6A94\u6848\u4E0A\u50B3\u5230\u5F8C\u7AEF\u300D" : "";
    if (_wizardInitialized) {
      _refreshWizardUi();
      _maybeAutoAdvance();
    }
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
        bs.textContent = localMatches ? "\u26A0 \u5F8C\u7AEF\u5C1A\u7121\u6B64\u75C5\u4EBA \u2014 \u6309\u300C\u{1F504} \u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6216\u300C\u{1F4E4} \u628A\u672C\u5730\u6A94\u6848\u4E0A\u50B3\u5230\u5F8C\u7AEF\u300D" : "\u26A0 \u5F8C\u7AEF\u5C1A\u7121\u6B64\u75C5\u4EBA \u2014 \u6309\u300C\u{1F504} \u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6293\u8CC7\u6599\u5230\u5F8C\u7AEF";
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
  els.openNhiBtn?.addEventListener("click", async () => {
    await chrome.tabs.create({ url: NHI_LANDING });
    window.close();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PENDING_BUNDLE_KEY in changes) _refreshLocalBundleState();
  });
  async function loadSyncMode() {
    const { syncMode } = await chrome.storage.local.get("syncMode");
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
    if (onNhi && tab.id) {
      chrome.runtime.sendMessage({ type: "checkNhiLogin", tabId: tab.id }).then((resp) => {
        const loggedIn = resp?.loggedIn === true;
        if (loggedIn) delete els.syncApiBtn.dataset.nhiLoggedIn;
        else els.syncApiBtn.dataset.nhiLoggedIn = "no";
        if (els.nhiNeedsLoginSection) {
          els.nhiNeedsLoginSection.hidden = loggedIn;
        }
        _refreshButtonStates();
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
    setStatus(text, kind, breakdown);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIwNzQwODY2YCBcdTIxOTIgYFAxMjA3NCoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpKSB7XG4gICAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICAgIHJldHVybiBsb2luYztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKExPSU5DX01BUCkpIHtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrZXkudG9Mb3dlckNhc2UoKSl9YCkudGVzdChjb21iaW5lZCkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tYmluZWQuaW5jbHVkZXMoa2V5LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICByZXR1cm4gbG9pbmM7XG4gICAgfVxuICB9XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQsIG1hc2tJZCwgbWFza05hbWUgfSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgREVGQVVMVF9CQUNLRU5EID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMTBcIjtcbi8vIERlZmF1bHQgU01BUlQgYXBwIGZvciBhIGZyZXNoIGluc3RhbGwuIFVzZXJzIGNhbiBvdmVycmlkZSB2aWFcbi8vIHRoZSAnXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgU01BUlQgQXBwIExhdW5jaCBVUkwnIGZpZWxkOyB0aGUgdmFsdWUgaXNcbi8vIHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlciBgc21hcnRBcHBMYXVuY2hVcmxgLlxuY29uc3QgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpci9zbWFydC9sYXVuY2hcIjtcblxuLy8gVHJ1ZSBpZiB0aGUgYWN0aXZlIHRhYiBpcyBhbiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHBhZ2UgKHJlYWwgc2l0ZSkuXG5mdW5jdGlvbiBpc05oaVRhYih1cmwpIHtcbiAgaWYgKCF1cmwpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IG5ldyBVUkwodXJsKSA6IHVybDtcbiAgICByZXR1cm4gL215aGVhbHRoYmFua1xcLm5oaVxcLmdvdlxcLnR3Ly50ZXN0KHUuaG9zdG5hbWUpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgREVGQVVMVF9NT0RFID0gXCJsb2NhbFwiO1xuXG5jb25zdCBlbHMgPSB7XG4gIG1vZGVSYWRpb3M6ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzeW5jLW1vZGVcIl0nKSxcbiAgYmFja2VuZFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXVybFwiKSxcbiAgc3luY0FwaUtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWFwaS1rZXlcIiksXG4gIHNtYXJ0QXBwVXJsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNtYXJ0LWFwcC11cmxcIiksXG4gIHN5bmNBcGlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGktYnRuXCIpLFxuICBzeW5jQmxvY2tlZFJlYXNvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWJsb2NrZWQtcmVhc29uXCIpLFxuICBhcGlTeW5jUmFuZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBpLXN5bmMtcmFuZ2VcIiksXG4gIHN0b3BCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIiksXG4gIG92SWRObzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1pZC1ub1wiKSxcbiAgb3ZOYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LW5hbWVcIiksXG4gIG92QmlydGhEYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWJpcnRoLWRhdGVcIiksXG4gIG92R2VuZGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWdlbmRlclwiKSxcbiAgb3ZTYXZlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LXNhdmUtYnRuXCIpLFxuICBvdkNsZWFyQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWNsZWFyLWJ0blwiKSxcbiAgb3ZTdW1tYXJ5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJyaWRlLXN1bW1hcnlcIiksXG4gIHBhdGllbnRPdmVycmlkZURldGFpbHM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF0aWVudC1vdmVycmlkZVwiKSxcbiAgbGF1bmNoQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdW5jaC1idG5cIiksXG4gIHN0YXR1czogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGF0dXNcIiksXG4gIGRhc2hib2FyZExpbms6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFzaGJvYXJkLWxpbmtcIiksXG4gIHBlbmRpbmdCdW5kbGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGVuZGluZy1idW5kbGVcIiksXG4gIGRvd25sb2FkQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvd25sb2FkLWJ1bmRsZS1idG5cIiksXG4gIGNsZWFyQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyLWJ1bmRsZS1idG5cIiksXG4gIGJ1bmRsZU1ldGE6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVuZGxlLW1ldGFcIiksXG4gIGNvbm5CYW5uZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1iYW5uZXJcIiksXG4gIGNvbm5TZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tc2VjdGlvblwiKSxcbiAgY29ubk1pbmk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1taW5pXCIpLFxuICBjb25uTXNnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tbXNnXCIpLFxuICBjb25uUmV0cnlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1yZXRyeS1idG5cIiksXG4gIGNvbm5IZWxwOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4taGVscFwiKSxcbiAgZGF0YVN0YXRlU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRhLXN0YXRlLXNlY3Rpb25cIiksXG4gIGJhY2tlbmRTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXN0YXRlXCIpLFxuICBsb2NhbFN0YXRlUm93OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvY2FsLXN0YXRlLXJvd1wiKSxcbiAgbG9jYWxTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2NhbC1zdGF0ZVwiKSxcbiAgcHVzaExvY2FsQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB1c2gtbG9jYWwtYnRuXCIpLFxuICBzeW5jU3RhdHVzSGludDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLXN0YXR1cy1oaW50XCIpLFxuICBzaWRlYmFyRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLWVuYWJsZWRcIiksXG4gIG1hc2tOYW1lRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXNrLW5hbWUtZW5hYmxlZFwiKSxcbiAgb3Blbk5oaVNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1uaGktc2VjdGlvblwiKSxcbiAgb3Blbk5oaUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW5oaS1idG5cIiksXG4gIG5oaU5lZWRzTG9naW5TZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5oaS1uZWVkcy1sb2dpbi1zZWN0aW9uXCIpLFxuICBsb2dpbk9rU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1vay1zZWN0aW9uXCIpLFxuICB3aXphcmRTdGVwcGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndpemFyZC1zdGVwcGVyXCIpLFxufTtcblxuY29uc3QgTkhJX0xBTkRJTkcgPSBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHcvSUhLRTMwMDBcIjtcblxuY29uc3QgUEVORElOR19CVU5ETEVfS0VZID0gXCJwZW5kaW5nRmhpckJ1bmRsZVwiO1xuXG4vLyBQZXJzaXN0ZWQtc3RhdGUga2V5cy4gQmFja2VuZCBVUkwgYW5kIEFQSSBrZXkgcGVyc2lzdCBhY3Jvc3MgYnJvd3NlciBzZXNzaW9ucy5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRCYWNrZW5kVXJsKCkge1xuICBjb25zdCB7IGJhY2tlbmRVcmwsIHN5bmNBcGlLZXksIHNtYXJ0QXBwTGF1bmNoVXJsIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXG4gICAgW1wiYmFja2VuZFVybFwiLCBcInN5bmNBcGlLZXlcIiwgXCJzbWFydEFwcExhdW5jaFVybFwiXVxuICApO1xuICBlbHMuYmFja2VuZFVybC52YWx1ZSA9IGJhY2tlbmRVcmwgfHwgREVGQVVMVF9CQUNLRU5EO1xuICBlbHMuc3luY0FwaUtleS52YWx1ZSA9IHN5bmNBcGlLZXkgfHwgXCJcIjtcbiAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gc21hcnRBcHBMYXVuY2hVcmwgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGF0aWVudCBvdmVycmlkZSAobWFudWFsIE5ISSBpZGVudGl0eSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGRvZXNuJ3QgZXhwb3NlIHRoZSB1c2VyJ3MgbmF0aW9uYWwgSUQgaW4gdGhlIFVSTC4gVGhlIHVzZXJcbi8vIGZpbGxzIHRoZXNlIG9uY2UgYW5kIHRoZXkncmUgc2VudCB3aXRoIGV2ZXJ5IHVwbG9hZCBjYWxsIHVudGlsIGNsZWFyZWQuXG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGNvbnN0IHsgcGF0aWVudE92ZXJyaWRlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJwYXRpZW50T3ZlcnJpZGVcIik7XG4gIGlmIChwYXRpZW50T3ZlcnJpZGUpIHtcbiAgICBlbHMub3ZJZE5vLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCI7XG4gICAgZWxzLm92TmFtZS52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCI7XG4gICAgZWxzLm92QmlydGhEYXRlLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmJpcnRoX2RhdGUgfHwgXCJcIjtcbiAgICBlbHMub3ZHZW5kZXIudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuZ2VuZGVyIHx8IFwiXCI7XG4gIH1cbiAgLy8gU3RlcCAyIGlzIHdoZXJlIHRoZSByZXF1aXJlZC1maWVsZCBhY3Rpb24gbGl2ZXMuIEF1dG8tZXhwYW5kIHRoZVxuICAvLyBjYXJkIHdoZW5ldmVyIHRoZSByZXF1aXJlZCBmaWVsZHMgKGdlbmRlciArIGJpcnRoX2RhdGUpIGFyZW4ndFxuICAvLyBib3RoIGZpbGxlZCBcdTIwMTQgY292ZXJzIGZpcnN0LXRpbWUgQU5EIHJldHVybmluZyB1c2VycyB3aG9zZSBwcmV2aW91c1xuICAvLyBzYXZlIHdhcyBpbmNvbXBsZXRlLiBPbmNlIHJlcXVpcmVkIGZpZWxkcyBhcmUgZG9uZSwgY29sbGFwc2UgdG9cbiAgLy8gZ2l2ZSBicmVhdGhpbmcgcm9vbS5cbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSB7XG4gICAgY29uc3QgaGFzUmVxdWlyZWQgPSAhIXBhdGllbnRPdmVycmlkZT8uZ2VuZGVyICYmICEhcGF0aWVudE92ZXJyaWRlPy5iaXJ0aF9kYXRlO1xuICAgIGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzLm9wZW4gPSAhaGFzUmVxdWlyZWQ7XG4gIH1cbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xufVxuXG5mdW5jdGlvbiBnZXRQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIC8vIFJldHVybnMge2lkX25vLCBuYW1lLCBiaXJ0aF9kYXRlLCBnZW5kZXJ9LlxuICAvLyBpZF9ubyBpcyBvcHRpb25hbCBpbiB0aGUgVUk7IGlmIGJsYW5rIHRoZSBwb3B1cCBhdXRvLWdlbmVyYXRlcyBhblxuICAvLyBcImF1dG8tWFhYWFhYWFhcIiBpZGVudGlmaWVyIGF0IHNhdmUgdGltZS4gUmV0dXJucyBudWxsIHdoZW4gYm90aFxuICAvLyBpZF9ubyBhbmQgbmFtZSBhcmUgZW1wdHkgKG5vdGhpbmcgaWRlbnRpZnlpbmcgdG8gc2F2ZSkuXG4gIGNvbnN0IGlkX25vID0gZWxzLm92SWROby52YWx1ZS50cmltKCk7XG4gIGNvbnN0IG5hbWUgPSBlbHMub3ZOYW1lLnZhbHVlLnRyaW0oKTtcbiAgaWYgKCFpZF9ubyAmJiAhbmFtZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG91dCA9IGlkX25vID8geyBpZF9ubyB9IDoge307XG4gIGlmIChuYW1lKSBvdXQubmFtZSA9IG5hbWU7XG4gIGNvbnN0IGJpcnRoX2RhdGUgPSBlbHMub3ZCaXJ0aERhdGUudmFsdWUudHJpbSgpO1xuICBjb25zdCBnZW5kZXIgPSBlbHMub3ZHZW5kZXIudmFsdWU7XG4gIGlmIChiaXJ0aF9kYXRlKSBvdXQuYmlydGhfZGF0ZSA9IGJpcnRoX2RhdGU7XG4gIGlmIChnZW5kZXIpIG91dC5nZW5kZXIgPSBnZW5kZXI7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIHBhdGllbnQgY2FyZCdzIGJpcnRoLWRhdGUgaW5wdXQuIFJldHVybnMgbnVsbCB3aGVuIE9LLFxuICogb3RoZXJ3aXNlIGEgdXNlci1mYWNpbmcgZXJyb3Igc3RyaW5nLiBSZWFkcyBkaXJlY3RseSBmcm9tIHRoZVxuICogPGlucHV0IHR5cGU9XCJkYXRlXCI+IHNvIHdlIGNhbiBkZXRlY3QgcGFydGlhbC1pbnB1dCBzdGF0ZXMgdGhhdFxuICogQ2hyb21lIHJlcG9ydHMgdGhyb3VnaCBgdmFsaWRpdHkuYmFkSW5wdXRgICh0aGUgaW5wdXQncyBgLnZhbHVlYFxuICogaXMgXCJcIiBpbiB0aGF0IGNhc2UsIGluZGlzdGluZ3Vpc2hhYmxlIGZyb20gXCJibGFua1wiIGJ5IHN0cmluZyBjaGVja1xuICogYWxvbmUgXHUyMDE0IHRoYXQncyB3aHkgdGhlIG9sZCB2ZXJzaW9uIG9mIHRoaXMgZnVuY3Rpb24gbGV0IHBhcnRpYWxcbiAqIHllYXItb25seSBlbnRyaWVzIHNsaXAgdGhyb3VnaCkuXG4gKlxuICogQWxsb3dlZCBzdGF0ZXM6XG4gKiAgIC0gZ2VudWluZWx5IGVtcHR5ICh0aGUgZmllbGQgaXMgb3B0aW9uYWwpXG4gKiAgIC0gZnVsbCBJU08gWVlZWS1NTS1ERCB0aGF0IHJvdW5kLXRyaXBzIHRocm91Z2ggRGF0ZSgpXG4gKiBSZWplY3RlZDpcbiAqICAgLSB5ZWFyLW9ubHkgLyB5ZWFyK21vbnRoOiB0aGUgaW5wdXQgcmVuZGVycyBibGFuayB2YWx1ZSBidXRcbiAqICAgICB2YWxpZGl0eS5iYWRJbnB1dCBpcyB0cnVlXG4gKiAgIC0gZGF0ZXMgaW4gdGhlIGZ1dHVyZVxuICogICAtIGltcGxhdXNpYmx5IG9sZCBkYXRlcyAoeWVhciA8IDE5MDApXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlQmlydGhEYXRlKCkge1xuICBjb25zdCBlbCA9IGVscy5vdkJpcnRoRGF0ZTtcbiAgaWYgKCFlbCkgcmV0dXJuIG51bGw7XG4gIC8vIENocm9tZSdzIG5hdGl2ZSBkYXRlIGlucHV0OiBwYXJ0aWFsIGVudHJ5IChqdXN0IHllYXIsIGp1c3QgeXl5eS1tbSlcbiAgLy8gc3VyZmFjZXMgaGVyZSBldmVuIHRob3VnaCAudmFsdWUgaXMgXCJcIi5cbiAgaWYgKGVsLnZhbGlkaXR5ICYmIGVsLnZhbGlkaXR5LmJhZElucHV0KSB7XG4gICAgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU4QUNCXHU1ODZCXHU1QjhDXHU2NTc0XHU1RTc0XHU2NzA4XHU2NUU1XCI7XG4gIH1cbiAgY29uc3QgcyA9IChlbC52YWx1ZSB8fCBcIlwiKS50cmltKCk7XG4gIC8vIEJpcnRoIGRhdGUgaXMgbm93IHJlcXVpcmVkIFx1MjAxNCBhZ2UgYWZmZWN0cyBldmVyeSByZWZlcmVuY2UgcmFuZ2VcbiAgLy8gYW5kIGFueSBkb3duc3RyZWFtIGFnZS1iYXNlZCBVSTsgZW1wdHkgaW5wdXQgbGV0cyBhIHR5cG8gLyBicm93c2VyXG4gIC8vIHF1aXJrIHNpbGVudGx5IHByb3BhZ2F0ZSBhcyBOYU4uXG4gIGlmICghcykgcmV0dXJuIFwiXHU4QUNCXHU1ODZCXHU3NTFGXHU2NUU1XCI7XG4gIGlmICghL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QocykpIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1OEFDQlx1NTg2Qlx1NUI4Q1x1NjU3NFx1NUU3NFx1NjcwOFx1NjVFNVwiO1xuICBjb25zdCBbeSwgbSwgZF0gPSBzLnNwbGl0KFwiLVwiKS5tYXAoTnVtYmVyKTtcbiAgY29uc3QgZHQgPSBuZXcgRGF0ZShzICsgXCJUMDA6MDA6MDBaXCIpO1xuICBpZiAoXG4gICAgTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkgfHxcbiAgICBkdC5nZXRVVENGdWxsWWVhcigpICE9PSB5IHx8XG4gICAgZHQuZ2V0VVRDTW9udGgoKSArIDEgIT09IG0gfHxcbiAgICBkdC5nZXRVVENEYXRlKCkgIT09IGRcbiAgKSB7XG4gICAgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU0RTBEXHU2NjJGXHU2NzA5XHU2NTQ4XHU2NUU1XHU2NzFGXCI7XG4gIH1cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgaWYgKGR0LmdldFRpbWUoKSA+IG5vdy5nZXRUaW1lKCkpIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1NEUwRFx1ODBGRFx1NjYyRlx1NjcyQVx1NEY4NlwiO1xuICBpZiAoeSA8IDE5MDApIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1NUU3NFx1NEVGRFx1NTkyQVx1NjVFOVx1RkYwQ1x1OEFDQlx1NzhCQVx1OEE4RFwiO1xuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gUmFuZG9tIFwiYXV0by1YWFhYWFhYWFwiIFx1MjAxNCA4IGhleCBjaGFycyBmcm9tIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgc29cbi8vIGV2ZXJ5IGZyZXNoIHBvcHVwIGluc3RhbGwgZ2V0cyBhIGRpZmZlcmVudCBJRCBhbmQgcmUtc3luY3MgYXJlIHN0YWJsZS5cbmZ1bmN0aW9uIF9nZW5lcmF0ZUF1dG9QYXRpZW50SWQoKSB7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICBjb25zdCBoZXggPSBBcnJheS5mcm9tKGJ5dGVzLCAoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgXCIwXCIpKS5qb2luKFwiXCIpO1xuICByZXR1cm4gYGF1dG8tJHtoZXh9YDtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgY2FyZCA9IGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzO1xuICBpZiAoIW92KSB7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2NzJBXHU4QTJEXHU1QjlBXCI7XG4gICAgaWYgKGNhcmQpIGNhcmQuZGF0YXNldC5zdGF0ZSA9IFwiZW1wdHlcIjtcbiAgfSBlbHNlIHtcbiAgICAvLyBOYW1lIGZpcnN0ICh3aGVuIHByZXNlbnQpLCB0aGVuIG1hc2tlZCBJRC4gTmFtZSBcdTIxOTIgXCJ0aGUgcGF0aWVudFxuICAgIC8vIEknbSB3b3JraW5nIHdpdGhcIiByZWFkcyBuYXR1cmFsbHkgZmlyc3Q7IElEIGlzIHRoZSB0ZWNobmljYWxcbiAgICAvLyBkZXRhaWwuIFByZXZpb3VzbHkgdGhlIG9yZGVyIHdhcyByZXZlcnNlZCwgcHV0dGluZyBgUDEyMDc0KioqKmBcbiAgICAvLyBhaGVhZCBvZiB0aGUgYWN0dWFsIHBlcnNvbidzIG5hbWUuXG4gICAgLy8gSUQgYWx3YXlzIGhhbGYtbWFza2VkIChQMTIwNzQwODY2IFx1MjE5MiBQMTIwNzQqKioqKSBcdTIwMTQgbWF0Y2hlcyBOSElcbiAgICAvLyBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gVUkgY29udmVudGlvbiBhbmQgcmVtb3ZlcyBhIHN0YWJsZSBzaG91bGRlci1cbiAgICAvLyBzdXJmaW5nIHRhcmdldC4gUmF3IHZhbHVlIHN0aWxsIGluIHN0b3JhZ2UgKyB0aGUgaW5wdXQgZmllbGQuXG4gICAgLy8gTmFtZSBmb2xsb3dzIHRoZSBtYXNrIHRvZ2dsZSAoXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4IFx1OTgxMFx1OEEyRFx1OTVEQyA9IFx1NzcxRlx1NTQwRCAvXG4gICAgLy8gbXVsdGktcGF0aWVudCBkZW1vIFx1OTU4Qlx1NTU1RiA9IFx1OTA2RVx1N0Y2OSkuXG4gICAgY29uc3QgcGFydHMgPSBbXTtcbiAgICBpZiAob3YubmFtZSkgcGFydHMucHVzaChfbWF5YmVNYXNrKG92Lm5hbWUpKTtcbiAgICBwYXJ0cy5wdXNoKG1hc2tJZChvdi5pZF9ubykpO1xuICAgIGVscy5vdlN1bW1hcnkudGV4dENvbnRlbnQgPSBgXHUyNzEzICR7cGFydHMuam9pbihcIiAgXHUwMEI3ICBcIil9YDtcbiAgICBpZiAoY2FyZCkgY2FyZC5kYXRhc2V0LnN0YXRlID0gXCJmaWxsZWRcIjtcbiAgfVxuICAvLyBCb3RoIGxhdW5jaCArIHN5bmMgZW5hYmxlZCBzdGF0ZSBkZXBlbmQgb24gcGF0aWVudCArIG1vZGUgKyBjb25uLlxuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBDaGFuZ2luZyBwYXRpZW50IElEIGludmFsaWRhdGVzOiAoYSkgYmFja2VuZC1zdGF0ZSBjYWNoZSAobmV3XG4gIC8vIHBhdGllbnQgbWlnaHQgbm90IGJlIG9uIGJhY2tlbmQpOyAoYikgbG9jYWwtYnVuZGxlIHJvdyBpbiB0aGVcbiAgLy8gZGF0YS1zdGF0ZSBjYXJkOyAoYykgdGhlIFx1RDgzRFx1RENFNSBkb3dubG9hZCBidW5kbGUgc2VjdGlvbiwgd2hpY2ggd291bGRcbiAgLy8gb3RoZXJ3aXNlIHN0aWxsIHNob3cgdGhlIHByZXZpb3VzIHBhdGllbnQncyBzdGFzaGVkIGZpbGU7IChkKVxuICAvLyB0aGUgbGFzdCBjb21wbGV0ZWQgc3luYydzIHN1Y2Nlc3MgbWVzc2FnZSwgd2hpY2ggd2FzIHRhZ2dlZCBmb3JcbiAgLy8gdGhlIHByZXZpb3VzIHBhdGllbnQuXG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbiAgX2NsZWFyU3RhbGVTeW5jU3RhdHVzKGdldFBhdGllbnRPdmVycmlkZSgpKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIF9jb25uU3RhdGUgPT09IFwib2tcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xufVxuXG4vLyBEcm9wIGEgXCJcdTI3MDUgXHU1NDBDXHU2QjY1XHU1QjhDXHU2MjEwIFx1MjAyNlwiIHN0YXR1cyBiYW5uZXIgdGhhdCB3YXMgcmVjb3JkZWQgZm9yIGFcbi8vIGRpZmZlcmVudCBwYXRpZW50LiBNaWQtZmxpZ2h0IHN5bmNzIGFyZSBsZWZ0IGFsb25lIChzdGF0dXMucnVubmluZylcbi8vIHNvIHRoZSB1c2VyIGNhbiBzdGlsbCBzZWUgcHJvZ3Jlc3Mgb2YgdGhlIGluLWZsaWdodCBzeW5jLlxuZnVuY3Rpb24gX2NsZWFyU3RhbGVTeW5jU3RhdHVzKG92KSB7XG4gIGlmICghX2xhdGVzdFN0YXR1cykgcmV0dXJuO1xuICBpZiAoX2xhdGVzdFN0YXR1cy5ydW5uaW5nKSByZXR1cm47XG4gIGlmICghX2xhdGVzdFN0YXR1cy5oaXN0bm8pIHJldHVybjtcbiAgaWYgKG92Py5pZF9ubyA9PT0gX2xhdGVzdFN0YXR1cy5oaXN0bm8pIHJldHVybjtcbiAgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG4gIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwic3luY1N0YXR1c1wiKS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIC8vIEdlbmRlciArIGJpcnRoX2RhdGUgYXJlIHJlcXVpcmVkLiBpZF9ubyAvIG5hbWUgYXJlIG9wdGlvbmFsIFx1MjAxNFxuICAvLyBpZF9ubyB3aWxsIGJlIGF1dG8tZmV0Y2hlZCBvbiBzeW5jLCBuYW1lIGNhbiBiZSBsZWZ0IGJsYW5rIG9yIGZha2UuXG4gIGlmICghZWxzLm92R2VuZGVyLnZhbHVlKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1OEFDQlx1OTA3OFx1NjRDN1x1NjAyN1x1NTIyNVwiLCBcImVycm9yXCIpO1xuICAgIGVscy5vdkdlbmRlci5mb2N1cygpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBkb2JFcnJvciA9IHZhbGlkYXRlQmlydGhEYXRlKCk7XG4gIGlmIChkb2JFcnJvcikge1xuICAgIHNldFN0YXR1cyhgXHUyNkQ0ICR7ZG9iRXJyb3J9YCwgXCJlcnJvclwiKTtcbiAgICBlbHMub3ZCaXJ0aERhdGUuZm9jdXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gQnVpbGQgdGhlIG92ZXJyaWRlIGRpcmVjdGx5IHNvIHdlIGRvbid0IGRlcGVuZCBvblxuICAvLyBnZXRQYXRpZW50T3ZlcnJpZGUncyBcIm11c3QgaGF2ZSBpZF9ubyBvciBuYW1lXCIgbnVsbC1yZXR1cm4gXHUyMDE0IHRoZVxuICAvLyByZXF1aXJlZC1maWVsZCBwYXRoIGFib3ZlIGhhcyBhbHJlYWR5IHZhbGlkYXRlZCB3aGF0IG1hdHRlcnMuXG4gIGNvbnN0IG92ID0ge1xuICAgIGlkX25vOiBlbHMub3ZJZE5vLnZhbHVlLnRyaW0oKSB8fCBudWxsLFxuICAgIG5hbWU6IGVscy5vdk5hbWUudmFsdWUudHJpbSgpIHx8IG51bGwsXG4gICAgYmlydGhfZGF0ZTogZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKSxcbiAgICBnZW5kZXI6IGVscy5vdkdlbmRlci52YWx1ZSxcbiAgfTtcbiAgaWYgKCFvdi5pZF9ubykgZGVsZXRlIG92LmlkX25vO1xuICBpZiAoIW92Lm5hbWUpIGRlbGV0ZSBvdi5uYW1lO1xuICAvLyBJRCBhdXRvLWdlbmVyYXRpb246IGlmIHVzZXIgbGVmdCBpZF9ubyBibGFuaywgbWludCBhbiBcImF1dG8tWFhYWFwiXG4gIC8vIGFuZCBzdGFzaCBpdCBpbiB0aGUgVUkgc28gc3Vic2VxdWVudCByZS1zeW5jcyB1c2UgdGhlIHNhbWUgRkhJUlxuICAvLyBQYXRpZW50LmlkIChzdG9yYWdlIHBlcnNpc3RlbmNlIGtlZXBzIGl0IHN0YWJsZSBhY3Jvc3MgcmUtb3BlbnMpLlxuICBpZiAoIW92LmlkX25vKSB7XG4gICAgb3YuaWRfbm8gPSBfZ2VuZXJhdGVBdXRvUGF0aWVudElkKCk7XG4gICAgZWxzLm92SWROby52YWx1ZSA9IG92LmlkX25vO1xuICB9XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHBhdGllbnRPdmVycmlkZTogb3YgfSk7XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSBlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscy5vcGVuID0gZmFsc2U7XG4gIC8vIE1ha2UgY2xlYXIgdGhpcyBpcyB0aGUgaWRlbnRpdHkgc2F2ZSwgbm90IGEgbWVkaWNhbC1yZWNvcmQgc3luYyBcdTIwMTRcbiAgLy8gXHUzMDBDXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XHUzMDBEYWxvbmUgcmVhZHMgYXMgXCJwYXRpZW50IGRhdGFcIiAobWVkaWNhbCkgZm9yIHNvbWUgdXNlcnMuXG4gIC8vIElEIGhhbGYtbWFza2VkIGluIHRoZSB0b2FzdCBmb3IgdGhlIHNhbWUgc2hvdWxkZXItc3VyZmluZyByZWFzb25cbiAgLy8gYXMgdGhlIHN1bW1hcnkgbGluZSBhYm92ZS5cbiAgY29uc3QgZGlzcGxheU5hbWUgPSBvdi5uYW1lID8gYCAoJHtfbWF5YmVNYXNrKG92Lm5hbWUpfSlgIDogXCJcIjtcbiAgc2V0U3RhdHVzKGBcdTI3MDUgXHU3NUM1XHU0RUJBXHU4RUFCXHU0RUZEXHU1REYyXHU4QTE4XHU0RjRGXHVGRjFBJHttYXNrSWQob3YuaWRfbm8pfSR7ZGlzcGxheU5hbWV9YCwgXCJzdWNjZXNzXCIpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjbGVhclBhdGllbnRPdmVycmlkZSgpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwicGF0aWVudE92ZXJyaWRlXCIpO1xuICBlbHMub3ZJZE5vLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92TmFtZS52YWx1ZSA9IFwiXCI7XG4gIGVscy5vdkJpcnRoRGF0ZS52YWx1ZSA9IFwiXCI7XG4gIGVscy5vdkdlbmRlci52YWx1ZSA9IFwiXCI7XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSBlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscy5vcGVuID0gdHJ1ZTtcbiAgc2V0U3RhdHVzKFwiXHU1REYyXHU2RTA1XHU5NjY0XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCIsIFwiaW5mb1wiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgY29ubmVjdGlvbiBzdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBTaW5nbGUgc291cmNlIG9mIHRydXRoOiBgX2Nvbm5TdGF0ZWAgcmVmbGVjdHMgdGhlIGxhdGVzdCBiYWNrZW5kXG4vLyBjb25uZWN0aXZpdHkgY2hlY2suIEJvdGggdGhlIGJhbm5lciBVSSBhbmQgdGhlIGVuYWJsZWQtc3RhdGUgb2YgdGhlXG4vLyBcdUQ4M0RcdURDRTUgU3luYyAvIFx1RDgzRFx1REU4MCBMYXVuY2ggYnV0dG9ucyByZWFkIGZyb20gaXQuXG4vL1xuLy8gU3RhdGVzOlxuLy8gICBcInVua25vd25cIiAgXHUyMDE0IG5vdCB5ZXQgY2hlY2tlZCAoZS5nLiBmaXJzdCBwYWludCBpbiBsb2NhbCBtb2RlKVxuLy8gICBcImNoZWNraW5nXCIgXHUyMDE0IGZldGNoIGluIGZsaWdodFxuLy8gICBcIm9rXCIgICAgICAgXHUyMDE0IEdFVCAvZmhpci9tZXRhZGF0YSByZXR1cm5lZCBhIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFxuLy8gICBcImZhaWxcIiAgICAgXHUyMDE0IGFueXRoaW5nIGVsc2U7IGBfY29ubkZhaWxSZWFzb25gIGNhcnJpZXMgZGV0YWlsXG4vL1xuLy8gQmFja2VuZCBjb25uZWN0aXZpdHkgaXMgdHJlYXRlZCBhcyBhICpwcmVyZXF1aXNpdGUqIGZvciBiYWNrZW5kIG1vZGUsXG4vLyBub3QgYXMgYSBwZXItYWN0aW9uIGNoZWNrLiBTd2l0Y2hpbmcgdG8gYmFja2VuZCBtb2RlIHRyaWdnZXJzIGEgdGVzdFxuLy8gaW1tZWRpYXRlbHk7IGZhaWx1cmUgc2hvd3MgYSBiYW5uZXIgd2l0aCBhY3Rpb25hYmxlIGd1aWRhbmNlIGFuZFxuLy8gZGlzYWJsZXMgYm90aCBhY3Rpb24gYnV0dG9ucyB1bnRpbCBjb25uZWN0aXZpdHkgcmVjb3ZlcnMuXG5cbmxldCBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7XG5sZXQgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDsgLy8geyBraW5kOiBcIm5vLXBlcm1pc3Npb25cIiB8IFwibm8tdXJsXCIgfCBcIm5ldHdvcmtcIiB8IFwidGltZW91dFwiIHwgXCJodHRwXCIgfCBcIm5vdC1maGlyXCIsIGRldGFpbD8gfVxuXG5jb25zdCBfQ09OTl9MQUJFTFMgPSB7XG4gIHVua25vd246IFwiXHU2NzJBXHU2QUEyXHU2RTJDXCIsXG4gIGNoZWNraW5nOiBcIlx1NkFBMlx1NkUyQ1x1NEUyRFx1MjAyNlwiLFxuICBvazogKCkgPT4gYFx1NURGMlx1OTAyM1x1N0REQSBcdTIwMTQgJHtlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCl9YCxcbiAgZmFpbDogKCkgPT4ge1xuICAgIGNvbnN0IHIgPSBfY29ubkZhaWxSZWFzb24gfHwge307XG4gICAgcmV0dXJuICh7XG4gICAgICBcIm5vLXVybFwiOiBcIlx1MjcxNyBcdTY3MkFcdThBMkRcdTVCOUEgQmFja2VuZCBVUkxcIixcbiAgICAgIFwibm8tcGVybWlzc2lvblwiOiBcIlx1MjcxNyBcdTY3MkFcdTYzODhcdTZCMEFcdTkwMjNcdTdEREFcIixcbiAgICAgIFwibmV0d29ya1wiOiBcIlx1MjcxNyBcdTkwMjNcdTRFMERcdTRFMEFcdTVGOENcdTdBRUZcIixcbiAgICAgIFwidGltZW91dFwiOiBcIlx1MjcxNyBcdTkwMjNcdTdEREFcdTkwM0VcdTY2NDJcIixcbiAgICAgIFwiaHR0cFwiOiBgXHUyNzE3IEhUVFAgJHtyLmRldGFpbCB8fCBcIlwifWAudHJpbSgpLFxuICAgICAgXCJub3QtZmhpclwiOiBcIlx1MjcxNyBcdTU2REVcdTYxQzlcdTRFMERcdTY2MkYgRkhJUlwiLFxuICAgIH0pW3Iua2luZF0gPz8gXCJcdTI3MTcgXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3XCI7XG4gIH0sXG59O1xuXG5jb25zdCBfQ09OTl9IRUxQID0ge1xuICBcIm5vLXVybFwiOiAgICAgICAgXCJcdThBQ0JcdTUyMzBcdTMwMENcdTkwMzJcdTk2OEVcdThBMkRcdTVCOUFcdTMwMERcdTU4NkJcdTUxNjUgQmFja2VuZCBVUkxcdUZGMENcdTRGOEJcdTU5ODIgPGNvZGU+aHR0cDovL2xvY2FsaG9zdDo4MDEwPC9jb2RlPlx1MzAwMlwiLFxuICBcIm5vLXBlcm1pc3Npb25cIjogXCJDaHJvbWUgXHU5NjNCXHU2NENCXHU0RTg2XHU4REU4XHU0Rjg2XHU2RTkwXHU4QUNCXHU2QzQyXHUzMDAyXHU4QUNCXHU5MUNEXHU2NUIwXHU5NThCIHBvcHVwXHVGRjBDXHU3NTc2XHU2QjBBXHU5NjUwXHU1QzBEXHU4QTcxXHU2ODQ2XHU4REYzXHU1MUZBXHU2NjQyXHU2MzA5XHUzMDBDXHU1MTQxXHU4QTMxXHUzMDBEXHUzMDAyXCIsXG4gIFwibmV0d29ya1wiOiAgICAgICBcIlx1NUY4Q1x1N0FFRlx1NTNFRlx1ODBGRFx1OTA4NFx1NkM5Mlx1NTU1Rlx1NTJENVx1MzAwMlx1OEFDQlx1NTdGN1x1ODg0Q1x1RkYxQTxicj48Y29kZT5kb2NrZXIgY29tcG9zZSB1cCAtZDwvY29kZT48YnI+XHU3OEJBXHU4QThEIGJhY2tlbmQgXHU1QkI5XHU1NjY4XHU4REQxXHU4RDc3XHU0Rjg2XHU1MThEXHU5MUNEXHU4QTY2XHUzMDAyXCIsXG4gIFwidGltZW91dFwiOiAgICAgICBcIjUgXHU3OUQyXHU1MTY3XHU2QzkyXHU2NTM2XHU1MjMwXHU1NkRFXHU2MUM5IFx1MjAxNCBiYWNrZW5kIFx1NTNFRlx1ODBGRFx1OTA4NFx1NTcyOFx1NTU1Rlx1NTJENVx1NEUyRFx1RkYwQ1x1N0I0OSAzMCBcdTc5RDJcdTUxOERcdTYzMDlcdTkxQ0RcdThBNjZcdTMwMDJcIixcbiAgXCJodHRwXCI6ICAgICAgICAgIFwiQmFja2VuZCBcdTU2REVcdTYxQzlcdTkzMkZcdThBQTRcdTcyQzBcdTYxNEJcdTc4QkNcdTMwMDJcdTZBQTJcdTY3RTUgYmFja2VuZCBcdTc2ODQgbG9nXHVGRjFBPGJyPjxjb2RlPmRvY2tlciBjb21wb3NlIGxvZ3MgYmFja2VuZDwvY29kZT5cIixcbiAgXCJub3QtZmhpclwiOiAgICAgIFwiXHU5MDE5XHU1MDBCIFVSTCBcdTU2REVcdTRFODZcdTY3NzFcdTg5N0ZcdUZGMENcdTRGNDZcdTRFMERcdTY2MkYgRkhJUiBDYXBhYmlsaXR5U3RhdGVtZW50XHUzMDAyXHU3OEJBXHU4QThEIEJhY2tlbmQgVVJMIFx1NjMwN1x1NTQxMSBOSEktRkhJUi1CcmlkZ2UgXHU3Njg0IC9maGlyIFx1NjgzOVx1NzZFRVx1OTMwNFx1MzAwMlwiLFxufTtcblxuZnVuY3Rpb24gX3JlbmRlckNvbm5CYW5uZXIoKSB7XG4gIGNvbnN0IGJhbm5lciA9IGVscy5jb25uQmFubmVyO1xuICBpZiAoIWJhbm5lcikgcmV0dXJuO1xuICBiYW5uZXIuZGF0YXNldC5zdGF0ZSA9IF9jb25uU3RhdGU7XG4gIGNvbnN0IGxhYmVsID0gX0NPTk5fTEFCRUxTW19jb25uU3RhdGVdO1xuICBlbHMuY29ubk1zZy50ZXh0Q29udGVudCA9IHR5cGVvZiBsYWJlbCA9PT0gXCJmdW5jdGlvblwiID8gbGFiZWwoKSA6IGxhYmVsO1xuICBlbHMuY29ublJldHJ5QnRuLmhpZGRlbiA9IF9jb25uU3RhdGUgIT09IFwiZmFpbFwiO1xuICBpZiAoX2Nvbm5TdGF0ZSA9PT0gXCJmYWlsXCIgJiYgX2Nvbm5GYWlsUmVhc29uPy5raW5kKSB7XG4gICAgZWxzLmNvbm5IZWxwLmhpZGRlbiA9IGZhbHNlO1xuICAgIGVscy5jb25uSGVscC5pbm5lckhUTUwgPSBfQ09OTl9IRUxQW19jb25uRmFpbFJlYXNvbi5raW5kXSA/PyBcIlwiO1xuICB9IGVsc2Uge1xuICAgIGVscy5jb25uSGVscC5oaWRkZW4gPSB0cnVlO1xuICAgIGVscy5jb25uSGVscC5pbm5lckhUTUwgPSBcIlwiO1xuICB9XG5cbiAgLy8gQ29tcGFjdC1waWxsIHZzIGZ1bGwtYmFubmVyIHN3YXA6IHdoZW4gZXZlcnl0aGluZydzIGZpbmUsIHNocmluayB0b1xuICAvLyBhIHNtYWxsIGdyZWVuIHBpbGwgaW4gdGhlIGhlYWRlciBzbyB0aGUgcG9wdXAgYm9keSBoYXMgbW9yZSByb29tXG4gIC8vIGZvciBhY3Rpb25hYmxlIGNvbnRlbnQuIEFueXRoaW5nIGVsc2UgKHVua25vd24gLyBjaGVja2luZyAvIGZhaWwpXG4gIC8vIGtlZXBzIHRoZSBmdWxsIGJhbm5lciBzbyBwcm9ncmVzcyArIGVycm9yIGhlbHAgaGFzIHNwYWNlIHRvIHJlbmRlci5cbiAgY29uc3QgaXNPayA9IF9jb25uU3RhdGUgPT09IFwib2tcIjtcbiAgaWYgKGVscy5jb25uU2VjdGlvbikgZWxzLmNvbm5TZWN0aW9uLmhpZGRlbiA9IGlzT2s7XG4gIGlmIChlbHMuY29ubk1pbmkpIHtcbiAgICBlbHMuY29ubk1pbmkuaGlkZGVuID0gIWlzT2s7XG4gICAgaWYgKGlzT2spIGVscy5jb25uTWluaS50aXRsZSA9IGBcdTVERjJcdTkwMjNcdTdEREEgXHUyMDE0ICR7ZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpfWA7XG4gIH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwIDMtc3RlcCB3aXphcmQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gQ29uY2VwdHVhbGx5OlxuLy8gICBTdGVwIDEgXHUyMDE0IFx1NzY3Qlx1NTE2NVx1RkYxQW9uIE5ISSB0YWIgKyBzZXNzaW9uIHRva2VuIGlzIHZhbGlkXG4vLyAgIFN0ZXAgMiBcdTIwMTQgXHU4QTJEXHU1QjlBXHVGRjFBZ2VuZGVyIGZpbGxlZCArIChtb2RlPT1sb2NhbCBPUiBiYWNrZW5kIHJlYWNoYWJsZSlcbi8vICAgICAgICAgICAgICAgICsgYmlydGhfZGF0ZSBpZiBlbnRlcmVkIG11c3QgYmUgdmFsaWRcbi8vICAgU3RlcCAzIFx1MjAxNCBcdTUzRDZcdTVGOTdcdUZGMUF0aGUgYWN0aW9uIGl0c2VsZiAoc3luYyBDVEEsIHN0YXR1cywgcmVzdWx0cylcbi8vXG4vLyBTdGVwcyBhdXRvLWFkdmFuY2Ugd2hlbiB0aGVpciBwcmVjb25kaXRpb24gZmxpcHMgZ3JlZW47IHVzZXJzIGNhblxuLy8gY2xpY2sgdGhlIHN0ZXBwZXIgdG8gcmV2aXNpdCBhbnkgc3RlcC4gV2UgbmV2ZXIgYXV0by1zdGVwIEJBQ0sgb25cbi8vIHN0YXRlIGNoYW5nZSBcdTIwMTQgb25jZSB0aGUgdXNlciBoYXMgbW92ZWQgZm9yd2FyZCwgb25seSBhbiBleHBsaWNpdFxuLy8gc3RlcHBlciBjbGljayBicmluZ3MgdGhlbSBiYWNrLiBPdGhlcndpc2Ugb3BlbmluZyB0aGUgcG9wdXAgbWlkLVxuLy8gc3luYyB3b3VsZCBqZXJrIHRoZW0gYmFjayB0byBzdGVwIDEuXG5sZXQgX2FjdGl2ZVN0ZXAgPSAxO1xubGV0IF93aXphcmRJbml0aWFsaXplZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBfaXNTdGVwRG9uZShzdGVwKSB7XG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBsb2dnZWRJbiA9IGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW4gIT09IFwibm9cIjtcbiAgY29uc3QgZ2VuZGVyT2sgPSAhIWVscy5vdkdlbmRlcj8udmFsdWU7XG4gIGNvbnN0IGRvYkVycm9yID0gdmFsaWRhdGVCaXJ0aERhdGUoKTtcbiAgc3dpdGNoIChzdGVwKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIG9uTmhpICYmIGxvZ2dlZEluO1xuICAgIGNhc2UgMjpcbiAgICAgIC8vIE1vZGUgc2VsZWN0aW9uIG1vdmVkIHRvIHN0ZXAgMywgc28gc3RlcCAyJ3Mgb25seSByZXF1aXJlbWVudFxuICAgICAgLy8gaXMgdGhlIHBhdGllbnQgaWRlbnRpdHkgKGdlbmRlciArIHZhbGlkIGRvYikuXG4gICAgICByZXR1cm4gZ2VuZGVyT2sgJiYgIWRvYkVycm9yO1xuICAgIGNhc2UgMzpcbiAgICAgIC8vIFN0ZXAgMyBpcyB0aGUgdGVybWluYWwgYWN0aW9uIHN0ZXA7IG5ldmVyIFwiZG9uZVwiIGZvciBwcm9ncmVzc1xuICAgICAgLy8gcHVycG9zZXMgKHRoZSBzdWNjZXNzIGJhbm5lciBpbnNpZGUgdGhlIHN0ZXAgaXMgdGhlIGluZGljYXRvcikuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfc2V0QWN0aXZlU3RlcChuLCBvcHRzID0ge30pIHtcbiAgY29uc3QgY2xhbXBlZCA9IE1hdGgubWF4KDEsIE1hdGgubWluKDMsIG4pKTtcbiAgX2FjdGl2ZVN0ZXAgPSBjbGFtcGVkO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuYWN0aXZlU3RlcCA9IFN0cmluZyhjbGFtcGVkKTtcbiAgX3JlZnJlc2hXaXphcmRVaSgpO1xuICBpZiAoIW9wdHMuc2lsZW50KSB7XG4gICAgLy8gQXV0by1zY3JvbGwgdGhlIHBvcHVwIHRvIHRoZSB0b3Agb2YgdGhlIHN0ZXAgc28gdXNlcnMgYWx3YXlzXG4gICAgLy8gc2VlIHRoZSBzdGVwIGhlYWRlciAvIGZpcnN0IGlucHV0IGFmdGVyIG5hdmlnYXRpb24uXG4gICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaFdpemFyZFVpKCkge1xuICBpZiAoIWVscy53aXphcmRTdGVwcGVyKSByZXR1cm47XG4gIGNvbnN0IGxpcyA9IGVscy53aXphcmRTdGVwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVtkYXRhLXN0ZXBdXCIpO1xuICBmb3IgKGNvbnN0IGxpIG9mIGxpcykge1xuICAgIGNvbnN0IG4gPSBOdW1iZXIobGkuZGF0YXNldC5zdGVwKTtcbiAgICBjb25zdCBpc0FjdGl2ZSA9IG4gPT09IF9hY3RpdmVTdGVwO1xuICAgIGNvbnN0IGlzRG9uZSA9IF9pc1N0ZXBEb25lKG4pO1xuICAgIGlmIChpc0FjdGl2ZSkgbGkuc2V0QXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIsIFwidHJ1ZVwiKTtcbiAgICBlbHNlIGxpLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiKTtcbiAgICBpZiAoaXNEb25lKSBsaS5kYXRhc2V0LmRvbmUgPSBcInRydWVcIjtcbiAgICBlbHNlIGRlbGV0ZSBsaS5kYXRhc2V0LmRvbmU7XG4gIH1cbiAgLy8gU3RlcCAxJ3MgdGhyZWUgc3ViLWNhcmRzIChvZmYtbmhpIC8gbmVlZHMtbG9naW4gLyBsb2dpbi1vaykgYXJlXG4gIC8vIG11dHVhbGx5IGV4Y2x1c2l2ZSBcdTIwMTQgcGljayB0aGUgb25lIHRoYXQgbWF0Y2hlcyBjdXJyZW50IHN0YXRlLlxuICBjb25zdCBvbk5oaSA9ICFlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgY29uc3QgbG9nZ2VkSW4gPSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluICE9PSBcIm5vXCI7XG4gIGlmIChlbHMub3Blbk5oaVNlY3Rpb24pXG4gICAgZWxzLm9wZW5OaGlTZWN0aW9uLmhpZGRlbiA9IG9uTmhpO1xuICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKVxuICAgIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSAhb25OaGkgfHwgbG9nZ2VkSW47XG4gIGlmIChlbHMubG9naW5Pa1NlY3Rpb24pXG4gICAgZWxzLmxvZ2luT2tTZWN0aW9uLmhpZGRlbiA9ICEob25OaGkgJiYgbG9nZ2VkSW4pO1xufVxuXG5mdW5jdGlvbiBfbWF5YmVBdXRvQWR2YW5jZSgpIHtcbiAgLy8gT25seSBhZHZhbmNlIGZvcndhcmQsIG5ldmVyIGJhY2suIFNhdmUgdXNlcidzIHBsYWNlIGlmIHRoZXkndmVcbiAgLy8gY2xpY2tlZCBpbnRvIGEgbGF0ZXIgc3RlcCBtYW51YWxseS5cbiAgaWYgKF9hY3RpdmVTdGVwID09PSAxICYmIF9pc1N0ZXBEb25lKDEpKSBfc2V0QWN0aXZlU3RlcCgyKTtcbiAgZWxzZSBpZiAoX2FjdGl2ZVN0ZXAgPT09IDIgJiYgX2lzU3RlcERvbmUoMikpIF9zZXRBY3RpdmVTdGVwKDMpO1xufVxuXG5mdW5jdGlvbiBfaW5pdFdpemFyZCgpIHtcbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgcmV0dXJuO1xuICBfd2l6YXJkSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAvLyBJbml0aWFsIHN0ZXA6IHdoaWNoZXZlciBpcyB0aGUgRklSU1Qgbm90LXlldC1kb25lIHN0ZXAgYXQgcG9wdXAgb3Blbi5cbiAgLy8gRmlyc3QtdGltZSB1c2VyIFx1MjE5MiBzdGVwIDEuIFJldHVybmluZyB1c2VyIHdpdGggdmFsaWQgc2Vzc2lvbiArIHNhdmVkXG4gIC8vIHBhdGllbnQgXHUyMTkyIHN0ZXAgMy5cbiAgY29uc3Qgc3RhcnQgPSBfaXNTdGVwRG9uZSgxKSA/IChfaXNTdGVwRG9uZSgyKSA/IDMgOiAyKSA6IDE7XG4gIF9zZXRBY3RpdmVTdGVwKHN0YXJ0LCB7IHNpbGVudDogdHJ1ZSB9KTtcblxuICAvLyBTdGVwcGVyIGNsaWNrcyBcdTIxOTIganVtcFxuICBmb3IgKGNvbnN0IGxpIG9mIGVscy53aXphcmRTdGVwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVtkYXRhLXN0ZXBdXCIpKSB7XG4gICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IF9zZXRBY3RpdmVTdGVwKE51bWJlcihsaS5kYXRhc2V0LnN0ZXApKSk7XG4gICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiIHx8IGUua2V5ID09PSBcIiBcIikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIF9zZXRBY3RpdmVTdGVwKE51bWJlcihsaS5kYXRhc2V0LnN0ZXApKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaEJ1dHRvblN0YXRlcygpIHtcbiAgLy8gU3luYyBidXR0b24uIENvbmRpdGlvbnMsIGluIHByaW9yaXR5IG9yZGVyOlxuICAvLyAgIDEuIG9uIGFuIE5ISSB0YWJcbiAgLy8gICAyLiBsb2dnZWQgaW4gdG8gTkhJIChkZXRlY3RlZCB2aWEgYmFja2dyb3VuZCBwcmUtZmxpZ2h0KVxuICAvLyAgIDMuIGJhY2tlbmQgbW9kZSBcdTIxOTIgYmFja2VuZCBjb25uZWN0ZWRcbiAgLy8gICA0LiBnZW5kZXIgZmlsbGVkIChvdGhlciBwYXRpZW50IGZpZWxkcyBhbGwgb3B0aW9uYWwpXG4gIC8vIFdoYXRldmVyIGJsb2NrcyB0aGUgQ1RBIGFsc28gZ2V0cyBzdXJmYWNlZCBhcyBhbiBpbmxpbmUgbWVzc2FnZVxuICAvLyBiZWxvdyB0aGUgYnV0dG9uIFx1MjAxNCB0b29sdGlwcyBhcmUgaW52aXNpYmxlIGluIHRoZSAzNjBweCBwb3B1cC5cbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBjb25zdCBtb2RlT2sgPSBjdXJyZW50TW9kZSgpID09PSBcImxvY2FsXCIgfHwgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICBjb25zdCBnZW5kZXJPayA9ICEhZWxzLm92R2VuZGVyPy52YWx1ZTtcbiAgY29uc3QgZG9iRXJyb3IgPSB2YWxpZGF0ZUJpcnRoRGF0ZSgpO1xuXG4gIC8vIEVhY2ggYmxvY2tpbmcgcmVhc29uIG5hbWVzIHRoZSBzdGVwIHRoYXQgbmVlZHMgYXR0ZW50aW9uLiBNb2RlICtcbiAgLy8gY29ubmVjdGlvbiBub3cgbGl2ZSBpbiBzdGVwIDMgYWxvbmdzaWRlIHRoZSBDVEEgaXRzZWxmLCBzbyB0aG9zZVxuICAvLyByZWFzb25zIHJlZmVyZW5jZSB3aGF0J3MgZGlyZWN0bHkgYWJvdmUgdGhlIGJ1dHRvbiByYXRoZXIgdGhhblxuICAvLyBzZW5kaW5nIHRoZSB1c2VyIGJhY2sgdGhyb3VnaCB0aGUgc3RlcHBlci5cbiAgbGV0IHJlYXNvbiA9IFwiXCI7XG4gIGlmICghb25OaGkpIHJlYXNvbiA9IFwiXHU1NkRFIFx1MjQ2MCBcdTc2N0JcdTUxNjVcdUZGMUFcdThBQ0JcdTUyMDdcdTUyMzBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTUyMDZcdTk4MDFcIjtcbiAgZWxzZSBpZiAoIWxvZ2dlZEluKSByZWFzb24gPSBcIlx1NTZERSBcdTI0NjAgXHU3NjdCXHU1MTY1XHVGRjFBXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU1MjA2XHU5ODAxXHU1QzFBXHU2NzJBXHU3NjdCXHU1MTY1XCI7XG4gIGVsc2UgaWYgKCFnZW5kZXJPaykgcmVhc29uID0gXCJcdTU2REUgXHUyNDYxIFx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVx1RkYxQVx1OEFDQlx1OTA3OFx1NjRDN1x1NjAyN1x1NTIyNVx1NEUyNlx1NjMwOVx1NzhCQVx1NUI5QVwiO1xuICBlbHNlIGlmIChkb2JFcnJvcikgcmVhc29uID0gYFx1NTZERSBcdTI0NjEgXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XHVGRjFBJHtkb2JFcnJvcn1gO1xuICBlbHNlIGlmICghbW9kZU9rKSByZWFzb24gPSBcIlx1NUY4Q1x1N0FFRlx1NUMxQVx1NjcyQVx1OTAyM1x1N0REQSBcdTIwMTQgXHU3NzBCXHU0RTBBXHU2NUI5XHU3RDA1XHU4MjcyXHU2M0QwXHU3OTNBXHVGRjBDXHU2MjE2XHU2NTM5XHU1NkRFXHUzMDBDXHVEODNEXHVEQ0JFIFx1NEUwQlx1OEYwOVx1NTIzMFx1OTZGQlx1ODE2Nlx1MzAwRFwiO1xuXG4gIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gcmVhc29uICE9PSBcIlwiO1xuICBlbHMuc3luY0FwaUJ0bi50aXRsZSA9IHJlYXNvbjtcbiAgaWYgKGVscy5zeW5jQmxvY2tlZFJlYXNvbikge1xuICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi50ZXh0Q29udGVudCA9IHJlYXNvbiA/IGBcdTI2QTBcdUZFMEYgJHtyZWFzb259YCA6IFwiXCI7XG4gICAgZWxzLnN5bmNCbG9ja2VkUmVhc29uLmhpZGRlbiA9IHJlYXNvbiA9PT0gXCJcIjtcbiAgfVxuXG4gIC8vIExhdW5jaCBidXR0b246IGJhY2tlbmQgbW9kZSArIGNvbm4gb2sgKyBwYXRpZW50IHNldCArIGJhY2tlbmRcbiAgLy8gYWN0dWFsbHkgaGFzIHRoaXMgcGF0aWVudCAob3RoZXJ3aXNlIHRoZSBTTUFSVCBhcHAgbGF1bmNoZXMgaW50b1xuICAvLyBhbiBlbXB0eSBGSElSIHN0b3JlIFx1MjAxNCBjb25mdXNpbmcgYmxhbmsgc2NyZWVuKS5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgaGF2ZUJhY2tlbmRQYXRpZW50ID0gX2JhY2tlbmRQYXRpZW50LnN0YXRlID09PSBcInByZXNlbnRcIjtcbiAgZWxzLmxhdW5jaEJ0bi5kaXNhYmxlZCA9ICEoXG4gICAgY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiZcbiAgICBfY29ublN0YXRlID09PSBcIm9rXCIgJiZcbiAgICAhIW92Py5pZF9ubyAmJlxuICAgIGhhdmVCYWNrZW5kUGF0aWVudFxuICApO1xuICBlbHMubGF1bmNoQnRuLnRpdGxlID1cbiAgICBjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiAgPyBcIlx1OEFDQlx1NTIwN1x1NTIzMFx1MzAwQ1x1RDgzQ1x1REZFNSBcdTY3MkNcdTZBNUZcdTVGOENcdTdBRUYgKFx1OTAzMlx1OTY4RSlcdTMwMERcdTZBMjFcdTVGMEZcIiA6XG4gICAgX2Nvbm5TdGF0ZSAhPT0gXCJva1wiICAgICAgICAgICA/IFwiXHU1RjhDXHU3QUVGXHU1QzFBXHU2NzJBXHU5MDIzXHU3RERBXCIgOlxuICAgICFvdj8uaWRfbm8gICAgICAgICAgICAgICAgICAgID8gXCJcdTU2REUgXHUyNDYxIFx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVx1RkYxQVx1OEFDQlx1NTg2Qlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiIDpcbiAgICAhaGF2ZUJhY2tlbmRQYXRpZW50ICAgICAgICAgICA/IFwiXHU1RjhDXHU3QUVGXHU1QzFBXHU3MTIxXHU2QjY0XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5IFx1MjAxNCBcdTUxNDhcdTYzMDlcdTMwMENcdUQ4M0RcdUREMDQgXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUzMDBEXHU2MjE2XHU0RTBCXHU2NUI5XHUzMDBDXHVEODNEXHVEQ0U0IFx1NjI4QVx1NjcyQ1x1NTczMFx1NkE5NFx1Njg0OFx1NEUwQVx1NTBCM1x1NTIzMFx1NUY4Q1x1N0FFRlx1MzAwRFwiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCI7XG5cbiAgLy8gV2l6YXJkIGRlcGVuZHMgb24gdGhlIHNhbWUgaW5wdXRzIFx1MjAxNCByZWZyZXNoIHN0ZXBwZXIgKyBtYXliZSBhdXRvLVxuICAvLyBhZHZhbmNlLiBHdWFyZCBhZ2FpbnN0IHRoZSBpbml0aWFsIHBhaW50IHdoZXJlIF93aXphcmRJbml0aWFsaXplZFxuICAvLyBoYXNuJ3QgcnVuIHlldCAoaW5pdCgpIGNhbGxzIF9pbml0V2l6YXJkIGV4cGxpY2l0bHkgYWZ0ZXIpLlxuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSB7XG4gICAgX3JlZnJlc2hXaXphcmRVaSgpO1xuICAgIF9tYXliZUF1dG9BZHZhbmNlKCk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdEJhY2tlbmRDb25uZWN0aW9uKCkge1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGlmICghdXJsKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tdXJsXCIgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpOyByZXR1cm4gZmFsc2U7XG4gIH1cbiAgX2Nvbm5TdGF0ZSA9IFwiY2hlY2tpbmdcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcblxuICBjb25zdCBwZXJtID0gYXdhaXQgZW5zdXJlQmFja2VuZFBlcm1pc3Npb24odXJsKTtcbiAgaWYgKCFwZXJtLm9rKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dXJsLnJlcGxhY2UoL1xcLyQvLCBcIlwiKX0vZmhpci9tZXRhZGF0YWAsIHsgc2lnbmFsOiBjdHJsLnNpZ25hbCB9KTtcbiAgICBpZiAoIXJlcy5vaykge1xuICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwiaHR0cFwiLCBkZXRhaWw6IHJlcy5zdGF0dXMgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcy5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCk7XG4gICAgICBpZiAoYm9keT8ucmVzb3VyY2VUeXBlICE9PSBcIkNhcGFiaWxpdHlTdGF0ZW1lbnRcIikge1xuICAgICAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJub3QtZmhpclwiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfY29ublN0YXRlID0gXCJva1wiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjtcbiAgICBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXRcIiA6IFwibmV0d29ya1wiIH07XG4gIH0gZmluYWxseSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgfVxuXG4gIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIFdoZW5ldmVyIGNvbm5lY3Rpdml0eSBmbGlwcywgcmUtY2hlY2sgd2hldGhlciB0aGlzIHBhdGllbnQgYWxyZWFkeVxuICAvLyBleGlzdHMgb24gYmFja2VuZC4gKFN0YWxlIFwiX2JhY2tlbmRQYXRpZW50XCIgc3RhdGUgd291bGQgb3RoZXJ3aXNlXG4gIC8vIGNhdXNlIExhdW5jaCB0byBsb29rIGVuYWJsZWQgLyBkaXNhYmxlZCB3cm9uZ2x5LilcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIHJldHVybiBfY29ublN0YXRlID09PSBcIm9rXCI7XG59XG5cbmVscy5jb25uUmV0cnlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0ZXN0QmFja2VuZENvbm5lY3Rpb24pO1xuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBcdTIxOTQgbG9jYWwgZGF0YS1zdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBJbmRlcGVuZGVudCBvZiB0aGUgY29ubmVjdGlvbiBiYW5uZXIgKHdoaWNoIG9ubHkgdGVsbHMgdXMgXCJjYW4gd2Vcbi8vIHJlYWNoIHRoZSBiYWNrZW5kXCIpLiBUaGlzIGNhcmQgYW5zd2VycyB0d28gcXVlc3Rpb25zOlxuLy9cbi8vICAgMS4gRG9lcyB0aGUgYmFja2VuZCBhbHJlYWR5IGhhdmUgdGhpcyBwYXRpZW50J3MgZGF0YT9cbi8vICAgICAgXHUyMTkyIGRyaXZlcyB3aGV0aGVyIFx1RDgzRFx1REU4MCBMYXVuY2ggaXMgYWxsb3dlZCBhdCBhbGwgKExhdW5jaCBvbiBhblxuLy8gICAgICAgIGVtcHR5IGJhY2tlbmQgZ2l2ZXMgYSBjb25mdXNpbmcgU01BUlQtYXBwIGJsYW5rKS5cbi8vICAgMi4gRG9lcyB0aGUgdXNlciBoYXZlIGEgbG9jYWwgQnVuZGxlIHRoYXQncyBuZXdlciB0aGFuIHRoZVxuLy8gICAgICBiYWNrZW5kJ3Mgdmlldz9cbi8vICAgICAgXHUyMTkyIG9mZmVyIFwiXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGUgXHU1MjMwXHU1RjhDXHU3QUVGXCIgdG8gcHVzaCBpdCB2aWEgL2ZoaXIvaW1wb3J0XG4vLyAgICAgICAgd2l0aG91dCByZS1mZXRjaGluZyBOSEkgKGZhc3QsIG5vbi1kZXN0cnVjdGl2ZTogc3RhYmxlIElEc1xuLy8gICAgICAgIHVwc2VydCBzbyBiYWNrZW5kIHJlc291cmNlcyBqdXN0IGJ1bXAgdmVyc2lvbklkKS5cbi8vXG4vLyBXZSBkb24ndCBzZWNvbmQtZ3Vlc3MgdGhlIHVzZXI6IGV2ZW4gd2hlbiBsb2NhbCBpcyBjbGVhcmx5IG5ld2VyLFxuLy8gTGF1bmNoIHN0YXlzIGVuYWJsZWQgaWYgdGhlIGJhY2tlbmQgaGFzIHRoZSBwYXRpZW50IFx1MjAxNCB0aGV5IG1heVxuLy8gZ2VudWluZWx5IHdhbnQgdG8gbG9vayBhdCB0aGUgb2xkZXIgc3RhdGUuIFRoZSBVSSBsYXlzIG91dCBib3RoXG4vLyBzaWRlczsgdXNlciBkZWNpZGVzLlxuXG5sZXQgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuLy8gICBzdGF0ZTogXCJ1bmtub3duXCIgfCBcImNoZWNraW5nXCIgfCBcImFic2VudFwiIHwgXCJwcmVzZW50XCIgfCBcImZhaWxcIlxubGV0IF9sb2NhbEJ1bmRsZSA9IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcblxuZnVuY3Rpb24gX2ZtdFRpbWVTaG9ydChpc28pIHtcbiAgaWYgKCFpc28pIHJldHVybiBcIlwiO1xuICBjb25zdCBkID0gbmV3IERhdGUoaXNvKTtcbiAgaWYgKE51bWJlci5pc05hTihkLmdldFRpbWUoKSkpIHJldHVybiBcIlwiO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgcmV0dXJuIGAke2QuZ2V0TW9udGgoKSArIDF9LyR7ZC5nZXREYXRlKCl9ICR7cGFkKGQuZ2V0SG91cnMoKSl9OiR7cGFkKGQuZ2V0TWludXRlcygpKX1gO1xufVxuXG5mdW5jdGlvbiBfZm10UmVsYXRpdmUobXMpIHtcbiAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBtcztcbiAgaWYgKGRpZmYgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGRpZmYgLyAxMDAwKSl9IFx1NzlEMlx1NTI0RGA7XG4gIGlmIChkaWZmIDwgMzYwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyA2MF8wMDApfSBcdTUyMDZcdTk0MThcdTUyNERgO1xuICBpZiAoZGlmZiA8IDg2XzQwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyAzNjAwXzAwMCl9IFx1NUMwRlx1NjY0Mlx1NTI0RGA7XG4gIHJldHVybiBfZm10VGltZVNob3J0KG5ldyBEYXRlKG1zKS50b0lTT1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gX3JlbmRlckRhdGFTdGF0ZSgpIHtcbiAgLy8gU2VjdGlvbiBvbmx5IHZpc2libGUgaW4gYmFja2VuZCBtb2RlIChoYW5kbGVkIGJ5IC5iYWNrZW5kLW9ubHkgQ1NTKSxcbiAgLy8gYnV0IHdlIGFsc28gZXhwbGljaXRseSBoaWRlIHdoZW4gdGhlIHBvcHVwIGhhcyBubyBwYXRpZW50X292ZXJyaWRlXG4gIC8vIHNldCwgc2luY2UgYm90aCBjaGVja3Mga2V5IG9mZiBwYXRpZW50X2lkLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubykge1xuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ2FyZCBzZXJ2ZXMgYXMgYW4gYWxlcnQsIG5vdCBhIGRhc2hib2FyZCBcdTIwMTQgc2hvdyBvbmx5IHdoZW4gdGhlcmUnc1xuICAvLyBzb21ldGhpbmcgYWN0aW9uYWJsZSAvIHdvcnRoIGZsYWdnaW5nLiBIaWRlIHdoZW46XG4gIC8vICAgLSBiYWNrZW5kIGhhcyB0aGlzIHBhdGllbnQgQU5EIG5vIGxvY2FsIGJ1bmRsZSB0byBjb21wYXJlIGFnYWluc3RcbiAgLy8gICAgIChMYXVuY2ggaXMgZW5hYmxlZCBcdTIxOTIgdGhhdCdzIHRoZSBzaWduYWwgZXZlcnl0aGluZydzIGZpbmUpLCBvclxuICAvLyAgIC0gYm90aCBzaWRlcyBhZ3JlZSBvbiBjb3VudCAoYWxyZWFkeSBpbiBzeW5jLCBubyB1cGxvYWQgbmVlZGVkKS5cbiAgLy8gVGhlIHJlbWFpbmluZyBzdGF0ZXMgKGNoZWNraW5nIC8gZmFpbCAvIGFic2VudCAvIGNvdW50IG1pc21hdGNoKSBhbGxcbiAgLy8gZWl0aGVyIG5lZWQgdXNlciBhdHRlbnRpb24gb3IgYXJlIHRyYW5zaWVudCBsb2FkaW5nIGZlZWRiYWNrLlxuICBjb25zdCBsb2NhbE1hdGNoZXMgPSBfbG9jYWxCdW5kbGUuZXhpc3RzICYmIF9sb2NhbEJ1bmRsZS5wYXRpZW50SWQgPT09IG92LmlkX25vO1xuICBjb25zdCBpblN5bmMgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiZcbiAgICBsb2NhbE1hdGNoZXMgJiZcbiAgICBfYmFja2VuZFBhdGllbnQuY291bnQgPT09IF9sb2NhbEJ1bmRsZS5jb3VudDtcbiAgLy8gUXVpZXQgXCJcdTI3MTMgXHU1REYyXHU1NDBDXHU2QjY1XCIgaGludCBzaXRzIHVuZGVyIHRoZSBkb3dubG9hZCBidXR0b24gd2hlbiBpbi1zeW5jIFx1MjAxNFxuICAvLyBnaXZlcyB0aGUgdXNlciBhIHRpbnkgYWNrbm93bGVkZ2VtZW50IGluc3RlYWQgb2YgdG90YWwgc2lsZW5jZS5cbiAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9ICFpblN5bmM7XG4gIGNvbnN0IG5vdGhpbmdUb1Nob3cgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiYgKCFsb2NhbE1hdGNoZXMgfHwgaW5TeW5jKTtcbiAgaWYgKG5vdGhpbmdUb1Nob3cpIHtcbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSBmYWxzZTtcblxuICAvLyBCYWNrZW5kIHJvd1xuICBjb25zdCBicyA9IGVscy5iYWNrZW5kU3RhdGU7XG4gIHN3aXRjaCAoX2JhY2tlbmRQYXRpZW50LnN0YXRlKSB7XG4gICAgY2FzZSBcImNoZWNraW5nXCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcImRhdGEtc3RhdGUtdmFsdWVcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTZBQTJcdTY3RTVcdTRFMkRcdTIwMjZcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJhYnNlbnRcIjpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZSBlbXB0eVwiO1xuICAgICAgLy8gQ2FyZCBzaXRzIHdpdGhpbiBzdGVwIDMgXHUyMDE0IGJvdGggQ1RBcyBhcmUgdmlzaWJsZSBuZWFyYnkuIE9ubHlcbiAgICAgIC8vIG1lbnRpb24gdGhlIGxvY2FsLXVwbG9hZCBhbHRlcm5hdGl2ZSB3aGVuIGEgbWF0Y2hpbmcgcGVuZGluZ1xuICAgICAgLy8gQnVuZGxlIGFjdHVhbGx5IGV4aXN0cyAob3RoZXJ3aXNlIHVzZXJzIGdvIGh1bnRpbmcgZm9yIGFuXG4gICAgICAvLyB1cGxvYWQgYnV0dG9uIHRoYXQncyBub3QgdGhlcmUpLlxuICAgICAgYnMudGV4dENvbnRlbnQgPSBsb2NhbE1hdGNoZXNcbiAgICAgICAgPyBcIlx1MjZBMCBcdTVGOENcdTdBRUZcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkEgXHUyMDE0IFx1NjMwOVx1MzAwQ1x1RDgzRFx1REQwNCBcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTMwMERcdTYyMTZcdTMwMENcdUQ4M0RcdURDRTQgXHU2MjhBXHU2NzJDXHU1NzMwXHU2QTk0XHU2ODQ4XHU0RTBBXHU1MEIzXHU1MjMwXHU1RjhDXHU3QUVGXHUzMDBEXCJcbiAgICAgICAgOiBcIlx1MjZBMCBcdTVGOENcdTdBRUZcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkEgXHUyMDE0IFx1NjMwOVx1MzAwQ1x1RDgzRFx1REQwNCBcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTMwMERcdTYyOTNcdThDQzdcdTY1OTlcdTUyMzBcdTVGOENcdTdBRUZcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJwcmVzZW50XCI6IHtcbiAgICAgIGNvbnN0IGNvdW50ID0gX2JhY2tlbmRQYXRpZW50LmNvdW50O1xuICAgICAgY29uc3QgdHMgPSBfYmFja2VuZFBhdGllbnQubGFzdFVwZGF0ZWQ7XG4gICAgICBicy5jbGFzc05hbWUgPSBcImRhdGEtc3RhdGUtdmFsdWUgb2tcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gYFx1MjcxMyAke2NvdW50ID4gMCA/IGAke2NvdW50fSBcdTdCNDYgXHUwMEI3IGAgOiBcIlwifVx1NjcwMFx1NUY4Q1x1NjZGNFx1NjVCMCAke19mbXRUaW1lU2hvcnQodHMpIHx8IFwiKHVua25vd24pXCJ9YDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiZmFpbFwiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJkYXRhLXN0YXRlLXZhbHVlIGZhaWxcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTI3MTcgXHU2QUEyXHU2N0U1XHU1OTMxXHU2NTU3XHVGRjA4XHU3NzBCXHU5MDIzXHU3RERBIGJhbm5lclx1RkYwOVwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjAxNFwiO1xuICB9XG5cbiAgLy8gTG9jYWwgcm93IFx1MjAxNCBzaG93IG9ubHkgd2hlbiB0aGUgcGVuZGluZyBidW5kbGUgbWF0Y2hlcyB0aGlzIHBhdGllbnQuXG4gIC8vIChsb2NhbE1hdGNoZXMgd2FzIGNvbXB1dGVkIGFib3ZlIGZvciB0aGUgZWFybHktcmV0dXJuIGNoZWNrLilcbiAgaWYgKGxvY2FsTWF0Y2hlcykge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IGZhbHNlO1xuICAgIGVscy5sb2NhbFN0YXRlLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZSBva1wiO1xuICAgIGVscy5sb2NhbFN0YXRlLnRleHRDb250ZW50ID1cbiAgICAgIGBcdTI3MTMgJHtfbG9jYWxCdW5kbGUuY291bnR9IFx1N0I0NiBcdTAwQjcgJHtfZm10UmVsYXRpdmUoX2xvY2FsQnVuZGxlLmdlbmVyYXRlZEF0KX1cdTc1MjJcdTc1MUZgO1xuICB9IGVsc2Uge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IHRydWU7XG4gIH1cblxuICAvLyBcIlx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlXCIgYnV0dG9uIHNob3dzIG9ubHkgd2hlbiB0aGVyZSdzIGEgbG9jYWwgYnVuZGxlXG4gIC8vIGZvciB0aGlzIHBhdGllbnQuIFdlIGRvbid0IHJlYWNoIHRoaXMgYnJhbmNoIHdoZW4gaW4tc3luYyAodGhlXG4gIC8vIHdob2xlIHNlY3Rpb24gZ2V0cyBoaWRkZW4gYWJvdmUpLCBzbyBubyBuZWVkIGZvciBhIHNlcGFyYXRlXG4gIC8vIGRpc2FibGVkIHN0YXRlIFx1MjAxNCB3aGVuIHRoZSBidXR0b24gc2hvd3MsIHVwbG9hZCBpcyBhbHdheXMgbWVhbmluZ2Z1bC5cbiAgZWxzLnB1c2hMb2NhbEJ0bi5oaWRkZW4gPSAhbG9jYWxNYXRjaGVzO1xuICBlbHMucHVzaExvY2FsQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gIGVscy5wdXNoTG9jYWxCdG4udGl0bGUgPSBcIlwiO1xuICBlbHMucHVzaExvY2FsQnRuLnRleHRDb250ZW50ID0gXCJcdUQ4M0RcdURDRTQgXHU2MjhBXHU2NzJDXHU1NzMwXHU2QTk0XHU2ODQ4XHU0RTBBXHU1MEIzXHU1MjMwXHU1RjhDXHU3QUVGXCI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpIHtcbiAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgX2xvY2FsQnVuZGxlID0gcGVuZGluZ1xuICAgID8ge1xuICAgICAgICBleGlzdHM6IHRydWUsXG4gICAgICAgIGNvdW50OiBBcnJheS5pc0FycmF5KEpTT04ucGFyc2UocGVuZGluZy5qc29uKT8uZW50cnkpXG4gICAgICAgICAgPyBKU09OLnBhcnNlKHBlbmRpbmcuanNvbikuZW50cnkubGVuZ3RoXG4gICAgICAgICAgOiAwLFxuICAgICAgICBnZW5lcmF0ZWRBdDogcGVuZGluZy5nZW5lcmF0ZWRBdCB8fCAwLFxuICAgICAgICBwYXRpZW50SWQ6IHBlbmRpbmcucGF0aWVudElkIHx8IG51bGwsXG4gICAgICB9XG4gICAgOiB7IGV4aXN0czogZmFsc2UsIGNvdW50OiAwLCBnZW5lcmF0ZWRBdDogMCwgcGF0aWVudElkOiBudWxsIH07XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tCYWNrZW5kUGF0aWVudCgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiIHx8ICFvdj8uaWRfbm8gfHwgX2Nvbm5TdGF0ZSAhPT0gXCJva1wiKSB7XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIHJldHVybjtcbiAgfVxuICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImNoZWNraW5nXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG5cbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgY29uc3Qga2V5ID0gZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpO1xuICBjb25zdCBoZWFkZXJzID0ga2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGtleSB9IDoge307XG4gIC8vIEJhY2tlbmQgc3RvcmVzIFBhdGllbnQgdW5kZXIgdGhlIGhhc2hlZCBGSElSIGlkLCBuZXZlciB1bmRlciB0aGUgcmF3XG4gIC8vIG5hdGlvbmFsIElEIFx1MjAxNCBxdWVyeSAvIGV4cG9ydCBieSB0aGUgaGFzaGVkIGZvcm0uXG4gIGNvbnN0IGZoaXJQaWQgPSBkZXJpdmVQYXRpZW50SWQob3YuaWRfbm8pO1xuICB0cnkge1xuICAgIGNvbnN0IHByID0gYXdhaXQgZmV0Y2goYCR7dXJsfS9maGlyL1BhdGllbnQvJHtlbmNvZGVVUklDb21wb25lbnQoZmhpclBpZCl9YCwgeyBoZWFkZXJzIH0pO1xuICAgIGlmIChwci5zdGF0dXMgPT09IDQwNCkge1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJhYnNlbnRcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgICBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghcHIub2spIHtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiZmFpbFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGF0aWVudCA9IGF3YWl0IHByLmpzb24oKTtcbiAgICBjb25zdCBsYXN0VXBkYXRlZCA9IHBhdGllbnQ/Lm1ldGE/Lmxhc3RVcGRhdGVkID8/IG51bGw7XG4gICAgLy8gQ291bnQgdmlhIC9maGlyL2V4cG9ydCBcdTIwMTQgc2xpZ2h0bHkgaGVhdmllciBidXQgaXQncyB0aGUgb25seVxuICAgIC8vIG9mZi10aGUtc2hlbGYgd2F5IHRvIGdldCB0b3RhbCByZXNvdXJjZXMgZm9yIGEgcGF0aWVudC4gQ2FwIGJ5XG4gICAgLy8gNXMgdGltZW91dCBzbyBhIHNsb3cgYmFja2VuZCBkb2Vzbid0IGxvY2sgdGhlIHBvcHVwIGZvcmV2ZXIuXG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBjdHJsLmFib3J0KCksIDUwMDApO1xuICAgICAgY29uc3QgZXIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvZXhwb3J0P3BhdGllbnQ9JHtlbmNvZGVVUklDb21wb25lbnQoZmhpclBpZCl9YCwge1xuICAgICAgICBoZWFkZXJzLCBzaWduYWw6IGN0cmwuc2lnbmFsLFxuICAgICAgfSk7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgaWYgKGVyLm9rKSB7XG4gICAgICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IGVyLmpzb24oKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYnVuZGxlLmVudHJ5KSkgY291bnQgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggeyAvKiBsZWF2ZSBjb3VudCA9IDA7IG5vdCBmYXRhbCAqLyB9XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJwcmVzZW50XCIsIGNvdW50LCBsYXN0VXBkYXRlZCB9O1xuICB9IGNhdGNoIChfZSkge1xuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiZmFpbFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgfVxuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHB1c2hMb2NhbEJ1bmRsZVRvQmFja2VuZCgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdj8uaWRfbm8gfHwgIV9sb2NhbEJ1bmRsZS5leGlzdHMgfHwgX2xvY2FsQnVuZGxlLnBhdGllbnRJZCAhPT0gb3YuaWRfbm8pIHJldHVybjtcbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgY29uc3Qga2V5ID0gZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpO1xuICBjb25zdCBoZWFkZXJzID0ge1xuICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIC4uLihrZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjoga2V5IH0gOiB7fSksXG4gIH07XG4gIGVscy5wdXNoTG9jYWxCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBlbHMucHVzaExvY2FsQnRuLnRleHRDb250ZW50ID0gXCJcdTRFMEFcdTUwQjNcdTRFMkRcdTIwMjZcIjtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gICAgaWYgKCFwZW5kaW5nPy5qc29uKSB0aHJvdyBuZXcgRXJyb3IoXCJubyBsb2NhbCBidW5kbGVcIik7XG4gICAgY29uc3QgciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9pbXBvcnRgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLCBoZWFkZXJzLCBib2R5OiBwZW5kaW5nLmpzb24sXG4gICAgfSk7XG4gICAgaWYgKCFyLm9rKSB7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgci50ZXh0KCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyLnN0YXR1c306ICR7dGV4dC5zbGljZSgwLCAxMjApfWApO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByLmpzb24oKTtcbiAgICBzZXRTdGF0dXMoYFx1MjcwNSBcdTVERjJcdTRFMEFcdTUwQjMgJHtyZXN1bHQuaW1wb3J0ZWQgPz8gXCI/XCJ9IFx1N0I0Nlx1NTIzMFx1NUY4Q1x1N0FFRmAsIFwic3VjY2Vzc1wiKTtcbiAgICBhd2FpdCBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1MjZENCBcdTRFMEFcdTUwQjNcdTU5MzFcdTY1NTdcdUZGMUEke2UubWVzc2FnZX1gLCBcImVycm9yXCIpO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIF9yZW5kZXJEYXRhU3RhdGUoKSAoYWxyZWFkeSBjYWxsZWQgZnJvbSBjaGVja0JhY2tlbmRQYXRpZW50IG9uXG4gICAgLy8gc3VjY2VzcykgZGVjaWRlcyB0aGUgcmlnaHQgZGlzYWJsZWQgc3RhdGUgKyBsYWJlbCBiYXNlZCBvblxuICAgIC8vIHdoZXRoZXIgYmFja2VuZCBhbmQgbG9jYWwgYWdyZWUuIENhbGwgaXQgaGVyZSB0b28gdG8gY292ZXIgdGhlXG4gICAgLy8gZmFpbHVyZSBwYXRoIHRoYXQgc2tpcHBlZCBjaGVja0JhY2tlbmRQYXRpZW50LlxuICAgIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgfVxufVxuXG5lbHMucHVzaExvY2FsQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVzaExvY2FsQnVuZGxlVG9CYWNrZW5kKTtcblxuLy8gXCJcdUQ4M0RcdUREMTcgXHU5NThCXHU1NTVGXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU3NjdCXHU1MTY1XCIgXHUyMDE0IG9wZW5zIHRoZSBOSEkgbGFuZGluZyBwYWdlIHNvIHRoZSB1c2VyXG4vLyBkb2Vzbid0IGhhdmUgdG8gcmVtZW1iZXIgLyBnb29nbGUgdGhlIFVSTC4gQ2xvc2VzIHRoZSBwb3B1cCBzb1xuLy8gdGhleSBkb24ndCBoYXZlIHRvIGRpc21pc3MgaXQgbWFudWFsbHkgYWZ0ZXIgdGhlIG5ldyB0YWIgb3BlbnMuXG5lbHMub3Blbk5oaUJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcbiAgYXdhaXQgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBOSElfTEFORElORyB9KTtcbiAgd2luZG93LmNsb3NlKCk7XG59KTtcblxuLy8gTG9jYWwgYnVuZGxlIHN0YXRlIGNoYW5nZXMgd2hlbmV2ZXIgdGhlIFNXIHN0YXNoZXMgYSBuZXcgc3luYy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIFBFTkRJTkdfQlVORExFX0tFWSBpbiBjaGFuZ2VzKSBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgU3luYyBtb2RlIChsb2NhbCB8IGJhY2tlbmQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuYXN5bmMgZnVuY3Rpb24gbG9hZFN5bmNNb2RlKCkge1xuICBjb25zdCB7IHN5bmNNb2RlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJzeW5jTW9kZVwiKTtcbiAgY29uc3QgbW9kZSA9IHN5bmNNb2RlID09PSBcImJhY2tlbmRcIiA/IFwiYmFja2VuZFwiIDogREVGQVVMVF9NT0RFO1xuICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgci5jaGVja2VkID0gci52YWx1ZSA9PT0gbW9kZTtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBtb2RlO1xuICBpZiAobW9kZSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICAvLyBBdXRvLXRlc3Qgb24gb3BlbiBzbyB0aGUgdXNlciBzZWVzIHN0YXR1cyB3aXRob3V0IGNsaWNraW5nLiBBd2FpdGluZ1xuICAgIC8vIGhlcmUgc2VyaWFsaXplcyB0aGUgcmVzdCBvZiBpbml0KCkgdW50aWwgd2Uga25vdyB0aGUgYW5zd2VyLlxuICAgIGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICB9IGVsc2Uge1xuICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGN1cnJlbnRNb2RlKCkge1xuICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgaWYgKHIuY2hlY2tlZCkgcmV0dXJuIHIudmFsdWU7XG4gIHJldHVybiBERUZBVUxUX01PREU7XG59XG5cbmZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSB7XG4gIHIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKCk7XG4gICAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBtb2RlO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNNb2RlOiBtb2RlIH0pO1xuICAgIGlmIChtb2RlID09PSBcImJhY2tlbmRcIikge1xuICAgICAgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7IC8vIHRyaWdnZXJzIGNoZWNrQmFja2VuZFBhdGllbnQgb24gc3VjY2Vzc1xuICAgIH0gZWxzZSB7XG4gICAgICBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZWxzLmJhY2tlbmRVcmwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IGJhY2tlbmRVcmw6IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKSB9KTtcbiAgZWxzLmRhc2hib2FyZExpbmsuaHJlZiA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnJlcGxhY2UoLzo4MDEwLiokLywgXCI6MzAxMFwiKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbn0pO1xuZWxzLnN5bmNBcGlLZXkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNBcGlLZXk6IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKSB9KTtcbn0pO1xuLy8gU2lkZWJhciBcIlx1RDgzRFx1RENDQiBcdTUyQTlcdTc0MDZcIiB0b2dnbGUgXHUyMDE0IHBlcnNpc3RzIGluIGNocm9tZS5zdG9yYWdlLmxvY2FsIHNvIHRoZVxuLy8gcHJlZmVyZW5jZSBpcyBzdGlja3kgYWNyb3NzIHJlaW5zdGFsbHMuIHNpZGViYXIuanMgbGlzdGVucyB0byB0aGVcbi8vIHNhbWUga2V5IGFuZCBoaWRlcyBpdHNlbGYgd2hlbiBzZXQgdG8gZmFsc2UuXG5hc3luYyBmdW5jdGlvbiBsb2FkU2lkZWJhckVuYWJsZWQoKSB7XG4gIGNvbnN0IHsgc2lkZWJhckVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInNpZGViYXJFbmFibGVkXCIpO1xuICBlbHMuc2lkZWJhckVuYWJsZWQuY2hlY2tlZCA9IHNpZGViYXJFbmFibGVkICE9PSBmYWxzZTsgLy8gZGVmYXVsdCBPTlxufVxuXG5lbHMuc2lkZWJhckVuYWJsZWQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaWRlYmFyRW5hYmxlZDogZWxzLnNpZGViYXJFbmFibGVkLmNoZWNrZWQgfSk7XG59KTtcblxuLy8gTWFzay1wYXRpZW50LW5hbWUgdG9nZ2xlIFx1MjAxNCBkZWZhdWx0cyBPRkYgKGNpdGl6ZW5zIGRvd25sb2FkaW5nIHRoZWlyXG4vLyBvd24gZGF0YSBkb24ndCBuZWVkIGFub255bWl6YXRpb24pLiBXaGVuIE9OOiBwb3B1cCBzdW1tYXJ5LCBGSElSXG4vLyBCdW5kbGUgb3V0cHV0LCBzeW5jLWxvZywgYW5kIE5ISSByZXBvcnQgbmFycmF0aXZlIGFsbCB1c2UgdGhlXG4vLyBtYXNrZWQgZm9ybSAoXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwKSBpbnN0ZWFkIG9mIHRoZSByZWFsIG5hbWUuXG5sZXQgX21hc2tOYW1lRW5hYmxlZCA9IGZhbHNlO1xuYXN5bmMgZnVuY3Rpb24gbG9hZE1hc2tOYW1lRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBtYXNrTmFtZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcIm1hc2tOYW1lRW5hYmxlZFwiKTtcbiAgX21hc2tOYW1lRW5hYmxlZCA9IG1hc2tOYW1lRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgaWYgKGVscy5tYXNrTmFtZUVuYWJsZWQpIGVscy5tYXNrTmFtZUVuYWJsZWQuY2hlY2tlZCA9IF9tYXNrTmFtZUVuYWJsZWQ7XG59XG5cbmZ1bmN0aW9uIF9tYXliZU1hc2sobmFtZSkge1xuICByZXR1cm4gX21hc2tOYW1lRW5hYmxlZCA/IG1hc2tOYW1lKG5hbWUpIDogbmFtZSB8fCBcIlwiO1xufVxuXG5lbHMubWFza05hbWVFbmFibGVkPy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGFzeW5jICgpID0+IHtcbiAgX21hc2tOYW1lRW5hYmxlZCA9IGVscy5tYXNrTmFtZUVuYWJsZWQuY2hlY2tlZDtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgbWFza05hbWVFbmFibGVkOiBfbWFza05hbWVFbmFibGVkIH0pO1xuICAvLyBSZS1yZW5kZXIgcG9wdXAgY2hyb21lIChzdW1tYXJ5IGxpbmUgaXMgdGhlIG9ubHkgc3BvdCB0aGF0IHJlYWRzXG4gIC8vIF9tYXliZU1hc2sgcmVhY3RpdmVseTsgZXZlcnl3aGVyZSBlbHNlIHNhbXBsZXMgaXQganVzdC1pbi10aW1lKS5cbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xufSk7XG5cbmVscy5zbWFydEFwcFVybC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgLy8gUGVyc2lzdCB0cmltbWVkIHZhbHVlLiBFbXB0eSBzdHJpbmcgXHUyMTkyIHJlc3RvcmUgZGVmYXVsdCBvbiBuZXh0IGxvYWQuXG4gIGNvbnN0IHYgPSBlbHMuc21hcnRBcHBVcmwudmFsdWUudHJpbSgpO1xuICBpZiAodikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNtYXJ0QXBwTGF1bmNoVXJsOiB2IH0pO1xuICB9IGVsc2Uge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInNtYXJ0QXBwTGF1bmNoVXJsXCIpO1xuICAgIGVscy5zbWFydEFwcFVybC52YWx1ZSA9IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSDtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIHNldFN0YXR1cyh0ZXh0LCBraW5kLCBicmVha2Rvd24pIHtcbiAgLy8gQnVpbGQgd2l0aCBET00gQVBJIFx1MjAxNCBhdm9pZHMgaW5uZXJIVE1MIC8gWFNTIHJpc2suXG4gIC8vIGJyZWFrZG93biBpcyBhbiBhcnJheSBvZiBtaXhlZCBlbnRyaWVzOlxuICAvLyAgIC0gcGhhc2UgdGltaW5ncyBwcmVmaXhlZCB3aXRoIFwiXHUyM0YxXCIgIFx1MjE5MiBcdTk2OEVcdTZCQjVcdTgwMTdcdTY2NDJcbiAgLy8gICAtIHBlci1lbmRwb2ludCBjb3VudHMgICAgICAgICAgICAgICAgXHUyMTkyIFx1NTQwNCBlbmRwb2ludCBcdTYyOTNcdTUyMzBcdTVFN0VcdTdCNDZcbiAgLy8gQm90aCBraW5kcyBhcmUgdHVja2VkIGluc2lkZSBhIHNpbmdsZSBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiIHRvZ2dsZSBzbyB0aGVcbiAgLy8gcG9wdXAgc3RheXMgY29tcGFjdCBieSBkZWZhdWx0LlxuICBlbHMuc3RhdHVzLmNsYXNzTmFtZSA9IGtpbmQgfHwgXCJcIjtcbiAgZWxzLnN0YXR1cy50ZXh0Q29udGVudCA9IFwiXCI7XG4gIGlmICghdGV4dCAmJiAhKGJyZWFrZG93biAmJiBicmVha2Rvd24ubGVuZ3RoKSkgcmV0dXJuO1xuICBlbHMuc3RhdHVzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQgfHwgXCJcIikpO1xuICBpZiAoYnJlYWtkb3duICYmIGJyZWFrZG93bi5sZW5ndGgpIHtcbiAgICBjb25zdCBwaGFzZVJvd3MgPSBicmVha2Rvd24uZmlsdGVyKChiKSA9PiBiLnN0YXJ0c1dpdGgoXCJcdTIzRjFcIikpO1xuICAgIGNvbnN0IG90aGVyUm93cyA9IGJyZWFrZG93bi5maWx0ZXIoKGIpID0+ICFiLnN0YXJ0c1dpdGgoXCJcdTIzRjFcIikpO1xuXG4gICAgY29uc3QgZGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkZXRhaWxzXCIpO1xuICAgIGRldGFpbHMuY2xhc3NOYW1lID0gXCJzdGF0dXMtZGV0YWlsXCI7XG4gICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xuICAgIHN1bW1hcnkudGV4dENvbnRlbnQgPSBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiO1xuICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoc3VtbWFyeSk7XG5cbiAgICBpZiAob3RoZXJSb3dzLmxlbmd0aCkge1xuICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBib2R5LmNsYXNzTmFtZSA9IFwic3RhdHVzLWJyZWFrZG93blwiO1xuICAgICAgLy8gT25lIGl0ZW0gcGVyIGxpbmUgc28gXCJcdTVDMzFcdTkxQUIgMTIgXHU3QjQ2IC8gXHU4NjU1XHU2NUI5IDg4IFx1N0I0NiAvIFx1NkFBMlx1OUE1NyA0MTIgXHU3QjQ2XCJcbiAgICAgIC8vIGlzIHJlYWRhYmxlOyB0aGUgMzYwcHggcG9wdXAgd291bGQgaGF2ZSB3cmFwcGVkIGEgZmxhdFxuICAgICAgLy8gc2VwYXJhdG9yLWpvaW5lZCBzdHJpbmcgaW50byBhIHRhbmdsZWQgbWVzcy5cbiAgICAgIGZvciAoY29uc3Qgcm93IG9mIG90aGVyUm93cykge1xuICAgICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGluZS50ZXh0Q29udGVudCA9IHJvdztcbiAgICAgICAgYm9keS5hcHBlbmRDaGlsZChsaW5lKTtcbiAgICAgIH1cbiAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuICAgIGlmIChwaGFzZVJvd3MubGVuZ3RoKSB7XG4gICAgICAvLyBQaGFzZSB0aW1pbmdzIGFyZSBkZXYgaW5mbyBcdTIwMTQgdHVjayB0aGVtIGluc2lkZSBhIHNlY29uZCB0b2dnbGVcbiAgICAgIC8vIHNvIGVuZCB1c2VycyBkb24ndCBzZWUgXCJuaGktcGFyYWxsZWw9OHNcIiByaWdodCBhZnRlciBhIHN1Y2Nlc3NcbiAgICAgIC8vIGJhbm5lciBhbmQgdGhpbmsgc29tZXRoaW5nJ3Mgd3JvbmcuXG4gICAgICBjb25zdCB0ZWNoRGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkZXRhaWxzXCIpO1xuICAgICAgdGVjaERldGFpbHMuY2xhc3NOYW1lID0gXCJzdGF0dXMtZGV0YWlsIHN0YXR1cy10ZWNoXCI7XG4gICAgICBjb25zdCB0ZWNoU3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xuICAgICAgdGVjaFN1bW1hcnkudGV4dENvbnRlbnQgPSBcIlx1NjI4MFx1ODg1M1x1N0QzMFx1N0JDMFwiO1xuICAgICAgdGVjaERldGFpbHMuYXBwZW5kQ2hpbGQodGVjaFN1bW1hcnkpO1xuICAgICAgY29uc3QgcGhhc2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHBoYXNlcy5jbGFzc05hbWUgPSBcInN0YXR1cy1waGFzZXNcIjtcbiAgICAgIHBoYXNlcy50ZXh0Q29udGVudCA9IHBoYXNlUm93cy5tYXAoKHApID0+IHAucmVwbGFjZSgvXlx1MjNGMVxccyovLCBcIlwiKSkuam9pbihcIiBcdTAwQjcgXCIpO1xuICAgICAgdGVjaERldGFpbHMuYXBwZW5kQ2hpbGQocGhhc2VzKTtcbiAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQodGVjaERldGFpbHMpO1xuICAgIH1cbiAgICBlbHMuc3RhdHVzLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFjdGl2ZVRhYigpIHtcbiAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KTtcbiAgcmV0dXJuIHRhYjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBlbmRpbmcgRkhJUiBCdW5kbGUgKGxvY2FsLW1vZGUgcmVzdWx0KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBCYWNrZ3JvdW5kIHN0YXNoZXMgdGhlIGdlbmVyYXRlZCBCdW5kbGUgaW50byBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gdW5kZXIgYHBlbmRpbmdGaGlyQnVuZGxlYC4gUG9wdXAgcmVuZGVycyBhIGRvd25sb2FkIGJ1dHRvbi4gVXNlciBtdXN0XG4vLyBjbGljayB0byBhY3R1YWxseSB0cmlnZ2VyIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgXHUyMDE0IHRoZSBmaWxlIG5ldmVyXG4vLyBoaXRzIHRoZSBkaXNrIHVuc29saWNpdGVkLlxuXG5mdW5jdGlvbiBfZm10Qnl0ZXMobikge1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDI0ICogMTAyNCkgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAoMTAyNCAqIDEwMjQpKS50b0ZpeGVkKDIpfSBNQmA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBpZiAoIXBlbmRpbmcgfHwgIXBlbmRpbmcuanNvbikge1xuICAgIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIElmIHRoZSB1c2VyIGhhcyBzd2l0Y2hlZCBvdmVycmlkZSB0byBhIGRpZmZlcmVudCBwYXRpZW50LCB0aGVcbiAgLy8gc3Rhc2hlZCBidW5kbGUgaXMgZm9yIHRoZSAqcHJldmlvdXMqIHBhdGllbnQuIEhpZGUgaXQgc28gdGhleVxuICAvLyBjYW4ndCBhY2NpZGVudGFsbHkgZG93bmxvYWQgdGhlIHdyb25nIGZpbGUuIFRoZSBidW5kbGUgc3RheXMgaW5cbiAgLy8gc3RvcmFnZTsgcmUtZW50ZXJpbmcgdGhlIG1hdGNoaW5nIG92ZXJyaWRlIHdpbGwgc3VyZmFjZSBpdCBhZ2Fpbi5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKG92Py5pZF9ubyAmJiBwZW5kaW5nLnBhdGllbnRJZCAmJiBwZW5kaW5nLnBhdGllbnRJZCAhPT0gb3YuaWRfbm8pIHtcbiAgICBlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICBlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW4gPSBmYWxzZTtcbiAgY29uc3QgYWdvID0gcGVuZGluZy5nZW5lcmF0ZWRBdFxuICAgID8gYCR7TWF0aC5tYXgoMSwgTWF0aC5yb3VuZCgoRGF0ZS5ub3coKSAtIHBlbmRpbmcuZ2VuZXJhdGVkQXQpIC8gMTAwMCkpfSBcdTc5RDJcdTUyNERgXG4gICAgOiBcIlwiO1xuICBlbHMuYnVuZGxlTWV0YS50ZXh0Q29udGVudCA9IGAke3BlbmRpbmcuZmlsZW5hbWV9IFx1MDBCNyAke19mbXRCeXRlcyhwZW5kaW5nLmJ5dGVzIHx8IDApfSR7YWdvID8gYCBcdTAwQjcgJHthZ299YCA6IFwiXCJ9YDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZG93bmxvYWRQZW5kaW5nQnVuZGxlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBpZiAoIXBlbmRpbmcpIHJldHVybjtcbiAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtwZW5kaW5nLmpzb25dLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vZmhpcitqc29uXCIgfSk7XG4gIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gIHRyeSB7XG4gICAgYXdhaXQgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCh7IHVybCwgZmlsZW5hbWU6IHBlbmRpbmcuZmlsZW5hbWUsIHNhdmVBczogZmFsc2UgfSk7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gUmVsZWFzZSBhZnRlciBhIHRpY2sgc28gdGhlIGRvd25sb2FkIGhhcyB0aW1lIHRvIHN0YXJ0LlxuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCA1MDAwKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBjbGVhclBlbmRpbmdCdW5kbGUoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBhd2FpdCByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xufVxuXG5lbHMuZG93bmxvYWRCdW5kbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRvd25sb2FkUGVuZGluZ0J1bmRsZSk7XG5lbHMuY2xlYXJCdW5kbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsZWFyUGVuZGluZ0J1bmRsZSk7XG5cbi8vIExpdmUgdXBkYXRlIHdoZW4gYmFja2dyb3VuZCBzdGFzaGVzIGEgbmV3IGJ1bmRsZSB3aGlsZSBwb3B1cCBpcyBvcGVuLlxuLy8gKE5vdGU6IGFub3RoZXIgb25DaGFuZ2VkIGxpc3RlbmVyIGVhcmxpZXIgaW4gdGhlIGZpbGUgcmVmcmVzaGVzIHRoZVxuLy8gZGF0YS1zdGF0ZSBjYXJkOyB3ZSBsZWF2ZSB0aGF0IG9uZSBzZXBhcmF0ZSBzbyBmYWlsdXJlIG9mIGVpdGhlciBwYXRoXG4vLyBkb2Vzbid0IHRha2UgdGhlIG90aGVyIGRvd24uKVxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgUEVORElOR19CVU5ETEVfS0VZIGluIGNoYW5nZXMpIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG59KTtcblxuLy8gQmFja2dyb3VuZC1zaWRlIGZsb3cgY2FuIG11dGF0ZSB0aGUgcGF0aWVudE92ZXJyaWRlIG1pZC1zeW5jIFx1MjAxNCBtb3N0XG4vLyBpbXBvcnRhbnRseSBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkgc3dhcHMgdGhlIGF1dG8tWFhYWFhYWFhcbi8vIHBsYWNlaG9sZGVyIGZvciB0aGUgcmVhbCBOSEkgY2lkLiBXaXRob3V0IHRoaXMgbGlzdGVuZXIgdGhlIHBvcHVwXG4vLyBpbnB1dHMgc3RheWVkIHN0YWxlLCByZWZyZXNoUGVuZGluZ0J1bmRsZSdzIHBhdGllbnQtbWF0Y2ggY2hlY2tcbi8vIHRoZW4gY29tcGFyZWQgb2xkIGlucHV0IHZhbHVlIHZzLiBmcmVzaCBidW5kbGUucGF0aWVudElkIGFuZCBoaWRcbi8vIHRoZSBkb3dubG9hZCBidXR0b24uIFJlbG9hZCB0aGUgb3ZlcnJpZGUgaW50byB0aGUgaW5wdXRzIHdoZW5ldmVyXG4vLyBzdG9yYWdlIGNoYW5nZXMgc28gZXZlcnkgZG93bnN0cmVhbSBndWFyZCBzZWVzIGNvbnNpc3RlbnQgdmFsdWVzLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgY2hhbmdlcy5wYXRpZW50T3ZlcnJpZGUpIGxvYWRQYXRpZW50T3ZlcnJpZGUoKTtcbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgXHUyNEQ4IEhlbHAtaWNvbiB0b29sdGlwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIE9uZSBzaGFyZWQgPGRpdj4gYXBwZW5kZWQgdG8gdGhlIHBvcHVwIGJvZHkuIE9uIGhvdmVyIG9mIGFueVxuLy8gLmhlbHAtaWNvbiwgd2UgY29weSBpdHMgZGF0YS10aXAgdGV4dCBhbmQgcG9zaXRpb24gdGhlIHRvb2x0aXBcbi8vIGluc2lkZSB0aGUgcG9wdXAsIGNsYW1waW5nIHRvIGl0cyB2aWV3cG9ydCBzbyBpdCBjYW4ndCBjbGlwIG9mZlxuLy8gZWl0aGVyIGVkZ2UgcmVnYXJkbGVzcyBvZiB3aGVyZSB0aGUgaWNvbiBzaXRzLiAoQ1NTIHBzZXVkby1lbGVtZW50c1xuLy8gY2FuJ3QgYmUgbWVhc3VyZWQsIHNvIGEgcHVyZS1DU1MgYXBwcm9hY2ggaW5ldml0YWJseSBwaWNrcyBvbmVcbi8vIGFuY2hvciBzaWRlIGFuZCBicmVha3MgZm9yIGljb25zIG9uIHRoZSBvdGhlciBzaWRlIG9mIHRoZSBwb3B1cC4pXG5jb25zdCBfaGVscFRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5faGVscFRpcC5jbGFzc05hbWUgPSBcImhlbHAtdG9vbHRpcFwiO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChfaGVscFRpcCk7XG5cbmNvbnN0IFZJRVdQT1JUX01BUkdJTiA9IDY7IC8vIGtlZXAgdGhpcyBtYW55IHB4IGNsZWFyIG9mIHBvcHVwIGVkZ2VzXG5cbmZ1bmN0aW9uIF9zaG93SGVscFRvb2x0aXAoaWNvbikge1xuICBfaGVscFRpcC50ZXh0Q29udGVudCA9IGljb24uZGF0YXNldC50aXAgfHwgaWNvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRpcFwiKSB8fCBcIlwiO1xuICBfaGVscFRpcC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKTtcblxuICAvLyBNZWFzdXJlIG5vdyB0aGF0IGNvbnRlbnQgaXMgc2V0LlxuICBjb25zdCBpY29uUmVjdCA9IGljb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHRpcFJlY3QgPSBfaGVscFRpcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3Qgdmlld3BvcnRXID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICBjb25zdCB2aWV3cG9ydEggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXG4gIC8vIEhvcml6b250YWw6IHByZWZlciBjZW50ZXJlZCBvbiB0aGUgaWNvbjsgY2xhbXAgaW50byBbbWFyZ2luLCB2dy10aXAtbWFyZ2luXS5cbiAgbGV0IGxlZnQgPSBpY29uUmVjdC5sZWZ0ICsgaWNvblJlY3Qud2lkdGggLyAyIC0gdGlwUmVjdC53aWR0aCAvIDI7XG4gIGlmIChsZWZ0IDwgVklFV1BPUlRfTUFSR0lOKSBsZWZ0ID0gVklFV1BPUlRfTUFSR0lOO1xuICBpZiAobGVmdCArIHRpcFJlY3Qud2lkdGggPiB2aWV3cG9ydFcgLSBWSUVXUE9SVF9NQVJHSU4pIHtcbiAgICBsZWZ0ID0gdmlld3BvcnRXIC0gVklFV1BPUlRfTUFSR0lOIC0gdGlwUmVjdC53aWR0aDtcbiAgfVxuICAvLyBWZXJ0aWNhbDogcHJlZmVyIGFib3ZlIHRoZSBpY29uOyBmbGlwIGJlbG93IGlmIHRoZXJlJ3Mgbm8gcm9vbSB1cCB0b3AuXG4gIGxldCB0b3AgPSBpY29uUmVjdC50b3AgLSB0aXBSZWN0LmhlaWdodCAtIDY7XG4gIGlmICh0b3AgPCBWSUVXUE9SVF9NQVJHSU4pIHRvcCA9IGljb25SZWN0LmJvdHRvbSArIDY7XG4gIC8vIEZpbmFsIHNhZmV0eTogY2xhbXAgaW50byB2aWV3cG9ydCBzbyB2ZXJ5IGxvbmcgdG9vbHRpcHMgY2FuJ3QgYmxlZWRcbiAgLy8gb2ZmIHRoZSBib3R0b20gZWl0aGVyLlxuICBpZiAodG9wICsgdGlwUmVjdC5oZWlnaHQgPiB2aWV3cG9ydEggLSBWSUVXUE9SVF9NQVJHSU4pIHtcbiAgICB0b3AgPSBNYXRoLm1heChWSUVXUE9SVF9NQVJHSU4sIHZpZXdwb3J0SCAtIFZJRVdQT1JUX01BUkdJTiAtIHRpcFJlY3QuaGVpZ2h0KTtcbiAgfVxuXG4gIF9oZWxwVGlwLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgX2hlbHBUaXAuc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcbn1cblxuZnVuY3Rpb24gX2hpZGVIZWxwVG9vbHRpcCgpIHtcbiAgX2hlbHBUaXAuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG59XG5cbi8vIERlbGVnYXRlZCBob3ZlciBoYW5kbGVycyBcdTIwMTQgd29ya3MgZm9yIGljb25zIGFkZGVkIGFmdGVyIHBvcHVwIGxvYWQgdG9vXG4vLyAoZS5nLiB3aGVuIG1vZGUgdG9nZ2xlIHJldmVhbHMgYmFja2VuZC1vbmx5IGZpZWxkcykuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIChlKSA9PiB7XG4gIGNvbnN0IGljb24gPSBlLnRhcmdldC5jbG9zZXN0Py4oXCIuaGVscC1pY29uXCIpO1xuICBpZiAoaWNvbikgX3Nob3dIZWxwVG9vbHRpcChpY29uKTtcbn0pO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIChlKSA9PiB7XG4gIGNvbnN0IGljb24gPSBlLnRhcmdldC5jbG9zZXN0Py4oXCIuaGVscC1pY29uXCIpO1xuICBpZiAoaWNvbikgX2hpZGVIZWxwVG9vbHRpcCgpO1xufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XG4gIGF3YWl0IGxvYWRTaWRlYmFyRW5hYmxlZCgpO1xuICBhd2FpdCBsb2FkTWFza05hbWVFbmFibGVkKCk7XG5cbiAgLy8gU2VlZCBsb2NhbCBidW5kbGUgc3RhdGUgZnJvbSBzdG9yYWdlIHNvIHRoZSBkYXRhLXN0YXRlIGNhcmQgaXNcbiAgLy8gcG9wdWxhdGVkIGFzIHNvb24gYXMgdGhlIHBvcHVwIHJlbmRlcnMgKG5vIGZsYXNoIG9mIFwiXHU2NzJBXHU3NTIyXHU3NTFGXCIpLlxuICBhd2FpdCBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcblxuICAvLyBPcmRlciBtYXR0ZXJzOiBsb2FkQmFja2VuZFVybCBwb3B1bGF0ZXMgZWxzLmJhY2tlbmRVcmwudmFsdWUsIHdoaWNoXG4gIC8vIGxvYWRTeW5jTW9kZSgpIHJlYWRzIHZpYSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKS4gUmV2ZXJzZSB0aGlzIGFuZFxuICAvLyB0aGUgYXV0by10ZXN0IHNlZXMgYW4gZW1wdHkgVVJMIGFuZCBmYWxzZWx5IHJlcG9ydHMgXCJcdTY3MkFcdThBMkRcdTVCOUEgQmFja2VuZCBVUkxcIlxuICAvLyBvbiBldmVyeSBwb3B1cCBvcGVuLlxuICBhd2FpdCBsb2FkQmFja2VuZFVybCgpO1xuICBhd2FpdCBsb2FkU3luY01vZGUoKTtcbiAgYXdhaXQgbG9hZFBhdGllbnRPdmVycmlkZSgpO1xuICBhd2FpdCByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuXG4gIGNvbnN0IHRhYiA9IGF3YWl0IGdldEFjdGl2ZVRhYigpO1xuICBpZiAoIXRhYj8udXJsKSB7XG4gICAgc2V0U3RhdHVzKFwibm8gYWN0aXZlIHRhYlwiLCBcImVycm9yXCIpO1xuICAgIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpID0gXCIxXCI7XG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBTeW5jIHJlcXVpcmVzIGJlaW5nIG9uIGFuIE5ISSB0YWIgc28gY29va2llcy9zZXNzaW9uIGFyZSB1c2FibGUgZnJvbVxuICAvLyB0aGUgU1cuIEZsYWcgdmlhIGRhdGFzZXQgc28gX3JlZnJlc2hCdXR0b25TdGF0ZXMgY2FuIGNvbWJpbmUgdGhpc1xuICAvLyB3aXRoIHRoZSBtb2RlICsgY29ubiBzdGF0ZS4gV2hlbiBvZmYtTkhJLCBhbHNvIHN1cmZhY2UgdGhlXG4gIC8vIFwiXHVEODNEXHVERDE3IFx1OTU4Qlx1NTU1Rlx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NzY3Qlx1NTE2NVwiIGJhbm5lciBzbyB1c2VycyBkb24ndCB3b25kZXIgd2hlcmUgdG8gZ28uXG4gIGNvbnN0IG9uTmhpID0gaXNOaGlUYWIodGFiLnVybCk7XG4gIGlmIChvbk5oaSkgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBlbHNlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpID0gXCIxXCI7XG4gIGlmIChlbHMub3Blbk5oaVNlY3Rpb24pIGVscy5vcGVuTmhpU2VjdGlvbi5oaWRkZW4gPSBvbk5oaTtcblxuICAvLyBXaGVuIG9uIHRoZSBOSEkgdGFiLCBhc2sgYmFja2dyb3VuZCB0byB2ZXJpZnkgdGhlcmUncyBhbiBhY3RpdmVcbiAgLy8gc2Vzc2lvbi4gVGhlIFNXIHByb2JlcyBJSEtFMzQxMCB3aXRoIHNlc3Npb25TdG9yYWdlLnRva2VuIFx1MjAxNCBjaGVhcFxuICAvLyBhbmQgb25seSBzdWNjZWVkcyB3aGVuIHRoZSB1c2VyIGhhcyBsb2dnZWQgaW4uIEFueXRoaW5nIGJ1dCBgdHJ1ZWBcbiAgLy8gKGZhbHNlLCBudWxsLCBvciBubyByZXNwb25zZSkgbWFrZXMgdXMgYXNzdW1lIFwibm90IGxvZ2dlZCBpblwiIHNvXG4gIC8vIHRoZSB1c2VyIHNlZXMgdGhlIGFjdGlvbmFibGUgYmFubmVyIGluc3RlYWQgb2YgbWFzaGluZyB0aGUgQ1RBXG4gIC8vIGludG8gYSBkZWxheWVkIFwiXHVEODNEXHVERDEyIFx1NUMxQVx1NjcyQVx1NzY3Qlx1NTE2NVwiIHN0YXR1cy5cbiAgaWYgKG9uTmhpICYmIHRhYi5pZCkge1xuICAgIGNocm9tZS5ydW50aW1lXG4gICAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImNoZWNrTmhpTG9naW5cIiwgdGFiSWQ6IHRhYi5pZCB9KVxuICAgICAgLnRoZW4oKHJlc3ApID0+IHtcbiAgICAgICAgY29uc3QgbG9nZ2VkSW4gPSByZXNwPy5sb2dnZWRJbiA9PT0gdHJ1ZTtcbiAgICAgICAgaWYgKGxvZ2dlZEluKSBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbjtcbiAgICAgICAgZWxzZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluID0gXCJub1wiO1xuICAgICAgICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKSB7XG4gICAgICAgICAgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9IGxvZ2dlZEluO1xuICAgICAgICB9XG4gICAgICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgLy8gSWYgdGhlIHByb2JlIGZhaWxzIChTVyB1bnJlYWNoYWJsZSwgZXRjKSwgZG9uJ3QgcHVuaXNoIHRoZVxuICAgICAgICAvLyB1c2VyIFx1MjAxNCBsZWF2ZSB0aGUgQ1RBIGVuYWJsZWQgYW5kIGxldCB0aGUgc3luYydzIG93biBzZXNzaW9uXG4gICAgICAgIC8vIGNoZWNrIHN1cmZhY2UgYSByZWFsIGVycm9yIGlmIG5lZWRlZC5cbiAgICAgICAgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgICAgIGlmIChlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24pIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgICAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbikgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gIH1cblxuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuXG4gIC8vIFN0YXJ0IHRoZSB3aXphcmQgQUZURVIgYWxsIGluaXRpYWwgc3RhdGUgaXMgbG9hZGVkIFx1MjAxNCB0aGlzIHBpY2tzXG4gIC8vIHRoZSBjb3JyZWN0IHN0YXJ0aW5nIHN0ZXAgKGUuZy4gcmV0dXJuaW5nIHVzZXIgd2l0aCB2YWxpZCBzZXNzaW9uXG4gIC8vIGxhbmRzIG9uIHN0ZXAgMyBkaXJlY3RseSkuXG4gIF9pbml0V2l6YXJkKCk7XG5cbiAgLy8gUmUtYXR0YWNoIHRvIGFueSBzeW5jIHRoYXQncyBjdXJyZW50bHkgcnVubmluZyBpbiB0aGUgc2VydmljZSB3b3JrZXIuXG4gIC8vIFRoaXMgaXMgd2hhdCBsZXRzIHRoZSB1c2VyIGNsb3NlICsgcmVvcGVuIHRoZSBwb3B1cCBtaWQtc3luYy5cbiAgYXdhaXQgcmVmcmVzaFN5bmNTdGF0dXNGcm9tQmFja2dyb3VuZCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZWZyZXNoU3luY1N0YXR1c0Zyb21CYWNrZ3JvdW5kKCkge1xuICBjb25zdCBzdGF0dXMgPSBhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiZ2V0U3luY1N0YXR1c1wiIH0pLmNhdGNoKCgpID0+IG51bGwpO1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBhcHBseVN5bmNTdGF0dXMoc3RhdHVzKTtcbn1cblxuLy8gTGF0ZXN0IHN0YXR1cyBzbmFwc2hvdCBcdTIwMTQga2VlcGluZyBpdCBsZXRzIHRoZSBsaXZlLWVsYXBzZWQgdGlja2VyXG4vLyByZXBhaW50IHRoZSBzYW1lIHByb2dyZXNzIHRleHQgd2l0aCBhbiB1cGRhdGVkIGBbTnNdYCBwcmVmaXggZXZlcnlcbi8vIHNlY29uZCB3aXRob3V0IHNwYW1taW5nIGNocm9tZS5zdG9yYWdlIGZyb20gdGhlIHNlcnZpY2Ugd29ya2VyLlxubGV0IF9sYXRlc3RTdGF0dXMgPSBudWxsO1xubGV0IF9lbGFwc2VkVGlja2VySWQgPSBudWxsO1xuXG5mdW5jdGlvbiBfZm10RWxhcHNlZChtcykge1xuICBpZiAobXMgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gMTAwMCl9c2A7XG4gIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gNjBfMDAwKX1tJHtNYXRoLnJvdW5kKChtcyAlIDYwXzAwMCkgLyAxMDAwKX1zYDtcbn1cblxuZnVuY3Rpb24gX3JlbmRlclN0YXR1cygpIHtcbiAgY29uc3Qgc3RhdHVzID0gX2xhdGVzdFN0YXR1cztcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgbGV0IHRleHQgPSBzdGF0dXMucHJvZ3Jlc3MgfHwgXCIoc3luYyBcdTkwMzJcdTg4NENcdTRFMkQpXCI7XG4gIGlmIChzdGF0dXMucnVubmluZyAmJiBzdGF0dXMuc3RhcnRlZCkge1xuICAgIGNvbnN0IGVsYXBzZWQgPSBEYXRlLm5vdygpIC0gc3RhdHVzLnN0YXJ0ZWQ7XG4gICAgdGV4dCA9IGBcdTIzRjEgJHtfZm10RWxhcHNlZChlbGFwc2VkKX0gXHUwMEI3ICR7dGV4dH1gO1xuICB9XG4gIGNvbnN0IGtpbmQgPSBzdGF0dXMucnVubmluZyA/IFwiaW5mb1wiIDogKHN0YXR1cy5waGFzZSA9PT0gXCJlcnJvclwiID8gXCJlcnJvclwiIDogXCJzdWNjZXNzXCIpO1xuICBjb25zdCBicmVha2Rvd24gPSBzdGF0dXMucnVubmluZyA/IG51bGwgOiBzdGF0dXMuYnJlYWtkb3duO1xuICBzZXRTdGF0dXModGV4dCwga2luZCwgYnJlYWtkb3duKTtcbn1cblxuZnVuY3Rpb24gYXBwbHlTeW5jU3RhdHVzKHN0YXR1cykge1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBfbGF0ZXN0U3RhdHVzID0gc3RhdHVzO1xuICBfcmVuZGVyU3RhdHVzKCk7XG4gIC8vIFN0YXR1cyBiYW5uZXIgbGl2ZXMgaW5zaWRlIHN0ZXAgMyBcdTIwMTQgZm9yY2UtanVtcCB0aGVyZSBzbyBpdCdzXG4gIC8vIGFjdHVhbGx5IHZpc2libGUuIFJ1bm5pbmcgc3luYyBPUiBhIGZyZXNoIGNvbXBsZXRpb24gYm90aCB3YXJyYW50XG4gIC8vIGJlaW5nIG9uIHRoZSByZXN1bHQgc3RlcC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCAmJiBfYWN0aXZlU3RlcCAhPT0gMykge1xuICAgIF9zZXRBY3RpdmVTdGVwKDMsIHsgc2lsZW50OiB0cnVlIH0pO1xuICB9XG4gIGlmIChzdGF0dXMucnVubmluZykge1xuICAgIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSBmYWxzZTtcbiAgICBpZiAoIV9lbGFwc2VkVGlja2VySWQpIHtcbiAgICAgIF9lbGFwc2VkVGlja2VySWQgPSBzZXRJbnRlcnZhbChfcmVuZGVyU3RhdHVzLCAxMDAwKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZWxzLnN0b3BCdG4uaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoX2VsYXBzZWRUaWNrZXJJZCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChfZWxhcHNlZFRpY2tlcklkKTtcbiAgICAgIF9lbGFwc2VkVGlja2VySWQgPSBudWxsO1xuICAgIH1cbiAgICAvLyBSZS1kZXJpdmUgc3luYyBidXR0b24gZW5hYmxlZCBzdGF0ZSBmcm9tIG1vZGUvY29ubi9OSEktdGFiIGluc3RlYWRcbiAgICAvLyBvZiB1bmNvbmRpdGlvbmFsbHkgZW5hYmxpbmcgXHUyMDE0IGtlZXBzIHRoZSBidXR0b24gZGlzYWJsZWQgd2hlbiB3ZVxuICAgIC8vIGtub3cgd2Ugc2hvdWxkbid0IHN5bmMgKGUuZy4gYmFja2VuZCBkb3duLCBvZmYtTkhJIHRhYikuXG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAvLyBTeW5jIGp1c3QgZmluaXNoZWQgXHUyMDE0IGJvdGggc2lkZXMgbWF5IGhhdmUgY2hhbmdlZCAoYmFja2VuZCBnb3RcbiAgICAvLyBuZXcgcmVzb3VyY2VzIGluIGJhY2tlbmQgbW9kZSwgbG9jYWwgYnVuZGxlIHdhcyBzdGFzaGVkIGluIGVpdGhlclxuICAgIC8vIG1vZGUpLiBSZWZyZXNoIGRhdGEtc3RhdGUgY2FyZCBzbyB0aGUgdXNlciBzZWVzIHVwLXRvLWRhdGUgY291bnRzLlxuICAgIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xuICAgIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBfY29ublN0YXRlID09PSBcIm9rXCIpIGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgfVxufVxuXG4vLyBTdG9wIHRoZSBpbi1wcm9ncmVzcyBzeW5jLiBUd28tcHJvbmdlZCBzbyBpdCB3b3JrcyBldmVuIHdoZW4gdGhlXG4vLyBzZXJ2aWNlIHdvcmtlciBoYXMgZGllZDogKDEpIHRlbGwgdGhlIFNXIHRvIHNldCBpdHMgY2FuY2VsIGZsYWcsXG4vLyAoMikgd3JpdGUgc3RvcmFnZSBkaXJlY3RseSB0byBydW5uaW5nOmZhbHNlIHNvIHRoZSBwb3B1cCBVSSB1bmZyZWV6ZXNcbi8vIGltbWVkaWF0ZWx5IGV2ZW4gaWYgdGhlIFNXIG1lc3NhZ2UgY2FuJ3QgYmUgZGVsaXZlcmVkLlxuYXN5bmMgZnVuY3Rpb24gc3RvcFN5bmMoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgc3luY1N0YXR1czoge1xuICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1MDVDXHU2QjYyXHU0RTJEXHVGRjBDXHU2QjYzXHU1NzI4XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5XHUyMDI2XCIsXG4gICAgICBwaGFzZTogXCJjYW5jZWxsZWRcIixcbiAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0pO1xuICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1MDVDXHU2QjYyXHU0RTJEXHVGRjBDXHU2QjYzXHU1NzI4XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcInN0b3BTeW5jXCIgfSkuY2F0Y2goKCkgPT4ge30pO1xuICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSB0cnVlO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xufVxuXG4vLyBMaXZlIHByb2dyZXNzIHVwZGF0ZXMgXHUyMDE0IGxpc3RlbiBvbiBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQgc28gd2UgZ2V0XG4vLyBldmVyeSB1cGRhdGUgdGhlIFNXIHdyaXRlcywgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoZSBTVydzIGJyb2FkY2FzdFxuLy8gc2VuZE1lc3NhZ2UgcmVhY2hlZCB1cy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIGNoYW5nZXMuc3luY1N0YXR1cykge1xuICAgIGFwcGx5U3luY1N0YXR1cyhjaGFuZ2VzLnN5bmNTdGF0dXMubmV3VmFsdWUpO1xuICB9XG59KTtcblxuLy8gKExlZ2FjeSBpbi1tZW1vcnkgYnJvYWRjYXN0IHN0aWxsIGxpc3RlbmVkIHRvIGFzIGEgYmFja3VwLilcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnKSA9PiB7XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3luY1Byb2dyZXNzXCIpIHtcbiAgICBhcHBseVN5bmNTdGF0dXMobXNnLnN0YXR1cyk7XG4gIH1cbn0pO1xuXG4vLyBQcmUtZmxpZ2h0IGRldGVjdGlvbiBmb3IgTkhJIGxvZ2luIHN0YXRlLiBUd28gc2lnbmFscyAoZWl0aGVyIHRyaWdnZXJzKTpcbi8vICAxLiBVUkwgaXMgaW4gTkhJIGF1dGggbmFtZXNwYWNlIChJSEtFMzA5OVN4eCkgXHUyMDE0IGxvZ2luIC8gSUMgY2FyZCBwYWdlc1xuLy8gIDIuIFBhZ2UgY29udGFpbnMgYSBwYXNzd29yZCBpbnB1dCBvciBrbm93biBsb2dnZWQtb3V0IHBocmFzZXNcbmFzeW5jIGZ1bmN0aW9uIGlzT25OaGlMb2dpblBhZ2UodGFiSWQsIHVybCkge1xuICBpZiAodXJsPy5wYXRobmFtZSAmJiAvSUhLRTMwOTkvLnRlc3QodXJsLnBhdGhuYW1lKSkgcmV0dXJuIHRydWU7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdJykpIHJldHVybiB0cnVlO1xuICAgICAgICBjb25zdCB0ZXh0ID0gKGRvY3VtZW50LmJvZHk/LmlubmVyVGV4dCB8fCBcIlwiKS50cmltKCk7XG4gICAgICAgIGNvbnN0IHBocmFzZXMgPSBbXG4gICAgICAgICAgXCJcdThBQ0JcdTRGN0ZcdTc1MjhcdTUwNjVcdTRGRERcdTUzNjFcIiwgXCJcdThBQ0JcdTYzRDJcdTUxNjVcdTUwNjVcdTRGRERcdTUzNjFcIiwgXCJcdThBQ0JcdTYzRDJcdTUxNjVcdTYwQThcdTc2ODRcdTUwNjVcdTRGRERcdTUzNjFcIixcbiAgICAgICAgICBcIlx1NzY3Qlx1NTE2NVx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QVwiLCBcIlx1NzY3Qlx1NTE2NVx1NTkzMVx1NjU1N1wiLCBcIlx1OEFDQlx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVwiLFxuICAgICAgICAgIFwiU2Vzc2lvbiBcdTVERjJcdTkwM0VcdTY2NDJcIiwgXCJzZXNzaW9uIFx1NURGMlx1OTAzRVx1NjY0MlwiLCBcIlx1NURGMlx1OTAzRVx1NjY0MlwiLFxuICAgICAgICAgIFwiXHU4QUNCXHU0RUU1XHU1MDY1XHU0RkREXHU1MzYxXHU3NjdCXHU1MTY1XCIsXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBwaHJhc2VzLnNvbWUoKHApID0+IHRleHQuaW5jbHVkZXMocCkpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBcdTI2QTEgTkhJIEFQSS1kaXJlY3Qgc3luYyBcdTIwMTQgcHJpbWFyeSBwYXRoLiBIaXRzIE5ISSdzIHVuZGVybHlpbmcgSlNPTlxuLy8gZW5kcG9pbnRzIGluIHBhcmFsbGVsIGFuZCBwb3N0cyBhZGFwdGVkIGl0ZW1zIHRvIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkLlxuLy8gUmVxdWlyZXMgcGF0aWVudF9vdmVycmlkZSB0byBiZSBmaWxsZWQuXG4vLyBDb252ZXJ0IGEgYmFja2VuZCBVUkwgXHUyMTkyIHRoZSBvcmlnaW4tcGF0dGVybiBDaHJvbWUgd2FudHMgZm9yIHBlcm1pc3Npb25cbi8vIHJlcXVlc3RzLiBcImh0dHA6Ly8xOTIuMTY4LjEuNTo4MDEwXCIgXHUyMTkyIFwiaHR0cDovLzE5Mi4xNjguMS41OjgwMTAvKlwiLlxuLy8gUmV0dXJucyBudWxsIHdoZW4gdGhlIFVSTCBpc24ndCBwYXJzZWFibGUgc28gdGhlIGNhbGxlciBjYW4gc2hvcnQtY2lyY3VpdC5cbmZ1bmN0aW9uIF9vcmlnaW5QYXR0ZXJuRm9yKHVybCkge1xuICB0cnkge1xuICAgIGNvbnN0IHUgPSBuZXcgVVJMKHVybCk7XG4gICAgcmV0dXJuIGAke3UucHJvdG9jb2x9Ly8ke3UuaG9zdH0vKmA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8vIEJhY2tlbmQtbW9kZSBwcmUtZmxpZ2h0OiBlbnN1cmUgdGhlIGV4dGVuc2lvbiBoYXMgaG9zdCBwZXJtaXNzaW9uIGZvclxuLy8gdGhlIHVzZXItY29uZmlndXJlZCBiYWNrZW5kIFVSTC4gTG9jYWxob3N0IC8gMTI3LjAuMC4xIGFyZSBjb3ZlcmVkIGJ5XG4vLyB0aGUgZGVmYXVsdCBtYW5pZmVzdCBob3N0X3Blcm1pc3Npb25zOyByZW1vdGUgLyBMQU4gLyBwcm9kdWN0aW9uIFVSTHNcbi8vIG5lZWQgYSBvbmUtdGltZSB1c2VyIGdyYW50LiBNdXN0IHJ1biBmcm9tIGEgdXNlciBnZXN0dXJlIChidXR0b24gY2xpY2spLlxuYXN5bmMgZnVuY3Rpb24gZW5zdXJlQmFja2VuZFBlcm1pc3Npb24oYmFja2VuZFVybCkge1xuICBjb25zdCBwYXR0ZXJuID0gX29yaWdpblBhdHRlcm5Gb3IoYmFja2VuZFVybCk7XG4gIGlmICghcGF0dGVybikgcmV0dXJuIHsgb2s6IGZhbHNlLCByZWFzb246IGBCYWNrZW5kIFVSTCBcdTcxMjFcdTZDRDVcdTg5RTNcdTY3OTA6ICR7YmFja2VuZFVybH1gIH07XG4gIGNvbnN0IGFscmVhZHkgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMuY29udGFpbnMoeyBvcmlnaW5zOiBbcGF0dGVybl0gfSk7XG4gIGlmIChhbHJlYWR5KSByZXR1cm4geyBvazogdHJ1ZSB9O1xuICBsZXQgZ3JhbnRlZDtcbiAgdHJ5IHtcbiAgICBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLnJlcXVlc3QoeyBvcmlnaW5zOiBbcGF0dGVybl0gfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIHJlYXNvbjogYFx1NkIwQVx1OTY1MFx1OEFDQlx1NkM0Mlx1NTkzMVx1NjU1NzogJHtlLm1lc3NhZ2V9YCB9O1xuICB9XG4gIHJldHVybiBncmFudGVkXG4gICAgPyB7IG9rOiB0cnVlIH1cbiAgICA6IHsgb2s6IGZhbHNlLCByZWFzb246IGBcdTY3MkFcdTYzODhcdTZCMEFcdTkwMjNcdTdEREFcdTUyMzAgJHtwYXR0ZXJufSBcdTIwMTQgXHU1M0Q2XHU2RDg4YCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBhcGlTeW5jTmhpKCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoIW92KSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NTZERSBcdTI0NjEgXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XHVGRjFBXHU4QUNCXHU5MDc4XHU2NEM3XHU2MDI3XHU1MjI1XHUzMDAxXHU1ODZCXHU3NTFGXHU2NUU1XHU1RjhDXHU2MzA5XHU3OEJBXHU1QjlBXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUHJlLWZsaWdodDogY2hlY2sgd2UncmUgb24gYW4gTkhJIHRhYiBzbyBjb29raWVzIGFyZSB1c2FibGUgZnJvbSBTVy5cbiAgY29uc3QgdGFiID0gYXdhaXQgZ2V0QWN0aXZlVGFiKCk7XG4gIGxldCB1cmw7XG4gIHRyeSB7IHVybCA9IG5ldyBVUkwodGFiLnVybCk7IH0gY2F0Y2ggeyBzZXRTdGF0dXMoXCJhY3RpdmUgdGFiIGhhcyBubyBVUkxcIiwgXCJlcnJvclwiKTsgcmV0dXJuOyB9XG4gIGNvbnN0IG9uTG9naW4gPSBhd2FpdCBpc09uTmhpTG9naW5QYWdlKHRhYi5pZCwgdXJsKTtcbiAgaWYgKG9uTG9naW4pIHtcbiAgICBzZXRTdGF0dXMoXCJcdUQ4M0RcdUREMTIgXHU1NkRFIFx1MjQ2MCBcdTc2N0JcdTUxNjVcdUZGMUFcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBCYWNrZW5kIG1vZGU6IHJlLXZlcmlmeSBjb25uZWN0aXZpdHkgcmlnaHQgaGVyZSBldmVuIGlmIHRoZSBiYW5uZXJcbiAgLy8gbGFzdCBzYWlkIG9rLiBCZXR3ZWVuIHRoZSBwcmV2aW91cyBjaGVjayBhbmQgdGhpcyBjbGljayB0aGUgdXNlclxuICAvLyBtYXkgaGF2ZSBzdG9wcGVkIGRvY2tlcjsgd2l0aG91dCBhIGZyZXNoIHByb2JlIHdlJ2Qgc3RhcnQgYW4gdXBsb2FkXG4gIC8vIHRoYXQgZmFpbHMgbWlkLWZsaWdodCBhZnRlciBwYXJ0aWFsIGRhdGEgaGFzIGhpdCAob3IgZmFpbGVkIHRvIGhpdClcbiAgLy8gdGhlIGJhY2tlbmQuIENoZWFwIChcdTIyNjQ1cykgYW5kIHNhdmVzIGEgbG90IG9mIGNvbmZ1c2lvbi5cbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgY29uc3Qgb2sgPSBhd2FpdCB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgICBpZiAoIW9rKSB7XG4gICAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1RjhDXHU3QUVGXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3IFx1MjAxNCBcdThBQ0JcdTc3MEJcdTk4MDJcdTkwRTggYmFubmVyIFx1NzY4NFx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgIHJ1bm5pbmc6IHRydWUsXG4gICAgICBwcm9ncmVzczogXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsXG4gICAgICBwaGFzZTogXCJzdGFydGluZ1wiLCBzdGFydGVkOiBEYXRlLm5vdygpLCB0czogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9KTtcbiAgc2V0U3RhdHVzKFwiXHVEODNEXHVERTgwIFx1OTU4Qlx1NTlDQlx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MjAyNlwiLCBcImluZm9cIik7XG5cbiAgLy8gQ29tcHV0ZSBkYXRlIHJhbmdlIGZyb20gdGhlIGRyb3Bkb3duLiBcIjFcIiA9IE5ISSdzIGRlZmF1bHQgd2luZG93O1xuICAvLyBhbnl0aGluZyBlbHNlIGlzIFwidG9kYXkgYmFjayBOIHllYXJzXCIuIEhlbHBlciBpbnNpZGUgYmFja2dyb3VuZC5qc1xuICAvLyBjb252ZXJ0cyB0byBcdTZDMTFcdTU3MEIgZm9yIE5ISSdzIEFQSS5cbiAgY29uc3QgcmFuZ2VTZWwgPSBlbHMuYXBpU3luY1JhbmdlPy52YWx1ZSB8fCBcIjNcIjtcbiAgbGV0IGRhdGVSYW5nZSA9IG51bGw7XG4gIGNvbnN0IFJBTkdFX0xBQkVMUyA9IHtcbiAgICBcIjFcIjogICBcIlx1NjcwMFx1OEZEMSAxIFx1NUU3NFwiLFxuICAgIFwiM1wiOiAgIFwiXHU2NzAwXHU4RkQxIDMgXHU1RTc0XCIsXG4gICAgXCI1XCI6ICAgXCJcdTY3MDBcdThGRDEgNSBcdTVFNzRcIixcbiAgICBcIjEwXCI6ICBcIlx1NjcwMFx1OEZEMSAxMCBcdTVFNzRcIixcbiAgICBcImFsbFwiOiBcIlx1NTE2OFx1OTBFOFx1NkI3N1x1NTNGMlx1N0QwMFx1OTMwNFwiLFxuICB9O1xuICBjb25zdCBkYXRlUmFuZ2VMYWJlbCA9IFJBTkdFX0xBQkVMU1tyYW5nZVNlbF0gfHwgYFx1NjcwMFx1OEZEMSAke3JhbmdlU2VsfSBcdTVFNzRgO1xuICBpZiAocmFuZ2VTZWwgIT09IFwiMVwiKSB7XG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGVuZCA9IHRvZGF5LnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgIGxldCBzdGFydDtcbiAgICBpZiAocmFuZ2VTZWwgPT09IFwiYWxsXCIpIHtcbiAgICAgIHN0YXJ0ID0gXCIyMDAxLTAxLTAxXCI7ICAvLyBcdTZDMTFcdTU3MEIgOTAgXHUyMDE0IGZhciBlbm91Z2ggYmFjayBmb3IgYW55IGNsaW5pY2FsIGNhc2VcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeWVhcnMgPSBwYXJzZUludChyYW5nZVNlbCwgMTApO1xuICAgICAgY29uc3QgcyA9IG5ldyBEYXRlKHRvZGF5KTtcbiAgICAgIHMuc2V0RnVsbFllYXIocy5nZXRGdWxsWWVhcigpIC0geWVhcnMpO1xuICAgICAgc3RhcnQgPSBzLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgIH1cbiAgICBkYXRlUmFuZ2UgPSB7IHN0YXJ0LCBlbmQgfTtcbiAgfVxuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcInN0YXJ0TmhpQXBpU3luY1wiLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIHRhYklkOiB0YWIuaWQsXG4gICAgICBtb2RlOiBjdXJyZW50TW9kZSgpLFxuICAgICAgYmFja2VuZDogZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLFxuICAgICAgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpLFxuICAgICAgbmhpQmFzZTogXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3XCIsXG4gICAgICBwYXRpZW50T3ZlcnJpZGU6IG92LFxuICAgICAgZGF0ZVJhbmdlLFxuICAgICAgZGF0ZVJhbmdlTGFiZWwsXG4gICAgfSxcbiAgfSkuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsYXVuY2goKSB7XG4gIGNvbnN0IGJhY2tlbmQgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGNvbnN0IHJhd0lkID0gb3Y/LmlkX25vO1xuICBjb25zdCBzbWFydEFwcExhdW5jaCA9IGVscy5zbWFydEFwcFVybC52YWx1ZS50cmltKCkgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBpZiAoIXJhd0lkKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1OTA4NFx1NkM5Mlx1NjcwOVx1NzVDNVx1NEVCQVx1OEVBQlx1NTIwNlx1OEI0OSBcdTIwMTQgXHU4QUNCXHU1MTQ4XHU2MzA5XHUzMDBDXHVEODNEXHVERDA0IFx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MzAwRFx1NjI5M1x1NEUwMFx1NkIyMVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBCYWNrZW5kIHRyYWNrcyBQYXRpZW50IHVuZGVyIGl0cyBoYXNoZWQgRkhJUiBpZCwgbm90IHRoZSByYXcgbmF0aW9uYWwgSUQuXG4gIGNvbnN0IHBhdGllbnRJZCA9IGRlcml2ZVBhdGllbnRJZChyYXdJZCk7XG4gIC8vIFJlLXRlc3QgY29ubmVjdGlvbiBldmVuIGlmIGJhbm5lciBzaG93cyBvayBcdTIwMTQgYmFja2VuZCBtYXkgaGF2ZSBnb25lXG4gIC8vIGRvd24gc2luY2UgdGhlIGxhc3QgcHJvYmUuXG4gIGNvbnN0IG9rID0gYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIGlmICghb2spIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1RjhDXHU3QUVGXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3IFx1MjAxNCBcdThBQ0JcdTc3MEJcdTk4MDJcdTkwRTggYmFubmVyIFx1NzY4NFx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZXRTdGF0dXMoXCJcdTVFRkFcdTdBQ0IgbGF1bmNoIGNvbnRleHRcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3NtYXJ0L2xhdW5jaC1jb250ZXh0YCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGF0aWVudF9pZDogcGF0aWVudElkIH0pLFxuICAgIH0pO1xuICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYCR7cmVzLnN0YXR1c306ICR7YXdhaXQgcmVzLnRleHQoKX1gKTtcbiAgICBjb25zdCB7IGxhdW5jaCB9ID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHsgaXNzOiBgJHtiYWNrZW5kfS9maGlyYCwgbGF1bmNoIH0pO1xuICAgIC8vIEFwcGVuZCBpc3MgKyBsYXVuY2ggcGFyYW1zLCByZXNwZWN0aW5nIGFueSBleGlzdGluZyBxdWVyeSBzdHJpbmcuXG4gICAgY29uc3Qgc2VwID0gc21hcnRBcHBMYXVuY2guaW5jbHVkZXMoXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGAke3NtYXJ0QXBwTGF1bmNofSR7c2VwfSR7cGFyYW1zfWAgfSk7XG4gICAgd2luZG93LmNsb3NlKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1Mjc0QyBMYXVuY2ggXHU1OTMxXHU2NTU3XHVGRjFBJHtlLm1lc3NhZ2V9YCwgXCJlcnJvclwiKTtcbiAgfVxufVxuXG5lbHMuc3luY0FwaUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXBpU3luY05oaSk7XG5lbHMuc3RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RvcFN5bmMpO1xuZWxzLm92U2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2F2ZVBhdGllbnRPdmVycmlkZSk7XG5lbHMub3ZDbGVhckJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJQYXRpZW50T3ZlcnJpZGUpO1xuW2Vscy5vdklkTm8sIGVscy5vdk5hbWUsIGVscy5vdkJpcnRoRGF0ZSwgZWxzLm92R2VuZGVyXS5mb3JFYWNoKChlbCkgPT5cbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkpXG4pO1xuZWxzLmxhdW5jaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGF1bmNoKTtcbmluaXQoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBU0EsT0FBQyxXQUFXO0FBQ1Y7QUFFQSxZQUFJLGNBQWM7QUFDbEIsWUFBSSxpQkFBaUI7QUFDckIsWUFBSSxTQUFTLE9BQU8sV0FBVztBQUMvQixZQUFJLE9BQU8sU0FBUyxTQUFTLENBQUM7QUFDOUIsWUFBSSxLQUFLLG1CQUFtQjtBQUMxQixtQkFBUztBQUFBLFFBQ1g7QUFDQSxZQUFJLGFBQWEsQ0FBQyxVQUFVLE9BQU8sU0FBUztBQUM1QyxZQUFJLFVBQVUsQ0FBQyxLQUFLLHNCQUFzQixPQUFPLFlBQVksWUFBWSxRQUFRLFlBQVksUUFBUSxTQUFTO0FBQzlHLFlBQUksU0FBUztBQUNYLGlCQUFPO0FBQUEsUUFDVCxXQUFXLFlBQVk7QUFDckIsaUJBQU87QUFBQSxRQUNUO0FBQ0EsWUFBSSxZQUFZLENBQUMs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LEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUk7QUFBQSxRQUMzRDtBQUVBLGFBQUssVUFBVSxXQUFXLEtBQUssVUFBVTtBQUV6QyxhQUFLLFVBQVUsU0FBUyxXQUFZO0FBQ2xDLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLO0FBRXRFLGlCQUFPO0FBQUEsWUFDSixPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxJQUFLO0FBQUEsWUFBTSxLQUFLO0FBQUEsWUFDL0QsT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sSUFBSztBQUFBLFlBQU0sS0FBSztBQUFBLFlBQy9ELE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxLQUFNO0FB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QUksWUFBWSxNQUFNLEtBQUssS0FBSztBQUN2RCxRQUFJLENBQUMsT0FBTztBQUNWLGdCQUFVLDZLQUFvQyxPQUFPO0FBQ3JEO0FBQUEsSUFDRjtBQUVBLFVBQU0sWUFBWSxnQkFBZ0IsS0FBSztBQUd2QyxVQUFNLEtBQUssTUFBTSxzQkFBc0I7QUFDdkMsUUFBSSxDQUFDLElBQUk7QUFDUCxnQkFBVSx5R0FBOEIsT0FBTztBQUMvQztBQUFBLElBQ0Y7QUFDQSxjQUFVLHFDQUFzQixNQUFNO0FBQ3RDLFFBQUk7QUFDRixZQUFNLE1BQU0sTUFBTSxNQUFNLEdBQUcsT0FBTyx5QkFBeUI7QUFBQSxRQUN6RCxRQUFRO0FBQUEsUUFDUixTQUFTLEVBQUUsZ0JBQWdCLG1CQUFtQjtBQUFBLFFBQzlDLE1BQU0sS0FBSyxVQUFVLEVBQUUsWUFBWSxVQUFVLENBQUM7QUFBQSxNQUNoRCxDQUFDO0FBQ0QsVUFBSSxDQUFDLElBQUksR0FBSSxPQUFNLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsRUFBRTtBQUNqRSxZQUFNLEVBQUUsUUFBQUMsUUFBTyxJQUFJLE1BQU0sSUFBSSxLQUFLO0FBQ2xDLFlBQU0sU0FBUyxJQUFJLGdCQUFnQixFQUFFLEtBQUssR0FBRyxPQUFPLFNBQVMsUUFBQUEsUUFBTyxDQUFDO0FBRXJFLFlBQU0sTUFBTSxlQUFlLFNBQVMsR0FBRyxJQUFJLE1BQU07QUFDakQsYUFBTyxLQUFLLE9BQU8sRUFBRSxLQUFLLEdBQUcsY0FBYyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQztBQUM5RCxhQUFPLE1BQU07QUFBQSxJQUNmLFNBQVMsR0FBRztBQUNWLGdCQUFVLG1DQUFlLEVBQUUsT0FBTyxJQUFJLE9BQU87QUFBQSxJQUMvQztBQUFBLEVBQ0Y7QUFFQSxNQUFJLFdBQVcsaUJBQWlCLFNBQVMsVUFBVTtBQUNuRCxNQUFJLFFBQVEsaUJBQWlCLFNBQVMsUUFBUTtBQUM5QyxNQUFJLFVBQVUsaUJBQWlCLFNBQVMsbUJBQW1CO0FBQzNELE1BQUksV0FBVyxpQkFBaUIsU0FBUyxvQkFBb0I7QUFDN0QsR0FBQyxJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUksYUFBYSxJQUFJLFFBQVEsRUFBRTtBQUFBLElBQVEsQ0FBQyxPQUMvRCxHQUFHLGlCQUFpQixTQUFTLHNCQUFzQjtBQUFBLEVBQ3JEO0FBQ0EsTUFBSSxVQUFVLGlCQUFpQixTQUFTLE1BQU07QUFDOUMsT0FBSzsiLAogICJuYW1lcyI6IFsiY3J5cHRvIiwgIkJ1ZmZlciIsICJibG9ja3MiLCAiZXhwb3J0cyIsICJsYXVuY2giXQp9Cg==
