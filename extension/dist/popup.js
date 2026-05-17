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
    openNhiBtn: document.getElementById("open-nhi-btn")
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
    if (!ov.gender) {
      setStatus("\u26D4 \u8ACB\u9078\u64C7\u6027\u5225", "error");
      els.ovGender.focus();
      return;
    }
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
  function _refreshButtonStates() {
    const onNhi = !els.syncApiBtn.dataset.offNhi;
    const modeOk = currentMode() === "local" || _connState === "ok";
    const genderOk = !!els.ovGender?.value;
    let reason = "";
    if (!onNhi) reason = "\u8ACB\u5148\u5207\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801";
    else if (!modeOk) reason = "\u5F8C\u7AEF\u5C1A\u672A\u9023\u7DDA\uFF08\u770B\u4E0A\u65B9\u7D05\u8272\u63D0\u793A\uFF09";
    else if (!genderOk) reason = "\u8ACB\u5148\u5728\u4E0A\u65B9\u586B\u300C\u6027\u5225\u300D\u4E26\u6309\u78BA\u5B9A";
    els.syncApiBtn.disabled = reason !== "";
    els.syncApiBtn.title = reason;
    if (els.syncBlockedReason) {
      els.syncBlockedReason.textContent = reason ? `\u26A0\uFE0F ${reason}` : "";
      els.syncBlockedReason.hidden = reason === "";
    }
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
      setStatus("\u{1F512} \u5C1A\u672A\u767B\u5165\u5065\u4FDD\u5B58\u647A \u2014 \u8ACB\u5148\u767B\u5165\u5F8C\u518D\u8A66", "error");
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
      setStatus("\u6C92\u6709\u75C5\u4EBA\u8EAB\u5206\u8B49\u5B57\u865F\u53EF\u4EE5 launch \u2014 \u8ACB\u5148\u586B\u5BEB\u75C5\u4EBA\u8CC7\u6599", "error");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIwNzQwODY2YCBcdTIxOTIgYFAxMjA3NCoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpKSB7XG4gICAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICAgIHJldHVybiBsb2luYztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKExPSU5DX01BUCkpIHtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrZXkudG9Mb3dlckNhc2UoKSl9YCkudGVzdChjb21iaW5lZCkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tYmluZWQuaW5jbHVkZXMoa2V5LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICByZXR1cm4gbG9pbmM7XG4gICAgfVxuICB9XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQsIG1hc2tJZCwgbWFza05hbWUgfSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgREVGQVVMVF9CQUNLRU5EID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMTBcIjtcbi8vIERlZmF1bHQgU01BUlQgYXBwIGZvciBhIGZyZXNoIGluc3RhbGwuIFVzZXJzIGNhbiBvdmVycmlkZSB2aWFcbi8vIHRoZSAnXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgU01BUlQgQXBwIExhdW5jaCBVUkwnIGZpZWxkOyB0aGUgdmFsdWUgaXNcbi8vIHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlciBgc21hcnRBcHBMYXVuY2hVcmxgLlxuY29uc3QgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpci9zbWFydC9sYXVuY2hcIjtcblxuLy8gVHJ1ZSBpZiB0aGUgYWN0aXZlIHRhYiBpcyBhbiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHBhZ2UgKHJlYWwgc2l0ZSkuXG5mdW5jdGlvbiBpc05oaVRhYih1cmwpIHtcbiAgaWYgKCF1cmwpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IG5ldyBVUkwodXJsKSA6IHVybDtcbiAgICByZXR1cm4gL215aGVhbHRoYmFua1xcLm5oaVxcLmdvdlxcLnR3Ly50ZXN0KHUuaG9zdG5hbWUpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgREVGQVVMVF9NT0RFID0gXCJsb2NhbFwiO1xuXG5jb25zdCBlbHMgPSB7XG4gIG1vZGVSYWRpb3M6ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzeW5jLW1vZGVcIl0nKSxcbiAgYmFja2VuZFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXVybFwiKSxcbiAgc3luY0FwaUtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWFwaS1rZXlcIiksXG4gIHNtYXJ0QXBwVXJsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNtYXJ0LWFwcC11cmxcIiksXG4gIHN5bmNBcGlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGktYnRuXCIpLFxuICBzeW5jQmxvY2tlZFJlYXNvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWJsb2NrZWQtcmVhc29uXCIpLFxuICBhcGlTeW5jUmFuZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBpLXN5bmMtcmFuZ2VcIiksXG4gIHN0b3BCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIiksXG4gIG92SWRObzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1pZC1ub1wiKSxcbiAgb3ZOYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LW5hbWVcIiksXG4gIG92QmlydGhEYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWJpcnRoLWRhdGVcIiksXG4gIG92R2VuZGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWdlbmRlclwiKSxcbiAgb3ZTYXZlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LXNhdmUtYnRuXCIpLFxuICBvdkNsZWFyQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWNsZWFyLWJ0blwiKSxcbiAgb3ZTdW1tYXJ5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJyaWRlLXN1bW1hcnlcIiksXG4gIHBhdGllbnRPdmVycmlkZURldGFpbHM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF0aWVudC1vdmVycmlkZVwiKSxcbiAgbGF1bmNoQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdW5jaC1idG5cIiksXG4gIHN0YXR1czogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGF0dXNcIiksXG4gIGRhc2hib2FyZExpbms6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFzaGJvYXJkLWxpbmtcIiksXG4gIHBlbmRpbmdCdW5kbGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGVuZGluZy1idW5kbGVcIiksXG4gIGRvd25sb2FkQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvd25sb2FkLWJ1bmRsZS1idG5cIiksXG4gIGNsZWFyQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyLWJ1bmRsZS1idG5cIiksXG4gIGJ1bmRsZU1ldGE6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVuZGxlLW1ldGFcIiksXG4gIGNvbm5CYW5uZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1iYW5uZXJcIiksXG4gIGNvbm5TZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tc2VjdGlvblwiKSxcbiAgY29ubk1pbmk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1taW5pXCIpLFxuICBjb25uTXNnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tbXNnXCIpLFxuICBjb25uUmV0cnlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1yZXRyeS1idG5cIiksXG4gIGNvbm5IZWxwOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4taGVscFwiKSxcbiAgZGF0YVN0YXRlU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRhLXN0YXRlLXNlY3Rpb25cIiksXG4gIGJhY2tlbmRTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXN0YXRlXCIpLFxuICBsb2NhbFN0YXRlUm93OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvY2FsLXN0YXRlLXJvd1wiKSxcbiAgbG9jYWxTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2NhbC1zdGF0ZVwiKSxcbiAgcHVzaExvY2FsQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB1c2gtbG9jYWwtYnRuXCIpLFxuICBzeW5jU3RhdHVzSGludDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLXN0YXR1cy1oaW50XCIpLFxuICBzaWRlYmFyRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLWVuYWJsZWRcIiksXG4gIG1hc2tOYW1lRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXNrLW5hbWUtZW5hYmxlZFwiKSxcbiAgb3Blbk5oaVNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1uaGktc2VjdGlvblwiKSxcbiAgb3Blbk5oaUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW5oaS1idG5cIiksXG59O1xuXG5jb25zdCBOSElfTEFORElORyA9IFwiaHR0cHM6Ly9teWhlYWx0aGJhbmsubmhpLmdvdi50dy9JSEtFMzAwMFwiO1xuXG5jb25zdCBQRU5ESU5HX0JVTkRMRV9LRVkgPSBcInBlbmRpbmdGaGlyQnVuZGxlXCI7XG5cbi8vIFBlcnNpc3RlZC1zdGF0ZSBrZXlzLiBCYWNrZW5kIFVSTCBhbmQgQVBJIGtleSBwZXJzaXN0IGFjcm9zcyBicm93c2VyIHNlc3Npb25zLlxuYXN5bmMgZnVuY3Rpb24gbG9hZEJhY2tlbmRVcmwoKSB7XG4gIGNvbnN0IHsgYmFja2VuZFVybCwgc3luY0FwaUtleSwgc21hcnRBcHBMYXVuY2hVcmwgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcbiAgICBbXCJiYWNrZW5kVXJsXCIsIFwic3luY0FwaUtleVwiLCBcInNtYXJ0QXBwTGF1bmNoVXJsXCJdXG4gICk7XG4gIGVscy5iYWNrZW5kVXJsLnZhbHVlID0gYmFja2VuZFVybCB8fCBERUZBVUxUX0JBQ0tFTkQ7XG4gIGVscy5zeW5jQXBpS2V5LnZhbHVlID0gc3luY0FwaUtleSB8fCBcIlwiO1xuICBlbHMuc21hcnRBcHBVcmwudmFsdWUgPSBzbWFydEFwcExhdW5jaFVybCB8fCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIGVscy5kYXNoYm9hcmRMaW5rLmhyZWYgPSBlbHMuYmFja2VuZFVybC52YWx1ZS5yZXBsYWNlKC86ODAxMC4qJC8sIFwiOjMwMTBcIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYXRpZW50IG92ZXJyaWRlIChtYW51YWwgTkhJIGlkZW50aXR5KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZG9lc24ndCBleHBvc2UgdGhlIHVzZXIncyBuYXRpb25hbCBJRCBpbiB0aGUgVVJMLiBUaGUgdXNlclxuLy8gZmlsbHMgdGhlc2Ugb25jZSBhbmQgdGhleSdyZSBzZW50IHdpdGggZXZlcnkgdXBsb2FkIGNhbGwgdW50aWwgY2xlYXJlZC5cblxuYXN5bmMgZnVuY3Rpb24gbG9hZFBhdGllbnRPdmVycmlkZSgpIHtcbiAgY29uc3QgeyBwYXRpZW50T3ZlcnJpZGUgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInBhdGllbnRPdmVycmlkZVwiKTtcbiAgaWYgKHBhdGllbnRPdmVycmlkZSkge1xuICAgIGVscy5vdklkTm8udmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIjtcbiAgICBlbHMub3ZOYW1lLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIjtcbiAgICBlbHMub3ZCaXJ0aERhdGUudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuYmlydGhfZGF0ZSB8fCBcIlwiO1xuICAgIGVscy5vdkdlbmRlci52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5nZW5kZXIgfHwgXCJcIjtcbiAgfVxuICAvLyBGaXJzdC10aW1lIFVYOiBpZiBubyBpZF9ubyBpcyBzdG9yZWQsIGF1dG8tZXhwYW5kIHRoZSBwYXRpZW50LWRhdGFcbiAgLy8gZGV0YWlscyBzbyB0aGUgdXNlciBpbW1lZGlhdGVseSBzZWVzIHRoZSByZXF1aXJlZCBmaWVsZHMuIE9uY2VcbiAgLy8gdGhleSd2ZSBzYXZlZCBhIHZhbHVlLCBkZWZhdWx0IHRvIGNvbGxhcHNlZC5cbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSB7XG4gICAgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9ICFwYXRpZW50T3ZlcnJpZGU/LmlkX25vO1xuICB9XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aWVudE92ZXJyaWRlKCkge1xuICAvLyBSZXR1cm5zIHtpZF9ubywgbmFtZSwgYmlydGhfZGF0ZSwgZ2VuZGVyfS5cbiAgLy8gaWRfbm8gaXMgb3B0aW9uYWwgaW4gdGhlIFVJOyBpZiBibGFuayB0aGUgcG9wdXAgYXV0by1nZW5lcmF0ZXMgYW5cbiAgLy8gXCJhdXRvLVhYWFhYWFhYXCIgaWRlbnRpZmllciBhdCBzYXZlIHRpbWUuIFJldHVybnMgbnVsbCB3aGVuIGJvdGhcbiAgLy8gaWRfbm8gYW5kIG5hbWUgYXJlIGVtcHR5IChub3RoaW5nIGlkZW50aWZ5aW5nIHRvIHNhdmUpLlxuICBjb25zdCBpZF9ubyA9IGVscy5vdklkTm8udmFsdWUudHJpbSgpO1xuICBjb25zdCBuYW1lID0gZWxzLm92TmFtZS52YWx1ZS50cmltKCk7XG4gIGlmICghaWRfbm8gJiYgIW5hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBvdXQgPSBpZF9ubyA/IHsgaWRfbm8gfSA6IHt9O1xuICBpZiAobmFtZSkgb3V0Lm5hbWUgPSBuYW1lO1xuICBjb25zdCBiaXJ0aF9kYXRlID0gZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgZ2VuZGVyID0gZWxzLm92R2VuZGVyLnZhbHVlO1xuICBpZiAoYmlydGhfZGF0ZSkgb3V0LmJpcnRoX2RhdGUgPSBiaXJ0aF9kYXRlO1xuICBpZiAoZ2VuZGVyKSBvdXQuZ2VuZGVyID0gZ2VuZGVyO1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyBSYW5kb20gXCJhdXRvLVhYWFhYWFhYXCIgXHUyMDE0IDggaGV4IGNoYXJzIGZyb20gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyBzb1xuLy8gZXZlcnkgZnJlc2ggcG9wdXAgaW5zdGFsbCBnZXRzIGEgZGlmZmVyZW50IElEIGFuZCByZS1zeW5jcyBhcmUgc3RhYmxlLlxuZnVuY3Rpb24gX2dlbmVyYXRlQXV0b1BhdGllbnRJZCgpIHtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gIGNvbnN0IGhleCA9IEFycmF5LmZyb20oYnl0ZXMsIChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpLmpvaW4oXCJcIik7XG4gIHJldHVybiBgYXV0by0ke2hleH1gO1xufVxuXG5mdW5jdGlvbiByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBjYXJkID0gZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHM7XG4gIGlmICghb3YpIHtcbiAgICBlbHMub3ZTdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTY3MkFcdThBMkRcdTVCOUFcIjtcbiAgICBpZiAoY2FyZCkgY2FyZC5kYXRhc2V0LnN0YXRlID0gXCJlbXB0eVwiO1xuICB9IGVsc2Uge1xuICAgIC8vIElEIGFsd2F5cyBzaG93biBoYWxmLW1hc2tlZCAoUDEyMDc0MDg2NiBcdTIxOTIgUDEyMDc0KioqKikgXHUyMDE0IHRoYXRcbiAgICAvLyBtYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gVUkgY29udmVudGlvbiBhbmQgcmVtb3ZlcyBhIHN0YWJsZVxuICAgIC8vIHNob3VsZGVyLXN1cmZpbmcgdGFyZ2V0LiBSYXcgdmFsdWUgc3RpbGwgaW4gY2hyb21lLnN0b3JhZ2UgYW5kXG4gICAgLy8gdmlzaWJsZSBpbiB0aGUgaW5wdXQgZmllbGQgd2hlbiB0aGUgY2FyZCBpcyBleHBhbmRlZC5cbiAgICAvLyBOYW1lIGZvbGxvd3MgdGhlIHRvZ2dsZSAoXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4IFx1OTgxMFx1OEEyRFx1OTVEQyA9IFx1NzcxRlx1NTQwRCAvIG11bHRpLXBhdGllbnRcbiAgICAvLyBkZW1vIFx1OTU4Qlx1NTU1RiA9IFx1OTA2RVx1N0Y2OSkuXG4gICAgY29uc3QgcGFydHMgPSBbbWFza0lkKG92LmlkX25vKV07XG4gICAgaWYgKG92Lm5hbWUpIHBhcnRzLnB1c2goX21heWJlTWFzayhvdi5uYW1lKSk7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IGBcdTI3MTMgJHtwYXJ0cy5qb2luKFwiICBcdTAwQjcgIFwiKX1gO1xuICAgIGlmIChjYXJkKSBjYXJkLmRhdGFzZXQuc3RhdGUgPSBcImZpbGxlZFwiO1xuICB9XG4gIC8vIEJvdGggbGF1bmNoICsgc3luYyBlbmFibGVkIHN0YXRlIGRlcGVuZCBvbiBwYXRpZW50ICsgbW9kZSArIGNvbm4uXG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIENoYW5naW5nIHBhdGllbnQgSUQgaW52YWxpZGF0ZXM6IChhKSBiYWNrZW5kLXN0YXRlIGNhY2hlIChuZXdcbiAgLy8gcGF0aWVudCBtaWdodCBub3QgYmUgb24gYmFja2VuZCk7IChiKSBsb2NhbC1idW5kbGUgcm93IGluIHRoZVxuICAvLyBkYXRhLXN0YXRlIGNhcmQ7IChjKSB0aGUgXHVEODNEXHVEQ0U1IGRvd25sb2FkIGJ1bmRsZSBzZWN0aW9uLCB3aGljaCB3b3VsZFxuICAvLyBvdGhlcndpc2Ugc3RpbGwgc2hvdyB0aGUgcHJldmlvdXMgcGF0aWVudCdzIHN0YXNoZWQgZmlsZTsgKGQpXG4gIC8vIHRoZSBsYXN0IGNvbXBsZXRlZCBzeW5jJ3Mgc3VjY2VzcyBtZXNzYWdlLCB3aGljaCB3YXMgdGFnZ2VkIGZvclxuICAvLyB0aGUgcHJldmlvdXMgcGF0aWVudC5cbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuICBfY2xlYXJTdGFsZVN5bmNTdGF0dXMoZ2V0UGF0aWVudE92ZXJyaWRlKCkpO1xuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiYgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG59XG5cbi8vIERyb3AgYSBcIlx1MjcwNSBcdTU0MENcdTZCNjVcdTVCOENcdTYyMTAgXHUyMDI2XCIgc3RhdHVzIGJhbm5lciB0aGF0IHdhcyByZWNvcmRlZCBmb3IgYVxuLy8gZGlmZmVyZW50IHBhdGllbnQuIE1pZC1mbGlnaHQgc3luY3MgYXJlIGxlZnQgYWxvbmUgKHN0YXR1cy5ydW5uaW5nKVxuLy8gc28gdGhlIHVzZXIgY2FuIHN0aWxsIHNlZSBwcm9ncmVzcyBvZiB0aGUgaW4tZmxpZ2h0IHN5bmMuXG5mdW5jdGlvbiBfY2xlYXJTdGFsZVN5bmNTdGF0dXMob3YpIHtcbiAgaWYgKCFfbGF0ZXN0U3RhdHVzKSByZXR1cm47XG4gIGlmIChfbGF0ZXN0U3RhdHVzLnJ1bm5pbmcpIHJldHVybjtcbiAgaWYgKCFfbGF0ZXN0U3RhdHVzLmhpc3RubykgcmV0dXJuO1xuICBpZiAob3Y/LmlkX25vID09PSBfbGF0ZXN0U3RhdHVzLmhpc3RubykgcmV0dXJuO1xuICBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbiAgc2V0U3RhdHVzKFwiXCIsIG51bGwpO1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoXCJzeW5jU3RhdHVzXCIpLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2F2ZVBhdGllbnRPdmVycmlkZSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdikge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdThBQ0JcdTgxRjNcdTVDMTFcdTU4NkJcdTVCRUJcdTU5RDNcdTU0MERcdTYyMTZcdThFQUJcdTUyMDZcdThCNDlcdTVCNTdcdTg2NUZcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gR2VuZGVyIGlzIG1hbmRhdG9yeSBcdTIwMTQgZG93bnN0cmVhbSBzZXgtc3RyYXRpZmllZCByZWZlcmVuY2UgcmFuZ2VzXG4gIC8vIChDQkMsIGxpdmVyIGVuenltZXMsIGV0Yy4pIGFuZCBhbnkgQUkgYWdlL3NleFx1NTIyNFx1OEI4MCByZWx5IG9uIGl0LiBVSVxuICAvLyBtYXJrcyBpdCB3aXRoIGEgcmVkIGFzdGVyaXNrOyB0aGlzIGlzIHRoZSBtYXRjaGluZyB2YWxpZGF0aW9uLlxuICBpZiAoIW92LmdlbmRlcikge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdThBQ0JcdTkwNzhcdTY0QzdcdTYwMjdcdTUyMjVcIiwgXCJlcnJvclwiKTtcbiAgICBlbHMub3ZHZW5kZXIuZm9jdXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gSUQgYXV0by1nZW5lcmF0aW9uOiBpZiB1c2VyIGxlZnQgaWRfbm8gYmxhbmssIG1pbnQgYW4gXCJhdXRvLVhYWFhcIlxuICAvLyBhbmQgc3Rhc2ggaXQgaW4gdGhlIFVJIHNvIHN1YnNlcXVlbnQgcmUtc3luY3MgdXNlIHRoZSBzYW1lIEZISVJcbiAgLy8gUGF0aWVudC5pZCAoc3RvcmFnZSBwZXJzaXN0ZW5jZSBrZWVwcyBpdCBzdGFibGUgYWNyb3NzIHJlLW9wZW5zKS5cbiAgaWYgKCFvdi5pZF9ubykge1xuICAgIG92LmlkX25vID0gX2dlbmVyYXRlQXV0b1BhdGllbnRJZCgpO1xuICAgIGVscy5vdklkTm8udmFsdWUgPSBvdi5pZF9ubztcbiAgfVxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwYXRpZW50T3ZlcnJpZGU6IG92IH0pO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIGlmIChlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscykgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9IGZhbHNlO1xuICAvLyBNYWtlIGNsZWFyIHRoaXMgaXMgdGhlIGlkZW50aXR5IHNhdmUsIG5vdCBhIG1lZGljYWwtcmVjb3JkIHN5bmMgXHUyMDE0XG4gIC8vIFx1MzAwQ1x1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1MzAwRGFsb25lIHJlYWRzIGFzIFwicGF0aWVudCBkYXRhXCIgKG1lZGljYWwpIGZvciBzb21lIHVzZXJzLlxuICAvLyBJRCBoYWxmLW1hc2tlZCBpbiB0aGUgdG9hc3QgZm9yIHRoZSBzYW1lIHNob3VsZGVyLXN1cmZpbmcgcmVhc29uXG4gIC8vIGFzIHRoZSBzdW1tYXJ5IGxpbmUgYWJvdmUuXG4gIGNvbnN0IGRpc3BsYXlOYW1lID0gb3YubmFtZSA/IGAgKCR7X21heWJlTWFzayhvdi5uYW1lKX0pYCA6IFwiXCI7XG4gIHNldFN0YXR1cyhgXHUyNzA1IFx1NzVDNVx1NEVCQVx1OEVBQlx1NEVGRFx1NURGMlx1OEExOFx1NEY0Rlx1RkYxQSR7bWFza0lkKG92LmlkX25vKX0ke2Rpc3BsYXlOYW1lfWAsIFwic3VjY2Vzc1wiKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInBhdGllbnRPdmVycmlkZVwiKTtcbiAgZWxzLm92SWROby52YWx1ZSA9IFwiXCI7XG4gIGVscy5vdk5hbWUudmFsdWUgPSBcIlwiO1xuICBlbHMub3ZCaXJ0aERhdGUudmFsdWUgPSBcIlwiO1xuICBlbHMub3ZHZW5kZXIudmFsdWUgPSBcIlwiO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIGlmIChlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscykgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9IHRydWU7XG4gIHNldFN0YXR1cyhcIlx1NURGMlx1NkUwNVx1OTY2NFx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiLCBcImluZm9cIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCYWNrZW5kIGNvbm5lY3Rpb24gc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gU2luZ2xlIHNvdXJjZSBvZiB0cnV0aDogYF9jb25uU3RhdGVgIHJlZmxlY3RzIHRoZSBsYXRlc3QgYmFja2VuZFxuLy8gY29ubmVjdGl2aXR5IGNoZWNrLiBCb3RoIHRoZSBiYW5uZXIgVUkgYW5kIHRoZSBlbmFibGVkLXN0YXRlIG9mIHRoZVxuLy8gXHVEODNEXHVEQ0U1IFN5bmMgLyBcdUQ4M0RcdURFODAgTGF1bmNoIGJ1dHRvbnMgcmVhZCBmcm9tIGl0LlxuLy9cbi8vIFN0YXRlczpcbi8vICAgXCJ1bmtub3duXCIgIFx1MjAxNCBub3QgeWV0IGNoZWNrZWQgKGUuZy4gZmlyc3QgcGFpbnQgaW4gbG9jYWwgbW9kZSlcbi8vICAgXCJjaGVja2luZ1wiIFx1MjAxNCBmZXRjaCBpbiBmbGlnaHRcbi8vICAgXCJva1wiICAgICAgIFx1MjAxNCBHRVQgL2ZoaXIvbWV0YWRhdGEgcmV0dXJuZWQgYSBGSElSIENhcGFiaWxpdHlTdGF0ZW1lbnRcbi8vICAgXCJmYWlsXCIgICAgIFx1MjAxNCBhbnl0aGluZyBlbHNlOyBgX2Nvbm5GYWlsUmVhc29uYCBjYXJyaWVzIGRldGFpbFxuLy9cbi8vIEJhY2tlbmQgY29ubmVjdGl2aXR5IGlzIHRyZWF0ZWQgYXMgYSAqcHJlcmVxdWlzaXRlKiBmb3IgYmFja2VuZCBtb2RlLFxuLy8gbm90IGFzIGEgcGVyLWFjdGlvbiBjaGVjay4gU3dpdGNoaW5nIHRvIGJhY2tlbmQgbW9kZSB0cmlnZ2VycyBhIHRlc3Rcbi8vIGltbWVkaWF0ZWx5OyBmYWlsdXJlIHNob3dzIGEgYmFubmVyIHdpdGggYWN0aW9uYWJsZSBndWlkYW5jZSBhbmRcbi8vIGRpc2FibGVzIGJvdGggYWN0aW9uIGJ1dHRvbnMgdW50aWwgY29ubmVjdGl2aXR5IHJlY292ZXJzLlxuXG5sZXQgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiO1xubGV0IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7IC8vIHsga2luZDogXCJuby1wZXJtaXNzaW9uXCIgfCBcIm5vLXVybFwiIHwgXCJuZXR3b3JrXCIgfCBcInRpbWVvdXRcIiB8IFwiaHR0cFwiIHwgXCJub3QtZmhpclwiLCBkZXRhaWw/IH1cblxuY29uc3QgX0NPTk5fTEFCRUxTID0ge1xuICB1bmtub3duOiBcIlx1NjcyQVx1NkFBMlx1NkUyQ1wiLFxuICBjaGVja2luZzogXCJcdTZBQTJcdTZFMkNcdTRFMkRcdTIwMjZcIixcbiAgb2s6ICgpID0+IGBcdTVERjJcdTkwMjNcdTdEREEgXHUyMDE0ICR7ZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpfWAsXG4gIGZhaWw6ICgpID0+IHtcbiAgICBjb25zdCByID0gX2Nvbm5GYWlsUmVhc29uIHx8IHt9O1xuICAgIHJldHVybiAoe1xuICAgICAgXCJuby11cmxcIjogXCJcdTI3MTcgXHU2NzJBXHU4QTJEXHU1QjlBIEJhY2tlbmQgVVJMXCIsXG4gICAgICBcIm5vLXBlcm1pc3Npb25cIjogXCJcdTI3MTcgXHU2NzJBXHU2Mzg4XHU2QjBBXHU5MDIzXHU3RERBXCIsXG4gICAgICBcIm5ldHdvcmtcIjogXCJcdTI3MTcgXHU5MDIzXHU0RTBEXHU0RTBBXHU1RjhDXHU3QUVGXCIsXG4gICAgICBcInRpbWVvdXRcIjogXCJcdTI3MTcgXHU5MDIzXHU3RERBXHU5MDNFXHU2NjQyXCIsXG4gICAgICBcImh0dHBcIjogYFx1MjcxNyBIVFRQICR7ci5kZXRhaWwgfHwgXCJcIn1gLnRyaW0oKSxcbiAgICAgIFwibm90LWZoaXJcIjogXCJcdTI3MTcgXHU1NkRFXHU2MUM5XHU0RTBEXHU2NjJGIEZISVJcIixcbiAgICB9KVtyLmtpbmRdID8/IFwiXHUyNzE3IFx1OTAyM1x1N0REQVx1NTkzMVx1NjU1N1wiO1xuICB9LFxufTtcblxuY29uc3QgX0NPTk5fSEVMUCA9IHtcbiAgXCJuby11cmxcIjogICAgICAgIFwiXHU4QUNCXHU1MjMwXHUzMDBDXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBXHUzMDBEXHU1ODZCXHU1MTY1IEJhY2tlbmQgVVJMXHVGRjBDXHU0RjhCXHU1OTgyIDxjb2RlPmh0dHA6Ly9sb2NhbGhvc3Q6ODAxMDwvY29kZT5cdTMwMDJcIixcbiAgXCJuby1wZXJtaXNzaW9uXCI6IFwiQ2hyb21lIFx1OTYzQlx1NjRDQlx1NEU4Nlx1OERFOFx1NEY4Nlx1NkU5MFx1OEFDQlx1NkM0Mlx1MzAwMlx1OEFDQlx1OTFDRFx1NjVCMFx1OTU4QiBwb3B1cFx1RkYwQ1x1NzU3Nlx1NkIwQVx1OTY1MFx1NUMwRFx1OEE3MVx1Njg0Nlx1OERGM1x1NTFGQVx1NjY0Mlx1NjMwOVx1MzAwQ1x1NTE0MVx1OEEzMVx1MzAwRFx1MzAwMlwiLFxuICBcIm5ldHdvcmtcIjogICAgICAgXCJcdTVGOENcdTdBRUZcdTUzRUZcdTgwRkRcdTkwODRcdTZDOTJcdTU1NUZcdTUyRDVcdTMwMDJcdThBQ0JcdTU3RjdcdTg4NENcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgdXAgLWQ8L2NvZGU+PGJyPlx1NzhCQVx1OEE4RCBiYWNrZW5kIFx1NUJCOVx1NTY2OFx1OEREMVx1OEQ3N1x1NEY4Nlx1NTE4RFx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcInRpbWVvdXRcIjogICAgICAgXCI1IFx1NzlEMlx1NTE2N1x1NkM5Mlx1NjUzNlx1NTIzMFx1NTZERVx1NjFDOSBcdTIwMTQgYmFja2VuZCBcdTUzRUZcdTgwRkRcdTkwODRcdTU3MjhcdTU1NUZcdTUyRDVcdTRFMkRcdUZGMENcdTdCNDkgMzAgXHU3OUQyXHU1MThEXHU2MzA5XHU5MUNEXHU4QTY2XHUzMDAyXCIsXG4gIFwiaHR0cFwiOiAgICAgICAgICBcIkJhY2tlbmQgXHU1NkRFXHU2MUM5XHU5MzJGXHU4QUE0XHU3MkMwXHU2MTRCXHU3OEJDXHUzMDAyXHU2QUEyXHU2N0U1IGJhY2tlbmQgXHU3Njg0IGxvZ1x1RkYxQTxicj48Y29kZT5kb2NrZXIgY29tcG9zZSBsb2dzIGJhY2tlbmQ8L2NvZGU+XCIsXG4gIFwibm90LWZoaXJcIjogICAgICBcIlx1OTAxOVx1NTAwQiBVUkwgXHU1NkRFXHU0RTg2XHU2NzcxXHU4OTdGXHVGRjBDXHU0RjQ2XHU0RTBEXHU2NjJGIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFx1MzAwMlx1NzhCQVx1OEE4RCBCYWNrZW5kIFVSTCBcdTYzMDdcdTU0MTEgTkhJLUZISVItQnJpZGdlIFx1NzY4NCAvZmhpciBcdTY4MzlcdTc2RUVcdTkzMDRcdTMwMDJcIixcbn07XG5cbmZ1bmN0aW9uIF9yZW5kZXJDb25uQmFubmVyKCkge1xuICBjb25zdCBiYW5uZXIgPSBlbHMuY29ubkJhbm5lcjtcbiAgaWYgKCFiYW5uZXIpIHJldHVybjtcbiAgYmFubmVyLmRhdGFzZXQuc3RhdGUgPSBfY29ublN0YXRlO1xuICBjb25zdCBsYWJlbCA9IF9DT05OX0xBQkVMU1tfY29ublN0YXRlXTtcbiAgZWxzLmNvbm5Nc2cudGV4dENvbnRlbnQgPSB0eXBlb2YgbGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IGxhYmVsKCkgOiBsYWJlbDtcbiAgZWxzLmNvbm5SZXRyeUJ0bi5oaWRkZW4gPSBfY29ublN0YXRlICE9PSBcImZhaWxcIjtcbiAgaWYgKF9jb25uU3RhdGUgPT09IFwiZmFpbFwiICYmIF9jb25uRmFpbFJlYXNvbj8ua2luZCkge1xuICAgIGVscy5jb25uSGVscC5oaWRkZW4gPSBmYWxzZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gX0NPTk5fSEVMUFtfY29ubkZhaWxSZWFzb24ua2luZF0gPz8gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gdHJ1ZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gXCJcIjtcbiAgfVxuXG4gIC8vIENvbXBhY3QtcGlsbCB2cyBmdWxsLWJhbm5lciBzd2FwOiB3aGVuIGV2ZXJ5dGhpbmcncyBmaW5lLCBzaHJpbmsgdG9cbiAgLy8gYSBzbWFsbCBncmVlbiBwaWxsIGluIHRoZSBoZWFkZXIgc28gdGhlIHBvcHVwIGJvZHkgaGFzIG1vcmUgcm9vbVxuICAvLyBmb3IgYWN0aW9uYWJsZSBjb250ZW50LiBBbnl0aGluZyBlbHNlICh1bmtub3duIC8gY2hlY2tpbmcgLyBmYWlsKVxuICAvLyBrZWVwcyB0aGUgZnVsbCBiYW5uZXIgc28gcHJvZ3Jlc3MgKyBlcnJvciBoZWxwIGhhcyBzcGFjZSB0byByZW5kZXIuXG4gIGNvbnN0IGlzT2sgPSBfY29ublN0YXRlID09PSBcIm9rXCI7XG4gIGlmIChlbHMuY29ublNlY3Rpb24pIGVscy5jb25uU2VjdGlvbi5oaWRkZW4gPSBpc09rO1xuICBpZiAoZWxzLmNvbm5NaW5pKSB7XG4gICAgZWxzLmNvbm5NaW5pLmhpZGRlbiA9ICFpc09rO1xuICAgIGlmIChpc09rKSBlbHMuY29ubk1pbmkudGl0bGUgPSBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCkge1xuICAvLyBTeW5jIGJ1dHRvbi4gQ29uZGl0aW9ucywgaW4gcHJpb3JpdHkgb3JkZXI6XG4gIC8vICAgMS4gb24gYW4gTkhJIHRhYlxuICAvLyAgIDIuIGJhY2tlbmQgbW9kZSBcdTIxOTIgYmFja2VuZCBjb25uZWN0ZWRcbiAgLy8gICAzLiBnZW5kZXIgZmlsbGVkIChvdGhlciBwYXRpZW50IGZpZWxkcyBhbGwgb3B0aW9uYWwpXG4gIC8vIFdoYXRldmVyIGJsb2NrcyB0aGUgQ1RBIGFsc28gZ2V0cyBzdXJmYWNlZCBhcyBhbiBpbmxpbmUgbWVzc2FnZVxuICAvLyBiZWxvdyB0aGUgYnV0dG9uIFx1MjAxNCB0b29sdGlwcyBhcmUgaW52aXNpYmxlIGluIHRoZSAzNjBweCBwb3B1cC5cbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IG1vZGVPayA9IGN1cnJlbnRNb2RlKCkgPT09IFwibG9jYWxcIiB8fCBfY29ublN0YXRlID09PSBcIm9rXCI7XG4gIGNvbnN0IGdlbmRlck9rID0gISFlbHMub3ZHZW5kZXI/LnZhbHVlO1xuXG4gIGxldCByZWFzb24gPSBcIlwiO1xuICBpZiAoIW9uTmhpKSByZWFzb24gPSBcIlx1OEFDQlx1NTE0OFx1NTIwN1x1NTIzMFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NTIwNlx1OTgwMVwiO1xuICBlbHNlIGlmICghbW9kZU9rKSByZWFzb24gPSBcIlx1NUY4Q1x1N0FFRlx1NUMxQVx1NjcyQVx1OTAyM1x1N0REQVx1RkYwOFx1NzcwQlx1NEUwQVx1NjVCOVx1N0QwNVx1ODI3Mlx1NjNEMFx1NzkzQVx1RkYwOVwiO1xuICBlbHNlIGlmICghZ2VuZGVyT2spIHJlYXNvbiA9IFwiXHU4QUNCXHU1MTQ4XHU1NzI4XHU0RTBBXHU2NUI5XHU1ODZCXHUzMDBDXHU2MDI3XHU1MjI1XHUzMDBEXHU0RTI2XHU2MzA5XHU3OEJBXHU1QjlBXCI7XG5cbiAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSByZWFzb24gIT09IFwiXCI7XG4gIGVscy5zeW5jQXBpQnRuLnRpdGxlID0gcmVhc29uO1xuICBpZiAoZWxzLnN5bmNCbG9ja2VkUmVhc29uKSB7XG4gICAgZWxzLnN5bmNCbG9ja2VkUmVhc29uLnRleHRDb250ZW50ID0gcmVhc29uID8gYFx1MjZBMFx1RkUwRiAke3JlYXNvbn1gIDogXCJcIjtcbiAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24uaGlkZGVuID0gcmVhc29uID09PSBcIlwiO1xuICB9XG5cbiAgLy8gTGF1bmNoIGJ1dHRvbjogYmFja2VuZCBtb2RlICsgY29ubiBvayArIHBhdGllbnQgc2V0ICsgYmFja2VuZFxuICAvLyBhY3R1YWxseSBoYXMgdGhpcyBwYXRpZW50IChvdGhlcndpc2UgdGhlIFNNQVJUIGFwcCBsYXVuY2hlcyBpbnRvXG4gIC8vIGFuIGVtcHR5IEZISVIgc3RvcmUgXHUyMDE0IGNvbmZ1c2luZyBibGFuayBzY3JlZW4pLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBoYXZlQmFja2VuZFBhdGllbnQgPSBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiO1xuICBlbHMubGF1bmNoQnRuLmRpc2FibGVkID0gIShcbiAgICBjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJlxuICAgIF9jb25uU3RhdGUgPT09IFwib2tcIiAmJlxuICAgICEhb3Y/LmlkX25vICYmXG4gICAgaGF2ZUJhY2tlbmRQYXRpZW50XG4gICk7XG4gIGVscy5sYXVuY2hCdG4udGl0bGUgPVxuICAgIGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiICA/IFwiXHU4QUNCXHU1MjA3XHU1MjMwXHUzMDBDXHU0RTBBXHU1MEIzXHU1RjhDXHU3QUVGXHUzMDBEXHU2QTIxXHU1RjBGXCIgOlxuICAgIF9jb25uU3RhdGUgIT09IFwib2tcIiAgICAgICAgICAgPyBcIlx1NUY4Q1x1N0FFRlx1NUMxQVx1NjcyQVx1OTAyM1x1N0REQVwiIDpcbiAgICAhb3Y/LmlkX25vICAgICAgICAgICAgICAgICAgICA/IFwiXHU4QUNCXHU1MTQ4XHU1ODZCXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCIgOlxuICAgICFoYXZlQmFja2VuZFBhdGllbnQgICAgICAgICAgID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkFcdTc2ODRcdThDQzdcdTY1OTkgXHUyMDE0IFx1OEFDQlx1NTE0OFx1NTNENlx1NUY5N1x1OENDN1x1NjU5OVx1NjIxNlx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMFx1NkE5NFx1Njg0OFwiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpIHtcbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpO1xuICBpZiAoIXVybCkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vLXVybFwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG4gIF9jb25uU3RhdGUgPSBcImNoZWNraW5nXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG5cbiAgY29uc3QgcGVybSA9IGF3YWl0IGVuc3VyZUJhY2tlbmRQZXJtaXNzaW9uKHVybCk7XG4gIGlmICghcGVybS5vaykge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vLXBlcm1pc3Npb25cIiB9O1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7IHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGN0cmwgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBjdHJsLmFib3J0KCksIDUwMDApO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3VybC5yZXBsYWNlKC9cXC8kLywgXCJcIil9L2ZoaXIvbWV0YWRhdGFgLCB7IHNpZ25hbDogY3RybC5zaWduYWwgfSk7XG4gICAgaWYgKCFyZXMub2spIHtcbiAgICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcImh0dHBcIiwgZGV0YWlsOiByZXMuc3RhdHVzIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXMuanNvbigpLmNhdGNoKCgpID0+IG51bGwpO1xuICAgICAgaWYgKGJvZHk/LnJlc291cmNlVHlwZSAhPT0gXCJDYXBhYmlsaXR5U3RhdGVtZW50XCIpIHtcbiAgICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm90LWZoaXJcIiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2Nvbm5TdGF0ZSA9IFwib2tcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7XG4gICAgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0XCIgOiBcIm5ldHdvcmtcIiB9O1xuICB9IGZpbmFsbHkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gIH1cblxuICBfcmVuZGVyQ29ubkJhbm5lcigpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBXaGVuZXZlciBjb25uZWN0aXZpdHkgZmxpcHMsIHJlLWNoZWNrIHdoZXRoZXIgdGhpcyBwYXRpZW50IGFscmVhZHlcbiAgLy8gZXhpc3RzIG9uIGJhY2tlbmQuIChTdGFsZSBcIl9iYWNrZW5kUGF0aWVudFwiIHN0YXRlIHdvdWxkIG90aGVyd2lzZVxuICAvLyBjYXVzZSBMYXVuY2ggdG8gbG9vayBlbmFibGVkIC8gZGlzYWJsZWQgd3JvbmdseS4pXG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICByZXR1cm4gX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xufVxuXG5lbHMuY29ublJldHJ5QnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGVzdEJhY2tlbmRDb25uZWN0aW9uKTtcblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgXHUyMTk0IGxvY2FsIGRhdGEtc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gSW5kZXBlbmRlbnQgb2YgdGhlIGNvbm5lY3Rpb24gYmFubmVyICh3aGljaCBvbmx5IHRlbGxzIHVzIFwiY2FuIHdlXG4vLyByZWFjaCB0aGUgYmFja2VuZFwiKS4gVGhpcyBjYXJkIGFuc3dlcnMgdHdvIHF1ZXN0aW9uczpcbi8vXG4vLyAgIDEuIERvZXMgdGhlIGJhY2tlbmQgYWxyZWFkeSBoYXZlIHRoaXMgcGF0aWVudCdzIGRhdGE/XG4vLyAgICAgIFx1MjE5MiBkcml2ZXMgd2hldGhlciBcdUQ4M0RcdURFODAgTGF1bmNoIGlzIGFsbG93ZWQgYXQgYWxsIChMYXVuY2ggb24gYW5cbi8vICAgICAgICBlbXB0eSBiYWNrZW5kIGdpdmVzIGEgY29uZnVzaW5nIFNNQVJULWFwcCBibGFuaykuXG4vLyAgIDIuIERvZXMgdGhlIHVzZXIgaGF2ZSBhIGxvY2FsIEJ1bmRsZSB0aGF0J3MgbmV3ZXIgdGhhbiB0aGVcbi8vICAgICAgYmFja2VuZCdzIHZpZXc/XG4vLyAgICAgIFx1MjE5MiBvZmZlciBcIlx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlIFx1NTIzMFx1NUY4Q1x1N0FFRlwiIHRvIHB1c2ggaXQgdmlhIC9maGlyL2ltcG9ydFxuLy8gICAgICAgIHdpdGhvdXQgcmUtZmV0Y2hpbmcgTkhJIChmYXN0LCBub24tZGVzdHJ1Y3RpdmU6IHN0YWJsZSBJRHNcbi8vICAgICAgICB1cHNlcnQgc28gYmFja2VuZCByZXNvdXJjZXMganVzdCBidW1wIHZlcnNpb25JZCkuXG4vL1xuLy8gV2UgZG9uJ3Qgc2Vjb25kLWd1ZXNzIHRoZSB1c2VyOiBldmVuIHdoZW4gbG9jYWwgaXMgY2xlYXJseSBuZXdlcixcbi8vIExhdW5jaCBzdGF5cyBlbmFibGVkIGlmIHRoZSBiYWNrZW5kIGhhcyB0aGUgcGF0aWVudCBcdTIwMTQgdGhleSBtYXlcbi8vIGdlbnVpbmVseSB3YW50IHRvIGxvb2sgYXQgdGhlIG9sZGVyIHN0YXRlLiBUaGUgVUkgbGF5cyBvdXQgYm90aFxuLy8gc2lkZXM7IHVzZXIgZGVjaWRlcy5cblxubGV0IF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbi8vICAgc3RhdGU6IFwidW5rbm93blwiIHwgXCJjaGVja2luZ1wiIHwgXCJhYnNlbnRcIiB8IFwicHJlc2VudFwiIHwgXCJmYWlsXCJcbmxldCBfbG9jYWxCdW5kbGUgPSB7IGV4aXN0czogZmFsc2UsIGNvdW50OiAwLCBnZW5lcmF0ZWRBdDogMCwgcGF0aWVudElkOiBudWxsIH07XG5cbmZ1bmN0aW9uIF9mbXRUaW1lU2hvcnQoaXNvKSB7XG4gIGlmICghaXNvKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XG4gIGlmIChOdW1iZXIuaXNOYU4oZC5nZXRUaW1lKCkpKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gIHJldHVybiBgJHtkLmdldE1vbnRoKCkgKyAxfS8ke2QuZ2V0RGF0ZSgpfSAke3BhZChkLmdldEhvdXJzKCkpfToke3BhZChkLmdldE1pbnV0ZXMoKSl9YDtcbn1cblxuZnVuY3Rpb24gX2ZtdFJlbGF0aXZlKG1zKSB7XG4gIGNvbnN0IGRpZmYgPSBEYXRlLm5vdygpIC0gbXM7XG4gIGlmIChkaWZmIDwgNjBfMDAwKSByZXR1cm4gYCR7TWF0aC5tYXgoMSwgTWF0aC5yb3VuZChkaWZmIC8gMTAwMCkpfSBcdTc5RDJcdTUyNERgO1xuICBpZiAoZGlmZiA8IDM2MDBfMDAwKSByZXR1cm4gYCR7TWF0aC5yb3VuZChkaWZmIC8gNjBfMDAwKX0gXHU1MjA2XHU5NDE4XHU1MjREYDtcbiAgaWYgKGRpZmYgPCA4Nl80MDBfMDAwKSByZXR1cm4gYCR7TWF0aC5yb3VuZChkaWZmIC8gMzYwMF8wMDApfSBcdTVDMEZcdTY2NDJcdTUyNERgO1xuICByZXR1cm4gX2ZtdFRpbWVTaG9ydChuZXcgRGF0ZShtcykudG9JU09TdHJpbmcoKSk7XG59XG5cbmZ1bmN0aW9uIF9yZW5kZXJEYXRhU3RhdGUoKSB7XG4gIC8vIFNlY3Rpb24gb25seSB2aXNpYmxlIGluIGJhY2tlbmQgbW9kZSAoaGFuZGxlZCBieSAuYmFja2VuZC1vbmx5IENTUyksXG4gIC8vIGJ1dCB3ZSBhbHNvIGV4cGxpY2l0bHkgaGlkZSB3aGVuIHRoZSBwb3B1cCBoYXMgbm8gcGF0aWVudF9vdmVycmlkZVxuICAvLyBzZXQsIHNpbmNlIGJvdGggY2hlY2tzIGtleSBvZmYgcGF0aWVudF9pZC5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiIHx8ICFvdj8uaWRfbm8pIHtcbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChlbHMuc3luY1N0YXR1c0hpbnQpIGVscy5zeW5jU3RhdHVzSGludC5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENhcmQgc2VydmVzIGFzIGFuIGFsZXJ0LCBub3QgYSBkYXNoYm9hcmQgXHUyMDE0IHNob3cgb25seSB3aGVuIHRoZXJlJ3NcbiAgLy8gc29tZXRoaW5nIGFjdGlvbmFibGUgLyB3b3J0aCBmbGFnZ2luZy4gSGlkZSB3aGVuOlxuICAvLyAgIC0gYmFja2VuZCBoYXMgdGhpcyBwYXRpZW50IEFORCBubyBsb2NhbCBidW5kbGUgdG8gY29tcGFyZSBhZ2FpbnN0XG4gIC8vICAgICAoTGF1bmNoIGlzIGVuYWJsZWQgXHUyMTkyIHRoYXQncyB0aGUgc2lnbmFsIGV2ZXJ5dGhpbmcncyBmaW5lKSwgb3JcbiAgLy8gICAtIGJvdGggc2lkZXMgYWdyZWUgb24gY291bnQgKGFscmVhZHkgaW4gc3luYywgbm8gdXBsb2FkIG5lZWRlZCkuXG4gIC8vIFRoZSByZW1haW5pbmcgc3RhdGVzIChjaGVja2luZyAvIGZhaWwgLyBhYnNlbnQgLyBjb3VudCBtaXNtYXRjaCkgYWxsXG4gIC8vIGVpdGhlciBuZWVkIHVzZXIgYXR0ZW50aW9uIG9yIGFyZSB0cmFuc2llbnQgbG9hZGluZyBmZWVkYmFjay5cbiAgY29uc3QgbG9jYWxNYXRjaGVzID0gX2xvY2FsQnVuZGxlLmV4aXN0cyAmJiBfbG9jYWxCdW5kbGUucGF0aWVudElkID09PSBvdi5pZF9ubztcbiAgY29uc3QgaW5TeW5jID1cbiAgICBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiICYmXG4gICAgbG9jYWxNYXRjaGVzICYmXG4gICAgX2JhY2tlbmRQYXRpZW50LmNvdW50ID09PSBfbG9jYWxCdW5kbGUuY291bnQ7XG4gIC8vIFF1aWV0IFwiXHUyNzEzIFx1NURGMlx1NTQwQ1x1NkI2NVwiIGhpbnQgc2l0cyB1bmRlciB0aGUgZG93bmxvYWQgYnV0dG9uIHdoZW4gaW4tc3luYyBcdTIwMTRcbiAgLy8gZ2l2ZXMgdGhlIHVzZXIgYSB0aW55IGFja25vd2xlZGdlbWVudCBpbnN0ZWFkIG9mIHRvdGFsIHNpbGVuY2UuXG4gIGlmIChlbHMuc3luY1N0YXR1c0hpbnQpIGVscy5zeW5jU3RhdHVzSGludC5oaWRkZW4gPSAhaW5TeW5jO1xuICBjb25zdCBub3RoaW5nVG9TaG93ID1cbiAgICBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiICYmICghbG9jYWxNYXRjaGVzIHx8IGluU3luYyk7XG4gIGlmIChub3RoaW5nVG9TaG93KSB7XG4gICAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gZmFsc2U7XG5cbiAgLy8gQmFja2VuZCByb3dcbiAgY29uc3QgYnMgPSBlbHMuYmFja2VuZFN0YXRlO1xuICBzd2l0Y2ggKF9iYWNrZW5kUGF0aWVudC5zdGF0ZSkge1xuICAgIGNhc2UgXCJjaGVja2luZ1wiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJkYXRhLXN0YXRlLXZhbHVlXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IFwiXHU2QUEyXHU2N0U1XHU0RTJEXHUyMDI2XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiYWJzZW50XCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcImRhdGEtc3RhdGUtdmFsdWUgZW1wdHlcIjtcbiAgICAgIC8vIENhcmQgc2l0cyAqYmVsb3cqIHRoZSBcdUQ4M0RcdUREMDQgXHU1NDBDXHU2QjY1IGJ1dHRvbi4gT25seSBtZW50aW9uIHRoZSBsb2NhbC1cbiAgICAgIC8vIHVwbG9hZCBhbHRlcm5hdGl2ZSB3aGVuIGEgbWF0Y2hpbmcgcGVuZGluZyBCdW5kbGUgYWN0dWFsbHlcbiAgICAgIC8vIGV4aXN0cyAob3RoZXJ3aXNlIHRoZSB1c2VyIGdvZXMgaHVudGluZyBmb3IgYW4gdXBsb2FkIGJ1dHRvblxuICAgICAgLy8gdGhhdCdzIG5vdCB0aGVyZSBhbmQgY29uY2x1ZGVzIFwidGhlcmUncyBubyBzeW5jIGJ1dHRvbiBhdCBhbGxcIikuXG4gICAgICBicy50ZXh0Q29udGVudCA9IGxvY2FsTWF0Y2hlc1xuICAgICAgICA/IFwiXHUyNkEwIFx1NUMxQVx1NzEyMVx1NkI2NFx1NzVDNVx1NEVCQSBcdTIwMTQgXHU4QUNCXHU2MzA5XHU0RTBBXHU2NUI5XHUzMDBDXHVEODNEXHVERDA0IFx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MzAwRFx1NjIxNlx1NEUwQlx1NjVCOVx1MzAwQ1x1RDgzRFx1RENFNCBcdTYyOEFcdTY3MkNcdTU3MzBcdTZBOTRcdTY4NDhcdTRFMEFcdTUwQjNcdTUyMzBcdTVGOENcdTdBRUZcdTMwMERcIlxuICAgICAgICA6IFwiXHUyNkEwIFx1NUMxQVx1NzEyMVx1NkI2NFx1NzVDNVx1NEVCQSBcdTIwMTQgXHU4QUNCXHU2MzA5XHU0RTBBXHU2NUI5XHUzMDBDXHVEODNEXHVERDA0IFx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MzAwRFx1NjI5M1x1OENDN1x1NjU5OVx1NTIzMFx1NUY4Q1x1N0FFRlwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInByZXNlbnRcIjoge1xuICAgICAgY29uc3QgY291bnQgPSBfYmFja2VuZFBhdGllbnQuY291bnQ7XG4gICAgICBjb25zdCB0cyA9IF9iYWNrZW5kUGF0aWVudC5sYXN0VXBkYXRlZDtcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwiZGF0YS1zdGF0ZS12YWx1ZSBva1wiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBgXHUyNzEzICR7Y291bnQgPiAwID8gYCR7Y291bnR9IFx1N0I0NiBcdTAwQjcgYCA6IFwiXCJ9XHU2NzAwXHU1RjhDXHU2NkY0XHU2NUIwICR7X2ZtdFRpbWVTaG9ydCh0cykgfHwgXCIodW5rbm93bilcIn1gO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJmYWlsXCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcImRhdGEtc3RhdGUtdmFsdWUgZmFpbFwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjcxNyBcdTZBQTJcdTY3RTVcdTU5MzFcdTY1NTdcdUZGMDhcdTc3MEJcdTkwMjNcdTdEREEgYmFubmVyXHVGRjA5XCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJkYXRhLXN0YXRlLXZhbHVlXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IFwiXHUyMDE0XCI7XG4gIH1cblxuICAvLyBMb2NhbCByb3cgXHUyMDE0IHNob3cgb25seSB3aGVuIHRoZSBwZW5kaW5nIGJ1bmRsZSBtYXRjaGVzIHRoaXMgcGF0aWVudC5cbiAgLy8gKGxvY2FsTWF0Y2hlcyB3YXMgY29tcHV0ZWQgYWJvdmUgZm9yIHRoZSBlYXJseS1yZXR1cm4gY2hlY2suKVxuICBpZiAobG9jYWxNYXRjaGVzKSB7XG4gICAgZWxzLmxvY2FsU3RhdGVSb3cuaGlkZGVuID0gZmFsc2U7XG4gICAgZWxzLmxvY2FsU3RhdGUuY2xhc3NOYW1lID0gXCJkYXRhLXN0YXRlLXZhbHVlIG9rXCI7XG4gICAgZWxzLmxvY2FsU3RhdGUudGV4dENvbnRlbnQgPVxuICAgICAgYFx1MjcxMyAke19sb2NhbEJ1bmRsZS5jb3VudH0gXHU3QjQ2IFx1MDBCNyAke19mbXRSZWxhdGl2ZShfbG9jYWxCdW5kbGUuZ2VuZXJhdGVkQXQpfVx1NzUyMlx1NzUxRmA7XG4gIH0gZWxzZSB7XG4gICAgZWxzLmxvY2FsU3RhdGVSb3cuaGlkZGVuID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFwiXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGVcIiBidXR0b24gc2hvd3Mgb25seSB3aGVuIHRoZXJlJ3MgYSBsb2NhbCBidW5kbGVcbiAgLy8gZm9yIHRoaXMgcGF0aWVudC4gV2UgZG9uJ3QgcmVhY2ggdGhpcyBicmFuY2ggd2hlbiBpbi1zeW5jICh0aGVcbiAgLy8gd2hvbGUgc2VjdGlvbiBnZXRzIGhpZGRlbiBhYm92ZSksIHNvIG5vIG5lZWQgZm9yIGEgc2VwYXJhdGVcbiAgLy8gZGlzYWJsZWQgc3RhdGUgXHUyMDE0IHdoZW4gdGhlIGJ1dHRvbiBzaG93cywgdXBsb2FkIGlzIGFsd2F5cyBtZWFuaW5nZnVsLlxuICBlbHMucHVzaExvY2FsQnRuLmhpZGRlbiA9ICFsb2NhbE1hdGNoZXM7XG4gIGVscy5wdXNoTG9jYWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50aXRsZSA9IFwiXCI7XG4gIGVscy5wdXNoTG9jYWxCdG4udGV4dENvbnRlbnQgPSBcIlx1RDgzRFx1RENFNCBcdTYyOEFcdTY3MkNcdTU3MzBcdTZBOTRcdTY4NDhcdTRFMEFcdTUwQjNcdTUyMzBcdTVGOENcdTdBRUZcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBfbG9jYWxCdW5kbGUgPSBwZW5kaW5nXG4gICAgPyB7XG4gICAgICAgIGV4aXN0czogdHJ1ZSxcbiAgICAgICAgY291bnQ6IEFycmF5LmlzQXJyYXkoSlNPTi5wYXJzZShwZW5kaW5nLmpzb24pPy5lbnRyeSlcbiAgICAgICAgICA/IEpTT04ucGFyc2UocGVuZGluZy5qc29uKS5lbnRyeS5sZW5ndGhcbiAgICAgICAgICA6IDAsXG4gICAgICAgIGdlbmVyYXRlZEF0OiBwZW5kaW5nLmdlbmVyYXRlZEF0IHx8IDAsXG4gICAgICAgIHBhdGllbnRJZDogcGVuZGluZy5wYXRpZW50SWQgfHwgbnVsbCxcbiAgICAgIH1cbiAgICA6IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGVja0JhY2tlbmRQYXRpZW50KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubyB8fCBfY29ublN0YXRlICE9PSBcIm9rXCIpIHtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiY2hlY2tpbmdcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcblxuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICBjb25zdCBrZXkgPSBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGhlYWRlcnMgPSBrZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjoga2V5IH0gOiB7fTtcbiAgLy8gQmFja2VuZCBzdG9yZXMgUGF0aWVudCB1bmRlciB0aGUgaGFzaGVkIEZISVIgaWQsIG5ldmVyIHVuZGVyIHRoZSByYXdcbiAgLy8gbmF0aW9uYWwgSUQgXHUyMDE0IHF1ZXJ5IC8gZXhwb3J0IGJ5IHRoZSBoYXNoZWQgZm9ybS5cbiAgY29uc3QgZmhpclBpZCA9IGRlcml2ZVBhdGllbnRJZChvdi5pZF9ubyk7XG4gIHRyeSB7XG4gICAgY29uc3QgcHIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvUGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLCB7IGhlYWRlcnMgfSk7XG4gICAgaWYgKHByLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImFic2VudFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFwci5vaykge1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJmYWlsXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwYXRpZW50ID0gYXdhaXQgcHIuanNvbigpO1xuICAgIGNvbnN0IGxhc3RVcGRhdGVkID0gcGF0aWVudD8ubWV0YT8ubGFzdFVwZGF0ZWQgPz8gbnVsbDtcbiAgICAvLyBDb3VudCB2aWEgL2ZoaXIvZXhwb3J0IFx1MjAxNCBzbGlnaHRseSBoZWF2aWVyIGJ1dCBpdCdzIHRoZSBvbmx5XG4gICAgLy8gb2ZmLXRoZS1zaGVsZiB3YXkgdG8gZ2V0IHRvdGFsIHJlc291cmNlcyBmb3IgYSBwYXRpZW50LiBDYXAgYnlcbiAgICAvLyA1cyB0aW1lb3V0IHNvIGEgc2xvdyBiYWNrZW5kIGRvZXNuJ3QgbG9jayB0aGUgcG9wdXAgZm9yZXZlci5cbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjdHJsID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gICAgICBjb25zdCBlciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLCB7XG4gICAgICAgIGhlYWRlcnMsIHNpZ25hbDogY3RybC5zaWduYWwsXG4gICAgICB9KTtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICBpZiAoZXIub2spIHtcbiAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgZXIuanNvbigpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShidW5kbGUuZW50cnkpKSBjb3VudCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIGxlYXZlIGNvdW50ID0gMDsgbm90IGZhdGFsICovIH1cbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInByZXNlbnRcIiwgY291bnQsIGxhc3RVcGRhdGVkIH07XG4gIH0gY2F0Y2ggKF9lKSB7XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJmYWlsXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICB9XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHVzaExvY2FsQnVuZGxlVG9CYWNrZW5kKCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoIW92Py5pZF9ubyB8fCAhX2xvY2FsQnVuZGxlLmV4aXN0cyB8fCBfbG9jYWxCdW5kbGUucGF0aWVudElkICE9PSBvdi5pZF9ubykgcmV0dXJuO1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICBjb25zdCBrZXkgPSBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgLi4uKGtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBrZXkgfSA6IHt9KSxcbiAgfTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIGVscy5wdXNoTG9jYWxCdG4udGV4dENvbnRlbnQgPSBcIlx1NEUwQVx1NTBCM1x1NEUyRFx1MjAyNlwiO1xuICB0cnkge1xuICAgIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgICBpZiAoIXBlbmRpbmc/Lmpzb24pIHRocm93IG5ldyBFcnJvcihcIm5vIGxvY2FsIGJ1bmRsZVwiKTtcbiAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7dXJsfS9maGlyL2ltcG9ydGAsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsIGhlYWRlcnMsIGJvZHk6IHBlbmRpbmcuanNvbixcbiAgICB9KTtcbiAgICBpZiAoIXIub2spIHtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByLnRleHQoKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Iuc3RhdHVzfTogJHt0ZXh0LnNsaWNlKDAsIDEyMCl9YCk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHIuanNvbigpO1xuICAgIHNldFN0YXR1cyhgXHUyNzA1IFx1NURGMlx1NEUwQVx1NTBCMyAke3Jlc3VsdC5pbXBvcnRlZCA/PyBcIj9cIn0gXHU3QjQ2XHU1MjMwXHU1RjhDXHU3QUVGYCwgXCJzdWNjZXNzXCIpO1xuICAgIGF3YWl0IGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNldFN0YXR1cyhgXHUyNkQ0IFx1NEUwQVx1NTBCM1x1NTkzMVx1NjU1N1x1RkYxQSR7ZS5tZXNzYWdlfWAsIFwiZXJyb3JcIik7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gX3JlbmRlckRhdGFTdGF0ZSgpIChhbHJlYWR5IGNhbGxlZCBmcm9tIGNoZWNrQmFja2VuZFBhdGllbnQgb25cbiAgICAvLyBzdWNjZXNzKSBkZWNpZGVzIHRoZSByaWdodCBkaXNhYmxlZCBzdGF0ZSArIGxhYmVsIGJhc2VkIG9uXG4gICAgLy8gd2hldGhlciBiYWNrZW5kIGFuZCBsb2NhbCBhZ3JlZS4gQ2FsbCBpdCBoZXJlIHRvbyB0byBjb3ZlciB0aGVcbiAgICAvLyBmYWlsdXJlIHBhdGggdGhhdCBza2lwcGVkIGNoZWNrQmFja2VuZFBhdGllbnQuXG4gICAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICB9XG59XG5cbmVscy5wdXNoTG9jYWxCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdXNoTG9jYWxCdW5kbGVUb0JhY2tlbmQpO1xuXG4vLyBcIlx1RDgzRFx1REQxNyBcdTk1OEJcdTU1NUZcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTc2N0JcdTUxNjVcIiBcdTIwMTQgb3BlbnMgdGhlIE5ISSBsYW5kaW5nIHBhZ2Ugc28gdGhlIHVzZXJcbi8vIGRvZXNuJ3QgaGF2ZSB0byByZW1lbWJlciAvIGdvb2dsZSB0aGUgVVJMLiBDbG9zZXMgdGhlIHBvcHVwIHNvXG4vLyB0aGV5IGRvbid0IGhhdmUgdG8gZGlzbWlzcyBpdCBtYW51YWxseSBhZnRlciB0aGUgbmV3IHRhYiBvcGVucy5cbmVscy5vcGVuTmhpQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICBhd2FpdCBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IE5ISV9MQU5ESU5HIH0pO1xuICB3aW5kb3cuY2xvc2UoKTtcbn0pO1xuXG4vLyBMb2NhbCBidW5kbGUgc3RhdGUgY2hhbmdlcyB3aGVuZXZlciB0aGUgU1cgc3Rhc2hlcyBhIG5ldyBzeW5jLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgUEVORElOR19CVU5ETEVfS0VZIGluIGNoYW5nZXMpIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBTeW5jIG1vZGUgKGxvY2FsIHwgYmFja2VuZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5hc3luYyBmdW5jdGlvbiBsb2FkU3luY01vZGUoKSB7XG4gIGNvbnN0IHsgc3luY01vZGUgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInN5bmNNb2RlXCIpO1xuICBjb25zdCBtb2RlID0gc3luY01vZGUgPT09IFwiYmFja2VuZFwiID8gXCJiYWNrZW5kXCIgOiBERUZBVUxUX01PREU7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSByLmNoZWNrZWQgPSByLnZhbHVlID09PSBtb2RlO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gIGlmIChtb2RlID09PSBcImJhY2tlbmRcIikge1xuICAgIC8vIEF1dG8tdGVzdCBvbiBvcGVuIHNvIHRoZSB1c2VyIHNlZXMgc3RhdHVzIHdpdGhvdXQgY2xpY2tpbmcuIEF3YWl0aW5nXG4gICAgLy8gaGVyZSBzZXJpYWxpemVzIHRoZSByZXN0IG9mIGluaXQoKSB1bnRpbCB3ZSBrbm93IHRoZSBhbnN3ZXIuXG4gICAgYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3VycmVudE1vZGUoKSB7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSBpZiAoci5jaGVja2VkKSByZXR1cm4gci52YWx1ZTtcbiAgcmV0dXJuIERFRkFVTFRfTU9ERTtcbn1cblxuZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHtcbiAgci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RlID0gY3VycmVudE1vZGUoKTtcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY01vZGU6IG1vZGUgfSk7XG4gICAgaWYgKG1vZGUgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgICB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTsgLy8gdHJpZ2dlcnMgY2hlY2tCYWNrZW5kUGF0aWVudCBvbiBzdWNjZXNzXG4gICAgfSBlbHNlIHtcbiAgICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5lbHMuYmFja2VuZFVybC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgYmFja2VuZFVybDogZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpIH0pO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xufSk7XG5lbHMuc3luY0FwaUtleS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpIH0pO1xufSk7XG4vLyBTaWRlYmFyIFwiXHVEODNEXHVEQ0NCIFx1NTJBOVx1NzQwNlwiIHRvZ2dsZSBcdTIwMTQgcGVyc2lzdHMgaW4gY2hyb21lLnN0b3JhZ2UubG9jYWwgc28gdGhlXG4vLyBwcmVmZXJlbmNlIGlzIHN0aWNreSBhY3Jvc3MgcmVpbnN0YWxscy4gc2lkZWJhci5qcyBsaXN0ZW5zIHRvIHRoZVxuLy8gc2FtZSBrZXkgYW5kIGhpZGVzIGl0c2VsZiB3aGVuIHNldCB0byBmYWxzZS5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRTaWRlYmFyRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBzaWRlYmFyRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic2lkZWJhckVuYWJsZWRcIik7XG4gIGVscy5zaWRlYmFyRW5hYmxlZC5jaGVja2VkID0gc2lkZWJhckVuYWJsZWQgIT09IGZhbHNlOyAvLyBkZWZhdWx0IE9OXG59XG5cbmVscy5zaWRlYmFyRW5hYmxlZD8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNpZGViYXJFbmFibGVkOiBlbHMuc2lkZWJhckVuYWJsZWQuY2hlY2tlZCB9KTtcbn0pO1xuXG4vLyBNYXNrLXBhdGllbnQtbmFtZSB0b2dnbGUgXHUyMDE0IGRlZmF1bHRzIE9GRiAoY2l0aXplbnMgZG93bmxvYWRpbmcgdGhlaXJcbi8vIG93biBkYXRhIGRvbid0IG5lZWQgYW5vbnltaXphdGlvbikuIFdoZW4gT046IHBvcHVwIHN1bW1hcnksIEZISVJcbi8vIEJ1bmRsZSBvdXRwdXQsIHN5bmMtbG9nLCBhbmQgTkhJIHJlcG9ydCBuYXJyYXRpdmUgYWxsIHVzZSB0aGVcbi8vIG1hc2tlZCBmb3JtIChcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjApIGluc3RlYWQgb2YgdGhlIHJlYWwgbmFtZS5cbmxldCBfbWFza05hbWVFbmFibGVkID0gZmFsc2U7XG5hc3luYyBmdW5jdGlvbiBsb2FkTWFza05hbWVFbmFibGVkKCkge1xuICBjb25zdCB7IG1hc2tOYW1lRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwibWFza05hbWVFbmFibGVkXCIpO1xuICBfbWFza05hbWVFbmFibGVkID0gbWFza05hbWVFbmFibGVkID09PSB0cnVlO1xuICBpZiAoZWxzLm1hc2tOYW1lRW5hYmxlZCkgZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkID0gX21hc2tOYW1lRW5hYmxlZDtcbn1cblxuZnVuY3Rpb24gX21heWJlTWFzayhuYW1lKSB7XG4gIHJldHVybiBfbWFza05hbWVFbmFibGVkID8gbWFza05hbWUobmFtZSkgOiBuYW1lIHx8IFwiXCI7XG59XG5cbmVscy5tYXNrTmFtZUVuYWJsZWQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICBfbWFza05hbWVFbmFibGVkID0gZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBtYXNrTmFtZUVuYWJsZWQ6IF9tYXNrTmFtZUVuYWJsZWQgfSk7XG4gIC8vIFJlLXJlbmRlciBwb3B1cCBjaHJvbWUgKHN1bW1hcnkgbGluZSBpcyB0aGUgb25seSBzcG90IHRoYXQgcmVhZHNcbiAgLy8gX21heWJlTWFzayByZWFjdGl2ZWx5OyBldmVyeXdoZXJlIGVsc2Ugc2FtcGxlcyBpdCBqdXN0LWluLXRpbWUpLlxuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG59KTtcblxuZWxzLnNtYXJ0QXBwVXJsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAvLyBQZXJzaXN0IHRyaW1tZWQgdmFsdWUuIEVtcHR5IHN0cmluZyBcdTIxOTIgcmVzdG9yZSBkZWZhdWx0IG9uIG5leHQgbG9hZC5cbiAgY29uc3QgdiA9IGVscy5zbWFydEFwcFVybC52YWx1ZS50cmltKCk7XG4gIGlmICh2KSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc21hcnRBcHBMYXVuY2hVcmw6IHYgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwic21hcnRBcHBMYXVuY2hVcmxcIik7XG4gICAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICB9XG59KTtcblxuZnVuY3Rpb24gc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93bikge1xuICAvLyBCdWlsZCB3aXRoIERPTSBBUEkgXHUyMDE0IGF2b2lkcyBpbm5lckhUTUwgLyBYU1Mgcmlzay5cbiAgLy8gYnJlYWtkb3duIGlzIGFuIGFycmF5IG9mIG1peGVkIGVudHJpZXM6XG4gIC8vICAgLSBwaGFzZSB0aW1pbmdzIHByZWZpeGVkIHdpdGggXCJcdTIzRjFcIiAgXHUyMTkyIFx1OTY4RVx1NkJCNVx1ODAxN1x1NjY0MlxuICAvLyAgIC0gcGVyLWVuZHBvaW50IGNvdW50cyAgICAgICAgICAgICAgICBcdTIxOTIgXHU1NDA0IGVuZHBvaW50IFx1NjI5M1x1NTIzMFx1NUU3RVx1N0I0NlxuICAvLyBCb3RoIGtpbmRzIGFyZSB0dWNrZWQgaW5zaWRlIGEgc2luZ2xlIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgdG9nZ2xlIHNvIHRoZVxuICAvLyBwb3B1cCBzdGF5cyBjb21wYWN0IGJ5IGRlZmF1bHQuXG4gIGVscy5zdGF0dXMuY2xhc3NOYW1lID0ga2luZCB8fCBcIlwiO1xuICBlbHMuc3RhdHVzLnRleHRDb250ZW50ID0gXCJcIjtcbiAgaWYgKCF0ZXh0ICYmICEoYnJlYWtkb3duICYmIGJyZWFrZG93bi5sZW5ndGgpKSByZXR1cm47XG4gIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCB8fCBcIlwiKSk7XG4gIGlmIChicmVha2Rvd24gJiYgYnJlYWtkb3duLmxlbmd0aCkge1xuICAgIGNvbnN0IHBoYXNlUm93cyA9IGJyZWFrZG93bi5maWx0ZXIoKGIpID0+IGIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG4gICAgY29uc3Qgb3RoZXJSb3dzID0gYnJlYWtkb3duLmZpbHRlcigoYikgPT4gIWIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgZGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWxcIjtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgc3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCI7XG4gICAgZGV0YWlscy5hcHBlbmRDaGlsZChzdW1tYXJ5KTtcblxuICAgIGlmIChwaGFzZVJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwaGFzZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgcGhhc2VzLmNsYXNzTmFtZSA9IFwic3RhdHVzLXBoYXNlc1wiO1xuICAgICAgcGhhc2VzLnRleHRDb250ZW50ID0gcGhhc2VSb3dzLm1hcCgocCkgPT4gcC5yZXBsYWNlKC9eXHUyM0YxXFxzKi8sIFwiXCIpKS5qb2luKFwiIFx1MDBCNyBcIik7XG4gICAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHBoYXNlcyk7XG4gICAgfVxuICAgIGlmIChvdGhlclJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGJvZHkuY2xhc3NOYW1lID0gXCJzdGF0dXMtYnJlYWtkb3duXCI7XG4gICAgICBib2R5LnRleHRDb250ZW50ID0gb3RoZXJSb3dzLmpvaW4oXCIgXHUwMEI3IFwiKTtcbiAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuICAgIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWN0aXZlVGFiKCkge1xuICBjb25zdCBbdGFiXSA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICByZXR1cm4gdGFiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGVuZGluZyBGSElSIEJ1bmRsZSAobG9jYWwtbW9kZSByZXN1bHQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEJhY2tncm91bmQgc3Rhc2hlcyB0aGUgZ2VuZXJhdGVkIEJ1bmRsZSBpbnRvIGNocm9tZS5zdG9yYWdlLmxvY2FsXG4vLyB1bmRlciBgcGVuZGluZ0ZoaXJCdW5kbGVgLiBQb3B1cCByZW5kZXJzIGEgZG93bmxvYWQgYnV0dG9uLiBVc2VyIG11c3Rcbi8vIGNsaWNrIHRvIGFjdHVhbGx5IHRyaWdnZXIgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBcdTIwMTQgdGhlIGZpbGUgbmV2ZXJcbi8vIGhpdHMgdGhlIGRpc2sgdW5zb2xpY2l0ZWQuXG5cbmZ1bmN0aW9uIF9mbXRCeXRlcyhuKSB7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwMjQgKiAxMDI0KSByZXR1cm4gYCR7KG4gLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gIHJldHVybiBgJHsobiAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMil9IE1CYDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZyB8fCAhcGVuZGluZy5qc29uKSB7XG4gICAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gSWYgdGhlIHVzZXIgaGFzIHN3aXRjaGVkIG92ZXJyaWRlIHRvIGEgZGlmZmVyZW50IHBhdGllbnQsIHRoZVxuICAvLyBzdGFzaGVkIGJ1bmRsZSBpcyBmb3IgdGhlICpwcmV2aW91cyogcGF0aWVudC4gSGlkZSBpdCBzbyB0aGV5XG4gIC8vIGNhbid0IGFjY2lkZW50YWxseSBkb3dubG9hZCB0aGUgd3JvbmcgZmlsZS4gVGhlIGJ1bmRsZSBzdGF5cyBpblxuICAvLyBzdG9yYWdlOyByZS1lbnRlcmluZyB0aGUgbWF0Y2hpbmcgb3ZlcnJpZGUgd2lsbCBzdXJmYWNlIGl0IGFnYWluLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAob3Y/LmlkX25vICYmIHBlbmRpbmcucGF0aWVudElkICYmIHBlbmRpbmcucGF0aWVudElkICE9PSBvdi5pZF9ubykge1xuICAgIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IGZhbHNlO1xuICBjb25zdCBhZ28gPSBwZW5kaW5nLmdlbmVyYXRlZEF0XG4gICAgPyBgJHtNYXRoLm1heCgxLCBNYXRoLnJvdW5kKChEYXRlLm5vdygpIC0gcGVuZGluZy5nZW5lcmF0ZWRBdCkgLyAxMDAwKSl9IFx1NzlEMlx1NTI0RGBcbiAgICA6IFwiXCI7XG4gIGVscy5idW5kbGVNZXRhLnRleHRDb250ZW50ID0gYCR7cGVuZGluZy5maWxlbmFtZX0gXHUwMEI3ICR7X2ZtdEJ5dGVzKHBlbmRpbmcuYnl0ZXMgfHwgMCl9JHthZ28gPyBgIFx1MDBCNyAke2Fnb31gIDogXCJcIn1gO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkb3dubG9hZFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZykgcmV0dXJuO1xuICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3BlbmRpbmcuanNvbl0sIHsgdHlwZTogXCJhcHBsaWNhdGlvbi9maGlyK2pzb25cIiB9KTtcbiAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkKHsgdXJsLCBmaWxlbmFtZTogcGVuZGluZy5maWxlbmFtZSwgc2F2ZUFzOiBmYWxzZSB9KTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBSZWxlYXNlIGFmdGVyIGEgdGljayBzbyB0aGUgZG93bmxvYWQgaGFzIHRpbWUgdG8gc3RhcnQuXG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDUwMDApO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNsZWFyUGVuZGluZ0J1bmRsZSgpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGF3YWl0IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG59XG5cbmVscy5kb3dubG9hZEJ1bmRsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG93bmxvYWRQZW5kaW5nQnVuZGxlKTtcbmVscy5jbGVhckJ1bmRsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJQZW5kaW5nQnVuZGxlKTtcblxuLy8gTGl2ZSB1cGRhdGUgd2hlbiBiYWNrZ3JvdW5kIHN0YXNoZXMgYSBuZXcgYnVuZGxlIHdoaWxlIHBvcHVwIGlzIG9wZW4uXG4vLyAoTm90ZTogYW5vdGhlciBvbkNoYW5nZWQgbGlzdGVuZXIgZWFybGllciBpbiB0aGUgZmlsZSByZWZyZXNoZXMgdGhlXG4vLyBkYXRhLXN0YXRlIGNhcmQ7IHdlIGxlYXZlIHRoYXQgb25lIHNlcGFyYXRlIHNvIGZhaWx1cmUgb2YgZWl0aGVyIHBhdGhcbi8vIGRvZXNuJ3QgdGFrZSB0aGUgb3RoZXIgZG93bi4pXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBQRU5ESU5HX0JVTkRMRV9LRVkgaW4gY2hhbmdlcykgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbn0pO1xuXG4vLyBCYWNrZ3JvdW5kLXNpZGUgZmxvdyBjYW4gbXV0YXRlIHRoZSBwYXRpZW50T3ZlcnJpZGUgbWlkLXN5bmMgXHUyMDE0IG1vc3Rcbi8vIGltcG9ydGFudGx5IF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaSBzd2FwcyB0aGUgYXV0by1YWFhYWFhYWFxuLy8gcGxhY2Vob2xkZXIgZm9yIHRoZSByZWFsIE5ISSBjaWQuIFdpdGhvdXQgdGhpcyBsaXN0ZW5lciB0aGUgcG9wdXBcbi8vIGlucHV0cyBzdGF5ZWQgc3RhbGUsIHJlZnJlc2hQZW5kaW5nQnVuZGxlJ3MgcGF0aWVudC1tYXRjaCBjaGVja1xuLy8gdGhlbiBjb21wYXJlZCBvbGQgaW5wdXQgdmFsdWUgdnMuIGZyZXNoIGJ1bmRsZS5wYXRpZW50SWQgYW5kIGhpZFxuLy8gdGhlIGRvd25sb2FkIGJ1dHRvbi4gUmVsb2FkIHRoZSBvdmVycmlkZSBpbnRvIHRoZSBpbnB1dHMgd2hlbmV2ZXJcbi8vIHN0b3JhZ2UgY2hhbmdlcyBzbyBldmVyeSBkb3duc3RyZWFtIGd1YXJkIHNlZXMgY29uc2lzdGVudCB2YWx1ZXMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBjaGFuZ2VzLnBhdGllbnRPdmVycmlkZSkgbG9hZFBhdGllbnRPdmVycmlkZSgpO1xufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBcdTI0RDggSGVscC1pY29uIHRvb2x0aXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gT25lIHNoYXJlZCA8ZGl2PiBhcHBlbmRlZCB0byB0aGUgcG9wdXAgYm9keS4gT24gaG92ZXIgb2YgYW55XG4vLyAuaGVscC1pY29uLCB3ZSBjb3B5IGl0cyBkYXRhLXRpcCB0ZXh0IGFuZCBwb3NpdGlvbiB0aGUgdG9vbHRpcFxuLy8gaW5zaWRlIHRoZSBwb3B1cCwgY2xhbXBpbmcgdG8gaXRzIHZpZXdwb3J0IHNvIGl0IGNhbid0IGNsaXAgb2ZmXG4vLyBlaXRoZXIgZWRnZSByZWdhcmRsZXNzIG9mIHdoZXJlIHRoZSBpY29uIHNpdHMuIChDU1MgcHNldWRvLWVsZW1lbnRzXG4vLyBjYW4ndCBiZSBtZWFzdXJlZCwgc28gYSBwdXJlLUNTUyBhcHByb2FjaCBpbmV2aXRhYmx5IHBpY2tzIG9uZVxuLy8gYW5jaG9yIHNpZGUgYW5kIGJyZWFrcyBmb3IgaWNvbnMgb24gdGhlIG90aGVyIHNpZGUgb2YgdGhlIHBvcHVwLilcbmNvbnN0IF9oZWxwVGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbl9oZWxwVGlwLmNsYXNzTmFtZSA9IFwiaGVscC10b29sdGlwXCI7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9oZWxwVGlwKTtcblxuY29uc3QgVklFV1BPUlRfTUFSR0lOID0gNjsgLy8ga2VlcCB0aGlzIG1hbnkgcHggY2xlYXIgb2YgcG9wdXAgZWRnZXNcblxuZnVuY3Rpb24gX3Nob3dIZWxwVG9vbHRpcChpY29uKSB7XG4gIF9oZWxwVGlwLnRleHRDb250ZW50ID0gaWNvbi5kYXRhc2V0LnRpcCB8fCBpY29uLmdldEF0dHJpYnV0ZShcImRhdGEtdGlwXCIpIHx8IFwiXCI7XG4gIF9oZWxwVGlwLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpO1xuXG4gIC8vIE1lYXN1cmUgbm93IHRoYXQgY29udGVudCBpcyBzZXQuXG4gIGNvbnN0IGljb25SZWN0ID0gaWNvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgdGlwUmVjdCA9IF9oZWxwVGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB2aWV3cG9ydFcgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIGNvbnN0IHZpZXdwb3J0SCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cbiAgLy8gSG9yaXpvbnRhbDogcHJlZmVyIGNlbnRlcmVkIG9uIHRoZSBpY29uOyBjbGFtcCBpbnRvIFttYXJnaW4sIHZ3LXRpcC1tYXJnaW5dLlxuICBsZXQgbGVmdCA9IGljb25SZWN0LmxlZnQgKyBpY29uUmVjdC53aWR0aCAvIDIgLSB0aXBSZWN0LndpZHRoIC8gMjtcbiAgaWYgKGxlZnQgPCBWSUVXUE9SVF9NQVJHSU4pIGxlZnQgPSBWSUVXUE9SVF9NQVJHSU47XG4gIGlmIChsZWZ0ICsgdGlwUmVjdC53aWR0aCA+IHZpZXdwb3J0VyAtIFZJRVdQT1JUX01BUkdJTikge1xuICAgIGxlZnQgPSB2aWV3cG9ydFcgLSBWSUVXUE9SVF9NQVJHSU4gLSB0aXBSZWN0LndpZHRoO1xuICB9XG4gIC8vIFZlcnRpY2FsOiBwcmVmZXIgYWJvdmUgdGhlIGljb247IGZsaXAgYmVsb3cgaWYgdGhlcmUncyBubyByb29tIHVwIHRvcC5cbiAgbGV0IHRvcCA9IGljb25SZWN0LnRvcCAtIHRpcFJlY3QuaGVpZ2h0IC0gNjtcbiAgaWYgKHRvcCA8IFZJRVdQT1JUX01BUkdJTikgdG9wID0gaWNvblJlY3QuYm90dG9tICsgNjtcbiAgLy8gRmluYWwgc2FmZXR5OiBjbGFtcCBpbnRvIHZpZXdwb3J0IHNvIHZlcnkgbG9uZyB0b29sdGlwcyBjYW4ndCBibGVlZFxuICAvLyBvZmYgdGhlIGJvdHRvbSBlaXRoZXIuXG4gIGlmICh0b3AgKyB0aXBSZWN0LmhlaWdodCA+IHZpZXdwb3J0SCAtIFZJRVdQT1JUX01BUkdJTikge1xuICAgIHRvcCA9IE1hdGgubWF4KFZJRVdQT1JUX01BUkdJTiwgdmlld3BvcnRIIC0gVklFV1BPUlRfTUFSR0lOIC0gdGlwUmVjdC5oZWlnaHQpO1xuICB9XG5cbiAgX2hlbHBUaXAuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICBfaGVscFRpcC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xufVxuXG5mdW5jdGlvbiBfaGlkZUhlbHBUb29sdGlwKCkge1xuICBfaGVscFRpcC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbn1cblxuLy8gRGVsZWdhdGVkIGhvdmVyIGhhbmRsZXJzIFx1MjAxNCB3b3JrcyBmb3IgaWNvbnMgYWRkZWQgYWZ0ZXIgcG9wdXAgbG9hZCB0b29cbi8vIChlLmcuIHdoZW4gbW9kZSB0b2dnbGUgcmV2ZWFscyBiYWNrZW5kLW9ubHkgZmllbGRzKS5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+IHtcbiAgY29uc3QgaWNvbiA9IGUudGFyZ2V0LmNsb3Nlc3Q/LihcIi5oZWxwLWljb25cIik7XG4gIGlmIChpY29uKSBfc2hvd0hlbHBUb29sdGlwKGljb24pO1xufSk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKGUpID0+IHtcbiAgY29uc3QgaWNvbiA9IGUudGFyZ2V0LmNsb3Nlc3Q/LihcIi5oZWxwLWljb25cIik7XG4gIGlmIChpY29uKSBfaGlkZUhlbHBUb29sdGlwKCk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcbiAgYXdhaXQgbG9hZFNpZGViYXJFbmFibGVkKCk7XG4gIGF3YWl0IGxvYWRNYXNrTmFtZUVuYWJsZWQoKTtcblxuICAvLyBTZWVkIGxvY2FsIGJ1bmRsZSBzdGF0ZSBmcm9tIHN0b3JhZ2Ugc28gdGhlIGRhdGEtc3RhdGUgY2FyZCBpc1xuICAvLyBwb3B1bGF0ZWQgYXMgc29vbiBhcyB0aGUgcG9wdXAgcmVuZGVycyAobm8gZmxhc2ggb2YgXCJcdTY3MkFcdTc1MjJcdTc1MUZcIikuXG4gIGF3YWl0IF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xuXG4gIC8vIE9yZGVyIG1hdHRlcnM6IGxvYWRCYWNrZW5kVXJsIHBvcHVsYXRlcyBlbHMuYmFja2VuZFVybC52YWx1ZSwgd2hpY2hcbiAgLy8gbG9hZFN5bmNNb2RlKCkgcmVhZHMgdmlhIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpLiBSZXZlcnNlIHRoaXMgYW5kXG4gIC8vIHRoZSBhdXRvLXRlc3Qgc2VlcyBhbiBlbXB0eSBVUkwgYW5kIGZhbHNlbHkgcmVwb3J0cyBcIlx1NjcyQVx1OEEyRFx1NUI5QSBCYWNrZW5kIFVSTFwiXG4gIC8vIG9uIGV2ZXJ5IHBvcHVwIG9wZW4uXG4gIGF3YWl0IGxvYWRCYWNrZW5kVXJsKCk7XG4gIGF3YWl0IGxvYWRTeW5jTW9kZSgpO1xuICBhd2FpdCBsb2FkUGF0aWVudE92ZXJyaWRlKCk7XG4gIGF3YWl0IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG5cbiAgY29uc3QgdGFiID0gYXdhaXQgZ2V0QWN0aXZlVGFiKCk7XG4gIGlmICghdGFiPy51cmwpIHtcbiAgICBzZXRTdGF0dXMoXCJubyBhY3RpdmUgdGFiXCIsIFwiZXJyb3JcIik7XG4gICAgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFN5bmMgcmVxdWlyZXMgYmVpbmcgb24gYW4gTkhJIHRhYiBzbyBjb29raWVzL3Nlc3Npb24gYXJlIHVzYWJsZSBmcm9tXG4gIC8vIHRoZSBTVy4gRmxhZyB2aWEgZGF0YXNldCBzbyBfcmVmcmVzaEJ1dHRvblN0YXRlcyBjYW4gY29tYmluZSB0aGlzXG4gIC8vIHdpdGggdGhlIG1vZGUgKyBjb25uIHN0YXRlLiBXaGVuIG9mZi1OSEksIGFsc28gc3VyZmFjZSB0aGVcbiAgLy8gXCJcdUQ4M0RcdUREMTcgXHU5NThCXHU1NTVGXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU3NjdCXHU1MTY1XCIgYmFubmVyIHNvIHVzZXJzIGRvbid0IHdvbmRlciB3aGVyZSB0byBnby5cbiAgY29uc3Qgb25OaGkgPSBpc05oaVRhYih0YWIudXJsKTtcbiAgaWYgKG9uTmhpKSBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGVsc2UgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGkgPSBcIjFcIjtcbiAgaWYgKGVscy5vcGVuTmhpU2VjdGlvbikgZWxzLm9wZW5OaGlTZWN0aW9uLmhpZGRlbiA9IG9uTmhpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuXG4gIC8vIFJlLWF0dGFjaCB0byBhbnkgc3luYyB0aGF0J3MgY3VycmVudGx5IHJ1bm5pbmcgaW4gdGhlIHNlcnZpY2Ugd29ya2VyLlxuICAvLyBUaGlzIGlzIHdoYXQgbGV0cyB0aGUgdXNlciBjbG9zZSArIHJlb3BlbiB0aGUgcG9wdXAgbWlkLXN5bmMuXG4gIGF3YWl0IHJlZnJlc2hTeW5jU3RhdHVzRnJvbUJhY2tncm91bmQoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFN5bmNTdGF0dXNGcm9tQmFja2dyb3VuZCgpIHtcbiAgY29uc3Qgc3RhdHVzID0gYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImdldFN5bmNTdGF0dXNcIiB9KS5jYXRjaCgoKSA9PiBudWxsKTtcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgYXBwbHlTeW5jU3RhdHVzKHN0YXR1cyk7XG59XG5cbi8vIExhdGVzdCBzdGF0dXMgc25hcHNob3QgXHUyMDE0IGtlZXBpbmcgaXQgbGV0cyB0aGUgbGl2ZS1lbGFwc2VkIHRpY2tlclxuLy8gcmVwYWludCB0aGUgc2FtZSBwcm9ncmVzcyB0ZXh0IHdpdGggYW4gdXBkYXRlZCBgW05zXWAgcHJlZml4IGV2ZXJ5XG4vLyBzZWNvbmQgd2l0aG91dCBzcGFtbWluZyBjaHJvbWUuc3RvcmFnZSBmcm9tIHRoZSBzZXJ2aWNlIHdvcmtlci5cbmxldCBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbmxldCBfZWxhcHNlZFRpY2tlcklkID0gbnVsbDtcblxuZnVuY3Rpb24gX2ZtdEVsYXBzZWQobXMpIHtcbiAgaWYgKG1zIDwgNjBfMDAwKSByZXR1cm4gYCR7TWF0aC5mbG9vcihtcyAvIDEwMDApfXNgO1xuICByZXR1cm4gYCR7TWF0aC5mbG9vcihtcyAvIDYwXzAwMCl9bSR7TWF0aC5yb3VuZCgobXMgJSA2MF8wMDApIC8gMTAwMCl9c2A7XG59XG5cbmZ1bmN0aW9uIF9yZW5kZXJTdGF0dXMoKSB7XG4gIGNvbnN0IHN0YXR1cyA9IF9sYXRlc3RTdGF0dXM7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIGxldCB0ZXh0ID0gc3RhdHVzLnByb2dyZXNzIHx8IFwiKHN5bmMgXHU5MDMyXHU4ODRDXHU0RTJEKVwiO1xuICBpZiAoc3RhdHVzLnJ1bm5pbmcgJiYgc3RhdHVzLnN0YXJ0ZWQpIHtcbiAgICBjb25zdCBlbGFwc2VkID0gRGF0ZS5ub3coKSAtIHN0YXR1cy5zdGFydGVkO1xuICAgIHRleHQgPSBgXHUyM0YxICR7X2ZtdEVsYXBzZWQoZWxhcHNlZCl9IFx1MDBCNyAke3RleHR9YDtcbiAgfVxuICBjb25zdCBraW5kID0gc3RhdHVzLnJ1bm5pbmcgPyBcImluZm9cIiA6IChzdGF0dXMucGhhc2UgPT09IFwiZXJyb3JcIiA/IFwiZXJyb3JcIiA6IFwic3VjY2Vzc1wiKTtcbiAgY29uc3QgYnJlYWtkb3duID0gc3RhdHVzLnJ1bm5pbmcgPyBudWxsIDogc3RhdHVzLmJyZWFrZG93bjtcbiAgc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93bik7XG59XG5cbmZ1bmN0aW9uIGFwcGx5U3luY1N0YXR1cyhzdGF0dXMpIHtcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgX2xhdGVzdFN0YXR1cyA9IHN0YXR1cztcbiAgX3JlbmRlclN0YXR1cygpO1xuICBpZiAoc3RhdHVzLnJ1bm5pbmcpIHtcbiAgICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgZWxzLnN0b3BCdG4uaGlkZGVuID0gZmFsc2U7XG4gICAgaWYgKCFfZWxhcHNlZFRpY2tlcklkKSB7XG4gICAgICBfZWxhcHNlZFRpY2tlcklkID0gc2V0SW50ZXJ2YWwoX3JlbmRlclN0YXR1cywgMTAwMCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGVscy5zdG9wQnRuLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF9lbGFwc2VkVGlja2VySWQpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoX2VsYXBzZWRUaWNrZXJJZCk7XG4gICAgICBfZWxhcHNlZFRpY2tlcklkID0gbnVsbDtcbiAgICB9XG4gICAgLy8gUmUtZGVyaXZlIHN5bmMgYnV0dG9uIGVuYWJsZWQgc3RhdGUgZnJvbSBtb2RlL2Nvbm4vTkhJLXRhYiBpbnN0ZWFkXG4gICAgLy8gb2YgdW5jb25kaXRpb25hbGx5IGVuYWJsaW5nIFx1MjAxNCBrZWVwcyB0aGUgYnV0dG9uIGRpc2FibGVkIHdoZW4gd2VcbiAgICAvLyBrbm93IHdlIHNob3VsZG4ndCBzeW5jIChlLmcuIGJhY2tlbmQgZG93biwgb2ZmLU5ISSB0YWIpLlxuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgLy8gU3luYyBqdXN0IGZpbmlzaGVkIFx1MjAxNCBib3RoIHNpZGVzIG1heSBoYXZlIGNoYW5nZWQgKGJhY2tlbmQgZ290XG4gICAgLy8gbmV3IHJlc291cmNlcyBpbiBiYWNrZW5kIG1vZGUsIGxvY2FsIGJ1bmRsZSB3YXMgc3Rhc2hlZCBpbiBlaXRoZXJcbiAgICAvLyBtb2RlKS4gUmVmcmVzaCBkYXRhLXN0YXRlIGNhcmQgc28gdGhlIHVzZXIgc2VlcyB1cC10by1kYXRlIGNvdW50cy5cbiAgICBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcbiAgICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIgJiYgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIH1cbn1cblxuLy8gU3RvcCB0aGUgaW4tcHJvZ3Jlc3Mgc3luYy4gVHdvLXByb25nZWQgc28gaXQgd29ya3MgZXZlbiB3aGVuIHRoZVxuLy8gc2VydmljZSB3b3JrZXIgaGFzIGRpZWQ6ICgxKSB0ZWxsIHRoZSBTVyB0byBzZXQgaXRzIGNhbmNlbCBmbGFnLFxuLy8gKDIpIHdyaXRlIHN0b3JhZ2UgZGlyZWN0bHkgdG8gcnVubmluZzpmYWxzZSBzbyB0aGUgcG9wdXAgVUkgdW5mcmVlemVzXG4vLyBpbW1lZGlhdGVseSBldmVuIGlmIHRoZSBTVyBtZXNzYWdlIGNhbid0IGJlIGRlbGl2ZXJlZC5cbmFzeW5jIGZ1bmN0aW9uIHN0b3BTeW5jKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgcHJvZ3Jlc3M6IFwiXHUyNkQ0IFx1NTA1Q1x1NkI2Mlx1NEUyRFx1RkYwQ1x1NkI2M1x1NTcyOFx1NkUwNVx1OTY2NFx1OTBFOFx1NTIwNlx1OENDN1x1NjU5OVx1MjAyNlwiLFxuICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICB0czogRGF0ZS5ub3coKSxcbiAgICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9KTtcbiAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NTA1Q1x1NkI2Mlx1NEUyRFx1RkYwQ1x1NkI2M1x1NTcyOFx1NkUwNVx1OTY2NFx1OTBFOFx1NTIwNlx1OENDN1x1NjU5OVx1MjAyNlwiLCBcImluZm9cIik7XG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzdG9wU3luY1wiIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgZWxzLnN0b3BCdG4uaGlkZGVuID0gdHJ1ZTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbn1cblxuLy8gTGl2ZSBwcm9ncmVzcyB1cGRhdGVzIFx1MjAxNCBsaXN0ZW4gb24gY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkIHNvIHdlIGdldFxuLy8gZXZlcnkgdXBkYXRlIHRoZSBTVyB3cml0ZXMsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgU1cncyBicm9hZGNhc3Rcbi8vIHNlbmRNZXNzYWdlIHJlYWNoZWQgdXMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBjaGFuZ2VzLnN5bmNTdGF0dXMpIHtcbiAgICBhcHBseVN5bmNTdGF0dXMoY2hhbmdlcy5zeW5jU3RhdHVzLm5ld1ZhbHVlKTtcbiAgfVxufSk7XG5cbi8vIChMZWdhY3kgaW4tbWVtb3J5IGJyb2FkY2FzdCBzdGlsbCBsaXN0ZW5lZCB0byBhcyBhIGJhY2t1cC4pXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZykgPT4ge1xuICBpZiAobXNnPy50eXBlID09PSBcInN5bmNQcm9ncmVzc1wiKSB7XG4gICAgYXBwbHlTeW5jU3RhdHVzKG1zZy5zdGF0dXMpO1xuICB9XG59KTtcblxuLy8gUHJlLWZsaWdodCBkZXRlY3Rpb24gZm9yIE5ISSBsb2dpbiBzdGF0ZS4gVHdvIHNpZ25hbHMgKGVpdGhlciB0cmlnZ2Vycyk6XG4vLyAgMS4gVVJMIGlzIGluIE5ISSBhdXRoIG5hbWVzcGFjZSAoSUhLRTMwOTlTeHgpIFx1MjAxNCBsb2dpbiAvIElDIGNhcmQgcGFnZXNcbi8vICAyLiBQYWdlIGNvbnRhaW5zIGEgcGFzc3dvcmQgaW5wdXQgb3Iga25vd24gbG9nZ2VkLW91dCBwaHJhc2VzXG5hc3luYyBmdW5jdGlvbiBpc09uTmhpTG9naW5QYWdlKHRhYklkLCB1cmwpIHtcbiAgaWYgKHVybD8ucGF0aG5hbWUgJiYgL0lIS0UzMDk5Ly50ZXN0KHVybC5wYXRobmFtZSkpIHJldHVybiB0cnVlO1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXScpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY29uc3QgdGV4dCA9IChkb2N1bWVudC5ib2R5Py5pbm5lclRleHQgfHwgXCJcIikudHJpbSgpO1xuICAgICAgICBjb25zdCBwaHJhc2VzID0gW1xuICAgICAgICAgIFwiXHU4QUNCXHU0RjdGXHU3NTI4XHU1MDY1XHU0RkREXHU1MzYxXCIsIFwiXHU4QUNCXHU2M0QyXHU1MTY1XHU1MDY1XHU0RkREXHU1MzYxXCIsIFwiXHU4QUNCXHU2M0QyXHU1MTY1XHU2MEE4XHU3Njg0XHU1MDY1XHU0RkREXHU1MzYxXCIsXG4gICAgICAgICAgXCJcdTc2N0JcdTUxNjVcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0FcIiwgXCJcdTc2N0JcdTUxNjVcdTU5MzFcdTY1NTdcIiwgXCJcdThBQ0JcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcIixcbiAgICAgICAgICBcIlNlc3Npb24gXHU1REYyXHU5MDNFXHU2NjQyXCIsIFwic2Vzc2lvbiBcdTVERjJcdTkwM0VcdTY2NDJcIiwgXCJcdTVERjJcdTkwM0VcdTY2NDJcIixcbiAgICAgICAgICBcIlx1OEFDQlx1NEVFNVx1NTA2NVx1NEZERFx1NTM2MVx1NzY3Qlx1NTE2NVwiLFxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gcGhyYXNlcy5zb21lKChwKSA9PiB0ZXh0LmluY2x1ZGVzKHApKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gXHUyNkExIE5ISSBBUEktZGlyZWN0IHN5bmMgXHUyMDE0IHByaW1hcnkgcGF0aC4gSGl0cyBOSEkncyB1bmRlcmx5aW5nIEpTT05cbi8vIGVuZHBvaW50cyBpbiBwYXJhbGxlbCBhbmQgcG9zdHMgYWRhcHRlZCBpdGVtcyB0byAvc3luYy91cGxvYWQtc3RydWN0dXJlZC5cbi8vIFJlcXVpcmVzIHBhdGllbnRfb3ZlcnJpZGUgdG8gYmUgZmlsbGVkLlxuLy8gQ29udmVydCBhIGJhY2tlbmQgVVJMIFx1MjE5MiB0aGUgb3JpZ2luLXBhdHRlcm4gQ2hyb21lIHdhbnRzIGZvciBwZXJtaXNzaW9uXG4vLyByZXF1ZXN0cy4gXCJodHRwOi8vMTkyLjE2OC4xLjU6ODAxMFwiIFx1MjE5MiBcImh0dHA6Ly8xOTIuMTY4LjEuNTo4MDEwLypcIi5cbi8vIFJldHVybnMgbnVsbCB3aGVuIHRoZSBVUkwgaXNuJ3QgcGFyc2VhYmxlIHNvIHRoZSBjYWxsZXIgY2FuIHNob3J0LWNpcmN1aXQuXG5mdW5jdGlvbiBfb3JpZ2luUGF0dGVybkZvcih1cmwpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gbmV3IFVSTCh1cmwpO1xuICAgIHJldHVybiBgJHt1LnByb3RvY29sfS8vJHt1Lmhvc3R9LypgO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBCYWNrZW5kLW1vZGUgcHJlLWZsaWdodDogZW5zdXJlIHRoZSBleHRlbnNpb24gaGFzIGhvc3QgcGVybWlzc2lvbiBmb3Jcbi8vIHRoZSB1c2VyLWNvbmZpZ3VyZWQgYmFja2VuZCBVUkwuIExvY2FsaG9zdCAvIDEyNy4wLjAuMSBhcmUgY292ZXJlZCBieVxuLy8gdGhlIGRlZmF1bHQgbWFuaWZlc3QgaG9zdF9wZXJtaXNzaW9uczsgcmVtb3RlIC8gTEFOIC8gcHJvZHVjdGlvbiBVUkxzXG4vLyBuZWVkIGEgb25lLXRpbWUgdXNlciBncmFudC4gTXVzdCBydW4gZnJvbSBhIHVzZXIgZ2VzdHVyZSAoYnV0dG9uIGNsaWNrKS5cbmFzeW5jIGZ1bmN0aW9uIGVuc3VyZUJhY2tlbmRQZXJtaXNzaW9uKGJhY2tlbmRVcmwpIHtcbiAgY29uc3QgcGF0dGVybiA9IF9vcmlnaW5QYXR0ZXJuRm9yKGJhY2tlbmRVcmwpO1xuICBpZiAoIXBhdHRlcm4pIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgQmFja2VuZCBVUkwgXHU3MTIxXHU2Q0Q1XHU4OUUzXHU2NzkwOiAke2JhY2tlbmRVcmx9YCB9O1xuICBjb25zdCBhbHJlYWR5ID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLmNvbnRhaW5zKHsgb3JpZ2luczogW3BhdHRlcm5dIH0pO1xuICBpZiAoYWxyZWFkeSkgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgbGV0IGdyYW50ZWQ7XG4gIHRyeSB7XG4gICAgZ3JhbnRlZCA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5yZXF1ZXN0KHsgb3JpZ2luczogW3BhdHRlcm5dIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCByZWFzb246IGBcdTZCMEFcdTk2NTBcdThBQ0JcdTZDNDJcdTU5MzFcdTY1NTc6ICR7ZS5tZXNzYWdlfWAgfTtcbiAgfVxuICByZXR1cm4gZ3JhbnRlZFxuICAgID8geyBvazogdHJ1ZSB9XG4gICAgOiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgXHU2NzJBXHU2Mzg4XHU2QjBBXHU5MDIzXHU3RERBXHU1MjMwICR7cGF0dGVybn0gXHUyMDE0IFx1NTNENlx1NkQ4OGAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYXBpU3luY05oaSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKCFvdikge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdThBQ0JcdTUxNDhcdTU4NkJcdTVCRUJcdTRFMEFcdTY1QjlcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcdUZGMDhcdThFQUJcdTUyMDZcdThCNDlcdTVCNTdcdTg2NUZcdUZGMDlcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBQcmUtZmxpZ2h0OiBjaGVjayB3ZSdyZSBvbiBhbiBOSEkgdGFiIHNvIGNvb2tpZXMgYXJlIHVzYWJsZSBmcm9tIFNXLlxuICBjb25zdCB0YWIgPSBhd2FpdCBnZXRBY3RpdmVUYWIoKTtcbiAgbGV0IHVybDtcbiAgdHJ5IHsgdXJsID0gbmV3IFVSTCh0YWIudXJsKTsgfSBjYXRjaCB7IHNldFN0YXR1cyhcImFjdGl2ZSB0YWIgaGFzIG5vIFVSTFwiLCBcImVycm9yXCIpOyByZXR1cm47IH1cbiAgY29uc3Qgb25Mb2dpbiA9IGF3YWl0IGlzT25OaGlMb2dpblBhZ2UodGFiLmlkLCB1cmwpO1xuICBpZiAob25Mb2dpbikge1xuICAgIHNldFN0YXR1cyhcIlx1RDgzRFx1REQxMiBcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgXHUyMDE0IFx1OEFDQlx1NTE0OFx1NzY3Qlx1NTE2NVx1NUY4Q1x1NTE4RFx1OEE2NlwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJhY2tlbmQgbW9kZTogcmUtdmVyaWZ5IGNvbm5lY3Rpdml0eSByaWdodCBoZXJlIGV2ZW4gaWYgdGhlIGJhbm5lclxuICAvLyBsYXN0IHNhaWQgb2suIEJldHdlZW4gdGhlIHByZXZpb3VzIGNoZWNrIGFuZCB0aGlzIGNsaWNrIHRoZSB1c2VyXG4gIC8vIG1heSBoYXZlIHN0b3BwZWQgZG9ja2VyOyB3aXRob3V0IGEgZnJlc2ggcHJvYmUgd2UnZCBzdGFydCBhbiB1cGxvYWRcbiAgLy8gdGhhdCBmYWlscyBtaWQtZmxpZ2h0IGFmdGVyIHBhcnRpYWwgZGF0YSBoYXMgaGl0IChvciBmYWlsZWQgdG8gaGl0KVxuICAvLyB0aGUgYmFja2VuZC4gQ2hlYXAgKFx1MjI2NDVzKSBhbmQgc2F2ZXMgYSBsb3Qgb2YgY29uZnVzaW9uLlxuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICBjb25zdCBvayA9IGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICAgIGlmICghb2spIHtcbiAgICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTVGOENcdTdBRUZcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTcgXHUyMDE0IFx1OEFDQlx1NzcwQlx1OTgwMlx1OTBFOCBiYW5uZXIgXHU3Njg0XHU4QUFBXHU2NjBFXCIsIFwiZXJyb3JcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgc3luY1N0YXR1czoge1xuICAgICAgcnVubmluZzogdHJ1ZSxcbiAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIixcbiAgICAgIHBoYXNlOiBcInN0YXJ0aW5nXCIsIHN0YXJ0ZWQ6IERhdGUubm93KCksIHRzOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0pO1xuICBzZXRTdGF0dXMoXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcblxuICAvLyBDb21wdXRlIGRhdGUgcmFuZ2UgZnJvbSB0aGUgZHJvcGRvd24uIFwiMVwiID0gTkhJJ3MgZGVmYXVsdCB3aW5kb3c7XG4gIC8vIGFueXRoaW5nIGVsc2UgaXMgXCJ0b2RheSBiYWNrIE4geWVhcnNcIi4gSGVscGVyIGluc2lkZSBiYWNrZ3JvdW5kLmpzXG4gIC8vIGNvbnZlcnRzIHRvIFx1NkMxMVx1NTcwQiBmb3IgTkhJJ3MgQVBJLlxuICBjb25zdCByYW5nZVNlbCA9IGVscy5hcGlTeW5jUmFuZ2U/LnZhbHVlIHx8IFwiM1wiO1xuICBsZXQgZGF0ZVJhbmdlID0gbnVsbDtcbiAgY29uc3QgUkFOR0VfTEFCRUxTID0ge1xuICAgIFwiMVwiOiAgIFwiXHU2NzAwXHU4RkQxIDEgXHU1RTc0XCIsXG4gICAgXCIzXCI6ICAgXCJcdTY3MDBcdThGRDEgMyBcdTVFNzRcIixcbiAgICBcIjVcIjogICBcIlx1NjcwMFx1OEZEMSA1IFx1NUU3NFwiLFxuICAgIFwiMTBcIjogIFwiXHU2NzAwXHU4RkQxIDEwIFx1NUU3NFwiLFxuICAgIFwiYWxsXCI6IFwiXHU1MTY4XHU5MEU4XHU2Qjc3XHU1M0YyXHU3RDAwXHU5MzA0XCIsXG4gIH07XG4gIGNvbnN0IGRhdGVSYW5nZUxhYmVsID0gUkFOR0VfTEFCRUxTW3JhbmdlU2VsXSB8fCBgXHU2NzAwXHU4RkQxICR7cmFuZ2VTZWx9IFx1NUU3NGA7XG4gIGlmIChyYW5nZVNlbCAhPT0gXCIxXCIpIHtcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZW5kID0gdG9kYXkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgbGV0IHN0YXJ0O1xuICAgIGlmIChyYW5nZVNlbCA9PT0gXCJhbGxcIikge1xuICAgICAgc3RhcnQgPSBcIjIwMDEtMDEtMDFcIjsgIC8vIFx1NkMxMVx1NTcwQiA5MCBcdTIwMTQgZmFyIGVub3VnaCBiYWNrIGZvciBhbnkgY2xpbmljYWwgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB5ZWFycyA9IHBhcnNlSW50KHJhbmdlU2VsLCAxMCk7XG4gICAgICBjb25zdCBzID0gbmV3IERhdGUodG9kYXkpO1xuICAgICAgcy5zZXRGdWxsWWVhcihzLmdldEZ1bGxZZWFyKCkgLSB5ZWFycyk7XG4gICAgICBzdGFydCA9IHMudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICAgIGRhdGVSYW5nZSA9IHsgc3RhcnQsIGVuZCB9O1xuICB9XG5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIHR5cGU6IFwic3RhcnROaGlBcGlTeW5jXCIsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdGFiSWQ6IHRhYi5pZCxcbiAgICAgIG1vZGU6IGN1cnJlbnRNb2RlKCksXG4gICAgICBiYWNrZW5kOiBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCksXG4gICAgICBzeW5jQXBpS2V5OiBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCksXG4gICAgICBuaGlCYXNlOiBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHdcIixcbiAgICAgIHBhdGllbnRPdmVycmlkZTogb3YsXG4gICAgICBkYXRlUmFuZ2UsXG4gICAgICBkYXRlUmFuZ2VMYWJlbCxcbiAgICB9LFxuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxhdW5jaCgpIHtcbiAgY29uc3QgYmFja2VuZCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKTtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgcmF3SWQgPSBvdj8uaWRfbm87XG4gIGNvbnN0IHNtYXJ0QXBwTGF1bmNoID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKSB8fCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIGlmICghcmF3SWQpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTZDOTJcdTY3MDlcdTc1QzVcdTRFQkFcdThFQUJcdTUyMDZcdThCNDlcdTVCNTdcdTg2NUZcdTUzRUZcdTRFRTUgbGF1bmNoIFx1MjAxNCBcdThBQ0JcdTUxNDhcdTU4NkJcdTVCRUJcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gQmFja2VuZCB0cmFja3MgUGF0aWVudCB1bmRlciBpdHMgaGFzaGVkIEZISVIgaWQsIG5vdCB0aGUgcmF3IG5hdGlvbmFsIElELlxuICBjb25zdCBwYXRpZW50SWQgPSBkZXJpdmVQYXRpZW50SWQocmF3SWQpO1xuICAvLyBSZS10ZXN0IGNvbm5lY3Rpb24gZXZlbiBpZiBiYW5uZXIgc2hvd3Mgb2sgXHUyMDE0IGJhY2tlbmQgbWF5IGhhdmUgZ29uZVxuICAvLyBkb3duIHNpbmNlIHRoZSBsYXN0IHByb2JlLlxuICBjb25zdCBvayA9IGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICBpZiAoIW9rKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NUY4Q1x1N0FFRlx1OTAyM1x1N0REQVx1NTkzMVx1NjU1NyBcdTIwMTQgXHU4QUNCXHU3NzBCXHU5ODAyXHU5MEU4IGJhbm5lciBcdTc2ODRcdThBQUFcdTY2MEVcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgc2V0U3RhdHVzKFwiXHU1RUZBXHU3QUNCIGxhdW5jaCBjb250ZXh0XHUyMDI2XCIsIFwiaW5mb1wiKTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zbWFydC9sYXVuY2gtY29udGV4dGAsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHBhdGllbnRfaWQ6IHBhdGllbnRJZCB9KSxcbiAgICB9KTtcbiAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKGAke3Jlcy5zdGF0dXN9OiAke2F3YWl0IHJlcy50ZXh0KCl9YCk7XG4gICAgY29uc3QgeyBsYXVuY2ggfSA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7IGlzczogYCR7YmFja2VuZH0vZmhpcmAsIGxhdW5jaCB9KTtcbiAgICAvLyBBcHBlbmQgaXNzICsgbGF1bmNoIHBhcmFtcywgcmVzcGVjdGluZyBhbnkgZXhpc3RpbmcgcXVlcnkgc3RyaW5nLlxuICAgIGNvbnN0IHNlcCA9IHNtYXJ0QXBwTGF1bmNoLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCI7XG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBgJHtzbWFydEFwcExhdW5jaH0ke3NlcH0ke3BhcmFtc31gIH0pO1xuICAgIHdpbmRvdy5jbG9zZSgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgc2V0U3RhdHVzKGBcdTI3NEMgTGF1bmNoIFx1NTkzMVx1NjU1N1x1RkYxQSR7ZS5tZXNzYWdlfWAsIFwiZXJyb3JcIik7XG4gIH1cbn1cblxuZWxzLnN5bmNBcGlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFwaVN5bmNOaGkpO1xuZWxzLnN0b3BCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0b3BTeW5jKTtcbmVscy5vdlNhdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNhdmVQYXRpZW50T3ZlcnJpZGUpO1xuZWxzLm92Q2xlYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsZWFyUGF0aWVudE92ZXJyaWRlKTtcbltlbHMub3ZJZE5vLCBlbHMub3ZOYW1lLCBlbHMub3ZCaXJ0aERhdGUsIGVscy5vdkdlbmRlcl0uZm9yRWFjaCgoZWwpID0+XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KVxuKTtcbmVscy5sYXVuY2hCdG4uYWRkRXZlbnRM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LE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxP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QUU7QUFDakUsWUFBTSxFQUFFLFFBQUFDLFFBQU8sSUFBSSxNQUFNLElBQUksS0FBSztBQUNsQyxZQUFNLFNBQVMsSUFBSSxnQkFBZ0IsRUFBRSxLQUFLLEdBQUcsT0FBTyxTQUFTLFFBQUFBLFFBQU8sQ0FBQztBQUVyRSxZQUFNLE1BQU0sZUFBZSxTQUFTLEdBQUcsSUFBSSxNQUFNO0FBQ2pELGFBQU8sS0FBSyxPQUFPLEVBQUUsS0FBSyxHQUFHLGNBQWMsR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUM7QUFDOUQsYUFBTyxNQUFNO0FBQUEsSUFDZixTQUFTLEdBQUc7QUFDVixnQkFBVSxtQ0FBZSxFQUFFLE9BQU8sSUFBSSxPQUFPO0FBQUEsSUFDL0M7QUFBQSxFQUNGO0FBRUEsTUFBSSxXQUFXLGlCQUFpQixTQUFTLFVBQVU7QUFDbkQsTUFBSSxRQUFRLGlCQUFpQixTQUFTLFFBQVE7QUFDOUMsTUFBSSxVQUFVLGlCQUFpQixTQUFTLG1CQUFtQjtBQUMzRCxNQUFJLFdBQVcsaUJBQWlCLFNBQVMsb0JBQW9CO0FBQzdELEdBQUMsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLGFBQWEsSUFBSSxRQUFRLEVBQUU7QUFBQSxJQUFRLENBQUMsT0FDL0QsR0FBRyxpQkFBaUIsU0FBUyxzQkFBc0I7QUFBQSxFQUNyRDtBQUNBLE1BQUksVUFBVSxpQkFBaUIsU0FBUyxNQUFNO0FBQzlDLE9BQUs7IiwKICAibmFtZXMiOiBbImNyeXB0byIsICJCdWZmZXIiLCAiYmxvY2tzIiwgImV4cG9ydHMiLCAibGF1bmNoIl0KfQo=
