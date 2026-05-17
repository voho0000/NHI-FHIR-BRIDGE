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
          var crypto = require_crypto();
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
              return crypto.createHash("sha1").update(message, "utf8").digest("hex");
            } else {
              if (message === null || message === void 0) {
                throw new Error(INPUT_ERROR);
              } else if (message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
              }
            }
            if (isArray(message) || isView(message) || message.constructor === Buffer2) {
              return crypto.createHash("sha1").update(bufferFrom(message)).digest("hex");
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

  // ../packages/mapper/src/systems.ts
  var NHI_MEDICAL_ORDER_CODE = "https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code";
  var NHI_DRUG_CODE = "https://twcore.mohw.gov.tw/CodeSystem/nhi-drug-code";
  var TW_NATIONAL_ID = "https://twcore.mohw.gov.tw/IdentifierSystem/national-id";
  var HIS_LOCAL_LAB_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-lab";
  var HIS_LOCAL_MEDICATION_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-medication";
  var HIS_LOCAL_REPORT_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-report";
  var HIS_LOCAL_CONDITION_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-condition";
  var HIS_LOCAL_PROCEDURE_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-procedure";
  var HIS_LOCAL_ALLERGEN_CODE = "https://nhi-fhir-bridge.local/CodeSystem/his-local-allergen";
  var HIS_LOCAL_PATIENT_MRN = "https://nhi-fhir-bridge.local/IdentifierSystem/his-mrn";
  var LOINC = "http://loinc.org";
  var SNOMED_CT = "http://snomed.info/sct";
  var ICD_10_CM = "http://hl7.org/fhir/sid/icd-10-cm";
  var ICD_10_PCS = "http://hl7.org/fhir/sid/icd-10-pcs";

  // ../packages/mapper/src/helpers.ts
  var import_js_sha1 = __toESM(require_sha1(), 1);
  function stableId(patientId, ...parts) {
    const key = [patientId, ...parts].join("|");
    return (0, import_js_sha1.sha1)(key).slice(0, 32);
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

  // ../packages/mapper/src/allergy.ts
  var ALLOWED_CATEGORIES = /* @__PURE__ */ new Set(["medication", "food", "environment", "biologic"]);
  var ALLOWED_CRITICALITY = /* @__PURE__ */ new Set(["high", "low", "unable-to-assess"]);
  function mapSystem(systemHint) {
    const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
    if (s.includes("snomed")) return SNOMED_CT;
    if (s.includes("rxnorm")) return "http://www.nlm.nih.gov/research/umls/rxnorm";
    return HIS_LOCAL_ALLERGEN_CODE;
  }
  function mapAllergyIntolerance(raw, patientId) {
    const display = raw.display ?? "Unknown Allergen";
    const code = raw.code;
    const system = mapSystem(raw.system ?? "");
    const resource = {
      resourceType: "AllergyIntolerance",
      id: stableId(patientId, code || display, raw.recorded_date ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      patient: { reference: `Patient/${patientId}` },
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
            code: "active"
          }
        ]
      },
      verificationStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
            code: "confirmed"
          }
        ]
      },
      code: {
        coding: [{ system, code: code || display, display }],
        text: display
      }
    };
    const category = raw.category ?? "";
    if (ALLOWED_CATEGORIES.has(category)) {
      resource.category = [category];
    }
    const criticality = raw.criticality ?? "";
    if (ALLOWED_CRITICALITY.has(criticality)) {
      resource.criticality = criticality;
    }
    if (raw.recorded_date) {
      resource.recordedDate = `${raw.recorded_date}T00:00:00+08:00`;
    }
    const reactionNote = raw.reaction ?? "";
    if (reactionNote) {
      resource.reaction = [{ description: reactionNote }];
    }
    return resource;
  }

  // ../packages/mapper/src/condition.ts
  var ICD10_CATEGORY_RE = /^[A-Z][0-9A-Z]{2}$/;
  function normalizeIcd10Cm(code) {
    if (!code || code.includes(".")) return code ?? "";
    const s = code.trim().toUpperCase();
    if (s.length <= 3) return s;
    const head = s.slice(0, 3);
    const tail = s.slice(3);
    if (ICD10_CATEGORY_RE.test(head)) {
      return `${head}.${tail}`;
    }
    return s;
  }
  function mapSystem2(systemHint) {
    const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
    if (s.includes("snomed")) return SNOMED_CT;
    if (s.includes("icd-10") || s.includes("icd10")) {
      return ICD_10_CM;
    }
    return HIS_LOCAL_CONDITION_CODE;
  }
  function mapCondition(raw, patientId) {
    const resource = {
      resourceType: "Condition",
      id: stableId(patientId, raw.code ?? "", raw.onset_date ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      subject: { reference: `Patient/${patientId}` },
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: raw.clinical_status ?? "active"
          }
        ]
      },
      verificationStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
            code: "confirmed"
          }
        ]
      }
    };
    const display = raw.display ?? "Unknown Condition";
    let code = raw.code;
    const system = mapSystem2(raw.system ?? "");
    if (system === ICD_10_CM && code) {
      code = normalizeIcd10Cm(code);
    }
    resource.code = {
      coding: [{ system, code: code || display, display }],
      text: display
    };
    const severity = raw.severity ?? "";
    if (severity) {
      resource.severity = { text: severity };
    }
    if (raw.onset_date) {
      resource.onsetDateTime = `${raw.onset_date}T00:00:00+08:00`;
    }
    return resource;
  }

  // ../packages/mapper/src/diagnostic-report.ts
  var V2_0074 = "http://terminology.hl7.org/CodeSystem/v2-0074";
  var CATEGORY_MAP = {
    LAB: [V2_0074, "LAB", "Laboratory"],
    RAD: [V2_0074, "RAD", "Radiology"],
    CAR: [V2_0074, "CAR", "Cardiology"],
    PATH: [V2_0074, "PAT", "Pathology"]
  };
  var LAB_UNIT_RE = /\d+(?:\.\d+)?\s*(?:%|mg\/dL|g\/dL|mmol\/L|U\/L|IU\/L|mIU\/L|ng\/mL|μg\/dL|ug\/dL|pg\/mL|fL|\/uL|10\^?\d+\/uL|x10\^?\d+\/uL|sec|秒|copies\/mL)/;
  function looksLikeLabValueOnly(conclusion) {
    if (!conclusion) return true;
    const text = conclusion.trim();
    if (text.length > 100) return false;
    if (LAB_UNIT_RE.test(text)) return true;
    return false;
  }
  function mapDiagnosticReport(raw, patientId) {
    const conclusion = (raw.conclusion ?? "").trim();
    if (!conclusion) return null;
    const catKeyRaw = String(raw.category ?? "").toUpperCase();
    if (catKeyRaw === "LAB" && looksLikeLabValueOnly(conclusion)) {
      return null;
    }
    const display = raw.display ?? "Unknown Report";
    const code = raw.code;
    const systemHint = raw.system ?? "";
    const system = typeof systemHint === "string" && systemHint.toUpperCase() === "LOINC" ? LOINC : HIS_LOCAL_REPORT_CODE;
    const resource = {
      resourceType: "DiagnosticReport",
      id: stableId(patientId, code || display, raw.date ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: raw.status ?? "final",
      subject: { reference: `Patient/${patientId}` },
      code: {
        coding: [{ system, code: code || display, display }],
        text: display
      },
      conclusion
    };
    const catEntry = CATEGORY_MAP[catKeyRaw];
    if (catEntry) {
      const [catSys, catCode, catDisplay] = catEntry;
      resource.category = [{ coding: [{ system: catSys, code: catCode, display: catDisplay }] }];
    }
    if (raw.date) {
      resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
    }
    if (raw.issued) {
      resource.issued = `${raw.issued}T00:00:00+08:00`;
    } else if (raw.date) {
      resource.issued = `${raw.date}T00:00:00+08:00`;
    }
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.performer = [{ display: hospital }];
    }
    return resource;
  }

  // ../packages/mapper/src/encounter.ts
  var ACTCODE_SYSTEM = "http://terminology.hl7.org/CodeSystem/v3-ActCode";
  var CLASS_MAP = {
    AMB: [ACTCODE_SYSTEM, "AMB", "ambulatory"],
    IMP: [ACTCODE_SYSTEM, "IMP", "inpatient encounter"],
    EMER: [ACTCODE_SYSTEM, "EMER", "emergency"]
  };
  function mapEncounter(raw, patientId) {
    const encClass = String(raw.class ?? "AMB").toUpperCase();
    const classEntry = CLASS_MAP[encClass] ?? CLASS_MAP.AMB;
    const resource = {
      resourceType: "Encounter",
      id: stableId(patientId, raw.date ?? "", encClass, (raw.hospital ?? "").trim()),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "finished",
      class: {
        system: classEntry[0],
        code: classEntry[1],
        display: classEntry[2]
      },
      subject: { reference: `Patient/${patientId}` }
    };
    const typeDisplay = (raw.type_display ?? "").trim();
    if (typeDisplay) {
      resource.type = [{ text: typeDisplay }];
    }
    const period = {};
    if (raw.date) period.start = `${raw.date}T00:00:00+08:00`;
    if (raw.end_date) period.end = `${raw.end_date}T00:00:00+08:00`;
    if (Object.keys(period).length > 0) {
      resource.period = period;
    }
    const department = raw.department ?? "";
    const provider = raw.provider ?? "";
    if (department || provider) {
      const participant = {};
      if (provider) participant.individual = { display: provider };
      resource.participant = Object.keys(participant).length > 0 ? [participant] : [];
      if (department) {
        resource.serviceType = { text: department };
      }
    }
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.serviceProvider = { display: hospital };
    }
    const reason = raw.reason ?? "";
    if (reason) {
      resource.reasonCode = [{ text: reason }];
    }
    const discharge = raw.discharge_disposition ?? "";
    if (discharge) {
      resource.hospitalization = { dischargeDisposition: { text: discharge } };
    }
    const clinicalNote = (raw.clinical_note ?? "").trim();
    if (clinicalNote) {
      resource.note = [{ text: clinicalNote }];
    }
    return resource;
  }

  // ../packages/mapper/src/medication.ts
  function isCjk(ch) {
    const cp = ch.codePointAt(0) ?? 0;
    return cp >= 19968 && cp <= 40959;
  }
  function cjkChars(s) {
    if (!s) return 0;
    let n = 0;
    for (const ch of s) if (isCjk(ch)) n++;
    return n;
  }
  var EN_CHUNK_G = /[A-Z][A-Z0-9.%/\-"'\s]{3,}/g;
  function canonicalDrugKey(name) {
    const s = (name ?? "").toUpperCase();
    const chunks = [...s.matchAll(EN_CHUNK_G)].map((m) => m[0]);
    if (chunks.length === 0) {
      return (name ?? "").trim().toLowerCase();
    }
    let longest = chunks.reduce((a, b) => b.length > a.length ? b : a).trim();
    for (const sep of [" - ", " \u2013 ", " / "]) {
      if (longest.includes(sep)) {
        longest = longest.split(sep)[0];
      }
    }
    return longest.replace(/\s+/g, " ").trim().toLowerCase();
  }
  function medStatus(authoredIso, durationDays) {
    if (!authoredIso) return "completed";
    const datePart = String(authoredIso).slice(0, 10);
    const parsed = /* @__PURE__ */ new Date(`${datePart}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return "completed";
    let days;
    if (durationDays === null || durationDays === void 0 || durationDays === "") {
      days = null;
    } else {
      const n = Number.parseInt(String(durationDays), 10);
      days = Number.isFinite(n) ? n : null;
    }
    if (days === null) days = 90;
    const end = new Date(parsed.getTime());
    end.setUTCDate(end.getUTCDate() + days);
    const today = /* @__PURE__ */ new Date();
    today.setUTCHours(0, 0, 0, 0);
    return end >= today ? "active" : "completed";
  }
  function mapMedicationRequest(raw, patientId) {
    const drugName = (raw.drug_name ?? "").trim();
    if (!drugName) return null;
    const medId = stableId(patientId, canonicalDrugKey(drugName), raw.date ?? "");
    const drugCode = (raw.code ?? "").trim();
    const coding = {
      system: drugCode ? NHI_DRUG_CODE : HIS_LOCAL_MEDICATION_CODE,
      code: drugCode || drugName,
      display: drugName
    };
    const resource = {
      resourceType: "MedicationRequest",
      id: medId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: medStatus(raw.date ?? "", raw.duration_days),
      intent: "order",
      medicationCodeableConcept: {
        coding: [coding],
        text: drugName
      },
      subject: { reference: `Patient/${patientId}` }
    };
    if (raw.date) {
      resource.authoredOn = `${raw.date}T00:00:00+08:00`;
    }
    const drugClass = (raw.drug_class ?? "").trim();
    if (drugClass) {
      resource.category = [{ text: drugClass }];
    }
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.requester = { display: hospital };
    }
    const dosage = {};
    const parts = [];
    for (const k of ["dose", "unit", "frequency"]) {
      if (raw[k]) parts.push(String(raw[k]));
    }
    if (parts.length > 0) {
      dosage.text = parts.join(" ");
    }
    if (raw.route) {
      dosage.route = {
        coding: [{ system: "http://snomed.info/sct", display: raw.route }]
      };
    }
    if (Object.keys(dosage).length > 0) {
      resource.dosageInstruction = [dosage];
    }
    const dr = {};
    const qtyRaw = raw.quantity;
    if (qtyRaw !== null && qtyRaw !== void 0 && qtyRaw !== "") {
      const qtyNum = Number.parseFloat(String(qtyRaw).replace(/,/g, ""));
      if (Number.isFinite(qtyNum)) {
        dr.quantity = { value: qtyNum };
      }
    }
    if (raw.duration_days) {
      const days = Number.parseInt(String(raw.duration_days), 10);
      if (Number.isFinite(days)) {
        dr.expectedSupplyDuration = {
          value: days,
          unit: "days",
          system: "http://unitsofmeasure.org",
          code: "d"
        };
      }
    }
    if (Object.keys(dr).length > 0) {
      resource.dispenseRequest = dr;
    }
    const indication = (raw.indication ?? "").trim();
    const indicationCode = (raw.indication_code ?? "").trim();
    if (indication || indicationCode) {
      const rc = {};
      if (indicationCode) {
        rc.coding = [
          {
            system: ICD_10_CM,
            code: normalizeIcd10Cm(indicationCode),
            display: indication || indicationCode
          }
        ];
      }
      if (indication) {
        rc.text = indicationCode ? `${indicationCode} ${indication}`.trim() : indication;
      }
      resource.reasonCode = [rc];
    }
    return resource;
  }
  function mapMedicationsDedup(rawItems, patientId) {
    const byKey = /* @__PURE__ */ new Map();
    for (const item of rawItems) {
      if (!item || typeof item !== "object") continue;
      const drugName = (item.drug_name ?? "").trim();
      if (!drugName) continue;
      const datePart = (item.date ?? "").slice(0, 10);
      const key = `${datePart}|${canonicalDrugKey(drugName)}`;
      const existing = byKey.get(key);
      if (existing === void 0) {
        byKey.set(key, item);
      } else {
        if (cjkChars(drugName) < cjkChars(existing.drug_name ?? "")) {
          byKey.set(key, item);
        }
      }
    }
    const out = [];
    for (const item of byKey.values()) {
      const m = mapMedicationRequest(item, patientId);
      if (m !== null) out.push(m);
    }
    return out;
  }

  // ../packages/mapper/src/loinc-tables.ts
  var NHI_TO_LOINC = {
    // ── Haematology ────────────────────────────────────
    "08002C": "6690-2",
    // 白血球計數 — Leukocytes #/vol Blood Auto
    "08003C": "718-7",
    // 血色素檢查 — Hemoglobin Mass/vol Blood
    "08006C": "777-3",
    // 血小板計數 — Platelets #/vol Blood Auto
    "08013C": "57021-8",
    // 白血球分類計數 — CBC W Auto Diff panel
    "08128B": "47286-0",
    // 骨髓細胞形態判讀合併細胞分類計數
    // ── Chemistry ─────────────────────────────────────
    "09011C": "17861-6",
    // 鈣 — Calcium Mass/vol S/P
    "09015C": "2160-0",
    // 肌酸酐、血 — Creatinine Mass/vol S/P
    "09016C": "2161-8",
    // 肌酐、尿 — Creatinine Mass/vol Urine
    "09025C": "1920-8",
    // AST/GOT — Aspartate aminotransferase Act S/P
    "09026C": "1742-6",
    // ALT/GPT — Alanine aminotransferase Act S/P
    "09029C": "1975-2",
    // 膽紅素總量 — Bilirubin total Mass/vol S/P
    "09030C": "1968-7",
    // 直接膽紅素 — Bilirubin direct Mass/vol S/P
    "09033C": "2532-0",
    // 乳酸脫氫脢 — LDH Activity S/P
    "09038C": "1751-7",
    // 白蛋白 — Albumin Mass/vol S/P
    "09138C": "35672-5",
    // 直接/總膽紅素比值
    "12112B": "1751-7",
    // 白蛋白(免疫比濁法) — Albumin Mass/vol S/P
    "24007B": "1995-0",
    // 血漿游離鈣 — Calcium ionized Moles/vol S/P
    // ── Hormones ──────────────────────────────────────
    "09121C": "2986-8",
    // 睪丸酯醇免疫分析 — Testosterone Mass/vol S/P
    "27021B": "2991-8",
    // 睪丸脂醇放射免疫分析 — Testosterone Free S/P
    // 09125C / 09127C corrected after dual-reviewer audit — the earlier
    // values (3016-3 was TSH, 10501-5 was LH) were just wrong copy-
    // pastes. Source for the new values: TWNHIFHIR PAS ConceptMap.
    "09125C": "83098-4",
    // 濾泡刺激素免疫分析 — Follitropin (FSH) Immunoassay S/P
    "09127C": "83096-8",
    // 二氫基春情素免疫分析 — Estradiol Immunoassay S/P
    // ── Tumor markers ─────────────────────────────────
    "12007C": "1834-1",
    // α-胎兒蛋白 (AFP) — Mass/vol S/P
    "27049C": "1834-1",
    // 甲-胎兒蛋白 (AFP, RIA)
    "12081C": "83112-3",
    // PSA (EIA/LIA) — Mass/vol S/P Immunoassay
    "12198C": "83113-1",
    // Free PSA — Mass/vol S/P Immunoassay
    "27052C": "2857-1",
    // 攝護腺特異抗原 (PSA) — Mass/vol S/P
    "27083B": "10886-0",
    // 游離PSA (RIA)
    "12052B": "10873-8",
    // β2-微球蛋白
    // ── Immunology / proteins ─────────────────────────
    "09065B": "90991-1",
    // 蛋白電泳分析
    "12028B": "14002-0",
    // IgM 單向免疫擴散
    "12029B": "14002-0",
    // IgM 免疫比濁法
    "12103B": "95801-7",
    // 免疫電泳分析
    "12160B": "15189-4",
    // IgG κ/λ
    "12171B": "17351-8",
    // 抗嗜中性球細胞質抗體 (ANCA)
    "12204B": "20584-9",
    // 白血球表面標記
    "25013B": "44596-5",
    // 螢光切片檢查
    // ── Hepatitis ─────────────────────────────────────
    "14030C": "5195-3",
    // HBsAg
    "14031C": "5195-3",
    // HBsAg
    "14032C": "5196-1",
    // HBsAg (Mass/vol)
    "14051C": "13955-0",
    // HCV Ab
    "27033C": "5197-9",
    // HBsAg RIA
    // ── Pathology / cytology / IHC ────────────────────
    "12195B": "18474-7",
    // Her-2/neu ISH
    "27061B": "14130-9",
    // 動情激素接受體 (ER)
    "27062B": "10861-3",
    // 黃體激素接受體 (PR)
    "30103B": "83052-1",
    // PD-L1 IHC
    // ── Audiology / pulmonary ─────────────────────────
    "17009B": "24341-0",
    // 一氧化碳肺瀰散量
    "22001C": "45498-3",
    // 純音聽力檢查
    "22015B": "45498-3",
    // 詐聾聽力檢查
    "22025B": "46530-2",
    // 自記聽力檢查
    // ═════════════════════════════════════════════════════════════════
    // SUPPLEMENTAL (not in PAS ConceptMap — hand-curated from common
    // NHI codes seen in 健康存摺. LOINC verified against loinc.org
    // canonical names. Method-specific codes (e.g. hs-CRP) pick the
    // specific LOINC; general-method codes pick the most common form.
    // If 健保署 publishes an authoritative broader ConceptMap later,
    // replace this section in one pass.
    // ═════════════════════════════════════════════════════════════════
    // ── Glucose / HbA1c ───────────────────────────────
    "09005C": "1558-6",
    // 空腹血糖 (Glu-AC) — Fasting glucose Mass/vol S/P
    "09140C": "2345-7",
    // 血糖-餐後/隨機 — Glucose Mass/vol S/P (general)
    "09006C": "4548-4",
    // 醣化血紅素 (HbA1c) — Hemoglobin A1c/Hgb.total Blood
    // ── Renal / electrolytes ─────────────────────────
    "09002C": "3094-0",
    // BUN — Urea nitrogen Mass/vol S/P
    "09013C": "3084-1",
    // Uric Acid — Urate Mass/vol S/P
    "09021C": "2951-2",
    // Na — Sodium Moles/vol S/P
    "09022C": "2823-3",
    // K  — Potassium Moles/vol S/P
    "09024C": "2028-9",
    // CO2 — Carbon dioxide Moles/vol S/P
    "09012C": "2777-1",
    // Inorganic P — Phosphate Mass/vol S/P
    "09046B": "19123-9",
    // Mg — Magnesium Mass/vol S/P
    // ── Lipid panel ───────────────────────────────────
    "09001C": "2093-3",
    // T-Cholesterol — Cholesterol Mass/vol S/P
    "09004C": "2571-8",
    // TG — Triglyceride Mass/vol S/P
    "09043C": "2085-9",
    // HDL — HDL cholesterol Mass/vol S/P
    "09044C": "13457-7",
    // LDL — LDL cholesterol (calculated) Mass/vol S/P
    // ── Liver function ────────────────────────────────
    "09027C": "6768-6",
    // ALK-P — Alkaline phosphatase Activity S/P
    "09031C": "2324-2",
    // γ-GT — Gamma glutamyl transferase Activity S/P
    "09035C": "2500-7",
    // TIBC — Iron binding capacity Mass/vol S/P
    "09037C": "1827-5",
    // Ammonia — Plasma
    "09064C": "3040-3",
    // Lipase — Activity S/P
    "09059B": "14118-4",
    // Lactate — Mass/vol Plasma
    // ── Hematology extras ─────────────────────────────
    "08004C": "4544-3",
    // HCT — Hematocrit volume fraction Blood
    "08008C": "14196-0",
    // Reticulocyte — Reticulocytes/100 RBC
    "08010C": "711-2",
    // Eosinophil count — #/vol Blood
    "08011C": "24317-0",
    // CBC panel — Hematology panel Blood
    "08026C": "6301-6",
    // PT/INR — INR Platelet poor plasma
    "08036C": "14979-9",
    // APTT — Platelet poor plasma
    "08075C": "2692-7",
    // Osmolality — Serum or Plasma
    "08079B": "30240-6",
    // D-dimer — Plt poor plasma
    // ── Thyroid ───────────────────────────────────────
    "09106C": "3024-7",
    // Free T4 — Thyroxine free Mass/vol S/P
    "09112C": "3016-3",
    // TSH — Thyrotropin S/P
    // ── Cardiac markers ───────────────────────────────
    "09099C": "10839-9",
    // Troponin I — Troponin I cardiac S/P
    "12192C": "33959-8",
    // Procalcitonin — S/P
    "12193C": "33762-6",
    // NT-proBNP — Mass/vol S/P
    // ── Vitamins / cofactors ──────────────────────────
    "09129C": "2132-9",
    // Vit B12 — Cobalamin Mass/vol S/P
    "09130C": "2284-8",
    // Folate — Mass/vol S/P
    "09113C": "2143-6",
    // Cortisol — Mass/vol S/P
    "12116C": "2276-4",
    // Ferritin — Mass/vol S/P
    // ── Acute phase / inflammation ───────────────────
    // 12015C is the generic NHI CRP order — most clinical contexts in 健保
    // send a regular (not hs-) CRP, so map to 1988-5. If a 院所 specifically
    // bills hs-CRP it will land on a different code (e.g. 12189C).
    "12015C": "1988-5",
    // CRP — C reactive protein Mass/vol S/P
    "12053C": "5048-4",
    // ANA — Antinuclear Ab Titer S/P
    "12056B": "16124-0",
    // Anti-mitochondrial Ab S/P
    // ── Urinalysis ────────────────────────────────────
    "06012C": "5778-6",
    // Urine appearance — Color
    "06013C": "24356-8",
    // 尿生化 panel — Urinalysis macroscopic panel
    "07001C": "14563-1",
    // Stool occult blood
    "09134C": "58453-2",
    // iFOBT quantitative — Hemoglobin Mass/vol Stool by IA
    "12111C": "2161-8",
    // Urine Creatinine — same LOINC as 09016C
    // ── Serology / immunology ────────────────────────
    "12001C": "5292-8",
    // RPR — Serum/Plasma
    "12021C": "2039-6",
    // CEA — Mass/vol S/P
    "12025B": "2465-3",
    // IgG — Mass/vol S/P
    "12027B": "2458-8",
    // IgA — Mass/vol S/P
    "12031C": "19113-0",
    // IgE — Mass/vol S/P
    "12069B": "5132-6",
    // Cryptococcus Ag — Mass/vol S/P
    "12079C": "24108-3",
    // CA 19-9 — Mass/vol S/P
    // ── Blood type ────────────────────────────────────
    "11001C": "882-1",
    // 血型鑑定 — ABO + Rh group
    "11003C": "882-1",
    // 血型鑑定 — ABO + Rh group
    "11004C": "890-4",
    // 抗體反應 — Antibody screen
    // ── Microbiology cultures ────────────────────────
    // 13007C 細菌培養 — previously mapped to LOINC 14219-0 which is
    // actually 'HTLV I p26 Ab in Serum' (verified at loinc.org). The
    // right family is 6463-4 / 11268-0 (Bacteria identified by aerobe
    // culture) but the source row doesn't tell us specimen — leaving
    // unmapped so we don't lie. Falls through to NHI-code-only coding.
    "13013C": "31952-5",
    // TB Culture — Mycobacterium tuberculosis culture
    "13016B": "600-7",
    // Blood Culture — Bacteria identified in Blood
    // ── Virology ──────────────────────────────────────
    "14004B": "7849-3",
    // CMV IgG — Ab S/P
    "14048B": "7850-1",
    // CMV IgM — Ab S/P
    "14066C": "80383-3",
    // Influenza A — Ag Respiratory
    "14084C": "94558-4",
    // SARS-CoV-2 Ag — Respiratory
    "12184C": "88157-3",
    // CMV DNA quant PCR — Plasma
    // ── Mycobacterium / acid-fast (added after audit) ─
    "13025C": "29260-7",
    // 抗酸性濃縮抹片染色檢查 — Mycobacterium AFB stain
    "13026C": "29553-5"
    // 抗酸菌培養 — Mycobacterium culture liquid+solid
    // ── ABG panel (09041B) ────────────────────────────
    // Intentionally NOT mapped here — 09041B is a panel order that
    // unfolds into many items (pH / pCO2 / pO2 / HCO3 / TCO2 / SBE /
    // ABE / SBC / SAT). Mapping the panel code to "pH" would mis-label
    // every non-pH row that shares this NHI code. Each item is
    // resolved via _LOINC_MAP display-keyword fallback below; 09041B
    // also appears in _DISPLAY_FIRST_CODES so display always wins.
    // ── Body fluid / synovial fluid panel (16008C unfolds; the
    // member items rely on display keywords for specimen-aware
    // LOINCs). Parent code maps to synovial fluid analysis panel. ──
    // 16008C 滑液檢查 — previously mapped to LOINC 33903-6 which is
    // actually 'Ketones [Presence] in Urine' (verified loinc.org).
    // Leaving unmapped; the panel falls through to NHI-coding only
    // and the per-item displays in _LOINC_MAP carry their own LOINCs
    // where known.
  };
  var DISPLAY_FIRST_CODES = /* @__PURE__ */ new Set([
    "08011C",
    // CBC panel
    "08013C",
    // CBC w/ auto diff panel
    "06013C",
    // Urinalysis macroscopic panel
    "09041B",
    // ABG panel
    "16008C"
    // Synovial / body-fluid panel
  ]);
  var PANEL_LOINC_MAP = {
    // ── Urinalysis (06013C) ──────────────────────────────
    // All routine dipstick items reside on a single NHI billing code.
    // Without this table they'd all collapse to the panel LOINC 24356-8,
    // losing per-item granularity that's clinically useful (e.g.
    // bilirubin vs urobilinogen for liver workup).
    "06013C": {
      // Order matters: longer/more-specific keys before generic ones
      // (matches _LOINC_MAP iteration semantics — first hit wins).
      "specific gravity": "5811-5",
      // Specific gravity Urine
      "sp.gravity": "5811-5",
      "sp gravity": "5811-5",
      \u6BD4\u91CD: "5811-5",
      "micro-albumin": "14957-5",
      // Microalbumin Mass/vol Urine
      microalbumin: "14957-5",
      "malb(u)": "14957-5",
      malb: "14957-5",
      \u5FAE\u5C0F\u767D\u86CB\u767D: "14957-5",
      uacr: "14959-1",
      // Microalbumin/Creatinine ratio Urine
      "urine glucose": "5792-7",
      sugar: "5792-7",
      // NHI '尿糖' / 'Sugar' under 06013C
      \u5C3F\u7CD6: "5792-7",
      urobilinogen: "5818-0",
      // Urobilinogen Urine Ql
      \u5C3F\u81BD\u7D20\u539F: "5818-0",
      bilirubin: "5770-3",
      // Bilirubin Urine Ql
      \u5C3F\u81BD\u7D05\u7D20: "5770-3",
      nitrite: "5802-4",
      // Nitrite Urine
      \u4E9E\u785D\u9178: "5802-4",
      ketones: "5797-6",
      // Ketones Urine
      ketone: "5797-6",
      \u916E\u9AD4: "5797-6",
      protein: "20454-5",
      // Protein Mass/vol Urine
      \u5C3F\u86CB\u767D: "20454-5",
      \u86CB\u767D: "20454-5",
      leukocyte: "5799-2",
      // Leukocytes Urine
      leu: "5799-2",
      \u767D\u8840\u7403\u916F\u9176: "5799-2",
      blood: "5794-3",
      // Hemoglobin Urine Ql
      \u6F5B\u8840: "5794-3",
      \u8272: "5778-6",
      // Color of Urine (CJK substring)
      color: "5778-6",
      turbidity: "5767-9",
      // Appearance of Urine
      appearance: "5767-9",
      \u5916\u89C0: "5767-9",
      ph: "5803-2",
      // pH of Urine (urine-specific, NOT
      // the arterial 11558-4 that the
      // global map points to)
      \u9178\u9E7C\u5EA6: "5803-2",
      glucose: "5792-7"
      // Last in this block so 'urine
    }
  };
  var LOINC_MAP = {
    // ── Glucose ───────────────────────────────────────
    // Display-keyword fallback only kicks in when NO NHI code is
    // present (dashboard rows, LLM-extracted text). When the NHI code
    // IS present, 09005C → 1558-6 (Fasting) and 09140C → 2345-7
    // (generic) wins directly via _NHI_TO_LOINC.
    //
    // Faithful-transport principle: the bridge does NOT re-interpret
    // display strings like "FINGER SUGAR" as a different LOINC — it
    // preserves the raw display in `code.text` and the original NHI
    // code in `code.coding`. The SMART app does specimen/method-aware
    // grouping on the consumer side (see SMART app handoff doc).
    "fasting glucose": "1558-6",
    \u7A7A\u8179\u8840\u7CD6: "1558-6",
    "glu-ac": "1558-6",
    "glucose ac": "1558-6",
    glucose: "2345-7",
    \u8840\u7CD6: "2345-7",
    glu: "2345-7",
    // HbA1c MUST appear before generic "hb" entries so the longest-prefix
    // match wins for the "HbA1c" display string. Other A1c synonyms…
    hba1c: "4548-4",
    \u91A3\u5316\u8840\u7D05\u7D20: "4548-4",
    a1c: "4548-4",
    hemoglobin: "718-7",
    \u8840\u7D05\u7D20: "718-7",
    hgb: "718-7",
    hb: "718-7",
    // CBC diff — eosinophil count must precede the bare 'wbc'/'白血球'
    // keys (which would otherwise win as substrings).
    // 711-2 verified at loinc.org: 'Eosinophils [#/volume] in Blood
    // by Automated count'.
    \u55DC\u9178\u6027\u767D\u8840\u7403: "711-2",
    \u55DC\u4F0A\u7D05\u6027\u767D\u8840\u7403: "711-2",
    eosinophil: "711-2",
    eosinophils: "711-2",
    wbc: "6690-2",
    \u767D\u8840\u7403: "6690-2",
    platelet: "777-3",
    \u8840\u5C0F\u677F: "777-3",
    plt: "777-3",
    // RBC + RBC indices — verified LOINCs (loinc.org):
    // 789-8  Erythrocytes #/vol Blood Auto              → RBC
    // 785-6  Erythrocyte mean corpuscular hemoglobin    → MCH
    // Long CJK forms first (LDL/cholesterol pattern) so '平均紅血球
    // 血色素' wins over 紅血球.
    \u5E73\u5747\u7D05\u8840\u7403\u8840\u8272\u7D20: "785-6",
    rbc: "789-8",
    \u7D05\u8840\u7403: "789-8",
    mch: "785-6",
    // Urine creatinine — MUST appear before generic 'creatinine' so
    // rows like 'U-CRE 尿液肌酸酐' or 'Creatinine(U)' resolve to the
    // urine LOINC (2161-8) instead of being shadowed by the serum
    // default (2160-0). Same longest-specific-first ordering as
    // the fasting-vs-random glucose block.
    "urine creatinine": "2161-8",
    "creatinine urine": "2161-8",
    "creatinine(u)": "2161-8",
    "u-cre": "2161-8",
    "u-crea": "2161-8",
    \u5C3F\u6DB2\u808C\u9178\u9150: "2161-8",
    creatinine: "2160-0",
    \u808C\u9178\u9150: "2160-0",
    \u808C\u9150\u9178: "2160-0",
    // Taiwan variant spelling
    crea: "2160-0",
    bun: "3094-0",
    \u5C3F\u7D20\u6C2E: "3094-0",
    ast: "1920-8",
    alt: "1742-6",
    ferritin: "2276-4",
    \u8840\u6E05\u9435\u86CB\u767D: "2276-4",
    ferr: "2276-4",
    // Vital-signs from 成人預防保健 (IHKE3402) — separate code namespace
    // but the lookup is by display-name substring, same as for labs.
    "body height": "8302-2",
    "body weight": "29463-7",
    bmi: "39156-5",
    // Waist circumference — measurement LOINC (8280-0). 56086-2 is
    // the 'Adult Waist Circumference Protocol' code, which is a
    // survey/protocol descriptor, NOT a numeric measurement
    // (verified at loinc.org). NHI 健保 reports a single waistline
    // number per visit, so the measurement code is correct.
    "waist circumference": "8280-0",
    "systolic blood pressure": "8480-6",
    "diastolic blood pressure": "8462-4",
    // Lipid panel — ORDER MATTERS. LDL/HDL variants MUST precede the
    // generic 'cholesterol' key so a row labelled 'LDL CHOLESTEROL'
    // resolves to 13457-7 (LDL calculated) and 'HDL CHOLESTEROL' to
    // 2085-9, instead of falling to 2093-3 (total cholesterol) via the
    // 'cholesterol' substring. Same canonical ordering as _LAB_SYNONYMS.
    "ldl cholesterol": "13457-7",
    "ldl-cholesterol": "13457-7",
    \u4F4E\u5BC6\u5EA6\u81BD\u56FA\u9187: "13457-7",
    \u4F4E\u5BC6\u5EA6\u8102\u86CB\u767D\u81BD\u56FA\u9187: "13457-7",
    // 13457-7 = LDL cholesterol (calculated) — matches the NHI 09044C
    // billing code's intent (Taiwan labs predominantly report calculated
    // LDL via Friedewald). Keep consistent with _NHI_TO_LOINC["09044C"].
    "ldl-c": "13457-7",
    ldl: "13457-7",
    "hdl cholesterol": "2085-9",
    "hdl-cholesterol": "2085-9",
    \u9AD8\u5BC6\u5EA6\u81BD\u56FA\u9187: "2085-9",
    \u9AD8\u5BC6\u5EA6\u8102\u86CB\u767D\u81BD\u56FA\u9187: "2085-9",
    "hdl-c": "2085-9",
    hdl: "2085-9",
    // Total cholesterol — bare 'cholesterol' only fires AFTER the
    // LDL/HDL-prefixed variants above have been checked.
    "total cholesterol": "2093-3",
    "t-cholesterol": "2093-3",
    \u8840\u6E05\u7E3D\u81BD\u56FA\u9187: "2093-3",
    \u7E3D\u81BD\u56FA\u9187: "2093-3",
    cholesterol: "2093-3",
    triglyceride: "2571-8",
    \u4E09\u9178\u7518\u6CB9\u916F: "2571-8",
    "uric acid": "3084-1",
    egfr: "33914-3",
    hbsag: "5196-1",
    "anti-hcv": "16128-1",
    // Urine protein (display fallback for the no-NHI-code path that
    // comes from IHKE3402 vitals + adult-preventive supplements).
    "urine protein": "20454-5",
    // Protein Mass/vol Urine
    "u-pro": "20454-5",
    \u5C3F\u86CB\u767D: "20454-5",
    // ABG panel components — 09041B parent code in NHI_TO_LOINC; each
    // member's display ("pCO2", "pO2", "HCO3", "TCO2", "SBE/ABE",
    // "SBC", "SAT" / "SaO2") falls to its own LOINC.
    // pH MUST come before pco2/po2 so the bare "pH" display lands here.
    ph: "11558-4",
    // pH of Arterial blood
    pco2: "2019-8",
    // Carbon dioxide pp in Arterial blood
    po2: "2703-7",
    // Oxygen pp in Arterial blood
    hco3: "1959-6",
    // Bicarbonate Moles/vol Arterial
    bicarbonate: "1959-6",
    tco2: "2028-9",
    // Total CO2 Moles/vol Arterial
    sbe: "11555-0",
    // Standard base excess Arterial
    abe: "11555-0",
    sbc: "1925-7",
    // Standard bicarbonate Arterial
    saturat: "2713-6",
    // O2 saturation Arterial
    sao2: "2713-6",
    sat: "2713-6",
    // NHI display shows just "SAT"
    // Synovial / body-fluid components (16008C parent above).
    "sf.color": "5778-6",
    // Color of Body fluid (reuse Urine color spec OK)
    // NOTE: 8255-2 / 13948-5 previously listed here both turned out
    // to be unrelated LOINCs (verified loinc.org — 8255-2 is
    // 'Service comment 13', 13948-5 is 'Coccidioides immitis IgM
    // Ab'). Body-fluid Appearance / RBC don't have well-attested
    // LOINCs in our table yet — falling through to code.text-only
    // is safer than emitting a misleading LOINC. To add later,
    // verify each against loinc.org first.
    "sf.wbc": "26466-3",
    // WBC #/vol Body fluid
    "sf.neutrophil": "10328-6",
    // Neutrophils/100 leukocytes in Body fluid
    "sf.lympho": "13046-8"
    // Lymphocytes #/vol Body fluid
  };
  var LOINC_DISPLAY = {
    // ── Urinalysis (06013C panel sub-items) ──────────
    // Most critical block — NHI's "Color 尿 顏  ..." style labels are
    // what triggers downstream Chinese-substring labelling bugs.
    "5803-2": "pH of Urine",
    "5811-5": "Specific gravity of Urine",
    "5770-3": "Bilirubin Urine Ql",
    "5802-4": "Nitrite Urine Ql",
    "5778-6": "Color of Urine",
    "5767-9": "Appearance of Urine",
    "5818-0": "Urobilinogen Urine Ql",
    "20454-5": "Protein Mass/Vol in Urine",
    "14957-5": "Microalbumin Mass/Vol in Urine",
    "14959-1": "Microalbumin/Creatinine Ratio in Urine",
    "5792-7": "Glucose Urine Ql",
    "5797-6": "Ketones Urine Ql",
    "5794-3": "Hemoglobin Urine Ql",
    "5799-2": "Leukocytes Urine Ql",
    "24356-8": "Urinalysis Macro Panel",
    // ALL entries below use the LOINC canonical 'Long Common Name'
    // as accepted by the TWNHIFHIR validator. Source: loinc.org for
    // each code, cross-checked against the validator's reported
    // 'Valid display is one of N choices' for displays we previously
    // got wrong (45 LOINCs found in the P333333333 validation run).
    // When updating, copy the exact en-US long name from loinc.org —
    // the validator is sensitive to spelling / punctuation.
    //
    // ── Urinalysis (06013C panel sub-items) ──────────
    // ── ABG (09041B panel) — not in validator output; loinc.org sourced
    "11558-4": "pH of Arterial blood",
    "2019-8": "Carbon dioxide [Partial pressure] in Arterial blood",
    "2703-7": "Oxygen [Partial pressure] in Arterial blood",
    "1959-6": "Bicarbonate [Moles/volume] in Arterial blood",
    "2028-9": "Carbon dioxide [Moles/volume] in Serum or Plasma",
    "11555-0": "Base excess in Arterial blood by calculation",
    "1925-7": "Bicarbonate [Moles/volume] in Arterial blood --standard",
    "2713-6": "Oxygen saturation in Arterial blood",
    // ── Glucose ──────────────────────────────────────
    "1558-6": "Fasting glucose [Mass/volume] in Serum or Plasma",
    "2345-7": "Glucose [Mass/volume] in Serum or Plasma",
    // ── Hematology ───────────────────────────────────
    "718-7": "Hemoglobin [Mass/volume] in Blood",
    "4548-4": "Hemoglobin A1c/Hemoglobin.total in Blood",
    "6690-2": "Leukocytes [,  // /volume] in Blood by Automated count",
    "777-3": "Platelets [,  // /volume] in Blood by Automated count",
    "789-8": "Erythrocytes [,  // /volume] in Blood by Automated count",
    "785-6": "MCH [Entitic mass] by Automated count",
    "711-2": "Eosinophils [,  // /volume] in Blood by Automated count",
    "4544-3": "Hematocrit [Volume Fraction] of Blood by Automated count",
    "57021-8": "CBC W Auto Differential panel - Blood",
    "24317-0": "Hemogram and platelets WO differential panel - Blood",
    // ── Chemistry / liver / renal ────────────────────
    "1920-8": "Aspartate aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    "1742-6": "Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    "2160-0": "Creatinine [Mass/volume] in Serum or Plasma",
    "2161-8": "Creatinine [Mass/volume] in Urine",
    "33914-3": "Glomerular filtration rate [Volume Rate/Area] in Serum or Plasma by Creatinine-based formula (MDRD)/1.73 sq M",
    "3094-0": "Urea nitrogen [Mass/volume] in Serum or Plasma",
    "3084-1": "Urate [Mass/volume] in Serum or Plasma",
    "2951-2": "Sodium [Moles/volume] in Serum or Plasma",
    "2823-3": "Potassium [Moles/volume] in Serum or Plasma",
    "1975-2": "Bilirubin.total [Mass/volume] in Serum or Plasma",
    "1968-7": "Bilirubin.direct [Mass/volume] in Serum or Plasma",
    "1751-7": "Albumin [Mass/volume] in Serum or Plasma",
    "2532-0": "Lactate dehydrogenase [Enzymatic activity/volume] in Serum or Plasma",
    "6768-6": "Alkaline phosphatase [Enzymatic activity/volume] in Serum or Plasma",
    "2324-2": "Gamma glutamyl transferase [Enzymatic activity/volume] in Serum or Plasma",
    "17861-6": "Calcium [Mass/volume] in Serum or Plasma",
    // ── Lipid panel ──────────────────────────────────
    "2093-3": "Cholesterol [Mass/volume] in Serum or Plasma",
    "2571-8": "Triglyceride [Mass/volume] in Serum or Plasma",
    "2085-9": "Cholesterol in HDL [Mass/volume] in Serum or Plasma",
    "13457-7": "Cholesterol in LDL [Mass/volume] in Serum or Plasma by calculation",
    // ── Thyroid / hormones ───────────────────────────
    "3016-3": "Thyrotropin [Units/volume] in Serum or Plasma",
    "3024-7": "Thyroxine (T4) free [Mass/volume] in Serum or Plasma",
    "2986-8": "Testosterone [Mass/volume] in Serum or Plasma",
    "83098-4": "Follitropin [Units/volume] in Serum or Plasma by Immunoassay",
    "83096-8": "Estradiol (E2) [Mass/volume] in Serum or Plasma by Immunoassay",
    // ── Cardiac / inflammation ───────────────────────
    "10839-9": "Troponin I.cardiac [Mass/volume] in Serum or Plasma",
    "33762-6": "Natriuretic peptide.B prohormone N-Terminal [Mass/volume] in Serum or Plasma",
    "1988-5": "C reactive protein [Mass/volume] in Serum or Plasma",
    "33959-8": "Procalcitonin [Mass/volume] in Serum or Plasma",
    // ── Hepatitis / serology ─────────────────────────
    "5195-3": "Hepatitis B virus surface Ag [Presence] in Serum",
    "5196-1": "Hepatitis B virus surface Ag [Units/volume] in Serum",
    "16128-1": "Hepatitis C virus Ab [Presence] in Serum",
    "13955-0": "Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay",
    // ── Coagulation ──────────────────────────────────
    "6301-6": "INR in Platelet poor plasma by Coagulation assay",
    "14979-9": "aPTT in Platelet poor plasma by Coagulation assay",
    "30240-6": "Fibrin D-dimer [Mass/volume] in Platelet poor plasma",
    // ── Vital signs (IHKE3402) ───────────────────────
    "8302-2": "Body height",
    "29463-7": "Body weight",
    "39156-5": "Body mass index (BMI) [Ratio]",
    "8280-0": "Waist Circumference at umbilicus by Tape measure",
    "8480-6": "Systolic blood pressure",
    "8462-4": "Diastolic blood pressure",
    "85354-9": "Blood pressure panel with all children optional"
  };

  // ../packages/mapper/src/parsers.ts
  var UCUM_SYSTEM = "http://unitsofmeasure.org";
  var FULLWIDTH_OPS = [
    ["\uFF1E", ">"],
    ["\uFF1C", "<"],
    ["\u2267", ">="],
    ["\u2266", "<="],
    ["\u2265", ">="],
    ["\u2264", "<="]
  ];
  function translateFullwidth(s) {
    let out = s;
    for (const [from, to] of FULLWIDTH_OPS) {
      if (out.includes(from)) {
        out = out.split(from).join(to);
      }
    }
    return out;
  }
  var COMPARATOR_RE = /^\s*(<=|>=|<|>)\s*(.+)$/;
  var RR_LOWHIGH_BRACKETS = /^\s*\[\s*([^\]]*)\s*\]\s*\[\s*([^\]]*)\s*\]\s*$/;
  var RR_DASH_RANGE = /(-?\d+(?:\.\d+)?)\s*[-~–]\s*(-?\d+(?:\.\d+)?)/;
  var RR_COMPARATOR = /^\s*(<=|>=|<|>)\s*(-?\d+(?:\.\d+)?)\s*$/;
  var RR_SEX_NUM_G = /(男性|女性|男|女|M|F)\s*[:：]?\s*(?:[<>≧≦]=?)?\s*(-?\d+(?:\.\d+)?)/g;
  var RR_SINGLE_BRACKET = /^\s*\[\s*(.+?)\s*\]\s*$/;
  var RR_QUALITATIVE_PAREN = /^\s*(Normal|正常|Nonreactive|Non-reactive)\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)\s*$/i;
  var SEX_TO_FHIR = {
    \u7537\u6027: ["male", "Male"],
    \u7537: ["male", "Male"],
    M: ["male", "Male"],
    \u5973\u6027: ["female", "Female"],
    \u5973: ["female", "Female"],
    F: ["female", "Female"]
  };
  var UCUM_OVERRIDES = {
    // Fullwidth → ASCII
    "\uFF05": "%",
    // Case-sensitive UCUM (Eq is 'eq', not 'Eq')
    "mEq/L": "meq/L",
    "meq/l": "meq/L",
    // BP profile fixed-value: mm[Hg] not mmHg
    mmHg: "mm[Hg]",
    MMHG: "mm[Hg]",
    // Common Chinese 'no unit' placeholders → drop UCUM code
    \u7121: null,
    "": null,
    "\u2014": null,
    "-": null
  };
  function toUcum(unit) {
    if (!unit) return null;
    if (Object.prototype.hasOwnProperty.call(UCUM_OVERRIDES, unit)) {
      return UCUM_OVERRIDES[unit] ?? null;
    }
    return unit;
  }
  function makeQuantity(value, unit) {
    const q = { value };
    if (unit) {
      q.unit = unit;
      q.system = UCUM_SYSTEM;
      q.code = unit;
    }
    return q;
  }
  function tryParseFloat(s) {
    if (s === "" || s == null) return null;
    const trimmed = s.trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    if (Number.isNaN(n)) return null;
    return n;
  }
  function parseRangeMulti(rawRange, unit) {
    const s = translateFullwidth((rawRange || "").trim());
    if (!s) return [];
    const lowBySex = {};
    const highBySex = {};
    let usedMulti = false;
    const m = s.match(RR_LOWHIGH_BRACKETS);
    if (m) {
      const lowBlob = m[1] ?? "";
      const highBlob = m[2] ?? "";
      for (const sm of lowBlob.matchAll(RR_SEX_NUM_G)) {
        if (sm[1] && sm[2]) lowBySex[sm[1]] = sm[2];
      }
      for (const sm of highBlob.matchAll(RR_SEX_NUM_G)) {
        if (sm[1] && sm[2]) highBySex[sm[1]] = sm[2];
      }
      usedMulti = Object.keys(lowBySex).length > 0 || Object.keys(highBySex).length > 0;
    } else {
      const single = s.match(RR_SINGLE_BRACKET);
      if (single) {
        const inner = single[1] ?? "";
        for (const sm of inner.matchAll(RR_SEX_NUM_G)) {
          const sexKey = sm[1] ?? "";
          const valStr = sm[2] ?? "";
          const pat = new RegExp(`${escapeRegex(sexKey)}\\s*[:\uFF1A]?\\s*([<>\u2267\u2266]=?)?\\s*-?\\d`);
          const cm = inner.match(pat);
          const op = cm?.[1] ?? "";
          if (op === ">" || op === ">=") {
            lowBySex[sexKey] = valStr;
          } else if (op === "<" || op === "<=") {
            highBySex[sexKey] = valStr;
          } else {
            lowBySex[sexKey] = valStr;
          }
        }
        usedMulti = Object.keys(lowBySex).length > 0 || Object.keys(highBySex).length > 0;
      }
    }
    if (usedMulti) {
      const entries = [];
      const allSexKeys = [];
      for (const k of [...Object.keys(lowBySex), ...Object.keys(highBySex)]) {
        if (!allSexKeys.includes(k)) allSexKeys.push(k);
      }
      for (const sexKey of allSexKeys) {
        const mapping = SEX_TO_FHIR[sexKey];
        if (!mapping) continue;
        const [fhirCode, fhirDisplay] = mapping;
        const entry = {
          text: rawRange,
          appliesTo: [
            {
              coding: [
                {
                  system: "http://hl7.org/fhir/administrative-gender",
                  code: fhirCode,
                  display: fhirDisplay
                }
              ],
              text: fhirDisplay
            }
          ]
        };
        if (sexKey in lowBySex) {
          const v = tryParseFloat(lowBySex[sexKey]);
          if (v !== null) entry.low = makeQuantity(v, unit);
        }
        if (sexKey in highBySex) {
          const v = tryParseFloat(highBySex[sexKey]);
          if (v !== null) entry.high = makeQuantity(v, unit);
        }
        entries.push(entry);
      }
      if (entries.length > 0) {
        const seen = /* @__PURE__ */ new Set();
        const out = [];
        for (const e of entries) {
          const c = e.appliesTo?.[0]?.coding[0]?.code;
          if (!c || seen.has(c)) continue;
          seen.add(c);
          out.push(e);
        }
        return out;
      }
    }
    const one = parseRange(rawRange, unit);
    return one ? [one] : [];
  }
  function parseRange(rawRange, unit) {
    const s = translateFullwidth((rawRange || "").trim());
    if (!s) return null;
    const entry = { text: rawRange };
    const m = s.match(RR_LOWHIGH_BRACKETS);
    if (m) {
      const lo = (m[1] ?? "").trim();
      const hi = (m[2] ?? "").trim();
      for (const [side, sideVal] of [
        ["low", lo],
        ["high", hi]
      ]) {
        if (!sideVal || sideVal === "\u7121" || sideVal === "\u7A7A\u767D") continue;
        const asFloat = tryParseFloat(sideVal);
        if (asFloat !== null) {
          entry[side] = makeQuantity(asFloat, unit);
          continue;
        }
        const dm = sideVal.match(RR_DASH_RANGE);
        if (dm && side === "low" && entry.high === void 0) {
          const v1 = tryParseFloat(dm[1]);
          const v2 = tryParseFloat(dm[2]);
          if (v1 !== null && v2 !== null) {
            entry.low = makeQuantity(v1, unit);
            entry.high = makeQuantity(v2, unit);
            continue;
          }
        }
        const cm = sideVal.match(RR_COMPARATOR);
        if (cm) {
          const v = tryParseFloat(cm[2]);
          if (v !== null) {
            const op = cm[1];
            if (op === ">" || op === ">=") {
              entry.low = makeQuantity(v, unit);
            } else {
              entry.high = makeQuantity(v, unit);
            }
            continue;
          }
        }
        const qm = sideVal.match(RR_QUALITATIVE_PAREN);
        if (qm) {
          const v = tryParseFloat(qm[2]);
          if (v !== null) {
            entry.high = makeQuantity(v, unit);
          }
        }
      }
      return entry;
    }
    const dashMatch = s.match(RR_DASH_RANGE);
    if (dashMatch) {
      const v1 = tryParseFloat(dashMatch[1]);
      const v2 = tryParseFloat(dashMatch[2]);
      if (v1 !== null && v2 !== null) {
        entry.low = makeQuantity(v1, unit);
        entry.high = makeQuantity(v2, unit);
      }
      return entry;
    }
    const cmpMatch = s.match(RR_COMPARATOR);
    if (cmpMatch) {
      const v = tryParseFloat(cmpMatch[2]);
      if (v !== null) {
        const op = cmpMatch[1];
        if (op === ">" || op === ">=") {
          entry.low = makeQuantity(v, unit);
        } else {
          entry.high = makeQuantity(v, unit);
        }
      }
      return entry;
    }
    return entry;
  }
  function tryParseQuantity(rawValue, unit) {
    if (rawValue === null || rawValue === void 0) return null;
    let s = translateFullwidth(String(rawValue).trim());
    let comparator = null;
    const cm = s.match(COMPARATOR_RE);
    if (cm) {
      comparator = cm[1] ?? null;
      s = (cm[2] ?? "").trim();
    }
    const v = tryParseFloat(s.replace(/,/g, ""));
    if (v === null) return null;
    const ucumCode = toUcum(unit);
    const qty = {
      value: v,
      system: UCUM_SYSTEM
    };
    if (unit) {
      qty.unit = unit;
    }
    if (ucumCode !== null) {
      qty.code = ucumCode;
    }
    if (comparator) {
      qty.comparator = comparator;
    }
    return qty;
  }
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // ../packages/mapper/src/observation.ts
  var IMAGING_KEYWORDS = [
    "ultrasound",
    "sonogram",
    "sonography",
    "echo",
    "ct ",
    "ct/",
    "ct-",
    "computed tomography",
    "mri",
    "magnetic resonance",
    "x-ray",
    "xray",
    "x ray",
    "mammography",
    "mammo",
    "ekg",
    "ecg",
    "electrocardiogram",
    "endoscop",
    "colonoscop",
    "gastroscop",
    "bronchoscop",
    "pet/ct",
    "pet ",
    "spect",
    "\u5F71\u50CF",
    "\u8D85\u97F3\u6CE2",
    "\u96FB\u8166\u65B7\u5C64",
    "\u6838\u78C1\u5171\u632F",
    "\u5FC3\u96FB\u5716",
    "\u5167\u8996\u93E1",
    "\u4E73\u623F\u651D\u5F71"
  ];
  function looksLikeImaging(display, code) {
    const haystack = `${display} ${code}`.toLowerCase();
    return IMAGING_KEYWORDS.some((kw) => haystack.includes(kw));
  }
  var NHI_LAB_CODE_RE = /^\d{4,6}[A-Z]$/;
  function isAsciiOnly(s) {
    for (let i = 0; i < s.length; i++) {
      if (s.charCodeAt(i) > 127) return false;
    }
    return true;
  }
  function escapeRegex2(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function findLoinc(code, display) {
    if (code && code in NHI_TO_LOINC && !DISPLAY_FIRST_CODES.has(code)) {
      return NHI_TO_LOINC[code] ?? null;
    }
    const combined = `${code} ${display}`.toLowerCase();
    if (code in PANEL_LOINC_MAP) {
      for (const [key, loinc] of Object.entries(PANEL_LOINC_MAP[code])) {
        if (isAsciiOnly(key)) {
          if (new RegExp(`\\b${escapeRegex2(key.toLowerCase())}`).test(combined)) {
            return loinc;
          }
        } else if (combined.includes(key.toLowerCase())) {
          return loinc;
        }
      }
    }
    for (const [key, loinc] of Object.entries(LOINC_MAP)) {
      if (isAsciiOnly(key)) {
        if (new RegExp(`\\b${escapeRegex2(key.toLowerCase())}`).test(combined)) {
          return loinc;
        }
      } else if (combined.includes(key.toLowerCase())) {
        return loinc;
      }
    }
    if (code && code in NHI_TO_LOINC) {
      return NHI_TO_LOINC[code] ?? null;
    }
    return null;
  }
  function buildCodings(code, display, loinc) {
    const codings = [];
    if (loinc) {
      codings.push({
        system: "http://loinc.org",
        code: loinc,
        display: LOINC_DISPLAY[loinc] ?? display
      });
    }
    const codeStr = (code ?? "").trim();
    if (codeStr && NHI_LAB_CODE_RE.test(codeStr)) {
      codings.push({
        system: NHI_MEDICAL_ORDER_CODE,
        code: codeStr,
        display
      });
    } else {
      codings.push({
        system: HIS_LOCAL_LAB_CODE,
        code: codeStr || display,
        display
      });
    }
    return codings;
  }
  var INTERP_SYS = "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation";
  function interpCoding(code, display) {
    return { system: INTERP_SYS, code, display };
  }
  var INTERP_TABLE = {
    high: ["H", "High"],
    low: ["L", "Low"],
    normal: ["N", "Normal"],
    critical: ["AA", "Critical abnormal"],
    abnormal: ["A", "Abnormal"],
    positive: ["POS", "Positive"],
    negative: ["NEG", "Negative"]
  };
  function mapInterpretation(interp) {
    const key = (interp ?? "").toLowerCase();
    const entry = INTERP_TABLE[key];
    if (!entry) return null;
    return interpCoding(entry[0], entry[1]);
  }
  var POS_MARKERS = /^\s*(?:positive|pos|reactive|detected|abnormal|present|trace|[1-4]?\s*\+(?:\s*[\+\-])*)\s*(?:\(.*\))?\s*$/i;
  var NEG_MARKERS = /^\s*(?:negative|neg|nonreactive|non[-\s]?reactive|not[-\s]?detected|nd|absent|none|normal|0|[-—–]+)\s*(?:\(.*\))?\s*$/i;
  function classifyQualitative(text) {
    if (text === null || text === void 0) return null;
    let s = String(text).trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      s = s.slice(1, -1).trim();
    }
    if (!s) return null;
    if (NEG_MARKERS.test(s)) return "neg";
    if (POS_MARKERS.test(s)) return "pos";
    return null;
  }
  function deriveInterpretation(valueRaw, qty, rr) {
    if (qty && typeof qty.value === "number" && rr) {
      const v = qty.value;
      const lo = rr.low?.value;
      const hi = rr.high?.value;
      if (typeof hi === "number" && v > hi) return interpCoding("H", "High");
      if (typeof lo === "number" && v < lo) return interpCoding("L", "Low");
      if (typeof lo === "number" || typeof hi === "number") return interpCoding("N", "Normal");
      return null;
    }
    const valKind = classifyQualitative(valueRaw);
    const refText = rr?.text ?? "";
    const refKind = classifyQualitative(refText);
    if (valKind === null) return null;
    if (refKind === "neg") {
      if (valKind === "pos") return interpCoding("A", "Abnormal");
      if (valKind === "neg") return interpCoding("N", "Normal");
    }
    return valKind === "pos" ? interpCoding("POS", "Positive") : interpCoding("NEG", "Negative");
  }
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
  function canonicalLabKey(display) {
    if (!display) return "";
    const s = display.trim();
    if (!s) return "";
    const sUpper = s.toUpperCase();
    for (const key of LAB_SYNONYM_KEYS_SORTED) {
      const ku = key.toUpperCase();
      if (isAsciiOnly(ku)) {
        if (new RegExp(`\\b${escapeRegex2(ku)}`).test(sUpper)) {
          return LAB_SYNONYMS[key];
        }
      } else if (sUpper.includes(ku)) {
        return LAB_SYNONYMS[key];
      }
    }
    return s.toLowerCase().replace(/\s+/g, " ").trim();
  }
  function cjkChars2(s) {
    if (!s) return 0;
    let n = 0;
    for (const ch of s) {
      const cp = ch.codePointAt(0) ?? 0;
      if (cp >= 19968 && cp <= 40959) n++;
    }
    return n;
  }
  function isEnglishDominant(s) {
    let latin = 0;
    for (const ch of s) {
      const cp = ch.charCodeAt(0);
      if (cp < 128 && /[A-Za-z]/.test(ch)) latin++;
    }
    return latin >= 2 && cjkChars2(s) === 0;
  }
  function normalizeValueForDedup(v) {
    if (v === null || v === void 0) return "";
    let s = String(v).trim().toLowerCase();
    s = s.replace(/\([^)]*\)/g, "").trim();
    s = s.replace(/\s+/g, " ");
    return s;
  }
  function isMeaningfulValue(value) {
    if (value === null || value === void 0) return false;
    const s = String(value).trim();
    return s !== "" && s !== "\u2014" && s !== "-" && s !== "N/A" && s !== "null";
  }
  var MEANINGFUL_INTERPS = /* @__PURE__ */ new Set([
    "normal",
    "abnormal",
    "high",
    "low",
    "critical",
    "positive",
    "negative"
  ]);
  function dedupePanelItems(items) {
    const byValue = /* @__PURE__ */ new Map();
    for (const it of items) {
      const k = normalizeValueForDedup(it.value);
      const group = byValue.get(k);
      if (group) group.push(it);
      else byValue.set(k, [it]);
    }
    const out = [];
    for (const group of byValue.values()) {
      if (group.length === 1) {
        out.push(group[0]);
        continue;
      }
      const cjkItems = group.filter((g) => cjkChars2(String(g.display ?? "")) >= 2);
      const enItems = group.filter((g) => isEnglishDominant(String(g.display ?? "")));
      if (cjkItems.length > 0 && enItems.length > 0) {
        out.push(enItems[0]);
      } else {
        out.push(...group);
      }
    }
    return out;
  }
  function filterLabRows(rawItems) {
    const out = [];
    for (const raw of rawItems) {
      if (!raw || typeof raw !== "object") continue;
      const display = raw.display || raw.code || "";
      if (looksLikeImaging(display, raw.code || "")) continue;
      const value = raw.value;
      const interp = (raw.interpretation ?? "").toString().toLowerCase();
      const hasValue = isMeaningfulValue(value);
      const hasMeaningfulInterp = MEANINGFUL_INTERPS.has(interp);
      if (!hasValue && !hasMeaningfulInterp) continue;
      out.push(raw);
    }
    return out;
  }
  function dedupeCrossFormat(items) {
    const orderCode = (it) => (it.order_code ?? "").trim().toUpperCase();
    const byKey = /* @__PURE__ */ new Map();
    let idxCounter = 0;
    for (const item of items) {
      const v = String(item.value ?? "").trim();
      const unit = (item.unit ?? "").trim();
      if (!v) {
        byKey.set(`__no_dedup__|${idxCounter++}`, item);
        continue;
      }
      const key = [
        item.date ?? "",
        v.toLowerCase(),
        unit.toLowerCase(),
        orderCode(item)
      ].join("|");
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, item);
        continue;
      }
      let primary;
      let secondary;
      if (cjkChars2(item.display ?? "") < cjkChars2(existing.display ?? "")) {
        primary = item;
        secondary = existing;
      } else {
        primary = existing;
        secondary = item;
      }
      const merged = { ...primary };
      for (const f of ["order_code", "order_name", "hospital", "code"]) {
        if (!merged[f] && secondary[f]) merged[f] = secondary[f];
      }
      byKey.set(key, merged);
    }
    return Array.from(byKey.values());
  }
  function combineBpItems(items) {
    const byKey = /* @__PURE__ */ new Map();
    const passThrough = [];
    for (const it of items) {
      const disp = String(it.display ?? "").toLowerCase();
      const key = `${it.date ?? ""}|${it.hospital ?? ""}`;
      if (disp.includes("systolic blood pressure")) {
        const v = byKey.get(key) ?? {};
        v.systolic = it;
        byKey.set(key, v);
      } else if (disp.includes("diastolic blood pressure")) {
        const v = byKey.get(key) ?? {};
        v.diastolic = it;
        byKey.set(key, v);
      } else {
        passThrough.push(it);
      }
    }
    for (const parts of byKey.values()) {
      const s = parts.systolic;
      const d = parts.diastolic;
      const primary = s ?? d;
      if (!primary) continue;
      const components = [];
      const tryAdd = (src, loinc, display) => {
        if (!src) return;
        const val = src.value;
        if (val === null || val === void 0 || val === "" || val === "-" || val === "\u2014") return;
        const num = Number.parseFloat(String(val).replace(/,/g, ""));
        if (!Number.isFinite(num)) return;
        components.push({
          loinc,
          display,
          value: num,
          unit: src.unit || "mmHg",
          interpretation_text: src.reference_range || ""
        });
      };
      tryAdd(s, "8480-6", "Systolic blood pressure");
      tryAdd(d, "8462-4", "Diastolic blood pressure");
      if (components.length === 0) continue;
      const combined = { ...primary };
      combined.display = "Blood Pressure";
      combined.code = "";
      combined.order_code = "";
      combined.order_name = "Blood Pressure";
      combined.category = "vital-signs";
      combined.bp_components = components;
      combined.bp_panel_loinc = "85354-9";
      combined.value = void 0;
      combined.unit = void 0;
      passThrough.push(combined);
    }
    return passThrough;
  }
  var SPECIMEN_RULES = [
    [/尿|urine|urinaly/i, "Urine"],
    [/糞|便潛血|stool|fecal|faecal|occult\s*blood/i, "Stool"],
    [/痰|sputum/i, "Sputum"],
    [/腦脊液|csf|cerebrospinal/i, "Cerebrospinal fluid"],
    [/胸水|pleural/i, "Pleural fluid"],
    [/腹水|ascites|peritoneal/i, "Peritoneal fluid"],
    [/陰道|抹片|cervical|pap\s*smear|vaginal/i, "Cervical/Vaginal"],
    [/關節液|synovial|joint\s*fluid/i, "Synovial fluid"],
    [/羊水|amniotic/i, "Amniotic fluid"],
    [/骨髓|bone\s*marrow/i, "Bone marrow"]
  ];
  function inferSpecimen(...hints) {
    const blob = hints.filter((h) => Boolean(h)).join(" ").toLowerCase();
    if (!blob) return null;
    for (const [pattern, label] of SPECIMEN_RULES) {
      if (pattern.test(blob)) return label;
    }
    return null;
  }
  function mapObservation(raw, patientId) {
    const display = raw.display || raw.code || "";
    const code = raw.code || "";
    if (looksLikeImaging(display, code)) return null;
    const value = raw.value;
    const interp = (raw.interpretation ?? "").toString().toLowerCase();
    const hasValue = isMeaningfulValue(value);
    const hasMeaningfulInterp = MEANINGFUL_INTERPS.has(interp);
    if (!hasValue && !hasMeaningfulInterp) return null;
    const obsId = stableId(patientId, code, raw.date ?? "");
    const loinc = findLoinc(code, display);
    const resource = {
      resourceType: "Observation",
      id: obsId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "laboratory",
              display: "Laboratory"
            }
          ]
        }
      ],
      code: {
        coding: buildCodings(code, display, loinc),
        text: display || "Unknown Lab"
      },
      subject: { reference: `Patient/${patientId}` }
    };
    if (raw.date) {
      resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
    }
    if (hasValue) {
      const qty = tryParseQuantity(String(value), raw.unit ?? "");
      if (qty) resource.valueQuantity = qty;
      else resource.valueString = String(value);
    }
    if (raw.reference_range) {
      const rr = parseRange(String(raw.reference_range), raw.unit ?? "");
      if (rr) resource.referenceRange = [rr];
    }
    const interpCodingResult = mapInterpretation(interp) || deriveInterpretation(
      value !== null && value !== void 0 ? String(value) : "",
      resource.valueQuantity,
      resource.referenceRange?.[0]
    );
    if (interpCodingResult) {
      resource.interpretation = [{ coding: [interpCodingResult] }];
    }
    return resource;
  }
  function buildObservation(raw, patientId, panelCode) {
    if (raw.bp_components) {
      const date = raw.date ?? "";
      const hospital = raw.hospital ?? "";
      const obsId2 = stableId(patientId, "obs", "BP_PANEL", date, hospital);
      const componentResources = [];
      for (const c of raw.bp_components) {
        const qty = {
          value: c.value,
          unit: c.unit || "mmHg",
          system: "http://unitsofmeasure.org",
          code: toUcum(c.unit) ?? "mm[Hg]"
        };
        componentResources.push({
          code: {
            coding: [{ system: "http://loinc.org", code: c.loinc, display: c.display }],
            text: c.display
          },
          valueQuantity: qty
        });
      }
      const bpObs = {
        resourceType: "Observation",
        id: obsId2,
        meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
        status: "final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/observation-category",
                code: "vital-signs",
                display: "Vital Signs"
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: raw.bp_panel_loinc ?? "85354-9",
              display: "Blood pressure panel"
            }
          ],
          text: "Blood Pressure"
        },
        subject: { reference: `Patient/${patientId}` },
        component: componentResources
      };
      if (date) bpObs.effectiveDateTime = `${date}T00:00:00+08:00`;
      if (hospital) bpObs.performer = [{ display: hospital }];
      return bpObs;
    }
    const display = raw.display || raw.code || "";
    const code = (panelCode ? String(panelCode) : "") || raw.order_code || raw.code || "";
    const value = raw.value;
    const interp = (raw.interpretation ?? "").toString().toLowerCase();
    const canonical = canonicalLabKey(display) || display;
    const obsId = stableId(patientId, "obs", canonical, raw.date ?? "", raw.hospital ?? "");
    const loinc = findLoinc(code, display);
    const catCode = raw.category || "laboratory";
    const CAT_DISPLAY = {
      laboratory: "Laboratory",
      "vital-signs": "Vital Signs",
      imaging: "Imaging",
      procedure: "Procedure",
      "social-history": "Social History",
      survey: "Survey",
      exam: "Exam",
      therapy: "Therapy",
      activity: "Activity"
    };
    const catDisplay = CAT_DISPLAY[catCode] ?? catCode.charAt(0).toUpperCase() + catCode.slice(1).toLowerCase();
    const resource = {
      resourceType: "Observation",
      id: obsId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: catCode,
              display: catDisplay
            }
          ]
        }
      ],
      code: {
        coding: buildCodings(code, display, loinc),
        text: display || "Unknown Lab"
      },
      subject: { reference: `Patient/${patientId}` }
    };
    if (raw.date) resource.effectiveDateTime = `${raw.date}T00:00:00+08:00`;
    if (raw.hospital) resource.performer = [{ display: raw.hospital }];
    const specimen = inferSpecimen(raw.order_name, raw.display, raw.code);
    if (specimen) resource.specimen = { display: specimen };
    const hasValue = isMeaningfulValue(value);
    if (hasValue) {
      const qty = tryParseQuantity(String(value), raw.unit ?? "");
      if (qty) resource.valueQuantity = qty;
      else resource.valueString = String(value);
    }
    if (raw.reference_range) {
      const rrs = parseRangeMulti(String(raw.reference_range), raw.unit ?? "");
      if (rrs.length > 0) resource.referenceRange = rrs;
    }
    const interpCodingResult = mapInterpretation(interp) || deriveInterpretation(
      value !== null && value !== void 0 ? String(value) : "",
      resource.valueQuantity,
      resource.referenceRange?.[0]
    );
    if (interpCodingResult) {
      resource.interpretation = [{ coding: [interpCodingResult] }];
    }
    return resource;
  }
  function groupByOrderCode(cleaned, patientId) {
    let working = dedupeCrossFormat(cleaned);
    working = combineBpItems(working);
    const groups = /* @__PURE__ */ new Map();
    const keyMeta = /* @__PURE__ */ new Map();
    for (const raw of working) {
      const groupKeyCode = raw.order_code || raw.code || raw.display || "";
      const date = raw.date ?? "";
      const hospital = raw.hospital ?? "";
      const key = `${groupKeyCode}|${date}|${hospital}`;
      const arr = groups.get(key);
      if (arr) arr.push(raw);
      else {
        groups.set(key, [raw]);
        keyMeta.set(key, { groupKeyCode: String(groupKeyCode), date, hospital });
      }
    }
    const out = [];
    for (const [key, items] of groups.entries()) {
      const meta = keyMeta.get(key);
      const deduped = dedupePanelItems(items);
      const obsResources = [];
      const seenObsIds = /* @__PURE__ */ new Set();
      for (const it of deduped) {
        const obs = buildObservation(it, patientId, meta.groupKeyCode);
        if (!obs) continue;
        if (seenObsIds.has(obs.id)) continue;
        seenObsIds.add(obs.id);
        obsResources.push(obs);
      }
      if (obsResources.length === 0) continue;
      const isBpPanel = deduped.every((it) => it.bp_components || it.display === "Blood Pressure");
      if (isBpPanel) {
        out.push(...obsResources);
        continue;
      }
      const orderName = deduped.find((it) => it.order_name)?.order_name ?? null;
      const memberKeys = Array.from(
        new Set(deduped.filter((it) => it.display).map((it) => canonicalLabKey(it.display)))
      ).sort();
      const panelSignature = memberKeys.join(",") || String(meta.groupKeyCode);
      const drId = stableId(patientId, "DR", panelSignature, meta.date, meta.hospital);
      let panelTitle;
      if (deduped.length === 1) {
        const singleDisplay = deduped[0].display ?? "";
        panelTitle = singleDisplay || orderName || String(meta.groupKeyCode);
      } else {
        panelTitle = orderName || String(meta.groupKeyCode);
      }
      const drCodeSystem = NHI_LAB_CODE_RE.test(String(meta.groupKeyCode) ?? "") ? NHI_MEDICAL_ORDER_CODE : HIS_LOCAL_LAB_CODE;
      const dr = {
        resourceType: "DiagnosticReport",
        id: drId,
        meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
        status: "final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                code: "LAB",
                display: "Laboratory"
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: drCodeSystem,
              code: String(meta.groupKeyCode) || "UNKNOWN",
              display: panelTitle
            }
          ],
          text: panelTitle
        },
        subject: { reference: `Patient/${patientId}` },
        result: obsResources.map((o) => ({ reference: `Observation/${o.id}` }))
      };
      if (meta.date) dr.effectiveDateTime = `${meta.date}T00:00:00+08:00`;
      if (meta.hospital) dr.performer = [{ display: meta.hospital }];
      out.push(dr);
      out.push(...obsResources);
    }
    return out;
  }
  function mapObservationsGrouped(rawItems, patientId) {
    const cleaned = filterLabRows(rawItems);
    return groupByOrderCode(cleaned, patientId);
  }

  // ../packages/mapper/src/procedure.ts
  function mapSystem3(systemHint) {
    const s = typeof systemHint === "string" ? systemHint.toLowerCase() : "";
    if (s.includes("snomed")) return SNOMED_CT;
    if (s.includes("icd")) return ICD_10_PCS;
    return HIS_LOCAL_PROCEDURE_CODE;
  }
  function mapProcedure(raw, patientId) {
    const note = (raw.note ?? "").trim();
    const bodySite = (raw.body_site ?? "").trim();
    if (!note && !bodySite) return null;
    const display = raw.display ?? "Unknown Procedure";
    const code = raw.code;
    const system = mapSystem3(raw.system ?? "");
    const resource = {
      resourceType: "Procedure",
      id: stableId(patientId, code || display, raw.date ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: raw.status ?? "completed",
      subject: { reference: `Patient/${patientId}` },
      code: {
        coding: [{ system, code: code || display, display }],
        text: display
      }
    };
    if (raw.date) {
      resource.performedDateTime = `${raw.date}T00:00:00+08:00`;
    }
    if (bodySite) {
      resource.bodySite = [{ text: bodySite }];
    }
    if (note) {
      resource.note = [{ text: note }];
    }
    return resource;
  }

  // ../packages/mapper/src/dispatch.ts
  var LIST_HANDLERS = {
    observations: [mapObservation, "observations"],
    medications: [mapMedicationRequest, "medications"],
    conditions: [mapCondition, "conditions"],
    allergies: [mapAllergyIntolerance, "allergies"],
    diagnostic_reports: [mapDiagnosticReport, "diagnostic_reports"],
    procedures: [mapProcedure, "procedures"],
    encounters: [mapEncounter, "encounters"]
  };
  var GROUP_HANDLERS = {
    observations: mapObservationsGrouped,
    medications: mapMedicationsDedup
  };

  // ../packages/mapper/src/link.ts
  var ENCOUNTER_LINKABLE = /* @__PURE__ */ new Set([
    "Observation",
    "MedicationRequest",
    "DiagnosticReport",
    "Procedure",
    "Condition",
    "AllergyIntolerance"
  ]);
  function resourceDate(r) {
    for (const key of [
      "effectiveDateTime",
      "authoredOn",
      "performedDateTime",
      "onsetDateTime",
      "recordedDate",
      "issued"
    ]) {
      const v = r[key];
      if (v) return String(v).slice(0, 10);
    }
    for (const key of ["effectivePeriod", "performedPeriod"]) {
      const period = r[key];
      if (period && typeof period === "object" && period.start) {
        return String(period.start).slice(0, 10);
      }
    }
    return "";
  }
  function resourceHospital(r) {
    for (const p of r.performer ?? []) {
      const d = (p ?? {}).display ?? "";
      if (d) return d;
    }
    const req = r.requester ?? {};
    if (req && typeof req === "object" && req.display) return req.display;
    return "";
  }
  function dedupAdmissionDayAmb(resources) {
    const impStarts = /* @__PURE__ */ new Set();
    for (const r of resources) {
      if (r.resourceType !== "Encounter") continue;
      if ((r.class ?? {}).code !== "IMP") continue;
      const hosp = (r.serviceProvider ?? {}).display ?? "";
      const start = String((r.period ?? {}).start ?? "").slice(0, 10);
      if (hosp && start) impStarts.add(`${hosp} ${start}`);
    }
    if (impStarts.size === 0) return resources;
    return resources.filter((r) => {
      if (r.resourceType === "Encounter" && (r.class ?? {}).code === "AMB") {
        const hosp = (r.serviceProvider ?? {}).display ?? "";
        const start = String((r.period ?? {}).start ?? "").slice(0, 10);
        if (impStarts.has(`${hosp} ${start}`)) return false;
      }
      return true;
    });
  }
  function linkEncountersInResources(candidates, resources) {
    if (candidates.length === 0) return;
    const exactIndex = /* @__PURE__ */ new Map();
    const impByHosp = /* @__PURE__ */ new Map();
    for (const e of candidates) {
      if (e.resourceType !== "Encounter") continue;
      const hosp = (e.serviceProvider ?? {}).display ?? "";
      const start = String((e.period ?? {}).start ?? "").slice(0, 10);
      if (!hosp || !start) continue;
      const key = `${hosp} ${start}`;
      const arr = exactIndex.get(key) ?? [];
      arr.push(e.id);
      exactIndex.set(key, arr);
      const cls = (e.class ?? {}).code ?? "";
      if (cls === "IMP") {
        const end = String((e.period ?? {}).end ?? "").slice(0, 10);
        if (end) {
          const list = impByHosp.get(hosp) ?? [];
          list.push([start, end, e.id]);
          impByHosp.set(hosp, list);
        }
      }
    }
    if (exactIndex.size === 0 && impByHosp.size === 0) return;
    for (const r of resources) {
      if (!ENCOUNTER_LINKABLE.has(r.resourceType)) continue;
      if (r.encounter || r.context) continue;
      const hosp = resourceHospital(r);
      const date = resourceDate(r);
      if (!hosp || !date) continue;
      const matches = [...exactIndex.get(`${hosp} ${date}`) ?? []];
      if (matches.length === 0) {
        for (const [start, end, eid] of impByHosp.get(hosp) ?? []) {
          if (start <= date && date <= end) matches.push(eid);
        }
      }
      if (matches.length !== 1) continue;
      r.encounter = { reference: `Encounter/${matches[0]}` };
    }
  }
  function resolveSexStratifiedRanges(patient, resources) {
    if (!patient) return;
    const gender = String(patient.gender ?? "").toLowerCase();
    if (gender !== "male" && gender !== "female") return;
    for (const r of resources) {
      if (r.resourceType !== "Observation") continue;
      const rrs = r.referenceRange ?? [];
      if (rrs.length < 2) continue;
      let match = null;
      for (const entry of rrs) {
        for (const ap of entry.appliesTo ?? []) {
          for (const c of ap.coding ?? []) {
            if (String(c.code ?? "").toLowerCase() === gender) {
              match = entry;
              break;
            }
          }
          if (match) break;
        }
        if (match) break;
      }
      if (!match) continue;
      r.referenceRange = [match];
      const valStr = String((r.valueQuantity ?? {}).value ?? "") || String(r.valueString ?? "");
      const newInterp = deriveInterpretation(valStr, r.valueQuantity ?? null, match);
      if (newInterp) {
        r.interpretation = [{ coding: [newInterp] }];
      }
    }
  }

  // ../packages/mapper/src/patient.ts
  var TW_NATIONAL_ID_RE = /^[A-Z][12]\d{8}$/;
  function looksLikeTwNationalId(value) {
    if (!value) return false;
    return TW_NATIONAL_ID_RE.test(value.trim().toUpperCase());
  }
  function mapPatient(raw) {
    const patientId = String(raw.identifier ?? raw.id ?? "unknown");
    const nameText = (raw.name ?? null) || "Unknown";
    const phone = (raw.phone ?? null) || "";
    const address = (raw.address ?? null) || "";
    const [family, given] = splitName(nameText);
    const nameEntry = { use: "official", text: nameText };
    if (family) nameEntry.family = family;
    if (given.length > 0) nameEntry.given = given;
    const resource = {
      resourceType: "Patient",
      id: patientId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      identifier: [
        {
          use: "official",
          system: looksLikeTwNationalId(patientId) ? TW_NATIONAL_ID : HIS_LOCAL_PATIENT_MRN,
          value: patientId
        }
      ],
      name: [nameEntry],
      gender: mapGender(raw.gender)
    };
    const birthDate = raw.birthDate;
    if (birthDate) resource.birthDate = birthDate;
    if (phone) {
      resource.telecom = [{ system: "phone", use: "home", value: phone }];
    }
    if (address) {
      resource.address = [{ use: "home", text: address }];
    }
    return resource;
  }
  function splitName(fullName) {
    const name = (fullName ?? "").trim();
    if (!name || name === "Unknown") return ["", []];
    if (/\s/.test(name)) {
      const parts = name.split(/\s+/);
      return [parts[parts.length - 1], parts.slice(0, -1)];
    }
    const codepoints = Array.from(name);
    return codepoints.length > 1 ? [codepoints[0], [codepoints.slice(1).join("")]] : [name, []];
  }
  function mapGender(gender) {
    const g = typeof gender === "string" ? gender.toLowerCase() : "";
    if (["male", "m", "\u7537", "\u7537\u6027"].includes(g)) return "male";
    if (["female", "f", "\u5973", "\u5973\u6027"].includes(g)) return "female";
    return "unknown";
  }

  // src/background.js
  var STORAGE_KEY = "syncStatus";
  var _cancelled = false;
  var _activeSyncCtx = null;
  var CANCEL_ERROR = "__SYNC_CANCELLED__";
  var SESSION_EXPIRED_ERROR = "__SESSION_EXPIRED__";
  async function setStatus(partial) {
    if (_cancelled) return;
    const prev = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] || {};
    const next = { ...prev, ...partial, ts: Date.now() };
    await chrome.storage.local.set({ [STORAGE_KEY]: next });
    chrome.runtime.sendMessage({ type: "syncProgress", status: next }).catch(() => {
    });
  }
  var NHI_HOST = "myhealthbank.nhi.gov.tw";
  function rocToISO(rocDate) {
    if (!rocDate) return "";
    const m = String(rocDate).match(/^(\d{2,3})[/.-](\d{1,2})[/.-](\d{1,2})/);
    if (!m) return "";
    const y = parseInt(m[1], 10) + 1911;
    return `${y}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  }
  function pickEnglish(s) {
    if (s === null || s === void 0) return "";
    const str = String(s);
    const idx = str.indexOf("||");
    if (idx === -1) return str.trim();
    const en = str.slice(idx + 2).trim();
    return en || str.slice(0, idx).trim();
  }
  function adaptLabItem(item) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(item.funC_DATE);
    const value = item.assaY_VALUE;
    if (!date || value === void 0 || value === null || value === "") return null;
    const fullName = item.assaY_ITEM_NAME || item.order_shortname || "";
    return {
      date,
      order_code: item.ordeR_CODE || "",
      order_name: item.ordeR_NAME || "",
      code: fullName,
      display: fullName,
      value: String(value),
      unit: item.uniT_DATA || "",
      reference_range: item.consulT_VALUE || item.short_CONSULT_VALUE || "",
      hospital: item.hosP_ABBR || ""
    };
  }
  function adaptMedicationFromDetail(drug, visit) {
    if (!drug || typeof drug !== "object") return null;
    const date = rocToISO(visit?.func_DATE || visit?.func_date || "");
    const drug_name = pickEnglish(drug.drug_name || drug.druG_NAME || "");
    if (!date || !drug_name) return null;
    const days = Number(drug.order_drug_day || drug.order_DRUG_DAY || 0);
    return {
      date,
      drug_name,
      code: drug.order_code || drug.ordeR_CODE || "",
      // List endpoint doesn't expose dose/frequency/route — only days + qty.
      dose: "",
      frequency: "",
      route: "",
      quantity: drug.order_qty || drug.order_QTY || "",
      duration_days: Number.isFinite(days) ? days : 0,
      // pickEnglish on icd_name turns 良性攝護腺...||Benign prostatic... into the EN side.
      indication: pickEnglish(visit?.icd9cm_CODE_CNAME || visit?.icd9cm_name || ""),
      indication_code: visit?.icd9cm_CODE || visit?.icd9cm_code || "",
      drug_class: pickEnglish(drug.act || ""),
      hospital: visit?.hosp_ABBR || visit?.hosp_abbr || ""
    };
  }
  function adaptMedication() {
    return null;
  }
  function adaptAdultPreventive(row) {
    if (!row || typeof row !== "object") return null;
    const date = rocToISO(row.firsT_DIAG_DATE || "");
    if (!date) return null;
    const hospital = row.hosP_ABBR || row.hosp_ABBR || "";
    const out = [];
    function push(display, value, unit, refRange, category, code) {
      if (value === void 0 || value === null) return;
      const v = String(value).trim();
      if (v === "" || v === "-" || v === "\u2014") return;
      out.push({
        date,
        hospital,
        category: category || "laboratory",
        order_code: code || "",
        order_name: display,
        code: code || display,
        display,
        value: v,
        unit: unit || "",
        reference_range: refRange || ""
      });
    }
    push("Body Height", row.height, "cm", "", "vital-signs");
    push("Body Weight", row.weight, "kg", "", "vital-signs");
    push("BMI", row.bmi, "kg/m2", "", "vital-signs");
    push("Waist Circumference", row.waistline, "cm", "", "vital-signs");
    push(
      "Systolic Blood Pressure",
      row.basE_SBP,
      "mmHg",
      row.bloD_PRESS_RESULT_TEXT || "",
      "vital-signs"
    );
    push(
      "Diastolic Blood Pressure",
      row.basE_EBP,
      "mmHg",
      row.bloD_PRESS_RESULT_TEXT || "",
      "vital-signs"
    );
    push("Cholesterol", row.cho, "mg/dL");
    push("Triglyceride", row.bloD_TG, "mg/dL");
    push("HDL", row.hdl, "mg/dL");
    push("LDL", row.ldl, "mg/dL");
    push("SGOT (AST)", row.sgot, "U/L", row.lF_DIAG_RESULT_TEXT || "");
    push("SGPT (ALT)", row.sgpt, "U/L", row.lF_DIAG_RESULT_TEXT || "");
    push(
      "Glu-AC",
      row.s_09005C,
      "mg/dL",
      row.s_09005C_DIAG_RESULT_TEXT || "",
      "laboratory",
      "09005C"
    );
    push("BUN", row.urinE_BUN, "mg/dL");
    push("Creatinine", row.bloD_CREAT, "mg/dL");
    push(
      "eGFR",
      row.egfr,
      "mL/min/1.73m2",
      row.rF_DIAG_RESULT_TEXT || ""
    );
    push(
      "Urine Protein",
      row.urinE_PROTEIN,
      "",
      row.urinE_PROTEIN_TEXT || ""
    );
    push("HBsAg", row.hbsag, "", row.hbsaG_TEXT || "");
    push("Anti-HCV", row.antI_HCV, "", row.antI_HCV_TEXT || "");
    push("Uric Acid", row.uriC_ACID, "mg/dL");
    push(
      "Urine UA",
      row.urinE_UA,
      "",
      row.urinE_UA_DIAG_RESULT_TEXT || ""
    );
    push(
      "\u4EE3\u8B1D\u75C7\u5019\u7FA4\u7BE9\u6AA2 (Metabolic Syndrome Screening)",
      row.metA_SYNDR_RESULT_TEXT,
      "",
      ""
    );
    return out;
  }
  function adaptInpatientEncounter(item) {
    if (!item || typeof item !== "object") return null;
    const start = rocToISO(item.in_DATE || item.func_DATE || "");
    const end = rocToISO(item.out_DATE || "");
    if (!start) return null;
    const icdCode = item.icd9cm_CODE || item.icd9cm_code || "";
    const icdName = pickEnglish(item.icd9cm_CODE_CNAME || item.icd9cm_name || "");
    return {
      date: start,
      end_date: end,
      class: "IMP",
      type_display: "\u4F4F\u9662",
      department: "",
      provider: "",
      reason: icdName ? icdCode ? `${icdCode} ${icdName}` : icdName : "",
      hospital: item.hosp_ABBR || item.hosp_abbr || "",
      row_id: item.row_ID || item.row_id || ""
    };
  }
  function adaptEncounterFromMedExpense(item, classHint) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(item.funC_DATE || item.func_DATE || item.func_date || "");
    if (!date) return null;
    const icdCode = item.icD9CM_CODE || item.icd9cm_CODE || item.icd9cm_code || "";
    const icdName = pickEnglish(
      item.icD9CM_CODE_CNAME || item.icd9cm_CODE_CNAME || item.icd9cm_name || ""
    );
    return {
      date,
      end_date: "",
      class: classHint || "AMB",
      // Origin marker isn't a clinical class, but stash it as type_display
      // so downstream sees the NHI label without us inventing one.
      type_display: item.ori_type_name || item.orI_TYPE_NAME || "",
      department: "",
      provider: "",
      reason: icdName ? icdCode ? `${icdCode} ${icdName}` : icdName : "",
      hospital: item.hosP_ABBR || item.hosp_ABBR || item.hosp_abbr || "",
      // Pass through for the eventual IHKE3303S02 detail fetch (Phase B).
      row_id: item.roW_ID || item.row_id || ""
    };
  }
  function adaptAllergy(item) {
    if (!item || typeof item !== "object") return null;
    const allergen = item.allergen_name || item.alleR_NAME || item.medname || item.druG_NAME || item.allergen || "";
    if (!allergen) return null;
    return {
      recorded_date: rocToISO(item.funC_DATE || item.recorD_DATE || ""),
      display: allergen,
      category: "medication",
      criticality: "unable-to-assess",
      reaction: item.reactioN || item.symptom || ""
    };
  }
  function adaptProcedure(item) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(item.func_date || item.funC_DATE);
    const display = pickEnglish(
      item.op_code_cname || item.proC_NAME || item.ordeR_NAME || ""
    );
    if (!date || !display) return null;
    const reasonCode = item.icd9cm_code || item.icd9cm_CODE || "";
    const reasonName = pickEnglish(item.icd9cm_code_cname || item.icd9cm_CODE_CNAME || "");
    const note = reasonName ? reasonCode ? `Reason: ${reasonCode} ${reasonName}` : `Reason: ${reasonName}` : "";
    return {
      date,
      code: "",
      display,
      note,
      body_site: "",
      hospital: item.hosp_abbr || item.hosP_ABBR || ""
    };
  }
  function adaptImagingReportFromDetail(item) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(item.func_DATE || item.func_date || "");
    const display = pickEnglish(item.order_NAME || item.order_name || "");
    const conclusion = (item.desc || "").trim();
    if (!date || !display || !conclusion) return null;
    return {
      date,
      code: item.order_CODE || item.order_code || "",
      system: "",
      display,
      category: "RAD",
      conclusion,
      hospital: item.hosp_ABBR || item.hosp_abbr || "",
      // NHI separates the exam date (func_DATE) from the report-upload
      // timestamp (assay_UPLOAD_DATE). The latter is when the report
      // was finalised in NHI's system — maps to DiagnosticReport.issued.
      // Falls back to None if NHI didn't ship one.
      issued: rocToISO((item.assay_UPLOAD_DATE || "").split(/\s+/)[0])
    };
  }
  var NHI_API_ENDPOINTS = [
    // encounters / procedures don't have a /search variant (404). page_load
    // silently ignores s_date / e_date — verified the array length is
    // identical with or without dates. Date filter is effectively unsupported
    // for these endpoints; they return all data in NHI's lifetime window.
    // Encounter source: IHKE3303S01 (醫療費用申報). The /page_load variant
    // is window-limited to ~1 year (returned 51 visits ending 114/05);
    // /search accepts s_date / e_date and goes back further (162 visits
    // to 112/05 for the same patient). Since labs/meds extend to 3y via
    // their own /search endpoints, encounter MUST also use /search or
    // the (hospital, date) linker has nothing to match against for older
    // lab dates.
    {
      name: "encounters",
      path: "/api/ihke3000/ihke3303s01/search?s_date=&e_date=",
      page_type: "encounters",
      adapt: adaptEncounterFromMedExpense,
      supportsDateRange: true
    },
    // Inpatient (住院) — IHKE3309S01 is the primary list with in_DATE/out_DATE
    // span. IHKE3308S01 carries a small set of older 住院 records with the
    // same fields (func_DATE in some rows instead of in_DATE; adapter
    // handles both). Both feed the same encounter mapper.
    {
      name: "inpatient",
      path: "/api/ihke3000/ihke3309s01/page_load",
      page_type: "encounters",
      adapt: adaptInpatientEncounter
    },
    {
      name: "inpatient_legacy",
      path: "/api/ihke3000/ihke3308s01/page_load",
      page_type: "encounters",
      adapt: adaptInpatientEncounter
    },
    {
      name: "procedures",
      path: "/api/ihke3000/ihke3301s05/page_load",
      page_type: "procedures",
      adapt: adaptProcedure
    },
    // medications: page_load only accepts empty dates (HTTP 400 otherwise).
    // The /search endpoint is what the SPA hits when user picks a custom
    // date range and accepts ISO 西元 dates with dashes (2023-01-01).
    // Confirmed via DevTools observation of the 篩選 panel submit.
    {
      name: "medications",
      path: "/api/ihke3000/ihke3306s01/search?s_date=&e_date=&s_sort=A1&s_type=A",
      page_type: "medications",
      adapt: adaptMedication,
      supportsDateRange: true
    },
    {
      name: "allergies",
      path: "/api/ihke3000/ihke3202s01/SP_IHKE3202S01",
      page_type: "allergies",
      adapt: adaptAllergy
    },
    {
      name: "allergies_b",
      path: "/api/ihke3000/ihke3202s01/SP_IHKE3202S04",
      page_type: "allergies",
      adapt: adaptAllergy
    },
    // 成人預防保健結果 (IHKE3402S01): one row per screening, contains
    // BMI / vitals / lipid panel / LFT / RFT / Hep B/C / uric acid all
    // pre-computed by NHI's screening programme. adaptAdultPreventive
    // returns an array (one Observation per measurement) so the
    // adapter-call loop flattens it.
    {
      name: "adult_preventive",
      path: "/api/ihke3000/ihke3402s01/SP_IHKE3402S01",
      page_type: "observations",
      adapt: adaptAdultPreventive
    },
    {
      name: "cancer_screening",
      path: "/api/ihke3000/ihke3404s01/SP_IHKE3404S01",
      page_type: "observations",
      adapt: adaptLabItem
    },
    // glucose (IHKE3406S01) + lipid (IHKE3407S01) are subsets of
    // other_labs (IHKE3409S01) per NHI's data model — fetching them
    // separately just creates dup observations, so we skip them.
    // Imaging list (IHKE3408S01) only carries order-level data; full
    // narrative report lives at IHKE3408S02. We do a 2-step fetch (see
    // _fetchImagingDetailsInTab) to grab the report, then map to a real
    // DiagnosticReport. The list adapter is a no-op stub like medications.
    // imaging: search endpoint accepts ISO date range like medications.
    {
      name: "imaging",
      path: "/api/ihke3000/ihke3408s01/search?s_type=&s_date=&e_date=&s_sort=A1",
      page_type: "diagnostic_reports",
      adapt: () => null,
      supportsDateRange: true
    },
    // other_labs already uses /search; same ISO-dash date format works.
    {
      name: "other_labs",
      path: "/api/ihke3000/ihke3409s01/search?s_type=&s_date=&e_date=&s_sort=A1",
      page_type: "observations",
      adapt: adaptLabItem,
      supportsDateRange: true
    }
  ];
  function applyDateRangeToPath(path, dateRange) {
    if (!dateRange || !dateRange.start && !dateRange.end) return path;
    const s = (dateRange.start || "").slice(0, 10);
    const e = (dateRange.end || "").slice(0, 10);
    let p = path;
    if (/[?&]s_date=/.test(p)) {
      p = p.replace(/([?&]s_date=)[^&]*/, `$1${s}`);
    } else {
      p += (p.includes("?") ? "&" : "?") + `s_date=${s}`;
    }
    if (/[?&]e_date=/.test(p)) {
      p = p.replace(/([?&]e_date=)[^&]*/, `$1${e}`);
    } else {
      p += `&e_date=${e}`;
    }
    return p;
  }
  async function _fetchMedicationDetailsInTab({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v) => ({
      row_ID: v.row_ID || v.rowid || v.rowID || "",
      // Keep parent fields needed by adaptMedicationFromDetail.
      parent: {
        func_DATE: v.func_DATE || v.func_date || "",
        icd9cm_CODE: v.icd9cm_CODE || v.icd9cm_code || "",
        icd9cm_CODE_CNAME: v.icd9cm_CODE_CNAME || v.icd9cm_name || "",
        hosp_ABBR: v.hosp_ABBR || v.hosp_abbr || ""
      }
    })).filter((r) => r.row_ID);
    if (reqs.length === 0) return [];
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (base, items) => {
        const token = sessionStorage.getItem("token");
        if (!token) return { error: "SESSION_EXPIRED" };
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return { error: "SESSION_EXPIRED" };
        }
        const auth = `Bearer ${token}`;
        async function fetchOne(rowId, ctype) {
          const url = `${base}/api/ihke3000/IHKE3306S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${ctype}`;
          const ac = new AbortController();
          const t = setTimeout(() => ac.abort(), 3e4);
          try {
            const r = await fetch(url, {
              method: "GET",
              credentials: "same-origin",
              signal: ac.signal,
              headers: { "Accept": "application/json", "Authorization": auth }
            });
            clearTimeout(t);
            if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
            if (!r.ok) return { error: `HTTP ${r.status}` };
            return { body: await r.json() };
          } catch (e) {
            clearTimeout(t);
            return { error: e.name === "AbortError" ? "timeout 30s" : String(e?.message || e) };
          }
        }
        async function one(rowId) {
          for (const ct of [2, 1, 3, 4]) {
            const r = await fetchOne(rowId, ct);
            if (r.error === "SESSION_EXPIRED") return r;
            if (r.error) continue;
            const main = Array.isArray(r.body?.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
            const hasDrugs = main.some(
              (v) => Array.isArray(v?.sp_IHKE3306S03_data_list) && v.sp_IHKE3306S03_data_list.length > 0
            );
            if (hasDrugs) return r;
          }
          return await fetchOne(rowId, 2);
        }
        const out = new Array(items.length);
        let next = 0;
        const CONC = 3;
        async function worker() {
          while (next < items.length) {
            const i = next++;
            await new Promise((r) => setTimeout(r, Math.random() * 150));
            out[i] = await one(items[i].row_ID);
          }
        }
        const ws = [];
        for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
        await Promise.all(ws);
        return { results: out };
      },
      args: [baseUrl, reqs]
    });
    if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
    const drugs = [];
    const results = result?.results || [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (!r || r.error || !r.body) continue;
      const main = Array.isArray(r.body.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
      for (const visit of main) {
        const drugList = Array.isArray(visit.sp_IHKE3306S03_data_list) ? visit.sp_IHKE3306S03_data_list : [];
        for (const d of drugList) {
          const adapted = adaptMedicationFromDetail(d, visit);
          if (adapted) drugs.push(adapted);
        }
      }
    }
    return drugs;
  }
  async function _fetchImagingDetailsInTab({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v) => ({
      row_ID: v.row_ID || v.rowid || v.rowID || "",
      ctype: v.ori_TYPE || v.ori_type || "A"
    })).filter((r) => r.row_ID);
    if (reqs.length === 0) return [];
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (base, items) => {
        const token = sessionStorage.getItem("token");
        if (!token) return { error: "SESSION_EXPIRED" };
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return { error: "SESSION_EXPIRED" };
        }
        const auth = `Bearer ${token}`;
        async function one(rowId, ctype) {
          const url = `${base}/api/ihke3000/IHKE3408S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype)}`;
          const ac = new AbortController();
          const t = setTimeout(() => ac.abort(), 3e4);
          try {
            const r = await fetch(url, {
              method: "GET",
              credentials: "same-origin",
              signal: ac.signal,
              headers: { "Accept": "application/json", "Authorization": auth }
            });
            clearTimeout(t);
            if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
            if (!r.ok) return { error: `HTTP ${r.status}` };
            return { body: await r.json() };
          } catch (e) {
            clearTimeout(t);
            return { error: e.name === "AbortError" ? "timeout 30s" : String(e?.message || e) };
          }
        }
        const out = new Array(items.length);
        let next = 0;
        const CONC = 3;
        async function worker() {
          while (next < items.length) {
            const i = next++;
            await new Promise((r) => setTimeout(r, Math.random() * 150));
            out[i] = await one(items[i].row_ID, items[i].ctype);
          }
        }
        const ws = [];
        for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
        await Promise.all(ws);
        return { results: out };
      },
      args: [baseUrl, reqs]
    });
    if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
    const reports = [];
    const results = result?.results || [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (!r || r.error || !r.body) continue;
      const main = Array.isArray(r.body.ihke3408S02_main_data) ? r.body.ihke3408S02_main_data : [];
      for (const visit of main) {
        const adapted = adaptImagingReportFromDetail(visit);
        if (adapted) reports.push(adapted);
      }
    }
    return reports;
  }
  async function _fetchEncounterDetailsInTab({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v, idx) => ({ idx, row_ID: v.roW_ID || v.row_ID || "" })).filter((r) => r.row_ID);
    if (reqs.length === 0) return [];
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (base, items) => {
        const token = sessionStorage.getItem("token");
        if (!token) return { error: "SESSION_EXPIRED" };
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return { error: "SESSION_EXPIRED" };
        }
        const auth = `Bearer ${token}`;
        async function fetchOne(rowId, t) {
          const url = `${base}/api/ihke3000/ihke3303s02/page_load?rid=${encodeURIComponent(rowId)}&t=${t}`;
          const ac = new AbortController();
          const tm = setTimeout(() => ac.abort(), 3e4);
          try {
            const r = await fetch(url, {
              method: "GET",
              credentials: "same-origin",
              signal: ac.signal,
              headers: { "Accept": "application/json", "Authorization": auth }
            });
            clearTimeout(tm);
            if (r.status === 401 || r.status === 403) return { error: "SESSION_EXPIRED" };
            if (!r.ok) return { error: `HTTP ${r.status}` };
            return { body: await r.json() };
          } catch (e) {
            clearTimeout(tm);
            return { error: e.name === "AbortError" ? "timeout 30s" : String(e?.message || e) };
          }
        }
        async function one(rowId) {
          for (const t of [1, 2, 3, 4, 5]) {
            const r = await fetchOne(rowId, t);
            if (r.error === "SESSION_EXPIRED") return r;
            if (r.error) continue;
            const main = r.body?.ihke3303S02_main_data || [];
            if (main.length > 0) return { body: r.body, t };
          }
          return { body: null };
        }
        const out = new Array(items.length);
        let next = 0;
        const CONC = 3;
        async function worker() {
          while (next < items.length) {
            const i = next++;
            await new Promise((r) => setTimeout(r, Math.random() * 150));
            out[i] = await one(items[i].row_ID);
          }
        }
        const ws = [];
        for (let w = 0; w < CONC && w < items.length; w++) ws.push(worker());
        await Promise.all(ws);
        return { results: out };
      },
      args: [baseUrl, reqs]
    });
    if (result?.error === "SESSION_EXPIRED") throw new Error(SESSION_EXPIRED_ERROR);
    const byIdx = /* @__PURE__ */ new Map();
    const results = result?.results || [];
    for (let i = 0; i < reqs.length; i++) {
      byIdx.set(reqs[i].idx, results[i]?.body || null);
    }
    return byIdx;
  }
  function _classFromS02Detail(body) {
    if (!body) return null;
    const main = body.ihke3303S02_main_data || [];
    if (main.length === 0) return null;
    const tn = String(main[0].hosp_DATA_TYPE_NAME || "");
    if (tn.includes("\u6025")) return "EMER";
    if (tn.includes("\u4F4F\u9662")) return "IMP";
    return "AMB";
  }
  async function _postStructured(backend, page_type, items, syncApiKey, patientOverride) {
    const r = await fetch(`${backend}/sync/upload-structured`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}
      },
      body: JSON.stringify({
        page_type,
        host: NHI_HOST,
        items,
        patient_override: patientOverride || null
      })
    });
    if (!r.ok) throw new Error(`POST upload-structured ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return await r.json();
  }
  var _LOCAL_PAGE_TYPE_ORDER = [
    "encounters",
    "observations",
    "medications",
    "conditions",
    "allergies",
    "diagnostic_reports",
    "procedures"
  ];
  async function _maybeFetchPatientIdFromNhi(tabId, patientOverride) {
    const current = patientOverride.id_no || "";
    const isPlaceholder = !current || current.startsWith("auto-");
    if (!isPlaceholder) return patientOverride;
    let cid = null;
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: async () => {
          const t = sessionStorage.getItem("token");
          if (!t) return null;
          try {
            const r = await fetch("/api/ihke3000/ihke3410s01/page_load", {
              credentials: "same-origin",
              headers: { Accept: "application/json", Authorization: `Bearer ${t}` }
            });
            if (!r.ok) return null;
            const body = await r.json();
            return body?.cid || null;
          } catch {
            return null;
          }
        }
      });
      if (result && /^[A-Z][12]\d{8}$/.test(result)) cid = result;
    } catch (e) {
      console.warn("[NHI sync] IHKE3410 cid fetch failed:", e?.message ?? e);
    }
    if (cid && cid !== current) {
      patientOverride = { ...patientOverride, id_no: cid };
      chrome.storage.sync.set({ patientOverride }).catch(() => {
      });
    }
    return patientOverride;
  }
  async function _isMaskEnabled() {
    try {
      const { maskNameEnabled } = await chrome.storage.sync.get("maskNameEnabled");
      return maskNameEnabled === true;
    } catch {
      return false;
    }
  }
  function _buildOverridePatient(ov, maskEnabled) {
    const displayName = maskEnabled ? maskName(ov.name || "") : ov.name || "";
    const raw = {
      id: ov.id_no,
      identifier: ov.id_no,
      name: displayName || ov.id_no
    };
    if (ov.birth_date) raw.birthDate = ov.birth_date;
    if (ov.gender) raw.gender = ov.gender;
    return mapPatient(raw);
  }
  function _replaceNameDeep(value, needle, replacement) {
    if (!needle || needle === replacement) return value;
    if (typeof value === "string") return value.split(needle).join(replacement);
    if (Array.isArray(value)) return value.map((v) => _replaceNameDeep(v, needle, replacement));
    if (value && typeof value === "object") {
      const out = {};
      for (const k in value) out[k] = _replaceNameDeep(value[k], needle, replacement);
      return out;
    }
    return value;
  }
  function _assembleLocalBundle(byType, patientOverride, maskEnabled) {
    const patient = _buildOverridePatient(patientOverride, maskEnabled);
    const pid = patient.id;
    const all = [patient];
    for (const pt of _LOCAL_PAGE_TYPE_ORDER) {
      const items = byType[pt];
      if (!items || items.length === 0) continue;
      let mapped;
      if (GROUP_HANDLERS[pt]) {
        mapped = GROUP_HANDLERS[pt](items, pid);
      } else if (LIST_HANDLERS[pt]) {
        const [fn] = LIST_HANDLERS[pt];
        mapped = items.filter((it) => it && typeof it === "object").map((it) => fn(it, pid)).filter((r) => r !== null);
      } else {
        continue;
      }
      if (pt === "encounters") mapped = dedupAdmissionDayAmb(mapped);
      all.push(...mapped);
    }
    const seen = /* @__PURE__ */ new Set();
    const unique = [];
    for (const r of all) {
      const key = `${r.resourceType}/${r.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(r);
    }
    linkEncountersInResources(unique, unique);
    resolveSexStratifiedRanges(patient, unique);
    return {
      resourceType: "Bundle",
      type: "collection",
      timestamp: (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d+Z$/, "Z"),
      entry: unique.map((r) => ({
        fullUrl: `${r.resourceType}/${r.id}`,
        resource: r
      }))
    };
  }
  var PENDING_BUNDLE_KEY = "pendingFhirBundle";
  async function _stashFhirBundle(bundle, patientId, dateRange) {
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const today = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const hm = `${pad(now.getHours())}${pad(now.getMinutes())}`;
    const maskedPid = maskId(patientId || "unknown", "X");
    const safePid = maskedPid.replace(/[^A-Za-z0-9_-]/g, "_");
    const compact = (d) => (d || "").slice(0, 10).replace(/-/g, "");
    let datePart;
    if (dateRange && (dateRange.start || dateRange.end)) {
      const s = compact(dateRange.start) || today;
      const e = compact(dateRange.end) || today;
      datePart = `${s}-${e}`;
    } else {
      datePart = today;
    }
    const filename = `nhi-${safePid}-${datePart}-${hm}.json`;
    const json = JSON.stringify(bundle, null, 2);
    await chrome.storage.local.set({
      [PENDING_BUNDLE_KEY]: {
        filename,
        json,
        bytes: json.length,
        generatedAt: Date.now(),
        patientId: patientId || null
      }
    });
    return { filename, bytes: json.length };
  }
  async function runNhiApiSync({ tabId, mode, backend, syncApiKey, nhiBase, patientOverride, dateRange, dateRangeLabel }) {
    _cancelled = false;
    const BASE = nhiBase || `https://${NHI_HOST}`;
    if (!patientOverride) {
      await chrome.storage.local.set({
        syncStatus: {
          running: false,
          progress: "\u26D4 \u8ACB\u5148\u5728 popup \u586B\u5BEB\u75C5\u4EBA\u8CC7\u6599\u5F8C\u518D\u8A66",
          phase: "error",
          ts: Date.now(),
          completed: Date.now()
        }
      });
      return;
    }
    if (!tabId) {
      throw new Error("API sync requires NHI tab id (cookies are first-party)");
    }
    patientOverride = await _maybeFetchPatientIdFromNhi(tabId, patientOverride);
    _activeSyncCtx = { backend, syncApiKey, patientId: patientOverride.id_no };
    await chrome.storage.local.set({ syncRunning: true }).catch(() => {
    });
    const _t0 = Date.now();
    const _phases = [];
    let _phaseStart = _t0;
    const _markPhase = (name) => {
      const now = Date.now();
      _phases.push({ name, ms: now - _phaseStart });
      _phaseStart = now;
    };
    await setStatus({
      running: true,
      progress: "\u{1F680} \u958B\u59CB\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u2026",
      phase: "init",
      started: _t0,
      totalResources: 0,
      host: NHI_HOST,
      errors: []
    });
    const fetchSpec = NHI_API_ENDPOINTS.map((ep) => {
      const path = ep.supportsDateRange ? applyDateRangeToPath(ep.path, dateRange) : ep.path;
      return { name: ep.name, url: BASE + path, method: "GET" };
    });
    if (dateRange && (dateRange.start || dateRange.end)) {
      console.log(
        "[NHI API sync] date range:",
        `${dateRange.start || "(unbounded)"} \u2192 ${dateRange.end || "(unbounded)"}`
      );
    }
    let settledRaw;
    try {
      [{ result: settledRaw }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: async (specs) => {
          const token = sessionStorage.getItem("token");
          if (!token) return [{ error: "SESSION_EXPIRED" }];
          const auth = `Bearer ${token}`;
          if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
            return [{ error: "SESSION_EXPIRED" }];
          }
          async function fetchOne(s, ms) {
            const ac = new AbortController();
            const timer = setTimeout(() => ac.abort(), ms);
            try {
              const r = await fetch(s.url, {
                method: s.method,
                credentials: "same-origin",
                signal: ac.signal,
                headers: { "Accept": "application/json", "Authorization": auth }
              });
              clearTimeout(timer);
              const ct = r.headers.get("content-type") || "";
              if (r.status === 401 || r.status === 403) {
                return { name: s.name, error: "SESSION_EXPIRED" };
              }
              if (!r.ok) return { name: s.name, error: `HTTP ${r.status}` };
              if (!ct.includes("application/json")) {
                return { name: s.name, error: `non-JSON (ct=${ct})` };
              }
              let body;
              try {
                body = await r.json();
              } catch (e) {
                return { name: s.name, error: "JSON parse: " + e.message };
              }
              return { name: s.name, body };
            } catch (e) {
              clearTimeout(timer);
              if (e.name === "AbortError") return { name: s.name, error: "timeout 60s" };
              return { name: s.name, error: String(e?.message || e) };
            }
          }
          const CONCURRENCY = 3;
          const JITTER_MS = 200;
          const results = new Array(specs.length);
          let nextIdx = 0;
          async function worker() {
            while (nextIdx < specs.length) {
              const i = nextIdx++;
              await new Promise((r) => setTimeout(r, Math.random() * JITTER_MS));
              results[i] = await fetchOne(specs[i], 6e4);
            }
          }
          const workers = [];
          for (let w = 0; w < CONCURRENCY && w < specs.length; w++) {
            workers.push(worker());
          }
          await Promise.all(workers);
          return results;
        },
        args: [fetchSpec]
      });
    } catch (e) {
      throw new Error(`executeScript failed: ${e.message}`);
    }
    if (settledRaw.some((r) => r.error === "SESSION_EXPIRED")) {
      throw new Error(SESSION_EXPIRED_ERROR);
    }
    const errors = [];
    function extractList(body) {
      if (Array.isArray(body)) return body;
      if (!body || typeof body !== "object") return [];
      let arrayKeys = Object.entries(body).filter(([_, v]) => Array.isArray(v));
      if (arrayKeys.length === 0) return [];
      if (arrayKeys.length === 1) return arrayKeys[0][1];
      const HELPER_RE = /select|option|dropdown|filter|sort|lookup/i;
      const dataKeys = arrayKeys.filter(([k]) => !HELPER_RE.test(k));
      if (dataKeys.length === 1) return dataKeys[0][1];
      if (dataKeys.length === 0) return arrayKeys[0][1];
      arrayKeys = dataKeys;
      const merged = [];
      for (const [k, v] of arrayKeys) {
        for (const item of v) {
          if (item && typeof item === "object") {
            merged.push({ ...item, __section: k });
          } else {
            merged.push(item);
          }
        }
      }
      return merged;
    }
    const settled = settledRaw.map((r, i) => {
      const ep = NHI_API_ENDPOINTS[i];
      if (r.error) {
        return { status: "rejected", reason: { message: `${ep.name}: ${r.error}` } };
      }
      const list = extractList(r.body);
      const items = [];
      for (const it of list) {
        const r2 = ep.adapt(it);
        if (r2 === null || r2 === void 0) continue;
        if (Array.isArray(r2)) {
          for (const x of r2) if (x) items.push(x);
        } else {
          items.push(r2);
        }
      }
      let bodySample = null;
      if (list.length > 0 && items.length === 0) {
        bodySample = JSON.stringify({
          topLevelKeys: Array.isArray(r.body) ? null : Object.keys(r.body || {}).slice(0, 10),
          wasArray: Array.isArray(r.body),
          firstItem: list[0] ?? null,
          secondItem: list[1] ?? null
        }).slice(0, 4e3);
      }
      return { status: "fulfilled", value: { ep, items, raw_count: list.length, bodySample, rawList: list } };
    });
    _markPhase("nhi-parallel");
    const encIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "encounters");
    if (encIdx >= 0 && settled[encIdx].status === "fulfilled") {
      const visits = settled[encIdx].value.rawList || [];
      if (visits.length > 0) {
        await setStatus({
          progress: `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5C31\u91AB\u7D00\u9304\u8A73\u60C5\u2026`
        });
        try {
          const detailMap = await _fetchEncounterDetailsInTab({
            tabId,
            baseUrl: BASE,
            visits
          });
          const reAdapted = [];
          for (let i = 0; i < visits.length; i++) {
            const detail = detailMap?.get(i) || null;
            const cls = _classFromS02Detail(detail) || "AMB";
            const it = adaptEncounterFromMedExpense(visits[i], cls);
            if (it) reAdapted.push(it);
          }
          settled[encIdx].value.items = reAdapted;
          settled[encIdx].value.raw_count = reAdapted.length;
        } catch (e) {
          errors.push(`encounter detail: ${e.message}`);
        }
      }
    }
    _markPhase("encounter-detail");
    const imgIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "imaging");
    if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
      const visits = settled[imgIdx].value.rawList || [];
      if (visits.length > 0) {
        await setStatus({
          progress: `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5F71\u50CF\u6AA2\u67E5\u5831\u544A\u2026`
        });
        try {
          const reports = await _fetchImagingDetailsInTab({
            tabId,
            baseUrl: BASE,
            visits
          });
          settled[imgIdx].value.items = reports;
          settled[imgIdx].value.raw_count = reports.length;
          settled[imgIdx].value.visitCount = visits.length;
        } catch (e) {
          errors.push(`imaging detail: ${e.message}`);
        }
      }
    }
    _markPhase("imaging-detail");
    const medIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "medications");
    if (medIdx >= 0 && settled[medIdx].status === "fulfilled") {
      const visits = settled[medIdx].value.rawList || [];
      if (visits.length > 0) {
        await setStatus({
          progress: `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u7528\u85E5\u660E\u7D30\u2026`
        });
        try {
          const drugItems = await _fetchMedicationDetailsInTab({
            tabId,
            baseUrl: BASE,
            visits
          });
          settled[medIdx].value.items = drugItems;
          settled[medIdx].value.visitCount = visits.length;
          settled[medIdx].value.raw_count = drugItems.length;
        } catch (e) {
          errors.push(`medications detail: ${e.message}`);
        }
      }
    }
    _markPhase("medication-detail");
    const byType = {};
    let raw_total = 0;
    let adapted_total = 0;
    const breakdown = [];
    for (let i = 0; i < settled.length; i++) {
      const ep = NHI_API_ENDPOINTS[i];
      const s = settled[i];
      if (s.status === "rejected") {
        errors.push(`${ep.name}: ${s.reason.message}`);
        breakdown.push(`${ep.name}=ERR`);
        continue;
      }
      const { items, raw_count } = s.value;
      raw_total += raw_count;
      adapted_total += items.length;
      let label;
      if (items.length > raw_count && raw_count > 0) {
        label = `${ep.name}=${raw_count} rows \u2192 ${items.length} obs`;
      } else {
        label = `${ep.name}=${items.length}/${raw_count}`;
      }
      breakdown.push(label);
      if (raw_count > 0 && items.length === 0) {
        try {
          await chrome.storage.local.set({
            [`__sampleBody_${ep.name}`]: s.value.bodySample || "n/a"
          });
        } catch {
        }
      }
      if (items.length === 0) continue;
      (byType[ep.page_type] = byType[ep.page_type] || []).push(...items);
    }
    const maskEnabled = await _isMaskEnabled();
    if (maskEnabled && patientOverride.name) {
      const replacement = maskName(patientOverride.name);
      for (const key of Object.keys(byType)) {
        byType[key] = _replaceNameDeep(byType[key], patientOverride.name, replacement);
      }
    }
    let total = 0;
    let _localFilename = null;
    if (mode === "local") {
      if (_cancelled) throw new Error(CANCEL_ERROR);
      await setStatus({ progress: "\u{1F9EC} \u8F49\u63DB\u70BA\u5065\u5EB7\u7D00\u9304\u6A94\u2026", totalResources: 0 });
      let bundle;
      try {
        bundle = _assembleLocalBundle(byType, patientOverride, maskEnabled);
      } catch (e) {
        errors.push(`local mapping: ${e.message}`);
        bundle = null;
      }
      if (bundle) {
        total = bundle.entry.length;
        await setStatus({ progress: `\u{1F4BE} \u6E96\u5099 ${total} \u7B46 FHIR \u8CC7\u6E90\u2026`, totalResources: total });
        try {
          const dl = await _stashFhirBundle(bundle, patientOverride.id_no, dateRange);
          _localFilename = dl.filename;
        } catch (e) {
          errors.push(`stash bundle: ${e.message}`);
        }
      }
    } else {
      const uploadOverride = maskEnabled && patientOverride.name ? { ...patientOverride, name: maskName(patientOverride.name) } : patientOverride;
      for (const [page_type, items] of Object.entries(byType)) {
        if (_cancelled) throw new Error(CANCEL_ERROR);
        await setStatus({
          progress: `\u2B06\uFE0F \u4E0A\u50B3 ${page_type}\uFF08${items.length} \u7B46\uFF09\u2026`,
          totalResources: total
        });
        try {
          const data = await _postStructured(backend, page_type, items, syncApiKey, uploadOverride);
          total += data.count || 0;
        } catch (e) {
          errors.push(`upload ${page_type}: ${e.message}`);
        }
      }
      if (patientOverride.id_no) {
        try {
          await setStatus({ progress: "\u{1F4E6} \u53D6\u5F97\u5F8C\u7AEF\u5B8C\u6574\u8CC7\u6599\u2026", totalResources: total });
          const expUrl = `${backend}/fhir/export?patient=${encodeURIComponent(patientOverride.id_no)}`;
          const r = await fetch(expUrl, {
            headers: syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}
          });
          if (r.ok) {
            const bundle = await r.json();
            const dl = await _stashFhirBundle(bundle, patientOverride.id_no);
            _localFilename = dl.filename;
            if (Array.isArray(bundle.entry)) total = bundle.entry.length;
          } else {
            errors.push(`export bundle: HTTP ${r.status}`);
          }
        } catch (e) {
          errors.push(`export bundle: ${e.message}`);
        }
      }
    }
    _markPhase(mode === "local" ? "assemble+stash" : "backend-upload");
    const _elapsedMs = Date.now() - _t0;
    const _elapsedStr = _elapsedMs < 6e4 ? `${(_elapsedMs / 1e3).toFixed(1)}s` : `${Math.floor(_elapsedMs / 6e4)}m${Math.round(_elapsedMs % 6e4 / 1e3)}s`;
    const _localTail = "";
    const _successVerb = mode === "local" ? "\u5DF2\u7522\u751F" : "\u5DF2\u66F4\u65B0";
    const _phaseLines = _phases.map((p) => `\u23F1 ${p.name}=${(p.ms / 1e3).toFixed(1)}s`);
    const _fullBreakdown = [..._phaseLines, ...breakdown];
    await setStatus({
      running: false,
      progress: errors.length ? `\u26A0\uFE0F \u53D6\u5F97\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF0C${errors.length} \u9805\u5931\u6557\uFF08${_elapsedStr}\uFF09${_localTail}` : `\u2705 \u53D6\u5F97\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF08${_elapsedStr}\uFF09${_localTail}`,
      phase: "done",
      totalResources: total,
      completed: Date.now(),
      elapsedMs: _elapsedMs,
      // Per-endpoint breakdown for the popup's '查看明細' collapsible.
      // Keep as a plain array so popup.js can render with DOM API (no
      // innerHTML / no escaping concerns). Items look like
      // 'encounters=12/12' or 'adult_preventive=2 rows → 36 obs'.
      breakdown: _fullBreakdown,
      errors,
      histno: patientOverride.id_no,
      mode,
      localFilename: _localFilename
    });
    chrome.storage.local.set({ syncRunning: false }).catch(() => {
    });
    if (mode !== "local") try {
      await fetch(`${backend}/sync/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}
        },
        body: JSON.stringify({
          status: errors.length ? "partial" : "success",
          patient_id: patientOverride.id_no || "",
          // /sync/log lands in the dashboard's sync-history row. Only
          // mask when the user has opted in — otherwise dashboard sees
          // the raw name they typed (consistent with "民眾自用" default).
          patient_name: maskEnabled ? maskName(patientOverride.name || "") : patientOverride.name || "",
          total,
          breakdown,
          date_range: dateRangeLabel || "",
          elapsed_ms: _elapsedMs,
          started_at: new Date(_t0).toISOString(),
          errors
        })
      });
    } catch (e) {
      console.warn("[NHI sync] failed to write history log:", e);
    }
    _activeSyncCtx = null;
  }
  chrome.runtime.onInstalled.addListener(async () => {
    let tabs;
    try {
      tabs = await chrome.tabs.query({ url: "https://myhealthbank.nhi.gov.tw/*" });
    } catch {
      return;
    }
    for (const tab of tabs) {
      chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["sidebar.js"] }).catch(() => {
      });
    }
  });
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === "startNhiApiSync") {
      runNhiApiSync(msg.payload).then(
        () => {
          try {
            sendResponse({ ok: true });
          } catch {
          }
        },
        async (e) => {
          chrome.storage.local.set({ syncRunning: false }).catch(() => {
          });
          if (e?.message === CANCEL_ERROR) {
            try {
              sendResponse({ ok: true, cancelled: true });
            } catch {
            }
            return;
          }
          if (e?.message === SESSION_EXPIRED_ERROR) {
            await chrome.storage.local.set({
              syncStatus: {
                running: false,
                progress: "\u{1F512} NHI session \u5DF2\u767B\u51FA \u2014 \u8ACB\u5728 NHI tab \u91CD\u65B0\u767B\u5165\u5F8C\u518D\u9EDE Sync",
                phase: "session_expired",
                ts: Date.now(),
                completed: Date.now()
              }
            });
            try {
              sendResponse({ ok: false, expired: true });
            } catch {
            }
            return;
          }
          console.error("runNhiApiSync failed", e);
          await setStatus({ running: false, progress: `\u274C ${e.message}`, phase: "error" });
          try {
            sendResponse({ ok: false, error: e.message });
          } catch {
          }
        }
      );
      return true;
    }
    if (msg?.type === "stopSync") {
      _cancelled = true;
      const ctx = _activeSyncCtx;
      if (ctx?.patientId && ctx.backend) {
        (async () => {
          try {
            await fetch(
              `${ctx.backend}/sync/patient/${encodeURIComponent(ctx.patientId)}`,
              {
                method: "DELETE",
                headers: ctx.syncApiKey ? { "X-Sync-API-Key": ctx.syncApiKey } : {}
              }
            );
            const prev = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] || {};
            await chrome.storage.local.set({
              [STORAGE_KEY]: {
                ...prev,
                running: false,
                progress: "\u26D4 \u5DF2\u505C\u6B62\u4E26\u6E05\u9664\u90E8\u5206\u8CC7\u6599 \u2014 \u8ACB\u91CD\u65B0\u53D6\u5F97",
                phase: "cancelled",
                ts: Date.now(),
                completed: Date.now()
              }
            });
          } catch (e) {
            console.warn("[NHI sync] cancel wipe failed:", e);
          }
        })();
      }
      _activeSyncCtx = null;
      try {
        sendResponse({ ok: true });
      } catch {
      }
      return true;
    }
    if (msg?.type === "getSyncStatus") {
      chrome.storage.local.get(STORAGE_KEY).then((data) => sendResponse(data[STORAGE_KEY] || null));
      return true;
    }
    if (msg?.type === "clearSyncStatus") {
      chrome.storage.local.remove(STORAGE_KEY).then(() => sendResponse({ ok: true }));
      return true;
    }
  });
  chrome.alarms.create("sw-keepalive", { periodInMinutes: 0.34 });
  chrome.alarms.onAlarm.addListener(() => {
  });
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9iYWNrZ3JvdW5kLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENlbnRyYWxpc2VkIEZISVIgQ29kZVN5c3RlbSAvIElkZW50aWZpZXJTeXN0ZW0gVVJJcyB1c2VkIGJ5IHRoZSBtYXBwZXJzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL2ZoaXIvc3lzdGVtcy5weWAuIFdlIHVzZSBVUkwtZm9ybSBzeXN0ZW1zIGluc3RlYWRcbiAqIG9mIE9JRHMgYmVjYXVzZTpcbiAqICAgLSBpdCBkb2Vzbid0IHJlcXVpcmUgbWludGluZy9vd25pbmcgYSByZWFsIE5ISS9UVyBjb3JlIE9JRCxcbiAqICAgLSBpdCdzIHNlbGYtZGVzY3JpYmluZyBpbiB0b29scyB0aGF0IGRvbid0IHJlY29nbmlzZSB0aGUgT0lELFxuICogICAtIGl0IGNsZWFubHkgc3Vydml2ZXMgdGhlIFRXTkhJRkhJUiB2YWxpZGF0b3IncyBzeW50YWN0aWMgY2hlY2suXG4gKlxuICogQWxsIHN5c3RlbXMgbGl2ZSBoZXJlIHNvIGEgc2luZ2xlIGNoYW5nZSByaXBwbGVzIHRvIGV2ZXJ5IG1hcHBlci5cbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDAgTkhJIG5hdGlvbmFsIGNvZGUgc3lzdGVtcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyAobGFiICsgcHJvY2VkdXJlIG9yZGVyIGNvZGVzIFx1MjAxNCBzYW1lIG5hbWVzcGFjZSkuICovXG5leHBvcnQgY29uc3QgTkhJX01FRElDQUxfT1JERVJfQ09ERSA9XG4gIFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvQ29kZVN5c3RlbS9uaGktbWVkaWNhbC1vcmRlci1jb2RlXCI7XG5cbi8qKiBcdTUwNjVcdTRGRERcdTdGNzJcdTg1RTVcdTU0QzFcdTRFRTNcdTc4QkMgKGRydWcgY29kZSkuICovXG5leHBvcnQgY29uc3QgTkhJX0RSVUdfQ09ERSA9IFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvQ29kZVN5c3RlbS9uaGktZHJ1Zy1jb2RlXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBUYWl3YW4gcGF0aWVudCBpZGVudGlmaWVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RiAoVGFpd2FuIG5hdGlvbmFsIElEKS4gKi9cbmV4cG9ydCBjb25zdCBUV19OQVRJT05BTF9JRCA9IFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvSWRlbnRpZmllclN5c3RlbS9uYXRpb25hbC1pZFwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgTG9jYWwgZmFsbGJhY2tzIChwZXItZGVwbG95bWVudCwgTk9UIGNyb3NzLXN5c3RlbSBjYW5vbmljYWwpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX0xBQl9DT0RFID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1sYWJcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTUVESUNBVElPTl9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1tZWRpY2F0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1JFUE9SVF9DT0RFID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1yZXBvcnRcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQ09ORElUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWNvbmRpdGlvblwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9QUk9DRURVUkVfQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtcHJvY2VkdXJlXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX0FMTEVSR0VOX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWFsbGVyZ2VuXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BBVElFTlRfTVJOID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9JZGVudGlmaWVyU3lzdGVtL2hpcy1tcm5cIjtcblxuLy8gXHUyNTAwXHUyNTAwIEludGVybmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgY29uc3QgTE9JTkMgPSBcImh0dHA6Ly9sb2luYy5vcmdcIjtcbmV4cG9ydCBjb25zdCBTTk9NRURfQ1QgPSBcImh0dHA6Ly9zbm9tZWQuaW5mby9zY3RcIjtcbi8qKiBJQ0QtMTAtQ00gKFRhaXdhbiAvIFx1NTA2NVx1NEZERCB1c2VzIHRoaXMsIG5vdCBiYXJlIElDRC0xMCkuICovXG5leHBvcnQgY29uc3QgSUNEXzEwX0NNID0gXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtY21cIjtcbmV4cG9ydCBjb25zdCBJQ0RfMTBfUENTID0gXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtcGNzXCI7XG4iLCAiLyoqXG4gKiBDcm9zcy1tYXBwZXIgaGVscGVycyBzaGFyZWQgYnkgc2V2ZXJhbCBGSElSIHJlc291cmNlIG1hcHBlcnMuXG4gKi9cblxuaW1wb3J0IHsgc2hhMSB9IGZyb20gXCJqcy1zaGExXCI7XG5cbi8qKlxuICogRGV0ZXJtaW5pc3RpYyAzMi1jaGFyIGhleCBJRCBkZXJpdmVkIGZyb20gdGhlIHBhdGllbnQgSUQgKyBhcmJpdHJhcnlcbiAqIGtleSBwYXJ0cy4gU2FtZSBTSEEtMSArIHRydW5jYXRlLTMyIGFsZ29yaXRobSBhcyB0aGUgUHl0aG9uIG1hcHBlcnNcbiAqIHNvIHJlLXN5bmNzIHVwc2VydCB0aGUgc2FtZSByZXNvdXJjZSBpbnN0ZWFkIG9mIGNyZWF0aW5nIGR1cGxpY2F0ZXMuXG4gKlxuICogVXNlcyBganMtc2hhMWAgKHB1cmUgSlMpIGluc3RlYWQgb2YgYG5vZGU6Y3J5cHRvYCBzbyB0aGUgc2FtZSBtYXBwZXJcbiAqIGNvZGUgcnVucyB1bm1vZGlmaWVkIGluIHRoZSBDaHJvbWUgZXh0ZW5zaW9uJ3MgbG9jYWwtb25seSBtb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhYmxlSWQocGF0aWVudElkOiBzdHJpbmcsIC4uLnBhcnRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGNvbnN0IGtleSA9IFtwYXRpZW50SWQsIC4uLnBhcnRzXS5qb2luKFwifFwiKTtcbiAgcmV0dXJuIHNoYTEoa2V5KS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIwNzQwODY2YCBcdTIxOTIgYFAxMjA3NCoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBBbGxlcmd5SW50b2xlcmFuY2UgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9hbGxlcmd5LnB5YC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBBTExPV0VEX0NBVEVHT1JJRVMgPSBuZXcgU2V0KFtcIm1lZGljYXRpb25cIiwgXCJmb29kXCIsIFwiZW52aXJvbm1lbnRcIiwgXCJiaW9sb2dpY1wiXSk7XG5jb25zdCBBTExPV0VEX0NSSVRJQ0FMSVRZID0gbmV3IFNldChbXCJoaWdoXCIsIFwibG93XCIsIFwidW5hYmxlLXRvLWFzc2Vzc1wiXSk7XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJyeG5vcm1cIikpIHJldHVybiBcImh0dHA6Ly93d3cubmxtLm5paC5nb3YvcmVzZWFyY2gvdW1scy9yeG5vcm1cIjtcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0FMTEVSR0VOX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBBbGxlcmd5SW50b2xlcmFuY2UoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBBbGxlcmdlblwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5yZWNvcmRlZF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBwYXRpZW50OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgdmVyaWZpY2F0aW9uU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS12ZXJpZmljYXRpb25cIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgY2F0ZWdvcnkgPSByYXcuY2F0ZWdvcnkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ0FURUdPUklFUy5oYXMoY2F0ZWdvcnkpKSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbY2F0ZWdvcnldO1xuICB9XG5cbiAgY29uc3QgY3JpdGljYWxpdHkgPSByYXcuY3JpdGljYWxpdHkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ1JJVElDQUxJVFkuaGFzKGNyaXRpY2FsaXR5KSkge1xuICAgIHJlc291cmNlLmNyaXRpY2FsaXR5ID0gY3JpdGljYWxpdHk7XG4gIH1cblxuICBpZiAocmF3LnJlY29yZGVkX2RhdGUpIHtcbiAgICByZXNvdXJjZS5yZWNvcmRlZERhdGUgPSBgJHtyYXcucmVjb3JkZWRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgcmVhY3Rpb25Ob3RlID0gcmF3LnJlYWN0aW9uID8/IFwiXCI7XG4gIGlmIChyZWFjdGlvbk5vdGUpIHtcbiAgICByZXNvdXJjZS5yZWFjdGlvbiA9IFt7IGRlc2NyaXB0aW9uOiByZWFjdGlvbk5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBDb25kaXRpb24gbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9jb25kaXRpb24ucHlgLiBJbmNsdWRlcyB0aGUgSUNELTEwLUNNXG4gKiBub3JtYWxpc2VyIChUV05ISUZISVIgUm91bmQtMyBmaXgpIHdoaWNoIGluc2VydHMgdGhlIGNhbm9uaWNhbCBkb3RcbiAqIGJhY2sgaW50byBOSEkncyB1bi1kb3R0ZWQgY29kZXMgKFwiRTExMjJcIiBcdTIxOTIgXCJFMTEuMjJcIikuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuLy8gSUNELTEwLUNNIGNhbm9uaWNhbCBmb3JtIGlzICdYWFguWVlZW0EtWl0nIChjYXRlZ29yeSAzIGNoYXJzICsgb3B0aW9uYWxcbi8vIGRvdCArIHN1YmRpdmlzaW9uICsgb3B0aW9uYWwgN3RoLWNoYXJhY3RlciBleHRlbnNpb24pLiBOSEkgXHU1MDY1XHU0RkREIHNlbmRzXG4vLyBjb2RlcyBXSVRIT1VUIHRoZSBkb3QgKCdFMTEyMicsICdNNDc4OTInLCAnUzA5OTNYQScsICdNMTkyNzEnKS5cbi8vIFZhbGlkYXRvciByZWplY3RzIHVuLWRvdHRlZCBjb2RlcyBhcyAnVW5rbm93biBjb2RlJy5cbmNvbnN0IElDRDEwX0NBVEVHT1JZX1JFID0gL15bQS1aXVswLTlBLVpdezJ9JC87XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBkb3QgYmFjayBpbnRvIE5ISSdzIG5vLWRvdCBJQ0QtMTAtQ00gY29kZXMuXG4gKiAgIEUxMTIyICAgIFx1MjE5MiBFMTEuMjJcbiAqICAgTTQ3ODkyICAgXHUyMTkyIE00Ny44OTJcbiAqICAgUzA5OTNYQSAgXHUyMTkyIFMwOS45M1hBXG4gKiAgIEUxMSAgICAgIFx1MjE5MiBFMTEgICAgICAgIChubyBzdWJkaXZpc2lvbjsgcGFzcyB0aHJvdWdoKVxuICogICBFMTEuMjIgICBcdTIxOTIgRTExLjIyICAgICAoYWxyZWFkeSBkb3R0ZWQ7IHBhc3MgdGhyb3VnaClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUljZDEwQ20oY29kZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghY29kZSB8fCBjb2RlLmluY2x1ZGVzKFwiLlwiKSkgcmV0dXJuIGNvZGUgPz8gXCJcIjtcbiAgY29uc3QgcyA9IGNvZGUudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG4gIGlmIChzLmxlbmd0aCA8PSAzKSByZXR1cm4gcztcbiAgY29uc3QgaGVhZCA9IHMuc2xpY2UoMCwgMyk7XG4gIGNvbnN0IHRhaWwgPSBzLnNsaWNlKDMpO1xuICBpZiAoSUNEMTBfQ0FURUdPUllfUkUudGVzdChoZWFkKSkge1xuICAgIHJldHVybiBgJHtoZWFkfS4ke3RhaWx9YDtcbiAgfVxuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZC0xMFwiKSB8fCBzLmluY2x1ZGVzKFwiaWNkMTBcIikpIHtcbiAgICAvLyBOSEkgXHU1MDY1XHU0RkREIGNvZGVzIGFyZSBJQ0QtMTAtQ00gKFVTL1RhaXdhbiBleHRlbmRlZCBzZXQgXHUyMDE0IGUuZy5cbiAgICAvLyBFMTEuMjIpLiBUaGUgYmFzZSBJQ0QtMTAgVmFsdWVTZXQgcmVqZWN0cyB0aGVzZSBhcyAnVW5rbm93biBjb2RlJy5cbiAgICByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfQ007XG4gIH1cbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0NPTkRJVElPTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQ29uZGl0aW9uKHJhdzogUmVjb3JkPHN0cmluZywgYW55PiwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkNvbmRpdGlvblwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIHJhdy5jb2RlID8/IFwiXCIsIHJhdy5vbnNldF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IHJhdy5jbGluaWNhbF9zdGF0dXMgPz8gXCJhY3RpdmVcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB2ZXJpZmljYXRpb25TdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLXZlci1zdGF0dXNcIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQ29uZGl0aW9uXCI7XG4gIGxldCBjb2RlID0gcmF3LmNvZGUgYXMgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG4gIGlmIChzeXN0ZW0gPT09IHN5c3RlbXMuSUNEXzEwX0NNICYmIGNvZGUpIHtcbiAgICBjb2RlID0gbm9ybWFsaXplSWNkMTBDbShjb2RlKTtcbiAgfVxuICByZXNvdXJjZS5jb2RlID0ge1xuICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgdGV4dDogZGlzcGxheSxcbiAgfTtcblxuICBjb25zdCBzZXZlcml0eSA9IHJhdy5zZXZlcml0eSA/PyBcIlwiO1xuICBpZiAoc2V2ZXJpdHkpIHtcbiAgICByZXNvdXJjZS5zZXZlcml0eSA9IHsgdGV4dDogc2V2ZXJpdHkgfTtcbiAgfVxuXG4gIGlmIChyYXcub25zZXRfZGF0ZSkge1xuICAgIHJlc291cmNlLm9uc2V0RGF0ZVRpbWUgPSBgJHtyYXcub25zZXRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogRGlhZ25vc3RpY1JlcG9ydCBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2RpYWdub3N0aWNfcmVwb3J0LnB5YC4gUmV0dXJucyBudWxsIGZvclxuICogbGlzdC1wYWdlIHJvd3MgbGFja2luZyBhIGNvbmNsdXNpb24sIGFuZCBmb3IgbGFiLXZhbHVlLW9ubHkgXCJyZXBvcnRzXCJcbiAqIHRoYXQgd291bGQgZHVwbGljYXRlIGEgcHJvcGVyIE9ic2VydmF0aW9uLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IFYyXzAwNzQgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjItMDA3NFwiO1xuXG5jb25zdCBDQVRFR09SWV9NQVA6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4gPSB7XG4gIExBQjogW1YyXzAwNzQsIFwiTEFCXCIsIFwiTGFib3JhdG9yeVwiXSxcbiAgUkFEOiBbVjJfMDA3NCwgXCJSQURcIiwgXCJSYWRpb2xvZ3lcIl0sXG4gIENBUjogW1YyXzAwNzQsIFwiQ0FSXCIsIFwiQ2FyZGlvbG9neVwiXSxcbiAgUEFUSDogW1YyXzAwNzQsIFwiUEFUXCIsIFwiUGF0aG9sb2d5XCJdLFxufTtcblxuLy8gTGFiLXJlc3VsdCBwYXR0ZXJucyB0aGF0IGxvb2sgbGlrZSBzaW5nbGUtdmFsdWUgbGFiIHJlYWRpbmdzIHJhdGhlclxuLy8gdGhhbiBhIG5hcnJhdGl2ZSByZXBvcnQuXG5jb25zdCBMQUJfVU5JVF9SRSA9XG4gIC9cXGQrKD86XFwuXFxkKyk/XFxzKig/OiV8bWdcXC9kTHxnXFwvZEx8bW1vbFxcL0x8VVxcL0x8SVVcXC9MfG1JVVxcL0x8bmdcXC9tTHxcdTAzQkNnXFwvZEx8dWdcXC9kTHxwZ1xcL21MfGZMfFxcL3VMfDEwXFxeP1xcZCtcXC91THx4MTBcXF4/XFxkK1xcL3VMfHNlY3xcdTc5RDJ8Y29waWVzXFwvbUwpLztcblxuZnVuY3Rpb24gbG9va3NMaWtlTGFiVmFsdWVPbmx5KGNvbmNsdXNpb246IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAoIWNvbmNsdXNpb24pIHJldHVybiB0cnVlO1xuICBjb25zdCB0ZXh0ID0gY29uY2x1c2lvbi50cmltKCk7XG4gIC8vIFJlYWwgbmFycmF0aXZlIHJlcG9ydHMgYWxtb3N0IGFsd2F5cyBjb250YWluIG11bHRpcGxlIHNlbnRlbmNlcy5cbiAgaWYgKHRleHQubGVuZ3RoID4gMTAwKSByZXR1cm4gZmFsc2U7XG4gIC8vIFNpbmdsZSB2YWx1ZSBwYXR0ZXJuICsgcGFyZW50aGV0aWNhbCByZWZlcmVuY2UgcmFuZ2UgPSBsYWIgbGluZS5cbiAgaWYgKExBQl9VTklUX1JFLnRlc3QodGV4dCkpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBEaWFnbm9zdGljUmVwb3J0KFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBjb25jbHVzaW9uID0gKChyYXcuY29uY2x1c2lvbiA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBjYXRLZXlSYXcgPSBTdHJpbmcocmF3LmNhdGVnb3J5ID8/IFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gIGlmIChjYXRLZXlSYXcgPT09IFwiTEFCXCIgJiYgbG9va3NMaWtlTGFiVmFsdWVPbmx5KGNvbmNsdXNpb24pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgPz8gXCJVbmtub3duIFJlcG9ydFwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbUhpbnQgPSByYXcuc3lzdGVtID8/IFwiXCI7XG4gIGNvbnN0IHN5c3RlbSA9XG4gICAgdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgJiYgc3lzdGVtSGludC50b1VwcGVyQ2FzZSgpID09PSBcIkxPSU5DXCJcbiAgICAgID8gc3lzdGVtcy5MT0lOQ1xuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9SRVBPUlRfQ09ERTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3LmRhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogcmF3LnN0YXR1cyA/PyBcImZpbmFsXCIsXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICAgIGNvbmNsdXNpb24sXG4gIH07XG5cbiAgY29uc3QgY2F0RW50cnkgPSBDQVRFR09SWV9NQVBbY2F0S2V5UmF3XTtcbiAgaWYgKGNhdEVudHJ5KSB7XG4gICAgY29uc3QgW2NhdFN5cywgY2F0Q29kZSwgY2F0RGlzcGxheV0gPSBjYXRFbnRyeTtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFt7IGNvZGluZzogW3sgc3lzdGVtOiBjYXRTeXMsIGNvZGU6IGNhdENvZGUsIGRpc3BsYXk6IGNhdERpc3BsYXkgfV0gfV07XG4gIH1cblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKHJhdy5pc3N1ZWQpIHtcbiAgICByZXNvdXJjZS5pc3N1ZWQgPSBgJHtyYXcuaXNzdWVkfVQwMDowMDowMCswODowMGA7XG4gIH0gZWxzZSBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5pc3N1ZWQgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2UucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBFbmNvdW50ZXIgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9lbmNvdW50ZXIucHlgLiBTdGFibGUgSUQgaW5jbHVkZXMgaG9zcGl0YWxcbiAqIHNvIHNhbWUtZGF5IHZpc2l0cyB0byBkaWZmZXJlbnQgaW5zdGl0dXRpb25zIGVhY2ggZ2V0IHRoZWlyIG93blxuICogRW5jb3VudGVyICh0aGUgcG9zdC1tYXBwaW5nIGxpbmtlciBkZXBlbmRzIG9uIHRoaXMpLlxuICovXG5cbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBBQ1RDT0RFX1NZU1RFTSA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92My1BY3RDb2RlXCI7XG5cbmNvbnN0IENMQVNTX01BUDogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgQU1COiBbQUNUQ09ERV9TWVNURU0sIFwiQU1CXCIsIFwiYW1idWxhdG9yeVwiXSxcbiAgSU1QOiBbQUNUQ09ERV9TWVNURU0sIFwiSU1QXCIsIFwiaW5wYXRpZW50IGVuY291bnRlclwiXSxcbiAgRU1FUjogW0FDVENPREVfU1lTVEVNLCBcIkVNRVJcIiwgXCJlbWVyZ2VuY3lcIl0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWFwRW5jb3VudGVyKHJhdzogUmVjb3JkPHN0cmluZywgYW55PiwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZW5jQ2xhc3MgPSBTdHJpbmcocmF3LmNsYXNzID8/IFwiQU1CXCIpLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGNsYXNzRW50cnkgPSBDTEFTU19NQVBbZW5jQ2xhc3NdID8/IENMQVNTX01BUC5BTUIhO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJFbmNvdW50ZXJcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCByYXcuZGF0ZSA/PyBcIlwiLCBlbmNDbGFzcywgKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCkpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluaXNoZWRcIixcbiAgICBjbGFzczoge1xuICAgICAgc3lzdGVtOiBjbGFzc0VudHJ5WzBdLFxuICAgICAgY29kZTogY2xhc3NFbnRyeVsxXSxcbiAgICAgIGRpc3BsYXk6IGNsYXNzRW50cnlbMl0sXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIC8vIE5ISSdzIGVuY291bnRlciBcInR5cGVcIiBtYXJrZXJzIFx1MjAxNCAnSUNcdTUzNjFcdThDQzdcdTY1OTknIC8gJ1x1NzUzM1x1NTgzMVx1OENDN1x1NjU5OScgLyAnXHU0RjRGXHU5NjYyJ1xuICAvLyBcdTIwMTQgYXJlIGRhdGEtb3JpZ2luIGxhYmVscywgbm90IFNOT01FRCBjbGluaWNhbCB0eXBlcy4gS2VlcCB0aGVtIGFzXG4gIC8vIENvZGVhYmxlQ29uY2VwdC50ZXh0IHdpdGhvdXQgY2xhaW1pbmcgU05PTUVELlxuICBjb25zdCB0eXBlRGlzcGxheSA9ICgocmF3LnR5cGVfZGlzcGxheSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKHR5cGVEaXNwbGF5KSB7XG4gICAgcmVzb3VyY2UudHlwZSA9IFt7IHRleHQ6IHR5cGVEaXNwbGF5IH1dO1xuICB9XG5cbiAgY29uc3QgcGVyaW9kOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGlmIChyYXcuZGF0ZSkgcGVyaW9kLnN0YXJ0ID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKHJhdy5lbmRfZGF0ZSkgcGVyaW9kLmVuZCA9IGAke3Jhdy5lbmRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAoT2JqZWN0LmtleXMocGVyaW9kKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UucGVyaW9kID0gcGVyaW9kO1xuICB9XG5cbiAgY29uc3QgZGVwYXJ0bWVudCA9IHJhdy5kZXBhcnRtZW50ID8/IFwiXCI7XG4gIGNvbnN0IHByb3ZpZGVyID0gcmF3LnByb3ZpZGVyID8/IFwiXCI7XG4gIGlmIChkZXBhcnRtZW50IHx8IHByb3ZpZGVyKSB7XG4gICAgY29uc3QgcGFydGljaXBhbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAocHJvdmlkZXIpIHBhcnRpY2lwYW50LmluZGl2aWR1YWwgPSB7IGRpc3BsYXk6IHByb3ZpZGVyIH07XG4gICAgcmVzb3VyY2UucGFydGljaXBhbnQgPSBPYmplY3Qua2V5cyhwYXJ0aWNpcGFudCkubGVuZ3RoID4gMCA/IFtwYXJ0aWNpcGFudF0gOiBbXTtcbiAgICBpZiAoZGVwYXJ0bWVudCkge1xuICAgICAgcmVzb3VyY2Uuc2VydmljZVR5cGUgPSB7IHRleHQ6IGRlcGFydG1lbnQgfTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5zZXJ2aWNlUHJvdmlkZXIgPSB7IGRpc3BsYXk6IGhvc3BpdGFsIH07XG4gIH1cblxuICBjb25zdCByZWFzb24gPSByYXcucmVhc29uID8/IFwiXCI7XG4gIGlmIChyZWFzb24pIHtcbiAgICByZXNvdXJjZS5yZWFzb25Db2RlID0gW3sgdGV4dDogcmVhc29uIH1dO1xuICB9XG5cbiAgY29uc3QgZGlzY2hhcmdlID0gcmF3LmRpc2NoYXJnZV9kaXNwb3NpdGlvbiA/PyBcIlwiO1xuICBpZiAoZGlzY2hhcmdlKSB7XG4gICAgcmVzb3VyY2UuaG9zcGl0YWxpemF0aW9uID0geyBkaXNjaGFyZ2VEaXNwb3NpdGlvbjogeyB0ZXh0OiBkaXNjaGFyZ2UgfSB9O1xuICB9XG5cbiAgY29uc3QgY2xpbmljYWxOb3RlID0gKChyYXcuY2xpbmljYWxfbm90ZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGNsaW5pY2FsTm90ZSkge1xuICAgIHJlc291cmNlLm5vdGUgPSBbeyB0ZXh0OiBjbGluaWNhbE5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBNZWRpY2F0aW9uUmVxdWVzdCBtYXBwZXIgKyBiaWxpbmd1YWwgZGVkdXBsaWNhdGlvbi5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvbWVkaWNhdGlvbi5weWAuIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgcmVwb3J0cyB0aGVcbiAqIFNBTUUgcHJlc2NyaXB0aW9uIG11bHRpcGxlIHRpbWVzIChFbmdsaXNoLW9ubHkgLyBFbmcrXHU0RTJEIC8gXHU0RTJEK0VuZykuXG4gKiBgbWFwTWVkaWNhdGlvbnNEZWR1cGAgY29sbGFwc2VzIHRoZXNlIHRvIG9uZSBNZWRpY2F0aW9uUmVxdWVzdCBwZXJcbiAqIChkYXRlLCBjYW5vbmljYWwtZHJ1Zy1rZXkpLCBwcmVmZXJyaW5nIHRoZSBmb3JtIHdpdGggbW9yZSBDSksgY2hhcnNcbiAqIChjbGluaWNpYW5zIHJlYWQgXHU1NTQ2XHU1NEMxXHU1NDBEIGZpcnN0KS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZUljZDEwQ20gfSBmcm9tIFwiLi9jb25kaXRpb25cIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5mdW5jdGlvbiBpc0NqayhjaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFx1NEUwMCAoVSs0RTAwKSB0byBcdTlGRkYgKFUrOUZGRikgY292ZXJzIENKSyBVbmlmaWVkIElkZW9ncmFwaHMuXG4gIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgcmV0dXJuIGNwID49IDB4NGUwMCAmJiBjcCA8PSAweDlmZmY7XG59XG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2YgcykgaWYgKGlzQ2prKGNoKSkgbisrO1xuICByZXR1cm4gbjtcbn1cblxuLyoqXG4gKiBNYXRjaCBhIFwibG9uZ1wiIEVuZ2xpc2ggY2h1bmsgKFx1MjI2NTQgY2hhcnMgb2YgQS1aLzAtOS9wdW5jdHVhdGlvbiBjb21tb25cbiAqIHRvIGRydWcgbmFtZXMpLiBBdm9pZCBtYXRjaGluZyBzaG9ydCB0b2tlbnMgbGlrZSBcIkRcIiBvciBcIlBPXCIgdGhhdFxuICogYXBwZWFyIGluc2lkZSBDaGluZXNlIG5hbWVzLlxuICovXG5jb25zdCBFTl9DSFVOS19HID0gL1tBLVpdW0EtWjAtOS4lL1xcLVwiJ1xcc117Myx9L2c7XG5cbi8qKlxuICogUmVkdWNlIGEgZHJ1Zy1uYW1lIHN0cmluZyB0byBhIHN0YWJsZSBjYW5vbmljYWwga2V5LiBFeHRyYWN0IHRoZVxuICogbG9uZ2VzdCBFbmdsaXNoIGZyYWdtZW50LCB0aGVuIHRydW5jYXRlIGF0IGNvbW1vbiBzZXBhcmF0b3JzIHNvIGFcbiAqIG5hbWUgd2l0aCBleHRyYSB0cmFpbGluZyBtb2RpZmllcnMgc3RpbGwgY29sbGFwc2VzIHRvIGJyYW5kK3N0cmVuZ3RoLlxuICpcbiAqIEV4YW1wbGVzIChhbGwgbWFwIHRvIFwidGltb3B0b2wgeGUgMC41JSBvcGh0aGFsbWljIHNvbHV0aW9uXCIpOlxuICogICBcIlRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTlwiXG4gKiAgIFwiVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OIChcdTk3NTJcdTc3M0NcdTk3MzJcdTIwMjYpXCJcbiAqICAgXCJcdTk3NTJcdTc3M0NcdTk3MzJcdTIwMjYgKFRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTilcIlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsRHJ1Z0tleShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IChuYW1lID8/IFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGNodW5rcyA9IFsuLi5zLm1hdGNoQWxsKEVOX0NIVU5LX0cpXS5tYXAoKG0pID0+IG1bMF0pO1xuICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAobmFtZSA/PyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuICBsZXQgbG9uZ2VzdCA9IGNodW5rcy5yZWR1Y2UoKGEsIGIpID0+IChiLmxlbmd0aCA+IGEubGVuZ3RoID8gYiA6IGEpKS50cmltKCk7XG4gIGZvciAoY29uc3Qgc2VwIG9mIFtcIiAtIFwiLCBcIiBcdTIwMTMgXCIsIFwiIC8gXCJdKSB7XG4gICAgaWYgKGxvbmdlc3QuaW5jbHVkZXMoc2VwKSkge1xuICAgICAgbG9uZ2VzdCA9IGxvbmdlc3Quc3BsaXQoc2VwKVswXSE7XG4gICAgfVxuICB9XG4gIHJldHVybiBsb25nZXN0LnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiAqIEJlc3QtZWZmb3J0IGFjdGl2ZSB2cyBjb21wbGV0ZWQgZGVjaXNpb24gZm9yIGEgTWVkaWNhdGlvblJlcXVlc3QuXG4gKiBBY3RpdmUgd2hpbGUgKGF1dGhvcmVkX2RhdGUgKyBkdXJhdGlvbiA+IHRvZGF5KTsgb3RoZXJ3aXNlIGNvbXBsZXRlZC5cbiAqIE1pc3NpbmcgZHVyYXRpb24gXHUyMTkyIGFzc3VtZSA5MC1kYXkgcmVmaWxsIHdpbmRvdyAoTkhJJ3MgdHlwaWNhbCBjYWRlbmNlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lZFN0YXR1cyhcbiAgYXV0aG9yZWRJc286IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGR1cmF0aW9uRGF5czogYW55LFxuKTogXCJhY3RpdmVcIiB8IFwiY29tcGxldGVkXCIge1xuICBpZiAoIWF1dGhvcmVkSXNvKSByZXR1cm4gXCJjb21wbGV0ZWRcIjtcbiAgY29uc3QgZGF0ZVBhcnQgPSBTdHJpbmcoYXV0aG9yZWRJc28pLnNsaWNlKDAsIDEwKTtcbiAgY29uc3QgcGFyc2VkID0gbmV3IERhdGUoYCR7ZGF0ZVBhcnR9VDAwOjAwOjAwWmApO1xuICBpZiAoTnVtYmVyLmlzTmFOKHBhcnNlZC5nZXRUaW1lKCkpKSByZXR1cm4gXCJjb21wbGV0ZWRcIjtcblxuICBsZXQgZGF5czogbnVtYmVyIHwgbnVsbDtcbiAgaWYgKGR1cmF0aW9uRGF5cyA9PT0gbnVsbCB8fCBkdXJhdGlvbkRheXMgPT09IHVuZGVmaW5lZCB8fCBkdXJhdGlvbkRheXMgPT09IFwiXCIpIHtcbiAgICBkYXlzID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBuID0gTnVtYmVyLnBhcnNlSW50KFN0cmluZyhkdXJhdGlvbkRheXMpLCAxMCk7XG4gICAgZGF5cyA9IE51bWJlci5pc0Zpbml0ZShuKSA/IG4gOiBudWxsO1xuICB9XG4gIGlmIChkYXlzID09PSBudWxsKSBkYXlzID0gOTA7XG5cbiAgY29uc3QgZW5kID0gbmV3IERhdGUocGFyc2VkLmdldFRpbWUoKSk7XG4gIGVuZC5zZXRVVENEYXRlKGVuZC5nZXRVVENEYXRlKCkgKyBkYXlzKTtcbiAgLy8gQ29tcGFyZSBkYXRlLW9ubHkgKHRvZGF5IGluIFVUQyBzaW5jZSB3ZSBhdXRob3JlZElzbyBpcyBkYXRlLW9ubHkpLlxuICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gIHRvZGF5LnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICByZXR1cm4gZW5kID49IHRvZGF5ID8gXCJhY3RpdmVcIiA6IFwiY29tcGxldGVkXCI7XG59XG5cbi8qKlxuICogQ29udmVydCBvbmUgc2NyYXBlZCBwcmVzY3JpcHRpb24gZGljdCBcdTIxOTIgRkhJUiBSNCBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqIFJldHVybnMgbnVsbCB3aGVuIHJhdyBoYXMgbm8gYGRydWdfbmFtZWAgKGNhbGxlciBmaWx0ZXJzIG91dCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBNZWRpY2F0aW9uUmVxdWVzdChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZHJ1Z05hbWUgPSAoKHJhdy5kcnVnX25hbWUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghZHJ1Z05hbWUpIHJldHVybiBudWxsO1xuXG4gIC8vIENhbm9uaWNhbCBrZXkgKG5vdCByYXcgZHJ1Z19uYW1lKSBmb3Igc3RhYmxlIGlkIHNvIHRoZSB0aHJlZSBOSElcbiAgLy8gXHU0RTJEXHU4MkYxIHZhcmlhbnRzIG9mIHRoZSBzYW1lIGRydWcgY29sbGFwc2UgdG8gb25lIEZISVIgcmVzb3VyY2UuXG4gIGNvbnN0IG1lZElkID0gc3RhYmxlSWQocGF0aWVudElkLCBjYW5vbmljYWxEcnVnS2V5KGRydWdOYW1lKSwgcmF3LmRhdGUgPz8gXCJcIik7XG5cbiAgY29uc3QgZHJ1Z0NvZGUgPSAoKHJhdy5jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCBjb2Rpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgc3lzdGVtOiBkcnVnQ29kZSA/IHN5c3RlbXMuTkhJX0RSVUdfQ09ERSA6IHN5c3RlbXMuSElTX0xPQ0FMX01FRElDQVRJT05fQ09ERSxcbiAgICBjb2RlOiBkcnVnQ29kZSB8fCBkcnVnTmFtZSxcbiAgICBkaXNwbGF5OiBkcnVnTmFtZSxcbiAgfTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiTWVkaWNhdGlvblJlcXVlc3RcIixcbiAgICBpZDogbWVkSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogbWVkU3RhdHVzKHJhdy5kYXRlID8/IFwiXCIsIHJhdy5kdXJhdGlvbl9kYXlzKSxcbiAgICBpbnRlbnQ6IFwib3JkZXJcIixcbiAgICBtZWRpY2F0aW9uQ29kZWFibGVDb25jZXB0OiB7XG4gICAgICBjb2Rpbmc6IFtjb2RpbmddLFxuICAgICAgdGV4dDogZHJ1Z05hbWUsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmF1dGhvcmVkT24gPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgZHJ1Z0NsYXNzID0gKChyYXcuZHJ1Z19jbGFzcyA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGRydWdDbGFzcykge1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW3sgdGV4dDogZHJ1Z0NsYXNzIH1dO1xuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2UucmVxdWVzdGVyID0geyBkaXNwbGF5OiBob3NwaXRhbCB9O1xuICB9XG5cbiAgLy8gRG9zYWdlIFx1MjAxNCBvbmx5IHdoZW4gc291cmNlIGFjdHVhbGx5IGhhcyBpdC4gTkhJJ3MgbWVkaWNhdGlvbi1saXN0XG4gIC8vIGVuZHBvaW50IHByb3ZpZGVzIG5vbmUgb2YgdGhlc2U7IG90aGVyIEhJUyBhZGFwdGVycyBnZXQgYVxuICAvLyBzdHJ1Y3R1cmVkIGRvc2FnZSBvdXQuXG4gIGNvbnN0IGRvc2FnZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBrIG9mIFtcImRvc2VcIiwgXCJ1bml0XCIsIFwiZnJlcXVlbmN5XCJdIGFzIGNvbnN0KSB7XG4gICAgaWYgKHJhd1trXSkgcGFydHMucHVzaChTdHJpbmcocmF3W2tdKSk7XG4gIH1cbiAgaWYgKHBhcnRzLmxlbmd0aCA+IDApIHtcbiAgICBkb3NhZ2UudGV4dCA9IHBhcnRzLmpvaW4oXCIgXCIpO1xuICB9XG4gIGlmIChyYXcucm91dGUpIHtcbiAgICBkb3NhZ2Uucm91dGUgPSB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vc25vbWVkLmluZm8vc2N0XCIsIGRpc3BsYXk6IHJhdy5yb3V0ZSB9XSxcbiAgICB9O1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkb3NhZ2UpLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5kb3NhZ2VJbnN0cnVjdGlvbiA9IFtkb3NhZ2VdO1xuICB9XG5cbiAgLy8gZGlzcGVuc2VSZXF1ZXN0IHdpdGggcXVhbnRpdHkgKyBzdXBwbHkgZHVyYXRpb24gd2hlbiBwcmVzZW50LlxuICBjb25zdCBkcjogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICBjb25zdCBxdHlSYXcgPSByYXcucXVhbnRpdHk7XG4gIGlmIChxdHlSYXcgIT09IG51bGwgJiYgcXR5UmF3ICE9PSB1bmRlZmluZWQgJiYgcXR5UmF3ICE9PSBcIlwiKSB7XG4gICAgY29uc3QgcXR5TnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHF0eVJhdykucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShxdHlOdW0pKSB7XG4gICAgICBkci5xdWFudGl0eSA9IHsgdmFsdWU6IHF0eU51bSB9O1xuICAgIH1cbiAgfVxuICBpZiAocmF3LmR1cmF0aW9uX2RheXMpIHtcbiAgICBjb25zdCBkYXlzID0gTnVtYmVyLnBhcnNlSW50KFN0cmluZyhyYXcuZHVyYXRpb25fZGF5cyksIDEwKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRheXMpKSB7XG4gICAgICBkci5leHBlY3RlZFN1cHBseUR1cmF0aW9uID0ge1xuICAgICAgICB2YWx1ZTogZGF5cyxcbiAgICAgICAgdW5pdDogXCJkYXlzXCIsXG4gICAgICAgIHN5c3RlbTogXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCIsXG4gICAgICAgIGNvZGU6IFwiZFwiLFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKGRyKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UuZGlzcGVuc2VSZXF1ZXN0ID0gZHI7XG4gIH1cblxuICBjb25zdCBpbmRpY2F0aW9uID0gKChyYXcuaW5kaWNhdGlvbiA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgaW5kaWNhdGlvbkNvZGUgPSAoKHJhdy5pbmRpY2F0aW9uX2NvZGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChpbmRpY2F0aW9uIHx8IGluZGljYXRpb25Db2RlKSB7XG4gICAgY29uc3QgcmM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAoaW5kaWNhdGlvbkNvZGUpIHtcbiAgICAgIHJjLmNvZGluZyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogc3lzdGVtcy5JQ0RfMTBfQ00sXG4gICAgICAgICAgY29kZTogbm9ybWFsaXplSWNkMTBDbShpbmRpY2F0aW9uQ29kZSksXG4gICAgICAgICAgZGlzcGxheTogaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uQ29kZSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICAgIGlmIChpbmRpY2F0aW9uKSB7XG4gICAgICByYy50ZXh0ID0gaW5kaWNhdGlvbkNvZGUgPyBgJHtpbmRpY2F0aW9uQ29kZX0gJHtpbmRpY2F0aW9ufWAudHJpbSgpIDogaW5kaWNhdGlvbjtcbiAgICB9XG4gICAgcmVzb3VyY2UucmVhc29uQ29kZSA9IFtyY107XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8qKlxuICogR3JvdXAtYXdhcmUgbWVkaWNhdGlvbiBtYXBwZXIgdGhhdCBkZWR1cGVzIFx1NEUyRFx1ODJGMSBcdTk2RDlcdThBOUUgZHVwbGljYXRlcy5cbiAqXG4gKiBTdHJhdGVneTpcbiAqICAgMS4gQ29tcHV0ZSBjYW5vbmljYWwga2V5IHBlciBkcnVnIG5hbWUgKGxvbmdlc3QgRW5nbGlzaCBjaHVuaykuXG4gKiAgIDIuIEdyb3VwIGJ5IChkYXRlLCBjYW5vbmljYWxfa2V5KS4gS2VlcCBPTkUgZW50cnkgcGVyIGdyb3VwLFxuICogICAgICBwcmVmZXJyaW5nIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmRcbiAqICAgICAgbmFtZSBcdTIwMTQgY2xpbmljaWFucyBzY2FuIEVuZ2xpc2ggZmlyc3QpLlxuICogICAzLiBNYXAgZWFjaCBrZXB0IGVudHJ5IHRocm91Z2ggbWFwTWVkaWNhdGlvblJlcXVlc3QuXG4gKlxuICogTm90ZTogUHl0aG9uIGNvbW1lbnQgc2F5cyBcIm1vcmUgQ0pLXCIgYnV0IHRoZSBjb2RlIHVzZXMgYDxgIChmZXdlcik7XG4gKiB3ZSBwcmVzZXJ2ZSB0aGUgYWN0dWFsIGNvZGUgYmVoYXZpb3VyIHRvIGtlZXAgcGFyaXR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTWVkaWNhdGlvbnNEZWR1cChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBkcnVnTmFtZSA9ICgoaXRlbS5kcnVnX25hbWUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gICAgaWYgKCFkcnVnTmFtZSkgY29udGludWU7XG4gICAgY29uc3QgZGF0ZVBhcnQgPSAoKGl0ZW0uZGF0ZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnNsaWNlKDAsIDEwKTtcbiAgICBjb25zdCBrZXkgPSBgJHtkYXRlUGFydH18JHtjYW5vbmljYWxEcnVnS2V5KGRydWdOYW1lKX1gO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQcmVmZXIgdGhlIGZvcm0gd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBicmFuZCBuYW1lKS5cbiAgICAgIGlmIChjamtDaGFycyhkcnVnTmFtZSkgPCBjamtDaGFycyhleGlzdGluZy5kcnVnX25hbWUgPz8gXCJcIikpIHtcbiAgICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgbSA9IG1hcE1lZGljYXRpb25SZXF1ZXN0KGl0ZW0sIHBhdGllbnRJZCk7XG4gICAgaWYgKG0gIT09IG51bGwpIG91dC5wdXNoKG0pO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCAiLyoqXG4gKiBMT0lOQyBtYXBwaW5nIHRhYmxlcyBmb3IgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgTE9JTkMgUjQgY29kaW5ncy5cbiAqXG4gKiBQdXJlIGRhdGEsIG5vIGxvZ2ljLiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvX2xvaW5jX3RhYmxlcy5weWAuXG4gKi9cblxuLy8gXHUyNTAwXHUyNTAwIF9OSElfVE9fTE9JTkMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBwcmltYXJ5IExPSU5DIG1hcHBpbmcuIFNvdXJjZSBvZiB0cnV0aDpcbi8vIFRXTkhJRkhJUiBQQVMgSW1wbGVtZW50YXRpb24gR3VpZGUgQ29uY2VwdE1hcC1uaGktbG9pbmNcbi8vIGh0dHBzOi8vYnVpbGQuZmhpci5vcmcvaWcvVFdOSElGSElSL3Bhcy9Db25jZXB0TWFwLW5oaS1sb2luYy5odG1sXG4vL1xuLy8gVGhhdCBDb25jZXB0TWFwIGRlY2xhcmVzIDUzIE5ISSBjb2RlcyB3aXRoIGBlcXVpdmFsZW5jZTogcmVsYXRlZHRvYFxuLy8gYWdhaW5zdCA4MDYgTE9JTkMgdmFyaWFudHMgKGRpZmZlcmVudCBzcGVjaW1lbnMgLyB1bml0cyAvIG1ldGhvZHNcbi8vIHBlciBOSEkgY29kZSBcdTIwMTQgY29uZmlybWluZyB0aGUgXCJOSEkgaXMgY29hcnNlLCBMT0lOQyBpcyBmaW5lXCIgdmlldykuXG4vLyBGb3IgZWFjaCBOSEkgY29kZSB3ZSBoYW5kLXBpY2sgdGhlIGNhbm9uaWNhbCBMT0lOQyBtb3N0IGNsaW5pY2lhbnNcbi8vIHdvdWxkIGV4cGVjdCBpbiBhIFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBsYWIgcmVwb3J0OiBTZXJ1bS9QbGFzbWEgKyBNYXNzLXZvbHVtZVxuLy8gKG9yIGF1dG8tY291bnQgZm9yIGNlbGwgY291bnRlcnMpLiBFZGdlIGNhc2VzIG5vdGVkIGlubGluZS5cbmV4cG9ydCBjb25zdCBOSElfVE9fTE9JTkM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBIYWVtYXRvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwODAwMkNcIjogXCI2NjkwLTJcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4IFx1MjAxNCBMZXVrb2N5dGVzICMvdm9sIEJsb29kIEF1dG9cbiAgXCIwODAwM0NcIjogXCI3MTgtN1wiLCAvLyBcdTg4NDBcdTgyNzJcdTdEMjBcdTZBQTJcdTY3RTUgXHUyMDE0IEhlbW9nbG9iaW4gTWFzcy92b2wgQmxvb2RcbiAgXCIwODAwNkNcIjogXCI3NzctM1wiLCAvLyBcdTg4NDBcdTVDMEZcdTY3N0ZcdThBMDhcdTY1NzggXHUyMDE0IFBsYXRlbGV0cyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMTNDXCI6IFwiNTcwMjEtOFwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdTUyMDZcdTk4NUVcdThBMDhcdTY1NzggXHUyMDE0IENCQyBXIEF1dG8gRGlmZiBwYW5lbFxuICBcIjA4MTI4QlwiOiBcIjQ3Mjg2LTBcIiwgLy8gXHU5QUE4XHU5QUQzXHU3RDMwXHU4MERFXHU1RjYyXHU2MTRCXHU1MjI0XHU4QjgwXHU1NDA4XHU0Rjc1XHU3RDMwXHU4MERFXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4XG4gIC8vIFx1MjUwMFx1MjUwMCBDaGVtaXN0cnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMTFDXCI6IFwiMTc4NjEtNlwiLCAvLyBcdTkyMjMgXHUyMDE0IENhbGNpdW0gTWFzcy92b2wgUy9QXG4gIFwiMDkwMTVDXCI6IFwiMjE2MC0wXCIsIC8vIFx1ODA4Q1x1OTE3OFx1OTE1MFx1MzAwMVx1ODg0MCBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxNkNcIjogXCIyMTYxLThcIiwgLy8gXHU4MDhDXHU5MTUwXHUzMDAxXHU1QzNGIFx1MjAxNCBDcmVhdGluaW5lIE1hc3Mvdm9sIFVyaW5lXG4gIFwiMDkwMjVDXCI6IFwiMTkyMC04XCIsIC8vIEFTVC9HT1QgXHUyMDE0IEFzcGFydGF0ZSBhbWlub3RyYW5zZmVyYXNlIEFjdCBTL1BcbiAgXCIwOTAyNkNcIjogXCIxNzQyLTZcIiwgLy8gQUxUL0dQVCBcdTIwMTQgQWxhbmluZSBhbWlub3RyYW5zZmVyYXNlIEFjdCBTL1BcbiAgXCIwOTAyOUNcIjogXCIxOTc1LTJcIiwgLy8gXHU4MUJEXHU3RDA1XHU3RDIwXHU3RTNEXHU5MUNGIFx1MjAxNCBCaWxpcnViaW4gdG90YWwgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzBDXCI6IFwiMTk2OC03XCIsIC8vIFx1NzZGNFx1NjNBNVx1ODFCRFx1N0QwNVx1N0QyMCBcdTIwMTQgQmlsaXJ1YmluIGRpcmVjdCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzM0NcIjogXCIyNTMyLTBcIiwgLy8gXHU0RTczXHU5MTc4XHU4MTJCXHU2QzJCXHU4MTIyIFx1MjAxNCBMREggQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzhDXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RCBcdTIwMTQgQWxidW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTEzOENcIjogXCIzNTY3Mi01XCIsIC8vIFx1NzZGNFx1NjNBNS9cdTdFM0RcdTgxQkRcdTdEMDVcdTdEMjBcdTZCRDRcdTUwM0NcbiAgXCIxMjExMkJcIjogXCIxNzUxLTdcIiwgLy8gXHU3NjdEXHU4NkNCXHU3NjdEKFx1NTE0RFx1NzVBQlx1NkJENFx1NkZDMVx1NkNENSkgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMjQwMDdCXCI6IFwiMTk5NS0wXCIsIC8vIFx1ODg0MFx1NkYzRlx1NkUzOFx1OTZFMlx1OTIyMyBcdTIwMTQgQ2FsY2l1bSBpb25pemVkIE1vbGVzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEhvcm1vbmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTIxQ1wiOiBcIjI5ODYtOFwiLCAvLyBcdTc3NkFcdTRFMzhcdTkxNkZcdTkxODdcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IFRlc3Rvc3Rlcm9uZSBNYXNzL3ZvbCBTL1BcbiAgXCIyNzAyMUJcIjogXCIyOTkxLThcIiwgLy8gXHU3NzZBXHU0RTM4XHU4MTAyXHU5MTg3XHU2NTNFXHU1QzA0XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgRnJlZSBTL1BcbiAgLy8gMDkxMjVDIC8gMDkxMjdDIGNvcnJlY3RlZCBhZnRlciBkdWFsLXJldmlld2VyIGF1ZGl0IFx1MjAxNCB0aGUgZWFybGllclxuICAvLyB2YWx1ZXMgKDMwMTYtMyB3YXMgVFNILCAxMDUwMS01IHdhcyBMSCkgd2VyZSBqdXN0IHdyb25nIGNvcHktXG4gIC8vIHBhc3Rlcy4gU291cmNlIGZvciB0aGUgbmV3IHZhbHVlczogVFdOSElGSElSIFBBUyBDb25jZXB0TWFwLlxuICBcIjA5MTI1Q1wiOiBcIjgzMDk4LTRcIiwgLy8gXHU2RkZFXHU2Q0UxXHU1MjNBXHU2RkMwXHU3RDIwXHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBGb2xsaXRyb3BpbiAoRlNIKSBJbW11bm9hc3NheSBTL1BcbiAgXCIwOTEyN0NcIjogXCI4MzA5Ni04XCIsIC8vIFx1NEU4Q1x1NkMyQlx1NTdGQVx1NjYyNVx1NjBDNVx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRXN0cmFkaW9sIEltbXVub2Fzc2F5IFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVHVtb3IgbWFya2VycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjAwN0NcIjogXCIxODM0LTFcIiwgLy8gXHUwM0IxLVx1ODBDRVx1NTE1Mlx1ODZDQlx1NzY3RCAoQUZQKSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMjcwNDlDXCI6IFwiMTgzNC0xXCIsIC8vIFx1NzUzMi1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCwgUklBKVxuICBcIjEyMDgxQ1wiOiBcIjgzMTEyLTNcIiwgLy8gUFNBIChFSUEvTElBKSBcdTIwMTQgTWFzcy92b2wgUy9QIEltbXVub2Fzc2F5XG4gIFwiMTIxOThDXCI6IFwiODMxMTMtMVwiLCAvLyBGcmVlIFBTQSBcdTIwMTQgTWFzcy92b2wgUy9QIEltbXVub2Fzc2F5XG4gIFwiMjcwNTJDXCI6IFwiMjg1Ny0xXCIsIC8vIFx1NjUxRFx1OEI3N1x1ODE3QVx1NzI3OVx1NzU3MFx1NjI5N1x1NTM5RiAoUFNBKSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMjcwODNCXCI6IFwiMTA4ODYtMFwiLCAvLyBcdTZFMzhcdTk2RTJQU0EgKFJJQSlcbiAgXCIxMjA1MkJcIjogXCIxMDg3My04XCIsIC8vIFx1MDNCMjItXHU1RkFFXHU3NDAzXHU4NkNCXHU3NjdEXG4gIC8vIFx1MjUwMFx1MjUwMCBJbW11bm9sb2d5IC8gcHJvdGVpbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwNjVCXCI6IFwiOTA5OTEtMVwiLCAvLyBcdTg2Q0JcdTc2N0RcdTk2RkJcdTZDRjNcdTUyMDZcdTY3OTBcbiAgXCIxMjAyOEJcIjogXCIxNDAwMi0wXCIsIC8vIElnTSBcdTU1QUVcdTU0MTFcdTUxNERcdTc1QUJcdTY0RjRcdTY1NjNcbiAgXCIxMjAyOUJcIjogXCIxNDAwMi0wXCIsIC8vIElnTSBcdTUxNERcdTc1QUJcdTZCRDRcdTZGQzFcdTZDRDVcbiAgXCIxMjEwM0JcIjogXCI5NTgwMS03XCIsIC8vIFx1NTE0RFx1NzVBQlx1OTZGQlx1NkNGM1x1NTIwNlx1Njc5MFxuICBcIjEyMTYwQlwiOiBcIjE1MTg5LTRcIiwgLy8gSWdHIFx1MDNCQS9cdTAzQkJcbiAgXCIxMjE3MUJcIjogXCIxNzM1MS04XCIsIC8vIFx1NjI5N1x1NTVEQ1x1NEUyRFx1NjAyN1x1NzQwM1x1N0QzMFx1ODBERVx1OENFQVx1NjI5N1x1OUFENCAoQU5DQSlcbiAgXCIxMjIwNEJcIjogXCIyMDU4NC05XCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1ODg2OFx1OTc2Mlx1NkExOVx1OEExOFxuICBcIjI1MDEzQlwiOiBcIjQ0NTk2LTVcIiwgLy8gXHU4N0EyXHU1MTQ5XHU1MjA3XHU3MjQ3XHU2QUEyXHU2N0U1XG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTQwMzBDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzFDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzJDXCI6IFwiNTE5Ni0xXCIsIC8vIEhCc0FnIChNYXNzL3ZvbClcbiAgXCIxNDA1MUNcIjogXCIxMzk1NS0wXCIsIC8vIEhDViBBYlxuICBcIjI3MDMzQ1wiOiBcIjUxOTctOVwiLCAvLyBIQnNBZyBSSUFcbiAgLy8gXHUyNTAwXHUyNTAwIFBhdGhvbG9neSAvIGN5dG9sb2d5IC8gSUhDIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMTk1QlwiOiBcIjE4NDc0LTdcIiwgLy8gSGVyLTIvbmV1IElTSFxuICBcIjI3MDYxQlwiOiBcIjE0MTMwLTlcIiwgLy8gXHU1MkQ1XHU2MEM1XHU2RkMwXHU3RDIwXHU2M0E1XHU1M0Q3XHU5QUQ0IChFUilcbiAgXCIyNzA2MkJcIjogXCIxMDg2MS0zXCIsIC8vIFx1OUVDM1x1OUFENFx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoUFIpXG4gIFwiMzAxMDNCXCI6IFwiODMwNTItMVwiLCAvLyBQRC1MMSBJSENcbiAgLy8gXHUyNTAwXHUyNTAwIEF1ZGlvbG9neSAvIHB1bG1vbmFyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNzAwOUJcIjogXCIyNDM0MS0wXCIsIC8vIFx1NEUwMFx1NkMyN1x1NTMxNlx1NzhCM1x1ODBCQVx1NzAzMFx1NjU2M1x1OTFDRlxuICBcIjIyMDAxQ1wiOiBcIjQ1NDk4LTNcIiwgLy8gXHU3RDE0XHU5N0YzXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMTVCXCI6IFwiNDU0OTgtM1wiLCAvLyBcdThBNTBcdTgwN0VcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgXCIyMjAyNUJcIjogXCI0NjUzMC0yXCIsIC8vIFx1ODFFQVx1OEExOFx1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gU1VQUExFTUVOVEFMIChub3QgaW4gUEFTIENvbmNlcHRNYXAgXHUyMDE0IGhhbmQtY3VyYXRlZCBmcm9tIGNvbW1vblxuICAvLyBOSEkgY29kZXMgc2VlbiBpbiBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EuIExPSU5DIHZlcmlmaWVkIGFnYWluc3QgbG9pbmMub3JnXG4gIC8vIGNhbm9uaWNhbCBuYW1lcy4gTWV0aG9kLXNwZWNpZmljIGNvZGVzIChlLmcuIGhzLUNSUCkgcGljayB0aGVcbiAgLy8gc3BlY2lmaWMgTE9JTkM7IGdlbmVyYWwtbWV0aG9kIGNvZGVzIHBpY2sgdGhlIG1vc3QgY29tbW9uIGZvcm0uXG4gIC8vIElmIFx1NTA2NVx1NEZERFx1N0Y3MiBwdWJsaXNoZXMgYW4gYXV0aG9yaXRhdGl2ZSBicm9hZGVyIENvbmNlcHRNYXAgbGF0ZXIsXG4gIC8vIHJlcGxhY2UgdGhpcyBzZWN0aW9uIGluIG9uZSBwYXNzLlxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgLyBIYkExYyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwNUNcIjogXCIxNTU4LTZcIiwgLy8gXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2IChHbHUtQUMpIFx1MjAxNCBGYXN0aW5nIGdsdWNvc2UgTWFzcy92b2wgUy9QXG4gIFwiMDkxNDBDXCI6IFwiMjM0NS03XCIsIC8vIFx1ODg0MFx1N0NENi1cdTk5MTBcdTVGOEMvXHU5NkE4XHU2QTVGIFx1MjAxNCBHbHVjb3NlIE1hc3Mvdm9sIFMvUCAoZ2VuZXJhbClcbiAgXCIwOTAwNkNcIjogXCI0NTQ4LTRcIiwgLy8gXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwIChIYkExYykgXHUyMDE0IEhlbW9nbG9iaW4gQTFjL0hnYi50b3RhbCBCbG9vZFxuICAvLyBcdTI1MDBcdTI1MDAgUmVuYWwgLyBlbGVjdHJvbHl0ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDJDXCI6IFwiMzA5NC0wXCIsIC8vIEJVTiBcdTIwMTQgVXJlYSBuaXRyb2dlbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxM0NcIjogXCIzMDg0LTFcIiwgLy8gVXJpYyBBY2lkIFx1MjAxNCBVcmF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAyMUNcIjogXCIyOTUxLTJcIiwgLy8gTmEgXHUyMDE0IFNvZGl1bSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMjJDXCI6IFwiMjgyMy0zXCIsIC8vIEsgIFx1MjAxNCBQb3Rhc3NpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDI0Q1wiOiBcIjIwMjgtOVwiLCAvLyBDTzIgXHUyMDE0IENhcmJvbiBkaW94aWRlIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAxMkNcIjogXCIyNzc3LTFcIiwgLy8gSW5vcmdhbmljIFAgXHUyMDE0IFBob3NwaGF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NkJcIjogXCIxOTEyMy05XCIsIC8vIE1nIFx1MjAxNCBNYWduZXNpdW0gTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXBpZCBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwMUNcIjogXCIyMDkzLTNcIiwgLy8gVC1DaG9sZXN0ZXJvbCBcdTIwMTQgQ2hvbGVzdGVyb2wgTWFzcy92b2wgUy9QXG4gIFwiMDkwMDRDXCI6IFwiMjU3MS04XCIsIC8vIFRHIFx1MjAxNCBUcmlnbHljZXJpZGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDNDXCI6IFwiMjA4NS05XCIsIC8vIEhETCBcdTIwMTQgSERMIGNob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQ0Q1wiOiBcIjEzNDU3LTdcIiwgLy8gTERMIFx1MjAxNCBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGl2ZXIgZnVuY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMjdDXCI6IFwiNjc2OC02XCIsIC8vIEFMSy1QIFx1MjAxNCBBbGthbGluZSBwaG9zcGhhdGFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzMUNcIjogXCIyMzI0LTJcIiwgLy8gXHUwM0IzLUdUIFx1MjAxNCBHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzNUNcIjogXCIyNTAwLTdcIiwgLy8gVElCQyBcdTIwMTQgSXJvbiBiaW5kaW5nIGNhcGFjaXR5IE1hc3Mvdm9sIFMvUFxuICBcIjA5MDM3Q1wiOiBcIjE4MjctNVwiLCAvLyBBbW1vbmlhIFx1MjAxNCBQbGFzbWFcbiAgXCIwOTA2NENcIjogXCIzMDQwLTNcIiwgLy8gTGlwYXNlIFx1MjAxNCBBY3Rpdml0eSBTL1BcbiAgXCIwOTA1OUJcIjogXCIxNDExOC00XCIsIC8vIExhY3RhdGUgXHUyMDE0IE1hc3Mvdm9sIFBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgSGVtYXRvbG9neSBleHRyYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDRDXCI6IFwiNDU0NC0zXCIsIC8vIEhDVCBcdTIwMTQgSGVtYXRvY3JpdCB2b2x1bWUgZnJhY3Rpb24gQmxvb2RcbiAgXCIwODAwOENcIjogXCIxNDE5Ni0wXCIsIC8vIFJldGljdWxvY3l0ZSBcdTIwMTQgUmV0aWN1bG9jeXRlcy8xMDAgUkJDXG4gIFwiMDgwMTBDXCI6IFwiNzExLTJcIiwgLy8gRW9zaW5vcGhpbCBjb3VudCBcdTIwMTQgIy92b2wgQmxvb2RcbiAgXCIwODAxMUNcIjogXCIyNDMxNy0wXCIsIC8vIENCQyBwYW5lbCBcdTIwMTQgSGVtYXRvbG9neSBwYW5lbCBCbG9vZFxuICBcIjA4MDI2Q1wiOiBcIjYzMDEtNlwiLCAvLyBQVC9JTlIgXHUyMDE0IElOUiBQbGF0ZWxldCBwb29yIHBsYXNtYVxuICBcIjA4MDM2Q1wiOiBcIjE0OTc5LTlcIiwgLy8gQVBUVCBcdTIwMTQgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODA3NUNcIjogXCIyNjkyLTdcIiwgLy8gT3Ntb2xhbGl0eSBcdTIwMTQgU2VydW0gb3IgUGxhc21hXG4gIFwiMDgwNzlCXCI6IFwiMzAyNDAtNlwiLCAvLyBELWRpbWVyIFx1MjAxNCBQbHQgcG9vciBwbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIFRoeXJvaWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkxMDZDXCI6IFwiMzAyNC03XCIsIC8vIEZyZWUgVDQgXHUyMDE0IFRoeXJveGluZSBmcmVlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTEyQ1wiOiBcIjMwMTYtM1wiLCAvLyBUU0ggXHUyMDE0IFRoeXJvdHJvcGluIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZGlhYyBtYXJrZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDk5Q1wiOiBcIjEwODM5LTlcIiwgLy8gVHJvcG9uaW4gSSBcdTIwMTQgVHJvcG9uaW4gSSBjYXJkaWFjIFMvUFxuICBcIjEyMTkyQ1wiOiBcIjMzOTU5LThcIiwgLy8gUHJvY2FsY2l0b25pbiBcdTIwMTQgUy9QXG4gIFwiMTIxOTNDXCI6IFwiMzM3NjItNlwiLCAvLyBOVC1wcm9CTlAgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVml0YW1pbnMgLyBjb2ZhY3RvcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkxMjlDXCI6IFwiMjEzMi05XCIsIC8vIFZpdCBCMTIgXHUyMDE0IENvYmFsYW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTEzMENcIjogXCIyMjg0LThcIiwgLy8gRm9sYXRlIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTExM0NcIjogXCIyMTQzLTZcIiwgLy8gQ29ydGlzb2wgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMTE2Q1wiOiBcIjIyNzYtNFwiLCAvLyBGZXJyaXRpbiBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBBY3V0ZSBwaGFzZSAvIGluZmxhbW1hdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTIwMTVDIGlzIHRoZSBnZW5lcmljIE5ISSBDUlAgb3JkZXIgXHUyMDE0IG1vc3QgY2xpbmljYWwgY29udGV4dHMgaW4gXHU1MDY1XHU0RkREXG4gIC8vIHNlbmQgYSByZWd1bGFyIChub3QgaHMtKSBDUlAsIHNvIG1hcCB0byAxOTg4LTUuIElmIGEgXHU5NjYyXHU2MjQwIHNwZWNpZmljYWxseVxuICAvLyBiaWxscyBocy1DUlAgaXQgd2lsbCBsYW5kIG9uIGEgZGlmZmVyZW50IGNvZGUgKGUuZy4gMTIxODlDKS5cbiAgXCIxMjAxNUNcIjogXCIxOTg4LTVcIiwgLy8gQ1JQIFx1MjAxNCBDIHJlYWN0aXZlIHByb3RlaW4gTWFzcy92b2wgUy9QXG4gIFwiMTIwNTNDXCI6IFwiNTA0OC00XCIsIC8vIEFOQSBcdTIwMTQgQW50aW51Y2xlYXIgQWIgVGl0ZXIgUy9QXG4gIFwiMTIwNTZCXCI6IFwiMTYxMjQtMFwiLCAvLyBBbnRpLW1pdG9jaG9uZHJpYWwgQWIgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA2MDEyQ1wiOiBcIjU3NzgtNlwiLCAvLyBVcmluZSBhcHBlYXJhbmNlIFx1MjAxNCBDb2xvclxuICBcIjA2MDEzQ1wiOiBcIjI0MzU2LThcIiwgLy8gXHU1QzNGXHU3NTFGXHU1MzE2IHBhbmVsIFx1MjAxNCBVcmluYWx5c2lzIG1hY3Jvc2NvcGljIHBhbmVsXG4gIFwiMDcwMDFDXCI6IFwiMTQ1NjMtMVwiLCAvLyBTdG9vbCBvY2N1bHQgYmxvb2RcbiAgXCIwOTEzNENcIjogXCI1ODQ1My0yXCIsIC8vIGlGT0JUIHF1YW50aXRhdGl2ZSBcdTIwMTQgSGVtb2dsb2JpbiBNYXNzL3ZvbCBTdG9vbCBieSBJQVxuICBcIjEyMTExQ1wiOiBcIjIxNjEtOFwiLCAvLyBVcmluZSBDcmVhdGluaW5lIFx1MjAxNCBzYW1lIExPSU5DIGFzIDA5MDE2Q1xuICAvLyBcdTI1MDBcdTI1MDAgU2Vyb2xvZ3kgLyBpbW11bm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMDAxQ1wiOiBcIjUyOTItOFwiLCAvLyBSUFIgXHUyMDE0IFNlcnVtL1BsYXNtYVxuICBcIjEyMDIxQ1wiOiBcIjIwMzktNlwiLCAvLyBDRUEgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDI1QlwiOiBcIjI0NjUtM1wiLCAvLyBJZ0cgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDI3QlwiOiBcIjI0NTgtOFwiLCAvLyBJZ0EgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDMxQ1wiOiBcIjE5MTEzLTBcIiwgLy8gSWdFIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjA2OUJcIjogXCI1MTMyLTZcIiwgLy8gQ3J5cHRvY29jY3VzIEFnIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjA3OUNcIjogXCIyNDEwOC0zXCIsIC8vIENBIDE5LTkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQmxvb2QgdHlwZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMTAwMUNcIjogXCI4ODItMVwiLCAvLyBcdTg4NDBcdTU3OEJcdTk0NTFcdTVCOUEgXHUyMDE0IEFCTyArIFJoIGdyb3VwXG4gIFwiMTEwMDNDXCI6IFwiODgyLTFcIiwgLy8gXHU4ODQwXHU1NzhCXHU5NDUxXHU1QjlBIFx1MjAxNCBBQk8gKyBSaCBncm91cFxuICBcIjExMDA0Q1wiOiBcIjg5MC00XCIsIC8vIFx1NjI5N1x1OUFENFx1NTNDRFx1NjFDOSBcdTIwMTQgQW50aWJvZHkgc2NyZWVuXG4gIC8vIFx1MjUwMFx1MjUwMCBNaWNyb2Jpb2xvZ3kgY3VsdHVyZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEzMDA3QyBcdTdEMzBcdTgzQ0NcdTU3RjlcdTk5MEEgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDE0MjE5LTAgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0hUTFYgSSBwMjYgQWIgaW4gU2VydW0nICh2ZXJpZmllZCBhdCBsb2luYy5vcmcpLiBUaGVcbiAgLy8gcmlnaHQgZmFtaWx5IGlzIDY0NjMtNCAvIDExMjY4LTAgKEJhY3RlcmlhIGlkZW50aWZpZWQgYnkgYWVyb2JlXG4gIC8vIGN1bHR1cmUpIGJ1dCB0aGUgc291cmNlIHJvdyBkb2Vzbid0IHRlbGwgdXMgc3BlY2ltZW4gXHUyMDE0IGxlYXZpbmdcbiAgLy8gdW5tYXBwZWQgc28gd2UgZG9uJ3QgbGllLiBGYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLlxuICBcIjEzMDEzQ1wiOiBcIjMxOTUyLTVcIiwgLy8gVEIgQ3VsdHVyZSBcdTIwMTQgTXljb2JhY3Rlcml1bSB0dWJlcmN1bG9zaXMgY3VsdHVyZVxuICBcIjEzMDE2QlwiOiBcIjYwMC03XCIsIC8vIEJsb29kIEN1bHR1cmUgXHUyMDE0IEJhY3RlcmlhIGlkZW50aWZpZWQgaW4gQmxvb2RcbiAgLy8gXHUyNTAwXHUyNTAwIFZpcm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE0MDA0QlwiOiBcIjc4NDktM1wiLCAvLyBDTVYgSWdHIFx1MjAxNCBBYiBTL1BcbiAgXCIxNDA0OEJcIjogXCI3ODUwLTFcIiwgLy8gQ01WIElnTSBcdTIwMTQgQWIgUy9QXG4gIFwiMTQwNjZDXCI6IFwiODAzODMtM1wiLCAvLyBJbmZsdWVuemEgQSBcdTIwMTQgQWcgUmVzcGlyYXRvcnlcbiAgXCIxNDA4NENcIjogXCI5NDU1OC00XCIsIC8vIFNBUlMtQ29WLTIgQWcgXHUyMDE0IFJlc3BpcmF0b3J5XG4gIFwiMTIxODRDXCI6IFwiODgxNTctM1wiLCAvLyBDTVYgRE5BIHF1YW50IFBDUiBcdTIwMTQgUGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBNeWNvYmFjdGVyaXVtIC8gYWNpZC1mYXN0IChhZGRlZCBhZnRlciBhdWRpdCkgXHUyNTAwXG4gIFwiMTMwMjVDXCI6IFwiMjkyNjAtN1wiLCAvLyBcdTYyOTdcdTkxNzhcdTYwMjdcdTZGQzNcdTdFMkVcdTYyQjlcdTcyNDdcdTY3RDNcdTgyNzJcdTZBQTJcdTY3RTUgXHUyMDE0IE15Y29iYWN0ZXJpdW0gQUZCIHN0YWluXG4gIFwiMTMwMjZDXCI6IFwiMjk1NTMtNVwiLCAvLyBcdTYyOTdcdTkxNzhcdTgzQ0NcdTU3RjlcdTk5MEEgXHUyMDE0IE15Y29iYWN0ZXJpdW0gY3VsdHVyZSBsaXF1aWQrc29saWRcbiAgLy8gXHUyNTAwXHUyNTAwIEFCRyBwYW5lbCAoMDkwNDFCKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gSW50ZW50aW9uYWxseSBOT1QgbWFwcGVkIGhlcmUgXHUyMDE0IDA5MDQxQiBpcyBhIHBhbmVsIG9yZGVyIHRoYXRcbiAgLy8gdW5mb2xkcyBpbnRvIG1hbnkgaXRlbXMgKHBIIC8gcENPMiAvIHBPMiAvIEhDTzMgLyBUQ08yIC8gU0JFIC9cbiAgLy8gQUJFIC8gU0JDIC8gU0FUKS4gTWFwcGluZyB0aGUgcGFuZWwgY29kZSB0byBcInBIXCIgd291bGQgbWlzLWxhYmVsXG4gIC8vIGV2ZXJ5IG5vbi1wSCByb3cgdGhhdCBzaGFyZXMgdGhpcyBOSEkgY29kZS4gRWFjaCBpdGVtIGlzXG4gIC8vIHJlc29sdmVkIHZpYSBfTE9JTkNfTUFQIGRpc3BsYXkta2V5d29yZCBmYWxsYmFjayBiZWxvdzsgMDkwNDFCXG4gIC8vIGFsc28gYXBwZWFycyBpbiBfRElTUExBWV9GSVJTVF9DT0RFUyBzbyBkaXNwbGF5IGFsd2F5cyB3aW5zLlxuICAvLyBcdTI1MDBcdTI1MDAgQm9keSBmbHVpZCAvIHN5bm92aWFsIGZsdWlkIHBhbmVsICgxNjAwOEMgdW5mb2xkczsgdGhlXG4gIC8vIG1lbWJlciBpdGVtcyByZWx5IG9uIGRpc3BsYXkga2V5d29yZHMgZm9yIHNwZWNpbWVuLWF3YXJlXG4gIC8vIExPSU5DcykuIFBhcmVudCBjb2RlIG1hcHMgdG8gc3lub3ZpYWwgZmx1aWQgYW5hbHlzaXMgcGFuZWwuIFx1MjUwMFx1MjUwMFxuICAvLyAxNjAwOEMgXHU2RUQxXHU2REIyXHU2QUEyXHU2N0U1IFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAzMzkwMy02IHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdLZXRvbmVzIFtQcmVzZW5jZV0gaW4gVXJpbmUnICh2ZXJpZmllZCBsb2luYy5vcmcpLlxuICAvLyBMZWF2aW5nIHVubWFwcGVkOyB0aGUgcGFuZWwgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kaW5nIG9ubHlcbiAgLy8gYW5kIHRoZSBwZXItaXRlbSBkaXNwbGF5cyBpbiBfTE9JTkNfTUFQIGNhcnJ5IHRoZWlyIG93biBMT0lOQ3NcbiAgLy8gd2hlcmUga25vd24uXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0RJU1BMQVlfRklSU1RfQ09ERVMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgY29kZXMgdGhhdCBhcmUgKnBhbmVscyogXHUyMDE0IG9uZSBiaWxsaW5nIGNvZGUsIG1hbnkgaXRlbS1zcGVjaWZpY1xuLy8gZGlzcGxheXMuIEZvciB0aGVzZSwgZGlzcGxheSBrZXl3b3JkIE1VU1QgYmUgdHJpZWQgZmlyc3QgKHNvIFwiV0JDXCJcbi8vIHVuZGVyIENCQyBwYW5lbCAwODAxMUMgZ2V0cyA2NjkwLTIsIG5vdCB0aGUgZ2VuZXJpYyBwYW5lbCBMT0lOQykuXG4vLyBGb3IgZXZlcnl0aGluZyBlbHNlIChzaW5nbGUtdGVzdCBjb2RlcyBsaWtlIDA5MDA1QyBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDYsXG4vLyAwOTA0NEMgTERMLCAxNDAzMEMgSEJzQWcpLCB0aGUgTkhJIGNvZGUgaXMgbW9yZSBzcGVjaWZpYyB0aGFuIGFueVxuLy8gZGlzcGxheSBrZXl3b3JkIGFuZCB3aW5zIG91dHJpZ2h0LlxuLy9cbi8vIERFU0lHTiBQSElMT1NPUEhZOiB0aGUgYnJpZGdlIGlzIGEgKmZhaXRoZnVsIHRyYW5zcG9ydCogbGF5ZXIgXHUyMDE0IGl0XG4vLyB0cnVzdHMgdGhlIFx1NTA2NVx1NEZERCBiaWxsaW5nIGNvZGUgYXMgYXV0aG9yaXRhdGl2ZSBmb3IgY2xpbmljYWwgaW50ZW50XG4vLyAoXHU5NjYyXHU2MjQwIGJpbGxlZCAwOTAwNUMgPSB0aGV5IG9yZGVyZWQgZmFzdGluZyBnbHVjb3NlLCByZWdhcmRsZXNzIG9mXG4vLyB3aGV0aGVyIHRoZSBvcGVyYXRpb25hbCBzcGVjaW1lbiB3YXMgYSBmaW5nZXItc3RpY2spLiBEaXNwbGF5LXN0cmluZ1xuLy8gcmUtaW50ZXJwcmV0YXRpb24gb2YgY2xpbmljYWwgY29udGV4dCAoR2x1LUFDIHZzIEZJTkdFUiBTVUdBUiB2c1xuLy8gcmFuZG9tKSBpcyBsZWZ0IHRvIHRoZSBTTUFSVCBhcHAsIHdoaWNoIGhhcyBtb3JlIFVJIGNvbnRleHQuXG5leHBvcnQgY29uc3QgRElTUExBWV9GSVJTVF9DT0RFUzogUmVhZG9ubHlTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoW1xuICBcIjA4MDExQ1wiLCAvLyBDQkMgcGFuZWxcbiAgXCIwODAxM0NcIiwgLy8gQ0JDIHcvIGF1dG8gZGlmZiBwYW5lbFxuICBcIjA2MDEzQ1wiLCAvLyBVcmluYWx5c2lzIG1hY3Jvc2NvcGljIHBhbmVsXG4gIFwiMDkwNDFCXCIsIC8vIEFCRyBwYW5lbFxuICBcIjE2MDA4Q1wiLCAvLyBTeW5vdmlhbCAvIGJvZHktZmx1aWQgcGFuZWxcbl0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgX1BBTkVMX0xPSU5DX01BUCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFBhbmVsLXNwZWNpZmljIGRpc3BsYXkgXHUyMTkyIExPSU5DIG92ZXJyaWRlcy4gVGhlc2UgcnVuIEJFRk9SRSB0aGUgZ2xvYmFsXG4vLyBfTE9JTkNfTUFQIHNvIHRoYXQgdXJpbmUgYmlsaXJ1YmluIHVuZGVyIDA2MDEzQyBtYXBzIHRvIDU3NzAtMyAodXJpbmVcbi8vIHNwZWNpbWVuKSBpbnN0ZWFkIG9mIGJlaW5nIHNoYWRvd2VkIGJ5IHRoZSBnbG9iYWwgJ2JpbGlydWJpbicgdGhhdFxuLy8gd291bGQgaW1wbHkgc2VydW0sIGFuZCBhbmFsb2dvdXMgc3BlY2ltZW4tYXdhcmUgZGlzYW1iaWd1YXRpb24gZm9yXG4vLyBvdGhlciBwYW5lbCBzdWItaXRlbXMuIEtleXMgYXJlIE5ISSBwYW5lbCBjb2RlcyAobXVzdCBhbHNvIGJlIGluXG4vLyBfRElTUExBWV9GSVJTVF9DT0RFUyk7IHZhbHVlcyBhcmUgZGlzcGxheS1rZXl3b3JkIFx1MjE5MiBMT0lOQyBkaWN0cyB0aGF0XG4vLyBmb2xsb3cgdGhlIHNhbWUgbWF0Y2hpbmcgc2VtYW50aWNzIGFzIF9MT0lOQ19NQVAgKGxlYWRpbmcgd29yZFxuLy8gYm91bmRhcnkgZm9yIEFTQ0lJLCBzdWJzdHJpbmcgZm9yIENKSykuXG5leHBvcnQgY29uc3QgUEFORUxfTE9JTkNfTUFQOiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEFsbCByb3V0aW5lIGRpcHN0aWNrIGl0ZW1zIHJlc2lkZSBvbiBhIHNpbmdsZSBOSEkgYmlsbGluZyBjb2RlLlxuICAvLyBXaXRob3V0IHRoaXMgdGFibGUgdGhleSdkIGFsbCBjb2xsYXBzZSB0byB0aGUgcGFuZWwgTE9JTkMgMjQzNTYtOCxcbiAgLy8gbG9zaW5nIHBlci1pdGVtIGdyYW51bGFyaXR5IHRoYXQncyBjbGluaWNhbGx5IHVzZWZ1bCAoZS5nLlxuICAvLyBiaWxpcnViaW4gdnMgdXJvYmlsaW5vZ2VuIGZvciBsaXZlciB3b3JrdXApLlxuICBcIjA2MDEzQ1wiOiB7XG4gICAgLy8gT3JkZXIgbWF0dGVyczogbG9uZ2VyL21vcmUtc3BlY2lmaWMga2V5cyBiZWZvcmUgZ2VuZXJpYyBvbmVzXG4gICAgLy8gKG1hdGNoZXMgX0xPSU5DX01BUCBpdGVyYXRpb24gc2VtYW50aWNzIFx1MjAxNCBmaXJzdCBoaXQgd2lucykuXG4gICAgXCJzcGVjaWZpYyBncmF2aXR5XCI6IFwiNTgxMS01XCIsIC8vIFNwZWNpZmljIGdyYXZpdHkgVXJpbmVcbiAgICBcInNwLmdyYXZpdHlcIjogXCI1ODExLTVcIixcbiAgICBcInNwIGdyYXZpdHlcIjogXCI1ODExLTVcIixcbiAgICBcdTZCRDRcdTkxQ0Q6IFwiNTgxMS01XCIsXG4gICAgXCJtaWNyby1hbGJ1bWluXCI6IFwiMTQ5NTctNVwiLCAvLyBNaWNyb2FsYnVtaW4gTWFzcy92b2wgVXJpbmVcbiAgICBtaWNyb2FsYnVtaW46IFwiMTQ5NTctNVwiLFxuICAgIFwibWFsYih1KVwiOiBcIjE0OTU3LTVcIixcbiAgICBtYWxiOiBcIjE0OTU3LTVcIixcbiAgICBcdTVGQUVcdTVDMEZcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiMTQ5NTctNVwiLFxuICAgIHVhY3I6IFwiMTQ5NTktMVwiLCAvLyBNaWNyb2FsYnVtaW4vQ3JlYXRpbmluZSByYXRpbyBVcmluZVxuICAgIFwidXJpbmUgZ2x1Y29zZVwiOiBcIjU3OTItN1wiLFxuICAgIHN1Z2FyOiBcIjU3OTItN1wiLCAvLyBOSEkgJ1x1NUMzRlx1N0NENicgLyAnU3VnYXInIHVuZGVyIDA2MDEzQ1xuICAgIFx1NUMzRlx1N0NENjogXCI1NzkyLTdcIixcbiAgICB1cm9iaWxpbm9nZW46IFwiNTgxOC0wXCIsIC8vIFVyb2JpbGlub2dlbiBVcmluZSBRbFxuICAgIFx1NUMzRlx1ODFCRFx1N0QyMFx1NTM5RjogXCI1ODE4LTBcIixcbiAgICBiaWxpcnViaW46IFwiNTc3MC0zXCIsIC8vIEJpbGlydWJpbiBVcmluZSBRbFxuICAgIFx1NUMzRlx1ODFCRFx1N0QwNVx1N0QyMDogXCI1NzcwLTNcIixcbiAgICBuaXRyaXRlOiBcIjU4MDItNFwiLCAvLyBOaXRyaXRlIFVyaW5lXG4gICAgXHU0RTlFXHU3ODVEXHU5MTc4OiBcIjU4MDItNFwiLFxuICAgIGtldG9uZXM6IFwiNTc5Ny02XCIsIC8vIEtldG9uZXMgVXJpbmVcbiAgICBrZXRvbmU6IFwiNTc5Ny02XCIsXG4gICAgXHU5MTZFXHU5QUQ0OiBcIjU3OTctNlwiLFxuICAgIHByb3RlaW46IFwiMjA0NTQtNVwiLCAvLyBQcm90ZWluIE1hc3Mvdm9sIFVyaW5lXG4gICAgXHU1QzNGXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgICBcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAgIGxldWtvY3l0ZTogXCI1Nzk5LTJcIiwgLy8gTGV1a29jeXRlcyBVcmluZVxuICAgIGxldTogXCI1Nzk5LTJcIixcbiAgICBcdTc2N0RcdTg4NDBcdTc0MDNcdTkxNkZcdTkxNzY6IFwiNTc5OS0yXCIsXG4gICAgYmxvb2Q6IFwiNTc5NC0zXCIsIC8vIEhlbW9nbG9iaW4gVXJpbmUgUWxcbiAgICBcdTZGNUJcdTg4NDA6IFwiNTc5NC0zXCIsXG4gICAgXHU4MjcyOiBcIjU3NzgtNlwiLCAvLyBDb2xvciBvZiBVcmluZSAoQ0pLIHN1YnN0cmluZylcbiAgICBjb2xvcjogXCI1Nzc4LTZcIixcbiAgICB0dXJiaWRpdHk6IFwiNTc2Ny05XCIsIC8vIEFwcGVhcmFuY2Ugb2YgVXJpbmVcbiAgICBhcHBlYXJhbmNlOiBcIjU3NjctOVwiLFxuICAgIFx1NTkxNlx1ODlDMDogXCI1NzY3LTlcIixcbiAgICBwaDogXCI1ODAzLTJcIiwgLy8gcEggb2YgVXJpbmUgKHVyaW5lLXNwZWNpZmljLCBOT1RcbiAgICAvLyB0aGUgYXJ0ZXJpYWwgMTE1NTgtNCB0aGF0IHRoZVxuICAgIC8vIGdsb2JhbCBtYXAgcG9pbnRzIHRvKVxuICAgIFx1OTE3OFx1OUU3Q1x1NUVBNjogXCI1ODAzLTJcIixcbiAgICBnbHVjb3NlOiBcIjU3OTItN1wiLCAvLyBMYXN0IGluIHRoaXMgYmxvY2sgc28gJ3VyaW5lXG4gIH0sXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0xPSU5DX01BUCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIENvbW1vbiBUYWl3YW5lc2UgSElTIGxhYiBuYW1lcyBcdTIxOTIgTE9JTkMgY29kZSBtYXBwaW5nXG5leHBvcnQgY29uc3QgTE9JTkNfTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gRGlzcGxheS1rZXl3b3JkIGZhbGxiYWNrIG9ubHkga2lja3MgaW4gd2hlbiBOTyBOSEkgY29kZSBpc1xuICAvLyBwcmVzZW50IChkYXNoYm9hcmQgcm93cywgTExNLWV4dHJhY3RlZCB0ZXh0KS4gV2hlbiB0aGUgTkhJIGNvZGVcbiAgLy8gSVMgcHJlc2VudCwgMDkwMDVDIFx1MjE5MiAxNTU4LTYgKEZhc3RpbmcpIGFuZCAwOTE0MEMgXHUyMTkyIDIzNDUtN1xuICAvLyAoZ2VuZXJpYykgd2lucyBkaXJlY3RseSB2aWEgX05ISV9UT19MT0lOQy5cbiAgLy9cbiAgLy8gRmFpdGhmdWwtdHJhbnNwb3J0IHByaW5jaXBsZTogdGhlIGJyaWRnZSBkb2VzIE5PVCByZS1pbnRlcnByZXRcbiAgLy8gZGlzcGxheSBzdHJpbmdzIGxpa2UgXCJGSU5HRVIgU1VHQVJcIiBhcyBhIGRpZmZlcmVudCBMT0lOQyBcdTIwMTQgaXRcbiAgLy8gcHJlc2VydmVzIHRoZSByYXcgZGlzcGxheSBpbiBgY29kZS50ZXh0YCBhbmQgdGhlIG9yaWdpbmFsIE5ISVxuICAvLyBjb2RlIGluIGBjb2RlLmNvZGluZ2AuIFRoZSBTTUFSVCBhcHAgZG9lcyBzcGVjaW1lbi9tZXRob2QtYXdhcmVcbiAgLy8gZ3JvdXBpbmcgb24gdGhlIGNvbnN1bWVyIHNpZGUgKHNlZSBTTUFSVCBhcHAgaGFuZG9mZiBkb2MpLlxuICBcImZhc3RpbmcgZ2x1Y29zZVwiOiBcIjE1NTgtNlwiLFxuICBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDY6IFwiMTU1OC02XCIsXG4gIFwiZ2x1LWFjXCI6IFwiMTU1OC02XCIsXG4gIFwiZ2x1Y29zZSBhY1wiOiBcIjE1NTgtNlwiLFxuICBnbHVjb3NlOiBcIjIzNDUtN1wiLFxuICBcdTg4NDBcdTdDRDY6IFwiMjM0NS03XCIsXG4gIGdsdTogXCIyMzQ1LTdcIixcbiAgLy8gSGJBMWMgTVVTVCBhcHBlYXIgYmVmb3JlIGdlbmVyaWMgXCJoYlwiIGVudHJpZXMgc28gdGhlIGxvbmdlc3QtcHJlZml4XG4gIC8vIG1hdGNoIHdpbnMgZm9yIHRoZSBcIkhiQTFjXCIgZGlzcGxheSBzdHJpbmcuIE90aGVyIEExYyBzeW5vbnltc1x1MjAyNlxuICBoYmExYzogXCI0NTQ4LTRcIixcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIjQ1NDgtNFwiLFxuICBhMWM6IFwiNDU0OC00XCIsXG4gIGhlbW9nbG9iaW46IFwiNzE4LTdcIixcbiAgXHU4ODQwXHU3RDA1XHU3RDIwOiBcIjcxOC03XCIsXG4gIGhnYjogXCI3MTgtN1wiLFxuICBoYjogXCI3MTgtN1wiLFxuICAvLyBDQkMgZGlmZiBcdTIwMTQgZW9zaW5vcGhpbCBjb3VudCBtdXN0IHByZWNlZGUgdGhlIGJhcmUgJ3diYycvJ1x1NzY3RFx1ODg0MFx1NzQwMydcbiAgLy8ga2V5cyAod2hpY2ggd291bGQgb3RoZXJ3aXNlIHdpbiBhcyBzdWJzdHJpbmdzKS5cbiAgLy8gNzExLTIgdmVyaWZpZWQgYXQgbG9pbmMub3JnOiAnRW9zaW5vcGhpbHMgWyMvdm9sdW1lXSBpbiBCbG9vZFxuICAvLyBieSBBdXRvbWF0ZWQgY291bnQnLlxuICBcdTU1RENcdTkxNzhcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNzExLTJcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIjcxMS0yXCIsXG4gIGVvc2lub3BoaWw6IFwiNzExLTJcIixcbiAgZW9zaW5vcGhpbHM6IFwiNzExLTJcIixcbiAgd2JjOiBcIjY2OTAtMlwiLFxuICBcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNjY5MC0yXCIsXG4gIHBsYXRlbGV0OiBcIjc3Ny0zXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCI3NzctM1wiLFxuICBwbHQ6IFwiNzc3LTNcIixcbiAgLy8gUkJDICsgUkJDIGluZGljZXMgXHUyMDE0IHZlcmlmaWVkIExPSU5DcyAobG9pbmMub3JnKTpcbiAgLy8gNzg5LTggIEVyeXRocm9jeXRlcyAjL3ZvbCBCbG9vZCBBdXRvICAgICAgICAgICAgICBcdTIxOTIgUkJDXG4gIC8vIDc4NS02ICBFcnl0aHJvY3l0ZSBtZWFuIGNvcnB1c2N1bGFyIGhlbW9nbG9iaW4gICAgXHUyMTkyIE1DSFxuICAvLyBMb25nIENKSyBmb3JtcyBmaXJzdCAoTERML2Nob2xlc3Rlcm9sIHBhdHRlcm4pIHNvICdcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcbiAgLy8gXHU4ODQwXHU4MjcyXHU3RDIwJyB3aW5zIG92ZXIgXHU3RDA1XHU4ODQwXHU3NDAzLlxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjA6IFwiNzg1LTZcIixcbiAgcmJjOiBcIjc4OS04XCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCI3ODktOFwiLFxuICBtY2g6IFwiNzg1LTZcIixcbiAgLy8gVXJpbmUgY3JlYXRpbmluZSBcdTIwMTQgTVVTVCBhcHBlYXIgYmVmb3JlIGdlbmVyaWMgJ2NyZWF0aW5pbmUnIHNvXG4gIC8vIHJvd3MgbGlrZSAnVS1DUkUgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwJyBvciAnQ3JlYXRpbmluZShVKScgcmVzb2x2ZSB0byB0aGVcbiAgLy8gdXJpbmUgTE9JTkMgKDIxNjEtOCkgaW5zdGVhZCBvZiBiZWluZyBzaGFkb3dlZCBieSB0aGUgc2VydW1cbiAgLy8gZGVmYXVsdCAoMjE2MC0wKS4gU2FtZSBsb25nZXN0LXNwZWNpZmljLWZpcnN0IG9yZGVyaW5nIGFzXG4gIC8vIHRoZSBmYXN0aW5nLXZzLXJhbmRvbSBnbHVjb3NlIGJsb2NrLlxuICBcInVyaW5lIGNyZWF0aW5pbmVcIjogXCIyMTYxLThcIixcbiAgXCJjcmVhdGluaW5lIHVyaW5lXCI6IFwiMjE2MS04XCIsXG4gIFwiY3JlYXRpbmluZSh1KVwiOiBcIjIxNjEtOFwiLFxuICBcInUtY3JlXCI6IFwiMjE2MS04XCIsXG4gIFwidS1jcmVhXCI6IFwiMjE2MS04XCIsXG4gIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MDogXCIyMTYxLThcIixcbiAgY3JlYXRpbmluZTogXCIyMTYwLTBcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIjIxNjAtMFwiLFxuICBcdTgwOENcdTkxNTBcdTkxNzg6IFwiMjE2MC0wXCIsIC8vIFRhaXdhbiB2YXJpYW50IHNwZWxsaW5nXG4gIGNyZWE6IFwiMjE2MC0wXCIsXG4gIGJ1bjogXCIzMDk0LTBcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIjMwOTQtMFwiLFxuICBhc3Q6IFwiMTkyMC04XCIsXG4gIGFsdDogXCIxNzQyLTZcIixcbiAgZmVycml0aW46IFwiMjI3Ni00XCIsXG4gIFx1ODg0MFx1NkUwNVx1OTQzNVx1ODZDQlx1NzY3RDogXCIyMjc2LTRcIixcbiAgZmVycjogXCIyMjc2LTRcIixcbiAgLy8gVml0YWwtc2lnbnMgZnJvbSBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjUgKElIS0UzNDAyKSBcdTIwMTQgc2VwYXJhdGUgY29kZSBuYW1lc3BhY2VcbiAgLy8gYnV0IHRoZSBsb29rdXAgaXMgYnkgZGlzcGxheS1uYW1lIHN1YnN0cmluZywgc2FtZSBhcyBmb3IgbGFicy5cbiAgXCJib2R5IGhlaWdodFwiOiBcIjgzMDItMlwiLFxuICBcImJvZHkgd2VpZ2h0XCI6IFwiMjk0NjMtN1wiLFxuICBibWk6IFwiMzkxNTYtNVwiLFxuICAvLyBXYWlzdCBjaXJjdW1mZXJlbmNlIFx1MjAxNCBtZWFzdXJlbWVudCBMT0lOQyAoODI4MC0wKS4gNTYwODYtMiBpc1xuICAvLyB0aGUgJ0FkdWx0IFdhaXN0IENpcmN1bWZlcmVuY2UgUHJvdG9jb2wnIGNvZGUsIHdoaWNoIGlzIGFcbiAgLy8gc3VydmV5L3Byb3RvY29sIGRlc2NyaXB0b3IsIE5PVCBhIG51bWVyaWMgbWVhc3VyZW1lbnRcbiAgLy8gKHZlcmlmaWVkIGF0IGxvaW5jLm9yZykuIE5ISSBcdTUwNjVcdTRGREQgcmVwb3J0cyBhIHNpbmdsZSB3YWlzdGxpbmVcbiAgLy8gbnVtYmVyIHBlciB2aXNpdCwgc28gdGhlIG1lYXN1cmVtZW50IGNvZGUgaXMgY29ycmVjdC5cbiAgXCJ3YWlzdCBjaXJjdW1mZXJlbmNlXCI6IFwiODI4MC0wXCIsXG4gIFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIjogXCI4NDgwLTZcIixcbiAgXCJkaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIjogXCI4NDYyLTRcIixcbiAgLy8gTGlwaWQgcGFuZWwgXHUyMDE0IE9SREVSIE1BVFRFUlMuIExETC9IREwgdmFyaWFudHMgTVVTVCBwcmVjZWRlIHRoZVxuICAvLyBnZW5lcmljICdjaG9sZXN0ZXJvbCcga2V5IHNvIGEgcm93IGxhYmVsbGVkICdMREwgQ0hPTEVTVEVST0wnXG4gIC8vIHJlc29sdmVzIHRvIDEzNDU3LTcgKExETCBjYWxjdWxhdGVkKSBhbmQgJ0hETCBDSE9MRVNURVJPTCcgdG9cbiAgLy8gMjA4NS05LCBpbnN0ZWFkIG9mIGZhbGxpbmcgdG8gMjA5My0zICh0b3RhbCBjaG9sZXN0ZXJvbCkgdmlhIHRoZVxuICAvLyAnY2hvbGVzdGVyb2wnIHN1YnN0cmluZy4gU2FtZSBjYW5vbmljYWwgb3JkZXJpbmcgYXMgX0xBQl9TWU5PTllNUy5cbiAgXCJsZGwgY2hvbGVzdGVyb2xcIjogXCIxMzQ1Ny03XCIsXG4gIFwibGRsLWNob2xlc3Rlcm9sXCI6IFwiMTM0NTctN1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiMTM0NTctN1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMTM0NTctN1wiLFxuICAvLyAxMzQ1Ny03ID0gTERMIGNob2xlc3Rlcm9sIChjYWxjdWxhdGVkKSBcdTIwMTQgbWF0Y2hlcyB0aGUgTkhJIDA5MDQ0Q1xuICAvLyBiaWxsaW5nIGNvZGUncyBpbnRlbnQgKFRhaXdhbiBsYWJzIHByZWRvbWluYW50bHkgcmVwb3J0IGNhbGN1bGF0ZWRcbiAgLy8gTERMIHZpYSBGcmllZGV3YWxkKS4gS2VlcCBjb25zaXN0ZW50IHdpdGggX05ISV9UT19MT0lOQ1tcIjA5MDQ0Q1wiXS5cbiAgXCJsZGwtY1wiOiBcIjEzNDU3LTdcIixcbiAgbGRsOiBcIjEzNDU3LTdcIixcbiAgXCJoZGwgY2hvbGVzdGVyb2xcIjogXCIyMDg1LTlcIixcbiAgXCJoZGwtY2hvbGVzdGVyb2xcIjogXCIyMDg1LTlcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwODUtOVwiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA4NS05XCIsXG4gIFwiaGRsLWNcIjogXCIyMDg1LTlcIixcbiAgaGRsOiBcIjIwODUtOVwiLFxuICAvLyBUb3RhbCBjaG9sZXN0ZXJvbCBcdTIwMTQgYmFyZSAnY2hvbGVzdGVyb2wnIG9ubHkgZmlyZXMgQUZURVIgdGhlXG4gIC8vIExETC9IREwtcHJlZml4ZWQgdmFyaWFudHMgYWJvdmUgaGF2ZSBiZWVuIGNoZWNrZWQuXG4gIFwidG90YWwgY2hvbGVzdGVyb2xcIjogXCIyMDkzLTNcIixcbiAgXCJ0LWNob2xlc3Rlcm9sXCI6IFwiMjA5My0zXCIsXG4gIFx1ODg0MFx1NkUwNVx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDkzLTNcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwOTMtM1wiLFxuICBjaG9sZXN0ZXJvbDogXCIyMDkzLTNcIixcbiAgdHJpZ2x5Y2VyaWRlOiBcIjI1NzEtOFwiLFxuICBcdTRFMDlcdTkxNzhcdTc1MThcdTZDQjlcdTkxNkY6IFwiMjU3MS04XCIsXG4gIFwidXJpYyBhY2lkXCI6IFwiMzA4NC0xXCIsXG4gIGVnZnI6IFwiMzM5MTQtM1wiLFxuICBoYnNhZzogXCI1MTk2LTFcIixcbiAgXCJhbnRpLWhjdlwiOiBcIjE2MTI4LTFcIixcbiAgLy8gVXJpbmUgcHJvdGVpbiAoZGlzcGxheSBmYWxsYmFjayBmb3IgdGhlIG5vLU5ISS1jb2RlIHBhdGggdGhhdFxuICAvLyBjb21lcyBmcm9tIElIS0UzNDAyIHZpdGFscyArIGFkdWx0LXByZXZlbnRpdmUgc3VwcGxlbWVudHMpLlxuICBcInVyaW5lIHByb3RlaW5cIjogXCIyMDQ1NC01XCIsIC8vIFByb3RlaW4gTWFzcy92b2wgVXJpbmVcbiAgXCJ1LXByb1wiOiBcIjIwNDU0LTVcIixcbiAgXHU1QzNGXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgLy8gQUJHIHBhbmVsIGNvbXBvbmVudHMgXHUyMDE0IDA5MDQxQiBwYXJlbnQgY29kZSBpbiBOSElfVE9fTE9JTkM7IGVhY2hcbiAgLy8gbWVtYmVyJ3MgZGlzcGxheSAoXCJwQ08yXCIsIFwicE8yXCIsIFwiSENPM1wiLCBcIlRDTzJcIiwgXCJTQkUvQUJFXCIsXG4gIC8vIFwiU0JDXCIsIFwiU0FUXCIgLyBcIlNhTzJcIikgZmFsbHMgdG8gaXRzIG93biBMT0lOQy5cbiAgLy8gcEggTVVTVCBjb21lIGJlZm9yZSBwY28yL3BvMiBzbyB0aGUgYmFyZSBcInBIXCIgZGlzcGxheSBsYW5kcyBoZXJlLlxuICBwaDogXCIxMTU1OC00XCIsIC8vIHBIIG9mIEFydGVyaWFsIGJsb29kXG4gIHBjbzI6IFwiMjAxOS04XCIsIC8vIENhcmJvbiBkaW94aWRlIHBwIGluIEFydGVyaWFsIGJsb29kXG4gIHBvMjogXCIyNzAzLTdcIiwgLy8gT3h5Z2VuIHBwIGluIEFydGVyaWFsIGJsb29kXG4gIGhjbzM6IFwiMTk1OS02XCIsIC8vIEJpY2FyYm9uYXRlIE1vbGVzL3ZvbCBBcnRlcmlhbFxuICBiaWNhcmJvbmF0ZTogXCIxOTU5LTZcIixcbiAgdGNvMjogXCIyMDI4LTlcIiwgLy8gVG90YWwgQ08yIE1vbGVzL3ZvbCBBcnRlcmlhbFxuICBzYmU6IFwiMTE1NTUtMFwiLCAvLyBTdGFuZGFyZCBiYXNlIGV4Y2VzcyBBcnRlcmlhbFxuICBhYmU6IFwiMTE1NTUtMFwiLFxuICBzYmM6IFwiMTkyNS03XCIsIC8vIFN0YW5kYXJkIGJpY2FyYm9uYXRlIEFydGVyaWFsXG4gIHNhdHVyYXQ6IFwiMjcxMy02XCIsIC8vIE8yIHNhdHVyYXRpb24gQXJ0ZXJpYWxcbiAgc2FvMjogXCIyNzEzLTZcIixcbiAgc2F0OiBcIjI3MTMtNlwiLCAvLyBOSEkgZGlzcGxheSBzaG93cyBqdXN0IFwiU0FUXCJcbiAgLy8gU3lub3ZpYWwgLyBib2R5LWZsdWlkIGNvbXBvbmVudHMgKDE2MDA4QyBwYXJlbnQgYWJvdmUpLlxuICBcInNmLmNvbG9yXCI6IFwiNTc3OC02XCIsIC8vIENvbG9yIG9mIEJvZHkgZmx1aWQgKHJldXNlIFVyaW5lIGNvbG9yIHNwZWMgT0spXG4gIC8vIE5PVEU6IDgyNTUtMiAvIDEzOTQ4LTUgcHJldmlvdXNseSBsaXN0ZWQgaGVyZSBib3RoIHR1cm5lZCBvdXRcbiAgLy8gdG8gYmUgdW5yZWxhdGVkIExPSU5DcyAodmVyaWZpZWQgbG9pbmMub3JnIFx1MjAxNCA4MjU1LTIgaXNcbiAgLy8gJ1NlcnZpY2UgY29tbWVudCAxMycsIDEzOTQ4LTUgaXMgJ0NvY2NpZGlvaWRlcyBpbW1pdGlzIElnTVxuICAvLyBBYicpLiBCb2R5LWZsdWlkIEFwcGVhcmFuY2UgLyBSQkMgZG9uJ3QgaGF2ZSB3ZWxsLWF0dGVzdGVkXG4gIC8vIExPSU5DcyBpbiBvdXIgdGFibGUgeWV0IFx1MjAxNCBmYWxsaW5nIHRocm91Z2ggdG8gY29kZS50ZXh0LW9ubHlcbiAgLy8gaXMgc2FmZXIgdGhhbiBlbWl0dGluZyBhIG1pc2xlYWRpbmcgTE9JTkMuIFRvIGFkZCBsYXRlcixcbiAgLy8gdmVyaWZ5IGVhY2ggYWdhaW5zdCBsb2luYy5vcmcgZmlyc3QuXG4gIFwic2Yud2JjXCI6IFwiMjY0NjYtM1wiLCAvLyBXQkMgIy92b2wgQm9keSBmbHVpZFxuICBcInNmLm5ldXRyb3BoaWxcIjogXCIxMDMyOC02XCIsIC8vIE5ldXRyb3BoaWxzLzEwMCBsZXVrb2N5dGVzIGluIEJvZHkgZmx1aWRcbiAgXCJzZi5seW1waG9cIjogXCIxMzA0Ni04XCIsIC8vIEx5bXBob2N5dGVzICMvdm9sIEJvZHkgZmx1aWRcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfTE9JTkNfRElTUExBWSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIENhbm9uaWNhbCBFbmdsaXNoIGRpc3BsYXkgbmFtZXMgZm9yIExPSU5DIGNvZGVzIHRoZSBicmlkZ2UgZW1pdHMuXG4vLyBGYWxscyBiYWNrIHRvIHRoZSByYXcgaW5wdXQgZGlzcGxheSB3aGVuIGEgTE9JTkMgaXNuJ3QgbGlzdGVkIGhlcmUuXG4vLyBTb3VyY2VkIGZyb20gbG9pbmMub3JnIGNhbm9uaWNhbCBzaG9ydCBuYW1lcyB3aGVyZSBhcHBsaWNhYmxlLlxuLy8gQWRkIG5ldyBlbnRyaWVzIGFzIHdlIHdpZGVuIExPSU5DIGNvdmVyYWdlIFx1MjAxNCB0aGUgbG9va3VwIGlzIGtleWVkIG9uXG4vLyBMT0lOQyBzdHJpbmcsIHNvIHVubWFwcGVkIExPSU5DcyBkZWdyYWRlIGdyYWNlZnVsbHkgdG8gdGhlIE5ISSB0ZXh0LlxuZXhwb3J0IGNvbnN0IExPSU5DX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MgcGFuZWwgc3ViLWl0ZW1zKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gTW9zdCBjcml0aWNhbCBibG9jayBcdTIwMTQgTkhJJ3MgXCJDb2xvciBcdTVDM0YgXHU5ODRGICAuLi5cIiBzdHlsZSBsYWJlbHMgYXJlXG4gIC8vIHdoYXQgdHJpZ2dlcnMgZG93bnN0cmVhbSBDaGluZXNlLXN1YnN0cmluZyBsYWJlbGxpbmcgYnVncy5cbiAgXCI1ODAzLTJcIjogXCJwSCBvZiBVcmluZVwiLFxuICBcIjU4MTEtNVwiOiBcIlNwZWNpZmljIGdyYXZpdHkgb2YgVXJpbmVcIixcbiAgXCI1NzcwLTNcIjogXCJCaWxpcnViaW4gVXJpbmUgUWxcIixcbiAgXCI1ODAyLTRcIjogXCJOaXRyaXRlIFVyaW5lIFFsXCIsXG4gIFwiNTc3OC02XCI6IFwiQ29sb3Igb2YgVXJpbmVcIixcbiAgXCI1NzY3LTlcIjogXCJBcHBlYXJhbmNlIG9mIFVyaW5lXCIsXG4gIFwiNTgxOC0wXCI6IFwiVXJvYmlsaW5vZ2VuIFVyaW5lIFFsXCIsXG4gIFwiMjA0NTQtNVwiOiBcIlByb3RlaW4gTWFzcy9Wb2wgaW4gVXJpbmVcIixcbiAgXCIxNDk1Ny01XCI6IFwiTWljcm9hbGJ1bWluIE1hc3MvVm9sIGluIFVyaW5lXCIsXG4gIFwiMTQ5NTktMVwiOiBcIk1pY3JvYWxidW1pbi9DcmVhdGluaW5lIFJhdGlvIGluIFVyaW5lXCIsXG4gIFwiNTc5Mi03XCI6IFwiR2x1Y29zZSBVcmluZSBRbFwiLFxuICBcIjU3OTctNlwiOiBcIktldG9uZXMgVXJpbmUgUWxcIixcbiAgXCI1Nzk0LTNcIjogXCJIZW1vZ2xvYmluIFVyaW5lIFFsXCIsXG4gIFwiNTc5OS0yXCI6IFwiTGV1a29jeXRlcyBVcmluZSBRbFwiLFxuICBcIjI0MzU2LThcIjogXCJVcmluYWx5c2lzIE1hY3JvIFBhbmVsXCIsXG4gIC8vIEFMTCBlbnRyaWVzIGJlbG93IHVzZSB0aGUgTE9JTkMgY2Fub25pY2FsICdMb25nIENvbW1vbiBOYW1lJ1xuICAvLyBhcyBhY2NlcHRlZCBieSB0aGUgVFdOSElGSElSIHZhbGlkYXRvci4gU291cmNlOiBsb2luYy5vcmcgZm9yXG4gIC8vIGVhY2ggY29kZSwgY3Jvc3MtY2hlY2tlZCBhZ2FpbnN0IHRoZSB2YWxpZGF0b3IncyByZXBvcnRlZFxuICAvLyAnVmFsaWQgZGlzcGxheSBpcyBvbmUgb2YgTiBjaG9pY2VzJyBmb3IgZGlzcGxheXMgd2UgcHJldmlvdXNseVxuICAvLyBnb3Qgd3JvbmcgKDQ1IExPSU5DcyBmb3VuZCBpbiB0aGUgUDMzMzMzMzMzMyB2YWxpZGF0aW9uIHJ1bikuXG4gIC8vIFdoZW4gdXBkYXRpbmcsIGNvcHkgdGhlIGV4YWN0IGVuLVVTIGxvbmcgbmFtZSBmcm9tIGxvaW5jLm9yZyBcdTIwMTRcbiAgLy8gdGhlIHZhbGlkYXRvciBpcyBzZW5zaXRpdmUgdG8gc3BlbGxpbmcgLyBwdW5jdHVhdGlvbi5cbiAgLy9cbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQyBwYW5lbCBzdWItaXRlbXMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBcdTI1MDBcdTI1MDAgQUJHICgwOTA0MUIgcGFuZWwpIFx1MjAxNCBub3QgaW4gdmFsaWRhdG9yIG91dHB1dDsgbG9pbmMub3JnIHNvdXJjZWRcbiAgXCIxMTU1OC00XCI6IFwicEggb2YgQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIyMDE5LThcIjogXCJDYXJib24gZGlveGlkZSBbUGFydGlhbCBwcmVzc3VyZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIyNzAzLTdcIjogXCJPeHlnZW4gW1BhcnRpYWwgcHJlc3N1cmVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMTk1OS02XCI6IFwiQmljYXJib25hdGUgW01vbGVzL3ZvbHVtZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIyMDI4LTlcIjogXCJDYXJib24gZGlveGlkZSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxMTU1NS0wXCI6IFwiQmFzZSBleGNlc3MgaW4gQXJ0ZXJpYWwgYmxvb2QgYnkgY2FsY3VsYXRpb25cIixcbiAgXCIxOTI1LTdcIjogXCJCaWNhcmJvbmF0ZSBbTW9sZXMvdm9sdW1lXSBpbiBBcnRlcmlhbCBibG9vZCAtLXN0YW5kYXJkXCIsXG4gIFwiMjcxMy02XCI6IFwiT3h5Z2VuIHNhdHVyYXRpb24gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTU1OC02XCI6IFwiRmFzdGluZyBnbHVjb3NlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjM0NS03XCI6IFwiR2x1Y29zZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgSGVtYXRvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI3MTgtN1wiOiBcIkhlbW9nbG9iaW4gW01hc3Mvdm9sdW1lXSBpbiBCbG9vZFwiLFxuICBcIjQ1NDgtNFwiOiBcIkhlbW9nbG9iaW4gQTFjL0hlbW9nbG9iaW4udG90YWwgaW4gQmxvb2RcIixcbiAgXCI2NjkwLTJcIjogXCJMZXVrb2N5dGVzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3NzctM1wiOiBcIlBsYXRlbGV0cyBbLCAgLy8gL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzg5LThcIjogXCJFcnl0aHJvY3l0ZXMgWywgIC8vIC92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc4NS02XCI6IFwiTUNIIFtFbnRpdGljIG1hc3NdIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjcxMS0yXCI6IFwiRW9zaW5vcGhpbHMgWywgIC8vIC92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjQ1NDQtM1wiOiBcIkhlbWF0b2NyaXQgW1ZvbHVtZSBGcmFjdGlvbl0gb2YgQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNTcwMjEtOFwiOiBcIkNCQyBXIEF1dG8gRGlmZmVyZW50aWFsIHBhbmVsIC0gQmxvb2RcIixcbiAgXCIyNDMxNy0wXCI6IFwiSGVtb2dyYW0gYW5kIHBsYXRlbGV0cyBXTyBkaWZmZXJlbnRpYWwgcGFuZWwgLSBCbG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IC8gbGl2ZXIgLyByZW5hbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxOTIwLThcIjogXCJBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc0Mi02XCI6IFwiQWxhbmluZSBhbWlub3RyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMTYwLTBcIjogXCJDcmVhdGluaW5lIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjE2MS04XCI6IFwiQ3JlYXRpbmluZSBbTWFzcy92b2x1bWVdIGluIFVyaW5lXCIsXG4gIFwiMzM5MTQtM1wiOlxuICAgIFwiR2xvbWVydWxhciBmaWx0cmF0aW9uIHJhdGUgW1ZvbHVtZSBSYXRlL0FyZWFdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBDcmVhdGluaW5lLWJhc2VkIGZvcm11bGEgKE1EUkQpLzEuNzMgc3EgTVwiLFxuICBcIjMwOTQtMFwiOiBcIlVyZWEgbml0cm9nZW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMDg0LTFcIjogXCJVcmF0ZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI5NTEtMlwiOiBcIlNvZGl1bSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyODIzLTNcIjogXCJQb3Rhc3NpdW0gW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk3NS0yXCI6IFwiQmlsaXJ1YmluLnRvdGFsIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk2OC03XCI6IFwiQmlsaXJ1YmluLmRpcmVjdCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3NTEtN1wiOiBcIkFsYnVtaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyNTMyLTBcIjogXCJMYWN0YXRlIGRlaHlkcm9nZW5hc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjY3NjgtNlwiOiBcIkFsa2FsaW5lIHBob3NwaGF0YXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzI0LTJcIjogXCJHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc4NjEtNlwiOiBcIkNhbGNpdW0gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIExpcGlkIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjIwOTMtM1wiOiBcIkNob2xlc3Rlcm9sIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjU3MS04XCI6IFwiVHJpZ2x5Y2VyaWRlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjA4NS05XCI6IFwiQ2hvbGVzdGVyb2wgaW4gSERMIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTM0NTctN1wiOiBcIkNob2xlc3Rlcm9sIGluIExETCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBjYWxjdWxhdGlvblwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVGh5cm9pZCAvIGhvcm1vbmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjMwMTYtM1wiOiBcIlRoeXJvdHJvcGluIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMwMjQtN1wiOiBcIlRoeXJveGluZSAoVDQpIGZyZWUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyOTg2LThcIjogXCJUZXN0b3N0ZXJvbmUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCI4MzA5OC00XCI6IFwiRm9sbGl0cm9waW4gW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIFwiODMwOTYtOFwiOiBcIkVzdHJhZGlvbCAoRTIpIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkaWFjIC8gaW5mbGFtbWF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEwODM5LTlcIjogXCJUcm9wb25pbiBJLmNhcmRpYWMgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMzc2Mi02XCI6IFwiTmF0cml1cmV0aWMgcGVwdGlkZS5CIHByb2hvcm1vbmUgTi1UZXJtaW5hbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5ODgtNVwiOiBcIkMgcmVhY3RpdmUgcHJvdGVpbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMzOTU5LThcIjogXCJQcm9jYWxjaXRvbmluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgLyBzZXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI1MTk1LTNcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCI1MTk2LTFcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtVbml0cy92b2x1bWVdIGluIFNlcnVtXCIsXG4gIFwiMTYxMjgtMVwiOiBcIkhlcGF0aXRpcyBDIHZpcnVzIEFiIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCIxMzk1NS0wXCI6IFwiSGVwYXRpdGlzIEMgdmlydXMgQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENvYWd1bGF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjYzMDEtNlwiOiBcIklOUiBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYSBieSBDb2FndWxhdGlvbiBhc3NheVwiLFxuICBcIjE0OTc5LTlcIjogXCJhUFRUIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hIGJ5IENvYWd1bGF0aW9uIGFzc2F5XCIsXG4gIFwiMzAyNDAtNlwiOiBcIkZpYnJpbiBELWRpbWVyIFtNYXNzL3ZvbHVtZV0gaW4gUGxhdGVsZXQgcG9vciBwbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIFZpdGFsIHNpZ25zIChJSEtFMzQwMikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiODMwMi0yXCI6IFwiQm9keSBoZWlnaHRcIixcbiAgXCIyOTQ2My03XCI6IFwiQm9keSB3ZWlnaHRcIixcbiAgXCIzOTE1Ni01XCI6IFwiQm9keSBtYXNzIGluZGV4IChCTUkpIFtSYXRpb11cIixcbiAgXCI4MjgwLTBcIjogXCJXYWlzdCBDaXJjdW1mZXJlbmNlIGF0IHVtYmlsaWN1cyBieSBUYXBlIG1lYXN1cmVcIixcbiAgXCI4NDgwLTZcIjogXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiLFxuICBcIjg0NjItNFwiOiBcIkRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiLFxuICBcIjg1MzU0LTlcIjogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbCB3aXRoIGFsbCBjaGlsZHJlbiBvcHRpb25hbFwiLFxufTtcbiIsICIvKipcbiAqIFB1cmUgcGFyc2luZyBoZWxwZXJzIFx1MjAxNCByZWZlcmVuY2UgcmFuZ2UsIHF1YW50aXR5LCBVQ1VNIHVuaXQgbm9ybWFsaXNhdGlvbi5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvX3BhcnNlcnMucHlgLiBTZWxmLWNvbnRhaW5lZDogbm8gZGVwZW5kZW5jaWVzXG4gKiBvbiBvdGhlciBvYnNlcnZhdGlvbiBtb2R1bGUgcGllY2VzLlxuICpcbiAqIFB1YmxpYyBBUEk6XG4gKiAgIHRvVWN1bSh1bml0KSAgICAgICAgICAgICAgICAgIFx1MjE5MiBjYW5vbmljYWwgVUNVTSB1bml0IHN0cmluZyAob3IgbnVsbClcbiAqICAgcGFyc2VSYW5nZU11bHRpKHJhdywgdW5pdCkgICAgXHUyMTkyIGxpc3Qgb2YgRkhJUiByZWZlcmVuY2VSYW5nZSBlbnRyaWVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9uZSBwZXIgc2V4IHdoZW4gc2V4LXN0cmF0aWZpZWQpXG4gKiAgIHBhcnNlUmFuZ2UocmF3LCB1bml0KSAgICAgICAgIFx1MjE5MiBzaW5nbGUgcmVmZXJlbmNlUmFuZ2UgZW50cnlcbiAqICAgdHJ5UGFyc2VRdWFudGl0eShyYXcsIHVuaXQpICAgXHUyMTkyIEZISVIgUXVhbnRpdHkgZGljdCBvciBudWxsXG4gKi9cblxuY29uc3QgVUNVTV9TWVNURU0gPSBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIjtcblxuLy8gRkhJUiBSNCBRdWFudGl0eS5jb21wYXJhdG9yIGFsbG93ZWQgdmFsdWVzLiBOb3JtYWxpc2UgZnVsbC13aWR0aCBDSktcbi8vIFx1RkYxRSBcdUZGMUMgXHUyMjY3IFx1MjI2NiArIEFTQ0lJIHZhcmlhbnRzIHNvIFwiXHVGRjFFIDQwLjBcIiBzdGlsbCBwYXJzZXMgYXMgYSByZWFsIG51bWJlclxuLy8gaW5zdGVhZCBvZiBmYWxsaW5nIHRocm91Z2ggdG8gdmFsdWVTdHJpbmcgKHdoaWNoIGxvc2VzIHRoZSB1bml0KS5cbmNvbnN0IEZVTExXSURUSF9PUFM6IFJlYWRvbmx5QXJyYXk8W3N0cmluZywgc3RyaW5nXT4gPSBbXG4gIFtcIlx1RkYxRVwiLCBcIj5cIl0sXG4gIFtcIlx1RkYxQ1wiLCBcIjxcIl0sXG4gIFtcIlx1MjI2N1wiLCBcIj49XCJdLFxuICBbXCJcdTIyNjZcIiwgXCI8PVwiXSxcbiAgW1wiXHUyMjY1XCIsIFwiPj1cIl0sXG4gIFtcIlx1MjI2NFwiLCBcIjw9XCJdLFxuXTtcblxuZnVuY3Rpb24gdHJhbnNsYXRlRnVsbHdpZHRoKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBvdXQgPSBzO1xuICBmb3IgKGNvbnN0IFtmcm9tLCB0b10gb2YgRlVMTFdJRFRIX09QUykge1xuICAgIGlmIChvdXQuaW5jbHVkZXMoZnJvbSkpIHtcbiAgICAgIG91dCA9IG91dC5zcGxpdChmcm9tKS5qb2luKHRvKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuY29uc3QgQ09NUEFSQVRPUl9SRSA9IC9eXFxzKig8PXw+PXw8fD4pXFxzKiguKykkLztcblxuLy8gUmVmZXJlbmNlLXJhbmdlIHBhcnNpbmcuIE5ISSBzaGlwcyB0aGUgcmFuZ2UgYXMgcGxhaW4gdGV4dCBsaWtlXG4vLyBcIlszLjg5XVsyNi44XVwiLCBcIls0MF1bXVwiLCBcIltOZWdhdGl2ZV1cIiBvciBcIkFNIDg6MDAgNi4yLTE5LjRcIi5cbmNvbnN0IFJSX0xPV0hJR0hfQlJBQ0tFVFMgPSAvXlxccypcXFtcXHMqKFteXFxdXSopXFxzKlxcXVxccypcXFtcXHMqKFteXFxdXSopXFxzKlxcXVxccyokLztcbmNvbnN0IFJSX0RBU0hfUkFOR0UgPSAvKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqWy1+XHUyMDEzXVxccyooLT9cXGQrKD86XFwuXFxkKyk/KS87XG5jb25zdCBSUl9DT01QQVJBVE9SID0gL15cXHMqKDw9fD49fDx8PilcXHMqKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqJC87XG4vLyBTZXgtc3RyYXRpZmllZCBicmFja2V0ZWQgcmFuZ2UsIGUuZy4gXCJcdTc1Mzc6MTMuNyBcdTU5NzM6MTEuMVwiIFx1MjAxNCB1c2VkIGJ5IHNvbWVcbi8vIGhvc3BpdGFscyBmb3IgaGFlbWF0b2xvZ3kgKEhiLCBSQkMsIEhjdCkuIFB1bGxzIG91dCAoc2V4LCB2YWx1ZSkgcGFpcnMuXG4vLyBUb2xlcmF0ZXMgb3B0aW9uYWwgY29tcGFyYXRvciAoXHUyMjY3L1x1MjI2Ni8+LzwpIGJlZm9yZSB0aGUgbnVtYmVyLlxuY29uc3QgUlJfU0VYX05VTV9HID0gLyhcdTc1MzdcdTYwMjd8XHU1OTczXHU2MDI3fFx1NzUzN3xcdTU5NzN8TXxGKVxccypbOlx1RkYxQV0/XFxzKig/Ols8Plx1MjI2N1x1MjI2Nl09Pyk/XFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pL2c7XG5jb25zdCBSUl9TSU5HTEVfQlJBQ0tFVCA9IC9eXFxzKlxcW1xccyooLis/KVxccypcXF1cXHMqJC87XG5jb25zdCBSUl9RVUFMSVRBVElWRV9QQVJFTiA9XG4gIC9eXFxzKihOb3JtYWx8XHU2QjYzXHU1RTM4fE5vbnJlYWN0aXZlfE5vbi1yZWFjdGl2ZSlcXHMqXFwoXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlxcKVxccyokL2k7XG5cbmNvbnN0IFNFWF9UT19GSElSOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgXHU3NTM3XHU2MDI3OiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgXHU3NTM3OiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgTTogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIFx1NTk3M1x1NjAyNzogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxuICBcdTU5NzM6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbiAgRjogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxufTtcblxuLy8gUHVibGljIHR5cGVzIFx1MjAxNCBGSElSIFF1YW50aXR5IC8gcmVmZXJlbmNlUmFuZ2Ugc2hhcGVzIHVzZWQgZG93bnN0cmVhbS5cbmV4cG9ydCBpbnRlcmZhY2UgUXVhbnRpdHkge1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0Pzogc3RyaW5nO1xuICBzeXN0ZW0/OiBzdHJpbmc7XG4gIGNvZGU/OiBzdHJpbmc7XG4gIGNvbXBhcmF0b3I/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmFuZ2VFbnRyeSB7XG4gIHRleHQ6IHN0cmluZztcbiAgbG93PzogUXVhbnRpdHk7XG4gIGhpZ2g/OiBRdWFudGl0eTtcbiAgYXBwbGllc1RvPzogQXJyYXk8e1xuICAgIGNvZGluZzogQXJyYXk8eyBzeXN0ZW06IHN0cmluZzsgY29kZTogc3RyaW5nOyBkaXNwbGF5OiBzdHJpbmcgfT47XG4gICAgdGV4dDogc3RyaW5nO1xuICB9Pjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFVDVU0gbm9ybWFsaXNhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBOSEkgbGFicyByZXBvcnQgdW5pdHMgaW4gYSBtaXggb2YgVUNVTS1jbGVhbiBzdHJpbmdzICgnbWcvZEwnKSxcbiAqIFRhaXdhbi1zdHlsZSBlcXVpdmFsZW50cyAoJ21FcS9MJyB2cyBVQ1VNICdtZXEvTCcpLCBmdWxsLXdpZHRoIHB1bmN0dWF0aW9uXG4gKiAoJ1x1RkYwNScgdnMgJyUnKSwgYW5kIHBsYWNlaG9sZGVyIHRleHQgKCdcdTcxMjEnKS4gVGhlIFRXTkhJRkhJUiB2YWxpZGF0b3JcbiAqIHJlamVjdHMgZXZlcnl0aGluZyBleGNlcHQgY2Fub25pY2FsIFVDVU0gaW4gUXVhbnRpdHkuY29kZSwgc28gd2VcbiAqIG5vcm1hbGlzZS4gYG51bGxgIG1lYW5zIFwib21pdCBRdWFudGl0eS5jb2RlIGVudGlyZWx5XCIuXG4gKi9cbmNvbnN0IFVDVU1fT1ZFUlJJREVTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudWxsPiA9IHtcbiAgLy8gRnVsbHdpZHRoIFx1MjE5MiBBU0NJSVxuICBcIlx1RkYwNVwiOiBcIiVcIixcbiAgLy8gQ2FzZS1zZW5zaXRpdmUgVUNVTSAoRXEgaXMgJ2VxJywgbm90ICdFcScpXG4gIFwibUVxL0xcIjogXCJtZXEvTFwiLFxuICBcIm1lcS9sXCI6IFwibWVxL0xcIixcbiAgLy8gQlAgcHJvZmlsZSBmaXhlZC12YWx1ZTogbW1bSGddIG5vdCBtbUhnXG4gIG1tSGc6IFwibW1bSGddXCIsXG4gIE1NSEc6IFwibW1bSGddXCIsXG4gIC8vIENvbW1vbiBDaGluZXNlICdubyB1bml0JyBwbGFjZWhvbGRlcnMgXHUyMTkyIGRyb3AgVUNVTSBjb2RlXG4gIFx1NzEyMTogbnVsbCxcbiAgXCJcIjogbnVsbCxcbiAgXCJcdTIwMTRcIjogbnVsbCxcbiAgXCItXCI6IG51bGwsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdG9VY3VtKHVuaXQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF1bml0KSByZXR1cm4gbnVsbDtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChVQ1VNX09WRVJSSURFUywgdW5pdCkpIHtcbiAgICByZXR1cm4gVUNVTV9PVkVSUklERVNbdW5pdF0gPz8gbnVsbDtcbiAgfVxuICByZXR1cm4gdW5pdDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFF1YW50aXR5IGJ1aWxkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIG1ha2VRdWFudGl0eSh2YWx1ZTogbnVtYmVyLCB1bml0OiBzdHJpbmcpOiBRdWFudGl0eSB7XG4gIGNvbnN0IHE6IFF1YW50aXR5ID0geyB2YWx1ZSB9O1xuICBpZiAodW5pdCkge1xuICAgIHEudW5pdCA9IHVuaXQ7XG4gICAgcS5zeXN0ZW0gPSBVQ1VNX1NZU1RFTTtcbiAgICBxLmNvZGUgPSB1bml0O1xuICB9XG4gIHJldHVybiBxO1xufVxuXG5mdW5jdGlvbiB0cnlQYXJzZUZsb2F0KHM6IHN0cmluZyk6IG51bWJlciB8IG51bGwge1xuICBpZiAocyA9PT0gXCJcIiB8fCBzID09IG51bGwpIHJldHVybiBudWxsO1xuICAvLyBNaXJyb3IgUHl0aG9uJ3MgZmxvYXQoKSBcdTIwMTQgYWxsb3cgbGVhZGluZy90cmFpbGluZyB3aGl0ZXNwYWNlLFxuICAvLyBvcHRpb25hbCBzaWduLCBkZWNpbWFsLiBSZWplY3QgaWYgTmFOIE9SIGlmIGFueSBub24tbnVtZXJpYyByZXNpZHVhbFxuICAvLyAoTnVtYmVyKFwiMTJhYmNcIikgcmV0dXJucyBOYU4sIE9LOyBcIjEyICBhYmNcIiBhbHNvIE5hTiwgT0spLlxuICBjb25zdCB0cmltbWVkID0gcy50cmltKCk7XG4gIGlmICh0cmltbWVkID09PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbiA9IE51bWJlcih0cmltbWVkKTtcbiAgaWYgKE51bWJlci5pc05hTihuKSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBuO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgcGFyc2VSYW5nZU11bHRpIC8gcGFyc2VSYW5nZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBMaXN0IHZhcmlhbnQgb2YgcGFyc2VSYW5nZTogZW1pdHMgb25lIGVudHJ5IHBlciBzZXggd2hlbiB0aGUgcmFuZ2UgaXNcbiAqIHNleC1zdHJhdGlmaWVkIChcIltcdTc1Mzc6MTMuNyBcdTU5NzM6MTEuMV1bXHU3NTM3OjE3LjAgXHU1OTczOjE1LjBdXCIpLCBvdGhlcndpc2UgYVxuICogc2luZ2xlLWVsZW1lbnQgbGlzdC4gRWFjaCBlbnRyeSB0YWdnZWQgd2l0aCBhcHBsaWVzVG8gc28gZG93bnN0cmVhbVxuICogY29kZSBjYW4gcGljayB0aGUgcmlnaHQgb25lIGZvciB0aGUgcGF0aWVudCdzIHNleC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmFuZ2VNdWx0aShyYXdSYW5nZTogc3RyaW5nLCB1bml0OiBzdHJpbmcpOiBSYW5nZUVudHJ5W10ge1xuICBjb25zdCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKChyYXdSYW5nZSB8fCBcIlwiKS50cmltKCkpO1xuICBpZiAoIXMpIHJldHVybiBbXTtcblxuICBjb25zdCBsb3dCeVNleDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBjb25zdCBoaWdoQnlTZXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgbGV0IHVzZWRNdWx0aSA9IGZhbHNlO1xuXG4gIGNvbnN0IG0gPSBzLm1hdGNoKFJSX0xPV0hJR0hfQlJBQ0tFVFMpO1xuICBpZiAobSkge1xuICAgIGNvbnN0IGxvd0Jsb2IgPSBtWzFdID8/IFwiXCI7XG4gICAgY29uc3QgaGlnaEJsb2IgPSBtWzJdID8/IFwiXCI7XG4gICAgZm9yIChjb25zdCBzbSBvZiBsb3dCbG9iLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgIGlmIChzbVsxXSAmJiBzbVsyXSkgbG93QnlTZXhbc21bMV1dID0gc21bMl07XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc20gb2YgaGlnaEJsb2IubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgaWYgKHNtWzFdICYmIHNtWzJdKSBoaWdoQnlTZXhbc21bMV1dID0gc21bMl07XG4gICAgfVxuICAgIHVzZWRNdWx0aSA9IE9iamVjdC5rZXlzKGxvd0J5U2V4KS5sZW5ndGggPiAwIHx8IE9iamVjdC5rZXlzKGhpZ2hCeVNleCkubGVuZ3RoID4gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBTaW5nbGUtYnJhY2tldDogZWFjaCBwZXItc2V4IHZhbHVlJ3MgY29tcGFyYXRvciBkZWNpZGVzIGxvdyB2cyBoaWdoLlxuICAgIGNvbnN0IHNpbmdsZSA9IHMubWF0Y2goUlJfU0lOR0xFX0JSQUNLRVQpO1xuICAgIGlmIChzaW5nbGUpIHtcbiAgICAgIGNvbnN0IGlubmVyID0gc2luZ2xlWzFdID8/IFwiXCI7XG4gICAgICBmb3IgKGNvbnN0IHNtIG9mIGlubmVyLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgICAgY29uc3Qgc2V4S2V5ID0gc21bMV0gPz8gXCJcIjtcbiAgICAgICAgY29uc3QgdmFsU3RyID0gc21bMl0gPz8gXCJcIjtcbiAgICAgICAgLy8gRmluZCB0aGUgY29tcGFyYXRvciBpbW1lZGlhdGVseSBwcmVjZWRpbmcgdGhpcyBudW1iZXIuXG4gICAgICAgIC8vIE1pcnJvciB0aGUgUHl0aG9uOiByZWJ1aWxkIGEgcGVyLXNleC1rZXkgc2VhcmNoLlxuICAgICAgICBjb25zdCBwYXQgPSBuZXcgUmVnRXhwKGAke2VzY2FwZVJlZ2V4KHNleEtleSl9XFxcXHMqWzpcdUZGMUFdP1xcXFxzKihbPD5cdTIyNjdcdTIyNjZdPT8pP1xcXFxzKi0/XFxcXGRgKTtcbiAgICAgICAgY29uc3QgY20gPSBpbm5lci5tYXRjaChwYXQpO1xuICAgICAgICBjb25zdCBvcCA9IGNtPy5bMV0gPz8gXCJcIjtcbiAgICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgICAgbG93QnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfSBlbHNlIGlmIChvcCA9PT0gXCI8XCIgfHwgb3AgPT09IFwiPD1cIikge1xuICAgICAgICAgIGhpZ2hCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvd0J5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHVzZWRNdWx0aSA9IE9iamVjdC5rZXlzKGxvd0J5U2V4KS5sZW5ndGggPiAwIHx8IE9iamVjdC5rZXlzKGhpZ2hCeVNleCkubGVuZ3RoID4gMDtcbiAgICB9XG4gIH1cblxuICBpZiAodXNlZE11bHRpKSB7XG4gICAgY29uc3QgZW50cmllczogUmFuZ2VFbnRyeVtdID0gW107XG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSB1bmlvbiBvZiBrZXlzIGFjdHVhbGx5IHNlZW4gXHUyMDE0IHByZXNlcnZlIGluc2VydGlvbiBvcmRlci5cbiAgICBjb25zdCBhbGxTZXhLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgayBvZiBbLi4uT2JqZWN0LmtleXMobG93QnlTZXgpLCAuLi5PYmplY3Qua2V5cyhoaWdoQnlTZXgpXSkge1xuICAgICAgaWYgKCFhbGxTZXhLZXlzLmluY2x1ZGVzKGspKSBhbGxTZXhLZXlzLnB1c2goayk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc2V4S2V5IG9mIGFsbFNleEtleXMpIHtcbiAgICAgIGNvbnN0IG1hcHBpbmcgPSBTRVhfVE9fRkhJUltzZXhLZXldO1xuICAgICAgaWYgKCFtYXBwaW5nKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IFtmaGlyQ29kZSwgZmhpckRpc3BsYXldID0gbWFwcGluZztcbiAgICAgIGNvbnN0IGVudHJ5OiBSYW5nZUVudHJ5ID0ge1xuICAgICAgICB0ZXh0OiByYXdSYW5nZSxcbiAgICAgICAgYXBwbGllc1RvOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2hsNy5vcmcvZmhpci9hZG1pbmlzdHJhdGl2ZS1nZW5kZXJcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBmaGlyQ29kZSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmaGlyRGlzcGxheSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB0ZXh0OiBmaGlyRGlzcGxheSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfTtcbiAgICAgIGlmIChzZXhLZXkgaW4gbG93QnlTZXgpIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQobG93QnlTZXhbc2V4S2V5XSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgICAgaWYgKHNleEtleSBpbiBoaWdoQnlTZXgpIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoaGlnaEJ5U2V4W3NleEtleV0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgICBlbnRyaWVzLnB1c2goZW50cnkpO1xuICAgIH1cbiAgICBpZiAoZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBEZS1kdXAgYnkgRkhJUiBzZXggY29kZSBpbiBjYXNlIGlucHV0IGhhcyBib3RoIFx1NzUzNyBhbmQgXHU3NTM3XHU2MDI3LlxuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgY29uc3Qgb3V0OiBSYW5nZUVudHJ5W10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgZSBvZiBlbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IGMgPSBlLmFwcGxpZXNUbz8uWzBdPy5jb2RpbmdbMF0/LmNvZGU7XG4gICAgICAgIGlmICghYyB8fCBzZWVuLmhhcyhjKSkgY29udGludWU7XG4gICAgICAgIHNlZW4uYWRkKGMpO1xuICAgICAgICBvdXQucHVzaChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb25lID0gcGFyc2VSYW5nZShyYXdSYW5nZSwgdW5pdCk7XG4gIHJldHVybiBvbmUgPyBbb25lXSA6IFtdO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSByZWZlcmVuY2UtcmFuZ2UgdGV4dCBpbnRvIGEgRkhJUiByZWZlcmVuY2VSYW5nZSBlbnRyeS5cbiAqXG4gKiBTdHJhdGVneSBpbiBvcmRlcjpcbiAqICAgMS4gXCJbbG93XVtoaWdoXVwiIGJyYWNrZXRlZCBmb3JtYXQgXHUyMDE0IE5ISSdzIGNhbm9uaWNhbCBzaGFwZS5cbiAqICAgMi4gXCIzLjg5LTI2LjhcIiAvIFwiMy44OX4yNi44XCIgZGFzaCByYW5nZS5cbiAqICAgMy4gXCI+IDQwXCIgLyBcIjwgMC41XCIgc2luZ2xlLXNpZGVkLlxuICogICA0LiBRdWFsaXRhdGl2ZSAoXCJOZWdhdGl2ZVwiLCBcIkFNIDg6MDAgNi4yLTE5LjRcIikgXHUyMDE0IHRleHQtb25seS5cbiAqXG4gKiBTZXgtc3RyYXRpZmllZCBzaGFwZXMgZ28gdGhyb3VnaCBwYXJzZVJhbmdlTXVsdGkuIFJldHVybnMgbnVsbCBvbmx5XG4gKiBmb3IgZW1wdHkgaW5wdXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlKHJhd1JhbmdlOiBzdHJpbmcsIHVuaXQ6IHN0cmluZyk6IFJhbmdlRW50cnkgfCBudWxsIHtcbiAgY29uc3QgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aCgocmF3UmFuZ2UgfHwgXCJcIikudHJpbSgpKTtcbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZW50cnk6IFJhbmdlRW50cnkgPSB7IHRleHQ6IHJhd1JhbmdlIH07XG5cbiAgY29uc3QgbSA9IHMubWF0Y2goUlJfTE9XSElHSF9CUkFDS0VUUyk7XG4gIGlmIChtKSB7XG4gICAgY29uc3QgbG8gPSAobVsxXSA/PyBcIlwiKS50cmltKCk7XG4gICAgY29uc3QgaGkgPSAobVsyXSA/PyBcIlwiKS50cmltKCk7XG4gICAgZm9yIChjb25zdCBbc2lkZSwgc2lkZVZhbF0gb2YgW1xuICAgICAgW1wibG93XCIsIGxvXSxcbiAgICAgIFtcImhpZ2hcIiwgaGldLFxuICAgIF0gYXMgY29uc3QpIHtcbiAgICAgIGlmICghc2lkZVZhbCB8fCBzaWRlVmFsID09PSBcIlx1NzEyMVwiIHx8IHNpZGVWYWwgPT09IFwiXHU3QTdBXHU3NjdEXCIpIGNvbnRpbnVlO1xuXG4gICAgICAvLyAxLiBQbGFpbiBmbG9hdFxuICAgICAgY29uc3QgYXNGbG9hdCA9IHRyeVBhcnNlRmxvYXQoc2lkZVZhbCk7XG4gICAgICBpZiAoYXNGbG9hdCAhPT0gbnVsbCkge1xuICAgICAgICBlbnRyeVtzaWRlXSA9IG1ha2VRdWFudGl0eShhc0Zsb2F0LCB1bml0KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIDIuIERhc2ggcmFuZ2UgXHUyMDE0IG1lYW5pbmdmdWwgb25seSBmb3IgYGxvd2Agc2xvdDsgc3BsaXRzIGludG8gbG93K2hpZ2guXG4gICAgICBjb25zdCBkbSA9IHNpZGVWYWwubWF0Y2goUlJfREFTSF9SQU5HRSk7XG4gICAgICBpZiAoZG0gJiYgc2lkZSA9PT0gXCJsb3dcIiAmJiBlbnRyeS5oaWdoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdjEgPSB0cnlQYXJzZUZsb2F0KGRtWzFdISk7XG4gICAgICAgIGNvbnN0IHYyID0gdHJ5UGFyc2VGbG9hdChkbVsyXSEpO1xuICAgICAgICBpZiAodjEgIT09IG51bGwgJiYgdjIgIT09IG51bGwpIHtcbiAgICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodjEsIHVuaXQpO1xuICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodjIsIHVuaXQpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDMuIENvbXBhcmF0b3IgKFx1MjI2NzYwLCA8PTAuMDQgZXRjLilcbiAgICAgIGNvbnN0IGNtID0gc2lkZVZhbC5tYXRjaChSUl9DT01QQVJBVE9SKTtcbiAgICAgIGlmIChjbSkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChjbVsyXSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IG9wID0gY21bMV07XG4gICAgICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIFwiTm9ybWFsICggWCApXCIgLyBcIk5vbnJlYWN0aXZlICggWCApXCIgXHUyMDE0IFggaXMgdGhlIGN1dG9mZiAoaGlnaCBib3VuZCkuXG4gICAgICBjb25zdCBxbSA9IHNpZGVWYWwubWF0Y2goUlJfUVVBTElUQVRJVkVfUEFSRU4pO1xuICAgICAgaWYgKHFtKSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KHFtWzJdISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBjb25zdCBkYXNoTWF0Y2ggPSBzLm1hdGNoKFJSX0RBU0hfUkFOR0UpO1xuICBpZiAoZGFzaE1hdGNoKSB7XG4gICAgY29uc3QgdjEgPSB0cnlQYXJzZUZsb2F0KGRhc2hNYXRjaFsxXSEpO1xuICAgIGNvbnN0IHYyID0gdHJ5UGFyc2VGbG9hdChkYXNoTWF0Y2hbMl0hKTtcbiAgICBpZiAodjEgIT09IG51bGwgJiYgdjIgIT09IG51bGwpIHtcbiAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2MSwgdW5pdCk7XG4gICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYyLCB1bml0KTtcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgY29uc3QgY21wTWF0Y2ggPSBzLm1hdGNoKFJSX0NPTVBBUkFUT1IpO1xuICBpZiAoY21wTWF0Y2gpIHtcbiAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChjbXBNYXRjaFsyXSEpO1xuICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBvcCA9IGNtcE1hdGNoWzFdO1xuICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIC8vIEZhbGwgdGhyb3VnaDogcXVhbGl0YXRpdmUgb3IgY29tcGxleCBcdTIwMTQgdGV4dC1vbmx5IGlzIEZISVItY29ycmVjdC5cbiAgcmV0dXJuIGVudHJ5O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgdHJ5UGFyc2VRdWFudGl0eSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBQYXJzZSBcIj4gNDAuMFwiIC8gXCI8MC4wMTBcIiAvIFwiMSwyMzQuNVwiIFx1MjE5MiBGSElSIFF1YW50aXR5IHdpdGggY29tcGFyYXRvci5cbiAqIFJldHVybnMgbnVsbCB3aGVuIHRoZSByZXNpZHVhbCBhZnRlciBzdHJpcHBpbmcgYSBjb21wYXJhdG9yIHN0aWxsXG4gKiBpc24ndCBudW1lcmljIFx1MjAxNCBjYWxsZXIgZmFsbHMgYmFjayB0byB2YWx1ZVN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyeVBhcnNlUXVhbnRpdHkoXG4gIHJhd1ZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkLFxuICB1bml0OiBzdHJpbmcsXG4pOiBRdWFudGl0eSB8IG51bGwge1xuICBpZiAocmF3VmFsdWUgPT09IG51bGwgfHwgcmF3VmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XG4gIGxldCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKFN0cmluZyhyYXdWYWx1ZSkudHJpbSgpKTtcbiAgbGV0IGNvbXBhcmF0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjb25zdCBjbSA9IHMubWF0Y2goQ09NUEFSQVRPUl9SRSk7XG4gIGlmIChjbSkge1xuICAgIGNvbXBhcmF0b3IgPSBjbVsxXSA/PyBudWxsO1xuICAgIHMgPSAoY21bMl0gPz8gXCJcIikudHJpbSgpO1xuICB9XG4gIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KHMucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gIGlmICh2ID09PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB1Y3VtQ29kZSA9IHRvVWN1bSh1bml0KTtcbiAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICB2YWx1ZTogdixcbiAgICBzeXN0ZW06IFVDVU1fU1lTVEVNLFxuICB9O1xuICAvLyBRdWFudGl0eS51bml0IChodW1hbi1yZWFkYWJsZSkga2VlcHMgdGhlIG9yaWdpbmFsIE5ISSBsYWJlbCBzbyB1c2Vyc1xuICAvLyBzdGlsbCBzZWUgJ1x1RkYwNScgb3IgJ21FcS9MJyByYXcuIFF1YW50aXR5LmNvZGUgaXMgc3RyaWN0IFVDVU0gbWFjaGluZVxuICAvLyBjb2RlLiBEcm9wIHVuaXQgZGlzcGxheSB3aGVuIGVtcHR5IHNvIHdlIGRvbid0IGVtaXQgXCJ1bml0XCI6IFwiXCIuXG4gIGlmICh1bml0KSB7XG4gICAgcXR5LnVuaXQgPSB1bml0O1xuICB9XG4gIGlmICh1Y3VtQ29kZSAhPT0gbnVsbCkge1xuICAgIHF0eS5jb2RlID0gdWN1bUNvZGU7XG4gIH1cbiAgaWYgKGNvbXBhcmF0b3IpIHtcbiAgICBxdHkuY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gIH1cbiAgcmV0dXJuIHF0eTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cbiIsICIvKipcbiAqIE9ic2VydmF0aW9uIG1hcHBlciBcdTIwMTQgc2luZ2xlLXJvdyBhbmQgcGFuZWwtZ3JvdXBlZCB2YXJpYW50cy5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvb2JzZXJ2YXRpb24ucHlgICgxMjEyIGxpbmVzKS4gSW5jbHVkZXM6XG4gKiAgIC0gbWFwT2JzZXJ2YXRpb24ocmF3LCBwYXRpZW50SWQpIFx1MjE5MiBzaW5nbGUgT2JzZXJ2YXRpb25cbiAqICAgLSBtYXBPYnNlcnZhdGlvbnNHcm91cGVkKGl0ZW1zLCBwYXRpZW50SWQpIFx1MjE5MiBEaWFnbm9zdGljUmVwb3J0ICsgT2JzZXJ2YXRpb25zXG4gKiAgIC0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIFx1MjAxNCBjcm9zcy1wYWdlIGRlZHVwIGtleVxuICogICAtIGZpbmRMb2luYywgYnVpbGRDb2RpbmdzLCBtYXBJbnRlcnByZXRhdGlvbiwgZGVyaXZlSW50ZXJwcmV0YXRpb25cbiAqICAgLSBkZWR1cGVDcm9zc0Zvcm1hdCwgY29tYmluZUJwSXRlbXMsIGdyb3VwQnlPcmRlckNvZGVcbiAqICAgLSBpbmZlclNwZWNpbWVuXG4gKlxuICogRnVuY3Rpb25hbCBwYXJpdHkgd2l0aCB0aGUgUHl0aG9uIGltcGxlbWVudGF0aW9uIGlzIHRoZSBnb2FsLiBGaWVsZFxuICogb3JkZXIgaW4gdGhlIGVtaXR0ZWQgcmVzb3VyY2VzIG1heSBkaWZmZXIgKEpTIG9iamVjdCBsaXRlcmFsIG9yZGVyKVxuICogYnV0IGNvbnRlbnQgaXMgaWRlbnRpY2FsLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQge1xuICBESVNQTEFZX0ZJUlNUX0NPREVTLFxuICBMT0lOQ19ESVNQTEFZLFxuICBMT0lOQ19NQVAsXG4gIE5ISV9UT19MT0lOQyxcbiAgUEFORUxfTE9JTkNfTUFQLFxufSBmcm9tIFwiLi9sb2luYy10YWJsZXNcIjtcbmltcG9ydCB7XG4gIHR5cGUgUXVhbnRpdHksXG4gIHR5cGUgUmFuZ2VFbnRyeSxcbiAgcGFyc2VSYW5nZSxcbiAgcGFyc2VSYW5nZU11bHRpLFxuICB0b1VjdW0sXG4gIHRyeVBhcnNlUXVhbnRpdHksXG59IGZyb20gXCIuL3BhcnNlcnNcIjtcblxuLy8gXHUyNTAwXHUyNTAwIEltYWdpbmcgZGV0ZWN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBJTUFHSU5HX0tFWVdPUkRTOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBbXG4gIFwidWx0cmFzb3VuZFwiLFxuICBcInNvbm9ncmFtXCIsXG4gIFwic29ub2dyYXBoeVwiLFxuICBcImVjaG9cIixcbiAgXCJjdCBcIixcbiAgXCJjdC9cIixcbiAgXCJjdC1cIixcbiAgXCJjb21wdXRlZCB0b21vZ3JhcGh5XCIsXG4gIFwibXJpXCIsXG4gIFwibWFnbmV0aWMgcmVzb25hbmNlXCIsXG4gIFwieC1yYXlcIixcbiAgXCJ4cmF5XCIsXG4gIFwieCByYXlcIixcbiAgXCJtYW1tb2dyYXBoeVwiLFxuICBcIm1hbW1vXCIsXG4gIFwiZWtnXCIsXG4gIFwiZWNnXCIsXG4gIFwiZWxlY3Ryb2NhcmRpb2dyYW1cIixcbiAgXCJlbmRvc2NvcFwiLFxuICBcImNvbG9ub3Njb3BcIixcbiAgXCJnYXN0cm9zY29wXCIsXG4gIFwiYnJvbmNob3Njb3BcIixcbiAgXCJwZXQvY3RcIixcbiAgXCJwZXQgXCIsXG4gIFwic3BlY3RcIixcbiAgXCJcdTVGNzFcdTUwQ0ZcIixcbiAgXCJcdThEODVcdTk3RjNcdTZDRTJcIixcbiAgXCJcdTk2RkJcdTgxNjZcdTY1QjdcdTVDNjRcIixcbiAgXCJcdTY4MzhcdTc4QzFcdTUxNzFcdTYzMkZcIixcbiAgXCJcdTVGQzNcdTk2RkJcdTU3MTZcIixcbiAgXCJcdTUxNjdcdTg5OTZcdTkzRTFcIixcbiAgXCJcdTRFNzNcdTYyM0ZcdTY1MURcdTVGNzFcIixcbl07XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheTogc3RyaW5nLCBjb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgaGF5c3RhY2sgPSBgJHtkaXNwbGF5fSAke2NvZGV9YC50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gSU1BR0lOR19LRVlXT1JEUy5zb21lKChrdykgPT4gaGF5c3RhY2suaW5jbHVkZXMoa3cpKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExPSU5DIGxvb2t1cCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTkhJX0xBQl9DT0RFX1JFID0gL15cXGR7NCw2fVtBLVpdJC87XG5cbmZ1bmN0aW9uIGlzQXNjaWlPbmx5KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocy5jaGFyQ29kZUF0KGkpID4gMTI3KSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJpbWFyeSBMT0lOQyBmb3IgdGhpcyBsYWIuIFBhbmVsLWF3YXJlIGxvb2t1cDpcbiAqICAgQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgXHUyMTkyIHVzZSBOSElfVE9fTE9JTkMgZGlyZWN0bHkuXG4gKiAgIEIuIFBhbmVsIGNvZGUgT1IgdW5rbm93biBjb2RlIFx1MjE5MiB3YWxrIExPSU5DX01BUCBieSBkaXNwbGF5IGtleXdvcmQuXG4gKiAgIEMuIEZhbGxiYWNrOiBwYW5lbC1sZXZlbCBMT0lOQyBmcm9tIE5ISV9UT19MT0lOQyBpZiBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9pbmMoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgd2lucyBvdXRyaWdodC5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMgJiYgIURJU1BMQVlfRklSU1RfQ09ERVMuaGFzKGNvZGUpKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG5cbiAgY29uc3QgY29tYmluZWQgPSBgJHtjb2RlfSAke2Rpc3BsYXl9YC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIEIxLiBQYW5lbC1zcGVjaWZpYyBrZXl3b3JkIG1hcCBydW5zIEJFRk9SRSB0aGUgZ2xvYmFsIG9uZS5cbiAgaWYgKGNvZGUgaW4gUEFORUxfTE9JTkNfTUFQKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXMoUEFORUxfTE9JTkNfTUFQW2NvZGVdISkpIHtcbiAgICAgIGlmIChpc0FzY2lpT25seShrZXkpKSB7XG4gICAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa2V5LnRvTG93ZXJDYXNlKCkpfWApLnRlc3QoY29tYmluZWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNvbWJpbmVkLmluY2x1ZGVzKGtleS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICByZXR1cm4gbG9pbmM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQi4gRGlzcGxheS1rZXl3b3JkIHNlYXJjaC5cbiAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXMoTE9JTkNfTUFQKSkge1xuICAgIGlmIChpc0FzY2lpT25seShrZXkpKSB7XG4gICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICByZXR1cm4gbG9pbmM7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgIHJldHVybiBsb2luYztcbiAgICB9XG4gIH1cblxuICAvLyBDLiBQYW5lbCBjb2RlIHdpdGggbm8gcmVjb2duaXNlZCBpdGVtIGRpc3BsYXkgXHUyMTkyIGZhbGwgYmFjay5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMpIHtcbiAgICByZXR1cm4gTkhJX1RPX0xPSU5DW2NvZGVdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIE9ic2VydmF0aW9uLmNvZGUuY29kaW5nW10gbGlzdC5cbiAqIFByaW9yaXR5OiBMT0lOQyBcdTIxOTIgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgbG9jYWwgZmFsbGJhY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvZGluZ3MoXG4gIGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGRpc3BsYXk6IHN0cmluZyxcbiAgbG9pbmM6IHN0cmluZyB8IG51bGwsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10ge1xuICBjb25zdCBjb2RpbmdzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10gPSBbXTtcbiAgaWYgKGxvaW5jKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsXG4gICAgICBjb2RlOiBsb2luYyxcbiAgICAgIGRpc3BsYXk6IExPSU5DX0RJU1BMQVlbbG9pbmNdID8/IGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgY29uc3QgY29kZVN0ciA9IChjb2RlID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKGNvZGVTdHIgJiYgTkhJX0xBQl9DT0RFX1JFLnRlc3QoY29kZVN0cikpIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLk5ISV9NRURJQ0FMX09SREVSX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyLFxuICAgICAgZGlzcGxheSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERSxcbiAgICAgIGNvZGU6IGNvZGVTdHIgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGNvZGluZ3M7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBJbnRlcnByZXRhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU5URVJQX1NZUyA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92My1PYnNlcnZhdGlvbkludGVycHJldGF0aW9uXCI7XG5cbmZ1bmN0aW9uIGludGVycENvZGluZyhjb2RlOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICByZXR1cm4geyBzeXN0ZW06IElOVEVSUF9TWVMsIGNvZGUsIGRpc3BsYXkgfTtcbn1cblxuY29uc3QgSU5URVJQX1RBQkxFOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgaGlnaDogW1wiSFwiLCBcIkhpZ2hcIl0sXG4gIGxvdzogW1wiTFwiLCBcIkxvd1wiXSxcbiAgbm9ybWFsOiBbXCJOXCIsIFwiTm9ybWFsXCJdLFxuICBjcml0aWNhbDogW1wiQUFcIiwgXCJDcml0aWNhbCBhYm5vcm1hbFwiXSxcbiAgYWJub3JtYWw6IFtcIkFcIiwgXCJBYm5vcm1hbFwiXSxcbiAgcG9zaXRpdmU6IFtcIlBPU1wiLCBcIlBvc2l0aXZlXCJdLFxuICBuZWdhdGl2ZTogW1wiTkVHXCIsIFwiTmVnYXRpdmVcIl0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWFwSW50ZXJwcmV0YXRpb24oXG4gIGludGVycDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgY29uc3Qga2V5ID0gKGludGVycCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBlbnRyeSA9IElOVEVSUF9UQUJMRVtrZXldO1xuICBpZiAoIWVudHJ5KSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGludGVycENvZGluZyhlbnRyeVswXSwgZW50cnlbMV0pO1xufVxuXG4vLyBQb3NpdGl2ZSBtYXJrZXJzIFx1MjAxNCBcInRoaXMgaXMgZGV0ZWN0ZWQgLyBhYm5vcm1hbFwiLlxuY29uc3QgUE9TX01BUktFUlMgPVxuICAvXlxccyooPzpwb3NpdGl2ZXxwb3N8cmVhY3RpdmV8ZGV0ZWN0ZWR8YWJub3JtYWx8cHJlc2VudHx0cmFjZXxbMS00XT9cXHMqXFwrKD86XFxzKltcXCtcXC1dKSopXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG4vLyBOZWdhdGl2ZSBtYXJrZXJzIFx1MjAxNCBleHBsaWNpdGx5IG5vcm1hbC9hYnNlbnQuXG5jb25zdCBORUdfTUFSS0VSUyA9XG4gIC9eXFxzKig/Om5lZ2F0aXZlfG5lZ3xub25yZWFjdGl2ZXxub25bLVxcc10/cmVhY3RpdmV8bm90Wy1cXHNdP2RldGVjdGVkfG5kfGFic2VudHxub25lfG5vcm1hbHwwfFstXHUyMDE0XHUyMDEzXSspXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG5mdW5jdGlvbiBjbGFzc2lmeVF1YWxpdGF0aXZlKHRleHQ6IHVua25vd24pOiBcInBvc1wiIHwgXCJuZWdcIiB8IG51bGwge1xuICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IFN0cmluZyh0ZXh0KS50cmltKCk7XG4gIGlmIChzLnN0YXJ0c1dpdGgoXCJbXCIpICYmIHMuZW5kc1dpdGgoXCJdXCIpKSB7XG4gICAgcyA9IHMuc2xpY2UoMSwgLTEpLnRyaW0oKTtcbiAgfVxuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBpZiAoTkVHX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwibmVnXCI7XG4gIGlmIChQT1NfTUFSS0VSUy50ZXN0KHMpKSByZXR1cm4gXCJwb3NcIjtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgdmFsdWVSYXc6IHN0cmluZyxcbiAgcXR5OiBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgcnI6IFJhbmdlRW50cnkgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIC8vIDEuIE51bWVyaWMgcGF0aC5cbiAgaWYgKHF0eSAmJiB0eXBlb2YgcXR5LnZhbHVlID09PSBcIm51bWJlclwiICYmIHJyKSB7XG4gICAgY29uc3QgdiA9IHF0eS52YWx1ZTtcbiAgICBjb25zdCBsbyA9IHJyLmxvdz8udmFsdWU7XG4gICAgY29uc3QgaGkgPSByci5oaWdoPy52YWx1ZTtcbiAgICBpZiAodHlwZW9mIGhpID09PSBcIm51bWJlclwiICYmIHYgPiBoaSkgcmV0dXJuIGludGVycENvZGluZyhcIkhcIiwgXCJIaWdoXCIpO1xuICAgIGlmICh0eXBlb2YgbG8gPT09IFwibnVtYmVyXCIgJiYgdiA8IGxvKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTFwiLCBcIkxvd1wiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiIHx8IHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyAyLiBRdWFsaXRhdGl2ZSBwYXRoLlxuICBjb25zdCB2YWxLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZSh2YWx1ZVJhdyk7XG4gIGNvbnN0IHJlZlRleHQgPSBycj8udGV4dCA/PyBcIlwiO1xuICBjb25zdCByZWZLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZShyZWZUZXh0KTtcbiAgaWYgKHZhbEtpbmQgPT09IG51bGwpIHJldHVybiBudWxsO1xuICBpZiAocmVmS2luZCA9PT0gXCJuZWdcIikge1xuICAgIGlmICh2YWxLaW5kID09PSBcInBvc1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiQVwiLCBcIkFibm9ybWFsXCIpO1xuICAgIGlmICh2YWxLaW5kID09PSBcIm5lZ1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTlwiLCBcIk5vcm1hbFwiKTtcbiAgfVxuICByZXR1cm4gdmFsS2luZCA9PT0gXCJwb3NcIiA/IGludGVycENvZGluZyhcIlBPU1wiLCBcIlBvc2l0aXZlXCIpIDogaW50ZXJwQ29kaW5nKFwiTkVHXCIsIFwiTmVnYXRpdmVcIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBDYW5vbmljYWwgbGFiIGtleSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTEFCX1NZTk9OWU1TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBEaWFiZXRlc1xuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXHU3Q0Q2XHU1MzE2XHU4ODQwXHU4MjcyXHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCJIQkExQ1wiLFxuICBcIkdMWUNBVEVEIEhFTU9HTE9CSU5cIjogXCJIQkExQ1wiLFxuICBIQkExQzogXCJIQkExQ1wiLFxuICBBMUM6IFwiSEJBMUNcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcIkZBU1RJTkcgR0xVQ09TRVwiOiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcdTg0NjFcdTg0MDRcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBcdTg4NDBcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBHTFVDT1NFOiBcIkdMVUNPU0VcIixcbiAgLy8gQ0JDXG4gIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJXQkNcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIldCQ1wiLFxuICBXQkM6IFwiV0JDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJSQkNcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIlJCQ1wiLFxuICBSQkM6IFwiUkJDXCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCJIRU1PR0xPQklOXCIsXG4gIEhFTU9HTE9CSU46IFwiSEVNT0dMT0JJTlwiLFxuICBIR0I6IFwiSEVNT0dMT0JJTlwiLFxuICBcdTg4NDBcdTVCQjlcdTdBNERcdTZCRDQ6IFwiSEVNQVRPQ1JJVFwiLFxuICBIRU1BVE9DUklUOiBcIkhFTUFUT0NSSVRcIixcbiAgSENUOiBcIkhFTUFUT0NSSVRcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIlBMQVRFTEVUXCIsXG4gIFBMQVRFTEVUOiBcIlBMQVRFTEVUXCIsXG4gIFBMVDogXCJQTEFURUxFVFwiLFxuICAvLyBDQkMgaW5kaWNlcyAoMTAtY2hhciBhbmQgNy1jaGFyIENKSyBmb3JtcyBiZWF0IGJhcmUgXHU3RDA1XHU4ODQwXHU3NDAzKVxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjBcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjA6IFwiTUNIXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1NkZDM1x1NUVBNjogXCJNQ0hDXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1OUFENFx1N0E0RDogXCJNQ1ZcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzXHU1MjA2XHU1RTAzXHU1QkVDXHU1RUE2OiBcIlJEV1wiLFxuICBNQ1Y6IFwiTUNWXCIsXG4gIE1DSDogXCJNQ0hcIixcbiAgTUNIQzogXCJNQ0hDXCIsXG4gIFJEVzogXCJSRFdcIixcbiAgLy8gQ0JDIGRpZmZlcmVudGlhbFxuICBcdTU1RENcdTRFMkRcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiTkVVVFJPUEhJTFwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTkxNzhcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTlFN0NcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiQkFTT1BISUxcIixcbiAgXHU2RENCXHU1REY0XHU3NDAzOiBcIkxZTVBIT0NZVEVcIixcbiAgXHU1NUFFXHU2ODM4XHU3NDAzOiBcIk1PTk9DWVRFXCIsXG4gIEVPU0lOT1BISUxTOiBcIkVPU0lOT1BISUxcIixcbiAgRU9TSU5PUEhJTDogXCJFT1NJTk9QSElMXCIsXG4gIE5FVVRST1BISUxTOiBcIk5FVVRST1BISUxcIixcbiAgTkVVVFJPUEhJTDogXCJORVVUUk9QSElMXCIsXG4gIEJBU09QSElMUzogXCJCQVNPUEhJTFwiLFxuICBCQVNPUEhJTDogXCJCQVNPUEhJTFwiLFxuICBMWU1QSE9DWVRFUzogXCJMWU1QSE9DWVRFXCIsXG4gIExZTVBIT0NZVEU6IFwiTFlNUEhPQ1lURVwiLFxuICBNT05PQ1lURVM6IFwiTU9OT0NZVEVcIixcbiAgTU9OT0NZVEU6IFwiTU9OT0NZVEVcIixcbiAgLy8gTGlwaWQgXHUyMDE0IExETC9IREwgbXVzdCBwcmVjZWRlIGJhcmUgQ0hPTEVTVEVST0wuXG4gIFwiTERMIENIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ0hPTEVTVEVST0xcIjogXCJMRExfQ1wiLFxuICBcIkhETCBDSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFwiSERMLUNIT0xFU1RFUk9MXCI6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiTERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkhETF9DXCIsXG4gIFx1ODg0MFx1NkUwNVx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlRPVEFMIENIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTEVTVEVST0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTDogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTRFMDlcdTkxNzhcdTc1MThcdTZDQjlcdTkxNkY6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFRSSUdMWUNFUklERTogXCJUUklHTFlDRVJJREVcIixcbiAgXCJIREwtQ1wiOiBcIkhETF9DXCIsXG4gIEhETDogXCJIRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiSERMX0NcIixcbiAgXCJMREwtQyhESVJFQ1QpXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ1wiOiBcIkxETF9DXCIsXG4gIExETDogXCJMRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiTERMX0NcIixcbiAgLy8gUmVuYWwgXHUyMDE0IHVyaW5lIGNyZWF0aW5pbmUgdmFyaWFudHMgYmVmb3JlIHNlcnVtLlxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlVSSU5FIENSRUFUSU5JTkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVBXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNTBcdTkxNzg6IFwiQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoQilcIjogXCJDUkVBVElOSU5FXCIsXG4gIENSRUFUSU5JTkU6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JUTjogXCJDUkVBVElOSU5FXCIsXG4gIEVHRlI6IFwiRUdGUlwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiQlVOXCIsXG4gIEJVTjogXCJCVU5cIixcbiAgXHU1QzNGXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlVSSU5FX1BIXCIsXG4gIFx1NUMzRlx1NkRCMlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiUEhcIixcbiAgXHU1QzNGXHU5MTc4OiBcIlVSSUNfQUNJRFwiLFxuICBcIlVSSUMgQUNJRFwiOiBcIlVSSUNfQUNJRFwiLFxuICBVUklDX0FDSUQ6IFwiVVJJQ19BQ0lEXCIsXG4gIC8vIExpdmVyXG4gIEFTVDogXCJBU1RcIixcbiAgQUxUOiBcIkFMVFwiLFxuICBHT1Q6IFwiQVNUXCIsXG4gIEdQVDogXCJBTFRcIixcbiAgXHU4MUJEXHU3RDA1XHU3RDIwOiBcIkJJTElSVUJJTlwiLFxuICBCSUxJUlVCSU46IFwiQklMSVJVQklOXCIsXG4gIFx1NzY3RFx1ODZDQlx1NzY3RDogXCJBTEJVTUlOXCIsXG4gIEFMQlVNSU46IFwiQUxCVU1JTlwiLFxuICAvLyBDYXJkaWFjXG4gIFx1NUZDM1x1ODA4Q1x1NjVDQlx1OEY0OVx1ODZDQlx1NzY3RDogXCJUUk9QT05JTlwiLFxuICBUUk9QT05JTjogXCJUUk9QT05JTlwiLFxuICBCTlA6IFwiQk5QXCIsXG4gIFx1NUZDM1x1ODFERjogXCJUUk9QT05JTlwiLFxuICAvLyBUaHlyb2lkXG4gIFx1NzUzMlx1NzJDMFx1ODE3QVx1NTIzQVx1NkZDMFx1N0QyMDogXCJUU0hcIixcbiAgVFNIOiBcIlRTSFwiLFxuICBcdTZFMzhcdTk2RTJcdTc1MzJcdTcyQzBcdTgxN0FcdTdEMjA6IFwiRlJFRV9UNFwiLFxuICBcIkZSRUUgVDRcIjogXCJGUkVFX1Q0XCIsXG4gIEZUNDogXCJGUkVFX1Q0XCIsXG4gIC8vIE1pc2NcbiAgQ1x1NTNDRFx1NjFDOVx1NjAyN1x1ODZDQlx1NzY3RDogXCJDUlBcIixcbiAgXCJDLVJFQUNUSVZFIFBST1RFSU5cIjogXCJDUlBcIixcbiAgQ1JQOiBcIkNSUFwiLFxuICBcIkhTLUNSUFwiOiBcIkhTX0NSUFwiLFxuICBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUY6IFwiUFNBXCIsXG4gIFBTQTogXCJQU0FcIixcbiAgXHU5NDM1XHU4NkNCXHU3NjdEOiBcIkZFUlJJVElOXCIsXG4gIEZFUlJJVElOOiBcIkZFUlJJVElOXCIsXG4gIFx1ODQ0OVx1OTE3ODogXCJGT0xBVEVcIixcbiAgRk9MQVRFOiBcIkZPTEFURVwiLFxuICBcdTdEQURcdTc1MUZcdTdEMjBCMTI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVQgQjEyXCI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVRBTUlOIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFx1NzZBRVx1OENFQVx1N0QyMDogXCJDT1JUSVNPTFwiLFxuICBDT1JUSVNPTDogXCJDT1JUSVNPTFwiLFxuICBcdTY4ODVcdTZCRDI6IFwiUlBSXCIsXG4gIFJQUjogXCJSUFJcIixcbiAgXHU5NkIxXHU3NDAzXHU4M0NDXHU2Mjk3XHU1MzlGOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBDUllQQUc6IFwiQ1JZUFRPQ09DQ0FMX0FHXCIsXG4gIFx1ODg0MFx1NkMyODogXCJBTU1PTklBXCIsXG4gIEFNTU9OSUE6IFwiQU1NT05JQVwiLFxuICBcdTUxRERcdTg4NDBcdTkxNzZcdTUzOUZcdTY2NDJcdTk1OTM6IFwiUFRcIixcbiAgQVBUVDogXCJBUFRUXCIsXG4gIElOUjogXCJJTlJcIixcbn07XG5cbi8vIFByZS1zb3J0IGtleXMgbG9uZ2VzdC1maXJzdCBzbyBsb25nZXIvbW9yZS1zcGVjaWZpYyBtYXRjaGVzIHdpbi5cbmNvbnN0IExBQl9TWU5PTllNX0tFWVNfU09SVEVEID0gT2JqZWN0LmtleXMoTEFCX1NZTk9OWU1TKS5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbExhYktleShkaXNwbGF5OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFkaXNwbGF5KSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcyA9IGRpc3BsYXkudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBcIlwiO1xuICBjb25zdCBzVXBwZXIgPSBzLnRvVXBwZXJDYXNlKCk7XG4gIGZvciAoY29uc3Qga2V5IG9mIExBQl9TWU5PTllNX0tFWVNfU09SVEVEKSB7XG4gICAgY29uc3Qga3UgPSBrZXkudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa3UpKSB7XG4gICAgICAvLyBMZWFkaW5nIHdvcmQtYm91bmRhcnkgb25seSBcdTIwMTQgXCJBU1RcIiBpbnNpZGUgXCJESUFTVE9MSUNcIiBzaG91bGQgbm90IG1hdGNoLlxuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrdSl9YCkudGVzdChzVXBwZXIpKSB7XG4gICAgICAgIHJldHVybiBMQUJfU1lOT05ZTVNba2V5XSE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzVXBwZXIuaW5jbHVkZXMoa3UpKSB7XG4gICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBhbmVsIGdyb3VwaW5nIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICAgIGlmIChjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmKSBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGlzRW5nbGlzaERvbWluYW50KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgbGF0aW4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIHtcbiAgICBjb25zdCBjcCA9IGNoLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGNwIDwgMTI4ICYmIC9bQS1aYS16XS8udGVzdChjaCkpIGxhdGluKys7XG4gIH1cbiAgcmV0dXJuIGxhdGluID49IDIgJiYgY2prQ2hhcnMocykgPT09IDA7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAodjogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGxldCBzID0gU3RyaW5nKHYpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXChbXildKlxcKS9nLCBcIlwiKS50cmltKCk7XG4gIHMgPSBzLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWx1ZSkudHJpbSgpO1xuICByZXR1cm4gcyAhPT0gXCJcIiAmJiBzICE9PSBcIlx1MjAxNFwiICYmIHMgIT09IFwiLVwiICYmIHMgIT09IFwiTi9BXCIgJiYgcyAhPT0gXCJudWxsXCI7XG59XG5cbmNvbnN0IE1FQU5JTkdGVUxfSU5URVJQUyA9IG5ldyBTZXQoW1xuICBcIm5vcm1hbFwiLFxuICBcImFibm9ybWFsXCIsXG4gIFwiaGlnaFwiLFxuICBcImxvd1wiLFxuICBcImNyaXRpY2FsXCIsXG4gIFwicG9zaXRpdmVcIixcbiAgXCJuZWdhdGl2ZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIGRlZHVwZVBhbmVsSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5VmFsdWUgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgayA9IG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAoaXQudmFsdWUpO1xuICAgIGNvbnN0IGdyb3VwID0gYnlWYWx1ZS5nZXQoayk7XG4gICAgaWYgKGdyb3VwKSBncm91cC5wdXNoKGl0KTtcbiAgICBlbHNlIGJ5VmFsdWUuc2V0KGssIFtpdF0pO1xuICB9XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgZ3JvdXAgb2YgYnlWYWx1ZS52YWx1ZXMoKSkge1xuICAgIGlmIChncm91cC5sZW5ndGggPT09IDEpIHtcbiAgICAgIG91dC5wdXNoKGdyb3VwWzBdISk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgY2prSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGNqa0NoYXJzKFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpID49IDIpO1xuICAgIGNvbnN0IGVuSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGlzRW5nbGlzaERvbWluYW50KFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpKTtcbiAgICBpZiAoY2prSXRlbXMubGVuZ3RoID4gMCAmJiBlbkl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIG91dC5wdXNoKGVuSXRlbXNbMF0hKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0LnB1c2goLi4uZ3JvdXApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zOiBhbnlbXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgcmF3IG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFyYXcgfHwgdHlwZW9mIHJhdyAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gICAgaWYgKGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheSwgcmF3LmNvZGUgfHwgXCJcIikpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICAgIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICAgIGNvbnN0IGhhc01lYW5pbmdmdWxJbnRlcnAgPSBNRUFOSU5HRlVMX0lOVEVSUFMuaGFzKGludGVycCk7XG4gICAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgY29udGludWU7XG4gICAgb3V0LnB1c2gocmF3KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBkZWR1cGVDcm9zc0Zvcm1hdChpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3Qgb3JkZXJDb2RlID0gKGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nID0+XG4gICAgKChpdC5vcmRlcl9jb2RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG5cbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgbGV0IGlkeENvdW50ZXIgPSAwO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICBjb25zdCB2ID0gU3RyaW5nKGl0ZW0udmFsdWUgPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHVuaXQgPSAoKGl0ZW0udW5pdCBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgICBpZiAoIXYpIHtcbiAgICAgIGJ5S2V5LnNldChgX19ub19kZWR1cF9ffCR7aWR4Q291bnRlcisrfWAsIGl0ZW0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IFtcbiAgICAgIChpdGVtLmRhdGUgYXMgc3RyaW5nKSA/PyBcIlwiLFxuICAgICAgdi50b0xvd2VyQ2FzZSgpLFxuICAgICAgdW5pdC50b0xvd2VyQ2FzZSgpLFxuICAgICAgb3JkZXJDb2RlKGl0ZW0pLFxuICAgIF0uam9pbihcInxcIik7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBieUtleS5nZXQoa2V5KTtcbiAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvLyBQcmVmZXIgdGhlIHJvdyB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGNsaW5pY2FsIHJlYWRzKS5cbiAgICBsZXQgcHJpbWFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBsZXQgc2Vjb25kYXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIGlmIChjamtDaGFycyhpdGVtLmRpc3BsYXkgPz8gXCJcIikgPCBjamtDaGFycyhleGlzdGluZy5kaXNwbGF5ID8/IFwiXCIpKSB7XG4gICAgICBwcmltYXJ5ID0gaXRlbTtcbiAgICAgIHNlY29uZGFyeSA9IGV4aXN0aW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmltYXJ5ID0gZXhpc3Rpbmc7XG4gICAgICBzZWNvbmRhcnkgPSBpdGVtO1xuICAgIH1cbiAgICBjb25zdCBtZXJnZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgW1wib3JkZXJfY29kZVwiLCBcIm9yZGVyX25hbWVcIiwgXCJob3NwaXRhbFwiLCBcImNvZGVcIl0pIHtcbiAgICAgIGlmICghbWVyZ2VkW2ZdICYmIHNlY29uZGFyeVtmXSkgbWVyZ2VkW2ZdID0gc2Vjb25kYXJ5W2ZdO1xuICAgIH1cbiAgICBieUtleS5zZXQoa2V5LCBtZXJnZWQpO1xuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKGJ5S2V5LnZhbHVlcygpKTtcbn1cblxuaW50ZXJmYWNlIEJwQ29tcG9uZW50IHtcbiAgbG9pbmM6IHN0cmluZztcbiAgZGlzcGxheTogc3RyaW5nO1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0OiBzdHJpbmc7XG4gIGludGVycHJldGF0aW9uX3RleHQ6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gY29tYmluZUJwSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgeyBzeXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT47IGRpYXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT4gfVxuICA+KCk7XG4gIGNvbnN0IHBhc3NUaHJvdWdoOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGRpc3AgPSBTdHJpbmcoaXQuZGlzcGxheSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGtleSA9IGAke2l0LmRhdGUgPz8gXCJcIn18JHtpdC5ob3NwaXRhbCA/PyBcIlwifWA7XG4gICAgaWYgKGRpc3AuaW5jbHVkZXMoXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5zeXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIGlmIChkaXNwLmluY2x1ZGVzKFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpKSB7XG4gICAgICBjb25zdCB2ID0gYnlLZXkuZ2V0KGtleSkgPz8ge307XG4gICAgICB2LmRpYXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhc3NUaHJvdWdoLnB1c2goaXQpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgcGFydHMgb2YgYnlLZXkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBzID0gcGFydHMuc3lzdG9saWM7XG4gICAgY29uc3QgZCA9IHBhcnRzLmRpYXN0b2xpYztcbiAgICBjb25zdCBwcmltYXJ5ID0gcyA/PyBkO1xuICAgIGlmICghcHJpbWFyeSkgY29udGludWU7XG4gICAgY29uc3QgY29tcG9uZW50czogQnBDb21wb25lbnRbXSA9IFtdO1xuICAgIGNvbnN0IHRyeUFkZCA9IChzcmM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQsIGxvaW5jOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFzcmMpIHJldHVybjtcbiAgICAgIGNvbnN0IHZhbCA9IHNyYy52YWx1ZTtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBcIlwiIHx8IHZhbCA9PT0gXCItXCIgfHwgdmFsID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgICBjb25zdCBudW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcodmFsKS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG51bSkpIHJldHVybjtcbiAgICAgIGNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgIGxvaW5jLFxuICAgICAgICBkaXNwbGF5LFxuICAgICAgICB2YWx1ZTogbnVtLFxuICAgICAgICB1bml0OiBzcmMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgaW50ZXJwcmV0YXRpb25fdGV4dDogc3JjLnJlZmVyZW5jZV9yYW5nZSB8fCBcIlwiLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB0cnlBZGQocywgXCI4NDgwLTZcIiwgXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKTtcbiAgICB0cnlBZGQoZCwgXCI4NDYyLTRcIiwgXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBjb25zdCBjb21iaW5lZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4ucHJpbWFyeSB9O1xuICAgIGNvbWJpbmVkLmRpc3BsYXkgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfbmFtZSA9IFwiQmxvb2QgUHJlc3N1cmVcIjtcbiAgICBjb21iaW5lZC5jYXRlZ29yeSA9IFwidml0YWwtc2lnbnNcIjtcbiAgICBjb21iaW5lZC5icF9jb21wb25lbnRzID0gY29tcG9uZW50cztcbiAgICBjb21iaW5lZC5icF9wYW5lbF9sb2luYyA9IFwiODUzNTQtOVwiO1xuICAgIGNvbWJpbmVkLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIGNvbWJpbmVkLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgcGFzc1Rocm91Z2gucHVzaChjb21iaW5lZCk7XG4gIH1cblxuICByZXR1cm4gcGFzc1Rocm91Z2g7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTcGVjaW1lbiBpbmZlcmVuY2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IFNQRUNJTUVOX1JVTEVTOiBSZWFkb25seUFycmF5PFtSZWdFeHAsIHN0cmluZ10+ID0gW1xuICBbL1x1NUMzRnx1cmluZXx1cmluYWx5L2ksIFwiVXJpbmVcIl0sXG4gIFsvXHU3Q0RFfFx1NEZCRlx1NkY1Qlx1ODg0MHxzdG9vbHxmZWNhbHxmYWVjYWx8b2NjdWx0XFxzKmJsb29kL2ksIFwiU3Rvb2xcIl0sXG4gIFsvXHU3NUYwfHNwdXR1bS9pLCBcIlNwdXR1bVwiXSxcbiAgWy9cdTgxNjZcdTgxMEFcdTZEQjJ8Y3NmfGNlcmVicm9zcGluYWwvaSwgXCJDZXJlYnJvc3BpbmFsIGZsdWlkXCJdLFxuICBbL1x1ODBGOFx1NkMzNHxwbGV1cmFsL2ksIFwiUGxldXJhbCBmbHVpZFwiXSxcbiAgWy9cdTgxNzlcdTZDMzR8YXNjaXRlc3xwZXJpdG9uZWFsL2ksIFwiUGVyaXRvbmVhbCBmbHVpZFwiXSxcbiAgWy9cdTk2NzBcdTkwNTN8XHU2MkI5XHU3MjQ3fGNlcnZpY2FsfHBhcFxccypzbWVhcnx2YWdpbmFsL2ksIFwiQ2VydmljYWwvVmFnaW5hbFwiXSxcbiAgWy9cdTk1RENcdTdCQzBcdTZEQjJ8c3lub3ZpYWx8am9pbnRcXHMqZmx1aWQvaSwgXCJTeW5vdmlhbCBmbHVpZFwiXSxcbiAgWy9cdTdGOEFcdTZDMzR8YW1uaW90aWMvaSwgXCJBbW5pb3RpYyBmbHVpZFwiXSxcbiAgWy9cdTlBQThcdTlBRDN8Ym9uZVxccyptYXJyb3cvaSwgXCJCb25lIG1hcnJvd1wiXSxcbl07XG5cbmZ1bmN0aW9uIGluZmVyU3BlY2ltZW4oLi4uaGludHM6IEFycmF5PHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ+KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGJsb2IgPSBoaW50c1xuICAgIC5maWx0ZXIoKGgpOiBoIGlzIHN0cmluZyA9PiBCb29sZWFuKGgpKVxuICAgIC5qb2luKFwiIFwiKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIWJsb2IpIHJldHVybiBudWxsO1xuICBmb3IgKGNvbnN0IFtwYXR0ZXJuLCBsYWJlbF0gb2YgU1BFQ0lNRU5fUlVMRVMpIHtcbiAgICBpZiAocGF0dGVybi50ZXN0KGJsb2IpKSByZXR1cm4gbGFiZWw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNYXAgc2luZ2xlIE9ic2VydmF0aW9uIChub24tZ3JvdXBlZCBwYXRoKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIGNvZGUpKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICBpZiAoIWhhc1ZhbHVlICYmICFoYXNNZWFuaW5nZnVsSW50ZXJwKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSwgcmF3LmRhdGUgPz8gXCJcIik7XG4gIGNvbnN0IGxvaW5jID0gZmluZExvaW5jKGNvZGUsIGRpc3BsYXkpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IFwibGFib3JhdG9yeVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCByciA9IHBhcnNlUmFuZ2UoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnIpIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gW3JyXTtcbiAgfVxuXG4gIGNvbnN0IGludGVycENvZGluZ1Jlc3VsdCA9XG4gICAgbWFwSW50ZXJwcmV0YXRpb24oaW50ZXJwKSB8fFxuICAgIGRlcml2ZUludGVycHJldGF0aW9uKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCA/IFN0cmluZyh2YWx1ZSkgOiBcIlwiLFxuICAgICAgcmVzb3VyY2UudmFsdWVRdWFudGl0eSBhcyBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgICAgIChyZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSBhcyBSYW5nZUVudHJ5W10gfCB1bmRlZmluZWQpPy5bMF0sXG4gICAgKTtcbiAgaWYgKGludGVycENvZGluZ1Jlc3VsdCkge1xuICAgIHJlc291cmNlLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbaW50ZXJwQ29kaW5nUmVzdWx0XSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJ1aWxkIG9ic2VydmF0aW9uIHdpdGhpbiBhIHBhbmVsICh3aXRoIGNhbm9uaWNhbCBsYWIga2V5IGlkKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gYnVpbGRPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbiAgcGFuZWxDb2RlOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIC8vIEJQIHBhbmVsOiBwcmVidWlsdCBieSBjb21iaW5lQnBJdGVtcy5cbiAgaWYgKHJhdy5icF9jb21wb25lbnRzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJvYnNcIiwgXCJCUF9QQU5FTFwiLCBkYXRlLCBob3NwaXRhbCk7XG4gICAgY29uc3QgY29tcG9uZW50UmVzb3VyY2VzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYyBvZiByYXcuYnBfY29tcG9uZW50cyBhcyBCcENvbXBvbmVudFtdKSB7XG4gICAgICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgICAgICB2YWx1ZTogYy52YWx1ZSxcbiAgICAgICAgdW5pdDogYy51bml0IHx8IFwibW1IZ1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiB0b1VjdW0oYy51bml0KSA/PyBcIm1tW0hnXVwiLFxuICAgICAgfTtcbiAgICAgIGNvbXBvbmVudFJlc291cmNlcy5wdXNoKHtcbiAgICAgICAgY29kZToge1xuICAgICAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIiwgY29kZTogYy5sb2luYywgZGlzcGxheTogYy5kaXNwbGF5IH1dLFxuICAgICAgICAgIHRleHQ6IGMuZGlzcGxheSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWVRdWFudGl0eTogcXR5LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGJwT2JzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgICBpZDogb2JzSWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgY29kZTogXCJ2aXRhbC1zaWduc1wiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgICAgICAgY29kZTogcmF3LmJwX3BhbmVsX2xvaW5jID8/IFwiODUzNTQtOVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IFwiQmxvb2QgUHJlc3N1cmVcIixcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgY29tcG9uZW50OiBjb21wb25lbnRSZXNvdXJjZXMsXG4gICAgfTtcbiAgICBpZiAoZGF0ZSkgYnBPYnMuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtkYXRlfVQwMDowMDowMCswODowMGA7XG4gICAgaWYgKGhvc3BpdGFsKSBicE9icy5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgICByZXR1cm4gYnBPYnM7XG4gIH1cblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IChwYW5lbENvZGUgPyBTdHJpbmcocGFuZWxDb2RlKSA6IFwiXCIpIHx8IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCBjYW5vbmljYWwgPSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgfHwgZGlzcGxheTtcbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIGNhbm9uaWNhbCwgcmF3LmRhdGUgPz8gXCJcIiwgcmF3Lmhvc3BpdGFsID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCBjYXRDb2RlID0gcmF3LmNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiO1xuICBjb25zdCBDQVRfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBsYWJvcmF0b3J5OiBcIkxhYm9yYXRvcnlcIixcbiAgICBcInZpdGFsLXNpZ25zXCI6IFwiVml0YWwgU2lnbnNcIixcbiAgICBpbWFnaW5nOiBcIkltYWdpbmdcIixcbiAgICBwcm9jZWR1cmU6IFwiUHJvY2VkdXJlXCIsXG4gICAgXCJzb2NpYWwtaGlzdG9yeVwiOiBcIlNvY2lhbCBIaXN0b3J5XCIsXG4gICAgc3VydmV5OiBcIlN1cnZleVwiLFxuICAgIGV4YW06IFwiRXhhbVwiLFxuICAgIHRoZXJhcHk6IFwiVGhlcmFweVwiLFxuICAgIGFjdGl2aXR5OiBcIkFjdGl2aXR5XCIsXG4gIH07XG4gIGNvbnN0IGNhdERpc3BsYXkgPVxuICAgIENBVF9ESVNQTEFZW2NhdENvZGVdID8/IGNhdENvZGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYXRDb2RlLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgaWQ6IG9ic0lkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICBjYXRlZ29yeTogW1xuICAgICAge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogY2F0Q29kZSxcbiAgICAgICAgICAgIGRpc3BsYXk6IGNhdERpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuaG9zcGl0YWwpIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IHJhdy5ob3NwaXRhbCB9XTtcbiAgY29uc3Qgc3BlY2ltZW4gPSBpbmZlclNwZWNpbWVuKHJhdy5vcmRlcl9uYW1lLCByYXcuZGlzcGxheSwgcmF3LmNvZGUpO1xuICBpZiAoc3BlY2ltZW4pIHJlc291cmNlLnNwZWNpbWVuID0geyBkaXNwbGF5OiBzcGVjaW1lbiB9O1xuXG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBpZiAoaGFzVmFsdWUpIHtcbiAgICBjb25zdCBxdHkgPSB0cnlQYXJzZVF1YW50aXR5KFN0cmluZyh2YWx1ZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChxdHkpIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgPSBxdHk7XG4gICAgZWxzZSByZXNvdXJjZS52YWx1ZVN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBpZiAocmF3LnJlZmVyZW5jZV9yYW5nZSkge1xuICAgIGNvbnN0IHJycyA9IHBhcnNlUmFuZ2VNdWx0aShTdHJpbmcocmF3LnJlZmVyZW5jZV9yYW5nZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChycnMubGVuZ3RoID4gMCkgcmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgPSBycnM7XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBHcm91cCBieSAob3JkZXJfY29kZSwgZGF0ZSwgaG9zcGl0YWwpIFx1MjE5MiBEUiArIE9ic2VydmF0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZ3JvdXBCeU9yZGVyQ29kZShcbiAgY2xlYW5lZDogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGxldCB3b3JraW5nID0gZGVkdXBlQ3Jvc3NGb3JtYXQoY2xlYW5lZCk7XG4gIHdvcmtpbmcgPSBjb21iaW5lQnBJdGVtcyh3b3JraW5nKTtcblxuICBjb25zdCBncm91cHMgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBjb25zdCBrZXlNZXRhID0gbmV3IE1hcDxzdHJpbmcsIHsgZ3JvdXBLZXlDb2RlOiBzdHJpbmc7IGRhdGU6IHN0cmluZzsgaG9zcGl0YWw6IHN0cmluZyB9PigpO1xuICBmb3IgKGNvbnN0IHJhdyBvZiB3b3JraW5nKSB7XG4gICAgY29uc3QgZ3JvdXBLZXlDb2RlID0gcmF3Lm9yZGVyX2NvZGUgfHwgcmF3LmNvZGUgfHwgcmF3LmRpc3BsYXkgfHwgXCJcIjtcbiAgICBjb25zdCBkYXRlID0gcmF3LmRhdGUgPz8gXCJcIjtcbiAgICBjb25zdCBob3NwaXRhbCA9IHJhdy5ob3NwaXRhbCA/PyBcIlwiO1xuICAgIGNvbnN0IGtleSA9IGAke2dyb3VwS2V5Q29kZX18JHtkYXRlfXwke2hvc3BpdGFsfWA7XG4gICAgY29uc3QgYXJyID0gZ3JvdXBzLmdldChrZXkpO1xuICAgIGlmIChhcnIpIGFyci5wdXNoKHJhdyk7XG4gICAgZWxzZSB7XG4gICAgICBncm91cHMuc2V0KGtleSwgW3Jhd10pO1xuICAgICAga2V5TWV0YS5zZXQoa2V5LCB7IGdyb3VwS2V5Q29kZTogU3RyaW5nKGdyb3VwS2V5Q29kZSksIGRhdGUsIGhvc3BpdGFsIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgW2tleSwgaXRlbXNdIG9mIGdyb3Vwcy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBtZXRhID0ga2V5TWV0YS5nZXQoa2V5KSE7XG4gICAgY29uc3QgZGVkdXBlZCA9IGRlZHVwZVBhbmVsSXRlbXMoaXRlbXMpO1xuXG4gICAgY29uc3Qgb2JzUmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgICBjb25zdCBzZWVuT2JzSWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBpdCBvZiBkZWR1cGVkKSB7XG4gICAgICBjb25zdCBvYnMgPSBidWlsZE9ic2VydmF0aW9uKGl0LCBwYXRpZW50SWQsIG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICAgIGlmICghb2JzKSBjb250aW51ZTtcbiAgICAgIGlmIChzZWVuT2JzSWRzLmhhcyhvYnMuaWQpKSBjb250aW51ZTtcbiAgICAgIHNlZW5PYnNJZHMuYWRkKG9icy5pZCk7XG4gICAgICBvYnNSZXNvdXJjZXMucHVzaChvYnMpO1xuICAgIH1cbiAgICBpZiAob2JzUmVzb3VyY2VzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG5cbiAgICAvLyBCUCBwYW5lbDogZW1pdCBPYnNlcnZhdGlvbiBkaXJlY3RseSAobm8gRFIgd3JhcHBlcikuXG4gICAgY29uc3QgaXNCcFBhbmVsID0gZGVkdXBlZC5ldmVyeSgoaXQpID0+IGl0LmJwX2NvbXBvbmVudHMgfHwgaXQuZGlzcGxheSA9PT0gXCJCbG9vZCBQcmVzc3VyZVwiKTtcbiAgICBpZiAoaXNCcFBhbmVsKSB7XG4gICAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JkZXJOYW1lID0gZGVkdXBlZC5maW5kKChpdCkgPT4gaXQub3JkZXJfbmFtZSk/Lm9yZGVyX25hbWUgPz8gbnVsbDtcbiAgICBjb25zdCBtZW1iZXJLZXlzID0gQXJyYXkuZnJvbShcbiAgICAgIG5ldyBTZXQoZGVkdXBlZC5maWx0ZXIoKGl0KSA9PiBpdC5kaXNwbGF5KS5tYXAoKGl0KSA9PiBjYW5vbmljYWxMYWJLZXkoaXQuZGlzcGxheSkpKSxcbiAgICApLnNvcnQoKTtcbiAgICBjb25zdCBwYW5lbFNpZ25hdHVyZSA9IG1lbWJlcktleXMuam9pbihcIixcIikgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICBjb25zdCBkcklkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIkRSXCIsIHBhbmVsU2lnbmF0dXJlLCBtZXRhLmRhdGUsIG1ldGEuaG9zcGl0YWwpO1xuXG4gICAgbGV0IHBhbmVsVGl0bGU6IHN0cmluZztcbiAgICBpZiAoZGVkdXBlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHNpbmdsZURpc3BsYXkgPSBkZWR1cGVkWzBdIS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBwYW5lbFRpdGxlID0gc2luZ2xlRGlzcGxheSB8fCBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWxUaXRsZSA9IG9yZGVyTmFtZSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGRyQ29kZVN5c3RlbSA9IE5ISV9MQUJfQ09ERV9SRS50ZXN0KFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgPz8gXCJcIilcbiAgICAgID8gc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX0xBQl9DT0RFO1xuXG4gICAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICByZXNvdXJjZVR5cGU6IFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICAgICAgaWQ6IGRySWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjItMDA3NFwiLFxuICAgICAgICAgICAgICBjb2RlOiBcIkxBQlwiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIkxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjb2RlOiB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogZHJDb2RlU3lzdGVtLFxuICAgICAgICAgICAgY29kZTogU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKSB8fCBcIlVOS05PV05cIixcbiAgICAgICAgICAgIGRpc3BsYXk6IHBhbmVsVGl0bGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogcGFuZWxUaXRsZSxcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgcmVzdWx0OiBvYnNSZXNvdXJjZXMubWFwKChvKSA9PiAoeyByZWZlcmVuY2U6IGBPYnNlcnZhdGlvbi8ke28uaWR9YCB9KSksXG4gICAgfTtcbiAgICBpZiAobWV0YS5kYXRlKSBkci5lZmZlY3RpdmVEYXRlVGltZSA9IGAke21ldGEuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChtZXRhLmhvc3BpdGFsKSBkci5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBtZXRhLmhvc3BpdGFsIH1dO1xuXG4gICAgb3V0LnB1c2goZHIpO1xuICAgIG91dC5wdXNoKC4uLm9ic1Jlc291cmNlcyk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgY2xlYW5lZCA9IGZpbHRlckxhYlJvd3MocmF3SXRlbXMpO1xuICByZXR1cm4gZ3JvdXBCeU9yZGVyQ29kZShjbGVhbmVkLCBwYXRpZW50SWQpO1xufVxuIiwgIi8qKlxuICogUHJvY2VkdXJlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcHJvY2VkdXJlLnB5YC4gUmV0dXJucyBudWxsIGZvciBsaXN0LXBhZ2VcbiAqIHJvd3MgbGFja2luZyBub3RlL2JvZHlfc2l0ZSBcdTIwMTQgdGhlIGFsdGVybmF0aXZlIGlzIHRoZSBTTUFSVCBhcHAgc2hvd2luZ1xuICogMjUgXCJwcm9jZWR1cmVzXCIgY2FsbGVkIFwiTXljb2JhY3RlcmlhIGN1bHR1cmVcIiAvIFwiVmFnaW5hbCB1bHRyYXNvdW5kXCJcbiAqIC8gZXRjLiB3aGljaCBhcmUgY2xpbmljYWxseSB3cm9uZy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwiaWNkXCIpKSByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfUENTO1xuICByZXR1cm4gc3lzdGVtcy5ISVNfTE9DQUxfUFJPQ0VEVVJFX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQcm9jZWR1cmUoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IG5vdGUgPSAoKHJhdy5ub3RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICBjb25zdCBib2R5U2l0ZSA9ICgocmF3LmJvZHlfc2l0ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFub3RlICYmICFib2R5U2l0ZSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBQcm9jZWR1cmVcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiUHJvY2VkdXJlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcuZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiByYXcuc3RhdHVzID8/IFwiY29tcGxldGVkXCIsXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lZERhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAoYm9keVNpdGUpIHtcbiAgICByZXNvdXJjZS5ib2R5U2l0ZSA9IFt7IHRleHQ6IGJvZHlTaXRlIH1dO1xuICB9XG4gIGlmIChub3RlKSB7XG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IG5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIG1hcHBlciBkaXNwYXRjaCB0YWJsZXMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2Rpc3BhdGNoLnB5YC4gQm90aCB0aGUgcHJpbWFyeSBzdHJ1Y3R1cmVkXG4gKiBwYXRoIChgL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRgKSBhbmQgdGhlIExMTSBmYWxsYmFjayBwYXRoXG4gKiAoYC9zeW5jL3VwbG9hZC1odG1sYCkgY29uc3VtZSB0aGUgc2FtZSB0YWJsZXMgc28gb3V0cHV0IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgeyBtYXBBbGxlcmd5SW50b2xlcmFuY2UgfSBmcm9tIFwiLi9hbGxlcmd5XCI7XG5pbXBvcnQgeyBtYXBDb25kaXRpb24gfSBmcm9tIFwiLi9jb25kaXRpb25cIjtcbmltcG9ydCB7IG1hcERpYWdub3N0aWNSZXBvcnQgfSBmcm9tIFwiLi9kaWFnbm9zdGljLXJlcG9ydFwiO1xuaW1wb3J0IHsgbWFwRW5jb3VudGVyIH0gZnJvbSBcIi4vZW5jb3VudGVyXCI7XG5pbXBvcnQgeyBtYXBNZWRpY2F0aW9uUmVxdWVzdCwgbWFwTWVkaWNhdGlvbnNEZWR1cCB9IGZyb20gXCIuL21lZGljYXRpb25cIjtcbmltcG9ydCB7IG1hcE9ic2VydmF0aW9uLCBtYXBPYnNlcnZhdGlvbnNHcm91cGVkIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb25cIjtcbmltcG9ydCB7IG1hcFByb2NlZHVyZSB9IGZyb20gXCIuL3Byb2NlZHVyZVwiO1xuXG5leHBvcnQgdHlwZSBQZXJSb3dNYXBwZXIgPSAoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pID0+IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsO1xuXG5leHBvcnQgdHlwZSBHcm91cE1hcHBlciA9IChpdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKSA9PiBSZWNvcmQ8c3RyaW5nLCBhbnk+W107XG5cbi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiAocGVyLXJvdyBtYXBwZXIsIEpTT04gbGlzdCBrZXkgaW5zaWRlIExMTSByZXNwb25zZSkuXG4gKiBVc2VkIGJ5IHRoZSBMTE0gZmFsbGJhY2sgcGF0aCBhZnRlciBleHRyYWN0aW9uOyB0aGUgc3RydWN0dXJlZCBwYXRoXG4gKiBhbHNvIGNvbnN1bHRzIGl0IGZvciBwZXItcm93IHJlc291cmNlIHR5cGVzLlxuICovXG5leHBvcnQgY29uc3QgTElTVF9IQU5ETEVSUzogUmVjb3JkPHN0cmluZywgW1BlclJvd01hcHBlciwgc3RyaW5nXT4gPSB7XG4gIG9ic2VydmF0aW9uczogW21hcE9ic2VydmF0aW9uLCBcIm9ic2VydmF0aW9uc1wiXSxcbiAgbWVkaWNhdGlvbnM6IFttYXBNZWRpY2F0aW9uUmVxdWVzdCwgXCJtZWRpY2F0aW9uc1wiXSxcbiAgY29uZGl0aW9uczogW21hcENvbmRpdGlvbiwgXCJjb25kaXRpb25zXCJdLFxuICBhbGxlcmdpZXM6IFttYXBBbGxlcmd5SW50b2xlcmFuY2UsIFwiYWxsZXJnaWVzXCJdLFxuICBkaWFnbm9zdGljX3JlcG9ydHM6IFttYXBEaWFnbm9zdGljUmVwb3J0LCBcImRpYWdub3N0aWNfcmVwb3J0c1wiXSxcbiAgcHJvY2VkdXJlczogW21hcFByb2NlZHVyZSwgXCJwcm9jZWR1cmVzXCJdLFxuICBlbmNvdW50ZXJzOiBbbWFwRW5jb3VudGVyLCBcImVuY291bnRlcnNcIl0sXG59O1xuXG4vKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgZ3JvdXAtYXdhcmUgbWFwcGVyIHRoYXQgdGFrZXMgdGhlIEZVTEwgbGlzdCBhdCBvbmNlLlxuICogVXNlZCB3aGVuIGNyb3NzLXJvdyBncm91cGluZy9kZWR1cCBpcyByZXF1aXJlZCAoTkhJIGxhYiBwYW5lbHMsXG4gKiBcdTRFMkRcdTgyRjEgbWVkaWNhdGlvbiBcdTk2RDlcdThBOUUgZGVkdXApLlxuICovXG5leHBvcnQgY29uc3QgR1JPVVBfSEFORExFUlM6IFJlY29yZDxzdHJpbmcsIEdyb3VwTWFwcGVyPiA9IHtcbiAgb2JzZXJ2YXRpb25zOiBtYXBPYnNlcnZhdGlvbnNHcm91cGVkLFxuICBtZWRpY2F0aW9uczogbWFwTWVkaWNhdGlvbnNEZWR1cCxcbn07XG4iLCAiLyoqXG4gKiBFbmNvdW50ZXIgbGlua2VyIFx1MjAxNCBtYXRjaCByZXNvdXJjZXMgdG8gRW5jb3VudGVycyBieSAoaG9zcGl0YWwsIGRhdGUpLlxuICpcbiAqIFB1cmUgZnVuY3Rpb246IG11dGF0ZXMgYHJlc291cmNlc2AgaW4gcGxhY2UgdG8gYWRkIGBlbmNvdW50ZXJgXG4gKiByZWZlcmVuY2VzIHdoZW4gdGhlcmUncyBhbiB1bmFtYmlndW91cyBtYXRjaCBpbiB0aGUgY2FuZGlkYXRlXG4gKiBFbmNvdW50ZXIgbGlzdC4gU2FtZSBsb2dpYyBhcyB0aGUgYmFja2VuZCdzIERCLWNvdXBsZWQgdmVyc2lvbixcbiAqIGxpZnRlZCBvdXQgc28gdGhlIGV4dGVuc2lvbidzIGxvY2FsIG1vZGUgY2FuIGNhbGwgaXQgb24gYW5cbiAqIGluLW1lbW9yeSBhcnJheS5cbiAqL1xuXG5pbXBvcnQgeyBkZXJpdmVJbnRlcnByZXRhdGlvbiB9IGZyb20gXCIuL29ic2VydmF0aW9uXCI7XG5cbmNvbnN0IEVOQ09VTlRFUl9MSU5LQUJMRSA9IG5ldyBTZXQoW1xuICBcIk9ic2VydmF0aW9uXCIsXG4gIFwiTWVkaWNhdGlvblJlcXVlc3RcIixcbiAgXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gIFwiUHJvY2VkdXJlXCIsXG4gIFwiQ29uZGl0aW9uXCIsXG4gIFwiQWxsZXJneUludG9sZXJhbmNlXCIsXG5dKTtcblxuZnVuY3Rpb24gcmVzb3VyY2VEYXRlKHI6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBmb3IgKGNvbnN0IGtleSBvZiBbXG4gICAgXCJlZmZlY3RpdmVEYXRlVGltZVwiLFxuICAgIFwiYXV0aG9yZWRPblwiLFxuICAgIFwicGVyZm9ybWVkRGF0ZVRpbWVcIixcbiAgICBcIm9uc2V0RGF0ZVRpbWVcIixcbiAgICBcInJlY29yZGVkRGF0ZVwiLFxuICAgIFwiaXNzdWVkXCIsXG4gIF0pIHtcbiAgICBjb25zdCB2ID0gcltrZXldO1xuICAgIGlmICh2KSByZXR1cm4gU3RyaW5nKHYpLnNsaWNlKDAsIDEwKTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBvZiBbXCJlZmZlY3RpdmVQZXJpb2RcIiwgXCJwZXJmb3JtZWRQZXJpb2RcIl0pIHtcbiAgICBjb25zdCBwZXJpb2QgPSByW2tleV07XG4gICAgaWYgKHBlcmlvZCAmJiB0eXBlb2YgcGVyaW9kID09PSBcIm9iamVjdFwiICYmIHBlcmlvZC5zdGFydCkge1xuICAgICAgcmV0dXJuIFN0cmluZyhwZXJpb2Quc3RhcnQpLnNsaWNlKDAsIDEwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFwiXCI7XG59XG5cbmZ1bmN0aW9uIHJlc291cmNlSG9zcGl0YWwocjogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIGZvciAoY29uc3QgcCBvZiByLnBlcmZvcm1lciA/PyBbXSkge1xuICAgIGNvbnN0IGQgPSAocCA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGlmIChkKSByZXR1cm4gZDtcbiAgfVxuICBjb25zdCByZXEgPSByLnJlcXVlc3RlciA/PyB7fTtcbiAgaWYgKHJlcSAmJiB0eXBlb2YgcmVxID09PSBcIm9iamVjdFwiICYmIHJlcS5kaXNwbGF5KSByZXR1cm4gcmVxLmRpc3BsYXk7XG4gIHJldHVybiBcIlwiO1xufVxuXG4vKipcbiAqIERyb3AgQU1CIEVuY291bnRlcnMgd2hvc2UgKGhvc3BpdGFsLCBzdGFydF9kYXRlKSBpcyBhbHJlYWR5IGNvdmVyZWRcbiAqIGJ5IGFuIElNUCBFbmNvdW50ZXIncyBhZG1pc3Npb24gZGF5LiBOSEkgZW1pdHMgdGhlIHNhbWUgaW5wYXRpZW50XG4gKiBzdGF5IHR3aWNlIChJSEtFMzMwMyBBTUIgYmlsbGluZyBlbnRyeSArIElIS0UzMzA5IElNUCBkZXRhaWwpOyB0aGVcbiAqIElNUCBvbmUgaXMgY2Fub25pY2FsLCB0aGUgQU1CIGlzIGEgYmlsbGluZyBhcnRlZmFjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwQWRtaXNzaW9uRGF5QW1iKFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGltcFN0YXJ0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIkVuY291bnRlclwiKSBjb250aW51ZTtcbiAgICBpZiAoKHIuY2xhc3MgPz8ge30pLmNvZGUgIT09IFwiSU1QXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoaG9zcCAmJiBzdGFydCkgaW1wU3RhcnRzLmFkZChgJHtob3NwfSAke3N0YXJ0fWApO1xuICB9XG4gIGlmIChpbXBTdGFydHMuc2l6ZSA9PT0gMCkgcmV0dXJuIHJlc291cmNlcztcbiAgcmV0dXJuIHJlc291cmNlcy5maWx0ZXIoKHIpID0+IHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgPT09IFwiRW5jb3VudGVyXCIgJiYgKHIuY2xhc3MgPz8ge30pLmNvZGUgPT09IFwiQU1CXCIpIHtcbiAgICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChyLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGltcFN0YXJ0cy5oYXMoYCR7aG9zcH0gJHtzdGFydH1gKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIGBlbmNvdW50ZXJgIHJlZmVyZW5jZSB0byBlYWNoIGxpbmthYmxlIHJlc291cmNlIHdoZW4gaXRzXG4gKiAoaG9zcGl0YWwsIGRhdGUpIG1hdGNoZXMgZXhhY3RseSBPTkUgRW5jb3VudGVyIGluIGBjYW5kaWRhdGVzYC5cbiAqIENvbnNlcnZhdGl2ZSBcdTIwMTQgbGVhdmVzIGFtYmlndW91cyAoMCBvciA+MSBtYXRjaCkgY2FzZXMgdW5saW5rZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzKFxuICBjYW5kaWRhdGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogdm9pZCB7XG4gIGlmIChjYW5kaWRhdGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICBjb25zdCBleGFjdEluZGV4ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBjb25zdCBpbXBCeUhvc3AgPSBuZXcgTWFwPHN0cmluZywgQXJyYXk8W3N0cmluZywgc3RyaW5nLCBzdHJpbmddPj4oKTtcblxuICBmb3IgKGNvbnN0IGUgb2YgY2FuZGlkYXRlcykge1xuICAgIGlmIChlLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IChlLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChlLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgIGlmICghaG9zcCB8fCAhc3RhcnQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGtleSA9IGAke2hvc3B9ICR7c3RhcnR9YDtcbiAgICBjb25zdCBhcnIgPSBleGFjdEluZGV4LmdldChrZXkpID8/IFtdO1xuICAgIGFyci5wdXNoKGUuaWQpO1xuICAgIGV4YWN0SW5kZXguc2V0KGtleSwgYXJyKTtcbiAgICBjb25zdCBjbHMgPSAoZS5jbGFzcyA/PyB7fSkuY29kZSA/PyBcIlwiO1xuICAgIGlmIChjbHMgPT09IFwiSU1QXCIpIHtcbiAgICAgIGNvbnN0IGVuZCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLmVuZCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgICBpZiAoZW5kKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdO1xuICAgICAgICBsaXN0LnB1c2goW3N0YXJ0LCBlbmQsIGUuaWRdKTtcbiAgICAgICAgaW1wQnlIb3NwLnNldChob3NwLCBsaXN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZXhhY3RJbmRleC5zaXplID09PSAwICYmIGltcEJ5SG9zcC5zaXplID09PSAwKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmICghRU5DT1VOVEVSX0xJTktBQkxFLmhhcyhyLnJlc291cmNlVHlwZSkpIGNvbnRpbnVlO1xuICAgIGlmIChyLmVuY291bnRlciB8fCByLmNvbnRleHQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSByZXNvdXJjZUhvc3BpdGFsKHIpO1xuICAgIGNvbnN0IGRhdGUgPSByZXNvdXJjZURhdGUocik7XG4gICAgaWYgKCFob3NwIHx8ICFkYXRlKSBjb250aW51ZTtcbiAgICBjb25zdCBtYXRjaGVzOiBzdHJpbmdbXSA9IFsuLi4oZXhhY3RJbmRleC5nZXQoYCR7aG9zcH0gJHtkYXRlfWApID8/IFtdKV07XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGNvbnN0IFtzdGFydCwgZW5kLCBlaWRdIG9mIGltcEJ5SG9zcC5nZXQoaG9zcCkgPz8gW10pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDw9IGRhdGUgJiYgZGF0ZSA8PSBlbmQpIG1hdGNoZXMucHVzaChlaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggIT09IDEpIGNvbnRpbnVlO1xuICAgIHIuZW5jb3VudGVyID0geyByZWZlcmVuY2U6IGBFbmNvdW50ZXIvJHttYXRjaGVzWzBdfWAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFdoZW4gYW4gT2JzZXJ2YXRpb24gY2FycmllcyBtdWx0aXBsZSByZWZlcmVuY2VSYW5nZSBlbnRyaWVzIHRhZ2dlZFxuICogd2l0aCBgYXBwbGllc1RvWypdLmNvZGluZy5jb2RlYCBpbiB7bWFsZSwgZmVtYWxlfSwgcGljayB0aGUgb25lIHRoYXRcbiAqIG1hdGNoZXMgdGhlIHBhdGllbnQncyBnZW5kZXIgYW5kIHJlLWRlcml2ZSBpbnRlcnByZXRhdGlvbiBhZ2FpbnN0IGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMoXG4gIHBhdGllbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoIXBhdGllbnQpIHJldHVybjtcbiAgY29uc3QgZ2VuZGVyID0gU3RyaW5nKHBhdGllbnQuZ2VuZGVyID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChnZW5kZXIgIT09IFwibWFsZVwiICYmIGdlbmRlciAhPT0gXCJmZW1hbGVcIikgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgIT09IFwiT2JzZXJ2YXRpb25cIikgY29udGludWU7XG4gICAgY29uc3QgcnJzOiBhbnlbXSA9IHIucmVmZXJlbmNlUmFuZ2UgPz8gW107XG4gICAgaWYgKHJycy5sZW5ndGggPCAyKSBjb250aW51ZTtcblxuICAgIGxldCBtYXRjaDogYW55ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJycykge1xuICAgICAgZm9yIChjb25zdCBhcCBvZiBlbnRyeS5hcHBsaWVzVG8gPz8gW10pIHtcbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGFwLmNvZGluZyA/PyBbXSkge1xuICAgICAgICAgIGlmIChTdHJpbmcoYy5jb2RlID8/IFwiXCIpLnRvTG93ZXJDYXNlKCkgPT09IGdlbmRlcikge1xuICAgICAgICAgICAgbWF0Y2ggPSBlbnRyeTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2gpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICB9XG4gICAgaWYgKCFtYXRjaCkgY29udGludWU7XG5cbiAgICByLnJlZmVyZW5jZVJhbmdlID0gW21hdGNoXTtcbiAgICBjb25zdCB2YWxTdHIgPVxuICAgICAgU3RyaW5nKChyLnZhbHVlUXVhbnRpdHkgPz8ge30pLnZhbHVlID8/IFwiXCIpIHx8IFN0cmluZyhyLnZhbHVlU3RyaW5nID8/IFwiXCIpO1xuICAgIGNvbnN0IG5ld0ludGVycCA9IGRlcml2ZUludGVycHJldGF0aW9uKHZhbFN0ciwgci52YWx1ZVF1YW50aXR5ID8/IG51bGwsIG1hdGNoKTtcbiAgICBpZiAobmV3SW50ZXJwKSB7XG4gICAgICByLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbbmV3SW50ZXJwXSB9XTtcbiAgICB9XG4gIH1cbn1cbiIsICIvKipcbiAqIFBhdGllbnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9wYXRpZW50LnB5YC4gU2FtZSBwdWJsaWMgQVBJOlxuICogICAtIGxvb2tzTGlrZVR3TmF0aW9uYWxJZCh2YWx1ZSkgXHUyMDE0IGV4cG9zZWQgZm9yIHRlc3RzXG4gKiAgIC0gbWFwUGF0aWVudChyYXcpIFx1MjAxNCBtYWluIGVudHJ5XG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5cbi8vIFRhaXdhbiBuYXRpb25hbCBJRDogMSBsZXR0ZXIgKyA5IGRpZ2l0cyAoQTEyMzQ1Njc4OSkuIFVzZWQgdG8gZGVjaWRlXG4vLyB3aGV0aGVyIHRoZSBwb3B1cC1zdXBwbGllZCBwYXRpZW50X2lkIHNob3VsZCBiZSBjb2RlZCB1bmRlciB0aGVcbi8vIGNhbm9uaWNhbCBuYXRpb25hbC1pZCBzeXN0ZW0gb3IgYXMgYSBsb2NhbCBob3NwaXRhbCBNUk4uXG5jb25zdCBUV19OQVRJT05BTF9JRF9SRSA9IC9eW0EtWl1bMTJdXFxkezh9JC87XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gVFdfTkFUSU9OQUxfSURfUkUudGVzdCh2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQYXRpZW50KHJhdzogUmVjb3JkPHN0cmluZywgYW55Pik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCBwYXRpZW50SWQgPSBTdHJpbmcocmF3LmlkZW50aWZpZXIgPz8gcmF3LmlkID8/IFwidW5rbm93blwiKTtcblxuICAvLyBVc2UgYD8/YCAobm90IGp1c3QgZGVmYXVsdCBhcmcpIHNvIGV4cGxpY2l0IG51bGwgZnJvbSB0aGUgTExNIGFsc29cbiAgLy8gZmFsbHMgYmFjay4gTG9jYWwgbW9kZWxzIHNvbWV0aW1lcyBlbWl0IG51bGwgaW5zdGVhZCBvZiBvbWl0dGluZy5cbiAgLy8gVGhlIGNhbGxlciBkZWNpZGVzIHdoZXRoZXIgYHJhdy5uYW1lYCBpcyB0aGUgdXNlcidzIHJlYWwgbmFtZSBvclxuICAvLyBhbHJlYWR5LW1hc2tlZCBcdTIwMTQgbWFwUGF0aWVudCBqdXN0IHRyYW5zY3JpYmVzLiBNYXNraW5nIHBvbGljeSBsaXZlc1xuICAvLyBhdCB0aGUgVUkgLyBleHRlbnNpb24gbGF5ZXIgKGRyaXZlbiBieSB0aGUgdXNlci10b2dnbGVhYmxlXG4gIC8vIGBtYXNrTmFtZUVuYWJsZWRgIHNldHRpbmcpIHNvIHRoZSBzYW1lIG1hcHBlciBpcyBjb3JyZWN0IGZvciBib3RoXG4gIC8vIFwiXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4ID0gcmVhbCBuYW1lXCIgYW5kIFwiXHU5MUFCXHU3NjQyXHU0RUJBXHU1NEUxXHU1OTFBXHU3NUM1XHU0RUJBID0gbWFza2VkXCIgd29ya2Zsb3dzLlxuICBjb25zdCBuYW1lVGV4dCA9IChyYXcubmFtZSA/PyBudWxsKSB8fCBcIlVua25vd25cIjtcbiAgY29uc3QgcGhvbmUgPSAocmF3LnBob25lID8/IG51bGwpIHx8IFwiXCI7XG4gIGNvbnN0IGFkZHJlc3MgPSAocmF3LmFkZHJlc3MgPz8gbnVsbCkgfHwgXCJcIjtcblxuICBjb25zdCBbZmFtaWx5LCBnaXZlbl0gPSBzcGxpdE5hbWUobmFtZVRleHQpO1xuICBjb25zdCBuYW1lRW50cnk6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IHVzZTogXCJvZmZpY2lhbFwiLCB0ZXh0OiBuYW1lVGV4dCB9O1xuICBpZiAoZmFtaWx5KSBuYW1lRW50cnkuZmFtaWx5ID0gZmFtaWx5O1xuICBpZiAoZ2l2ZW4ubGVuZ3RoID4gMCkgbmFtZUVudHJ5LmdpdmVuID0gZ2l2ZW47XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIlBhdGllbnRcIixcbiAgICBpZDogcGF0aWVudElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICB7XG4gICAgICAgIHVzZTogXCJvZmZpY2lhbFwiLFxuICAgICAgICBzeXN0ZW06IGxvb2tzTGlrZVR3TmF0aW9uYWxJZChwYXRpZW50SWQpXG4gICAgICAgICAgPyBzeXN0ZW1zLlRXX05BVElPTkFMX0lEXG4gICAgICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9QQVRJRU5UX01STixcbiAgICAgICAgdmFsdWU6IHBhdGllbnRJZCxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBuYW1lOiBbbmFtZUVudHJ5XSxcbiAgICBnZW5kZXI6IG1hcEdlbmRlcihyYXcuZ2VuZGVyKSxcbiAgfTtcblxuICBjb25zdCBiaXJ0aERhdGUgPSByYXcuYmlydGhEYXRlO1xuICBpZiAoYmlydGhEYXRlKSByZXNvdXJjZS5iaXJ0aERhdGUgPSBiaXJ0aERhdGU7XG5cbiAgaWYgKHBob25lKSB7XG4gICAgcmVzb3VyY2UudGVsZWNvbSA9IFt7IHN5c3RlbTogXCJwaG9uZVwiLCB1c2U6IFwiaG9tZVwiLCB2YWx1ZTogcGhvbmUgfV07XG4gIH1cblxuICBpZiAoYWRkcmVzcykge1xuICAgIHJlc291cmNlLmFkZHJlc3MgPSBbeyB1c2U6IFwiaG9tZVwiLCB0ZXh0OiBhZGRyZXNzIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIFNwbGl0IGEgZnVsbCBuYW1lIGludG8gW2ZhbWlseSwgW2dpdmVuXV0gZm9yIEZISVIgUGF0aWVudC5uYW1lLlxuICpcbiAqIEhldXJpc3RpY3M6XG4gKiAgIC0gQ29udGFpbnMgd2hpdGVzcGFjZSBcdTIxOTIgV2VzdGVybjogbGFzdCB0b2tlbiA9IGZhbWlseSwgcmVzdCA9IGdpdmVuLlxuICogICAtIENKSyAvIHNpbmdsZS10b2tlbiBcdTIxOTIgZmlyc3QgY2hhciA9IGZhbWlseSwgcmVtYWluZGVyID0gZ2l2ZW4uXG4gKiAgIC0gXCJVbmtub3duXCIgb3IgZW1wdHkgXHUyMTkyIFtcIlwiLCBbXV1cbiAqXG4gKiBUd28tY2hhciBDSksgZmFtaWx5IG5hbWVzIChcdTZCNTBcdTk2N0QsIFx1NTNGOFx1OTlBQywgXHUyMDI2KSBhcmUgTk9UIGF1dG8tZGV0ZWN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHNwbGl0TmFtZShmdWxsTmFtZTogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nW11dIHtcbiAgY29uc3QgbmFtZSA9IChmdWxsTmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghbmFtZSB8fCBuYW1lID09PSBcIlVua25vd25cIikgcmV0dXJuIFtcIlwiLCBbXV07XG4gIGlmICgvXFxzLy50ZXN0KG5hbWUpKSB7XG4gICAgY29uc3QgcGFydHMgPSBuYW1lLnNwbGl0KC9cXHMrLyk7XG4gICAgcmV0dXJuIFtwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSEsIHBhcnRzLnNsaWNlKDAsIC0xKV07XG4gIH1cbiAgLy8gQ0pLIGZhbGxiYWNrIFx1MjAxNCBpdGVyYXRlIGNvZGVwb2ludHMsIG5vdCBVVEYtMTYgY29kZSB1bml0cywgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyAocmFyZSBpbiBDaGluZXNlIG5hbWVzIGJ1dCBwb3NzaWJsZSlcbiAgLy8gZG9uJ3QgZ2V0IHNwbGl0IG1pZC1jaGFyYWN0ZXIuXG4gIGNvbnN0IGNvZGVwb2ludHMgPSBBcnJheS5mcm9tKG5hbWUpO1xuICByZXR1cm4gY29kZXBvaW50cy5sZW5ndGggPiAxID8gW2NvZGVwb2ludHNbMF0hLCBbY29kZXBvaW50cy5zbGljZSgxKS5qb2luKFwiXCIpXV0gOiBbbmFtZSwgW11dO1xufVxuXG5mdW5jdGlvbiBtYXBHZW5kZXIoZ2VuZGVyOiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgZyA9IHR5cGVvZiBnZW5kZXIgPT09IFwic3RyaW5nXCIgPyBnZW5kZXIudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChbXCJtYWxlXCIsIFwibVwiLCBcIlx1NzUzN1wiLCBcIlx1NzUzN1x1NjAyN1wiXS5pbmNsdWRlcyhnKSkgcmV0dXJuIFwibWFsZVwiO1xuICBpZiAoW1wiZmVtYWxlXCIsIFwiZlwiLCBcIlx1NTk3M1wiLCBcIlx1NTk3M1x1NjAyN1wiXS5pbmNsdWRlcyhnKSkgcmV0dXJuIFwiZmVtYWxlXCI7XG4gIHJldHVybiBcInVua25vd25cIjtcbn1cbiIsICIvLyBTZXJ2aWNlIHdvcmtlciBmb3IgTkhJLUZISVIgQnJpZGdlIFx1MjAxNCBvd25zIHRoZSBsb25nLXJ1bm5pbmdcbi8vIFwiU3luYyBUaGlzIFBhdGllbnRcIiB3b3JrZmxvdyBzbyB0aGUgcG9wdXAgY2FuIGNsb3NlIG1pZC1zeW5jIHdpdGhvdXRcbi8vIGFib3J0aW5nIGl0LlxuLy9cbi8vIExpZmVjeWNsZTpcbi8vICAgLSBwb3B1cCBwb3N0cyB7dHlwZTogXCJzdGFydE5oaUFwaVN5bmNcIiwgcGF5bG9hZH0gIFx1MjE5MiBOSEkgSlNPTi1BUEkgc3luY1xuLy8gICAtIGJhY2tncm91bmQgcnVucyB0aGUgZnVsbCBzeW5jIHNlcXVlbmNlLCB1cGRhdGluZyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gICAtIHBvcHVwIHJlYWRzIGNocm9tZS5zdG9yYWdlLmxvY2FsIG9uIHJlb3BlbiB0byBzaG93IHByb2dyZXNzXG4vL1xuLy8gTW9kZXM6XG4vLyAgIC0gXCJsb2NhbFwiICAgXHUyMTkyIGFmdGVyIE5ISSBmZXRjaCwgcnVuIG1hcHBlcnMgaW4tZXh0ZW5zaW9uLCBkb3dubG9hZCBhXG4vLyAgICAgICAgICAgICAgICAgRkhJUiBCdW5kbGUgdG8gdGhlIHVzZXIncyBtYWNoaW5lLiBObyBiYWNrZW5kIHJlcXVpcmVkLlxuLy8gICAtIFwiYmFja2VuZFwiIFx1MjE5MiBQT1NUIHBlci1wYWdlX3R5cGUgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRcbi8vICAgICAgICAgICAgICAgICAoZXhpc3RpbmcgYmVoYXZpb3VyKTsgZGFzaGJvYXJkICsgU01BUlQgYXBwIHVzZSB0aGVcbi8vICAgICAgICAgICAgICAgICBiYWNrZW5kJ3MgRkhJUiBzdG9yZS5cblxuaW1wb3J0IHtcbiAgR1JPVVBfSEFORExFUlMsXG4gIExJU1RfSEFORExFUlMsXG4gIGRlZHVwQWRtaXNzaW9uRGF5QW1iLFxuICBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzLFxuICBtYXBQYXRpZW50LFxuICBtYXNrSWQsXG4gIG1hc2tOYW1lLFxuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyxcbn0gZnJvbSBcIkBuaGktZmhpci1icmlkZ2UvbWFwcGVyXCI7XG5cbmNvbnN0IFNUT1JBR0VfS0VZID0gXCJzeW5jU3RhdHVzXCI7XG5jb25zdCBzbGVlcCA9IChtcykgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKTtcblxuLy8gQ2FuY2VsbGF0aW9uIGZsYWcgc2V0IGJ5IHBvcHVwJ3Mgc3RvcCBidXR0b24uIENoZWNrZWQgYXQgc3RyYXRlZ2ljIHBvaW50c1xuLy8gaW4gcnVuTmhpQXBpU3luYyAoYmV0d2VlbiBwaGFzZXMsIGJlZm9yZSBlYWNoIGRldGFpbCBwYWdlKSBzbyB0aGVcbi8vIGluLXByb2dyZXNzIHN5bmMgZXhpdHMgcHJvbXB0bHkgd2hlbiB0aGUgdXNlciBoaXRzIFN0b3AuIENsZWFyZWQgYXQgdGhlXG4vLyBzdGFydCBvZiBlYWNoIG5ldyBzeW5jIHJ1bi5cbmxldCBfY2FuY2VsbGVkID0gZmFsc2U7XG4vLyBDb250ZXh0IGZvciB0aGUgaW4tZmxpZ2h0IHN5bmMgc28gdGhlIHN0b3BTeW5jIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuLy8gZGF0YSB3aXRob3V0IHRoZSBwb3B1cCBuZWVkaW5nIHRvIHBhc3MgaXQgYmFjay4gU2V0IGF0IHRoZSB0b3Agb2Zcbi8vIHJ1bk5oaUFwaVN5bmM7IGNsZWFyZWQgb24gY29tcGxldGlvbiAoc3VjY2Vzcy9mYWlsdXJlL2NhbmNlbCkuXG5sZXQgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xuY29uc3QgQ0FOQ0VMX0VSUk9SID0gXCJfX1NZTkNfQ0FOQ0VMTEVEX19cIjtcbi8vIFRocm93biB3aGVuIE5ISSBkZXRlY3RzIHRoZSBzZXNzaW9uIGhhcyBleHBpcmVkIChsb2dpbiBwYWdlIHJlbmRlcmVkLCBvclxuLy8gdGFiIHJlZGlyZWN0ZWQgdG8gYXV0aCBuYW1lc3BhY2UpLiBBYm9ydHMgc3luYyBpbW1lZGlhdGVseSBzbyB0aGUgdXNlciBjYW5cbi8vIHJlLWxvZ2luIGFuZCByZXRyeSBpbnN0ZWFkIG9mIHRpbWluZyBvdXQgb24gZXZlcnkgcmVtYWluaW5nIHBhZ2UuXG5jb25zdCBTRVNTSU9OX0VYUElSRURfRVJST1IgPSBcIl9fU0VTU0lPTl9FWFBJUkVEX19cIjtcbi8vIEVycm9ycyB0aGF0IHNob3VsZCBhYm9ydCB0aGUgZW50aXJlIHN5bmMgaW5zdGVhZCBvZiBiZWluZyBzd2FsbG93ZWRcbi8vIHBlci1waGFzZS5cbmNvbnN0IEFCT1JUX0VSUk9SUyA9IG5ldyBTZXQoW0NBTkNFTF9FUlJPUiwgU0VTU0lPTl9FWFBJUkVEX0VSUk9SXSk7XG5mdW5jdGlvbiBjaGVja0NhbmNlbCgpIHtcbiAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRTdGF0dXMocGFydGlhbCkge1xuICAvLyBBZnRlciBjYW5jZWxsYXRpb24sIHRoZSBwb3B1cCBoYXMgYWxyZWFkeSB3cml0dGVuIHRoZSBkZWZpbml0aXZlXG4gIC8vIFwic3RvcHBlZFwiIHN0YXR1cyBcdTIwMTQgc2lsZW5jZSBhbnkgZnVydGhlciBwcm9ncmVzcyB3cml0ZXMgZnJvbSB0aGVcbiAgLy8gaW4tZmxpZ2h0IHN5bmMgY29kZSBzbyB0aGUgVUkgZG9lc24ndCBib3VuY2Ugd2hpbGUgaXQgdW53aW5kcy5cbiAgaWYgKF9jYW5jZWxsZWQpIHJldHVybjtcbiAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gIGNvbnN0IG5leHQgPSB7IC4uLnByZXYsIC4uLnBhcnRpYWwsIHRzOiBEYXRlLm5vdygpIH07XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IG5leHQgfSk7XG4gIC8vIEJyb2FkY2FzdCB0byBhbnkgb3BlbiBwb3B1cC4gSWYgbm8gbGlzdGVuZXIgKHBvcHVwIGNsb3NlZCksXG4gIC8vIHNlbmRNZXNzYWdlIHJlamVjdHMgXHUyMDE0IHN3YWxsb3cuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzeW5jUHJvZ3Jlc3NcIiwgc3RhdHVzOiBuZXh0IH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIE5ISSBBUEktZGlyZWN0IHN5bmMgKHBhcmFsbGVsLCBubyBMTE0pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEluc3RlYWQgb2YgbmF2aWdhdGluZyB0aGUgdXNlcidzIHRhYiB0byBlYWNoIE5ISSBwYWdlLCB3YWl0aW5nIGZvciBWdWUgdG9cbi8vIHJlbmRlciwgY2FwdHVyaW5nIEhUTUwsIHRoZW4gc2VuZGluZyBpdCB0aHJvdWdoIExMTSBleHRyYWN0aW9uLCB3ZSBjYWxsXG4vLyBOSEkncyB1bmRlcmx5aW5nIEpTT04gQVBJIGVuZHBvaW50cyBkaXJlY3RseS4gVGhlIFx1NTA2NVx1NEZERFx1N0Y3MiBTUEEgZnJvbnRzIGEgc2V0XG4vLyBvZiBSRVNUIGVuZHBvaW50cyB1bmRlciAvYXBpL2loa2UzMDAwLzxwYWdlPi8qIHRoYXQgcmV0dXJuIHdlbGwtZm9ybWVkXG4vLyBKU09OOyBjYWxsaW5nIHRoZW0gaW4gcGFyYWxsZWwgY3V0cyBhIDUtMTAgbWludXRlIHN5bmMgdG8gfjEwIHNlY29uZHMgYW5kXG4vLyByZW1vdmVzIHRoZSBMTE0gY29zdCBlbnRpcmVseS5cblxuY29uc3QgTkhJX0hPU1QgPSBcIm15aGVhbHRoYmFuay5uaGkuZ292LnR3XCI7XG5cbi8vIENvbnZlcnQgTkhJJ3MgXHU2QzExXHU1NzBCIGRhdGUgXCIxMTUvMDUvMDVcIiBcdTIxOTIgSVNPIFwiMjAyNi0wNS0wNVwiLlxuLy8gU29tZSBOSEkgZmllbGRzIGVtYmVkIGJvdGggUk9DIGFuZCBHcmVnb3JpYW46IFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHdlXG4vLyBqdXN0IG1hdGNoIHRoZSBmaXJzdCBzZWdtZW50LlxuZnVuY3Rpb24gcm9jVG9JU08ocm9jRGF0ZSkge1xuICBpZiAoIXJvY0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKHJvY0RhdGUpLm1hdGNoKC9eKFxcZHsyLDN9KVsvLi1dKFxcZHsxLDJ9KVsvLi1dKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApICsgMTkxMTtcbiAgcmV0dXJuIGAke3l9LSR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LSR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gSW52ZXJzZTogSVNPIFwiMjAyMy0wNS0wNVwiIFx1MjE5MiBST0MgXCIxMTIvMDUvMDVcIi4gVXNlZCB0byBidWlsZCBOSEkgZGF0ZS1yYW5nZVxuLy8gcXVlcnkgc3RyaW5ncyAodGhlaXIgZm9ybXMgZXhwZWN0IFx1NkMxMVx1NTcwQiBmb3JtYXQpLlxuZnVuY3Rpb24gaXNvVG9ST0MoaXNvRGF0ZSkge1xuICBpZiAoIWlzb0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKGlzb0RhdGUpLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pLyk7XG4gIGlmICghbSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHkgPSBwYXJzZUludChtWzFdLCAxMCkgLSAxOTExO1xuICBpZiAoeSA8IDEpIHJldHVybiBcIlwiOyAvLyBwcmUtXHU2QzExXHU1NzBCIGRhdGVzIG1ha2Ugbm8gc2Vuc2UgdG8gTkhJXG4gIHJldHVybiBgJHt5fS8ke21bMl0ucGFkU3RhcnQoMiwgXCIwXCIpfS8ke21bM10ucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG59XG5cbi8vIE5ISSBiaWxpbmd1YWwgZmllbGRzIHVzZSBcIlx1NEUyRFx1NjU4N3x8RW5nbGlzaFwiIFx1MjAxNCBjbGluaWNpYW5zIHNjYW4gRW5nbGlzaCBmYXN0ZXIsXG4vLyBzbyBwcmVmZXIgdGhhdCBzaWRlLiBJZiB0aGVyZSdzIG5vIGB8fGAgd2UganVzdCByZXR1cm4gdGhlIGlucHV0IHRyaW1tZWQuXG5mdW5jdGlvbiBwaWNrRW5nbGlzaChzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHN0ciA9IFN0cmluZyhzKTtcbiAgY29uc3QgaWR4ID0gc3RyLmluZGV4T2YoXCJ8fFwiKTtcbiAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBzdHIudHJpbSgpO1xuICBjb25zdCBlbiA9IHN0ci5zbGljZShpZHggKyAyKS50cmltKCk7XG4gIHJldHVybiBlbiB8fCBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG59XG5cbi8vIEFkYXB0ZXIgZm9yIE5ISSBsYWIvb2JzZXJ2YXRpb24gSlNPTiBzaGFwZSAoY29uZmlybWVkIGZvciBJSEtFMzQwOVMwMTtcbi8vIG90aGVyIGxhYiBlbmRwb2ludHMgbGlrZWx5IHVzZSB0aGUgc2FtZSBmaWVsZHMpLlxuZnVuY3Rpb24gYWRhcHRMYWJJdGVtKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFKTtcbiAgY29uc3QgdmFsdWUgPSBpdGVtLmFzc2FZX1ZBTFVFO1xuICBpZiAoIWRhdGUgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIC8vIElNUE9SVEFOVDogYG9yZGVyX3Nob3J0bmFtZWAgaXMgTkhJJ3MgVUktdHJ1bmNhdGVkIGxhYmVsICh+MTUgY2hhcnNcbiAgLy8gKyBcIiAuLi5cIiksIHN1aXRhYmxlIGZvciB0aGVpciBsb25nLXRhYmxlIGRpc3BsYXkgYnV0IE5PVCBmb3IgRkhJUlxuICAvLyBPYnNlcnZhdGlvbi5jb2RlLnRleHQgXHUyMDE0IGRvd25zdHJlYW0gU01BUlQgYXBwcyBlbmQgdXAgc2hvd2luZyBoYWxmXG4gIC8vIG5hbWVzIGxpa2UgXCJQQyBTdWdhciBcdTk4RUZcdTVGOEMgLi4uXCIgd2l0aCBubyBmaWVsZCB0byByZWNvdmVyIHRoZSBmdWxsXG4gIC8vIG5hbWUgZnJvbS4gQWx3YXlzIHByZWZlciBgYXNzYVlfSVRFTV9OQU1FYCAodGhlIGZ1bGwgaXRlbSBuYW1lLFxuICAvLyB0eXBpY2FsbHkgYmlsaW5ndWFsIGxpa2UgXCJQQyBTdWdhciBcdTk4RUZcdTVGOENcdTUxNjlcdTVDMEZcdTY2NDJcdTg4NDBcdTdDRDZcIikgYW5kIG9ubHkgZmFsbFxuICAvLyBiYWNrIHRvIHRoZSBzaG9ydG5hbWUgd2hlbiB0aGUgZnVsbCBuYW1lIGlzIGdlbnVpbmVseSBhYnNlbnQuXG4gIC8vIFNhbWUgcHJpb3JpdHkgYXBwbGllZCB0byBgY29kZWAgYW5kIGBkaXNwbGF5YCBzbyBib3RoXG4gIC8vIE9ic2VydmF0aW9uLmNvZGUudGV4dCBhbmQgY29kaW5nW10uZGlzcGxheSBjYXJyeSB0aGUgZnVsbCBsYWJlbC5cbiAgY29uc3QgZnVsbE5hbWUgPSBpdGVtLmFzc2FZX0lURU1fTkFNRSB8fCBpdGVtLm9yZGVyX3Nob3J0bmFtZSB8fCBcIlwiO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgb3JkZXJfY29kZTogaXRlbS5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgb3JkZXJfbmFtZTogaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCIsXG4gICAgY29kZTogZnVsbE5hbWUsXG4gICAgZGlzcGxheTogZnVsbE5hbWUsXG4gICAgdmFsdWU6IFN0cmluZyh2YWx1ZSksXG4gICAgdW5pdDogaXRlbS51bmlUX0RBVEEgfHwgXCJcIixcbiAgICByZWZlcmVuY2VfcmFuZ2U6IGl0ZW0uY29uc3VsVF9WQUxVRSB8fCBpdGVtLnNob3J0X0NPTlNVTFRfVkFMVUUgfHwgXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDZTMDEgcmV0dXJucyB2aXNpdC1sZXZlbCByb3dzIE9OTFkgKG5vIGRydWcgbmFtZXMpLiBUaGUgYWN0dWFsIGRydWdcbi8vIGxpc3QgbGl2ZXMgYXQgSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiwgaW5cbi8vIGBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0YC4gV2UgZG8gdGhhdCAyLXN0ZXBcbi8vIGZldGNoIHNlcGFyYXRlbHk7IHRoaXMgZnVuY3Rpb24gYWRhcHRzIGEgc2luZ2xlIGRydWcgZW50cnkgZ2l2ZW4gaXRzXG4vLyBwYXJlbnQgdmlzaXQgY29udGV4dC5cbmZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZHJ1ZywgdmlzaXQpIHtcbiAgaWYgKCFkcnVnIHx8IHR5cGVvZiBkcnVnICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgLy8gdmlzaXQuZnVuY19EQVRFIGlzIFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHJvY1RvSVNPIG1hdGNoZXMgdGhlIFJPQ1xuICAvLyBwcmVmaXggY29ycmVjdGx5LlxuICBjb25zdCBkYXRlID0gcm9jVG9JU08odmlzaXQ/LmZ1bmNfREFURSB8fCB2aXNpdD8uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBjb25zdCBkcnVnX25hbWUgPSBwaWNrRW5nbGlzaChkcnVnLmRydWdfbmFtZSB8fCBkcnVnLmRydUdfTkFNRSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlIHx8ICFkcnVnX25hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXlzID0gTnVtYmVyKGRydWcub3JkZXJfZHJ1Z19kYXkgfHwgZHJ1Zy5vcmRlcl9EUlVHX0RBWSB8fCAwKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGRydWdfbmFtZSxcbiAgICBjb2RlOiBkcnVnLm9yZGVyX2NvZGUgfHwgZHJ1Zy5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBkb3NlL2ZyZXF1ZW5jeS9yb3V0ZSBcdTIwMTQgb25seSBkYXlzICsgcXR5LlxuICAgIGRvc2U6IFwiXCIsXG4gICAgZnJlcXVlbmN5OiBcIlwiLFxuICAgIHJvdXRlOiBcIlwiLFxuICAgIHF1YW50aXR5OiBkcnVnLm9yZGVyX3F0eSB8fCBkcnVnLm9yZGVyX1FUWSB8fCBcIlwiLFxuICAgIGR1cmF0aW9uX2RheXM6IE51bWJlci5pc0Zpbml0ZShkYXlzKSA/IGRheXMgOiAwLFxuICAgIC8vIHBpY2tFbmdsaXNoIG9uIGljZF9uYW1lIHR1cm5zIFx1ODI2Rlx1NjAyN1x1NjUxRFx1OEI3N1x1ODE3QS4uLnx8QmVuaWduIHByb3N0YXRpYy4uLiBpbnRvIHRoZSBFTiBzaWRlLlxuICAgIGluZGljYXRpb246IHBpY2tFbmdsaXNoKHZpc2l0Py5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2aXNpdD8uaWNkOWNtX25hbWUgfHwgXCJcIiksXG4gICAgaW5kaWNhdGlvbl9jb2RlOiB2aXNpdD8uaWNkOWNtX0NPREUgfHwgdmlzaXQ/LmljZDljbV9jb2RlIHx8IFwiXCIsXG4gICAgZHJ1Z19jbGFzczogcGlja0VuZ2xpc2goZHJ1Zy5hY3QgfHwgXCJcIiksXG4gICAgaG9zcGl0YWw6IHZpc2l0Py5ob3NwX0FCQlIgfHwgdmlzaXQ/Lmhvc3BfYWJiciB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBTdHViIGtlcHQgZm9yIHRoZSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgSUhLRTMzMDZTMDEgbGlzdCBuZXZlciBoYXMgZHJ1Z3MsXG4vLyBzbyB3ZSBhbHdheXMgcmV0dXJuIG51bGwgYW5kIHJlbHkgb24gdGhlIDItc3RlcCBkZXRhaWwgZmV0Y2ggYWJvdmUuXG5mdW5jdGlvbiBhZGFwdE1lZGljYXRpb24oKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIElIS0UzNDAyUzAxIChcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjVcdTdENTBcdTY3OUMpIFx1MjAxNCBvbmUgcm93IHBlciBzY3JlZW5pbmcgZXZlbnQsIGZsYXRcbi8vIHNjaGVtYS4gTkhJIHJ1bnMgdGhlIHBhbmVsIGl0c2VsZiBhbmQgcmV0dXJucyB2aXRhbHMgKyBhIGZpeGVkXG4vLyBiYXR0ZXJ5IG9mIGxhYiB2YWx1ZXMgcHJlLWNvbXB1dGVkIChCTUkgLyB3YWlzdCAvIEJQIC8gbGlwaWRzIC8gTEZUXG4vLyAvIFJGVCAvIGZhc3RpbmcgZ2x1Y29zZSAvIEhCc0FnIC8gQW50aS1IQ1YgLyB1cmljIGFjaWQgXHUyMDI2KS5cbi8vIFdlIHVuZm9sZCBvbmUgcm93IGludG8gfjE1IE9ic2VydmF0aW9uczogdml0YWxzIGdvIHRvIGNhdGVnb3J5XG4vLyB2aXRhbC1zaWducyAoc28gU01BUlQgYXBwcycgdml0YWxzIHZpZXdzIHBpY2sgdGhlbSB1cCksIGxhYnMgZ28gdG9cbi8vIGNhdGVnb3J5IGxhYm9yYXRvcnkuIFJldHVybnMgYW4gQVJSQVkgXHUyMDE0IGNhbGxlciBtdXN0IGZsYXQtbWFwLlxuZnVuY3Rpb24gYWRhcHRBZHVsdFByZXZlbnRpdmUocm93KSB7XG4gIGlmICghcm93IHx8IHR5cGVvZiByb3cgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08ocm93LmZpcnNUX0RJQUdfREFURSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaG9zcGl0YWwgPSByb3cuaG9zUF9BQkJSIHx8IHJvdy5ob3NwX0FCQlIgfHwgXCJcIjtcbiAgY29uc3Qgb3V0ID0gW107XG4gIC8vIChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBOSEkgY29kZSlcbiAgZnVuY3Rpb24gcHVzaChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBjb2RlKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybjtcbiAgICBjb25zdCB2ID0gU3RyaW5nKHZhbHVlKS50cmltKCk7XG4gICAgaWYgKHYgPT09IFwiXCIgfHwgdiA9PT0gXCItXCIgfHwgdiA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgIG91dC5wdXNoKHtcbiAgICAgIGRhdGUsXG4gICAgICBob3NwaXRhbCxcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIixcbiAgICAgIG9yZGVyX2NvZGU6IGNvZGUgfHwgXCJcIixcbiAgICAgIG9yZGVyX25hbWU6IGRpc3BsYXksXG4gICAgICBjb2RlOiBjb2RlIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgICAgdmFsdWU6IHYsXG4gICAgICB1bml0OiB1bml0IHx8IFwiXCIsXG4gICAgICByZWZlcmVuY2VfcmFuZ2U6IHJlZlJhbmdlIHx8IFwiXCIsXG4gICAgfSk7XG4gIH1cbiAgLy8gVml0YWwgc2lnbnNcbiAgcHVzaChcIkJvZHkgSGVpZ2h0XCIsIHJvdy5oZWlnaHQsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJvZHkgV2VpZ2h0XCIsIHJvdy53ZWlnaHQsIFwia2dcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJNSVwiLCByb3cuYm1pLCBcImtnL20yXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJXYWlzdCBDaXJjdW1mZXJlbmNlXCIsIHJvdy53YWlzdGxpbmUsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIlN5c3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX1NCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkRpYXN0b2xpYyBCbG9vZCBQcmVzc3VyZVwiLCByb3cuYmFzRV9FQlAsIFwibW1IZ1wiLFxuICAgICAgIHJvdy5ibG9EX1BSRVNTX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIC8vIExpcGlkIHBhbmVsXG4gIHB1c2goXCJDaG9sZXN0ZXJvbFwiLCAgIHJvdy5jaG8sICAgICBcIm1nL2RMXCIpO1xuICBwdXNoKFwiVHJpZ2x5Y2VyaWRlXCIsICByb3cuYmxvRF9URywgXCJtZy9kTFwiKTtcbiAgcHVzaChcIkhETFwiLCAgICAgICAgICAgcm93LmhkbCwgICAgIFwibWcvZExcIik7XG4gIHB1c2goXCJMRExcIiwgICAgICAgICAgIHJvdy5sZGwsICAgICBcIm1nL2RMXCIpO1xuICAvLyBMaXZlciBmdW5jdGlvblxuICBwdXNoKFwiU0dPVCAoQVNUKVwiLCAgICByb3cuc2dvdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIHB1c2goXCJTR1BUIChBTFQpXCIsICAgIHJvdy5zZ3B0LCAgICBcIlUvTFwiLCByb3cubEZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiKTtcbiAgLy8gRmFzdGluZyBnbHVjb3NlIFx1MjAxNCBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIDA5MDA1Q1xuICBwdXNoKFwiR2x1LUFDXCIsICAgICAgICByb3cuc18wOTAwNUMsIFwibWcvZExcIixcbiAgICAgICByb3cuc18wOTAwNUNfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwNUNcIik7XG4gIC8vIFJlbmFsIGZ1bmN0aW9uXG4gIHB1c2goXCJCVU5cIiwgICAgICAgICAgIHJvdy51cmluRV9CVU4sICAgXCJtZy9kTFwiKTtcbiAgcHVzaChcIkNyZWF0aW5pbmVcIiwgICAgcm93LmJsb0RfQ1JFQVQsICBcIm1nL2RMXCIpO1xuICBwdXNoKFwiZUdGUlwiLCAgICAgICAgICByb3cuZWdmciwgICAgICAgIFwibUwvbWluLzEuNzNtMlwiLFxuICAgICAgIHJvdy5yRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICBwdXNoKFwiVXJpbmUgUHJvdGVpblwiLCByb3cudXJpbkVfUFJPVEVJTiwgXCJcIixcbiAgICAgICByb3cudXJpbkVfUFJPVEVJTl9URVhUIHx8IFwiXCIpO1xuICAvLyBIZXBhdGl0aXMgQi9DIHNjcmVlbmluZ1xuICBwdXNoKFwiSEJzQWdcIiwgICAgICAgICByb3cuaGJzYWcsICAgICAgIFwiXCIsIHJvdy5oYnNhR19URVhUIHx8IFwiXCIpO1xuICBwdXNoKFwiQW50aS1IQ1ZcIiwgICAgICByb3cuYW50SV9IQ1YsICAgIFwiXCIsIHJvdy5hbnRJX0hDVl9URVhUIHx8IFwiXCIpO1xuICAvLyBVcmljIGFjaWQgXHUyMDE0IG5vdGU6IE5ISSdzIElIS0UzNDAyIHNjaGVtYSBhbHNvIGhhcyBhIGZpZWxkIGNhbGxlZFxuICAvLyBgdXJpbkVfVUFfRElBR19BQ0lEYCB0aGF0IExPT0tTIGxpa2UgdXJpbmUgVUEgYnV0IHRoZSB2YWx1ZXMgYXJlXG4gIC8vIGlkZW50aWNhbCB0byBgdXJpQ19BQ0lEYCAoc2VydW0sIG1nL2RMKS4gSXQncyBhIG1pc25hbWVkIGR1cGxpY2F0ZVxuICAvLyB3ZSBkZWxpYmVyYXRlbHkgc2tpcCBcdTIwMTQgdXNpbmcgYm90aCB3b3VsZCBjcmVhdGUgdHdvIEZISVJcbiAgLy8gT2JzZXJ2YXRpb25zIHdpdGggdGhlIHNhbWUgdmFsdWUgYnV0IGNvbnRyYWRpY3Rvcnkgc3BlY2ltZW5zLlxuICBwdXNoKFwiVXJpYyBBY2lkXCIsICAgICByb3cudXJpQ19BQ0lELCAgIFwibWcvZExcIik7XG4gIC8vIFVyaW5lIFVBIChxdWFsaXRhdGl2ZSB1cmluZSBkaXBzdGljayB0ZXN0IFx1MjAxNCBkaXN0aW5jdCBmcm9tIHRoZVxuICAvLyBtaXNsYWJlbGVkIHVyaW5FX1VBX0RJQUdfQUNJRCBhYm92ZTsgdGhpcyBgdXJpbkVfVUFgIGlzIHRoZSByZWFsXG4gIC8vIHVyaW5lIFVBIHJlc3VsdCwgdXN1YWxseSBhICsvLSBzdHJpbmcgb3IgZW1wdHkgd2hlbiBub3QgcnVuKS5cbiAgcHVzaChcIlVyaW5lIFVBXCIsICAgICAgcm93LnVyaW5FX1VBLCAgICBcIlwiLFxuICAgICAgIHJvdy51cmluRV9VQV9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICAvLyBNZXRhYm9saWMgc3luZHJvbWUgc2NyZWVuaW5nIFx1MjAxNCB2YWx1ZSBpcyBhbiBpbnRlcnByZXRhdGlvbiBzdHJpbmdcbiAgLy8gKCdcdTZCNjNcdTVFMzgnIC8gJ1x1NzU3MFx1NUUzOFx1RkYwQ1x1NUVGQVx1OEI3MFx1RkYxQVx1OEFDQlx1NkQzRFx1OEE2Mlx1OTFBQlx1NUUyQicpLCBub3QgYSBudW1iZXIuIFRoZSBtYXBwZXInc1xuICAvLyBfdHJ5X3BhcnNlX3F1YW50aXR5IHdpbGwgcmV0dXJuIE5vbmUgYW5kIGl0IGZhbGxzIHRocm91Z2ggdG9cbiAgLy8gdmFsdWVTdHJpbmcuIE5vIG1hcHBlZCBMT0lOQyBrZXl3b3JkICh5ZXQpIHNvIHRoaXMgbGFuZHMgYXMgYW5cbiAgLy8gT2JzZXJ2YXRpb24gd2l0aCBjb2RlLnRleHQgb25seTsgZG93bnN0cmVhbSBjb25zdW1lcnMgY2FuIHN0aWxsXG4gIC8vIHN1cmZhY2UgaXQgdW5kZXIgdGhlIHBhdGllbnQncyBzY3JlZW5pbmcgc2VjdGlvbiBieSBjb2RlLnRleHQuXG4gIHB1c2goXCJcdTRFRTNcdThCMURcdTc1QzdcdTUwMTlcdTdGQTRcdTdCRTlcdTZBQTIgKE1ldGFib2xpYyBTeW5kcm9tZSBTY3JlZW5pbmcpXCIsXG4gICAgICAgcm93Lm1ldEFfU1lORFJfUkVTVUxUX1RFWFQsIFwiXCIsIFwiXCIpO1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyBJSEtFMzMwOVMwMSAoXHU0RjRGXHU5NjYyIGlucGF0aWVudCBsaXN0KSBcdTIwMTQgZ2l2ZXMgcHJvcGVyIGFkbWlzc2lvbi9kaXNjaGFyZ2UuXG4vLyBTaGFwZToge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIGluX0RBVEUsIG91dF9EQVRFLFxuLy8gICAgICAgICBpY2Q5Y21fQ09ERSwgaWNkOWNtX0NPREVfQ05BTUUsIG9yaV9UWVBFKFwiM1wiKSwgcm93X0lELCAuLi59XG4vLyBJSEtFMzMwOFMwMSBoYXMgdGhlIHNhbWUgc2hhcGUgZm9yIGEgc21hbGwgc2V0IG9mIG9sZGVyIFx1NEY0Rlx1OTY2MiByZWNvcmRzO1xuLy8gYGZ1bmNfREFURWAgaW5zdGVhZCBvZiBgaW5fREFURWAgaW4gc29tZSByb3dzIFx1MjAxNCBhZGFwdGVyIGFjY2VwdHMgYm90aC5cbmZ1bmN0aW9uIGFkYXB0SW5wYXRpZW50RW5jb3VudGVyKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc3RhcnQgPSByb2NUb0lTTyhpdGVtLmluX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgXCJcIik7XG4gIGNvbnN0IGVuZCA9IHJvY1RvSVNPKGl0ZW0ub3V0X0RBVEUgfHwgXCJcIik7XG4gIGlmICghc3RhcnQpIHJldHVybiBudWxsO1xuICAvLyBpY2Q5Y20gbmFtZSBvbiBcdTRGNEZcdTk2NjIgbGlzdCBpcyBqdXN0IENoaW5lc2UgKG5vIHx8IEVuZ2xpc2ggc3BsaXQgb2JzZXJ2ZWQpLlxuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX25hbWUgfHwgXCJcIik7XG4gIHJldHVybiB7XG4gICAgZGF0ZTogc3RhcnQsXG4gICAgZW5kX2RhdGU6IGVuZCxcbiAgICBjbGFzczogXCJJTVBcIixcbiAgICB0eXBlX2Rpc3BsYXk6IFwiXHU0RjRGXHU5NjYyXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIHJvd19pZDogaXRlbS5yb3dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkgaXRlbSBzaGFwZSBcdTIwMTQgZmFyIG1vcmUgY29tcGxldGUgdGhhbiB0aGUgb2xkZXJcbi8vIElIS0UzMzAxUzAyIHZpc2l0IGxpc3QgKDUxIHZpc2l0cyB2cyA2IGZvciB0aGUgdGVzdCBwYXRpZW50KS4gTkhJJ3Ncbi8vIGNhbm9uaWNhbCBzb3VyY2Ugb2YgdHJ1dGggZm9yIFwiZXZlcnkgYmlsbGVkIGVuY291bnRlclwiLlxuLy8gICBob3NQX0lELCBob3NQX0FCQlIsIGhvc3BfdXJsXG4vLyAgIGZ1bkNfREFURSAgICAgICAgICAgICAgKFx1NkMxMVx1NTcwQiBZWVkvTU0vREQpXG4vLyAgIGljRDlDTV9DT0RFIC8gaWNEOUNNX0NPREVfQ05BTUVcbi8vICAgb3JJX1RZUEUgLyBvcmlfdHlwZV9uYW1lICAgKFwiSUNcdTUzNjFcdThDQzdcdTY1OTlcIiAvIFwiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIpIFx1MjAxNCBvcmlnaW4sIE5PVCBcdTk1ODAvXHU2MDI1L1x1NEY0RlxuLy8gICBwYXJ0X0FNVCwgYXBwbF9ET1QsIFx1MjAyNiAgIChiaWxsaW5nIFx1MjAxNCBkaXNjYXJkZWQpXG4vLyAgIHJvV19JRCAgICAgICAgICAgICAgICAgIGRldGFpbCBrZXkgZm9yIElIS0UzMzAzUzAyIGZhbi1vdXQgKFBoYXNlIEIpXG4vLyBXZSBkb24ndCBoYXZlIHZpc2l0IGNsYXNzIChcdTk1ODAvXHU2MDI1L1x1NEY0RikgYXQgdGhlIGxpc3QgbGV2ZWw7IHRoZSBTMDIgZGV0YWlsXG4vLyBoYXMgaG9zcF9EQVRBX1RZUEVfTkFNRSAoXCJcdTg5N0ZcdTkxQUJcIi9cIlx1NEUyRFx1OTFBQlwiL1wiXHU3MjU5XHU5MUFCXCIpLiBGb3Igbm93IGRlZmF1bHQgQU1CLlxuZnVuY3Rpb24gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZShpdGVtLCBjbGFzc0hpbnQpIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFIHx8IGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUpIHJldHVybiBudWxsO1xuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY0Q5Q01fQ09ERSB8fCBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgaWNkTmFtZSA9IHBpY2tFbmdsaXNoKFxuICAgIGl0ZW0uaWNEOUNNX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9uYW1lIHx8IFwiXCJcbiAgKTtcbiAgLy8gY2xhc3MgZGVmYXVsdHMgdG8gQU1COyBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dCBtYXkgb3ZlcnJpZGUgdG9cbiAgLy8gRU1FUiAvIElNUCBiYXNlZCBvbiBob3NwX0RBVEFfVFlQRV9OQU1FIChcdTYwMjVcdThBM0EgLyBcdTRGNEZcdTk2NjIpLlxuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgZW5kX2RhdGU6IFwiXCIsXG4gICAgY2xhc3M6IGNsYXNzSGludCB8fCBcIkFNQlwiLFxuICAgIC8vIE9yaWdpbiBtYXJrZXIgaXNuJ3QgYSBjbGluaWNhbCBjbGFzcywgYnV0IHN0YXNoIGl0IGFzIHR5cGVfZGlzcGxheVxuICAgIC8vIHNvIGRvd25zdHJlYW0gc2VlcyB0aGUgTkhJIGxhYmVsIHdpdGhvdXQgdXMgaW52ZW50aW5nIG9uZS5cbiAgICB0eXBlX2Rpc3BsYXk6IGl0ZW0ub3JpX3R5cGVfbmFtZSB8fCBpdGVtLm9ySV9UWVBFX05BTUUgfHwgXCJcIixcbiAgICBkZXBhcnRtZW50OiBcIlwiLFxuICAgIHByb3ZpZGVyOiBcIlwiLFxuICAgIHJlYXNvbjogaWNkTmFtZSA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lfWAgOiBpY2ROYW1lKSA6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gUGFzcyB0aHJvdWdoIGZvciB0aGUgZXZlbnR1YWwgSUhLRTMzMDNTMDIgZGV0YWlsIGZldGNoIChQaGFzZSBCKS5cbiAgICByb3dfaWQ6IGl0ZW0ucm9XX0lEIHx8IGl0ZW0ucm93X2lkIHx8IFwiXCIsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkYXB0QWxsZXJneShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGFsbGVyZ2VuID1cbiAgICBpdGVtLmFsbGVyZ2VuX25hbWUgfHwgaXRlbS5hbGxlUl9OQU1FIHx8IGl0ZW0ubWVkbmFtZSB8fFxuICAgIGl0ZW0uZHJ1R19OQU1FIHx8IGl0ZW0uYWxsZXJnZW4gfHwgXCJcIjtcbiAgaWYgKCFhbGxlcmdlbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5yZWNvckRfREFURSB8fCBcIlwiKSxcbiAgICBkaXNwbGF5OiBhbGxlcmdlbixcbiAgICBjYXRlZ29yeTogXCJtZWRpY2F0aW9uXCIsXG4gICAgY3JpdGljYWxpdHk6IFwidW5hYmxlLXRvLWFzc2Vzc1wiLFxuICAgIHJlYWN0aW9uOiBpdGVtLnJlYWN0aW9OIHx8IGl0ZW0uc3ltcHRvbSB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwMVMwNSAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBsaXN0KSBzaGFwZTpcbi8vICAge2hvc3BfaWQsIGhvc3BfYWJiciwgaG9zcF91cmwsIG9yaV90eXBlX25hbWUsIG9yaV90eXBlLCBmdW5jX2RhdGUsXG4vLyAgICBvdXRfZGF0ZSwgaWNkOWNtX2NvZGUsIGljZDljbV9jb2RlX2NuYW1lLCBvcF9jb2RlX2NuYW1lLCByb3dfaWR9XG4vLyBOb3RlOiBubyBwcm9jZWR1cmUgQ09ERSBpbiBsaXN0IFx1MjAxNCBvcF9jb2RlX2NuYW1lIGlzIHRoZSBvbmx5IGxhYmVsLlxuZnVuY3Rpb24gYWRhcHRQcm9jZWR1cmUoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oaXRlbS5mdW5jX2RhdGUgfHwgaXRlbS5mdW5DX0RBVEUpO1xuICBjb25zdCBkaXNwbGF5ID0gcGlja0VuZ2xpc2goXG4gICAgaXRlbS5vcF9jb2RlX2NuYW1lIHx8IGl0ZW0ucHJvQ19OQU1FIHx8IGl0ZW0ub3JkZVJfTkFNRSB8fCBcIlwiXG4gICk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSkgcmV0dXJuIG51bGw7XG4gIC8vIERpYWdub3NpcyAoaWNkOWNtX2NvZGVfY25hbWUpIGlzIHRoZSAqcmVhc29uKiBmb3IgdGhlIHByb2NlZHVyZSwgbm90XG4gIC8vIHRoZSBwcm9jZWR1cmUgY29kZSBpdHNlbGYuIFN0YXNoIGl0IGluIGBub3RlYCBzbyBpdCBzaG93cyB1cCBpbiB0aGVcbiAgLy8gRkhJUiByZXNvdXJjZSB3aXRob3V0IHBvbGx1dGluZyB0aGUgY29kZSBmaWVsZC5cbiAgY29uc3QgcmVhc29uQ29kZSA9IGl0ZW0uaWNkOWNtX2NvZGUgfHwgaXRlbS5pY2Q5Y21fQ09ERSB8fCBcIlwiO1xuICBjb25zdCByZWFzb25OYW1lID0gcGlja0VuZ2xpc2goaXRlbS5pY2Q5Y21fY29kZV9jbmFtZSB8fCBpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IFwiXCIpO1xuICBjb25zdCBub3RlID0gcmVhc29uTmFtZVxuICAgID8gKHJlYXNvbkNvZGUgPyBgUmVhc29uOiAke3JlYXNvbkNvZGV9ICR7cmVhc29uTmFtZX1gIDogYFJlYXNvbjogJHtyZWFzb25OYW1lfWApXG4gICAgOiBcIlwiO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogXCJcIixcbiAgICBkaXNwbGF5LFxuICAgIG5vdGUsXG4gICAgYm9keV9zaXRlOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfYWJiciB8fCBpdGVtLmhvc1BfQUJCUiB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzQwOFMwMSAoXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1IGxpc3QpIHNoYXBlOlxuLy8gICB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgcmVhbF9JTlNQRUNUX0RBVEUsIG9yZGVyX0NPREUsXG4vLyAgICBvcmRlcl9DT0RFXzJXb3JkLCBvcmRlcl9OQU1FLCBvcmlfVFlQRSwgcm93X0lELCBqcEdfU1RBVFVTLCAuLi59XG4vLyBObyBmaW5kaW5ncy9jb25jbHVzaW9uIFx1MjAxNCBsaXN0IGlzIG9yZGVyLWxldmVsIG9ubHkuIFdlIG1hcCB0byBQcm9jZWR1cmVcbi8vIChhbiBleGFtIHdhcyBwZXJmb3JtZWQpIHJhdGhlciB0aGFuIERpYWdub3N0aWNSZXBvcnQgKHdoaWNoIG5lZWRzIGFcbi8vIG5hcnJhdGl2ZSkuIElmL3doZW4gd2UgZmV0Y2ggdGhlIGFjdHVhbCByZXBvcnQgdGhpcyBiZWNvbWVzIGEgRFIuXG4vLyBJSEtFMzQwOFMwMiBkZXRhaWwgcHJvdmlkZXMgdGhlIGZ1bGwgcmFkaW9sb2d5IC8gZW5kb3Njb3B5IHJlcG9ydCBpblxuLy8gYGRlc2NgLiBDb21iaW5lZCB3aXRoIG9yZGVyX05BTUUgKyBmdW5jX0RBVEUgdGhpcyBpcyBhIHByb3BlciBGSElSXG4vLyBEaWFnbm9zdGljUmVwb3J0LiBMaXN0LW9ubHkgZW50cmllcyAod2hlcmUgdGhlIGRldGFpbCBmZXRjaCByZXR1cm5lZFxuLy8gbm8gYGRlc2NgKSBnZXQgZHJvcHBlZCBcdTIwMTQgd2l0aG91dCBhIG5hcnJhdGl2ZSB0aGUgcmVwb3J0IG1hcHBlciB3b3VsZFxuLy8gcmVqZWN0IHRoZW0gYW55d2F5LlxuZnVuY3Rpb24gYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbChpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgY29uc3QgZGlzcGxheSA9IHBpY2tFbmdsaXNoKGl0ZW0ub3JkZXJfTkFNRSB8fCBpdGVtLm9yZGVyX25hbWUgfHwgXCJcIik7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoaXRlbS5kZXNjIHx8IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5IHx8ICFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IGl0ZW0ub3JkZXJfQ09ERSB8fCBpdGVtLm9yZGVyX2NvZGUgfHwgXCJcIixcbiAgICBzeXN0ZW06IFwiXCIsXG4gICAgZGlzcGxheSxcbiAgICBjYXRlZ29yeTogXCJSQURcIixcbiAgICBjb25jbHVzaW9uLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIE5ISSBzZXBhcmF0ZXMgdGhlIGV4YW0gZGF0ZSAoZnVuY19EQVRFKSBmcm9tIHRoZSByZXBvcnQtdXBsb2FkXG4gICAgLy8gdGltZXN0YW1wIChhc3NheV9VUExPQURfREFURSkuIFRoZSBsYXR0ZXIgaXMgd2hlbiB0aGUgcmVwb3J0XG4gICAgLy8gd2FzIGZpbmFsaXNlZCBpbiBOSEkncyBzeXN0ZW0gXHUyMDE0IG1hcHMgdG8gRGlhZ25vc3RpY1JlcG9ydC5pc3N1ZWQuXG4gICAgLy8gRmFsbHMgYmFjayB0byBOb25lIGlmIE5ISSBkaWRuJ3Qgc2hpcCBvbmUuXG4gICAgaXNzdWVkOiByb2NUb0lTTygoaXRlbS5hc3NheV9VUExPQURfREFURSB8fCBcIlwiKS5zcGxpdCgvXFxzKy8pWzBdKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRhcHREaWFnUmVwb3J0KGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFKTtcbiAgY29uc3QgZGlzcGxheSA9IGl0ZW0ub3JkZVJfTkFNRSB8fCBpdGVtLmFzc2FZX0lURU1fTkFNRSB8fCBpdGVtLmV4YW1OYW1lIHx8IFwiXCI7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGNvbmNsdXNpb24gPVxuICAgIGl0ZW0ucmVwb3J0IHx8IGl0ZW0uZmluZGluZ1MgfHwgaXRlbS5pbVBfREFUQSB8fCBpdGVtLmNvbnN1bFRfVkFMVUUgfHwgXCJcIjtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IGl0ZW0ub3JkZVJfQ09ERSB8fCBcIlwiLFxuICAgIHN5c3RlbTogXCJcIixcbiAgICBkaXNwbGF5LFxuICAgIGNhdGVnb3J5OiBcIlJBRFwiLFxuICAgIGNvbmNsdXNpb24sXG4gIH07XG59XG5cbi8vIHBhZ2VfdHlwZSBcdTIxOTIgYmFja2VuZCBwYWdlX3R5cGUgc3RyaW5nIHVzZWQgYnkgbWFwcGVycy5cbi8vIHBhdGggaXMgcmVsYXRpdmUgdG8gbmhpQmFzZS4gbWV0aG9kIGRlZmF1bHQgXCJHRVRcIi5cbi8vIGBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZWAgPSBlbmRwb2ludCBhY2NlcHRzIHNfZGF0ZSAvIGVfZGF0ZSBpbiBcdTZDMTFcdTU3MEIgZm9ybWF0LlxuLy8gQ29uZmlybWVkIHZpYSBVUkxzIG9ic2VydmVkIGluIE5ISSdzIFNQQS4gT3RoZXIgZW5kcG9pbnRzIGVpdGhlciBkb24ndFxuLy8gYWNjZXB0IHJhbmdlIHBhcmFtcywgb3IgTkhJIHJlamVjdHMgdW5rbm93biBwYXJhbXMgXHUyMDE0IHdlIGxlYXZlIHRoZW0gYWxvbmVcbi8vICh0aGV5IGZhbGwgYmFjayB0byB0aGVpciBkZWZhdWx0IHdpbmRvdywgdHlwaWNhbGx5IDEtMiB5ZWFycykuXG5jb25zdCBOSElfQVBJX0VORFBPSU5UUyA9IFtcbiAgLy8gZW5jb3VudGVycyAvIHByb2NlZHVyZXMgZG9uJ3QgaGF2ZSBhIC9zZWFyY2ggdmFyaWFudCAoNDA0KS4gcGFnZV9sb2FkXG4gIC8vIHNpbGVudGx5IGlnbm9yZXMgc19kYXRlIC8gZV9kYXRlIFx1MjAxNCB2ZXJpZmllZCB0aGUgYXJyYXkgbGVuZ3RoIGlzXG4gIC8vIGlkZW50aWNhbCB3aXRoIG9yIHdpdGhvdXQgZGF0ZXMuIERhdGUgZmlsdGVyIGlzIGVmZmVjdGl2ZWx5IHVuc3VwcG9ydGVkXG4gIC8vIGZvciB0aGVzZSBlbmRwb2ludHM7IHRoZXkgcmV0dXJuIGFsbCBkYXRhIGluIE5ISSdzIGxpZmV0aW1lIHdpbmRvdy5cbiAgLy8gRW5jb3VudGVyIHNvdXJjZTogSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkuIFRoZSAvcGFnZV9sb2FkIHZhcmlhbnRcbiAgLy8gaXMgd2luZG93LWxpbWl0ZWQgdG8gfjEgeWVhciAocmV0dXJuZWQgNTEgdmlzaXRzIGVuZGluZyAxMTQvMDUpO1xuICAvLyAvc2VhcmNoIGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGFuZCBnb2VzIGJhY2sgZnVydGhlciAoMTYyIHZpc2l0c1xuICAvLyB0byAxMTIvMDUgZm9yIHRoZSBzYW1lIHBhdGllbnQpLiBTaW5jZSBsYWJzL21lZHMgZXh0ZW5kIHRvIDN5IHZpYVxuICAvLyB0aGVpciBvd24gL3NlYXJjaCBlbmRwb2ludHMsIGVuY291bnRlciBNVVNUIGFsc28gdXNlIC9zZWFyY2ggb3JcbiAgLy8gdGhlIChob3NwaXRhbCwgZGF0ZSkgbGlua2VyIGhhcyBub3RoaW5nIHRvIG1hdGNoIGFnYWluc3QgZm9yIG9sZGVyXG4gIC8vIGxhYiBkYXRlcy5cbiAgeyBuYW1lOiBcImVuY291bnRlcnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAzczAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT1cIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElucGF0aWVudCAoXHU0RjRGXHU5NjYyKSBcdTIwMTQgSUhLRTMzMDlTMDEgaXMgdGhlIHByaW1hcnkgbGlzdCB3aXRoIGluX0RBVEUvb3V0X0RBVEVcbiAgLy8gc3Bhbi4gSUhLRTMzMDhTMDEgY2FycmllcyBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3JkcyB3aXRoIHRoZVxuICAvLyBzYW1lIGZpZWxkcyAoZnVuY19EQVRFIGluIHNvbWUgcm93cyBpbnN0ZWFkIG9mIGluX0RBVEU7IGFkYXB0ZXJcbiAgLy8gaGFuZGxlcyBib3RoKS4gQm90aCBmZWVkIHRoZSBzYW1lIGVuY291bnRlciBtYXBwZXIuXG4gIHsgbmFtZTogXCJpbnBhdGllbnRcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOXMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJpbnBhdGllbnRfbGVnYWN5XCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOHMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwMXMwNS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0UHJvY2VkdXJlIH0sXG4gIC8vIG1lZGljYXRpb25zOiBwYWdlX2xvYWQgb25seSBhY2NlcHRzIGVtcHR5IGRhdGVzIChIVFRQIDQwMCBvdGhlcndpc2UpLlxuICAvLyBUaGUgL3NlYXJjaCBlbmRwb2ludCBpcyB3aGF0IHRoZSBTUEEgaGl0cyB3aGVuIHVzZXIgcGlja3MgYSBjdXN0b21cbiAgLy8gZGF0ZSByYW5nZSBhbmQgYWNjZXB0cyBJU08gXHU4OTdGXHU1MTQzIGRhdGVzIHdpdGggZGFzaGVzICgyMDIzLTAxLTAxKS5cbiAgLy8gQ29uZmlybWVkIHZpYSBEZXZUb29scyBvYnNlcnZhdGlvbiBvZiB0aGUgXHU3QkU5XHU5MDc4IHBhbmVsIHN1Ym1pdC5cbiAgeyBuYW1lOiBcIm1lZGljYXRpb25zXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA2czAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExJnNfdHlwZT1BXCIsXG4gICAgcGFnZV90eXBlOiBcIm1lZGljYXRpb25zXCIsICAgICAgIGFkYXB0OiBhZGFwdE1lZGljYXRpb24sIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNfYlwiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwNFwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIC8vIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NVx1N0Q1MFx1Njc5QyAoSUhLRTM0MDJTMDEpOiBvbmUgcm93IHBlciBzY3JlZW5pbmcsIGNvbnRhaW5zXG4gIC8vIEJNSSAvIHZpdGFscyAvIGxpcGlkIHBhbmVsIC8gTEZUIC8gUkZUIC8gSGVwIEIvQyAvIHVyaWMgYWNpZCBhbGxcbiAgLy8gcHJlLWNvbXB1dGVkIGJ5IE5ISSdzIHNjcmVlbmluZyBwcm9ncmFtbWUuIGFkYXB0QWR1bHRQcmV2ZW50aXZlXG4gIC8vIHJldHVybnMgYW4gYXJyYXkgKG9uZSBPYnNlcnZhdGlvbiBwZXIgbWVhc3VyZW1lbnQpIHNvIHRoZVxuICAvLyBhZGFwdGVyLWNhbGwgbG9vcCBmbGF0dGVucyBpdC5cbiAgeyBuYW1lOiBcImFkdWx0X3ByZXZlbnRpdmVcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDAyczAxL1NQX0lIS0UzNDAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdEFkdWx0UHJldmVudGl2ZSB9LFxuICB7IG5hbWU6IFwiY2FuY2VyX3NjcmVlbmluZ1wiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDRzMDEvU1BfSUhLRTM0MDRTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0TGFiSXRlbSB9LFxuICAvLyBnbHVjb3NlIChJSEtFMzQwNlMwMSkgKyBsaXBpZCAoSUhLRTM0MDdTMDEpIGFyZSBzdWJzZXRzIG9mXG4gIC8vIG90aGVyX2xhYnMgKElIS0UzNDA5UzAxKSBwZXIgTkhJJ3MgZGF0YSBtb2RlbCBcdTIwMTQgZmV0Y2hpbmcgdGhlbVxuICAvLyBzZXBhcmF0ZWx5IGp1c3QgY3JlYXRlcyBkdXAgb2JzZXJ2YXRpb25zLCBzbyB3ZSBza2lwIHRoZW0uXG4gIC8vIEltYWdpbmcgbGlzdCAoSUhLRTM0MDhTMDEpIG9ubHkgY2FycmllcyBvcmRlci1sZXZlbCBkYXRhOyBmdWxsXG4gIC8vIG5hcnJhdGl2ZSByZXBvcnQgbGl2ZXMgYXQgSUhLRTM0MDhTMDIuIFdlIGRvIGEgMi1zdGVwIGZldGNoIChzZWVcbiAgLy8gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYikgdG8gZ3JhYiB0aGUgcmVwb3J0LCB0aGVuIG1hcCB0byBhIHJlYWxcbiAgLy8gRGlhZ25vc3RpY1JlcG9ydC4gVGhlIGxpc3QgYWRhcHRlciBpcyBhIG5vLW9wIHN0dWIgbGlrZSBtZWRpY2F0aW9ucy5cbiAgLy8gaW1hZ2luZzogc2VhcmNoIGVuZHBvaW50IGFjY2VwdHMgSVNPIGRhdGUgcmFuZ2UgbGlrZSBtZWRpY2F0aW9ucy5cbiAgeyBuYW1lOiBcImltYWdpbmdcIiwgICAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA4czAxL3NlYXJjaD9zX3R5cGU9JnNfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTFcIixcbiAgICBwYWdlX3R5cGU6IFwiZGlhZ25vc3RpY19yZXBvcnRzXCIsIGFkYXB0OiAoKSA9PiBudWxsLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBvdGhlcl9sYWJzIGFscmVhZHkgdXNlcyAvc2VhcmNoOyBzYW1lIElTTy1kYXNoIGRhdGUgZm9ybWF0IHdvcmtzLlxuICB7IG5hbWU6IFwib3RoZXJfbGFic1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDlzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuXTtcblxuLy8gQXBwbHkgYSB7c3RhcnQsIGVuZH0gSVNPIGRhdGUgcmFuZ2UgdG8gYW4gZW5kcG9pbnQgcGF0aDpcbi8vICAgLSBJZiBwYXRoIGFscmVhZHkgaGFzIHNfZGF0ZT0gcGxhY2Vob2xkZXJzLCBmaWxsIHRoZW0gaW4uXG4vLyAgIC0gT3RoZXJ3aXNlIGFwcGVuZCBzX2RhdGU9Li4uJmVfZGF0ZT0uLi4gdG8gdGhlIHF1ZXJ5IHN0cmluZy5cbi8vIEVuZHBvaW50cyB3aXRob3V0IGBzdXBwb3J0c0RhdGVSYW5nZWAgcGFzcyB0aHJvdWdoIHVuY2hhbmdlZC5cbmZ1bmN0aW9uIGFwcGx5RGF0ZVJhbmdlVG9QYXRoKHBhdGgsIGRhdGVSYW5nZSkge1xuICBpZiAoIWRhdGVSYW5nZSB8fCAoIWRhdGVSYW5nZS5zdGFydCAmJiAhZGF0ZVJhbmdlLmVuZCkpIHJldHVybiBwYXRoO1xuICAvLyBOSEkgZXhwZWN0cyBcdTg5N0ZcdTUxNDMgSVNPIGRhdGVzIHdpdGggZGFzaGVzOiAyMDIzLTAxLTAxIChub3QgXHU2QzExXHU1NzBCLCBub3RcbiAgLy8gc2xhc2hlcykuIENvbmZpcm1lZCBieSBvYnNlcnZpbmcgdGhlIFNQQSdzIHJlcXVlc3Qgd2hlbiB1c2VyIHBpY2tzXG4gIC8vIGEgY3VzdG9tIGRhdGUgcmFuZ2UuIFVSTC1lbmNvZGluZyB0aGUgZGFzaGVzIGlzIHVubmVjZXNzYXJ5LlxuICBjb25zdCBzID0gKGRhdGVSYW5nZS5zdGFydCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IGUgPSAoZGF0ZVJhbmdlLmVuZCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGxldCBwID0gcGF0aDtcbiAgaWYgKC9bPyZdc19kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdc19kYXRlPSlbXiZdKi8sIGAkMSR7c31gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IChwLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCIpICsgYHNfZGF0ZT0ke3N9YDtcbiAgfVxuICBpZiAoL1s/Jl1lX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1lX2RhdGU9KVteJl0qLywgYCQxJHtlfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gYCZlX2RhdGU9JHtlfWA7XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDZTMDIgZGV0YWlsIGZldGNoZXMgaW5zaWRlIHRoZSBOSEkgdGFiIHNvIGNvb2tpZXMgKyBKV1Rcbi8vIGF1dGggZmxvdyBuYXR1cmFsbHkuIFdlIHBhc3MgdGhlIHZpc2l0IGxpc3QgKGp1c3Qgcm93X0lEcyArIHRoZWlyIHBhcmVudFxuLy8gZmllbGRzIG5lZWRlZCBmb3IgYWRhcHRhdGlvbikgaW50byB0aGUgdGFiOyB0aGUgdGFiIHJldHVybnMgcGFyYWxsZWxcbi8vIGZldGNoZWQgYm9kaWVzOyB3ZSBhZGFwdCBiYWNrIGluIHRoZSBTVy5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgLy8gS2VlcCBwYXJlbnQgZmllbGRzIG5lZWRlZCBieSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsLlxuICAgICAgcGFyZW50OiB7XG4gICAgICAgIGZ1bmNfREFURTogdi5mdW5jX0RBVEUgfHwgdi5mdW5jX2RhdGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREU6IHYuaWNkOWNtX0NPREUgfHwgdi5pY2Q5Y21fY29kZSB8fCBcIlwiLFxuICAgICAgICBpY2Q5Y21fQ09ERV9DTkFNRTogdi5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2LmljZDljbV9uYW1lIHx8IFwiXCIsXG4gICAgICAgIGhvc3BfQUJCUjogdi5ob3NwX0FCQlIgfHwgdi5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAgIH0sXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTkhJIHVzZXMgZGlmZmVyZW50IGN0eXBlIHZhbHVlcyBmb3IgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIvXHU4NjU1XHU2NUI5XHU3QjhCLiBXZSBkb24ndFxuICAgICAgLy8gaGF2ZSB0aGUgcHVibGljIG1hcHBpbmcsIHNvIHRyeSBjdHlwZSAxLi40IGluIG9yZGVyIGFuZCBzdG9wIGFzXG4gICAgICAvLyBzb29uIGFzIG9uZSByZXR1cm5zIGRydWdzLiBjdHlwZT0yIGNvdmVyZWQgSUNcdTUzNjEgXHU5NTgwXHU4QTNBIGluIG91ciBzYW1wbGUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNF0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keT8uaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICAgICAgICBjb25zdCBoYXNEcnVncyA9IG1haW4uc29tZSgodikgPT5cbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodj8uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSAmJiB2LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC5sZW5ndGggPiAwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIGN0eXBlIHlpZWxkZWQgZHJ1Z3MgXHUyMDE0IHJldHVybiBsYXN0IHN1Y2Nlc3NmdWwgYm9keSBhbnl3YXkgc29cbiAgICAgICAgLy8gZGlhZ25vc3RpY3MgY2FuIHN0aWxsIHNlZSB0aGUgdmlzaXQgbWV0YWRhdGEuXG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaE9uZShyb3dJZCwgMik7XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBkcnVncyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGRydWdMaXN0ID0gQXJyYXkuaXNBcnJheSh2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpID8gdmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0IDogW107XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZHJ1Z0xpc3QpIHtcbiAgICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZCwgdmlzaXQpO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzNDA4UzAyIGRldGFpbCBmZXRjaGVzIGZvciBpbWFnaW5nIFx1MjAxNCBzYW1lIHBhdHRlcm4gYXMgdGhlXG4vLyBtZWRpY2F0aW9uIDItc3RlcC4gY3R5cGUgbWlycm9ycyB0aGUgdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICBjdHlwZTogdi5vcmlfVFlQRSB8fCB2Lm9yaV90eXBlIHx8IFwiQVwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzNDA4UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoY3R5cGUpfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCByZXBvcnRzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwodmlzaXQpO1xuICAgICAgaWYgKGFkYXB0ZWQpIHJlcG9ydHMucHVzaChhZGFwdGVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcG9ydHM7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDNTMDIgZGV0YWlsIHRvIGNsYXNzaWZ5IGVhY2ggSUhLRTMzMDNTMDEgdmlzaXQgYXNcbi8vIEFNQiAvIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRS4gVXNlcyA/cmlkPTxyb3dfSUQ+JnQ9TlxuLy8gd2hlcmUgTiBpcyB0aGUgdmlzaXQgdHlwZSBidWNrZXQ7IHdlIGRvbid0IGtub3cgdGhlIG1hcHBpbmcgYSBwcmlvcmksXG4vLyBzbyBmb3IgZWFjaCB2aXNpdCB3ZSB0cnkgdD0xLi41IHVudGlsIG9uZSByZXR1cm5zIG5vbi1lbXB0eSBtYWluX2RhdGEuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYsIGlkeCkgPT4gKHsgaWR4LCByb3dfSUQ6IHYucm9XX0lEIHx8IHYucm93X0lEIHx8IFwiXCIgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIHQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL2loa2UzMzAzczAyL3BhZ2VfbG9hZD9yaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZ0PSR7dH1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdG0gPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBGb3IgZWFjaCB2aXNpdCwgZmluZCB0aGUgYHRgIHRoYXQgcmV0dXJucyBub24tZW1wdHkgZGF0YS4gTkhJXG4gICAgICAvLyB1c2VzIHQ9MSBmb3Igb3V0cGF0aWVudCBcdTg5N0ZcdTkxQUIsIHQ9MiBtYXliZSBcdTYwMjVcdThBM0EvXHU0RTJEXHU5MUFCLCB0PTMgXHU0RjRGXHU5NjYyLFxuICAgICAgLy8gdD00IFx1NzI1OVx1OTFBQlx1MjAyNiBkb24ndCBoYXZlIGFuIGF1dGhvcml0YXRpdmUgbWFwcGluZyBzbyB3ZSBwcm9iZS5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgWzEsIDIsIDMsIDQsIDVdKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCB0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSAoci5ib2R5Py5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiB7IGJvZHk6IHIuYm9keSwgdCB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGJvZHk6IG51bGwgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIC8vIFBhaXIgZWFjaCBkZXRhaWwgYm9keSBiYWNrIHRvIGl0cyB2aXNpdCBwb3NpdGlvbi5cbiAgY29uc3QgYnlJZHggPSBuZXcgTWFwKCk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxcy5sZW5ndGg7IGkrKykge1xuICAgIGJ5SWR4LnNldChyZXFzW2ldLmlkeCwgcmVzdWx0c1tpXT8uYm9keSB8fCBudWxsKTtcbiAgfVxuICByZXR1cm4gYnlJZHg7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0Zyb21TMDJEZXRhaWwoYm9keSkge1xuICBpZiAoIWJvZHkpIHJldHVybiBudWxsO1xuICBjb25zdCBtYWluID0gKGJvZHkuaWhrZTMzMDNTMDJfbWFpbl9kYXRhKSB8fCBbXTtcbiAgaWYgKG1haW4ubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdG4gPSBTdHJpbmcobWFpblswXS5ob3NwX0RBVEFfVFlQRV9OQU1FIHx8IFwiXCIpO1xuICBpZiAodG4uaW5jbHVkZXMoXCJcdTYwMjVcIikpIHJldHVybiBcIkVNRVJcIjsgIC8vIFx1NjAyNVx1OEEzQVxuICBpZiAodG4uaW5jbHVkZXMoXCJcdTRGNEZcdTk2NjJcIikpIHJldHVybiBcIklNUFwiO1xuICAvLyBcdTg5N0ZcdTkxQUIgLyBcdTRFMkRcdTkxQUIgLyBcdTcyNTlcdTkxQUIgLyBcdTg1RTVcdTVDNDAgYWxsIGRlZmF1bHQgdG8gQU1CXG4gIHJldHVybiBcIkFNQlwiO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgcGF0aWVudE92ZXJyaWRlKSB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBwYWdlX3R5cGUsXG4gICAgICBob3N0OiBOSElfSE9TVCxcbiAgICAgIGl0ZW1zLFxuICAgICAgcGF0aWVudF9vdmVycmlkZTogcGF0aWVudE92ZXJyaWRlIHx8IG51bGwsXG4gICAgfSksXG4gIH0pO1xuICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcihgUE9TVCB1cGxvYWQtc3RydWN0dXJlZCAke3Iuc3RhdHVzfTogJHsoYXdhaXQgci50ZXh0KCkpLnNsaWNlKDAsIDIwMCl9YCk7XG4gIHJldHVybiBhd2FpdCByLmpzb24oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExvY2FsIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gUnVucyB0aGUgc2FtZSBtYXBwZXJzIHRoZSBiYWNrZW5kIHJ1bnMsIHRoZW4gdHJpZ2dlcnMgYSBkb3dubG9hZCBvZiB0aGVcbi8vIHJlc3VsdGluZyBGSElSIEJ1bmRsZS4gTm90aGluZyBsZWF2ZXMgdGhlIHVzZXIncyBtYWNoaW5lOyBubyBiYWNrZW5kXG4vLyByZXF1aXJlZC4gTWlycm9ycyBiYWNrZW5kL3VwbG9hZC1zdHJ1Y3R1cmVkIG9yZGVyOiBlbmNvdW50ZXJzIGZpcnN0IHNvXG4vLyB0aGF0IGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMgY2FuIGF0dGFjaCByZWZlcmVuY2VzIHRvIGRvd25zdHJlYW1cbi8vIG9ic2VydmF0aW9ucy9tZWRpY2F0aW9ucy9ldGMuXG5cbmNvbnN0IF9MT0NBTF9QQUdFX1RZUEVfT1JERVIgPSBbXG4gIFwiZW5jb3VudGVyc1wiLFxuICBcIm9ic2VydmF0aW9uc1wiLFxuICBcIm1lZGljYXRpb25zXCIsXG4gIFwiY29uZGl0aW9uc1wiLFxuICBcImFsbGVyZ2llc1wiLFxuICBcImRpYWdub3N0aWNfcmVwb3J0c1wiLFxuICBcInByb2NlZHVyZXNcIixcbl07XG5cbi8vIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZW5kcG9pbnQgSUhLRTM0MTBTMDEgKFx1NjIxMVx1NjNBNVx1N0EyRVx1N0QwMFx1OTMwNCAvIENPVklEIFx1N0JFOVx1NkFBMlx1N0QwMFx1OTMwNCkgaGFwcGVuc1xuLy8gdG8gY2FycnkgdGhlIGxvZ2dlZC1pbiB1c2VyJ3MgcmVhbCBjaXRpemVuIElEIGluIHRoZSByZXNwb25zZSAoYGNpZGBcbi8vIGZpZWxkLCBlLmcuIFwiUDEyMDc0MDg2NlwiKS4gVXNlIGl0IHRvIGZpbGwgdGhlIHBhdGllbnRfb3ZlcnJpZGUnc1xuLy8gaWRfbm8gd2hlbiB0aGUgdXNlciBsZWZ0IGl0IGJsYW5rIFx1MjAxNCB0aGF0IHdheSB0aGV5IGRvbid0IGhhdmUgdG8gdHlwZVxuLy8gdGhlaXIgb3duIFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RiBqdXN0IHRvIHNlZWQgRkhJUidzIFBhdGllbnQuaWQuXG4vL1xuLy8gQXV0by1yZXBsYWNlIHBvbGljeTogb25seSBmaWxsIHdoZW4gdGhlIG92ZXJyaWRlIGlkX25vIGlzIG1pc3Npbmcgb3Jcbi8vIGlzIHN0aWxsIGFuIFwiYXV0by1YWFhYWFhYWFwiIHBsYWNlaG9sZGVyIGdlbmVyYXRlZCBieSBhbiBlYXJsaWVyIHNhdmUuXG4vLyBBbnl0aGluZyBlbHNlIChlLmcuIHVzZXIgbWFudWFsbHkgdHlwZWQgYSBmYWtlIElEIGZvciBzY3JlZW4tc2hhcmVcbi8vIG9yIGdyb3VwaW5nKSBpcyByZXNwZWN0ZWQgYXMtaXMuXG5hc3luYyBmdW5jdGlvbiBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCBjdXJyZW50ID0gcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCI7XG4gIGNvbnN0IGlzUGxhY2Vob2xkZXIgPSAhY3VycmVudCB8fCBjdXJyZW50LnN0YXJ0c1dpdGgoXCJhdXRvLVwiKTtcbiAgaWYgKCFpc1BsYWNlaG9sZGVyKSByZXR1cm4gcGF0aWVudE92ZXJyaWRlO1xuXG4gIGxldCBjaWQgPSBudWxsO1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0KSByZXR1cm4gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goXCIvYXBpL2loa2UzMDAwL2loa2UzNDEwczAxL3BhZ2VfbG9hZFwiLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLCBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dH1gIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgcmV0dXJuIGJvZHk/LmNpZCB8fCBudWxsO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBWYWxpZGF0ZSBpdCBsb29rcyBsaWtlIGEgVGFpd2FuIG5hdGlvbmFsIElEICgxIGxldHRlciArIDkgZGlnaXRzKVxuICAgIC8vIGJlZm9yZSB0cnVzdGluZyBpdC4gQXZvaWRzIGFjY2lkZW50YWxseSBwcm9tb3RpbmcgZ2FyYmFnZSB0byB0aGVcbiAgICAvLyBQYXRpZW50IHJlc291cmNlJ3MgdW5pcXVlIGtleS5cbiAgICBpZiAocmVzdWx0ICYmIC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChyZXN1bHQpKSBjaWQgPSByZXN1bHQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIElIS0UzNDEwIGNpZCBmZXRjaCBmYWlsZWQ6XCIsIGU/Lm1lc3NhZ2UgPz8gZSk7XG4gIH1cblxuICBpZiAoY2lkICYmIGNpZCAhPT0gY3VycmVudCkge1xuICAgIHBhdGllbnRPdmVycmlkZSA9IHsgLi4ucGF0aWVudE92ZXJyaWRlLCBpZF9ubzogY2lkIH07XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBwYXRpZW50T3ZlcnJpZGUgfSkuY2F0Y2goKCkgPT4ge30pO1xuICB9XG4gIHJldHVybiBwYXRpZW50T3ZlcnJpZGU7XG59XG5cbi8vIFJlYWQgdGhlIG1hc2stbmFtZSBwcmVmZXJlbmNlIGZyZXNoIGZyb20gc3RvcmFnZS4gV2UgZG9uJ3QgY2FjaGUgXHUyMDE0XG4vLyBydW5OaGlBcGlTeW5jIGlzIGludm9rZWQgYXQgbW9zdCBhIGZldyB0aW1lcyBwZXIgc2Vzc2lvbiBhbmQgdGhlIFNXXG4vLyBjYW4gYmUgdG9ybiBkb3duICsgcmVzdGFydGVkIGFueSB0aW1lLCBzbyBhIHNpbmdsZSBnZXQoKSBwZXIgc3luYyBpc1xuLy8gY2hlYXBlciB0aGFuIHN5bmNpbmcgc3RhdGUgYWNyb3NzIFNXIGxpZmVjeWNsZXMuXG5hc3luYyBmdW5jdGlvbiBfaXNNYXNrRW5hYmxlZCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IG1hc2tOYW1lRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXCJtYXNrTmFtZUVuYWJsZWRcIik7XG4gICAgcmV0dXJuIG1hc2tOYW1lRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZE92ZXJyaWRlUGF0aWVudChvdiwgbWFza0VuYWJsZWQpIHtcbiAgY29uc3QgZGlzcGxheU5hbWUgPSBtYXNrRW5hYmxlZCA/IG1hc2tOYW1lKG92Lm5hbWUgfHwgXCJcIikgOiBvdi5uYW1lIHx8IFwiXCI7XG4gIGNvbnN0IHJhdyA9IHtcbiAgICBpZDogb3YuaWRfbm8sXG4gICAgaWRlbnRpZmllcjogb3YuaWRfbm8sXG4gICAgbmFtZTogZGlzcGxheU5hbWUgfHwgb3YuaWRfbm8sXG4gIH07XG4gIGlmIChvdi5iaXJ0aF9kYXRlKSByYXcuYmlydGhEYXRlID0gb3YuYmlydGhfZGF0ZTtcbiAgaWYgKG92LmdlbmRlcikgcmF3LmdlbmRlciA9IG92LmdlbmRlcjtcbiAgcmV0dXJuIG1hcFBhdGllbnQocmF3KTtcbn1cblxuLy8gV2FsayBhIEpTT04tbGlrZSB2YWx1ZSBhbmQgcmVwbGFjZSBldmVyeSBzdHJpbmcgdG9rZW4gZXF1YWwgdG8gb3Jcbi8vIGNvbnRhaW5pbmcgYG5lZWRsZWAgd2l0aCBgcmVwbGFjZW1lbnRgLiBVc2VkIHRvIHNjcnViIHRoZSByZWFsXG4vLyBwYXRpZW50IG5hbWUgb3V0IG9mIE5ISSBuYXJyYXRpdmUgZmllbGRzIChjbGluaWNhbF9ub3RlLCBjb25jbHVzaW9uLFxuLy8gbm90ZSwgZXRjLikgYmVmb3JlIHRoZSBpdGVtcyByZWFjaCB0aGUgbWFwcGVyLiBPbmx5IHRyaWdnZXJlZCB3aGVuXG4vLyB0aGUgdXNlciBoYXMgb3B0ZWQgaW50byBtYXNraW5nIEFORCBzdXBwbGllZCBhIG5hbWUgXHUyMDE0IGFuZCB0aGVcbi8vIHN1YnN0aXR1dGlvbiBpcyBleGFjdC10b2tlbi1yZXBsYWNlLCBub3QgZnV6enksIHNvIGl0IGNhbid0IHN1cnByaXNlXG4vLyB0aGUgdXNlciBieSBjbG9iYmVyaW5nIHVucmVsYXRlZCBjb250ZW50LlxuZnVuY3Rpb24gX3JlcGxhY2VOYW1lRGVlcCh2YWx1ZSwgbmVlZGxlLCByZXBsYWNlbWVudCkge1xuICBpZiAoIW5lZWRsZSB8fCBuZWVkbGUgPT09IHJlcGxhY2VtZW50KSByZXR1cm4gdmFsdWU7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHJldHVybiB2YWx1ZS5zcGxpdChuZWVkbGUpLmpvaW4ocmVwbGFjZW1lbnQpO1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHJldHVybiB2YWx1ZS5tYXAoKHYpID0+IF9yZXBsYWNlTmFtZURlZXAodiwgbmVlZGxlLCByZXBsYWNlbWVudCkpO1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHZhbHVlKSBvdXRba10gPSBfcmVwbGFjZU5hbWVEZWVwKHZhbHVlW2tdLCBuZWVkbGUsIHJlcGxhY2VtZW50KTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKSB7XG4gIGNvbnN0IHBhdGllbnQgPSBfYnVpbGRPdmVycmlkZVBhdGllbnQocGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCk7XG4gIGNvbnN0IHBpZCA9IHBhdGllbnQuaWQ7XG4gIGNvbnN0IGFsbCA9IFtwYXRpZW50XTtcblxuICBmb3IgKGNvbnN0IHB0IG9mIF9MT0NBTF9QQUdFX1RZUEVfT1JERVIpIHtcbiAgICBjb25zdCBpdGVtcyA9IGJ5VHlwZVtwdF07XG4gICAgaWYgKCFpdGVtcyB8fCBpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGxldCBtYXBwZWQ7XG4gICAgaWYgKEdST1VQX0hBTkRMRVJTW3B0XSkge1xuICAgICAgbWFwcGVkID0gR1JPVVBfSEFORExFUlNbcHRdKGl0ZW1zLCBwaWQpO1xuICAgIH0gZWxzZSBpZiAoTElTVF9IQU5ETEVSU1twdF0pIHtcbiAgICAgIGNvbnN0IFtmbl0gPSBMSVNUX0hBTkRMRVJTW3B0XTtcbiAgICAgIG1hcHBlZCA9IGl0ZW1zXG4gICAgICAgIC5maWx0ZXIoKGl0KSA9PiBpdCAmJiB0eXBlb2YgaXQgPT09IFwib2JqZWN0XCIpXG4gICAgICAgIC5tYXAoKGl0KSA9PiBmbihpdCwgcGlkKSlcbiAgICAgICAgLmZpbHRlcigocikgPT4gciAhPT0gbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAocHQgPT09IFwiZW5jb3VudGVyc1wiKSBtYXBwZWQgPSBkZWR1cEFkbWlzc2lvbkRheUFtYihtYXBwZWQpO1xuICAgIGFsbC5wdXNoKC4uLm1hcHBlZCk7XG4gIH1cblxuICAvLyBEZWR1cCBieSAocmVzb3VyY2VUeXBlLCBpZCkgYmVmb3JlIGFzc2VtYmxpbmcgdGhlIEJ1bmRsZS4gTXVsdGlwbGVcbiAgLy8gTkhJIGVuZHBvaW50cyBjYW4gZmVlZCB0aGUgc2FtZSBwYWdlX3R5cGUgKGUuZy4gZW5jb3VudGVycyAvXG4gIC8vIGlucGF0aWVudCAvIGlucGF0aWVudF9sZWdhY3kgYWxsIFx1MjE5MiBwYWdlX3R5cGU9XCJlbmNvdW50ZXJzXCIpLCBhbmQgdGhlXG4gIC8vIG1hcHBlciBwcm9kdWNlcyBkZXRlcm1pbmlzdGljIHN0YWJsZSBJRHMgXHUyMDE0IHNvIHR3byByYXcgaXRlbXMgdGhhdFxuICAvLyBkZXNjcmliZSB0aGUgc2FtZSBtZWRpY2FsIGV2ZW50IGNvbGxhcHNlIHRvIG9uZSByZXNvdXJjZS4gQmFja2VuZFxuICAvLyB1cHNlcnQgaGFuZGxlcyB0aGlzIGF1dG9tYXRpY2FsbHkgKHNhbWUgc3RhYmxlIElEID0gc2FtZSBEQiByb3cpO1xuICAvLyBsb2NhbCBtb2RlIGhhcyB0byBkbyBpdCBleHBsaWNpdGx5LiBXaXRob3V0IHRoaXMgZGVkdXAsIHRoZSBsb2NhbFxuICAvLyBCdW5kbGUgZW5kcyB1cCBpbmZsYXRlZCByZWxhdGl2ZSB0byB3aGF0IGJhY2tlbmQgc3RvcmVzIGZyb20gdGhlXG4gIC8vIGlkZW50aWNhbCBOSEkgaW5wdXQuXG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gIGNvbnN0IHVuaXF1ZSA9IFtdO1xuICBmb3IgKGNvbnN0IHIgb2YgYWxsKSB7XG4gICAgY29uc3Qga2V5ID0gYCR7ci5yZXNvdXJjZVR5cGV9LyR7ci5pZH1gO1xuICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICBzZWVuLmFkZChrZXkpO1xuICAgIHVuaXF1ZS5wdXNoKHIpO1xuICB9XG5cbiAgLy8gTGlua2VyICsgc2V4LXN0cmF0aWZpZWQgcmVzb2x2ZXIgcnVuIG9uY2Ugb3ZlciB0aGUgZnVsbCBhc3NlbWJsZWRcbiAgLy8gbGlzdCAoc2FtZSBwaXBlbGluZSBiYWNrZW5kJ3MgL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQgcnVucywganVzdFxuICAvLyBhZ2FpbnN0IGFuIGluLW1lbW9yeSBjYW5kaWRhdGUgYXJyYXkgaW5zdGVhZCBvZiBhIFNRTGl0ZSBxdWVyeSkuXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXModW5pcXVlLCB1bmlxdWUpO1xuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyhwYXRpZW50LCB1bmlxdWUpO1xuXG4gIHJldHVybiB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkJ1bmRsZVwiLFxuICAgIHR5cGU6IFwiY29sbGVjdGlvblwiLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLlxcZCtaJC8sIFwiWlwiKSxcbiAgICBlbnRyeTogdW5pcXVlLm1hcCgocikgPT4gKHtcbiAgICAgIGZ1bGxVcmw6IGAke3IucmVzb3VyY2VUeXBlfS8ke3IuaWR9YCxcbiAgICAgIHJlc291cmNlOiByLFxuICAgIH0pKSxcbiAgfTtcbn1cblxuLy8gTG9jYWwgbW9kZSBzdGFzaGVzIHRoZSBhc3NlbWJsZWQgQnVuZGxlIGluIGNocm9tZS5zdG9yYWdlLmxvY2FsIHVuZGVyXG4vLyBhIHNpbmdsZSBcInBlbmRpbmdGaGlyQnVuZGxlXCIgc2xvdC4gVGhlIHBvcHVwIHNob3dzIGEgZG93bmxvYWQgYnV0dG9uXG4vLyB3aGVuIHRoaXMgc2xvdCBpcyBub24tZW1wdHk7IHRoZSBhY3R1YWwgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBjYWxsXG4vLyBoYXBwZW5zIGZyb20gdGhlIHBvcHVwIChpbiByZXNwb25zZSB0byBhIHVzZXIgY2xpY2spIHNvIHRoZSBmaWxlXG4vLyBkb2Vzbid0IGFwcGVhciBpbiB0aGUgRG93bmxvYWRzIGJhciB1bmludml0ZWQuXG4vL1xuLy8gU2luZ2xlIHNsb3QgbWVhbnMgYSBuZXcgc3luYyBvdmVyd3JpdGVzIHRoZSBwcmV2aW91cyBwZW5kaW5nIGJ1bmRsZS5cbi8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIGRlZmF1bHQgcXVvdGEgaXMgMTAgTUI7IGEgdHlwaWNhbCBOSEkgc3luYyBpc1xuLy8gd2VsbCB1bmRlciAyIE1CLlxuY29uc3QgUEVORElOR19CVU5ETEVfS0VZID0gXCJwZW5kaW5nRmhpckJ1bmRsZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudElkLCBkYXRlUmFuZ2UpIHtcbiAgLy8gRmlsZW5hbWU6XG4gIC8vICAgd2l0aCByYW5nZTogICAgbmhpLXtwaWR9LXtZWVlZTU1ERH0te1lZWVlNTUREfS17SEhNTX0uanNvblxuICAvLyAgIHdpdGhvdXQgcmFuZ2U6IG5oaS17cGlkfS17WVlZWU1NRER9LXtISE1NfS5qc29uXG4gIC8vIHRvSVNPU3RyaW5nKCkgcmV0dXJucyBVVEM7IHVzZXIgZXhwZWN0cyBsb2NhbC1jbG9jayB0aW1lIG9uIGRpc2suXG4gIC8vIEJ1aWxkIHRoZSBzdGFtcCBmcm9tIGxvY2FsLXRpbWUgY29tcG9uZW50cyBpbnN0ZWFkLlxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgY29uc3QgdG9kYXkgPSBgJHtub3cuZ2V0RnVsbFllYXIoKX0ke3BhZChub3cuZ2V0TW9udGgoKSArIDEpfSR7cGFkKG5vdy5nZXREYXRlKCkpfWA7XG4gIGNvbnN0IGhtID0gYCR7cGFkKG5vdy5nZXRIb3VycygpKX0ke3BhZChub3cuZ2V0TWludXRlcygpKX1gO1xuICAvLyBIYWxmLW1hc2sgdGhlIElEIGluIHRoZSBmaWxlbmFtZSBzbyB0aGUgdXNlcidzIERvd25sb2FkcyBmb2xkZXJcbiAgLy8gZG9lc24ndCBsZWFrIHRoZSBmdWxsIFx1OEVBQlx1NTIwNlx1OEI0OSAod291bGQgYmUgdmlzaWJsZSB0byBhbnlvbmUgc2VlaW5nXG4gIC8vIGEgZmlsZSBsaXN0aW5nIG9yIGRvd25sb2FkLWJhciBwcmV2aWV3KS4gYFhgIGJlY2F1c2UgYCpgIGlzXG4gIC8vIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gQnVuZGxlIENPTlRFTlRTIHN0aWxsIGNhcnJ5IHRoZSByZWFsXG4gIC8vIElEIHVuZGVyIFBhdGllbnQuaWQgXHUyMDE0IGZpbGUgb3duZXIga25vd3Mgd2hvc2UgZGF0YSBpdCBpcy5cbiAgY29uc3QgbWFza2VkUGlkID0gbWFza0lkKHBhdGllbnRJZCB8fCBcInVua25vd25cIiwgXCJYXCIpO1xuICBjb25zdCBzYWZlUGlkID0gbWFza2VkUGlkLnJlcGxhY2UoL1teQS1aYS16MC05Xy1dL2csIFwiX1wiKTtcbiAgY29uc3QgY29tcGFjdCA9IChkKSA9PiAoZCB8fCBcIlwiKS5zbGljZSgwLCAxMCkucmVwbGFjZSgvLS9nLCBcIlwiKTtcbiAgbGV0IGRhdGVQYXJ0O1xuICBpZiAoZGF0ZVJhbmdlICYmIChkYXRlUmFuZ2Uuc3RhcnQgfHwgZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICBjb25zdCBzID0gY29tcGFjdChkYXRlUmFuZ2Uuc3RhcnQpIHx8IHRvZGF5O1xuICAgIGNvbnN0IGUgPSBjb21wYWN0KGRhdGVSYW5nZS5lbmQpIHx8IHRvZGF5O1xuICAgIGRhdGVQYXJ0ID0gYCR7c30tJHtlfWA7XG4gIH0gZWxzZSB7XG4gICAgZGF0ZVBhcnQgPSB0b2RheTtcbiAgfVxuICBjb25zdCBmaWxlbmFtZSA9IGBuaGktJHtzYWZlUGlkfS0ke2RhdGVQYXJ0fS0ke2htfS5qc29uYDtcbiAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KGJ1bmRsZSwgbnVsbCwgMik7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgW1BFTkRJTkdfQlVORExFX0tFWV06IHtcbiAgICAgIGZpbGVuYW1lLFxuICAgICAganNvbixcbiAgICAgIGJ5dGVzOiBqc29uLmxlbmd0aCxcbiAgICAgIGdlbmVyYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgcGF0aWVudElkOiBwYXRpZW50SWQgfHwgbnVsbCxcbiAgICB9LFxuICB9KTtcbiAgcmV0dXJuIHsgZmlsZW5hbWUsIGJ5dGVzOiBqc29uLmxlbmd0aCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBydW5OaGlBcGlTeW5jKHsgdGFiSWQsIG1vZGUsIGJhY2tlbmQsIHN5bmNBcGlLZXksIG5oaUJhc2UsIHBhdGllbnRPdmVycmlkZSwgZGF0ZVJhbmdlLCBkYXRlUmFuZ2VMYWJlbCB9KSB7XG4gIF9jYW5jZWxsZWQgPSBmYWxzZTtcbiAgY29uc3QgQkFTRSA9IG5oaUJhc2UgfHwgYGh0dHBzOi8vJHtOSElfSE9TVH1gO1xuXG4gIGlmICghcGF0aWVudE92ZXJyaWRlKSB7XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdThBQ0JcdTUxNDhcdTU3MjggcG9wdXAgXHU1ODZCXHU1QkVCXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XHU1RjhDXHU1MThEXHU4QTY2XCIsXG4gICAgICAgIHBoYXNlOiBcImVycm9yXCIsIHRzOiBEYXRlLm5vdygpLCBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIXRhYklkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQVBJIHN5bmMgcmVxdWlyZXMgTkhJIHRhYiBpZCAoY29va2llcyBhcmUgZmlyc3QtcGFydHkpXCIpO1xuICB9XG5cbiAgLy8gRmlyc3QgY2hhbmNlIHRvIHVwZ3JhZGUgdGhlIHBhdGllbnQgSUQ6IGlmIHRoZSBwb3B1cCBnYXZlIHVzIGFuXG4gIC8vIFwiYXV0by1YWFhYWFhYWFwiIHBsYWNlaG9sZGVyICh1c2VyIGRpZG4ndCBtYW51YWxseSB0eXBlIG9uZSksXG4gIC8vIGZldGNoIHRoZSByZWFsIG9uZSBmcm9tIE5ISSdzIElIS0UzNDEwUzAxIGVuZHBvaW50IChyZXNwb25zZS5jaWRcbiAgLy8gaXMgdGhlIGNpdGl6ZW4gSUQpLiBQZXJzaXN0IGJhY2sgdG8gc3RvcmFnZSBzbyBzdWJzZXF1ZW50IHN5bmNzXG4gIC8vIGFyZSBzdGFibGUuIE1hbnVhbGx5LXR5cGVkIElEcyBhcmUgcmVzcGVjdGVkIGFzLWlzLlxuICBwYXRpZW50T3ZlcnJpZGUgPSBhd2FpdCBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSk7XG5cbiAgLy8gU3Rhc2ggY29udGV4dCBzbyB0aGUgc3RvcFN5bmMgbWVzc2FnZSBoYW5kbGVyIGNhbiB3aXBlIHBhcnRpYWxcbiAgLy8gZGF0YSAoREVMRVRFIC9zeW5jL3BhdGllbnQve2lkX25vfSkgd2l0aG91dCB1cyBoYXZpbmcgdG8gc2VuZCBpdFxuICAvLyBiYWNrIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UuXG4gIF9hY3RpdmVTeW5jQ3R4ID0geyBiYWNrZW5kLCBzeW5jQXBpS2V5LCBwYXRpZW50SWQ6IHBhdGllbnRPdmVycmlkZS5pZF9ubyB9O1xuXG4gIC8vIFNpZGViYXIgaWZyYW1lIChtZWRpY2FsLW5vdGUgU01BUlQgYXBwKSBjb21wZXRlcyB3aXRoIE5ISSBmYW4tb3V0XG4gIC8vIGZldGNoZXMgZm9yIHRoZSB0YWIncyBuZXR3b3JrICsgSlMgdGhyZWFkLiBFdmVuIGluIGRpc3BsYXk6bm9uZSBpdFxuICAvLyBjYW4gdGFrZSAxMDAtMjAwbXMgcGVyIHJlcXVlc3QuIFRlbGwgc2lkZWJhci5qcyB0byBzdXNwZW5kIHRoZVxuICAvLyBpZnJhbWUgKHNldCBzcmM9YWJvdXQ6YmxhbmspIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIHN5bmMuXG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHN5bmNSdW5uaW5nOiB0cnVlIH0pLmNhdGNoKCgpID0+IHt9KTtcblxuICAvLyBXYWxsLWNsb2NrIHN0YXJ0IHRpbWUgXHUyMDE0IHVzZWQgdG8gY29tcHV0ZSBlbGFwc2VkIHNlY29uZHMgZm9yIHRoZVxuICAvLyBmaW5hbCBzdGF0dXMgbGluZSAoXCJcdTdFM0RcdTgwMTdcdTY2NDIgMTIuMyBcdTc5RDJcIikuIFN0YXNoIG9uIGEgbG9jYWwgc28gd2UgY2FuXG4gIC8vIHJlYWNoIGl0IGZyb20gdGhlIGNvbXBsZXRpb24gbWVzc2FnZSBhdCB0aGUgdmVyeSBlbmQuXG4gIGNvbnN0IF90MCA9IERhdGUubm93KCk7XG4gIC8vIFBlci1waGFzZSB0aW1pbmdzLCBzdXJmYWNlZCBpbnRvIHRoZSBwb3B1cCdzIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHNlZSBleGFjdGx5IHdoZXJlIHRpbWUgaXMgZ29pbmcuIEVhY2ggZW50cnk6IHsgbmFtZSwgbXMgfS5cbiAgY29uc3QgX3BoYXNlcyA9IFtdO1xuICBsZXQgX3BoYXNlU3RhcnQgPSBfdDA7XG4gIGNvbnN0IF9tYXJrUGhhc2UgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgX3BoYXNlcy5wdXNoKHsgbmFtZSwgbXM6IG5vdyAtIF9waGFzZVN0YXJ0IH0pO1xuICAgIF9waGFzZVN0YXJ0ID0gbm93O1xuICB9O1xuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IHRydWUsIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIiwgcGhhc2U6IFwiaW5pdFwiLFxuICAgIHN0YXJ0ZWQ6IF90MCwgdG90YWxSZXNvdXJjZXM6IDAsIGhvc3Q6IE5ISV9IT1NULCBlcnJvcnM6IFtdLFxuICB9KTtcblxuICAvLyBTdGVwIDE6IGZldGNoIGFsbCBlbmRwb2ludHMgaW4gUEFSQUxMRUwgaW5zaWRlIHRoZSBOSEkgdGFiLiBSdW5uaW5nIGluXG4gIC8vIHRhYiBjb250ZXh0IG1lYW5zIHNhbWUtb3JpZ2luIGNvb2tpZXMgYXJlIHNlbnQgYXV0b21hdGljYWxseSBcdTIwMTQgZmV0Y2hcbiAgLy8gZnJvbSB0aGUgU1cgd291bGQgYmUgY3Jvc3Mtb3JpZ2luIGFuZCBTYW1lU2l0ZSBibG9ja3MgdGhlIHNlc3Npb25cbiAgLy8gY29va2llLCBoZW5jZSB3ZSBnb3QgXCJzZXNzaW9uIGV4cGlyZWRcIiBldmVuIHdoZW4gbG9nZ2VkIGluLlxuICAvLyBQYXNzIG9ubHkgc2VyaWFsaXNhYmxlIGRhdGEgKHBhdGhzLCBtZXRob2QsIG5hbWUpOyBhZGFwdGVycyBzdGF5IGluIFNXLlxuICAvLyBJbmplY3QgSVNPLWRhdGUgcmFuZ2UgaW50byBlYWNoIGVuZHBvaW50IHRoYXQgc3VwcG9ydHMgaXQgKGNvbnZlcnRzXG4gIC8vIHRvIFx1NkMxMVx1NTcwQiBmb3JtYXQgdmlhIGlzb1RvUk9DKS4gU2tpcHBlZCBlbmRwb2ludHMga2VlcCB0aGVpciBkZWZhdWx0XG4gIC8vIE5ISS1zaWRlIHdpbmRvdyAoMS0yIHllYXJzIGRlcGVuZGluZyBvbiB0aGUgcGFnZSkuXG4gIGNvbnN0IGZldGNoU3BlYyA9IE5ISV9BUElfRU5EUE9JTlRTLm1hcCgoZXApID0+IHtcbiAgICBjb25zdCBwYXRoID0gZXAuc3VwcG9ydHNEYXRlUmFuZ2UgPyBhcHBseURhdGVSYW5nZVRvUGF0aChlcC5wYXRoLCBkYXRlUmFuZ2UpIDogZXAucGF0aDtcbiAgICByZXR1cm4geyBuYW1lOiBlcC5uYW1lLCB1cmw6IEJBU0UgKyBwYXRoLCBtZXRob2Q6IFwiR0VUXCIgfTtcbiAgfSk7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIGNvbnNvbGUubG9nKFwiW05ISSBBUEkgc3luY10gZGF0ZSByYW5nZTpcIixcbiAgICAgIGAke2RhdGVSYW5nZS5zdGFydCB8fCBcIih1bmJvdW5kZWQpXCJ9IFx1MjE5MiAke2RhdGVSYW5nZS5lbmQgfHwgXCIodW5ib3VuZGVkKVwifWApO1xuICB9XG5cbiAgbGV0IHNldHRsZWRSYXc7XG4gIHRyeSB7XG4gICAgW3sgcmVzdWx0OiBzZXR0bGVkUmF3IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKHNwZWNzKSA9PiB7XG4gICAgICAgIC8vIE5ISSBhdXRoOiBjb29raWVzICsgSldUIGluIHNlc3Npb25TdG9yYWdlLiBUaGUgU1BBJ3MgYXhpb3Mgc2V0c1xuICAgICAgICAvLyBgQXV0aG9yaXphdGlvbjogQmVhcmVyIDx0b2tlbj5gIG9uIGV2ZXJ5IEFQSSBjYWxsLiBTZXNzaW9uXG4gICAgICAgIC8vIGNvb2tpZXMgYWxvbmUgcmV0dXJuIDQwMS5cbiAgICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdG9rZW4pIHJldHVybiBbeyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9XTtcbiAgICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuXG4gICAgICAgIC8vIERldGVjdCBJRExFL3RpbWVvdXQgcGFnZSBhbHJlYWR5IHJlZGlyZWN0ZWQgb24gdGhpcyB0YWIuXG4gICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgICByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyA2MC1zZWNvbmQgdGltZW91dCBwZXIgZmV0Y2ggXHUyMDE0IHNvbWUgTkhJIGVuZHBvaW50cyAoZW5jb3VudGVycyxcbiAgICAgICAgLy8gbWVkcykgdGFrZSAyMCsgc2Vjb25kcy5cbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocywgbXMpIHtcbiAgICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgbXMpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2gocy51cmwsIHtcbiAgICAgICAgICAgICAgbWV0aG9kOiBzLm1ldGhvZCxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgICAgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBjb25zdCBjdCA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICAgIGlmICghY3QuaW5jbHVkZXMoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IGBub24tSlNPTiAoY3Q9JHtjdH0pYCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgICAgICB0cnkgeyBib2R5ID0gYXdhaXQgci5qc29uKCk7IH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiSlNPTiBwYXJzZTogXCIgKyBlLm1lc3NhZ2UgfTsgfVxuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBib2R5IH07XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGlmIChlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcInRpbWVvdXQgNjBzXCIgfTtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uY3VycmVuY3ktbGltaXRlZCBleGVjdXRpb246IG1heCAzIGluIGZsaWdodCBhdCBvbmNlLiBOSEknc1xuICAgICAgICAvLyBhYnVzZSBkZXRlY3Rpb24gYmxvY2tzIGJ1cnN0czsgd2l0aCAxMSBwYXJhbGxlbCBmZXRjaGVzIGl0XG4gICAgICAgIC8vIHRocm90dGxlZCB0aGUgc2Vzc2lvbiBhbmQgcmVkaXJlY3RlZCB0byBJSEtFMzAwMVM5OV9JRExFLlxuICAgICAgICAvLyAzIGF0IGEgdGltZSArIDIwMG1zIGppdHRlciBpcyBnZW50bGUgZW5vdWdoIGZvciAxLXNob3Qgc3luYy5cbiAgICAgICAgY29uc3QgQ09OQ1VSUkVOQ1kgPSAzO1xuICAgICAgICBjb25zdCBKSVRURVJfTVMgPSAyMDA7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBuZXcgQXJyYXkoc3BlY3MubGVuZ3RoKTtcbiAgICAgICAgbGV0IG5leHRJZHggPSAwO1xuICAgICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgICAgd2hpbGUgKG5leHRJZHggPCBzcGVjcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBuZXh0SWR4Kys7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIEpJVFRFUl9NUykpO1xuICAgICAgICAgICAgcmVzdWx0c1tpXSA9IGF3YWl0IGZldGNoT25lKHNwZWNzW2ldLCA2MDAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdvcmtlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DVVJSRU5DWSAmJiB3IDwgc3BlY3MubGVuZ3RoOyB3KyspIHtcbiAgICAgICAgICB3b3JrZXJzLnB1c2god29ya2VyKCkpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdvcmtlcnMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0sXG4gICAgICBhcmdzOiBbZmV0Y2hTcGVjXSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgZXhlY3V0ZVNjcmlwdCBmYWlsZWQ6ICR7ZS5tZXNzYWdlfWApO1xuICB9XG5cbiAgLy8gRGV0ZWN0IHNlc3Npb24gZXhwaXJlZCBhY3Jvc3MgcmVzdWx0cy5cbiAgaWYgKHNldHRsZWRSYXcuc29tZSgocikgPT4gci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgfVxuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuXG4gIC8vIEdlbmVyaWMgbGlzdCBleHRyYWN0aW9uOiBoYW5kbGVzIGFsbCBvYnNlcnZlZCBOSEkgc2hhcGVzLlxuICAvLyAgIC0gUGxhaW4gYXJyYXkgKElIS0UzNDA5IGxhYilcbiAgLy8gICAtIHtzcF9JSEtFPFg+X2RhdGE6IFsuLi5dfSAgKG1lZGljYXRpb25zLCBhbGxlcmdpZXMpXG4gIC8vICAgLSB7d2VzdGVybl9kYXRhLCBjaGluZXNlX2RhdGEsIGRlbnRpc3RfZGF0YTogWy4uLl19IChlbmNvdW50ZXIgbGlzdCxcbiAgLy8gICAgIHNwbGl0IGJ5IFx1ODk3Rlx1OTFBQi9cdTRFMkRcdTkxQUIvXHU3MjU5XHU5MUFCIFx1MjAxNCB3ZSB3YW50IGFsbCB0aHJlZSlcbiAgLy8gRm9yIG11bHRpLWFycmF5IHNoYXBlcyB3ZSBtZXJnZSBhbGwgYXJyYXlzIGFuZCB0YWcgZWFjaCBpdGVtIHdpdGhcbiAgLy8gYF9fc2VjdGlvbmAgKHRoZSBzb3VyY2Uga2V5KSBzbyBhZGFwdGVycyBjYW4gZGlzYW1iaWd1YXRlLlxuICBmdW5jdGlvbiBleHRyYWN0TGlzdChib2R5KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYm9keSkpIHJldHVybiBib2R5O1xuICAgIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIFtdO1xuICAgIGxldCBhcnJheUtleXMgPSBPYmplY3QuZW50cmllcyhib2R5KS5maWx0ZXIoKFtfLCB2XSkgPT4gQXJyYXkuaXNBcnJheSh2KSk7XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICBpZiAoYXJyYXlLZXlzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTtcbiAgICAvLyBNdWx0aXBsZSBhcnJheXMgXHUyMDE0IGRyb3AgVUktaGVscGVyIGFycmF5cyAoZHJvcGRvd24gb3B0aW9ucywgc29ydFxuICAgIC8vIHNlbGVjdG9ycywgbG9va3VwIHRhYmxlcykuIE5ISSBtaXhlcyB0aGVtIGludG8gdGhlIHNhbWUgcmVzcG9uc2VcbiAgICAvLyAoZS5nLiBpbWFnaW5nIHJldHVybnMgc3BfSUhLRTM0MDhTMDFfZGF0YSArIGljZDljbV9zZWxlY3QpLlxuICAgIGNvbnN0IEhFTFBFUl9SRSA9IC9zZWxlY3R8b3B0aW9ufGRyb3Bkb3dufGZpbHRlcnxzb3J0fGxvb2t1cC9pO1xuICAgIGNvbnN0IGRhdGFLZXlzID0gYXJyYXlLZXlzLmZpbHRlcigoW2tdKSA9PiAhSEVMUEVSX1JFLnRlc3QoaykpO1xuICAgIGlmIChkYXRhS2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBkYXRhS2V5c1swXVsxXTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gYXJyYXlLZXlzWzBdWzFdOyAvLyBmYWxsYmFja1xuICAgIGFycmF5S2V5cyA9IGRhdGFLZXlzO1xuICAgIC8vIE11bHRpcGxlIGRhdGEgYXJyYXlzIChlLmcuIHdlc3Rlcm5fZGF0YS9jaGluZXNlX2RhdGEvZGVudGlzdF9kYXRhKVxuICAgIC8vIFx1MjAxNCBtZXJnZSB3aXRoIF9fc2VjdGlvbiB0YWcgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBhcnJheUtleXMpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSB7XG4gICAgICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goeyAuLi5pdGVtLCBfX3NlY3Rpb246IGsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfVxuXG4gIC8vIEFwcGx5IFNXLXNpZGUgYWRhcHRlcnMgdG8gZWFjaCBlbmRwb2ludCdzIGJvZHkuXG4gIGNvbnN0IHNldHRsZWQgPSBzZXR0bGVkUmF3Lm1hcCgociwgaSkgPT4ge1xuICAgIGNvbnN0IGVwID0gTkhJX0FQSV9FTkRQT0lOVFNbaV07XG4gICAgaWYgKHIuZXJyb3IpIHtcbiAgICAgIHJldHVybiB7IHN0YXR1czogXCJyZWplY3RlZFwiLCByZWFzb246IHsgbWVzc2FnZTogYCR7ZXAubmFtZX06ICR7ci5lcnJvcn1gIH0gfTtcbiAgICB9XG4gICAgY29uc3QgbGlzdCA9IGV4dHJhY3RMaXN0KHIuYm9keSk7XG4gICAgLy8gQWRhcHRlcnMgcmV0dXJuIGVpdGhlcjpcbiAgICAvLyAgIC0gb25lIGl0ZW0gICAobW9zdCBhZGFwdGVycyBcdTIwMTQgbGFicywgbWVkcywgZW5jb3VudGVycywgaW1hZ2luZylcbiAgICAvLyAgIC0gbnVsbC91bmRlZmluZWQgKHNraXApXG4gICAgLy8gICAtIGFycmF5IG9mIGl0ZW1zIChhZGFwdEFkdWx0UHJldmVudGl2ZSBcdTIwMTQgdW5mb2xkcyBvbmUgc2NyZWVuaW5nXG4gICAgLy8gICAgIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbiBlbnRyaWVzKVxuICAgIC8vIEZsYXQtaGFuZGxlIGJvdGggc2hhcGVzIHNvIGVhY2ggYWRhcHRlciBjYW4gcGljayB3aGF0ZXZlcidzIGNsZWFyZXN0LlxuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgZm9yIChjb25zdCBpdCBvZiBsaXN0KSB7XG4gICAgICBjb25zdCByID0gZXAuYWRhcHQoaXQpO1xuICAgICAgaWYgKHIgPT09IG51bGwgfHwgciA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHIpKSB7XG4gICAgICAgIGZvciAoY29uc3QgeCBvZiByKSBpZiAoeCkgaXRlbXMucHVzaCh4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zLnB1c2gocik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNuYXBzaG90IGEgYm9keSBzYW1wbGUgZm9yIHNoYXBlcyB3aGVyZSBhZGFwdGVyIHJlamVjdGVkIGV2ZXJ5dGhpbmdcbiAgICAvLyBcdTIwMTQgdXNlZCBieSB0aGUgZGlhZ25vc3RpYyBicmVha2Rvd24gaW4gc3RlcCAyLlxuICAgIGxldCBib2R5U2FtcGxlID0gbnVsbDtcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gSW5jbHVkZSB0aGUgRklSU1QgSVRFTSAoZnVsbCBrZXlzK3ZhbHVlcykgc28gd2UgY2FuIGJ1aWxkIHRoZVxuICAgICAgLy8gY29ycmVjdCBhZGFwdGVyIHdpdGhvdXQgYW5vdGhlciByb3VuZC10cmlwLiBOSEkgaXRlbXMgbWF5IGluY2x1ZGVcbiAgICAgIC8vIFBJSTsgdGhlIHVzZXIgaW5zcGVjdHMgdGhpcyBsb2NhbGx5IHZpYSBzZXJ2aWNlLXdvcmtlciBkZXZ0b29scy5cbiAgICAgIGJvZHlTYW1wbGUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHRvcExldmVsS2V5czogQXJyYXkuaXNBcnJheShyLmJvZHkpID8gbnVsbCA6IE9iamVjdC5rZXlzKHIuYm9keSB8fCB7fSkuc2xpY2UoMCwgMTApLFxuICAgICAgICB3YXNBcnJheTogQXJyYXkuaXNBcnJheShyLmJvZHkpLFxuICAgICAgICBmaXJzdEl0ZW06IGxpc3RbMF0gPz8gbnVsbCxcbiAgICAgICAgc2Vjb25kSXRlbTogbGlzdFsxXSA/PyBudWxsLFxuICAgICAgfSkuc2xpY2UoMCwgNDAwMCk7XG4gICAgfVxuICAgIHJldHVybiB7IHN0YXR1czogXCJmdWxmaWxsZWRcIiwgdmFsdWU6IHsgZXAsIGl0ZW1zLCByYXdfY291bnQ6IGxpc3QubGVuZ3RoLCBib2R5U2FtcGxlLCByYXdMaXN0OiBsaXN0IH0gfTtcbiAgfSk7XG5cbiAgX21hcmtQaGFzZShcIm5oaS1wYXJhbGxlbFwiKTtcblxuICAvLyBTdGVwIDFhOiBlbmNvdW50ZXIgZGV0YWlsIGZhbi1vdXQgKElIS0UzMzAzUzAyKSBcdTIxOTIgY2xhc3NpZnkgZWFjaFxuICAvLyBJSEtFMzMwM1MwMSB2aXNpdCBhcyBBTUIgLyBFTUVSIC8gSU1QIHZpYSBob3NwX0RBVEFfVFlQRV9OQU1FLlxuICAvLyBMaXN0IGVuZHBvaW50IGRvZXNuJ3QgZXhwb3NlIFx1NjAyNVx1OEEzQSBkaXN0aW5jdGlvbjsgZGV0YWlsIGRvZXMuIFdlIHJlLVxuICAvLyBhZGFwdCBlYWNoIGVuY291bnRlciBpdGVtIHdpdGggdGhlIGRpc2NvdmVyZWQgY2xhc3MgYmVmb3JlIHRoZVxuICAvLyBiYWNrZW5kIHVwbG9hZCBzdGVwLlxuICBjb25zdCBlbmNJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJlbmNvdW50ZXJzXCIpO1xuICBpZiAoZW5jSWR4ID49IDAgJiYgc2V0dGxlZFtlbmNJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1QzMxXHU5MUFCXHU3RDAwXHU5MzA0XHU4QTczXHU2MEM1XHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGV0YWlsTWFwID0gYXdhaXQgX2ZldGNoRW5jb3VudGVyRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gUmUtYWRhcHQgd2l0aCBjbGFzc0hpbnQgZnJvbSBkZXRhaWw7IGZhbGwgYmFjayB0byBBTUIuXG4gICAgICAgIGNvbnN0IHJlQWRhcHRlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpc2l0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGRldGFpbE1hcD8uZ2V0KGkpIHx8IG51bGw7XG4gICAgICAgICAgY29uc3QgY2xzID0gX2NsYXNzRnJvbVMwMkRldGFpbChkZXRhaWwpIHx8IFwiQU1CXCI7XG4gICAgICAgICAgY29uc3QgaXQgPSBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlKHZpc2l0c1tpXSwgY2xzKTtcbiAgICAgICAgICBpZiAoaXQpIHJlQWRhcHRlZC5wdXNoKGl0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXR0bGVkW2VuY0lkeF0udmFsdWUuaXRlbXMgPSByZUFkYXB0ZWQ7XG4gICAgICAgIHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZUFkYXB0ZWQubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgZW5jb3VudGVyIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJlbmNvdW50ZXItZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWI6IG1lZGljYXRpb25zIG5lZWQgYSAyLXN0ZXAgZmV0Y2ggXHUyMDE0IElIS0UzMzA2UzAxIG9ubHkgcmV0dXJuc1xuICAvLyB2aXNpdCBtZXRhZGF0YSAoZGF0ZSwgSUNELCBob3NwaXRhbCksIG5vIGRydWcgbmFtZXMuIERydWdzIGxpdmUgYXRcbiAgLy8gSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiB1bmRlclxuICAvLyBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0LiBGYW4gb3V0IGRldGFpbFxuICAvLyBmZXRjaGVzIGluc2lkZSB0aGUgc2FtZSB0YWIgY29udGV4dCAoY29va2llcyArIEpXVCksIGtlZXBpbmdcbiAgLy8gY29uY3VycmVuY3kgbGltaXRlZCBzbyBOSEkgZG9lc24ndCBJRExFLXJlZGlyZWN0IHVzLlxuICAvLyBTdGVwIDFjOiBpbWFnaW5nIG5lZWRzIElIS0UzNDA4UzAyIGZvciB0aGUgYWN0dWFsIHJlcG9ydCBuYXJyYXRpdmUuXG4gIC8vIExpc3QgZW5kcG9pbnQgb25seSBoYXMgb3JkZXIgbWV0YWRhdGE7IGN0eXBlIHBhcmFtIG1pcnJvcnMgdGhlXG4gIC8vIHZpc2l0J3Mgb3JpX1RZUEUgKEEgLyBFIC8gXHUyMDI2KS5cbiAgY29uc3QgaW1nSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwiaW1hZ2luZ1wiKTtcbiAgaWYgKGltZ0lkeCA+PSAwICYmIHNldHRsZWRbaW1nSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNVx1NTgzMVx1NTQ0QVx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydHMgPSBhd2FpdCBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLml0ZW1zID0gcmVwb3J0cztcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnJhd19jb3VudCA9IHJlcG9ydHMubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBpbWFnaW5nIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJpbWFnaW5nLWRldGFpbFwiKTtcblxuICBjb25zdCBtZWRJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJtZWRpY2F0aW9uc1wiKTtcbiAgaWYgKG1lZElkeCA+PSAwICYmIHNldHRsZWRbbWVkSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW21lZElkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NzUyOFx1ODVFNVx1NjYwRVx1N0QzMFx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRydWdJdGVtcyA9IGF3YWl0IF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUuaXRlbXMgPSBkcnVnSXRlbXM7XG4gICAgICAgIC8vIHJhd19jb3VudCBub3cgcmVmbGVjdHMgdGhlICpkcnVnLWxldmVsKiBjb3VudCBmb3IgdGhlIGJyZWFrZG93blxuICAgICAgICAvLyAodmlzaXRzIFx1MjE5MiBkcnVncykuIEtlZXAgdGhlIHZpc2l0IGNvdW50IGluIGEgc2lkZSBmaWVsZCBmb3IgZGVidWcuXG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLnJhd19jb3VudCA9IGRydWdJdGVtcy5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBtZWRpY2F0aW9ucyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwibWVkaWNhdGlvbi1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAyOiBhZ2dyZWdhdGUgaXRlbXMgYnkgcGFnZV90eXBlLCBQT1NUIHRvIGJhY2tlbmQuXG4gIGNvbnN0IGJ5VHlwZSA9IHt9O1xuICBsZXQgcmF3X3RvdGFsID0gMDtcbiAgbGV0IGFkYXB0ZWRfdG90YWwgPSAwO1xuICAvLyBQZXItZW5kcG9pbnQgYnJlYWtkb3duIHNvIHRoZSBmaW5hbCBzdGF0dXMgY2FuIHRlbGwgdXNlciBleGFjdGx5XG4gIC8vIHdoaWNoIGVuZHBvaW50cyBjYW1lIGJhY2sgZW1wdHkgLyBtaXMtc2hhcGVkIFx1MjAxNCBtdWNoIG1vcmUgdXNlZnVsIHRoYW5cbiAgLy8gYSBzaW5nbGUgYWdncmVnYXRlZCBudW1iZXIuXG4gIGNvbnN0IGJyZWFrZG93biA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNldHRsZWQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBlcCA9IE5ISV9BUElfRU5EUE9JTlRTW2ldO1xuICAgIGNvbnN0IHMgPSBzZXR0bGVkW2ldO1xuICAgIGlmIChzLnN0YXR1cyA9PT0gXCJyZWplY3RlZFwiKSB7XG4gICAgICBlcnJvcnMucHVzaChgJHtlcC5uYW1lfTogJHtzLnJlYXNvbi5tZXNzYWdlfWApO1xuICAgICAgYnJlYWtkb3duLnB1c2goYCR7ZXAubmFtZX09RVJSYCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgeyBpdGVtcywgcmF3X2NvdW50IH0gPSBzLnZhbHVlO1xuICAgIHJhd190b3RhbCArPSByYXdfY291bnQ7XG4gICAgYWRhcHRlZF90b3RhbCArPSBpdGVtcy5sZW5ndGg7XG4gICAgLy8gRm9ybWF0OiBhZGFwdGVkX2l0ZW1zL3Jhd19OSElfcm93cy4gRm9yIG1vc3QgZW5kcG9pbnRzIHRoZSByYXRpb1xuICAgIC8vIGlzIDE6MSAob25lIE5ISSByb3cgXHUyMTkyIG9uZSBGSElSIGl0ZW0pIHNvIFwiNS81XCIgcmVhZHMgbmF0dXJhbGx5LlxuICAgIC8vIEZvciAxLXRvLW1hbnkgYWRhcHRlcnMgKGUuZy4gYWR1bHRfcHJldmVudGl2ZSB1bmZvbGRzIG9uZVxuICAgIC8vIHNjcmVlbmluZyByb3cgaW50byB+MTggT2JzZXJ2YXRpb25zKSwgcHJlZml4IHRoZSByYXcgc2lkZSB3aXRoXG4gICAgLy8gaXRzIG5vdW4gc28gdXNlcnMgZG9uJ3QgcmVhZCBcIjM2LzJcIiBhcyBcIjM2IG9mIDIgZXhwZWN0ZWRcIi5cbiAgICBsZXQgbGFiZWw7XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA+IHJhd19jb3VudCAmJiByYXdfY291bnQgPiAwKSB7XG4gICAgICBsYWJlbCA9IGAke2VwLm5hbWV9PSR7cmF3X2NvdW50fSByb3dzIFx1MjE5MiAke2l0ZW1zLmxlbmd0aH0gb2JzYDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFiZWwgPSBgJHtlcC5uYW1lfT0ke2l0ZW1zLmxlbmd0aH0vJHtyYXdfY291bnR9YDtcbiAgICB9XG4gICAgYnJlYWtkb3duLnB1c2gobGFiZWwpO1xuICAgIC8vIFNhdmUgYm9keSBzYW1wbGUgZm9yIGZpcnN0IGVuZHBvaW50IHdpdGggcmF3PjAgYnV0IGFkYXB0ZWQ9MCAoYWRhcHRlclxuICAgIC8vIG1pc21hdGNoKSBzbyB3ZSBjYW4gaXRlcmF0ZS4gU3RvcmVkIHVuZGVyIGNocm9tZS5zdG9yYWdlLmxvY2FsIGZvclxuICAgIC8vIGluc3BlY3Rpb24gdmlhIHNlcnZpY2Ugd29ya2VyIERldlRvb2xzLlxuICAgIGlmIChyYXdfY291bnQgPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICBbYF9fc2FtcGxlQm9keV8ke2VwLm5hbWV9YF06IHMudmFsdWUuYm9keVNhbXBsZSB8fCBcIm4vYVwiLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2gge31cbiAgICB9XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgKGJ5VHlwZVtlcC5wYWdlX3R5cGVdID0gYnlUeXBlW2VwLnBhZ2VfdHlwZV0gfHwgW10pLnB1c2goLi4uaXRlbXMpO1xuICB9XG5cbiAgLy8gTWFzayBnYXRlIGlzIHJlYWQgZnJlc2ggcGVyIHN5bmMgXHUyMDE0IGRlZmF1bHRzIE9GRiBwZXIgdGhlIGRpc2N1c3Npb25cbiAgLy8gKGNpdGl6ZW4tc2VsZi1kb3dubG9hZCBkb2Vzbid0IG5lZWQgYW5vbnltaXphdGlvbikuIFdoZW4gT04sIGFsc29cbiAgLy8gc2NydWIgdGhlIHVzZXIncyByZWFsIG5hbWUgb3V0IG9mIGFueSBOSEkgbmFycmF0aXZlIGZpZWxkIGJlZm9yZVxuICAvLyBpdCBmbG93cyBpbnRvIHRoZSBtYXBwZXIuXG4gIGNvbnN0IG1hc2tFbmFibGVkID0gYXdhaXQgX2lzTWFza0VuYWJsZWQoKTtcbiAgaWYgKG1hc2tFbmFibGVkICYmIHBhdGllbnRPdmVycmlkZS5uYW1lKSB7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoYnlUeXBlKSkge1xuICAgICAgYnlUeXBlW2tleV0gPSBfcmVwbGFjZU5hbWVEZWVwKGJ5VHlwZVtrZXldLCBwYXRpZW50T3ZlcnJpZGUubmFtZSwgcmVwbGFjZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIGxldCB0b3RhbCA9IDA7XG4gIGxldCBfbG9jYWxGaWxlbmFtZSA9IG51bGw7XG4gIGlmIChtb2RlID09PSBcImxvY2FsXCIpIHtcbiAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNFXHVEREVDIFx1OEY0OVx1NjNEQlx1NzBCQVx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1NkE5NFx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogMCB9KTtcbiAgICBsZXQgYnVuZGxlO1xuICAgIHRyeSB7XG4gICAgICBidW5kbGUgPSBfYXNzZW1ibGVMb2NhbEJ1bmRsZShieVR5cGUsIHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9ycy5wdXNoKGBsb2NhbCBtYXBwaW5nOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIGJ1bmRsZSA9IG51bGw7XG4gICAgfVxuICAgIGlmIChidW5kbGUpIHtcbiAgICAgIHRvdGFsID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBgXHVEODNEXHVEQ0JFIFx1NkU5Nlx1NTA5OSAke3RvdGFsfSBcdTdCNDYgRkhJUiBcdThDQzdcdTZFOTBcdTIwMjZgLCB0b3RhbFJlc291cmNlczogdG90YWwgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkbCA9IGF3YWl0IF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sIGRhdGVSYW5nZSk7XG4gICAgICAgIF9sb2NhbEZpbGVuYW1lID0gZGwuZmlsZW5hbWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBzdGFzaCBidW5kbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBCdWlsZCB0aGUgb3ZlcnJpZGUgd2Ugc2VuZCB0byBiYWNrZW5kIHdpdGggdGhlIG1heWJlLW1hc2tlZCBuYW1lXG4gICAgLy8gc28gYmFja2VuZCdzIGF1dG8tY3JlYXRlZCBQYXRpZW50ICsgdGhlIHBlci1pdGVtIHN1YmplY3QuZGlzcGxheVxuICAgIC8vIHNlZSB0aGUgc2FtZSB2YWx1ZSB0aGUgdXNlciBvcHRlZCBpbnRvLiBJdGVtcyB0aGVtc2VsdmVzIHdlcmVcbiAgICAvLyBhbHJlYWR5IHNjcnViYmVkIGFib3ZlIChieVR5cGUgcGFzcyksIHNvIHRoaXMganVzdCBjb3ZlcnMgdGhlXG4gICAgLy8gb3ZlcnJpZGUtZGVyaXZlZCBQYXRpZW50LlxuICAgIGNvbnN0IHVwbG9hZE92ZXJyaWRlID0gbWFza0VuYWJsZWQgJiYgcGF0aWVudE92ZXJyaWRlLm5hbWVcbiAgICAgID8geyAuLi5wYXRpZW50T3ZlcnJpZGUsIG5hbWU6IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lKSB9XG4gICAgICA6IHBhdGllbnRPdmVycmlkZTtcbiAgICBmb3IgKGNvbnN0IFtwYWdlX3R5cGUsIGl0ZW1zXSBvZiBPYmplY3QuZW50cmllcyhieVR5cGUpKSB7XG4gICAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1MkIwNlx1RkUwRiBcdTRFMEFcdTUwQjMgJHtwYWdlX3R5cGV9XHVGRjA4JHtpdGVtcy5sZW5ndGh9IFx1N0I0Nlx1RkYwOVx1MjAyNmAsXG4gICAgICAgIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IF9wb3N0U3RydWN0dXJlZChiYWNrZW5kLCBwYWdlX3R5cGUsIGl0ZW1zLCBzeW5jQXBpS2V5LCB1cGxvYWRPdmVycmlkZSk7XG4gICAgICAgIHRvdGFsICs9IGRhdGEuY291bnQgfHwgMDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYHVwbG9hZCAke3BhZ2VfdHlwZX06ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFmdGVyIGJhY2tlbmQgdXBsb2FkLCBhbHNvIGZldGNoIGEgc25hcHNob3Qgb2YgdGhlIHBhdGllbnQncyBmdWxsXG4gICAgLy8gY3VtdWxhdGl2ZSBGSElSIEJ1bmRsZSBhbmQgc3Rhc2ggaXQgZm9yIHRoZSBwb3B1cCdzIFwiXHVEODNEXHVEQ0U1IFx1NEUwQlx1OEYwOVwiIGJ1dHRvbi5cbiAgICAvLyBUaGlzIGlzIHdoYXQgYC9maGlyL2V4cG9ydGAgcmV0dXJucyBcdTIwMTQgdGhlIGJhY2tlbmQncyBjb21wbGV0ZSB2aWV3XG4gICAgLy8gb2YgdGhpcyBwYXRpZW50ICh0aGlzIHN5bmMgKyBhbnkgcHJpb3Igc3luY3MpLCBhcyBvcHBvc2VkIHRvIGxvY2FsXG4gICAgLy8gbW9kZSdzIFwianVzdCB0aGlzIHN5bmNcIiBidW5kbGUuXG4gICAgaWYgKHBhdGllbnRPdmVycmlkZS5pZF9ubykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNEXHVEQ0U2IFx1NTNENlx1NUY5N1x1NUY4Q1x1N0FFRlx1NUI4Q1x1NjU3NFx1OENDN1x1NjU5OVx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogdG90YWwgfSk7XG4gICAgICAgIGNvbnN0IGV4cFVybCA9IGAke2JhY2tlbmR9L2ZoaXIvZXhwb3J0P3BhdGllbnQ9JHtlbmNvZGVVUklDb21wb25lbnQocGF0aWVudE92ZXJyaWRlLmlkX25vKX1gO1xuICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goZXhwVXJsLCB7XG4gICAgICAgICAgaGVhZGVyczogc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyLm9rKSB7XG4gICAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgY29uc3QgZGwgPSBhd2FpdCBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudE92ZXJyaWRlLmlkX25vKTtcbiAgICAgICAgICBfbG9jYWxGaWxlbmFtZSA9IGRsLmZpbGVuYW1lO1xuICAgICAgICAgIC8vIEFsaWduIHJlcG9ydGVkIGNvdW50IHdpdGggbG9jYWwgbW9kZTogYnVuZGxlLmVudHJ5Lmxlbmd0aFxuICAgICAgICAgIC8vIGluY2x1ZGVzIHRoZSBQYXRpZW50IHJlc291cmNlICh3aGljaCB0aGUgcGVyLXBhZ2UtdHlwZSBQT1NUXG4gICAgICAgICAgLy8gY291bnRzIGhhZCBwcmV2aW91c2x5IG9taXR0ZWQgYmVjYXVzZSBQYXRpZW50IGlzIGF1dG8tY3JlYXRlZFxuICAgICAgICAgIC8vIHNpbGVudGx5IGZyb20gcGF0aWVudF9vdmVycmlkZSkuIFNhbWUgZGF0YSBcdTIxOTIgc2FtZSBudW1iZXIuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYnVuZGxlLmVudHJ5KSkgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9ycy5wdXNoKGBleHBvcnQgYnVuZGxlOiBIVFRQICR7ci5zdGF0dXN9YCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGV4cG9ydCBidW5kbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKG1vZGUgPT09IFwibG9jYWxcIiA/IFwiYXNzZW1ibGUrc3Rhc2hcIiA6IFwiYmFja2VuZC11cGxvYWRcIik7XG5cbiAgLy8gRm9ybWF0IGVsYXBzZWQgd2FsbC1jbG9jayB0aW1lOiBzZWNvbmRzICgxIGRwKSBmb3Igc2hvcnQgc3luY3MsXG4gIC8vIFwibW06c3NcIiBvbmNlIHdlIGNyb3NzIHRoZSBtaW51dGUgbWFyayBzbyB0aGUgcG9wdXAgc3RhdHVzIHN0YXlzIHJlYWRhYmxlLlxuICBjb25zdCBfZWxhcHNlZE1zID0gRGF0ZS5ub3coKSAtIF90MDtcbiAgY29uc3QgX2VsYXBzZWRTdHIgPSBfZWxhcHNlZE1zIDwgNjBfMDAwXG4gICAgPyBgJHsoX2VsYXBzZWRNcyAvIDEwMDApLnRvRml4ZWQoMSl9c2BcbiAgICA6IGAke01hdGguZmxvb3IoX2VsYXBzZWRNcyAvIDYwXzAwMCl9bSR7TWF0aC5yb3VuZCgoX2VsYXBzZWRNcyAlIDYwXzAwMCkgLyAxMDAwKX1zYDtcbiAgLy8gTm8gbW9yZSBcIlx1NkE5NFx1Njg0OFx1NURGMlx1NTA5OVx1NTlBNVx1MjAyNlwiIHRhaWwgXHUyMDE0IHRoZSBcdUQ4M0RcdURDRTUgZG93bmxvYWQgYnV0dG9uIHNpdHMgcmlnaHRcbiAgLy8gYmVsb3cgdGhlIHN0YXR1cywgc28gc2F5aW5nIFwiXHU5RURFXHU0RTBCXHU2NUI5XHU2MzA5XHU5MjE1XCIgaXMganVzdCBub2lzZS5cbiAgY29uc3QgX2xvY2FsVGFpbCA9IFwiXCI7XG4gIGNvbnN0IF9zdWNjZXNzVmVyYiA9IG1vZGUgPT09IFwibG9jYWxcIiA/IFwiXHU1REYyXHU3NTIyXHU3NTFGXCIgOiBcIlx1NURGMlx1NjZGNFx1NjVCMFwiO1xuICAvLyBQcmVwZW5kIHBoYXNlIHRpbWluZ3MgdG8gdGhlIGJyZWFrZG93biBzbyB0aGUgdXNlciBjYW4gc2VlIHdoaWNoXG4gIC8vIHN0ZXAgaXMgc2xvdyAoTkhJIGZldGNoIGlzIHVzdWFsbHkgdGhlIGJ1bGs7IGJhY2tlbmQgbW9kZSBhZGRzIGFuXG4gIC8vIHVwbG9hZCBzdGVwIG1lYXN1cmVkIGluIDEwMHMgb2YgbXMgbm90IHNlY29uZHMpLlxuICBjb25zdCBfcGhhc2VMaW5lcyA9IF9waGFzZXMubWFwKChwKSA9PiBgXHUyM0YxICR7cC5uYW1lfT0keyhwLm1zIC8gMTAwMCkudG9GaXhlZCgxKX1zYCk7XG4gIGNvbnN0IF9mdWxsQnJlYWtkb3duID0gWy4uLl9waGFzZUxpbmVzLCAuLi5icmVha2Rvd25dO1xuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgIHByb2dyZXNzOiBlcnJvcnMubGVuZ3RoXG4gICAgICA/IGBcdTI2QTBcdUZFMEYgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyAke19zdWNjZXNzVmVyYn0gJHt0b3RhbH0gXHU3QjQ2XHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHVGRjBDJHtlcnJvcnMubGVuZ3RofSBcdTk4MDVcdTU5MzFcdTY1NTdcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOSR7X2xvY2FsVGFpbH1gXG4gICAgICA6IGBcdTI3MDUgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyAke19zdWNjZXNzVmVyYn0gJHt0b3RhbH0gXHU3QjQ2XHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDkke19sb2NhbFRhaWx9YCxcbiAgICBwaGFzZTogXCJkb25lXCIsXG4gICAgdG90YWxSZXNvdXJjZXM6IHRvdGFsLFxuICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICBlbGFwc2VkTXM6IF9lbGFwc2VkTXMsXG4gICAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBmb3IgdGhlIHBvcHVwJ3MgJ1x1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMCcgY29sbGFwc2libGUuXG4gICAgLy8gS2VlcCBhcyBhIHBsYWluIGFycmF5IHNvIHBvcHVwLmpzIGNhbiByZW5kZXIgd2l0aCBET00gQVBJIChub1xuICAgIC8vIGlubmVySFRNTCAvIG5vIGVzY2FwaW5nIGNvbmNlcm5zKS4gSXRlbXMgbG9vayBsaWtlXG4gICAgLy8gJ2VuY291bnRlcnM9MTIvMTInIG9yICdhZHVsdF9wcmV2ZW50aXZlPTIgcm93cyBcdTIxOTIgMzYgb2JzJy5cbiAgICBicmVha2Rvd246IF9mdWxsQnJlYWtkb3duLFxuICAgIGVycm9ycyxcbiAgICBoaXN0bm86IHBhdGllbnRPdmVycmlkZS5pZF9ubyxcbiAgICBtb2RlLFxuICAgIGxvY2FsRmlsZW5hbWU6IF9sb2NhbEZpbGVuYW1lLFxuICB9KTtcblxuICAvLyBSZXN1bWUgdGhlIHNpZGViYXIgaWZyYW1lIG5vdyB0aGF0IHRoZSBOSEkgdGFiIGlzIG5vIGxvbmdlciBidXN5LlxuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jUnVubmluZzogZmFsc2UgfSkuY2F0Y2goKCkgPT4ge30pO1xuXG4gIC8vIEJlc3QtZWZmb3J0OiB3cml0ZSBhIFN5bmMgSGlzdG9yeSByb3cgdG8gdGhlIGJhY2tlbmQgc28gdGhlIGRhc2hib2FyZFxuICAvLyBjYW4gc2hvdyB3aGVuL3doby9ob3ctbG9uZy93aGF0L3JhbmdlLiBTa2lwcGVkIGluIGxvY2FsIG1vZGUgKHRoZXJlXG4gIC8vIGlzIG5vIGJhY2tlbmQpLiBXcmFwcGVkICsgc3dhbGxvd2VkIHNvIGEgbG9nZ2luZyBmYWlsdXJlIG5ldmVyXG4gIC8vIHByb3BhZ2F0ZXMgYmFjayB0byB0aGUgdXNlci1mYWNpbmcgc3luYyBzdGF0dXMuXG4gIGlmIChtb2RlICE9PSBcImxvY2FsXCIpIHRyeSB7XG4gICAgYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy9sb2dgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc3RhdHVzOiBlcnJvcnMubGVuZ3RoID8gXCJwYXJ0aWFsXCIgOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgcGF0aWVudF9pZDogcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCIsXG4gICAgICAgIC8vIC9zeW5jL2xvZyBsYW5kcyBpbiB0aGUgZGFzaGJvYXJkJ3Mgc3luYy1oaXN0b3J5IHJvdy4gT25seVxuICAgICAgICAvLyBtYXNrIHdoZW4gdGhlIHVzZXIgaGFzIG9wdGVkIGluIFx1MjAxNCBvdGhlcndpc2UgZGFzaGJvYXJkIHNlZXNcbiAgICAgICAgLy8gdGhlIHJhdyBuYW1lIHRoZXkgdHlwZWQgKGNvbnNpc3RlbnQgd2l0aCBcIlx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOFwiIGRlZmF1bHQpLlxuICAgICAgICBwYXRpZW50X25hbWU6IG1hc2tFbmFibGVkXG4gICAgICAgICAgPyBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiKVxuICAgICAgICAgIDogcGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIixcbiAgICAgICAgdG90YWwsXG4gICAgICAgIGJyZWFrZG93bixcbiAgICAgICAgZGF0ZV9yYW5nZTogZGF0ZVJhbmdlTGFiZWwgfHwgXCJcIixcbiAgICAgICAgZWxhcHNlZF9tczogX2VsYXBzZWRNcyxcbiAgICAgICAgc3RhcnRlZF9hdDogbmV3IERhdGUoX3QwKS50b0lTT1N0cmluZygpLFxuICAgICAgICBlcnJvcnMsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gZmFpbGVkIHRvIHdyaXRlIGhpc3RvcnkgbG9nOlwiLCBlKTtcbiAgfVxuICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG59XG5cbi8vIE9uIGluc3RhbGwgLyB1cGRhdGUgLyBjaHJvbWU6Ly9leHRlbnNpb25zIHJlbG9hZCwgdGhlIG5ldyBzaWRlYmFyLmpzXG4vLyBpcyBzaGlwcGVkIGluIHRoZSBidW5kbGUgYnV0IENocm9tZSB3b24ndCByZS1pbmplY3QgaXQgaW50byBhbHJlYWR5LVxuLy8gb3BlbiBOSEkgdGFicyAoY29udGVudF9zY3JpcHRzIG9ubHkgZmlyZSBhdCBkb2N1bWVudF9pZGxlIG9mIGZyZXNoXG4vLyBsb2FkcykuIFdpdGhvdXQgdGhpcywgc2V0dGluZ3MgaW50cm9kdWNlZCBpbiB0aGUgbmV3IHZlcnNpb24gKGUuZy5cbi8vIHRoZSBzaWRlYmFyRW5hYmxlZCB0b2dnbGUpIGFwcGVhciBpbmVydCBvbiBvcGVuIHRhYnMgdW50aWwgRjUuXG4vLyBGb3JjZS1pbmplY3Qgc28gdGhlIHRvZ2dsZSB0YWtlcyBlZmZlY3QgaW1tZWRpYXRlbHkuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihhc3luYyAoKSA9PiB7XG4gIGxldCB0YWJzO1xuICB0cnkge1xuICAgIHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7IHVybDogXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3LypcIiB9KTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAoY29uc3QgdGFiIG9mIHRhYnMpIHtcbiAgICBjaHJvbWUuc2NyaXB0aW5nXG4gICAgICAuZXhlY3V0ZVNjcmlwdCh7IHRhcmdldDogeyB0YWJJZDogdGFiLmlkIH0sIGZpbGVzOiBbXCJzaWRlYmFyLmpzXCJdIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge30pO1xuICB9XG59KTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2csIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3RhcnROaGlBcGlTeW5jXCIpIHtcbiAgICBydW5OaGlBcGlTeW5jKG1zZy5wYXlsb2FkKS50aGVuKFxuICAgICAgKCkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICAgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBzaWRlYmFyIGlmcmFtZSBnZXRzIHVuLXBhdXNlZCBvbiBldmVyeSBleGl0IHBhdGhcbiAgICAgICAgLy8gKHN1Y2Nlc3MgcnVucyB0aGlzIGZyb20gaW5zaWRlIHJ1bk5oaUFwaVN5bmM7IGNhbmNlbCArIGVycm9yICtcbiAgICAgICAgLy8gc2Vzc2lvbi1leHBpcmVkIGJhaWwgYmVmb3JlIHJlYWNoaW5nIHRoYXQgcG9pbnQpLlxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jUnVubmluZzogZmFsc2UgfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gQ0FOQ0VMX0VSUk9SKSB7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUsIGNhbmNlbGxlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gU0VTU0lPTl9FWFBJUkVEX0VSUk9SKSB7XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REQxMiBOSEkgc2Vzc2lvbiBcdTVERjJcdTc2N0JcdTUxRkEgXHUyMDE0IFx1OEFDQlx1NTcyOCBOSEkgdGFiIFx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1NUY4Q1x1NTE4RFx1OUVERSBTeW5jXCIsXG4gICAgICAgICAgICAgIHBoYXNlOiBcInNlc3Npb25fZXhwaXJlZFwiLFxuICAgICAgICAgICAgICB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGV4cGlyZWQ6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5lcnJvcihcInJ1bk5oaUFwaVN5bmMgZmFpbGVkXCIsIGUpO1xuICAgICAgICBhd2FpdCBzZXRTdGF0dXMoeyBydW5uaW5nOiBmYWxzZSwgcHJvZ3Jlc3M6IGBcdTI3NEMgJHtlLm1lc3NhZ2V9YCwgcGhhc2U6IFwiZXJyb3JcIiB9KTtcbiAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBlcnJvcjogZS5tZXNzYWdlIH0pOyB9IGNhdGNoIHt9XG4gICAgICB9LFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdG9wU3luY1wiKSB7XG4gICAgLy8gU2V0IHRoZSBjYW5jZWxsYXRpb24gZmxhZzsgdGhlIGluLWZsaWdodCBzeW5jIHdpbGwgdGhyb3dcbiAgICAvLyBDQU5DRUxfRVJST1IgYXQgaXRzIG5leHQgY2hlY2tDYW5jZWwoKSBjYWxsLiAgU3RvcmFnZSBpcyBhbHJlYWR5XG4gICAgLy8gdXBkYXRlZCBieSB0aGUgcG9wdXAsIHNvIHdlIGRvbid0IHRvdWNoIGl0IGhlcmUuXG4gICAgX2NhbmNlbGxlZCA9IHRydWU7XG4gICAgLy8gRGlzY2FyZCBhbnkgcGFydGlhbCBkYXRhIHVwbG9hZGVkIHNvIGZhci4gVGhlIHVzZXIncyBzdGF0ZWRcbiAgICAvLyBjb250cmFjdCBpcyAnc3RvcCA9IGFib3J0LCBJJ2xsIHJlc3luYyBmcm9tIHNjcmF0Y2ggbGF0ZXInIFx1MjAxNCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gbGVhdmUgYSBoYWxmLWxvYWRlZCBwYXRpZW50IGluIHRoZSBGSElSIHN0b3JlIHRoYXRcbiAgICAvLyBsb29rcyBjb21wbGV0ZSB0byBkb3duc3RyZWFtIFNNQVJUIGFwcHMuXG4gICAgY29uc3QgY3R4ID0gX2FjdGl2ZVN5bmNDdHg7XG4gICAgaWYgKGN0eD8ucGF0aWVudElkICYmIGN0eC5iYWNrZW5kKSB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYCR7Y3R4LmJhY2tlbmR9L3N5bmMvcGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChjdHgucGF0aWVudElkKX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IGN0eC5zeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGN0eC5zeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBTdXJmYWNlIHRoZSB3aXBlIGluIHRoZSBzdGF0dXMgc28gdXNlciBzZWVzIGl0IGFjdHVhbGx5IGhhcHBlbmVkLlxuICAgICAgICAgIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBbU1RPUkFHRV9LRVldOiB7XG4gICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1REYyXHU1MDVDXHU2QjYyXHU0RTI2XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBjYW5jZWwgd2lwZSBmYWlsZWQ6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG4gICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImdldFN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkudGhlbigoZGF0YSkgPT4gc2VuZFJlc3BvbnNlKGRhdGFbU1RPUkFHRV9LRVldIHx8IG51bGwpKTtcbiAgICByZXR1cm4gdHJ1ZTsgIC8vIGFzeW5jIHJlc3BvbnNlXG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjbGVhclN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShTVE9SQUdFX0tFWSkudGhlbigoKSA9PiBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuXG4vLyBCZWx0LWFuZC1zdXNwZW5kZXJzIFNXIGtlZXBhbGl2ZTogYW4gYWxhcm0gZXZlcnkgMjAgcyB3YWtlcyB0aGUgU1cgaWZcbi8vIGlkbGUuIENvbWJpbmVkIHdpdGggdGhlIHJldHVybi10cnVlIHBhdHRlcm4gYWJvdmUsIHRoaXMgcHJldmVudHMgdGhlXG4vLyAzMCBzIGlkbGUgc2h1dGRvd24gZnJvbSBlbmRpbmcgYW4gaW4tcHJvZ3Jlc3Mgc3luYy5cbmNocm9tZS5hbGFybXMuY3JlYXRlKFwic3cta2VlcGFsaXZlXCIsIHsgcGVyaW9kSW5NaW51dGVzOiAwLjM0IH0pO1xuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKCgpID0+IHsgLyogbm8tb3A7IHByZXNlbmNlIGlzIHRoZSBwb2ludCAqLyB9KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBU0EsT0FBQyxXQUFXO0FBQ1Y7QUFFQSxZQUFJLGNBQWM7QUFDbEIsWUFBSSxpQkFBaUI7QUFDckIsWUFBSSxTQUFTLE9BQU8sV0FBVztBQUMvQixZQUFJLE9BQU8sU0FBUyxTQUFTLENBQUM7QUFDOUIsWUFBSSxLQUFLLG1CQUFtQjtBQUMxQixtQkFBUztBQUFBLFFBQ1g7QUFDQSxZQUFJLGFBQWEsQ0FBQyxVQUFVLE9BQU8sU0FBUztBQUM1QyxZQUFJLFVBQVUsQ0FBQyxLQUFLLHNCQUFzQixPQUFPLFlBQVksWUFBWSxRQUFRLFlBQVksUUFBUSxTQUFTO0FBQzlHLFlBQUksU0FBUztBQUNYLGlCQUFPO0FBQUEsUUFDVCxXQUFXLFlBQVk7QUFDckIsaUJBQU87QUFBQSxRQUNUO0FBQ0EsWUFBSSxZQUFZLENBQUMsS0FBSyx3QkFBd0IsT0FBTyxXQUFXLFlBQVksT0FBTztBQUNuRixZQUFJLE1BQU0sT0FBTyxXQUFXLGNBQWMsT0FBTztBQUNqRCxZQUFJLGVBQWUsQ0FBQyxLQUFLLDJCQUEyQixPQUFPLGdCQUFnQjtBQUMzRSxZQUFJLFlBQVksbUJBQW1CLE1BQU0sRUFBRTtBQUMzQyxZQUFJLFFBQVEsQ0FBQyxhQUFhLFNBQVMsT0FBTyxHQUFHO0FBQzdDLFlBQUks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QUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUk7QUFBQSxRQUMzRDtBQUVBLGFBQUssVUFBVSxXQUFXLEtBQUssVUFBVTtBQUV6QyxhQUFLLFVBQVUsU0FBUyxXQUFZO0FBQ2xDLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLO0FBRXRFLGlCQUFPO0FBQUEsWUFDSixPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxJQUFLO0FBQUEsWUFBTSxLQUFLO0FBQUEsWUFDL0QsT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sSUFBSztBQUFBLFlBQU0sS0FBSztBQUFBLFlBQy9ELE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLElBQUs7QUFBQSxZQUFNLEtBQUs7QUFBQSxZQUMvRCxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxJQUFLO0FBQUEsWUFBTSxLQUFLO0FBQUEsWUFDL0QsT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sSUFBSztBQUFBLFlBQU0sS0FBSztBQUFBLFVBQ2xFO0FBQUEs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QUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFVVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPVixV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
