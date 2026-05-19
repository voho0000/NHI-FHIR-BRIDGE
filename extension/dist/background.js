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
    return (0, import_js_sha1.sha1)([patientId, ...parts].join("|")).slice(0, 32);
  }
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
    const display = raw.display ?? "Unknown Condition";
    let code = raw.code;
    const system = mapSystem2(raw.system ?? "");
    if (system === ICD_10_CM && code) {
      code = normalizeIcd10Cm(code);
    }
    const resource = {
      resourceType: "Condition",
      // Stable id falls back to display when no code is present (catastrophic
      // illness rows from IHKE3209 carry the Chinese narrative only). Mirrors
      // the same `code || display` pattern in diagnostic-report.ts and
      // allergy.ts — avoids hash collisions between two same-day code-less
      // conditions.
      id: stableId(patientId, code || display, raw.onset_date ?? ""),
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
    if (raw.category) {
      resource.category = [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/condition-category",
              code: raw.category
            }
          ]
        }
      ];
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
    if (raw.recorded_date) {
      resource.recordedDate = `${raw.recorded_date}T00:00:00+08:00`;
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
    // 12028B / 12029B IgM (serum, immunodiffusion / nephelometry) — previously
    // both mapped to LOINC 14002-0 which is actually 'IgM [Units/volume] in
    // Cord blood' (neonatal specimen, verified loinc.org/14002-0/). Wrong
    // specimen for an adult serum order. Leaving unmapped; falls through to
    // NHI-code-only coding. See docs/LOINC_AUDIT_2026_05_19.md.
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
    // 09037C 血氨 — previously mapped to LOINC 1827-5 which is actually
    // 'Alpha 1 antitrypsin MS [Mass/volume] in Serum or Plasma' (verified
    // loinc.org/1827-5/). Wrong analyte entirely. Leaving unmapped; falls
    // through to NHI-code-only coding. See docs/LOINC_AUDIT_2026_05_19.md.
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
    // Free T4 has TWO valid LOINCs that differ only in unit-system:
    //   3024-7  Component=Thyroxine.free, Property=MCnc (Mass conc, ng/dL)
    //   14920-3 Component=Thyroxine.free, Property=SCnc (Molar conc, pmol/L)
    // Both are Free T4 — neither is Total T4. Earlier history:
    //   - Original mapping was 3024-7 (correct: matches Taiwan ng/dL labs).
    //   - Commit 9da5e5b changed it to 14920-3 on the premise that 3024-7
    //     was Total T4. That premise was inverted (verified loinc.org/3024-7/
    //     — Component is "Thyroxine.free"); the change introduced a LOINC↔unit
    //     mismatch (molar LOINC paired with a ng/dL value).
    //   - Restoring 3024-7 here so the LOINC's property class (MCnc) matches
    //     the unit field (ng/dL) Taiwan labs ship. See docs/LOINC_AUDIT_2026_05_19.md
    //     section F for full evidence.
    "09106C": "3024-7",
    // Free T4 — Thyroxine (T4) free [Mass/volume] S/P
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
    // 12069B Cryptococcus Ag — previously mapped to LOINC 5132-6 which is
    // actually 'DNA single strand Ab [Units/volume] in Serum' (anti-ssDNA,
    // lupus serology — verified loinc.org/5132-6/). Completely wrong
    // analyte. Leaving unmapped; falls through to NHI-code-only coding.
    // See docs/LOINC_AUDIT_2026_05_19.md.
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
    // 13013C TB Culture — previously mapped to LOINC 31952-5 which is
    // actually 'Rinderpest virus Ag [Presence] in Exudate' (cattle
    // morbillivirus, verified loinc.org/31952-5/). Wrong organism entirely.
    // Leaving unmapped; falls through to NHI-code-only coding. See
    // docs/LOINC_AUDIT_2026_05_19.md.
    "13016B": "600-7",
    // Blood Culture — Bacteria identified in Blood
    // ── Virology ──────────────────────────────────────
    // 14004B CMV IgG — previously mapped to LOINC 7849-3 which is actually
    // 'Taenia solium larva IgM Ab [Presence] in Serum' (pork tapeworm,
    // verified loinc.org/7849-3/). Wrong organism entirely. Leaving
    // unmapped; falls through to NHI-code-only coding.
    // 14048B CMV IgM — previously mapped to LOINC 7850-1 which is actually
    // 'Taenia solium larva Ab [Units/volume] in Serum' (verified
    // loinc.org/7850-1/). Same copy-paste-wrong-LOINC pattern as 14004B.
    // Leaving unmapped. See docs/LOINC_AUDIT_2026_05_19.md.
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
    "6690-2": "Leukocytes [#/volume] in Blood by Automated count",
    "777-3": "Platelets [#/volume] in Blood by Automated count",
    "789-8": "Erythrocytes [#/volume] in Blood by Automated count",
    "785-6": "MCH [Entitic mass] by Automated count",
    "711-2": "Eosinophils [#/volume] in Blood by Automated count",
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
    "14920-3": "Thyroxine (T4) free [Moles/volume] in Serum or Plasma",
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
  function _keywordMatches(key, combined) {
    const k = key.toLowerCase();
    if (isAsciiOnly(key)) {
      return new RegExp(`\\b${escapeRegex2(k)}\\b`).test(combined);
    }
    return combined.includes(k);
  }
  function _findLongestMatch(combined, table) {
    let bestLoinc = null;
    let bestKeyLen = 0;
    for (const [key, loinc] of Object.entries(table)) {
      if (key.length > bestKeyLen && _keywordMatches(key, combined)) {
        bestLoinc = loinc;
        bestKeyLen = key.length;
      }
    }
    return bestLoinc;
  }
  function findLoinc(code, display) {
    if (code && code in NHI_TO_LOINC && !DISPLAY_FIRST_CODES.has(code)) {
      return NHI_TO_LOINC[code] ?? null;
    }
    const combined = `${code} ${display}`.toLowerCase();
    if (code in PANEL_LOINC_MAP) {
      const hit2 = _findLongestMatch(combined, PANEL_LOINC_MAP[code]);
      if (hit2) return hit2;
    }
    const hit = _findLongestMatch(combined, LOINC_MAP);
    if (hit) return hit;
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
    if (raw.source_program) {
      resource.meta.tag = [
        {
          system: "http://nhi-fhir-bridge/source-program",
          code: String(raw.source_program)
        }
      ];
    }
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
    const rawId = String(raw.identifier ?? raw.id ?? "unknown");
    const patientId = derivePatientId(rawId);
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
          system: looksLikeTwNationalId(rawId) ? TW_NATIONAL_ID : HIS_LOCAL_PATIENT_MRN,
          value: rawId
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

  // src/nhi-adapters.js
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
  function _cleanLabName(s) {
    if (s === null || s === void 0) return "";
    return String(s).trim().replace(/[,，;；]+\s*$/, "").trim();
  }
  function adaptLabItem(item) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(
      item.reaL_INSPECT_DATE || item.real_inspect_date || item.funC_DATE
    );
    const value = item.assaY_VALUE;
    if (!date || value === void 0 || value === null || value === "") return null;
    const fullName = _cleanLabName(item.assaY_ITEM_NAME) || _cleanLabName(item.order_shortname) || _cleanLabName(item.ordeR_NAME);
    const orderCode = String(item.ordeR_CODE || "").trim();
    return {
      date,
      order_code: orderCode,
      order_name: item.ordeR_NAME || "",
      // Prefer the NHI 醫令碼 ("09140C") as the FHIR coding code so the
      // downstream observation mapper routes it under NHI_MEDICAL_ORDER_
      // CODE system. SMART apps group lab tests by coding code; using
      // free-text here is what causes "Crea" and "Crea," to be split
      // into two distinct tests. Fallback to the cleaned display when
      // NHI doesn't supply an order code (older / edge-case rows).
      code: orderCode || fullName,
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
  function adaptImagingListStub() {
    return null;
  }
  function adaptCatastrophicIllness(item) {
    if (!item || typeof item !== "object") return null;
    const display = pickEnglish(item.icD10CM_CNAME || item.icd10cm_cname || "");
    if (!display) return null;
    return {
      display,
      code: "",
      system: "",
      onset_date: rocToISO(item.valiD_S_DATE || item.valid_s_date || ""),
      recorded_date: rocToISO(item.valiD_S_DATE || item.valid_s_date || ""),
      category: "problem-list-item",
      severity: "Severe (\u91CD\u5927\u50B7\u75C5)",
      hospital: item.hosP_ABBR || item.hosp_abbr || "",
      clinical_status: "active"
    };
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
      if (v === "" || v === "\u2014") return;
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
        reference_range: refRange || "",
        // Source-programme tag — added to Observation.meta.tag by the
        // mapper; lets SMART apps filter / categorize "this came from
        // 成人預防保健 screening".
        source_program: "adult-preventive"
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
    push("Cholesterol", row.cho, "mg/dL", "", "laboratory", "09001C");
    push("Triglyceride", row.bloD_TG, "mg/dL", "", "laboratory", "09004C");
    push("HDL", row.hdl, "mg/dL", "", "laboratory", "09043C");
    push("LDL", row.ldl, "mg/dL", "", "laboratory", "09044C");
    push("SGOT (AST)", row.sgot, "U/L", row.lF_DIAG_RESULT_TEXT || "", "laboratory", "09025C");
    push("SGPT (ALT)", row.sgpt, "U/L", row.lF_DIAG_RESULT_TEXT || "", "laboratory", "09026C");
    push(
      "Glu-AC",
      row.s_09005C,
      "mg/dL",
      row.s_09005C_DIAG_RESULT_TEXT || "",
      "laboratory",
      "09005C"
    );
    push("BUN", row.urinE_BUN, "mg/dL", "", "laboratory", "09002C");
    push("Creatinine", row.bloD_CREAT, "mg/dL", "", "laboratory", "09015C");
    push(
      "eGFR",
      row.egfr,
      "mL/min/1.73m2",
      row.rF_DIAG_RESULT_TEXT || ""
    );
    push("Urine Protein", row.urinE_PROTEIN_TEXT || "", "", "");
    push("HBsAg", row.hbsaG_TEXT || "", "", row.hbV_RESULT_TEXT || "", "laboratory", "14032C");
    push("Anti-HCV", row.antI_HCV_TEXT || "", "", row.hcV_RESULT_TEXT || "", "laboratory", "14051C");
    push("Uric Acid", row.uriC_ACID, "mg/dL", "", "laboratory", "09013C");
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
    const date = rocToISO(
      item.real_INSPECT_DATE || item.real_inspect_date || item.func_DATE || item.func_date || ""
    );
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

  // src/nhi-endpoints.js
  var ENDPOINT_LABEL_ZH = {
    encounters: "\u5C31\u91AB",
    inpatient: "\u4F4F\u9662",
    inpatient_legacy: "\u4F4F\u9662\uFF08\u820A\uFF09",
    procedures: "\u624B\u8853 / \u8655\u7F6E",
    medications: "\u8655\u65B9\u85E5\u54C1",
    allergies: "\u85E5\u7269\u904E\u654F",
    allergies_b: "\u85E5\u7269\u904E\u654F\uFF08B\uFF09",
    adult_preventive: "\u6210\u4EBA\u5065\u6AA2",
    cancer_screening: "\u764C\u75C7\u7BE9\u6AA2",
    imaging: "\u5F71\u50CF\u6AA2\u67E5",
    other_labs: "\u6AA2\u9A57",
    catastrophic_illness: "\u91CD\u5927\u50B7\u75C5"
  };
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
      adapt: adaptImagingListStub,
      supportsDateRange: true
    },
    // other_labs already uses /search; same ISO-dash date format works.
    {
      name: "other_labs",
      path: "/api/ihke3000/ihke3409s01/search?s_type=&s_date=&e_date=&s_sort=A1",
      page_type: "observations",
      adapt: adaptLabItem,
      supportsDateRange: true
    },
    // IHKE3209S01 (重大傷病) — NHI-vetted catastrophic-illness registry.
    // Each row → a FHIR Condition with category=problem-list-item, the
    // closest 健康存摺 equivalent to a curated problem list. Endpoint
    // doesn't accept date params (NHI returns currently-valid certs only).
    {
      name: "catastrophic_illness",
      path: "/api/ihke3000/ihke3209s01/SP_IHKE3209S01",
      page_type: "conditions",
      adapt: adaptCatastrophicIllness
    }
  ];

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
  async function _checkNhiLoginState(tabId) {
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: async () => {
          const t = sessionStorage.getItem("token");
          if (!t) return false;
          try {
            const r = await fetch("/api/ihke3000/ihke3410s01/page_load", {
              credentials: "same-origin",
              headers: { Accept: "application/json", Authorization: `Bearer ${t}` }
            });
            return r.ok;
          } catch {
            return false;
          }
        }
      });
      return typeof result === "boolean" ? result : null;
    } catch {
      return null;
    }
  }
  async function _maybeFetchPatientIdFromNhi(tabId, patientOverride) {
    const current = patientOverride.id_no || "";
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
      await chrome.storage.local.set({ patientOverride }).catch(() => {
      });
      const switchedRealPatients = current && !current.startsWith("auto-") && current !== cid;
      if (switchedRealPatients) {
        await chrome.storage.local.remove(PENDING_BUNDLE_KEY).catch(() => {
        });
      }
    }
    return patientOverride;
  }
  async function _isMaskEnabled() {
    try {
      const { maskNameEnabled } = await chrome.storage.local.get("maskNameEnabled");
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
    const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const maskedPid = maskId(patientId || "unknown", "X");
    const safePid = maskedPid.replace(/[^A-Za-z0-9_-]/g, "_");
    const compact = (d) => (d || "").slice(0, 10).replace(/-/g, "");
    let s, e;
    if (dateRange && (dateRange.start || dateRange.end)) {
      s = compact(dateRange.start) || fmt(now);
      e = compact(dateRange.end) || fmt(now);
    } else {
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      s = fmt(oneYearAgo);
      e = fmt(now);
    }
    const filename = `nhi-${safePid}-${s}-${e}.json`;
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
      const label = ENDPOINT_LABEL_ZH[ep.name] ?? ep.name;
      if (s.status === "rejected") {
        errors.push(`${ep.name}: ${s.reason.message}`);
        breakdown.push(`\u274C ${label}\uFF1A\u53D6\u5F97\u5931\u6557`);
        continue;
      }
      const { items, raw_count } = s.value;
      raw_total += raw_count;
      adapted_total += items.length;
      if (raw_count === 0) continue;
      if (items.length > raw_count && raw_count > 0) {
        breakdown.push(`${label}\uFF1A${raw_count} \u7B46 \u2192 ${items.length} \u9805`);
      } else {
        breakdown.push(`${label}\uFF1A${items.length} \u7B46`);
      }
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
      if (patientOverride.id_no && total > 0) {
        try {
          await setStatus({ progress: "\u{1F4E6} \u53D6\u5F97\u5F8C\u7AEF\u5B8C\u6574\u8CC7\u6599\u2026", totalResources: total });
          const fhirPid = derivePatientId(patientOverride.id_no);
          const expUrl = `${backend}/fhir/export?patient=${encodeURIComponent(fhirPid)}`;
          const r = await fetch(expUrl, {
            headers: syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}
          });
          if (r.ok) {
            const bundle = await r.json();
            const dl = await _stashFhirBundle(bundle, patientOverride.id_no, dateRange);
            _localFilename = dl.filename;
            if (Array.isArray(bundle.entry) && bundle.entry.length > 0) {
              total = bundle.entry.length;
            }
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
    const _fullBreakdown = [...breakdown, ..._phaseLines];
    let _summaryLine;
    if (errors.length) {
      _summaryLine = `\u26A0\uFE0F \u53D6\u5F97\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF0C${errors.length} \u9805\u5931\u6557\uFF08${_elapsedStr}\uFF09${_localTail}`;
    } else if (total === 0) {
      _summaryLine = `\u26A0\uFE0F \u53D6\u5F97\u5B8C\u6210\u4F46\u6C92\u6293\u5230\u4EFB\u4F55\u8CC7\u6599\uFF08${_elapsedStr}\uFF09\u2014 \u5065\u4FDD\u5B58\u647A session \u53EF\u80FD\u904E\u671F\uFF0C\u8ACB\u56DE\u8A72\u5206\u9801\u91CD\u65B0\u767B\u5165\uFF1B\u6216\u62C9\u9577\u300C\u65E5\u671F\u7BC4\u570D\u300D\u518D\u8A66\u3002`;
    } else {
      _summaryLine = `\u2705 \u53D6\u5F97\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF08${_elapsedStr}\uFF09${_localTail}`;
    }
    await setStatus({
      running: false,
      progress: _summaryLine,
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
  var SYNC_KEYS_TO_MIGRATE = [
    "backendUrl",
    "syncApiKey",
    "smartAppLaunchUrl",
    "patientOverride",
    "syncMode",
    "maskNameEnabled"
  ];
  async function migrateSyncToLocal() {
    try {
      const synced = await chrome.storage.sync.get(SYNC_KEYS_TO_MIGRATE);
      const present = Object.fromEntries(
        Object.entries(synced).filter(([, v]) => v !== void 0)
      );
      if (Object.keys(present).length === 0) return;
      const local = await chrome.storage.local.get(Object.keys(present));
      const toWrite = Object.fromEntries(
        Object.entries(present).filter(([k]) => local[k] === void 0)
      );
      if (Object.keys(toWrite).length > 0) {
        await chrome.storage.local.set(toWrite);
      }
      await chrome.storage.sync.remove(Object.keys(present));
    } catch {
    }
  }
  chrome.runtime.onInstalled.addListener(async () => {
    await migrateSyncToLocal();
  });
  chrome.runtime.onStartup?.addListener?.(() => {
    migrateSyncToLocal();
  });
  migrateSyncToLocal();
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
    if (msg?.type === "checkNhiLogin") {
      _checkNhiLoginState(msg.tabId).then(
        (state) => {
          try {
            sendResponse({ loggedIn: state });
          } catch {
          }
        },
        () => {
          try {
            sendResponse({ loggedIn: null });
          } catch {
          }
        }
      );
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9uaGktYWRhcHRlcnMuanMiLCAiLi4vc3JjL25oaS1lbmRwb2ludHMuanMiLCAiLi4vc3JjL2JhY2tncm91bmQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG4gKiBbanMtc2hhMV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1zaGExfVxuICpcbiAqIEB2ZXJzaW9uIDAuNy4wXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMjRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4vKmpzbGludCBiaXR3aXNlOiB0cnVlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgSU5QVVRfRVJST1IgPSAnaW5wdXQgaXMgaW52YWxpZCB0eXBlJztcbiAgdmFyIEZJTkFMSVpFX0VSUk9SID0gJ2ZpbmFsaXplIGFscmVhZHkgY2FsbGVkJztcbiAgdmFyIFdJTkRPVyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnO1xuICB2YXIgcm9vdCA9IFdJTkRPVyA/IHdpbmRvdyA6IHt9O1xuICBpZiAocm9vdC5KU19TSEExX05PX1dJTkRPVykge1xuICAgIFdJTkRPVyA9IGZhbHNlO1xuICB9XG4gIHZhciBXRUJfV09SS0VSID0gIVdJTkRPVyAmJiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCc7XG4gIHZhciBOT0RFX0pTID0gIXJvb3QuSlNfU0hBMV9OT19OT0RFX0pTICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgaWYgKE5PREVfSlMpIHtcbiAgICByb290ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFdFQl9XT1JLRVIpIHtcbiAgICByb290ID0gc2VsZjtcbiAgfVxuICB2YXIgQ09NTU9OX0pTID0gIXJvb3QuSlNfU0hBMV9OT19DT01NT05fSlMgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHM7XG4gIHZhciBBTUQgPSB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQ7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAhcm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUiAmJiB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcbiAgdmFyIEVYVFJBID0gWy0yMTQ3NDgzNjQ4LCA4Mzg4NjA4LCAzMjc2OCwgMTI4XTtcbiAgdmFyIFNISUZUID0gWzI0LCAxNiwgOCwgMF07XG4gIHZhciBPVVRQVVRfVFlQRVMgPSBbJ2hleCcsICdhcnJheScsICdkaWdlc3QnLCAnYXJyYXlCdWZmZXInXTtcblxuICB2YXIgYmxvY2tzID0gW107XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICBpZiAocm9vdC5KU19TSEExX05PX05PREVfSlMgfHwgIWlzQXJyYXkpIHtcbiAgICBpc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3O1xuICBpZiAoQVJSQVlfQlVGRkVSICYmIChyb290LkpTX1NIQTFfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgfHwgIWlzVmlldykpIHtcbiAgICBpc1ZpZXcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmJ1ZmZlciAmJiBvYmouYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcjtcbiAgICB9O1xuICB9XG5cbiAgLy8gW21lc3NhZ2U6IHN0cmluZywgaXNTdHJpbmc6IGJvb2xdXG4gIHZhciBmb3JtYXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXNzYWdlO1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIFttZXNzYWdlLCB0cnVlXTtcbiAgICB9XG4gICAgaWYgKHR5cGUgIT09ICdvYmplY3QnIHx8IG1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChBUlJBWV9CVUZGRVIgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBbbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSksIGZhbHNlXTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KG1lc3NhZ2UpICYmICFpc1ZpZXcobWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGNyZWF0ZU91dHB1dE1ldGhvZCA9IGZ1bmN0aW9uIChvdXRwdXRUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IFNoYTEodHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2QgPSBjcmVhdGVPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIGlmIChOT0RFX0pTKSB7XG4gICAgICBtZXRob2QgPSBub2RlV3JhcChtZXRob2QpO1xuICAgIH1cbiAgICBtZXRob2QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKCk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuY3JlYXRlKCkudXBkYXRlKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPVVRQVVRfVFlQRVMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0eXBlID0gT1VUUFVUX1RZUEVTW2ldO1xuICAgICAgbWV0aG9kW3R5cGVdID0gY3JlYXRlT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIHZhciBub2RlV3JhcCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgICB2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgIHZhciBidWZmZXJGcm9tO1xuICAgIGlmIChCdWZmZXIuZnJvbSAmJiAhcm9vdC5KU19TSEExX05PX0JVRkZFUl9GUk9NKSB7XG4gICAgICBidWZmZXJGcm9tID0gQnVmZmVyLmZyb207XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlckZyb20gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihtZXNzYWdlKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBub2RlTWV0aG9kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKG1lc3NhZ2UsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSBudWxsIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG1lc3NhZ2UpIHx8IGlzVmlldyhtZXNzYWdlKSB8fFxuICAgICAgICBtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ1ZmZlckZyb20obWVzc2FnZSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGVNZXRob2Q7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSwgdHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlSG1hY01ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlSG1hY091dHB1dE1ldGhvZCgnaGV4Jyk7XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgSG1hY1NoYTEoa2V5KTtcbiAgICB9O1xuICAgIG1ldGhvZC51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZShrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QodHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRob2Q7XG4gIH07XG5cbiAgZnVuY3Rpb24gU2hhMShzaGFyZWRNZW1vcnkpIHtcbiAgICBpZiAoc2hhcmVkTWVtb3J5KSB7XG4gICAgICBibG9ja3NbMF0gPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICBibG9ja3NbOF0gPSBibG9ja3NbOV0gPSBibG9ja3NbMTBdID0gYmxvY2tzWzExXSA9XG4gICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICB9XG5cbiAgICB0aGlzLmgwID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmgxID0gMHhFRkNEQUI4OTtcbiAgICB0aGlzLmgyID0gMHg5OEJBRENGRTtcbiAgICB0aGlzLmgzID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmg0ID0gMHhDM0QyRTFGMDtcblxuICAgIHRoaXMuYmxvY2sgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMDtcbiAgICB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJzdCA9IHRydWU7XG4gIH1cblxuICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEZJTkFMSVpFX0VSUk9SKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShtZXNzYWdlKTtcbiAgICBtZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgIHZhciBpc1N0cmluZyA9IHJlc3VsdFsxXTtcbiAgICB2YXIgY29kZSwgaW5kZXggPSAwLCBpLCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCB8fCAwLCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgICAgIGJsb2Nrc1swXSA9IHRoaXMuYmxvY2s7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYoaXNTdHJpbmcpIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gY29kZSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvZGUgPSAweDEwMDAwICsgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhmMCB8IChjb2RlID4+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSB0aGlzLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgNjQ7ICsraW5kZXgpIHtcbiAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaTtcbiAgICAgIHRoaXMuYnl0ZXMgKz0gaSAtIHRoaXMuc3RhcnQ7XG4gICAgICBpZiAoaSA+PSA2NCkge1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGkgLSA2NDtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDA7XG4gICAgICB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgdmFyIGJsb2NrcyA9IHRoaXMuYmxvY2tzLCBpID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgIGJsb2Nrc1sxNl0gPSB0aGlzLmJsb2NrO1xuICAgIGJsb2Nrc1tpID4+PiAyXSB8PSBFWFRSQVtpICYgM107XG4gICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgaWYgKGkgPj0gNTYpIHtcbiAgICAgIGlmICghdGhpcy5oYXNoZWQpIHtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgfVxuICAgIGJsb2Nrc1sxNF0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjk7XG4gICAgYmxvY2tzWzE1XSA9IHRoaXMuYnl0ZXMgPDwgMztcbiAgICB0aGlzLmhhc2goKTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhID0gdGhpcy5oMCwgYiA9IHRoaXMuaDEsIGMgPSB0aGlzLmgyLCBkID0gdGhpcy5oMywgZSA9IHRoaXMuaDQ7XG4gICAgdmFyIGYsIGosIHQsIGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgZm9yKGogPSAxNjsgaiA8IDgwOyArK2opIHtcbiAgICAgIHQgPSBibG9ja3NbaiAtIDNdIF4gYmxvY2tzW2ogLSA4XSBeIGJsb2Nrc1tqIC0gMTRdIF4gYmxvY2tzW2ogLSAxNl07XG4gICAgICBibG9ja3Nbal0gPSAgKHQgPDwgMSkgfCAodCA+Pj4gMzEpO1xuICAgIH1cblxuICAgIGZvcihqID0gMDsgaiA8IDIwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IChhICYgYikgfCAoKH5hKSAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoKH5lKSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoKH5kKSAmIGEpO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IChjICYgZCkgfCAoKH5jKSAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgNDA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IGEgXiBiIF4gYztcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IGMgXiBkIF4gZTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDYwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSAtIDE4OTQwMDc1ODggKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKGEgJiBjKSB8IChiICYgYyk7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gKGUgJiBhKSB8IChlICYgYikgfCAoYSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoZCAmIGEpIHwgKGUgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKGMgJiBlKSB8IChkICYgZSk7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA4MDsgaiArPSA1KSB7XG4gICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSA4OTk0OTc1MTQgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSBkIF4gZSBeIGE7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IHRoaXMuaDAgKyBhIDw8IDA7XG4gICAgdGhpcy5oMSA9IHRoaXMuaDEgKyBiIDw8IDA7XG4gICAgdGhpcy5oMiA9IHRoaXMuaDIgKyBjIDw8IDA7XG4gICAgdGhpcy5oMyA9IHRoaXMuaDMgKyBkIDw8IDA7XG4gICAgdGhpcy5oNCA9IHRoaXMuaDQgKyBlIDw8IDA7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBoMCA9IHRoaXMuaDAsIGgxID0gdGhpcy5oMSwgaDIgPSB0aGlzLmgyLCBoMyA9IHRoaXMuaDMsIGg0ID0gdGhpcy5oNDtcblxuICAgIHJldHVybiBIRVhfQ0hBUlNbKGgwID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDAgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gyICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDMgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toNCAmIDB4MEZdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLnRvU3RyaW5nID0gU2hhMS5wcm90b3R5cGUuaGV4O1xuXG4gIFNoYTEucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gW1xuICAgICAgKGgwID4+PiAyNCkgJiAweEZGLCAoaDAgPj4+IDE2KSAmIDB4RkYsIChoMCA+Pj4gOCkgJiAweEZGLCBoMCAmIDB4RkYsXG4gICAgICAoaDEgPj4+IDI0KSAmIDB4RkYsIChoMSA+Pj4gMTYpICYgMHhGRiwgKGgxID4+PiA4KSAmIDB4RkYsIGgxICYgMHhGRixcbiAgICAgIChoMiA+Pj4gMjQpICYgMHhGRiwgKGgyID4+PiAxNikgJiAweEZGLCAoaDIgPj4+IDgpICYgMHhGRiwgaDIgJiAweEZGLFxuICAgICAgKGgzID4+PiAyNCkgJiAweEZGLCAoaDMgPj4+IDE2KSAmIDB4RkYsIChoMyA+Pj4gOCkgJiAweEZGLCBoMyAmIDB4RkYsXG4gICAgICAoaDQgPj4+IDI0KSAmIDB4RkYsIChoNCA+Pj4gMTYpICYgMHhGRiwgKGg0ID4+PiA4KSAmIDB4RkYsIGg0ICYgMHhGRlxuICAgIF07XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXkgPSBTaGExLnByb3RvdHlwZS5kaWdlc3Q7XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG4gICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDAsIHRoaXMuaDApO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMig0LCB0aGlzLmgxKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoOCwgdGhpcy5oMik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDEyLCB0aGlzLmgzKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoMTYsIHRoaXMuaDQpO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgZnVuY3Rpb24gSG1hY1NoYTEoa2V5LCBzaGFyZWRNZW1vcnkpIHtcbiAgICB2YXIgaSwgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShrZXkpO1xuICAgIGtleSA9IHJlc3VsdFswXTtcbiAgICBpZiAocmVzdWx0WzFdKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgbGVuZ3RoID0ga2V5Lmxlbmd0aCwgaW5kZXggPSAwLCBjb2RlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvZGUgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4YzAgfCAoY29kZSA+Pj4gNikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHhlMCB8IChjb2RlID4+PiAxMikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweDNmZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gNikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8IChjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBrZXkgPSBieXRlcztcbiAgICB9XG5cbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDY0KSB7XG4gICAgICBrZXkgPSAobmV3IFNoYTEodHJ1ZSkpLnVwZGF0ZShrZXkpLmFycmF5KCk7XG4gICAgfVxuXG4gICAgdmFyIG9LZXlQYWQgPSBbXSwgaUtleVBhZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgKytpKSB7XG4gICAgICB2YXIgYiA9IGtleVtpXSB8fCAwO1xuICAgICAgb0tleVBhZFtpXSA9IDB4NWMgXiBiO1xuICAgICAgaUtleVBhZFtpXSA9IDB4MzYgXiBiO1xuICAgIH1cblxuICAgIFNoYTEuY2FsbCh0aGlzLCBzaGFyZWRNZW1vcnkpO1xuXG4gICAgdGhpcy51cGRhdGUoaUtleVBhZCk7XG4gICAgdGhpcy5vS2V5UGFkID0gb0tleVBhZDtcbiAgICB0aGlzLmlubmVyID0gdHJ1ZTtcbiAgICB0aGlzLnNoYXJlZE1lbW9yeSA9IHNoYXJlZE1lbW9yeTtcbiAgfVxuICBIbWFjU2hhMS5wcm90b3R5cGUgPSBuZXcgU2hhMSgpO1xuXG4gIEhtYWNTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICB0aGlzLmlubmVyID0gZmFsc2U7XG4gICAgICB2YXIgaW5uZXJIYXNoID0gdGhpcy5hcnJheSgpO1xuICAgICAgU2hhMS5jYWxsKHRoaXMsIHRoaXMuc2hhcmVkTWVtb3J5KTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMub0tleVBhZCk7XG4gICAgICB0aGlzLnVwZGF0ZShpbm5lckhhc2gpO1xuICAgICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV4cG9ydHMgPSBjcmVhdGVNZXRob2QoKTtcbiAgZXhwb3J0cy5zaGExID0gZXhwb3J0cztcbiAgZXhwb3J0cy5zaGExLmhtYWMgPSBjcmVhdGVIbWFjTWV0aG9kKCk7XG5cbiAgaWYgKENPTU1PTl9KUykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiAgfSBlbHNlIHtcbiAgICByb290LnNoYTEgPSBleHBvcnRzO1xuICAgIGlmIChBTUQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwgIi8qKlxuICogQ2VudHJhbGlzZWQgRkhJUiBDb2RlU3lzdGVtIC8gSWRlbnRpZmllclN5c3RlbSBVUklzIHVzZWQgYnkgdGhlIG1hcHBlcnMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvZmhpci9zeXN0ZW1zLnB5YC4gV2UgdXNlIFVSTC1mb3JtIHN5c3RlbXMgaW5zdGVhZFxuICogb2YgT0lEcyBiZWNhdXNlOlxuICogICAtIGl0IGRvZXNuJ3QgcmVxdWlyZSBtaW50aW5nL293bmluZyBhIHJlYWwgTkhJL1RXIGNvcmUgT0lELFxuICogICAtIGl0J3Mgc2VsZi1kZXNjcmliaW5nIGluIHRvb2xzIHRoYXQgZG9uJ3QgcmVjb2duaXNlIHRoZSBPSUQsXG4gKiAgIC0gaXQgY2xlYW5seSBzdXJ2aXZlcyB0aGUgVFdOSElGSElSIHZhbGlkYXRvcidzIHN5bnRhY3RpYyBjaGVjay5cbiAqXG4gKiBBbGwgc3lzdGVtcyBsaXZlIGhlcmUgc28gYSBzaW5nbGUgY2hhbmdlIHJpcHBsZXMgdG8gZXZlcnkgbWFwcGVyLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgbmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU1MDY1XHU0RkREXHU3RjcyXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIChsYWIgKyBwcm9jZWR1cmUgb3JkZXIgY29kZXMgXHUyMDE0IHNhbWUgbmFtZXNwYWNlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfTUVESUNBTF9PUkRFUl9DT0RFID1cbiAgXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1tZWRpY2FsLW9yZGVyLWNvZGVcIjtcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1ODVFNVx1NTRDMVx1NEVFM1x1NzhCQyAoZHJ1ZyBjb2RlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfRFJVR19DT0RFID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1kcnVnLWNvZGVcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRhaXdhbiBwYXRpZW50IGlkZW50aWZpZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIChUYWl3YW4gbmF0aW9uYWwgSUQpLiAqL1xuZXhwb3J0IGNvbnN0IFRXX05BVElPTkFMX0lEID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9JZGVudGlmaWVyU3lzdGVtL25hdGlvbmFsLWlkXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBmYWxsYmFja3MgKHBlci1kZXBsb3ltZW50LCBOT1QgY3Jvc3Mtc3lzdGVtIGNhbm9uaWNhbCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTEFCX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWxhYlwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLW1lZGljYXRpb25cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUkVQT1JUX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLXJlcG9ydFwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9DT05ESVRJT05fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1wcm9jZWR1cmVcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQUxMRVJHRU5fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtYWxsZXJnZW5cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUEFUSUVOVF9NUk4gPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0lkZW50aWZpZXJTeXN0ZW0vaGlzLW1yblwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJuYXRpb25hbCBjb2RlIHN5c3RlbXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBMT0lOQyA9IFwiaHR0cDovL2xvaW5jLm9yZ1wiO1xuZXhwb3J0IGNvbnN0IFNOT01FRF9DVCA9IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiO1xuLyoqIElDRC0xMC1DTSAoVGFpd2FuIC8gXHU1MDY1XHU0RkREIHVzZXMgdGhpcywgbm90IGJhcmUgSUNELTEwKS4gKi9cbmV4cG9ydCBjb25zdCBJQ0RfMTBfQ00gPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiO1xuZXhwb3J0IGNvbnN0IElDRF8xMF9QQ1MgPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1wY3NcIjtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIzNDUwODY2YCBcdTIxOTIgYFAxMjM0NSoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBBbGxlcmd5SW50b2xlcmFuY2UgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9hbGxlcmd5LnB5YC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBBTExPV0VEX0NBVEVHT1JJRVMgPSBuZXcgU2V0KFtcIm1lZGljYXRpb25cIiwgXCJmb29kXCIsIFwiZW52aXJvbm1lbnRcIiwgXCJiaW9sb2dpY1wiXSk7XG5jb25zdCBBTExPV0VEX0NSSVRJQ0FMSVRZID0gbmV3IFNldChbXCJoaWdoXCIsIFwibG93XCIsIFwidW5hYmxlLXRvLWFzc2Vzc1wiXSk7XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJyeG5vcm1cIikpIHJldHVybiBcImh0dHA6Ly93d3cubmxtLm5paC5nb3YvcmVzZWFyY2gvdW1scy9yeG5vcm1cIjtcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0FMTEVSR0VOX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBBbGxlcmd5SW50b2xlcmFuY2UoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBBbGxlcmdlblwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5yZWNvcmRlZF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBwYXRpZW50OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgdmVyaWZpY2F0aW9uU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS12ZXJpZmljYXRpb25cIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgY2F0ZWdvcnkgPSByYXcuY2F0ZWdvcnkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ0FURUdPUklFUy5oYXMoY2F0ZWdvcnkpKSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbY2F0ZWdvcnldO1xuICB9XG5cbiAgY29uc3QgY3JpdGljYWxpdHkgPSByYXcuY3JpdGljYWxpdHkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ1JJVElDQUxJVFkuaGFzKGNyaXRpY2FsaXR5KSkge1xuICAgIHJlc291cmNlLmNyaXRpY2FsaXR5ID0gY3JpdGljYWxpdHk7XG4gIH1cblxuICBpZiAocmF3LnJlY29yZGVkX2RhdGUpIHtcbiAgICByZXNvdXJjZS5yZWNvcmRlZERhdGUgPSBgJHtyYXcucmVjb3JkZWRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgcmVhY3Rpb25Ob3RlID0gcmF3LnJlYWN0aW9uID8/IFwiXCI7XG4gIGlmIChyZWFjdGlvbk5vdGUpIHtcbiAgICByZXNvdXJjZS5yZWFjdGlvbiA9IFt7IGRlc2NyaXB0aW9uOiByZWFjdGlvbk5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBDb25kaXRpb24gbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9jb25kaXRpb24ucHlgLiBJbmNsdWRlcyB0aGUgSUNELTEwLUNNXG4gKiBub3JtYWxpc2VyIChUV05ISUZISVIgUm91bmQtMyBmaXgpIHdoaWNoIGluc2VydHMgdGhlIGNhbm9uaWNhbCBkb3RcbiAqIGJhY2sgaW50byBOSEkncyB1bi1kb3R0ZWQgY29kZXMgKFwiRTExMjJcIiBcdTIxOTIgXCJFMTEuMjJcIikuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuLy8gSUNELTEwLUNNIGNhbm9uaWNhbCBmb3JtIGlzICdYWFguWVlZW0EtWl0nIChjYXRlZ29yeSAzIGNoYXJzICsgb3B0aW9uYWxcbi8vIGRvdCArIHN1YmRpdmlzaW9uICsgb3B0aW9uYWwgN3RoLWNoYXJhY3RlciBleHRlbnNpb24pLiBOSEkgXHU1MDY1XHU0RkREIHNlbmRzXG4vLyBjb2RlcyBXSVRIT1VUIHRoZSBkb3QgKCdFMTEyMicsICdNNDc4OTInLCAnUzA5OTNYQScsICdNMTkyNzEnKS5cbi8vIFZhbGlkYXRvciByZWplY3RzIHVuLWRvdHRlZCBjb2RlcyBhcyAnVW5rbm93biBjb2RlJy5cbmNvbnN0IElDRDEwX0NBVEVHT1JZX1JFID0gL15bQS1aXVswLTlBLVpdezJ9JC87XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBkb3QgYmFjayBpbnRvIE5ISSdzIG5vLWRvdCBJQ0QtMTAtQ00gY29kZXMuXG4gKiAgIEUxMTIyICAgIFx1MjE5MiBFMTEuMjJcbiAqICAgTTQ3ODkyICAgXHUyMTkyIE00Ny44OTJcbiAqICAgUzA5OTNYQSAgXHUyMTkyIFMwOS45M1hBXG4gKiAgIEUxMSAgICAgIFx1MjE5MiBFMTEgICAgICAgIChubyBzdWJkaXZpc2lvbjsgcGFzcyB0aHJvdWdoKVxuICogICBFMTEuMjIgICBcdTIxOTIgRTExLjIyICAgICAoYWxyZWFkeSBkb3R0ZWQ7IHBhc3MgdGhyb3VnaClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUljZDEwQ20oY29kZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghY29kZSB8fCBjb2RlLmluY2x1ZGVzKFwiLlwiKSkgcmV0dXJuIGNvZGUgPz8gXCJcIjtcbiAgY29uc3QgcyA9IGNvZGUudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG4gIGlmIChzLmxlbmd0aCA8PSAzKSByZXR1cm4gcztcbiAgY29uc3QgaGVhZCA9IHMuc2xpY2UoMCwgMyk7XG4gIGNvbnN0IHRhaWwgPSBzLnNsaWNlKDMpO1xuICBpZiAoSUNEMTBfQ0FURUdPUllfUkUudGVzdChoZWFkKSkge1xuICAgIHJldHVybiBgJHtoZWFkfS4ke3RhaWx9YDtcbiAgfVxuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZC0xMFwiKSB8fCBzLmluY2x1ZGVzKFwiaWNkMTBcIikpIHtcbiAgICAvLyBOSEkgXHU1MDY1XHU0RkREIGNvZGVzIGFyZSBJQ0QtMTAtQ00gKFVTL1RhaXdhbiBleHRlbmRlZCBzZXQgXHUyMDE0IGUuZy5cbiAgICAvLyBFMTEuMjIpLiBUaGUgYmFzZSBJQ0QtMTAgVmFsdWVTZXQgcmVqZWN0cyB0aGVzZSBhcyAnVW5rbm93biBjb2RlJy5cbiAgICByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfQ007XG4gIH1cbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0NPTkRJVElPTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQ29uZGl0aW9uKHJhdzogUmVjb3JkPHN0cmluZywgYW55PiwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBDb25kaXRpb25cIjtcbiAgbGV0IGNvZGUgPSByYXcuY29kZSBhcyBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcbiAgaWYgKHN5c3RlbSA9PT0gc3lzdGVtcy5JQ0RfMTBfQ00gJiYgY29kZSkge1xuICAgIGNvZGUgPSBub3JtYWxpemVJY2QxMENtKGNvZGUpO1xuICB9XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkNvbmRpdGlvblwiLFxuICAgIC8vIFN0YWJsZSBpZCBmYWxscyBiYWNrIHRvIGRpc3BsYXkgd2hlbiBubyBjb2RlIGlzIHByZXNlbnQgKGNhdGFzdHJvcGhpY1xuICAgIC8vIGlsbG5lc3Mgcm93cyBmcm9tIElIS0UzMjA5IGNhcnJ5IHRoZSBDaGluZXNlIG5hcnJhdGl2ZSBvbmx5KS4gTWlycm9yc1xuICAgIC8vIHRoZSBzYW1lIGBjb2RlIHx8IGRpc3BsYXlgIHBhdHRlcm4gaW4gZGlhZ25vc3RpYy1yZXBvcnQudHMgYW5kXG4gICAgLy8gYWxsZXJneS50cyBcdTIwMTQgYXZvaWRzIGhhc2ggY29sbGlzaW9ucyBiZXR3ZWVuIHR3byBzYW1lLWRheSBjb2RlLWxlc3NcbiAgICAvLyBjb25kaXRpb25zLlxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3Lm9uc2V0X2RhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY2xpbmljYWxTdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLWNsaW5pY2FsXCIsXG4gICAgICAgICAgY29kZTogcmF3LmNsaW5pY2FsX3N0YXR1cyA/PyBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9jb25kaXRpb24tdmVyLXN0YXR1c1wiLFxuICAgICAgICAgIGNvZGU6IFwiY29uZmlybWVkXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH07XG5cbiAgLy8gQ2F0ZWdvcnkgcm91dGVzIHRoZSBDb25kaXRpb24gaW50byB0aGUgcmlnaHQgZG93bnN0cmVhbSB2aWV3LlxuICAvLyAtIFwicHJvYmxlbS1saXN0LWl0ZW1cIiBcdTIxOTIgU01BUlQgLyBJUFMgUHJvYmxlbSBMaXN0IHNlY3Rpb25cbiAgLy8gLSBcImVuY291bnRlci1kaWFnbm9zaXNcIiBcdTIxOTIgcGVyLWVuY291bnRlciBkaWFnbm9zZXNcbiAgLy8gLSBcImhlYWx0aC1jb25jZXJuXCIgXHUyMTkyIElQUyBIZWFsdGggQ29uY2VybnNcbiAgLy8gQWRhcHRlci1sZXZlbCBkZWNpc2lvbjogXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1IHJvd3MgbWFyayBjYXRlZ29yeT1cInByb2JsZW0tbGlzdC1pdGVtXCI7XG4gIC8vIGdlbmVyaWMgZW5jb3VudGVyLWRlcml2ZWQgY29uZGl0aW9ucyBjYW4gb21pdCwgZGVmYXVsdGluZyB0byBub1xuICAvLyBleHBsaWNpdCBjYXRlZ29yeSAoU01BUlQgYXBwcyBmYWxsIHRocm91Z2ggdG8gYWxsLWNvbmRpdGlvbnMgdmlldykuXG4gIGlmIChyYXcuY2F0ZWdvcnkpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiByYXcuY2F0ZWdvcnksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIHJlc291cmNlLmNvZGUgPSB7XG4gICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICB0ZXh0OiBkaXNwbGF5LFxuICB9O1xuXG4gIGNvbnN0IHNldmVyaXR5ID0gcmF3LnNldmVyaXR5ID8/IFwiXCI7XG4gIGlmIChzZXZlcml0eSkge1xuICAgIHJlc291cmNlLnNldmVyaXR5ID0geyB0ZXh0OiBzZXZlcml0eSB9O1xuICB9XG5cbiAgaWYgKHJhdy5vbnNldF9kYXRlKSB7XG4gICAgcmVzb3VyY2Uub25zZXREYXRlVGltZSA9IGAke3Jhdy5vbnNldF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIERpYWdub3N0aWNSZXBvcnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9kaWFnbm9zdGljX3JlcG9ydC5weWAuIFJldHVybnMgbnVsbCBmb3JcbiAqIGxpc3QtcGFnZSByb3dzIGxhY2tpbmcgYSBjb25jbHVzaW9uLCBhbmQgZm9yIGxhYi12YWx1ZS1vbmx5IFwicmVwb3J0c1wiXG4gKiB0aGF0IHdvdWxkIGR1cGxpY2F0ZSBhIHByb3BlciBPYnNlcnZhdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBWMl8wMDc0ID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIjtcblxuY29uc3QgQ0FURUdPUllfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBMQUI6IFtWMl8wMDc0LCBcIkxBQlwiLCBcIkxhYm9yYXRvcnlcIl0sXG4gIFJBRDogW1YyXzAwNzQsIFwiUkFEXCIsIFwiUmFkaW9sb2d5XCJdLFxuICBDQVI6IFtWMl8wMDc0LCBcIkNBUlwiLCBcIkNhcmRpb2xvZ3lcIl0sXG4gIFBBVEg6IFtWMl8wMDc0LCBcIlBBVFwiLCBcIlBhdGhvbG9neVwiXSxcbn07XG5cbi8vIExhYi1yZXN1bHQgcGF0dGVybnMgdGhhdCBsb29rIGxpa2Ugc2luZ2xlLXZhbHVlIGxhYiByZWFkaW5ncyByYXRoZXJcbi8vIHRoYW4gYSBuYXJyYXRpdmUgcmVwb3J0LlxuY29uc3QgTEFCX1VOSVRfUkUgPVxuICAvXFxkKyg/OlxcLlxcZCspP1xccyooPzolfG1nXFwvZEx8Z1xcL2RMfG1tb2xcXC9MfFVcXC9MfElVXFwvTHxtSVVcXC9MfG5nXFwvbUx8XHUwM0JDZ1xcL2RMfHVnXFwvZEx8cGdcXC9tTHxmTHxcXC91THwxMFxcXj9cXGQrXFwvdUx8eDEwXFxeP1xcZCtcXC91THxzZWN8XHU3OUQyfGNvcGllc1xcL21MKS87XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgdGV4dCA9IGNvbmNsdXNpb24udHJpbSgpO1xuICAvLyBSZWFsIG5hcnJhdGl2ZSByZXBvcnRzIGFsbW9zdCBhbHdheXMgY29udGFpbiBtdWx0aXBsZSBzZW50ZW5jZXMuXG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDEwMCkgcmV0dXJuIGZhbHNlO1xuICAvLyBTaW5nbGUgdmFsdWUgcGF0dGVybiArIHBhcmVudGhldGljYWwgcmVmZXJlbmNlIHJhbmdlID0gbGFiIGxpbmUuXG4gIGlmIChMQUJfVU5JVF9SRS50ZXN0KHRleHQpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwRGlhZ25vc3RpY1JlcG9ydChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgY29uY2x1c2lvbiA9ICgocmF3LmNvbmNsdXNpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY2F0S2V5UmF3ID0gU3RyaW5nKHJhdy5jYXRlZ29yeSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAoY2F0S2V5UmF3ID09PSBcIkxBQlwiICYmIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBSZXBvcnRcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW1IaW50ID0gcmF3LnN5c3RlbSA/PyBcIlwiO1xuICBjb25zdCBzeXN0ZW0gPVxuICAgIHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiICYmIHN5c3RlbUhpbnQudG9VcHBlckNhc2UoKSA9PT0gXCJMT0lOQ1wiXG4gICAgICA/IHN5c3RlbXMuTE9JTkNcbiAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfUkVQT1JUX0NPREU7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJmaW5hbFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgICBjb25jbHVzaW9uLFxuICB9O1xuXG4gIGNvbnN0IGNhdEVudHJ5ID0gQ0FURUdPUllfTUFQW2NhdEtleVJhd107XG4gIGlmIChjYXRFbnRyeSkge1xuICAgIGNvbnN0IFtjYXRTeXMsIGNhdENvZGUsIGNhdERpc3BsYXldID0gY2F0RW50cnk7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbeyBjb2Rpbmc6IFt7IHN5c3RlbTogY2F0U3lzLCBjb2RlOiBjYXRDb2RlLCBkaXNwbGF5OiBjYXREaXNwbGF5IH1dIH1dO1xuICB9XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcuaXNzdWVkKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3Lmlzc3VlZH1UMDA6MDA6MDArMDg6MDBgO1xuICB9IGVsc2UgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IGhvc3BpdGFsIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogRW5jb3VudGVyIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZW5jb3VudGVyLnB5YC4gU3RhYmxlIElEIGluY2x1ZGVzIGhvc3BpdGFsXG4gKiBzbyBzYW1lLWRheSB2aXNpdHMgdG8gZGlmZmVyZW50IGluc3RpdHV0aW9ucyBlYWNoIGdldCB0aGVpciBvd25cbiAqIEVuY291bnRlciAodGhlIHBvc3QtbWFwcGluZyBsaW5rZXIgZGVwZW5kcyBvbiB0aGlzKS5cbiAqL1xuXG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUNUQ09ERV9TWVNURU0gPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtQWN0Q29kZVwiO1xuXG5jb25zdCBDTEFTU19NQVA6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4gPSB7XG4gIEFNQjogW0FDVENPREVfU1lTVEVNLCBcIkFNQlwiLCBcImFtYnVsYXRvcnlcIl0sXG4gIElNUDogW0FDVENPREVfU1lTVEVNLCBcIklNUFwiLCBcImlucGF0aWVudCBlbmNvdW50ZXJcIl0sXG4gIEVNRVI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJFTUVSXCIsIFwiZW1lcmdlbmN5XCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEVuY291bnRlcihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGVuY0NsYXNzID0gU3RyaW5nKHJhdy5jbGFzcyA/PyBcIkFNQlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjbGFzc0VudHJ5ID0gQ0xBU1NfTUFQW2VuY0NsYXNzXSA/PyBDTEFTU19NQVAuQU1CITtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiRW5jb3VudGVyXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgcmF3LmRhdGUgPz8gXCJcIiwgZW5jQ2xhc3MsICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmlzaGVkXCIsXG4gICAgY2xhc3M6IHtcbiAgICAgIHN5c3RlbTogY2xhc3NFbnRyeVswXSxcbiAgICAgIGNvZGU6IGNsYXNzRW50cnlbMV0sXG4gICAgICBkaXNwbGF5OiBjbGFzc0VudHJ5WzJdLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICAvLyBOSEkncyBlbmNvdW50ZXIgXCJ0eXBlXCIgbWFya2VycyBcdTIwMTQgJ0lDXHU1MzYxXHU4Q0M3XHU2NTk5JyAvICdcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTknIC8gJ1x1NEY0Rlx1OTY2MidcbiAgLy8gXHUyMDE0IGFyZSBkYXRhLW9yaWdpbiBsYWJlbHMsIG5vdCBTTk9NRUQgY2xpbmljYWwgdHlwZXMuIEtlZXAgdGhlbSBhc1xuICAvLyBDb2RlYWJsZUNvbmNlcHQudGV4dCB3aXRob3V0IGNsYWltaW5nIFNOT01FRC5cbiAgY29uc3QgdHlwZURpc3BsYXkgPSAoKHJhdy50eXBlX2Rpc3BsYXkgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICh0eXBlRGlzcGxheSkge1xuICAgIHJlc291cmNlLnR5cGUgPSBbeyB0ZXh0OiB0eXBlRGlzcGxheSB9XTtcbiAgfVxuXG4gIGNvbnN0IHBlcmlvZDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBpZiAocmF3LmRhdGUpIHBlcmlvZC5zdGFydCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuZW5kX2RhdGUpIHBlcmlvZC5lbmQgPSBgJHtyYXcuZW5kX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKE9iamVjdC5rZXlzKHBlcmlvZCkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLnBlcmlvZCA9IHBlcmlvZDtcbiAgfVxuXG4gIGNvbnN0IGRlcGFydG1lbnQgPSByYXcuZGVwYXJ0bWVudCA/PyBcIlwiO1xuICBjb25zdCBwcm92aWRlciA9IHJhdy5wcm92aWRlciA/PyBcIlwiO1xuICBpZiAoZGVwYXJ0bWVudCB8fCBwcm92aWRlcikge1xuICAgIGNvbnN0IHBhcnRpY2lwYW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKHByb3ZpZGVyKSBwYXJ0aWNpcGFudC5pbmRpdmlkdWFsID0geyBkaXNwbGF5OiBwcm92aWRlciB9O1xuICAgIHJlc291cmNlLnBhcnRpY2lwYW50ID0gT2JqZWN0LmtleXMocGFydGljaXBhbnQpLmxlbmd0aCA+IDAgPyBbcGFydGljaXBhbnRdIDogW107XG4gICAgaWYgKGRlcGFydG1lbnQpIHtcbiAgICAgIHJlc291cmNlLnNlcnZpY2VUeXBlID0geyB0ZXh0OiBkZXBhcnRtZW50IH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2Uuc2VydmljZVByb3ZpZGVyID0geyBkaXNwbGF5OiBob3NwaXRhbCB9O1xuICB9XG5cbiAgY29uc3QgcmVhc29uID0gcmF3LnJlYXNvbiA/PyBcIlwiO1xuICBpZiAocmVhc29uKSB7XG4gICAgcmVzb3VyY2UucmVhc29uQ29kZSA9IFt7IHRleHQ6IHJlYXNvbiB9XTtcbiAgfVxuXG4gIGNvbnN0IGRpc2NoYXJnZSA9IHJhdy5kaXNjaGFyZ2VfZGlzcG9zaXRpb24gPz8gXCJcIjtcbiAgaWYgKGRpc2NoYXJnZSkge1xuICAgIHJlc291cmNlLmhvc3BpdGFsaXphdGlvbiA9IHsgZGlzY2hhcmdlRGlzcG9zaXRpb246IHsgdGV4dDogZGlzY2hhcmdlIH0gfTtcbiAgfVxuXG4gIGNvbnN0IGNsaW5pY2FsTm90ZSA9ICgocmF3LmNsaW5pY2FsX25vdGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChjbGluaWNhbE5vdGUpIHtcbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogY2xpbmljYWxOb3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogTWVkaWNhdGlvblJlcXVlc3QgbWFwcGVyICsgYmlsaW5ndWFsIGRlZHVwbGljYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL21lZGljYXRpb24ucHlgLiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHJlcG9ydHMgdGhlXG4gKiBTQU1FIHByZXNjcmlwdGlvbiBtdWx0aXBsZSB0aW1lcyAoRW5nbGlzaC1vbmx5IC8gRW5nK1x1NEUyRCAvIFx1NEUyRCtFbmcpLlxuICogYG1hcE1lZGljYXRpb25zRGVkdXBgIGNvbGxhcHNlcyB0aGVzZSB0byBvbmUgTWVkaWNhdGlvblJlcXVlc3QgcGVyXG4gKiAoZGF0ZSwgY2Fub25pY2FsLWRydWcta2V5KSwgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIG1vcmUgQ0pLIGNoYXJzXG4gKiAoY2xpbmljaWFucyByZWFkIFx1NTU0Nlx1NTRDMVx1NTQwRCBmaXJzdCkuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBub3JtYWxpemVJY2QxMENtIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gaXNDamsoY2g6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTRFMDAgKFUrNEUwMCkgdG8gXHU5RkZGIChVKzlGRkYpIGNvdmVycyBDSksgVW5pZmllZCBJZGVvZ3JhcGhzLlxuICBjb25zdCBjcCA9IGNoLmNvZGVQb2ludEF0KDApID8/IDA7XG4gIHJldHVybiBjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmO1xufVxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgaWYgKCFzKSByZXR1cm4gMDtcbiAgbGV0IG4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIGlmIChpc0NqayhjaCkpIG4rKztcbiAgcmV0dXJuIG47XG59XG5cbi8qKlxuICogTWF0Y2ggYSBcImxvbmdcIiBFbmdsaXNoIGNodW5rIChcdTIyNjU0IGNoYXJzIG9mIEEtWi8wLTkvcHVuY3R1YXRpb24gY29tbW9uXG4gKiB0byBkcnVnIG5hbWVzKS4gQXZvaWQgbWF0Y2hpbmcgc2hvcnQgdG9rZW5zIGxpa2UgXCJEXCIgb3IgXCJQT1wiIHRoYXRcbiAqIGFwcGVhciBpbnNpZGUgQ2hpbmVzZSBuYW1lcy5cbiAqL1xuY29uc3QgRU5fQ0hVTktfRyA9IC9bQS1aXVtBLVowLTkuJS9cXC1cIidcXHNdezMsfS9nO1xuXG4vKipcbiAqIFJlZHVjZSBhIGRydWctbmFtZSBzdHJpbmcgdG8gYSBzdGFibGUgY2Fub25pY2FsIGtleS4gRXh0cmFjdCB0aGVcbiAqIGxvbmdlc3QgRW5nbGlzaCBmcmFnbWVudCwgdGhlbiB0cnVuY2F0ZSBhdCBjb21tb24gc2VwYXJhdG9ycyBzbyBhXG4gKiBuYW1lIHdpdGggZXh0cmEgdHJhaWxpbmcgbW9kaWZpZXJzIHN0aWxsIGNvbGxhcHNlcyB0byBicmFuZCtzdHJlbmd0aC5cbiAqXG4gKiBFeGFtcGxlcyAoYWxsIG1hcCB0byBcInRpbW9wdG9sIHhlIDAuNSUgb3BodGhhbG1pYyBzb2x1dGlvblwiKTpcbiAqICAgXCJUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT05cIlxuICogICBcIlRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTiAoXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2KVwiXG4gKiAgIFwiXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2IChUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT04pXCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbERydWdLZXkobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAobmFtZSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjaHVua3MgPSBbLi4ucy5tYXRjaEFsbChFTl9DSFVOS19HKV0ubWFwKChtKSA9PiBtWzBdKTtcbiAgaWYgKGNodW5rcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKG5hbWUgPz8gXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgbGV0IGxvbmdlc3QgPSBjaHVua3MucmVkdWNlKChhLCBiKSA9PiAoYi5sZW5ndGggPiBhLmxlbmd0aCA/IGIgOiBhKSkudHJpbSgpO1xuICBmb3IgKGNvbnN0IHNlcCBvZiBbXCIgLSBcIiwgXCIgXHUyMDEzIFwiLCBcIiAvIFwiXSkge1xuICAgIGlmIChsb25nZXN0LmluY2x1ZGVzKHNlcCkpIHtcbiAgICAgIGxvbmdlc3QgPSBsb25nZXN0LnNwbGl0KHNlcClbMF0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbG9uZ2VzdC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBCZXN0LWVmZm9ydCBhY3RpdmUgdnMgY29tcGxldGVkIGRlY2lzaW9uIGZvciBhIE1lZGljYXRpb25SZXF1ZXN0LlxuICogQWN0aXZlIHdoaWxlIChhdXRob3JlZF9kYXRlICsgZHVyYXRpb24gPiB0b2RheSk7IG90aGVyd2lzZSBjb21wbGV0ZWQuXG4gKiBNaXNzaW5nIGR1cmF0aW9uIFx1MjE5MiBhc3N1bWUgOTAtZGF5IHJlZmlsbCB3aW5kb3cgKE5ISSdzIHR5cGljYWwgY2FkZW5jZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZWRTdGF0dXMoXG4gIGF1dGhvcmVkSXNvOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkdXJhdGlvbkRheXM6IGFueSxcbik6IFwiYWN0aXZlXCIgfCBcImNvbXBsZXRlZFwiIHtcbiAgaWYgKCFhdXRob3JlZElzbykgcmV0dXJuIFwiY29tcGxldGVkXCI7XG4gIGNvbnN0IGRhdGVQYXJ0ID0gU3RyaW5nKGF1dGhvcmVkSXNvKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IHBhcnNlZCA9IG5ldyBEYXRlKGAke2RhdGVQYXJ0fVQwMDowMDowMFpgKTtcbiAgaWYgKE51bWJlci5pc05hTihwYXJzZWQuZ2V0VGltZSgpKSkgcmV0dXJuIFwiY29tcGxldGVkXCI7XG5cbiAgbGV0IGRheXM6IG51bWJlciB8IG51bGw7XG4gIGlmIChkdXJhdGlvbkRheXMgPT09IG51bGwgfHwgZHVyYXRpb25EYXlzID09PSB1bmRlZmluZWQgfHwgZHVyYXRpb25EYXlzID09PSBcIlwiKSB7XG4gICAgZGF5cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbiA9IE51bWJlci5wYXJzZUludChTdHJpbmcoZHVyYXRpb25EYXlzKSwgMTApO1xuICAgIGRheXMgPSBOdW1iZXIuaXNGaW5pdGUobikgPyBuIDogbnVsbDtcbiAgfVxuICBpZiAoZGF5cyA9PT0gbnVsbCkgZGF5cyA9IDkwO1xuXG4gIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHBhcnNlZC5nZXRUaW1lKCkpO1xuICBlbmQuc2V0VVRDRGF0ZShlbmQuZ2V0VVRDRGF0ZSgpICsgZGF5cyk7XG4gIC8vIENvbXBhcmUgZGF0ZS1vbmx5ICh0b2RheSBpbiBVVEMgc2luY2Ugd2UgYXV0aG9yZWRJc28gaXMgZGF0ZS1vbmx5KS5cbiAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICB0b2RheS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGVuZCA+PSB0b2RheSA/IFwiYWN0aXZlXCIgOiBcImNvbXBsZXRlZFwiO1xufVxuXG4vKipcbiAqIENvbnZlcnQgb25lIHNjcmFwZWQgcHJlc2NyaXB0aW9uIGRpY3QgXHUyMTkyIEZISVIgUjQgTWVkaWNhdGlvblJlcXVlc3QuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiByYXcgaGFzIG5vIGBkcnVnX25hbWVgIChjYWxsZXIgZmlsdGVycyBvdXQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTWVkaWNhdGlvblJlcXVlc3QoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGRydWdOYW1lID0gKChyYXcuZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWRydWdOYW1lKSByZXR1cm4gbnVsbDtcblxuICAvLyBDYW5vbmljYWwga2V5IChub3QgcmF3IGRydWdfbmFtZSkgZm9yIHN0YWJsZSBpZCBzbyB0aGUgdGhyZWUgTkhJXG4gIC8vIFx1NEUyRFx1ODJGMSB2YXJpYW50cyBvZiB0aGUgc2FtZSBkcnVnIGNvbGxhcHNlIHRvIG9uZSBGSElSIHJlc291cmNlLlxuICBjb25zdCBtZWRJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSksIHJhdy5kYXRlID8/IFwiXCIpO1xuXG4gIGNvbnN0IGRydWdDb2RlID0gKChyYXcuY29kZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgY29kaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIHN5c3RlbTogZHJ1Z0NvZGUgPyBzeXN0ZW1zLk5ISV9EUlVHX0NPREUgOiBzeXN0ZW1zLkhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUsXG4gICAgY29kZTogZHJ1Z0NvZGUgfHwgZHJ1Z05hbWUsXG4gICAgZGlzcGxheTogZHJ1Z05hbWUsXG4gIH07XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gICAgaWQ6IG1lZElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IG1lZFN0YXR1cyhyYXcuZGF0ZSA/PyBcIlwiLCByYXcuZHVyYXRpb25fZGF5cyksXG4gICAgaW50ZW50OiBcIm9yZGVyXCIsXG4gICAgbWVkaWNhdGlvbkNvZGVhYmxlQ29uY2VwdDoge1xuICAgICAgY29kaW5nOiBbY29kaW5nXSxcbiAgICAgIHRleHQ6IGRydWdOYW1lLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5hdXRob3JlZE9uID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGRydWdDbGFzcyA9ICgocmF3LmRydWdfY2xhc3MgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChkcnVnQ2xhc3MpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFt7IHRleHQ6IGRydWdDbGFzcyB9XTtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnJlcXVlc3RlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIC8vIERvc2FnZSBcdTIwMTQgb25seSB3aGVuIHNvdXJjZSBhY3R1YWxseSBoYXMgaXQuIE5ISSdzIG1lZGljYXRpb24tbGlzdFxuICAvLyBlbmRwb2ludCBwcm92aWRlcyBub25lIG9mIHRoZXNlOyBvdGhlciBISVMgYWRhcHRlcnMgZ2V0IGFcbiAgLy8gc3RydWN0dXJlZCBkb3NhZ2Ugb3V0LlxuICBjb25zdCBkb3NhZ2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgayBvZiBbXCJkb3NlXCIsIFwidW5pdFwiLCBcImZyZXF1ZW5jeVwiXSBhcyBjb25zdCkge1xuICAgIGlmIChyYXdba10pIHBhcnRzLnB1c2goU3RyaW5nKHJhd1trXSkpO1xuICB9XG4gIGlmIChwYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgZG9zYWdlLnRleHQgPSBwYXJ0cy5qb2luKFwiIFwiKTtcbiAgfVxuICBpZiAocmF3LnJvdXRlKSB7XG4gICAgZG9zYWdlLnJvdXRlID0ge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW06IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiLCBkaXNwbGF5OiByYXcucm91dGUgfV0sXG4gICAgfTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMoZG9zYWdlKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UuZG9zYWdlSW5zdHJ1Y3Rpb24gPSBbZG9zYWdlXTtcbiAgfVxuXG4gIC8vIGRpc3BlbnNlUmVxdWVzdCB3aXRoIHF1YW50aXR5ICsgc3VwcGx5IGR1cmF0aW9uIHdoZW4gcHJlc2VudC5cbiAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcXR5UmF3ID0gcmF3LnF1YW50aXR5O1xuICBpZiAocXR5UmF3ICE9PSBudWxsICYmIHF0eVJhdyAhPT0gdW5kZWZpbmVkICYmIHF0eVJhdyAhPT0gXCJcIikge1xuICAgIGNvbnN0IHF0eU51bSA9IE51bWJlci5wYXJzZUZsb2F0KFN0cmluZyhxdHlSYXcpLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocXR5TnVtKSkge1xuICAgICAgZHIucXVhbnRpdHkgPSB7IHZhbHVlOiBxdHlOdW0gfTtcbiAgICB9XG4gIH1cbiAgaWYgKHJhdy5kdXJhdGlvbl9kYXlzKSB7XG4gICAgY29uc3QgZGF5cyA9IE51bWJlci5wYXJzZUludChTdHJpbmcocmF3LmR1cmF0aW9uX2RheXMpLCAxMCk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShkYXlzKSkge1xuICAgICAgZHIuZXhwZWN0ZWRTdXBwbHlEdXJhdGlvbiA9IHtcbiAgICAgICAgdmFsdWU6IGRheXMsXG4gICAgICAgIHVuaXQ6IFwiZGF5c1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiBcImRcIixcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkcikubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRpc3BlbnNlUmVxdWVzdCA9IGRyO1xuICB9XG5cbiAgY29uc3QgaW5kaWNhdGlvbiA9ICgocmF3LmluZGljYXRpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25Db2RlID0gKChyYXcuaW5kaWNhdGlvbl9jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uQ29kZSkge1xuICAgIGNvbnN0IHJjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGluZGljYXRpb25Db2RlKSB7XG4gICAgICByYy5jb2RpbmcgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IHN5c3RlbXMuSUNEXzEwX0NNLFxuICAgICAgICAgIGNvZGU6IG5vcm1hbGl6ZUljZDEwQ20oaW5kaWNhdGlvbkNvZGUpLFxuICAgICAgICAgIGRpc3BsYXk6IGluZGljYXRpb24gfHwgaW5kaWNhdGlvbkNvZGUsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAoaW5kaWNhdGlvbikge1xuICAgICAgcmMudGV4dCA9IGluZGljYXRpb25Db2RlID8gYCR7aW5kaWNhdGlvbkNvZGV9ICR7aW5kaWNhdGlvbn1gLnRyaW0oKSA6IGluZGljYXRpb247XG4gICAgfVxuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbcmNdO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIEdyb3VwLWF3YXJlIG1lZGljYXRpb24gbWFwcGVyIHRoYXQgZGVkdXBlcyBcdTRFMkRcdTgyRjEgXHU5NkQ5XHU4QTlFIGR1cGxpY2F0ZXMuXG4gKlxuICogU3RyYXRlZ3k6XG4gKiAgIDEuIENvbXB1dGUgY2Fub25pY2FsIGtleSBwZXIgZHJ1ZyBuYW1lIChsb25nZXN0IEVuZ2xpc2ggY2h1bmspLlxuICogICAyLiBHcm91cCBieSAoZGF0ZSwgY2Fub25pY2FsX2tleSkuIEtlZXAgT05FIGVudHJ5IHBlciBncm91cCxcbiAqICAgICAgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGJyYW5kXG4gKiAgICAgIG5hbWUgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZpcnN0KS5cbiAqICAgMy4gTWFwIGVhY2gga2VwdCBlbnRyeSB0aHJvdWdoIG1hcE1lZGljYXRpb25SZXF1ZXN0LlxuICpcbiAqIE5vdGU6IFB5dGhvbiBjb21tZW50IHNheXMgXCJtb3JlIENKS1wiIGJ1dCB0aGUgY29kZSB1c2VzIGA8YCAoZmV3ZXIpO1xuICogd2UgcHJlc2VydmUgdGhlIGFjdHVhbCBjb2RlIGJlaGF2aW91ciB0byBrZWVwIHBhcml0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25zRGVkdXAocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGZvciAoY29uc3QgaXRlbSBvZiByYXdJdGVtcykge1xuICAgIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZHJ1Z05hbWUgPSAoKGl0ZW0uZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGlmICghZHJ1Z05hbWUpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRhdGVQYXJ0ID0gKChpdGVtLmRhdGUgPz8gXCJcIikgYXMgc3RyaW5nKS5zbGljZSgwLCAxMCk7XG4gICAgY29uc3Qga2V5ID0gYCR7ZGF0ZVBhcnR9fCR7Y2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSl9YDtcbiAgICBjb25zdCBleGlzdGluZyA9IGJ5S2V5LmdldChrZXkpO1xuICAgIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUHJlZmVyIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmQgbmFtZSkuXG4gICAgICBpZiAoY2prQ2hhcnMoZHJ1Z05hbWUpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZHJ1Z19uYW1lID8/IFwiXCIpKSB7XG4gICAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBieUtleS52YWx1ZXMoKSkge1xuICAgIGNvbnN0IG0gPSBtYXBNZWRpY2F0aW9uUmVxdWVzdChpdGVtLCBwYXRpZW50SWQpO1xuICAgIGlmIChtICE9PSBudWxsKSBvdXQucHVzaChtKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwgIi8qKlxuICogTE9JTkMgbWFwcGluZyB0YWJsZXMgZm9yIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIExPSU5DIFI0IGNvZGluZ3MuXG4gKlxuICogUHVyZSBkYXRhLCBubyBsb2dpYy4gUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19sb2luY190YWJsZXMucHlgLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBfTkhJX1RPX0xPSU5DIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgcHJpbWFyeSBMT0lOQyBtYXBwaW5nLiBTb3VyY2Ugb2YgdHJ1dGg6XG4vLyBUV05ISUZISVIgUEFTIEltcGxlbWVudGF0aW9uIEd1aWRlIENvbmNlcHRNYXAtbmhpLWxvaW5jXG4vLyBodHRwczovL2J1aWxkLmZoaXIub3JnL2lnL1RXTkhJRkhJUi9wYXMvQ29uY2VwdE1hcC1uaGktbG9pbmMuaHRtbFxuLy9cbi8vIFRoYXQgQ29uY2VwdE1hcCBkZWNsYXJlcyA1MyBOSEkgY29kZXMgd2l0aCBgZXF1aXZhbGVuY2U6IHJlbGF0ZWR0b2Bcbi8vIGFnYWluc3QgODA2IExPSU5DIHZhcmlhbnRzIChkaWZmZXJlbnQgc3BlY2ltZW5zIC8gdW5pdHMgLyBtZXRob2RzXG4vLyBwZXIgTkhJIGNvZGUgXHUyMDE0IGNvbmZpcm1pbmcgdGhlIFwiTkhJIGlzIGNvYXJzZSwgTE9JTkMgaXMgZmluZVwiIHZpZXcpLlxuLy8gRm9yIGVhY2ggTkhJIGNvZGUgd2UgaGFuZC1waWNrIHRoZSBjYW5vbmljYWwgTE9JTkMgbW9zdCBjbGluaWNpYW5zXG4vLyB3b3VsZCBleHBlY3QgaW4gYSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgbGFiIHJlcG9ydDogU2VydW0vUGxhc21hICsgTWFzcy12b2x1bWVcbi8vIChvciBhdXRvLWNvdW50IGZvciBjZWxsIGNvdW50ZXJzKS4gRWRnZSBjYXNlcyBub3RlZCBpbmxpbmUuXG5leHBvcnQgY29uc3QgTkhJX1RPX0xPSU5DOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgSGFlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDJDXCI6IFwiNjY5MC0yXCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3OCBcdTIwMTQgTGV1a29jeXRlcyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMDNDXCI6IFwiNzE4LTdcIiwgLy8gXHU4ODQwXHU4MjcyXHU3RDIwXHU2QUEyXHU2N0U1IFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIEJsb29kXG4gIFwiMDgwMDZDXCI6IFwiNzc3LTNcIiwgLy8gXHU4ODQwXHU1QzBGXHU2NzdGXHU4QTA4XHU2NTc4IFx1MjAxNCBQbGF0ZWxldHMgIy92b2wgQmxvb2QgQXV0b1xuICBcIjA4MDEzQ1wiOiBcIjU3MDIxLThcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4IFx1MjAxNCBDQkMgVyBBdXRvIERpZmYgcGFuZWxcbiAgXCIwODEyOEJcIjogXCI0NzI4Ni0wXCIsIC8vIFx1OUFBOFx1OUFEM1x1N0QzMFx1ODBERVx1NUY2Mlx1NjE0Qlx1NTIyNFx1OEI4MFx1NTQwOFx1NEY3NVx1N0QzMFx1ODBERVx1NTIwNlx1OTg1RVx1OEEwOFx1NjU3OFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDExQ1wiOiBcIjE3ODYxLTZcIiwgLy8gXHU5MjIzIFx1MjAxNCBDYWxjaXVtIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDE1Q1wiOiBcIjIxNjAtMFwiLCAvLyBcdTgwOENcdTkxNzhcdTkxNTBcdTMwMDFcdTg4NDAgXHUyMDE0IENyZWF0aW5pbmUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMTZDXCI6IFwiMjE2MS04XCIsIC8vIFx1ODA4Q1x1OTE1MFx1MzAwMVx1NUMzRiBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBVcmluZVxuICBcIjA5MDI1Q1wiOiBcIjE5MjAtOFwiLCAvLyBBU1QvR09UIFx1MjAxNCBBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjZDXCI6IFwiMTc0Mi02XCIsIC8vIEFMVC9HUFQgXHUyMDE0IEFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjlDXCI6IFwiMTk3NS0yXCIsIC8vIFx1ODFCRFx1N0QwNVx1N0QyMFx1N0UzRFx1OTFDRiBcdTIwMTQgQmlsaXJ1YmluIHRvdGFsIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDMwQ1wiOiBcIjE5NjgtN1wiLCAvLyBcdTc2RjRcdTYzQTVcdTgxQkRcdTdEMDVcdTdEMjAgXHUyMDE0IEJpbGlydWJpbiBkaXJlY3QgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzNDXCI6IFwiMjUzMi0wXCIsIC8vIFx1NEU3M1x1OTE3OFx1ODEyQlx1NkMyQlx1ODEyMiBcdTIwMTQgTERIIEFjdGl2aXR5IFMvUFxuICBcIjA5MDM4Q1wiOiBcIjE3NTEtN1wiLCAvLyBcdTc2N0RcdTg2Q0JcdTc2N0QgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzhDXCI6IFwiMzU2NzItNVwiLCAvLyBcdTc2RjRcdTYzQTUvXHU3RTNEXHU4MUJEXHU3RDA1XHU3RDIwXHU2QkQ0XHU1MDNDXG4gIFwiMTIxMTJCXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RChcdTUxNERcdTc1QUJcdTZCRDRcdTZGQzFcdTZDRDUpIFx1MjAxNCBBbGJ1bWluIE1hc3Mvdm9sIFMvUFxuICBcIjI0MDA3QlwiOiBcIjE5OTUtMFwiLCAvLyBcdTg4NDBcdTZGM0ZcdTZFMzhcdTk2RTJcdTkyMjMgXHUyMDE0IENhbGNpdW0gaW9uaXplZCBNb2xlcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBIb3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyMUNcIjogXCIyOTg2LThcIiwgLy8gXHU3NzZBXHU0RTM4XHU5MTZGXHU5MTg3XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgTWFzcy92b2wgUy9QXG4gIFwiMjcwMjFCXCI6IFwiMjk5MS04XCIsIC8vIFx1Nzc2QVx1NEUzOFx1ODEwMlx1OTE4N1x1NjUzRVx1NUMwNFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgVGVzdG9zdGVyb25lIEZyZWUgUy9QXG4gIC8vIDA5MTI1QyAvIDA5MTI3QyBjb3JyZWN0ZWQgYWZ0ZXIgZHVhbC1yZXZpZXdlciBhdWRpdCBcdTIwMTQgdGhlIGVhcmxpZXJcbiAgLy8gdmFsdWVzICgzMDE2LTMgd2FzIFRTSCwgMTA1MDEtNSB3YXMgTEgpIHdlcmUganVzdCB3cm9uZyBjb3B5LVxuICAvLyBwYXN0ZXMuIFNvdXJjZSBmb3IgdGhlIG5ldyB2YWx1ZXM6IFRXTkhJRkhJUiBQQVMgQ29uY2VwdE1hcC5cbiAgXCIwOTEyNUNcIjogXCI4MzA5OC00XCIsIC8vIFx1NkZGRVx1NkNFMVx1NTIzQVx1NkZDMFx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRm9sbGl0cm9waW4gKEZTSCkgSW1tdW5vYXNzYXkgUy9QXG4gIFwiMDkxMjdDXCI6IFwiODMwOTYtOFwiLCAvLyBcdTRFOENcdTZDMkJcdTU3RkFcdTY2MjVcdTYwQzVcdTdEMjBcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IEVzdHJhZGlvbCBJbW11bm9hc3NheSBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFR1bW9yIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDdDXCI6IFwiMTgzNC0xXCIsIC8vIFx1MDNCMS1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDQ5Q1wiOiBcIjE4MzQtMVwiLCAvLyBcdTc1MzItXHU4MENFXHU1MTUyXHU4NkNCXHU3NjdEIChBRlAsIFJJQSlcbiAgXCIxMjA4MUNcIjogXCI4MzExMi0zXCIsIC8vIFBTQSAoRUlBL0xJQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjEyMTk4Q1wiOiBcIjgzMTEzLTFcIiwgLy8gRnJlZSBQU0EgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjI3MDUyQ1wiOiBcIjI4NTctMVwiLCAvLyBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUYgKFBTQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDgzQlwiOiBcIjEwODg2LTBcIiwgLy8gXHU2RTM4XHU5NkUyUFNBIChSSUEpXG4gIFwiMTIwNTJCXCI6IFwiMTA4NzMtOFwiLCAvLyBcdTAzQjIyLVx1NUZBRVx1NzQwM1x1ODZDQlx1NzY3RFxuICAvLyBcdTI1MDBcdTI1MDAgSW1tdW5vbG9neSAvIHByb3RlaW5zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDY1QlwiOiBcIjkwOTkxLTFcIiwgLy8gXHU4NkNCXHU3NjdEXHU5NkZCXHU2Q0YzXHU1MjA2XHU2NzkwXG4gIC8vIDEyMDI4QiAvIDEyMDI5QiBJZ00gKHNlcnVtLCBpbW11bm9kaWZmdXNpb24gLyBuZXBoZWxvbWV0cnkpIFx1MjAxNCBwcmV2aW91c2x5XG4gIC8vIGJvdGggbWFwcGVkIHRvIExPSU5DIDE0MDAyLTAgd2hpY2ggaXMgYWN0dWFsbHkgJ0lnTSBbVW5pdHMvdm9sdW1lXSBpblxuICAvLyBDb3JkIGJsb29kJyAobmVvbmF0YWwgc3BlY2ltZW4sIHZlcmlmaWVkIGxvaW5jLm9yZy8xNDAwMi0wLykuIFdyb25nXG4gIC8vIHNwZWNpbWVuIGZvciBhbiBhZHVsdCBzZXJ1bSBvcmRlci4gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0b1xuICAvLyBOSEktY29kZS1vbmx5IGNvZGluZy4gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxMjEwM0JcIjogXCI5NTgwMS03XCIsIC8vIFx1NTE0RFx1NzVBQlx1OTZGQlx1NkNGM1x1NTIwNlx1Njc5MFxuICBcIjEyMTYwQlwiOiBcIjE1MTg5LTRcIiwgLy8gSWdHIFx1MDNCQS9cdTAzQkJcbiAgXCIxMjE3MUJcIjogXCIxNzM1MS04XCIsIC8vIFx1NjI5N1x1NTVEQ1x1NEUyRFx1NjAyN1x1NzQwM1x1N0QzMFx1ODBERVx1OENFQVx1NjI5N1x1OUFENCAoQU5DQSlcbiAgXCIxMjIwNEJcIjogXCIyMDU4NC05XCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1ODg2OFx1OTc2Mlx1NkExOVx1OEExOFxuICBcIjI1MDEzQlwiOiBcIjQ0NTk2LTVcIiwgLy8gXHU4N0EyXHU1MTQ5XHU1MjA3XHU3MjQ3XHU2QUEyXHU2N0U1XG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTQwMzBDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzFDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzJDXCI6IFwiNTE5Ni0xXCIsIC8vIEhCc0FnIChNYXNzL3ZvbClcbiAgXCIxNDA1MUNcIjogXCIxMzk1NS0wXCIsIC8vIEhDViBBYlxuICBcIjI3MDMzQ1wiOiBcIjUxOTctOVwiLCAvLyBIQnNBZyBSSUFcbiAgLy8gXHUyNTAwXHUyNTAwIFBhdGhvbG9neSAvIGN5dG9sb2d5IC8gSUhDIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMTk1QlwiOiBcIjE4NDc0LTdcIiwgLy8gSGVyLTIvbmV1IElTSFxuICBcIjI3MDYxQlwiOiBcIjE0MTMwLTlcIiwgLy8gXHU1MkQ1XHU2MEM1XHU2RkMwXHU3RDIwXHU2M0E1XHU1M0Q3XHU5QUQ0IChFUilcbiAgXCIyNzA2MkJcIjogXCIxMDg2MS0zXCIsIC8vIFx1OUVDM1x1OUFENFx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoUFIpXG4gIFwiMzAxMDNCXCI6IFwiODMwNTItMVwiLCAvLyBQRC1MMSBJSENcbiAgLy8gXHUyNTAwXHUyNTAwIEF1ZGlvbG9neSAvIHB1bG1vbmFyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNzAwOUJcIjogXCIyNDM0MS0wXCIsIC8vIFx1NEUwMFx1NkMyN1x1NTMxNlx1NzhCM1x1ODBCQVx1NzAzMFx1NjU2M1x1OTFDRlxuICBcIjIyMDAxQ1wiOiBcIjQ1NDk4LTNcIiwgLy8gXHU3RDE0XHU5N0YzXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMTVCXCI6IFwiNDU0OTgtM1wiLCAvLyBcdThBNTBcdTgwN0VcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgXCIyMjAyNUJcIjogXCI0NjUzMC0yXCIsIC8vIFx1ODFFQVx1OEExOFx1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gU1VQUExFTUVOVEFMIChub3QgaW4gUEFTIENvbmNlcHRNYXAgXHUyMDE0IGhhbmQtY3VyYXRlZCBmcm9tIGNvbW1vblxuICAvLyBOSEkgY29kZXMgc2VlbiBpbiBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EuIExPSU5DIHZlcmlmaWVkIGFnYWluc3QgbG9pbmMub3JnXG4gIC8vIGNhbm9uaWNhbCBuYW1lcy4gTWV0aG9kLXNwZWNpZmljIGNvZGVzIChlLmcuIGhzLUNSUCkgcGljayB0aGVcbiAgLy8gc3BlY2lmaWMgTE9JTkM7IGdlbmVyYWwtbWV0aG9kIGNvZGVzIHBpY2sgdGhlIG1vc3QgY29tbW9uIGZvcm0uXG4gIC8vIElmIFx1NTA2NVx1NEZERFx1N0Y3MiBwdWJsaXNoZXMgYW4gYXV0aG9yaXRhdGl2ZSBicm9hZGVyIENvbmNlcHRNYXAgbGF0ZXIsXG4gIC8vIHJlcGxhY2UgdGhpcyBzZWN0aW9uIGluIG9uZSBwYXNzLlxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgLyBIYkExYyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwNUNcIjogXCIxNTU4LTZcIiwgLy8gXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2IChHbHUtQUMpIFx1MjAxNCBGYXN0aW5nIGdsdWNvc2UgTWFzcy92b2wgUy9QXG4gIFwiMDkxNDBDXCI6IFwiMjM0NS03XCIsIC8vIFx1ODg0MFx1N0NENi1cdTk5MTBcdTVGOEMvXHU5NkE4XHU2QTVGIFx1MjAxNCBHbHVjb3NlIE1hc3Mvdm9sIFMvUCAoZ2VuZXJhbClcbiAgXCIwOTAwNkNcIjogXCI0NTQ4LTRcIiwgLy8gXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwIChIYkExYykgXHUyMDE0IEhlbW9nbG9iaW4gQTFjL0hnYi50b3RhbCBCbG9vZFxuICAvLyBcdTI1MDBcdTI1MDAgUmVuYWwgLyBlbGVjdHJvbHl0ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDJDXCI6IFwiMzA5NC0wXCIsIC8vIEJVTiBcdTIwMTQgVXJlYSBuaXRyb2dlbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxM0NcIjogXCIzMDg0LTFcIiwgLy8gVXJpYyBBY2lkIFx1MjAxNCBVcmF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAyMUNcIjogXCIyOTUxLTJcIiwgLy8gTmEgXHUyMDE0IFNvZGl1bSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMjJDXCI6IFwiMjgyMy0zXCIsIC8vIEsgIFx1MjAxNCBQb3Rhc3NpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDI0Q1wiOiBcIjIwMjgtOVwiLCAvLyBDTzIgXHUyMDE0IENhcmJvbiBkaW94aWRlIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAxMkNcIjogXCIyNzc3LTFcIiwgLy8gSW5vcmdhbmljIFAgXHUyMDE0IFBob3NwaGF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NkJcIjogXCIxOTEyMy05XCIsIC8vIE1nIFx1MjAxNCBNYWduZXNpdW0gTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXBpZCBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwMUNcIjogXCIyMDkzLTNcIiwgLy8gVC1DaG9sZXN0ZXJvbCBcdTIwMTQgQ2hvbGVzdGVyb2wgTWFzcy92b2wgUy9QXG4gIFwiMDkwMDRDXCI6IFwiMjU3MS04XCIsIC8vIFRHIFx1MjAxNCBUcmlnbHljZXJpZGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDNDXCI6IFwiMjA4NS05XCIsIC8vIEhETCBcdTIwMTQgSERMIGNob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQ0Q1wiOiBcIjEzNDU3LTdcIiwgLy8gTERMIFx1MjAxNCBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGl2ZXIgZnVuY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMjdDXCI6IFwiNjc2OC02XCIsIC8vIEFMSy1QIFx1MjAxNCBBbGthbGluZSBwaG9zcGhhdGFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzMUNcIjogXCIyMzI0LTJcIiwgLy8gXHUwM0IzLUdUIFx1MjAxNCBHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzNUNcIjogXCIyNTAwLTdcIiwgLy8gVElCQyBcdTIwMTQgSXJvbiBiaW5kaW5nIGNhcGFjaXR5IE1hc3Mvdm9sIFMvUFxuICAvLyAwOTAzN0MgXHU4ODQwXHU2QzI4IFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAxODI3LTUgd2hpY2ggaXMgYWN0dWFsbHlcbiAgLy8gJ0FscGhhIDEgYW50aXRyeXBzaW4gTVMgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEnICh2ZXJpZmllZFxuICAvLyBsb2luYy5vcmcvMTgyNy01LykuIFdyb25nIGFuYWx5dGUgZW50aXJlbHkuIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzXG4gIC8vIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuIFNlZSBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWQuXG4gIFwiMDkwNjRDXCI6IFwiMzA0MC0zXCIsIC8vIExpcGFzZSBcdTIwMTQgQWN0aXZpdHkgUy9QXG4gIFwiMDkwNTlCXCI6IFwiMTQxMTgtNFwiLCAvLyBMYWN0YXRlIFx1MjAxNCBNYXNzL3ZvbCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgZXh0cmFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA4MDA0Q1wiOiBcIjQ1NDQtM1wiLCAvLyBIQ1QgXHUyMDE0IEhlbWF0b2NyaXQgdm9sdW1lIGZyYWN0aW9uIEJsb29kXG4gIFwiMDgwMDhDXCI6IFwiMTQxOTYtMFwiLCAvLyBSZXRpY3Vsb2N5dGUgXHUyMDE0IFJldGljdWxvY3l0ZXMvMTAwIFJCQ1xuICBcIjA4MDEwQ1wiOiBcIjcxMS0yXCIsIC8vIEVvc2lub3BoaWwgY291bnQgXHUyMDE0ICMvdm9sIEJsb29kXG4gIFwiMDgwMTFDXCI6IFwiMjQzMTctMFwiLCAvLyBDQkMgcGFuZWwgXHUyMDE0IEhlbWF0b2xvZ3kgcGFuZWwgQmxvb2RcbiAgXCIwODAyNkNcIjogXCI2MzAxLTZcIiwgLy8gUFQvSU5SIFx1MjAxNCBJTlIgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODAzNkNcIjogXCIxNDk3OS05XCIsIC8vIEFQVFQgXHUyMDE0IFBsYXRlbGV0IHBvb3IgcGxhc21hXG4gIFwiMDgwNzVDXCI6IFwiMjY5Mi03XCIsIC8vIE9zbW9sYWxpdHkgXHUyMDE0IFNlcnVtIG9yIFBsYXNtYVxuICBcIjA4MDc5QlwiOiBcIjMwMjQwLTZcIiwgLy8gRC1kaW1lciBcdTIwMTQgUGx0IHBvb3IgcGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBGcmVlIFQ0IGhhcyBUV08gdmFsaWQgTE9JTkNzIHRoYXQgZGlmZmVyIG9ubHkgaW4gdW5pdC1zeXN0ZW06XG4gIC8vICAgMzAyNC03ICBDb21wb25lbnQ9VGh5cm94aW5lLmZyZWUsIFByb3BlcnR5PU1DbmMgKE1hc3MgY29uYywgbmcvZEwpXG4gIC8vICAgMTQ5MjAtMyBDb21wb25lbnQ9VGh5cm94aW5lLmZyZWUsIFByb3BlcnR5PVNDbmMgKE1vbGFyIGNvbmMsIHBtb2wvTClcbiAgLy8gQm90aCBhcmUgRnJlZSBUNCBcdTIwMTQgbmVpdGhlciBpcyBUb3RhbCBUNC4gRWFybGllciBoaXN0b3J5OlxuICAvLyAgIC0gT3JpZ2luYWwgbWFwcGluZyB3YXMgMzAyNC03IChjb3JyZWN0OiBtYXRjaGVzIFRhaXdhbiBuZy9kTCBsYWJzKS5cbiAgLy8gICAtIENvbW1pdCA5ZGE1ZTViIGNoYW5nZWQgaXQgdG8gMTQ5MjAtMyBvbiB0aGUgcHJlbWlzZSB0aGF0IDMwMjQtN1xuICAvLyAgICAgd2FzIFRvdGFsIFQ0LiBUaGF0IHByZW1pc2Ugd2FzIGludmVydGVkICh2ZXJpZmllZCBsb2luYy5vcmcvMzAyNC03L1xuICAvLyAgICAgXHUyMDE0IENvbXBvbmVudCBpcyBcIlRoeXJveGluZS5mcmVlXCIpOyB0aGUgY2hhbmdlIGludHJvZHVjZWQgYSBMT0lOQ1x1MjE5NHVuaXRcbiAgLy8gICAgIG1pc21hdGNoIChtb2xhciBMT0lOQyBwYWlyZWQgd2l0aCBhIG5nL2RMIHZhbHVlKS5cbiAgLy8gICAtIFJlc3RvcmluZyAzMDI0LTcgaGVyZSBzbyB0aGUgTE9JTkMncyBwcm9wZXJ0eSBjbGFzcyAoTUNuYykgbWF0Y2hlc1xuICAvLyAgICAgdGhlIHVuaXQgZmllbGQgKG5nL2RMKSBUYWl3YW4gbGFicyBzaGlwLiBTZWUgZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kXG4gIC8vICAgICBzZWN0aW9uIEYgZm9yIGZ1bGwgZXZpZGVuY2UuXG4gIFwiMDkxMDZDXCI6IFwiMzAyNC03XCIsIC8vIEZyZWUgVDQgXHUyMDE0IFRoeXJveGluZSAoVDQpIGZyZWUgW01hc3Mvdm9sdW1lXSBTL1BcbiAgXCIwOTExMkNcIjogXCIzMDE2LTNcIiwgIC8vIFRTSCBcdTIwMTQgVGh5cm90cm9waW4gUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkaWFjIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwOTlDXCI6IFwiMTA4MzktOVwiLCAvLyBUcm9wb25pbiBJIFx1MjAxNCBUcm9wb25pbiBJIGNhcmRpYWMgUy9QXG4gIFwiMTIxOTJDXCI6IFwiMzM5NTktOFwiLCAvLyBQcm9jYWxjaXRvbmluIFx1MjAxNCBTL1BcbiAgXCIxMjE5M0NcIjogXCIzMzc2Mi02XCIsIC8vIE5ULXByb0JOUCBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXRhbWlucyAvIGNvZmFjdG9ycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyOUNcIjogXCIyMTMyLTlcIiwgLy8gVml0IEIxMiBcdTIwMTQgQ29iYWxhbWluIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTMwQ1wiOiBcIjIyODQtOFwiLCAvLyBGb2xhdGUgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjA5MTEzQ1wiOiBcIjIxNDMtNlwiLCAvLyBDb3J0aXNvbCBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIxMTZDXCI6IFwiMjI3Ni00XCIsIC8vIEZlcnJpdGluIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEFjdXRlIHBoYXNlIC8gaW5mbGFtbWF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxMjAxNUMgaXMgdGhlIGdlbmVyaWMgTkhJIENSUCBvcmRlciBcdTIwMTQgbW9zdCBjbGluaWNhbCBjb250ZXh0cyBpbiBcdTUwNjVcdTRGRERcbiAgLy8gc2VuZCBhIHJlZ3VsYXIgKG5vdCBocy0pIENSUCwgc28gbWFwIHRvIDE5ODgtNS4gSWYgYSBcdTk2NjJcdTYyNDAgc3BlY2lmaWNhbGx5XG4gIC8vIGJpbGxzIGhzLUNSUCBpdCB3aWxsIGxhbmQgb24gYSBkaWZmZXJlbnQgY29kZSAoZS5nLiAxMjE4OUMpLlxuICBcIjEyMDE1Q1wiOiBcIjE5ODgtNVwiLCAvLyBDUlAgXHUyMDE0IEMgcmVhY3RpdmUgcHJvdGVpbiBNYXNzL3ZvbCBTL1BcbiAgXCIxMjA1M0NcIjogXCI1MDQ4LTRcIiwgLy8gQU5BIFx1MjAxNCBBbnRpbnVjbGVhciBBYiBUaXRlciBTL1BcbiAgXCIxMjA1NkJcIjogXCIxNjEyNC0wXCIsIC8vIEFudGktbWl0b2Nob25kcmlhbCBBYiBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDYwMTJDXCI6IFwiNTc3OC02XCIsIC8vIFVyaW5lIGFwcGVhcmFuY2UgXHUyMDE0IENvbG9yXG4gIFwiMDYwMTNDXCI6IFwiMjQzNTYtOFwiLCAvLyBcdTVDM0ZcdTc1MUZcdTUzMTYgcGFuZWwgXHUyMDE0IFVyaW5hbHlzaXMgbWFjcm9zY29waWMgcGFuZWxcbiAgXCIwNzAwMUNcIjogXCIxNDU2My0xXCIsIC8vIFN0b29sIG9jY3VsdCBibG9vZFxuICBcIjA5MTM0Q1wiOiBcIjU4NDUzLTJcIiwgLy8gaUZPQlQgcXVhbnRpdGF0aXZlIFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIFN0b29sIGJ5IElBXG4gIFwiMTIxMTFDXCI6IFwiMjE2MS04XCIsIC8vIFVyaW5lIENyZWF0aW5pbmUgXHUyMDE0IHNhbWUgTE9JTkMgYXMgMDkwMTZDXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXJvbG9neSAvIGltbXVub2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDFDXCI6IFwiNTI5Mi04XCIsIC8vIFJQUiBcdTIwMTQgU2VydW0vUGxhc21hXG4gIFwiMTIwMjFDXCI6IFwiMjAzOS02XCIsIC8vIENFQSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMjVCXCI6IFwiMjQ2NS0zXCIsIC8vIElnRyBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMjdCXCI6IFwiMjQ1OC04XCIsIC8vIElnQSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMzFDXCI6IFwiMTkxMTMtMFwiLCAvLyBJZ0UgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyAxMjA2OUIgQ3J5cHRvY29jY3VzIEFnIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyA1MTMyLTYgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0ROQSBzaW5nbGUgc3RyYW5kIEFiIFtVbml0cy92b2x1bWVdIGluIFNlcnVtJyAoYW50aS1zc0ROQSxcbiAgLy8gbHVwdXMgc2Vyb2xvZ3kgXHUyMDE0IHZlcmlmaWVkIGxvaW5jLm9yZy81MTMyLTYvKS4gQ29tcGxldGVseSB3cm9uZ1xuICAvLyBhbmFseXRlLiBMZWF2aW5nIHVubWFwcGVkOyBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLlxuICAvLyBTZWUgZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kLlxuICBcIjEyMDc5Q1wiOiBcIjI0MTA4LTNcIiwgLy8gQ0EgMTktOSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBCbG9vZCB0eXBlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjExMDAxQ1wiOiBcIjg4Mi0xXCIsIC8vIFx1ODg0MFx1NTc4Qlx1OTQ1MVx1NUI5QSBcdTIwMTQgQUJPICsgUmggZ3JvdXBcbiAgXCIxMTAwM0NcIjogXCI4ODItMVwiLCAvLyBcdTg4NDBcdTU3OEJcdTk0NTFcdTVCOUEgXHUyMDE0IEFCTyArIFJoIGdyb3VwXG4gIFwiMTEwMDRDXCI6IFwiODkwLTRcIiwgLy8gXHU2Mjk3XHU5QUQ0XHU1M0NEXHU2MUM5IFx1MjAxNCBBbnRpYm9keSBzY3JlZW5cbiAgLy8gXHUyNTAwXHUyNTAwIE1pY3JvYmlvbG9neSBjdWx0dXJlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTMwMDdDIFx1N0QzMFx1ODNDQ1x1NTdGOVx1OTkwQSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMTQyMTktMCB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnSFRMViBJIHAyNiBBYiBpbiBTZXJ1bScgKHZlcmlmaWVkIGF0IGxvaW5jLm9yZykuIFRoZVxuICAvLyByaWdodCBmYW1pbHkgaXMgNjQ2My00IC8gMTEyNjgtMCAoQmFjdGVyaWEgaWRlbnRpZmllZCBieSBhZXJvYmVcbiAgLy8gY3VsdHVyZSkgYnV0IHRoZSBzb3VyY2Ugcm93IGRvZXNuJ3QgdGVsbCB1cyBzcGVjaW1lbiBcdTIwMTQgbGVhdmluZ1xuICAvLyB1bm1hcHBlZCBzbyB3ZSBkb24ndCBsaWUuIEZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuXG4gIC8vIDEzMDEzQyBUQiBDdWx0dXJlIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAzMTk1Mi01IHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdSaW5kZXJwZXN0IHZpcnVzIEFnIFtQcmVzZW5jZV0gaW4gRXh1ZGF0ZScgKGNhdHRsZVxuICAvLyBtb3JiaWxsaXZpcnVzLCB2ZXJpZmllZCBsb2luYy5vcmcvMzE5NTItNS8pLiBXcm9uZyBvcmdhbmlzbSBlbnRpcmVseS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy4gU2VlXG4gIC8vIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxMzAxNkJcIjogXCI2MDAtN1wiLCAvLyBCbG9vZCBDdWx0dXJlIFx1MjAxNCBCYWN0ZXJpYSBpZGVudGlmaWVkIGluIEJsb29kXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTQwMDRCIENNViBJZ0cgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDc4NDktMyB3aGljaCBpcyBhY3R1YWxseVxuICAvLyAnVGFlbmlhIHNvbGl1bSBsYXJ2YSBJZ00gQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bScgKHBvcmsgdGFwZXdvcm0sXG4gIC8vIHZlcmlmaWVkIGxvaW5jLm9yZy83ODQ5LTMvKS4gV3Jvbmcgb3JnYW5pc20gZW50aXJlbHkuIExlYXZpbmdcbiAgLy8gdW5tYXBwZWQ7IGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuXG4gIC8vIDE0MDQ4QiBDTVYgSWdNIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyA3ODUwLTEgd2hpY2ggaXMgYWN0dWFsbHlcbiAgLy8gJ1RhZW5pYSBzb2xpdW0gbGFydmEgQWIgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0nICh2ZXJpZmllZFxuICAvLyBsb2luYy5vcmcvNzg1MC0xLykuIFNhbWUgY29weS1wYXN0ZS13cm9uZy1MT0lOQyBwYXR0ZXJuIGFzIDE0MDA0Qi5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZC4gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxNDA2NkNcIjogXCI4MDM4My0zXCIsIC8vIEluZmx1ZW56YSBBIFx1MjAxNCBBZyBSZXNwaXJhdG9yeVxuICBcIjE0MDg0Q1wiOiBcIjk0NTU4LTRcIiwgLy8gU0FSUy1Db1YtMiBBZyBcdTIwMTQgUmVzcGlyYXRvcnlcbiAgXCIxMjE4NENcIjogXCI4ODE1Ny0zXCIsIC8vIENNViBETkEgcXVhbnQgUENSIFx1MjAxNCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIE15Y29iYWN0ZXJpdW0gLyBhY2lkLWZhc3QgKGFkZGVkIGFmdGVyIGF1ZGl0KSBcdTI1MDBcbiAgXCIxMzAyNUNcIjogXCIyOTI2MC03XCIsIC8vIFx1NjI5N1x1OTE3OFx1NjAyN1x1NkZDM1x1N0UyRVx1NjJCOVx1NzI0N1x1NjdEM1x1ODI3Mlx1NkFBMlx1NjdFNSBcdTIwMTQgTXljb2JhY3Rlcml1bSBBRkIgc3RhaW5cbiAgXCIxMzAyNkNcIjogXCIyOTU1My01XCIsIC8vIFx1NjI5N1x1OTE3OFx1ODNDQ1x1NTdGOVx1OTkwQSBcdTIwMTQgTXljb2JhY3Rlcml1bSBjdWx0dXJlIGxpcXVpZCtzb2xpZFxuICAvLyBcdTI1MDBcdTI1MDAgQUJHIHBhbmVsICgwOTA0MUIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBJbnRlbnRpb25hbGx5IE5PVCBtYXBwZWQgaGVyZSBcdTIwMTQgMDkwNDFCIGlzIGEgcGFuZWwgb3JkZXIgdGhhdFxuICAvLyB1bmZvbGRzIGludG8gbWFueSBpdGVtcyAocEggLyBwQ08yIC8gcE8yIC8gSENPMyAvIFRDTzIgLyBTQkUgL1xuICAvLyBBQkUgLyBTQkMgLyBTQVQpLiBNYXBwaW5nIHRoZSBwYW5lbCBjb2RlIHRvIFwicEhcIiB3b3VsZCBtaXMtbGFiZWxcbiAgLy8gZXZlcnkgbm9uLXBIIHJvdyB0aGF0IHNoYXJlcyB0aGlzIE5ISSBjb2RlLiBFYWNoIGl0ZW0gaXNcbiAgLy8gcmVzb2x2ZWQgdmlhIF9MT0lOQ19NQVAgZGlzcGxheS1rZXl3b3JkIGZhbGxiYWNrIGJlbG93OyAwOTA0MUJcbiAgLy8gYWxzbyBhcHBlYXJzIGluIF9ESVNQTEFZX0ZJUlNUX0NPREVTIHNvIGRpc3BsYXkgYWx3YXlzIHdpbnMuXG4gIC8vIFx1MjUwMFx1MjUwMCBCb2R5IGZsdWlkIC8gc3lub3ZpYWwgZmx1aWQgcGFuZWwgKDE2MDA4QyB1bmZvbGRzOyB0aGVcbiAgLy8gbWVtYmVyIGl0ZW1zIHJlbHkgb24gZGlzcGxheSBrZXl3b3JkcyBmb3Igc3BlY2ltZW4tYXdhcmVcbiAgLy8gTE9JTkNzKS4gUGFyZW50IGNvZGUgbWFwcyB0byBzeW5vdmlhbCBmbHVpZCBhbmFseXNpcyBwYW5lbC4gXHUyNTAwXHUyNTAwXG4gIC8vIDE2MDA4QyBcdTZFRDFcdTZEQjJcdTZBQTJcdTY3RTUgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDMzOTAzLTYgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0tldG9uZXMgW1ByZXNlbmNlXSBpbiBVcmluZScgKHZlcmlmaWVkIGxvaW5jLm9yZykuXG4gIC8vIExlYXZpbmcgdW5tYXBwZWQ7IHRoZSBwYW5lbCBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2Rpbmcgb25seVxuICAvLyBhbmQgdGhlIHBlci1pdGVtIGRpc3BsYXlzIGluIF9MT0lOQ19NQVAgY2FycnkgdGhlaXIgb3duIExPSU5Dc1xuICAvLyB3aGVyZSBrbm93bi5cbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfRElTUExBWV9GSVJTVF9DT0RFUyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBjb2RlcyB0aGF0IGFyZSAqcGFuZWxzKiBcdTIwMTQgb25lIGJpbGxpbmcgY29kZSwgbWFueSBpdGVtLXNwZWNpZmljXG4vLyBkaXNwbGF5cy4gRm9yIHRoZXNlLCBkaXNwbGF5IGtleXdvcmQgTVVTVCBiZSB0cmllZCBmaXJzdCAoc28gXCJXQkNcIlxuLy8gdW5kZXIgQ0JDIHBhbmVsIDA4MDExQyBnZXRzIDY2OTAtMiwgbm90IHRoZSBnZW5lcmljIHBhbmVsIExPSU5DKS5cbi8vIEZvciBldmVyeXRoaW5nIGVsc2UgKHNpbmdsZS10ZXN0IGNvZGVzIGxpa2UgMDkwMDVDIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENixcbi8vIDA5MDQ0QyBMREwsIDE0MDMwQyBIQnNBZyksIHRoZSBOSEkgY29kZSBpcyBtb3JlIHNwZWNpZmljIHRoYW4gYW55XG4vLyBkaXNwbGF5IGtleXdvcmQgYW5kIHdpbnMgb3V0cmlnaHQuXG4vL1xuLy8gREVTSUdOIFBISUxPU09QSFk6IHRoZSBicmlkZ2UgaXMgYSAqZmFpdGhmdWwgdHJhbnNwb3J0KiBsYXllciBcdTIwMTQgaXRcbi8vIHRydXN0cyB0aGUgXHU1MDY1XHU0RkREIGJpbGxpbmcgY29kZSBhcyBhdXRob3JpdGF0aXZlIGZvciBjbGluaWNhbCBpbnRlbnRcbi8vIChcdTk2NjJcdTYyNDAgYmlsbGVkIDA5MDA1QyA9IHRoZXkgb3JkZXJlZCBmYXN0aW5nIGdsdWNvc2UsIHJlZ2FyZGxlc3Mgb2Zcbi8vIHdoZXRoZXIgdGhlIG9wZXJhdGlvbmFsIHNwZWNpbWVuIHdhcyBhIGZpbmdlci1zdGljaykuIERpc3BsYXktc3RyaW5nXG4vLyByZS1pbnRlcnByZXRhdGlvbiBvZiBjbGluaWNhbCBjb250ZXh0IChHbHUtQUMgdnMgRklOR0VSIFNVR0FSIHZzXG4vLyByYW5kb20pIGlzIGxlZnQgdG8gdGhlIFNNQVJUIGFwcCwgd2hpY2ggaGFzIG1vcmUgVUkgY29udGV4dC5cbmV4cG9ydCBjb25zdCBESVNQTEFZX0ZJUlNUX0NPREVTOiBSZWFkb25seVNldDxzdHJpbmc+ID0gbmV3IFNldChbXG4gIFwiMDgwMTFDXCIsIC8vIENCQyBwYW5lbFxuICBcIjA4MDEzQ1wiLCAvLyBDQkMgdy8gYXV0byBkaWZmIHBhbmVsXG4gIFwiMDYwMTNDXCIsIC8vIFVyaW5hbHlzaXMgbWFjcm9zY29waWMgcGFuZWxcbiAgXCIwOTA0MUJcIiwgLy8gQUJHIHBhbmVsXG4gIFwiMTYwMDhDXCIsIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBwYW5lbFxuXSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBfUEFORUxfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gUGFuZWwtc3BlY2lmaWMgZGlzcGxheSBcdTIxOTIgTE9JTkMgb3ZlcnJpZGVzLiBUaGVzZSBydW4gQkVGT1JFIHRoZSBnbG9iYWxcbi8vIF9MT0lOQ19NQVAgc28gdGhhdCB1cmluZSBiaWxpcnViaW4gdW5kZXIgMDYwMTNDIG1hcHMgdG8gNTc3MC0zICh1cmluZVxuLy8gc3BlY2ltZW4pIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIGdsb2JhbCAnYmlsaXJ1YmluJyB0aGF0XG4vLyB3b3VsZCBpbXBseSBzZXJ1bSwgYW5kIGFuYWxvZ291cyBzcGVjaW1lbi1hd2FyZSBkaXNhbWJpZ3VhdGlvbiBmb3Jcbi8vIG90aGVyIHBhbmVsIHN1Yi1pdGVtcy4gS2V5cyBhcmUgTkhJIHBhbmVsIGNvZGVzIChtdXN0IGFsc28gYmUgaW5cbi8vIF9ESVNQTEFZX0ZJUlNUX0NPREVTKTsgdmFsdWVzIGFyZSBkaXNwbGF5LWtleXdvcmQgXHUyMTkyIExPSU5DIGRpY3RzIHRoYXRcbi8vIGZvbGxvdyB0aGUgc2FtZSBtYXRjaGluZyBzZW1hbnRpY3MgYXMgX0xPSU5DX01BUCAobGVhZGluZyB3b3JkXG4vLyBib3VuZGFyeSBmb3IgQVNDSUksIHN1YnN0cmluZyBmb3IgQ0pLKS5cbmV4cG9ydCBjb25zdCBQQU5FTF9MT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gQWxsIHJvdXRpbmUgZGlwc3RpY2sgaXRlbXMgcmVzaWRlIG9uIGEgc2luZ2xlIE5ISSBiaWxsaW5nIGNvZGUuXG4gIC8vIFdpdGhvdXQgdGhpcyB0YWJsZSB0aGV5J2QgYWxsIGNvbGxhcHNlIHRvIHRoZSBwYW5lbCBMT0lOQyAyNDM1Ni04LFxuICAvLyBsb3NpbmcgcGVyLWl0ZW0gZ3JhbnVsYXJpdHkgdGhhdCdzIGNsaW5pY2FsbHkgdXNlZnVsIChlLmcuXG4gIC8vIGJpbGlydWJpbiB2cyB1cm9iaWxpbm9nZW4gZm9yIGxpdmVyIHdvcmt1cCkuXG4gIFwiMDYwMTNDXCI6IHtcbiAgICAvLyBPcmRlciBtYXR0ZXJzOiBsb25nZXIvbW9yZS1zcGVjaWZpYyBrZXlzIGJlZm9yZSBnZW5lcmljIG9uZXNcbiAgICAvLyAobWF0Y2hlcyBfTE9JTkNfTUFQIGl0ZXJhdGlvbiBzZW1hbnRpY3MgXHUyMDE0IGZpcnN0IGhpdCB3aW5zKS5cbiAgICBcInNwZWNpZmljIGdyYXZpdHlcIjogXCI1ODExLTVcIiwgLy8gU3BlY2lmaWMgZ3Jhdml0eSBVcmluZVxuICAgIFwic3AuZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFwic3AgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFx1NkJENFx1OTFDRDogXCI1ODExLTVcIixcbiAgICBcIm1pY3JvLWFsYnVtaW5cIjogXCIxNDk1Ny01XCIsIC8vIE1pY3JvYWxidW1pbiBNYXNzL3ZvbCBVcmluZVxuICAgIG1pY3JvYWxidW1pbjogXCIxNDk1Ny01XCIsXG4gICAgXCJtYWxiKHUpXCI6IFwiMTQ5NTctNVwiLFxuICAgIG1hbGI6IFwiMTQ5NTctNVwiLFxuICAgIFx1NUZBRVx1NUMwRlx1NzY3RFx1ODZDQlx1NzY3RDogXCIxNDk1Ny01XCIsXG4gICAgdWFjcjogXCIxNDk1OS0xXCIsIC8vIE1pY3JvYWxidW1pbi9DcmVhdGluaW5lIHJhdGlvIFVyaW5lXG4gICAgXCJ1cmluZSBnbHVjb3NlXCI6IFwiNTc5Mi03XCIsXG4gICAgc3VnYXI6IFwiNTc5Mi03XCIsIC8vIE5ISSAnXHU1QzNGXHU3Q0Q2JyAvICdTdWdhcicgdW5kZXIgMDYwMTNDXG4gICAgXHU1QzNGXHU3Q0Q2OiBcIjU3OTItN1wiLFxuICAgIHVyb2JpbGlub2dlbjogXCI1ODE4LTBcIiwgLy8gVXJvYmlsaW5vZ2VuIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDIwXHU1MzlGOiBcIjU4MTgtMFwiLFxuICAgIGJpbGlydWJpbjogXCI1NzcwLTNcIiwgLy8gQmlsaXJ1YmluIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDA1XHU3RDIwOiBcIjU3NzAtM1wiLFxuICAgIG5pdHJpdGU6IFwiNTgwMi00XCIsIC8vIE5pdHJpdGUgVXJpbmVcbiAgICBcdTRFOUVcdTc4NURcdTkxNzg6IFwiNTgwMi00XCIsXG4gICAga2V0b25lczogXCI1Nzk3LTZcIiwgLy8gS2V0b25lcyBVcmluZVxuICAgIGtldG9uZTogXCI1Nzk3LTZcIixcbiAgICBcdTkxNkVcdTlBRDQ6IFwiNTc5Ny02XCIsXG4gICAgcHJvdGVpbjogXCIyMDQ1NC01XCIsIC8vIFByb3RlaW4gTWFzcy92b2wgVXJpbmVcbiAgICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAgIFx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgbGV1a29jeXRlOiBcIjU3OTktMlwiLCAvLyBMZXVrb2N5dGVzIFVyaW5lXG4gICAgbGV1OiBcIjU3OTktMlwiLFxuICAgIFx1NzY3RFx1ODg0MFx1NzQwM1x1OTE2Rlx1OTE3NjogXCI1Nzk5LTJcIixcbiAgICBibG9vZDogXCI1Nzk0LTNcIiwgLy8gSGVtb2dsb2JpbiBVcmluZSBRbFxuICAgIFx1NkY1Qlx1ODg0MDogXCI1Nzk0LTNcIixcbiAgICBcdTgyNzI6IFwiNTc3OC02XCIsIC8vIENvbG9yIG9mIFVyaW5lIChDSksgc3Vic3RyaW5nKVxuICAgIGNvbG9yOiBcIjU3NzgtNlwiLFxuICAgIHR1cmJpZGl0eTogXCI1NzY3LTlcIiwgLy8gQXBwZWFyYW5jZSBvZiBVcmluZVxuICAgIGFwcGVhcmFuY2U6IFwiNTc2Ny05XCIsXG4gICAgXHU1OTE2XHU4OUMwOiBcIjU3NjctOVwiLFxuICAgIHBoOiBcIjU4MDMtMlwiLCAvLyBwSCBvZiBVcmluZSAodXJpbmUtc3BlY2lmaWMsIE5PVFxuICAgIC8vIHRoZSBhcnRlcmlhbCAxMTU1OC00IHRoYXQgdGhlXG4gICAgLy8gZ2xvYmFsIG1hcCBwb2ludHMgdG8pXG4gICAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIjU4MDMtMlwiLFxuICAgIGdsdWNvc2U6IFwiNTc5Mi03XCIsIC8vIExhc3QgaW4gdGhpcyBibG9jayBzbyAndXJpbmVcbiAgfSxcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ29tbW9uIFRhaXdhbmVzZSBISVMgbGFiIG5hbWVzIFx1MjE5MiBMT0lOQyBjb2RlIG1hcHBpbmdcbmV4cG9ydCBjb25zdCBMT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBEaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgb25seSBraWNrcyBpbiB3aGVuIE5PIE5ISSBjb2RlIGlzXG4gIC8vIHByZXNlbnQgKGRhc2hib2FyZCByb3dzLCBMTE0tZXh0cmFjdGVkIHRleHQpLiBXaGVuIHRoZSBOSEkgY29kZVxuICAvLyBJUyBwcmVzZW50LCAwOTAwNUMgXHUyMTkyIDE1NTgtNiAoRmFzdGluZykgYW5kIDA5MTQwQyBcdTIxOTIgMjM0NS03XG4gIC8vIChnZW5lcmljKSB3aW5zIGRpcmVjdGx5IHZpYSBfTkhJX1RPX0xPSU5DLlxuICAvL1xuICAvLyBGYWl0aGZ1bC10cmFuc3BvcnQgcHJpbmNpcGxlOiB0aGUgYnJpZGdlIGRvZXMgTk9UIHJlLWludGVycHJldFxuICAvLyBkaXNwbGF5IHN0cmluZ3MgbGlrZSBcIkZJTkdFUiBTVUdBUlwiIGFzIGEgZGlmZmVyZW50IExPSU5DIFx1MjAxNCBpdFxuICAvLyBwcmVzZXJ2ZXMgdGhlIHJhdyBkaXNwbGF5IGluIGBjb2RlLnRleHRgIGFuZCB0aGUgb3JpZ2luYWwgTkhJXG4gIC8vIGNvZGUgaW4gYGNvZGUuY29kaW5nYC4gVGhlIFNNQVJUIGFwcCBkb2VzIHNwZWNpbWVuL21ldGhvZC1hd2FyZVxuICAvLyBncm91cGluZyBvbiB0aGUgY29uc3VtZXIgc2lkZSAoc2VlIFNNQVJUIGFwcCBoYW5kb2ZmIGRvYykuXG4gIFwiZmFzdGluZyBnbHVjb3NlXCI6IFwiMTU1OC02XCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCIxNTU4LTZcIixcbiAgXCJnbHUtYWNcIjogXCIxNTU4LTZcIixcbiAgXCJnbHVjb3NlIGFjXCI6IFwiMTU1OC02XCIsXG4gIGdsdWNvc2U6IFwiMjM0NS03XCIsXG4gIFx1ODg0MFx1N0NENjogXCIyMzQ1LTdcIixcbiAgZ2x1OiBcIjIzNDUtN1wiLFxuICAvLyBIYkExYyBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyBcImhiXCIgZW50cmllcyBzbyB0aGUgbG9uZ2VzdC1wcmVmaXhcbiAgLy8gbWF0Y2ggd2lucyBmb3IgdGhlIFwiSGJBMWNcIiBkaXNwbGF5IHN0cmluZy4gT3RoZXIgQTFjIHN5bm9ueW1zXHUyMDI2XG4gIGhiYTFjOiBcIjQ1NDgtNFwiLFxuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNDU0OC00XCIsXG4gIGExYzogXCI0NTQ4LTRcIixcbiAgaGVtb2dsb2JpbjogXCI3MTgtN1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNzE4LTdcIixcbiAgaGdiOiBcIjcxOC03XCIsXG4gIGhiOiBcIjcxOC03XCIsXG4gIC8vIENCQyBkaWZmIFx1MjAxNCBlb3Npbm9waGlsIGNvdW50IG11c3QgcHJlY2VkZSB0aGUgYmFyZSAnd2JjJy8nXHU3NjdEXHU4ODQwXHU3NDAzJ1xuICAvLyBrZXlzICh3aGljaCB3b3VsZCBvdGhlcndpc2Ugd2luIGFzIHN1YnN0cmluZ3MpLlxuICAvLyA3MTEtMiB2ZXJpZmllZCBhdCBsb2luYy5vcmc6ICdFb3Npbm9waGlscyBbIy92b2x1bWVdIGluIEJsb29kXG4gIC8vIGJ5IEF1dG9tYXRlZCBjb3VudCcuXG4gIFx1NTVEQ1x1OTE3OFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNzExLTJcIixcbiAgZW9zaW5vcGhpbDogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsczogXCI3MTEtMlwiLFxuICB3YmM6IFwiNjY5MC0yXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCI2NjkwLTJcIixcbiAgcGxhdGVsZXQ6IFwiNzc3LTNcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIjc3Ny0zXCIsXG4gIHBsdDogXCI3NzctM1wiLFxuICAvLyBSQkMgKyBSQkMgaW5kaWNlcyBcdTIwMTQgdmVyaWZpZWQgTE9JTkNzIChsb2luYy5vcmcpOlxuICAvLyA3ODktOCAgRXJ5dGhyb2N5dGVzICMvdm9sIEJsb29kIEF1dG8gICAgICAgICAgICAgIFx1MjE5MiBSQkNcbiAgLy8gNzg1LTYgIEVyeXRocm9jeXRlIG1lYW4gY29ycHVzY3VsYXIgaGVtb2dsb2JpbiAgICBcdTIxOTIgTUNIXG4gIC8vIExvbmcgQ0pLIGZvcm1zIGZpcnN0IChMREwvY2hvbGVzdGVyb2wgcGF0dGVybikgc28gJ1x1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1xuICAvLyBcdTg4NDBcdTgyNzJcdTdEMjAnIHdpbnMgb3ZlciBcdTdEMDVcdTg4NDBcdTc0MDMuXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMDogXCI3ODUtNlwiLFxuICByYmM6IFwiNzg5LThcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIjc4OS04XCIsXG4gIG1jaDogXCI3ODUtNlwiLFxuICAvLyBVcmluZSBjcmVhdGluaW5lIFx1MjAxNCBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyAnY3JlYXRpbmluZScgc29cbiAgLy8gcm93cyBsaWtlICdVLUNSRSBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTAnIG9yICdDcmVhdGluaW5lKFUpJyByZXNvbHZlIHRvIHRoZVxuICAvLyB1cmluZSBMT0lOQyAoMjE2MS04KSBpbnN0ZWFkIG9mIGJlaW5nIHNoYWRvd2VkIGJ5IHRoZSBzZXJ1bVxuICAvLyBkZWZhdWx0ICgyMTYwLTApLiBTYW1lIGxvbmdlc3Qtc3BlY2lmaWMtZmlyc3Qgb3JkZXJpbmcgYXNcbiAgLy8gdGhlIGZhc3RpbmctdnMtcmFuZG9tIGdsdWNvc2UgYmxvY2suXG4gIFwidXJpbmUgY3JlYXRpbmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUgdXJpbmVcIjogXCIyMTYxLThcIixcbiAgXCJjcmVhdGluaW5lKHUpXCI6IFwiMjE2MS04XCIsXG4gIFwidS1jcmVcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZWFcIjogXCIyMTYxLThcIixcbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIjIxNjEtOFwiLFxuICBjcmVhdGluaW5lOiBcIjIxNjAtMFwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE1MFx1OTE3ODogXCIyMTYwLTBcIiwgLy8gVGFpd2FuIHZhcmlhbnQgc3BlbGxpbmdcbiAgY3JlYTogXCIyMTYwLTBcIixcbiAgYnVuOiBcIjMwOTQtMFwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiMzA5NC0wXCIsXG4gIGFzdDogXCIxOTIwLThcIixcbiAgYWx0OiBcIjE3NDItNlwiLFxuICBmZXJyaXRpbjogXCIyMjc2LTRcIixcbiAgXHU4ODQwXHU2RTA1XHU5NDM1XHU4NkNCXHU3NjdEOiBcIjIyNzYtNFwiLFxuICBmZXJyOiBcIjIyNzYtNFwiLFxuICAvLyBWaXRhbC1zaWducyBmcm9tIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NSAoSUhLRTM0MDIpIFx1MjAxNCBzZXBhcmF0ZSBjb2RlIG5hbWVzcGFjZVxuICAvLyBidXQgdGhlIGxvb2t1cCBpcyBieSBkaXNwbGF5LW5hbWUgc3Vic3RyaW5nLCBzYW1lIGFzIGZvciBsYWJzLlxuICBcImJvZHkgaGVpZ2h0XCI6IFwiODMwMi0yXCIsXG4gIFwiYm9keSB3ZWlnaHRcIjogXCIyOTQ2My03XCIsXG4gIGJtaTogXCIzOTE1Ni01XCIsXG4gIC8vIFdhaXN0IGNpcmN1bWZlcmVuY2UgXHUyMDE0IG1lYXN1cmVtZW50IExPSU5DICg4MjgwLTApLiA1NjA4Ni0yIGlzXG4gIC8vIHRoZSAnQWR1bHQgV2Fpc3QgQ2lyY3VtZmVyZW5jZSBQcm90b2NvbCcgY29kZSwgd2hpY2ggaXMgYVxuICAvLyBzdXJ2ZXkvcHJvdG9jb2wgZGVzY3JpcHRvciwgTk9UIGEgbnVtZXJpYyBtZWFzdXJlbWVudFxuICAvLyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gTkhJIFx1NTA2NVx1NEZERCByZXBvcnRzIGEgc2luZ2xlIHdhaXN0bGluZVxuICAvLyBudW1iZXIgcGVyIHZpc2l0LCBzbyB0aGUgbWVhc3VyZW1lbnQgY29kZSBpcyBjb3JyZWN0LlxuICBcIndhaXN0IGNpcmN1bWZlcmVuY2VcIjogXCI4MjgwLTBcIixcbiAgXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0ODAtNlwiLFxuICBcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0NjItNFwiLFxuICAvLyBMaXBpZCBwYW5lbCBcdTIwMTQgT1JERVIgTUFUVEVSUy4gTERML0hETCB2YXJpYW50cyBNVVNUIHByZWNlZGUgdGhlXG4gIC8vIGdlbmVyaWMgJ2Nob2xlc3Rlcm9sJyBrZXkgc28gYSByb3cgbGFiZWxsZWQgJ0xETCBDSE9MRVNURVJPTCdcbiAgLy8gcmVzb2x2ZXMgdG8gMTM0NTctNyAoTERMIGNhbGN1bGF0ZWQpIGFuZCAnSERMIENIT0xFU1RFUk9MJyB0b1xuICAvLyAyMDg1LTksIGluc3RlYWQgb2YgZmFsbGluZyB0byAyMDkzLTMgKHRvdGFsIGNob2xlc3Rlcm9sKSB2aWEgdGhlXG4gIC8vICdjaG9sZXN0ZXJvbCcgc3Vic3RyaW5nLiBTYW1lIGNhbm9uaWNhbCBvcmRlcmluZyBhcyBfTEFCX1NZTk9OWU1TLlxuICBcImxkbCBjaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXCJsZGwtY2hvbGVzdGVyb2xcIjogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIC8vIDEzNDU3LTcgPSBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIFx1MjAxNCBtYXRjaGVzIHRoZSBOSEkgMDkwNDRDXG4gIC8vIGJpbGxpbmcgY29kZSdzIGludGVudCAoVGFpd2FuIGxhYnMgcHJlZG9taW5hbnRseSByZXBvcnQgY2FsY3VsYXRlZFxuICAvLyBMREwgdmlhIEZyaWVkZXdhbGQpLiBLZWVwIGNvbnNpc3RlbnQgd2l0aCBfTkhJX1RPX0xPSU5DW1wiMDkwNDRDXCJdLlxuICBcImxkbC1jXCI6IFwiMTM0NTctN1wiLFxuICBsZGw6IFwiMTM0NTctN1wiLFxuICBcImhkbCBjaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcImhkbC1jaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXCJoZGwtY1wiOiBcIjIwODUtOVwiLFxuICBoZGw6IFwiMjA4NS05XCIsXG4gIC8vIFRvdGFsIGNob2xlc3Rlcm9sIFx1MjAxNCBiYXJlICdjaG9sZXN0ZXJvbCcgb25seSBmaXJlcyBBRlRFUiB0aGVcbiAgLy8gTERML0hETC1wcmVmaXhlZCB2YXJpYW50cyBhYm92ZSBoYXZlIGJlZW4gY2hlY2tlZC5cbiAgXCJ0b3RhbCBjaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcInQtY2hvbGVzdGVyb2xcIjogXCIyMDkzLTNcIixcbiAgXHU4ODQwXHU2RTA1XHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwOTMtM1wiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIGNob2xlc3Rlcm9sOiBcIjIwOTMtM1wiLFxuICB0cmlnbHljZXJpZGU6IFwiMjU3MS04XCIsXG4gIFx1NEUwOVx1OTE3OFx1NzUxOFx1NkNCOVx1OTE2RjogXCIyNTcxLThcIixcbiAgXCJ1cmljIGFjaWRcIjogXCIzMDg0LTFcIixcbiAgZWdmcjogXCIzMzkxNC0zXCIsXG4gIGhic2FnOiBcIjUxOTYtMVwiLFxuICBcImFudGktaGN2XCI6IFwiMTYxMjgtMVwiLFxuICAvLyBVcmluZSBwcm90ZWluIChkaXNwbGF5IGZhbGxiYWNrIGZvciB0aGUgbm8tTkhJLWNvZGUgcGF0aCB0aGF0XG4gIC8vIGNvbWVzIGZyb20gSUhLRTM0MDIgdml0YWxzICsgYWR1bHQtcHJldmVudGl2ZSBzdXBwbGVtZW50cykuXG4gIFwidXJpbmUgcHJvdGVpblwiOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICBcInUtcHJvXCI6IFwiMjA0NTQtNVwiLFxuICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAvLyBBQkcgcGFuZWwgY29tcG9uZW50cyBcdTIwMTQgMDkwNDFCIHBhcmVudCBjb2RlIGluIE5ISV9UT19MT0lOQzsgZWFjaFxuICAvLyBtZW1iZXIncyBkaXNwbGF5IChcInBDTzJcIiwgXCJwTzJcIiwgXCJIQ08zXCIsIFwiVENPMlwiLCBcIlNCRS9BQkVcIixcbiAgLy8gXCJTQkNcIiwgXCJTQVRcIiAvIFwiU2FPMlwiKSBmYWxscyB0byBpdHMgb3duIExPSU5DLlxuICAvLyBwSCBNVVNUIGNvbWUgYmVmb3JlIHBjbzIvcG8yIHNvIHRoZSBiYXJlIFwicEhcIiBkaXNwbGF5IGxhbmRzIGhlcmUuXG4gIHBoOiBcIjExNTU4LTRcIiwgLy8gcEggb2YgQXJ0ZXJpYWwgYmxvb2RcbiAgcGNvMjogXCIyMDE5LThcIiwgLy8gQ2FyYm9uIGRpb3hpZGUgcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgcG8yOiBcIjI3MDMtN1wiLCAvLyBPeHlnZW4gcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgaGNvMzogXCIxOTU5LTZcIiwgLy8gQmljYXJib25hdGUgTW9sZXMvdm9sIEFydGVyaWFsXG4gIGJpY2FyYm9uYXRlOiBcIjE5NTktNlwiLFxuICB0Y28yOiBcIjIwMjgtOVwiLCAvLyBUb3RhbCBDTzIgTW9sZXMvdm9sIEFydGVyaWFsXG4gIHNiZTogXCIxMTU1NS0wXCIsIC8vIFN0YW5kYXJkIGJhc2UgZXhjZXNzIEFydGVyaWFsXG4gIGFiZTogXCIxMTU1NS0wXCIsXG4gIHNiYzogXCIxOTI1LTdcIiwgLy8gU3RhbmRhcmQgYmljYXJib25hdGUgQXJ0ZXJpYWxcbiAgc2F0dXJhdDogXCIyNzEzLTZcIiwgLy8gTzIgc2F0dXJhdGlvbiBBcnRlcmlhbFxuICBzYW8yOiBcIjI3MTMtNlwiLFxuICBzYXQ6IFwiMjcxMy02XCIsIC8vIE5ISSBkaXNwbGF5IHNob3dzIGp1c3QgXCJTQVRcIlxuICAvLyBTeW5vdmlhbCAvIGJvZHktZmx1aWQgY29tcG9uZW50cyAoMTYwMDhDIHBhcmVudCBhYm92ZSkuXG4gIFwic2YuY29sb3JcIjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgQm9keSBmbHVpZCAocmV1c2UgVXJpbmUgY29sb3Igc3BlYyBPSylcbiAgLy8gTk9URTogODI1NS0yIC8gMTM5NDgtNSBwcmV2aW91c2x5IGxpc3RlZCBoZXJlIGJvdGggdHVybmVkIG91dFxuICAvLyB0byBiZSB1bnJlbGF0ZWQgTE9JTkNzICh2ZXJpZmllZCBsb2luYy5vcmcgXHUyMDE0IDgyNTUtMiBpc1xuICAvLyAnU2VydmljZSBjb21tZW50IDEzJywgMTM5NDgtNSBpcyAnQ29jY2lkaW9pZGVzIGltbWl0aXMgSWdNXG4gIC8vIEFiJykuIEJvZHktZmx1aWQgQXBwZWFyYW5jZSAvIFJCQyBkb24ndCBoYXZlIHdlbGwtYXR0ZXN0ZWRcbiAgLy8gTE9JTkNzIGluIG91ciB0YWJsZSB5ZXQgXHUyMDE0IGZhbGxpbmcgdGhyb3VnaCB0byBjb2RlLnRleHQtb25seVxuICAvLyBpcyBzYWZlciB0aGFuIGVtaXR0aW5nIGEgbWlzbGVhZGluZyBMT0lOQy4gVG8gYWRkIGxhdGVyLFxuICAvLyB2ZXJpZnkgZWFjaCBhZ2FpbnN0IGxvaW5jLm9yZyBmaXJzdC5cbiAgXCJzZi53YmNcIjogXCIyNjQ2Ni0zXCIsIC8vIFdCQyAjL3ZvbCBCb2R5IGZsdWlkXG4gIFwic2YubmV1dHJvcGhpbFwiOiBcIjEwMzI4LTZcIiwgLy8gTmV1dHJvcGhpbHMvMTAwIGxldWtvY3l0ZXMgaW4gQm9keSBmbHVpZFxuICBcInNmLmx5bXBob1wiOiBcIjEzMDQ2LThcIiwgLy8gTHltcGhvY3l0ZXMgIy92b2wgQm9keSBmbHVpZFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19ESVNQTEFZIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ2Fub25pY2FsIEVuZ2xpc2ggZGlzcGxheSBuYW1lcyBmb3IgTE9JTkMgY29kZXMgdGhlIGJyaWRnZSBlbWl0cy5cbi8vIEZhbGxzIGJhY2sgdG8gdGhlIHJhdyBpbnB1dCBkaXNwbGF5IHdoZW4gYSBMT0lOQyBpc24ndCBsaXN0ZWQgaGVyZS5cbi8vIFNvdXJjZWQgZnJvbSBsb2luYy5vcmcgY2Fub25pY2FsIHNob3J0IG5hbWVzIHdoZXJlIGFwcGxpY2FibGUuXG4vLyBBZGQgbmV3IGVudHJpZXMgYXMgd2Ugd2lkZW4gTE9JTkMgY292ZXJhZ2UgXHUyMDE0IHRoZSBsb29rdXAgaXMga2V5ZWQgb25cbi8vIExPSU5DIHN0cmluZywgc28gdW5tYXBwZWQgTE9JTkNzIGRlZ3JhZGUgZ3JhY2VmdWxseSB0byB0aGUgTkhJIHRleHQuXG5leHBvcnQgY29uc3QgTE9JTkNfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQyBwYW5lbCBzdWItaXRlbXMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBNb3N0IGNyaXRpY2FsIGJsb2NrIFx1MjAxNCBOSEkncyBcIkNvbG9yIFx1NUMzRiBcdTk4NEYgIC4uLlwiIHN0eWxlIGxhYmVscyBhcmVcbiAgLy8gd2hhdCB0cmlnZ2VycyBkb3duc3RyZWFtIENoaW5lc2Utc3Vic3RyaW5nIGxhYmVsbGluZyBidWdzLlxuICBcIjU4MDMtMlwiOiBcInBIIG9mIFVyaW5lXCIsXG4gIFwiNTgxMS01XCI6IFwiU3BlY2lmaWMgZ3Jhdml0eSBvZiBVcmluZVwiLFxuICBcIjU3NzAtM1wiOiBcIkJpbGlydWJpbiBVcmluZSBRbFwiLFxuICBcIjU4MDItNFwiOiBcIk5pdHJpdGUgVXJpbmUgUWxcIixcbiAgXCI1Nzc4LTZcIjogXCJDb2xvciBvZiBVcmluZVwiLFxuICBcIjU3NjctOVwiOiBcIkFwcGVhcmFuY2Ugb2YgVXJpbmVcIixcbiAgXCI1ODE4LTBcIjogXCJVcm9iaWxpbm9nZW4gVXJpbmUgUWxcIixcbiAgXCIyMDQ1NC01XCI6IFwiUHJvdGVpbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU3LTVcIjogXCJNaWNyb2FsYnVtaW4gTWFzcy9Wb2wgaW4gVXJpbmVcIixcbiAgXCIxNDk1OS0xXCI6IFwiTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgUmF0aW8gaW4gVXJpbmVcIixcbiAgXCI1NzkyLTdcIjogXCJHbHVjb3NlIFVyaW5lIFFsXCIsXG4gIFwiNTc5Ny02XCI6IFwiS2V0b25lcyBVcmluZSBRbFwiLFxuICBcIjU3OTQtM1wiOiBcIkhlbW9nbG9iaW4gVXJpbmUgUWxcIixcbiAgXCI1Nzk5LTJcIjogXCJMZXVrb2N5dGVzIFVyaW5lIFFsXCIsXG4gIFwiMjQzNTYtOFwiOiBcIlVyaW5hbHlzaXMgTWFjcm8gUGFuZWxcIixcbiAgLy8gQUxMIGVudHJpZXMgYmVsb3cgdXNlIHRoZSBMT0lOQyBjYW5vbmljYWwgJ0xvbmcgQ29tbW9uIE5hbWUnXG4gIC8vIGFzIGFjY2VwdGVkIGJ5IHRoZSBUV05ISUZISVIgdmFsaWRhdG9yLiBTb3VyY2U6IGxvaW5jLm9yZyBmb3JcbiAgLy8gZWFjaCBjb2RlLCBjcm9zcy1jaGVja2VkIGFnYWluc3QgdGhlIHZhbGlkYXRvcidzIHJlcG9ydGVkXG4gIC8vICdWYWxpZCBkaXNwbGF5IGlzIG9uZSBvZiBOIGNob2ljZXMnIGZvciBkaXNwbGF5cyB3ZSBwcmV2aW91c2x5XG4gIC8vIGdvdCB3cm9uZyAoNDUgTE9JTkNzIGZvdW5kIGluIHRoZSBQMzMzMzMzMzMzIHZhbGlkYXRpb24gcnVuKS5cbiAgLy8gV2hlbiB1cGRhdGluZywgY29weSB0aGUgZXhhY3QgZW4tVVMgbG9uZyBuYW1lIGZyb20gbG9pbmMub3JnIFx1MjAxNFxuICAvLyB0aGUgdmFsaWRhdG9yIGlzIHNlbnNpdGl2ZSB0byBzcGVsbGluZyAvIHB1bmN0dWF0aW9uLlxuICAvL1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgKDA5MDQxQiBwYW5lbCkgXHUyMDE0IG5vdCBpbiB2YWxpZGF0b3Igb3V0cHV0OyBsb2luYy5vcmcgc291cmNlZFxuICBcIjExNTU4LTRcIjogXCJwSCBvZiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMTktOFwiOiBcIkNhcmJvbiBkaW94aWRlIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjI3MDMtN1wiOiBcIk94eWdlbiBbUGFydGlhbCBwcmVzc3VyZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIxOTU5LTZcIjogXCJCaWNhcmJvbmF0ZSBbTW9sZXMvdm9sdW1lXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMjgtOVwiOiBcIkNhcmJvbiBkaW94aWRlIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjExNTU1LTBcIjogXCJCYXNlIGV4Y2VzcyBpbiBBcnRlcmlhbCBibG9vZCBieSBjYWxjdWxhdGlvblwiLFxuICBcIjE5MjUtN1wiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kIC0tc3RhbmRhcmRcIixcbiAgXCIyNzEzLTZcIjogXCJPeHlnZW4gc2F0dXJhdGlvbiBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNTU4LTZcIjogXCJGYXN0aW5nIGdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzQ1LTdcIjogXCJHbHVjb3NlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZW1hdG9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjcxOC03XCI6IFwiSGVtb2dsb2JpbiBbTWFzcy92b2x1bWVdIGluIEJsb29kXCIsXG4gIFwiNDU0OC00XCI6IFwiSGVtb2dsb2JpbiBBMWMvSGVtb2dsb2Jpbi50b3RhbCBpbiBCbG9vZFwiLFxuICBcIjY2OTAtMlwiOiBcIkxldWtvY3l0ZXMgWyMvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3NzctM1wiOiBcIlBsYXRlbGV0cyBbIy92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc4OS04XCI6IFwiRXJ5dGhyb2N5dGVzIFsjL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzg1LTZcIjogXCJNQ0ggW0VudGl0aWMgbWFzc10gYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzExLTJcIjogXCJFb3Npbm9waGlscyBbIy92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjQ1NDQtM1wiOiBcIkhlbWF0b2NyaXQgW1ZvbHVtZSBGcmFjdGlvbl0gb2YgQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNTcwMjEtOFwiOiBcIkNCQyBXIEF1dG8gRGlmZmVyZW50aWFsIHBhbmVsIC0gQmxvb2RcIixcbiAgXCIyNDMxNy0wXCI6IFwiSGVtb2dyYW0gYW5kIHBsYXRlbGV0cyBXTyBkaWZmZXJlbnRpYWwgcGFuZWwgLSBCbG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IC8gbGl2ZXIgLyByZW5hbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxOTIwLThcIjogXCJBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc0Mi02XCI6IFwiQWxhbmluZSBhbWlub3RyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMTYwLTBcIjogXCJDcmVhdGluaW5lIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjE2MS04XCI6IFwiQ3JlYXRpbmluZSBbTWFzcy92b2x1bWVdIGluIFVyaW5lXCIsXG4gIFwiMzM5MTQtM1wiOlxuICAgIFwiR2xvbWVydWxhciBmaWx0cmF0aW9uIHJhdGUgW1ZvbHVtZSBSYXRlL0FyZWFdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBDcmVhdGluaW5lLWJhc2VkIGZvcm11bGEgKE1EUkQpLzEuNzMgc3EgTVwiLFxuICBcIjMwOTQtMFwiOiBcIlVyZWEgbml0cm9nZW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMDg0LTFcIjogXCJVcmF0ZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI5NTEtMlwiOiBcIlNvZGl1bSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyODIzLTNcIjogXCJQb3Rhc3NpdW0gW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk3NS0yXCI6IFwiQmlsaXJ1YmluLnRvdGFsIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk2OC03XCI6IFwiQmlsaXJ1YmluLmRpcmVjdCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3NTEtN1wiOiBcIkFsYnVtaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyNTMyLTBcIjogXCJMYWN0YXRlIGRlaHlkcm9nZW5hc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjY3NjgtNlwiOiBcIkFsa2FsaW5lIHBob3NwaGF0YXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzI0LTJcIjogXCJHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc4NjEtNlwiOiBcIkNhbGNpdW0gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIExpcGlkIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjIwOTMtM1wiOiBcIkNob2xlc3Rlcm9sIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjU3MS04XCI6IFwiVHJpZ2x5Y2VyaWRlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjA4NS05XCI6IFwiQ2hvbGVzdGVyb2wgaW4gSERMIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTM0NTctN1wiOiBcIkNob2xlc3Rlcm9sIGluIExETCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBjYWxjdWxhdGlvblwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVGh5cm9pZCAvIGhvcm1vbmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjMwMTYtM1wiOiBcIlRoeXJvdHJvcGluIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMwMjQtN1wiOiBcIlRoeXJveGluZSAoVDQpIGZyZWUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNDkyMC0zXCI6IFwiVGh5cm94aW5lIChUNCkgZnJlZSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyOTg2LThcIjogXCJUZXN0b3N0ZXJvbmUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCI4MzA5OC00XCI6IFwiRm9sbGl0cm9waW4gW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIFwiODMwOTYtOFwiOiBcIkVzdHJhZGlvbCAoRTIpIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkaWFjIC8gaW5mbGFtbWF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEwODM5LTlcIjogXCJUcm9wb25pbiBJLmNhcmRpYWMgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMzc2Mi02XCI6IFwiTmF0cml1cmV0aWMgcGVwdGlkZS5CIHByb2hvcm1vbmUgTi1UZXJtaW5hbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5ODgtNVwiOiBcIkMgcmVhY3RpdmUgcHJvdGVpbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMzOTU5LThcIjogXCJQcm9jYWxjaXRvbmluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgLyBzZXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI1MTk1LTNcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCI1MTk2LTFcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtVbml0cy92b2x1bWVdIGluIFNlcnVtXCIsXG4gIFwiMTYxMjgtMVwiOiBcIkhlcGF0aXRpcyBDIHZpcnVzIEFiIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCIxMzk1NS0wXCI6IFwiSGVwYXRpdGlzIEMgdmlydXMgQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENvYWd1bGF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjYzMDEtNlwiOiBcIklOUiBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYSBieSBDb2FndWxhdGlvbiBhc3NheVwiLFxuICBcIjE0OTc5LTlcIjogXCJhUFRUIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hIGJ5IENvYWd1bGF0aW9uIGFzc2F5XCIsXG4gIFwiMzAyNDAtNlwiOiBcIkZpYnJpbiBELWRpbWVyIFtNYXNzL3ZvbHVtZV0gaW4gUGxhdGVsZXQgcG9vciBwbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIFZpdGFsIHNpZ25zIChJSEtFMzQwMikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiODMwMi0yXCI6IFwiQm9keSBoZWlnaHRcIixcbiAgXCIyOTQ2My03XCI6IFwiQm9keSB3ZWlnaHRcIixcbiAgXCIzOTE1Ni01XCI6IFwiQm9keSBtYXNzIGluZGV4IChCTUkpIFtSYXRpb11cIixcbiAgXCI4MjgwLTBcIjogXCJXYWlzdCBDaXJjdW1mZXJlbmNlIGF0IHVtYmlsaWN1cyBieSBUYXBlIG1lYXN1cmVcIixcbiAgXCI4NDgwLTZcIjogXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiLFxuICBcIjg0NjItNFwiOiBcIkRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiLFxuICBcIjg1MzU0LTlcIjogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbCB3aXRoIGFsbCBjaGlsZHJlbiBvcHRpb25hbFwiLFxufTtcbiIsICIvKipcbiAqIFB1cmUgcGFyc2luZyBoZWxwZXJzIFx1MjAxNCByZWZlcmVuY2UgcmFuZ2UsIHF1YW50aXR5LCBVQ1VNIHVuaXQgbm9ybWFsaXNhdGlvbi5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvX3BhcnNlcnMucHlgLiBTZWxmLWNvbnRhaW5lZDogbm8gZGVwZW5kZW5jaWVzXG4gKiBvbiBvdGhlciBvYnNlcnZhdGlvbiBtb2R1bGUgcGllY2VzLlxuICpcbiAqIFB1YmxpYyBBUEk6XG4gKiAgIHRvVWN1bSh1bml0KSAgICAgICAgICAgICAgICAgIFx1MjE5MiBjYW5vbmljYWwgVUNVTSB1bml0IHN0cmluZyAob3IgbnVsbClcbiAqICAgcGFyc2VSYW5nZU11bHRpKHJhdywgdW5pdCkgICAgXHUyMTkyIGxpc3Qgb2YgRkhJUiByZWZlcmVuY2VSYW5nZSBlbnRyaWVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9uZSBwZXIgc2V4IHdoZW4gc2V4LXN0cmF0aWZpZWQpXG4gKiAgIHBhcnNlUmFuZ2UocmF3LCB1bml0KSAgICAgICAgIFx1MjE5MiBzaW5nbGUgcmVmZXJlbmNlUmFuZ2UgZW50cnlcbiAqICAgdHJ5UGFyc2VRdWFudGl0eShyYXcsIHVuaXQpICAgXHUyMTkyIEZISVIgUXVhbnRpdHkgZGljdCBvciBudWxsXG4gKi9cblxuY29uc3QgVUNVTV9TWVNURU0gPSBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIjtcblxuLy8gRkhJUiBSNCBRdWFudGl0eS5jb21wYXJhdG9yIGFsbG93ZWQgdmFsdWVzLiBOb3JtYWxpc2UgZnVsbC13aWR0aCBDSktcbi8vIFx1RkYxRSBcdUZGMUMgXHUyMjY3IFx1MjI2NiArIEFTQ0lJIHZhcmlhbnRzIHNvIFwiXHVGRjFFIDQwLjBcIiBzdGlsbCBwYXJzZXMgYXMgYSByZWFsIG51bWJlclxuLy8gaW5zdGVhZCBvZiBmYWxsaW5nIHRocm91Z2ggdG8gdmFsdWVTdHJpbmcgKHdoaWNoIGxvc2VzIHRoZSB1bml0KS5cbmNvbnN0IEZVTExXSURUSF9PUFM6IFJlYWRvbmx5QXJyYXk8W3N0cmluZywgc3RyaW5nXT4gPSBbXG4gIFtcIlx1RkYxRVwiLCBcIj5cIl0sXG4gIFtcIlx1RkYxQ1wiLCBcIjxcIl0sXG4gIFtcIlx1MjI2N1wiLCBcIj49XCJdLFxuICBbXCJcdTIyNjZcIiwgXCI8PVwiXSxcbiAgW1wiXHUyMjY1XCIsIFwiPj1cIl0sXG4gIFtcIlx1MjI2NFwiLCBcIjw9XCJdLFxuXTtcblxuZnVuY3Rpb24gdHJhbnNsYXRlRnVsbHdpZHRoKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBvdXQgPSBzO1xuICBmb3IgKGNvbnN0IFtmcm9tLCB0b10gb2YgRlVMTFdJRFRIX09QUykge1xuICAgIGlmIChvdXQuaW5jbHVkZXMoZnJvbSkpIHtcbiAgICAgIG91dCA9IG91dC5zcGxpdChmcm9tKS5qb2luKHRvKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuY29uc3QgQ09NUEFSQVRPUl9SRSA9IC9eXFxzKig8PXw+PXw8fD4pXFxzKiguKykkLztcblxuLy8gUmVmZXJlbmNlLXJhbmdlIHBhcnNpbmcuIE5ISSBzaGlwcyB0aGUgcmFuZ2UgYXMgcGxhaW4gdGV4dCBsaWtlXG4vLyBcIlszLjg5XVsyNi44XVwiLCBcIls0MF1bXVwiLCBcIltOZWdhdGl2ZV1cIiBvciBcIkFNIDg6MDAgNi4yLTE5LjRcIi5cbmNvbnN0IFJSX0xPV0hJR0hfQlJBQ0tFVFMgPSAvXlxccypcXFtcXHMqKFteXFxdXSopXFxzKlxcXVxccypcXFtcXHMqKFteXFxdXSopXFxzKlxcXVxccyokLztcbmNvbnN0IFJSX0RBU0hfUkFOR0UgPSAvKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqWy1+XHUyMDEzXVxccyooLT9cXGQrKD86XFwuXFxkKyk/KS87XG5jb25zdCBSUl9DT01QQVJBVE9SID0gL15cXHMqKDw9fD49fDx8PilcXHMqKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqJC87XG4vLyBTZXgtc3RyYXRpZmllZCBicmFja2V0ZWQgcmFuZ2UsIGUuZy4gXCJcdTc1Mzc6MTMuNyBcdTU5NzM6MTEuMVwiIFx1MjAxNCB1c2VkIGJ5IHNvbWVcbi8vIGhvc3BpdGFscyBmb3IgaGFlbWF0b2xvZ3kgKEhiLCBSQkMsIEhjdCkuIFB1bGxzIG91dCAoc2V4LCB2YWx1ZSkgcGFpcnMuXG4vLyBUb2xlcmF0ZXMgb3B0aW9uYWwgY29tcGFyYXRvciAoXHUyMjY3L1x1MjI2Ni8+LzwpIGJlZm9yZSB0aGUgbnVtYmVyLlxuY29uc3QgUlJfU0VYX05VTV9HID0gLyhcdTc1MzdcdTYwMjd8XHU1OTczXHU2MDI3fFx1NzUzN3xcdTU5NzN8TXxGKVxccypbOlx1RkYxQV0/XFxzKig/Ols8Plx1MjI2N1x1MjI2Nl09Pyk/XFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pL2c7XG5jb25zdCBSUl9TSU5HTEVfQlJBQ0tFVCA9IC9eXFxzKlxcW1xccyooLis/KVxccypcXF1cXHMqJC87XG5jb25zdCBSUl9RVUFMSVRBVElWRV9QQVJFTiA9XG4gIC9eXFxzKihOb3JtYWx8XHU2QjYzXHU1RTM4fE5vbnJlYWN0aXZlfE5vbi1yZWFjdGl2ZSlcXHMqXFwoXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlxcKVxccyokL2k7XG5cbmNvbnN0IFNFWF9UT19GSElSOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgXHU3NTM3XHU2MDI3OiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgXHU3NTM3OiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgTTogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIFx1NTk3M1x1NjAyNzogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxuICBcdTU5NzM6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbiAgRjogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxufTtcblxuLy8gUHVibGljIHR5cGVzIFx1MjAxNCBGSElSIFF1YW50aXR5IC8gcmVmZXJlbmNlUmFuZ2Ugc2hhcGVzIHVzZWQgZG93bnN0cmVhbS5cbmV4cG9ydCBpbnRlcmZhY2UgUXVhbnRpdHkge1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0Pzogc3RyaW5nO1xuICBzeXN0ZW0/OiBzdHJpbmc7XG4gIGNvZGU/OiBzdHJpbmc7XG4gIGNvbXBhcmF0b3I/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmFuZ2VFbnRyeSB7XG4gIHRleHQ6IHN0cmluZztcbiAgbG93PzogUXVhbnRpdHk7XG4gIGhpZ2g/OiBRdWFudGl0eTtcbiAgYXBwbGllc1RvPzogQXJyYXk8e1xuICAgIGNvZGluZzogQXJyYXk8eyBzeXN0ZW06IHN0cmluZzsgY29kZTogc3RyaW5nOyBkaXNwbGF5OiBzdHJpbmcgfT47XG4gICAgdGV4dDogc3RyaW5nO1xuICB9Pjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFVDVU0gbm9ybWFsaXNhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBOSEkgbGFicyByZXBvcnQgdW5pdHMgaW4gYSBtaXggb2YgVUNVTS1jbGVhbiBzdHJpbmdzICgnbWcvZEwnKSxcbiAqIFRhaXdhbi1zdHlsZSBlcXVpdmFsZW50cyAoJ21FcS9MJyB2cyBVQ1VNICdtZXEvTCcpLCBmdWxsLXdpZHRoIHB1bmN0dWF0aW9uXG4gKiAoJ1x1RkYwNScgdnMgJyUnKSwgYW5kIHBsYWNlaG9sZGVyIHRleHQgKCdcdTcxMjEnKS4gVGhlIFRXTkhJRkhJUiB2YWxpZGF0b3JcbiAqIHJlamVjdHMgZXZlcnl0aGluZyBleGNlcHQgY2Fub25pY2FsIFVDVU0gaW4gUXVhbnRpdHkuY29kZSwgc28gd2VcbiAqIG5vcm1hbGlzZS4gYG51bGxgIG1lYW5zIFwib21pdCBRdWFudGl0eS5jb2RlIGVudGlyZWx5XCIuXG4gKi9cbmNvbnN0IFVDVU1fT1ZFUlJJREVTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudWxsPiA9IHtcbiAgLy8gRnVsbHdpZHRoIFx1MjE5MiBBU0NJSVxuICBcIlx1RkYwNVwiOiBcIiVcIixcbiAgLy8gQ2FzZS1zZW5zaXRpdmUgVUNVTSAoRXEgaXMgJ2VxJywgbm90ICdFcScpXG4gIFwibUVxL0xcIjogXCJtZXEvTFwiLFxuICBcIm1lcS9sXCI6IFwibWVxL0xcIixcbiAgLy8gQlAgcHJvZmlsZSBmaXhlZC12YWx1ZTogbW1bSGddIG5vdCBtbUhnXG4gIG1tSGc6IFwibW1bSGddXCIsXG4gIE1NSEc6IFwibW1bSGddXCIsXG4gIC8vIENvbW1vbiBDaGluZXNlICdubyB1bml0JyBwbGFjZWhvbGRlcnMgXHUyMTkyIGRyb3AgVUNVTSBjb2RlXG4gIFx1NzEyMTogbnVsbCxcbiAgXCJcIjogbnVsbCxcbiAgXCJcdTIwMTRcIjogbnVsbCxcbiAgXCItXCI6IG51bGwsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdG9VY3VtKHVuaXQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF1bml0KSByZXR1cm4gbnVsbDtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChVQ1VNX09WRVJSSURFUywgdW5pdCkpIHtcbiAgICByZXR1cm4gVUNVTV9PVkVSUklERVNbdW5pdF0gPz8gbnVsbDtcbiAgfVxuICByZXR1cm4gdW5pdDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFF1YW50aXR5IGJ1aWxkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIG1ha2VRdWFudGl0eSh2YWx1ZTogbnVtYmVyLCB1bml0OiBzdHJpbmcpOiBRdWFudGl0eSB7XG4gIGNvbnN0IHE6IFF1YW50aXR5ID0geyB2YWx1ZSB9O1xuICBpZiAodW5pdCkge1xuICAgIHEudW5pdCA9IHVuaXQ7XG4gICAgcS5zeXN0ZW0gPSBVQ1VNX1NZU1RFTTtcbiAgICBxLmNvZGUgPSB1bml0O1xuICB9XG4gIHJldHVybiBxO1xufVxuXG5mdW5jdGlvbiB0cnlQYXJzZUZsb2F0KHM6IHN0cmluZyk6IG51bWJlciB8IG51bGwge1xuICBpZiAocyA9PT0gXCJcIiB8fCBzID09IG51bGwpIHJldHVybiBudWxsO1xuICAvLyBNaXJyb3IgUHl0aG9uJ3MgZmxvYXQoKSBcdTIwMTQgYWxsb3cgbGVhZGluZy90cmFpbGluZyB3aGl0ZXNwYWNlLFxuICAvLyBvcHRpb25hbCBzaWduLCBkZWNpbWFsLiBSZWplY3QgaWYgTmFOIE9SIGlmIGFueSBub24tbnVtZXJpYyByZXNpZHVhbFxuICAvLyAoTnVtYmVyKFwiMTJhYmNcIikgcmV0dXJucyBOYU4sIE9LOyBcIjEyICBhYmNcIiBhbHNvIE5hTiwgT0spLlxuICBjb25zdCB0cmltbWVkID0gcy50cmltKCk7XG4gIGlmICh0cmltbWVkID09PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbiA9IE51bWJlcih0cmltbWVkKTtcbiAgaWYgKE51bWJlci5pc05hTihuKSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBuO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgcGFyc2VSYW5nZU11bHRpIC8gcGFyc2VSYW5nZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBMaXN0IHZhcmlhbnQgb2YgcGFyc2VSYW5nZTogZW1pdHMgb25lIGVudHJ5IHBlciBzZXggd2hlbiB0aGUgcmFuZ2UgaXNcbiAqIHNleC1zdHJhdGlmaWVkIChcIltcdTc1Mzc6MTMuNyBcdTU5NzM6MTEuMV1bXHU3NTM3OjE3LjAgXHU1OTczOjE1LjBdXCIpLCBvdGhlcndpc2UgYVxuICogc2luZ2xlLWVsZW1lbnQgbGlzdC4gRWFjaCBlbnRyeSB0YWdnZWQgd2l0aCBhcHBsaWVzVG8gc28gZG93bnN0cmVhbVxuICogY29kZSBjYW4gcGljayB0aGUgcmlnaHQgb25lIGZvciB0aGUgcGF0aWVudCdzIHNleC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmFuZ2VNdWx0aShyYXdSYW5nZTogc3RyaW5nLCB1bml0OiBzdHJpbmcpOiBSYW5nZUVudHJ5W10ge1xuICBjb25zdCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKChyYXdSYW5nZSB8fCBcIlwiKS50cmltKCkpO1xuICBpZiAoIXMpIHJldHVybiBbXTtcblxuICBjb25zdCBsb3dCeVNleDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBjb25zdCBoaWdoQnlTZXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgbGV0IHVzZWRNdWx0aSA9IGZhbHNlO1xuXG4gIGNvbnN0IG0gPSBzLm1hdGNoKFJSX0xPV0hJR0hfQlJBQ0tFVFMpO1xuICBpZiAobSkge1xuICAgIGNvbnN0IGxvd0Jsb2IgPSBtWzFdID8/IFwiXCI7XG4gICAgY29uc3QgaGlnaEJsb2IgPSBtWzJdID8/IFwiXCI7XG4gICAgZm9yIChjb25zdCBzbSBvZiBsb3dCbG9iLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgIGlmIChzbVsxXSAmJiBzbVsyXSkgbG93QnlTZXhbc21bMV1dID0gc21bMl07XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc20gb2YgaGlnaEJsb2IubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgaWYgKHNtWzFdICYmIHNtWzJdKSBoaWdoQnlTZXhbc21bMV1dID0gc21bMl07XG4gICAgfVxuICAgIHVzZWRNdWx0aSA9IE9iamVjdC5rZXlzKGxvd0J5U2V4KS5sZW5ndGggPiAwIHx8IE9iamVjdC5rZXlzKGhpZ2hCeVNleCkubGVuZ3RoID4gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBTaW5nbGUtYnJhY2tldDogZWFjaCBwZXItc2V4IHZhbHVlJ3MgY29tcGFyYXRvciBkZWNpZGVzIGxvdyB2cyBoaWdoLlxuICAgIGNvbnN0IHNpbmdsZSA9IHMubWF0Y2goUlJfU0lOR0xFX0JSQUNLRVQpO1xuICAgIGlmIChzaW5nbGUpIHtcbiAgICAgIGNvbnN0IGlubmVyID0gc2luZ2xlWzFdID8/IFwiXCI7XG4gICAgICBmb3IgKGNvbnN0IHNtIG9mIGlubmVyLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgICAgY29uc3Qgc2V4S2V5ID0gc21bMV0gPz8gXCJcIjtcbiAgICAgICAgY29uc3QgdmFsU3RyID0gc21bMl0gPz8gXCJcIjtcbiAgICAgICAgLy8gRmluZCB0aGUgY29tcGFyYXRvciBpbW1lZGlhdGVseSBwcmVjZWRpbmcgdGhpcyBudW1iZXIuXG4gICAgICAgIC8vIE1pcnJvciB0aGUgUHl0aG9uOiByZWJ1aWxkIGEgcGVyLXNleC1rZXkgc2VhcmNoLlxuICAgICAgICBjb25zdCBwYXQgPSBuZXcgUmVnRXhwKGAke2VzY2FwZVJlZ2V4KHNleEtleSl9XFxcXHMqWzpcdUZGMUFdP1xcXFxzKihbPD5cdTIyNjdcdTIyNjZdPT8pP1xcXFxzKi0/XFxcXGRgKTtcbiAgICAgICAgY29uc3QgY20gPSBpbm5lci5tYXRjaChwYXQpO1xuICAgICAgICBjb25zdCBvcCA9IGNtPy5bMV0gPz8gXCJcIjtcbiAgICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgICAgbG93QnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfSBlbHNlIGlmIChvcCA9PT0gXCI8XCIgfHwgb3AgPT09IFwiPD1cIikge1xuICAgICAgICAgIGhpZ2hCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvd0J5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHVzZWRNdWx0aSA9IE9iamVjdC5rZXlzKGxvd0J5U2V4KS5sZW5ndGggPiAwIHx8IE9iamVjdC5rZXlzKGhpZ2hCeVNleCkubGVuZ3RoID4gMDtcbiAgICB9XG4gIH1cblxuICBpZiAodXNlZE11bHRpKSB7XG4gICAgY29uc3QgZW50cmllczogUmFuZ2VFbnRyeVtdID0gW107XG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSB1bmlvbiBvZiBrZXlzIGFjdHVhbGx5IHNlZW4gXHUyMDE0IHByZXNlcnZlIGluc2VydGlvbiBvcmRlci5cbiAgICBjb25zdCBhbGxTZXhLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgayBvZiBbLi4uT2JqZWN0LmtleXMobG93QnlTZXgpLCAuLi5PYmplY3Qua2V5cyhoaWdoQnlTZXgpXSkge1xuICAgICAgaWYgKCFhbGxTZXhLZXlzLmluY2x1ZGVzKGspKSBhbGxTZXhLZXlzLnB1c2goayk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc2V4S2V5IG9mIGFsbFNleEtleXMpIHtcbiAgICAgIGNvbnN0IG1hcHBpbmcgPSBTRVhfVE9fRkhJUltzZXhLZXldO1xuICAgICAgaWYgKCFtYXBwaW5nKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IFtmaGlyQ29kZSwgZmhpckRpc3BsYXldID0gbWFwcGluZztcbiAgICAgIGNvbnN0IGVudHJ5OiBSYW5nZUVudHJ5ID0ge1xuICAgICAgICB0ZXh0OiByYXdSYW5nZSxcbiAgICAgICAgYXBwbGllc1RvOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2hsNy5vcmcvZmhpci9hZG1pbmlzdHJhdGl2ZS1nZW5kZXJcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBmaGlyQ29kZSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmaGlyRGlzcGxheSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB0ZXh0OiBmaGlyRGlzcGxheSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfTtcbiAgICAgIGlmIChzZXhLZXkgaW4gbG93QnlTZXgpIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQobG93QnlTZXhbc2V4S2V5XSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgICAgaWYgKHNleEtleSBpbiBoaWdoQnlTZXgpIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoaGlnaEJ5U2V4W3NleEtleV0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgICBlbnRyaWVzLnB1c2goZW50cnkpO1xuICAgIH1cbiAgICBpZiAoZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBEZS1kdXAgYnkgRkhJUiBzZXggY29kZSBpbiBjYXNlIGlucHV0IGhhcyBib3RoIFx1NzUzNyBhbmQgXHU3NTM3XHU2MDI3LlxuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgY29uc3Qgb3V0OiBSYW5nZUVudHJ5W10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgZSBvZiBlbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IGMgPSBlLmFwcGxpZXNUbz8uWzBdPy5jb2RpbmdbMF0/LmNvZGU7XG4gICAgICAgIGlmICghYyB8fCBzZWVuLmhhcyhjKSkgY29udGludWU7XG4gICAgICAgIHNlZW4uYWRkKGMpO1xuICAgICAgICBvdXQucHVzaChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb25lID0gcGFyc2VSYW5nZShyYXdSYW5nZSwgdW5pdCk7XG4gIHJldHVybiBvbmUgPyBbb25lXSA6IFtdO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSByZWZlcmVuY2UtcmFuZ2UgdGV4dCBpbnRvIGEgRkhJUiByZWZlcmVuY2VSYW5nZSBlbnRyeS5cbiAqXG4gKiBTdHJhdGVneSBpbiBvcmRlcjpcbiAqICAgMS4gXCJbbG93XVtoaWdoXVwiIGJyYWNrZXRlZCBmb3JtYXQgXHUyMDE0IE5ISSdzIGNhbm9uaWNhbCBzaGFwZS5cbiAqICAgMi4gXCIzLjg5LTI2LjhcIiAvIFwiMy44OX4yNi44XCIgZGFzaCByYW5nZS5cbiAqICAgMy4gXCI+IDQwXCIgLyBcIjwgMC41XCIgc2luZ2xlLXNpZGVkLlxuICogICA0LiBRdWFsaXRhdGl2ZSAoXCJOZWdhdGl2ZVwiLCBcIkFNIDg6MDAgNi4yLTE5LjRcIikgXHUyMDE0IHRleHQtb25seS5cbiAqXG4gKiBTZXgtc3RyYXRpZmllZCBzaGFwZXMgZ28gdGhyb3VnaCBwYXJzZVJhbmdlTXVsdGkuIFJldHVybnMgbnVsbCBvbmx5XG4gKiBmb3IgZW1wdHkgaW5wdXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlKHJhd1JhbmdlOiBzdHJpbmcsIHVuaXQ6IHN0cmluZyk6IFJhbmdlRW50cnkgfCBudWxsIHtcbiAgY29uc3QgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aCgocmF3UmFuZ2UgfHwgXCJcIikudHJpbSgpKTtcbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZW50cnk6IFJhbmdlRW50cnkgPSB7IHRleHQ6IHJhd1JhbmdlIH07XG5cbiAgY29uc3QgbSA9IHMubWF0Y2goUlJfTE9XSElHSF9CUkFDS0VUUyk7XG4gIGlmIChtKSB7XG4gICAgY29uc3QgbG8gPSAobVsxXSA/PyBcIlwiKS50cmltKCk7XG4gICAgY29uc3QgaGkgPSAobVsyXSA/PyBcIlwiKS50cmltKCk7XG4gICAgZm9yIChjb25zdCBbc2lkZSwgc2lkZVZhbF0gb2YgW1xuICAgICAgW1wibG93XCIsIGxvXSxcbiAgICAgIFtcImhpZ2hcIiwgaGldLFxuICAgIF0gYXMgY29uc3QpIHtcbiAgICAgIGlmICghc2lkZVZhbCB8fCBzaWRlVmFsID09PSBcIlx1NzEyMVwiIHx8IHNpZGVWYWwgPT09IFwiXHU3QTdBXHU3NjdEXCIpIGNvbnRpbnVlO1xuXG4gICAgICAvLyAxLiBQbGFpbiBmbG9hdFxuICAgICAgY29uc3QgYXNGbG9hdCA9IHRyeVBhcnNlRmxvYXQoc2lkZVZhbCk7XG4gICAgICBpZiAoYXNGbG9hdCAhPT0gbnVsbCkge1xuICAgICAgICBlbnRyeVtzaWRlXSA9IG1ha2VRdWFudGl0eShhc0Zsb2F0LCB1bml0KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIDIuIERhc2ggcmFuZ2UgXHUyMDE0IG1lYW5pbmdmdWwgb25seSBmb3IgYGxvd2Agc2xvdDsgc3BsaXRzIGludG8gbG93K2hpZ2guXG4gICAgICBjb25zdCBkbSA9IHNpZGVWYWwubWF0Y2goUlJfREFTSF9SQU5HRSk7XG4gICAgICBpZiAoZG0gJiYgc2lkZSA9PT0gXCJsb3dcIiAmJiBlbnRyeS5oaWdoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdjEgPSB0cnlQYXJzZUZsb2F0KGRtWzFdISk7XG4gICAgICAgIGNvbnN0IHYyID0gdHJ5UGFyc2VGbG9hdChkbVsyXSEpO1xuICAgICAgICBpZiAodjEgIT09IG51bGwgJiYgdjIgIT09IG51bGwpIHtcbiAgICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodjEsIHVuaXQpO1xuICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodjIsIHVuaXQpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDMuIENvbXBhcmF0b3IgKFx1MjI2NzYwLCA8PTAuMDQgZXRjLilcbiAgICAgIGNvbnN0IGNtID0gc2lkZVZhbC5tYXRjaChSUl9DT01QQVJBVE9SKTtcbiAgICAgIGlmIChjbSkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChjbVsyXSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IG9wID0gY21bMV07XG4gICAgICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIFwiTm9ybWFsICggWCApXCIgLyBcIk5vbnJlYWN0aXZlICggWCApXCIgXHUyMDE0IFggaXMgdGhlIGN1dG9mZiAoaGlnaCBib3VuZCkuXG4gICAgICBjb25zdCBxbSA9IHNpZGVWYWwubWF0Y2goUlJfUVVBTElUQVRJVkVfUEFSRU4pO1xuICAgICAgaWYgKHFtKSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KHFtWzJdISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBjb25zdCBkYXNoTWF0Y2ggPSBzLm1hdGNoKFJSX0RBU0hfUkFOR0UpO1xuICBpZiAoZGFzaE1hdGNoKSB7XG4gICAgY29uc3QgdjEgPSB0cnlQYXJzZUZsb2F0KGRhc2hNYXRjaFsxXSEpO1xuICAgIGNvbnN0IHYyID0gdHJ5UGFyc2VGbG9hdChkYXNoTWF0Y2hbMl0hKTtcbiAgICBpZiAodjEgIT09IG51bGwgJiYgdjIgIT09IG51bGwpIHtcbiAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2MSwgdW5pdCk7XG4gICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYyLCB1bml0KTtcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgY29uc3QgY21wTWF0Y2ggPSBzLm1hdGNoKFJSX0NPTVBBUkFUT1IpO1xuICBpZiAoY21wTWF0Y2gpIHtcbiAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChjbXBNYXRjaFsyXSEpO1xuICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBvcCA9IGNtcE1hdGNoWzFdO1xuICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIC8vIEZhbGwgdGhyb3VnaDogcXVhbGl0YXRpdmUgb3IgY29tcGxleCBcdTIwMTQgdGV4dC1vbmx5IGlzIEZISVItY29ycmVjdC5cbiAgcmV0dXJuIGVudHJ5O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgdHJ5UGFyc2VRdWFudGl0eSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBQYXJzZSBcIj4gNDAuMFwiIC8gXCI8MC4wMTBcIiAvIFwiMSwyMzQuNVwiIFx1MjE5MiBGSElSIFF1YW50aXR5IHdpdGggY29tcGFyYXRvci5cbiAqIFJldHVybnMgbnVsbCB3aGVuIHRoZSByZXNpZHVhbCBhZnRlciBzdHJpcHBpbmcgYSBjb21wYXJhdG9yIHN0aWxsXG4gKiBpc24ndCBudW1lcmljIFx1MjAxNCBjYWxsZXIgZmFsbHMgYmFjayB0byB2YWx1ZVN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyeVBhcnNlUXVhbnRpdHkoXG4gIHJhd1ZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkLFxuICB1bml0OiBzdHJpbmcsXG4pOiBRdWFudGl0eSB8IG51bGwge1xuICBpZiAocmF3VmFsdWUgPT09IG51bGwgfHwgcmF3VmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XG4gIGxldCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKFN0cmluZyhyYXdWYWx1ZSkudHJpbSgpKTtcbiAgbGV0IGNvbXBhcmF0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjb25zdCBjbSA9IHMubWF0Y2goQ09NUEFSQVRPUl9SRSk7XG4gIGlmIChjbSkge1xuICAgIGNvbXBhcmF0b3IgPSBjbVsxXSA/PyBudWxsO1xuICAgIHMgPSAoY21bMl0gPz8gXCJcIikudHJpbSgpO1xuICB9XG4gIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KHMucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gIGlmICh2ID09PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB1Y3VtQ29kZSA9IHRvVWN1bSh1bml0KTtcbiAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICB2YWx1ZTogdixcbiAgICBzeXN0ZW06IFVDVU1fU1lTVEVNLFxuICB9O1xuICAvLyBRdWFudGl0eS51bml0IChodW1hbi1yZWFkYWJsZSkga2VlcHMgdGhlIG9yaWdpbmFsIE5ISSBsYWJlbCBzbyB1c2Vyc1xuICAvLyBzdGlsbCBzZWUgJ1x1RkYwNScgb3IgJ21FcS9MJyByYXcuIFF1YW50aXR5LmNvZGUgaXMgc3RyaWN0IFVDVU0gbWFjaGluZVxuICAvLyBjb2RlLiBEcm9wIHVuaXQgZGlzcGxheSB3aGVuIGVtcHR5IHNvIHdlIGRvbid0IGVtaXQgXCJ1bml0XCI6IFwiXCIuXG4gIGlmICh1bml0KSB7XG4gICAgcXR5LnVuaXQgPSB1bml0O1xuICB9XG4gIGlmICh1Y3VtQ29kZSAhPT0gbnVsbCkge1xuICAgIHF0eS5jb2RlID0gdWN1bUNvZGU7XG4gIH1cbiAgaWYgKGNvbXBhcmF0b3IpIHtcbiAgICBxdHkuY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gIH1cbiAgcmV0dXJuIHF0eTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cbiIsICIvKipcbiAqIE9ic2VydmF0aW9uIG1hcHBlciBcdTIwMTQgc2luZ2xlLXJvdyBhbmQgcGFuZWwtZ3JvdXBlZCB2YXJpYW50cy5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvb2JzZXJ2YXRpb24ucHlgICgxMjEyIGxpbmVzKS4gSW5jbHVkZXM6XG4gKiAgIC0gbWFwT2JzZXJ2YXRpb24ocmF3LCBwYXRpZW50SWQpIFx1MjE5MiBzaW5nbGUgT2JzZXJ2YXRpb25cbiAqICAgLSBtYXBPYnNlcnZhdGlvbnNHcm91cGVkKGl0ZW1zLCBwYXRpZW50SWQpIFx1MjE5MiBEaWFnbm9zdGljUmVwb3J0ICsgT2JzZXJ2YXRpb25zXG4gKiAgIC0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIFx1MjAxNCBjcm9zcy1wYWdlIGRlZHVwIGtleVxuICogICAtIGZpbmRMb2luYywgYnVpbGRDb2RpbmdzLCBtYXBJbnRlcnByZXRhdGlvbiwgZGVyaXZlSW50ZXJwcmV0YXRpb25cbiAqICAgLSBkZWR1cGVDcm9zc0Zvcm1hdCwgY29tYmluZUJwSXRlbXMsIGdyb3VwQnlPcmRlckNvZGVcbiAqICAgLSBpbmZlclNwZWNpbWVuXG4gKlxuICogRnVuY3Rpb25hbCBwYXJpdHkgd2l0aCB0aGUgUHl0aG9uIGltcGxlbWVudGF0aW9uIGlzIHRoZSBnb2FsLiBGaWVsZFxuICogb3JkZXIgaW4gdGhlIGVtaXR0ZWQgcmVzb3VyY2VzIG1heSBkaWZmZXIgKEpTIG9iamVjdCBsaXRlcmFsIG9yZGVyKVxuICogYnV0IGNvbnRlbnQgaXMgaWRlbnRpY2FsLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQge1xuICBESVNQTEFZX0ZJUlNUX0NPREVTLFxuICBMT0lOQ19ESVNQTEFZLFxuICBMT0lOQ19NQVAsXG4gIE5ISV9UT19MT0lOQyxcbiAgUEFORUxfTE9JTkNfTUFQLFxufSBmcm9tIFwiLi9sb2luYy10YWJsZXNcIjtcbmltcG9ydCB7XG4gIHR5cGUgUXVhbnRpdHksXG4gIHR5cGUgUmFuZ2VFbnRyeSxcbiAgcGFyc2VSYW5nZSxcbiAgcGFyc2VSYW5nZU11bHRpLFxuICB0b1VjdW0sXG4gIHRyeVBhcnNlUXVhbnRpdHksXG59IGZyb20gXCIuL3BhcnNlcnNcIjtcblxuLy8gXHUyNTAwXHUyNTAwIEltYWdpbmcgZGV0ZWN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBJTUFHSU5HX0tFWVdPUkRTOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBbXG4gIFwidWx0cmFzb3VuZFwiLFxuICBcInNvbm9ncmFtXCIsXG4gIFwic29ub2dyYXBoeVwiLFxuICBcImVjaG9cIixcbiAgXCJjdCBcIixcbiAgXCJjdC9cIixcbiAgXCJjdC1cIixcbiAgXCJjb21wdXRlZCB0b21vZ3JhcGh5XCIsXG4gIFwibXJpXCIsXG4gIFwibWFnbmV0aWMgcmVzb25hbmNlXCIsXG4gIFwieC1yYXlcIixcbiAgXCJ4cmF5XCIsXG4gIFwieCByYXlcIixcbiAgXCJtYW1tb2dyYXBoeVwiLFxuICBcIm1hbW1vXCIsXG4gIFwiZWtnXCIsXG4gIFwiZWNnXCIsXG4gIFwiZWxlY3Ryb2NhcmRpb2dyYW1cIixcbiAgXCJlbmRvc2NvcFwiLFxuICBcImNvbG9ub3Njb3BcIixcbiAgXCJnYXN0cm9zY29wXCIsXG4gIFwiYnJvbmNob3Njb3BcIixcbiAgXCJwZXQvY3RcIixcbiAgXCJwZXQgXCIsXG4gIFwic3BlY3RcIixcbiAgXCJcdTVGNzFcdTUwQ0ZcIixcbiAgXCJcdThEODVcdTk3RjNcdTZDRTJcIixcbiAgXCJcdTk2RkJcdTgxNjZcdTY1QjdcdTVDNjRcIixcbiAgXCJcdTY4MzhcdTc4QzFcdTUxNzFcdTYzMkZcIixcbiAgXCJcdTVGQzNcdTk2RkJcdTU3MTZcIixcbiAgXCJcdTUxNjdcdTg5OTZcdTkzRTFcIixcbiAgXCJcdTRFNzNcdTYyM0ZcdTY1MURcdTVGNzFcIixcbl07XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheTogc3RyaW5nLCBjb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgaGF5c3RhY2sgPSBgJHtkaXNwbGF5fSAke2NvZGV9YC50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gSU1BR0lOR19LRVlXT1JEUy5zb21lKChrdykgPT4gaGF5c3RhY2suaW5jbHVkZXMoa3cpKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExPSU5DIGxvb2t1cCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTkhJX0xBQl9DT0RFX1JFID0gL15cXGR7NCw2fVtBLVpdJC87XG5cbmZ1bmN0aW9uIGlzQXNjaWlPbmx5KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocy5jaGFyQ29kZUF0KGkpID4gMTI3KSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cblxuLy8gQ2hlY2sgd2hldGhlciBhIHNpbmdsZSBMT0lOQ19NQVAga2V5IG1hdGNoZXMgdGhlIGxhYidzIGNvbWJpbmVkXG4vLyAoY29kZSArIGRpc3BsYXkpIHN0cmluZy4gVHdvIHJ1bGVzOlxuLy9cbi8vIDEuIEFTQ0lJIGtleXM6IGBcXGI8a2V5PlxcYmAgXHUyMDE0IHdvcmQgYm91bmRhcmllcyBvbiBCT1RIIHNpZGVzLiBUaGVcbi8vICAgIG5vLXRyYWlsaW5nLWJvdW5kYXJ5IHNlbWFudGljIG9mIHRoZSBvbGRlciBgXFxiPGtleT5gIG1hdGNoZXJcbi8vICAgIGNhdXNlZCBzaG9ydCBrZXlzIGxpa2UgXCJoYlwiIChIZW1vZ2xvYmluKSB0byBpbmNvcnJlY3RseSBtYXRjaFxuLy8gICAgbG9uZ2VyIHRlcm1zIGxpa2UgXCJoYnNhZ1wiIChIQnNBZykgYW5kIFwicGhvc3BoYXRlXCIgKG1hdGNoZWQgYnlcbi8vICAgIFwicGhcIikuIFJlcXVpcmluZyBhbiBlbmQgYm91bmRhcnkgbWVhbnMgXCJoYlwiIG9ubHkgbWF0Y2hlcyB3aGVuXG4vLyAgICBpdCBzdGFuZHMgYXMgaXRzIG93biB3b3JkLlxuLy9cbi8vIDIuIENKSyAvIG5vbi1BU0NJSSBrZXlzOiBwbGFpbiBzdWJzdHJpbmcgaW5jbHVkZXMoKS4gXFxiIGRvZXNuJ3Rcbi8vICAgIHNlbWFudGljYWxseSB3b3JrIGZvciBDSksgKG5vIHdvcmQtY2hhcmFjdGVyIGNsYXNzIGNvbmNlcHQpLlxuZnVuY3Rpb24gX2tleXdvcmRNYXRjaGVzKGtleTogc3RyaW5nLCBjb21iaW5lZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGsgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGlzQXNjaWlPbmx5KGtleSkpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGspfVxcXFxiYCkudGVzdChjb21iaW5lZCk7XG4gIH1cbiAgcmV0dXJuIGNvbWJpbmVkLmluY2x1ZGVzKGspO1xufVxuXG4vLyBQaWNrIHRoZSBMT05HRVNUIG1hdGNoaW5nIGtleSBmcm9tIHRoZSB0YWJsZSwgbm90IHRoZSBmaXJzdC4gQXZvaWRzXG4vLyB0aGUgc2FtZSBidWcgZmFtaWx5IGZyb20gYSBzZWNvbmQgYW5nbGU6IGh5cGhlbmF0ZWQga2V5cyBsaWtlXG4vLyBcImxkbC1jaG9sZXN0ZXJvbFwiIHNoYXJlIGEgYFxcYi4uLlxcYmAgYm91bmRhcnkgYXQgdGhlIGh5cGhlbiwgc28gXCJsZGxcIlxuLy8gKDMgY2hhcnMpIGFsc28gbWF0Y2hlcyBhIFwibGRsLWNob2xlc3Rlcm9sXCIgc3RyaW5nLiBMb25nZXN0LW1hdGNoXG4vLyBtYWtlcyB0aGUgbW9yZSBzcGVjaWZpYyBrZXkgd2luIHJlZ2FyZGxlc3Mgb2YgaW5zZXJ0aW9uIG9yZGVyLCBzb1xuLy8gdGhlIGJyaXR0bGUgXCJsb25nIG11c3QgYXBwZWFyIGJlZm9yZSBzaG9ydFwiIGNvbW1lbnRzIHNjYXR0ZXJlZFxuLy8gdGhyb3VnaCBMT0lOQ19NQVAgYmVjb21lIHVubmVjZXNzYXJ5LlxuZnVuY3Rpb24gX2ZpbmRMb25nZXN0TWF0Y2goXG4gIGNvbWJpbmVkOiBzdHJpbmcsXG4gIHRhYmxlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGxldCBiZXN0TG9pbmM6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgYmVzdEtleUxlbiA9IDA7XG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKHRhYmxlKSkge1xuICAgIGlmIChrZXkubGVuZ3RoID4gYmVzdEtleUxlbiAmJiBfa2V5d29yZE1hdGNoZXMoa2V5LCBjb21iaW5lZCkpIHtcbiAgICAgIGJlc3RMb2luYyA9IGxvaW5jO1xuICAgICAgYmVzdEtleUxlbiA9IGtleS5sZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiBiZXN0TG9pbmM7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkXG4gKiAgICAgIChsb25nZXN0LWtleSBtYXRjaCB3aW5zLCBib3RoLXNpZGUgd29yZCBib3VuZGFyaWVzIGVuZm9yY2VkKS5cbiAqICAgQy4gRmFsbGJhY2s6IHBhbmVsLWxldmVsIExPSU5DIGZyb20gTkhJX1RPX0xPSU5DIGlmIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMb2luYyhjb2RlOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAvLyBBLiBTaW5nbGUtdGVzdCBOSEkgY29kZSB3aW5zIG91dHJpZ2h0LlxuICBpZiAoY29kZSAmJiBjb2RlIGluIE5ISV9UT19MT0lOQyAmJiAhRElTUExBWV9GSVJTVF9DT0RFUy5oYXMoY29kZSkpIHtcbiAgICByZXR1cm4gTkhJX1RPX0xPSU5DW2NvZGVdID8/IG51bGw7XG4gIH1cblxuICBjb25zdCBjb21iaW5lZCA9IGAke2NvZGV9ICR7ZGlzcGxheX1gLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gQjEuIFBhbmVsLXNwZWNpZmljIGtleXdvcmQgbWFwIHJ1bnMgQkVGT1JFIHRoZSBnbG9iYWwgb25lLlxuICBpZiAoY29kZSBpbiBQQU5FTF9MT0lOQ19NQVApIHtcbiAgICBjb25zdCBoaXQgPSBfZmluZExvbmdlc3RNYXRjaChjb21iaW5lZCwgUEFORUxfTE9JTkNfTUFQW2NvZGVdISk7XG4gICAgaWYgKGhpdCkgcmV0dXJuIGhpdDtcbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGNvbnN0IGhpdCA9IF9maW5kTG9uZ2VzdE1hdGNoKGNvbWJpbmVkLCBMT0lOQ19NQVApO1xuICBpZiAoaGl0KSByZXR1cm4gaGl0O1xuXG4gIC8vIEMuIFBhbmVsIGNvZGUgd2l0aCBubyByZWNvZ25pc2VkIGl0ZW0gZGlzcGxheSBcdTIxOTIgZmFsbCBiYWNrLlxuICBpZiAoY29kZSAmJiBjb2RlIGluIE5ISV9UT19MT0lOQykge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBCdWlsZCB0aGUgT2JzZXJ2YXRpb24uY29kZS5jb2RpbmdbXSBsaXN0LlxuICogUHJpb3JpdHk6IExPSU5DIFx1MjE5MiBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBsb2NhbCBmYWxsYmFjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29kaW5ncyhcbiAgY29kZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgZGlzcGxheTogc3RyaW5nLFxuICBsb2luYzogc3RyaW5nIHwgbnVsbCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5bXSB7XG4gIGNvbnN0IGNvZGluZ3M6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5bXSA9IFtdO1xuICBpZiAobG9pbmMpIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgIGNvZGU6IGxvaW5jLFxuICAgICAgZGlzcGxheTogTE9JTkNfRElTUExBWVtsb2luY10gPz8gZGlzcGxheSxcbiAgICB9KTtcbiAgfVxuICBjb25zdCBjb2RlU3RyID0gKGNvZGUgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoY29kZVN0ciAmJiBOSElfTEFCX0NPREVfUkUudGVzdChjb2RlU3RyKSkge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERSxcbiAgICAgIGNvZGU6IGNvZGVTdHIsXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IHN5c3RlbXMuSElTX0xPQ0FMX0xBQl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0ciB8fCBkaXNwbGF5LFxuICAgICAgZGlzcGxheSxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gY29kaW5ncztcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEludGVycHJldGF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBJTlRFUlBfU1lTID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YzLU9ic2VydmF0aW9uSW50ZXJwcmV0YXRpb25cIjtcblxuZnVuY3Rpb24gaW50ZXJwQ29kaW5nKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gIHJldHVybiB7IHN5c3RlbTogSU5URVJQX1NZUywgY29kZSwgZGlzcGxheSB9O1xufVxuXG5jb25zdCBJTlRFUlBfVEFCTEU6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBoaWdoOiBbXCJIXCIsIFwiSGlnaFwiXSxcbiAgbG93OiBbXCJMXCIsIFwiTG93XCJdLFxuICBub3JtYWw6IFtcIk5cIiwgXCJOb3JtYWxcIl0sXG4gIGNyaXRpY2FsOiBbXCJBQVwiLCBcIkNyaXRpY2FsIGFibm9ybWFsXCJdLFxuICBhYm5vcm1hbDogW1wiQVwiLCBcIkFibm9ybWFsXCJdLFxuICBwb3NpdGl2ZTogW1wiUE9TXCIsIFwiUG9zaXRpdmVcIl0sXG4gIG5lZ2F0aXZlOiBbXCJORUdcIiwgXCJOZWdhdGl2ZVwiXSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBJbnRlcnByZXRhdGlvbihcbiAgaW50ZXJwOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICBjb25zdCBrZXkgPSAoaW50ZXJwID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGVudHJ5ID0gSU5URVJQX1RBQkxFW2tleV07XG4gIGlmICghZW50cnkpIHJldHVybiBudWxsO1xuICByZXR1cm4gaW50ZXJwQ29kaW5nKGVudHJ5WzBdLCBlbnRyeVsxXSk7XG59XG5cbi8vIFBvc2l0aXZlIG1hcmtlcnMgXHUyMDE0IFwidGhpcyBpcyBkZXRlY3RlZCAvIGFibm9ybWFsXCIuXG5jb25zdCBQT1NfTUFSS0VSUyA9XG4gIC9eXFxzKig/OnBvc2l0aXZlfHBvc3xyZWFjdGl2ZXxkZXRlY3RlZHxhYm5vcm1hbHxwcmVzZW50fHRyYWNlfFsxLTRdP1xccypcXCsoPzpcXHMqW1xcK1xcLV0pKilcXHMqKD86XFwoLipcXCkpP1xccyokL2k7XG5cbi8vIE5lZ2F0aXZlIG1hcmtlcnMgXHUyMDE0IGV4cGxpY2l0bHkgbm9ybWFsL2Fic2VudC5cbmNvbnN0IE5FR19NQVJLRVJTID1cbiAgL15cXHMqKD86bmVnYXRpdmV8bmVnfG5vbnJlYWN0aXZlfG5vblstXFxzXT9yZWFjdGl2ZXxub3RbLVxcc10/ZGV0ZWN0ZWR8bmR8YWJzZW50fG5vbmV8bm9ybWFsfDB8Wy1cdTIwMTRcdTIwMTNdKylcXHMqKD86XFwoLipcXCkpP1xccyokL2k7XG5cbmZ1bmN0aW9uIGNsYXNzaWZ5UXVhbGl0YXRpdmUodGV4dDogdW5rbm93bik6IFwicG9zXCIgfCBcIm5lZ1wiIHwgbnVsbCB7XG4gIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XG4gIGxldCBzID0gU3RyaW5nKHRleHQpLnRyaW0oKTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcIltcIikgJiYgcy5lbmRzV2l0aChcIl1cIikpIHtcbiAgICBzID0gcy5zbGljZSgxLCAtMSkudHJpbSgpO1xuICB9XG4gIGlmICghcykgcmV0dXJuIG51bGw7XG4gIGlmIChORUdfTUFSS0VSUy50ZXN0KHMpKSByZXR1cm4gXCJuZWdcIjtcbiAgaWYgKFBPU19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcInBvc1wiO1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZUludGVycHJldGF0aW9uKFxuICB2YWx1ZVJhdzogc3RyaW5nLFxuICBxdHk6IFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICBycjogUmFuZ2VFbnRyeSB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgLy8gMS4gTnVtZXJpYyBwYXRoLlxuICBpZiAocXR5ICYmIHR5cGVvZiBxdHkudmFsdWUgPT09IFwibnVtYmVyXCIgJiYgcnIpIHtcbiAgICBjb25zdCB2ID0gcXR5LnZhbHVlO1xuICAgIGNvbnN0IGxvID0gcnIubG93Py52YWx1ZTtcbiAgICBjb25zdCBoaSA9IHJyLmhpZ2g/LnZhbHVlO1xuICAgIGlmICh0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIgJiYgdiA+IGhpKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiSFwiLCBcIkhpZ2hcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiAmJiB2IDwgbG8pIHJldHVybiBpbnRlcnBDb2RpbmcoXCJMXCIsIFwiTG93XCIpO1xuICAgIGlmICh0eXBlb2YgbG8gPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGhpID09PSBcIm51bWJlclwiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTlwiLCBcIk5vcm1hbFwiKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIDIuIFF1YWxpdGF0aXZlIHBhdGguXG4gIGNvbnN0IHZhbEtpbmQgPSBjbGFzc2lmeVF1YWxpdGF0aXZlKHZhbHVlUmF3KTtcbiAgY29uc3QgcmVmVGV4dCA9IHJyPy50ZXh0ID8/IFwiXCI7XG4gIGNvbnN0IHJlZktpbmQgPSBjbGFzc2lmeVF1YWxpdGF0aXZlKHJlZlRleHQpO1xuICBpZiAodmFsS2luZCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIGlmIChyZWZLaW5kID09PSBcIm5lZ1wiKSB7XG4gICAgaWYgKHZhbEtpbmQgPT09IFwicG9zXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJBXCIsIFwiQWJub3JtYWxcIik7XG4gICAgaWYgKHZhbEtpbmQgPT09IFwibmVnXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICB9XG4gIHJldHVybiB2YWxLaW5kID09PSBcInBvc1wiID8gaW50ZXJwQ29kaW5nKFwiUE9TXCIsIFwiUG9zaXRpdmVcIikgOiBpbnRlcnBDb2RpbmcoXCJORUdcIiwgXCJOZWdhdGl2ZVwiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENhbm9uaWNhbCBsYWIga2V5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBMQUJfU1lOT05ZTVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIERpYWJldGVzXG4gIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTgyNzJcdTdEMjA6IFwiSEJBMUNcIixcbiAgXHU3Q0Q2XHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFwiR0xZQ0FURUQgSEVNT0dMT0JJTlwiOiBcIkhCQTFDXCIsXG4gIEhCQTFDOiBcIkhCQTFDXCIsXG4gIEExQzogXCJIQkExQ1wiLFxuICBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDY6IFwiR0xVQ09TRV9GQVNUSU5HXCIsXG4gIFwiRkFTVElORyBHTFVDT1NFXCI6IFwiR0xVQ09TRV9GQVNUSU5HXCIsXG4gIFx1ODQ2MVx1ODQwNFx1N0NENjogXCJHTFVDT1NFXCIsXG4gIFx1ODg0MFx1N0NENjogXCJHTFVDT1NFXCIsXG4gIEdMVUNPU0U6IFwiR0xVQ09TRVwiLFxuICAvLyBDQkNcbiAgXHU3NjdEXHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4OiBcIldCQ1wiLFxuICBcdTc2N0RcdTg4NDBcdTc0MDM6IFwiV0JDXCIsXG4gIFdCQzogXCJXQkNcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4OiBcIlJCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDM6IFwiUkJDXCIsXG4gIFJCQzogXCJSQkNcIixcbiAgXHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhFTU9HTE9CSU5cIixcbiAgSEVNT0dMT0JJTjogXCJIRU1PR0xPQklOXCIsXG4gIEhHQjogXCJIRU1PR0xPQklOXCIsXG4gIFx1ODg0MFx1NUJCOVx1N0E0RFx1NkJENDogXCJIRU1BVE9DUklUXCIsXG4gIEhFTUFUT0NSSVQ6IFwiSEVNQVRPQ1JJVFwiLFxuICBIQ1Q6IFwiSEVNQVRPQ1JJVFwiLFxuICBcdTg4NDBcdTVDMEZcdTY3N0Y6IFwiUExBVEVMRVRcIixcbiAgUExBVEVMRVQ6IFwiUExBVEVMRVRcIixcbiAgUExUOiBcIlBMQVRFTEVUXCIsXG4gIC8vIENCQyBpbmRpY2VzICgxMC1jaGFyIGFuZCA3LWNoYXIgQ0pLIGZvcm1zIGJlYXQgYmFyZSBcdTdEMDVcdTg4NDBcdTc0MDMpXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMFx1NkZDM1x1NUVBNjogXCJNQ0hDXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMDogXCJNQ0hcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU5QUQ0XHU3QTREOiBcIk1DVlwiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdTUyMDZcdTVFMDNcdTVCRUNcdTVFQTY6IFwiUkRXXCIsXG4gIE1DVjogXCJNQ1ZcIixcbiAgTUNIOiBcIk1DSFwiLFxuICBNQ0hDOiBcIk1DSENcIixcbiAgUkRXOiBcIlJEV1wiLFxuICAvLyBDQkMgZGlmZmVyZW50aWFsXG4gIFx1NTVEQ1x1NEUyRFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJORVVUUk9QSElMXCIsXG4gIFx1NTVEQ1x1NEYwQVx1N0QwNVx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJFT1NJTk9QSElMXCIsXG4gIFx1NTVEQ1x1OTE3OFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJFT1NJTk9QSElMXCIsXG4gIFx1NTVEQ1x1OUU3Q1x1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJCQVNPUEhJTFwiLFxuICBcdTZEQ0JcdTVERjRcdTc0MDM6IFwiTFlNUEhPQ1lURVwiLFxuICBcdTU1QUVcdTY4MzhcdTc0MDM6IFwiTU9OT0NZVEVcIixcbiAgRU9TSU5PUEhJTFM6IFwiRU9TSU5PUEhJTFwiLFxuICBFT1NJTk9QSElMOiBcIkVPU0lOT1BISUxcIixcbiAgTkVVVFJPUEhJTFM6IFwiTkVVVFJPUEhJTFwiLFxuICBORVVUUk9QSElMOiBcIk5FVVRST1BISUxcIixcbiAgQkFTT1BISUxTOiBcIkJBU09QSElMXCIsXG4gIEJBU09QSElMOiBcIkJBU09QSElMXCIsXG4gIExZTVBIT0NZVEVTOiBcIkxZTVBIT0NZVEVcIixcbiAgTFlNUEhPQ1lURTogXCJMWU1QSE9DWVRFXCIsXG4gIE1PTk9DWVRFUzogXCJNT05PQ1lURVwiLFxuICBNT05PQ1lURTogXCJNT05PQ1lURVwiLFxuICAvLyBMaXBpZCBcdTIwMTQgTERML0hETCBtdXN0IHByZWNlZGUgYmFyZSBDSE9MRVNURVJPTC5cbiAgXCJMREwgQ0hPTEVTVEVST0xcIjogXCJMRExfQ1wiLFxuICBcIkxETC1DSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiSERMIENIT0xFU1RFUk9MXCI6IFwiSERMX0NcIixcbiAgXCJIREwtQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiTERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU4ODQwXHU2RTA1XHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlQtQ0hPTEVTVEVST0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlQtQ0hPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVE9UQUwgQ0hPTEVTVEVST0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBDSE9MRVNURVJPTDogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBDSE9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFx1NEUwOVx1OTE3OFx1NzUxOFx1NkNCOVx1OTE2RjogXCJUUklHTFlDRVJJREVcIixcbiAgVFJJR0xZQ0VSSURFOiBcIlRSSUdMWUNFUklERVwiLFxuICBcIkhETC1DXCI6IFwiSERMX0NcIixcbiAgSERMOiBcIkhETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RDogXCJIRExfQ1wiLFxuICBcIkxETC1DKERJUkVDVClcIjogXCJMRExfQ1wiLFxuICBcIkxETC1DXCI6IFwiTERMX0NcIixcbiAgTERMOiBcIkxETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RDogXCJMRExfQ1wiLFxuICAvLyBSZW5hbCBcdTIwMTQgdXJpbmUgY3JlYXRpbmluZSB2YXJpYW50cyBiZWZvcmUgc2VydW0uXG4gIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MDogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVVJJTkUgQ1JFQVRJTklORVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKFUpXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUtVVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBKFUpXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEtVVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVLUNSRVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVLUNSRUFcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFx1ODA4Q1x1OTE3OFx1OTE1MDogXCJDUkVBVElOSU5FXCIsXG4gIFx1ODA4Q1x1OTE1MFx1OTE3ODogXCJDUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORShCKVwiOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQVRJTklORTogXCJDUkVBVElOSU5FXCIsXG4gIENSRUE6IFwiQ1JFQVRJTklORVwiLFxuICBDUlROOiBcIkNSRUFUSU5JTkVcIixcbiAgRUdGUjogXCJFR0ZSXCIsXG4gIFx1NUMzRlx1N0QyMFx1NkMyRTogXCJCVU5cIixcbiAgQlVOOiBcIkJVTlwiLFxuICBcdTVDM0ZcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU1QzNGXHU2REIyXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlVSSU5FX1BIXCIsXG4gIFx1OTE3OFx1OUU3Q1x1NUVBNjogXCJQSFwiLFxuICBcdTVDM0ZcdTkxNzg6IFwiVVJJQ19BQ0lEXCIsXG4gIFwiVVJJQyBBQ0lEXCI6IFwiVVJJQ19BQ0lEXCIsXG4gIFVSSUNfQUNJRDogXCJVUklDX0FDSURcIixcbiAgLy8gTGl2ZXJcbiAgQVNUOiBcIkFTVFwiLFxuICBBTFQ6IFwiQUxUXCIsXG4gIEdPVDogXCJBU1RcIixcbiAgR1BUOiBcIkFMVFwiLFxuICBcdTgxQkRcdTdEMDVcdTdEMjA6IFwiQklMSVJVQklOXCIsXG4gIEJJTElSVUJJTjogXCJCSUxJUlVCSU5cIixcbiAgXHU3NjdEXHU4NkNCXHU3NjdEOiBcIkFMQlVNSU5cIixcbiAgQUxCVU1JTjogXCJBTEJVTUlOXCIsXG4gIC8vIENhcmRpYWNcbiAgXHU1RkMzXHU4MDhDXHU2NUNCXHU4RjQ5XHU4NkNCXHU3NjdEOiBcIlRST1BPTklOXCIsXG4gIFRST1BPTklOOiBcIlRST1BPTklOXCIsXG4gIEJOUDogXCJCTlBcIixcbiAgXHU1RkMzXHU4MURGOiBcIlRST1BPTklOXCIsXG4gIC8vIFRoeXJvaWRcbiAgXHU3NTMyXHU3MkMwXHU4MTdBXHU1MjNBXHU2RkMwXHU3RDIwOiBcIlRTSFwiLFxuICBUU0g6IFwiVFNIXCIsXG4gIFx1NkUzOFx1OTZFMlx1NzUzMlx1NzJDMFx1ODE3QVx1N0QyMDogXCJGUkVFX1Q0XCIsXG4gIFwiRlJFRSBUNFwiOiBcIkZSRUVfVDRcIixcbiAgRlQ0OiBcIkZSRUVfVDRcIixcbiAgLy8gTWlzY1xuICBDXHU1M0NEXHU2MUM5XHU2MDI3XHU4NkNCXHU3NjdEOiBcIkNSUFwiLFxuICBcIkMtUkVBQ1RJVkUgUFJPVEVJTlwiOiBcIkNSUFwiLFxuICBDUlA6IFwiQ1JQXCIsXG4gIFwiSFMtQ1JQXCI6IFwiSFNfQ1JQXCIsXG4gIFx1NjUxRFx1OEI3N1x1ODE3QVx1NzI3OVx1NzU3MFx1NjI5N1x1NTM5RjogXCJQU0FcIixcbiAgUFNBOiBcIlBTQVwiLFxuICBcdTk0MzVcdTg2Q0JcdTc2N0Q6IFwiRkVSUklUSU5cIixcbiAgRkVSUklUSU46IFwiRkVSUklUSU5cIixcbiAgXHU4NDQ5XHU5MTc4OiBcIkZPTEFURVwiLFxuICBGT0xBVEU6IFwiRk9MQVRFXCIsXG4gIFx1N0RBRFx1NzUxRlx1N0QyMEIxMjogXCJWSVRBTUlOX0IxMlwiLFxuICBcIlZJVCBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcIlZJVEFNSU4gQjEyXCI6IFwiVklUQU1JTl9CMTJcIixcbiAgXHU3NkFFXHU4Q0VBXHU3RDIwOiBcIkNPUlRJU09MXCIsXG4gIENPUlRJU09MOiBcIkNPUlRJU09MXCIsXG4gIFx1Njg4NVx1NkJEMjogXCJSUFJcIixcbiAgUlBSOiBcIlJQUlwiLFxuICBcdTk2QjFcdTc0MDNcdTgzQ0NcdTYyOTdcdTUzOUY6IFwiQ1JZUFRPQ09DQ0FMX0FHXCIsXG4gIENSWVBBRzogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgXHU4ODQwXHU2QzI4OiBcIkFNTU9OSUFcIixcbiAgQU1NT05JQTogXCJBTU1PTklBXCIsXG4gIFx1NTFERFx1ODg0MFx1OTE3Nlx1NTM5Rlx1NjY0Mlx1OTU5MzogXCJQVFwiLFxuICBBUFRUOiBcIkFQVFRcIixcbiAgSU5SOiBcIklOUlwiLFxufTtcblxuLy8gUHJlLXNvcnQga2V5cyBsb25nZXN0LWZpcnN0IHNvIGxvbmdlci9tb3JlLXNwZWNpZmljIG1hdGNoZXMgd2luLlxuY29uc3QgTEFCX1NZTk9OWU1fS0VZU19TT1JURUQgPSBPYmplY3Qua2V5cyhMQUJfU1lOT05ZTVMpLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpO1xuXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWRpc3BsYXkpIHJldHVybiBcIlwiO1xuICBjb25zdCBzID0gZGlzcGxheS50cmltKCk7XG4gIGlmICghcykgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHNVcHBlciA9IHMudG9VcHBlckNhc2UoKTtcbiAgZm9yIChjb25zdCBrZXkgb2YgTEFCX1NZTk9OWU1fS0VZU19TT1JURUQpIHtcbiAgICBjb25zdCBrdSA9IGtleS50b1VwcGVyQ2FzZSgpO1xuICAgIGlmIChpc0FzY2lpT25seShrdSkpIHtcbiAgICAgIC8vIExlYWRpbmcgd29yZC1ib3VuZGFyeSBvbmx5IFx1MjAxNCBcIkFTVFwiIGluc2lkZSBcIkRJQVNUT0xJQ1wiIHNob3VsZCBub3QgbWF0Y2guXG4gICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGt1KX1gKS50ZXN0KHNVcHBlcikpIHtcbiAgICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNVcHBlci5pbmNsdWRlcyhrdSkpIHtcbiAgICAgIHJldHVybiBMQUJfU1lOT05ZTVNba2V5XSE7XG4gICAgfVxuICB9XG4gIHJldHVybiBzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGFuZWwgZ3JvdXBpbmcgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gY2prQ2hhcnMoczogc3RyaW5nKTogbnVtYmVyIHtcbiAgaWYgKCFzKSByZXR1cm4gMDtcbiAgbGV0IG4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIHtcbiAgICBjb25zdCBjcCA9IGNoLmNvZGVQb2ludEF0KDApID8/IDA7XG4gICAgaWYgKGNwID49IDB4NGUwMCAmJiBjcCA8PSAweDlmZmYpIG4rKztcbiAgfVxuICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gaXNFbmdsaXNoRG9taW5hbnQoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGxldCBsYXRpbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY2hhckNvZGVBdCgwKTtcbiAgICBpZiAoY3AgPCAxMjggJiYgL1tBLVphLXpdLy50ZXN0KGNoKSkgbGF0aW4rKztcbiAgfVxuICByZXR1cm4gbGF0aW4gPj0gMiAmJiBjamtDaGFycyhzKSA9PT0gMDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWVGb3JEZWR1cCh2OiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgbGV0IHMgPSBTdHJpbmcodikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIHMgPSBzLnJlcGxhY2UoL1xcKFteKV0qXFwpL2csIFwiXCIpLnRyaW0oKTtcbiAgcyA9IHMucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gIHJldHVybiBzO1xufVxuXG5mdW5jdGlvbiBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4ge1xuICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBzID0gU3RyaW5nKHZhbHVlKS50cmltKCk7XG4gIHJldHVybiBzICE9PSBcIlwiICYmIHMgIT09IFwiXHUyMDE0XCIgJiYgcyAhPT0gXCItXCIgJiYgcyAhPT0gXCJOL0FcIiAmJiBzICE9PSBcIm51bGxcIjtcbn1cblxuY29uc3QgTUVBTklOR0ZVTF9JTlRFUlBTID0gbmV3IFNldChbXG4gIFwibm9ybWFsXCIsXG4gIFwiYWJub3JtYWxcIixcbiAgXCJoaWdoXCIsXG4gIFwibG93XCIsXG4gIFwiY3JpdGljYWxcIixcbiAgXCJwb3NpdGl2ZVwiLFxuICBcIm5lZ2F0aXZlXCIsXG5dKTtcblxuZnVuY3Rpb24gZGVkdXBlUGFuZWxJdGVtcyhpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlWYWx1ZSA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10+KCk7XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBrID0gbm9ybWFsaXplVmFsdWVGb3JEZWR1cChpdC52YWx1ZSk7XG4gICAgY29uc3QgZ3JvdXAgPSBieVZhbHVlLmdldChrKTtcbiAgICBpZiAoZ3JvdXApIGdyb3VwLnB1c2goaXQpO1xuICAgIGVsc2UgYnlWYWx1ZS5zZXQoaywgW2l0XSk7XG4gIH1cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBncm91cCBvZiBieVZhbHVlLnZhbHVlcygpKSB7XG4gICAgaWYgKGdyb3VwLmxlbmd0aCA9PT0gMSkge1xuICAgICAgb3V0LnB1c2goZ3JvdXBbMF0hKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBjamtJdGVtcyA9IGdyb3VwLmZpbHRlcigoZykgPT4gY2prQ2hhcnMoU3RyaW5nKGcuZGlzcGxheSA/PyBcIlwiKSkgPj0gMik7XG4gICAgY29uc3QgZW5JdGVtcyA9IGdyb3VwLmZpbHRlcigoZykgPT4gaXNFbmdsaXNoRG9taW5hbnQoU3RyaW5nKGcuZGlzcGxheSA/PyBcIlwiKSkpO1xuICAgIGlmIChjamtJdGVtcy5sZW5ndGggPiAwICYmIGVuSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgb3V0LnB1c2goZW5JdGVtc1swXSEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQucHVzaCguLi5ncm91cCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGZpbHRlckxhYlJvd3MocmF3SXRlbXM6IGFueVtdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCByYXcgb2YgcmF3SXRlbXMpIHtcbiAgICBpZiAoIXJhdyB8fCB0eXBlb2YgcmF3ICE9PSBcIm9iamVjdFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCByYXcuY29kZSB8fCBcIlwiKSkgY29udGludWU7XG4gICAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gICAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaGFzVmFsdWUgPSBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZSk7XG4gICAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgICBpZiAoIWhhc1ZhbHVlICYmICFoYXNNZWFuaW5nZnVsSW50ZXJwKSBjb250aW51ZTtcbiAgICBvdXQucHVzaChyYXcpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGRlZHVwZUNyb3NzRm9ybWF0KGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvcmRlckNvZGUgPSAoaXQ6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcgPT5cbiAgICAoKGl0Lm9yZGVyX2NvZGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCkudG9VcHBlckNhc2UoKTtcblxuICBjb25zdCBieUtleSA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+PigpO1xuICBsZXQgaWR4Q291bnRlciA9IDA7XG4gIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgIGNvbnN0IHYgPSBTdHJpbmcoaXRlbS52YWx1ZSA/PyBcIlwiKS50cmltKCk7XG4gICAgY29uc3QgdW5pdCA9ICgoaXRlbS51bml0IGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICAgIGlmICghdikge1xuICAgICAgYnlLZXkuc2V0KGBfX25vX2RlZHVwX198JHtpZHhDb3VudGVyKyt9YCwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3Qga2V5ID0gW1xuICAgICAgKGl0ZW0uZGF0ZSBhcyBzdHJpbmcpID8/IFwiXCIsXG4gICAgICB2LnRvTG93ZXJDYXNlKCksXG4gICAgICB1bml0LnRvTG93ZXJDYXNlKCksXG4gICAgICBvcmRlckNvZGUoaXRlbSksXG4gICAgXS5qb2luKFwifFwiKTtcbiAgICBjb25zdCBleGlzdGluZyA9IGJ5S2V5LmdldChrZXkpO1xuICAgIGlmICghZXhpc3RpbmcpIHtcbiAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vIFByZWZlciB0aGUgcm93IHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggY2xpbmljYWwgcmVhZHMpLlxuICAgIGxldCBwcmltYXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIGxldCBzZWNvbmRhcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgaWYgKGNqa0NoYXJzKGl0ZW0uZGlzcGxheSA/PyBcIlwiKSA8IGNqa0NoYXJzKGV4aXN0aW5nLmRpc3BsYXkgPz8gXCJcIikpIHtcbiAgICAgIHByaW1hcnkgPSBpdGVtO1xuICAgICAgc2Vjb25kYXJ5ID0gZXhpc3Rpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByaW1hcnkgPSBleGlzdGluZztcbiAgICAgIHNlY29uZGFyeSA9IGl0ZW07XG4gICAgfVxuICAgIGNvbnN0IG1lcmdlZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4ucHJpbWFyeSB9O1xuICAgIGZvciAoY29uc3QgZiBvZiBbXCJvcmRlcl9jb2RlXCIsIFwib3JkZXJfbmFtZVwiLCBcImhvc3BpdGFsXCIsIFwiY29kZVwiXSkge1xuICAgICAgaWYgKCFtZXJnZWRbZl0gJiYgc2Vjb25kYXJ5W2ZdKSBtZXJnZWRbZl0gPSBzZWNvbmRhcnlbZl07XG4gICAgfVxuICAgIGJ5S2V5LnNldChrZXksIG1lcmdlZCk7XG4gIH1cbiAgcmV0dXJuIEFycmF5LmZyb20oYnlLZXkudmFsdWVzKCkpO1xufVxuXG5pbnRlcmZhY2UgQnBDb21wb25lbnQge1xuICBsb2luYzogc3RyaW5nO1xuICBkaXNwbGF5OiBzdHJpbmc7XG4gIHZhbHVlOiBudW1iZXI7XG4gIHVuaXQ6IHN0cmluZztcbiAgaW50ZXJwcmV0YXRpb25fdGV4dDogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBjb21iaW5lQnBJdGVtcyhpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPFxuICAgIHN0cmluZyxcbiAgICB7IHN5c3RvbGljPzogUmVjb3JkPHN0cmluZywgYW55PjsgZGlhc3RvbGljPzogUmVjb3JkPHN0cmluZywgYW55PiB9XG4gID4oKTtcbiAgY29uc3QgcGFzc1Rocm91Z2g6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgZGlzcCA9IFN0cmluZyhpdC5kaXNwbGF5ID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3Qga2V5ID0gYCR7aXQuZGF0ZSA/PyBcIlwifXwke2l0Lmhvc3BpdGFsID8/IFwiXCJ9YDtcbiAgICBpZiAoZGlzcC5pbmNsdWRlcyhcInN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIpKSB7XG4gICAgICBjb25zdCB2ID0gYnlLZXkuZ2V0KGtleSkgPz8ge307XG4gICAgICB2LnN5c3RvbGljID0gaXQ7XG4gICAgICBieUtleS5zZXQoa2V5LCB2KTtcbiAgICB9IGVsc2UgaWYgKGRpc3AuaW5jbHVkZXMoXCJkaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuZGlhc3RvbGljID0gaXQ7XG4gICAgICBieUtleS5zZXQoa2V5LCB2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFzc1Rocm91Z2gucHVzaChpdCk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBwYXJ0cyBvZiBieUtleS52YWx1ZXMoKSkge1xuICAgIGNvbnN0IHMgPSBwYXJ0cy5zeXN0b2xpYztcbiAgICBjb25zdCBkID0gcGFydHMuZGlhc3RvbGljO1xuICAgIGNvbnN0IHByaW1hcnkgPSBzID8/IGQ7XG4gICAgaWYgKCFwcmltYXJ5KSBjb250aW51ZTtcbiAgICBjb25zdCBjb21wb25lbnRzOiBCcENvbXBvbmVudFtdID0gW107XG4gICAgY29uc3QgdHJ5QWRkID0gKHNyYzogUmVjb3JkPHN0cmluZywgYW55PiB8IHVuZGVmaW5lZCwgbG9pbmM6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoIXNyYykgcmV0dXJuO1xuICAgICAgY29uc3QgdmFsID0gc3JjLnZhbHVlO1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCB8fCB2YWwgPT09IFwiXCIgfHwgdmFsID09PSBcIi1cIiB8fCB2YWwgPT09IFwiXHUyMDE0XCIpIHJldHVybjtcbiAgICAgIGNvbnN0IG51bSA9IE51bWJlci5wYXJzZUZsb2F0KFN0cmluZyh2YWwpLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobnVtKSkgcmV0dXJuO1xuICAgICAgY29tcG9uZW50cy5wdXNoKHtcbiAgICAgICAgbG9pbmMsXG4gICAgICAgIGRpc3BsYXksXG4gICAgICAgIHZhbHVlOiBudW0sXG4gICAgICAgIHVuaXQ6IHNyYy51bml0IHx8IFwibW1IZ1wiLFxuICAgICAgICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzcmMucmVmZXJlbmNlX3JhbmdlIHx8IFwiXCIsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHRyeUFkZChzLCBcIjg0ODAtNlwiLCBcIlN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIHRyeUFkZChkLCBcIjg0NjItNFwiLCBcIkRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKTtcbiAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbWJpbmVkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgY29tYmluZWQuZGlzcGxheSA9IFwiQmxvb2QgUHJlc3N1cmVcIjtcbiAgICBjb21iaW5lZC5jb2RlID0gXCJcIjtcbiAgICBjb21iaW5lZC5vcmRlcl9jb2RlID0gXCJcIjtcbiAgICBjb21iaW5lZC5vcmRlcl9uYW1lID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNhdGVnb3J5ID0gXCJ2aXRhbC1zaWduc1wiO1xuICAgIGNvbWJpbmVkLmJwX2NvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuICAgIGNvbWJpbmVkLmJwX3BhbmVsX2xvaW5jID0gXCI4NTM1NC05XCI7XG4gICAgY29tYmluZWQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgY29tYmluZWQudW5pdCA9IHVuZGVmaW5lZDtcbiAgICBwYXNzVGhyb3VnaC5wdXNoKGNvbWJpbmVkKTtcbiAgfVxuXG4gIHJldHVybiBwYXNzVGhyb3VnaDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFNwZWNpbWVuIGluZmVyZW5jZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgU1BFQ0lNRU5fUlVMRVM6IFJlYWRvbmx5QXJyYXk8W1JlZ0V4cCwgc3RyaW5nXT4gPSBbXG4gIFsvXHU1QzNGfHVyaW5lfHVyaW5hbHkvaSwgXCJVcmluZVwiXSxcbiAgWy9cdTdDREV8XHU0RkJGXHU2RjVCXHU4ODQwfHN0b29sfGZlY2FsfGZhZWNhbHxvY2N1bHRcXHMqYmxvb2QvaSwgXCJTdG9vbFwiXSxcbiAgWy9cdTc1RjB8c3B1dHVtL2ksIFwiU3B1dHVtXCJdLFxuICBbL1x1ODE2Nlx1ODEwQVx1NkRCMnxjc2Z8Y2VyZWJyb3NwaW5hbC9pLCBcIkNlcmVicm9zcGluYWwgZmx1aWRcIl0sXG4gIFsvXHU4MEY4XHU2QzM0fHBsZXVyYWwvaSwgXCJQbGV1cmFsIGZsdWlkXCJdLFxuICBbL1x1ODE3OVx1NkMzNHxhc2NpdGVzfHBlcml0b25lYWwvaSwgXCJQZXJpdG9uZWFsIGZsdWlkXCJdLFxuICBbL1x1OTY3MFx1OTA1M3xcdTYyQjlcdTcyNDd8Y2VydmljYWx8cGFwXFxzKnNtZWFyfHZhZ2luYWwvaSwgXCJDZXJ2aWNhbC9WYWdpbmFsXCJdLFxuICBbL1x1OTVEQ1x1N0JDMFx1NkRCMnxzeW5vdmlhbHxqb2ludFxccypmbHVpZC9pLCBcIlN5bm92aWFsIGZsdWlkXCJdLFxuICBbL1x1N0Y4QVx1NkMzNHxhbW5pb3RpYy9pLCBcIkFtbmlvdGljIGZsdWlkXCJdLFxuICBbL1x1OUFBOFx1OUFEM3xib25lXFxzKm1hcnJvdy9pLCBcIkJvbmUgbWFycm93XCJdLFxuXTtcblxuZnVuY3Rpb24gaW5mZXJTcGVjaW1lbiguLi5oaW50czogQXJyYXk8c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZD4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgYmxvYiA9IGhpbnRzXG4gICAgLmZpbHRlcigoaCk6IGggaXMgc3RyaW5nID0+IEJvb2xlYW4oaCkpXG4gICAgLmpvaW4oXCIgXCIpXG4gICAgLnRvTG93ZXJDYXNlKCk7XG4gIGlmICghYmxvYikgcmV0dXJuIG51bGw7XG4gIGZvciAoY29uc3QgW3BhdHRlcm4sIGxhYmVsXSBvZiBTUEVDSU1FTl9SVUxFUykge1xuICAgIGlmIChwYXR0ZXJuLnRlc3QoYmxvYikpIHJldHVybiBsYWJlbDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIE1hcCBzaW5nbGUgT2JzZXJ2YXRpb24gKG5vbi1ncm91cGVkIHBhdGgpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZnVuY3Rpb24gbWFwT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGUgfHwgXCJcIjtcbiAgaWYgKGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheSwgY29kZSkpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgaGFzVmFsdWUgPSBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZSk7XG4gIGNvbnN0IGhhc01lYW5pbmdmdWxJbnRlcnAgPSBNRUFOSU5HRlVMX0lOVEVSUFMuaGFzKGludGVycCk7XG4gIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBjb2RlLCByYXcuZGF0ZSA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgaWQ6IG9ic0lkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICBjYXRlZ29yeTogW1xuICAgICAge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogXCJsYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBcIkxhYm9yYXRvcnlcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogYnVpbGRDb2RpbmdzKGNvZGUsIGRpc3BsYXksIGxvaW5jKSxcbiAgICAgIHRleHQ6IGRpc3BsYXkgfHwgXCJVbmtub3duIExhYlwiLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICAvLyBTb3VyY2UtcHJvZ3JhbW1lIHRhZyBcdTIwMTQgc2V0IHdoZW4gdGhlIGFkYXB0ZXIgcHVsbGVkIHRoaXMgb2JzZXJ2YXRpb25cbiAgLy8gb3V0IG9mIGEgc3BlY2lmaWMgTkhJIHNjcmVlbmluZyBwcm9ncmFtbWUgKGUuZy4gYWRhcHRBZHVsdFByZXZlbnRpdmVcbiAgLy8gc2V0cyBzb3VyY2VfcHJvZ3JhbT1cImFkdWx0LXByZXZlbnRpdmVcIikuIFN1cmZhY2VkIHZpYSBPYnNlcnZhdGlvbi5cbiAgLy8gbWV0YS50YWcgc28gZG93bnN0cmVhbSBTTUFSVCBhcHBzIGNhbiBmaWx0ZXIgYnkgX3RhZyB3aXRob3V0IG5lZWRpbmdcbiAgLy8gdG8ga25vdyBhYm91dCBvdXIgaW50ZXJuYWwgZmllbGQgbmFtZXMuXG4gIGlmIChyYXcuc291cmNlX3Byb2dyYW0pIHtcbiAgICByZXNvdXJjZS5tZXRhLnRhZyA9IFtcbiAgICAgIHtcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9uaGktZmhpci1icmlkZ2Uvc291cmNlLXByb2dyYW1cIixcbiAgICAgICAgY29kZTogU3RyaW5nKHJhdy5zb3VyY2VfcHJvZ3JhbSksXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBpZiAoaGFzVmFsdWUpIHtcbiAgICBjb25zdCBxdHkgPSB0cnlQYXJzZVF1YW50aXR5KFN0cmluZyh2YWx1ZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChxdHkpIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgPSBxdHk7XG4gICAgZWxzZSByZXNvdXJjZS52YWx1ZVN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBpZiAocmF3LnJlZmVyZW5jZV9yYW5nZSkge1xuICAgIGNvbnN0IHJyID0gcGFyc2VSYW5nZShTdHJpbmcocmF3LnJlZmVyZW5jZV9yYW5nZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChycikgcmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgPSBbcnJdO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQnVpbGQgb2JzZXJ2YXRpb24gd2l0aGluIGEgcGFuZWwgKHdpdGggY2Fub25pY2FsIGxhYiBrZXkgaWQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBidWlsZE9ic2VydmF0aW9uKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuICBwYW5lbENvZGU6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgLy8gQlAgcGFuZWw6IHByZWJ1aWx0IGJ5IGNvbWJpbmVCcEl0ZW1zLlxuICBpZiAocmF3LmJwX2NvbXBvbmVudHMpIHtcbiAgICBjb25zdCBkYXRlID0gcmF3LmRhdGUgPz8gXCJcIjtcbiAgICBjb25zdCBob3NwaXRhbCA9IHJhdy5ob3NwaXRhbCA/PyBcIlwiO1xuICAgIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBcIkJQX1BBTkVMXCIsIGRhdGUsIGhvc3BpdGFsKTtcbiAgICBjb25zdCBjb21wb25lbnRSZXNvdXJjZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBjIG9mIHJhdy5icF9jb21wb25lbnRzIGFzIEJwQ29tcG9uZW50W10pIHtcbiAgICAgIGNvbnN0IHF0eTogUXVhbnRpdHkgPSB7XG4gICAgICAgIHZhbHVlOiBjLnZhbHVlLFxuICAgICAgICB1bml0OiBjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIHN5c3RlbTogXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCIsXG4gICAgICAgIGNvZGU6IHRvVWN1bShjLnVuaXQpID8/IFwibW1bSGddXCIsXG4gICAgICB9O1xuICAgICAgY29tcG9uZW50UmVzb3VyY2VzLnB1c2goe1xuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgY29kaW5nOiBbeyBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLCBjb2RlOiBjLmxvaW5jLCBkaXNwbGF5OiBjLmRpc3BsYXkgfV0sXG4gICAgICAgICAgdGV4dDogYy5kaXNwbGF5LFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZVF1YW50aXR5OiBxdHksXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgYnBPYnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICAgIGlkOiBvYnNJZCxcbiAgICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgICAgY2F0ZWdvcnk6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgICBjb2RlOiBcInZpdGFsLXNpZ25zXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiVml0YWwgU2lnbnNcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjb2RlOiB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsXG4gICAgICAgICAgICBjb2RlOiByYXcuYnBfcGFuZWxfbG9pbmMgPz8gXCI4NTM1NC05XCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBcIkJsb29kIHByZXNzdXJlIHBhbmVsXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogXCJCbG9vZCBQcmVzc3VyZVwiLFxuICAgICAgfSxcbiAgICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgICBjb21wb25lbnQ6IGNvbXBvbmVudFJlc291cmNlcyxcbiAgICB9O1xuICAgIGlmIChkYXRlKSBicE9icy5lZmZlY3RpdmVEYXRlVGltZSA9IGAke2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAoaG9zcGl0YWwpIGJwT2JzLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IGhvc3BpdGFsIH1dO1xuICAgIHJldHVybiBicE9icztcbiAgfVxuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCBjb2RlID0gKHBhbmVsQ29kZSA/IFN0cmluZyhwYW5lbENvZGUpIDogXCJcIikgfHwgcmF3Lm9yZGVyX2NvZGUgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IGNhbm9uaWNhbCA9IGNhbm9uaWNhbExhYktleShkaXNwbGF5KSB8fCBkaXNwbGF5O1xuICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJvYnNcIiwgY2Fub25pY2FsLCByYXcuZGF0ZSA/PyBcIlwiLCByYXcuaG9zcGl0YWwgPz8gXCJcIik7XG4gIGNvbnN0IGxvaW5jID0gZmluZExvaW5jKGNvZGUsIGRpc3BsYXkpO1xuXG4gIGNvbnN0IGNhdENvZGUgPSByYXcuY2F0ZWdvcnkgfHwgXCJsYWJvcmF0b3J5XCI7XG4gIGNvbnN0IENBVF9ESVNQTEFZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIGxhYm9yYXRvcnk6IFwiTGFib3JhdG9yeVwiLFxuICAgIFwidml0YWwtc2lnbnNcIjogXCJWaXRhbCBTaWduc1wiLFxuICAgIGltYWdpbmc6IFwiSW1hZ2luZ1wiLFxuICAgIHByb2NlZHVyZTogXCJQcm9jZWR1cmVcIixcbiAgICBcInNvY2lhbC1oaXN0b3J5XCI6IFwiU29jaWFsIEhpc3RvcnlcIixcbiAgICBzdXJ2ZXk6IFwiU3VydmV5XCIsXG4gICAgZXhhbTogXCJFeGFtXCIsXG4gICAgdGhlcmFweTogXCJUaGVyYXB5XCIsXG4gICAgYWN0aXZpdHk6IFwiQWN0aXZpdHlcIixcbiAgfTtcbiAgY29uc3QgY2F0RGlzcGxheSA9XG4gICAgQ0FUX0RJU1BMQVlbY2F0Q29kZV0gPz8gY2F0Q29kZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNhdENvZGUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBjYXRDb2RlLFxuICAgICAgICAgICAgZGlzcGxheTogY2F0RGlzcGxheSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogYnVpbGRDb2RpbmdzKGNvZGUsIGRpc3BsYXksIGxvaW5jKSxcbiAgICAgIHRleHQ6IGRpc3BsYXkgfHwgXCJVbmtub3duIExhYlwiLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKHJhdy5ob3NwaXRhbCkgcmVzb3VyY2UucGVyZm9ybWVyID0gW3sgZGlzcGxheTogcmF3Lmhvc3BpdGFsIH1dO1xuICBjb25zdCBzcGVjaW1lbiA9IGluZmVyU3BlY2ltZW4ocmF3Lm9yZGVyX25hbWUsIHJhdy5kaXNwbGF5LCByYXcuY29kZSk7XG4gIGlmIChzcGVjaW1lbikgcmVzb3VyY2Uuc3BlY2ltZW4gPSB7IGRpc3BsYXk6IHNwZWNpbWVuIH07XG5cbiAgY29uc3QgaGFzVmFsdWUgPSBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZSk7XG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnJzID0gcGFyc2VSYW5nZU11bHRpKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJycy5sZW5ndGggPiAwKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IHJycztcbiAgfVxuXG4gIGNvbnN0IGludGVycENvZGluZ1Jlc3VsdCA9XG4gICAgbWFwSW50ZXJwcmV0YXRpb24oaW50ZXJwKSB8fFxuICAgIGRlcml2ZUludGVycHJldGF0aW9uKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCA/IFN0cmluZyh2YWx1ZSkgOiBcIlwiLFxuICAgICAgcmVzb3VyY2UudmFsdWVRdWFudGl0eSBhcyBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgICAgIChyZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSBhcyBSYW5nZUVudHJ5W10gfCB1bmRlZmluZWQpPy5bMF0sXG4gICAgKTtcbiAgaWYgKGludGVycENvZGluZ1Jlc3VsdCkge1xuICAgIHJlc291cmNlLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbaW50ZXJwQ29kaW5nUmVzdWx0XSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEdyb3VwIGJ5IChvcmRlcl9jb2RlLCBkYXRlLCBob3NwaXRhbCkgXHUyMTkyIERSICsgT2JzZXJ2YXRpb25zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBncm91cEJ5T3JkZXJDb2RlKFxuICBjbGVhbmVkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgbGV0IHdvcmtpbmcgPSBkZWR1cGVDcm9zc0Zvcm1hdChjbGVhbmVkKTtcbiAgd29ya2luZyA9IGNvbWJpbmVCcEl0ZW1zKHdvcmtpbmcpO1xuXG4gIGNvbnN0IGdyb3VwcyA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10+KCk7XG4gIGNvbnN0IGtleU1ldGEgPSBuZXcgTWFwPHN0cmluZywgeyBncm91cEtleUNvZGU6IHN0cmluZzsgZGF0ZTogc3RyaW5nOyBob3NwaXRhbDogc3RyaW5nIH0+KCk7XG4gIGZvciAoY29uc3QgcmF3IG9mIHdvcmtpbmcpIHtcbiAgICBjb25zdCBncm91cEtleUNvZGUgPSByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCByYXcuZGlzcGxheSB8fCBcIlwiO1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qga2V5ID0gYCR7Z3JvdXBLZXlDb2RlfXwke2RhdGV9fCR7aG9zcGl0YWx9YDtcbiAgICBjb25zdCBhcnIgPSBncm91cHMuZ2V0KGtleSk7XG4gICAgaWYgKGFycikgYXJyLnB1c2gocmF3KTtcbiAgICBlbHNlIHtcbiAgICAgIGdyb3Vwcy5zZXQoa2V5LCBbcmF3XSk7XG4gICAgICBrZXlNZXRhLnNldChrZXksIHsgZ3JvdXBLZXlDb2RlOiBTdHJpbmcoZ3JvdXBLZXlDb2RlKSwgZGF0ZSwgaG9zcGl0YWwgfSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBba2V5LCBpdGVtc10gb2YgZ3JvdXBzLmVudHJpZXMoKSkge1xuICAgIGNvbnN0IG1ldGEgPSBrZXlNZXRhLmdldChrZXkpITtcbiAgICBjb25zdCBkZWR1cGVkID0gZGVkdXBlUGFuZWxJdGVtcyhpdGVtcyk7XG5cbiAgICBjb25zdCBvYnNSZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICAgIGNvbnN0IHNlZW5PYnNJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGRlZHVwZWQpIHtcbiAgICAgIGNvbnN0IG9icyA9IGJ1aWxkT2JzZXJ2YXRpb24oaXQsIHBhdGllbnRJZCwgbWV0YS5ncm91cEtleUNvZGUpO1xuICAgICAgaWYgKCFvYnMpIGNvbnRpbnVlO1xuICAgICAgaWYgKHNlZW5PYnNJZHMuaGFzKG9icy5pZCkpIGNvbnRpbnVlO1xuICAgICAgc2Vlbk9ic0lkcy5hZGQob2JzLmlkKTtcbiAgICAgIG9ic1Jlc291cmNlcy5wdXNoKG9icyk7XG4gICAgfVxuICAgIGlmIChvYnNSZXNvdXJjZXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcblxuICAgIC8vIEJQIHBhbmVsOiBlbWl0IE9ic2VydmF0aW9uIGRpcmVjdGx5IChubyBEUiB3cmFwcGVyKS5cbiAgICBjb25zdCBpc0JwUGFuZWwgPSBkZWR1cGVkLmV2ZXJ5KChpdCkgPT4gaXQuYnBfY29tcG9uZW50cyB8fCBpdC5kaXNwbGF5ID09PSBcIkJsb29kIFByZXNzdXJlXCIpO1xuICAgIGlmIChpc0JwUGFuZWwpIHtcbiAgICAgIG91dC5wdXNoKC4uLm9ic1Jlc291cmNlcyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBvcmRlck5hbWUgPSBkZWR1cGVkLmZpbmQoKGl0KSA9PiBpdC5vcmRlcl9uYW1lKT8ub3JkZXJfbmFtZSA/PyBudWxsO1xuICAgIGNvbnN0IG1lbWJlcktleXMgPSBBcnJheS5mcm9tKFxuICAgICAgbmV3IFNldChkZWR1cGVkLmZpbHRlcigoaXQpID0+IGl0LmRpc3BsYXkpLm1hcCgoaXQpID0+IGNhbm9uaWNhbExhYktleShpdC5kaXNwbGF5KSkpLFxuICAgICkuc29ydCgpO1xuICAgIGNvbnN0IHBhbmVsU2lnbmF0dXJlID0gbWVtYmVyS2V5cy5qb2luKFwiLFwiKSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIGNvbnN0IGRySWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwiRFJcIiwgcGFuZWxTaWduYXR1cmUsIG1ldGEuZGF0ZSwgbWV0YS5ob3NwaXRhbCk7XG5cbiAgICBsZXQgcGFuZWxUaXRsZTogc3RyaW5nO1xuICAgIGlmIChkZWR1cGVkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3Qgc2luZ2xlRGlzcGxheSA9IGRlZHVwZWRbMF0hLmRpc3BsYXkgPz8gXCJcIjtcbiAgICAgIHBhbmVsVGl0bGUgPSBzaW5nbGVEaXNwbGF5IHx8IG9yZGVyTmFtZSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lbFRpdGxlID0gb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfVxuXG4gICAgY29uc3QgZHJDb2RlU3lzdGVtID0gTkhJX0xBQl9DT0RFX1JFLnRlc3QoU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKSA/PyBcIlwiKVxuICAgICAgPyBzeXN0ZW1zLk5ISV9NRURJQ0FMX09SREVSX0NPREVcbiAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREU7XG5cbiAgICBjb25zdCBkcjogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gICAgICBpZDogZHJJZCxcbiAgICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgICAgY2F0ZWdvcnk6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92Mi0wMDc0XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwiTEFCXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBkckNvZGVTeXN0ZW0sXG4gICAgICAgICAgICBjb2RlOiBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpIHx8IFwiVU5LTk9XTlwiLFxuICAgICAgICAgICAgZGlzcGxheTogcGFuZWxUaXRsZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBwYW5lbFRpdGxlLFxuICAgICAgfSxcbiAgICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgICByZXN1bHQ6IG9ic1Jlc291cmNlcy5tYXAoKG8pID0+ICh7IHJlZmVyZW5jZTogYE9ic2VydmF0aW9uLyR7by5pZH1gIH0pKSxcbiAgICB9O1xuICAgIGlmIChtZXRhLmRhdGUpIGRyLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7bWV0YS5kYXRlfVQwMDowMDowMCswODowMGA7XG4gICAgaWYgKG1ldGEuaG9zcGl0YWwpIGRyLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IG1ldGEuaG9zcGl0YWwgfV07XG5cbiAgICBvdXQucHVzaChkcik7XG4gICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbnNHcm91cGVkKHJhd0l0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBjbGVhbmVkID0gZmlsdGVyTGFiUm93cyhyYXdJdGVtcyk7XG4gIHJldHVybiBncm91cEJ5T3JkZXJDb2RlKGNsZWFuZWQsIHBhdGllbnRJZCk7XG59XG4iLCAiLyoqXG4gKiBQcm9jZWR1cmUgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9wcm9jZWR1cmUucHlgLiBSZXR1cm5zIG51bGwgZm9yIGxpc3QtcGFnZVxuICogcm93cyBsYWNraW5nIG5vdGUvYm9keV9zaXRlIFx1MjAxNCB0aGUgYWx0ZXJuYXRpdmUgaXMgdGhlIFNNQVJUIGFwcCBzaG93aW5nXG4gKiAyNSBcInByb2NlZHVyZXNcIiBjYWxsZWQgXCJNeWNvYmFjdGVyaWEgY3VsdHVyZVwiIC8gXCJWYWdpbmFsIHVsdHJhc291bmRcIlxuICogLyBldGMuIHdoaWNoIGFyZSBjbGluaWNhbGx5IHdyb25nLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJpY2RcIikpIHJldHVybiBzeXN0ZW1zLklDRF8xMF9QQ1M7XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9QUk9DRURVUkVfQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFByb2NlZHVyZShcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3Qgbm90ZSA9ICgocmF3Lm5vdGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gIGNvbnN0IGJvZHlTaXRlID0gKChyYXcuYm9keV9zaXRlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIW5vdGUgJiYgIWJvZHlTaXRlKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgPz8gXCJVbmtub3duIFByb2NlZHVyZVwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJQcm9jZWR1cmVcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJjb21wbGV0ZWRcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UucGVyZm9ybWVkRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChib2R5U2l0ZSkge1xuICAgIHJlc291cmNlLmJvZHlTaXRlID0gW3sgdGV4dDogYm9keVNpdGUgfV07XG4gIH1cbiAgaWYgKG5vdGUpIHtcbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogbm90ZSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgbWFwcGVyIGRpc3BhdGNoIHRhYmxlcy5cbiAqXG4gKiBDb25zdW1lZCBieSBiYWNrZW5kJ3MgYC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCBhbmQgdGhlIGV4dGVuc2lvbidzXG4gKiBsb2NhbC1tb2RlIGJ1bmRsZSBhc3NlbWJsZXIgc28gYm90aCBwcm9kdWNlIGlkZW50aWNhbCBGSElSIG91dHB1dC5cbiAqL1xuXG5pbXBvcnQgeyBtYXBBbGxlcmd5SW50b2xlcmFuY2UgfSBmcm9tIFwiLi9hbGxlcmd5XCI7XG5pbXBvcnQgeyBtYXBDb25kaXRpb24gfSBmcm9tIFwiLi9jb25kaXRpb25cIjtcbmltcG9ydCB7IG1hcERpYWdub3N0aWNSZXBvcnQgfSBmcm9tIFwiLi9kaWFnbm9zdGljLXJlcG9ydFwiO1xuaW1wb3J0IHsgbWFwRW5jb3VudGVyIH0gZnJvbSBcIi4vZW5jb3VudGVyXCI7XG5pbXBvcnQgeyBtYXBNZWRpY2F0aW9uUmVxdWVzdCwgbWFwTWVkaWNhdGlvbnNEZWR1cCB9IGZyb20gXCIuL21lZGljYXRpb25cIjtcbmltcG9ydCB7IG1hcE9ic2VydmF0aW9uLCBtYXBPYnNlcnZhdGlvbnNHcm91cGVkIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb25cIjtcbmltcG9ydCB7IG1hcFByb2NlZHVyZSB9IGZyb20gXCIuL3Byb2NlZHVyZVwiO1xuXG5leHBvcnQgdHlwZSBQZXJSb3dNYXBwZXIgPSAoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pID0+IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsO1xuXG5leHBvcnQgdHlwZSBHcm91cE1hcHBlciA9IChpdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKSA9PiBSZWNvcmQ8c3RyaW5nLCBhbnk+W107XG5cbi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiAocGVyLXJvdyBtYXBwZXIsIEpTT04gbGlzdCBrZXkgaW5zaWRlIExMTSByZXNwb25zZSkuXG4gKiBVc2VkIGJ5IHRoZSBMTE0gZmFsbGJhY2sgcGF0aCBhZnRlciBleHRyYWN0aW9uOyB0aGUgc3RydWN0dXJlZCBwYXRoXG4gKiBhbHNvIGNvbnN1bHRzIGl0IGZvciBwZXItcm93IHJlc291cmNlIHR5cGVzLlxuICovXG5leHBvcnQgY29uc3QgTElTVF9IQU5ETEVSUzogUmVjb3JkPHN0cmluZywgW1BlclJvd01hcHBlciwgc3RyaW5nXT4gPSB7XG4gIG9ic2VydmF0aW9uczogW21hcE9ic2VydmF0aW9uLCBcIm9ic2VydmF0aW9uc1wiXSxcbiAgbWVkaWNhdGlvbnM6IFttYXBNZWRpY2F0aW9uUmVxdWVzdCwgXCJtZWRpY2F0aW9uc1wiXSxcbiAgY29uZGl0aW9uczogW21hcENvbmRpdGlvbiwgXCJjb25kaXRpb25zXCJdLFxuICBhbGxlcmdpZXM6IFttYXBBbGxlcmd5SW50b2xlcmFuY2UsIFwiYWxsZXJnaWVzXCJdLFxuICBkaWFnbm9zdGljX3JlcG9ydHM6IFttYXBEaWFnbm9zdGljUmVwb3J0LCBcImRpYWdub3N0aWNfcmVwb3J0c1wiXSxcbiAgcHJvY2VkdXJlczogW21hcFByb2NlZHVyZSwgXCJwcm9jZWR1cmVzXCJdLFxuICBlbmNvdW50ZXJzOiBbbWFwRW5jb3VudGVyLCBcImVuY291bnRlcnNcIl0sXG59O1xuXG4vKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgZ3JvdXAtYXdhcmUgbWFwcGVyIHRoYXQgdGFrZXMgdGhlIEZVTEwgbGlzdCBhdCBvbmNlLlxuICogVXNlZCB3aGVuIGNyb3NzLXJvdyBncm91cGluZy9kZWR1cCBpcyByZXF1aXJlZCAoTkhJIGxhYiBwYW5lbHMsXG4gKiBcdTRFMkRcdTgyRjEgbWVkaWNhdGlvbiBcdTk2RDlcdThBOUUgZGVkdXApLlxuICovXG5leHBvcnQgY29uc3QgR1JPVVBfSEFORExFUlM6IFJlY29yZDxzdHJpbmcsIEdyb3VwTWFwcGVyPiA9IHtcbiAgb2JzZXJ2YXRpb25zOiBtYXBPYnNlcnZhdGlvbnNHcm91cGVkLFxuICBtZWRpY2F0aW9uczogbWFwTWVkaWNhdGlvbnNEZWR1cCxcbn07XG4iLCAiLyoqXG4gKiBFbmNvdW50ZXIgbGlua2VyIFx1MjAxNCBtYXRjaCByZXNvdXJjZXMgdG8gRW5jb3VudGVycyBieSAoaG9zcGl0YWwsIGRhdGUpLlxuICpcbiAqIFB1cmUgZnVuY3Rpb246IG11dGF0ZXMgYHJlc291cmNlc2AgaW4gcGxhY2UgdG8gYWRkIGBlbmNvdW50ZXJgXG4gKiByZWZlcmVuY2VzIHdoZW4gdGhlcmUncyBhbiB1bmFtYmlndW91cyBtYXRjaCBpbiB0aGUgY2FuZGlkYXRlXG4gKiBFbmNvdW50ZXIgbGlzdC4gU2FtZSBsb2dpYyBhcyB0aGUgYmFja2VuZCdzIERCLWNvdXBsZWQgdmVyc2lvbixcbiAqIGxpZnRlZCBvdXQgc28gdGhlIGV4dGVuc2lvbidzIGxvY2FsIG1vZGUgY2FuIGNhbGwgaXQgb24gYW5cbiAqIGluLW1lbW9yeSBhcnJheS5cbiAqL1xuXG5pbXBvcnQgeyBkZXJpdmVJbnRlcnByZXRhdGlvbiB9IGZyb20gXCIuL29ic2VydmF0aW9uXCI7XG5cbmNvbnN0IEVOQ09VTlRFUl9MSU5LQUJMRSA9IG5ldyBTZXQoW1xuICBcIk9ic2VydmF0aW9uXCIsXG4gIFwiTWVkaWNhdGlvblJlcXVlc3RcIixcbiAgXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gIFwiUHJvY2VkdXJlXCIsXG4gIFwiQ29uZGl0aW9uXCIsXG4gIFwiQWxsZXJneUludG9sZXJhbmNlXCIsXG5dKTtcblxuZnVuY3Rpb24gcmVzb3VyY2VEYXRlKHI6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBmb3IgKGNvbnN0IGtleSBvZiBbXG4gICAgXCJlZmZlY3RpdmVEYXRlVGltZVwiLFxuICAgIFwiYXV0aG9yZWRPblwiLFxuICAgIFwicGVyZm9ybWVkRGF0ZVRpbWVcIixcbiAgICBcIm9uc2V0RGF0ZVRpbWVcIixcbiAgICBcInJlY29yZGVkRGF0ZVwiLFxuICAgIFwiaXNzdWVkXCIsXG4gIF0pIHtcbiAgICBjb25zdCB2ID0gcltrZXldO1xuICAgIGlmICh2KSByZXR1cm4gU3RyaW5nKHYpLnNsaWNlKDAsIDEwKTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBvZiBbXCJlZmZlY3RpdmVQZXJpb2RcIiwgXCJwZXJmb3JtZWRQZXJpb2RcIl0pIHtcbiAgICBjb25zdCBwZXJpb2QgPSByW2tleV07XG4gICAgaWYgKHBlcmlvZCAmJiB0eXBlb2YgcGVyaW9kID09PSBcIm9iamVjdFwiICYmIHBlcmlvZC5zdGFydCkge1xuICAgICAgcmV0dXJuIFN0cmluZyhwZXJpb2Quc3RhcnQpLnNsaWNlKDAsIDEwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFwiXCI7XG59XG5cbmZ1bmN0aW9uIHJlc291cmNlSG9zcGl0YWwocjogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIGZvciAoY29uc3QgcCBvZiByLnBlcmZvcm1lciA/PyBbXSkge1xuICAgIGNvbnN0IGQgPSAocCA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGlmIChkKSByZXR1cm4gZDtcbiAgfVxuICBjb25zdCByZXEgPSByLnJlcXVlc3RlciA/PyB7fTtcbiAgaWYgKHJlcSAmJiB0eXBlb2YgcmVxID09PSBcIm9iamVjdFwiICYmIHJlcS5kaXNwbGF5KSByZXR1cm4gcmVxLmRpc3BsYXk7XG4gIHJldHVybiBcIlwiO1xufVxuXG4vKipcbiAqIERyb3AgQU1CIEVuY291bnRlcnMgd2hvc2UgKGhvc3BpdGFsLCBzdGFydF9kYXRlKSBpcyBhbHJlYWR5IGNvdmVyZWRcbiAqIGJ5IGFuIElNUCBFbmNvdW50ZXIncyBhZG1pc3Npb24gZGF5LiBOSEkgZW1pdHMgdGhlIHNhbWUgaW5wYXRpZW50XG4gKiBzdGF5IHR3aWNlIChJSEtFMzMwMyBBTUIgYmlsbGluZyBlbnRyeSArIElIS0UzMzA5IElNUCBkZXRhaWwpOyB0aGVcbiAqIElNUCBvbmUgaXMgY2Fub25pY2FsLCB0aGUgQU1CIGlzIGEgYmlsbGluZyBhcnRlZmFjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwQWRtaXNzaW9uRGF5QW1iKFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGltcFN0YXJ0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIkVuY291bnRlclwiKSBjb250aW51ZTtcbiAgICBpZiAoKHIuY2xhc3MgPz8ge30pLmNvZGUgIT09IFwiSU1QXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoaG9zcCAmJiBzdGFydCkgaW1wU3RhcnRzLmFkZChgJHtob3NwfSAke3N0YXJ0fWApO1xuICB9XG4gIGlmIChpbXBTdGFydHMuc2l6ZSA9PT0gMCkgcmV0dXJuIHJlc291cmNlcztcbiAgcmV0dXJuIHJlc291cmNlcy5maWx0ZXIoKHIpID0+IHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgPT09IFwiRW5jb3VudGVyXCIgJiYgKHIuY2xhc3MgPz8ge30pLmNvZGUgPT09IFwiQU1CXCIpIHtcbiAgICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChyLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGltcFN0YXJ0cy5oYXMoYCR7aG9zcH0gJHtzdGFydH1gKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIGBlbmNvdW50ZXJgIHJlZmVyZW5jZSB0byBlYWNoIGxpbmthYmxlIHJlc291cmNlIHdoZW4gaXRzXG4gKiAoaG9zcGl0YWwsIGRhdGUpIG1hdGNoZXMgZXhhY3RseSBPTkUgRW5jb3VudGVyIGluIGBjYW5kaWRhdGVzYC5cbiAqIENvbnNlcnZhdGl2ZSBcdTIwMTQgbGVhdmVzIGFtYmlndW91cyAoMCBvciA+MSBtYXRjaCkgY2FzZXMgdW5saW5rZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzKFxuICBjYW5kaWRhdGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogdm9pZCB7XG4gIGlmIChjYW5kaWRhdGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICBjb25zdCBleGFjdEluZGV4ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBjb25zdCBpbXBCeUhvc3AgPSBuZXcgTWFwPHN0cmluZywgQXJyYXk8W3N0cmluZywgc3RyaW5nLCBzdHJpbmddPj4oKTtcblxuICBmb3IgKGNvbnN0IGUgb2YgY2FuZGlkYXRlcykge1xuICAgIGlmIChlLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IChlLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChlLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgIGlmICghaG9zcCB8fCAhc3RhcnQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGtleSA9IGAke2hvc3B9ICR7c3RhcnR9YDtcbiAgICBjb25zdCBhcnIgPSBleGFjdEluZGV4LmdldChrZXkpID8/IFtdO1xuICAgIGFyci5wdXNoKGUuaWQpO1xuICAgIGV4YWN0SW5kZXguc2V0KGtleSwgYXJyKTtcbiAgICBjb25zdCBjbHMgPSAoZS5jbGFzcyA/PyB7fSkuY29kZSA/PyBcIlwiO1xuICAgIGlmIChjbHMgPT09IFwiSU1QXCIpIHtcbiAgICAgIGNvbnN0IGVuZCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLmVuZCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgICBpZiAoZW5kKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdO1xuICAgICAgICBsaXN0LnB1c2goW3N0YXJ0LCBlbmQsIGUuaWRdKTtcbiAgICAgICAgaW1wQnlIb3NwLnNldChob3NwLCBsaXN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZXhhY3RJbmRleC5zaXplID09PSAwICYmIGltcEJ5SG9zcC5zaXplID09PSAwKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmICghRU5DT1VOVEVSX0xJTktBQkxFLmhhcyhyLnJlc291cmNlVHlwZSkpIGNvbnRpbnVlO1xuICAgIGlmIChyLmVuY291bnRlciB8fCByLmNvbnRleHQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSByZXNvdXJjZUhvc3BpdGFsKHIpO1xuICAgIGNvbnN0IGRhdGUgPSByZXNvdXJjZURhdGUocik7XG4gICAgaWYgKCFob3NwIHx8ICFkYXRlKSBjb250aW51ZTtcbiAgICBjb25zdCBtYXRjaGVzOiBzdHJpbmdbXSA9IFsuLi4oZXhhY3RJbmRleC5nZXQoYCR7aG9zcH0gJHtkYXRlfWApID8/IFtdKV07XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGNvbnN0IFtzdGFydCwgZW5kLCBlaWRdIG9mIGltcEJ5SG9zcC5nZXQoaG9zcCkgPz8gW10pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDw9IGRhdGUgJiYgZGF0ZSA8PSBlbmQpIG1hdGNoZXMucHVzaChlaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggIT09IDEpIGNvbnRpbnVlO1xuICAgIHIuZW5jb3VudGVyID0geyByZWZlcmVuY2U6IGBFbmNvdW50ZXIvJHttYXRjaGVzWzBdfWAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFdoZW4gYW4gT2JzZXJ2YXRpb24gY2FycmllcyBtdWx0aXBsZSByZWZlcmVuY2VSYW5nZSBlbnRyaWVzIHRhZ2dlZFxuICogd2l0aCBgYXBwbGllc1RvWypdLmNvZGluZy5jb2RlYCBpbiB7bWFsZSwgZmVtYWxlfSwgcGljayB0aGUgb25lIHRoYXRcbiAqIG1hdGNoZXMgdGhlIHBhdGllbnQncyBnZW5kZXIgYW5kIHJlLWRlcml2ZSBpbnRlcnByZXRhdGlvbiBhZ2FpbnN0IGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMoXG4gIHBhdGllbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoIXBhdGllbnQpIHJldHVybjtcbiAgY29uc3QgZ2VuZGVyID0gU3RyaW5nKHBhdGllbnQuZ2VuZGVyID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChnZW5kZXIgIT09IFwibWFsZVwiICYmIGdlbmRlciAhPT0gXCJmZW1hbGVcIikgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgIT09IFwiT2JzZXJ2YXRpb25cIikgY29udGludWU7XG4gICAgY29uc3QgcnJzOiBhbnlbXSA9IHIucmVmZXJlbmNlUmFuZ2UgPz8gW107XG4gICAgaWYgKHJycy5sZW5ndGggPCAyKSBjb250aW51ZTtcblxuICAgIGxldCBtYXRjaDogYW55ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJycykge1xuICAgICAgZm9yIChjb25zdCBhcCBvZiBlbnRyeS5hcHBsaWVzVG8gPz8gW10pIHtcbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGFwLmNvZGluZyA/PyBbXSkge1xuICAgICAgICAgIGlmIChTdHJpbmcoYy5jb2RlID8/IFwiXCIpLnRvTG93ZXJDYXNlKCkgPT09IGdlbmRlcikge1xuICAgICAgICAgICAgbWF0Y2ggPSBlbnRyeTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2gpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICB9XG4gICAgaWYgKCFtYXRjaCkgY29udGludWU7XG5cbiAgICByLnJlZmVyZW5jZVJhbmdlID0gW21hdGNoXTtcbiAgICBjb25zdCB2YWxTdHIgPVxuICAgICAgU3RyaW5nKChyLnZhbHVlUXVhbnRpdHkgPz8ge30pLnZhbHVlID8/IFwiXCIpIHx8IFN0cmluZyhyLnZhbHVlU3RyaW5nID8/IFwiXCIpO1xuICAgIGNvbnN0IG5ld0ludGVycCA9IGRlcml2ZUludGVycHJldGF0aW9uKHZhbFN0ciwgci52YWx1ZVF1YW50aXR5ID8/IG51bGwsIG1hdGNoKTtcbiAgICBpZiAobmV3SW50ZXJwKSB7XG4gICAgICByLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbbmV3SW50ZXJwXSB9XTtcbiAgICB9XG4gIH1cbn1cbiIsICIvKipcbiAqIFBhdGllbnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9wYXRpZW50LnB5YC4gU2FtZSBwdWJsaWMgQVBJOlxuICogICAtIGxvb2tzTGlrZVR3TmF0aW9uYWxJZCh2YWx1ZSkgXHUyMDE0IGV4cG9zZWQgZm9yIHRlc3RzXG4gKiAgIC0gbWFwUGF0aWVudChyYXcpIFx1MjAxNCBtYWluIGVudHJ5XG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlUGF0aWVudElkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5cbi8vIFRhaXdhbiBuYXRpb25hbCBJRDogMSBsZXR0ZXIgKyA5IGRpZ2l0cyAoQTEyMzQ1Njc4OSkuIFVzZWQgdG8gZGVjaWRlXG4vLyB3aGV0aGVyIHRoZSBwb3B1cC1zdXBwbGllZCBwYXRpZW50X2lkIHNob3VsZCBiZSBjb2RlZCB1bmRlciB0aGVcbi8vIGNhbm9uaWNhbCBuYXRpb25hbC1pZCBzeXN0ZW0gb3IgYXMgYSBsb2NhbCBob3NwaXRhbCBNUk4uXG5jb25zdCBUV19OQVRJT05BTF9JRF9SRSA9IC9eW0EtWl1bMTJdXFxkezh9JC87XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gVFdfTkFUSU9OQUxfSURfUkUudGVzdCh2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQYXRpZW50KHJhdzogUmVjb3JkPHN0cmluZywgYW55Pik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCByYXdJZCA9IFN0cmluZyhyYXcuaWRlbnRpZmllciA/PyByYXcuaWQgPz8gXCJ1bmtub3duXCIpO1xuICAvLyBGSElSIFBhdGllbnQuaWQgaXMgdGhlIGhhc2hlZC9zYWx0ZWQgZm9ybS4gUmVhbCBuYXRpb25hbCBJRCBzdGF5c1xuICAvLyBvbmx5IGluIGlkZW50aWZpZXJbXS52YWx1ZSBzbyBhIGxlYWtlZCBCdW5kbGUgKG9yIGEgU01BUlQgYXBwIHRva2VuXG4gIC8vIHBheWxvYWQgY29udGFpbmluZyBwYXRpZW50X2lkKSBkb2Vzbid0IGRpc2Nsb3NlIGl0IHZpYSBldmVyeVxuICAvLyBzdWJqZWN0LnJlZmVyZW5jZS5cbiAgY29uc3QgcGF0aWVudElkID0gZGVyaXZlUGF0aWVudElkKHJhd0lkKTtcblxuICAvLyBVc2UgYD8/YCAobm90IGp1c3QgZGVmYXVsdCBhcmcpIHNvIGV4cGxpY2l0IG51bGwgZnJvbSB0aGUgTExNIGFsc29cbiAgLy8gZmFsbHMgYmFjay4gTG9jYWwgbW9kZWxzIHNvbWV0aW1lcyBlbWl0IG51bGwgaW5zdGVhZCBvZiBvbWl0dGluZy5cbiAgLy8gVGhlIGNhbGxlciBkZWNpZGVzIHdoZXRoZXIgYHJhdy5uYW1lYCBpcyB0aGUgdXNlcidzIHJlYWwgbmFtZSBvclxuICAvLyBhbHJlYWR5LW1hc2tlZCBcdTIwMTQgbWFwUGF0aWVudCBqdXN0IHRyYW5zY3JpYmVzLiBNYXNraW5nIHBvbGljeSBsaXZlc1xuICAvLyBhdCB0aGUgVUkgLyBleHRlbnNpb24gbGF5ZXIgKGRyaXZlbiBieSB0aGUgdXNlci10b2dnbGVhYmxlXG4gIC8vIGBtYXNrTmFtZUVuYWJsZWRgIHNldHRpbmcpIHNvIHRoZSBzYW1lIG1hcHBlciBpcyBjb3JyZWN0IGZvciBib3RoXG4gIC8vIFwiXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4ID0gcmVhbCBuYW1lXCIgYW5kIFwiXHU5MUFCXHU3NjQyXHU0RUJBXHU1NEUxXHU1OTFBXHU3NUM1XHU0RUJBID0gbWFza2VkXCIgd29ya2Zsb3dzLlxuICBjb25zdCBuYW1lVGV4dCA9IChyYXcubmFtZSA/PyBudWxsKSB8fCBcIlVua25vd25cIjtcbiAgY29uc3QgcGhvbmUgPSAocmF3LnBob25lID8/IG51bGwpIHx8IFwiXCI7XG4gIGNvbnN0IGFkZHJlc3MgPSAocmF3LmFkZHJlc3MgPz8gbnVsbCkgfHwgXCJcIjtcblxuICBjb25zdCBbZmFtaWx5LCBnaXZlbl0gPSBzcGxpdE5hbWUobmFtZVRleHQpO1xuICBjb25zdCBuYW1lRW50cnk6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IHVzZTogXCJvZmZpY2lhbFwiLCB0ZXh0OiBuYW1lVGV4dCB9O1xuICBpZiAoZmFtaWx5KSBuYW1lRW50cnkuZmFtaWx5ID0gZmFtaWx5O1xuICBpZiAoZ2l2ZW4ubGVuZ3RoID4gMCkgbmFtZUVudHJ5LmdpdmVuID0gZ2l2ZW47XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIlBhdGllbnRcIixcbiAgICBpZDogcGF0aWVudElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICB7XG4gICAgICAgIHVzZTogXCJvZmZpY2lhbFwiLFxuICAgICAgICBzeXN0ZW06IGxvb2tzTGlrZVR3TmF0aW9uYWxJZChyYXdJZClcbiAgICAgICAgICA/IHN5c3RlbXMuVFdfTkFUSU9OQUxfSURcbiAgICAgICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1BBVElFTlRfTVJOLFxuICAgICAgICB2YWx1ZTogcmF3SWQsXG4gICAgICB9LFxuICAgIF0sXG4gICAgbmFtZTogW25hbWVFbnRyeV0sXG4gICAgZ2VuZGVyOiBtYXBHZW5kZXIocmF3LmdlbmRlciksXG4gIH07XG5cbiAgY29uc3QgYmlydGhEYXRlID0gcmF3LmJpcnRoRGF0ZTtcbiAgaWYgKGJpcnRoRGF0ZSkgcmVzb3VyY2UuYmlydGhEYXRlID0gYmlydGhEYXRlO1xuXG4gIGlmIChwaG9uZSkge1xuICAgIHJlc291cmNlLnRlbGVjb20gPSBbeyBzeXN0ZW06IFwicGhvbmVcIiwgdXNlOiBcImhvbWVcIiwgdmFsdWU6IHBob25lIH1dO1xuICB9XG5cbiAgaWYgKGFkZHJlc3MpIHtcbiAgICByZXNvdXJjZS5hZGRyZXNzID0gW3sgdXNlOiBcImhvbWVcIiwgdGV4dDogYWRkcmVzcyB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLyoqXG4gKiBTcGxpdCBhIGZ1bGwgbmFtZSBpbnRvIFtmYW1pbHksIFtnaXZlbl1dIGZvciBGSElSIFBhdGllbnQubmFtZS5cbiAqXG4gKiBIZXVyaXN0aWNzOlxuICogICAtIENvbnRhaW5zIHdoaXRlc3BhY2UgXHUyMTkyIFdlc3Rlcm46IGxhc3QgdG9rZW4gPSBmYW1pbHksIHJlc3QgPSBnaXZlbi5cbiAqICAgLSBDSksgLyBzaW5nbGUtdG9rZW4gXHUyMTkyIGZpcnN0IGNoYXIgPSBmYW1pbHksIHJlbWFpbmRlciA9IGdpdmVuLlxuICogICAtIFwiVW5rbm93blwiIG9yIGVtcHR5IFx1MjE5MiBbXCJcIiwgW11dXG4gKlxuICogVHdvLWNoYXIgQ0pLIGZhbWlseSBuYW1lcyAoXHU2QjUwXHU5NjdELCBcdTUzRjhcdTk5QUMsIFx1MjAyNikgYXJlIE5PVCBhdXRvLWRldGVjdGVkLlxuICovXG5mdW5jdGlvbiBzcGxpdE5hbWUoZnVsbE5hbWU6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ1tdXSB7XG4gIGNvbnN0IG5hbWUgPSAoZnVsbE5hbWUgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIW5hbWUgfHwgbmFtZSA9PT0gXCJVbmtub3duXCIpIHJldHVybiBbXCJcIiwgW11dO1xuICBpZiAoL1xccy8udGVzdChuYW1lKSkge1xuICAgIGNvbnN0IHBhcnRzID0gbmFtZS5zcGxpdCgvXFxzKy8pO1xuICAgIHJldHVybiBbcGFydHNbcGFydHMubGVuZ3RoIC0gMV0hLCBwYXJ0cy5zbGljZSgwLCAtMSldO1xuICB9XG4gIC8vIENKSyBmYWxsYmFjayBcdTIwMTQgaXRlcmF0ZSBjb2RlcG9pbnRzLCBub3QgVVRGLTE2IGNvZGUgdW5pdHMsIHNvXG4gIC8vIHN1cnJvZ2F0ZS1wYWlyIGNoYXJhY3RlcnMgKHJhcmUgaW4gQ2hpbmVzZSBuYW1lcyBidXQgcG9zc2libGUpXG4gIC8vIGRvbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjb2RlcG9pbnRzID0gQXJyYXkuZnJvbShuYW1lKTtcbiAgcmV0dXJuIGNvZGVwb2ludHMubGVuZ3RoID4gMSA/IFtjb2RlcG9pbnRzWzBdISwgW2NvZGVwb2ludHMuc2xpY2UoMSkuam9pbihcIlwiKV1dIDogW25hbWUsIFtdXTtcbn1cblxuZnVuY3Rpb24gbWFwR2VuZGVyKGdlbmRlcjogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IGcgPSB0eXBlb2YgZ2VuZGVyID09PSBcInN0cmluZ1wiID8gZ2VuZGVyLnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAoW1wibWFsZVwiLCBcIm1cIiwgXCJcdTc1MzdcIiwgXCJcdTc1MzdcdTYwMjdcIl0uaW5jbHVkZXMoZykpIHJldHVybiBcIm1hbGVcIjtcbiAgaWYgKFtcImZlbWFsZVwiLCBcImZcIiwgXCJcdTU5NzNcIiwgXCJcdTU5NzNcdTYwMjdcIl0uaW5jbHVkZXMoZykpIHJldHVybiBcImZlbWFsZVwiO1xuICByZXR1cm4gXCJ1bmtub3duXCI7XG59XG4iLCAiLy8gTkhJIEpTT04gXHUyMTkyIG5vcm1hbGl6ZWQgc2hhcGUgYWRhcHRlcnMuXG4vL1xuLy8gRXh0cmFjdGVkIGZyb20gYmFja2dyb3VuZC5qcyBzbyBlYWNoIGFkYXB0ZXIgY2FuIGJlIHVuaXQtdGVzdGVkIGluXG4vLyBpc29sYXRpb24uIGJhY2tncm91bmQuanMgaW1wb3J0cyBldmVyeXRoaW5nIGJlbG93OyB0aGUgbGl2ZSBTVyBnbHVlc1xuLy8gdGhlc2Ugb250byBmZXRjaGVkIHBheWxvYWRzIHZpYSB0aGUgZW5kcG9pbnQgcmVnaXN0cnkuXG4vL1xuLy8gV2h5IGV4dHJhY3Q6IHRoZSB2MC42LjEgbGFiK2ltYWdpbmcgZGF0ZS1maWVsZCBidWdzIChjb21taXRzIGIzNzg4NWYgL1xuLy8gOGMxOTkwMSkgc2hpcHBlZCBiZWNhdXNlIHRoZXNlIGZ1bmN0aW9ucyBoYWQgWkVSTyB0ZXN0IGNvdmVyYWdlIFx1MjAxNFxuLy8gYmFja2dyb3VuZC5qcyBjYW4ndCBiZSBsb2FkZWQgaW4gYSB0ZXN0IGVudmlyb25tZW50IChjaHJvbWUuKiBBUElzLFxuLy8gU1cgZ2xvYmFscyksIHNvIHRoZSBhZGFwdCogbG9naWMgcm9kZSBhbG9uZyB1bnRlc3RlZC4gUHVsbGluZyB0aGVtXG4vLyBpbnRvIGEgcHVyZS1mdW5jdGlvbiBtb2R1bGUgbGV0cyB2aXRlc3QgdmVyaWZ5IGZpZWxkLXByaW9yaXR5XG4vLyBkZWNpc2lvbnMgcm93LWJ5LXJvdy5cblxuLy8gQ29udmVydCBOSEkncyBcdTZDMTFcdTU3MEIgZGF0ZSBcIjExNS8wNS8wNVwiIFx1MjE5MiBJU08gXCIyMDI2LTA1LTA1XCIuXG4vLyBTb21lIE5ISSBmaWVsZHMgZW1iZWQgYm90aCBST0MgYW5kIEdyZWdvcmlhbjogXCIxMTUvMDUvMDV8fDIwMjYvMDUvMDVcIiBcdTIwMTQgd2Vcbi8vIGp1c3QgbWF0Y2ggdGhlIGZpcnN0IHNlZ21lbnQuXG5leHBvcnQgZnVuY3Rpb24gcm9jVG9JU08ocm9jRGF0ZSkge1xuICBpZiAoIXJvY0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKHJvY0RhdGUpLm1hdGNoKC9eKFxcZHsyLDN9KVsvLi1dKFxcZHsxLDJ9KVsvLi1dKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApICsgMTkxMTtcbiAgcmV0dXJuIGAke3l9LSR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LSR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gSW52ZXJzZTogSVNPIFwiMjAyMy0wNS0wNVwiIFx1MjE5MiBST0MgXCIxMTIvMDUvMDVcIi4gVXNlZCB0byBidWlsZCBOSEkgZGF0ZS1yYW5nZVxuLy8gcXVlcnkgc3RyaW5ncyAodGhlaXIgZm9ybXMgZXhwZWN0IFx1NkMxMVx1NTcwQiBmb3JtYXQpLlxuZXhwb3J0IGZ1bmN0aW9uIGlzb1RvUk9DKGlzb0RhdGUpIHtcbiAgaWYgKCFpc29EYXRlKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgbSA9IFN0cmluZyhpc29EYXRlKS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApIC0gMTkxMTtcbiAgaWYgKHkgPCAxKSByZXR1cm4gXCJcIjsgLy8gcHJlLVx1NkMxMVx1NTcwQiBkYXRlcyBtYWtlIG5vIHNlbnNlIHRvIE5ISVxuICByZXR1cm4gYCR7eX0vJHttWzJdLnBhZFN0YXJ0KDIsIFwiMFwiKX0vJHttWzNdLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xufVxuXG4vLyBOSEkgYmlsaW5ndWFsIGZpZWxkcyB1c2UgXCJcdTRFMkRcdTY1ODd8fEVuZ2xpc2hcIiBcdTIwMTQgY2xpbmljaWFucyBzY2FuIEVuZ2xpc2ggZmFzdGVyLFxuLy8gc28gcHJlZmVyIHRoYXQgc2lkZS4gSWYgdGhlcmUncyBubyBgfHxgIHdlIGp1c3QgcmV0dXJuIHRoZSBpbnB1dCB0cmltbWVkLlxuZXhwb3J0IGZ1bmN0aW9uIHBpY2tFbmdsaXNoKHMpIHtcbiAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc3RyID0gU3RyaW5nKHMpO1xuICBjb25zdCBpZHggPSBzdHIuaW5kZXhPZihcInx8XCIpO1xuICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuIHN0ci50cmltKCk7XG4gIGNvbnN0IGVuID0gc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKTtcbiAgcmV0dXJuIGVuIHx8IHN0ci5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbn1cblxuLy8gU3RyaXAgdHJhaWxpbmcgcHVuY3R1YXRpb24gLyB3aGl0ZXNwYWNlIGp1bmsgdGhhdCBzb21lIGhvc3BpdGFscyBsZWF2ZVxuLy8gb24gdGhlaXIgZnJlZS10ZXh0IGxhYiBsYWJlbHMgKGUuZy4gTkhJIHJldHVybnMgXCJDcmVhLFwiIGZyb20gb25lIHNpdGVcbi8vIGFuZCBcIkNyZWFcIiBmcm9tIGFub3RoZXIgZm9yIHRoZSBzYW1lIHBoeXNpY2FsIHRlc3QpLiBQcmUtbm9ybWFsaXppbmdcbi8vIGhlcmUgbWVhbnMgdGhlIE9ic2VydmF0aW9uLmNvZGUudGV4dCBkb3duc3RyZWFtIHJlYWRzIGNsZWFubHkgZXZlblxuLy8gd2hlbiBkb3duc3RyZWFtIFVJcyBzdGlsbCBoYXBwZW4gdG8gcmVuZGVyIGBjb2RlLnRleHRgIGluc3RlYWQgb2Zcbi8vIHB1bGxpbmcgZGlzcGxheSBmcm9tIHRoZSBMT0lOQyAvIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgY29kaW5nLlxuZnVuY3Rpb24gX2NsZWFuTGFiTmFtZShzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIHJldHVybiBTdHJpbmcocylcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1ssXHVGRjBDO1x1RkYxQl0rXFxzKiQvLCBcIlwiKSAgLy8gdHJhaWxpbmcgXHU1MzRBXHU1RjYyIC8gXHU1MTY4XHU1RjYyIHB1bmN0dWF0aW9uXG4gICAgLnRyaW0oKTtcbn1cblxuLy8gQWRhcHRlciBmb3IgTkhJIGxhYi9vYnNlcnZhdGlvbiBKU09OIHNoYXBlIChjb25maXJtZWQgZm9yIElIS0UzNDA5UzAxO1xuLy8gb3RoZXIgbGFiIGVuZHBvaW50cyBsaWtlbHkgdXNlIHRoZSBzYW1lIGZpZWxkcykuXG4vL1xuLy8gRGF0ZSBmaWVsZCBjaG9pY2UgXHUyMDE0IElIS0UzNDA5IHJldHVybnMgdGhyZWUgZGF0ZS1pc2ggZmllbGRzIHBlciByb3c6XG4vLyAgIC0gZnVuQ19EQVRFICAgICAgICAgIFx1NUMzMVx1OEEzQVx1NjVFNSAvIFx1NTE2NVx1OTY2Mlx1NjVFNSAodmlzaXQgcmVnaXN0cmF0aW9uIC8gYWRtaXNzaW9uKVxuLy8gICAtIHJlYUxfSU5TUEVDVF9EQVRFICBcdTVCRTZcdTk2OUJcdTYzQTFcdTZBQTJcdTY1RTUgKGFjdHVhbCBzYW1wbGUtY29sbGVjdGlvbiBkYXRlKVxuLy8gICAtIGFzc2FZX1VQTE9BRF9EQVRFICBcdTRFMEFcdTUwQjNcdTY1RTUgKHdoZW4gdGhlIHJlc3VsdCBoaXQgTkhJJ3Mgc2VydmVyKVxuLy8gRm9yIGFuIGlucGF0aWVudCwgZnVuQ19EQVRFIGlzIHRoZSBhZG1pc3Npb24gZGF5IGFuZCBldmVyeSBsYWIgZHJhd25cbi8vIGR1cmluZyB0aGUgc3RheSBjYXJyaWVzIHRoZSBzYW1lIGZ1bkNfREFURSBcdTIwMTQgdXNpbmcgaXQgYXMgT2JzZXJ2YXRpb24uXG4vLyBlZmZlY3RpdmVEYXRlVGltZSBtYWRlIGFsbCBcdTRGNEZcdTk2NjJcdTY3MUZcdTk1OTMgbGFicyBsb29rIGxpa2UgdGhleSB3ZXJlIGRyYXduXG4vLyBvbiBkYXkgMS4gRkhJUidzIFwicGh5c2lvbG9naWNhbGx5IHJlbGV2YW50IHRpbWVcIiBmb3IgYSBsYWIgT2JzZXJ2YXRpb25cbi8vIGlzIHRoZSBzYW1wbGUtY29sbGVjdGlvbiBkYXRlLCBzbyBwcmVmZXIgcmVhTF9JTlNQRUNUX0RBVEUgd2hlbiBOSElcbi8vIHJldHVybnMgaXQ7IGZhbGwgYmFjayB0byBmdW5DX0RBVEUgb25seSB3aGVuIHRoZSBpbnNwZWN0IGZpZWxkIGlzXG4vLyBtaXNzaW5nIChvbGRlciByb3dzIC8gZW5kcG9pbnRzIHRoYXQgZG9uJ3QgY2FycnkgaXQpLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0TGFiSXRlbShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhcbiAgICBpdGVtLnJlYUxfSU5TUEVDVF9EQVRFIHx8IGl0ZW0ucmVhbF9pbnNwZWN0X2RhdGUgfHwgaXRlbS5mdW5DX0RBVEUsXG4gICk7XG4gIGNvbnN0IHZhbHVlID0gaXRlbS5hc3NhWV9WQUxVRTtcbiAgaWYgKCFkYXRlIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IFwiXCIpIHJldHVybiBudWxsO1xuICAvLyBEaXNwbGF5IG5hbWUgZmFsbGJhY2sgY2hhaW4gKGFsbCBub3JtYWxpemVkIGZvciB0cmFpbGluZyBwdW5jdHVhdGlvbik6XG4gIC8vICAgMS4gYXNzYVlfSVRFTV9OQU1FIFx1MjAxNCBob3NwaXRhbCdzIGZ1bGwgZnJlZS10ZXh0IGxhYmVsXG4gIC8vICAgMi4gb3JkZXJfc2hvcnRuYW1lIFx1MjAxNCBOSEkncyBVSS10cnVuY2F0ZWQgbGFiZWwgKG9mdGVuIGVuZHMgXCIuLi5cIilcbiAgLy8gICAzLiBvcmRlUl9OQU1FICAgICAgXHUyMDE0IE5ISSdzIGNhbm9uaWNhbCBcdTkxQUJcdTRFRTRcdTc4QkMgZGljdGlvbmFyeSBuYW1lXG4gIC8vIGFzc2FZX0lURU1fTkFNRSB3aW5zIGJ5IGRlZmF1bHQgYmVjYXVzZSBvcmRlcl9zaG9ydG5hbWUgY2FuIGJlIGN1dFxuICAvLyBvZmYgbWlkLXdvcmQgKFwiUEMgU3VnYXIgXHU5OEVGXHU1RjhDIC4uLlwiKSwgd2hpY2ggaXMgd29yc2UgdGhhbiBhIHRyYWlsaW5nLVxuICAvLyBjb21tYSBjb3NtZXRpYyBpc3N1ZS4gb3JkZVJfTkFNRSBpcyB0aGUgbGFzdC1yZXNvcnQgQ2hpbmVzZSBmb3JtYWxcbiAgLy8gbGFiZWwuXG4gIGNvbnN0IGZ1bGxOYW1lID0gX2NsZWFuTGFiTmFtZShpdGVtLmFzc2FZX0lURU1fTkFNRSlcbiAgICAgICAgICAgICAgICB8fCBfY2xlYW5MYWJOYW1lKGl0ZW0ub3JkZXJfc2hvcnRuYW1lKVxuICAgICAgICAgICAgICAgIHx8IF9jbGVhbkxhYk5hbWUoaXRlbS5vcmRlUl9OQU1FKTtcbiAgY29uc3Qgb3JkZXJDb2RlID0gU3RyaW5nKGl0ZW0ub3JkZVJfQ09ERSB8fCBcIlwiKS50cmltKCk7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBvcmRlcl9jb2RlOiBvcmRlckNvZGUsXG4gICAgb3JkZXJfbmFtZTogaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCIsXG4gICAgLy8gUHJlZmVyIHRoZSBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIChcIjA5MTQwQ1wiKSBhcyB0aGUgRkhJUiBjb2RpbmcgY29kZSBzbyB0aGVcbiAgICAvLyBkb3duc3RyZWFtIG9ic2VydmF0aW9uIG1hcHBlciByb3V0ZXMgaXQgdW5kZXIgTkhJX01FRElDQUxfT1JERVJfXG4gICAgLy8gQ09ERSBzeXN0ZW0uIFNNQVJUIGFwcHMgZ3JvdXAgbGFiIHRlc3RzIGJ5IGNvZGluZyBjb2RlOyB1c2luZ1xuICAgIC8vIGZyZWUtdGV4dCBoZXJlIGlzIHdoYXQgY2F1c2VzIFwiQ3JlYVwiIGFuZCBcIkNyZWEsXCIgdG8gYmUgc3BsaXRcbiAgICAvLyBpbnRvIHR3byBkaXN0aW5jdCB0ZXN0cy4gRmFsbGJhY2sgdG8gdGhlIGNsZWFuZWQgZGlzcGxheSB3aGVuXG4gICAgLy8gTkhJIGRvZXNuJ3Qgc3VwcGx5IGFuIG9yZGVyIGNvZGUgKG9sZGVyIC8gZWRnZS1jYXNlIHJvd3MpLlxuICAgIGNvZGU6IG9yZGVyQ29kZSB8fCBmdWxsTmFtZSxcbiAgICBkaXNwbGF5OiBmdWxsTmFtZSxcbiAgICB2YWx1ZTogU3RyaW5nKHZhbHVlKSxcbiAgICB1bml0OiBpdGVtLnVuaVRfREFUQSB8fCBcIlwiLFxuICAgIHJlZmVyZW5jZV9yYW5nZTogaXRlbS5jb25zdWxUX1ZBTFVFIHx8IGl0ZW0uc2hvcnRfQ09OU1VMVF9WQUxVRSB8fCBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwNlMwMSByZXR1cm5zIHZpc2l0LWxldmVsIHJvd3MgT05MWSAobm8gZHJ1ZyBuYW1lcykuIFRoZSBhY3R1YWwgZHJ1Z1xuLy8gbGlzdCBsaXZlcyBhdCBJSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD08cm93X0lEPiZjdHlwZT0yLCBpblxuLy8gYGloa2UzMzA2UzAyX21haW5fZGF0YVsqXS5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3RgLiBXZSBkbyB0aGF0IDItc3RlcFxuLy8gZmV0Y2ggc2VwYXJhdGVseTsgdGhpcyBmdW5jdGlvbiBhZGFwdHMgYSBzaW5nbGUgZHJ1ZyBlbnRyeSBnaXZlbiBpdHNcbi8vIHBhcmVudCB2aXNpdCBjb250ZXh0LlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZHJ1ZywgdmlzaXQpIHtcbiAgaWYgKCFkcnVnIHx8IHR5cGVvZiBkcnVnICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgLy8gdmlzaXQuZnVuY19EQVRFIGlzIFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHJvY1RvSVNPIG1hdGNoZXMgdGhlIFJPQ1xuICAvLyBwcmVmaXggY29ycmVjdGx5LlxuICBjb25zdCBkYXRlID0gcm9jVG9JU08odmlzaXQ/LmZ1bmNfREFURSB8fCB2aXNpdD8uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBjb25zdCBkcnVnX25hbWUgPSBwaWNrRW5nbGlzaChkcnVnLmRydWdfbmFtZSB8fCBkcnVnLmRydUdfTkFNRSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlIHx8ICFkcnVnX25hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXlzID0gTnVtYmVyKGRydWcub3JkZXJfZHJ1Z19kYXkgfHwgZHJ1Zy5vcmRlcl9EUlVHX0RBWSB8fCAwKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGRydWdfbmFtZSxcbiAgICBjb2RlOiBkcnVnLm9yZGVyX2NvZGUgfHwgZHJ1Zy5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBkb3NlL2ZyZXF1ZW5jeS9yb3V0ZSBcdTIwMTQgb25seSBkYXlzICsgcXR5LlxuICAgIGRvc2U6IFwiXCIsXG4gICAgZnJlcXVlbmN5OiBcIlwiLFxuICAgIHJvdXRlOiBcIlwiLFxuICAgIHF1YW50aXR5OiBkcnVnLm9yZGVyX3F0eSB8fCBkcnVnLm9yZGVyX1FUWSB8fCBcIlwiLFxuICAgIGR1cmF0aW9uX2RheXM6IE51bWJlci5pc0Zpbml0ZShkYXlzKSA/IGRheXMgOiAwLFxuICAgIC8vIHBpY2tFbmdsaXNoIG9uIGljZF9uYW1lIHR1cm5zIFx1ODI2Rlx1NjAyN1x1NjUxRFx1OEI3N1x1ODE3QS4uLnx8QmVuaWduIHByb3N0YXRpYy4uLiBpbnRvIHRoZSBFTiBzaWRlLlxuICAgIGluZGljYXRpb246IHBpY2tFbmdsaXNoKHZpc2l0Py5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2aXNpdD8uaWNkOWNtX25hbWUgfHwgXCJcIiksXG4gICAgaW5kaWNhdGlvbl9jb2RlOiB2aXNpdD8uaWNkOWNtX0NPREUgfHwgdmlzaXQ/LmljZDljbV9jb2RlIHx8IFwiXCIsXG4gICAgZHJ1Z19jbGFzczogcGlja0VuZ2xpc2goZHJ1Zy5hY3QgfHwgXCJcIiksXG4gICAgaG9zcGl0YWw6IHZpc2l0Py5ob3NwX0FCQlIgfHwgdmlzaXQ/Lmhvc3BfYWJiciB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBTdHViIGtlcHQgZm9yIHRoZSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgSUhLRTMzMDZTMDEgbGlzdCBuZXZlciBoYXMgZHJ1Z3MsXG4vLyBzbyB3ZSBhbHdheXMgcmV0dXJuIG51bGwgYW5kIHJlbHkgb24gdGhlIDItc3RlcCBkZXRhaWwgZmV0Y2ggYWJvdmUuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRNZWRpY2F0aW9uKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBTYW1lIHNoYXBlIGFzIGFkYXB0TWVkaWNhdGlvbjogSUhLRTM0MDhTMDEgKGltYWdpbmcgbGlzdCkgb25seSBjYXJyaWVzXG4vLyBvcmRlci1sZXZlbCBkYXRhOyB0aGUgYWN0dWFsIHJlcG9ydCBuYXJyYXRpdmUgY29tZXMgZnJvbSB0aGUgSUhLRTM0MDhTMDJcbi8vIGRldGFpbCBmYW4tb3V0IChzZWUgYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCkuIFJldHVybmluZyBudWxsIGZyb21cbi8vIHRoZSBsaXN0IGFkYXB0ZXIgZW5zdXJlcyBubyBoYWxmLWZvcm1lZCBEaWFnbm9zdGljUmVwb3J0cyBsZWFrIHRocm91Z2guXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRJbWFnaW5nTGlzdFN0dWIoKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIElIS0UzMjA5UzAxIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpIFx1MjAxNCBOSEkncyBvZmZpY2lhbGx5LXZldHRlZCBjYXRhc3Ryb3BoaWMtaWxsbmVzc1xuLy8gcmVnaXN0cnkuIEVhY2ggcm93IGlzIGEgc2VyaW91cyBjaHJvbmljIGNvbmRpdGlvbiAoY2FuY2VyLCBhdXRvaW1tdW5lLFxuLy8gdHJhbnNwbGFudCBmb2xsb3ctdXAsIGRpYWx5c2lzLCBldGMuKSB0aGUgcGF0aWVudCBpcyBjdXJyZW50bHlcbi8vIHJlZ2lzdGVyZWQgZm9yLiBUaGlzIGlzIHRoZSBjbG9zZXN0IHRoaW5nIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBleHBvc2VzIHRvIGFcbi8vIGN1cmF0ZWQgcHJvYmxlbSBsaXN0IFx1MjAxNCBmYXIgc3Ryb25nZXIgc2lnbmFsIHRoYW4gcmV2ZXJzZS1lbmdpbmVlcmluZ1xuLy8gY2hyb25pYyBjb25kaXRpb25zIGZyb20gZW5jb3VudGVyIElDRHMuXG4vL1xuLy8gTWFwcyB0byBGSElSIENvbmRpdGlvbiB3aXRoIGNhdGVnb3J5PXByb2JsZW0tbGlzdC1pdGVtIHNvIGRvd25zdHJlYW1cbi8vIFNNQVJUIGFwcHMgLyBJUFMgcHJvZmlsZXMgc3VyZmFjZSBpdCBpbiB0aGVpciBwcm9ibGVtLWxpc3Qgdmlldy5cbi8vXG4vLyBQYXlsb2FkIHNoYXBlIChsaXZlIGNhcHR1cmUpOlxuLy8gICBzUF9JSEtFMzIwOVMwMTogW1xuLy8gICAgIHsgaG9zUF9JRCwgaG9zUF9BQkJSLCBob3NQX1VSTCxcbi8vICAgICAgIGljRDEwQ01fQ05BTUU6IFwiXHU2NTFEXHU4Qjc3XHU4MTdBXHU2MEUxXHU2MDI3XHU4MTZCXHU3NjI0XCIsICBcdTIxOTAgQ2hpbmVzZSBuYXJyYXRpdmUgb25seVxuLy8gICAgICAgdmFsaURfU19EQVRFOiAgXCIxMTEvMTEvMTZcIiwgICAgICAgXHUyMTkwIGNlcnRpZmljYXRpb24gdmFsaWQtZnJvbSAoUk9DKVxuLy8gICAgICAgdmFsaURfRV9EQVRFOiAgXCIxMTYvMTEvMTVcIiB9ICAgICAgXHUyMTkwIGNlcnRpZmljYXRpb24gdmFsaWQtdW50aWwgKFJPQywgfjV5KVxuLy8gICBdXG4vL1xuLy8gQ2F2ZWF0cyBkZWxpYmVyYXRlbHkgZW5jb2RlZDpcbi8vICAgLSBOSEkgZG9lc24ndCByZXR1cm4gdGhlIElDRC0xMC1DTSBjb2RlIGluIHRoaXMgZW5kcG9pbnQsIG9ubHkgdGhlXG4vLyAgICAgQ2hpbmVzZSBsYWJlbC4gV2UgbGVhdmUgYGNvZGVgIGVtcHR5OyBtYXBDb25kaXRpb24gZmFsbHMgYmFjayB0b1xuLy8gICAgIGRpc3BsYXktYXMtaWQgZm9yIHN0YWJsZUlkIChtaXJyb3JpbmcgZGlhZ25vc3RpYy1yZXBvcnQudHMpLlxuLy8gICAtIHZhbGlEX0VfREFURSBpcyB3aGVuIHRoZSBDQVJEIGV4cGlyZXMgKHJlbmV3ZWQgZXZlcnkgfjV5KSwgTk9UXG4vLyAgICAgd2hlbiB0aGUgZGlzZWFzZSByZXNvbHZlZC4gV2UgZGVsaWJlcmF0ZWx5IGRvIE5PVCBtYXAgaXQgdG9cbi8vICAgICBhYmF0ZW1lbnREYXRlVGltZSBcdTIwMTQgdGhhdCB3b3VsZCBmYWxzZWx5IGltcGx5IHRoZSBjb25kaXRpb24gc3RvcHBlZC5cbi8vICAgLSBBbGwgcm93cyBoZXJlIGFyZSBjdXJyZW50bHkgYWN0aXZlIGJ5IGRlZmluaXRpb247IE5ISSBvbmx5IHJldHVybnNcbi8vICAgICB2YWxpZCBjZXJ0aWZpY2F0aW9ucy4gY2xpbmljYWxfc3RhdHVzIGhhcmQtY29kZWQgdG8gXCJhY3RpdmVcIi5cbi8vICAgLSBzZXZlcml0eSBzdG9yZWQgYXMgdGV4dCAoXCJTZXZlcmUgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSlcIikgYmVjYXVzZSB0aGUgZm9ybWFsXG4vLyAgICAgc2V2ZXJpdHkgY29kZSBtYXBwaW5nIChTTk9NRUQgMjQ0ODQwMDAgZXRjLikgbmVlZHMgbW9yZSB0aG91Z2h0LlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyhpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChpdGVtLmljRDEwQ01fQ05BTUUgfHwgaXRlbS5pY2QxMGNtX2NuYW1lIHx8IFwiXCIpO1xuICBpZiAoIWRpc3BsYXkpIHJldHVybiBudWxsO1xuICByZXR1cm4ge1xuICAgIGRpc3BsYXksXG4gICAgY29kZTogXCJcIixcbiAgICBzeXN0ZW06IFwiXCIsXG4gICAgb25zZXRfZGF0ZTogcm9jVG9JU08oaXRlbS52YWxpRF9TX0RBVEUgfHwgaXRlbS52YWxpZF9zX2RhdGUgfHwgXCJcIiksXG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS52YWxpRF9TX0RBVEUgfHwgaXRlbS52YWxpZF9zX2RhdGUgfHwgXCJcIiksXG4gICAgY2F0ZWdvcnk6IFwicHJvYmxlbS1saXN0LWl0ZW1cIixcbiAgICBzZXZlcml0eTogXCJTZXZlcmUgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSlcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICBjbGluaWNhbF9zdGF0dXM6IFwiYWN0aXZlXCIsXG4gIH07XG59XG5cbi8vIElIS0UzNDAyUzAxIChcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjVcdTdENTBcdTY3OUMpIFx1MjAxNCBvbmUgcm93IHBlciBzY3JlZW5pbmcgZXZlbnQsIGZsYXRcbi8vIHNjaGVtYS4gTkhJIHJ1bnMgdGhlIHBhbmVsIGl0c2VsZiBhbmQgcmV0dXJucyB2aXRhbHMgKyBhIGZpeGVkXG4vLyBiYXR0ZXJ5IG9mIGxhYiB2YWx1ZXMgcHJlLWNvbXB1dGVkIChCTUkgLyB3YWlzdCAvIEJQIC8gbGlwaWRzIC8gTEZUXG4vLyAvIFJGVCAvIGZhc3RpbmcgZ2x1Y29zZSAvIEhCc0FnIC8gQW50aS1IQ1YgLyB1cmljIGFjaWQgXHUyMDI2KS5cbi8vIFdlIHVuZm9sZCBvbmUgcm93IGludG8gfjE1IE9ic2VydmF0aW9uczogdml0YWxzIGdvIHRvIGNhdGVnb3J5XG4vLyB2aXRhbC1zaWducyAoc28gU01BUlQgYXBwcycgdml0YWxzIHZpZXdzIHBpY2sgdGhlbSB1cCksIGxhYnMgZ28gdG9cbi8vIGNhdGVnb3J5IGxhYm9yYXRvcnkuIFJldHVybnMgYW4gQVJSQVkgXHUyMDE0IGNhbGxlciBtdXN0IGZsYXQtbWFwLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0QWR1bHRQcmV2ZW50aXZlKHJvdykge1xuICBpZiAoIXJvdyB8fCB0eXBlb2Ygcm93ICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKHJvdy5maXJzVF9ESUFHX0RBVEUgfHwgXCJcIik7XG4gIGlmICghZGF0ZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGhvc3BpdGFsID0gcm93Lmhvc1BfQUJCUiB8fCByb3cuaG9zcF9BQkJSIHx8IFwiXCI7XG4gIGNvbnN0IG91dCA9IFtdO1xuICAvLyAoZGlzcGxheSwgdmFsdWUsIHVuaXQsIHJlZlJhbmdlLCBjYXRlZ29yeSwgTkhJIGNvZGUpXG4gIC8vIChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBjb2RlKVxuICAvLyBFdmVyeSBvYnNlcnZhdGlvbiBlbWl0dGVkIGZyb20gdGhpcyBhZGFwdGVyIGNhcnJpZXMgc291cmNlX3Byb2dyYW09XG4gIC8vIFwiYWR1bHQtcHJldmVudGl2ZVwiIHNvIGRvd25zdHJlYW0gRkhJUiBjb25zdW1lcnMgY2FuIGlkZW50aWZ5IHRoZVxuICAvLyBvcmlnaW4gcHJvZ3JhbW1lIHZpYSBPYnNlcnZhdGlvbi5tZXRhLnRhZyAoc2VwYXJhdGUgZnJvbSB0aGVcbiAgLy8gc3luYy1wYWdlLXR5cGUgLyBzeW5jLXJ1bi1pZCBzeW5jLXRyYWNraW5nIHRhZ3MpLlxuICBmdW5jdGlvbiBwdXNoKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIGNvZGUpIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGNvbnN0IHYgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgICAvLyBFbS1kYXNoIFwiXHUyMDE0XCIgKFUrMjAxNCkgaXMgTkhJJ3Mgc2VudGluZWwgXCJubyBkYXRhXCIgbWFya2VyIFx1MjAxNCBkcm9wLlxuICAgIC8vIFBsYWluIGh5cGhlbiBcIi1cIiBpcyBOT1QgYSBuby1kYXRhIG1hcmtlciBwZXItZmllbGQgXHUyMDE0IGl0J3MgdGhlXG4gICAgLy8gY2xpbmljYWwgZGlwc3RpY2sgY29udmVudGlvbiBmb3IgXCJuZWdhdGl2ZVwiIChVcmluZSBQcm90ZWluKS5cbiAgICAvLyBOSEkncyBuby1kYXRhIGZsYWcgZm9yIGFuIGVudGlyZSByb3cgaXMgc2lnbmFsbGVkIGJ5XG4gICAgLy8gZmlyc1RfRElBR19EQVRFID0gXCItXCIgd2hpY2ggdGhlIHJvdy1sZXZlbCBkYXRlIGd1YXJkIGF0IHRoZSB0b3BcbiAgICAvLyBvZiBhZGFwdEFkdWx0UHJldmVudGl2ZSBhbHJlYWR5IHJlamVjdHMsIHNvIFwiLVwiIHJlYWNoaW5nIHB1c2goKVxuICAgIC8vIGFsd2F5cyBtZWFucyBcInRoZSBjbGluaWNpYW4gd3JvdGUgaXQgZG93biBhcyBhIG5lZ2F0aXZlIHJlc3VsdFwiLlxuICAgIGlmICh2ID09PSBcIlwiIHx8IHYgPT09IFwiXHUyMDE0XCIpIHJldHVybjtcbiAgICBvdXQucHVzaCh7XG4gICAgICBkYXRlLFxuICAgICAgaG9zcGl0YWwsXG4gICAgICBjYXRlZ29yeTogY2F0ZWdvcnkgfHwgXCJsYWJvcmF0b3J5XCIsXG4gICAgICBvcmRlcl9jb2RlOiBjb2RlIHx8IFwiXCIsXG4gICAgICBvcmRlcl9uYW1lOiBkaXNwbGF5LFxuICAgICAgY29kZTogY29kZSB8fCBkaXNwbGF5LFxuICAgICAgZGlzcGxheSxcbiAgICAgIHZhbHVlOiB2LFxuICAgICAgdW5pdDogdW5pdCB8fCBcIlwiLFxuICAgICAgcmVmZXJlbmNlX3JhbmdlOiByZWZSYW5nZSB8fCBcIlwiLFxuICAgICAgLy8gU291cmNlLXByb2dyYW1tZSB0YWcgXHUyMDE0IGFkZGVkIHRvIE9ic2VydmF0aW9uLm1ldGEudGFnIGJ5IHRoZVxuICAgICAgLy8gbWFwcGVyOyBsZXRzIFNNQVJUIGFwcHMgZmlsdGVyIC8gY2F0ZWdvcml6ZSBcInRoaXMgY2FtZSBmcm9tXG4gICAgICAvLyBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjUgc2NyZWVuaW5nXCIuXG4gICAgICBzb3VyY2VfcHJvZ3JhbTogXCJhZHVsdC1wcmV2ZW50aXZlXCIsXG4gICAgfSk7XG4gIH1cbiAgLy8gVml0YWwgc2lnbnMgKG5vIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgXHUyMDE0IHRoZXNlIGFyZSBzY3JlZW5pbmcgbWVhc3VyZW1lbnRzLCBub3RcbiAgLy8gbGFiIG9yZGVyczsgdGhleSBoYXZlIGNhbm9uaWNhbCBMT0lOQ3Mgd2hpY2ggZmluZExvaW5jJ3Mga2V5d29yZFxuICAvLyBzZWFyY2ggcmVzb2x2ZXMgY2xlYW5seSB2aWEgdW5pcXVlIHRlcm1zIGxpa2UgXCJib2R5IGhlaWdodFwiIC8gXCJibWlcIlxuICAvLyBcdTIwMTQgbm8gcHJlZml4LWNvbGxpc2lvbiByaXNrIHdpdGggb3RoZXIgTE9JTkNfTUFQIGtleXMpLlxuICBwdXNoKFwiQm9keSBIZWlnaHRcIiwgcm93LmhlaWdodCwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQm9keSBXZWlnaHRcIiwgcm93LndlaWdodCwgXCJrZ1wiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQk1JXCIsIHJvdy5ibWksIFwia2cvbTJcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIldhaXN0IENpcmN1bWZlcmVuY2VcIiwgcm93LndhaXN0bGluZSwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiU3lzdG9saWMgQmxvb2QgUHJlc3N1cmVcIiwgcm93LmJhc0VfU0JQLCBcIm1tSGdcIixcbiAgICAgICByb3cuYmxvRF9QUkVTU19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiRGlhc3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX0VCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgLy8gQWxsIGNoZW1pc3RyeSAvIGhlcCBwYW5lbCByb3dzIHBpbiB0aGUgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBzbyBmaW5kTG9pbmMgdGFrZXNcbiAgLy8gdGhlIE5ISV9UT19MT0lOQyBkaXJlY3QtbG9va3VwIHBhdGggXHUyMDE0IGJ5cGFzc2VzIHRoZSBrZXl3b3JkIHNlYXJjaFxuICAvLyBlbnRpcmVseS4gTWFwcGluZyBjcm9zcy12ZXJpZmllZCBhZ2FpbnN0IHRocmVlIHNvdXJjZXM6IHRoZSBOSEkgVUlcbiAgLy8gc2VjdGlvbiBsYWJlbHMgKFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjUpLCB0aGUgSUhLRTM0MDIgSlNPTiBmaWVsZFxuICAvLyBuYW1lcywgYW5kIHRoZSBleGlzdGluZyBOSElfVE9fTE9JTkMgdGFibGUgY29tbWVudHMuXG4gIC8vXG4gIC8vIExpcGlkIHBhbmVsXG4gIHB1c2goXCJDaG9sZXN0ZXJvbFwiLCAgIHJvdy5jaG8sICAgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDAxQ1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyMDkzLTNcbiAgcHVzaChcIlRyaWdseWNlcmlkZVwiLCAgcm93LmJsb0RfVEcsIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDRDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDI1NzEtOFxuICBwdXNoKFwiSERMXCIsICAgICAgICAgICByb3cuaGRsLCAgICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTA0M0NcIik7ICAvLyBcdTIxOTIgTE9JTkMgMjA4NS05XG4gIHB1c2goXCJMRExcIiwgICAgICAgICAgIHJvdy5sZGwsICAgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDQ0Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAxMzQ1Ny03IChjYWxjKVxuICAvLyBMaXZlciBmdW5jdGlvblxuICBwdXNoKFwiU0dPVCAoQVNUKVwiLCAgICByb3cuc2dvdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMjVDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDE5MjAtOFxuICBwdXNoKFwiU0dQVCAoQUxUKVwiLCAgICByb3cuc2dwdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMjZDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDE3NDItNlxuICAvLyBGYXN0aW5nIGdsdWNvc2VcbiAgcHVzaChcIkdsdS1BQ1wiLCAgICAgICAgcm93LnNfMDkwMDVDLCBcIm1nL2RMXCIsXG4gICAgICAgcm93LnNfMDkwMDVDX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDVDXCIpOyAgICAgICAgLy8gXHUyMTkyIExPSU5DIDE1NTgtNlxuICAvLyBSZW5hbCBmdW5jdGlvbiBcdTIwMTQgYHVyaW5FX0JVTmAgaXMgTkhJJ3MgbWlzbGVhZGluZyBmaWVsZCBuYW1lOyB0aGVcbiAgLy8gdmFsdWUgSVMgc2VydW0gQlVOIChCbG9vZCBVcmVhIE5pdHJvZ2VuKSwgbm90IGEgdXJpbmUgdGVzdC5cbiAgcHVzaChcIkJVTlwiLCAgICAgICAgICAgcm93LnVyaW5FX0JVTiwgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDAyQ1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAzMDk0LTBcbiAgcHVzaChcIkNyZWF0aW5pbmVcIiwgICAgcm93LmJsb0RfQ1JFQVQsICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDE1Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyMTYwLTBcbiAgLy8gZUdGUiBcdTIwMTQgZGVyaXZlZCBmcm9tIENyZWF0aW5pbmUsIG5vIG93biBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDLiBEaXNwbGF5IGtleXdvcmRcbiAgLy8gXCJlZ2ZyXCIgcmVzb2x2ZXMgdG8gTE9JTkMgMzM5MTQtMyB2aWEgZmluZExvaW5jLlxuICBwdXNoKFwiZUdGUlwiLCAgICAgICAgICByb3cuZWdmciwgICAgICAgIFwibUwvbWluLzEuNzNtMlwiLFxuICAgICAgIHJvdy5yRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICAvLyBVcmluZSBQcm90ZWluIGRpcHN0aWNrIFx1MjAxNCBxdWFsaXRhdGl2ZSAoXCItXCIgLyBcIlx1MDBCMVwiIC8gXCIxK1wiIC4uLikuXG4gIC8vIHVyaW5FX1BST1RFSU4gaXMgdGhlIHN0YXR1cyBjb2RlLCB1cmluRV9QUk9URUlOX1RFWFQgaXMgdGhlXG4gIC8vIGRpc3BsYXlhYmxlIHJlc3VsdCAocGFzc2VkIGFzIHZhbHVlKS4gVGhlIHNwZWNpZmljIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgZm9yXG4gIC8vIHByZXZlbnRpdmUtc2NyZWVuaW5nIHVyaW5lIHByb3RlaW4gaXNuJ3QgaW4gb3VyIE5ISV9UT19MT0lOQyB0YWJsZVxuICAvLyB5ZXQ7IHRoZSBrZXl3b3JkIFwidXJpbmUgcHJvdGVpblwiIHJlc29sdmVzIHRvIExPSU5DIDIwNDU0LTUgdmlhXG4gIC8vIGZpbmRMb2luYyAoYWZ0ZXIgdGhlIHYwLjYuNyBsb25nZXN0LW1hdGNoIGZpeCkuXG4gIHB1c2goXCJVcmluZSBQcm90ZWluXCIsIHJvdy51cmluRV9QUk9URUlOX1RFWFQgfHwgXCJcIiwgXCJcIiwgXCJcIik7XG4gIC8vIEhlcGF0aXRpcyBCL0Mgc2NyZWVuaW5nIFx1MjAxNCBzdGF0dXMgY29kZSB2cyBfVEVYVCB0cmFwIGRvY3VtZW50ZWQgYXRcbiAgLy8gbGVuZ3RoIGJlbG93LiBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHBpbm5lZCBzbyBmaW5kTG9pbmMgdGFrZXMgdGhlIE5ISV9UT19MT0lOQ1xuICAvLyBwYXRoIChvdGhlcndpc2UgdGhlIGtleXdvcmQgXCJoYlwiIHByZWZpeC1jb2xsaWRlcyB3aXRoIHRoZSBtb3JlXG4gIC8vIHNwZWNpZmljIFwiaGJzYWdcIiBcdTIwMTQgdGhlIGJ1ZyBvcmlnaW5hbGx5IHJlcG9ydGVkIGluIHYwLjYuNSkuXG4gIC8vICAgMTQwMzJDIFx1MjE5MiBMT0lOQyA1MTk2LTEgIChIQnNBZywgTWFzcy92b2wpXG4gIC8vICAgMTQwNTFDIFx1MjE5MiBMT0lOQyAxMzk1NS0wIChIQ1YgYW50aWJvZHksIFNlcnVtIG9yIFBsYXNtYSlcbiAgLy8gSGlzdG9yeTogcmVncmVzc2VkIGluIHYwLjYuMywgZml4IGxvc3QgdW50aWwgdjAuNi41OyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDXG4gIC8vIHBpbm5pbmcgYWRkZWQgdjAuNi42ICsgdjAuNi44LlxuICBwdXNoKFwiSEJzQWdcIiwgICAgcm93Lmhic2FHX1RFWFQgICB8fCBcIlwiLCBcIlwiLCByb3cuaGJWX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjE0MDMyQ1wiKTtcbiAgcHVzaChcIkFudGktSENWXCIsIHJvdy5hbnRJX0hDVl9URVhUIHx8IFwiXCIsIFwiXCIsIHJvdy5oY1ZfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMTQwNTFDXCIpO1xuICAvLyBVcmljIGFjaWQgKGJsb29kKSBcdTIwMTQgYHVyaUNfQUNJRGAgZmllbGQuIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgMDkwMTNDIFx1MjE5MiBMT0lOQ1xuICAvLyAzMDg0LTEgKFVyYXRlIE1hc3Mvdm9sIFMvUCkuXG4gIC8vXG4gIC8vIE5ISSdzIElIS0UzNDAyIHNjaGVtYSBBTFNPIGNhcnJpZXMgdHdvIHJlbGF0ZWQtbG9va2luZy1idXQtZGlzdGluY3RcbiAgLy8gZmllbGRzIHdlIGRlbGliZXJhdGVseSBza2lwOlxuICAvLyAgIC0gdXJpbkVfVUFfRElBR19BQ0lEIFx1MjAxNCBlbXBpcmljYWxseSBkdXBsaWNhdGVzIHNlcnVtIHVyaWMgYWNpZDtcbiAgLy8gICAgIGVtaXR0aW5nIGl0IHdvdWxkIGNyZWF0ZSBhIGR1cGxpY2F0ZSBPYnNlcnZhdGlvbi5cbiAgLy8gICAtIHVyaW5FX1VBIC8gdXJpbkVfVUFfRElBR19SRVNVTFRfVEVYVCBcdTIwMTQgY2xhaW0gdG8gYmUgYSB1cmluZSBVQVxuICAvLyAgICAgZGlwc3RpY2sgYnV0IERPTidUIGFwcGVhciBhbnl3aGVyZSBpbiBOSEkncyBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgVUkgZm9yXG4gIC8vICAgICBhZHVsdCBwcmV2ZW50aXZlIHNjcmVlbmluZyAodGhlIFx1NUMzRlx1NkRCMlx1NkFBMlx1NjdFNSBzZWN0aW9uIG9ubHkgc2hvd3NcbiAgLy8gICAgIFx1NUMzRlx1NkRCMlx1ODZDQlx1NzY3RFx1OENFQSkuIEFsd2F5cyBlbXB0eSAvIFwiLVwiIGluIG9ic2VydmVkIHBheWxvYWRzLiBMZWdhY3lcbiAgLy8gICAgIHNjaGVtYSBmaWVsZCB3aXRoIG5vIGNsaW5pY2FsIHJlYWxpdHkgXHUyMDE0IGRvIE5PVCBlbWl0LlxuICBwdXNoKFwiVXJpYyBBY2lkXCIsICAgICByb3cudXJpQ19BQ0lELCAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMTNDXCIpO1xuICAvLyBNZXRhYm9saWMgc3luZHJvbWUgc2NyZWVuaW5nIFx1MjAxNCB2YWx1ZSBpcyBhbiBpbnRlcnByZXRhdGlvbiBzdHJpbmdcbiAgLy8gKCdcdTZCNjNcdTVFMzgnIC8gJ1x1NzU3MFx1NUUzOFx1RkYwQ1x1NUVGQVx1OEI3MFx1RkYxQVx1OEFDQlx1NkQzRFx1OEE2Mlx1OTFBQlx1NUUyQicpLCBub3QgYSBudW1iZXIuIFRoZSBtYXBwZXInc1xuICAvLyBfdHJ5X3BhcnNlX3F1YW50aXR5IHdpbGwgcmV0dXJuIE5vbmUgYW5kIGl0IGZhbGxzIHRocm91Z2ggdG9cbiAgLy8gdmFsdWVTdHJpbmcuIE5vIG1hcHBlZCBMT0lOQyBrZXl3b3JkICh5ZXQpIHNvIHRoaXMgbGFuZHMgYXMgYW5cbiAgLy8gT2JzZXJ2YXRpb24gd2l0aCBjb2RlLnRleHQgb25seTsgZG93bnN0cmVhbSBjb25zdW1lcnMgY2FuIHN0aWxsXG4gIC8vIHN1cmZhY2UgaXQgdW5kZXIgdGhlIHBhdGllbnQncyBzY3JlZW5pbmcgc2VjdGlvbiBieSBjb2RlLnRleHQuXG4gIHB1c2goXCJcdTRFRTNcdThCMURcdTc1QzdcdTUwMTlcdTdGQTRcdTdCRTlcdTZBQTIgKE1ldGFib2xpYyBTeW5kcm9tZSBTY3JlZW5pbmcpXCIsXG4gICAgICAgcm93Lm1ldEFfU1lORFJfUkVTVUxUX1RFWFQsIFwiXCIsIFwiXCIpO1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyBJSEtFMzMwOVMwMSAoXHU0RjRGXHU5NjYyIGlucGF0aWVudCBsaXN0KSBcdTIwMTQgZ2l2ZXMgcHJvcGVyIGFkbWlzc2lvbi9kaXNjaGFyZ2UuXG4vLyBTaGFwZToge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIGluX0RBVEUsIG91dF9EQVRFLFxuLy8gICAgICAgICBpY2Q5Y21fQ09ERSwgaWNkOWNtX0NPREVfQ05BTUUsIG9yaV9UWVBFKFwiM1wiKSwgcm93X0lELCAuLi59XG4vLyBJSEtFMzMwOFMwMSBoYXMgdGhlIHNhbWUgc2hhcGUgZm9yIGEgc21hbGwgc2V0IG9mIG9sZGVyIFx1NEY0Rlx1OTY2MiByZWNvcmRzO1xuLy8gYGZ1bmNfREFURWAgaW5zdGVhZCBvZiBgaW5fREFURWAgaW4gc29tZSByb3dzIFx1MjAxNCBhZGFwdGVyIGFjY2VwdHMgYm90aC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdElucGF0aWVudEVuY291bnRlcihpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHN0YXJ0ID0gcm9jVG9JU08oaXRlbS5pbl9EQVRFIHx8IGl0ZW0uZnVuY19EQVRFIHx8IFwiXCIpO1xuICBjb25zdCBlbmQgPSByb2NUb0lTTyhpdGVtLm91dF9EQVRFIHx8IFwiXCIpO1xuICBpZiAoIXN0YXJ0KSByZXR1cm4gbnVsbDtcbiAgLy8gaWNkOWNtIG5hbWUgb24gXHU0RjRGXHU5NjYyIGxpc3QgaXMganVzdCBDaGluZXNlIChubyB8fCBFbmdsaXNoIHNwbGl0IG9ic2VydmVkKS5cbiAgY29uc3QgaWNkQ29kZSA9IGl0ZW0uaWNkOWNtX0NPREUgfHwgaXRlbS5pY2Q5Y21fY29kZSB8fCBcIlwiO1xuICBjb25zdCBpY2ROYW1lID0gcGlja0VuZ2xpc2goaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9uYW1lIHx8IFwiXCIpO1xuICByZXR1cm4ge1xuICAgIGRhdGU6IHN0YXJ0LFxuICAgIGVuZF9kYXRlOiBlbmQsXG4gICAgY2xhc3M6IFwiSU1QXCIsXG4gICAgdHlwZV9kaXNwbGF5OiBcIlx1NEY0Rlx1OTY2MlwiLFxuICAgIGRlcGFydG1lbnQ6IFwiXCIsXG4gICAgcHJvdmlkZXI6IFwiXCIsXG4gICAgcmVhc29uOiBpY2ROYW1lID8gKGljZENvZGUgPyBgJHtpY2RDb2RlfSAke2ljZE5hbWV9YCA6IGljZE5hbWUpIDogXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICByb3dfaWQ6IGl0ZW0ucm93X0lEIHx8IGl0ZW0ucm93X2lkIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzMzAzUzAxIChcdTkxQUJcdTc2NDJcdThDQkJcdTc1MjhcdTc1MzNcdTU4MzEpIGl0ZW0gc2hhcGUgXHUyMDE0IGZhciBtb3JlIGNvbXBsZXRlIHRoYW4gdGhlIG9sZGVyXG4vLyBJSEtFMzMwMVMwMiB2aXNpdCBsaXN0ICg1MSB2aXNpdHMgdnMgNiBmb3IgdGhlIHRlc3QgcGF0aWVudCkuIE5ISSdzXG4vLyBjYW5vbmljYWwgc291cmNlIG9mIHRydXRoIGZvciBcImV2ZXJ5IGJpbGxlZCBlbmNvdW50ZXJcIi5cbi8vICAgaG9zUF9JRCwgaG9zUF9BQkJSLCBob3NwX3VybFxuLy8gICBmdW5DX0RBVEUgICAgICAgICAgICAgIChcdTZDMTFcdTU3MEIgWVlZL01NL0REKVxuLy8gICBpY0Q5Q01fQ09ERSAvIGljRDlDTV9DT0RFX0NOQU1FXG4vLyAgIG9ySV9UWVBFIC8gb3JpX3R5cGVfbmFtZSAgIChcIklDXHU1MzYxXHU4Q0M3XHU2NTk5XCIgLyBcIlx1NzUzM1x1NTgzMVx1OENDN1x1NjU5OVwiKSBcdTIwMTQgb3JpZ2luLCBOT1QgXHU5NTgwL1x1NjAyNS9cdTRGNEZcbi8vICAgcGFydF9BTVQsIGFwcGxfRE9ULCBcdTIwMjYgICAoYmlsbGluZyBcdTIwMTQgZGlzY2FyZGVkKVxuLy8gICByb1dfSUQgICAgICAgICAgICAgICAgICBkZXRhaWwga2V5IGZvciBJSEtFMzMwM1MwMiBmYW4tb3V0IChQaGFzZSBCKVxuLy8gV2UgZG9uJ3QgaGF2ZSB2aXNpdCBjbGFzcyAoXHU5NTgwL1x1NjAyNS9cdTRGNEYpIGF0IHRoZSBsaXN0IGxldmVsOyB0aGUgUzAyIGRldGFpbFxuLy8gaGFzIGhvc3BfREFUQV9UWVBFX05BTUUgKFwiXHU4OTdGXHU5MUFCXCIvXCJcdTRFMkRcdTkxQUJcIi9cIlx1NzI1OVx1OTFBQlwiKS4gRm9yIG5vdyBkZWZhdWx0IEFNQi5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlKGl0ZW0sIGNsYXNzSGludCkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgaXRlbS5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIGlmICghZGF0ZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGljZENvZGUgPSBpdGVtLmljRDlDTV9DT0RFIHx8IGl0ZW0uaWNkOWNtX0NPREUgfHwgaXRlbS5pY2Q5Y21fY29kZSB8fCBcIlwiO1xuICBjb25zdCBpY2ROYW1lID0gcGlja0VuZ2xpc2goXG4gICAgaXRlbS5pY0Q5Q01fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX25hbWUgfHwgXCJcIlxuICApO1xuICAvLyBjbGFzcyBkZWZhdWx0cyB0byBBTUI7IElIS0UzMzAzUzAyIGRldGFpbCBmYW4tb3V0IG1heSBvdmVycmlkZSB0b1xuICAvLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUgKFx1NjAyNVx1OEEzQSAvIFx1NEY0Rlx1OTY2MikuXG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBlbmRfZGF0ZTogXCJcIixcbiAgICBjbGFzczogY2xhc3NIaW50IHx8IFwiQU1CXCIsXG4gICAgLy8gT3JpZ2luIG1hcmtlciBpc24ndCBhIGNsaW5pY2FsIGNsYXNzLCBidXQgc3Rhc2ggaXQgYXMgdHlwZV9kaXNwbGF5XG4gICAgLy8gc28gZG93bnN0cmVhbSBzZWVzIHRoZSBOSEkgbGFiZWwgd2l0aG91dCB1cyBpbnZlbnRpbmcgb25lLlxuICAgIHR5cGVfZGlzcGxheTogaXRlbS5vcmlfdHlwZV9uYW1lIHx8IGl0ZW0ub3JJX1RZUEVfTkFNRSB8fCBcIlwiLFxuICAgIGRlcGFydG1lbnQ6IFwiXCIsXG4gICAgcHJvdmlkZXI6IFwiXCIsXG4gICAgcmVhc29uOiBpY2ROYW1lID8gKGljZENvZGUgPyBgJHtpY2RDb2RlfSAke2ljZE5hbWV9YCA6IGljZE5hbWUpIDogXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAvLyBQYXNzIHRocm91Z2ggZm9yIHRoZSBldmVudHVhbCBJSEtFMzMwM1MwMiBkZXRhaWwgZmV0Y2ggKFBoYXNlIEIpLlxuICAgIHJvd19pZDogaXRlbS5yb1dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0QWxsZXJneShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGFsbGVyZ2VuID1cbiAgICBpdGVtLmFsbGVyZ2VuX25hbWUgfHwgaXRlbS5hbGxlUl9OQU1FIHx8IGl0ZW0ubWVkbmFtZSB8fFxuICAgIGl0ZW0uZHJ1R19OQU1FIHx8IGl0ZW0uYWxsZXJnZW4gfHwgXCJcIjtcbiAgaWYgKCFhbGxlcmdlbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5yZWNvckRfREFURSB8fCBcIlwiKSxcbiAgICBkaXNwbGF5OiBhbGxlcmdlbixcbiAgICBjYXRlZ29yeTogXCJtZWRpY2F0aW9uXCIsXG4gICAgY3JpdGljYWxpdHk6IFwidW5hYmxlLXRvLWFzc2Vzc1wiLFxuICAgIHJlYWN0aW9uOiBpdGVtLnJlYWN0aW9OIHx8IGl0ZW0uc3ltcHRvbSB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwMVMwNSAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBsaXN0KSBzaGFwZTpcbi8vICAge2hvc3BfaWQsIGhvc3BfYWJiciwgaG9zcF91cmwsIG9yaV90eXBlX25hbWUsIG9yaV90eXBlLCBmdW5jX2RhdGUsXG4vLyAgICBvdXRfZGF0ZSwgaWNkOWNtX2NvZGUsIGljZDljbV9jb2RlX2NuYW1lLCBvcF9jb2RlX2NuYW1lLCByb3dfaWR9XG4vLyBOb3RlOiBubyBwcm9jZWR1cmUgQ09ERSBpbiBsaXN0IFx1MjAxNCBvcF9jb2RlX2NuYW1lIGlzIHRoZSBvbmx5IGxhYmVsLlxuLy8gRGF0ZSBub3RlOiBOSEkgZG9lc24ndCBleHBvc2UgYSBzZXBhcmF0ZSBcImFjdHVhbCBwcm9jZWR1cmUgZGF0ZVwiIGhlcmUsXG4vLyBzbyBmb3IgaW5wYXRpZW50IHByb2NlZHVyZXMgKHdoZXJlIGZ1bmNfZGF0ZSA9IGFkbWlzc2lvbiwgb3V0X2RhdGUgPVxuLy8gZGlzY2hhcmdlKSB3ZSBkZWxpYmVyYXRlbHkgdXNlIGZ1bmNfZGF0ZSBhcyB0aGUgYW5jaG9yLiBUaGUgcHJvY2VkdXJlXG4vLyBcImhhcHBlbmVkIHNvbWV3aGVyZSBpbiB0aGlzIGFkbWlzc2lvblwiIFx1MjAxNCBhbmNob3JpbmcgdG8gdGhlIHN0YXJ0IGRheVxuLy8gaXMgYSBzbWFsbCBsb3NzIG9mIGFjY3VyYWN5IHZzLiBpbnZlbnRpbmcgYSBwZXJmb3JtZWRQZXJpb2QgdGhhdCB3b3VsZFxuLy8gc3VnZ2VzdCB0aGUgcHJvY2VkdXJlIHNwYW5uZWQgdGhlIHdob2xlIHN0YXkuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRQcm9jZWR1cmUoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oaXRlbS5mdW5jX2RhdGUgfHwgaXRlbS5mdW5DX0RBVEUpO1xuICBjb25zdCBkaXNwbGF5ID0gcGlja0VuZ2xpc2goXG4gICAgaXRlbS5vcF9jb2RlX2NuYW1lIHx8IGl0ZW0ucHJvQ19OQU1FIHx8IGl0ZW0ub3JkZVJfTkFNRSB8fCBcIlwiXG4gICk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSkgcmV0dXJuIG51bGw7XG4gIC8vIERpYWdub3NpcyAoaWNkOWNtX2NvZGVfY25hbWUpIGlzIHRoZSAqcmVhc29uKiBmb3IgdGhlIHByb2NlZHVyZSwgbm90XG4gIC8vIHRoZSBwcm9jZWR1cmUgY29kZSBpdHNlbGYuIFN0YXNoIGl0IGluIGBub3RlYCBzbyBpdCBzaG93cyB1cCBpbiB0aGVcbiAgLy8gRkhJUiByZXNvdXJjZSB3aXRob3V0IHBvbGx1dGluZyB0aGUgY29kZSBmaWVsZC5cbiAgY29uc3QgcmVhc29uQ29kZSA9IGl0ZW0uaWNkOWNtX2NvZGUgfHwgaXRlbS5pY2Q5Y21fQ09ERSB8fCBcIlwiO1xuICBjb25zdCByZWFzb25OYW1lID0gcGlja0VuZ2xpc2goaXRlbS5pY2Q5Y21fY29kZV9jbmFtZSB8fCBpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IFwiXCIpO1xuICBjb25zdCBub3RlID0gcmVhc29uTmFtZVxuICAgID8gKHJlYXNvbkNvZGUgPyBgUmVhc29uOiAke3JlYXNvbkNvZGV9ICR7cmVhc29uTmFtZX1gIDogYFJlYXNvbjogJHtyZWFzb25OYW1lfWApXG4gICAgOiBcIlwiO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogXCJcIixcbiAgICBkaXNwbGF5LFxuICAgIG5vdGUsXG4gICAgYm9keV9zaXRlOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfYWJiciB8fCBpdGVtLmhvc1BfQUJCUiB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzQwOFMwMSAoXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1IGxpc3QpIHNoYXBlOlxuLy8gICB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgcmVhbF9JTlNQRUNUX0RBVEUsIG9yZGVyX0NPREUsXG4vLyAgICBvcmRlcl9DT0RFXzJXb3JkLCBvcmRlcl9OQU1FLCBvcmlfVFlQRSwgcm93X0lELCBqcEdfU1RBVFVTLCAuLi59XG4vLyBObyBmaW5kaW5ncy9jb25jbHVzaW9uIFx1MjAxNCBsaXN0IGlzIG9yZGVyLWxldmVsIG9ubHkuIFdlIG1hcCB0byBQcm9jZWR1cmVcbi8vIChhbiBleGFtIHdhcyBwZXJmb3JtZWQpIHJhdGhlciB0aGFuIERpYWdub3N0aWNSZXBvcnQgKHdoaWNoIG5lZWRzIGFcbi8vIG5hcnJhdGl2ZSkuIElmL3doZW4gd2UgZmV0Y2ggdGhlIGFjdHVhbCByZXBvcnQgdGhpcyBiZWNvbWVzIGEgRFIuXG4vLyBJSEtFMzQwOFMwMiBkZXRhaWwgcHJvdmlkZXMgdGhlIGZ1bGwgcmFkaW9sb2d5IC8gZW5kb3Njb3B5IHJlcG9ydCBpblxuLy8gYGRlc2NgLiBDb21iaW5lZCB3aXRoIG9yZGVyX05BTUUgKyB0aGUgZXhhbSBkYXRlIHRoaXMgaXMgYSBwcm9wZXIgRkhJUlxuLy8gRGlhZ25vc3RpY1JlcG9ydC4gTGlzdC1vbmx5IGVudHJpZXMgKHdoZXJlIHRoZSBkZXRhaWwgZmV0Y2ggcmV0dXJuZWRcbi8vIG5vIGBkZXNjYCkgZ2V0IGRyb3BwZWQgXHUyMDE0IHdpdGhvdXQgYSBuYXJyYXRpdmUgdGhlIHJlcG9ydCBtYXBwZXIgd291bGRcbi8vIHJlamVjdCB0aGVtIGFueXdheS5cbi8vXG4vLyBEYXRlIGZpZWxkIGNob2ljZSBcdTIwMTQgSUhLRTM0MDhTMDIgZGV0YWlsIHBheWxvYWQgZXhwb3Nlczpcbi8vICAgLSByZWFsX0lOU1BFQ1RfREFURSAgXHU1QkU2XHU5NjlCXHU2M0ExXHU2QUEyL1x1NTA1QVx1NUY3MVx1NTBDRlx1NjVFNSAobW9zdCBhY2N1cmF0ZSB3aGVuIHByZXNlbnQpXG4vLyAgIC0gZnVuY19EQVRFICAgICAgICAgIFx1NUMzMVx1OEEzQS9cdTUxNjVcdTk2NjJcdTY1RTUgKHZpc2l0IGFuY2hvcilcbi8vICAgLSBhc3NheV9VUExPQURfREFURSAgXHU1ODMxXHU1NDRBXHU0RTBBXHU1MEIzXHU2NjQyXHU5NTkzIChvZnRlbiB3ZWVrcyBhZnRlciB0aGUgZXhhbSBcdTIwMTRcbi8vICAgICAgICAgICAgICAgICAgICAgICAgYmVsb25ncyB0byBEaWFnbm9zdGljUmVwb3J0Lmlzc3VlZCwgTk9UXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdGl2ZURhdGVUaW1lKVxuLy8gSW4gcHJhY3RpY2UgcmVhbF9JTlNQRUNUX0RBVEUgaXMgb2Z0ZW4gbnVsbCBvbiB0aGUgUzAyIGRldGFpbFxuLy8gKGNvbmZpcm1lZCBhZ2FpbnN0IGxpdmUgTkhJIHBheWxvYWRzKTsgd2UgdGhlbiBmYWxsIGJhY2sgdG9cbi8vIGZ1bmNfREFURSByYXRoZXIgdGhhbiB0aGUgdXBsb2FkIHRpbWUuIEZhbGxpbmcgYmFjayB0byB0aGVcbi8vIHVwbG9hZCBkYXRlIHdvdWxkIGxhbmQgdGhlIGV4YW0gaW4gYSBkYXRlIHRoYXQncyBldmVuIGZ1cnRoZXJcbi8vIGZyb20gcmVhbGl0eSAoZS5nLiBDVCBkb25lIDIwMjYvMDEvMTQsIHVwbG9hZCAyMDI2LzAyLzI0IFx1MjE5MiB1c2luZ1xuLy8gdXBsb2FkIGRhdGUgd291bGQgc2F5IFwiaGFkIGEgQ1Qgb24gMjAyNi8wMi8yNFwiIHdoaWNoIGlzIHdyb25nKS5cbi8vIGZ1bmNfREFURSBhdCB3b3JzdCBtZWFucyBcImV4YW0gaGFwcGVuZWQgZHVyaW5nIHRoaXMgYWRtaXNzaW9uXCIuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbChpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhcbiAgICBpdGVtLnJlYWxfSU5TUEVDVF9EQVRFIHx8IGl0ZW0ucmVhbF9pbnNwZWN0X2RhdGUgfHxcbiAgICBpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiLFxuICApO1xuICBjb25zdCBkaXNwbGF5ID0gcGlja0VuZ2xpc2goaXRlbS5vcmRlcl9OQU1FIHx8IGl0ZW0ub3JkZXJfbmFtZSB8fCBcIlwiKTtcbiAgY29uc3QgY29uY2x1c2lvbiA9IChpdGVtLmRlc2MgfHwgXCJcIikudHJpbSgpO1xuICBpZiAoIWRhdGUgfHwgIWRpc3BsYXkgfHwgIWNvbmNsdXNpb24pIHJldHVybiBudWxsO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogaXRlbS5vcmRlcl9DT0RFIHx8IGl0ZW0ub3JkZXJfY29kZSB8fCBcIlwiLFxuICAgIHN5c3RlbTogXCJcIixcbiAgICBkaXNwbGF5LFxuICAgIGNhdGVnb3J5OiBcIlJBRFwiLFxuICAgIGNvbmNsdXNpb24sXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gTkhJIHNlcGFyYXRlcyB0aGUgZXhhbSBkYXRlIChmdW5jX0RBVEUpIGZyb20gdGhlIHJlcG9ydC11cGxvYWRcbiAgICAvLyB0aW1lc3RhbXAgKGFzc2F5X1VQTE9BRF9EQVRFKS4gVGhlIGxhdHRlciBpcyB3aGVuIHRoZSByZXBvcnRcbiAgICAvLyB3YXMgZmluYWxpc2VkIGluIE5ISSdzIHN5c3RlbSBcdTIwMTQgbWFwcyB0byBEaWFnbm9zdGljUmVwb3J0Lmlzc3VlZC5cbiAgICAvLyBGYWxscyBiYWNrIHRvIE5vbmUgaWYgTkhJIGRpZG4ndCBzaGlwIG9uZS5cbiAgICBpc3N1ZWQ6IHJvY1RvSVNPKChpdGVtLmFzc2F5X1VQTE9BRF9EQVRFIHx8IFwiXCIpLnNwbGl0KC9cXHMrLylbMF0pLFxuICB9O1xufVxuIiwgIi8vIE5ISSBBUEkgZW5kcG9pbnQgcmVnaXN0cnkgXHUyMDE0IHdoYXQgd2UgZmV0Y2gsIHdoZXJlIGVhY2ggcm93IGdvZXMsXG4vLyB3aGljaCBhZGFwdGVyIHRvIGNhbGwgb24gaXQuXG4vL1xuLy8gRXh0cmFjdGVkIGZyb20gYmFja2dyb3VuZC5qcyBzbyB3ZSBjYW46XG4vLyAgIDEuIFVuaXQtdGVzdCBcImV2ZXJ5IGVuZHBvaW50IG5hbWUgaGFzIGEgQ2hpbmVzZSBsYWJlbFwiIFx1MjAxNCBoaXN0b3JpY2FsbHlcbi8vICAgICAgaXQgd2FzIGVhc3kgdG8gYWRkIGEgbmV3IGVuZHBvaW50IGFuZCBmb3JnZXQgdG8gdXBkYXRlXG4vLyAgICAgIEVORFBPSU5UX0xBQkVMX1pILCBsZWF2aW5nIHRoZSBwb3B1cCdzIFx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMCByb3cgbGFiZWxsZWQgd2l0aFxuLy8gICAgICB0aGUgZGV2LWZsYXZvdXJlZCByYXcga2V5IChcIm90aGVyX2xhYnNcIiBpbnN0ZWFkIG9mIFwiXHU2QUEyXHU5QTU3XCIpLlxuLy8gICAyLiBLZWVwIGJhY2tncm91bmQuanMgZm9jdXNlZCBvbiBmbG93IGNvbnRyb2wgKyB0YWIvSU8gbG9naWMuXG4vL1xuLy8gQWRhcHRlciByZWZlcmVuY2VzIGxpdmUgaW4gLi9uaGktYWRhcHRlcnMuanMuIFNlZSB0aGF0IG1vZHVsZSBmb3IgdGhlXG4vLyBwZXItYWRhcHRlciBmaWVsZC1wcmlvcml0eSBkZWNpc2lvbnMgKGRhdGUgc2VsZWN0aW9uLCBuYW1lIGZhbGxiYWNrcyxcbi8vIGJpbGluZ3VhbCBzcGxpdHRpbmcsIGV0Yy4pLlxuXG5pbXBvcnQge1xuICBhZGFwdEFkdWx0UHJldmVudGl2ZSxcbiAgYWRhcHRBbGxlcmd5LFxuICBhZGFwdENhdGFzdHJvcGhpY0lsbG5lc3MsXG4gIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsXG4gIGFkYXB0SW1hZ2luZ0xpc3RTdHViLFxuICBhZGFwdElucGF0aWVudEVuY291bnRlcixcbiAgYWRhcHRMYWJJdGVtLFxuICBhZGFwdE1lZGljYXRpb24sXG4gIGFkYXB0UHJvY2VkdXJlLFxufSBmcm9tIFwiLi9uaGktYWRhcHRlcnMuanNcIjtcblxuLy8gVXNlci1mYWNpbmcgbGFiZWwgZm9yIGVhY2ggZW5kcG9pbnQgbmFtZS4gVGhlIGJyZWFrZG93biBjb2xsYXBzaWJsZVxuLy8gaW4gdGhlIHBvcHVwIChcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiKSByZWFkcyBmcm9tIHRoaXMgc28gdXNlcnMgc2VlIFwiXHU1QzMxXHU5MUFCIDEyIFx1N0I0NlwiXG4vLyBpbnN0ZWFkIG9mIHRoZSBkZXYtZmxhdm91cmVkIFwiZW5jb3VudGVycz0xMi8xMlwiLiBVbmtub3duIG5hbWVzIGZhbGxcbi8vIHRocm91Z2ggdG8gdGhlIHJhdyBrZXksIHdoaWNoIGtlZXBzIGl0IG9idmlvdXMgZHVyaW5nIGRldmVsb3BtZW50XG4vLyB3aGVuIHdlIGFkZCBhIG5ldyBlbmRwb2ludCBhbmQgaGF2ZW4ndCBsYWJlbGxlZCBpdCB5ZXQuXG5leHBvcnQgY29uc3QgRU5EUE9JTlRfTEFCRUxfWkggPSB7XG4gIGVuY291bnRlcnM6IFwiXHU1QzMxXHU5MUFCXCIsXG4gIGlucGF0aWVudDogXCJcdTRGNEZcdTk2NjJcIixcbiAgaW5wYXRpZW50X2xlZ2FjeTogXCJcdTRGNEZcdTk2NjJcdUZGMDhcdTgyMEFcdUZGMDlcIixcbiAgcHJvY2VkdXJlczogXCJcdTYyNEJcdTg4NTMgLyBcdTg2NTVcdTdGNkVcIixcbiAgbWVkaWNhdGlvbnM6IFwiXHU4NjU1XHU2NUI5XHU4NUU1XHU1NEMxXCIsXG4gIGFsbGVyZ2llczogXCJcdTg1RTVcdTcyNjlcdTkwNEVcdTY1NEZcIixcbiAgYWxsZXJnaWVzX2I6IFwiXHU4NUU1XHU3MjY5XHU5MDRFXHU2NTRGXHVGRjA4Qlx1RkYwOVwiLFxuICBhZHVsdF9wcmV2ZW50aXZlOiBcIlx1NjIxMFx1NEVCQVx1NTA2NVx1NkFBMlwiLFxuICBjYW5jZXJfc2NyZWVuaW5nOiBcIlx1NzY0Q1x1NzVDN1x1N0JFOVx1NkFBMlwiLFxuICBpbWFnaW5nOiBcIlx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNVwiLFxuICBvdGhlcl9sYWJzOiBcIlx1NkFBMlx1OUE1N1wiLFxuICBjYXRhc3Ryb3BoaWNfaWxsbmVzczogXCJcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzVcIixcbn07XG5cbi8vIHBhZ2VfdHlwZSBcdTIxOTIgYmFja2VuZCBwYWdlX3R5cGUgc3RyaW5nIHVzZWQgYnkgbWFwcGVycy5cbi8vIHBhdGggaXMgcmVsYXRpdmUgdG8gbmhpQmFzZS4gbWV0aG9kIGRlZmF1bHQgXCJHRVRcIi5cbi8vIGBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZWAgPSBlbmRwb2ludCBhY2NlcHRzIHNfZGF0ZSAvIGVfZGF0ZSBpbiBcdTZDMTFcdTU3MEIgZm9ybWF0LlxuLy8gQ29uZmlybWVkIHZpYSBVUkxzIG9ic2VydmVkIGluIE5ISSdzIFNQQS4gT3RoZXIgZW5kcG9pbnRzIGVpdGhlciBkb24ndFxuLy8gYWNjZXB0IHJhbmdlIHBhcmFtcywgb3IgTkhJIHJlamVjdHMgdW5rbm93biBwYXJhbXMgXHUyMDE0IHdlIGxlYXZlIHRoZW0gYWxvbmVcbi8vICh0aGV5IGZhbGwgYmFjayB0byB0aGVpciBkZWZhdWx0IHdpbmRvdywgdHlwaWNhbGx5IDEtMiB5ZWFycykuXG5leHBvcnQgY29uc3QgTkhJX0FQSV9FTkRQT0lOVFMgPSBbXG4gIC8vIGVuY291bnRlcnMgLyBwcm9jZWR1cmVzIGRvbid0IGhhdmUgYSAvc2VhcmNoIHZhcmlhbnQgKDQwNCkuIHBhZ2VfbG9hZFxuICAvLyBzaWxlbnRseSBpZ25vcmVzIHNfZGF0ZSAvIGVfZGF0ZSBcdTIwMTQgdmVyaWZpZWQgdGhlIGFycmF5IGxlbmd0aCBpc1xuICAvLyBpZGVudGljYWwgd2l0aCBvciB3aXRob3V0IGRhdGVzLiBEYXRlIGZpbHRlciBpcyBlZmZlY3RpdmVseSB1bnN1cHBvcnRlZFxuICAvLyBmb3IgdGhlc2UgZW5kcG9pbnRzOyB0aGV5IHJldHVybiBhbGwgZGF0YSBpbiBOSEkncyBsaWZldGltZSB3aW5kb3cuXG4gIC8vIEVuY291bnRlciBzb3VyY2U6IElIS0UzMzAzUzAxIChcdTkxQUJcdTc2NDJcdThDQkJcdTc1MjhcdTc1MzNcdTU4MzEpLiBUaGUgL3BhZ2VfbG9hZCB2YXJpYW50XG4gIC8vIGlzIHdpbmRvdy1saW1pdGVkIHRvIH4xIHllYXIgKHJldHVybmVkIDUxIHZpc2l0cyBlbmRpbmcgMTE0LzA1KTtcbiAgLy8gL3NlYXJjaCBhY2NlcHRzIHNfZGF0ZSAvIGVfZGF0ZSBhbmQgZ29lcyBiYWNrIGZ1cnRoZXIgKDE2MiB2aXNpdHNcbiAgLy8gdG8gMTEyLzA1IGZvciB0aGUgc2FtZSBwYXRpZW50KS4gU2luY2UgbGFicy9tZWRzIGV4dGVuZCB0byAzeSB2aWFcbiAgLy8gdGhlaXIgb3duIC9zZWFyY2ggZW5kcG9pbnRzLCBlbmNvdW50ZXIgTVVTVCBhbHNvIHVzZSAvc2VhcmNoIG9yXG4gIC8vIHRoZSAoaG9zcGl0YWwsIGRhdGUpIGxpbmtlciBoYXMgbm90aGluZyB0byBtYXRjaCBhZ2FpbnN0IGZvciBvbGRlclxuICAvLyBsYWIgZGF0ZXMuXG4gIHsgbmFtZTogXCJlbmNvdW50ZXJzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwM3MwMS9zZWFyY2g/c19kYXRlPSZlX2RhdGU9XCIsXG4gICAgcGFnZV90eXBlOiBcImVuY291bnRlcnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBJbnBhdGllbnQgKFx1NEY0Rlx1OTY2MikgXHUyMDE0IElIS0UzMzA5UzAxIGlzIHRoZSBwcmltYXJ5IGxpc3Qgd2l0aCBpbl9EQVRFL291dF9EQVRFXG4gIC8vIHNwYW4uIElIS0UzMzA4UzAxIGNhcnJpZXMgYSBzbWFsbCBzZXQgb2Ygb2xkZXIgXHU0RjRGXHU5NjYyIHJlY29yZHMgd2l0aCB0aGVcbiAgLy8gc2FtZSBmaWVsZHMgKGZ1bmNfREFURSBpbiBzb21lIHJvd3MgaW5zdGVhZCBvZiBpbl9EQVRFOyBhZGFwdGVyXG4gIC8vIGhhbmRsZXMgYm90aCkuIEJvdGggZmVlZCB0aGUgc2FtZSBlbmNvdW50ZXIgbWFwcGVyLlxuICB7IG5hbWU6IFwiaW5wYXRpZW50XCIsICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDlzMDEvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcImVuY291bnRlcnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdElucGF0aWVudEVuY291bnRlciB9LFxuICB7IG5hbWU6IFwiaW5wYXRpZW50X2xlZ2FjeVwiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDhzMDEvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcImVuY291bnRlcnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdElucGF0aWVudEVuY291bnRlciB9LFxuICB7IG5hbWU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDFzMDUvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcInByb2NlZHVyZXNcIiwgICAgICAgIGFkYXB0OiBhZGFwdFByb2NlZHVyZSB9LFxuICAvLyBtZWRpY2F0aW9uczogcGFnZV9sb2FkIG9ubHkgYWNjZXB0cyBlbXB0eSBkYXRlcyAoSFRUUCA0MDAgb3RoZXJ3aXNlKS5cbiAgLy8gVGhlIC9zZWFyY2ggZW5kcG9pbnQgaXMgd2hhdCB0aGUgU1BBIGhpdHMgd2hlbiB1c2VyIHBpY2tzIGEgY3VzdG9tXG4gIC8vIGRhdGUgcmFuZ2UgYW5kIGFjY2VwdHMgSVNPIFx1ODk3Rlx1NTE0MyBkYXRlcyB3aXRoIGRhc2hlcyAoMjAyMy0wMS0wMSkuXG4gIC8vIENvbmZpcm1lZCB2aWEgRGV2VG9vbHMgb2JzZXJ2YXRpb24gb2YgdGhlIFx1N0JFOVx1OTA3OCBwYW5lbCBzdWJtaXQuXG4gIHsgbmFtZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwNnMwMS9zZWFyY2g/c19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMSZzX3R5cGU9QVwiLFxuICAgIHBhZ2VfdHlwZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICBhZGFwdDogYWRhcHRNZWRpY2F0aW9uLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICB7IG5hbWU6IFwiYWxsZXJnaWVzXCIsICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMyMDJzMDEvU1BfSUhLRTMyMDJTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwiYWxsZXJnaWVzXCIsICAgICAgICAgYWRhcHQ6IGFkYXB0QWxsZXJneSB9LFxuICB7IG5hbWU6IFwiYWxsZXJnaWVzX2JcIiwgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMyMDJzMDEvU1BfSUhLRTMyMDJTMDRcIixcbiAgICBwYWdlX3R5cGU6IFwiYWxsZXJnaWVzXCIsICAgICAgICAgYWRhcHQ6IGFkYXB0QWxsZXJneSB9LFxuICAvLyBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjVcdTdENTBcdTY3OUMgKElIS0UzNDAyUzAxKTogb25lIHJvdyBwZXIgc2NyZWVuaW5nLCBjb250YWluc1xuICAvLyBCTUkgLyB2aXRhbHMgLyBsaXBpZCBwYW5lbCAvIExGVCAvIFJGVCAvIEhlcCBCL0MgLyB1cmljIGFjaWQgYWxsXG4gIC8vIHByZS1jb21wdXRlZCBieSBOSEkncyBzY3JlZW5pbmcgcHJvZ3JhbW1lLiBhZGFwdEFkdWx0UHJldmVudGl2ZVxuICAvLyByZXR1cm5zIGFuIGFycmF5IChvbmUgT2JzZXJ2YXRpb24gcGVyIG1lYXN1cmVtZW50KSBzbyB0aGVcbiAgLy8gYWRhcHRlci1jYWxsIGxvb3AgZmxhdHRlbnMgaXQuXG4gIHsgbmFtZTogXCJhZHVsdF9wcmV2ZW50aXZlXCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwMnMwMS9TUF9JSEtFMzQwMlMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRBZHVsdFByZXZlbnRpdmUgfSxcbiAgeyBuYW1lOiBcImNhbmNlcl9zY3JlZW5pbmdcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA0czAxL1NQX0lIS0UzNDA0UzAxXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdExhYkl0ZW0gfSxcbiAgLy8gZ2x1Y29zZSAoSUhLRTM0MDZTMDEpICsgbGlwaWQgKElIS0UzNDA3UzAxKSBhcmUgc3Vic2V0cyBvZlxuICAvLyBvdGhlcl9sYWJzIChJSEtFMzQwOVMwMSkgcGVyIE5ISSdzIGRhdGEgbW9kZWwgXHUyMDE0IGZldGNoaW5nIHRoZW1cbiAgLy8gc2VwYXJhdGVseSBqdXN0IGNyZWF0ZXMgZHVwIG9ic2VydmF0aW9ucywgc28gd2Ugc2tpcCB0aGVtLlxuICAvLyBJbWFnaW5nIGxpc3QgKElIS0UzNDA4UzAxKSBvbmx5IGNhcnJpZXMgb3JkZXItbGV2ZWwgZGF0YTsgZnVsbFxuICAvLyBuYXJyYXRpdmUgcmVwb3J0IGxpdmVzIGF0IElIS0UzNDA4UzAyLiBXZSBkbyBhIDItc3RlcCBmZXRjaCAoc2VlXG4gIC8vIF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIpIHRvIGdyYWIgdGhlIHJlcG9ydCwgdGhlbiBtYXAgdG8gYSByZWFsXG4gIC8vIERpYWdub3N0aWNSZXBvcnQuIFRoZSBsaXN0IGFkYXB0ZXIgaXMgYSBuby1vcCBzdHViIGxpa2UgbWVkaWNhdGlvbnMuXG4gIC8vIGltYWdpbmc6IHNlYXJjaCBlbmRwb2ludCBhY2NlcHRzIElTTyBkYXRlIHJhbmdlIGxpa2UgbWVkaWNhdGlvbnMuXG4gIHsgbmFtZTogXCJpbWFnaW5nXCIsICAgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwOHMwMS9zZWFyY2g/c190eXBlPSZzX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExXCIsXG4gICAgcGFnZV90eXBlOiBcImRpYWdub3N0aWNfcmVwb3J0c1wiLCBhZGFwdDogYWRhcHRJbWFnaW5nTGlzdFN0dWIsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIG90aGVyX2xhYnMgYWxyZWFkeSB1c2VzIC9zZWFyY2g7IHNhbWUgSVNPLWRhc2ggZGF0ZSBmb3JtYXQgd29ya3MuXG4gIHsgbmFtZTogXCJvdGhlcl9sYWJzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwOXMwMS9zZWFyY2g/c190eXBlPSZzX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdExhYkl0ZW0sIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElIS0UzMjA5UzAxIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpIFx1MjAxNCBOSEktdmV0dGVkIGNhdGFzdHJvcGhpYy1pbGxuZXNzIHJlZ2lzdHJ5LlxuICAvLyBFYWNoIHJvdyBcdTIxOTIgYSBGSElSIENvbmRpdGlvbiB3aXRoIGNhdGVnb3J5PXByb2JsZW0tbGlzdC1pdGVtLCB0aGVcbiAgLy8gY2xvc2VzdCBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZXF1aXZhbGVudCB0byBhIGN1cmF0ZWQgcHJvYmxlbSBsaXN0LiBFbmRwb2ludFxuICAvLyBkb2Vzbid0IGFjY2VwdCBkYXRlIHBhcmFtcyAoTkhJIHJldHVybnMgY3VycmVudGx5LXZhbGlkIGNlcnRzIG9ubHkpLlxuICB7IG5hbWU6IFwiY2F0YXN0cm9waGljX2lsbG5lc3NcIiwgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjA5czAxL1NQX0lIS0UzMjA5UzAxXCIsXG4gICAgcGFnZV90eXBlOiBcImNvbmRpdGlvbnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdENhdGFzdHJvcGhpY0lsbG5lc3MgfSxcbl07XG4iLCAiLy8gU2VydmljZSB3b3JrZXIgZm9yIE5ISS1GSElSIEJyaWRnZSBcdTIwMTQgb3ducyB0aGUgbG9uZy1ydW5uaW5nXG4vLyBcIlN5bmMgVGhpcyBQYXRpZW50XCIgd29ya2Zsb3cgc28gdGhlIHBvcHVwIGNhbiBjbG9zZSBtaWQtc3luYyB3aXRob3V0XG4vLyBhYm9ydGluZyBpdC5cbi8vXG4vLyBMaWZlY3ljbGU6XG4vLyAgIC0gcG9wdXAgcG9zdHMge3R5cGU6IFwic3RhcnROaGlBcGlTeW5jXCIsIHBheWxvYWR9ICBcdTIxOTIgTkhJIEpTT04tQVBJIHN5bmNcbi8vICAgLSBiYWNrZ3JvdW5kIHJ1bnMgdGhlIGZ1bGwgc3luYyBzZXF1ZW5jZSwgdXBkYXRpbmcgY2hyb21lLnN0b3JhZ2UubG9jYWxcbi8vICAgLSBwb3B1cCByZWFkcyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBvbiByZW9wZW4gdG8gc2hvdyBwcm9ncmVzc1xuLy9cbi8vIE1vZGVzOlxuLy8gICAtIFwibG9jYWxcIiAgIFx1MjE5MiBhZnRlciBOSEkgZmV0Y2gsIHJ1biBtYXBwZXJzIGluLWV4dGVuc2lvbiwgZG93bmxvYWQgYVxuLy8gICAgICAgICAgICAgICAgIEZISVIgQnVuZGxlIHRvIHRoZSB1c2VyJ3MgbWFjaGluZS4gTm8gYmFja2VuZCByZXF1aXJlZC5cbi8vICAgLSBcImJhY2tlbmRcIiBcdTIxOTIgUE9TVCBwZXItcGFnZV90eXBlIGl0ZW1zIHRvIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkXG4vLyAgICAgICAgICAgICAgICAgKGV4aXN0aW5nIGJlaGF2aW91cik7IGRhc2hib2FyZCArIFNNQVJUIGFwcCB1c2UgdGhlXG4vLyAgICAgICAgICAgICAgICAgYmFja2VuZCdzIEZISVIgc3RvcmUuXG5cbmltcG9ydCB7XG4gIEdST1VQX0hBTkRMRVJTLFxuICBMSVNUX0hBTkRMRVJTLFxuICBkZWR1cEFkbWlzc2lvbkRheUFtYixcbiAgZGVyaXZlUGF0aWVudElkLFxuICBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzLFxuICBtYXBQYXRpZW50LFxuICBtYXNrSWQsXG4gIG1hc2tOYW1lLFxuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyxcbn0gZnJvbSBcIkBuaGktZmhpci1icmlkZ2UvbWFwcGVyXCI7XG5pbXBvcnQge1xuICAvLyBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlIGlzIGludm9rZWQgZGlyZWN0bHkgZnJvbSB0aGVcbiAgLy8gSUhLRTMzMDNTMDIgZGV0YWlsIGZhbi1vdXQgKG92ZXJyaWRlcyB0aGUgcmVnaXN0cnkncyBjbGFzc0hpbnRcbiAgLy8gd2l0aCBcdTYwMjVcdThBM0EvXHU0RjRGXHU5NjYyIGRlcml2ZWQgZnJvbSB0aGUgZGV0YWlsIGJvZHkpLCBzbyBpdCBuZWVkcyB0byBiZVxuICAvLyBhIG5hbWVkIGltcG9ydCBcdTIwMTQgbm90IG9ubHkgcmVhY2hhYmxlIHZpYSBOSElfQVBJX0VORFBPSU5UU1tpXS5hZGFwdC5cbiAgLy8gRm9yZ2V0dGluZyB0aGlzIHJlLWltcG9ydCBhZnRlciBleHRyYWN0aW5nIHRoZSBlbmRwb2ludCByZWdpc3RyeVxuICAvLyBpbiB2MC42LjMgc2hpcHBlZCBhIFJlZmVyZW5jZUVycm9yIHRoYXQgb25seSBmaXJlZCBpbiBwcm9kdWN0aW9uXG4gIC8vIHN5bmNzIHdpdGggbm9uLWVtcHR5IGVuY291bnRlcnMuIFRlc3RzIGRvbid0IGV4ZXJjaXNlIHRoYXQgcGF0aFxuICAvLyBcdTIwMTQgc2VlIFRPRE9fRk9MTE9XVVAgZm9yIGEgU1ctZmxvdyBpbnRlZ3JhdGlvbiB0ZXN0IGlkZWEuXG4gIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsXG4gIGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwsXG4gIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwsXG4gIGlzb1RvUk9DLFxuICBwaWNrRW5nbGlzaCxcbiAgcm9jVG9JU08sXG59IGZyb20gXCIuL25oaS1hZGFwdGVycy5qc1wiO1xuaW1wb3J0IHsgRU5EUE9JTlRfTEFCRUxfWkgsIE5ISV9BUElfRU5EUE9JTlRTIH0gZnJvbSBcIi4vbmhpLWVuZHBvaW50cy5qc1wiO1xuXG5jb25zdCBTVE9SQUdFX0tFWSA9IFwic3luY1N0YXR1c1wiO1xuY29uc3Qgc2xlZXAgPSAobXMpID0+IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIG1zKSk7XG5cbi8vIENhbmNlbGxhdGlvbiBmbGFnIHNldCBieSBwb3B1cCdzIHN0b3AgYnV0dG9uLiBDaGVja2VkIGF0IHN0cmF0ZWdpYyBwb2ludHNcbi8vIGluIHJ1bk5oaUFwaVN5bmMgKGJldHdlZW4gcGhhc2VzLCBiZWZvcmUgZWFjaCBkZXRhaWwgcGFnZSkgc28gdGhlXG4vLyBpbi1wcm9ncmVzcyBzeW5jIGV4aXRzIHByb21wdGx5IHdoZW4gdGhlIHVzZXIgaGl0cyBTdG9wLiBDbGVhcmVkIGF0IHRoZVxuLy8gc3RhcnQgb2YgZWFjaCBuZXcgc3luYyBydW4uXG5sZXQgX2NhbmNlbGxlZCA9IGZhbHNlO1xuLy8gQ29udGV4dCBmb3IgdGhlIGluLWZsaWdodCBzeW5jIHNvIHRoZSBzdG9wU3luYyBoYW5kbGVyIGNhbiB3aXBlIHBhcnRpYWxcbi8vIGRhdGEgd2l0aG91dCB0aGUgcG9wdXAgbmVlZGluZyB0byBwYXNzIGl0IGJhY2suIFNldCBhdCB0aGUgdG9wIG9mXG4vLyBydW5OaGlBcGlTeW5jOyBjbGVhcmVkIG9uIGNvbXBsZXRpb24gKHN1Y2Nlc3MvZmFpbHVyZS9jYW5jZWwpLlxubGV0IF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbmNvbnN0IENBTkNFTF9FUlJPUiA9IFwiX19TWU5DX0NBTkNFTExFRF9fXCI7XG4vLyBUaHJvd24gd2hlbiBOSEkgZGV0ZWN0cyB0aGUgc2Vzc2lvbiBoYXMgZXhwaXJlZCAobG9naW4gcGFnZSByZW5kZXJlZCwgb3Jcbi8vIHRhYiByZWRpcmVjdGVkIHRvIGF1dGggbmFtZXNwYWNlKS4gQWJvcnRzIHN5bmMgaW1tZWRpYXRlbHkgc28gdGhlIHVzZXIgY2FuXG4vLyByZS1sb2dpbiBhbmQgcmV0cnkgaW5zdGVhZCBvZiB0aW1pbmcgb3V0IG9uIGV2ZXJ5IHJlbWFpbmluZyBwYWdlLlxuY29uc3QgU0VTU0lPTl9FWFBJUkVEX0VSUk9SID0gXCJfX1NFU1NJT05fRVhQSVJFRF9fXCI7XG4vLyBFcnJvcnMgdGhhdCBzaG91bGQgYWJvcnQgdGhlIGVudGlyZSBzeW5jIGluc3RlYWQgb2YgYmVpbmcgc3dhbGxvd2VkXG4vLyBwZXItcGhhc2UuXG5jb25zdCBBQk9SVF9FUlJPUlMgPSBuZXcgU2V0KFtDQU5DRUxfRVJST1IsIFNFU1NJT05fRVhQSVJFRF9FUlJPUl0pO1xuZnVuY3Rpb24gY2hlY2tDYW5jZWwoKSB7XG4gIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2V0U3RhdHVzKHBhcnRpYWwpIHtcbiAgLy8gQWZ0ZXIgY2FuY2VsbGF0aW9uLCB0aGUgcG9wdXAgaGFzIGFscmVhZHkgd3JpdHRlbiB0aGUgZGVmaW5pdGl2ZVxuICAvLyBcInN0b3BwZWRcIiBzdGF0dXMgXHUyMDE0IHNpbGVuY2UgYW55IGZ1cnRoZXIgcHJvZ3Jlc3Mgd3JpdGVzIGZyb20gdGhlXG4gIC8vIGluLWZsaWdodCBzeW5jIGNvZGUgc28gdGhlIFVJIGRvZXNuJ3QgYm91bmNlIHdoaWxlIGl0IHVud2luZHMuXG4gIGlmIChfY2FuY2VsbGVkKSByZXR1cm47XG4gIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICBjb25zdCBuZXh0ID0geyAuLi5wcmV2LCAuLi5wYXJ0aWFsLCB0czogRGF0ZS5ub3coKSB9O1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbU1RPUkFHRV9LRVldOiBuZXh0IH0pO1xuICAvLyBCcm9hZGNhc3QgdG8gYW55IG9wZW4gcG9wdXAuIElmIG5vIGxpc3RlbmVyIChwb3B1cCBjbG9zZWQpLFxuICAvLyBzZW5kTWVzc2FnZSByZWplY3RzIFx1MjAxNCBzd2FsbG93LlxuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwic3luY1Byb2dyZXNzXCIsIHN0YXR1czogbmV4dCB9KS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgQVBJLWRpcmVjdCBzeW5jIChwYXJhbGxlbCwgbm8gTExNKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBJbnN0ZWFkIG9mIG5hdmlnYXRpbmcgdGhlIHVzZXIncyB0YWIgdG8gZWFjaCBOSEkgcGFnZSwgd2FpdGluZyBmb3IgVnVlIHRvXG4vLyByZW5kZXIsIGNhcHR1cmluZyBIVE1MLCB0aGVuIHNlbmRpbmcgaXQgdGhyb3VnaCBMTE0gZXh0cmFjdGlvbiwgd2UgY2FsbFxuLy8gTkhJJ3MgdW5kZXJseWluZyBKU09OIEFQSSBlbmRwb2ludHMgZGlyZWN0bHkuIFRoZSBcdTUwNjVcdTRGRERcdTdGNzIgU1BBIGZyb250cyBhIHNldFxuLy8gb2YgUkVTVCBlbmRwb2ludHMgdW5kZXIgL2FwaS9paGtlMzAwMC88cGFnZT4vKiB0aGF0IHJldHVybiB3ZWxsLWZvcm1lZFxuLy8gSlNPTjsgY2FsbGluZyB0aGVtIGluIHBhcmFsbGVsIGN1dHMgYSA1LTEwIG1pbnV0ZSBzeW5jIHRvIH4xMCBzZWNvbmRzIGFuZFxuLy8gcmVtb3ZlcyB0aGUgTExNIGNvc3QgZW50aXJlbHkuXG5cbmNvbnN0IE5ISV9IT1NUID0gXCJteWhlYWx0aGJhbmsubmhpLmdvdi50d1wiO1xuXG5cbi8vIE5ISSBKU09OIGFkYXB0ZXJzICsgZGF0ZS9zdHJpbmcgaGVscGVycyBsaXZlIGluIC4vbmhpLWFkYXB0ZXJzLmpzXG4vLyBzbyB0aGV5IGNhbiBiZSB1bml0LXRlc3RlZCBpbiBpc29sYXRpb24gKGJhY2tncm91bmQuanMgY2FuJ3QgYmVcbi8vIGxvYWRlZCB1bmRlciB2aXRlc3QgXHUyMDE0IGNocm9tZS4qIEFQSXMsIFNXIGdsb2JhbHMpLiBTZWUgdGhhdCBtb2R1bGVcbi8vIGZvciB0aGUgZmllbGQtcHJpb3JpdHkgZGVjaXNpb25zIHBlciBhZGFwdGVyLlxuLy9cbi8vIFRoZSBOSEkgQVBJIGVuZHBvaW50IHJlZ2lzdHJ5ICsgXHU0RTJEXHU2NTg3IGxhYmVsIG1hcHBpbmcgbGl2ZSBpblxuLy8gLi9uaGktZW5kcG9pbnRzLmpzIFx1MjAxNCBleHRyYWN0ZWQgc28gYSB1bml0IHRlc3QgY2FuIGd1YXJhbnRlZSBldmVyeVxuLy8gZW5kcG9pbnQgbmFtZSBoYXMgYSBsYWJlbCAod2UgdXNlZCB0byBzaGlwIHJhdyBwYWdlX3R5cGUga2V5cyBsaWtlXG4vLyBcIm90aGVyX2xhYnNcIiBpbnRvIHRoZSBwb3B1cCdzIFx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMCB3aGVuIHNvbWVvbmUgZm9yZ290IHRvXG4vLyByZWdpc3RlciB0aGUgQ2hpbmVzZSB2ZXJzaW9uKS5cblxuLy8gQXBwbHkgYSB7c3RhcnQsIGVuZH0gSVNPIGRhdGUgcmFuZ2UgdG8gYW4gZW5kcG9pbnQgcGF0aDpcbi8vICAgLSBJZiBwYXRoIGFscmVhZHkgaGFzIHNfZGF0ZT0gcGxhY2Vob2xkZXJzLCBmaWxsIHRoZW0gaW4uXG4vLyAgIC0gT3RoZXJ3aXNlIGFwcGVuZCBzX2RhdGU9Li4uJmVfZGF0ZT0uLi4gdG8gdGhlIHF1ZXJ5IHN0cmluZy5cbi8vIEVuZHBvaW50cyB3aXRob3V0IGBzdXBwb3J0c0RhdGVSYW5nZWAgcGFzcyB0aHJvdWdoIHVuY2hhbmdlZC5cbmZ1bmN0aW9uIGFwcGx5RGF0ZVJhbmdlVG9QYXRoKHBhdGgsIGRhdGVSYW5nZSkge1xuICBpZiAoIWRhdGVSYW5nZSB8fCAoIWRhdGVSYW5nZS5zdGFydCAmJiAhZGF0ZVJhbmdlLmVuZCkpIHJldHVybiBwYXRoO1xuICAvLyBOSEkgZXhwZWN0cyBcdTg5N0ZcdTUxNDMgSVNPIGRhdGVzIHdpdGggZGFzaGVzOiAyMDIzLTAxLTAxIChub3QgXHU2QzExXHU1NzBCLCBub3RcbiAgLy8gc2xhc2hlcykuIENvbmZpcm1lZCBieSBvYnNlcnZpbmcgdGhlIFNQQSdzIHJlcXVlc3Qgd2hlbiB1c2VyIHBpY2tzXG4gIC8vIGEgY3VzdG9tIGRhdGUgcmFuZ2UuIFVSTC1lbmNvZGluZyB0aGUgZGFzaGVzIGlzIHVubmVjZXNzYXJ5LlxuICBjb25zdCBzID0gKGRhdGVSYW5nZS5zdGFydCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IGUgPSAoZGF0ZVJhbmdlLmVuZCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGxldCBwID0gcGF0aDtcbiAgaWYgKC9bPyZdc19kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdc19kYXRlPSlbXiZdKi8sIGAkMSR7c31gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IChwLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCIpICsgYHNfZGF0ZT0ke3N9YDtcbiAgfVxuICBpZiAoL1s/Jl1lX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1lX2RhdGU9KVteJl0qLywgYCQxJHtlfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gYCZlX2RhdGU9JHtlfWA7XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDZTMDIgZGV0YWlsIGZldGNoZXMgaW5zaWRlIHRoZSBOSEkgdGFiIHNvIGNvb2tpZXMgKyBKV1Rcbi8vIGF1dGggZmxvdyBuYXR1cmFsbHkuIFdlIHBhc3MgdGhlIHZpc2l0IGxpc3QgKGp1c3Qgcm93X0lEcyArIHRoZWlyIHBhcmVudFxuLy8gZmllbGRzIG5lZWRlZCBmb3IgYWRhcHRhdGlvbikgaW50byB0aGUgdGFiOyB0aGUgdGFiIHJldHVybnMgcGFyYWxsZWxcbi8vIGZldGNoZWQgYm9kaWVzOyB3ZSBhZGFwdCBiYWNrIGluIHRoZSBTVy5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgLy8gS2VlcCBwYXJlbnQgZmllbGRzIG5lZWRlZCBieSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsLlxuICAgICAgcGFyZW50OiB7XG4gICAgICAgIGZ1bmNfREFURTogdi5mdW5jX0RBVEUgfHwgdi5mdW5jX2RhdGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREU6IHYuaWNkOWNtX0NPREUgfHwgdi5pY2Q5Y21fY29kZSB8fCBcIlwiLFxuICAgICAgICBpY2Q5Y21fQ09ERV9DTkFNRTogdi5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2LmljZDljbV9uYW1lIHx8IFwiXCIsXG4gICAgICAgIGhvc3BfQUJCUjogdi5ob3NwX0FCQlIgfHwgdi5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAgIH0sXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTkhJIHVzZXMgZGlmZmVyZW50IGN0eXBlIHZhbHVlcyBmb3IgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIvXHU4NjU1XHU2NUI5XHU3QjhCLiBXZSBkb24ndFxuICAgICAgLy8gaGF2ZSB0aGUgcHVibGljIG1hcHBpbmcsIHNvIHRyeSBjdHlwZSAxLi40IGluIG9yZGVyIGFuZCBzdG9wIGFzXG4gICAgICAvLyBzb29uIGFzIG9uZSByZXR1cm5zIGRydWdzLiBjdHlwZT0yIGNvdmVyZWQgSUNcdTUzNjEgXHU5NTgwXHU4QTNBIGluIG91ciBzYW1wbGUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNF0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keT8uaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICAgICAgICBjb25zdCBoYXNEcnVncyA9IG1haW4uc29tZSgodikgPT5cbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodj8uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSAmJiB2LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC5sZW5ndGggPiAwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIGN0eXBlIHlpZWxkZWQgZHJ1Z3MgXHUyMDE0IHJldHVybiBsYXN0IHN1Y2Nlc3NmdWwgYm9keSBhbnl3YXkgc29cbiAgICAgICAgLy8gZGlhZ25vc3RpY3MgY2FuIHN0aWxsIHNlZSB0aGUgdmlzaXQgbWV0YWRhdGEuXG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaE9uZShyb3dJZCwgMik7XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBkcnVncyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGRydWdMaXN0ID0gQXJyYXkuaXNBcnJheSh2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpID8gdmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0IDogW107XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZHJ1Z0xpc3QpIHtcbiAgICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZCwgdmlzaXQpO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzNDA4UzAyIGRldGFpbCBmZXRjaGVzIGZvciBpbWFnaW5nIFx1MjAxNCBzYW1lIHBhdHRlcm4gYXMgdGhlXG4vLyBtZWRpY2F0aW9uIDItc3RlcC4gY3R5cGUgbWlycm9ycyB0aGUgdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICBjdHlwZTogdi5vcmlfVFlQRSB8fCB2Lm9yaV90eXBlIHx8IFwiQVwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzNDA4UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoY3R5cGUpfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCByZXBvcnRzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwodmlzaXQpO1xuICAgICAgaWYgKGFkYXB0ZWQpIHJlcG9ydHMucHVzaChhZGFwdGVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcG9ydHM7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDNTMDIgZGV0YWlsIHRvIGNsYXNzaWZ5IGVhY2ggSUhLRTMzMDNTMDEgdmlzaXQgYXNcbi8vIEFNQiAvIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRS4gVXNlcyA/cmlkPTxyb3dfSUQ+JnQ9TlxuLy8gd2hlcmUgTiBpcyB0aGUgdmlzaXQgdHlwZSBidWNrZXQ7IHdlIGRvbid0IGtub3cgdGhlIG1hcHBpbmcgYSBwcmlvcmksXG4vLyBzbyBmb3IgZWFjaCB2aXNpdCB3ZSB0cnkgdD0xLi41IHVudGlsIG9uZSByZXR1cm5zIG5vbi1lbXB0eSBtYWluX2RhdGEuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYsIGlkeCkgPT4gKHsgaWR4LCByb3dfSUQ6IHYucm9XX0lEIHx8IHYucm93X0lEIHx8IFwiXCIgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIHQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL2loa2UzMzAzczAyL3BhZ2VfbG9hZD9yaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZ0PSR7dH1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdG0gPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBGb3IgZWFjaCB2aXNpdCwgZmluZCB0aGUgYHRgIHRoYXQgcmV0dXJucyBub24tZW1wdHkgZGF0YS4gTkhJXG4gICAgICAvLyB1c2VzIHQ9MSBmb3Igb3V0cGF0aWVudCBcdTg5N0ZcdTkxQUIsIHQ9MiBtYXliZSBcdTYwMjVcdThBM0EvXHU0RTJEXHU5MUFCLCB0PTMgXHU0RjRGXHU5NjYyLFxuICAgICAgLy8gdD00IFx1NzI1OVx1OTFBQlx1MjAyNiBkb24ndCBoYXZlIGFuIGF1dGhvcml0YXRpdmUgbWFwcGluZyBzbyB3ZSBwcm9iZS5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgWzEsIDIsIDMsIDQsIDVdKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCB0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSAoci5ib2R5Py5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiB7IGJvZHk6IHIuYm9keSwgdCB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGJvZHk6IG51bGwgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIC8vIFBhaXIgZWFjaCBkZXRhaWwgYm9keSBiYWNrIHRvIGl0cyB2aXNpdCBwb3NpdGlvbi5cbiAgY29uc3QgYnlJZHggPSBuZXcgTWFwKCk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxcy5sZW5ndGg7IGkrKykge1xuICAgIGJ5SWR4LnNldChyZXFzW2ldLmlkeCwgcmVzdWx0c1tpXT8uYm9keSB8fCBudWxsKTtcbiAgfVxuICByZXR1cm4gYnlJZHg7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0Zyb21TMDJEZXRhaWwoYm9keSkge1xuICBpZiAoIWJvZHkpIHJldHVybiBudWxsO1xuICBjb25zdCBtYWluID0gKGJvZHkuaWhrZTMzMDNTMDJfbWFpbl9kYXRhKSB8fCBbXTtcbiAgaWYgKG1haW4ubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdG4gPSBTdHJpbmcobWFpblswXS5ob3NwX0RBVEFfVFlQRV9OQU1FIHx8IFwiXCIpO1xuICBpZiAodG4uaW5jbHVkZXMoXCJcdTYwMjVcIikpIHJldHVybiBcIkVNRVJcIjsgIC8vIFx1NjAyNVx1OEEzQVxuICBpZiAodG4uaW5jbHVkZXMoXCJcdTRGNEZcdTk2NjJcIikpIHJldHVybiBcIklNUFwiO1xuICAvLyBcdTg5N0ZcdTkxQUIgLyBcdTRFMkRcdTkxQUIgLyBcdTcyNTlcdTkxQUIgLyBcdTg1RTVcdTVDNDAgYWxsIGRlZmF1bHQgdG8gQU1CXG4gIHJldHVybiBcIkFNQlwiO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgcGF0aWVudE92ZXJyaWRlKSB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBwYWdlX3R5cGUsXG4gICAgICBob3N0OiBOSElfSE9TVCxcbiAgICAgIGl0ZW1zLFxuICAgICAgcGF0aWVudF9vdmVycmlkZTogcGF0aWVudE92ZXJyaWRlIHx8IG51bGwsXG4gICAgfSksXG4gIH0pO1xuICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcihgUE9TVCB1cGxvYWQtc3RydWN0dXJlZCAke3Iuc3RhdHVzfTogJHsoYXdhaXQgci50ZXh0KCkpLnNsaWNlKDAsIDIwMCl9YCk7XG4gIHJldHVybiBhd2FpdCByLmpzb24oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExvY2FsIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gUnVucyB0aGUgc2FtZSBtYXBwZXJzIHRoZSBiYWNrZW5kIHJ1bnMsIHRoZW4gdHJpZ2dlcnMgYSBkb3dubG9hZCBvZiB0aGVcbi8vIHJlc3VsdGluZyBGSElSIEJ1bmRsZS4gTm90aGluZyBsZWF2ZXMgdGhlIHVzZXIncyBtYWNoaW5lOyBubyBiYWNrZW5kXG4vLyByZXF1aXJlZC4gTWlycm9ycyBiYWNrZW5kL3VwbG9hZC1zdHJ1Y3R1cmVkIG9yZGVyOiBlbmNvdW50ZXJzIGZpcnN0IHNvXG4vLyB0aGF0IGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMgY2FuIGF0dGFjaCByZWZlcmVuY2VzIHRvIGRvd25zdHJlYW1cbi8vIG9ic2VydmF0aW9ucy9tZWRpY2F0aW9ucy9ldGMuXG5cbmNvbnN0IF9MT0NBTF9QQUdFX1RZUEVfT1JERVIgPSBbXG4gIFwiZW5jb3VudGVyc1wiLFxuICBcIm9ic2VydmF0aW9uc1wiLFxuICBcIm1lZGljYXRpb25zXCIsXG4gIFwiY29uZGl0aW9uc1wiLFxuICBcImFsbGVyZ2llc1wiLFxuICBcImRpYWdub3N0aWNfcmVwb3J0c1wiLFxuICBcInByb2NlZHVyZXNcIixcbl07XG5cbi8vIENoZWFwIHByZS1mbGlnaHQ6IGRvZXMgdGhpcyBOSEkgdGFiIGhhdmUgYW4gYXV0aGVudGljYXRlZCBzZXNzaW9uP1xuLy8gVXNlcyB0aGUgc2FtZSBzZXNzaW9uU3RvcmFnZS50b2tlbiArIGxpZ2h0d2VpZ2h0IEFQSSBjYWxsIHBhdHRlcm4gYXNcbi8vIF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaS4gRG9lc24ndCByZXR1cm4gYW55dGhpbmcgUElJIFx1MjAxNCBqdXN0IGFcbi8vIGJvb2xlYW4gZm9yIHRoZSBwb3B1cCB0byBkZWNpZGUgd2hldGhlciB0byBzdXJmYWNlIGEgXCJsb2cgaW4gZmlyc3RcIlxuLy8gYmFubmVyLiBSZXR1cm5zIG51bGwgd2hlbiB3ZSBjYW4ndCB0ZWxsIChzY3JpcHQtaW5qZWN0aW9uIGJsb2NrZWQsXG4vLyB0aW1lb3V0LCBldGMuKSBzbyB0aGUgcG9wdXAgY2FuIGZhbGwgYmFjayB0byBcImVuYWJsZWRcIiByYXRoZXIgdGhhblxuLy8gc2NhcmluZyB0aGUgdXNlciB3aXRoIGEgZmFsc2UgbmVnYXRpdmUuXG5hc3luYyBmdW5jdGlvbiBfY2hlY2tOaGlMb2dpblN0YXRlKHRhYklkKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTYW1lIGVuZHBvaW50IGFzIHRoZSBjaWQgYXV0by1mZXRjaCBcdTIwMTQga25vd24gdG8gbmVlZCBhblxuICAgICAgICAgIC8vIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbiBhbmQgdG8gYmUgY2hlYXAuXG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKFwiL2FwaS9paGtlMzAwMC9paGtlMzQxMHMwMS9wYWdlX2xvYWRcIiwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIiwgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3R9YCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIDQwMS80MDMgXHUyMTkyIHNlc3Npb24gdG9rZW4gcmVqZWN0ZWQuIDIwMCBcdTIxOTIgbG9nZ2VkIGluLlxuICAgICAgICAgIHJldHVybiByLm9rO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHR5cGVvZiByZXN1bHQgPT09IFwiYm9vbGVhblwiID8gcmVzdWx0IDogbnVsbDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBlbmRwb2ludCBJSEtFMzQxMFMwMSAoXHU2MjExXHU2M0E1XHU3QTJFXHU3RDAwXHU5MzA0IC8gQ09WSUQgXHU3QkU5XHU2QUEyXHU3RDAwXHU5MzA0KSBoYXBwZW5zXG4vLyB0byBjYXJyeSB0aGUgbG9nZ2VkLWluIHVzZXIncyByZWFsIGNpdGl6ZW4gSUQgaW4gdGhlIHJlc3BvbnNlIChgY2lkYFxuLy8gZmllbGQsIGUuZy4gXCJQMTIzNDUwODY2XCIpLiBVc2UgaXQgdG8gc2VlZCAvIHJlZnJlc2ggdGhlIHBhdGllbnRfXG4vLyBvdmVycmlkZSdzIGlkX25vIHNvIGl0IGFsd2F5cyB0cmFja3MgXCJ3aG9zZSBzZXNzaW9uIGlzIGN1cnJlbnRseVxuLy8gYWN0aXZlIGluIHRoZSBOSEkgdGFiXCIuXG4vL1xuLy8gSGlzdG9yeSBub3RlOiB0aGlzIGZ1bmN0aW9uIHVzZWQgdG8gZWFybHktcmV0dXJuIHdoZW5ldmVyIGlkX25vIHdhc1xuLy8gYWxyZWFkeSBhIHJlYWwtbG9va2luZyBjaWQgKFwiZG9uJ3QgdG91Y2ggYSBtYW51YWxseS1lbnRlcmVkIElEXCIpLlxuLy8gVGhhdCBzaG9ydC1jaXJjdWl0IHByZS1kYXRlZCB2MC42LjAgd2hpY2ggcmVtb3ZlZCBpZF9ubyBmcm9tIHRoZSBVSVxuLy8gXHUyMDE0IHRoZXJlJ3Mgbm8gXCJtYW51YWxcIiBwYXRoIGFueW1vcmUsIHRoZSBmaWVsZCBpcyBwdXJlbHkgaW50ZXJuYWwuXG4vLyBUaGUgc2hvcnQtY2lyY3VpdCBhbHNvIHByb2R1Y2VkIHRoZSBidWcgcGF0dGVybjogdXNlciBzdGFydHMgc3luY1xuLy8gd2l0aCBQYXRpZW50IEIgbG9nZ2VkIGluIChjaWRfQiB3cml0dGVuIHRvIG92ZXJyaWRlKSwgcmVhbGlzZXMgd3Jvbmdcbi8vIHRhYiwgc3dpdGNoZXMgTkhJIHRhYiB0byBQYXRpZW50IEEsIHJlLXN5bmNzIFx1MjAxNCBpZF9ubyBzdGF5cyBjaWRfQlxuLy8gYmVjYXVzZSBcImFscmVhZHkgYSByZWFsIGNpZFwiLiBOb3cgd2UgYWx3YXlzIHByb2JlIGFuZCBmb2xsb3cgdGhlXG4vLyBzZXNzaW9uJ3MgdHJ1dGguIE1hbnVhbCBvdmVycmlkZSBpcyBnb25lLCBOSEkgc2Vzc2lvbiBpcyBhdXRob3JpdGF0aXZlLlxuYXN5bmMgZnVuY3Rpb24gX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpKHRhYklkLCBwYXRpZW50T3ZlcnJpZGUpIHtcbiAgY29uc3QgY3VycmVudCA9IHBhdGllbnRPdmVycmlkZS5pZF9ubyB8fCBcIlwiO1xuXG4gIGxldCBjaWQgPSBudWxsO1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0KSByZXR1cm4gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goXCIvYXBpL2loa2UzMDAwL2loa2UzNDEwczAxL3BhZ2VfbG9hZFwiLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLCBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dH1gIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgcmV0dXJuIGJvZHk/LmNpZCB8fCBudWxsO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBWYWxpZGF0ZSBpdCBsb29rcyBsaWtlIGEgVGFpd2FuIG5hdGlvbmFsIElEICgxIGxldHRlciArIDkgZGlnaXRzKVxuICAgIC8vIGJlZm9yZSB0cnVzdGluZyBpdC4gQXZvaWRzIGFjY2lkZW50YWxseSBwcm9tb3RpbmcgZ2FyYmFnZSB0byB0aGVcbiAgICAvLyBQYXRpZW50IHJlc291cmNlJ3MgdW5pcXVlIGtleS5cbiAgICBpZiAocmVzdWx0ICYmIC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChyZXN1bHQpKSBjaWQgPSByZXN1bHQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIElIS0UzNDEwIGNpZCBmZXRjaCBmYWlsZWQ6XCIsIGU/Lm1lc3NhZ2UgPz8gZSk7XG4gIH1cblxuICBpZiAoY2lkICYmIGNpZCAhPT0gY3VycmVudCkge1xuICAgIHBhdGllbnRPdmVycmlkZSA9IHsgLi4ucGF0aWVudE92ZXJyaWRlLCBpZF9ubzogY2lkIH07XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcGF0aWVudE92ZXJyaWRlIH0pLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIC8vIFBhdGllbnQtc3dpdGNoIGNsZWFudXAuIElmIHRoZSBjaWQganVzdCBjaGFuZ2VkIGZyb20gb25lIHJlYWxcbiAgICAvLyBjaWQgdG8gYW5vdGhlciAobm90IGp1c3QgXCJhdXRvLVhYWFggXHUyMTkyIHJlYWwgY2lkXCIgZmlyc3Qtc3luYyBzd2FwKSxcbiAgICAvLyB0aGUgcHJldmlvdXNseS1zdGFzaGVkIEZISVIgYnVuZGxlIGJlbG9uZ3MgdG8gdGhlIE9USEVSIHBhdGllbnQuXG4gICAgLy8gRHJvcCBpdCBzbyB0aGUgcG9wdXAncyBkb3dubG9hZCBidXR0b24gZG9lc24ndCBrZWVwIG9mZmVyaW5nIHRoZVxuICAgIC8vIHdyb25nIHBhdGllbnQncyBmaWxlLiBTYW1lIHNldCBvZiB3aXBlcyBwb3B1cC5qcyBkb2VzIGluXG4gICAgLy8gc2F2ZVBhdGllbnRPdmVycmlkZSB3aGVuIGl0IGRldGVjdHMgcGF0aWVudENoYW5nZWQuXG4gICAgY29uc3Qgc3dpdGNoZWRSZWFsUGF0aWVudHMgPVxuICAgICAgY3VycmVudCAmJiAhY3VycmVudC5zdGFydHNXaXRoKFwiYXV0by1cIikgJiYgY3VycmVudCAhPT0gY2lkO1xuICAgIGlmIChzd2l0Y2hlZFJlYWxQYXRpZW50cykge1xuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFBFTkRJTkdfQlVORExFX0tFWSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGF0aWVudE92ZXJyaWRlO1xufVxuXG4vLyBSZWFkIHRoZSBtYXNrLW5hbWUgcHJlZmVyZW5jZSBmcmVzaCBmcm9tIHN0b3JhZ2UuIFdlIGRvbid0IGNhY2hlIFx1MjAxNFxuLy8gcnVuTmhpQXBpU3luYyBpcyBpbnZva2VkIGF0IG1vc3QgYSBmZXcgdGltZXMgcGVyIHNlc3Npb24gYW5kIHRoZSBTV1xuLy8gY2FuIGJlIHRvcm4gZG93biArIHJlc3RhcnRlZCBhbnkgdGltZSwgc28gYSBzaW5nbGUgZ2V0KCkgcGVyIHN5bmMgaXNcbi8vIGNoZWFwZXIgdGhhbiBzeW5jaW5nIHN0YXRlIGFjcm9zcyBTVyBsaWZlY3ljbGVzLlxuYXN5bmMgZnVuY3Rpb24gX2lzTWFza0VuYWJsZWQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBtYXNrTmFtZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcIm1hc2tOYW1lRW5hYmxlZFwiKTtcbiAgICByZXR1cm4gbWFza05hbWVFbmFibGVkID09PSB0cnVlO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2J1aWxkT3ZlcnJpZGVQYXRpZW50KG92LCBtYXNrRW5hYmxlZCkge1xuICBjb25zdCBkaXNwbGF5TmFtZSA9IG1hc2tFbmFibGVkID8gbWFza05hbWUob3YubmFtZSB8fCBcIlwiKSA6IG92Lm5hbWUgfHwgXCJcIjtcbiAgY29uc3QgcmF3ID0ge1xuICAgIGlkOiBvdi5pZF9ubyxcbiAgICBpZGVudGlmaWVyOiBvdi5pZF9ubyxcbiAgICBuYW1lOiBkaXNwbGF5TmFtZSB8fCBvdi5pZF9ubyxcbiAgfTtcbiAgaWYgKG92LmJpcnRoX2RhdGUpIHJhdy5iaXJ0aERhdGUgPSBvdi5iaXJ0aF9kYXRlO1xuICBpZiAob3YuZ2VuZGVyKSByYXcuZ2VuZGVyID0gb3YuZ2VuZGVyO1xuICByZXR1cm4gbWFwUGF0aWVudChyYXcpO1xufVxuXG4vLyBXYWxrIGEgSlNPTi1saWtlIHZhbHVlIGFuZCByZXBsYWNlIGV2ZXJ5IHN0cmluZyB0b2tlbiBlcXVhbCB0byBvclxuLy8gY29udGFpbmluZyBgbmVlZGxlYCB3aXRoIGByZXBsYWNlbWVudGAuIFVzZWQgdG8gc2NydWIgdGhlIHJlYWxcbi8vIHBhdGllbnQgbmFtZSBvdXQgb2YgTkhJIG5hcnJhdGl2ZSBmaWVsZHMgKGNsaW5pY2FsX25vdGUsIGNvbmNsdXNpb24sXG4vLyBub3RlLCBldGMuKSBiZWZvcmUgdGhlIGl0ZW1zIHJlYWNoIHRoZSBtYXBwZXIuIE9ubHkgdHJpZ2dlcmVkIHdoZW5cbi8vIHRoZSB1c2VyIGhhcyBvcHRlZCBpbnRvIG1hc2tpbmcgQU5EIHN1cHBsaWVkIGEgbmFtZSBcdTIwMTQgYW5kIHRoZVxuLy8gc3Vic3RpdHV0aW9uIGlzIGV4YWN0LXRva2VuLXJlcGxhY2UsIG5vdCBmdXp6eSwgc28gaXQgY2FuJ3Qgc3VycHJpc2Vcbi8vIHRoZSB1c2VyIGJ5IGNsb2JiZXJpbmcgdW5yZWxhdGVkIGNvbnRlbnQuXG5mdW5jdGlvbiBfcmVwbGFjZU5hbWVEZWVwKHZhbHVlLCBuZWVkbGUsIHJlcGxhY2VtZW50KSB7XG4gIGlmICghbmVlZGxlIHx8IG5lZWRsZSA9PT0gcmVwbGFjZW1lbnQpIHJldHVybiB2YWx1ZTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHZhbHVlLnNwbGl0KG5lZWRsZSkuam9pbihyZXBsYWNlbWVudCk7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkgcmV0dXJuIHZhbHVlLm1hcCgodikgPT4gX3JlcGxhY2VOYW1lRGVlcCh2LCBuZWVkbGUsIHJlcGxhY2VtZW50KSk7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gdmFsdWUpIG91dFtrXSA9IF9yZXBsYWNlTmFtZURlZXAodmFsdWVba10sIG5lZWRsZSwgcmVwbGFjZW1lbnQpO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBfYXNzZW1ibGVMb2NhbEJ1bmRsZShieVR5cGUsIHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpIHtcbiAgY29uc3QgcGF0aWVudCA9IF9idWlsZE92ZXJyaWRlUGF0aWVudChwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKTtcbiAgY29uc3QgcGlkID0gcGF0aWVudC5pZDtcbiAgY29uc3QgYWxsID0gW3BhdGllbnRdO1xuXG4gIGZvciAoY29uc3QgcHQgb2YgX0xPQ0FMX1BBR0VfVFlQRV9PUkRFUikge1xuICAgIGNvbnN0IGl0ZW1zID0gYnlUeXBlW3B0XTtcbiAgICBpZiAoIWl0ZW1zIHx8IGl0ZW1zLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgbGV0IG1hcHBlZDtcbiAgICBpZiAoR1JPVVBfSEFORExFUlNbcHRdKSB7XG4gICAgICBtYXBwZWQgPSBHUk9VUF9IQU5ETEVSU1twdF0oaXRlbXMsIHBpZCk7XG4gICAgfSBlbHNlIGlmIChMSVNUX0hBTkRMRVJTW3B0XSkge1xuICAgICAgY29uc3QgW2ZuXSA9IExJU1RfSEFORExFUlNbcHRdO1xuICAgICAgbWFwcGVkID0gaXRlbXNcbiAgICAgICAgLmZpbHRlcigoaXQpID0+IGl0ICYmIHR5cGVvZiBpdCA9PT0gXCJvYmplY3RcIilcbiAgICAgICAgLm1hcCgoaXQpID0+IGZuKGl0LCBwaWQpKVxuICAgICAgICAuZmlsdGVyKChyKSA9PiByICE9PSBudWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChwdCA9PT0gXCJlbmNvdW50ZXJzXCIpIG1hcHBlZCA9IGRlZHVwQWRtaXNzaW9uRGF5QW1iKG1hcHBlZCk7XG4gICAgYWxsLnB1c2goLi4ubWFwcGVkKTtcbiAgfVxuXG4gIC8vIERlZHVwIGJ5IChyZXNvdXJjZVR5cGUsIGlkKSBiZWZvcmUgYXNzZW1ibGluZyB0aGUgQnVuZGxlLiBNdWx0aXBsZVxuICAvLyBOSEkgZW5kcG9pbnRzIGNhbiBmZWVkIHRoZSBzYW1lIHBhZ2VfdHlwZSAoZS5nLiBlbmNvdW50ZXJzIC9cbiAgLy8gaW5wYXRpZW50IC8gaW5wYXRpZW50X2xlZ2FjeSBhbGwgXHUyMTkyIHBhZ2VfdHlwZT1cImVuY291bnRlcnNcIiksIGFuZCB0aGVcbiAgLy8gbWFwcGVyIHByb2R1Y2VzIGRldGVybWluaXN0aWMgc3RhYmxlIElEcyBcdTIwMTQgc28gdHdvIHJhdyBpdGVtcyB0aGF0XG4gIC8vIGRlc2NyaWJlIHRoZSBzYW1lIG1lZGljYWwgZXZlbnQgY29sbGFwc2UgdG8gb25lIHJlc291cmNlLiBCYWNrZW5kXG4gIC8vIHVwc2VydCBoYW5kbGVzIHRoaXMgYXV0b21hdGljYWxseSAoc2FtZSBzdGFibGUgSUQgPSBzYW1lIERCIHJvdyk7XG4gIC8vIGxvY2FsIG1vZGUgaGFzIHRvIGRvIGl0IGV4cGxpY2l0bHkuIFdpdGhvdXQgdGhpcyBkZWR1cCwgdGhlIGxvY2FsXG4gIC8vIEJ1bmRsZSBlbmRzIHVwIGluZmxhdGVkIHJlbGF0aXZlIHRvIHdoYXQgYmFja2VuZCBzdG9yZXMgZnJvbSB0aGVcbiAgLy8gaWRlbnRpY2FsIE5ISSBpbnB1dC5cbiAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgY29uc3QgdW5pcXVlID0gW107XG4gIGZvciAoY29uc3QgciBvZiBhbGwpIHtcbiAgICBjb25zdCBrZXkgPSBgJHtyLnJlc291cmNlVHlwZX0vJHtyLmlkfWA7XG4gICAgaWYgKHNlZW4uaGFzKGtleSkpIGNvbnRpbnVlO1xuICAgIHNlZW4uYWRkKGtleSk7XG4gICAgdW5pcXVlLnB1c2gocik7XG4gIH1cblxuICAvLyBMaW5rZXIgKyBzZXgtc3RyYXRpZmllZCByZXNvbHZlciBydW4gb25jZSBvdmVyIHRoZSBmdWxsIGFzc2VtYmxlZFxuICAvLyBsaXN0IChzYW1lIHBpcGVsaW5lIGJhY2tlbmQncyAvc3luYy91cGxvYWQtc3RydWN0dXJlZCBydW5zLCBqdXN0XG4gIC8vIGFnYWluc3QgYW4gaW4tbWVtb3J5IGNhbmRpZGF0ZSBhcnJheSBpbnN0ZWFkIG9mIGEgU1FMaXRlIHF1ZXJ5KS5cbiAgbGlua0VuY291bnRlcnNJblJlc291cmNlcyh1bmlxdWUsIHVuaXF1ZSk7XG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzKHBhdGllbnQsIHVuaXF1ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQnVuZGxlXCIsXG4gICAgdHlwZTogXCJjb2xsZWN0aW9uXCIsXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvXFwuXFxkK1okLywgXCJaXCIpLFxuICAgIGVudHJ5OiB1bmlxdWUubWFwKChyKSA9PiAoe1xuICAgICAgZnVsbFVybDogYCR7ci5yZXNvdXJjZVR5cGV9LyR7ci5pZH1gLFxuICAgICAgcmVzb3VyY2U6IHIsXG4gICAgfSkpLFxuICB9O1xufVxuXG4vLyBMb2NhbCBtb2RlIHN0YXNoZXMgdGhlIGFzc2VtYmxlZCBCdW5kbGUgaW4gY2hyb21lLnN0b3JhZ2UubG9jYWwgdW5kZXJcbi8vIGEgc2luZ2xlIFwicGVuZGluZ0ZoaXJCdW5kbGVcIiBzbG90LiBUaGUgcG9wdXAgc2hvd3MgYSBkb3dubG9hZCBidXR0b25cbi8vIHdoZW4gdGhpcyBzbG90IGlzIG5vbi1lbXB0eTsgdGhlIGFjdHVhbCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGNhbGxcbi8vIGhhcHBlbnMgZnJvbSB0aGUgcG9wdXAgKGluIHJlc3BvbnNlIHRvIGEgdXNlciBjbGljaykgc28gdGhlIGZpbGVcbi8vIGRvZXNuJ3QgYXBwZWFyIGluIHRoZSBEb3dubG9hZHMgYmFyIHVuaW52aXRlZC5cbi8vXG4vLyBTaW5nbGUgc2xvdCBtZWFucyBhIG5ldyBzeW5jIG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzIHBlbmRpbmcgYnVuZGxlLlxuLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwgZGVmYXVsdCBxdW90YSBpcyAxMCBNQjsgYSB0eXBpY2FsIE5ISSBzeW5jIGlzXG4vLyB3ZWxsIHVuZGVyIDIgTUIuXG5jb25zdCBQRU5ESU5HX0JVTkRMRV9LRVkgPSBcInBlbmRpbmdGaGlyQnVuZGxlXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50SWQsIGRhdGVSYW5nZSkge1xuICAvLyBGaWxlbmFtZTogbmhpLXtwaWR9LXtzdGFydFlZWVlNTUREfS17ZW5kWVlZWU1NRER9Lmpzb25cbiAgLy8gV2hlbiBubyBleHBsaWNpdCBkYXRlUmFuZ2UgKE5ISSBkZWZhdWx0ID0gXHU4RkQxIDEgXHU1RTc0KSwgc3ludGhlc2l6ZSB0b2RheS0xeSBcdTIxOTIgdG9kYXkuXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgXCIwXCIpO1xuICBjb25zdCBmbXQgPSAoZCkgPT4gYCR7ZC5nZXRGdWxsWWVhcigpfSR7cGFkKGQuZ2V0TW9udGgoKSArIDEpfSR7cGFkKGQuZ2V0RGF0ZSgpKX1gO1xuICAvLyBIYWxmLW1hc2sgdGhlIElEIGluIHRoZSBmaWxlbmFtZSBzbyB0aGUgdXNlcidzIERvd25sb2FkcyBmb2xkZXJcbiAgLy8gZG9lc24ndCBsZWFrIHRoZSBmdWxsIFx1OEVBQlx1NTIwNlx1OEI0OSAod291bGQgYmUgdmlzaWJsZSB0byBhbnlvbmUgc2VlaW5nXG4gIC8vIGEgZmlsZSBsaXN0aW5nIG9yIGRvd25sb2FkLWJhciBwcmV2aWV3KS4gYFhgIGJlY2F1c2UgYCpgIGlzXG4gIC8vIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gQnVuZGxlIENPTlRFTlRTIHN0aWxsIGNhcnJ5IHRoZSByZWFsXG4gIC8vIElEIHVuZGVyIFBhdGllbnQuaWQgXHUyMDE0IGZpbGUgb3duZXIga25vd3Mgd2hvc2UgZGF0YSBpdCBpcy5cbiAgY29uc3QgbWFza2VkUGlkID0gbWFza0lkKHBhdGllbnRJZCB8fCBcInVua25vd25cIiwgXCJYXCIpO1xuICBjb25zdCBzYWZlUGlkID0gbWFza2VkUGlkLnJlcGxhY2UoL1teQS1aYS16MC05Xy1dL2csIFwiX1wiKTtcbiAgY29uc3QgY29tcGFjdCA9IChkKSA9PiAoZCB8fCBcIlwiKS5zbGljZSgwLCAxMCkucmVwbGFjZSgvLS9nLCBcIlwiKTtcbiAgbGV0IHMsIGU7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIHMgPSBjb21wYWN0KGRhdGVSYW5nZS5zdGFydCkgfHwgZm10KG5vdyk7XG4gICAgZSA9IGNvbXBhY3QoZGF0ZVJhbmdlLmVuZCkgfHwgZm10KG5vdyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb25lWWVhckFnbyA9IG5ldyBEYXRlKG5vdyk7XG4gICAgb25lWWVhckFnby5zZXRGdWxsWWVhcihvbmVZZWFyQWdvLmdldEZ1bGxZZWFyKCkgLSAxKTtcbiAgICBzID0gZm10KG9uZVllYXJBZ28pO1xuICAgIGUgPSBmbXQobm93KTtcbiAgfVxuICBjb25zdCBmaWxlbmFtZSA9IGBuaGktJHtzYWZlUGlkfS0ke3N9LSR7ZX0uanNvbmA7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShidW5kbGUsIG51bGwsIDIpO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIFtQRU5ESU5HX0JVTkRMRV9LRVldOiB7XG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGpzb24sXG4gICAgICBieXRlczoganNvbi5sZW5ndGgsXG4gICAgICBnZW5lcmF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIHBhdGllbnRJZDogcGF0aWVudElkIHx8IG51bGwsXG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiB7IGZpbGVuYW1lLCBieXRlczoganNvbi5sZW5ndGggfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuTmhpQXBpU3luYyh7IHRhYklkLCBtb2RlLCBiYWNrZW5kLCBzeW5jQXBpS2V5LCBuaGlCYXNlLCBwYXRpZW50T3ZlcnJpZGUsIGRhdGVSYW5nZSwgZGF0ZVJhbmdlTGFiZWwgfSkge1xuICBfY2FuY2VsbGVkID0gZmFsc2U7XG4gIGNvbnN0IEJBU0UgPSBuaGlCYXNlIHx8IGBodHRwczovLyR7TkhJX0hPU1R9YDtcblxuICBpZiAoIXBhdGllbnRPdmVycmlkZSkge1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU4QUNCXHU1MTQ4XHU1NzI4IHBvcHVwIFx1NTg2Qlx1NUJFQlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1NUY4Q1x1NTE4RFx1OEE2NlwiLFxuICAgICAgICBwaGFzZTogXCJlcnJvclwiLCB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCF0YWJJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkFQSSBzeW5jIHJlcXVpcmVzIE5ISSB0YWIgaWQgKGNvb2tpZXMgYXJlIGZpcnN0LXBhcnR5KVwiKTtcbiAgfVxuXG4gIC8vIEZpcnN0IGNoYW5jZSB0byB1cGdyYWRlIHRoZSBwYXRpZW50IElEOiBpZiB0aGUgcG9wdXAgZ2F2ZSB1cyBhblxuICAvLyBcImF1dG8tWFhYWFhYWFhcIiBwbGFjZWhvbGRlciAodXNlciBkaWRuJ3QgbWFudWFsbHkgdHlwZSBvbmUpLFxuICAvLyBmZXRjaCB0aGUgcmVhbCBvbmUgZnJvbSBOSEkncyBJSEtFMzQxMFMwMSBlbmRwb2ludCAocmVzcG9uc2UuY2lkXG4gIC8vIGlzIHRoZSBjaXRpemVuIElEKS4gUGVyc2lzdCBiYWNrIHRvIHN0b3JhZ2Ugc28gc3Vic2VxdWVudCBzeW5jc1xuICAvLyBhcmUgc3RhYmxlLiBNYW51YWxseS10eXBlZCBJRHMgYXJlIHJlc3BlY3RlZCBhcy1pcy5cbiAgcGF0aWVudE92ZXJyaWRlID0gYXdhaXQgX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpKHRhYklkLCBwYXRpZW50T3ZlcnJpZGUpO1xuXG4gIC8vIFN0YXNoIGNvbnRleHQgc28gdGhlIHN0b3BTeW5jIG1lc3NhZ2UgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4gIC8vIGRhdGEgKERFTEVURSAvc3luYy9wYXRpZW50L3tpZF9ub30pIHdpdGhvdXQgdXMgaGF2aW5nIHRvIHNlbmQgaXRcbiAgLy8gYmFjayB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlLlxuICBfYWN0aXZlU3luY0N0eCA9IHsgYmFja2VuZCwgc3luY0FwaUtleSwgcGF0aWVudElkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfTtcblxuICAvLyBXYWxsLWNsb2NrIHN0YXJ0IHRpbWUgXHUyMDE0IHVzZWQgdG8gY29tcHV0ZSBlbGFwc2VkIHNlY29uZHMgZm9yIHRoZVxuICAvLyBmaW5hbCBzdGF0dXMgbGluZSAoXCJcdTdFM0RcdTgwMTdcdTY2NDIgMTIuMyBcdTc5RDJcIikuIFN0YXNoIG9uIGEgbG9jYWwgc28gd2UgY2FuXG4gIC8vIHJlYWNoIGl0IGZyb20gdGhlIGNvbXBsZXRpb24gbWVzc2FnZSBhdCB0aGUgdmVyeSBlbmQuXG4gIGNvbnN0IF90MCA9IERhdGUubm93KCk7XG4gIC8vIFBlci1waGFzZSB0aW1pbmdzLCBzdXJmYWNlZCBpbnRvIHRoZSBwb3B1cCdzIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHNlZSBleGFjdGx5IHdoZXJlIHRpbWUgaXMgZ29pbmcuIEVhY2ggZW50cnk6IHsgbmFtZSwgbXMgfS5cbiAgY29uc3QgX3BoYXNlcyA9IFtdO1xuICBsZXQgX3BoYXNlU3RhcnQgPSBfdDA7XG4gIGNvbnN0IF9tYXJrUGhhc2UgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgX3BoYXNlcy5wdXNoKHsgbmFtZSwgbXM6IG5vdyAtIF9waGFzZVN0YXJ0IH0pO1xuICAgIF9waGFzZVN0YXJ0ID0gbm93O1xuICB9O1xuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IHRydWUsIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIiwgcGhhc2U6IFwiaW5pdFwiLFxuICAgIHN0YXJ0ZWQ6IF90MCwgdG90YWxSZXNvdXJjZXM6IDAsIGhvc3Q6IE5ISV9IT1NULCBlcnJvcnM6IFtdLFxuICB9KTtcblxuICAvLyBTdGVwIDE6IGZldGNoIGFsbCBlbmRwb2ludHMgaW4gUEFSQUxMRUwgaW5zaWRlIHRoZSBOSEkgdGFiLiBSdW5uaW5nIGluXG4gIC8vIHRhYiBjb250ZXh0IG1lYW5zIHNhbWUtb3JpZ2luIGNvb2tpZXMgYXJlIHNlbnQgYXV0b21hdGljYWxseSBcdTIwMTQgZmV0Y2hcbiAgLy8gZnJvbSB0aGUgU1cgd291bGQgYmUgY3Jvc3Mtb3JpZ2luIGFuZCBTYW1lU2l0ZSBibG9ja3MgdGhlIHNlc3Npb25cbiAgLy8gY29va2llLCBoZW5jZSB3ZSBnb3QgXCJzZXNzaW9uIGV4cGlyZWRcIiBldmVuIHdoZW4gbG9nZ2VkIGluLlxuICAvLyBQYXNzIG9ubHkgc2VyaWFsaXNhYmxlIGRhdGEgKHBhdGhzLCBtZXRob2QsIG5hbWUpOyBhZGFwdGVycyBzdGF5IGluIFNXLlxuICAvLyBJbmplY3QgSVNPLWRhdGUgcmFuZ2UgaW50byBlYWNoIGVuZHBvaW50IHRoYXQgc3VwcG9ydHMgaXQgKGNvbnZlcnRzXG4gIC8vIHRvIFx1NkMxMVx1NTcwQiBmb3JtYXQgdmlhIGlzb1RvUk9DKS4gU2tpcHBlZCBlbmRwb2ludHMga2VlcCB0aGVpciBkZWZhdWx0XG4gIC8vIE5ISS1zaWRlIHdpbmRvdyAoMS0yIHllYXJzIGRlcGVuZGluZyBvbiB0aGUgcGFnZSkuXG4gIGNvbnN0IGZldGNoU3BlYyA9IE5ISV9BUElfRU5EUE9JTlRTLm1hcCgoZXApID0+IHtcbiAgICBjb25zdCBwYXRoID0gZXAuc3VwcG9ydHNEYXRlUmFuZ2UgPyBhcHBseURhdGVSYW5nZVRvUGF0aChlcC5wYXRoLCBkYXRlUmFuZ2UpIDogZXAucGF0aDtcbiAgICByZXR1cm4geyBuYW1lOiBlcC5uYW1lLCB1cmw6IEJBU0UgKyBwYXRoLCBtZXRob2Q6IFwiR0VUXCIgfTtcbiAgfSk7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIGNvbnNvbGUubG9nKFwiW05ISSBBUEkgc3luY10gZGF0ZSByYW5nZTpcIixcbiAgICAgIGAke2RhdGVSYW5nZS5zdGFydCB8fCBcIih1bmJvdW5kZWQpXCJ9IFx1MjE5MiAke2RhdGVSYW5nZS5lbmQgfHwgXCIodW5ib3VuZGVkKVwifWApO1xuICB9XG5cbiAgbGV0IHNldHRsZWRSYXc7XG4gIHRyeSB7XG4gICAgW3sgcmVzdWx0OiBzZXR0bGVkUmF3IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKHNwZWNzKSA9PiB7XG4gICAgICAgIC8vIE5ISSBhdXRoOiBjb29raWVzICsgSldUIGluIHNlc3Npb25TdG9yYWdlLiBUaGUgU1BBJ3MgYXhpb3Mgc2V0c1xuICAgICAgICAvLyBgQXV0aG9yaXphdGlvbjogQmVhcmVyIDx0b2tlbj5gIG9uIGV2ZXJ5IEFQSSBjYWxsLiBTZXNzaW9uXG4gICAgICAgIC8vIGNvb2tpZXMgYWxvbmUgcmV0dXJuIDQwMS5cbiAgICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdG9rZW4pIHJldHVybiBbeyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9XTtcbiAgICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuXG4gICAgICAgIC8vIERldGVjdCBJRExFL3RpbWVvdXQgcGFnZSBhbHJlYWR5IHJlZGlyZWN0ZWQgb24gdGhpcyB0YWIuXG4gICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgICByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyA2MC1zZWNvbmQgdGltZW91dCBwZXIgZmV0Y2ggXHUyMDE0IHNvbWUgTkhJIGVuZHBvaW50cyAoZW5jb3VudGVycyxcbiAgICAgICAgLy8gbWVkcykgdGFrZSAyMCsgc2Vjb25kcy5cbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocywgbXMpIHtcbiAgICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgbXMpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2gocy51cmwsIHtcbiAgICAgICAgICAgICAgbWV0aG9kOiBzLm1ldGhvZCxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgICAgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBjb25zdCBjdCA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICAgIGlmICghY3QuaW5jbHVkZXMoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IGBub24tSlNPTiAoY3Q9JHtjdH0pYCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgICAgICB0cnkgeyBib2R5ID0gYXdhaXQgci5qc29uKCk7IH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiSlNPTiBwYXJzZTogXCIgKyBlLm1lc3NhZ2UgfTsgfVxuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBib2R5IH07XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGlmIChlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcInRpbWVvdXQgNjBzXCIgfTtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uY3VycmVuY3ktbGltaXRlZCBleGVjdXRpb246IG1heCAzIGluIGZsaWdodCBhdCBvbmNlLiBOSEknc1xuICAgICAgICAvLyBhYnVzZSBkZXRlY3Rpb24gYmxvY2tzIGJ1cnN0czsgd2l0aCAxMSBwYXJhbGxlbCBmZXRjaGVzIGl0XG4gICAgICAgIC8vIHRocm90dGxlZCB0aGUgc2Vzc2lvbiBhbmQgcmVkaXJlY3RlZCB0byBJSEtFMzAwMVM5OV9JRExFLlxuICAgICAgICAvLyAzIGF0IGEgdGltZSArIDIwMG1zIGppdHRlciBpcyBnZW50bGUgZW5vdWdoIGZvciAxLXNob3Qgc3luYy5cbiAgICAgICAgY29uc3QgQ09OQ1VSUkVOQ1kgPSAzO1xuICAgICAgICBjb25zdCBKSVRURVJfTVMgPSAyMDA7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBuZXcgQXJyYXkoc3BlY3MubGVuZ3RoKTtcbiAgICAgICAgbGV0IG5leHRJZHggPSAwO1xuICAgICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgICAgd2hpbGUgKG5leHRJZHggPCBzcGVjcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBuZXh0SWR4Kys7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIEpJVFRFUl9NUykpO1xuICAgICAgICAgICAgcmVzdWx0c1tpXSA9IGF3YWl0IGZldGNoT25lKHNwZWNzW2ldLCA2MDAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdvcmtlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DVVJSRU5DWSAmJiB3IDwgc3BlY3MubGVuZ3RoOyB3KyspIHtcbiAgICAgICAgICB3b3JrZXJzLnB1c2god29ya2VyKCkpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdvcmtlcnMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0sXG4gICAgICBhcmdzOiBbZmV0Y2hTcGVjXSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgZXhlY3V0ZVNjcmlwdCBmYWlsZWQ6ICR7ZS5tZXNzYWdlfWApO1xuICB9XG5cbiAgLy8gRGV0ZWN0IHNlc3Npb24gZXhwaXJlZCBhY3Jvc3MgcmVzdWx0cy5cbiAgaWYgKHNldHRsZWRSYXcuc29tZSgocikgPT4gci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgfVxuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuXG4gIC8vIEdlbmVyaWMgbGlzdCBleHRyYWN0aW9uOiBoYW5kbGVzIGFsbCBvYnNlcnZlZCBOSEkgc2hhcGVzLlxuICAvLyAgIC0gUGxhaW4gYXJyYXkgKElIS0UzNDA5IGxhYilcbiAgLy8gICAtIHtzcF9JSEtFPFg+X2RhdGE6IFsuLi5dfSAgKG1lZGljYXRpb25zLCBhbGxlcmdpZXMpXG4gIC8vICAgLSB7d2VzdGVybl9kYXRhLCBjaGluZXNlX2RhdGEsIGRlbnRpc3RfZGF0YTogWy4uLl19IChlbmNvdW50ZXIgbGlzdCxcbiAgLy8gICAgIHNwbGl0IGJ5IFx1ODk3Rlx1OTFBQi9cdTRFMkRcdTkxQUIvXHU3MjU5XHU5MUFCIFx1MjAxNCB3ZSB3YW50IGFsbCB0aHJlZSlcbiAgLy8gRm9yIG11bHRpLWFycmF5IHNoYXBlcyB3ZSBtZXJnZSBhbGwgYXJyYXlzIGFuZCB0YWcgZWFjaCBpdGVtIHdpdGhcbiAgLy8gYF9fc2VjdGlvbmAgKHRoZSBzb3VyY2Uga2V5KSBzbyBhZGFwdGVycyBjYW4gZGlzYW1iaWd1YXRlLlxuICBmdW5jdGlvbiBleHRyYWN0TGlzdChib2R5KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYm9keSkpIHJldHVybiBib2R5O1xuICAgIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIFtdO1xuICAgIGxldCBhcnJheUtleXMgPSBPYmplY3QuZW50cmllcyhib2R5KS5maWx0ZXIoKFtfLCB2XSkgPT4gQXJyYXkuaXNBcnJheSh2KSk7XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICBpZiAoYXJyYXlLZXlzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTtcbiAgICAvLyBNdWx0aXBsZSBhcnJheXMgXHUyMDE0IGRyb3AgVUktaGVscGVyIGFycmF5cyAoZHJvcGRvd24gb3B0aW9ucywgc29ydFxuICAgIC8vIHNlbGVjdG9ycywgbG9va3VwIHRhYmxlcykuIE5ISSBtaXhlcyB0aGVtIGludG8gdGhlIHNhbWUgcmVzcG9uc2VcbiAgICAvLyAoZS5nLiBpbWFnaW5nIHJldHVybnMgc3BfSUhLRTM0MDhTMDFfZGF0YSArIGljZDljbV9zZWxlY3QpLlxuICAgIGNvbnN0IEhFTFBFUl9SRSA9IC9zZWxlY3R8b3B0aW9ufGRyb3Bkb3dufGZpbHRlcnxzb3J0fGxvb2t1cC9pO1xuICAgIGNvbnN0IGRhdGFLZXlzID0gYXJyYXlLZXlzLmZpbHRlcigoW2tdKSA9PiAhSEVMUEVSX1JFLnRlc3QoaykpO1xuICAgIGlmIChkYXRhS2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBkYXRhS2V5c1swXVsxXTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gYXJyYXlLZXlzWzBdWzFdOyAvLyBmYWxsYmFja1xuICAgIGFycmF5S2V5cyA9IGRhdGFLZXlzO1xuICAgIC8vIE11bHRpcGxlIGRhdGEgYXJyYXlzIChlLmcuIHdlc3Rlcm5fZGF0YS9jaGluZXNlX2RhdGEvZGVudGlzdF9kYXRhKVxuICAgIC8vIFx1MjAxNCBtZXJnZSB3aXRoIF9fc2VjdGlvbiB0YWcgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBhcnJheUtleXMpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSB7XG4gICAgICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goeyAuLi5pdGVtLCBfX3NlY3Rpb246IGsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfVxuXG4gIC8vIEFwcGx5IFNXLXNpZGUgYWRhcHRlcnMgdG8gZWFjaCBlbmRwb2ludCdzIGJvZHkuXG4gIGNvbnN0IHNldHRsZWQgPSBzZXR0bGVkUmF3Lm1hcCgociwgaSkgPT4ge1xuICAgIGNvbnN0IGVwID0gTkhJX0FQSV9FTkRQT0lOVFNbaV07XG4gICAgaWYgKHIuZXJyb3IpIHtcbiAgICAgIHJldHVybiB7IHN0YXR1czogXCJyZWplY3RlZFwiLCByZWFzb246IHsgbWVzc2FnZTogYCR7ZXAubmFtZX06ICR7ci5lcnJvcn1gIH0gfTtcbiAgICB9XG4gICAgY29uc3QgbGlzdCA9IGV4dHJhY3RMaXN0KHIuYm9keSk7XG4gICAgLy8gQWRhcHRlcnMgcmV0dXJuIGVpdGhlcjpcbiAgICAvLyAgIC0gb25lIGl0ZW0gICAobW9zdCBhZGFwdGVycyBcdTIwMTQgbGFicywgbWVkcywgZW5jb3VudGVycywgaW1hZ2luZylcbiAgICAvLyAgIC0gbnVsbC91bmRlZmluZWQgKHNraXApXG4gICAgLy8gICAtIGFycmF5IG9mIGl0ZW1zIChhZGFwdEFkdWx0UHJldmVudGl2ZSBcdTIwMTQgdW5mb2xkcyBvbmUgc2NyZWVuaW5nXG4gICAgLy8gICAgIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbiBlbnRyaWVzKVxuICAgIC8vIEZsYXQtaGFuZGxlIGJvdGggc2hhcGVzIHNvIGVhY2ggYWRhcHRlciBjYW4gcGljayB3aGF0ZXZlcidzIGNsZWFyZXN0LlxuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgZm9yIChjb25zdCBpdCBvZiBsaXN0KSB7XG4gICAgICBjb25zdCByID0gZXAuYWRhcHQoaXQpO1xuICAgICAgaWYgKHIgPT09IG51bGwgfHwgciA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHIpKSB7XG4gICAgICAgIGZvciAoY29uc3QgeCBvZiByKSBpZiAoeCkgaXRlbXMucHVzaCh4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zLnB1c2gocik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNuYXBzaG90IGEgYm9keSBzYW1wbGUgZm9yIHNoYXBlcyB3aGVyZSBhZGFwdGVyIHJlamVjdGVkIGV2ZXJ5dGhpbmdcbiAgICAvLyBcdTIwMTQgdXNlZCBieSB0aGUgZGlhZ25vc3RpYyBicmVha2Rvd24gaW4gc3RlcCAyLlxuICAgIGxldCBib2R5U2FtcGxlID0gbnVsbDtcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gSW5jbHVkZSB0aGUgRklSU1QgSVRFTSAoZnVsbCBrZXlzK3ZhbHVlcykgc28gd2UgY2FuIGJ1aWxkIHRoZVxuICAgICAgLy8gY29ycmVjdCBhZGFwdGVyIHdpdGhvdXQgYW5vdGhlciByb3VuZC10cmlwLiBOSEkgaXRlbXMgbWF5IGluY2x1ZGVcbiAgICAgIC8vIFBJSTsgdGhlIHVzZXIgaW5zcGVjdHMgdGhpcyBsb2NhbGx5IHZpYSBzZXJ2aWNlLXdvcmtlciBkZXZ0b29scy5cbiAgICAgIGJvZHlTYW1wbGUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHRvcExldmVsS2V5czogQXJyYXkuaXNBcnJheShyLmJvZHkpID8gbnVsbCA6IE9iamVjdC5rZXlzKHIuYm9keSB8fCB7fSkuc2xpY2UoMCwgMTApLFxuICAgICAgICB3YXNBcnJheTogQXJyYXkuaXNBcnJheShyLmJvZHkpLFxuICAgICAgICBmaXJzdEl0ZW06IGxpc3RbMF0gPz8gbnVsbCxcbiAgICAgICAgc2Vjb25kSXRlbTogbGlzdFsxXSA/PyBudWxsLFxuICAgICAgfSkuc2xpY2UoMCwgNDAwMCk7XG4gICAgfVxuICAgIHJldHVybiB7IHN0YXR1czogXCJmdWxmaWxsZWRcIiwgdmFsdWU6IHsgZXAsIGl0ZW1zLCByYXdfY291bnQ6IGxpc3QubGVuZ3RoLCBib2R5U2FtcGxlLCByYXdMaXN0OiBsaXN0IH0gfTtcbiAgfSk7XG5cbiAgX21hcmtQaGFzZShcIm5oaS1wYXJhbGxlbFwiKTtcblxuICAvLyBTdGVwIDFhOiBlbmNvdW50ZXIgZGV0YWlsIGZhbi1vdXQgKElIS0UzMzAzUzAyKSBcdTIxOTIgY2xhc3NpZnkgZWFjaFxuICAvLyBJSEtFMzMwM1MwMSB2aXNpdCBhcyBBTUIgLyBFTUVSIC8gSU1QIHZpYSBob3NwX0RBVEFfVFlQRV9OQU1FLlxuICAvLyBMaXN0IGVuZHBvaW50IGRvZXNuJ3QgZXhwb3NlIFx1NjAyNVx1OEEzQSBkaXN0aW5jdGlvbjsgZGV0YWlsIGRvZXMuIFdlIHJlLVxuICAvLyBhZGFwdCBlYWNoIGVuY291bnRlciBpdGVtIHdpdGggdGhlIGRpc2NvdmVyZWQgY2xhc3MgYmVmb3JlIHRoZVxuICAvLyBiYWNrZW5kIHVwbG9hZCBzdGVwLlxuICBjb25zdCBlbmNJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJlbmNvdW50ZXJzXCIpO1xuICBpZiAoZW5jSWR4ID49IDAgJiYgc2V0dGxlZFtlbmNJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1QzMxXHU5MUFCXHU3RDAwXHU5MzA0XHU4QTczXHU2MEM1XHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGV0YWlsTWFwID0gYXdhaXQgX2ZldGNoRW5jb3VudGVyRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gUmUtYWRhcHQgd2l0aCBjbGFzc0hpbnQgZnJvbSBkZXRhaWw7IGZhbGwgYmFjayB0byBBTUIuXG4gICAgICAgIGNvbnN0IHJlQWRhcHRlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpc2l0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGRldGFpbE1hcD8uZ2V0KGkpIHx8IG51bGw7XG4gICAgICAgICAgY29uc3QgY2xzID0gX2NsYXNzRnJvbVMwMkRldGFpbChkZXRhaWwpIHx8IFwiQU1CXCI7XG4gICAgICAgICAgY29uc3QgaXQgPSBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlKHZpc2l0c1tpXSwgY2xzKTtcbiAgICAgICAgICBpZiAoaXQpIHJlQWRhcHRlZC5wdXNoKGl0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXR0bGVkW2VuY0lkeF0udmFsdWUuaXRlbXMgPSByZUFkYXB0ZWQ7XG4gICAgICAgIHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZUFkYXB0ZWQubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgZW5jb3VudGVyIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJlbmNvdW50ZXItZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWI6IG1lZGljYXRpb25zIG5lZWQgYSAyLXN0ZXAgZmV0Y2ggXHUyMDE0IElIS0UzMzA2UzAxIG9ubHkgcmV0dXJuc1xuICAvLyB2aXNpdCBtZXRhZGF0YSAoZGF0ZSwgSUNELCBob3NwaXRhbCksIG5vIGRydWcgbmFtZXMuIERydWdzIGxpdmUgYXRcbiAgLy8gSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiB1bmRlclxuICAvLyBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0LiBGYW4gb3V0IGRldGFpbFxuICAvLyBmZXRjaGVzIGluc2lkZSB0aGUgc2FtZSB0YWIgY29udGV4dCAoY29va2llcyArIEpXVCksIGtlZXBpbmdcbiAgLy8gY29uY3VycmVuY3kgbGltaXRlZCBzbyBOSEkgZG9lc24ndCBJRExFLXJlZGlyZWN0IHVzLlxuICAvLyBTdGVwIDFjOiBpbWFnaW5nIG5lZWRzIElIS0UzNDA4UzAyIGZvciB0aGUgYWN0dWFsIHJlcG9ydCBuYXJyYXRpdmUuXG4gIC8vIExpc3QgZW5kcG9pbnQgb25seSBoYXMgb3JkZXIgbWV0YWRhdGE7IGN0eXBlIHBhcmFtIG1pcnJvcnMgdGhlXG4gIC8vIHZpc2l0J3Mgb3JpX1RZUEUgKEEgLyBFIC8gXHUyMDI2KS5cbiAgY29uc3QgaW1nSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwiaW1hZ2luZ1wiKTtcbiAgaWYgKGltZ0lkeCA+PSAwICYmIHNldHRsZWRbaW1nSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNVx1NTgzMVx1NTQ0QVx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydHMgPSBhd2FpdCBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLml0ZW1zID0gcmVwb3J0cztcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnJhd19jb3VudCA9IHJlcG9ydHMubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBpbWFnaW5nIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJpbWFnaW5nLWRldGFpbFwiKTtcblxuICBjb25zdCBtZWRJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJtZWRpY2F0aW9uc1wiKTtcbiAgaWYgKG1lZElkeCA+PSAwICYmIHNldHRsZWRbbWVkSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW21lZElkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NzUyOFx1ODVFNVx1NjYwRVx1N0QzMFx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRydWdJdGVtcyA9IGF3YWl0IF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUuaXRlbXMgPSBkcnVnSXRlbXM7XG4gICAgICAgIC8vIHJhd19jb3VudCBub3cgcmVmbGVjdHMgdGhlICpkcnVnLWxldmVsKiBjb3VudCBmb3IgdGhlIGJyZWFrZG93blxuICAgICAgICAvLyAodmlzaXRzIFx1MjE5MiBkcnVncykuIEtlZXAgdGhlIHZpc2l0IGNvdW50IGluIGEgc2lkZSBmaWVsZCBmb3IgZGVidWcuXG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLnJhd19jb3VudCA9IGRydWdJdGVtcy5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBtZWRpY2F0aW9ucyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwibWVkaWNhdGlvbi1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAyOiBhZ2dyZWdhdGUgaXRlbXMgYnkgcGFnZV90eXBlLCBQT1NUIHRvIGJhY2tlbmQuXG4gIGNvbnN0IGJ5VHlwZSA9IHt9O1xuICBsZXQgcmF3X3RvdGFsID0gMDtcbiAgbGV0IGFkYXB0ZWRfdG90YWwgPSAwO1xuICAvLyBQZXItZW5kcG9pbnQgYnJlYWtkb3duIHNvIHRoZSBmaW5hbCBzdGF0dXMgY2FuIHRlbGwgdXNlciBleGFjdGx5XG4gIC8vIHdoaWNoIGVuZHBvaW50cyBjYW1lIGJhY2sgZW1wdHkgLyBtaXMtc2hhcGVkIFx1MjAxNCBtdWNoIG1vcmUgdXNlZnVsIHRoYW5cbiAgLy8gYSBzaW5nbGUgYWdncmVnYXRlZCBudW1iZXIuXG4gIC8vIEJyZWFrZG93biBzaG93biB0byB0aGUgdXNlciB1bmRlciBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiLiBVc2UgdGhlIENoaW5lc2UgbGFiZWxcbiAgLy8gd2hlbiBrbm93bjsgb25seSBmYWxsIGJhY2sgdG8gdGhlIHJhdyBlbmRwb2ludCBuYW1lIGZvciB1bm1hcHBlZFxuICAvLyAobmV3bHkgYWRkZWQpIGVuZHBvaW50cy4gRW1wdHktcmVzdWx0IGVuZHBvaW50cyBhcmUgb21pdHRlZCBmcm9tXG4gIC8vIHRoZSBzdWNjZXNzIHN1bW1hcnkgZW50aXJlbHkgXHUyMDE0IHRoZXkgYWRkIG5vaXNlLiBFcnJvcnMgYWx3YXlzIHNob3dcbiAgLy8gc28gdGhlIHVzZXIga25vd3Mgc29tZXRoaW5nIGRpZG4ndCBjb21lIHRocm91Z2guXG4gIGNvbnN0IGJyZWFrZG93biA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNldHRsZWQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBlcCA9IE5ISV9BUElfRU5EUE9JTlRTW2ldO1xuICAgIGNvbnN0IHMgPSBzZXR0bGVkW2ldO1xuICAgIGNvbnN0IGxhYmVsID0gRU5EUE9JTlRfTEFCRUxfWkhbZXAubmFtZV0gPz8gZXAubmFtZTtcbiAgICBpZiAocy5zdGF0dXMgPT09IFwicmVqZWN0ZWRcIikge1xuICAgICAgZXJyb3JzLnB1c2goYCR7ZXAubmFtZX06ICR7cy5yZWFzb24ubWVzc2FnZX1gKTtcbiAgICAgIGJyZWFrZG93bi5wdXNoKGBcdTI3NEMgJHtsYWJlbH1cdUZGMUFcdTUzRDZcdTVGOTdcdTU5MzFcdTY1NTdgKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCB7IGl0ZW1zLCByYXdfY291bnQgfSA9IHMudmFsdWU7XG4gICAgcmF3X3RvdGFsICs9IHJhd19jb3VudDtcbiAgICBhZGFwdGVkX3RvdGFsICs9IGl0ZW1zLmxlbmd0aDtcbiAgICBpZiAocmF3X2NvdW50ID09PSAwKSBjb250aW51ZTsgLy8gbm90aGluZyB0byBzaG93XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA+IHJhd19jb3VudCAmJiByYXdfY291bnQgPiAwKSB7XG4gICAgICAvLyAxLXRvLW1hbnkgYWRhcHRlciAoZS5nLiBhZHVsdF9wcmV2ZW50aXZlOiBvbmUgc2NyZWVuaW5nIHJvdyBcdTIxOTJcbiAgICAgIC8vIH4xOCBPYnNlcnZhdGlvbnMpLiBTaG93IGJvdGggbnVtYmVycyBzbyB0aGUgdXNlciB1bmRlcnN0YW5kc1xuICAgICAgLy8gd2h5IG9uZSByZWNvcmQgcHJvZHVjZWQgbWFueS5cbiAgICAgIGJyZWFrZG93bi5wdXNoKGAke2xhYmVsfVx1RkYxQSR7cmF3X2NvdW50fSBcdTdCNDYgXHUyMTkyICR7aXRlbXMubGVuZ3RofSBcdTk4MDVgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWtkb3duLnB1c2goYCR7bGFiZWx9XHVGRjFBJHtpdGVtcy5sZW5ndGh9IFx1N0I0NmApO1xuICAgIH1cbiAgICAvLyBTYXZlIGJvZHkgc2FtcGxlIGZvciBmaXJzdCBlbmRwb2ludCB3aXRoIHJhdz4wIGJ1dCBhZGFwdGVkPTAgKGFkYXB0ZXJcbiAgICAvLyBtaXNtYXRjaCkgc28gd2UgY2FuIGl0ZXJhdGUuIFN0b3JlZCB1bmRlciBjaHJvbWUuc3RvcmFnZS5sb2NhbCBmb3JcbiAgICAvLyBpbnNwZWN0aW9uIHZpYSBzZXJ2aWNlIHdvcmtlciBEZXZUb29scy5cbiAgICBpZiAocmF3X2NvdW50ID4gMCAmJiBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgW2BfX3NhbXBsZUJvZHlfJHtlcC5uYW1lfWBdOiBzLnZhbHVlLmJvZHlTYW1wbGUgfHwgXCJuL2FcIixcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIChieVR5cGVbZXAucGFnZV90eXBlXSA9IGJ5VHlwZVtlcC5wYWdlX3R5cGVdIHx8IFtdKS5wdXNoKC4uLml0ZW1zKTtcbiAgfVxuXG4gIC8vIE1hc2sgZ2F0ZSBpcyByZWFkIGZyZXNoIHBlciBzeW5jIFx1MjAxNCBkZWZhdWx0cyBPRkYgcGVyIHRoZSBkaXNjdXNzaW9uXG4gIC8vIChjaXRpemVuLXNlbGYtZG93bmxvYWQgZG9lc24ndCBuZWVkIGFub255bWl6YXRpb24pLiBXaGVuIE9OLCBhbHNvXG4gIC8vIHNjcnViIHRoZSB1c2VyJ3MgcmVhbCBuYW1lIG91dCBvZiBhbnkgTkhJIG5hcnJhdGl2ZSBmaWVsZCBiZWZvcmVcbiAgLy8gaXQgZmxvd3MgaW50byB0aGUgbWFwcGVyLlxuICBjb25zdCBtYXNrRW5hYmxlZCA9IGF3YWl0IF9pc01hc2tFbmFibGVkKCk7XG4gIGlmIChtYXNrRW5hYmxlZCAmJiBwYXRpZW50T3ZlcnJpZGUubmFtZSkge1xuICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGJ5VHlwZSkpIHtcbiAgICAgIGJ5VHlwZVtrZXldID0gX3JlcGxhY2VOYW1lRGVlcChieVR5cGVba2V5XSwgcGF0aWVudE92ZXJyaWRlLm5hbWUsIHJlcGxhY2VtZW50KTtcbiAgICB9XG4gIH1cblxuICBsZXQgdG90YWwgPSAwO1xuICBsZXQgX2xvY2FsRmlsZW5hbWUgPSBudWxsO1xuICBpZiAobW9kZSA9PT0gXCJsb2NhbFwiKSB7XG4gICAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xuICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBcIlx1RDgzRVx1RERFQyBcdThGNDlcdTYzREJcdTcwQkFcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdTZBOTRcdTIwMjZcIiwgdG90YWxSZXNvdXJjZXM6IDAgfSk7XG4gICAgbGV0IGJ1bmRsZTtcbiAgICB0cnkge1xuICAgICAgYnVuZGxlID0gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvcnMucHVzaChgbG9jYWwgbWFwcGluZzogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICBidW5kbGUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoYnVuZGxlKSB7XG4gICAgICB0b3RhbCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogYFx1RDgzRFx1RENCRSBcdTZFOTZcdTUwOTkgJHt0b3RhbH0gXHU3QjQ2IEZISVIgXHU4Q0M3XHU2RTkwXHUyMDI2YCwgdG90YWxSZXNvdXJjZXM6IHRvdGFsIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGwgPSBhd2FpdCBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudE92ZXJyaWRlLmlkX25vLCBkYXRlUmFuZ2UpO1xuICAgICAgICBfbG9jYWxGaWxlbmFtZSA9IGRsLmZpbGVuYW1lO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgc3Rhc2ggYnVuZGxlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gQnVpbGQgdGhlIG92ZXJyaWRlIHdlIHNlbmQgdG8gYmFja2VuZCB3aXRoIHRoZSBtYXliZS1tYXNrZWQgbmFtZVxuICAgIC8vIHNvIGJhY2tlbmQncyBhdXRvLWNyZWF0ZWQgUGF0aWVudCArIHRoZSBwZXItaXRlbSBzdWJqZWN0LmRpc3BsYXlcbiAgICAvLyBzZWUgdGhlIHNhbWUgdmFsdWUgdGhlIHVzZXIgb3B0ZWQgaW50by4gSXRlbXMgdGhlbXNlbHZlcyB3ZXJlXG4gICAgLy8gYWxyZWFkeSBzY3J1YmJlZCBhYm92ZSAoYnlUeXBlIHBhc3MpLCBzbyB0aGlzIGp1c3QgY292ZXJzIHRoZVxuICAgIC8vIG92ZXJyaWRlLWRlcml2ZWQgUGF0aWVudC5cbiAgICBjb25zdCB1cGxvYWRPdmVycmlkZSA9IG1hc2tFbmFibGVkICYmIHBhdGllbnRPdmVycmlkZS5uYW1lXG4gICAgICA/IHsgLi4ucGF0aWVudE92ZXJyaWRlLCBuYW1lOiBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSkgfVxuICAgICAgOiBwYXRpZW50T3ZlcnJpZGU7XG4gICAgZm9yIChjb25zdCBbcGFnZV90eXBlLCBpdGVtc10gb2YgT2JqZWN0LmVudHJpZXMoYnlUeXBlKSkge1xuICAgICAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdTJCMDZcdUZFMEYgXHU0RTBBXHU1MEIzICR7cGFnZV90eXBlfVx1RkYwOCR7aXRlbXMubGVuZ3RofSBcdTdCNDZcdUZGMDlcdTIwMjZgLFxuICAgICAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgdXBsb2FkT3ZlcnJpZGUpO1xuICAgICAgICB0b3RhbCArPSBkYXRhLmNvdW50IHx8IDA7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGB1cGxvYWQgJHtwYWdlX3R5cGV9OiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZnRlciBiYWNrZW5kIHVwbG9hZCwgYWxzbyBmZXRjaCBhIHNuYXBzaG90IG9mIHRoZSBwYXRpZW50J3MgZnVsbFxuICAgIC8vIGN1bXVsYXRpdmUgRkhJUiBCdW5kbGUgYW5kIHN0YXNoIGl0IGZvciB0aGUgcG9wdXAncyBcIlx1RDgzRFx1RENFNSBcdTRFMEJcdThGMDlcIiBidXR0b24uXG4gICAgLy8gVGhpcyBpcyB3aGF0IGAvZmhpci9leHBvcnRgIHJldHVybnMgXHUyMDE0IHRoZSBiYWNrZW5kJ3MgY29tcGxldGUgdmlld1xuICAgIC8vIG9mIHRoaXMgcGF0aWVudCAodGhpcyBzeW5jICsgYW55IHByaW9yIHN5bmNzKSwgYXMgb3Bwb3NlZCB0byBsb2NhbFxuICAgIC8vIG1vZGUncyBcImp1c3QgdGhpcyBzeW5jXCIgYnVuZGxlLlxuICAgIC8vXG4gICAgLy8gU2tpcCBzdGFzaGluZyBlbnRpcmVseSB3aGVuIHRoZSB1cGxvYWQgcGFzcyBwcm9kdWNlZCBubyByZXNvdXJjZXNcbiAgICAvLyBcdTIwMTQgZXhwb3J0aW5nIDAgZW50cmllcyB0aGVuIHN0YXNoaW5nIHRoZW0gY3JlYXRlcyBhIG1pc2xlYWRpbmdcbiAgICAvLyBcIlx1NjcyQ1x1NTczMCBcdTI3MTMgMCBcdTdCNDZcIiBpbmRpY2F0b3IgYW5kIGEgdXNlbGVzcyBcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzIGJ1dHRvbi5cbiAgICBpZiAocGF0aWVudE92ZXJyaWRlLmlkX25vICYmIHRvdGFsID4gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNEXHVEQ0U2IFx1NTNENlx1NUY5N1x1NUY4Q1x1N0FFRlx1NUI4Q1x1NjU3NFx1OENDN1x1NjU5OVx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogdG90YWwgfSk7XG4gICAgICAgIC8vIEJhY2tlbmQgc3RvcmVzIFBhdGllbnQgdW5kZXIgZGVyaXZlUGF0aWVudElkKHJhd0lkKSwgc28gdGhlXG4gICAgICAgIC8vIGV4cG9ydCBmaWx0ZXIgbXVzdCB1c2UgdGhlIGhhc2hlZCBmb3JtIFx1MjAxNCBxdWVyeWluZyB3aXRoIHRoZVxuICAgICAgICAvLyByYXcgbmF0aW9uYWwgSUQgbWF0Y2hlcyB6ZXJvIHJvd3MgZXZlbiB3aGVuIGRhdGEgaXMgdGhlcmUuXG4gICAgICAgIGNvbnN0IGZoaXJQaWQgPSBkZXJpdmVQYXRpZW50SWQocGF0aWVudE92ZXJyaWRlLmlkX25vKTtcbiAgICAgICAgY29uc3QgZXhwVXJsID0gYCR7YmFja2VuZH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gO1xuICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goZXhwVXJsLCB7XG4gICAgICAgICAgaGVhZGVyczogc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyLm9rKSB7XG4gICAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgLy8gUGFzcyB0aGUgc2FtZSBkYXRlUmFuZ2UgdGhlIHVzZXIgcGlja2VkIHRocm91Z2ggc28gdGhlXG4gICAgICAgICAgLy8gZG93bmxvYWRlZCBmaWxlbmFtZSByZWZsZWN0cyBcIlx1NjcwMFx1OEZEMSAzIFx1NUU3NFwiIFx1MjE5MiAyMDIzLTIwMjYgaW5zdGVhZFxuICAgICAgICAgIC8vIG9mIGFsd2F5cyBzeW50aGVzaXppbmcgdG9kYXktMXkgXHUyMTkyIHRvZGF5LlxuICAgICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubywgZGF0ZVJhbmdlKTtcbiAgICAgICAgICBfbG9jYWxGaWxlbmFtZSA9IGRsLmZpbGVuYW1lO1xuICAgICAgICAgIC8vIEFsaWduIHJlcG9ydGVkIGNvdW50IHdpdGggbG9jYWwgbW9kZTogYnVuZGxlLmVudHJ5Lmxlbmd0aFxuICAgICAgICAgIC8vIGluY2x1ZGVzIHRoZSBQYXRpZW50IHJlc291cmNlICh3aGljaCB0aGUgcGVyLXBhZ2UtdHlwZSBQT1NUXG4gICAgICAgICAgLy8gY291bnRzIGhhZCBwcmV2aW91c2x5IG9taXR0ZWQgYmVjYXVzZSBQYXRpZW50IGlzIGF1dG8tY3JlYXRlZFxuICAgICAgICAgIC8vIHNpbGVudGx5IGZyb20gcGF0aWVudF9vdmVycmlkZSkuIFNhbWUgZGF0YSBcdTIxOTIgc2FtZSBudW1iZXIuXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBEZWZlbnNpdmU6IG9ubHkgT1ZFUldSSVRFIHRvdGFsIHdoZW4gZXhwb3J0IGFjdHVhbGx5IHJldHVybmVkXG4gICAgICAgICAgLy8gc29tZXRoaW5nLiBJZiBleHBvcnQgcmV0dXJucyAwIGVudHJpZXMgZGVzcGl0ZSBhIHN1Y2Nlc3NmdWxcbiAgICAgICAgICAvLyB1cGxvYWQgKGNvdWxkIGhhcHBlbiB3aXRoIGEgc3RhbGUtREIgaGFzaCBtaXNtYXRjaCB3ZSBoYXZlbid0XG4gICAgICAgICAgLy8gZml4ZWQgeWV0KSwgZG9uJ3QgY2xvYmJlciB0aGUgdHJ1dGhmdWwgdXBsb2FkIGNvdW50IFx1MjAxNCB0aGF0J3NcbiAgICAgICAgICAvLyBleGFjdGx5IHRoZSBidWcgdGhhdCBtYWRlIFwiXHU1REYyXHU2NkY0XHU2NUIwIDgxIFx1N0I0NlwiIHNpbGVudGx5IGJlY29tZVxuICAgICAgICAgIC8vIFwiXHU1REYyXHU2NkY0XHU2NUIwIDAgXHU3QjQ2XCIuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYnVuZGxlLmVudHJ5KSAmJiBidW5kbGUuZW50cnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChgZXhwb3J0IGJ1bmRsZTogSFRUUCAke3Iuc3RhdHVzfWApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBleHBvcnQgYnVuZGxlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShtb2RlID09PSBcImxvY2FsXCIgPyBcImFzc2VtYmxlK3N0YXNoXCIgOiBcImJhY2tlbmQtdXBsb2FkXCIpO1xuXG4gIC8vIEZvcm1hdCBlbGFwc2VkIHdhbGwtY2xvY2sgdGltZTogc2Vjb25kcyAoMSBkcCkgZm9yIHNob3J0IHN5bmNzLFxuICAvLyBcIm1tOnNzXCIgb25jZSB3ZSBjcm9zcyB0aGUgbWludXRlIG1hcmsgc28gdGhlIHBvcHVwIHN0YXR1cyBzdGF5cyByZWFkYWJsZS5cbiAgY29uc3QgX2VsYXBzZWRNcyA9IERhdGUubm93KCkgLSBfdDA7XG4gIGNvbnN0IF9lbGFwc2VkU3RyID0gX2VsYXBzZWRNcyA8IDYwXzAwMFxuICAgID8gYCR7KF9lbGFwc2VkTXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgXG4gICAgOiBgJHtNYXRoLmZsb29yKF9lbGFwc2VkTXMgLyA2MF8wMDApfW0ke01hdGgucm91bmQoKF9lbGFwc2VkTXMgJSA2MF8wMDApIC8gMTAwMCl9c2A7XG4gIC8vIE5vIG1vcmUgXCJcdTZBOTRcdTY4NDhcdTVERjJcdTUwOTlcdTU5QTVcdTIwMjZcIiB0YWlsIFx1MjAxNCB0aGUgXHVEODNEXHVEQ0U1IGRvd25sb2FkIGJ1dHRvbiBzaXRzIHJpZ2h0XG4gIC8vIGJlbG93IHRoZSBzdGF0dXMsIHNvIHNheWluZyBcIlx1OUVERVx1NEUwQlx1NjVCOVx1NjMwOVx1OTIxNVwiIGlzIGp1c3Qgbm9pc2UuXG4gIGNvbnN0IF9sb2NhbFRhaWwgPSBcIlwiO1xuICBjb25zdCBfc3VjY2Vzc1ZlcmIgPSBtb2RlID09PSBcImxvY2FsXCIgPyBcIlx1NURGMlx1NzUyMlx1NzUxRlwiIDogXCJcdTVERjJcdTY2RjRcdTY1QjBcIjtcbiAgLy8gUGhhc2UgdGltaW5ncyAoYG5oaS1wYXJhbGxlbD04c2AsIGBiYWNrZW5kLXVwbG9hZD0wLjhzYCkgYXJlIGRldlxuICAvLyBpbmZvIFx1MjAxNCB1c2VmdWwgd2hlbiBpbnZlc3RpZ2F0aW5nIGEgc2xvdyBzeW5jIGJ1dCBub2lzZSBmb3IgYW4gZW5kXG4gIC8vIHVzZXIuIEtlZXAgdGhlbSwgYnV0IHRhZyB3aXRoIHRoZSBcIlx1MjNGMVwiIHByZWZpeCB0aGUgcG9wdXAgdXNlcyB0b1xuICAvLyB0dWNrIHRoZW0gaW50byBhIGRlZXBlciBcIlx1NjI4MFx1ODg1M1x1N0QzMFx1N0JDMFwiIHN1Yi10b2dnbGUuXG4gIGNvbnN0IF9waGFzZUxpbmVzID0gX3BoYXNlcy5tYXAoKHApID0+IGBcdTIzRjEgJHtwLm5hbWV9PSR7KHAubXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgKTtcbiAgY29uc3QgX2Z1bGxCcmVha2Rvd24gPSBbLi4uYnJlYWtkb3duLCAuLi5fcGhhc2VMaW5lc107XG5cbiAgLy8gUGljayB0aGUgcmlnaHQgc3VtbWFyeSBsaW5lLiBaZXJvLXJlc3VsdCBpcyB0aGUgdHJpY2tpZXN0IGNhc2U6XG4gIC8vIHdlIGRvbid0IHdhbnQgYSBncmVlbiBcdTI3MDUgc2F5aW5nIFwiMCBcdTdCNDZcIiBiZWNhdXNlIHRoYXQgcmVhZHMgYXNcbiAgLy8gXCJzdWNjZWVkZWQgd2l0aCB6ZXJvIGRhdGFcIi4gVGhhdCdzIGFsbW9zdCBhbHdheXMgb25lIG9mOlxuICAvLyAgIC0gTkhJIHNlc3Npb24gZXhwaXJlZCBiZXR3ZWVuIHRoZSBsb2dpbiBwcm9iZSBhbmQgdGhlIHN5bmNcbiAgLy8gICAgICh0aGUgSUhLRTM0MTAgcHJvYmUgY2FuIHN0aWxsIHN1Y2NlZWQgd2hpbGUgZGF0YSBlbmRwb2ludHNcbiAgLy8gICAgIHJlc3BvbmQgd2l0aCBlbXB0eSBhcnJheXMpO1xuICAvLyAgIC0gdGhlIHVzZXIgdHJ1bHkgaGFzIG5vIHJlY29yZHMgaW4gdGhlIHNlbGVjdGVkIGRhdGUgcmFuZ2UuXG4gIC8vIEVpdGhlciB3YXkgdGhlIGFjdGlvbmFibGUgbmV4dCBzdGVwIGlzIFwiXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1IE5ISSBcdTUxOERcdThBNjZcdTRFMDBcdTZCMjFcIi5cbiAgbGV0IF9zdW1tYXJ5TGluZTtcbiAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICBfc3VtbWFyeUxpbmUgPSBgXHUyNkEwXHVGRTBGIFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgJHtfc3VjY2Vzc1ZlcmJ9ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1RkYwQyR7ZXJyb3JzLmxlbmd0aH0gXHU5ODA1XHU1OTMxXHU2NTU3XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDkke19sb2NhbFRhaWx9YDtcbiAgfSBlbHNlIGlmICh0b3RhbCA9PT0gMCkge1xuICAgIF9zdW1tYXJ5TGluZSA9XG4gICAgICBgXHUyNkEwXHVGRTBGIFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMFx1NEY0Nlx1NkM5Mlx1NjI5M1x1NTIzMFx1NEVGQlx1NEY1NVx1OENDN1x1NjU5OVx1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5XHUyMDE0IGAgK1xuICAgICAgYFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBzZXNzaW9uIFx1NTNFRlx1ODBGRFx1OTA0RVx1NjcxRlx1RkYwQ1x1OEFDQlx1NTZERVx1OEE3Mlx1NTIwNlx1OTgwMVx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1RkYxQlx1NjIxNlx1NjJDOVx1OTU3N1x1MzAwQ1x1NjVFNVx1NjcxRlx1N0JDNFx1NTcwRFx1MzAwRFx1NTE4RFx1OEE2Nlx1MzAwMmA7XG4gIH0gZWxzZSB7XG4gICAgX3N1bW1hcnlMaW5lID0gYFx1MjcwNSBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTAgXHUwMEI3ICR7X3N1Y2Nlc3NWZXJifSAke3RvdGFsfSBcdTdCNDZcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOSR7X2xvY2FsVGFpbH1gO1xuICB9XG5cbiAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICBydW5uaW5nOiBmYWxzZSxcbiAgICBwcm9ncmVzczogX3N1bW1hcnlMaW5lLFxuICAgIHBoYXNlOiBcImRvbmVcIixcbiAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgIGVsYXBzZWRNczogX2VsYXBzZWRNcyxcbiAgICAvLyBQZXItZW5kcG9pbnQgYnJlYWtkb3duIGZvciB0aGUgcG9wdXAncyAnXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwJyBjb2xsYXBzaWJsZS5cbiAgICAvLyBLZWVwIGFzIGEgcGxhaW4gYXJyYXkgc28gcG9wdXAuanMgY2FuIHJlbmRlciB3aXRoIERPTSBBUEkgKG5vXG4gICAgLy8gaW5uZXJIVE1MIC8gbm8gZXNjYXBpbmcgY29uY2VybnMpLiBJdGVtcyBsb29rIGxpa2VcbiAgICAvLyAnZW5jb3VudGVycz0xMi8xMicgb3IgJ2FkdWx0X3ByZXZlbnRpdmU9MiByb3dzIFx1MjE5MiAzNiBvYnMnLlxuICAgIGJyZWFrZG93bjogX2Z1bGxCcmVha2Rvd24sXG4gICAgZXJyb3JzLFxuICAgIGhpc3RubzogcGF0aWVudE92ZXJyaWRlLmlkX25vLFxuICAgIG1vZGUsXG4gICAgbG9jYWxGaWxlbmFtZTogX2xvY2FsRmlsZW5hbWUsXG4gIH0pO1xuXG4gIC8vIEJlc3QtZWZmb3J0OiB3cml0ZSBhIFN5bmMgSGlzdG9yeSByb3cgdG8gdGhlIGJhY2tlbmQgc28gdGhlIGRhc2hib2FyZFxuICAvLyBjYW4gc2hvdyB3aGVuL3doby9ob3ctbG9uZy93aGF0L3JhbmdlLiBTa2lwcGVkIGluIGxvY2FsIG1vZGUgKHRoZXJlXG4gIC8vIGlzIG5vIGJhY2tlbmQpLiBXcmFwcGVkICsgc3dhbGxvd2VkIHNvIGEgbG9nZ2luZyBmYWlsdXJlIG5ldmVyXG4gIC8vIHByb3BhZ2F0ZXMgYmFjayB0byB0aGUgdXNlci1mYWNpbmcgc3luYyBzdGF0dXMuXG4gIGlmIChtb2RlICE9PSBcImxvY2FsXCIpIHRyeSB7XG4gICAgYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy9sb2dgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc3RhdHVzOiBlcnJvcnMubGVuZ3RoID8gXCJwYXJ0aWFsXCIgOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgcGF0aWVudF9pZDogcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCIsXG4gICAgICAgIC8vIC9zeW5jL2xvZyBsYW5kcyBpbiB0aGUgZGFzaGJvYXJkJ3Mgc3luYy1oaXN0b3J5IHJvdy4gT25seVxuICAgICAgICAvLyBtYXNrIHdoZW4gdGhlIHVzZXIgaGFzIG9wdGVkIGluIFx1MjAxNCBvdGhlcndpc2UgZGFzaGJvYXJkIHNlZXNcbiAgICAgICAgLy8gdGhlIHJhdyBuYW1lIHRoZXkgdHlwZWQgKGNvbnNpc3RlbnQgd2l0aCBcIlx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOFwiIGRlZmF1bHQpLlxuICAgICAgICBwYXRpZW50X25hbWU6IG1hc2tFbmFibGVkXG4gICAgICAgICAgPyBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiKVxuICAgICAgICAgIDogcGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIixcbiAgICAgICAgdG90YWwsXG4gICAgICAgIGJyZWFrZG93bixcbiAgICAgICAgZGF0ZV9yYW5nZTogZGF0ZVJhbmdlTGFiZWwgfHwgXCJcIixcbiAgICAgICAgZWxhcHNlZF9tczogX2VsYXBzZWRNcyxcbiAgICAgICAgc3RhcnRlZF9hdDogbmV3IERhdGUoX3QwKS50b0lTT1N0cmluZygpLFxuICAgICAgICBlcnJvcnMsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gZmFpbGVkIHRvIHdyaXRlIGhpc3RvcnkgbG9nOlwiLCBlKTtcbiAgfVxuICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG59XG5cbi8vIE9uZS10aW1lIG1pZ3JhdGlvbiBmcm9tIGNocm9tZS5zdG9yYWdlLnN5bmMgXHUyMTkyIGNocm9tZS5zdG9yYWdlLmxvY2FsLlxuLy8gUHJldmlvdXMgdmVyc2lvbnMgc3RvcmVkIHN5bmNBcGlLZXkgKyBwYXRpZW50T3ZlcnJpZGUgKGNvbnRhaW5pbmcgdGhlXG4vLyBuYXRpb25hbCBJRCkgdW5kZXIgLnN5bmMsIHdoaWNoIENocm9tZSByZXBsaWNhdGVzIHRvIHRoZSB1c2VyJ3MgR29vZ2xlXG4vLyBhY2NvdW50IGFuZCBwdXNoZXMgdG8gZXZlcnkgZGV2aWNlIHRoZXkgc2lnbiBpbnRvLiBNb3ZlIGV2ZXJ5dGhpbmdcbi8vIHNldHRpbmdzLXJlbGF0ZWQgdG8gLmxvY2FsOyBjbGVhciB0aGUgc3luYyBjb3B5LlxuY29uc3QgU1lOQ19LRVlTX1RPX01JR1JBVEUgPSBbXG4gIFwiYmFja2VuZFVybFwiLFxuICBcInN5bmNBcGlLZXlcIixcbiAgXCJzbWFydEFwcExhdW5jaFVybFwiLFxuICBcInBhdGllbnRPdmVycmlkZVwiLFxuICBcInN5bmNNb2RlXCIsXG4gIFwibWFza05hbWVFbmFibGVkXCIsXG5dO1xuXG5hc3luYyBmdW5jdGlvbiBtaWdyYXRlU3luY1RvTG9jYWwoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3luY2VkID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU1lOQ19LRVlTX1RPX01JR1JBVEUpO1xuICAgIGNvbnN0IHByZXNlbnQgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhzeW5jZWQpLmZpbHRlcigoWywgdl0pID0+IHYgIT09IHVuZGVmaW5lZCksXG4gICAgKTtcbiAgICBpZiAoT2JqZWN0LmtleXMocHJlc2VudCkubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgbG9jYWwgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoT2JqZWN0LmtleXMocHJlc2VudCkpO1xuICAgIC8vIERvbid0IG92ZXJ3cml0ZSBhbnl0aGluZyB0aGUgdXNlciBhbHJlYWR5IHNldCBvbiB0aGlzIG1hY2hpbmUuXG4gICAgY29uc3QgdG9Xcml0ZSA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgIE9iamVjdC5lbnRyaWVzKHByZXNlbnQpLmZpbHRlcigoW2tdKSA9PiBsb2NhbFtrXSA9PT0gdW5kZWZpbmVkKSxcbiAgICApO1xuICAgIGlmIChPYmplY3Qua2V5cyh0b1dyaXRlKS5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQodG9Xcml0ZSk7XG4gICAgfVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMucmVtb3ZlKE9iamVjdC5rZXlzKHByZXNlbnQpKTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gTWlncmF0aW9uIGlzIGJlc3QtZWZmb3J0LiBUaGUgbmV4dCBydW4gZ2V0cyB0byB0cnkgYWdhaW4uXG4gIH1cbn1cblxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoYXN5bmMgKCkgPT4ge1xuICBhd2FpdCBtaWdyYXRlU3luY1RvTG9jYWwoKTtcbn0pO1xuXG4vLyBBbHNvIHJ1biBtaWdyYXRpb24gb24gc2VydmljZS13b3JrZXIgd2FrZS11cCAoY292ZXJzIHJlbG9hZC9yZXN0YXJ0XG4vLyBwYXRocyB3aGVyZSBvbkluc3RhbGxlZCBkb2Vzbid0IGZpcmUpLlxuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwPy5hZGRMaXN0ZW5lcj8uKCgpID0+IHtcbiAgbWlncmF0ZVN5bmNUb0xvY2FsKCk7XG59KTtcbm1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZywgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdGFydE5oaUFwaVN5bmNcIikge1xuICAgIHJ1bk5oaUFwaVN5bmMobXNnLnBheWxvYWQpLnRoZW4oXG4gICAgICAoKSA9PiB7IHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pOyB9IGNhdGNoIHt9IH0sXG4gICAgICBhc3luYyAoZSkgPT4ge1xuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gQ0FOQ0VMX0VSUk9SKSB7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUsIGNhbmNlbGxlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gU0VTU0lPTl9FWFBJUkVEX0VSUk9SKSB7XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REQxMiBOSEkgc2Vzc2lvbiBcdTVERjJcdTc2N0JcdTUxRkEgXHUyMDE0IFx1OEFDQlx1NTcyOCBOSEkgdGFiIFx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1NUY4Q1x1NTE4RFx1OUVERSBTeW5jXCIsXG4gICAgICAgICAgICAgIHBoYXNlOiBcInNlc3Npb25fZXhwaXJlZFwiLFxuICAgICAgICAgICAgICB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGV4cGlyZWQ6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5lcnJvcihcInJ1bk5oaUFwaVN5bmMgZmFpbGVkXCIsIGUpO1xuICAgICAgICBhd2FpdCBzZXRTdGF0dXMoeyBydW5uaW5nOiBmYWxzZSwgcHJvZ3Jlc3M6IGBcdTI3NEMgJHtlLm1lc3NhZ2V9YCwgcGhhc2U6IFwiZXJyb3JcIiB9KTtcbiAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBlcnJvcjogZS5tZXNzYWdlIH0pOyB9IGNhdGNoIHt9XG4gICAgICB9LFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdG9wU3luY1wiKSB7XG4gICAgLy8gU2V0IHRoZSBjYW5jZWxsYXRpb24gZmxhZzsgdGhlIGluLWZsaWdodCBzeW5jIHdpbGwgdGhyb3dcbiAgICAvLyBDQU5DRUxfRVJST1IgYXQgaXRzIG5leHQgY2hlY2tDYW5jZWwoKSBjYWxsLiAgU3RvcmFnZSBpcyBhbHJlYWR5XG4gICAgLy8gdXBkYXRlZCBieSB0aGUgcG9wdXAsIHNvIHdlIGRvbid0IHRvdWNoIGl0IGhlcmUuXG4gICAgX2NhbmNlbGxlZCA9IHRydWU7XG4gICAgLy8gRGlzY2FyZCBhbnkgcGFydGlhbCBkYXRhIHVwbG9hZGVkIHNvIGZhci4gVGhlIHVzZXIncyBzdGF0ZWRcbiAgICAvLyBjb250cmFjdCBpcyAnc3RvcCA9IGFib3J0LCBJJ2xsIHJlc3luYyBmcm9tIHNjcmF0Y2ggbGF0ZXInIFx1MjAxNCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gbGVhdmUgYSBoYWxmLWxvYWRlZCBwYXRpZW50IGluIHRoZSBGSElSIHN0b3JlIHRoYXRcbiAgICAvLyBsb29rcyBjb21wbGV0ZSB0byBkb3duc3RyZWFtIFNNQVJUIGFwcHMuXG4gICAgY29uc3QgY3R4ID0gX2FjdGl2ZVN5bmNDdHg7XG4gICAgaWYgKGN0eD8ucGF0aWVudElkICYmIGN0eC5iYWNrZW5kKSB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYCR7Y3R4LmJhY2tlbmR9L3N5bmMvcGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChjdHgucGF0aWVudElkKX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IGN0eC5zeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGN0eC5zeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBTdXJmYWNlIHRoZSB3aXBlIGluIHRoZSBzdGF0dXMgc28gdXNlciBzZWVzIGl0IGFjdHVhbGx5IGhhcHBlbmVkLlxuICAgICAgICAgIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBbU1RPUkFHRV9LRVldOiB7XG4gICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1REYyXHU1MDVDXHU2QjYyXHU0RTI2XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBjYW5jZWwgd2lwZSBmYWlsZWQ6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG4gICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImdldFN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkudGhlbigoZGF0YSkgPT4gc2VuZFJlc3BvbnNlKGRhdGFbU1RPUkFHRV9LRVldIHx8IG51bGwpKTtcbiAgICByZXR1cm4gdHJ1ZTsgIC8vIGFzeW5jIHJlc3BvbnNlXG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjbGVhclN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShTVE9SQUdFX0tFWSkudGhlbigoKSA9PiBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjaGVja05oaUxvZ2luXCIpIHtcbiAgICBfY2hlY2tOaGlMb2dpblN0YXRlKG1zZy50YWJJZCkudGhlbihcbiAgICAgIChzdGF0ZSkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogc3RhdGUgfSk7IH0gY2F0Y2gge30gfSxcbiAgICAgICgpID0+IHsgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgbG9nZ2VkSW46IG51bGwgfSk7IH0gY2F0Y2gge30gfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcblxuLy8gQmVsdC1hbmQtc3VzcGVuZGVycyBTVyBrZWVwYWxpdmU6IGFuIGFsYXJtIGV2ZXJ5IDIwIHMgd2FrZXMgdGhlIFNXIGlmXG4vLyBpZGxlLiBDb21iaW5lZCB3aXRoIHRoZSByZXR1cm4tdHJ1ZSBwYXR0ZXJuIGFib3ZlLCB0aGlzIHByZXZlbnRzIHRoZVxuLy8gMzAgcyBpZGxlIHNodXRkb3duIGZyb20gZW5kaW5nIGFuIGluLXByb2dyZXNzIHN5bmMuXG5jaHJvbWUuYWxhcm1zLmNyZWF0ZShcInN3LWtlZXBhbGl2ZVwiLCB7IHBlcmlvZEluTWludXRlczogMC4zNCB9KTtcbmNocm9tZS5hbGFybXMub25BbGFybS5hZGRMaXN0ZW5lcigoKSA9PiB7IC8qIG5vLW9wOyBwcmVzZW5jZSBpcyB0aGUgcG9pbnQgKi8gfSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQVNBLE9BQUMsV0FBVztBQUNWO0FBRUEsWUFBSSxjQUFjO0FBQ2xCLFlBQUksaUJBQWlCO0FBQ3JCLFlBQUksU0FBUyxPQUFPLFdBQVc7QUFDL0IsWUFBSSxPQUFPLFNBQVMsU0FBUyxDQUFDO0FBQzlCLFlBQUksS0FBSyxtQkFBbUI7QUFDMUIsbUJBQVM7QUFBQSxRQUNYO0FBQ0EsWUFBSSxhQUFhLENBQUMsVUFBVSxPQUFPLFNBQVM7QUFDNUMsWUFBSSxVQUFVLENBQUMsS0FBSyxzQkFBc0IsT0FBTyxZQUFZLFlBQVksUUFBUSxZQUFZLFFBQVEsU0FBUztBQUM5RyxZQUFJLFNBQVM7QUFDWCxpQkFBTztBQUFBLFFBQ1QsV0FBVyxZQUFZO0FBQ3JCLGlCQUFPO0FBQUEsUUFDVDtBQUNBLFlBQUksWUFBWSxDQUFDLEtBQUssd0JBQXdCLE9BQU8sV0FBVyxZQUFZLE9BQU87QUFDbkYsWUFBSSxNQUFNLE9BQU8sV0FBVyxjQUFjLE9BQU87QUFDakQsWUFBSSxlQUFlLENBQUMsS0FBSywyQkFBMkIsT0FBTyxnQkFBZ0I7QUFDM0UsWUFBSSxZQUFZLG1CQUFtQixNQUFNLEVBQUU7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O0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBVVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBY1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1WLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBWVYsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFVVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFnQlo7QUFnQk8sTUFBTSxzQkFBMkMsb0JBQUksSUFBSTtBQUFBLElBQzlEO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGLENBQUM7QUFXTSxNQUFNLGtCQUEwRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1yRSxVQUFVO0FBQUE7QUFBQTtBQUFBLE1BR1Is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QVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBV1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUVWLFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FDRTtBQUFBLElBQ0YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLEVBQ2I7OztBQzNpQkEsTUFBTSxjQUFjO0FBS3BCLE1BQU0sZ0JBQWlEO0FBQUEsSUFDckQsQ0FBQyxVQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsVUFBSyxHQUFHO0FBQUEsSUFDVCxDQUFDLFVBQUssSUFBSTtBQUFBLElBQ1YsQ0FBQyxVQUFLLElBQUk7QUFBQSxJQUNWLENBQUMsVUFBSyxJQUFJO0FBQUEsSUFDVixDQUFDLFVBQUssSUFBSTtBQUFBLEVBQ1o7QUFFQSxXQUFTLG1CQUFtQixHQUFtQjtBQUM3QyxRQUFJLE1BQU07QUFDVixlQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssZUFBZTtBQUN0QyxVQUFJLElBQUksU0FBUyxJQUFJLEdBQUc7QUFDdEIsY0FBTSxJQUFJLE1BQU0sSUFBSSxFQUFFLEtBQUssRUFBRTtBQUFBLE1BQy9CO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBRUEsTUFBTSxnQkFBZ0I7QUFJdEIsTUFBTSxzQkFBc0I7QUFDNUIsTUFBTSxnQkFBZ0I7QUFDdEIsTUFBTSxnQkFBZ0I7QUFJdEIsTUFBTSxlQUFlO0FBQ3JCLE1BQU0sb0JBQW9CO0FBQzFCLE1BQU0sdUJBQ0o7QUFFRixNQUFNLGNBQWdEO0FBQUEsSUFDcEQsY0FBSSxDQUFDLFFBQVEsTUFBTTtBQUFBLElBQ25CLFFBQUcsQ0FBQyxRQUFRLE1BQU07QUFBQSxJQUNsQixHQUFHLENBQUMsUUFBUSxNQUFNO0FBQUEsSUFDbEIsY0FBSSxDQUFDLFVBQVUsUUFBUTtBQUFBLElBQ3ZCLFFBQUcsQ0FBQyxVQUFVLFFBQVE7QUFBQSxJQUN0QixHQUFHLENBQUMsVUFBVSxRQUFRO0FBQUEsRUFDeEI7QUE4QkEsTUFBTSxpQkFBZ0Q7QUFBQTtBQUFBLElBRXBELFVBQUs7QUFBQTtBQUFBLElBRUwsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBO0FBQUEsSUFFVCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUVOLFFBQUc7QUFBQSxJQUNILElBQUk7QUFBQSxJQUNKLFVBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxFQUNQO0FBRU8sV0FBUyxPQUFPLE1BQWdEO0FBQ3JFLFFBQUksQ0FBQyxLQUFNLFFBQU87QUFDbEIsUUFBSSxPQUFPLFVBQVUsZUFBZSxLQUFLLGdCQUFnQixJQUFJLEdBQUc7QUFDOUQsYUFBTyxlQUFlLElBQUksS0FBSztBQUFBLElBQ2pDO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFJQSxXQUFTLGFBQWEsT0FBZSxNQUF3QjtBQUMzRCxVQUFNLElBQWMsRUFBRSxNQUFNO0FBQzVCLFFBQUksTUFBTTtBQUNSLFFBQUUsT0FBTztBQUNULFFBQUUsU0FBUztBQUNYLFFBQUUsT0FBTztBQUFBLElBQ1g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUVBLFdBQVMsY0FBYyxHQUEwQjtBQUMvQyxRQUFJLE1BQU0sTUFBTSxLQUFLLEtBQU0sUUFBTztBQUlsQyxVQUFNLFVBQVUsRUFBRSxLQUFLO0FBQ3ZCLFFBQUksWUFBWSxHQUFJLFFBQU87QUFDM0IsVUFBTSxJQUFJLE9BQU8sT0FBTztBQUN4QixRQUFJLE9BQU8sTUFBTSxDQUFDLEVBQUcsUUFBTztBQUM1QixXQUFPO0FBQUEsRUFDVDtBQVVPLFdBQVMsZ0JBQWdCLFVBQWtCLE1BQTRCO0FBQzVFLFVBQU0sSUFBSSxvQkFBb0IsWUFBWSxJQUFJLEtBQUssQ0FBQztBQUNwRCxRQUFJLENBQUMsRUFBRyxRQUFPLENBQUM7QUFFaEIsVUFBTSxXQUFtQyxDQUFDO0FBQzFDLFVBQU0sWUFBb0MsQ0FBQztBQUMzQyxRQUFJLFlBQVk7QUFFaEIsVUFBTSxJQUFJLEVBQUUsTUFBTSxtQkFBbUI7QUFDckMsUUFBSSxHQUFHO0FBQ0wsWUFBTSxVQUFVLEVBQUUsQ0FBQyxLQUFLO0FBQ3hCLFlBQU0sV0FBVyxFQUFFLENBQUMsS0FBSztBQUN6QixpQkFBVyxNQUFNLFFBQVEsU0FBUyxZQUFZLEdBQUc7QUFDL0MsWUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRyxVQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO0FBQUEsTUFDNUM7QUFDQSxpQkFBVyxNQUFNLFNBQVMsU0FBUyxZQUFZLEdBQUc7QUFDaEQsWUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRyxXQUFVLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO0FBQUEsTUFDN0M7QUFDQSxrQkFBWSxPQUFPLEtBQUssUUFBUSxFQUFFLFNBQVMsS0FBSyxPQUFPLEtBQUssU0FBUyxFQUFFLFNBQVM7QUFBQSxJQUNsRixPQUFPO0FBRUwsWUFBTSxTQUFTLEVBQUUsTUFBTSxpQkFBaUI7QUFDeEMsVUFBSSxRQUFRO0FBQ1YsY0FBTSxRQUFRLE9BQU8sQ0FBQyxLQUFLO0FBQzNCLG1CQUFXLE1BQU0sTUFBTSxTQUFTLFlBQVksR0FBRztBQUM3QyxnQkFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLO0FBQ3hCLGdCQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUs7QUFHeEIsZ0JBQU0sTUFBTSxJQUFJLE9BQU8sR0FBRyxZQUFZLE1BQU0sQ0FBQyxrREFBbUM7QUFDaEYsZ0JBQU0sS0FBSyxNQUFNLE1BQU0sR0FBRztBQUMxQixnQkFBTSxLQUFLLEtBQUssQ0FBQyxLQUFLO0FBQ3RCLGNBQUksT0FBTyxPQUFPLE9BQU8sTUFBTTtBQUM3QixxQkFBUyxNQUFNLElBQUk7QUFBQSxVQUNyQixXQUFXLE9BQU8sT0FBTyxPQUFPLE1BQU07QUFDcEMsc0JBQVUsTUFBTSxJQUFJO0FBQUEsVUFDdEIsT0FBTztBQUNMLHFCQUFTLE1BQU0sSUFBSTtBQUFBLFVBQ3JCO0FBQUEsUUFDRjtBQUNBLG9CQUFZLE9BQU8sS0FBSyxRQUFRLEVBQUUsU0FBUyxLQUFLLE9BQU8sS0FBSyxTQUFTLEVBQUUsU0FBUztBQUFBLE1BQ2xGO0FBQUEsSUFDRjtBQUVBLFFBQUksV0FBVztBQUNiLFlBQU0sVUFBd0IsQ0FBQztBQUUvQixZQUFNLGFBQXVCLENBQUM7QUFDOUIsaUJBQVcsS0FBSyxDQUFDLEdBQUcsT0FBTyxLQUFLLFFBQVEsR0FBRyxHQUFHLE9BQU8sS0FBSyxTQUFTLENBQUMsR0FBRztBQUNyRSxZQUFJLENBQUMsV0FBVyxTQUFTLENBQUMsRUFBRyxZQUFXLEtBQUssQ0FBQztBQUFBLE1BQ2hEO0FBQ0EsaUJBQVcsVUFBVSxZQUFZO0FBQy9CLGNBQU0sVUFBVSxZQUFZLE1BQU07QUFDbEMsWUFBSSxDQUFDLFFBQVM7QUFDZCxjQUFNLENBQUMsVUFBVSxXQUFXLElBQUk7QUFDaEMsY0FBTSxRQUFvQjtBQUFBLFVBQ3hCLE1BQU07QUFBQSxVQUNOLFdBQVc7QUFBQSxZQUNUO0FBQUEsY0FDRSxRQUFRO0FBQUEsZ0JBQ047QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsTUFBTTtBQUFBLGtCQUNOLFNBQVM7QUFBQSxnQkFDWDtBQUFBLGNBQ0Y7QUFBQSxjQUNBLE1BQU07QUFBQSxZQUNSO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFDQSxZQUFJLFVBQVUsVUFBVTtBQUN0QixnQkFBTSxJQUFJLGNBQWMsU0FBUyxNQUFNLENBQUU7QUFDekMsY0FBSSxNQUFNLEtBQU0sT0FBTSxNQUFNLGFBQWEsR0FBRyxJQUFJO0FBQUEsUUFDbEQ7QUFDQSxZQUFJLFVBQVUsV0FBVztBQUN2QixnQkFBTSxJQUFJLGNBQWMsVUFBVSxNQUFNLENBQUU7QUFDMUMsY0FBSSxNQUFNLEtBQU0sT0FBTSxPQUFPLGFBQWEsR0FBRyxJQUFJO0FBQUEsUUFDbkQ7QUFDQSxnQkFBUSxLQUFLLEtBQUs7QUFBQSxNQUNwQjtBQUNBLFVBQUksUUFBUSxTQUFTLEdBQUc7QUFFdEIsY0FBTSxPQUFPLG9CQUFJLElBQVk7QUFDN0IsY0FBTSxNQUFvQixDQUFDO0FBQzNCLG1CQUFXLEtBQUssU0FBUztBQUN2QixnQkFBTSxJQUFJLEVBQUUsWUFBWSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUc7QUFDdkMsY0FBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsRUFBRztBQUN2QixlQUFLLElBQUksQ0FBQztBQUNWLGNBQUksS0FBSyxDQUFDO0FBQUEsUUFDWjtBQUNBLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUVBLFVBQU0sTUFBTSxXQUFXLFVBQVUsSUFBSTtBQUNyQyxXQUFPLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztBQUFBLEVBQ3hCO0FBY08sV0FBUyxXQUFXLFVBQWtCLE1BQWlDO0FBQzVFLFVBQU0sSUFBSSxvQkFBb0IsWUFBWSxJQUFJLEtBQUssQ0FBQztBQUNwRCxRQUFJLENBQUMsRUFBRyxRQUFPO0FBQ2YsVUFBTSxRQUFvQixFQUFFLE1BQU0sU0FBUztBQUUzQyxVQUFNLElBQUksRUFBRSxNQUFNLG1CQUFtQjtBQUNyQyxRQUFJLEdBQUc7QUFDTCxZQUFNLE1BQU0sRUFBRSxDQUFDLEtBQUssSUFBSSxLQUFLO0FBQzdCLFlBQU0sTUFBTSxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUs7QUFDN0IsaUJBQVcsQ0FBQyxNQUFNLE9BQU8sS0FBSztBQUFBLFFBQzVCLENBQUMsT0FBTyxFQUFFO0FBQUEsUUFDVixDQUFDLFFBQVEsRUFBRTtBQUFBLE1BQ2IsR0FBWTtBQUNWLFlBQUksQ0FBQyxXQUFXLFlBQVksWUFBTyxZQUFZLGVBQU07QUFHckQsY0FBTSxVQUFVLGNBQWMsT0FBTztBQUNyQyxZQUFJLFlBQVksTUFBTTtBQUNwQixnQkFBTSxJQUFJLElBQUksYUFBYSxTQUFTLElBQUk7QUFDeEM7QUFBQSxRQUNGO0FBR0EsY0FBTSxLQUFLLFFBQVEsTUFBTSxhQUFhO0FBQ3RDLFlBQUksTUFBTSxTQUFTLFNBQVMsTUFBTSxTQUFTLFFBQVc7QUFDcEQsZ0JBQU0sS0FBSyxjQUFjLEdBQUcsQ0FBQyxDQUFFO0FBQy9CLGdCQUFNLEtBQUssY0FBYyxHQUFHLENBQUMsQ0FBRTtBQUMvQixjQUFJLE9BQU8sUUFBUSxPQUFPLE1BQU07QUFDOUIsa0JBQU0sTUFBTSxhQUFhLElBQUksSUFBSTtBQUNqQyxrQkFBTSxPQUFPLGFBQWEsSUFBSSxJQUFJO0FBQ2xDO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFHQSxjQUFNLEtBQUssUUFBUSxNQUFNLGFBQWE7QUFDdEMsWUFBSSxJQUFJO0FBQ04sZ0JBQU0sSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFFO0FBQzlCLGNBQUksTUFBTSxNQUFNO0FBQ2Qsa0JBQU0sS0FBSyxHQUFHLENBQUM7QUFDZixnQkFBSSxPQUFPLE9BQU8sT0FBTyxNQUFNO0FBQzdCLG9CQUFNLE1BQU0sYUFBYSxHQUFHLElBQUk7QUFBQSxZQUNsQyxPQUFPO0FBQ0wsb0JBQU0sT0FBTyxhQUFhLEdBQUcsSUFBSTtBQUFBLFlBQ25DO0FBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUdBLGNBQU0sS0FBSyxRQUFRLE1BQU0sb0JBQW9CO0FBQzdDLFlBQUksSUFBSTtBQUNOLGdCQUFNLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBRTtBQUM5QixjQUFJLE1BQU0sTUFBTTtBQUNkLGtCQUFNLE9BQU8sYUFBYSxHQUFHLElBQUk7QUFBQSxVQUNuQztBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFFQSxVQUFNLFlBQVksRUFBRSxNQUFNLGFBQWE7QUFDdkMsUUFBSSxXQUFXO0FBQ2IsWUFBTSxLQUFLLGNBQWMsVUFBVSxDQUFDLENBQUU7QUFDdEMsWUFBTSxLQUFLLGNBQWMsVUFBVSxDQUFDLENBQUU7QUFDdEMsVUFBSSxPQUFPLFFBQVEsT0FBTyxNQUFNO0FBQzlCLGNBQU0sTUFBTSxhQUFhLElBQUksSUFBSTtBQUNqQyxjQUFNLE9BQU8sYUFBYSxJQUFJLElBQUk7QUFBQSxNQUNwQztBQUNBLGFBQU87QUFBQSxJQUNUO0FBRUEsVUFBTSxXQUFXLEVBQUUsTUFBTSxhQUFhO0FBQ3RDLFFBQUksVUFBVTtBQUNaLFlBQU0sSUFBSSxjQUFjLFNBQVMsQ0FBQyxDQUFFO0FBQ3BDLFVBQUksTUFBTSxNQUFNO0FBQ2QsY0FBTSxLQUFLLFNBQVMsQ0FBQztBQUNyQixZQUFJLE9BQU8sT0FBTyxPQUFPLE1BQU07QUFDN0IsZ0JBQU0sTUFBTSxhQUFhLEdBQUcsSUFBSTtBQUFBLFFBQ2xDLE9BQU87QUFDTCxnQkFBTSxPQUFPLGFBQWEsR0FBRyxJQUFJO0FBQUEsUUFDbkM7QUFBQSxNQUNGO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFHQSxXQUFPO0FBQUEsRUFDVDtBQVNPLFdBQVMsaUJBQ2QsVUFDQSxNQUNpQjtBQUNqQixRQUFJLGFBQWEsUUFBUSxhQUFhLE9BQVcsUUFBTztBQUN4RCxRQUFJLElBQUksbUJBQW1CLE9BQU8sUUFBUSxFQUFFLEtBQUssQ0FBQztBQUNsRCxRQUFJLGFBQTRCO0FBQ2hDLFVBQU0sS0FBSyxFQUFFLE1BQU0sYUFBYTtBQUNoQyxRQUFJLElBQUk7QUFDTixtQkFBYSxHQUFHLENBQUMsS0FBSztBQUN0QixXQUFLLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSztBQUFBLElBQ3pCO0FBQ0EsVUFBTSxJQUFJLGNBQWMsRUFBRSxRQUFRLE1BQU0sRUFBRSxDQUFDO0FBQzNDLFFBQUksTUFBTSxLQUFNLFFBQU87QUFFdkIsVUFBTSxXQUFXLE9BQU8sSUFBSTtBQUM1QixVQUFNLE1BQWdCO0FBQUEsTUFDcEIsT0FBTztBQUFBLE1BQ1AsUUFBUTtBQUFBLElBQ1Y7QUFJQSxRQUFJLE1BQU07QUFDUixVQUFJLE9BQU87QUFBQSxJQUNiO0FBQ0EsUUFBSSxhQUFhLE1BQU07QUFDckIsVUFBSSxPQUFPO0FBQUEsSUFDYjtBQUNBLFFBQUksWUFBWTtBQUNkLFVBQUksYUFBYTtBQUFBLElBQ25CO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFJQSxXQUFTLFlBQVksR0FBbUI7QUFDdEMsV0FBTyxFQUFFLFFBQVEsdUJBQXVCLE1BQU07QUFBQSxFQUNoRDs7O0FDcFdBLE1BQU0sbUJBQTBDO0FBQUEsSUFDOUM7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUVBLFdBQVMsaUJBQWlCLFNBQWlCLE1BQXVCO0FBQ2hFLFVBQU0sV0FBVyxHQUFHLE9BQU8sSUFBSSxJQUFJLEdBQUcsWUFBWTtBQUNsRCxXQUFPLGlCQUFpQixLQUFLLENBQUMsT0FBTyxTQUFTLFNBQVMsRUFBRSxDQUFDO0FBQUEsRUFDNUQ7QUFJQSxNQUFNLGtCQUFrQjtBQUV4QixXQUFTLFlBQVksR0FBb0I7QUFDdkMsYUFBUyxJQUFJLEdBQUcsSUFBSSxFQUFFLFFBQVEsS0FBSztBQUNqQyxVQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksSUFBSyxRQUFPO0FBQUEsSUFDcEM7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUVBLFdBQVNDLGFBQVksR0FBbUI7QUFDdEMsV0FBTyxFQUFFLFFBQVEsdUJBQXVCLE1BQU07QUFBQSxFQUNoRDtBQWNBLFdBQVMsZ0JBQWdCLEtBQWEsVUFBMkI7QUFDL0QsVUFBTSxJQUFJLElBQUksWUFBWTtBQUMxQixRQUFJLFlBQVksR0FBRyxHQUFHO0FBQ3BCLGFBQU8sSUFBSSxPQUFPLE1BQU1BLGFBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLFFBQVE7QUFBQSxJQUM1RDtBQUNBLFdBQU8sU0FBUyxTQUFTLENBQUM7QUFBQSxFQUM1QjtBQVNBLFdBQVMsa0JBQ1AsVUFDQSxPQUNlO0FBQ2YsUUFBSSxZQUEyQjtBQUMvQixRQUFJLGFBQWE7QUFDakIsZUFBVyxDQUFDLEtBQUssS0FBSyxLQUFLLE9BQU8sUUFBUSxLQUFLLEdBQUc7QUFDaEQsVUFBSSxJQUFJLFNBQVMsY0FBYyxnQkFBZ0IsS0FBSyxRQUFRLEdBQUc7QUFDN0Qsb0JBQVk7QUFDWixxQkFBYSxJQUFJO0FBQUEsTUFDbkI7QUFBQSxJQUNGO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFTTyxXQUFTLFVBQVUsTUFBYyxTQUFnQztBQUV0RSxRQUFJLFFBQVEsUUFBUSxnQkFBZ0IsQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLEdBQUc7QUFDbEUsYUFBTyxhQUFhLElBQUksS0FBSztBQUFBLElBQy9CO0FBRUEsVUFBTSxXQUFXLEdBQUcsSUFBSSxJQUFJLE9BQU8sR0FBRyxZQUFZO0FBR2xELFFBQUksUUFBUSxpQkFBaUI7QUFDM0IsWUFBTUMsT0FBTSxrQkFBa0IsVUFBVSxnQkFBZ0IsSUFBSSxDQUFFO0FBQzlELFVBQUlBLEtBQUssUUFBT0E7QUFBQSxJQUNsQjtBQUdBLFVBQU0sTUFBTSxrQkFBa0IsVUFBVSxTQUFTO0FBQ2pELFFBQUksSUFBSyxRQUFPO0FBR2hCLFFBQUksUUFBUSxRQUFRLGNBQWM7QUFDaEMsYUFBTyxhQUFhLElBQUksS0FBSztBQUFBLElBQy9CO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFNTyxXQUFTLGFBQ2QsTUFDQSxTQUNBLE9BQzBCO0FBQzFCLFVBQU0sVUFBb0MsQ0FBQztBQUMzQyxRQUFJLE9BQU87QUFDVCxjQUFRLEtBQUs7QUFBQSxRQUNYLFFBQVE7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFNBQVMsY0FBYyxLQUFLLEtBQUs7QUFBQSxNQUNuQyxDQUFDO0FBQUEsSUFDSDtBQUNBLFVBQU0sV0FBVyxRQUFRLElBQUksS0FBSztBQUNsQyxRQUFJLFdBQVcsZ0JBQWdCLEtBQUssT0FBTyxHQUFHO0FBQzVDLGNBQVEsS0FBSztBQUFBLFFBQ1gsUUFBZ0I7QUFBQSxRQUNoQixNQUFNO0FBQUEsUUFDTjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0gsT0FBTztBQUNMLGNBQVEsS0FBSztBQUFBLFFBQ1gsUUFBZ0I7QUFBQSxRQUNoQixNQUFNLFdBQVc7QUFBQSxRQUNqQjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUlBLE1BQU0sYUFBYTtBQUVuQixXQUFTLGFBQWEsTUFBYyxTQUF5QztBQUMzRSxXQUFPLEVBQUUsUUFBUSxZQUFZLE1BQU0sUUFBUTtBQUFBLEVBQzdDO0FBRUEsTUFBTSxlQUFpRDtBQUFBLElBQ3JELE1BQU0sQ0FBQyxLQUFLLE1BQU07QUFBQSxJQUNsQixLQUFLLENBQUMsS0FBSyxLQUFLO0FBQUEsSUFDaEIsUUFBUSxDQUFDLEtBQUssUUFBUTtBQUFBLElBQ3RCLFVBQVUsQ0FBQyxNQUFNLG1CQUFtQjtBQUFBLElBQ3BDLFVBQVUsQ0FBQyxLQUFLLFVBQVU7QUFBQSxJQUMxQixVQUFVLENBQUMsT0FBTyxVQUFVO0FBQUEsSUFDNUIsVUFBVSxDQUFDLE9BQU8sVUFBVTtBQUFBLEVBQzlCO0FBRU8sV0FBUyxrQkFDZCxRQUMrQjtBQUMvQixVQUFNLE9BQU8sVUFBVSxJQUFJLFlBQVk7QUFDdkMsVUFBTSxRQUFRLGFBQWEsR0FBRztBQUM5QixRQUFJLENBQUMsTUFBTyxRQUFPO0FBQ25CLFdBQU8sYUFBYSxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUFBLEVBQ3hDO0FBR0EsTUFBTSxjQUNKO0FBR0YsTUFBTSxjQUNKO0FBRUYsV0FBUyxvQkFBb0IsTUFBcUM7QUFDaEUsUUFBSSxTQUFTLFFBQVEsU0FBUyxPQUFXLFFBQU87QUFDaEQsUUFBSSxJQUFJLE9BQU8sSUFBSSxFQUFFLEtBQUs7QUFDMUIsUUFBSSxFQUFFLFdBQVcsR0FBRyxLQUFLLEVBQUUsU0FBUyxHQUFHLEdBQUc7QUFDeEMsVUFBSSxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUUsS0FBSztBQUFBLElBQzFCO0FBQ0EsUUFBSSxDQUFDLEVBQUcsUUFBTztBQUNmLFFBQUksWUFBWSxLQUFLLENBQUMsRUFBRyxRQUFPO0FBQ2hDLFFBQUksWUFBWSxLQUFLLENBQUMsRUFBRyxRQUFPO0FBQ2hDLFdBQU87QUFBQSxFQUNUO0FBRU8sV0FBUyxxQkFDZCxVQUNBLEtBQ0EsSUFDK0I7QUFFL0IsUUFBSSxPQUFPLE9BQU8sSUFBSSxVQUFVLFlBQVksSUFBSTtBQUM5QyxZQUFNLElBQUksSUFBSTtBQUNkLFlBQU0sS0FBSyxHQUFHLEtBQUs7QUFDbkIsWUFBTSxLQUFLLEdBQUcsTUFBTTtBQUNwQixVQUFJLE9BQU8sT0FBTyxZQUFZLElBQUksR0FBSSxRQUFPLGFBQWEsS0FBSyxNQUFNO0FBQ3JFLFVBQUksT0FBTyxPQUFPLFlBQVksSUFBSSxHQUFJLFFBQU8sYUFBYSxLQUFLLEtBQUs7QUFDcEUsVUFBSSxPQUFPLE9BQU8sWUFBWSxPQUFPLE9BQU8sU0FBVSxRQUFPLGFBQWEsS0FBSyxRQUFRO0FBQ3ZGLGFBQU87QUFBQSxJQUNUO0FBR0EsVUFBTSxVQUFVLG9CQUFvQixRQUFRO0FBQzVDLFVBQU0sVUFBVSxJQUFJLFFBQVE7QUFDNUIsVUFBTSxVQUFVLG9CQUFvQixPQUFPO0FBQzNDLFFBQUksWUFBWSxLQUFNLFFBQU87QUFDN0IsUUFBSSxZQUFZLE9BQU87QUFDckIsVUFBSSxZQUFZLE1BQU8sUUFBTyxhQUFhLEtBQUssVUFBVTtBQUMxRCxVQUFJLFlBQVksTUFBTyxRQUFPLGFBQWEsS0FBSyxRQUFRO0FBQUEsSUFDMUQ7QUFDQSxXQUFPLFlBQVksUUFBUSxhQUFhLE9BQU8sVUFBVSxJQUFJLGFBQWEsT0FBTyxVQUFVO0FBQUEsRUFDN0Y7QUFJQSxNQUFNLGVBQXVDO0FBQUE7QUFBQSxJQUUzQyxnQ0FBTztBQUFBLElBQ1AsZ0NBQU87QUFBQSxJQUNQLGdDQUFPO0FBQUEsSUFDUCx1QkFBdUI7QUFBQSxJQUN2QixPQUFPO0FBQUEsSUFDUCxLQUFLO0FBQUEsSUFDTCwwQkFBTTtBQUFBLElBQ04sbUJBQW1CO0FBQUEsSUFDbkIsb0JBQUs7QUFBQSxJQUNMLGNBQUk7QUFBQSxJQUNKLFNBQVM7QUFBQTtBQUFBLElBRVQsZ0NBQU87QUFBQSxJQUNQLG9CQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxnQ0FBTztBQUFBLElBQ1Asb0JBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLG9CQUFLO0FBQUEsSUFDTCxZQUFZO0FBQUEsSUFDWixLQUFLO0FBQUEsSUFDTCwwQkFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osS0FBSztBQUFBLElBQ0wsb0JBQUs7QUFBQSxJQUNMLFVBQVU7QUFBQSxJQUNWLEtBQUs7QUFBQTtBQUFBLElBRUwsOERBQVk7QUFBQSxJQUNaLGtEQUFVO0FBQUEsSUFDViw0Q0FBUztBQUFBLElBQ1QsNENBQVM7QUFBQSxJQUNULDRDQUFTO0FBQUEsSUFDVCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUE7QUFBQSxJQUVMLHNDQUFRO0FBQUEsSUFDUiw0Q0FBUztBQUFBLElBQ1Qsc0NBQVE7QUFBQSxJQUNSLHNDQUFRO0FBQUEsSUFDUixvQkFBSztBQUFBLElBQ0wsb0JBQUs7QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxJQUNaLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxJQUNaLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQTtBQUFBLElBRVYsbUJBQW1CO0FBQUEsSUFDbkIsbUJBQW1CO0FBQUEsSUFDbkIsbUJBQW1CO0FBQUEsSUFDbkIsbUJBQW1CO0FBQUEsSUFDbkIsc0NBQVE7QUFBQSxJQUNSLHNDQUFRO0FBQUEsSUFDUix3REFBVztBQUFBLElBQ1gsd0RBQVc7QUFBQSxJQUNYLHNDQUFRO0FBQUEsSUFDUiwwQkFBTTtBQUFBLElBQ04saUJBQWlCO0FBQUEsSUFDakIsVUFBVTtBQUFBLElBQ1YscUJBQXFCO0FBQUEsSUFDckIsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sZ0NBQU87QUFBQSxJQUNQLGNBQWM7QUFBQSxJQUNkLFNBQVM7QUFBQSxJQUNULEtBQUs7QUFBQSxJQUNMLHNDQUFRO0FBQUEsSUFDUixpQkFBaUI7QUFBQSxJQUNqQixTQUFTO0FBQUEsSUFDVCxLQUFLO0FBQUEsSUFDTCxzQ0FBUTtBQUFBO0FBQUEsSUFFUixnQ0FBTztBQUFBLElBQ1Asb0JBQW9CO0FBQUEsSUFDcEIsaUJBQWlCO0FBQUEsSUFDakIsZ0JBQWdCO0FBQUEsSUFDaEIsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1Ysb0JBQUs7QUFBQSxJQUNMLG9CQUFLO0FBQUEsSUFDTCxpQkFBaUI7QUFBQSxJQUNqQixZQUFZO0FBQUEsSUFDWixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixvQkFBSztBQUFBLElBQ0wsS0FBSztBQUFBLElBQ0wsMEJBQU07QUFBQSxJQUNOLGdDQUFPO0FBQUEsSUFDUCxvQkFBSztBQUFBLElBQ0wsY0FBSTtBQUFBLElBQ0osYUFBYTtBQUFBLElBQ2IsV0FBVztBQUFBO0FBQUEsSUFFWCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxvQkFBSztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsb0JBQUs7QUFBQSxJQUNMLFNBQVM7QUFBQTtBQUFBLElBRVQsc0NBQVE7QUFBQSxJQUNSLFVBQVU7QUFBQSxJQUNWLEtBQUs7QUFBQSxJQUNMLGNBQUk7QUFBQTtBQUFBLElBRUosc0NBQVE7QUFBQSxJQUNSLEtBQUs7QUFBQSxJQUNMLHNDQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxLQUFLO0FBQUE7QUFBQSxJQUVMLGlDQUFRO0FBQUEsSUFDUixzQkFBc0I7QUFBQSxJQUN0QixLQUFLO0FBQUEsSUFDTCxVQUFVO0FBQUEsSUFDViw0Q0FBUztBQUFBLElBQ1QsS0FBSztBQUFBLElBQ0wsb0JBQUs7QUFBQSxJQUNMLFVBQVU7QUFBQSxJQUNWLGNBQUk7QUFBQSxJQUNKLFFBQVE7QUFBQSxJQUNSLHVCQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsSUFDZixvQkFBSztBQUFBLElBQ0wsVUFBVTtBQUFBLElBQ1YsY0FBSTtBQUFBLElBQ0osS0FBSztBQUFBLElBQ0wsZ0NBQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLGNBQUk7QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULHNDQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsRUFDUDtBQUdBLE1BQU0sMEJBQTBCLE9BQU8sS0FBSyxZQUFZLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNO0FBRXJGLFdBQVMsZ0JBQWdCLFNBQTRDO0FBQzFFLFFBQUksQ0FBQyxRQUFTLFFBQU87QUFDckIsVUFBTSxJQUFJLFFBQVEsS0FBSztBQUN2QixRQUFJLENBQUMsRUFBRyxRQUFPO0FBQ2YsVUFBTSxTQUFTLEVBQUUsWUFBWTtBQUM3QixlQUFXLE9BQU8seUJBQXlCO0FBQ3pDLFlBQU0sS0FBSyxJQUFJLFlBQVk7QUFDM0IsVUFBSSxZQUFZLEVBQUUsR0FBRztBQUVuQixZQUFJLElBQUksT0FBTyxNQUFNRCxhQUFZLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxNQUFNLEdBQUc7QUFDcEQsaUJBQU8sYUFBYSxHQUFHO0FBQUEsUUFDekI7QUFBQSxNQUNGLFdBQVcsT0FBTyxTQUFTLEVBQUUsR0FBRztBQUM5QixlQUFPLGFBQWEsR0FBRztBQUFBLE1BQ3pCO0FBQUEsSUFDRjtBQUNBLFdBQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxRQUFRLEdBQUcsRUFBRSxLQUFLO0FBQUEsRUFDbkQ7QUFJQSxXQUFTRSxVQUFTLEdBQW1CO0FBQ25DLFFBQUksQ0FBQyxFQUFHLFFBQU87QUFDZixRQUFJLElBQUk7QUFDUixlQUFXLE1BQU0sR0FBRztBQUNsQixZQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSztBQUNoQyxVQUFJLE1BQU0sU0FBVSxNQUFNLE1BQVE7QUFBQSxJQUNwQztBQUNBLFdBQU87QUFBQSxFQUNUO0FBRUEsV0FBUyxrQkFBa0IsR0FBb0I7QUFDN0MsUUFBSSxRQUFRO0FBQ1osZUFBVyxNQUFNLEdBQUc7QUFDbEIsWUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO0FBQzFCLFVBQUksS0FBSyxPQUFPLFdBQVcsS0FBSyxFQUFFLEVBQUc7QUFBQSxJQUN2QztBQUNBLFdBQU8sU0FBUyxLQUFLQSxVQUFTLENBQUMsTUFBTTtBQUFBLEVBQ3ZDO0FBRUEsV0FBUyx1QkFBdUIsR0FBb0I7QUFDbEQsUUFBSSxNQUFNLFFBQVEsTUFBTSxPQUFXLFFBQU87QUFDMUMsUUFBSSxJQUFJLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxZQUFZO0FBQ3JDLFFBQUksRUFBRSxRQUFRLGNBQWMsRUFBRSxFQUFFLEtBQUs7QUFDckMsUUFBSSxFQUFFLFFBQVEsUUFBUSxHQUFHO0FBQ3pCLFdBQU87QUFBQSxFQUNUO0FBRUEsV0FBUyxrQkFBa0IsT0FBeUI7QUFDbEQsUUFBSSxVQUFVLFFBQVEsVUFBVSxPQUFXLFFBQU87QUFDbEQsVUFBTSxJQUFJLE9BQU8sS0FBSyxFQUFFLEtBQUs7QUFDN0IsV0FBTyxNQUFNLE1BQU0sTUFBTSxZQUFPLE1BQU0sT0FBTyxNQUFNLFNBQVMsTUFBTTtBQUFBLEVBQ3BFO0FBRUEsTUFBTSxxQkFBcUIsb0JBQUksSUFBSTtBQUFBLElBQ2pDO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRixDQUFDO0FBRUQsV0FBUyxpQkFBaUIsT0FBcUQ7QUFDN0UsVUFBTSxVQUFVLG9CQUFJLElBQW1DO0FBQ3ZELGVBQVcsTUFBTSxPQUFPO0FBQ3RCLFlBQU0sSUFBSSx1QkFBdUIsR0FBRyxLQUFLO0FBQ3pDLFlBQU0sUUFBUSxRQUFRLElBQUksQ0FBQztBQUMzQixVQUFJLE1BQU8sT0FBTSxLQUFLLEVBQUU7QUFBQSxVQUNuQixTQUFRLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUFBLElBQzFCO0FBQ0EsVUFBTSxNQUE2QixDQUFDO0FBQ3BDLGVBQVcsU0FBUyxRQUFRLE9BQU8sR0FBRztBQUNwQyxVQUFJLE1BQU0sV0FBVyxHQUFHO0FBQ3RCLFlBQUksS0FBSyxNQUFNLENBQUMsQ0FBRTtBQUNsQjtBQUFBLE1BQ0Y7QUFDQSxZQUFNLFdBQVcsTUFBTSxPQUFPLENBQUMsTUFBTUEsVUFBUyxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDO0FBQzNFLFlBQU0sVUFBVSxNQUFNLE9BQU8sQ0FBQyxNQUFNLGtCQUFrQixPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUM5RSxVQUFJLFNBQVMsU0FBUyxLQUFLLFFBQVEsU0FBUyxHQUFHO0FBQzdDLFlBQUksS0FBSyxRQUFRLENBQUMsQ0FBRTtBQUFBLE1BQ3RCLE9BQU87QUFDTCxZQUFJLEtBQUssR0FBRyxLQUFLO0FBQUEsTUFDbkI7QUFBQSxJQUNGO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFFQSxXQUFTLGNBQWMsVUFBd0M7QUFDN0QsVUFBTSxNQUE2QixDQUFDO0FBQ3BDLGVBQVcsT0FBTyxVQUFVO0FBQzFCLFVBQUksQ0FBQyxPQUFPLE9BQU8sUUFBUSxTQUFVO0FBQ3JDLFlBQU0sVUFBVSxJQUFJLFdBQVcsSUFBSSxRQUFRO0FBQzNDLFVBQUksaUJBQWlCLFNBQVMsSUFBSSxRQUFRLEVBQUUsRUFBRztBQUMvQyxZQUFNLFFBQVEsSUFBSTtBQUNsQixZQUFNLFVBQVUsSUFBSSxrQkFBa0IsSUFBSSxTQUFTLEVBQUUsWUFBWTtBQUNqRSxZQUFNLFdBQVcsa0JBQWtCLEtBQUs7QUFDeEMsWUFBTSxzQkFBc0IsbUJBQW1CLElBQUksTUFBTTtBQUN6RCxVQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFxQjtBQUN2QyxVQUFJLEtBQUssR0FBRztBQUFBLElBQ2Q7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUVBLFdBQVMsa0JBQWtCLE9BQXFEO0FBQzlFLFVBQU0sWUFBWSxDQUFDLFFBQ2YsR0FBRyxjQUF5QixJQUFJLEtBQUssRUFBRSxZQUFZO0FBRXZELFVBQU0sUUFBUSxvQkFBSSxJQUFpQztBQUNuRCxRQUFJLGFBQWE7QUFDakIsZUFBVyxRQUFRLE9BQU87QUFDeEIsWUFBTSxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUUsRUFBRSxLQUFLO0FBQ3hDLFlBQU0sUUFBUyxLQUFLLFFBQW1CLElBQUksS0FBSztBQUNoRCxVQUFJLENBQUMsR0FBRztBQUNOLGNBQU0sSUFBSSxnQkFBZ0IsWUFBWSxJQUFJLElBQUk7QUFDOUM7QUFBQSxNQUNGO0FBQ0EsWUFBTSxNQUFNO0FBQUEsUUFDVCxLQUFLLFFBQW1CO0FBQUEsUUFDekIsRUFBRSxZQUFZO0FBQUEsUUFDZCxLQUFLLFlBQVk7QUFBQSxRQUNqQixVQUFVLElBQUk7QUFBQSxNQUNoQixFQUFFLEtBQUssR0FBRztBQUNWLFlBQU0sV0FBVyxNQUFNLElBQUksR0FBRztBQUM5QixVQUFJLENBQUMsVUFBVTtBQUNiLGNBQU0sSUFBSSxLQUFLLElBQUk7QUFDbkI7QUFBQSxNQUNGO0FBRUEsVUFBSTtBQUNKLFVBQUk7QUFDSixVQUFJQSxVQUFTLEtBQUssV0FBVyxFQUFFLElBQUlBLFVBQVMsU0FBUyxXQUFXLEVBQUUsR0FBRztBQUNuRSxrQkFBVTtBQUNWLG9CQUFZO0FBQUEsTUFDZCxPQUFPO0FBQ0wsa0JBQVU7QUFDVixvQkFBWTtBQUFBLE1BQ2Q7QUFDQSxZQUFNLFNBQThCLEVBQUUsR0FBRyxRQUFRO0FBQ2pELGlCQUFXLEtBQUssQ0FBQyxjQUFjLGNBQWMsWUFBWSxNQUFNLEdBQUc7QUFDaEUsWUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQyxFQUFHLFFBQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQztBQUFBLE1BQ3pEO0FBQ0EsWUFBTSxJQUFJLEtBQUssTUFBTTtBQUFBLElBQ3ZCO0FBQ0EsV0FBTyxNQUFNLEtBQUssTUFBTSxPQUFPLENBQUM7QUFBQSxFQUNsQztBQVVBLFdBQVMsZUFBZSxPQUFxRDtBQUMzRSxVQUFNLFFBQVEsb0JBQUksSUFHaEI7QUFDRixVQUFNLGNBQXFDLENBQUM7QUFDNUMsZUFBVyxNQUFNLE9BQU87QUFDdEIsWUFBTSxPQUFPLE9BQU8sR0FBRyxXQUFXLEVBQUUsRUFBRSxZQUFZO0FBQ2xELFlBQU0sTUFBTSxHQUFHLEdBQUcsUUFBUSxFQUFFLElBQUksR0FBRyxZQUFZLEVBQUU7QUFDakQsVUFBSSxLQUFLLFNBQVMseUJBQXlCLEdBQUc7QUFDNUMsY0FBTSxJQUFJLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQztBQUM3QixVQUFFLFdBQVc7QUFDYixjQUFNLElBQUksS0FBSyxDQUFDO0FBQUEsTUFDbEIsV0FBVyxLQUFLLFNBQVMsMEJBQTBCLEdBQUc7QUFDcEQsY0FBTSxJQUFJLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQztBQUM3QixVQUFFLFlBQVk7QUFDZCxjQUFNLElBQUksS0FBSyxDQUFDO0FBQUEsTUFDbEIsT0FBTztBQUNMLG9CQUFZLEtBQUssRUFBRTtBQUFBLE1BQ3JCO0FBQUEsSUFDRjtBQUVBLGVBQVcsU0FBUyxNQUFNLE9BQU8sR0FBRztBQUNsQyxZQUFNLElBQUksTUFBTTtBQUNoQixZQUFNLElBQUksTUFBTTtBQUNoQixZQUFNLFVBQVUsS0FBSztBQUNyQixVQUFJLENBQUMsUUFBUztBQUNkLFlBQU0sYUFBNEIsQ0FBQztBQUNuQyxZQUFNLFNBQVMsQ0FBQyxLQUFzQyxPQUFlLFlBQW9CO0FBQ3ZGLFlBQUksQ0FBQyxJQUFLO0FBQ1YsY0FBTSxNQUFNLElBQUk7QUFDaEIsWUFBSSxRQUFRLFFBQVEsUUFBUSxVQUFhLFFBQVEsTUFBTSxRQUFRLE9BQU8sUUFBUSxTQUFLO0FBQ25GLGNBQU0sTUFBTSxPQUFPLFdBQVcsT0FBTyxHQUFHLEVBQUUsUUFBUSxNQUFNLEVBQUUsQ0FBQztBQUMzRCxZQUFJLENBQUMsT0FBTyxTQUFTLEdBQUcsRUFBRztBQUMzQixtQkFBVyxLQUFLO0FBQUEsVUFDZDtBQUFBLFVBQ0E7QUFBQSxVQUNBLE9BQU87QUFBQSxVQUNQLE1BQU0sSUFBSSxRQUFRO0FBQUEsVUFDbEIscUJBQXFCLElBQUksbUJBQW1CO0FBQUEsUUFDOUMsQ0FBQztBQUFBLE1BQ0g7QUFDQSxhQUFPLEdBQUcsVUFBVSx5QkFBeUI7QUFDN0MsYUFBTyxHQUFHLFVBQVUsMEJBQTBCO0FBQzlDLFVBQUksV0FBVyxXQUFXLEVBQUc7QUFDN0IsWUFBTSxXQUFnQyxFQUFFLEdBQUcsUUFBUTtBQUNuRCxlQUFTLFVBQVU7QUFDbkIsZUFBUyxPQUFPO0FBQ2hCLGVBQVMsYUFBYTtBQUN0QixlQUFTLGFBQWE7QUFDdEIsZUFBUyxXQUFXO0FBQ3BCLGVBQVMsZ0JBQWdCO0FBQ3pCLGVBQVMsaUJBQWlCO0FBQzFCLGVBQVMsUUFBUTtBQUNqQixlQUFTLE9BQU87QUFDaEIsa0JBQVksS0FBSyxRQUFRO0FBQUEsSUFDM0I7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUlBLE1BQU0saUJBQWtEO0FBQUEsSUFDdEQsQ0FBQyxvQkFBb0IsT0FBTztBQUFBLElBQzVCLENBQUMsNENBQTRDLE9BQU87QUFBQSxJQUNwRCxDQUFDLGFBQWEsUUFBUTtBQUFBLElBQ3RCLENBQUMsMEJBQTBCLHFCQUFxQjtBQUFBLElBQ2hELENBQUMsZUFBZSxlQUFlO0FBQUEsSUFDL0IsQ0FBQywwQkFBMEIsa0JBQWtCO0FBQUEsSUFDN0MsQ0FBQyx1Q0FBdUMsa0JBQWtCO0FBQUEsSUFDMUQsQ0FBQywrQkFBK0IsZ0JBQWdCO0FBQUEsSUFDaEQsQ0FBQyxnQkFBZ0IsZ0JBQWdCO0FBQUEsSUFDakMsQ0FBQyxxQkFBcUIsYUFBYTtBQUFBLEVBQ3JDO0FBRUEsV0FBUyxpQkFBaUIsT0FBd0Q7QUFDaEYsVUFBTSxPQUFPLE1BQ1YsT0FBTyxDQUFDLE1BQW1CLFFBQVEsQ0FBQyxDQUFDLEVBQ3JDLEtBQUssR0FBRyxFQUNSLFlBQVk7QUFDZixRQUFJLENBQUMsS0FBTSxRQUFPO0FBQ2xCLGVBQVcsQ0FBQyxTQUFTLEtBQUssS0FBSyxnQkFBZ0I7QUFDN0MsVUFBSSxRQUFRLEtBQUssSUFBSSxFQUFHLFFBQU87QUFBQSxJQUNqQztBQUNBLFdBQU87QUFBQSxFQUNUO0FBSU8sV0FBUyxlQUNkLEtBQ0EsV0FDNEI7QUFDNUIsVUFBTSxVQUFVLElBQUksV0FBVyxJQUFJLFFBQVE7QUFDM0MsVUFBTSxPQUFPLElBQUksUUFBUTtBQUN6QixRQUFJLGlCQUFpQixTQUFTLElBQUksRUFBRyxRQUFPO0FBRTVDLFVBQU0sUUFBUSxJQUFJO0FBQ2xCLFVBQU0sVUFBVSxJQUFJLGtCQUFrQixJQUFJLFNBQVMsRUFBRSxZQUFZO0FBQ2pFLFVBQU0sV0FBVyxrQkFBa0IsS0FBSztBQUN4QyxVQUFNLHNCQUFzQixtQkFBbUIsSUFBSSxNQUFNO0FBQ3pELFFBQUksQ0FBQyxZQUFZLENBQUMsb0JBQXFCLFFBQU87QUFFOUMsVUFBTSxRQUFRLFNBQVMsV0FBVyxNQUFNLElBQUksUUFBUSxFQUFFO0FBQ3RELFVBQU0sUUFBUSxVQUFVLE1BQU0sT0FBTztBQUVyQyxVQUFNLFdBQWdDO0FBQUEsTUFDcEMsY0FBYztBQUFBLE1BQ2QsSUFBSTtBQUFBLE1BQ0osTUFBTSxFQUFFLFdBQVcsS0FBSyxRQUFRLDBCQUEwQjtBQUFBLE1BQzFELFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNSO0FBQUEsVUFDRSxRQUFRO0FBQUEsWUFDTjtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLFlBQ1g7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKLFFBQVEsYUFBYSxNQUFNLFNBQVMsS0FBSztBQUFBLFFBQ3pDLE1BQU0sV0FBVztBQUFBLE1BQ25CO0FBQUEsTUFDQSxTQUFTLEVBQUUsV0FBVyxXQUFXLFNBQVMsR0FBRztBQUFBLElBQy9DO0FBT0EsUUFBSSxJQUFJLGdCQUFnQjtBQUN0QixlQUFTLEtBQUssTUFBTTtBQUFBLFFBQ2xCO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixNQUFNLE9BQU8sSUFBSSxjQUFjO0FBQUEsUUFDakM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVBLFFBQUksSUFBSSxNQUFNO0FBQ1osZUFBUyxvQkFBb0IsR0FBRyxJQUFJLElBQUk7QUFBQSxJQUMxQztBQUVBLFFBQUksVUFBVTtBQUNaLFlBQU0sTUFBTSxpQkFBaUIsT0FBTyxLQUFLLEdBQUcsSUFBSSxRQUFRLEVBQUU7QUFDMUQsVUFBSSxJQUFLLFVBQVMsZ0JBQWdCO0FBQUEsVUFDN0IsVUFBUyxjQUFjLE9BQU8sS0FBSztBQUFBLElBQzFDO0FBRUEsUUFBSSxJQUFJLGlCQUFpQjtBQUN2QixZQUFNLEtBQUssV0FBVyxPQUFPLElBQUksZUFBZSxHQUFHLElBQUksUUFBUSxFQUFFO0FBQ2pFLFVBQUksR0FBSSxVQUFTLGlCQUFpQixDQUFDLEVBQUU7QUFBQSxJQUN2QztBQUVBLFVBQU0scUJBQ0osa0JBQWtCLE1BQU0sS0FDeEI7QUFBQSxNQUNFLFVBQVUsUUFBUSxVQUFVLFNBQVksT0FBTyxLQUFLLElBQUk7QUFBQSxNQUN4RCxTQUFTO0FBQUEsTUFDUixTQUFTLGlCQUE4QyxDQUFDO0FBQUEsSUFDM0Q7QUFDRixRQUFJLG9CQUFvQjtBQUN0QixlQUFTLGlCQUFpQixDQUFDLEVBQUUsUUFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUM7QUFBQSxJQUM3RDtBQUVBLFdBQU87QUFBQSxFQUNUO0FBSUEsV0FBUyxpQkFDUCxLQUNBLFdBQ0EsV0FDNEI7QUFFNUIsUUFBSSxJQUFJLGVBQWU7QUFDckIsWUFBTSxPQUFPLElBQUksUUFBUTtBQUN6QixZQUFNLFdBQVcsSUFBSSxZQUFZO0FBQ2pDLFlBQU1DLFNBQVEsU0FBUyxXQUFXLE9BQU8sWUFBWSxNQUFNLFFBQVE7QUFDbkUsWUFBTSxxQkFBNEIsQ0FBQztBQUNuQyxpQkFBVyxLQUFLLElBQUksZUFBZ0M7QUFDbEQsY0FBTSxNQUFnQjtBQUFBLFVBQ3BCLE9BQU8sRUFBRTtBQUFBLFVBQ1QsTUFBTSxFQUFFLFFBQVE7QUFBQSxVQUNoQixRQUFRO0FBQUEsVUFDUixNQUFNLE9BQU8sRUFBRSxJQUFJLEtBQUs7QUFBQSxRQUMxQjtBQUNBLDJCQUFtQixLQUFLO0FBQUEsVUFDdEIsTUFBTTtBQUFBLFlBQ0osUUFBUSxDQUFDLEVBQUUsUUFBUSxvQkFBb0IsTUFBTSxFQUFFLE9BQU8sU0FBUyxFQUFFLFFBQVEsQ0FBQztBQUFBLFlBQzFFLE1BQU0sRUFBRTtBQUFBLFVBQ1Y7QUFBQSxVQUNBLGVBQWU7QUFBQSxRQUNqQixDQUFDO0FBQUEsTUFDSDtBQUNBLFlBQU0sUUFBNkI7QUFBQSxRQUNqQyxjQUFjO0FBQUEsUUFDZCxJQUFJQTtBQUFBLFFBQ0osTUFBTSxFQUFFLFdBQVcsS0FBSyxRQUFRLDBCQUEwQjtBQUFBLFFBQzFELFFBQVE7QUFBQSxRQUNSLFVBQVU7QUFBQSxVQUNSO0FBQUEsWUFDRSxRQUFRO0FBQUEsY0FDTjtBQUFBLGdCQUNFLFFBQVE7QUFBQSxnQkFDUixNQUFNO0FBQUEsZ0JBQ04sU0FBUztBQUFBLGNBQ1g7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLE1BQU07QUFBQSxVQUNKLFFBQVE7QUFBQSxZQUNOO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixNQUFNLElBQUksa0JBQWtCO0FBQUEsY0FDNUIsU0FBUztBQUFBLFlBQ1g7QUFBQSxVQUNGO0FBQUEsVUFDQSxNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0EsU0FBUyxFQUFFLFdBQVcsV0FBVyxTQUFTLEdBQUc7QUFBQSxRQUM3QyxXQUFXO0FBQUEsTUFDYjtBQUNBLFVBQUksS0FBTSxPQUFNLG9CQUFvQixHQUFHLElBQUk7QUFDM0MsVUFBSSxTQUFVLE9BQU0sWUFBWSxDQUFDLEVBQUUsU0FBUyxTQUFTLENBQUM7QUFDdEQsYUFBTztBQUFBLElBQ1Q7QUFFQSxVQUFNLFVBQVUsSUFBSSxXQUFXLElBQUksUUFBUTtBQUMzQyxVQUFNLFFBQVEsWUFBWSxPQUFPLFNBQVMsSUFBSSxPQUFPLElBQUksY0FBYyxJQUFJLFFBQVE7QUFDbkYsVUFBTSxRQUFRLElBQUk7QUFDbEIsVUFBTSxVQUFVLElBQUksa0JBQWtCLElBQUksU0FBUyxFQUFFLFlBQVk7QUFFakUsVUFBTSxZQUFZLGdCQUFnQixPQUFPLEtBQUs7QUFDOUMsVUFBTSxRQUFRLFNBQVMsV0FBVyxPQUFPLFdBQVcsSUFBSSxRQUFRLElBQUksSUFBSSxZQUFZLEVBQUU7QUFDdEYsVUFBTSxRQUFRLFVBQVUsTUFBTSxPQUFPO0FBRXJDLFVBQU0sVUFBVSxJQUFJLFlBQVk7QUFDaEMsVUFBTSxjQUFzQztBQUFBLE1BQzFDLFlBQVk7QUFBQSxNQUNaLGVBQWU7QUFBQSxNQUNmLFNBQVM7QUFBQSxNQUNULFdBQVc7QUFBQSxNQUNYLGtCQUFrQjtBQUFBLE1BQ2xCLFFBQVE7QUFBQSxNQUNSLE1BQU07QUFBQSxNQUNOLFNBQVM7QUFBQSxNQUNULFVBQVU7QUFBQSxJQUNaO0FBQ0EsVUFBTSxhQUNKLFlBQVksT0FBTyxLQUFLLFFBQVEsT0FBTyxDQUFDLEVBQUUsWUFBWSxJQUFJLFFBQVEsTUFBTSxDQUFDLEVBQUUsWUFBWTtBQUV6RixVQUFNLFdBQWdDO0FBQUEsTUFDcEMsY0FBYztBQUFBLE1BQ2QsSUFBSTtBQUFBLE1BQ0osTUFBTSxFQUFFLFdBQVcsS0FBSyxRQUFRLDBCQUEwQjtBQUFBLE1BQzFELFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNSO0FBQUEsVUFDRSxRQUFRO0FBQUEsWUFDTjtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLFlBQ1g7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKLFFBQVEsYUFBYSxNQUFNLFNBQVMsS0FBSztBQUFBLFFBQ3pDLE1BQU0sV0FBVztBQUFBLE1BQ25CO0FBQUEsTUFDQSxTQUFTLEVBQUUsV0FBVyxXQUFXLFNBQVMsR0FBRztBQUFBLElBQy9DO0FBRUEsUUFBSSxJQUFJLEtBQU0sVUFBUyxvQkFBb0IsR0FBRyxJQUFJLElBQUk7QUFDdEQsUUFBSSxJQUFJLFNBQVUsVUFBUyxZQUFZLENBQUMsRUFBRSxTQUFTLElBQUksU0FBUyxDQUFDO0FBQ2pFLFVBQU0sV0FBVyxjQUFjLElBQUksWUFBWSxJQUFJLFNBQVMsSUFBSSxJQUFJO0FBQ3BFLFFBQUksU0FBVSxVQUFTLFdBQVcsRUFBRSxTQUFTLFNBQVM7QUFFdEQsVUFBTSxXQUFXLGtCQUFrQixLQUFLO0FBQ3hDLFFBQUksVUFBVTtBQUNaLFlBQU0sTUFBTSxpQkFBaUIsT0FBTyxLQUFLLEdBQUcsSUFBSSxRQUFRLEVBQUU7QUFDMUQsVUFBSSxJQUFLLFVBQVMsZ0JBQWdCO0FBQUEsVUFDN0IsVUFBUyxjQUFjLE9BQU8sS0FBSztBQUFBLElBQzFDO0FBRUEsUUFBSSxJQUFJLGlCQUFpQjtBQUN2QixZQUFNLE1BQU0sZ0JBQWdCLE9BQU8sSUFBSSxlQUFlLEdBQUcsSUFBSSxRQUFRLEVBQUU7QUFDdkUsVUFBSSxJQUFJLFNBQVMsRUFBRyxVQUFTLGlCQUFpQjtBQUFBLElBQ2hEO0FBRUEsVUFBTSxxQkFDSixrQkFBa0IsTUFBTSxLQUN4QjtBQUFBLE1BQ0UsVUFBVSxRQUFRLFVBQVUsU0FBWSxPQUFPLEtBQUssSUFBSTtBQUFBLE1BQ3hELFNBQVM7QUFBQSxNQUNSLFNBQVMsaUJBQThDLENBQUM7QUFBQSxJQUMzRDtBQUNGLFFBQUksb0JBQW9CO0FBQ3RCLGVBQVMsaUJBQWlCLENBQUMsRUFBRSxRQUFRLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUFBLElBQzdEO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFJQSxXQUFTLGlCQUNQLFNBQ0EsV0FDdUI7QUFDdkIsUUFBSSxVQUFVLGtCQUFrQixPQUFPO0FBQ3ZDLGNBQVUsZUFBZSxPQUFPO0FBRWhDLFVBQU0sU0FBUyxvQkFBSSxJQUFtQztBQUN0RCxVQUFNLFVBQVUsb0JBQUksSUFBc0U7QUFDMUYsZUFBVyxPQUFPLFNBQVM7QUFDekIsWUFBTSxlQUFlLElBQUksY0FBYyxJQUFJLFFBQVEsSUFBSSxXQUFXO0FBQ2xFLFlBQU0sT0FBTyxJQUFJLFFBQVE7QUFDekIsWUFBTSxXQUFXLElBQUksWUFBWTtBQUNqQyxZQUFNLE1BQU0sR0FBRyxZQUFZLElBQUksSUFBSSxJQUFJLFFBQVE7QUFDL0MsWUFBTSxNQUFNLE9BQU8sSUFBSSxHQUFHO0FBQzFCLFVBQUksSUFBSyxLQUFJLEtBQUssR0FBRztBQUFBLFdBQ2hCO0FBQ0gsZUFBTyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDckIsZ0JBQVEsSUFBSSxLQUFLLEVBQUUsY0FBYyxPQUFPLFlBQVksR0FBRyxNQUFNLFNBQVMsQ0FBQztBQUFBLE1BQ3pFO0FBQUEsSUFDRjtBQUVBLFVBQU0sTUFBNkIsQ0FBQztBQUNwQyxlQUFXLENBQUMsS0FBSyxLQUFLLEtBQUssT0FBTyxRQUFRLEdBQUc7QUFDM0MsWUFBTSxPQUFPLFFBQVEsSUFBSSxHQUFHO0FBQzVCLFlBQU0sVUFBVSxpQkFBaUIsS0FBSztBQUV0QyxZQUFNLGVBQXNDLENBQUM7QUFDN0MsWUFBTSxhQUFhLG9CQUFJLElBQVk7QUFDbkMsaUJBQVcsTUFBTSxTQUFTO0FBQ3hCLGNBQU0sTUFBTSxpQkFBaUIsSUFBSSxXQUFXLEtBQUssWUFBWTtBQUM3RCxZQUFJLENBQUMsSUFBSztBQUNWLFlBQUksV0FBVyxJQUFJLElBQUksRUFBRSxFQUFHO0FBQzVCLG1CQUFXLElBQUksSUFBSSxFQUFFO0FBQ3JCLHFCQUFhLEtBQUssR0FBRztBQUFBLE1BQ3ZCO0FBQ0EsVUFBSSxhQUFhLFdBQVcsRUFBRztBQUcvQixZQUFNLFlBQVksUUFBUSxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQixHQUFHLFlBQVksZ0JBQWdCO0FBQzNGLFVBQUksV0FBVztBQUNiLFlBQUksS0FBSyxHQUFHLFlBQVk7QUFDeEI7QUFBQSxNQUNGO0FBRUEsWUFBTSxZQUFZLFFBQVEsS0FBSyxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsY0FBYztBQUNyRSxZQUFNLGFBQWEsTUFBTTtBQUFBLFFBQ3ZCLElBQUksSUFBSSxRQUFRLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQUEsTUFDckYsRUFBRSxLQUFLO0FBQ1AsWUFBTSxpQkFBaUIsV0FBVyxLQUFLLEdBQUcsS0FBSyxPQUFPLEtBQUssWUFBWTtBQUN2RSxZQUFNLE9BQU8sU0FBUyxXQUFXLE1BQU0sZ0JBQWdCLEtBQUssTUFBTSxLQUFLLFFBQVE7QUFFL0UsVUFBSTtBQUNKLFVBQUksUUFBUSxXQUFXLEdBQUc7QUFDeEIsY0FBTSxnQkFBZ0IsUUFBUSxDQUFDLEVBQUcsV0FBVztBQUM3QyxxQkFBYSxpQkFBaUIsYUFBYSxPQUFPLEtBQUssWUFBWTtBQUFBLE1BQ3JFLE9BQU87QUFDTCxxQkFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZO0FBQUEsTUFDcEQ7QUFFQSxZQUFNLGVBQWUsZ0JBQWdCLEtBQUssT0FBTyxLQUFLLFlBQVksS0FBSyxFQUFFLElBQzdELHlCQUNBO0FBRVosWUFBTSxLQUEwQjtBQUFBLFFBQzlCLGNBQWM7QUFBQSxRQUNkLElBQUk7QUFBQSxRQUNKLE1BQU0sRUFBRSxXQUFXLEtBQUssUUFBUSwwQkFBMEI7QUFBQSxRQUMxRCxRQUFRO0FBQUEsUUFDUixVQUFVO0FBQUEsVUFDUjtBQUFBLFlBQ0UsUUFBUTtBQUFBLGNBQ047QUFBQSxnQkFDRSxRQUFRO0FBQUEsZ0JBQ1IsTUFBTTtBQUFBLGdCQUNOLFNBQVM7QUFBQSxjQUNYO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQSxNQUFNO0FBQUEsVUFDSixRQUFRO0FBQUEsWUFDTjtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsTUFBTSxPQUFPLEtBQUssWUFBWSxLQUFLO0FBQUEsY0FDbkMsU0FBUztBQUFBLFlBQ1g7QUFBQSxVQUNGO0FBQUEsVUFDQSxNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0EsU0FBUyxFQUFFLFdBQVcsV0FBVyxTQUFTLEdBQUc7QUFBQSxRQUM3QyxRQUFRLGFBQWEsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRTtBQUFBLE1BQ3hFO0FBQ0EsVUFBSSxLQUFLLEtBQU0sSUFBRyxvQkFBb0IsR0FBRyxLQUFLLElBQUk7QUFDbEQsVUFBSSxLQUFLLFNBQVUsSUFBRyxZQUFZLENBQUMsRUFBRSxTQUFTLEtBQUssU0FBUyxDQUFDO0FBRTdELFVBQUksS0FBSyxFQUFFO0FBQ1gsVUFBSSxLQUFLLEdBQUcsWUFBWTtBQUFBLElBQzFCO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFFTyxXQUFTLHVCQUF1QixVQUFpQixXQUEwQztBQUNoRyxVQUFNLFVBQVUsY0FBYyxRQUFRO0FBQ3RDLFdBQU8saUJBQWlCLFNBQVMsU0FBUztBQUFBLEVBQzVDOzs7QUNwK0JBLFdBQVNDLFdBQVUsWUFBNkI7QUFDOUMsVUFBTSxJQUFJLE9BQU8sZUFBZSxXQUFXLFdBQVcsWUFBWSxJQUFJO0FBQ3RFLFFBQUksRUFBRSxTQUFTLFFBQVEsRUFBRyxRQUFlO0FBQ3pDLFFBQUksRUFBRSxTQUFTLEtBQUssRUFBRyxRQUFlO0FBQ3RDLFdBQWU7QUFBQSxFQUNqQjtBQUVPLFdBQVMsYUFDZCxLQUNBLFdBQzRCO0FBQzVCLFVBQU0sUUFBUyxJQUFJLFFBQW1CLElBQUksS0FBSztBQUMvQyxVQUFNLFlBQWEsSUFBSSxhQUF3QixJQUFJLEtBQUs7QUFDeEQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFVLFFBQU87QUFFL0IsVUFBTSxVQUFVLElBQUksV0FBVztBQUMvQixVQUFNLE9BQU8sSUFBSTtBQUNqQixVQUFNLFNBQVNBLFdBQVUsSUFBSSxVQUFVLEVBQUU7QUFFekMsVUFBTSxXQUFnQztBQUFBLE1BQ3BDLGNBQWM7QUFBQSxNQUNkLElBQUksU0FBUyxXQUFXLFFBQVEsU0FBUyxJQUFJLFFBQVEsRUFBRTtBQUFBLE1BQ3ZELE1BQU0sRUFBRSxXQUFXLEtBQUssUUFBUSwwQkFBMEI7QUFBQSxNQUMxRCxRQUFRLElBQUksVUFBVTtBQUFBLE1BQ3RCLFNBQVMsRUFBRSxXQUFXLFdBQVcsU0FBUyxHQUFHO0FBQUEsTUFDN0MsTUFBTTtBQUFBLFFBQ0osUUFBUSxDQUFDLEVBQUUsUUFBUSxNQUFNLFFBQVEsU0FBUyxRQUFRLENBQUM7QUFBQSxRQUNuRCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFFQSxRQUFJLElBQUksTUFBTTtBQUNaLGVBQVMsb0JBQW9CLEdBQUcsSUFBSSxJQUFJO0FBQUEsSUFDMUM7QUFDQSxRQUFJLFVBQVU7QUFDWixlQUFTLFdBQVcsQ0FBQyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQUEsSUFDekM7QUFDQSxRQUFJLE1BQU07QUFDUixlQUFTLE9BQU8sQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQUEsSUFDakM7QUFFQSxXQUFPO0FBQUEsRUFDVDs7O0FDM0JPLE1BQU0sZ0JBQXdEO0FBQUEsSUFDbkUsY0FBYyxDQUFDLGdCQUFnQixjQUFjO0FBQUEsSUFDN0MsYUFBYSxDQUFDLHNCQUFzQixhQUFhO0FBQUEsSUFDakQsWUFBWSxDQUFDLGNBQWMsWUFBWTtBQUFBLElBQ3ZDLFdBQVcsQ0FBQyx1QkFBdUIsV0FBVztBQUFBLElBQzlDLG9CQUFvQixDQUFDLHFCQUFxQixvQkFBb0I7QUFBQSxJQUM5RCxZQUFZLENBQUMsY0FBYyxZQUFZO0FBQUEsSUFDdkMsWUFBWSxDQUFDLGNBQWMsWUFBWTtBQUFBLEVBQ3pDO0FBT08sTUFBTSxpQkFBOEM7QUFBQSxJQUN6RCxjQUFjO0FBQUEsSUFDZCxhQUFhO0FBQUEsRUFDZjs7O0FDakNBLE1BQU0scUJBQXFCLG9CQUFJLElBQUk7QUFBQSxJQUNqQztBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRixDQUFDO0FBRUQsV0FBUyxhQUFhLEdBQWdDO0FBQ3BELGVBQVcsT0FBTztBQUFBLE1BQ2hCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLEdBQUc7QUFDRCxZQUFNLElBQUksRUFBRSxHQUFHO0FBQ2YsVUFBSSxFQUFHLFFBQU8sT0FBTyxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUU7QUFBQSxJQUNyQztBQUNBLGVBQVcsT0FBTyxDQUFDLG1CQUFtQixpQkFBaUIsR0FBRztBQUN4RCxZQUFNLFNBQVMsRUFBRSxHQUFHO0FBQ3BCLFVBQUksVUFBVSxPQUFPLFdBQVcsWUFBWSxPQUFPLE9BQU87QUFDeEQsZUFBTyxPQUFPLE9BQU8sS0FBSyxFQUFFLE1BQU0sR0FBRyxFQUFFO0FBQUEsTUFDekM7QUFBQSxJQUNGO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFFQSxXQUFTLGlCQUFpQixHQUFnQztBQUN4RCxlQUFXLEtBQUssRUFBRSxhQUFhLENBQUMsR0FBRztBQUNqQyxZQUFNLEtBQUssS0FBSyxDQUFDLEdBQUcsV0FBVztBQUMvQixVQUFJLEVBQUcsUUFBTztBQUFBLElBQ2hCO0FBQ0EsVUFBTSxNQUFNLEVBQUUsYUFBYSxDQUFDO0FBQzVCLFFBQUksT0FBTyxPQUFPLFFBQVEsWUFBWSxJQUFJLFFBQVMsUUFBTyxJQUFJO0FBQzlELFdBQU87QUFBQSxFQUNUO0FBUU8sV0FBUyxxQkFDZCxXQUN1QjtBQUN2QixVQUFNLFlBQVksb0JBQUksSUFBWTtBQUNsQyxlQUFXLEtBQUssV0FBVztBQUN6QixVQUFJLEVBQUUsaUJBQWlCLFlBQWE7QUFDcEMsV0FBSyxFQUFFLFNBQVMsQ0FBQyxHQUFHLFNBQVMsTUFBTztBQUNwQyxZQUFNLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxHQUFHLFdBQVc7QUFDbEQsWUFBTSxRQUFRLFFBQVEsRUFBRSxVQUFVLENBQUMsR0FBRyxTQUFTLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRTtBQUM5RCxVQUFJLFFBQVEsTUFBTyxXQUFVLElBQUksR0FBRyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQUEsSUFDckQ7QUFDQSxRQUFJLFVBQVUsU0FBUyxFQUFHLFFBQU87QUFDakMsV0FBTyxVQUFVLE9BQU8sQ0FBQyxNQUFNO0FBQzdCLFVBQUksRUFBRSxpQkFBaUIsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLEdBQUcsU0FBUyxPQUFPO0FBQ3BFLGNBQU0sUUFBUSxFQUFFLG1CQUFtQixDQUFDLEdBQUcsV0FBVztBQUNsRCxjQUFNLFFBQVEsUUFBUSxFQUFFLFVBQVUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFO0FBQzlELFlBQUksVUFBVSxJQUFJLEdBQUcsSUFBSSxJQUFJLEtBQUssRUFBRSxFQUFHLFFBQU87QUFBQSxNQUNoRDtBQUNBLGFBQU87QUFBQSxJQUNULENBQUM7QUFBQSxFQUNIO0FBT08sV0FBUywwQkFDZCxZQUNBLFdBQ007QUFDTixRQUFJLFdBQVcsV0FBVyxFQUFHO0FBQzdCLFVBQU0sYUFBYSxvQkFBSSxJQUFzQjtBQUM3QyxVQUFNLFlBQVksb0JBQUksSUFBNkM7QUFFbkUsZUFBVyxLQUFLLFlBQVk7QUFDMUIsVUFBSSxFQUFFLGlCQUFpQixZQUFhO0FBQ3BDLFlBQU0sUUFBUSxFQUFFLG1CQUFtQixDQUFDLEdBQUcsV0FBVztBQUNsRCxZQUFNLFFBQVEsUUFBUSxFQUFFLFVBQVUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFO0FBQzlELFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTztBQUNyQixZQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksS0FBSztBQUM1QixZQUFNLE1BQU0sV0FBVyxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ3BDLFVBQUksS0FBSyxFQUFFLEVBQUU7QUFDYixpQkFBVyxJQUFJLEtBQUssR0FBRztBQUN2QixZQUFNLE9BQU8sRUFBRSxTQUFTLENBQUMsR0FBRyxRQUFRO0FBQ3BDLFVBQUksUUFBUSxPQUFPO0FBQ2pCLGNBQU0sTUFBTSxRQUFRLEVBQUUsVUFBVSxDQUFDLEdBQUcsT0FBTyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUU7QUFDMUQsWUFBSSxLQUFLO0FBQ1AsZ0JBQU0sT0FBTyxVQUFVLElBQUksSUFBSSxLQUFLLENBQUM7QUFDckMsZUFBSyxLQUFLLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRSxDQUFDO0FBQzVCLG9CQUFVLElBQUksTUFBTSxJQUFJO0FBQUEsUUFDMUI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVBLFFBQUksV0FBVyxTQUFTLEtBQUssVUFBVSxTQUFTLEVBQUc7QUFFbkQsZUFBVyxLQUFLLFdBQVc7QUFDekIsVUFBSSxDQUFDLG1CQUFtQixJQUFJLEVBQUUsWUFBWSxFQUFHO0FBQzdDLFVBQUksRUFBRSxhQUFhLEVBQUUsUUFBUztBQUM5QixZQUFNLE9BQU8saUJBQWlCLENBQUM7QUFDL0IsWUFBTSxPQUFPLGFBQWEsQ0FBQztBQUMzQixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQU07QUFDcEIsWUFBTSxVQUFvQixDQUFDLEdBQUksV0FBVyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBRTtBQUN2RSxVQUFJLFFBQVEsV0FBVyxHQUFHO0FBQ3hCLG1CQUFXLENBQUMsT0FBTyxLQUFLLEdBQUcsS0FBSyxVQUFVLElBQUksSUFBSSxLQUFLLENBQUMsR0FBRztBQUN6RCxjQUFJLFNBQVMsUUFBUSxRQUFRLElBQUssU0FBUSxLQUFLLEdBQUc7QUFBQSxRQUNwRDtBQUFBLE1BQ0Y7QUFDQSxVQUFJLFFBQVEsV0FBVyxFQUFHO0FBQzFCLFFBQUUsWUFBWSxFQUFFLFdBQVcsYUFBYSxRQUFRLENBQUMsQ0FBQyxHQUFHO0FBQUEsSUFDdkQ7QUFBQSxFQUNGO0FBT08sV0FBUywyQkFDZCxTQUNBLFdBQ007QUFDTixRQUFJLENBQUMsUUFBUztBQUNkLFVBQU0sU0FBUyxPQUFPLFFBQVEsVUFBVSxFQUFFLEVBQUUsWUFBWTtBQUN4RCxRQUFJLFdBQVcsVUFBVSxXQUFXLFNBQVU7QUFFOUMsZUFBVyxLQUFLLFdBQVc7QUFDekIsVUFBSSxFQUFFLGlCQUFpQixjQUFlO0FBQ3RDLFlBQU0sTUFBYSxFQUFFLGtCQUFrQixDQUFDO0FBQ3hDLFVBQUksSUFBSSxTQUFTLEVBQUc7QUFFcEIsVUFBSSxRQUFhO0FBQ2pCLGlCQUFXLFNBQVMsS0FBSztBQUN2QixtQkFBVyxNQUFNLE1BQU0sYUFBYSxDQUFDLEdBQUc7QUFDdEMscUJBQVcsS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHO0FBQy9CLGdCQUFJLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxZQUFZLE1BQU0sUUFBUTtBQUNqRCxzQkFBUTtBQUNSO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFDQSxjQUFJLE1BQU87QUFBQSxRQUNiO0FBQ0EsWUFBSSxNQUFPO0FBQUEsTUFDYjtBQUNBLFVBQUksQ0FBQyxNQUFPO0FBRVosUUFBRSxpQkFBaUIsQ0FBQyxLQUFLO0FBQ3pCLFlBQU0sU0FDSixRQUFRLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxTQUFTLEVBQUUsS0FBSyxPQUFPLEVBQUUsZUFBZSxFQUFFO0FBQzNFLFlBQU0sWUFBWSxxQkFBcUIsUUFBUSxFQUFFLGlCQUFpQixNQUFNLEtBQUs7QUFDN0UsVUFBSSxXQUFXO0FBQ2IsVUFBRSxpQkFBaUIsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUFBLE1BQzdDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7OztBQy9KQSxNQUFNLG9CQUFvQjtBQUVuQixXQUFTLHNCQUFzQixPQUEyQztBQUMvRSxRQUFJLENBQUMsTUFBTyxRQUFPO0FBQ25CLFdBQU8sa0JBQWtCLEtBQUssTUFBTSxLQUFLLEVBQUUsWUFBWSxDQUFDO0FBQUEsRUFDMUQ7QUFFTyxXQUFTLFdBQVcsS0FBK0M7QUFDeEUsVUFBTSxRQUFRLE9BQU8sSUFBSSxjQUFjLElBQUksTUFBTSxTQUFTO0FBSzFELFVBQU0sWUFBWSxnQkFBZ0IsS0FBSztBQVN2QyxVQUFNLFlBQVksSUFBSSxRQUFRLFNBQVM7QUFDdkMsVUFBTSxTQUFTLElBQUksU0FBUyxTQUFTO0FBQ3JDLFVBQU0sV0FBVyxJQUFJLFdBQVcsU0FBUztBQUV6QyxVQUFNLENBQUMsUUFBUSxLQUFLLElBQUksVUFBVSxRQUFRO0FBQzFDLFVBQU0sWUFBaUMsRUFBRSxLQUFLLFlBQVksTUFBTSxTQUFTO0FBQ3pFLFFBQUksT0FBUSxXQUFVLFNBQVM7QUFDL0IsUUFBSSxNQUFNLFNBQVMsRUFBRyxXQUFVLFFBQVE7QUFFeEMsVUFBTSxXQUFnQztBQUFBLE1BQ3BDLGNBQWM7QUFBQSxNQUNkLElBQUk7QUFBQSxNQUNKLE1BQU0sRUFBRSxXQUFXLEtBQUssUUFBUSwwQkFBMEI7QUFBQSxNQUMxRCxZQUFZO0FBQUEsUUFDVjtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsUUFBUSxzQkFBc0IsS0FBSyxJQUN2QixpQkFDQTtBQUFBLFVBQ1osT0FBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNLENBQUMsU0FBUztBQUFBLE1BQ2hCLFFBQVEsVUFBVSxJQUFJLE1BQU07QUFBQSxJQUM5QjtBQUVBLFVBQU0sWUFBWSxJQUFJO0FBQ3RCLFFBQUksVUFBVyxVQUFTLFlBQVk7QUFFcEMsUUFBSSxPQUFPO0FBQ1QsZUFBUyxVQUFVLENBQUMsRUFBRSxRQUFRLFNBQVMsS0FBSyxRQUFRLE9BQU8sTUFBTSxDQUFDO0FBQUEsSUFDcEU7QUFFQSxRQUFJLFNBQVM7QUFDWCxlQUFTLFVBQVUsQ0FBQyxFQUFFLEtBQUssUUFBUSxNQUFNLFFBQVEsQ0FBQztBQUFBLElBQ3BEO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFZQSxXQUFTLFVBQVUsVUFBc0M7QUFDdkQsVUFBTSxRQUFRLFlBQVksSUFBSSxLQUFLO0FBQ25DLFFBQUksQ0FBQyxRQUFRLFNBQVMsVUFBVyxRQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsUUFBSSxLQUFLLEtBQUssSUFBSSxHQUFHO0FBQ25CLFlBQU0sUUFBUSxLQUFLLE1BQU0sS0FBSztBQUM5QixhQUFPLENBQUMsTUFBTSxNQUFNLFNBQVMsQ0FBQyxHQUFJLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUFBLElBQ3REO0FBSUEsVUFBTSxhQUFhLE1BQU0sS0FBSyxJQUFJO0FBQ2xDLFdBQU8sV0FBVyxTQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBSSxDQUFDLFdBQVcsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFBQSxFQUM3RjtBQUVBLFdBQVMsVUFBVSxRQUF5QjtBQUMxQyxVQUFNLElBQUksT0FBTyxXQUFXLFdBQVcsT0FBTyxZQUFZLElBQUk7QUFDOUQsUUFBSSxDQUFDLFFBQVEsS0FBSyxVQUFLLGNBQUksRUFBRSxTQUFTLENBQUMsRUFBRyxRQUFPO0FBQ2pELFFBQUksQ0FBQyxVQUFVLEtBQUssVUFBSyxjQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUcsUUFBTztBQUNuRCxXQUFPO0FBQUEsRUFDVDs7O0FDekZPLFdBQVMsU0FBUyxTQUFTO0FBQ2hDLFFBQUksQ0FBQyxRQUFTLFFBQU87QUFDckIsVUFBTSxJQUFJLE9BQU8sT0FBTyxFQUFFLE1BQU0sd0NBQXdDO0FBQ3hFLFFBQUksQ0FBQyxFQUFHLFFBQU87QUFDZixVQUFNLElBQUksU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUk7QUFDL0IsV0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUFBLEVBQy9EO0FBZU8sV0FBUyxZQUFZLEdBQUc7QUFDN0IsUUFBSSxNQUFNLFFBQVEsTUFBTSxPQUFXLFFBQU87QUFDMUMsVUFBTSxNQUFNLE9BQU8sQ0FBQztBQUNwQixVQUFNLE1BQU0sSUFBSSxRQUFRLElBQUk7QUFDNUIsUUFBSSxRQUFRLEdBQUksUUFBTyxJQUFJLEtBQUs7QUFDaEMsVUFBTSxLQUFLLElBQUksTUFBTSxNQUFNLENBQUMsRUFBRSxLQUFLO0FBQ25DLFdBQU8sTUFBTSxJQUFJLE1BQU0sR0FBRyxHQUFHLEVBQUUsS0FBSztBQUFBLEVBQ3RDO0FBUUEsV0FBUyxjQUFjLEdBQUc7QUFDeEIsUUFBSSxNQUFNLFFBQVEsTUFBTSxPQUFXLFFBQU87QUFDMUMsV0FBTyxPQUFPLENBQUMsRUFDWixLQUFLLEVBQ0wsUUFBUSxlQUFlLEVBQUUsRUFDekIsS0FBSztBQUFBLEVBQ1Y7QUFnQk8sV0FBUyxhQUFhLE1BQU07QUFDakMsUUFBSSxDQUFDLFFBQVEsT0FBTyxTQUFTLFNBQVUsUUFBTztBQUM5QyxVQUFNLE9BQU87QUFBQSxNQUNYLEtBQUsscUJBQXFCLEtBQUsscUJBQXFCLEtBQUs7QUFBQSxJQUMzRDtBQUNBLFVBQU0sUUFBUSxLQUFLO0FBQ25CLFFBQUksQ0FBQyxRQUFRLFVBQVUsVUFBYSxVQUFVLFFBQVEsVUFBVSxHQUFJLFFBQU87QUFTM0UsVUFBTSxXQUFXLGNBQWMsS0FBSyxlQUFlLEtBQ2xDLGNBQWMsS0FBSyxlQUFlLEtBQ2xDLGNBQWMsS0FBSyxVQUFVO0FBQzlDLFVBQU0sWUFBWSxPQUFPLEtBQUssY0FBYyxFQUFFLEVBQUUsS0FBSztBQUNyRCxXQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0EsWUFBWTtBQUFBLE1BQ1osWUFBWSxLQUFLLGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU8vQixNQUFNLGFBQWE7QUFBQSxNQUNuQixTQUFTO0FBQUEsTUFDVCxPQUFPLE9BQU8sS0FBSztBQUFBLE1BQ25CLE1BQU0sS0FBSyxhQUFhO0FBQUEsTUFDeEIsaUJBQWlCLEtBQUssaUJBQWlCLEtBQUssdUJBQXVCO0FBQUEsTUFDbkUsVUFBVSxLQUFLLGFBQWE7QUFBQSxJQUM5QjtBQUFBLEVBQ0Y7QUFPTyxXQUFTLDBCQUEwQixNQUFNLE9BQU87QUFDckQsUUFBSSxDQUFDLFFBQVEsT0FBTyxTQUFTLFNBQVUsUUFBTztBQUc5QyxVQUFNLE9BQU8sU0FBUyxPQUFPLGFBQWEsT0FBTyxhQUFhLEVBQUU7QUFDaEUsVUFBTSxZQUFZLFlBQVksS0FBSyxhQUFhLEtBQUssYUFBYSxFQUFFO0FBQ3BFLFFBQUksQ0FBQyxRQUFRLENBQUMsVUFBVyxRQUFPO0FBQ2hDLFVBQU0sT0FBTyxPQUFPLEtBQUssa0JBQWtCLEtBQUssa0JBQWtCLENBQUM7QUFDbkUsV0FBTztBQUFBLE1BQ0w7QUFBQSxNQUNBO0FBQUEsTUFDQSxNQUFNLEtBQUssY0FBYyxLQUFLLGNBQWM7QUFBQTtBQUFBLE1BRTVDLE1BQU07QUFBQSxNQUNOLFdBQVc7QUFBQSxNQUNYLE9BQU87QUFBQSxNQUNQLFVBQVUsS0FBSyxhQUFhLEtBQUssYUFBYTtBQUFBLE1BQzlDLGVBQWUsT0FBTyxTQUFTLElBQUksSUFBSSxPQUFPO0FBQUE7QUFBQSxNQUU5QyxZQUFZLFlBQVksT0FBTyxxQkFBcUIsT0FBTyxlQUFlLEVBQUU7QUFBQSxNQUM1RSxpQkFBaUIsT0FBTyxlQUFlLE9BQU8sZUFBZTtBQUFBLE1BQzdELFlBQVksWUFBWSxLQUFLLE9BQU8sRUFBRTtBQUFBLE1BQ3RDLFVBQVUsT0FBTyxhQUFhLE9BQU8sYUFBYTtBQUFBLElBQ3BEO0FBQUEsRUFDRjtBQUlPLFdBQVMsa0JBQWtCO0FBQUUsV0FBTztBQUFBLEVBQU07QUFNMUMsV0FBUyx1QkFBdUI7QUFBRSxXQUFPO0FBQUEsRUFBTTtBQStCL0MsV0FBUyx5QkFBeUIsTUFBTTtBQUM3QyxRQUFJLENBQUMsUUFBUSxPQUFPLFNBQVMsU0FBVSxRQUFPO0FBQzlDLFVBQU0sVUFBVSxZQUFZLEtBQUssaUJBQWlCLEtBQUssaUJBQWlCLEVBQUU7QUFDMUUsUUFBSSxDQUFDLFFBQVMsUUFBTztBQUNyQixXQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0EsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsWUFBWSxTQUFTLEtBQUssZ0JBQWdCLEtBQUssZ0JBQWdCLEVBQUU7QUFBQSxNQUNqRSxlQUFlLFNBQVMsS0FBSyxnQkFBZ0IsS0FBSyxnQkFBZ0IsRUFBRTtBQUFBLE1BQ3BFLFVBQVU7QUFBQSxNQUNWLFVBQVU7QUFBQSxNQUNWLFVBQVUsS0FBSyxhQUFhLEtBQUssYUFBYTtBQUFBLE1BQzlDLGlCQUFpQjtBQUFBLElBQ25CO0FBQUEsRUFDRjtBQVNPLFdBQVMscUJBQXFCLEtBQUs7QUFDeEMsUUFBSSxDQUFDLE9BQU8sT0FBTyxRQUFRLFNBQVUsUUFBTztBQUM1QyxVQUFNLE9BQU8sU0FBUyxJQUFJLG1CQUFtQixFQUFFO0FBQy9DLFFBQUksQ0FBQyxLQUFNLFFBQU87QUFDbEIsVUFBTSxXQUFXLElBQUksYUFBYSxJQUFJLGFBQWE7QUFDbkQsVUFBTSxNQUFNLENBQUM7QUFPYixhQUFTLEtBQUssU0FBUyxPQUFPLE1BQU0sVUFBVSxVQUFVLE1BQU07QUFDNUQsVUFBSSxVQUFVLFVBQWEsVUFBVSxLQUFNO0FBQzNDLFlBQU0sSUFBSSxPQUFPLEtBQUssRUFBRSxLQUFLO0FBUTdCLFVBQUksTUFBTSxNQUFNLE1BQU0sU0FBSztBQUMzQixVQUFJLEtBQUs7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0EsVUFBVSxZQUFZO0FBQUEsUUFDdEIsWUFBWSxRQUFRO0FBQUEsUUFDcEIsWUFBWTtBQUFBLFFBQ1osTUFBTSxRQUFRO0FBQUEsUUFDZDtBQUFBLFFBQ0EsT0FBTztBQUFBLFFBQ1AsTUFBTSxRQUFRO0FBQUEsUUFDZCxpQkFBaUIsWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBSTdCLGdCQUFnQjtBQUFBLE1BQ2xCLENBQUM7QUFBQSxJQUNIO0FBS0EsU0FBSyxlQUFlLElBQUksUUFBUSxNQUFNLElBQUksYUFBYTtBQUN2RCxTQUFLLGVBQWUsSUFBSSxRQUFRLE1BQU0sSUFBSSxhQUFhO0FBQ3ZELFNBQUssT0FBTyxJQUFJLEtBQUssU0FBUyxJQUFJLGFBQWE7QUFDL0MsU0FBSyx1QkFBdUIsSUFBSSxXQUFXLE1BQU0sSUFBSSxhQUFhO0FBQ2xFO0FBQUEsTUFBSztBQUFBLE1BQTJCLElBQUk7QUFBQSxNQUFVO0FBQUEsTUFDekMsSUFBSSwwQkFBMEI7QUFBQSxNQUFJO0FBQUEsSUFBYTtBQUNwRDtBQUFBLE1BQUs7QUFBQSxNQUE0QixJQUFJO0FBQUEsTUFBVTtBQUFBLE1BQzFDLElBQUksMEJBQTBCO0FBQUEsTUFBSTtBQUFBLElBQWE7QUFRcEQsU0FBSyxlQUFpQixJQUFJLEtBQVMsU0FBUyxJQUFJLGNBQWMsUUFBUTtBQUN0RSxTQUFLLGdCQUFpQixJQUFJLFNBQVMsU0FBUyxJQUFJLGNBQWMsUUFBUTtBQUN0RSxTQUFLLE9BQWlCLElBQUksS0FBUyxTQUFTLElBQUksY0FBYyxRQUFRO0FBQ3RFLFNBQUssT0FBaUIsSUFBSSxLQUFTLFNBQVMsSUFBSSxjQUFjLFFBQVE7QUFFdEUsU0FBSyxjQUFpQixJQUFJLE1BQVMsT0FBTyxJQUFJLHVCQUF1QixJQUFJLGNBQWMsUUFBUTtBQUMvRixTQUFLLGNBQWlCLElBQUksTUFBUyxPQUFPLElBQUksdUJBQXVCLElBQUksY0FBYyxRQUFRO0FBRS9GO0FBQUEsTUFBSztBQUFBLE1BQWlCLElBQUk7QUFBQSxNQUFVO0FBQUEsTUFDL0IsSUFBSSw2QkFBNkI7QUFBQSxNQUFJO0FBQUEsTUFBYztBQUFBLElBQVE7QUFHaEUsU0FBSyxPQUFpQixJQUFJLFdBQWEsU0FBUyxJQUFJLGNBQWMsUUFBUTtBQUMxRSxTQUFLLGNBQWlCLElBQUksWUFBYSxTQUFTLElBQUksY0FBYyxRQUFRO0FBRzFFO0FBQUEsTUFBSztBQUFBLE1BQWlCLElBQUk7QUFBQSxNQUFhO0FBQUEsTUFDbEMsSUFBSSx1QkFBdUI7QUFBQSxJQUFFO0FBT2xDLFNBQUssaUJBQWlCLElBQUksc0JBQXNCLElBQUksSUFBSSxFQUFFO0FBUzFELFNBQUssU0FBWSxJQUFJLGNBQWdCLElBQUksSUFBSSxJQUFJLG1CQUFtQixJQUFJLGNBQWMsUUFBUTtBQUM5RixTQUFLLFlBQVksSUFBSSxpQkFBaUIsSUFBSSxJQUFJLElBQUksbUJBQW1CLElBQUksY0FBYyxRQUFRO0FBYS9GLFNBQUssYUFBaUIsSUFBSSxXQUFhLFNBQVMsSUFBSSxjQUFjLFFBQVE7QUFPMUU7QUFBQSxNQUFLO0FBQUEsTUFDQSxJQUFJO0FBQUEsTUFBd0I7QUFBQSxNQUFJO0FBQUEsSUFBRTtBQUN2QyxXQUFPO0FBQUEsRUFDVDtBQU9PLFdBQVMsd0JBQXdCLE1BQU07QUFDNUMsUUFBSSxDQUFDLFFBQVEsT0FBTyxTQUFTLFNBQVUsUUFBTztBQUM5QyxVQUFNLFFBQVEsU0FBUyxLQUFLLFdBQVcsS0FBSyxhQUFhLEVBQUU7QUFDM0QsVUFBTSxNQUFNLFNBQVMsS0FBSyxZQUFZLEVBQUU7QUFDeEMsUUFBSSxDQUFDLE1BQU8sUUFBTztBQUVuQixVQUFNLFVBQVUsS0FBSyxlQUFlLEtBQUssZUFBZTtBQUN4RCxVQUFNLFVBQVUsWUFBWSxLQUFLLHFCQUFxQixLQUFLLGVBQWUsRUFBRTtBQUM1RSxXQUFPO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixPQUFPO0FBQUEsTUFDUCxjQUFjO0FBQUEsTUFDZCxZQUFZO0FBQUEsTUFDWixVQUFVO0FBQUEsTUFDVixRQUFRLFVBQVcsVUFBVSxHQUFHLE9BQU8sSUFBSSxPQUFPLEtBQUssVUFBVztBQUFBLE1BQ2xFLFVBQVUsS0FBSyxhQUFhLEtBQUssYUFBYTtBQUFBLE1BQzlDLFFBQVEsS0FBSyxVQUFVLEtBQUssVUFBVTtBQUFBLElBQ3hDO0FBQUEsRUFDRjtBQWFPLFdBQVMsNkJBQTZCLE1BQU0sV0FBVztBQUM1RCxRQUFJLENBQUMsUUFBUSxPQUFPLFNBQVMsU0FBVSxRQUFPO0FBQzlDLFVBQU0sT0FBTyxTQUFTLEtBQUssYUFBYSxLQUFLLGFBQWEsS0FBSyxhQUFhLEVBQUU7QUFDOUUsUUFBSSxDQUFDLEtBQU0sUUFBTztBQUNsQixVQUFNLFVBQVUsS0FBSyxlQUFlLEtBQUssZUFBZSxLQUFLLGVBQWU7QUFDNUUsVUFBTSxVQUFVO0FBQUEsTUFDZCxLQUFLLHFCQUFxQixLQUFLLHFCQUFxQixLQUFLLGVBQWU7QUFBQSxJQUMxRTtBQUdBLFdBQU87QUFBQSxNQUNMO0FBQUEsTUFDQSxVQUFVO0FBQUEsTUFDVixPQUFPLGFBQWE7QUFBQTtBQUFBO0FBQUEsTUFHcEIsY0FBYyxLQUFLLGlCQUFpQixLQUFLLGlCQUFpQjtBQUFBLE1BQzFELFlBQVk7QUFBQSxNQUNaLFVBQVU7QUFBQSxNQUNWLFFBQVEsVUFBVyxVQUFVLEdBQUcsT0FBTyxJQUFJLE9BQU8sS0FBSyxVQUFXO0FBQUEsTUFDbEUsVUFBVSxLQUFLLGFBQWEsS0FBSyxhQUFhLEtBQUssYUFBYTtBQUFBO0FBQUEsTUFFaEUsUUFBUSxLQUFLLFVBQVUsS0FBSyxVQUFVO0FBQUEsSUFDeEM7QUFBQSxFQUNGO0FBRU8sV0FBUyxhQUFhLE1BQU07QUFDakMsUUFBSSxDQUFDLFFBQVEsT0FBTyxTQUFTLFNBQVUsUUFBTztBQUM5QyxVQUFNLFdBQ0osS0FBSyxpQkFBaUIsS0FBSyxjQUFjLEtBQUssV0FDOUMsS0FBSyxhQUFhLEtBQUssWUFBWTtBQUNyQyxRQUFJLENBQUMsU0FBVSxRQUFPO0FBQ3RCLFdBQU87QUFBQSxNQUNMLGVBQWUsU0FBUyxLQUFLLGFBQWEsS0FBSyxlQUFlLEVBQUU7QUFBQSxNQUNoRSxTQUFTO0FBQUEsTUFDVCxVQUFVO0FBQUEsTUFDVixhQUFhO0FBQUEsTUFDYixVQUFVLEtBQUssWUFBWSxLQUFLLFdBQVc7QUFBQSxJQUM3QztBQUFBLEVBQ0Y7QUFZTyxXQUFTLGVBQWUsTUFBTTtBQUNuQyxRQUFJLENBQUMsUUFBUSxPQUFPLFNBQVMsU0FBVSxRQUFPO0FBQzlDLFVBQU0sT0FBTyxTQUFTLEtBQUssYUFBYSxLQUFLLFNBQVM7QUFDdEQsVUFBTSxVQUFVO0FBQUEsTUFDZCxLQUFLLGlCQUFpQixLQUFLLGFBQWEsS0FBSyxjQUFjO0FBQUEsSUFDN0Q7QUFDQSxRQUFJLENBQUMsUUFBUSxDQUFDLFFBQVMsUUFBTztBQUk5QixVQUFNLGFBQWEsS0FBSyxlQUFlLEtBQUssZUFBZTtBQUMzRCxVQUFNLGFBQWEsWUFBWSxLQUFLLHFCQUFxQixLQUFLLHFCQUFxQixFQUFFO0FBQ3JGLFVBQU0sT0FBTyxhQUNSLGFBQWEsV0FBVyxVQUFVLElBQUksVUFBVSxLQUFLLFdBQVcsVUFBVSxLQUMzRTtBQUNKLFdBQU87QUFBQSxNQUNMO0FBQUEsTUFDQSxNQUFNO0FBQUEsTUFDTjtBQUFBLE1BQ0E7QUFBQSxNQUNBLFdBQVc7QUFBQSxNQUNYLFVBQVUsS0FBSyxhQUFhLEtBQUssYUFBYTtBQUFBLElBQ2hEO0FBQUEsRUFDRjtBQTJCTyxXQUFTLDZCQUE2QixNQUFNO0FBQ2pELFFBQUksQ0FBQyxRQUFRLE9BQU8sU0FBUyxTQUFVLFFBQU87QUFDOUMsVUFBTSxPQUFPO0FBQUEsTUFDWCxLQUFLLHFCQUFxQixLQUFLLHFCQUMvQixLQUFLLGFBQWEsS0FBSyxhQUFhO0FBQUEsSUFDdEM7QUFDQSxVQUFNLFVBQVUsWUFBWSxLQUFLLGNBQWMsS0FBSyxjQUFjLEVBQUU7QUFDcEUsVUFBTSxjQUFjLEtBQUssUUFBUSxJQUFJLEtBQUs7QUFDMUMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsV0FBWSxRQUFPO0FBQzdDLFdBQU87QUFBQSxNQUNMO0FBQUEsTUFDQSxNQUFNLEtBQUssY0FBYyxLQUFLLGNBQWM7QUFBQSxNQUM1QyxRQUFRO0FBQUEsTUFDUjtBQUFBLE1BQ0EsVUFBVTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLFVBQVUsS0FBSyxhQUFhLEtBQUssYUFBYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLOUMsUUFBUSxVQUFVLEtBQUsscUJBQXFCLElBQUksTUFBTSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQUEsSUFDakU7QUFBQSxFQUNGOzs7QUN0Y08sTUFBTSxvQkFBb0I7QUFBQSxJQUMvQixZQUFZO0FBQUEsSUFDWixXQUFXO0FBQUEsSUFDWCxrQkFBa0I7QUFBQSxJQUNsQixZQUFZO0FBQUEsSUFDWixhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsSUFDWCxhQUFhO0FBQUEsSUFDYixrQkFBa0I7QUFBQSxJQUNsQixrQkFBa0I7QUFBQSxJQUNsQixTQUFTO0FBQUEsSUFDVCxZQUFZO0FBQUEsSUFDWixzQkFBc0I7QUFBQSxFQUN4QjtBQVFPLE1BQU0sb0JBQW9CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBWS9CO0FBQUEsTUFBRSxNQUFNO0FBQUEsTUFBdUIsTUFBTTtBQUFBLE1BQ25DLFdBQVc7QUFBQSxNQUFxQixPQUFPO0FBQUEsTUFBOEIsbUJBQW1CO0FBQUEsSUFBSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLL0Y7QUFBQSxNQUFFLE1BQU07QUFBQSxNQUF1QixNQUFNO0FBQUEsTUFDbkMsV0FBVztBQUFBLE1BQXFCLE9BQU87QUFBQSxJQUF3QjtBQUFBLElBQ2pFO0FBQUEsTUFBRSxNQUFNO0FBQUEsTUFBdUIsTUFBTTtBQUFBLE1BQ25DLFdBQVc7QUFBQSxNQUFxQixPQUFPO0FBQUEsSUFBd0I7QUFBQSxJQUNqRTtBQUFBLE1BQUUsTUFBTTtBQUFBLE1BQXVCLE1BQU07QUFBQSxNQUNuQyxXQUFXO0FBQUEsTUFBcUIsT0FBTztBQUFBLElBQWU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS3hEO0FBQUEsTUFBRSxNQUFNO0FBQUEsTUFBdUIsTUFBTTtBQUFBLE1BQ25DLFdBQVc7QUFBQSxNQUFxQixPQUFPO0FBQUEsTUFBaUIsbUJBQW1CO0FBQUEsSUFBSztBQUFBLElBQ2xGO0FBQUEsTUFBRSxNQUFNO0FBQUEsTUFBdUIsTUFBTTtBQUFBLE1BQ25DLFdBQVc7QUFBQSxNQUFxQixPQUFPO0FBQUEsSUFBYTtBQUFBLElBQ3REO0FBQUEsTUFBRSxNQUFNO0FBQUEsTUFBdUIsTUFBTTtBQUFBLE1BQ25DLFdBQVc7QUFBQSxNQUFxQixPQUFPO0FBQUEsSUFBYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU10RDtBQUFBLE1BQUUsTUFBTTtBQUFBLE1BQXVCLE1BQU07QUFBQSxNQUNuQyxXQUFXO0FBQUEsTUFBcUIsT0FBTztBQUFBLElBQXFCO0FBQUEsSUFDOUQ7QUFBQSxNQUFFLE1BQU07QUFBQSxNQUF1QixNQUFNO0FBQUEsTUFDbkMsV0FBVztBQUFBLE1BQXFCLE9BQU87QUFBQSxJQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBU3REO0FBQUEsTUFBRSxNQUFNO0FBQUEsTUFBdUIsTUFBTTtBQUFBLE1BQ25DLFdBQVc7QUFBQSxNQUFzQixPQUFPO0FBQUEsTUFBc0IsbUJBQW1CO0FBQUEsSUFBSztBQUFBO0FBQUEsSUFFeEY7QUFBQSxNQUFFLE1BQU07QUFBQSxNQUF1QixNQUFNO0FBQUEsTUFDbkMsV0FBVztBQUFBLE1BQXFCLE9BQU87QUFBQSxNQUFjLG1CQUFtQjtBQUFBLElBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSy9FO0FBQUEsTUFBRSxNQUFNO0FBQUEsTUFBd0IsTUFBTTtBQUFBLE1BQ3BDLFdBQVc7QUFBQSxNQUFxQixPQUFPO0FBQUEsSUFBeUI7QUFBQSxFQUNwRTs7O0FDckVBLE1BQU0sY0FBYztBQU9wQixNQUFJLGFBQWE7QUFJakIsTUFBSSxpQkFBaUI7QUFDckIsTUFBTSxlQUFlO0FBSXJCLE1BQU0sd0JBQXdCO0FBUTlCLGlCQUFlLFVBQVUsU0FBUztBQUloQyxRQUFJLFdBQVk7QUFDaEIsVUFBTSxRQUFRLE1BQU0sT0FBTyxRQUFRLE1BQU0sSUFBSSxXQUFXLEdBQUcsV0FBVyxLQUFLLENBQUM7QUFDNUUsVUFBTSxPQUFPLEVBQUUsR0FBRyxNQUFNLEdBQUcsU0FBUyxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ25ELFVBQU0sT0FBTyxRQUFRLE1BQU0sSUFBSSxFQUFFLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUd0RCxXQUFPLFFBQVEsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLFFBQVEsS0FBSyxDQUFDLEVBQUUsTUFBTSxNQUFNO0FBQUEsSUFBQyxDQUFDO0FBQUEsRUFDbkY7QUFXQSxNQUFNLFdBQVc7QUFrQmpCLFdBQVMscUJBQXFCLE1BQU0sV0FBVztBQUM3QyxRQUFJLENBQUMsYUFBYyxDQUFDLFVBQVUsU0FBUyxDQUFDLFVBQVUsSUFBTSxRQUFPO0FBSS9ELFVBQU0sS0FBSyxVQUFVLFNBQVMsSUFBSSxNQUFNLEdBQUcsRUFBRTtBQUM3QyxVQUFNLEtBQUssVUFBVSxPQUFPLElBQUksTUFBTSxHQUFHLEVBQUU7QUFDM0MsUUFBSSxJQUFJO0FBQ1IsUUFBSSxjQUFjLEtBQUssQ0FBQyxHQUFHO0FBQ3pCLFVBQUksRUFBRSxRQUFRLHNCQUFzQixLQUFLLENBQUMsRUFBRTtBQUFBLElBQzlDLE9BQU87QUFDTCxZQUFNLEVBQUUsU0FBUyxHQUFHLElBQUksTUFBTSxPQUFPLFVBQVUsQ0FBQztBQUFBLElBQ2xEO0FBQ0EsUUFBSSxjQUFjLEtBQUssQ0FBQyxHQUFHO0FBQ3pCLFVBQUksRUFBRSxRQUFRLHNCQUFzQixLQUFLLENBQUMsRUFBRTtBQUFBLElBQzlDLE9BQU87QUFDTCxXQUFLLFdBQVcsQ0FBQztBQUFBLElBQ25CO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFNQSxpQkFBZSw2QkFBNkIsRUFBRSxPQUFPLFNBQVMsT0FBTyxHQUFHO0FBQ3RFLFVBQU0sT0FBTyxPQUNWLElBQUksQ0FBQyxPQUFPO0FBQUEsTUFDWCxRQUFRLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTO0FBQUE7QUFBQSxNQUUxQyxRQUFRO0FBQUEsUUFDTixXQUFXLEVBQUUsYUFBYSxFQUFFLGFBQWE7QUFBQSxRQUN6QyxhQUFhLEVBQUUsZUFBZSxFQUFFLGVBQWU7QUFBQSxRQUMvQyxtQkFBbUIsRUFBRSxxQkFBcUIsRUFBRSxlQUFlO0FBQUEsUUFDM0QsV0FBVyxFQUFFLGFBQWEsRUFBRSxhQUFhO0FBQUEsTUFDM0M7QUFBQSxJQUNGLEVBQUUsRUFDRCxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU07QUFDekIsUUFBSSxLQUFLLFdBQVcsRUFBRyxRQUFPLENBQUM7QUFFL0IsVUFBTSxDQUFDLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxPQUFPLFVBQVUsY0FBYztBQUFBLE1BQ3hELFFBQVEsRUFBRSxNQUFNO0FBQUEsTUFDaEIsTUFBTSxPQUFPLE1BQU0sVUFBVTtBQUMzQixjQUFNLFFBQVEsZUFBZSxRQUFRLE9BQU87QUFDNUMsWUFBSSxDQUFDLE1BQU8sUUFBTyxFQUFFLE9BQU8sa0JBQWtCO0FBQzlDLFlBQUksU0FBUyxLQUFLLFNBQVMsYUFBYSxLQUFLLFNBQVMsS0FBSyxTQUFTLE1BQU0sR0FBRztBQUMzRSxpQkFBTyxFQUFFLE9BQU8sa0JBQWtCO0FBQUEsUUFDcEM7QUFDQSxjQUFNLE9BQU8sVUFBVSxLQUFLO0FBQzVCLHVCQUFlLFNBQVMsT0FBTyxPQUFPO0FBQ3BDLGdCQUFNLE1BQU0sR0FBRyxJQUFJLDRDQUE0QyxtQkFBbUIsS0FBSyxDQUFDLFVBQVUsS0FBSztBQUN2RyxnQkFBTSxLQUFLLElBQUksZ0JBQWdCO0FBQy9CLGdCQUFNLElBQUksV0FBVyxNQUFNLEdBQUcsTUFBTSxHQUFHLEdBQUs7QUFDNUMsY0FBSTtBQUNGLGtCQUFNLElBQUksTUFBTSxNQUFNLEtBQUs7QUFBQSxjQUN6QixRQUFRO0FBQUEsY0FBTyxhQUFhO0FBQUEsY0FBZSxRQUFRLEdBQUc7QUFBQSxjQUN0RCxTQUFTLEVBQUUsVUFBVSxvQkFBb0IsaUJBQWlCLEtBQUs7QUFBQSxZQUNqRSxDQUFDO0FBQ0QseUJBQWEsQ0FBQztBQUNkLGdCQUFJLEVBQUUsV0FBVyxPQUFPLEVBQUUsV0FBVyxJQUFLLFFBQU8sRUFBRSxPQUFPLGtCQUFrQjtBQUM1RSxnQkFBSSxDQUFDLEVBQUUsR0FBSSxRQUFPLEVBQUUsT0FBTyxRQUFRLEVBQUUsTUFBTSxHQUFHO0FBQzlDLG1CQUFPLEVBQUUsTUFBTSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQUEsVUFDaEMsU0FBUyxHQUFHO0FBQ1YseUJBQWEsQ0FBQztBQUNkLG1CQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsZUFBZSxnQkFBZ0IsT0FBTyxHQUFHLFdBQVcsQ0FBQyxFQUFFO0FBQUEsVUFDcEY7QUFBQSxRQUNGO0FBSUEsdUJBQWUsSUFBSSxPQUFPO0FBQ3hCLHFCQUFXLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUc7QUFDN0Isa0JBQU0sSUFBSSxNQUFNLFNBQVMsT0FBTyxFQUFFO0FBQ2xDLGdCQUFJLEVBQUUsVUFBVSxrQkFBbUIsUUFBTztBQUMxQyxnQkFBSSxFQUFFLE1BQU87QUFDYixrQkFBTSxPQUFPLE1BQU0sUUFBUSxFQUFFLE1BQU0scUJBQXFCLElBQUksRUFBRSxLQUFLLHdCQUF3QixDQUFDO0FBQzVGLGtCQUFNLFdBQVcsS0FBSztBQUFBLGNBQUssQ0FBQyxNQUMxQixNQUFNLFFBQVEsR0FBRyx3QkFBd0IsS0FBSyxFQUFFLHlCQUF5QixTQUFTO0FBQUEsWUFDcEY7QUFDQSxnQkFBSSxTQUFVLFFBQU87QUFBQSxVQUN2QjtBQUdBLGlCQUFPLE1BQU0sU0FBUyxPQUFPLENBQUM7QUFBQSxRQUNoQztBQUNBLGNBQU0sTUFBTSxJQUFJLE1BQU0sTUFBTSxNQUFNO0FBQ2xDLFlBQUksT0FBTztBQUNYLGNBQU0sT0FBTztBQUNiLHVCQUFlLFNBQVM7QUFDdEIsaUJBQU8sT0FBTyxNQUFNLFFBQVE7QUFDMUIsa0JBQU0sSUFBSTtBQUNWLGtCQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sV0FBVyxHQUFHLEtBQUssT0FBTyxJQUFJLEdBQUcsQ0FBQztBQUMzRCxnQkFBSSxDQUFDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFFLE1BQU07QUFBQSxVQUNwQztBQUFBLFFBQ0Y7QUFDQSxjQUFNLEtBQUssQ0FBQztBQUNaLGlCQUFTLElBQUksR0FBRyxJQUFJLFFBQVEsSUFBSSxNQUFNLFFBQVEsSUFBSyxJQUFHLEtBQUssT0FBTyxDQUFDO0FBQ25FLGNBQU0sUUFBUSxJQUFJLEVBQUU7QUFDcEIsZUFBTyxFQUFFLFNBQVMsSUFBSTtBQUFBLE1BQ3hCO0FBQUEsTUFDQSxNQUFNLENBQUMsU0FBUyxJQUFJO0FBQUEsSUFDdEIsQ0FBQztBQUVELFFBQUksUUFBUSxVQUFVLGtCQUFtQixPQUFNLElBQUksTUFBTSxxQkFBcUI7QUFDOUUsVUFBTSxRQUFRLENBQUM7QUFDZixVQUFNLFVBQVUsUUFBUSxXQUFXLENBQUM7QUFDcEMsYUFBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLFFBQVEsS0FBSztBQUN2QyxZQUFNLElBQUksUUFBUSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQUUsS0FBTTtBQUM5QixZQUFNLE9BQU8sTUFBTSxRQUFRLEVBQUUsS0FBSyxxQkFBcUIsSUFBSSxFQUFFLEtBQUssd0JBQXdCLENBQUM7QUFDM0YsaUJBQVcsU0FBUyxNQUFNO0FBQ3hCLGNBQU0sV0FBVyxNQUFNLFFBQVEsTUFBTSx3QkFBd0IsSUFBSSxNQUFNLDJCQUEyQixDQUFDO0FBQ25HLG1CQUFXLEtBQUssVUFBVTtBQUN4QixnQkFBTSxVQUFVLDBCQUEwQixHQUFHLEtBQUs7QUFDbEQsY0FBSSxRQUFTLE9BQU0sS0FBSyxPQUFPO0FBQUEsUUFDakM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBSUEsaUJBQWUsMEJBQTBCLEVBQUUsT0FBTyxTQUFTLE9BQU8sR0FBRztBQUNuRSxVQUFNLE9BQU8sT0FDVixJQUFJLENBQUMsT0FBTztBQUFBLE1BQ1gsUUFBUSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsU0FBUztBQUFBLE1BQzFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWTtBQUFBLElBQ3JDLEVBQUUsRUFDRCxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU07QUFDekIsUUFBSSxLQUFLLFdBQVcsRUFBRyxRQUFPLENBQUM7QUFFL0IsVUFBTSxDQUFDLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxPQUFPLFVBQVUsY0FBYztBQUFBLE1BQ3hELFFBQVEsRUFBRSxNQUFNO0FBQUEsTUFDaEIsTUFBTSxPQUFPLE1BQU0sVUFBVTtBQUMzQixjQUFNLFFBQVEsZUFBZSxRQUFRLE9BQU87QUFDNUMsWUFBSSxDQUFDLE1BQU8sUUFBTyxFQUFFLE9BQU8sa0JBQWtCO0FBQzlDLFlBQUksU0FBUyxLQUFLLFNBQVMsYUFBYSxLQUFLLFNBQVMsS0FBSyxTQUFTLE1BQU0sR0FBRztBQUMzRSxpQkFBTyxFQUFFLE9BQU8sa0JBQWtCO0FBQUEsUUFDcEM7QUFDQSxjQUFNLE9BQU8sVUFBVSxLQUFLO0FBQzVCLHVCQUFlLElBQUksT0FBTyxPQUFPO0FBQy9CLGdCQUFNLE1BQU0sR0FBRyxJQUFJLDRDQUE0QyxtQkFBbUIsS0FBSyxDQUFDLFVBQVUsbUJBQW1CLEtBQUssQ0FBQztBQUMzSCxnQkFBTSxLQUFLLElBQUksZ0JBQWdCO0FBQy9CLGdCQUFNLElBQUksV0FBVyxNQUFNLEdBQUcsTUFBTSxHQUFHLEdBQUs7QUFDNUMsY0FBSTtBQUNGLGtCQUFNLElBQUksTUFBTSxNQUFNLEtBQUs7QUFBQSxjQUN6QixRQUFRO0FBQUEsY0FBTyxhQUFhO0FBQUEsY0FBZSxRQUFRLEdBQUc7QUFBQSxjQUN0RCxTQUFTLEVBQUUsVUFBVSxvQkFBb0IsaUJBQWlCLEtBQUs7QUFBQSxZQUNqRSxDQUFDO0FBQ0QseUJBQWEsQ0FBQztBQUNkLGdCQUFJLEVBQUUsV0FBVyxPQUFPLEVBQUUsV0FBVyxJQUFLLFFBQU8sRUFBRSxPQUFPLGtCQUFrQjtBQUM1RSxnQkFBSSxDQUFDLEVBQUUsR0FBSSxRQUFPLEVBQUUsT0FBTyxRQUFRLEVBQUUsTUFBTSxHQUFHO0FBQzlDLG1CQUFPLEVBQUUsTUFBTSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQUEsVUFDaEMsU0FBUyxHQUFHO0FBQ1YseUJBQWEsQ0FBQztBQUNkLG1CQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsZUFBZSxnQkFBZ0IsT0FBTyxHQUFHLFdBQVcsQ0FBQyxFQUFFO0FBQUEsVUFDcEY7QUFBQSxRQUNGO0FBQ0EsY0FBTSxNQUFNLElBQUksTUFBTSxNQUFNLE1BQU07QUFDbEMsWUFBSSxPQUFPO0FBQ1gsY0FBTSxPQUFPO0FBQ2IsdUJBQWUsU0FBUztBQUN0QixpQkFBTyxPQUFPLE1BQU0sUUFBUTtBQUMxQixrQkFBTSxJQUFJO0FBQ1Ysa0JBQU0sSUFBSSxRQUFRLENBQUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDO0FBQzNELGdCQUFJLENBQUMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLEVBQUUsUUFBUSxNQUFNLENBQUMsRUFBRSxLQUFLO0FBQUEsVUFDcEQ7QUFBQSxRQUNGO0FBQ0EsY0FBTSxLQUFLLENBQUM7QUFDWixpQkFBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLElBQUksTUFBTSxRQUFRLElBQUssSUFBRyxLQUFLLE9BQU8sQ0FBQztBQUNuRSxjQUFNLFFBQVEsSUFBSSxFQUFFO0FBQ3BCLGVBQU8sRUFBRSxTQUFTLElBQUk7QUFBQSxNQUN4QjtBQUFBLE1BQ0EsTUFBTSxDQUFDLFNBQVMsSUFBSTtBQUFBLElBQ3RCLENBQUM7QUFFRCxRQUFJLFFBQVEsVUFBVSxrQkFBbUIsT0FBTSxJQUFJLE1BQU0scUJBQXFCO0FBQzlFLFVBQU0sVUFBVSxDQUFDO0FBQ2pCLFVBQU0sVUFBVSxRQUFRLFdBQVcsQ0FBQztBQUNwQyxhQUFTLElBQUksR0FBRyxJQUFJLFFBQVEsUUFBUSxLQUFLO0FBQ3ZDLFlBQU0sSUFBSSxRQUFRLENBQUM7QUFDbkIsVUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRSxLQUFNO0FBQzlCLFlBQU0sT0FBTyxNQUFNLFFBQVEsRUFBRSxLQUFLLHFCQUFxQixJQUFJLEVBQUUsS0FBSyx3QkFBd0IsQ0FBQztBQUMzRixpQkFBVyxTQUFTLE1BQU07QUFDeEIsY0FBTSxVQUFVLDZCQUE2QixLQUFLO0FBQ2xELFlBQUksUUFBUyxTQUFRLEtBQUssT0FBTztBQUFBLE1BQ25DO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBTUEsaUJBQWUsNEJBQTRCLEVBQUUsT0FBTyxTQUFTLE9BQU8sR0FBRztBQUNyRSxVQUFNLE9BQU8sT0FDVixJQUFJLENBQUMsR0FBRyxTQUFTLEVBQUUsS0FBSyxRQUFRLEVBQUUsVUFBVSxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQzdELE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTTtBQUN6QixRQUFJLEtBQUssV0FBVyxFQUFHLFFBQU8sQ0FBQztBQUUvQixVQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxNQUFNLE9BQU8sVUFBVSxjQUFjO0FBQUEsTUFDeEQsUUFBUSxFQUFFLE1BQU07QUFBQSxNQUNoQixNQUFNLE9BQU8sTUFBTSxVQUFVO0FBQzNCLGNBQU0sUUFBUSxlQUFlLFFBQVEsT0FBTztBQUM1QyxZQUFJLENBQUMsTUFBTyxRQUFPLEVBQUUsT0FBTyxrQkFBa0I7QUFDOUMsWUFBSSxTQUFTLEtBQUssU0FBUyxhQUFhLEtBQUssU0FBUyxLQUFLLFNBQVMsTUFBTSxHQUFHO0FBQzNFLGlCQUFPLEVBQUUsT0FBTyxrQkFBa0I7QUFBQSxRQUNwQztBQUNBLGNBQU0sT0FBTyxVQUFVLEtBQUs7QUFDNUIsdUJBQWUsU0FBUyxPQUFPLEdBQUc7QUFDaEMsZ0JBQU0sTUFBTSxHQUFHLElBQUksMkNBQTJDLG1CQUFtQixLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzlGLGdCQUFNLEtBQUssSUFBSSxnQkFBZ0I7QUFDL0IsZ0JBQU0sS0FBSyxXQUFXLE1BQU0sR0FBRyxNQUFNLEdBQUcsR0FBSztBQUM3QyxjQUFJO0FBQ0Ysa0JBQU0sSUFBSSxNQUFNLE1BQU0sS0FBSztBQUFBLGNBQ3pCLFFBQVE7QUFBQSxjQUFPLGFBQWE7QUFBQSxjQUFlLFFBQVEsR0FBRztBQUFBLGNBQ3RELFNBQVMsRUFBRSxVQUFVLG9CQUFvQixpQkFBaUIsS0FBSztBQUFBLFlBQ2pFLENBQUM7QUFDRCx5QkFBYSxFQUFFO0FBQ2YsZ0JBQUksRUFBRSxXQUFXLE9BQU8sRUFBRSxXQUFXLElBQUssUUFBTyxFQUFFLE9BQU8sa0JBQWtCO0FBQzVFLGdCQUFJLENBQUMsRUFBRSxHQUFJLFFBQU8sRUFBRSxPQUFPLFFBQVEsRUFBRSxNQUFNLEdBQUc7QUFDOUMsbUJBQU8sRUFBRSxNQUFNLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFBQSxVQUNoQyxTQUFTLEdBQUc7QUFDVix5QkFBYSxFQUFFO0FBQ2YsbUJBQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxlQUFlLGdCQUFnQixPQUFPLEdBQUcsV0FBVyxDQUFDLEVBQUU7QUFBQSxVQUNwRjtBQUFBLFFBQ0Y7QUFJQSx1QkFBZSxJQUFJLE9BQU87QUFDeEIscUJBQVcsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHO0FBQy9CLGtCQUFNLElBQUksTUFBTSxTQUFTLE9BQU8sQ0FBQztBQUNqQyxnQkFBSSxFQUFFLFVBQVUsa0JBQW1CLFFBQU87QUFDMUMsZ0JBQUksRUFBRSxNQUFPO0FBQ2Isa0JBQU0sT0FBUSxFQUFFLE1BQU0seUJBQTBCLENBQUM7QUFDakQsZ0JBQUksS0FBSyxTQUFTLEVBQUcsUUFBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFBQSxVQUNoRDtBQUNBLGlCQUFPLEVBQUUsTUFBTSxLQUFLO0FBQUEsUUFDdEI7QUFDQSxjQUFNLE1BQU0sSUFBSSxNQUFNLE1BQU0sTUFBTTtBQUNsQyxZQUFJLE9BQU87QUFDWCxjQUFNLE9BQU87QUFDYix1QkFBZSxTQUFTO0FBQ3RCLGlCQUFPLE9BQU8sTUFBTSxRQUFRO0FBQzFCLGtCQUFNLElBQUk7QUFDVixrQkFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLFdBQVcsR0FBRyxLQUFLLE9BQU8sSUFBSSxHQUFHLENBQUM7QUFDM0QsZ0JBQUksQ0FBQyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsRUFBRSxNQUFNO0FBQUEsVUFDcEM7QUFBQSxRQUNGO0FBQ0EsY0FBTSxLQUFLLENBQUM7QUFDWixpQkFBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLElBQUksTUFBTSxRQUFRLElBQUssSUFBRyxLQUFLLE9BQU8sQ0FBQztBQUNuRSxjQUFNLFFBQVEsSUFBSSxFQUFFO0FBQ3BCLGVBQU8sRUFBRSxTQUFTLElBQUk7QUFBQSxNQUN4QjtBQUFBLE1BQ0EsTUFBTSxDQUFDLFNBQVMsSUFBSTtBQUFBLElBQ3RCLENBQUM7QUFFRCxRQUFJLFFBQVEsVUFBVSxrQkFBbUIsT0FBTSxJQUFJLE1BQU0scUJBQXFCO0FBRTlFLFVBQU0sUUFBUSxvQkFBSSxJQUFJO0FBQ3RCLFVBQU0sVUFBVSxRQUFRLFdBQVcsQ0FBQztBQUNwQyxhQUFTLElBQUksR0FBRyxJQUFJLEtBQUssUUFBUSxLQUFLO0FBQ3BDLFlBQU0sSUFBSSxLQUFLLENBQUMsRUFBRSxLQUFLLFFBQVEsQ0FBQyxHQUFHLFFBQVEsSUFBSTtBQUFBLElBQ2pEO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFFQSxXQUFTLG9CQUFvQixNQUFNO0FBQ2pDLFFBQUksQ0FBQyxLQUFNLFFBQU87QUFDbEIsVUFBTSxPQUFRLEtBQUsseUJBQTBCLENBQUM7QUFDOUMsUUFBSSxLQUFLLFdBQVcsRUFBRyxRQUFPO0FBQzlCLFVBQU0sS0FBSyxPQUFPLEtBQUssQ0FBQyxFQUFFLHVCQUF1QixFQUFFO0FBQ25ELFFBQUksR0FBRyxTQUFTLFFBQUcsRUFBRyxRQUFPO0FBQzdCLFFBQUksR0FBRyxTQUFTLGNBQUksRUFBRyxRQUFPO0FBRTlCLFdBQU87QUFBQSxFQUNUO0FBRUEsaUJBQWUsZ0JBQWdCLFNBQVMsV0FBVyxPQUFPLFlBQVksaUJBQWlCO0FBQ3JGLFVBQU0sSUFBSSxNQUFNLE1BQU0sR0FBRyxPQUFPLDJCQUEyQjtBQUFBLE1BQ3pELFFBQVE7QUFBQSxNQUNSLFNBQVM7QUFBQSxRQUNQLGdCQUFnQjtBQUFBLFFBQ2hCLEdBQUksYUFBYSxFQUFFLGtCQUFrQixXQUFXLElBQUksQ0FBQztBQUFBLE1BQ3ZEO0FBQUEsTUFDQSxNQUFNLEtBQUssVUFBVTtBQUFBLFFBQ25CO0FBQUEsUUFDQSxNQUFNO0FBQUEsUUFDTjtBQUFBLFFBQ0Esa0JBQWtCLG1CQUFtQjtBQUFBLE1BQ3ZDLENBQUM7QUFBQSxJQUNILENBQUM7QUFDRCxRQUFJLENBQUMsRUFBRSxHQUFJLE9BQU0sSUFBSSxNQUFNLDBCQUEwQixFQUFFLE1BQU0sTUFBTSxNQUFNLEVBQUUsS0FBSyxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUMsRUFBRTtBQUNsRyxXQUFPLE1BQU0sRUFBRSxLQUFLO0FBQUEsRUFDdEI7QUFVQSxNQUFNLHlCQUF5QjtBQUFBLElBQzdCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQVNBLGlCQUFlLG9CQUFvQixPQUFPO0FBQ3hDLFFBQUk7QUFDRixZQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxNQUFNLE9BQU8sVUFBVSxjQUFjO0FBQUEsUUFDeEQsUUFBUSxFQUFFLE1BQU07QUFBQSxRQUNoQixNQUFNLFlBQVk7QUFDaEIsZ0JBQU0sSUFBSSxlQUFlLFFBQVEsT0FBTztBQUN4QyxjQUFJLENBQUMsRUFBRyxRQUFPO0FBQ2YsY0FBSTtBQUdGLGtCQUFNLElBQUksTUFBTSxNQUFNLHVDQUF1QztBQUFBLGNBQzNELGFBQWE7QUFBQSxjQUNiLFNBQVMsRUFBRSxRQUFRLG9CQUFvQixlQUFlLFVBQVUsQ0FBQyxHQUFHO0FBQUEsWUFDdEUsQ0FBQztBQUVELG1CQUFPLEVBQUU7QUFBQSxVQUNYLFFBQVE7QUFDTixtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQ0QsYUFBTyxPQUFPLFdBQVcsWUFBWSxTQUFTO0FBQUEsSUFDaEQsUUFBUTtBQUNOLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQWlCQSxpQkFBZSw0QkFBNEIsT0FBTyxpQkFBaUI7QUFDakUsVUFBTSxVQUFVLGdCQUFnQixTQUFTO0FBRXpDLFFBQUksTUFBTTtBQUNWLFFBQUk7QUFDRixZQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxNQUFNLE9BQU8sVUFBVSxjQUFjO0FBQUEsUUFDeEQsUUFBUSxFQUFFLE1BQU07QUFBQSxRQUNoQixNQUFNLFlBQVk7QUFDaEIsZ0JBQU0sSUFBSSxlQUFlLFFBQVEsT0FBTztBQUN4QyxjQUFJLENBQUMsRUFBRyxRQUFPO0FBQ2YsY0FBSTtBQUNGLGtCQUFNLElBQUksTUFBTSxNQUFNLHVDQUF1QztBQUFBLGNBQzNELGFBQWE7QUFBQSxjQUNiLFNBQVMsRUFBRSxRQUFRLG9CQUFvQixlQUFlLFVBQVUsQ0FBQyxHQUFHO0FBQUEsWUFDdEUsQ0FBQztBQUNELGdCQUFJLENBQUMsRUFBRSxHQUFJLFFBQU87QUFDbEIsa0JBQU0sT0FBTyxNQUFNLEVBQUUsS0FBSztBQUMxQixtQkFBTyxNQUFNLE9BQU87QUFBQSxVQUN0QixRQUFRO0FBQ04sbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUlELFVBQUksVUFBVSxtQkFBbUIsS0FBSyxNQUFNLEVBQUcsT0FBTTtBQUFBLElBQ3ZELFNBQVMsR0FBRztBQUNWLGNBQVEsS0FBSyx5Q0FBeUMsR0FBRyxXQUFXLENBQUM7QUFBQSxJQUN2RTtBQUVBLFFBQUksT0FBTyxRQUFRLFNBQVM7QUFDMUIsd0JBQWtCLEVBQUUsR0FBRyxpQkFBaUIsT0FBTyxJQUFJO0FBQ25ELFlBQU0sT0FBTyxRQUFRLE1BQU0sSUFBSSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsTUFBTSxNQUFNO0FBQUEsTUFBQyxDQUFDO0FBUWxFLFlBQU0sdUJBQ0osV0FBVyxDQUFDLFFBQVEsV0FBVyxPQUFPLEtBQUssWUFBWTtBQUN6RCxVQUFJLHNCQUFzQjtBQUN4QixjQUFNLE9BQU8sUUFBUSxNQUFNLE9BQU8sa0JBQWtCLEVBQUUsTUFBTSxNQUFNO0FBQUEsUUFBQyxDQUFDO0FBQUEsTUFDdEU7QUFBQSxJQUNGO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFNQSxpQkFBZSxpQkFBaUI7QUFDOUIsUUFBSTtBQUNGLFlBQU0sRUFBRSxnQkFBZ0IsSUFBSSxNQUFNLE9BQU8sUUFBUSxNQUFNLElBQUksaUJBQWlCO0FBQzVFLGFBQU8sb0JBQW9CO0FBQUEsSUFDN0IsUUFBUTtBQUNOLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUVBLFdBQVMsc0JBQXNCLElBQUksYUFBYTtBQUM5QyxVQUFNLGNBQWMsY0FBYyxTQUFTLEdBQUcsUUFBUSxFQUFFLElBQUksR0FBRyxRQUFRO0FBQ3ZFLFVBQU0sTUFBTTtBQUFBLE1BQ1YsSUFBSSxHQUFHO0FBQUEsTUFDUCxZQUFZLEdBQUc7QUFBQSxNQUNmLE1BQU0sZUFBZSxHQUFHO0FBQUEsSUFDMUI7QUFDQSxRQUFJLEdBQUcsV0FBWSxLQUFJLFlBQVksR0FBRztBQUN0QyxRQUFJLEdBQUcsT0FBUSxLQUFJLFNBQVMsR0FBRztBQUMvQixXQUFPLFdBQVcsR0FBRztBQUFBLEVBQ3ZCO0FBU0EsV0FBUyxpQkFBaUIsT0FBTyxRQUFRLGFBQWE7QUFDcEQsUUFBSSxDQUFDLFVBQVUsV0FBVyxZQUFhLFFBQU87QUFDOUMsUUFBSSxPQUFPLFVBQVUsU0FBVSxRQUFPLE1BQU0sTUFBTSxNQUFNLEVBQUUsS0FBSyxXQUFXO0FBQzFFLFFBQUksTUFBTSxRQUFRLEtBQUssRUFBRyxRQUFPLE1BQU0sSUFBSSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxXQUFXLENBQUM7QUFDMUYsUUFBSSxTQUFTLE9BQU8sVUFBVSxVQUFVO0FBQ3RDLFlBQU0sTUFBTSxDQUFDO0FBQ2IsaUJBQVcsS0FBSyxNQUFPLEtBQUksQ0FBQyxJQUFJLGlCQUFpQixNQUFNLENBQUMsR0FBRyxRQUFRLFdBQVc7QUFDOUUsYUFBTztBQUFBLElBQ1Q7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUVBLFdBQVMscUJBQXFCLFFBQVEsaUJBQWlCLGFBQWE7QUFDbEUsVUFBTSxVQUFVLHNCQUFzQixpQkFBaUIsV0FBVztBQUNsRSxVQUFNLE1BQU0sUUFBUTtBQUNwQixVQUFNLE1BQU0sQ0FBQyxPQUFPO0FBRXBCLGVBQVcsTUFBTSx3QkFBd0I7QUFDdkMsWUFBTSxRQUFRLE9BQU8sRUFBRTtBQUN2QixVQUFJLENBQUMsU0FBUyxNQUFNLFdBQVcsRUFBRztBQUNsQyxVQUFJO0FBQ0osVUFBSSxlQUFlLEVBQUUsR0FBRztBQUN0QixpQkFBUyxlQUFlLEVBQUUsRUFBRSxPQUFPLEdBQUc7QUFBQSxNQUN4QyxXQUFXLGNBQWMsRUFBRSxHQUFHO0FBQzVCLGNBQU0sQ0FBQyxFQUFFLElBQUksY0FBYyxFQUFFO0FBQzdCLGlCQUFTLE1BQ04sT0FBTyxDQUFDLE9BQU8sTUFBTSxPQUFPLE9BQU8sUUFBUSxFQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQ3ZCLE9BQU8sQ0FBQyxNQUFNLE1BQU0sSUFBSTtBQUFBLE1BQzdCLE9BQU87QUFDTDtBQUFBLE1BQ0Y7QUFDQSxVQUFJLE9BQU8sYUFBYyxVQUFTLHFCQUFxQixNQUFNO0FBQzdELFVBQUksS0FBSyxHQUFHLE1BQU07QUFBQSxJQUNwQjtBQVdBLFVBQU0sT0FBTyxvQkFBSSxJQUFJO0FBQ3JCLFVBQU0sU0FBUyxDQUFDO0FBQ2hCLGVBQVcsS0FBSyxLQUFLO0FBQ25CLFlBQU0sTUFBTSxHQUFHLEVBQUUsWUFBWSxJQUFJLEVBQUUsRUFBRTtBQUNyQyxVQUFJLEtBQUssSUFBSSxHQUFHLEVBQUc7QUFDbkIsV0FBSyxJQUFJLEdBQUc7QUFDWixhQUFPLEtBQUssQ0FBQztBQUFBLElBQ2Y7QUFLQSw4QkFBMEIsUUFBUSxNQUFNO0FBQ3hDLCtCQUEyQixTQUFTLE1BQU07QUFFMUMsV0FBTztBQUFBLE1BQ0wsY0FBYztBQUFBLE1BQ2QsTUFBTTtBQUFBLE1BQ04sWUFBVyxvQkFBSSxLQUFLLEdBQUUsWUFBWSxFQUFFLFFBQVEsV0FBVyxHQUFHO0FBQUEsTUFDMUQsT0FBTyxPQUFPLElBQUksQ0FBQyxPQUFPO0FBQUEsUUFDeEIsU0FBUyxHQUFHLEVBQUUsWUFBWSxJQUFJLEVBQUUsRUFBRTtBQUFBLFFBQ2xDLFVBQVU7QUFBQSxNQUNaLEVBQUU7QUFBQSxJQUNKO0FBQUEsRUFDRjtBQVdBLE1BQU0scUJBQXFCO0FBRTNCLGlCQUFlLGlCQUFpQixRQUFRLFdBQVcsV0FBVztBQUc1RCxVQUFNLE1BQU0sb0JBQUksS0FBSztBQUNyQixVQUFNLE1BQU0sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxFQUFFLFNBQVMsR0FBRyxHQUFHO0FBQzVDLFVBQU0sTUFBTSxDQUFDLE1BQU0sR0FBRyxFQUFFLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRSxTQUFTLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBTWhGLFVBQU0sWUFBWSxPQUFPLGFBQWEsV0FBVyxHQUFHO0FBQ3BELFVBQU0sVUFBVSxVQUFVLFFBQVEsbUJBQW1CLEdBQUc7QUFDeEQsVUFBTSxVQUFVLENBQUMsT0FBTyxLQUFLLElBQUksTUFBTSxHQUFHLEVBQUUsRUFBRSxRQUFRLE1BQU0sRUFBRTtBQUM5RCxRQUFJLEdBQUc7QUFDUCxRQUFJLGNBQWMsVUFBVSxTQUFTLFVBQVUsTUFBTTtBQUNuRCxVQUFJLFFBQVEsVUFBVSxLQUFLLEtBQUssSUFBSSxHQUFHO0FBQ3ZDLFVBQUksUUFBUSxVQUFVLEdBQUcsS0FBSyxJQUFJLEdBQUc7QUFBQSxJQUN2QyxPQUFPO0FBQ0wsWUFBTSxhQUFhLElBQUksS0FBSyxHQUFHO0FBQy9CLGlCQUFXLFlBQVksV0FBVyxZQUFZLElBQUksQ0FBQztBQUNuRCxVQUFJLElBQUksVUFBVTtBQUNsQixVQUFJLElBQUksR0FBRztBQUFBLElBQ2I7QUFDQSxVQUFNLFdBQVcsT0FBTyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDekMsVUFBTSxPQUFPLEtBQUssVUFBVSxRQUFRLE1BQU0sQ0FBQztBQUMzQyxVQUFNLE9BQU8sUUFBUSxNQUFNLElBQUk7QUFBQSxNQUM3QixDQUFDLGtCQUFrQixHQUFHO0FBQUEsUUFDcEI7QUFBQSxRQUNBO0FBQUEsUUFDQSxPQUFPLEtBQUs7QUFBQSxRQUNaLGFBQWEsS0FBSyxJQUFJO0FBQUEsUUFDdEIsV0FBVyxhQUFhO0FBQUEsTUFDMUI7QUFBQSxJQUNGLENBQUM7QUFDRCxXQUFPLEVBQUUsVUFBVSxPQUFPLEtBQUssT0FBTztBQUFBLEVBQ3hDO0FBRUEsaUJBQWUsY0FBYyxFQUFFLE9BQU8sTUFBTSxTQUFTLFlBQVksU0FBUyxpQkFBaUIsV0FBVyxlQUFlLEdBQUc7QUFDdEgsaUJBQWE7QUFDYixVQUFNLE9BQU8sV0FBVyxXQUFXLFFBQVE7QUFFM0MsUUFBSSxDQUFDLGlCQUFpQjtBQUNwQixZQUFNLE9BQU8sUUFBUSxNQUFNLElBQUk7QUFBQSxRQUM3QixZQUFZO0FBQUEsVUFDVixTQUFTO0FBQUEsVUFDVCxVQUFVO0FBQUEsVUFDVixPQUFPO0FBQUEsVUFBUyxJQUFJLEtBQUssSUFBSTtBQUFBLFVBQUcsV0FBVyxLQUFLLElBQUk7QUFBQSxRQUN0RDtBQUFBLE1BQ0YsQ0FBQztBQUNEO0FBQUEsSUFDRjtBQUNBLFFBQUksQ0FBQyxPQUFPO0FBQ1YsWUFBTSxJQUFJLE1BQU0sd0RBQXdEO0FBQUEsSUFDMUU7QUFPQSxzQkFBa0IsTUFBTSw0QkFBNEIsT0FBTyxlQUFlO0FBSzFFLHFCQUFpQixFQUFFLFNBQVMsWUFBWSxXQUFXLGdCQUFnQixNQUFNO0FBS3pFLFVBQU0sTUFBTSxLQUFLLElBQUk7QUFHckIsVUFBTSxVQUFVLENBQUM7QUFDakIsUUFBSSxjQUFjO0FBQ2xCLFVBQU0sYUFBYSxDQUFDLFNBQVM7QUFDM0IsWUFBTSxNQUFNLEtBQUssSUFBSTtBQUNyQixjQUFRLEtBQUssRUFBRSxNQUFNLElBQUksTUFBTSxZQUFZLENBQUM7QUFDNUMsb0JBQWM7QUFBQSxJQUNoQjtBQUNBLFVBQU0sVUFBVTtBQUFBLE1BQ2QsU0FBUztBQUFBLE1BQU0sVUFBVTtBQUFBLE1BQWtCLE9BQU87QUFBQSxNQUNsRCxTQUFTO0FBQUEsTUFBSyxnQkFBZ0I7QUFBQSxNQUFHLE1BQU07QUFBQSxNQUFVLFFBQVEsQ0FBQztBQUFBLElBQzVELENBQUM7QUFVRCxVQUFNLFlBQVksa0JBQWtCLElBQUksQ0FBQyxPQUFPO0FBQzlDLFlBQU0sT0FBTyxHQUFHLG9CQUFvQixxQkFBcUIsR0FBRyxNQUFNLFNBQVMsSUFBSSxHQUFHO0FBQ2xGLGFBQU8sRUFBRSxNQUFNLEdBQUcsTUFBTSxLQUFLLE9BQU8sTUFBTSxRQUFRLE1BQU07QUFBQSxJQUMxRCxDQUFDO0FBQ0QsUUFBSSxjQUFjLFVBQVUsU0FBUyxVQUFVLE1BQU07QUFDbkQsY0FBUTtBQUFBLFFBQUk7QUFBQSxRQUNWLEdBQUcsVUFBVSxTQUFTLGFBQWEsV0FBTSxVQUFVLE9BQU8sYUFBYTtBQUFBLE1BQUU7QUFBQSxJQUM3RTtBQUVBLFFBQUk7QUFDSixRQUFJO0FBQ0YsT0FBQyxFQUFFLFFBQVEsV0FBVyxDQUFDLElBQUksTUFBTSxPQUFPLFVBQVUsY0FBYztBQUFBLFFBQzlELFFBQVEsRUFBRSxNQUFNO0FBQUEsUUFDaEIsTUFBTSxPQUFPLFVBQVU7QUFJckIsZ0JBQU0sUUFBUSxlQUFlLFFBQVEsT0FBTztBQUM1QyxjQUFJLENBQUMsTUFBTyxRQUFPLENBQUMsRUFBRSxPQUFPLGtCQUFrQixDQUFDO0FBQ2hELGdCQUFNLE9BQU8sVUFBVSxLQUFLO0FBRzVCLGNBQUksU0FBUyxLQUFLLFNBQVMsYUFBYSxLQUFLLFNBQVMsS0FBSyxTQUFTLE1BQU0sR0FBRztBQUMzRSxtQkFBTyxDQUFDLEVBQUUsT0FBTyxrQkFBa0IsQ0FBQztBQUFBLFVBQ3RDO0FBSUEseUJBQWUsU0FBUyxHQUFHLElBQUk7QUFDN0Isa0JBQU0sS0FBSyxJQUFJLGdCQUFnQjtBQUMvQixrQkFBTSxRQUFRLFdBQVcsTUFBTSxHQUFHLE1BQU0sR0FBRyxFQUFFO0FBQzdDLGdCQUFJO0FBQ0Ysb0JBQU0sSUFBSSxNQUFNLE1BQU0sRUFBRSxLQUFLO0FBQUEsZ0JBQzNCLFFBQVEsRUFBRTtBQUFBLGdCQUNWLGFBQWE7QUFBQSxnQkFDYixRQUFRLEdBQUc7QUFBQSxnQkFDWCxTQUFTLEVBQUUsVUFBVSxvQkFBb0IsaUJBQWlCLEtBQUs7QUFBQSxjQUNqRSxDQUFDO0FBQ0QsMkJBQWEsS0FBSztBQUNsQixvQkFBTSxLQUFLLEVBQUUsUUFBUSxJQUFJLGNBQWMsS0FBSztBQUM1QyxrQkFBSSxFQUFFLFdBQVcsT0FBTyxFQUFFLFdBQVcsS0FBSztBQUN4Qyx1QkFBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLE9BQU8sa0JBQWtCO0FBQUEsY0FDbEQ7QUFDQSxrQkFBSSxDQUFDLEVBQUUsR0FBSSxRQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sT0FBTyxRQUFRLEVBQUUsTUFBTSxHQUFHO0FBQzVELGtCQUFJLENBQUMsR0FBRyxTQUFTLGtCQUFrQixHQUFHO0FBQ3BDLHVCQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sT0FBTyxnQkFBZ0IsRUFBRSxJQUFJO0FBQUEsY0FDdEQ7QUFDQSxrQkFBSTtBQUNKLGtCQUFJO0FBQUUsdUJBQU8sTUFBTSxFQUFFLEtBQUs7QUFBQSxjQUFHLFNBQ3RCLEdBQUc7QUFBRSx1QkFBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLE9BQU8saUJBQWlCLEVBQUUsUUFBUTtBQUFBLGNBQUc7QUFDeEUscUJBQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxLQUFLO0FBQUEsWUFDOUIsU0FBUyxHQUFHO0FBQ1YsMkJBQWEsS0FBSztBQUNsQixrQkFBSSxFQUFFLFNBQVMsYUFBYyxRQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sT0FBTyxjQUFjO0FBQ3pFLHFCQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sT0FBTyxPQUFPLEdBQUcsV0FBVyxDQUFDLEVBQUU7QUFBQSxZQUN4RDtBQUFBLFVBQ0Y7QUFNQSxnQkFBTSxjQUFjO0FBQ3BCLGdCQUFNLFlBQVk7QUFDbEIsZ0JBQU0sVUFBVSxJQUFJLE1BQU0sTUFBTSxNQUFNO0FBQ3RDLGNBQUksVUFBVTtBQUNkLHlCQUFlLFNBQVM7QUFDdEIsbUJBQU8sVUFBVSxNQUFNLFFBQVE7QUFDN0Isb0JBQU0sSUFBSTtBQUNWLG9CQUFNLElBQUksUUFBUSxPQUFLLFdBQVcsR0FBRyxLQUFLLE9BQU8sSUFBSSxTQUFTLENBQUM7QUFDL0Qsc0JBQVEsQ0FBQyxJQUFJLE1BQU0sU0FBUyxNQUFNLENBQUMsR0FBRyxHQUFLO0FBQUEsWUFDN0M7QUFBQSxVQUNGO0FBQ0EsZ0JBQU0sVUFBVSxDQUFDO0FBQ2pCLG1CQUFTLElBQUksR0FBRyxJQUFJLGVBQWUsSUFBSSxNQUFNLFFBQVEsS0FBSztBQUN4RCxvQkFBUSxLQUFLLE9BQU8sQ0FBQztBQUFBLFVBQ3ZCO0FBQ0EsZ0JBQU0sUUFBUSxJQUFJLE9BQU87QUFDekIsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxNQUFNLENBQUMsU0FBUztBQUFBLE1BQ2xCLENBQUM7QUFBQSxJQUNILFNBQVMsR0FBRztBQUNWLFlBQU0sSUFBSSxNQUFNLHlCQUF5QixFQUFFLE9BQU8sRUFBRTtBQUFBLElBQ3REO0FBR0EsUUFBSSxXQUFXLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxpQkFBaUIsR0FBRztBQUN6RCxZQUFNLElBQUksTUFBTSxxQkFBcUI7QUFBQSxJQUN2QztBQUVBLFVBQU0sU0FBUyxDQUFDO0FBU2hCLGFBQVMsWUFBWSxNQUFNO0FBQ3pCLFVBQUksTUFBTSxRQUFRLElBQUksRUFBRyxRQUFPO0FBQ2hDLFVBQUksQ0FBQyxRQUFRLE9BQU8sU0FBUyxTQUFVLFFBQU8sQ0FBQztBQUMvQyxVQUFJLFlBQVksT0FBTyxRQUFRLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxNQUFNLFFBQVEsQ0FBQyxDQUFDO0FBQ3hFLFVBQUksVUFBVSxXQUFXLEVBQUcsUUFBTyxDQUFDO0FBQ3BDLFVBQUksVUFBVSxXQUFXLEVBQUcsUUFBTyxVQUFVLENBQUMsRUFBRSxDQUFDO0FBSWpELFlBQU0sWUFBWTtBQUNsQixZQUFNLFdBQVcsVUFBVSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDO0FBQzdELFVBQUksU0FBUyxXQUFXLEVBQUcsUUFBTyxTQUFTLENBQUMsRUFBRSxDQUFDO0FBQy9DLFVBQUksU0FBUyxXQUFXLEVBQUcsUUFBTyxVQUFVLENBQUMsRUFBRSxDQUFDO0FBQ2hELGtCQUFZO0FBR1osWUFBTSxTQUFTLENBQUM7QUFDaEIsaUJBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxXQUFXO0FBQzlCLG1CQUFXLFFBQVEsR0FBRztBQUNwQixjQUFJLFFBQVEsT0FBTyxTQUFTLFVBQVU7QUFDcEMsbUJBQU8sS0FBSyxFQUFFLEdBQUcsTUFBTSxXQUFXLEVBQUUsQ0FBQztBQUFBLFVBQ3ZDLE9BQU87QUFDTCxtQkFBTyxLQUFLLElBQUk7QUFBQSxVQUNsQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFHQSxVQUFNLFVBQVUsV0FBVyxJQUFJLENBQUMsR0FBRyxNQUFNO0FBQ3ZDLFlBQU0sS0FBSyxrQkFBa0IsQ0FBQztBQUM5QixVQUFJLEVBQUUsT0FBTztBQUNYLGVBQU8sRUFBRSxRQUFRLFlBQVksUUFBUSxFQUFFLFNBQVMsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLEtBQUssR0FBRyxFQUFFO0FBQUEsTUFDN0U7QUFDQSxZQUFNLE9BQU8sWUFBWSxFQUFFLElBQUk7QUFPL0IsWUFBTSxRQUFRLENBQUM7QUFDZixpQkFBVyxNQUFNLE1BQU07QUFDckIsY0FBTUMsS0FBSSxHQUFHLE1BQU0sRUFBRTtBQUNyQixZQUFJQSxPQUFNLFFBQVFBLE9BQU0sT0FBVztBQUNuQyxZQUFJLE1BQU0sUUFBUUEsRUFBQyxHQUFHO0FBQ3BCLHFCQUFXLEtBQUtBLEdBQUcsS0FBSSxFQUFHLE9BQU0sS0FBSyxDQUFDO0FBQUEsUUFDeEMsT0FBTztBQUNMLGdCQUFNLEtBQUtBLEVBQUM7QUFBQSxRQUNkO0FBQUEsTUFDRjtBQUdBLFVBQUksYUFBYTtBQUNqQixVQUFJLEtBQUssU0FBUyxLQUFLLE1BQU0sV0FBVyxHQUFHO0FBSXpDLHFCQUFhLEtBQUssVUFBVTtBQUFBLFVBQzFCLGNBQWMsTUFBTSxRQUFRLEVBQUUsSUFBSSxJQUFJLE9BQU8sT0FBTyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRTtBQUFBLFVBQ2xGLFVBQVUsTUFBTSxRQUFRLEVBQUUsSUFBSTtBQUFBLFVBQzlCLFdBQVcsS0FBSyxDQUFDLEtBQUs7QUFBQSxVQUN0QixZQUFZLEtBQUssQ0FBQyxLQUFLO0FBQUEsUUFDekIsQ0FBQyxFQUFFLE1BQU0sR0FBRyxHQUFJO0FBQUEsTUFDbEI7QUFDQSxhQUFPLEVBQUUsUUFBUSxhQUFhLE9BQU8sRUFBRSxJQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVEsWUFBWSxTQUFTLEtBQUssRUFBRTtBQUFBLElBQ3hHLENBQUM7QUFFRCxlQUFXLGNBQWM7QUFPekIsVUFBTSxTQUFTLGtCQUFrQixVQUFVLENBQUMsTUFBTSxFQUFFLFNBQVMsWUFBWTtBQUN6RSxRQUFJLFVBQVUsS0FBSyxRQUFRLE1BQU0sRUFBRSxXQUFXLGFBQWE7QUFDekQsWUFBTSxTQUFTLFFBQVEsTUFBTSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2pELFVBQUksT0FBTyxTQUFTLEdBQUc7QUFDckIsY0FBTSxVQUFVO0FBQUEsVUFDZCxVQUFVLDBCQUFTLE9BQU8sTUFBTTtBQUFBLFFBQ2xDLENBQUM7QUFDRCxZQUFJO0FBQ0YsZ0JBQU0sWUFBWSxNQUFNLDRCQUE0QjtBQUFBLFlBQ2xEO0FBQUEsWUFBTyxTQUFTO0FBQUEsWUFBTTtBQUFBLFVBQ3hCLENBQUM7QUFFRCxnQkFBTSxZQUFZLENBQUM7QUFDbkIsbUJBQVMsSUFBSSxHQUFHLElBQUksT0FBTyxRQUFRLEtBQUs7QUFDdEMsa0JBQU0sU0FBUyxXQUFXLElBQUksQ0FBQyxLQUFLO0FBQ3BDLGtCQUFNLE1BQU0sb0JBQW9CLE1BQU0sS0FBSztBQUMzQyxrQkFBTSxLQUFLLDZCQUE2QixPQUFPLENBQUMsR0FBRyxHQUFHO0FBQ3RELGdCQUFJLEdBQUksV0FBVSxLQUFLLEVBQUU7QUFBQSxVQUMzQjtBQUNBLGtCQUFRLE1BQU0sRUFBRSxNQUFNLFFBQVE7QUFDOUIsa0JBQVEsTUFBTSxFQUFFLE1BQU0sWUFBWSxVQUFVO0FBQUEsUUFDOUMsU0FBUyxHQUFHO0FBQ1YsaUJBQU8sS0FBSyxxQkFBcUIsRUFBRSxPQUFPLEVBQUU7QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQ0EsZUFBVyxrQkFBa0I7QUFXN0IsVUFBTSxTQUFTLGtCQUFrQixVQUFVLENBQUMsTUFBTSxFQUFFLFNBQVMsU0FBUztBQUN0RSxRQUFJLFVBQVUsS0FBSyxRQUFRLE1BQU0sRUFBRSxXQUFXLGFBQWE7QUFDekQsWUFBTSxTQUFTLFFBQVEsTUFBTSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2pELFVBQUksT0FBTyxTQUFTLEdBQUc7QUFDckIsY0FBTSxVQUFVO0FBQUEsVUFDZCxVQUFVLDBCQUFTLE9BQU8sTUFBTTtBQUFBLFFBQ2xDLENBQUM7QUFDRCxZQUFJO0FBQ0YsZ0JBQU0sVUFBVSxNQUFNLDBCQUEwQjtBQUFBLFlBQzlDO0FBQUEsWUFBTyxTQUFTO0FBQUEsWUFBTTtBQUFBLFVBQ3hCLENBQUM7QUFDRCxrQkFBUSxNQUFNLEVBQUUsTUFBTSxRQUFRO0FBQzlCLGtCQUFRLE1BQU0sRUFBRSxNQUFNLFlBQVksUUFBUTtBQUMxQyxrQkFBUSxNQUFNLEVBQUUsTUFBTSxhQUFhLE9BQU87QUFBQSxRQUM1QyxTQUFTLEdBQUc7QUFDVixpQkFBTyxLQUFLLG1CQUFtQixFQUFFLE9BQU8sRUFBRTtBQUFBLFFBQzVDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDQSxlQUFXLGdCQUFnQjtBQUUzQixVQUFNLFNBQVMsa0JBQWtCLFVBQVUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxhQUFhO0FBQzFFLFFBQUksVUFBVSxLQUFLLFFBQVEsTUFBTSxFQUFFLFdBQVcsYUFBYTtBQUN6RCxZQUFNLFNBQVMsUUFBUSxNQUFNLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDakQsVUFBSSxPQUFPLFNBQVMsR0FBRztBQUNyQixjQUFNLFVBQVU7QUFBQSxVQUNkLFVBQVUsMEJBQVMsT0FBTyxNQUFNO0FBQUEsUUFDbEMsQ0FBQztBQUNELFlBQUk7QUFDRixnQkFBTSxZQUFZLE1BQU0sNkJBQTZCO0FBQUEsWUFDbkQ7QUFBQSxZQUFPLFNBQVM7QUFBQSxZQUFNO0FBQUEsVUFDeEIsQ0FBQztBQUNELGtCQUFRLE1BQU0sRUFBRSxNQUFNLFFBQVE7QUFHOUIsa0JBQVEsTUFBTSxFQUFFLE1BQU0sYUFBYSxPQUFPO0FBQzFDLGtCQUFRLE1BQU0sRUFBRSxNQUFNLFlBQVksVUFBVTtBQUFBLFFBQzlDLFNBQVMsR0FBRztBQUNWLGlCQUFPLEtBQUssdUJBQXVCLEVBQUUsT0FBTyxFQUFFO0FBQUEsUUFDaEQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUNBLGVBQVcsbUJBQW1CO0FBRzlCLFVBQU0sU0FBUyxDQUFDO0FBQ2hCLFFBQUksWUFBWTtBQUNoQixRQUFJLGdCQUFnQjtBQVNwQixVQUFNLFlBQVksQ0FBQztBQUNuQixhQUFTLElBQUksR0FBRyxJQUFJLFFBQVEsUUFBUSxLQUFLO0FBQ3ZDLFlBQU0sS0FBSyxrQkFBa0IsQ0FBQztBQUM5QixZQUFNLElBQUksUUFBUSxDQUFDO0FBQ25CLFlBQU0sUUFBUSxrQkFBa0IsR0FBRyxJQUFJLEtBQUssR0FBRztBQUMvQyxVQUFJLEVBQUUsV0FBVyxZQUFZO0FBQzNCLGVBQU8sS0FBSyxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsT0FBTyxPQUFPLEVBQUU7QUFDN0Msa0JBQVUsS0FBSyxVQUFLLEtBQUssZ0NBQU87QUFDaEM7QUFBQSxNQUNGO0FBQ0EsWUFBTSxFQUFFLE9BQU8sVUFBVSxJQUFJLEVBQUU7QUFDL0IsbUJBQWE7QUFDYix1QkFBaUIsTUFBTTtBQUN2QixVQUFJLGNBQWMsRUFBRztBQUNyQixVQUFJLE1BQU0sU0FBUyxhQUFhLFlBQVksR0FBRztBQUk3QyxrQkFBVSxLQUFLLEdBQUcsS0FBSyxTQUFJLFNBQVMsa0JBQVEsTUFBTSxNQUFNLFNBQUk7QUFBQSxNQUM5RCxPQUFPO0FBQ0wsa0JBQVUsS0FBSyxHQUFHLEtBQUssU0FBSSxNQUFNLE1BQU0sU0FBSTtBQUFBLE1BQzdDO0FBSUEsVUFBSSxZQUFZLEtBQUssTUFBTSxXQUFXLEdBQUc7QUFDdkMsWUFBSTtBQUNGLGdCQUFNLE9BQU8sUUFBUSxNQUFNLElBQUk7QUFBQSxZQUM3QixDQUFDLGdCQUFnQixHQUFHLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxjQUFjO0FBQUEsVUFDckQsQ0FBQztBQUFBLFFBQ0gsUUFBUTtBQUFBLFFBQUM7QUFBQSxNQUNYO0FBQ0EsVUFBSSxNQUFNLFdBQVcsRUFBRztBQUN4QixPQUFDLE9BQU8sR0FBRyxTQUFTLElBQUksT0FBTyxHQUFHLFNBQVMsS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUs7QUFBQSxJQUNuRTtBQU1BLFVBQU0sY0FBYyxNQUFNLGVBQWU7QUFDekMsUUFBSSxlQUFlLGdCQUFnQixNQUFNO0FBQ3ZDLFlBQU0sY0FBYyxTQUFTLGdCQUFnQixJQUFJO0FBQ2pELGlCQUFXLE9BQU8sT0FBTyxLQUFLLE1BQU0sR0FBRztBQUNyQyxlQUFPLEdBQUcsSUFBSSxpQkFBaUIsT0FBTyxHQUFHLEdBQUcsZ0JBQWdCLE1BQU0sV0FBVztBQUFBLE1BQy9FO0FBQUEsSUFDRjtBQUVBLFFBQUksUUFBUTtBQUNaLFFBQUksaUJBQWlCO0FBQ3JCLFFBQUksU0FBUyxTQUFTO0FBQ3BCLFVBQUksV0FBWSxPQUFNLElBQUksTUFBTSxZQUFZO0FBQzVDLFlBQU0sVUFBVSxFQUFFLFVBQVUsb0VBQWdCLGdCQUFnQixFQUFFLENBQUM7QUFDL0QsVUFBSTtBQUNKLFVBQUk7QUFDRixpQkFBUyxxQkFBcUIsUUFBUSxpQkFBaUIsV0FBVztBQUFBLE1BQ3BFLFNBQVMsR0FBRztBQUNWLGVBQU8sS0FBSyxrQkFBa0IsRUFBRSxPQUFPLEVBQUU7QUFDekMsaUJBQVM7QUFBQSxNQUNYO0FBQ0EsVUFBSSxRQUFRO0FBQ1YsZ0JBQVEsT0FBTyxNQUFNO0FBQ3JCLGNBQU0sVUFBVSxFQUFFLFVBQVUsMEJBQVMsS0FBSyxtQ0FBZSxnQkFBZ0IsTUFBTSxDQUFDO0FBQ2hGLFlBQUk7QUFDRixnQkFBTSxLQUFLLE1BQU0saUJBQWlCLFFBQVEsZ0JBQWdCLE9BQU8sU0FBUztBQUMxRSwyQkFBaUIsR0FBRztBQUFBLFFBQ3RCLFNBQVMsR0FBRztBQUNWLGlCQUFPLEtBQUssaUJBQWlCLEVBQUUsT0FBTyxFQUFFO0FBQUEsUUFDMUM7QUFBQSxNQUNGO0FBQUEsSUFDRixPQUFPO0FBTUwsWUFBTSxpQkFBaUIsZUFBZSxnQkFBZ0IsT0FDbEQsRUFBRSxHQUFHLGlCQUFpQixNQUFNLFNBQVMsZ0JBQWdCLElBQUksRUFBRSxJQUMzRDtBQUNKLGlCQUFXLENBQUMsV0FBVyxLQUFLLEtBQUssT0FBTyxRQUFRLE1BQU0sR0FBRztBQUN2RCxZQUFJLFdBQVksT0FBTSxJQUFJLE1BQU0sWUFBWTtBQUM1QyxjQUFNLFVBQVU7QUFBQSxVQUNkLFVBQVUsNkJBQVMsU0FBUyxTQUFJLE1BQU0sTUFBTTtBQUFBLFVBQzVDLGdCQUFnQjtBQUFBLFFBQ2xCLENBQUM7QUFDRCxZQUFJO0FBQ0YsZ0JBQU0sT0FBTyxNQUFNLGdCQUFnQixTQUFTLFdBQVcsT0FBTyxZQUFZLGNBQWM7QUFDeEYsbUJBQVMsS0FBSyxTQUFTO0FBQUEsUUFDekIsU0FBUyxHQUFHO0FBQ1YsaUJBQU8sS0FBSyxVQUFVLFNBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUFBLFFBQ2pEO0FBQUEsTUFDRjtBQVdBLFVBQUksZ0JBQWdCLFNBQVMsUUFBUSxHQUFHO0FBQ3RDLFlBQUk7QUFDRixnQkFBTSxVQUFVLEVBQUUsVUFBVSxvRUFBZ0IsZ0JBQWdCLE1BQU0sQ0FBQztBQUluRSxnQkFBTSxVQUFVLGdCQUFnQixnQkFBZ0IsS0FBSztBQUNyRCxnQkFBTSxTQUFTLEdBQUcsT0FBTyx3QkFBd0IsbUJBQW1CLE9BQU8sQ0FBQztBQUM1RSxnQkFBTSxJQUFJLE1BQU0sTUFBTSxRQUFRO0FBQUEsWUFDNUIsU0FBUyxhQUFhLEVBQUUsa0JBQWtCLFdBQVcsSUFBSSxDQUFDO0FBQUEsVUFDNUQsQ0FBQztBQUNELGNBQUksRUFBRSxJQUFJO0FBQ1Isa0JBQU0sU0FBUyxNQUFNLEVBQUUsS0FBSztBQUk1QixrQkFBTSxLQUFLLE1BQU0saUJBQWlCLFFBQVEsZ0JBQWdCLE9BQU8sU0FBUztBQUMxRSw2QkFBaUIsR0FBRztBQVlwQixnQkFBSSxNQUFNLFFBQVEsT0FBTyxLQUFLLEtBQUssT0FBTyxNQUFNLFNBQVMsR0FBRztBQUMxRCxzQkFBUSxPQUFPLE1BQU07QUFBQSxZQUN2QjtBQUFBLFVBQ0YsT0FBTztBQUNMLG1CQUFPLEtBQUssdUJBQXVCLEVBQUUsTUFBTSxFQUFFO0FBQUEsVUFDL0M7QUFBQSxRQUNGLFNBQVMsR0FBRztBQUNWLGlCQUFPLEtBQUssa0JBQWtCLEVBQUUsT0FBTyxFQUFFO0FBQUEsUUFDM0M7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUNBLGVBQVcsU0FBUyxVQUFVLG1CQUFtQixnQkFBZ0I7QUFJakUsVUFBTSxhQUFhLEtBQUssSUFBSSxJQUFJO0FBQ2hDLFVBQU0sY0FBYyxhQUFhLE1BQzdCLElBQUksYUFBYSxLQUFNLFFBQVEsQ0FBQyxDQUFDLE1BQ2pDLEdBQUcsS0FBSyxNQUFNLGFBQWEsR0FBTSxDQUFDLElBQUksS0FBSyxNQUFPLGFBQWEsTUFBVSxHQUFJLENBQUM7QUFHbEYsVUFBTSxhQUFhO0FBQ25CLFVBQU0sZUFBZSxTQUFTLFVBQVUsdUJBQVE7QUFLaEQsVUFBTSxjQUFjLFFBQVEsSUFBSSxDQUFDLE1BQU0sVUFBSyxFQUFFLElBQUksS0FBSyxFQUFFLEtBQUssS0FBTSxRQUFRLENBQUMsQ0FBQyxHQUFHO0FBQ2pGLFVBQU0saUJBQWlCLENBQUMsR0FBRyxXQUFXLEdBQUcsV0FBVztBQVVwRCxRQUFJO0FBQ0osUUFBSSxPQUFPLFFBQVE7QUFDakIscUJBQWUsOENBQWEsWUFBWSxJQUFJLEtBQUssd0NBQVUsT0FBTyxNQUFNLDRCQUFRLFdBQVcsU0FBSSxVQUFVO0FBQUEsSUFDM0csV0FBVyxVQUFVLEdBQUc7QUFDdEIscUJBQ0UsOEZBQW1CLFdBQVc7QUFBQSxJQUVsQyxPQUFPO0FBQ0wscUJBQWUsd0NBQVksWUFBWSxJQUFJLEtBQUssd0NBQVUsV0FBVyxTQUFJLFVBQVU7QUFBQSxJQUNyRjtBQUVBLFVBQU0sVUFBVTtBQUFBLE1BQ2QsU0FBUztBQUFBLE1BQ1QsVUFBVTtBQUFBLE1BQ1YsT0FBTztBQUFBLE1BQ1AsZ0JBQWdCO0FBQUEsTUFDaEIsV0FBVyxLQUFLLElBQUk7QUFBQSxNQUNwQixXQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtYLFdBQVc7QUFBQSxNQUNYO0FBQUEsTUFDQSxRQUFRLGdCQUFnQjtBQUFBLE1BQ3hCO0FBQUEsTUFDQSxlQUFlO0FBQUEsSUFDakIsQ0FBQztBQU1ELFFBQUksU0FBUyxRQUFTLEtBQUk7QUFDeEIsWUFBTSxNQUFNLEdBQUcsT0FBTyxhQUFhO0FBQUEsUUFDakMsUUFBUTtBQUFBLFFBQ1IsU0FBUztBQUFBLFVBQ1AsZ0JBQWdCO0FBQUEsVUFDaEIsR0FBSSxhQUFhLEVBQUUsa0JBQWtCLFdBQVcsSUFBSSxDQUFDO0FBQUEsUUFDdkQ7QUFBQSxRQUNBLE1BQU0sS0FBSyxVQUFVO0FBQUEsVUFDbkIsUUFBUSxPQUFPLFNBQVMsWUFBWTtBQUFBLFVBQ3BDLFlBQVksZ0JBQWdCLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUlyQyxjQUFjLGNBQ1YsU0FBUyxnQkFBZ0IsUUFBUSxFQUFFLElBQ25DLGdCQUFnQixRQUFRO0FBQUEsVUFDNUI7QUFBQSxVQUNBO0FBQUEsVUFDQSxZQUFZLGtCQUFrQjtBQUFBLFVBQzlCLFlBQVk7QUFBQSxVQUNaLFlBQVksSUFBSSxLQUFLLEdBQUcsRUFBRSxZQUFZO0FBQUEsVUFDdEM7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNILENBQUM7QUFBQSxJQUNILFNBQVMsR0FBRztBQUNWLGNBQVEsS0FBSywyQ0FBMkMsQ0FBQztBQUFBLElBQzNEO0FBQ0EscUJBQWlCO0FBQUEsRUFDbkI7QUFPQSxNQUFNLHVCQUF1QjtBQUFBLElBQzNCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBRUEsaUJBQWUscUJBQXFCO0FBQ2xDLFFBQUk7QUFDRixZQUFNLFNBQVMsTUFBTSxPQUFPLFFBQVEsS0FBSyxJQUFJLG9CQUFvQjtBQUNqRSxZQUFNLFVBQVUsT0FBTztBQUFBLFFBQ3JCLE9BQU8sUUFBUSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sTUFBTSxNQUFTO0FBQUEsTUFDMUQ7QUFDQSxVQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUUsV0FBVyxFQUFHO0FBQ3ZDLFlBQU0sUUFBUSxNQUFNLE9BQU8sUUFBUSxNQUFNLElBQUksT0FBTyxLQUFLLE9BQU8sQ0FBQztBQUVqRSxZQUFNLFVBQVUsT0FBTztBQUFBLFFBQ3JCLE9BQU8sUUFBUSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxNQUFNLE1BQVM7QUFBQSxNQUNoRTtBQUNBLFVBQUksT0FBTyxLQUFLLE9BQU8sRUFBRSxTQUFTLEdBQUc7QUFDbkMsY0FBTSxPQUFPLFFBQVEsTUFBTSxJQUFJLE9BQU87QUFBQSxNQUN4QztBQUNBLFlBQU0sT0FBTyxRQUFRLEtBQUssT0FBTyxPQUFPLEtBQUssT0FBTyxDQUFDO0FBQUEsSUFDdkQsUUFBUTtBQUFBLElBRVI7QUFBQSxFQUNGO0FBRUEsU0FBTyxRQUFRLFlBQVksWUFBWSxZQUFZO0FBQ2pELFVBQU0sbUJBQW1CO0FBQUEsRUFDM0IsQ0FBQztBQUlELFNBQU8sUUFBUSxXQUFXLGNBQWMsTUFBTTtBQUM1Qyx1QkFBbUI7QUFBQSxFQUNyQixDQUFDO0FBQ0QscUJBQW1CO0FBRW5CLFNBQU8sUUFBUSxVQUFVLFlBQVksQ0FBQyxLQUFLLFFBQVEsaUJBQWlCO0FBQ2xFLFFBQUksS0FBSyxTQUFTLG1CQUFtQjtBQUNuQyxvQkFBYyxJQUFJLE9BQU8sRUFBRTtBQUFBLFFBQ3pCLE1BQU07QUFBRSxjQUFJO0FBQUUseUJBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQztBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUFFO0FBQUEsUUFDckQsT0FBTyxNQUFNO0FBQ1gsY0FBSSxHQUFHLFlBQVksY0FBYztBQUMvQixnQkFBSTtBQUFFLDJCQUFhLEVBQUUsSUFBSSxNQUFNLFdBQVcsS0FBSyxDQUFDO0FBQUEsWUFBRyxRQUFRO0FBQUEsWUFBQztBQUM1RDtBQUFBLFVBQ0Y7QUFDQSxjQUFJLEdBQUcsWUFBWSx1QkFBdUI7QUFDeEMsa0JBQU0sT0FBTyxRQUFRLE1BQU0sSUFBSTtBQUFBLGNBQzdCLFlBQVk7QUFBQSxnQkFDVixTQUFTO0FBQUEsZ0JBQ1QsVUFBVTtBQUFBLGdCQUNWLE9BQU87QUFBQSxnQkFDUCxJQUFJLEtBQUssSUFBSTtBQUFBLGdCQUFHLFdBQVcsS0FBSyxJQUFJO0FBQUEsY0FDdEM7QUFBQSxZQUNGLENBQUM7QUFDRCxnQkFBSTtBQUFFLDJCQUFhLEVBQUUsSUFBSSxPQUFPLFNBQVMsS0FBSyxDQUFDO0FBQUEsWUFBRyxRQUFRO0FBQUEsWUFBQztBQUMzRDtBQUFBLFVBQ0Y7QUFDQSxrQkFBUSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZDLGdCQUFNLFVBQVUsRUFBRSxTQUFTLE9BQU8sVUFBVSxVQUFLLEVBQUUsT0FBTyxJQUFJLE9BQU8sUUFBUSxDQUFDO0FBQzlFLGNBQUk7QUFBRSx5QkFBYSxFQUFFLElBQUksT0FBTyxPQUFPLEVBQUUsUUFBUSxDQUFDO0FBQUEsVUFBRyxRQUFRO0FBQUEsVUFBQztBQUFBLFFBQ2hFO0FBQUEsTUFDRjtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsWUFBWTtBQUk1QixtQkFBYTtBQUtiLFlBQU0sTUFBTTtBQUNaLFVBQUksS0FBSyxhQUFhLElBQUksU0FBUztBQUNqQyxTQUFDLFlBQVk7QUFDWCxjQUFJO0FBQ0Ysa0JBQU07QUFBQSxjQUNKLEdBQUcsSUFBSSxPQUFPLGlCQUFpQixtQkFBbUIsSUFBSSxTQUFTLENBQUM7QUFBQSxjQUNoRTtBQUFBLGdCQUNFLFFBQVE7QUFBQSxnQkFDUixTQUFTLElBQUksYUFBYSxFQUFFLGtCQUFrQixJQUFJLFdBQVcsSUFBSSxDQUFDO0FBQUEsY0FDcEU7QUFBQSxZQUNGO0FBRUEsa0JBQU0sUUFBUSxNQUFNLE9BQU8sUUFBUSxNQUFNLElBQUksV0FBVyxHQUFHLFdBQVcsS0FBSyxDQUFDO0FBQzVFLGtCQUFNLE9BQU8sUUFBUSxNQUFNLElBQUk7QUFBQSxjQUM3QixDQUFDLFdBQVcsR0FBRztBQUFBLGdCQUNiLEdBQUc7QUFBQSxnQkFDSCxTQUFTO0FBQUEsZ0JBQ1QsVUFBVTtBQUFBLGdCQUNWLE9BQU87QUFBQSxnQkFDUCxJQUFJLEtBQUssSUFBSTtBQUFBLGdCQUNiLFdBQVcsS0FBSyxJQUFJO0FBQUEsY0FDdEI7QUFBQSxZQUNGLENBQUM7QUFBQSxVQUNILFNBQVMsR0FBRztBQUNWLG9CQUFRLEtBQUssa0NBQWtDLENBQUM7QUFBQSxVQUNsRDtBQUFBLFFBQ0YsR0FBRztBQUFBLE1BQ0w7QUFDQSx1QkFBaUI7QUFDakIsVUFBSTtBQUFFLHFCQUFhLEVBQUUsSUFBSSxLQUFLLENBQUM7QUFBQSxNQUFHLFFBQVE7QUFBQSxNQUFDO0FBQzNDLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsaUJBQWlCO0FBQ2pDLGFBQU8sUUFBUSxNQUFNLElBQUksV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUFTLGFBQWEsS0FBSyxXQUFXLEtBQUssSUFBSSxDQUFDO0FBQzVGLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsbUJBQW1CO0FBQ25DLGFBQU8sUUFBUSxNQUFNLE9BQU8sV0FBVyxFQUFFLEtBQUssTUFBTSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQztBQUM5RSxhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLGlCQUFpQjtBQUNqQywwQkFBb0IsSUFBSSxLQUFLLEVBQUU7QUFBQSxRQUM3QixDQUFDLFVBQVU7QUFBRSxjQUFJO0FBQUUseUJBQWEsRUFBRSxVQUFVLE1BQU0sQ0FBQztBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUFFO0FBQUEsUUFDakUsTUFBTTtBQUFFLGNBQUk7QUFBRSx5QkFBYSxFQUFFLFVBQVUsS0FBSyxDQUFDO0FBQUEsVUFBRyxRQUFRO0FBQUEsVUFBQztBQUFBLFFBQUU7QUFBQSxNQUM3RDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBS0QsU0FBTyxPQUFPLE9BQU8sZ0JBQWdCLEVBQUUsaUJBQWlCLEtBQUssQ0FBQztBQUM5RCxTQUFPLE9BQU8sUUFBUSxZQUFZLE1BQU07QUFBQSxFQUFxQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJCdWZmZXIiLCAiYmxvY2tzIiwgImV4cG9ydHMiLCAibWFwU3lzdGVtIiwgImVzY2FwZVJlZ2V4IiwgImhpdCIsICJjamtDaGFycyIsICJvYnNJZCIsICJtYXBTeXN0ZW0iLCAiciJdCn0K
