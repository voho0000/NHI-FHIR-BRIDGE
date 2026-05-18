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
  function adaptLabItem(item) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(
      item.reaL_INSPECT_DATE || item.real_inspect_date || item.funC_DATE
    );
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
    other_labs: "\u6AA2\u9A57"
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
      chrome.storage.local.set({ patientOverride }).catch(() => {
      });
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9uaGktYWRhcHRlcnMuanMiLCAiLi4vc3JjL2JhY2tncm91bmQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG4gKiBbanMtc2hhMV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1zaGExfVxuICpcbiAqIEB2ZXJzaW9uIDAuNy4wXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMjRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4vKmpzbGludCBiaXR3aXNlOiB0cnVlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgSU5QVVRfRVJST1IgPSAnaW5wdXQgaXMgaW52YWxpZCB0eXBlJztcbiAgdmFyIEZJTkFMSVpFX0VSUk9SID0gJ2ZpbmFsaXplIGFscmVhZHkgY2FsbGVkJztcbiAgdmFyIFdJTkRPVyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnO1xuICB2YXIgcm9vdCA9IFdJTkRPVyA/IHdpbmRvdyA6IHt9O1xuICBpZiAocm9vdC5KU19TSEExX05PX1dJTkRPVykge1xuICAgIFdJTkRPVyA9IGZhbHNlO1xuICB9XG4gIHZhciBXRUJfV09SS0VSID0gIVdJTkRPVyAmJiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCc7XG4gIHZhciBOT0RFX0pTID0gIXJvb3QuSlNfU0hBMV9OT19OT0RFX0pTICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgaWYgKE5PREVfSlMpIHtcbiAgICByb290ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFdFQl9XT1JLRVIpIHtcbiAgICByb290ID0gc2VsZjtcbiAgfVxuICB2YXIgQ09NTU9OX0pTID0gIXJvb3QuSlNfU0hBMV9OT19DT01NT05fSlMgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHM7XG4gIHZhciBBTUQgPSB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQ7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAhcm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUiAmJiB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcbiAgdmFyIEVYVFJBID0gWy0yMTQ3NDgzNjQ4LCA4Mzg4NjA4LCAzMjc2OCwgMTI4XTtcbiAgdmFyIFNISUZUID0gWzI0LCAxNiwgOCwgMF07XG4gIHZhciBPVVRQVVRfVFlQRVMgPSBbJ2hleCcsICdhcnJheScsICdkaWdlc3QnLCAnYXJyYXlCdWZmZXInXTtcblxuICB2YXIgYmxvY2tzID0gW107XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICBpZiAocm9vdC5KU19TSEExX05PX05PREVfSlMgfHwgIWlzQXJyYXkpIHtcbiAgICBpc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3O1xuICBpZiAoQVJSQVlfQlVGRkVSICYmIChyb290LkpTX1NIQTFfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgfHwgIWlzVmlldykpIHtcbiAgICBpc1ZpZXcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmJ1ZmZlciAmJiBvYmouYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcjtcbiAgICB9O1xuICB9XG5cbiAgLy8gW21lc3NhZ2U6IHN0cmluZywgaXNTdHJpbmc6IGJvb2xdXG4gIHZhciBmb3JtYXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXNzYWdlO1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIFttZXNzYWdlLCB0cnVlXTtcbiAgICB9XG4gICAgaWYgKHR5cGUgIT09ICdvYmplY3QnIHx8IG1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChBUlJBWV9CVUZGRVIgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBbbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSksIGZhbHNlXTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KG1lc3NhZ2UpICYmICFpc1ZpZXcobWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGNyZWF0ZU91dHB1dE1ldGhvZCA9IGZ1bmN0aW9uIChvdXRwdXRUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IFNoYTEodHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2QgPSBjcmVhdGVPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIGlmIChOT0RFX0pTKSB7XG4gICAgICBtZXRob2QgPSBub2RlV3JhcChtZXRob2QpO1xuICAgIH1cbiAgICBtZXRob2QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKCk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuY3JlYXRlKCkudXBkYXRlKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPVVRQVVRfVFlQRVMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0eXBlID0gT1VUUFVUX1RZUEVTW2ldO1xuICAgICAgbWV0aG9kW3R5cGVdID0gY3JlYXRlT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIHZhciBub2RlV3JhcCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgICB2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgIHZhciBidWZmZXJGcm9tO1xuICAgIGlmIChCdWZmZXIuZnJvbSAmJiAhcm9vdC5KU19TSEExX05PX0JVRkZFUl9GUk9NKSB7XG4gICAgICBidWZmZXJGcm9tID0gQnVmZmVyLmZyb207XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlckZyb20gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihtZXNzYWdlKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBub2RlTWV0aG9kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKG1lc3NhZ2UsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSBudWxsIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG1lc3NhZ2UpIHx8IGlzVmlldyhtZXNzYWdlKSB8fFxuICAgICAgICBtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ1ZmZlckZyb20obWVzc2FnZSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGVNZXRob2Q7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSwgdHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlSG1hY01ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlSG1hY091dHB1dE1ldGhvZCgnaGV4Jyk7XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgSG1hY1NoYTEoa2V5KTtcbiAgICB9O1xuICAgIG1ldGhvZC51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZShrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QodHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRob2Q7XG4gIH07XG5cbiAgZnVuY3Rpb24gU2hhMShzaGFyZWRNZW1vcnkpIHtcbiAgICBpZiAoc2hhcmVkTWVtb3J5KSB7XG4gICAgICBibG9ja3NbMF0gPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICBibG9ja3NbOF0gPSBibG9ja3NbOV0gPSBibG9ja3NbMTBdID0gYmxvY2tzWzExXSA9XG4gICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICB9XG5cbiAgICB0aGlzLmgwID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmgxID0gMHhFRkNEQUI4OTtcbiAgICB0aGlzLmgyID0gMHg5OEJBRENGRTtcbiAgICB0aGlzLmgzID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmg0ID0gMHhDM0QyRTFGMDtcblxuICAgIHRoaXMuYmxvY2sgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMDtcbiAgICB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJzdCA9IHRydWU7XG4gIH1cblxuICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEZJTkFMSVpFX0VSUk9SKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShtZXNzYWdlKTtcbiAgICBtZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgIHZhciBpc1N0cmluZyA9IHJlc3VsdFsxXTtcbiAgICB2YXIgY29kZSwgaW5kZXggPSAwLCBpLCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCB8fCAwLCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgICAgIGJsb2Nrc1swXSA9IHRoaXMuYmxvY2s7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYoaXNTdHJpbmcpIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gY29kZSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvZGUgPSAweDEwMDAwICsgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhmMCB8IChjb2RlID4+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSB0aGlzLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgNjQ7ICsraW5kZXgpIHtcbiAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaTtcbiAgICAgIHRoaXMuYnl0ZXMgKz0gaSAtIHRoaXMuc3RhcnQ7XG4gICAgICBpZiAoaSA+PSA2NCkge1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGkgLSA2NDtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDA7XG4gICAgICB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgdmFyIGJsb2NrcyA9IHRoaXMuYmxvY2tzLCBpID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgIGJsb2Nrc1sxNl0gPSB0aGlzLmJsb2NrO1xuICAgIGJsb2Nrc1tpID4+PiAyXSB8PSBFWFRSQVtpICYgM107XG4gICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgaWYgKGkgPj0gNTYpIHtcbiAgICAgIGlmICghdGhpcy5oYXNoZWQpIHtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgfVxuICAgIGJsb2Nrc1sxNF0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjk7XG4gICAgYmxvY2tzWzE1XSA9IHRoaXMuYnl0ZXMgPDwgMztcbiAgICB0aGlzLmhhc2goKTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhID0gdGhpcy5oMCwgYiA9IHRoaXMuaDEsIGMgPSB0aGlzLmgyLCBkID0gdGhpcy5oMywgZSA9IHRoaXMuaDQ7XG4gICAgdmFyIGYsIGosIHQsIGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgZm9yKGogPSAxNjsgaiA8IDgwOyArK2opIHtcbiAgICAgIHQgPSBibG9ja3NbaiAtIDNdIF4gYmxvY2tzW2ogLSA4XSBeIGJsb2Nrc1tqIC0gMTRdIF4gYmxvY2tzW2ogLSAxNl07XG4gICAgICBibG9ja3Nbal0gPSAgKHQgPDwgMSkgfCAodCA+Pj4gMzEpO1xuICAgIH1cblxuICAgIGZvcihqID0gMDsgaiA8IDIwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IChhICYgYikgfCAoKH5hKSAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoKH5lKSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoKH5kKSAmIGEpO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IChjICYgZCkgfCAoKH5jKSAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgNDA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IGEgXiBiIF4gYztcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IGMgXiBkIF4gZTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDYwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSAtIDE4OTQwMDc1ODggKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKGEgJiBjKSB8IChiICYgYyk7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gKGUgJiBhKSB8IChlICYgYikgfCAoYSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoZCAmIGEpIHwgKGUgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKGMgJiBlKSB8IChkICYgZSk7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA4MDsgaiArPSA1KSB7XG4gICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSA4OTk0OTc1MTQgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSBkIF4gZSBeIGE7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IHRoaXMuaDAgKyBhIDw8IDA7XG4gICAgdGhpcy5oMSA9IHRoaXMuaDEgKyBiIDw8IDA7XG4gICAgdGhpcy5oMiA9IHRoaXMuaDIgKyBjIDw8IDA7XG4gICAgdGhpcy5oMyA9IHRoaXMuaDMgKyBkIDw8IDA7XG4gICAgdGhpcy5oNCA9IHRoaXMuaDQgKyBlIDw8IDA7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBoMCA9IHRoaXMuaDAsIGgxID0gdGhpcy5oMSwgaDIgPSB0aGlzLmgyLCBoMyA9IHRoaXMuaDMsIGg0ID0gdGhpcy5oNDtcblxuICAgIHJldHVybiBIRVhfQ0hBUlNbKGgwID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDAgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gyICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDMgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toNCAmIDB4MEZdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLnRvU3RyaW5nID0gU2hhMS5wcm90b3R5cGUuaGV4O1xuXG4gIFNoYTEucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gW1xuICAgICAgKGgwID4+PiAyNCkgJiAweEZGLCAoaDAgPj4+IDE2KSAmIDB4RkYsIChoMCA+Pj4gOCkgJiAweEZGLCBoMCAmIDB4RkYsXG4gICAgICAoaDEgPj4+IDI0KSAmIDB4RkYsIChoMSA+Pj4gMTYpICYgMHhGRiwgKGgxID4+PiA4KSAmIDB4RkYsIGgxICYgMHhGRixcbiAgICAgIChoMiA+Pj4gMjQpICYgMHhGRiwgKGgyID4+PiAxNikgJiAweEZGLCAoaDIgPj4+IDgpICYgMHhGRiwgaDIgJiAweEZGLFxuICAgICAgKGgzID4+PiAyNCkgJiAweEZGLCAoaDMgPj4+IDE2KSAmIDB4RkYsIChoMyA+Pj4gOCkgJiAweEZGLCBoMyAmIDB4RkYsXG4gICAgICAoaDQgPj4+IDI0KSAmIDB4RkYsIChoNCA+Pj4gMTYpICYgMHhGRiwgKGg0ID4+PiA4KSAmIDB4RkYsIGg0ICYgMHhGRlxuICAgIF07XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXkgPSBTaGExLnByb3RvdHlwZS5kaWdlc3Q7XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG4gICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDAsIHRoaXMuaDApO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMig0LCB0aGlzLmgxKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoOCwgdGhpcy5oMik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDEyLCB0aGlzLmgzKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoMTYsIHRoaXMuaDQpO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgZnVuY3Rpb24gSG1hY1NoYTEoa2V5LCBzaGFyZWRNZW1vcnkpIHtcbiAgICB2YXIgaSwgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShrZXkpO1xuICAgIGtleSA9IHJlc3VsdFswXTtcbiAgICBpZiAocmVzdWx0WzFdKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgbGVuZ3RoID0ga2V5Lmxlbmd0aCwgaW5kZXggPSAwLCBjb2RlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvZGUgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4YzAgfCAoY29kZSA+Pj4gNikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHhlMCB8IChjb2RlID4+PiAxMikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweDNmZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gNikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8IChjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBrZXkgPSBieXRlcztcbiAgICB9XG5cbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDY0KSB7XG4gICAgICBrZXkgPSAobmV3IFNoYTEodHJ1ZSkpLnVwZGF0ZShrZXkpLmFycmF5KCk7XG4gICAgfVxuXG4gICAgdmFyIG9LZXlQYWQgPSBbXSwgaUtleVBhZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgKytpKSB7XG4gICAgICB2YXIgYiA9IGtleVtpXSB8fCAwO1xuICAgICAgb0tleVBhZFtpXSA9IDB4NWMgXiBiO1xuICAgICAgaUtleVBhZFtpXSA9IDB4MzYgXiBiO1xuICAgIH1cblxuICAgIFNoYTEuY2FsbCh0aGlzLCBzaGFyZWRNZW1vcnkpO1xuXG4gICAgdGhpcy51cGRhdGUoaUtleVBhZCk7XG4gICAgdGhpcy5vS2V5UGFkID0gb0tleVBhZDtcbiAgICB0aGlzLmlubmVyID0gdHJ1ZTtcbiAgICB0aGlzLnNoYXJlZE1lbW9yeSA9IHNoYXJlZE1lbW9yeTtcbiAgfVxuICBIbWFjU2hhMS5wcm90b3R5cGUgPSBuZXcgU2hhMSgpO1xuXG4gIEhtYWNTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICB0aGlzLmlubmVyID0gZmFsc2U7XG4gICAgICB2YXIgaW5uZXJIYXNoID0gdGhpcy5hcnJheSgpO1xuICAgICAgU2hhMS5jYWxsKHRoaXMsIHRoaXMuc2hhcmVkTWVtb3J5KTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMub0tleVBhZCk7XG4gICAgICB0aGlzLnVwZGF0ZShpbm5lckhhc2gpO1xuICAgICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV4cG9ydHMgPSBjcmVhdGVNZXRob2QoKTtcbiAgZXhwb3J0cy5zaGExID0gZXhwb3J0cztcbiAgZXhwb3J0cy5zaGExLmhtYWMgPSBjcmVhdGVIbWFjTWV0aG9kKCk7XG5cbiAgaWYgKENPTU1PTl9KUykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiAgfSBlbHNlIHtcbiAgICByb290LnNoYTEgPSBleHBvcnRzO1xuICAgIGlmIChBTUQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwgIi8qKlxuICogQ2VudHJhbGlzZWQgRkhJUiBDb2RlU3lzdGVtIC8gSWRlbnRpZmllclN5c3RlbSBVUklzIHVzZWQgYnkgdGhlIG1hcHBlcnMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvZmhpci9zeXN0ZW1zLnB5YC4gV2UgdXNlIFVSTC1mb3JtIHN5c3RlbXMgaW5zdGVhZFxuICogb2YgT0lEcyBiZWNhdXNlOlxuICogICAtIGl0IGRvZXNuJ3QgcmVxdWlyZSBtaW50aW5nL293bmluZyBhIHJlYWwgTkhJL1RXIGNvcmUgT0lELFxuICogICAtIGl0J3Mgc2VsZi1kZXNjcmliaW5nIGluIHRvb2xzIHRoYXQgZG9uJ3QgcmVjb2duaXNlIHRoZSBPSUQsXG4gKiAgIC0gaXQgY2xlYW5seSBzdXJ2aXZlcyB0aGUgVFdOSElGSElSIHZhbGlkYXRvcidzIHN5bnRhY3RpYyBjaGVjay5cbiAqXG4gKiBBbGwgc3lzdGVtcyBsaXZlIGhlcmUgc28gYSBzaW5nbGUgY2hhbmdlIHJpcHBsZXMgdG8gZXZlcnkgbWFwcGVyLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgbmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU1MDY1XHU0RkREXHU3RjcyXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIChsYWIgKyBwcm9jZWR1cmUgb3JkZXIgY29kZXMgXHUyMDE0IHNhbWUgbmFtZXNwYWNlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfTUVESUNBTF9PUkRFUl9DT0RFID1cbiAgXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1tZWRpY2FsLW9yZGVyLWNvZGVcIjtcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1ODVFNVx1NTRDMVx1NEVFM1x1NzhCQyAoZHJ1ZyBjb2RlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfRFJVR19DT0RFID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1kcnVnLWNvZGVcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRhaXdhbiBwYXRpZW50IGlkZW50aWZpZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIChUYWl3YW4gbmF0aW9uYWwgSUQpLiAqL1xuZXhwb3J0IGNvbnN0IFRXX05BVElPTkFMX0lEID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9JZGVudGlmaWVyU3lzdGVtL25hdGlvbmFsLWlkXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBmYWxsYmFja3MgKHBlci1kZXBsb3ltZW50LCBOT1QgY3Jvc3Mtc3lzdGVtIGNhbm9uaWNhbCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTEFCX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWxhYlwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLW1lZGljYXRpb25cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUkVQT1JUX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLXJlcG9ydFwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9DT05ESVRJT05fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1wcm9jZWR1cmVcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQUxMRVJHRU5fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtYWxsZXJnZW5cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUEFUSUVOVF9NUk4gPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0lkZW50aWZpZXJTeXN0ZW0vaGlzLW1yblwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJuYXRpb25hbCBjb2RlIHN5c3RlbXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBMT0lOQyA9IFwiaHR0cDovL2xvaW5jLm9yZ1wiO1xuZXhwb3J0IGNvbnN0IFNOT01FRF9DVCA9IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiO1xuLyoqIElDRC0xMC1DTSAoVGFpd2FuIC8gXHU1MDY1XHU0RkREIHVzZXMgdGhpcywgbm90IGJhcmUgSUNELTEwKS4gKi9cbmV4cG9ydCBjb25zdCBJQ0RfMTBfQ00gPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiO1xuZXhwb3J0IGNvbnN0IElDRF8xMF9QQ1MgPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1wY3NcIjtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIzNDUwODY2YCBcdTIxOTIgYFAxMjM0NSoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBBbGxlcmd5SW50b2xlcmFuY2UgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9hbGxlcmd5LnB5YC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBBTExPV0VEX0NBVEVHT1JJRVMgPSBuZXcgU2V0KFtcIm1lZGljYXRpb25cIiwgXCJmb29kXCIsIFwiZW52aXJvbm1lbnRcIiwgXCJiaW9sb2dpY1wiXSk7XG5jb25zdCBBTExPV0VEX0NSSVRJQ0FMSVRZID0gbmV3IFNldChbXCJoaWdoXCIsIFwibG93XCIsIFwidW5hYmxlLXRvLWFzc2Vzc1wiXSk7XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJyeG5vcm1cIikpIHJldHVybiBcImh0dHA6Ly93d3cubmxtLm5paC5nb3YvcmVzZWFyY2gvdW1scy9yeG5vcm1cIjtcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0FMTEVSR0VOX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBBbGxlcmd5SW50b2xlcmFuY2UoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBBbGxlcmdlblwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5yZWNvcmRlZF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBwYXRpZW50OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgdmVyaWZpY2F0aW9uU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS12ZXJpZmljYXRpb25cIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgY2F0ZWdvcnkgPSByYXcuY2F0ZWdvcnkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ0FURUdPUklFUy5oYXMoY2F0ZWdvcnkpKSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbY2F0ZWdvcnldO1xuICB9XG5cbiAgY29uc3QgY3JpdGljYWxpdHkgPSByYXcuY3JpdGljYWxpdHkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ1JJVElDQUxJVFkuaGFzKGNyaXRpY2FsaXR5KSkge1xuICAgIHJlc291cmNlLmNyaXRpY2FsaXR5ID0gY3JpdGljYWxpdHk7XG4gIH1cblxuICBpZiAocmF3LnJlY29yZGVkX2RhdGUpIHtcbiAgICByZXNvdXJjZS5yZWNvcmRlZERhdGUgPSBgJHtyYXcucmVjb3JkZWRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgcmVhY3Rpb25Ob3RlID0gcmF3LnJlYWN0aW9uID8/IFwiXCI7XG4gIGlmIChyZWFjdGlvbk5vdGUpIHtcbiAgICByZXNvdXJjZS5yZWFjdGlvbiA9IFt7IGRlc2NyaXB0aW9uOiByZWFjdGlvbk5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBDb25kaXRpb24gbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9jb25kaXRpb24ucHlgLiBJbmNsdWRlcyB0aGUgSUNELTEwLUNNXG4gKiBub3JtYWxpc2VyIChUV05ISUZISVIgUm91bmQtMyBmaXgpIHdoaWNoIGluc2VydHMgdGhlIGNhbm9uaWNhbCBkb3RcbiAqIGJhY2sgaW50byBOSEkncyB1bi1kb3R0ZWQgY29kZXMgKFwiRTExMjJcIiBcdTIxOTIgXCJFMTEuMjJcIikuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuLy8gSUNELTEwLUNNIGNhbm9uaWNhbCBmb3JtIGlzICdYWFguWVlZW0EtWl0nIChjYXRlZ29yeSAzIGNoYXJzICsgb3B0aW9uYWxcbi8vIGRvdCArIHN1YmRpdmlzaW9uICsgb3B0aW9uYWwgN3RoLWNoYXJhY3RlciBleHRlbnNpb24pLiBOSEkgXHU1MDY1XHU0RkREIHNlbmRzXG4vLyBjb2RlcyBXSVRIT1VUIHRoZSBkb3QgKCdFMTEyMicsICdNNDc4OTInLCAnUzA5OTNYQScsICdNMTkyNzEnKS5cbi8vIFZhbGlkYXRvciByZWplY3RzIHVuLWRvdHRlZCBjb2RlcyBhcyAnVW5rbm93biBjb2RlJy5cbmNvbnN0IElDRDEwX0NBVEVHT1JZX1JFID0gL15bQS1aXVswLTlBLVpdezJ9JC87XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBkb3QgYmFjayBpbnRvIE5ISSdzIG5vLWRvdCBJQ0QtMTAtQ00gY29kZXMuXG4gKiAgIEUxMTIyICAgIFx1MjE5MiBFMTEuMjJcbiAqICAgTTQ3ODkyICAgXHUyMTkyIE00Ny44OTJcbiAqICAgUzA5OTNYQSAgXHUyMTkyIFMwOS45M1hBXG4gKiAgIEUxMSAgICAgIFx1MjE5MiBFMTEgICAgICAgIChubyBzdWJkaXZpc2lvbjsgcGFzcyB0aHJvdWdoKVxuICogICBFMTEuMjIgICBcdTIxOTIgRTExLjIyICAgICAoYWxyZWFkeSBkb3R0ZWQ7IHBhc3MgdGhyb3VnaClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUljZDEwQ20oY29kZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghY29kZSB8fCBjb2RlLmluY2x1ZGVzKFwiLlwiKSkgcmV0dXJuIGNvZGUgPz8gXCJcIjtcbiAgY29uc3QgcyA9IGNvZGUudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG4gIGlmIChzLmxlbmd0aCA8PSAzKSByZXR1cm4gcztcbiAgY29uc3QgaGVhZCA9IHMuc2xpY2UoMCwgMyk7XG4gIGNvbnN0IHRhaWwgPSBzLnNsaWNlKDMpO1xuICBpZiAoSUNEMTBfQ0FURUdPUllfUkUudGVzdChoZWFkKSkge1xuICAgIHJldHVybiBgJHtoZWFkfS4ke3RhaWx9YDtcbiAgfVxuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZC0xMFwiKSB8fCBzLmluY2x1ZGVzKFwiaWNkMTBcIikpIHtcbiAgICAvLyBOSEkgXHU1MDY1XHU0RkREIGNvZGVzIGFyZSBJQ0QtMTAtQ00gKFVTL1RhaXdhbiBleHRlbmRlZCBzZXQgXHUyMDE0IGUuZy5cbiAgICAvLyBFMTEuMjIpLiBUaGUgYmFzZSBJQ0QtMTAgVmFsdWVTZXQgcmVqZWN0cyB0aGVzZSBhcyAnVW5rbm93biBjb2RlJy5cbiAgICByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfQ007XG4gIH1cbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0NPTkRJVElPTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQ29uZGl0aW9uKHJhdzogUmVjb3JkPHN0cmluZywgYW55PiwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkNvbmRpdGlvblwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIHJhdy5jb2RlID8/IFwiXCIsIHJhdy5vbnNldF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IHJhdy5jbGluaWNhbF9zdGF0dXMgPz8gXCJhY3RpdmVcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB2ZXJpZmljYXRpb25TdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLXZlci1zdGF0dXNcIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQ29uZGl0aW9uXCI7XG4gIGxldCBjb2RlID0gcmF3LmNvZGUgYXMgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG4gIGlmIChzeXN0ZW0gPT09IHN5c3RlbXMuSUNEXzEwX0NNICYmIGNvZGUpIHtcbiAgICBjb2RlID0gbm9ybWFsaXplSWNkMTBDbShjb2RlKTtcbiAgfVxuICByZXNvdXJjZS5jb2RlID0ge1xuICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgdGV4dDogZGlzcGxheSxcbiAgfTtcblxuICBjb25zdCBzZXZlcml0eSA9IHJhdy5zZXZlcml0eSA/PyBcIlwiO1xuICBpZiAoc2V2ZXJpdHkpIHtcbiAgICByZXNvdXJjZS5zZXZlcml0eSA9IHsgdGV4dDogc2V2ZXJpdHkgfTtcbiAgfVxuXG4gIGlmIChyYXcub25zZXRfZGF0ZSkge1xuICAgIHJlc291cmNlLm9uc2V0RGF0ZVRpbWUgPSBgJHtyYXcub25zZXRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogRGlhZ25vc3RpY1JlcG9ydCBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2RpYWdub3N0aWNfcmVwb3J0LnB5YC4gUmV0dXJucyBudWxsIGZvclxuICogbGlzdC1wYWdlIHJvd3MgbGFja2luZyBhIGNvbmNsdXNpb24sIGFuZCBmb3IgbGFiLXZhbHVlLW9ubHkgXCJyZXBvcnRzXCJcbiAqIHRoYXQgd291bGQgZHVwbGljYXRlIGEgcHJvcGVyIE9ic2VydmF0aW9uLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IFYyXzAwNzQgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjItMDA3NFwiO1xuXG5jb25zdCBDQVRFR09SWV9NQVA6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4gPSB7XG4gIExBQjogW1YyXzAwNzQsIFwiTEFCXCIsIFwiTGFib3JhdG9yeVwiXSxcbiAgUkFEOiBbVjJfMDA3NCwgXCJSQURcIiwgXCJSYWRpb2xvZ3lcIl0sXG4gIENBUjogW1YyXzAwNzQsIFwiQ0FSXCIsIFwiQ2FyZGlvbG9neVwiXSxcbiAgUEFUSDogW1YyXzAwNzQsIFwiUEFUXCIsIFwiUGF0aG9sb2d5XCJdLFxufTtcblxuLy8gTGFiLXJlc3VsdCBwYXR0ZXJucyB0aGF0IGxvb2sgbGlrZSBzaW5nbGUtdmFsdWUgbGFiIHJlYWRpbmdzIHJhdGhlclxuLy8gdGhhbiBhIG5hcnJhdGl2ZSByZXBvcnQuXG5jb25zdCBMQUJfVU5JVF9SRSA9XG4gIC9cXGQrKD86XFwuXFxkKyk/XFxzKig/OiV8bWdcXC9kTHxnXFwvZEx8bW1vbFxcL0x8VVxcL0x8SVVcXC9MfG1JVVxcL0x8bmdcXC9tTHxcdTAzQkNnXFwvZEx8dWdcXC9kTHxwZ1xcL21MfGZMfFxcL3VMfDEwXFxeP1xcZCtcXC91THx4MTBcXF4/XFxkK1xcL3VMfHNlY3xcdTc5RDJ8Y29waWVzXFwvbUwpLztcblxuZnVuY3Rpb24gbG9va3NMaWtlTGFiVmFsdWVPbmx5KGNvbmNsdXNpb246IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAoIWNvbmNsdXNpb24pIHJldHVybiB0cnVlO1xuICBjb25zdCB0ZXh0ID0gY29uY2x1c2lvbi50cmltKCk7XG4gIC8vIFJlYWwgbmFycmF0aXZlIHJlcG9ydHMgYWxtb3N0IGFsd2F5cyBjb250YWluIG11bHRpcGxlIHNlbnRlbmNlcy5cbiAgaWYgKHRleHQubGVuZ3RoID4gMTAwKSByZXR1cm4gZmFsc2U7XG4gIC8vIFNpbmdsZSB2YWx1ZSBwYXR0ZXJuICsgcGFyZW50aGV0aWNhbCByZWZlcmVuY2UgcmFuZ2UgPSBsYWIgbGluZS5cbiAgaWYgKExBQl9VTklUX1JFLnRlc3QodGV4dCkpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBEaWFnbm9zdGljUmVwb3J0KFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBjb25jbHVzaW9uID0gKChyYXcuY29uY2x1c2lvbiA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBjYXRLZXlSYXcgPSBTdHJpbmcocmF3LmNhdGVnb3J5ID8/IFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gIGlmIChjYXRLZXlSYXcgPT09IFwiTEFCXCIgJiYgbG9va3NMaWtlTGFiVmFsdWVPbmx5KGNvbmNsdXNpb24pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgPz8gXCJVbmtub3duIFJlcG9ydFwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbUhpbnQgPSByYXcuc3lzdGVtID8/IFwiXCI7XG4gIGNvbnN0IHN5c3RlbSA9XG4gICAgdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgJiYgc3lzdGVtSGludC50b1VwcGVyQ2FzZSgpID09PSBcIkxPSU5DXCJcbiAgICAgID8gc3lzdGVtcy5MT0lOQ1xuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9SRVBPUlRfQ09ERTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3LmRhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogcmF3LnN0YXR1cyA/PyBcImZpbmFsXCIsXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICAgIGNvbmNsdXNpb24sXG4gIH07XG5cbiAgY29uc3QgY2F0RW50cnkgPSBDQVRFR09SWV9NQVBbY2F0S2V5UmF3XTtcbiAgaWYgKGNhdEVudHJ5KSB7XG4gICAgY29uc3QgW2NhdFN5cywgY2F0Q29kZSwgY2F0RGlzcGxheV0gPSBjYXRFbnRyeTtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFt7IGNvZGluZzogW3sgc3lzdGVtOiBjYXRTeXMsIGNvZGU6IGNhdENvZGUsIGRpc3BsYXk6IGNhdERpc3BsYXkgfV0gfV07XG4gIH1cblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKHJhdy5pc3N1ZWQpIHtcbiAgICByZXNvdXJjZS5pc3N1ZWQgPSBgJHtyYXcuaXNzdWVkfVQwMDowMDowMCswODowMGA7XG4gIH0gZWxzZSBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5pc3N1ZWQgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2UucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBFbmNvdW50ZXIgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9lbmNvdW50ZXIucHlgLiBTdGFibGUgSUQgaW5jbHVkZXMgaG9zcGl0YWxcbiAqIHNvIHNhbWUtZGF5IHZpc2l0cyB0byBkaWZmZXJlbnQgaW5zdGl0dXRpb25zIGVhY2ggZ2V0IHRoZWlyIG93blxuICogRW5jb3VudGVyICh0aGUgcG9zdC1tYXBwaW5nIGxpbmtlciBkZXBlbmRzIG9uIHRoaXMpLlxuICovXG5cbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBBQ1RDT0RFX1NZU1RFTSA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92My1BY3RDb2RlXCI7XG5cbmNvbnN0IENMQVNTX01BUDogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgQU1COiBbQUNUQ09ERV9TWVNURU0sIFwiQU1CXCIsIFwiYW1idWxhdG9yeVwiXSxcbiAgSU1QOiBbQUNUQ09ERV9TWVNURU0sIFwiSU1QXCIsIFwiaW5wYXRpZW50IGVuY291bnRlclwiXSxcbiAgRU1FUjogW0FDVENPREVfU1lTVEVNLCBcIkVNRVJcIiwgXCJlbWVyZ2VuY3lcIl0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWFwRW5jb3VudGVyKHJhdzogUmVjb3JkPHN0cmluZywgYW55PiwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZW5jQ2xhc3MgPSBTdHJpbmcocmF3LmNsYXNzID8/IFwiQU1CXCIpLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGNsYXNzRW50cnkgPSBDTEFTU19NQVBbZW5jQ2xhc3NdID8/IENMQVNTX01BUC5BTUIhO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJFbmNvdW50ZXJcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCByYXcuZGF0ZSA/PyBcIlwiLCBlbmNDbGFzcywgKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCkpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluaXNoZWRcIixcbiAgICBjbGFzczoge1xuICAgICAgc3lzdGVtOiBjbGFzc0VudHJ5WzBdLFxuICAgICAgY29kZTogY2xhc3NFbnRyeVsxXSxcbiAgICAgIGRpc3BsYXk6IGNsYXNzRW50cnlbMl0sXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIC8vIE5ISSdzIGVuY291bnRlciBcInR5cGVcIiBtYXJrZXJzIFx1MjAxNCAnSUNcdTUzNjFcdThDQzdcdTY1OTknIC8gJ1x1NzUzM1x1NTgzMVx1OENDN1x1NjU5OScgLyAnXHU0RjRGXHU5NjYyJ1xuICAvLyBcdTIwMTQgYXJlIGRhdGEtb3JpZ2luIGxhYmVscywgbm90IFNOT01FRCBjbGluaWNhbCB0eXBlcy4gS2VlcCB0aGVtIGFzXG4gIC8vIENvZGVhYmxlQ29uY2VwdC50ZXh0IHdpdGhvdXQgY2xhaW1pbmcgU05PTUVELlxuICBjb25zdCB0eXBlRGlzcGxheSA9ICgocmF3LnR5cGVfZGlzcGxheSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKHR5cGVEaXNwbGF5KSB7XG4gICAgcmVzb3VyY2UudHlwZSA9IFt7IHRleHQ6IHR5cGVEaXNwbGF5IH1dO1xuICB9XG5cbiAgY29uc3QgcGVyaW9kOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGlmIChyYXcuZGF0ZSkgcGVyaW9kLnN0YXJ0ID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKHJhdy5lbmRfZGF0ZSkgcGVyaW9kLmVuZCA9IGAke3Jhdy5lbmRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAoT2JqZWN0LmtleXMocGVyaW9kKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UucGVyaW9kID0gcGVyaW9kO1xuICB9XG5cbiAgY29uc3QgZGVwYXJ0bWVudCA9IHJhdy5kZXBhcnRtZW50ID8/IFwiXCI7XG4gIGNvbnN0IHByb3ZpZGVyID0gcmF3LnByb3ZpZGVyID8/IFwiXCI7XG4gIGlmIChkZXBhcnRtZW50IHx8IHByb3ZpZGVyKSB7XG4gICAgY29uc3QgcGFydGljaXBhbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAocHJvdmlkZXIpIHBhcnRpY2lwYW50LmluZGl2aWR1YWwgPSB7IGRpc3BsYXk6IHByb3ZpZGVyIH07XG4gICAgcmVzb3VyY2UucGFydGljaXBhbnQgPSBPYmplY3Qua2V5cyhwYXJ0aWNpcGFudCkubGVuZ3RoID4gMCA/IFtwYXJ0aWNpcGFudF0gOiBbXTtcbiAgICBpZiAoZGVwYXJ0bWVudCkge1xuICAgICAgcmVzb3VyY2Uuc2VydmljZVR5cGUgPSB7IHRleHQ6IGRlcGFydG1lbnQgfTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5zZXJ2aWNlUHJvdmlkZXIgPSB7IGRpc3BsYXk6IGhvc3BpdGFsIH07XG4gIH1cblxuICBjb25zdCByZWFzb24gPSByYXcucmVhc29uID8/IFwiXCI7XG4gIGlmIChyZWFzb24pIHtcbiAgICByZXNvdXJjZS5yZWFzb25Db2RlID0gW3sgdGV4dDogcmVhc29uIH1dO1xuICB9XG5cbiAgY29uc3QgZGlzY2hhcmdlID0gcmF3LmRpc2NoYXJnZV9kaXNwb3NpdGlvbiA/PyBcIlwiO1xuICBpZiAoZGlzY2hhcmdlKSB7XG4gICAgcmVzb3VyY2UuaG9zcGl0YWxpemF0aW9uID0geyBkaXNjaGFyZ2VEaXNwb3NpdGlvbjogeyB0ZXh0OiBkaXNjaGFyZ2UgfSB9O1xuICB9XG5cbiAgY29uc3QgY2xpbmljYWxOb3RlID0gKChyYXcuY2xpbmljYWxfbm90ZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGNsaW5pY2FsTm90ZSkge1xuICAgIHJlc291cmNlLm5vdGUgPSBbeyB0ZXh0OiBjbGluaWNhbE5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBNZWRpY2F0aW9uUmVxdWVzdCBtYXBwZXIgKyBiaWxpbmd1YWwgZGVkdXBsaWNhdGlvbi5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvbWVkaWNhdGlvbi5weWAuIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgcmVwb3J0cyB0aGVcbiAqIFNBTUUgcHJlc2NyaXB0aW9uIG11bHRpcGxlIHRpbWVzIChFbmdsaXNoLW9ubHkgLyBFbmcrXHU0RTJEIC8gXHU0RTJEK0VuZykuXG4gKiBgbWFwTWVkaWNhdGlvbnNEZWR1cGAgY29sbGFwc2VzIHRoZXNlIHRvIG9uZSBNZWRpY2F0aW9uUmVxdWVzdCBwZXJcbiAqIChkYXRlLCBjYW5vbmljYWwtZHJ1Zy1rZXkpLCBwcmVmZXJyaW5nIHRoZSBmb3JtIHdpdGggbW9yZSBDSksgY2hhcnNcbiAqIChjbGluaWNpYW5zIHJlYWQgXHU1NTQ2XHU1NEMxXHU1NDBEIGZpcnN0KS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZUljZDEwQ20gfSBmcm9tIFwiLi9jb25kaXRpb25cIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5mdW5jdGlvbiBpc0NqayhjaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFx1NEUwMCAoVSs0RTAwKSB0byBcdTlGRkYgKFUrOUZGRikgY292ZXJzIENKSyBVbmlmaWVkIElkZW9ncmFwaHMuXG4gIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgcmV0dXJuIGNwID49IDB4NGUwMCAmJiBjcCA8PSAweDlmZmY7XG59XG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2YgcykgaWYgKGlzQ2prKGNoKSkgbisrO1xuICByZXR1cm4gbjtcbn1cblxuLyoqXG4gKiBNYXRjaCBhIFwibG9uZ1wiIEVuZ2xpc2ggY2h1bmsgKFx1MjI2NTQgY2hhcnMgb2YgQS1aLzAtOS9wdW5jdHVhdGlvbiBjb21tb25cbiAqIHRvIGRydWcgbmFtZXMpLiBBdm9pZCBtYXRjaGluZyBzaG9ydCB0b2tlbnMgbGlrZSBcIkRcIiBvciBcIlBPXCIgdGhhdFxuICogYXBwZWFyIGluc2lkZSBDaGluZXNlIG5hbWVzLlxuICovXG5jb25zdCBFTl9DSFVOS19HID0gL1tBLVpdW0EtWjAtOS4lL1xcLVwiJ1xcc117Myx9L2c7XG5cbi8qKlxuICogUmVkdWNlIGEgZHJ1Zy1uYW1lIHN0cmluZyB0byBhIHN0YWJsZSBjYW5vbmljYWwga2V5LiBFeHRyYWN0IHRoZVxuICogbG9uZ2VzdCBFbmdsaXNoIGZyYWdtZW50LCB0aGVuIHRydW5jYXRlIGF0IGNvbW1vbiBzZXBhcmF0b3JzIHNvIGFcbiAqIG5hbWUgd2l0aCBleHRyYSB0cmFpbGluZyBtb2RpZmllcnMgc3RpbGwgY29sbGFwc2VzIHRvIGJyYW5kK3N0cmVuZ3RoLlxuICpcbiAqIEV4YW1wbGVzIChhbGwgbWFwIHRvIFwidGltb3B0b2wgeGUgMC41JSBvcGh0aGFsbWljIHNvbHV0aW9uXCIpOlxuICogICBcIlRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTlwiXG4gKiAgIFwiVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OIChcdTk3NTJcdTc3M0NcdTk3MzJcdTIwMjYpXCJcbiAqICAgXCJcdTk3NTJcdTc3M0NcdTk3MzJcdTIwMjYgKFRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTilcIlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsRHJ1Z0tleShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IChuYW1lID8/IFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGNodW5rcyA9IFsuLi5zLm1hdGNoQWxsKEVOX0NIVU5LX0cpXS5tYXAoKG0pID0+IG1bMF0pO1xuICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAobmFtZSA/PyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuICBsZXQgbG9uZ2VzdCA9IGNodW5rcy5yZWR1Y2UoKGEsIGIpID0+IChiLmxlbmd0aCA+IGEubGVuZ3RoID8gYiA6IGEpKS50cmltKCk7XG4gIGZvciAoY29uc3Qgc2VwIG9mIFtcIiAtIFwiLCBcIiBcdTIwMTMgXCIsIFwiIC8gXCJdKSB7XG4gICAgaWYgKGxvbmdlc3QuaW5jbHVkZXMoc2VwKSkge1xuICAgICAgbG9uZ2VzdCA9IGxvbmdlc3Quc3BsaXQoc2VwKVswXSE7XG4gICAgfVxuICB9XG4gIHJldHVybiBsb25nZXN0LnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiAqIEJlc3QtZWZmb3J0IGFjdGl2ZSB2cyBjb21wbGV0ZWQgZGVjaXNpb24gZm9yIGEgTWVkaWNhdGlvblJlcXVlc3QuXG4gKiBBY3RpdmUgd2hpbGUgKGF1dGhvcmVkX2RhdGUgKyBkdXJhdGlvbiA+IHRvZGF5KTsgb3RoZXJ3aXNlIGNvbXBsZXRlZC5cbiAqIE1pc3NpbmcgZHVyYXRpb24gXHUyMTkyIGFzc3VtZSA5MC1kYXkgcmVmaWxsIHdpbmRvdyAoTkhJJ3MgdHlwaWNhbCBjYWRlbmNlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lZFN0YXR1cyhcbiAgYXV0aG9yZWRJc286IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGR1cmF0aW9uRGF5czogYW55LFxuKTogXCJhY3RpdmVcIiB8IFwiY29tcGxldGVkXCIge1xuICBpZiAoIWF1dGhvcmVkSXNvKSByZXR1cm4gXCJjb21wbGV0ZWRcIjtcbiAgY29uc3QgZGF0ZVBhcnQgPSBTdHJpbmcoYXV0aG9yZWRJc28pLnNsaWNlKDAsIDEwKTtcbiAgY29uc3QgcGFyc2VkID0gbmV3IERhdGUoYCR7ZGF0ZVBhcnR9VDAwOjAwOjAwWmApO1xuICBpZiAoTnVtYmVyLmlzTmFOKHBhcnNlZC5nZXRUaW1lKCkpKSByZXR1cm4gXCJjb21wbGV0ZWRcIjtcblxuICBsZXQgZGF5czogbnVtYmVyIHwgbnVsbDtcbiAgaWYgKGR1cmF0aW9uRGF5cyA9PT0gbnVsbCB8fCBkdXJhdGlvbkRheXMgPT09IHVuZGVmaW5lZCB8fCBkdXJhdGlvbkRheXMgPT09IFwiXCIpIHtcbiAgICBkYXlzID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBuID0gTnVtYmVyLnBhcnNlSW50KFN0cmluZyhkdXJhdGlvbkRheXMpLCAxMCk7XG4gICAgZGF5cyA9IE51bWJlci5pc0Zpbml0ZShuKSA/IG4gOiBudWxsO1xuICB9XG4gIGlmIChkYXlzID09PSBudWxsKSBkYXlzID0gOTA7XG5cbiAgY29uc3QgZW5kID0gbmV3IERhdGUocGFyc2VkLmdldFRpbWUoKSk7XG4gIGVuZC5zZXRVVENEYXRlKGVuZC5nZXRVVENEYXRlKCkgKyBkYXlzKTtcbiAgLy8gQ29tcGFyZSBkYXRlLW9ubHkgKHRvZGF5IGluIFVUQyBzaW5jZSB3ZSBhdXRob3JlZElzbyBpcyBkYXRlLW9ubHkpLlxuICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gIHRvZGF5LnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICByZXR1cm4gZW5kID49IHRvZGF5ID8gXCJhY3RpdmVcIiA6IFwiY29tcGxldGVkXCI7XG59XG5cbi8qKlxuICogQ29udmVydCBvbmUgc2NyYXBlZCBwcmVzY3JpcHRpb24gZGljdCBcdTIxOTIgRkhJUiBSNCBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqIFJldHVybnMgbnVsbCB3aGVuIHJhdyBoYXMgbm8gYGRydWdfbmFtZWAgKGNhbGxlciBmaWx0ZXJzIG91dCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBNZWRpY2F0aW9uUmVxdWVzdChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZHJ1Z05hbWUgPSAoKHJhdy5kcnVnX25hbWUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghZHJ1Z05hbWUpIHJldHVybiBudWxsO1xuXG4gIC8vIENhbm9uaWNhbCBrZXkgKG5vdCByYXcgZHJ1Z19uYW1lKSBmb3Igc3RhYmxlIGlkIHNvIHRoZSB0aHJlZSBOSElcbiAgLy8gXHU0RTJEXHU4MkYxIHZhcmlhbnRzIG9mIHRoZSBzYW1lIGRydWcgY29sbGFwc2UgdG8gb25lIEZISVIgcmVzb3VyY2UuXG4gIGNvbnN0IG1lZElkID0gc3RhYmxlSWQocGF0aWVudElkLCBjYW5vbmljYWxEcnVnS2V5KGRydWdOYW1lKSwgcmF3LmRhdGUgPz8gXCJcIik7XG5cbiAgY29uc3QgZHJ1Z0NvZGUgPSAoKHJhdy5jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCBjb2Rpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgc3lzdGVtOiBkcnVnQ29kZSA/IHN5c3RlbXMuTkhJX0RSVUdfQ09ERSA6IHN5c3RlbXMuSElTX0xPQ0FMX01FRElDQVRJT05fQ09ERSxcbiAgICBjb2RlOiBkcnVnQ29kZSB8fCBkcnVnTmFtZSxcbiAgICBkaXNwbGF5OiBkcnVnTmFtZSxcbiAgfTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiTWVkaWNhdGlvblJlcXVlc3RcIixcbiAgICBpZDogbWVkSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogbWVkU3RhdHVzKHJhdy5kYXRlID8/IFwiXCIsIHJhdy5kdXJhdGlvbl9kYXlzKSxcbiAgICBpbnRlbnQ6IFwib3JkZXJcIixcbiAgICBtZWRpY2F0aW9uQ29kZWFibGVDb25jZXB0OiB7XG4gICAgICBjb2Rpbmc6IFtjb2RpbmddLFxuICAgICAgdGV4dDogZHJ1Z05hbWUsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmF1dGhvcmVkT24gPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgZHJ1Z0NsYXNzID0gKChyYXcuZHJ1Z19jbGFzcyA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGRydWdDbGFzcykge1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW3sgdGV4dDogZHJ1Z0NsYXNzIH1dO1xuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2UucmVxdWVzdGVyID0geyBkaXNwbGF5OiBob3NwaXRhbCB9O1xuICB9XG5cbiAgLy8gRG9zYWdlIFx1MjAxNCBvbmx5IHdoZW4gc291cmNlIGFjdHVhbGx5IGhhcyBpdC4gTkhJJ3MgbWVkaWNhdGlvbi1saXN0XG4gIC8vIGVuZHBvaW50IHByb3ZpZGVzIG5vbmUgb2YgdGhlc2U7IG90aGVyIEhJUyBhZGFwdGVycyBnZXQgYVxuICAvLyBzdHJ1Y3R1cmVkIGRvc2FnZSBvdXQuXG4gIGNvbnN0IGRvc2FnZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBrIG9mIFtcImRvc2VcIiwgXCJ1bml0XCIsIFwiZnJlcXVlbmN5XCJdIGFzIGNvbnN0KSB7XG4gICAgaWYgKHJhd1trXSkgcGFydHMucHVzaChTdHJpbmcocmF3W2tdKSk7XG4gIH1cbiAgaWYgKHBhcnRzLmxlbmd0aCA+IDApIHtcbiAgICBkb3NhZ2UudGV4dCA9IHBhcnRzLmpvaW4oXCIgXCIpO1xuICB9XG4gIGlmIChyYXcucm91dGUpIHtcbiAgICBkb3NhZ2Uucm91dGUgPSB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vc25vbWVkLmluZm8vc2N0XCIsIGRpc3BsYXk6IHJhdy5yb3V0ZSB9XSxcbiAgICB9O1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkb3NhZ2UpLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5kb3NhZ2VJbnN0cnVjdGlvbiA9IFtkb3NhZ2VdO1xuICB9XG5cbiAgLy8gZGlzcGVuc2VSZXF1ZXN0IHdpdGggcXVhbnRpdHkgKyBzdXBwbHkgZHVyYXRpb24gd2hlbiBwcmVzZW50LlxuICBjb25zdCBkcjogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICBjb25zdCBxdHlSYXcgPSByYXcucXVhbnRpdHk7XG4gIGlmIChxdHlSYXcgIT09IG51bGwgJiYgcXR5UmF3ICE9PSB1bmRlZmluZWQgJiYgcXR5UmF3ICE9PSBcIlwiKSB7XG4gICAgY29uc3QgcXR5TnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHF0eVJhdykucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShxdHlOdW0pKSB7XG4gICAgICBkci5xdWFudGl0eSA9IHsgdmFsdWU6IHF0eU51bSB9O1xuICAgIH1cbiAgfVxuICBpZiAocmF3LmR1cmF0aW9uX2RheXMpIHtcbiAgICBjb25zdCBkYXlzID0gTnVtYmVyLnBhcnNlSW50KFN0cmluZyhyYXcuZHVyYXRpb25fZGF5cyksIDEwKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRheXMpKSB7XG4gICAgICBkci5leHBlY3RlZFN1cHBseUR1cmF0aW9uID0ge1xuICAgICAgICB2YWx1ZTogZGF5cyxcbiAgICAgICAgdW5pdDogXCJkYXlzXCIsXG4gICAgICAgIHN5c3RlbTogXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCIsXG4gICAgICAgIGNvZGU6IFwiZFwiLFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKGRyKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UuZGlzcGVuc2VSZXF1ZXN0ID0gZHI7XG4gIH1cblxuICBjb25zdCBpbmRpY2F0aW9uID0gKChyYXcuaW5kaWNhdGlvbiA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgaW5kaWNhdGlvbkNvZGUgPSAoKHJhdy5pbmRpY2F0aW9uX2NvZGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChpbmRpY2F0aW9uIHx8IGluZGljYXRpb25Db2RlKSB7XG4gICAgY29uc3QgcmM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAoaW5kaWNhdGlvbkNvZGUpIHtcbiAgICAgIHJjLmNvZGluZyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogc3lzdGVtcy5JQ0RfMTBfQ00sXG4gICAgICAgICAgY29kZTogbm9ybWFsaXplSWNkMTBDbShpbmRpY2F0aW9uQ29kZSksXG4gICAgICAgICAgZGlzcGxheTogaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uQ29kZSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICAgIGlmIChpbmRpY2F0aW9uKSB7XG4gICAgICByYy50ZXh0ID0gaW5kaWNhdGlvbkNvZGUgPyBgJHtpbmRpY2F0aW9uQ29kZX0gJHtpbmRpY2F0aW9ufWAudHJpbSgpIDogaW5kaWNhdGlvbjtcbiAgICB9XG4gICAgcmVzb3VyY2UucmVhc29uQ29kZSA9IFtyY107XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8qKlxuICogR3JvdXAtYXdhcmUgbWVkaWNhdGlvbiBtYXBwZXIgdGhhdCBkZWR1cGVzIFx1NEUyRFx1ODJGMSBcdTk2RDlcdThBOUUgZHVwbGljYXRlcy5cbiAqXG4gKiBTdHJhdGVneTpcbiAqICAgMS4gQ29tcHV0ZSBjYW5vbmljYWwga2V5IHBlciBkcnVnIG5hbWUgKGxvbmdlc3QgRW5nbGlzaCBjaHVuaykuXG4gKiAgIDIuIEdyb3VwIGJ5IChkYXRlLCBjYW5vbmljYWxfa2V5KS4gS2VlcCBPTkUgZW50cnkgcGVyIGdyb3VwLFxuICogICAgICBwcmVmZXJyaW5nIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmRcbiAqICAgICAgbmFtZSBcdTIwMTQgY2xpbmljaWFucyBzY2FuIEVuZ2xpc2ggZmlyc3QpLlxuICogICAzLiBNYXAgZWFjaCBrZXB0IGVudHJ5IHRocm91Z2ggbWFwTWVkaWNhdGlvblJlcXVlc3QuXG4gKlxuICogTm90ZTogUHl0aG9uIGNvbW1lbnQgc2F5cyBcIm1vcmUgQ0pLXCIgYnV0IHRoZSBjb2RlIHVzZXMgYDxgIChmZXdlcik7XG4gKiB3ZSBwcmVzZXJ2ZSB0aGUgYWN0dWFsIGNvZGUgYmVoYXZpb3VyIHRvIGtlZXAgcGFyaXR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTWVkaWNhdGlvbnNEZWR1cChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBkcnVnTmFtZSA9ICgoaXRlbS5kcnVnX25hbWUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gICAgaWYgKCFkcnVnTmFtZSkgY29udGludWU7XG4gICAgY29uc3QgZGF0ZVBhcnQgPSAoKGl0ZW0uZGF0ZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnNsaWNlKDAsIDEwKTtcbiAgICBjb25zdCBrZXkgPSBgJHtkYXRlUGFydH18JHtjYW5vbmljYWxEcnVnS2V5KGRydWdOYW1lKX1gO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQcmVmZXIgdGhlIGZvcm0gd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBicmFuZCBuYW1lKS5cbiAgICAgIGlmIChjamtDaGFycyhkcnVnTmFtZSkgPCBjamtDaGFycyhleGlzdGluZy5kcnVnX25hbWUgPz8gXCJcIikpIHtcbiAgICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgbSA9IG1hcE1lZGljYXRpb25SZXF1ZXN0KGl0ZW0sIHBhdGllbnRJZCk7XG4gICAgaWYgKG0gIT09IG51bGwpIG91dC5wdXNoKG0pO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCAiLyoqXG4gKiBMT0lOQyBtYXBwaW5nIHRhYmxlcyBmb3IgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgTE9JTkMgUjQgY29kaW5ncy5cbiAqXG4gKiBQdXJlIGRhdGEsIG5vIGxvZ2ljLiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvX2xvaW5jX3RhYmxlcy5weWAuXG4gKi9cblxuLy8gXHUyNTAwXHUyNTAwIF9OSElfVE9fTE9JTkMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBwcmltYXJ5IExPSU5DIG1hcHBpbmcuIFNvdXJjZSBvZiB0cnV0aDpcbi8vIFRXTkhJRkhJUiBQQVMgSW1wbGVtZW50YXRpb24gR3VpZGUgQ29uY2VwdE1hcC1uaGktbG9pbmNcbi8vIGh0dHBzOi8vYnVpbGQuZmhpci5vcmcvaWcvVFdOSElGSElSL3Bhcy9Db25jZXB0TWFwLW5oaS1sb2luYy5odG1sXG4vL1xuLy8gVGhhdCBDb25jZXB0TWFwIGRlY2xhcmVzIDUzIE5ISSBjb2RlcyB3aXRoIGBlcXVpdmFsZW5jZTogcmVsYXRlZHRvYFxuLy8gYWdhaW5zdCA4MDYgTE9JTkMgdmFyaWFudHMgKGRpZmZlcmVudCBzcGVjaW1lbnMgLyB1bml0cyAvIG1ldGhvZHNcbi8vIHBlciBOSEkgY29kZSBcdTIwMTQgY29uZmlybWluZyB0aGUgXCJOSEkgaXMgY29hcnNlLCBMT0lOQyBpcyBmaW5lXCIgdmlldykuXG4vLyBGb3IgZWFjaCBOSEkgY29kZSB3ZSBoYW5kLXBpY2sgdGhlIGNhbm9uaWNhbCBMT0lOQyBtb3N0IGNsaW5pY2lhbnNcbi8vIHdvdWxkIGV4cGVjdCBpbiBhIFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBsYWIgcmVwb3J0OiBTZXJ1bS9QbGFzbWEgKyBNYXNzLXZvbHVtZVxuLy8gKG9yIGF1dG8tY291bnQgZm9yIGNlbGwgY291bnRlcnMpLiBFZGdlIGNhc2VzIG5vdGVkIGlubGluZS5cbmV4cG9ydCBjb25zdCBOSElfVE9fTE9JTkM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBIYWVtYXRvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwODAwMkNcIjogXCI2NjkwLTJcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4IFx1MjAxNCBMZXVrb2N5dGVzICMvdm9sIEJsb29kIEF1dG9cbiAgXCIwODAwM0NcIjogXCI3MTgtN1wiLCAvLyBcdTg4NDBcdTgyNzJcdTdEMjBcdTZBQTJcdTY3RTUgXHUyMDE0IEhlbW9nbG9iaW4gTWFzcy92b2wgQmxvb2RcbiAgXCIwODAwNkNcIjogXCI3NzctM1wiLCAvLyBcdTg4NDBcdTVDMEZcdTY3N0ZcdThBMDhcdTY1NzggXHUyMDE0IFBsYXRlbGV0cyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMTNDXCI6IFwiNTcwMjEtOFwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdTUyMDZcdTk4NUVcdThBMDhcdTY1NzggXHUyMDE0IENCQyBXIEF1dG8gRGlmZiBwYW5lbFxuICBcIjA4MTI4QlwiOiBcIjQ3Mjg2LTBcIiwgLy8gXHU5QUE4XHU5QUQzXHU3RDMwXHU4MERFXHU1RjYyXHU2MTRCXHU1MjI0XHU4QjgwXHU1NDA4XHU0Rjc1XHU3RDMwXHU4MERFXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4XG4gIC8vIFx1MjUwMFx1MjUwMCBDaGVtaXN0cnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMTFDXCI6IFwiMTc4NjEtNlwiLCAvLyBcdTkyMjMgXHUyMDE0IENhbGNpdW0gTWFzcy92b2wgUy9QXG4gIFwiMDkwMTVDXCI6IFwiMjE2MC0wXCIsIC8vIFx1ODA4Q1x1OTE3OFx1OTE1MFx1MzAwMVx1ODg0MCBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxNkNcIjogXCIyMTYxLThcIiwgLy8gXHU4MDhDXHU5MTUwXHUzMDAxXHU1QzNGIFx1MjAxNCBDcmVhdGluaW5lIE1hc3Mvdm9sIFVyaW5lXG4gIFwiMDkwMjVDXCI6IFwiMTkyMC04XCIsIC8vIEFTVC9HT1QgXHUyMDE0IEFzcGFydGF0ZSBhbWlub3RyYW5zZmVyYXNlIEFjdCBTL1BcbiAgXCIwOTAyNkNcIjogXCIxNzQyLTZcIiwgLy8gQUxUL0dQVCBcdTIwMTQgQWxhbmluZSBhbWlub3RyYW5zZmVyYXNlIEFjdCBTL1BcbiAgXCIwOTAyOUNcIjogXCIxOTc1LTJcIiwgLy8gXHU4MUJEXHU3RDA1XHU3RDIwXHU3RTNEXHU5MUNGIFx1MjAxNCBCaWxpcnViaW4gdG90YWwgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzBDXCI6IFwiMTk2OC03XCIsIC8vIFx1NzZGNFx1NjNBNVx1ODFCRFx1N0QwNVx1N0QyMCBcdTIwMTQgQmlsaXJ1YmluIGRpcmVjdCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzM0NcIjogXCIyNTMyLTBcIiwgLy8gXHU0RTczXHU5MTc4XHU4MTJCXHU2QzJCXHU4MTIyIFx1MjAxNCBMREggQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzhDXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RCBcdTIwMTQgQWxidW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTEzOENcIjogXCIzNTY3Mi01XCIsIC8vIFx1NzZGNFx1NjNBNS9cdTdFM0RcdTgxQkRcdTdEMDVcdTdEMjBcdTZCRDRcdTUwM0NcbiAgXCIxMjExMkJcIjogXCIxNzUxLTdcIiwgLy8gXHU3NjdEXHU4NkNCXHU3NjdEKFx1NTE0RFx1NzVBQlx1NkJENFx1NkZDMVx1NkNENSkgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMjQwMDdCXCI6IFwiMTk5NS0wXCIsIC8vIFx1ODg0MFx1NkYzRlx1NkUzOFx1OTZFMlx1OTIyMyBcdTIwMTQgQ2FsY2l1bSBpb25pemVkIE1vbGVzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEhvcm1vbmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTIxQ1wiOiBcIjI5ODYtOFwiLCAvLyBcdTc3NkFcdTRFMzhcdTkxNkZcdTkxODdcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IFRlc3Rvc3Rlcm9uZSBNYXNzL3ZvbCBTL1BcbiAgXCIyNzAyMUJcIjogXCIyOTkxLThcIiwgLy8gXHU3NzZBXHU0RTM4XHU4MTAyXHU5MTg3XHU2NTNFXHU1QzA0XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgRnJlZSBTL1BcbiAgLy8gMDkxMjVDIC8gMDkxMjdDIGNvcnJlY3RlZCBhZnRlciBkdWFsLXJldmlld2VyIGF1ZGl0IFx1MjAxNCB0aGUgZWFybGllclxuICAvLyB2YWx1ZXMgKDMwMTYtMyB3YXMgVFNILCAxMDUwMS01IHdhcyBMSCkgd2VyZSBqdXN0IHdyb25nIGNvcHktXG4gIC8vIHBhc3Rlcy4gU291cmNlIGZvciB0aGUgbmV3IHZhbHVlczogVFdOSElGSElSIFBBUyBDb25jZXB0TWFwLlxuICBcIjA5MTI1Q1wiOiBcIjgzMDk4LTRcIiwgLy8gXHU2RkZFXHU2Q0UxXHU1MjNBXHU2RkMwXHU3RDIwXHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBGb2xsaXRyb3BpbiAoRlNIKSBJbW11bm9hc3NheSBTL1BcbiAgXCIwOTEyN0NcIjogXCI4MzA5Ni04XCIsIC8vIFx1NEU4Q1x1NkMyQlx1NTdGQVx1NjYyNVx1NjBDNVx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRXN0cmFkaW9sIEltbXVub2Fzc2F5IFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVHVtb3IgbWFya2VycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjAwN0NcIjogXCIxODM0LTFcIiwgLy8gXHUwM0IxLVx1ODBDRVx1NTE1Mlx1ODZDQlx1NzY3RCAoQUZQKSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMjcwNDlDXCI6IFwiMTgzNC0xXCIsIC8vIFx1NzUzMi1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCwgUklBKVxuICBcIjEyMDgxQ1wiOiBcIjgzMTEyLTNcIiwgLy8gUFNBIChFSUEvTElBKSBcdTIwMTQgTWFzcy92b2wgUy9QIEltbXVub2Fzc2F5XG4gIFwiMTIxOThDXCI6IFwiODMxMTMtMVwiLCAvLyBGcmVlIFBTQSBcdTIwMTQgTWFzcy92b2wgUy9QIEltbXVub2Fzc2F5XG4gIFwiMjcwNTJDXCI6IFwiMjg1Ny0xXCIsIC8vIFx1NjUxRFx1OEI3N1x1ODE3QVx1NzI3OVx1NzU3MFx1NjI5N1x1NTM5RiAoUFNBKSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMjcwODNCXCI6IFwiMTA4ODYtMFwiLCAvLyBcdTZFMzhcdTk2RTJQU0EgKFJJQSlcbiAgXCIxMjA1MkJcIjogXCIxMDg3My04XCIsIC8vIFx1MDNCMjItXHU1RkFFXHU3NDAzXHU4NkNCXHU3NjdEXG4gIC8vIFx1MjUwMFx1MjUwMCBJbW11bm9sb2d5IC8gcHJvdGVpbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwNjVCXCI6IFwiOTA5OTEtMVwiLCAvLyBcdTg2Q0JcdTc2N0RcdTk2RkJcdTZDRjNcdTUyMDZcdTY3OTBcbiAgXCIxMjAyOEJcIjogXCIxNDAwMi0wXCIsIC8vIElnTSBcdTU1QUVcdTU0MTFcdTUxNERcdTc1QUJcdTY0RjRcdTY1NjNcbiAgXCIxMjAyOUJcIjogXCIxNDAwMi0wXCIsIC8vIElnTSBcdTUxNERcdTc1QUJcdTZCRDRcdTZGQzFcdTZDRDVcbiAgXCIxMjEwM0JcIjogXCI5NTgwMS03XCIsIC8vIFx1NTE0RFx1NzVBQlx1OTZGQlx1NkNGM1x1NTIwNlx1Njc5MFxuICBcIjEyMTYwQlwiOiBcIjE1MTg5LTRcIiwgLy8gSWdHIFx1MDNCQS9cdTAzQkJcbiAgXCIxMjE3MUJcIjogXCIxNzM1MS04XCIsIC8vIFx1NjI5N1x1NTVEQ1x1NEUyRFx1NjAyN1x1NzQwM1x1N0QzMFx1ODBERVx1OENFQVx1NjI5N1x1OUFENCAoQU5DQSlcbiAgXCIxMjIwNEJcIjogXCIyMDU4NC05XCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1ODg2OFx1OTc2Mlx1NkExOVx1OEExOFxuICBcIjI1MDEzQlwiOiBcIjQ0NTk2LTVcIiwgLy8gXHU4N0EyXHU1MTQ5XHU1MjA3XHU3MjQ3XHU2QUEyXHU2N0U1XG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTQwMzBDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzFDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzJDXCI6IFwiNTE5Ni0xXCIsIC8vIEhCc0FnIChNYXNzL3ZvbClcbiAgXCIxNDA1MUNcIjogXCIxMzk1NS0wXCIsIC8vIEhDViBBYlxuICBcIjI3MDMzQ1wiOiBcIjUxOTctOVwiLCAvLyBIQnNBZyBSSUFcbiAgLy8gXHUyNTAwXHUyNTAwIFBhdGhvbG9neSAvIGN5dG9sb2d5IC8gSUhDIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMTk1QlwiOiBcIjE4NDc0LTdcIiwgLy8gSGVyLTIvbmV1IElTSFxuICBcIjI3MDYxQlwiOiBcIjE0MTMwLTlcIiwgLy8gXHU1MkQ1XHU2MEM1XHU2RkMwXHU3RDIwXHU2M0E1XHU1M0Q3XHU5QUQ0IChFUilcbiAgXCIyNzA2MkJcIjogXCIxMDg2MS0zXCIsIC8vIFx1OUVDM1x1OUFENFx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoUFIpXG4gIFwiMzAxMDNCXCI6IFwiODMwNTItMVwiLCAvLyBQRC1MMSBJSENcbiAgLy8gXHUyNTAwXHUyNTAwIEF1ZGlvbG9neSAvIHB1bG1vbmFyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNzAwOUJcIjogXCIyNDM0MS0wXCIsIC8vIFx1NEUwMFx1NkMyN1x1NTMxNlx1NzhCM1x1ODBCQVx1NzAzMFx1NjU2M1x1OTFDRlxuICBcIjIyMDAxQ1wiOiBcIjQ1NDk4LTNcIiwgLy8gXHU3RDE0XHU5N0YzXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMTVCXCI6IFwiNDU0OTgtM1wiLCAvLyBcdThBNTBcdTgwN0VcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgXCIyMjAyNUJcIjogXCI0NjUzMC0yXCIsIC8vIFx1ODFFQVx1OEExOFx1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gU1VQUExFTUVOVEFMIChub3QgaW4gUEFTIENvbmNlcHRNYXAgXHUyMDE0IGhhbmQtY3VyYXRlZCBmcm9tIGNvbW1vblxuICAvLyBOSEkgY29kZXMgc2VlbiBpbiBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EuIExPSU5DIHZlcmlmaWVkIGFnYWluc3QgbG9pbmMub3JnXG4gIC8vIGNhbm9uaWNhbCBuYW1lcy4gTWV0aG9kLXNwZWNpZmljIGNvZGVzIChlLmcuIGhzLUNSUCkgcGljayB0aGVcbiAgLy8gc3BlY2lmaWMgTE9JTkM7IGdlbmVyYWwtbWV0aG9kIGNvZGVzIHBpY2sgdGhlIG1vc3QgY29tbW9uIGZvcm0uXG4gIC8vIElmIFx1NTA2NVx1NEZERFx1N0Y3MiBwdWJsaXNoZXMgYW4gYXV0aG9yaXRhdGl2ZSBicm9hZGVyIENvbmNlcHRNYXAgbGF0ZXIsXG4gIC8vIHJlcGxhY2UgdGhpcyBzZWN0aW9uIGluIG9uZSBwYXNzLlxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgLyBIYkExYyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwNUNcIjogXCIxNTU4LTZcIiwgLy8gXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2IChHbHUtQUMpIFx1MjAxNCBGYXN0aW5nIGdsdWNvc2UgTWFzcy92b2wgUy9QXG4gIFwiMDkxNDBDXCI6IFwiMjM0NS03XCIsIC8vIFx1ODg0MFx1N0NENi1cdTk5MTBcdTVGOEMvXHU5NkE4XHU2QTVGIFx1MjAxNCBHbHVjb3NlIE1hc3Mvdm9sIFMvUCAoZ2VuZXJhbClcbiAgXCIwOTAwNkNcIjogXCI0NTQ4LTRcIiwgLy8gXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwIChIYkExYykgXHUyMDE0IEhlbW9nbG9iaW4gQTFjL0hnYi50b3RhbCBCbG9vZFxuICAvLyBcdTI1MDBcdTI1MDAgUmVuYWwgLyBlbGVjdHJvbHl0ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDJDXCI6IFwiMzA5NC0wXCIsIC8vIEJVTiBcdTIwMTQgVXJlYSBuaXRyb2dlbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxM0NcIjogXCIzMDg0LTFcIiwgLy8gVXJpYyBBY2lkIFx1MjAxNCBVcmF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAyMUNcIjogXCIyOTUxLTJcIiwgLy8gTmEgXHUyMDE0IFNvZGl1bSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMjJDXCI6IFwiMjgyMy0zXCIsIC8vIEsgIFx1MjAxNCBQb3Rhc3NpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDI0Q1wiOiBcIjIwMjgtOVwiLCAvLyBDTzIgXHUyMDE0IENhcmJvbiBkaW94aWRlIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAxMkNcIjogXCIyNzc3LTFcIiwgLy8gSW5vcmdhbmljIFAgXHUyMDE0IFBob3NwaGF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NkJcIjogXCIxOTEyMy05XCIsIC8vIE1nIFx1MjAxNCBNYWduZXNpdW0gTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXBpZCBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwMUNcIjogXCIyMDkzLTNcIiwgLy8gVC1DaG9sZXN0ZXJvbCBcdTIwMTQgQ2hvbGVzdGVyb2wgTWFzcy92b2wgUy9QXG4gIFwiMDkwMDRDXCI6IFwiMjU3MS04XCIsIC8vIFRHIFx1MjAxNCBUcmlnbHljZXJpZGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDNDXCI6IFwiMjA4NS05XCIsIC8vIEhETCBcdTIwMTQgSERMIGNob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQ0Q1wiOiBcIjEzNDU3LTdcIiwgLy8gTERMIFx1MjAxNCBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGl2ZXIgZnVuY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMjdDXCI6IFwiNjc2OC02XCIsIC8vIEFMSy1QIFx1MjAxNCBBbGthbGluZSBwaG9zcGhhdGFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzMUNcIjogXCIyMzI0LTJcIiwgLy8gXHUwM0IzLUdUIFx1MjAxNCBHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzNUNcIjogXCIyNTAwLTdcIiwgLy8gVElCQyBcdTIwMTQgSXJvbiBiaW5kaW5nIGNhcGFjaXR5IE1hc3Mvdm9sIFMvUFxuICBcIjA5MDM3Q1wiOiBcIjE4MjctNVwiLCAvLyBBbW1vbmlhIFx1MjAxNCBQbGFzbWFcbiAgXCIwOTA2NENcIjogXCIzMDQwLTNcIiwgLy8gTGlwYXNlIFx1MjAxNCBBY3Rpdml0eSBTL1BcbiAgXCIwOTA1OUJcIjogXCIxNDExOC00XCIsIC8vIExhY3RhdGUgXHUyMDE0IE1hc3Mvdm9sIFBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgSGVtYXRvbG9neSBleHRyYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDRDXCI6IFwiNDU0NC0zXCIsIC8vIEhDVCBcdTIwMTQgSGVtYXRvY3JpdCB2b2x1bWUgZnJhY3Rpb24gQmxvb2RcbiAgXCIwODAwOENcIjogXCIxNDE5Ni0wXCIsIC8vIFJldGljdWxvY3l0ZSBcdTIwMTQgUmV0aWN1bG9jeXRlcy8xMDAgUkJDXG4gIFwiMDgwMTBDXCI6IFwiNzExLTJcIiwgLy8gRW9zaW5vcGhpbCBjb3VudCBcdTIwMTQgIy92b2wgQmxvb2RcbiAgXCIwODAxMUNcIjogXCIyNDMxNy0wXCIsIC8vIENCQyBwYW5lbCBcdTIwMTQgSGVtYXRvbG9neSBwYW5lbCBCbG9vZFxuICBcIjA4MDI2Q1wiOiBcIjYzMDEtNlwiLCAvLyBQVC9JTlIgXHUyMDE0IElOUiBQbGF0ZWxldCBwb29yIHBsYXNtYVxuICBcIjA4MDM2Q1wiOiBcIjE0OTc5LTlcIiwgLy8gQVBUVCBcdTIwMTQgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODA3NUNcIjogXCIyNjkyLTdcIiwgLy8gT3Ntb2xhbGl0eSBcdTIwMTQgU2VydW0gb3IgUGxhc21hXG4gIFwiMDgwNzlCXCI6IFwiMzAyNDAtNlwiLCAvLyBELWRpbWVyIFx1MjAxNCBQbHQgcG9vciBwbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIFRoeXJvaWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkxMDZDXCI6IFwiMzAyNC03XCIsIC8vIEZyZWUgVDQgXHUyMDE0IFRoeXJveGluZSBmcmVlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTEyQ1wiOiBcIjMwMTYtM1wiLCAvLyBUU0ggXHUyMDE0IFRoeXJvdHJvcGluIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZGlhYyBtYXJrZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDk5Q1wiOiBcIjEwODM5LTlcIiwgLy8gVHJvcG9uaW4gSSBcdTIwMTQgVHJvcG9uaW4gSSBjYXJkaWFjIFMvUFxuICBcIjEyMTkyQ1wiOiBcIjMzOTU5LThcIiwgLy8gUHJvY2FsY2l0b25pbiBcdTIwMTQgUy9QXG4gIFwiMTIxOTNDXCI6IFwiMzM3NjItNlwiLCAvLyBOVC1wcm9CTlAgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVml0YW1pbnMgLyBjb2ZhY3RvcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkxMjlDXCI6IFwiMjEzMi05XCIsIC8vIFZpdCBCMTIgXHUyMDE0IENvYmFsYW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTEzMENcIjogXCIyMjg0LThcIiwgLy8gRm9sYXRlIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTExM0NcIjogXCIyMTQzLTZcIiwgLy8gQ29ydGlzb2wgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMTE2Q1wiOiBcIjIyNzYtNFwiLCAvLyBGZXJyaXRpbiBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBBY3V0ZSBwaGFzZSAvIGluZmxhbW1hdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTIwMTVDIGlzIHRoZSBnZW5lcmljIE5ISSBDUlAgb3JkZXIgXHUyMDE0IG1vc3QgY2xpbmljYWwgY29udGV4dHMgaW4gXHU1MDY1XHU0RkREXG4gIC8vIHNlbmQgYSByZWd1bGFyIChub3QgaHMtKSBDUlAsIHNvIG1hcCB0byAxOTg4LTUuIElmIGEgXHU5NjYyXHU2MjQwIHNwZWNpZmljYWxseVxuICAvLyBiaWxscyBocy1DUlAgaXQgd2lsbCBsYW5kIG9uIGEgZGlmZmVyZW50IGNvZGUgKGUuZy4gMTIxODlDKS5cbiAgXCIxMjAxNUNcIjogXCIxOTg4LTVcIiwgLy8gQ1JQIFx1MjAxNCBDIHJlYWN0aXZlIHByb3RlaW4gTWFzcy92b2wgUy9QXG4gIFwiMTIwNTNDXCI6IFwiNTA0OC00XCIsIC8vIEFOQSBcdTIwMTQgQW50aW51Y2xlYXIgQWIgVGl0ZXIgUy9QXG4gIFwiMTIwNTZCXCI6IFwiMTYxMjQtMFwiLCAvLyBBbnRpLW1pdG9jaG9uZHJpYWwgQWIgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA2MDEyQ1wiOiBcIjU3NzgtNlwiLCAvLyBVcmluZSBhcHBlYXJhbmNlIFx1MjAxNCBDb2xvclxuICBcIjA2MDEzQ1wiOiBcIjI0MzU2LThcIiwgLy8gXHU1QzNGXHU3NTFGXHU1MzE2IHBhbmVsIFx1MjAxNCBVcmluYWx5c2lzIG1hY3Jvc2NvcGljIHBhbmVsXG4gIFwiMDcwMDFDXCI6IFwiMTQ1NjMtMVwiLCAvLyBTdG9vbCBvY2N1bHQgYmxvb2RcbiAgXCIwOTEzNENcIjogXCI1ODQ1My0yXCIsIC8vIGlGT0JUIHF1YW50aXRhdGl2ZSBcdTIwMTQgSGVtb2dsb2JpbiBNYXNzL3ZvbCBTdG9vbCBieSBJQVxuICBcIjEyMTExQ1wiOiBcIjIxNjEtOFwiLCAvLyBVcmluZSBDcmVhdGluaW5lIFx1MjAxNCBzYW1lIExPSU5DIGFzIDA5MDE2Q1xuICAvLyBcdTI1MDBcdTI1MDAgU2Vyb2xvZ3kgLyBpbW11bm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMDAxQ1wiOiBcIjUyOTItOFwiLCAvLyBSUFIgXHUyMDE0IFNlcnVtL1BsYXNtYVxuICBcIjEyMDIxQ1wiOiBcIjIwMzktNlwiLCAvLyBDRUEgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDI1QlwiOiBcIjI0NjUtM1wiLCAvLyBJZ0cgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDI3QlwiOiBcIjI0NTgtOFwiLCAvLyBJZ0EgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDMxQ1wiOiBcIjE5MTEzLTBcIiwgLy8gSWdFIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjA2OUJcIjogXCI1MTMyLTZcIiwgLy8gQ3J5cHRvY29jY3VzIEFnIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjA3OUNcIjogXCIyNDEwOC0zXCIsIC8vIENBIDE5LTkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQmxvb2QgdHlwZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMTAwMUNcIjogXCI4ODItMVwiLCAvLyBcdTg4NDBcdTU3OEJcdTk0NTFcdTVCOUEgXHUyMDE0IEFCTyArIFJoIGdyb3VwXG4gIFwiMTEwMDNDXCI6IFwiODgyLTFcIiwgLy8gXHU4ODQwXHU1NzhCXHU5NDUxXHU1QjlBIFx1MjAxNCBBQk8gKyBSaCBncm91cFxuICBcIjExMDA0Q1wiOiBcIjg5MC00XCIsIC8vIFx1NjI5N1x1OUFENFx1NTNDRFx1NjFDOSBcdTIwMTQgQW50aWJvZHkgc2NyZWVuXG4gIC8vIFx1MjUwMFx1MjUwMCBNaWNyb2Jpb2xvZ3kgY3VsdHVyZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEzMDA3QyBcdTdEMzBcdTgzQ0NcdTU3RjlcdTk5MEEgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDE0MjE5LTAgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0hUTFYgSSBwMjYgQWIgaW4gU2VydW0nICh2ZXJpZmllZCBhdCBsb2luYy5vcmcpLiBUaGVcbiAgLy8gcmlnaHQgZmFtaWx5IGlzIDY0NjMtNCAvIDExMjY4LTAgKEJhY3RlcmlhIGlkZW50aWZpZWQgYnkgYWVyb2JlXG4gIC8vIGN1bHR1cmUpIGJ1dCB0aGUgc291cmNlIHJvdyBkb2Vzbid0IHRlbGwgdXMgc3BlY2ltZW4gXHUyMDE0IGxlYXZpbmdcbiAgLy8gdW5tYXBwZWQgc28gd2UgZG9uJ3QgbGllLiBGYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLlxuICBcIjEzMDEzQ1wiOiBcIjMxOTUyLTVcIiwgLy8gVEIgQ3VsdHVyZSBcdTIwMTQgTXljb2JhY3Rlcml1bSB0dWJlcmN1bG9zaXMgY3VsdHVyZVxuICBcIjEzMDE2QlwiOiBcIjYwMC03XCIsIC8vIEJsb29kIEN1bHR1cmUgXHUyMDE0IEJhY3RlcmlhIGlkZW50aWZpZWQgaW4gQmxvb2RcbiAgLy8gXHUyNTAwXHUyNTAwIFZpcm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE0MDA0QlwiOiBcIjc4NDktM1wiLCAvLyBDTVYgSWdHIFx1MjAxNCBBYiBTL1BcbiAgXCIxNDA0OEJcIjogXCI3ODUwLTFcIiwgLy8gQ01WIElnTSBcdTIwMTQgQWIgUy9QXG4gIFwiMTQwNjZDXCI6IFwiODAzODMtM1wiLCAvLyBJbmZsdWVuemEgQSBcdTIwMTQgQWcgUmVzcGlyYXRvcnlcbiAgXCIxNDA4NENcIjogXCI5NDU1OC00XCIsIC8vIFNBUlMtQ29WLTIgQWcgXHUyMDE0IFJlc3BpcmF0b3J5XG4gIFwiMTIxODRDXCI6IFwiODgxNTctM1wiLCAvLyBDTVYgRE5BIHF1YW50IFBDUiBcdTIwMTQgUGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBNeWNvYmFjdGVyaXVtIC8gYWNpZC1mYXN0IChhZGRlZCBhZnRlciBhdWRpdCkgXHUyNTAwXG4gIFwiMTMwMjVDXCI6IFwiMjkyNjAtN1wiLCAvLyBcdTYyOTdcdTkxNzhcdTYwMjdcdTZGQzNcdTdFMkVcdTYyQjlcdTcyNDdcdTY3RDNcdTgyNzJcdTZBQTJcdTY3RTUgXHUyMDE0IE15Y29iYWN0ZXJpdW0gQUZCIHN0YWluXG4gIFwiMTMwMjZDXCI6IFwiMjk1NTMtNVwiLCAvLyBcdTYyOTdcdTkxNzhcdTgzQ0NcdTU3RjlcdTk5MEEgXHUyMDE0IE15Y29iYWN0ZXJpdW0gY3VsdHVyZSBsaXF1aWQrc29saWRcbiAgLy8gXHUyNTAwXHUyNTAwIEFCRyBwYW5lbCAoMDkwNDFCKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gSW50ZW50aW9uYWxseSBOT1QgbWFwcGVkIGhlcmUgXHUyMDE0IDA5MDQxQiBpcyBhIHBhbmVsIG9yZGVyIHRoYXRcbiAgLy8gdW5mb2xkcyBpbnRvIG1hbnkgaXRlbXMgKHBIIC8gcENPMiAvIHBPMiAvIEhDTzMgLyBUQ08yIC8gU0JFIC9cbiAgLy8gQUJFIC8gU0JDIC8gU0FUKS4gTWFwcGluZyB0aGUgcGFuZWwgY29kZSB0byBcInBIXCIgd291bGQgbWlzLWxhYmVsXG4gIC8vIGV2ZXJ5IG5vbi1wSCByb3cgdGhhdCBzaGFyZXMgdGhpcyBOSEkgY29kZS4gRWFjaCBpdGVtIGlzXG4gIC8vIHJlc29sdmVkIHZpYSBfTE9JTkNfTUFQIGRpc3BsYXkta2V5d29yZCBmYWxsYmFjayBiZWxvdzsgMDkwNDFCXG4gIC8vIGFsc28gYXBwZWFycyBpbiBfRElTUExBWV9GSVJTVF9DT0RFUyBzbyBkaXNwbGF5IGFsd2F5cyB3aW5zLlxuICAvLyBcdTI1MDBcdTI1MDAgQm9keSBmbHVpZCAvIHN5bm92aWFsIGZsdWlkIHBhbmVsICgxNjAwOEMgdW5mb2xkczsgdGhlXG4gIC8vIG1lbWJlciBpdGVtcyByZWx5IG9uIGRpc3BsYXkga2V5d29yZHMgZm9yIHNwZWNpbWVuLWF3YXJlXG4gIC8vIExPSU5DcykuIFBhcmVudCBjb2RlIG1hcHMgdG8gc3lub3ZpYWwgZmx1aWQgYW5hbHlzaXMgcGFuZWwuIFx1MjUwMFx1MjUwMFxuICAvLyAxNjAwOEMgXHU2RUQxXHU2REIyXHU2QUEyXHU2N0U1IFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAzMzkwMy02IHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdLZXRvbmVzIFtQcmVzZW5jZV0gaW4gVXJpbmUnICh2ZXJpZmllZCBsb2luYy5vcmcpLlxuICAvLyBMZWF2aW5nIHVubWFwcGVkOyB0aGUgcGFuZWwgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kaW5nIG9ubHlcbiAgLy8gYW5kIHRoZSBwZXItaXRlbSBkaXNwbGF5cyBpbiBfTE9JTkNfTUFQIGNhcnJ5IHRoZWlyIG93biBMT0lOQ3NcbiAgLy8gd2hlcmUga25vd24uXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0RJU1BMQVlfRklSU1RfQ09ERVMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgY29kZXMgdGhhdCBhcmUgKnBhbmVscyogXHUyMDE0IG9uZSBiaWxsaW5nIGNvZGUsIG1hbnkgaXRlbS1zcGVjaWZpY1xuLy8gZGlzcGxheXMuIEZvciB0aGVzZSwgZGlzcGxheSBrZXl3b3JkIE1VU1QgYmUgdHJpZWQgZmlyc3QgKHNvIFwiV0JDXCJcbi8vIHVuZGVyIENCQyBwYW5lbCAwODAxMUMgZ2V0cyA2NjkwLTIsIG5vdCB0aGUgZ2VuZXJpYyBwYW5lbCBMT0lOQykuXG4vLyBGb3IgZXZlcnl0aGluZyBlbHNlIChzaW5nbGUtdGVzdCBjb2RlcyBsaWtlIDA5MDA1QyBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDYsXG4vLyAwOTA0NEMgTERMLCAxNDAzMEMgSEJzQWcpLCB0aGUgTkhJIGNvZGUgaXMgbW9yZSBzcGVjaWZpYyB0aGFuIGFueVxuLy8gZGlzcGxheSBrZXl3b3JkIGFuZCB3aW5zIG91dHJpZ2h0LlxuLy9cbi8vIERFU0lHTiBQSElMT1NPUEhZOiB0aGUgYnJpZGdlIGlzIGEgKmZhaXRoZnVsIHRyYW5zcG9ydCogbGF5ZXIgXHUyMDE0IGl0XG4vLyB0cnVzdHMgdGhlIFx1NTA2NVx1NEZERCBiaWxsaW5nIGNvZGUgYXMgYXV0aG9yaXRhdGl2ZSBmb3IgY2xpbmljYWwgaW50ZW50XG4vLyAoXHU5NjYyXHU2MjQwIGJpbGxlZCAwOTAwNUMgPSB0aGV5IG9yZGVyZWQgZmFzdGluZyBnbHVjb3NlLCByZWdhcmRsZXNzIG9mXG4vLyB3aGV0aGVyIHRoZSBvcGVyYXRpb25hbCBzcGVjaW1lbiB3YXMgYSBmaW5nZXItc3RpY2spLiBEaXNwbGF5LXN0cmluZ1xuLy8gcmUtaW50ZXJwcmV0YXRpb24gb2YgY2xpbmljYWwgY29udGV4dCAoR2x1LUFDIHZzIEZJTkdFUiBTVUdBUiB2c1xuLy8gcmFuZG9tKSBpcyBsZWZ0IHRvIHRoZSBTTUFSVCBhcHAsIHdoaWNoIGhhcyBtb3JlIFVJIGNvbnRleHQuXG5leHBvcnQgY29uc3QgRElTUExBWV9GSVJTVF9DT0RFUzogUmVhZG9ubHlTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoW1xuICBcIjA4MDExQ1wiLCAvLyBDQkMgcGFuZWxcbiAgXCIwODAxM0NcIiwgLy8gQ0JDIHcvIGF1dG8gZGlmZiBwYW5lbFxuICBcIjA2MDEzQ1wiLCAvLyBVcmluYWx5c2lzIG1hY3Jvc2NvcGljIHBhbmVsXG4gIFwiMDkwNDFCXCIsIC8vIEFCRyBwYW5lbFxuICBcIjE2MDA4Q1wiLCAvLyBTeW5vdmlhbCAvIGJvZHktZmx1aWQgcGFuZWxcbl0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgX1BBTkVMX0xPSU5DX01BUCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFBhbmVsLXNwZWNpZmljIGRpc3BsYXkgXHUyMTkyIExPSU5DIG92ZXJyaWRlcy4gVGhlc2UgcnVuIEJFRk9SRSB0aGUgZ2xvYmFsXG4vLyBfTE9JTkNfTUFQIHNvIHRoYXQgdXJpbmUgYmlsaXJ1YmluIHVuZGVyIDA2MDEzQyBtYXBzIHRvIDU3NzAtMyAodXJpbmVcbi8vIHNwZWNpbWVuKSBpbnN0ZWFkIG9mIGJlaW5nIHNoYWRvd2VkIGJ5IHRoZSBnbG9iYWwgJ2JpbGlydWJpbicgdGhhdFxuLy8gd291bGQgaW1wbHkgc2VydW0sIGFuZCBhbmFsb2dvdXMgc3BlY2ltZW4tYXdhcmUgZGlzYW1iaWd1YXRpb24gZm9yXG4vLyBvdGhlciBwYW5lbCBzdWItaXRlbXMuIEtleXMgYXJlIE5ISSBwYW5lbCBjb2RlcyAobXVzdCBhbHNvIGJlIGluXG4vLyBfRElTUExBWV9GSVJTVF9DT0RFUyk7IHZhbHVlcyBhcmUgZGlzcGxheS1rZXl3b3JkIFx1MjE5MiBMT0lOQyBkaWN0cyB0aGF0XG4vLyBmb2xsb3cgdGhlIHNhbWUgbWF0Y2hpbmcgc2VtYW50aWNzIGFzIF9MT0lOQ19NQVAgKGxlYWRpbmcgd29yZFxuLy8gYm91bmRhcnkgZm9yIEFTQ0lJLCBzdWJzdHJpbmcgZm9yIENKSykuXG5leHBvcnQgY29uc3QgUEFORUxfTE9JTkNfTUFQOiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEFsbCByb3V0aW5lIGRpcHN0aWNrIGl0ZW1zIHJlc2lkZSBvbiBhIHNpbmdsZSBOSEkgYmlsbGluZyBjb2RlLlxuICAvLyBXaXRob3V0IHRoaXMgdGFibGUgdGhleSdkIGFsbCBjb2xsYXBzZSB0byB0aGUgcGFuZWwgTE9JTkMgMjQzNTYtOCxcbiAgLy8gbG9zaW5nIHBlci1pdGVtIGdyYW51bGFyaXR5IHRoYXQncyBjbGluaWNhbGx5IHVzZWZ1bCAoZS5nLlxuICAvLyBiaWxpcnViaW4gdnMgdXJvYmlsaW5vZ2VuIGZvciBsaXZlciB3b3JrdXApLlxuICBcIjA2MDEzQ1wiOiB7XG4gICAgLy8gT3JkZXIgbWF0dGVyczogbG9uZ2VyL21vcmUtc3BlY2lmaWMga2V5cyBiZWZvcmUgZ2VuZXJpYyBvbmVzXG4gICAgLy8gKG1hdGNoZXMgX0xPSU5DX01BUCBpdGVyYXRpb24gc2VtYW50aWNzIFx1MjAxNCBmaXJzdCBoaXQgd2lucykuXG4gICAgXCJzcGVjaWZpYyBncmF2aXR5XCI6IFwiNTgxMS01XCIsIC8vIFNwZWNpZmljIGdyYXZpdHkgVXJpbmVcbiAgICBcInNwLmdyYXZpdHlcIjogXCI1ODExLTVcIixcbiAgICBcInNwIGdyYXZpdHlcIjogXCI1ODExLTVcIixcbiAgICBcdTZCRDRcdTkxQ0Q6IFwiNTgxMS01XCIsXG4gICAgXCJtaWNyby1hbGJ1bWluXCI6IFwiMTQ5NTctNVwiLCAvLyBNaWNyb2FsYnVtaW4gTWFzcy92b2wgVXJpbmVcbiAgICBtaWNyb2FsYnVtaW46IFwiMTQ5NTctNVwiLFxuICAgIFwibWFsYih1KVwiOiBcIjE0OTU3LTVcIixcbiAgICBtYWxiOiBcIjE0OTU3LTVcIixcbiAgICBcdTVGQUVcdTVDMEZcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiMTQ5NTctNVwiLFxuICAgIHVhY3I6IFwiMTQ5NTktMVwiLCAvLyBNaWNyb2FsYnVtaW4vQ3JlYXRpbmluZSByYXRpbyBVcmluZVxuICAgIFwidXJpbmUgZ2x1Y29zZVwiOiBcIjU3OTItN1wiLFxuICAgIHN1Z2FyOiBcIjU3OTItN1wiLCAvLyBOSEkgJ1x1NUMzRlx1N0NENicgLyAnU3VnYXInIHVuZGVyIDA2MDEzQ1xuICAgIFx1NUMzRlx1N0NENjogXCI1NzkyLTdcIixcbiAgICB1cm9iaWxpbm9nZW46IFwiNTgxOC0wXCIsIC8vIFVyb2JpbGlub2dlbiBVcmluZSBRbFxuICAgIFx1NUMzRlx1ODFCRFx1N0QyMFx1NTM5RjogXCI1ODE4LTBcIixcbiAgICBiaWxpcnViaW46IFwiNTc3MC0zXCIsIC8vIEJpbGlydWJpbiBVcmluZSBRbFxuICAgIFx1NUMzRlx1ODFCRFx1N0QwNVx1N0QyMDogXCI1NzcwLTNcIixcbiAgICBuaXRyaXRlOiBcIjU4MDItNFwiLCAvLyBOaXRyaXRlIFVyaW5lXG4gICAgXHU0RTlFXHU3ODVEXHU5MTc4OiBcIjU4MDItNFwiLFxuICAgIGtldG9uZXM6IFwiNTc5Ny02XCIsIC8vIEtldG9uZXMgVXJpbmVcbiAgICBrZXRvbmU6IFwiNTc5Ny02XCIsXG4gICAgXHU5MTZFXHU5QUQ0OiBcIjU3OTctNlwiLFxuICAgIHByb3RlaW46IFwiMjA0NTQtNVwiLCAvLyBQcm90ZWluIE1hc3Mvdm9sIFVyaW5lXG4gICAgXHU1QzNGXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgICBcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAgIGxldWtvY3l0ZTogXCI1Nzk5LTJcIiwgLy8gTGV1a29jeXRlcyBVcmluZVxuICAgIGxldTogXCI1Nzk5LTJcIixcbiAgICBcdTc2N0RcdTg4NDBcdTc0MDNcdTkxNkZcdTkxNzY6IFwiNTc5OS0yXCIsXG4gICAgYmxvb2Q6IFwiNTc5NC0zXCIsIC8vIEhlbW9nbG9iaW4gVXJpbmUgUWxcbiAgICBcdTZGNUJcdTg4NDA6IFwiNTc5NC0zXCIsXG4gICAgXHU4MjcyOiBcIjU3NzgtNlwiLCAvLyBDb2xvciBvZiBVcmluZSAoQ0pLIHN1YnN0cmluZylcbiAgICBjb2xvcjogXCI1Nzc4LTZcIixcbiAgICB0dXJiaWRpdHk6IFwiNTc2Ny05XCIsIC8vIEFwcGVhcmFuY2Ugb2YgVXJpbmVcbiAgICBhcHBlYXJhbmNlOiBcIjU3NjctOVwiLFxuICAgIFx1NTkxNlx1ODlDMDogXCI1NzY3LTlcIixcbiAgICBwaDogXCI1ODAzLTJcIiwgLy8gcEggb2YgVXJpbmUgKHVyaW5lLXNwZWNpZmljLCBOT1RcbiAgICAvLyB0aGUgYXJ0ZXJpYWwgMTE1NTgtNCB0aGF0IHRoZVxuICAgIC8vIGdsb2JhbCBtYXAgcG9pbnRzIHRvKVxuICAgIFx1OTE3OFx1OUU3Q1x1NUVBNjogXCI1ODAzLTJcIixcbiAgICBnbHVjb3NlOiBcIjU3OTItN1wiLCAvLyBMYXN0IGluIHRoaXMgYmxvY2sgc28gJ3VyaW5lXG4gIH0sXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0xPSU5DX01BUCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIENvbW1vbiBUYWl3YW5lc2UgSElTIGxhYiBuYW1lcyBcdTIxOTIgTE9JTkMgY29kZSBtYXBwaW5nXG5leHBvcnQgY29uc3QgTE9JTkNfTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gRGlzcGxheS1rZXl3b3JkIGZhbGxiYWNrIG9ubHkga2lja3MgaW4gd2hlbiBOTyBOSEkgY29kZSBpc1xuICAvLyBwcmVzZW50IChkYXNoYm9hcmQgcm93cywgTExNLWV4dHJhY3RlZCB0ZXh0KS4gV2hlbiB0aGUgTkhJIGNvZGVcbiAgLy8gSVMgcHJlc2VudCwgMDkwMDVDIFx1MjE5MiAxNTU4LTYgKEZhc3RpbmcpIGFuZCAwOTE0MEMgXHUyMTkyIDIzNDUtN1xuICAvLyAoZ2VuZXJpYykgd2lucyBkaXJlY3RseSB2aWEgX05ISV9UT19MT0lOQy5cbiAgLy9cbiAgLy8gRmFpdGhmdWwtdHJhbnNwb3J0IHByaW5jaXBsZTogdGhlIGJyaWRnZSBkb2VzIE5PVCByZS1pbnRlcnByZXRcbiAgLy8gZGlzcGxheSBzdHJpbmdzIGxpa2UgXCJGSU5HRVIgU1VHQVJcIiBhcyBhIGRpZmZlcmVudCBMT0lOQyBcdTIwMTQgaXRcbiAgLy8gcHJlc2VydmVzIHRoZSByYXcgZGlzcGxheSBpbiBgY29kZS50ZXh0YCBhbmQgdGhlIG9yaWdpbmFsIE5ISVxuICAvLyBjb2RlIGluIGBjb2RlLmNvZGluZ2AuIFRoZSBTTUFSVCBhcHAgZG9lcyBzcGVjaW1lbi9tZXRob2QtYXdhcmVcbiAgLy8gZ3JvdXBpbmcgb24gdGhlIGNvbnN1bWVyIHNpZGUgKHNlZSBTTUFSVCBhcHAgaGFuZG9mZiBkb2MpLlxuICBcImZhc3RpbmcgZ2x1Y29zZVwiOiBcIjE1NTgtNlwiLFxuICBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDY6IFwiMTU1OC02XCIsXG4gIFwiZ2x1LWFjXCI6IFwiMTU1OC02XCIsXG4gIFwiZ2x1Y29zZSBhY1wiOiBcIjE1NTgtNlwiLFxuICBnbHVjb3NlOiBcIjIzNDUtN1wiLFxuICBcdTg4NDBcdTdDRDY6IFwiMjM0NS03XCIsXG4gIGdsdTogXCIyMzQ1LTdcIixcbiAgLy8gSGJBMWMgTVVTVCBhcHBlYXIgYmVmb3JlIGdlbmVyaWMgXCJoYlwiIGVudHJpZXMgc28gdGhlIGxvbmdlc3QtcHJlZml4XG4gIC8vIG1hdGNoIHdpbnMgZm9yIHRoZSBcIkhiQTFjXCIgZGlzcGxheSBzdHJpbmcuIE90aGVyIEExYyBzeW5vbnltc1x1MjAyNlxuICBoYmExYzogXCI0NTQ4LTRcIixcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIjQ1NDgtNFwiLFxuICBhMWM6IFwiNDU0OC00XCIsXG4gIGhlbW9nbG9iaW46IFwiNzE4LTdcIixcbiAgXHU4ODQwXHU3RDA1XHU3RDIwOiBcIjcxOC03XCIsXG4gIGhnYjogXCI3MTgtN1wiLFxuICBoYjogXCI3MTgtN1wiLFxuICAvLyBDQkMgZGlmZiBcdTIwMTQgZW9zaW5vcGhpbCBjb3VudCBtdXN0IHByZWNlZGUgdGhlIGJhcmUgJ3diYycvJ1x1NzY3RFx1ODg0MFx1NzQwMydcbiAgLy8ga2V5cyAod2hpY2ggd291bGQgb3RoZXJ3aXNlIHdpbiBhcyBzdWJzdHJpbmdzKS5cbiAgLy8gNzExLTIgdmVyaWZpZWQgYXQgbG9pbmMub3JnOiAnRW9zaW5vcGhpbHMgWyMvdm9sdW1lXSBpbiBCbG9vZFxuICAvLyBieSBBdXRvbWF0ZWQgY291bnQnLlxuICBcdTU1RENcdTkxNzhcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNzExLTJcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIjcxMS0yXCIsXG4gIGVvc2lub3BoaWw6IFwiNzExLTJcIixcbiAgZW9zaW5vcGhpbHM6IFwiNzExLTJcIixcbiAgd2JjOiBcIjY2OTAtMlwiLFxuICBcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNjY5MC0yXCIsXG4gIHBsYXRlbGV0OiBcIjc3Ny0zXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCI3NzctM1wiLFxuICBwbHQ6IFwiNzc3LTNcIixcbiAgLy8gUkJDICsgUkJDIGluZGljZXMgXHUyMDE0IHZlcmlmaWVkIExPSU5DcyAobG9pbmMub3JnKTpcbiAgLy8gNzg5LTggIEVyeXRocm9jeXRlcyAjL3ZvbCBCbG9vZCBBdXRvICAgICAgICAgICAgICBcdTIxOTIgUkJDXG4gIC8vIDc4NS02ICBFcnl0aHJvY3l0ZSBtZWFuIGNvcnB1c2N1bGFyIGhlbW9nbG9iaW4gICAgXHUyMTkyIE1DSFxuICAvLyBMb25nIENKSyBmb3JtcyBmaXJzdCAoTERML2Nob2xlc3Rlcm9sIHBhdHRlcm4pIHNvICdcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcbiAgLy8gXHU4ODQwXHU4MjcyXHU3RDIwJyB3aW5zIG92ZXIgXHU3RDA1XHU4ODQwXHU3NDAzLlxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjA6IFwiNzg1LTZcIixcbiAgcmJjOiBcIjc4OS04XCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCI3ODktOFwiLFxuICBtY2g6IFwiNzg1LTZcIixcbiAgLy8gVXJpbmUgY3JlYXRpbmluZSBcdTIwMTQgTVVTVCBhcHBlYXIgYmVmb3JlIGdlbmVyaWMgJ2NyZWF0aW5pbmUnIHNvXG4gIC8vIHJvd3MgbGlrZSAnVS1DUkUgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwJyBvciAnQ3JlYXRpbmluZShVKScgcmVzb2x2ZSB0byB0aGVcbiAgLy8gdXJpbmUgTE9JTkMgKDIxNjEtOCkgaW5zdGVhZCBvZiBiZWluZyBzaGFkb3dlZCBieSB0aGUgc2VydW1cbiAgLy8gZGVmYXVsdCAoMjE2MC0wKS4gU2FtZSBsb25nZXN0LXNwZWNpZmljLWZpcnN0IG9yZGVyaW5nIGFzXG4gIC8vIHRoZSBmYXN0aW5nLXZzLXJhbmRvbSBnbHVjb3NlIGJsb2NrLlxuICBcInVyaW5lIGNyZWF0aW5pbmVcIjogXCIyMTYxLThcIixcbiAgXCJjcmVhdGluaW5lIHVyaW5lXCI6IFwiMjE2MS04XCIsXG4gIFwiY3JlYXRpbmluZSh1KVwiOiBcIjIxNjEtOFwiLFxuICBcInUtY3JlXCI6IFwiMjE2MS04XCIsXG4gIFwidS1jcmVhXCI6IFwiMjE2MS04XCIsXG4gIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MDogXCIyMTYxLThcIixcbiAgY3JlYXRpbmluZTogXCIyMTYwLTBcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIjIxNjAtMFwiLFxuICBcdTgwOENcdTkxNTBcdTkxNzg6IFwiMjE2MC0wXCIsIC8vIFRhaXdhbiB2YXJpYW50IHNwZWxsaW5nXG4gIGNyZWE6IFwiMjE2MC0wXCIsXG4gIGJ1bjogXCIzMDk0LTBcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIjMwOTQtMFwiLFxuICBhc3Q6IFwiMTkyMC04XCIsXG4gIGFsdDogXCIxNzQyLTZcIixcbiAgZmVycml0aW46IFwiMjI3Ni00XCIsXG4gIFx1ODg0MFx1NkUwNVx1OTQzNVx1ODZDQlx1NzY3RDogXCIyMjc2LTRcIixcbiAgZmVycjogXCIyMjc2LTRcIixcbiAgLy8gVml0YWwtc2lnbnMgZnJvbSBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjUgKElIS0UzNDAyKSBcdTIwMTQgc2VwYXJhdGUgY29kZSBuYW1lc3BhY2VcbiAgLy8gYnV0IHRoZSBsb29rdXAgaXMgYnkgZGlzcGxheS1uYW1lIHN1YnN0cmluZywgc2FtZSBhcyBmb3IgbGFicy5cbiAgXCJib2R5IGhlaWdodFwiOiBcIjgzMDItMlwiLFxuICBcImJvZHkgd2VpZ2h0XCI6IFwiMjk0NjMtN1wiLFxuICBibWk6IFwiMzkxNTYtNVwiLFxuICAvLyBXYWlzdCBjaXJjdW1mZXJlbmNlIFx1MjAxNCBtZWFzdXJlbWVudCBMT0lOQyAoODI4MC0wKS4gNTYwODYtMiBpc1xuICAvLyB0aGUgJ0FkdWx0IFdhaXN0IENpcmN1bWZlcmVuY2UgUHJvdG9jb2wnIGNvZGUsIHdoaWNoIGlzIGFcbiAgLy8gc3VydmV5L3Byb3RvY29sIGRlc2NyaXB0b3IsIE5PVCBhIG51bWVyaWMgbWVhc3VyZW1lbnRcbiAgLy8gKHZlcmlmaWVkIGF0IGxvaW5jLm9yZykuIE5ISSBcdTUwNjVcdTRGREQgcmVwb3J0cyBhIHNpbmdsZSB3YWlzdGxpbmVcbiAgLy8gbnVtYmVyIHBlciB2aXNpdCwgc28gdGhlIG1lYXN1cmVtZW50IGNvZGUgaXMgY29ycmVjdC5cbiAgXCJ3YWlzdCBjaXJjdW1mZXJlbmNlXCI6IFwiODI4MC0wXCIsXG4gIFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIjogXCI4NDgwLTZcIixcbiAgXCJkaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIjogXCI4NDYyLTRcIixcbiAgLy8gTGlwaWQgcGFuZWwgXHUyMDE0IE9SREVSIE1BVFRFUlMuIExETC9IREwgdmFyaWFudHMgTVVTVCBwcmVjZWRlIHRoZVxuICAvLyBnZW5lcmljICdjaG9sZXN0ZXJvbCcga2V5IHNvIGEgcm93IGxhYmVsbGVkICdMREwgQ0hPTEVTVEVST0wnXG4gIC8vIHJlc29sdmVzIHRvIDEzNDU3LTcgKExETCBjYWxjdWxhdGVkKSBhbmQgJ0hETCBDSE9MRVNURVJPTCcgdG9cbiAgLy8gMjA4NS05LCBpbnN0ZWFkIG9mIGZhbGxpbmcgdG8gMjA5My0zICh0b3RhbCBjaG9sZXN0ZXJvbCkgdmlhIHRoZVxuICAvLyAnY2hvbGVzdGVyb2wnIHN1YnN0cmluZy4gU2FtZSBjYW5vbmljYWwgb3JkZXJpbmcgYXMgX0xBQl9TWU5PTllNUy5cbiAgXCJsZGwgY2hvbGVzdGVyb2xcIjogXCIxMzQ1Ny03XCIsXG4gIFwibGRsLWNob2xlc3Rlcm9sXCI6IFwiMTM0NTctN1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiMTM0NTctN1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMTM0NTctN1wiLFxuICAvLyAxMzQ1Ny03ID0gTERMIGNob2xlc3Rlcm9sIChjYWxjdWxhdGVkKSBcdTIwMTQgbWF0Y2hlcyB0aGUgTkhJIDA5MDQ0Q1xuICAvLyBiaWxsaW5nIGNvZGUncyBpbnRlbnQgKFRhaXdhbiBsYWJzIHByZWRvbWluYW50bHkgcmVwb3J0IGNhbGN1bGF0ZWRcbiAgLy8gTERMIHZpYSBGcmllZGV3YWxkKS4gS2VlcCBjb25zaXN0ZW50IHdpdGggX05ISV9UT19MT0lOQ1tcIjA5MDQ0Q1wiXS5cbiAgXCJsZGwtY1wiOiBcIjEzNDU3LTdcIixcbiAgbGRsOiBcIjEzNDU3LTdcIixcbiAgXCJoZGwgY2hvbGVzdGVyb2xcIjogXCIyMDg1LTlcIixcbiAgXCJoZGwtY2hvbGVzdGVyb2xcIjogXCIyMDg1LTlcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwODUtOVwiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA4NS05XCIsXG4gIFwiaGRsLWNcIjogXCIyMDg1LTlcIixcbiAgaGRsOiBcIjIwODUtOVwiLFxuICAvLyBUb3RhbCBjaG9sZXN0ZXJvbCBcdTIwMTQgYmFyZSAnY2hvbGVzdGVyb2wnIG9ubHkgZmlyZXMgQUZURVIgdGhlXG4gIC8vIExETC9IREwtcHJlZml4ZWQgdmFyaWFudHMgYWJvdmUgaGF2ZSBiZWVuIGNoZWNrZWQuXG4gIFwidG90YWwgY2hvbGVzdGVyb2xcIjogXCIyMDkzLTNcIixcbiAgXCJ0LWNob2xlc3Rlcm9sXCI6IFwiMjA5My0zXCIsXG4gIFx1ODg0MFx1NkUwNVx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDkzLTNcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwOTMtM1wiLFxuICBjaG9sZXN0ZXJvbDogXCIyMDkzLTNcIixcbiAgdHJpZ2x5Y2VyaWRlOiBcIjI1NzEtOFwiLFxuICBcdTRFMDlcdTkxNzhcdTc1MThcdTZDQjlcdTkxNkY6IFwiMjU3MS04XCIsXG4gIFwidXJpYyBhY2lkXCI6IFwiMzA4NC0xXCIsXG4gIGVnZnI6IFwiMzM5MTQtM1wiLFxuICBoYnNhZzogXCI1MTk2LTFcIixcbiAgXCJhbnRpLWhjdlwiOiBcIjE2MTI4LTFcIixcbiAgLy8gVXJpbmUgcHJvdGVpbiAoZGlzcGxheSBmYWxsYmFjayBmb3IgdGhlIG5vLU5ISS1jb2RlIHBhdGggdGhhdFxuICAvLyBjb21lcyBmcm9tIElIS0UzNDAyIHZpdGFscyArIGFkdWx0LXByZXZlbnRpdmUgc3VwcGxlbWVudHMpLlxuICBcInVyaW5lIHByb3RlaW5cIjogXCIyMDQ1NC01XCIsIC8vIFByb3RlaW4gTWFzcy92b2wgVXJpbmVcbiAgXCJ1LXByb1wiOiBcIjIwNDU0LTVcIixcbiAgXHU1QzNGXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgLy8gQUJHIHBhbmVsIGNvbXBvbmVudHMgXHUyMDE0IDA5MDQxQiBwYXJlbnQgY29kZSBpbiBOSElfVE9fTE9JTkM7IGVhY2hcbiAgLy8gbWVtYmVyJ3MgZGlzcGxheSAoXCJwQ08yXCIsIFwicE8yXCIsIFwiSENPM1wiLCBcIlRDTzJcIiwgXCJTQkUvQUJFXCIsXG4gIC8vIFwiU0JDXCIsIFwiU0FUXCIgLyBcIlNhTzJcIikgZmFsbHMgdG8gaXRzIG93biBMT0lOQy5cbiAgLy8gcEggTVVTVCBjb21lIGJlZm9yZSBwY28yL3BvMiBzbyB0aGUgYmFyZSBcInBIXCIgZGlzcGxheSBsYW5kcyBoZXJlLlxuICBwaDogXCIxMTU1OC00XCIsIC8vIHBIIG9mIEFydGVyaWFsIGJsb29kXG4gIHBjbzI6IFwiMjAxOS04XCIsIC8vIENhcmJvbiBkaW94aWRlIHBwIGluIEFydGVyaWFsIGJsb29kXG4gIHBvMjogXCIyNzAzLTdcIiwgLy8gT3h5Z2VuIHBwIGluIEFydGVyaWFsIGJsb29kXG4gIGhjbzM6IFwiMTk1OS02XCIsIC8vIEJpY2FyYm9uYXRlIE1vbGVzL3ZvbCBBcnRlcmlhbFxuICBiaWNhcmJvbmF0ZTogXCIxOTU5LTZcIixcbiAgdGNvMjogXCIyMDI4LTlcIiwgLy8gVG90YWwgQ08yIE1vbGVzL3ZvbCBBcnRlcmlhbFxuICBzYmU6IFwiMTE1NTUtMFwiLCAvLyBTdGFuZGFyZCBiYXNlIGV4Y2VzcyBBcnRlcmlhbFxuICBhYmU6IFwiMTE1NTUtMFwiLFxuICBzYmM6IFwiMTkyNS03XCIsIC8vIFN0YW5kYXJkIGJpY2FyYm9uYXRlIEFydGVyaWFsXG4gIHNhdHVyYXQ6IFwiMjcxMy02XCIsIC8vIE8yIHNhdHVyYXRpb24gQXJ0ZXJpYWxcbiAgc2FvMjogXCIyNzEzLTZcIixcbiAgc2F0OiBcIjI3MTMtNlwiLCAvLyBOSEkgZGlzcGxheSBzaG93cyBqdXN0IFwiU0FUXCJcbiAgLy8gU3lub3ZpYWwgLyBib2R5LWZsdWlkIGNvbXBvbmVudHMgKDE2MDA4QyBwYXJlbnQgYWJvdmUpLlxuICBcInNmLmNvbG9yXCI6IFwiNTc3OC02XCIsIC8vIENvbG9yIG9mIEJvZHkgZmx1aWQgKHJldXNlIFVyaW5lIGNvbG9yIHNwZWMgT0spXG4gIC8vIE5PVEU6IDgyNTUtMiAvIDEzOTQ4LTUgcHJldmlvdXNseSBsaXN0ZWQgaGVyZSBib3RoIHR1cm5lZCBvdXRcbiAgLy8gdG8gYmUgdW5yZWxhdGVkIExPSU5DcyAodmVyaWZpZWQgbG9pbmMub3JnIFx1MjAxNCA4MjU1LTIgaXNcbiAgLy8gJ1NlcnZpY2UgY29tbWVudCAxMycsIDEzOTQ4LTUgaXMgJ0NvY2NpZGlvaWRlcyBpbW1pdGlzIElnTVxuICAvLyBBYicpLiBCb2R5LWZsdWlkIEFwcGVhcmFuY2UgLyBSQkMgZG9uJ3QgaGF2ZSB3ZWxsLWF0dGVzdGVkXG4gIC8vIExPSU5DcyBpbiBvdXIgdGFibGUgeWV0IFx1MjAxNCBmYWxsaW5nIHRocm91Z2ggdG8gY29kZS50ZXh0LW9ubHlcbiAgLy8gaXMgc2FmZXIgdGhhbiBlbWl0dGluZyBhIG1pc2xlYWRpbmcgTE9JTkMuIFRvIGFkZCBsYXRlcixcbiAgLy8gdmVyaWZ5IGVhY2ggYWdhaW5zdCBsb2luYy5vcmcgZmlyc3QuXG4gIFwic2Yud2JjXCI6IFwiMjY0NjYtM1wiLCAvLyBXQkMgIy92b2wgQm9keSBmbHVpZFxuICBcInNmLm5ldXRyb3BoaWxcIjogXCIxMDMyOC02XCIsIC8vIE5ldXRyb3BoaWxzLzEwMCBsZXVrb2N5dGVzIGluIEJvZHkgZmx1aWRcbiAgXCJzZi5seW1waG9cIjogXCIxMzA0Ni04XCIsIC8vIEx5bXBob2N5dGVzICMvdm9sIEJvZHkgZmx1aWRcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfTE9JTkNfRElTUExBWSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIENhbm9uaWNhbCBFbmdsaXNoIGRpc3BsYXkgbmFtZXMgZm9yIExPSU5DIGNvZGVzIHRoZSBicmlkZ2UgZW1pdHMuXG4vLyBGYWxscyBiYWNrIHRvIHRoZSByYXcgaW5wdXQgZGlzcGxheSB3aGVuIGEgTE9JTkMgaXNuJ3QgbGlzdGVkIGhlcmUuXG4vLyBTb3VyY2VkIGZyb20gbG9pbmMub3JnIGNhbm9uaWNhbCBzaG9ydCBuYW1lcyB3aGVyZSBhcHBsaWNhYmxlLlxuLy8gQWRkIG5ldyBlbnRyaWVzIGFzIHdlIHdpZGVuIExPSU5DIGNvdmVyYWdlIFx1MjAxNCB0aGUgbG9va3VwIGlzIGtleWVkIG9uXG4vLyBMT0lOQyBzdHJpbmcsIHNvIHVubWFwcGVkIExPSU5DcyBkZWdyYWRlIGdyYWNlZnVsbHkgdG8gdGhlIE5ISSB0ZXh0LlxuZXhwb3J0IGNvbnN0IExPSU5DX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MgcGFuZWwgc3ViLWl0ZW1zKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gTW9zdCBjcml0aWNhbCBibG9jayBcdTIwMTQgTkhJJ3MgXCJDb2xvciBcdTVDM0YgXHU5ODRGICAuLi5cIiBzdHlsZSBsYWJlbHMgYXJlXG4gIC8vIHdoYXQgdHJpZ2dlcnMgZG93bnN0cmVhbSBDaGluZXNlLXN1YnN0cmluZyBsYWJlbGxpbmcgYnVncy5cbiAgXCI1ODAzLTJcIjogXCJwSCBvZiBVcmluZVwiLFxuICBcIjU4MTEtNVwiOiBcIlNwZWNpZmljIGdyYXZpdHkgb2YgVXJpbmVcIixcbiAgXCI1NzcwLTNcIjogXCJCaWxpcnViaW4gVXJpbmUgUWxcIixcbiAgXCI1ODAyLTRcIjogXCJOaXRyaXRlIFVyaW5lIFFsXCIsXG4gIFwiNTc3OC02XCI6IFwiQ29sb3Igb2YgVXJpbmVcIixcbiAgXCI1NzY3LTlcIjogXCJBcHBlYXJhbmNlIG9mIFVyaW5lXCIsXG4gIFwiNTgxOC0wXCI6IFwiVXJvYmlsaW5vZ2VuIFVyaW5lIFFsXCIsXG4gIFwiMjA0NTQtNVwiOiBcIlByb3RlaW4gTWFzcy9Wb2wgaW4gVXJpbmVcIixcbiAgXCIxNDk1Ny01XCI6IFwiTWljcm9hbGJ1bWluIE1hc3MvVm9sIGluIFVyaW5lXCIsXG4gIFwiMTQ5NTktMVwiOiBcIk1pY3JvYWxidW1pbi9DcmVhdGluaW5lIFJhdGlvIGluIFVyaW5lXCIsXG4gIFwiNTc5Mi03XCI6IFwiR2x1Y29zZSBVcmluZSBRbFwiLFxuICBcIjU3OTctNlwiOiBcIktldG9uZXMgVXJpbmUgUWxcIixcbiAgXCI1Nzk0LTNcIjogXCJIZW1vZ2xvYmluIFVyaW5lIFFsXCIsXG4gIFwiNTc5OS0yXCI6IFwiTGV1a29jeXRlcyBVcmluZSBRbFwiLFxuICBcIjI0MzU2LThcIjogXCJVcmluYWx5c2lzIE1hY3JvIFBhbmVsXCIsXG4gIC8vIEFMTCBlbnRyaWVzIGJlbG93IHVzZSB0aGUgTE9JTkMgY2Fub25pY2FsICdMb25nIENvbW1vbiBOYW1lJ1xuICAvLyBhcyBhY2NlcHRlZCBieSB0aGUgVFdOSElGSElSIHZhbGlkYXRvci4gU291cmNlOiBsb2luYy5vcmcgZm9yXG4gIC8vIGVhY2ggY29kZSwgY3Jvc3MtY2hlY2tlZCBhZ2FpbnN0IHRoZSB2YWxpZGF0b3IncyByZXBvcnRlZFxuICAvLyAnVmFsaWQgZGlzcGxheSBpcyBvbmUgb2YgTiBjaG9pY2VzJyBmb3IgZGlzcGxheXMgd2UgcHJldmlvdXNseVxuICAvLyBnb3Qgd3JvbmcgKDQ1IExPSU5DcyBmb3VuZCBpbiB0aGUgUDMzMzMzMzMzMyB2YWxpZGF0aW9uIHJ1bikuXG4gIC8vIFdoZW4gdXBkYXRpbmcsIGNvcHkgdGhlIGV4YWN0IGVuLVVTIGxvbmcgbmFtZSBmcm9tIGxvaW5jLm9yZyBcdTIwMTRcbiAgLy8gdGhlIHZhbGlkYXRvciBpcyBzZW5zaXRpdmUgdG8gc3BlbGxpbmcgLyBwdW5jdHVhdGlvbi5cbiAgLy9cbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQyBwYW5lbCBzdWItaXRlbXMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBcdTI1MDBcdTI1MDAgQUJHICgwOTA0MUIgcGFuZWwpIFx1MjAxNCBub3QgaW4gdmFsaWRhdG9yIG91dHB1dDsgbG9pbmMub3JnIHNvdXJjZWRcbiAgXCIxMTU1OC00XCI6IFwicEggb2YgQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIyMDE5LThcIjogXCJDYXJib24gZGlveGlkZSBbUGFydGlhbCBwcmVzc3VyZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIyNzAzLTdcIjogXCJPeHlnZW4gW1BhcnRpYWwgcHJlc3N1cmVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMTk1OS02XCI6IFwiQmljYXJib25hdGUgW01vbGVzL3ZvbHVtZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIyMDI4LTlcIjogXCJDYXJib24gZGlveGlkZSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxMTU1NS0wXCI6IFwiQmFzZSBleGNlc3MgaW4gQXJ0ZXJpYWwgYmxvb2QgYnkgY2FsY3VsYXRpb25cIixcbiAgXCIxOTI1LTdcIjogXCJCaWNhcmJvbmF0ZSBbTW9sZXMvdm9sdW1lXSBpbiBBcnRlcmlhbCBibG9vZCAtLXN0YW5kYXJkXCIsXG4gIFwiMjcxMy02XCI6IFwiT3h5Z2VuIHNhdHVyYXRpb24gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTU1OC02XCI6IFwiRmFzdGluZyBnbHVjb3NlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjM0NS03XCI6IFwiR2x1Y29zZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgSGVtYXRvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI3MTgtN1wiOiBcIkhlbW9nbG9iaW4gW01hc3Mvdm9sdW1lXSBpbiBCbG9vZFwiLFxuICBcIjQ1NDgtNFwiOiBcIkhlbW9nbG9iaW4gQTFjL0hlbW9nbG9iaW4udG90YWwgaW4gQmxvb2RcIixcbiAgXCI2NjkwLTJcIjogXCJMZXVrb2N5dGVzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3NzctM1wiOiBcIlBsYXRlbGV0cyBbLCAgLy8gL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzg5LThcIjogXCJFcnl0aHJvY3l0ZXMgWywgIC8vIC92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc4NS02XCI6IFwiTUNIIFtFbnRpdGljIG1hc3NdIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjcxMS0yXCI6IFwiRW9zaW5vcGhpbHMgWywgIC8vIC92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjQ1NDQtM1wiOiBcIkhlbWF0b2NyaXQgW1ZvbHVtZSBGcmFjdGlvbl0gb2YgQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNTcwMjEtOFwiOiBcIkNCQyBXIEF1dG8gRGlmZmVyZW50aWFsIHBhbmVsIC0gQmxvb2RcIixcbiAgXCIyNDMxNy0wXCI6IFwiSGVtb2dyYW0gYW5kIHBsYXRlbGV0cyBXTyBkaWZmZXJlbnRpYWwgcGFuZWwgLSBCbG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IC8gbGl2ZXIgLyByZW5hbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxOTIwLThcIjogXCJBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc0Mi02XCI6IFwiQWxhbmluZSBhbWlub3RyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMTYwLTBcIjogXCJDcmVhdGluaW5lIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjE2MS04XCI6IFwiQ3JlYXRpbmluZSBbTWFzcy92b2x1bWVdIGluIFVyaW5lXCIsXG4gIFwiMzM5MTQtM1wiOlxuICAgIFwiR2xvbWVydWxhciBmaWx0cmF0aW9uIHJhdGUgW1ZvbHVtZSBSYXRlL0FyZWFdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBDcmVhdGluaW5lLWJhc2VkIGZvcm11bGEgKE1EUkQpLzEuNzMgc3EgTVwiLFxuICBcIjMwOTQtMFwiOiBcIlVyZWEgbml0cm9nZW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMDg0LTFcIjogXCJVcmF0ZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI5NTEtMlwiOiBcIlNvZGl1bSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyODIzLTNcIjogXCJQb3Rhc3NpdW0gW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk3NS0yXCI6IFwiQmlsaXJ1YmluLnRvdGFsIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk2OC03XCI6IFwiQmlsaXJ1YmluLmRpcmVjdCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3NTEtN1wiOiBcIkFsYnVtaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyNTMyLTBcIjogXCJMYWN0YXRlIGRlaHlkcm9nZW5hc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjY3NjgtNlwiOiBcIkFsa2FsaW5lIHBob3NwaGF0YXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzI0LTJcIjogXCJHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc4NjEtNlwiOiBcIkNhbGNpdW0gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIExpcGlkIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjIwOTMtM1wiOiBcIkNob2xlc3Rlcm9sIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjU3MS04XCI6IFwiVHJpZ2x5Y2VyaWRlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjA4NS05XCI6IFwiQ2hvbGVzdGVyb2wgaW4gSERMIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTM0NTctN1wiOiBcIkNob2xlc3Rlcm9sIGluIExETCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBjYWxjdWxhdGlvblwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVGh5cm9pZCAvIGhvcm1vbmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjMwMTYtM1wiOiBcIlRoeXJvdHJvcGluIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMwMjQtN1wiOiBcIlRoeXJveGluZSAoVDQpIGZyZWUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyOTg2LThcIjogXCJUZXN0b3N0ZXJvbmUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCI4MzA5OC00XCI6IFwiRm9sbGl0cm9waW4gW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIFwiODMwOTYtOFwiOiBcIkVzdHJhZGlvbCAoRTIpIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkaWFjIC8gaW5mbGFtbWF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEwODM5LTlcIjogXCJUcm9wb25pbiBJLmNhcmRpYWMgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMzc2Mi02XCI6IFwiTmF0cml1cmV0aWMgcGVwdGlkZS5CIHByb2hvcm1vbmUgTi1UZXJtaW5hbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5ODgtNVwiOiBcIkMgcmVhY3RpdmUgcHJvdGVpbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMzOTU5LThcIjogXCJQcm9jYWxjaXRvbmluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgLyBzZXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI1MTk1LTNcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCI1MTk2LTFcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtVbml0cy92b2x1bWVdIGluIFNlcnVtXCIsXG4gIFwiMTYxMjgtMVwiOiBcIkhlcGF0aXRpcyBDIHZpcnVzIEFiIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCIxMzk1NS0wXCI6IFwiSGVwYXRpdGlzIEMgdmlydXMgQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENvYWd1bGF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjYzMDEtNlwiOiBcIklOUiBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYSBieSBDb2FndWxhdGlvbiBhc3NheVwiLFxuICBcIjE0OTc5LTlcIjogXCJhUFRUIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hIGJ5IENvYWd1bGF0aW9uIGFzc2F5XCIsXG4gIFwiMzAyNDAtNlwiOiBcIkZpYnJpbiBELWRpbWVyIFtNYXNzL3ZvbHVtZV0gaW4gUGxhdGVsZXQgcG9vciBwbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIFZpdGFsIHNpZ25zIChJSEtFMzQwMikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiODMwMi0yXCI6IFwiQm9keSBoZWlnaHRcIixcbiAgXCIyOTQ2My03XCI6IFwiQm9keSB3ZWlnaHRcIixcbiAgXCIzOTE1Ni01XCI6IFwiQm9keSBtYXNzIGluZGV4IChCTUkpIFtSYXRpb11cIixcbiAgXCI4MjgwLTBcIjogXCJXYWlzdCBDaXJjdW1mZXJlbmNlIGF0IHVtYmlsaWN1cyBieSBUYXBlIG1lYXN1cmVcIixcbiAgXCI4NDgwLTZcIjogXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiLFxuICBcIjg0NjItNFwiOiBcIkRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiLFxuICBcIjg1MzU0LTlcIjogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbCB3aXRoIGFsbCBjaGlsZHJlbiBvcHRpb25hbFwiLFxufTtcbiIsICIvKipcbiAqIFB1cmUgcGFyc2luZyBoZWxwZXJzIFx1MjAxNCByZWZlcmVuY2UgcmFuZ2UsIHF1YW50aXR5LCBVQ1VNIHVuaXQgbm9ybWFsaXNhdGlvbi5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvX3BhcnNlcnMucHlgLiBTZWxmLWNvbnRhaW5lZDogbm8gZGVwZW5kZW5jaWVzXG4gKiBvbiBvdGhlciBvYnNlcnZhdGlvbiBtb2R1bGUgcGllY2VzLlxuICpcbiAqIFB1YmxpYyBBUEk6XG4gKiAgIHRvVWN1bSh1bml0KSAgICAgICAgICAgICAgICAgIFx1MjE5MiBjYW5vbmljYWwgVUNVTSB1bml0IHN0cmluZyAob3IgbnVsbClcbiAqICAgcGFyc2VSYW5nZU11bHRpKHJhdywgdW5pdCkgICAgXHUyMTkyIGxpc3Qgb2YgRkhJUiByZWZlcmVuY2VSYW5nZSBlbnRyaWVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9uZSBwZXIgc2V4IHdoZW4gc2V4LXN0cmF0aWZpZWQpXG4gKiAgIHBhcnNlUmFuZ2UocmF3LCB1bml0KSAgICAgICAgIFx1MjE5MiBzaW5nbGUgcmVmZXJlbmNlUmFuZ2UgZW50cnlcbiAqICAgdHJ5UGFyc2VRdWFudGl0eShyYXcsIHVuaXQpICAgXHUyMTkyIEZISVIgUXVhbnRpdHkgZGljdCBvciBudWxsXG4gKi9cblxuY29uc3QgVUNVTV9TWVNURU0gPSBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIjtcblxuLy8gRkhJUiBSNCBRdWFudGl0eS5jb21wYXJhdG9yIGFsbG93ZWQgdmFsdWVzLiBOb3JtYWxpc2UgZnVsbC13aWR0aCBDSktcbi8vIFx1RkYxRSBcdUZGMUMgXHUyMjY3IFx1MjI2NiArIEFTQ0lJIHZhcmlhbnRzIHNvIFwiXHVGRjFFIDQwLjBcIiBzdGlsbCBwYXJzZXMgYXMgYSByZWFsIG51bWJlclxuLy8gaW5zdGVhZCBvZiBmYWxsaW5nIHRocm91Z2ggdG8gdmFsdWVTdHJpbmcgKHdoaWNoIGxvc2VzIHRoZSB1bml0KS5cbmNvbnN0IEZVTExXSURUSF9PUFM6IFJlYWRvbmx5QXJyYXk8W3N0cmluZywgc3RyaW5nXT4gPSBbXG4gIFtcIlx1RkYxRVwiLCBcIj5cIl0sXG4gIFtcIlx1RkYxQ1wiLCBcIjxcIl0sXG4gIFtcIlx1MjI2N1wiLCBcIj49XCJdLFxuICBbXCJcdTIyNjZcIiwgXCI8PVwiXSxcbiAgW1wiXHUyMjY1XCIsIFwiPj1cIl0sXG4gIFtcIlx1MjI2NFwiLCBcIjw9XCJdLFxuXTtcblxuZnVuY3Rpb24gdHJhbnNsYXRlRnVsbHdpZHRoKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBvdXQgPSBzO1xuICBmb3IgKGNvbnN0IFtmcm9tLCB0b10gb2YgRlVMTFdJRFRIX09QUykge1xuICAgIGlmIChvdXQuaW5jbHVkZXMoZnJvbSkpIHtcbiAgICAgIG91dCA9IG91dC5zcGxpdChmcm9tKS5qb2luKHRvKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuY29uc3QgQ09NUEFSQVRPUl9SRSA9IC9eXFxzKig8PXw+PXw8fD4pXFxzKiguKykkLztcblxuLy8gUmVmZXJlbmNlLXJhbmdlIHBhcnNpbmcuIE5ISSBzaGlwcyB0aGUgcmFuZ2UgYXMgcGxhaW4gdGV4dCBsaWtlXG4vLyBcIlszLjg5XVsyNi44XVwiLCBcIls0MF1bXVwiLCBcIltOZWdhdGl2ZV1cIiBvciBcIkFNIDg6MDAgNi4yLTE5LjRcIi5cbmNvbnN0IFJSX0xPV0hJR0hfQlJBQ0tFVFMgPSAvXlxccypcXFtcXHMqKFteXFxdXSopXFxzKlxcXVxccypcXFtcXHMqKFteXFxdXSopXFxzKlxcXVxccyokLztcbmNvbnN0IFJSX0RBU0hfUkFOR0UgPSAvKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqWy1+XHUyMDEzXVxccyooLT9cXGQrKD86XFwuXFxkKyk/KS87XG5jb25zdCBSUl9DT01QQVJBVE9SID0gL15cXHMqKDw9fD49fDx8PilcXHMqKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqJC87XG4vLyBTZXgtc3RyYXRpZmllZCBicmFja2V0ZWQgcmFuZ2UsIGUuZy4gXCJcdTc1Mzc6MTMuNyBcdTU5NzM6MTEuMVwiIFx1MjAxNCB1c2VkIGJ5IHNvbWVcbi8vIGhvc3BpdGFscyBmb3IgaGFlbWF0b2xvZ3kgKEhiLCBSQkMsIEhjdCkuIFB1bGxzIG91dCAoc2V4LCB2YWx1ZSkgcGFpcnMuXG4vLyBUb2xlcmF0ZXMgb3B0aW9uYWwgY29tcGFyYXRvciAoXHUyMjY3L1x1MjI2Ni8+LzwpIGJlZm9yZSB0aGUgbnVtYmVyLlxuY29uc3QgUlJfU0VYX05VTV9HID0gLyhcdTc1MzdcdTYwMjd8XHU1OTczXHU2MDI3fFx1NzUzN3xcdTU5NzN8TXxGKVxccypbOlx1RkYxQV0/XFxzKig/Ols8Plx1MjI2N1x1MjI2Nl09Pyk/XFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pL2c7XG5jb25zdCBSUl9TSU5HTEVfQlJBQ0tFVCA9IC9eXFxzKlxcW1xccyooLis/KVxccypcXF1cXHMqJC87XG5jb25zdCBSUl9RVUFMSVRBVElWRV9QQVJFTiA9XG4gIC9eXFxzKihOb3JtYWx8XHU2QjYzXHU1RTM4fE5vbnJlYWN0aXZlfE5vbi1yZWFjdGl2ZSlcXHMqXFwoXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlxcKVxccyokL2k7XG5cbmNvbnN0IFNFWF9UT19GSElSOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgXHU3NTM3XHU2MDI3OiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgXHU3NTM3OiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgTTogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIFx1NTk3M1x1NjAyNzogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxuICBcdTU5NzM6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbiAgRjogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxufTtcblxuLy8gUHVibGljIHR5cGVzIFx1MjAxNCBGSElSIFF1YW50aXR5IC8gcmVmZXJlbmNlUmFuZ2Ugc2hhcGVzIHVzZWQgZG93bnN0cmVhbS5cbmV4cG9ydCBpbnRlcmZhY2UgUXVhbnRpdHkge1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0Pzogc3RyaW5nO1xuICBzeXN0ZW0/OiBzdHJpbmc7XG4gIGNvZGU/OiBzdHJpbmc7XG4gIGNvbXBhcmF0b3I/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmFuZ2VFbnRyeSB7XG4gIHRleHQ6IHN0cmluZztcbiAgbG93PzogUXVhbnRpdHk7XG4gIGhpZ2g/OiBRdWFudGl0eTtcbiAgYXBwbGllc1RvPzogQXJyYXk8e1xuICAgIGNvZGluZzogQXJyYXk8eyBzeXN0ZW06IHN0cmluZzsgY29kZTogc3RyaW5nOyBkaXNwbGF5OiBzdHJpbmcgfT47XG4gICAgdGV4dDogc3RyaW5nO1xuICB9Pjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFVDVU0gbm9ybWFsaXNhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBOSEkgbGFicyByZXBvcnQgdW5pdHMgaW4gYSBtaXggb2YgVUNVTS1jbGVhbiBzdHJpbmdzICgnbWcvZEwnKSxcbiAqIFRhaXdhbi1zdHlsZSBlcXVpdmFsZW50cyAoJ21FcS9MJyB2cyBVQ1VNICdtZXEvTCcpLCBmdWxsLXdpZHRoIHB1bmN0dWF0aW9uXG4gKiAoJ1x1RkYwNScgdnMgJyUnKSwgYW5kIHBsYWNlaG9sZGVyIHRleHQgKCdcdTcxMjEnKS4gVGhlIFRXTkhJRkhJUiB2YWxpZGF0b3JcbiAqIHJlamVjdHMgZXZlcnl0aGluZyBleGNlcHQgY2Fub25pY2FsIFVDVU0gaW4gUXVhbnRpdHkuY29kZSwgc28gd2VcbiAqIG5vcm1hbGlzZS4gYG51bGxgIG1lYW5zIFwib21pdCBRdWFudGl0eS5jb2RlIGVudGlyZWx5XCIuXG4gKi9cbmNvbnN0IFVDVU1fT1ZFUlJJREVTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudWxsPiA9IHtcbiAgLy8gRnVsbHdpZHRoIFx1MjE5MiBBU0NJSVxuICBcIlx1RkYwNVwiOiBcIiVcIixcbiAgLy8gQ2FzZS1zZW5zaXRpdmUgVUNVTSAoRXEgaXMgJ2VxJywgbm90ICdFcScpXG4gIFwibUVxL0xcIjogXCJtZXEvTFwiLFxuICBcIm1lcS9sXCI6IFwibWVxL0xcIixcbiAgLy8gQlAgcHJvZmlsZSBmaXhlZC12YWx1ZTogbW1bSGddIG5vdCBtbUhnXG4gIG1tSGc6IFwibW1bSGddXCIsXG4gIE1NSEc6IFwibW1bSGddXCIsXG4gIC8vIENvbW1vbiBDaGluZXNlICdubyB1bml0JyBwbGFjZWhvbGRlcnMgXHUyMTkyIGRyb3AgVUNVTSBjb2RlXG4gIFx1NzEyMTogbnVsbCxcbiAgXCJcIjogbnVsbCxcbiAgXCJcdTIwMTRcIjogbnVsbCxcbiAgXCItXCI6IG51bGwsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdG9VY3VtKHVuaXQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF1bml0KSByZXR1cm4gbnVsbDtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChVQ1VNX09WRVJSSURFUywgdW5pdCkpIHtcbiAgICByZXR1cm4gVUNVTV9PVkVSUklERVNbdW5pdF0gPz8gbnVsbDtcbiAgfVxuICByZXR1cm4gdW5pdDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFF1YW50aXR5IGJ1aWxkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIG1ha2VRdWFudGl0eSh2YWx1ZTogbnVtYmVyLCB1bml0OiBzdHJpbmcpOiBRdWFudGl0eSB7XG4gIGNvbnN0IHE6IFF1YW50aXR5ID0geyB2YWx1ZSB9O1xuICBpZiAodW5pdCkge1xuICAgIHEudW5pdCA9IHVuaXQ7XG4gICAgcS5zeXN0ZW0gPSBVQ1VNX1NZU1RFTTtcbiAgICBxLmNvZGUgPSB1bml0O1xuICB9XG4gIHJldHVybiBxO1xufVxuXG5mdW5jdGlvbiB0cnlQYXJzZUZsb2F0KHM6IHN0cmluZyk6IG51bWJlciB8IG51bGwge1xuICBpZiAocyA9PT0gXCJcIiB8fCBzID09IG51bGwpIHJldHVybiBudWxsO1xuICAvLyBNaXJyb3IgUHl0aG9uJ3MgZmxvYXQoKSBcdTIwMTQgYWxsb3cgbGVhZGluZy90cmFpbGluZyB3aGl0ZXNwYWNlLFxuICAvLyBvcHRpb25hbCBzaWduLCBkZWNpbWFsLiBSZWplY3QgaWYgTmFOIE9SIGlmIGFueSBub24tbnVtZXJpYyByZXNpZHVhbFxuICAvLyAoTnVtYmVyKFwiMTJhYmNcIikgcmV0dXJucyBOYU4sIE9LOyBcIjEyICBhYmNcIiBhbHNvIE5hTiwgT0spLlxuICBjb25zdCB0cmltbWVkID0gcy50cmltKCk7XG4gIGlmICh0cmltbWVkID09PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbiA9IE51bWJlcih0cmltbWVkKTtcbiAgaWYgKE51bWJlci5pc05hTihuKSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBuO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgcGFyc2VSYW5nZU11bHRpIC8gcGFyc2VSYW5nZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBMaXN0IHZhcmlhbnQgb2YgcGFyc2VSYW5nZTogZW1pdHMgb25lIGVudHJ5IHBlciBzZXggd2hlbiB0aGUgcmFuZ2UgaXNcbiAqIHNleC1zdHJhdGlmaWVkIChcIltcdTc1Mzc6MTMuNyBcdTU5NzM6MTEuMV1bXHU3NTM3OjE3LjAgXHU1OTczOjE1LjBdXCIpLCBvdGhlcndpc2UgYVxuICogc2luZ2xlLWVsZW1lbnQgbGlzdC4gRWFjaCBlbnRyeSB0YWdnZWQgd2l0aCBhcHBsaWVzVG8gc28gZG93bnN0cmVhbVxuICogY29kZSBjYW4gcGljayB0aGUgcmlnaHQgb25lIGZvciB0aGUgcGF0aWVudCdzIHNleC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmFuZ2VNdWx0aShyYXdSYW5nZTogc3RyaW5nLCB1bml0OiBzdHJpbmcpOiBSYW5nZUVudHJ5W10ge1xuICBjb25zdCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKChyYXdSYW5nZSB8fCBcIlwiKS50cmltKCkpO1xuICBpZiAoIXMpIHJldHVybiBbXTtcblxuICBjb25zdCBsb3dCeVNleDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBjb25zdCBoaWdoQnlTZXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgbGV0IHVzZWRNdWx0aSA9IGZhbHNlO1xuXG4gIGNvbnN0IG0gPSBzLm1hdGNoKFJSX0xPV0hJR0hfQlJBQ0tFVFMpO1xuICBpZiAobSkge1xuICAgIGNvbnN0IGxvd0Jsb2IgPSBtWzFdID8/IFwiXCI7XG4gICAgY29uc3QgaGlnaEJsb2IgPSBtWzJdID8/IFwiXCI7XG4gICAgZm9yIChjb25zdCBzbSBvZiBsb3dCbG9iLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgIGlmIChzbVsxXSAmJiBzbVsyXSkgbG93QnlTZXhbc21bMV1dID0gc21bMl07XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc20gb2YgaGlnaEJsb2IubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgaWYgKHNtWzFdICYmIHNtWzJdKSBoaWdoQnlTZXhbc21bMV1dID0gc21bMl07XG4gICAgfVxuICAgIHVzZWRNdWx0aSA9IE9iamVjdC5rZXlzKGxvd0J5U2V4KS5sZW5ndGggPiAwIHx8IE9iamVjdC5rZXlzKGhpZ2hCeVNleCkubGVuZ3RoID4gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBTaW5nbGUtYnJhY2tldDogZWFjaCBwZXItc2V4IHZhbHVlJ3MgY29tcGFyYXRvciBkZWNpZGVzIGxvdyB2cyBoaWdoLlxuICAgIGNvbnN0IHNpbmdsZSA9IHMubWF0Y2goUlJfU0lOR0xFX0JSQUNLRVQpO1xuICAgIGlmIChzaW5nbGUpIHtcbiAgICAgIGNvbnN0IGlubmVyID0gc2luZ2xlWzFdID8/IFwiXCI7XG4gICAgICBmb3IgKGNvbnN0IHNtIG9mIGlubmVyLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgICAgY29uc3Qgc2V4S2V5ID0gc21bMV0gPz8gXCJcIjtcbiAgICAgICAgY29uc3QgdmFsU3RyID0gc21bMl0gPz8gXCJcIjtcbiAgICAgICAgLy8gRmluZCB0aGUgY29tcGFyYXRvciBpbW1lZGlhdGVseSBwcmVjZWRpbmcgdGhpcyBudW1iZXIuXG4gICAgICAgIC8vIE1pcnJvciB0aGUgUHl0aG9uOiByZWJ1aWxkIGEgcGVyLXNleC1rZXkgc2VhcmNoLlxuICAgICAgICBjb25zdCBwYXQgPSBuZXcgUmVnRXhwKGAke2VzY2FwZVJlZ2V4KHNleEtleSl9XFxcXHMqWzpcdUZGMUFdP1xcXFxzKihbPD5cdTIyNjdcdTIyNjZdPT8pP1xcXFxzKi0/XFxcXGRgKTtcbiAgICAgICAgY29uc3QgY20gPSBpbm5lci5tYXRjaChwYXQpO1xuICAgICAgICBjb25zdCBvcCA9IGNtPy5bMV0gPz8gXCJcIjtcbiAgICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgICAgbG93QnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfSBlbHNlIGlmIChvcCA9PT0gXCI8XCIgfHwgb3AgPT09IFwiPD1cIikge1xuICAgICAgICAgIGhpZ2hCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvd0J5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHVzZWRNdWx0aSA9IE9iamVjdC5rZXlzKGxvd0J5U2V4KS5sZW5ndGggPiAwIHx8IE9iamVjdC5rZXlzKGhpZ2hCeVNleCkubGVuZ3RoID4gMDtcbiAgICB9XG4gIH1cblxuICBpZiAodXNlZE11bHRpKSB7XG4gICAgY29uc3QgZW50cmllczogUmFuZ2VFbnRyeVtdID0gW107XG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSB1bmlvbiBvZiBrZXlzIGFjdHVhbGx5IHNlZW4gXHUyMDE0IHByZXNlcnZlIGluc2VydGlvbiBvcmRlci5cbiAgICBjb25zdCBhbGxTZXhLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgayBvZiBbLi4uT2JqZWN0LmtleXMobG93QnlTZXgpLCAuLi5PYmplY3Qua2V5cyhoaWdoQnlTZXgpXSkge1xuICAgICAgaWYgKCFhbGxTZXhLZXlzLmluY2x1ZGVzKGspKSBhbGxTZXhLZXlzLnB1c2goayk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc2V4S2V5IG9mIGFsbFNleEtleXMpIHtcbiAgICAgIGNvbnN0IG1hcHBpbmcgPSBTRVhfVE9fRkhJUltzZXhLZXldO1xuICAgICAgaWYgKCFtYXBwaW5nKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IFtmaGlyQ29kZSwgZmhpckRpc3BsYXldID0gbWFwcGluZztcbiAgICAgIGNvbnN0IGVudHJ5OiBSYW5nZUVudHJ5ID0ge1xuICAgICAgICB0ZXh0OiByYXdSYW5nZSxcbiAgICAgICAgYXBwbGllc1RvOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2hsNy5vcmcvZmhpci9hZG1pbmlzdHJhdGl2ZS1nZW5kZXJcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBmaGlyQ29kZSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmaGlyRGlzcGxheSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB0ZXh0OiBmaGlyRGlzcGxheSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfTtcbiAgICAgIGlmIChzZXhLZXkgaW4gbG93QnlTZXgpIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQobG93QnlTZXhbc2V4S2V5XSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgICAgaWYgKHNleEtleSBpbiBoaWdoQnlTZXgpIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoaGlnaEJ5U2V4W3NleEtleV0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgICBlbnRyaWVzLnB1c2goZW50cnkpO1xuICAgIH1cbiAgICBpZiAoZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBEZS1kdXAgYnkgRkhJUiBzZXggY29kZSBpbiBjYXNlIGlucHV0IGhhcyBib3RoIFx1NzUzNyBhbmQgXHU3NTM3XHU2MDI3LlxuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgY29uc3Qgb3V0OiBSYW5nZUVudHJ5W10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgZSBvZiBlbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IGMgPSBlLmFwcGxpZXNUbz8uWzBdPy5jb2RpbmdbMF0/LmNvZGU7XG4gICAgICAgIGlmICghYyB8fCBzZWVuLmhhcyhjKSkgY29udGludWU7XG4gICAgICAgIHNlZW4uYWRkKGMpO1xuICAgICAgICBvdXQucHVzaChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb25lID0gcGFyc2VSYW5nZShyYXdSYW5nZSwgdW5pdCk7XG4gIHJldHVybiBvbmUgPyBbb25lXSA6IFtdO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSByZWZlcmVuY2UtcmFuZ2UgdGV4dCBpbnRvIGEgRkhJUiByZWZlcmVuY2VSYW5nZSBlbnRyeS5cbiAqXG4gKiBTdHJhdGVneSBpbiBvcmRlcjpcbiAqICAgMS4gXCJbbG93XVtoaWdoXVwiIGJyYWNrZXRlZCBmb3JtYXQgXHUyMDE0IE5ISSdzIGNhbm9uaWNhbCBzaGFwZS5cbiAqICAgMi4gXCIzLjg5LTI2LjhcIiAvIFwiMy44OX4yNi44XCIgZGFzaCByYW5nZS5cbiAqICAgMy4gXCI+IDQwXCIgLyBcIjwgMC41XCIgc2luZ2xlLXNpZGVkLlxuICogICA0LiBRdWFsaXRhdGl2ZSAoXCJOZWdhdGl2ZVwiLCBcIkFNIDg6MDAgNi4yLTE5LjRcIikgXHUyMDE0IHRleHQtb25seS5cbiAqXG4gKiBTZXgtc3RyYXRpZmllZCBzaGFwZXMgZ28gdGhyb3VnaCBwYXJzZVJhbmdlTXVsdGkuIFJldHVybnMgbnVsbCBvbmx5XG4gKiBmb3IgZW1wdHkgaW5wdXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlKHJhd1JhbmdlOiBzdHJpbmcsIHVuaXQ6IHN0cmluZyk6IFJhbmdlRW50cnkgfCBudWxsIHtcbiAgY29uc3QgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aCgocmF3UmFuZ2UgfHwgXCJcIikudHJpbSgpKTtcbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZW50cnk6IFJhbmdlRW50cnkgPSB7IHRleHQ6IHJhd1JhbmdlIH07XG5cbiAgY29uc3QgbSA9IHMubWF0Y2goUlJfTE9XSElHSF9CUkFDS0VUUyk7XG4gIGlmIChtKSB7XG4gICAgY29uc3QgbG8gPSAobVsxXSA/PyBcIlwiKS50cmltKCk7XG4gICAgY29uc3QgaGkgPSAobVsyXSA/PyBcIlwiKS50cmltKCk7XG4gICAgZm9yIChjb25zdCBbc2lkZSwgc2lkZVZhbF0gb2YgW1xuICAgICAgW1wibG93XCIsIGxvXSxcbiAgICAgIFtcImhpZ2hcIiwgaGldLFxuICAgIF0gYXMgY29uc3QpIHtcbiAgICAgIGlmICghc2lkZVZhbCB8fCBzaWRlVmFsID09PSBcIlx1NzEyMVwiIHx8IHNpZGVWYWwgPT09IFwiXHU3QTdBXHU3NjdEXCIpIGNvbnRpbnVlO1xuXG4gICAgICAvLyAxLiBQbGFpbiBmbG9hdFxuICAgICAgY29uc3QgYXNGbG9hdCA9IHRyeVBhcnNlRmxvYXQoc2lkZVZhbCk7XG4gICAgICBpZiAoYXNGbG9hdCAhPT0gbnVsbCkge1xuICAgICAgICBlbnRyeVtzaWRlXSA9IG1ha2VRdWFudGl0eShhc0Zsb2F0LCB1bml0KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIDIuIERhc2ggcmFuZ2UgXHUyMDE0IG1lYW5pbmdmdWwgb25seSBmb3IgYGxvd2Agc2xvdDsgc3BsaXRzIGludG8gbG93K2hpZ2guXG4gICAgICBjb25zdCBkbSA9IHNpZGVWYWwubWF0Y2goUlJfREFTSF9SQU5HRSk7XG4gICAgICBpZiAoZG0gJiYgc2lkZSA9PT0gXCJsb3dcIiAmJiBlbnRyeS5oaWdoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdjEgPSB0cnlQYXJzZUZsb2F0KGRtWzFdISk7XG4gICAgICAgIGNvbnN0IHYyID0gdHJ5UGFyc2VGbG9hdChkbVsyXSEpO1xuICAgICAgICBpZiAodjEgIT09IG51bGwgJiYgdjIgIT09IG51bGwpIHtcbiAgICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodjEsIHVuaXQpO1xuICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodjIsIHVuaXQpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDMuIENvbXBhcmF0b3IgKFx1MjI2NzYwLCA8PTAuMDQgZXRjLilcbiAgICAgIGNvbnN0IGNtID0gc2lkZVZhbC5tYXRjaChSUl9DT01QQVJBVE9SKTtcbiAgICAgIGlmIChjbSkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChjbVsyXSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IG9wID0gY21bMV07XG4gICAgICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIFwiTm9ybWFsICggWCApXCIgLyBcIk5vbnJlYWN0aXZlICggWCApXCIgXHUyMDE0IFggaXMgdGhlIGN1dG9mZiAoaGlnaCBib3VuZCkuXG4gICAgICBjb25zdCBxbSA9IHNpZGVWYWwubWF0Y2goUlJfUVVBTElUQVRJVkVfUEFSRU4pO1xuICAgICAgaWYgKHFtKSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KHFtWzJdISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBjb25zdCBkYXNoTWF0Y2ggPSBzLm1hdGNoKFJSX0RBU0hfUkFOR0UpO1xuICBpZiAoZGFzaE1hdGNoKSB7XG4gICAgY29uc3QgdjEgPSB0cnlQYXJzZUZsb2F0KGRhc2hNYXRjaFsxXSEpO1xuICAgIGNvbnN0IHYyID0gdHJ5UGFyc2VGbG9hdChkYXNoTWF0Y2hbMl0hKTtcbiAgICBpZiAodjEgIT09IG51bGwgJiYgdjIgIT09IG51bGwpIHtcbiAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2MSwgdW5pdCk7XG4gICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYyLCB1bml0KTtcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgY29uc3QgY21wTWF0Y2ggPSBzLm1hdGNoKFJSX0NPTVBBUkFUT1IpO1xuICBpZiAoY21wTWF0Y2gpIHtcbiAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChjbXBNYXRjaFsyXSEpO1xuICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBvcCA9IGNtcE1hdGNoWzFdO1xuICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIC8vIEZhbGwgdGhyb3VnaDogcXVhbGl0YXRpdmUgb3IgY29tcGxleCBcdTIwMTQgdGV4dC1vbmx5IGlzIEZISVItY29ycmVjdC5cbiAgcmV0dXJuIGVudHJ5O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgdHJ5UGFyc2VRdWFudGl0eSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBQYXJzZSBcIj4gNDAuMFwiIC8gXCI8MC4wMTBcIiAvIFwiMSwyMzQuNVwiIFx1MjE5MiBGSElSIFF1YW50aXR5IHdpdGggY29tcGFyYXRvci5cbiAqIFJldHVybnMgbnVsbCB3aGVuIHRoZSByZXNpZHVhbCBhZnRlciBzdHJpcHBpbmcgYSBjb21wYXJhdG9yIHN0aWxsXG4gKiBpc24ndCBudW1lcmljIFx1MjAxNCBjYWxsZXIgZmFsbHMgYmFjayB0byB2YWx1ZVN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyeVBhcnNlUXVhbnRpdHkoXG4gIHJhd1ZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkLFxuICB1bml0OiBzdHJpbmcsXG4pOiBRdWFudGl0eSB8IG51bGwge1xuICBpZiAocmF3VmFsdWUgPT09IG51bGwgfHwgcmF3VmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XG4gIGxldCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKFN0cmluZyhyYXdWYWx1ZSkudHJpbSgpKTtcbiAgbGV0IGNvbXBhcmF0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjb25zdCBjbSA9IHMubWF0Y2goQ09NUEFSQVRPUl9SRSk7XG4gIGlmIChjbSkge1xuICAgIGNvbXBhcmF0b3IgPSBjbVsxXSA/PyBudWxsO1xuICAgIHMgPSAoY21bMl0gPz8gXCJcIikudHJpbSgpO1xuICB9XG4gIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KHMucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gIGlmICh2ID09PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB1Y3VtQ29kZSA9IHRvVWN1bSh1bml0KTtcbiAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICB2YWx1ZTogdixcbiAgICBzeXN0ZW06IFVDVU1fU1lTVEVNLFxuICB9O1xuICAvLyBRdWFudGl0eS51bml0IChodW1hbi1yZWFkYWJsZSkga2VlcHMgdGhlIG9yaWdpbmFsIE5ISSBsYWJlbCBzbyB1c2Vyc1xuICAvLyBzdGlsbCBzZWUgJ1x1RkYwNScgb3IgJ21FcS9MJyByYXcuIFF1YW50aXR5LmNvZGUgaXMgc3RyaWN0IFVDVU0gbWFjaGluZVxuICAvLyBjb2RlLiBEcm9wIHVuaXQgZGlzcGxheSB3aGVuIGVtcHR5IHNvIHdlIGRvbid0IGVtaXQgXCJ1bml0XCI6IFwiXCIuXG4gIGlmICh1bml0KSB7XG4gICAgcXR5LnVuaXQgPSB1bml0O1xuICB9XG4gIGlmICh1Y3VtQ29kZSAhPT0gbnVsbCkge1xuICAgIHF0eS5jb2RlID0gdWN1bUNvZGU7XG4gIH1cbiAgaWYgKGNvbXBhcmF0b3IpIHtcbiAgICBxdHkuY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gIH1cbiAgcmV0dXJuIHF0eTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cbiIsICIvKipcbiAqIE9ic2VydmF0aW9uIG1hcHBlciBcdTIwMTQgc2luZ2xlLXJvdyBhbmQgcGFuZWwtZ3JvdXBlZCB2YXJpYW50cy5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvb2JzZXJ2YXRpb24ucHlgICgxMjEyIGxpbmVzKS4gSW5jbHVkZXM6XG4gKiAgIC0gbWFwT2JzZXJ2YXRpb24ocmF3LCBwYXRpZW50SWQpIFx1MjE5MiBzaW5nbGUgT2JzZXJ2YXRpb25cbiAqICAgLSBtYXBPYnNlcnZhdGlvbnNHcm91cGVkKGl0ZW1zLCBwYXRpZW50SWQpIFx1MjE5MiBEaWFnbm9zdGljUmVwb3J0ICsgT2JzZXJ2YXRpb25zXG4gKiAgIC0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIFx1MjAxNCBjcm9zcy1wYWdlIGRlZHVwIGtleVxuICogICAtIGZpbmRMb2luYywgYnVpbGRDb2RpbmdzLCBtYXBJbnRlcnByZXRhdGlvbiwgZGVyaXZlSW50ZXJwcmV0YXRpb25cbiAqICAgLSBkZWR1cGVDcm9zc0Zvcm1hdCwgY29tYmluZUJwSXRlbXMsIGdyb3VwQnlPcmRlckNvZGVcbiAqICAgLSBpbmZlclNwZWNpbWVuXG4gKlxuICogRnVuY3Rpb25hbCBwYXJpdHkgd2l0aCB0aGUgUHl0aG9uIGltcGxlbWVudGF0aW9uIGlzIHRoZSBnb2FsLiBGaWVsZFxuICogb3JkZXIgaW4gdGhlIGVtaXR0ZWQgcmVzb3VyY2VzIG1heSBkaWZmZXIgKEpTIG9iamVjdCBsaXRlcmFsIG9yZGVyKVxuICogYnV0IGNvbnRlbnQgaXMgaWRlbnRpY2FsLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQge1xuICBESVNQTEFZX0ZJUlNUX0NPREVTLFxuICBMT0lOQ19ESVNQTEFZLFxuICBMT0lOQ19NQVAsXG4gIE5ISV9UT19MT0lOQyxcbiAgUEFORUxfTE9JTkNfTUFQLFxufSBmcm9tIFwiLi9sb2luYy10YWJsZXNcIjtcbmltcG9ydCB7XG4gIHR5cGUgUXVhbnRpdHksXG4gIHR5cGUgUmFuZ2VFbnRyeSxcbiAgcGFyc2VSYW5nZSxcbiAgcGFyc2VSYW5nZU11bHRpLFxuICB0b1VjdW0sXG4gIHRyeVBhcnNlUXVhbnRpdHksXG59IGZyb20gXCIuL3BhcnNlcnNcIjtcblxuLy8gXHUyNTAwXHUyNTAwIEltYWdpbmcgZGV0ZWN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBJTUFHSU5HX0tFWVdPUkRTOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBbXG4gIFwidWx0cmFzb3VuZFwiLFxuICBcInNvbm9ncmFtXCIsXG4gIFwic29ub2dyYXBoeVwiLFxuICBcImVjaG9cIixcbiAgXCJjdCBcIixcbiAgXCJjdC9cIixcbiAgXCJjdC1cIixcbiAgXCJjb21wdXRlZCB0b21vZ3JhcGh5XCIsXG4gIFwibXJpXCIsXG4gIFwibWFnbmV0aWMgcmVzb25hbmNlXCIsXG4gIFwieC1yYXlcIixcbiAgXCJ4cmF5XCIsXG4gIFwieCByYXlcIixcbiAgXCJtYW1tb2dyYXBoeVwiLFxuICBcIm1hbW1vXCIsXG4gIFwiZWtnXCIsXG4gIFwiZWNnXCIsXG4gIFwiZWxlY3Ryb2NhcmRpb2dyYW1cIixcbiAgXCJlbmRvc2NvcFwiLFxuICBcImNvbG9ub3Njb3BcIixcbiAgXCJnYXN0cm9zY29wXCIsXG4gIFwiYnJvbmNob3Njb3BcIixcbiAgXCJwZXQvY3RcIixcbiAgXCJwZXQgXCIsXG4gIFwic3BlY3RcIixcbiAgXCJcdTVGNzFcdTUwQ0ZcIixcbiAgXCJcdThEODVcdTk3RjNcdTZDRTJcIixcbiAgXCJcdTk2RkJcdTgxNjZcdTY1QjdcdTVDNjRcIixcbiAgXCJcdTY4MzhcdTc4QzFcdTUxNzFcdTYzMkZcIixcbiAgXCJcdTVGQzNcdTk2RkJcdTU3MTZcIixcbiAgXCJcdTUxNjdcdTg5OTZcdTkzRTFcIixcbiAgXCJcdTRFNzNcdTYyM0ZcdTY1MURcdTVGNzFcIixcbl07XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheTogc3RyaW5nLCBjb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgaGF5c3RhY2sgPSBgJHtkaXNwbGF5fSAke2NvZGV9YC50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gSU1BR0lOR19LRVlXT1JEUy5zb21lKChrdykgPT4gaGF5c3RhY2suaW5jbHVkZXMoa3cpKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExPSU5DIGxvb2t1cCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTkhJX0xBQl9DT0RFX1JFID0gL15cXGR7NCw2fVtBLVpdJC87XG5cbmZ1bmN0aW9uIGlzQXNjaWlPbmx5KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocy5jaGFyQ29kZUF0KGkpID4gMTI3KSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJpbWFyeSBMT0lOQyBmb3IgdGhpcyBsYWIuIFBhbmVsLWF3YXJlIGxvb2t1cDpcbiAqICAgQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgXHUyMTkyIHVzZSBOSElfVE9fTE9JTkMgZGlyZWN0bHkuXG4gKiAgIEIuIFBhbmVsIGNvZGUgT1IgdW5rbm93biBjb2RlIFx1MjE5MiB3YWxrIExPSU5DX01BUCBieSBkaXNwbGF5IGtleXdvcmQuXG4gKiAgIEMuIEZhbGxiYWNrOiBwYW5lbC1sZXZlbCBMT0lOQyBmcm9tIE5ISV9UT19MT0lOQyBpZiBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9pbmMoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgd2lucyBvdXRyaWdodC5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMgJiYgIURJU1BMQVlfRklSU1RfQ09ERVMuaGFzKGNvZGUpKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG5cbiAgY29uc3QgY29tYmluZWQgPSBgJHtjb2RlfSAke2Rpc3BsYXl9YC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIEIxLiBQYW5lbC1zcGVjaWZpYyBrZXl3b3JkIG1hcCBydW5zIEJFRk9SRSB0aGUgZ2xvYmFsIG9uZS5cbiAgaWYgKGNvZGUgaW4gUEFORUxfTE9JTkNfTUFQKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXMoUEFORUxfTE9JTkNfTUFQW2NvZGVdISkpIHtcbiAgICAgIGlmIChpc0FzY2lpT25seShrZXkpKSB7XG4gICAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa2V5LnRvTG93ZXJDYXNlKCkpfWApLnRlc3QoY29tYmluZWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNvbWJpbmVkLmluY2x1ZGVzKGtleS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICByZXR1cm4gbG9pbmM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQi4gRGlzcGxheS1rZXl3b3JkIHNlYXJjaC5cbiAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXMoTE9JTkNfTUFQKSkge1xuICAgIGlmIChpc0FzY2lpT25seShrZXkpKSB7XG4gICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICByZXR1cm4gbG9pbmM7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgIHJldHVybiBsb2luYztcbiAgICB9XG4gIH1cblxuICAvLyBDLiBQYW5lbCBjb2RlIHdpdGggbm8gcmVjb2duaXNlZCBpdGVtIGRpc3BsYXkgXHUyMTkyIGZhbGwgYmFjay5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMpIHtcbiAgICByZXR1cm4gTkhJX1RPX0xPSU5DW2NvZGVdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIE9ic2VydmF0aW9uLmNvZGUuY29kaW5nW10gbGlzdC5cbiAqIFByaW9yaXR5OiBMT0lOQyBcdTIxOTIgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgbG9jYWwgZmFsbGJhY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvZGluZ3MoXG4gIGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGRpc3BsYXk6IHN0cmluZyxcbiAgbG9pbmM6IHN0cmluZyB8IG51bGwsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10ge1xuICBjb25zdCBjb2RpbmdzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10gPSBbXTtcbiAgaWYgKGxvaW5jKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsXG4gICAgICBjb2RlOiBsb2luYyxcbiAgICAgIGRpc3BsYXk6IExPSU5DX0RJU1BMQVlbbG9pbmNdID8/IGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgY29uc3QgY29kZVN0ciA9IChjb2RlID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKGNvZGVTdHIgJiYgTkhJX0xBQl9DT0RFX1JFLnRlc3QoY29kZVN0cikpIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLk5ISV9NRURJQ0FMX09SREVSX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyLFxuICAgICAgZGlzcGxheSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERSxcbiAgICAgIGNvZGU6IGNvZGVTdHIgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGNvZGluZ3M7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBJbnRlcnByZXRhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU5URVJQX1NZUyA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92My1PYnNlcnZhdGlvbkludGVycHJldGF0aW9uXCI7XG5cbmZ1bmN0aW9uIGludGVycENvZGluZyhjb2RlOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICByZXR1cm4geyBzeXN0ZW06IElOVEVSUF9TWVMsIGNvZGUsIGRpc3BsYXkgfTtcbn1cblxuY29uc3QgSU5URVJQX1RBQkxFOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgaGlnaDogW1wiSFwiLCBcIkhpZ2hcIl0sXG4gIGxvdzogW1wiTFwiLCBcIkxvd1wiXSxcbiAgbm9ybWFsOiBbXCJOXCIsIFwiTm9ybWFsXCJdLFxuICBjcml0aWNhbDogW1wiQUFcIiwgXCJDcml0aWNhbCBhYm5vcm1hbFwiXSxcbiAgYWJub3JtYWw6IFtcIkFcIiwgXCJBYm5vcm1hbFwiXSxcbiAgcG9zaXRpdmU6IFtcIlBPU1wiLCBcIlBvc2l0aXZlXCJdLFxuICBuZWdhdGl2ZTogW1wiTkVHXCIsIFwiTmVnYXRpdmVcIl0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWFwSW50ZXJwcmV0YXRpb24oXG4gIGludGVycDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgY29uc3Qga2V5ID0gKGludGVycCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBlbnRyeSA9IElOVEVSUF9UQUJMRVtrZXldO1xuICBpZiAoIWVudHJ5KSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGludGVycENvZGluZyhlbnRyeVswXSwgZW50cnlbMV0pO1xufVxuXG4vLyBQb3NpdGl2ZSBtYXJrZXJzIFx1MjAxNCBcInRoaXMgaXMgZGV0ZWN0ZWQgLyBhYm5vcm1hbFwiLlxuY29uc3QgUE9TX01BUktFUlMgPVxuICAvXlxccyooPzpwb3NpdGl2ZXxwb3N8cmVhY3RpdmV8ZGV0ZWN0ZWR8YWJub3JtYWx8cHJlc2VudHx0cmFjZXxbMS00XT9cXHMqXFwrKD86XFxzKltcXCtcXC1dKSopXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG4vLyBOZWdhdGl2ZSBtYXJrZXJzIFx1MjAxNCBleHBsaWNpdGx5IG5vcm1hbC9hYnNlbnQuXG5jb25zdCBORUdfTUFSS0VSUyA9XG4gIC9eXFxzKig/Om5lZ2F0aXZlfG5lZ3xub25yZWFjdGl2ZXxub25bLVxcc10/cmVhY3RpdmV8bm90Wy1cXHNdP2RldGVjdGVkfG5kfGFic2VudHxub25lfG5vcm1hbHwwfFstXHUyMDE0XHUyMDEzXSspXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG5mdW5jdGlvbiBjbGFzc2lmeVF1YWxpdGF0aXZlKHRleHQ6IHVua25vd24pOiBcInBvc1wiIHwgXCJuZWdcIiB8IG51bGwge1xuICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IFN0cmluZyh0ZXh0KS50cmltKCk7XG4gIGlmIChzLnN0YXJ0c1dpdGgoXCJbXCIpICYmIHMuZW5kc1dpdGgoXCJdXCIpKSB7XG4gICAgcyA9IHMuc2xpY2UoMSwgLTEpLnRyaW0oKTtcbiAgfVxuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBpZiAoTkVHX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwibmVnXCI7XG4gIGlmIChQT1NfTUFSS0VSUy50ZXN0KHMpKSByZXR1cm4gXCJwb3NcIjtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgdmFsdWVSYXc6IHN0cmluZyxcbiAgcXR5OiBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgcnI6IFJhbmdlRW50cnkgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIC8vIDEuIE51bWVyaWMgcGF0aC5cbiAgaWYgKHF0eSAmJiB0eXBlb2YgcXR5LnZhbHVlID09PSBcIm51bWJlclwiICYmIHJyKSB7XG4gICAgY29uc3QgdiA9IHF0eS52YWx1ZTtcbiAgICBjb25zdCBsbyA9IHJyLmxvdz8udmFsdWU7XG4gICAgY29uc3QgaGkgPSByci5oaWdoPy52YWx1ZTtcbiAgICBpZiAodHlwZW9mIGhpID09PSBcIm51bWJlclwiICYmIHYgPiBoaSkgcmV0dXJuIGludGVycENvZGluZyhcIkhcIiwgXCJIaWdoXCIpO1xuICAgIGlmICh0eXBlb2YgbG8gPT09IFwibnVtYmVyXCIgJiYgdiA8IGxvKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTFwiLCBcIkxvd1wiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiIHx8IHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyAyLiBRdWFsaXRhdGl2ZSBwYXRoLlxuICBjb25zdCB2YWxLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZSh2YWx1ZVJhdyk7XG4gIGNvbnN0IHJlZlRleHQgPSBycj8udGV4dCA/PyBcIlwiO1xuICBjb25zdCByZWZLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZShyZWZUZXh0KTtcbiAgaWYgKHZhbEtpbmQgPT09IG51bGwpIHJldHVybiBudWxsO1xuICBpZiAocmVmS2luZCA9PT0gXCJuZWdcIikge1xuICAgIGlmICh2YWxLaW5kID09PSBcInBvc1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiQVwiLCBcIkFibm9ybWFsXCIpO1xuICAgIGlmICh2YWxLaW5kID09PSBcIm5lZ1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTlwiLCBcIk5vcm1hbFwiKTtcbiAgfVxuICByZXR1cm4gdmFsS2luZCA9PT0gXCJwb3NcIiA/IGludGVycENvZGluZyhcIlBPU1wiLCBcIlBvc2l0aXZlXCIpIDogaW50ZXJwQ29kaW5nKFwiTkVHXCIsIFwiTmVnYXRpdmVcIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBDYW5vbmljYWwgbGFiIGtleSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTEFCX1NZTk9OWU1TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBEaWFiZXRlc1xuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXHU3Q0Q2XHU1MzE2XHU4ODQwXHU4MjcyXHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCJIQkExQ1wiLFxuICBcIkdMWUNBVEVEIEhFTU9HTE9CSU5cIjogXCJIQkExQ1wiLFxuICBIQkExQzogXCJIQkExQ1wiLFxuICBBMUM6IFwiSEJBMUNcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcIkZBU1RJTkcgR0xVQ09TRVwiOiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcdTg0NjFcdTg0MDRcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBcdTg4NDBcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBHTFVDT1NFOiBcIkdMVUNPU0VcIixcbiAgLy8gQ0JDXG4gIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJXQkNcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIldCQ1wiLFxuICBXQkM6IFwiV0JDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJSQkNcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIlJCQ1wiLFxuICBSQkM6IFwiUkJDXCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCJIRU1PR0xPQklOXCIsXG4gIEhFTU9HTE9CSU46IFwiSEVNT0dMT0JJTlwiLFxuICBIR0I6IFwiSEVNT0dMT0JJTlwiLFxuICBcdTg4NDBcdTVCQjlcdTdBNERcdTZCRDQ6IFwiSEVNQVRPQ1JJVFwiLFxuICBIRU1BVE9DUklUOiBcIkhFTUFUT0NSSVRcIixcbiAgSENUOiBcIkhFTUFUT0NSSVRcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIlBMQVRFTEVUXCIsXG4gIFBMQVRFTEVUOiBcIlBMQVRFTEVUXCIsXG4gIFBMVDogXCJQTEFURUxFVFwiLFxuICAvLyBDQkMgaW5kaWNlcyAoMTAtY2hhciBhbmQgNy1jaGFyIENKSyBmb3JtcyBiZWF0IGJhcmUgXHU3RDA1XHU4ODQwXHU3NDAzKVxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjBcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjA6IFwiTUNIXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1NkZDM1x1NUVBNjogXCJNQ0hDXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1OUFENFx1N0E0RDogXCJNQ1ZcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzXHU1MjA2XHU1RTAzXHU1QkVDXHU1RUE2OiBcIlJEV1wiLFxuICBNQ1Y6IFwiTUNWXCIsXG4gIE1DSDogXCJNQ0hcIixcbiAgTUNIQzogXCJNQ0hDXCIsXG4gIFJEVzogXCJSRFdcIixcbiAgLy8gQ0JDIGRpZmZlcmVudGlhbFxuICBcdTU1RENcdTRFMkRcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiTkVVVFJPUEhJTFwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTkxNzhcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTlFN0NcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiQkFTT1BISUxcIixcbiAgXHU2RENCXHU1REY0XHU3NDAzOiBcIkxZTVBIT0NZVEVcIixcbiAgXHU1NUFFXHU2ODM4XHU3NDAzOiBcIk1PTk9DWVRFXCIsXG4gIEVPU0lOT1BISUxTOiBcIkVPU0lOT1BISUxcIixcbiAgRU9TSU5PUEhJTDogXCJFT1NJTk9QSElMXCIsXG4gIE5FVVRST1BISUxTOiBcIk5FVVRST1BISUxcIixcbiAgTkVVVFJPUEhJTDogXCJORVVUUk9QSElMXCIsXG4gIEJBU09QSElMUzogXCJCQVNPUEhJTFwiLFxuICBCQVNPUEhJTDogXCJCQVNPUEhJTFwiLFxuICBMWU1QSE9DWVRFUzogXCJMWU1QSE9DWVRFXCIsXG4gIExZTVBIT0NZVEU6IFwiTFlNUEhPQ1lURVwiLFxuICBNT05PQ1lURVM6IFwiTU9OT0NZVEVcIixcbiAgTU9OT0NZVEU6IFwiTU9OT0NZVEVcIixcbiAgLy8gTGlwaWQgXHUyMDE0IExETC9IREwgbXVzdCBwcmVjZWRlIGJhcmUgQ0hPTEVTVEVST0wuXG4gIFwiTERMIENIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ0hPTEVTVEVST0xcIjogXCJMRExfQ1wiLFxuICBcIkhETCBDSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFwiSERMLUNIT0xFU1RFUk9MXCI6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiTERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkhETF9DXCIsXG4gIFx1ODg0MFx1NkUwNVx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlRPVEFMIENIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTEVTVEVST0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTDogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTRFMDlcdTkxNzhcdTc1MThcdTZDQjlcdTkxNkY6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFRSSUdMWUNFUklERTogXCJUUklHTFlDRVJJREVcIixcbiAgXCJIREwtQ1wiOiBcIkhETF9DXCIsXG4gIEhETDogXCJIRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiSERMX0NcIixcbiAgXCJMREwtQyhESVJFQ1QpXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ1wiOiBcIkxETF9DXCIsXG4gIExETDogXCJMRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiTERMX0NcIixcbiAgLy8gUmVuYWwgXHUyMDE0IHVyaW5lIGNyZWF0aW5pbmUgdmFyaWFudHMgYmVmb3JlIHNlcnVtLlxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlVSSU5FIENSRUFUSU5JTkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVBXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNTBcdTkxNzg6IFwiQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoQilcIjogXCJDUkVBVElOSU5FXCIsXG4gIENSRUFUSU5JTkU6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JUTjogXCJDUkVBVElOSU5FXCIsXG4gIEVHRlI6IFwiRUdGUlwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiQlVOXCIsXG4gIEJVTjogXCJCVU5cIixcbiAgXHU1QzNGXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlVSSU5FX1BIXCIsXG4gIFx1NUMzRlx1NkRCMlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiUEhcIixcbiAgXHU1QzNGXHU5MTc4OiBcIlVSSUNfQUNJRFwiLFxuICBcIlVSSUMgQUNJRFwiOiBcIlVSSUNfQUNJRFwiLFxuICBVUklDX0FDSUQ6IFwiVVJJQ19BQ0lEXCIsXG4gIC8vIExpdmVyXG4gIEFTVDogXCJBU1RcIixcbiAgQUxUOiBcIkFMVFwiLFxuICBHT1Q6IFwiQVNUXCIsXG4gIEdQVDogXCJBTFRcIixcbiAgXHU4MUJEXHU3RDA1XHU3RDIwOiBcIkJJTElSVUJJTlwiLFxuICBCSUxJUlVCSU46IFwiQklMSVJVQklOXCIsXG4gIFx1NzY3RFx1ODZDQlx1NzY3RDogXCJBTEJVTUlOXCIsXG4gIEFMQlVNSU46IFwiQUxCVU1JTlwiLFxuICAvLyBDYXJkaWFjXG4gIFx1NUZDM1x1ODA4Q1x1NjVDQlx1OEY0OVx1ODZDQlx1NzY3RDogXCJUUk9QT05JTlwiLFxuICBUUk9QT05JTjogXCJUUk9QT05JTlwiLFxuICBCTlA6IFwiQk5QXCIsXG4gIFx1NUZDM1x1ODFERjogXCJUUk9QT05JTlwiLFxuICAvLyBUaHlyb2lkXG4gIFx1NzUzMlx1NzJDMFx1ODE3QVx1NTIzQVx1NkZDMFx1N0QyMDogXCJUU0hcIixcbiAgVFNIOiBcIlRTSFwiLFxuICBcdTZFMzhcdTk2RTJcdTc1MzJcdTcyQzBcdTgxN0FcdTdEMjA6IFwiRlJFRV9UNFwiLFxuICBcIkZSRUUgVDRcIjogXCJGUkVFX1Q0XCIsXG4gIEZUNDogXCJGUkVFX1Q0XCIsXG4gIC8vIE1pc2NcbiAgQ1x1NTNDRFx1NjFDOVx1NjAyN1x1ODZDQlx1NzY3RDogXCJDUlBcIixcbiAgXCJDLVJFQUNUSVZFIFBST1RFSU5cIjogXCJDUlBcIixcbiAgQ1JQOiBcIkNSUFwiLFxuICBcIkhTLUNSUFwiOiBcIkhTX0NSUFwiLFxuICBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUY6IFwiUFNBXCIsXG4gIFBTQTogXCJQU0FcIixcbiAgXHU5NDM1XHU4NkNCXHU3NjdEOiBcIkZFUlJJVElOXCIsXG4gIEZFUlJJVElOOiBcIkZFUlJJVElOXCIsXG4gIFx1ODQ0OVx1OTE3ODogXCJGT0xBVEVcIixcbiAgRk9MQVRFOiBcIkZPTEFURVwiLFxuICBcdTdEQURcdTc1MUZcdTdEMjBCMTI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVQgQjEyXCI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVRBTUlOIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFx1NzZBRVx1OENFQVx1N0QyMDogXCJDT1JUSVNPTFwiLFxuICBDT1JUSVNPTDogXCJDT1JUSVNPTFwiLFxuICBcdTY4ODVcdTZCRDI6IFwiUlBSXCIsXG4gIFJQUjogXCJSUFJcIixcbiAgXHU5NkIxXHU3NDAzXHU4M0NDXHU2Mjk3XHU1MzlGOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBDUllQQUc6IFwiQ1JZUFRPQ09DQ0FMX0FHXCIsXG4gIFx1ODg0MFx1NkMyODogXCJBTU1PTklBXCIsXG4gIEFNTU9OSUE6IFwiQU1NT05JQVwiLFxuICBcdTUxRERcdTg4NDBcdTkxNzZcdTUzOUZcdTY2NDJcdTk1OTM6IFwiUFRcIixcbiAgQVBUVDogXCJBUFRUXCIsXG4gIElOUjogXCJJTlJcIixcbn07XG5cbi8vIFByZS1zb3J0IGtleXMgbG9uZ2VzdC1maXJzdCBzbyBsb25nZXIvbW9yZS1zcGVjaWZpYyBtYXRjaGVzIHdpbi5cbmNvbnN0IExBQl9TWU5PTllNX0tFWVNfU09SVEVEID0gT2JqZWN0LmtleXMoTEFCX1NZTk9OWU1TKS5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbExhYktleShkaXNwbGF5OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFkaXNwbGF5KSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcyA9IGRpc3BsYXkudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBcIlwiO1xuICBjb25zdCBzVXBwZXIgPSBzLnRvVXBwZXJDYXNlKCk7XG4gIGZvciAoY29uc3Qga2V5IG9mIExBQl9TWU5PTllNX0tFWVNfU09SVEVEKSB7XG4gICAgY29uc3Qga3UgPSBrZXkudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa3UpKSB7XG4gICAgICAvLyBMZWFkaW5nIHdvcmQtYm91bmRhcnkgb25seSBcdTIwMTQgXCJBU1RcIiBpbnNpZGUgXCJESUFTVE9MSUNcIiBzaG91bGQgbm90IG1hdGNoLlxuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrdSl9YCkudGVzdChzVXBwZXIpKSB7XG4gICAgICAgIHJldHVybiBMQUJfU1lOT05ZTVNba2V5XSE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzVXBwZXIuaW5jbHVkZXMoa3UpKSB7XG4gICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBhbmVsIGdyb3VwaW5nIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICAgIGlmIChjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmKSBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGlzRW5nbGlzaERvbWluYW50KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgbGF0aW4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIHtcbiAgICBjb25zdCBjcCA9IGNoLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGNwIDwgMTI4ICYmIC9bQS1aYS16XS8udGVzdChjaCkpIGxhdGluKys7XG4gIH1cbiAgcmV0dXJuIGxhdGluID49IDIgJiYgY2prQ2hhcnMocykgPT09IDA7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAodjogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGxldCBzID0gU3RyaW5nKHYpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXChbXildKlxcKS9nLCBcIlwiKS50cmltKCk7XG4gIHMgPSBzLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWx1ZSkudHJpbSgpO1xuICByZXR1cm4gcyAhPT0gXCJcIiAmJiBzICE9PSBcIlx1MjAxNFwiICYmIHMgIT09IFwiLVwiICYmIHMgIT09IFwiTi9BXCIgJiYgcyAhPT0gXCJudWxsXCI7XG59XG5cbmNvbnN0IE1FQU5JTkdGVUxfSU5URVJQUyA9IG5ldyBTZXQoW1xuICBcIm5vcm1hbFwiLFxuICBcImFibm9ybWFsXCIsXG4gIFwiaGlnaFwiLFxuICBcImxvd1wiLFxuICBcImNyaXRpY2FsXCIsXG4gIFwicG9zaXRpdmVcIixcbiAgXCJuZWdhdGl2ZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIGRlZHVwZVBhbmVsSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5VmFsdWUgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgayA9IG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAoaXQudmFsdWUpO1xuICAgIGNvbnN0IGdyb3VwID0gYnlWYWx1ZS5nZXQoayk7XG4gICAgaWYgKGdyb3VwKSBncm91cC5wdXNoKGl0KTtcbiAgICBlbHNlIGJ5VmFsdWUuc2V0KGssIFtpdF0pO1xuICB9XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgZ3JvdXAgb2YgYnlWYWx1ZS52YWx1ZXMoKSkge1xuICAgIGlmIChncm91cC5sZW5ndGggPT09IDEpIHtcbiAgICAgIG91dC5wdXNoKGdyb3VwWzBdISk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgY2prSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGNqa0NoYXJzKFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpID49IDIpO1xuICAgIGNvbnN0IGVuSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGlzRW5nbGlzaERvbWluYW50KFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpKTtcbiAgICBpZiAoY2prSXRlbXMubGVuZ3RoID4gMCAmJiBlbkl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIG91dC5wdXNoKGVuSXRlbXNbMF0hKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0LnB1c2goLi4uZ3JvdXApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zOiBhbnlbXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgcmF3IG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFyYXcgfHwgdHlwZW9mIHJhdyAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gICAgaWYgKGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheSwgcmF3LmNvZGUgfHwgXCJcIikpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICAgIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICAgIGNvbnN0IGhhc01lYW5pbmdmdWxJbnRlcnAgPSBNRUFOSU5HRlVMX0lOVEVSUFMuaGFzKGludGVycCk7XG4gICAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgY29udGludWU7XG4gICAgb3V0LnB1c2gocmF3KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBkZWR1cGVDcm9zc0Zvcm1hdChpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3Qgb3JkZXJDb2RlID0gKGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nID0+XG4gICAgKChpdC5vcmRlcl9jb2RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG5cbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgbGV0IGlkeENvdW50ZXIgPSAwO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICBjb25zdCB2ID0gU3RyaW5nKGl0ZW0udmFsdWUgPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHVuaXQgPSAoKGl0ZW0udW5pdCBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgICBpZiAoIXYpIHtcbiAgICAgIGJ5S2V5LnNldChgX19ub19kZWR1cF9ffCR7aWR4Q291bnRlcisrfWAsIGl0ZW0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IFtcbiAgICAgIChpdGVtLmRhdGUgYXMgc3RyaW5nKSA/PyBcIlwiLFxuICAgICAgdi50b0xvd2VyQ2FzZSgpLFxuICAgICAgdW5pdC50b0xvd2VyQ2FzZSgpLFxuICAgICAgb3JkZXJDb2RlKGl0ZW0pLFxuICAgIF0uam9pbihcInxcIik7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBieUtleS5nZXQoa2V5KTtcbiAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvLyBQcmVmZXIgdGhlIHJvdyB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGNsaW5pY2FsIHJlYWRzKS5cbiAgICBsZXQgcHJpbWFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBsZXQgc2Vjb25kYXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIGlmIChjamtDaGFycyhpdGVtLmRpc3BsYXkgPz8gXCJcIikgPCBjamtDaGFycyhleGlzdGluZy5kaXNwbGF5ID8/IFwiXCIpKSB7XG4gICAgICBwcmltYXJ5ID0gaXRlbTtcbiAgICAgIHNlY29uZGFyeSA9IGV4aXN0aW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmltYXJ5ID0gZXhpc3Rpbmc7XG4gICAgICBzZWNvbmRhcnkgPSBpdGVtO1xuICAgIH1cbiAgICBjb25zdCBtZXJnZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgW1wib3JkZXJfY29kZVwiLCBcIm9yZGVyX25hbWVcIiwgXCJob3NwaXRhbFwiLCBcImNvZGVcIl0pIHtcbiAgICAgIGlmICghbWVyZ2VkW2ZdICYmIHNlY29uZGFyeVtmXSkgbWVyZ2VkW2ZdID0gc2Vjb25kYXJ5W2ZdO1xuICAgIH1cbiAgICBieUtleS5zZXQoa2V5LCBtZXJnZWQpO1xuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKGJ5S2V5LnZhbHVlcygpKTtcbn1cblxuaW50ZXJmYWNlIEJwQ29tcG9uZW50IHtcbiAgbG9pbmM6IHN0cmluZztcbiAgZGlzcGxheTogc3RyaW5nO1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0OiBzdHJpbmc7XG4gIGludGVycHJldGF0aW9uX3RleHQ6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gY29tYmluZUJwSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgeyBzeXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT47IGRpYXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT4gfVxuICA+KCk7XG4gIGNvbnN0IHBhc3NUaHJvdWdoOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGRpc3AgPSBTdHJpbmcoaXQuZGlzcGxheSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGtleSA9IGAke2l0LmRhdGUgPz8gXCJcIn18JHtpdC5ob3NwaXRhbCA/PyBcIlwifWA7XG4gICAgaWYgKGRpc3AuaW5jbHVkZXMoXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5zeXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIGlmIChkaXNwLmluY2x1ZGVzKFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpKSB7XG4gICAgICBjb25zdCB2ID0gYnlLZXkuZ2V0KGtleSkgPz8ge307XG4gICAgICB2LmRpYXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhc3NUaHJvdWdoLnB1c2goaXQpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgcGFydHMgb2YgYnlLZXkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBzID0gcGFydHMuc3lzdG9saWM7XG4gICAgY29uc3QgZCA9IHBhcnRzLmRpYXN0b2xpYztcbiAgICBjb25zdCBwcmltYXJ5ID0gcyA/PyBkO1xuICAgIGlmICghcHJpbWFyeSkgY29udGludWU7XG4gICAgY29uc3QgY29tcG9uZW50czogQnBDb21wb25lbnRbXSA9IFtdO1xuICAgIGNvbnN0IHRyeUFkZCA9IChzcmM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQsIGxvaW5jOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFzcmMpIHJldHVybjtcbiAgICAgIGNvbnN0IHZhbCA9IHNyYy52YWx1ZTtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBcIlwiIHx8IHZhbCA9PT0gXCItXCIgfHwgdmFsID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgICBjb25zdCBudW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcodmFsKS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG51bSkpIHJldHVybjtcbiAgICAgIGNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgIGxvaW5jLFxuICAgICAgICBkaXNwbGF5LFxuICAgICAgICB2YWx1ZTogbnVtLFxuICAgICAgICB1bml0OiBzcmMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgaW50ZXJwcmV0YXRpb25fdGV4dDogc3JjLnJlZmVyZW5jZV9yYW5nZSB8fCBcIlwiLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB0cnlBZGQocywgXCI4NDgwLTZcIiwgXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKTtcbiAgICB0cnlBZGQoZCwgXCI4NDYyLTRcIiwgXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBjb25zdCBjb21iaW5lZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4ucHJpbWFyeSB9O1xuICAgIGNvbWJpbmVkLmRpc3BsYXkgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfbmFtZSA9IFwiQmxvb2QgUHJlc3N1cmVcIjtcbiAgICBjb21iaW5lZC5jYXRlZ29yeSA9IFwidml0YWwtc2lnbnNcIjtcbiAgICBjb21iaW5lZC5icF9jb21wb25lbnRzID0gY29tcG9uZW50cztcbiAgICBjb21iaW5lZC5icF9wYW5lbF9sb2luYyA9IFwiODUzNTQtOVwiO1xuICAgIGNvbWJpbmVkLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIGNvbWJpbmVkLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgcGFzc1Rocm91Z2gucHVzaChjb21iaW5lZCk7XG4gIH1cblxuICByZXR1cm4gcGFzc1Rocm91Z2g7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTcGVjaW1lbiBpbmZlcmVuY2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IFNQRUNJTUVOX1JVTEVTOiBSZWFkb25seUFycmF5PFtSZWdFeHAsIHN0cmluZ10+ID0gW1xuICBbL1x1NUMzRnx1cmluZXx1cmluYWx5L2ksIFwiVXJpbmVcIl0sXG4gIFsvXHU3Q0RFfFx1NEZCRlx1NkY1Qlx1ODg0MHxzdG9vbHxmZWNhbHxmYWVjYWx8b2NjdWx0XFxzKmJsb29kL2ksIFwiU3Rvb2xcIl0sXG4gIFsvXHU3NUYwfHNwdXR1bS9pLCBcIlNwdXR1bVwiXSxcbiAgWy9cdTgxNjZcdTgxMEFcdTZEQjJ8Y3NmfGNlcmVicm9zcGluYWwvaSwgXCJDZXJlYnJvc3BpbmFsIGZsdWlkXCJdLFxuICBbL1x1ODBGOFx1NkMzNHxwbGV1cmFsL2ksIFwiUGxldXJhbCBmbHVpZFwiXSxcbiAgWy9cdTgxNzlcdTZDMzR8YXNjaXRlc3xwZXJpdG9uZWFsL2ksIFwiUGVyaXRvbmVhbCBmbHVpZFwiXSxcbiAgWy9cdTk2NzBcdTkwNTN8XHU2MkI5XHU3MjQ3fGNlcnZpY2FsfHBhcFxccypzbWVhcnx2YWdpbmFsL2ksIFwiQ2VydmljYWwvVmFnaW5hbFwiXSxcbiAgWy9cdTk1RENcdTdCQzBcdTZEQjJ8c3lub3ZpYWx8am9pbnRcXHMqZmx1aWQvaSwgXCJTeW5vdmlhbCBmbHVpZFwiXSxcbiAgWy9cdTdGOEFcdTZDMzR8YW1uaW90aWMvaSwgXCJBbW5pb3RpYyBmbHVpZFwiXSxcbiAgWy9cdTlBQThcdTlBRDN8Ym9uZVxccyptYXJyb3cvaSwgXCJCb25lIG1hcnJvd1wiXSxcbl07XG5cbmZ1bmN0aW9uIGluZmVyU3BlY2ltZW4oLi4uaGludHM6IEFycmF5PHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ+KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGJsb2IgPSBoaW50c1xuICAgIC5maWx0ZXIoKGgpOiBoIGlzIHN0cmluZyA9PiBCb29sZWFuKGgpKVxuICAgIC5qb2luKFwiIFwiKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIWJsb2IpIHJldHVybiBudWxsO1xuICBmb3IgKGNvbnN0IFtwYXR0ZXJuLCBsYWJlbF0gb2YgU1BFQ0lNRU5fUlVMRVMpIHtcbiAgICBpZiAocGF0dGVybi50ZXN0KGJsb2IpKSByZXR1cm4gbGFiZWw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNYXAgc2luZ2xlIE9ic2VydmF0aW9uIChub24tZ3JvdXBlZCBwYXRoKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIGNvZGUpKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICBpZiAoIWhhc1ZhbHVlICYmICFoYXNNZWFuaW5nZnVsSW50ZXJwKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSwgcmF3LmRhdGUgPz8gXCJcIik7XG4gIGNvbnN0IGxvaW5jID0gZmluZExvaW5jKGNvZGUsIGRpc3BsYXkpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IFwibGFib3JhdG9yeVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCByciA9IHBhcnNlUmFuZ2UoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnIpIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gW3JyXTtcbiAgfVxuXG4gIGNvbnN0IGludGVycENvZGluZ1Jlc3VsdCA9XG4gICAgbWFwSW50ZXJwcmV0YXRpb24oaW50ZXJwKSB8fFxuICAgIGRlcml2ZUludGVycHJldGF0aW9uKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCA/IFN0cmluZyh2YWx1ZSkgOiBcIlwiLFxuICAgICAgcmVzb3VyY2UudmFsdWVRdWFudGl0eSBhcyBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgICAgIChyZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSBhcyBSYW5nZUVudHJ5W10gfCB1bmRlZmluZWQpPy5bMF0sXG4gICAgKTtcbiAgaWYgKGludGVycENvZGluZ1Jlc3VsdCkge1xuICAgIHJlc291cmNlLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbaW50ZXJwQ29kaW5nUmVzdWx0XSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJ1aWxkIG9ic2VydmF0aW9uIHdpdGhpbiBhIHBhbmVsICh3aXRoIGNhbm9uaWNhbCBsYWIga2V5IGlkKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gYnVpbGRPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbiAgcGFuZWxDb2RlOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIC8vIEJQIHBhbmVsOiBwcmVidWlsdCBieSBjb21iaW5lQnBJdGVtcy5cbiAgaWYgKHJhdy5icF9jb21wb25lbnRzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJvYnNcIiwgXCJCUF9QQU5FTFwiLCBkYXRlLCBob3NwaXRhbCk7XG4gICAgY29uc3QgY29tcG9uZW50UmVzb3VyY2VzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYyBvZiByYXcuYnBfY29tcG9uZW50cyBhcyBCcENvbXBvbmVudFtdKSB7XG4gICAgICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgICAgICB2YWx1ZTogYy52YWx1ZSxcbiAgICAgICAgdW5pdDogYy51bml0IHx8IFwibW1IZ1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiB0b1VjdW0oYy51bml0KSA/PyBcIm1tW0hnXVwiLFxuICAgICAgfTtcbiAgICAgIGNvbXBvbmVudFJlc291cmNlcy5wdXNoKHtcbiAgICAgICAgY29kZToge1xuICAgICAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIiwgY29kZTogYy5sb2luYywgZGlzcGxheTogYy5kaXNwbGF5IH1dLFxuICAgICAgICAgIHRleHQ6IGMuZGlzcGxheSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWVRdWFudGl0eTogcXR5LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGJwT2JzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgICBpZDogb2JzSWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgY29kZTogXCJ2aXRhbC1zaWduc1wiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgICAgICAgY29kZTogcmF3LmJwX3BhbmVsX2xvaW5jID8/IFwiODUzNTQtOVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IFwiQmxvb2QgUHJlc3N1cmVcIixcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgY29tcG9uZW50OiBjb21wb25lbnRSZXNvdXJjZXMsXG4gICAgfTtcbiAgICBpZiAoZGF0ZSkgYnBPYnMuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtkYXRlfVQwMDowMDowMCswODowMGA7XG4gICAgaWYgKGhvc3BpdGFsKSBicE9icy5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgICByZXR1cm4gYnBPYnM7XG4gIH1cblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IChwYW5lbENvZGUgPyBTdHJpbmcocGFuZWxDb2RlKSA6IFwiXCIpIHx8IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCBjYW5vbmljYWwgPSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgfHwgZGlzcGxheTtcbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIGNhbm9uaWNhbCwgcmF3LmRhdGUgPz8gXCJcIiwgcmF3Lmhvc3BpdGFsID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCBjYXRDb2RlID0gcmF3LmNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiO1xuICBjb25zdCBDQVRfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBsYWJvcmF0b3J5OiBcIkxhYm9yYXRvcnlcIixcbiAgICBcInZpdGFsLXNpZ25zXCI6IFwiVml0YWwgU2lnbnNcIixcbiAgICBpbWFnaW5nOiBcIkltYWdpbmdcIixcbiAgICBwcm9jZWR1cmU6IFwiUHJvY2VkdXJlXCIsXG4gICAgXCJzb2NpYWwtaGlzdG9yeVwiOiBcIlNvY2lhbCBIaXN0b3J5XCIsXG4gICAgc3VydmV5OiBcIlN1cnZleVwiLFxuICAgIGV4YW06IFwiRXhhbVwiLFxuICAgIHRoZXJhcHk6IFwiVGhlcmFweVwiLFxuICAgIGFjdGl2aXR5OiBcIkFjdGl2aXR5XCIsXG4gIH07XG4gIGNvbnN0IGNhdERpc3BsYXkgPVxuICAgIENBVF9ESVNQTEFZW2NhdENvZGVdID8/IGNhdENvZGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYXRDb2RlLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgaWQ6IG9ic0lkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICBjYXRlZ29yeTogW1xuICAgICAge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogY2F0Q29kZSxcbiAgICAgICAgICAgIGRpc3BsYXk6IGNhdERpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuaG9zcGl0YWwpIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IHJhdy5ob3NwaXRhbCB9XTtcbiAgY29uc3Qgc3BlY2ltZW4gPSBpbmZlclNwZWNpbWVuKHJhdy5vcmRlcl9uYW1lLCByYXcuZGlzcGxheSwgcmF3LmNvZGUpO1xuICBpZiAoc3BlY2ltZW4pIHJlc291cmNlLnNwZWNpbWVuID0geyBkaXNwbGF5OiBzcGVjaW1lbiB9O1xuXG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBpZiAoaGFzVmFsdWUpIHtcbiAgICBjb25zdCBxdHkgPSB0cnlQYXJzZVF1YW50aXR5KFN0cmluZyh2YWx1ZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChxdHkpIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgPSBxdHk7XG4gICAgZWxzZSByZXNvdXJjZS52YWx1ZVN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBpZiAocmF3LnJlZmVyZW5jZV9yYW5nZSkge1xuICAgIGNvbnN0IHJycyA9IHBhcnNlUmFuZ2VNdWx0aShTdHJpbmcocmF3LnJlZmVyZW5jZV9yYW5nZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChycnMubGVuZ3RoID4gMCkgcmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgPSBycnM7XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBHcm91cCBieSAob3JkZXJfY29kZSwgZGF0ZSwgaG9zcGl0YWwpIFx1MjE5MiBEUiArIE9ic2VydmF0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZ3JvdXBCeU9yZGVyQ29kZShcbiAgY2xlYW5lZDogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGxldCB3b3JraW5nID0gZGVkdXBlQ3Jvc3NGb3JtYXQoY2xlYW5lZCk7XG4gIHdvcmtpbmcgPSBjb21iaW5lQnBJdGVtcyh3b3JraW5nKTtcblxuICBjb25zdCBncm91cHMgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBjb25zdCBrZXlNZXRhID0gbmV3IE1hcDxzdHJpbmcsIHsgZ3JvdXBLZXlDb2RlOiBzdHJpbmc7IGRhdGU6IHN0cmluZzsgaG9zcGl0YWw6IHN0cmluZyB9PigpO1xuICBmb3IgKGNvbnN0IHJhdyBvZiB3b3JraW5nKSB7XG4gICAgY29uc3QgZ3JvdXBLZXlDb2RlID0gcmF3Lm9yZGVyX2NvZGUgfHwgcmF3LmNvZGUgfHwgcmF3LmRpc3BsYXkgfHwgXCJcIjtcbiAgICBjb25zdCBkYXRlID0gcmF3LmRhdGUgPz8gXCJcIjtcbiAgICBjb25zdCBob3NwaXRhbCA9IHJhdy5ob3NwaXRhbCA/PyBcIlwiO1xuICAgIGNvbnN0IGtleSA9IGAke2dyb3VwS2V5Q29kZX18JHtkYXRlfXwke2hvc3BpdGFsfWA7XG4gICAgY29uc3QgYXJyID0gZ3JvdXBzLmdldChrZXkpO1xuICAgIGlmIChhcnIpIGFyci5wdXNoKHJhdyk7XG4gICAgZWxzZSB7XG4gICAgICBncm91cHMuc2V0KGtleSwgW3Jhd10pO1xuICAgICAga2V5TWV0YS5zZXQoa2V5LCB7IGdyb3VwS2V5Q29kZTogU3RyaW5nKGdyb3VwS2V5Q29kZSksIGRhdGUsIGhvc3BpdGFsIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgW2tleSwgaXRlbXNdIG9mIGdyb3Vwcy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBtZXRhID0ga2V5TWV0YS5nZXQoa2V5KSE7XG4gICAgY29uc3QgZGVkdXBlZCA9IGRlZHVwZVBhbmVsSXRlbXMoaXRlbXMpO1xuXG4gICAgY29uc3Qgb2JzUmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgICBjb25zdCBzZWVuT2JzSWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBpdCBvZiBkZWR1cGVkKSB7XG4gICAgICBjb25zdCBvYnMgPSBidWlsZE9ic2VydmF0aW9uKGl0LCBwYXRpZW50SWQsIG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICAgIGlmICghb2JzKSBjb250aW51ZTtcbiAgICAgIGlmIChzZWVuT2JzSWRzLmhhcyhvYnMuaWQpKSBjb250aW51ZTtcbiAgICAgIHNlZW5PYnNJZHMuYWRkKG9icy5pZCk7XG4gICAgICBvYnNSZXNvdXJjZXMucHVzaChvYnMpO1xuICAgIH1cbiAgICBpZiAob2JzUmVzb3VyY2VzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG5cbiAgICAvLyBCUCBwYW5lbDogZW1pdCBPYnNlcnZhdGlvbiBkaXJlY3RseSAobm8gRFIgd3JhcHBlcikuXG4gICAgY29uc3QgaXNCcFBhbmVsID0gZGVkdXBlZC5ldmVyeSgoaXQpID0+IGl0LmJwX2NvbXBvbmVudHMgfHwgaXQuZGlzcGxheSA9PT0gXCJCbG9vZCBQcmVzc3VyZVwiKTtcbiAgICBpZiAoaXNCcFBhbmVsKSB7XG4gICAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JkZXJOYW1lID0gZGVkdXBlZC5maW5kKChpdCkgPT4gaXQub3JkZXJfbmFtZSk/Lm9yZGVyX25hbWUgPz8gbnVsbDtcbiAgICBjb25zdCBtZW1iZXJLZXlzID0gQXJyYXkuZnJvbShcbiAgICAgIG5ldyBTZXQoZGVkdXBlZC5maWx0ZXIoKGl0KSA9PiBpdC5kaXNwbGF5KS5tYXAoKGl0KSA9PiBjYW5vbmljYWxMYWJLZXkoaXQuZGlzcGxheSkpKSxcbiAgICApLnNvcnQoKTtcbiAgICBjb25zdCBwYW5lbFNpZ25hdHVyZSA9IG1lbWJlcktleXMuam9pbihcIixcIikgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICBjb25zdCBkcklkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIkRSXCIsIHBhbmVsU2lnbmF0dXJlLCBtZXRhLmRhdGUsIG1ldGEuaG9zcGl0YWwpO1xuXG4gICAgbGV0IHBhbmVsVGl0bGU6IHN0cmluZztcbiAgICBpZiAoZGVkdXBlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHNpbmdsZURpc3BsYXkgPSBkZWR1cGVkWzBdIS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBwYW5lbFRpdGxlID0gc2luZ2xlRGlzcGxheSB8fCBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWxUaXRsZSA9IG9yZGVyTmFtZSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGRyQ29kZVN5c3RlbSA9IE5ISV9MQUJfQ09ERV9SRS50ZXN0KFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgPz8gXCJcIilcbiAgICAgID8gc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX0xBQl9DT0RFO1xuXG4gICAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICByZXNvdXJjZVR5cGU6IFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICAgICAgaWQ6IGRySWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjItMDA3NFwiLFxuICAgICAgICAgICAgICBjb2RlOiBcIkxBQlwiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIkxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjb2RlOiB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogZHJDb2RlU3lzdGVtLFxuICAgICAgICAgICAgY29kZTogU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKSB8fCBcIlVOS05PV05cIixcbiAgICAgICAgICAgIGRpc3BsYXk6IHBhbmVsVGl0bGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogcGFuZWxUaXRsZSxcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgcmVzdWx0OiBvYnNSZXNvdXJjZXMubWFwKChvKSA9PiAoeyByZWZlcmVuY2U6IGBPYnNlcnZhdGlvbi8ke28uaWR9YCB9KSksXG4gICAgfTtcbiAgICBpZiAobWV0YS5kYXRlKSBkci5lZmZlY3RpdmVEYXRlVGltZSA9IGAke21ldGEuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChtZXRhLmhvc3BpdGFsKSBkci5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBtZXRhLmhvc3BpdGFsIH1dO1xuXG4gICAgb3V0LnB1c2goZHIpO1xuICAgIG91dC5wdXNoKC4uLm9ic1Jlc291cmNlcyk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgY2xlYW5lZCA9IGZpbHRlckxhYlJvd3MocmF3SXRlbXMpO1xuICByZXR1cm4gZ3JvdXBCeU9yZGVyQ29kZShjbGVhbmVkLCBwYXRpZW50SWQpO1xufVxuIiwgIi8qKlxuICogUHJvY2VkdXJlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcHJvY2VkdXJlLnB5YC4gUmV0dXJucyBudWxsIGZvciBsaXN0LXBhZ2VcbiAqIHJvd3MgbGFja2luZyBub3RlL2JvZHlfc2l0ZSBcdTIwMTQgdGhlIGFsdGVybmF0aXZlIGlzIHRoZSBTTUFSVCBhcHAgc2hvd2luZ1xuICogMjUgXCJwcm9jZWR1cmVzXCIgY2FsbGVkIFwiTXljb2JhY3RlcmlhIGN1bHR1cmVcIiAvIFwiVmFnaW5hbCB1bHRyYXNvdW5kXCJcbiAqIC8gZXRjLiB3aGljaCBhcmUgY2xpbmljYWxseSB3cm9uZy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwiaWNkXCIpKSByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfUENTO1xuICByZXR1cm4gc3lzdGVtcy5ISVNfTE9DQUxfUFJPQ0VEVVJFX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQcm9jZWR1cmUoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IG5vdGUgPSAoKHJhdy5ub3RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICBjb25zdCBib2R5U2l0ZSA9ICgocmF3LmJvZHlfc2l0ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFub3RlICYmICFib2R5U2l0ZSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBQcm9jZWR1cmVcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiUHJvY2VkdXJlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcuZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiByYXcuc3RhdHVzID8/IFwiY29tcGxldGVkXCIsXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lZERhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAoYm9keVNpdGUpIHtcbiAgICByZXNvdXJjZS5ib2R5U2l0ZSA9IFt7IHRleHQ6IGJvZHlTaXRlIH1dO1xuICB9XG4gIGlmIChub3RlKSB7XG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IG5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIG1hcHBlciBkaXNwYXRjaCB0YWJsZXMuXG4gKlxuICogQ29uc3VtZWQgYnkgYmFja2VuZCdzIGAvc3luYy91cGxvYWQtc3RydWN0dXJlZGAgYW5kIHRoZSBleHRlbnNpb24nc1xuICogbG9jYWwtbW9kZSBidW5kbGUgYXNzZW1ibGVyIHNvIGJvdGggcHJvZHVjZSBpZGVudGljYWwgRkhJUiBvdXRwdXQuXG4gKi9cblxuaW1wb3J0IHsgbWFwQWxsZXJneUludG9sZXJhbmNlIH0gZnJvbSBcIi4vYWxsZXJneVwiO1xuaW1wb3J0IHsgbWFwQ29uZGl0aW9uIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBtYXBEaWFnbm9zdGljUmVwb3J0IH0gZnJvbSBcIi4vZGlhZ25vc3RpYy1yZXBvcnRcIjtcbmltcG9ydCB7IG1hcEVuY291bnRlciB9IGZyb20gXCIuL2VuY291bnRlclwiO1xuaW1wb3J0IHsgbWFwTWVkaWNhdGlvblJlcXVlc3QsIG1hcE1lZGljYXRpb25zRGVkdXAgfSBmcm9tIFwiLi9tZWRpY2F0aW9uXCI7XG5pbXBvcnQgeyBtYXBPYnNlcnZhdGlvbiwgbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCB9IGZyb20gXCIuL29ic2VydmF0aW9uXCI7XG5pbXBvcnQgeyBtYXBQcm9jZWR1cmUgfSBmcm9tIFwiLi9wcm9jZWR1cmVcIjtcblxuZXhwb3J0IHR5cGUgUGVyUm93TWFwcGVyID0gKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKSA9PiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbDtcblxuZXhwb3J0IHR5cGUgR3JvdXBNYXBwZXIgPSAoaXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZykgPT4gUmVjb3JkPHN0cmluZywgYW55PltdO1xuXG4vKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgKHBlci1yb3cgbWFwcGVyLCBKU09OIGxpc3Qga2V5IGluc2lkZSBMTE0gcmVzcG9uc2UpLlxuICogVXNlZCBieSB0aGUgTExNIGZhbGxiYWNrIHBhdGggYWZ0ZXIgZXh0cmFjdGlvbjsgdGhlIHN0cnVjdHVyZWQgcGF0aFxuICogYWxzbyBjb25zdWx0cyBpdCBmb3IgcGVyLXJvdyByZXNvdXJjZSB0eXBlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IExJU1RfSEFORExFUlM6IFJlY29yZDxzdHJpbmcsIFtQZXJSb3dNYXBwZXIsIHN0cmluZ10+ID0ge1xuICBvYnNlcnZhdGlvbnM6IFttYXBPYnNlcnZhdGlvbiwgXCJvYnNlcnZhdGlvbnNcIl0sXG4gIG1lZGljYXRpb25zOiBbbWFwTWVkaWNhdGlvblJlcXVlc3QsIFwibWVkaWNhdGlvbnNcIl0sXG4gIGNvbmRpdGlvbnM6IFttYXBDb25kaXRpb24sIFwiY29uZGl0aW9uc1wiXSxcbiAgYWxsZXJnaWVzOiBbbWFwQWxsZXJneUludG9sZXJhbmNlLCBcImFsbGVyZ2llc1wiXSxcbiAgZGlhZ25vc3RpY19yZXBvcnRzOiBbbWFwRGlhZ25vc3RpY1JlcG9ydCwgXCJkaWFnbm9zdGljX3JlcG9ydHNcIl0sXG4gIHByb2NlZHVyZXM6IFttYXBQcm9jZWR1cmUsIFwicHJvY2VkdXJlc1wiXSxcbiAgZW5jb3VudGVyczogW21hcEVuY291bnRlciwgXCJlbmNvdW50ZXJzXCJdLFxufTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIGdyb3VwLWF3YXJlIG1hcHBlciB0aGF0IHRha2VzIHRoZSBGVUxMIGxpc3QgYXQgb25jZS5cbiAqIFVzZWQgd2hlbiBjcm9zcy1yb3cgZ3JvdXBpbmcvZGVkdXAgaXMgcmVxdWlyZWQgKE5ISSBsYWIgcGFuZWxzLFxuICogXHU0RTJEXHU4MkYxIG1lZGljYXRpb24gXHU5NkQ5XHU4QTlFIGRlZHVwKS5cbiAqL1xuZXhwb3J0IGNvbnN0IEdST1VQX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBHcm91cE1hcHBlcj4gPSB7XG4gIG9ic2VydmF0aW9uczogbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCxcbiAgbWVkaWNhdGlvbnM6IG1hcE1lZGljYXRpb25zRGVkdXAsXG59O1xuIiwgIi8qKlxuICogRW5jb3VudGVyIGxpbmtlciBcdTIwMTQgbWF0Y2ggcmVzb3VyY2VzIHRvIEVuY291bnRlcnMgYnkgKGhvc3BpdGFsLCBkYXRlKS5cbiAqXG4gKiBQdXJlIGZ1bmN0aW9uOiBtdXRhdGVzIGByZXNvdXJjZXNgIGluIHBsYWNlIHRvIGFkZCBgZW5jb3VudGVyYFxuICogcmVmZXJlbmNlcyB3aGVuIHRoZXJlJ3MgYW4gdW5hbWJpZ3VvdXMgbWF0Y2ggaW4gdGhlIGNhbmRpZGF0ZVxuICogRW5jb3VudGVyIGxpc3QuIFNhbWUgbG9naWMgYXMgdGhlIGJhY2tlbmQncyBEQi1jb3VwbGVkIHZlcnNpb24sXG4gKiBsaWZ0ZWQgb3V0IHNvIHRoZSBleHRlbnNpb24ncyBsb2NhbCBtb2RlIGNhbiBjYWxsIGl0IG9uIGFuXG4gKiBpbi1tZW1vcnkgYXJyYXkuXG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlSW50ZXJwcmV0YXRpb24gfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuXG5jb25zdCBFTkNPVU5URVJfTElOS0FCTEUgPSBuZXcgU2V0KFtcbiAgXCJPYnNlcnZhdGlvblwiLFxuICBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gIFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICBcIlByb2NlZHVyZVwiLFxuICBcIkNvbmRpdGlvblwiLFxuICBcIkFsbGVyZ3lJbnRvbGVyYW5jZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIHJlc291cmNlRGF0ZShyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgW1xuICAgIFwiZWZmZWN0aXZlRGF0ZVRpbWVcIixcbiAgICBcImF1dGhvcmVkT25cIixcbiAgICBcInBlcmZvcm1lZERhdGVUaW1lXCIsXG4gICAgXCJvbnNldERhdGVUaW1lXCIsXG4gICAgXCJyZWNvcmRlZERhdGVcIixcbiAgICBcImlzc3VlZFwiLFxuICBdKSB7XG4gICAgY29uc3QgdiA9IHJba2V5XTtcbiAgICBpZiAodikgcmV0dXJuIFN0cmluZyh2KS5zbGljZSgwLCAxMCk7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgb2YgW1wiZWZmZWN0aXZlUGVyaW9kXCIsIFwicGVyZm9ybWVkUGVyaW9kXCJdKSB7XG4gICAgY29uc3QgcGVyaW9kID0gcltrZXldO1xuICAgIGlmIChwZXJpb2QgJiYgdHlwZW9mIHBlcmlvZCA9PT0gXCJvYmplY3RcIiAmJiBwZXJpb2Quc3RhcnQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcocGVyaW9kLnN0YXJ0KS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5mdW5jdGlvbiByZXNvdXJjZUhvc3BpdGFsKHI6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBmb3IgKGNvbnN0IHAgb2Ygci5wZXJmb3JtZXIgPz8gW10pIHtcbiAgICBjb25zdCBkID0gKHAgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBpZiAoZCkgcmV0dXJuIGQ7XG4gIH1cbiAgY29uc3QgcmVxID0gci5yZXF1ZXN0ZXIgPz8ge307XG4gIGlmIChyZXEgJiYgdHlwZW9mIHJlcSA9PT0gXCJvYmplY3RcIiAmJiByZXEuZGlzcGxheSkgcmV0dXJuIHJlcS5kaXNwbGF5O1xuICByZXR1cm4gXCJcIjtcbn1cblxuLyoqXG4gKiBEcm9wIEFNQiBFbmNvdW50ZXJzIHdob3NlIChob3NwaXRhbCwgc3RhcnRfZGF0ZSkgaXMgYWxyZWFkeSBjb3ZlcmVkXG4gKiBieSBhbiBJTVAgRW5jb3VudGVyJ3MgYWRtaXNzaW9uIGRheS4gTkhJIGVtaXRzIHRoZSBzYW1lIGlucGF0aWVudFxuICogc3RheSB0d2ljZSAoSUhLRTMzMDMgQU1CIGJpbGxpbmcgZW50cnkgKyBJSEtFMzMwOSBJTVAgZGV0YWlsKTsgdGhlXG4gKiBJTVAgb25lIGlzIGNhbm9uaWNhbCwgdGhlIEFNQiBpcyBhIGJpbGxpbmcgYXJ0ZWZhY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cEFkbWlzc2lvbkRheUFtYihcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBpbXBTdGFydHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgaWYgKChyLmNsYXNzID8/IHt9KS5jb2RlICE9PSBcIklNUFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKHIucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgaWYgKGhvc3AgJiYgc3RhcnQpIGltcFN0YXJ0cy5hZGQoYCR7aG9zcH0gJHtzdGFydH1gKTtcbiAgfVxuICBpZiAoaW1wU3RhcnRzLnNpemUgPT09IDApIHJldHVybiByZXNvdXJjZXM7XG4gIHJldHVybiByZXNvdXJjZXMuZmlsdGVyKChyKSA9PiB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlID09PSBcIkVuY291bnRlclwiICYmIChyLmNsYXNzID8/IHt9KS5jb2RlID09PSBcIkFNQlwiKSB7XG4gICAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICAgIGlmIChpbXBTdGFydHMuaGFzKGAke2hvc3B9ICR7c3RhcnR9YCkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFkZCBgZW5jb3VudGVyYCByZWZlcmVuY2UgdG8gZWFjaCBsaW5rYWJsZSByZXNvdXJjZSB3aGVuIGl0c1xuICogKGhvc3BpdGFsLCBkYXRlKSBtYXRjaGVzIGV4YWN0bHkgT05FIEVuY291bnRlciBpbiBgY2FuZGlkYXRlc2AuXG4gKiBDb25zZXJ2YXRpdmUgXHUyMDE0IGxlYXZlcyBhbWJpZ3VvdXMgKDAgb3IgPjEgbWF0Y2gpIGNhc2VzIHVubGlua2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlua0VuY291bnRlcnNJblJlc291cmNlcyhcbiAgY2FuZGlkYXRlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoY2FuZGlkYXRlcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgY29uc3QgZXhhY3RJbmRleCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgY29uc3QgaW1wQnlIb3NwID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4+KCk7XG5cbiAgZm9yIChjb25zdCBlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICBpZiAoZS5yZXNvdXJjZVR5cGUgIT09IFwiRW5jb3VudGVyXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoZS5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoIWhvc3AgfHwgIXN0YXJ0KSBjb250aW51ZTtcbiAgICBjb25zdCBrZXkgPSBgJHtob3NwfSAke3N0YXJ0fWA7XG4gICAgY29uc3QgYXJyID0gZXhhY3RJbmRleC5nZXQoa2V5KSA/PyBbXTtcbiAgICBhcnIucHVzaChlLmlkKTtcbiAgICBleGFjdEluZGV4LnNldChrZXksIGFycik7XG4gICAgY29uc3QgY2xzID0gKGUuY2xhc3MgPz8ge30pLmNvZGUgPz8gXCJcIjtcbiAgICBpZiAoY2xzID09PSBcIklNUFwiKSB7XG4gICAgICBjb25zdCBlbmQgPSBTdHJpbmcoKGUucGVyaW9kID8/IHt9KS5lbmQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGVuZCkge1xuICAgICAgICBjb25zdCBsaXN0ID0gaW1wQnlIb3NwLmdldChob3NwKSA/PyBbXTtcbiAgICAgICAgbGlzdC5wdXNoKFtzdGFydCwgZW5kLCBlLmlkXSk7XG4gICAgICAgIGltcEJ5SG9zcC5zZXQoaG9zcCwgbGlzdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGV4YWN0SW5kZXguc2l6ZSA9PT0gMCAmJiBpbXBCeUhvc3Auc2l6ZSA9PT0gMCkgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoIUVOQ09VTlRFUl9MSU5LQUJMRS5oYXMoci5yZXNvdXJjZVR5cGUpKSBjb250aW51ZTtcbiAgICBpZiAoci5lbmNvdW50ZXIgfHwgci5jb250ZXh0KSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gcmVzb3VyY2VIb3NwaXRhbChyKTtcbiAgICBjb25zdCBkYXRlID0gcmVzb3VyY2VEYXRlKHIpO1xuICAgIGlmICghaG9zcCB8fCAhZGF0ZSkgY29udGludWU7XG4gICAgY29uc3QgbWF0Y2hlczogc3RyaW5nW10gPSBbLi4uKGV4YWN0SW5kZXguZ2V0KGAke2hvc3B9ICR7ZGF0ZX1gKSA/PyBbXSldO1xuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChjb25zdCBbc3RhcnQsIGVuZCwgZWlkXSBvZiBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdKSB7XG4gICAgICAgIGlmIChzdGFydCA8PSBkYXRlICYmIGRhdGUgPD0gZW5kKSBtYXRjaGVzLnB1c2goZWlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoICE9PSAxKSBjb250aW51ZTtcbiAgICByLmVuY291bnRlciA9IHsgcmVmZXJlbmNlOiBgRW5jb3VudGVyLyR7bWF0Y2hlc1swXX1gIH07XG4gIH1cbn1cblxuLyoqXG4gKiBXaGVuIGFuIE9ic2VydmF0aW9uIGNhcnJpZXMgbXVsdGlwbGUgcmVmZXJlbmNlUmFuZ2UgZW50cmllcyB0YWdnZWRcbiAqIHdpdGggYGFwcGxpZXNUb1sqXS5jb2RpbmcuY29kZWAgaW4ge21hbGUsIGZlbWFsZX0sIHBpY2sgdGhlIG9uZSB0aGF0XG4gKiBtYXRjaGVzIHRoZSBwYXRpZW50J3MgZ2VuZGVyIGFuZCByZS1kZXJpdmUgaW50ZXJwcmV0YXRpb24gYWdhaW5zdCBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzKFxuICBwYXRpZW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCxcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiB2b2lkIHtcbiAgaWYgKCFwYXRpZW50KSByZXR1cm47XG4gIGNvbnN0IGdlbmRlciA9IFN0cmluZyhwYXRpZW50LmdlbmRlciA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoZ2VuZGVyICE9PSBcIm1hbGVcIiAmJiBnZW5kZXIgIT09IFwiZmVtYWxlXCIpIHJldHVybjtcblxuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIk9ic2VydmF0aW9uXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHJyczogYW55W10gPSByLnJlZmVyZW5jZVJhbmdlID8/IFtdO1xuICAgIGlmIChycnMubGVuZ3RoIDwgMikgY29udGludWU7XG5cbiAgICBsZXQgbWF0Y2g6IGFueSA9IG51bGw7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBycnMpIHtcbiAgICAgIGZvciAoY29uc3QgYXAgb2YgZW50cnkuYXBwbGllc1RvID8/IFtdKSB7XG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBhcC5jb2RpbmcgPz8gW10pIHtcbiAgICAgICAgICBpZiAoU3RyaW5nKGMuY29kZSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpID09PSBnZW5kZXIpIHtcbiAgICAgICAgICAgIG1hdGNoID0gZW50cnk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaCkgYnJlYWs7XG4gICAgfVxuICAgIGlmICghbWF0Y2gpIGNvbnRpbnVlO1xuXG4gICAgci5yZWZlcmVuY2VSYW5nZSA9IFttYXRjaF07XG4gICAgY29uc3QgdmFsU3RyID1cbiAgICAgIFN0cmluZygoci52YWx1ZVF1YW50aXR5ID8/IHt9KS52YWx1ZSA/PyBcIlwiKSB8fCBTdHJpbmcoci52YWx1ZVN0cmluZyA/PyBcIlwiKTtcbiAgICBjb25zdCBuZXdJbnRlcnAgPSBkZXJpdmVJbnRlcnByZXRhdGlvbih2YWxTdHIsIHIudmFsdWVRdWFudGl0eSA/PyBudWxsLCBtYXRjaCk7XG4gICAgaWYgKG5ld0ludGVycCkge1xuICAgICAgci5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW25ld0ludGVycF0gfV07XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBQYXRpZW50IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcGF0aWVudC5weWAuIFNhbWUgcHVibGljIEFQSTpcbiAqICAgLSBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWUpIFx1MjAxNCBleHBvc2VkIGZvciB0ZXN0c1xuICogICAtIG1hcFBhdGllbnQocmF3KSBcdTIwMTQgbWFpbiBlbnRyeVxuICovXG5cbmltcG9ydCB7IGRlcml2ZVBhdGllbnRJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuXG4vLyBUYWl3YW4gbmF0aW9uYWwgSUQ6IDEgbGV0dGVyICsgOSBkaWdpdHMgKEExMjM0NTY3ODkpLiBVc2VkIHRvIGRlY2lkZVxuLy8gd2hldGhlciB0aGUgcG9wdXAtc3VwcGxpZWQgcGF0aWVudF9pZCBzaG91bGQgYmUgY29kZWQgdW5kZXIgdGhlXG4vLyBjYW5vbmljYWwgbmF0aW9uYWwtaWQgc3lzdGVtIG9yIGFzIGEgbG9jYWwgaG9zcGl0YWwgTVJOLlxuY29uc3QgVFdfTkFUSU9OQUxfSURfUkUgPSAvXltBLVpdWzEyXVxcZHs4fSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9va3NMaWtlVHdOYXRpb25hbElkKHZhbHVlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gIGlmICghdmFsdWUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIFRXX05BVElPTkFMX0lEX1JFLnRlc3QodmFsdWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUGF0aWVudChyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgcmF3SWQgPSBTdHJpbmcocmF3LmlkZW50aWZpZXIgPz8gcmF3LmlkID8/IFwidW5rbm93blwiKTtcbiAgLy8gRkhJUiBQYXRpZW50LmlkIGlzIHRoZSBoYXNoZWQvc2FsdGVkIGZvcm0uIFJlYWwgbmF0aW9uYWwgSUQgc3RheXNcbiAgLy8gb25seSBpbiBpZGVudGlmaWVyW10udmFsdWUgc28gYSBsZWFrZWQgQnVuZGxlIChvciBhIFNNQVJUIGFwcCB0b2tlblxuICAvLyBwYXlsb2FkIGNvbnRhaW5pbmcgcGF0aWVudF9pZCkgZG9lc24ndCBkaXNjbG9zZSBpdCB2aWEgZXZlcnlcbiAgLy8gc3ViamVjdC5yZWZlcmVuY2UuXG4gIGNvbnN0IHBhdGllbnRJZCA9IGRlcml2ZVBhdGllbnRJZChyYXdJZCk7XG5cbiAgLy8gVXNlIGA/P2AgKG5vdCBqdXN0IGRlZmF1bHQgYXJnKSBzbyBleHBsaWNpdCBudWxsIGZyb20gdGhlIExMTSBhbHNvXG4gIC8vIGZhbGxzIGJhY2suIExvY2FsIG1vZGVscyBzb21ldGltZXMgZW1pdCBudWxsIGluc3RlYWQgb2Ygb21pdHRpbmcuXG4gIC8vIFRoZSBjYWxsZXIgZGVjaWRlcyB3aGV0aGVyIGByYXcubmFtZWAgaXMgdGhlIHVzZXIncyByZWFsIG5hbWUgb3JcbiAgLy8gYWxyZWFkeS1tYXNrZWQgXHUyMDE0IG1hcFBhdGllbnQganVzdCB0cmFuc2NyaWJlcy4gTWFza2luZyBwb2xpY3kgbGl2ZXNcbiAgLy8gYXQgdGhlIFVJIC8gZXh0ZW5zaW9uIGxheWVyIChkcml2ZW4gYnkgdGhlIHVzZXItdG9nZ2xlYWJsZVxuICAvLyBgbWFza05hbWVFbmFibGVkYCBzZXR0aW5nKSBzbyB0aGUgc2FtZSBtYXBwZXIgaXMgY29ycmVjdCBmb3IgYm90aFxuICAvLyBcIlx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOCA9IHJlYWwgbmFtZVwiIGFuZCBcIlx1OTFBQlx1NzY0Mlx1NEVCQVx1NTRFMVx1NTkxQVx1NzVDNVx1NEVCQSA9IG1hc2tlZFwiIHdvcmtmbG93cy5cbiAgY29uc3QgbmFtZVRleHQgPSAocmF3Lm5hbWUgPz8gbnVsbCkgfHwgXCJVbmtub3duXCI7XG4gIGNvbnN0IHBob25lID0gKHJhdy5waG9uZSA/PyBudWxsKSB8fCBcIlwiO1xuICBjb25zdCBhZGRyZXNzID0gKHJhdy5hZGRyZXNzID8/IG51bGwpIHx8IFwiXCI7XG5cbiAgY29uc3QgW2ZhbWlseSwgZ2l2ZW5dID0gc3BsaXROYW1lKG5hbWVUZXh0KTtcbiAgY29uc3QgbmFtZUVudHJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyB1c2U6IFwib2ZmaWNpYWxcIiwgdGV4dDogbmFtZVRleHQgfTtcbiAgaWYgKGZhbWlseSkgbmFtZUVudHJ5LmZhbWlseSA9IGZhbWlseTtcbiAgaWYgKGdpdmVuLmxlbmd0aCA+IDApIG5hbWVFbnRyeS5naXZlbiA9IGdpdmVuO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJQYXRpZW50XCIsXG4gICAgaWQ6IHBhdGllbnRJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgaWRlbnRpZmllcjogW1xuICAgICAge1xuICAgICAgICB1c2U6IFwib2ZmaWNpYWxcIixcbiAgICAgICAgc3lzdGVtOiBsb29rc0xpa2VUd05hdGlvbmFsSWQocmF3SWQpXG4gICAgICAgICAgPyBzeXN0ZW1zLlRXX05BVElPTkFMX0lEXG4gICAgICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9QQVRJRU5UX01STixcbiAgICAgICAgdmFsdWU6IHJhd0lkLFxuICAgICAgfSxcbiAgICBdLFxuICAgIG5hbWU6IFtuYW1lRW50cnldLFxuICAgIGdlbmRlcjogbWFwR2VuZGVyKHJhdy5nZW5kZXIpLFxuICB9O1xuXG4gIGNvbnN0IGJpcnRoRGF0ZSA9IHJhdy5iaXJ0aERhdGU7XG4gIGlmIChiaXJ0aERhdGUpIHJlc291cmNlLmJpcnRoRGF0ZSA9IGJpcnRoRGF0ZTtcblxuICBpZiAocGhvbmUpIHtcbiAgICByZXNvdXJjZS50ZWxlY29tID0gW3sgc3lzdGVtOiBcInBob25lXCIsIHVzZTogXCJob21lXCIsIHZhbHVlOiBwaG9uZSB9XTtcbiAgfVxuXG4gIGlmIChhZGRyZXNzKSB7XG4gICAgcmVzb3VyY2UuYWRkcmVzcyA9IFt7IHVzZTogXCJob21lXCIsIHRleHQ6IGFkZHJlc3MgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8qKlxuICogU3BsaXQgYSBmdWxsIG5hbWUgaW50byBbZmFtaWx5LCBbZ2l2ZW5dXSBmb3IgRkhJUiBQYXRpZW50Lm5hbWUuXG4gKlxuICogSGV1cmlzdGljczpcbiAqICAgLSBDb250YWlucyB3aGl0ZXNwYWNlIFx1MjE5MiBXZXN0ZXJuOiBsYXN0IHRva2VuID0gZmFtaWx5LCByZXN0ID0gZ2l2ZW4uXG4gKiAgIC0gQ0pLIC8gc2luZ2xlLXRva2VuIFx1MjE5MiBmaXJzdCBjaGFyID0gZmFtaWx5LCByZW1haW5kZXIgPSBnaXZlbi5cbiAqICAgLSBcIlVua25vd25cIiBvciBlbXB0eSBcdTIxOTIgW1wiXCIsIFtdXVxuICpcbiAqIFR3by1jaGFyIENKSyBmYW1pbHkgbmFtZXMgKFx1NkI1MFx1OTY3RCwgXHU1M0Y4XHU5OUFDLCBcdTIwMjYpIGFyZSBOT1QgYXV0by1kZXRlY3RlZC5cbiAqL1xuZnVuY3Rpb24gc3BsaXROYW1lKGZ1bGxOYW1lOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmdbXV0ge1xuICBjb25zdCBuYW1lID0gKGZ1bGxOYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFuYW1lIHx8IG5hbWUgPT09IFwiVW5rbm93blwiKSByZXR1cm4gW1wiXCIsIFtdXTtcbiAgaWYgKC9cXHMvLnRlc3QobmFtZSkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IG5hbWUuc3BsaXQoL1xccysvKTtcbiAgICByZXR1cm4gW3BhcnRzW3BhcnRzLmxlbmd0aCAtIDFdISwgcGFydHMuc2xpY2UoMCwgLTEpXTtcbiAgfVxuICAvLyBDSksgZmFsbGJhY2sgXHUyMDE0IGl0ZXJhdGUgY29kZXBvaW50cywgbm90IFVURi0xNiBjb2RlIHVuaXRzLCBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIChyYXJlIGluIENoaW5lc2UgbmFtZXMgYnV0IHBvc3NpYmxlKVxuICAvLyBkb24ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY29kZXBvaW50cyA9IEFycmF5LmZyb20obmFtZSk7XG4gIHJldHVybiBjb2RlcG9pbnRzLmxlbmd0aCA+IDEgPyBbY29kZXBvaW50c1swXSEsIFtjb2RlcG9pbnRzLnNsaWNlKDEpLmpvaW4oXCJcIildXSA6IFtuYW1lLCBbXV07XG59XG5cbmZ1bmN0aW9uIG1hcEdlbmRlcihnZW5kZXI6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBnID0gdHlwZW9mIGdlbmRlciA9PT0gXCJzdHJpbmdcIiA/IGdlbmRlci50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKFtcIm1hbGVcIiwgXCJtXCIsIFwiXHU3NTM3XCIsIFwiXHU3NTM3XHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJtYWxlXCI7XG4gIGlmIChbXCJmZW1hbGVcIiwgXCJmXCIsIFwiXHU1OTczXCIsIFwiXHU1OTczXHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJmZW1hbGVcIjtcbiAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuIiwgIi8vIE5ISSBKU09OIFx1MjE5MiBub3JtYWxpemVkIHNoYXBlIGFkYXB0ZXJzLlxuLy9cbi8vIEV4dHJhY3RlZCBmcm9tIGJhY2tncm91bmQuanMgc28gZWFjaCBhZGFwdGVyIGNhbiBiZSB1bml0LXRlc3RlZCBpblxuLy8gaXNvbGF0aW9uLiBiYWNrZ3JvdW5kLmpzIGltcG9ydHMgZXZlcnl0aGluZyBiZWxvdzsgdGhlIGxpdmUgU1cgZ2x1ZXNcbi8vIHRoZXNlIG9udG8gZmV0Y2hlZCBwYXlsb2FkcyB2aWEgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5LlxuLy9cbi8vIFdoeSBleHRyYWN0OiB0aGUgdjAuNi4xIGxhYitpbWFnaW5nIGRhdGUtZmllbGQgYnVncyAoY29tbWl0cyBiMzc4ODVmIC9cbi8vIDhjMTk5MDEpIHNoaXBwZWQgYmVjYXVzZSB0aGVzZSBmdW5jdGlvbnMgaGFkIFpFUk8gdGVzdCBjb3ZlcmFnZSBcdTIwMTRcbi8vIGJhY2tncm91bmQuanMgY2FuJ3QgYmUgbG9hZGVkIGluIGEgdGVzdCBlbnZpcm9ubWVudCAoY2hyb21lLiogQVBJcyxcbi8vIFNXIGdsb2JhbHMpLCBzbyB0aGUgYWRhcHQqIGxvZ2ljIHJvZGUgYWxvbmcgdW50ZXN0ZWQuIFB1bGxpbmcgdGhlbVxuLy8gaW50byBhIHB1cmUtZnVuY3Rpb24gbW9kdWxlIGxldHMgdml0ZXN0IHZlcmlmeSBmaWVsZC1wcmlvcml0eVxuLy8gZGVjaXNpb25zIHJvdy1ieS1yb3cuXG5cbi8vIENvbnZlcnQgTkhJJ3MgXHU2QzExXHU1NzBCIGRhdGUgXCIxMTUvMDUvMDVcIiBcdTIxOTIgSVNPIFwiMjAyNi0wNS0wNVwiLlxuLy8gU29tZSBOSEkgZmllbGRzIGVtYmVkIGJvdGggUk9DIGFuZCBHcmVnb3JpYW46IFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHdlXG4vLyBqdXN0IG1hdGNoIHRoZSBmaXJzdCBzZWdtZW50LlxuZXhwb3J0IGZ1bmN0aW9uIHJvY1RvSVNPKHJvY0RhdGUpIHtcbiAgaWYgKCFyb2NEYXRlKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgbSA9IFN0cmluZyhyb2NEYXRlKS5tYXRjaCgvXihcXGR7MiwzfSlbLy4tXShcXGR7MSwyfSlbLy4tXShcXGR7MSwyfSkvKTtcbiAgaWYgKCFtKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeSA9IHBhcnNlSW50KG1bMV0sIDEwKSArIDE5MTE7XG4gIHJldHVybiBgJHt5fS0ke21bMl0ucGFkU3RhcnQoMiwgXCIwXCIpfS0ke21bM10ucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG59XG5cbi8vIEludmVyc2U6IElTTyBcIjIwMjMtMDUtMDVcIiBcdTIxOTIgUk9DIFwiMTEyLzA1LzA1XCIuIFVzZWQgdG8gYnVpbGQgTkhJIGRhdGUtcmFuZ2Vcbi8vIHF1ZXJ5IHN0cmluZ3MgKHRoZWlyIGZvcm1zIGV4cGVjdCBcdTZDMTFcdTU3MEIgZm9ybWF0KS5cbmV4cG9ydCBmdW5jdGlvbiBpc29Ub1JPQyhpc29EYXRlKSB7XG4gIGlmICghaXNvRGF0ZSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IG0gPSBTdHJpbmcoaXNvRGF0ZSkubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSkvKTtcbiAgaWYgKCFtKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeSA9IHBhcnNlSW50KG1bMV0sIDEwKSAtIDE5MTE7XG4gIGlmICh5IDwgMSkgcmV0dXJuIFwiXCI7IC8vIHByZS1cdTZDMTFcdTU3MEIgZGF0ZXMgbWFrZSBubyBzZW5zZSB0byBOSElcbiAgcmV0dXJuIGAke3l9LyR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LyR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gTkhJIGJpbGluZ3VhbCBmaWVsZHMgdXNlIFwiXHU0RTJEXHU2NTg3fHxFbmdsaXNoXCIgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZhc3Rlcixcbi8vIHNvIHByZWZlciB0aGF0IHNpZGUuIElmIHRoZXJlJ3Mgbm8gYHx8YCB3ZSBqdXN0IHJldHVybiB0aGUgaW5wdXQgdHJpbW1lZC5cbmV4cG9ydCBmdW5jdGlvbiBwaWNrRW5nbGlzaChzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHN0ciA9IFN0cmluZyhzKTtcbiAgY29uc3QgaWR4ID0gc3RyLmluZGV4T2YoXCJ8fFwiKTtcbiAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBzdHIudHJpbSgpO1xuICBjb25zdCBlbiA9IHN0ci5zbGljZShpZHggKyAyKS50cmltKCk7XG4gIHJldHVybiBlbiB8fCBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG59XG5cbi8vIEFkYXB0ZXIgZm9yIE5ISSBsYWIvb2JzZXJ2YXRpb24gSlNPTiBzaGFwZSAoY29uZmlybWVkIGZvciBJSEtFMzQwOVMwMTtcbi8vIG90aGVyIGxhYiBlbmRwb2ludHMgbGlrZWx5IHVzZSB0aGUgc2FtZSBmaWVsZHMpLlxuLy9cbi8vIERhdGUgZmllbGQgY2hvaWNlIFx1MjAxNCBJSEtFMzQwOSByZXR1cm5zIHRocmVlIGRhdGUtaXNoIGZpZWxkcyBwZXIgcm93OlxuLy8gICAtIGZ1bkNfREFURSAgICAgICAgICBcdTVDMzFcdThBM0FcdTY1RTUgLyBcdTUxNjVcdTk2NjJcdTY1RTUgKHZpc2l0IHJlZ2lzdHJhdGlvbiAvIGFkbWlzc2lvbilcbi8vICAgLSByZWFMX0lOU1BFQ1RfREFURSAgXHU1QkU2XHU5NjlCXHU2M0ExXHU2QUEyXHU2NUU1IChhY3R1YWwgc2FtcGxlLWNvbGxlY3Rpb24gZGF0ZSlcbi8vICAgLSBhc3NhWV9VUExPQURfREFURSAgXHU0RTBBXHU1MEIzXHU2NUU1ICh3aGVuIHRoZSByZXN1bHQgaGl0IE5ISSdzIHNlcnZlcilcbi8vIEZvciBhbiBpbnBhdGllbnQsIGZ1bkNfREFURSBpcyB0aGUgYWRtaXNzaW9uIGRheSBhbmQgZXZlcnkgbGFiIGRyYXduXG4vLyBkdXJpbmcgdGhlIHN0YXkgY2FycmllcyB0aGUgc2FtZSBmdW5DX0RBVEUgXHUyMDE0IHVzaW5nIGl0IGFzIE9ic2VydmF0aW9uLlxuLy8gZWZmZWN0aXZlRGF0ZVRpbWUgbWFkZSBhbGwgXHU0RjRGXHU5NjYyXHU2NzFGXHU5NTkzIGxhYnMgbG9vayBsaWtlIHRoZXkgd2VyZSBkcmF3blxuLy8gb24gZGF5IDEuIEZISVIncyBcInBoeXNpb2xvZ2ljYWxseSByZWxldmFudCB0aW1lXCIgZm9yIGEgbGFiIE9ic2VydmF0aW9uXG4vLyBpcyB0aGUgc2FtcGxlLWNvbGxlY3Rpb24gZGF0ZSwgc28gcHJlZmVyIHJlYUxfSU5TUEVDVF9EQVRFIHdoZW4gTkhJXG4vLyByZXR1cm5zIGl0OyBmYWxsIGJhY2sgdG8gZnVuQ19EQVRFIG9ubHkgd2hlbiB0aGUgaW5zcGVjdCBmaWVsZCBpc1xuLy8gbWlzc2luZyAob2xkZXIgcm93cyAvIGVuZHBvaW50cyB0aGF0IGRvbid0IGNhcnJ5IGl0KS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdExhYkl0ZW0oaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oXG4gICAgaXRlbS5yZWFMX0lOU1BFQ1RfREFURSB8fCBpdGVtLnJlYWxfaW5zcGVjdF9kYXRlIHx8IGl0ZW0uZnVuQ19EQVRFLFxuICApO1xuICBjb25zdCB2YWx1ZSA9IGl0ZW0uYXNzYVlfVkFMVUU7XG4gIGlmICghZGF0ZSB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgLy8gSU1QT1JUQU5UOiBgb3JkZXJfc2hvcnRuYW1lYCBpcyBOSEkncyBVSS10cnVuY2F0ZWQgbGFiZWwgKH4xNSBjaGFyc1xuICAvLyArIFwiIC4uLlwiKSwgc3VpdGFibGUgZm9yIHRoZWlyIGxvbmctdGFibGUgZGlzcGxheSBidXQgTk9UIGZvciBGSElSXG4gIC8vIE9ic2VydmF0aW9uLmNvZGUudGV4dCBcdTIwMTQgZG93bnN0cmVhbSBTTUFSVCBhcHBzIGVuZCB1cCBzaG93aW5nIGhhbGZcbiAgLy8gbmFtZXMgbGlrZSBcIlBDIFN1Z2FyIFx1OThFRlx1NUY4QyAuLi5cIiB3aXRoIG5vIGZpZWxkIHRvIHJlY292ZXIgdGhlIGZ1bGxcbiAgLy8gbmFtZSBmcm9tLiBBbHdheXMgcHJlZmVyIGBhc3NhWV9JVEVNX05BTUVgICh0aGUgZnVsbCBpdGVtIG5hbWUsXG4gIC8vIHR5cGljYWxseSBiaWxpbmd1YWwgbGlrZSBcIlBDIFN1Z2FyIFx1OThFRlx1NUY4Q1x1NTE2OVx1NUMwRlx1NjY0Mlx1ODg0MFx1N0NENlwiKSBhbmQgb25seSBmYWxsXG4gIC8vIGJhY2sgdG8gdGhlIHNob3J0bmFtZSB3aGVuIHRoZSBmdWxsIG5hbWUgaXMgZ2VudWluZWx5IGFic2VudC5cbiAgLy8gU2FtZSBwcmlvcml0eSBhcHBsaWVkIHRvIGBjb2RlYCBhbmQgYGRpc3BsYXlgIHNvIGJvdGhcbiAgLy8gT2JzZXJ2YXRpb24uY29kZS50ZXh0IGFuZCBjb2RpbmdbXS5kaXNwbGF5IGNhcnJ5IHRoZSBmdWxsIGxhYmVsLlxuICBjb25zdCBmdWxsTmFtZSA9IGl0ZW0uYXNzYVlfSVRFTV9OQU1FIHx8IGl0ZW0ub3JkZXJfc2hvcnRuYW1lIHx8IFwiXCI7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBvcmRlcl9jb2RlOiBpdGVtLm9yZGVSX0NPREUgfHwgXCJcIixcbiAgICBvcmRlcl9uYW1lOiBpdGVtLm9yZGVSX05BTUUgfHwgXCJcIixcbiAgICBjb2RlOiBmdWxsTmFtZSxcbiAgICBkaXNwbGF5OiBmdWxsTmFtZSxcbiAgICB2YWx1ZTogU3RyaW5nKHZhbHVlKSxcbiAgICB1bml0OiBpdGVtLnVuaVRfREFUQSB8fCBcIlwiLFxuICAgIHJlZmVyZW5jZV9yYW5nZTogaXRlbS5jb25zdWxUX1ZBTFVFIHx8IGl0ZW0uc2hvcnRfQ09OU1VMVF9WQUxVRSB8fCBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwNlMwMSByZXR1cm5zIHZpc2l0LWxldmVsIHJvd3MgT05MWSAobm8gZHJ1ZyBuYW1lcykuIFRoZSBhY3R1YWwgZHJ1Z1xuLy8gbGlzdCBsaXZlcyBhdCBJSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD08cm93X0lEPiZjdHlwZT0yLCBpblxuLy8gYGloa2UzMzA2UzAyX21haW5fZGF0YVsqXS5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3RgLiBXZSBkbyB0aGF0IDItc3RlcFxuLy8gZmV0Y2ggc2VwYXJhdGVseTsgdGhpcyBmdW5jdGlvbiBhZGFwdHMgYSBzaW5nbGUgZHJ1ZyBlbnRyeSBnaXZlbiBpdHNcbi8vIHBhcmVudCB2aXNpdCBjb250ZXh0LlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZHJ1ZywgdmlzaXQpIHtcbiAgaWYgKCFkcnVnIHx8IHR5cGVvZiBkcnVnICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgLy8gdmlzaXQuZnVuY19EQVRFIGlzIFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHJvY1RvSVNPIG1hdGNoZXMgdGhlIFJPQ1xuICAvLyBwcmVmaXggY29ycmVjdGx5LlxuICBjb25zdCBkYXRlID0gcm9jVG9JU08odmlzaXQ/LmZ1bmNfREFURSB8fCB2aXNpdD8uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBjb25zdCBkcnVnX25hbWUgPSBwaWNrRW5nbGlzaChkcnVnLmRydWdfbmFtZSB8fCBkcnVnLmRydUdfTkFNRSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlIHx8ICFkcnVnX25hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXlzID0gTnVtYmVyKGRydWcub3JkZXJfZHJ1Z19kYXkgfHwgZHJ1Zy5vcmRlcl9EUlVHX0RBWSB8fCAwKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGRydWdfbmFtZSxcbiAgICBjb2RlOiBkcnVnLm9yZGVyX2NvZGUgfHwgZHJ1Zy5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBkb3NlL2ZyZXF1ZW5jeS9yb3V0ZSBcdTIwMTQgb25seSBkYXlzICsgcXR5LlxuICAgIGRvc2U6IFwiXCIsXG4gICAgZnJlcXVlbmN5OiBcIlwiLFxuICAgIHJvdXRlOiBcIlwiLFxuICAgIHF1YW50aXR5OiBkcnVnLm9yZGVyX3F0eSB8fCBkcnVnLm9yZGVyX1FUWSB8fCBcIlwiLFxuICAgIGR1cmF0aW9uX2RheXM6IE51bWJlci5pc0Zpbml0ZShkYXlzKSA/IGRheXMgOiAwLFxuICAgIC8vIHBpY2tFbmdsaXNoIG9uIGljZF9uYW1lIHR1cm5zIFx1ODI2Rlx1NjAyN1x1NjUxRFx1OEI3N1x1ODE3QS4uLnx8QmVuaWduIHByb3N0YXRpYy4uLiBpbnRvIHRoZSBFTiBzaWRlLlxuICAgIGluZGljYXRpb246IHBpY2tFbmdsaXNoKHZpc2l0Py5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2aXNpdD8uaWNkOWNtX25hbWUgfHwgXCJcIiksXG4gICAgaW5kaWNhdGlvbl9jb2RlOiB2aXNpdD8uaWNkOWNtX0NPREUgfHwgdmlzaXQ/LmljZDljbV9jb2RlIHx8IFwiXCIsXG4gICAgZHJ1Z19jbGFzczogcGlja0VuZ2xpc2goZHJ1Zy5hY3QgfHwgXCJcIiksXG4gICAgaG9zcGl0YWw6IHZpc2l0Py5ob3NwX0FCQlIgfHwgdmlzaXQ/Lmhvc3BfYWJiciB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBTdHViIGtlcHQgZm9yIHRoZSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgSUhLRTMzMDZTMDEgbGlzdCBuZXZlciBoYXMgZHJ1Z3MsXG4vLyBzbyB3ZSBhbHdheXMgcmV0dXJuIG51bGwgYW5kIHJlbHkgb24gdGhlIDItc3RlcCBkZXRhaWwgZmV0Y2ggYWJvdmUuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRNZWRpY2F0aW9uKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBJSEtFMzQwMlMwMSAoXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1XHU3RDUwXHU2NzlDKSBcdTIwMTQgb25lIHJvdyBwZXIgc2NyZWVuaW5nIGV2ZW50LCBmbGF0XG4vLyBzY2hlbWEuIE5ISSBydW5zIHRoZSBwYW5lbCBpdHNlbGYgYW5kIHJldHVybnMgdml0YWxzICsgYSBmaXhlZFxuLy8gYmF0dGVyeSBvZiBsYWIgdmFsdWVzIHByZS1jb21wdXRlZCAoQk1JIC8gd2Fpc3QgLyBCUCAvIGxpcGlkcyAvIExGVFxuLy8gLyBSRlQgLyBmYXN0aW5nIGdsdWNvc2UgLyBIQnNBZyAvIEFudGktSENWIC8gdXJpYyBhY2lkIFx1MjAyNikuXG4vLyBXZSB1bmZvbGQgb25lIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbnM6IHZpdGFscyBnbyB0byBjYXRlZ29yeVxuLy8gdml0YWwtc2lnbnMgKHNvIFNNQVJUIGFwcHMnIHZpdGFscyB2aWV3cyBwaWNrIHRoZW0gdXApLCBsYWJzIGdvIHRvXG4vLyBjYXRlZ29yeSBsYWJvcmF0b3J5LiBSZXR1cm5zIGFuIEFSUkFZIFx1MjAxNCBjYWxsZXIgbXVzdCBmbGF0LW1hcC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEFkdWx0UHJldmVudGl2ZShyb3cpIHtcbiAgaWYgKCFyb3cgfHwgdHlwZW9mIHJvdyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhyb3cuZmlyc1RfRElBR19EQVRFIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUpIHJldHVybiBudWxsO1xuICBjb25zdCBob3NwaXRhbCA9IHJvdy5ob3NQX0FCQlIgfHwgcm93Lmhvc3BfQUJCUiB8fCBcIlwiO1xuICBjb25zdCBvdXQgPSBbXTtcbiAgLy8gKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIE5ISSBjb2RlKVxuICBmdW5jdGlvbiBwdXNoKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIGNvZGUpIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGNvbnN0IHYgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgICBpZiAodiA9PT0gXCJcIiB8fCB2ID09PSBcIi1cIiB8fCB2ID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgb3V0LnB1c2goe1xuICAgICAgZGF0ZSxcbiAgICAgIGhvc3BpdGFsLFxuICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiLFxuICAgICAgb3JkZXJfY29kZTogY29kZSB8fCBcIlwiLFxuICAgICAgb3JkZXJfbmFtZTogZGlzcGxheSxcbiAgICAgIGNvZGU6IGNvZGUgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgICB2YWx1ZTogdixcbiAgICAgIHVuaXQ6IHVuaXQgfHwgXCJcIixcbiAgICAgIHJlZmVyZW5jZV9yYW5nZTogcmVmUmFuZ2UgfHwgXCJcIixcbiAgICB9KTtcbiAgfVxuICAvLyBWaXRhbCBzaWduc1xuICBwdXNoKFwiQm9keSBIZWlnaHRcIiwgcm93LmhlaWdodCwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQm9keSBXZWlnaHRcIiwgcm93LndlaWdodCwgXCJrZ1wiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQk1JXCIsIHJvdy5ibWksIFwia2cvbTJcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIldhaXN0IENpcmN1bWZlcmVuY2VcIiwgcm93LndhaXN0bGluZSwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiU3lzdG9saWMgQmxvb2QgUHJlc3N1cmVcIiwgcm93LmJhc0VfU0JQLCBcIm1tSGdcIixcbiAgICAgICByb3cuYmxvRF9QUkVTU19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiRGlhc3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX0VCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgLy8gTGlwaWQgcGFuZWxcbiAgcHVzaChcIkNob2xlc3Rlcm9sXCIsICAgcm93LmNobywgICAgIFwibWcvZExcIik7XG4gIHB1c2goXCJUcmlnbHljZXJpZGVcIiwgIHJvdy5ibG9EX1RHLCBcIm1nL2RMXCIpO1xuICBwdXNoKFwiSERMXCIsICAgICAgICAgICByb3cuaGRsLCAgICAgXCJtZy9kTFwiKTtcbiAgcHVzaChcIkxETFwiLCAgICAgICAgICAgcm93LmxkbCwgICAgIFwibWcvZExcIik7XG4gIC8vIExpdmVyIGZ1bmN0aW9uXG4gIHB1c2goXCJTR09UIChBU1QpXCIsICAgIHJvdy5zZ290LCAgICBcIlUvTFwiLCByb3cubEZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiKTtcbiAgcHVzaChcIlNHUFQgKEFMVClcIiwgICAgcm93LnNncHQsICAgIFwiVS9MXCIsIHJvdy5sRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICAvLyBGYXN0aW5nIGdsdWNvc2UgXHUyMDE0IE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgMDkwMDVDXG4gIHB1c2goXCJHbHUtQUNcIiwgICAgICAgIHJvdy5zXzA5MDA1QywgXCJtZy9kTFwiLFxuICAgICAgIHJvdy5zXzA5MDA1Q19ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDA1Q1wiKTtcbiAgLy8gUmVuYWwgZnVuY3Rpb25cbiAgcHVzaChcIkJVTlwiLCAgICAgICAgICAgcm93LnVyaW5FX0JVTiwgICBcIm1nL2RMXCIpO1xuICBwdXNoKFwiQ3JlYXRpbmluZVwiLCAgICByb3cuYmxvRF9DUkVBVCwgIFwibWcvZExcIik7XG4gIHB1c2goXCJlR0ZSXCIsICAgICAgICAgIHJvdy5lZ2ZyLCAgICAgICAgXCJtTC9taW4vMS43M20yXCIsXG4gICAgICAgcm93LnJGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIHB1c2goXCJVcmluZSBQcm90ZWluXCIsIHJvdy51cmluRV9QUk9URUlOLCBcIlwiLFxuICAgICAgIHJvdy51cmluRV9QUk9URUlOX1RFWFQgfHwgXCJcIik7XG4gIC8vIEhlcGF0aXRpcyBCL0Mgc2NyZWVuaW5nXG4gIHB1c2goXCJIQnNBZ1wiLCAgICAgICAgIHJvdy5oYnNhZywgICAgICAgXCJcIiwgcm93Lmhic2FHX1RFWFQgfHwgXCJcIik7XG4gIHB1c2goXCJBbnRpLUhDVlwiLCAgICAgIHJvdy5hbnRJX0hDViwgICAgXCJcIiwgcm93LmFudElfSENWX1RFWFQgfHwgXCJcIik7XG4gIC8vIFVyaWMgYWNpZCBcdTIwMTQgbm90ZTogTkhJJ3MgSUhLRTM0MDIgc2NoZW1hIGFsc28gaGFzIGEgZmllbGQgY2FsbGVkXG4gIC8vIGB1cmluRV9VQV9ESUFHX0FDSURgIHRoYXQgTE9PS1MgbGlrZSB1cmluZSBVQSBidXQgdGhlIHZhbHVlcyBhcmVcbiAgLy8gaWRlbnRpY2FsIHRvIGB1cmlDX0FDSURgIChzZXJ1bSwgbWcvZEwpLiBJdCdzIGEgbWlzbmFtZWQgZHVwbGljYXRlXG4gIC8vIHdlIGRlbGliZXJhdGVseSBza2lwIFx1MjAxNCB1c2luZyBib3RoIHdvdWxkIGNyZWF0ZSB0d28gRkhJUlxuICAvLyBPYnNlcnZhdGlvbnMgd2l0aCB0aGUgc2FtZSB2YWx1ZSBidXQgY29udHJhZGljdG9yeSBzcGVjaW1lbnMuXG4gIHB1c2goXCJVcmljIEFjaWRcIiwgICAgIHJvdy51cmlDX0FDSUQsICAgXCJtZy9kTFwiKTtcbiAgLy8gVXJpbmUgVUEgKHF1YWxpdGF0aXZlIHVyaW5lIGRpcHN0aWNrIHRlc3QgXHUyMDE0IGRpc3RpbmN0IGZyb20gdGhlXG4gIC8vIG1pc2xhYmVsZWQgdXJpbkVfVUFfRElBR19BQ0lEIGFib3ZlOyB0aGlzIGB1cmluRV9VQWAgaXMgdGhlIHJlYWxcbiAgLy8gdXJpbmUgVUEgcmVzdWx0LCB1c3VhbGx5IGEgKy8tIHN0cmluZyBvciBlbXB0eSB3aGVuIG5vdCBydW4pLlxuICBwdXNoKFwiVXJpbmUgVUFcIiwgICAgICByb3cudXJpbkVfVUEsICAgIFwiXCIsXG4gICAgICAgcm93LnVyaW5FX1VBX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIC8vIE1ldGFib2xpYyBzeW5kcm9tZSBzY3JlZW5pbmcgXHUyMDE0IHZhbHVlIGlzIGFuIGludGVycHJldGF0aW9uIHN0cmluZ1xuICAvLyAoJ1x1NkI2M1x1NUUzOCcgLyAnXHU3NTcwXHU1RTM4XHVGRjBDXHU1RUZBXHU4QjcwXHVGRjFBXHU4QUNCXHU2RDNEXHU4QTYyXHU5MUFCXHU1RTJCJyksIG5vdCBhIG51bWJlci4gVGhlIG1hcHBlcidzXG4gIC8vIF90cnlfcGFyc2VfcXVhbnRpdHkgd2lsbCByZXR1cm4gTm9uZSBhbmQgaXQgZmFsbHMgdGhyb3VnaCB0b1xuICAvLyB2YWx1ZVN0cmluZy4gTm8gbWFwcGVkIExPSU5DIGtleXdvcmQgKHlldCkgc28gdGhpcyBsYW5kcyBhcyBhblxuICAvLyBPYnNlcnZhdGlvbiB3aXRoIGNvZGUudGV4dCBvbmx5OyBkb3duc3RyZWFtIGNvbnN1bWVycyBjYW4gc3RpbGxcbiAgLy8gc3VyZmFjZSBpdCB1bmRlciB0aGUgcGF0aWVudCdzIHNjcmVlbmluZyBzZWN0aW9uIGJ5IGNvZGUudGV4dC5cbiAgcHVzaChcIlx1NEVFM1x1OEIxRFx1NzVDN1x1NTAxOVx1N0ZBNFx1N0JFOVx1NkFBMiAoTWV0YWJvbGljIFN5bmRyb21lIFNjcmVlbmluZylcIixcbiAgICAgICByb3cubWV0QV9TWU5EUl9SRVNVTFRfVEVYVCwgXCJcIiwgXCJcIik7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8vIElIS0UzMzA5UzAxIChcdTRGNEZcdTk2NjIgaW5wYXRpZW50IGxpc3QpIFx1MjAxNCBnaXZlcyBwcm9wZXIgYWRtaXNzaW9uL2Rpc2NoYXJnZS5cbi8vIFNoYXBlOiB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgaW5fREFURSwgb3V0X0RBVEUsXG4vLyAgICAgICAgIGljZDljbV9DT0RFLCBpY2Q5Y21fQ09ERV9DTkFNRSwgb3JpX1RZUEUoXCIzXCIpLCByb3dfSUQsIC4uLn1cbi8vIElIS0UzMzA4UzAxIGhhcyB0aGUgc2FtZSBzaGFwZSBmb3IgYSBzbWFsbCBzZXQgb2Ygb2xkZXIgXHU0RjRGXHU5NjYyIHJlY29yZHM7XG4vLyBgZnVuY19EQVRFYCBpbnN0ZWFkIG9mIGBpbl9EQVRFYCBpbiBzb21lIHJvd3MgXHUyMDE0IGFkYXB0ZXIgYWNjZXB0cyBib3RoLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0SW5wYXRpZW50RW5jb3VudGVyKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc3RhcnQgPSByb2NUb0lTTyhpdGVtLmluX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgXCJcIik7XG4gIGNvbnN0IGVuZCA9IHJvY1RvSVNPKGl0ZW0ub3V0X0RBVEUgfHwgXCJcIik7XG4gIGlmICghc3RhcnQpIHJldHVybiBudWxsO1xuICAvLyBpY2Q5Y20gbmFtZSBvbiBcdTRGNEZcdTk2NjIgbGlzdCBpcyBqdXN0IENoaW5lc2UgKG5vIHx8IEVuZ2xpc2ggc3BsaXQgb2JzZXJ2ZWQpLlxuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX25hbWUgfHwgXCJcIik7XG4gIHJldHVybiB7XG4gICAgZGF0ZTogc3RhcnQsXG4gICAgZW5kX2RhdGU6IGVuZCxcbiAgICBjbGFzczogXCJJTVBcIixcbiAgICB0eXBlX2Rpc3BsYXk6IFwiXHU0RjRGXHU5NjYyXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIHJvd19pZDogaXRlbS5yb3dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkgaXRlbSBzaGFwZSBcdTIwMTQgZmFyIG1vcmUgY29tcGxldGUgdGhhbiB0aGUgb2xkZXJcbi8vIElIS0UzMzAxUzAyIHZpc2l0IGxpc3QgKDUxIHZpc2l0cyB2cyA2IGZvciB0aGUgdGVzdCBwYXRpZW50KS4gTkhJJ3Ncbi8vIGNhbm9uaWNhbCBzb3VyY2Ugb2YgdHJ1dGggZm9yIFwiZXZlcnkgYmlsbGVkIGVuY291bnRlclwiLlxuLy8gICBob3NQX0lELCBob3NQX0FCQlIsIGhvc3BfdXJsXG4vLyAgIGZ1bkNfREFURSAgICAgICAgICAgICAgKFx1NkMxMVx1NTcwQiBZWVkvTU0vREQpXG4vLyAgIGljRDlDTV9DT0RFIC8gaWNEOUNNX0NPREVfQ05BTUVcbi8vICAgb3JJX1RZUEUgLyBvcmlfdHlwZV9uYW1lICAgKFwiSUNcdTUzNjFcdThDQzdcdTY1OTlcIiAvIFwiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIpIFx1MjAxNCBvcmlnaW4sIE5PVCBcdTk1ODAvXHU2MDI1L1x1NEY0RlxuLy8gICBwYXJ0X0FNVCwgYXBwbF9ET1QsIFx1MjAyNiAgIChiaWxsaW5nIFx1MjAxNCBkaXNjYXJkZWQpXG4vLyAgIHJvV19JRCAgICAgICAgICAgICAgICAgIGRldGFpbCBrZXkgZm9yIElIS0UzMzAzUzAyIGZhbi1vdXQgKFBoYXNlIEIpXG4vLyBXZSBkb24ndCBoYXZlIHZpc2l0IGNsYXNzIChcdTk1ODAvXHU2MDI1L1x1NEY0RikgYXQgdGhlIGxpc3QgbGV2ZWw7IHRoZSBTMDIgZGV0YWlsXG4vLyBoYXMgaG9zcF9EQVRBX1RZUEVfTkFNRSAoXCJcdTg5N0ZcdTkxQUJcIi9cIlx1NEUyRFx1OTFBQlwiL1wiXHU3MjU5XHU5MUFCXCIpLiBGb3Igbm93IGRlZmF1bHQgQU1CLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UoaXRlbSwgY2xhc3NIaW50KSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaWNkQ29kZSA9IGl0ZW0uaWNEOUNNX0NPREUgfHwgaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChcbiAgICBpdGVtLmljRDlDTV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fbmFtZSB8fCBcIlwiXG4gICk7XG4gIC8vIGNsYXNzIGRlZmF1bHRzIHRvIEFNQjsgSUhLRTMzMDNTMDIgZGV0YWlsIGZhbi1vdXQgbWF5IG92ZXJyaWRlIHRvXG4gIC8vIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRSAoXHU2MDI1XHU4QTNBIC8gXHU0RjRGXHU5NjYyKS5cbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGVuZF9kYXRlOiBcIlwiLFxuICAgIGNsYXNzOiBjbGFzc0hpbnQgfHwgXCJBTUJcIixcbiAgICAvLyBPcmlnaW4gbWFya2VyIGlzbid0IGEgY2xpbmljYWwgY2xhc3MsIGJ1dCBzdGFzaCBpdCBhcyB0eXBlX2Rpc3BsYXlcbiAgICAvLyBzbyBkb3duc3RyZWFtIHNlZXMgdGhlIE5ISSBsYWJlbCB3aXRob3V0IHVzIGludmVudGluZyBvbmUuXG4gICAgdHlwZV9kaXNwbGF5OiBpdGVtLm9yaV90eXBlX25hbWUgfHwgaXRlbS5vcklfVFlQRV9OQU1FIHx8IFwiXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIFBhc3MgdGhyb3VnaCBmb3IgdGhlIGV2ZW50dWFsIElIS0UzMzAzUzAyIGRldGFpbCBmZXRjaCAoUGhhc2UgQikuXG4gICAgcm93X2lkOiBpdGVtLnJvV19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRBbGxlcmd5KGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgYWxsZXJnZW4gPVxuICAgIGl0ZW0uYWxsZXJnZW5fbmFtZSB8fCBpdGVtLmFsbGVSX05BTUUgfHwgaXRlbS5tZWRuYW1lIHx8XG4gICAgaXRlbS5kcnVHX05BTUUgfHwgaXRlbS5hbGxlcmdlbiB8fCBcIlwiO1xuICBpZiAoIWFsbGVyZ2VuKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICByZWNvcmRlZF9kYXRlOiByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLnJlY29yRF9EQVRFIHx8IFwiXCIpLFxuICAgIGRpc3BsYXk6IGFsbGVyZ2VuLFxuICAgIGNhdGVnb3J5OiBcIm1lZGljYXRpb25cIixcbiAgICBjcml0aWNhbGl0eTogXCJ1bmFibGUtdG8tYXNzZXNzXCIsXG4gICAgcmVhY3Rpb246IGl0ZW0ucmVhY3Rpb04gfHwgaXRlbS5zeW1wdG9tIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzMzAxUzA1IChcdTg2NTVcdTdGNkUvXHU2MjRCXHU4ODUzIGxpc3QpIHNoYXBlOlxuLy8gICB7aG9zcF9pZCwgaG9zcF9hYmJyLCBob3NwX3VybCwgb3JpX3R5cGVfbmFtZSwgb3JpX3R5cGUsIGZ1bmNfZGF0ZSxcbi8vICAgIG91dF9kYXRlLCBpY2Q5Y21fY29kZSwgaWNkOWNtX2NvZGVfY25hbWUsIG9wX2NvZGVfY25hbWUsIHJvd19pZH1cbi8vIE5vdGU6IG5vIHByb2NlZHVyZSBDT0RFIGluIGxpc3QgXHUyMDE0IG9wX2NvZGVfY25hbWUgaXMgdGhlIG9ubHkgbGFiZWwuXG4vLyBEYXRlIG5vdGU6IE5ISSBkb2Vzbid0IGV4cG9zZSBhIHNlcGFyYXRlIFwiYWN0dWFsIHByb2NlZHVyZSBkYXRlXCIgaGVyZSxcbi8vIHNvIGZvciBpbnBhdGllbnQgcHJvY2VkdXJlcyAod2hlcmUgZnVuY19kYXRlID0gYWRtaXNzaW9uLCBvdXRfZGF0ZSA9XG4vLyBkaXNjaGFyZ2UpIHdlIGRlbGliZXJhdGVseSB1c2UgZnVuY19kYXRlIGFzIHRoZSBhbmNob3IuIFRoZSBwcm9jZWR1cmVcbi8vIFwiaGFwcGVuZWQgc29tZXdoZXJlIGluIHRoaXMgYWRtaXNzaW9uXCIgXHUyMDE0IGFuY2hvcmluZyB0byB0aGUgc3RhcnQgZGF5XG4vLyBpcyBhIHNtYWxsIGxvc3Mgb2YgYWNjdXJhY3kgdnMuIGludmVudGluZyBhIHBlcmZvcm1lZFBlcmlvZCB0aGF0IHdvdWxkXG4vLyBzdWdnZXN0IHRoZSBwcm9jZWR1cmUgc3Bhbm5lZCB0aGUgd2hvbGUgc3RheS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFByb2NlZHVyZShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bmNfZGF0ZSB8fCBpdGVtLmZ1bkNfREFURSk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChcbiAgICBpdGVtLm9wX2NvZGVfY25hbWUgfHwgaXRlbS5wcm9DX05BTUUgfHwgaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCJcbiAgKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5KSByZXR1cm4gbnVsbDtcbiAgLy8gRGlhZ25vc2lzIChpY2Q5Y21fY29kZV9jbmFtZSkgaXMgdGhlICpyZWFzb24qIGZvciB0aGUgcHJvY2VkdXJlLCBub3RcbiAgLy8gdGhlIHByb2NlZHVyZSBjb2RlIGl0c2VsZi4gU3Rhc2ggaXQgaW4gYG5vdGVgIHNvIGl0IHNob3dzIHVwIGluIHRoZVxuICAvLyBGSElSIHJlc291cmNlIHdpdGhvdXQgcG9sbHV0aW5nIHRoZSBjb2RlIGZpZWxkLlxuICBjb25zdCByZWFzb25Db2RlID0gaXRlbS5pY2Q5Y21fY29kZSB8fCBpdGVtLmljZDljbV9DT0RFIHx8IFwiXCI7XG4gIGNvbnN0IHJlYXNvbk5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9jb2RlX2NuYW1lIHx8IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgXCJcIik7XG4gIGNvbnN0IG5vdGUgPSByZWFzb25OYW1lXG4gICAgPyAocmVhc29uQ29kZSA/IGBSZWFzb246ICR7cmVhc29uQ29kZX0gJHtyZWFzb25OYW1lfWAgOiBgUmVhc29uOiAke3JlYXNvbk5hbWV9YClcbiAgICA6IFwiXCI7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgbm90ZSxcbiAgICBib2R5X3NpdGU6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9hYmJyIHx8IGl0ZW0uaG9zUF9BQkJSIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzNDA4UzAxIChcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTUgbGlzdCkgc2hhcGU6XG4vLyAgIHtob3NwX0lELCBob3NwX0FCQlIsIGhvc3BfdXJsLCByZWFsX0lOU1BFQ1RfREFURSwgb3JkZXJfQ09ERSxcbi8vICAgIG9yZGVyX0NPREVfMldvcmQsIG9yZGVyX05BTUUsIG9yaV9UWVBFLCByb3dfSUQsIGpwR19TVEFUVVMsIC4uLn1cbi8vIE5vIGZpbmRpbmdzL2NvbmNsdXNpb24gXHUyMDE0IGxpc3QgaXMgb3JkZXItbGV2ZWwgb25seS4gV2UgbWFwIHRvIFByb2NlZHVyZVxuLy8gKGFuIGV4YW0gd2FzIHBlcmZvcm1lZCkgcmF0aGVyIHRoYW4gRGlhZ25vc3RpY1JlcG9ydCAod2hpY2ggbmVlZHMgYVxuLy8gbmFycmF0aXZlKS4gSWYvd2hlbiB3ZSBmZXRjaCB0aGUgYWN0dWFsIHJlcG9ydCB0aGlzIGJlY29tZXMgYSBEUi5cbi8vIElIS0UzNDA4UzAyIGRldGFpbCBwcm92aWRlcyB0aGUgZnVsbCByYWRpb2xvZ3kgLyBlbmRvc2NvcHkgcmVwb3J0IGluXG4vLyBgZGVzY2AuIENvbWJpbmVkIHdpdGggb3JkZXJfTkFNRSArIHRoZSBleGFtIGRhdGUgdGhpcyBpcyBhIHByb3BlciBGSElSXG4vLyBEaWFnbm9zdGljUmVwb3J0LiBMaXN0LW9ubHkgZW50cmllcyAod2hlcmUgdGhlIGRldGFpbCBmZXRjaCByZXR1cm5lZFxuLy8gbm8gYGRlc2NgKSBnZXQgZHJvcHBlZCBcdTIwMTQgd2l0aG91dCBhIG5hcnJhdGl2ZSB0aGUgcmVwb3J0IG1hcHBlciB3b3VsZFxuLy8gcmVqZWN0IHRoZW0gYW55d2F5LlxuLy9cbi8vIERhdGUgZmllbGQgY2hvaWNlIFx1MjAxNCBJSEtFMzQwOFMwMiBkZXRhaWwgcGF5bG9hZCBleHBvc2VzOlxuLy8gICAtIHJlYWxfSU5TUEVDVF9EQVRFICBcdTVCRTZcdTk2OUJcdTYzQTFcdTZBQTIvXHU1MDVBXHU1RjcxXHU1MENGXHU2NUU1IChtb3N0IGFjY3VyYXRlIHdoZW4gcHJlc2VudClcbi8vICAgLSBmdW5jX0RBVEUgICAgICAgICAgXHU1QzMxXHU4QTNBL1x1NTE2NVx1OTY2Mlx1NjVFNSAodmlzaXQgYW5jaG9yKVxuLy8gICAtIGFzc2F5X1VQTE9BRF9EQVRFICBcdTU4MzFcdTU0NEFcdTRFMEFcdTUwQjNcdTY2NDJcdTk1OTMgKG9mdGVuIHdlZWtzIGFmdGVyIHRoZSBleGFtIFx1MjAxNFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBiZWxvbmdzIHRvIERpYWdub3N0aWNSZXBvcnQuaXNzdWVkLCBOT1Rcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWZmZWN0aXZlRGF0ZVRpbWUpXG4vLyBJbiBwcmFjdGljZSByZWFsX0lOU1BFQ1RfREFURSBpcyBvZnRlbiBudWxsIG9uIHRoZSBTMDIgZGV0YWlsXG4vLyAoY29uZmlybWVkIGFnYWluc3QgbGl2ZSBOSEkgcGF5bG9hZHMpOyB3ZSB0aGVuIGZhbGwgYmFjayB0b1xuLy8gZnVuY19EQVRFIHJhdGhlciB0aGFuIHRoZSB1cGxvYWQgdGltZS4gRmFsbGluZyBiYWNrIHRvIHRoZVxuLy8gdXBsb2FkIGRhdGUgd291bGQgbGFuZCB0aGUgZXhhbSBpbiBhIGRhdGUgdGhhdCdzIGV2ZW4gZnVydGhlclxuLy8gZnJvbSByZWFsaXR5IChlLmcuIENUIGRvbmUgMjAyNi8wMS8xNCwgdXBsb2FkIDIwMjYvMDIvMjQgXHUyMTkyIHVzaW5nXG4vLyB1cGxvYWQgZGF0ZSB3b3VsZCBzYXkgXCJoYWQgYSBDVCBvbiAyMDI2LzAyLzI0XCIgd2hpY2ggaXMgd3JvbmcpLlxuLy8gZnVuY19EQVRFIGF0IHdvcnN0IG1lYW5zIFwiZXhhbSBoYXBwZW5lZCBkdXJpbmcgdGhpcyBhZG1pc3Npb25cIi5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKFxuICAgIGl0ZW0ucmVhbF9JTlNQRUNUX0RBVEUgfHwgaXRlbS5yZWFsX2luc3BlY3RfZGF0ZSB8fFxuICAgIGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIsXG4gICk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChpdGVtLm9yZGVyX05BTUUgfHwgaXRlbS5vcmRlcl9uYW1lIHx8IFwiXCIpO1xuICBjb25zdCBjb25jbHVzaW9uID0gKGl0ZW0uZGVzYyB8fCBcIlwiKS50cmltKCk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSB8fCAhY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBpdGVtLm9yZGVyX0NPREUgfHwgaXRlbS5vcmRlcl9jb2RlIHx8IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgY2F0ZWdvcnk6IFwiUkFEXCIsXG4gICAgY29uY2x1c2lvbixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAvLyBOSEkgc2VwYXJhdGVzIHRoZSBleGFtIGRhdGUgKGZ1bmNfREFURSkgZnJvbSB0aGUgcmVwb3J0LXVwbG9hZFxuICAgIC8vIHRpbWVzdGFtcCAoYXNzYXlfVVBMT0FEX0RBVEUpLiBUaGUgbGF0dGVyIGlzIHdoZW4gdGhlIHJlcG9ydFxuICAgIC8vIHdhcyBmaW5hbGlzZWQgaW4gTkhJJ3Mgc3lzdGVtIFx1MjAxNCBtYXBzIHRvIERpYWdub3N0aWNSZXBvcnQuaXNzdWVkLlxuICAgIC8vIEZhbGxzIGJhY2sgdG8gTm9uZSBpZiBOSEkgZGlkbid0IHNoaXAgb25lLlxuICAgIGlzc3VlZDogcm9jVG9JU08oKGl0ZW0uYXNzYXlfVVBMT0FEX0RBVEUgfHwgXCJcIikuc3BsaXQoL1xccysvKVswXSksXG4gIH07XG59XG4iLCAiLy8gU2VydmljZSB3b3JrZXIgZm9yIE5ISS1GSElSIEJyaWRnZSBcdTIwMTQgb3ducyB0aGUgbG9uZy1ydW5uaW5nXG4vLyBcIlN5bmMgVGhpcyBQYXRpZW50XCIgd29ya2Zsb3cgc28gdGhlIHBvcHVwIGNhbiBjbG9zZSBtaWQtc3luYyB3aXRob3V0XG4vLyBhYm9ydGluZyBpdC5cbi8vXG4vLyBMaWZlY3ljbGU6XG4vLyAgIC0gcG9wdXAgcG9zdHMge3R5cGU6IFwic3RhcnROaGlBcGlTeW5jXCIsIHBheWxvYWR9ICBcdTIxOTIgTkhJIEpTT04tQVBJIHN5bmNcbi8vICAgLSBiYWNrZ3JvdW5kIHJ1bnMgdGhlIGZ1bGwgc3luYyBzZXF1ZW5jZSwgdXBkYXRpbmcgY2hyb21lLnN0b3JhZ2UubG9jYWxcbi8vICAgLSBwb3B1cCByZWFkcyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBvbiByZW9wZW4gdG8gc2hvdyBwcm9ncmVzc1xuLy9cbi8vIE1vZGVzOlxuLy8gICAtIFwibG9jYWxcIiAgIFx1MjE5MiBhZnRlciBOSEkgZmV0Y2gsIHJ1biBtYXBwZXJzIGluLWV4dGVuc2lvbiwgZG93bmxvYWQgYVxuLy8gICAgICAgICAgICAgICAgIEZISVIgQnVuZGxlIHRvIHRoZSB1c2VyJ3MgbWFjaGluZS4gTm8gYmFja2VuZCByZXF1aXJlZC5cbi8vICAgLSBcImJhY2tlbmRcIiBcdTIxOTIgUE9TVCBwZXItcGFnZV90eXBlIGl0ZW1zIHRvIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkXG4vLyAgICAgICAgICAgICAgICAgKGV4aXN0aW5nIGJlaGF2aW91cik7IGRhc2hib2FyZCArIFNNQVJUIGFwcCB1c2UgdGhlXG4vLyAgICAgICAgICAgICAgICAgYmFja2VuZCdzIEZISVIgc3RvcmUuXG5cbmltcG9ydCB7XG4gIEdST1VQX0hBTkRMRVJTLFxuICBMSVNUX0hBTkRMRVJTLFxuICBkZWR1cEFkbWlzc2lvbkRheUFtYixcbiAgZGVyaXZlUGF0aWVudElkLFxuICBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzLFxuICBtYXBQYXRpZW50LFxuICBtYXNrSWQsXG4gIG1hc2tOYW1lLFxuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyxcbn0gZnJvbSBcIkBuaGktZmhpci1icmlkZ2UvbWFwcGVyXCI7XG5pbXBvcnQge1xuICBhZGFwdEFkdWx0UHJldmVudGl2ZSxcbiAgYWRhcHRBbGxlcmd5LFxuICBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlLFxuICBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsLFxuICBhZGFwdElucGF0aWVudEVuY291bnRlcixcbiAgYWRhcHRMYWJJdGVtLFxuICBhZGFwdE1lZGljYXRpb24sXG4gIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwsXG4gIGFkYXB0UHJvY2VkdXJlLFxuICBpc29Ub1JPQyxcbiAgcGlja0VuZ2xpc2gsXG4gIHJvY1RvSVNPLFxufSBmcm9tIFwiLi9uaGktYWRhcHRlcnMuanNcIjtcblxuY29uc3QgU1RPUkFHRV9LRVkgPSBcInN5bmNTdGF0dXNcIjtcbmNvbnN0IHNsZWVwID0gKG1zKSA9PiBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBtcykpO1xuXG4vLyBDYW5jZWxsYXRpb24gZmxhZyBzZXQgYnkgcG9wdXAncyBzdG9wIGJ1dHRvbi4gQ2hlY2tlZCBhdCBzdHJhdGVnaWMgcG9pbnRzXG4vLyBpbiBydW5OaGlBcGlTeW5jIChiZXR3ZWVuIHBoYXNlcywgYmVmb3JlIGVhY2ggZGV0YWlsIHBhZ2UpIHNvIHRoZVxuLy8gaW4tcHJvZ3Jlc3Mgc3luYyBleGl0cyBwcm9tcHRseSB3aGVuIHRoZSB1c2VyIGhpdHMgU3RvcC4gQ2xlYXJlZCBhdCB0aGVcbi8vIHN0YXJ0IG9mIGVhY2ggbmV3IHN5bmMgcnVuLlxubGV0IF9jYW5jZWxsZWQgPSBmYWxzZTtcbi8vIENvbnRleHQgZm9yIHRoZSBpbi1mbGlnaHQgc3luYyBzbyB0aGUgc3RvcFN5bmMgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4vLyBkYXRhIHdpdGhvdXQgdGhlIHBvcHVwIG5lZWRpbmcgdG8gcGFzcyBpdCBiYWNrLiBTZXQgYXQgdGhlIHRvcCBvZlxuLy8gcnVuTmhpQXBpU3luYzsgY2xlYXJlZCBvbiBjb21wbGV0aW9uIChzdWNjZXNzL2ZhaWx1cmUvY2FuY2VsKS5cbmxldCBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG5jb25zdCBDQU5DRUxfRVJST1IgPSBcIl9fU1lOQ19DQU5DRUxMRURfX1wiO1xuLy8gVGhyb3duIHdoZW4gTkhJIGRldGVjdHMgdGhlIHNlc3Npb24gaGFzIGV4cGlyZWQgKGxvZ2luIHBhZ2UgcmVuZGVyZWQsIG9yXG4vLyB0YWIgcmVkaXJlY3RlZCB0byBhdXRoIG5hbWVzcGFjZSkuIEFib3J0cyBzeW5jIGltbWVkaWF0ZWx5IHNvIHRoZSB1c2VyIGNhblxuLy8gcmUtbG9naW4gYW5kIHJldHJ5IGluc3RlYWQgb2YgdGltaW5nIG91dCBvbiBldmVyeSByZW1haW5pbmcgcGFnZS5cbmNvbnN0IFNFU1NJT05fRVhQSVJFRF9FUlJPUiA9IFwiX19TRVNTSU9OX0VYUElSRURfX1wiO1xuLy8gRXJyb3JzIHRoYXQgc2hvdWxkIGFib3J0IHRoZSBlbnRpcmUgc3luYyBpbnN0ZWFkIG9mIGJlaW5nIHN3YWxsb3dlZFxuLy8gcGVyLXBoYXNlLlxuY29uc3QgQUJPUlRfRVJST1JTID0gbmV3IFNldChbQ0FOQ0VMX0VSUk9SLCBTRVNTSU9OX0VYUElSRURfRVJST1JdKTtcbmZ1bmN0aW9uIGNoZWNrQ2FuY2VsKCkge1xuICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldFN0YXR1cyhwYXJ0aWFsKSB7XG4gIC8vIEFmdGVyIGNhbmNlbGxhdGlvbiwgdGhlIHBvcHVwIGhhcyBhbHJlYWR5IHdyaXR0ZW4gdGhlIGRlZmluaXRpdmVcbiAgLy8gXCJzdG9wcGVkXCIgc3RhdHVzIFx1MjAxNCBzaWxlbmNlIGFueSBmdXJ0aGVyIHByb2dyZXNzIHdyaXRlcyBmcm9tIHRoZVxuICAvLyBpbi1mbGlnaHQgc3luYyBjb2RlIHNvIHRoZSBVSSBkb2Vzbid0IGJvdW5jZSB3aGlsZSBpdCB1bndpbmRzLlxuICBpZiAoX2NhbmNlbGxlZCkgcmV0dXJuO1xuICBjb25zdCBwcmV2ID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkpW1NUT1JBR0VfS0VZXSB8fCB7fTtcbiAgY29uc3QgbmV4dCA9IHsgLi4ucHJldiwgLi4ucGFydGlhbCwgdHM6IERhdGUubm93KCkgfTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgW1NUT1JBR0VfS0VZXTogbmV4dCB9KTtcbiAgLy8gQnJvYWRjYXN0IHRvIGFueSBvcGVuIHBvcHVwLiBJZiBubyBsaXN0ZW5lciAocG9wdXAgY2xvc2VkKSxcbiAgLy8gc2VuZE1lc3NhZ2UgcmVqZWN0cyBcdTIwMTQgc3dhbGxvdy5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcInN5bmNQcm9ncmVzc1wiLCBzdGF0dXM6IG5leHQgfSkuY2F0Y2goKCkgPT4ge30pO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTkhJIEFQSS1kaXJlY3Qgc3luYyAocGFyYWxsZWwsIG5vIExMTSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gSW5zdGVhZCBvZiBuYXZpZ2F0aW5nIHRoZSB1c2VyJ3MgdGFiIHRvIGVhY2ggTkhJIHBhZ2UsIHdhaXRpbmcgZm9yIFZ1ZSB0b1xuLy8gcmVuZGVyLCBjYXB0dXJpbmcgSFRNTCwgdGhlbiBzZW5kaW5nIGl0IHRocm91Z2ggTExNIGV4dHJhY3Rpb24sIHdlIGNhbGxcbi8vIE5ISSdzIHVuZGVybHlpbmcgSlNPTiBBUEkgZW5kcG9pbnRzIGRpcmVjdGx5LiBUaGUgXHU1MDY1XHU0RkREXHU3RjcyIFNQQSBmcm9udHMgYSBzZXRcbi8vIG9mIFJFU1QgZW5kcG9pbnRzIHVuZGVyIC9hcGkvaWhrZTMwMDAvPHBhZ2U+LyogdGhhdCByZXR1cm4gd2VsbC1mb3JtZWRcbi8vIEpTT047IGNhbGxpbmcgdGhlbSBpbiBwYXJhbGxlbCBjdXRzIGEgNS0xMCBtaW51dGUgc3luYyB0byB+MTAgc2Vjb25kcyBhbmRcbi8vIHJlbW92ZXMgdGhlIExMTSBjb3N0IGVudGlyZWx5LlxuXG5jb25zdCBOSElfSE9TVCA9IFwibXloZWFsdGhiYW5rLm5oaS5nb3YudHdcIjtcblxuXG4vLyBOSEkgSlNPTiBhZGFwdGVycyArIGRhdGUvc3RyaW5nIGhlbHBlcnMgbGl2ZSBpbiAuL25oaS1hZGFwdGVycy5qc1xuLy8gc28gdGhleSBjYW4gYmUgdW5pdC10ZXN0ZWQgaW4gaXNvbGF0aW9uIChiYWNrZ3JvdW5kLmpzIGNhbid0IGJlXG4vLyBsb2FkZWQgdW5kZXIgdml0ZXN0IFx1MjAxNCBjaHJvbWUuKiBBUElzLCBTVyBnbG9iYWxzKS4gU2VlIHRoYXQgbW9kdWxlXG4vLyBmb3IgdGhlIGZpZWxkLXByaW9yaXR5IGRlY2lzaW9ucyBwZXIgYWRhcHRlci5cblxuXG4vLyBwYWdlX3R5cGUgXHUyMTkyIGJhY2tlbmQgcGFnZV90eXBlIHN0cmluZyB1c2VkIGJ5IG1hcHBlcnMuXG4vLyBwYXRoIGlzIHJlbGF0aXZlIHRvIG5oaUJhc2UuIG1ldGhvZCBkZWZhdWx0IFwiR0VUXCIuXG4vLyBgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWVgID0gZW5kcG9pbnQgYWNjZXB0cyBzX2RhdGUgLyBlX2RhdGUgaW4gXHU2QzExXHU1NzBCIGZvcm1hdC5cbi8vIENvbmZpcm1lZCB2aWEgVVJMcyBvYnNlcnZlZCBpbiBOSEkncyBTUEEuIE90aGVyIGVuZHBvaW50cyBlaXRoZXIgZG9uJ3Rcbi8vIGFjY2VwdCByYW5nZSBwYXJhbXMsIG9yIE5ISSByZWplY3RzIHVua25vd24gcGFyYW1zIFx1MjAxNCB3ZSBsZWF2ZSB0aGVtIGFsb25lXG4vLyAodGhleSBmYWxsIGJhY2sgdG8gdGhlaXIgZGVmYXVsdCB3aW5kb3csIHR5cGljYWxseSAxLTIgeWVhcnMpLlxuLy8gVXNlci1mYWNpbmcgbGFiZWwgZm9yIGVhY2ggZW5kcG9pbnQgbmFtZS4gVGhlIGJyZWFrZG93biBjb2xsYXBzaWJsZVxuLy8gaW4gdGhlIHBvcHVwIChcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiKSByZWFkcyBmcm9tIHRoaXMgc28gdXNlcnMgc2VlIFwiXHU1QzMxXHU5MUFCIDEyIFx1N0I0NlwiXG4vLyBpbnN0ZWFkIG9mIHRoZSBkZXYtZmxhdm91cmVkIFwiZW5jb3VudGVycz0xMi8xMlwiLiBVbmtub3duIG5hbWVzIGZhbGxcbi8vIHRocm91Z2ggdG8gdGhlIHJhdyBrZXksIHdoaWNoIGtlZXBzIGl0IG9idmlvdXMgZHVyaW5nIGRldmVsb3BtZW50XG4vLyB3aGVuIHdlIGFkZCBhIG5ldyBlbmRwb2ludCBhbmQgaGF2ZW4ndCBsYWJlbGxlZCBpdCB5ZXQuXG5jb25zdCBFTkRQT0lOVF9MQUJFTF9aSCA9IHtcbiAgZW5jb3VudGVyczogXCJcdTVDMzFcdTkxQUJcIixcbiAgaW5wYXRpZW50OiBcIlx1NEY0Rlx1OTY2MlwiLFxuICBpbnBhdGllbnRfbGVnYWN5OiBcIlx1NEY0Rlx1OTY2Mlx1RkYwOFx1ODIwQVx1RkYwOVwiLFxuICBwcm9jZWR1cmVzOiBcIlx1NjI0Qlx1ODg1MyAvIFx1ODY1NVx1N0Y2RVwiLFxuICBtZWRpY2F0aW9uczogXCJcdTg2NTVcdTY1QjlcdTg1RTVcdTU0QzFcIixcbiAgYWxsZXJnaWVzOiBcIlx1ODVFNVx1NzI2OVx1OTA0RVx1NjU0RlwiLFxuICBhbGxlcmdpZXNfYjogXCJcdTg1RTVcdTcyNjlcdTkwNEVcdTY1NEZcdUZGMDhCXHVGRjA5XCIsXG4gIGFkdWx0X3ByZXZlbnRpdmU6IFwiXHU2MjEwXHU0RUJBXHU1MDY1XHU2QUEyXCIsXG4gIGNhbmNlcl9zY3JlZW5pbmc6IFwiXHU3NjRDXHU3NUM3XHU3QkU5XHU2QUEyXCIsXG4gIGltYWdpbmc6IFwiXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XCIsXG4gIG90aGVyX2xhYnM6IFwiXHU2QUEyXHU5QTU3XCIsXG59O1xuXG5jb25zdCBOSElfQVBJX0VORFBPSU5UUyA9IFtcbiAgLy8gZW5jb3VudGVycyAvIHByb2NlZHVyZXMgZG9uJ3QgaGF2ZSBhIC9zZWFyY2ggdmFyaWFudCAoNDA0KS4gcGFnZV9sb2FkXG4gIC8vIHNpbGVudGx5IGlnbm9yZXMgc19kYXRlIC8gZV9kYXRlIFx1MjAxNCB2ZXJpZmllZCB0aGUgYXJyYXkgbGVuZ3RoIGlzXG4gIC8vIGlkZW50aWNhbCB3aXRoIG9yIHdpdGhvdXQgZGF0ZXMuIERhdGUgZmlsdGVyIGlzIGVmZmVjdGl2ZWx5IHVuc3VwcG9ydGVkXG4gIC8vIGZvciB0aGVzZSBlbmRwb2ludHM7IHRoZXkgcmV0dXJuIGFsbCBkYXRhIGluIE5ISSdzIGxpZmV0aW1lIHdpbmRvdy5cbiAgLy8gRW5jb3VudGVyIHNvdXJjZTogSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkuIFRoZSAvcGFnZV9sb2FkIHZhcmlhbnRcbiAgLy8gaXMgd2luZG93LWxpbWl0ZWQgdG8gfjEgeWVhciAocmV0dXJuZWQgNTEgdmlzaXRzIGVuZGluZyAxMTQvMDUpO1xuICAvLyAvc2VhcmNoIGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGFuZCBnb2VzIGJhY2sgZnVydGhlciAoMTYyIHZpc2l0c1xuICAvLyB0byAxMTIvMDUgZm9yIHRoZSBzYW1lIHBhdGllbnQpLiBTaW5jZSBsYWJzL21lZHMgZXh0ZW5kIHRvIDN5IHZpYVxuICAvLyB0aGVpciBvd24gL3NlYXJjaCBlbmRwb2ludHMsIGVuY291bnRlciBNVVNUIGFsc28gdXNlIC9zZWFyY2ggb3JcbiAgLy8gdGhlIChob3NwaXRhbCwgZGF0ZSkgbGlua2VyIGhhcyBub3RoaW5nIHRvIG1hdGNoIGFnYWluc3QgZm9yIG9sZGVyXG4gIC8vIGxhYiBkYXRlcy5cbiAgeyBuYW1lOiBcImVuY291bnRlcnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAzczAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT1cIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElucGF0aWVudCAoXHU0RjRGXHU5NjYyKSBcdTIwMTQgSUhLRTMzMDlTMDEgaXMgdGhlIHByaW1hcnkgbGlzdCB3aXRoIGluX0RBVEUvb3V0X0RBVEVcbiAgLy8gc3Bhbi4gSUhLRTMzMDhTMDEgY2FycmllcyBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3JkcyB3aXRoIHRoZVxuICAvLyBzYW1lIGZpZWxkcyAoZnVuY19EQVRFIGluIHNvbWUgcm93cyBpbnN0ZWFkIG9mIGluX0RBVEU7IGFkYXB0ZXJcbiAgLy8gaGFuZGxlcyBib3RoKS4gQm90aCBmZWVkIHRoZSBzYW1lIGVuY291bnRlciBtYXBwZXIuXG4gIHsgbmFtZTogXCJpbnBhdGllbnRcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOXMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJpbnBhdGllbnRfbGVnYWN5XCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOHMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwMXMwNS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0UHJvY2VkdXJlIH0sXG4gIC8vIG1lZGljYXRpb25zOiBwYWdlX2xvYWQgb25seSBhY2NlcHRzIGVtcHR5IGRhdGVzIChIVFRQIDQwMCBvdGhlcndpc2UpLlxuICAvLyBUaGUgL3NlYXJjaCBlbmRwb2ludCBpcyB3aGF0IHRoZSBTUEEgaGl0cyB3aGVuIHVzZXIgcGlja3MgYSBjdXN0b21cbiAgLy8gZGF0ZSByYW5nZSBhbmQgYWNjZXB0cyBJU08gXHU4OTdGXHU1MTQzIGRhdGVzIHdpdGggZGFzaGVzICgyMDIzLTAxLTAxKS5cbiAgLy8gQ29uZmlybWVkIHZpYSBEZXZUb29scyBvYnNlcnZhdGlvbiBvZiB0aGUgXHU3QkU5XHU5MDc4IHBhbmVsIHN1Ym1pdC5cbiAgeyBuYW1lOiBcIm1lZGljYXRpb25zXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA2czAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExJnNfdHlwZT1BXCIsXG4gICAgcGFnZV90eXBlOiBcIm1lZGljYXRpb25zXCIsICAgICAgIGFkYXB0OiBhZGFwdE1lZGljYXRpb24sIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNfYlwiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwNFwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIC8vIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NVx1N0Q1MFx1Njc5QyAoSUhLRTM0MDJTMDEpOiBvbmUgcm93IHBlciBzY3JlZW5pbmcsIGNvbnRhaW5zXG4gIC8vIEJNSSAvIHZpdGFscyAvIGxpcGlkIHBhbmVsIC8gTEZUIC8gUkZUIC8gSGVwIEIvQyAvIHVyaWMgYWNpZCBhbGxcbiAgLy8gcHJlLWNvbXB1dGVkIGJ5IE5ISSdzIHNjcmVlbmluZyBwcm9ncmFtbWUuIGFkYXB0QWR1bHRQcmV2ZW50aXZlXG4gIC8vIHJldHVybnMgYW4gYXJyYXkgKG9uZSBPYnNlcnZhdGlvbiBwZXIgbWVhc3VyZW1lbnQpIHNvIHRoZVxuICAvLyBhZGFwdGVyLWNhbGwgbG9vcCBmbGF0dGVucyBpdC5cbiAgeyBuYW1lOiBcImFkdWx0X3ByZXZlbnRpdmVcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDAyczAxL1NQX0lIS0UzNDAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdEFkdWx0UHJldmVudGl2ZSB9LFxuICB7IG5hbWU6IFwiY2FuY2VyX3NjcmVlbmluZ1wiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDRzMDEvU1BfSUhLRTM0MDRTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0TGFiSXRlbSB9LFxuICAvLyBnbHVjb3NlIChJSEtFMzQwNlMwMSkgKyBsaXBpZCAoSUhLRTM0MDdTMDEpIGFyZSBzdWJzZXRzIG9mXG4gIC8vIG90aGVyX2xhYnMgKElIS0UzNDA5UzAxKSBwZXIgTkhJJ3MgZGF0YSBtb2RlbCBcdTIwMTQgZmV0Y2hpbmcgdGhlbVxuICAvLyBzZXBhcmF0ZWx5IGp1c3QgY3JlYXRlcyBkdXAgb2JzZXJ2YXRpb25zLCBzbyB3ZSBza2lwIHRoZW0uXG4gIC8vIEltYWdpbmcgbGlzdCAoSUhLRTM0MDhTMDEpIG9ubHkgY2FycmllcyBvcmRlci1sZXZlbCBkYXRhOyBmdWxsXG4gIC8vIG5hcnJhdGl2ZSByZXBvcnQgbGl2ZXMgYXQgSUhLRTM0MDhTMDIuIFdlIGRvIGEgMi1zdGVwIGZldGNoIChzZWVcbiAgLy8gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYikgdG8gZ3JhYiB0aGUgcmVwb3J0LCB0aGVuIG1hcCB0byBhIHJlYWxcbiAgLy8gRGlhZ25vc3RpY1JlcG9ydC4gVGhlIGxpc3QgYWRhcHRlciBpcyBhIG5vLW9wIHN0dWIgbGlrZSBtZWRpY2F0aW9ucy5cbiAgLy8gaW1hZ2luZzogc2VhcmNoIGVuZHBvaW50IGFjY2VwdHMgSVNPIGRhdGUgcmFuZ2UgbGlrZSBtZWRpY2F0aW9ucy5cbiAgeyBuYW1lOiBcImltYWdpbmdcIiwgICAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA4czAxL3NlYXJjaD9zX3R5cGU9JnNfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTFcIixcbiAgICBwYWdlX3R5cGU6IFwiZGlhZ25vc3RpY19yZXBvcnRzXCIsIGFkYXB0OiAoKSA9PiBudWxsLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBvdGhlcl9sYWJzIGFscmVhZHkgdXNlcyAvc2VhcmNoOyBzYW1lIElTTy1kYXNoIGRhdGUgZm9ybWF0IHdvcmtzLlxuICB7IG5hbWU6IFwib3RoZXJfbGFic1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDlzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuXTtcblxuLy8gQXBwbHkgYSB7c3RhcnQsIGVuZH0gSVNPIGRhdGUgcmFuZ2UgdG8gYW4gZW5kcG9pbnQgcGF0aDpcbi8vICAgLSBJZiBwYXRoIGFscmVhZHkgaGFzIHNfZGF0ZT0gcGxhY2Vob2xkZXJzLCBmaWxsIHRoZW0gaW4uXG4vLyAgIC0gT3RoZXJ3aXNlIGFwcGVuZCBzX2RhdGU9Li4uJmVfZGF0ZT0uLi4gdG8gdGhlIHF1ZXJ5IHN0cmluZy5cbi8vIEVuZHBvaW50cyB3aXRob3V0IGBzdXBwb3J0c0RhdGVSYW5nZWAgcGFzcyB0aHJvdWdoIHVuY2hhbmdlZC5cbmZ1bmN0aW9uIGFwcGx5RGF0ZVJhbmdlVG9QYXRoKHBhdGgsIGRhdGVSYW5nZSkge1xuICBpZiAoIWRhdGVSYW5nZSB8fCAoIWRhdGVSYW5nZS5zdGFydCAmJiAhZGF0ZVJhbmdlLmVuZCkpIHJldHVybiBwYXRoO1xuICAvLyBOSEkgZXhwZWN0cyBcdTg5N0ZcdTUxNDMgSVNPIGRhdGVzIHdpdGggZGFzaGVzOiAyMDIzLTAxLTAxIChub3QgXHU2QzExXHU1NzBCLCBub3RcbiAgLy8gc2xhc2hlcykuIENvbmZpcm1lZCBieSBvYnNlcnZpbmcgdGhlIFNQQSdzIHJlcXVlc3Qgd2hlbiB1c2VyIHBpY2tzXG4gIC8vIGEgY3VzdG9tIGRhdGUgcmFuZ2UuIFVSTC1lbmNvZGluZyB0aGUgZGFzaGVzIGlzIHVubmVjZXNzYXJ5LlxuICBjb25zdCBzID0gKGRhdGVSYW5nZS5zdGFydCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IGUgPSAoZGF0ZVJhbmdlLmVuZCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGxldCBwID0gcGF0aDtcbiAgaWYgKC9bPyZdc19kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdc19kYXRlPSlbXiZdKi8sIGAkMSR7c31gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IChwLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCIpICsgYHNfZGF0ZT0ke3N9YDtcbiAgfVxuICBpZiAoL1s/Jl1lX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1lX2RhdGU9KVteJl0qLywgYCQxJHtlfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gYCZlX2RhdGU9JHtlfWA7XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDZTMDIgZGV0YWlsIGZldGNoZXMgaW5zaWRlIHRoZSBOSEkgdGFiIHNvIGNvb2tpZXMgKyBKV1Rcbi8vIGF1dGggZmxvdyBuYXR1cmFsbHkuIFdlIHBhc3MgdGhlIHZpc2l0IGxpc3QgKGp1c3Qgcm93X0lEcyArIHRoZWlyIHBhcmVudFxuLy8gZmllbGRzIG5lZWRlZCBmb3IgYWRhcHRhdGlvbikgaW50byB0aGUgdGFiOyB0aGUgdGFiIHJldHVybnMgcGFyYWxsZWxcbi8vIGZldGNoZWQgYm9kaWVzOyB3ZSBhZGFwdCBiYWNrIGluIHRoZSBTVy5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgLy8gS2VlcCBwYXJlbnQgZmllbGRzIG5lZWRlZCBieSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsLlxuICAgICAgcGFyZW50OiB7XG4gICAgICAgIGZ1bmNfREFURTogdi5mdW5jX0RBVEUgfHwgdi5mdW5jX2RhdGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREU6IHYuaWNkOWNtX0NPREUgfHwgdi5pY2Q5Y21fY29kZSB8fCBcIlwiLFxuICAgICAgICBpY2Q5Y21fQ09ERV9DTkFNRTogdi5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2LmljZDljbV9uYW1lIHx8IFwiXCIsXG4gICAgICAgIGhvc3BfQUJCUjogdi5ob3NwX0FCQlIgfHwgdi5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAgIH0sXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTkhJIHVzZXMgZGlmZmVyZW50IGN0eXBlIHZhbHVlcyBmb3IgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIvXHU4NjU1XHU2NUI5XHU3QjhCLiBXZSBkb24ndFxuICAgICAgLy8gaGF2ZSB0aGUgcHVibGljIG1hcHBpbmcsIHNvIHRyeSBjdHlwZSAxLi40IGluIG9yZGVyIGFuZCBzdG9wIGFzXG4gICAgICAvLyBzb29uIGFzIG9uZSByZXR1cm5zIGRydWdzLiBjdHlwZT0yIGNvdmVyZWQgSUNcdTUzNjEgXHU5NTgwXHU4QTNBIGluIG91ciBzYW1wbGUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNF0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keT8uaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICAgICAgICBjb25zdCBoYXNEcnVncyA9IG1haW4uc29tZSgodikgPT5cbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodj8uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSAmJiB2LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC5sZW5ndGggPiAwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIGN0eXBlIHlpZWxkZWQgZHJ1Z3MgXHUyMDE0IHJldHVybiBsYXN0IHN1Y2Nlc3NmdWwgYm9keSBhbnl3YXkgc29cbiAgICAgICAgLy8gZGlhZ25vc3RpY3MgY2FuIHN0aWxsIHNlZSB0aGUgdmlzaXQgbWV0YWRhdGEuXG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaE9uZShyb3dJZCwgMik7XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBkcnVncyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGRydWdMaXN0ID0gQXJyYXkuaXNBcnJheSh2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpID8gdmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0IDogW107XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZHJ1Z0xpc3QpIHtcbiAgICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZCwgdmlzaXQpO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzNDA4UzAyIGRldGFpbCBmZXRjaGVzIGZvciBpbWFnaW5nIFx1MjAxNCBzYW1lIHBhdHRlcm4gYXMgdGhlXG4vLyBtZWRpY2F0aW9uIDItc3RlcC4gY3R5cGUgbWlycm9ycyB0aGUgdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICBjdHlwZTogdi5vcmlfVFlQRSB8fCB2Lm9yaV90eXBlIHx8IFwiQVwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzNDA4UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoY3R5cGUpfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCByZXBvcnRzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwodmlzaXQpO1xuICAgICAgaWYgKGFkYXB0ZWQpIHJlcG9ydHMucHVzaChhZGFwdGVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcG9ydHM7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDNTMDIgZGV0YWlsIHRvIGNsYXNzaWZ5IGVhY2ggSUhLRTMzMDNTMDEgdmlzaXQgYXNcbi8vIEFNQiAvIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRS4gVXNlcyA/cmlkPTxyb3dfSUQ+JnQ9TlxuLy8gd2hlcmUgTiBpcyB0aGUgdmlzaXQgdHlwZSBidWNrZXQ7IHdlIGRvbid0IGtub3cgdGhlIG1hcHBpbmcgYSBwcmlvcmksXG4vLyBzbyBmb3IgZWFjaCB2aXNpdCB3ZSB0cnkgdD0xLi41IHVudGlsIG9uZSByZXR1cm5zIG5vbi1lbXB0eSBtYWluX2RhdGEuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYsIGlkeCkgPT4gKHsgaWR4LCByb3dfSUQ6IHYucm9XX0lEIHx8IHYucm93X0lEIHx8IFwiXCIgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIHQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL2loa2UzMzAzczAyL3BhZ2VfbG9hZD9yaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZ0PSR7dH1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdG0gPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBGb3IgZWFjaCB2aXNpdCwgZmluZCB0aGUgYHRgIHRoYXQgcmV0dXJucyBub24tZW1wdHkgZGF0YS4gTkhJXG4gICAgICAvLyB1c2VzIHQ9MSBmb3Igb3V0cGF0aWVudCBcdTg5N0ZcdTkxQUIsIHQ9MiBtYXliZSBcdTYwMjVcdThBM0EvXHU0RTJEXHU5MUFCLCB0PTMgXHU0RjRGXHU5NjYyLFxuICAgICAgLy8gdD00IFx1NzI1OVx1OTFBQlx1MjAyNiBkb24ndCBoYXZlIGFuIGF1dGhvcml0YXRpdmUgbWFwcGluZyBzbyB3ZSBwcm9iZS5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgWzEsIDIsIDMsIDQsIDVdKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCB0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSAoci5ib2R5Py5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiB7IGJvZHk6IHIuYm9keSwgdCB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGJvZHk6IG51bGwgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIC8vIFBhaXIgZWFjaCBkZXRhaWwgYm9keSBiYWNrIHRvIGl0cyB2aXNpdCBwb3NpdGlvbi5cbiAgY29uc3QgYnlJZHggPSBuZXcgTWFwKCk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxcy5sZW5ndGg7IGkrKykge1xuICAgIGJ5SWR4LnNldChyZXFzW2ldLmlkeCwgcmVzdWx0c1tpXT8uYm9keSB8fCBudWxsKTtcbiAgfVxuICByZXR1cm4gYnlJZHg7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0Zyb21TMDJEZXRhaWwoYm9keSkge1xuICBpZiAoIWJvZHkpIHJldHVybiBudWxsO1xuICBjb25zdCBtYWluID0gKGJvZHkuaWhrZTMzMDNTMDJfbWFpbl9kYXRhKSB8fCBbXTtcbiAgaWYgKG1haW4ubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdG4gPSBTdHJpbmcobWFpblswXS5ob3NwX0RBVEFfVFlQRV9OQU1FIHx8IFwiXCIpO1xuICBpZiAodG4uaW5jbHVkZXMoXCJcdTYwMjVcIikpIHJldHVybiBcIkVNRVJcIjsgIC8vIFx1NjAyNVx1OEEzQVxuICBpZiAodG4uaW5jbHVkZXMoXCJcdTRGNEZcdTk2NjJcIikpIHJldHVybiBcIklNUFwiO1xuICAvLyBcdTg5N0ZcdTkxQUIgLyBcdTRFMkRcdTkxQUIgLyBcdTcyNTlcdTkxQUIgLyBcdTg1RTVcdTVDNDAgYWxsIGRlZmF1bHQgdG8gQU1CXG4gIHJldHVybiBcIkFNQlwiO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgcGF0aWVudE92ZXJyaWRlKSB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBwYWdlX3R5cGUsXG4gICAgICBob3N0OiBOSElfSE9TVCxcbiAgICAgIGl0ZW1zLFxuICAgICAgcGF0aWVudF9vdmVycmlkZTogcGF0aWVudE92ZXJyaWRlIHx8IG51bGwsXG4gICAgfSksXG4gIH0pO1xuICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcihgUE9TVCB1cGxvYWQtc3RydWN0dXJlZCAke3Iuc3RhdHVzfTogJHsoYXdhaXQgci50ZXh0KCkpLnNsaWNlKDAsIDIwMCl9YCk7XG4gIHJldHVybiBhd2FpdCByLmpzb24oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExvY2FsIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gUnVucyB0aGUgc2FtZSBtYXBwZXJzIHRoZSBiYWNrZW5kIHJ1bnMsIHRoZW4gdHJpZ2dlcnMgYSBkb3dubG9hZCBvZiB0aGVcbi8vIHJlc3VsdGluZyBGSElSIEJ1bmRsZS4gTm90aGluZyBsZWF2ZXMgdGhlIHVzZXIncyBtYWNoaW5lOyBubyBiYWNrZW5kXG4vLyByZXF1aXJlZC4gTWlycm9ycyBiYWNrZW5kL3VwbG9hZC1zdHJ1Y3R1cmVkIG9yZGVyOiBlbmNvdW50ZXJzIGZpcnN0IHNvXG4vLyB0aGF0IGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMgY2FuIGF0dGFjaCByZWZlcmVuY2VzIHRvIGRvd25zdHJlYW1cbi8vIG9ic2VydmF0aW9ucy9tZWRpY2F0aW9ucy9ldGMuXG5cbmNvbnN0IF9MT0NBTF9QQUdFX1RZUEVfT1JERVIgPSBbXG4gIFwiZW5jb3VudGVyc1wiLFxuICBcIm9ic2VydmF0aW9uc1wiLFxuICBcIm1lZGljYXRpb25zXCIsXG4gIFwiY29uZGl0aW9uc1wiLFxuICBcImFsbGVyZ2llc1wiLFxuICBcImRpYWdub3N0aWNfcmVwb3J0c1wiLFxuICBcInByb2NlZHVyZXNcIixcbl07XG5cbi8vIENoZWFwIHByZS1mbGlnaHQ6IGRvZXMgdGhpcyBOSEkgdGFiIGhhdmUgYW4gYXV0aGVudGljYXRlZCBzZXNzaW9uP1xuLy8gVXNlcyB0aGUgc2FtZSBzZXNzaW9uU3RvcmFnZS50b2tlbiArIGxpZ2h0d2VpZ2h0IEFQSSBjYWxsIHBhdHRlcm4gYXNcbi8vIF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaS4gRG9lc24ndCByZXR1cm4gYW55dGhpbmcgUElJIFx1MjAxNCBqdXN0IGFcbi8vIGJvb2xlYW4gZm9yIHRoZSBwb3B1cCB0byBkZWNpZGUgd2hldGhlciB0byBzdXJmYWNlIGEgXCJsb2cgaW4gZmlyc3RcIlxuLy8gYmFubmVyLiBSZXR1cm5zIG51bGwgd2hlbiB3ZSBjYW4ndCB0ZWxsIChzY3JpcHQtaW5qZWN0aW9uIGJsb2NrZWQsXG4vLyB0aW1lb3V0LCBldGMuKSBzbyB0aGUgcG9wdXAgY2FuIGZhbGwgYmFjayB0byBcImVuYWJsZWRcIiByYXRoZXIgdGhhblxuLy8gc2NhcmluZyB0aGUgdXNlciB3aXRoIGEgZmFsc2UgbmVnYXRpdmUuXG5hc3luYyBmdW5jdGlvbiBfY2hlY2tOaGlMb2dpblN0YXRlKHRhYklkKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTYW1lIGVuZHBvaW50IGFzIHRoZSBjaWQgYXV0by1mZXRjaCBcdTIwMTQga25vd24gdG8gbmVlZCBhblxuICAgICAgICAgIC8vIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbiBhbmQgdG8gYmUgY2hlYXAuXG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKFwiL2FwaS9paGtlMzAwMC9paGtlMzQxMHMwMS9wYWdlX2xvYWRcIiwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIiwgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3R9YCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIDQwMS80MDMgXHUyMTkyIHNlc3Npb24gdG9rZW4gcmVqZWN0ZWQuIDIwMCBcdTIxOTIgbG9nZ2VkIGluLlxuICAgICAgICAgIHJldHVybiByLm9rO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHR5cGVvZiByZXN1bHQgPT09IFwiYm9vbGVhblwiID8gcmVzdWx0IDogbnVsbDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBlbmRwb2ludCBJSEtFMzQxMFMwMSAoXHU2MjExXHU2M0E1XHU3QTJFXHU3RDAwXHU5MzA0IC8gQ09WSUQgXHU3QkU5XHU2QUEyXHU3RDAwXHU5MzA0KSBoYXBwZW5zXG4vLyB0byBjYXJyeSB0aGUgbG9nZ2VkLWluIHVzZXIncyByZWFsIGNpdGl6ZW4gSUQgaW4gdGhlIHJlc3BvbnNlIChgY2lkYFxuLy8gZmllbGQsIGUuZy4gXCJQMTIzNDUwODY2XCIpLiBVc2UgaXQgdG8gZmlsbCB0aGUgcGF0aWVudF9vdmVycmlkZSdzXG4vLyBpZF9ubyB3aGVuIHRoZSB1c2VyIGxlZnQgaXQgYmxhbmsgXHUyMDE0IHRoYXQgd2F5IHRoZXkgZG9uJ3QgaGF2ZSB0byB0eXBlXG4vLyB0aGVpciBvd24gXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIGp1c3QgdG8gc2VlZCBGSElSJ3MgUGF0aWVudC5pZC5cbi8vXG4vLyBBdXRvLXJlcGxhY2UgcG9saWN5OiBvbmx5IGZpbGwgd2hlbiB0aGUgb3ZlcnJpZGUgaWRfbm8gaXMgbWlzc2luZyBvclxuLy8gaXMgc3RpbGwgYW4gXCJhdXRvLVhYWFhYWFhYXCIgcGxhY2Vob2xkZXIgZ2VuZXJhdGVkIGJ5IGFuIGVhcmxpZXIgc2F2ZS5cbi8vIEFueXRoaW5nIGVsc2UgKGUuZy4gdXNlciBtYW51YWxseSB0eXBlZCBhIGZha2UgSUQgZm9yIHNjcmVlbi1zaGFyZVxuLy8gb3IgZ3JvdXBpbmcpIGlzIHJlc3BlY3RlZCBhcy1pcy5cbmFzeW5jIGZ1bmN0aW9uIF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaSh0YWJJZCwgcGF0aWVudE92ZXJyaWRlKSB7XG4gIGNvbnN0IGN1cnJlbnQgPSBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIjtcbiAgY29uc3QgaXNQbGFjZWhvbGRlciA9ICFjdXJyZW50IHx8IGN1cnJlbnQuc3RhcnRzV2l0aChcImF1dG8tXCIpO1xuICBpZiAoIWlzUGxhY2Vob2xkZXIpIHJldHVybiBwYXRpZW50T3ZlcnJpZGU7XG5cbiAgbGV0IGNpZCA9IG51bGw7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXQpIHJldHVybiBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MTBzMDEvcGFnZV9sb2FkXCIsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0fWAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiBudWxsO1xuICAgICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICByZXR1cm4gYm9keT8uY2lkIHx8IG51bGw7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIFZhbGlkYXRlIGl0IGxvb2tzIGxpa2UgYSBUYWl3YW4gbmF0aW9uYWwgSUQgKDEgbGV0dGVyICsgOSBkaWdpdHMpXG4gICAgLy8gYmVmb3JlIHRydXN0aW5nIGl0LiBBdm9pZHMgYWNjaWRlbnRhbGx5IHByb21vdGluZyBnYXJiYWdlIHRvIHRoZVxuICAgIC8vIFBhdGllbnQgcmVzb3VyY2UncyB1bmlxdWUga2V5LlxuICAgIGlmIChyZXN1bHQgJiYgL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHJlc3VsdCkpIGNpZCA9IHJlc3VsdDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gSUhLRTM0MTAgY2lkIGZldGNoIGZhaWxlZDpcIiwgZT8ubWVzc2FnZSA/PyBlKTtcbiAgfVxuXG4gIGlmIChjaWQgJiYgY2lkICE9PSBjdXJyZW50KSB7XG4gICAgcGF0aWVudE92ZXJyaWRlID0geyAuLi5wYXRpZW50T3ZlcnJpZGUsIGlkX25vOiBjaWQgfTtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwYXRpZW50T3ZlcnJpZGUgfSkuY2F0Y2goKCkgPT4ge30pO1xuICB9XG4gIHJldHVybiBwYXRpZW50T3ZlcnJpZGU7XG59XG5cbi8vIFJlYWQgdGhlIG1hc2stbmFtZSBwcmVmZXJlbmNlIGZyZXNoIGZyb20gc3RvcmFnZS4gV2UgZG9uJ3QgY2FjaGUgXHUyMDE0XG4vLyBydW5OaGlBcGlTeW5jIGlzIGludm9rZWQgYXQgbW9zdCBhIGZldyB0aW1lcyBwZXIgc2Vzc2lvbiBhbmQgdGhlIFNXXG4vLyBjYW4gYmUgdG9ybiBkb3duICsgcmVzdGFydGVkIGFueSB0aW1lLCBzbyBhIHNpbmdsZSBnZXQoKSBwZXIgc3luYyBpc1xuLy8gY2hlYXBlciB0aGFuIHN5bmNpbmcgc3RhdGUgYWNyb3NzIFNXIGxpZmVjeWNsZXMuXG5hc3luYyBmdW5jdGlvbiBfaXNNYXNrRW5hYmxlZCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IG1hc2tOYW1lRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwibWFza05hbWVFbmFibGVkXCIpO1xuICAgIHJldHVybiBtYXNrTmFtZUVuYWJsZWQgPT09IHRydWU7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYnVpbGRPdmVycmlkZVBhdGllbnQob3YsIG1hc2tFbmFibGVkKSB7XG4gIGNvbnN0IGRpc3BsYXlOYW1lID0gbWFza0VuYWJsZWQgPyBtYXNrTmFtZShvdi5uYW1lIHx8IFwiXCIpIDogb3YubmFtZSB8fCBcIlwiO1xuICBjb25zdCByYXcgPSB7XG4gICAgaWQ6IG92LmlkX25vLFxuICAgIGlkZW50aWZpZXI6IG92LmlkX25vLFxuICAgIG5hbWU6IGRpc3BsYXlOYW1lIHx8IG92LmlkX25vLFxuICB9O1xuICBpZiAob3YuYmlydGhfZGF0ZSkgcmF3LmJpcnRoRGF0ZSA9IG92LmJpcnRoX2RhdGU7XG4gIGlmIChvdi5nZW5kZXIpIHJhdy5nZW5kZXIgPSBvdi5nZW5kZXI7XG4gIHJldHVybiBtYXBQYXRpZW50KHJhdyk7XG59XG5cbi8vIFdhbGsgYSBKU09OLWxpa2UgdmFsdWUgYW5kIHJlcGxhY2UgZXZlcnkgc3RyaW5nIHRva2VuIGVxdWFsIHRvIG9yXG4vLyBjb250YWluaW5nIGBuZWVkbGVgIHdpdGggYHJlcGxhY2VtZW50YC4gVXNlZCB0byBzY3J1YiB0aGUgcmVhbFxuLy8gcGF0aWVudCBuYW1lIG91dCBvZiBOSEkgbmFycmF0aXZlIGZpZWxkcyAoY2xpbmljYWxfbm90ZSwgY29uY2x1c2lvbixcbi8vIG5vdGUsIGV0Yy4pIGJlZm9yZSB0aGUgaXRlbXMgcmVhY2ggdGhlIG1hcHBlci4gT25seSB0cmlnZ2VyZWQgd2hlblxuLy8gdGhlIHVzZXIgaGFzIG9wdGVkIGludG8gbWFza2luZyBBTkQgc3VwcGxpZWQgYSBuYW1lIFx1MjAxNCBhbmQgdGhlXG4vLyBzdWJzdGl0dXRpb24gaXMgZXhhY3QtdG9rZW4tcmVwbGFjZSwgbm90IGZ1enp5LCBzbyBpdCBjYW4ndCBzdXJwcmlzZVxuLy8gdGhlIHVzZXIgYnkgY2xvYmJlcmluZyB1bnJlbGF0ZWQgY29udGVudC5cbmZ1bmN0aW9uIF9yZXBsYWNlTmFtZURlZXAodmFsdWUsIG5lZWRsZSwgcmVwbGFjZW1lbnQpIHtcbiAgaWYgKCFuZWVkbGUgfHwgbmVlZGxlID09PSByZXBsYWNlbWVudCkgcmV0dXJuIHZhbHVlO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsdWUuc3BsaXQobmVlZGxlKS5qb2luKHJlcGxhY2VtZW50KTtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gdmFsdWUubWFwKCh2KSA9PiBfcmVwbGFjZU5hbWVEZWVwKHYsIG5lZWRsZSwgcmVwbGFjZW1lbnQpKTtcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiB2YWx1ZSkgb3V0W2tdID0gX3JlcGxhY2VOYW1lRGVlcCh2YWx1ZVtrXSwgbmVlZGxlLCByZXBsYWNlbWVudCk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIF9hc3NlbWJsZUxvY2FsQnVuZGxlKGJ5VHlwZSwgcGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCkge1xuICBjb25zdCBwYXRpZW50ID0gX2J1aWxkT3ZlcnJpZGVQYXRpZW50KHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpO1xuICBjb25zdCBwaWQgPSBwYXRpZW50LmlkO1xuICBjb25zdCBhbGwgPSBbcGF0aWVudF07XG5cbiAgZm9yIChjb25zdCBwdCBvZiBfTE9DQUxfUEFHRV9UWVBFX09SREVSKSB7XG4gICAgY29uc3QgaXRlbXMgPSBieVR5cGVbcHRdO1xuICAgIGlmICghaXRlbXMgfHwgaXRlbXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBsZXQgbWFwcGVkO1xuICAgIGlmIChHUk9VUF9IQU5ETEVSU1twdF0pIHtcbiAgICAgIG1hcHBlZCA9IEdST1VQX0hBTkRMRVJTW3B0XShpdGVtcywgcGlkKTtcbiAgICB9IGVsc2UgaWYgKExJU1RfSEFORExFUlNbcHRdKSB7XG4gICAgICBjb25zdCBbZm5dID0gTElTVF9IQU5ETEVSU1twdF07XG4gICAgICBtYXBwZWQgPSBpdGVtc1xuICAgICAgICAuZmlsdGVyKChpdCkgPT4gaXQgJiYgdHlwZW9mIGl0ID09PSBcIm9iamVjdFwiKVxuICAgICAgICAubWFwKChpdCkgPT4gZm4oaXQsIHBpZCkpXG4gICAgICAgIC5maWx0ZXIoKHIpID0+IHIgIT09IG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHB0ID09PSBcImVuY291bnRlcnNcIikgbWFwcGVkID0gZGVkdXBBZG1pc3Npb25EYXlBbWIobWFwcGVkKTtcbiAgICBhbGwucHVzaCguLi5tYXBwZWQpO1xuICB9XG5cbiAgLy8gRGVkdXAgYnkgKHJlc291cmNlVHlwZSwgaWQpIGJlZm9yZSBhc3NlbWJsaW5nIHRoZSBCdW5kbGUuIE11bHRpcGxlXG4gIC8vIE5ISSBlbmRwb2ludHMgY2FuIGZlZWQgdGhlIHNhbWUgcGFnZV90eXBlIChlLmcuIGVuY291bnRlcnMgL1xuICAvLyBpbnBhdGllbnQgLyBpbnBhdGllbnRfbGVnYWN5IGFsbCBcdTIxOTIgcGFnZV90eXBlPVwiZW5jb3VudGVyc1wiKSwgYW5kIHRoZVxuICAvLyBtYXBwZXIgcHJvZHVjZXMgZGV0ZXJtaW5pc3RpYyBzdGFibGUgSURzIFx1MjAxNCBzbyB0d28gcmF3IGl0ZW1zIHRoYXRcbiAgLy8gZGVzY3JpYmUgdGhlIHNhbWUgbWVkaWNhbCBldmVudCBjb2xsYXBzZSB0byBvbmUgcmVzb3VyY2UuIEJhY2tlbmRcbiAgLy8gdXBzZXJ0IGhhbmRsZXMgdGhpcyBhdXRvbWF0aWNhbGx5IChzYW1lIHN0YWJsZSBJRCA9IHNhbWUgREIgcm93KTtcbiAgLy8gbG9jYWwgbW9kZSBoYXMgdG8gZG8gaXQgZXhwbGljaXRseS4gV2l0aG91dCB0aGlzIGRlZHVwLCB0aGUgbG9jYWxcbiAgLy8gQnVuZGxlIGVuZHMgdXAgaW5mbGF0ZWQgcmVsYXRpdmUgdG8gd2hhdCBiYWNrZW5kIHN0b3JlcyBmcm9tIHRoZVxuICAvLyBpZGVudGljYWwgTkhJIGlucHV0LlxuICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICBjb25zdCB1bmlxdWUgPSBbXTtcbiAgZm9yIChjb25zdCByIG9mIGFsbCkge1xuICAgIGNvbnN0IGtleSA9IGAke3IucmVzb3VyY2VUeXBlfS8ke3IuaWR9YDtcbiAgICBpZiAoc2Vlbi5oYXMoa2V5KSkgY29udGludWU7XG4gICAgc2Vlbi5hZGQoa2V5KTtcbiAgICB1bmlxdWUucHVzaChyKTtcbiAgfVxuXG4gIC8vIExpbmtlciArIHNleC1zdHJhdGlmaWVkIHJlc29sdmVyIHJ1biBvbmNlIG92ZXIgdGhlIGZ1bGwgYXNzZW1ibGVkXG4gIC8vIGxpc3QgKHNhbWUgcGlwZWxpbmUgYmFja2VuZCdzIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkIHJ1bnMsIGp1c3RcbiAgLy8gYWdhaW5zdCBhbiBpbi1tZW1vcnkgY2FuZGlkYXRlIGFycmF5IGluc3RlYWQgb2YgYSBTUUxpdGUgcXVlcnkpLlxuICBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzKHVuaXF1ZSwgdW5pcXVlKTtcbiAgcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMocGF0aWVudCwgdW5pcXVlKTtcblxuICByZXR1cm4ge1xuICAgIHJlc291cmNlVHlwZTogXCJCdW5kbGVcIixcbiAgICB0eXBlOiBcImNvbGxlY3Rpb25cIixcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9cXC5cXGQrWiQvLCBcIlpcIiksXG4gICAgZW50cnk6IHVuaXF1ZS5tYXAoKHIpID0+ICh7XG4gICAgICBmdWxsVXJsOiBgJHtyLnJlc291cmNlVHlwZX0vJHtyLmlkfWAsXG4gICAgICByZXNvdXJjZTogcixcbiAgICB9KSksXG4gIH07XG59XG5cbi8vIExvY2FsIG1vZGUgc3Rhc2hlcyB0aGUgYXNzZW1ibGVkIEJ1bmRsZSBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlclxuLy8gYSBzaW5nbGUgXCJwZW5kaW5nRmhpckJ1bmRsZVwiIHNsb3QuIFRoZSBwb3B1cCBzaG93cyBhIGRvd25sb2FkIGJ1dHRvblxuLy8gd2hlbiB0aGlzIHNsb3QgaXMgbm9uLWVtcHR5OyB0aGUgYWN0dWFsIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgY2FsbFxuLy8gaGFwcGVucyBmcm9tIHRoZSBwb3B1cCAoaW4gcmVzcG9uc2UgdG8gYSB1c2VyIGNsaWNrKSBzbyB0aGUgZmlsZVxuLy8gZG9lc24ndCBhcHBlYXIgaW4gdGhlIERvd25sb2FkcyBiYXIgdW5pbnZpdGVkLlxuLy9cbi8vIFNpbmdsZSBzbG90IG1lYW5zIGEgbmV3IHN5bmMgb3ZlcndyaXRlcyB0aGUgcHJldmlvdXMgcGVuZGluZyBidW5kbGUuXG4vLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBkZWZhdWx0IHF1b3RhIGlzIDEwIE1COyBhIHR5cGljYWwgTkhJIHN5bmMgaXNcbi8vIHdlbGwgdW5kZXIgMiBNQi5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcblxuYXN5bmMgZnVuY3Rpb24gX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRJZCwgZGF0ZVJhbmdlKSB7XG4gIC8vIEZpbGVuYW1lOiBuaGkte3BpZH0te3N0YXJ0WVlZWU1NRER9LXtlbmRZWVlZTU1ERH0uanNvblxuICAvLyBXaGVuIG5vIGV4cGxpY2l0IGRhdGVSYW5nZSAoTkhJIGRlZmF1bHQgPSBcdThGRDEgMSBcdTVFNzQpLCBzeW50aGVzaXplIHRvZGF5LTF5IFx1MjE5MiB0b2RheS5cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gIGNvbnN0IGZtdCA9IChkKSA9PiBgJHtkLmdldEZ1bGxZZWFyKCl9JHtwYWQoZC5nZXRNb250aCgpICsgMSl9JHtwYWQoZC5nZXREYXRlKCkpfWA7XG4gIC8vIEhhbGYtbWFzayB0aGUgSUQgaW4gdGhlIGZpbGVuYW1lIHNvIHRoZSB1c2VyJ3MgRG93bmxvYWRzIGZvbGRlclxuICAvLyBkb2Vzbid0IGxlYWsgdGhlIGZ1bGwgXHU4RUFCXHU1MjA2XHU4QjQ5ICh3b3VsZCBiZSB2aXNpYmxlIHRvIGFueW9uZSBzZWVpbmdcbiAgLy8gYSBmaWxlIGxpc3Rpbmcgb3IgZG93bmxvYWQtYmFyIHByZXZpZXcpLiBgWGAgYmVjYXVzZSBgKmAgaXNcbiAgLy8gaW52YWxpZCBpbiBXaW5kb3dzIHBhdGhzLiBCdW5kbGUgQ09OVEVOVFMgc3RpbGwgY2FycnkgdGhlIHJlYWxcbiAgLy8gSUQgdW5kZXIgUGF0aWVudC5pZCBcdTIwMTQgZmlsZSBvd25lciBrbm93cyB3aG9zZSBkYXRhIGl0IGlzLlxuICBjb25zdCBtYXNrZWRQaWQgPSBtYXNrSWQocGF0aWVudElkIHx8IFwidW5rbm93blwiLCBcIlhcIik7XG4gIGNvbnN0IHNhZmVQaWQgPSBtYXNrZWRQaWQucmVwbGFjZSgvW15BLVphLXowLTlfLV0vZywgXCJfXCIpO1xuICBjb25zdCBjb21wYWN0ID0gKGQpID0+IChkIHx8IFwiXCIpLnNsaWNlKDAsIDEwKS5yZXBsYWNlKC8tL2csIFwiXCIpO1xuICBsZXQgcywgZTtcbiAgaWYgKGRhdGVSYW5nZSAmJiAoZGF0ZVJhbmdlLnN0YXJ0IHx8IGRhdGVSYW5nZS5lbmQpKSB7XG4gICAgcyA9IGNvbXBhY3QoZGF0ZVJhbmdlLnN0YXJ0KSB8fCBmbXQobm93KTtcbiAgICBlID0gY29tcGFjdChkYXRlUmFuZ2UuZW5kKSB8fCBmbXQobm93KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvbmVZZWFyQWdvID0gbmV3IERhdGUobm93KTtcbiAgICBvbmVZZWFyQWdvLnNldEZ1bGxZZWFyKG9uZVllYXJBZ28uZ2V0RnVsbFllYXIoKSAtIDEpO1xuICAgIHMgPSBmbXQob25lWWVhckFnbyk7XG4gICAgZSA9IGZtdChub3cpO1xuICB9XG4gIGNvbnN0IGZpbGVuYW1lID0gYG5oaS0ke3NhZmVQaWR9LSR7c30tJHtlfS5qc29uYDtcbiAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KGJ1bmRsZSwgbnVsbCwgMik7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgW1BFTkRJTkdfQlVORExFX0tFWV06IHtcbiAgICAgIGZpbGVuYW1lLFxuICAgICAganNvbixcbiAgICAgIGJ5dGVzOiBqc29uLmxlbmd0aCxcbiAgICAgIGdlbmVyYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgcGF0aWVudElkOiBwYXRpZW50SWQgfHwgbnVsbCxcbiAgICB9LFxuICB9KTtcbiAgcmV0dXJuIHsgZmlsZW5hbWUsIGJ5dGVzOiBqc29uLmxlbmd0aCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBydW5OaGlBcGlTeW5jKHsgdGFiSWQsIG1vZGUsIGJhY2tlbmQsIHN5bmNBcGlLZXksIG5oaUJhc2UsIHBhdGllbnRPdmVycmlkZSwgZGF0ZVJhbmdlLCBkYXRlUmFuZ2VMYWJlbCB9KSB7XG4gIF9jYW5jZWxsZWQgPSBmYWxzZTtcbiAgY29uc3QgQkFTRSA9IG5oaUJhc2UgfHwgYGh0dHBzOi8vJHtOSElfSE9TVH1gO1xuXG4gIGlmICghcGF0aWVudE92ZXJyaWRlKSB7XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdThBQ0JcdTUxNDhcdTU3MjggcG9wdXAgXHU1ODZCXHU1QkVCXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XHU1RjhDXHU1MThEXHU4QTY2XCIsXG4gICAgICAgIHBoYXNlOiBcImVycm9yXCIsIHRzOiBEYXRlLm5vdygpLCBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIXRhYklkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQVBJIHN5bmMgcmVxdWlyZXMgTkhJIHRhYiBpZCAoY29va2llcyBhcmUgZmlyc3QtcGFydHkpXCIpO1xuICB9XG5cbiAgLy8gRmlyc3QgY2hhbmNlIHRvIHVwZ3JhZGUgdGhlIHBhdGllbnQgSUQ6IGlmIHRoZSBwb3B1cCBnYXZlIHVzIGFuXG4gIC8vIFwiYXV0by1YWFhYWFhYWFwiIHBsYWNlaG9sZGVyICh1c2VyIGRpZG4ndCBtYW51YWxseSB0eXBlIG9uZSksXG4gIC8vIGZldGNoIHRoZSByZWFsIG9uZSBmcm9tIE5ISSdzIElIS0UzNDEwUzAxIGVuZHBvaW50IChyZXNwb25zZS5jaWRcbiAgLy8gaXMgdGhlIGNpdGl6ZW4gSUQpLiBQZXJzaXN0IGJhY2sgdG8gc3RvcmFnZSBzbyBzdWJzZXF1ZW50IHN5bmNzXG4gIC8vIGFyZSBzdGFibGUuIE1hbnVhbGx5LXR5cGVkIElEcyBhcmUgcmVzcGVjdGVkIGFzLWlzLlxuICBwYXRpZW50T3ZlcnJpZGUgPSBhd2FpdCBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSk7XG5cbiAgLy8gU3Rhc2ggY29udGV4dCBzbyB0aGUgc3RvcFN5bmMgbWVzc2FnZSBoYW5kbGVyIGNhbiB3aXBlIHBhcnRpYWxcbiAgLy8gZGF0YSAoREVMRVRFIC9zeW5jL3BhdGllbnQve2lkX25vfSkgd2l0aG91dCB1cyBoYXZpbmcgdG8gc2VuZCBpdFxuICAvLyBiYWNrIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UuXG4gIF9hY3RpdmVTeW5jQ3R4ID0geyBiYWNrZW5kLCBzeW5jQXBpS2V5LCBwYXRpZW50SWQ6IHBhdGllbnRPdmVycmlkZS5pZF9ubyB9O1xuXG4gIC8vIFdhbGwtY2xvY2sgc3RhcnQgdGltZSBcdTIwMTQgdXNlZCB0byBjb21wdXRlIGVsYXBzZWQgc2Vjb25kcyBmb3IgdGhlXG4gIC8vIGZpbmFsIHN0YXR1cyBsaW5lIChcIlx1N0UzRFx1ODAxN1x1NjY0MiAxMi4zIFx1NzlEMlwiKS4gU3Rhc2ggb24gYSBsb2NhbCBzbyB3ZSBjYW5cbiAgLy8gcmVhY2ggaXQgZnJvbSB0aGUgY29tcGxldGlvbiBtZXNzYWdlIGF0IHRoZSB2ZXJ5IGVuZC5cbiAgY29uc3QgX3QwID0gRGF0ZS5ub3coKTtcbiAgLy8gUGVyLXBoYXNlIHRpbWluZ3MsIHN1cmZhY2VkIGludG8gdGhlIHBvcHVwJ3MgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIiBzbyB0aGUgdXNlclxuICAvLyBjYW4gc2VlIGV4YWN0bHkgd2hlcmUgdGltZSBpcyBnb2luZy4gRWFjaCBlbnRyeTogeyBuYW1lLCBtcyB9LlxuICBjb25zdCBfcGhhc2VzID0gW107XG4gIGxldCBfcGhhc2VTdGFydCA9IF90MDtcbiAgY29uc3QgX21hcmtQaGFzZSA9IChuYW1lKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBfcGhhc2VzLnB1c2goeyBuYW1lLCBtczogbm93IC0gX3BoYXNlU3RhcnQgfSk7XG4gICAgX3BoYXNlU3RhcnQgPSBub3c7XG4gIH07XG4gIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgcnVubmluZzogdHJ1ZSwgcHJvZ3Jlc3M6IFwiXHVEODNEXHVERTgwIFx1OTU4Qlx1NTlDQlx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MjAyNlwiLCBwaGFzZTogXCJpbml0XCIsXG4gICAgc3RhcnRlZDogX3QwLCB0b3RhbFJlc291cmNlczogMCwgaG9zdDogTkhJX0hPU1QsIGVycm9yczogW10sXG4gIH0pO1xuXG4gIC8vIFN0ZXAgMTogZmV0Y2ggYWxsIGVuZHBvaW50cyBpbiBQQVJBTExFTCBpbnNpZGUgdGhlIE5ISSB0YWIuIFJ1bm5pbmcgaW5cbiAgLy8gdGFiIGNvbnRleHQgbWVhbnMgc2FtZS1vcmlnaW4gY29va2llcyBhcmUgc2VudCBhdXRvbWF0aWNhbGx5IFx1MjAxNCBmZXRjaFxuICAvLyBmcm9tIHRoZSBTVyB3b3VsZCBiZSBjcm9zcy1vcmlnaW4gYW5kIFNhbWVTaXRlIGJsb2NrcyB0aGUgc2Vzc2lvblxuICAvLyBjb29raWUsIGhlbmNlIHdlIGdvdCBcInNlc3Npb24gZXhwaXJlZFwiIGV2ZW4gd2hlbiBsb2dnZWQgaW4uXG4gIC8vIFBhc3Mgb25seSBzZXJpYWxpc2FibGUgZGF0YSAocGF0aHMsIG1ldGhvZCwgbmFtZSk7IGFkYXB0ZXJzIHN0YXkgaW4gU1cuXG4gIC8vIEluamVjdCBJU08tZGF0ZSByYW5nZSBpbnRvIGVhY2ggZW5kcG9pbnQgdGhhdCBzdXBwb3J0cyBpdCAoY29udmVydHNcbiAgLy8gdG8gXHU2QzExXHU1NzBCIGZvcm1hdCB2aWEgaXNvVG9ST0MpLiBTa2lwcGVkIGVuZHBvaW50cyBrZWVwIHRoZWlyIGRlZmF1bHRcbiAgLy8gTkhJLXNpZGUgd2luZG93ICgxLTIgeWVhcnMgZGVwZW5kaW5nIG9uIHRoZSBwYWdlKS5cbiAgY29uc3QgZmV0Y2hTcGVjID0gTkhJX0FQSV9FTkRQT0lOVFMubWFwKChlcCkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSBlcC5zdXBwb3J0c0RhdGVSYW5nZSA/IGFwcGx5RGF0ZVJhbmdlVG9QYXRoKGVwLnBhdGgsIGRhdGVSYW5nZSkgOiBlcC5wYXRoO1xuICAgIHJldHVybiB7IG5hbWU6IGVwLm5hbWUsIHVybDogQkFTRSArIHBhdGgsIG1ldGhvZDogXCJHRVRcIiB9O1xuICB9KTtcbiAgaWYgKGRhdGVSYW5nZSAmJiAoZGF0ZVJhbmdlLnN0YXJ0IHx8IGRhdGVSYW5nZS5lbmQpKSB7XG4gICAgY29uc29sZS5sb2coXCJbTkhJIEFQSSBzeW5jXSBkYXRlIHJhbmdlOlwiLFxuICAgICAgYCR7ZGF0ZVJhbmdlLnN0YXJ0IHx8IFwiKHVuYm91bmRlZClcIn0gXHUyMTkyICR7ZGF0ZVJhbmdlLmVuZCB8fCBcIih1bmJvdW5kZWQpXCJ9YCk7XG4gIH1cblxuICBsZXQgc2V0dGxlZFJhdztcbiAgdHJ5IHtcbiAgICBbeyByZXN1bHQ6IHNldHRsZWRSYXcgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiBhc3luYyAoc3BlY3MpID0+IHtcbiAgICAgICAgLy8gTkhJIGF1dGg6IGNvb2tpZXMgKyBKV1QgaW4gc2Vzc2lvblN0b3JhZ2UuIFRoZSBTUEEncyBheGlvcyBzZXRzXG4gICAgICAgIC8vIGBBdXRob3JpemF0aW9uOiBCZWFyZXIgPHRva2VuPmAgb24gZXZlcnkgQVBJIGNhbGwuIFNlc3Npb25cbiAgICAgICAgLy8gY29va2llcyBhbG9uZSByZXR1cm4gNDAxLlxuICAgICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIFt7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH1dO1xuICAgICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG5cbiAgICAgICAgLy8gRGV0ZWN0IElETEUvdGltZW91dCBwYWdlIGFscmVhZHkgcmVkaXJlY3RlZCBvbiB0aGlzIHRhYi5cbiAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICAgIHJldHVybiBbeyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDYwLXNlY29uZCB0aW1lb3V0IHBlciBmZXRjaCBcdTIwMTQgc29tZSBOSEkgZW5kcG9pbnRzIChlbmNvdW50ZXJzLFxuICAgICAgICAvLyBtZWRzKSB0YWtlIDIwKyBzZWNvbmRzLlxuICAgICAgICBhc3luYyBmdW5jdGlvbiBmZXRjaE9uZShzLCBtcykge1xuICAgICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCBtcyk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChzLnVybCwge1xuICAgICAgICAgICAgICBtZXRob2Q6IHMubWV0aG9kLFxuICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgICBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGNvbnN0IGN0ID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykge1xuICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgICAgaWYgKCFjdC5pbmNsdWRlcyhcImFwcGxpY2F0aW9uL2pzb25cIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogYG5vbi1KU09OIChjdD0ke2N0fSlgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgYm9keTtcbiAgICAgICAgICAgIHRyeSB7IGJvZHkgPSBhd2FpdCByLmpzb24oKTsgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHsgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJKU09OIHBhcnNlOiBcIiArIGUubWVzc2FnZSB9OyB9XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGJvZHkgfTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgaWYgKGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIpIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwidGltZW91dCA2MHNcIiB9O1xuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb25jdXJyZW5jeS1saW1pdGVkIGV4ZWN1dGlvbjogbWF4IDMgaW4gZmxpZ2h0IGF0IG9uY2UuIE5ISSdzXG4gICAgICAgIC8vIGFidXNlIGRldGVjdGlvbiBibG9ja3MgYnVyc3RzOyB3aXRoIDExIHBhcmFsbGVsIGZldGNoZXMgaXRcbiAgICAgICAgLy8gdGhyb3R0bGVkIHRoZSBzZXNzaW9uIGFuZCByZWRpcmVjdGVkIHRvIElIS0UzMDAxUzk5X0lETEUuXG4gICAgICAgIC8vIDMgYXQgYSB0aW1lICsgMjAwbXMgaml0dGVyIGlzIGdlbnRsZSBlbm91Z2ggZm9yIDEtc2hvdCBzeW5jLlxuICAgICAgICBjb25zdCBDT05DVVJSRU5DWSA9IDM7XG4gICAgICAgIGNvbnN0IEpJVFRFUl9NUyA9IDIwMDtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IG5ldyBBcnJheShzcGVjcy5sZW5ndGgpO1xuICAgICAgICBsZXQgbmV4dElkeCA9IDA7XG4gICAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgICB3aGlsZSAobmV4dElkeCA8IHNwZWNzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgaSA9IG5leHRJZHgrKztcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHIgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogSklUVEVSX01TKSk7XG4gICAgICAgICAgICByZXN1bHRzW2ldID0gYXdhaXQgZmV0Y2hPbmUoc3BlY3NbaV0sIDYwMDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd29ya2VycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkNVUlJFTkNZICYmIHcgPCBzcGVjcy5sZW5ndGg7IHcrKykge1xuICAgICAgICAgIHdvcmtlcnMucHVzaCh3b3JrZXIoKSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod29ya2Vycyk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSxcbiAgICAgIGFyZ3M6IFtmZXRjaFNwZWNdLFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBleGVjdXRlU2NyaXB0IGZhaWxlZDogJHtlLm1lc3NhZ2V9YCk7XG4gIH1cblxuICAvLyBEZXRlY3Qgc2Vzc2lvbiBleHBpcmVkIGFjcm9zcyByZXN1bHRzLlxuICBpZiAoc2V0dGxlZFJhdy5zb21lKChyKSA9PiByLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICB9XG5cbiAgY29uc3QgZXJyb3JzID0gW107XG5cbiAgLy8gR2VuZXJpYyBsaXN0IGV4dHJhY3Rpb246IGhhbmRsZXMgYWxsIG9ic2VydmVkIE5ISSBzaGFwZXMuXG4gIC8vICAgLSBQbGFpbiBhcnJheSAoSUhLRTM0MDkgbGFiKVxuICAvLyAgIC0ge3NwX0lIS0U8WD5fZGF0YTogWy4uLl19ICAobWVkaWNhdGlvbnMsIGFsbGVyZ2llcylcbiAgLy8gICAtIHt3ZXN0ZXJuX2RhdGEsIGNoaW5lc2VfZGF0YSwgZGVudGlzdF9kYXRhOiBbLi4uXX0gKGVuY291bnRlciBsaXN0LFxuICAvLyAgICAgc3BsaXQgYnkgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIgXHUyMDE0IHdlIHdhbnQgYWxsIHRocmVlKVxuICAvLyBGb3IgbXVsdGktYXJyYXkgc2hhcGVzIHdlIG1lcmdlIGFsbCBhcnJheXMgYW5kIHRhZyBlYWNoIGl0ZW0gd2l0aFxuICAvLyBgX19zZWN0aW9uYCAodGhlIHNvdXJjZSBrZXkpIHNvIGFkYXB0ZXJzIGNhbiBkaXNhbWJpZ3VhdGUuXG4gIGZ1bmN0aW9uIGV4dHJhY3RMaXN0KGJvZHkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShib2R5KSkgcmV0dXJuIGJvZHk7XG4gICAgaWYgKCFib2R5IHx8IHR5cGVvZiBib2R5ICE9PSBcIm9iamVjdFwiKSByZXR1cm4gW107XG4gICAgbGV0IGFycmF5S2V5cyA9IE9iamVjdC5lbnRyaWVzKGJvZHkpLmZpbHRlcigoW18sIHZdKSA9PiBBcnJheS5pc0FycmF5KHYpKTtcbiAgICBpZiAoYXJyYXlLZXlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgIGlmIChhcnJheUtleXMubGVuZ3RoID09PSAxKSByZXR1cm4gYXJyYXlLZXlzWzBdWzFdO1xuICAgIC8vIE11bHRpcGxlIGFycmF5cyBcdTIwMTQgZHJvcCBVSS1oZWxwZXIgYXJyYXlzIChkcm9wZG93biBvcHRpb25zLCBzb3J0XG4gICAgLy8gc2VsZWN0b3JzLCBsb29rdXAgdGFibGVzKS4gTkhJIG1peGVzIHRoZW0gaW50byB0aGUgc2FtZSByZXNwb25zZVxuICAgIC8vIChlLmcuIGltYWdpbmcgcmV0dXJucyBzcF9JSEtFMzQwOFMwMV9kYXRhICsgaWNkOWNtX3NlbGVjdCkuXG4gICAgY29uc3QgSEVMUEVSX1JFID0gL3NlbGVjdHxvcHRpb258ZHJvcGRvd258ZmlsdGVyfHNvcnR8bG9va3VwL2k7XG4gICAgY29uc3QgZGF0YUtleXMgPSBhcnJheUtleXMuZmlsdGVyKChba10pID0+ICFIRUxQRVJfUkUudGVzdChrKSk7XG4gICAgaWYgKGRhdGFLZXlzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGRhdGFLZXlzWzBdWzFdO1xuICAgIGlmIChkYXRhS2V5cy5sZW5ndGggPT09IDApIHJldHVybiBhcnJheUtleXNbMF1bMV07IC8vIGZhbGxiYWNrXG4gICAgYXJyYXlLZXlzID0gZGF0YUtleXM7XG4gICAgLy8gTXVsdGlwbGUgZGF0YSBhcnJheXMgKGUuZy4gd2VzdGVybl9kYXRhL2NoaW5lc2VfZGF0YS9kZW50aXN0X2RhdGEpXG4gICAgLy8gXHUyMDE0IG1lcmdlIHdpdGggX19zZWN0aW9uIHRhZyBzbyBhZGFwdGVycyBjYW4gZGlzYW1iaWd1YXRlLlxuICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIGFycmF5S2V5cykge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHYpIHtcbiAgICAgICAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICBtZXJnZWQucHVzaCh7IC4uLml0ZW0sIF9fc2VjdGlvbjogayB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXJnZWQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkO1xuICB9XG5cbiAgLy8gQXBwbHkgU1ctc2lkZSBhZGFwdGVycyB0byBlYWNoIGVuZHBvaW50J3MgYm9keS5cbiAgY29uc3Qgc2V0dGxlZCA9IHNldHRsZWRSYXcubWFwKChyLCBpKSA9PiB7XG4gICAgY29uc3QgZXAgPSBOSElfQVBJX0VORFBPSU5UU1tpXTtcbiAgICBpZiAoci5lcnJvcikge1xuICAgICAgcmV0dXJuIHsgc3RhdHVzOiBcInJlamVjdGVkXCIsIHJlYXNvbjogeyBtZXNzYWdlOiBgJHtlcC5uYW1lfTogJHtyLmVycm9yfWAgfSB9O1xuICAgIH1cbiAgICBjb25zdCBsaXN0ID0gZXh0cmFjdExpc3Qoci5ib2R5KTtcbiAgICAvLyBBZGFwdGVycyByZXR1cm4gZWl0aGVyOlxuICAgIC8vICAgLSBvbmUgaXRlbSAgIChtb3N0IGFkYXB0ZXJzIFx1MjAxNCBsYWJzLCBtZWRzLCBlbmNvdW50ZXJzLCBpbWFnaW5nKVxuICAgIC8vICAgLSBudWxsL3VuZGVmaW5lZCAoc2tpcClcbiAgICAvLyAgIC0gYXJyYXkgb2YgaXRlbXMgKGFkYXB0QWR1bHRQcmV2ZW50aXZlIFx1MjAxNCB1bmZvbGRzIG9uZSBzY3JlZW5pbmdcbiAgICAvLyAgICAgcm93IGludG8gfjE1IE9ic2VydmF0aW9uIGVudHJpZXMpXG4gICAgLy8gRmxhdC1oYW5kbGUgYm90aCBzaGFwZXMgc28gZWFjaCBhZGFwdGVyIGNhbiBwaWNrIHdoYXRldmVyJ3MgY2xlYXJlc3QuXG4gICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGxpc3QpIHtcbiAgICAgIGNvbnN0IHIgPSBlcC5hZGFwdChpdCk7XG4gICAgICBpZiAociA9PT0gbnVsbCB8fCByID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocikpIHtcbiAgICAgICAgZm9yIChjb25zdCB4IG9mIHIpIGlmICh4KSBpdGVtcy5wdXNoKHgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbXMucHVzaChyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gU25hcHNob3QgYSBib2R5IHNhbXBsZSBmb3Igc2hhcGVzIHdoZXJlIGFkYXB0ZXIgcmVqZWN0ZWQgZXZlcnl0aGluZ1xuICAgIC8vIFx1MjAxNCB1c2VkIGJ5IHRoZSBkaWFnbm9zdGljIGJyZWFrZG93biBpbiBzdGVwIDIuXG4gICAgbGV0IGJvZHlTYW1wbGUgPSBudWxsO1xuICAgIGlmIChsaXN0Lmxlbmd0aCA+IDAgJiYgaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBJbmNsdWRlIHRoZSBGSVJTVCBJVEVNIChmdWxsIGtleXMrdmFsdWVzKSBzbyB3ZSBjYW4gYnVpbGQgdGhlXG4gICAgICAvLyBjb3JyZWN0IGFkYXB0ZXIgd2l0aG91dCBhbm90aGVyIHJvdW5kLXRyaXAuIE5ISSBpdGVtcyBtYXkgaW5jbHVkZVxuICAgICAgLy8gUElJOyB0aGUgdXNlciBpbnNwZWN0cyB0aGlzIGxvY2FsbHkgdmlhIHNlcnZpY2Utd29ya2VyIGRldnRvb2xzLlxuICAgICAgYm9keVNhbXBsZSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdG9wTGV2ZWxLZXlzOiBBcnJheS5pc0FycmF5KHIuYm9keSkgPyBudWxsIDogT2JqZWN0LmtleXMoci5ib2R5IHx8IHt9KS5zbGljZSgwLCAxMCksXG4gICAgICAgIHdhc0FycmF5OiBBcnJheS5pc0FycmF5KHIuYm9keSksXG4gICAgICAgIGZpcnN0SXRlbTogbGlzdFswXSA/PyBudWxsLFxuICAgICAgICBzZWNvbmRJdGVtOiBsaXN0WzFdID8/IG51bGwsXG4gICAgICB9KS5zbGljZSgwLCA0MDAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc3RhdHVzOiBcImZ1bGZpbGxlZFwiLCB2YWx1ZTogeyBlcCwgaXRlbXMsIHJhd19jb3VudDogbGlzdC5sZW5ndGgsIGJvZHlTYW1wbGUsIHJhd0xpc3Q6IGxpc3QgfSB9O1xuICB9KTtcblxuICBfbWFya1BoYXNlKFwibmhpLXBhcmFsbGVsXCIpO1xuXG4gIC8vIFN0ZXAgMWE6IGVuY291bnRlciBkZXRhaWwgZmFuLW91dCAoSUhLRTMzMDNTMDIpIFx1MjE5MiBjbGFzc2lmeSBlYWNoXG4gIC8vIElIS0UzMzAzUzAxIHZpc2l0IGFzIEFNQiAvIEVNRVIgLyBJTVAgdmlhIGhvc3BfREFUQV9UWVBFX05BTUUuXG4gIC8vIExpc3QgZW5kcG9pbnQgZG9lc24ndCBleHBvc2UgXHU2MDI1XHU4QTNBIGRpc3RpbmN0aW9uOyBkZXRhaWwgZG9lcy4gV2UgcmUtXG4gIC8vIGFkYXB0IGVhY2ggZW5jb3VudGVyIGl0ZW0gd2l0aCB0aGUgZGlzY292ZXJlZCBjbGFzcyBiZWZvcmUgdGhlXG4gIC8vIGJhY2tlbmQgdXBsb2FkIHN0ZXAuXG4gIGNvbnN0IGVuY0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcImVuY291bnRlcnNcIik7XG4gIGlmIChlbmNJZHggPj0gMCAmJiBzZXR0bGVkW2VuY0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtlbmNJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTVDMzFcdTkxQUJcdTdEMDBcdTkzMDRcdThBNzNcdTYwQzVcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkZXRhaWxNYXAgPSBhd2FpdCBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBSZS1hZGFwdCB3aXRoIGNsYXNzSGludCBmcm9tIGRldGFpbDsgZmFsbCBiYWNrIHRvIEFNQi5cbiAgICAgICAgY29uc3QgcmVBZGFwdGVkID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlzaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZGV0YWlsID0gZGV0YWlsTWFwPy5nZXQoaSkgfHwgbnVsbDtcbiAgICAgICAgICBjb25zdCBjbHMgPSBfY2xhc3NGcm9tUzAyRGV0YWlsKGRldGFpbCkgfHwgXCJBTUJcIjtcbiAgICAgICAgICBjb25zdCBpdCA9IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UodmlzaXRzW2ldLCBjbHMpO1xuICAgICAgICAgIGlmIChpdCkgcmVBZGFwdGVkLnB1c2goaXQpO1xuICAgICAgICB9XG4gICAgICAgIHNldHRsZWRbZW5jSWR4XS52YWx1ZS5pdGVtcyA9IHJlQWRhcHRlZDtcbiAgICAgICAgc2V0dGxlZFtlbmNJZHhdLnZhbHVlLnJhd19jb3VudCA9IHJlQWRhcHRlZC5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBlbmNvdW50ZXIgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImVuY291bnRlci1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAxYjogbWVkaWNhdGlvbnMgbmVlZCBhIDItc3RlcCBmZXRjaCBcdTIwMTQgSUhLRTMzMDZTMDEgb25seSByZXR1cm5zXG4gIC8vIHZpc2l0IG1ldGFkYXRhIChkYXRlLCBJQ0QsIGhvc3BpdGFsKSwgbm8gZHJ1ZyBuYW1lcy4gRHJ1Z3MgbGl2ZSBhdFxuICAvLyBJSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD08cm93X0lEPiZjdHlwZT0yIHVuZGVyXG4gIC8vIGloa2UzMzA2UzAyX21haW5fZGF0YVsqXS5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QuIEZhbiBvdXQgZGV0YWlsXG4gIC8vIGZldGNoZXMgaW5zaWRlIHRoZSBzYW1lIHRhYiBjb250ZXh0IChjb29raWVzICsgSldUKSwga2VlcGluZ1xuICAvLyBjb25jdXJyZW5jeSBsaW1pdGVkIHNvIE5ISSBkb2Vzbid0IElETEUtcmVkaXJlY3QgdXMuXG4gIC8vIFN0ZXAgMWM6IGltYWdpbmcgbmVlZHMgSUhLRTM0MDhTMDIgZm9yIHRoZSBhY3R1YWwgcmVwb3J0IG5hcnJhdGl2ZS5cbiAgLy8gTGlzdCBlbmRwb2ludCBvbmx5IGhhcyBvcmRlciBtZXRhZGF0YTsgY3R5cGUgcGFyYW0gbWlycm9ycyB0aGVcbiAgLy8gdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuICBjb25zdCBpbWdJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJpbWFnaW5nXCIpO1xuICBpZiAoaW1nSWR4ID49IDAgJiYgc2V0dGxlZFtpbWdJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbaW1nSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XHU1ODMxXHU1NDRBXHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVwb3J0cyA9IGF3YWl0IF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUuaXRlbXMgPSByZXBvcnRzO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVwb3J0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGltYWdpbmcgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImltYWdpbmctZGV0YWlsXCIpO1xuXG4gIGNvbnN0IG1lZElkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcIm1lZGljYXRpb25zXCIpO1xuICBpZiAobWVkSWR4ID49IDAgJiYgc2V0dGxlZFttZWRJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU3NTI4XHU4NUU1XHU2NjBFXHU3RDMwXHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZHJ1Z0l0ZW1zID0gYXdhaXQgX2ZldGNoTWVkaWNhdGlvbkRldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS5pdGVtcyA9IGRydWdJdGVtcztcbiAgICAgICAgLy8gcmF3X2NvdW50IG5vdyByZWZsZWN0cyB0aGUgKmRydWctbGV2ZWwqIGNvdW50IGZvciB0aGUgYnJlYWtkb3duXG4gICAgICAgIC8vICh2aXNpdHMgXHUyMTkyIGRydWdzKS4gS2VlcCB0aGUgdmlzaXQgY291bnQgaW4gYSBzaWRlIGZpZWxkIGZvciBkZWJ1Zy5cbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUucmF3X2NvdW50ID0gZHJ1Z0l0ZW1zLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYG1lZGljYXRpb25zIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJtZWRpY2F0aW9uLWRldGFpbFwiKTtcblxuICAvLyBTdGVwIDI6IGFnZ3JlZ2F0ZSBpdGVtcyBieSBwYWdlX3R5cGUsIFBPU1QgdG8gYmFja2VuZC5cbiAgY29uc3QgYnlUeXBlID0ge307XG4gIGxldCByYXdfdG90YWwgPSAwO1xuICBsZXQgYWRhcHRlZF90b3RhbCA9IDA7XG4gIC8vIFBlci1lbmRwb2ludCBicmVha2Rvd24gc28gdGhlIGZpbmFsIHN0YXR1cyBjYW4gdGVsbCB1c2VyIGV4YWN0bHlcbiAgLy8gd2hpY2ggZW5kcG9pbnRzIGNhbWUgYmFjayBlbXB0eSAvIG1pcy1zaGFwZWQgXHUyMDE0IG11Y2ggbW9yZSB1c2VmdWwgdGhhblxuICAvLyBhIHNpbmdsZSBhZ2dyZWdhdGVkIG51bWJlci5cbiAgLy8gQnJlYWtkb3duIHNob3duIHRvIHRoZSB1c2VyIHVuZGVyIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIuIFVzZSB0aGUgQ2hpbmVzZSBsYWJlbFxuICAvLyB3aGVuIGtub3duOyBvbmx5IGZhbGwgYmFjayB0byB0aGUgcmF3IGVuZHBvaW50IG5hbWUgZm9yIHVubWFwcGVkXG4gIC8vIChuZXdseSBhZGRlZCkgZW5kcG9pbnRzLiBFbXB0eS1yZXN1bHQgZW5kcG9pbnRzIGFyZSBvbWl0dGVkIGZyb21cbiAgLy8gdGhlIHN1Y2Nlc3Mgc3VtbWFyeSBlbnRpcmVseSBcdTIwMTQgdGhleSBhZGQgbm9pc2UuIEVycm9ycyBhbHdheXMgc2hvd1xuICAvLyBzbyB0aGUgdXNlciBrbm93cyBzb21ldGhpbmcgZGlkbid0IGNvbWUgdGhyb3VnaC5cbiAgY29uc3QgYnJlYWtkb3duID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0dGxlZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGVwID0gTkhJX0FQSV9FTkRQT0lOVFNbaV07XG4gICAgY29uc3QgcyA9IHNldHRsZWRbaV07XG4gICAgY29uc3QgbGFiZWwgPSBFTkRQT0lOVF9MQUJFTF9aSFtlcC5uYW1lXSA/PyBlcC5uYW1lO1xuICAgIGlmIChzLnN0YXR1cyA9PT0gXCJyZWplY3RlZFwiKSB7XG4gICAgICBlcnJvcnMucHVzaChgJHtlcC5uYW1lfTogJHtzLnJlYXNvbi5tZXNzYWdlfWApO1xuICAgICAgYnJlYWtkb3duLnB1c2goYFx1Mjc0QyAke2xhYmVsfVx1RkYxQVx1NTNENlx1NUY5N1x1NTkzMVx1NjU1N2ApO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHsgaXRlbXMsIHJhd19jb3VudCB9ID0gcy52YWx1ZTtcbiAgICByYXdfdG90YWwgKz0gcmF3X2NvdW50O1xuICAgIGFkYXB0ZWRfdG90YWwgKz0gaXRlbXMubGVuZ3RoO1xuICAgIGlmIChyYXdfY291bnQgPT09IDApIGNvbnRpbnVlOyAvLyBub3RoaW5nIHRvIHNob3dcbiAgICBpZiAoaXRlbXMubGVuZ3RoID4gcmF3X2NvdW50ICYmIHJhd19jb3VudCA+IDApIHtcbiAgICAgIC8vIDEtdG8tbWFueSBhZGFwdGVyIChlLmcuIGFkdWx0X3ByZXZlbnRpdmU6IG9uZSBzY3JlZW5pbmcgcm93IFx1MjE5MlxuICAgICAgLy8gfjE4IE9ic2VydmF0aW9ucykuIFNob3cgYm90aCBudW1iZXJzIHNvIHRoZSB1c2VyIHVuZGVyc3RhbmRzXG4gICAgICAvLyB3aHkgb25lIHJlY29yZCBwcm9kdWNlZCBtYW55LlxuICAgICAgYnJlYWtkb3duLnB1c2goYCR7bGFiZWx9XHVGRjFBJHtyYXdfY291bnR9IFx1N0I0NiBcdTIxOTIgJHtpdGVtcy5sZW5ndGh9IFx1OTgwNWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVha2Rvd24ucHVzaChgJHtsYWJlbH1cdUZGMUEke2l0ZW1zLmxlbmd0aH0gXHU3QjQ2YCk7XG4gICAgfVxuICAgIC8vIFNhdmUgYm9keSBzYW1wbGUgZm9yIGZpcnN0IGVuZHBvaW50IHdpdGggcmF3PjAgYnV0IGFkYXB0ZWQ9MCAoYWRhcHRlclxuICAgIC8vIG1pc21hdGNoKSBzbyB3ZSBjYW4gaXRlcmF0ZS4gU3RvcmVkIHVuZGVyIGNocm9tZS5zdG9yYWdlLmxvY2FsIGZvclxuICAgIC8vIGluc3BlY3Rpb24gdmlhIHNlcnZpY2Ugd29ya2VyIERldlRvb2xzLlxuICAgIGlmIChyYXdfY291bnQgPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICBbYF9fc2FtcGxlQm9keV8ke2VwLm5hbWV9YF06IHMudmFsdWUuYm9keVNhbXBsZSB8fCBcIm4vYVwiLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2gge31cbiAgICB9XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgKGJ5VHlwZVtlcC5wYWdlX3R5cGVdID0gYnlUeXBlW2VwLnBhZ2VfdHlwZV0gfHwgW10pLnB1c2goLi4uaXRlbXMpO1xuICB9XG5cbiAgLy8gTWFzayBnYXRlIGlzIHJlYWQgZnJlc2ggcGVyIHN5bmMgXHUyMDE0IGRlZmF1bHRzIE9GRiBwZXIgdGhlIGRpc2N1c3Npb25cbiAgLy8gKGNpdGl6ZW4tc2VsZi1kb3dubG9hZCBkb2Vzbid0IG5lZWQgYW5vbnltaXphdGlvbikuIFdoZW4gT04sIGFsc29cbiAgLy8gc2NydWIgdGhlIHVzZXIncyByZWFsIG5hbWUgb3V0IG9mIGFueSBOSEkgbmFycmF0aXZlIGZpZWxkIGJlZm9yZVxuICAvLyBpdCBmbG93cyBpbnRvIHRoZSBtYXBwZXIuXG4gIGNvbnN0IG1hc2tFbmFibGVkID0gYXdhaXQgX2lzTWFza0VuYWJsZWQoKTtcbiAgaWYgKG1hc2tFbmFibGVkICYmIHBhdGllbnRPdmVycmlkZS5uYW1lKSB7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoYnlUeXBlKSkge1xuICAgICAgYnlUeXBlW2tleV0gPSBfcmVwbGFjZU5hbWVEZWVwKGJ5VHlwZVtrZXldLCBwYXRpZW50T3ZlcnJpZGUubmFtZSwgcmVwbGFjZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIGxldCB0b3RhbCA9IDA7XG4gIGxldCBfbG9jYWxGaWxlbmFtZSA9IG51bGw7XG4gIGlmIChtb2RlID09PSBcImxvY2FsXCIpIHtcbiAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNFXHVEREVDIFx1OEY0OVx1NjNEQlx1NzBCQVx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1NkE5NFx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogMCB9KTtcbiAgICBsZXQgYnVuZGxlO1xuICAgIHRyeSB7XG4gICAgICBidW5kbGUgPSBfYXNzZW1ibGVMb2NhbEJ1bmRsZShieVR5cGUsIHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9ycy5wdXNoKGBsb2NhbCBtYXBwaW5nOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIGJ1bmRsZSA9IG51bGw7XG4gICAgfVxuICAgIGlmIChidW5kbGUpIHtcbiAgICAgIHRvdGFsID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBgXHVEODNEXHVEQ0JFIFx1NkU5Nlx1NTA5OSAke3RvdGFsfSBcdTdCNDYgRkhJUiBcdThDQzdcdTZFOTBcdTIwMjZgLCB0b3RhbFJlc291cmNlczogdG90YWwgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkbCA9IGF3YWl0IF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sIGRhdGVSYW5nZSk7XG4gICAgICAgIF9sb2NhbEZpbGVuYW1lID0gZGwuZmlsZW5hbWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBzdGFzaCBidW5kbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBCdWlsZCB0aGUgb3ZlcnJpZGUgd2Ugc2VuZCB0byBiYWNrZW5kIHdpdGggdGhlIG1heWJlLW1hc2tlZCBuYW1lXG4gICAgLy8gc28gYmFja2VuZCdzIGF1dG8tY3JlYXRlZCBQYXRpZW50ICsgdGhlIHBlci1pdGVtIHN1YmplY3QuZGlzcGxheVxuICAgIC8vIHNlZSB0aGUgc2FtZSB2YWx1ZSB0aGUgdXNlciBvcHRlZCBpbnRvLiBJdGVtcyB0aGVtc2VsdmVzIHdlcmVcbiAgICAvLyBhbHJlYWR5IHNjcnViYmVkIGFib3ZlIChieVR5cGUgcGFzcyksIHNvIHRoaXMganVzdCBjb3ZlcnMgdGhlXG4gICAgLy8gb3ZlcnJpZGUtZGVyaXZlZCBQYXRpZW50LlxuICAgIGNvbnN0IHVwbG9hZE92ZXJyaWRlID0gbWFza0VuYWJsZWQgJiYgcGF0aWVudE92ZXJyaWRlLm5hbWVcbiAgICAgID8geyAuLi5wYXRpZW50T3ZlcnJpZGUsIG5hbWU6IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lKSB9XG4gICAgICA6IHBhdGllbnRPdmVycmlkZTtcbiAgICBmb3IgKGNvbnN0IFtwYWdlX3R5cGUsIGl0ZW1zXSBvZiBPYmplY3QuZW50cmllcyhieVR5cGUpKSB7XG4gICAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1MkIwNlx1RkUwRiBcdTRFMEFcdTUwQjMgJHtwYWdlX3R5cGV9XHVGRjA4JHtpdGVtcy5sZW5ndGh9IFx1N0I0Nlx1RkYwOVx1MjAyNmAsXG4gICAgICAgIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IF9wb3N0U3RydWN0dXJlZChiYWNrZW5kLCBwYWdlX3R5cGUsIGl0ZW1zLCBzeW5jQXBpS2V5LCB1cGxvYWRPdmVycmlkZSk7XG4gICAgICAgIHRvdGFsICs9IGRhdGEuY291bnQgfHwgMDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYHVwbG9hZCAke3BhZ2VfdHlwZX06ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFmdGVyIGJhY2tlbmQgdXBsb2FkLCBhbHNvIGZldGNoIGEgc25hcHNob3Qgb2YgdGhlIHBhdGllbnQncyBmdWxsXG4gICAgLy8gY3VtdWxhdGl2ZSBGSElSIEJ1bmRsZSBhbmQgc3Rhc2ggaXQgZm9yIHRoZSBwb3B1cCdzIFwiXHVEODNEXHVEQ0U1IFx1NEUwQlx1OEYwOVwiIGJ1dHRvbi5cbiAgICAvLyBUaGlzIGlzIHdoYXQgYC9maGlyL2V4cG9ydGAgcmV0dXJucyBcdTIwMTQgdGhlIGJhY2tlbmQncyBjb21wbGV0ZSB2aWV3XG4gICAgLy8gb2YgdGhpcyBwYXRpZW50ICh0aGlzIHN5bmMgKyBhbnkgcHJpb3Igc3luY3MpLCBhcyBvcHBvc2VkIHRvIGxvY2FsXG4gICAgLy8gbW9kZSdzIFwianVzdCB0aGlzIHN5bmNcIiBidW5kbGUuXG4gICAgLy9cbiAgICAvLyBTa2lwIHN0YXNoaW5nIGVudGlyZWx5IHdoZW4gdGhlIHVwbG9hZCBwYXNzIHByb2R1Y2VkIG5vIHJlc291cmNlc1xuICAgIC8vIFx1MjAxNCBleHBvcnRpbmcgMCBlbnRyaWVzIHRoZW4gc3Rhc2hpbmcgdGhlbSBjcmVhdGVzIGEgbWlzbGVhZGluZ1xuICAgIC8vIFwiXHU2NzJDXHU1NzMwIFx1MjcxMyAwIFx1N0I0NlwiIGluZGljYXRvciBhbmQgYSB1c2VsZXNzIFx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjMgYnV0dG9uLlxuICAgIGlmIChwYXRpZW50T3ZlcnJpZGUuaWRfbm8gJiYgdG90YWwgPiAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogXCJcdUQ4M0RcdURDRTYgXHU1M0Q2XHU1Rjk3XHU1RjhDXHU3QUVGXHU1QjhDXHU2NTc0XHU4Q0M3XHU2NTk5XHUyMDI2XCIsIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCB9KTtcbiAgICAgICAgLy8gQmFja2VuZCBzdG9yZXMgUGF0aWVudCB1bmRlciBkZXJpdmVQYXRpZW50SWQocmF3SWQpLCBzbyB0aGVcbiAgICAgICAgLy8gZXhwb3J0IGZpbHRlciBtdXN0IHVzZSB0aGUgaGFzaGVkIGZvcm0gXHUyMDE0IHF1ZXJ5aW5nIHdpdGggdGhlXG4gICAgICAgIC8vIHJhdyBuYXRpb25hbCBJRCBtYXRjaGVzIHplcm8gcm93cyBldmVuIHdoZW4gZGF0YSBpcyB0aGVyZS5cbiAgICAgICAgY29uc3QgZmhpclBpZCA9IGRlcml2ZVBhdGllbnRJZChwYXRpZW50T3ZlcnJpZGUuaWRfbm8pO1xuICAgICAgICBjb25zdCBleHBVcmwgPSBgJHtiYWNrZW5kfS9maGlyL2V4cG9ydD9wYXRpZW50PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWA7XG4gICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChleHBVcmwsIHtcbiAgICAgICAgICBoZWFkZXJzOiBzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9LFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHIub2spIHtcbiAgICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAvLyBQYXNzIHRoZSBzYW1lIGRhdGVSYW5nZSB0aGUgdXNlciBwaWNrZWQgdGhyb3VnaCBzbyB0aGVcbiAgICAgICAgICAvLyBkb3dubG9hZGVkIGZpbGVuYW1lIHJlZmxlY3RzIFwiXHU2NzAwXHU4RkQxIDMgXHU1RTc0XCIgXHUyMTkyIDIwMjMtMjAyNiBpbnN0ZWFkXG4gICAgICAgICAgLy8gb2YgYWx3YXlzIHN5bnRoZXNpemluZyB0b2RheS0xeSBcdTIxOTIgdG9kYXkuXG4gICAgICAgICAgY29uc3QgZGwgPSBhd2FpdCBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudE92ZXJyaWRlLmlkX25vLCBkYXRlUmFuZ2UpO1xuICAgICAgICAgIF9sb2NhbEZpbGVuYW1lID0gZGwuZmlsZW5hbWU7XG4gICAgICAgICAgLy8gQWxpZ24gcmVwb3J0ZWQgY291bnQgd2l0aCBsb2NhbCBtb2RlOiBidW5kbGUuZW50cnkubGVuZ3RoXG4gICAgICAgICAgLy8gaW5jbHVkZXMgdGhlIFBhdGllbnQgcmVzb3VyY2UgKHdoaWNoIHRoZSBwZXItcGFnZS10eXBlIFBPU1RcbiAgICAgICAgICAvLyBjb3VudHMgaGFkIHByZXZpb3VzbHkgb21pdHRlZCBiZWNhdXNlIFBhdGllbnQgaXMgYXV0by1jcmVhdGVkXG4gICAgICAgICAgLy8gc2lsZW50bHkgZnJvbSBwYXRpZW50X292ZXJyaWRlKS4gU2FtZSBkYXRhIFx1MjE5MiBzYW1lIG51bWJlci5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIERlZmVuc2l2ZTogb25seSBPVkVSV1JJVEUgdG90YWwgd2hlbiBleHBvcnQgYWN0dWFsbHkgcmV0dXJuZWRcbiAgICAgICAgICAvLyBzb21ldGhpbmcuIElmIGV4cG9ydCByZXR1cm5zIDAgZW50cmllcyBkZXNwaXRlIGEgc3VjY2Vzc2Z1bFxuICAgICAgICAgIC8vIHVwbG9hZCAoY291bGQgaGFwcGVuIHdpdGggYSBzdGFsZS1EQiBoYXNoIG1pc21hdGNoIHdlIGhhdmVuJ3RcbiAgICAgICAgICAvLyBmaXhlZCB5ZXQpLCBkb24ndCBjbG9iYmVyIHRoZSB0cnV0aGZ1bCB1cGxvYWQgY291bnQgXHUyMDE0IHRoYXQnc1xuICAgICAgICAgIC8vIGV4YWN0bHkgdGhlIGJ1ZyB0aGF0IG1hZGUgXCJcdTVERjJcdTY2RjRcdTY1QjAgODEgXHU3QjQ2XCIgc2lsZW50bHkgYmVjb21lXG4gICAgICAgICAgLy8gXCJcdTVERjJcdTY2RjRcdTY1QjAgMCBcdTdCNDZcIi5cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShidW5kbGUuZW50cnkpICYmIGJ1bmRsZS5lbnRyeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0b3RhbCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9ycy5wdXNoKGBleHBvcnQgYnVuZGxlOiBIVFRQICR7ci5zdGF0dXN9YCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGV4cG9ydCBidW5kbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKG1vZGUgPT09IFwibG9jYWxcIiA/IFwiYXNzZW1ibGUrc3Rhc2hcIiA6IFwiYmFja2VuZC11cGxvYWRcIik7XG5cbiAgLy8gRm9ybWF0IGVsYXBzZWQgd2FsbC1jbG9jayB0aW1lOiBzZWNvbmRzICgxIGRwKSBmb3Igc2hvcnQgc3luY3MsXG4gIC8vIFwibW06c3NcIiBvbmNlIHdlIGNyb3NzIHRoZSBtaW51dGUgbWFyayBzbyB0aGUgcG9wdXAgc3RhdHVzIHN0YXlzIHJlYWRhYmxlLlxuICBjb25zdCBfZWxhcHNlZE1zID0gRGF0ZS5ub3coKSAtIF90MDtcbiAgY29uc3QgX2VsYXBzZWRTdHIgPSBfZWxhcHNlZE1zIDwgNjBfMDAwXG4gICAgPyBgJHsoX2VsYXBzZWRNcyAvIDEwMDApLnRvRml4ZWQoMSl9c2BcbiAgICA6IGAke01hdGguZmxvb3IoX2VsYXBzZWRNcyAvIDYwXzAwMCl9bSR7TWF0aC5yb3VuZCgoX2VsYXBzZWRNcyAlIDYwXzAwMCkgLyAxMDAwKX1zYDtcbiAgLy8gTm8gbW9yZSBcIlx1NkE5NFx1Njg0OFx1NURGMlx1NTA5OVx1NTlBNVx1MjAyNlwiIHRhaWwgXHUyMDE0IHRoZSBcdUQ4M0RcdURDRTUgZG93bmxvYWQgYnV0dG9uIHNpdHMgcmlnaHRcbiAgLy8gYmVsb3cgdGhlIHN0YXR1cywgc28gc2F5aW5nIFwiXHU5RURFXHU0RTBCXHU2NUI5XHU2MzA5XHU5MjE1XCIgaXMganVzdCBub2lzZS5cbiAgY29uc3QgX2xvY2FsVGFpbCA9IFwiXCI7XG4gIGNvbnN0IF9zdWNjZXNzVmVyYiA9IG1vZGUgPT09IFwibG9jYWxcIiA/IFwiXHU1REYyXHU3NTIyXHU3NTFGXCIgOiBcIlx1NURGMlx1NjZGNFx1NjVCMFwiO1xuICAvLyBQaGFzZSB0aW1pbmdzIChgbmhpLXBhcmFsbGVsPThzYCwgYGJhY2tlbmQtdXBsb2FkPTAuOHNgKSBhcmUgZGV2XG4gIC8vIGluZm8gXHUyMDE0IHVzZWZ1bCB3aGVuIGludmVzdGlnYXRpbmcgYSBzbG93IHN5bmMgYnV0IG5vaXNlIGZvciBhbiBlbmRcbiAgLy8gdXNlci4gS2VlcCB0aGVtLCBidXQgdGFnIHdpdGggdGhlIFwiXHUyM0YxXCIgcHJlZml4IHRoZSBwb3B1cCB1c2VzIHRvXG4gIC8vIHR1Y2sgdGhlbSBpbnRvIGEgZGVlcGVyIFwiXHU2MjgwXHU4ODUzXHU3RDMwXHU3QkMwXCIgc3ViLXRvZ2dsZS5cbiAgY29uc3QgX3BoYXNlTGluZXMgPSBfcGhhc2VzLm1hcCgocCkgPT4gYFx1MjNGMSAke3AubmFtZX09JHsocC5tcyAvIDEwMDApLnRvRml4ZWQoMSl9c2ApO1xuICBjb25zdCBfZnVsbEJyZWFrZG93biA9IFsuLi5icmVha2Rvd24sIC4uLl9waGFzZUxpbmVzXTtcblxuICAvLyBQaWNrIHRoZSByaWdodCBzdW1tYXJ5IGxpbmUuIFplcm8tcmVzdWx0IGlzIHRoZSB0cmlja2llc3QgY2FzZTpcbiAgLy8gd2UgZG9uJ3Qgd2FudCBhIGdyZWVuIFx1MjcwNSBzYXlpbmcgXCIwIFx1N0I0NlwiIGJlY2F1c2UgdGhhdCByZWFkcyBhc1xuICAvLyBcInN1Y2NlZWRlZCB3aXRoIHplcm8gZGF0YVwiLiBUaGF0J3MgYWxtb3N0IGFsd2F5cyBvbmUgb2Y6XG4gIC8vICAgLSBOSEkgc2Vzc2lvbiBleHBpcmVkIGJldHdlZW4gdGhlIGxvZ2luIHByb2JlIGFuZCB0aGUgc3luY1xuICAvLyAgICAgKHRoZSBJSEtFMzQxMCBwcm9iZSBjYW4gc3RpbGwgc3VjY2VlZCB3aGlsZSBkYXRhIGVuZHBvaW50c1xuICAvLyAgICAgcmVzcG9uZCB3aXRoIGVtcHR5IGFycmF5cyk7XG4gIC8vICAgLSB0aGUgdXNlciB0cnVseSBoYXMgbm8gcmVjb3JkcyBpbiB0aGUgc2VsZWN0ZWQgZGF0ZSByYW5nZS5cbiAgLy8gRWl0aGVyIHdheSB0aGUgYWN0aW9uYWJsZSBuZXh0IHN0ZXAgaXMgXCJcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjUgTkhJIFx1NTE4RFx1OEE2Nlx1NEUwMFx1NkIyMVwiLlxuICBsZXQgX3N1bW1hcnlMaW5lO1xuICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgIF9zdW1tYXJ5TGluZSA9IGBcdTI2QTBcdUZFMEYgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyAke19zdWNjZXNzVmVyYn0gJHt0b3RhbH0gXHU3QjQ2XHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHVGRjBDJHtlcnJvcnMubGVuZ3RofSBcdTk4MDVcdTU5MzFcdTY1NTdcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOSR7X2xvY2FsVGFpbH1gO1xuICB9IGVsc2UgaWYgKHRvdGFsID09PSAwKSB7XG4gICAgX3N1bW1hcnlMaW5lID1cbiAgICAgIGBcdTI2QTBcdUZFMEYgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwXHU0RjQ2XHU2QzkyXHU2MjkzXHU1MjMwXHU0RUZCXHU0RjU1XHU4Q0M3XHU2NTk5XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDlcdTIwMTQgYCArXG4gICAgICBgXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBIHNlc3Npb24gXHU1M0VGXHU4MEZEXHU5MDRFXHU2NzFGXHVGRjBDXHU4QUNCXHU1NkRFXHU4QTcyXHU1MjA2XHU5ODAxXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XHVGRjFCXHU2MjE2XHU2MkM5XHU5NTc3XHUzMDBDXHU2NUU1XHU2NzFGXHU3QkM0XHU1NzBEXHUzMDBEXHU1MThEXHU4QTY2XHUzMDAyYDtcbiAgfSBlbHNlIHtcbiAgICBfc3VtbWFyeUxpbmUgPSBgXHUyNzA1IFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgJHtfc3VjY2Vzc1ZlcmJ9ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5JHtfbG9jYWxUYWlsfWA7XG4gIH1cblxuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgIHByb2dyZXNzOiBfc3VtbWFyeUxpbmUsXG4gICAgcGhhc2U6IFwiZG9uZVwiLFxuICAgIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCxcbiAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgZWxhcHNlZE1zOiBfZWxhcHNlZE1zLFxuICAgIC8vIFBlci1lbmRwb2ludCBicmVha2Rvd24gZm9yIHRoZSBwb3B1cCdzICdcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzAnIGNvbGxhcHNpYmxlLlxuICAgIC8vIEtlZXAgYXMgYSBwbGFpbiBhcnJheSBzbyBwb3B1cC5qcyBjYW4gcmVuZGVyIHdpdGggRE9NIEFQSSAobm9cbiAgICAvLyBpbm5lckhUTUwgLyBubyBlc2NhcGluZyBjb25jZXJucykuIEl0ZW1zIGxvb2sgbGlrZVxuICAgIC8vICdlbmNvdW50ZXJzPTEyLzEyJyBvciAnYWR1bHRfcHJldmVudGl2ZT0yIHJvd3MgXHUyMTkyIDM2IG9icycuXG4gICAgYnJlYWtkb3duOiBfZnVsbEJyZWFrZG93bixcbiAgICBlcnJvcnMsXG4gICAgaGlzdG5vOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sXG4gICAgbW9kZSxcbiAgICBsb2NhbEZpbGVuYW1lOiBfbG9jYWxGaWxlbmFtZSxcbiAgfSk7XG5cbiAgLy8gQmVzdC1lZmZvcnQ6IHdyaXRlIGEgU3luYyBIaXN0b3J5IHJvdyB0byB0aGUgYmFja2VuZCBzbyB0aGUgZGFzaGJvYXJkXG4gIC8vIGNhbiBzaG93IHdoZW4vd2hvL2hvdy1sb25nL3doYXQvcmFuZ2UuIFNraXBwZWQgaW4gbG9jYWwgbW9kZSAodGhlcmVcbiAgLy8gaXMgbm8gYmFja2VuZCkuIFdyYXBwZWQgKyBzd2FsbG93ZWQgc28gYSBsb2dnaW5nIGZhaWx1cmUgbmV2ZXJcbiAgLy8gcHJvcGFnYXRlcyBiYWNrIHRvIHRoZSB1c2VyLWZhY2luZyBzeW5jIHN0YXR1cy5cbiAgaWYgKG1vZGUgIT09IFwibG9jYWxcIikgdHJ5IHtcbiAgICBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL2xvZ2AsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBzdGF0dXM6IGVycm9ycy5sZW5ndGggPyBcInBhcnRpYWxcIiA6IFwic3VjY2Vzc1wiLFxuICAgICAgICBwYXRpZW50X2lkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIixcbiAgICAgICAgLy8gL3N5bmMvbG9nIGxhbmRzIGluIHRoZSBkYXNoYm9hcmQncyBzeW5jLWhpc3Rvcnkgcm93LiBPbmx5XG4gICAgICAgIC8vIG1hc2sgd2hlbiB0aGUgdXNlciBoYXMgb3B0ZWQgaW4gXHUyMDE0IG90aGVyd2lzZSBkYXNoYm9hcmQgc2Vlc1xuICAgICAgICAvLyB0aGUgcmF3IG5hbWUgdGhleSB0eXBlZCAoY29uc2lzdGVudCB3aXRoIFwiXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4XCIgZGVmYXVsdCkuXG4gICAgICAgIHBhdGllbnRfbmFtZTogbWFza0VuYWJsZWRcbiAgICAgICAgICA/IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCIpXG4gICAgICAgICAgOiBwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiLFxuICAgICAgICB0b3RhbCxcbiAgICAgICAgYnJlYWtkb3duLFxuICAgICAgICBkYXRlX3JhbmdlOiBkYXRlUmFuZ2VMYWJlbCB8fCBcIlwiLFxuICAgICAgICBlbGFwc2VkX21zOiBfZWxhcHNlZE1zLFxuICAgICAgICBzdGFydGVkX2F0OiBuZXcgRGF0ZShfdDApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIGVycm9ycyxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBmYWlsZWQgdG8gd3JpdGUgaGlzdG9yeSBsb2c6XCIsIGUpO1xuICB9XG4gIF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbn1cblxuLy8gT25lLXRpbWUgbWlncmF0aW9uIGZyb20gY2hyb21lLnN0b3JhZ2Uuc3luYyBcdTIxOTIgY2hyb21lLnN0b3JhZ2UubG9jYWwuXG4vLyBQcmV2aW91cyB2ZXJzaW9ucyBzdG9yZWQgc3luY0FwaUtleSArIHBhdGllbnRPdmVycmlkZSAoY29udGFpbmluZyB0aGVcbi8vIG5hdGlvbmFsIElEKSB1bmRlciAuc3luYywgd2hpY2ggQ2hyb21lIHJlcGxpY2F0ZXMgdG8gdGhlIHVzZXIncyBHb29nbGVcbi8vIGFjY291bnQgYW5kIHB1c2hlcyB0byBldmVyeSBkZXZpY2UgdGhleSBzaWduIGludG8uIE1vdmUgZXZlcnl0aGluZ1xuLy8gc2V0dGluZ3MtcmVsYXRlZCB0byAubG9jYWw7IGNsZWFyIHRoZSBzeW5jIGNvcHkuXG5jb25zdCBTWU5DX0tFWVNfVE9fTUlHUkFURSA9IFtcbiAgXCJiYWNrZW5kVXJsXCIsXG4gIFwic3luY0FwaUtleVwiLFxuICBcInNtYXJ0QXBwTGF1bmNoVXJsXCIsXG4gIFwicGF0aWVudE92ZXJyaWRlXCIsXG4gIFwic3luY01vZGVcIixcbiAgXCJtYXNrTmFtZUVuYWJsZWRcIixcbl07XG5cbmFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGVTeW5jVG9Mb2NhbCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzeW5jZWQgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChTWU5DX0tFWVNfVE9fTUlHUkFURSk7XG4gICAgY29uc3QgcHJlc2VudCA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgIE9iamVjdC5lbnRyaWVzKHN5bmNlZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgICApO1xuICAgIGlmIChPYmplY3Qua2V5cyhwcmVzZW50KS5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBjb25zdCBsb2NhbCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChPYmplY3Qua2V5cyhwcmVzZW50KSk7XG4gICAgLy8gRG9uJ3Qgb3ZlcndyaXRlIGFueXRoaW5nIHRoZSB1c2VyIGFscmVhZHkgc2V0IG9uIHRoaXMgbWFjaGluZS5cbiAgICBjb25zdCB0b1dyaXRlID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgT2JqZWN0LmVudHJpZXMocHJlc2VudCkuZmlsdGVyKChba10pID0+IGxvY2FsW2tdID09PSB1bmRlZmluZWQpLFxuICAgICk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHRvV3JpdGUpLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh0b1dyaXRlKTtcbiAgICB9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoT2JqZWN0LmtleXMocHJlc2VudCkpO1xuICB9IGNhdGNoIHtcbiAgICAvLyBNaWdyYXRpb24gaXMgYmVzdC1lZmZvcnQuIFRoZSBuZXh0IHJ1biBnZXRzIHRvIHRyeSBhZ2Fpbi5cbiAgfVxufVxuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihhc3luYyAoKSA9PiB7XG4gIGF3YWl0IG1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xufSk7XG5cbi8vIEFsc28gcnVuIG1pZ3JhdGlvbiBvbiBzZXJ2aWNlLXdvcmtlciB3YWtlLXVwIChjb3ZlcnMgcmVsb2FkL3Jlc3RhcnRcbi8vIHBhdGhzIHdoZXJlIG9uSW5zdGFsbGVkIGRvZXNuJ3QgZmlyZSkuXG5jaHJvbWUucnVudGltZS5vblN0YXJ0dXA/LmFkZExpc3RlbmVyPy4oKCkgPT4ge1xuICBtaWdyYXRlU3luY1RvTG9jYWwoKTtcbn0pO1xubWlncmF0ZVN5bmNUb0xvY2FsKCk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICBpZiAobXNnPy50eXBlID09PSBcInN0YXJ0TmhpQXBpU3luY1wiKSB7XG4gICAgcnVuTmhpQXBpU3luYyhtc2cucGF5bG9hZCkudGhlbihcbiAgICAgICgpID0+IHsgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge30gfSxcbiAgICAgIGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGlmIChlPy5tZXNzYWdlID09PSBDQU5DRUxfRVJST1IpIHtcbiAgICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSwgY2FuY2VsbGVkOiB0cnVlIH0pOyB9IGNhdGNoIHt9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlPy5tZXNzYWdlID09PSBTRVNTSU9OX0VYUElSRURfRVJST1IpIHtcbiAgICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgICAgICAgc3luY1N0YXR1czoge1xuICAgICAgICAgICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgcHJvZ3Jlc3M6IFwiXHVEODNEXHVERDEyIE5ISSBzZXNzaW9uIFx1NURGMlx1NzY3Qlx1NTFGQSBcdTIwMTQgXHU4QUNCXHU1NzI4IE5ISSB0YWIgXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XHU1RjhDXHU1MThEXHU5RURFIFN5bmNcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwic2Vzc2lvbl9leHBpcmVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLCBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiBmYWxzZSwgZXhwaXJlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmVycm9yKFwicnVuTmhpQXBpU3luYyBmYWlsZWRcIiwgZSk7XG4gICAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHJ1bm5pbmc6IGZhbHNlLCBwcm9ncmVzczogYFx1Mjc0QyAke2UubWVzc2FnZX1gLCBwaGFzZTogXCJlcnJvclwiIH0pO1xuICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGVycm9yOiBlLm1lc3NhZ2UgfSk7IH0gY2F0Y2gge31cbiAgICAgIH0sXG4gICAgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcInN0b3BTeW5jXCIpIHtcbiAgICAvLyBTZXQgdGhlIGNhbmNlbGxhdGlvbiBmbGFnOyB0aGUgaW4tZmxpZ2h0IHN5bmMgd2lsbCB0aHJvd1xuICAgIC8vIENBTkNFTF9FUlJPUiBhdCBpdHMgbmV4dCBjaGVja0NhbmNlbCgpIGNhbGwuICBTdG9yYWdlIGlzIGFscmVhZHlcbiAgICAvLyB1cGRhdGVkIGJ5IHRoZSBwb3B1cCwgc28gd2UgZG9uJ3QgdG91Y2ggaXQgaGVyZS5cbiAgICBfY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAvLyBEaXNjYXJkIGFueSBwYXJ0aWFsIGRhdGEgdXBsb2FkZWQgc28gZmFyLiBUaGUgdXNlcidzIHN0YXRlZFxuICAgIC8vIGNvbnRyYWN0IGlzICdzdG9wID0gYWJvcnQsIEknbGwgcmVzeW5jIGZyb20gc2NyYXRjaCBsYXRlcicgXHUyMDE0IHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byBsZWF2ZSBhIGhhbGYtbG9hZGVkIHBhdGllbnQgaW4gdGhlIEZISVIgc3RvcmUgdGhhdFxuICAgIC8vIGxvb2tzIGNvbXBsZXRlIHRvIGRvd25zdHJlYW0gU01BUlQgYXBwcy5cbiAgICBjb25zdCBjdHggPSBfYWN0aXZlU3luY0N0eDtcbiAgICBpZiAoY3R4Py5wYXRpZW50SWQgJiYgY3R4LmJhY2tlbmQpIHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICBgJHtjdHguYmFja2VuZH0vc3luYy9wYXRpZW50LyR7ZW5jb2RlVVJJQ29tcG9uZW50KGN0eC5wYXRpZW50SWQpfWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgaGVhZGVyczogY3R4LnN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogY3R4LnN5bmNBcGlLZXkgfSA6IHt9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIFN1cmZhY2UgdGhlIHdpcGUgaW4gdGhlIHN0YXR1cyBzbyB1c2VyIHNlZXMgaXQgYWN0dWFsbHkgaGFwcGVuZWQuXG4gICAgICAgICAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIFtTVE9SQUdFX0tFWV06IHtcbiAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdTVERjJcdTUwNUNcdTZCNjJcdTRFMjZcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTkgXHUyMDE0IFx1OEFDQlx1OTFDRFx1NjVCMFx1NTNENlx1NUY5N1wiLFxuICAgICAgICAgICAgICBwaGFzZTogXCJjYW5jZWxsZWRcIixcbiAgICAgICAgICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICAgICAgICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIGNhbmNlbCB3aXBlIGZhaWxlZDpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfVxuICAgIF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbiAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2c/LnR5cGUgPT09IFwiZ2V0U3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKS50aGVuKChkYXRhKSA9PiBzZW5kUmVzcG9uc2UoZGF0YVtTVE9SQUdFX0tFWV0gfHwgbnVsbCkpO1xuICAgIHJldHVybiB0cnVlOyAgLy8gYXN5bmMgcmVzcG9uc2VcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImNsZWFyU3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFNUT1JBR0VfS0VZKS50aGVuKCgpID0+IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImNoZWNrTmhpTG9naW5cIikge1xuICAgIF9jaGVja05oaUxvZ2luU3RhdGUobXNnLnRhYklkKS50aGVuKFxuICAgICAgKHN0YXRlKSA9PiB7IHRyeSB7IHNlbmRSZXNwb25zZSh7IGxvZ2dlZEluOiBzdGF0ZSB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICAgKCkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogbnVsbCB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuXG4vLyBCZWx0LWFuZC1zdXNwZW5kZXJzIFNXIGtlZXBhbGl2ZTogYW4gYWxhcm0gZXZlcnkgMjAgcyB3YWtlcyB0aGUgU1cgaWZcbi8vIGlkbGUuIENvbWJpbmVkIHdpdGggdGhlIHJldHVybi10cnVlIHBhdHRlcm4gYWJvdmUsIHRoaXMgcHJldmVudHMgdGhlXG4vLyAzMCBzIGlkbGUgc2h1dGRvd24gZnJvbSBlbmRpbmcgYW4gaW4tcHJvZ3Jlc3Mgc3luYy5cbmNocm9tZS5hbGFybXMuY3JlYXRlKFwic3cta2VlcGFsaXZlXCIsIHsgcGVyaW9kSW5NaW51dGVzOiAwLjM0IH0pO1xuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKCgpID0+IHsgLyogbm8tb3A7IHByZXNlbmNlIGlzIHRoZSBwb2ludCAqLyB9KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBU0EsT0FBQyxXQUFXO0FBQ1Y7QUFFQSxZQUFJLGNBQWM7QUFDbEIsWUFBSSxpQkFBaUI7QUFDckIsWUFBSSxTQUFTLE9BQU8sV0FBVztBQUMvQixZQUFJLE9BQU8sU0FBUyxTQUFTLENBQUM7QUFDOUIsWUFBSSxLQUFLLG1CQUFtQjtBQUMxQixtQkFBUztBQUFBLFFBQ1g7QUFDQSxZQUFJLGFBQWEsQ0FBQyxVQUFVLE9BQU8sU0FBUztBQUM1QyxZQUFJLFVBQVUsQ0FBQyxLQUFLLHNCQUFzQixPQUFPLFlBQVksWUFBWSxRQUFRLFlBQVksUUFBUSxTQUFTO0FBQzlHLFlBQUksU0FBUztBQUNYLGlCQUFPO0FBQUEsUUFDVCxXQUFXLFlBQVk7QUFDckIsaUJBQU87QUFBQSxRQUNUO0FBQ0EsWUFBSSxZQUFZLENBQUMsS0FBSyx3QkFBd0IsT0FBTyxXQUFXLFlBQVksT0FBTztBQUNuRixZQUFJLE1BQU0sT0FBTyxXQUFXLGNBQWMsT0FBTztBQUNqRCxZQUFJLGVBQWUsQ0FBQyxLQUFLLDJCQUEyQixPQUFPLGdCQUFnQjtBQUMzRSxZQUFJLFlBQVksbUJBQW1CLE1BQU0sRUFBRTtBQUMzQyxZQUFJLFFBQVEsQ0FBQyxhQUFhLFNBQVMsT0FBTyxHQUFHO0FBQzdDLFlBQUksUUFBUSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7QUFDekIsWUFBSSxlQUFlLENBQUMsT0FBTyxTQUFTLFVBQVUsYUFBYTtBQUUzRCxZQUFJLFNBQVMsQ0FBQztBQUVkLFlBQUksVUFBVSxN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QUFFQSxhQUFLLFVBQVUsTUFBTSxXQUFZO0FBQy9CLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLO0FBRXRFLGlCQUFPLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVB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VTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBVVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBT1YsVUFBVTtBQUFBO0FBQUEsSUFD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QUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUNFO0FBQUEsSUFDRixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBO0FBQUEsSUFFWCxXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsRUFDYjs7O0FDMWdCQSxNQUFNLGNBQWM7QUFLcEIsTUFBTSxnQkFBaUQ7QUFBQSxJQUNyRCxDQUFDLFVBQUssR0FBRztBQUFBLElBQ1QsQ0FBQyxVQUFLLEdBQUc7QUFBQSxJQUNULENBQUMsVUFBSyxJQUFJO0FBQUEsSUFDVixDQUFDLFVBQUssSUFBSTtBQUFBLElBQ1YsQ0FBQyxVQUFLLElBQUk7QUFBQSxJQUNWLENBQUMsVUFBSyxJQUFJO0FBQUEsRUFDWjtBQUVBLFdBQVMsbUJBQW1CLEdBQW1CO0FBQzdD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Q2pDLGFBQU8sUUFBUSxNQUFNLElBQUksV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUFTLGFBQWEsS0FBSyxXQUFXLEtBQUssSUFBSSxDQUFDO0FBQzVGLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsbUJBQW1CO0FBQ25DLGFBQU8sUUFBUSxNQUFNLE9BQU8sV0FBVyxFQUFFLEtBQUssTUFBTSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQztBQUM5RSxhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLGlCQUFpQjtBQUNqQywwQkFBb0IsSUFBSSxLQUFLLEVBQUU7QUFBQSxRQUM3QixDQUFDLFVBQVU7QUFBRSxjQUFJO0FBQUUseUJBQWEsRUFBRSxVQUFVLE1BQU0sQ0FBQztBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUFFO0FBQUEsUUFDakUsTUFBTTtBQUFFLGNBQUk7QUFBRSx5QkFBYSxFQUFFLFVBQVUsS0FBSyxDQUFDO0FBQUEsVUFBRyxRQUFRO0FBQUEsVUFBQztBQUFBLFFBQUU7QUFBQSxNQUM3RDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBS0QsU0FBTyxPQUFPLE9BQU8sZ0JBQWdCLEVBQUUsaUJBQWlCLEtBQUssQ0FBQztBQUM5RCxTQUFPLE9BQU8sUUFBUSxZQUFZLE1BQU07QUFBQSxFQUFxQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJCdWZmZXIiLCAiYmxvY2tzIiwgImV4cG9ydHMiLCAibWFwU3lzdGVtIiwgImVzY2FwZVJlZ2V4IiwgImNqa0NoYXJzIiwgIm9ic0lkIiwgIm1hcFN5c3RlbSIsICJyIl0KfQo=
