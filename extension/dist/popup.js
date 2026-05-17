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
    launchBlock: document.querySelector(".launch-block"),
    activePatient: document.getElementById("active-patient"),
    activePatientValue: document.getElementById("active-patient-value")
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
    let summaryText = "";
    if (!ov) {
      els.ovSummary.textContent = "\u672A\u8A2D\u5B9A";
      if (card) card.dataset.state = "empty";
    } else {
      const parts = [];
      if (ov.name) parts.push(_maybeMask(ov.name));
      parts.push(maskId(ov.id_no));
      summaryText = parts.join("  \xB7  ");
      els.ovSummary.textContent = `\u2713 ${summaryText}`;
      if (card) card.dataset.state = "filled";
    }
    if (els.activePatient && els.activePatientValue) {
      const showActive = _step2Confirmed && !!ov?.id_no;
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
  function _gotoStep2Edit() {
    _setActiveStep(2);
    if (els.patientOverrideDetails) els.patientOverrideDetails.open = true;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9oZWxwZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vc3JjL3BvcHVwLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIwNzQwODY2YCBcdTIxOTIgYFAxMjA3NCoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpKSB7XG4gICAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICAgIHJldHVybiBsb2luYztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKExPSU5DX01BUCkpIHtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrZXkudG9Mb3dlckNhc2UoKSl9YCkudGVzdChjb21iaW5lZCkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tYmluZWQuaW5jbHVkZXMoa2V5LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICByZXR1cm4gbG9pbmM7XG4gICAgfVxuICB9XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvLyBOSEktRkhJUiBCcmlkZ2UgcG9wdXAgbG9naWMuXG4vL1xuLy8gRmxvdzpcbi8vICAgMS4gT24gb3BlbiwgY2hlY2sgdGhlIGFjdGl2ZSB0YWIgaXMgYW4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBwYWdlLlxuLy8gICAyLiBVc2VyIGNvbmZpcm1zIHBhdGllbnQgaWRlbnRpdHkgKFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RikgaW4gdGhlIHBhdGllbnQtb3ZlcnJpZGUgY2FyZC5cbi8vICAgMy4gQ2xpY2tzIFwiXHVEODNEXHVEQ0U1IFx1NTQwQ1x1NkI2NVx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVwiIFx1MjE5MiBiYWNrZ3JvdW5kIHJ1bnMgcnVuTmhpQXBpU3luYygpLlxuLy8gICA0LiBQcm9ncmVzcyBzdHJlYW1lZCBiYWNrIHZpYSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zeW5jU3RhdHVzLlxuLy8gICA1LiBBZnRlciBzeW5jIGNvbXBsZXRlcywgXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1NTVGIFNNQVJUIEFwcFwiIGxhdW5jaGVzIHdpdGggdGhhdCBwYXRpZW50LlxuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQsIG1hc2tJZCwgbWFza05hbWUgfSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgREVGQVVMVF9CQUNLRU5EID0gXCJodHRwOi8vbG9jYWxob3N0OjgwMTBcIjtcbi8vIERlZmF1bHQgU01BUlQgYXBwIGZvciBhIGZyZXNoIGluc3RhbGwuIFVzZXJzIGNhbiBvdmVycmlkZSB2aWFcbi8vIHRoZSAnXHUyNjk5XHVGRTBGIFx1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QSBcdTIxOTIgU01BUlQgQXBwIExhdW5jaCBVUkwnIGZpZWxkOyB0aGUgdmFsdWUgaXNcbi8vIHBlcnNpc3RlZCBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlciBgc21hcnRBcHBMYXVuY2hVcmxgLlxuY29uc3QgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIID0gXCJodHRwczovL3ZvaG8wMDAwLmdpdGh1Yi5pby9tZWRpY2FsLW5vdGUtc21hcnQtb24tZmhpci9zbWFydC9sYXVuY2hcIjtcblxuLy8gVHJ1ZSBpZiB0aGUgYWN0aXZlIHRhYiBpcyBhbiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHBhZ2UgKHJlYWwgc2l0ZSkuXG5mdW5jdGlvbiBpc05oaVRhYih1cmwpIHtcbiAgaWYgKCF1cmwpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCB1ID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IG5ldyBVUkwodXJsKSA6IHVybDtcbiAgICByZXR1cm4gL215aGVhbHRoYmFua1xcLm5oaVxcLmdvdlxcLnR3Ly50ZXN0KHUuaG9zdG5hbWUpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgREVGQVVMVF9NT0RFID0gXCJsb2NhbFwiO1xuXG5jb25zdCBlbHMgPSB7XG4gIG1vZGVSYWRpb3M6ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzeW5jLW1vZGVcIl0nKSxcbiAgYmFja2VuZFVybDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXVybFwiKSxcbiAgc3luY0FwaUtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWFwaS1rZXlcIiksXG4gIHNtYXJ0QXBwVXJsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNtYXJ0LWFwcC11cmxcIiksXG4gIHN5bmNBcGlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3luYy1hcGktYnRuXCIpLFxuICBzeW5jQmxvY2tlZFJlYXNvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLWJsb2NrZWQtcmVhc29uXCIpLFxuICBhcGlTeW5jUmFuZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBpLXN5bmMtcmFuZ2VcIiksXG4gIHN0b3BCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIiksXG4gIG92SWRObzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdi1pZC1ub1wiKSxcbiAgb3ZOYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LW5hbWVcIiksXG4gIG92QmlydGhEYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWJpcnRoLWRhdGVcIiksXG4gIG92R2VuZGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWdlbmRlclwiKSxcbiAgb3ZTYXZlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LXNhdmUtYnRuXCIpLFxuICBvdkNsZWFyQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92LWNsZWFyLWJ0blwiKSxcbiAgb3ZTdW1tYXJ5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJyaWRlLXN1bW1hcnlcIiksXG4gIHBhdGllbnRPdmVycmlkZURldGFpbHM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF0aWVudC1vdmVycmlkZVwiKSxcbiAgbGF1bmNoQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdW5jaC1idG5cIiksXG4gIHN0YXR1czogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGF0dXNcIiksXG4gIGRhc2hib2FyZExpbms6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFzaGJvYXJkLWxpbmtcIiksXG4gIHBlbmRpbmdCdW5kbGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGVuZGluZy1idW5kbGVcIiksXG4gIGRvd25sb2FkQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvd25sb2FkLWJ1bmRsZS1idG5cIiksXG4gIGNsZWFyQnVuZGxlQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyLWJ1bmRsZS1idG5cIiksXG4gIGJ1bmRsZU1ldGE6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVuZGxlLW1ldGFcIiksXG4gIGNvbm5CYW5uZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1iYW5uZXJcIiksXG4gIGNvbm5TZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tc2VjdGlvblwiKSxcbiAgY29ubk1pbmk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1taW5pXCIpLFxuICBjb25uTXNnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4tbXNnXCIpLFxuICBjb25uUmV0cnlCdG46IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubi1yZXRyeS1idG5cIiksXG4gIGNvbm5IZWxwOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm4taGVscFwiKSxcbiAgZGF0YVN0YXRlU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRhLXN0YXRlLXNlY3Rpb25cIiksXG4gIGJhY2tlbmRTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrZW5kLXN0YXRlXCIpLFxuICBsb2NhbFN0YXRlUm93OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvY2FsLXN0YXRlLXJvd1wiKSxcbiAgbG9jYWxTdGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2NhbC1zdGF0ZVwiKSxcbiAgcHVzaExvY2FsQnRuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB1c2gtbG9jYWwtYnRuXCIpLFxuICBzeW5jU3RhdHVzSGludDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzeW5jLXN0YXR1cy1oaW50XCIpLFxuICBzaWRlYmFyRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLWVuYWJsZWRcIiksXG4gIG1hc2tOYW1lRW5hYmxlZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXNrLW5hbWUtZW5hYmxlZFwiKSxcbiAgb3Blbk5oaVNlY3Rpb246IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1uaGktc2VjdGlvblwiKSxcbiAgb3Blbk5oaUJ0bjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLW5oaS1idG5cIiksXG4gIG5oaU5lZWRzTG9naW5TZWN0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5oaS1uZWVkcy1sb2dpbi1zZWN0aW9uXCIpLFxuICBsb2dpbk9rU2VjdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1vay1zZWN0aW9uXCIpLFxuICB3aXphcmRTdGVwcGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndpemFyZC1zdGVwcGVyXCIpLFxuICByZXN1bHRab25lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdC16b25lXCIpLFxuICBzdW1tYXJ5Q2FyZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdW1tYXJ5LWNhcmRcIiksXG4gIGxhdW5jaEJsb2NrOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxhdW5jaC1ibG9ja1wiKSxcbiAgYWN0aXZlUGF0aWVudDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY3RpdmUtcGF0aWVudFwiKSxcbiAgYWN0aXZlUGF0aWVudFZhbHVlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFjdGl2ZS1wYXRpZW50LXZhbHVlXCIpLFxufTtcblxuY29uc3QgTkhJX0xBTkRJTkcgPSBcImh0dHBzOi8vbXloZWFsdGhiYW5rLm5oaS5nb3YudHcvSUhLRTMwMDBcIjtcblxuY29uc3QgUEVORElOR19CVU5ETEVfS0VZID0gXCJwZW5kaW5nRmhpckJ1bmRsZVwiO1xuXG4vLyBQZXJzaXN0ZWQtc3RhdGUga2V5cy4gQmFja2VuZCBVUkwgYW5kIEFQSSBrZXkgcGVyc2lzdCBhY3Jvc3MgYnJvd3NlciBzZXNzaW9ucy5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRCYWNrZW5kVXJsKCkge1xuICBjb25zdCB7IGJhY2tlbmRVcmwsIHN5bmNBcGlLZXksIHNtYXJ0QXBwTGF1bmNoVXJsIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXG4gICAgW1wiYmFja2VuZFVybFwiLCBcInN5bmNBcGlLZXlcIiwgXCJzbWFydEFwcExhdW5jaFVybFwiXVxuICApO1xuICBlbHMuYmFja2VuZFVybC52YWx1ZSA9IGJhY2tlbmRVcmwgfHwgREVGQVVMVF9CQUNLRU5EO1xuICBlbHMuc3luY0FwaUtleS52YWx1ZSA9IHN5bmNBcGlLZXkgfHwgXCJcIjtcbiAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gc21hcnRBcHBMYXVuY2hVcmwgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGF0aWVudCBvdmVycmlkZSAobWFudWFsIE5ISSBpZGVudGl0eSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGRvZXNuJ3QgZXhwb3NlIHRoZSB1c2VyJ3MgbmF0aW9uYWwgSUQgaW4gdGhlIFVSTC4gVGhlIHVzZXJcbi8vIGZpbGxzIHRoZXNlIG9uY2UgYW5kIHRoZXkncmUgc2VudCB3aXRoIGV2ZXJ5IHVwbG9hZCBjYWxsIHVudGlsIGNsZWFyZWQuXG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGNvbnN0IHsgcGF0aWVudE92ZXJyaWRlIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJwYXRpZW50T3ZlcnJpZGVcIik7XG4gIGlmIChwYXRpZW50T3ZlcnJpZGUpIHtcbiAgICBlbHMub3ZJZE5vLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCI7XG4gICAgZWxzLm92TmFtZS52YWx1ZSA9IHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCI7XG4gICAgZWxzLm92QmlydGhEYXRlLnZhbHVlID0gcGF0aWVudE92ZXJyaWRlLmJpcnRoX2RhdGUgfHwgXCJcIjtcbiAgICBlbHMub3ZHZW5kZXIudmFsdWUgPSBwYXRpZW50T3ZlcnJpZGUuZ2VuZGVyIHx8IFwiXCI7XG4gIH1cbiAgLy8gQSBzdG9yZWQgb3ZlcnJpZGUgd2l0aCBib3RoIHJlcXVpcmVkIGZpZWxkcyBjb3VudHMgYXMgXCJzdGVwIDJcbiAgLy8gYWxyZWFkeSBjb25maXJtZWRcIiBcdTIwMTQgcmV0dXJuaW5nIHVzZXIgc2hvdWxkbid0IGJlIGZvcmNlZCB0byBjbGlja1xuICAvLyBcdTI3MTMgXHU3OEJBXHU1QjlBIGFnYWluIHRvIGFkdmFuY2UgdGhlIHdpemFyZC5cbiAgX21hcmtTdGVwMkNvbmZpcm1lZChcbiAgICAhIShwYXRpZW50T3ZlcnJpZGU/LmdlbmRlciAmJiBwYXRpZW50T3ZlcnJpZGU/LmJpcnRoX2RhdGUpLFxuICApO1xuICAvLyBBdXRvLWV4cGFuZCB0aGUgY2FyZCB3aGVuZXZlciB0aGUgcmVxdWlyZWQgZmllbGRzIGFyZW4ndCBhbHJlYWR5XG4gIC8vIHNhdmVkIFx1MjAxNCBjb3ZlcnMgZmlyc3QtdGltZSBBTkQgcmV0dXJuaW5nIHVzZXJzIHdob3NlIHByZXZpb3VzIHNhdmVcbiAgLy8gd2FzIGluY29tcGxldGUuIE9uY2UgcmVxdWlyZWQgZmllbGRzIGFyZSBzYXZlZCwgY29sbGFwc2UgdG8gZ2l2ZVxuICAvLyBicmVhdGhpbmcgcm9vbS5cbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSB7XG4gICAgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9ICFfc3RlcDJDb25maXJtZWQ7XG4gIH1cbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xufVxuXG5mdW5jdGlvbiBnZXRQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIC8vIFJldHVybnMge2lkX25vLCBuYW1lLCBiaXJ0aF9kYXRlLCBnZW5kZXJ9LlxuICAvLyBpZF9ubyBpcyBvcHRpb25hbCBpbiB0aGUgVUk7IGlmIGJsYW5rIHRoZSBwb3B1cCBhdXRvLWdlbmVyYXRlcyBhblxuICAvLyBcImF1dG8tWFhYWFhYWFhcIiBpZGVudGlmaWVyIGF0IHNhdmUgdGltZS4gUmV0dXJucyBudWxsIHdoZW4gYm90aFxuICAvLyBpZF9ubyBhbmQgbmFtZSBhcmUgZW1wdHkgKG5vdGhpbmcgaWRlbnRpZnlpbmcgdG8gc2F2ZSkuXG4gIGNvbnN0IGlkX25vID0gZWxzLm92SWROby52YWx1ZS50cmltKCk7XG4gIGNvbnN0IG5hbWUgPSBlbHMub3ZOYW1lLnZhbHVlLnRyaW0oKTtcbiAgaWYgKCFpZF9ubyAmJiAhbmFtZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG91dCA9IGlkX25vID8geyBpZF9ubyB9IDoge307XG4gIGlmIChuYW1lKSBvdXQubmFtZSA9IG5hbWU7XG4gIGNvbnN0IGJpcnRoX2RhdGUgPSBlbHMub3ZCaXJ0aERhdGUudmFsdWUudHJpbSgpO1xuICBjb25zdCBnZW5kZXIgPSBlbHMub3ZHZW5kZXIudmFsdWU7XG4gIGlmIChiaXJ0aF9kYXRlKSBvdXQuYmlydGhfZGF0ZSA9IGJpcnRoX2RhdGU7XG4gIGlmIChnZW5kZXIpIG91dC5nZW5kZXIgPSBnZW5kZXI7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIHBhdGllbnQgY2FyZCdzIGJpcnRoLWRhdGUgaW5wdXQuIFJldHVybnMgbnVsbCB3aGVuIE9LLFxuICogb3RoZXJ3aXNlIGEgdXNlci1mYWNpbmcgZXJyb3Igc3RyaW5nLiBSZWFkcyBkaXJlY3RseSBmcm9tIHRoZVxuICogPGlucHV0IHR5cGU9XCJkYXRlXCI+IHNvIHdlIGNhbiBkZXRlY3QgcGFydGlhbC1pbnB1dCBzdGF0ZXMgdGhhdFxuICogQ2hyb21lIHJlcG9ydHMgdGhyb3VnaCBgdmFsaWRpdHkuYmFkSW5wdXRgICh0aGUgaW5wdXQncyBgLnZhbHVlYFxuICogaXMgXCJcIiBpbiB0aGF0IGNhc2UsIGluZGlzdGluZ3Vpc2hhYmxlIGZyb20gXCJibGFua1wiIGJ5IHN0cmluZyBjaGVja1xuICogYWxvbmUgXHUyMDE0IHRoYXQncyB3aHkgdGhlIG9sZCB2ZXJzaW9uIG9mIHRoaXMgZnVuY3Rpb24gbGV0IHBhcnRpYWxcbiAqIHllYXItb25seSBlbnRyaWVzIHNsaXAgdGhyb3VnaCkuXG4gKlxuICogQWxsb3dlZCBzdGF0ZXM6XG4gKiAgIC0gZ2VudWluZWx5IGVtcHR5ICh0aGUgZmllbGQgaXMgb3B0aW9uYWwpXG4gKiAgIC0gZnVsbCBJU08gWVlZWS1NTS1ERCB0aGF0IHJvdW5kLXRyaXBzIHRocm91Z2ggRGF0ZSgpXG4gKiBSZWplY3RlZDpcbiAqICAgLSB5ZWFyLW9ubHkgLyB5ZWFyK21vbnRoOiB0aGUgaW5wdXQgcmVuZGVycyBibGFuayB2YWx1ZSBidXRcbiAqICAgICB2YWxpZGl0eS5iYWRJbnB1dCBpcyB0cnVlXG4gKiAgIC0gZGF0ZXMgaW4gdGhlIGZ1dHVyZVxuICogICAtIGltcGxhdXNpYmx5IG9sZCBkYXRlcyAoeWVhciA8IDE5MDApXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlQmlydGhEYXRlKCkge1xuICBjb25zdCBlbCA9IGVscy5vdkJpcnRoRGF0ZTtcbiAgaWYgKCFlbCkgcmV0dXJuIG51bGw7XG4gIC8vIENocm9tZSdzIG5hdGl2ZSBkYXRlIGlucHV0OiBwYXJ0aWFsIGVudHJ5IChqdXN0IHllYXIsIGp1c3QgeXl5eS1tbSlcbiAgLy8gc3VyZmFjZXMgaGVyZSBldmVuIHRob3VnaCAudmFsdWUgaXMgXCJcIi5cbiAgaWYgKGVsLnZhbGlkaXR5ICYmIGVsLnZhbGlkaXR5LmJhZElucHV0KSB7XG4gICAgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU4QUNCXHU1ODZCXHU1QjhDXHU2NTc0XHU1RTc0XHU2NzA4XHU2NUU1XCI7XG4gIH1cbiAgY29uc3QgcyA9IChlbC52YWx1ZSB8fCBcIlwiKS50cmltKCk7XG4gIC8vIEJpcnRoIGRhdGUgaXMgbm93IHJlcXVpcmVkIFx1MjAxNCBhZ2UgYWZmZWN0cyBldmVyeSByZWZlcmVuY2UgcmFuZ2VcbiAgLy8gYW5kIGFueSBkb3duc3RyZWFtIGFnZS1iYXNlZCBVSTsgZW1wdHkgaW5wdXQgbGV0cyBhIHR5cG8gLyBicm93c2VyXG4gIC8vIHF1aXJrIHNpbGVudGx5IHByb3BhZ2F0ZSBhcyBOYU4uXG4gIGlmICghcykgcmV0dXJuIFwiXHU4QUNCXHU1ODZCXHU3NTFGXHU2NUU1XCI7XG4gIGlmICghL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvLnRlc3QocykpIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1OEFDQlx1NTg2Qlx1NUI4Q1x1NjU3NFx1NUU3NFx1NjcwOFx1NjVFNVwiO1xuICBjb25zdCBbeSwgbSwgZF0gPSBzLnNwbGl0KFwiLVwiKS5tYXAoTnVtYmVyKTtcbiAgY29uc3QgZHQgPSBuZXcgRGF0ZShzICsgXCJUMDA6MDA6MDBaXCIpO1xuICBpZiAoXG4gICAgTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkgfHxcbiAgICBkdC5nZXRVVENGdWxsWWVhcigpICE9PSB5IHx8XG4gICAgZHQuZ2V0VVRDTW9udGgoKSArIDEgIT09IG0gfHxcbiAgICBkdC5nZXRVVENEYXRlKCkgIT09IGRcbiAgKSB7XG4gICAgcmV0dXJuIFwiXHU3NTFGXHU2NUU1XHU0RTBEXHU2NjJGXHU2NzA5XHU2NTQ4XHU2NUU1XHU2NzFGXCI7XG4gIH1cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgaWYgKGR0LmdldFRpbWUoKSA+IG5vdy5nZXRUaW1lKCkpIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1NEUwRFx1ODBGRFx1NjYyRlx1NjcyQVx1NEY4NlwiO1xuICBpZiAoeSA8IDE5MDApIHJldHVybiBcIlx1NzUxRlx1NjVFNVx1NUU3NFx1NEVGRFx1NTkyQVx1NjVFOVx1RkYwQ1x1OEFDQlx1NzhCQVx1OEE4RFwiO1xuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gUmFuZG9tIFwiYXV0by1YWFhYWFhYWFwiIFx1MjAxNCA4IGhleCBjaGFycyBmcm9tIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgc29cbi8vIGV2ZXJ5IGZyZXNoIHBvcHVwIGluc3RhbGwgZ2V0cyBhIGRpZmZlcmVudCBJRCBhbmQgcmUtc3luY3MgYXJlIHN0YWJsZS5cbmZ1bmN0aW9uIF9nZW5lcmF0ZUF1dG9QYXRpZW50SWQoKSB7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICBjb25zdCBoZXggPSBBcnJheS5mcm9tKGJ5dGVzLCAoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgXCIwXCIpKS5qb2luKFwiXCIpO1xuICByZXR1cm4gYGF1dG8tJHtoZXh9YDtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpIHtcbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgY29uc3QgY2FyZCA9IGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzO1xuICBsZXQgc3VtbWFyeVRleHQgPSBcIlwiO1xuICBpZiAoIW92KSB7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2NzJBXHU4QTJEXHU1QjlBXCI7XG4gICAgaWYgKGNhcmQpIGNhcmQuZGF0YXNldC5zdGF0ZSA9IFwiZW1wdHlcIjtcbiAgfSBlbHNlIHtcbiAgICAvLyBOYW1lIGZpcnN0ICh3aGVuIHByZXNlbnQpLCB0aGVuIG1hc2tlZCBJRC4gTmFtZSBcdTIxOTIgXCJ0aGUgcGF0aWVudFxuICAgIC8vIEknbSB3b3JraW5nIHdpdGhcIiByZWFkcyBuYXR1cmFsbHkgZmlyc3Q7IElEIGlzIHRoZSB0ZWNobmljYWxcbiAgICAvLyBkZXRhaWwuIFByZXZpb3VzbHkgdGhlIG9yZGVyIHdhcyByZXZlcnNlZCwgcHV0dGluZyBgUDEyMDc0KioqKmBcbiAgICAvLyBhaGVhZCBvZiB0aGUgYWN0dWFsIHBlcnNvbidzIG5hbWUuXG4gICAgLy8gSUQgYWx3YXlzIGhhbGYtbWFza2VkIChQMTIwNzQwODY2IFx1MjE5MiBQMTIwNzQqKioqKSBcdTIwMTQgbWF0Y2hlcyBOSElcbiAgICAvLyBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gVUkgY29udmVudGlvbiBhbmQgcmVtb3ZlcyBhIHN0YWJsZSBzaG91bGRlci1cbiAgICAvLyBzdXJmaW5nIHRhcmdldC4gUmF3IHZhbHVlIHN0aWxsIGluIHN0b3JhZ2UgKyB0aGUgaW5wdXQgZmllbGQuXG4gICAgLy8gTmFtZSBmb2xsb3dzIHRoZSBtYXNrIHRvZ2dsZSAoXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4IFx1OTgxMFx1OEEyRFx1OTVEQyA9IFx1NzcxRlx1NTQwRCAvXG4gICAgLy8gbXVsdGktcGF0aWVudCBkZW1vIFx1OTU4Qlx1NTU1RiA9IFx1OTA2RVx1N0Y2OSkuXG4gICAgY29uc3QgcGFydHMgPSBbXTtcbiAgICBpZiAob3YubmFtZSkgcGFydHMucHVzaChfbWF5YmVNYXNrKG92Lm5hbWUpKTtcbiAgICBwYXJ0cy5wdXNoKG1hc2tJZChvdi5pZF9ubykpO1xuICAgIHN1bW1hcnlUZXh0ID0gcGFydHMuam9pbihcIiAgXHUwMEI3ICBcIik7XG4gICAgZWxzLm92U3VtbWFyeS50ZXh0Q29udGVudCA9IGBcdTI3MTMgJHtzdW1tYXJ5VGV4dH1gO1xuICAgIGlmIChjYXJkKSBjYXJkLmRhdGFzZXQuc3RhdGUgPSBcImZpbGxlZFwiO1xuICB9XG4gIC8vIE1pcnJvciB0aGUgc2FtZSBzdW1tYXJ5IG9udG8gc3RlcCAzJ3MgXCJcdTUzRDZcdTVGOTdcdTVDMERcdThDNjFcIiBiYW5uZXIgc28gdGhlXG4gIC8vIHVzZXIga25vd3Mgd2hvIHRoZXkncmUgYWJvdXQgdG8gZmV0Y2ggd2l0aG91dCBzY3JvbGxpbmcgYmFjayB0b1xuICAvLyBzdGVwIDIuIE9ubHkgd2hlbiBzdGVwIDIgaGFzIGJlZW4gY29uZmlybWVkIEFORCB0aGUgb3ZlcnJpZGVcbiAgLy8gYWN0dWFsbHkgaGFzIGFuIGlkX25vLlxuICBpZiAoZWxzLmFjdGl2ZVBhdGllbnQgJiYgZWxzLmFjdGl2ZVBhdGllbnRWYWx1ZSkge1xuICAgIGNvbnN0IHNob3dBY3RpdmUgPSBfc3RlcDJDb25maXJtZWQgJiYgISFvdj8uaWRfbm87XG4gICAgZWxzLmFjdGl2ZVBhdGllbnQuaGlkZGVuID0gIXNob3dBY3RpdmU7XG4gICAgaWYgKHNob3dBY3RpdmUpIGVscy5hY3RpdmVQYXRpZW50VmFsdWUudGV4dENvbnRlbnQgPSBzdW1tYXJ5VGV4dDtcbiAgfVxuICAvLyBCb3RoIGxhdW5jaCArIHN5bmMgZW5hYmxlZCBzdGF0ZSBkZXBlbmQgb24gcGF0aWVudCArIG1vZGUgKyBjb25uLlxuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBDaGFuZ2luZyBwYXRpZW50IElEIGludmFsaWRhdGVzOiAoYSkgYmFja2VuZC1zdGF0ZSBjYWNoZSAobmV3XG4gIC8vIHBhdGllbnQgbWlnaHQgbm90IGJlIG9uIGJhY2tlbmQpOyAoYikgbG9jYWwtYnVuZGxlIHJvdyBpbiB0aGVcbiAgLy8gZGF0YS1zdGF0ZSBjYXJkOyAoYykgdGhlIFx1RDgzRFx1RENFNSBkb3dubG9hZCBidW5kbGUgc2VjdGlvbiwgd2hpY2ggd291bGRcbiAgLy8gb3RoZXJ3aXNlIHN0aWxsIHNob3cgdGhlIHByZXZpb3VzIHBhdGllbnQncyBzdGFzaGVkIGZpbGU7IChkKVxuICAvLyB0aGUgbGFzdCBjb21wbGV0ZWQgc3luYydzIHN1Y2Nlc3MgbWVzc2FnZSwgd2hpY2ggd2FzIHRhZ2dlZCBmb3JcbiAgLy8gdGhlIHByZXZpb3VzIHBhdGllbnQuXG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcbiAgX2NsZWFyU3RhbGVTeW5jU3RhdHVzKGdldFBhdGllbnRPdmVycmlkZSgpKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiICYmIF9jb25uU3RhdGUgPT09IFwib2tcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xufVxuXG4vLyBEcm9wIGEgXCJcdTI3MDUgXHU1NDBDXHU2QjY1XHU1QjhDXHU2MjEwIFx1MjAyNlwiIHN0YXR1cyBiYW5uZXIgdGhhdCB3YXMgcmVjb3JkZWQgZm9yIGFcbi8vIGRpZmZlcmVudCBwYXRpZW50LiBNaWQtZmxpZ2h0IHN5bmNzIGFyZSBsZWZ0IGFsb25lIChzdGF0dXMucnVubmluZylcbi8vIHNvIHRoZSB1c2VyIGNhbiBzdGlsbCBzZWUgcHJvZ3Jlc3Mgb2YgdGhlIGluLWZsaWdodCBzeW5jLlxuZnVuY3Rpb24gX2NsZWFyU3RhbGVTeW5jU3RhdHVzKG92KSB7XG4gIGlmICghX2xhdGVzdFN0YXR1cykgcmV0dXJuO1xuICBpZiAoX2xhdGVzdFN0YXR1cy5ydW5uaW5nKSByZXR1cm47XG4gIGlmICghX2xhdGVzdFN0YXR1cy5oaXN0bm8pIHJldHVybjtcbiAgaWYgKG92Py5pZF9ubyA9PT0gX2xhdGVzdFN0YXR1cy5oaXN0bm8pIHJldHVybjtcbiAgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG4gIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwic3luY1N0YXR1c1wiKS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIC8vIEdlbmRlciArIGJpcnRoX2RhdGUgYXJlIHJlcXVpcmVkLiBpZF9ubyAvIG5hbWUgYXJlIG9wdGlvbmFsIFx1MjAxNFxuICAvLyBpZF9ubyB3aWxsIGJlIGF1dG8tZmV0Y2hlZCBvbiBzeW5jLCBuYW1lIGNhbiBiZSBsZWZ0IGJsYW5rIG9yIGZha2UuXG4gIGlmICghZWxzLm92R2VuZGVyLnZhbHVlKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1OEFDQlx1OTA3OFx1NjRDN1x1NjAyN1x1NTIyNVwiLCBcImVycm9yXCIpO1xuICAgIGVscy5vdkdlbmRlci5mb2N1cygpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBkb2JFcnJvciA9IHZhbGlkYXRlQmlydGhEYXRlKCk7XG4gIGlmIChkb2JFcnJvcikge1xuICAgIHNldFN0YXR1cyhgXHUyNkQ0ICR7ZG9iRXJyb3J9YCwgXCJlcnJvclwiKTtcbiAgICBlbHMub3ZCaXJ0aERhdGUuZm9jdXMoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gQnVpbGQgdGhlIG92ZXJyaWRlIGRpcmVjdGx5IHNvIHdlIGRvbid0IGRlcGVuZCBvblxuICAvLyBnZXRQYXRpZW50T3ZlcnJpZGUncyBcIm11c3QgaGF2ZSBpZF9ubyBvciBuYW1lXCIgbnVsbC1yZXR1cm4gXHUyMDE0IHRoZVxuICAvLyByZXF1aXJlZC1maWVsZCBwYXRoIGFib3ZlIGhhcyBhbHJlYWR5IHZhbGlkYXRlZCB3aGF0IG1hdHRlcnMuXG4gIGNvbnN0IG92ID0ge1xuICAgIGlkX25vOiBlbHMub3ZJZE5vLnZhbHVlLnRyaW0oKSB8fCBudWxsLFxuICAgIG5hbWU6IGVscy5vdk5hbWUudmFsdWUudHJpbSgpIHx8IG51bGwsXG4gICAgYmlydGhfZGF0ZTogZWxzLm92QmlydGhEYXRlLnZhbHVlLnRyaW0oKSxcbiAgICBnZW5kZXI6IGVscy5vdkdlbmRlci52YWx1ZSxcbiAgfTtcbiAgaWYgKCFvdi5pZF9ubykgZGVsZXRlIG92LmlkX25vO1xuICBpZiAoIW92Lm5hbWUpIGRlbGV0ZSBvdi5uYW1lO1xuICAvLyBJRCBhdXRvLWdlbmVyYXRpb246IGlmIHVzZXIgbGVmdCBpZF9ubyBibGFuaywgbWludCBhbiBcImF1dG8tWFhYWFwiXG4gIC8vIGFuZCBzdGFzaCBpdCBpbiB0aGUgVUkgc28gc3Vic2VxdWVudCByZS1zeW5jcyB1c2UgdGhlIHNhbWUgRkhJUlxuICAvLyBQYXRpZW50LmlkIChzdG9yYWdlIHBlcnNpc3RlbmNlIGtlZXBzIGl0IHN0YWJsZSBhY3Jvc3MgcmUtb3BlbnMpLlxuICBpZiAoIW92LmlkX25vKSB7XG4gICAgb3YuaWRfbm8gPSBfZ2VuZXJhdGVBdXRvUGF0aWVudElkKCk7XG4gICAgZWxzLm92SWROby52YWx1ZSA9IG92LmlkX25vO1xuICB9XG5cbiAgLy8gRGV0ZWN0IGlkZW50aXR5IHN3aXRjaDogaWYgdGhlIHByZXZpb3VzIHNhdmVkIG92ZXJyaWRlIHdhcyBmb3IgYVxuICAvLyBkaWZmZXJlbnQgcGF0aWVudCwgdGhlIHJlc3VsdC16b25lIGNvbnRlbnRzIChwZW5kaW5nIGJ1bmRsZSBmcm9tXG4gIC8vIHBhdGllbnQgQSdzIHN5bmMsIGxhc3QgY29tcGxldGlvbiBzdGF0dXMgd2l0aCBBJ3MgaWQsIGJhY2tlbmRcbiAgLy8gcHJlc2VuY2UgY2FjaGUsIGV0Yy4pIGFyZSBzdGFsZSBcdTIwMTQgbnVrZSB0aGVtIHNvIHN0ZXAgMyBkb2Vzbid0XG4gIC8vIG1pc2xlYWRpbmdseSBjYXJyeSBBJ3MgbGVmdG92ZXJzIGludG8gQidzIGNvbnRleHQuXG4gIGNvbnN0IHByZXZTdG9yZWQgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwicGF0aWVudE92ZXJyaWRlXCIpKVxuICAgIC5wYXRpZW50T3ZlcnJpZGU7XG4gIGNvbnN0IHBhdGllbnRDaGFuZ2VkID1cbiAgICBwcmV2U3RvcmVkPy5pZF9ubyAmJiBvdi5pZF9ubyAmJiBwcmV2U3RvcmVkLmlkX25vICE9PSBvdi5pZF9ubztcblxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwYXRpZW50T3ZlcnJpZGU6IG92IH0pO1xuXG4gIGlmIChwYXRpZW50Q2hhbmdlZCkge1xuICAgIC8vIDEuIGRyb3AgdGhlIHByaW9yIGxvY2FsIEZISVIgYnVuZGxlIChkb3dubG9hZCBidXR0b24gY29udGVudClcbiAgICAvLyAyLiBkcm9wIHRoZSBTVydzIGxhc3Qgc3luYyBzdGF0dXMgc28gdGhlIHJlc3VsdCB6b25lIGRvZXNuJ3RcbiAgICAvLyAgICBrZWVwIHNob3dpbmcgXCJcdTI3MDUgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyBBIFx1NzY4NCA4MSBcdTdCNDZcdTIwMjZcIlxuICAgIC8vIDMuIGRyb3AgdGhlIGluLXBvcHVwIGxhdGVzdC1zdGF0dXMgc25hcHNob3RcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoUEVORElOR19CVU5ETEVfS0VZKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgYXdhaXQgY2hyb21lLnJ1bnRpbWVcbiAgICAgIC5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiY2xlYXJTeW5jU3RhdHVzXCIgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7fSk7XG4gICAgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG4gICAgc2V0U3RhdHVzKFwiXCIsIG51bGwpO1xuICB9XG5cbiAgX21hcmtTdGVwMkNvbmZpcm1lZCh0cnVlKTtcbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBTdWNjZXNzZnVsIHNhdmUgaXMgVEhFIGludGVudGlvbmFsIHN0ZXAtMiBjb21wbGV0aW9uIGV2ZW50IFx1MjAxNCB0aGlzXG4gIC8vIGlzIHdoZXJlIHRoZSB3aXphcmQgaXMgYWxsb3dlZCB0byBhZHZhbmNlIGZvcndhcmQuXG4gIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9tYXliZUF1dG9BZHZhbmNlKCk7XG4gIGlmIChlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscykgZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMub3BlbiA9IGZhbHNlO1xuICAvLyBNYWtlIGNsZWFyIHRoaXMgaXMgdGhlIGlkZW50aXR5IHNhdmUsIG5vdCBhIG1lZGljYWwtcmVjb3JkIHN5bmMgXHUyMDE0XG4gIC8vIFx1MzAwQ1x1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1MzAwRGFsb25lIHJlYWRzIGFzIFwicGF0aWVudCBkYXRhXCIgKG1lZGljYWwpIGZvciBzb21lIHVzZXJzLlxuICAvLyBJRCBoYWxmLW1hc2tlZCBpbiB0aGUgdG9hc3QgZm9yIHRoZSBzYW1lIHNob3VsZGVyLXN1cmZpbmcgcmVhc29uXG4gIC8vIGFzIHRoZSBzdW1tYXJ5IGxpbmUgYWJvdmUuXG4gIGNvbnN0IGRpc3BsYXlOYW1lID0gb3YubmFtZSA/IGAgKCR7X21heWJlTWFzayhvdi5uYW1lKX0pYCA6IFwiXCI7XG4gIHNldFN0YXR1cyhgXHUyNzA1IFx1NzVDNVx1NEVCQVx1OEVBQlx1NEVGRFx1NURGMlx1OEExOFx1NEY0Rlx1RkYxQSR7bWFza0lkKG92LmlkX25vKX0ke2Rpc3BsYXlOYW1lfWAsIFwic3VjY2Vzc1wiKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xlYXJQYXRpZW50T3ZlcnJpZGUoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShcInBhdGllbnRPdmVycmlkZVwiKTtcbiAgZWxzLm92SWROby52YWx1ZSA9IFwiXCI7XG4gIGVscy5vdk5hbWUudmFsdWUgPSBcIlwiO1xuICBlbHMub3ZCaXJ0aERhdGUudmFsdWUgPSBcIlwiO1xuICBlbHMub3ZHZW5kZXIudmFsdWUgPSBcIlwiO1xuICBfbWFya1N0ZXAyQ29uZmlybWVkKGZhbHNlKTtcbiAgcmVmcmVzaE92ZXJyaWRlU3VtbWFyeSgpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICBpZiAoZWxzLnBhdGllbnRPdmVycmlkZURldGFpbHMpIGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzLm9wZW4gPSB0cnVlO1xuICBzZXRTdGF0dXMoXCJcdTVERjJcdTZFMDVcdTk2NjRcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcIiwgXCJpbmZvXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQmFja2VuZCBjb25uZWN0aW9uIHN0YXRlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGg6IGBfY29ublN0YXRlYCByZWZsZWN0cyB0aGUgbGF0ZXN0IGJhY2tlbmRcbi8vIGNvbm5lY3Rpdml0eSBjaGVjay4gQm90aCB0aGUgYmFubmVyIFVJIGFuZCB0aGUgZW5hYmxlZC1zdGF0ZSBvZiB0aGVcbi8vIFx1RDgzRFx1RENFNSBTeW5jIC8gXHVEODNEXHVERTgwIExhdW5jaCBidXR0b25zIHJlYWQgZnJvbSBpdC5cbi8vXG4vLyBTdGF0ZXM6XG4vLyAgIFwidW5rbm93blwiICBcdTIwMTQgbm90IHlldCBjaGVja2VkIChlLmcuIGZpcnN0IHBhaW50IGluIGxvY2FsIG1vZGUpXG4vLyAgIFwiY2hlY2tpbmdcIiBcdTIwMTQgZmV0Y2ggaW4gZmxpZ2h0XG4vLyAgIFwib2tcIiAgICAgICBcdTIwMTQgR0VUIC9maGlyL21ldGFkYXRhIHJldHVybmVkIGEgRkhJUiBDYXBhYmlsaXR5U3RhdGVtZW50XG4vLyAgIFwiZmFpbFwiICAgICBcdTIwMTQgYW55dGhpbmcgZWxzZTsgYF9jb25uRmFpbFJlYXNvbmAgY2FycmllcyBkZXRhaWxcbi8vXG4vLyBCYWNrZW5kIGNvbm5lY3Rpdml0eSBpcyB0cmVhdGVkIGFzIGEgKnByZXJlcXVpc2l0ZSogZm9yIGJhY2tlbmQgbW9kZSxcbi8vIG5vdCBhcyBhIHBlci1hY3Rpb24gY2hlY2suIFN3aXRjaGluZyB0byBiYWNrZW5kIG1vZGUgdHJpZ2dlcnMgYSB0ZXN0XG4vLyBpbW1lZGlhdGVseTsgZmFpbHVyZSBzaG93cyBhIGJhbm5lciB3aXRoIGFjdGlvbmFibGUgZ3VpZGFuY2UgYW5kXG4vLyBkaXNhYmxlcyBib3RoIGFjdGlvbiBidXR0b25zIHVudGlsIGNvbm5lY3Rpdml0eSByZWNvdmVycy5cblxubGV0IF9jb25uU3RhdGUgPSBcInVua25vd25cIjtcbmxldCBfY29ubkZhaWxSZWFzb24gPSBudWxsOyAvLyB7IGtpbmQ6IFwibm8tcGVybWlzc2lvblwiIHwgXCJuby11cmxcIiB8IFwibmV0d29ya1wiIHwgXCJ0aW1lb3V0XCIgfCBcImh0dHBcIiB8IFwibm90LWZoaXJcIiwgZGV0YWlsPyB9XG5cbmNvbnN0IF9DT05OX0xBQkVMUyA9IHtcbiAgdW5rbm93bjogXCJcdTY3MkFcdTZBQTJcdTZFMkNcIixcbiAgY2hlY2tpbmc6IFwiXHU2QUEyXHU2RTJDXHU0RTJEXHUyMDI2XCIsXG4gIG9rOiAoKSA9PiBgXHU1REYyXHU5MDIzXHU3RERBIFx1MjAxNCAke2Vscy5iYWNrZW5kVXJsLnZhbHVlLnRyaW0oKX1gLFxuICBmYWlsOiAoKSA9PiB7XG4gICAgY29uc3QgciA9IF9jb25uRmFpbFJlYXNvbiB8fCB7fTtcbiAgICByZXR1cm4gKHtcbiAgICAgIFwibm8tdXJsXCI6IFwiXHUyNzE3IFx1NjcyQVx1OEEyRFx1NUI5QSBCYWNrZW5kIFVSTFwiLFxuICAgICAgXCJuby1wZXJtaXNzaW9uXCI6IFwiXHUyNzE3IFx1NjcyQVx1NjM4OFx1NkIwQVx1OTAyM1x1N0REQVwiLFxuICAgICAgXCJuZXR3b3JrXCI6IFwiXHUyNzE3IFx1OTAyM1x1NEUwRFx1NEUwQVx1NUY4Q1x1N0FFRlwiLFxuICAgICAgXCJ0aW1lb3V0XCI6IFwiXHUyNzE3IFx1OTAyM1x1N0REQVx1OTAzRVx1NjY0MlwiLFxuICAgICAgXCJodHRwXCI6IGBcdTI3MTcgSFRUUCAke3IuZGV0YWlsIHx8IFwiXCJ9YC50cmltKCksXG4gICAgICBcIm5vdC1maGlyXCI6IFwiXHUyNzE3IFx1NTZERVx1NjFDOVx1NEUwRFx1NjYyRiBGSElSXCIsXG4gICAgfSlbci5raW5kXSA/PyBcIlx1MjcxNyBcdTkwMjNcdTdEREFcdTU5MzFcdTY1NTdcIjtcbiAgfSxcbn07XG5cbmNvbnN0IF9DT05OX0hFTFAgPSB7XG4gIFwibm8tdXJsXCI6ICAgICAgICBcIlx1OEFDQlx1NTIzMFx1MzAwQ1x1OTAzMlx1OTY4RVx1OEEyRFx1NUI5QVx1MzAwRFx1NTg2Qlx1NTE2NSBCYWNrZW5kIFVSTFx1RkYwQ1x1NEY4Qlx1NTk4MiA8Y29kZT5odHRwOi8vbG9jYWxob3N0OjgwMTA8L2NvZGU+XHUzMDAyXCIsXG4gIFwibm8tcGVybWlzc2lvblwiOiBcIkNocm9tZSBcdTk2M0JcdTY0Q0JcdTRFODZcdThERThcdTRGODZcdTZFOTBcdThBQ0JcdTZDNDJcdTMwMDJcdThBQ0JcdTkxQ0RcdTY1QjBcdTk1OEIgcG9wdXBcdUZGMENcdTc1NzZcdTZCMEFcdTk2NTBcdTVDMERcdThBNzFcdTY4NDZcdThERjNcdTUxRkFcdTY2NDJcdTYzMDlcdTMwMENcdTUxNDFcdThBMzFcdTMwMERcdTMwMDJcIixcbiAgXCJuZXR3b3JrXCI6ICAgICAgIFwiXHU1RjhDXHU3QUVGXHU1M0VGXHU4MEZEXHU5MDg0XHU2QzkyXHU1NTVGXHU1MkQ1XHUzMDAyXHU4QUNCXHU1N0Y3XHU4ODRDXHVGRjFBPGJyPjxjb2RlPmRvY2tlciBjb21wb3NlIHVwIC1kPC9jb2RlPjxicj5cdTc4QkFcdThBOEQgYmFja2VuZCBcdTVCQjlcdTU2NjhcdThERDFcdThENzdcdTRGODZcdTUxOERcdTkxQ0RcdThBNjZcdTMwMDJcIixcbiAgXCJ0aW1lb3V0XCI6ICAgICAgIFwiNSBcdTc5RDJcdTUxNjdcdTZDOTJcdTY1MzZcdTUyMzBcdTU2REVcdTYxQzkgXHUyMDE0IGJhY2tlbmQgXHU1M0VGXHU4MEZEXHU5MDg0XHU1NzI4XHU1NTVGXHU1MkQ1XHU0RTJEXHVGRjBDXHU3QjQ5IDMwIFx1NzlEMlx1NTE4RFx1NjMwOVx1OTFDRFx1OEE2Nlx1MzAwMlwiLFxuICBcImh0dHBcIjogICAgICAgICAgXCJCYWNrZW5kIFx1NTZERVx1NjFDOVx1OTMyRlx1OEFBNFx1NzJDMFx1NjE0Qlx1NzhCQ1x1MzAwMlx1NkFBMlx1NjdFNSBiYWNrZW5kIFx1NzY4NCBsb2dcdUZGMUE8YnI+PGNvZGU+ZG9ja2VyIGNvbXBvc2UgbG9ncyBiYWNrZW5kPC9jb2RlPlwiLFxuICBcIm5vdC1maGlyXCI6ICAgICAgXCJcdTkwMTlcdTUwMEIgVVJMIFx1NTZERVx1NEU4Nlx1Njc3MVx1ODk3Rlx1RkYwQ1x1NEY0Nlx1NEUwRFx1NjYyRiBGSElSIENhcGFiaWxpdHlTdGF0ZW1lbnRcdTMwMDJcdTc4QkFcdThBOEQgQmFja2VuZCBVUkwgXHU2MzA3XHU1NDExIE5ISS1GSElSLUJyaWRnZSBcdTc2ODQgL2ZoaXIgXHU2ODM5XHU3NkVFXHU5MzA0XHUzMDAyXCIsXG59O1xuXG5mdW5jdGlvbiBfcmVuZGVyQ29ubkJhbm5lcigpIHtcbiAgY29uc3QgYmFubmVyID0gZWxzLmNvbm5CYW5uZXI7XG4gIGlmICghYmFubmVyKSByZXR1cm47XG4gIGJhbm5lci5kYXRhc2V0LnN0YXRlID0gX2Nvbm5TdGF0ZTtcbiAgY29uc3QgbGFiZWwgPSBfQ09OTl9MQUJFTFNbX2Nvbm5TdGF0ZV07XG4gIGVscy5jb25uTXNnLnRleHRDb250ZW50ID0gdHlwZW9mIGxhYmVsID09PSBcImZ1bmN0aW9uXCIgPyBsYWJlbCgpIDogbGFiZWw7XG4gIGVscy5jb25uUmV0cnlCdG4uaGlkZGVuID0gX2Nvbm5TdGF0ZSAhPT0gXCJmYWlsXCI7XG4gIGlmIChfY29ublN0YXRlID09PSBcImZhaWxcIiAmJiBfY29ubkZhaWxSZWFzb24/LmtpbmQpIHtcbiAgICBlbHMuY29ubkhlbHAuaGlkZGVuID0gZmFsc2U7XG4gICAgZWxzLmNvbm5IZWxwLmlubmVySFRNTCA9IF9DT05OX0hFTFBbX2Nvbm5GYWlsUmVhc29uLmtpbmRdID8/IFwiXCI7XG4gIH0gZWxzZSB7XG4gICAgZWxzLmNvbm5IZWxwLmhpZGRlbiA9IHRydWU7XG4gICAgZWxzLmNvbm5IZWxwLmlubmVySFRNTCA9IFwiXCI7XG4gIH1cblxuICAvLyBDb21wYWN0LXBpbGwgdnMgZnVsbC1iYW5uZXIgc3dhcDogd2hlbiBldmVyeXRoaW5nJ3MgZmluZSwgc2hyaW5rIHRvXG4gIC8vIGEgc21hbGwgZ3JlZW4gcGlsbCBpbiB0aGUgaGVhZGVyIHNvIHRoZSBwb3B1cCBib2R5IGhhcyBtb3JlIHJvb21cbiAgLy8gZm9yIGFjdGlvbmFibGUgY29udGVudC4gQW55dGhpbmcgZWxzZSAodW5rbm93biAvIGNoZWNraW5nIC8gZmFpbClcbiAgLy8ga2VlcHMgdGhlIGZ1bGwgYmFubmVyIHNvIHByb2dyZXNzICsgZXJyb3IgaGVscCBoYXMgc3BhY2UgdG8gcmVuZGVyLlxuICBjb25zdCBpc09rID0gX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xuICBpZiAoZWxzLmNvbm5TZWN0aW9uKSBlbHMuY29ublNlY3Rpb24uaGlkZGVuID0gaXNPaztcbiAgaWYgKGVscy5jb25uTWluaSkge1xuICAgIGVscy5jb25uTWluaS5oaWRkZW4gPSAhaXNPaztcbiAgICBpZiAoaXNPaykgZWxzLmNvbm5NaW5pLnRpdGxlID0gYFx1NURGMlx1OTAyM1x1N0REQSBcdTIwMTQgJHtlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCl9YDtcbiAgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgMy1zdGVwIHdpemFyZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBDb25jZXB0dWFsbHk6XG4vLyAgIFN0ZXAgMSBcdTIwMTQgXHU3NjdCXHU1MTY1XHVGRjFBb24gTkhJIHRhYiArIHNlc3Npb24gdG9rZW4gaXMgdmFsaWRcbi8vICAgU3RlcCAyIFx1MjAxNCBcdThBMkRcdTVCOUFcdUZGMUFnZW5kZXIgZmlsbGVkICsgKG1vZGU9PWxvY2FsIE9SIGJhY2tlbmQgcmVhY2hhYmxlKVxuLy8gICAgICAgICAgICAgICAgKyBiaXJ0aF9kYXRlIGlmIGVudGVyZWQgbXVzdCBiZSB2YWxpZFxuLy8gICBTdGVwIDMgXHUyMDE0IFx1NTNENlx1NUY5N1x1RkYxQXRoZSBhY3Rpb24gaXRzZWxmIChzeW5jIENUQSwgc3RhdHVzLCByZXN1bHRzKVxuLy9cbi8vIFN0ZXBzIGF1dG8tYWR2YW5jZSB3aGVuIHRoZWlyIHByZWNvbmRpdGlvbiBmbGlwcyBncmVlbjsgdXNlcnMgY2FuXG4vLyBjbGljayB0aGUgc3RlcHBlciB0byByZXZpc2l0IGFueSBzdGVwLiBXZSBuZXZlciBhdXRvLXN0ZXAgQkFDSyBvblxuLy8gc3RhdGUgY2hhbmdlIFx1MjAxNCBvbmNlIHRoZSB1c2VyIGhhcyBtb3ZlZCBmb3J3YXJkLCBvbmx5IGFuIGV4cGxpY2l0XG4vLyBzdGVwcGVyIGNsaWNrIGJyaW5ncyB0aGVtIGJhY2suIE90aGVyd2lzZSBvcGVuaW5nIHRoZSBwb3B1cCBtaWQtXG4vLyBzeW5jIHdvdWxkIGplcmsgdGhlbSBiYWNrIHRvIHN0ZXAgMS5cbmxldCBfYWN0aXZlU3RlcCA9IDE7XG5sZXQgX3dpemFyZEluaXRpYWxpemVkID0gZmFsc2U7XG4vLyBTdGVwIDIgaXMgXCJkb25lXCIgb25seSBhZnRlciB0aGUgdXNlciBoYXMgY2xpY2tlZCBcdTI3MTMgXHU3OEJBXHU1QjlBIHdpdGggdmFsaWRcbi8vIGlucHV0cy4gV2UgdHJhY2sgdGhpcyB3aXRoIGEgYm9vbGVhbiByYXRoZXIgdGhhbiByZWFkaW5nIGxpdmUgRE9NXG4vLyBzdGF0ZSBcdTIwMTQgb3RoZXJ3aXNlIHRoZSB3aXphcmQgd291bGQgYXV0by1hZHZhbmNlIHRoZSBtb21lbnQgdGhlXG4vLyBmaWVsZHMgaGFwcGVuZWQgdG8gbG9vayByaWdodCwgYmVmb3JlIHRoZSB1c2VyIGhhZCBhIGNoYW5jZSB0b1xuLy8gcmV2aWV3LiBGbGlwcGVkIHRydWUgaW4gc2F2ZVBhdGllbnRPdmVycmlkZSBzdWNjZXNzLCBmYWxzZSBpblxuLy8gY2xlYXJQYXRpZW50T3ZlcnJpZGUgYW5kIG9uIGEgbG9hZCB0aGF0IHlpZWxkcyBubyBzYXZlZCByZWNvcmQuXG5sZXQgX3N0ZXAyQ29uZmlybWVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIF9tYXJrU3RlcDJDb25maXJtZWQoeWVzKSB7XG4gIF9zdGVwMkNvbmZpcm1lZCA9ICEheWVzO1xufVxuXG5mdW5jdGlvbiBfaXNTdGVwRG9uZShzdGVwKSB7XG4gIGNvbnN0IG9uTmhpID0gIWVscy5zeW5jQXBpQnRuLmRhdGFzZXQub2ZmTmhpO1xuICBjb25zdCBsb2dnZWRJbiA9IGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW4gIT09IFwibm9cIjtcbiAgc3dpdGNoIChzdGVwKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIG9uTmhpICYmIGxvZ2dlZEluO1xuICAgIGNhc2UgMjpcbiAgICAgIC8vIENvbmZpcm1lZCA9IHVzZXIgY2xpY2tlZCBcdTI3MTMgXHU3OEJBXHU1QjlBIEFORCB0aGUgb3ZlcnJpZGUgaXMgY3VycmVudGx5XG4gICAgICAvLyB2YWxpZCAoc28gcmV2aXNpdHMgd2l0aCBhIG5vdy1pbnZhbGlkIG92ZXJyaWRlIGRvbid0IHNob3cgYVxuICAgICAgLy8gZmFsc2UgZ3JlZW4gY2hlY2spLlxuICAgICAgcmV0dXJuIF9zdGVwMkNvbmZpcm1lZDtcbiAgICBjYXNlIDM6XG4gICAgICAvLyBTdGVwIDMgaXMgdGhlIHRlcm1pbmFsIGFjdGlvbiBzdGVwOyBuZXZlciBcImRvbmVcIiBmb3IgcHJvZ3Jlc3NcbiAgICAgIC8vIHB1cnBvc2VzICh0aGUgc3VjY2VzcyBiYW5uZXIgaW5zaWRlIHRoZSBzdGVwIGlzIHRoZSBpbmRpY2F0b3IpLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3NldEFjdGl2ZVN0ZXAobiwgb3B0cyA9IHt9KSB7XG4gIGNvbnN0IGNsYW1wZWQgPSBNYXRoLm1heCgxLCBNYXRoLm1pbigzLCBuKSk7XG4gIF9hY3RpdmVTdGVwID0gY2xhbXBlZDtcbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LmFjdGl2ZVN0ZXAgPSBTdHJpbmcoY2xhbXBlZCk7XG4gIF9yZWZyZXNoV2l6YXJkVWkoKTtcbiAgaWYgKCFvcHRzLnNpbGVudCkge1xuICAgIC8vIEF1dG8tc2Nyb2xsIHRoZSBwb3B1cCB0byB0aGUgdG9wIG9mIHRoZSBzdGVwIHNvIHVzZXJzIGFsd2F5c1xuICAgIC8vIHNlZSB0aGUgc3RlcCBoZWFkZXIgLyBmaXJzdCBpbnB1dCBhZnRlciBuYXZpZ2F0aW9uLlxuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6IFwic21vb3RoXCIgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlZnJlc2hXaXphcmRVaSgpIHtcbiAgaWYgKCFlbHMud2l6YXJkU3RlcHBlcikgcmV0dXJuO1xuICBjb25zdCBsaXMgPSBlbHMud2l6YXJkU3RlcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwibGlbZGF0YS1zdGVwXVwiKTtcbiAgZm9yIChjb25zdCBsaSBvZiBsaXMpIHtcbiAgICBjb25zdCBuID0gTnVtYmVyKGxpLmRhdGFzZXQuc3RlcCk7XG4gICAgY29uc3QgaXNBY3RpdmUgPSBuID09PSBfYWN0aXZlU3RlcDtcbiAgICBjb25zdCBpc0RvbmUgPSBfaXNTdGVwRG9uZShuKTtcbiAgICBpZiAoaXNBY3RpdmUpIGxpLnNldEF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiLCBcInRydWVcIik7XG4gICAgZWxzZSBsaS5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWN1cnJlbnRcIik7XG4gICAgaWYgKGlzRG9uZSkgbGkuZGF0YXNldC5kb25lID0gXCJ0cnVlXCI7XG4gICAgZWxzZSBkZWxldGUgbGkuZGF0YXNldC5kb25lO1xuICB9XG4gIC8vIFN0ZXAgMSdzIHRocmVlIHN1Yi1jYXJkcyAob2ZmLW5oaSAvIG5lZWRzLWxvZ2luIC8gbG9naW4tb2spIGFyZVxuICAvLyBtdXR1YWxseSBleGNsdXNpdmUgXHUyMDE0IHBpY2sgdGhlIG9uZSB0aGF0IG1hdGNoZXMgY3VycmVudCBzdGF0ZS5cbiAgY29uc3Qgb25OaGkgPSAhZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5vZmZOaGk7XG4gIGNvbnN0IGxvZ2dlZEluID0gZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiAhPT0gXCJub1wiO1xuICBpZiAoZWxzLm9wZW5OaGlTZWN0aW9uKVxuICAgIGVscy5vcGVuTmhpU2VjdGlvbi5oaWRkZW4gPSBvbk5oaTtcbiAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbilcbiAgICBlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24uaGlkZGVuID0gIW9uTmhpIHx8IGxvZ2dlZEluO1xuICBpZiAoZWxzLmxvZ2luT2tTZWN0aW9uKVxuICAgIGVscy5sb2dpbk9rU2VjdGlvbi5oaWRkZW4gPSAhKG9uTmhpICYmIGxvZ2dlZEluKTtcblxuICBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbn1cblxuLy8gU2hvdy9oaWRlIHN0ZXAtMyByZXN1bHQgY2FyZHMgYmFzZWQgb24gd2hldGhlciBlYWNoIGhhcyBjb250ZW50LlxuLy8gRW1wdHkgY2FyZHMgKGUuZy4gYSBzdW1tYXJ5IGNhcmQgd2l0aCBubyBzdGF0dXMgKyBubyBkYXRhLXN0YXRlIGluXG4vLyBsb2NhbCBtb2RlIHByZS1zeW5jKSB1c2VkIHRvIHJlbmRlciBhcyBhIGJsYW5rIHN0cmlwZSBcdTIwMTQgbm93IHRoZXlcbi8vIHN0YXkgY29sbGFwc2VkIGluZGl2aWR1YWxseSwgYW5kIHRoZSB3aG9sZSB6b25lIGdvZXMgYXdheSB3aGVuIGFsbFxuLy8gdGhyZWUgY2FyZHMgd291bGQgYmUgZW1wdHkuXG5mdW5jdGlvbiBfcmVmcmVzaFJlc3VsdFpvbmUoKSB7XG4gIGlmICghZWxzLnJlc3VsdFpvbmUpIHJldHVybjtcbiAgY29uc3QgaGFzU3RhdHVzID0gKGVscy5zdGF0dXM/LnRleHRDb250ZW50ID8/IFwiXCIpLnRyaW0oKSAhPT0gXCJcIjtcbiAgY29uc3QgZGF0YVN0YXRlU2hvd24gPVxuICAgIGVscy5kYXRhU3RhdGVTZWN0aW9uICYmICFlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW47XG4gIGNvbnN0IGJ1bmRsZVNob3duID1cbiAgICBlbHMucGVuZGluZ0J1bmRsZSAmJiAhZWxzLnBlbmRpbmdCdW5kbGUuaGlkZGVuO1xuICAvLyBMYXVuY2ggYnV0dG9uIG9ubHkgY291bnRzIHdoZW4gdXNhYmxlIFx1MjAxNCBiYWNrZW5kIG1vZGUgKyB0aGUgcGF0aWVudFxuICAvLyBhY3R1YWxseSBleGlzdHMgb24gdGhlIGJhY2tlbmQgKGBsYXVuY2hCdG4uZGlzYWJsZWQgPT09IGZhbHNlYCkuXG4gIC8vIEEgcGVybWEtZGlzYWJsZWQgYnV0dG9uIHNob3VsZG4ndCBwaW4gdGhlIHpvbmUgb3Blbi5cbiAgY29uc3QgbGF1bmNoVXNhYmxlID1cbiAgICBjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBlbHMubGF1bmNoQnRuICYmICFlbHMubGF1bmNoQnRuLmRpc2FibGVkO1xuXG4gIGlmIChlbHMuc3VtbWFyeUNhcmQpIHtcbiAgICBlbHMuc3VtbWFyeUNhcmQuaGlkZGVuID0gIShoYXNTdGF0dXMgfHwgZGF0YVN0YXRlU2hvd24pO1xuICB9XG4gIGlmIChlbHMubGF1bmNoQmxvY2spIHtcbiAgICAvLyBIaWRlIHRoZSBsYXVuY2ggY2FyZCBvdXRyaWdodCB3aGVuIGl0J2QgYmUganVzdCBhIGRpc2FibGVkIGJ1dHRvblxuICAgIC8vIFx1MjAxNCBrZWVwcyBiYWNrZW5kIG1vZGUncyBwcmUtc3luYyByZXN1bHQgem9uZSBmcm9tIHNob3dpbmcgYSBmYWludFxuICAgIC8vIG91dGxpbmVkLWJ1dC1kaXNhYmxlZCBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU1NUYgU01BUlQgQXBwXCIgd2l0aCBubyBjb250ZXh0LlxuICAgIGVscy5sYXVuY2hCbG9jay5oaWRkZW4gPSAhbGF1bmNoVXNhYmxlO1xuICB9XG4gIGVscy5yZXN1bHRab25lLmhpZGRlbiA9ICEoaGFzU3RhdHVzIHx8IGJ1bmRsZVNob3duIHx8IGRhdGFTdGF0ZVNob3duIHx8IGxhdW5jaFVzYWJsZSk7XG59XG5cbmZ1bmN0aW9uIF9tYXliZUF1dG9BZHZhbmNlKCkge1xuICAvLyBPbmx5IGFkdmFuY2UgZm9yd2FyZCwgbmV2ZXIgYmFjay4gU2F2ZSB1c2VyJ3MgcGxhY2UgaWYgdGhleSd2ZVxuICAvLyBjbGlja2VkIGludG8gYSBsYXRlciBzdGVwIG1hbnVhbGx5LlxuICBpZiAoX2FjdGl2ZVN0ZXAgPT09IDEgJiYgX2lzU3RlcERvbmUoMSkpIF9zZXRBY3RpdmVTdGVwKDIpO1xuICBlbHNlIGlmIChfYWN0aXZlU3RlcCA9PT0gMiAmJiBfaXNTdGVwRG9uZSgyKSkgX3NldEFjdGl2ZVN0ZXAoMyk7XG59XG5cbmZ1bmN0aW9uIF9pbml0V2l6YXJkKCkge1xuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSByZXR1cm47XG4gIF93aXphcmRJbml0aWFsaXplZCA9IHRydWU7XG4gIC8vIEluaXRpYWwgc3RlcDogd2hpY2hldmVyIGlzIHRoZSBGSVJTVCBub3QteWV0LWRvbmUgc3RlcCBhdCBwb3B1cCBvcGVuLlxuICAvLyBGaXJzdC10aW1lIHVzZXIgXHUyMTkyIHN0ZXAgMS4gUmV0dXJuaW5nIHVzZXIgd2l0aCB2YWxpZCBzZXNzaW9uICsgc2F2ZWRcbiAgLy8gcGF0aWVudCBcdTIxOTIgc3RlcCAzLlxuICBjb25zdCBzdGFydCA9IF9pc1N0ZXBEb25lKDEpID8gKF9pc1N0ZXBEb25lKDIpID8gMyA6IDIpIDogMTtcbiAgX3NldEFjdGl2ZVN0ZXAoc3RhcnQsIHsgc2lsZW50OiB0cnVlIH0pO1xuXG4gIC8vIFN0ZXBwZXIgY2xpY2tzIFx1MjE5MiBqdW1wXG4gIGZvciAoY29uc3QgbGkgb2YgZWxzLndpemFyZFN0ZXBwZXIucXVlcnlTZWxlY3RvckFsbChcImxpW2RhdGEtc3RlcF1cIikpIHtcbiAgICBsaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gX3NldEFjdGl2ZVN0ZXAoTnVtYmVyKGxpLmRhdGFzZXQuc3RlcCkpKTtcbiAgICBsaS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiIFwiKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgX3NldEFjdGl2ZVN0ZXAoTnVtYmVyKGxpLmRhdGFzZXQuc3RlcCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCkge1xuICAvLyBTeW5jIGJ1dHRvbi4gQ29uZGl0aW9ucywgaW4gcHJpb3JpdHkgb3JkZXI6XG4gIC8vICAgMS4gb24gYW4gTkhJIHRhYlxuICAvLyAgIDIuIGxvZ2dlZCBpbiB0byBOSEkgKGRldGVjdGVkIHZpYSBiYWNrZ3JvdW5kIHByZS1mbGlnaHQpXG4gIC8vICAgMy4gYmFja2VuZCBtb2RlIFx1MjE5MiBiYWNrZW5kIGNvbm5lY3RlZFxuICAvLyAgIDQuIGdlbmRlciBmaWxsZWQgKG90aGVyIHBhdGllbnQgZmllbGRzIGFsbCBvcHRpb25hbClcbiAgLy8gV2hhdGV2ZXIgYmxvY2tzIHRoZSBDVEEgYWxzbyBnZXRzIHN1cmZhY2VkIGFzIGFuIGlubGluZSBtZXNzYWdlXG4gIC8vIGJlbG93IHRoZSBidXR0b24gXHUyMDE0IHRvb2x0aXBzIGFyZSBpbnZpc2libGUgaW4gdGhlIDM2MHB4IHBvcHVwLlxuICBjb25zdCBvbk5oaSA9ICFlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgY29uc3QgbG9nZ2VkSW4gPSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm5oaUxvZ2dlZEluICE9PSBcIm5vXCI7XG4gIGNvbnN0IG1vZGVPayA9IGN1cnJlbnRNb2RlKCkgPT09IFwibG9jYWxcIiB8fCBfY29ublN0YXRlID09PSBcIm9rXCI7XG4gIGNvbnN0IGdlbmRlck9rID0gISFlbHMub3ZHZW5kZXI/LnZhbHVlO1xuICBjb25zdCBkb2JFcnJvciA9IHZhbGlkYXRlQmlydGhEYXRlKCk7XG5cbiAgLy8gRWFjaCBibG9ja2luZyByZWFzb24gbmFtZXMgdGhlIHN0ZXAgdGhhdCBuZWVkcyBhdHRlbnRpb24uIE1vZGUgK1xuICAvLyBjb25uZWN0aW9uIG5vdyBsaXZlIGluIHN0ZXAgMyBhbG9uZ3NpZGUgdGhlIENUQSBpdHNlbGYsIHNvIHRob3NlXG4gIC8vIHJlYXNvbnMgcmVmZXJlbmNlIHdoYXQncyBkaXJlY3RseSBhYm92ZSB0aGUgYnV0dG9uIHJhdGhlciB0aGFuXG4gIC8vIHNlbmRpbmcgdGhlIHVzZXIgYmFjayB0aHJvdWdoIHRoZSBzdGVwcGVyLlxuICBsZXQgcmVhc29uID0gXCJcIjtcbiAgaWYgKCFvbk5oaSkgcmVhc29uID0gXCJcdTU2REUgXHUyNDYwIFx1NzY3Qlx1NTE2NVx1RkYxQVx1OEFDQlx1NTIwN1x1NTIzMFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NTIwNlx1OTgwMVwiO1xuICBlbHNlIGlmICghbG9nZ2VkSW4pIHJlYXNvbiA9IFwiXHU1NkRFIFx1MjQ2MCBcdTc2N0JcdTUxNjVcdUZGMUFcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTUyMDZcdTk4MDFcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcIjtcbiAgZWxzZSBpZiAoIWdlbmRlck9rKSByZWFzb24gPSBcIlx1NTZERSBcdTI0NjEgXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XHVGRjFBXHU4QUNCXHU5MDc4XHU2NEM3XHU2MDI3XHU1MjI1XHU0RTI2XHU2MzA5XHU3OEJBXHU1QjlBXCI7XG4gIGVsc2UgaWYgKGRvYkVycm9yKSByZWFzb24gPSBgXHU1NkRFIFx1MjQ2MSBcdTYwQThcdTc2ODRcdThDQzdcdTY1OTlcdUZGMUEke2RvYkVycm9yfWA7XG4gIGVsc2UgaWYgKCFtb2RlT2spIHJlYXNvbiA9IFwiXHU1RjhDXHU3QUVGXHU1QzFBXHU2NzJBXHU5MDIzXHU3RERBIFx1MjAxNCBcdTc3MEJcdTRFMEFcdTY1QjlcdTdEMDVcdTgyNzJcdTYzRDBcdTc5M0FcdUZGMENcdTYyMTZcdTY1MzlcdTU2REVcdTMwMENcdUQ4M0RcdURDQkUgXHU0RTBCXHU4RjA5XHU1MjMwXHU5NkZCXHU4MTY2XHUzMDBEXCI7XG5cbiAgZWxzLnN5bmNBcGlCdG4uZGlzYWJsZWQgPSByZWFzb24gIT09IFwiXCI7XG4gIGVscy5zeW5jQXBpQnRuLnRpdGxlID0gcmVhc29uO1xuICBpZiAoZWxzLnN5bmNCbG9ja2VkUmVhc29uKSB7XG4gICAgZWxzLnN5bmNCbG9ja2VkUmVhc29uLnRleHRDb250ZW50ID0gcmVhc29uID8gYFx1MjZBMFx1RkUwRiAke3JlYXNvbn1gIDogXCJcIjtcbiAgICBlbHMuc3luY0Jsb2NrZWRSZWFzb24uaGlkZGVuID0gcmVhc29uID09PSBcIlwiO1xuICB9XG5cbiAgLy8gTGF1bmNoIGJ1dHRvbjogYmFja2VuZCBtb2RlICsgY29ubiBvayArIHBhdGllbnQgc2V0ICsgYmFja2VuZFxuICAvLyBhY3R1YWxseSBoYXMgdGhpcyBwYXRpZW50IChvdGhlcndpc2UgdGhlIFNNQVJUIGFwcCBsYXVuY2hlcyBpbnRvXG4gIC8vIGFuIGVtcHR5IEZISVIgc3RvcmUgXHUyMDE0IGNvbmZ1c2luZyBibGFuayBzY3JlZW4pLlxuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBjb25zdCBoYXZlQmFja2VuZFBhdGllbnQgPSBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiO1xuICBlbHMubGF1bmNoQnRuLmRpc2FibGVkID0gIShcbiAgICBjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJlxuICAgIF9jb25uU3RhdGUgPT09IFwib2tcIiAmJlxuICAgICEhb3Y/LmlkX25vICYmXG4gICAgaGF2ZUJhY2tlbmRQYXRpZW50XG4gICk7XG4gIGVscy5sYXVuY2hCdG4udGl0bGUgPVxuICAgIGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiICA/IFwiXHU4QUNCXHU1MjA3XHU1MjMwXHUzMDBDXHVEODNDXHVERkU1IFx1NjcyQ1x1NkE1Rlx1NUY4Q1x1N0FFRiAoXHU5MDMyXHU5NjhFKVx1MzAwRFx1NkEyMVx1NUYwRlwiIDpcbiAgICBfY29ublN0YXRlICE9PSBcIm9rXCIgICAgICAgICAgID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTY3MkFcdTkwMjNcdTdEREFcIiA6XG4gICAgIW92Py5pZF9ubyAgICAgICAgICAgICAgICAgICAgPyBcIlx1NTZERSBcdTI0NjEgXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XHVGRjFBXHU4QUNCXHU1ODZCXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCIgOlxuICAgICFoYXZlQmFja2VuZFBhdGllbnQgICAgICAgICAgID8gXCJcdTVGOENcdTdBRUZcdTVDMUFcdTcxMjFcdTZCNjRcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTkgXHUyMDE0IFx1NTE0OFx1NjMwOVx1MzAwQ1x1RDgzRFx1REQwNCBcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTMwMERcdTYyMTZcdTRFMEJcdTY1QjlcdTMwMENcdUQ4M0RcdURDRTQgXHU2MjhBXHU2NzJDXHU1NzMwXHU2QTk0XHU2ODQ4XHU0RTBBXHU1MEIzXHU1MjMwXHU1RjhDXHU3QUVGXHUzMDBEXCIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIjtcblxuICAvLyBSZWZyZXNoIHRoZSBzdGVwcGVyIFVJIG9uIGV2ZXJ5IHN0YXRlIGNoYW5nZSwgYnV0IERPTidUIGF1dG8tXG4gIC8vIGFkdmFuY2UgZnJvbSBoZXJlIFx1MjAxNCBpbmNpZGVudGFsIGlucHV0IGNoYW5nZXMgKHR5cGluZyBpbiBhIGZpZWxkXG4gIC8vIHdoaWxlIHJldmlzaXRpbmcgc3RlcCAyKSBzaG91bGRuJ3QgeWFuayB0aGUgdXNlciBmb3J3YXJkLiBBdXRvLVxuICAvLyBhZHZhbmNlIGlzIG9ubHkgZmlyZWQgZnJvbSB0aGUgZXZlbnRzIHRoYXQgc2lnbmFsIGludGVudDpcbiAgLy8gICAtIGxvZ2luIHByb2JlIGZsaXBwaW5nIHRvIHRydWUgXHUyMTkyIGZvcndhcmQgaW50byBzdGVwIDJcbiAgLy8gICAtIHNhdmVQYXRpZW50T3ZlcnJpZGUgc3VjY2VzcyBcdTIxOTIgZm9yd2FyZCBpbnRvIHN0ZXAgM1xuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFdpemFyZFVpKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpIHtcbiAgY29uc3QgdXJsID0gZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpO1xuICBpZiAoIXVybCkge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vLXVybFwiIH07XG4gICAgX3JlbmRlckNvbm5CYW5uZXIoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTsgcmV0dXJuIGZhbHNlO1xuICB9XG4gIF9jb25uU3RhdGUgPSBcImNoZWNraW5nXCI7IF9jb25uRmFpbFJlYXNvbiA9IG51bGw7XG4gIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG5cbiAgY29uc3QgcGVybSA9IGF3YWl0IGVuc3VyZUJhY2tlbmRQZXJtaXNzaW9uKHVybCk7XG4gIGlmICghcGVybS5vaykge1xuICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcIm5vLXBlcm1pc3Npb25cIiB9O1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7IHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGN0cmwgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBjdHJsLmFib3J0KCksIDUwMDApO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3VybC5yZXBsYWNlKC9cXC8kLywgXCJcIil9L2ZoaXIvbWV0YWRhdGFgLCB7IHNpZ25hbDogY3RybC5zaWduYWwgfSk7XG4gICAgaWYgKCFyZXMub2spIHtcbiAgICAgIF9jb25uU3RhdGUgPSBcImZhaWxcIjsgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBcImh0dHBcIiwgZGV0YWlsOiByZXMuc3RhdHVzIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXMuanNvbigpLmNhdGNoKCgpID0+IG51bGwpO1xuICAgICAgaWYgKGJvZHk/LnJlc291cmNlVHlwZSAhPT0gXCJDYXBhYmlsaXR5U3RhdGVtZW50XCIpIHtcbiAgICAgICAgX2Nvbm5TdGF0ZSA9IFwiZmFpbFwiOyBfY29ubkZhaWxSZWFzb24gPSB7IGtpbmQ6IFwibm90LWZoaXJcIiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2Nvbm5TdGF0ZSA9IFwib2tcIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfY29ublN0YXRlID0gXCJmYWlsXCI7XG4gICAgX2Nvbm5GYWlsUmVhc29uID0geyBraW5kOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0XCIgOiBcIm5ldHdvcmtcIiB9O1xuICB9IGZpbmFsbHkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gIH1cblxuICBfcmVuZGVyQ29ubkJhbm5lcigpO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAvLyBXaGVuZXZlciBjb25uZWN0aXZpdHkgZmxpcHMsIHJlLWNoZWNrIHdoZXRoZXIgdGhpcyBwYXRpZW50IGFscmVhZHlcbiAgLy8gZXhpc3RzIG9uIGJhY2tlbmQuIChTdGFsZSBcIl9iYWNrZW5kUGF0aWVudFwiIHN0YXRlIHdvdWxkIG90aGVyd2lzZVxuICAvLyBjYXVzZSBMYXVuY2ggdG8gbG9vayBlbmFibGVkIC8gZGlzYWJsZWQgd3JvbmdseS4pXG4gIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIikgY2hlY2tCYWNrZW5kUGF0aWVudCgpO1xuICByZXR1cm4gX2Nvbm5TdGF0ZSA9PT0gXCJva1wiO1xufVxuXG5lbHMuY29ublJldHJ5QnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGVzdEJhY2tlbmRDb25uZWN0aW9uKTtcblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tlbmQgXHUyMTk0IGxvY2FsIGRhdGEtc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gSW5kZXBlbmRlbnQgb2YgdGhlIGNvbm5lY3Rpb24gYmFubmVyICh3aGljaCBvbmx5IHRlbGxzIHVzIFwiY2FuIHdlXG4vLyByZWFjaCB0aGUgYmFja2VuZFwiKS4gVGhpcyBjYXJkIGFuc3dlcnMgdHdvIHF1ZXN0aW9uczpcbi8vXG4vLyAgIDEuIERvZXMgdGhlIGJhY2tlbmQgYWxyZWFkeSBoYXZlIHRoaXMgcGF0aWVudCdzIGRhdGE/XG4vLyAgICAgIFx1MjE5MiBkcml2ZXMgd2hldGhlciBcdUQ4M0RcdURFODAgTGF1bmNoIGlzIGFsbG93ZWQgYXQgYWxsIChMYXVuY2ggb24gYW5cbi8vICAgICAgICBlbXB0eSBiYWNrZW5kIGdpdmVzIGEgY29uZnVzaW5nIFNNQVJULWFwcCBibGFuaykuXG4vLyAgIDIuIERvZXMgdGhlIHVzZXIgaGF2ZSBhIGxvY2FsIEJ1bmRsZSB0aGF0J3MgbmV3ZXIgdGhhbiB0aGVcbi8vICAgICAgYmFja2VuZCdzIHZpZXc/XG4vLyAgICAgIFx1MjE5MiBvZmZlciBcIlx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjNcdTY3MkNcdTU3MzAgQnVuZGxlIFx1NTIzMFx1NUY4Q1x1N0FFRlwiIHRvIHB1c2ggaXQgdmlhIC9maGlyL2ltcG9ydFxuLy8gICAgICAgIHdpdGhvdXQgcmUtZmV0Y2hpbmcgTkhJIChmYXN0LCBub24tZGVzdHJ1Y3RpdmU6IHN0YWJsZSBJRHNcbi8vICAgICAgICB1cHNlcnQgc28gYmFja2VuZCByZXNvdXJjZXMganVzdCBidW1wIHZlcnNpb25JZCkuXG4vL1xuLy8gV2UgZG9uJ3Qgc2Vjb25kLWd1ZXNzIHRoZSB1c2VyOiBldmVuIHdoZW4gbG9jYWwgaXMgY2xlYXJseSBuZXdlcixcbi8vIExhdW5jaCBzdGF5cyBlbmFibGVkIGlmIHRoZSBiYWNrZW5kIGhhcyB0aGUgcGF0aWVudCBcdTIwMTQgdGhleSBtYXlcbi8vIGdlbnVpbmVseSB3YW50IHRvIGxvb2sgYXQgdGhlIG9sZGVyIHN0YXRlLiBUaGUgVUkgbGF5cyBvdXQgYm90aFxuLy8gc2lkZXM7IHVzZXIgZGVjaWRlcy5cblxubGV0IF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbi8vICAgc3RhdGU6IFwidW5rbm93blwiIHwgXCJjaGVja2luZ1wiIHwgXCJhYnNlbnRcIiB8IFwicHJlc2VudFwiIHwgXCJmYWlsXCJcbmxldCBfbG9jYWxCdW5kbGUgPSB7IGV4aXN0czogZmFsc2UsIGNvdW50OiAwLCBnZW5lcmF0ZWRBdDogMCwgcGF0aWVudElkOiBudWxsIH07XG5cbmZ1bmN0aW9uIF9mbXRUaW1lU2hvcnQoaXNvKSB7XG4gIGlmICghaXNvKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XG4gIGlmIChOdW1iZXIuaXNOYU4oZC5nZXRUaW1lKCkpKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gIHJldHVybiBgJHtkLmdldE1vbnRoKCkgKyAxfS8ke2QuZ2V0RGF0ZSgpfSAke3BhZChkLmdldEhvdXJzKCkpfToke3BhZChkLmdldE1pbnV0ZXMoKSl9YDtcbn1cblxuZnVuY3Rpb24gX2ZtdFJlbGF0aXZlKG1zKSB7XG4gIGNvbnN0IGRpZmYgPSBEYXRlLm5vdygpIC0gbXM7XG4gIGlmIChkaWZmIDwgNjBfMDAwKSByZXR1cm4gYCR7TWF0aC5tYXgoMSwgTWF0aC5yb3VuZChkaWZmIC8gMTAwMCkpfSBcdTc5RDJcdTUyNERgO1xuICBpZiAoZGlmZiA8IDM2MDBfMDAwKSByZXR1cm4gYCR7TWF0aC5yb3VuZChkaWZmIC8gNjBfMDAwKX0gXHU1MjA2XHU5NDE4XHU1MjREYDtcbiAgaWYgKGRpZmYgPCA4Nl80MDBfMDAwKSByZXR1cm4gYCR7TWF0aC5yb3VuZChkaWZmIC8gMzYwMF8wMDApfSBcdTVDMEZcdTY2NDJcdTUyNERgO1xuICByZXR1cm4gX2ZtdFRpbWVTaG9ydChuZXcgRGF0ZShtcykudG9JU09TdHJpbmcoKSk7XG59XG5cbmZ1bmN0aW9uIF9yZW5kZXJEYXRhU3RhdGUoKSB7XG4gIC8vIFNlY3Rpb24gb25seSB2aXNpYmxlIGluIGJhY2tlbmQgbW9kZSAoaGFuZGxlZCBieSAuYmFja2VuZC1vbmx5IENTUyksXG4gIC8vIGJ1dCB3ZSBhbHNvIGV4cGxpY2l0bHkgaGlkZSB3aGVuIHRoZSBwb3B1cCBoYXMgbm8gcGF0aWVudF9vdmVycmlkZVxuICAvLyBzZXQsIHNpbmNlIGJvdGggY2hlY2tzIGtleSBvZmYgcGF0aWVudF9pZC5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKGN1cnJlbnRNb2RlKCkgIT09IFwiYmFja2VuZFwiIHx8ICFvdj8uaWRfbm8pIHtcbiAgICBlbHMuZGF0YVN0YXRlU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChlbHMuc3luY1N0YXR1c0hpbnQpIGVscy5zeW5jU3RhdHVzSGludC5oaWRkZW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENhcmQgc2VydmVzIGFzIGFuIGFsZXJ0LCBub3QgYSBkYXNoYm9hcmQgXHUyMDE0IHNob3cgb25seSB3aGVuIHRoZXJlJ3NcbiAgLy8gc29tZXRoaW5nIGFjdGlvbmFibGUgLyB3b3J0aCBmbGFnZ2luZy4gSGlkZSB3aGVuOlxuICAvLyAgIC0gYmFja2VuZCBoYXMgdGhpcyBwYXRpZW50IEFORCBubyBsb2NhbCBidW5kbGUgdG8gY29tcGFyZSBhZ2FpbnN0XG4gIC8vICAgICAoTGF1bmNoIGlzIGVuYWJsZWQgXHUyMTkyIHRoYXQncyB0aGUgc2lnbmFsIGV2ZXJ5dGhpbmcncyBmaW5lKSwgb3JcbiAgLy8gICAtIGJvdGggc2lkZXMgYWdyZWUgb24gY291bnQgKGFscmVhZHkgaW4gc3luYywgbm8gdXBsb2FkIG5lZWRlZCkuXG4gIC8vIFRoZSByZW1haW5pbmcgc3RhdGVzIChjaGVja2luZyAvIGZhaWwgLyBhYnNlbnQgLyBjb3VudCBtaXNtYXRjaCkgYWxsXG4gIC8vIGVpdGhlciBuZWVkIHVzZXIgYXR0ZW50aW9uIG9yIGFyZSB0cmFuc2llbnQgbG9hZGluZyBmZWVkYmFjay5cbiAgY29uc3QgbG9jYWxNYXRjaGVzID0gX2xvY2FsQnVuZGxlLmV4aXN0cyAmJiBfbG9jYWxCdW5kbGUucGF0aWVudElkID09PSBvdi5pZF9ubztcbiAgY29uc3QgaW5TeW5jID1cbiAgICBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiICYmXG4gICAgbG9jYWxNYXRjaGVzICYmXG4gICAgX2JhY2tlbmRQYXRpZW50LmNvdW50ID09PSBfbG9jYWxCdW5kbGUuY291bnQ7XG4gIC8vIFF1aWV0IFwiXHUyNzEzIFx1NURGMlx1NTQwQ1x1NkI2NVwiIGhpbnQgc2l0cyB1bmRlciB0aGUgZG93bmxvYWQgYnV0dG9uIHdoZW4gaW4tc3luYyBcdTIwMTRcbiAgLy8gZ2l2ZXMgdGhlIHVzZXIgYSB0aW55IGFja25vd2xlZGdlbWVudCBpbnN0ZWFkIG9mIHRvdGFsIHNpbGVuY2UuXG4gIGlmIChlbHMuc3luY1N0YXR1c0hpbnQpIGVscy5zeW5jU3RhdHVzSGludC5oaWRkZW4gPSAhaW5TeW5jO1xuICBjb25zdCBub3RoaW5nVG9TaG93ID1cbiAgICBfYmFja2VuZFBhdGllbnQuc3RhdGUgPT09IFwicHJlc2VudFwiICYmICghbG9jYWxNYXRjaGVzIHx8IGluU3luYyk7XG4gIGlmIChub3RoaW5nVG9TaG93KSB7XG4gICAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzLmRhdGFTdGF0ZVNlY3Rpb24uaGlkZGVuID0gZmFsc2U7XG5cbiAgLy8gQmFja2VuZCByb3dcbiAgY29uc3QgYnMgPSBlbHMuYmFja2VuZFN0YXRlO1xuICBzd2l0Y2ggKF9iYWNrZW5kUGF0aWVudC5zdGF0ZSkge1xuICAgIGNhc2UgXCJjaGVja2luZ1wiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZVwiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBcIlx1NkFBMlx1NjdFNVx1NEUyRFx1MjAyNlwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImFic2VudFwiOlxuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZSBlbXB0eVwiO1xuICAgICAgLy8gQ2FyZCBzaXRzIGluc2lkZSB0aGUgcmVzdWx0IHpvbmUgbmV4dCB0byB0aGUgXHVEODNEXHVERDA0IFx1NTNENlx1NUY5NyBDVEEgYW5kXG4gICAgICAvLyB0aGUgXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCMyBidXR0b24gXHUyMDE0IHBvaW50aW5nIGF0IHRoZW0gd2l0aCB0ZXh0IHdvdWxkIGJlXG4gICAgICAvLyBkb3VibGUtdGFsay4gSnVzdCBzdGF0ZSB0aGUgZmFjdC5cbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTI2QTAgXHU1QzFBXHU3MTIxXHU2QjY0XHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicHJlc2VudFwiOiB7XG4gICAgICBjb25zdCBjb3VudCA9IF9iYWNrZW5kUGF0aWVudC5jb3VudDtcbiAgICAgIGNvbnN0IHRzID0gX2JhY2tlbmRQYXRpZW50Lmxhc3RVcGRhdGVkO1xuICAgICAgYnMuY2xhc3NOYW1lID0gXCJzdGF0ZS12YWx1ZSBva1wiO1xuICAgICAgYnMudGV4dENvbnRlbnQgPSBgXHUyNzEzICR7Y291bnQgPiAwID8gYCR7Y291bnR9IFx1N0I0NiBcdTAwQjcgYCA6IFwiXCJ9XHU2NzAwXHU1RjhDXHU2NkY0XHU2NUIwICR7X2ZtdFRpbWVTaG9ydCh0cykgfHwgXCIodW5rbm93bilcIn1gO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJmYWlsXCI6XG4gICAgICBicy5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIGZhaWxcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTI3MTcgXHU2QUEyXHU2N0U1XHU1OTMxXHU2NTU3XHVGRjA4XHU3NzBCXHU5MDIzXHU3RERBIGJhbm5lclx1RkYwOVwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJzLmNsYXNzTmFtZSA9IFwic3RhdGUtdmFsdWVcIjtcbiAgICAgIGJzLnRleHRDb250ZW50ID0gXCJcdTIwMTRcIjtcbiAgfVxuXG4gIC8vIExvY2FsIHJvdyBcdTIwMTQgc2hvdyBvbmx5IHdoZW4gdGhlIHBlbmRpbmcgYnVuZGxlIG1hdGNoZXMgdGhpcyBwYXRpZW50LlxuICAvLyAobG9jYWxNYXRjaGVzIHdhcyBjb21wdXRlZCBhYm92ZSBmb3IgdGhlIGVhcmx5LXJldHVybiBjaGVjay4pXG4gIGlmIChsb2NhbE1hdGNoZXMpIHtcbiAgICBlbHMubG9jYWxTdGF0ZVJvdy5oaWRkZW4gPSBmYWxzZTtcbiAgICBlbHMubG9jYWxTdGF0ZS5jbGFzc05hbWUgPSBcInN0YXRlLXZhbHVlIG9rXCI7XG4gICAgZWxzLmxvY2FsU3RhdGUudGV4dENvbnRlbnQgPVxuICAgICAgYFx1MjcxMyAke19sb2NhbEJ1bmRsZS5jb3VudH0gXHU3QjQ2IFx1MDBCNyAke19mbXRSZWxhdGl2ZShfbG9jYWxCdW5kbGUuZ2VuZXJhdGVkQXQpfVx1NzUyMlx1NzUxRmA7XG4gIH0gZWxzZSB7XG4gICAgZWxzLmxvY2FsU3RhdGVSb3cuaGlkZGVuID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFwiXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCM1x1NjcyQ1x1NTczMCBCdW5kbGVcIiBidXR0b24gc2hvd3Mgb25seSB3aGVuIHRoZXJlJ3MgYSBsb2NhbCBidW5kbGVcbiAgLy8gZm9yIHRoaXMgcGF0aWVudC4gV2UgZG9uJ3QgcmVhY2ggdGhpcyBicmFuY2ggd2hlbiBpbi1zeW5jICh0aGVcbiAgLy8gd2hvbGUgc2VjdGlvbiBnZXRzIGhpZGRlbiBhYm92ZSksIHNvIG5vIG5lZWQgZm9yIGEgc2VwYXJhdGVcbiAgLy8gZGlzYWJsZWQgc3RhdGUgXHUyMDE0IHdoZW4gdGhlIGJ1dHRvbiBzaG93cywgdXBsb2FkIGlzIGFsd2F5cyBtZWFuaW5nZnVsLlxuICBlbHMucHVzaExvY2FsQnRuLmhpZGRlbiA9ICFsb2NhbE1hdGNoZXM7XG4gIGVscy5wdXNoTG9jYWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi50aXRsZSA9IFwiXCI7XG4gIGVscy5wdXNoTG9jYWxCdG4udGV4dENvbnRlbnQgPSBcIlx1RDgzRFx1RENFNCBcdTYyOEFcdTY3MkNcdTU3MzBcdTZBOTRcdTY4NDhcdTRFMEFcdTUwQjNcdTUyMzBcdTVGOENcdTdBRUZcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBfbG9jYWxCdW5kbGUgPSBwZW5kaW5nXG4gICAgPyB7XG4gICAgICAgIGV4aXN0czogdHJ1ZSxcbiAgICAgICAgY291bnQ6IEFycmF5LmlzQXJyYXkoSlNPTi5wYXJzZShwZW5kaW5nLmpzb24pPy5lbnRyeSlcbiAgICAgICAgICA/IEpTT04ucGFyc2UocGVuZGluZy5qc29uKS5lbnRyeS5sZW5ndGhcbiAgICAgICAgICA6IDAsXG4gICAgICAgIGdlbmVyYXRlZEF0OiBwZW5kaW5nLmdlbmVyYXRlZEF0IHx8IDAsXG4gICAgICAgIHBhdGllbnRJZDogcGVuZGluZy5wYXRpZW50SWQgfHwgbnVsbCxcbiAgICAgIH1cbiAgICA6IHsgZXhpc3RzOiBmYWxzZSwgY291bnQ6IDAsIGdlbmVyYXRlZEF0OiAwLCBwYXRpZW50SWQ6IG51bGwgfTtcbiAgX3JlbmRlckRhdGFTdGF0ZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGVja0JhY2tlbmRQYXRpZW50KCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoY3VycmVudE1vZGUoKSAhPT0gXCJiYWNrZW5kXCIgfHwgIW92Py5pZF9ubyB8fCBfY29ublN0YXRlICE9PSBcIm9rXCIpIHtcbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInVua25vd25cIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gICAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwiY2hlY2tpbmdcIiwgY291bnQ6IDAsIGxhc3RVcGRhdGVkOiBudWxsIH07XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcblxuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICBjb25zdCBrZXkgPSBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGhlYWRlcnMgPSBrZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjoga2V5IH0gOiB7fTtcbiAgLy8gQmFja2VuZCBzdG9yZXMgUGF0aWVudCB1bmRlciB0aGUgaGFzaGVkIEZISVIgaWQsIG5ldmVyIHVuZGVyIHRoZSByYXdcbiAgLy8gbmF0aW9uYWwgSUQgXHUyMDE0IHF1ZXJ5IC8gZXhwb3J0IGJ5IHRoZSBoYXNoZWQgZm9ybS5cbiAgY29uc3QgZmhpclBpZCA9IGRlcml2ZVBhdGllbnRJZChvdi5pZF9ubyk7XG4gIHRyeSB7XG4gICAgY29uc3QgcHIgPSBhd2FpdCBmZXRjaChgJHt1cmx9L2ZoaXIvUGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLCB7IGhlYWRlcnMgfSk7XG4gICAgaWYgKHByLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcImFic2VudFwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFwci5vaykge1xuICAgICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJmYWlsXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICAgICAgX3JlbmRlckRhdGFTdGF0ZSgpOyBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwYXRpZW50ID0gYXdhaXQgcHIuanNvbigpO1xuICAgIGNvbnN0IGxhc3RVcGRhdGVkID0gcGF0aWVudD8ubWV0YT8ubGFzdFVwZGF0ZWQgPz8gbnVsbDtcbiAgICAvLyBDb3VudCB2aWEgL2ZoaXIvZXhwb3J0IFx1MjAxNCBzbGlnaHRseSBoZWF2aWVyIGJ1dCBpdCdzIHRoZSBvbmx5XG4gICAgLy8gb2ZmLXRoZS1zaGVsZiB3YXkgdG8gZ2V0IHRvdGFsIHJlc291cmNlcyBmb3IgYSBwYXRpZW50LiBDYXAgYnlcbiAgICAvLyA1cyB0aW1lb3V0IHNvIGEgc2xvdyBiYWNrZW5kIGRvZXNuJ3QgbG9jayB0aGUgcG9wdXAgZm9yZXZlci5cbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjdHJsID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGN0cmwuYWJvcnQoKSwgNTAwMCk7XG4gICAgICBjb25zdCBlciA9IGF3YWl0IGZldGNoKGAke3VybH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLCB7XG4gICAgICAgIGhlYWRlcnMsIHNpZ25hbDogY3RybC5zaWduYWwsXG4gICAgICB9KTtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICBpZiAoZXIub2spIHtcbiAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgZXIuanNvbigpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShidW5kbGUuZW50cnkpKSBjb3VudCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7IC8qIGxlYXZlIGNvdW50ID0gMDsgbm90IGZhdGFsICovIH1cbiAgICBfYmFja2VuZFBhdGllbnQgPSB7IHN0YXRlOiBcInByZXNlbnRcIiwgY291bnQsIGxhc3RVcGRhdGVkIH07XG4gIH0gY2F0Y2ggKF9lKSB7XG4gICAgX2JhY2tlbmRQYXRpZW50ID0geyBzdGF0ZTogXCJmYWlsXCIsIGNvdW50OiAwLCBsYXN0VXBkYXRlZDogbnVsbCB9O1xuICB9XG4gIF9yZW5kZXJEYXRhU3RhdGUoKTtcbiAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHVzaExvY2FsQnVuZGxlVG9CYWNrZW5kKCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoIW92Py5pZF9ubyB8fCAhX2xvY2FsQnVuZGxlLmV4aXN0cyB8fCBfbG9jYWxCdW5kbGUucGF0aWVudElkICE9PSBvdi5pZF9ubykgcmV0dXJuO1xuICBjb25zdCB1cmwgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCkucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICBjb25zdCBrZXkgPSBlbHMuc3luY0FwaUtleS52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgLi4uKGtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBrZXkgfSA6IHt9KSxcbiAgfTtcbiAgZWxzLnB1c2hMb2NhbEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIGVscy5wdXNoTG9jYWxCdG4udGV4dENvbnRlbnQgPSBcIlx1NEUwQVx1NTBCM1x1NEUyRFx1MjAyNlwiO1xuICB0cnkge1xuICAgIGNvbnN0IHsgW1BFTkRJTkdfQlVORExFX0tFWV06IHBlbmRpbmcgfSA9XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgICBpZiAoIXBlbmRpbmc/Lmpzb24pIHRocm93IG5ldyBFcnJvcihcIm5vIGxvY2FsIGJ1bmRsZVwiKTtcbiAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7dXJsfS9maGlyL2ltcG9ydGAsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsIGhlYWRlcnMsIGJvZHk6IHBlbmRpbmcuanNvbixcbiAgICB9KTtcbiAgICBpZiAoIXIub2spIHtcbiAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByLnRleHQoKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCAke3Iuc3RhdHVzfTogJHt0ZXh0LnNsaWNlKDAsIDEyMCl9YCk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHIuanNvbigpO1xuICAgIHNldFN0YXR1cyhgXHUyNzA1IFx1NURGMlx1NEUwQVx1NTBCMyAke3Jlc3VsdC5pbXBvcnRlZCA/PyBcIj9cIn0gXHU3QjQ2XHU1MjMwXHU1RjhDXHU3QUVGYCwgXCJzdWNjZXNzXCIpO1xuICAgIGF3YWl0IGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNldFN0YXR1cyhgXHUyNkQ0IFx1NEUwQVx1NTBCM1x1NTkzMVx1NjU1N1x1RkYxQSR7ZS5tZXNzYWdlfWAsIFwiZXJyb3JcIik7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gX3JlbmRlckRhdGFTdGF0ZSgpIChhbHJlYWR5IGNhbGxlZCBmcm9tIGNoZWNrQmFja2VuZFBhdGllbnQgb25cbiAgICAvLyBzdWNjZXNzKSBkZWNpZGVzIHRoZSByaWdodCBkaXNhYmxlZCBzdGF0ZSArIGxhYmVsIGJhc2VkIG9uXG4gICAgLy8gd2hldGhlciBiYWNrZW5kIGFuZCBsb2NhbCBhZ3JlZS4gQ2FsbCBpdCBoZXJlIHRvbyB0byBjb3ZlciB0aGVcbiAgICAvLyBmYWlsdXJlIHBhdGggdGhhdCBza2lwcGVkIGNoZWNrQmFja2VuZFBhdGllbnQuXG4gICAgX3JlbmRlckRhdGFTdGF0ZSgpO1xuICB9XG59XG5cbmVscy5wdXNoTG9jYWxCdG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdXNoTG9jYWxCdW5kbGVUb0JhY2tlbmQpO1xuXG4vLyBcIlx1RDgzRFx1REQxNyBcdTk1OEJcdTU1NUZcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTc2N0JcdTUxNjVcIiBcdTIwMTQgb3BlbnMgdGhlIE5ISSBsYW5kaW5nIHBhZ2Ugc28gdGhlIHVzZXJcbi8vIGRvZXNuJ3QgaGF2ZSB0byByZW1lbWJlciAvIGdvb2dsZSB0aGUgVVJMLiBDbG9zZXMgdGhlIHBvcHVwIHNvXG4vLyB0aGV5IGRvbid0IGhhdmUgdG8gZGlzbWlzcyBpdCBtYW51YWxseSBhZnRlciB0aGUgbmV3IHRhYiBvcGVucy5cbmVscy5vcGVuTmhpQnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICBhd2FpdCBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IE5ISV9MQU5ESU5HIH0pO1xuICB3aW5kb3cuY2xvc2UoKTtcbn0pO1xuXG4vLyBMb2NhbCBidW5kbGUgc3RhdGUgY2hhbmdlcyB3aGVuZXZlciB0aGUgU1cgc3Rhc2hlcyBhIG5ldyBzeW5jLlxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gIGlmIChhcmVhID09PSBcImxvY2FsXCIgJiYgUEVORElOR19CVU5ETEVfS0VZIGluIGNoYW5nZXMpIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xufSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBTeW5jIG1vZGUgKGxvY2FsIHwgYmFja2VuZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5hc3luYyBmdW5jdGlvbiBsb2FkU3luY01vZGUoKSB7XG4gIGNvbnN0IHsgc3luY01vZGUgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcInN5bmNNb2RlXCIpO1xuICBjb25zdCBtb2RlID0gc3luY01vZGUgPT09IFwiYmFja2VuZFwiID8gXCJiYWNrZW5kXCIgOiBERUZBVUxUX01PREU7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSByLmNoZWNrZWQgPSByLnZhbHVlID09PSBtb2RlO1xuICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gIGlmIChtb2RlID09PSBcImJhY2tlbmRcIikge1xuICAgIC8vIEF1dG8tdGVzdCBvbiBvcGVuIHNvIHRoZSB1c2VyIHNlZXMgc3RhdHVzIHdpdGhvdXQgY2xpY2tpbmcuIEF3YWl0aW5nXG4gICAgLy8gaGVyZSBzZXJpYWxpemVzIHRoZSByZXN0IG9mIGluaXQoKSB1bnRpbCB3ZSBrbm93IHRoZSBhbnN3ZXIuXG4gICAgYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgX2Nvbm5TdGF0ZSA9IFwidW5rbm93blwiOyBfY29ubkZhaWxSZWFzb24gPSBudWxsO1xuICAgIF9yZW5kZXJDb25uQmFubmVyKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3VycmVudE1vZGUoKSB7XG4gIGZvciAoY29uc3QgciBvZiBlbHMubW9kZVJhZGlvcygpKSBpZiAoci5jaGVja2VkKSByZXR1cm4gci52YWx1ZTtcbiAgcmV0dXJuIERFRkFVTFRfTU9ERTtcbn1cblxuZm9yIChjb25zdCByIG9mIGVscy5tb2RlUmFkaW9zKCkpIHtcbiAgci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RlID0gY3VycmVudE1vZGUoKTtcbiAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQubW9kZSA9IG1vZGU7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY01vZGU6IG1vZGUgfSk7XG4gICAgaWYgKG1vZGUgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgICB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTsgLy8gdHJpZ2dlcnMgY2hlY2tCYWNrZW5kUGF0aWVudCBvbiBzdWNjZXNzXG4gICAgfSBlbHNlIHtcbiAgICAgIF9jb25uU3RhdGUgPSBcInVua25vd25cIjsgX2Nvbm5GYWlsUmVhc29uID0gbnVsbDtcbiAgICAgIF9iYWNrZW5kUGF0aWVudCA9IHsgc3RhdGU6IFwidW5rbm93blwiLCBjb3VudDogMCwgbGFzdFVwZGF0ZWQ6IG51bGwgfTtcbiAgICAgIF9yZW5kZXJDb25uQmFubmVyKCk7IF9yZW5kZXJEYXRhU3RhdGUoKTsgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5lbHMuYmFja2VuZFVybC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgYmFja2VuZFVybDogZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpIH0pO1xuICBlbHMuZGFzaGJvYXJkTGluay5ocmVmID0gZWxzLmJhY2tlbmRVcmwudmFsdWUucmVwbGFjZSgvOjgwMTAuKiQvLCBcIjozMDEwXCIpO1xuICBpZiAoY3VycmVudE1vZGUoKSA9PT0gXCJiYWNrZW5kXCIpIHRlc3RCYWNrZW5kQ29ubmVjdGlvbigpO1xufSk7XG5lbHMuc3luY0FwaUtleS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpIH0pO1xufSk7XG4vLyBTaWRlYmFyIFwiXHVEODNEXHVEQ0NCIFx1NTJBOVx1NzQwNlwiIHRvZ2dsZSBcdTIwMTQgcGVyc2lzdHMgaW4gY2hyb21lLnN0b3JhZ2UubG9jYWwgc28gdGhlXG4vLyBwcmVmZXJlbmNlIGlzIHN0aWNreSBhY3Jvc3MgcmVpbnN0YWxscy4gc2lkZWJhci5qcyBsaXN0ZW5zIHRvIHRoZVxuLy8gc2FtZSBrZXkgYW5kIGhpZGVzIGl0c2VsZiB3aGVuIHNldCB0byBmYWxzZS5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRTaWRlYmFyRW5hYmxlZCgpIHtcbiAgY29uc3QgeyBzaWRlYmFyRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwic2lkZWJhckVuYWJsZWRcIik7XG4gIGVscy5zaWRlYmFyRW5hYmxlZC5jaGVja2VkID0gc2lkZWJhckVuYWJsZWQgIT09IGZhbHNlOyAvLyBkZWZhdWx0IE9OXG59XG5cbmVscy5zaWRlYmFyRW5hYmxlZD8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNpZGViYXJFbmFibGVkOiBlbHMuc2lkZWJhckVuYWJsZWQuY2hlY2tlZCB9KTtcbn0pO1xuXG4vLyBNYXNrLXBhdGllbnQtbmFtZSB0b2dnbGUgXHUyMDE0IGRlZmF1bHRzIE9GRiAoY2l0aXplbnMgZG93bmxvYWRpbmcgdGhlaXJcbi8vIG93biBkYXRhIGRvbid0IG5lZWQgYW5vbnltaXphdGlvbikuIFdoZW4gT046IHBvcHVwIHN1bW1hcnksIEZISVJcbi8vIEJ1bmRsZSBvdXRwdXQsIHN5bmMtbG9nLCBhbmQgTkhJIHJlcG9ydCBuYXJyYXRpdmUgYWxsIHVzZSB0aGVcbi8vIG1hc2tlZCBmb3JtIChcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjApIGluc3RlYWQgb2YgdGhlIHJlYWwgbmFtZS5cbmxldCBfbWFza05hbWVFbmFibGVkID0gZmFsc2U7XG5hc3luYyBmdW5jdGlvbiBsb2FkTWFza05hbWVFbmFibGVkKCkge1xuICBjb25zdCB7IG1hc2tOYW1lRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwibWFza05hbWVFbmFibGVkXCIpO1xuICBfbWFza05hbWVFbmFibGVkID0gbWFza05hbWVFbmFibGVkID09PSB0cnVlO1xuICBpZiAoZWxzLm1hc2tOYW1lRW5hYmxlZCkgZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkID0gX21hc2tOYW1lRW5hYmxlZDtcbn1cblxuZnVuY3Rpb24gX21heWJlTWFzayhuYW1lKSB7XG4gIHJldHVybiBfbWFza05hbWVFbmFibGVkID8gbWFza05hbWUobmFtZSkgOiBuYW1lIHx8IFwiXCI7XG59XG5cbmVscy5tYXNrTmFtZUVuYWJsZWQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICBfbWFza05hbWVFbmFibGVkID0gZWxzLm1hc2tOYW1lRW5hYmxlZC5jaGVja2VkO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBtYXNrTmFtZUVuYWJsZWQ6IF9tYXNrTmFtZUVuYWJsZWQgfSk7XG4gIC8vIFJlLXJlbmRlciBwb3B1cCBjaHJvbWUgKHN1bW1hcnkgbGluZSBpcyB0aGUgb25seSBzcG90IHRoYXQgcmVhZHNcbiAgLy8gX21heWJlTWFzayByZWFjdGl2ZWx5OyBldmVyeXdoZXJlIGVsc2Ugc2FtcGxlcyBpdCBqdXN0LWluLXRpbWUpLlxuICByZWZyZXNoT3ZlcnJpZGVTdW1tYXJ5KCk7XG59KTtcblxuZWxzLnNtYXJ0QXBwVXJsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAvLyBQZXJzaXN0IHRyaW1tZWQgdmFsdWUuIEVtcHR5IHN0cmluZyBcdTIxOTIgcmVzdG9yZSBkZWZhdWx0IG9uIG5leHQgbG9hZC5cbiAgY29uc3QgdiA9IGVscy5zbWFydEFwcFVybC52YWx1ZS50cmltKCk7XG4gIGlmICh2KSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc21hcnRBcHBMYXVuY2hVcmw6IHYgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFwic21hcnRBcHBMYXVuY2hVcmxcIik7XG4gICAgZWxzLnNtYXJ0QXBwVXJsLnZhbHVlID0gREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICB9XG59KTtcblxuZnVuY3Rpb24gc2V0U3RhdHVzKHRleHQsIGtpbmQsIGJyZWFrZG93bikge1xuICAvLyBCdWlsZCB3aXRoIERPTSBBUEkgXHUyMDE0IGF2b2lkcyBpbm5lckhUTUwgLyBYU1Mgcmlzay5cbiAgLy8gYnJlYWtkb3duIGlzIGFuIGFycmF5IG9mIG1peGVkIGVudHJpZXM6XG4gIC8vICAgLSBwaGFzZSB0aW1pbmdzIHByZWZpeGVkIHdpdGggXCJcdTIzRjFcIiAgXHUyMTkyIFx1OTY4RVx1NkJCNVx1ODAxN1x1NjY0MlxuICAvLyAgIC0gcGVyLWVuZHBvaW50IGNvdW50cyAgICAgICAgICAgICAgICBcdTIxOTIgXHU1NDA0IGVuZHBvaW50IFx1NjI5M1x1NTIzMFx1NUU3RVx1N0I0NlxuICAvLyBCb3RoIGtpbmRzIGFyZSB0dWNrZWQgaW5zaWRlIGEgc2luZ2xlIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgdG9nZ2xlIHNvIHRoZVxuICAvLyBwb3B1cCBzdGF5cyBjb21wYWN0IGJ5IGRlZmF1bHQuXG4gIGVscy5zdGF0dXMuY2xhc3NOYW1lID0ga2luZCB8fCBcIlwiO1xuICBlbHMuc3RhdHVzLnRleHRDb250ZW50ID0gXCJcIjtcbiAgaWYgKCF0ZXh0ICYmICEoYnJlYWtkb3duICYmIGJyZWFrZG93bi5sZW5ndGgpKSByZXR1cm47XG4gIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCB8fCBcIlwiKSk7XG4gIGlmIChicmVha2Rvd24gJiYgYnJlYWtkb3duLmxlbmd0aCkge1xuICAgIGNvbnN0IHBoYXNlUm93cyA9IGJyZWFrZG93bi5maWx0ZXIoKGIpID0+IGIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG4gICAgY29uc3Qgb3RoZXJSb3dzID0gYnJlYWtkb3duLmZpbHRlcigoYikgPT4gIWIuc3RhcnRzV2l0aChcIlx1MjNGMVwiKSk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgZGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWxcIjtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgc3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCI7XG4gICAgZGV0YWlscy5hcHBlbmRDaGlsZChzdW1tYXJ5KTtcblxuICAgIGlmIChvdGhlclJvd3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGJvZHkuY2xhc3NOYW1lID0gXCJzdGF0dXMtYnJlYWtkb3duXCI7XG4gICAgICAvLyBPbmUgaXRlbSBwZXIgbGluZSBzbyBcIlx1NUMzMVx1OTFBQiAxMiBcdTdCNDYgLyBcdTg2NTVcdTY1QjkgODggXHU3QjQ2IC8gXHU2QUEyXHU5QTU3IDQxMiBcdTdCNDZcIlxuICAgICAgLy8gaXMgcmVhZGFibGU7IHRoZSAzNjBweCBwb3B1cCB3b3VsZCBoYXZlIHdyYXBwZWQgYSBmbGF0XG4gICAgICAvLyBzZXBhcmF0b3Itam9pbmVkIHN0cmluZyBpbnRvIGEgdGFuZ2xlZCBtZXNzLlxuICAgICAgZm9yIChjb25zdCByb3cgb2Ygb3RoZXJSb3dzKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsaW5lLnRleHRDb250ZW50ID0gcm93O1xuICAgICAgICBib2R5LmFwcGVuZENoaWxkKGxpbmUpO1xuICAgICAgfVxuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZChib2R5KTtcbiAgICB9XG4gICAgaWYgKHBoYXNlUm93cy5sZW5ndGgpIHtcbiAgICAgIC8vIFBoYXNlIHRpbWluZ3MgYXJlIGRldiBpbmZvIFx1MjAxNCB0dWNrIHRoZW0gaW5zaWRlIGEgc2Vjb25kIHRvZ2dsZVxuICAgICAgLy8gc28gZW5kIHVzZXJzIGRvbid0IHNlZSBcIm5oaS1wYXJhbGxlbD04c1wiIHJpZ2h0IGFmdGVyIGEgc3VjY2Vzc1xuICAgICAgLy8gYmFubmVyIGFuZCB0aGluayBzb21ldGhpbmcncyB3cm9uZy5cbiAgICAgIGNvbnN0IHRlY2hEZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgICB0ZWNoRGV0YWlscy5jbGFzc05hbWUgPSBcInN0YXR1cy1kZXRhaWwgc3RhdHVzLXRlY2hcIjtcbiAgICAgIGNvbnN0IHRlY2hTdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XG4gICAgICB0ZWNoU3VtbWFyeS50ZXh0Q29udGVudCA9IFwiXHU2MjgwXHU4ODUzXHU3RDMwXHU3QkMwXCI7XG4gICAgICB0ZWNoRGV0YWlscy5hcHBlbmRDaGlsZCh0ZWNoU3VtbWFyeSk7XG4gICAgICBjb25zdCBwaGFzZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgcGhhc2VzLmNsYXNzTmFtZSA9IFwic3RhdHVzLXBoYXNlc1wiO1xuICAgICAgcGhhc2VzLnRleHRDb250ZW50ID0gcGhhc2VSb3dzLm1hcCgocCkgPT4gcC5yZXBsYWNlKC9eXHUyM0YxXFxzKi8sIFwiXCIpKS5qb2luKFwiIFx1MDBCNyBcIik7XG4gICAgICB0ZWNoRGV0YWlscy5hcHBlbmRDaGlsZChwaGFzZXMpO1xuICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZCh0ZWNoRGV0YWlscyk7XG4gICAgfVxuICAgIGVscy5zdGF0dXMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG4gIH1cbiAgLy8gU3RhdHVzIHZpc2liaWxpdHkgZHJpdmVzIHdoZXRoZXIgdGhlIHJlc3VsdCB6b25lIHNob3dzIGF0IGFsbC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFjdGl2ZVRhYigpIHtcbiAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KTtcbiAgcmV0dXJuIHRhYjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBlbmRpbmcgRkhJUiBCdW5kbGUgKGxvY2FsLW1vZGUgcmVzdWx0KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBCYWNrZ3JvdW5kIHN0YXNoZXMgdGhlIGdlbmVyYXRlZCBCdW5kbGUgaW50byBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gdW5kZXIgYHBlbmRpbmdGaGlyQnVuZGxlYC4gUG9wdXAgcmVuZGVycyBhIGRvd25sb2FkIGJ1dHRvbi4gVXNlciBtdXN0XG4vLyBjbGljayB0byBhY3R1YWxseSB0cmlnZ2VyIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgXHUyMDE0IHRoZSBmaWxlIG5ldmVyXG4vLyBoaXRzIHRoZSBkaXNrIHVuc29saWNpdGVkLlxuXG5mdW5jdGlvbiBfZm10Qnl0ZXMobikge1xuICBpZiAobiA8IDEwMjQpIHJldHVybiBgJHtufSBCYDtcbiAgaWYgKG4gPCAxMDI0ICogMTAyNCkgcmV0dXJuIGAkeyhuIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgO1xuICByZXR1cm4gYCR7KG4gLyAoMTAyNCAqIDEwMjQpKS50b0ZpeGVkKDIpfSBNQmA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hQZW5kaW5nQnVuZGxlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBpZiAoIXBlbmRpbmcgfHwgIXBlbmRpbmcuanNvbikge1xuICAgIGVscy5wZW5kaW5nQnVuZGxlLmhpZGRlbiA9IHRydWU7XG4gICAgaWYgKF93aXphcmRJbml0aWFsaXplZCkgX3JlZnJlc2hSZXN1bHRab25lKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIElmIHRoZSB1c2VyIGhhcyBzd2l0Y2hlZCBvdmVycmlkZSB0byBhIGRpZmZlcmVudCBwYXRpZW50LCB0aGVcbiAgLy8gc3Rhc2hlZCBidW5kbGUgaXMgZm9yIHRoZSAqcHJldmlvdXMqIHBhdGllbnQuIEhpZGUgaXQgc28gdGhleVxuICAvLyBjYW4ndCBhY2NpZGVudGFsbHkgZG93bmxvYWQgdGhlIHdyb25nIGZpbGUuIFRoZSBidW5kbGUgc3RheXMgaW5cbiAgLy8gc3RvcmFnZTsgcmUtZW50ZXJpbmcgdGhlIG1hdGNoaW5nIG92ZXJyaWRlIHdpbGwgc3VyZmFjZSBpdCBhZ2Fpbi5cbiAgY29uc3Qgb3YgPSBnZXRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgaWYgKG92Py5pZF9ubyAmJiBwZW5kaW5nLnBhdGllbnRJZCAmJiBwZW5kaW5nLnBhdGllbnRJZCAhPT0gb3YuaWRfbm8pIHtcbiAgICBlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW4gPSB0cnVlO1xuICAgIGlmIChfd2l6YXJkSW5pdGlhbGl6ZWQpIF9yZWZyZXNoUmVzdWx0Wm9uZSgpO1xuICAgIHJldHVybjtcbiAgfVxuICBlbHMucGVuZGluZ0J1bmRsZS5oaWRkZW4gPSBmYWxzZTtcbiAgLy8gVXNlIHRoZSBzaGFyZWQgcmVsYXRpdmUtdGltZSBoZWxwZXIgc28gXCIyNjYgXHU3OUQyXHU1MjREXCIgYXV0by1yb2xscyBpbnRvXG4gIC8vIFwiNCBcdTUyMDZcdTk0MThcdTUyNERcIiBvbmNlIHRoZSB1c2VyIGxlYXZlcyB0aGUgcG9wdXAgb3BlbiBmb3IgYSB3aGlsZS5cbiAgY29uc3QgYWdvID0gcGVuZGluZy5nZW5lcmF0ZWRBdCA/IF9mbXRSZWxhdGl2ZShwZW5kaW5nLmdlbmVyYXRlZEF0KSA6IFwiXCI7XG4gIC8vIFJlbmRlciBpbiB0d28gcGllY2VzIHNvIGEgbG9uZyBmaWxlbmFtZSBnZXRzIGl0cyBvd24gbGluZSArIGVsbGlwc2lzLFxuICAvLyBhbmQgdGhlIHNpemUgLyBhZ2UgaW5mbyBzdGF5cyBjb21wYWN0IGJlbG93IGl0LiBBdm9pZHMgXCJmaWxlbmFtZSBcdTAwQjdcbiAgLy8gMTY5LjcgS0IgXHUwMEI3IDEgXHU3OUQyXHU1MjREXCIgd3JhcHBpbmcgYXdrd2FyZGx5IG1pZC13b3JkIGluIGEgMzYwcHggcG9wdXAuXG4gIGVscy5idW5kbGVNZXRhLnRleHRDb250ZW50ID0gXCJcIjtcbiAgY29uc3QgZm5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBmbmFtZS5jbGFzc05hbWUgPSBcImJ1bmRsZS1maWxlbmFtZVwiO1xuICBmbmFtZS50ZXh0Q29udGVudCA9IHBlbmRpbmcuZmlsZW5hbWU7XG4gIGZuYW1lLnRpdGxlID0gcGVuZGluZy5maWxlbmFtZTtcbiAgY29uc3Qgc2l6ZUFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHNpemVBZ2UuY2xhc3NOYW1lID0gXCJidW5kbGUtc2l6ZWFnZVwiO1xuICBzaXplQWdlLnRleHRDb250ZW50ID0gYCR7X2ZtdEJ5dGVzKHBlbmRpbmcuYnl0ZXMgfHwgMCl9JHthZ28gPyBgIFx1MDBCNyAke2Fnb31gIDogXCJcIn1gO1xuICBlbHMuYnVuZGxlTWV0YS5hcHBlbmRDaGlsZChmbmFtZSk7XG4gIGVscy5idW5kbGVNZXRhLmFwcGVuZENoaWxkKHNpemVBZ2UpO1xuICBpZiAoX3dpemFyZEluaXRpYWxpemVkKSBfcmVmcmVzaFJlc3VsdFpvbmUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZG93bmxvYWRQZW5kaW5nQnVuZGxlKCkge1xuICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBpZiAoIXBlbmRpbmcpIHJldHVybjtcbiAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtwZW5kaW5nLmpzb25dLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vZmhpcitqc29uXCIgfSk7XG4gIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gIHRyeSB7XG4gICAgYXdhaXQgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCh7IHVybCwgZmlsZW5hbWU6IHBlbmRpbmcuZmlsZW5hbWUsIHNhdmVBczogZmFsc2UgfSk7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gUmVsZWFzZSBhZnRlciBhIHRpY2sgc28gdGhlIGRvd25sb2FkIGhhcyB0aW1lIHRvIHN0YXJ0LlxuICAgIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCA1MDAwKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBjbGVhclBlbmRpbmdCdW5kbGUoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpO1xuICBhd2FpdCByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xuICAvLyBDbGVhcmluZyB0aGUgZG93bmxvYWQgaXMgdGhlIHVzZXIncyBcIkknbSBkb25lIHdpdGggdGhpcyByZXN1bHRcIlxuICAvLyBnZXN0dXJlIFx1MjAxNCB3aXBlIHRoZSBjb21wbGV0aW9uIHN0YXR1cyBiYW5uZXIgdG9vIHNvIHRoZSByZXN1bHQgem9uZVxuICAvLyBjb2xsYXBzZXMgZW50aXJlbHkgaW5zdGVhZCBvZiBsaW5nZXJpbmcgd2l0aCBhIHN0YWxlIFwiXHUyNzA1IFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMFwiXG4gIC8vIGFuZCBubyBkb3dubG9hZCBidXR0b24gbmV4dCB0byBpdC5cbiAgX2xhdGVzdFN0YXR1cyA9IG51bGw7XG4gIHNldFN0YXR1cyhcIlwiLCBudWxsKTtcbiAgYXdhaXQgY2hyb21lLnJ1bnRpbWVcbiAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcImNsZWFyU3luY1N0YXR1c1wiIH0pXG4gICAgLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuZWxzLmRvd25sb2FkQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBkb3dubG9hZFBlbmRpbmdCdW5kbGUpO1xuZWxzLmNsZWFyQnVuZGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhclBlbmRpbmdCdW5kbGUpO1xuXG4vLyBMaXZlIHVwZGF0ZSB3aGVuIGJhY2tncm91bmQgc3Rhc2hlcyBhIG5ldyBidW5kbGUgd2hpbGUgcG9wdXAgaXMgb3Blbi5cbi8vIChOb3RlOiBhbm90aGVyIG9uQ2hhbmdlZCBsaXN0ZW5lciBlYXJsaWVyIGluIHRoZSBmaWxlIHJlZnJlc2hlcyB0aGVcbi8vIGRhdGEtc3RhdGUgY2FyZDsgd2UgbGVhdmUgdGhhdCBvbmUgc2VwYXJhdGUgc28gZmFpbHVyZSBvZiBlaXRoZXIgcGF0aFxuLy8gZG9lc24ndCB0YWtlIHRoZSBvdGhlciBkb3duLilcbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIFBFTkRJTkdfQlVORExFX0tFWSBpbiBjaGFuZ2VzKSByZWZyZXNoUGVuZGluZ0J1bmRsZSgpO1xufSk7XG5cbi8vIEJhY2tncm91bmQtc2lkZSBmbG93IGNhbiBtdXRhdGUgdGhlIHBhdGllbnRPdmVycmlkZSBtaWQtc3luYyBcdTIwMTQgbW9zdFxuLy8gaW1wb3J0YW50bHkgX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpIHN3YXBzIHRoZSBhdXRvLVhYWFhYWFhYXG4vLyBwbGFjZWhvbGRlciBmb3IgdGhlIHJlYWwgTkhJIGNpZC4gV2l0aG91dCB0aGlzIGxpc3RlbmVyIHRoZSBwb3B1cFxuLy8gaW5wdXRzIHN0YXllZCBzdGFsZSwgcmVmcmVzaFBlbmRpbmdCdW5kbGUncyBwYXRpZW50LW1hdGNoIGNoZWNrXG4vLyB0aGVuIGNvbXBhcmVkIG9sZCBpbnB1dCB2YWx1ZSB2cy4gZnJlc2ggYnVuZGxlLnBhdGllbnRJZCBhbmQgaGlkXG4vLyB0aGUgZG93bmxvYWQgYnV0dG9uLiBSZWxvYWQgdGhlIG92ZXJyaWRlIGludG8gdGhlIGlucHV0cyB3aGVuZXZlclxuLy8gc3RvcmFnZSBjaGFuZ2VzIHNvIGV2ZXJ5IGRvd25zdHJlYW0gZ3VhcmQgc2VlcyBjb25zaXN0ZW50IHZhbHVlcy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIGNoYW5nZXMucGF0aWVudE92ZXJyaWRlKSBsb2FkUGF0aWVudE92ZXJyaWRlKCk7XG59KTtcblxuLy8gXHUyNTAwXHUyNTAwIFx1MjREOCBIZWxwLWljb24gdG9vbHRpcCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBPbmUgc2hhcmVkIDxkaXY+IGFwcGVuZGVkIHRvIHRoZSBwb3B1cCBib2R5LiBPbiBob3ZlciBvZiBhbnlcbi8vIC5oZWxwLWljb24sIHdlIGNvcHkgaXRzIGRhdGEtdGlwIHRleHQgYW5kIHBvc2l0aW9uIHRoZSB0b29sdGlwXG4vLyBpbnNpZGUgdGhlIHBvcHVwLCBjbGFtcGluZyB0byBpdHMgdmlld3BvcnQgc28gaXQgY2FuJ3QgY2xpcCBvZmZcbi8vIGVpdGhlciBlZGdlIHJlZ2FyZGxlc3Mgb2Ygd2hlcmUgdGhlIGljb24gc2l0cy4gKENTUyBwc2V1ZG8tZWxlbWVudHNcbi8vIGNhbid0IGJlIG1lYXN1cmVkLCBzbyBhIHB1cmUtQ1NTIGFwcHJvYWNoIGluZXZpdGFibHkgcGlja3Mgb25lXG4vLyBhbmNob3Igc2lkZSBhbmQgYnJlYWtzIGZvciBpY29ucyBvbiB0aGUgb3RoZXIgc2lkZSBvZiB0aGUgcG9wdXAuKVxuY29uc3QgX2hlbHBUaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuX2hlbHBUaXAuY2xhc3NOYW1lID0gXCJoZWxwLXRvb2x0aXBcIjtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoX2hlbHBUaXApO1xuXG5jb25zdCBWSUVXUE9SVF9NQVJHSU4gPSA2OyAvLyBrZWVwIHRoaXMgbWFueSBweCBjbGVhciBvZiBwb3B1cCBlZGdlc1xuXG5mdW5jdGlvbiBfc2hvd0hlbHBUb29sdGlwKGljb24pIHtcbiAgX2hlbHBUaXAudGV4dENvbnRlbnQgPSBpY29uLmRhdGFzZXQudGlwIHx8IGljb24uZ2V0QXR0cmlidXRlKFwiZGF0YS10aXBcIikgfHwgXCJcIjtcbiAgX2hlbHBUaXAuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG5cbiAgLy8gTWVhc3VyZSBub3cgdGhhdCBjb250ZW50IGlzIHNldC5cbiAgY29uc3QgaWNvblJlY3QgPSBpY29uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB0aXBSZWN0ID0gX2hlbHBUaXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHZpZXdwb3J0VyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcbiAgY29uc3Qgdmlld3BvcnRIID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcblxuICAvLyBIb3Jpem9udGFsOiBwcmVmZXIgY2VudGVyZWQgb24gdGhlIGljb247IGNsYW1wIGludG8gW21hcmdpbiwgdnctdGlwLW1hcmdpbl0uXG4gIGxldCBsZWZ0ID0gaWNvblJlY3QubGVmdCArIGljb25SZWN0LndpZHRoIC8gMiAtIHRpcFJlY3Qud2lkdGggLyAyO1xuICBpZiAobGVmdCA8IFZJRVdQT1JUX01BUkdJTikgbGVmdCA9IFZJRVdQT1JUX01BUkdJTjtcbiAgaWYgKGxlZnQgKyB0aXBSZWN0LndpZHRoID4gdmlld3BvcnRXIC0gVklFV1BPUlRfTUFSR0lOKSB7XG4gICAgbGVmdCA9IHZpZXdwb3J0VyAtIFZJRVdQT1JUX01BUkdJTiAtIHRpcFJlY3Qud2lkdGg7XG4gIH1cbiAgLy8gVmVydGljYWw6IHByZWZlciBhYm92ZSB0aGUgaWNvbjsgZmxpcCBiZWxvdyBpZiB0aGVyZSdzIG5vIHJvb20gdXAgdG9wLlxuICBsZXQgdG9wID0gaWNvblJlY3QudG9wIC0gdGlwUmVjdC5oZWlnaHQgLSA2O1xuICBpZiAodG9wIDwgVklFV1BPUlRfTUFSR0lOKSB0b3AgPSBpY29uUmVjdC5ib3R0b20gKyA2O1xuICAvLyBGaW5hbCBzYWZldHk6IGNsYW1wIGludG8gdmlld3BvcnQgc28gdmVyeSBsb25nIHRvb2x0aXBzIGNhbid0IGJsZWVkXG4gIC8vIG9mZiB0aGUgYm90dG9tIGVpdGhlci5cbiAgaWYgKHRvcCArIHRpcFJlY3QuaGVpZ2h0ID4gdmlld3BvcnRIIC0gVklFV1BPUlRfTUFSR0lOKSB7XG4gICAgdG9wID0gTWF0aC5tYXgoVklFV1BPUlRfTUFSR0lOLCB2aWV3cG9ydEggLSBWSUVXUE9SVF9NQVJHSU4gLSB0aXBSZWN0LmhlaWdodCk7XG4gIH1cblxuICBfaGVscFRpcC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gIF9oZWxwVGlwLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG59XG5cbmZ1bmN0aW9uIF9oaWRlSGVscFRvb2x0aXAoKSB7XG4gIF9oZWxwVGlwLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xufVxuXG4vLyBEZWxlZ2F0ZWQgaG92ZXIgaGFuZGxlcnMgXHUyMDE0IHdvcmtzIGZvciBpY29ucyBhZGRlZCBhZnRlciBwb3B1cCBsb2FkIHRvb1xuLy8gKGUuZy4gd2hlbiBtb2RlIHRvZ2dsZSByZXZlYWxzIGJhY2tlbmQtb25seSBmaWVsZHMpLlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCAoZSkgPT4ge1xuICBjb25zdCBpY29uID0gZS50YXJnZXQuY2xvc2VzdD8uKFwiLmhlbHAtaWNvblwiKTtcbiAgaWYgKGljb24pIF9zaG93SGVscFRvb2x0aXAoaWNvbik7XG59KTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCAoZSkgPT4ge1xuICBjb25zdCBpY29uID0gZS50YXJnZXQuY2xvc2VzdD8uKFwiLmhlbHAtaWNvblwiKTtcbiAgaWYgKGljb24pIF9oaWRlSGVscFRvb2x0aXAoKTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBpbml0KCkge1xuICBhd2FpdCBsb2FkU2lkZWJhckVuYWJsZWQoKTtcbiAgYXdhaXQgbG9hZE1hc2tOYW1lRW5hYmxlZCgpO1xuXG4gIC8vIFNlZWQgbG9jYWwgYnVuZGxlIHN0YXRlIGZyb20gc3RvcmFnZSBzbyB0aGUgZGF0YS1zdGF0ZSBjYXJkIGlzXG4gIC8vIHBvcHVsYXRlZCBhcyBzb29uIGFzIHRoZSBwb3B1cCByZW5kZXJzIChubyBmbGFzaCBvZiBcIlx1NjcyQVx1NzUyMlx1NzUxRlwiKS5cbiAgYXdhaXQgX3JlZnJlc2hMb2NhbEJ1bmRsZVN0YXRlKCk7XG5cbiAgLy8gT3JkZXIgbWF0dGVyczogbG9hZEJhY2tlbmRVcmwgcG9wdWxhdGVzIGVscy5iYWNrZW5kVXJsLnZhbHVlLCB3aGljaFxuICAvLyBsb2FkU3luY01vZGUoKSByZWFkcyB2aWEgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCkuIFJldmVyc2UgdGhpcyBhbmRcbiAgLy8gdGhlIGF1dG8tdGVzdCBzZWVzIGFuIGVtcHR5IFVSTCBhbmQgZmFsc2VseSByZXBvcnRzIFwiXHU2NzJBXHU4QTJEXHU1QjlBIEJhY2tlbmQgVVJMXCJcbiAgLy8gb24gZXZlcnkgcG9wdXAgb3Blbi5cbiAgYXdhaXQgbG9hZEJhY2tlbmRVcmwoKTtcbiAgYXdhaXQgbG9hZFN5bmNNb2RlKCk7XG4gIGF3YWl0IGxvYWRQYXRpZW50T3ZlcnJpZGUoKTtcbiAgYXdhaXQgcmVmcmVzaFBlbmRpbmdCdW5kbGUoKTtcblxuICBjb25zdCB0YWIgPSBhd2FpdCBnZXRBY3RpdmVUYWIoKTtcbiAgaWYgKCF0YWI/LnVybCkge1xuICAgIHNldFN0YXR1cyhcIm5vIGFjdGl2ZSB0YWJcIiwgXCJlcnJvclwiKTtcbiAgICBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaSA9IFwiMVwiO1xuICAgIF9yZWZyZXNoQnV0dG9uU3RhdGVzKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU3luYyByZXF1aXJlcyBiZWluZyBvbiBhbiBOSEkgdGFiIHNvIGNvb2tpZXMvc2Vzc2lvbiBhcmUgdXNhYmxlIGZyb21cbiAgLy8gdGhlIFNXLiBGbGFnIHZpYSBkYXRhc2V0IHNvIF9yZWZyZXNoQnV0dG9uU3RhdGVzIGNhbiBjb21iaW5lIHRoaXNcbiAgLy8gd2l0aCB0aGUgbW9kZSArIGNvbm4gc3RhdGUuIFdoZW4gb2ZmLU5ISSwgYWxzbyBzdXJmYWNlIHRoZVxuICAvLyBcIlx1RDgzRFx1REQxNyBcdTk1OEJcdTU1NUZcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTc2N0JcdTUxNjVcIiBiYW5uZXIgc28gdXNlcnMgZG9uJ3Qgd29uZGVyIHdoZXJlIHRvIGdvLlxuICBjb25zdCBvbk5oaSA9IGlzTmhpVGFiKHRhYi51cmwpO1xuICBpZiAob25OaGkpIGRlbGV0ZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaTtcbiAgZWxzZSBlbHMuc3luY0FwaUJ0bi5kYXRhc2V0Lm9mZk5oaSA9IFwiMVwiO1xuICBpZiAoZWxzLm9wZW5OaGlTZWN0aW9uKSBlbHMub3Blbk5oaVNlY3Rpb24uaGlkZGVuID0gb25OaGk7XG5cbiAgLy8gV2hlbiBvbiB0aGUgTkhJIHRhYiwgYXNrIGJhY2tncm91bmQgdG8gdmVyaWZ5IHRoZXJlJ3MgYW4gYWN0aXZlXG4gIC8vIHNlc3Npb24uIFRoZSBTVyBwcm9iZXMgSUhLRTM0MTAgd2l0aCBzZXNzaW9uU3RvcmFnZS50b2tlbiBcdTIwMTQgY2hlYXBcbiAgLy8gYW5kIG9ubHkgc3VjY2VlZHMgd2hlbiB0aGUgdXNlciBoYXMgbG9nZ2VkIGluLiBBbnl0aGluZyBidXQgYHRydWVgXG4gIC8vIChmYWxzZSwgbnVsbCwgb3Igbm8gcmVzcG9uc2UpIG1ha2VzIHVzIGFzc3VtZSBcIm5vdCBsb2dnZWQgaW5cIiBzb1xuICAvLyB0aGUgdXNlciBzZWVzIHRoZSBhY3Rpb25hYmxlIGJhbm5lciBpbnN0ZWFkIG9mIG1hc2hpbmcgdGhlIENUQVxuICAvLyBpbnRvIGEgZGVsYXllZCBcIlx1RDgzRFx1REQxMiBcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcIiBzdGF0dXMuXG4gIGlmIChvbk5oaSAmJiB0YWIuaWQpIHtcbiAgICBjaHJvbWUucnVudGltZVxuICAgICAgLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJjaGVja05oaUxvZ2luXCIsIHRhYklkOiB0YWIuaWQgfSlcbiAgICAgIC50aGVuKChyZXNwKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvZ2dlZEluID0gcmVzcD8ubG9nZ2VkSW4gPT09IHRydWU7XG4gICAgICAgIGlmIChsb2dnZWRJbikgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgICAgIGVsc2UgZWxzLnN5bmNBcGlCdG4uZGF0YXNldC5uaGlMb2dnZWRJbiA9IFwibm9cIjtcbiAgICAgICAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbikge1xuICAgICAgICAgIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSBsb2dnZWRJbjtcbiAgICAgICAgfVxuICAgICAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgICAvLyBMb2dpbiBwcm9iZSBjb21wbGV0aW5nIHBvc2l0aXZlbHkgaXMgdGhlIHN0ZXAtMSBpbnRlbnRpb25hbFxuICAgICAgICAvLyBjb21wbGV0aW9uIGV2ZW50IFx1MjAxNCBhZHZhbmNlIHRoZSB3aXphcmQgb25jZSBpZiB0aGUgdXNlciBpc1xuICAgICAgICAvLyBjdXJyZW50bHkgbG9va2luZyBhdCBzdGVwIDEuXG4gICAgICAgIGlmIChsb2dnZWRJbiAmJiBfd2l6YXJkSW5pdGlhbGl6ZWQpIF9tYXliZUF1dG9BZHZhbmNlKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgLy8gSWYgdGhlIHByb2JlIGZhaWxzIChTVyB1bnJlYWNoYWJsZSwgZXRjKSwgZG9uJ3QgcHVuaXNoIHRoZVxuICAgICAgICAvLyB1c2VyIFx1MjAxNCBsZWF2ZSB0aGUgQ1RBIGVuYWJsZWQgYW5kIGxldCB0aGUgc3luYydzIG93biBzZXNzaW9uXG4gICAgICAgIC8vIGNoZWNrIHN1cmZhY2UgYSByZWFsIGVycm9yIGlmIG5lZWRlZC5cbiAgICAgICAgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgICAgIGlmIChlbHMubmhpTmVlZHNMb2dpblNlY3Rpb24pIGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbi5oaWRkZW4gPSB0cnVlO1xuICAgICAgICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuICAgICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGVscy5zeW5jQXBpQnRuLmRhdGFzZXQubmhpTG9nZ2VkSW47XG4gICAgaWYgKGVscy5uaGlOZWVkc0xvZ2luU2VjdGlvbikgZWxzLm5oaU5lZWRzTG9naW5TZWN0aW9uLmhpZGRlbiA9IHRydWU7XG4gIH1cblxuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xuXG4gIC8vIFN0YXJ0IHRoZSB3aXphcmQgQUZURVIgYWxsIGluaXRpYWwgc3RhdGUgaXMgbG9hZGVkIFx1MjAxNCB0aGlzIHBpY2tzXG4gIC8vIHRoZSBjb3JyZWN0IHN0YXJ0aW5nIHN0ZXAgKGUuZy4gcmV0dXJuaW5nIHVzZXIgd2l0aCB2YWxpZCBzZXNzaW9uXG4gIC8vIGxhbmRzIG9uIHN0ZXAgMyBkaXJlY3RseSkuXG4gIF9pbml0V2l6YXJkKCk7XG5cbiAgLy8gUmUtYXR0YWNoIHRvIGFueSBzeW5jIHRoYXQncyBjdXJyZW50bHkgcnVubmluZyBpbiB0aGUgc2VydmljZSB3b3JrZXIuXG4gIC8vIFRoaXMgaXMgd2hhdCBsZXRzIHRoZSB1c2VyIGNsb3NlICsgcmVvcGVuIHRoZSBwb3B1cCBtaWQtc3luYy5cbiAgYXdhaXQgcmVmcmVzaFN5bmNTdGF0dXNGcm9tQmFja2dyb3VuZCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZWZyZXNoU3luY1N0YXR1c0Zyb21CYWNrZ3JvdW5kKCkge1xuICBjb25zdCBzdGF0dXMgPSBhd2FpdCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwiZ2V0U3luY1N0YXR1c1wiIH0pLmNhdGNoKCgpID0+IG51bGwpO1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBhcHBseVN5bmNTdGF0dXMoc3RhdHVzKTtcbn1cblxuLy8gTGF0ZXN0IHN0YXR1cyBzbmFwc2hvdCBcdTIwMTQga2VlcGluZyBpdCBsZXRzIHRoZSBsaXZlLWVsYXBzZWQgdGlja2VyXG4vLyByZXBhaW50IHRoZSBzYW1lIHByb2dyZXNzIHRleHQgd2l0aCBhbiB1cGRhdGVkIGBbTnNdYCBwcmVmaXggZXZlcnlcbi8vIHNlY29uZCB3aXRob3V0IHNwYW1taW5nIGNocm9tZS5zdG9yYWdlIGZyb20gdGhlIHNlcnZpY2Ugd29ya2VyLlxubGV0IF9sYXRlc3RTdGF0dXMgPSBudWxsO1xubGV0IF9lbGFwc2VkVGlja2VySWQgPSBudWxsO1xuXG5mdW5jdGlvbiBfZm10RWxhcHNlZChtcykge1xuICBpZiAobXMgPCA2MF8wMDApIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gMTAwMCl9c2A7XG4gIHJldHVybiBgJHtNYXRoLmZsb29yKG1zIC8gNjBfMDAwKX1tJHtNYXRoLnJvdW5kKChtcyAlIDYwXzAwMCkgLyAxMDAwKX1zYDtcbn1cblxuZnVuY3Rpb24gX3JlbmRlclN0YXR1cygpIHtcbiAgY29uc3Qgc3RhdHVzID0gX2xhdGVzdFN0YXR1cztcbiAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgbGV0IHRleHQgPSBzdGF0dXMucHJvZ3Jlc3MgfHwgXCIoc3luYyBcdTkwMzJcdTg4NENcdTRFMkQpXCI7XG4gIGlmIChzdGF0dXMucnVubmluZyAmJiBzdGF0dXMuc3RhcnRlZCkge1xuICAgIGNvbnN0IGVsYXBzZWQgPSBEYXRlLm5vdygpIC0gc3RhdHVzLnN0YXJ0ZWQ7XG4gICAgdGV4dCA9IGBcdTIzRjEgJHtfZm10RWxhcHNlZChlbGFwc2VkKX0gXHUwMEI3ICR7dGV4dH1gO1xuICB9XG4gIGNvbnN0IGtpbmQgPSBzdGF0dXMucnVubmluZyA/IFwiaW5mb1wiIDogKHN0YXR1cy5waGFzZSA9PT0gXCJlcnJvclwiID8gXCJlcnJvclwiIDogXCJzdWNjZXNzXCIpO1xuICBjb25zdCBicmVha2Rvd24gPSBzdGF0dXMucnVubmluZyA/IG51bGwgOiBzdGF0dXMuYnJlYWtkb3duO1xuICBzZXRTdGF0dXModGV4dCwga2luZCwgYnJlYWtkb3duKTtcbn1cblxuZnVuY3Rpb24gYXBwbHlTeW5jU3RhdHVzKHN0YXR1cykge1xuICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICBfbGF0ZXN0U3RhdHVzID0gc3RhdHVzO1xuICBfcmVuZGVyU3RhdHVzKCk7XG4gIC8vIFN0YXR1cyBiYW5uZXIgbGl2ZXMgaW5zaWRlIHN0ZXAgMyBcdTIwMTQgZm9yY2UtanVtcCB0aGVyZSBzbyBpdCdzXG4gIC8vIGFjdHVhbGx5IHZpc2libGUuIFJ1bm5pbmcgc3luYyBPUiBhIGZyZXNoIGNvbXBsZXRpb24gYm90aCB3YXJyYW50XG4gIC8vIGJlaW5nIG9uIHRoZSByZXN1bHQgc3RlcC5cbiAgaWYgKF93aXphcmRJbml0aWFsaXplZCAmJiBfYWN0aXZlU3RlcCAhPT0gMykge1xuICAgIF9zZXRBY3RpdmVTdGVwKDMsIHsgc2lsZW50OiB0cnVlIH0pO1xuICB9XG4gIGlmIChzdGF0dXMucnVubmluZykge1xuICAgIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSBmYWxzZTtcbiAgICBpZiAoIV9lbGFwc2VkVGlja2VySWQpIHtcbiAgICAgIF9lbGFwc2VkVGlja2VySWQgPSBzZXRJbnRlcnZhbChfcmVuZGVyU3RhdHVzLCAxMDAwKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZWxzLnN0b3BCdG4uaGlkZGVuID0gdHJ1ZTtcbiAgICBpZiAoX2VsYXBzZWRUaWNrZXJJZCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChfZWxhcHNlZFRpY2tlcklkKTtcbiAgICAgIF9lbGFwc2VkVGlja2VySWQgPSBudWxsO1xuICAgIH1cbiAgICAvLyBSZS1kZXJpdmUgc3luYyBidXR0b24gZW5hYmxlZCBzdGF0ZSBmcm9tIG1vZGUvY29ubi9OSEktdGFiIGluc3RlYWRcbiAgICAvLyBvZiB1bmNvbmRpdGlvbmFsbHkgZW5hYmxpbmcgXHUyMDE0IGtlZXBzIHRoZSBidXR0b24gZGlzYWJsZWQgd2hlbiB3ZVxuICAgIC8vIGtub3cgd2Ugc2hvdWxkbid0IHN5bmMgKGUuZy4gYmFja2VuZCBkb3duLCBvZmYtTkhJIHRhYikuXG4gICAgX3JlZnJlc2hCdXR0b25TdGF0ZXMoKTtcbiAgICAvLyBTeW5jIGp1c3QgZmluaXNoZWQgXHUyMDE0IGJvdGggc2lkZXMgbWF5IGhhdmUgY2hhbmdlZCAoYmFja2VuZCBnb3RcbiAgICAvLyBuZXcgcmVzb3VyY2VzIGluIGJhY2tlbmQgbW9kZSwgbG9jYWwgYnVuZGxlIHdhcyBzdGFzaGVkIGluIGVpdGhlclxuICAgIC8vIG1vZGUpLiBSZWZyZXNoIGRhdGEtc3RhdGUgY2FyZCBzbyB0aGUgdXNlciBzZWVzIHVwLXRvLWRhdGUgY291bnRzLlxuICAgIF9yZWZyZXNoTG9jYWxCdW5kbGVTdGF0ZSgpO1xuICAgIGlmIChjdXJyZW50TW9kZSgpID09PSBcImJhY2tlbmRcIiAmJiBfY29ublN0YXRlID09PSBcIm9rXCIpIGNoZWNrQmFja2VuZFBhdGllbnQoKTtcbiAgfVxufVxuXG4vLyBTdG9wIHRoZSBpbi1wcm9ncmVzcyBzeW5jLiBUd28tcHJvbmdlZCBzbyBpdCB3b3JrcyBldmVuIHdoZW4gdGhlXG4vLyBzZXJ2aWNlIHdvcmtlciBoYXMgZGllZDogKDEpIHRlbGwgdGhlIFNXIHRvIHNldCBpdHMgY2FuY2VsIGZsYWcsXG4vLyAoMikgd3JpdGUgc3RvcmFnZSBkaXJlY3RseSB0byBydW5uaW5nOmZhbHNlIHNvIHRoZSBwb3B1cCBVSSB1bmZyZWV6ZXNcbi8vIGltbWVkaWF0ZWx5IGV2ZW4gaWYgdGhlIFNXIG1lc3NhZ2UgY2FuJ3QgYmUgZGVsaXZlcmVkLlxuYXN5bmMgZnVuY3Rpb24gc3RvcFN5bmMoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgc3luY1N0YXR1czoge1xuICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1MDVDXHU2QjYyXHU0RTJEXHVGRjBDXHU2QjYzXHU1NzI4XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5XHUyMDI2XCIsXG4gICAgICBwaGFzZTogXCJjYW5jZWxsZWRcIixcbiAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0pO1xuICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1MDVDXHU2QjYyXHU0RTJEXHVGRjBDXHU2QjYzXHU1NzI4XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5XHUyMDI2XCIsIFwiaW5mb1wiKTtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcInN0b3BTeW5jXCIgfSkuY2F0Y2goKCkgPT4ge30pO1xuICBlbHMuc3RvcEJ0bi5oaWRkZW4gPSB0cnVlO1xuICBfcmVmcmVzaEJ1dHRvblN0YXRlcygpO1xufVxuXG4vLyBMaXZlIHByb2dyZXNzIHVwZGF0ZXMgXHUyMDE0IGxpc3RlbiBvbiBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQgc28gd2UgZ2V0XG4vLyBldmVyeSB1cGRhdGUgdGhlIFNXIHdyaXRlcywgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoZSBTVydzIGJyb2FkY2FzdFxuLy8gc2VuZE1lc3NhZ2UgcmVhY2hlZCB1cy5cbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgYXJlYSkgPT4ge1xuICBpZiAoYXJlYSA9PT0gXCJsb2NhbFwiICYmIGNoYW5nZXMuc3luY1N0YXR1cykge1xuICAgIGFwcGx5U3luY1N0YXR1cyhjaGFuZ2VzLnN5bmNTdGF0dXMubmV3VmFsdWUpO1xuICB9XG59KTtcblxuLy8gKExlZ2FjeSBpbi1tZW1vcnkgYnJvYWRjYXN0IHN0aWxsIGxpc3RlbmVkIHRvIGFzIGEgYmFja3VwLilcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnKSA9PiB7XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3luY1Byb2dyZXNzXCIpIHtcbiAgICBhcHBseVN5bmNTdGF0dXMobXNnLnN0YXR1cyk7XG4gIH1cbn0pO1xuXG4vLyBQcmUtZmxpZ2h0IGRldGVjdGlvbiBmb3IgTkhJIGxvZ2luIHN0YXRlLiBUd28gc2lnbmFscyAoZWl0aGVyIHRyaWdnZXJzKTpcbi8vICAxLiBVUkwgaXMgaW4gTkhJIGF1dGggbmFtZXNwYWNlIChJSEtFMzA5OVN4eCkgXHUyMDE0IGxvZ2luIC8gSUMgY2FyZCBwYWdlc1xuLy8gIDIuIFBhZ2UgY29udGFpbnMgYSBwYXNzd29yZCBpbnB1dCBvciBrbm93biBsb2dnZWQtb3V0IHBocmFzZXNcbmFzeW5jIGZ1bmN0aW9uIGlzT25OaGlMb2dpblBhZ2UodGFiSWQsIHVybCkge1xuICBpZiAodXJsPy5wYXRobmFtZSAmJiAvSUhLRTMwOTkvLnRlc3QodXJsLnBhdGhuYW1lKSkgcmV0dXJuIHRydWU7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdJykpIHJldHVybiB0cnVlO1xuICAgICAgICBjb25zdCB0ZXh0ID0gKGRvY3VtZW50LmJvZHk/LmlubmVyVGV4dCB8fCBcIlwiKS50cmltKCk7XG4gICAgICAgIGNvbnN0IHBocmFzZXMgPSBbXG4gICAgICAgICAgXCJcdThBQ0JcdTRGN0ZcdTc1MjhcdTUwNjVcdTRGRERcdTUzNjFcIiwgXCJcdThBQ0JcdTYzRDJcdTUxNjVcdTUwNjVcdTRGRERcdTUzNjFcIiwgXCJcdThBQ0JcdTYzRDJcdTUxNjVcdTYwQThcdTc2ODRcdTUwNjVcdTRGRERcdTUzNjFcIixcbiAgICAgICAgICBcIlx1NzY3Qlx1NTE2NVx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QVwiLCBcIlx1NzY3Qlx1NTE2NVx1NTkzMVx1NjU1N1wiLCBcIlx1OEFDQlx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVwiLFxuICAgICAgICAgIFwiU2Vzc2lvbiBcdTVERjJcdTkwM0VcdTY2NDJcIiwgXCJzZXNzaW9uIFx1NURGMlx1OTAzRVx1NjY0MlwiLCBcIlx1NURGMlx1OTAzRVx1NjY0MlwiLFxuICAgICAgICAgIFwiXHU4QUNCXHU0RUU1XHU1MDY1XHU0RkREXHU1MzYxXHU3NjdCXHU1MTY1XCIsXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBwaHJhc2VzLnNvbWUoKHApID0+IHRleHQuaW5jbHVkZXMocCkpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBcdTI2QTEgTkhJIEFQSS1kaXJlY3Qgc3luYyBcdTIwMTQgcHJpbWFyeSBwYXRoLiBIaXRzIE5ISSdzIHVuZGVybHlpbmcgSlNPTlxuLy8gZW5kcG9pbnRzIGluIHBhcmFsbGVsIGFuZCBwb3N0cyBhZGFwdGVkIGl0ZW1zIHRvIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkLlxuLy8gUmVxdWlyZXMgcGF0aWVudF9vdmVycmlkZSB0byBiZSBmaWxsZWQuXG4vLyBDb252ZXJ0IGEgYmFja2VuZCBVUkwgXHUyMTkyIHRoZSBvcmlnaW4tcGF0dGVybiBDaHJvbWUgd2FudHMgZm9yIHBlcm1pc3Npb25cbi8vIHJlcXVlc3RzLiBcImh0dHA6Ly8xOTIuMTY4LjEuNTo4MDEwXCIgXHUyMTkyIFwiaHR0cDovLzE5Mi4xNjguMS41OjgwMTAvKlwiLlxuLy8gUmV0dXJucyBudWxsIHdoZW4gdGhlIFVSTCBpc24ndCBwYXJzZWFibGUgc28gdGhlIGNhbGxlciBjYW4gc2hvcnQtY2lyY3VpdC5cbmZ1bmN0aW9uIF9vcmlnaW5QYXR0ZXJuRm9yKHVybCkge1xuICB0cnkge1xuICAgIGNvbnN0IHUgPSBuZXcgVVJMKHVybCk7XG4gICAgcmV0dXJuIGAke3UucHJvdG9jb2x9Ly8ke3UuaG9zdH0vKmA7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8vIEJhY2tlbmQtbW9kZSBwcmUtZmxpZ2h0OiBlbnN1cmUgdGhlIGV4dGVuc2lvbiBoYXMgaG9zdCBwZXJtaXNzaW9uIGZvclxuLy8gdGhlIHVzZXItY29uZmlndXJlZCBiYWNrZW5kIFVSTC4gTG9jYWxob3N0IC8gMTI3LjAuMC4xIGFyZSBjb3ZlcmVkIGJ5XG4vLyB0aGUgZGVmYXVsdCBtYW5pZmVzdCBob3N0X3Blcm1pc3Npb25zOyByZW1vdGUgLyBMQU4gLyBwcm9kdWN0aW9uIFVSTHNcbi8vIG5lZWQgYSBvbmUtdGltZSB1c2VyIGdyYW50LiBNdXN0IHJ1biBmcm9tIGEgdXNlciBnZXN0dXJlIChidXR0b24gY2xpY2spLlxuYXN5bmMgZnVuY3Rpb24gZW5zdXJlQmFja2VuZFBlcm1pc3Npb24oYmFja2VuZFVybCkge1xuICBjb25zdCBwYXR0ZXJuID0gX29yaWdpblBhdHRlcm5Gb3IoYmFja2VuZFVybCk7XG4gIGlmICghcGF0dGVybikgcmV0dXJuIHsgb2s6IGZhbHNlLCByZWFzb246IGBCYWNrZW5kIFVSTCBcdTcxMjFcdTZDRDVcdTg5RTNcdTY3OTA6ICR7YmFja2VuZFVybH1gIH07XG4gIGNvbnN0IGFscmVhZHkgPSBhd2FpdCBjaHJvbWUucGVybWlzc2lvbnMuY29udGFpbnMoeyBvcmlnaW5zOiBbcGF0dGVybl0gfSk7XG4gIGlmIChhbHJlYWR5KSByZXR1cm4geyBvazogdHJ1ZSB9O1xuICBsZXQgZ3JhbnRlZDtcbiAgdHJ5IHtcbiAgICBncmFudGVkID0gYXdhaXQgY2hyb21lLnBlcm1pc3Npb25zLnJlcXVlc3QoeyBvcmlnaW5zOiBbcGF0dGVybl0gfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIHJlYXNvbjogYFx1NkIwQVx1OTY1MFx1OEFDQlx1NkM0Mlx1NTkzMVx1NjU1NzogJHtlLm1lc3NhZ2V9YCB9O1xuICB9XG4gIHJldHVybiBncmFudGVkXG4gICAgPyB7IG9rOiB0cnVlIH1cbiAgICA6IHsgb2s6IGZhbHNlLCByZWFzb246IGBcdTY3MkFcdTYzODhcdTZCMEFcdTkwMjNcdTdEREFcdTUyMzAgJHtwYXR0ZXJufSBcdTIwMTQgXHU1M0Q2XHU2RDg4YCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBhcGlTeW5jTmhpKCkge1xuICBjb25zdCBvdiA9IGdldFBhdGllbnRPdmVycmlkZSgpO1xuICBpZiAoIW92KSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1NTZERSBcdTI0NjEgXHU2MEE4XHU3Njg0XHU4Q0M3XHU2NTk5XHVGRjFBXHU4QUNCXHU5MDc4XHU2NEM3XHU2MDI3XHU1MjI1XHUzMDAxXHU1ODZCXHU3NTFGXHU2NUU1XHU1RjhDXHU2MzA5XHU3OEJBXHU1QjlBXCIsIFwiZXJyb3JcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUHJlLWZsaWdodDogY2hlY2sgd2UncmUgb24gYW4gTkhJIHRhYiBzbyBjb29raWVzIGFyZSB1c2FibGUgZnJvbSBTVy5cbiAgY29uc3QgdGFiID0gYXdhaXQgZ2V0QWN0aXZlVGFiKCk7XG4gIGxldCB1cmw7XG4gIHRyeSB7IHVybCA9IG5ldyBVUkwodGFiLnVybCk7IH0gY2F0Y2ggeyBzZXRTdGF0dXMoXCJhY3RpdmUgdGFiIGhhcyBubyBVUkxcIiwgXCJlcnJvclwiKTsgcmV0dXJuOyB9XG4gIGNvbnN0IG9uTG9naW4gPSBhd2FpdCBpc09uTmhpTG9naW5QYWdlKHRhYi5pZCwgdXJsKTtcbiAgaWYgKG9uTG9naW4pIHtcbiAgICBzZXRTdGF0dXMoXCJcdUQ4M0RcdUREMTIgXHU1NkRFIFx1MjQ2MCBcdTc2N0JcdTUxNjVcdUZGMUFcdTVDMUFcdTY3MkFcdTc2N0JcdTUxNjVcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcIiwgXCJlcnJvclwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBCYWNrZW5kIG1vZGU6IHJlLXZlcmlmeSBjb25uZWN0aXZpdHkgcmlnaHQgaGVyZSBldmVuIGlmIHRoZSBiYW5uZXJcbiAgLy8gbGFzdCBzYWlkIG9rLiBCZXR3ZWVuIHRoZSBwcmV2aW91cyBjaGVjayBhbmQgdGhpcyBjbGljayB0aGUgdXNlclxuICAvLyBtYXkgaGF2ZSBzdG9wcGVkIGRvY2tlcjsgd2l0aG91dCBhIGZyZXNoIHByb2JlIHdlJ2Qgc3RhcnQgYW4gdXBsb2FkXG4gIC8vIHRoYXQgZmFpbHMgbWlkLWZsaWdodCBhZnRlciBwYXJ0aWFsIGRhdGEgaGFzIGhpdCAob3IgZmFpbGVkIHRvIGhpdClcbiAgLy8gdGhlIGJhY2tlbmQuIENoZWFwIChcdTIyNjQ1cykgYW5kIHNhdmVzIGEgbG90IG9mIGNvbmZ1c2lvbi5cbiAgaWYgKGN1cnJlbnRNb2RlKCkgPT09IFwiYmFja2VuZFwiKSB7XG4gICAgY29uc3Qgb2sgPSBhd2FpdCB0ZXN0QmFja2VuZENvbm5lY3Rpb24oKTtcbiAgICBpZiAoIW9rKSB7XG4gICAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1RjhDXHU3QUVGXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3IFx1MjAxNCBcdThBQ0JcdTc3MEJcdTk4MDJcdTkwRTggYmFubmVyIFx1NzY4NFx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGVscy5zeW5jQXBpQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgIHJ1bm5pbmc6IHRydWUsXG4gICAgICBwcm9ncmVzczogXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsXG4gICAgICBwaGFzZTogXCJzdGFydGluZ1wiLCBzdGFydGVkOiBEYXRlLm5vdygpLCB0czogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9KTtcbiAgc2V0U3RhdHVzKFwiXHVEODNEXHVERTgwIFx1OTU4Qlx1NTlDQlx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MjAyNlwiLCBcImluZm9cIik7XG5cbiAgLy8gQ29tcHV0ZSBkYXRlIHJhbmdlIGZyb20gdGhlIGRyb3Bkb3duLiBcIjFcIiA9IE5ISSdzIGRlZmF1bHQgd2luZG93O1xuICAvLyBhbnl0aGluZyBlbHNlIGlzIFwidG9kYXkgYmFjayBOIHllYXJzXCIuIEhlbHBlciBpbnNpZGUgYmFja2dyb3VuZC5qc1xuICAvLyBjb252ZXJ0cyB0byBcdTZDMTFcdTU3MEIgZm9yIE5ISSdzIEFQSS5cbiAgY29uc3QgcmFuZ2VTZWwgPSBlbHMuYXBpU3luY1JhbmdlPy52YWx1ZSB8fCBcIjNcIjtcbiAgbGV0IGRhdGVSYW5nZSA9IG51bGw7XG4gIGNvbnN0IFJBTkdFX0xBQkVMUyA9IHtcbiAgICBcIjFcIjogICBcIlx1NjcwMFx1OEZEMSAxIFx1NUU3NFwiLFxuICAgIFwiM1wiOiAgIFwiXHU2NzAwXHU4RkQxIDMgXHU1RTc0XCIsXG4gICAgXCI1XCI6ICAgXCJcdTY3MDBcdThGRDEgNSBcdTVFNzRcIixcbiAgICBcIjEwXCI6ICBcIlx1NjcwMFx1OEZEMSAxMCBcdTVFNzRcIixcbiAgICBcImFsbFwiOiBcIlx1NTE2OFx1OTBFOFx1NkI3N1x1NTNGMlx1N0QwMFx1OTMwNFwiLFxuICB9O1xuICBjb25zdCBkYXRlUmFuZ2VMYWJlbCA9IFJBTkdFX0xBQkVMU1tyYW5nZVNlbF0gfHwgYFx1NjcwMFx1OEZEMSAke3JhbmdlU2VsfSBcdTVFNzRgO1xuICBpZiAocmFuZ2VTZWwgIT09IFwiMVwiKSB7XG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGVuZCA9IHRvZGF5LnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgIGxldCBzdGFydDtcbiAgICBpZiAocmFuZ2VTZWwgPT09IFwiYWxsXCIpIHtcbiAgICAgIHN0YXJ0ID0gXCIyMDAxLTAxLTAxXCI7ICAvLyBcdTZDMTFcdTU3MEIgOTAgXHUyMDE0IGZhciBlbm91Z2ggYmFjayBmb3IgYW55IGNsaW5pY2FsIGNhc2VcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeWVhcnMgPSBwYXJzZUludChyYW5nZVNlbCwgMTApO1xuICAgICAgY29uc3QgcyA9IG5ldyBEYXRlKHRvZGF5KTtcbiAgICAgIHMuc2V0RnVsbFllYXIocy5nZXRGdWxsWWVhcigpIC0geWVhcnMpO1xuICAgICAgc3RhcnQgPSBzLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgIH1cbiAgICBkYXRlUmFuZ2UgPSB7IHN0YXJ0LCBlbmQgfTtcbiAgfVxuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcInN0YXJ0TmhpQXBpU3luY1wiLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIHRhYklkOiB0YWIuaWQsXG4gICAgICBtb2RlOiBjdXJyZW50TW9kZSgpLFxuICAgICAgYmFja2VuZDogZWxzLmJhY2tlbmRVcmwudmFsdWUudHJpbSgpLFxuICAgICAgc3luY0FwaUtleTogZWxzLnN5bmNBcGlLZXkudmFsdWUudHJpbSgpLFxuICAgICAgbmhpQmFzZTogXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3XCIsXG4gICAgICBwYXRpZW50T3ZlcnJpZGU6IG92LFxuICAgICAgZGF0ZVJhbmdlLFxuICAgICAgZGF0ZVJhbmdlTGFiZWwsXG4gICAgfSxcbiAgfSkuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsYXVuY2goKSB7XG4gIGNvbnN0IGJhY2tlbmQgPSBlbHMuYmFja2VuZFVybC52YWx1ZS50cmltKCk7XG4gIGNvbnN0IG92ID0gZ2V0UGF0aWVudE92ZXJyaWRlKCk7XG4gIGNvbnN0IHJhd0lkID0gb3Y/LmlkX25vO1xuICBjb25zdCBzbWFydEFwcExhdW5jaCA9IGVscy5zbWFydEFwcFVybC52YWx1ZS50cmltKCkgfHwgREVGQVVMVF9TTUFSVF9BUFBfTEFVTkNIO1xuICBpZiAoIXJhd0lkKSB7XG4gICAgc2V0U3RhdHVzKFwiXHUyNkQ0IFx1OTA4NFx1NkM5Mlx1NjcwOVx1NzVDNVx1NEVCQVx1OEVBQlx1NTIwNlx1OEI0OSBcdTIwMTQgXHU4QUNCXHU1MTQ4XHU2MzA5XHUzMDBDXHVEODNEXHVERDA0IFx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MzAwRFx1NjI5M1x1NEUwMFx1NkIyMVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBCYWNrZW5kIHRyYWNrcyBQYXRpZW50IHVuZGVyIGl0cyBoYXNoZWQgRkhJUiBpZCwgbm90IHRoZSByYXcgbmF0aW9uYWwgSUQuXG4gIGNvbnN0IHBhdGllbnRJZCA9IGRlcml2ZVBhdGllbnRJZChyYXdJZCk7XG4gIC8vIFJlLXRlc3QgY29ubmVjdGlvbiBldmVuIGlmIGJhbm5lciBzaG93cyBvayBcdTIwMTQgYmFja2VuZCBtYXkgaGF2ZSBnb25lXG4gIC8vIGRvd24gc2luY2UgdGhlIGxhc3QgcHJvYmUuXG4gIGNvbnN0IG9rID0gYXdhaXQgdGVzdEJhY2tlbmRDb25uZWN0aW9uKCk7XG4gIGlmICghb2spIHtcbiAgICBzZXRTdGF0dXMoXCJcdTI2RDQgXHU1RjhDXHU3QUVGXHU5MDIzXHU3RERBXHU1OTMxXHU2NTU3IFx1MjAxNCBcdThBQ0JcdTc3MEJcdTk4MDJcdTkwRTggYmFubmVyIFx1NzY4NFx1OEFBQVx1NjYwRVwiLCBcImVycm9yXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZXRTdGF0dXMoXCJcdTVFRkFcdTdBQ0IgbGF1bmNoIGNvbnRleHRcdTIwMjZcIiwgXCJpbmZvXCIpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3NtYXJ0L2xhdW5jaC1jb250ZXh0YCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcGF0aWVudF9pZDogcGF0aWVudElkIH0pLFxuICAgIH0pO1xuICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoYCR7cmVzLnN0YXR1c306ICR7YXdhaXQgcmVzLnRleHQoKX1gKTtcbiAgICBjb25zdCB7IGxhdW5jaCB9ID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHsgaXNzOiBgJHtiYWNrZW5kfS9maGlyYCwgbGF1bmNoIH0pO1xuICAgIC8vIEFwcGVuZCBpc3MgKyBsYXVuY2ggcGFyYW1zLCByZXNwZWN0aW5nIGFueSBleGlzdGluZyBxdWVyeSBzdHJpbmcuXG4gICAgY29uc3Qgc2VwID0gc21hcnRBcHBMYXVuY2guaW5jbHVkZXMoXCI/XCIpID8gXCImXCIgOiBcIj9cIjtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGAke3NtYXJ0QXBwTGF1bmNofSR7c2VwfSR7cGFyYW1zfWAgfSk7XG4gICAgd2luZG93LmNsb3NlKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZXRTdGF0dXMoYFx1Mjc0QyBMYXVuY2ggXHU1OTMxXHU2NTU3XHVGRjFBJHtlLm1lc3NhZ2V9YCwgXCJlcnJvclwiKTtcbiAgfVxufVxuXG5lbHMuc3luY0FwaUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXBpU3luY05oaSk7XG5lbHMuc3RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RvcFN5bmMpO1xuZWxzLm92U2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2F2ZVBhdGllbnRPdmVycmlkZSk7XG5lbHMub3ZDbGVhckJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJQYXRpZW50T3ZlcnJpZGUpO1xuW2Vscy5vdklkTm8sIGVscy5vdk5hbWUsIGVscy5vdkJpcnRoRGF0ZSwgZWxzLm92R2VuZGVyXS5mb3JFYWNoKChlbCkgPT5cbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHJlZnJlc2hPdmVycmlkZVN1bW1hcnkpXG4pO1xuZWxzLmxhdW5jaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGF1bmNoKTtcblxuLy8gXCJcdTUzRDZcdTVGOTdcdTVDMERcdThDNjFcIiBiYW5uZXI6IGNsaWNrIC8gRW50ZXIgLyBTcGFjZSBqdW1wcyBiYWNrIHRvIHN0ZXAgMiBhbmRcbi8vIGV4cGFuZHMgdGhlIHBhdGllbnQgY2FyZCBzbyB0aGUgdXNlciBjYW4gYWRqdXN0IHRoZSBpZGVudGl0eS5cbmZ1bmN0aW9uIF9nb3RvU3RlcDJFZGl0KCkge1xuICBfc2V0QWN0aXZlU3RlcCgyKTtcbiAgaWYgKGVscy5wYXRpZW50T3ZlcnJpZGVEZXRhaWxzKSBlbHMucGF0aWVudE92ZXJyaWRlRGV0YWlscy5vcGVuID0gdHJ1ZTtcbn1cbmVscy5hY3RpdmVQYXRpZW50Py5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2dvdG9TdGVwMkVkaXQpO1xuZWxzLmFjdGl2ZVBhdGllbnQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gIGlmIChlLmtleSA9PT0gXCJFbnRlclwiIHx8IGUua2V5ID09PSBcIiBcIikge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBfZ290b1N0ZXAyRWRpdCgpO1xuICB9XG59KTtcblxuaW5pdCgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFTQSxPQUFDLFdBQVc7QUFDVjtBQUVBLFlBQUksY0FBYztBQUNsQixZQUFJLGlCQUFpQjtBQUNyQixZQUFJLFNBQVMsT0FBTyxXQUFXO0FBQy9CLFlBQUksT0FBTyxTQUFTLFNBQVMsQ0FBQztBQUM5QixZQUFJLEtBQUssbUJBQW1CO0FBQzFCLG1CQUFTO0FBQUEsUUFDWDtBQUNBLFlBQUksYUFBYSxDQUFDLFVBQVUsT0FBTyxTQUFTO0FBQzVDLFlBQUksVUFBVSxDQUFDLEtBQUssc0JBQXNCLE9BQU8sWUFBWSxZQUFZLFFBQVEsWUFBWSxRQUFRLFNBQVM7QUFDOUcsWUFBSSxTQUFTO0FBQ1gsaUJBQU87QUFBQSxRQUNULFdBQVcsWUFBWTtBQUNyQixpQkFBTztBQUFBLFFBQ1Q7QUFDQSxZQUFJLFlBQVksQ0FBQyxLQUFLLHdCQUF3QixPQUFPLFdBQVcsWUFBWSxPQUFPO0FBQ25GLFlBQUksTUFBTSxPQUFPLFdBQVcsY0FBYyxPQUFPO0FBQ2pELFlBQUksZUFBZSxDQUFDLEtBQUssMkJBQTJCLE9BQU8sZ0JBQWdCO0FBQzNFLFlBQUksWUFBWSxtQkFBbUIsTUFBTSxFQUFFO0FBQzNDLFlBQUks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
