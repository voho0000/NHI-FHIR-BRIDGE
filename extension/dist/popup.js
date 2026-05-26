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
  var STANDALONE_SMART_APP_URL = "https://voho0000.github.io/medical-note-smart-on-fhir/";
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
    openSmartAppBtn: document.getElementById("open-smart-app-btn"),
    openSettingsBtn: document.getElementById("open-settings-btn"),
    settingsBackBtn: document.getElementById("settings-back-btn"),
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
      await chrome.storage.session.remove(PENDING_BUNDLE_KEY).catch(() => {
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
    unknown: "\u5C1A\u672A\u6AA2\u67E5",
    checking: "\u78BA\u8A8D\u4E2D\u2026",
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
    return n === 1 ? "\u2460" : n === 2 ? "\u2461" : n === 3 ? "\u2462" : "\u2463";
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
        return !!els.pendingBundle && !els.pendingBundle.hidden;
      case 4:
        return false;
      default:
        return false;
    }
  }
  function _setActiveStep(n, opts = {}) {
    const clamped = Math.max(1, Math.min(4, n));
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
    let start;
    if (!_isStepDone(1)) start = 1;
    else if (!_isStepDone(2)) start = 2;
    else if (!_isStepDone(3)) start = 3;
    else start = 4;
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
    if (els.stopBtn) els.stopBtn.hidden = !syncRunning;
    const ov = getPatientOverride();
    const haveBackendPatient = _backendPatient.state === "present";
    els.launchBtn.disabled = !(currentMode() === "backend" && _connState === "ok" && !!ov?.id_no && haveBackendPatient);
    els.launchBtn.title = currentMode() !== "backend" ? "\u8ACB\u5207\u5230\u300C\u{1F3E5} \u672C\u6A5F\u4F3A\u670D\u5668 (\u9032\u968E)\u300D\u6A21\u5F0F" : _connState !== "ok" ? "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA" : !ov?.id_no ? "\u8ACB\u56DE\u5230\u300C\u2461 \u60A8\u7684\u8CC7\u6599\u300D\u586B\u5BEB\u8CC7\u6599" : !haveBackendPatient ? "\u672C\u6A5F\u4F3A\u670D\u5668\u9084\u6C92\u6709\u9019\u4F4D\u7684\u8CC7\u6599 \u2014 \u5148\u6309\u300C\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u6216\u4E0B\u65B9\u300C\u628A\u9019\u6B21\u8CC7\u6599\u50B3\u5230\u672C\u6A5F\u4F3A\u670D\u5668\u300D" : "";
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
        bs.textContent = "\u26A0 \u672C\u6A5F\u4F3A\u670D\u5668\u9084\u6C92\u6709\u9019\u4F4D\u7684\u8CC7\u6599";
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
        bs.textContent = "\u2717 \u78BA\u8A8D\u5931\u6557\uFF08\u8ACB\u770B\u4E0A\u65B9\u63D0\u793A\uFF09";
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
    els.pushLocalBtn.textContent = "\u628A\u9019\u6B21\u8CC7\u6599\u50B3\u5230\u672C\u6A5F\u4F3A\u670D\u5668";
  }
  async function _refreshLocalBundleState() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.session.get(PENDING_BUNDLE_KEY);
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
    els.pushLocalBtn.textContent = "\u50B3\u9001\u4E2D\u2026";
    try {
      const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.session.get(PENDING_BUNDLE_KEY);
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
    if (area === "session" && PENDING_BUNDLE_KEY in changes) _refreshLocalBundleState();
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
    const header = document.createElement("div");
    header.className = "status-header";
    const textSpan = document.createElement("span");
    textSpan.className = "status-text";
    textSpan.textContent = text || "";
    header.appendChild(textSpan);
    const running = _latestStatus?.running === true;
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
        _latestStatus = null;
        setStatus("", null);
      });
      header.appendChild(dismissBtn);
    }
    els.status.appendChild(header);
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
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.session.get(PENDING_BUNDLE_KEY);
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
  async function _transitionStatusToDownloaded(bytes) {
    try {
      const { syncStatus } = await chrome.storage.local.get("syncStatus");
      if (!syncStatus || syncStatus.phase === "downloaded") return;
      const total = syncStatus.totalResources ?? 0;
      const sizeStr = bytes ? ` \xB7 ${_fmtBytes(bytes)}` : "";
      const next = {
        ...syncStatus,
        progress: `\u2705 \u5DF2\u4E0B\u8F09\u5065\u5EB7\u7D00\u9304\u6A94\uFF08\u5171 ${total} \u7B46${sizeStr}\uFF09\u2014 \u63A5\u8457\u81F3 \u2463 \u67E5\u770B \u958B\u555F\u300C\u91AB\u6790 MediPrisma\u300D\u700F\u89BD\u8CC7\u6599\u3002`,
        phase: "downloaded",
        ts: Date.now()
      };
      await chrome.storage.local.set({ syncStatus: next });
    } catch {
    }
  }
  async function downloadPendingBundle() {
    const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.session.get(PENDING_BUNDLE_KEY);
    if (!pending) return;
    const blob = new Blob([pending.json], { type: "application/fhir+json" });
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
      if (delta.id !== downloadId) return;
      const final = delta.state?.current;
      if (final === "complete") {
        chrome.storage.session.remove(PENDING_BUNDLE_KEY).catch(() => {
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
    await chrome.storage.session.remove(PENDING_BUNDLE_KEY);
    await refreshPendingBundle();
    _latestStatus = null;
    setStatus("", null);
    await chrome.runtime.sendMessage({ type: "clearSyncStatus" }).catch(() => {
    });
  }
  els.downloadBundleBtn.addEventListener("click", downloadPendingBundle);
  els.clearBundleBtn.addEventListener("click", clearPendingBundle);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "session" && PENDING_BUNDLE_KEY in changes) refreshPendingBundle();
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
  chrome.runtime.onMessage.addListener((msg, sender) => {
    if (sender?.id && sender.id !== chrome.runtime.id) return;
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
      setStatus("\u9084\u6C92\u6709\u8EAB\u5206\u8CC7\u6599 \u2014 \u8ACB\u5148\u6309\u300C\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D\u4E00\u6B21", "error");
      return;
    }
    const patientId = derivePatientId(rawId);
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
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      const { launch: launch2 } = await res.json();
      const params = new URLSearchParams({ iss: `${backend}/fhir`, launch: launch2 });
      const sep = smartAppLaunch.includes("?") ? "&" : "?";
      chrome.tabs.create({ url: `${smartAppLaunch}${sep}${params}` });
      window.close();
    } catch (e) {
      setStatus(`\u274C \u958B\u555F\u91AB\u6790\u5931\u6557\uFF1A${e.message}`, "error");
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
  els.openSmartAppBtn?.addEventListener("click", () => {
    chrome.tabs.create({ url: STANDALONE_SMART_APP_URL });
  });
  function _openSettingsView() {
    document.body.dataset.view = "settings";
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function _closeSettingsView() {
    delete document.body.dataset.view;
    _refreshWizardUi();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  els.openSettingsBtn?.addEventListener("click", _openSettingsView);
  els.settingsBackBtn?.addEventListener("click", _closeSettingsView);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBPTkxZIGFcbiAqIGhhc2hlZCBQYXRpZW50LmlkIChlLmcuIHZpYSBhbiBIVFRQIGFjY2VzcyBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGVcbiAqIH4zME0gVGFpd2FuZXNlIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdFxuICogdGhpcyBiZWNhdXNlIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3XG4gKiBuYXRpb25hbCBJRCBpbiBhbnkgbGVha2VkIEJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBCdW5kbGUtbGVha1xuICogc2NlbmFyaW9zIGRpc2Nsb3NlIGJvdGggZmllbGRzIHRvZ2V0aGVyLCBzbyBhIHNhbHQgd291bGQgbm90IG1vdmVcbiAqIHRoZSBuZWVkbGUgdGhlcmUuIFRoZSByZW1haW5pbmcgc2luZ2xlLWZpZWxkIGxlYWsgdmVjdG9yIGlzIEhUVFBcbiAqIGFjY2VzcyBsb2dzOyBkZXBsb3ltZW50cyBzaG91bGQgc2NydWIgYC9maGlyL1BhdGllbnQvW14vXStgIHBhdGhzXG4gKiBhbmQgYD9wYXRpZW50PWAgcXVlcnkgc3RyaW5ncyBhdCB0aGUgcmV2ZXJzZS1wcm94eSBsYXllciAoc2VlXG4gKiBBUkNISVRFQ1RVUkUubWQgXHUwMEE3XCJQYXRpZW50LmlkIFx1NTNDRFx1NjNBOFx1OThBOFx1OTZBQVx1ODIwN1x1N0RFOVx1ODlFM1wiKS5cbiAqXG4gKiBVc2VzIGBqcy1zaGExYCAocHVyZSBKUykgaW5zdGVhZCBvZiBgbm9kZTpjcnlwdG9gIHNvIHRoZSBzYW1lIG1hcHBlclxuICogY29kZSBydW5zIHVubW9kaWZpZWQgaW4gdGhlIENocm9tZSBleHRlbnNpb24ncyBsb2NhbC1vbmx5IG1vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVJZChwYXRpZW50SWQ6IHN0cmluZywgLi4ucGFydHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW3BhdGllbnRJZCwgLi4ucGFydHNdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogTWFwIGEgcmF3IG5hdGlvbmFsIElEIChvciBhbnkgcGF0aWVudCBpZGVudGlmaWVyKSB0byBpdHMgMzItY2hhciBoZXhcbiAqIEZISVIgYFBhdGllbnQuaWRgLiBUaGUgcmF3IHZhbHVlIGlzIGtlcHQgaW4gYFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlYFxuICogXHUyMDE0IG9ubHkgdGhlIEZISVIgbG9naWNhbCBpZCBpcyBoYXNoZWQgc28gaXQgZG9lc24ndCBsZWFrIGludG8gVVJMcyxcbiAqIHN1YmplY3QucmVmZXJlbmNlIGZpZWxkcywgYXVkaXQgbG9ncywgb3IgU01BUlQgdG9rZW4gcGF5bG9hZHMuXG4gKlxuICogRkhJUiBSNCBcdTAwQTcyLjIwIHNheXMgXCJsb2dpY2FsIGlkIFx1MjAyNiBTSE9VTEQgTk9UIGNvbnRhaW4gaWRlbnRpZnlpbmdcbiAqIGluZm9ybWF0aW9uXCIgXHUyMDE0IHRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVQYXRpZW50SWQobmF0aW9uYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW1wicGF0aWVudFwiLCBuYXRpb25hbElkXS5qb2luKFwifFwiKSkuc2xpY2UoMCwgMzIpO1xufVxuXG4vKipcbiAqIFBhcnRpYWxseS1hbm9ueW1pemUgYSBwYXRpZW50IG5hbWUuIEFwcGxpZWQgaW4gbWFwUGF0aWVudCBzbyBldmVyeVxuICogRkhJUiByZXNvdXJjZSB0aGF0IGZsb3dzIG91dCBvZiB0aGlzIGNvZGViYXNlIChkb3dubG9hZGVkIEJ1bmRsZSxcbiAqIGJhY2tlbmQgRkhJUiBzdG9yZSwgZGFzaGJvYXJkLCBTTUFSVCBhcHAgbGF1bmNoZXMpIHNlZXMgdGhlIG1hc2tlZFxuICogZm9ybS4gVGhlIHVzZXIncyByYXcgaW5wdXQgaXMgc3RpbGwga2VwdCBpbiBjaHJvbWUuc3RvcmFnZSBzbyB0aGV5XG4gKiBjYW4gcmV2aWV3IHdoYXQgd2FzIGVudGVyZWQsIGJ1dCBpdCBuZXZlciBsZWF2ZXMgUGF0aWVudCBjb250ZXh0LlxuICpcbiAqIFJ1bGVzIChUYWl3YW4gLyBDSksgY29udmVudGlvbik6XG4gKiAgIC0gMSBjaGFyICAgICBcdTIxOTIga2VlcCBhcy1pcyAobm90aGluZyB0byBtYXNrKVxuICogICAtIDIgY2hhcnMgICAgXHUyMTkyIGtlZXAgZmlyc3QsIHJlcGxhY2Ugc2Vjb25kIHdpdGggTyAgICBcdTczOEJcdTY2MEUgXHUyMTkyIFx1NzM4Qk9cbiAqICAgLSAzKyBjaGFycyAgIFx1MjE5MiBrZWVwIGZpcnN0ICsgbGFzdCwgbWlkZGxlIGFsbCBPICAgICAgXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTY3OTdcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1Njc5N09PXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTRFMkRcdTVDRjZcdTUwNjVcdTZCMjFcdTkwQ0UgXHUyMTkyIFx1NEUyRE9PT1x1OTBDRVxuICpcbiAqIFdlc3Rlcm4gbmFtZXMgKGNvbnRhaW4gd2hpdGVzcGFjZSk6IHNwbGl0IG9uIHNwYWNlLCBrZWVwIGZpcnN0ICtcbiAqIGxhc3QgdG9rZW5zLCBwYXJ0aWFsLW1hc2sgdGhlIGxhc3QgYW5kIG1pZGRsZTpcbiAqICAgSm9obiBTbWl0aCBcdTIxOTIgSm9obiBTKioqXG4gKiAgIEpvaG4gUSBTbWl0aCBcdTIxOTIgSm9obiAqKiogU21pdGhcbiAqL1xuLyoqXG4gKiBIYWxmLW1hc2sgYSBUYWl3YW4gbmF0aW9uYWwgSUQgZm9yIHNob3VsZGVyLXN1cmZpbmctc2FmZSBkaXNwbGF5LlxuICogTWF0Y2hlcyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBJ3Mgb3duIGBoaWRgIGNvbnZlbnRpb24gKGZpcnN0IDYgdmlzaWJsZSwgbGFzdFxuICogNCBoaWRkZW4pOiBgUDEyMzQ1MDg2NmAgXHUyMTkyIGBQMTIzNDUqKioqYC5cbiAqXG4gKiBgY2hhcmAgZGVmYXVsdHMgdG8gYCpgIGZvciBwb3B1cC90b2FzdCBkaXNwbGF5LiBVc2UgYFhgIGZvciBmaWxlbmFtZXNcbiAqIHNpbmNlIGAqYCBpcyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIFRoZSBhdXRvLWdlbmVyYXRlZFxuICogYGF1dG8tWFhYWFhYWFhgIHBsYWNlaG9sZGVycyBmbG93IHRocm91Z2ggdW5jaGFuZ2VkIChhbHJlYWR5XG4gKiBub24taWRlbnRpZnlpbmcpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFza0lkKGlkOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjaGFyID0gXCIqXCIpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKGlkID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gcztcbiAgaWYgKC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChzKSkgcmV0dXJuIHMuc2xpY2UoMCwgNikgKyBjaGFyLnJlcGVhdCg0KTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gcztcbiAgaWYgKHMubGVuZ3RoID4gNikgcmV0dXJuIHMuc2xpY2UoMCwgMikgKyBjaGFyLnJlcGVhdChzLmxlbmd0aCAtIDQpICsgcy5zbGljZSgtMik7XG4gIHJldHVybiBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFza05hbWUobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSAobmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghdHJpbW1lZCB8fCB0cmltbWVkID09PSBcIlVua25vd25cIikgcmV0dXJuIHRyaW1tZWQ7XG5cbiAgaWYgKC9cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoL1xccysvKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSByZXR1cm4gcGFydHNbMF0hO1xuICAgIGNvbnN0IGZpcnN0ID0gcGFydHNbMF0hO1xuICAgIGNvbnN0IGxhc3QgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSE7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gRml4ZWQgMyBzdGFycyByZWdhcmRsZXNzIG9mIG9yaWdpbmFsIGxlbmd0aCBcdTIwMTQgZG9uJ3QgbGVhayBob3dcbiAgICAgIC8vIGxvbmcgdGhlIHN1cm5hbWUgd2FzIHZpYSBtYXNrIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxhc3RNYXNrZWQgPSBsYXN0Lmxlbmd0aCA8PSAxID8gbGFzdCA6IGAke2xhc3RbMF19KioqYDtcbiAgICAgIHJldHVybiBgJHtmaXJzdH0gJHtsYXN0TWFza2VkfWA7XG4gICAgfVxuICAgIGNvbnN0IG1pZGRsZXMgPSBwYXJ0cy5zbGljZSgxLCAtMSkubWFwKCgpID0+IFwiKioqXCIpO1xuICAgIHJldHVybiBbZmlyc3QsIC4uLm1pZGRsZXMsIGxhc3RdLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgLy8gQ0pLIC8gc2luZ2xlLXRva2VuIHBhdGguIEl0ZXJhdGUgY29kZXBvaW50cyAobm90IFVURi0xNiB1bml0cykgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyBjYW4ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKHRyaW1tZWQpO1xuICBpZiAoY2hhcnMubGVuZ3RoIDw9IDEpIHJldHVybiB0cmltbWVkO1xuICBpZiAoY2hhcnMubGVuZ3RoID09PSAyKSByZXR1cm4gYCR7Y2hhcnNbMF19T2A7XG4gIHJldHVybiBjaGFyc1swXSArIFwiT1wiLnJlcGVhdChjaGFycy5sZW5ndGggLSAyKSArIGNoYXJzW2NoYXJzLmxlbmd0aCAtIDFdO1xufVxuIiwgIi8qKlxuICogT2JzZXJ2YXRpb24gbWFwcGVyIFx1MjAxNCBzaW5nbGUtcm93IGFuZCBwYW5lbC1ncm91cGVkIHZhcmlhbnRzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9vYnNlcnZhdGlvbi5weWAgKDEyMTIgbGluZXMpLiBJbmNsdWRlczpcbiAqICAgLSBtYXBPYnNlcnZhdGlvbihyYXcsIHBhdGllbnRJZCkgXHUyMTkyIHNpbmdsZSBPYnNlcnZhdGlvblxuICogICAtIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQoaXRlbXMsIHBhdGllbnRJZCkgXHUyMTkyIERpYWdub3N0aWNSZXBvcnQgKyBPYnNlcnZhdGlvbnNcbiAqICAgLSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgXHUyMDE0IGNyb3NzLXBhZ2UgZGVkdXAga2V5XG4gKiAgIC0gZmluZExvaW5jLCBidWlsZENvZGluZ3MsIG1hcEludGVycHJldGF0aW9uLCBkZXJpdmVJbnRlcnByZXRhdGlvblxuICogICAtIGRlZHVwZUNyb3NzRm9ybWF0LCBjb21iaW5lQnBJdGVtcywgZ3JvdXBCeU9yZGVyQ29kZVxuICogICAtIGluZmVyU3BlY2ltZW5cbiAqXG4gKiBGdW5jdGlvbmFsIHBhcml0eSB3aXRoIHRoZSBQeXRob24gaW1wbGVtZW50YXRpb24gaXMgdGhlIGdvYWwuIEZpZWxkXG4gKiBvcmRlciBpbiB0aGUgZW1pdHRlZCByZXNvdXJjZXMgbWF5IGRpZmZlciAoSlMgb2JqZWN0IGxpdGVyYWwgb3JkZXIpXG4gKiBidXQgY29udGVudCBpcyBpZGVudGljYWwuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB7XG4gIERJU1BMQVlfRklSU1RfQ09ERVMsXG4gIExPSU5DX0RJU1BMQVksXG4gIExPSU5DX01BUCxcbiAgTkhJX1RPX0xPSU5DLFxuICBQQU5FTF9MT0lOQ19NQVAsXG59IGZyb20gXCIuL2xvaW5jLXRhYmxlc1wiO1xuaW1wb3J0IHtcbiAgdHlwZSBRdWFudGl0eSxcbiAgdHlwZSBSYW5nZUVudHJ5LFxuICBwYXJzZVJhbmdlLFxuICBwYXJzZVJhbmdlTXVsdGksXG4gIHRvVWN1bSxcbiAgdHJ5UGFyc2VRdWFudGl0eSxcbn0gZnJvbSBcIi4vcGFyc2Vyc1wiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW1hZ2luZyBkZXRlY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElNQUdJTkdfS0VZV09SRFM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgXCJ1bHRyYXNvdW5kXCIsXG4gIFwic29ub2dyYW1cIixcbiAgXCJzb25vZ3JhcGh5XCIsXG4gIFwiZWNob1wiLFxuICBcImN0IFwiLFxuICBcImN0L1wiLFxuICBcImN0LVwiLFxuICBcImNvbXB1dGVkIHRvbW9ncmFwaHlcIixcbiAgXCJtcmlcIixcbiAgXCJtYWduZXRpYyByZXNvbmFuY2VcIixcbiAgXCJ4LXJheVwiLFxuICBcInhyYXlcIixcbiAgXCJ4IHJheVwiLFxuICBcIm1hbW1vZ3JhcGh5XCIsXG4gIFwibWFtbW9cIixcbiAgXCJla2dcIixcbiAgXCJlY2dcIixcbiAgXCJlbGVjdHJvY2FyZGlvZ3JhbVwiLFxuICBcImVuZG9zY29wXCIsXG4gIFwiY29sb25vc2NvcFwiLFxuICBcImdhc3Ryb3Njb3BcIixcbiAgXCJicm9uY2hvc2NvcFwiLFxuICBcInBldC9jdFwiLFxuICBcInBldCBcIixcbiAgXCJzcGVjdFwiLFxuICBcIlx1NUY3MVx1NTBDRlwiLFxuICBcIlx1OEQ4NVx1OTdGM1x1NkNFMlwiLFxuICBcIlx1OTZGQlx1ODE2Nlx1NjVCN1x1NUM2NFwiLFxuICBcIlx1NjgzOFx1NzhDMVx1NTE3MVx1NjMyRlwiLFxuICBcIlx1NUZDM1x1OTZGQlx1NTcxNlwiLFxuICBcIlx1NTE2N1x1ODk5Nlx1OTNFMVwiLFxuICBcIlx1NEU3M1x1NjIzRlx1NjUxRFx1NUY3MVwiLFxuXTtcblxuZnVuY3Rpb24gbG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5OiBzdHJpbmcsIGNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBoYXlzdGFjayA9IGAke2Rpc3BsYXl9ICR7Y29kZX1gLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBJTUFHSU5HX0tFWVdPUkRTLnNvbWUoKGt3KSA9PiBoYXlzdGFjay5pbmNsdWRlcyhrdykpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTE9JTkMgbG9va3VwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBOSElfTEFCX0NPREVfUkUgPSAvXlxcZHs0LDZ9W0EtWl0kLztcblxuZnVuY3Rpb24gaXNBc2NpaU9ubHkoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgPiAxMjcpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuXG4vLyBDaGVjayB3aGV0aGVyIGEgc2luZ2xlIExPSU5DX01BUCBrZXkgbWF0Y2hlcyB0aGUgbGFiJ3MgY29tYmluZWRcbi8vIChjb2RlICsgZGlzcGxheSkgc3RyaW5nLiBUd28gcnVsZXM6XG4vL1xuLy8gMS4gQVNDSUkga2V5czogYFxcYjxrZXk+XFxiYCBcdTIwMTQgd29yZCBib3VuZGFyaWVzIG9uIEJPVEggc2lkZXMuIFRoZVxuLy8gICAgbm8tdHJhaWxpbmctYm91bmRhcnkgc2VtYW50aWMgb2YgdGhlIG9sZGVyIGBcXGI8a2V5PmAgbWF0Y2hlclxuLy8gICAgY2F1c2VkIHNob3J0IGtleXMgbGlrZSBcImhiXCIgKEhlbW9nbG9iaW4pIHRvIGluY29ycmVjdGx5IG1hdGNoXG4vLyAgICBsb25nZXIgdGVybXMgbGlrZSBcImhic2FnXCIgKEhCc0FnKSBhbmQgXCJwaG9zcGhhdGVcIiAobWF0Y2hlZCBieVxuLy8gICAgXCJwaFwiKS4gUmVxdWlyaW5nIGFuIGVuZCBib3VuZGFyeSBtZWFucyBcImhiXCIgb25seSBtYXRjaGVzIHdoZW5cbi8vICAgIGl0IHN0YW5kcyBhcyBpdHMgb3duIHdvcmQuXG4vL1xuLy8gMi4gQ0pLIC8gbm9uLUFTQ0lJIGtleXM6IHBsYWluIHN1YnN0cmluZyBpbmNsdWRlcygpLiBcXGIgZG9lc24ndFxuLy8gICAgc2VtYW50aWNhbGx5IHdvcmsgZm9yIENKSyAobm8gd29yZC1jaGFyYWN0ZXIgY2xhc3MgY29uY2VwdCkuXG5mdW5jdGlvbiBfa2V5d29yZE1hdGNoZXMoa2V5OiBzdHJpbmcsIGNvbWJpbmVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgayA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoayl9XFxcXGJgKS50ZXN0KGNvbWJpbmVkKTtcbiAgfVxuICByZXR1cm4gY29tYmluZWQuaW5jbHVkZXMoayk7XG59XG5cbi8vIFBpY2sgdGhlIExPTkdFU1QgbWF0Y2hpbmcga2V5IGZyb20gdGhlIHRhYmxlLCBub3QgdGhlIGZpcnN0LiBBdm9pZHNcbi8vIHRoZSBzYW1lIGJ1ZyBmYW1pbHkgZnJvbSBhIHNlY29uZCBhbmdsZTogaHlwaGVuYXRlZCBrZXlzIGxpa2Vcbi8vIFwibGRsLWNob2xlc3Rlcm9sXCIgc2hhcmUgYSBgXFxiLi4uXFxiYCBib3VuZGFyeSBhdCB0aGUgaHlwaGVuLCBzbyBcImxkbFwiXG4vLyAoMyBjaGFycykgYWxzbyBtYXRjaGVzIGEgXCJsZGwtY2hvbGVzdGVyb2xcIiBzdHJpbmcuIExvbmdlc3QtbWF0Y2hcbi8vIG1ha2VzIHRoZSBtb3JlIHNwZWNpZmljIGtleSB3aW4gcmVnYXJkbGVzcyBvZiBpbnNlcnRpb24gb3JkZXIsIHNvXG4vLyB0aGUgYnJpdHRsZSBcImxvbmcgbXVzdCBhcHBlYXIgYmVmb3JlIHNob3J0XCIgY29tbWVudHMgc2NhdHRlcmVkXG4vLyB0aHJvdWdoIExPSU5DX01BUCBiZWNvbWUgdW5uZWNlc3NhcnkuXG5mdW5jdGlvbiBfZmluZExvbmdlc3RNYXRjaChcbiAgY29tYmluZWQ6IHN0cmluZyxcbiAgdGFibGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgbGV0IGJlc3RMb2luYzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBiZXN0S2V5TGVuID0gMDtcbiAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXModGFibGUpKSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiBiZXN0S2V5TGVuICYmIF9rZXl3b3JkTWF0Y2hlcyhrZXksIGNvbWJpbmVkKSkge1xuICAgICAgYmVzdExvaW5jID0gbG9pbmM7XG4gICAgICBiZXN0S2V5TGVuID0ga2V5Lmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJlc3RMb2luYztcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJpbWFyeSBMT0lOQyBmb3IgdGhpcyBsYWIuIFBhbmVsLWF3YXJlIGxvb2t1cDpcbiAqICAgQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgXHUyMTkyIHVzZSBOSElfVE9fTE9JTkMgZGlyZWN0bHkuXG4gKiAgIEIuIFBhbmVsIGNvZGUgT1IgdW5rbm93biBjb2RlIFx1MjE5MiB3YWxrIExPSU5DX01BUCBieSBkaXNwbGF5IGtleXdvcmRcbiAqICAgICAgKGxvbmdlc3Qta2V5IG1hdGNoIHdpbnMsIGJvdGgtc2lkZSB3b3JkIGJvdW5kYXJpZXMgZW5mb3JjZWQpLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGNvbnN0IGhpdCA9IF9maW5kTG9uZ2VzdE1hdGNoKGNvbWJpbmVkLCBQQU5FTF9MT0lOQ19NQVBbY29kZV0hKTtcbiAgICBpZiAoaGl0KSByZXR1cm4gaGl0O1xuICB9XG5cbiAgLy8gQi4gRGlzcGxheS1rZXl3b3JkIHNlYXJjaC5cbiAgY29uc3QgaGl0ID0gX2ZpbmRMb25nZXN0TWF0Y2goY29tYmluZWQsIExPSU5DX01BUCk7XG4gIGlmIChoaXQpIHJldHVybiBoaXQ7XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIC8vIFNvdXJjZS1wcm9ncmFtbWUgdGFnIFx1MjAxNCBzZXQgd2hlbiB0aGUgYWRhcHRlciBwdWxsZWQgdGhpcyBvYnNlcnZhdGlvblxuICAvLyBvdXQgb2YgYSBzcGVjaWZpYyBOSEkgc2NyZWVuaW5nIHByb2dyYW1tZSAoZS5nLiBhZGFwdEFkdWx0UHJldmVudGl2ZVxuICAvLyBzZXRzIHNvdXJjZV9wcm9ncmFtPVwiYWR1bHQtcHJldmVudGl2ZVwiKS4gU3VyZmFjZWQgdmlhIE9ic2VydmF0aW9uLlxuICAvLyBtZXRhLnRhZyBzbyBkb3duc3RyZWFtIFNNQVJUIGFwcHMgY2FuIGZpbHRlciBieSBfdGFnIHdpdGhvdXQgbmVlZGluZ1xuICAvLyB0byBrbm93IGFib3V0IG91ciBpbnRlcm5hbCBmaWVsZCBuYW1lcy5cbiAgaWYgKHJhdy5zb3VyY2VfcHJvZ3JhbSkge1xuICAgIHJlc291cmNlLm1ldGEudGFnID0gW1xuICAgICAge1xuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL25oaS1maGlyLWJyaWRnZS9zb3VyY2UtcHJvZ3JhbVwiLFxuICAgICAgICBjb2RlOiBTdHJpbmcocmF3LnNvdXJjZV9wcm9ncmFtKSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQsIG1hc2tJZCwgbWFza05hbWUgfSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgREVGQVVMVF9CQUNLRU5EID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMTBcIjtcbi8vIERlZmF1bHQgU01BUlQgYXBwIGZvciBhIGZyZXNoIGluc3RhbGwuIFVzZXJzIGNhbiBvdmVycmlkZSB2aWFcbi8vIHRoZSAnXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgU01BUlQgQXBwIExhdW5jaCBVUkwnIGZpZWxkOyB0aGUgdmFsdWUgaXNcbi8vIHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlciBgc21hcnRBcHBMYXVuY2hVcmxgLlxuLy8gVGhpcyBVUkwgaXMgdXNlZCBmb3IgTW9kZSBCJ3MgT0F1dGggbGF1bmNoIGZsb3cgKGl0IGV4cGVjdHMgdG9cbi8vIHJlY2VpdmUgaXNzICsgbGF1bmNoIHF1ZXJ5IHBhcmFtcyBmcm9tIGEgU01BUlQgb24gRkhJUiBsYXVuY2gpLlxuY29uc3QgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpci9zbWFydC9sYXVuY2hcIjtcbi8vIFN0ZXAgNCBzdGFuZGFsb25lLW9wZW4gVVJMLiBIYXJkY29kZWQgXHUyMDE0IHRoZSBzdGVwIDQgYnV0dG9uIGFsd2F5c1xuLy8gb3BlbnMgdGhpcyBVUkwgaW4gYSBuZXcgdGFiIHdpdGggbm8gcXVlcnkgcGFyYW1zIChNb2RlIEEgdXNlcnNcbi8vIG1hbnVhbGx5IGRyYWcgdGhlIGRvd25sb2FkZWQgSlNPTiBpbnRvIHRoZSBwYWdlKS4gRGlzdGluY3QgZnJvbVxuLy8gREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIIGJlY2F1c2UgdGhhdCBvbmUgaXMgdGhlIE9BdXRoIC9zbWFydC9sYXVuY2hcbi8vIGVuZHBvaW50OyB0aGlzIG9uZSBpcyB0aGUgU01BUlQgYXBwJ3MgcGxhaW4gZW50cnkgcGFnZS5cbmNvbnN0IFNUQU5EQUxPTkVfU01BUlRfQVBQX1VSTCA9IFwiaHR0cHM6Ly92b2hvMDAwMC5naXRodWIuaW8vbWVkaWNhbC1ub3RlLXNtYXJ0LW9uLWZoaXIvXCI7XG5cbi8vIFRydWUgaWYgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlIChyZWFsIHNpdGUpLlxuZnVuY3Rpb24gaXNOaGlUYWIodXJsKSB7XG4gIGlmICghdXJsKSByZXR1cm4gZmFsc2U7XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmw7XG4gICAgcmV0dXJuIC9teWhlYWx0aGJhbmtcXC5uaGlcXC5nb3ZcXC50dy8udGVzdCh1Lmhvc3RuYW1lKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IERFRkFVTFRfTU9ERSA9IFwibG9jYWxcIjtcblxuY29uc3QgZWxzID0ge1xuICBtb2RlUmFkaW9zOiAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwic3luYy1tb2RlXCJdJyksXG4gIGJhY2tlbmRVcmw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja2VuZC11cmxcIiksXG4gIHN5bmNBcGlLZXk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGkta2V5XCIpLFxuICBzbWFydEFwcFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbWFydC1hcHAtdXJsXCIpLFxuICBzeW5jQXBpQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN5bmMtYXBpLWJ0blwiKSxcbiAgc3luY0Jsb2NrZWRSZWFzb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1ibG9ja2VkLXJlYXNvblwiKSxcbiAgYXBpU3luY1JhbmdlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwaS1zeW5jLXJhbmdlXCIpLFxuICBzdG9wQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0b3AtYnRuXCIpLFxuICBvdk5hbWU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtbmFtZVwiKSxcbiAgb3ZCaXJ0aERhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtYmlydGgtZGF0ZVwiKSxcbiAgb3ZHZW5kZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtZ2VuZGVyXCIpLFxuICBvdlNhdmVCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Ytc2F2ZS1idG5cIiksXG4gIG92Q2xlYXJCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3YtY2xlYXItYnRuXCIpLFxuICBvdlN1bW1hcnk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcnJpZGUtc3VtbWFyeVwiKSxcbiAgcGF0aWVudE92ZXJyaWRlRGV0YWlsczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXRpZW50LW92ZXJyaWRlXCIpLFxuICBsYXVuY2hCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGF1bmNoLWJ0blwiKSxcbiAgb3BlblNtYXJ0QXBwQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tc21hcnQtYXBwLWJ0blwiKSxcbiAgb3BlblNldHRpbmdzQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tc2V0dGluZ3MtYnRuXCIpLFxuICBzZXR0aW5nc0JhY2tCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2V0dGluZ3MtYmFjay1idG5cIiksXG4gIHN0YXR1czogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGF0dXNcIiksXG4gIGRhc2hib2FyZExpbms6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFzaGJvYXJkLWxpbmtcIiksXG4gIHBlbmRpbmdCdW5kbGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGVuZGluZy1idW5kbGVcIiksXG4gIGRvd25sb2FkQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvd25sb2FkLWJ1bmRsZS1idG5cIiksXG4gIGNsZWFyQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyLWJ1bmRsZS1idG5cIiksXG4gIC8vIGJ1bmRsZU1ldGEgbGVnYWN5IGlkIHJlbW92ZWQgaW4gdGhlIHBhbmVsLW1lcmdlOyBmaWxlbmFtZStzaXplIG5vd1xuICAvLyBsaXZlIGluIGRlZGljYXRlZCAjYnVuZGxlLWZpbGVuYW1lIC8gI2J1bmRsZS1zaXplYWdlIGVsZW1lbnRzXG4gIC8vIGJlbG93LlxuICBjb25uQmFubmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tYmFubmVyXCIpLFxuICBjb25uU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLXNlY3Rpb25cIiksXG4gIGNvbm5NaW5pOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tbWluaVwiKSxcbiAgY29ubk1zZzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLW1zZ1wiKSxcbiAgY29ublJldHJ5QnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tcmV0cnktYnRuXCIpLFxuICBjb25uSGVscDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uLWhlbHBcIiksXG4gIGRhdGFTdGF0ZVNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0YS1zdGF0ZS1zZWN0aW9uXCIpLFxuICBiYWNrZW5kU3RhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja2VuZC1zdGF0ZVwiKSxcbiAgbG9jYWxTdGF0ZVJvdzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2NhbC1zdGF0ZS1yb3dcIiksXG4gIGxvY2FsU3RhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9jYWwtc3RhdGVcIiksXG4gIHB1c2hMb2NhbEJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwdXNoLWxvY2FsLWJ0blwiKSxcbiAgc3luY1N0YXR1c0hpbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1zdGF0dXMtaGludFwiKSxcbiAgbWFza05hbWVFbmFibGVkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hc2stbmFtZS1lbmFibGVkXCIpLFxuICBiYWNrZW5kTW9kZUVuYWJsZWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja2VuZC1tb2RlLWVuYWJsZWRcIiksXG4gIG9wZW5OaGlTZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tbmhpLXNlY3Rpb25cIiksXG4gIG9wZW5OaGlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1uaGktYnRuXCIpLFxuICBuaGlOZWVkc0xvZ2luU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuaGktbmVlZHMtbG9naW4tc2VjdGlvblwiKSxcbiAgbmhpUmVsb2FkQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5oaS1yZWxvYWQtYnRuXCIpLFxuICBsb2dpbk9rU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1vay1zZWN0aW9uXCIpLFxuICB3aXphcmRTdGVwcGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndpemFyZC1zdGVwcGVyXCIpLFxuICByZXN1bHRab25lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdC16b25lXCIpLFxuICBhY3RpdmVQYXRpZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFjdGl2ZS1wYXRpZW50XCIpLFxuICBhY3RpdmVQYXRpZW50VmFsdWU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWN0aXZlLXBhdGllbnQtdmFsdWVcIiksXG4gIGJ1bmRsZU1ldGFCbG9jazogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidW5kbGUtbWV0YS1ibG9ja1wiKSxcbiAgYnVuZGxlRmlsZW5hbWU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVuZGxlLWZpbGVuYW1lXCIpLFxuICBidW5kbGVTaXplYWdlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1bmRsZS1zaXplYWdlXCIpLFxufTtcblxuY29uc3QgTkhJX0xBTkRJTkcgPSBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHcvSUhLRTMwMDBcIjtcbi8vIERpcmVjdCBVUkwgb2YgdGhlIGxvZ2luIHBpY2tlciBwYWdlIChhIGdlbmVyaWMgbGFuZGluZyBcdTIxOTIgbG9naW4gcmVkaXJlY3Rcbi8vIGhhcHBlbnMgYXV0b21hdGljYWxseSBmb3IgdW5hdXRoZW50aWNhdGVkIHZpc2l0cywgYnV0IGdvaW5nIHN0cmFpZ2h0XG4vLyBoZXJlIGFsc28gaGFuZGxlcyB1c2VycyBzaXR0aW5nIG9uIGEgcHVibGljIHN1Yi1wYWdlIGxpa2UgXHU1NTRGXHU3QjU0XHU1QzA4XHU1MzQwXG4vLyB3aGVyZSBhIHBsYWluIHJlbG9hZCB3b3VsZCBqdXN0IHJlLXJlbmRlciB0aGUgc2FtZSB1bi1hdXRoIHBhZ2UpLlxuY29uc3QgTkhJX0xPR0lOX1VSTCA9IFwiaHR0cHM6Ly9teWhlYWx0aGJhbmsubmhpLmdvdi50dy9JSEtFMzAwMC9JSEtFMzA5NVMwMVwiO1xuXG5jb25zdCBQRU5ESU5HX0JVTkRMRV9LRVkgPSBcInBlbmRpbmdGaGlyQnVuZGxlXCI7XG5cbi8vIFBlcnNpc3RlZC1zdGF0ZSBrZXlzLiBCYWNrZW5kIFVSTCBhbmQgQVBJIGtleSBwZXJzaXN0IGFjcm9zcyBicm93c2VyIHNlc3Npb25zLlxuYXN5bmMgZnVuY3Rpb24gbG9hZEJhY2tlbmRVcmwoKSB7XG4gIGNvbnN0IHsgYmFja2VuZFVybCwgc3luY0FwaUtleSwgc21hcnRBcHBMYXVuY2hVcmwgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcbiAgICBbXCJiYWNrZW5kVXJsXCIsIFwic3luY0FwaUtleVwiLCBcInNtYXJ0QXBwTGF1bmNoVXJsXCJdXG4gICk7XG4gIGVscy5iYWNrZW5kVXJsLnZhbHVlID0gYmFja2VuZFVybCB8fCBERUZBVUxUX0JBQ0tFTkQ7XG4gIGVscy5zeW5jQXBpS2V5LnZhbHVlID0gc3luY0FwaUtleSB8fCBcIlwiO1xuICBlbHMuc21hcnRBcHBVcmwudmFsdWUgPSBzbWFydEFwcExhdW5jaFVybCB8fCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIGVscy5kYXNoYm9hcmRMaW5rLmhyZWYgPSBlbHMuYmFja2VuZFVybC52YWx1ZS5yZXBsYWNlKC86ODAxMC4qJC8sIFwiOjMwMTBcIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYXRpZW50IG92ZXJyaWRlIChtYW51YWwgTkhJIGlkZW50aXR5KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZG9lc24ndCBleHBvc2UgdGhlIHVzZXIncyBuYXRpb25hbCBJRCBpbiB0aGUgVVJMLiBUaGUgdXNlclxuLy8gZmlsbHMgdGhlc2Ugb25jZSBhbmQgdGhleSdyZSBzZW50IHdpdGggZXZlcnkgdXBsb2FkIGNhbGwgdW50aWwgY2xlYXJlZC5cblxuLy8gaWRfbm8gaXMgbm8gbG9uZ2VyIGEgVUkgZmllbGQsIHNvIGdldFBhdGllbnRPdmVycmlkZSgpIChzeW5jLCBjYWxsZWRcbi8vIGluIG1hbnkgaG90IHBhdGhzKSBjYW4ndCByZWFkIGl0IGZyb20gdGhlIGZvcm0uIENhY2hlIGl0IGhlcmUgZnJvbVxuLy8gc3RvcmFnZTsgbG9hZFBhdGllbnRPdmVycmlkZSAvIHNhdmVQYXRpZW50T3ZlcnJpZGUgLyBjbGVhciBrZWVwIGl0XG4vLyBmcmVzaCwgYW5kIGFwcGx5U3luY1N0YXR1cyBwb2tlcyBpdCB3aGVuIGJhY2tncm91bmQgc3dhcHMgdGhlXG4vLyBwbGFjZWhvbGRlciBmb3IgdGhlIHJlYWwgY2lkLlxubGV0IF9zdG9yZWRJZE5vID0gbnVsbDtcblxuLy8gTkhJIHRhYiBpZCwgY2FwdHVyZWQgaW4gaW5pdCgpIHdoZW4gdGhlIGFjdGl2ZSB0YWIgaXMgdGhlIE5ISSBwYWdlLlxuLy8gVXNlZCBieSB0aGUgXCJcdTkxQ0RcdTY1QjBcdTY1NzRcdTc0MDZcdTk4MDFcdTk3NjJcIiBidXR0b24gaW4gdGhlIG5lZWRzLWxvZ2luIGJhbm5lciBzbyB0aGVcbi8vIHVzZXIgZG9lc24ndCBoYXZlIHRvIGtub3cgRjUgLyBzd2l0Y2ggdGFicyB0aGVtc2VsdmVzLlxubGV0IF9uaGlUYWJJZCA9IG51bGw7XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGNvbnN0IHsgcGF0aWVudE92ZXJyaWRlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJwYXRpZW50T3ZlcnJpZGVcIik7XG4gIF9zdG9yZWRJZE5vID0gcGF0aWVudE92ZXJyaWRlPy5pZF9ubyB8fCBudWxsO1xuICBpZiAocGF0aWVudE92ZXJyaWRlKSB7XG4gICAgZWxzLm92TmFtZS52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCI7XG4gICAgZWxzLm92QmlydGhEYXRlLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmJpcnRoX2RhdGUgfHwgXCJcIjtcbiAgICBlbHMub3ZHZW5kZXIudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuZ2VuZGVyIHx8IFwiXCI7XG4gIH1cbiAgLy8gQSBzdG9yZWQgb3ZlcnJpZGUgd2l0aCBib3RoIHJlcXVpcmVkIGZpZWxkcyBjb3VudHMgYXMgXCJzdGVwIDJcbiAgLy8gYWxyZWFkeSBjb25maXJtZWRcIiBcdTIwMTQgcmV0dXJuaW5nIHVzZXIgc2hvdWxkbid0IGJlIGZvcmNlZCB0byBjbGlja1xuICAvLyBcdTI3MTMgXHU3OEJBXHU1QjlBIGFnYWluIHRvIGFkdmFuY2UgdGhlIHdpemFyZC5cbiAgX21hcmtTdGVwMkNvbmZpcm1lZChcbiAgICAhIShwYXRpZW50T3ZlcnJpZGU/LmdlbmRlciAmJiBwYXRpZW50T3ZlcnJpZGU/LmJpcnRoX2RhdGUpLFxuICApO1xuICAvLyBQYXRpZW50IHBhbmVsIGlzIG5vdyBhbHdheXMtZXhwYW5kZWQgKHN0ZXAgMiBvd25zIGl0cyBvd24gcGFnZSk7XG4gIC8vIHRoZSBwcmV2aW91cyBjb2xsYXBzZS13aGVuLWNvbmZpcm1lZCBiZWhhdmlvdXIgd2FzIGEgbGVmdG92ZXIgZnJvbVxuICAvLyB0aGUgc2luZ2xlLXNjcm9sbCBsYXlvdXQuXG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aWVudE92ZXJyaWRlKCkge1xuICAvLyBSZXR1cm5zIHtpZF9ubywgbmFtZT8sIGJpcnRoX2RhdGU/LCBnZW5kZXI/fS5cbiAgLy8gaWRfbm8gY29tZXMgZnJvbSB0aGUgc3RvcmFnZSBjYWNoZSAoX3N0b3JlZElkTm8pIHNpbmNlIGl0J3Mgbm9cbiAgLy8gbG9uZ2VyIGEgVUkgZmllbGQgXHUyMDE0IGl0J3MgYXV0by1taW50ZWQgYXQgc2F2ZSB0aW1lIGFuZCByZXBsYWNlZFxuICAvLyB3aXRoIHRoZSByZWFsIGNpZCBieSBiYWNrZ3JvdW5kJ3MgTkhJIGZldGNoIG9uIGZpcnN0IHN5bmMuXG4gIC8vIFJldHVybnMgbnVsbCB3aGVuIG5vdGhpbmcgaWRlbnRpZnlpbmcgaXMgZmlsbGVkLlxuICBjb25zdCBuYW1lID0gZWxzLm92TmFtZS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGJpcnRoX2RhdGUgPSBlbHMub3ZCaXJ0aERhdGUudmFsdWUudHJpbSgpO1xuICBjb25zdCBnZW5kZXIgPSBlbHMub3ZHZW5kZXIudmFsdWU7XG4gIGlmICghX3N0b3JlZElkTm8gJiYgIW5hbWUgJiYgIWJpcnRoX2RhdGUgJiYgIWdlbmRlcikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG91dCA9IHt9O1xuICBpZiAoX3N0b3JlZElkTm8pIG91dC5pZF9ubyA9IF9zdG9yZWRJZE5vO1xuICBpZiAobmFtZSkgb3V0Lm5hbWUgPSBuYW1lO1xuICBpZiAoYmlydGhfZGF0ZSkgb3V0LmJpcnRoX2RhdGUgPSBiaXJ0aF9kYXRlO1xuICBpZiAoZ2VuZGVyKSBvdXQuZ2VuZGVyID0gZ2VuZGVyO1xuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIHRoZSBwYXRpZW50IGNhcmQncyBiaXJ0aC1kYXRlIGlucHV0LiBSZXR1cm5zIG51bGwgd2hlbiBPSyxcbiAqIG90aGVyd2lzZSBhIHVzZXItZmFjaW5nIGVycm9yIHN0cmluZy4gUmVhZHMgZGlyZWN0bHkgZnJvbSB0aGVcbiAqIDxpbnB1dCB0eXBlPVwiZGF0ZVwiPiBzbyB3ZSBjYW4gZGV0ZWN0IHBhcnRpYWwtaW5wdXQgc3RhdGVzIHRoYXRcbiAqIENocm9tZSByZXBvcnRzIHRocm91Z2ggYHZhbGlkaXR5LmJhZElucHV0YCAodGhlIGlucHV0J3MgYC52YWx1ZWBcbiAqIGlzIFwiXCIgaW4gdGhhdCBjYXNlLCBpbmRpc3Rpbmd1aXNoYWJsZSBmcm9tIFwiYmxhbmtcIiBieSBzdHJpbmcgY2hlY2tcbiAqIGFsb25lIFx1MjAxNCB0aGF0J3Mgd2h5IHRoZSBvbGQgdmVyc2lvbiBvZiB0aGlzIGZ1bmN0aW9uIGxldCBwYXJ0aWFsXG4gKiB5ZWFyLW9ubHkgZW50cmllcyBzbGlwIHRocm91Z2gpLlxuICpcbiAqIEFsbG93ZWQgc3RhdGVzOlxuICogICAtIGdlbnVpbmVseSBlbXB0eSAodGhlIGZpZWxkIGlzIG9wdGlvbmFsKVxuICogICAtIGZ1bGwgSVNPIFlZWVktTU0tREQgdGhhdCByb3VuZC10cmlwcyB0aHJvdWdoIERhdGUoKVxuICogUmVqZWN0ZWQ6XG4gKiAgIC0geWVhci1vbmx5IC8geWVhcittb250aDogdGhlIGlucHV0IHJlbmRlcnMgYmxhbmsgdmFsdWUgYnV0XG4gKiAgICAgdmFsaWRpdHkuYmFkSW5wdXQgaXMgdHJ1ZVxuICogICAtIGRhdGVzIGluIHRoZSBmdXR1cmVcbiAqICAgLSBpbXBsYXVzaWJseSBvbGQgZGF0ZXMgKHllYXIgPCAxOTAwKVxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUJpcnRoRGF0ZSgpIHtcbiAgY29uc3QgZWwgPSBlbHMub3ZCaXJ0aERhdGU7XG4gIGlmICghZWwpIHJldHVybiBudWxsO1xuICAvLyBDaHJvbWUncyBuYXRpdmUgZGF0ZSBpbnB1dDogcGFydGlhbCBlbnRyeSAoanVzdCB5ZWFyLCBqdXN0IHl5eXktbW0pXG4gIC8vIHN1cmZhY2VzIGhlcmUgZXZlbiB0aG91Z2ggLnZhbHVlIGlzIFwiXCIuXG4gIGlmIChlbC52YWxpZGl0eSAmJiBlbC52YWxpZGl0eS5iYWRJbnB1dCkge1xuICAgIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1OEFDQlx1NTg2Qlx1NUI4Q1x1NjU3NFx1NUU3NFx1NjcwOFx1NjVFNVwiO1xuICB9XG4gIGNvbnN0IHMgPSAoZWwudmFsdWUgfHwgXCJcIikudHJpbSgpO1xuICAvLyBCaXJ0aCBkYXRlIGlzIG5vdyByZXF1aXJlZCBcdTIwMTQgYWdlIGFmZmVjdHMgZXZlcnkgcmVmZXJlbmNlIHJhbmdlXG4gIC8vIGFuZCBhbnkgZG93bnN0cmVhbSBhZ2UtYmFzZWQgVUk7IGVtcHR5IGlucHV0IGxldHMgYSB0eXBvIC8gYnJvd3NlclxuICAvLyBxdWlyayBzaWxlbnRseSBwcm9wYWdhdGUgYXMgTmFOLlxuICBpZiAoIXMpIHJldHVybiBcIlx1OEFDQlx1NTg2Qlx1NzUxRlx1NjVFNVwiO1xuICBpZiAoIS9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLy50ZXN0KHMpKSByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdThBQ0JcdTU4NkJcdTVCOENcdTY1NzRcdTVFNzRcdTY3MDhcdTY1RTVcIjtcbiAgY29uc3QgW3ksIG0sIGRdID0gcy5zcGxpdChcIi1cIikubWFwKE51bWJlcik7XG4gIGNvbnN0IGR0ID0gbmV3IERhdGUocyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgaWYgKFxuICAgIE51bWJlci5pc05hTihkdC5nZXRUaW1lKCkpIHx8XG4gICAgZHQuZ2V0VVRDRnVsbFllYXIoKSAhPT0geSB8fFxuICAgIGR0LmdldFVUQ01vbnRoKCkgKyAxICE9PSBtIHx8XG4gICAgZHQuZ2V0VVRDRGF0ZSgpICE9PSBkXG4gICkge1xuICAgIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1NEUwRFx1NjYyRlx1NjcwOVx1NjU0OFx1NjVFNVx1NjcxRlwiO1xuICB9XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGlmIChkdC5nZXRUaW1lKCkgPiBub3cuZ2V0VGltZSgpKSByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdTRFMERcdTgwRkRcdTY2MkZcdTY3MkFcdTRGODZcIjtcbiAgaWYgKHkgPCAxOTAwKSByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdTVFNzRcdTRFRkRcdTU5MkFcdTY1RTlcdUZGMENcdThBQ0JcdTc4QkFcdThBOERcIjtcbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFJhbmRvbSBcImF1dG8tWFhYWFhYWFhcIiBcdTIwMTQgOCBoZXggY2hhcnMgZnJvbSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHNvXG4vLyBldmVyeSBmcmVzaCBwb3B1cCBpbnN0YWxsIGdldHMgYSBkaWZmZXJlbnQgSUQgYW5kIHJlLXN5bmNzIGFyZSBzdGFibGUuXG5mdW5jdGlvbiBfZ2VuZXJhdGVBdXRvUGF0aWVudElkKCkge1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgY29uc3QgaGV4ID0gQXJyYXkuZnJvbShieXRlcywgKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTtcbiAgcmV0dXJuIGBhdXRvLSR7aGV4fWA7XG59XG5cbi8vIEZvcm1hdCBpZF9ubyBmb3IgZGlzcGxheS4gUmVhbCBOSEkgY2lkcyAoUDEyMzQ1MDg2NiBcdTIxOTIgUDEyMzQ1KioqKilcbi8vIGdldCBzaG93biBoYWxmLW1hc2tlZCBzbyB0aGUgdXNlciBoYXMgdmlzdWFsIGNvbmZpcm1hdGlvbiB3ZVxuLy8gY2FwdHVyZWQgdGhlaXIgcmVhbCBpZGVudGl0eS4gVGhlIGludGVybmFsIGF1dG8tWFhYWFhYWFggcGxhY2Vob2xkZXJcbi8vIGlzIGhpZGRlbiBcdTIwMTQgaXQncyBhIHN5c3RlbS1nZW5lcmF0ZWQgc3RyaW5nIHRoYXQgbWVhbnMgbm90aGluZyB0b1xuLy8gdGhlIHVzZXIgYW5kIGp1c3QgY3JlYXRlcyBcIndoYXQncyB0aGF0IGdpYmJlcmlzaD9cIiBmcmljdGlvbiB1bnRpbFxuLy8gdGhlIHJlYWwgY2lkIGFycml2ZXMgdmlhIGJhY2tncm91bmQncyBOSEkgZmV0Y2ggb24gZmlyc3Qgc3luYy5cbmZ1bmN0aW9uIF9kaXNwbGF5SWQoaWRObykge1xuICBpZiAoIWlkTm8gfHwgaWROby5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBcIlwiO1xuICByZXR1cm4gbWFza0lkKGlkTm8pO1xufVxuXG5mdW5jdGlvbiByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBjYXJkID0gZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHM7XG4gIGxldCBzdW1tYXJ5VGV4dCA9IFwiXCI7XG4gIGlmICghb3YgfHwgIW92Lm5hbWUpIHtcbiAgICBlbHMub3ZTdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTY3MkFcdThBMkRcdTVCOUFcIjtcbiAgICBpZiAoY2FyZCkgY2FyZC5kYXRhc2V0LnN0YXRlID0gXCJlbXB0eVwiO1xuICB9IGVsc2Uge1xuICAgIC8vIE5hbWUgKG1hc2sgdG9nZ2xlOiBcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjggXHU5ODEwXHU4QTJEXHU5NURDID0gXHU3NzFGXHU1NDBEIC8gbXVsdGktcGF0aWVudCBkZW1vXG4gICAgLy8gXHU5NThCXHU1NTVGID0gXHU5MDZFXHU3RjY5KSArIG1hc2tlZCByZWFsIGNpZCB3aGVuIGF2YWlsYWJsZS4gQXV0by1wbGFjZWhvbGRlclxuICAgIC8vIGlzIHN1cHByZXNzZWQgdmlhIF9kaXNwbGF5SWQuXG4gICAgY29uc3QgcGFydHMgPSBbX21heWJlTWFzayhvdi5uYW1lKV07XG4gICAgY29uc3QgaWRMYWJlbCA9IF9kaXNwbGF5SWQob3YuaWRfbm8pO1xuICAgIGlmIChpZExhYmVsKSBwYXJ0cy5wdXNoKGlkTGFiZWwpO1xuICAgIHN1bW1hcnlUZXh0ID0gcGFydHMuam9pbihcIiAgXHUwMEI3ICBcIik7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IGBcdTI3MTMgJHtzdW1tYXJ5VGV4dH1gO1xuICAgIGlmIChjYXJkKSBjYXJkLmRhdGFzZXQuc3RhdGUgPSBcImZpbGxlZFwiO1xuICB9XG4gIC8vIE1pcnJvciBvbnRvIHN0ZXAgMydzIFwiXHU1M0Q2XHU1Rjk3XHU1QzBEXHU4QzYxXCIgYmFubmVyIHNvIHRoZSB1c2VyIGtub3dzIHdob1xuICAvLyB0aGV5J3JlIGFib3V0IHRvIGZldGNoIHdpdGhvdXQgc2Nyb2xsaW5nIGJhY2sgdG8gc3RlcCAyLiBPbmx5XG4gIC8vIHdoZW4gc3RlcCAyIGhhcyBiZWVuIGNvbmZpcm1lZCAod2hpY2ggbm93IGltcGxpZXMgYSBzYXZlZCBuYW1lKS5cbiAgaWYgKGVscy5hY3RpdmVQYXRpZW50ICYmIGVscy5hY3RpdmVQYXRpZW50VmFsdWUpIHtcbiAgICBjb25zdCBzaG93QWN0aXZlID0gX3N0ZXAyQ29uZmlybWVkICYmICEhc3VtbWFyeVRleHQ7XG4gICAgZWxzLmFjdGl2ZVBhdGllbnQuaGlkZGVuID0gIXNob3dBY3RpdmU7XG4gICAgaWYgKHNob3dBY3RpdmUpIGVscy5hY3RpdmVQYXRpZW50VmFsdWUudGV4dENvbnRlbnQgPSBzdW1tYXJ5VGV4dDtcbiAgfVxuICAvLyBCb3RoIGxhdW5jaCArIHN5bmMgZW5hYmxlZCBzdGF0ZSBkZXBlbmQgb24gcGF0aWVudCArIG1vZGUgKyBjb25uLlxuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBDaGFuZ2luZyBwYXRpZW50IElEIGludmFsaWRhdGVzOiAoYSkgYmFja2VuZC1zdGF0ZSBjYWNoZSAobmV3XG4gIC8vIHBhdGllbnQgbWlnaHQgbm90IGJlIG9uIGJhY2tlbmQpOyAoYikgbG9jYWwtYnVuZGxlIHJvdyBpbiB0aGVcbiAgLy8gZGF0YS1zdGF0ZSBjYXJkOyAoYykgdGhlIFx1RDgzRFx1RENFNSBkb3dubG9hZCBidW5kbGUgc2VjdGlvbiwgd2hpY2ggd291bGRcbiAgLy8gb3RoZXJ3aXNlIHN0aWxsIHNob3cgdGhlIHByZXZpb3VzIHBhdGllbnQncyBzdGFzaGVkIGZpbGU7IChkKVxuICAvLyB0aGUgbGFzdCBjb21wbGV0ZWQgc3luYydzIHN1Y2Nlc3MgbWVzc2FnZSwgd2hpY2ggd2FzIHRhZ2dlZCBmb3JcbiAgLy8gdGhlIHByZXZpb3VzIHBhdGllbnQuXG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbiAgX2NsZWFyU3RhbGVTeW5jU3RhdHVzKGdldFBhdGllbnRPdmVycmlkZSgpKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIF9jb25uU3RhdGUgPT09IFwib2tcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xufVxuXG4vLyBEcm9wIGEgXCJcdTI3MDUgXHU1NDBDXHU2QjY1XHU1QjhDXHU2MjEwIFx1MjAyNlwiIHN0YXR1cyBiYW5uZXIgdGhhdCB3YXMgcmVjb3JkZWQgZm9yIGFcbi8vIGRpZmZlcmVudCBwYXRpZW50LiBNaWQtZmxpZ2h0IHN5bmNzIGFyZSBsZWZ0IGFsb25lIChzdGF0dXMucnVubmluZylcbi8vIHNvIHRoZSB1c2VyIGNhbiBzdGlsbCBzZWUgcHJvZ3Jlc3Mgb2YgdGhlIGluLWZsaWdodCBzeW5jLlxuZnVuY3Rpb24gX2NsZWFyU3RhbGVTeW5jU3RhdHVzKG92KSB7XG4gIGlmICghX2xhdGVzdFN0YXR1cykgcmV0dXJuO1xuICBpZiAoX2xhdGVzdFN0YXR1cy5ydW5uaW5nKSByZXR1cm47XG4gIGlmICghX2xhdGVzdFN0YXR1cy5oaXN0bm8pIHJldHVybjtcbiAgaWYgKG92Py5pZF9ubyA9PT0gX2xhdGVzdFN0YXR1cy5oaXN0bm8pIHJldHVybjtcbiAgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG4gIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwic3luY1N0YXR1c1wiKS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIC8vIEdlbmRlciArIGJpcnRoX2RhdGUgKyBuYW1lIGFyZSByZXF1aXJlZC4gaWRfbm8gaXMgdGhlIG9ubHkgb3B0aW9uYWxcbiAgLy8gZmllbGQgXHUyMDE0IGl0J3MgYXV0by1mZXRjaGVkIGZyb20gTkhJIG9uIHN5bmMsIG5ldmVyIHVzZXItZW50ZXJlZC5cbiAgaWYgKCFlbHMub3ZHZW5kZXIudmFsdWUpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU4QUNCXHU5MDc4XHU2NEM3XHU2MDI3XHU1MjI1XCIsIFwiZXJyb3JcIik7XG4gICAgZWxzLm92R2VuZGVyLmZvY3VzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGRvYkVycm9yID0gdmFsaWRhdGVCaXJ0aERhdGUoKTtcbiAgaWYgKGRvYkVycm9yKSB7XG4gICAgc2V0U3RhdHVzKGBcdTI2RDQgJHtkb2JFcnJvcn1gLCBcImVycm9yXCIpO1xuICAgIGVscy5vdkJpcnRoRGF0ZS5mb2N1cygpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWVscy5vdk5hbWUudmFsdWUudHJpbSgpKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1OEFDQlx1NTg2Qlx1NUJFQlx1NTlEM1x1NTQwRFwiLCBcImVycm9yXCIpO1xuICAgIGVscy5vdk5hbWUuZm9jdXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gQnVpbGQgdGhlIG92ZXJyaWRlIGRpcmVjdGx5IHNvIHdlIGRvbid0IGRlcGVuZCBvblxuICAvLyBnZXRQYXRpZW50T3ZlcnJpZGUncyBudWxsLXJldHVybiBcdTIwMTQgdGhlIHJlcXVpcmVkLWZpZWxkIHBhdGggYWJvdmVcbiAgLy8gaGFzIGFscmVhZHkgdmFsaWRhdGVkIHdoYXQgbWF0dGVycy5cbiAgY29uc3Qgb3YgPSB7XG4gICAgbmFtZTogZWxzLm92TmFtZS52YWx1ZS50cmltKCkgfHwgbnVsbCxcbiAgICBiaXJ0aF9kYXRlOiBlbHMub3ZCaXJ0aERhdGUudmFsdWUudHJpbSgpLFxuICAgIGdlbmRlcjogZWxzLm92R2VuZGVyLnZhbHVlLFxuICB9O1xuICBpZiAoIW92Lm5hbWUpIGRlbGV0ZSBvdi5uYW1lO1xuICAvLyBpZF9ubyBpcyBubyBsb25nZXIgYSBVSSBmaWVsZC4gUmV1c2UgdGhlIHByZXZpb3VzbHkgc3RvcmVkXG4gIC8vIHBsYWNlaG9sZGVyIGlmIG9uZSBleGlzdHMgKHNvIHJlLXNhdmVzIGRvbid0IGtlZXAgbWludGluZyBuZXcgSURzXG4gIC8vIGFuZCBvcnBoYW5pbmcgYmFja2VuZCByZXNvdXJjZXMga2V5ZWQgb24gdGhlIG9sZCBvbmUpOyBvdGhlcndpc2VcbiAgLy8gbWludCBhIGZyZXNoIGF1dG8tWFhYWC4gYmFja2dyb3VuZCdzIE5ISSBmZXRjaCBzd2FwcyB0aGlzIGZvciB0aGVcbiAgLy8gcmVhbCBjaWQgb24gZmlyc3Qgc3luYy5cbiAgLy9cbiAgLy8gVGhlIHNhbWUgcmVhZCBhbHNvIGZlZWRzIHRoZSBpZGVudGl0eS1zd2l0Y2ggZGV0ZWN0aW9uIGJlbG93LlxuICBjb25zdCBwcmV2U3RvcmVkID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInBhdGllbnRPdmVycmlkZVwiKSlcbiAgICAucGF0aWVudE92ZXJyaWRlO1xuICBvdi5pZF9ubyA9IHByZXZTdG9yZWQ/LmlkX25vIHx8IF9nZW5lcmF0ZUF1dG9QYXRpZW50SWQoKTtcbiAgX3N0b3JlZElkTm8gPSBvdi5pZF9ubztcblxuICAvLyBJZGVudGl0eS1jaGFuZ2UgZGV0ZWN0aW9uLiBBbnkgb2YgdGhlc2UgZmllbGQgY2hhbmdlcyB0cmVhdHMgdGhlXG4gIC8vIHNhdmUgYXMgXCJzd2l0Y2hlZCB0byBhIGRpZmZlcmVudCBwZXJzb25cIjpcbiAgLy8gICAtIGlkX25vOiAgICAgICBOSEkgYWNjb3VudCBzd2FwIChhdXRvLWZldGNoZWQgZnJvbSBzZXNzaW9uKVxuICAvLyAgIC0gbmFtZTogICAgICAgIG1hbnVhbGx5IGVkaXRpbmcgbmFtZSAobW9zdCBjb21tb24gaW4gY2xpbmljXG4gIC8vICAgICAgICAgICAgICAgICAgc2V0dGluZzogZG9jdG9yIHN3YXBzIHBhdGllbnRzIG9uIHRoZSBzYW1lIE5ISVxuICAvLyAgICAgICAgICAgICAgICAgIHNlc3Npb24sIG9yIGZpeGVzIGEgd3JvbmcgaWRlbnRpdHkpXG4gIC8vICAgLSBnZW5kZXI6ICAgICAgaWRlbnRpdHktZGVmaW5pbmc7IGFsc28gYWZmZWN0cyBzZXgtc3RyYXRpZmllZFxuICAvLyAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZSByYW5nZXMgZm9yIGxhYnNcbiAgLy8gICAtIGJpcnRoX2RhdGU6ICBzYW1lIHBlcnNvbiBjYW4ndCBoYXZlIHR3byBET0JzXG4gIC8vXG4gIC8vIEFueSBvZiB0aGVzZSBjaGFuZ2luZyBcdTIxOTIgZHJvcCB0aGUgcHJldmlvdXNseS1jYXB0dXJlZCBidW5kbGUgc29cbiAgLy8gdGhlIHVzZXIgY2FuJ3QgYWNjaWRlbnRhbGx5IGRvd25sb2FkIGEgSlNPTiBmaWxlIGxhYmVsbGVkIHdpdGhcbiAgLy8gdGhlIE5FVyBwYXRpZW50J3MgaWRlbnRpdHkgYnV0IHBvcHVsYXRlZCB3aXRoIHRoZSBPTEQgcGF0aWVudCdzXG4gIC8vIG1lZGljYWwgcmVjb3Jkcy4gUEhJIHNhZmV0eSA+IGNvbnZlbmllbmNlIG9mIFwiSSBqdXN0IGZpeGVkIGFcbiAgLy8gdHlwb1wiICh3aGljaCBsb3NlcyBhdCBtb3N0IG9uZSBjbGljayB0byByZS1zeW5jKS5cbiAgY29uc3QgX25vcm0gPSAodikgPT4gKHYgPT0gbnVsbCA/IFwiXCIgOiBTdHJpbmcodikpO1xuICBjb25zdCBwYXRpZW50Q2hhbmdlZCA9ICEhcHJldlN0b3JlZCAmJiAoXG4gICAgX25vcm0ocHJldlN0b3JlZC5pZF9ubykgIT09IF9ub3JtKG92LmlkX25vKSB8fFxuICAgIF9ub3JtKHByZXZTdG9yZWQubmFtZSkgIT09IF9ub3JtKG92Lm5hbWUpIHx8XG4gICAgX25vcm0ocHJldlN0b3JlZC5nZW5kZXIpICE9PSBfbm9ybShvdi5nZW5kZXIpIHx8XG4gICAgX25vcm0ocHJldlN0b3JlZC5iaXJ0aF9kYXRlKSAhPT0gX25vcm0ob3YuYmlydGhfZGF0ZSlcbiAgKTtcblxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwYXRpZW50T3ZlcnJpZGU6IG92IH0pO1xuXG4gIGlmIChwYXRpZW50Q2hhbmdlZCkge1xuICAgIC8vIDEuIGRyb3AgdGhlIHByaW9yIGxvY2FsIEZISVIgYnVuZGxlIChkb3dubG9hZCBidXR0b24gY29udGVudClcbiAgICAvLyAyLiBkcm9wIHRoZSBTVydzIGxhc3Qgc3luYyBzdGF0dXMgc28gdGhlIHJlc3VsdCB6b25lIGRvZXNuJ3RcbiAgICAvLyAgICBrZWVwIHNob3dpbmcgXCJcdTI3MDUgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyBBIFx1NzY4NCA4MSBcdTdCNDZcdTIwMjZcIlxuICAgIC8vIDMuIGRyb3AgdGhlIGluLXBvcHVwIGxhdGVzdC1zdGF0dXMgc25hcHNob3RcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICBhd2FpdCBjaHJvbWUucnVudGltZVxuICAgICAgLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJjbGVhclN5bmNTdGF0dXNcIiB9KVxuICAgICAgLmNhdGNoKCgpID0+IHt9KTtcbiAgICBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbiAgICBzZXRTdGF0dXMoXCJcIiwgbnVsbCk7XG4gIH1cblxuICBfbWFya1N0ZXAyQ29uZmlybWVkKHRydWUpO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIFN1Y2Nlc3NmdWwgc2F2ZSBpcyBUSEUgaW50ZW50aW9uYWwgc3RlcC0yIGNvbXBsZXRpb24gZXZlbnQgXHUyMDE0IHRoaXNcbiAgLy8gaXMgd2hlcmUgdGhlIHdpemFyZCBpcyBhbGxvd2VkIHRvIGFkdmFuY2UgZm9yd2FyZC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX21heWJlQXV0b0FkdmFuY2UoKTtcbiAgLy8gTWFrZSBjbGVhciB0aGlzIGlzIHRoZSBpZGVudGl0eSBzYXZlLCBub3QgYSBtZWRpY2FsLXJlY29yZCBzeW5jIFx1MjAxNFxuICAvLyBcdTMwMENcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcdTMwMERhbG9uZSByZWFkcyBhcyBcInBhdGllbnQgZGF0YVwiIChtZWRpY2FsKSBmb3Igc29tZSB1c2Vycy5cbiAgLy8gX2Rpc3BsYXlJZCBzdXBwcmVzc2VzIHRoZSBhdXRvLVhYWFggcGxhY2Vob2xkZXIgKG5vIHZhbHVlIHRvIHRoZVxuICAvLyB1c2VyKSBidXQga2VlcHMgdGhlIG1hc2tlZCByZWFsIGNpZCAoUDEyMzQ1KioqKikgd2hlbiBpdCdzXG4gIC8vIGF2YWlsYWJsZSBcdTIwMTQgY29uZmlybXMgd2UgY2FwdHVyZWQgdGhlaXIgYWN0dWFsIGlkZW50aXR5LlxuICBjb25zdCBpZExhYmVsID0gX2Rpc3BsYXlJZChvdi5pZF9ubyk7XG4gIGNvbnN0IHRhaWwgPSBpZExhYmVsID8gYCBcdTAwQjcgJHtpZExhYmVsfWAgOiBcIlwiO1xuICBzZXRTdGF0dXMoYFx1MjcwNSBcdTc1QzVcdTRFQkFcdThFQUJcdTRFRkRcdTVERjJcdThBMThcdTRGNEZcdUZGMUEke19tYXliZU1hc2sob3YubmFtZSl9JHt0YWlsfWAsIFwic3VjY2Vzc1wiKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInBhdGllbnRPdmVycmlkZVwiKTtcbiAgX3N0b3JlZElkTm8gPSBudWxsO1xuICBlbHMub3ZOYW1lLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92QmlydGhEYXRlLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92R2VuZGVyLnZhbHVlID0gXCJcIjtcbiAgX21hcmtTdGVwMkNvbmZpcm1lZChmYWxzZSk7XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgc2V0U3RhdHVzKFwiXHU1REYyXHU2RTA1XHU5NjY0XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCIsIFwiaW5mb1wiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgY29ubmVjdGlvbiBzdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBTaW5nbGUgc291cmNlIG9mIHRydXRoOiBgX2Nvbm5TdGF0ZWAgcmVmbGVjdHMgdGhlIGxhdGVzdCBiYWNrZW5kXG4vLyBjb25uZWN0aXZpdHkgY2hlY2suIEJvdGggdGhlIGJhbm5lciBVSSBhbmQgdGhlIGVuYWJsZWQtc3RhdGUgb2YgdGhlXG4vLyBcdUQ4M0RcdURDRTUgU3luYyAvIFx1RDgzRFx1REU4MCBMYXVuY2ggYnV0dG9ucyByZWFkIGZyb20gaXQuXG4vL1xuLy8gU3RhdGVzOlxuLy8gICBcInVua25vd25cIiAgXHUyMDE0IG5vdCB5ZXQgY2hlY2tlZCAoZS5nLiBmaXJzdCBwYWludCBpbiBsb2NhbCBtb2RlKVxuLy8gICBcImNoZWNraW5nXCIgXHUyMDE0IGZldGNoIGluIGZsaWdodFxuLy8gICBcIm9rXCIgICAgICAgXHUyMDE0IEdFVCAvZmhpci9tZXRhZGF0YSByZXR1cm5lZCBhIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFxuLy8gICBcImZhaWxcIiAgICAgXHUyMDE0IGFueXRoaW5nIGVsc2U7IGBfY29ubkZhaWxSZWFzb25gIGNhcnJpZXMgZGV0YWlsXG4vL1xuLy8gQmFja2VuZCBjb25uZWN0aXZpdHkgaXMgdHJlYXRlZCBhcyBhICpwcmVyZXF1aXNpdGUqIGZvciBiYWNrZW5kIG1vZGUsXG4vLyBub3QgYXMgYSBwZXItYWN0aW9uIGNoZWNrLiBTd2l0Y2hpbmcgdG8gYmFja2VuZCBtb2RlIHRyaWdnZXJzIGEgdGVzdFxuLy8gaW1tZWRpYXRlbHk7IGZhaWx1cmUgc2hvd3MgYSBiYW5uZXIgd2l0aCBhY3Rpb25hYmxlIGd1aWRhbmNlIGFuZFxuLy8gZGlzYWJsZXMgYm90aCBhY3Rpb24gYnV0dG9ucyB1bnRpbCBjb25uZWN0aXZpdHkgcmVjb3ZlcnMuXG5cbmxldCBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7XG5sZXQgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDsgLy8geyBraW5kOiBcIm5vLXBlcm1pc3Npb25cIiB8IFwibm8tdXJsXCIgfCBcIm5ldHdvcmtcIiB8IFwidGltZW91dFwiIHwgXCJodHRwXCIgfCBcIm5vdC1maGlyXCIsIGRldGFpbD8gfVxuXG4vLyBCYW5uZXIgY29weS4gRHJvcCB0aGUgbGVhZGluZyBcdTI3MTcgXHUyMDE0IHRoZSByZWQgZG90IGxlZnQgb2YgdGhlIHRleHQgaXNcbi8vIGFscmVhZHkgdGhlIFwiZmFpbFwiIHNpZ25hbCwgYW5kIHRoZSByb3cgd2FzIHJlYWRpbmcgXCJcdTI1Q0YgXHUyNzE3IFx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiXG4vLyA9IHRocmVlIGluZGljYXRvcnMgc3RhY2tlZC5cbmNvbnN0IF9DT05OX0xBQkVMUyA9IHtcbiAgdW5rbm93bjogXCJcdTVDMUFcdTY3MkFcdTZBQTJcdTY3RTVcIixcbiAgY2hlY2tpbmc6IFwiXHU3OEJBXHU4QThEXHU0RTJEXHUyMDI2XCIsXG4gIG9rOiAoKSA9PiBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gLFxuICBmYWlsOiAoKSA9PiB7XG4gICAgY29uc3QgciA9IF9jb25uRmFpbFJlYXNvbiB8fCB7fTtcbiAgICByZXR1cm4gKHtcbiAgICAgIFwibm8tdXJsXCI6IFwiXHU2NzJBXHU4QTJEXHU1QjlBIEJhY2tlbmQgVVJMXCIsXG4gICAgICBcIm5vLXBlcm1pc3Npb25cIjogXCJcdTY3MkFcdTYzODhcdTZCMEFcdTkwMjNcdTdEREFcIixcbiAgICAgIFwibmV0d29ya1wiOiBcIlx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiLFxuICAgICAgXCJ0aW1lb3V0XCI6IFwiXHU5MDIzXHU3RERBXHU5MDNFXHU2NjQyXCIsXG4gICAgICBcImh0dHBcIjogYEhUVFAgJHtyLmRldGFpbCB8fCBcIlwifWAudHJpbSgpLFxuICAgICAgXCJub3QtZmhpclwiOiBcIlx1NTZERVx1NjFDOVx1NEUwRFx1NjYyRiBGSElSXCIsXG4gICAgfSlbci5raW5kXSA/PyBcIlx1OTAyM1x1N0REQVx1NTkzMVx1NjU1N1wiO1xuICB9LFxufTtcblxuY29uc3QgX0NPTk5fSEVMUCA9IHtcbiAgXCJuby11cmxcIjogICAgICAgIFwiXHU4QUNCXHU1MjMwXHUzMDBDXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBXHUzMDBEXHU1ODZCXHU1MTY1IEJhY2tlbmQgVVJMXHVGRjBDXHU0RjhCXHU1OTgyIDxjb2RlPmh0dHA6Ly9sb2NhbGhvc3Q6ODAxMDwvY29kZT5cdTMwMDJcIixcbiAgXCJuby1wZXJtaXNzaW9uXCI6IFwiQ2hyb21lIFx1OTYzQlx1NjRDQlx1NEU4Nlx1OERFOFx1NEY4Nlx1NkU5MFx1OEFDQlx1NkM0Mlx1MzAwMlx1OEFDQlx1OTFDRFx1NjVCMFx1OTU4QiBwb3B1cFx1RkYwQ1x1NzU3Nlx1NkIwQVx1OTY1MFx1NUMwRFx1OEE3MVx1Njg0Nlx1OERGM1x1NTFGQVx1NjY0Mlx1NjMwOVx1MzAwQ1x1NTE0MVx1OEEzMVx1MzAwRFx1MzAwMlwiLFxuICBcIm5ldHdvcmtcIjogICAgICAgXCJcdTVGOENcdTdBRUZcdTUzRUZcdTgwRkRcdTkwODRcdTZDOTJcdTU1NUZcdTUyRDVcdTMwMDJcdThBQ0JcdTU3RjdcdTg4NENcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgdXAgLWQ8L2NvZGU+PGJyPlx1NzhCQVx1OEE4RCBiYWNrZW5kIFx1NUJCOVx1NTY2OFx1OEREMVx1OEQ3N1x1NEY4Nlx1NTE4RFx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcInRpbWVvdXRcIjogICAgICAgXCI1IFx1NzlEMlx1NTE2N1x1NkM5Mlx1NjUzNlx1NTIzMFx1NTZERVx1NjFDOSBcdTIwMTQgYmFja2VuZCBcdTUzRUZcdTgwRkRcdTkwODRcdTU3MjhcdTU1NUZcdTUyRDVcdTRFMkRcdUZGMENcdTdCNDkgMzAgXHU3OUQyXHU1MThEXHU2MzA5XHU5MUNEXHU4QTY2XHUzMDAyXCIsXG4gIFwiaHR0cFwiOiAgICAgICAgICBcIkJhY2tlbmQgXHU1NkRFXHU2MUM5XHU5MzJGXHU4QUE0XHU3MkMwXHU2MTRCXHU3OEJDXHUzMDAyXHU2QUEyXHU2N0U1IGJhY2tlbmQgXHU3Njg0IGxvZ1x1RkYxQTxicj48Y29kZT5kb2NrZXIgY29tcG9zZSBsb2dzIGJhY2tlbmQ8L2NvZGU+XCIsXG4gIFwibm90LWZoaXJcIjogICAgICBcIlx1OTAxOVx1NTAwQiBVUkwgXHU1NkRFXHU0RTg2XHU2NzcxXHU4OTdGXHVGRjBDXHU0RjQ2XHU0RTBEXHU2NjJGIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFx1MzAwMlx1NzhCQVx1OEE4RCBCYWNrZW5kIFVSTCBcdTYzMDdcdTU0MTEgTkhJLUZISVItQnJpZGdlIFx1NzY4NCAvZmhpciBcdTY4MzlcdTc2RUVcdTkzMDRcdTMwMDJcIixcbn07XG5cbmZ1bmN0aW9uIF9yZW5kZXJDb25uQmFubmVyKCkge1xuICBjb25zdCBiYW5uZXIgPSBlbHMuY29ubkJhbm5lcjtcbiAgaWYgKCFiYW5uZXIpIHJldHVybjtcbiAgYmFubmVyLmRhdGFzZXQuc3RhdGUgPSBfY29ublN0YXRlO1xuICAvLyBNaXJyb3Igc3RhdGUgb250byB0aGUgb3V0ZXIgLmNvbm4tYmxvY2sgc28gdGhlIHdyYXBwZXIgYm9yZGVyXG4gIC8vICh3aGljaCBob2xkcyBiYW5uZXIgKyBoZWxwIGJvZHkgaW5zaWRlIE9ORSBjYXJkKSB0cmFja3MgdGhlIHNhbWVcbiAgLy8gY29sb3IgdGhlIGJhbm5lciBpcyB1c2luZy5cbiAgaWYgKGVscy5jb25uU2VjdGlvbikgZWxzLmNvbm5TZWN0aW9uLmRhdGFzZXQuc3RhdGUgPSBfY29ublN0YXRlO1xuICBjb25zdCBsYWJlbCA9IF9DT05OX0xBQkVMU1tfY29ublN0YXRlXTtcbiAgZWxzLmNvbm5Nc2cudGV4dENvbnRlbnQgPSB0eXBlb2YgbGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IGxhYmVsKCkgOiBsYWJlbDtcbiAgZWxzLmNvbm5SZXRyeUJ0bi5oaWRkZW4gPSBfY29ublN0YXRlICE9PSBcImZhaWxcIjtcbiAgaWYgKF9jb25uU3RhdGUgPT09IFwiZmFpbFwiICYmIF9jb25uRmFpbFJlYXNvbj8ua2luZCkge1xuICAgIGVscy5jb25uSGVscC5oaWRkZW4gPSBmYWxzZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gX0NPTk5fSEVMUFtfY29ubkZhaWxSZWFzb24ua2luZF0gPz8gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gdHJ1ZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gXCJcIjtcbiAgfVxuXG4gIC8vIENvbXBhY3QtcGlsbCB2cyBmdWxsLWJhbm5lciBzd2FwOiB3aGVuIGV2ZXJ5dGhpbmcncyBmaW5lLCBzaHJpbmsgdG9cbiAgLy8gYSBzbWFsbCBncmVlbiBwaWxsIGluIHRoZSBoZWFkZXIgc28gdGhlIHBvcHVwIGJvZHkgaGFzIG1vcmUgcm9vbVxuICAvLyBmb3IgYWN0aW9uYWJsZSBjb250ZW50LiBBbnl0aGluZyBlbHNlICh1bmtub3duIC8gY2hlY2tpbmcgLyBmYWlsKVxuICAvLyBrZWVwcyB0aGUgZnVsbCBiYW5uZXIgc28gcHJvZ3Jlc3MgKyBlcnJvciBoZWxwIGhhcyBzcGFjZSB0byByZW5kZXIuXG4gIGNvbnN0IGlzT2sgPSBfY29ublN0YXRlID09PSBcIm9rXCI7XG4gIGlmIChlbHMuY29ublNlY3Rpb24pIGVscy5jb25uU2VjdGlvbi5oaWRkZW4gPSBpc09rO1xuICBpZiAoZWxzLmNvbm5NaW5pKSB7XG4gICAgZWxzLmNvbm5NaW5pLmhpZGRlbiA9ICFpc09rO1xuICAgIGlmIChpc09rKSBlbHMuY29ubk1pbmkudGl0bGUgPSBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCAzLXN0ZXAgd2l6YXJkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIENvbmNlcHR1YWxseTpcbi8vICAgU3RlcCAxIFx1MjAxNCBcdTc2N0JcdTUxNjVcdUZGMUFvbiBOSEkgdGFiICsgc2Vzc2lvbiB0b2tlbiBpcyB2YWxpZFxuLy8gICBTdGVwIDIgXHUyMDE0IFx1OEEyRFx1NUI5QVx1RkYxQWdlbmRlciBmaWxsZWQgKyAobW9kZT09bG9jYWwgT1IgYmFja2VuZCByZWFjaGFibGUpXG4vLyAgICAgICAgICAgICAgICArIGJpcnRoX2RhdGUgaWYgZW50ZXJlZCBtdXN0IGJlIHZhbGlkXG4vLyAgIFN0ZXAgMyBcdTIwMTQgXHU1M0Q2XHU1Rjk3XHVGRjFBdGhlIGFjdGlvbiBpdHNlbGYgKHN5bmMgQ1RBLCBzdGF0dXMsIHJlc3VsdHMpXG4vL1xuLy8gU3RlcHMgYXV0by1hZHZhbmNlIHdoZW4gdGhlaXIgcHJlY29uZGl0aW9uIGZsaXBzIGdyZWVuOyB1c2VycyBjYW5cbi8vIGNsaWNrIHRoZSBzdGVwcGVyIHRvIHJldmlzaXQgYW55IHN0ZXAuIFdlIG5ldmVyIGF1dG8tc3RlcCBCQUNLIG9uXG4vLyBzdGF0ZSBjaGFuZ2UgXHUyMDE0IG9uY2UgdGhlIHVzZXIgaGFzIG1vdmVkIGZvcndhcmQsIG9ubHkgYW4gZXhwbGljaXRcbi8vIHN0ZXBwZXIgY2xpY2sgYnJpbmdzIHRoZW0gYmFjay4gT3RoZXJ3aXNlIG9wZW5pbmcgdGhlIHBvcHVwIG1pZC1cbi8vIHN5bmMgd291bGQgamVyayB0aGVtIGJhY2sgdG8gc3RlcCAxLlxubGV0IF9hY3RpdmVTdGVwID0gMTtcbmxldCBfd2l6YXJkSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbi8vIFN0ZXAgMiBpcyBcImRvbmVcIiBvbmx5IGFmdGVyIHRoZSB1c2VyIGhhcyBjbGlja2VkIFx1MjcxMyBcdTc4QkFcdTVCOUEgd2l0aCB2YWxpZFxuLy8gaW5wdXRzLiBXZSB0cmFjayB0aGlzIHdpdGggYSBib29sZWFuIHJhdGhlciB0aGFuIHJlYWRpbmcgbGl2ZSBET01cbi8vIHN0YXRlIFx1MjAxNCBvdGhlcndpc2UgdGhlIHdpemFyZCB3b3VsZCBhdXRvLWFkdmFuY2UgdGhlIG1vbWVudCB0aGVcbi8vIGZpZWxkcyBoYXBwZW5lZCB0byBsb29rIHJpZ2h0LCBiZWZvcmUgdGhlIHVzZXIgaGFkIGEgY2hhbmNlIHRvXG4vLyByZXZpZXcuIEZsaXBwZWQgdHJ1ZSBpbiBzYXZlUGF0aWVudE92ZXJyaWRlIHN1Y2Nlc3MsIGZhbHNlIGluXG4vLyBjbGVhclBhdGllbnRPdmVycmlkZSBhbmQgb24gYSBsb2FkIHRoYXQgeWllbGRzIG5vIHNhdmVkIHJlY29yZC5cbmxldCBfc3RlcDJDb25maXJtZWQgPSBmYWxzZTtcblxuLy8gU3RlcCBudW1iZXIgcmVuZGVyZWQgYXMgYSBjaXJjbGVkIGRpZ2l0IGdseXBoIFx1MjAxNCBtYXRjaGVzIHRoZVxuLy8gXCJcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NVwiIGNvcHkgZWxzZXdoZXJlIGluIHRoZSBwb3B1cCBhbmQgdGhlIHdpemFyZCBzdGVwcGVyIGxhYmVscy5cbmZ1bmN0aW9uIF9zdGVwTnVtR2x5cGgobikge1xuICByZXR1cm4gbiA9PT0gMSA/IFwiXHUyNDYwXCIgOiBuID09PSAyID8gXCJcdTI0NjFcIiA6IG4gPT09IDMgPyBcIlx1MjQ2MlwiIDogXCJcdTI0NjNcIjtcbn1cblxuZnVuY3Rpb24gX21hcmtTdGVwMkNvbmZpcm1lZCh5ZXMpIHtcbiAgX3N0ZXAyQ29uZmlybWVkID0gISF5ZXM7XG59XG5cbmZ1bmN0aW9uIF9pc1N0ZXBEb25lKHN0ZXApIHtcbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBzd2l0Y2ggKHN0ZXApIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gb25OaGkgJiYgbG9nZ2VkSW47XG4gICAgY2FzZSAyOlxuICAgICAgLy8gQ29uZmlybWVkID0gdXNlciBjbGlja2VkIFx1MjcxMyBcdTc4QkFcdTVCOUEgQU5EIHRoZSBvdmVycmlkZSBpcyBjdXJyZW50bHlcbiAgICAgIC8vIHZhbGlkIChzbyByZXZpc2l0cyB3aXRoIGEgbm93LWludmFsaWQgb3ZlcnJpZGUgZG9uJ3Qgc2hvdyBhXG4gICAgICAvLyBmYWxzZSBncmVlbiBjaGVjaykuXG4gICAgICByZXR1cm4gX3N0ZXAyQ29uZmlybWVkO1xuICAgIGNhc2UgMzpcbiAgICAgIC8vIERvbmUgPSBhIHBlbmRpbmcgRkhJUiBidW5kbGUgZXhpc3RzIChzeW5jIHN1Y2NlZWRlZCkuIFRoZVxuICAgICAgLy8gZG93bmxvYWQgVUkgaW5zaWRlIHN0ZXAgMyBzdGF5cyB2aXNpYmxlIFx1MjAxNCB0aGlzIGZsYWcgZXhpc3RzXG4gICAgICAvLyBwdXJlbHkgc28gdGhlIHN0ZXBwZXIgc2hvd3MgXHUyNzEzIG9uIHN0ZXAgMyBvbmNlIGRhdGEgaXMgcmVhZHksXG4gICAgICAvLyBsZXR0aW5nIHRoZSB1c2VyIGp1bXAgZm9yd2FyZCB0byBzdGVwIDQgKG9wZW4gU01BUlQgQXBwKS5cbiAgICAgIC8vIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiBpcyB0aGUgc291cmNlIG9mIHRydXRoIFx1MjAxNCByZWZyZXNoZWRcbiAgICAgIC8vIGJ5IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCkgd2hlbmV2ZXIgdGhlIHNlc3Npb24tc3Rhc2ggY2hhbmdlcy5cbiAgICAgIHJldHVybiAhIWVscy5wZW5kaW5nQnVuZGxlICYmICFlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW47XG4gICAgY2FzZSA0OlxuICAgICAgLy8gVGVybWluYWwgc3RlcC4gVGhlIFwiZG9uZW5lc3NcIiBpcyB0aGUgdXNlciBvcGVuaW5nIHRoZSBTTUFSVFxuICAgICAgLy8gQXBwLCB3aGljaCB3ZSBjYW4ndCBvYnNlcnZlOyBsZWF2aW5nIGFzIGZhbHNlIGtlZXBzIHRoZVxuICAgICAgLy8gc3RlcHBlciBmcm9tIHNob3dpbmcgYSBtaXNsZWFkaW5nIFx1MjcxMyBiZWZvcmUgdGhleSd2ZSBhY3R1YWxseVxuICAgICAgLy8gdmlld2VkIGFueXRoaW5nLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3NldEFjdGl2ZVN0ZXAobiwgb3B0cyA9IHt9KSB7XG4gIGNvbnN0IGNsYW1wZWQgPSBNYXRoLm1heCgxLCBNYXRoLm1pbig0LCBuKSk7XG4gIF9hY3RpdmVTdGVwID0gY2xhbXBlZDtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LmFjdGl2ZVN0ZXAgPSBTdHJpbmcoY2xhbXBlZCk7XG4gIF9yZWZyZXNoV2l6YXJkVWkoKTtcbiAgaWYgKCFvcHRzLnNpbGVudCkge1xuICAgIC8vIEF1dG8tc2Nyb2xsIHRoZSBwb3B1cCB0byB0aGUgdG9wIG9mIHRoZSBzdGVwIHNvIHVzZXJzIGFsd2F5c1xuICAgIC8vIHNlZSB0aGUgc3RlcCBoZWFkZXIgLyBmaXJzdCBpbnB1dCBhZnRlciBuYXZpZ2F0aW9uLlxuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6IFwic21vb3RoXCIgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlZnJlc2hXaXphcmRVaSgpIHtcbiAgaWYgKCFlbHMud2l6YXJkU3RlcHBlcikgcmV0dXJuO1xuICBjb25zdCBsaXMgPSBlbHMud2l6YXJkU3RlcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwibGlbZGF0YS1zdGVwXVwiKTtcbiAgZm9yIChjb25zdCBsaSBvZiBsaXMpIHtcbiAgICBjb25zdCBuID0gTnVtYmVyKGxpLmRhdGFzZXQuc3RlcCk7XG4gICAgY29uc3QgaXNBY3RpdmUgPSBuID09PSBfYWN0aXZlU3RlcDtcbiAgICBjb25zdCBpc0RvbmUgPSBfaXNTdGVwRG9uZShuKTtcbiAgICBpZiAoaXNBY3RpdmUpIGxpLnNldEF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiLCBcInRydWVcIik7XG4gICAgZWxzZSBsaS5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWN1cnJlbnRcIik7XG4gICAgaWYgKGlzRG9uZSkgbGkuZGF0YXNldC5kb25lID0gXCJ0cnVlXCI7XG4gICAgZWxzZSBkZWxldGUgbGkuZGF0YXNldC5kb25lO1xuICB9XG4gIC8vIFN0ZXAgMSdzIHRocmVlIHN1Yi1jYXJkcyAob2ZmLW5oaSAvIG5lZWRzLWxvZ2luIC8gbG9naW4tb2spIGFyZVxuICAvLyBtdXR1YWxseSBleGNsdXNpdmUgXHUyMDE0IHBpY2sgdGhlIG9uZSB0aGF0IG1hdGNoZXMgY3VycmVudCBzdGF0ZS5cbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBpZiAoZWxzLm9wZW5OaGlTZWN0aW9uKVxuICAgIGVscy5vcGVuTmhpU2VjdGlvbi5oaWRkZW4gPSBvbk5oaTtcbiAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbilcbiAgICBlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24uaGlkZGVuID0gIW9uTmhpIHx8IGxvZ2dlZEluO1xuICBpZiAoZWxzLmxvZ2luT2tTZWN0aW9uKVxuICAgIGVscy5sb2dpbk9rU2VjdGlvbi5oaWRkZW4gPSAhKG9uTmhpICYmIGxvZ2dlZEluKTtcblxuICBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbn1cblxuLy8gU2hvdy9oaWRlIHN0ZXAtMyByZXN1bHQgY2FyZHMgYmFzZWQgb24gd2hldGhlciBlYWNoIGhhcyBjb250ZW50LlxuLy8gRW1wdHkgY2FyZHMgKGUuZy4gYSBzdW1tYXJ5IGNhcmQgd2l0aCBubyBzdGF0dXMgKyBubyBkYXRhLXN0YXRlIGluXG4vLyBsb2NhbCBtb2RlIHByZS1zeW5jKSB1c2VkIHRvIHJlbmRlciBhcyBhIGJsYW5rIHN0cmlwZSBcdTIwMTQgbm93IHRoZXlcbi8vIHN0YXkgY29sbGFwc2VkIGluZGl2aWR1YWxseSwgYW5kIHRoZSB3aG9sZSB6b25lIGdvZXMgYXdheSB3aGVuIGFsbFxuLy8gdGhyZWUgY2FyZHMgd291bGQgYmUgZW1wdHkuXG5mdW5jdGlvbiBfcmVmcmVzaFJlc3VsdFpvbmUoKSB7XG4gIGlmICghZWxzLnJlc3VsdFpvbmUpIHJldHVybjtcbiAgY29uc3QgaGFzU3RhdHVzID0gKGVscy5zdGF0dXM/LnRleHRDb250ZW50ID8/IFwiXCIpLnRyaW0oKSAhPT0gXCJcIjtcbiAgY29uc3QgZGF0YVN0YXRlU2hvd24gPVxuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uICYmICFlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW47XG4gIGNvbnN0IGJ1bmRsZVNob3duID1cbiAgICBlbHMucGVuZGluZ0J1bmRsZSAmJiAhZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuO1xuICAvLyBMYXVuY2ggYnV0dG9uIG9ubHkgY291bnRzIHdoZW4gdXNhYmxlIFx1MjAxNCBiYWNrZW5kIG1vZGUgKyB0aGUgcGF0aWVudFxuICAvLyBhY3R1YWxseSBleGlzdHMgb24gdGhlIGJhY2tlbmQgKGBsYXVuY2hCdG4uZGlzYWJsZWQgPT09IGZhbHNlYCkuXG4gIC8vIEEgcGVybWEtZGlzYWJsZWQgYnV0dG9uIHNob3VsZG4ndCBwaW4gdGhlIHpvbmUgb3Blbi5cbiAgY29uc3QgbGF1bmNoVXNhYmxlID1cbiAgICBjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBlbHMubGF1bmNoQnRuICYmICFlbHMubGF1bmNoQnRuLmRpc2FibGVkO1xuXG4gIC8vIEhpZGUgdGhlIGVudGlyZSByZXN1bHQgc2VjdGlvbiAodGhlIGRpdmlkZXIgKyBldmVyeXRoaW5nIGFmdGVyKSB3aGVuXG4gIC8vIHRoZXJlJ3Mgbm90aGluZyBtZWFuaW5nZnVsIHRvIHNob3cuXG4gIGVscy5yZXN1bHRab25lLmhpZGRlbiA9ICEoaGFzU3RhdHVzIHx8IGJ1bmRsZVNob3duIHx8IGRhdGFTdGF0ZVNob3duIHx8IGxhdW5jaFVzYWJsZSk7XG5cbiAgLy8gQnVuZGxlIGZpbGVuYW1lIC8gc2l6ZSBibG9jayBmb2xsb3dzIGJ1bmRsZSB2aXNpYmlsaXR5LlxuICBpZiAoZWxzLmJ1bmRsZU1ldGFCbG9jaykge1xuICAgIGVscy5idW5kbGVNZXRhQmxvY2suaGlkZGVuID0gIWJ1bmRsZVNob3duO1xuICB9XG4gIC8vIExhdW5jaCBidXR0b24gaGlkZS13aGVuLW5vdC11c2FibGUgc28gdGhlIC5uZXh0LWFjdGlvbnMgcm93XG4gIC8vIGRvZXNuJ3Qgc2hvdyBhIHBlcm1hLWRpc2FibGVkIG91dGxpbmUgYnV0dG9uIG5leHQgdG8gbm90aGluZy5cbiAgaWYgKGVscy5sYXVuY2hCdG4pIHtcbiAgICBlbHMubGF1bmNoQnRuLmhpZGRlbiA9IGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiIHx8ICFsYXVuY2hVc2FibGU7XG4gIH1cblxuICAvLyBEZW1vdGUgdGhlIFx1NTNENlx1NUY5NyBDVEEgb25jZSB3ZSBoYXZlIGEgcmVzdWx0ICsgYSB1c2FibGUgbmV4dC1zdGVwXG4gIC8vIGFjdGlvbi4gVGhlIFwicHJpbWFyeSBhY3Rpb25cIiBiYXRvbiBwYXNzZXMgdG8gXHU0RTBCXHU4RjA5IC8gXHU5NThCXHU1NTVGIEFwcCBzb1xuICAvLyB0aGUgdXNlcidzIGV5ZSBsYW5kcyBvbiB3aGF0J3MgbmV4dCwgbm90IG9uIFwicmVkbyB0aGUgdGhpbmdcIi5cbiAgY29uc3QgaGFzUmVzdWx0QXJ0aWZhY3QgPSBidW5kbGVTaG93biB8fCBsYXVuY2hVc2FibGU7XG4gIGlmIChlbHMuc3luY0FwaUJ0bikge1xuICAgIGNvbnN0IHNob3VsZERlbW90ZSA9IGhhc1Jlc3VsdEFydGlmYWN0ICYmICFlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZDtcbiAgICBlbHMuc3luY0FwaUJ0bi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtc2Vjb25kYXJ5XCIsIHNob3VsZERlbW90ZSk7XG4gICAgLy8gUmVsYWJlbCB0byBtYXRjaCB0aGUgbmV3IHJvbGUuIFdoaWxlIHRoZSBzeW5jIGlzIHJ1bm5pbmcgd2Uga2VlcFxuICAgIC8vIHRoZSBwcm9tcHQgbWlkLXJlbmRlciB0ZXh0IGFsb25lIChhcHBseVN5bmNTdGF0dXMgb3ducyB0aGF0KS5cbiAgICBpZiAoIV9sYXRlc3RTdGF0dXM/LnJ1bm5pbmcpIHtcbiAgICAgIGVscy5zeW5jQXBpQnRuLnRleHRDb250ZW50ID0gc2hvdWxkRGVtb3RlXG4gICAgICAgID8gXCJcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIlxuICAgICAgICA6IFwiXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XCI7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9tYXliZUF1dG9BZHZhbmNlKCkge1xuICAvLyBPbmx5IGFkdmFuY2UgZm9yd2FyZCwgbmV2ZXIgYmFjay4gU2F2ZSB1c2VyJ3MgcGxhY2UgaWYgdGhleSd2ZVxuICAvLyBjbGlja2VkIGludG8gYSBsYXRlciBzdGVwIG1hbnVhbGx5LlxuICAvL1xuICAvLyBEZWxpYmVyYXRlbHkgZG8gTk9UIGF1dG8tYWR2YW5jZSAzIFx1MjE5MiA0LiBTdGVwIDMgY29udGFpbnMgdGhlXG4gIC8vIFwiXHUyNzA1IFx1NURGMlx1NzUyMlx1NzUxRiBOIFx1N0I0NiBcdTAwQjcgXHVEODNEXHVEQ0U1IFx1NEUwQlx1OEYwOVwiIHN1Y2Nlc3Mgc3RhdGUgXHUyMDE0IGp1bXBpbmcgdGhlIHVzZXIgcGFzdFxuICAvLyB0aGF0IHRoZSBtb21lbnQgc3luYyBjb21wbGV0ZXMgd291bGQgc3RlYWwgdGhlIG1vbWVudCB0aGV5J3JlXG4gIC8vIHdhaXRpbmcgMzAgc2Vjb25kcyBmb3IuIFRoZXkgY2xpY2sgc3RlcCA0IChvciB0aGUgc3RlcHBlciBpdGVtKVxuICAvLyB0aGVtc2VsdmVzIHdoZW4gdGhleSdyZSByZWFkeSB0byBvcGVuIHRoZSBTTUFSVCBBcHAuXG4gIGlmIChfYWN0aXZlU3RlcCA9PT0gMSAmJiBfaXNTdGVwRG9uZSgxKSkgX3NldEFjdGl2ZVN0ZXAoMik7XG4gIGVsc2UgaWYgKF9hY3RpdmVTdGVwID09PSAyICYmIF9pc1N0ZXBEb25lKDIpKSBfc2V0QWN0aXZlU3RlcCgzKTtcbn1cblxuZnVuY3Rpb24gX2luaXRXaXphcmQoKSB7XG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIHJldHVybjtcbiAgX3dpemFyZEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgLy8gSW5pdGlhbCBzdGVwOiB3aGljaGV2ZXIgaXMgdGhlIEZJUlNUIG5vdC15ZXQtZG9uZSBzdGVwIGF0IHBvcHVwIG9wZW4uXG4gIC8vIEZpcnN0LXRpbWUgdXNlciBcdTIxOTIgc3RlcCAxLiBSZXR1cm5pbmcgdXNlciB3aXRoIHZhbGlkIHNlc3Npb24gKyBzYXZlZFxuICAvLyBwYXRpZW50IFx1MjE5MiBzdGVwIDMuIElmIGEgZnJlc2ggYnVuZGxlIGlzIHNpdHRpbmcgaW4gc2Vzc2lvbi1zdG9yYWdlXG4gIC8vIChzeW5jIGRvbmUgaW4gYSBwcmlvciBwb3B1cCBvcGVuIG9mIHRoZSBzYW1lIGJyb3dzZXIgc2Vzc2lvbikgXHUyMTkyXG4gIC8vIHN0ZXAgNCwgc28gdGhlIG5hdHVyYWwgbmV4dCBhY3Rpb24gXHUyMDE0IFwib3BlbiBTTUFSVCBBcHBcIiBcdTIwMTQgaXMgdmlzaWJsZS5cbiAgbGV0IHN0YXJ0O1xuICBpZiAoIV9pc1N0ZXBEb25lKDEpKSBzdGFydCA9IDE7XG4gIGVsc2UgaWYgKCFfaXNTdGVwRG9uZSgyKSkgc3RhcnQgPSAyO1xuICBlbHNlIGlmICghX2lzU3RlcERvbmUoMykpIHN0YXJ0ID0gMztcbiAgZWxzZSBzdGFydCA9IDQ7XG4gIF9zZXRBY3RpdmVTdGVwKHN0YXJ0LCB7IHNpbGVudDogdHJ1ZSB9KTtcblxuICAvLyBTdGVwcGVyIGNsaWNrcyBcdTIxOTIganVtcFxuICBmb3IgKGNvbnN0IGxpIG9mIGVscy53aXphcmRTdGVwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVtkYXRhLXN0ZXBdXCIpKSB7XG4gICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IF9zZXRBY3RpdmVTdGVwKE51bWJlcihsaS5kYXRhc2V0LnN0ZXApKSk7XG4gICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiIHx8IGUua2V5ID09PSBcIiBcIikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIF9zZXRBY3RpdmVTdGVwKE51bWJlcihsaS5kYXRhc2V0LnN0ZXApKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaEJ1dHRvblN0YXRlcygpIHtcbiAgLy8gU3luYyBidXR0b24uIENvbmRpdGlvbnMsIGluIHByaW9yaXR5IG9yZGVyOlxuICAvLyAgIDEuIG9uIGFuIE5ISSB0YWJcbiAgLy8gICAyLiBsb2dnZWQgaW4gdG8gTkhJIChkZXRlY3RlZCB2aWEgYmFja2dyb3VuZCBwcmUtZmxpZ2h0KVxuICAvLyAgIDMuIGJhY2tlbmQgbW9kZSBcdTIxOTIgYmFja2VuZCBjb25uZWN0ZWRcbiAgLy8gICA0LiBnZW5kZXIgZmlsbGVkIChvdGhlciBwYXRpZW50IGZpZWxkcyBhbGwgb3B0aW9uYWwpXG4gIC8vIFdoYXRldmVyIGJsb2NrcyB0aGUgQ1RBIGFsc28gZ2V0cyBzdXJmYWNlZCBhcyBhbiBpbmxpbmUgbWVzc2FnZVxuICAvLyBiZWxvdyB0aGUgYnV0dG9uIFx1MjAxNCB0b29sdGlwcyBhcmUgaW52aXNpYmxlIGluIHRoZSAzNjBweCBwb3B1cC5cbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBjb25zdCBtb2RlT2sgPSBjdXJyZW50TW9kZSgpID09PSBcImxvY2FsXCIgfHwgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICAvLyBTdGVwIDIgaGFyZCByZXF1aXJlbWVudHM6IGdlbmRlciwgYmlydGhfZGF0ZSAodmFsaWQpLCBhbmQgbmFtZS5cbiAgLy8gVHJhY2tlZCBhcyBvbmUgcm9sbGVkLXVwIGZsYWcgc28gdGhlIGJsb2NrZWQtQ1RBIHN0cmlwIHNheXNcbiAgLy8gXCJjb21wbGV0ZSB0aGUgYmFzaWMgaW5mb1wiIGdlbmVyaWNhbGx5IHJlZ2FyZGxlc3Mgb2Ygd2hpY2ggZmllbGRcbiAgLy8gaXMgbWlzc2luZyBmaXJzdC5cbiAgY29uc3Qgc3RlcDJCYXNpY09rID0gISFlbHMub3ZHZW5kZXI/LnZhbHVlICYmICEhZWxzLm92TmFtZT8udmFsdWU/LnRyaW0oKTtcbiAgY29uc3QgZG9iRXJyb3IgPSB2YWxpZGF0ZUJpcnRoRGF0ZSgpO1xuXG4gIC8vIEVhY2ggYmxvY2tpbmcgcmVhc29uIG5hbWVzIHRoZSBzdGVwIHRoYXQgbmVlZHMgYXR0ZW50aW9uLiBNb2RlICtcbiAgLy8gY29ubmVjdGlvbiBub3cgbGl2ZSBpbiBzdGVwIDMgYWxvbmdzaWRlIHRoZSBDVEEgaXRzZWxmLCBzbyB0aG9zZVxuICAvLyByZWFzb25zIHJlZmVyZW5jZSB3aGF0J3MgZGlyZWN0bHkgYWJvdmUgdGhlIGJ1dHRvbiByYXRoZXIgdGhhblxuICAvLyBzZW5kaW5nIHRoZSB1c2VyIGJhY2sgdGhyb3VnaCB0aGUgc3RlcHBlci5cbiAgLy9cbiAgLy8gRVhDRVBUIHRoZSBjb25uLWZhaWxlZCBjYXNlOiB0aGUgY29ubiBiYW5uZXIgZGlyZWN0bHkgYWJvdmUgdGhlXG4gIC8vIENUQSBhbHJlYWR5IHNob3V0cyBcIlx1MjcxNyBcdTkwMjNcdTRFMERcdTRFMEFcdTVGOENcdTdBRUZcIiArIHJldHJ5IGJ1dHRvbiArIGhlbHAuIEFkZGluZ1xuICAvLyBhbm90aGVyIGlubGluZSBzdHJpcCBqdXN0IHRvIHJlcGVhdCB0aGUgc2FtZSBmYWN0ICh3aXRoIGEgc2xpZ2h0bHlcbiAgLy8gbG9uZ2VyIHNlbnRlbmNlKSBpcyBub2lzZSBcdTIwMTQgc2lsZW50bHkgZGlzYWJsZSB0aGUgQ1RBIGluc3RlYWQsIHdpdGhcbiAgLy8gYSB0b29sdGlwIGV4cGxhbmF0aW9uLiBpbmxpbmVSZWFzb24gaXMgd2hhdCBzaG93cyBpbiB0aGUgd2FybmluZ1xuICAvLyBzdHJpcDsgdG9vbHRpcFJlYXNvbiBpcyB3aGF0IHRoZSBkaXNhYmxlZCBidXR0b24gYWR2ZXJ0aXNlcyBvbiBob3Zlci5cbiAgLy8gUmVhc29uIGZvciBibG9ja2VkIENUQS4gaW5saW5lTXNnIHJlbmRlcnMgaW4gdGhlIHdhcm5pbmcgc3RyaXA7XG4gIC8vIHRvb2x0aXAgaXMgd2hhdCB0aGUgZGlzYWJsZWQgYnV0dG9uIGFkdmVydGlzZXMgb24gaG92ZXI7IGp1bXBUb1xuICAvLyAod2hlbiBzZXQpIG1ha2VzIHRoZSBzdHJpcCBhIGNsaWNrYWJsZSBzaG9ydGN1dCBiYWNrIHRvIHRoYXQgc3RlcC5cbiAgbGV0IGlubGluZU1zZyA9IFwiXCI7XG4gIGxldCBqdW1wVG8gPSBudWxsOyAgICAgICAvLyB7IHN0ZXA6IDF8MiwgbGFiZWw6IFwiXHU3NjdCXHU1MTY1XCIgfCBcIlx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVwiIH1cbiAgbGV0IHRvb2x0aXBSZWFzb24gPSBcIlwiO1xuICBpZiAoIW9uTmhpKSB7XG4gICAgaW5saW5lTXNnID0gXCJcdThBQ0JcdTUyMDdcdTUyMzBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTUyMDZcdTk4MDFcIjtcbiAgICBqdW1wVG8gPSB7IHN0ZXA6IDEsIGxhYmVsOiBcIlx1NzY3Qlx1NTE2NVwiIH07XG4gIH0gZWxzZSBpZiAoIWxvZ2dlZEluKSB7XG4gICAgaW5saW5lTXNnID0gXCJcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTUyMDZcdTk4MDFcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcIjtcbiAgICBqdW1wVG8gPSB7IHN0ZXA6IDEsIGxhYmVsOiBcIlx1NzY3Qlx1NTE2NVwiIH07XG4gIH0gZWxzZSBpZiAoIXN0ZXAyQmFzaWNPaykge1xuICAgIC8vIERvbid0IGVudW1lcmF0ZSB3aGljaCBmaWVsZCBpcyBtaXNzaW5nIFx1MjAxNCB0aGVyZSBjb3VsZCBiZSBtb3JlXG4gICAgLy8gdGhhbiBvbmUgKGdlbmRlciwgbmFtZSwgYm90aCksIGFuZCBzdGVwIDIgYWxyZWFkeSBtYXJrcyBlYWNoXG4gICAgLy8gcmVxdWlyZWQgZmllbGQgd2l0aCBhIHJlZCAqIHRoZSB1c2VyIHdpbGwgc2VlIGFmdGVyIHRoZSBvbmUtXG4gICAgLy8gY2xpY2sganVtcC4gS2VlcCB0aGUgbWVzc2FnZSBhYm91dCB0aGUgaGlnaC1sZXZlbCBhY3Rpb25cbiAgICAvLyAoY29tcGxldGUgKyBjb25maXJtKS5cbiAgICBpbmxpbmVNc2cgPSBcIlx1OEFDQlx1NUI4Q1x1NjIxMFx1NTdGQVx1NjcyQ1x1OENDN1x1NjU5OVx1NEUyNlx1NjMwOVx1NzhCQVx1NUI5QVwiO1xuICAgIGp1bXBUbyA9IHsgc3RlcDogMiwgbGFiZWw6IFwiXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XCIgfTtcbiAgfSBlbHNlIGlmIChkb2JFcnJvcikge1xuICAgIGlubGluZU1zZyA9IGRvYkVycm9yO1xuICAgIGp1bXBUbyA9IHsgc3RlcDogMiwgbGFiZWw6IFwiXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XCIgfTtcbiAgfSBlbHNlIGlmICghbW9kZU9rKSB7XG4gICAgaW5saW5lTXNnID0gXCJcIjsgICAgICAgICAgICAgICAgIC8vIGNvbm4gYmFubmVyIGFib3ZlIGNhcnJpZXMgdGhlIG1lc3NhZ2VcbiAgICB0b29sdGlwUmVhc29uID0gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIjtcbiAgfVxuICBpZiAoanVtcFRvKSB0b29sdGlwUmVhc29uID0gYFx1NTZERSAke19zdGVwTnVtR2x5cGgoanVtcFRvLnN0ZXApfSAke2p1bXBUby5sYWJlbH1cdUZGMUEke2lubGluZU1zZ31gO1xuXG4gIC8vIERvbid0IGZsaXAgdGhlIENUQSBiYWNrIHRvIGVuYWJsZWQgaWYgYSBzeW5jIGlzIGN1cnJlbnRseSBydW5uaW5nXG4gIC8vIFx1MjAxNCB0aGUgU1cgdXBkYXRlcyBgcGF0aWVudE92ZXJyaWRlYCBtaWQtc3luYyAoYXV0by1mZXRjaGVkIGNpZCksXG4gIC8vIHdoaWNoIHRyaWdnZXJzIHN0b3JhZ2Uub25DaGFuZ2VkIFx1MjE5MiBsb2FkUGF0aWVudE92ZXJyaWRlIFx1MjE5MlxuICAvLyBfcmVmcmVzaEJ1dHRvblN0YXRlcy4gV2l0aG91dCB0aGlzIGd1YXJkIHRoZSBidXR0b24gd291bGQgcmUtZW5hYmxlXG4gIC8vIGhhbGZ3YXkgdGhyb3VnaCBhIHN5bmMgYW5kIHRoZSB1c2VyIGNvdWxkIGNsaWNrIGl0IGFnYWluLlxuICBjb25zdCBzeW5jUnVubmluZyA9IF9sYXRlc3RTdGF0dXM/LnJ1bm5pbmcgPT09IHRydWU7XG4gIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gc3luY1J1bm5pbmcgfHwgdG9vbHRpcFJlYXNvbiAhPT0gXCJcIjtcbiAgZWxzLnN5bmNBcGlCdG4udGl0bGUgPSBzeW5jUnVubmluZyA/IFwiXCIgOiB0b29sdGlwUmVhc29uO1xuICBpZiAoZWxzLnN5bmNCbG9ja2VkUmVhc29uKSB7XG4gICAgY29uc3Qgc2hvdyA9ICFzeW5jUnVubmluZyAmJiBpbmxpbmVNc2cgIT09IFwiXCI7XG4gICAgZWxzLnN5bmNCbG9ja2VkUmVhc29uLmhpZGRlbiA9ICFzaG93O1xuICAgIGlmIChzaG93KSB7XG4gICAgICAvLyBCdWlsZCB0aGUgc3RyaXAncyBjb250ZW50OiBcIlx1MjE5MiB7bXNnfSAgICBcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NSBcdTIxOTJcIiBzbyB0aGVcbiAgICAgIC8vIHVzZXIgc2VlcyBib3RoIHRoZSByZWFzb24gYW5kIHdoZXJlIHRoZSBjbGljayB3aWxsIHRha2UgdGhlbS5cbiAgICAgIC8vIFwiXHUyMTkyXCIgYXJyb3cgc2lnbmFscyBcImRvIHRoaXMgbmV4dFwiIChpbmZvcm1hdGlvbi9ndWlkYW5jZSk7XG4gICAgICAvLyB0aGUgb3JpZ2luYWwgXHUyNkEwXHVGRTBGIHdhcyBhbGFybS1ncmFkZSBhbmQgY2xhc2hlZCB3aXRoIHRoZSBnZW51aW5lXG4gICAgICAvLyBkaXNjbGFpbWVyIGNhcmQgYmVsb3cuIEJsdWUgcGFsZXR0ZSBpbiBDU1MgcmVpbmZvcmNlcyB0aGVcbiAgICAgIC8vIGluZm8tbm90LXdhcm5pbmcgZnJhbWluZy5cbiAgICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICBjb25zdCBtc2dFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgbXNnRWwuY2xhc3NOYW1lID0gXCJjdGEtcmVhc29uLW1zZ1wiO1xuICAgICAgbXNnRWwudGV4dENvbnRlbnQgPSBgXHUyMTkyICR7aW5saW5lTXNnfWA7XG4gICAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24uYXBwZW5kQ2hpbGQobXNnRWwpO1xuICAgICAgaWYgKGp1bXBUbykge1xuICAgICAgICBjb25zdCBqdW1wRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAganVtcEVsLmNsYXNzTmFtZSA9IFwiY3RhLXJlYXNvbi1qdW1wXCI7XG4gICAgICAgIGp1bXBFbC50ZXh0Q29udGVudCA9IGBcdTU2REUgJHtfc3RlcE51bUdseXBoKGp1bXBUby5zdGVwKX0gJHtqdW1wVG8ubGFiZWx9IFx1MjE5MmA7XG4gICAgICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi5hcHBlbmRDaGlsZChqdW1wRWwpO1xuICAgICAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24uZGF0YXNldC50YXJnZXRTdGVwID0gU3RyaW5nKGp1bXBUby5zdGVwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBlbHMuc3luY0Jsb2NrZWRSZWFzb24uZGF0YXNldC50YXJnZXRTdGVwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBNaXJyb3IgdGhlIHN0b3AtYnV0dG9uIHZpc2liaWxpdHkgc28gdGhlIHVzZXIgY2FuIGFsd2F5cyBjYW5jZWxcbiAgLy8gbWlkLXN5bmMgZXZlbiBpZiB0aGUgcG9wdXAgcmUtcmVuZGVycyBkdWUgdG8gb25DaGFuZ2VkLlxuICBpZiAoZWxzLnN0b3BCdG4pIGVscy5zdG9wQnRuLmhpZGRlbiA9ICFzeW5jUnVubmluZztcblxuICAvLyBMYXVuY2ggYnV0dG9uOiBiYWNrZW5kIG1vZGUgKyBjb25uIG9rICsgcGF0aWVudCBzZXQgKyBiYWNrZW5kXG4gIC8vIGFjdHVhbGx5IGhhcyB0aGlzIHBhdGllbnQgKG90aGVyd2lzZSB0aGUgU01BUlQgYXBwIGxhdW5jaGVzIGludG9cbiAgLy8gYW4gZW1wdHkgRkhJUiBzdG9yZSBcdTIwMTQgY29uZnVzaW5nIGJsYW5rIHNjcmVlbikuXG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGNvbnN0IGhhdmVCYWNrZW5kUGF0aWVudCA9IF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCI7XG4gIGVscy5sYXVuY2hCdG4uZGlzYWJsZWQgPSAhKFxuICAgIGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmXG4gICAgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiICYmXG4gICAgISFvdj8uaWRfbm8gJiZcbiAgICBoYXZlQmFja2VuZFBhdGllbnRcbiAgKTtcbiAgZWxzLmxhdW5jaEJ0bi50aXRsZSA9XG4gICAgY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgID8gXCJcdThBQ0JcdTUyMDdcdTUyMzBcdTMwMENcdUQ4M0NcdURGRTUgXHU2NzJDXHU2QTVGXHU0RjNBXHU2NzBEXHU1NjY4IChcdTkwMzJcdTk2OEUpXHUzMDBEXHU2QTIxXHU1RjBGXCIgOlxuICAgIF9jb25uU3RhdGUgIT09IFwib2tcIiAgICAgICAgICAgPyBcIlx1NUY4Q1x1N0FFRlx1NUMxQVx1NjcyQVx1OTAyM1x1N0REQVwiIDpcbiAgICAhb3Y/LmlkX25vICAgICAgICAgICAgICAgICAgICA/IFwiXHU4QUNCXHU1NkRFXHU1MjMwXHUzMDBDXHUyNDYxIFx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVx1MzAwRFx1NTg2Qlx1NUJFQlx1OENDN1x1NjU5OVwiIDpcbiAgICAhaGF2ZUJhY2tlbmRQYXRpZW50ICAgICAgICAgICA/IFwiXHU2NzJDXHU2QTVGXHU0RjNBXHU2NzBEXHU1NjY4XHU5MDg0XHU2QzkyXHU2NzA5XHU5MDE5XHU0RjREXHU3Njg0XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdTUxNDhcdTYzMDlcdTMwMENcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTMwMERcdTYyMTZcdTRFMEJcdTY1QjlcdTMwMENcdTYyOEFcdTkwMTlcdTZCMjFcdThDQzdcdTY1OTlcdTUwQjNcdTUyMzBcdTY3MkNcdTZBNUZcdTRGM0FcdTY3MERcdTU2NjhcdTMwMERcIiA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiO1xuXG4gIC8vIFJlZnJlc2ggdGhlIHN0ZXBwZXIgVUkgb24gZXZlcnkgc3RhdGUgY2hhbmdlLCBidXQgRE9OJ1QgYXV0by1cbiAgLy8gYWR2YW5jZSBmcm9tIGhlcmUgXHUyMDE0IGluY2lkZW50YWwgaW5wdXQgY2hhbmdlcyAodHlwaW5nIGluIGEgZmllbGRcbiAgLy8gd2hpbGUgcmV2aXNpdGluZyBzdGVwIDIpIHNob3VsZG4ndCB5YW5rIHRoZSB1c2VyIGZvcndhcmQuIEF1dG8tXG4gIC8vIGFkdmFuY2UgaXMgb25seSBmaXJlZCBmcm9tIHRoZSBldmVudHMgdGhhdCBzaWduYWwgaW50ZW50OlxuICAvLyAgIC0gbG9naW4gcHJvYmUgZmxpcHBpbmcgdG8gdHJ1ZSBcdTIxOTIgZm9yd2FyZCBpbnRvIHN0ZXAgMlxuICAvLyAgIC0gc2F2ZVBhdGllbnRPdmVycmlkZSBzdWNjZXNzIFx1MjE5MiBmb3J3YXJkIGludG8gc3RlcCAzXG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoV2l6YXJkVWkoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdEJhY2tlbmRDb25uZWN0aW9uKCkge1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGlmICghdXJsKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tdXJsXCIgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpOyByZXR1cm4gZmFsc2U7XG4gIH1cbiAgX2Nvbm5TdGF0ZSA9IFwiY2hlY2tpbmdcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcblxuICBjb25zdCBwZXJtID0gYXdhaXQgZW5zdXJlQmFja2VuZFBlcm1pc3Npb24odXJsKTtcbiAgaWYgKCFwZXJtLm9rKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dXJsLnJlcGxhY2UoL1xcLyQvLCBcIlwiKX0vZmhpci9tZXRhZGF0YWAsIHsgc2lnbmFsOiBjdHJsLnNpZ25hbCB9KTtcbiAgICBpZiAoIXJlcy5vaykge1xuICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwiaHR0cFwiLCBkZXRhaWw6IHJlcy5zdGF0dXMgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcy5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCk7XG4gICAgICBpZiAoYm9keT8ucmVzb3VyY2VUeXBlICE9PSBcIkNhcGFiaWxpdHlTdGF0ZW1lbnRcIikge1xuICAgICAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJub3QtZmhpclwiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfY29ublN0YXRlID0gXCJva1wiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjtcbiAgICBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXRcIiA6IFwibmV0d29ya1wiIH07XG4gIH0gZmluYWxseSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgfVxuXG4gIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIFdoZW5ldmVyIGNvbm5lY3Rpdml0eSBmbGlwcywgcmUtY2hlY2sgd2hldGhlciB0aGlzIHBhdGllbnQgYWxyZWFkeVxuICAvLyBleGlzdHMgb24gYmFja2VuZC4gKFN0YWxlIFwiX2JhY2tlbmRQYXRpZW50XCIgc3RhdGUgd291bGQgb3RoZXJ3aXNlXG4gIC8vIGNhdXNlIExhdW5jaCB0byBsb29rIGVuYWJsZWQgLyBkaXNhYmxlZCB3cm9uZ2x5LilcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIHJldHVybiBfY29ublN0YXRlID09PSBcIm9rXCI7XG59XG5cbmVscy5jb25uUmV0cnlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0ZXN0QmFja2VuZENvbm5lY3Rpb24pO1xuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBcdTIxOTQgbG9jYWwgZGF0YS1zdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBJbmRlcGVuZGVudCBvZiB0aGUgY29ubmVjdGlvbiBiYW5uZXIgKHdoaWNoIG9ubHkgdGVsbHMgdXMgXCJjYW4gd2Vcbi8vIHJlYWNoIHRoZSBiYWNrZW5kXCIpLiBUaGlzIGNhcmQgYW5zd2VycyB0d28gcXVlc3Rpb25zOlxuLy9cbi8vICAgMS4gRG9lcyB0aGUgYmFja2VuZCBhbHJlYWR5IGhhdmUgdGhpcyBwYXRpZW50J3MgZGF0YT9cbi8vICAgICAgXHUyMTkyIGRyaXZlcyB3aGV0aGVyIFx1RDgzRFx1REU4MCBMYXVuY2ggaXMgYWxsb3dlZCBhdCBhbGwgKExhdW5jaCBvbiBhblxuLy8gICAgICAgIGVtcHR5IGJhY2tlbmQgZ2l2ZXMgYSBjb25mdXNpbmcgU01BUlQtYXBwIGJsYW5rKS5cbi8vICAgMi4gRG9lcyB0aGUgdXNlciBoYXZlIGEgbG9jYWwgQnVuZGxlIHRoYXQncyBuZXdlciB0aGFuIHRoZVxuLy8gICAgICBiYWNrZW5kJ3Mgdmlldz9cbi8vICAgICAgXHUyMTkyIG9mZmVyIFwiXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGUgXHU1MjMwXHU1RjhDXHU3QUVGXCIgdG8gcHVzaCBpdCB2aWEgL2ZoaXIvaW1wb3J0XG4vLyAgICAgICAgd2l0aG91dCByZS1mZXRjaGluZyBOSEkgKGZhc3QsIG5vbi1kZXN0cnVjdGl2ZTogc3RhYmxlIElEc1xuLy8gICAgICAgIHVwc2VydCBzbyBiYWNrZW5kIHJlc291cmNlcyBqdXN0IGJ1bXAgdmVyc2lvbklkKS5cbi8vXG4vLyBXZSBkb24ndCBzZWNvbmQtZ3Vlc3MgdGhlIHVzZXI6IGV2ZW4gd2hlbiBsb2NhbCBpcyBjbGVhcmx5IG5ld2VyLFxuLy8gTGF1bmNoIHN0YXlzIGVuYWJsZWQgaWYgdGhlIGJhY2tlbmQgaGFzIHRoZSBwYXRpZW50IFx1MjAxNCB0aGV5IG1heVxuLy8gZ2VudWluZWx5IHdhbnQgdG8gbG9vayBhdCB0aGUgb2xkZXIgc3RhdGUuIFRoZSBVSSBsYXlzIG91dCBib3RoXG4vLyBzaWRlczsgdXNlciBkZWNpZGVzLlxuXG5sZXQgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuLy8gICBzdGF0ZTogXCJ1bmtub3duXCIgfCBcImNoZWNraW5nXCIgfCBcImFic2VudFwiIHwgXCJwcmVzZW50XCIgfCBcImZhaWxcIlxubGV0IF9sb2NhbEJ1bmRsZSA9IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcblxuZnVuY3Rpb24gX2ZtdFRpbWVTaG9ydChpc28pIHtcbiAgaWYgKCFpc28pIHJldHVybiBcIlwiO1xuICBjb25zdCBkID0gbmV3IERhdGUoaXNvKTtcbiAgaWYgKE51bWJlci5pc05hTihkLmdldFRpbWUoKSkpIHJldHVybiBcIlwiO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgcmV0dXJuIGAke2QuZ2V0TW9udGgoKSArIDF9LyR7ZC5nZXREYXRlKCl9ICR7cGFkKGQuZ2V0SG91cnMoKSl9OiR7cGFkKGQuZ2V0TWludXRlcygpKX1gO1xufVxuXG5mdW5jdGlvbiBfZm10UmVsYXRpdmUobXMpIHtcbiAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBtcztcbiAgaWYgKGRpZmYgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGRpZmYgLyAxMDAwKSl9IFx1NzlEMlx1NTI0RGA7XG4gIGlmIChkaWZmIDwgMzYwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyA2MF8wMDApfSBcdTUyMDZcdTk0MThcdTUyNERgO1xuICBpZiAoZGlmZiA8IDg2XzQwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyAzNjAwXzAwMCl9IFx1NUMwRlx1NjY0Mlx1NTI0RGA7XG4gIHJldHVybiBfZm10VGltZVNob3J0KG5ldyBEYXRlKG1zKS50b0lTT1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gX3JlbmRlckRhdGFTdGF0ZSgpIHtcbiAgLy8gU2VjdGlvbiBvbmx5IHZpc2libGUgaW4gYmFja2VuZCBtb2RlIChoYW5kbGVkIGJ5IC5iYWNrZW5kLW9ubHkgQ1NTKSxcbiAgLy8gYnV0IHdlIGFsc28gZXhwbGljaXRseSBoaWRlIHdoZW4gdGhlIHBvcHVwIGhhcyBubyBwYXRpZW50X292ZXJyaWRlXG4gIC8vIHNldCwgc2luY2UgYm90aCBjaGVja3Mga2V5IG9mZiBwYXRpZW50X2lkLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubykge1xuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ2FyZCBzZXJ2ZXMgYXMgYW4gYWxlcnQsIG5vdCBhIGRhc2hib2FyZCBcdTIwMTQgc2hvdyBvbmx5IHdoZW4gdGhlcmUnc1xuICAvLyBzb21ldGhpbmcgYWN0aW9uYWJsZSAvIHdvcnRoIGZsYWdnaW5nLiBIaWRlIHdoZW46XG4gIC8vICAgLSBiYWNrZW5kIGhhcyB0aGlzIHBhdGllbnQgQU5EIG5vIGxvY2FsIGJ1bmRsZSB0byBjb21wYXJlIGFnYWluc3RcbiAgLy8gICAgIChMYXVuY2ggaXMgZW5hYmxlZCBcdTIxOTIgdGhhdCdzIHRoZSBzaWduYWwgZXZlcnl0aGluZydzIGZpbmUpLCBvclxuICAvLyAgIC0gYm90aCBzaWRlcyBhZ3JlZSBvbiBjb3VudCAoYWxyZWFkeSBpbiBzeW5jLCBubyB1cGxvYWQgbmVlZGVkKS5cbiAgLy8gVGhlIHJlbWFpbmluZyBzdGF0ZXMgKGNoZWNraW5nIC8gZmFpbCAvIGFic2VudCAvIGNvdW50IG1pc21hdGNoKSBhbGxcbiAgLy8gZWl0aGVyIG5lZWQgdXNlciBhdHRlbnRpb24gb3IgYXJlIHRyYW5zaWVudCBsb2FkaW5nIGZlZWRiYWNrLlxuICBjb25zdCBsb2NhbE1hdGNoZXMgPSBfbG9jYWxCdW5kbGUuZXhpc3RzICYmIF9sb2NhbEJ1bmRsZS5wYXRpZW50SWQgPT09IG92LmlkX25vO1xuICBjb25zdCBpblN5bmMgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiZcbiAgICBsb2NhbE1hdGNoZXMgJiZcbiAgICBfYmFja2VuZFBhdGllbnQuY291bnQgPT09IF9sb2NhbEJ1bmRsZS5jb3VudDtcbiAgLy8gUXVpZXQgXCJcdTI3MTMgXHU1REYyXHU1NDBDXHU2QjY1XCIgaGludCBzaXRzIHVuZGVyIHRoZSBkb3dubG9hZCBidXR0b24gd2hlbiBpbi1zeW5jIFx1MjAxNFxuICAvLyBnaXZlcyB0aGUgdXNlciBhIHRpbnkgYWNrbm93bGVkZ2VtZW50IGluc3RlYWQgb2YgdG90YWwgc2lsZW5jZS5cbiAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9ICFpblN5bmM7XG4gIGNvbnN0IG5vdGhpbmdUb1Nob3cgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiYgKCFsb2NhbE1hdGNoZXMgfHwgaW5TeW5jKTtcbiAgaWYgKG5vdGhpbmdUb1Nob3cpIHtcbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSBmYWxzZTtcblxuICAvLyBCYWNrZW5kIHJvd1xuICBjb25zdCBicyA9IGVscy5iYWNrZW5kU3RhdGU7XG4gIHN3aXRjaCAoX2JhY2tlbmRQYXRpZW50LnN0YXRlKSB7XG4gICAgY2FzZSBcImNoZWNraW5nXCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IFwiXHU2QUEyXHU2N0U1XHU0RTJEXHUyMDI2XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiYWJzZW50XCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIGVtcHR5XCI7XG4gICAgICAvLyBDYXJkIHNpdHMgaW5zaWRlIHRoZSByZXN1bHQgem9uZSBuZXh0IHRvIHRoZSBcdUQ4M0RcdUREMDQgXHU1M0Q2XHU1Rjk3IENUQSBhbmRcbiAgICAgIC8vIHRoZSBcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzIGJ1dHRvbiBcdTIwMTQgcG9pbnRpbmcgYXQgdGhlbSB3aXRoIHRleHQgd291bGQgYmVcbiAgICAgIC8vIGRvdWJsZS10YWxrLiBKdXN0IHN0YXRlIHRoZSBmYWN0LlxuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjZBMCBcdTY3MkNcdTZBNUZcdTRGM0FcdTY3MERcdTU2NjhcdTkwODRcdTZDOTJcdTY3MDlcdTkwMTlcdTRGNERcdTc2ODRcdThDQzdcdTY1OTlcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJwcmVzZW50XCI6IHtcbiAgICAgIGNvbnN0IGNvdW50ID0gX2JhY2tlbmRQYXRpZW50LmNvdW50O1xuICAgICAgY29uc3QgdHMgPSBfYmFja2VuZFBhdGllbnQubGFzdFVwZGF0ZWQ7XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIG9rXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IGBcdTI3MTMgJHtjb3VudCA+IDAgPyBgJHtjb3VudH0gXHU3QjQ2IFx1MDBCNyBgIDogXCJcIn1cdTY3MDBcdTVGOENcdTY2RjRcdTY1QjAgJHtfZm10VGltZVNob3J0KHRzKSB8fCBcIih1bmtub3duKVwifWA7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcImZhaWxcIjpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWUgZmFpbFwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjcxNyBcdTc4QkFcdThBOERcdTU5MzFcdTY1NTdcdUZGMDhcdThBQ0JcdTc3MEJcdTRFMEFcdTY1QjlcdTYzRDBcdTc5M0FcdUZGMDlcIjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IFwiXHUyMDE0XCI7XG4gIH1cblxuICAvLyBMb2NhbCByb3cgXHUyMDE0IHNob3cgb25seSB3aGVuIHRoZSBwZW5kaW5nIGJ1bmRsZSBtYXRjaGVzIHRoaXMgcGF0aWVudC5cbiAgLy8gKGxvY2FsTWF0Y2hlcyB3YXMgY29tcHV0ZWQgYWJvdmUgZm9yIHRoZSBlYXJseS1yZXR1cm4gY2hlY2suKVxuICBpZiAobG9jYWxNYXRjaGVzKSB7XG4gICAgZWxzLmxvY2FsU3RhdGVSb3cuaGlkZGVuID0gZmFsc2U7XG4gICAgZWxzLmxvY2FsU3RhdGUuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZSBva1wiO1xuICAgIGVscy5sb2NhbFN0YXRlLnRleHRDb250ZW50ID1cbiAgICAgIGBcdTI3MTMgJHtfbG9jYWxCdW5kbGUuY291bnR9IFx1N0I0NiBcdTAwQjcgJHtfZm10UmVsYXRpdmUoX2xvY2FsQnVuZGxlLmdlbmVyYXRlZEF0KX1cdTc1MjJcdTc1MUZgO1xuICB9IGVsc2Uge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IHRydWU7XG4gIH1cblxuICAvLyBcIlx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlXCIgYnV0dG9uIHNob3dzIG9ubHkgd2hlbiB0aGVyZSdzIGEgbG9jYWwgYnVuZGxlXG4gIC8vIGZvciB0aGlzIHBhdGllbnQuIFdlIGRvbid0IHJlYWNoIHRoaXMgYnJhbmNoIHdoZW4gaW4tc3luYyAodGhlXG4gIC8vIHdob2xlIHNlY3Rpb24gZ2V0cyBoaWRkZW4gYWJvdmUpLCBzbyBubyBuZWVkIGZvciBhIHNlcGFyYXRlXG4gIC8vIGRpc2FibGVkIHN0YXRlIFx1MjAxNCB3aGVuIHRoZSBidXR0b24gc2hvd3MsIHVwbG9hZCBpcyBhbHdheXMgbWVhbmluZ2Z1bC5cbiAgZWxzLnB1c2hMb2NhbEJ0bi5oaWRkZW4gPSAhbG9jYWxNYXRjaGVzO1xuICBlbHMucHVzaExvY2FsQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gIGVscy5wdXNoTG9jYWxCdG4udGl0bGUgPSBcIlwiO1xuICBlbHMucHVzaExvY2FsQnRuLnRleHRDb250ZW50ID0gXCJcdTYyOEFcdTkwMTlcdTZCMjFcdThDQzdcdTY1OTlcdTUwQjNcdTUyMzBcdTY3MkNcdTZBNUZcdTRGM0FcdTY3MERcdTU2NjhcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLnNlc3Npb24uZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIF9sb2NhbEJ1bmRsZSA9IHBlbmRpbmdcbiAgICA/IHtcbiAgICAgICAgZXhpc3RzOiB0cnVlLFxuICAgICAgICBjb3VudDogQXJyYXkuaXNBcnJheShKU09OLnBhcnNlKHBlbmRpbmcuanNvbik/LmVudHJ5KVxuICAgICAgICAgID8gSlNPTi5wYXJzZShwZW5kaW5nLmpzb24pLmVudHJ5Lmxlbmd0aFxuICAgICAgICAgIDogMCxcbiAgICAgICAgZ2VuZXJhdGVkQXQ6IHBlbmRpbmcuZ2VuZXJhdGVkQXQgfHwgMCxcbiAgICAgICAgcGF0aWVudElkOiBwZW5kaW5nLnBhdGllbnRJZCB8fCBudWxsLFxuICAgICAgfVxuICAgIDogeyBleGlzdHM6IGZhbHNlLCBjb3VudDogMCwgZ2VuZXJhdGVkQXQ6IDAsIHBhdGllbnRJZDogbnVsbCB9O1xuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoZWNrQmFja2VuZFBhdGllbnQoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmIChjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiB8fCAhb3Y/LmlkX25vIHx8IF9jb25uU3RhdGUgIT09IFwib2tcIikge1xuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJjaGVja2luZ1wiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuXG4gIGNvbnN0IHVybCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gIGNvbnN0IGtleSA9IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgaGVhZGVycyA9IGtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBrZXkgfSA6IHt9O1xuICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIHRoZSBoYXNoZWQgRkhJUiBpZCwgbmV2ZXIgdW5kZXIgdGhlIHJhd1xuICAvLyBuYXRpb25hbCBJRCBcdTIwMTQgcXVlcnkgLyBleHBvcnQgYnkgdGhlIGhhc2hlZCBmb3JtLlxuICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKG92LmlkX25vKTtcbiAgdHJ5IHtcbiAgICBjb25zdCBwciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9QYXRpZW50LyR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWAsIHsgaGVhZGVycyB9KTtcbiAgICBpZiAocHIuc3RhdHVzID09PSA0MDQpIHtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiYWJzZW50XCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXByLm9rKSB7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImZhaWxcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgICBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBhdGllbnQgPSBhd2FpdCBwci5qc29uKCk7XG4gICAgY29uc3QgbGFzdFVwZGF0ZWQgPSBwYXRpZW50Py5tZXRhPy5sYXN0VXBkYXRlZCA/PyBudWxsO1xuICAgIC8vIENvdW50IHZpYSAvZmhpci9leHBvcnQgXHUyMDE0IHNsaWdodGx5IGhlYXZpZXIgYnV0IGl0J3MgdGhlIG9ubHlcbiAgICAvLyBvZmYtdGhlLXNoZWxmIHdheSB0byBnZXQgdG90YWwgcmVzb3VyY2VzIGZvciBhIHBhdGllbnQuIENhcCBieVxuICAgIC8vIDVzIHRpbWVvdXQgc28gYSBzbG93IGJhY2tlbmQgZG9lc24ndCBsb2NrIHRoZSBwb3B1cCBmb3JldmVyLlxuICAgIGxldCBjb3VudCA9IDA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGN0cmwgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gY3RybC5hYm9ydCgpLCA1MDAwKTtcbiAgICAgIGNvbnN0IGVyID0gYXdhaXQgZmV0Y2goYCR7dXJsfS9maGlyL2V4cG9ydD9wYXRpZW50PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWAsIHtcbiAgICAgICAgaGVhZGVycywgc2lnbmFsOiBjdHJsLnNpZ25hbCxcbiAgICAgIH0pO1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIGlmIChlci5vaykge1xuICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCBlci5qc29uKCk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJ1bmRsZS5lbnRyeSkpIGNvdW50ID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogbGVhdmUgY291bnQgPSAwOyBub3QgZmF0YWwgKi8gfVxuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwicHJlc2VudFwiLCBjb3VudCwgbGFzdFVwZGF0ZWQgfTtcbiAgfSBjYXRjaCAoX2UpIHtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImZhaWxcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gIH1cbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwdXNoTG9jYWxCdW5kbGVUb0JhY2tlbmQoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3Y/LmlkX25vIHx8ICFfbG9jYWxCdW5kbGUuZXhpc3RzIHx8IF9sb2NhbEJ1bmRsZS5wYXRpZW50SWQgIT09IG92LmlkX25vKSByZXR1cm47XG4gIGNvbnN0IHVybCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gIGNvbnN0IGtleSA9IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgaGVhZGVycyA9IHtcbiAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAuLi4oa2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGtleSB9IDoge30pLFxuICB9O1xuICBlbHMucHVzaExvY2FsQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50ZXh0Q29udGVudCA9IFwiXHU1MEIzXHU5MDAxXHU0RTJEXHUyMDI2XCI7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLnNlc3Npb24uZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gICAgaWYgKCFwZW5kaW5nPy5qc29uKSB0aHJvdyBuZXcgRXJyb3IoXCJubyBsb2NhbCBidW5kbGVcIik7XG4gICAgY29uc3QgciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9pbXBvcnRgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLCBoZWFkZXJzLCBib2R5OiBwZW5kaW5nLmpzb24sXG4gICAgfSk7XG4gICAgaWYgKCFyLm9rKSB7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgci50ZXh0KCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhUVFAgJHtyLnN0YXR1c306ICR7dGV4dC5zbGljZSgwLCAxMjApfWApO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByLmpzb24oKTtcbiAgICBzZXRTdGF0dXMoYFx1MjcwNSBcdTVERjJcdTRFMEFcdTUwQjMgJHtyZXN1bHQuaW1wb3J0ZWQgPz8gXCI/XCJ9IFx1N0I0Nlx1NTIzMFx1NUY4Q1x1N0FFRmAsIFwic3VjY2Vzc1wiKTtcbiAgICBhd2FpdCBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1MjZENCBcdTRFMEFcdTUwQjNcdTU5MzFcdTY1NTdcdUZGMUEke2UubWVzc2FnZX1gLCBcImVycm9yXCIpO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIF9yZW5kZXJEYXRhU3RhdGUoKSAoYWxyZWFkeSBjYWxsZWQgZnJvbSBjaGVja0JhY2tlbmRQYXRpZW50IG9uXG4gICAgLy8gc3VjY2VzcykgZGVjaWRlcyB0aGUgcmlnaHQgZGlzYWJsZWQgc3RhdGUgKyBsYWJlbCBiYXNlZCBvblxuICAgIC8vIHdoZXRoZXIgYmFja2VuZCBhbmQgbG9jYWwgYWdyZWUuIENhbGwgaXQgaGVyZSB0b28gdG8gY292ZXIgdGhlXG4gICAgLy8gZmFpbHVyZSBwYXRoIHRoYXQgc2tpcHBlZCBjaGVja0JhY2tlbmRQYXRpZW50LlxuICAgIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgfVxufVxuXG5lbHMucHVzaExvY2FsQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVzaExvY2FsQnVuZGxlVG9CYWNrZW5kKTtcblxuLy8gVGhlIGJsb2NrZWQtcmVhc29uIHdhcm5pbmcgc3RyaXAgZG91YmxlcyBhcyBhIFwianVtcCBiYWNrIHRvIHRoZVxuLy8gcmVsZXZhbnQgc3RlcFwiIGJ1dHRvbiB3aGVuIHRoZXJlJ3MgYSBrbm93biB0YXJnZXQgc3RlcC4gQ2xpY2tcbi8vIGFueXdoZXJlIG9uIGl0IHRvIG5hdmlnYXRlOyB0aGUgdHJhaWxpbmcgXCJcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NSBcdTIxOTJcIiBoaW50XG4vLyB0ZWxlZ3JhcGhzIHdoZXJlIHRoZSBjbGljayB3aWxsIGxhbmQuXG5lbHMuc3luY0Jsb2NrZWRSZWFzb24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGNvbnN0IHRhcmdldCA9IE51bWJlcihlbHMuc3luY0Jsb2NrZWRSZWFzb24uZGF0YXNldC50YXJnZXRTdGVwKTtcbiAgaWYgKHRhcmdldCA+PSAxICYmIHRhcmdldCA8PSAzKSBfc2V0QWN0aXZlU3RlcCh0YXJnZXQpO1xufSk7XG5cbi8vIFwiXHVEODNEXHVERDE3IFx1OTU4Qlx1NTU1Rlx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NzY3Qlx1NTE2NVwiIFx1MjAxNCBvcGVucyB0aGUgTkhJIGxhbmRpbmcgcGFnZSBzbyB0aGUgdXNlclxuLy8gZG9lc24ndCBoYXZlIHRvIHJlbWVtYmVyIC8gZ29vZ2xlIHRoZSBVUkwuIENsb3NlcyB0aGUgcG9wdXAgc29cbi8vIHRoZXkgZG9uJ3QgaGF2ZSB0byBkaXNtaXNzIGl0IG1hbnVhbGx5IGFmdGVyIHRoZSBuZXcgdGFiIG9wZW5zLlxuZWxzLm9wZW5OaGlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gIGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogTkhJX0xBTkRJTkcgfSk7XG4gIHdpbmRvdy5jbG9zZSgpO1xufSk7XG5cbi8vIFwiXHU1MjREXHU1RjgwXHU3NjdCXHU1MTY1XHU5ODAxXHU5NzYyXCIgaW5zaWRlIHRoZSBuZWVkcy1sb2dpbiBiYW5uZXIuIENvdmVycyBib3RoOlxuLy8gICAxLiBTZXNzaW9uIGV4cGlyZWQgc2lsZW50bHkgd2hpbGUgb24gYSBsb2dnZWQtaW4gcGFnZSAobG9va3Ncbi8vICAgICAgXCJzdGlsbCBsb2dnZWQgaW5cIiB0byB0aGUgdXNlciBcdTIxOTIgdGhleSdyZSBjb25mdXNlZCB3aHkgd2Ugc2F5XG4vLyAgICAgIG90aGVyd2lzZSkuXG4vLyAgIDIuIFVzZXIgaXMgb24gYSBwdWJsaWMgc3ViLXBhZ2UgbGlrZSBcdTU1NEZcdTdCNTRcdTVDMDhcdTUzNDAgXHUyMDE0IGEgcGxhaW4gcmVsb2FkXG4vLyAgICAgIHdvdWxkIGp1c3QgcmUtcmVuZGVyIHRoZSBzYW1lIHVuLWF1dGggcGFnZSB3aXRob3V0IHN1cmZhY2luZ1xuLy8gICAgICBhIGxvZ2luIGZvcm0uIE5hdmlnYXRpbmcgZGlyZWN0bHkgdG8gdGhlIGxvZ2luIFVSTCBoYW5kbGVzXG4vLyAgICAgIGJvdGggY2FzZXMgaWRlbnRpY2FsbHkuXG4vLyBEcml2ZXMgY2hyb21lLnRhYnMudXBkYXRlIHdpdGggYSB1cmwgc28gdGhlIGV4aXN0aW5nIE5ISSB0YWJcbi8vIGdvZXMgc3RyYWlnaHQgdG8gdGhlIGxvZ2luIHBpY2tlcjsgZm9jdXNlcyArIGNsb3NlcyBwb3B1cCBzbyB0aGVcbi8vIHVzZXIgbGFuZHMgb24gdGhlIHBhZ2UgdGhleSBuZWVkIHRvIGFjdCBvbi5cbmVscy5uaGlSZWxvYWRCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gIGlmICghX25oaVRhYklkKSB7XG4gICAgLy8gRGVmZW5zaXZlOiBiYW5uZXIgc2hvdWxkbid0IGJlIHZpc2libGUgd2hlbiBvZmYtTkhJLCBidXQgaWZcbiAgICAvLyBzb21ldGhpbmcgd2VudCBzaWRld2F5cyBqdXN0IG9wZW4gdGhlIGxvZ2luIHBhZ2UgaW4gYSBuZXcgdGFiLlxuICAgIGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogTkhJX0xPR0lOX1VSTCB9KTtcbiAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBhd2FpdCBjaHJvbWUudGFicy51cGRhdGUoX25oaVRhYklkLCB7IHVybDogTkhJX0xPR0lOX1VSTCwgYWN0aXZlOiB0cnVlIH0pO1xuICB9IGNhdGNoIHt9XG4gIHdpbmRvdy5jbG9zZSgpO1xufSk7XG5cbi8vIFBlbmRpbmcgYnVuZGxlIG5vdyBsaXZlcyBpbiBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uIChhdXRvLWNsZWFycyB3aGVuXG4vLyB0aGUgYnJvd3NlciBjbG9zZXMgXHUyMDE0IHNlZSBzZWN1cml0eSBhdWRpdCAjNSBmaXgpLiBMaXN0ZW5lciBmaWx0ZXJzIG9uXG4vLyBcInNlc3Npb25cIiBhcmVhIGFjY29yZGluZ2x5LlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcInNlc3Npb25cIiAmJiBQRU5ESU5HX0JVTkRMRV9LRVkgaW4gY2hhbmdlcykgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG59KTtcblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgbW9kZSBmZWF0dXJlIGdhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBMYXlwZXJzb24gZGVmYXVsdDogYmFja2VuZCBtb2RlIChEb2NrZXIgc2VydmVyICsgRGFzaGJvYXJkICsgU01BUlRcbi8vIEFwcCkgaXMgaGlkZGVuIGJlaGluZCBhIHRvZ2dsZSBpbiBcdTkwMzJcdTk2OEVcdThBMkRcdTVCOUEuIFdoZW4gT0ZGIChkZWZhdWx0KSwgdGhlXG4vLyBtb2RlLXRvZ2dsZSByb3cgaW4gc3RlcCAzIGRvZXNuJ3QgcmVuZGVyIGFuZCBzeW5jTW9kZSBpcyBmb3JjZWQgdG9cbi8vIFwibG9jYWxcIiByZWdhcmRsZXNzIG9mIHdoYXQncyBpbiBzdG9yYWdlLlxuYXN5bmMgZnVuY3Rpb24gbG9hZEJhY2tlbmRNb2RlRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBiYWNrZW5kTW9kZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcImJhY2tlbmRNb2RlRW5hYmxlZFwiKTtcbiAgY29uc3QgZW5hYmxlZCA9IGJhY2tlbmRNb2RlRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgZWxzLmJhY2tlbmRNb2RlRW5hYmxlZC5jaGVja2VkID0gZW5hYmxlZDtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LmJhY2tlbmRFbmFibGVkID0gZW5hYmxlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiO1xufVxuXG5lbHMuYmFja2VuZE1vZGVFbmFibGVkPy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgZW5hYmxlZCA9IGVscy5iYWNrZW5kTW9kZUVuYWJsZWQuY2hlY2tlZDtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LmJhY2tlbmRFbmFibGVkID0gZW5hYmxlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBiYWNrZW5kTW9kZUVuYWJsZWQ6IGVuYWJsZWQgfSk7XG4gIGlmIChlbmFibGVkKSB7XG4gICAgLy8gQXV0by1zd2l0Y2ggdG8gYmFja2VuZCBtb2RlIHNvIHRoZSB1c2VyIGltbWVkaWF0ZWx5IHNlZXMgdGhlXG4gICAgLy8gbW9kZSB0YWIgKyB0aGUgYmFja2VuZCBjb25maWcgZmllbGRzIHRoZXkganVzdCB1bmxvY2tlZC4gQmVhdHNcbiAgICAvLyBcIkkgZW5hYmxlZCBpdCBidXQgbm90aGluZyBoYXBwZW5lZFwiLlxuICAgIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSByLmNoZWNrZWQgPSByLnZhbHVlID09PSBcImJhY2tlbmRcIjtcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IFwiYmFja2VuZFwiO1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNNb2RlOiBcImJhY2tlbmRcIiB9KTtcbiAgICB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3JjZSBiYWNrIHRvIGxvY2FsOyBjbGVhciBhbnkgbGVmdG92ZXIgYmFja2VuZCBjb25uZWN0aW9uIHN0YXRlXG4gICAgLy8gc28gdGhlIG5leHQgdGltZSB0aGV5IHJlLWVuYWJsZSBpdCBkb2Vzbid0IHNob3cgc3RhbGUgXCJcdTVERjJcdTkwMjNcdTdEREFcIi5cbiAgICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgci5jaGVja2VkID0gci52YWx1ZSA9PT0gXCJsb2NhbFwiO1xuICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5tb2RlID0gXCJsb2NhbFwiO1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNNb2RlOiBcImxvY2FsXCIgfSk7XG4gICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIH1cbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgU3luYyBtb2RlIChsb2NhbCB8IGJhY2tlbmQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuYXN5bmMgZnVuY3Rpb24gbG9hZFN5bmNNb2RlKCkge1xuICBjb25zdCB7IHN5bmNNb2RlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJzeW5jTW9kZVwiKTtcbiAgLy8gQmFja2VuZCBtb2RlIGRpc2FibGVkIGluIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgaWdub3JlIGFueSBzdG9yZWQgYmFja2VuZCBtb2RlLlxuICBjb25zdCBiYWNrZW5kRW5hYmxlZCA9IGRvY3VtZW50LmJvZHkuZGF0YXNldC5iYWNrZW5kRW5hYmxlZCA9PT0gXCJ0cnVlXCI7XG4gIGNvbnN0IG1vZGUgPSAoYmFja2VuZEVuYWJsZWQgJiYgc3luY01vZGUgPT09IFwiYmFja2VuZFwiKSA/IFwiYmFja2VuZFwiIDogREVGQVVMVF9NT0RFO1xuICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgci5jaGVja2VkID0gci52YWx1ZSA9PT0gbW9kZTtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBtb2RlO1xuICBpZiAobW9kZSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICAvLyBBdXRvLXRlc3Qgb24gb3BlbiBzbyB0aGUgdXNlciBzZWVzIHN0YXR1cyB3aXRob3V0IGNsaWNraW5nLiBBd2FpdGluZ1xuICAgIC8vIGhlcmUgc2VyaWFsaXplcyB0aGUgcmVzdCBvZiBpbml0KCkgdW50aWwgd2Uga25vdyB0aGUgYW5zd2VyLlxuICAgIGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICB9IGVsc2Uge1xuICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGN1cnJlbnRNb2RlKCkge1xuICBmb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkgaWYgKHIuY2hlY2tlZCkgcmV0dXJuIHIudmFsdWU7XG4gIHJldHVybiBERUZBVUxUX01PREU7XG59XG5cbmZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSB7XG4gIHIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKCk7XG4gICAgZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm1vZGUgPSBtb2RlO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNNb2RlOiBtb2RlIH0pO1xuICAgIGlmIChtb2RlID09PSBcImJhY2tlbmRcIikge1xuICAgICAgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7IC8vIHRyaWdnZXJzIGNoZWNrQmFja2VuZFBhdGllbnQgb24gc3VjY2Vzc1xuICAgIH0gZWxzZSB7XG4gICAgICBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZWxzLmJhY2tlbmRVcmwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IGJhY2tlbmRVcmw6IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKSB9KTtcbiAgZWxzLmRhc2hib2FyZExpbmsuaHJlZiA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnJlcGxhY2UoLzo4MDEwLiokLywgXCI6MzAxMFwiKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbn0pO1xuZWxzLnN5bmNBcGlLZXkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNBcGlLZXk6IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKSB9KTtcbn0pO1xuLy8gTWFzay1wYXRpZW50LW5hbWUgdG9nZ2xlIFx1MjAxNCBkZWZhdWx0cyBPRkYgKGNpdGl6ZW5zIGRvd25sb2FkaW5nIHRoZWlyXG4vLyBvd24gZGF0YSBkb24ndCBuZWVkIGFub255bWl6YXRpb24pLiBXaGVuIE9OOiBwb3B1cCBzdW1tYXJ5LCBGSElSXG4vLyBCdW5kbGUgb3V0cHV0LCBzeW5jLWxvZywgYW5kIE5ISSByZXBvcnQgbmFycmF0aXZlIGFsbCB1c2UgdGhlXG4vLyBtYXNrZWQgZm9ybSAoXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwKSBpbnN0ZWFkIG9mIHRoZSByZWFsIG5hbWUuXG5sZXQgX21hc2tOYW1lRW5hYmxlZCA9IGZhbHNlO1xuYXN5bmMgZnVuY3Rpb24gbG9hZE1hc2tOYW1lRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBtYXNrTmFtZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcIm1hc2tOYW1lRW5hYmxlZFwiKTtcbiAgX21hc2tOYW1lRW5hYmxlZCA9IG1hc2tOYW1lRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgaWYgKGVscy5tYXNrTmFtZUVuYWJsZWQpIGVscy5tYXNrTmFtZUVuYWJsZWQuY2hlY2tlZCA9IF9tYXNrTmFtZUVuYWJsZWQ7XG59XG5cbmZ1bmN0aW9uIF9tYXliZU1hc2sobmFtZSkge1xuICByZXR1cm4gX21hc2tOYW1lRW5hYmxlZCA/IG1hc2tOYW1lKG5hbWUpIDogbmFtZSB8fCBcIlwiO1xufVxuXG5lbHMubWFza05hbWVFbmFibGVkPy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGFzeW5jICgpID0+IHtcbiAgX21hc2tOYW1lRW5hYmxlZCA9IGVscy5tYXNrTmFtZUVuYWJsZWQuY2hlY2tlZDtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgbWFza05hbWVFbmFibGVkOiBfbWFza05hbWVFbmFibGVkIH0pO1xuICAvLyBSZS1yZW5kZXIgcG9wdXAgY2hyb21lIChzdW1tYXJ5IGxpbmUgaXMgdGhlIG9ubHkgc3BvdCB0aGF0IHJlYWRzXG4gIC8vIF9tYXliZU1hc2sgcmVhY3RpdmVseTsgZXZlcnl3aGVyZSBlbHNlIHNhbXBsZXMgaXQganVzdC1pbi10aW1lKS5cbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xufSk7XG5cbmVscy5zbWFydEFwcFVybC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgLy8gUGVyc2lzdCB0cmltbWVkIHZhbHVlLiBFbXB0eSBzdHJpbmcgXHUyMTkyIHJlc3RvcmUgZGVmYXVsdCBvbiBuZXh0IGxvYWQuXG4gIGNvbnN0IHYgPSBlbHMuc21hcnRBcHBVcmwudmFsdWUudHJpbSgpO1xuICBpZiAodikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNtYXJ0QXBwTGF1bmNoVXJsOiB2IH0pO1xuICB9IGVsc2Uge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInNtYXJ0QXBwTGF1bmNoVXJsXCIpO1xuICAgIGVscy5zbWFydEFwcFVybC52YWx1ZSA9IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSDtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIHNldFN0YXR1cyh0ZXh0LCBraW5kLCBicmVha2Rvd24sIGVycm9ycykge1xuICAvLyBCdWlsZCB3aXRoIERPTSBBUEkgXHUyMDE0IGF2b2lkcyBpbm5lckhUTUwgLyBYU1Mgcmlzay5cbiAgLy8gYnJlYWtkb3duIGlzIGFuIGFycmF5IG9mIG1peGVkIGVudHJpZXM6XG4gIC8vICAgLSBwaGFzZSB0aW1pbmdzIHByZWZpeGVkIHdpdGggXCJcdTIzRjFcIiAgXHUyMTkyIFx1OTY4RVx1NkJCNVx1ODAxN1x1NjY0MlxuICAvLyAgIC0gcGVyLWVuZHBvaW50IGNvdW50cyAgICAgICAgICAgICAgICBcdTIxOTIgXHU1NDA0IGVuZHBvaW50IFx1NjI5M1x1NTIzMFx1NUU3RVx1N0I0NlxuICAvLyBlcnJvcnMgKG9wdGlvbmFsKSBpcyB0aGUgcmF3IGAke2VwfTogJHttc2d9YCBzdHJpbmdzIGZyb20gdGhlIFNXLFxuICAvLyBzdXJmYWNlZCB1bmRlciBhIFwiXHU1OTMxXHU2NTU3XHU2NjBFXHU3RDMwXCIgc3ViLXNlY3Rpb24gc28gdGhlIHVzZXIgY2FuIHNlZSB3aGF0XG4gIC8vIHRoZSBcIk4gXHU5ODA1XHU1OTMxXHU2NTU3XCIgc3VtbWFyeSBhY3R1YWxseSBwb2ludHMgYXQgKG5vIGxvbmdlciBEZXZUb29scy1vbmx5KS5cbiAgLy8gQm90aCBncm91cHMgYXJlIHR1Y2tlZCBpbnNpZGUgYSBzaW5nbGUgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIiB0b2dnbGUgc28gdGhlXG4gIC8vIHBvcHVwIHN0YXlzIGNvbXBhY3QgYnkgZGVmYXVsdC5cbiAgZWxzLnN0YXR1cy5jbGFzc05hbWUgPSBraW5kIHx8IFwiXCI7XG4gIGVscy5zdGF0dXMudGV4dENvbnRlbnQgPSBcIlwiO1xuICBjb25zdCBoYXNFcnJvcnMgPSBBcnJheS5pc0FycmF5KGVycm9ycykgJiYgZXJyb3JzLmxlbmd0aCA+IDA7XG4gIGlmICghdGV4dCAmJiAhKGJyZWFrZG93biAmJiBicmVha2Rvd24ubGVuZ3RoKSAmJiAhaGFzRXJyb3JzKSByZXR1cm47XG5cbiAgLy8gSGVhZGVyIHJvdzogc3RhdHVzIHRleHQgKyBkaXNtaXNzIGJ1dHRvbiAob25seSB3aGVuIHN5bmMgbm90XG4gIC8vIHJ1bm5pbmcsIHNvIHRoZSB1c2VyIGNhbiBkZWNsdXR0ZXIgdGhlIHBvcHVwIG9uY2UgdGhleSdyZSBkb25lXG4gIC8vIHJlYWRpbmcgdGhlIHJlc3VsdCkuIE1pZC1zeW5jIHRoZSBidXR0b24gaXMgc3VwcHJlc3NlZCBzbyB0aGVcbiAgLy8gdXNlciBjYW4ndCBhY2NpZGVudGFsbHkgaGlkZSB0aGUgbGl2ZSBwcm9ncmVzcy5cbiAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgaGVhZGVyLmNsYXNzTmFtZSA9IFwic3RhdHVzLWhlYWRlclwiO1xuICBjb25zdCB0ZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICB0ZXh0U3Bhbi5jbGFzc05hbWUgPSBcInN0YXR1cy10ZXh0XCI7XG4gIHRleHRTcGFuLnRleHRDb250ZW50ID0gdGV4dCB8fCBcIlwiO1xuICBoZWFkZXIuYXBwZW5kQ2hpbGQodGV4dFNwYW4pO1xuICBjb25zdCBydW5uaW5nID0gX2xhdGVzdFN0YXR1cz8ucnVubmluZyA9PT0gdHJ1ZTtcbiAgaWYgKCFydW5uaW5nKSB7XG4gICAgY29uc3QgZGlzbWlzc0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgZGlzbWlzc0J0bi50eXBlID0gXCJidXR0b25cIjtcbiAgICBkaXNtaXNzQnRuLmNsYXNzTmFtZSA9IFwic3RhdHVzLWRpc21pc3NcIjtcbiAgICBkaXNtaXNzQnRuLnRleHRDb250ZW50ID0gXCJcdTI3MTVcIjtcbiAgICBkaXNtaXNzQnRuLnRpdGxlID0gXCJcdTZFMDVcdTk2NjRcdTkwMTlcdTUyNDdcdThBMEFcdTYwNkZcIjtcbiAgICBkaXNtaXNzQnRuLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJcdTZFMDVcdTk2NjRcdThBMEFcdTYwNkZcIik7XG4gICAgZGlzbWlzc0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgLy8gTWlycm9yIHdoYXQgdGhlIGV4aXN0aW5nIGNsZWFyUGVuZGluZ0J1bmRsZSBmbG93IGRvZXMgZm9yXG4gICAgICAvLyBpdHMgc2libGluZyBzdGFsZS1yZXN1bHQgd2lwZSBcdTIwMTQgZHJvcCBTVy1zaWRlIHBlcnNpc3RlZFxuICAgICAgLy8gc3luY1N0YXR1cywgZHJvcCBwb3B1cC1zaWRlIGNhY2hlZCBfbGF0ZXN0U3RhdHVzLCB0aGVuXG4gICAgICAvLyByZS1yZW5kZXIgZW1wdHkuXG4gICAgICBjaHJvbWUucnVudGltZVxuICAgICAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImNsZWFyU3luY1N0YXR1c1wiIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbiAgICAgIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgICB9KTtcbiAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoZGlzbWlzc0J0bik7XG4gIH1cbiAgZWxzLnN0YXR1cy5hcHBlbmRDaGlsZChoZWFkZXIpO1xuICBpZiAoKGJyZWFrZG93biAmJiBicmVha2Rvd24ubGVuZ3RoKSB8fCBoYXNFcnJvcnMpIHtcbiAgICBjb25zdCBiZCA9IGJyZWFrZG93biB8fCBbXTtcbiAgICBjb25zdCBwaGFzZVJvd3MgPSBiZC5maWx0ZXIoKGIpID0+IGIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG4gICAgY29uc3Qgb3RoZXJSb3dzID0gYmQuZmlsdGVyKChiKSA9PiAhYi5zdGFydHNXaXRoKFwiXHUyM0YxXCIpKTtcblxuICAgIGNvbnN0IGRldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGV0YWlsc1wiKTtcbiAgICBkZXRhaWxzLmNsYXNzTmFtZSA9IFwic3RhdHVzLWRldGFpbFwiO1xuICAgIGNvbnN0IHN1bW1hcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3VtbWFyeVwiKTtcbiAgICBzdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIjtcbiAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHN1bW1hcnkpO1xuXG4gICAgaWYgKG90aGVyUm93cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgYm9keS5jbGFzc05hbWUgPSBcInN0YXR1cy1icmVha2Rvd25cIjtcbiAgICAgIC8vIEVhY2ggYnJlYWtkb3duIHN0cmluZyBsb29rcyBsaWtlIFwiXHU1QzMxXHU5MUFCXHVGRjFBMTY0IFx1N0I0NlwiLiBTcGxpdCBvbiB0aGVcbiAgICAgIC8vIGZ1bGwtd2lkdGggY29sb24gYW5kIHJlbmRlciBsYWJlbCBsZWZ0IC8gdmFsdWUgcmlnaHQgc28gdGhlXG4gICAgICAvLyBjb3VudCBjb2x1bW4gbGluZXMgdXAgY2xlYW5seS4gUm93cyB0aGF0IGRvbid0IGhhdmUgYSBjbGVhblxuICAgICAgLy8gY29sb24gc3BsaXQgKG9yIGhhdmUgbXVsdGlwbGUsIGUuZy4gY29tcG9zaXRlIFwiXHU2MjEwXHU0RUJBXHU1MDY1XHU2QUEyXHVGRjFBXG4gICAgICAvLyAyIFx1N0I0NiBcdTIxOTIgMzQgXHU5ODA1XCIpIGZhbGwgYmFjayB0byBvbmUtbGluZSBwbGFpbiByZW5kZXJpbmcuXG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiBvdGhlclJvd3MpIHtcbiAgICAgICAgY29uc3QgbGluZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGluZUVsLmNsYXNzTmFtZSA9IFwiYnItcm93XCI7XG4gICAgICAgIGNvbnN0IGNvbG9uSWR4ID0gcm93LmluZGV4T2YoXCJcdUZGMUFcIik7XG4gICAgICAgIGlmIChjb2xvbklkeCA+IDAgJiYgY29sb25JZHggPCByb3cubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGNvbnN0IGxhYmVsU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgIGxhYmVsU3Bhbi5jbGFzc05hbWUgPSBcImJyLWxhYmVsXCI7XG4gICAgICAgICAgbGFiZWxTcGFuLnRleHRDb250ZW50ID0gcm93LnNsaWNlKDAsIGNvbG9uSWR4KTtcbiAgICAgICAgICBjb25zdCB2YWx1ZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICB2YWx1ZVNwYW4uY2xhc3NOYW1lID0gXCJici12YWx1ZVwiO1xuICAgICAgICAgIHZhbHVlU3Bhbi50ZXh0Q29udGVudCA9IHJvdy5zbGljZShjb2xvbklkeCArIDEpLnRyaW0oKTtcbiAgICAgICAgICBsaW5lRWwuYXBwZW5kQ2hpbGQobGFiZWxTcGFuKTtcbiAgICAgICAgICBsaW5lRWwuYXBwZW5kQ2hpbGQodmFsdWVTcGFuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaW5lRWwuY2xhc3NMaXN0LmFkZChcImJyLXJvdy1wbGFpblwiKTtcbiAgICAgICAgICBsaW5lRWwudGV4dENvbnRlbnQgPSByb3c7XG4gICAgICAgIH1cbiAgICAgICAgYm9keS5hcHBlbmRDaGlsZChsaW5lRWwpO1xuICAgICAgfVxuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZChib2R5KTtcbiAgICB9XG4gICAgaWYgKGhhc0Vycm9ycykge1xuICAgICAgLy8gRmFpbHVyZS1kZXRhaWwgbmVzdGVkIHNlY3Rpb24uIFBlci1lcnJvciByYXcgbWVzc2FnZXMgYXJlXG4gICAgICAvLyBkZXYtaXNoIChlLmcuIFwiaW1hZ2luZyBkZXRhaWw6IEhUVFAgNTA0XCIpIGJ1dCBzdXJmYWNpbmcgdGhlbVxuICAgICAgLy8gYmVhdHMgdGhlIHByZXZpb3VzIFwiTiBcdTk4MDVcdTU5MzFcdTY1NTcgXHUyMDE0IERldlRvb2xzIHRvIHJlYWRcIiBVWC4gRm9sZGVkXG4gICAgICAvLyBieSBkZWZhdWx0IHNvIHRoZSBzdWNjZXNzIHN1bW1hcnkgc3RheXMgdGhlIGRvbWluYW50IHNpZ25hbFxuICAgICAgLy8gd2hlbiBzb21ldGhpbmcgZGlkIHN0aWxsIGdldCB0aHJvdWdoLlxuICAgICAgY29uc3QgZXJyRGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkZXRhaWxzXCIpO1xuICAgICAgZXJyRGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWwgc3RhdHVzLWVycm9yc1wiO1xuICAgICAgY29uc3QgZXJyU3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xuICAgICAgZXJyU3VtbWFyeS50ZXh0Q29udGVudCA9IGBcdTU5MzFcdTY1NTdcdTY2MEVcdTdEMzBcdUZGMDgke2Vycm9ycy5sZW5ndGh9XHVGRjA5YDtcbiAgICAgIGVyckRldGFpbHMuYXBwZW5kQ2hpbGQoZXJyU3VtbWFyeSk7XG4gICAgICBjb25zdCBlcnJCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGVyckJvZHkuY2xhc3NOYW1lID0gXCJzdGF0dXMtZXJyb3ItbGlzdFwiO1xuICAgICAgZm9yIChjb25zdCBlIG9mIGVycm9ycykge1xuICAgICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGluZS50ZXh0Q29udGVudCA9IGBcdTIwMjIgJHtlfWA7XG4gICAgICAgIGVyckJvZHkuYXBwZW5kQ2hpbGQobGluZSk7XG4gICAgICB9XG4gICAgICBlcnJEZXRhaWxzLmFwcGVuZENoaWxkKGVyckJvZHkpO1xuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZChlcnJEZXRhaWxzKTtcbiAgICB9XG4gICAgaWYgKHBoYXNlUm93cy5sZW5ndGgpIHtcbiAgICAgIC8vIFBoYXNlIHRpbWluZ3MgYXJlIGRldiBpbmZvIFx1MjAxNCB0dWNrIHRoZW0gaW5zaWRlIGEgc2Vjb25kIHRvZ2dsZVxuICAgICAgLy8gc28gZW5kIHVzZXJzIGRvbid0IHNlZSBcIm5oaS1wYXJhbGxlbD04c1wiIHJpZ2h0IGFmdGVyIGEgc3VjY2Vzc1xuICAgICAgLy8gYmFubmVyIGFuZCB0aGluayBzb21ldGhpbmcncyB3cm9uZy5cbiAgICAgIGNvbnN0IHRlY2hEZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgICB0ZWNoRGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWwgc3RhdHVzLXRlY2hcIjtcbiAgICAgIGNvbnN0IHRlY2hTdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgICB0ZWNoU3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2MjgwXHU4ODUzXHU3RDMwXHU3QkMwXCI7XG4gICAgICB0ZWNoRGV0YWlscy5hcHBlbmRDaGlsZCh0ZWNoU3VtbWFyeSk7XG4gICAgICBjb25zdCBwaGFzZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgcGhhc2VzLmNsYXNzTmFtZSA9IFwic3RhdHVzLXBoYXNlc1wiO1xuICAgICAgLy8gRWFjaCBwaGFzZVJvdyBsb29rcyBsaWtlIFwiXHUyM0YxIG5oaS1wYXJhbGxlbD0yLjZzXCIuIFN0cmlwIHRoZVxuICAgICAgLy8gc3RvcHdhdGNoIHByZWZpeCwgc3BsaXQgb24gXCI9XCIsIHJlbmRlciBhcyBsYWJlbCAvIHZhbHVlIHBhaXJcbiAgICAgIC8vIHNvIGR1cmF0aW9ucyBhbGlnbiB2ZXJ0aWNhbGx5ICh0YWJ1bGFyLW51bXMgaW4gQ1NTKS5cbiAgICAgIGZvciAoY29uc3QgcmF3IG9mIHBoYXNlUm93cykge1xuICAgICAgICBjb25zdCBjbGVhbiA9IHJhdy5yZXBsYWNlKC9eXHUyM0YxXFxzKi8sIFwiXCIpO1xuICAgICAgICBjb25zdCBlcUlkeCA9IGNsZWFuLmluZGV4T2YoXCI9XCIpO1xuICAgICAgICBjb25zdCByb3dFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHJvd0VsLmNsYXNzTmFtZSA9IFwicGgtcm93XCI7XG4gICAgICAgIGlmIChlcUlkeCA+IDAgJiYgZXFJZHggPCBjbGVhbi5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgY29uc3QgbGFiZWxTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgbGFiZWxTcGFuLmNsYXNzTmFtZSA9IFwicGgtbGFiZWxcIjtcbiAgICAgICAgICBsYWJlbFNwYW4udGV4dENvbnRlbnQgPSBjbGVhbi5zbGljZSgwLCBlcUlkeCk7XG4gICAgICAgICAgY29uc3QgdmFsdWVTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgdmFsdWVTcGFuLmNsYXNzTmFtZSA9IFwicGgtdmFsdWVcIjtcbiAgICAgICAgICB2YWx1ZVNwYW4udGV4dENvbnRlbnQgPSBjbGVhbi5zbGljZShlcUlkeCArIDEpO1xuICAgICAgICAgIHJvd0VsLmFwcGVuZENoaWxkKGxhYmVsU3Bhbik7XG4gICAgICAgICAgcm93RWwuYXBwZW5kQ2hpbGQodmFsdWVTcGFuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByb3dFbC50ZXh0Q29udGVudCA9IGNsZWFuO1xuICAgICAgICB9XG4gICAgICAgIHBoYXNlcy5hcHBlbmRDaGlsZChyb3dFbCk7XG4gICAgICB9XG4gICAgICB0ZWNoRGV0YWlscy5hcHBlbmRDaGlsZChwaGFzZXMpO1xuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZCh0ZWNoRGV0YWlscyk7XG4gICAgfVxuICAgIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG4gIH1cbiAgLy8gU3RhdHVzIHZpc2liaWxpdHkgZHJpdmVzIHdoZXRoZXIgdGhlIHJlc3VsdCB6b25lIHNob3dzIGF0IGFsbC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFjdGl2ZVRhYigpIHtcbiAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KTtcbiAgcmV0dXJuIHRhYjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBlbmRpbmcgRkhJUiBCdW5kbGUgKGxvY2FsLW1vZGUgcmVzdWx0KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBCYWNrZ3JvdW5kIHN0YXNoZXMgdGhlIGdlbmVyYXRlZCBCdW5kbGUgaW50byBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gdW5kZXIgYHBlbmRpbmdGaGlyQnVuZGxlYC4gUG9wdXAgcmVuZGVycyBhIGRvd25sb2FkIGJ1dHRvbi4gVXNlciBtdXN0XG4vLyBjbGljayB0byBhY3R1YWxseSB0cmlnZ2VyIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgXHUyMDE0IHRoZSBmaWxlIG5ldmVyXG4vLyBoaXRzIHRoZSBkaXNrIHVuc29saWNpdGVkLlxuXG5mdW5jdGlvbiBfZm10Qnl0ZXMobikge1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDI0ICogMTAyNCkgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAoMTAyNCAqIDEwMjQpKS50b0ZpeGVkKDIpfSBNQmA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLnNlc3Npb24uZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZyB8fCAhcGVuZGluZy5qc29uKSB7XG4gICAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gSWYgdGhlIHVzZXIgaGFzIHN3aXRjaGVkIG92ZXJyaWRlIHRvIGEgZGlmZmVyZW50IHBhdGllbnQsIHRoZVxuICAvLyBzdGFzaGVkIGJ1bmRsZSBpcyBmb3IgdGhlICpwcmV2aW91cyogcGF0aWVudC4gSGlkZSBpdCBzbyB0aGV5XG4gIC8vIGNhbid0IGFjY2lkZW50YWxseSBkb3dubG9hZCB0aGUgd3JvbmcgZmlsZS4gVGhlIGJ1bmRsZSBzdGF5cyBpblxuICAvLyBzdG9yYWdlOyByZS1lbnRlcmluZyB0aGUgbWF0Y2hpbmcgb3ZlcnJpZGUgd2lsbCBzdXJmYWNlIGl0IGFnYWluLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAob3Y/LmlkX25vICYmIHBlbmRpbmcucGF0aWVudElkICYmIHBlbmRpbmcucGF0aWVudElkICE9PSBvdi5pZF9ubykge1xuICAgIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IGZhbHNlO1xuICAvLyBGaWxlbmFtZSArIHNpemVhZ2UgbGl2ZSBpbiBzZXBhcmF0ZSBzaWJsaW5nIGVsZW1lbnRzIGluIHRoZSBuZXdcbiAgLy8gc2luZ2xlLXBhbmVsIGxheW91dCBzbyB3ZSBqdXN0IHVwZGF0ZSBlYWNoIGRpcmVjdGx5LlxuICBjb25zdCBhZ28gPSBwZW5kaW5nLmdlbmVyYXRlZEF0ID8gX2ZtdFJlbGF0aXZlKHBlbmRpbmcuZ2VuZXJhdGVkQXQpIDogXCJcIjtcbiAgaWYgKGVscy5idW5kbGVGaWxlbmFtZSkge1xuICAgIGVscy5idW5kbGVGaWxlbmFtZS50ZXh0Q29udGVudCA9IHBlbmRpbmcuZmlsZW5hbWU7XG4gICAgZWxzLmJ1bmRsZUZpbGVuYW1lLnRpdGxlID0gcGVuZGluZy5maWxlbmFtZTtcbiAgfVxuICBpZiAoZWxzLmJ1bmRsZVNpemVhZ2UpIHtcbiAgICBlbHMuYnVuZGxlU2l6ZWFnZS50ZXh0Q29udGVudCA9IGAke19mbXRCeXRlcyhwZW5kaW5nLmJ5dGVzIHx8IDApfSR7YWdvID8gYCBcdTAwQjcgJHthZ299YCA6IFwiXCJ9YDtcbiAgfVxuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbn1cblxuLy8gUmV3cml0ZSB0aGUgc3luYy1zdGF0dXMgYmFubmVyIGZyb20gXCJcdTI3MDUgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwXCIgXHUyMTkyIFwiXHUyNzA1IFx1NURGMlx1NEUwQlx1OEYwOVwiIG9uY2Vcbi8vIHRoZSB1c2VyIGhhcyBhY3R1YWxseSBzYXZlZCB0aGUgYnVuZGxlIHRvIGRpc2suIEtlZXBzIHRvdGFsUmVzb3VyY2VzXG4vLyArIGVsYXBzZWQgaW5mbyB0aGF0IHdhcyBpbiB0aGUgb3JpZ2luYWwgbWVzc2FnZSBzbyB0aGUgdXNlciBzdGlsbFxuLy8gc2VlcyBcIndoYXQgZ290IGRvd25sb2FkZWRcIiBhdCBhIGdsYW5jZS4gSWRlbXBvdGVudCBcdTIwMTQgcmUtcnVucyBub29wXG4vLyBpZiBwaGFzZSBpcyBhbHJlYWR5IFwiZG93bmxvYWRlZFwiLlxuYXN5bmMgZnVuY3Rpb24gX3RyYW5zaXRpb25TdGF0dXNUb0Rvd25sb2FkZWQoYnl0ZXMpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHN5bmNTdGF0dXMgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInN5bmNTdGF0dXNcIik7XG4gICAgaWYgKCFzeW5jU3RhdHVzIHx8IHN5bmNTdGF0dXMucGhhc2UgPT09IFwiZG93bmxvYWRlZFwiKSByZXR1cm47XG4gICAgY29uc3QgdG90YWwgPSBzeW5jU3RhdHVzLnRvdGFsUmVzb3VyY2VzID8/IDA7XG4gICAgY29uc3Qgc2l6ZVN0ciA9IGJ5dGVzID8gYCBcdTAwQjcgJHtfZm10Qnl0ZXMoYnl0ZXMpfWAgOiBcIlwiO1xuICAgIGNvbnN0IG5leHQgPSB7XG4gICAgICAuLi5zeW5jU3RhdHVzLFxuICAgICAgcHJvZ3Jlc3M6IGBcdTI3MDUgXHU1REYyXHU0RTBCXHU4RjA5XHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHU2QTk0XHVGRjA4XHU1MTcxICR7dG90YWx9IFx1N0I0NiR7c2l6ZVN0cn1cdUZGMDlcdTIwMTQgXHU2M0E1XHU4NDU3XHU4MUYzIFx1MjQ2MyBcdTY3RTVcdTc3MEIgXHU5NThCXHU1NTVGXHUzMDBDXHU5MUFCXHU2NzkwIE1lZGlQcmlzbWFcdTMwMERcdTcwMEZcdTg5QkRcdThDQzdcdTY1OTlcdTMwMDJgLFxuICAgICAgcGhhc2U6IFwiZG93bmxvYWRlZFwiLFxuICAgICAgdHM6IERhdGUubm93KCksXG4gICAgfTtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jU3RhdHVzOiBuZXh0IH0pO1xuICB9IGNhdGNoIHt9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkUGVuZGluZ0J1bmRsZSgpIHtcbiAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBpZiAoIXBlbmRpbmcpIHJldHVybjtcbiAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtwZW5kaW5nLmpzb25dLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vZmhpcitqc29uXCIgfSk7XG4gIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gIGxldCBkb3dubG9hZElkID0gbnVsbDtcbiAgdHJ5IHtcbiAgICAvLyBzYXZlQXM6IHRydWUgXHUyMTkyIENocm9tZSBvcGVucyBhIG5hdGl2ZSBcInNhdmUgYXNcIiBkaWFsb2cgc28gdGhlIHVzZXJcbiAgICAvLyBleHBsaWNpdGx5IGNob29zZXMgdGhlIGRlc3RpbmF0aW9uIGFuZCBjYW4gcmV2aWV3IHRoZSBmaWxlbmFtZVxuICAgIC8vIGJlZm9yZSBQSEkgbGFuZHMgb24gZGlzay4gQmV0dGVyIHRoYW4gc2lsZW50bHkgZHJvcHBpbmcgaW50byB0aGVcbiAgICAvLyBkZWZhdWx0IERvd25sb2FkcyBmb2xkZXIuXG4gICAgZG93bmxvYWRJZCA9IGF3YWl0IGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQoe1xuICAgICAgdXJsLFxuICAgICAgZmlsZW5hbWU6IHBlbmRpbmcuZmlsZW5hbWUsXG4gICAgICBzYXZlQXM6IHRydWUsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBVc2VyIGNhbmNlbGxlZCB0aGUgc2F2ZSBkaWFsb2cgb3IgdGhlIGRvd25sb2FkIG90aGVyd2lzZSBmYWlsZWQgXHUyMDE0XG4gICAgLy8gbGVhdmUgdGhlIHBlbmRpbmcgYnVuZGxlIGluIHBsYWNlIHNvIHRoZSB1c2VyIGNhbiB0cnkgYWdhaW4uXG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDUwMDApO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZG93bmxvYWRJZCA9PSBudWxsKSB7XG4gICAgLy8gVXNlciBkaXNtaXNzZWQgdGhlIHNhdmVBcyBkaWFsb2cgKENocm9tZSByZXNvbHZlcyB0aGUgcHJvbWlzZVxuICAgIC8vIHdpdGggdW5kZWZpbmVkIGluIHRoYXQgY2FzZSkuIERvbid0IHdpcGUgdGhlIHN0YXNoLlxuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCA1MDAwKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gV2lwZSB0aGUgc2Vzc2lvbi1zdGFzaGVkIGNvcHkgb25jZSB0aGUgZG93bmxvYWQgYWN0dWFsbHkgc3RhcnRzLlxuICAvLyBUaGUgZmlsZSBpcyBub3cgb24gdGhlIHVzZXIncyBkaXNrIHVuZGVyIHRoZWlyIGNob3NlbiBwYXRoIFx1MjAxNFxuICAvLyBrZWVwaW5nIGEgZHVwbGljYXRlIGluIGNocm9tZS5zdG9yYWdlLnNlc3Npb24gaXMgcHVyZSBQSEkgc3VyZmFjZS5cbiAgLy8gV2UgbGlzdGVuIGZvciB0aGUgZG93bmxvYWQncyB0ZXJtaW5hbCBzdGF0ZSAoY29tcGxldGUgb3IgaW50ZXJydXB0ZWQpXG4gIC8vIGJlZm9yZSB3aXBpbmcsIHNvIGEgaGFsZi13cml0dGVuIGZpbGUgZm9sbG93ZWQgYnkgYSByZXRyeSBzdGlsbCBoYXNcbiAgLy8gc29tZXRoaW5nIHRvIGZhbGwgYmFjayBvbi4gQmVsdC1hbmQtc3VzcGVuZGVycyBvbmx5IFx1MjAxNCBUVEwgc3dlZXAgaW5cbiAgLy8gdGhlIFNXIHdpbGwgY2F0Y2ggYW55IGNhc2Ugd2hlcmUgdGhlIGxpc3RlbmVyIG5ldmVyIGZpcmVzLlxuICBjb25zdCBfb25DaGFuZ2UgPSAoZGVsdGEpID0+IHtcbiAgICBpZiAoZGVsdGEuaWQgIT09IGRvd25sb2FkSWQpIHJldHVybjtcbiAgICBjb25zdCBmaW5hbCA9IGRlbHRhLnN0YXRlPy5jdXJyZW50O1xuICAgIGlmIChmaW5hbCA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIGNocm9tZS5kb3dubG9hZHMub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKF9vbkNoYW5nZSk7XG4gICAgICAvLyBUcmFuc2l0aW9uIHRoZSBzeW5jIHN0YXR1cyBiYW5uZXIgZnJvbSBcIlx1MjcwNSBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTBcIiB0b1xuICAgICAgLy8gXCJcdTI3MDUgXHU1REYyXHU0RTBCXHU4RjA5XCIgc28gdXNlcnMgd2hvIGNsb3NlICsgcmVvcGVuIHRoZSBwb3B1cCAob3IganVzdFxuICAgICAgLy8gZ2xhbmNlIGF0IHRoZSBiYW5uZXIpIHNlZSBhbiBhY2N1cmF0ZSB1cC10by1kYXRlIHN0YXRlXG4gICAgICAvLyByYXRoZXIgdGhhbiBhIHN0YWxlIFwiY29tcGxldGVkIHN5bmNcIiBtZXNzYWdlLiBUaGUgYnJlYWtkb3duXG4gICAgICAvLyAoXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwKSBzdGF5cyBzbyB0aGUgY291bnQgb2Ygd2hhdCB3YXMgZG93bmxvYWRlZCBpc1xuICAgICAgLy8gc3RpbGwgaW5zcGVjdGFibGUuXG4gICAgICBfdHJhbnNpdGlvblN0YXR1c1RvRG93bmxvYWRlZChwZW5kaW5nLmJ5dGVzKTtcbiAgICB9IGVsc2UgaWYgKGZpbmFsID09PSBcImludGVycnVwdGVkXCIpIHtcbiAgICAgIC8vIEtlZXAgdGhlIHN0YXNoOyB1c2VyIG1pZ2h0IHJldHJ5LlxuICAgICAgY2hyb21lLmRvd25sb2Fkcy5vbkNoYW5nZWQucmVtb3ZlTGlzdGVuZXIoX29uQ2hhbmdlKTtcbiAgICB9XG4gIH07XG4gIGNocm9tZS5kb3dubG9hZHMub25DaGFuZ2VkLmFkZExpc3RlbmVyKF9vbkNoYW5nZSk7XG4gIC8vIFJlbGVhc2Ugb2JqZWN0IFVSTCBhZnRlciB0aGUgZG93bmxvYWQgaGFzIHRpbWUgdG8gc3RhcnQuXG4gIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCA1MDAwKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJQZW5kaW5nQnVuZGxlKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBhd2FpdCByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuICAvLyBDbGVhcmluZyB0aGUgZG93bmxvYWQgaXMgdGhlIHVzZXIncyBcIkknbSBkb25lIHdpdGggdGhpcyByZXN1bHRcIlxuICAvLyBnZXN0dXJlIFx1MjAxNCB3aXBlIHRoZSBjb21wbGV0aW9uIHN0YXR1cyBiYW5uZXIgdG9vIHNvIHRoZSByZXN1bHQgem9uZVxuICAvLyBjb2xsYXBzZXMgZW50aXJlbHkgaW5zdGVhZCBvZiBsaW5nZXJpbmcgd2l0aCBhIHN0YWxlIFwiXHUyNzA1IFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMFwiXG4gIC8vIGFuZCBubyBkb3dubG9hZCBidXR0b24gbmV4dCB0byBpdC5cbiAgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG4gIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgYXdhaXQgY2hyb21lLnJ1bnRpbWVcbiAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImNsZWFyU3luY1N0YXR1c1wiIH0pXG4gICAgLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuZWxzLmRvd25sb2FkQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBkb3dubG9hZFBlbmRpbmdCdW5kbGUpO1xuZWxzLmNsZWFyQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhclBlbmRpbmdCdW5kbGUpO1xuXG4vLyBMaXZlIHVwZGF0ZSB3aGVuIGJhY2tncm91bmQgc3Rhc2hlcyBhIG5ldyBidW5kbGUgd2hpbGUgcG9wdXAgaXMgb3Blbi5cbi8vIChOb3RlOiBhbm90aGVyIG9uQ2hhbmdlZCBsaXN0ZW5lciBlYXJsaWVyIGluIHRoZSBmaWxlIHJlZnJlc2hlcyB0aGVcbi8vIGRhdGEtc3RhdGUgY2FyZDsgd2UgbGVhdmUgdGhhdCBvbmUgc2VwYXJhdGUgc28gZmFpbHVyZSBvZiBlaXRoZXIgcGF0aFxuLy8gZG9lc24ndCB0YWtlIHRoZSBvdGhlciBkb3duLilcbi8vIFBlbmRpbmcgYnVuZGxlIGlzIGluIGNocm9tZS5zdG9yYWdlLnNlc3Npb24gKHNlY3VyaXR5IGF1ZGl0ICM1IGZpeCk7XG4vLyBsaXN0ZW5lciBmaWx0ZXJzIG9uIFwic2Vzc2lvblwiIGFyZWEgYWNjb3JkaW5nbHkuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwic2Vzc2lvblwiICYmIFBFTkRJTkdfQlVORExFX0tFWSBpbiBjaGFuZ2VzKSByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xufSk7XG5cbi8vIEJhY2tncm91bmQtc2lkZSBmbG93IGNhbiBtdXRhdGUgdGhlIHBhdGllbnRPdmVycmlkZSBtaWQtc3luYyBcdTIwMTQgbW9zdFxuLy8gaW1wb3J0YW50bHkgX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpIHN3YXBzIHRoZSBhdXRvLVhYWFhYWFhYXG4vLyBwbGFjZWhvbGRlciBmb3IgdGhlIHJlYWwgTkhJIGNpZC4gV2l0aG91dCB0aGlzIGxpc3RlbmVyIHRoZSBwb3B1cFxuLy8gaW5wdXRzIHN0YXllZCBzdGFsZSwgcmVmcmVzaFBlbmRpbmdCdW5kbGUncyBwYXRpZW50LW1hdGNoIGNoZWNrXG4vLyB0aGVuIGNvbXBhcmVkIG9sZCBpbnB1dCB2YWx1ZSB2cy4gZnJlc2ggYnVuZGxlLnBhdGllbnRJZCBhbmQgaGlkXG4vLyB0aGUgZG93bmxvYWQgYnV0dG9uLiBSZWxvYWQgdGhlIG92ZXJyaWRlIGludG8gdGhlIGlucHV0cyB3aGVuZXZlclxuLy8gc3RvcmFnZSBjaGFuZ2VzIHNvIGV2ZXJ5IGRvd25zdHJlYW0gZ3VhcmQgc2VlcyBjb25zaXN0ZW50IHZhbHVlcy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIGNoYW5nZXMucGF0aWVudE92ZXJyaWRlKSBsb2FkUGF0aWVudE92ZXJyaWRlKCk7XG59KTtcblxuLy8gXHUyNTAwXHUyNTAwIFx1MjREOCBIZWxwLWljb24gdG9vbHRpcCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBPbmUgc2hhcmVkIDxkaXY+IGFwcGVuZGVkIHRvIHRoZSBwb3B1cCBib2R5LiBPbiBob3ZlciBvZiBhbnlcbi8vIC5oZWxwLWljb24sIHdlIGNvcHkgaXRzIGRhdGEtdGlwIHRleHQgYW5kIHBvc2l0aW9uIHRoZSB0b29sdGlwXG4vLyBpbnNpZGUgdGhlIHBvcHVwLCBjbGFtcGluZyB0byBpdHMgdmlld3BvcnQgc28gaXQgY2FuJ3QgY2xpcCBvZmZcbi8vIGVpdGhlciBlZGdlIHJlZ2FyZGxlc3Mgb2Ygd2hlcmUgdGhlIGljb24gc2l0cy4gKENTUyBwc2V1ZG8tZWxlbWVudHNcbi8vIGNhbid0IGJlIG1lYXN1cmVkLCBzbyBhIHB1cmUtQ1NTIGFwcHJvYWNoIGluZXZpdGFibHkgcGlja3Mgb25lXG4vLyBhbmNob3Igc2lkZSBhbmQgYnJlYWtzIGZvciBpY29ucyBvbiB0aGUgb3RoZXIgc2lkZSBvZiB0aGUgcG9wdXAuKVxuY29uc3QgX2hlbHBUaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuX2hlbHBUaXAuY2xhc3NOYW1lID0gXCJoZWxwLXRvb2x0aXBcIjtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoX2hlbHBUaXApO1xuXG5jb25zdCBWSUVXUE9SVF9NQVJHSU4gPSA2OyAvLyBrZWVwIHRoaXMgbWFueSBweCBjbGVhciBvZiBwb3B1cCBlZGdlc1xuXG5mdW5jdGlvbiBfc2hvd0hlbHBUb29sdGlwKGljb24pIHtcbiAgX2hlbHBUaXAudGV4dENvbnRlbnQgPSBpY29uLmRhdGFzZXQudGlwIHx8IGljb24uZ2V0QXR0cmlidXRlKFwiZGF0YS10aXBcIikgfHwgXCJcIjtcbiAgX2hlbHBUaXAuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG5cbiAgLy8gTWVhc3VyZSBub3cgdGhhdCBjb250ZW50IGlzIHNldC5cbiAgY29uc3QgaWNvblJlY3QgPSBpY29uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB0aXBSZWN0ID0gX2hlbHBUaXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHZpZXdwb3J0VyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcbiAgY29uc3Qgdmlld3BvcnRIID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcblxuICAvLyBIb3Jpem9udGFsOiBwcmVmZXIgY2VudGVyZWQgb24gdGhlIGljb247IGNsYW1wIGludG8gW21hcmdpbiwgdnctdGlwLW1hcmdpbl0uXG4gIGxldCBsZWZ0ID0gaWNvblJlY3QubGVmdCArIGljb25SZWN0LndpZHRoIC8gMiAtIHRpcFJlY3Qud2lkdGggLyAyO1xuICBpZiAobGVmdCA8IFZJRVdQT1JUX01BUkdJTikgbGVmdCA9IFZJRVdQT1JUX01BUkdJTjtcbiAgaWYgKGxlZnQgKyB0aXBSZWN0LndpZHRoID4gdmlld3BvcnRXIC0gVklFV1BPUlRfTUFSR0lOKSB7XG4gICAgbGVmdCA9IHZpZXdwb3J0VyAtIFZJRVdQT1JUX01BUkdJTiAtIHRpcFJlY3Qud2lkdGg7XG4gIH1cbiAgLy8gVmVydGljYWw6IHByZWZlciBhYm92ZSB0aGUgaWNvbjsgZmxpcCBiZWxvdyBpZiB0aGVyZSdzIG5vIHJvb20gdXAgdG9wLlxuICBsZXQgdG9wID0gaWNvblJlY3QudG9wIC0gdGlwUmVjdC5oZWlnaHQgLSA2O1xuICBpZiAodG9wIDwgVklFV1BPUlRfTUFSR0lOKSB0b3AgPSBpY29uUmVjdC5ib3R0b20gKyA2O1xuICAvLyBGaW5hbCBzYWZldHk6IGNsYW1wIGludG8gdmlld3BvcnQgc28gdmVyeSBsb25nIHRvb2x0aXBzIGNhbid0IGJsZWVkXG4gIC8vIG9mZiB0aGUgYm90dG9tIGVpdGhlci5cbiAgaWYgKHRvcCArIHRpcFJlY3QuaGVpZ2h0ID4gdmlld3BvcnRIIC0gVklFV1BPUlRfTUFSR0lOKSB7XG4gICAgdG9wID0gTWF0aC5tYXgoVklFV1BPUlRfTUFSR0lOLCB2aWV3cG9ydEggLSBWSUVXUE9SVF9NQVJHSU4gLSB0aXBSZWN0LmhlaWdodCk7XG4gIH1cblxuICBfaGVscFRpcC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gIF9oZWxwVGlwLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG59XG5cbmZ1bmN0aW9uIF9oaWRlSGVscFRvb2x0aXAoKSB7XG4gIF9oZWxwVGlwLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xufVxuXG4vLyBEZWxlZ2F0ZWQgaG92ZXIgaGFuZGxlcnMgXHUyMDE0IHdvcmtzIGZvciBpY29ucyBhZGRlZCBhZnRlciBwb3B1cCBsb2FkIHRvb1xuLy8gKGUuZy4gd2hlbiBtb2RlIHRvZ2dsZSByZXZlYWxzIGJhY2tlbmQtb25seSBmaWVsZHMpLlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCAoZSkgPT4ge1xuICBjb25zdCBpY29uID0gZS50YXJnZXQuY2xvc2VzdD8uKFwiLmhlbHAtaWNvblwiKTtcbiAgaWYgKGljb24pIF9zaG93SGVscFRvb2x0aXAoaWNvbik7XG59KTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCAoZSkgPT4ge1xuICBjb25zdCBpY29uID0gZS50YXJnZXQuY2xvc2VzdD8uKFwiLmhlbHAtaWNvblwiKTtcbiAgaWYgKGljb24pIF9oaWRlSGVscFRvb2x0aXAoKTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBpbml0KCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZlcnNpb25cIikudGV4dENvbnRlbnQgPVxuICAgIFwidlwiICsgY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3QoKS52ZXJzaW9uO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW4tb2stbmV4dFwiKVxuICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IF9zZXRBY3RpdmVTdGVwKDIpKTtcblxuICBhd2FpdCBsb2FkTWFza05hbWVFbmFibGVkKCk7XG5cbiAgLy8gU2VlZCBsb2NhbCBidW5kbGUgc3RhdGUgZnJvbSBzdG9yYWdlIHNvIHRoZSBkYXRhLXN0YXRlIGNhcmQgaXNcbiAgLy8gcG9wdWxhdGVkIGFzIHNvb24gYXMgdGhlIHBvcHVwIHJlbmRlcnMgKG5vIGZsYXNoIG9mIFwiXHU2NzJBXHU3NTIyXHU3NTFGXCIpLlxuICBhd2FpdCBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcblxuICAvLyBPcmRlciBtYXR0ZXJzOiBsb2FkQmFja2VuZFVybCBwb3B1bGF0ZXMgZWxzLmJhY2tlbmRVcmwudmFsdWUsIHdoaWNoXG4gIC8vIGxvYWRTeW5jTW9kZSgpIHJlYWRzIHZpYSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKS4gUmV2ZXJzZSB0aGlzIGFuZFxuICAvLyB0aGUgYXV0by10ZXN0IHNlZXMgYW4gZW1wdHkgVVJMIGFuZCBmYWxzZWx5IHJlcG9ydHMgXCJcdTY3MkFcdThBMkRcdTVCOUEgQmFja2VuZCBVUkxcIlxuICAvLyBvbiBldmVyeSBwb3B1cCBvcGVuLiBsb2FkQmFja2VuZE1vZGVFbmFibGVkIGFsc28gaGFzIHRvIGxhbmQgYmVmb3JlXG4gIC8vIGxvYWRTeW5jTW9kZTogdGhlIGxhdHRlciBjb25zdWx0cyBib2R5W2RhdGEtYmFja2VuZC1lbmFibGVkXSB0b1xuICAvLyBkZWNpZGUgd2hldGhlciBhIHN0b3JlZCBcImJhY2tlbmRcIiBtb2RlIGlzIGhvbm9yZWQgb3IgZm9yY2VkIHRvIGxvY2FsLlxuICBhd2FpdCBsb2FkQmFja2VuZE1vZGVFbmFibGVkKCk7XG4gIGF3YWl0IGxvYWRCYWNrZW5kVXJsKCk7XG4gIGF3YWl0IGxvYWRTeW5jTW9kZSgpO1xuICBhd2FpdCBsb2FkUGF0aWVudE92ZXJyaWRlKCk7XG4gIGF3YWl0IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG5cbiAgY29uc3QgdGFiID0gYXdhaXQgZ2V0QWN0aXZlVGFiKCk7XG4gIGlmICghdGFiPy51cmwpIHtcbiAgICBzZXRTdGF0dXMoXCJubyBhY3RpdmUgdGFiXCIsIFwiZXJyb3JcIik7XG4gICAgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFN5bmMgcmVxdWlyZXMgYmVpbmcgb24gYW4gTkhJIHRhYiBzbyBjb29raWVzL3Nlc3Npb24gYXJlIHVzYWJsZSBmcm9tXG4gIC8vIHRoZSBTVy4gRmxhZyB2aWEgZGF0YXNldCBzbyBfcmVmcmVzaEJ1dHRvblN0YXRlcyBjYW4gY29tYmluZSB0aGlzXG4gIC8vIHdpdGggdGhlIG1vZGUgKyBjb25uIHN0YXRlLiBXaGVuIG9mZi1OSEksIGFsc28gc3VyZmFjZSB0aGVcbiAgLy8gXCJcdUQ4M0RcdUREMTcgXHU5NThCXHU1NTVGXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU3NjdCXHU1MTY1XCIgYmFubmVyIHNvIHVzZXJzIGRvbid0IHdvbmRlciB3aGVyZSB0byBnby5cbiAgY29uc3Qgb25OaGkgPSBpc05oaVRhYih0YWIudXJsKTtcbiAgaWYgKG9uTmhpKSBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGVsc2UgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgaWYgKGVscy5vcGVuTmhpU2VjdGlvbikgZWxzLm9wZW5OaGlTZWN0aW9uLmhpZGRlbiA9IG9uTmhpO1xuICAvLyBTdGFzaCB0aGUgTkhJIHRhYiBpZCBzbyB0aGUgXCJcdTkxQ0RcdTY1QjBcdTY1NzRcdTc0MDZcdTk4MDFcdTk3NjJcIiBidXR0b24gaW5zaWRlIHRoZVxuICAvLyBuZWVkcy1sb2dpbiBiYW5uZXIgY2FuIHJlbG9hZCBpdCB3aXRob3V0IGhhdmluZyB0byByZS1xdWVyeSB0YWJzLlxuICBfbmhpVGFiSWQgPSBvbk5oaSA/IHRhYi5pZCA6IG51bGw7XG5cbiAgLy8gV2hlbiBvbiB0aGUgTkhJIHRhYiwgYXNrIGJhY2tncm91bmQgdG8gdmVyaWZ5IHRoZXJlJ3MgYW4gYWN0aXZlXG4gIC8vIHNlc3Npb24uIFRoZSBTVyBwcm9iZXMgSUhLRTM0MTAgd2l0aCBzZXNzaW9uU3RvcmFnZS50b2tlbiBcdTIwMTQgY2hlYXBcbiAgLy8gYW5kIG9ubHkgc3VjY2VlZHMgd2hlbiB0aGUgdXNlciBoYXMgbG9nZ2VkIGluLiBBbnl0aGluZyBidXQgYHRydWVgXG4gIC8vIChmYWxzZSwgbnVsbCwgb3Igbm8gcmVzcG9uc2UpIG1ha2VzIHVzIGFzc3VtZSBcIm5vdCBsb2dnZWQgaW5cIiBzb1xuICAvLyB0aGUgdXNlciBzZWVzIHRoZSBhY3Rpb25hYmxlIGJhbm5lciBpbnN0ZWFkIG9mIG1hc2hpbmcgdGhlIENUQVxuICAvLyBpbnRvIGEgZGVsYXllZCBcIlx1RDgzRFx1REQxMiBcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcIiBzdGF0dXMuXG4gIGlmIChvbk5oaSAmJiB0YWIuaWQpIHtcbiAgICBjaHJvbWUucnVudGltZVxuICAgICAgLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJjaGVja05oaUxvZ2luXCIsIHRhYklkOiB0YWIuaWQgfSlcbiAgICAgIC50aGVuKChyZXNwKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvZ2dlZEluID0gcmVzcD8ubG9nZ2VkSW4gPT09IHRydWU7XG4gICAgICAgIGlmIChsb2dnZWRJbikgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgICAgIGVsc2UgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiA9IFwibm9cIjtcbiAgICAgICAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbikge1xuICAgICAgICAgIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSBsb2dnZWRJbjtcbiAgICAgICAgfVxuICAgICAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgICAvLyBMb2dpbiBwcm9iZSBjb21wbGV0aW5nIHBvc2l0aXZlbHkgaXMgdGhlIHN0ZXAtMSBpbnRlbnRpb25hbFxuICAgICAgICAvLyBjb21wbGV0aW9uIGV2ZW50IFx1MjAxNCBhZHZhbmNlIHRoZSB3aXphcmQgb25jZSBpZiB0aGUgdXNlciBpc1xuICAgICAgICAvLyBjdXJyZW50bHkgbG9va2luZyBhdCBzdGVwIDEuXG4gICAgICAgIGlmIChsb2dnZWRJbiAmJiBfd2l6YXJkSW5pdGlhbGl6ZWQpIF9tYXliZUF1dG9BZHZhbmNlKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgLy8gSWYgdGhlIHByb2JlIGZhaWxzIChTVyB1bnJlYWNoYWJsZSwgZXRjKSwgZG9uJ3QgcHVuaXNoIHRoZVxuICAgICAgICAvLyB1c2VyIFx1MjAxNCBsZWF2ZSB0aGUgQ1RBIGVuYWJsZWQgYW5kIGxldCB0aGUgc3luYydzIG93biBzZXNzaW9uXG4gICAgICAgIC8vIGNoZWNrIHN1cmZhY2UgYSByZWFsIGVycm9yIGlmIG5lZWRlZC5cbiAgICAgICAgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgICAgIGlmIChlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24pIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgICAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbikgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gIH1cblxuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuXG4gIC8vIFN0YXJ0IHRoZSB3aXphcmQgQUZURVIgYWxsIGluaXRpYWwgc3RhdGUgaXMgbG9hZGVkIFx1MjAxNCB0aGlzIHBpY2tzXG4gIC8vIHRoZSBjb3JyZWN0IHN0YXJ0aW5nIHN0ZXAgKGUuZy4gcmV0dXJuaW5nIHVzZXIgd2l0aCB2YWxpZCBzZXNzaW9uXG4gIC8vIGxhbmRzIG9uIHN0ZXAgMyBkaXJlY3RseSkuXG4gIF9pbml0V2l6YXJkKCk7XG5cbiAgLy8gUmUtYXR0YWNoIHRvIGFueSBzeW5jIHRoYXQncyBjdXJyZW50bHkgcnVubmluZyBpbiB0aGUgc2VydmljZSB3b3JrZXIuXG4gIC8vIFRoaXMgaXMgd2hhdCBsZXRzIHRoZSB1c2VyIGNsb3NlICsgcmVvcGVuIHRoZSBwb3B1cCBtaWQtc3luYy5cbiAgYXdhaXQgcmVmcmVzaFN5bmNTdGF0dXNGcm9tQmFja2dyb3VuZCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZWZyZXNoU3luY1N0YXR1c0Zyb21CYWNrZ3JvdW5kKCkge1xuICBjb25zdCBzdGF0dXMgPSBhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiZ2V0U3luY1N0YXR1c1wiIH0pLmNhdGNoKCgpID0+IG51bGwpO1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBhcHBseVN5bmNTdGF0dXMoc3RhdHVzKTtcbn1cblxuLy8gTGF0ZXN0IHN0YXR1cyBzbmFwc2hvdCBcdTIwMTQga2VlcGluZyBpdCBsZXRzIHRoZSBsaXZlLWVsYXBzZWQgdGlja2VyXG4vLyByZXBhaW50IHRoZSBzYW1lIHByb2dyZXNzIHRleHQgd2l0aCBhbiB1cGRhdGVkIGBbTnNdYCBwcmVmaXggZXZlcnlcbi8vIHNlY29uZCB3aXRob3V0IHNwYW1taW5nIGNocm9tZS5zdG9yYWdlIGZyb20gdGhlIHNlcnZpY2Ugd29ya2VyLlxubGV0IF9sYXRlc3RTdGF0dXMgPSBudWxsO1xubGV0IF9lbGFwc2VkVGlja2VySWQgPSBudWxsO1xuXG5mdW5jdGlvbiBfZm10RWxhcHNlZChtcykge1xuICBpZiAobXMgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gMTAwMCl9c2A7XG4gIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gNjBfMDAwKX1tJHtNYXRoLnJvdW5kKChtcyAlIDYwXzAwMCkgLyAxMDAwKX1zYDtcbn1cblxuZnVuY3Rpb24gX3JlbmRlclN0YXR1cygpIHtcbiAgY29uc3Qgc3RhdHVzID0gX2xhdGVzdFN0YXR1cztcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgbGV0IHRleHQgPSBzdGF0dXMucHJvZ3Jlc3MgfHwgXCIoc3luYyBcdTkwMzJcdTg4NENcdTRFMkQpXCI7XG4gIGlmIChzdGF0dXMucnVubmluZyAmJiBzdGF0dXMuc3RhcnRlZCkge1xuICAgIGNvbnN0IGVsYXBzZWQgPSBEYXRlLm5vdygpIC0gc3RhdHVzLnN0YXJ0ZWQ7XG4gICAgdGV4dCA9IGBcdTIzRjEgJHtfZm10RWxhcHNlZChlbGFwc2VkKX0gXHUwMEI3ICR7dGV4dH1gO1xuICB9XG4gIGNvbnN0IGtpbmQgPSBzdGF0dXMucnVubmluZyA/IFwiaW5mb1wiIDogKHN0YXR1cy5waGFzZSA9PT0gXCJlcnJvclwiID8gXCJlcnJvclwiIDogXCJzdWNjZXNzXCIpO1xuICBjb25zdCBicmVha2Rvd24gPSBzdGF0dXMucnVubmluZyA/IG51bGwgOiBzdGF0dXMuYnJlYWtkb3duO1xuICBjb25zdCBlcnJvcnMgPSBzdGF0dXMucnVubmluZyA/IG51bGwgOiBzdGF0dXMuZXJyb3JzO1xuICBzZXRTdGF0dXModGV4dCwga2luZCwgYnJlYWtkb3duLCBlcnJvcnMpO1xufVxuXG5mdW5jdGlvbiBhcHBseVN5bmNTdGF0dXMoc3RhdHVzKSB7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIF9sYXRlc3RTdGF0dXMgPSBzdGF0dXM7XG4gIF9yZW5kZXJTdGF0dXMoKTtcbiAgLy8gU3RhdHVzIGJhbm5lciBsaXZlcyBpbnNpZGUgc3RlcCAzIFx1MjAxNCBmb3JjZS1qdW1wIHRoZXJlIHNvIGl0J3NcbiAgLy8gYWN0dWFsbHkgdmlzaWJsZS4gUnVubmluZyBzeW5jIE9SIGEgZnJlc2ggY29tcGxldGlvbiBib3RoIHdhcnJhbnRcbiAgLy8gYmVpbmcgb24gdGhlIHJlc3VsdCBzdGVwLlxuICBpZiAoX3dpemFyZEluaXRpYWxpemVkICYmIF9hY3RpdmVTdGVwICE9PSAzKSB7XG4gICAgX3NldEFjdGl2ZVN0ZXAoMywgeyBzaWxlbnQ6IHRydWUgfSk7XG4gIH1cbiAgaWYgKHN0YXR1cy5ydW5uaW5nKSB7XG4gICAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIGVscy5zeW5jQXBpQnRuLnRleHRDb250ZW50ID0gXCJcdTUzRDZcdTVGOTdcdTRFMkRcdTIwMjZcIjtcbiAgICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSBmYWxzZTtcbiAgICBpZiAoIV9lbGFwc2VkVGlja2VySWQpIHtcbiAgICAgIF9lbGFwc2VkVGlja2VySWQgPSBzZXRJbnRlcnZhbChfcmVuZGVyU3RhdHVzLCAxMDAwKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZWxzLnN0b3BCdG4uaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoX2VsYXBzZWRUaWNrZXJJZCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChfZWxhcHNlZFRpY2tlcklkKTtcbiAgICAgIF9lbGFwc2VkVGlja2VySWQgPSBudWxsO1xuICAgIH1cbiAgICAvLyBSZS1kZXJpdmUgc3luYyBidXR0b24gZW5hYmxlZCBzdGF0ZSBmcm9tIG1vZGUvY29ubi9OSEktdGFiIGluc3RlYWRcbiAgICAvLyBvZiB1bmNvbmRpdGlvbmFsbHkgZW5hYmxpbmcgXHUyMDE0IGtlZXBzIHRoZSBidXR0b24gZGlzYWJsZWQgd2hlbiB3ZVxuICAgIC8vIGtub3cgd2Ugc2hvdWxkbid0IHN5bmMgKGUuZy4gYmFja2VuZCBkb3duLCBvZmYtTkhJIHRhYikuXG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAvLyBTeW5jIGp1c3QgZmluaXNoZWQgXHUyMDE0IGJvdGggc2lkZXMgbWF5IGhhdmUgY2hhbmdlZCAoYmFja2VuZCBnb3RcbiAgICAvLyBuZXcgcmVzb3VyY2VzIGluIGJhY2tlbmQgbW9kZSwgbG9jYWwgYnVuZGxlIHdhcyBzdGFzaGVkIGluIGVpdGhlclxuICAgIC8vIG1vZGUpLiBSZWZyZXNoIGRhdGEtc3RhdGUgY2FyZCBzbyB0aGUgdXNlciBzZWVzIHVwLXRvLWRhdGUgY291bnRzLlxuICAgIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xuICAgIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBfY29ublN0YXRlID09PSBcIm9rXCIpIGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgfVxufVxuXG4vLyBTdG9wIHRoZSBpbi1wcm9ncmVzcyBzeW5jLiBUd28tcHJvbmdlZCBzbyBpdCB3b3JrcyBldmVuIHdoZW4gdGhlXG4vLyBzZXJ2aWNlIHdvcmtlciBoYXMgZGllZDogKDEpIHRlbGwgdGhlIFNXIHRvIHNldCBpdHMgY2FuY2VsIGZsYWcsXG4vLyAoMikgd3JpdGUgc3RvcmFnZSBkaXJlY3RseSB0byBydW5uaW5nOmZhbHNlIHNvIHRoZSBwb3B1cCBVSSB1bmZyZWV6ZXNcbi8vIGltbWVkaWF0ZWx5IGV2ZW4gaWYgdGhlIFNXIG1lc3NhZ2UgY2FuJ3QgYmUgZGVsaXZlcmVkLlxuYXN5bmMgZnVuY3Rpb24gc3RvcFN5bmMoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgc3luY1N0YXR1czoge1xuICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1MDVDXHU2QjYyXHU0RTJEXHVGRjBDXHU2QjYzXHU1NzI4XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5XHUyMDI2XCIsXG4gICAgICBwaGFzZTogXCJjYW5jZWxsZWRcIixcbiAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0pO1xuICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1MDVDXHU2QjYyXHU0RTJEXHVGRjBDXHU2QjYzXHU1NzI4XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcInN0b3BTeW5jXCIgfSkuY2F0Y2goKCkgPT4ge30pO1xuICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSB0cnVlO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xufVxuXG4vLyBMaXZlIHByb2dyZXNzIHVwZGF0ZXMgXHUyMDE0IGxpc3RlbiBvbiBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQgc28gd2UgZ2V0XG4vLyBldmVyeSB1cGRhdGUgdGhlIFNXIHdyaXRlcywgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoZSBTVydzIGJyb2FkY2FzdFxuLy8gc2VuZE1lc3NhZ2UgcmVhY2hlZCB1cy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIGNoYW5nZXMuc3luY1N0YXR1cykge1xuICAgIGFwcGx5U3luY1N0YXR1cyhjaGFuZ2VzLnN5bmNTdGF0dXMubmV3VmFsdWUpO1xuICB9XG59KTtcblxuLy8gKExlZ2FjeSBpbi1tZW1vcnkgYnJvYWRjYXN0IHN0aWxsIGxpc3RlbmVkIHRvIGFzIGEgYmFja3VwLilcbi8vIFJlamVjdCBtZXNzYWdlcyBmcm9tIGFueSAqb3RoZXIqIGV4dGVuc2lvbiBpbnN0YWxsZWQgaW4gdGhlIHVzZXInc1xuLy8gYnJvd3Nlci4gSW50ZXJuYWwgc2VuZHMgKGJhY2tncm91bmQgU1cgXHUyMTkyIHBvcHVwLCBwb3B1cCBcdTIxOTIgYmFja2dyb3VuZClcbi8vIGhhdmUgc2VuZGVyLmlkID09PSBjaHJvbWUucnVudGltZS5pZDsgYW4gdW5yZWxhdGVkIGV4dGVuc2lvbidzXG4vLyBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShteUV4dElkLCBcdTIwMjYpIHdvdWxkIGhhdmUgaXRzIG93biBpZCBhbmQgYmVcbi8vIGRyb3BwZWQgc2lsZW50bHkuIERlZmVuZHMgYWdhaW5zdCByb2d1ZSBleHRlbnNpb25zIHNwb29maW5nIHN5bmNcbi8vIHByb2dyZXNzIGFuZCB0cmlja2luZyB0aGUgcG9wdXAgVUkuIChTZWN1cml0eSBhdWRpdCAjNi4pXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZywgc2VuZGVyKSA9PiB7XG4gIGlmIChzZW5kZXI/LmlkICYmIHNlbmRlci5pZCAhPT0gY2hyb21lLnJ1bnRpbWUuaWQpIHJldHVybjtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzeW5jUHJvZ3Jlc3NcIikge1xuICAgIGFwcGx5U3luY1N0YXR1cyhtc2cuc3RhdHVzKTtcbiAgfVxufSk7XG5cbi8vIFByZS1mbGlnaHQgZGV0ZWN0aW9uIGZvciBOSEkgbG9naW4gc3RhdGUuIFR3byBzaWduYWxzIChlaXRoZXIgdHJpZ2dlcnMpOlxuLy8gIDEuIFVSTCBpcyBpbiBOSEkgYXV0aCBuYW1lc3BhY2UgKElIS0UzMDk5U3h4KSBcdTIwMTQgbG9naW4gLyBJQyBjYXJkIHBhZ2VzXG4vLyAgMi4gUGFnZSBjb250YWlucyBhIHBhc3N3b3JkIGlucHV0IG9yIGtub3duIGxvZ2dlZC1vdXQgcGhyYXNlc1xuYXN5bmMgZnVuY3Rpb24gaXNPbk5oaUxvZ2luUGFnZSh0YWJJZCwgdXJsKSB7XG4gIGlmICh1cmw/LnBhdGhuYW1lICYmIC9JSEtFMzA5OS8udGVzdCh1cmwucGF0aG5hbWUpKSByZXR1cm4gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiAoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIGNvbnN0IHRleHQgPSAoZG9jdW1lbnQuYm9keT8uaW5uZXJUZXh0IHx8IFwiXCIpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgcGhyYXNlcyA9IFtcbiAgICAgICAgICBcIlx1OEFDQlx1NEY3Rlx1NzUyOFx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NjBBOFx1NzY4NFx1NTA2NVx1NEZERFx1NTM2MVwiLFxuICAgICAgICAgIFwiXHU3NjdCXHU1MTY1XHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBXCIsIFwiXHU3NjdCXHU1MTY1XHU1OTMxXHU2NTU3XCIsIFwiXHU4QUNCXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XCIsXG4gICAgICAgICAgXCJTZXNzaW9uIFx1NURGMlx1OTAzRVx1NjY0MlwiLCBcInNlc3Npb24gXHU1REYyXHU5MDNFXHU2NjQyXCIsIFwiXHU1REYyXHU5MDNFXHU2NjQyXCIsXG4gICAgICAgICAgXCJcdThBQ0JcdTRFRTVcdTUwNjVcdTRGRERcdTUzNjFcdTc2N0JcdTUxNjVcIixcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIHBocmFzZXMuc29tZSgocCkgPT4gdGV4dC5pbmNsdWRlcyhwKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1MjZBMSBOSEkgQVBJLWRpcmVjdCBzeW5jIFx1MjAxNCBwcmltYXJ5IHBhdGguIEhpdHMgTkhJJ3MgdW5kZXJseWluZyBKU09OXG4vLyBlbmRwb2ludHMgaW4gcGFyYWxsZWwgYW5kIHBvc3RzIGFkYXB0ZWQgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQuXG4vLyBSZXF1aXJlcyBwYXRpZW50X292ZXJyaWRlIHRvIGJlIGZpbGxlZC5cbi8vIENvbnZlcnQgYSBiYWNrZW5kIFVSTCBcdTIxOTIgdGhlIG9yaWdpbi1wYXR0ZXJuIENocm9tZSB3YW50cyBmb3IgcGVybWlzc2lvblxuLy8gcmVxdWVzdHMuIFwiaHR0cDovLzE5Mi4xNjguMS41OjgwMTBcIiBcdTIxOTIgXCJodHRwOi8vMTkyLjE2OC4xLjU6ODAxMC8qXCIuXG4vLyBSZXR1cm5zIG51bGwgd2hlbiB0aGUgVVJMIGlzbid0IHBhcnNlYWJsZSBzbyB0aGUgY2FsbGVyIGNhbiBzaG9ydC1jaXJjdWl0LlxuZnVuY3Rpb24gX29yaWdpblBhdHRlcm5Gb3IodXJsKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IG5ldyBVUkwodXJsKTtcbiAgICByZXR1cm4gYCR7dS5wcm90b2NvbH0vLyR7dS5ob3N0fS8qYDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gQmFja2VuZC1tb2RlIHByZS1mbGlnaHQ6IGVuc3VyZSB0aGUgZXh0ZW5zaW9uIGhhcyBob3N0IHBlcm1pc3Npb24gZm9yXG4vLyB0aGUgdXNlci1jb25maWd1cmVkIGJhY2tlbmQgVVJMLiBMb2NhbGhvc3QgLyAxMjcuMC4wLjEgYXJlIGNvdmVyZWQgYnlcbi8vIHRoZSBkZWZhdWx0IG1hbmlmZXN0IGhvc3RfcGVybWlzc2lvbnM7IHJlbW90ZSAvIExBTiAvIHByb2R1Y3Rpb24gVVJMc1xuLy8gbmVlZCBhIG9uZS10aW1lIHVzZXIgZ3JhbnQuIE11c3QgcnVuIGZyb20gYSB1c2VyIGdlc3R1cmUgKGJ1dHRvbiBjbGljaykuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVCYWNrZW5kUGVybWlzc2lvbihiYWNrZW5kVXJsKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBfb3JpZ2luUGF0dGVybkZvcihiYWNrZW5kVXJsKTtcbiAgaWYgKCFwYXR0ZXJuKSByZXR1cm4geyBvazogZmFsc2UsIHJlYXNvbjogYEJhY2tlbmQgVVJMIFx1NzEyMVx1NkNENVx1ODlFM1x1Njc5MDogJHtiYWNrZW5kVXJsfWAgfTtcbiAgY29uc3QgYWxyZWFkeSA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5jb250YWlucyh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgaWYgKGFscmVhZHkpIHJldHVybiB7IG9rOiB0cnVlIH07XG4gIGxldCBncmFudGVkO1xuICB0cnkge1xuICAgIGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgXHU2QjBBXHU5NjUwXHU4QUNCXHU2QzQyXHU1OTMxXHU2NTU3OiAke2UubWVzc2FnZX1gIH07XG4gIH1cbiAgcmV0dXJuIGdyYW50ZWRcbiAgICA/IHsgb2s6IHRydWUgfVxuICAgIDogeyBvazogZmFsc2UsIHJlYXNvbjogYFx1NjcyQVx1NjM4OFx1NkIwQVx1OTAyM1x1N0REQVx1NTIzMCAke3BhdHRlcm59IFx1MjAxNCBcdTUzRDZcdTZEODhgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFwaVN5bmNOaGkoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3YpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU4QUNCXHU1NkRFXHU1MjMwXHUzMDBDXHUyNDYxIFx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVx1MzAwRFx1RkYwQ1x1NTg2Qlx1NTk3RFx1NjAyN1x1NTIyNVx1MzAwMVx1NzUxRlx1NjVFNVx1NUY4Q1x1NjMwOVx1MzAwQ1x1NTEzMlx1NUI1OFx1MzAwRFwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFByZS1mbGlnaHQ6IGNoZWNrIHdlJ3JlIG9uIGFuIE5ISSB0YWIgc28gY29va2llcyBhcmUgdXNhYmxlIGZyb20gU1cuXG4gIGNvbnN0IHRhYiA9IGF3YWl0IGdldEFjdGl2ZVRhYigpO1xuICBsZXQgdXJsO1xuICB0cnkgeyB1cmwgPSBuZXcgVVJMKHRhYi51cmwpOyB9IGNhdGNoIHsgc2V0U3RhdHVzKFwiYWN0aXZlIHRhYiBoYXMgbm8gVVJMXCIsIFwiZXJyb3JcIik7IHJldHVybjsgfVxuICBjb25zdCBvbkxvZ2luID0gYXdhaXQgaXNPbk5oaUxvZ2luUGFnZSh0YWIuaWQsIHVybCk7XG4gIGlmIChvbkxvZ2luKSB7XG4gICAgc2V0U3RhdHVzKFwiXHVEODNEXHVERDEyIFx1OTA4NFx1NkM5Mlx1NzY3Qlx1NTE2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBcdTIwMTQgXHU4QUNCXHU1NkRFXHU1MjMwXHUzMDBDXHUyNDYwIFx1NzY3Qlx1NTE2NVx1MzAwRFwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJhY2tlbmQgbW9kZTogcmUtdmVyaWZ5IGNvbm5lY3Rpdml0eSByaWdodCBoZXJlIGV2ZW4gaWYgdGhlIGJhbm5lclxuICAvLyBsYXN0IHNhaWQgb2suIEJldHdlZW4gdGhlIHByZXZpb3VzIGNoZWNrIGFuZCB0aGlzIGNsaWNrIHRoZSB1c2VyXG4gIC8vIG1heSBoYXZlIHN0b3BwZWQgZG9ja2VyOyB3aXRob3V0IGEgZnJlc2ggcHJvYmUgd2UnZCBzdGFydCBhbiB1cGxvYWRcbiAgLy8gdGhhdCBmYWlscyBtaWQtZmxpZ2h0IGFmdGVyIHBhcnRpYWwgZGF0YSBoYXMgaGl0IChvciBmYWlsZWQgdG8gaGl0KVxuICAvLyB0aGUgYmFja2VuZC4gQ2hlYXAgKFx1MjI2NDVzKSBhbmQgc2F2ZXMgYSBsb3Qgb2YgY29uZnVzaW9uLlxuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICBjb25zdCBvayA9IGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICAgIGlmICghb2spIHtcbiAgICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTkwMjNcdTRFMERcdTRFMEFcdTY3MkNcdTZBNUZcdTRGM0FcdTY3MERcdTU2NjggXHUyMDE0IFx1OEFDQlx1NzcwQlx1NEUwQVx1NjVCOVx1NjNEMFx1NzkzQVx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgIHJ1bm5pbmc6IHRydWUsXG4gICAgICBwcm9ncmVzczogXCJcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIixcbiAgICAgIHBoYXNlOiBcInN0YXJ0aW5nXCIsIHN0YXJ0ZWQ6IERhdGUubm93KCksIHRzOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0pO1xuICBzZXRTdGF0dXMoXCJcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIiwgXCJpbmZvXCIpO1xuXG4gIC8vIENvbXB1dGUgZGF0ZSByYW5nZSBmcm9tIHRoZSBkcm9wZG93bi4gXCIxXCIgPSBOSEkncyBkZWZhdWx0IHdpbmRvdztcbiAgLy8gYW55dGhpbmcgZWxzZSBpcyBcInRvZGF5IGJhY2sgTiB5ZWFyc1wiLiBIZWxwZXIgaW5zaWRlIGJhY2tncm91bmQuanNcbiAgLy8gY29udmVydHMgdG8gXHU2QzExXHU1NzBCIGZvciBOSEkncyBBUEkuXG4gIGNvbnN0IHJhbmdlU2VsID0gZWxzLmFwaVN5bmNSYW5nZT8udmFsdWUgfHwgXCIzXCI7XG4gIGxldCBkYXRlUmFuZ2UgPSBudWxsO1xuICBjb25zdCBSQU5HRV9MQUJFTFMgPSB7XG4gICAgXCIxXCI6ICAgXCJcdTY3MDBcdThGRDEgMSBcdTVFNzRcIixcbiAgICBcIjNcIjogICBcIlx1NjcwMFx1OEZEMSAzIFx1NUU3NFwiLFxuICAgIFwiNVwiOiAgIFwiXHU2NzAwXHU4RkQxIDUgXHU1RTc0XCIsXG4gICAgXCIxMFwiOiAgXCJcdTY3MDBcdThGRDEgMTAgXHU1RTc0XCIsXG4gICAgXCJhbGxcIjogXCJcdTUxNjhcdTkwRThcdTZCNzdcdTUzRjJcdTdEMDBcdTkzMDRcIixcbiAgfTtcbiAgY29uc3QgZGF0ZVJhbmdlTGFiZWwgPSBSQU5HRV9MQUJFTFNbcmFuZ2VTZWxdIHx8IGBcdTY3MDBcdThGRDEgJHtyYW5nZVNlbH0gXHU1RTc0YDtcbiAgaWYgKHJhbmdlU2VsICE9PSBcIjFcIikge1xuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBlbmQgPSB0b2RheS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKTtcbiAgICBsZXQgc3RhcnQ7XG4gICAgaWYgKHJhbmdlU2VsID09PSBcImFsbFwiKSB7XG4gICAgICBzdGFydCA9IFwiMjAwMS0wMS0wMVwiOyAgLy8gXHU2QzExXHU1NzBCIDkwIFx1MjAxNCBmYXIgZW5vdWdoIGJhY2sgZm9yIGFueSBjbGluaWNhbCBjYXNlXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHllYXJzID0gcGFyc2VJbnQocmFuZ2VTZWwsIDEwKTtcbiAgICAgIGNvbnN0IHMgPSBuZXcgRGF0ZSh0b2RheSk7XG4gICAgICBzLnNldEZ1bGxZZWFyKHMuZ2V0RnVsbFllYXIoKSAtIHllYXJzKTtcbiAgICAgIHN0YXJ0ID0gcy50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKTtcbiAgICB9XG4gICAgZGF0ZVJhbmdlID0geyBzdGFydCwgZW5kIH07XG4gIH1cblxuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgdHlwZTogXCJzdGFydE5oaUFwaVN5bmNcIixcbiAgICBwYXlsb2FkOiB7XG4gICAgICB0YWJJZDogdGFiLmlkLFxuICAgICAgbW9kZTogY3VycmVudE1vZGUoKSxcbiAgICAgIGJhY2tlbmQ6IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKSxcbiAgICAgIHN5bmNBcGlLZXk6IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKSxcbiAgICAgIG5oaUJhc2U6IFwiaHR0cHM6Ly9teWhlYWx0aGJhbmsubmhpLmdvdi50d1wiLFxuICAgICAgcGF0aWVudE92ZXJyaWRlOiBvdixcbiAgICAgIGRhdGVSYW5nZSxcbiAgICAgIGRhdGVSYW5nZUxhYmVsLFxuICAgIH0sXG4gIH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbGF1bmNoKCkge1xuICBjb25zdCBiYWNrZW5kID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpO1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCByYXdJZCA9IG92Py5pZF9ubztcbiAgY29uc3Qgc21hcnRBcHBMYXVuY2ggPSBlbHMuc21hcnRBcHBVcmwudmFsdWUudHJpbSgpIHx8IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSDtcbiAgaWYgKCFyYXdJZCkge1xuICAgIHNldFN0YXR1cyhcIlx1OTA4NFx1NkM5Mlx1NjcwOVx1OEVBQlx1NTIwNlx1OENDN1x1NjU5OSBcdTIwMTQgXHU4QUNCXHU1MTQ4XHU2MzA5XHUzMDBDXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUzMDBEXHU0RTAwXHU2QjIxXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIEJhY2tlbmQgdHJhY2tzIFBhdGllbnQgdW5kZXIgaXRzIGhhc2hlZCBGSElSIGlkLCBub3QgdGhlIHJhdyBuYXRpb25hbCBJRC5cbiAgY29uc3QgcGF0aWVudElkID0gZGVyaXZlUGF0aWVudElkKHJhd0lkKTtcbiAgLy8gUmUtdGVzdCBjb25uZWN0aW9uIGV2ZW4gaWYgYmFubmVyIHNob3dzIG9rIFx1MjAxNCBiYWNrZW5kIG1heSBoYXZlIGdvbmVcbiAgLy8gZG93biBzaW5jZSB0aGUgbGFzdCBwcm9iZS5cbiAgY29uc3Qgb2sgPSBhd2FpdCB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgaWYgKCFvaykge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTkwMjNcdTRFMERcdTRFMEFcdTY3MkNcdTZBNUZcdTRGM0FcdTY3MERcdTU2NjggXHUyMDE0IFx1OEFDQlx1NzcwQlx1NEUwQVx1NjVCOVx1NjNEMFx1NzkzQVx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZXRTdGF0dXMoXCJcdTZFOTZcdTUwOTlcdTk1OEJcdTU1NUZcdTkxQUJcdTY3OTBcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3NtYXJ0L2xhdW5jaC1jb250ZXh0YCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGF0aWVudF9pZDogcGF0aWVudElkIH0pLFxuICAgIH0pO1xuICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYCR7cmVzLnN0YXR1c306ICR7YXdhaXQgcmVzLnRleHQoKX1gKTtcbiAgICBjb25zdCB7IGxhdW5jaCB9ID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHsgaXNzOiBgJHtiYWNrZW5kfS9maGlyYCwgbGF1bmNoIH0pO1xuICAgIC8vIEFwcGVuZCBpc3MgKyBsYXVuY2ggcGFyYW1zLCByZXNwZWN0aW5nIGFueSBleGlzdGluZyBxdWVyeSBzdHJpbmcuXG4gICAgY29uc3Qgc2VwID0gc21hcnRBcHBMYXVuY2guaW5jbHVkZXMoXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGAke3NtYXJ0QXBwTGF1bmNofSR7c2VwfSR7cGFyYW1zfWAgfSk7XG4gICAgd2luZG93LmNsb3NlKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1Mjc0QyBcdTk1OEJcdTU1NUZcdTkxQUJcdTY3OTBcdTU5MzFcdTY1NTdcdUZGMUEke2UubWVzc2FnZX1gLCBcImVycm9yXCIpO1xuICB9XG59XG5cbmVscy5zeW5jQXBpQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhcGlTeW5jTmhpKTtcbmVscy5zdG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdG9wU3luYyk7XG5lbHMub3ZTYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzYXZlUGF0aWVudE92ZXJyaWRlKTtcbmVscy5vdkNsZWFyQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhclBhdGllbnRPdmVycmlkZSk7XG5bZWxzLm92TmFtZSwgZWxzLm92QmlydGhEYXRlLCBlbHMub3ZHZW5kZXJdLmZvckVhY2goKGVsKSA9PlxuICBlbC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSlcbik7XG5lbHMubGF1bmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsYXVuY2gpO1xuXG4vLyBTdGVwIDQ6IHBsYWluIG5ldy10YWIgb3BlbiBvZiB0aGUgU01BUlQgQXBwLiBVUkwgaXMgaGFyZGNvZGVkXG4vLyAoU1RBTkRBTE9ORV9TTUFSVF9BUFBfVVJMKTsgbm8gRkhJUiBkYXRhIGlzIHBhc3NlZCB2aWEgVVJMIFx1MjAxNCB0aGVcbi8vIHVzZXIgbWFudWFsbHkgZHJvcHMgdGhlIGRvd25sb2FkZWQgSlNPTiBvbnRvIHRoZSBTTUFSVCBBcHAgcGFnZS5cbi8vIERlY291cGxpbmcgZXh0ZW5zaW9uIDwtPiBTTUFSVCBBcHAga2VlcHMgYm90aCBzaWRlcyBzaW1wbGUsIGxlYWtzXG4vLyB6ZXJvIFBISSB0aHJvdWdoIHF1ZXJ5IHN0cmluZ3Mgb3IgaGFzaCBmcmFnbWVudHMsIGFuZCBsZXRzIHRoZVxuLy8gZXh0ZW5zaW9uIHN1cnZpdmUgYW55IFNNQVJUIEFwcCBwcm90b2NvbCBjaGFuZ2UuXG5lbHMub3BlblNtYXJ0QXBwQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IFNUQU5EQUxPTkVfU01BUlRfQVBQX1VSTCB9KTtcbiAgLy8gRG9uJ3QgYXV0by1jbG9zZSB0aGUgcG9wdXAgXHUyMDE0IHVzZXIgbWF5IHdhbnQgdG8gcmUtZG93bmxvYWQgb3JcbiAgLy8gcmUtbGF1bmNoIChlLmcuIGRyYWcgZmFpbGVkIGZpcnN0IHRpbWUpLlxufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBTZXR0aW5ncyB2aWV3IHRvZ2dsZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBHZWFyIGljb24gaW4gdGhlIGhlYWRlciBvcGVucyBhIGRlZGljYXRlZCBzZXR0aW5ncyB2aWV3IHRoYXRcbi8vIHJlcGxhY2VzIHRoZSB3aXphcmQuIFJldHVybmluZyBpcyB2aWEgdGhlIFwiXHUyMTkwIFx1OEZENFx1NTZERVwiIGJ1dHRvbiBhdCB0aGVcbi8vIHRvcCBvZiB0aGF0IHZpZXcuIFRoZSBDU1MgaXMgZHJpdmVuIGJ5IGJvZHlbZGF0YS12aWV3PVwic2V0dGluZ3NcIl1cbi8vIFx1MjAxNCB0b2dnbGluZyB0aGF0IGF0dHJpYnV0ZSBpcyBhbGwgdGhlIEpTIGRvZXMuXG4vL1xuLy8gV2UgZGVsaWJlcmF0ZWx5IGRvIE5PVCBhdXRvLWp1bXAgYmFjayB0byB0aGUgd2l6YXJkIGFmdGVyIGEgZmllbGRcbi8vIGNoYW5nZTogdXNlcnMgZWRpdGluZyB0aGUgYmFja2VuZCBVUkwgbWF5IG5lZWQgdG8gdmVyaWZ5IGNoYW5nZXNcbi8vIGFjcm9zcyBtdWx0aXBsZSBmaWVsZHMgYmVmb3JlIGNsb3NpbmcuXG5mdW5jdGlvbiBfb3BlblNldHRpbmdzVmlldygpIHtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnZpZXcgPSBcInNldHRpbmdzXCI7XG4gIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6IFwiaW5zdGFudFwiIH0pO1xufVxuZnVuY3Rpb24gX2Nsb3NlU2V0dGluZ3NWaWV3KCkge1xuICBkZWxldGUgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnZpZXc7XG4gIC8vIFBvcCBiYWNrIHRvIHdoaWNoZXZlciB3aXphcmQgc3RlcCBpcyBjdXJyZW50IFx1MjAxNCByZWZyZXNoIHZpc3VhbFxuICAvLyBzdGF0ZSBzbyB0aGUgdXNlciBsYW5kcyBvbiB0aGUgc2FtZSBzdGVwIHRoZXkgY2FtZSBmcm9tLlxuICBfcmVmcmVzaFdpemFyZFVpKCk7XG4gIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6IFwiaW5zdGFudFwiIH0pO1xufVxuZWxzLm9wZW5TZXR0aW5nc0J0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9vcGVuU2V0dGluZ3NWaWV3KTtcbmVscy5zZXR0aW5nc0JhY2tCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfY2xvc2VTZXR0aW5nc1ZpZXcpO1xuXG4vLyBcIlx1NTNENlx1NUY5N1x1NUMwRFx1OEM2MVwiIGJhbm5lcjogY2xpY2sgLyBFbnRlciAvIFNwYWNlIGp1bXBzIGJhY2sgdG8gc3RlcCAyIGFuZFxuLy8gZXhwYW5kcyB0aGUgcGF0aWVudCBjYXJkIHNvIHRoZSB1c2VyIGNhbiBhZGp1c3QgdGhlIGlkZW50aXR5LlxuZnVuY3Rpb24gX2dvdG9TdGVwMkVkaXQoKSB7XG4gIF9zZXRBY3RpdmVTdGVwKDIpO1xufVxuZWxzLmFjdGl2ZVBhdGllbnQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfZ290b1N0ZXAyRWRpdCk7XG5lbHMuYWN0aXZlUGF0aWVudD8uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiIFwiKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF9nb3RvU3RlcDJFZGl0KCk7XG4gIH1cbn0pO1xuXG5pbml0KCk7XG4iXSwKICAibWFwcGluZ3Mi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QU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFP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
