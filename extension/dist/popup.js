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
    wizardStepper: document.getElementById("wizard-stepper"),
    resultZone: document.getElementById("result-zone"),
    summaryCard: document.getElementById("summary-card"),
    launchBlock: document.querySelector(".launch-block")
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
    if (els.patientOverrideDetails) {
      els.patientOverrideDetails.open = !_step2Confirmed;
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
    _markStep2Confirmed(true);
    refreshOverrideSummary();
    _refreshButtonStates();
    if (_wizardInitialized) _maybeAutoAdvance();
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
    _markStep2Confirmed(false);
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
    if (els.summaryCard) {
      els.summaryCard.hidden = !(hasStatus || dataStateShown);
    }
    if (els.launchBlock) {
      els.launchBlock.hidden = !launchUsable;
    }
    els.resultZone.hidden = !(hasStatus || bundleShown || dataStateShown || launchUsable);
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
    els.bundleMeta.textContent = "";
    const fname = document.createElement("div");
    fname.className = "bundle-filename";
    fname.textContent = pending.filename;
    fname.title = pending.filename;
    const sizeAge = document.createElement("div");
    sizeAge.className = "bundle-sizeage";
    sizeAge.textContent = `${_fmtBytes(pending.bytes || 0)}${ago ? ` \xB7 ${ago}` : ""}`;
    els.bundleMeta.appendChild(fname);
    els.bundleMeta.appendChild(sizeAge);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIwNzQwODY2YCBcdTIxOTIgYFAxMjA3NCoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpKSB7XG4gICAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICAgIHJldHVybiBsb2luYztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKExPSU5DX01BUCkpIHtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrZXkudG9Mb3dlckNhc2UoKSl9YCkudGVzdChjb21iaW5lZCkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tYmluZWQuaW5jbHVkZXMoa2V5LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICByZXR1cm4gbG9pbmM7XG4gICAgfVxuICB9XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQsIG1hc2tJZCwgbWFza05hbWUgfSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgREVGQVVMVF9CQUNLRU5EID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMTBcIjtcbi8vIERlZmF1bHQgU01BUlQgYXBwIGZvciBhIGZyZXNoIGluc3RhbGwuIFVzZXJzIGNhbiBvdmVycmlkZSB2aWFcbi8vIHRoZSAnXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgU01BUlQgQXBwIExhdW5jaCBVUkwnIGZpZWxkOyB0aGUgdmFsdWUgaXNcbi8vIHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlciBgc21hcnRBcHBMYXVuY2hVcmxgLlxuY29uc3QgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpci9zbWFydC9sYXVuY2hcIjtcblxuLy8gVHJ1ZSBpZiB0aGUgYWN0aXZlIHRhYiBpcyBhbiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHBhZ2UgKHJlYWwgc2l0ZSkuXG5mdW5jdGlvbiBpc05oaVRhYih1cmwpIHtcbiAgaWYgKCF1cmwpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IG5ldyBVUkwodXJsKSA6IHVybDtcbiAgICByZXR1cm4gL215aGVhbHRoYmFua1xcLm5oaVxcLmdvdlxcLnR3Ly50ZXN0KHUuaG9zdG5hbWUpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgREVGQVVMVF9NT0RFID0gXCJsb2NhbFwiO1xuXG5jb25zdCBlbHMgPSB7XG4gIG1vZGVSYWRpb3M6ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzeW5jLW1vZGVcIl0nKSxcbiAgYmFja2VuZFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXVybFwiKSxcbiAgc3luY0FwaUtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWFwaS1rZXlcIiksXG4gIHNtYXJ0QXBwVXJsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNtYXJ0LWFwcC11cmxcIiksXG4gIHN5bmNBcGlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGktYnRuXCIpLFxuICBzeW5jQmxvY2tlZFJlYXNvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWJsb2NrZWQtcmVhc29uXCIpLFxuICBhcGlTeW5jUmFuZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBpLXN5bmMtcmFuZ2VcIiksXG4gIHN0b3BCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIiksXG4gIG92SWRObzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1pZC1ub1wiKSxcbiAgb3ZOYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LW5hbWVcIiksXG4gIG92QmlydGhEYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWJpcnRoLWRhdGVcIiksXG4gIG92R2VuZGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWdlbmRlclwiKSxcbiAgb3ZTYXZlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LXNhdmUtYnRuXCIpLFxuICBvdkNsZWFyQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWNsZWFyLWJ0blwiKSxcbiAgb3ZTdW1tYXJ5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJyaWRlLXN1bW1hcnlcIiksXG4gIHBhdGllbnRPdmVycmlkZURldGFpbHM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF0aWVudC1vdmVycmlkZVwiKSxcbiAgbGF1bmNoQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdW5jaC1idG5cIiksXG4gIHN0YXR1czogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGF0dXNcIiksXG4gIGRhc2hib2FyZExpbms6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFzaGJvYXJkLWxpbmtcIiksXG4gIHBlbmRpbmdCdW5kbGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGVuZGluZy1idW5kbGVcIiksXG4gIGRvd25sb2FkQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvd25sb2FkLWJ1bmRsZS1idG5cIiksXG4gIGNsZWFyQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyLWJ1bmRsZS1idG5cIiksXG4gIGJ1bmRsZU1ldGE6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVuZGxlLW1ldGFcIiksXG4gIGNvbm5CYW5uZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1iYW5uZXJcIiksXG4gIGNvbm5TZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tc2VjdGlvblwiKSxcbiAgY29ubk1pbmk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1taW5pXCIpLFxuICBjb25uTXNnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tbXNnXCIpLFxuICBjb25uUmV0cnlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1yZXRyeS1idG5cIiksXG4gIGNvbm5IZWxwOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4taGVscFwiKSxcbiAgZGF0YVN0YXRlU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRhLXN0YXRlLXNlY3Rpb25cIiksXG4gIGJhY2tlbmRTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXN0YXRlXCIpLFxuICBsb2NhbFN0YXRlUm93OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvY2FsLXN0YXRlLXJvd1wiKSxcbiAgbG9jYWxTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2NhbC1zdGF0ZVwiKSxcbiAgcHVzaExvY2FsQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB1c2gtbG9jYWwtYnRuXCIpLFxuICBzeW5jU3RhdHVzSGludDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLXN0YXR1cy1oaW50XCIpLFxuICBzaWRlYmFyRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLWVuYWJsZWRcIiksXG4gIG1hc2tOYW1lRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXNrLW5hbWUtZW5hYmxlZFwiKSxcbiAgb3Blbk5oaVNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1uaGktc2VjdGlvblwiKSxcbiAgb3Blbk5oaUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW5oaS1idG5cIiksXG4gIG5oaU5lZWRzTG9naW5TZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5oaS1uZWVkcy1sb2dpbi1zZWN0aW9uXCIpLFxuICBsb2dpbk9rU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1vay1zZWN0aW9uXCIpLFxuICB3aXphcmRTdGVwcGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndpemFyZC1zdGVwcGVyXCIpLFxuICByZXN1bHRab25lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdC16b25lXCIpLFxuICBzdW1tYXJ5Q2FyZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdW1tYXJ5LWNhcmRcIiksXG4gIGxhdW5jaEJsb2NrOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxhdW5jaC1ibG9ja1wiKSxcbn07XG5cbmNvbnN0IE5ISV9MQU5ESU5HID0gXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3L0lIS0UzMDAwXCI7XG5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcblxuLy8gUGVyc2lzdGVkLXN0YXRlIGtleXMuIEJhY2tlbmQgVVJMIGFuZCBBUEkga2V5IHBlcnNpc3QgYWNyb3NzIGJyb3dzZXIgc2Vzc2lvbnMuXG5hc3luYyBmdW5jdGlvbiBsb2FkQmFja2VuZFVybCgpIHtcbiAgY29uc3QgeyBiYWNrZW5kVXJsLCBzeW5jQXBpS2V5LCBzbWFydEFwcExhdW5jaFVybCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFxuICAgIFtcImJhY2tlbmRVcmxcIiwgXCJzeW5jQXBpS2V5XCIsIFwic21hcnRBcHBMYXVuY2hVcmxcIl1cbiAgKTtcbiAgZWxzLmJhY2tlbmRVcmwudmFsdWUgPSBiYWNrZW5kVXJsIHx8IERFRkFVTFRfQkFDS0VORDtcbiAgZWxzLnN5bmNBcGlLZXkudmFsdWUgPSBzeW5jQXBpS2V5IHx8IFwiXCI7XG4gIGVscy5zbWFydEFwcFVybC52YWx1ZSA9IHNtYXJ0QXBwTGF1bmNoVXJsIHx8IERFRkFVTFRfU01BUlRfQVBQX0xBVU5DSDtcbiAgZWxzLmRhc2hib2FyZExpbmsuaHJlZiA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnJlcGxhY2UoLzo4MDEwLiokLywgXCI6MzAxMFwiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBhdGllbnQgb3ZlcnJpZGUgKG1hbnVhbCBOSEkgaWRlbnRpdHkpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBkb2Vzbid0IGV4cG9zZSB0aGUgdXNlcidzIG5hdGlvbmFsIElEIGluIHRoZSBVUkwuIFRoZSB1c2VyXG4vLyBmaWxscyB0aGVzZSBvbmNlIGFuZCB0aGV5J3JlIHNlbnQgd2l0aCBldmVyeSB1cGxvYWQgY2FsbCB1bnRpbCBjbGVhcmVkLlxuXG5hc3luYyBmdW5jdGlvbiBsb2FkUGF0aWVudE92ZXJyaWRlKCkge1xuICBjb25zdCB7IHBhdGllbnRPdmVycmlkZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwicGF0aWVudE92ZXJyaWRlXCIpO1xuICBpZiAocGF0aWVudE92ZXJyaWRlKSB7XG4gICAgZWxzLm92SWROby52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5pZF9ubyB8fCBcIlwiO1xuICAgIGVscy5vdk5hbWUudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiO1xuICAgIGVscy5vdkJpcnRoRGF0ZS52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5iaXJ0aF9kYXRlIHx8IFwiXCI7XG4gICAgZWxzLm92R2VuZGVyLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmdlbmRlciB8fCBcIlwiO1xuICB9XG4gIC8vIEEgc3RvcmVkIG92ZXJyaWRlIHdpdGggYm90aCByZXF1aXJlZCBmaWVsZHMgY291bnRzIGFzIFwic3RlcCAyXG4gIC8vIGFscmVhZHkgY29uZmlybWVkXCIgXHUyMDE0IHJldHVybmluZyB1c2VyIHNob3VsZG4ndCBiZSBmb3JjZWQgdG8gY2xpY2tcbiAgLy8gXHUyNzEzIFx1NzhCQVx1NUI5QSBhZ2FpbiB0byBhZHZhbmNlIHRoZSB3aXphcmQuXG4gIF9tYXJrU3RlcDJDb25maXJtZWQoXG4gICAgISEocGF0aWVudE92ZXJyaWRlPy5nZW5kZXIgJiYgcGF0aWVudE92ZXJyaWRlPy5iaXJ0aF9kYXRlKSxcbiAgKTtcbiAgLy8gQXV0by1leHBhbmQgdGhlIGNhcmQgd2hlbmV2ZXIgdGhlIHJlcXVpcmVkIGZpZWxkcyBhcmVuJ3QgYWxyZWFkeVxuICAvLyBzYXZlZCBcdTIwMTQgY292ZXJzIGZpcnN0LXRpbWUgQU5EIHJldHVybmluZyB1c2VycyB3aG9zZSBwcmV2aW91cyBzYXZlXG4gIC8vIHdhcyBpbmNvbXBsZXRlLiBPbmNlIHJlcXVpcmVkIGZpZWxkcyBhcmUgc2F2ZWQsIGNvbGxhcHNlIHRvIGdpdmVcbiAgLy8gYnJlYXRoaW5nIHJvb20uXG4gIGlmIChlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscykge1xuICAgIGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzLm9wZW4gPSAhX3N0ZXAyQ29uZmlybWVkO1xuICB9XG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aWVudE92ZXJyaWRlKCkge1xuICAvLyBSZXR1cm5zIHtpZF9ubywgbmFtZSwgYmlydGhfZGF0ZSwgZ2VuZGVyfS5cbiAgLy8gaWRfbm8gaXMgb3B0aW9uYWwgaW4gdGhlIFVJOyBpZiBibGFuayB0aGUgcG9wdXAgYXV0by1nZW5lcmF0ZXMgYW5cbiAgLy8gXCJhdXRvLVhYWFhYWFhYXCIgaWRlbnRpZmllciBhdCBzYXZlIHRpbWUuIFJldHVybnMgbnVsbCB3aGVuIGJvdGhcbiAgLy8gaWRfbm8gYW5kIG5hbWUgYXJlIGVtcHR5IChub3RoaW5nIGlkZW50aWZ5aW5nIHRvIHNhdmUpLlxuICBjb25zdCBpZF9ubyA9IGVscy5vdklkTm8udmFsdWUudHJpbSgpO1xuICBjb25zdCBuYW1lID0gZWxzLm92TmFtZS52YWx1ZS50cmltKCk7XG4gIGlmICghaWRfbm8gJiYgIW5hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBvdXQgPSBpZF9ubyA/IHsgaWRfbm8gfSA6IHt9O1xuICBpZiAobmFtZSkgb3V0Lm5hbWUgPSBuYW1lO1xuICBjb25zdCBiaXJ0aF9kYXRlID0gZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgZ2VuZGVyID0gZWxzLm92R2VuZGVyLnZhbHVlO1xuICBpZiAoYmlydGhfZGF0ZSkgb3V0LmJpcnRoX2RhdGUgPSBiaXJ0aF9kYXRlO1xuICBpZiAoZ2VuZGVyKSBvdXQuZ2VuZGVyID0gZ2VuZGVyO1xuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIHRoZSBwYXRpZW50IGNhcmQncyBiaXJ0aC1kYXRlIGlucHV0LiBSZXR1cm5zIG51bGwgd2hlbiBPSyxcbiAqIG90aGVyd2lzZSBhIHVzZXItZmFjaW5nIGVycm9yIHN0cmluZy4gUmVhZHMgZGlyZWN0bHkgZnJvbSB0aGVcbiAqIDxpbnB1dCB0eXBlPVwiZGF0ZVwiPiBzbyB3ZSBjYW4gZGV0ZWN0IHBhcnRpYWwtaW5wdXQgc3RhdGVzIHRoYXRcbiAqIENocm9tZSByZXBvcnRzIHRocm91Z2ggYHZhbGlkaXR5LmJhZElucHV0YCAodGhlIGlucHV0J3MgYC52YWx1ZWBcbiAqIGlzIFwiXCIgaW4gdGhhdCBjYXNlLCBpbmRpc3Rpbmd1aXNoYWJsZSBmcm9tIFwiYmxhbmtcIiBieSBzdHJpbmcgY2hlY2tcbiAqIGFsb25lIFx1MjAxNCB0aGF0J3Mgd2h5IHRoZSBvbGQgdmVyc2lvbiBvZiB0aGlzIGZ1bmN0aW9uIGxldCBwYXJ0aWFsXG4gKiB5ZWFyLW9ubHkgZW50cmllcyBzbGlwIHRocm91Z2gpLlxuICpcbiAqIEFsbG93ZWQgc3RhdGVzOlxuICogICAtIGdlbnVpbmVseSBlbXB0eSAodGhlIGZpZWxkIGlzIG9wdGlvbmFsKVxuICogICAtIGZ1bGwgSVNPIFlZWVktTU0tREQgdGhhdCByb3VuZC10cmlwcyB0aHJvdWdoIERhdGUoKVxuICogUmVqZWN0ZWQ6XG4gKiAgIC0geWVhci1vbmx5IC8geWVhcittb250aDogdGhlIGlucHV0IHJlbmRlcnMgYmxhbmsgdmFsdWUgYnV0XG4gKiAgICAgdmFsaWRpdHkuYmFkSW5wdXQgaXMgdHJ1ZVxuICogICAtIGRhdGVzIGluIHRoZSBmdXR1cmVcbiAqICAgLSBpbXBsYXVzaWJseSBvbGQgZGF0ZXMgKHllYXIgPCAxOTAwKVxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUJpcnRoRGF0ZSgpIHtcbiAgY29uc3QgZWwgPSBlbHMub3ZCaXJ0aERhdGU7XG4gIGlmICghZWwpIHJldHVybiBudWxsO1xuICAvLyBDaHJvbWUncyBuYXRpdmUgZGF0ZSBpbnB1dDogcGFydGlhbCBlbnRyeSAoanVzdCB5ZWFyLCBqdXN0IHl5eXktbW0pXG4gIC8vIHN1cmZhY2VzIGhlcmUgZXZlbiB0aG91Z2ggLnZhbHVlIGlzIFwiXCIuXG4gIGlmIChlbC52YWxpZGl0eSAmJiBlbC52YWxpZGl0eS5iYWRJbnB1dCkge1xuICAgIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1OEFDQlx1NTg2Qlx1NUI4Q1x1NjU3NFx1NUU3NFx1NjcwOFx1NjVFNVwiO1xuICB9XG4gIGNvbnN0IHMgPSAoZWwudmFsdWUgfHwgXCJcIikudHJpbSgpO1xuICAvLyBCaXJ0aCBkYXRlIGlzIG5vdyByZXF1aXJlZCBcdTIwMTQgYWdlIGFmZmVjdHMgZXZlcnkgcmVmZXJlbmNlIHJhbmdlXG4gIC8vIGFuZCBhbnkgZG93bnN0cmVhbSBhZ2UtYmFzZWQgVUk7IGVtcHR5IGlucHV0IGxldHMgYSB0eXBvIC8gYnJvd3NlclxuICAvLyBxdWlyayBzaWxlbnRseSBwcm9wYWdhdGUgYXMgTmFOLlxuICBpZiAoIXMpIHJldHVybiBcIlx1OEFDQlx1NTg2Qlx1NzUxRlx1NjVFNVwiO1xuICBpZiAoIS9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLy50ZXN0KHMpKSByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdThBQ0JcdTU4NkJcdTVCOENcdTY1NzRcdTVFNzRcdTY3MDhcdTY1RTVcIjtcbiAgY29uc3QgW3ksIG0sIGRdID0gcy5zcGxpdChcIi1cIikubWFwKE51bWJlcik7XG4gIGNvbnN0IGR0ID0gbmV3IERhdGUocyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgaWYgKFxuICAgIE51bWJlci5pc05hTihkdC5nZXRUaW1lKCkpIHx8XG4gICAgZHQuZ2V0VVRDRnVsbFllYXIoKSAhPT0geSB8fFxuICAgIGR0LmdldFVUQ01vbnRoKCkgKyAxICE9PSBtIHx8XG4gICAgZHQuZ2V0VVRDRGF0ZSgpICE9PSBkXG4gICkge1xuICAgIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1NEUwRFx1NjYyRlx1NjcwOVx1NjU0OFx1NjVFNVx1NjcxRlwiO1xuICB9XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGlmIChkdC5nZXRUaW1lKCkgPiBub3cuZ2V0VGltZSgpKSByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdTRFMERcdTgwRkRcdTY2MkZcdTY3MkFcdTRGODZcIjtcbiAgaWYgKHkgPCAxOTAwKSByZXR1cm4gXCJcdTc1MUZcdTY1RTVcdTVFNzRcdTRFRkRcdTU5MkFcdTY1RTlcdUZGMENcdThBQ0JcdTc4QkFcdThBOERcIjtcbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFJhbmRvbSBcImF1dG8tWFhYWFhYWFhcIiBcdTIwMTQgOCBoZXggY2hhcnMgZnJvbSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHNvXG4vLyBldmVyeSBmcmVzaCBwb3B1cCBpbnN0YWxsIGdldHMgYSBkaWZmZXJlbnQgSUQgYW5kIHJlLXN5bmNzIGFyZSBzdGFibGUuXG5mdW5jdGlvbiBfZ2VuZXJhdGVBdXRvUGF0aWVudElkKCkge1xuICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgY29uc3QgaGV4ID0gQXJyYXkuZnJvbShieXRlcywgKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTtcbiAgcmV0dXJuIGBhdXRvLSR7aGV4fWA7XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGNvbnN0IGNhcmQgPSBlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscztcbiAgaWYgKCFvdikge1xuICAgIGVscy5vdlN1bW1hcnkudGV4dENvbnRlbnQgPSBcIlx1NjcyQVx1OEEyRFx1NUI5QVwiO1xuICAgIGlmIChjYXJkKSBjYXJkLmRhdGFzZXQuc3RhdGUgPSBcImVtcHR5XCI7XG4gIH0gZWxzZSB7XG4gICAgLy8gTmFtZSBmaXJzdCAod2hlbiBwcmVzZW50KSwgdGhlbiBtYXNrZWQgSUQuIE5hbWUgXHUyMTkyIFwidGhlIHBhdGllbnRcbiAgICAvLyBJJ20gd29ya2luZyB3aXRoXCIgcmVhZHMgbmF0dXJhbGx5IGZpcnN0OyBJRCBpcyB0aGUgdGVjaG5pY2FsXG4gICAgLy8gZGV0YWlsLiBQcmV2aW91c2x5IHRoZSBvcmRlciB3YXMgcmV2ZXJzZWQsIHB1dHRpbmcgYFAxMjA3NCoqKipgXG4gICAgLy8gYWhlYWQgb2YgdGhlIGFjdHVhbCBwZXJzb24ncyBuYW1lLlxuICAgIC8vIElEIGFsd2F5cyBoYWxmLW1hc2tlZCAoUDEyMDc0MDg2NiBcdTIxOTIgUDEyMDc0KioqKikgXHUyMDE0IG1hdGNoZXMgTkhJXG4gICAgLy8gXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBJ3Mgb3duIFVJIGNvbnZlbnRpb24gYW5kIHJlbW92ZXMgYSBzdGFibGUgc2hvdWxkZXItXG4gICAgLy8gc3VyZmluZyB0YXJnZXQuIFJhdyB2YWx1ZSBzdGlsbCBpbiBzdG9yYWdlICsgdGhlIGlucHV0IGZpZWxkLlxuICAgIC8vIE5hbWUgZm9sbG93cyB0aGUgbWFzayB0b2dnbGUgKFx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOCBcdTk4MTBcdThBMkRcdTk1REMgPSBcdTc3MUZcdTU0MEQgL1xuICAgIC8vIG11bHRpLXBhdGllbnQgZGVtbyBcdTk1OEJcdTU1NUYgPSBcdTkwNkVcdTdGNjkpLlxuICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgaWYgKG92Lm5hbWUpIHBhcnRzLnB1c2goX21heWJlTWFzayhvdi5uYW1lKSk7XG4gICAgcGFydHMucHVzaChtYXNrSWQob3YuaWRfbm8pKTtcbiAgICBlbHMub3ZTdW1tYXJ5LnRleHRDb250ZW50ID0gYFx1MjcxMyAke3BhcnRzLmpvaW4oXCIgIFx1MDBCNyAgXCIpfWA7XG4gICAgaWYgKGNhcmQpIGNhcmQuZGF0YXNldC5zdGF0ZSA9IFwiZmlsbGVkXCI7XG4gIH1cbiAgLy8gQm90aCBsYXVuY2ggKyBzeW5jIGVuYWJsZWQgc3RhdGUgZGVwZW5kIG9uIHBhdGllbnQgKyBtb2RlICsgY29ubi5cbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgLy8gQ2hhbmdpbmcgcGF0aWVudCBJRCBpbnZhbGlkYXRlczogKGEpIGJhY2tlbmQtc3RhdGUgY2FjaGUgKG5ld1xuICAvLyBwYXRpZW50IG1pZ2h0IG5vdCBiZSBvbiBiYWNrZW5kKTsgKGIpIGxvY2FsLWJ1bmRsZSByb3cgaW4gdGhlXG4gIC8vIGRhdGEtc3RhdGUgY2FyZDsgKGMpIHRoZSBcdUQ4M0RcdURDRTUgZG93bmxvYWQgYnVuZGxlIHNlY3Rpb24sIHdoaWNoIHdvdWxkXG4gIC8vIG90aGVyd2lzZSBzdGlsbCBzaG93IHRoZSBwcmV2aW91cyBwYXRpZW50J3Mgc3Rhc2hlZCBmaWxlOyAoZClcbiAgLy8gdGhlIGxhc3QgY29tcGxldGVkIHN5bmMncyBzdWNjZXNzIG1lc3NhZ2UsIHdoaWNoIHdhcyB0YWdnZWQgZm9yXG4gIC8vIHRoZSBwcmV2aW91cyBwYXRpZW50LlxuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG4gIF9jbGVhclN0YWxlU3luY1N0YXR1cyhnZXRQYXRpZW50T3ZlcnJpZGUoKSk7XG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBfY29ublN0YXRlID09PSBcIm9rXCIpIGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbn1cblxuLy8gRHJvcCBhIFwiXHUyNzA1IFx1NTQwQ1x1NkI2NVx1NUI4Q1x1NjIxMCBcdTIwMjZcIiBzdGF0dXMgYmFubmVyIHRoYXQgd2FzIHJlY29yZGVkIGZvciBhXG4vLyBkaWZmZXJlbnQgcGF0aWVudC4gTWlkLWZsaWdodCBzeW5jcyBhcmUgbGVmdCBhbG9uZSAoc3RhdHVzLnJ1bm5pbmcpXG4vLyBzbyB0aGUgdXNlciBjYW4gc3RpbGwgc2VlIHByb2dyZXNzIG9mIHRoZSBpbi1mbGlnaHQgc3luYy5cbmZ1bmN0aW9uIF9jbGVhclN0YWxlU3luY1N0YXR1cyhvdikge1xuICBpZiAoIV9sYXRlc3RTdGF0dXMpIHJldHVybjtcbiAgaWYgKF9sYXRlc3RTdGF0dXMucnVubmluZykgcmV0dXJuO1xuICBpZiAoIV9sYXRlc3RTdGF0dXMuaGlzdG5vKSByZXR1cm47XG4gIGlmIChvdj8uaWRfbm8gPT09IF9sYXRlc3RTdGF0dXMuaGlzdG5vKSByZXR1cm47XG4gIF9sYXRlc3RTdGF0dXMgPSBudWxsO1xuICBzZXRTdGF0dXMoXCJcIiwgbnVsbCk7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInN5bmNTdGF0dXNcIikuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzYXZlUGF0aWVudE92ZXJyaWRlKCkge1xuICAvLyBHZW5kZXIgKyBiaXJ0aF9kYXRlIGFyZSByZXF1aXJlZC4gaWRfbm8gLyBuYW1lIGFyZSBvcHRpb25hbCBcdTIwMTRcbiAgLy8gaWRfbm8gd2lsbCBiZSBhdXRvLWZldGNoZWQgb24gc3luYywgbmFtZSBjYW4gYmUgbGVmdCBibGFuayBvciBmYWtlLlxuICBpZiAoIWVscy5vdkdlbmRlci52YWx1ZSkge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdThBQ0JcdTkwNzhcdTY0QzdcdTYwMjdcdTUyMjVcIiwgXCJlcnJvclwiKTtcbiAgICBlbHMub3ZHZW5kZXIuZm9jdXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZG9iRXJyb3IgPSB2YWxpZGF0ZUJpcnRoRGF0ZSgpO1xuICBpZiAoZG9iRXJyb3IpIHtcbiAgICBzZXRTdGF0dXMoYFx1MjZENCAke2RvYkVycm9yfWAsIFwiZXJyb3JcIik7XG4gICAgZWxzLm92QmlydGhEYXRlLmZvY3VzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIEJ1aWxkIHRoZSBvdmVycmlkZSBkaXJlY3RseSBzbyB3ZSBkb24ndCBkZXBlbmQgb25cbiAgLy8gZ2V0UGF0aWVudE92ZXJyaWRlJ3MgXCJtdXN0IGhhdmUgaWRfbm8gb3IgbmFtZVwiIG51bGwtcmV0dXJuIFx1MjAxNCB0aGVcbiAgLy8gcmVxdWlyZWQtZmllbGQgcGF0aCBhYm92ZSBoYXMgYWxyZWFkeSB2YWxpZGF0ZWQgd2hhdCBtYXR0ZXJzLlxuICBjb25zdCBvdiA9IHtcbiAgICBpZF9ubzogZWxzLm92SWROby52YWx1ZS50cmltKCkgfHwgbnVsbCxcbiAgICBuYW1lOiBlbHMub3ZOYW1lLnZhbHVlLnRyaW0oKSB8fCBudWxsLFxuICAgIGJpcnRoX2RhdGU6IGVscy5vdkJpcnRoRGF0ZS52YWx1ZS50cmltKCksXG4gICAgZ2VuZGVyOiBlbHMub3ZHZW5kZXIudmFsdWUsXG4gIH07XG4gIGlmICghb3YuaWRfbm8pIGRlbGV0ZSBvdi5pZF9ubztcbiAgaWYgKCFvdi5uYW1lKSBkZWxldGUgb3YubmFtZTtcbiAgLy8gSUQgYXV0by1nZW5lcmF0aW9uOiBpZiB1c2VyIGxlZnQgaWRfbm8gYmxhbmssIG1pbnQgYW4gXCJhdXRvLVhYWFhcIlxuICAvLyBhbmQgc3Rhc2ggaXQgaW4gdGhlIFVJIHNvIHN1YnNlcXVlbnQgcmUtc3luY3MgdXNlIHRoZSBzYW1lIEZISVJcbiAgLy8gUGF0aWVudC5pZCAoc3RvcmFnZSBwZXJzaXN0ZW5jZSBrZWVwcyBpdCBzdGFibGUgYWNyb3NzIHJlLW9wZW5zKS5cbiAgaWYgKCFvdi5pZF9ubykge1xuICAgIG92LmlkX25vID0gX2dlbmVyYXRlQXV0b1BhdGllbnRJZCgpO1xuICAgIGVscy5vdklkTm8udmFsdWUgPSBvdi5pZF9ubztcbiAgfVxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwYXRpZW50T3ZlcnJpZGU6IG92IH0pO1xuICBfbWFya1N0ZXAyQ29uZmlybWVkKHRydWUpO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIFN1Y2Nlc3NmdWwgc2F2ZSBpcyBUSEUgaW50ZW50aW9uYWwgc3RlcC0yIGNvbXBsZXRpb24gZXZlbnQgXHUyMDE0IHRoaXNcbiAgLy8gaXMgd2hlcmUgdGhlIHdpemFyZCBpcyBhbGxvd2VkIHRvIGFkdmFuY2UgZm9yd2FyZC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX21heWJlQXV0b0FkdmFuY2UoKTtcbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSBlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscy5vcGVuID0gZmFsc2U7XG4gIC8vIE1ha2UgY2xlYXIgdGhpcyBpcyB0aGUgaWRlbnRpdHkgc2F2ZSwgbm90IGEgbWVkaWNhbC1yZWNvcmQgc3luYyBcdTIwMTRcbiAgLy8gXHUzMDBDXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XHUzMDBEYWxvbmUgcmVhZHMgYXMgXCJwYXRpZW50IGRhdGFcIiAobWVkaWNhbCkgZm9yIHNvbWUgdXNlcnMuXG4gIC8vIElEIGhhbGYtbWFza2VkIGluIHRoZSB0b2FzdCBmb3IgdGhlIHNhbWUgc2hvdWxkZXItc3VyZmluZyByZWFzb25cbiAgLy8gYXMgdGhlIHN1bW1hcnkgbGluZSBhYm92ZS5cbiAgY29uc3QgZGlzcGxheU5hbWUgPSBvdi5uYW1lID8gYCAoJHtfbWF5YmVNYXNrKG92Lm5hbWUpfSlgIDogXCJcIjtcbiAgc2V0U3RhdHVzKGBcdTI3MDUgXHU3NUM1XHU0RUJBXHU4RUFCXHU0RUZEXHU1REYyXHU4QTE4XHU0RjRGXHVGRjFBJHttYXNrSWQob3YuaWRfbm8pfSR7ZGlzcGxheU5hbWV9YCwgXCJzdWNjZXNzXCIpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjbGVhclBhdGllbnRPdmVycmlkZSgpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwicGF0aWVudE92ZXJyaWRlXCIpO1xuICBlbHMub3ZJZE5vLnZhbHVlID0gXCJcIjtcbiAgZWxzLm92TmFtZS52YWx1ZSA9IFwiXCI7XG4gIGVscy5vdkJpcnRoRGF0ZS52YWx1ZSA9IFwiXCI7XG4gIGVscy5vdkdlbmRlci52YWx1ZSA9IFwiXCI7XG4gIF9tYXJrU3RlcDJDb25maXJtZWQoZmFsc2UpO1xuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIGlmIChlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscykgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9IHRydWU7XG4gIHNldFN0YXR1cyhcIlx1NURGMlx1NkUwNVx1OTY2NFx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVwiLCBcImluZm9cIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCYWNrZW5kIGNvbm5lY3Rpb24gc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gU2luZ2xlIHNvdXJjZSBvZiB0cnV0aDogYF9jb25uU3RhdGVgIHJlZmxlY3RzIHRoZSBsYXRlc3QgYmFja2VuZFxuLy8gY29ubmVjdGl2aXR5IGNoZWNrLiBCb3RoIHRoZSBiYW5uZXIgVUkgYW5kIHRoZSBlbmFibGVkLXN0YXRlIG9mIHRoZVxuLy8gXHVEODNEXHVEQ0U1IFN5bmMgLyBcdUQ4M0RcdURFODAgTGF1bmNoIGJ1dHRvbnMgcmVhZCBmcm9tIGl0LlxuLy9cbi8vIFN0YXRlczpcbi8vICAgXCJ1bmtub3duXCIgIFx1MjAxNCBub3QgeWV0IGNoZWNrZWQgKGUuZy4gZmlyc3QgcGFpbnQgaW4gbG9jYWwgbW9kZSlcbi8vICAgXCJjaGVja2luZ1wiIFx1MjAxNCBmZXRjaCBpbiBmbGlnaHRcbi8vICAgXCJva1wiICAgICAgIFx1MjAxNCBHRVQgL2ZoaXIvbWV0YWRhdGEgcmV0dXJuZWQgYSBGSElSIENhcGFiaWxpdHlTdGF0ZW1lbnRcbi8vICAgXCJmYWlsXCIgICAgIFx1MjAxNCBhbnl0aGluZyBlbHNlOyBgX2Nvbm5GYWlsUmVhc29uYCBjYXJyaWVzIGRldGFpbFxuLy9cbi8vIEJhY2tlbmQgY29ubmVjdGl2aXR5IGlzIHRyZWF0ZWQgYXMgYSAqcHJlcmVxdWlzaXRlKiBmb3IgYmFja2VuZCBtb2RlLFxuLy8gbm90IGFzIGEgcGVyLWFjdGlvbiBjaGVjay4gU3dpdGNoaW5nIHRvIGJhY2tlbmQgbW9kZSB0cmlnZ2VycyBhIHRlc3Rcbi8vIGltbWVkaWF0ZWx5OyBmYWlsdXJlIHNob3dzIGEgYmFubmVyIHdpdGggYWN0aW9uYWJsZSBndWlkYW5jZSBhbmRcbi8vIGRpc2FibGVzIGJvdGggYWN0aW9uIGJ1dHRvbnMgdW50aWwgY29ubmVjdGl2aXR5IHJlY292ZXJzLlxuXG5sZXQgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiO1xubGV0IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7IC8vIHsga2luZDogXCJuby1wZXJtaXNzaW9uXCIgfCBcIm5vLXVybFwiIHwgXCJuZXR3b3JrXCIgfCBcInRpbWVvdXRcIiB8IFwiaHR0cFwiIHwgXCJub3QtZmhpclwiLCBkZXRhaWw/IH1cblxuY29uc3QgX0NPTk5fTEFCRUxTID0ge1xuICB1bmtub3duOiBcIlx1NjcyQVx1NkFBMlx1NkUyQ1wiLFxuICBjaGVja2luZzogXCJcdTZBQTJcdTZFMkNcdTRFMkRcdTIwMjZcIixcbiAgb2s6ICgpID0+IGBcdTVERjJcdTkwMjNcdTdEREEgXHUyMDE0ICR7ZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpfWAsXG4gIGZhaWw6ICgpID0+IHtcbiAgICBjb25zdCByID0gX2Nvbm5GYWlsUmVhc29uIHx8IHt9O1xuICAgIHJldHVybiAoe1xuICAgICAgXCJuby11cmxcIjogXCJcdTI3MTcgXHU2NzJBXHU4QTJEXHU1QjlBIEJhY2tlbmQgVVJMXCIsXG4gICAgICBcIm5vLXBlcm1pc3Npb25cIjogXCJcdTI3MTcgXHU2NzJBXHU2Mzg4XHU2QjBBXHU5MDIzXHU3RERBXCIsXG4gICAgICBcIm5ldHdvcmtcIjogXCJcdTI3MTcgXHU5MDIzXHU0RTBEXHU0RTBBXHU1RjhDXHU3QUVGXCIsXG4gICAgICBcInRpbWVvdXRcIjogXCJcdTI3MTcgXHU5MDIzXHU3RERBXHU5MDNFXHU2NjQyXCIsXG4gICAgICBcImh0dHBcIjogYFx1MjcxNyBIVFRQICR7ci5kZXRhaWwgfHwgXCJcIn1gLnRyaW0oKSxcbiAgICAgIFwibm90LWZoaXJcIjogXCJcdTI3MTcgXHU1NkRFXHU2MUM5XHU0RTBEXHU2NjJGIEZISVJcIixcbiAgICB9KVtyLmtpbmRdID8/IFwiXHUyNzE3IFx1OTAyM1x1N0REQVx1NTkzMVx1NjU1N1wiO1xuICB9LFxufTtcblxuY29uc3QgX0NPTk5fSEVMUCA9IHtcbiAgXCJuby11cmxcIjogICAgICAgIFwiXHU4QUNCXHU1MjMwXHUzMDBDXHU5MDMyXHU5NjhFXHU4QTJEXHU1QjlBXHUzMDBEXHU1ODZCXHU1MTY1IEJhY2tlbmQgVVJMXHVGRjBDXHU0RjhCXHU1OTgyIDxjb2RlPmh0dHA6Ly9sb2NhbGhvc3Q6ODAxMDwvY29kZT5cdTMwMDJcIixcbiAgXCJuby1wZXJtaXNzaW9uXCI6IFwiQ2hyb21lIFx1OTYzQlx1NjRDQlx1NEU4Nlx1OERFOFx1NEY4Nlx1NkU5MFx1OEFDQlx1NkM0Mlx1MzAwMlx1OEFDQlx1OTFDRFx1NjVCMFx1OTU4QiBwb3B1cFx1RkYwQ1x1NzU3Nlx1NkIwQVx1OTY1MFx1NUMwRFx1OEE3MVx1Njg0Nlx1OERGM1x1NTFGQVx1NjY0Mlx1NjMwOVx1MzAwQ1x1NTE0MVx1OEEzMVx1MzAwRFx1MzAwMlwiLFxuICBcIm5ldHdvcmtcIjogICAgICAgXCJcdTVGOENcdTdBRUZcdTUzRUZcdTgwRkRcdTkwODRcdTZDOTJcdTU1NUZcdTUyRDVcdTMwMDJcdThBQ0JcdTU3RjdcdTg4NENcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgdXAgLWQ8L2NvZGU+PGJyPlx1NzhCQVx1OEE4RCBiYWNrZW5kIFx1NUJCOVx1NTY2OFx1OEREMVx1OEQ3N1x1NEY4Nlx1NTE4RFx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcInRpbWVvdXRcIjogICAgICAgXCI1IFx1NzlEMlx1NTE2N1x1NkM5Mlx1NjUzNlx1NTIzMFx1NTZERVx1NjFDOSBcdTIwMTQgYmFja2VuZCBcdTUzRUZcdTgwRkRcdTkwODRcdTU3MjhcdTU1NUZcdTUyRDVcdTRFMkRcdUZGMENcdTdCNDkgMzAgXHU3OUQyXHU1MThEXHU2MzA5XHU5MUNEXHU4QTY2XHUzMDAyXCIsXG4gIFwiaHR0cFwiOiAgICAgICAgICBcIkJhY2tlbmQgXHU1NkRFXHU2MUM5XHU5MzJGXHU4QUE0XHU3MkMwXHU2MTRCXHU3OEJDXHUzMDAyXHU2QUEyXHU2N0U1IGJhY2tlbmQgXHU3Njg0IGxvZ1x1RkYxQTxicj48Y29kZT5kb2NrZXIgY29tcG9zZSBsb2dzIGJhY2tlbmQ8L2NvZGU+XCIsXG4gIFwibm90LWZoaXJcIjogICAgICBcIlx1OTAxOVx1NTAwQiBVUkwgXHU1NkRFXHU0RTg2XHU2NzcxXHU4OTdGXHVGRjBDXHU0RjQ2XHU0RTBEXHU2NjJGIEZISVIgQ2FwYWJpbGl0eVN0YXRlbWVudFx1MzAwMlx1NzhCQVx1OEE4RCBCYWNrZW5kIFVSTCBcdTYzMDdcdTU0MTEgTkhJLUZISVItQnJpZGdlIFx1NzY4NCAvZmhpciBcdTY4MzlcdTc2RUVcdTkzMDRcdTMwMDJcIixcbn07XG5cbmZ1bmN0aW9uIF9yZW5kZXJDb25uQmFubmVyKCkge1xuICBjb25zdCBiYW5uZXIgPSBlbHMuY29ubkJhbm5lcjtcbiAgaWYgKCFiYW5uZXIpIHJldHVybjtcbiAgYmFubmVyLmRhdGFzZXQuc3RhdGUgPSBfY29ublN0YXRlO1xuICBjb25zdCBsYWJlbCA9IF9DT05OX0xBQkVMU1tfY29ublN0YXRlXTtcbiAgZWxzLmNvbm5Nc2cudGV4dENvbnRlbnQgPSB0eXBlb2YgbGFiZWwgPT09IFwiZnVuY3Rpb25cIiA/IGxhYmVsKCkgOiBsYWJlbDtcbiAgZWxzLmNvbm5SZXRyeUJ0bi5oaWRkZW4gPSBfY29ublN0YXRlICE9PSBcImZhaWxcIjtcbiAgaWYgKF9jb25uU3RhdGUgPT09IFwiZmFpbFwiICYmIF9jb25uRmFpbFJlYXNvbj8ua2luZCkge1xuICAgIGVscy5jb25uSGVscC5oaWRkZW4gPSBmYWxzZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gX0NPTk5fSEVMUFtfY29ubkZhaWxSZWFzb24ua2luZF0gPz8gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gdHJ1ZTtcbiAgICBlbHMuY29ubkhlbHAuaW5uZXJIVE1MID0gXCJcIjtcbiAgfVxuXG4gIC8vIENvbXBhY3QtcGlsbCB2cyBmdWxsLWJhbm5lciBzd2FwOiB3aGVuIGV2ZXJ5dGhpbmcncyBmaW5lLCBzaHJpbmsgdG9cbiAgLy8gYSBzbWFsbCBncmVlbiBwaWxsIGluIHRoZSBoZWFkZXIgc28gdGhlIHBvcHVwIGJvZHkgaGFzIG1vcmUgcm9vbVxuICAvLyBmb3IgYWN0aW9uYWJsZSBjb250ZW50LiBBbnl0aGluZyBlbHNlICh1bmtub3duIC8gY2hlY2tpbmcgLyBmYWlsKVxuICAvLyBrZWVwcyB0aGUgZnVsbCBiYW5uZXIgc28gcHJvZ3Jlc3MgKyBlcnJvciBoZWxwIGhhcyBzcGFjZSB0byByZW5kZXIuXG4gIGNvbnN0IGlzT2sgPSBfY29ublN0YXRlID09PSBcIm9rXCI7XG4gIGlmIChlbHMuY29ublNlY3Rpb24pIGVscy5jb25uU2VjdGlvbi5oaWRkZW4gPSBpc09rO1xuICBpZiAoZWxzLmNvbm5NaW5pKSB7XG4gICAgZWxzLmNvbm5NaW5pLmhpZGRlbiA9ICFpc09rO1xuICAgIGlmIChpc09rKSBlbHMuY29ubk1pbmkudGl0bGUgPSBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCAzLXN0ZXAgd2l6YXJkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIENvbmNlcHR1YWxseTpcbi8vICAgU3RlcCAxIFx1MjAxNCBcdTc2N0JcdTUxNjVcdUZGMUFvbiBOSEkgdGFiICsgc2Vzc2lvbiB0b2tlbiBpcyB2YWxpZFxuLy8gICBTdGVwIDIgXHUyMDE0IFx1OEEyRFx1NUI5QVx1RkYxQWdlbmRlciBmaWxsZWQgKyAobW9kZT09bG9jYWwgT1IgYmFja2VuZCByZWFjaGFibGUpXG4vLyAgICAgICAgICAgICAgICArIGJpcnRoX2RhdGUgaWYgZW50ZXJlZCBtdXN0IGJlIHZhbGlkXG4vLyAgIFN0ZXAgMyBcdTIwMTQgXHU1M0Q2XHU1Rjk3XHVGRjFBdGhlIGFjdGlvbiBpdHNlbGYgKHN5bmMgQ1RBLCBzdGF0dXMsIHJlc3VsdHMpXG4vL1xuLy8gU3RlcHMgYXV0by1hZHZhbmNlIHdoZW4gdGhlaXIgcHJlY29uZGl0aW9uIGZsaXBzIGdyZWVuOyB1c2VycyBjYW5cbi8vIGNsaWNrIHRoZSBzdGVwcGVyIHRvIHJldmlzaXQgYW55IHN0ZXAuIFdlIG5ldmVyIGF1dG8tc3RlcCBCQUNLIG9uXG4vLyBzdGF0ZSBjaGFuZ2UgXHUyMDE0IG9uY2UgdGhlIHVzZXIgaGFzIG1vdmVkIGZvcndhcmQsIG9ubHkgYW4gZXhwbGljaXRcbi8vIHN0ZXBwZXIgY2xpY2sgYnJpbmdzIHRoZW0gYmFjay4gT3RoZXJ3aXNlIG9wZW5pbmcgdGhlIHBvcHVwIG1pZC1cbi8vIHN5bmMgd291bGQgamVyayB0aGVtIGJhY2sgdG8gc3RlcCAxLlxubGV0IF9hY3RpdmVTdGVwID0gMTtcbmxldCBfd2l6YXJkSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbi8vIFN0ZXAgMiBpcyBcImRvbmVcIiBvbmx5IGFmdGVyIHRoZSB1c2VyIGhhcyBjbGlja2VkIFx1MjcxMyBcdTc4QkFcdTVCOUEgd2l0aCB2YWxpZFxuLy8gaW5wdXRzLiBXZSB0cmFjayB0aGlzIHdpdGggYSBib29sZWFuIHJhdGhlciB0aGFuIHJlYWRpbmcgbGl2ZSBET01cbi8vIHN0YXRlIFx1MjAxNCBvdGhlcndpc2UgdGhlIHdpemFyZCB3b3VsZCBhdXRvLWFkdmFuY2UgdGhlIG1vbWVudCB0aGVcbi8vIGZpZWxkcyBoYXBwZW5lZCB0byBsb29rIHJpZ2h0LCBiZWZvcmUgdGhlIHVzZXIgaGFkIGEgY2hhbmNlIHRvXG4vLyByZXZpZXcuIEZsaXBwZWQgdHJ1ZSBpbiBzYXZlUGF0aWVudE92ZXJyaWRlIHN1Y2Nlc3MsIGZhbHNlIGluXG4vLyBjbGVhclBhdGllbnRPdmVycmlkZSBhbmQgb24gYSBsb2FkIHRoYXQgeWllbGRzIG5vIHNhdmVkIHJlY29yZC5cbmxldCBfc3RlcDJDb25maXJtZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gX21hcmtTdGVwMkNvbmZpcm1lZCh5ZXMpIHtcbiAgX3N0ZXAyQ29uZmlybWVkID0gISF5ZXM7XG59XG5cbmZ1bmN0aW9uIF9pc1N0ZXBEb25lKHN0ZXApIHtcbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBzd2l0Y2ggKHN0ZXApIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gb25OaGkgJiYgbG9nZ2VkSW47XG4gICAgY2FzZSAyOlxuICAgICAgLy8gQ29uZmlybWVkID0gdXNlciBjbGlja2VkIFx1MjcxMyBcdTc4QkFcdTVCOUEgQU5EIHRoZSBvdmVycmlkZSBpcyBjdXJyZW50bHlcbiAgICAgIC8vIHZhbGlkIChzbyByZXZpc2l0cyB3aXRoIGEgbm93LWludmFsaWQgb3ZlcnJpZGUgZG9uJ3Qgc2hvdyBhXG4gICAgICAvLyBmYWxzZSBncmVlbiBjaGVjaykuXG4gICAgICByZXR1cm4gX3N0ZXAyQ29uZmlybWVkO1xuICAgIGNhc2UgMzpcbiAgICAgIC8vIFN0ZXAgMyBpcyB0aGUgdGVybWluYWwgYWN0aW9uIHN0ZXA7IG5ldmVyIFwiZG9uZVwiIGZvciBwcm9ncmVzc1xuICAgICAgLy8gcHVycG9zZXMgKHRoZSBzdWNjZXNzIGJhbm5lciBpbnNpZGUgdGhlIHN0ZXAgaXMgdGhlIGluZGljYXRvcikuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfc2V0QWN0aXZlU3RlcChuLCBvcHRzID0ge30pIHtcbiAgY29uc3QgY2xhbXBlZCA9IE1hdGgubWF4KDEsIE1hdGgubWluKDMsIG4pKTtcbiAgX2FjdGl2ZVN0ZXAgPSBjbGFtcGVkO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuYWN0aXZlU3RlcCA9IFN0cmluZyhjbGFtcGVkKTtcbiAgX3JlZnJlc2hXaXphcmRVaSgpO1xuICBpZiAoIW9wdHMuc2lsZW50KSB7XG4gICAgLy8gQXV0by1zY3JvbGwgdGhlIHBvcHVwIHRvIHRoZSB0b3Agb2YgdGhlIHN0ZXAgc28gdXNlcnMgYWx3YXlzXG4gICAgLy8gc2VlIHRoZSBzdGVwIGhlYWRlciAvIGZpcnN0IGlucHV0IGFmdGVyIG5hdmlnYXRpb24uXG4gICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVmcmVzaFdpemFyZFVpKCkge1xuICBpZiAoIWVscy53aXphcmRTdGVwcGVyKSByZXR1cm47XG4gIGNvbnN0IGxpcyA9IGVscy53aXphcmRTdGVwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVtkYXRhLXN0ZXBdXCIpO1xuICBmb3IgKGNvbnN0IGxpIG9mIGxpcykge1xuICAgIGNvbnN0IG4gPSBOdW1iZXIobGkuZGF0YXNldC5zdGVwKTtcbiAgICBjb25zdCBpc0FjdGl2ZSA9IG4gPT09IF9hY3RpdmVTdGVwO1xuICAgIGNvbnN0IGlzRG9uZSA9IF9pc1N0ZXBEb25lKG4pO1xuICAgIGlmIChpc0FjdGl2ZSkgbGkuc2V0QXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIsIFwidHJ1ZVwiKTtcbiAgICBlbHNlIGxpLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiKTtcbiAgICBpZiAoaXNEb25lKSBsaS5kYXRhc2V0LmRvbmUgPSBcInRydWVcIjtcbiAgICBlbHNlIGRlbGV0ZSBsaS5kYXRhc2V0LmRvbmU7XG4gIH1cbiAgLy8gU3RlcCAxJ3MgdGhyZWUgc3ViLWNhcmRzIChvZmYtbmhpIC8gbmVlZHMtbG9naW4gLyBsb2dpbi1vaykgYXJlXG4gIC8vIG11dHVhbGx5IGV4Y2x1c2l2ZSBcdTIwMTQgcGljayB0aGUgb25lIHRoYXQgbWF0Y2hlcyBjdXJyZW50IHN0YXRlLlxuICBjb25zdCBvbk5oaSA9ICFlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgY29uc3QgbG9nZ2VkSW4gPSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluICE9PSBcIm5vXCI7XG4gIGlmIChlbHMub3Blbk5oaVNlY3Rpb24pXG4gICAgZWxzLm9wZW5OaGlTZWN0aW9uLmhpZGRlbiA9IG9uTmhpO1xuICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKVxuICAgIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSAhb25OaGkgfHwgbG9nZ2VkSW47XG4gIGlmIChlbHMubG9naW5Pa1NlY3Rpb24pXG4gICAgZWxzLmxvZ2luT2tTZWN0aW9uLmhpZGRlbiA9ICEob25OaGkgJiYgbG9nZ2VkSW4pO1xuXG4gIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xufVxuXG4vLyBTaG93L2hpZGUgc3RlcC0zIHJlc3VsdCBjYXJkcyBiYXNlZCBvbiB3aGV0aGVyIGVhY2ggaGFzIGNvbnRlbnQuXG4vLyBFbXB0eSBjYXJkcyAoZS5nLiBhIHN1bW1hcnkgY2FyZCB3aXRoIG5vIHN0YXR1cyArIG5vIGRhdGEtc3RhdGUgaW5cbi8vIGxvY2FsIG1vZGUgcHJlLXN5bmMpIHVzZWQgdG8gcmVuZGVyIGFzIGEgYmxhbmsgc3RyaXBlIFx1MjAxNCBub3cgdGhleVxuLy8gc3RheSBjb2xsYXBzZWQgaW5kaXZpZHVhbGx5LCBhbmQgdGhlIHdob2xlIHpvbmUgZ29lcyBhd2F5IHdoZW4gYWxsXG4vLyB0aHJlZSBjYXJkcyB3b3VsZCBiZSBlbXB0eS5cbmZ1bmN0aW9uIF9yZWZyZXNoUmVzdWx0Wm9uZSgpIHtcbiAgaWYgKCFlbHMucmVzdWx0Wm9uZSkgcmV0dXJuO1xuICBjb25zdCBoYXNTdGF0dXMgPSAoZWxzLnN0YXR1cz8udGV4dENvbnRlbnQgPz8gXCJcIikudHJpbSgpICE9PSBcIlwiO1xuICBjb25zdCBkYXRhU3RhdGVTaG93biA9XG4gICAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24gJiYgIWVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbjtcbiAgY29uc3QgYnVuZGxlU2hvd24gPVxuICAgIGVscy5wZW5kaW5nQnVuZGxlICYmICFlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW47XG4gIC8vIExhdW5jaCBidXR0b24gb25seSBjb3VudHMgd2hlbiB1c2FibGUgXHUyMDE0IGJhY2tlbmQgbW9kZSArIHRoZSBwYXRpZW50XG4gIC8vIGFjdHVhbGx5IGV4aXN0cyBvbiB0aGUgYmFja2VuZCAoYGxhdW5jaEJ0bi5kaXNhYmxlZCA9PT0gZmFsc2VgKS5cbiAgLy8gQSBwZXJtYS1kaXNhYmxlZCBidXR0b24gc2hvdWxkbid0IHBpbiB0aGUgem9uZSBvcGVuLlxuICBjb25zdCBsYXVuY2hVc2FibGUgPVxuICAgIGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIGVscy5sYXVuY2hCdG4gJiYgIWVscy5sYXVuY2hCdG4uZGlzYWJsZWQ7XG5cbiAgaWYgKGVscy5zdW1tYXJ5Q2FyZCkge1xuICAgIGVscy5zdW1tYXJ5Q2FyZC5oaWRkZW4gPSAhKGhhc1N0YXR1cyB8fCBkYXRhU3RhdGVTaG93bik7XG4gIH1cbiAgaWYgKGVscy5sYXVuY2hCbG9jaykge1xuICAgIC8vIEhpZGUgdGhlIGxhdW5jaCBjYXJkIG91dHJpZ2h0IHdoZW4gaXQnZCBiZSBqdXN0IGEgZGlzYWJsZWQgYnV0dG9uXG4gICAgLy8gXHUyMDE0IGtlZXBzIGJhY2tlbmQgbW9kZSdzIHByZS1zeW5jIHJlc3VsdCB6b25lIGZyb20gc2hvd2luZyBhIGZhaW50XG4gICAgLy8gb3V0bGluZWQtYnV0LWRpc2FibGVkIFwiXHVEODNEXHVERTgwIFx1OTU4Qlx1NTU1RiBTTUFSVCBBcHBcIiB3aXRoIG5vIGNvbnRleHQuXG4gICAgZWxzLmxhdW5jaEJsb2NrLmhpZGRlbiA9ICFsYXVuY2hVc2FibGU7XG4gIH1cbiAgZWxzLnJlc3VsdFpvbmUuaGlkZGVuID0gIShoYXNTdGF0dXMgfHwgYnVuZGxlU2hvd24gfHwgZGF0YVN0YXRlU2hvd24gfHwgbGF1bmNoVXNhYmxlKTtcbn1cblxuZnVuY3Rpb24gX21heWJlQXV0b0FkdmFuY2UoKSB7XG4gIC8vIE9ubHkgYWR2YW5jZSBmb3J3YXJkLCBuZXZlciBiYWNrLiBTYXZlIHVzZXIncyBwbGFjZSBpZiB0aGV5J3ZlXG4gIC8vIGNsaWNrZWQgaW50byBhIGxhdGVyIHN0ZXAgbWFudWFsbHkuXG4gIGlmIChfYWN0aXZlU3RlcCA9PT0gMSAmJiBfaXNTdGVwRG9uZSgxKSkgX3NldEFjdGl2ZVN0ZXAoMik7XG4gIGVsc2UgaWYgKF9hY3RpdmVTdGVwID09PSAyICYmIF9pc1N0ZXBEb25lKDIpKSBfc2V0QWN0aXZlU3RlcCgzKTtcbn1cblxuZnVuY3Rpb24gX2luaXRXaXphcmQoKSB7XG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIHJldHVybjtcbiAgX3dpemFyZEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgLy8gSW5pdGlhbCBzdGVwOiB3aGljaGV2ZXIgaXMgdGhlIEZJUlNUIG5vdC15ZXQtZG9uZSBzdGVwIGF0IHBvcHVwIG9wZW4uXG4gIC8vIEZpcnN0LXRpbWUgdXNlciBcdTIxOTIgc3RlcCAxLiBSZXR1cm5pbmcgdXNlciB3aXRoIHZhbGlkIHNlc3Npb24gKyBzYXZlZFxuICAvLyBwYXRpZW50IFx1MjE5MiBzdGVwIDMuXG4gIGNvbnN0IHN0YXJ0ID0gX2lzU3RlcERvbmUoMSkgPyAoX2lzU3RlcERvbmUoMikgPyAzIDogMikgOiAxO1xuICBfc2V0QWN0aXZlU3RlcChzdGFydCwgeyBzaWxlbnQ6IHRydWUgfSk7XG5cbiAgLy8gU3RlcHBlciBjbGlja3MgXHUyMTkyIGp1bXBcbiAgZm9yIChjb25zdCBsaSBvZiBlbHMud2l6YXJkU3RlcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwibGlbZGF0YS1zdGVwXVwiKSkge1xuICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBfc2V0QWN0aXZlU3RlcChOdW1iZXIobGkuZGF0YXNldC5zdGVwKSkpO1xuICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIiB8fCBlLmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBfc2V0QWN0aXZlU3RlcChOdW1iZXIobGkuZGF0YXNldC5zdGVwKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlZnJlc2hCdXR0b25TdGF0ZXMoKSB7XG4gIC8vIFN5bmMgYnV0dG9uLiBDb25kaXRpb25zLCBpbiBwcmlvcml0eSBvcmRlcjpcbiAgLy8gICAxLiBvbiBhbiBOSEkgdGFiXG4gIC8vICAgMi4gbG9nZ2VkIGluIHRvIE5ISSAoZGV0ZWN0ZWQgdmlhIGJhY2tncm91bmQgcHJlLWZsaWdodClcbiAgLy8gICAzLiBiYWNrZW5kIG1vZGUgXHUyMTkyIGJhY2tlbmQgY29ubmVjdGVkXG4gIC8vICAgNC4gZ2VuZGVyIGZpbGxlZCAob3RoZXIgcGF0aWVudCBmaWVsZHMgYWxsIG9wdGlvbmFsKVxuICAvLyBXaGF0ZXZlciBibG9ja3MgdGhlIENUQSBhbHNvIGdldHMgc3VyZmFjZWQgYXMgYW4gaW5saW5lIG1lc3NhZ2VcbiAgLy8gYmVsb3cgdGhlIGJ1dHRvbiBcdTIwMTQgdG9vbHRpcHMgYXJlIGludmlzaWJsZSBpbiB0aGUgMzYwcHggcG9wdXAuXG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBsb2dnZWRJbiA9IGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW4gIT09IFwibm9cIjtcbiAgY29uc3QgbW9kZU9rID0gY3VycmVudE1vZGUoKSA9PT0gXCJsb2NhbFwiIHx8IF9jb25uU3RhdGUgPT09IFwib2tcIjtcbiAgY29uc3QgZ2VuZGVyT2sgPSAhIWVscy5vdkdlbmRlcj8udmFsdWU7XG4gIGNvbnN0IGRvYkVycm9yID0gdmFsaWRhdGVCaXJ0aERhdGUoKTtcblxuICAvLyBFYWNoIGJsb2NraW5nIHJlYXNvbiBuYW1lcyB0aGUgc3RlcCB0aGF0IG5lZWRzIGF0dGVudGlvbi4gTW9kZSArXG4gIC8vIGNvbm5lY3Rpb24gbm93IGxpdmUgaW4gc3RlcCAzIGFsb25nc2lkZSB0aGUgQ1RBIGl0c2VsZiwgc28gdGhvc2VcbiAgLy8gcmVhc29ucyByZWZlcmVuY2Ugd2hhdCdzIGRpcmVjdGx5IGFib3ZlIHRoZSBidXR0b24gcmF0aGVyIHRoYW5cbiAgLy8gc2VuZGluZyB0aGUgdXNlciBiYWNrIHRocm91Z2ggdGhlIHN0ZXBwZXIuXG4gIGxldCByZWFzb24gPSBcIlwiO1xuICBpZiAoIW9uTmhpKSByZWFzb24gPSBcIlx1NTZERSBcdTI0NjAgXHU3NjdCXHU1MTY1XHVGRjFBXHU4QUNCXHU1MjA3XHU1MjMwXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU1MjA2XHU5ODAxXCI7XG4gIGVsc2UgaWYgKCFsb2dnZWRJbikgcmVhc29uID0gXCJcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NVx1RkYxQVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NTIwNlx1OTgwMVx1NUMxQVx1NjcyQVx1NzY3Qlx1NTE2NVwiO1xuICBlbHNlIGlmICghZ2VuZGVyT2spIHJlYXNvbiA9IFwiXHU1NkRFIFx1MjQ2MSBcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcdUZGMUFcdThBQ0JcdTkwNzhcdTY0QzdcdTYwMjdcdTUyMjVcdTRFMjZcdTYzMDlcdTc4QkFcdTVCOUFcIjtcbiAgZWxzZSBpZiAoZG9iRXJyb3IpIHJlYXNvbiA9IGBcdTU2REUgXHUyNDYxIFx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVx1RkYxQSR7ZG9iRXJyb3J9YDtcbiAgZWxzZSBpZiAoIW1vZGVPaykgcmVhc29uID0gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREEgXHUyMDE0IFx1NzcwQlx1NEUwQVx1NjVCOVx1N0QwNVx1ODI3Mlx1NjNEMFx1NzkzQVx1RkYwQ1x1NjIxNlx1NjUzOVx1NTZERVx1MzAwQ1x1RDgzRFx1RENCRSBcdTRFMEJcdThGMDlcdTUyMzBcdTk2RkJcdTgxNjZcdTMwMERcIjtcblxuICBlbHMuc3luY0FwaUJ0bi5kaXNhYmxlZCA9IHJlYXNvbiAhPT0gXCJcIjtcbiAgZWxzLnN5bmNBcGlCdG4udGl0bGUgPSByZWFzb247XG4gIGlmIChlbHMuc3luY0Jsb2NrZWRSZWFzb24pIHtcbiAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24udGV4dENvbnRlbnQgPSByZWFzb24gPyBgXHUyNkEwXHVGRTBGICR7cmVhc29ufWAgOiBcIlwiO1xuICAgIGVscy5zeW5jQmxvY2tlZFJlYXNvbi5oaWRkZW4gPSByZWFzb24gPT09IFwiXCI7XG4gIH1cblxuICAvLyBMYXVuY2ggYnV0dG9uOiBiYWNrZW5kIG1vZGUgKyBjb25uIG9rICsgcGF0aWVudCBzZXQgKyBiYWNrZW5kXG4gIC8vIGFjdHVhbGx5IGhhcyB0aGlzIHBhdGllbnQgKG90aGVyd2lzZSB0aGUgU01BUlQgYXBwIGxhdW5jaGVzIGludG9cbiAgLy8gYW4gZW1wdHkgRkhJUiBzdG9yZSBcdTIwMTQgY29uZnVzaW5nIGJsYW5rIHNjcmVlbikuXG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGNvbnN0IGhhdmVCYWNrZW5kUGF0aWVudCA9IF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCI7XG4gIGVscy5sYXVuY2hCdG4uZGlzYWJsZWQgPSAhKFxuICAgIGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmXG4gICAgX2Nvbm5TdGF0ZSA9PT0gXCJva1wiICYmXG4gICAgISFvdj8uaWRfbm8gJiZcbiAgICBoYXZlQmFja2VuZFBhdGllbnRcbiAgKTtcbiAgZWxzLmxhdW5jaEJ0bi50aXRsZSA9XG4gICAgY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgID8gXCJcdThBQ0JcdTUyMDdcdTUyMzBcdTMwMENcdUQ4M0NcdURGRTUgXHU2NzJDXHU2QTVGXHU1RjhDXHU3QUVGIChcdTkwMzJcdTk2OEUpXHUzMDBEXHU2QTIxXHU1RjBGXCIgOlxuICAgIF9jb25uU3RhdGUgIT09IFwib2tcIiAgICAgICAgICAgPyBcIlx1NUY4Q1x1N0FFRlx1NUMxQVx1NjcyQVx1OTAyM1x1N0REQVwiIDpcbiAgICAhb3Y/LmlkX25vICAgICAgICAgICAgICAgICAgICA/IFwiXHU1NkRFIFx1MjQ2MSBcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcdUZGMUFcdThBQ0JcdTU4NkJcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIiA6XG4gICAgIWhhdmVCYWNrZW5kUGF0aWVudCAgICAgICAgICAgPyBcIlx1NUY4Q1x1N0FFRlx1NUMxQVx1NzEyMVx1NkI2NFx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OSBcdTIwMTQgXHU1MTQ4XHU2MzA5XHUzMDBDXHVEODNEXHVERDA0IFx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MzAwRFx1NjIxNlx1NEUwQlx1NjVCOVx1MzAwQ1x1RDgzRFx1RENFNCBcdTYyOEFcdTY3MkNcdTU3MzBcdTZBOTRcdTY4NDhcdTRFMEFcdTUwQjNcdTUyMzBcdTVGOENcdTdBRUZcdTMwMERcIiA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiO1xuXG4gIC8vIFJlZnJlc2ggdGhlIHN0ZXBwZXIgVUkgb24gZXZlcnkgc3RhdGUgY2hhbmdlLCBidXQgRE9OJ1QgYXV0by1cbiAgLy8gYWR2YW5jZSBmcm9tIGhlcmUgXHUyMDE0IGluY2lkZW50YWwgaW5wdXQgY2hhbmdlcyAodHlwaW5nIGluIGEgZmllbGRcbiAgLy8gd2hpbGUgcmV2aXNpdGluZyBzdGVwIDIpIHNob3VsZG4ndCB5YW5rIHRoZSB1c2VyIGZvcndhcmQuIEF1dG8tXG4gIC8vIGFkdmFuY2UgaXMgb25seSBmaXJlZCBmcm9tIHRoZSBldmVudHMgdGhhdCBzaWduYWwgaW50ZW50OlxuICAvLyAgIC0gbG9naW4gcHJvYmUgZmxpcHBpbmcgdG8gdHJ1ZSBcdTIxOTIgZm9yd2FyZCBpbnRvIHN0ZXAgMlxuICAvLyAgIC0gc2F2ZVBhdGllbnRPdmVycmlkZSBzdWNjZXNzIFx1MjE5MiBmb3J3YXJkIGludG8gc3RlcCAzXG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoV2l6YXJkVWkoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdEJhY2tlbmRDb25uZWN0aW9uKCkge1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGlmICghdXJsKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tdXJsXCIgfTtcbiAgICBfcmVuZGVyQ29ubkJhbm5lcigpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpOyByZXR1cm4gZmFsc2U7XG4gIH1cbiAgX2Nvbm5TdGF0ZSA9IFwiY2hlY2tpbmdcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcblxuICBjb25zdCBwZXJtID0gYXdhaXQgZW5zdXJlQmFja2VuZFBlcm1pc3Npb24odXJsKTtcbiAgaWYgKCFwZXJtLm9rKSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dXJsLnJlcGxhY2UoL1xcLyQvLCBcIlwiKX0vZmhpci9tZXRhZGF0YWAsIHsgc2lnbmFsOiBjdHJsLnNpZ25hbCB9KTtcbiAgICBpZiAoIXJlcy5vaykge1xuICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwiaHR0cFwiLCBkZXRhaWw6IHJlcy5zdGF0dXMgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcy5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCk7XG4gICAgICBpZiAoYm9keT8ucmVzb3VyY2VUeXBlICE9PSBcIkNhcGFiaWxpdHlTdGF0ZW1lbnRcIikge1xuICAgICAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7IF9jb25uRmFpbFJlYXNvbiA9IHsga2luZDogXCJub3QtZmhpclwiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfY29ublN0YXRlID0gXCJva1wiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjtcbiAgICBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXRcIiA6IFwibmV0d29ya1wiIH07XG4gIH0gZmluYWxseSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgfVxuXG4gIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gIC8vIFdoZW5ldmVyIGNvbm5lY3Rpdml0eSBmbGlwcywgcmUtY2hlY2sgd2hldGhlciB0aGlzIHBhdGllbnQgYWxyZWFkeVxuICAvLyBleGlzdHMgb24gYmFja2VuZC4gKFN0YWxlIFwiX2JhY2tlbmRQYXRpZW50XCIgc3RhdGUgd291bGQgb3RoZXJ3aXNlXG4gIC8vIGNhdXNlIExhdW5jaCB0byBsb29rIGVuYWJsZWQgLyBkaXNhYmxlZCB3cm9uZ2x5LilcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSBjaGVja0JhY2tlbmRQYXRpZW50KCk7XG4gIHJldHVybiBfY29ublN0YXRlID09PSBcIm9rXCI7XG59XG5cbmVscy5jb25uUmV0cnlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0ZXN0QmFja2VuZENvbm5lY3Rpb24pO1xuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBcdTIxOTQgbG9jYWwgZGF0YS1zdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBJbmRlcGVuZGVudCBvZiB0aGUgY29ubmVjdGlvbiBiYW5uZXIgKHdoaWNoIG9ubHkgdGVsbHMgdXMgXCJjYW4gd2Vcbi8vIHJlYWNoIHRoZSBiYWNrZW5kXCIpLiBUaGlzIGNhcmQgYW5zd2VycyB0d28gcXVlc3Rpb25zOlxuLy9cbi8vICAgMS4gRG9lcyB0aGUgYmFja2VuZCBhbHJlYWR5IGhhdmUgdGhpcyBwYXRpZW50J3MgZGF0YT9cbi8vICAgICAgXHUyMTkyIGRyaXZlcyB3aGV0aGVyIFx1RDgzRFx1REU4MCBMYXVuY2ggaXMgYWxsb3dlZCBhdCBhbGwgKExhdW5jaCBvbiBhblxuLy8gICAgICAgIGVtcHR5IGJhY2tlbmQgZ2l2ZXMgYSBjb25mdXNpbmcgU01BUlQtYXBwIGJsYW5rKS5cbi8vICAgMi4gRG9lcyB0aGUgdXNlciBoYXZlIGEgbG9jYWwgQnVuZGxlIHRoYXQncyBuZXdlciB0aGFuIHRoZVxuLy8gICAgICBiYWNrZW5kJ3Mgdmlldz9cbi8vICAgICAgXHUyMTkyIG9mZmVyIFwiXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGUgXHU1MjMwXHU1RjhDXHU3QUVGXCIgdG8gcHVzaCBpdCB2aWEgL2ZoaXIvaW1wb3J0XG4vLyAgICAgICAgd2l0aG91dCByZS1mZXRjaGluZyBOSEkgKGZhc3QsIG5vbi1kZXN0cnVjdGl2ZTogc3RhYmxlIElEc1xuLy8gICAgICAgIHVwc2VydCBzbyBiYWNrZW5kIHJlc291cmNlcyBqdXN0IGJ1bXAgdmVyc2lvbklkKS5cbi8vXG4vLyBXZSBkb24ndCBzZWNvbmQtZ3Vlc3MgdGhlIHVzZXI6IGV2ZW4gd2hlbiBsb2NhbCBpcyBjbGVhcmx5IG5ld2VyLFxuLy8gTGF1bmNoIHN0YXlzIGVuYWJsZWQgaWYgdGhlIGJhY2tlbmQgaGFzIHRoZSBwYXRpZW50IFx1MjAxNCB0aGV5IG1heVxuLy8gZ2VudWluZWx5IHdhbnQgdG8gbG9vayBhdCB0aGUgb2xkZXIgc3RhdGUuIFRoZSBVSSBsYXlzIG91dCBib3RoXG4vLyBzaWRlczsgdXNlciBkZWNpZGVzLlxuXG5sZXQgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuLy8gICBzdGF0ZTogXCJ1bmtub3duXCIgfCBcImNoZWNraW5nXCIgfCBcImFic2VudFwiIHwgXCJwcmVzZW50XCIgfCBcImZhaWxcIlxubGV0IF9sb2NhbEJ1bmRsZSA9IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcblxuZnVuY3Rpb24gX2ZtdFRpbWVTaG9ydChpc28pIHtcbiAgaWYgKCFpc28pIHJldHVybiBcIlwiO1xuICBjb25zdCBkID0gbmV3IERhdGUoaXNvKTtcbiAgaWYgKE51bWJlci5pc05hTihkLmdldFRpbWUoKSkpIHJldHVybiBcIlwiO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgcmV0dXJuIGAke2QuZ2V0TW9udGgoKSArIDF9LyR7ZC5nZXREYXRlKCl9ICR7cGFkKGQuZ2V0SG91cnMoKSl9OiR7cGFkKGQuZ2V0TWludXRlcygpKX1gO1xufVxuXG5mdW5jdGlvbiBfZm10UmVsYXRpdmUobXMpIHtcbiAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBtcztcbiAgaWYgKGRpZmYgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGRpZmYgLyAxMDAwKSl9IFx1NzlEMlx1NTI0RGA7XG4gIGlmIChkaWZmIDwgMzYwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyA2MF8wMDApfSBcdTUyMDZcdTk0MThcdTUyNERgO1xuICBpZiAoZGlmZiA8IDg2XzQwMF8wMDApIHJldHVybiBgJHtNYXRoLnJvdW5kKGRpZmYgLyAzNjAwXzAwMCl9IFx1NUMwRlx1NjY0Mlx1NTI0RGA7XG4gIHJldHVybiBfZm10VGltZVNob3J0KG5ldyBEYXRlKG1zKS50b0lTT1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gX3JlbmRlckRhdGFTdGF0ZSgpIHtcbiAgLy8gU2VjdGlvbiBvbmx5IHZpc2libGUgaW4gYmFja2VuZCBtb2RlIChoYW5kbGVkIGJ5IC5iYWNrZW5kLW9ubHkgQ1NTKSxcbiAgLy8gYnV0IHdlIGFsc28gZXhwbGljaXRseSBoaWRlIHdoZW4gdGhlIHBvcHVwIGhhcyBubyBwYXRpZW50X292ZXJyaWRlXG4gIC8vIHNldCwgc2luY2UgYm90aCBjaGVja3Mga2V5IG9mZiBwYXRpZW50X2lkLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubykge1xuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ2FyZCBzZXJ2ZXMgYXMgYW4gYWxlcnQsIG5vdCBhIGRhc2hib2FyZCBcdTIwMTQgc2hvdyBvbmx5IHdoZW4gdGhlcmUnc1xuICAvLyBzb21ldGhpbmcgYWN0aW9uYWJsZSAvIHdvcnRoIGZsYWdnaW5nLiBIaWRlIHdoZW46XG4gIC8vICAgLSBiYWNrZW5kIGhhcyB0aGlzIHBhdGllbnQgQU5EIG5vIGxvY2FsIGJ1bmRsZSB0byBjb21wYXJlIGFnYWluc3RcbiAgLy8gICAgIChMYXVuY2ggaXMgZW5hYmxlZCBcdTIxOTIgdGhhdCdzIHRoZSBzaWduYWwgZXZlcnl0aGluZydzIGZpbmUpLCBvclxuICAvLyAgIC0gYm90aCBzaWRlcyBhZ3JlZSBvbiBjb3VudCAoYWxyZWFkeSBpbiBzeW5jLCBubyB1cGxvYWQgbmVlZGVkKS5cbiAgLy8gVGhlIHJlbWFpbmluZyBzdGF0ZXMgKGNoZWNraW5nIC8gZmFpbCAvIGFic2VudCAvIGNvdW50IG1pc21hdGNoKSBhbGxcbiAgLy8gZWl0aGVyIG5lZWQgdXNlciBhdHRlbnRpb24gb3IgYXJlIHRyYW5zaWVudCBsb2FkaW5nIGZlZWRiYWNrLlxuICBjb25zdCBsb2NhbE1hdGNoZXMgPSBfbG9jYWxCdW5kbGUuZXhpc3RzICYmIF9sb2NhbEJ1bmRsZS5wYXRpZW50SWQgPT09IG92LmlkX25vO1xuICBjb25zdCBpblN5bmMgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiZcbiAgICBsb2NhbE1hdGNoZXMgJiZcbiAgICBfYmFja2VuZFBhdGllbnQuY291bnQgPT09IF9sb2NhbEJ1bmRsZS5jb3VudDtcbiAgLy8gUXVpZXQgXCJcdTI3MTMgXHU1REYyXHU1NDBDXHU2QjY1XCIgaGludCBzaXRzIHVuZGVyIHRoZSBkb3dubG9hZCBidXR0b24gd2hlbiBpbi1zeW5jIFx1MjAxNFxuICAvLyBnaXZlcyB0aGUgdXNlciBhIHRpbnkgYWNrbm93bGVkZ2VtZW50IGluc3RlYWQgb2YgdG90YWwgc2lsZW5jZS5cbiAgaWYgKGVscy5zeW5jU3RhdHVzSGludCkgZWxzLnN5bmNTdGF0dXNIaW50LmhpZGRlbiA9ICFpblN5bmM7XG4gIGNvbnN0IG5vdGhpbmdUb1Nob3cgPVxuICAgIF9iYWNrZW5kUGF0aWVudC5zdGF0ZSA9PT0gXCJwcmVzZW50XCIgJiYgKCFsb2NhbE1hdGNoZXMgfHwgaW5TeW5jKTtcbiAgaWYgKG5vdGhpbmdUb1Nob3cpIHtcbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSBmYWxzZTtcblxuICAvLyBCYWNrZW5kIHJvd1xuICBjb25zdCBicyA9IGVscy5iYWNrZW5kU3RhdGU7XG4gIHN3aXRjaCAoX2JhY2tlbmRQYXRpZW50LnN0YXRlKSB7XG4gICAgY2FzZSBcImNoZWNraW5nXCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IFwiXHU2QUEyXHU2N0U1XHU0RTJEXHUyMDI2XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiYWJzZW50XCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIGVtcHR5XCI7XG4gICAgICAvLyBDYXJkIHNpdHMgaW5zaWRlIHRoZSByZXN1bHQgem9uZSBuZXh0IHRvIHRoZSBcdUQ4M0RcdUREMDQgXHU1M0Q2XHU1Rjk3IENUQSBhbmRcbiAgICAgIC8vIHRoZSBcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzIGJ1dHRvbiBcdTIwMTQgcG9pbnRpbmcgYXQgdGhlbSB3aXRoIHRleHQgd291bGQgYmVcbiAgICAgIC8vIGRvdWJsZS10YWxrLiBKdXN0IHN0YXRlIHRoZSBmYWN0LlxuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjZBMCBcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJwcmVzZW50XCI6IHtcbiAgICAgIGNvbnN0IGNvdW50ID0gX2JhY2tlbmRQYXRpZW50LmNvdW50O1xuICAgICAgY29uc3QgdHMgPSBfYmFja2VuZFBhdGllbnQubGFzdFVwZGF0ZWQ7XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIG9rXCI7XG4gICAgICBicy50ZXh0Q29udGVudCA9IGBcdTI3MTMgJHtjb3VudCA+IDAgPyBgJHtjb3VudH0gXHU3QjQ2IFx1MDBCNyBgIDogXCJcIn1cdTY3MDBcdTVGOENcdTY2RjRcdTY1QjAgJHtfZm10VGltZVNob3J0KHRzKSB8fCBcIih1bmtub3duKVwifWA7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcImZhaWxcIjpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWUgZmFpbFwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjcxNyBcdTZBQTJcdTY3RTVcdTU5MzFcdTY1NTdcdUZGMDhcdTc3MEJcdTkwMjNcdTdEREEgYmFubmVyXHVGRjA5XCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1MjAxNFwiO1xuICB9XG5cbiAgLy8gTG9jYWwgcm93IFx1MjAxNCBzaG93IG9ubHkgd2hlbiB0aGUgcGVuZGluZyBidW5kbGUgbWF0Y2hlcyB0aGlzIHBhdGllbnQuXG4gIC8vIChsb2NhbE1hdGNoZXMgd2FzIGNvbXB1dGVkIGFib3ZlIGZvciB0aGUgZWFybHktcmV0dXJuIGNoZWNrLilcbiAgaWYgKGxvY2FsTWF0Y2hlcykge1xuICAgIGVscy5sb2NhbFN0YXRlUm93LmhpZGRlbiA9IGZhbHNlO1xuICAgIGVscy5sb2NhbFN0YXRlLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWUgb2tcIjtcbiAgICBlbHMubG9jYWxTdGF0ZS50ZXh0Q29udGVudCA9XG4gICAgICBgXHUyNzEzICR7X2xvY2FsQnVuZGxlLmNvdW50fSBcdTdCNDYgXHUwMEI3ICR7X2ZtdFJlbGF0aXZlKF9sb2NhbEJ1bmRsZS5nZW5lcmF0ZWRBdCl9XHU3NTIyXHU3NTFGYDtcbiAgfSBlbHNlIHtcbiAgICBlbHMubG9jYWxTdGF0ZVJvdy5oaWRkZW4gPSB0cnVlO1xuICB9XG5cbiAgLy8gXCJcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzXHU2NzJDXHU1NzMwIEJ1bmRsZVwiIGJ1dHRvbiBzaG93cyBvbmx5IHdoZW4gdGhlcmUncyBhIGxvY2FsIGJ1bmRsZVxuICAvLyBmb3IgdGhpcyBwYXRpZW50LiBXZSBkb24ndCByZWFjaCB0aGlzIGJyYW5jaCB3aGVuIGluLXN5bmMgKHRoZVxuICAvLyB3aG9sZSBzZWN0aW9uIGdldHMgaGlkZGVuIGFib3ZlKSwgc28gbm8gbmVlZCBmb3IgYSBzZXBhcmF0ZVxuICAvLyBkaXNhYmxlZCBzdGF0ZSBcdTIwMTQgd2hlbiB0aGUgYnV0dG9uIHNob3dzLCB1cGxvYWQgaXMgYWx3YXlzIG1lYW5pbmdmdWwuXG4gIGVscy5wdXNoTG9jYWxCdG4uaGlkZGVuID0gIWxvY2FsTWF0Y2hlcztcbiAgZWxzLnB1c2hMb2NhbEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICBlbHMucHVzaExvY2FsQnRuLnRpdGxlID0gXCJcIjtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50ZXh0Q29udGVudCA9IFwiXHVEODNEXHVEQ0U0IFx1NjI4QVx1NjcyQ1x1NTczMFx1NkE5NFx1Njg0OFx1NEUwQVx1NTBCM1x1NTIzMFx1NUY4Q1x1N0FFRlwiO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIF9sb2NhbEJ1bmRsZSA9IHBlbmRpbmdcbiAgICA/IHtcbiAgICAgICAgZXhpc3RzOiB0cnVlLFxuICAgICAgICBjb3VudDogQXJyYXkuaXNBcnJheShKU09OLnBhcnNlKHBlbmRpbmcuanNvbik/LmVudHJ5KVxuICAgICAgICAgID8gSlNPTi5wYXJzZShwZW5kaW5nLmpzb24pLmVudHJ5Lmxlbmd0aFxuICAgICAgICAgIDogMCxcbiAgICAgICAgZ2VuZXJhdGVkQXQ6IHBlbmRpbmcuZ2VuZXJhdGVkQXQgfHwgMCxcbiAgICAgICAgcGF0aWVudElkOiBwZW5kaW5nLnBhdGllbnRJZCB8fCBudWxsLFxuICAgICAgfVxuICAgIDogeyBleGlzdHM6IGZhbHNlLCBjb3VudDogMCwgZ2VuZXJhdGVkQXQ6IDAsIHBhdGllbnRJZDogbnVsbCB9O1xuICBfcmVuZGVyRGF0YVN0YXRlKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoZWNrQmFja2VuZFBhdGllbnQoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmIChjdXJyZW50TW9kZSgpICE9PSBcImJhY2tlbmRcIiB8fCAhb3Y/LmlkX25vIHx8IF9jb25uU3RhdGUgIT09IFwib2tcIikge1xuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJjaGVja2luZ1wiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuXG4gIGNvbnN0IHVybCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gIGNvbnN0IGtleSA9IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgaGVhZGVycyA9IGtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBrZXkgfSA6IHt9O1xuICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIHRoZSBoYXNoZWQgRkhJUiBpZCwgbmV2ZXIgdW5kZXIgdGhlIHJhd1xuICAvLyBuYXRpb25hbCBJRCBcdTIwMTQgcXVlcnkgLyBleHBvcnQgYnkgdGhlIGhhc2hlZCBmb3JtLlxuICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKG92LmlkX25vKTtcbiAgdHJ5IHtcbiAgICBjb25zdCBwciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9QYXRpZW50LyR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWAsIHsgaGVhZGVycyB9KTtcbiAgICBpZiAocHIuc3RhdHVzID09PSA0MDQpIHtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiYWJzZW50XCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXByLm9rKSB7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImZhaWxcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgICBfcmVuZGVyRGF0YVN0YXRlKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBhdGllbnQgPSBhd2FpdCBwci5qc29uKCk7XG4gICAgY29uc3QgbGFzdFVwZGF0ZWQgPSBwYXRpZW50Py5tZXRhPy5sYXN0VXBkYXRlZCA/PyBudWxsO1xuICAgIC8vIENvdW50IHZpYSAvZmhpci9leHBvcnQgXHUyMDE0IHNsaWdodGx5IGhlYXZpZXIgYnV0IGl0J3MgdGhlIG9ubHlcbiAgICAvLyBvZmYtdGhlLXNoZWxmIHdheSB0byBnZXQgdG90YWwgcmVzb3VyY2VzIGZvciBhIHBhdGllbnQuIENhcCBieVxuICAgIC8vIDVzIHRpbWVvdXQgc28gYSBzbG93IGJhY2tlbmQgZG9lc24ndCBsb2NrIHRoZSBwb3B1cCBmb3JldmVyLlxuICAgIGxldCBjb3VudCA9IDA7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGN0cmwgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gY3RybC5hYm9ydCgpLCA1MDAwKTtcbiAgICAgIGNvbnN0IGVyID0gYXdhaXQgZmV0Y2goYCR7dXJsfS9maGlyL2V4cG9ydD9wYXRpZW50PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWAsIHtcbiAgICAgICAgaGVhZGVycywgc2lnbmFsOiBjdHJsLnNpZ25hbCxcbiAgICAgIH0pO1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIGlmIChlci5vaykge1xuICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCBlci5qc29uKCk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJ1bmRsZS5lbnRyeSkpIGNvdW50ID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHsgLyogbGVhdmUgY291bnQgPSAwOyBub3QgZmF0YWwgKi8gfVxuICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwicHJlc2VudFwiLCBjb3VudCwgbGFzdFVwZGF0ZWQgfTtcbiAgfSBjYXRjaCAoX2UpIHtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImZhaWxcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gIH1cbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwdXNoTG9jYWxCdW5kbGVUb0JhY2tlbmQoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3Y/LmlkX25vIHx8ICFfbG9jYWxCdW5kbGUuZXhpc3RzIHx8IF9sb2NhbEJ1bmRsZS5wYXRpZW50SWQgIT09IG92LmlkX25vKSByZXR1cm47XG4gIGNvbnN0IHVybCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gIGNvbnN0IGtleSA9IGVscy5zeW5jQXBpS2V5LnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgaGVhZGVycyA9IHtcbiAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAuLi4oa2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGtleSB9IDoge30pLFxuICB9O1xuICBlbHMucHVzaExvY2FsQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50ZXh0Q29udGVudCA9IFwiXHU0RTBBXHU1MEIzXHU0RTJEXHUyMDI2XCI7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBbUEVORElOR19CVU5ETEVfS0VZXTogcGVuZGluZyB9ID1cbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICAgIGlmICghcGVuZGluZz8uanNvbikgdGhyb3cgbmV3IEVycm9yKFwibm8gbG9jYWwgYnVuZGxlXCIpO1xuICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvaW1wb3J0YCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIiwgaGVhZGVycywgYm9keTogcGVuZGluZy5qc29uLFxuICAgIH0pO1xuICAgIGlmICghci5vaykge1xuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHIudGV4dCgpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7ci5zdGF0dXN9OiAke3RleHQuc2xpY2UoMCwgMTIwKX1gKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgci5qc29uKCk7XG4gICAgc2V0U3RhdHVzKGBcdTI3MDUgXHU1REYyXHU0RTBBXHU1MEIzICR7cmVzdWx0LmltcG9ydGVkID8/IFwiP1wifSBcdTdCNDZcdTUyMzBcdTVGOENcdTdBRUZgLCBcInN1Y2Nlc3NcIik7XG4gICAgYXdhaXQgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgc2V0U3RhdHVzKGBcdTI2RDQgXHU0RTBBXHU1MEIzXHU1OTMxXHU2NTU3XHVGRjFBJHtlLm1lc3NhZ2V9YCwgXCJlcnJvclwiKTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBfcmVuZGVyRGF0YVN0YXRlKCkgKGFscmVhZHkgY2FsbGVkIGZyb20gY2hlY2tCYWNrZW5kUGF0aWVudCBvblxuICAgIC8vIHN1Y2Nlc3MpIGRlY2lkZXMgdGhlIHJpZ2h0IGRpc2FibGVkIHN0YXRlICsgbGFiZWwgYmFzZWQgb25cbiAgICAvLyB3aGV0aGVyIGJhY2tlbmQgYW5kIGxvY2FsIGFncmVlLiBDYWxsIGl0IGhlcmUgdG9vIHRvIGNvdmVyIHRoZVxuICAgIC8vIGZhaWx1cmUgcGF0aCB0aGF0IHNraXBwZWQgY2hlY2tCYWNrZW5kUGF0aWVudC5cbiAgICBfcmVuZGVyRGF0YVN0YXRlKCk7XG4gIH1cbn1cblxuZWxzLnB1c2hMb2NhbEJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1c2hMb2NhbEJ1bmRsZVRvQmFja2VuZCk7XG5cbi8vIFwiXHVEODNEXHVERDE3IFx1OTU4Qlx1NTU1Rlx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NzY3Qlx1NTE2NVwiIFx1MjAxNCBvcGVucyB0aGUgTkhJIGxhbmRpbmcgcGFnZSBzbyB0aGUgdXNlclxuLy8gZG9lc24ndCBoYXZlIHRvIHJlbWVtYmVyIC8gZ29vZ2xlIHRoZSBVUkwuIENsb3NlcyB0aGUgcG9wdXAgc29cbi8vIHRoZXkgZG9uJ3QgaGF2ZSB0byBkaXNtaXNzIGl0IG1hbnVhbGx5IGFmdGVyIHRoZSBuZXcgdGFiIG9wZW5zLlxuZWxzLm9wZW5OaGlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gIGF3YWl0IGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogTkhJX0xBTkRJTkcgfSk7XG4gIHdpbmRvdy5jbG9zZSgpO1xufSk7XG5cbi8vIExvY2FsIGJ1bmRsZSBzdGF0ZSBjaGFuZ2VzIHdoZW5ldmVyIHRoZSBTVyBzdGFzaGVzIGEgbmV3IHN5bmMuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIGFyZWEpID0+IHtcbiAgaWYgKGFyZWEgPT09IFwibG9jYWxcIiAmJiBQRU5ESU5HX0JVTkRMRV9LRVkgaW4gY2hhbmdlcykgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG59KTtcblxuLy8gXHUyNTAwXHUyNTAwIFN5bmMgbW9kZSAobG9jYWwgfCBiYWNrZW5kKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmFzeW5jIGZ1bmN0aW9uIGxvYWRTeW5jTW9kZSgpIHtcbiAgY29uc3QgeyBzeW5jTW9kZSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic3luY01vZGVcIik7XG4gIGNvbnN0IG1vZGUgPSBzeW5jTW9kZSA9PT0gXCJiYWNrZW5kXCIgPyBcImJhY2tlbmRcIiA6IERFRkFVTFRfTU9ERTtcbiAgZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHIuY2hlY2tlZCA9IHIudmFsdWUgPT09IG1vZGU7XG4gIGRvY3VtZW50LmJvZHkuZGF0YXNldC5tb2RlID0gbW9kZTtcbiAgaWYgKG1vZGUgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgLy8gQXV0by10ZXN0IG9uIG9wZW4gc28gdGhlIHVzZXIgc2VlcyBzdGF0dXMgd2l0aG91dCBjbGlja2luZy4gQXdhaXRpbmdcbiAgICAvLyBoZXJlIHNlcmlhbGl6ZXMgdGhlIHJlc3Qgb2YgaW5pdCgpIHVudGlsIHdlIGtub3cgdGhlIGFuc3dlci5cbiAgICBhd2FpdCB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgfSBlbHNlIHtcbiAgICBfY29ublN0YXRlID0gXCJ1bmtub3duXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjdXJyZW50TW9kZSgpIHtcbiAgZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIGlmIChyLmNoZWNrZWQpIHJldHVybiByLnZhbHVlO1xuICByZXR1cm4gREVGQVVMVF9NT0RFO1xufVxuXG5mb3IgKGNvbnN0IHIgb2YgZWxzLm1vZGVSYWRpb3MoKSkge1xuICByLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGUgPSBjdXJyZW50TW9kZSgpO1xuICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5tb2RlID0gbW9kZTtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jTW9kZTogbW9kZSB9KTtcbiAgICBpZiAobW9kZSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICAgIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpOyAvLyB0cmlnZ2VycyBjaGVja0JhY2tlbmRQYXRpZW50IG9uIHN1Y2Nlc3NcbiAgICB9IGVsc2Uge1xuICAgICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJ1bmtub3duXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmVscy5iYWNrZW5kVXJsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBiYWNrZW5kVXJsOiBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkgfSk7XG4gIGVscy5kYXNoYm9hcmRMaW5rLmhyZWYgPSBlbHMuYmFja2VuZFVybC52YWx1ZS5yZXBsYWNlKC86ODAxMC4qJC8sIFwiOjMwMTBcIik7XG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG59KTtcbmVscy5zeW5jQXBpS2V5LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jQXBpS2V5OiBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCkgfSk7XG59KTtcbi8vIFNpZGViYXIgXCJcdUQ4M0RcdURDQ0IgXHU1MkE5XHU3NDA2XCIgdG9nZ2xlIFx1MjAxNCBwZXJzaXN0cyBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCBzbyB0aGVcbi8vIHByZWZlcmVuY2UgaXMgc3RpY2t5IGFjcm9zcyByZWluc3RhbGxzLiBzaWRlYmFyLmpzIGxpc3RlbnMgdG8gdGhlXG4vLyBzYW1lIGtleSBhbmQgaGlkZXMgaXRzZWxmIHdoZW4gc2V0IHRvIGZhbHNlLlxuYXN5bmMgZnVuY3Rpb24gbG9hZFNpZGViYXJFbmFibGVkKCkge1xuICBjb25zdCB7IHNpZGViYXJFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJzaWRlYmFyRW5hYmxlZFwiKTtcbiAgZWxzLnNpZGViYXJFbmFibGVkLmNoZWNrZWQgPSBzaWRlYmFyRW5hYmxlZCAhPT0gZmFsc2U7IC8vIGRlZmF1bHQgT05cbn1cblxuZWxzLnNpZGViYXJFbmFibGVkPy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2lkZWJhckVuYWJsZWQ6IGVscy5zaWRlYmFyRW5hYmxlZC5jaGVja2VkIH0pO1xufSk7XG5cbi8vIE1hc2stcGF0aWVudC1uYW1lIHRvZ2dsZSBcdTIwMTQgZGVmYXVsdHMgT0ZGIChjaXRpemVucyBkb3dubG9hZGluZyB0aGVpclxuLy8gb3duIGRhdGEgZG9uJ3QgbmVlZCBhbm9ueW1pemF0aW9uKS4gV2hlbiBPTjogcG9wdXAgc3VtbWFyeSwgRkhJUlxuLy8gQnVuZGxlIG91dHB1dCwgc3luYy1sb2csIGFuZCBOSEkgcmVwb3J0IG5hcnJhdGl2ZSBhbGwgdXNlIHRoZVxuLy8gbWFza2VkIGZvcm0gKFx1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU5MEVET1x1NjVCMCkgaW5zdGVhZCBvZiB0aGUgcmVhbCBuYW1lLlxubGV0IF9tYXNrTmFtZUVuYWJsZWQgPSBmYWxzZTtcbmFzeW5jIGZ1bmN0aW9uIGxvYWRNYXNrTmFtZUVuYWJsZWQoKSB7XG4gIGNvbnN0IHsgbWFza05hbWVFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJtYXNrTmFtZUVuYWJsZWRcIik7XG4gIF9tYXNrTmFtZUVuYWJsZWQgPSBtYXNrTmFtZUVuYWJsZWQgPT09IHRydWU7XG4gIGlmIChlbHMubWFza05hbWVFbmFibGVkKSBlbHMubWFza05hbWVFbmFibGVkLmNoZWNrZWQgPSBfbWFza05hbWVFbmFibGVkO1xufVxuXG5mdW5jdGlvbiBfbWF5YmVNYXNrKG5hbWUpIHtcbiAgcmV0dXJuIF9tYXNrTmFtZUVuYWJsZWQgPyBtYXNrTmFtZShuYW1lKSA6IG5hbWUgfHwgXCJcIjtcbn1cblxuZWxzLm1hc2tOYW1lRW5hYmxlZD8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBhc3luYyAoKSA9PiB7XG4gIF9tYXNrTmFtZUVuYWJsZWQgPSBlbHMubWFza05hbWVFbmFibGVkLmNoZWNrZWQ7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IG1hc2tOYW1lRW5hYmxlZDogX21hc2tOYW1lRW5hYmxlZCB9KTtcbiAgLy8gUmUtcmVuZGVyIHBvcHVwIGNocm9tZSAoc3VtbWFyeSBsaW5lIGlzIHRoZSBvbmx5IHNwb3QgdGhhdCByZWFkc1xuICAvLyBfbWF5YmVNYXNrIHJlYWN0aXZlbHk7IGV2ZXJ5d2hlcmUgZWxzZSBzYW1wbGVzIGl0IGp1c3QtaW4tdGltZSkuXG4gIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkoKTtcbn0pO1xuXG5lbHMuc21hcnRBcHBVcmwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIC8vIFBlcnNpc3QgdHJpbW1lZCB2YWx1ZS4gRW1wdHkgc3RyaW5nIFx1MjE5MiByZXN0b3JlIGRlZmF1bHQgb24gbmV4dCBsb2FkLlxuICBjb25zdCB2ID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKTtcbiAgaWYgKHYpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzbWFydEFwcExhdW5jaFVybDogdiB9KTtcbiAgfSBlbHNlIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoXCJzbWFydEFwcExhdW5jaFVybFwiKTtcbiAgICBlbHMuc21hcnRBcHBVcmwudmFsdWUgPSBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBzZXRTdGF0dXModGV4dCwga2luZCwgYnJlYWtkb3duKSB7XG4gIC8vIEJ1aWxkIHdpdGggRE9NIEFQSSBcdTIwMTQgYXZvaWRzIGlubmVySFRNTCAvIFhTUyByaXNrLlxuICAvLyBicmVha2Rvd24gaXMgYW4gYXJyYXkgb2YgbWl4ZWQgZW50cmllczpcbiAgLy8gICAtIHBoYXNlIHRpbWluZ3MgcHJlZml4ZWQgd2l0aCBcIlx1MjNGMVwiICBcdTIxOTIgXHU5NjhFXHU2QkI1XHU4MDE3XHU2NjQyXG4gIC8vICAgLSBwZXItZW5kcG9pbnQgY291bnRzICAgICAgICAgICAgICAgIFx1MjE5MiBcdTU0MDQgZW5kcG9pbnQgXHU2MjkzXHU1MjMwXHU1RTdFXHU3QjQ2XG4gIC8vIEJvdGgga2luZHMgYXJlIHR1Y2tlZCBpbnNpZGUgYSBzaW5nbGUgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIiB0b2dnbGUgc28gdGhlXG4gIC8vIHBvcHVwIHN0YXlzIGNvbXBhY3QgYnkgZGVmYXVsdC5cbiAgZWxzLnN0YXR1cy5jbGFzc05hbWUgPSBraW5kIHx8IFwiXCI7XG4gIGVscy5zdGF0dXMudGV4dENvbnRlbnQgPSBcIlwiO1xuICBpZiAoIXRleHQgJiYgIShicmVha2Rvd24gJiYgYnJlYWtkb3duLmxlbmd0aCkpIHJldHVybjtcbiAgZWxzLnN0YXR1cy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0IHx8IFwiXCIpKTtcbiAgaWYgKGJyZWFrZG93biAmJiBicmVha2Rvd24ubGVuZ3RoKSB7XG4gICAgY29uc3QgcGhhc2VSb3dzID0gYnJlYWtkb3duLmZpbHRlcigoYikgPT4gYi5zdGFydHNXaXRoKFwiXHUyM0YxXCIpKTtcbiAgICBjb25zdCBvdGhlclJvd3MgPSBicmVha2Rvd24uZmlsdGVyKChiKSA9PiAhYi5zdGFydHNXaXRoKFwiXHUyM0YxXCIpKTtcblxuICAgIGNvbnN0IGRldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGV0YWlsc1wiKTtcbiAgICBkZXRhaWxzLmNsYXNzTmFtZSA9IFwic3RhdHVzLWRldGFpbFwiO1xuICAgIGNvbnN0IHN1bW1hcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3VtbWFyeVwiKTtcbiAgICBzdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIjtcbiAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHN1bW1hcnkpO1xuXG4gICAgaWYgKG90aGVyUm93cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgYm9keS5jbGFzc05hbWUgPSBcInN0YXR1cy1icmVha2Rvd25cIjtcbiAgICAgIC8vIE9uZSBpdGVtIHBlciBsaW5lIHNvIFwiXHU1QzMxXHU5MUFCIDEyIFx1N0I0NiAvIFx1ODY1NVx1NjVCOSA4OCBcdTdCNDYgLyBcdTZBQTJcdTlBNTcgNDEyIFx1N0I0NlwiXG4gICAgICAvLyBpcyByZWFkYWJsZTsgdGhlIDM2MHB4IHBvcHVwIHdvdWxkIGhhdmUgd3JhcHBlZCBhIGZsYXRcbiAgICAgIC8vIHNlcGFyYXRvci1qb2luZWQgc3RyaW5nIGludG8gYSB0YW5nbGVkIG1lc3MuXG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiBvdGhlclJvd3MpIHtcbiAgICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxpbmUudGV4dENvbnRlbnQgPSByb3c7XG4gICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQobGluZSk7XG4gICAgICB9XG4gICAgICBkZXRhaWxzLmFwcGVuZENoaWxkKGJvZHkpO1xuICAgIH1cbiAgICBpZiAocGhhc2VSb3dzLmxlbmd0aCkge1xuICAgICAgLy8gUGhhc2UgdGltaW5ncyBhcmUgZGV2IGluZm8gXHUyMDE0IHR1Y2sgdGhlbSBpbnNpZGUgYSBzZWNvbmQgdG9nZ2xlXG4gICAgICAvLyBzbyBlbmQgdXNlcnMgZG9uJ3Qgc2VlIFwibmhpLXBhcmFsbGVsPThzXCIgcmlnaHQgYWZ0ZXIgYSBzdWNjZXNzXG4gICAgICAvLyBiYW5uZXIgYW5kIHRoaW5rIHNvbWV0aGluZydzIHdyb25nLlxuICAgICAgY29uc3QgdGVjaERldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGV0YWlsc1wiKTtcbiAgICAgIHRlY2hEZXRhaWxzLmNsYXNzTmFtZSA9IFwic3RhdHVzLWRldGFpbCBzdGF0dXMtdGVjaFwiO1xuICAgICAgY29uc3QgdGVjaFN1bW1hcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3VtbWFyeVwiKTtcbiAgICAgIHRlY2hTdW1tYXJ5LnRleHRDb250ZW50ID0gXCJcdTYyODBcdTg4NTNcdTdEMzBcdTdCQzBcIjtcbiAgICAgIHRlY2hEZXRhaWxzLmFwcGVuZENoaWxkKHRlY2hTdW1tYXJ5KTtcbiAgICAgIGNvbnN0IHBoYXNlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBwaGFzZXMuY2xhc3NOYW1lID0gXCJzdGF0dXMtcGhhc2VzXCI7XG4gICAgICBwaGFzZXMudGV4dENvbnRlbnQgPSBwaGFzZVJvd3MubWFwKChwKSA9PiBwLnJlcGxhY2UoL15cdTIzRjFcXHMqLywgXCJcIikpLmpvaW4oXCIgXHUwMEI3IFwiKTtcbiAgICAgIHRlY2hEZXRhaWxzLmFwcGVuZENoaWxkKHBoYXNlcyk7XG4gICAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHRlY2hEZXRhaWxzKTtcbiAgICB9XG4gICAgZWxzLnN0YXR1cy5hcHBlbmRDaGlsZChkZXRhaWxzKTtcbiAgfVxuICAvLyBTdGF0dXMgdmlzaWJpbGl0eSBkcml2ZXMgd2hldGhlciB0aGUgcmVzdWx0IHpvbmUgc2hvd3MgYXQgYWxsLlxuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWN0aXZlVGFiKCkge1xuICBjb25zdCBbdGFiXSA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICByZXR1cm4gdGFiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGVuZGluZyBGSElSIEJ1bmRsZSAobG9jYWwtbW9kZSByZXN1bHQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEJhY2tncm91bmQgc3Rhc2hlcyB0aGUgZ2VuZXJhdGVkIEJ1bmRsZSBpbnRvIGNocm9tZS5zdG9yYWdlLmxvY2FsXG4vLyB1bmRlciBgcGVuZGluZ0ZoaXJCdW5kbGVgLiBQb3B1cCByZW5kZXJzIGEgZG93bmxvYWQgYnV0dG9uLiBVc2VyIG11c3Rcbi8vIGNsaWNrIHRvIGFjdHVhbGx5IHRyaWdnZXIgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBcdTIwMTQgdGhlIGZpbGUgbmV2ZXJcbi8vIGhpdHMgdGhlIGRpc2sgdW5zb2xpY2l0ZWQuXG5cbmZ1bmN0aW9uIF9mbXRCeXRlcyhuKSB7XG4gIGlmIChuIDwgMTAyNCkgcmV0dXJuIGAke259IEJgO1xuICBpZiAobiA8IDEwMjQgKiAxMDI0KSByZXR1cm4gYCR7KG4gLyAxMDI0KS50b0ZpeGVkKDEpfSBLQmA7XG4gIHJldHVybiBgJHsobiAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMil9IE1CYDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZyB8fCAhcGVuZGluZy5qc29uKSB7XG4gICAgZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gSWYgdGhlIHVzZXIgaGFzIHN3aXRjaGVkIG92ZXJyaWRlIHRvIGEgZGlmZmVyZW50IHBhdGllbnQsIHRoZVxuICAvLyBzdGFzaGVkIGJ1bmRsZSBpcyBmb3IgdGhlICpwcmV2aW91cyogcGF0aWVudC4gSGlkZSBpdCBzbyB0aGV5XG4gIC8vIGNhbid0IGFjY2lkZW50YWxseSBkb3dubG9hZCB0aGUgd3JvbmcgZmlsZS4gVGhlIGJ1bmRsZSBzdGF5cyBpblxuICAvLyBzdG9yYWdlOyByZS1lbnRlcmluZyB0aGUgbWF0Y2hpbmcgb3ZlcnJpZGUgd2lsbCBzdXJmYWNlIGl0IGFnYWluLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAob3Y/LmlkX25vICYmIHBlbmRpbmcucGF0aWVudElkICYmIHBlbmRpbmcucGF0aWVudElkICE9PSBvdi5pZF9ubykge1xuICAgIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IGZhbHNlO1xuICAvLyBVc2UgdGhlIHNoYXJlZCByZWxhdGl2ZS10aW1lIGhlbHBlciBzbyBcIjI2NiBcdTc5RDJcdTUyNERcIiBhdXRvLXJvbGxzIGludG9cbiAgLy8gXCI0IFx1NTIwNlx1OTQxOFx1NTI0RFwiIG9uY2UgdGhlIHVzZXIgbGVhdmVzIHRoZSBwb3B1cCBvcGVuIGZvciBhIHdoaWxlLlxuICBjb25zdCBhZ28gPSBwZW5kaW5nLmdlbmVyYXRlZEF0ID8gX2ZtdFJlbGF0aXZlKHBlbmRpbmcuZ2VuZXJhdGVkQXQpIDogXCJcIjtcbiAgLy8gUmVuZGVyIGluIHR3byBwaWVjZXMgc28gYSBsb25nIGZpbGVuYW1lIGdldHMgaXRzIG93biBsaW5lICsgZWxsaXBzaXMsXG4gIC8vIGFuZCB0aGUgc2l6ZSAvIGFnZSBpbmZvIHN0YXlzIGNvbXBhY3QgYmVsb3cgaXQuIEF2b2lkcyBcImZpbGVuYW1lIFx1MDBCN1xuICAvLyAxNjkuNyBLQiBcdTAwQjcgMSBcdTc5RDJcdTUyNERcIiB3cmFwcGluZyBhd2t3YXJkbHkgbWlkLXdvcmQgaW4gYSAzNjBweCBwb3B1cC5cbiAgZWxzLmJ1bmRsZU1ldGEudGV4dENvbnRlbnQgPSBcIlwiO1xuICBjb25zdCBmbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGZuYW1lLmNsYXNzTmFtZSA9IFwiYnVuZGxlLWZpbGVuYW1lXCI7XG4gIGZuYW1lLnRleHRDb250ZW50ID0gcGVuZGluZy5maWxlbmFtZTtcbiAgZm5hbWUudGl0bGUgPSBwZW5kaW5nLmZpbGVuYW1lO1xuICBjb25zdCBzaXplQWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgc2l6ZUFnZS5jbGFzc05hbWUgPSBcImJ1bmRsZS1zaXplYWdlXCI7XG4gIHNpemVBZ2UudGV4dENvbnRlbnQgPSBgJHtfZm10Qnl0ZXMocGVuZGluZy5ieXRlcyB8fCAwKX0ke2FnbyA/IGAgXHUwMEI3ICR7YWdvfWAgOiBcIlwifWA7XG4gIGVscy5idW5kbGVNZXRhLmFwcGVuZENoaWxkKGZuYW1lKTtcbiAgZWxzLmJ1bmRsZU1ldGEuYXBwZW5kQ2hpbGQoc2l6ZUFnZSk7XG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkb3dubG9hZFBlbmRpbmdCdW5kbGUoKSB7XG4gIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGlmICghcGVuZGluZykgcmV0dXJuO1xuICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3BlbmRpbmcuanNvbl0sIHsgdHlwZTogXCJhcHBsaWNhdGlvbi9maGlyK2pzb25cIiB9KTtcbiAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkKHsgdXJsLCBmaWxlbmFtZTogcGVuZGluZy5maWxlbmFtZSwgc2F2ZUFzOiBmYWxzZSB9KTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBSZWxlYXNlIGFmdGVyIGEgdGljayBzbyB0aGUgZG93bmxvYWQgaGFzIHRpbWUgdG8gc3RhcnQuXG4gICAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDUwMDApO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNsZWFyUGVuZGluZ0J1bmRsZSgpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFBFTkRJTkdfQlVORExFX0tFWSk7XG4gIGF3YWl0IHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG4gIC8vIENsZWFyaW5nIHRoZSBkb3dubG9hZCBpcyB0aGUgdXNlcidzIFwiSSdtIGRvbmUgd2l0aCB0aGlzIHJlc3VsdFwiXG4gIC8vIGdlc3R1cmUgXHUyMDE0IHdpcGUgdGhlIGNvbXBsZXRpb24gc3RhdHVzIGJhbm5lciB0b28gc28gdGhlIHJlc3VsdCB6b25lXG4gIC8vIGNvbGxhcHNlcyBlbnRpcmVseSBpbnN0ZWFkIG9mIGxpbmdlcmluZyB3aXRoIGEgc3RhbGUgXCJcdTI3MDUgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwXCJcbiAgLy8gYW5kIG5vIGRvd25sb2FkIGJ1dHRvbiBuZXh0IHRvIGl0LlxuICBfbGF0ZXN0U3RhdHVzID0gbnVsbDtcbiAgc2V0U3RhdHVzKFwiXCIsIG51bGwpO1xuICBhd2FpdCBjaHJvbWUucnVudGltZVxuICAgIC5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiY2xlYXJTeW5jU3RhdHVzXCIgfSlcbiAgICAuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5lbHMuZG93bmxvYWRCdW5kbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRvd25sb2FkUGVuZGluZ0J1bmRsZSk7XG5lbHMuY2xlYXJCdW5kbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsZWFyUGVuZGluZ0J1bmRsZSk7XG5cbi8vIExpdmUgdXBkYXRlIHdoZW4gYmFja2dyb3VuZCBzdGFzaGVzIGEgbmV3IGJ1bmRsZSB3aGlsZSBwb3B1cCBpcyBvcGVuLlxuLy8gKE5vdGU6IGFub3RoZXIgb25DaGFuZ2VkIGxpc3RlbmVyIGVhcmxpZXIgaW4gdGhlIGZpbGUgcmVmcmVzaGVzIHRoZVxuLy8gZGF0YS1zdGF0ZSBjYXJkOyB3ZSBsZWF2ZSB0aGF0IG9uZSBzZXBhcmF0ZSBzbyBmYWlsdXJlIG9mIGVpdGhlciBwYXRoXG4vLyBkb2Vzbid0IHRha2UgdGhlIG90aGVyIGRvd24uKVxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgUEVORElOR19CVU5ETEVfS0VZIGluIGNoYW5nZXMpIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCk7XG59KTtcblxuLy8gQmFja2dyb3VuZC1zaWRlIGZsb3cgY2FuIG11dGF0ZSB0aGUgcGF0aWVudE92ZXJyaWRlIG1pZC1zeW5jIFx1MjAxNCBtb3N0XG4vLyBpbXBvcnRhbnRseSBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkgc3dhcHMgdGhlIGF1dG8tWFhYWFhYWFhcbi8vIHBsYWNlaG9sZGVyIGZvciB0aGUgcmVhbCBOSEkgY2lkLiBXaXRob3V0IHRoaXMgbGlzdGVuZXIgdGhlIHBvcHVwXG4vLyBpbnB1dHMgc3RheWVkIHN0YWxlLCByZWZyZXNoUGVuZGluZ0J1bmRsZSdzIHBhdGllbnQtbWF0Y2ggY2hlY2tcbi8vIHRoZW4gY29tcGFyZWQgb2xkIGlucHV0IHZhbHVlIHZzLiBmcmVzaCBidW5kbGUucGF0aWVudElkIGFuZCBoaWRcbi8vIHRoZSBkb3dubG9hZCBidXR0b24uIFJlbG9hZCB0aGUgb3ZlcnJpZGUgaW50byB0aGUgaW5wdXRzIHdoZW5ldmVyXG4vLyBzdG9yYWdlIGNoYW5nZXMgc28gZXZlcnkgZG93bnN0cmVhbSBndWFyZCBzZWVzIGNvbnNpc3RlbnQgdmFsdWVzLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgY2hhbmdlcy5wYXRpZW50T3ZlcnJpZGUpIGxvYWRQYXRpZW50T3ZlcnJpZGUoKTtcbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgXHUyNEQ4IEhlbHAtaWNvbiB0b29sdGlwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIE9uZSBzaGFyZWQgPGRpdj4gYXBwZW5kZWQgdG8gdGhlIHBvcHVwIGJvZHkuIE9uIGhvdmVyIG9mIGFueVxuLy8gLmhlbHAtaWNvbiwgd2UgY29weSBpdHMgZGF0YS10aXAgdGV4dCBhbmQgcG9zaXRpb24gdGhlIHRvb2x0aXBcbi8vIGluc2lkZSB0aGUgcG9wdXAsIGNsYW1waW5nIHRvIGl0cyB2aWV3cG9ydCBzbyBpdCBjYW4ndCBjbGlwIG9mZlxuLy8gZWl0aGVyIGVkZ2UgcmVnYXJkbGVzcyBvZiB3aGVyZSB0aGUgaWNvbiBzaXRzLiAoQ1NTIHBzZXVkby1lbGVtZW50c1xuLy8gY2FuJ3QgYmUgbWVhc3VyZWQsIHNvIGEgcHVyZS1DU1MgYXBwcm9hY2ggaW5ldml0YWJseSBwaWNrcyBvbmVcbi8vIGFuY2hvciBzaWRlIGFuZCBicmVha3MgZm9yIGljb25zIG9uIHRoZSBvdGhlciBzaWRlIG9mIHRoZSBwb3B1cC4pXG5jb25zdCBfaGVscFRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5faGVscFRpcC5jbGFzc05hbWUgPSBcImhlbHAtdG9vbHRpcFwiO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChfaGVscFRpcCk7XG5cbmNvbnN0IFZJRVdQT1JUX01BUkdJTiA9IDY7IC8vIGtlZXAgdGhpcyBtYW55IHB4IGNsZWFyIG9mIHBvcHVwIGVkZ2VzXG5cbmZ1bmN0aW9uIF9zaG93SGVscFRvb2x0aXAoaWNvbikge1xuICBfaGVscFRpcC50ZXh0Q29udGVudCA9IGljb24uZGF0YXNldC50aXAgfHwgaWNvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRpcFwiKSB8fCBcIlwiO1xuICBfaGVscFRpcC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKTtcblxuICAvLyBNZWFzdXJlIG5vdyB0aGF0IGNvbnRlbnQgaXMgc2V0LlxuICBjb25zdCBpY29uUmVjdCA9IGljb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHRpcFJlY3QgPSBfaGVscFRpcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3Qgdmlld3BvcnRXID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICBjb25zdCB2aWV3cG9ydEggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXG4gIC8vIEhvcml6b250YWw6IHByZWZlciBjZW50ZXJlZCBvbiB0aGUgaWNvbjsgY2xhbXAgaW50byBbbWFyZ2luLCB2dy10aXAtbWFyZ2luXS5cbiAgbGV0IGxlZnQgPSBpY29uUmVjdC5sZWZ0ICsgaWNvblJlY3Qud2lkdGggLyAyIC0gdGlwUmVjdC53aWR0aCAvIDI7XG4gIGlmIChsZWZ0IDwgVklFV1BPUlRfTUFSR0lOKSBsZWZ0ID0gVklFV1BPUlRfTUFSR0lOO1xuICBpZiAobGVmdCArIHRpcFJlY3Qud2lkdGggPiB2aWV3cG9ydFcgLSBWSUVXUE9SVF9NQVJHSU4pIHtcbiAgICBsZWZ0ID0gdmlld3BvcnRXIC0gVklFV1BPUlRfTUFSR0lOIC0gdGlwUmVjdC53aWR0aDtcbiAgfVxuICAvLyBWZXJ0aWNhbDogcHJlZmVyIGFib3ZlIHRoZSBpY29uOyBmbGlwIGJlbG93IGlmIHRoZXJlJ3Mgbm8gcm9vbSB1cCB0b3AuXG4gIGxldCB0b3AgPSBpY29uUmVjdC50b3AgLSB0aXBSZWN0LmhlaWdodCAtIDY7XG4gIGlmICh0b3AgPCBWSUVXUE9SVF9NQVJHSU4pIHRvcCA9IGljb25SZWN0LmJvdHRvbSArIDY7XG4gIC8vIEZpbmFsIHNhZmV0eTogY2xhbXAgaW50byB2aWV3cG9ydCBzbyB2ZXJ5IGxvbmcgdG9vbHRpcHMgY2FuJ3QgYmxlZWRcbiAgLy8gb2ZmIHRoZSBib3R0b20gZWl0aGVyLlxuICBpZiAodG9wICsgdGlwUmVjdC5oZWlnaHQgPiB2aWV3cG9ydEggLSBWSUVXUE9SVF9NQVJHSU4pIHtcbiAgICB0b3AgPSBNYXRoLm1heChWSUVXUE9SVF9NQVJHSU4sIHZpZXdwb3J0SCAtIFZJRVdQT1JUX01BUkdJTiAtIHRpcFJlY3QuaGVpZ2h0KTtcbiAgfVxuXG4gIF9oZWxwVGlwLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgX2hlbHBUaXAuc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcbn1cblxuZnVuY3Rpb24gX2hpZGVIZWxwVG9vbHRpcCgpIHtcbiAgX2hlbHBUaXAuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG59XG5cbi8vIERlbGVnYXRlZCBob3ZlciBoYW5kbGVycyBcdTIwMTQgd29ya3MgZm9yIGljb25zIGFkZGVkIGFmdGVyIHBvcHVwIGxvYWQgdG9vXG4vLyAoZS5nLiB3aGVuIG1vZGUgdG9nZ2xlIHJldmVhbHMgYmFja2VuZC1vbmx5IGZpZWxkcykuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIChlKSA9PiB7XG4gIGNvbnN0IGljb24gPSBlLnRhcmdldC5jbG9zZXN0Py4oXCIuaGVscC1pY29uXCIpO1xuICBpZiAoaWNvbikgX3Nob3dIZWxwVG9vbHRpcChpY29uKTtcbn0pO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIChlKSA9PiB7XG4gIGNvbnN0IGljb24gPSBlLnRhcmdldC5jbG9zZXN0Py4oXCIuaGVscC1pY29uXCIpO1xuICBpZiAoaWNvbikgX2hpZGVIZWxwVG9vbHRpcCgpO1xufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XG4gIGF3YWl0IGxvYWRTaWRlYmFyRW5hYmxlZCgpO1xuICBhd2FpdCBsb2FkTWFza05hbWVFbmFibGVkKCk7XG5cbiAgLy8gU2VlZCBsb2NhbCBidW5kbGUgc3RhdGUgZnJvbSBzdG9yYWdlIHNvIHRoZSBkYXRhLXN0YXRlIGNhcmQgaXNcbiAgLy8gcG9wdWxhdGVkIGFzIHNvb24gYXMgdGhlIHBvcHVwIHJlbmRlcnMgKG5vIGZsYXNoIG9mIFwiXHU2NzJBXHU3NTIyXHU3NTFGXCIpLlxuICBhd2FpdCBfcmVmcmVzaExvY2FsQnVuZGxlU3RhdGUoKTtcblxuICAvLyBPcmRlciBtYXR0ZXJzOiBsb2FkQmFja2VuZFVybCBwb3B1bGF0ZXMgZWxzLmJhY2tlbmRVcmwudmFsdWUsIHdoaWNoXG4gIC8vIGxvYWRTeW5jTW9kZSgpIHJlYWRzIHZpYSB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKS4gUmV2ZXJzZSB0aGlzIGFuZFxuICAvLyB0aGUgYXV0by10ZXN0IHNlZXMgYW4gZW1wdHkgVVJMIGFuZCBmYWxzZWx5IHJlcG9ydHMgXCJcdTY3MkFcdThBMkRcdTVCOUEgQmFja2VuZCBVUkxcIlxuICAvLyBvbiBldmVyeSBwb3B1cCBvcGVuLlxuICBhd2FpdCBsb2FkQmFja2VuZFVybCgpO1xuICBhd2FpdCBsb2FkU3luY01vZGUoKTtcbiAgYXdhaXQgbG9hZFBhdGllbnRPdmVycmlkZSgpO1xuICBhd2FpdCByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuXG4gIGNvbnN0IHRhYiA9IGF3YWl0IGdldEFjdGl2ZVRhYigpO1xuICBpZiAoIXRhYj8udXJsKSB7XG4gICAgc2V0U3RhdHVzKFwibm8gYWN0aXZlIHRhYlwiLCBcImVycm9yXCIpO1xuICAgIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpID0gXCIxXCI7XG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBTeW5jIHJlcXVpcmVzIGJlaW5nIG9uIGFuIE5ISSB0YWIgc28gY29va2llcy9zZXNzaW9uIGFyZSB1c2FibGUgZnJvbVxuICAvLyB0aGUgU1cuIEZsYWcgdmlhIGRhdGFzZXQgc28gX3JlZnJlc2hCdXR0b25TdGF0ZXMgY2FuIGNvbWJpbmUgdGhpc1xuICAvLyB3aXRoIHRoZSBtb2RlICsgY29ubiBzdGF0ZS4gV2hlbiBvZmYtTkhJLCBhbHNvIHN1cmZhY2UgdGhlXG4gIC8vIFwiXHVEODNEXHVERDE3IFx1OTU4Qlx1NTU1Rlx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NzY3Qlx1NTE2NVwiIGJhbm5lciBzbyB1c2VycyBkb24ndCB3b25kZXIgd2hlcmUgdG8gZ28uXG4gIGNvbnN0IG9uTmhpID0gaXNOaGlUYWIodGFiLnVybCk7XG4gIGlmIChvbk5oaSkgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBlbHNlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpID0gXCIxXCI7XG4gIGlmIChlbHMub3Blbk5oaVNlY3Rpb24pIGVscy5vcGVuTmhpU2VjdGlvbi5oaWRkZW4gPSBvbk5oaTtcblxuICAvLyBXaGVuIG9uIHRoZSBOSEkgdGFiLCBhc2sgYmFja2dyb3VuZCB0byB2ZXJpZnkgdGhlcmUncyBhbiBhY3RpdmVcbiAgLy8gc2Vzc2lvbi4gVGhlIFNXIHByb2JlcyBJSEtFMzQxMCB3aXRoIHNlc3Npb25TdG9yYWdlLnRva2VuIFx1MjAxNCBjaGVhcFxuICAvLyBhbmQgb25seSBzdWNjZWVkcyB3aGVuIHRoZSB1c2VyIGhhcyBsb2dnZWQgaW4uIEFueXRoaW5nIGJ1dCBgdHJ1ZWBcbiAgLy8gKGZhbHNlLCBudWxsLCBvciBubyByZXNwb25zZSkgbWFrZXMgdXMgYXNzdW1lIFwibm90IGxvZ2dlZCBpblwiIHNvXG4gIC8vIHRoZSB1c2VyIHNlZXMgdGhlIGFjdGlvbmFibGUgYmFubmVyIGluc3RlYWQgb2YgbWFzaGluZyB0aGUgQ1RBXG4gIC8vIGludG8gYSBkZWxheWVkIFwiXHVEODNEXHVERDEyIFx1NUMxQVx1NjcyQVx1NzY3Qlx1NTE2NVwiIHN0YXR1cy5cbiAgaWYgKG9uTmhpICYmIHRhYi5pZCkge1xuICAgIGNocm9tZS5ydW50aW1lXG4gICAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImNoZWNrTmhpTG9naW5cIiwgdGFiSWQ6IHRhYi5pZCB9KVxuICAgICAgLnRoZW4oKHJlc3ApID0+IHtcbiAgICAgICAgY29uc3QgbG9nZ2VkSW4gPSByZXNwPy5sb2dnZWRJbiA9PT0gdHJ1ZTtcbiAgICAgICAgaWYgKGxvZ2dlZEluKSBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbjtcbiAgICAgICAgZWxzZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluID0gXCJub1wiO1xuICAgICAgICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKSB7XG4gICAgICAgICAgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9IGxvZ2dlZEluO1xuICAgICAgICB9XG4gICAgICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICAgIC8vIExvZ2luIHByb2JlIGNvbXBsZXRpbmcgcG9zaXRpdmVseSBpcyB0aGUgc3RlcC0xIGludGVudGlvbmFsXG4gICAgICAgIC8vIGNvbXBsZXRpb24gZXZlbnQgXHUyMDE0IGFkdmFuY2UgdGhlIHdpemFyZCBvbmNlIGlmIHRoZSB1c2VyIGlzXG4gICAgICAgIC8vIGN1cnJlbnRseSBsb29raW5nIGF0IHN0ZXAgMS5cbiAgICAgICAgaWYgKGxvZ2dlZEluICYmIF93aXphcmRJbml0aWFsaXplZCkgX21heWJlQXV0b0FkdmFuY2UoKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAvLyBJZiB0aGUgcHJvYmUgZmFpbHMgKFNXIHVucmVhY2hhYmxlLCBldGMpLCBkb24ndCBwdW5pc2ggdGhlXG4gICAgICAgIC8vIHVzZXIgXHUyMDE0IGxlYXZlIHRoZSBDVEEgZW5hYmxlZCBhbmQgbGV0IHRoZSBzeW5jJ3Mgb3duIHNlc3Npb25cbiAgICAgICAgLy8gY2hlY2sgc3VyZmFjZSBhIHJlYWwgZXJyb3IgaWYgbmVlZGVkLlxuICAgICAgICBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbjtcbiAgICAgICAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbikgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbjtcbiAgICBpZiAoZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uKSBlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgfVxuXG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG5cbiAgLy8gU3RhcnQgdGhlIHdpemFyZCBBRlRFUiBhbGwgaW5pdGlhbCBzdGF0ZSBpcyBsb2FkZWQgXHUyMDE0IHRoaXMgcGlja3NcbiAgLy8gdGhlIGNvcnJlY3Qgc3RhcnRpbmcgc3RlcCAoZS5nLiByZXR1cm5pbmcgdXNlciB3aXRoIHZhbGlkIHNlc3Npb25cbiAgLy8gbGFuZHMgb24gc3RlcCAzIGRpcmVjdGx5KS5cbiAgX2luaXRXaXphcmQoKTtcblxuICAvLyBSZS1hdHRhY2ggdG8gYW55IHN5bmMgdGhhdCdzIGN1cnJlbnRseSBydW5uaW5nIGluIHRoZSBzZXJ2aWNlIHdvcmtlci5cbiAgLy8gVGhpcyBpcyB3aGF0IGxldHMgdGhlIHVzZXIgY2xvc2UgKyByZW9wZW4gdGhlIHBvcHVwIG1pZC1zeW5jLlxuICBhd2FpdCByZWZyZXNoU3luY1N0YXR1c0Zyb21CYWNrZ3JvdW5kKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hTeW5jU3RhdHVzRnJvbUJhY2tncm91bmQoKSB7XG4gIGNvbnN0IHN0YXR1cyA9IGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJnZXRTeW5jU3RhdHVzXCIgfSkuY2F0Y2goKCkgPT4gbnVsbCk7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIGFwcGx5U3luY1N0YXR1cyhzdGF0dXMpO1xufVxuXG4vLyBMYXRlc3Qgc3RhdHVzIHNuYXBzaG90IFx1MjAxNCBrZWVwaW5nIGl0IGxldHMgdGhlIGxpdmUtZWxhcHNlZCB0aWNrZXJcbi8vIHJlcGFpbnQgdGhlIHNhbWUgcHJvZ3Jlc3MgdGV4dCB3aXRoIGFuIHVwZGF0ZWQgYFtOc11gIHByZWZpeCBldmVyeVxuLy8gc2Vjb25kIHdpdGhvdXQgc3BhbW1pbmcgY2hyb21lLnN0b3JhZ2UgZnJvbSB0aGUgc2VydmljZSB3b3JrZXIuXG5sZXQgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG5sZXQgX2VsYXBzZWRUaWNrZXJJZCA9IG51bGw7XG5cbmZ1bmN0aW9uIF9mbXRFbGFwc2VkKG1zKSB7XG4gIGlmIChtcyA8IDYwXzAwMCkgcmV0dXJuIGAke01hdGguZmxvb3IobXMgLyAxMDAwKX1zYDtcbiAgcmV0dXJuIGAke01hdGguZmxvb3IobXMgLyA2MF8wMDApfW0ke01hdGgucm91bmQoKG1zICUgNjBfMDAwKSAvIDEwMDApfXNgO1xufVxuXG5mdW5jdGlvbiBfcmVuZGVyU3RhdHVzKCkge1xuICBjb25zdCBzdGF0dXMgPSBfbGF0ZXN0U3RhdHVzO1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBsZXQgdGV4dCA9IHN0YXR1cy5wcm9ncmVzcyB8fCBcIihzeW5jIFx1OTAzMlx1ODg0Q1x1NEUyRClcIjtcbiAgaWYgKHN0YXR1cy5ydW5uaW5nICYmIHN0YXR1cy5zdGFydGVkKSB7XG4gICAgY29uc3QgZWxhcHNlZCA9IERhdGUubm93KCkgLSBzdGF0dXMuc3RhcnRlZDtcbiAgICB0ZXh0ID0gYFx1MjNGMSAke19mbXRFbGFwc2VkKGVsYXBzZWQpfSBcdTAwQjcgJHt0ZXh0fWA7XG4gIH1cbiAgY29uc3Qga2luZCA9IHN0YXR1cy5ydW5uaW5nID8gXCJpbmZvXCIgOiAoc3RhdHVzLnBoYXNlID09PSBcImVycm9yXCIgPyBcImVycm9yXCIgOiBcInN1Y2Nlc3NcIik7XG4gIGNvbnN0IGJyZWFrZG93biA9IHN0YXR1cy5ydW5uaW5nID8gbnVsbCA6IHN0YXR1cy5icmVha2Rvd247XG4gIHNldFN0YXR1cyh0ZXh0LCBraW5kLCBicmVha2Rvd24pO1xufVxuXG5mdW5jdGlvbiBhcHBseVN5bmNTdGF0dXMoc3RhdHVzKSB7XG4gIGlmICghc3RhdHVzKSByZXR1cm47XG4gIF9sYXRlc3RTdGF0dXMgPSBzdGF0dXM7XG4gIF9yZW5kZXJTdGF0dXMoKTtcbiAgLy8gU3RhdHVzIGJhbm5lciBsaXZlcyBpbnNpZGUgc3RlcCAzIFx1MjAxNCBmb3JjZS1qdW1wIHRoZXJlIHNvIGl0J3NcbiAgLy8gYWN0dWFsbHkgdmlzaWJsZS4gUnVubmluZyBzeW5jIE9SIGEgZnJlc2ggY29tcGxldGlvbiBib3RoIHdhcnJhbnRcbiAgLy8gYmVpbmcgb24gdGhlIHJlc3VsdCBzdGVwLlxuICBpZiAoX3dpemFyZEluaXRpYWxpemVkICYmIF9hY3RpdmVTdGVwICE9PSAzKSB7XG4gICAgX3NldEFjdGl2ZVN0ZXAoMywgeyBzaWxlbnQ6IHRydWUgfSk7XG4gIH1cbiAgaWYgKHN0YXR1cy5ydW5uaW5nKSB7XG4gICAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIGVscy5zdG9wQnRuLmhpZGRlbiA9IGZhbHNlO1xuICAgIGlmICghX2VsYXBzZWRUaWNrZXJJZCkge1xuICAgICAgX2VsYXBzZWRUaWNrZXJJZCA9IHNldEludGVydmFsKF9yZW5kZXJTdGF0dXMsIDEwMDApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChfZWxhcHNlZFRpY2tlcklkKSB7XG4gICAgICBjbGVhckludGVydmFsKF9lbGFwc2VkVGlja2VySWQpO1xuICAgICAgX2VsYXBzZWRUaWNrZXJJZCA9IG51bGw7XG4gICAgfVxuICAgIC8vIFJlLWRlcml2ZSBzeW5jIGJ1dHRvbiBlbmFibGVkIHN0YXRlIGZyb20gbW9kZS9jb25uL05ISS10YWIgaW5zdGVhZFxuICAgIC8vIG9mIHVuY29uZGl0aW9uYWxseSBlbmFibGluZyBcdTIwMTQga2VlcHMgdGhlIGJ1dHRvbiBkaXNhYmxlZCB3aGVuIHdlXG4gICAgLy8ga25vdyB3ZSBzaG91bGRuJ3Qgc3luYyAoZS5nLiBiYWNrZW5kIGRvd24sIG9mZi1OSEkgdGFiKS5cbiAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgIC8vIFN5bmMganVzdCBmaW5pc2hlZCBcdTIwMTQgYm90aCBzaWRlcyBtYXkgaGF2ZSBjaGFuZ2VkIChiYWNrZW5kIGdvdFxuICAgIC8vIG5ldyByZXNvdXJjZXMgaW4gYmFja2VuZCBtb2RlLCBsb2NhbCBidW5kbGUgd2FzIHN0YXNoZWQgaW4gZWl0aGVyXG4gICAgLy8gbW9kZSkuIFJlZnJlc2ggZGF0YS1zdGF0ZSBjYXJkIHNvIHRoZSB1c2VyIHNlZXMgdXAtdG8tZGF0ZSBjb3VudHMuXG4gICAgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG4gICAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIF9jb25uU3RhdGUgPT09IFwib2tcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICB9XG59XG5cbi8vIFN0b3AgdGhlIGluLXByb2dyZXNzIHN5bmMuIFR3by1wcm9uZ2VkIHNvIGl0IHdvcmtzIGV2ZW4gd2hlbiB0aGVcbi8vIHNlcnZpY2Ugd29ya2VyIGhhcyBkaWVkOiAoMSkgdGVsbCB0aGUgU1cgdG8gc2V0IGl0cyBjYW5jZWwgZmxhZyxcbi8vICgyKSB3cml0ZSBzdG9yYWdlIGRpcmVjdGx5IHRvIHJ1bm5pbmc6ZmFsc2Ugc28gdGhlIHBvcHVwIFVJIHVuZnJlZXplc1xuLy8gaW1tZWRpYXRlbHkgZXZlbiBpZiB0aGUgU1cgbWVzc2FnZSBjYW4ndCBiZSBkZWxpdmVyZWQuXG5hc3luYyBmdW5jdGlvbiBzdG9wU3luYygpIHtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBzeW5jU3RhdHVzOiB7XG4gICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdTUwNUNcdTZCNjJcdTRFMkRcdUZGMENcdTZCNjNcdTU3MjhcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTlcdTIwMjZcIixcbiAgICAgIHBoYXNlOiBcImNhbmNlbGxlZFwiLFxuICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgfSxcbiAgfSk7XG4gIHNldFN0YXR1cyhcIlx1MjZENCBcdTUwNUNcdTZCNjJcdTRFMkRcdUZGMENcdTZCNjNcdTU3MjhcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTlcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwic3RvcFN5bmNcIiB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIGVscy5zdG9wQnRuLmhpZGRlbiA9IHRydWU7XG4gIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG59XG5cbi8vIExpdmUgcHJvZ3Jlc3MgdXBkYXRlcyBcdTIwMTQgbGlzdGVuIG9uIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZCBzbyB3ZSBnZXRcbi8vIGV2ZXJ5IHVwZGF0ZSB0aGUgU1cgd3JpdGVzLCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhlIFNXJ3MgYnJvYWRjYXN0XG4vLyBzZW5kTWVzc2FnZSByZWFjaGVkIHVzLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgY2hhbmdlcy5zeW5jU3RhdHVzKSB7XG4gICAgYXBwbHlTeW5jU3RhdHVzKGNoYW5nZXMuc3luY1N0YXR1cy5uZXdWYWx1ZSk7XG4gIH1cbn0pO1xuXG4vLyAoTGVnYWN5IGluLW1lbW9yeSBicm9hZGNhc3Qgc3RpbGwgbGlzdGVuZWQgdG8gYXMgYSBiYWNrdXAuKVxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2cpID0+IHtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzeW5jUHJvZ3Jlc3NcIikge1xuICAgIGFwcGx5U3luY1N0YXR1cyhtc2cuc3RhdHVzKTtcbiAgfVxufSk7XG5cbi8vIFByZS1mbGlnaHQgZGV0ZWN0aW9uIGZvciBOSEkgbG9naW4gc3RhdGUuIFR3byBzaWduYWxzIChlaXRoZXIgdHJpZ2dlcnMpOlxuLy8gIDEuIFVSTCBpcyBpbiBOSEkgYXV0aCBuYW1lc3BhY2UgKElIS0UzMDk5U3h4KSBcdTIwMTQgbG9naW4gLyBJQyBjYXJkIHBhZ2VzXG4vLyAgMi4gUGFnZSBjb250YWlucyBhIHBhc3N3b3JkIGlucHV0IG9yIGtub3duIGxvZ2dlZC1vdXQgcGhyYXNlc1xuYXN5bmMgZnVuY3Rpb24gaXNPbk5oaUxvZ2luUGFnZSh0YWJJZCwgdXJsKSB7XG4gIGlmICh1cmw/LnBhdGhuYW1lICYmIC9JSEtFMzA5OS8udGVzdCh1cmwucGF0aG5hbWUpKSByZXR1cm4gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiAoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIGNvbnN0IHRleHQgPSAoZG9jdW1lbnQuYm9keT8uaW5uZXJUZXh0IHx8IFwiXCIpLnRyaW0oKTtcbiAgICAgICAgY29uc3QgcGhyYXNlcyA9IFtcbiAgICAgICAgICBcIlx1OEFDQlx1NEY3Rlx1NzUyOFx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NTA2NVx1NEZERFx1NTM2MVwiLCBcIlx1OEFDQlx1NjNEMlx1NTE2NVx1NjBBOFx1NzY4NFx1NTA2NVx1NEZERFx1NTM2MVwiLFxuICAgICAgICAgIFwiXHU3NjdCXHU1MTY1XHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBXCIsIFwiXHU3NjdCXHU1MTY1XHU1OTMxXHU2NTU3XCIsIFwiXHU4QUNCXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XCIsXG4gICAgICAgICAgXCJTZXNzaW9uIFx1NURGMlx1OTAzRVx1NjY0MlwiLCBcInNlc3Npb24gXHU1REYyXHU5MDNFXHU2NjQyXCIsIFwiXHU1REYyXHU5MDNFXHU2NjQyXCIsXG4gICAgICAgICAgXCJcdThBQ0JcdTRFRTVcdTUwNjVcdTRGRERcdTUzNjFcdTc2N0JcdTUxNjVcIixcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIHBocmFzZXMuc29tZSgocCkgPT4gdGV4dC5pbmNsdWRlcyhwKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIFx1MjZBMSBOSEkgQVBJLWRpcmVjdCBzeW5jIFx1MjAxNCBwcmltYXJ5IHBhdGguIEhpdHMgTkhJJ3MgdW5kZXJseWluZyBKU09OXG4vLyBlbmRwb2ludHMgaW4gcGFyYWxsZWwgYW5kIHBvc3RzIGFkYXB0ZWQgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQuXG4vLyBSZXF1aXJlcyBwYXRpZW50X292ZXJyaWRlIHRvIGJlIGZpbGxlZC5cbi8vIENvbnZlcnQgYSBiYWNrZW5kIFVSTCBcdTIxOTIgdGhlIG9yaWdpbi1wYXR0ZXJuIENocm9tZSB3YW50cyBmb3IgcGVybWlzc2lvblxuLy8gcmVxdWVzdHMuIFwiaHR0cDovLzE5Mi4xNjguMS41OjgwMTBcIiBcdTIxOTIgXCJodHRwOi8vMTkyLjE2OC4xLjU6ODAxMC8qXCIuXG4vLyBSZXR1cm5zIG51bGwgd2hlbiB0aGUgVVJMIGlzbid0IHBhcnNlYWJsZSBzbyB0aGUgY2FsbGVyIGNhbiBzaG9ydC1jaXJjdWl0LlxuZnVuY3Rpb24gX29yaWdpblBhdHRlcm5Gb3IodXJsKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdSA9IG5ldyBVUkwodXJsKTtcbiAgICByZXR1cm4gYCR7dS5wcm90b2NvbH0vLyR7dS5ob3N0fS8qYDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gQmFja2VuZC1tb2RlIHByZS1mbGlnaHQ6IGVuc3VyZSB0aGUgZXh0ZW5zaW9uIGhhcyBob3N0IHBlcm1pc3Npb24gZm9yXG4vLyB0aGUgdXNlci1jb25maWd1cmVkIGJhY2tlbmQgVVJMLiBMb2NhbGhvc3QgLyAxMjcuMC4wLjEgYXJlIGNvdmVyZWQgYnlcbi8vIHRoZSBkZWZhdWx0IG1hbmlmZXN0IGhvc3RfcGVybWlzc2lvbnM7IHJlbW90ZSAvIExBTiAvIHByb2R1Y3Rpb24gVVJMc1xuLy8gbmVlZCBhIG9uZS10aW1lIHVzZXIgZ3JhbnQuIE11c3QgcnVuIGZyb20gYSB1c2VyIGdlc3R1cmUgKGJ1dHRvbiBjbGljaykuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVCYWNrZW5kUGVybWlzc2lvbihiYWNrZW5kVXJsKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBfb3JpZ2luUGF0dGVybkZvcihiYWNrZW5kVXJsKTtcbiAgaWYgKCFwYXR0ZXJuKSByZXR1cm4geyBvazogZmFsc2UsIHJlYXNvbjogYEJhY2tlbmQgVVJMIFx1NzEyMVx1NkNENVx1ODlFM1x1Njc5MDogJHtiYWNrZW5kVXJsfWAgfTtcbiAgY29uc3QgYWxyZWFkeSA9IGF3YWl0IGNocm9tZS5wZXJtaXNzaW9ucy5jb250YWlucyh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgaWYgKGFscmVhZHkpIHJldHVybiB7IG9rOiB0cnVlIH07XG4gIGxldCBncmFudGVkO1xuICB0cnkge1xuICAgIGdyYW50ZWQgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMucmVxdWVzdCh7IG9yaWdpbnM6IFtwYXR0ZXJuXSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgcmVhc29uOiBgXHU2QjBBXHU5NjUwXHU4QUNCXHU2QzQyXHU1OTMxXHU2NTU3OiAke2UubWVzc2FnZX1gIH07XG4gIH1cbiAgcmV0dXJuIGdyYW50ZWRcbiAgICA/IHsgb2s6IHRydWUgfVxuICAgIDogeyBvazogZmFsc2UsIHJlYXNvbjogYFx1NjcyQVx1NjM4OFx1NkIwQVx1OTAyM1x1N0REQVx1NTIzMCAke3BhdHRlcm59IFx1MjAxNCBcdTUzRDZcdTZEODhgIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFwaVN5bmNOaGkoKSB7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGlmICghb3YpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1NkRFIFx1MjQ2MSBcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcdUZGMUFcdThBQ0JcdTkwNzhcdTY0QzdcdTYwMjdcdTUyMjVcdTMwMDFcdTU4NkJcdTc1MUZcdTY1RTVcdTVGOENcdTYzMDlcdTc4QkFcdTVCOUFcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBQcmUtZmxpZ2h0OiBjaGVjayB3ZSdyZSBvbiBhbiBOSEkgdGFiIHNvIGNvb2tpZXMgYXJlIHVzYWJsZSBmcm9tIFNXLlxuICBjb25zdCB0YWIgPSBhd2FpdCBnZXRBY3RpdmVUYWIoKTtcbiAgbGV0IHVybDtcbiAgdHJ5IHsgdXJsID0gbmV3IFVSTCh0YWIudXJsKTsgfSBjYXRjaCB7IHNldFN0YXR1cyhcImFjdGl2ZSB0YWIgaGFzIG5vIFVSTFwiLCBcImVycm9yXCIpOyByZXR1cm47IH1cbiAgY29uc3Qgb25Mb2dpbiA9IGF3YWl0IGlzT25OaGlMb2dpblBhZ2UodGFiLmlkLCB1cmwpO1xuICBpZiAob25Mb2dpbikge1xuICAgIHNldFN0YXR1cyhcIlx1RDgzRFx1REQxMiBcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NVx1RkYxQVx1NUMxQVx1NjcyQVx1NzY3Qlx1NTE2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJhY2tlbmQgbW9kZTogcmUtdmVyaWZ5IGNvbm5lY3Rpdml0eSByaWdodCBoZXJlIGV2ZW4gaWYgdGhlIGJhbm5lclxuICAvLyBsYXN0IHNhaWQgb2suIEJldHdlZW4gdGhlIHByZXZpb3VzIGNoZWNrIGFuZCB0aGlzIGNsaWNrIHRoZSB1c2VyXG4gIC8vIG1heSBoYXZlIHN0b3BwZWQgZG9ja2VyOyB3aXRob3V0IGEgZnJlc2ggcHJvYmUgd2UnZCBzdGFydCBhbiB1cGxvYWRcbiAgLy8gdGhhdCBmYWlscyBtaWQtZmxpZ2h0IGFmdGVyIHBhcnRpYWwgZGF0YSBoYXMgaGl0IChvciBmYWlsZWQgdG8gaGl0KVxuICAvLyB0aGUgYmFja2VuZC4gQ2hlYXAgKFx1MjI2NDVzKSBhbmQgc2F2ZXMgYSBsb3Qgb2YgY29uZnVzaW9uLlxuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHtcbiAgICBjb25zdCBvayA9IGF3YWl0IHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xuICAgIGlmICghb2spIHtcbiAgICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTVGOENcdTdBRUZcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTcgXHUyMDE0IFx1OEFDQlx1NzcwQlx1OTgwMlx1OTBFOCBiYW5uZXIgXHU3Njg0XHU4QUFBXHU2NjBFXCIsIFwiZXJyb3JcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgc3luY1N0YXR1czoge1xuICAgICAgcnVubmluZzogdHJ1ZSxcbiAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIixcbiAgICAgIHBoYXNlOiBcInN0YXJ0aW5nXCIsIHN0YXJ0ZWQ6IERhdGUubm93KCksIHRzOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0pO1xuICBzZXRTdGF0dXMoXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcblxuICAvLyBDb21wdXRlIGRhdGUgcmFuZ2UgZnJvbSB0aGUgZHJvcGRvd24uIFwiMVwiID0gTkhJJ3MgZGVmYXVsdCB3aW5kb3c7XG4gIC8vIGFueXRoaW5nIGVsc2UgaXMgXCJ0b2RheSBiYWNrIE4geWVhcnNcIi4gSGVscGVyIGluc2lkZSBiYWNrZ3JvdW5kLmpzXG4gIC8vIGNvbnZlcnRzIHRvIFx1NkMxMVx1NTcwQiBmb3IgTkhJJ3MgQVBJLlxuICBjb25zdCByYW5nZVNlbCA9IGVscy5hcGlTeW5jUmFuZ2U/LnZhbHVlIHx8IFwiM1wiO1xuICBsZXQgZGF0ZVJhbmdlID0gbnVsbDtcbiAgY29uc3QgUkFOR0VfTEFCRUxTID0ge1xuICAgIFwiMVwiOiAgIFwiXHU2NzAwXHU4RkQxIDEgXHU1RTc0XCIsXG4gICAgXCIzXCI6ICAgXCJcdTY3MDBcdThGRDEgMyBcdTVFNzRcIixcbiAgICBcIjVcIjogICBcIlx1NjcwMFx1OEZEMSA1IFx1NUU3NFwiLFxuICAgIFwiMTBcIjogIFwiXHU2NzAwXHU4RkQxIDEwIFx1NUU3NFwiLFxuICAgIFwiYWxsXCI6IFwiXHU1MTY4XHU5MEU4XHU2Qjc3XHU1M0YyXHU3RDAwXHU5MzA0XCIsXG4gIH07XG4gIGNvbnN0IGRhdGVSYW5nZUxhYmVsID0gUkFOR0VfTEFCRUxTW3JhbmdlU2VsXSB8fCBgXHU2NzAwXHU4RkQxICR7cmFuZ2VTZWx9IFx1NUU3NGA7XG4gIGlmIChyYW5nZVNlbCAhPT0gXCIxXCIpIHtcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZW5kID0gdG9kYXkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgbGV0IHN0YXJ0O1xuICAgIGlmIChyYW5nZVNlbCA9PT0gXCJhbGxcIikge1xuICAgICAgc3RhcnQgPSBcIjIwMDEtMDEtMDFcIjsgIC8vIFx1NkMxMVx1NTcwQiA5MCBcdTIwMTQgZmFyIGVub3VnaCBiYWNrIGZvciBhbnkgY2xpbmljYWwgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB5ZWFycyA9IHBhcnNlSW50KHJhbmdlU2VsLCAxMCk7XG4gICAgICBjb25zdCBzID0gbmV3IERhdGUodG9kYXkpO1xuICAgICAgcy5zZXRGdWxsWWVhcihzLmdldEZ1bGxZZWFyKCkgLSB5ZWFycyk7XG4gICAgICBzdGFydCA9IHMudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICAgIGRhdGVSYW5nZSA9IHsgc3RhcnQsIGVuZCB9O1xuICB9XG5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIHR5cGU6IFwic3RhcnROaGlBcGlTeW5jXCIsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdGFiSWQ6IHRhYi5pZCxcbiAgICAgIG1vZGU6IGN1cnJlbnRNb2RlKCksXG4gICAgICBiYWNrZW5kOiBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCksXG4gICAgICBzeW5jQXBpS2V5OiBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCksXG4gICAgICBuaGlCYXNlOiBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHdcIixcbiAgICAgIHBhdGllbnRPdmVycmlkZTogb3YsXG4gICAgICBkYXRlUmFuZ2UsXG4gICAgICBkYXRlUmFuZ2VMYWJlbCxcbiAgICB9LFxuICB9KS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxhdW5jaCgpIHtcbiAgY29uc3QgYmFja2VuZCA9IGVscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKTtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgcmF3SWQgPSBvdj8uaWRfbm87XG4gIGNvbnN0IHNtYXJ0QXBwTGF1bmNoID0gZWxzLnNtYXJ0QXBwVXJsLnZhbHVlLnRyaW0oKSB8fCBERUZBVUxUX1NNQVJUX0FQUF9MQVVOQ0g7XG4gIGlmICghcmF3SWQpIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU5MDg0XHU2QzkyXHU2NzA5XHU3NUM1XHU0RUJBXHU4RUFCXHU1MjA2XHU4QjQ5IFx1MjAxNCBcdThBQ0JcdTUxNDhcdTYzMDlcdTMwMENcdUQ4M0RcdUREMDQgXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUzMDBEXHU2MjkzXHU0RTAwXHU2QjIxXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIEJhY2tlbmQgdHJhY2tzIFBhdGllbnQgdW5kZXIgaXRzIGhhc2hlZCBGSElSIGlkLCBub3QgdGhlIHJhdyBuYXRpb25hbCBJRC5cbiAgY29uc3QgcGF0aWVudElkID0gZGVyaXZlUGF0aWVudElkKHJhd0lkKTtcbiAgLy8gUmUtdGVzdCBjb25uZWN0aW9uIGV2ZW4gaWYgYmFubmVyIHNob3dzIG9rIFx1MjAxNCBiYWNrZW5kIG1heSBoYXZlIGdvbmVcbiAgLy8gZG93biBzaW5jZSB0aGUgbGFzdCBwcm9iZS5cbiAgY29uc3Qgb2sgPSBhd2FpdCB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgaWYgKCFvaykge1xuICAgIHNldFN0YXR1cyhcIlx1MjZENCBcdTVGOENcdTdBRUZcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTcgXHUyMDE0IFx1OEFDQlx1NzcwQlx1OTgwMlx1OTBFOCBiYW5uZXIgXHU3Njg0XHU4QUFBXHU2NjBFXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNldFN0YXR1cyhcIlx1NUVGQVx1N0FDQiBsYXVuY2ggY29udGV4dFx1MjAyNlwiLCBcImluZm9cIik7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc21hcnQvbGF1bmNoLWNvbnRleHRgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwYXRpZW50X2lkOiBwYXRpZW50SWQgfSksXG4gICAgfSk7XG4gICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihgJHtyZXMuc3RhdHVzfTogJHthd2FpdCByZXMudGV4dCgpfWApO1xuICAgIGNvbnN0IHsgbGF1bmNoIH0gPSBhd2FpdCByZXMuanNvbigpO1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoeyBpc3M6IGAke2JhY2tlbmR9L2ZoaXJgLCBsYXVuY2ggfSk7XG4gICAgLy8gQXBwZW5kIGlzcyArIGxhdW5jaCBwYXJhbXMsIHJlc3BlY3RpbmcgYW55IGV4aXN0aW5nIHF1ZXJ5IHN0cmluZy5cbiAgICBjb25zdCBzZXAgPSBzbWFydEFwcExhdW5jaC5pbmNsdWRlcyhcIj9cIikgPyBcIiZcIiA6IFwiP1wiO1xuICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogYCR7c21hcnRBcHBMYXVuY2h9JHtzZXB9JHtwYXJhbXN9YCB9KTtcbiAgICB3aW5kb3cuY2xvc2UoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNldFN0YXR1cyhgXHUyNzRDIExhdW5jaCBcdTU5MzFcdTY1NTdcdUZGMUEke2UubWVzc2FnZX1gLCBcImVycm9yXCIpO1xuICB9XG59XG5cbmVscy5zeW5jQXBpQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhcGlTeW5jTmhpKTtcbmVscy5zdG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdG9wU3luYyk7XG5lbHMub3ZTYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzYXZlUGF0aWVudE92ZXJyaWRlKTtcbmVscy5vdkNsZWFyQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhclBhdGllbnRPdmVycmlkZSk7XG5bZWxzLm92SWRObywgZWxzLm92TmFtZSwgZWxzLm92QmlydGhEYXRlLCBlbHMub3ZHZW5kZXJdLmZvckVhY2goKGVsKSA9PlxuICBlbC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSlcbik7XG5lbHMubGF1bmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsYXVuY2gpO1xuaW5pdCgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFTQSxPQUFDLFdBQVc7QUFDVjtBQUVBLFlBQUksY0FBYztBQUNsQixZQUFJLGlCQUFpQjtBQUNyQixZQUFJLFNBQVMsT0FBTyxXQUFXO0FBQy9CLFlBQUksT0FBTyxTQUFTLFNBQVMsQ0FBQztBQUM5QixZQUFJLEtBQUssbUJBQW1CO0FBQzFCLG1CQUFTO0FBQUEsUUFDWDtBQUNBLFlBQUksYUFBYSxDQUFDLFVBQVUsT0FBTyxTQUFTO0FBQzVDLFlBQUksVUFBVSxDQUFDLEtBQUssc0JBQXNCLE9BQU8sWUFBWSxZQUFZLFFBQVEsWUFBWSxRQUFRLFNBQVM7QUFDOUcsWUFBSSxTQUFTO0FBQ1gsaUJBQU87QUFBQSxRQUNULFdBQVcsWUFBWTtBQUNyQixpQkFBTztBQUFBLFFBQ1Q7QUFDQSxZQUFJLFlBQVksQ0FBQyxLQUFLLHdCQUF3QixPQUFPLFdBQVcsWUFBWSxPQUFPO0FBQ25GLFlBQUksTUFBTSxPQUFPLFdBQVcsY0FBYyxPQUFPO0FBQ2pELFlBQUksZUFBZSxDQUFDLEtBQUssMkJBQTJCLE9BQU8sZ0JBQWdCO0FBQzNFLFlBQUksWUFBWSxtQkFBbUIsTUFBTSxFQUFFO0FBQzNDLFlBQUksUUFBUSxDQUFDLGFBQWEsU0FBUyxPQUFPLEdBQUc7QUFDN0MsWUFBSSxRQUFRLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQztBQUN6QixZQUFJLGVBQWUsQ0FBQyxPQUFPLFNBQVMsVUFBVSxhQUFhO0FBRTNELFlBQUksU0FBUyxDQUFDO0FBRWQsWUFBSSxVQUFVLE1BQU07QUFDcEIsWUFBSSxLQUFLLHNCQUFzQixDQUFDLFNBQVM7QUFDdkMsb0JBQVUsU0FBVSxLQUFLO0FBQ3ZCLG1CQUFPLE9BQU8sVUFBVSxTQUFTLEtBQUssR0FBRyxNQUFNO0FBQUEsVUFDakQ7QUFBQSxRQUNGO0FBRUEsWUFBSSxTQUFTLFlBQVk7QUFDekIsWUFBSSxpQkFBaUIsS0FBSyxtQ0FBbUMsQ0FBQyxTQUFTO0FBQ3JFLG1CQUFTLFNBQVUsS0FBSztBQUN0QixtQkFBTyxPQUFPLFFBQVEsWUFBWSxJQUFJLFVBQVUsSUFBSSxPQUFPLGdCQUFnQjtBQUFBLFVBQzdFO0FBQUEsUUFDRjtBQUdBLFlBQUksZ0JBQWdCLFNBQVUsU0FBUztBQUNyQyxjQUFJLE9BQU8sT0FBTztBQUNsQixjQUFJLFNBQVMsVUFBVTtBQUNyQixtQkFBTyxDQUFDLFNBQVMsSUFBSTtBQUFBLFVBQ3ZCO0FBQ0EsY0FBSSxTQUFTLFlBQVksWUFBWSxNQUFNO0FBQ3pDLGtCQUFNLElBQUksTUFBTSxXQUFXO0FBQUEsVUFDN0I7QUFDQSxjQUFJLGdCQUFnQixRQUFRLGdCQUFnQixhQUFhO0FBQ3ZELG1CQUFPLENBQUMsSUFBSSxXQUFXLE9BQU8sR0FBRyxLQUFLO0FBQUEsVUFDeEM7QUFDQSxjQUFJLENBQUMsUUFBUSxPQUFPLEtBQUssQ0FBQyxPQUFPLE9BQU8sR0FBRztBQUN6QyxrQkFBTSxJQUFJLE1BQU0sV0FBVztBQUFBLFVBQzdCO0FBQ0EsaUJBQU8sQ0FBQyxTQUFTLEtBQUs7QUFBQSxRQUN4QjtBQUVBLFlBQUkscUJBQXFCLFNBQVUsWUFBWTtBQUM3QyxpQkFBTyxTQUFVLFNBQVM7QUFDeEIsbUJBQU8sSUFBSSxLQUFLLElBQUksRUFBRSxPQUFPLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFBQSxVQUNwRDtBQUFBLFFBQ0Y7QUFFQSxZQUFJLGVBQWUsV0FBWTtBQUM3QixjQUFJLFNBQVMsbUJBQW1CLEtBQUs7QUFDckMsY0FBSSxTQUFTO0FBQ1gscUJBQVMsU0FBUyxNQUFNO0FBQUEsVUFDMUI7QUFDQSxpQkFBTyxTQUFTLFdBQVk7QUFDMUIsbUJBQU8sSUFBSSxLQUFLO0FBQUEsVUFDbEI7QUFDQSxpQkFBTyxTQUFTLFNBQVUsU0FBUztBQUNqQyxtQkFBTyxPQUFPLE9BQU8sRUFBRSxPQUFPLE9BQU87QUFBQSxVQUN2QztBQUNBLG1CQUFTLElBQUksR0FBRyxJQUFJLGFBQWEsUUFBUSxFQUFFLEdBQUc7QUFDNUMsZ0JBQUksT0FBTyxhQUFhLENBQUM7QUFDekIsbUJBQU8sSUFBSSxJQUFJLG1CQUFtQixJQUFJO0FBQUEsVUFDeEM7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxZQUFJLFdBQVcsU0FBVSxRQUFRO0FBQy9CLGNBQUlBLFVBQVM7QUFDYixjQUFJQyxVQUFTLGlCQUFrQjtBQUMvQixjQUFJO0FBQ0osY0FBSUEsUUFBTyxRQUFRLENBQUMsS0FBSyx3QkFBd0I7QUFDL0MseUJBQWFBLFFBQU87QUFBQSxVQUN0QixPQUFPO0FBQ0wseUJBQWEsU0FBVSxTQUFTO0FBQzlCLHFCQUFPLElBQUlBLFFBQU8sT0FBTztBQUFBLFlBQzNCO0FBQUEsVUFDRjtBQUNBLGNBQUksYUFBYSxTQUFVLFNBQVM7QUFDbEMsZ0JBQUksT0FBTyxZQUFZLFVBQVU7QUFDL0IscUJBQU9ELFFBQU8sV0FBVyxNQUFNLEVBQUUsT0FBTyxTQUFTLE1BQU0sRUFBRSxPQUFPLEtBQUs7QUFBQSxZQUN2RSxPQUFPO0FBQ0wsa0JBQUksWUFBWSxRQUFRLFlBQVksUUFBVztBQUM3QyxzQkFBTSxJQUFJLE1BQU0sV0FBVztBQUFBLGNBQzdCLFdBQVcsUUFBUSxnQkFBZ0IsYUFBYTtBQUM5QywwQkFBVSxJQUFJLFdBQVcsT0FBTztBQUFBLGNBQ2xDO0FBQUEsWUFDRjtBQUNBLGdCQUFJLFFBQVEsT0FBTyxLQUFLLE9BQU8sT0FBTyxLQUNwQyxRQUFRLGdCQUFnQkMsU0FBUTtBQUNoQyxxQkFBT0QsUUFBTyxXQUFXLE1BQU0sRUFBRSxPQUFPLFdBQVcsT0FBTyxDQUFDLEVBQUUsT0FBTyxLQUFLO0FBQUEsWUFDM0UsT0FBTztBQUNMLHFCQUFPLE9BQU8sT0FBTztBQUFBLFlBQ3ZCO0FBQUEsVUFDRjtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUVBLFlBQUkseUJBQXlCLFNBQVUsWUFBWTtBQUNqRCxpQkFBTyxTQUFVLEtBQUssU0FBUztBQUM3QixtQkFBTyxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUUsT0FBTyxPQUFPLEVBQUUsVUFBVSxFQUFFO0FBQUEsVUFDN0Q7QUFBQSxRQUNGO0FBRUEsWUFBSSxtQkFBbUIsV0FBWTtBQUNqQyxjQUFJLFNBQVMsdUJBQXVCLEtBQUs7QUFDekMsaUJBQU8sU0FBUyxTQUFVLEtBQUs7QUFDN0IsbUJBQU8sSUFBSSxTQUFTLEdBQUc7QUFBQSxVQUN6QjtBQUNBLGlCQUFPLFNBQVMsU0FBVSxLQUFLLFNBQVM7QUFDdEMsbUJBQU8sT0FBTyxPQUFPLEdBQUcsRUFBRSxPQUFPLE9BQU87QUFBQSxVQUMxQztBQUNBLG1CQUFTLElBQUksR0FBRyxJQUFJLGFBQWEsUUFBUSxFQUFFLEdBQUc7QUFDNUMsZ0JBQUksT0FBTyxhQUFhLENBQUM7QUFDekIsbUJBQU8sSUFBSSxJQUFJLHVCQUF1QixJQUFJO0FBQUEsVUFDNUM7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxpQkFBUyxLQUFLLGNBQWM7QUFDMUIsY0FBSSxjQUFjO0FBQ2hCLG1CQUFPLENBQUMsSUFBSSxPQUFPLEVBQUUsSUFBSSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsSUFDekQsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQzVDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sRUFBRSxJQUFJLE9BQU8sRUFBRSxJQUM5QyxPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUUsSUFBSTtBQUNwRCxpQkFBSyxTQUFTO0FBQUEsVUFDaEIsT0FBTztBQUNMLGlCQUFLLFNBQVMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFBQSxVQUNsRTtBQUVBLGVBQUssS0FBSztBQUNWLGVBQUssS0FBSztBQUNWLGVBQUssS0FBSztBQUNWLGVBQUssS0FBSztBQUNWLGVBQUssS0FBSztBQUVWLGVBQUssUUFBUSxLQUFLLFFBQVEsS0FBSyxRQUFRLEtBQUssU0FBUztBQUNyRCxlQUFLLFlBQVksS0FBSyxTQUFTO0FBQy9CLGVBQUssUUFBUTtBQUFBLFFBQ2Y7QUFFQSxhQUFLLFVBQVUsU0FBUyxTQUFVLFNBQVM7QUFDekMsY0FBSSxLQUFLLFdBQVc7QUFDbEIsa0JBQU0sSUFBSSxNQUFNLGNBQWM7QUFBQSxVQUNoQztBQUVBLGNBQUksU0FBUyxjQUFjLE9BQU87QUFDbEMsb0JBQVUsT0FBTyxDQUFDO0FBQ2xCLGNBQUksV0FBVyxPQUFPLENBQUM7QUFDdkIsY0FBSSxNQUFNLFFBQVEsR0FBRyxHQUFHLFNBQVMsUUFBUSxVQUFVLEdBQUdFLFVBQVMsS0FBSztBQUVwRSxpQkFBTyxRQUFRLFFBQVE7QUFDckIsZ0JBQUksS0FBSyxRQUFRO0FBQ2YsbUJBQUssU0FBUztBQUNkLGNBQUFBLFFBQU8sQ0FBQyxJQUFJLEtBQUs7QUFDakIsbUJBQUssUUFBUUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQzFEQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFDNUNBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUM5Q0EsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQUk7QUFBQSxZQUN0RDtBQUVBLGdCQUFHLFVBQVU7QUFDWCxtQkFBSyxJQUFJLEtBQUssT0FBTyxRQUFRLFVBQVUsSUFBSSxJQUFJLEVBQUUsT0FBTztBQUN0RCx1QkFBTyxRQUFRLFdBQVcsS0FBSztBQUMvQixvQkFBSSxPQUFPLEtBQU07QUFDZixrQkFBQUEsUUFBTyxNQUFNLENBQUMsS0FBSyxRQUFRLE1BQU0sTUFBTSxDQUFDO0FBQUEsZ0JBQzFDLFdBQVcsT0FBTyxNQUFPO0FBQ3ZCLGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVEsU0FBUyxNQUFPLE1BQU0sTUFBTSxDQUFDO0FBQ3pELGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVEsT0FBTyxPQUFVLE1BQU0sTUFBTSxDQUFDO0FBQUEsZ0JBQzVELFdBQVcsT0FBTyxTQUFVLFFBQVEsT0FBUTtBQUMxQyxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFRLFNBQVMsT0FBUSxNQUFNLE1BQU0sQ0FBQztBQUMxRCxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFTLFNBQVMsSUFBSyxPQUFVLE1BQU0sTUFBTSxDQUFDO0FBQ2xFLGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVEsT0FBTyxPQUFVLE1BQU0sTUFBTSxDQUFDO0FBQUEsZ0JBQzVELE9BQU87QUFDTCx5QkFBTyxVQUFhLE9BQU8sU0FBVSxLQUFPLFFBQVEsV0FBVyxFQUFFLEtBQUssSUFBSTtBQUMxRSxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFRLFNBQVMsT0FBUSxNQUFNLE1BQU0sQ0FBQztBQUMxRCxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFTLFNBQVMsS0FBTSxPQUFVLE1BQU0sTUFBTSxDQUFDO0FBQ25FLGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVMsU0FBUyxJQUFLLE9BQVUsTUFBTSxNQUFNLENBQUM7QUFDbEUsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUSxPQUFPLE9BQVUsTUFBTSxNQUFNLENBQUM7QUFBQSxnQkFDNUQ7QUFBQSxjQUNGO0FBQUEsWUFDRixPQUFPO0FBQ0wsbUJBQUssSUFBSSxLQUFLLE9BQU8sUUFBUSxVQUFVLElBQUksSUFBSSxFQUFFLE9BQU87QUFDdEQsZ0JBQUFBLFFBQU8sTUFBTSxDQUFDLEtBQUssUUFBUSxLQUFLLEtBQUssTUFBTSxNQUFNLENBQUM7QUFBQSxjQUNwRDtBQUFBLFlBQ0Y7QUFFQSxpQkFBSyxnQkFBZ0I7QUFDckIsaUJBQUssU0FBUyxJQUFJLEtBQUs7QUFDdkIsZ0JBQUksS0FBSyxJQUFJO0FBQ1gsbUJBQUssUUFBUUEsUUFBTyxFQUFFO0FBQ3RCLG1CQUFLLFFBQVEsSUFBSTtBQUNqQixtQkFBSyxLQUFLO0FBQ1YsbUJBQUssU0FBUztBQUFBLFlBQ2hCLE9BQU87QUFDTCxtQkFBSyxRQUFRO0FBQUEsWUFDZjtBQUFBLFVBQ0Y7QUFDQSxjQUFJLEtBQUssUUFBUSxZQUFZO0FBQzNCLGlCQUFLLFVBQVUsS0FBSyxRQUFRLGNBQWM7QUFDMUMsaUJBQUssUUFBUSxLQUFLLFFBQVE7QUFBQSxVQUM1QjtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUVBLGFBQUssVUFBVSxXQUFXLFdBQVk7QUFDcEMsY0FBSSxLQUFLLFdBQVc7QUFDbEI7QUFBQSxVQUNGO0FBQ0EsZUFBSyxZQUFZO0FBQ2pCLGNBQUlBLFVBQVMsS0FBSyxRQUFRLElBQUksS0FBSztBQUNuQyxVQUFBQSxRQUFPLEVBQUUsSUFBSSxLQUFLO0FBQ2xCLFVBQUFBLFFBQU8sTUFBTSxDQUFDLEtBQUssTUFBTSxJQUFJLENBQUM7QUFDOUIsZUFBSyxRQUFRQSxRQUFPLEVBQUU7QUFDdEIsY0FBSSxLQUFLLElBQUk7QUFDWCxnQkFBSSxDQUFDLEtBQUssUUFBUTtBQUNoQixtQkFBSyxLQUFLO0FBQUEsWUFDWjtBQUNBLFlBQUFBLFFBQU8sQ0FBQyxJQUFJLEtBQUs7QUFDakIsWUFBQUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQzdDQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFDNUNBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUM5Q0EsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQUk7QUFBQSxVQUN0RDtBQUNBLFVBQUFBLFFBQU8sRUFBRSxJQUFJLEtBQUssVUFBVSxJQUFJLEtBQUssVUFBVTtBQUMvQyxVQUFBQSxRQUFPLEVBQUUsSUFBSSxLQUFLLFNBQVM7QUFDM0IsZUFBSyxLQUFLO0FBQUEsUUFDWjtBQUVBLGFBQUssVUFBVSxPQUFPLFdBQVk7QUFDaEMsY0FBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUs7QUFDakUsY0FBSSxHQUFHLEdBQUcsR0FBR0EsVUFBUyxLQUFLO0FBRTNCLGVBQUksSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDdkIsZ0JBQUlBLFFBQU8sSUFBSSxDQUFDLElBQUlBLFFBQU8sSUFBSSxDQUFDLElBQUlBLFFBQU8sSUFBSSxFQUFFLElBQUlBLFFBQU8sSUFBSSxFQUFFO0FBQ2xFLFlBQUFBLFFBQU8sQ0FBQyxJQUFNLEtBQUssSUFBTSxNQUFNO0FBQUEsVUFDakM7QUFFQSxlQUFJLElBQUksR0FBRyxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ3pCLGdCQUFLLElBQUksSUFBTyxDQUFDLElBQUs7QUFDdEIsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxDQUFDLEtBQUs7QUFDMUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUssSUFBSSxJQUFPLENBQUMsSUFBSztBQUN0QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTyxDQUFDLElBQUs7QUFDdEIsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU8sQ0FBQyxJQUFLO0FBQ3RCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUssSUFBSSxJQUFPLENBQUMsSUFBSztBQUN0QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBQUEsVUFDekI7QUFFQSxpQkFBTSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ3BCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sQ0FBQyxLQUFLO0FBQzFDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFBQSxVQUN6QjtBQUVBLGlCQUFNLElBQUksSUFBSSxLQUFLLEdBQUc7QUFDcEIsZ0JBQUssSUFBSSxJQUFNLElBQUksSUFBTSxJQUFJO0FBQzdCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sQ0FBQyxLQUFLO0FBQzFDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTSxJQUFJLElBQU0sSUFBSTtBQUM3QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTSxJQUFJLElBQU0sSUFBSTtBQUM3QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTSxJQUFJLElBQU0sSUFBSTtBQUM3QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTSxJQUFJLElBQU0sSUFBSTtBQUM3QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBQUEsVUFDekI7QUFFQSxpQkFBTSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ3BCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLFlBQVlBLFFBQU8sQ0FBQyxLQUFLO0FBQ3pDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLFlBQVlBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDN0MsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksWUFBWUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM3QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxZQUFZQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzdDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLFlBQVlBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDN0MsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFBQSxVQUN6QjtBQUVBLGVBQUssS0FBSyxLQUFLLEtBQUssS0FBSztBQUN6QixlQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFDekIsZUFBSyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQ3pCLGVBQUssS0FBSyxLQUFLLEtBQUssS0FBSztBQUN6QixlQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFBQSxRQUMzQjtBQUVBLGFBQUssVUFBVSxNQUFNLFdBQVk7QUFDL0IsZUFBSyxTQUFTO0FBRWQsY0FBSSxLQUFLLEtBQUssSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLLEtBQUs7QUFFdEUsaUJBQU8sVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSTtBQUFBLFFBQzNEO0FBRUEsYUFBSyxVQUFVLFdBQVcsS0FBSyxVQUFVO0FBRXpDLGFBQUssVUFBVSxTQUFTLFdBQVk7QUFDbEMsZUFBSyxTQUFTO0FBRWQsY0FBSSxLQUFLLEtBQUssSUFBSSxLQUFL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Q2pELGFBQU8sS0FBSyxPQUFPLEVBQUUsS0FBSyxHQUFHLGNBQWMsR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUM7QUFDOUQsYUFBTyxNQUFNO0FBQUEsSUFDZixTQUFTLEdBQUc7QUFDVixnQkFBVSxtQ0FBZSxFQUFFLE9BQU8sSUFBSSxPQUFPO0FBQUEsSUFDL0M7QUFBQSxFQUNGO0FBRUEsTUFBSSxXQUFXLGlCQUFpQixTQUFTLFVBQVU7QUFDbkQsTUFBSSxRQUFRLGlCQUFpQixTQUFTLFFBQVE7QUFDOUMsTUFBSSxVQUFVLGlCQUFpQixTQUFTLG1CQUFtQjtBQUMzRCxNQUFJLFdBQVcsaUJBQWlCLFNBQVMsb0JBQW9CO0FBQzdELEdBQUMsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLGFBQWEsSUFBSSxRQUFRLEVBQUU7QUFBQSxJQUFRLENBQUMsT0FDL0QsR0FBRyxpQkFBaUIsU0FBUyxzQkFBc0I7QUFBQSxFQUNyRDtBQUNBLE1BQUksVUFBVSxpQkFBaUIsU0FBUyxNQUFNO0FBQzlDLE9BQUs7IiwKICAibmFtZXMiOiBbImNyeXB0byIsICJCdWZmZXIiLCAiYmxvY2tzIiwgImV4cG9ydHMiLCAibGF1bmNoIl0KfQo=
