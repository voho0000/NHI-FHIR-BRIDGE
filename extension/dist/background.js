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
  var ENCOUNTER_KIND_SYSTEM = "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind";
  var ENCOUNTER_CHANNEL_SYSTEM = "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel";
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
  var KIND_CODE_MAP = {
    \u9580\u8A3A: "outpatient",
    \u6025\u8A3A: "emergency",
    \u4F4F\u9662: "inpatient",
    \u85E5\u5C40: "pharmacy"
  };
  var CHANNEL_CODE_MAP = {
    \u7533\u5831\u8CC7\u6599: "claims",
    IC\u5361\u8CC7\u6599: "ic-card"
  };
  function buildTypeEntry(text, system, codeMap) {
    const coding = { system, display: text };
    const code = codeMap[text];
    if (code) coding.code = code;
    return { text, coding: [coding] };
  }
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
    const kind = (raw.kind ?? "").trim();
    const channel = (raw.channel ?? "").trim();
    const types = [];
    if (kind) types.push(buildTypeEntry(kind, ENCOUNTER_KIND_SYSTEM, KIND_CODE_MAP));
    if (channel) {
      types.push(buildTypeEntry(channel, ENCOUNTER_CHANNEL_SYSTEM, CHANNEL_CODE_MAP));
    }
    if (types.length === 0) {
      const typeDisplay = (raw.type_display ?? "").trim();
      if (typeDisplay) types.push({ text: typeDisplay });
    }
    if (types.length > 0) {
      resource.type = types;
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
    const reasonCodes = [];
    const reason = (raw.reason ?? "").trim();
    const reasonZh = (raw.reason_zh ?? "").trim();
    const reasonCode = (raw.reason_code ?? "").trim();
    if (reason || reasonZh || reasonCode) {
      const rc = {};
      if (reasonCode) {
        const displayPlain = reason.replace(new RegExp(`^${reasonCode}\\s+`), "").trim();
        rc.coding = [
          {
            system: "http://hl7.org/fhir/sid/icd-10-cm",
            code: reasonCode,
            display: displayPlain || reason || reasonZh
          }
        ];
      }
      rc.text = reasonZh || reason;
      reasonCodes.push(rc);
    }
    const secondaries = Array.isArray(raw.secondary_diagnoses) ? raw.secondary_diagnoses : [];
    for (const sec of secondaries) {
      const code = (sec?.code ?? "").trim();
      const nameEn = (sec?.name_en ?? "").trim();
      const nameZh = (sec?.name_zh ?? "").trim();
      if (!code && !nameEn && !nameZh) continue;
      const entry = {};
      if (code) {
        entry.coding = [
          {
            system: "http://hl7.org/fhir/sid/icd-10-cm",
            code,
            display: nameEn || nameZh
          }
        ];
      }
      entry.text = code ? `${code} ${nameZh || nameEn}`.trim() : nameZh || nameEn;
      reasonCodes.push(entry);
    }
    if (reasonCodes.length > 0) {
      resource.reasonCode = reasonCodes;
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

  // ../packages/mapper/src/immunization.ts
  function mapImmunization(raw, patientId) {
    const vaccineName = (raw.vaccine_name ?? "").trim();
    const date = (raw.date ?? "").trim();
    if (!vaccineName || !date) return null;
    const resource = {
      resourceType: "Immunization",
      // Stable id uses date + vaccine name + lot — same vaccine same day
      // with the same lot collapses (NHI rare edge case); different lots
      // would be distinct Immunizations.
      id: stableId(patientId, vaccineName, date, raw.lot_number ?? ""),
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: "completed",
      vaccineCode: {
        // No terminology coding — NHI gives Chinese name only. SMART
        // apps render .text for both patient and clinical views (the
        // v0.8.0 bilingual fallback contract: if English absent, text
        // is the only display).
        text: vaccineName
      },
      patient: { reference: `Patient/${patientId}` },
      occurrenceDateTime: `${date}T00:00:00+08:00`
    };
    const lotNumber = (raw.lot_number ?? "").trim();
    if (lotNumber) {
      resource.lotNumber = lotNumber;
    }
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.performer = [{ actor: { display: hospital } }];
    }
    const source = (raw.source ?? "").trim();
    if (source) {
      resource.note = [{ text: `\u4F86\u6E90: ${source}` }];
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
    const drugNameZh = (raw.drug_name_zh ?? "").trim() || drugName;
    const resource = {
      resourceType: "MedicationRequest",
      id: medId,
      meta: { versionId: "1", source: "nhi-fhir-bridge/scraper" },
      status: medStatus(raw.date ?? "", raw.duration_days),
      intent: "order",
      medicationCodeableConcept: {
        coding: [coding],
        text: drugNameZh
      },
      subject: { reference: `Patient/${patientId}` }
    };
    if (raw.date) {
      resource.authoredOn = `${raw.date}T00:00:00+08:00`;
    }
    const courseOfTherapy = (raw.course_of_therapy ?? "").trim();
    if (courseOfTherapy === "continuous") {
      resource.courseOfTherapyType = {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
            code: "continuous",
            display: "Continuous long term therapy"
          }
        ],
        text: "Continuous long term therapy"
      };
    }
    const drugClass = (raw.drug_class ?? "").trim();
    const drugClassZh = (raw.drug_class_zh ?? "").trim();
    if (drugClass || drugClassZh) {
      const cat = {};
      if (drugClass) cat.coding = [{ display: drugClass }];
      cat.text = drugClassZh || drugClass;
      resource.category = [cat];
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
    const endDate = (raw.end_date ?? "").trim();
    if (raw.date && endDate && endDate !== raw.date) {
      dr.validityPeriod = {
        start: `${raw.date}T00:00:00+08:00`,
        end: `${endDate}T23:59:59+08:00`
      };
    }
    if (Object.keys(dr).length > 0) {
      resource.dispenseRequest = dr;
    }
    const indication = (raw.indication ?? "").trim();
    const indicationZh = (raw.indication_zh ?? "").trim();
    const indicationCode = (raw.indication_code ?? "").trim();
    if (indication || indicationZh || indicationCode) {
      const rc = {};
      if (indicationCode) {
        rc.coding = [
          {
            system: ICD_10_CM,
            code: normalizeIcd10Cm(indicationCode),
            display: indication || indicationZh || indicationCode
          }
        ];
      }
      const nameZh = indicationZh || indication;
      if (nameZh) {
        rc.text = indicationCode ? `${indicationCode} ${nameZh}`.trim() : nameZh;
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
    // 12052B β2-微球蛋白 — previously mapped to 10873-8 which is actually
    // 'Beta-2-Microglobulin [Mass/time] in 24 hour Urine' (timed urine
    // collection, verified loinc.org/10873-8/). Taiwan 12052B billing is
    // typically a serum order; 1952-1 is the verified serum-or-plasma LOINC
    // (Component=Beta-2-Microglobulin, Property=MCnc) — loinc.org/1952-1/.
    "12052B": "1952-1",
    // β2-microglobulin — Mass/vol S/P
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
    // verified loinc.org/7849-3/). No verified canonical replacement found
    // in this pass (candidates 5126-8 / 5125-0 are IgM or method-specific,
    // 22592-9 / 22591-1 / 16125-5 returned HTTP 500 on every retry).
    // Leaving unmapped; falls through to NHI-code-only coding.
    "14048B": "7853-5",
    // CMV IgM — Cytomegalovirus IgM Ab [Units/volume] S/P
    //   restored after audit: 14048B previously mapped to 7850-1 which is
    //   'Taenia solium larva Ab' (verified loinc.org/7850-1/). 7853-5
    //   verified as the canonical CMV IgM LOINC (Component=Cytomegalovirus
    //   Ab.IgM, Property=ACnc) — loinc.org/7853-5/.
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
    // ── Virology (audit 2026-05-19) ──────────────────
    "7853-5": "Cytomegalovirus IgM Ab [Units/volume] in Serum or Plasma",
    // ── Tumor markers / proteins (audit 2026-05-19) ──
    "1952-1": "Beta-2-Microglobulin [Mass/volume] in Serum or Plasma",
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
    const displayZh = (raw.display_zh ?? "").trim() || display;
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
        text: displayZh
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
    const hospital = (raw.hospital ?? "").trim();
    if (hospital) {
      resource.performer = [{ actor: { display: hospital } }];
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
    encounters: [mapEncounter, "encounters"],
    immunizations: [mapImmunization, "immunizations"]
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
      if (!p || typeof p !== "object") continue;
      if (typeof p.display === "string" && p.display) return p.display;
      const actor = p.actor;
      if (actor && typeof actor === "object" && typeof actor.display === "string" && actor.display) {
        return actor.display;
      }
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
  function pickChinese(s) {
    if (s === null || s === void 0) return "";
    const str = String(s);
    const idx = str.indexOf("||");
    if (idx === -1) return str.trim();
    const zh = str.slice(0, idx).trim();
    return zh || str.slice(idx + 2).trim();
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
  function adaptMedicationFromDetail(drug, visit, options) {
    if (!drug || typeof drug !== "object") return null;
    const date = rocToISO(visit?.func_DATE || visit?.func_date || "");
    const rawDrugName = drug.drug_name || drug.druG_NAME || "";
    const drug_name = pickEnglish(rawDrugName);
    if (!date || !drug_name) return null;
    const end_date = rocToISO(visit?.cure_E_DATE || visit?.cure_e_date || "");
    const days = Number(drug.order_drug_day || drug.order_DRUG_DAY || 0);
    const is_chronic = !!(options && options.is_chronic);
    const drug_name_zh = drug.drug_name2 || drug.druG_NAME2 || pickChinese(rawDrugName);
    const rawIndication = visit?.icd9cm_CODE_CNAME || visit?.icd9cm_name || "";
    const stripIcdPrefix = (s) => s.replace(/^[A-Z0-9.]+\/\s*/, "");
    const indication = stripIcdPrefix(pickEnglish(rawIndication));
    const indication_zh = visit?.icd9cm_CODE_CNAME2 || visit?.icd9cm_code_cname2 || stripIcdPrefix(pickChinese(rawIndication));
    return {
      date,
      // Only emit when meaningfully populated AND different from start.
      // Suppressing the same-day case keeps OPD / 藥局 resources tight.
      end_date: end_date && end_date !== date ? end_date : "",
      drug_name,
      drug_name_zh,
      code: drug.order_code || drug.ordeR_CODE || "",
      // List endpoint doesn't expose dose/frequency/route — only days + qty.
      dose: "",
      frequency: "",
      route: "",
      quantity: drug.order_qty || drug.order_QTY || "",
      duration_days: Number.isFinite(days) ? days : 0,
      indication,
      indication_zh,
      indication_code: visit?.icd9cm_CODE || visit?.icd9cm_code || "",
      drug_class: pickEnglish(drug.act || ""),
      drug_class_zh: pickChinese(drug.act || ""),
      hospital: visit?.hosp_ABBR || visit?.hosp_abbr || "",
      // Mapper reads this to set MedicationRequest.courseOfTherapyType.
      course_of_therapy: is_chronic ? "continuous" : ""
    };
  }
  function adaptMedication() {
    return null;
  }
  function adaptChronicListStub() {
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
  function adaptInpatientEncounter(item, options) {
    if (!item || typeof item !== "object") return null;
    const start = rocToISO(item.in_DATE || item.func_DATE || "");
    const end = rocToISO(item.out_DATE || "");
    if (!start) return null;
    const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
    const s02Primary = options && options.primary_diagnosis;
    const icdCode = s02Primary && s02Primary.code || item.icd9cm_CODE || item.icd9cm_code || "";
    let icdName, icdName_zh;
    if (s02Primary && (s02Primary.name_en || s02Primary.name_zh)) {
      icdName = s02Primary.name_en || s02Primary.name_zh;
      icdName_zh = s02Primary.name_zh || s02Primary.name_en;
    } else {
      const rawIcdName = item.icd9cm_CODE_CNAME || item.icd9cm_name || "";
      icdName = stripIcdPrefix(pickEnglish(rawIcdName));
      icdName_zh = stripIcdPrefix(pickChinese(rawIcdName));
    }
    const _channel = item.ori_type_name || item.orI_TYPE_NAME || "\u7533\u5831\u8CC7\u6599";
    return {
      date: start,
      end_date: end,
      class: "IMP",
      kind: "\u4F4F\u9662",
      channel: _channel,
      type_display: "\u4F4F\u9662",
      department: "",
      provider: "",
      reason: icdName ? icdCode ? `${icdCode} ${icdName}` : icdName : "",
      reason_zh: icdName_zh ? icdCode ? `${icdCode} ${icdName_zh}` : icdName_zh : "",
      reason_code: icdCode,
      secondary_diagnoses: options && Array.isArray(options.secondary_diagnoses) ? options.secondary_diagnoses : [],
      hospital: item.hosp_ABBR || item.hosp_abbr || "",
      row_id: item.row_ID || item.row_id || ""
    };
  }
  function adaptEncounterFromMedExpense(item, classHint, options) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(item.funC_DATE || item.func_DATE || item.func_date || "");
    if (!date) return null;
    const stripIcdPrefix = (s) => s.replace(/^[A-Z0-9.]+\/\s*/, "");
    const s02Primary = options && options.primary_diagnosis;
    const icdCode = s02Primary && s02Primary.code || item.icD9CM_CODE || item.icd9cm_CODE || item.icd9cm_code || "";
    let icdName, icdName_zh;
    if (s02Primary && (s02Primary.name_en || s02Primary.name_zh)) {
      icdName = s02Primary.name_en || s02Primary.name_zh;
      icdName_zh = s02Primary.name_zh || s02Primary.name_en;
    } else {
      const rawIcdName = item.icD9CM_CODE_CNAME || item.icd9cm_CODE_CNAME || item.icd9cm_name || "";
      icdName = stripIcdPrefix(pickEnglish(rawIcdName));
      icdName_zh = stripIcdPrefix(pickChinese(rawIcdName));
    }
    const hospital = item.hosP_ABBR || item.hosp_ABBR || item.hosp_abbr || "";
    const isPharmacy = options && options.pharmacy === true || /藥局|藥房/.test(hospital);
    const _channel = item.ori_type_name || item.orI_TYPE_NAME || "";
    const _kind = isPharmacy ? "\u85E5\u5C40" : classHint === "EMER" ? "\u6025\u8A3A" : classHint === "IMP" ? "\u4F4F\u9662" : "\u9580\u8A3A";
    return {
      date,
      end_date: "",
      class: classHint || "AMB",
      kind: _kind,
      channel: _channel,
      // Legacy single-string field. The mapper now reads kind + channel
      // and ignores this when either is set; kept here so external
      // consumers that grep the adapter output don't suddenly break.
      type_display: isPharmacy ? "\u85E5\u5C40" : _channel,
      department: "",
      provider: "",
      // English reason (clinical) and Chinese reason (patient-facing) are
      // sourced from the same bilingual NHI field; mapper places English
      // into reasonCode[0].coding[0].display and Chinese into .text.
      reason: icdName ? icdCode ? `${icdCode} ${icdName}` : icdName : "",
      reason_zh: icdName_zh ? icdCode ? `${icdCode} ${icdName_zh}` : icdName_zh : "",
      reason_code: icdCode,
      // Secondary diagnoses (次診斷) come from IHKE3303S02 detail fan-out
      // — list endpoint only exposes the primary ICD. The mapper appends
      // one Encounter.reasonCode[] entry per secondary, preserving order
      // (primary first, then 次診斷1, 2, 3, ... up to 4 observed in live
      // NHI data). Empty array when caller didn't fetch detail or NHI
      // returned no secondaries.
      secondary_diagnoses: options && Array.isArray(options.secondary_diagnoses) ? options.secondary_diagnoses : [],
      hospital,
      // Pass through for the eventual IHKE3303S02 detail fetch (Phase B).
      row_id: item.roW_ID || item.row_id || ""
    };
  }
  function adaptImmunization(item) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(item.inoculatE_D || item.inoculate_d || "");
    const rawName = String(item.codE_CNAME || item.code_cname || "").trim();
    if (!date || !rawName) return null;
    const lotMatch = rawName.match(/[（(]\s*批號\s*([^)）]+?)\s*[)）]/);
    const lotNumber = lotMatch ? lotMatch[1].trim() : "";
    const cleanName = rawName.replace(/[（(]\s*批號\s*[^)）]+\s*[)）]/, "").trim();
    return {
      date,
      vaccine_name: cleanName || rawName,
      lot_number: lotNumber,
      hospital: item.hosP_ABBR || item.hosp_abbr || "",
      // NHI's source-of-record marker; preserved on the resource as
      // performer-org context (疾病管制署 = Taiwan CDC).
      source: item.source || ""
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
  function adaptProcedureListStub() {
    return null;
  }
  function adaptProcedureFromDetail(item) {
    if (!item || typeof item !== "object") return null;
    const subList = Array.isArray(item.sp_IHKE3308S04_data_list) ? item.sp_IHKE3308S04_data_list : [];
    const exeDate = subList.length > 0 ? subList[0].exe_S_DATE || subList[0].exe_s_date || "" : "";
    const date = rocToISO(exeDate || item.func_DATE || item.func_date || "");
    const opCode = item.op_CODE || item.op_code || "";
    const rawOpName = item.op_CODE_CNAME || item.op_code_cname || "";
    const opName = pickEnglish(rawOpName);
    const opName_zh = pickChinese(rawOpName);
    const stripCode = (s) => (s || "").replace(/^[A-Z0-9]+\//, "").trim();
    const display = stripCode(opName) || opName.trim();
    const display_zh = stripCode(opName_zh);
    if (!date || !display) return null;
    const reasonCode = item.icd9cm_CODE || item.icd9cm_code || "";
    const reasonName = (pickEnglish(item.icd9cm_CODE_CNAME || item.icd9cm_code_cname || "") || "").replace(/^[A-Z0-9]+\//, "").trim();
    const noteParts = [];
    if (reasonName) {
      noteParts.push(reasonCode ? `Reason: ${reasonCode} ${reasonName}` : `Reason: ${reasonName}`);
    }
    for (const sub of subList) {
      const subName = pickEnglish(sub.order_CODE_NAME || sub.order_code_name || "").trim();
      const subCode = sub.order_CODE || sub.order_code || "";
      if (subName) {
        noteParts.push(subCode ? `\u65BD\u4F5C: ${subName} (NHI ${subCode})` : `\u65BD\u4F5C: ${subName}`);
      }
    }
    return {
      date,
      code: opCode,
      // Hint for mapProcedure.mapSystem — "icd-10-pcs" string contains
      // "icd", so the mapper assigns systems.ICD_10_PCS.
      system: opCode ? "icd-10-pcs" : "",
      display,
      display_zh,
      note: noteParts.join(" / "),
      body_site: "",
      hospital: item.hosp_ABBR || item.hosp_abbr || ""
    };
  }
  function adaptImagingReportFromDetail(item) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(
      item.real_INSPECT_DATE || item.real_inspect_date || item.main_tit || item.main_TIT || item.func_DATE || item.func_date || ""
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
    chronic_prescriptions: "\u6162\u6027\u8655\u65B9\u7B8B",
    allergies: "\u85E5\u7269\u904E\u654F",
    allergies_b: "\u85E5\u7269\u904E\u654F\uFF08B\uFF09",
    adult_preventive: "\u6210\u4EBA\u5065\u6AA2",
    cancer_screening: "\u764C\u75C7\u7BE9\u6AA2",
    imaging: "\u5F71\u50CF\u6AA2\u67E5",
    other_labs: "\u6AA2\u9A57",
    catastrophic_illness: "\u91CD\u5927\u50B7\u75C5",
    immunizations: "\u75AB\u82D7"
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
    // Procedures (IHKE3301S05) list only has order-level metadata —
    // no ICD-10-PCS code and no actual performed-date. The full
    // record lives at IHKE3308S02 (sub-list carries exe_S_DATE +
    // NHI 醫令碼 per execution). Same 2-step fan-out pattern as
    // imaging; see _fetchProcedureDetailsInTab.
    {
      name: "procedures",
      path: "/api/ihke3000/ihke3301s05/page_load",
      page_type: "procedures",
      adapt: adaptProcedureListStub
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
    // 慢性處方箋 (refill="Y") — separate list endpoint from medications.
    // ~52 of 126 entries overlap with IHKE3306S01; the rest are
    // chronic-only and would be missed if we relied on regular list alone.
    // The chronic detail fan-out runs BEFORE the medication fan-out and
    // its row_IDs are passed to the medication fan-out as skip-set so
    // each row is fetched once. See _fetchChronicMedicationDetailsInTab
    // in background.js. Detail endpoint is the same IHKE3306S02 as
    // regular meds; ctype must equal the list row's ori_TYPE (1=門診,
    // 2=IC卡, 8=藥局), not hardcoded to 8.
    {
      name: "chronic_prescriptions",
      path: "/api/ihke3000/IHKE3307S01/page_load",
      page_type: "medications",
      adapt: adaptChronicListStub
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
    },
    // IHKE3203S01 (預防接種紀錄 / 疫苗) — Taiwan CDC sourced. Each row
    // → FHIR Immunization. NHI ships Chinese-only vaccine names with
    // batch number inlined as "(批號XXX)"; adapter splits the lot.
    // No date range parameter (NHI returns all historical vaccinations).
    {
      name: "immunizations",
      path: "/api/ihke3000/ihke3203s01/SP_IHKE3203S01",
      page_type: "immunizations",
      adapt: adaptImmunization
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
  async function _withProgressTimer(makeLabel, fn) {
    const start = Date.now();
    await setStatus({ progress: makeLabel(0) });
    const interval = setInterval(() => {
      const elapsed = Math.round((Date.now() - start) / 1e3);
      setStatus({ progress: makeLabel(elapsed) }).catch(() => {
      });
    }, 3e3);
    try {
      return await fn();
    } finally {
      clearInterval(interval);
    }
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
  async function _fetchMedicationDetailsInTab({ tabId, baseUrl, visits, skipRowIds }) {
    const skip = skipRowIds instanceof Set ? skipRowIds : new Set(skipRowIds || []);
    const reqs = visits.map((v) => ({
      row_ID: v.row_ID || v.rowid || v.rowID || "",
      // Keep parent fields needed by adaptMedicationFromDetail.
      parent: {
        func_DATE: v.func_DATE || v.func_date || "",
        icd9cm_CODE: v.icd9cm_CODE || v.icd9cm_code || "",
        icd9cm_CODE_CNAME: v.icd9cm_CODE_CNAME || v.icd9cm_name || "",
        hosp_ABBR: v.hosp_ABBR || v.hosp_abbr || ""
      }
    })).filter((r) => r.row_ID && !skip.has(r.row_ID));
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
  async function _fetchChronicMedicationDetailsInTab({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v) => ({
      row_ID: v.row_ID || v.rowid || v.rowID || "",
      // Chronic list rows always have ori_TYPE; fall back to brute-
      // force only if NHI ever ships a row without it.
      ctype: String(v.ori_TYPE || v.ori_type || "")
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
          const url = `${base}/api/ihke3000/IHKE3306S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype)}`;
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
        async function one(rowId, declaredCtype) {
          const seq = declaredCtype ? [declaredCtype, ...[1, 2, 8, 3, 4].filter((c) => String(c) !== String(declaredCtype))] : [1, 2, 8, 3, 4];
          for (const ct of seq) {
            const r = await fetchOne(rowId, ct);
            if (r.error === "SESSION_EXPIRED") return r;
            if (r.error) continue;
            const main = Array.isArray(r.body?.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
            const hasDrugs = main.some(
              (v) => Array.isArray(v?.sp_IHKE3306S03_data_list) && v.sp_IHKE3306S03_data_list.length > 0
            );
            if (hasDrugs) return r;
          }
          return null;
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
    const drugs = [];
    const results = result?.results || [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (!r || r.error || !r.body) continue;
      const main = Array.isArray(r.body.ihke3306S02_main_data) ? r.body.ihke3306S02_main_data : [];
      for (const visit of main) {
        const drugList = Array.isArray(visit.sp_IHKE3306S03_data_list) ? visit.sp_IHKE3306S03_data_list : [];
        for (const d of drugList) {
          const adapted = adaptMedicationFromDetail(d, visit, { is_chronic: true });
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
  async function _fetchProcedureDetailsInTab({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v) => ({
      row_ID: v.row_ID || v.row_id || v.rowid || v.rowID || "",
      ctype: v.ori_type || v.ori_TYPE || ""
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
          const url = `${base}/api/ihke3000/IHKE3308S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${encodeURIComponent(ctype)}`;
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
        async function one(rowId, preferred) {
          const candidates = [];
          if (preferred) candidates.push(preferred);
          for (const ct of ["3", "5", "1", "2", "4"]) {
            if (!candidates.includes(ct)) candidates.push(ct);
          }
          let lastOk = null;
          for (const ct of candidates) {
            const r = await fetchOne(rowId, ct);
            if (r.error === "SESSION_EXPIRED") return r;
            if (r.error) continue;
            const main = Array.isArray(r.body?.ihke3308S02_main_data) ? r.body.ihke3308S02_main_data : [];
            if (main.length > 0) return r;
            lastOk = r;
          }
          return lastOk || { error: "no detail body" };
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
    const procedures = [];
    const results = result?.results || [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (!r || r.error || !r.body) continue;
      const main = Array.isArray(r.body.ihke3308S02_main_data) ? r.body.ihke3308S02_main_data : [];
      for (const row of main) {
        const adapted = adaptProcedureFromDetail(row);
        if (adapted) procedures.push(adapted);
      }
    }
    return procedures;
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
        async function fetchOne(rowId, ctype) {
          const url = `${base}/api/ihke3000/IHKE3303S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${ctype}`;
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
          for (const ct of [2, 1, 3, 4, 5]) {
            const r = await fetchOne(rowId, ct);
            if (r.error === "SESSION_EXPIRED") return r;
            if (r.error) continue;
            const main = r.body?.ihke3303S02_main_data || [];
            if (main.length > 0) return { body: r.body, ctype: ct };
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
  async function _fetchInpatientDetailsInTab({ tabId, baseUrl, visits }) {
    const reqs = visits.map((v, idx) => ({ idx, row_ID: v.row_ID || v.row_id || v.roW_ID || "" })).filter((r) => r.row_ID);
    if (reqs.length === 0) return /* @__PURE__ */ new Map();
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: async (base, items) => {
        const token = sessionStorage.getItem("token");
        if (!token) return { error: "SESSION_EXPIRED" };
        if (location.href.includes("IHKE3001S99") || location.href.includes("IDLE")) {
          return { error: "SESSION_EXPIRED" };
        }
        const auth = `Bearer ${token}`;
        async function fetchOne(rowId) {
          for (const ct of [3, 2, 1]) {
            const url = `${base}/api/ihke3000/IHKE3309S02/page_load?crid=${encodeURIComponent(rowId)}&ctype=${ct}`;
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
              if (!r.ok) continue;
              const body = await r.json();
              const main = body?.ihke3309S02_main_data || [];
              if (main.length > 0) return { body };
            } catch (e) {
              clearTimeout(tm);
              if (e?.name !== "AbortError") continue;
              return { error: "timeout 30s" };
            }
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
            out[i] = await fetchOne(items[i].row_ID);
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
  function _pickS02MainRow(body) {
    if (!body || typeof body !== "object") return null;
    for (const k of Object.keys(body)) {
      if (/^ihke\d+S02_main_data$/i.test(k) && Array.isArray(body[k]) && body[k].length > 0) {
        return body[k][0];
      }
    }
    return null;
  }
  function _classFromS02Detail(body) {
    const main = _pickS02MainRow(body);
    if (!main) return null;
    const tn = String(main.hosp_DATA_TYPE_NAME || "");
    if (tn.includes("\u6025")) return "EMER";
    if (tn.includes("\u4F4F\u9662")) return "IMP";
    return "AMB";
  }
  function _primaryIcdFromS02Detail(body) {
    const main = _pickS02MainRow(body);
    if (!main) return null;
    const codeName = main.icd9cm_CODE_CNAME || main.icd9cm_code_cname || "";
    if (!codeName) return null;
    const code = main.icd9cm_CODE || main.icd9cm_code || "";
    const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
    const pickHalf = (s, half) => {
      const str = String(s || "");
      const idx = str.indexOf("||");
      if (idx === -1) return str.trim();
      if (half === "zh") return str.slice(0, idx).trim() || str.slice(idx + 2).trim();
      return str.slice(idx + 2).trim() || str.slice(0, idx).trim();
    };
    const name_en = stripIcdPrefix(pickHalf(codeName, "en"));
    const name_zh = stripIcdPrefix(pickHalf(codeName, "zh"));
    if (!code && !name_en && !name_zh) return null;
    return { code, name_en, name_zh };
  }
  function _secondaryIcdsFromS02Detail(body) {
    const main = _pickS02MainRow(body);
    if (!main) return [];
    const list = Array.isArray(main.icdcode_data) ? main.icdcode_data : [];
    const out = [];
    const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
    const pickHalf = (s, half) => {
      const str = String(s || "");
      const idx = str.indexOf("||");
      if (idx === -1) return str.trim();
      if (half === "zh") return str.slice(0, idx).trim() || str.slice(idx + 2).trim();
      return str.slice(idx + 2).trim() || str.slice(0, idx).trim();
    };
    for (const item of list) {
      const codeName = item?.icd_code_name || item?.icd_CODE_NAME || "";
      const codeMatch = String(codeName).match(/^([A-Z0-9.]+)\//);
      const code = codeMatch ? codeMatch[1] : "";
      const name_en = stripIcdPrefix(pickHalf(codeName, "en"));
      const name_zh = stripIcdPrefix(pickHalf(codeName, "zh"));
      if (!code && !name_en && !name_zh) continue;
      out.push({ code, name_en, name_zh });
    }
    return out;
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
    "procedures",
    "immunizations"
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
        await chrome.storage.session.remove(PENDING_BUNDLE_KEY).catch(() => {
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
  var PENDING_BUNDLE_TTL_MS = 60 * 60 * 1e3;
  var PENDING_BUNDLE_SWEEP_ALARM = "pending-bundle-sweep";
  var DEBUG_STASH_BODY_SAMPLES = false;
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
    await chrome.storage.session.set({
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
          progress: "\u26D4 \u8ACB\u5148\u5230\u300C\u2461 \u60A8\u7684\u8CC7\u6599\u300D\u586B\u5BEB\u8CC7\u6599\u5F8C\u518D\u8A66",
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
    const pharmacyRowIds = /* @__PURE__ */ new Set();
    for (const name of ["medications", "chronic_prescriptions"]) {
      const idx = NHI_API_ENDPOINTS.findIndex((e) => e.name === name);
      if (idx < 0 || settled[idx]?.status !== "fulfilled") continue;
      for (const v of settled[idx].value.rawList || []) {
        const id = v.row_ID || v.rowid || v.rowID;
        const oriTypeName = v.ori_TYPE_NAME || v.ori_type_name || "";
        if (id && oriTypeName.includes("\u85E5\u5C40")) {
          pharmacyRowIds.add(id);
        }
      }
    }
    const encIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "encounters");
    if (encIdx >= 0 && settled[encIdx].status === "fulfilled") {
      const visits = settled[encIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const detailMap = await _withProgressTimer(
            (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5C31\u91AB\u7D00\u9304\u8A73\u60C5\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5C31\u91AB\u7D00\u9304\u8A73\u60C5\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
            () => _fetchEncounterDetailsInTab({ tabId, baseUrl: BASE, visits })
          );
          const reAdapted = [];
          for (let i = 0; i < visits.length; i++) {
            const detail = detailMap?.get(i) || null;
            const cls = _classFromS02Detail(detail) || "AMB";
            const secondaryDiagnoses = _secondaryIcdsFromS02Detail(detail);
            const primaryDiagnosis = _primaryIcdFromS02Detail(detail);
            const visit = visits[i];
            const rowId = visit.roW_ID || visit.row_id || visit.row_ID;
            const isPharmacy = rowId ? pharmacyRowIds.has(rowId) : false;
            const it = adaptEncounterFromMedExpense(visit, cls, {
              pharmacy: isPharmacy,
              primary_diagnosis: primaryDiagnosis,
              secondary_diagnoses: secondaryDiagnoses
            });
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
    const inpIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "inpatient");
    if (inpIdx >= 0 && settled[inpIdx].status === "fulfilled") {
      const visits = settled[inpIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const detailMap = await _withProgressTimer(
            (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u4F4F\u9662\u7D00\u9304\u8A73\u60C5\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u4F4F\u9662\u7D00\u9304\u8A73\u60C5\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
            () => _fetchInpatientDetailsInTab({ tabId, baseUrl: BASE, visits })
          );
          const reAdapted = [];
          for (let i = 0; i < visits.length; i++) {
            const detail = detailMap?.get(i) || null;
            const primaryDiagnosis = _primaryIcdFromS02Detail(detail);
            const secondaryDiagnoses = _secondaryIcdsFromS02Detail(detail);
            const it = adaptInpatientEncounter(visits[i], {
              primary_diagnosis: primaryDiagnosis,
              secondary_diagnoses: secondaryDiagnoses
            });
            if (it) reAdapted.push(it);
          }
          settled[inpIdx].value.items = reAdapted;
          settled[inpIdx].value.raw_count = reAdapted.length;
        } catch (e) {
          errors.push(`inpatient detail: ${e.message}`);
        }
      }
    }
    _markPhase("inpatient-detail");
    const imgIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "imaging");
    if (imgIdx >= 0 && settled[imgIdx].status === "fulfilled") {
      const visits = settled[imgIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const reports = await _withProgressTimer(
            (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5F71\u50CF\u6AA2\u67E5\u5831\u544A\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u5F71\u50CF\u6AA2\u67E5\u5831\u544A\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
            () => _fetchImagingDetailsInTab({ tabId, baseUrl: BASE, visits })
          );
          settled[imgIdx].value.items = reports;
          settled[imgIdx].value.raw_count = reports.length;
          settled[imgIdx].value.visitCount = visits.length;
        } catch (e) {
          errors.push(`imaging detail: ${e.message}`);
        }
      }
    }
    _markPhase("imaging-detail");
    const procIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "procedures");
    if (procIdx >= 0 && settled[procIdx].status === "fulfilled") {
      const visits = settled[procIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const procs = await _withProgressTimer(
            (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u8655\u7F6E/\u624B\u8853\u8A73\u60C5\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u8655\u7F6E/\u624B\u8853\u8A73\u60C5\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
            () => _fetchProcedureDetailsInTab({ tabId, baseUrl: BASE, visits })
          );
          settled[procIdx].value.items = procs;
          settled[procIdx].value.raw_count = procs.length;
          settled[procIdx].value.visitCount = visits.length;
        } catch (e) {
          errors.push(`procedures detail: ${e.message}`);
        }
      }
    }
    _markPhase("procedures-detail");
    const chronicRowIds = /* @__PURE__ */ new Set();
    const chronicIdx = NHI_API_ENDPOINTS.findIndex(
      (e) => e.name === "chronic_prescriptions"
    );
    if (chronicIdx >= 0 && settled[chronicIdx].status === "fulfilled") {
      const visits = settled[chronicIdx].value.rawList || [];
      if (visits.length > 0) {
        try {
          const drugItems = await _withProgressTimer(
            (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u6162\u6027\u8655\u65B9\u7B8B\u2026` : `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u6162\u6027\u8655\u65B9\u7B8B\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
            () => _fetchChronicMedicationDetailsInTab({ tabId, baseUrl: BASE, visits })
          );
          settled[chronicIdx].value.items = drugItems;
          settled[chronicIdx].value.visitCount = visits.length;
          settled[chronicIdx].value.raw_count = drugItems.length;
          for (const v of visits) {
            const id = v.row_ID || v.rowid || v.rowID;
            if (id) chronicRowIds.add(id);
          }
        } catch (e) {
          errors.push(`chronic prescriptions detail: ${e.message}`);
        }
      }
    }
    _markPhase("chronic-detail");
    const medIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "medications");
    if (medIdx >= 0 && settled[medIdx].status === "fulfilled") {
      const visits = settled[medIdx].value.rawList || [];
      if (visits.length > 0) {
        const remaining = visits.filter((v) => {
          const id = v.row_ID || v.rowid || v.rowID;
          return id && !chronicRowIds.has(id);
        }).length;
        try {
          const drugItems = await _withProgressTimer(
            (sec) => sec === 0 ? `\u{1F4E5} \u53D6\u5F97 ${remaining} \u7B46\u7528\u85E5\u660E\u7D30\u2026` : `\u{1F4E5} \u53D6\u5F97 ${remaining} \u7B46\u7528\u85E5\u660E\u7D30\u2026\uFF08\u5DF2 ${sec} \u79D2\uFF09`,
            () => _fetchMedicationDetailsInTab({
              tabId,
              baseUrl: BASE,
              visits,
              skipRowIds: chronicRowIds
            })
          );
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
      if (DEBUG_STASH_BODY_SAMPLES && raw_count > 0 && items.length === 0) {
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
        await setStatus({ progress: `\u{1F4BE} \u6E96\u5099 ${total} \u7B46\u5065\u5EB7\u8CC7\u6599\u2026`, totalResources: total });
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
          progress: `\u2B06\uFE0F \u4E0A\u50B3 ${ENDPOINT_LABEL_ZH[page_type] ?? page_type}\uFF08${items.length} \u7B46\uFF09\u2026`,
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
          await setStatus({ progress: "\u{1F4E6} \u6574\u7406\u4F3A\u670D\u5668\u4E0A\u7684\u5B8C\u6574\u8CC7\u6599\u2026", totalResources: total });
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
    try {
      const all = await chrome.storage.local.get(null);
      const stale = Object.keys(all).filter(
        (k) => k === "pendingFhirBundle" || k.startsWith("__sampleBody_")
      );
      if (stale.length) await chrome.storage.local.remove(stale);
    } catch {
    }
  });
  chrome.runtime.onStartup?.addListener?.(() => {
    migrateSyncToLocal();
  });
  migrateSyncToLocal();
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (sender?.id !== chrome.runtime.id) return;
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
                progress: "\u{1F512} \u5065\u4FDD\u5B58\u647A\u767B\u5165\u903E\u6642 \u2014 \u8ACB\u56DE\u5230\u5065\u4FDD\u5B58\u647A\u5206\u9801\u91CD\u65B0\u767B\u5165\uFF0C\u7136\u5F8C\u518D\u6309\u300C\u53D6\u5F97\u5065\u4FDD\u5B58\u647A\u8CC7\u6599\u300D",
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
            const fhirPid = derivePatientId(ctx.patientId);
            await fetch(
              `${ctx.backend}/sync/patient/${encodeURIComponent(fhirPid)}`,
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
  chrome.alarms.create(PENDING_BUNDLE_SWEEP_ALARM, { periodInMinutes: 10 });
  async function _sweepPendingBundleIfStale() {
    try {
      const { [PENDING_BUNDLE_KEY]: pending } = await chrome.storage.session.get(PENDING_BUNDLE_KEY);
      if (!pending) return;
      const age = Date.now() - (pending.generatedAt || 0);
      if (age > PENDING_BUNDLE_TTL_MS) {
        await chrome.storage.session.remove(PENDING_BUNDLE_KEY);
      }
    } catch {
    }
  }
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === PENDING_BUNDLE_SWEEP_ALARM) {
      _sweepPendingBundleIfStale();
    }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2ltbXVuaXphdGlvbi50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9uaGktYWRhcHRlcnMuanMiLCAiLi4vc3JjL25oaS1lbmRwb2ludHMuanMiLCAiLi4vc3JjL2JhY2tncm91bmQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG4gKiBbanMtc2hhMV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1zaGExfVxuICpcbiAqIEB2ZXJzaW9uIDAuNy4wXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMjRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4vKmpzbGludCBiaXR3aXNlOiB0cnVlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgSU5QVVRfRVJST1IgPSAnaW5wdXQgaXMgaW52YWxpZCB0eXBlJztcbiAgdmFyIEZJTkFMSVpFX0VSUk9SID0gJ2ZpbmFsaXplIGFscmVhZHkgY2FsbGVkJztcbiAgdmFyIFdJTkRPVyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnO1xuICB2YXIgcm9vdCA9IFdJTkRPVyA/IHdpbmRvdyA6IHt9O1xuICBpZiAocm9vdC5KU19TSEExX05PX1dJTkRPVykge1xuICAgIFdJTkRPVyA9IGZhbHNlO1xuICB9XG4gIHZhciBXRUJfV09SS0VSID0gIVdJTkRPVyAmJiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCc7XG4gIHZhciBOT0RFX0pTID0gIXJvb3QuSlNfU0hBMV9OT19OT0RFX0pTICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgaWYgKE5PREVfSlMpIHtcbiAgICByb290ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFdFQl9XT1JLRVIpIHtcbiAgICByb290ID0gc2VsZjtcbiAgfVxuICB2YXIgQ09NTU9OX0pTID0gIXJvb3QuSlNfU0hBMV9OT19DT01NT05fSlMgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHM7XG4gIHZhciBBTUQgPSB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQ7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAhcm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUiAmJiB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcbiAgdmFyIEVYVFJBID0gWy0yMTQ3NDgzNjQ4LCA4Mzg4NjA4LCAzMjc2OCwgMTI4XTtcbiAgdmFyIFNISUZUID0gWzI0LCAxNiwgOCwgMF07XG4gIHZhciBPVVRQVVRfVFlQRVMgPSBbJ2hleCcsICdhcnJheScsICdkaWdlc3QnLCAnYXJyYXlCdWZmZXInXTtcblxuICB2YXIgYmxvY2tzID0gW107XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICBpZiAocm9vdC5KU19TSEExX05PX05PREVfSlMgfHwgIWlzQXJyYXkpIHtcbiAgICBpc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3O1xuICBpZiAoQVJSQVlfQlVGRkVSICYmIChyb290LkpTX1NIQTFfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgfHwgIWlzVmlldykpIHtcbiAgICBpc1ZpZXcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmJ1ZmZlciAmJiBvYmouYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcjtcbiAgICB9O1xuICB9XG5cbiAgLy8gW21lc3NhZ2U6IHN0cmluZywgaXNTdHJpbmc6IGJvb2xdXG4gIHZhciBmb3JtYXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXNzYWdlO1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIFttZXNzYWdlLCB0cnVlXTtcbiAgICB9XG4gICAgaWYgKHR5cGUgIT09ICdvYmplY3QnIHx8IG1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChBUlJBWV9CVUZGRVIgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBbbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSksIGZhbHNlXTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KG1lc3NhZ2UpICYmICFpc1ZpZXcobWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGNyZWF0ZU91dHB1dE1ldGhvZCA9IGZ1bmN0aW9uIChvdXRwdXRUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IFNoYTEodHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2QgPSBjcmVhdGVPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIGlmIChOT0RFX0pTKSB7XG4gICAgICBtZXRob2QgPSBub2RlV3JhcChtZXRob2QpO1xuICAgIH1cbiAgICBtZXRob2QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKCk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuY3JlYXRlKCkudXBkYXRlKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPVVRQVVRfVFlQRVMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0eXBlID0gT1VUUFVUX1RZUEVTW2ldO1xuICAgICAgbWV0aG9kW3R5cGVdID0gY3JlYXRlT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIHZhciBub2RlV3JhcCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgICB2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgIHZhciBidWZmZXJGcm9tO1xuICAgIGlmIChCdWZmZXIuZnJvbSAmJiAhcm9vdC5KU19TSEExX05PX0JVRkZFUl9GUk9NKSB7XG4gICAgICBidWZmZXJGcm9tID0gQnVmZmVyLmZyb207XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlckZyb20gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihtZXNzYWdlKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBub2RlTWV0aG9kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKG1lc3NhZ2UsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSBudWxsIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG1lc3NhZ2UpIHx8IGlzVmlldyhtZXNzYWdlKSB8fFxuICAgICAgICBtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ1ZmZlckZyb20obWVzc2FnZSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGVNZXRob2Q7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSwgdHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlSG1hY01ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlSG1hY091dHB1dE1ldGhvZCgnaGV4Jyk7XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgSG1hY1NoYTEoa2V5KTtcbiAgICB9O1xuICAgIG1ldGhvZC51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZShrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QodHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRob2Q7XG4gIH07XG5cbiAgZnVuY3Rpb24gU2hhMShzaGFyZWRNZW1vcnkpIHtcbiAgICBpZiAoc2hhcmVkTWVtb3J5KSB7XG4gICAgICBibG9ja3NbMF0gPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICBibG9ja3NbOF0gPSBibG9ja3NbOV0gPSBibG9ja3NbMTBdID0gYmxvY2tzWzExXSA9XG4gICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICB9XG5cbiAgICB0aGlzLmgwID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmgxID0gMHhFRkNEQUI4OTtcbiAgICB0aGlzLmgyID0gMHg5OEJBRENGRTtcbiAgICB0aGlzLmgzID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmg0ID0gMHhDM0QyRTFGMDtcblxuICAgIHRoaXMuYmxvY2sgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMDtcbiAgICB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJzdCA9IHRydWU7XG4gIH1cblxuICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEZJTkFMSVpFX0VSUk9SKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShtZXNzYWdlKTtcbiAgICBtZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgIHZhciBpc1N0cmluZyA9IHJlc3VsdFsxXTtcbiAgICB2YXIgY29kZSwgaW5kZXggPSAwLCBpLCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCB8fCAwLCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgICAgIGJsb2Nrc1swXSA9IHRoaXMuYmxvY2s7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYoaXNTdHJpbmcpIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gY29kZSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvZGUgPSAweDEwMDAwICsgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhmMCB8IChjb2RlID4+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSB0aGlzLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgNjQ7ICsraW5kZXgpIHtcbiAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaTtcbiAgICAgIHRoaXMuYnl0ZXMgKz0gaSAtIHRoaXMuc3RhcnQ7XG4gICAgICBpZiAoaSA+PSA2NCkge1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGkgLSA2NDtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDA7XG4gICAgICB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgdmFyIGJsb2NrcyA9IHRoaXMuYmxvY2tzLCBpID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgIGJsb2Nrc1sxNl0gPSB0aGlzLmJsb2NrO1xuICAgIGJsb2Nrc1tpID4+PiAyXSB8PSBFWFRSQVtpICYgM107XG4gICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgaWYgKGkgPj0gNTYpIHtcbiAgICAgIGlmICghdGhpcy5oYXNoZWQpIHtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgfVxuICAgIGJsb2Nrc1sxNF0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjk7XG4gICAgYmxvY2tzWzE1XSA9IHRoaXMuYnl0ZXMgPDwgMztcbiAgICB0aGlzLmhhc2goKTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhID0gdGhpcy5oMCwgYiA9IHRoaXMuaDEsIGMgPSB0aGlzLmgyLCBkID0gdGhpcy5oMywgZSA9IHRoaXMuaDQ7XG4gICAgdmFyIGYsIGosIHQsIGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgZm9yKGogPSAxNjsgaiA8IDgwOyArK2opIHtcbiAgICAgIHQgPSBibG9ja3NbaiAtIDNdIF4gYmxvY2tzW2ogLSA4XSBeIGJsb2Nrc1tqIC0gMTRdIF4gYmxvY2tzW2ogLSAxNl07XG4gICAgICBibG9ja3Nbal0gPSAgKHQgPDwgMSkgfCAodCA+Pj4gMzEpO1xuICAgIH1cblxuICAgIGZvcihqID0gMDsgaiA8IDIwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IChhICYgYikgfCAoKH5hKSAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoKH5lKSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoKH5kKSAmIGEpO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IChjICYgZCkgfCAoKH5jKSAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgNDA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IGEgXiBiIF4gYztcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IGMgXiBkIF4gZTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDYwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSAtIDE4OTQwMDc1ODggKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKGEgJiBjKSB8IChiICYgYyk7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gKGUgJiBhKSB8IChlICYgYikgfCAoYSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoZCAmIGEpIHwgKGUgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKGMgJiBlKSB8IChkICYgZSk7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA4MDsgaiArPSA1KSB7XG4gICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSA4OTk0OTc1MTQgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSBkIF4gZSBeIGE7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IHRoaXMuaDAgKyBhIDw8IDA7XG4gICAgdGhpcy5oMSA9IHRoaXMuaDEgKyBiIDw8IDA7XG4gICAgdGhpcy5oMiA9IHRoaXMuaDIgKyBjIDw8IDA7XG4gICAgdGhpcy5oMyA9IHRoaXMuaDMgKyBkIDw8IDA7XG4gICAgdGhpcy5oNCA9IHRoaXMuaDQgKyBlIDw8IDA7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBoMCA9IHRoaXMuaDAsIGgxID0gdGhpcy5oMSwgaDIgPSB0aGlzLmgyLCBoMyA9IHRoaXMuaDMsIGg0ID0gdGhpcy5oNDtcblxuICAgIHJldHVybiBIRVhfQ0hBUlNbKGgwID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDAgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gyICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDMgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toNCAmIDB4MEZdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLnRvU3RyaW5nID0gU2hhMS5wcm90b3R5cGUuaGV4O1xuXG4gIFNoYTEucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gW1xuICAgICAgKGgwID4+PiAyNCkgJiAweEZGLCAoaDAgPj4+IDE2KSAmIDB4RkYsIChoMCA+Pj4gOCkgJiAweEZGLCBoMCAmIDB4RkYsXG4gICAgICAoaDEgPj4+IDI0KSAmIDB4RkYsIChoMSA+Pj4gMTYpICYgMHhGRiwgKGgxID4+PiA4KSAmIDB4RkYsIGgxICYgMHhGRixcbiAgICAgIChoMiA+Pj4gMjQpICYgMHhGRiwgKGgyID4+PiAxNikgJiAweEZGLCAoaDIgPj4+IDgpICYgMHhGRiwgaDIgJiAweEZGLFxuICAgICAgKGgzID4+PiAyNCkgJiAweEZGLCAoaDMgPj4+IDE2KSAmIDB4RkYsIChoMyA+Pj4gOCkgJiAweEZGLCBoMyAmIDB4RkYsXG4gICAgICAoaDQgPj4+IDI0KSAmIDB4RkYsIChoNCA+Pj4gMTYpICYgMHhGRiwgKGg0ID4+PiA4KSAmIDB4RkYsIGg0ICYgMHhGRlxuICAgIF07XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXkgPSBTaGExLnByb3RvdHlwZS5kaWdlc3Q7XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG4gICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDAsIHRoaXMuaDApO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMig0LCB0aGlzLmgxKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoOCwgdGhpcy5oMik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDEyLCB0aGlzLmgzKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoMTYsIHRoaXMuaDQpO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgZnVuY3Rpb24gSG1hY1NoYTEoa2V5LCBzaGFyZWRNZW1vcnkpIHtcbiAgICB2YXIgaSwgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShrZXkpO1xuICAgIGtleSA9IHJlc3VsdFswXTtcbiAgICBpZiAocmVzdWx0WzFdKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgbGVuZ3RoID0ga2V5Lmxlbmd0aCwgaW5kZXggPSAwLCBjb2RlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvZGUgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4YzAgfCAoY29kZSA+Pj4gNikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHhlMCB8IChjb2RlID4+PiAxMikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweDNmZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gNikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8IChjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBrZXkgPSBieXRlcztcbiAgICB9XG5cbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDY0KSB7XG4gICAgICBrZXkgPSAobmV3IFNoYTEodHJ1ZSkpLnVwZGF0ZShrZXkpLmFycmF5KCk7XG4gICAgfVxuXG4gICAgdmFyIG9LZXlQYWQgPSBbXSwgaUtleVBhZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgKytpKSB7XG4gICAgICB2YXIgYiA9IGtleVtpXSB8fCAwO1xuICAgICAgb0tleVBhZFtpXSA9IDB4NWMgXiBiO1xuICAgICAgaUtleVBhZFtpXSA9IDB4MzYgXiBiO1xuICAgIH1cblxuICAgIFNoYTEuY2FsbCh0aGlzLCBzaGFyZWRNZW1vcnkpO1xuXG4gICAgdGhpcy51cGRhdGUoaUtleVBhZCk7XG4gICAgdGhpcy5vS2V5UGFkID0gb0tleVBhZDtcbiAgICB0aGlzLmlubmVyID0gdHJ1ZTtcbiAgICB0aGlzLnNoYXJlZE1lbW9yeSA9IHNoYXJlZE1lbW9yeTtcbiAgfVxuICBIbWFjU2hhMS5wcm90b3R5cGUgPSBuZXcgU2hhMSgpO1xuXG4gIEhtYWNTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICB0aGlzLmlubmVyID0gZmFsc2U7XG4gICAgICB2YXIgaW5uZXJIYXNoID0gdGhpcy5hcnJheSgpO1xuICAgICAgU2hhMS5jYWxsKHRoaXMsIHRoaXMuc2hhcmVkTWVtb3J5KTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMub0tleVBhZCk7XG4gICAgICB0aGlzLnVwZGF0ZShpbm5lckhhc2gpO1xuICAgICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV4cG9ydHMgPSBjcmVhdGVNZXRob2QoKTtcbiAgZXhwb3J0cy5zaGExID0gZXhwb3J0cztcbiAgZXhwb3J0cy5zaGExLmhtYWMgPSBjcmVhdGVIbWFjTWV0aG9kKCk7XG5cbiAgaWYgKENPTU1PTl9KUykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiAgfSBlbHNlIHtcbiAgICByb290LnNoYTEgPSBleHBvcnRzO1xuICAgIGlmIChBTUQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwgIi8qKlxuICogQ2VudHJhbGlzZWQgRkhJUiBDb2RlU3lzdGVtIC8gSWRlbnRpZmllclN5c3RlbSBVUklzIHVzZWQgYnkgdGhlIG1hcHBlcnMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvZmhpci9zeXN0ZW1zLnB5YC4gV2UgdXNlIFVSTC1mb3JtIHN5c3RlbXMgaW5zdGVhZFxuICogb2YgT0lEcyBiZWNhdXNlOlxuICogICAtIGl0IGRvZXNuJ3QgcmVxdWlyZSBtaW50aW5nL293bmluZyBhIHJlYWwgTkhJL1RXIGNvcmUgT0lELFxuICogICAtIGl0J3Mgc2VsZi1kZXNjcmliaW5nIGluIHRvb2xzIHRoYXQgZG9uJ3QgcmVjb2duaXNlIHRoZSBPSUQsXG4gKiAgIC0gaXQgY2xlYW5seSBzdXJ2aXZlcyB0aGUgVFdOSElGSElSIHZhbGlkYXRvcidzIHN5bnRhY3RpYyBjaGVjay5cbiAqXG4gKiBBbGwgc3lzdGVtcyBsaXZlIGhlcmUgc28gYSBzaW5nbGUgY2hhbmdlIHJpcHBsZXMgdG8gZXZlcnkgbWFwcGVyLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgbmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU1MDY1XHU0RkREXHU3RjcyXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIChsYWIgKyBwcm9jZWR1cmUgb3JkZXIgY29kZXMgXHUyMDE0IHNhbWUgbmFtZXNwYWNlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfTUVESUNBTF9PUkRFUl9DT0RFID1cbiAgXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1tZWRpY2FsLW9yZGVyLWNvZGVcIjtcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1ODVFNVx1NTRDMVx1NEVFM1x1NzhCQyAoZHJ1ZyBjb2RlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfRFJVR19DT0RFID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1kcnVnLWNvZGVcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRhaXdhbiBwYXRpZW50IGlkZW50aWZpZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIChUYWl3YW4gbmF0aW9uYWwgSUQpLiAqL1xuZXhwb3J0IGNvbnN0IFRXX05BVElPTkFMX0lEID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9JZGVudGlmaWVyU3lzdGVtL25hdGlvbmFsLWlkXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBmYWxsYmFja3MgKHBlci1kZXBsb3ltZW50LCBOT1QgY3Jvc3Mtc3lzdGVtIGNhbm9uaWNhbCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTEFCX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWxhYlwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLW1lZGljYXRpb25cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUkVQT1JUX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLXJlcG9ydFwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9DT05ESVRJT05fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1wcm9jZWR1cmVcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQUxMRVJHRU5fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtYWxsZXJnZW5cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUEFUSUVOVF9NUk4gPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0lkZW50aWZpZXJTeXN0ZW0vaGlzLW1yblwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgQnJpZGdlLWRlZmluZWQgRW5jb3VudGVyIGRpbWVuc2lvbnMgKHYwLjkuMispIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIE5ISSBlbmNvdW50ZXJzIGNhcnJ5IHR3byBpbmRlcGVuZGVudCBjbGFzc2lmaWNhdGlvbiBkaW1lbnNpb25zOlxuLy8gICBcdTIwMjIga2luZCAgICAgXHUyMDE0IFx1OTU4MFx1OEEzQSAvIFx1NjAyNVx1OEEzQSAvIFx1NEY0Rlx1OTY2MiAvIFx1ODVFNVx1NUM0MCAgICAgICAgIChjbGluaWNhbCB2aXNpdCB0eXBlKVxuLy8gICBcdTIwMjIgY2hhbm5lbCAgXHUyMDE0IElDXHU1MzYxXHU4Q0M3XHU2NTk5IC8gXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5ICAgICAgICAgICAgICAgKE5ISSBkYXRhIG9yaWdpbilcbi8vXG4vLyBGSElSJ3MgYEVuY291bnRlci50eXBlYCBpcyAwLi4qIENvZGVhYmxlQ29uY2VwdCB3aXRoIG5vIHBvc2l0aW9uYWxcbi8vIHNlbWFudGljcywgc28gd2UgdGFnIGVhY2ggZW50cnkgd2l0aCBpdHMgb3duIGBjb2Rpbmcuc3lzdGVtYCB0byBtYWtlXG4vLyB0aGUgZGltZW5zaW9uIHNlbGYtZGVzY3JpYmluZy4gQ29uc3VtZXJzIHNob3VsZCBsb29rIHVwIGVudHJpZXMgdmlhXG4vLyAgIGVuY291bnRlci50eXBlLmZpbmQodCA9PiB0LmNvZGluZ1swXS5zeXN0ZW0gPT09IEVOQ09VTlRFUl9LSU5EX1NZU1RFTSlcbi8vIHJhdGhlciB0aGFuIHJlbHlpbmcgb24gYXJyYXkgaW5kZXguIFRoaXMga2VlcHMgdGhlIGNvbnRyYWN0XG4vLyBGSElSLWNvbmZvcm1hbnQgKGFueSBzdGFuZGFyZHMtY29tcGxpYW50IFNNQVJUIGFwcCBjYW4gcGFyc2UgaXRcbi8vIHdpdGhvdXQgbmVlZGluZyB0byBrbm93IG91ciBwcml2YXRlIGFycmF5LW9yZGVyIGNvbnZlbnRpb24pLlxuXG4vKiogQnJpZGdlLWRlZmluZWQga2luZCBkaW1lbnNpb24gb24gRW5jb3VudGVyLnR5cGUuICovXG5leHBvcnQgY29uc3QgRU5DT1VOVEVSX0tJTkRfU1lTVEVNID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5naXRodWIuaW8vQ29kZVN5c3RlbS9lbmNvdW50ZXIta2luZFwiO1xuXG4vKiogQnJpZGdlLWRlZmluZWQgY2hhbm5lbCAoZGF0YSBvcmlnaW4pIGRpbWVuc2lvbiBvbiBFbmNvdW50ZXIudHlwZS4gKi9cbmV4cG9ydCBjb25zdCBFTkNPVU5URVJfQ0hBTk5FTF9TWVNURU0gPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmdpdGh1Yi5pby9Db2RlU3lzdGVtL2VuY291bnRlci1jaGFubmVsXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbnRlcm5hdGlvbmFsIGNvZGUgc3lzdGVtcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGNvbnN0IExPSU5DID0gXCJodHRwOi8vbG9pbmMub3JnXCI7XG5leHBvcnQgY29uc3QgU05PTUVEX0NUID0gXCJodHRwOi8vc25vbWVkLmluZm8vc2N0XCI7XG4vKiogSUNELTEwLUNNIChUYWl3YW4gLyBcdTUwNjVcdTRGREQgdXNlcyB0aGlzLCBub3QgYmFyZSBJQ0QtMTApLiAqL1xuZXhwb3J0IGNvbnN0IElDRF8xMF9DTSA9IFwiaHR0cDovL2hsNy5vcmcvZmhpci9zaWQvaWNkLTEwLWNtXCI7XG5leHBvcnQgY29uc3QgSUNEXzEwX1BDUyA9IFwiaHR0cDovL2hsNy5vcmcvZmhpci9zaWQvaWNkLTEwLXBjc1wiO1xuIiwgIi8qKlxuICogQ3Jvc3MtbWFwcGVyIGhlbHBlcnMgc2hhcmVkIGJ5IHNldmVyYWwgRkhJUiByZXNvdXJjZSBtYXBwZXJzLlxuICovXG5cbmltcG9ydCB7IHNoYTEgfSBmcm9tIFwianMtc2hhMVwiO1xuXG4vKipcbiAqIERldGVybWluaXN0aWMgMzItY2hhciBoZXggSUQgZGVyaXZlZCBmcm9tIHRoZSBwYXRpZW50IElEICsgYXJiaXRyYXJ5XG4gKiBrZXkgcGFydHMuIFNhbWUgU0hBLTEgKyB0cnVuY2F0ZS0zMiBhbGdvcml0aG0gdXNlZCBpbiBib3RoIGJhY2tlbmRcbiAqIGFuZCBleHRlbnNpb24gc28gdGhlIHR3byBwcm9kdWNlIGlkZW50aWNhbCBJRHMgZm9yIHRoZSBzYW1lIGlucHV0IFx1MjAxNFxuICogdGhpcyBpcyB3aGF0IG1ha2VzIFwiZXh0ZW5zaW9uIGxvY2FsIGJ1bmRsZSBcdTIxOTIgYmFja2VuZCAvZmhpci9pbXBvcnRcIlxuICogd29yayB3aXRob3V0IHByb2R1Y2luZyBkdXBsaWNhdGUgUGF0aWVudCByb3dzLlxuICpcbiAqIE5vdGU6IGRldGVybWluaXN0aWMgKyBubyBzYWx0IG1lYW5zIGFuIGF0dGFja2VyIHdobyBvYnRhaW5zIE9OTFkgYVxuICogaGFzaGVkIFBhdGllbnQuaWQgKGUuZy4gdmlhIGFuIEhUVFAgYWNjZXNzIGxvZykgY2FuIGJydXRlLWZvcmNlIHRoZVxuICogfjMwTSBUYWl3YW5lc2UgbmF0aW9uYWwgSUQgc3BhY2UgYW5kIHJlY292ZXIgdGhlIHJhdyBJRC4gV2UgYWNjZXB0XG4gKiB0aGlzIGJlY2F1c2UgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWUgYWxyZWFkeSBjYXJyaWVzIHRoZSByYXdcbiAqIG5hdGlvbmFsIElEIGluIGFueSBsZWFrZWQgQnVuZGxlIFx1MjAxNCB0aGUgcmVhbGlzdGljIEJ1bmRsZS1sZWFrXG4gKiBzY2VuYXJpb3MgZGlzY2xvc2UgYm90aCBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZVxuICogdGhlIG5lZWRsZSB0aGVyZS4gVGhlIHJlbWFpbmluZyBzaW5nbGUtZmllbGQgbGVhayB2ZWN0b3IgaXMgSFRUUFxuICogYWNjZXNzIGxvZ3M7IGRlcGxveW1lbnRzIHNob3VsZCBzY3J1YiBgL2ZoaXIvUGF0aWVudC9bXi9dK2AgcGF0aHNcbiAqIGFuZCBgP3BhdGllbnQ9YCBxdWVyeSBzdHJpbmdzIGF0IHRoZSByZXZlcnNlLXByb3h5IGxheWVyIChzZWVcbiAqIEFSQ0hJVEVDVFVSRS5tZCBcdTAwQTdcIlBhdGllbnQuaWQgXHU1M0NEXHU2M0E4XHU5OEE4XHU5NkFBXHU4MjA3XHU3REU5XHU4OUUzXCIpLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIzNDUwODY2YCBcdTIxOTIgYFAxMjM0NSoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBBbGxlcmd5SW50b2xlcmFuY2UgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9hbGxlcmd5LnB5YC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBBTExPV0VEX0NBVEVHT1JJRVMgPSBuZXcgU2V0KFtcIm1lZGljYXRpb25cIiwgXCJmb29kXCIsIFwiZW52aXJvbm1lbnRcIiwgXCJiaW9sb2dpY1wiXSk7XG5jb25zdCBBTExPV0VEX0NSSVRJQ0FMSVRZID0gbmV3IFNldChbXCJoaWdoXCIsIFwibG93XCIsIFwidW5hYmxlLXRvLWFzc2Vzc1wiXSk7XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJyeG5vcm1cIikpIHJldHVybiBcImh0dHA6Ly93d3cubmxtLm5paC5nb3YvcmVzZWFyY2gvdW1scy9yeG5vcm1cIjtcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0FMTEVSR0VOX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBBbGxlcmd5SW50b2xlcmFuY2UoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBBbGxlcmdlblwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5yZWNvcmRlZF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBwYXRpZW50OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgdmVyaWZpY2F0aW9uU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS12ZXJpZmljYXRpb25cIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgY2F0ZWdvcnkgPSByYXcuY2F0ZWdvcnkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ0FURUdPUklFUy5oYXMoY2F0ZWdvcnkpKSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbY2F0ZWdvcnldO1xuICB9XG5cbiAgY29uc3QgY3JpdGljYWxpdHkgPSByYXcuY3JpdGljYWxpdHkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ1JJVElDQUxJVFkuaGFzKGNyaXRpY2FsaXR5KSkge1xuICAgIHJlc291cmNlLmNyaXRpY2FsaXR5ID0gY3JpdGljYWxpdHk7XG4gIH1cblxuICBpZiAocmF3LnJlY29yZGVkX2RhdGUpIHtcbiAgICByZXNvdXJjZS5yZWNvcmRlZERhdGUgPSBgJHtyYXcucmVjb3JkZWRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgcmVhY3Rpb25Ob3RlID0gcmF3LnJlYWN0aW9uID8/IFwiXCI7XG4gIGlmIChyZWFjdGlvbk5vdGUpIHtcbiAgICByZXNvdXJjZS5yZWFjdGlvbiA9IFt7IGRlc2NyaXB0aW9uOiByZWFjdGlvbk5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBDb25kaXRpb24gbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9jb25kaXRpb24ucHlgLiBJbmNsdWRlcyB0aGUgSUNELTEwLUNNXG4gKiBub3JtYWxpc2VyIChUV05ISUZISVIgUm91bmQtMyBmaXgpIHdoaWNoIGluc2VydHMgdGhlIGNhbm9uaWNhbCBkb3RcbiAqIGJhY2sgaW50byBOSEkncyB1bi1kb3R0ZWQgY29kZXMgKFwiRTExMjJcIiBcdTIxOTIgXCJFMTEuMjJcIikuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuLy8gSUNELTEwLUNNIGNhbm9uaWNhbCBmb3JtIGlzICdYWFguWVlZW0EtWl0nIChjYXRlZ29yeSAzIGNoYXJzICsgb3B0aW9uYWxcbi8vIGRvdCArIHN1YmRpdmlzaW9uICsgb3B0aW9uYWwgN3RoLWNoYXJhY3RlciBleHRlbnNpb24pLiBOSEkgXHU1MDY1XHU0RkREIHNlbmRzXG4vLyBjb2RlcyBXSVRIT1VUIHRoZSBkb3QgKCdFMTEyMicsICdNNDc4OTInLCAnUzA5OTNYQScsICdNMTkyNzEnKS5cbi8vIFZhbGlkYXRvciByZWplY3RzIHVuLWRvdHRlZCBjb2RlcyBhcyAnVW5rbm93biBjb2RlJy5cbmNvbnN0IElDRDEwX0NBVEVHT1JZX1JFID0gL15bQS1aXVswLTlBLVpdezJ9JC87XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBkb3QgYmFjayBpbnRvIE5ISSdzIG5vLWRvdCBJQ0QtMTAtQ00gY29kZXMuXG4gKiAgIEUxMTIyICAgIFx1MjE5MiBFMTEuMjJcbiAqICAgTTQ3ODkyICAgXHUyMTkyIE00Ny44OTJcbiAqICAgUzA5OTNYQSAgXHUyMTkyIFMwOS45M1hBXG4gKiAgIEUxMSAgICAgIFx1MjE5MiBFMTEgICAgICAgIChubyBzdWJkaXZpc2lvbjsgcGFzcyB0aHJvdWdoKVxuICogICBFMTEuMjIgICBcdTIxOTIgRTExLjIyICAgICAoYWxyZWFkeSBkb3R0ZWQ7IHBhc3MgdGhyb3VnaClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUljZDEwQ20oY29kZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghY29kZSB8fCBjb2RlLmluY2x1ZGVzKFwiLlwiKSkgcmV0dXJuIGNvZGUgPz8gXCJcIjtcbiAgY29uc3QgcyA9IGNvZGUudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG4gIGlmIChzLmxlbmd0aCA8PSAzKSByZXR1cm4gcztcbiAgY29uc3QgaGVhZCA9IHMuc2xpY2UoMCwgMyk7XG4gIGNvbnN0IHRhaWwgPSBzLnNsaWNlKDMpO1xuICBpZiAoSUNEMTBfQ0FURUdPUllfUkUudGVzdChoZWFkKSkge1xuICAgIHJldHVybiBgJHtoZWFkfS4ke3RhaWx9YDtcbiAgfVxuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZC0xMFwiKSB8fCBzLmluY2x1ZGVzKFwiaWNkMTBcIikpIHtcbiAgICAvLyBOSEkgXHU1MDY1XHU0RkREIGNvZGVzIGFyZSBJQ0QtMTAtQ00gKFVTL1RhaXdhbiBleHRlbmRlZCBzZXQgXHUyMDE0IGUuZy5cbiAgICAvLyBFMTEuMjIpLiBUaGUgYmFzZSBJQ0QtMTAgVmFsdWVTZXQgcmVqZWN0cyB0aGVzZSBhcyAnVW5rbm93biBjb2RlJy5cbiAgICByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfQ007XG4gIH1cbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0NPTkRJVElPTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQ29uZGl0aW9uKHJhdzogUmVjb3JkPHN0cmluZywgYW55PiwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBDb25kaXRpb25cIjtcbiAgbGV0IGNvZGUgPSByYXcuY29kZSBhcyBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcbiAgaWYgKHN5c3RlbSA9PT0gc3lzdGVtcy5JQ0RfMTBfQ00gJiYgY29kZSkge1xuICAgIGNvZGUgPSBub3JtYWxpemVJY2QxMENtKGNvZGUpO1xuICB9XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkNvbmRpdGlvblwiLFxuICAgIC8vIFN0YWJsZSBpZCBmYWxscyBiYWNrIHRvIGRpc3BsYXkgd2hlbiBubyBjb2RlIGlzIHByZXNlbnQgKGNhdGFzdHJvcGhpY1xuICAgIC8vIGlsbG5lc3Mgcm93cyBmcm9tIElIS0UzMjA5IGNhcnJ5IHRoZSBDaGluZXNlIG5hcnJhdGl2ZSBvbmx5KS4gTWlycm9yc1xuICAgIC8vIHRoZSBzYW1lIGBjb2RlIHx8IGRpc3BsYXlgIHBhdHRlcm4gaW4gZGlhZ25vc3RpYy1yZXBvcnQudHMgYW5kXG4gICAgLy8gYWxsZXJneS50cyBcdTIwMTQgYXZvaWRzIGhhc2ggY29sbGlzaW9ucyBiZXR3ZWVuIHR3byBzYW1lLWRheSBjb2RlLWxlc3NcbiAgICAvLyBjb25kaXRpb25zLlxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3Lm9uc2V0X2RhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY2xpbmljYWxTdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLWNsaW5pY2FsXCIsXG4gICAgICAgICAgY29kZTogcmF3LmNsaW5pY2FsX3N0YXR1cyA/PyBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9jb25kaXRpb24tdmVyLXN0YXR1c1wiLFxuICAgICAgICAgIGNvZGU6IFwiY29uZmlybWVkXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH07XG5cbiAgLy8gQ2F0ZWdvcnkgcm91dGVzIHRoZSBDb25kaXRpb24gaW50byB0aGUgcmlnaHQgZG93bnN0cmVhbSB2aWV3LlxuICAvLyAtIFwicHJvYmxlbS1saXN0LWl0ZW1cIiBcdTIxOTIgU01BUlQgLyBJUFMgUHJvYmxlbSBMaXN0IHNlY3Rpb25cbiAgLy8gLSBcImVuY291bnRlci1kaWFnbm9zaXNcIiBcdTIxOTIgcGVyLWVuY291bnRlciBkaWFnbm9zZXNcbiAgLy8gLSBcImhlYWx0aC1jb25jZXJuXCIgXHUyMTkyIElQUyBIZWFsdGggQ29uY2VybnNcbiAgLy8gQWRhcHRlci1sZXZlbCBkZWNpc2lvbjogXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1IHJvd3MgbWFyayBjYXRlZ29yeT1cInByb2JsZW0tbGlzdC1pdGVtXCI7XG4gIC8vIGdlbmVyaWMgZW5jb3VudGVyLWRlcml2ZWQgY29uZGl0aW9ucyBjYW4gb21pdCwgZGVmYXVsdGluZyB0byBub1xuICAvLyBleHBsaWNpdCBjYXRlZ29yeSAoU01BUlQgYXBwcyBmYWxsIHRocm91Z2ggdG8gYWxsLWNvbmRpdGlvbnMgdmlldykuXG4gIGlmIChyYXcuY2F0ZWdvcnkpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiByYXcuY2F0ZWdvcnksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIHJlc291cmNlLmNvZGUgPSB7XG4gICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICB0ZXh0OiBkaXNwbGF5LFxuICB9O1xuXG4gIGNvbnN0IHNldmVyaXR5ID0gcmF3LnNldmVyaXR5ID8/IFwiXCI7XG4gIGlmIChzZXZlcml0eSkge1xuICAgIHJlc291cmNlLnNldmVyaXR5ID0geyB0ZXh0OiBzZXZlcml0eSB9O1xuICB9XG5cbiAgaWYgKHJhdy5vbnNldF9kYXRlKSB7XG4gICAgcmVzb3VyY2Uub25zZXREYXRlVGltZSA9IGAke3Jhdy5vbnNldF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIERpYWdub3N0aWNSZXBvcnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9kaWFnbm9zdGljX3JlcG9ydC5weWAuIFJldHVybnMgbnVsbCBmb3JcbiAqIGxpc3QtcGFnZSByb3dzIGxhY2tpbmcgYSBjb25jbHVzaW9uLCBhbmQgZm9yIGxhYi12YWx1ZS1vbmx5IFwicmVwb3J0c1wiXG4gKiB0aGF0IHdvdWxkIGR1cGxpY2F0ZSBhIHByb3BlciBPYnNlcnZhdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBWMl8wMDc0ID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIjtcblxuY29uc3QgQ0FURUdPUllfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBMQUI6IFtWMl8wMDc0LCBcIkxBQlwiLCBcIkxhYm9yYXRvcnlcIl0sXG4gIFJBRDogW1YyXzAwNzQsIFwiUkFEXCIsIFwiUmFkaW9sb2d5XCJdLFxuICBDQVI6IFtWMl8wMDc0LCBcIkNBUlwiLCBcIkNhcmRpb2xvZ3lcIl0sXG4gIFBBVEg6IFtWMl8wMDc0LCBcIlBBVFwiLCBcIlBhdGhvbG9neVwiXSxcbn07XG5cbi8vIExhYi1yZXN1bHQgcGF0dGVybnMgdGhhdCBsb29rIGxpa2Ugc2luZ2xlLXZhbHVlIGxhYiByZWFkaW5ncyByYXRoZXJcbi8vIHRoYW4gYSBuYXJyYXRpdmUgcmVwb3J0LlxuY29uc3QgTEFCX1VOSVRfUkUgPVxuICAvXFxkKyg/OlxcLlxcZCspP1xccyooPzolfG1nXFwvZEx8Z1xcL2RMfG1tb2xcXC9MfFVcXC9MfElVXFwvTHxtSVVcXC9MfG5nXFwvbUx8XHUwM0JDZ1xcL2RMfHVnXFwvZEx8cGdcXC9tTHxmTHxcXC91THwxMFxcXj9cXGQrXFwvdUx8eDEwXFxeP1xcZCtcXC91THxzZWN8XHU3OUQyfGNvcGllc1xcL21MKS87XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgdGV4dCA9IGNvbmNsdXNpb24udHJpbSgpO1xuICAvLyBSZWFsIG5hcnJhdGl2ZSByZXBvcnRzIGFsbW9zdCBhbHdheXMgY29udGFpbiBtdWx0aXBsZSBzZW50ZW5jZXMuXG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDEwMCkgcmV0dXJuIGZhbHNlO1xuICAvLyBTaW5nbGUgdmFsdWUgcGF0dGVybiArIHBhcmVudGhldGljYWwgcmVmZXJlbmNlIHJhbmdlID0gbGFiIGxpbmUuXG4gIGlmIChMQUJfVU5JVF9SRS50ZXN0KHRleHQpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwRGlhZ25vc3RpY1JlcG9ydChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgY29uY2x1c2lvbiA9ICgocmF3LmNvbmNsdXNpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY2F0S2V5UmF3ID0gU3RyaW5nKHJhdy5jYXRlZ29yeSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAoY2F0S2V5UmF3ID09PSBcIkxBQlwiICYmIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBSZXBvcnRcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW1IaW50ID0gcmF3LnN5c3RlbSA/PyBcIlwiO1xuICBjb25zdCBzeXN0ZW0gPVxuICAgIHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiICYmIHN5c3RlbUhpbnQudG9VcHBlckNhc2UoKSA9PT0gXCJMT0lOQ1wiXG4gICAgICA/IHN5c3RlbXMuTE9JTkNcbiAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfUkVQT1JUX0NPREU7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJmaW5hbFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgICBjb25jbHVzaW9uLFxuICB9O1xuXG4gIGNvbnN0IGNhdEVudHJ5ID0gQ0FURUdPUllfTUFQW2NhdEtleVJhd107XG4gIGlmIChjYXRFbnRyeSkge1xuICAgIGNvbnN0IFtjYXRTeXMsIGNhdENvZGUsIGNhdERpc3BsYXldID0gY2F0RW50cnk7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbeyBjb2Rpbmc6IFt7IHN5c3RlbTogY2F0U3lzLCBjb2RlOiBjYXRDb2RlLCBkaXNwbGF5OiBjYXREaXNwbGF5IH1dIH1dO1xuICB9XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcuaXNzdWVkKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3Lmlzc3VlZH1UMDA6MDA6MDArMDg6MDBgO1xuICB9IGVsc2UgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IGhvc3BpdGFsIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogRW5jb3VudGVyIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZW5jb3VudGVyLnB5YC4gU3RhYmxlIElEIGluY2x1ZGVzIGhvc3BpdGFsXG4gKiBzbyBzYW1lLWRheSB2aXNpdHMgdG8gZGlmZmVyZW50IGluc3RpdHV0aW9ucyBlYWNoIGdldCB0aGVpciBvd25cbiAqIEVuY291bnRlciAodGhlIHBvc3QtbWFwcGluZyBsaW5rZXIgZGVwZW5kcyBvbiB0aGlzKS5cbiAqL1xuXG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB7IEVOQ09VTlRFUl9DSEFOTkVMX1NZU1RFTSwgRU5DT1VOVEVSX0tJTkRfU1lTVEVNIH0gZnJvbSBcIi4vc3lzdGVtc1wiO1xuXG4vLyBTdGFibGUgbWFjaGluZSBjb2RlcyBmb3IgdGhlIHR3byBFbmNvdW50ZXIudHlwZSBkaW1lbnNpb25zLiBFYWNoIGtpbmRcbi8vIG9yIGNoYW5uZWwgc3RyaW5nIHNlZW4gb24gdGhlIHdpcmUgbWFwcyB0byBhIGxvd2VyY2FzZSBBU0NJSSBjb2RlXG4vLyAoc28gU01BUlQgYXBwcyBjYW4gc3dpdGNoIG9uIGEgc3RhYmxlIGlkZW50aWZpZXIgZXZlbiBpZiB0aGUgQ2hpbmVzZVxuLy8gZGlzcGxheSBsYWJlbCBjaGFuZ2VzKS4gVW5rbm93biB2YWx1ZXMgc3RpbGwgZ2V0IGEgY29kaW5nIGVudHJ5IFx1MjAxNCB3ZVxuLy8ganVzdCBvbWl0IGBjb2RpbmcuY29kZWAgYW5kIHNoaXAgc3lzdGVtICsgZGlzcGxheSwgc28gY29uc3VtZXJzIGNhblxuLy8gc3RpbGwgZmluZCB0aGUgcmlnaHQgdHlwZVtdIGVudHJ5IGJ5IHN5c3RlbSB3aXRob3V0IGNyYXNoaW5nLlxuY29uc3QgS0lORF9DT0RFX01BUDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgXHU5NTgwXHU4QTNBOiBcIm91dHBhdGllbnRcIixcbiAgXHU2MDI1XHU4QTNBOiBcImVtZXJnZW5jeVwiLFxuICBcdTRGNEZcdTk2NjI6IFwiaW5wYXRpZW50XCIsXG4gIFx1ODVFNVx1NUM0MDogXCJwaGFybWFjeVwiLFxufTtcbmNvbnN0IENIQU5ORUxfQ09ERV9NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIFx1NzUzM1x1NTgzMVx1OENDN1x1NjU5OTogXCJjbGFpbXNcIixcbiAgSUNcdTUzNjFcdThDQzdcdTY1OTk6IFwiaWMtY2FyZFwiLFxufTtcblxuZnVuY3Rpb24gYnVpbGRUeXBlRW50cnkoXG4gIHRleHQ6IHN0cmluZyxcbiAgc3lzdGVtOiBzdHJpbmcsXG4gIGNvZGVNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgY29kaW5nOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyBzeXN0ZW0sIGRpc3BsYXk6IHRleHQgfTtcbiAgY29uc3QgY29kZSA9IGNvZGVNYXBbdGV4dF07XG4gIGlmIChjb2RlKSBjb2RpbmcuY29kZSA9IGNvZGU7XG4gIHJldHVybiB7IHRleHQsIGNvZGluZzogW2NvZGluZ10gfTtcbn1cblxuY29uc3QgQUNUQ09ERV9TWVNURU0gPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtQWN0Q29kZVwiO1xuXG5jb25zdCBDTEFTU19NQVA6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4gPSB7XG4gIEFNQjogW0FDVENPREVfU1lTVEVNLCBcIkFNQlwiLCBcImFtYnVsYXRvcnlcIl0sXG4gIElNUDogW0FDVENPREVfU1lTVEVNLCBcIklNUFwiLCBcImlucGF0aWVudCBlbmNvdW50ZXJcIl0sXG4gIEVNRVI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJFTUVSXCIsIFwiZW1lcmdlbmN5XCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEVuY291bnRlcihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGVuY0NsYXNzID0gU3RyaW5nKHJhdy5jbGFzcyA/PyBcIkFNQlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjbGFzc0VudHJ5ID0gQ0xBU1NfTUFQW2VuY0NsYXNzXSA/PyBDTEFTU19NQVAuQU1CITtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiRW5jb3VudGVyXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgcmF3LmRhdGUgPz8gXCJcIiwgZW5jQ2xhc3MsICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmlzaGVkXCIsXG4gICAgY2xhc3M6IHtcbiAgICAgIHN5c3RlbTogY2xhc3NFbnRyeVswXSxcbiAgICAgIGNvZGU6IGNsYXNzRW50cnlbMV0sXG4gICAgICBkaXNwbGF5OiBjbGFzc0VudHJ5WzJdLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICAvLyBFbmNvdW50ZXIudHlwZSBjYXJyaWVzIFRXTyBpbmRlcGVuZGVudCBkaW1lbnNpb25zICh2MC45LjIpOlxuICAvLyAgIFx1MjAyMiBraW5kICAgICBcdTIwMTQgXHU5NTgwXHU4QTNBIC8gXHU2MDI1XHU4QTNBIC8gXHU0RjRGXHU5NjYyIC8gXHU4NUU1XHU1QzQwICAgICAgKGNsaW5pY2FsIHZpc2l0IHR5cGUpXG4gIC8vICAgXHUyMDIyIGNoYW5uZWwgIFx1MjAxNCBJQ1x1NTM2MVx1OENDN1x1NjU5OSAvIFx1NzUzM1x1NTgzMVx1OENDN1x1NjU5OSAgICAgICAgICAgIChOSEkgZGF0YSBvcmlnaW4pXG4gIC8vIEZISVIgUjQgRW5jb3VudGVyLnR5cGUgaXMgMC4uKiwgYnV0IHRoZSBzcGVjIGRlZmluZXMgbm8gcG9zaXRpb25hbFxuICAvLyBzZW1hbnRpY3Mgb24gdHlwZVtdIGVudHJpZXMuIFdlIHRhZyBlYWNoIGVudHJ5IHdpdGggaXRzIG93blxuICAvLyBgY29kaW5nLnN5c3RlbWAgKEVOQ09VTlRFUl9LSU5EX1NZU1RFTSAvIEVOQ09VTlRFUl9DSEFOTkVMX1NZU1RFTSlcbiAgLy8gc28gY29uc3VtZXJzIGNhbiBsb2NhdGUgdGhlIHJpZ2h0IGRpbWVuc2lvbiB2aWFcbiAgLy8gICB0eXBlLmZpbmQodCA9PiB0LmNvZGluZ1swXS5zeXN0ZW0gPT09IEVOQ09VTlRFUl9LSU5EX1NZU1RFTSlcbiAgLy8gcmF0aGVyIHRoYW4gYnkgYXJyYXkgaW5kZXguIFNlbGYtZGVzY3JpYmluZyBhbmQgRkhJUi1jb25mb3JtYW50LlxuICAvL1xuICAvLyBCYWNrd2FyZCBjb21wYXQ6IGxlZ2FjeSBjYWxsZXJzIHRoYXQgc3RpbGwgZW1pdCByYXcudHlwZV9kaXNwbGF5XG4gIC8vIGdldCBhIHNpbmdsZSB0ZXh0LW9ubHkgdHlwZVtdIGVudHJ5ICh0aGUgZGltZW5zaW9uIGlzIHVua25vd2FibGVcbiAgLy8gZnJvbSBhIGJhcmUgc3RyaW5nLCBzbyB3ZSBzaGlwIGl0IGFzLWlzIHdpdGhvdXQgY29kaW5nIFx1MjAxNCBzYW1lIGFzXG4gIC8vIHByZS0wLjkuMiBvdXRwdXQsIHByZXNlcnZlcyB0aGUgb2xkIGNvbnRyYWN0KS5cbiAgY29uc3Qga2luZCA9ICgocmF3LmtpbmQgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGNoYW5uZWwgPSAoKHJhdy5jaGFubmVsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCB0eXBlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGlmIChraW5kKSB0eXBlcy5wdXNoKGJ1aWxkVHlwZUVudHJ5KGtpbmQsIEVOQ09VTlRFUl9LSU5EX1NZU1RFTSwgS0lORF9DT0RFX01BUCkpO1xuICBpZiAoY2hhbm5lbCkge1xuICAgIHR5cGVzLnB1c2goYnVpbGRUeXBlRW50cnkoY2hhbm5lbCwgRU5DT1VOVEVSX0NIQU5ORUxfU1lTVEVNLCBDSEFOTkVMX0NPREVfTUFQKSk7XG4gIH1cbiAgaWYgKHR5cGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IHR5cGVEaXNwbGF5ID0gKChyYXcudHlwZV9kaXNwbGF5ID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGlmICh0eXBlRGlzcGxheSkgdHlwZXMucHVzaCh7IHRleHQ6IHR5cGVEaXNwbGF5IH0pO1xuICB9XG4gIGlmICh0eXBlcy5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UudHlwZSA9IHR5cGVzO1xuICB9XG5cbiAgY29uc3QgcGVyaW9kOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGlmIChyYXcuZGF0ZSkgcGVyaW9kLnN0YXJ0ID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKHJhdy5lbmRfZGF0ZSkgcGVyaW9kLmVuZCA9IGAke3Jhdy5lbmRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAoT2JqZWN0LmtleXMocGVyaW9kKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UucGVyaW9kID0gcGVyaW9kO1xuICB9XG5cbiAgY29uc3QgZGVwYXJ0bWVudCA9IHJhdy5kZXBhcnRtZW50ID8/IFwiXCI7XG4gIGNvbnN0IHByb3ZpZGVyID0gcmF3LnByb3ZpZGVyID8/IFwiXCI7XG4gIGlmIChkZXBhcnRtZW50IHx8IHByb3ZpZGVyKSB7XG4gICAgY29uc3QgcGFydGljaXBhbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAocHJvdmlkZXIpIHBhcnRpY2lwYW50LmluZGl2aWR1YWwgPSB7IGRpc3BsYXk6IHByb3ZpZGVyIH07XG4gICAgcmVzb3VyY2UucGFydGljaXBhbnQgPSBPYmplY3Qua2V5cyhwYXJ0aWNpcGFudCkubGVuZ3RoID4gMCA/IFtwYXJ0aWNpcGFudF0gOiBbXTtcbiAgICBpZiAoZGVwYXJ0bWVudCkge1xuICAgICAgcmVzb3VyY2Uuc2VydmljZVR5cGUgPSB7IHRleHQ6IGRlcGFydG1lbnQgfTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5zZXJ2aWNlUHJvdmlkZXIgPSB7IGRpc3BsYXk6IGhvc3BpdGFsIH07XG4gIH1cblxuICAvLyBCaWxpbmd1YWwgcmVhc29uQ29kZSAodjAuOC4wKS4gQWRhcHRlciBzcGxpdHMgTkhJJ3MgYmlsaW5ndWFsIElDRFxuICAvLyBuYW1lIGludG8gcmF3LnJlYXNvbiAoRW5nbGlzaCkgYW5kIHJhdy5yZWFzb25femggKFx1N0U0MVx1NEUyRCksIHBsdXMgdGhlXG4gIC8vIHJhdyBJQ0QtMTAgY29kZSBpbiByYXcucmVhc29uX2NvZGUuIFBhdGllbnQtZmFjaW5nIC50ZXh0IHVzZXMgXHU3RTQxXHU0RTJEXG4gIC8vIChmYWxscyBiYWNrIHRvIEVuZ2xpc2ggd2hlbiBOSEkgc2hpcHMgRW5nbGlzaC1vbmx5KTsgY29kaW5nW10uZGlzcGxheVxuICAvLyBzdGF5cyBFbmdsaXNoIHdpdGggdGhlIHByb3BlciBJQ0QtMTAtQ00gc3lzdGVtLlxuICAvL1xuICAvLyB2MC45LjAgYWRkcyBzZWNvbmRhcnkgZGlhZ25vc2VzIChcdTZCMjFcdThBM0FcdTY1QjcpIFx1MjAxNCBJSEtFMzMwM1MwMiBkZXRhaWxcbiAgLy8gZXhwb3NlcyB1cCB0byA0IGFkZGl0aW9uYWwgSUNEcyBwZXIgZW5jb3VudGVyLiBUaGV5IGFyZSBwdXNoZWRcbiAgLy8gYWZ0ZXIgdGhlIHByaW1hcnkgc28gU01BUlQgYXBwcyBjYW4gcmVuZGVyIHJlYXNvbkNvZGVbMF0gYXMgdGhlXG4gIC8vIG1haW4gZGlhZ25vc2lzIGFuZCB0aGUgcmVzdCBhcyBzZWNvbmRhcnkgY2hpcHMuXG4gIGNvbnN0IHJlYXNvbkNvZGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgY29uc3QgcmVhc29uID0gKChyYXcucmVhc29uID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCByZWFzb25aaCA9ICgocmF3LnJlYXNvbl96aCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgcmVhc29uQ29kZSA9ICgocmF3LnJlYXNvbl9jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAocmVhc29uIHx8IHJlYXNvblpoIHx8IHJlYXNvbkNvZGUpIHtcbiAgICBjb25zdCByYzogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChyZWFzb25Db2RlKSB7XG4gICAgICAvLyBTdHJpcCB0aGUgXCI8Y29kZT4gXCIgcHJlZml4IHRoZSBhZGFwdGVyIHByZXBlbmRzIHRvIHRoZSBkaXNwbGF5LFxuICAgICAgLy8gc2luY2UgdGhlIHN0cnVjdHVyZWQgYGNvZGVgIGFscmVhZHkgY29udmV5cyB0aGF0IGluZm9ybWF0aW9uLlxuICAgICAgY29uc3QgZGlzcGxheVBsYWluID0gcmVhc29uLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7cmVhc29uQ29kZX1cXFxccytgKSwgXCJcIikudHJpbSgpO1xuICAgICAgcmMuY29kaW5nID0gW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiLFxuICAgICAgICAgIGNvZGU6IHJlYXNvbkNvZGUsXG4gICAgICAgICAgZGlzcGxheTogZGlzcGxheVBsYWluIHx8IHJlYXNvbiB8fCByZWFzb25aaCxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICAgIHJjLnRleHQgPSByZWFzb25aaCB8fCByZWFzb247XG4gICAgcmVhc29uQ29kZXMucHVzaChyYyk7XG4gIH1cbiAgY29uc3Qgc2Vjb25kYXJpZXMgPSBBcnJheS5pc0FycmF5KHJhdy5zZWNvbmRhcnlfZGlhZ25vc2VzKSA/IHJhdy5zZWNvbmRhcnlfZGlhZ25vc2VzIDogW107XG4gIGZvciAoY29uc3Qgc2VjIG9mIHNlY29uZGFyaWVzKSB7XG4gICAgY29uc3QgY29kZSA9ICgoc2VjPy5jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGNvbnN0IG5hbWVFbiA9ICgoc2VjPy5uYW1lX2VuID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGNvbnN0IG5hbWVaaCA9ICgoc2VjPy5uYW1lX3poID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGlmICghY29kZSAmJiAhbmFtZUVuICYmICFuYW1lWmgpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGVudHJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIGVudHJ5LmNvZGluZyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtY21cIixcbiAgICAgICAgICBjb2RlLFxuICAgICAgICAgIGRpc3BsYXk6IG5hbWVFbiB8fCBuYW1lWmgsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICBlbnRyeS50ZXh0ID0gY29kZSA/IGAke2NvZGV9ICR7bmFtZVpoIHx8IG5hbWVFbn1gLnRyaW0oKSA6IG5hbWVaaCB8fCBuYW1lRW47XG4gICAgcmVhc29uQ29kZXMucHVzaChlbnRyeSk7XG4gIH1cbiAgaWYgKHJlYXNvbkNvZGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5yZWFzb25Db2RlID0gcmVhc29uQ29kZXM7XG4gIH1cblxuICBjb25zdCBkaXNjaGFyZ2UgPSByYXcuZGlzY2hhcmdlX2Rpc3Bvc2l0aW9uID8/IFwiXCI7XG4gIGlmIChkaXNjaGFyZ2UpIHtcbiAgICByZXNvdXJjZS5ob3NwaXRhbGl6YXRpb24gPSB7IGRpc2NoYXJnZURpc3Bvc2l0aW9uOiB7IHRleHQ6IGRpc2NoYXJnZSB9IH07XG4gIH1cblxuICBjb25zdCBjbGluaWNhbE5vdGUgPSAoKHJhdy5jbGluaWNhbF9ub3RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoY2xpbmljYWxOb3RlKSB7XG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IGNsaW5pY2FsTm90ZSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIEltbXVuaXphdGlvbiBtYXBwZXIuXG4gKlxuICogTWFwcyBOSEkgSUhLRTMyMDNTMDEgKFx1OTgxMFx1OTYzMlx1NjNBNVx1N0EyRVx1N0QwMFx1OTMwNCkgcm93cyB0byBGSElSIFI0IEltbXVuaXphdGlvbi5cbiAqIE5ISSBzaGlwcyBDaGluZXNlLW9ubHkgdmFjY2luZSBuYW1lcyB3aXRoIG5vIHRlcm1pbm9sb2d5IGNvZGUsIHNvXG4gKiB2YWNjaW5lQ29kZSBjYXJyaWVzIG9ubHkgYHRleHRgIChjbGVhbiBcdTRFMkRcdTY1ODcgbmFtZSB3aXRob3V0IGxvdCBzdWZmaXgpLlxuICogRnV0dXJlIGVuaGFuY2VtZW50OiBhZGQgQ1ZYIC8gU05PTUVEIENUIGNvZGluZyB2aWEgYSBsb29rdXAgdGFibGUuXG4gKlxuICogc3RhdHVzIGlzIGhhcmRjb2RlZCB0byBcImNvbXBsZXRlZFwiIGJlY2F1c2UgXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBIG9ubHkgbGlzdHNcbiAqIGFkbWluaXN0ZXJlZCB2YWNjaW5lcyBcdTIwMTQgdGhlcmUgYXJlIG5vIHBsYW5uZWQgLyBub3QtZ2l2ZW4gZW50cmllcyBpblxuICogTkhJJ3MgcmVzcG9uc2Ugc2hhcGUuXG4gKi9cblxuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBJbW11bml6YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IHZhY2NpbmVOYW1lID0gKChyYXcudmFjY2luZV9uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCBkYXRlID0gKChyYXcuZGF0ZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKCF2YWNjaW5lTmFtZSB8fCAhZGF0ZSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkltbXVuaXphdGlvblwiLFxuICAgIC8vIFN0YWJsZSBpZCB1c2VzIGRhdGUgKyB2YWNjaW5lIG5hbWUgKyBsb3QgXHUyMDE0IHNhbWUgdmFjY2luZSBzYW1lIGRheVxuICAgIC8vIHdpdGggdGhlIHNhbWUgbG90IGNvbGxhcHNlcyAoTkhJIHJhcmUgZWRnZSBjYXNlKTsgZGlmZmVyZW50IGxvdHNcbiAgICAvLyB3b3VsZCBiZSBkaXN0aW5jdCBJbW11bml6YXRpb25zLlxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIHZhY2NpbmVOYW1lLCBkYXRlLCByYXcubG90X251bWJlciA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImNvbXBsZXRlZFwiLFxuICAgIHZhY2NpbmVDb2RlOiB7XG4gICAgICAvLyBObyB0ZXJtaW5vbG9neSBjb2RpbmcgXHUyMDE0IE5ISSBnaXZlcyBDaGluZXNlIG5hbWUgb25seS4gU01BUlRcbiAgICAgIC8vIGFwcHMgcmVuZGVyIC50ZXh0IGZvciBib3RoIHBhdGllbnQgYW5kIGNsaW5pY2FsIHZpZXdzICh0aGVcbiAgICAgIC8vIHYwLjguMCBiaWxpbmd1YWwgZmFsbGJhY2sgY29udHJhY3Q6IGlmIEVuZ2xpc2ggYWJzZW50LCB0ZXh0XG4gICAgICAvLyBpcyB0aGUgb25seSBkaXNwbGF5KS5cbiAgICAgIHRleHQ6IHZhY2NpbmVOYW1lLFxuICAgIH0sXG4gICAgcGF0aWVudDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBvY2N1cnJlbmNlRGF0ZVRpbWU6IGAke2RhdGV9VDAwOjAwOjAwKzA4OjAwYCxcbiAgfTtcblxuICBjb25zdCBsb3ROdW1iZXIgPSAoKHJhdy5sb3RfbnVtYmVyID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAobG90TnVtYmVyKSB7XG4gICAgcmVzb3VyY2UubG90TnVtYmVyID0gbG90TnVtYmVyO1xuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgLy8gcGVyZm9ybWVyLmFjdG9yLmRpc3BsYXkgbWF0Y2hlcyB0aGUgRW5jb3VudGVyIGxpbmtlcidzXG4gICAgLy8gKGhvc3BpdGFsLCBkYXRlKSBtYXRjaCBwYXR0ZXJuIGluIGxpbmsudHMgXHUyMDE0IHRob3VnaFxuICAgIC8vIEltbXVuaXphdGlvbiBpcyBub3QgY3VycmVudGx5IGluIEVOQ09VTlRFUl9MSU5LQUJMRSwgYWRkaW5nIGl0XG4gICAgLy8gdGhlcmUgbGF0ZXIgd291bGQgbGV0IFNNQVJUIGFwcHMgZ3JvdXAgdmFjY2luYXRpb25zIGJ5IHZpc2l0LlxuICAgIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGFjdG9yOiB7IGRpc3BsYXk6IGhvc3BpdGFsIH0gfV07XG4gIH1cblxuICBjb25zdCBzb3VyY2UgPSAoKHJhdy5zb3VyY2UgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChzb3VyY2UpIHtcbiAgICAvLyBOSEkgXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBIHN1cmZhY2VzIHRoZSB1cHN0cmVhbSBzb3VyY2Utb2YtcmVjb3JkIG9uIGV2ZXJ5XG4gICAgLy8gdmFjY2luZSByb3cgKHR5cGljYWxseSBcIlx1NzVCRVx1NzVDNVx1N0JBMVx1NTIzNlx1N0Y3MlwiID0gVGFpd2FuIENEQykuIFByZXNlcnZlIGFzXG4gICAgLy8gYSBub3RlIHNvIGNvbnN1bWVycyBjYW4gdHJhY2UgcHJvdmVuYW5jZSB3aXRob3V0IGxvc2luZyBpdCBpblxuICAgIC8vIHRoZSBtZXRhLnNvdXJjZSBwYXRoIHRoYXQncyBhbHJlYWR5IHBvaW50aW5nIGF0IHRoZSBicmlkZ2UuXG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IGBcdTRGODZcdTZFOTA6ICR7c291cmNlfWAgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBNZWRpY2F0aW9uUmVxdWVzdCBtYXBwZXIgKyBiaWxpbmd1YWwgZGVkdXBsaWNhdGlvbi5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvbWVkaWNhdGlvbi5weWAuIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgcmVwb3J0cyB0aGVcbiAqIFNBTUUgcHJlc2NyaXB0aW9uIG11bHRpcGxlIHRpbWVzIChFbmdsaXNoLW9ubHkgLyBFbmcrXHU0RTJEIC8gXHU0RTJEK0VuZykuXG4gKiBgbWFwTWVkaWNhdGlvbnNEZWR1cGAgY29sbGFwc2VzIHRoZXNlIHRvIG9uZSBNZWRpY2F0aW9uUmVxdWVzdCBwZXJcbiAqIChkYXRlLCBjYW5vbmljYWwtZHJ1Zy1rZXkpLCBwcmVmZXJyaW5nIHRoZSBmb3JtIHdpdGggbW9yZSBDSksgY2hhcnNcbiAqIChjbGluaWNpYW5zIHJlYWQgXHU1NTQ2XHU1NEMxXHU1NDBEIGZpcnN0KS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZUljZDEwQ20gfSBmcm9tIFwiLi9jb25kaXRpb25cIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5mdW5jdGlvbiBpc0NqayhjaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFx1NEUwMCAoVSs0RTAwKSB0byBcdTlGRkYgKFUrOUZGRikgY292ZXJzIENKSyBVbmlmaWVkIElkZW9ncmFwaHMuXG4gIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgcmV0dXJuIGNwID49IDB4NGUwMCAmJiBjcCA8PSAweDlmZmY7XG59XG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2YgcykgaWYgKGlzQ2prKGNoKSkgbisrO1xuICByZXR1cm4gbjtcbn1cblxuLyoqXG4gKiBNYXRjaCBhIFwibG9uZ1wiIEVuZ2xpc2ggY2h1bmsgKFx1MjI2NTQgY2hhcnMgb2YgQS1aLzAtOS9wdW5jdHVhdGlvbiBjb21tb25cbiAqIHRvIGRydWcgbmFtZXMpLiBBdm9pZCBtYXRjaGluZyBzaG9ydCB0b2tlbnMgbGlrZSBcIkRcIiBvciBcIlBPXCIgdGhhdFxuICogYXBwZWFyIGluc2lkZSBDaGluZXNlIG5hbWVzLlxuICovXG5jb25zdCBFTl9DSFVOS19HID0gL1tBLVpdW0EtWjAtOS4lL1xcLVwiJ1xcc117Myx9L2c7XG5cbi8qKlxuICogUmVkdWNlIGEgZHJ1Zy1uYW1lIHN0cmluZyB0byBhIHN0YWJsZSBjYW5vbmljYWwga2V5LiBFeHRyYWN0IHRoZVxuICogbG9uZ2VzdCBFbmdsaXNoIGZyYWdtZW50LCB0aGVuIHRydW5jYXRlIGF0IGNvbW1vbiBzZXBhcmF0b3JzIHNvIGFcbiAqIG5hbWUgd2l0aCBleHRyYSB0cmFpbGluZyBtb2RpZmllcnMgc3RpbGwgY29sbGFwc2VzIHRvIGJyYW5kK3N0cmVuZ3RoLlxuICpcbiAqIEV4YW1wbGVzIChhbGwgbWFwIHRvIFwidGltb3B0b2wgeGUgMC41JSBvcGh0aGFsbWljIHNvbHV0aW9uXCIpOlxuICogICBcIlRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTlwiXG4gKiAgIFwiVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OIChcdTk3NTJcdTc3M0NcdTk3MzJcdTIwMjYpXCJcbiAqICAgXCJcdTk3NTJcdTc3M0NcdTk3MzJcdTIwMjYgKFRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTilcIlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsRHJ1Z0tleShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IChuYW1lID8/IFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGNodW5rcyA9IFsuLi5zLm1hdGNoQWxsKEVOX0NIVU5LX0cpXS5tYXAoKG0pID0+IG1bMF0pO1xuICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAobmFtZSA/PyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuICBsZXQgbG9uZ2VzdCA9IGNodW5rcy5yZWR1Y2UoKGEsIGIpID0+IChiLmxlbmd0aCA+IGEubGVuZ3RoID8gYiA6IGEpKS50cmltKCk7XG4gIGZvciAoY29uc3Qgc2VwIG9mIFtcIiAtIFwiLCBcIiBcdTIwMTMgXCIsIFwiIC8gXCJdKSB7XG4gICAgaWYgKGxvbmdlc3QuaW5jbHVkZXMoc2VwKSkge1xuICAgICAgbG9uZ2VzdCA9IGxvbmdlc3Quc3BsaXQoc2VwKVswXSE7XG4gICAgfVxuICB9XG4gIHJldHVybiBsb25nZXN0LnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiAqIEJlc3QtZWZmb3J0IGFjdGl2ZSB2cyBjb21wbGV0ZWQgZGVjaXNpb24gZm9yIGEgTWVkaWNhdGlvblJlcXVlc3QuXG4gKiBBY3RpdmUgd2hpbGUgKGF1dGhvcmVkX2RhdGUgKyBkdXJhdGlvbiA+IHRvZGF5KTsgb3RoZXJ3aXNlIGNvbXBsZXRlZC5cbiAqIE1pc3NpbmcgZHVyYXRpb24gXHUyMTkyIGFzc3VtZSA5MC1kYXkgcmVmaWxsIHdpbmRvdyAoTkhJJ3MgdHlwaWNhbCBjYWRlbmNlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lZFN0YXR1cyhcbiAgYXV0aG9yZWRJc286IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGR1cmF0aW9uRGF5czogYW55LFxuKTogXCJhY3RpdmVcIiB8IFwiY29tcGxldGVkXCIge1xuICBpZiAoIWF1dGhvcmVkSXNvKSByZXR1cm4gXCJjb21wbGV0ZWRcIjtcbiAgY29uc3QgZGF0ZVBhcnQgPSBTdHJpbmcoYXV0aG9yZWRJc28pLnNsaWNlKDAsIDEwKTtcbiAgY29uc3QgcGFyc2VkID0gbmV3IERhdGUoYCR7ZGF0ZVBhcnR9VDAwOjAwOjAwWmApO1xuICBpZiAoTnVtYmVyLmlzTmFOKHBhcnNlZC5nZXRUaW1lKCkpKSByZXR1cm4gXCJjb21wbGV0ZWRcIjtcblxuICBsZXQgZGF5czogbnVtYmVyIHwgbnVsbDtcbiAgaWYgKGR1cmF0aW9uRGF5cyA9PT0gbnVsbCB8fCBkdXJhdGlvbkRheXMgPT09IHVuZGVmaW5lZCB8fCBkdXJhdGlvbkRheXMgPT09IFwiXCIpIHtcbiAgICBkYXlzID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBuID0gTnVtYmVyLnBhcnNlSW50KFN0cmluZyhkdXJhdGlvbkRheXMpLCAxMCk7XG4gICAgZGF5cyA9IE51bWJlci5pc0Zpbml0ZShuKSA/IG4gOiBudWxsO1xuICB9XG4gIGlmIChkYXlzID09PSBudWxsKSBkYXlzID0gOTA7XG5cbiAgY29uc3QgZW5kID0gbmV3IERhdGUocGFyc2VkLmdldFRpbWUoKSk7XG4gIGVuZC5zZXRVVENEYXRlKGVuZC5nZXRVVENEYXRlKCkgKyBkYXlzKTtcbiAgLy8gQ29tcGFyZSBkYXRlLW9ubHkgKHRvZGF5IGluIFVUQyBzaW5jZSB3ZSBhdXRob3JlZElzbyBpcyBkYXRlLW9ubHkpLlxuICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gIHRvZGF5LnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICByZXR1cm4gZW5kID49IHRvZGF5ID8gXCJhY3RpdmVcIiA6IFwiY29tcGxldGVkXCI7XG59XG5cbi8qKlxuICogQ29udmVydCBvbmUgc2NyYXBlZCBwcmVzY3JpcHRpb24gZGljdCBcdTIxOTIgRkhJUiBSNCBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqIFJldHVybnMgbnVsbCB3aGVuIHJhdyBoYXMgbm8gYGRydWdfbmFtZWAgKGNhbGxlciBmaWx0ZXJzIG91dCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBNZWRpY2F0aW9uUmVxdWVzdChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZHJ1Z05hbWUgPSAoKHJhdy5kcnVnX25hbWUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghZHJ1Z05hbWUpIHJldHVybiBudWxsO1xuXG4gIC8vIENhbm9uaWNhbCBrZXkgKG5vdCByYXcgZHJ1Z19uYW1lKSBmb3Igc3RhYmxlIGlkIHNvIHRoZSB0aHJlZSBOSElcbiAgLy8gXHU0RTJEXHU4MkYxIHZhcmlhbnRzIG9mIHRoZSBzYW1lIGRydWcgY29sbGFwc2UgdG8gb25lIEZISVIgcmVzb3VyY2UuXG4gIGNvbnN0IG1lZElkID0gc3RhYmxlSWQocGF0aWVudElkLCBjYW5vbmljYWxEcnVnS2V5KGRydWdOYW1lKSwgcmF3LmRhdGUgPz8gXCJcIik7XG5cbiAgY29uc3QgZHJ1Z0NvZGUgPSAoKHJhdy5jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCBjb2Rpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgc3lzdGVtOiBkcnVnQ29kZSA/IHN5c3RlbXMuTkhJX0RSVUdfQ09ERSA6IHN5c3RlbXMuSElTX0xPQ0FMX01FRElDQVRJT05fQ09ERSxcbiAgICBjb2RlOiBkcnVnQ29kZSB8fCBkcnVnTmFtZSxcbiAgICBkaXNwbGF5OiBkcnVnTmFtZSxcbiAgfTtcblxuICAvLyB2MC44LjAgYmlsaW5ndWFsOiBwcmVmZXIgXHU3RTQxXHU0RTJEIGluIENvZGVhYmxlQ29uY2VwdC50ZXh0IChwYXRpZW50LWZhY2luZ1xuICAvLyBkaXNwbGF5KSBhbmQga2VlcCBFbmdsaXNoIGluIGNvZGluZ1swXS5kaXNwbGF5IChjbGluaWNhbCBjYW5vbmljYWwpLlxuICAvLyBGYWxscyBiYWNrIHRvIEVuZ2xpc2ggd2hlbiBOSEkgZGlkbid0IHNoaXAgYSBDaGluZXNlIG5hbWUgZm9yIHRoZSBkcnVnLlxuICBjb25zdCBkcnVnTmFtZVpoID0gKChyYXcuZHJ1Z19uYW1lX3poID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpIHx8IGRydWdOYW1lO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJNZWRpY2F0aW9uUmVxdWVzdFwiLFxuICAgIGlkOiBtZWRJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBtZWRTdGF0dXMocmF3LmRhdGUgPz8gXCJcIiwgcmF3LmR1cmF0aW9uX2RheXMpLFxuICAgIGludGVudDogXCJvcmRlclwiLFxuICAgIG1lZGljYXRpb25Db2RlYWJsZUNvbmNlcHQ6IHtcbiAgICAgIGNvZGluZzogW2NvZGluZ10sXG4gICAgICB0ZXh0OiBkcnVnTmFtZVpoLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5hdXRob3JlZE9uID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIC8vIENocm9uaWMgcHJlc2NyaXB0aW9ucyAoZnJvbSBOSEkncyBJSEtFMzMwN1MwMSBcdTYxNjJcdTYwMjdcdTg2NTVcdTY1QjlcdTdCOEIgbGlzdCkgZ2V0XG4gIC8vIHRoZSBzdGFuZGFyZCBGSElSIGNvbnRpbnVvdXMtdGhlcmFweSBtYXJrZXIuIFNNQVJUIGFwcHMgcmVjb2duaXNlXG4gIC8vIHRoaXMgY29kZSBhbmQgY2FuIHN1cmZhY2UgXCJsb25nLXRlcm0gbWVkaWNhdGlvblwiIGJhZGdlcyBvciBmaWx0ZXJcbiAgLy8gcHJvYmxlbS1saXN0IHZpZXdzLiBBY3V0ZSBwcmVzY3JpcHRpb25zIGxlYXZlIHRoZSBmaWVsZCB1bnNldC5cbiAgY29uc3QgY291cnNlT2ZUaGVyYXB5ID0gKChyYXcuY291cnNlX29mX3RoZXJhcHkgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChjb3Vyc2VPZlRoZXJhcHkgPT09IFwiY29udGludW91c1wiKSB7XG4gICAgcmVzb3VyY2UuY291cnNlT2ZUaGVyYXB5VHlwZSA9IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOlxuICAgICAgICAgICAgXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL21lZGljYXRpb25yZXF1ZXN0LWNvdXJzZS1vZi10aGVyYXB5XCIsXG4gICAgICAgICAgY29kZTogXCJjb250aW51b3VzXCIsXG4gICAgICAgICAgZGlzcGxheTogXCJDb250aW51b3VzIGxvbmcgdGVybSB0aGVyYXB5XCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgdGV4dDogXCJDb250aW51b3VzIGxvbmcgdGVybSB0aGVyYXB5XCIsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGRydWdDbGFzcyA9ICgocmF3LmRydWdfY2xhc3MgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGRydWdDbGFzc1poID0gKChyYXcuZHJ1Z19jbGFzc196aCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGRydWdDbGFzcyB8fCBkcnVnQ2xhc3NaaCkge1xuICAgIGNvbnN0IGNhdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChkcnVnQ2xhc3MpIGNhdC5jb2RpbmcgPSBbeyBkaXNwbGF5OiBkcnVnQ2xhc3MgfV07XG4gICAgLy8gUGF0aWVudC1mYWNpbmc6IHByZWZlciBcdTdFNDFcdTRFMkQgaW4gLnRleHQsIGZhbGwgYmFjayB0byBFbmdsaXNoLlxuICAgIGNhdC50ZXh0ID0gZHJ1Z0NsYXNzWmggfHwgZHJ1Z0NsYXNzO1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW2NhdF07XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5yZXF1ZXN0ZXIgPSB7IGRpc3BsYXk6IGhvc3BpdGFsIH07XG4gIH1cblxuICAvLyBEb3NhZ2UgXHUyMDE0IG9ubHkgd2hlbiBzb3VyY2UgYWN0dWFsbHkgaGFzIGl0LiBOSEkncyBtZWRpY2F0aW9uLWxpc3RcbiAgLy8gZW5kcG9pbnQgcHJvdmlkZXMgbm9uZSBvZiB0aGVzZTsgb3RoZXIgSElTIGFkYXB0ZXJzIGdldCBhXG4gIC8vIHN0cnVjdHVyZWQgZG9zYWdlIG91dC5cbiAgY29uc3QgZG9zYWdlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGsgb2YgW1wiZG9zZVwiLCBcInVuaXRcIiwgXCJmcmVxdWVuY3lcIl0gYXMgY29uc3QpIHtcbiAgICBpZiAocmF3W2tdKSBwYXJ0cy5wdXNoKFN0cmluZyhyYXdba10pKTtcbiAgfVxuICBpZiAocGFydHMubGVuZ3RoID4gMCkge1xuICAgIGRvc2FnZS50ZXh0ID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cbiAgaWYgKHJhdy5yb3V0ZSkge1xuICAgIGRvc2FnZS5yb3V0ZSA9IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9zbm9tZWQuaW5mby9zY3RcIiwgZGlzcGxheTogcmF3LnJvdXRlIH1dLFxuICAgIH07XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKGRvc2FnZSkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRvc2FnZUluc3RydWN0aW9uID0gW2Rvc2FnZV07XG4gIH1cblxuICAvLyBkaXNwZW5zZVJlcXVlc3Qgd2l0aCBxdWFudGl0eSArIHN1cHBseSBkdXJhdGlvbiB3aGVuIHByZXNlbnQuXG4gIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHF0eVJhdyA9IHJhdy5xdWFudGl0eTtcbiAgaWYgKHF0eVJhdyAhPT0gbnVsbCAmJiBxdHlSYXcgIT09IHVuZGVmaW5lZCAmJiBxdHlSYXcgIT09IFwiXCIpIHtcbiAgICBjb25zdCBxdHlOdW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcocXR5UmF3KS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHF0eU51bSkpIHtcbiAgICAgIGRyLnF1YW50aXR5ID0geyB2YWx1ZTogcXR5TnVtIH07XG4gICAgfVxuICB9XG4gIGlmIChyYXcuZHVyYXRpb25fZGF5cykge1xuICAgIGNvbnN0IGRheXMgPSBOdW1iZXIucGFyc2VJbnQoU3RyaW5nKHJhdy5kdXJhdGlvbl9kYXlzKSwgMTApO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoZGF5cykpIHtcbiAgICAgIGRyLmV4cGVjdGVkU3VwcGx5RHVyYXRpb24gPSB7XG4gICAgICAgIHZhbHVlOiBkYXlzLFxuICAgICAgICB1bml0OiBcImRheXNcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogXCJkXCIsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICAvLyBJbnBhdGllbnQgZHJ1Z3M6IE5ISSBidW5kbGVzIGV2ZXJ5IGRydWcgdXNlZCBkdXJpbmcgYW4gYWRtaXNzaW9uIGludG9cbiAgLy8gb25lIHJvdyBkYXRlZCB0byB0aGUgYWRtaXNzaW9uIGRheS4gYXV0aG9yZWRPbiBjYXJyaWVzIHRoYXQgYW5jaG9yO1xuICAvLyB2YWxpZGl0eVBlcmlvZCBleHByZXNzZXMgdGhlIGFjdHVhbCB1c2FnZSB3aW5kb3cgW2FkbWl0LCBkaXNjaGFyZ2VdXG4gIC8vIHNvIFNNQVJUIGFwcHMgZGlzcGxheSBcInVzZWQgZHVyaW5nIHN0YXkgNS8xOC01LzIyXCIgaW5zdGVhZCBvZlxuICAvLyBcImFsbCAxNCBkcnVncyBwcmVzY3JpYmVkIG9uIDUvMThcIi4gT1BEIC8gXHU4NUU1XHU1QzQwIHJvd3MgbGVhdmUgZW5kX2RhdGVcbiAgLy8gZW1wdHkgc28gdGhpcyBibG9jayBkb2Vzbid0IGZpcmUgXHUyMDE0IHNpbmdsZS1kYXkgcHJlc2NyaXB0aW9ucyByZW1haW5cbiAgLy8gdW5jaGFuZ2VkLiBUaGUgTWVkaWNhdGlvblJlcXVlc3QuZGlzcGVuc2VSZXF1ZXN0LnZhbGlkaXR5UGVyaW9kIGZpZWxkXG4gIC8vIGlzIGEgc2VtYW50aWMgc3RyZXRjaCAoaXRzIHN0cmljdCBkZWZpbml0aW9uIGlzIHRoZSBwcmVzY3JpcHRpb24nc1xuICAvLyBzdGFsZS1kYXRpbmcgd2luZG93KSBidXQgaXMgdGhlIGNsb3Nlc3QgZXhpc3RpbmcgZmllbGQ7IHdlIGRvbid0XG4gIC8vIGVtaXQgTWVkaWNhdGlvbkFkbWluaXN0cmF0aW9uIHJlc291cmNlcy5cbiAgY29uc3QgZW5kRGF0ZSA9ICgocmF3LmVuZF9kYXRlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAocmF3LmRhdGUgJiYgZW5kRGF0ZSAmJiBlbmREYXRlICE9PSByYXcuZGF0ZSkge1xuICAgIGRyLnZhbGlkaXR5UGVyaW9kID0ge1xuICAgICAgc3RhcnQ6IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGAsXG4gICAgICBlbmQ6IGAke2VuZERhdGV9VDIzOjU5OjU5KzA4OjAwYCxcbiAgICB9O1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkcikubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRpc3BlbnNlUmVxdWVzdCA9IGRyO1xuICB9XG5cbiAgY29uc3QgaW5kaWNhdGlvbiA9ICgocmF3LmluZGljYXRpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25aaCA9ICgocmF3LmluZGljYXRpb25femggPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25Db2RlID0gKChyYXcuaW5kaWNhdGlvbl9jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uWmggfHwgaW5kaWNhdGlvbkNvZGUpIHtcbiAgICBjb25zdCByYzogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChpbmRpY2F0aW9uQ29kZSkge1xuICAgICAgcmMuY29kaW5nID0gW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBzeXN0ZW1zLklDRF8xMF9DTSxcbiAgICAgICAgICBjb2RlOiBub3JtYWxpemVJY2QxMENtKGluZGljYXRpb25Db2RlKSxcbiAgICAgICAgICBkaXNwbGF5OiBpbmRpY2F0aW9uIHx8IGluZGljYXRpb25aaCB8fCBpbmRpY2F0aW9uQ29kZSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICAgIC8vIFBhdGllbnQtZmFjaW5nIHJlYXNvbkNvZGUgdGV4dDogcHJlZmVyIFx1N0U0MVx1NEUyRCBJQ0QgZGVzY3JpcHRpb24sIGZhbGxcbiAgICAvLyBiYWNrIHRvIEVuZ2xpc2gsIHRoZW4gdG8ganVzdCB0aGUgY29kZS4gQWx3YXlzIHByZWZpeGVkIHdpdGggdGhlXG4gICAgLy8gY29kZSBzbyBTTUFSVCBhcHAgcmVuZGVyaW5nIGtlZXBzIFwiPGNvZGU+IDxuYW1lPlwiIHNoYXBlLlxuICAgIGNvbnN0IG5hbWVaaCA9IGluZGljYXRpb25aaCB8fCBpbmRpY2F0aW9uO1xuICAgIGlmIChuYW1lWmgpIHtcbiAgICAgIHJjLnRleHQgPSBpbmRpY2F0aW9uQ29kZSA/IGAke2luZGljYXRpb25Db2RlfSAke25hbWVaaH1gLnRyaW0oKSA6IG5hbWVaaDtcbiAgICB9XG4gICAgcmVzb3VyY2UucmVhc29uQ29kZSA9IFtyY107XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8qKlxuICogR3JvdXAtYXdhcmUgbWVkaWNhdGlvbiBtYXBwZXIgdGhhdCBkZWR1cGVzIFx1NEUyRFx1ODJGMSBcdTk2RDlcdThBOUUgZHVwbGljYXRlcy5cbiAqXG4gKiBTdHJhdGVneTpcbiAqICAgMS4gQ29tcHV0ZSBjYW5vbmljYWwga2V5IHBlciBkcnVnIG5hbWUgKGxvbmdlc3QgRW5nbGlzaCBjaHVuaykuXG4gKiAgIDIuIEdyb3VwIGJ5IChkYXRlLCBjYW5vbmljYWxfa2V5KS4gS2VlcCBPTkUgZW50cnkgcGVyIGdyb3VwLFxuICogICAgICBwcmVmZXJyaW5nIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmRcbiAqICAgICAgbmFtZSBcdTIwMTQgY2xpbmljaWFucyBzY2FuIEVuZ2xpc2ggZmlyc3QpLlxuICogICAzLiBNYXAgZWFjaCBrZXB0IGVudHJ5IHRocm91Z2ggbWFwTWVkaWNhdGlvblJlcXVlc3QuXG4gKlxuICogTm90ZTogUHl0aG9uIGNvbW1lbnQgc2F5cyBcIm1vcmUgQ0pLXCIgYnV0IHRoZSBjb2RlIHVzZXMgYDxgIChmZXdlcik7XG4gKiB3ZSBwcmVzZXJ2ZSB0aGUgYWN0dWFsIGNvZGUgYmVoYXZpb3VyIHRvIGtlZXAgcGFyaXR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTWVkaWNhdGlvbnNEZWR1cChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBkcnVnTmFtZSA9ICgoaXRlbS5kcnVnX25hbWUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gICAgaWYgKCFkcnVnTmFtZSkgY29udGludWU7XG4gICAgY29uc3QgZGF0ZVBhcnQgPSAoKGl0ZW0uZGF0ZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnNsaWNlKDAsIDEwKTtcbiAgICBjb25zdCBrZXkgPSBgJHtkYXRlUGFydH18JHtjYW5vbmljYWxEcnVnS2V5KGRydWdOYW1lKX1gO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQcmVmZXIgdGhlIGZvcm0gd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBicmFuZCBuYW1lKS5cbiAgICAgIGlmIChjamtDaGFycyhkcnVnTmFtZSkgPCBjamtDaGFycyhleGlzdGluZy5kcnVnX25hbWUgPz8gXCJcIikpIHtcbiAgICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgbSA9IG1hcE1lZGljYXRpb25SZXF1ZXN0KGl0ZW0sIHBhdGllbnRJZCk7XG4gICAgaWYgKG0gIT09IG51bGwpIG91dC5wdXNoKG0pO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCAiLyoqXG4gKiBMT0lOQyBtYXBwaW5nIHRhYmxlcyBmb3IgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgTE9JTkMgUjQgY29kaW5ncy5cbiAqXG4gKiBQdXJlIGRhdGEsIG5vIGxvZ2ljLiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvX2xvaW5jX3RhYmxlcy5weWAuXG4gKi9cblxuLy8gXHUyNTAwXHUyNTAwIF9OSElfVE9fTE9JTkMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBwcmltYXJ5IExPSU5DIG1hcHBpbmcuIFNvdXJjZSBvZiB0cnV0aDpcbi8vIFRXTkhJRkhJUiBQQVMgSW1wbGVtZW50YXRpb24gR3VpZGUgQ29uY2VwdE1hcC1uaGktbG9pbmNcbi8vIGh0dHBzOi8vYnVpbGQuZmhpci5vcmcvaWcvVFdOSElGSElSL3Bhcy9Db25jZXB0TWFwLW5oaS1sb2luYy5odG1sXG4vL1xuLy8gVGhhdCBDb25jZXB0TWFwIGRlY2xhcmVzIDUzIE5ISSBjb2RlcyB3aXRoIGBlcXVpdmFsZW5jZTogcmVsYXRlZHRvYFxuLy8gYWdhaW5zdCA4MDYgTE9JTkMgdmFyaWFudHMgKGRpZmZlcmVudCBzcGVjaW1lbnMgLyB1bml0cyAvIG1ldGhvZHNcbi8vIHBlciBOSEkgY29kZSBcdTIwMTQgY29uZmlybWluZyB0aGUgXCJOSEkgaXMgY29hcnNlLCBMT0lOQyBpcyBmaW5lXCIgdmlldykuXG4vLyBGb3IgZWFjaCBOSEkgY29kZSB3ZSBoYW5kLXBpY2sgdGhlIGNhbm9uaWNhbCBMT0lOQyBtb3N0IGNsaW5pY2lhbnNcbi8vIHdvdWxkIGV4cGVjdCBpbiBhIFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBsYWIgcmVwb3J0OiBTZXJ1bS9QbGFzbWEgKyBNYXNzLXZvbHVtZVxuLy8gKG9yIGF1dG8tY291bnQgZm9yIGNlbGwgY291bnRlcnMpLiBFZGdlIGNhc2VzIG5vdGVkIGlubGluZS5cbmV4cG9ydCBjb25zdCBOSElfVE9fTE9JTkM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBIYWVtYXRvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwODAwMkNcIjogXCI2NjkwLTJcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4IFx1MjAxNCBMZXVrb2N5dGVzICMvdm9sIEJsb29kIEF1dG9cbiAgXCIwODAwM0NcIjogXCI3MTgtN1wiLCAvLyBcdTg4NDBcdTgyNzJcdTdEMjBcdTZBQTJcdTY3RTUgXHUyMDE0IEhlbW9nbG9iaW4gTWFzcy92b2wgQmxvb2RcbiAgXCIwODAwNkNcIjogXCI3NzctM1wiLCAvLyBcdTg4NDBcdTVDMEZcdTY3N0ZcdThBMDhcdTY1NzggXHUyMDE0IFBsYXRlbGV0cyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMTNDXCI6IFwiNTcwMjEtOFwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdTUyMDZcdTk4NUVcdThBMDhcdTY1NzggXHUyMDE0IENCQyBXIEF1dG8gRGlmZiBwYW5lbFxuICBcIjA4MTI4QlwiOiBcIjQ3Mjg2LTBcIiwgLy8gXHU5QUE4XHU5QUQzXHU3RDMwXHU4MERFXHU1RjYyXHU2MTRCXHU1MjI0XHU4QjgwXHU1NDA4XHU0Rjc1XHU3RDMwXHU4MERFXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4XG4gIC8vIFx1MjUwMFx1MjUwMCBDaGVtaXN0cnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMTFDXCI6IFwiMTc4NjEtNlwiLCAvLyBcdTkyMjMgXHUyMDE0IENhbGNpdW0gTWFzcy92b2wgUy9QXG4gIFwiMDkwMTVDXCI6IFwiMjE2MC0wXCIsIC8vIFx1ODA4Q1x1OTE3OFx1OTE1MFx1MzAwMVx1ODg0MCBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxNkNcIjogXCIyMTYxLThcIiwgLy8gXHU4MDhDXHU5MTUwXHUzMDAxXHU1QzNGIFx1MjAxNCBDcmVhdGluaW5lIE1hc3Mvdm9sIFVyaW5lXG4gIFwiMDkwMjVDXCI6IFwiMTkyMC04XCIsIC8vIEFTVC9HT1QgXHUyMDE0IEFzcGFydGF0ZSBhbWlub3RyYW5zZmVyYXNlIEFjdCBTL1BcbiAgXCIwOTAyNkNcIjogXCIxNzQyLTZcIiwgLy8gQUxUL0dQVCBcdTIwMTQgQWxhbmluZSBhbWlub3RyYW5zZmVyYXNlIEFjdCBTL1BcbiAgXCIwOTAyOUNcIjogXCIxOTc1LTJcIiwgLy8gXHU4MUJEXHU3RDA1XHU3RDIwXHU3RTNEXHU5MUNGIFx1MjAxNCBCaWxpcnViaW4gdG90YWwgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzBDXCI6IFwiMTk2OC03XCIsIC8vIFx1NzZGNFx1NjNBNVx1ODFCRFx1N0QwNVx1N0QyMCBcdTIwMTQgQmlsaXJ1YmluIGRpcmVjdCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzM0NcIjogXCIyNTMyLTBcIiwgLy8gXHU0RTczXHU5MTc4XHU4MTJCXHU2QzJCXHU4MTIyIFx1MjAxNCBMREggQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzhDXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RCBcdTIwMTQgQWxidW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTEzOENcIjogXCIzNTY3Mi01XCIsIC8vIFx1NzZGNFx1NjNBNS9cdTdFM0RcdTgxQkRcdTdEMDVcdTdEMjBcdTZCRDRcdTUwM0NcbiAgXCIxMjExMkJcIjogXCIxNzUxLTdcIiwgLy8gXHU3NjdEXHU4NkNCXHU3NjdEKFx1NTE0RFx1NzVBQlx1NkJENFx1NkZDMVx1NkNENSkgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMjQwMDdCXCI6IFwiMTk5NS0wXCIsIC8vIFx1ODg0MFx1NkYzRlx1NkUzOFx1OTZFMlx1OTIyMyBcdTIwMTQgQ2FsY2l1bSBpb25pemVkIE1vbGVzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEhvcm1vbmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTIxQ1wiOiBcIjI5ODYtOFwiLCAvLyBcdTc3NkFcdTRFMzhcdTkxNkZcdTkxODdcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IFRlc3Rvc3Rlcm9uZSBNYXNzL3ZvbCBTL1BcbiAgXCIyNzAyMUJcIjogXCIyOTkxLThcIiwgLy8gXHU3NzZBXHU0RTM4XHU4MTAyXHU5MTg3XHU2NTNFXHU1QzA0XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgRnJlZSBTL1BcbiAgLy8gMDkxMjVDIC8gMDkxMjdDIGNvcnJlY3RlZCBhZnRlciBkdWFsLXJldmlld2VyIGF1ZGl0IFx1MjAxNCB0aGUgZWFybGllclxuICAvLyB2YWx1ZXMgKDMwMTYtMyB3YXMgVFNILCAxMDUwMS01IHdhcyBMSCkgd2VyZSBqdXN0IHdyb25nIGNvcHktXG4gIC8vIHBhc3Rlcy4gU291cmNlIGZvciB0aGUgbmV3IHZhbHVlczogVFdOSElGSElSIFBBUyBDb25jZXB0TWFwLlxuICBcIjA5MTI1Q1wiOiBcIjgzMDk4LTRcIiwgLy8gXHU2RkZFXHU2Q0UxXHU1MjNBXHU2RkMwXHU3RDIwXHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBGb2xsaXRyb3BpbiAoRlNIKSBJbW11bm9hc3NheSBTL1BcbiAgXCIwOTEyN0NcIjogXCI4MzA5Ni04XCIsIC8vIFx1NEU4Q1x1NkMyQlx1NTdGQVx1NjYyNVx1NjBDNVx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRXN0cmFkaW9sIEltbXVub2Fzc2F5IFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVHVtb3IgbWFya2VycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjAwN0NcIjogXCIxODM0LTFcIiwgLy8gXHUwM0IxLVx1ODBDRVx1NTE1Mlx1ODZDQlx1NzY3RCAoQUZQKSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMjcwNDlDXCI6IFwiMTgzNC0xXCIsIC8vIFx1NzUzMi1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCwgUklBKVxuICBcIjEyMDgxQ1wiOiBcIjgzMTEyLTNcIiwgLy8gUFNBIChFSUEvTElBKSBcdTIwMTQgTWFzcy92b2wgUy9QIEltbXVub2Fzc2F5XG4gIFwiMTIxOThDXCI6IFwiODMxMTMtMVwiLCAvLyBGcmVlIFBTQSBcdTIwMTQgTWFzcy92b2wgUy9QIEltbXVub2Fzc2F5XG4gIFwiMjcwNTJDXCI6IFwiMjg1Ny0xXCIsIC8vIFx1NjUxRFx1OEI3N1x1ODE3QVx1NzI3OVx1NzU3MFx1NjI5N1x1NTM5RiAoUFNBKSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMjcwODNCXCI6IFwiMTA4ODYtMFwiLCAvLyBcdTZFMzhcdTk2RTJQU0EgKFJJQSlcbiAgLy8gMTIwNTJCIFx1MDNCMjItXHU1RkFFXHU3NDAzXHU4NkNCXHU3NjdEIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byAxMDg3My04IHdoaWNoIGlzIGFjdHVhbGx5XG4gIC8vICdCZXRhLTItTWljcm9nbG9idWxpbiBbTWFzcy90aW1lXSBpbiAyNCBob3VyIFVyaW5lJyAodGltZWQgdXJpbmVcbiAgLy8gY29sbGVjdGlvbiwgdmVyaWZpZWQgbG9pbmMub3JnLzEwODczLTgvKS4gVGFpd2FuIDEyMDUyQiBiaWxsaW5nIGlzXG4gIC8vIHR5cGljYWxseSBhIHNlcnVtIG9yZGVyOyAxOTUyLTEgaXMgdGhlIHZlcmlmaWVkIHNlcnVtLW9yLXBsYXNtYSBMT0lOQ1xuICAvLyAoQ29tcG9uZW50PUJldGEtMi1NaWNyb2dsb2J1bGluLCBQcm9wZXJ0eT1NQ25jKSBcdTIwMTQgbG9pbmMub3JnLzE5NTItMS8uXG4gIFwiMTIwNTJCXCI6IFwiMTk1Mi0xXCIsIC8vIFx1MDNCMjItbWljcm9nbG9idWxpbiBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBJbW11bm9sb2d5IC8gcHJvdGVpbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwNjVCXCI6IFwiOTA5OTEtMVwiLCAvLyBcdTg2Q0JcdTc2N0RcdTk2RkJcdTZDRjNcdTUyMDZcdTY3OTBcbiAgLy8gMTIwMjhCIC8gMTIwMjlCIElnTSAoc2VydW0sIGltbXVub2RpZmZ1c2lvbiAvIG5lcGhlbG9tZXRyeSkgXHUyMDE0IHByZXZpb3VzbHlcbiAgLy8gYm90aCBtYXBwZWQgdG8gTE9JTkMgMTQwMDItMCB3aGljaCBpcyBhY3R1YWxseSAnSWdNIFtVbml0cy92b2x1bWVdIGluXG4gIC8vIENvcmQgYmxvb2QnIChuZW9uYXRhbCBzcGVjaW1lbiwgdmVyaWZpZWQgbG9pbmMub3JnLzE0MDAyLTAvKS4gV3JvbmdcbiAgLy8gc3BlY2ltZW4gZm9yIGFuIGFkdWx0IHNlcnVtIG9yZGVyLiBMZWF2aW5nIHVubWFwcGVkOyBmYWxscyB0aHJvdWdoIHRvXG4gIC8vIE5ISS1jb2RlLW9ubHkgY29kaW5nLiBTZWUgZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kLlxuICBcIjEyMTAzQlwiOiBcIjk1ODAxLTdcIiwgLy8gXHU1MTREXHU3NUFCXHU5NkZCXHU2Q0YzXHU1MjA2XHU2NzkwXG4gIFwiMTIxNjBCXCI6IFwiMTUxODktNFwiLCAvLyBJZ0cgXHUwM0JBL1x1MDNCQlxuICBcIjEyMTcxQlwiOiBcIjE3MzUxLThcIiwgLy8gXHU2Mjk3XHU1NURDXHU0RTJEXHU2MDI3XHU3NDAzXHU3RDMwXHU4MERFXHU4Q0VBXHU2Mjk3XHU5QUQ0IChBTkNBKVxuICBcIjEyMjA0QlwiOiBcIjIwNTg0LTlcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU4ODY4XHU5NzYyXHU2QTE5XHU4QTE4XG4gIFwiMjUwMTNCXCI6IFwiNDQ1OTYtNVwiLCAvLyBcdTg3QTJcdTUxNDlcdTUyMDdcdTcyNDdcdTZBQTJcdTY3RTVcbiAgLy8gXHUyNTAwXHUyNTAwIEhlcGF0aXRpcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNDAzMENcIjogXCI1MTk1LTNcIiwgLy8gSEJzQWdcbiAgXCIxNDAzMUNcIjogXCI1MTk1LTNcIiwgLy8gSEJzQWdcbiAgXCIxNDAzMkNcIjogXCI1MTk2LTFcIiwgLy8gSEJzQWcgKE1hc3Mvdm9sKVxuICBcIjE0MDUxQ1wiOiBcIjEzOTU1LTBcIiwgLy8gSENWIEFiXG4gIFwiMjcwMzNDXCI6IFwiNTE5Ny05XCIsIC8vIEhCc0FnIFJJQVxuICAvLyBcdTI1MDBcdTI1MDAgUGF0aG9sb2d5IC8gY3l0b2xvZ3kgLyBJSEMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIxOTVCXCI6IFwiMTg0NzQtN1wiLCAvLyBIZXItMi9uZXUgSVNIXG4gIFwiMjcwNjFCXCI6IFwiMTQxMzAtOVwiLCAvLyBcdTUyRDVcdTYwQzVcdTZGQzBcdTdEMjBcdTYzQTVcdTUzRDdcdTlBRDQgKEVSKVxuICBcIjI3MDYyQlwiOiBcIjEwODYxLTNcIiwgLy8gXHU5RUMzXHU5QUQ0XHU2RkMwXHU3RDIwXHU2M0E1XHU1M0Q3XHU5QUQ0IChQUilcbiAgXCIzMDEwM0JcIjogXCI4MzA1Mi0xXCIsIC8vIFBELUwxIElIQ1xuICAvLyBcdTI1MDBcdTI1MDAgQXVkaW9sb2d5IC8gcHVsbW9uYXJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE3MDA5QlwiOiBcIjI0MzQxLTBcIiwgLy8gXHU0RTAwXHU2QzI3XHU1MzE2XHU3OEIzXHU4MEJBXHU3MDMwXHU2NTYzXHU5MUNGXG4gIFwiMjIwMDFDXCI6IFwiNDU0OTgtM1wiLCAvLyBcdTdEMTRcdTk3RjNcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgXCIyMjAxNUJcIjogXCI0NTQ5OC0zXCIsIC8vIFx1OEE1MFx1ODA3RVx1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICBcIjIyMDI1QlwiOiBcIjQ2NTMwLTJcIiwgLy8gXHU4MUVBXHU4QTE4XHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIC8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuICAvLyBTVVBQTEVNRU5UQUwgKG5vdCBpbiBQQVMgQ29uY2VwdE1hcCBcdTIwMTQgaGFuZC1jdXJhdGVkIGZyb20gY29tbW9uXG4gIC8vIE5ISSBjb2RlcyBzZWVuIGluIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QS4gTE9JTkMgdmVyaWZpZWQgYWdhaW5zdCBsb2luYy5vcmdcbiAgLy8gY2Fub25pY2FsIG5hbWVzLiBNZXRob2Qtc3BlY2lmaWMgY29kZXMgKGUuZy4gaHMtQ1JQKSBwaWNrIHRoZVxuICAvLyBzcGVjaWZpYyBMT0lOQzsgZ2VuZXJhbC1tZXRob2QgY29kZXMgcGljayB0aGUgbW9zdCBjb21tb24gZm9ybS5cbiAgLy8gSWYgXHU1MDY1XHU0RkREXHU3RjcyIHB1Ymxpc2hlcyBhbiBhdXRob3JpdGF0aXZlIGJyb2FkZXIgQ29uY2VwdE1hcCBsYXRlcixcbiAgLy8gcmVwbGFjZSB0aGlzIHNlY3Rpb24gaW4gb25lIHBhc3MuXG4gIC8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSAvIEhiQTFjIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDA1Q1wiOiBcIjE1NTgtNlwiLCAvLyBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDYgKEdsdS1BQykgXHUyMDE0IEZhc3RpbmcgZ2x1Y29zZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTE0MENcIjogXCIyMzQ1LTdcIiwgLy8gXHU4ODQwXHU3Q0Q2LVx1OTkxMFx1NUY4Qy9cdTk2QThcdTZBNUYgXHUyMDE0IEdsdWNvc2UgTWFzcy92b2wgUy9QIChnZW5lcmFsKVxuICBcIjA5MDA2Q1wiOiBcIjQ1NDgtNFwiLCAvLyBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjAgKEhiQTFjKSBcdTIwMTQgSGVtb2dsb2JpbiBBMWMvSGdiLnRvdGFsIEJsb29kXG4gIC8vIFx1MjUwMFx1MjUwMCBSZW5hbCAvIGVsZWN0cm9seXRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwMkNcIjogXCIzMDk0LTBcIiwgLy8gQlVOIFx1MjAxNCBVcmVhIG5pdHJvZ2VuIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDEzQ1wiOiBcIjMwODQtMVwiLCAvLyBVcmljIEFjaWQgXHUyMDE0IFVyYXRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDIxQ1wiOiBcIjI5NTEtMlwiLCAvLyBOYSBcdTIwMTQgU29kaXVtIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAyMkNcIjogXCIyODIzLTNcIiwgLy8gSyAgXHUyMDE0IFBvdGFzc2l1bSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMjRDXCI6IFwiMjAyOC05XCIsIC8vIENPMiBcdTIwMTQgQ2FyYm9uIGRpb3hpZGUgTW9sZXMvdm9sIFMvUFxuICBcIjA5MDEyQ1wiOiBcIjI3NzctMVwiLCAvLyBJbm9yZ2FuaWMgUCBcdTIwMTQgUGhvc3BoYXRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQ2QlwiOiBcIjE5MTIzLTlcIiwgLy8gTWcgXHUyMDE0IE1hZ25lc2l1bSBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIExpcGlkIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDAxQ1wiOiBcIjIwOTMtM1wiLCAvLyBULUNob2xlc3Rlcm9sIFx1MjAxNCBDaG9sZXN0ZXJvbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAwNENcIjogXCIyNTcxLThcIiwgLy8gVEcgXHUyMDE0IFRyaWdseWNlcmlkZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0M0NcIjogXCIyMDg1LTlcIiwgLy8gSERMIFx1MjAxNCBIREwgY2hvbGVzdGVyb2wgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDRDXCI6IFwiMTM0NTctN1wiLCAvLyBMREwgXHUyMDE0IExETCBjaG9sZXN0ZXJvbCAoY2FsY3VsYXRlZCkgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXZlciBmdW5jdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAyN0NcIjogXCI2NzY4LTZcIiwgLy8gQUxLLVAgXHUyMDE0IEFsa2FsaW5lIHBob3NwaGF0YXNlIEFjdGl2aXR5IFMvUFxuICBcIjA5MDMxQ1wiOiBcIjIzMjQtMlwiLCAvLyBcdTAzQjMtR1QgXHUyMDE0IEdhbW1hIGdsdXRhbXlsIHRyYW5zZmVyYXNlIEFjdGl2aXR5IFMvUFxuICBcIjA5MDM1Q1wiOiBcIjI1MDAtN1wiLCAvLyBUSUJDIFx1MjAxNCBJcm9uIGJpbmRpbmcgY2FwYWNpdHkgTWFzcy92b2wgUy9QXG4gIC8vIDA5MDM3QyBcdTg4NDBcdTZDMjggXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDE4MjctNSB3aGljaCBpcyBhY3R1YWxseVxuICAvLyAnQWxwaGEgMSBhbnRpdHJ5cHNpbiBNUyBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYScgKHZlcmlmaWVkXG4gIC8vIGxvaW5jLm9yZy8xODI3LTUvKS4gV3JvbmcgYW5hbHl0ZSBlbnRpcmVseS4gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHNcbiAgLy8gdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy4gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIwOTA2NENcIjogXCIzMDQwLTNcIiwgLy8gTGlwYXNlIFx1MjAxNCBBY3Rpdml0eSBTL1BcbiAgXCIwOTA1OUJcIjogXCIxNDExOC00XCIsIC8vIExhY3RhdGUgXHUyMDE0IE1hc3Mvdm9sIFBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgSGVtYXRvbG9neSBleHRyYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDRDXCI6IFwiNDU0NC0zXCIsIC8vIEhDVCBcdTIwMTQgSGVtYXRvY3JpdCB2b2x1bWUgZnJhY3Rpb24gQmxvb2RcbiAgXCIwODAwOENcIjogXCIxNDE5Ni0wXCIsIC8vIFJldGljdWxvY3l0ZSBcdTIwMTQgUmV0aWN1bG9jeXRlcy8xMDAgUkJDXG4gIFwiMDgwMTBDXCI6IFwiNzExLTJcIiwgLy8gRW9zaW5vcGhpbCBjb3VudCBcdTIwMTQgIy92b2wgQmxvb2RcbiAgXCIwODAxMUNcIjogXCIyNDMxNy0wXCIsIC8vIENCQyBwYW5lbCBcdTIwMTQgSGVtYXRvbG9neSBwYW5lbCBCbG9vZFxuICBcIjA4MDI2Q1wiOiBcIjYzMDEtNlwiLCAvLyBQVC9JTlIgXHUyMDE0IElOUiBQbGF0ZWxldCBwb29yIHBsYXNtYVxuICBcIjA4MDM2Q1wiOiBcIjE0OTc5LTlcIiwgLy8gQVBUVCBcdTIwMTQgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODA3NUNcIjogXCIyNjkyLTdcIiwgLy8gT3Ntb2xhbGl0eSBcdTIwMTQgU2VydW0gb3IgUGxhc21hXG4gIFwiMDgwNzlCXCI6IFwiMzAyNDAtNlwiLCAvLyBELWRpbWVyIFx1MjAxNCBQbHQgcG9vciBwbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIFRoeXJvaWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEZyZWUgVDQgaGFzIFRXTyB2YWxpZCBMT0lOQ3MgdGhhdCBkaWZmZXIgb25seSBpbiB1bml0LXN5c3RlbTpcbiAgLy8gICAzMDI0LTcgIENvbXBvbmVudD1UaHlyb3hpbmUuZnJlZSwgUHJvcGVydHk9TUNuYyAoTWFzcyBjb25jLCBuZy9kTClcbiAgLy8gICAxNDkyMC0zIENvbXBvbmVudD1UaHlyb3hpbmUuZnJlZSwgUHJvcGVydHk9U0NuYyAoTW9sYXIgY29uYywgcG1vbC9MKVxuICAvLyBCb3RoIGFyZSBGcmVlIFQ0IFx1MjAxNCBuZWl0aGVyIGlzIFRvdGFsIFQ0LiBFYXJsaWVyIGhpc3Rvcnk6XG4gIC8vICAgLSBPcmlnaW5hbCBtYXBwaW5nIHdhcyAzMDI0LTcgKGNvcnJlY3Q6IG1hdGNoZXMgVGFpd2FuIG5nL2RMIGxhYnMpLlxuICAvLyAgIC0gQ29tbWl0IDlkYTVlNWIgY2hhbmdlZCBpdCB0byAxNDkyMC0zIG9uIHRoZSBwcmVtaXNlIHRoYXQgMzAyNC03XG4gIC8vICAgICB3YXMgVG90YWwgVDQuIFRoYXQgcHJlbWlzZSB3YXMgaW52ZXJ0ZWQgKHZlcmlmaWVkIGxvaW5jLm9yZy8zMDI0LTcvXG4gIC8vICAgICBcdTIwMTQgQ29tcG9uZW50IGlzIFwiVGh5cm94aW5lLmZyZWVcIik7IHRoZSBjaGFuZ2UgaW50cm9kdWNlZCBhIExPSU5DXHUyMTk0dW5pdFxuICAvLyAgICAgbWlzbWF0Y2ggKG1vbGFyIExPSU5DIHBhaXJlZCB3aXRoIGEgbmcvZEwgdmFsdWUpLlxuICAvLyAgIC0gUmVzdG9yaW5nIDMwMjQtNyBoZXJlIHNvIHRoZSBMT0lOQydzIHByb3BlcnR5IGNsYXNzIChNQ25jKSBtYXRjaGVzXG4gIC8vICAgICB0aGUgdW5pdCBmaWVsZCAobmcvZEwpIFRhaXdhbiBsYWJzIHNoaXAuIFNlZSBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWRcbiAgLy8gICAgIHNlY3Rpb24gRiBmb3IgZnVsbCBldmlkZW5jZS5cbiAgXCIwOTEwNkNcIjogXCIzMDI0LTdcIiwgLy8gRnJlZSBUNCBcdTIwMTQgVGh5cm94aW5lIChUNCkgZnJlZSBbTWFzcy92b2x1bWVdIFMvUFxuICBcIjA5MTEyQ1wiOiBcIjMwMTYtM1wiLCAgLy8gVFNIIFx1MjAxNCBUaHlyb3Ryb3BpbiBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRpYWMgbWFya2VycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTA5OUNcIjogXCIxMDgzOS05XCIsIC8vIFRyb3BvbmluIEkgXHUyMDE0IFRyb3BvbmluIEkgY2FyZGlhYyBTL1BcbiAgXCIxMjE5MkNcIjogXCIzMzk1OS04XCIsIC8vIFByb2NhbGNpdG9uaW4gXHUyMDE0IFMvUFxuICBcIjEyMTkzQ1wiOiBcIjMzNzYyLTZcIiwgLy8gTlQtcHJvQk5QIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFZpdGFtaW5zIC8gY29mYWN0b3JzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTI5Q1wiOiBcIjIxMzItOVwiLCAvLyBWaXQgQjEyIFx1MjAxNCBDb2JhbGFtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzBDXCI6IFwiMjI4NC04XCIsIC8vIEZvbGF0ZSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMDkxMTNDXCI6IFwiMjE0My02XCIsIC8vIENvcnRpc29sIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjExNkNcIjogXCIyMjc2LTRcIiwgLy8gRmVycml0aW4gXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQWN1dGUgcGhhc2UgLyBpbmZsYW1tYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEyMDE1QyBpcyB0aGUgZ2VuZXJpYyBOSEkgQ1JQIG9yZGVyIFx1MjAxNCBtb3N0IGNsaW5pY2FsIGNvbnRleHRzIGluIFx1NTA2NVx1NEZERFxuICAvLyBzZW5kIGEgcmVndWxhciAobm90IGhzLSkgQ1JQLCBzbyBtYXAgdG8gMTk4OC01LiBJZiBhIFx1OTY2Mlx1NjI0MCBzcGVjaWZpY2FsbHlcbiAgLy8gYmlsbHMgaHMtQ1JQIGl0IHdpbGwgbGFuZCBvbiBhIGRpZmZlcmVudCBjb2RlIChlLmcuIDEyMTg5QykuXG4gIFwiMTIwMTVDXCI6IFwiMTk4OC01XCIsIC8vIENSUCBcdTIwMTQgQyByZWFjdGl2ZSBwcm90ZWluIE1hc3Mvdm9sIFMvUFxuICBcIjEyMDUzQ1wiOiBcIjUwNDgtNFwiLCAvLyBBTkEgXHUyMDE0IEFudGludWNsZWFyIEFiIFRpdGVyIFMvUFxuICBcIjEyMDU2QlwiOiBcIjE2MTI0LTBcIiwgLy8gQW50aS1taXRvY2hvbmRyaWFsIEFiIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwNjAxMkNcIjogXCI1Nzc4LTZcIiwgLy8gVXJpbmUgYXBwZWFyYW5jZSBcdTIwMTQgQ29sb3JcbiAgXCIwNjAxM0NcIjogXCIyNDM1Ni04XCIsIC8vIFx1NUMzRlx1NzUxRlx1NTMxNiBwYW5lbCBcdTIwMTQgVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA3MDAxQ1wiOiBcIjE0NTYzLTFcIiwgLy8gU3Rvb2wgb2NjdWx0IGJsb29kXG4gIFwiMDkxMzRDXCI6IFwiNTg0NTMtMlwiLCAvLyBpRk9CVCBxdWFudGl0YXRpdmUgXHUyMDE0IEhlbW9nbG9iaW4gTWFzcy92b2wgU3Rvb2wgYnkgSUFcbiAgXCIxMjExMUNcIjogXCIyMTYxLThcIiwgLy8gVXJpbmUgQ3JlYXRpbmluZSBcdTIwMTQgc2FtZSBMT0lOQyBhcyAwOTAxNkNcbiAgLy8gXHUyNTAwXHUyNTAwIFNlcm9sb2d5IC8gaW1tdW5vbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjAwMUNcIjogXCI1MjkyLThcIiwgLy8gUlBSIFx1MjAxNCBTZXJ1bS9QbGFzbWFcbiAgXCIxMjAyMUNcIjogXCIyMDM5LTZcIiwgLy8gQ0VBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyNUJcIjogXCIyNDY1LTNcIiwgLy8gSWdHIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyN0JcIjogXCIyNDU4LThcIiwgLy8gSWdBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAzMUNcIjogXCIxOTExMy0wXCIsIC8vIElnRSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIDEyMDY5QiBDcnlwdG9jb2NjdXMgQWcgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDUxMzItNiB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnRE5BIHNpbmdsZSBzdHJhbmQgQWIgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0nIChhbnRpLXNzRE5BLFxuICAvLyBsdXB1cyBzZXJvbG9neSBcdTIwMTQgdmVyaWZpZWQgbG9pbmMub3JnLzUxMzItNi8pLiBDb21wbGV0ZWx5IHdyb25nXG4gIC8vIGFuYWx5dGUuIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuXG4gIC8vIFNlZSBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWQuXG4gIFwiMTIwNzlDXCI6IFwiMjQxMDgtM1wiLCAvLyBDQSAxOS05IFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEJsb29kIHR5cGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTEwMDFDXCI6IFwiODgyLTFcIiwgLy8gXHU4ODQwXHU1NzhCXHU5NDUxXHU1QjlBIFx1MjAxNCBBQk8gKyBSaCBncm91cFxuICBcIjExMDAzQ1wiOiBcIjg4Mi0xXCIsIC8vIFx1ODg0MFx1NTc4Qlx1OTQ1MVx1NUI5QSBcdTIwMTQgQUJPICsgUmggZ3JvdXBcbiAgXCIxMTAwNENcIjogXCI4OTAtNFwiLCAvLyBcdTYyOTdcdTlBRDRcdTUzQ0RcdTYxQzkgXHUyMDE0IEFudGlib2R5IHNjcmVlblxuICAvLyBcdTI1MDBcdTI1MDAgTWljcm9iaW9sb2d5IGN1bHR1cmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxMzAwN0MgXHU3RDMwXHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAxNDIxOS0wIHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdIVExWIEkgcDI2IEFiIGluIFNlcnVtJyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gVGhlXG4gIC8vIHJpZ2h0IGZhbWlseSBpcyA2NDYzLTQgLyAxMTI2OC0wIChCYWN0ZXJpYSBpZGVudGlmaWVkIGJ5IGFlcm9iZVxuICAvLyBjdWx0dXJlKSBidXQgdGhlIHNvdXJjZSByb3cgZG9lc24ndCB0ZWxsIHVzIHNwZWNpbWVuIFx1MjAxNCBsZWF2aW5nXG4gIC8vIHVubWFwcGVkIHNvIHdlIGRvbid0IGxpZS4gRmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy5cbiAgLy8gMTMwMTNDIFRCIEN1bHR1cmUgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDMxOTUyLTUgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ1JpbmRlcnBlc3QgdmlydXMgQWcgW1ByZXNlbmNlXSBpbiBFeHVkYXRlJyAoY2F0dGxlXG4gIC8vIG1vcmJpbGxpdmlydXMsIHZlcmlmaWVkIGxvaW5jLm9yZy8zMTk1Mi01LykuIFdyb25nIG9yZ2FuaXNtIGVudGlyZWx5LlxuICAvLyBMZWF2aW5nIHVubWFwcGVkOyBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLiBTZWVcbiAgLy8gZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kLlxuICBcIjEzMDE2QlwiOiBcIjYwMC03XCIsIC8vIEJsb29kIEN1bHR1cmUgXHUyMDE0IEJhY3RlcmlhIGlkZW50aWZpZWQgaW4gQmxvb2RcbiAgLy8gXHUyNTAwXHUyNTAwIFZpcm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxNDAwNEIgQ01WIElnRyBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgNzg0OS0zIHdoaWNoIGlzIGFjdHVhbGx5XG4gIC8vICdUYWVuaWEgc29saXVtIGxhcnZhIElnTSBBYiBbUHJlc2VuY2VdIGluIFNlcnVtJyAocG9yayB0YXBld29ybSxcbiAgLy8gdmVyaWZpZWQgbG9pbmMub3JnLzc4NDktMy8pLiBObyB2ZXJpZmllZCBjYW5vbmljYWwgcmVwbGFjZW1lbnQgZm91bmRcbiAgLy8gaW4gdGhpcyBwYXNzIChjYW5kaWRhdGVzIDUxMjYtOCAvIDUxMjUtMCBhcmUgSWdNIG9yIG1ldGhvZC1zcGVjaWZpYyxcbiAgLy8gMjI1OTItOSAvIDIyNTkxLTEgLyAxNjEyNS01IHJldHVybmVkIEhUVFAgNTAwIG9uIGV2ZXJ5IHJldHJ5KS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy5cbiAgXCIxNDA0OEJcIjogXCI3ODUzLTVcIiwgLy8gQ01WIElnTSBcdTIwMTQgQ3l0b21lZ2Fsb3ZpcnVzIElnTSBBYiBbVW5pdHMvdm9sdW1lXSBTL1BcbiAgLy8gICByZXN0b3JlZCBhZnRlciBhdWRpdDogMTQwNDhCIHByZXZpb3VzbHkgbWFwcGVkIHRvIDc4NTAtMSB3aGljaCBpc1xuICAvLyAgICdUYWVuaWEgc29saXVtIGxhcnZhIEFiJyAodmVyaWZpZWQgbG9pbmMub3JnLzc4NTAtMS8pLiA3ODUzLTVcbiAgLy8gICB2ZXJpZmllZCBhcyB0aGUgY2Fub25pY2FsIENNViBJZ00gTE9JTkMgKENvbXBvbmVudD1DeXRvbWVnYWxvdmlydXNcbiAgLy8gICBBYi5JZ00sIFByb3BlcnR5PUFDbmMpIFx1MjAxNCBsb2luYy5vcmcvNzg1My01Ly5cbiAgXCIxNDA2NkNcIjogXCI4MDM4My0zXCIsIC8vIEluZmx1ZW56YSBBIFx1MjAxNCBBZyBSZXNwaXJhdG9yeVxuICBcIjE0MDg0Q1wiOiBcIjk0NTU4LTRcIiwgLy8gU0FSUy1Db1YtMiBBZyBcdTIwMTQgUmVzcGlyYXRvcnlcbiAgXCIxMjE4NENcIjogXCI4ODE1Ny0zXCIsIC8vIENNViBETkEgcXVhbnQgUENSIFx1MjAxNCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIE15Y29iYWN0ZXJpdW0gLyBhY2lkLWZhc3QgKGFkZGVkIGFmdGVyIGF1ZGl0KSBcdTI1MDBcbiAgXCIxMzAyNUNcIjogXCIyOTI2MC03XCIsIC8vIFx1NjI5N1x1OTE3OFx1NjAyN1x1NkZDM1x1N0UyRVx1NjJCOVx1NzI0N1x1NjdEM1x1ODI3Mlx1NkFBMlx1NjdFNSBcdTIwMTQgTXljb2JhY3Rlcml1bSBBRkIgc3RhaW5cbiAgXCIxMzAyNkNcIjogXCIyOTU1My01XCIsIC8vIFx1NjI5N1x1OTE3OFx1ODNDQ1x1NTdGOVx1OTkwQSBcdTIwMTQgTXljb2JhY3Rlcml1bSBjdWx0dXJlIGxpcXVpZCtzb2xpZFxuICAvLyBcdTI1MDBcdTI1MDAgQUJHIHBhbmVsICgwOTA0MUIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBJbnRlbnRpb25hbGx5IE5PVCBtYXBwZWQgaGVyZSBcdTIwMTQgMDkwNDFCIGlzIGEgcGFuZWwgb3JkZXIgdGhhdFxuICAvLyB1bmZvbGRzIGludG8gbWFueSBpdGVtcyAocEggLyBwQ08yIC8gcE8yIC8gSENPMyAvIFRDTzIgLyBTQkUgL1xuICAvLyBBQkUgLyBTQkMgLyBTQVQpLiBNYXBwaW5nIHRoZSBwYW5lbCBjb2RlIHRvIFwicEhcIiB3b3VsZCBtaXMtbGFiZWxcbiAgLy8gZXZlcnkgbm9uLXBIIHJvdyB0aGF0IHNoYXJlcyB0aGlzIE5ISSBjb2RlLiBFYWNoIGl0ZW0gaXNcbiAgLy8gcmVzb2x2ZWQgdmlhIF9MT0lOQ19NQVAgZGlzcGxheS1rZXl3b3JkIGZhbGxiYWNrIGJlbG93OyAwOTA0MUJcbiAgLy8gYWxzbyBhcHBlYXJzIGluIF9ESVNQTEFZX0ZJUlNUX0NPREVTIHNvIGRpc3BsYXkgYWx3YXlzIHdpbnMuXG4gIC8vIFx1MjUwMFx1MjUwMCBCb2R5IGZsdWlkIC8gc3lub3ZpYWwgZmx1aWQgcGFuZWwgKDE2MDA4QyB1bmZvbGRzOyB0aGVcbiAgLy8gbWVtYmVyIGl0ZW1zIHJlbHkgb24gZGlzcGxheSBrZXl3b3JkcyBmb3Igc3BlY2ltZW4tYXdhcmVcbiAgLy8gTE9JTkNzKS4gUGFyZW50IGNvZGUgbWFwcyB0byBzeW5vdmlhbCBmbHVpZCBhbmFseXNpcyBwYW5lbC4gXHUyNTAwXHUyNTAwXG4gIC8vIDE2MDA4QyBcdTZFRDFcdTZEQjJcdTZBQTJcdTY3RTUgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDMzOTAzLTYgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0tldG9uZXMgW1ByZXNlbmNlXSBpbiBVcmluZScgKHZlcmlmaWVkIGxvaW5jLm9yZykuXG4gIC8vIExlYXZpbmcgdW5tYXBwZWQ7IHRoZSBwYW5lbCBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2Rpbmcgb25seVxuICAvLyBhbmQgdGhlIHBlci1pdGVtIGRpc3BsYXlzIGluIF9MT0lOQ19NQVAgY2FycnkgdGhlaXIgb3duIExPSU5Dc1xuICAvLyB3aGVyZSBrbm93bi5cbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfRElTUExBWV9GSVJTVF9DT0RFUyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBjb2RlcyB0aGF0IGFyZSAqcGFuZWxzKiBcdTIwMTQgb25lIGJpbGxpbmcgY29kZSwgbWFueSBpdGVtLXNwZWNpZmljXG4vLyBkaXNwbGF5cy4gRm9yIHRoZXNlLCBkaXNwbGF5IGtleXdvcmQgTVVTVCBiZSB0cmllZCBmaXJzdCAoc28gXCJXQkNcIlxuLy8gdW5kZXIgQ0JDIHBhbmVsIDA4MDExQyBnZXRzIDY2OTAtMiwgbm90IHRoZSBnZW5lcmljIHBhbmVsIExPSU5DKS5cbi8vIEZvciBldmVyeXRoaW5nIGVsc2UgKHNpbmdsZS10ZXN0IGNvZGVzIGxpa2UgMDkwMDVDIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENixcbi8vIDA5MDQ0QyBMREwsIDE0MDMwQyBIQnNBZyksIHRoZSBOSEkgY29kZSBpcyBtb3JlIHNwZWNpZmljIHRoYW4gYW55XG4vLyBkaXNwbGF5IGtleXdvcmQgYW5kIHdpbnMgb3V0cmlnaHQuXG4vL1xuLy8gREVTSUdOIFBISUxPU09QSFk6IHRoZSBicmlkZ2UgaXMgYSAqZmFpdGhmdWwgdHJhbnNwb3J0KiBsYXllciBcdTIwMTQgaXRcbi8vIHRydXN0cyB0aGUgXHU1MDY1XHU0RkREIGJpbGxpbmcgY29kZSBhcyBhdXRob3JpdGF0aXZlIGZvciBjbGluaWNhbCBpbnRlbnRcbi8vIChcdTk2NjJcdTYyNDAgYmlsbGVkIDA5MDA1QyA9IHRoZXkgb3JkZXJlZCBmYXN0aW5nIGdsdWNvc2UsIHJlZ2FyZGxlc3Mgb2Zcbi8vIHdoZXRoZXIgdGhlIG9wZXJhdGlvbmFsIHNwZWNpbWVuIHdhcyBhIGZpbmdlci1zdGljaykuIERpc3BsYXktc3RyaW5nXG4vLyByZS1pbnRlcnByZXRhdGlvbiBvZiBjbGluaWNhbCBjb250ZXh0IChHbHUtQUMgdnMgRklOR0VSIFNVR0FSIHZzXG4vLyByYW5kb20pIGlzIGxlZnQgdG8gdGhlIFNNQVJUIGFwcCwgd2hpY2ggaGFzIG1vcmUgVUkgY29udGV4dC5cbmV4cG9ydCBjb25zdCBESVNQTEFZX0ZJUlNUX0NPREVTOiBSZWFkb25seVNldDxzdHJpbmc+ID0gbmV3IFNldChbXG4gIFwiMDgwMTFDXCIsIC8vIENCQyBwYW5lbFxuICBcIjA4MDEzQ1wiLCAvLyBDQkMgdy8gYXV0byBkaWZmIHBhbmVsXG4gIFwiMDYwMTNDXCIsIC8vIFVyaW5hbHlzaXMgbWFjcm9zY29waWMgcGFuZWxcbiAgXCIwOTA0MUJcIiwgLy8gQUJHIHBhbmVsXG4gIFwiMTYwMDhDXCIsIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBwYW5lbFxuXSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBfUEFORUxfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gUGFuZWwtc3BlY2lmaWMgZGlzcGxheSBcdTIxOTIgTE9JTkMgb3ZlcnJpZGVzLiBUaGVzZSBydW4gQkVGT1JFIHRoZSBnbG9iYWxcbi8vIF9MT0lOQ19NQVAgc28gdGhhdCB1cmluZSBiaWxpcnViaW4gdW5kZXIgMDYwMTNDIG1hcHMgdG8gNTc3MC0zICh1cmluZVxuLy8gc3BlY2ltZW4pIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIGdsb2JhbCAnYmlsaXJ1YmluJyB0aGF0XG4vLyB3b3VsZCBpbXBseSBzZXJ1bSwgYW5kIGFuYWxvZ291cyBzcGVjaW1lbi1hd2FyZSBkaXNhbWJpZ3VhdGlvbiBmb3Jcbi8vIG90aGVyIHBhbmVsIHN1Yi1pdGVtcy4gS2V5cyBhcmUgTkhJIHBhbmVsIGNvZGVzIChtdXN0IGFsc28gYmUgaW5cbi8vIF9ESVNQTEFZX0ZJUlNUX0NPREVTKTsgdmFsdWVzIGFyZSBkaXNwbGF5LWtleXdvcmQgXHUyMTkyIExPSU5DIGRpY3RzIHRoYXRcbi8vIGZvbGxvdyB0aGUgc2FtZSBtYXRjaGluZyBzZW1hbnRpY3MgYXMgX0xPSU5DX01BUCAobGVhZGluZyB3b3JkXG4vLyBib3VuZGFyeSBmb3IgQVNDSUksIHN1YnN0cmluZyBmb3IgQ0pLKS5cbmV4cG9ydCBjb25zdCBQQU5FTF9MT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gQWxsIHJvdXRpbmUgZGlwc3RpY2sgaXRlbXMgcmVzaWRlIG9uIGEgc2luZ2xlIE5ISSBiaWxsaW5nIGNvZGUuXG4gIC8vIFdpdGhvdXQgdGhpcyB0YWJsZSB0aGV5J2QgYWxsIGNvbGxhcHNlIHRvIHRoZSBwYW5lbCBMT0lOQyAyNDM1Ni04LFxuICAvLyBsb3NpbmcgcGVyLWl0ZW0gZ3JhbnVsYXJpdHkgdGhhdCdzIGNsaW5pY2FsbHkgdXNlZnVsIChlLmcuXG4gIC8vIGJpbGlydWJpbiB2cyB1cm9iaWxpbm9nZW4gZm9yIGxpdmVyIHdvcmt1cCkuXG4gIFwiMDYwMTNDXCI6IHtcbiAgICAvLyBPcmRlciBtYXR0ZXJzOiBsb25nZXIvbW9yZS1zcGVjaWZpYyBrZXlzIGJlZm9yZSBnZW5lcmljIG9uZXNcbiAgICAvLyAobWF0Y2hlcyBfTE9JTkNfTUFQIGl0ZXJhdGlvbiBzZW1hbnRpY3MgXHUyMDE0IGZpcnN0IGhpdCB3aW5zKS5cbiAgICBcInNwZWNpZmljIGdyYXZpdHlcIjogXCI1ODExLTVcIiwgLy8gU3BlY2lmaWMgZ3Jhdml0eSBVcmluZVxuICAgIFwic3AuZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFwic3AgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFx1NkJENFx1OTFDRDogXCI1ODExLTVcIixcbiAgICBcIm1pY3JvLWFsYnVtaW5cIjogXCIxNDk1Ny01XCIsIC8vIE1pY3JvYWxidW1pbiBNYXNzL3ZvbCBVcmluZVxuICAgIG1pY3JvYWxidW1pbjogXCIxNDk1Ny01XCIsXG4gICAgXCJtYWxiKHUpXCI6IFwiMTQ5NTctNVwiLFxuICAgIG1hbGI6IFwiMTQ5NTctNVwiLFxuICAgIFx1NUZBRVx1NUMwRlx1NzY3RFx1ODZDQlx1NzY3RDogXCIxNDk1Ny01XCIsXG4gICAgdWFjcjogXCIxNDk1OS0xXCIsIC8vIE1pY3JvYWxidW1pbi9DcmVhdGluaW5lIHJhdGlvIFVyaW5lXG4gICAgXCJ1cmluZSBnbHVjb3NlXCI6IFwiNTc5Mi03XCIsXG4gICAgc3VnYXI6IFwiNTc5Mi03XCIsIC8vIE5ISSAnXHU1QzNGXHU3Q0Q2JyAvICdTdWdhcicgdW5kZXIgMDYwMTNDXG4gICAgXHU1QzNGXHU3Q0Q2OiBcIjU3OTItN1wiLFxuICAgIHVyb2JpbGlub2dlbjogXCI1ODE4LTBcIiwgLy8gVXJvYmlsaW5vZ2VuIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDIwXHU1MzlGOiBcIjU4MTgtMFwiLFxuICAgIGJpbGlydWJpbjogXCI1NzcwLTNcIiwgLy8gQmlsaXJ1YmluIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDA1XHU3RDIwOiBcIjU3NzAtM1wiLFxuICAgIG5pdHJpdGU6IFwiNTgwMi00XCIsIC8vIE5pdHJpdGUgVXJpbmVcbiAgICBcdTRFOUVcdTc4NURcdTkxNzg6IFwiNTgwMi00XCIsXG4gICAga2V0b25lczogXCI1Nzk3LTZcIiwgLy8gS2V0b25lcyBVcmluZVxuICAgIGtldG9uZTogXCI1Nzk3LTZcIixcbiAgICBcdTkxNkVcdTlBRDQ6IFwiNTc5Ny02XCIsXG4gICAgcHJvdGVpbjogXCIyMDQ1NC01XCIsIC8vIFByb3RlaW4gTWFzcy92b2wgVXJpbmVcbiAgICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAgIFx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgbGV1a29jeXRlOiBcIjU3OTktMlwiLCAvLyBMZXVrb2N5dGVzIFVyaW5lXG4gICAgbGV1OiBcIjU3OTktMlwiLFxuICAgIFx1NzY3RFx1ODg0MFx1NzQwM1x1OTE2Rlx1OTE3NjogXCI1Nzk5LTJcIixcbiAgICBibG9vZDogXCI1Nzk0LTNcIiwgLy8gSGVtb2dsb2JpbiBVcmluZSBRbFxuICAgIFx1NkY1Qlx1ODg0MDogXCI1Nzk0LTNcIixcbiAgICBcdTgyNzI6IFwiNTc3OC02XCIsIC8vIENvbG9yIG9mIFVyaW5lIChDSksgc3Vic3RyaW5nKVxuICAgIGNvbG9yOiBcIjU3NzgtNlwiLFxuICAgIHR1cmJpZGl0eTogXCI1NzY3LTlcIiwgLy8gQXBwZWFyYW5jZSBvZiBVcmluZVxuICAgIGFwcGVhcmFuY2U6IFwiNTc2Ny05XCIsXG4gICAgXHU1OTE2XHU4OUMwOiBcIjU3NjctOVwiLFxuICAgIHBoOiBcIjU4MDMtMlwiLCAvLyBwSCBvZiBVcmluZSAodXJpbmUtc3BlY2lmaWMsIE5PVFxuICAgIC8vIHRoZSBhcnRlcmlhbCAxMTU1OC00IHRoYXQgdGhlXG4gICAgLy8gZ2xvYmFsIG1hcCBwb2ludHMgdG8pXG4gICAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIjU4MDMtMlwiLFxuICAgIGdsdWNvc2U6IFwiNTc5Mi03XCIsIC8vIExhc3QgaW4gdGhpcyBibG9jayBzbyAndXJpbmVcbiAgfSxcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ29tbW9uIFRhaXdhbmVzZSBISVMgbGFiIG5hbWVzIFx1MjE5MiBMT0lOQyBjb2RlIG1hcHBpbmdcbmV4cG9ydCBjb25zdCBMT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBEaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgb25seSBraWNrcyBpbiB3aGVuIE5PIE5ISSBjb2RlIGlzXG4gIC8vIHByZXNlbnQgKGRhc2hib2FyZCByb3dzLCBMTE0tZXh0cmFjdGVkIHRleHQpLiBXaGVuIHRoZSBOSEkgY29kZVxuICAvLyBJUyBwcmVzZW50LCAwOTAwNUMgXHUyMTkyIDE1NTgtNiAoRmFzdGluZykgYW5kIDA5MTQwQyBcdTIxOTIgMjM0NS03XG4gIC8vIChnZW5lcmljKSB3aW5zIGRpcmVjdGx5IHZpYSBfTkhJX1RPX0xPSU5DLlxuICAvL1xuICAvLyBGYWl0aGZ1bC10cmFuc3BvcnQgcHJpbmNpcGxlOiB0aGUgYnJpZGdlIGRvZXMgTk9UIHJlLWludGVycHJldFxuICAvLyBkaXNwbGF5IHN0cmluZ3MgbGlrZSBcIkZJTkdFUiBTVUdBUlwiIGFzIGEgZGlmZmVyZW50IExPSU5DIFx1MjAxNCBpdFxuICAvLyBwcmVzZXJ2ZXMgdGhlIHJhdyBkaXNwbGF5IGluIGBjb2RlLnRleHRgIGFuZCB0aGUgb3JpZ2luYWwgTkhJXG4gIC8vIGNvZGUgaW4gYGNvZGUuY29kaW5nYC4gVGhlIFNNQVJUIGFwcCBkb2VzIHNwZWNpbWVuL21ldGhvZC1hd2FyZVxuICAvLyBncm91cGluZyBvbiB0aGUgY29uc3VtZXIgc2lkZSAoc2VlIFNNQVJUIGFwcCBoYW5kb2ZmIGRvYykuXG4gIFwiZmFzdGluZyBnbHVjb3NlXCI6IFwiMTU1OC02XCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCIxNTU4LTZcIixcbiAgXCJnbHUtYWNcIjogXCIxNTU4LTZcIixcbiAgXCJnbHVjb3NlIGFjXCI6IFwiMTU1OC02XCIsXG4gIGdsdWNvc2U6IFwiMjM0NS03XCIsXG4gIFx1ODg0MFx1N0NENjogXCIyMzQ1LTdcIixcbiAgZ2x1OiBcIjIzNDUtN1wiLFxuICAvLyBIYkExYyBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyBcImhiXCIgZW50cmllcyBzbyB0aGUgbG9uZ2VzdC1wcmVmaXhcbiAgLy8gbWF0Y2ggd2lucyBmb3IgdGhlIFwiSGJBMWNcIiBkaXNwbGF5IHN0cmluZy4gT3RoZXIgQTFjIHN5bm9ueW1zXHUyMDI2XG4gIGhiYTFjOiBcIjQ1NDgtNFwiLFxuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNDU0OC00XCIsXG4gIGExYzogXCI0NTQ4LTRcIixcbiAgaGVtb2dsb2JpbjogXCI3MTgtN1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNzE4LTdcIixcbiAgaGdiOiBcIjcxOC03XCIsXG4gIGhiOiBcIjcxOC03XCIsXG4gIC8vIENCQyBkaWZmIFx1MjAxNCBlb3Npbm9waGlsIGNvdW50IG11c3QgcHJlY2VkZSB0aGUgYmFyZSAnd2JjJy8nXHU3NjdEXHU4ODQwXHU3NDAzJ1xuICAvLyBrZXlzICh3aGljaCB3b3VsZCBvdGhlcndpc2Ugd2luIGFzIHN1YnN0cmluZ3MpLlxuICAvLyA3MTEtMiB2ZXJpZmllZCBhdCBsb2luYy5vcmc6ICdFb3Npbm9waGlscyBbIy92b2x1bWVdIGluIEJsb29kXG4gIC8vIGJ5IEF1dG9tYXRlZCBjb3VudCcuXG4gIFx1NTVEQ1x1OTE3OFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNzExLTJcIixcbiAgZW9zaW5vcGhpbDogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsczogXCI3MTEtMlwiLFxuICB3YmM6IFwiNjY5MC0yXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCI2NjkwLTJcIixcbiAgcGxhdGVsZXQ6IFwiNzc3LTNcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIjc3Ny0zXCIsXG4gIHBsdDogXCI3NzctM1wiLFxuICAvLyBSQkMgKyBSQkMgaW5kaWNlcyBcdTIwMTQgdmVyaWZpZWQgTE9JTkNzIChsb2luYy5vcmcpOlxuICAvLyA3ODktOCAgRXJ5dGhyb2N5dGVzICMvdm9sIEJsb29kIEF1dG8gICAgICAgICAgICAgIFx1MjE5MiBSQkNcbiAgLy8gNzg1LTYgIEVyeXRocm9jeXRlIG1lYW4gY29ycHVzY3VsYXIgaGVtb2dsb2JpbiAgICBcdTIxOTIgTUNIXG4gIC8vIExvbmcgQ0pLIGZvcm1zIGZpcnN0IChMREwvY2hvbGVzdGVyb2wgcGF0dGVybikgc28gJ1x1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1xuICAvLyBcdTg4NDBcdTgyNzJcdTdEMjAnIHdpbnMgb3ZlciBcdTdEMDVcdTg4NDBcdTc0MDMuXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMDogXCI3ODUtNlwiLFxuICByYmM6IFwiNzg5LThcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIjc4OS04XCIsXG4gIG1jaDogXCI3ODUtNlwiLFxuICAvLyBVcmluZSBjcmVhdGluaW5lIFx1MjAxNCBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyAnY3JlYXRpbmluZScgc29cbiAgLy8gcm93cyBsaWtlICdVLUNSRSBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTAnIG9yICdDcmVhdGluaW5lKFUpJyByZXNvbHZlIHRvIHRoZVxuICAvLyB1cmluZSBMT0lOQyAoMjE2MS04KSBpbnN0ZWFkIG9mIGJlaW5nIHNoYWRvd2VkIGJ5IHRoZSBzZXJ1bVxuICAvLyBkZWZhdWx0ICgyMTYwLTApLiBTYW1lIGxvbmdlc3Qtc3BlY2lmaWMtZmlyc3Qgb3JkZXJpbmcgYXNcbiAgLy8gdGhlIGZhc3RpbmctdnMtcmFuZG9tIGdsdWNvc2UgYmxvY2suXG4gIFwidXJpbmUgY3JlYXRpbmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUgdXJpbmVcIjogXCIyMTYxLThcIixcbiAgXCJjcmVhdGluaW5lKHUpXCI6IFwiMjE2MS04XCIsXG4gIFwidS1jcmVcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZWFcIjogXCIyMTYxLThcIixcbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIjIxNjEtOFwiLFxuICBjcmVhdGluaW5lOiBcIjIxNjAtMFwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE1MFx1OTE3ODogXCIyMTYwLTBcIiwgLy8gVGFpd2FuIHZhcmlhbnQgc3BlbGxpbmdcbiAgY3JlYTogXCIyMTYwLTBcIixcbiAgYnVuOiBcIjMwOTQtMFwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiMzA5NC0wXCIsXG4gIGFzdDogXCIxOTIwLThcIixcbiAgYWx0OiBcIjE3NDItNlwiLFxuICBmZXJyaXRpbjogXCIyMjc2LTRcIixcbiAgXHU4ODQwXHU2RTA1XHU5NDM1XHU4NkNCXHU3NjdEOiBcIjIyNzYtNFwiLFxuICBmZXJyOiBcIjIyNzYtNFwiLFxuICAvLyBWaXRhbC1zaWducyBmcm9tIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NSAoSUhLRTM0MDIpIFx1MjAxNCBzZXBhcmF0ZSBjb2RlIG5hbWVzcGFjZVxuICAvLyBidXQgdGhlIGxvb2t1cCBpcyBieSBkaXNwbGF5LW5hbWUgc3Vic3RyaW5nLCBzYW1lIGFzIGZvciBsYWJzLlxuICBcImJvZHkgaGVpZ2h0XCI6IFwiODMwMi0yXCIsXG4gIFwiYm9keSB3ZWlnaHRcIjogXCIyOTQ2My03XCIsXG4gIGJtaTogXCIzOTE1Ni01XCIsXG4gIC8vIFdhaXN0IGNpcmN1bWZlcmVuY2UgXHUyMDE0IG1lYXN1cmVtZW50IExPSU5DICg4MjgwLTApLiA1NjA4Ni0yIGlzXG4gIC8vIHRoZSAnQWR1bHQgV2Fpc3QgQ2lyY3VtZmVyZW5jZSBQcm90b2NvbCcgY29kZSwgd2hpY2ggaXMgYVxuICAvLyBzdXJ2ZXkvcHJvdG9jb2wgZGVzY3JpcHRvciwgTk9UIGEgbnVtZXJpYyBtZWFzdXJlbWVudFxuICAvLyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gTkhJIFx1NTA2NVx1NEZERCByZXBvcnRzIGEgc2luZ2xlIHdhaXN0bGluZVxuICAvLyBudW1iZXIgcGVyIHZpc2l0LCBzbyB0aGUgbWVhc3VyZW1lbnQgY29kZSBpcyBjb3JyZWN0LlxuICBcIndhaXN0IGNpcmN1bWZlcmVuY2VcIjogXCI4MjgwLTBcIixcbiAgXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0ODAtNlwiLFxuICBcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0NjItNFwiLFxuICAvLyBMaXBpZCBwYW5lbCBcdTIwMTQgT1JERVIgTUFUVEVSUy4gTERML0hETCB2YXJpYW50cyBNVVNUIHByZWNlZGUgdGhlXG4gIC8vIGdlbmVyaWMgJ2Nob2xlc3Rlcm9sJyBrZXkgc28gYSByb3cgbGFiZWxsZWQgJ0xETCBDSE9MRVNURVJPTCdcbiAgLy8gcmVzb2x2ZXMgdG8gMTM0NTctNyAoTERMIGNhbGN1bGF0ZWQpIGFuZCAnSERMIENIT0xFU1RFUk9MJyB0b1xuICAvLyAyMDg1LTksIGluc3RlYWQgb2YgZmFsbGluZyB0byAyMDkzLTMgKHRvdGFsIGNob2xlc3Rlcm9sKSB2aWEgdGhlXG4gIC8vICdjaG9sZXN0ZXJvbCcgc3Vic3RyaW5nLiBTYW1lIGNhbm9uaWNhbCBvcmRlcmluZyBhcyBfTEFCX1NZTk9OWU1TLlxuICBcImxkbCBjaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXCJsZGwtY2hvbGVzdGVyb2xcIjogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIC8vIDEzNDU3LTcgPSBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIFx1MjAxNCBtYXRjaGVzIHRoZSBOSEkgMDkwNDRDXG4gIC8vIGJpbGxpbmcgY29kZSdzIGludGVudCAoVGFpd2FuIGxhYnMgcHJlZG9taW5hbnRseSByZXBvcnQgY2FsY3VsYXRlZFxuICAvLyBMREwgdmlhIEZyaWVkZXdhbGQpLiBLZWVwIGNvbnNpc3RlbnQgd2l0aCBfTkhJX1RPX0xPSU5DW1wiMDkwNDRDXCJdLlxuICBcImxkbC1jXCI6IFwiMTM0NTctN1wiLFxuICBsZGw6IFwiMTM0NTctN1wiLFxuICBcImhkbCBjaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcImhkbC1jaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXCJoZGwtY1wiOiBcIjIwODUtOVwiLFxuICBoZGw6IFwiMjA4NS05XCIsXG4gIC8vIFRvdGFsIGNob2xlc3Rlcm9sIFx1MjAxNCBiYXJlICdjaG9sZXN0ZXJvbCcgb25seSBmaXJlcyBBRlRFUiB0aGVcbiAgLy8gTERML0hETC1wcmVmaXhlZCB2YXJpYW50cyBhYm92ZSBoYXZlIGJlZW4gY2hlY2tlZC5cbiAgXCJ0b3RhbCBjaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcInQtY2hvbGVzdGVyb2xcIjogXCIyMDkzLTNcIixcbiAgXHU4ODQwXHU2RTA1XHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwOTMtM1wiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIGNob2xlc3Rlcm9sOiBcIjIwOTMtM1wiLFxuICB0cmlnbHljZXJpZGU6IFwiMjU3MS04XCIsXG4gIFx1NEUwOVx1OTE3OFx1NzUxOFx1NkNCOVx1OTE2RjogXCIyNTcxLThcIixcbiAgXCJ1cmljIGFjaWRcIjogXCIzMDg0LTFcIixcbiAgZWdmcjogXCIzMzkxNC0zXCIsXG4gIGhic2FnOiBcIjUxOTYtMVwiLFxuICBcImFudGktaGN2XCI6IFwiMTYxMjgtMVwiLFxuICAvLyBVcmluZSBwcm90ZWluIChkaXNwbGF5IGZhbGxiYWNrIGZvciB0aGUgbm8tTkhJLWNvZGUgcGF0aCB0aGF0XG4gIC8vIGNvbWVzIGZyb20gSUhLRTM0MDIgdml0YWxzICsgYWR1bHQtcHJldmVudGl2ZSBzdXBwbGVtZW50cykuXG4gIFwidXJpbmUgcHJvdGVpblwiOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICBcInUtcHJvXCI6IFwiMjA0NTQtNVwiLFxuICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAvLyBBQkcgcGFuZWwgY29tcG9uZW50cyBcdTIwMTQgMDkwNDFCIHBhcmVudCBjb2RlIGluIE5ISV9UT19MT0lOQzsgZWFjaFxuICAvLyBtZW1iZXIncyBkaXNwbGF5IChcInBDTzJcIiwgXCJwTzJcIiwgXCJIQ08zXCIsIFwiVENPMlwiLCBcIlNCRS9BQkVcIixcbiAgLy8gXCJTQkNcIiwgXCJTQVRcIiAvIFwiU2FPMlwiKSBmYWxscyB0byBpdHMgb3duIExPSU5DLlxuICAvLyBwSCBNVVNUIGNvbWUgYmVmb3JlIHBjbzIvcG8yIHNvIHRoZSBiYXJlIFwicEhcIiBkaXNwbGF5IGxhbmRzIGhlcmUuXG4gIHBoOiBcIjExNTU4LTRcIiwgLy8gcEggb2YgQXJ0ZXJpYWwgYmxvb2RcbiAgcGNvMjogXCIyMDE5LThcIiwgLy8gQ2FyYm9uIGRpb3hpZGUgcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgcG8yOiBcIjI3MDMtN1wiLCAvLyBPeHlnZW4gcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgaGNvMzogXCIxOTU5LTZcIiwgLy8gQmljYXJib25hdGUgTW9sZXMvdm9sIEFydGVyaWFsXG4gIGJpY2FyYm9uYXRlOiBcIjE5NTktNlwiLFxuICB0Y28yOiBcIjIwMjgtOVwiLCAvLyBUb3RhbCBDTzIgTW9sZXMvdm9sIEFydGVyaWFsXG4gIHNiZTogXCIxMTU1NS0wXCIsIC8vIFN0YW5kYXJkIGJhc2UgZXhjZXNzIEFydGVyaWFsXG4gIGFiZTogXCIxMTU1NS0wXCIsXG4gIHNiYzogXCIxOTI1LTdcIiwgLy8gU3RhbmRhcmQgYmljYXJib25hdGUgQXJ0ZXJpYWxcbiAgc2F0dXJhdDogXCIyNzEzLTZcIiwgLy8gTzIgc2F0dXJhdGlvbiBBcnRlcmlhbFxuICBzYW8yOiBcIjI3MTMtNlwiLFxuICBzYXQ6IFwiMjcxMy02XCIsIC8vIE5ISSBkaXNwbGF5IHNob3dzIGp1c3QgXCJTQVRcIlxuICAvLyBTeW5vdmlhbCAvIGJvZHktZmx1aWQgY29tcG9uZW50cyAoMTYwMDhDIHBhcmVudCBhYm92ZSkuXG4gIFwic2YuY29sb3JcIjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgQm9keSBmbHVpZCAocmV1c2UgVXJpbmUgY29sb3Igc3BlYyBPSylcbiAgLy8gTk9URTogODI1NS0yIC8gMTM5NDgtNSBwcmV2aW91c2x5IGxpc3RlZCBoZXJlIGJvdGggdHVybmVkIG91dFxuICAvLyB0byBiZSB1bnJlbGF0ZWQgTE9JTkNzICh2ZXJpZmllZCBsb2luYy5vcmcgXHUyMDE0IDgyNTUtMiBpc1xuICAvLyAnU2VydmljZSBjb21tZW50IDEzJywgMTM5NDgtNSBpcyAnQ29jY2lkaW9pZGVzIGltbWl0aXMgSWdNXG4gIC8vIEFiJykuIEJvZHktZmx1aWQgQXBwZWFyYW5jZSAvIFJCQyBkb24ndCBoYXZlIHdlbGwtYXR0ZXN0ZWRcbiAgLy8gTE9JTkNzIGluIG91ciB0YWJsZSB5ZXQgXHUyMDE0IGZhbGxpbmcgdGhyb3VnaCB0byBjb2RlLnRleHQtb25seVxuICAvLyBpcyBzYWZlciB0aGFuIGVtaXR0aW5nIGEgbWlzbGVhZGluZyBMT0lOQy4gVG8gYWRkIGxhdGVyLFxuICAvLyB2ZXJpZnkgZWFjaCBhZ2FpbnN0IGxvaW5jLm9yZyBmaXJzdC5cbiAgXCJzZi53YmNcIjogXCIyNjQ2Ni0zXCIsIC8vIFdCQyAjL3ZvbCBCb2R5IGZsdWlkXG4gIFwic2YubmV1dHJvcGhpbFwiOiBcIjEwMzI4LTZcIiwgLy8gTmV1dHJvcGhpbHMvMTAwIGxldWtvY3l0ZXMgaW4gQm9keSBmbHVpZFxuICBcInNmLmx5bXBob1wiOiBcIjEzMDQ2LThcIiwgLy8gTHltcGhvY3l0ZXMgIy92b2wgQm9keSBmbHVpZFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19ESVNQTEFZIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ2Fub25pY2FsIEVuZ2xpc2ggZGlzcGxheSBuYW1lcyBmb3IgTE9JTkMgY29kZXMgdGhlIGJyaWRnZSBlbWl0cy5cbi8vIEZhbGxzIGJhY2sgdG8gdGhlIHJhdyBpbnB1dCBkaXNwbGF5IHdoZW4gYSBMT0lOQyBpc24ndCBsaXN0ZWQgaGVyZS5cbi8vIFNvdXJjZWQgZnJvbSBsb2luYy5vcmcgY2Fub25pY2FsIHNob3J0IG5hbWVzIHdoZXJlIGFwcGxpY2FibGUuXG4vLyBBZGQgbmV3IGVudHJpZXMgYXMgd2Ugd2lkZW4gTE9JTkMgY292ZXJhZ2UgXHUyMDE0IHRoZSBsb29rdXAgaXMga2V5ZWQgb25cbi8vIExPSU5DIHN0cmluZywgc28gdW5tYXBwZWQgTE9JTkNzIGRlZ3JhZGUgZ3JhY2VmdWxseSB0byB0aGUgTkhJIHRleHQuXG5leHBvcnQgY29uc3QgTE9JTkNfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQyBwYW5lbCBzdWItaXRlbXMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBNb3N0IGNyaXRpY2FsIGJsb2NrIFx1MjAxNCBOSEkncyBcIkNvbG9yIFx1NUMzRiBcdTk4NEYgIC4uLlwiIHN0eWxlIGxhYmVscyBhcmVcbiAgLy8gd2hhdCB0cmlnZ2VycyBkb3duc3RyZWFtIENoaW5lc2Utc3Vic3RyaW5nIGxhYmVsbGluZyBidWdzLlxuICBcIjU4MDMtMlwiOiBcInBIIG9mIFVyaW5lXCIsXG4gIFwiNTgxMS01XCI6IFwiU3BlY2lmaWMgZ3Jhdml0eSBvZiBVcmluZVwiLFxuICBcIjU3NzAtM1wiOiBcIkJpbGlydWJpbiBVcmluZSBRbFwiLFxuICBcIjU4MDItNFwiOiBcIk5pdHJpdGUgVXJpbmUgUWxcIixcbiAgXCI1Nzc4LTZcIjogXCJDb2xvciBvZiBVcmluZVwiLFxuICBcIjU3NjctOVwiOiBcIkFwcGVhcmFuY2Ugb2YgVXJpbmVcIixcbiAgXCI1ODE4LTBcIjogXCJVcm9iaWxpbm9nZW4gVXJpbmUgUWxcIixcbiAgXCIyMDQ1NC01XCI6IFwiUHJvdGVpbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU3LTVcIjogXCJNaWNyb2FsYnVtaW4gTWFzcy9Wb2wgaW4gVXJpbmVcIixcbiAgXCIxNDk1OS0xXCI6IFwiTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgUmF0aW8gaW4gVXJpbmVcIixcbiAgXCI1NzkyLTdcIjogXCJHbHVjb3NlIFVyaW5lIFFsXCIsXG4gIFwiNTc5Ny02XCI6IFwiS2V0b25lcyBVcmluZSBRbFwiLFxuICBcIjU3OTQtM1wiOiBcIkhlbW9nbG9iaW4gVXJpbmUgUWxcIixcbiAgXCI1Nzk5LTJcIjogXCJMZXVrb2N5dGVzIFVyaW5lIFFsXCIsXG4gIFwiMjQzNTYtOFwiOiBcIlVyaW5hbHlzaXMgTWFjcm8gUGFuZWxcIixcbiAgLy8gQUxMIGVudHJpZXMgYmVsb3cgdXNlIHRoZSBMT0lOQyBjYW5vbmljYWwgJ0xvbmcgQ29tbW9uIE5hbWUnXG4gIC8vIGFzIGFjY2VwdGVkIGJ5IHRoZSBUV05ISUZISVIgdmFsaWRhdG9yLiBTb3VyY2U6IGxvaW5jLm9yZyBmb3JcbiAgLy8gZWFjaCBjb2RlLCBjcm9zcy1jaGVja2VkIGFnYWluc3QgdGhlIHZhbGlkYXRvcidzIHJlcG9ydGVkXG4gIC8vICdWYWxpZCBkaXNwbGF5IGlzIG9uZSBvZiBOIGNob2ljZXMnIGZvciBkaXNwbGF5cyB3ZSBwcmV2aW91c2x5XG4gIC8vIGdvdCB3cm9uZyAoNDUgTE9JTkNzIGZvdW5kIGluIHRoZSBQMzMzMzMzMzMzIHZhbGlkYXRpb24gcnVuKS5cbiAgLy8gV2hlbiB1cGRhdGluZywgY29weSB0aGUgZXhhY3QgZW4tVVMgbG9uZyBuYW1lIGZyb20gbG9pbmMub3JnIFx1MjAxNFxuICAvLyB0aGUgdmFsaWRhdG9yIGlzIHNlbnNpdGl2ZSB0byBzcGVsbGluZyAvIHB1bmN0dWF0aW9uLlxuICAvL1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgKDA5MDQxQiBwYW5lbCkgXHUyMDE0IG5vdCBpbiB2YWxpZGF0b3Igb3V0cHV0OyBsb2luYy5vcmcgc291cmNlZFxuICBcIjExNTU4LTRcIjogXCJwSCBvZiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMTktOFwiOiBcIkNhcmJvbiBkaW94aWRlIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjI3MDMtN1wiOiBcIk94eWdlbiBbUGFydGlhbCBwcmVzc3VyZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIxOTU5LTZcIjogXCJCaWNhcmJvbmF0ZSBbTW9sZXMvdm9sdW1lXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMjgtOVwiOiBcIkNhcmJvbiBkaW94aWRlIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjExNTU1LTBcIjogXCJCYXNlIGV4Y2VzcyBpbiBBcnRlcmlhbCBibG9vZCBieSBjYWxjdWxhdGlvblwiLFxuICBcIjE5MjUtN1wiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kIC0tc3RhbmRhcmRcIixcbiAgXCIyNzEzLTZcIjogXCJPeHlnZW4gc2F0dXJhdGlvbiBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNTU4LTZcIjogXCJGYXN0aW5nIGdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzQ1LTdcIjogXCJHbHVjb3NlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZW1hdG9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjcxOC03XCI6IFwiSGVtb2dsb2JpbiBbTWFzcy92b2x1bWVdIGluIEJsb29kXCIsXG4gIFwiNDU0OC00XCI6IFwiSGVtb2dsb2JpbiBBMWMvSGVtb2dsb2Jpbi50b3RhbCBpbiBCbG9vZFwiLFxuICBcIjY2OTAtMlwiOiBcIkxldWtvY3l0ZXMgWyMvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3NzctM1wiOiBcIlBsYXRlbGV0cyBbIy92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc4OS04XCI6IFwiRXJ5dGhyb2N5dGVzIFsjL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzg1LTZcIjogXCJNQ0ggW0VudGl0aWMgbWFzc10gYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzExLTJcIjogXCJFb3Npbm9waGlscyBbIy92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjQ1NDQtM1wiOiBcIkhlbWF0b2NyaXQgW1ZvbHVtZSBGcmFjdGlvbl0gb2YgQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNTcwMjEtOFwiOiBcIkNCQyBXIEF1dG8gRGlmZmVyZW50aWFsIHBhbmVsIC0gQmxvb2RcIixcbiAgXCIyNDMxNy0wXCI6IFwiSGVtb2dyYW0gYW5kIHBsYXRlbGV0cyBXTyBkaWZmZXJlbnRpYWwgcGFuZWwgLSBCbG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IC8gbGl2ZXIgLyByZW5hbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxOTIwLThcIjogXCJBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc0Mi02XCI6IFwiQWxhbmluZSBhbWlub3RyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMTYwLTBcIjogXCJDcmVhdGluaW5lIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjE2MS04XCI6IFwiQ3JlYXRpbmluZSBbTWFzcy92b2x1bWVdIGluIFVyaW5lXCIsXG4gIFwiMzM5MTQtM1wiOlxuICAgIFwiR2xvbWVydWxhciBmaWx0cmF0aW9uIHJhdGUgW1ZvbHVtZSBSYXRlL0FyZWFdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBDcmVhdGluaW5lLWJhc2VkIGZvcm11bGEgKE1EUkQpLzEuNzMgc3EgTVwiLFxuICBcIjMwOTQtMFwiOiBcIlVyZWEgbml0cm9nZW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMDg0LTFcIjogXCJVcmF0ZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI5NTEtMlwiOiBcIlNvZGl1bSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyODIzLTNcIjogXCJQb3Rhc3NpdW0gW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk3NS0yXCI6IFwiQmlsaXJ1YmluLnRvdGFsIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk2OC03XCI6IFwiQmlsaXJ1YmluLmRpcmVjdCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3NTEtN1wiOiBcIkFsYnVtaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyNTMyLTBcIjogXCJMYWN0YXRlIGRlaHlkcm9nZW5hc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjY3NjgtNlwiOiBcIkFsa2FsaW5lIHBob3NwaGF0YXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzI0LTJcIjogXCJHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc4NjEtNlwiOiBcIkNhbGNpdW0gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIExpcGlkIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjIwOTMtM1wiOiBcIkNob2xlc3Rlcm9sIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjU3MS04XCI6IFwiVHJpZ2x5Y2VyaWRlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjA4NS05XCI6IFwiQ2hvbGVzdGVyb2wgaW4gSERMIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTM0NTctN1wiOiBcIkNob2xlc3Rlcm9sIGluIExETCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBjYWxjdWxhdGlvblwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVGh5cm9pZCAvIGhvcm1vbmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjMwMTYtM1wiOiBcIlRoeXJvdHJvcGluIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMwMjQtN1wiOiBcIlRoeXJveGluZSAoVDQpIGZyZWUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNDkyMC0zXCI6IFwiVGh5cm94aW5lIChUNCkgZnJlZSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyOTg2LThcIjogXCJUZXN0b3N0ZXJvbmUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCI4MzA5OC00XCI6IFwiRm9sbGl0cm9waW4gW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIFwiODMwOTYtOFwiOiBcIkVzdHJhZGlvbCAoRTIpIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkaWFjIC8gaW5mbGFtbWF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEwODM5LTlcIjogXCJUcm9wb25pbiBJLmNhcmRpYWMgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMzc2Mi02XCI6IFwiTmF0cml1cmV0aWMgcGVwdGlkZS5CIHByb2hvcm1vbmUgTi1UZXJtaW5hbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5ODgtNVwiOiBcIkMgcmVhY3RpdmUgcHJvdGVpbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMzOTU5LThcIjogXCJQcm9jYWxjaXRvbmluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgLyBzZXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI1MTk1LTNcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCI1MTk2LTFcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtVbml0cy92b2x1bWVdIGluIFNlcnVtXCIsXG4gIFwiMTYxMjgtMVwiOiBcIkhlcGF0aXRpcyBDIHZpcnVzIEFiIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCIxMzk1NS0wXCI6IFwiSGVwYXRpdGlzIEMgdmlydXMgQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgLy8gXHUyNTAwXHUyNTAwIFZpcm9sb2d5IChhdWRpdCAyMDI2LTA1LTE5KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI3ODUzLTVcIjogXCJDeXRvbWVnYWxvdmlydXMgSWdNIEFiIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVHVtb3IgbWFya2VycyAvIHByb3RlaW5zIChhdWRpdCAyMDI2LTA1LTE5KSBcdTI1MDBcdTI1MDBcbiAgXCIxOTUyLTFcIjogXCJCZXRhLTItTWljcm9nbG9idWxpbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ29hZ3VsYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNjMwMS02XCI6IFwiSU5SIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hIGJ5IENvYWd1bGF0aW9uIGFzc2F5XCIsXG4gIFwiMTQ5NzktOVwiOiBcImFQVFQgaW4gUGxhdGVsZXQgcG9vciBwbGFzbWEgYnkgQ29hZ3VsYXRpb24gYXNzYXlcIixcbiAgXCIzMDI0MC02XCI6IFwiRmlicmluIEQtZGltZXIgW01hc3Mvdm9sdW1lXSBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVml0YWwgc2lnbnMgKElIS0UzNDAyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI4MzAyLTJcIjogXCJCb2R5IGhlaWdodFwiLFxuICBcIjI5NDYzLTdcIjogXCJCb2R5IHdlaWdodFwiLFxuICBcIjM5MTU2LTVcIjogXCJCb2R5IG1hc3MgaW5kZXggKEJNSSkgW1JhdGlvXVwiLFxuICBcIjgyODAtMFwiOiBcIldhaXN0IENpcmN1bWZlcmVuY2UgYXQgdW1iaWxpY3VzIGJ5IFRhcGUgbWVhc3VyZVwiLFxuICBcIjg0ODAtNlwiOiBcIlN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIsXG4gIFwiODQ2Mi00XCI6IFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIsXG4gIFwiODUzNTQtOVwiOiBcIkJsb29kIHByZXNzdXJlIHBhbmVsIHdpdGggYWxsIGNoaWxkcmVuIG9wdGlvbmFsXCIsXG59O1xuIiwgIi8qKlxuICogUHVyZSBwYXJzaW5nIGhlbHBlcnMgXHUyMDE0IHJlZmVyZW5jZSByYW5nZSwgcXVhbnRpdHksIFVDVU0gdW5pdCBub3JtYWxpc2F0aW9uLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9fcGFyc2Vycy5weWAuIFNlbGYtY29udGFpbmVkOiBubyBkZXBlbmRlbmNpZXNcbiAqIG9uIG90aGVyIG9ic2VydmF0aW9uIG1vZHVsZSBwaWVjZXMuXG4gKlxuICogUHVibGljIEFQSTpcbiAqICAgdG9VY3VtKHVuaXQpICAgICAgICAgICAgICAgICAgXHUyMTkyIGNhbm9uaWNhbCBVQ1VNIHVuaXQgc3RyaW5nIChvciBudWxsKVxuICogICBwYXJzZVJhbmdlTXVsdGkocmF3LCB1bml0KSAgICBcdTIxOTIgbGlzdCBvZiBGSElSIHJlZmVyZW5jZVJhbmdlIGVudHJpZXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob25lIHBlciBzZXggd2hlbiBzZXgtc3RyYXRpZmllZClcbiAqICAgcGFyc2VSYW5nZShyYXcsIHVuaXQpICAgICAgICAgXHUyMTkyIHNpbmdsZSByZWZlcmVuY2VSYW5nZSBlbnRyeVxuICogICB0cnlQYXJzZVF1YW50aXR5KHJhdywgdW5pdCkgICBcdTIxOTIgRkhJUiBRdWFudGl0eSBkaWN0IG9yIG51bGxcbiAqL1xuXG5jb25zdCBVQ1VNX1NZU1RFTSA9IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiO1xuXG4vLyBGSElSIFI0IFF1YW50aXR5LmNvbXBhcmF0b3IgYWxsb3dlZCB2YWx1ZXMuIE5vcm1hbGlzZSBmdWxsLXdpZHRoIENKS1xuLy8gXHVGRjFFIFx1RkYxQyBcdTIyNjcgXHUyMjY2ICsgQVNDSUkgdmFyaWFudHMgc28gXCJcdUZGMUUgNDAuMFwiIHN0aWxsIHBhcnNlcyBhcyBhIHJlYWwgbnVtYmVyXG4vLyBpbnN0ZWFkIG9mIGZhbGxpbmcgdGhyb3VnaCB0byB2YWx1ZVN0cmluZyAod2hpY2ggbG9zZXMgdGhlIHVuaXQpLlxuY29uc3QgRlVMTFdJRFRIX09QUzogUmVhZG9ubHlBcnJheTxbc3RyaW5nLCBzdHJpbmddPiA9IFtcbiAgW1wiXHVGRjFFXCIsIFwiPlwiXSxcbiAgW1wiXHVGRjFDXCIsIFwiPFwiXSxcbiAgW1wiXHUyMjY3XCIsIFwiPj1cIl0sXG4gIFtcIlx1MjI2NlwiLCBcIjw9XCJdLFxuICBbXCJcdTIyNjVcIiwgXCI+PVwiXSxcbiAgW1wiXHUyMjY0XCIsIFwiPD1cIl0sXG5dO1xuXG5mdW5jdGlvbiB0cmFuc2xhdGVGdWxsd2lkdGgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IG91dCA9IHM7XG4gIGZvciAoY29uc3QgW2Zyb20sIHRvXSBvZiBGVUxMV0lEVEhfT1BTKSB7XG4gICAgaWYgKG91dC5pbmNsdWRlcyhmcm9tKSkge1xuICAgICAgb3V0ID0gb3V0LnNwbGl0KGZyb20pLmpvaW4odG8pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5jb25zdCBDT01QQVJBVE9SX1JFID0gL15cXHMqKDw9fD49fDx8PilcXHMqKC4rKSQvO1xuXG4vLyBSZWZlcmVuY2UtcmFuZ2UgcGFyc2luZy4gTkhJIHNoaXBzIHRoZSByYW5nZSBhcyBwbGFpbiB0ZXh0IGxpa2Vcbi8vIFwiWzMuODldWzI2LjhdXCIsIFwiWzQwXVtdXCIsIFwiW05lZ2F0aXZlXVwiIG9yIFwiQU0gODowMCA2LjItMTkuNFwiLlxuY29uc3QgUlJfTE9XSElHSF9CUkFDS0VUUyA9IC9eXFxzKlxcW1xccyooW15cXF1dKilcXHMqXFxdXFxzKlxcW1xccyooW15cXF1dKilcXHMqXFxdXFxzKiQvO1xuY29uc3QgUlJfREFTSF9SQU5HRSA9IC8oLT9cXGQrKD86XFwuXFxkKyk/KVxccypbLX5cdTIwMTNdXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pLztcbmNvbnN0IFJSX0NPTVBBUkFUT1IgPSAvXlxccyooPD18Pj18PHw+KVxccyooLT9cXGQrKD86XFwuXFxkKyk/KVxccyokLztcbi8vIFNleC1zdHJhdGlmaWVkIGJyYWNrZXRlZCByYW5nZSwgZS5nLiBcIlx1NzUzNzoxMy43IFx1NTk3MzoxMS4xXCIgXHUyMDE0IHVzZWQgYnkgc29tZVxuLy8gaG9zcGl0YWxzIGZvciBoYWVtYXRvbG9neSAoSGIsIFJCQywgSGN0KS4gUHVsbHMgb3V0IChzZXgsIHZhbHVlKSBwYWlycy5cbi8vIFRvbGVyYXRlcyBvcHRpb25hbCBjb21wYXJhdG9yIChcdTIyNjcvXHUyMjY2Lz4vPCkgYmVmb3JlIHRoZSBudW1iZXIuXG5jb25zdCBSUl9TRVhfTlVNX0cgPSAvKFx1NzUzN1x1NjAyN3xcdTU5NzNcdTYwMjd8XHU3NTM3fFx1NTk3M3xNfEYpXFxzKls6XHVGRjFBXT9cXHMqKD86Wzw+XHUyMjY3XHUyMjY2XT0/KT9cXHMqKC0/XFxkKyg/OlxcLlxcZCspPykvZztcbmNvbnN0IFJSX1NJTkdMRV9CUkFDS0VUID0gL15cXHMqXFxbXFxzKiguKz8pXFxzKlxcXVxccyokLztcbmNvbnN0IFJSX1FVQUxJVEFUSVZFX1BBUkVOID1cbiAgL15cXHMqKE5vcm1hbHxcdTZCNjNcdTVFMzh8Tm9ucmVhY3RpdmV8Tm9uLXJlYWN0aXZlKVxccypcXChcXHMqKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqXFwpXFxzKiQvaTtcblxuY29uc3QgU0VYX1RPX0ZISVI6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBcdTc1MzdcdTYwMjc6IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBcdTc1Mzc6IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBNOiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgXHU1OTczXHU2MDI3OiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG4gIFx1NTk3MzogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxuICBGOiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG59O1xuXG4vLyBQdWJsaWMgdHlwZXMgXHUyMDE0IEZISVIgUXVhbnRpdHkgLyByZWZlcmVuY2VSYW5nZSBzaGFwZXMgdXNlZCBkb3duc3RyZWFtLlxuZXhwb3J0IGludGVyZmFjZSBRdWFudGl0eSB7XG4gIHZhbHVlOiBudW1iZXI7XG4gIHVuaXQ/OiBzdHJpbmc7XG4gIHN5c3RlbT86IHN0cmluZztcbiAgY29kZT86IHN0cmluZztcbiAgY29tcGFyYXRvcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSYW5nZUVudHJ5IHtcbiAgdGV4dDogc3RyaW5nO1xuICBsb3c/OiBRdWFudGl0eTtcbiAgaGlnaD86IFF1YW50aXR5O1xuICBhcHBsaWVzVG8/OiBBcnJheTx7XG4gICAgY29kaW5nOiBBcnJheTx7IHN5c3RlbTogc3RyaW5nOyBjb2RlOiBzdHJpbmc7IGRpc3BsYXk6IHN0cmluZyB9PjtcbiAgICB0ZXh0OiBzdHJpbmc7XG4gIH0+O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVUNVTSBub3JtYWxpc2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIE5ISSBsYWJzIHJlcG9ydCB1bml0cyBpbiBhIG1peCBvZiBVQ1VNLWNsZWFuIHN0cmluZ3MgKCdtZy9kTCcpLFxuICogVGFpd2FuLXN0eWxlIGVxdWl2YWxlbnRzICgnbUVxL0wnIHZzIFVDVU0gJ21lcS9MJyksIGZ1bGwtd2lkdGggcHVuY3R1YXRpb25cbiAqICgnXHVGRjA1JyB2cyAnJScpLCBhbmQgcGxhY2Vob2xkZXIgdGV4dCAoJ1x1NzEyMScpLiBUaGUgVFdOSElGSElSIHZhbGlkYXRvclxuICogcmVqZWN0cyBldmVyeXRoaW5nIGV4Y2VwdCBjYW5vbmljYWwgVUNVTSBpbiBRdWFudGl0eS5jb2RlLCBzbyB3ZVxuICogbm9ybWFsaXNlLiBgbnVsbGAgbWVhbnMgXCJvbWl0IFF1YW50aXR5LmNvZGUgZW50aXJlbHlcIi5cbiAqL1xuY29uc3QgVUNVTV9PVkVSUklERVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bGw+ID0ge1xuICAvLyBGdWxsd2lkdGggXHUyMTkyIEFTQ0lJXG4gIFwiXHVGRjA1XCI6IFwiJVwiLFxuICAvLyBDYXNlLXNlbnNpdGl2ZSBVQ1VNIChFcSBpcyAnZXEnLCBub3QgJ0VxJylcbiAgXCJtRXEvTFwiOiBcIm1lcS9MXCIsXG4gIFwibWVxL2xcIjogXCJtZXEvTFwiLFxuICAvLyBCUCBwcm9maWxlIGZpeGVkLXZhbHVlOiBtbVtIZ10gbm90IG1tSGdcbiAgbW1IZzogXCJtbVtIZ11cIixcbiAgTU1IRzogXCJtbVtIZ11cIixcbiAgLy8gQ29tbW9uIENoaW5lc2UgJ25vIHVuaXQnIHBsYWNlaG9sZGVycyBcdTIxOTIgZHJvcCBVQ1VNIGNvZGVcbiAgXHU3MTIxOiBudWxsLFxuICBcIlwiOiBudWxsLFxuICBcIlx1MjAxNFwiOiBudWxsLFxuICBcIi1cIjogbnVsbCxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VjdW0odW5pdDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXVuaXQpIHJldHVybiBudWxsO1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFVDVU1fT1ZFUlJJREVTLCB1bml0KSkge1xuICAgIHJldHVybiBVQ1VNX09WRVJSSURFU1t1bml0XSA/PyBudWxsO1xuICB9XG4gIHJldHVybiB1bml0O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUXVhbnRpdHkgYnVpbGRlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gbWFrZVF1YW50aXR5KHZhbHVlOiBudW1iZXIsIHVuaXQ6IHN0cmluZyk6IFF1YW50aXR5IHtcbiAgY29uc3QgcTogUXVhbnRpdHkgPSB7IHZhbHVlIH07XG4gIGlmICh1bml0KSB7XG4gICAgcS51bml0ID0gdW5pdDtcbiAgICBxLnN5c3RlbSA9IFVDVU1fU1lTVEVNO1xuICAgIHEuY29kZSA9IHVuaXQ7XG4gIH1cbiAgcmV0dXJuIHE7XG59XG5cbmZ1bmN0aW9uIHRyeVBhcnNlRmxvYXQoczogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmIChzID09PSBcIlwiIHx8IHMgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIC8vIE1pcnJvciBQeXRob24ncyBmbG9hdCgpIFx1MjAxNCBhbGxvdyBsZWFkaW5nL3RyYWlsaW5nIHdoaXRlc3BhY2UsXG4gIC8vIG9wdGlvbmFsIHNpZ24sIGRlY2ltYWwuIFJlamVjdCBpZiBOYU4gT1IgaWYgYW55IG5vbi1udW1lcmljIHJlc2lkdWFsXG4gIC8vIChOdW1iZXIoXCIxMmFiY1wiKSByZXR1cm5zIE5hTiwgT0s7IFwiMTIgIGFiY1wiIGFsc28gTmFOLCBPSykuXG4gIGNvbnN0IHRyaW1tZWQgPSBzLnRyaW0oKTtcbiAgaWYgKHRyaW1tZWQgPT09IFwiXCIpIHJldHVybiBudWxsO1xuICBjb25zdCBuID0gTnVtYmVyKHRyaW1tZWQpO1xuICBpZiAoTnVtYmVyLmlzTmFOKG4pKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIG47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBwYXJzZVJhbmdlTXVsdGkgLyBwYXJzZVJhbmdlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIExpc3QgdmFyaWFudCBvZiBwYXJzZVJhbmdlOiBlbWl0cyBvbmUgZW50cnkgcGVyIHNleCB3aGVuIHRoZSByYW5nZSBpc1xuICogc2V4LXN0cmF0aWZpZWQgKFwiW1x1NzUzNzoxMy43IFx1NTk3MzoxMS4xXVtcdTc1Mzc6MTcuMCBcdTU5NzM6MTUuMF1cIiksIG90aGVyd2lzZSBhXG4gKiBzaW5nbGUtZWxlbWVudCBsaXN0LiBFYWNoIGVudHJ5IHRhZ2dlZCB3aXRoIGFwcGxpZXNUbyBzbyBkb3duc3RyZWFtXG4gKiBjb2RlIGNhbiBwaWNrIHRoZSByaWdodCBvbmUgZm9yIHRoZSBwYXRpZW50J3Mgc2V4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSYW5nZU11bHRpKHJhd1JhbmdlOiBzdHJpbmcsIHVuaXQ6IHN0cmluZyk6IFJhbmdlRW50cnlbXSB7XG4gIGNvbnN0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoKHJhd1JhbmdlIHx8IFwiXCIpLnRyaW0oKSk7XG4gIGlmICghcykgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IGxvd0J5U2V4OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IGhpZ2hCeVNleDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBsZXQgdXNlZE11bHRpID0gZmFsc2U7XG5cbiAgY29uc3QgbSA9IHMubWF0Y2goUlJfTE9XSElHSF9CUkFDS0VUUyk7XG4gIGlmIChtKSB7XG4gICAgY29uc3QgbG93QmxvYiA9IG1bMV0gPz8gXCJcIjtcbiAgICBjb25zdCBoaWdoQmxvYiA9IG1bMl0gPz8gXCJcIjtcbiAgICBmb3IgKGNvbnN0IHNtIG9mIGxvd0Jsb2IubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgaWYgKHNtWzFdICYmIHNtWzJdKSBsb3dCeVNleFtzbVsxXV0gPSBzbVsyXTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzbSBvZiBoaWdoQmxvYi5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICBpZiAoc21bMV0gJiYgc21bMl0pIGhpZ2hCeVNleFtzbVsxXV0gPSBzbVsyXTtcbiAgICB9XG4gICAgdXNlZE11bHRpID0gT2JqZWN0LmtleXMobG93QnlTZXgpLmxlbmd0aCA+IDAgfHwgT2JqZWN0LmtleXMoaGlnaEJ5U2V4KS5sZW5ndGggPiAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFNpbmdsZS1icmFja2V0OiBlYWNoIHBlci1zZXggdmFsdWUncyBjb21wYXJhdG9yIGRlY2lkZXMgbG93IHZzIGhpZ2guXG4gICAgY29uc3Qgc2luZ2xlID0gcy5tYXRjaChSUl9TSU5HTEVfQlJBQ0tFVCk7XG4gICAgaWYgKHNpbmdsZSkge1xuICAgICAgY29uc3QgaW5uZXIgPSBzaW5nbGVbMV0gPz8gXCJcIjtcbiAgICAgIGZvciAoY29uc3Qgc20gb2YgaW5uZXIubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgICBjb25zdCBzZXhLZXkgPSBzbVsxXSA/PyBcIlwiO1xuICAgICAgICBjb25zdCB2YWxTdHIgPSBzbVsyXSA/PyBcIlwiO1xuICAgICAgICAvLyBGaW5kIHRoZSBjb21wYXJhdG9yIGltbWVkaWF0ZWx5IHByZWNlZGluZyB0aGlzIG51bWJlci5cbiAgICAgICAgLy8gTWlycm9yIHRoZSBQeXRob246IHJlYnVpbGQgYSBwZXItc2V4LWtleSBzZWFyY2guXG4gICAgICAgIGNvbnN0IHBhdCA9IG5ldyBSZWdFeHAoYCR7ZXNjYXBlUmVnZXgoc2V4S2V5KX1cXFxccypbOlx1RkYxQV0/XFxcXHMqKFs8Plx1MjI2N1x1MjI2Nl09Pyk/XFxcXHMqLT9cXFxcZGApO1xuICAgICAgICBjb25zdCBjbSA9IGlubmVyLm1hdGNoKHBhdCk7XG4gICAgICAgIGNvbnN0IG9wID0gY20/LlsxXSA/PyBcIlwiO1xuICAgICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgICBsb3dCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9IGVsc2UgaWYgKG9wID09PSBcIjxcIiB8fCBvcCA9PT0gXCI8PVwiKSB7XG4gICAgICAgICAgaGlnaEJ5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG93QnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdXNlZE11bHRpID0gT2JqZWN0LmtleXMobG93QnlTZXgpLmxlbmd0aCA+IDAgfHwgT2JqZWN0LmtleXMoaGlnaEJ5U2V4KS5sZW5ndGggPiAwO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1c2VkTXVsdGkpIHtcbiAgICBjb25zdCBlbnRyaWVzOiBSYW5nZUVudHJ5W10gPSBbXTtcbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIHVuaW9uIG9mIGtleXMgYWN0dWFsbHkgc2VlbiBcdTIwMTQgcHJlc2VydmUgaW5zZXJ0aW9uIG9yZGVyLlxuICAgIGNvbnN0IGFsbFNleEtleXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBrIG9mIFsuLi5PYmplY3Qua2V5cyhsb3dCeVNleCksIC4uLk9iamVjdC5rZXlzKGhpZ2hCeVNleCldKSB7XG4gICAgICBpZiAoIWFsbFNleEtleXMuaW5jbHVkZXMoaykpIGFsbFNleEtleXMucHVzaChrKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzZXhLZXkgb2YgYWxsU2V4S2V5cykge1xuICAgICAgY29uc3QgbWFwcGluZyA9IFNFWF9UT19GSElSW3NleEtleV07XG4gICAgICBpZiAoIW1hcHBpbmcpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgW2ZoaXJDb2RlLCBmaGlyRGlzcGxheV0gPSBtYXBwaW5nO1xuICAgICAgY29uc3QgZW50cnk6IFJhbmdlRW50cnkgPSB7XG4gICAgICAgIHRleHQ6IHJhd1JhbmdlLFxuICAgICAgICBhcHBsaWVzVG86IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vaGw3Lm9yZy9maGlyL2FkbWluaXN0cmF0aXZlLWdlbmRlclwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IGZoaXJDb2RlLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZoaXJEaXNwbGF5LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHRleHQ6IGZoaXJEaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgICAgaWYgKHNleEtleSBpbiBsb3dCeVNleCkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChsb3dCeVNleFtzZXhLZXldISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgICBpZiAoc2V4S2V5IGluIGhpZ2hCeVNleCkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChoaWdoQnlTZXhbc2V4S2V5XSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICAgIGVudHJpZXMucHVzaChlbnRyeSk7XG4gICAgfVxuICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIERlLWR1cCBieSBGSElSIHNleCBjb2RlIGluIGNhc2UgaW5wdXQgaGFzIGJvdGggXHU3NTM3IGFuZCBcdTc1MzdcdTYwMjcuXG4gICAgICBjb25zdCBzZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICBjb25zdCBvdXQ6IFJhbmdlRW50cnlbXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBlIG9mIGVudHJpZXMpIHtcbiAgICAgICAgY29uc3QgYyA9IGUuYXBwbGllc1RvPy5bMF0/LmNvZGluZ1swXT8uY29kZTtcbiAgICAgICAgaWYgKCFjIHx8IHNlZW4uaGFzKGMpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoYyk7XG4gICAgICAgIG91dC5wdXNoKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvbmUgPSBwYXJzZVJhbmdlKHJhd1JhbmdlLCB1bml0KTtcbiAgcmV0dXJuIG9uZSA/IFtvbmVdIDogW107XG59XG5cbi8qKlxuICogQ29udmVydCBhIHJlZmVyZW5jZS1yYW5nZSB0ZXh0IGludG8gYSBGSElSIHJlZmVyZW5jZVJhbmdlIGVudHJ5LlxuICpcbiAqIFN0cmF0ZWd5IGluIG9yZGVyOlxuICogICAxLiBcIltsb3ddW2hpZ2hdXCIgYnJhY2tldGVkIGZvcm1hdCBcdTIwMTQgTkhJJ3MgY2Fub25pY2FsIHNoYXBlLlxuICogICAyLiBcIjMuODktMjYuOFwiIC8gXCIzLjg5fjI2LjhcIiBkYXNoIHJhbmdlLlxuICogICAzLiBcIj4gNDBcIiAvIFwiPCAwLjVcIiBzaW5nbGUtc2lkZWQuXG4gKiAgIDQuIFF1YWxpdGF0aXZlIChcIk5lZ2F0aXZlXCIsIFwiQU0gODowMCA2LjItMTkuNFwiKSBcdTIwMTQgdGV4dC1vbmx5LlxuICpcbiAqIFNleC1zdHJhdGlmaWVkIHNoYXBlcyBnbyB0aHJvdWdoIHBhcnNlUmFuZ2VNdWx0aS4gUmV0dXJucyBudWxsIG9ubHlcbiAqIGZvciBlbXB0eSBpbnB1dC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmFuZ2UocmF3UmFuZ2U6IHN0cmluZywgdW5pdDogc3RyaW5nKTogUmFuZ2VFbnRyeSB8IG51bGwge1xuICBjb25zdCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKChyYXdSYW5nZSB8fCBcIlwiKS50cmltKCkpO1xuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBjb25zdCBlbnRyeTogUmFuZ2VFbnRyeSA9IHsgdGV4dDogcmF3UmFuZ2UgfTtcblxuICBjb25zdCBtID0gcy5tYXRjaChSUl9MT1dISUdIX0JSQUNLRVRTKTtcbiAgaWYgKG0pIHtcbiAgICBjb25zdCBsbyA9IChtWzFdID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCBoaSA9IChtWzJdID8/IFwiXCIpLnRyaW0oKTtcbiAgICBmb3IgKGNvbnN0IFtzaWRlLCBzaWRlVmFsXSBvZiBbXG4gICAgICBbXCJsb3dcIiwgbG9dLFxuICAgICAgW1wiaGlnaFwiLCBoaV0sXG4gICAgXSBhcyBjb25zdCkge1xuICAgICAgaWYgKCFzaWRlVmFsIHx8IHNpZGVWYWwgPT09IFwiXHU3MTIxXCIgfHwgc2lkZVZhbCA9PT0gXCJcdTdBN0FcdTc2N0RcIikgY29udGludWU7XG5cbiAgICAgIC8vIDEuIFBsYWluIGZsb2F0XG4gICAgICBjb25zdCBhc0Zsb2F0ID0gdHJ5UGFyc2VGbG9hdChzaWRlVmFsKTtcbiAgICAgIGlmIChhc0Zsb2F0ICE9PSBudWxsKSB7XG4gICAgICAgIGVudHJ5W3NpZGVdID0gbWFrZVF1YW50aXR5KGFzRmxvYXQsIHVuaXQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gMi4gRGFzaCByYW5nZSBcdTIwMTQgbWVhbmluZ2Z1bCBvbmx5IGZvciBgbG93YCBzbG90OyBzcGxpdHMgaW50byBsb3craGlnaC5cbiAgICAgIGNvbnN0IGRtID0gc2lkZVZhbC5tYXRjaChSUl9EQVNIX1JBTkdFKTtcbiAgICAgIGlmIChkbSAmJiBzaWRlID09PSBcImxvd1wiICYmIGVudHJ5LmhpZ2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCB2MSA9IHRyeVBhcnNlRmxvYXQoZG1bMV0hKTtcbiAgICAgICAgY29uc3QgdjIgPSB0cnlQYXJzZUZsb2F0KGRtWzJdISk7XG4gICAgICAgIGlmICh2MSAhPT0gbnVsbCAmJiB2MiAhPT0gbnVsbCkge1xuICAgICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2MSwgdW5pdCk7XG4gICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2MiwgdW5pdCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gMy4gQ29tcGFyYXRvciAoXHUyMjY3NjAsIDw9MC4wNCBldGMuKVxuICAgICAgY29uc3QgY20gPSBzaWRlVmFsLm1hdGNoKFJSX0NPTVBBUkFUT1IpO1xuICAgICAgaWYgKGNtKSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGNtWzJdISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3Qgb3AgPSBjbVsxXTtcbiAgICAgICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gNC4gXCJOb3JtYWwgKCBYIClcIiAvIFwiTm9ucmVhY3RpdmUgKCBYIClcIiBcdTIwMTQgWCBpcyB0aGUgY3V0b2ZmIChoaWdoIGJvdW5kKS5cbiAgICAgIGNvbnN0IHFtID0gc2lkZVZhbC5tYXRjaChSUl9RVUFMSVRBVElWRV9QQVJFTik7XG4gICAgICBpZiAocW0pIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQocW1bMl0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIGNvbnN0IGRhc2hNYXRjaCA9IHMubWF0Y2goUlJfREFTSF9SQU5HRSk7XG4gIGlmIChkYXNoTWF0Y2gpIHtcbiAgICBjb25zdCB2MSA9IHRyeVBhcnNlRmxvYXQoZGFzaE1hdGNoWzFdISk7XG4gICAgY29uc3QgdjIgPSB0cnlQYXJzZUZsb2F0KGRhc2hNYXRjaFsyXSEpO1xuICAgIGlmICh2MSAhPT0gbnVsbCAmJiB2MiAhPT0gbnVsbCkge1xuICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYxLCB1bml0KTtcbiAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodjIsIHVuaXQpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBjb25zdCBjbXBNYXRjaCA9IHMubWF0Y2goUlJfQ09NUEFSQVRPUik7XG4gIGlmIChjbXBNYXRjaCkge1xuICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGNtcE1hdGNoWzJdISk7XG4gICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG9wID0gY21wTWF0Y2hbMV07XG4gICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgLy8gRmFsbCB0aHJvdWdoOiBxdWFsaXRhdGl2ZSBvciBjb21wbGV4IFx1MjAxNCB0ZXh0LW9ubHkgaXMgRkhJUi1jb3JyZWN0LlxuICByZXR1cm4gZW50cnk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCB0cnlQYXJzZVF1YW50aXR5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIFBhcnNlIFwiPiA0MC4wXCIgLyBcIjwwLjAxMFwiIC8gXCIxLDIzNC41XCIgXHUyMTkyIEZISVIgUXVhbnRpdHkgd2l0aCBjb21wYXJhdG9yLlxuICogUmV0dXJucyBudWxsIHdoZW4gdGhlIHJlc2lkdWFsIGFmdGVyIHN0cmlwcGluZyBhIGNvbXBhcmF0b3Igc3RpbGxcbiAqIGlzbid0IG51bWVyaWMgXHUyMDE0IGNhbGxlciBmYWxscyBiYWNrIHRvIHZhbHVlU3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJ5UGFyc2VRdWFudGl0eShcbiAgcmF3VmFsdWU6IHN0cmluZyB8IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHVuaXQ6IHN0cmluZyxcbik6IFF1YW50aXR5IHwgbnVsbCB7XG4gIGlmIChyYXdWYWx1ZSA9PT0gbnVsbCB8fCByYXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoU3RyaW5nKHJhd1ZhbHVlKS50cmltKCkpO1xuICBsZXQgY29tcGFyYXRvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGNtID0gcy5tYXRjaChDT01QQVJBVE9SX1JFKTtcbiAgaWYgKGNtKSB7XG4gICAgY29tcGFyYXRvciA9IGNtWzFdID8/IG51bGw7XG4gICAgcyA9IChjbVsyXSA/PyBcIlwiKS50cmltKCk7XG4gIH1cbiAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQocy5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgaWYgKHYgPT09IG51bGwpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHVjdW1Db2RlID0gdG9VY3VtKHVuaXQpO1xuICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgIHZhbHVlOiB2LFxuICAgIHN5c3RlbTogVUNVTV9TWVNURU0sXG4gIH07XG4gIC8vIFF1YW50aXR5LnVuaXQgKGh1bWFuLXJlYWRhYmxlKSBrZWVwcyB0aGUgb3JpZ2luYWwgTkhJIGxhYmVsIHNvIHVzZXJzXG4gIC8vIHN0aWxsIHNlZSAnXHVGRjA1JyBvciAnbUVxL0wnIHJhdy4gUXVhbnRpdHkuY29kZSBpcyBzdHJpY3QgVUNVTSBtYWNoaW5lXG4gIC8vIGNvZGUuIERyb3AgdW5pdCBkaXNwbGF5IHdoZW4gZW1wdHkgc28gd2UgZG9uJ3QgZW1pdCBcInVuaXRcIjogXCJcIi5cbiAgaWYgKHVuaXQpIHtcbiAgICBxdHkudW5pdCA9IHVuaXQ7XG4gIH1cbiAgaWYgKHVjdW1Db2RlICE9PSBudWxsKSB7XG4gICAgcXR5LmNvZGUgPSB1Y3VtQ29kZTtcbiAgfVxuICBpZiAoY29tcGFyYXRvcikge1xuICAgIHF0eS5jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgfVxuICByZXR1cm4gcXR5O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuIiwgIi8qKlxuICogT2JzZXJ2YXRpb24gbWFwcGVyIFx1MjAxNCBzaW5nbGUtcm93IGFuZCBwYW5lbC1ncm91cGVkIHZhcmlhbnRzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9vYnNlcnZhdGlvbi5weWAgKDEyMTIgbGluZXMpLiBJbmNsdWRlczpcbiAqICAgLSBtYXBPYnNlcnZhdGlvbihyYXcsIHBhdGllbnRJZCkgXHUyMTkyIHNpbmdsZSBPYnNlcnZhdGlvblxuICogICAtIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQoaXRlbXMsIHBhdGllbnRJZCkgXHUyMTkyIERpYWdub3N0aWNSZXBvcnQgKyBPYnNlcnZhdGlvbnNcbiAqICAgLSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgXHUyMDE0IGNyb3NzLXBhZ2UgZGVkdXAga2V5XG4gKiAgIC0gZmluZExvaW5jLCBidWlsZENvZGluZ3MsIG1hcEludGVycHJldGF0aW9uLCBkZXJpdmVJbnRlcnByZXRhdGlvblxuICogICAtIGRlZHVwZUNyb3NzRm9ybWF0LCBjb21iaW5lQnBJdGVtcywgZ3JvdXBCeU9yZGVyQ29kZVxuICogICAtIGluZmVyU3BlY2ltZW5cbiAqXG4gKiBGdW5jdGlvbmFsIHBhcml0eSB3aXRoIHRoZSBQeXRob24gaW1wbGVtZW50YXRpb24gaXMgdGhlIGdvYWwuIEZpZWxkXG4gKiBvcmRlciBpbiB0aGUgZW1pdHRlZCByZXNvdXJjZXMgbWF5IGRpZmZlciAoSlMgb2JqZWN0IGxpdGVyYWwgb3JkZXIpXG4gKiBidXQgY29udGVudCBpcyBpZGVudGljYWwuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB7XG4gIERJU1BMQVlfRklSU1RfQ09ERVMsXG4gIExPSU5DX0RJU1BMQVksXG4gIExPSU5DX01BUCxcbiAgTkhJX1RPX0xPSU5DLFxuICBQQU5FTF9MT0lOQ19NQVAsXG59IGZyb20gXCIuL2xvaW5jLXRhYmxlc1wiO1xuaW1wb3J0IHtcbiAgdHlwZSBRdWFudGl0eSxcbiAgdHlwZSBSYW5nZUVudHJ5LFxuICBwYXJzZVJhbmdlLFxuICBwYXJzZVJhbmdlTXVsdGksXG4gIHRvVWN1bSxcbiAgdHJ5UGFyc2VRdWFudGl0eSxcbn0gZnJvbSBcIi4vcGFyc2Vyc1wiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW1hZ2luZyBkZXRlY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElNQUdJTkdfS0VZV09SRFM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgXCJ1bHRyYXNvdW5kXCIsXG4gIFwic29ub2dyYW1cIixcbiAgXCJzb25vZ3JhcGh5XCIsXG4gIFwiZWNob1wiLFxuICBcImN0IFwiLFxuICBcImN0L1wiLFxuICBcImN0LVwiLFxuICBcImNvbXB1dGVkIHRvbW9ncmFwaHlcIixcbiAgXCJtcmlcIixcbiAgXCJtYWduZXRpYyByZXNvbmFuY2VcIixcbiAgXCJ4LXJheVwiLFxuICBcInhyYXlcIixcbiAgXCJ4IHJheVwiLFxuICBcIm1hbW1vZ3JhcGh5XCIsXG4gIFwibWFtbW9cIixcbiAgXCJla2dcIixcbiAgXCJlY2dcIixcbiAgXCJlbGVjdHJvY2FyZGlvZ3JhbVwiLFxuICBcImVuZG9zY29wXCIsXG4gIFwiY29sb25vc2NvcFwiLFxuICBcImdhc3Ryb3Njb3BcIixcbiAgXCJicm9uY2hvc2NvcFwiLFxuICBcInBldC9jdFwiLFxuICBcInBldCBcIixcbiAgXCJzcGVjdFwiLFxuICBcIlx1NUY3MVx1NTBDRlwiLFxuICBcIlx1OEQ4NVx1OTdGM1x1NkNFMlwiLFxuICBcIlx1OTZGQlx1ODE2Nlx1NjVCN1x1NUM2NFwiLFxuICBcIlx1NjgzOFx1NzhDMVx1NTE3MVx1NjMyRlwiLFxuICBcIlx1NUZDM1x1OTZGQlx1NTcxNlwiLFxuICBcIlx1NTE2N1x1ODk5Nlx1OTNFMVwiLFxuICBcIlx1NEU3M1x1NjIzRlx1NjUxRFx1NUY3MVwiLFxuXTtcblxuZnVuY3Rpb24gbG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5OiBzdHJpbmcsIGNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBoYXlzdGFjayA9IGAke2Rpc3BsYXl9ICR7Y29kZX1gLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBJTUFHSU5HX0tFWVdPUkRTLnNvbWUoKGt3KSA9PiBoYXlzdGFjay5pbmNsdWRlcyhrdykpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTE9JTkMgbG9va3VwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBOSElfTEFCX0NPREVfUkUgPSAvXlxcZHs0LDZ9W0EtWl0kLztcblxuZnVuY3Rpb24gaXNBc2NpaU9ubHkoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgPiAxMjcpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuXG4vLyBDaGVjayB3aGV0aGVyIGEgc2luZ2xlIExPSU5DX01BUCBrZXkgbWF0Y2hlcyB0aGUgbGFiJ3MgY29tYmluZWRcbi8vIChjb2RlICsgZGlzcGxheSkgc3RyaW5nLiBUd28gcnVsZXM6XG4vL1xuLy8gMS4gQVNDSUkga2V5czogYFxcYjxrZXk+XFxiYCBcdTIwMTQgd29yZCBib3VuZGFyaWVzIG9uIEJPVEggc2lkZXMuIFRoZVxuLy8gICAgbm8tdHJhaWxpbmctYm91bmRhcnkgc2VtYW50aWMgb2YgdGhlIG9sZGVyIGBcXGI8a2V5PmAgbWF0Y2hlclxuLy8gICAgY2F1c2VkIHNob3J0IGtleXMgbGlrZSBcImhiXCIgKEhlbW9nbG9iaW4pIHRvIGluY29ycmVjdGx5IG1hdGNoXG4vLyAgICBsb25nZXIgdGVybXMgbGlrZSBcImhic2FnXCIgKEhCc0FnKSBhbmQgXCJwaG9zcGhhdGVcIiAobWF0Y2hlZCBieVxuLy8gICAgXCJwaFwiKS4gUmVxdWlyaW5nIGFuIGVuZCBib3VuZGFyeSBtZWFucyBcImhiXCIgb25seSBtYXRjaGVzIHdoZW5cbi8vICAgIGl0IHN0YW5kcyBhcyBpdHMgb3duIHdvcmQuXG4vL1xuLy8gMi4gQ0pLIC8gbm9uLUFTQ0lJIGtleXM6IHBsYWluIHN1YnN0cmluZyBpbmNsdWRlcygpLiBcXGIgZG9lc24ndFxuLy8gICAgc2VtYW50aWNhbGx5IHdvcmsgZm9yIENKSyAobm8gd29yZC1jaGFyYWN0ZXIgY2xhc3MgY29uY2VwdCkuXG5mdW5jdGlvbiBfa2V5d29yZE1hdGNoZXMoa2V5OiBzdHJpbmcsIGNvbWJpbmVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgayA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoayl9XFxcXGJgKS50ZXN0KGNvbWJpbmVkKTtcbiAgfVxuICByZXR1cm4gY29tYmluZWQuaW5jbHVkZXMoayk7XG59XG5cbi8vIFBpY2sgdGhlIExPTkdFU1QgbWF0Y2hpbmcga2V5IGZyb20gdGhlIHRhYmxlLCBub3QgdGhlIGZpcnN0LiBBdm9pZHNcbi8vIHRoZSBzYW1lIGJ1ZyBmYW1pbHkgZnJvbSBhIHNlY29uZCBhbmdsZTogaHlwaGVuYXRlZCBrZXlzIGxpa2Vcbi8vIFwibGRsLWNob2xlc3Rlcm9sXCIgc2hhcmUgYSBgXFxiLi4uXFxiYCBib3VuZGFyeSBhdCB0aGUgaHlwaGVuLCBzbyBcImxkbFwiXG4vLyAoMyBjaGFycykgYWxzbyBtYXRjaGVzIGEgXCJsZGwtY2hvbGVzdGVyb2xcIiBzdHJpbmcuIExvbmdlc3QtbWF0Y2hcbi8vIG1ha2VzIHRoZSBtb3JlIHNwZWNpZmljIGtleSB3aW4gcmVnYXJkbGVzcyBvZiBpbnNlcnRpb24gb3JkZXIsIHNvXG4vLyB0aGUgYnJpdHRsZSBcImxvbmcgbXVzdCBhcHBlYXIgYmVmb3JlIHNob3J0XCIgY29tbWVudHMgc2NhdHRlcmVkXG4vLyB0aHJvdWdoIExPSU5DX01BUCBiZWNvbWUgdW5uZWNlc3NhcnkuXG5mdW5jdGlvbiBfZmluZExvbmdlc3RNYXRjaChcbiAgY29tYmluZWQ6IHN0cmluZyxcbiAgdGFibGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgbGV0IGJlc3RMb2luYzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBiZXN0S2V5TGVuID0gMDtcbiAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXModGFibGUpKSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiBiZXN0S2V5TGVuICYmIF9rZXl3b3JkTWF0Y2hlcyhrZXksIGNvbWJpbmVkKSkge1xuICAgICAgYmVzdExvaW5jID0gbG9pbmM7XG4gICAgICBiZXN0S2V5TGVuID0ga2V5Lmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJlc3RMb2luYztcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJpbWFyeSBMT0lOQyBmb3IgdGhpcyBsYWIuIFBhbmVsLWF3YXJlIGxvb2t1cDpcbiAqICAgQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgXHUyMTkyIHVzZSBOSElfVE9fTE9JTkMgZGlyZWN0bHkuXG4gKiAgIEIuIFBhbmVsIGNvZGUgT1IgdW5rbm93biBjb2RlIFx1MjE5MiB3YWxrIExPSU5DX01BUCBieSBkaXNwbGF5IGtleXdvcmRcbiAqICAgICAgKGxvbmdlc3Qta2V5IG1hdGNoIHdpbnMsIGJvdGgtc2lkZSB3b3JkIGJvdW5kYXJpZXMgZW5mb3JjZWQpLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGNvbnN0IGhpdCA9IF9maW5kTG9uZ2VzdE1hdGNoKGNvbWJpbmVkLCBQQU5FTF9MT0lOQ19NQVBbY29kZV0hKTtcbiAgICBpZiAoaGl0KSByZXR1cm4gaGl0O1xuICB9XG5cbiAgLy8gQi4gRGlzcGxheS1rZXl3b3JkIHNlYXJjaC5cbiAgY29uc3QgaGl0ID0gX2ZpbmRMb25nZXN0TWF0Y2goY29tYmluZWQsIExPSU5DX01BUCk7XG4gIGlmIChoaXQpIHJldHVybiBoaXQ7XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIC8vIFNvdXJjZS1wcm9ncmFtbWUgdGFnIFx1MjAxNCBzZXQgd2hlbiB0aGUgYWRhcHRlciBwdWxsZWQgdGhpcyBvYnNlcnZhdGlvblxuICAvLyBvdXQgb2YgYSBzcGVjaWZpYyBOSEkgc2NyZWVuaW5nIHByb2dyYW1tZSAoZS5nLiBhZGFwdEFkdWx0UHJldmVudGl2ZVxuICAvLyBzZXRzIHNvdXJjZV9wcm9ncmFtPVwiYWR1bHQtcHJldmVudGl2ZVwiKS4gU3VyZmFjZWQgdmlhIE9ic2VydmF0aW9uLlxuICAvLyBtZXRhLnRhZyBzbyBkb3duc3RyZWFtIFNNQVJUIGFwcHMgY2FuIGZpbHRlciBieSBfdGFnIHdpdGhvdXQgbmVlZGluZ1xuICAvLyB0byBrbm93IGFib3V0IG91ciBpbnRlcm5hbCBmaWVsZCBuYW1lcy5cbiAgaWYgKHJhdy5zb3VyY2VfcHJvZ3JhbSkge1xuICAgIHJlc291cmNlLm1ldGEudGFnID0gW1xuICAgICAge1xuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL25oaS1maGlyLWJyaWRnZS9zb3VyY2UtcHJvZ3JhbVwiLFxuICAgICAgICBjb2RlOiBTdHJpbmcocmF3LnNvdXJjZV9wcm9ncmFtKSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvKipcbiAqIFByb2NlZHVyZSBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL3Byb2NlZHVyZS5weWAuIFJldHVybnMgbnVsbCBmb3IgbGlzdC1wYWdlXG4gKiByb3dzIGxhY2tpbmcgbm90ZS9ib2R5X3NpdGUgXHUyMDE0IHRoZSBhbHRlcm5hdGl2ZSBpcyB0aGUgU01BUlQgYXBwIHNob3dpbmdcbiAqIDI1IFwicHJvY2VkdXJlc1wiIGNhbGxlZCBcIk15Y29iYWN0ZXJpYSBjdWx0dXJlXCIgLyBcIlZhZ2luYWwgdWx0cmFzb3VuZFwiXG4gKiAvIGV0Yy4gd2hpY2ggYXJlIGNsaW5pY2FsbHkgd3JvbmcuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZFwiKSkgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX1BDUztcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUHJvY2VkdXJlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBub3RlID0gKChyYXcubm90ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgY29uc3QgYm9keVNpdGUgPSAoKHJhdy5ib2R5X3NpdGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghbm90ZSAmJiAhYm9keVNpdGUpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUHJvY2VkdXJlXCI7XG4gIC8vIHYwLjguMCBiaWxpbmd1YWw6IHByZWZlciBcdTdFNDFcdTRFMkQgaW4gY29kZS50ZXh0IChwYXRpZW50LWZhY2luZykgd2hpbGVcbiAgLy8gY29kaW5nWzBdLmRpc3BsYXkgc3RheXMgYXMgdGhlIHRlY2huaWNhbCBFbmdsaXNoIChjYW5vbmljYWwgZm9yIHRoZVxuICAvLyBQQ1MgLyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHN5c3RlbSkuIEZhbGxzIGJhY2sgdG8gRW5nbGlzaCB3aGVuIE5ISSBzaGlwc1xuICAvLyBFbmdsaXNoLW9ubHkgZm9yIGEgcGFydGljdWxhciBwcm9jZWR1cmUgY29kZS5cbiAgY29uc3QgZGlzcGxheVpoID0gKChyYXcuZGlzcGxheV96aCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKSB8fCBkaXNwbGF5O1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJQcm9jZWR1cmVcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJjb21wbGV0ZWRcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5WmgsXG4gICAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZWREYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKGJvZHlTaXRlKSB7XG4gICAgcmVzb3VyY2UuYm9keVNpdGUgPSBbeyB0ZXh0OiBib2R5U2l0ZSB9XTtcbiAgfVxuICBpZiAobm90ZSkge1xuICAgIHJlc291cmNlLm5vdGUgPSBbeyB0ZXh0OiBub3RlIH1dO1xuICB9XG5cbiAgLy8gcGVyZm9ybWVyLmFjdG9yIFx1MjAxNCBkaXNwbGF5LW9ubHkgUmVmZXJlbmNlIChubyBQcmFjdGl0aW9uZXIgLyBPcmdhbml6YXRpb25cbiAgLy8gcmVzb3VyY2UgbWludGVkKS4gTWlycm9ycyB0aGUgc2FtZSBzaGFwZSBhcyBEaWFnbm9zdGljUmVwb3J0LnBlcmZvcm1lclxuICAvLyBhbmQgTWVkaWNhdGlvblJlcXVlc3QucmVxdWVzdGVyLiBJbXBvcnRhbnQgZm9yIGxpbmsudHM6IHRoZSBlbmNvdW50ZXJcbiAgLy8gbGlua2VyIG1hdGNoZXMgcmVzb3VyY2VzIHRvIEVuY291bnRlcnMgYnkgcGVyZm9ybWVyW10uZGlzcGxheSAoaG9zcGl0YWwpXG4gIC8vICsgZGF0ZSBcdTIwMTQgd2l0aG91dCB0aGlzIGZpZWxkIGEgcHJvY2VkdXJlIGRvbmUgYXQgdGhlIHNhbWUgaG9zcGl0YWwgK1xuICAvLyBkYXkgYXMgYW4gRW5jb3VudGVyIGRvZXNuJ3QgZ2V0IGl0cyBgZW5jb3VudGVyYCByZWZlcmVuY2UgYmFjay1maWxsZWQsXG4gIC8vIHNvIFNNQVJUIGFwcHMgc2hvd2luZyBcInByb2NlZHVyZXMgZ3JvdXBlZCBieSB2aXNpdFwiIHdvdWxkIGxlYXZlIGl0XG4gIC8vIHVuLWdyb3VwZWQuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGFjdG9yOiB7IGRpc3BsYXk6IGhvc3BpdGFsIH0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIG1hcHBlciBkaXNwYXRjaCB0YWJsZXMuXG4gKlxuICogQ29uc3VtZWQgYnkgYmFja2VuZCdzIGAvc3luYy91cGxvYWQtc3RydWN0dXJlZGAgYW5kIHRoZSBleHRlbnNpb24nc1xuICogbG9jYWwtbW9kZSBidW5kbGUgYXNzZW1ibGVyIHNvIGJvdGggcHJvZHVjZSBpZGVudGljYWwgRkhJUiBvdXRwdXQuXG4gKi9cblxuaW1wb3J0IHsgbWFwQWxsZXJneUludG9sZXJhbmNlIH0gZnJvbSBcIi4vYWxsZXJneVwiO1xuaW1wb3J0IHsgbWFwQ29uZGl0aW9uIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBtYXBEaWFnbm9zdGljUmVwb3J0IH0gZnJvbSBcIi4vZGlhZ25vc3RpYy1yZXBvcnRcIjtcbmltcG9ydCB7IG1hcEVuY291bnRlciB9IGZyb20gXCIuL2VuY291bnRlclwiO1xuaW1wb3J0IHsgbWFwSW1tdW5pemF0aW9uIH0gZnJvbSBcIi4vaW1tdW5pemF0aW9uXCI7XG5pbXBvcnQgeyBtYXBNZWRpY2F0aW9uUmVxdWVzdCwgbWFwTWVkaWNhdGlvbnNEZWR1cCB9IGZyb20gXCIuL21lZGljYXRpb25cIjtcbmltcG9ydCB7IG1hcE9ic2VydmF0aW9uLCBtYXBPYnNlcnZhdGlvbnNHcm91cGVkIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb25cIjtcbmltcG9ydCB7IG1hcFByb2NlZHVyZSB9IGZyb20gXCIuL3Byb2NlZHVyZVwiO1xuXG5leHBvcnQgdHlwZSBQZXJSb3dNYXBwZXIgPSAoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pID0+IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsO1xuXG5leHBvcnQgdHlwZSBHcm91cE1hcHBlciA9IChpdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKSA9PiBSZWNvcmQ8c3RyaW5nLCBhbnk+W107XG5cbi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiAocGVyLXJvdyBtYXBwZXIsIEpTT04gbGlzdCBrZXkgaW5zaWRlIExMTSByZXNwb25zZSkuXG4gKiBVc2VkIGJ5IHRoZSBMTE0gZmFsbGJhY2sgcGF0aCBhZnRlciBleHRyYWN0aW9uOyB0aGUgc3RydWN0dXJlZCBwYXRoXG4gKiBhbHNvIGNvbnN1bHRzIGl0IGZvciBwZXItcm93IHJlc291cmNlIHR5cGVzLlxuICovXG5leHBvcnQgY29uc3QgTElTVF9IQU5ETEVSUzogUmVjb3JkPHN0cmluZywgW1BlclJvd01hcHBlciwgc3RyaW5nXT4gPSB7XG4gIG9ic2VydmF0aW9uczogW21hcE9ic2VydmF0aW9uLCBcIm9ic2VydmF0aW9uc1wiXSxcbiAgbWVkaWNhdGlvbnM6IFttYXBNZWRpY2F0aW9uUmVxdWVzdCwgXCJtZWRpY2F0aW9uc1wiXSxcbiAgY29uZGl0aW9uczogW21hcENvbmRpdGlvbiwgXCJjb25kaXRpb25zXCJdLFxuICBhbGxlcmdpZXM6IFttYXBBbGxlcmd5SW50b2xlcmFuY2UsIFwiYWxsZXJnaWVzXCJdLFxuICBkaWFnbm9zdGljX3JlcG9ydHM6IFttYXBEaWFnbm9zdGljUmVwb3J0LCBcImRpYWdub3N0aWNfcmVwb3J0c1wiXSxcbiAgcHJvY2VkdXJlczogW21hcFByb2NlZHVyZSwgXCJwcm9jZWR1cmVzXCJdLFxuICBlbmNvdW50ZXJzOiBbbWFwRW5jb3VudGVyLCBcImVuY291bnRlcnNcIl0sXG4gIGltbXVuaXphdGlvbnM6IFttYXBJbW11bml6YXRpb24sIFwiaW1tdW5pemF0aW9uc1wiXSxcbn07XG5cbi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiBncm91cC1hd2FyZSBtYXBwZXIgdGhhdCB0YWtlcyB0aGUgRlVMTCBsaXN0IGF0IG9uY2UuXG4gKiBVc2VkIHdoZW4gY3Jvc3Mtcm93IGdyb3VwaW5nL2RlZHVwIGlzIHJlcXVpcmVkIChOSEkgbGFiIHBhbmVscyxcbiAqIFx1NEUyRFx1ODJGMSBtZWRpY2F0aW9uIFx1OTZEOVx1OEE5RSBkZWR1cCkuXG4gKi9cbmV4cG9ydCBjb25zdCBHUk9VUF9IQU5ETEVSUzogUmVjb3JkPHN0cmluZywgR3JvdXBNYXBwZXI+ID0ge1xuICBvYnNlcnZhdGlvbnM6IG1hcE9ic2VydmF0aW9uc0dyb3VwZWQsXG4gIG1lZGljYXRpb25zOiBtYXBNZWRpY2F0aW9uc0RlZHVwLFxufTtcbiIsICIvKipcbiAqIEVuY291bnRlciBsaW5rZXIgXHUyMDE0IG1hdGNoIHJlc291cmNlcyB0byBFbmNvdW50ZXJzIGJ5IChob3NwaXRhbCwgZGF0ZSkuXG4gKlxuICogUHVyZSBmdW5jdGlvbjogbXV0YXRlcyBgcmVzb3VyY2VzYCBpbiBwbGFjZSB0byBhZGQgYGVuY291bnRlcmBcbiAqIHJlZmVyZW5jZXMgd2hlbiB0aGVyZSdzIGFuIHVuYW1iaWd1b3VzIG1hdGNoIGluIHRoZSBjYW5kaWRhdGVcbiAqIEVuY291bnRlciBsaXN0LiBTYW1lIGxvZ2ljIGFzIHRoZSBiYWNrZW5kJ3MgREItY291cGxlZCB2ZXJzaW9uLFxuICogbGlmdGVkIG91dCBzbyB0aGUgZXh0ZW5zaW9uJ3MgbG9jYWwgbW9kZSBjYW4gY2FsbCBpdCBvbiBhblxuICogaW4tbWVtb3J5IGFycmF5LlxuICovXG5cbmltcG9ydCB7IGRlcml2ZUludGVycHJldGF0aW9uIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb25cIjtcblxuY29uc3QgRU5DT1VOVEVSX0xJTktBQkxFID0gbmV3IFNldChbXG4gIFwiT2JzZXJ2YXRpb25cIixcbiAgXCJNZWRpY2F0aW9uUmVxdWVzdFwiLFxuICBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgXCJQcm9jZWR1cmVcIixcbiAgXCJDb25kaXRpb25cIixcbiAgXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbl0pO1xuXG5mdW5jdGlvbiByZXNvdXJjZURhdGUocjogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImVmZmVjdGl2ZURhdGVUaW1lXCIsXG4gICAgXCJhdXRob3JlZE9uXCIsXG4gICAgXCJwZXJmb3JtZWREYXRlVGltZVwiLFxuICAgIFwib25zZXREYXRlVGltZVwiLFxuICAgIFwicmVjb3JkZWREYXRlXCIsXG4gICAgXCJpc3N1ZWRcIixcbiAgXSkge1xuICAgIGNvbnN0IHYgPSByW2tleV07XG4gICAgaWYgKHYpIHJldHVybiBTdHJpbmcodikuc2xpY2UoMCwgMTApO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IG9mIFtcImVmZmVjdGl2ZVBlcmlvZFwiLCBcInBlcmZvcm1lZFBlcmlvZFwiXSkge1xuICAgIGNvbnN0IHBlcmlvZCA9IHJba2V5XTtcbiAgICBpZiAocGVyaW9kICYmIHR5cGVvZiBwZXJpb2QgPT09IFwib2JqZWN0XCIgJiYgcGVyaW9kLnN0YXJ0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHBlcmlvZC5zdGFydCkuc2xpY2UoMCwgMTApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gXCJcIjtcbn1cblxuZnVuY3Rpb24gcmVzb3VyY2VIb3NwaXRhbChyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgLy8gcGVyZm9ybWVyIHNoYXBlIGRpZmZlcnMgYnkgcmVzb3VyY2UgdHlwZTpcbiAgLy8gICBPYnNlcnZhdGlvbiAvIERpYWdub3N0aWNSZXBvcnQ6IFJlZmVyZW5jZVtdICAgICAgICAgICAgICBcdTIxOTIgcC5kaXNwbGF5XG4gIC8vICAgUHJvY2VkdXJlOiAgICAgICAgICAgICAgICAgICAgICBCYWNrYm9uZUVsZW1lbnRbXSAgICAgICAgXHUyMTkyIHAuYWN0b3IuZGlzcGxheVxuICAvLyBGSElSIFI0IFx1MDBBN1Byb2NlZHVyZS5wZXJmb3JtZXIgaXMgdGhlIG9ubHkgcGxhY2Ugd2UgaGl0IGEgQmFja2JvbmVFbGVtZW50LlxuICBmb3IgKGNvbnN0IHAgb2Ygci5wZXJmb3JtZXIgPz8gW10pIHtcbiAgICBpZiAoIXAgfHwgdHlwZW9mIHAgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGlmICh0eXBlb2YgcC5kaXNwbGF5ID09PSBcInN0cmluZ1wiICYmIHAuZGlzcGxheSkgcmV0dXJuIHAuZGlzcGxheTtcbiAgICBjb25zdCBhY3RvciA9IHAuYWN0b3I7XG4gICAgaWYgKGFjdG9yICYmIHR5cGVvZiBhY3RvciA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgYWN0b3IuZGlzcGxheSA9PT0gXCJzdHJpbmdcIiAmJiBhY3Rvci5kaXNwbGF5KSB7XG4gICAgICByZXR1cm4gYWN0b3IuZGlzcGxheTtcbiAgICB9XG4gIH1cbiAgY29uc3QgcmVxID0gci5yZXF1ZXN0ZXIgPz8ge307XG4gIGlmIChyZXEgJiYgdHlwZW9mIHJlcSA9PT0gXCJvYmplY3RcIiAmJiByZXEuZGlzcGxheSkgcmV0dXJuIHJlcS5kaXNwbGF5O1xuICByZXR1cm4gXCJcIjtcbn1cblxuLyoqXG4gKiBEcm9wIEFNQiBFbmNvdW50ZXJzIHdob3NlIChob3NwaXRhbCwgc3RhcnRfZGF0ZSkgaXMgYWxyZWFkeSBjb3ZlcmVkXG4gKiBieSBhbiBJTVAgRW5jb3VudGVyJ3MgYWRtaXNzaW9uIGRheS4gTkhJIGVtaXRzIHRoZSBzYW1lIGlucGF0aWVudFxuICogc3RheSB0d2ljZSAoSUhLRTMzMDMgQU1CIGJpbGxpbmcgZW50cnkgKyBJSEtFMzMwOSBJTVAgZGV0YWlsKTsgdGhlXG4gKiBJTVAgb25lIGlzIGNhbm9uaWNhbCwgdGhlIEFNQiBpcyBhIGJpbGxpbmcgYXJ0ZWZhY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cEFkbWlzc2lvbkRheUFtYihcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBpbXBTdGFydHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgaWYgKChyLmNsYXNzID8/IHt9KS5jb2RlICE9PSBcIklNUFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKHIucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgaWYgKGhvc3AgJiYgc3RhcnQpIGltcFN0YXJ0cy5hZGQoYCR7aG9zcH0gJHtzdGFydH1gKTtcbiAgfVxuICBpZiAoaW1wU3RhcnRzLnNpemUgPT09IDApIHJldHVybiByZXNvdXJjZXM7XG4gIHJldHVybiByZXNvdXJjZXMuZmlsdGVyKChyKSA9PiB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlID09PSBcIkVuY291bnRlclwiICYmIChyLmNsYXNzID8/IHt9KS5jb2RlID09PSBcIkFNQlwiKSB7XG4gICAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICAgIGlmIChpbXBTdGFydHMuaGFzKGAke2hvc3B9ICR7c3RhcnR9YCkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFkZCBgZW5jb3VudGVyYCByZWZlcmVuY2UgdG8gZWFjaCBsaW5rYWJsZSByZXNvdXJjZSB3aGVuIGl0c1xuICogKGhvc3BpdGFsLCBkYXRlKSBtYXRjaGVzIGV4YWN0bHkgT05FIEVuY291bnRlciBpbiBgY2FuZGlkYXRlc2AuXG4gKiBDb25zZXJ2YXRpdmUgXHUyMDE0IGxlYXZlcyBhbWJpZ3VvdXMgKDAgb3IgPjEgbWF0Y2gpIGNhc2VzIHVubGlua2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlua0VuY291bnRlcnNJblJlc291cmNlcyhcbiAgY2FuZGlkYXRlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoY2FuZGlkYXRlcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgY29uc3QgZXhhY3RJbmRleCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgY29uc3QgaW1wQnlIb3NwID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4+KCk7XG5cbiAgZm9yIChjb25zdCBlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICBpZiAoZS5yZXNvdXJjZVR5cGUgIT09IFwiRW5jb3VudGVyXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoZS5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoIWhvc3AgfHwgIXN0YXJ0KSBjb250aW51ZTtcbiAgICBjb25zdCBrZXkgPSBgJHtob3NwfSAke3N0YXJ0fWA7XG4gICAgY29uc3QgYXJyID0gZXhhY3RJbmRleC5nZXQoa2V5KSA/PyBbXTtcbiAgICBhcnIucHVzaChlLmlkKTtcbiAgICBleGFjdEluZGV4LnNldChrZXksIGFycik7XG4gICAgY29uc3QgY2xzID0gKGUuY2xhc3MgPz8ge30pLmNvZGUgPz8gXCJcIjtcbiAgICBpZiAoY2xzID09PSBcIklNUFwiKSB7XG4gICAgICBjb25zdCBlbmQgPSBTdHJpbmcoKGUucGVyaW9kID8/IHt9KS5lbmQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGVuZCkge1xuICAgICAgICBjb25zdCBsaXN0ID0gaW1wQnlIb3NwLmdldChob3NwKSA/PyBbXTtcbiAgICAgICAgbGlzdC5wdXNoKFtzdGFydCwgZW5kLCBlLmlkXSk7XG4gICAgICAgIGltcEJ5SG9zcC5zZXQoaG9zcCwgbGlzdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGV4YWN0SW5kZXguc2l6ZSA9PT0gMCAmJiBpbXBCeUhvc3Auc2l6ZSA9PT0gMCkgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoIUVOQ09VTlRFUl9MSU5LQUJMRS5oYXMoci5yZXNvdXJjZVR5cGUpKSBjb250aW51ZTtcbiAgICBpZiAoci5lbmNvdW50ZXIgfHwgci5jb250ZXh0KSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gcmVzb3VyY2VIb3NwaXRhbChyKTtcbiAgICBjb25zdCBkYXRlID0gcmVzb3VyY2VEYXRlKHIpO1xuICAgIGlmICghaG9zcCB8fCAhZGF0ZSkgY29udGludWU7XG4gICAgY29uc3QgbWF0Y2hlczogc3RyaW5nW10gPSBbLi4uKGV4YWN0SW5kZXguZ2V0KGAke2hvc3B9ICR7ZGF0ZX1gKSA/PyBbXSldO1xuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChjb25zdCBbc3RhcnQsIGVuZCwgZWlkXSBvZiBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdKSB7XG4gICAgICAgIGlmIChzdGFydCA8PSBkYXRlICYmIGRhdGUgPD0gZW5kKSBtYXRjaGVzLnB1c2goZWlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoICE9PSAxKSBjb250aW51ZTtcbiAgICByLmVuY291bnRlciA9IHsgcmVmZXJlbmNlOiBgRW5jb3VudGVyLyR7bWF0Y2hlc1swXX1gIH07XG4gIH1cbn1cblxuLyoqXG4gKiBXaGVuIGFuIE9ic2VydmF0aW9uIGNhcnJpZXMgbXVsdGlwbGUgcmVmZXJlbmNlUmFuZ2UgZW50cmllcyB0YWdnZWRcbiAqIHdpdGggYGFwcGxpZXNUb1sqXS5jb2RpbmcuY29kZWAgaW4ge21hbGUsIGZlbWFsZX0sIHBpY2sgdGhlIG9uZSB0aGF0XG4gKiBtYXRjaGVzIHRoZSBwYXRpZW50J3MgZ2VuZGVyIGFuZCByZS1kZXJpdmUgaW50ZXJwcmV0YXRpb24gYWdhaW5zdCBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzKFxuICBwYXRpZW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCxcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiB2b2lkIHtcbiAgaWYgKCFwYXRpZW50KSByZXR1cm47XG4gIGNvbnN0IGdlbmRlciA9IFN0cmluZyhwYXRpZW50LmdlbmRlciA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoZ2VuZGVyICE9PSBcIm1hbGVcIiAmJiBnZW5kZXIgIT09IFwiZmVtYWxlXCIpIHJldHVybjtcblxuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIk9ic2VydmF0aW9uXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHJyczogYW55W10gPSByLnJlZmVyZW5jZVJhbmdlID8/IFtdO1xuICAgIGlmIChycnMubGVuZ3RoIDwgMikgY29udGludWU7XG5cbiAgICBsZXQgbWF0Y2g6IGFueSA9IG51bGw7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBycnMpIHtcbiAgICAgIGZvciAoY29uc3QgYXAgb2YgZW50cnkuYXBwbGllc1RvID8/IFtdKSB7XG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBhcC5jb2RpbmcgPz8gW10pIHtcbiAgICAgICAgICBpZiAoU3RyaW5nKGMuY29kZSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpID09PSBnZW5kZXIpIHtcbiAgICAgICAgICAgIG1hdGNoID0gZW50cnk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaCkgYnJlYWs7XG4gICAgfVxuICAgIGlmICghbWF0Y2gpIGNvbnRpbnVlO1xuXG4gICAgci5yZWZlcmVuY2VSYW5nZSA9IFttYXRjaF07XG4gICAgY29uc3QgdmFsU3RyID1cbiAgICAgIFN0cmluZygoci52YWx1ZVF1YW50aXR5ID8/IHt9KS52YWx1ZSA/PyBcIlwiKSB8fCBTdHJpbmcoci52YWx1ZVN0cmluZyA/PyBcIlwiKTtcbiAgICBjb25zdCBuZXdJbnRlcnAgPSBkZXJpdmVJbnRlcnByZXRhdGlvbih2YWxTdHIsIHIudmFsdWVRdWFudGl0eSA/PyBudWxsLCBtYXRjaCk7XG4gICAgaWYgKG5ld0ludGVycCkge1xuICAgICAgci5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW25ld0ludGVycF0gfV07XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBQYXRpZW50IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcGF0aWVudC5weWAuIFNhbWUgcHVibGljIEFQSTpcbiAqICAgLSBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWUpIFx1MjAxNCBleHBvc2VkIGZvciB0ZXN0c1xuICogICAtIG1hcFBhdGllbnQocmF3KSBcdTIwMTQgbWFpbiBlbnRyeVxuICovXG5cbmltcG9ydCB7IGRlcml2ZVBhdGllbnRJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuXG4vLyBUYWl3YW4gbmF0aW9uYWwgSUQ6IDEgbGV0dGVyICsgOSBkaWdpdHMgKEExMjM0NTY3ODkpLiBVc2VkIHRvIGRlY2lkZVxuLy8gd2hldGhlciB0aGUgcG9wdXAtc3VwcGxpZWQgcGF0aWVudF9pZCBzaG91bGQgYmUgY29kZWQgdW5kZXIgdGhlXG4vLyBjYW5vbmljYWwgbmF0aW9uYWwtaWQgc3lzdGVtIG9yIGFzIGEgbG9jYWwgaG9zcGl0YWwgTVJOLlxuY29uc3QgVFdfTkFUSU9OQUxfSURfUkUgPSAvXltBLVpdWzEyXVxcZHs4fSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9va3NMaWtlVHdOYXRpb25hbElkKHZhbHVlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gIGlmICghdmFsdWUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIFRXX05BVElPTkFMX0lEX1JFLnRlc3QodmFsdWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUGF0aWVudChyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgcmF3SWQgPSBTdHJpbmcocmF3LmlkZW50aWZpZXIgPz8gcmF3LmlkID8/IFwidW5rbm93blwiKTtcbiAgLy8gRkhJUiBQYXRpZW50LmlkIGlzIHRoZSBoYXNoZWQvc2FsdGVkIGZvcm0uIFJlYWwgbmF0aW9uYWwgSUQgc3RheXNcbiAgLy8gb25seSBpbiBpZGVudGlmaWVyW10udmFsdWUgc28gYSBsZWFrZWQgQnVuZGxlIChvciBhIFNNQVJUIGFwcCB0b2tlblxuICAvLyBwYXlsb2FkIGNvbnRhaW5pbmcgcGF0aWVudF9pZCkgZG9lc24ndCBkaXNjbG9zZSBpdCB2aWEgZXZlcnlcbiAgLy8gc3ViamVjdC5yZWZlcmVuY2UuXG4gIGNvbnN0IHBhdGllbnRJZCA9IGRlcml2ZVBhdGllbnRJZChyYXdJZCk7XG5cbiAgLy8gVXNlIGA/P2AgKG5vdCBqdXN0IGRlZmF1bHQgYXJnKSBzbyBleHBsaWNpdCBudWxsIGZyb20gdGhlIExMTSBhbHNvXG4gIC8vIGZhbGxzIGJhY2suIExvY2FsIG1vZGVscyBzb21ldGltZXMgZW1pdCBudWxsIGluc3RlYWQgb2Ygb21pdHRpbmcuXG4gIC8vIFRoZSBjYWxsZXIgZGVjaWRlcyB3aGV0aGVyIGByYXcubmFtZWAgaXMgdGhlIHVzZXIncyByZWFsIG5hbWUgb3JcbiAgLy8gYWxyZWFkeS1tYXNrZWQgXHUyMDE0IG1hcFBhdGllbnQganVzdCB0cmFuc2NyaWJlcy4gTWFza2luZyBwb2xpY3kgbGl2ZXNcbiAgLy8gYXQgdGhlIFVJIC8gZXh0ZW5zaW9uIGxheWVyIChkcml2ZW4gYnkgdGhlIHVzZXItdG9nZ2xlYWJsZVxuICAvLyBgbWFza05hbWVFbmFibGVkYCBzZXR0aW5nKSBzbyB0aGUgc2FtZSBtYXBwZXIgaXMgY29ycmVjdCBmb3IgYm90aFxuICAvLyBcIlx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOCA9IHJlYWwgbmFtZVwiIGFuZCBcIlx1OTFBQlx1NzY0Mlx1NEVCQVx1NTRFMVx1NTkxQVx1NzVDNVx1NEVCQSA9IG1hc2tlZFwiIHdvcmtmbG93cy5cbiAgY29uc3QgbmFtZVRleHQgPSAocmF3Lm5hbWUgPz8gbnVsbCkgfHwgXCJVbmtub3duXCI7XG4gIGNvbnN0IHBob25lID0gKHJhdy5waG9uZSA/PyBudWxsKSB8fCBcIlwiO1xuICBjb25zdCBhZGRyZXNzID0gKHJhdy5hZGRyZXNzID8/IG51bGwpIHx8IFwiXCI7XG5cbiAgY29uc3QgW2ZhbWlseSwgZ2l2ZW5dID0gc3BsaXROYW1lKG5hbWVUZXh0KTtcbiAgY29uc3QgbmFtZUVudHJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyB1c2U6IFwib2ZmaWNpYWxcIiwgdGV4dDogbmFtZVRleHQgfTtcbiAgaWYgKGZhbWlseSkgbmFtZUVudHJ5LmZhbWlseSA9IGZhbWlseTtcbiAgaWYgKGdpdmVuLmxlbmd0aCA+IDApIG5hbWVFbnRyeS5naXZlbiA9IGdpdmVuO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJQYXRpZW50XCIsXG4gICAgaWQ6IHBhdGllbnRJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgaWRlbnRpZmllcjogW1xuICAgICAge1xuICAgICAgICB1c2U6IFwib2ZmaWNpYWxcIixcbiAgICAgICAgc3lzdGVtOiBsb29rc0xpa2VUd05hdGlvbmFsSWQocmF3SWQpXG4gICAgICAgICAgPyBzeXN0ZW1zLlRXX05BVElPTkFMX0lEXG4gICAgICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9QQVRJRU5UX01STixcbiAgICAgICAgdmFsdWU6IHJhd0lkLFxuICAgICAgfSxcbiAgICBdLFxuICAgIG5hbWU6IFtuYW1lRW50cnldLFxuICAgIGdlbmRlcjogbWFwR2VuZGVyKHJhdy5nZW5kZXIpLFxuICB9O1xuXG4gIGNvbnN0IGJpcnRoRGF0ZSA9IHJhdy5iaXJ0aERhdGU7XG4gIGlmIChiaXJ0aERhdGUpIHJlc291cmNlLmJpcnRoRGF0ZSA9IGJpcnRoRGF0ZTtcblxuICBpZiAocGhvbmUpIHtcbiAgICByZXNvdXJjZS50ZWxlY29tID0gW3sgc3lzdGVtOiBcInBob25lXCIsIHVzZTogXCJob21lXCIsIHZhbHVlOiBwaG9uZSB9XTtcbiAgfVxuXG4gIGlmIChhZGRyZXNzKSB7XG4gICAgcmVzb3VyY2UuYWRkcmVzcyA9IFt7IHVzZTogXCJob21lXCIsIHRleHQ6IGFkZHJlc3MgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8qKlxuICogU3BsaXQgYSBmdWxsIG5hbWUgaW50byBbZmFtaWx5LCBbZ2l2ZW5dXSBmb3IgRkhJUiBQYXRpZW50Lm5hbWUuXG4gKlxuICogSGV1cmlzdGljczpcbiAqICAgLSBDb250YWlucyB3aGl0ZXNwYWNlIFx1MjE5MiBXZXN0ZXJuOiBsYXN0IHRva2VuID0gZmFtaWx5LCByZXN0ID0gZ2l2ZW4uXG4gKiAgIC0gQ0pLIC8gc2luZ2xlLXRva2VuIFx1MjE5MiBmaXJzdCBjaGFyID0gZmFtaWx5LCByZW1haW5kZXIgPSBnaXZlbi5cbiAqICAgLSBcIlVua25vd25cIiBvciBlbXB0eSBcdTIxOTIgW1wiXCIsIFtdXVxuICpcbiAqIFR3by1jaGFyIENKSyBmYW1pbHkgbmFtZXMgKFx1NkI1MFx1OTY3RCwgXHU1M0Y4XHU5OUFDLCBcdTIwMjYpIGFyZSBOT1QgYXV0by1kZXRlY3RlZC5cbiAqL1xuZnVuY3Rpb24gc3BsaXROYW1lKGZ1bGxOYW1lOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmdbXV0ge1xuICBjb25zdCBuYW1lID0gKGZ1bGxOYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFuYW1lIHx8IG5hbWUgPT09IFwiVW5rbm93blwiKSByZXR1cm4gW1wiXCIsIFtdXTtcbiAgaWYgKC9cXHMvLnRlc3QobmFtZSkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IG5hbWUuc3BsaXQoL1xccysvKTtcbiAgICByZXR1cm4gW3BhcnRzW3BhcnRzLmxlbmd0aCAtIDFdISwgcGFydHMuc2xpY2UoMCwgLTEpXTtcbiAgfVxuICAvLyBDSksgZmFsbGJhY2sgXHUyMDE0IGl0ZXJhdGUgY29kZXBvaW50cywgbm90IFVURi0xNiBjb2RlIHVuaXRzLCBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIChyYXJlIGluIENoaW5lc2UgbmFtZXMgYnV0IHBvc3NpYmxlKVxuICAvLyBkb24ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY29kZXBvaW50cyA9IEFycmF5LmZyb20obmFtZSk7XG4gIHJldHVybiBjb2RlcG9pbnRzLmxlbmd0aCA+IDEgPyBbY29kZXBvaW50c1swXSEsIFtjb2RlcG9pbnRzLnNsaWNlKDEpLmpvaW4oXCJcIildXSA6IFtuYW1lLCBbXV07XG59XG5cbmZ1bmN0aW9uIG1hcEdlbmRlcihnZW5kZXI6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBnID0gdHlwZW9mIGdlbmRlciA9PT0gXCJzdHJpbmdcIiA/IGdlbmRlci50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKFtcIm1hbGVcIiwgXCJtXCIsIFwiXHU3NTM3XCIsIFwiXHU3NTM3XHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJtYWxlXCI7XG4gIGlmIChbXCJmZW1hbGVcIiwgXCJmXCIsIFwiXHU1OTczXCIsIFwiXHU1OTczXHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJmZW1hbGVcIjtcbiAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuIiwgIi8vIE5ISSBKU09OIFx1MjE5MiBub3JtYWxpemVkIHNoYXBlIGFkYXB0ZXJzLlxuLy9cbi8vIEV4dHJhY3RlZCBmcm9tIGJhY2tncm91bmQuanMgc28gZWFjaCBhZGFwdGVyIGNhbiBiZSB1bml0LXRlc3RlZCBpblxuLy8gaXNvbGF0aW9uLiBiYWNrZ3JvdW5kLmpzIGltcG9ydHMgZXZlcnl0aGluZyBiZWxvdzsgdGhlIGxpdmUgU1cgZ2x1ZXNcbi8vIHRoZXNlIG9udG8gZmV0Y2hlZCBwYXlsb2FkcyB2aWEgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5LlxuLy9cbi8vIFdoeSBleHRyYWN0OiB0aGUgdjAuNi4xIGxhYitpbWFnaW5nIGRhdGUtZmllbGQgYnVncyAoY29tbWl0cyBiMzc4ODVmIC9cbi8vIDhjMTk5MDEpIHNoaXBwZWQgYmVjYXVzZSB0aGVzZSBmdW5jdGlvbnMgaGFkIFpFUk8gdGVzdCBjb3ZlcmFnZSBcdTIwMTRcbi8vIGJhY2tncm91bmQuanMgY2FuJ3QgYmUgbG9hZGVkIGluIGEgdGVzdCBlbnZpcm9ubWVudCAoY2hyb21lLiogQVBJcyxcbi8vIFNXIGdsb2JhbHMpLCBzbyB0aGUgYWRhcHQqIGxvZ2ljIHJvZGUgYWxvbmcgdW50ZXN0ZWQuIFB1bGxpbmcgdGhlbVxuLy8gaW50byBhIHB1cmUtZnVuY3Rpb24gbW9kdWxlIGxldHMgdml0ZXN0IHZlcmlmeSBmaWVsZC1wcmlvcml0eVxuLy8gZGVjaXNpb25zIHJvdy1ieS1yb3cuXG5cbi8vIENvbnZlcnQgTkhJJ3MgXHU2QzExXHU1NzBCIGRhdGUgXCIxMTUvMDUvMDVcIiBcdTIxOTIgSVNPIFwiMjAyNi0wNS0wNVwiLlxuLy8gU29tZSBOSEkgZmllbGRzIGVtYmVkIGJvdGggUk9DIGFuZCBHcmVnb3JpYW46IFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHdlXG4vLyBqdXN0IG1hdGNoIHRoZSBmaXJzdCBzZWdtZW50LlxuZXhwb3J0IGZ1bmN0aW9uIHJvY1RvSVNPKHJvY0RhdGUpIHtcbiAgaWYgKCFyb2NEYXRlKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgbSA9IFN0cmluZyhyb2NEYXRlKS5tYXRjaCgvXihcXGR7MiwzfSlbLy4tXShcXGR7MSwyfSlbLy4tXShcXGR7MSwyfSkvKTtcbiAgaWYgKCFtKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeSA9IHBhcnNlSW50KG1bMV0sIDEwKSArIDE5MTE7XG4gIHJldHVybiBgJHt5fS0ke21bMl0ucGFkU3RhcnQoMiwgXCIwXCIpfS0ke21bM10ucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG59XG5cbi8vIEludmVyc2U6IElTTyBcIjIwMjMtMDUtMDVcIiBcdTIxOTIgUk9DIFwiMTEyLzA1LzA1XCIuIFVzZWQgdG8gYnVpbGQgTkhJIGRhdGUtcmFuZ2Vcbi8vIHF1ZXJ5IHN0cmluZ3MgKHRoZWlyIGZvcm1zIGV4cGVjdCBcdTZDMTFcdTU3MEIgZm9ybWF0KS5cbmV4cG9ydCBmdW5jdGlvbiBpc29Ub1JPQyhpc29EYXRlKSB7XG4gIGlmICghaXNvRGF0ZSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IG0gPSBTdHJpbmcoaXNvRGF0ZSkubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSkvKTtcbiAgaWYgKCFtKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeSA9IHBhcnNlSW50KG1bMV0sIDEwKSAtIDE5MTE7XG4gIGlmICh5IDwgMSkgcmV0dXJuIFwiXCI7IC8vIHByZS1cdTZDMTFcdTU3MEIgZGF0ZXMgbWFrZSBubyBzZW5zZSB0byBOSElcbiAgcmV0dXJuIGAke3l9LyR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LyR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gTkhJIGJpbGluZ3VhbCBmaWVsZHMgdXNlIFwiXHU0RTJEXHU2NTg3fHxFbmdsaXNoXCIgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZhc3Rlcixcbi8vIHNvIHByZWZlciB0aGF0IHNpZGUuIElmIHRoZXJlJ3Mgbm8gYHx8YCB3ZSBqdXN0IHJldHVybiB0aGUgaW5wdXQgdHJpbW1lZC5cbmV4cG9ydCBmdW5jdGlvbiBwaWNrRW5nbGlzaChzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHN0ciA9IFN0cmluZyhzKTtcbiAgY29uc3QgaWR4ID0gc3RyLmluZGV4T2YoXCJ8fFwiKTtcbiAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBzdHIudHJpbSgpO1xuICBjb25zdCBlbiA9IHN0ci5zbGljZShpZHggKyAyKS50cmltKCk7XG4gIHJldHVybiBlbiB8fCBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG59XG5cbi8vIE1pcnJvciBvZiBwaWNrRW5nbGlzaCBcdTIwMTQgZXh0cmFjdCB0aGUgXHU0RTJEXHU2NTg3IGhhbGYgb2YgYSBiaWxpbmd1YWxcbi8vIFwiXHU0RTJEXHU2NTg3fHxFbmdsaXNoXCIgTkhJIGZpZWxkLiBSZXR1cm5zIFwiXCIgd2hlbiBpbnB1dCBpcyBlbXB0eS4gRmFsbHMgYmFja1xuLy8gdG8gdGhlIHdob2xlIHN0cmluZyB3aGVuIG5vIHNlcGFyYXRvciBleGlzdHMgKGRlZmVuc2l2ZTogc29tZSBOSEkgcm93c1xuLy8gc2hpcCBvbmx5IG9uZSBsYW5ndWFnZSkuIFVzZWQgYnkgdGhlIHYwLjguMCBiaWxpbmd1YWwgbWFwcGluZyBzb1xuLy8gRkhJUiBgQ29kZWFibGVDb25jZXB0LnRleHRgIGNhcnJpZXMgdGhlIHBhdGllbnQtZmFjaW5nIFx1N0U0MVx1NEUyRCBmb3JtXG4vLyB3aGlsZSBgY29kaW5nW10uZGlzcGxheWAgc3RheXMgYXMgdGhlIGNsaW5pY2FsL3RlY2huaWNhbCBFbmdsaXNoLlxuZXhwb3J0IGZ1bmN0aW9uIHBpY2tDaGluZXNlKHMpIHtcbiAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc3RyID0gU3RyaW5nKHMpO1xuICBjb25zdCBpZHggPSBzdHIuaW5kZXhPZihcInx8XCIpO1xuICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuIHN0ci50cmltKCk7XG4gIGNvbnN0IHpoID0gc3RyLnNsaWNlKDAsIGlkeCkudHJpbSgpO1xuICByZXR1cm4gemggfHwgc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKTtcbn1cblxuLy8gU3RyaXAgdHJhaWxpbmcgcHVuY3R1YXRpb24gLyB3aGl0ZXNwYWNlIGp1bmsgdGhhdCBzb21lIGhvc3BpdGFscyBsZWF2ZVxuLy8gb24gdGhlaXIgZnJlZS10ZXh0IGxhYiBsYWJlbHMgKGUuZy4gTkhJIHJldHVybnMgXCJDcmVhLFwiIGZyb20gb25lIHNpdGVcbi8vIGFuZCBcIkNyZWFcIiBmcm9tIGFub3RoZXIgZm9yIHRoZSBzYW1lIHBoeXNpY2FsIHRlc3QpLiBQcmUtbm9ybWFsaXppbmdcbi8vIGhlcmUgbWVhbnMgdGhlIE9ic2VydmF0aW9uLmNvZGUudGV4dCBkb3duc3RyZWFtIHJlYWRzIGNsZWFubHkgZXZlblxuLy8gd2hlbiBkb3duc3RyZWFtIFVJcyBzdGlsbCBoYXBwZW4gdG8gcmVuZGVyIGBjb2RlLnRleHRgIGluc3RlYWQgb2Zcbi8vIHB1bGxpbmcgZGlzcGxheSBmcm9tIHRoZSBMT0lOQyAvIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgY29kaW5nLlxuZnVuY3Rpb24gX2NsZWFuTGFiTmFtZShzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIHJldHVybiBTdHJpbmcocylcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1ssXHVGRjBDO1x1RkYxQl0rXFxzKiQvLCBcIlwiKSAgLy8gdHJhaWxpbmcgXHU1MzRBXHU1RjYyIC8gXHU1MTY4XHU1RjYyIHB1bmN0dWF0aW9uXG4gICAgLnRyaW0oKTtcbn1cblxuLy8gQWRhcHRlciBmb3IgTkhJIGxhYi9vYnNlcnZhdGlvbiBKU09OIHNoYXBlIChjb25maXJtZWQgZm9yIElIS0UzNDA5UzAxO1xuLy8gb3RoZXIgbGFiIGVuZHBvaW50cyBsaWtlbHkgdXNlIHRoZSBzYW1lIGZpZWxkcykuXG4vL1xuLy8gRGF0ZSBmaWVsZCBjaG9pY2UgXHUyMDE0IElIS0UzNDA5IHJldHVybnMgdGhyZWUgZGF0ZS1pc2ggZmllbGRzIHBlciByb3c6XG4vLyAgIC0gZnVuQ19EQVRFICAgICAgICAgIFx1NUMzMVx1OEEzQVx1NjVFNSAvIFx1NTE2NVx1OTY2Mlx1NjVFNSAodmlzaXQgcmVnaXN0cmF0aW9uIC8gYWRtaXNzaW9uKVxuLy8gICAtIHJlYUxfSU5TUEVDVF9EQVRFICBcdTVCRTZcdTk2OUJcdTYzQTFcdTZBQTJcdTY1RTUgKGFjdHVhbCBzYW1wbGUtY29sbGVjdGlvbiBkYXRlKVxuLy8gICAtIGFzc2FZX1VQTE9BRF9EQVRFICBcdTRFMEFcdTUwQjNcdTY1RTUgKHdoZW4gdGhlIHJlc3VsdCBoaXQgTkhJJ3Mgc2VydmVyKVxuLy8gRm9yIGFuIGlucGF0aWVudCwgZnVuQ19EQVRFIGlzIHRoZSBhZG1pc3Npb24gZGF5IGFuZCBldmVyeSBsYWIgZHJhd25cbi8vIGR1cmluZyB0aGUgc3RheSBjYXJyaWVzIHRoZSBzYW1lIGZ1bkNfREFURSBcdTIwMTQgdXNpbmcgaXQgYXMgT2JzZXJ2YXRpb24uXG4vLyBlZmZlY3RpdmVEYXRlVGltZSBtYWRlIGFsbCBcdTRGNEZcdTk2NjJcdTY3MUZcdTk1OTMgbGFicyBsb29rIGxpa2UgdGhleSB3ZXJlIGRyYXduXG4vLyBvbiBkYXkgMS4gRkhJUidzIFwicGh5c2lvbG9naWNhbGx5IHJlbGV2YW50IHRpbWVcIiBmb3IgYSBsYWIgT2JzZXJ2YXRpb25cbi8vIGlzIHRoZSBzYW1wbGUtY29sbGVjdGlvbiBkYXRlLCBzbyBwcmVmZXIgcmVhTF9JTlNQRUNUX0RBVEUgd2hlbiBOSElcbi8vIHJldHVybnMgaXQ7IGZhbGwgYmFjayB0byBmdW5DX0RBVEUgb25seSB3aGVuIHRoZSBpbnNwZWN0IGZpZWxkIGlzXG4vLyBtaXNzaW5nIChvbGRlciByb3dzIC8gZW5kcG9pbnRzIHRoYXQgZG9uJ3QgY2FycnkgaXQpLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0TGFiSXRlbShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhcbiAgICBpdGVtLnJlYUxfSU5TUEVDVF9EQVRFIHx8IGl0ZW0ucmVhbF9pbnNwZWN0X2RhdGUgfHwgaXRlbS5mdW5DX0RBVEUsXG4gICk7XG4gIGNvbnN0IHZhbHVlID0gaXRlbS5hc3NhWV9WQUxVRTtcbiAgaWYgKCFkYXRlIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IFwiXCIpIHJldHVybiBudWxsO1xuICAvLyBEaXNwbGF5IG5hbWUgZmFsbGJhY2sgY2hhaW4gKGFsbCBub3JtYWxpemVkIGZvciB0cmFpbGluZyBwdW5jdHVhdGlvbik6XG4gIC8vICAgMS4gYXNzYVlfSVRFTV9OQU1FIFx1MjAxNCBob3NwaXRhbCdzIGZ1bGwgZnJlZS10ZXh0IGxhYmVsXG4gIC8vICAgMi4gb3JkZXJfc2hvcnRuYW1lIFx1MjAxNCBOSEkncyBVSS10cnVuY2F0ZWQgbGFiZWwgKG9mdGVuIGVuZHMgXCIuLi5cIilcbiAgLy8gICAzLiBvcmRlUl9OQU1FICAgICAgXHUyMDE0IE5ISSdzIGNhbm9uaWNhbCBcdTkxQUJcdTRFRTRcdTc4QkMgZGljdGlvbmFyeSBuYW1lXG4gIC8vIGFzc2FZX0lURU1fTkFNRSB3aW5zIGJ5IGRlZmF1bHQgYmVjYXVzZSBvcmRlcl9zaG9ydG5hbWUgY2FuIGJlIGN1dFxuICAvLyBvZmYgbWlkLXdvcmQgKFwiUEMgU3VnYXIgXHU5OEVGXHU1RjhDIC4uLlwiKSwgd2hpY2ggaXMgd29yc2UgdGhhbiBhIHRyYWlsaW5nLVxuICAvLyBjb21tYSBjb3NtZXRpYyBpc3N1ZS4gb3JkZVJfTkFNRSBpcyB0aGUgbGFzdC1yZXNvcnQgQ2hpbmVzZSBmb3JtYWxcbiAgLy8gbGFiZWwuXG4gIGNvbnN0IGZ1bGxOYW1lID0gX2NsZWFuTGFiTmFtZShpdGVtLmFzc2FZX0lURU1fTkFNRSlcbiAgICAgICAgICAgICAgICB8fCBfY2xlYW5MYWJOYW1lKGl0ZW0ub3JkZXJfc2hvcnRuYW1lKVxuICAgICAgICAgICAgICAgIHx8IF9jbGVhbkxhYk5hbWUoaXRlbS5vcmRlUl9OQU1FKTtcbiAgY29uc3Qgb3JkZXJDb2RlID0gU3RyaW5nKGl0ZW0ub3JkZVJfQ09ERSB8fCBcIlwiKS50cmltKCk7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBvcmRlcl9jb2RlOiBvcmRlckNvZGUsXG4gICAgb3JkZXJfbmFtZTogaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCIsXG4gICAgLy8gUHJlZmVyIHRoZSBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIChcIjA5MTQwQ1wiKSBhcyB0aGUgRkhJUiBjb2RpbmcgY29kZSBzbyB0aGVcbiAgICAvLyBkb3duc3RyZWFtIG9ic2VydmF0aW9uIG1hcHBlciByb3V0ZXMgaXQgdW5kZXIgTkhJX01FRElDQUxfT1JERVJfXG4gICAgLy8gQ09ERSBzeXN0ZW0uIFNNQVJUIGFwcHMgZ3JvdXAgbGFiIHRlc3RzIGJ5IGNvZGluZyBjb2RlOyB1c2luZ1xuICAgIC8vIGZyZWUtdGV4dCBoZXJlIGlzIHdoYXQgY2F1c2VzIFwiQ3JlYVwiIGFuZCBcIkNyZWEsXCIgdG8gYmUgc3BsaXRcbiAgICAvLyBpbnRvIHR3byBkaXN0aW5jdCB0ZXN0cy4gRmFsbGJhY2sgdG8gdGhlIGNsZWFuZWQgZGlzcGxheSB3aGVuXG4gICAgLy8gTkhJIGRvZXNuJ3Qgc3VwcGx5IGFuIG9yZGVyIGNvZGUgKG9sZGVyIC8gZWRnZS1jYXNlIHJvd3MpLlxuICAgIGNvZGU6IG9yZGVyQ29kZSB8fCBmdWxsTmFtZSxcbiAgICBkaXNwbGF5OiBmdWxsTmFtZSxcbiAgICB2YWx1ZTogU3RyaW5nKHZhbHVlKSxcbiAgICB1bml0OiBpdGVtLnVuaVRfREFUQSB8fCBcIlwiLFxuICAgIHJlZmVyZW5jZV9yYW5nZTogaXRlbS5jb25zdWxUX1ZBTFVFIHx8IGl0ZW0uc2hvcnRfQ09OU1VMVF9WQUxVRSB8fCBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwNlMwMSByZXR1cm5zIHZpc2l0LWxldmVsIHJvd3MgT05MWSAobm8gZHJ1ZyBuYW1lcykuIFRoZSBhY3R1YWwgZHJ1Z1xuLy8gbGlzdCBsaXZlcyBhdCBJSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD08cm93X0lEPiZjdHlwZT0yLCBpblxuLy8gYGloa2UzMzA2UzAyX21haW5fZGF0YVsqXS5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3RgLiBXZSBkbyB0aGF0IDItc3RlcFxuLy8gZmV0Y2ggc2VwYXJhdGVseTsgdGhpcyBmdW5jdGlvbiBhZGFwdHMgYSBzaW5nbGUgZHJ1ZyBlbnRyeSBnaXZlbiBpdHNcbi8vIHBhcmVudCB2aXNpdCBjb250ZXh0LlxuLy9cbi8vIERhdGUgc2VtYW50aWNzICh2YXJpZXMgYnkgdmlzaXQgdHlwZSBcdTIwMTQgdmlzaWJsZSB2aWEgdmlzaXQub3JpX1RZUEVfTkFNRSk6XG4vLyAgIC0gT1BEIC8gXHU4NUU1XHU1QzQwOiBmdW5jX0RBVEUgaXMgdGhlIG9ubHkgbWVhbmluZ2Z1bCBkYXRlLiBjdXJlX0VfREFURSBpc1xuLy8gICAgIGVtcHR5LiBhdXRob3JlZE9uID0gZnVuY19EQVRFIGlzIGFjY3VyYXRlLlxuLy8gICAtIFx1NEY0Rlx1OTY2MiAoaW5wYXRpZW50KTogTkhJIHJldHVybnMgT05FIHJvdyBwZXIgYWRtaXNzaW9uIHN1bW1hcmlzaW5nXG4vLyAgICAgZXZlcnkgZHJ1ZyB1c2VkIGR1cmluZyB0aGUgc3RheS4gZnVuY19EQVRFID0gYWRtaXNzaW9uIGRheSxcbi8vICAgICBjdXJlX0VfREFURSA9IGRpc2NoYXJnZSBkYXkuIE5ISSBkb2VzIG5vdCBwcmVzZXJ2ZSB0aGUgYWN0dWFsXG4vLyAgICAgYXV0aG9yZWQgZGF0ZSBvZiBlYWNoIGRydWcgXHUyMDE0IGEgUFBJIHN0YXJ0ZWQgb24gc3RheS1kYXkgMyBsb29rc1xuLy8gICAgIGlkZW50aWNhbCB0byBvbmUgcHJlc2NyaWJlZCBvbiBhZG1pc3Npb24gZGF5LlxuLy8gICAgIFdlIHN1cmZhY2UgZnVuY19EQVRFIFx1MjE5MiBhdXRob3JlZE9uIGFzIGEgYmVzdC1lZmZvcnQgYW5jaG9yIGFuZFxuLy8gICAgIEFERElUSU9OQUxMWSBlbWl0IGVuZF9kYXRlIHNvIHRoZSBkb3duc3RyZWFtIG1hcHBlciBjYW4gYXR0YWNoXG4vLyAgICAgZGlzcGVuc2VSZXF1ZXN0LnZhbGlkaXR5UGVyaW9kID0ge3N0YXJ0OiBmdW5jX0RBVEUsIGVuZDogY3VyZV9FX0RBVEV9LlxuLy8gICAgIENvbnN1bWVycyB0aGVuIHNlZSBcInRoaXMgZHJ1ZyB3YXMgdXNlZCBkdXJpbmcgYWRtaXNzaW9uIDUvMTgtNS8yMlwiXG4vLyAgICAgaW5zdGVhZCBvZiBcIjE0IGRydWdzIGFsbCBwcmVzY3JpYmVkIG9uIDUvMThcIi5cbi8vXG4vLyBEcnVnLXJvdyBvcmRlcl9kcnVnX2RheSBub3RlOiBpbnBhdGllbnQgcm93cyBzaGlwIFwiXHVGRjBEXCIgKGVtLWRhc2ggc2VudGluZWxcbi8vIGZvciBcIm5vIGRhdGFcIikgYmVjYXVzZSBOSEkgZG9lc24ndCB0cmFjayBwZXItZHJ1ZyBkYXktc3VwcGx5IGZvclxuLy8gaW5wYXRpZW50cy4gTnVtYmVyKFwiXHVGRjBEXCIpIGlzIE5hTjsgdGhlICFpc0Zpbml0ZSBicmFuY2ggc2VuZHMgaXQgdG8gMCxcbi8vIHdoaWNoIHRoZSBtYXBwZXIgdHJlYXRzIGFzIGZhbHN5IGFuZCBzbyBvbWl0cyBleHBlY3RlZFN1cHBseUR1cmF0aW9uIFx1MjAxNFxuLy8gY29ycmVjdDogYmV0dGVyIHNpbGVudCB0aGFuIGZhYnJpY2F0aW5nIGEgc3VwcGx5IGNvdW50LlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZHJ1ZywgdmlzaXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFkcnVnIHx8IHR5cGVvZiBkcnVnICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgLy8gdmlzaXQuZnVuY19EQVRFIGlzIFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHJvY1RvSVNPIG1hdGNoZXMgdGhlIFJPQ1xuICAvLyBwcmVmaXggY29ycmVjdGx5LlxuICBjb25zdCBkYXRlID0gcm9jVG9JU08odmlzaXQ/LmZ1bmNfREFURSB8fCB2aXNpdD8uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBjb25zdCByYXdEcnVnTmFtZSA9IGRydWcuZHJ1Z19uYW1lIHx8IGRydWcuZHJ1R19OQU1FIHx8IFwiXCI7XG4gIGNvbnN0IGRydWdfbmFtZSA9IHBpY2tFbmdsaXNoKHJhd0RydWdOYW1lKTtcbiAgaWYgKCFkYXRlIHx8ICFkcnVnX25hbWUpIHJldHVybiBudWxsO1xuICAvLyBjdXJlX0VfREFURSBvbmx5IHBvcHVsYXRlZCBmb3IgaW5wYXRpZW50IHN1bW1hcnkgcm93czsgUk9DIGJpbGluZ3VhbFxuICAvLyB3aXRoIGVtcHR5IGhhbHZlcyAoXCJ8fFwiKSBwYXJzZXMgdG8gXCJcIiB3aGljaCB3ZSB3YW50LlxuICBjb25zdCBlbmRfZGF0ZSA9IHJvY1RvSVNPKHZpc2l0Py5jdXJlX0VfREFURSB8fCB2aXNpdD8uY3VyZV9lX2RhdGUgfHwgXCJcIik7XG4gIGNvbnN0IGRheXMgPSBOdW1iZXIoZHJ1Zy5vcmRlcl9kcnVnX2RheSB8fCBkcnVnLm9yZGVyX0RSVUdfREFZIHx8IDApO1xuICAvLyBpc19jaHJvbmljIGZsb3dzIGZyb20gdGhlIGNocm9uaWMtcHJlc2NyaXB0aW9uIGZhbi1vdXRcbiAgLy8gKElIS0UzMzA3UzAxIGxpc3QgXHUyMTkyIElIS0UzMzA2UzAyIGRldGFpbCkuIFdoZW4gdHJ1ZSwgdGhlIG1hcHBlclxuICAvLyBhdHRhY2hlcyBjb3Vyc2VPZlRoZXJhcHlUeXBlPWNvbnRpbnVvdXMuIERlZmF1bHRzIGZhbHNlIHNvIE9QRCAvXG4gIC8vIGlucGF0aWVudCAvIFx1ODVFNVx1NUM0MCBhY3V0ZSBwcmVzY3JpcHRpb25zIHN0YXkgdW5jaGFuZ2VkLlxuICBjb25zdCBpc19jaHJvbmljID0gISEob3B0aW9ucyAmJiBvcHRpb25zLmlzX2Nocm9uaWMpO1xuICAvLyBOSEkgXHU4NUU1XHU1NEMxXHU1N0ZBXHU2NzJDXHU4Q0M3XHU2NTk5XHU1RUFCIHNoaXBzIGJpbGluZ3VhbCBgXHU0RTJEXHU2NTg3fHxFbmdsaXNoYCBvbiB0aHJlZSBmaWVsZHNcbiAgLy8gd2Ugc3VyZmFjZSBcdTIwMTQgZHJ1Z19uYW1lLCBhY3QgKFx1ODVFNVx1NzQwNlx1NTIwNlx1OTg1RSksIGljZDljbV9DT0RFX0NOQU1FLiB2MC44LjBcbiAgLy8ga2VlcHMgYm90aCBoYWx2ZXMgc28gdGhlIG1hcHBlciBjYW4gcHV0IFx1N0U0MVx1NEUyRCBpbnRvIENvZGVhYmxlQ29uY2VwdFxuICAvLyAudGV4dCAocGF0aWVudC1mYWNpbmcpIGFuZCBFbmdsaXNoIGluIGNvZGluZ1swXS5kaXNwbGF5IChjbGluaWNhbFxuICAvLyBjYW5vbmljYWwpLiBkcnVnLmRydWdfbmFtZTIgLyB2aXNpdC5pY2Q5Y21fQ09ERV9DTkFNRTIgYXJlIE5ISSdzXG4gIC8vIG93biBDaGluZXNlLW9ubHkgY29udmVuaWVuY2UgZmllbGRzIFx1MjAxNCBwcmVmZXIgdGhlbSB3aGVuIHByZXNlbnQsXG4gIC8vIGVsc2UgZmFsbCBiYWNrIHRvIHRoZSBDaGluZXNlIGhhbGYgb2YgdGhlIGJpbGluZ3VhbCBmaWVsZC5cbiAgY29uc3QgZHJ1Z19uYW1lX3poID1cbiAgICBkcnVnLmRydWdfbmFtZTIgfHwgZHJ1Zy5kcnVHX05BTUUyIHx8IHBpY2tDaGluZXNlKHJhd0RydWdOYW1lKTtcbiAgY29uc3QgcmF3SW5kaWNhdGlvbiA9IHZpc2l0Py5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2aXNpdD8uaWNkOWNtX25hbWUgfHwgXCJcIjtcbiAgLy8gaWNkOWNtX0NPREVfQ05BTUUgd3JhcHMgZWFjaCBoYWxmIGFzIFwiPGNvZGU+Lzx0ZXh0PlwiIFx1MjAxNCBzdHJpcCB0aGVcbiAgLy8gbGVhZGluZyBcIjxjb2RlPi9cIiBzbyBkb3duc3RyZWFtIGRvZXNuJ3QgZG91YmxlLXByaW50IHRoZSBjb2RlIHdoZW5cbiAgLy8gaXQgY29tcG9zZXMgXCI8Y29kZT4gPHRleHQ+XCIgaXRzZWxmLlxuICBjb25zdCBzdHJpcEljZFByZWZpeCA9IChzKSA9PiBzLnJlcGxhY2UoL15bQS1aMC05Ll0rXFwvXFxzKi8sIFwiXCIpO1xuICBjb25zdCBpbmRpY2F0aW9uID0gc3RyaXBJY2RQcmVmaXgocGlja0VuZ2xpc2gocmF3SW5kaWNhdGlvbikpO1xuICBjb25zdCBpbmRpY2F0aW9uX3poID1cbiAgICB2aXNpdD8uaWNkOWNtX0NPREVfQ05BTUUyIHx8XG4gICAgdmlzaXQ/LmljZDljbV9jb2RlX2NuYW1lMiB8fFxuICAgIHN0cmlwSWNkUHJlZml4KHBpY2tDaGluZXNlKHJhd0luZGljYXRpb24pKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIC8vIE9ubHkgZW1pdCB3aGVuIG1lYW5pbmdmdWxseSBwb3B1bGF0ZWQgQU5EIGRpZmZlcmVudCBmcm9tIHN0YXJ0LlxuICAgIC8vIFN1cHByZXNzaW5nIHRoZSBzYW1lLWRheSBjYXNlIGtlZXBzIE9QRCAvIFx1ODVFNVx1NUM0MCByZXNvdXJjZXMgdGlnaHQuXG4gICAgZW5kX2RhdGU6IGVuZF9kYXRlICYmIGVuZF9kYXRlICE9PSBkYXRlID8gZW5kX2RhdGUgOiBcIlwiLFxuICAgIGRydWdfbmFtZSxcbiAgICBkcnVnX25hbWVfemgsXG4gICAgY29kZTogZHJ1Zy5vcmRlcl9jb2RlIHx8IGRydWcub3JkZVJfQ09ERSB8fCBcIlwiLFxuICAgIC8vIExpc3QgZW5kcG9pbnQgZG9lc24ndCBleHBvc2UgZG9zZS9mcmVxdWVuY3kvcm91dGUgXHUyMDE0IG9ubHkgZGF5cyArIHF0eS5cbiAgICBkb3NlOiBcIlwiLFxuICAgIGZyZXF1ZW5jeTogXCJcIixcbiAgICByb3V0ZTogXCJcIixcbiAgICBxdWFudGl0eTogZHJ1Zy5vcmRlcl9xdHkgfHwgZHJ1Zy5vcmRlcl9RVFkgfHwgXCJcIixcbiAgICBkdXJhdGlvbl9kYXlzOiBOdW1iZXIuaXNGaW5pdGUoZGF5cykgPyBkYXlzIDogMCxcbiAgICBpbmRpY2F0aW9uLFxuICAgIGluZGljYXRpb25femgsXG4gICAgaW5kaWNhdGlvbl9jb2RlOiB2aXNpdD8uaWNkOWNtX0NPREUgfHwgdmlzaXQ/LmljZDljbV9jb2RlIHx8IFwiXCIsXG4gICAgZHJ1Z19jbGFzczogcGlja0VuZ2xpc2goZHJ1Zy5hY3QgfHwgXCJcIiksXG4gICAgZHJ1Z19jbGFzc196aDogcGlja0NoaW5lc2UoZHJ1Zy5hY3QgfHwgXCJcIiksXG4gICAgaG9zcGl0YWw6IHZpc2l0Py5ob3NwX0FCQlIgfHwgdmlzaXQ/Lmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIE1hcHBlciByZWFkcyB0aGlzIHRvIHNldCBNZWRpY2F0aW9uUmVxdWVzdC5jb3Vyc2VPZlRoZXJhcHlUeXBlLlxuICAgIGNvdXJzZV9vZl90aGVyYXB5OiBpc19jaHJvbmljID8gXCJjb250aW51b3VzXCIgOiBcIlwiLFxuICB9O1xufVxuXG4vLyBTdHViIGtlcHQgZm9yIHRoZSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgSUhLRTMzMDZTMDEgbGlzdCBuZXZlciBoYXMgZHJ1Z3MsXG4vLyBzbyB3ZSBhbHdheXMgcmV0dXJuIG51bGwgYW5kIHJlbHkgb24gdGhlIDItc3RlcCBkZXRhaWwgZmV0Y2ggYWJvdmUuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRNZWRpY2F0aW9uKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBTdHViIGZvciB0aGUgSUhLRTMzMDdTMDEgXHU2MTYyXHU2MDI3XHU4NjU1XHU2NUI5XHU3QjhCIGxpc3QuIFRoZSBsaXN0IHJvd3MgaGF2ZSBubyBkcnVnXG4vLyBwYXlsb2FkOyBkcnVncyBjb21lIHZpYSB0aGUgMi1zdGVwIGZhbi1vdXQgaW50byBJSEtFMzMwNlMwMiB3aXRoXG4vLyBjdHlwZT1yb3cub3JpX1RZUEUgKHNlZSBfZmV0Y2hDaHJvbmljTWVkaWNhdGlvbkRldGFpbHNJblRhYiBpblxuLy8gYmFja2dyb3VuZC5qcykuIFJldHVybmluZyBudWxsIGhlcmUgZW5zdXJlcyB0aGUgZ2VuZXJpYyBsb29wIGVtaXRzXG4vLyBub3RoaW5nIGZyb20gdGhpcyBlbmRwb2ludCBcdTIwMTQgdGhlIGZhbi1vdXQgaXMgd2hlcmUgdGhlIG1hcmtlZFxuLy8gTWVkaWNhdGlvblJlcXVlc3QgcmVzb3VyY2VzIGFyZSBwcm9kdWNlZC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdENocm9uaWNMaXN0U3R1YigpIHsgcmV0dXJuIG51bGw7IH1cblxuLy8gU2FtZSBzaGFwZSBhcyBhZGFwdE1lZGljYXRpb246IElIS0UzNDA4UzAxIChpbWFnaW5nIGxpc3QpIG9ubHkgY2Fycmllc1xuLy8gb3JkZXItbGV2ZWwgZGF0YTsgdGhlIGFjdHVhbCByZXBvcnQgbmFycmF0aXZlIGNvbWVzIGZyb20gdGhlIElIS0UzNDA4UzAyXG4vLyBkZXRhaWwgZmFuLW91dCAoc2VlIGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwpLiBSZXR1cm5pbmcgbnVsbCBmcm9tXG4vLyB0aGUgbGlzdCBhZGFwdGVyIGVuc3VyZXMgbm8gaGFsZi1mb3JtZWQgRGlhZ25vc3RpY1JlcG9ydHMgbGVhayB0aHJvdWdoLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0SW1hZ2luZ0xpc3RTdHViKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBJSEtFMzIwOVMwMSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KSBcdTIwMTQgTkhJJ3Mgb2ZmaWNpYWxseS12ZXR0ZWQgY2F0YXN0cm9waGljLWlsbG5lc3Ncbi8vIHJlZ2lzdHJ5LiBFYWNoIHJvdyBpcyBhIHNlcmlvdXMgY2hyb25pYyBjb25kaXRpb24gKGNhbmNlciwgYXV0b2ltbXVuZSxcbi8vIHRyYW5zcGxhbnQgZm9sbG93LXVwLCBkaWFseXNpcywgZXRjLikgdGhlIHBhdGllbnQgaXMgY3VycmVudGx5XG4vLyByZWdpc3RlcmVkIGZvci4gVGhpcyBpcyB0aGUgY2xvc2VzdCB0aGluZyBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZXhwb3NlcyB0byBhXG4vLyBjdXJhdGVkIHByb2JsZW0gbGlzdCBcdTIwMTQgZmFyIHN0cm9uZ2VyIHNpZ25hbCB0aGFuIHJldmVyc2UtZW5naW5lZXJpbmdcbi8vIGNocm9uaWMgY29uZGl0aW9ucyBmcm9tIGVuY291bnRlciBJQ0RzLlxuLy9cbi8vIE1hcHMgdG8gRkhJUiBDb25kaXRpb24gd2l0aCBjYXRlZ29yeT1wcm9ibGVtLWxpc3QtaXRlbSBzbyBkb3duc3RyZWFtXG4vLyBTTUFSVCBhcHBzIC8gSVBTIHByb2ZpbGVzIHN1cmZhY2UgaXQgaW4gdGhlaXIgcHJvYmxlbS1saXN0IHZpZXcuXG4vL1xuLy8gUGF5bG9hZCBzaGFwZSAobGl2ZSBjYXB0dXJlKTpcbi8vICAgc1BfSUhLRTMyMDlTMDE6IFtcbi8vICAgICB7IGhvc1BfSUQsIGhvc1BfQUJCUiwgaG9zUF9VUkwsXG4vLyAgICAgICBpY0QxMENNX0NOQU1FOiBcIlx1NjUxRFx1OEI3N1x1ODE3QVx1NjBFMVx1NjAyN1x1ODE2Qlx1NzYyNFwiLCAgXHUyMTkwIENoaW5lc2UgbmFycmF0aXZlIG9ubHlcbi8vICAgICAgIHZhbGlEX1NfREFURTogIFwiMTExLzExLzE2XCIsICAgICAgIFx1MjE5MCBjZXJ0aWZpY2F0aW9uIHZhbGlkLWZyb20gKFJPQylcbi8vICAgICAgIHZhbGlEX0VfREFURTogIFwiMTE2LzExLzE1XCIgfSAgICAgIFx1MjE5MCBjZXJ0aWZpY2F0aW9uIHZhbGlkLXVudGlsIChST0MsIH41eSlcbi8vICAgXVxuLy9cbi8vIENhdmVhdHMgZGVsaWJlcmF0ZWx5IGVuY29kZWQ6XG4vLyAgIC0gTkhJIGRvZXNuJ3QgcmV0dXJuIHRoZSBJQ0QtMTAtQ00gY29kZSBpbiB0aGlzIGVuZHBvaW50LCBvbmx5IHRoZVxuLy8gICAgIENoaW5lc2UgbGFiZWwuIFdlIGxlYXZlIGBjb2RlYCBlbXB0eTsgbWFwQ29uZGl0aW9uIGZhbGxzIGJhY2sgdG9cbi8vICAgICBkaXNwbGF5LWFzLWlkIGZvciBzdGFibGVJZCAobWlycm9yaW5nIGRpYWdub3N0aWMtcmVwb3J0LnRzKS5cbi8vICAgLSB2YWxpRF9FX0RBVEUgaXMgd2hlbiB0aGUgQ0FSRCBleHBpcmVzIChyZW5ld2VkIGV2ZXJ5IH41eSksIE5PVFxuLy8gICAgIHdoZW4gdGhlIGRpc2Vhc2UgcmVzb2x2ZWQuIFdlIGRlbGliZXJhdGVseSBkbyBOT1QgbWFwIGl0IHRvXG4vLyAgICAgYWJhdGVtZW50RGF0ZVRpbWUgXHUyMDE0IHRoYXQgd291bGQgZmFsc2VseSBpbXBseSB0aGUgY29uZGl0aW9uIHN0b3BwZWQuXG4vLyAgIC0gQWxsIHJvd3MgaGVyZSBhcmUgY3VycmVudGx5IGFjdGl2ZSBieSBkZWZpbml0aW9uOyBOSEkgb25seSByZXR1cm5zXG4vLyAgICAgdmFsaWQgY2VydGlmaWNhdGlvbnMuIGNsaW5pY2FsX3N0YXR1cyBoYXJkLWNvZGVkIHRvIFwiYWN0aXZlXCIuXG4vLyAgIC0gc2V2ZXJpdHkgc3RvcmVkIGFzIHRleHQgKFwiU2V2ZXJlIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpXCIpIGJlY2F1c2UgdGhlIGZvcm1hbFxuLy8gICAgIHNldmVyaXR5IGNvZGUgbWFwcGluZyAoU05PTUVEIDI0NDg0MDAwIGV0Yy4pIG5lZWRzIG1vcmUgdGhvdWdodC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdENhdGFzdHJvcGhpY0lsbG5lc3MoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkaXNwbGF5ID0gcGlja0VuZ2xpc2goaXRlbS5pY0QxMENNX0NOQU1FIHx8IGl0ZW0uaWNkMTBjbV9jbmFtZSB8fCBcIlwiKTtcbiAgaWYgKCFkaXNwbGF5KSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkaXNwbGF5LFxuICAgIGNvZGU6IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIG9uc2V0X2RhdGU6IHJvY1RvSVNPKGl0ZW0udmFsaURfU19EQVRFIHx8IGl0ZW0udmFsaWRfc19kYXRlIHx8IFwiXCIpLFxuICAgIHJlY29yZGVkX2RhdGU6IHJvY1RvSVNPKGl0ZW0udmFsaURfU19EQVRFIHx8IGl0ZW0udmFsaWRfc19kYXRlIHx8IFwiXCIpLFxuICAgIGNhdGVnb3J5OiBcInByb2JsZW0tbGlzdC1pdGVtXCIsXG4gICAgc2V2ZXJpdHk6IFwiU2V2ZXJlIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgY2xpbmljYWxfc3RhdHVzOiBcImFjdGl2ZVwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzQwMlMwMSAoXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1XHU3RDUwXHU2NzlDKSBcdTIwMTQgb25lIHJvdyBwZXIgc2NyZWVuaW5nIGV2ZW50LCBmbGF0XG4vLyBzY2hlbWEuIE5ISSBydW5zIHRoZSBwYW5lbCBpdHNlbGYgYW5kIHJldHVybnMgdml0YWxzICsgYSBmaXhlZFxuLy8gYmF0dGVyeSBvZiBsYWIgdmFsdWVzIHByZS1jb21wdXRlZCAoQk1JIC8gd2Fpc3QgLyBCUCAvIGxpcGlkcyAvIExGVFxuLy8gLyBSRlQgLyBmYXN0aW5nIGdsdWNvc2UgLyBIQnNBZyAvIEFudGktSENWIC8gdXJpYyBhY2lkIFx1MjAyNikuXG4vLyBXZSB1bmZvbGQgb25lIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbnM6IHZpdGFscyBnbyB0byBjYXRlZ29yeVxuLy8gdml0YWwtc2lnbnMgKHNvIFNNQVJUIGFwcHMnIHZpdGFscyB2aWV3cyBwaWNrIHRoZW0gdXApLCBsYWJzIGdvIHRvXG4vLyBjYXRlZ29yeSBsYWJvcmF0b3J5LiBSZXR1cm5zIGFuIEFSUkFZIFx1MjAxNCBjYWxsZXIgbXVzdCBmbGF0LW1hcC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEFkdWx0UHJldmVudGl2ZShyb3cpIHtcbiAgaWYgKCFyb3cgfHwgdHlwZW9mIHJvdyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhyb3cuZmlyc1RfRElBR19EQVRFIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUpIHJldHVybiBudWxsO1xuICBjb25zdCBob3NwaXRhbCA9IHJvdy5ob3NQX0FCQlIgfHwgcm93Lmhvc3BfQUJCUiB8fCBcIlwiO1xuICBjb25zdCBvdXQgPSBbXTtcbiAgLy8gKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIE5ISSBjb2RlKVxuICAvLyAoZGlzcGxheSwgdmFsdWUsIHVuaXQsIHJlZlJhbmdlLCBjYXRlZ29yeSwgY29kZSlcbiAgLy8gRXZlcnkgb2JzZXJ2YXRpb24gZW1pdHRlZCBmcm9tIHRoaXMgYWRhcHRlciBjYXJyaWVzIHNvdXJjZV9wcm9ncmFtPVxuICAvLyBcImFkdWx0LXByZXZlbnRpdmVcIiBzbyBkb3duc3RyZWFtIEZISVIgY29uc3VtZXJzIGNhbiBpZGVudGlmeSB0aGVcbiAgLy8gb3JpZ2luIHByb2dyYW1tZSB2aWEgT2JzZXJ2YXRpb24ubWV0YS50YWcgKHNlcGFyYXRlIGZyb20gdGhlXG4gIC8vIHN5bmMtcGFnZS10eXBlIC8gc3luYy1ydW4taWQgc3luYy10cmFja2luZyB0YWdzKS5cbiAgZnVuY3Rpb24gcHVzaChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBjb2RlKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybjtcbiAgICBjb25zdCB2ID0gU3RyaW5nKHZhbHVlKS50cmltKCk7XG4gICAgLy8gRW0tZGFzaCBcIlx1MjAxNFwiIChVKzIwMTQpIGlzIE5ISSdzIHNlbnRpbmVsIFwibm8gZGF0YVwiIG1hcmtlciBcdTIwMTQgZHJvcC5cbiAgICAvLyBQbGFpbiBoeXBoZW4gXCItXCIgaXMgTk9UIGEgbm8tZGF0YSBtYXJrZXIgcGVyLWZpZWxkIFx1MjAxNCBpdCdzIHRoZVxuICAgIC8vIGNsaW5pY2FsIGRpcHN0aWNrIGNvbnZlbnRpb24gZm9yIFwibmVnYXRpdmVcIiAoVXJpbmUgUHJvdGVpbikuXG4gICAgLy8gTkhJJ3Mgbm8tZGF0YSBmbGFnIGZvciBhbiBlbnRpcmUgcm93IGlzIHNpZ25hbGxlZCBieVxuICAgIC8vIGZpcnNUX0RJQUdfREFURSA9IFwiLVwiIHdoaWNoIHRoZSByb3ctbGV2ZWwgZGF0ZSBndWFyZCBhdCB0aGUgdG9wXG4gICAgLy8gb2YgYWRhcHRBZHVsdFByZXZlbnRpdmUgYWxyZWFkeSByZWplY3RzLCBzbyBcIi1cIiByZWFjaGluZyBwdXNoKClcbiAgICAvLyBhbHdheXMgbWVhbnMgXCJ0aGUgY2xpbmljaWFuIHdyb3RlIGl0IGRvd24gYXMgYSBuZWdhdGl2ZSByZXN1bHRcIi5cbiAgICBpZiAodiA9PT0gXCJcIiB8fCB2ID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgb3V0LnB1c2goe1xuICAgICAgZGF0ZSxcbiAgICAgIGhvc3BpdGFsLFxuICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiLFxuICAgICAgb3JkZXJfY29kZTogY29kZSB8fCBcIlwiLFxuICAgICAgb3JkZXJfbmFtZTogZGlzcGxheSxcbiAgICAgIGNvZGU6IGNvZGUgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgICB2YWx1ZTogdixcbiAgICAgIHVuaXQ6IHVuaXQgfHwgXCJcIixcbiAgICAgIHJlZmVyZW5jZV9yYW5nZTogcmVmUmFuZ2UgfHwgXCJcIixcbiAgICAgIC8vIFNvdXJjZS1wcm9ncmFtbWUgdGFnIFx1MjAxNCBhZGRlZCB0byBPYnNlcnZhdGlvbi5tZXRhLnRhZyBieSB0aGVcbiAgICAgIC8vIG1hcHBlcjsgbGV0cyBTTUFSVCBhcHBzIGZpbHRlciAvIGNhdGVnb3JpemUgXCJ0aGlzIGNhbWUgZnJvbVxuICAgICAgLy8gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1IHNjcmVlbmluZ1wiLlxuICAgICAgc291cmNlX3Byb2dyYW06IFwiYWR1bHQtcHJldmVudGl2ZVwiLFxuICAgIH0pO1xuICB9XG4gIC8vIFZpdGFsIHNpZ25zIChubyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIFx1MjAxNCB0aGVzZSBhcmUgc2NyZWVuaW5nIG1lYXN1cmVtZW50cywgbm90XG4gIC8vIGxhYiBvcmRlcnM7IHRoZXkgaGF2ZSBjYW5vbmljYWwgTE9JTkNzIHdoaWNoIGZpbmRMb2luYydzIGtleXdvcmRcbiAgLy8gc2VhcmNoIHJlc29sdmVzIGNsZWFubHkgdmlhIHVuaXF1ZSB0ZXJtcyBsaWtlIFwiYm9keSBoZWlnaHRcIiAvIFwiYm1pXCJcbiAgLy8gXHUyMDE0IG5vIHByZWZpeC1jb2xsaXNpb24gcmlzayB3aXRoIG90aGVyIExPSU5DX01BUCBrZXlzKS5cbiAgcHVzaChcIkJvZHkgSGVpZ2h0XCIsIHJvdy5oZWlnaHQsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJvZHkgV2VpZ2h0XCIsIHJvdy53ZWlnaHQsIFwia2dcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJNSVwiLCByb3cuYm1pLCBcImtnL20yXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJXYWlzdCBDaXJjdW1mZXJlbmNlXCIsIHJvdy53YWlzdGxpbmUsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIlN5c3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX1NCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkRpYXN0b2xpYyBCbG9vZCBQcmVzc3VyZVwiLCByb3cuYmFzRV9FQlAsIFwibW1IZ1wiLFxuICAgICAgIHJvdy5ibG9EX1BSRVNTX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIC8vIEFsbCBjaGVtaXN0cnkgLyBoZXAgcGFuZWwgcm93cyBwaW4gdGhlIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgc28gZmluZExvaW5jIHRha2VzXG4gIC8vIHRoZSBOSElfVE9fTE9JTkMgZGlyZWN0LWxvb2t1cCBwYXRoIFx1MjAxNCBieXBhc3NlcyB0aGUga2V5d29yZCBzZWFyY2hcbiAgLy8gZW50aXJlbHkuIE1hcHBpbmcgY3Jvc3MtdmVyaWZpZWQgYWdhaW5zdCB0aHJlZSBzb3VyY2VzOiB0aGUgTkhJIFVJXG4gIC8vIHNlY3Rpb24gbGFiZWxzIChcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1KSwgdGhlIElIS0UzNDAyIEpTT04gZmllbGRcbiAgLy8gbmFtZXMsIGFuZCB0aGUgZXhpc3RpbmcgTkhJX1RPX0xPSU5DIHRhYmxlIGNvbW1lbnRzLlxuICAvL1xuICAvLyBMaXBpZCBwYW5lbFxuICBwdXNoKFwiQ2hvbGVzdGVyb2xcIiwgICByb3cuY2hvLCAgICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwMUNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMjA5My0zXG4gIHB1c2goXCJUcmlnbHljZXJpZGVcIiwgIHJvdy5ibG9EX1RHLCBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDA0Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyNTcxLThcbiAgcHVzaChcIkhETFwiLCAgICAgICAgICAgcm93LmhkbCwgICAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwNDNDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDIwODUtOVxuICBwdXNoKFwiTERMXCIsICAgICAgICAgICByb3cubGRsLCAgICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTA0NENcIik7ICAvLyBcdTIxOTIgTE9JTkMgMTM0NTctNyAoY2FsYylcbiAgLy8gTGl2ZXIgZnVuY3Rpb25cbiAgcHVzaChcIlNHT1QgKEFTVClcIiwgICAgcm93LnNnb3QsICAgIFwiVS9MXCIsIHJvdy5sRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDI1Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAxOTIwLThcbiAgcHVzaChcIlNHUFQgKEFMVClcIiwgICAgcm93LnNncHQsICAgIFwiVS9MXCIsIHJvdy5sRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDI2Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAxNzQyLTZcbiAgLy8gRmFzdGluZyBnbHVjb3NlXG4gIHB1c2goXCJHbHUtQUNcIiwgICAgICAgIHJvdy5zXzA5MDA1QywgXCJtZy9kTFwiLFxuICAgICAgIHJvdy5zXzA5MDA1Q19ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDA1Q1wiKTsgICAgICAgIC8vIFx1MjE5MiBMT0lOQyAxNTU4LTZcbiAgLy8gUmVuYWwgZnVuY3Rpb24gXHUyMDE0IGB1cmluRV9CVU5gIGlzIE5ISSdzIG1pc2xlYWRpbmcgZmllbGQgbmFtZTsgdGhlXG4gIC8vIHZhbHVlIElTIHNlcnVtIEJVTiAoQmxvb2QgVXJlYSBOaXRyb2dlbiksIG5vdCBhIHVyaW5lIHRlc3QuXG4gIHB1c2goXCJCVU5cIiwgICAgICAgICAgIHJvdy51cmluRV9CVU4sICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwMkNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMzA5NC0wXG4gIHB1c2goXCJDcmVhdGluaW5lXCIsICAgIHJvdy5ibG9EX0NSRUFULCAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAxNUNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMjE2MC0wXG4gIC8vIGVHRlIgXHUyMDE0IGRlcml2ZWQgZnJvbSBDcmVhdGluaW5lLCBubyBvd24gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQy4gRGlzcGxheSBrZXl3b3JkXG4gIC8vIFwiZWdmclwiIHJlc29sdmVzIHRvIExPSU5DIDMzOTE0LTMgdmlhIGZpbmRMb2luYy5cbiAgcHVzaChcImVHRlJcIiwgICAgICAgICAgcm93LmVnZnIsICAgICAgICBcIm1ML21pbi8xLjczbTJcIixcbiAgICAgICByb3cuckZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiKTtcbiAgLy8gVXJpbmUgUHJvdGVpbiBkaXBzdGljayBcdTIwMTQgcXVhbGl0YXRpdmUgKFwiLVwiIC8gXCJcdTAwQjFcIiAvIFwiMStcIiAuLi4pLlxuICAvLyB1cmluRV9QUk9URUlOIGlzIHRoZSBzdGF0dXMgY29kZSwgdXJpbkVfUFJPVEVJTl9URVhUIGlzIHRoZVxuICAvLyBkaXNwbGF5YWJsZSByZXN1bHQgKHBhc3NlZCBhcyB2YWx1ZSkuIFRoZSBzcGVjaWZpYyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIGZvclxuICAvLyBwcmV2ZW50aXZlLXNjcmVlbmluZyB1cmluZSBwcm90ZWluIGlzbid0IGluIG91ciBOSElfVE9fTE9JTkMgdGFibGVcbiAgLy8geWV0OyB0aGUga2V5d29yZCBcInVyaW5lIHByb3RlaW5cIiByZXNvbHZlcyB0byBMT0lOQyAyMDQ1NC01IHZpYVxuICAvLyBmaW5kTG9pbmMgKGFmdGVyIHRoZSB2MC42LjcgbG9uZ2VzdC1tYXRjaCBmaXgpLlxuICBwdXNoKFwiVXJpbmUgUHJvdGVpblwiLCByb3cudXJpbkVfUFJPVEVJTl9URVhUIHx8IFwiXCIsIFwiXCIsIFwiXCIpO1xuICAvLyBIZXBhdGl0aXMgQi9DIHNjcmVlbmluZyBcdTIwMTQgc3RhdHVzIGNvZGUgdnMgX1RFWFQgdHJhcCBkb2N1bWVudGVkIGF0XG4gIC8vIGxlbmd0aCBiZWxvdy4gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBwaW5uZWQgc28gZmluZExvaW5jIHRha2VzIHRoZSBOSElfVE9fTE9JTkNcbiAgLy8gcGF0aCAob3RoZXJ3aXNlIHRoZSBrZXl3b3JkIFwiaGJcIiBwcmVmaXgtY29sbGlkZXMgd2l0aCB0aGUgbW9yZVxuICAvLyBzcGVjaWZpYyBcImhic2FnXCIgXHUyMDE0IHRoZSBidWcgb3JpZ2luYWxseSByZXBvcnRlZCBpbiB2MC42LjUpLlxuICAvLyAgIDE0MDMyQyBcdTIxOTIgTE9JTkMgNTE5Ni0xICAoSEJzQWcsIE1hc3Mvdm9sKVxuICAvLyAgIDE0MDUxQyBcdTIxOTIgTE9JTkMgMTM5NTUtMCAoSENWIGFudGlib2R5LCBTZXJ1bSBvciBQbGFzbWEpXG4gIC8vIEhpc3Rvcnk6IHJlZ3Jlc3NlZCBpbiB2MC42LjMsIGZpeCBsb3N0IHVudGlsIHYwLjYuNTsgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQ1xuICAvLyBwaW5uaW5nIGFkZGVkIHYwLjYuNiArIHYwLjYuOC5cbiAgcHVzaChcIkhCc0FnXCIsICAgIHJvdy5oYnNhR19URVhUICAgfHwgXCJcIiwgXCJcIiwgcm93LmhiVl9SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIxNDAzMkNcIik7XG4gIHB1c2goXCJBbnRpLUhDVlwiLCByb3cuYW50SV9IQ1ZfVEVYVCB8fCBcIlwiLCBcIlwiLCByb3cuaGNWX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjE0MDUxQ1wiKTtcbiAgLy8gVXJpYyBhY2lkIChibG9vZCkgXHUyMDE0IGB1cmlDX0FDSURgIGZpZWxkLiBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIDA5MDEzQyBcdTIxOTIgTE9JTkNcbiAgLy8gMzA4NC0xIChVcmF0ZSBNYXNzL3ZvbCBTL1ApLlxuICAvL1xuICAvLyBOSEkncyBJSEtFMzQwMiBzY2hlbWEgQUxTTyBjYXJyaWVzIHR3byByZWxhdGVkLWxvb2tpbmctYnV0LWRpc3RpbmN0XG4gIC8vIGZpZWxkcyB3ZSBkZWxpYmVyYXRlbHkgc2tpcDpcbiAgLy8gICAtIHVyaW5FX1VBX0RJQUdfQUNJRCBcdTIwMTQgZW1waXJpY2FsbHkgZHVwbGljYXRlcyBzZXJ1bSB1cmljIGFjaWQ7XG4gIC8vICAgICBlbWl0dGluZyBpdCB3b3VsZCBjcmVhdGUgYSBkdXBsaWNhdGUgT2JzZXJ2YXRpb24uXG4gIC8vICAgLSB1cmluRV9VQSAvIHVyaW5FX1VBX0RJQUdfUkVTVUxUX1RFWFQgXHUyMDE0IGNsYWltIHRvIGJlIGEgdXJpbmUgVUFcbiAgLy8gICAgIGRpcHN0aWNrIGJ1dCBET04nVCBhcHBlYXIgYW55d2hlcmUgaW4gTkhJJ3MgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIFVJIGZvclxuICAvLyAgICAgYWR1bHQgcHJldmVudGl2ZSBzY3JlZW5pbmcgKHRoZSBcdTVDM0ZcdTZEQjJcdTZBQTJcdTY3RTUgc2VjdGlvbiBvbmx5IHNob3dzXG4gIC8vICAgICBcdTVDM0ZcdTZEQjJcdTg2Q0JcdTc2N0RcdThDRUEpLiBBbHdheXMgZW1wdHkgLyBcIi1cIiBpbiBvYnNlcnZlZCBwYXlsb2Fkcy4gTGVnYWN5XG4gIC8vICAgICBzY2hlbWEgZmllbGQgd2l0aCBubyBjbGluaWNhbCByZWFsaXR5IFx1MjAxNCBkbyBOT1QgZW1pdC5cbiAgcHVzaChcIlVyaWMgQWNpZFwiLCAgICAgcm93LnVyaUNfQUNJRCwgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDEzQ1wiKTtcbiAgLy8gTWV0YWJvbGljIHN5bmRyb21lIHNjcmVlbmluZyBcdTIwMTQgdmFsdWUgaXMgYW4gaW50ZXJwcmV0YXRpb24gc3RyaW5nXG4gIC8vICgnXHU2QjYzXHU1RTM4JyAvICdcdTc1NzBcdTVFMzhcdUZGMENcdTVFRkFcdThCNzBcdUZGMUFcdThBQ0JcdTZEM0RcdThBNjJcdTkxQUJcdTVFMkInKSwgbm90IGEgbnVtYmVyLiBUaGUgbWFwcGVyJ3NcbiAgLy8gX3RyeV9wYXJzZV9xdWFudGl0eSB3aWxsIHJldHVybiBOb25lIGFuZCBpdCBmYWxscyB0aHJvdWdoIHRvXG4gIC8vIHZhbHVlU3RyaW5nLiBObyBtYXBwZWQgTE9JTkMga2V5d29yZCAoeWV0KSBzbyB0aGlzIGxhbmRzIGFzIGFuXG4gIC8vIE9ic2VydmF0aW9uIHdpdGggY29kZS50ZXh0IG9ubHk7IGRvd25zdHJlYW0gY29uc3VtZXJzIGNhbiBzdGlsbFxuICAvLyBzdXJmYWNlIGl0IHVuZGVyIHRoZSBwYXRpZW50J3Mgc2NyZWVuaW5nIHNlY3Rpb24gYnkgY29kZS50ZXh0LlxuICBwdXNoKFwiXHU0RUUzXHU4QjFEXHU3NUM3XHU1MDE5XHU3RkE0XHU3QkU5XHU2QUEyIChNZXRhYm9saWMgU3luZHJvbWUgU2NyZWVuaW5nKVwiLFxuICAgICAgIHJvdy5tZXRBX1NZTkRSX1JFU1VMVF9URVhULCBcIlwiLCBcIlwiKTtcbiAgcmV0dXJuIG91dDtcbn1cblxuLy8gSUhLRTMzMDlTMDEgKFx1NEY0Rlx1OTY2MiBpbnBhdGllbnQgbGlzdCkgXHUyMDE0IGdpdmVzIHByb3BlciBhZG1pc3Npb24vZGlzY2hhcmdlLlxuLy8gU2hhcGU6IHtob3NwX0lELCBob3NwX0FCQlIsIGhvc3BfdXJsLCBpbl9EQVRFLCBvdXRfREFURSxcbi8vICAgICAgICAgaWNkOWNtX0NPREUsIGljZDljbV9DT0RFX0NOQU1FLCBvcmlfVFlQRShcIjNcIiksIHJvd19JRCwgLi4ufVxuLy8gSUhLRTMzMDhTMDEgaGFzIHRoZSBzYW1lIHNoYXBlIGZvciBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3Jkcztcbi8vIGBmdW5jX0RBVEVgIGluc3RlYWQgb2YgYGluX0RBVEVgIGluIHNvbWUgcm93cyBcdTIwMTQgYWRhcHRlciBhY2NlcHRzIGJvdGguXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIoaXRlbSwgb3B0aW9ucykge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBzdGFydCA9IHJvY1RvSVNPKGl0ZW0uaW5fREFURSB8fCBpdGVtLmZ1bmNfREFURSB8fCBcIlwiKTtcbiAgY29uc3QgZW5kID0gcm9jVG9JU08oaXRlbS5vdXRfREFURSB8fCBcIlwiKTtcbiAgaWYgKCFzdGFydCkgcmV0dXJuIG51bGw7XG4gIC8vIElIS0UzMzA5UzAxIGxpc3Qgc2hpcHMgaWNkOWNtX0NPREVfQ05BTUUgQ2hpbmVzZS1vbmx5IChcIlx1NTRCM1x1ODg0MFwiKSB3aXRoXG4gIC8vIG5vIGJpbGluZ3VhbCBgfHxgIGFuZCBubyBzZWNvbmRhcnkgZGlhZ25vc2VzIGZpZWxkIFx1MjAxNCBzYW1lIHByb2JsZW1cbiAgLy8gcGF0dGVybiBhcyBJSEtFMzMwMyBPUEQgZW5jb3VudGVycyBiZWZvcmUgdjAuOC40LiBDYWxsZXIgbWF5XG4gIC8vIHN1cHBseSBvcHRpb25zLnByaW1hcnlfZGlhZ25vc2lzIChiaWxpbmd1YWwge2NvZGUsIG5hbWVfZW4sIG5hbWVfemh9KVxuICAvLyBhbmQgb3B0aW9ucy5zZWNvbmRhcnlfZGlhZ25vc2VzIChhcnJheSkgZnJvbSB0aGUgSUhLRTMzMDlTMDJcbiAgLy8gZGV0YWlsIGZhbi1vdXQgc28gdGhlIG1hcHBlciBwcm9kdWNlcyBFbmdsaXNoIGNvZGluZy5kaXNwbGF5ICtcbiAgLy8gbXVsdGlwbGUgcmVhc29uQ29kZSBlbnRyaWVzIFx1MjAxNCBzYW1lIGNvbnRyYWN0IGFzIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UuXG4gIGNvbnN0IHN0cmlwSWNkUHJlZml4ID0gKHMpID0+IFN0cmluZyhzIHx8IFwiXCIpLnJlcGxhY2UoL15bQS1aMC05Ll0rXFwvXFxzKi8sIFwiXCIpO1xuICBjb25zdCBzMDJQcmltYXJ5ID0gb3B0aW9ucyAmJiBvcHRpb25zLnByaW1hcnlfZGlhZ25vc2lzO1xuICBjb25zdCBpY2RDb2RlID1cbiAgICAoczAyUHJpbWFyeSAmJiBzMDJQcmltYXJ5LmNvZGUpIHx8IGl0ZW0uaWNkOWNtX0NPREUgfHwgaXRlbS5pY2Q5Y21fY29kZSB8fCBcIlwiO1xuICBsZXQgaWNkTmFtZSwgaWNkTmFtZV96aDtcbiAgaWYgKHMwMlByaW1hcnkgJiYgKHMwMlByaW1hcnkubmFtZV9lbiB8fCBzMDJQcmltYXJ5Lm5hbWVfemgpKSB7XG4gICAgaWNkTmFtZSA9IHMwMlByaW1hcnkubmFtZV9lbiB8fCBzMDJQcmltYXJ5Lm5hbWVfemg7XG4gICAgaWNkTmFtZV96aCA9IHMwMlByaW1hcnkubmFtZV96aCB8fCBzMDJQcmltYXJ5Lm5hbWVfZW47XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmF3SWNkTmFtZSA9IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fbmFtZSB8fCBcIlwiO1xuICAgIGljZE5hbWUgPSBzdHJpcEljZFByZWZpeChwaWNrRW5nbGlzaChyYXdJY2ROYW1lKSk7XG4gICAgaWNkTmFtZV96aCA9IHN0cmlwSWNkUHJlZml4KHBpY2tDaGluZXNlKHJhd0ljZE5hbWUpKTtcbiAgfVxuICAvLyBJSEtFMzMwOSBpcyB0aGUgZm9ybWFsIGlucGF0aWVudCAoXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5KSBlbmRwb2ludCBieSBkZWZpbml0aW9uLlxuICAvLyBDaGFubmVsIGNvdWxkIGluIHRoZW9yeSBjb21lIGZyb20gaXRlbS5vcmlfdHlwZV9uYW1lIGlmIHByZXNlbnQsXG4gIC8vIGVsc2UgZmFsbCBiYWNrIHRvIFwiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIgc2luY2UgdGhhdCdzIHdoYXQgdGhpcyBlbmRwb2ludFxuICAvLyByZXByZXNlbnRzLiBTZWUgdHlwZV9kaXNwbGF5IGNvbnRyYWN0IGluIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UuXG4gIGNvbnN0IF9jaGFubmVsID0gaXRlbS5vcmlfdHlwZV9uYW1lIHx8IGl0ZW0ub3JJX1RZUEVfTkFNRSB8fCBcIlx1NzUzM1x1NTgzMVx1OENDN1x1NjU5OVwiO1xuICByZXR1cm4ge1xuICAgIGRhdGU6IHN0YXJ0LFxuICAgIGVuZF9kYXRlOiBlbmQsXG4gICAgY2xhc3M6IFwiSU1QXCIsXG4gICAga2luZDogXCJcdTRGNEZcdTk2NjJcIixcbiAgICBjaGFubmVsOiBfY2hhbm5lbCxcbiAgICB0eXBlX2Rpc3BsYXk6IFwiXHU0RjRGXHU5NjYyXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIHJlYXNvbl96aDogaWNkTmFtZV96aCA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lX3pofWAgOiBpY2ROYW1lX3poKSA6IFwiXCIsXG4gICAgcmVhc29uX2NvZGU6IGljZENvZGUsXG4gICAgc2Vjb25kYXJ5X2RpYWdub3NlczpcbiAgICAgIG9wdGlvbnMgJiYgQXJyYXkuaXNBcnJheShvcHRpb25zLnNlY29uZGFyeV9kaWFnbm9zZXMpXG4gICAgICAgID8gb3B0aW9ucy5zZWNvbmRhcnlfZGlhZ25vc2VzXG4gICAgICAgIDogW10sXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgcm93X2lkOiBpdGVtLnJvd19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwM1MwMSAoXHU5MUFCXHU3NjQyXHU4Q0JCXHU3NTI4XHU3NTMzXHU1ODMxKSBpdGVtIHNoYXBlIFx1MjAxNCBmYXIgbW9yZSBjb21wbGV0ZSB0aGFuIHRoZSBvbGRlclxuLy8gSUhLRTMzMDFTMDIgdmlzaXQgbGlzdCAoNTEgdmlzaXRzIHZzIDYgZm9yIHRoZSB0ZXN0IHBhdGllbnQpLiBOSEknc1xuLy8gY2Fub25pY2FsIHNvdXJjZSBvZiB0cnV0aCBmb3IgXCJldmVyeSBiaWxsZWQgZW5jb3VudGVyXCIuXG4vLyAgIGhvc1BfSUQsIGhvc1BfQUJCUiwgaG9zcF91cmxcbi8vICAgZnVuQ19EQVRFICAgICAgICAgICAgICAoXHU2QzExXHU1NzBCIFlZWS9NTS9ERClcbi8vICAgaWNEOUNNX0NPREUgLyBpY0Q5Q01fQ09ERV9DTkFNRVxuLy8gICBvcklfVFlQRSAvIG9yaV90eXBlX25hbWUgICAoXCJJQ1x1NTM2MVx1OENDN1x1NjU5OVwiIC8gXCJcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTlcIikgXHUyMDE0IG9yaWdpbiwgTk9UIFx1OTU4MC9cdTYwMjUvXHU0RjRGXG4vLyAgIHBhcnRfQU1ULCBhcHBsX0RPVCwgXHUyMDI2ICAgKGJpbGxpbmcgXHUyMDE0IGRpc2NhcmRlZClcbi8vICAgcm9XX0lEICAgICAgICAgICAgICAgICAgZGV0YWlsIGtleSBmb3IgSUhLRTMzMDNTMDIgZmFuLW91dCAoUGhhc2UgQilcbi8vIFdlIGRvbid0IGhhdmUgdmlzaXQgY2xhc3MgKFx1OTU4MC9cdTYwMjUvXHU0RjRGKSBhdCB0aGUgbGlzdCBsZXZlbDsgdGhlIFMwMiBkZXRhaWxcbi8vIGhhcyBob3NwX0RBVEFfVFlQRV9OQU1FIChcIlx1ODk3Rlx1OTFBQlwiL1wiXHU0RTJEXHU5MUFCXCIvXCJcdTcyNTlcdTkxQUJcIikuIEZvciBub3cgZGVmYXVsdCBBTUIuXG4vL1xuLy8gUGhhcm1hY3kgcGlja3VwIGRldGVjdGlvbiBcdTIwMTQgTkhJIG1peGVzIHBoYXJtYWN5IGRpc3BlbnNlIGV2ZW50cyBpbnRvXG4vLyBJSEtFMzMwMyBhbG9uZ3NpZGUgY2xpbmljIHZpc2l0cywgd2l0aCBOTyBmaWVsZCBpbiB0aGlzIGVuZHBvaW50IHRoYXRcbi8vIGRpc3Rpbmd1aXNoZXMgdGhlbSAob25seSB0aGUgc2FtZSBcIklDXHU1MzYxXHU4Q0M3XHU2NTk5XCIvXCJcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTlcIiBzb3VyY2UgbGFiZWxcbi8vIGVpdGhlciB0eXBlIHVzZXMpLiBXaXRob3V0IGludGVydmVudGlvbiBTTUFSVCBhcHBzIHNlZSBhbiBFbmNvdW50ZXJcbi8vIHNoYXBlIGlkZW50aWNhbCB0byBjbGluaWMgdmlzaXRzIGFuZCBtdXN0IGd1ZXNzIGZyb20gaG9zcGl0YWwgbmFtZS5cbi8vIFR3byBzaWduYWxzIGF2YWlsYWJsZSwgYm90aCAxMDAlIGNvbmNvcmRhbnQgb24gb2JzZXJ2ZWQgZGF0YTpcbi8vICAgUFJJTUFSWSAgb3B0aW9ucy5waGFybWFjeT10cnVlIFx1MjAxNCBjYWxsZXIgcHJlLWJ1aWx0IGEgc2V0IG9mIHJvd19JRHNcbi8vICAgICAgICAgICAgdGhhdCBhcHBlYXJlZCBpbiBJSEtFMzMwNiAvIElIS0UzMzA3IHdpdGggb3JpX1RZUEVfTkFNRT1cbi8vICAgICAgICAgICAgXCJcdTg1RTVcdTVDNDBcIi4gQXV0aG9yaXRhdGl2ZTogdXNlcyBOSEkncyBvd24gY2xhc3NpZmljYXRpb24uXG4vLyAgIEZBTExCQUNLIGhvc1BfQUJCUiBtYXRjaGVzIC9cdTg1RTVcdTVDNDB8XHU4NUU1XHU2MjNGLyBcdTIwMTQgY292ZXJzIGNhc2VzIHdoZXJlIHRoZVxuLy8gICAgICAgICAgICBjcm9zcy1yZWYgd2Fzbid0IGJ1aWx0IChtZWRpY2F0aW9uIGZhbi1vdXQgdW5hdmFpbGFibGUgL1xuLy8gICAgICAgICAgICBzdGFuZGFsb25lIHRlc3QpIGFuZCB0aGUgZWRnZSBjYXNlIG9mIGEgcGhhcm1hY3kgZXZlbnRcbi8vICAgICAgICAgICAgd2l0aCBubyBhc3NvY2lhdGVkIGRydWcgcmVjb3JkLiBSZWxpYWJsZSBpbiBwcmFjdGljZVxuLy8gICAgICAgICAgICBiZWNhdXNlIFRhaXdhbiBOSEkgcGhhcm1hY3kgZGVzaWduYXRpb25zIGFsd2F5cyBpbmNsdWRlXG4vLyAgICAgICAgICAgIFx1ODVFNVx1NUM0MCBvciBcdTg1RTVcdTYyM0YgaW4gdGhlaXIgb2ZmaWNpYWwgbmFtZS5cbi8vIEVuY291bnRlci50eXBlIGVtaXRzIFRXTyBpbmRlcGVuZGVudCBkaW1lbnNpb25zICh2MC45LjIgXHUyMDE0IGJ1ZyByZXBvcnRcbi8vIGZyb20gU01BUlQgYXBwIGRldik6XG4vLyAgIFx1MjAyMiBraW5kICAgIFx1MjAxNCBcdTk1ODBcdThBM0EgLyBcdTYwMjVcdThBM0EgLyBcdTRGNEZcdTk2NjIgLyBcdTg1RTVcdTVDNDAgKGNsaW5pY2FsIHZpc2l0IGNsYXNzaWZpY2F0aW9uKVxuLy8gICBcdTIwMjIgY2hhbm5lbCBcdTIwMTQgSUNcdTUzNjFcdThDQzdcdTY1OTkgLyBcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTkgICAgICAgICAgIChOSEkgZGF0YSBvcmlnaW4pXG4vLyBQcmV2aW91c2x5IGJvdGggZ290IHNxdWFzaGVkIGludG8gYSBzaW5nbGUgdHlwZV9kaXNwbGF5IHN0cmluZywgc29cbi8vIHdoZW4gYSByb3cgYXJyaXZlZCBhcyBcdTMwMENcdTg1RTVcdTVDNDBcdTMwMER0aGUgY2hhbm5lbCBpbmZvIHdhcyBsb3N0LCBhbmQgd2hlbiBpdFxuLy8gYXJyaXZlZCBhcyBcdTMwMENJQ1x1NTM2MVx1OENDN1x1NjU5OVx1MzAwRHRoZSBraW5kIHdhcyBsb3N0LiBUaGUgbWFwcGVyIG5vdyBlbWl0c1xuLy8gdHlwZVswXT17dGV4dDpraW5kfSArIHR5cGVbMV09e3RleHQ6Y2hhbm5lbH0gcGVyIEZISVIncyB0eXBlIDAuLiouXG4vLyB0eXBlX2Rpc3BsYXkgaXMga2VwdCBvbiB0aGUgYWRhcHRlciBvdXRwdXQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbi8vIHdpdGggYW55dGhpbmcgdGhhdCBzdGlsbCByZWFkcyBpdCBkaXJlY3RseSAobWFwcGVyIG5vdyBwcmVmZXJzIHRoZVxuLy8gbmV3IGZpZWxkcyB3aGVuIHByZXNlbnQgYW5kIG9ubHkgZmFsbHMgYmFjayB0byB0eXBlX2Rpc3BsYXkpLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UoaXRlbSwgY2xhc3NIaW50LCBvcHRpb25zKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgLy8gaWNkOWNtX0NPREVfQ05BTUUgd3JhcHMgZWFjaCBoYWxmIGFzIFwiPGNvZGU+Lzx0ZXh0PlwiIFx1MjAxNCBzdHJpcCB0aGVcbiAgLy8gbGVhZGluZyBcIjxjb2RlPi9cIiBzbyBkb3duc3RyZWFtIGRvZXNuJ3QgZG91YmxlLXByaW50IHRoZSBjb2RlIHdoZW5cbiAgLy8gaXQgY29tcG9zZXMgXCI8Y29kZT4gPHRleHQ+XCIgaXRzZWxmIChjb3NtZXRpYzsgU01BUlQgYXBwIHNpZGUgcmVhZHNcbiAgLy8gLnJlYXNvbkNvZGVbMF0udGV4dCBhbmQgc2F3IFwiSTM1OSBJMzU5L05vbnJoZXVtYXRpYy4uLlwiIGJlZm9yZSkuXG4gIGNvbnN0IHN0cmlwSWNkUHJlZml4ID0gKHMpID0+IHMucmVwbGFjZSgvXltBLVowLTkuXStcXC9cXHMqLywgXCJcIik7XG4gIC8vIFBSSU1BUlkgSUNEIHNvdXJjZSBwcmVmZXJlbmNlOlxuICAvLyAgIDEuIG9wdGlvbnMucHJpbWFyeV9kaWFnbm9zaXMgKGZyb20gSUhLRTMzMDNTMDIgZGV0YWlsKSBcdTIwMTQgYWx3YXlzXG4gIC8vICAgICAgYmlsaW5ndWFsLiBDYWxsZXIgbG9va3MgdGhpcyB1cCB2aWEgX3ByaW1hcnlJY2RGcm9tUzAyRGV0YWlsLlxuICAvLyAgIDIuIFMwMSBsaXN0IHJvdydzIGljRDlDTV9DT0RFX0NOQU1FIFx1MjAxNCBzb21ldGltZXMgYmlsaW5ndWFsLFxuICAvLyAgICAgIHNvbWV0aW1lcyBDaGluZXNlLW9ubHkgZGVwZW5kaW5nIG9uIHBhdGllbnQgLyBlbmNvdW50ZXIuXG4gIC8vIFMwMi1zb3VyY2VkIHdpbnMgYmVjYXVzZSBJSEtFMzMwM1MwMSBzaGlwcyBDaGluZXNlLW9ubHkgZm9yIHNvbWVcbiAgLy8gcGF0aWVudHMsIHdoaWNoIHVzZWQgdG8gbGVhdmUgRW5jb3VudGVyLnJlYXNvbkNvZGVbMF0uY29kaW5nWzBdXG4gIC8vIC5kaXNwbGF5IGluIFx1NEUyRFx1NjU4NyAod3JvbmcgYXVkaWVuY2UgXHUyMDE0IHRoYXQgZmllbGQgaXMgdGhlIGNsaW5pY2FsXG4gIC8vIEVuZ2xpc2ggcGVyIHRoZSB2MC44LjAgYmlsaW5ndWFsIGNvbnRyYWN0KS5cbiAgY29uc3QgczAyUHJpbWFyeSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wcmltYXJ5X2RpYWdub3NpcztcbiAgY29uc3QgaWNkQ29kZSA9XG4gICAgKHMwMlByaW1hcnkgJiYgczAyUHJpbWFyeS5jb2RlKSB8fFxuICAgIGl0ZW0uaWNEOUNNX0NPREUgfHxcbiAgICBpdGVtLmljZDljbV9DT0RFIHx8XG4gICAgaXRlbS5pY2Q5Y21fY29kZSB8fFxuICAgIFwiXCI7XG4gIGxldCBpY2ROYW1lLCBpY2ROYW1lX3poO1xuICBpZiAoczAyUHJpbWFyeSAmJiAoczAyUHJpbWFyeS5uYW1lX2VuIHx8IHMwMlByaW1hcnkubmFtZV96aCkpIHtcbiAgICBpY2ROYW1lID0gczAyUHJpbWFyeS5uYW1lX2VuIHx8IHMwMlByaW1hcnkubmFtZV96aDtcbiAgICBpY2ROYW1lX3poID0gczAyUHJpbWFyeS5uYW1lX3poIHx8IHMwMlByaW1hcnkubmFtZV9lbjtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCByYXdJY2ROYW1lID1cbiAgICAgIGl0ZW0uaWNEOUNNX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9uYW1lIHx8IFwiXCI7XG4gICAgaWNkTmFtZSA9IHN0cmlwSWNkUHJlZml4KHBpY2tFbmdsaXNoKHJhd0ljZE5hbWUpKTtcbiAgICBpY2ROYW1lX3poID0gc3RyaXBJY2RQcmVmaXgocGlja0NoaW5lc2UocmF3SWNkTmFtZSkpO1xuICB9XG4gIGNvbnN0IGhvc3BpdGFsID0gaXRlbS5ob3NQX0FCQlIgfHwgaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIjtcbiAgY29uc3QgaXNQaGFybWFjeSA9XG4gICAgKG9wdGlvbnMgJiYgb3B0aW9ucy5waGFybWFjeSA9PT0gdHJ1ZSkgfHwgL1x1ODVFNVx1NUM0MHxcdTg1RTVcdTYyM0YvLnRlc3QoaG9zcGl0YWwpO1xuICAvLyBjbGFzcyBkZWZhdWx0cyB0byBBTUI7IElIS0UzMzAzUzAyIGRldGFpbCBmYW4tb3V0IG1heSBvdmVycmlkZSB0b1xuICAvLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUgKFx1NjAyNVx1OEEzQSAvIFx1NEY0Rlx1OTY2MikuXG4gIC8vIERlcml2ZSAoa2luZCwgY2hhbm5lbCkgaW5kZXBlbmRlbnRseSBcdTIwMTQgc2VlIGhlYWRlciBjb21tZW50LlxuICAvLyBraW5kIGlzIHRoZSB2aXNpdCBjbGFzc2lmaWNhdGlvbiAoXHU5NTgwXHU4QTNBL1x1NjAyNVx1OEEzQS9cdTRGNEZcdTk2NjIvXHU4NUU1XHU1QzQwKTtcbiAgLy8gY2hhbm5lbCBpcyB0aGUgTkhJIGRhdGEgb3JpZ2luIChJQ1x1NTM2MVx1OENDN1x1NjU5OS9cdTc1MzNcdTU4MzFcdThDQzdcdTY1OTkpLlxuICBjb25zdCBfY2hhbm5lbCA9IGl0ZW0ub3JpX3R5cGVfbmFtZSB8fCBpdGVtLm9ySV9UWVBFX05BTUUgfHwgXCJcIjtcbiAgY29uc3QgX2tpbmQgPSBpc1BoYXJtYWN5XG4gICAgPyBcIlx1ODVFNVx1NUM0MFwiXG4gICAgOiBjbGFzc0hpbnQgPT09IFwiRU1FUlwiXG4gICAgICA/IFwiXHU2MDI1XHU4QTNBXCJcbiAgICAgIDogY2xhc3NIaW50ID09PSBcIklNUFwiXG4gICAgICAgID8gXCJcdTRGNEZcdTk2NjJcIlxuICAgICAgICA6IFwiXHU5NTgwXHU4QTNBXCI7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBlbmRfZGF0ZTogXCJcIixcbiAgICBjbGFzczogY2xhc3NIaW50IHx8IFwiQU1CXCIsXG4gICAga2luZDogX2tpbmQsXG4gICAgY2hhbm5lbDogX2NoYW5uZWwsXG4gICAgLy8gTGVnYWN5IHNpbmdsZS1zdHJpbmcgZmllbGQuIFRoZSBtYXBwZXIgbm93IHJlYWRzIGtpbmQgKyBjaGFubmVsXG4gICAgLy8gYW5kIGlnbm9yZXMgdGhpcyB3aGVuIGVpdGhlciBpcyBzZXQ7IGtlcHQgaGVyZSBzbyBleHRlcm5hbFxuICAgIC8vIGNvbnN1bWVycyB0aGF0IGdyZXAgdGhlIGFkYXB0ZXIgb3V0cHV0IGRvbid0IHN1ZGRlbmx5IGJyZWFrLlxuICAgIHR5cGVfZGlzcGxheTogaXNQaGFybWFjeSA/IFwiXHU4NUU1XHU1QzQwXCIgOiBfY2hhbm5lbCxcbiAgICBkZXBhcnRtZW50OiBcIlwiLFxuICAgIHByb3ZpZGVyOiBcIlwiLFxuICAgIC8vIEVuZ2xpc2ggcmVhc29uIChjbGluaWNhbCkgYW5kIENoaW5lc2UgcmVhc29uIChwYXRpZW50LWZhY2luZykgYXJlXG4gICAgLy8gc291cmNlZCBmcm9tIHRoZSBzYW1lIGJpbGluZ3VhbCBOSEkgZmllbGQ7IG1hcHBlciBwbGFjZXMgRW5nbGlzaFxuICAgIC8vIGludG8gcmVhc29uQ29kZVswXS5jb2RpbmdbMF0uZGlzcGxheSBhbmQgQ2hpbmVzZSBpbnRvIC50ZXh0LlxuICAgIHJlYXNvbjogaWNkTmFtZSA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lfWAgOiBpY2ROYW1lKSA6IFwiXCIsXG4gICAgcmVhc29uX3poOiBpY2ROYW1lX3poID8gKGljZENvZGUgPyBgJHtpY2RDb2RlfSAke2ljZE5hbWVfemh9YCA6IGljZE5hbWVfemgpIDogXCJcIixcbiAgICByZWFzb25fY29kZTogaWNkQ29kZSxcbiAgICAvLyBTZWNvbmRhcnkgZGlhZ25vc2VzIChcdTZCMjFcdThBM0FcdTY1QjcpIGNvbWUgZnJvbSBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dFxuICAgIC8vIFx1MjAxNCBsaXN0IGVuZHBvaW50IG9ubHkgZXhwb3NlcyB0aGUgcHJpbWFyeSBJQ0QuIFRoZSBtYXBwZXIgYXBwZW5kc1xuICAgIC8vIG9uZSBFbmNvdW50ZXIucmVhc29uQ29kZVtdIGVudHJ5IHBlciBzZWNvbmRhcnksIHByZXNlcnZpbmcgb3JkZXJcbiAgICAvLyAocHJpbWFyeSBmaXJzdCwgdGhlbiBcdTZCMjFcdThBM0FcdTY1QjcxLCAyLCAzLCAuLi4gdXAgdG8gNCBvYnNlcnZlZCBpbiBsaXZlXG4gICAgLy8gTkhJIGRhdGEpLiBFbXB0eSBhcnJheSB3aGVuIGNhbGxlciBkaWRuJ3QgZmV0Y2ggZGV0YWlsIG9yIE5ISVxuICAgIC8vIHJldHVybmVkIG5vIHNlY29uZGFyaWVzLlxuICAgIHNlY29uZGFyeV9kaWFnbm9zZXM6XG4gICAgICBvcHRpb25zICYmIEFycmF5LmlzQXJyYXkob3B0aW9ucy5zZWNvbmRhcnlfZGlhZ25vc2VzKVxuICAgICAgICA/IG9wdGlvbnMuc2Vjb25kYXJ5X2RpYWdub3Nlc1xuICAgICAgICA6IFtdLFxuICAgIGhvc3BpdGFsLFxuICAgIC8vIFBhc3MgdGhyb3VnaCBmb3IgdGhlIGV2ZW50dWFsIElIS0UzMzAzUzAyIGRldGFpbCBmZXRjaCAoUGhhc2UgQikuXG4gICAgcm93X2lkOiBpdGVtLnJvV19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzIwM1MwMSAoXHU3NUFCXHU4MkQ3IC8gXHU5ODEwXHU5NjMyXHU2M0E1XHU3QTJFXHU3RDAwXHU5MzA0KSBcdTIwMTQgZmxhdCBsaXN0IGVuZHBvaW50LCByZXNwb25zZSBzaGFwZTpcbi8vICAgc1BfSUhLRTMyMDNTMDE6IFtcbi8vICAgICB7IHJvd251bSwgaW5vY3VsYXRFX0Q6IFwiMTEyLzEyLzI3XCIgKFx1NkMxMVx1NTcwQiksIGNvZEVfQ05BTUU6IFx1NEUyRFx1NjU4N1x1NzVBQlx1ODJEN1x1NTQwRCxcbi8vICAgICAgIGhvc1BfQUJCUjogXHU2M0E1XHU3QTJFXHU5NjYyXHU2MjQwLCBzb3VyY2U6IFwiXHU3NUJFXHU3NUM1XHU3QkExXHU1MjM2XHU3RjcyXCIgfVxuLy8gICBdXG4vL1xuLy8gTkhJIHNoaXBzIENoaW5lc2Utb25seSBvbiBgY29kRV9DTkFNRWAgKG5vIGJpbGluZ3VhbCBgfHxgIGhlcmUpLiBGb3Jcbi8vIENPVklELTE5IHZhY2NpbmVzIE5ISSBidW5kbGVzIHRoZSBsb3QgbnVtYmVyIGludG8gdGhlIG5hbWU6XG4vLyAgIFwiXHU4RjFEXHU3NDVFL0JOVCBDT1ZJRC0xOVx1NzVBQlx1ODJENyhcdTYyNzlcdTg2NUYxSTA3MEEpXCJcbi8vICAgXCJcdTgzQUJcdTVGQjdcdTdEMERTcGlrZXZheFx1OTZEOVx1NTBGOVx1NzVBQlx1ODJENyhPL09fQkEuMSkoXHU2Mjc5XHU4NjVGMDM1RTIyQSlcIlxuLy8gICBcIkNPVklELTE5XHU3NUFCXHU4MkQ3KEFzdHJhWmVuZWNhKShcdTYyNzlcdTg2NUZEMDA2QSlcIlxuLy9cbi8vIEFkYXB0ZXIgc3BsaXRzIFwiKFx1NjI3OVx1ODY1RlhYWFgpXCIgaW50byBhIHNlcGFyYXRlIGxvdF9udW1iZXIgZmllbGQgc28gdGhlXG4vLyBGSElSIG1hcHBlciBjYW4gcG9wdWxhdGUgSW1tdW5pemF0aW9uLmxvdE51bWJlciBhbmQgdGhlIGRpc3BsYXllZFxuLy8gdmFjY2luZSBuYW1lIHN0YXlzIGNsZWFuLiBJbmZsdWVuemEgKFwiXHU2RDQxXHU2MTFGXHU3NUFCXHU4MkQ3XCIpIGhhcyBubyBiYXRjaFxuLy8gc3VmZml4IFx1MjAxNCBsb3RfbnVtYmVyIGVuZHMgdXAgZW1wdHksIG1hcHBlciBvbWl0cyB0aGUgZmllbGQuXG4vL1xuLy8gc3RhdHVzOiBJbW11bml6YXRpb24gcmVjb3JkcyBvbiBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgYXJlIHBvc3QtYWRtaW5pc3RyYXRpb24gb25seVxuLy8gKE5ISSBkb2Vzbid0IHNob3cgcGxhbm5lZCAvIG5vdC1naXZlbiB2YWNjaW5lcyksIHNvIHRoZSBtYXBwZXJcbi8vIGhhcmRjb2RlcyBJbW11bml6YXRpb24uc3RhdHVzID0gXCJjb21wbGV0ZWRcIi5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltbXVuaXphdGlvbihpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmlub2N1bGF0RV9EIHx8IGl0ZW0uaW5vY3VsYXRlX2QgfHwgXCJcIik7XG4gIGNvbnN0IHJhd05hbWUgPSBTdHJpbmcoaXRlbS5jb2RFX0NOQU1FIHx8IGl0ZW0uY29kZV9jbmFtZSB8fCBcIlwiKS50cmltKCk7XG4gIGlmICghZGF0ZSB8fCAhcmF3TmFtZSkgcmV0dXJuIG51bGw7XG4gIC8vIEV4dHJhY3QgdGhlIExBU1QgKFx1NjI3OVx1ODY1RlhYWCkgb2NjdXJyZW5jZTsgc29tZSB2YWNjaW5lcyBoYXZlIG11bHRpcGxlXG4gIC8vIHBhcmVucyBsaWtlIFwiKE8vT19CQS4xKShcdTYyNzlcdTg2NUYwMzVFMjJBKVwiIFx1MjAxNCBvbmx5IHRoZSBcdTYyNzlcdTg2NUYgb25lIGlzIHRoZSBsb3QuXG4gIGNvbnN0IGxvdE1hdGNoID0gcmF3TmFtZS5tYXRjaCgvW1x1RkYwOChdXFxzKlx1NjI3OVx1ODY1RlxccyooW14pXHVGRjA5XSs/KVxccypbKVx1RkYwOV0vKTtcbiAgY29uc3QgbG90TnVtYmVyID0gbG90TWF0Y2ggPyBsb3RNYXRjaFsxXS50cmltKCkgOiBcIlwiO1xuICBjb25zdCBjbGVhbk5hbWUgPSByYXdOYW1lXG4gICAgLnJlcGxhY2UoL1tcdUZGMDgoXVxccypcdTYyNzlcdTg2NUZcXHMqW14pXHVGRjA5XStcXHMqWylcdUZGMDldLywgXCJcIilcbiAgICAudHJpbSgpO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgdmFjY2luZV9uYW1lOiBjbGVhbk5hbWUgfHwgcmF3TmFtZSxcbiAgICBsb3RfbnVtYmVyOiBsb3ROdW1iZXIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gTkhJJ3Mgc291cmNlLW9mLXJlY29yZCBtYXJrZXI7IHByZXNlcnZlZCBvbiB0aGUgcmVzb3VyY2UgYXNcbiAgICAvLyBwZXJmb3JtZXItb3JnIGNvbnRleHQgKFx1NzVCRVx1NzVDNVx1N0JBMVx1NTIzNlx1N0Y3MiA9IFRhaXdhbiBDREMpLlxuICAgIHNvdXJjZTogaXRlbS5zb3VyY2UgfHwgXCJcIixcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0QWxsZXJneShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGFsbGVyZ2VuID1cbiAgICBpdGVtLmFsbGVyZ2VuX25hbWUgfHwgaXRlbS5hbGxlUl9OQU1FIHx8IGl0ZW0ubWVkbmFtZSB8fFxuICAgIGl0ZW0uZHJ1R19OQU1FIHx8IGl0ZW0uYWxsZXJnZW4gfHwgXCJcIjtcbiAgaWYgKCFhbGxlcmdlbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5yZWNvckRfREFURSB8fCBcIlwiKSxcbiAgICBkaXNwbGF5OiBhbGxlcmdlbixcbiAgICBjYXRlZ29yeTogXCJtZWRpY2F0aW9uXCIsXG4gICAgY3JpdGljYWxpdHk6IFwidW5hYmxlLXRvLWFzc2Vzc1wiLFxuICAgIHJlYWN0aW9uOiBpdGVtLnJlYWN0aW9OIHx8IGl0ZW0uc3ltcHRvbSB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwMVMwNSAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBsaXN0KSBpcyBtZXRhZGF0YS1vbmx5OlxuLy8gICB7aG9zcF9pZCwgaG9zcF9hYmJyLCBob3NwX3VybCwgb3JpX3R5cGVfbmFtZSwgb3JpX3R5cGUsIGZ1bmNfZGF0ZSxcbi8vICAgIG91dF9kYXRlLCBpY2Q5Y21fY29kZSwgaWNkOWNtX2NvZGVfY25hbWUsIG9wX2NvZGVfY25hbWUsIHJvd19pZH1cbi8vIE5vIHByb2NlZHVyZSBDT0RFIChJQ0QtMTAtUENTKSBhbmQgbm8gYWN0dWFsIGV4YW0tZGF0ZS4gVGhlIHByb2NlZHVyZVxuLy8gQ09ERSArIGV4ZV9TX0RBVEUgb25seSBzaG93IHVwIG9uIHRoZSBJSEtFMzMwOFMwMiBkZXRhaWwgZW5kcG9pbnRcbi8vIChhbmFsb2dvdXMgdG8gSUhLRTM0MDhTMDEgaW1hZ2luZyBsaXN0IFx1MjE5MiBTMDIgZGV0YWlsKS4gV2UgZG8gYSAyLXN0ZXBcbi8vIGZhbi1vdXQgZnJvbSB0aGUgbGlzdCdzIHJvd19JRDsgdGhlIGxpc3QgYWRhcHRlciB0aGVyZWZvcmUgcmV0dXJuc1xuLy8gbnVsbCBhbmQgdGhlIHJlYWwgd29yayBoYXBwZW5zIGluIGFkYXB0UHJvY2VkdXJlRnJvbURldGFpbCBiZWxvdy5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFByb2NlZHVyZUxpc3RTdHViKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBJSEtFMzMwOFMwMiAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBkZXRhaWwpIHNoYXBlIChwZXIgcm93IGluIGloa2UzMzA4UzAyX21haW5fZGF0YSk6XG4vLyAgIHtyb3dpZCwgbWFpbl90aXQgKFwiMTA1LzA5LzIzIH4gMTA1LzA5LzI2XHVGRjVDXHU0RjRGXHU5NjYyXCIgb3IgXCIxMDUvMDEvMTRcdUZGNUNcdTk1ODBcdThBM0FcIiksXG4vLyAgICBob3NwX0lELCBob3NwX0FCQlIsIGhvc3BfdXJsLCBvcmlfVFlQRV9OQU1FLCBvcmlfVFlQRSxcbi8vICAgIGljZDljbV9DT0RFLCBpY2Q5Y21fQ09ERV9DTkFNRSwgICAgICAgICBcdTIxOTAgcmVhc29uIGZvciBwcm9jZWR1cmVcbi8vICAgIG9wX0NPREUsICAgIG9wX0NPREVfQ05BTUUsICAgICAgICAgICAgICBcdTIxOTAgSUNELTEwLVBDUyArIGJpbGluZ3VhbCBsYWJlbFxuLy8gICAgZnVuY19EQVRFLCBmdW5jX1NFUV9OTywgcGFydF9BTVQsIGFwcGxfRE9ULFxuLy8gICAgc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0OiBbe1xuLy8gICAgICAgZXhlX1NfREFURSAoXCJZWVkvTU0vRER8fFlZWVkvTU0vRERcIiksICBcdTIxOTAgYWN0dWFsIGV4ZWN1dGlvbiBkYXRlXG4vLyAgICAgICBvcmRlcl9DT0RFX05BTUUgKGJpbGluZ3VhbCksICAgICAgICAgICBcdTIxOTAgTkhJIGJpbGxpbmctaXRlbSBuYW1lXG4vLyAgICAgICBvcmRlcl9DT0RFLCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTIxOTAgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQ1xuLy8gICAgfSwgLi4uXX1cbi8vXG4vLyBEYXRlIGZpZWxkIGNob2ljZSBcdTIwMTQgSUhLRTMzMDhTMDIgZGV0YWlsIGV4cG9zZXM6XG4vLyAgIC0gc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0W10uZXhlX1NfREFURSBcdTIwMTQgXHU1N0Y3XHU4ODRDXHU4RDc3XHU1OUNCXHU2NUU1OyB0aGlzIGlzIHRoZVxuLy8gICAgICAgICAgICAgICAgICAgICAgYWN0dWFsIGRheSB0aGUgcGF0aWVudCBoYWQgdGhlIHByb2NlZHVyZS4gRm9yXG4vLyAgICAgICAgICAgICAgICAgICAgICBpbnBhdGllbnQgcHJvY2VkdXJlcyAoYWRtaXQgTS8wMSwgc3VyZ2VyeSBNLzA1LFxuLy8gICAgICAgICAgICAgICAgICAgICAgZGlzY2hhcmdlIE0vMTApIGV4ZV9TX0RBVEUgPSBNLzA1IFx1MjAxNCBjb3JyZWN0LlxuLy8gICAtIGZ1bmNfREFURSAgICAgICBcdTIwMTQgb3JkZXIvdmlzaXQgYW5jaG9yIGRheSAoXHU5NTgwXHU4QTNBXHU5NThCXHU1NUFFXHU2NUU1IC8gXHU1MTY1XHU5NjYyXHU2NUU1KTtcbi8vICAgICAgICAgICAgICAgICAgICAgIHNhbWUgd3JvbmctYW5jaG9yIHBhdHRlcm4gYXMgaW1hZ2luZyBcdTIwMTQgdXNpbmcgaXRcbi8vICAgICAgICAgICAgICAgICAgICAgIGZvciBpbnBhdGllbnQgcHJvY2VkdXJlcyBzaGlmdHMgdGhlIGV4YW0gYmFja1xuLy8gICAgICAgICAgICAgICAgICAgICAgdG8gdGhlIGFkbWlzc2lvbiBkYXkuXG4vLyBGYWxsYmFjayBjaGFpbjogZmlyc3Qgc3ViLWxpc3QgZW50cnkncyBleGVfU19EQVRFIFx1MjE5MiBmdW5jX0RBVEUuXG4vL1xuLy8gRkhJUiBjb2Rpbmcgc3RyYXRlZ3k6XG4vLyAgIC0gUHJvY2VkdXJlLmNvZGUgY29kaW5nIHVzZXMgb3BfQ09ERSAoSUNELTEwLVBDUykgYXMgdGhlIHByaW1hcnlcbi8vICAgICBjb2RlZCB2YWx1ZSB3aXRoIHN5c3RlbT1pY2QtMTAtcGNzIFx1MjAxNCB3YXMgcHJldmlvdXNseSB0aGUgZW1wdHlcbi8vICAgICBzdHJpbmcgYmVjYXVzZSB0aGUgbGlzdCBlbmRwb2ludCBuZXZlciBjYXJyaWVzIGl0LlxuLy8gICAtIGljZDljbV9DT0RFICsgQ05BTUUgbWFwIHRvIGEgUmVhc29uOiBwcmVmaXggaW4gdGhlIG5vdGUgKHNhbWVcbi8vICAgICBwYXR0ZXJuIHRoZSBvbGQgYWRhcHRlciB1c2VkKSBzbyB0aGUgbWFwcGVyJ3MgXCJubyBub3RlIFx1MjE5MiBkcm9wXCJcbi8vICAgICBmaWx0ZXIga2VlcHMgYmVuaWduIHJvd3Mgb3V0IHdoaWxlIGxldHRpbmcgZ2VudWluZSBwcm9jZWR1cmVzXG4vLyAgICAgcGFzcy5cbi8vICAgLSBTdWItbGlzdCBlbnRyaWVzJyBvcmRlcl9DT0RFX05BTUUgKyBvcmRlcl9DT0RFIGdvIGludG8gdGhlIG5vdGVcbi8vICAgICBhcyBcdTY1QkRcdTRGNUM6IGxpbmVzIHNvIFNNQVJUIGFwcHMgY2FuIHNob3cgdGhlIE5ISSBiaWxsaW5nIGJyZWFrZG93bi5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFByb2NlZHVyZUZyb21EZXRhaWwoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBzdWJMaXN0ID0gQXJyYXkuaXNBcnJheShpdGVtLnNwX0lIS0UzMzA4UzA0X2RhdGFfbGlzdClcbiAgICA/IGl0ZW0uc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0XG4gICAgOiBbXTtcbiAgLy8gZXhlX1NfREFURSBmb3JtYXQgaXMgXCIxMTUvMDkvMjN8fDIwMjYvMDkvMjNcIjsgcm9jVG9JU08gYWxyZWFkeVxuICAvLyBtYXRjaGVzIHRoZSBmaXJzdCBST0Mgc2VnbWVudCwgc28gZmVlZGluZyB0aGUgd2hvbGUgc3RyaW5nIHdvcmtzLlxuICBjb25zdCBleGVEYXRlID0gc3ViTGlzdC5sZW5ndGggPiAwXG4gICAgPyAoc3ViTGlzdFswXS5leGVfU19EQVRFIHx8IHN1Ykxpc3RbMF0uZXhlX3NfZGF0ZSB8fCBcIlwiKVxuICAgIDogXCJcIjtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGV4ZURhdGUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgaXRlbS5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIC8vIG9wX0NPREVfQ05BTUUgaXMgXCI8Q09ERT4vPFx1NEUyRFx1NjU4Nz58fDxDT0RFPi88RW5nbGlzaD5cIi4gVGFrZSB0aGVcbiAgLy8gRW5nbGlzaCBoYWxmLCBzdHJpcCB0aGUgbGVhZGluZyBcIjxDT0RFPi9cIiBzbyB0aGUgZGlzcGxheSByZWFkc1xuICAvLyBsaWtlIFwiRXhjaXNpb24gb2YgTGVmdCBWaXRyZW91cywgUGVyY3V0YW5lb3VzIEFwcHJvYWNoXCIgcmF0aGVyXG4gIC8vIHRoYW4gXCIwOEI1M1paL0V4Y2lzaW9uIG9mIExlZnQgVml0cmVvdXNcdTIwMjZcIi5cbiAgY29uc3Qgb3BDb2RlID0gaXRlbS5vcF9DT0RFIHx8IGl0ZW0ub3BfY29kZSB8fCBcIlwiO1xuICBjb25zdCByYXdPcE5hbWUgPSBpdGVtLm9wX0NPREVfQ05BTUUgfHwgaXRlbS5vcF9jb2RlX2NuYW1lIHx8IFwiXCI7XG4gIGNvbnN0IG9wTmFtZSA9IHBpY2tFbmdsaXNoKHJhd09wTmFtZSk7XG4gIGNvbnN0IG9wTmFtZV96aCA9IHBpY2tDaGluZXNlKHJhd09wTmFtZSk7XG4gIGNvbnN0IHN0cmlwQ29kZSA9IChzKSA9PiAocyB8fCBcIlwiKS5yZXBsYWNlKC9eW0EtWjAtOV0rXFwvLywgXCJcIikudHJpbSgpO1xuICBjb25zdCBkaXNwbGF5ID0gc3RyaXBDb2RlKG9wTmFtZSkgfHwgb3BOYW1lLnRyaW0oKTtcbiAgY29uc3QgZGlzcGxheV96aCA9IHN0cmlwQ29kZShvcE5hbWVfemgpO1xuICBpZiAoIWRhdGUgfHwgIWRpc3BsYXkpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHJlYXNvbkNvZGUgPSBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgcmVhc29uTmFtZSA9XG4gICAgKHBpY2tFbmdsaXNoKGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fY29kZV9jbmFtZSB8fCBcIlwiKSB8fCBcIlwiKVxuICAgICAgLnJlcGxhY2UoL15bQS1aMC05XStcXC8vLCBcIlwiKVxuICAgICAgLnRyaW0oKTtcbiAgY29uc3Qgbm90ZVBhcnRzID0gW107XG4gIGlmIChyZWFzb25OYW1lKSB7XG4gICAgbm90ZVBhcnRzLnB1c2gocmVhc29uQ29kZSA/IGBSZWFzb246ICR7cmVhc29uQ29kZX0gJHtyZWFzb25OYW1lfWAgOiBgUmVhc29uOiAke3JlYXNvbk5hbWV9YCk7XG4gIH1cbiAgZm9yIChjb25zdCBzdWIgb2Ygc3ViTGlzdCkge1xuICAgIGNvbnN0IHN1Yk5hbWUgPSBwaWNrRW5nbGlzaChzdWIub3JkZXJfQ09ERV9OQU1FIHx8IHN1Yi5vcmRlcl9jb2RlX25hbWUgfHwgXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHN1YkNvZGUgPSBzdWIub3JkZXJfQ09ERSB8fCBzdWIub3JkZXJfY29kZSB8fCBcIlwiO1xuICAgIGlmIChzdWJOYW1lKSB7XG4gICAgICBub3RlUGFydHMucHVzaChzdWJDb2RlID8gYFx1NjVCRFx1NEY1QzogJHtzdWJOYW1lfSAoTkhJICR7c3ViQ29kZX0pYCA6IGBcdTY1QkRcdTRGNUM6ICR7c3ViTmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogb3BDb2RlLFxuICAgIC8vIEhpbnQgZm9yIG1hcFByb2NlZHVyZS5tYXBTeXN0ZW0gXHUyMDE0IFwiaWNkLTEwLXBjc1wiIHN0cmluZyBjb250YWluc1xuICAgIC8vIFwiaWNkXCIsIHNvIHRoZSBtYXBwZXIgYXNzaWducyBzeXN0ZW1zLklDRF8xMF9QQ1MuXG4gICAgc3lzdGVtOiBvcENvZGUgPyBcImljZC0xMC1wY3NcIiA6IFwiXCIsXG4gICAgZGlzcGxheSxcbiAgICBkaXNwbGF5X3poLFxuICAgIG5vdGU6IG5vdGVQYXJ0cy5qb2luKFwiIC8gXCIpLFxuICAgIGJvZHlfc2l0ZTogXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTM0MDhTMDEgKFx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNSBsaXN0KSBzaGFwZTpcbi8vICAge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIHJlYWxfSU5TUEVDVF9EQVRFLCBvcmRlcl9DT0RFLFxuLy8gICAgb3JkZXJfQ09ERV8yV29yZCwgb3JkZXJfTkFNRSwgb3JpX1RZUEUsIHJvd19JRCwganBHX1NUQVRVUywgLi4ufVxuLy8gTm8gZmluZGluZ3MvY29uY2x1c2lvbiBcdTIwMTQgbGlzdCBpcyBvcmRlci1sZXZlbCBvbmx5LiBXZSBtYXAgdG8gUHJvY2VkdXJlXG4vLyAoYW4gZXhhbSB3YXMgcGVyZm9ybWVkKSByYXRoZXIgdGhhbiBEaWFnbm9zdGljUmVwb3J0ICh3aGljaCBuZWVkcyBhXG4vLyBuYXJyYXRpdmUpLiBJZi93aGVuIHdlIGZldGNoIHRoZSBhY3R1YWwgcmVwb3J0IHRoaXMgYmVjb21lcyBhIERSLlxuLy8gSUhLRTM0MDhTMDIgZGV0YWlsIHByb3ZpZGVzIHRoZSBmdWxsIHJhZGlvbG9neSAvIGVuZG9zY29weSByZXBvcnQgaW5cbi8vIGBkZXNjYC4gQ29tYmluZWQgd2l0aCBvcmRlcl9OQU1FICsgdGhlIGV4YW0gZGF0ZSB0aGlzIGlzIGEgcHJvcGVyIEZISVJcbi8vIERpYWdub3N0aWNSZXBvcnQuIExpc3Qtb25seSBlbnRyaWVzICh3aGVyZSB0aGUgZGV0YWlsIGZldGNoIHJldHVybmVkXG4vLyBubyBgZGVzY2ApIGdldCBkcm9wcGVkIFx1MjAxNCB3aXRob3V0IGEgbmFycmF0aXZlIHRoZSByZXBvcnQgbWFwcGVyIHdvdWxkXG4vLyByZWplY3QgdGhlbSBhbnl3YXkuXG4vL1xuLy8gRGF0ZSBmaWVsZCBjaG9pY2UgXHUyMDE0IElIS0UzNDA4UzAyIGRldGFpbCBwYXlsb2FkIGV4cG9zZXMgKGluIG9yZGVyXG4vLyBvZiBhY2N1cmFjeSBmb3IgXCJ3aGVuIGRpZCB0aGUgcGF0aWVudCBhY3R1YWxseSBoYXZlIHRoZSBleGFtXCIpOlxuLy8gICAtIHJlYWxfSU5TUEVDVF9EQVRFICBcdTVCRTZcdTk2OUJcdTYzQTFcdTZBQTIvXHU1MDVBXHU1RjcxXHU1MENGXHU2NUU1IFx1MjAxNCBtb3N0IGFjY3VyYXRlIGJ1dCBOSElcbi8vICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9ubHkgc2hpcHMgdGhpcyBhcyBudWxsIG9uIFMwMiBkZXRhaWxcbi8vICAgLSBtYWluX3RpdCAgICAgICAgICAgXHU3QzNEXHU2NTM2XHU2NUU1IFx1MjAxNCB0aGUgY2FyZCdzIHByb21pbmVudCBoZWFkZXIgZGF0ZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICBpbiBOSEkncyBvd24gVUkuIFNlbWFudGljYWxseSB0aGlzIGlzIHdoZW5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV4YW0gd2FzIHBlcmZvcm1lZCBhbmQgc2lnbmVkIG9mZiAoTk9UXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBvcmRlciBkYXkpLiBDbG9zZXN0IHByb3h5IHdoZW5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgcmVhbF9JTlNQRUNUX0RBVEUgaXMgbnVsbC5cbi8vICAgLSBmdW5jX0RBVEUgICAgICAgICAgXHU5NTgwXHU4QTNBXHU5NThCXHU1NUFFXHU2NUU1IChPUEQpIC8gXHU1MTY1XHU5NjYyXHU2NUU1IChpbnBhdGllbnQpIFx1MjAxNCB0aGVcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZSB0aGUgb3JkZXIgd2FzIHdyaXR0ZW4sIE5PVCB0aGUgZGF0ZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXhhbSBoYXBwZW5lZC4gRm9yIE9QRCBpbWFnaW5nIHRoYXQgaXNcbi8vICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVkIGxhdGVyIChlLmcuIGVjaG8gb3JkZXJlZCAxLzMxLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBkb25lIDIvMjkpIHVzaW5nIGZ1bmNfREFURSBzaGlmdHMgdGhlIGV4YW1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgYmFjayB0byB0aGUgb3JkZXIgZGF5IFx1MjAxNCB3cm9uZy5cbi8vICAgLSBhc3NheV9VUExPQURfREFURSAgTkhJIFx1NjUzNlx1NkE5NFx1NjY0Mlx1OTU5MyBcdTIwMTQgaW50ZXJuYWwgZGF0YS1waXBlbGluZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA7IGJlbG9uZ3MgdG8gRGlhZ25vc3RpY1JlcG9ydC5pc3N1ZWQuXG4vLyBGYWxsYmFjayBjaGFpbjogcmVhbF9JTlNQRUNUX0RBVEUgXHUyMTkyIG1haW5fdGl0IFx1MjE5MiBmdW5jX0RBVEUuIG1haW5fdGl0XG4vLyBnb2VzIGFib3ZlIGZ1bmNfREFURSBiZWNhdXNlIG1haW5fdGl0IElTIHdoYXQgTkhJIGl0c2VsZiBkaXNwbGF5c1xuLy8gdG8gdGhlIHBhdGllbnQgYXMgXCJ0aGlzIHJlcG9ydCdzIGRhdGVcIiBhbmQgcmVmbGVjdHMgdGhlIHNpZ24tb2ZmIC9cbi8vIGV4YW0gZGF5LiBmdW5jX0RBVEUgcmVtYWlucyBhcyBsYXN0IHJlc29ydCBzbyBhIG1hbGZvcm1lZCByb3dcbi8vIHdpdGhvdXQgbWFpbl90aXQgc3RpbGwgcHJvZHVjZXMgc29tZSBkYXRlIGluc3RlYWQgb2YgYmVpbmcgZHJvcHBlZC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKFxuICAgIGl0ZW0ucmVhbF9JTlNQRUNUX0RBVEUgfHwgaXRlbS5yZWFsX2luc3BlY3RfZGF0ZSB8fFxuICAgIGl0ZW0ubWFpbl90aXQgfHwgaXRlbS5tYWluX1RJVCB8fFxuICAgIGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIsXG4gICk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChpdGVtLm9yZGVyX05BTUUgfHwgaXRlbS5vcmRlcl9uYW1lIHx8IFwiXCIpO1xuICBjb25zdCBjb25jbHVzaW9uID0gKGl0ZW0uZGVzYyB8fCBcIlwiKS50cmltKCk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSB8fCAhY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBpdGVtLm9yZGVyX0NPREUgfHwgaXRlbS5vcmRlcl9jb2RlIHx8IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgY2F0ZWdvcnk6IFwiUkFEXCIsXG4gICAgY29uY2x1c2lvbixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAvLyBOSEkgc2VwYXJhdGVzIHRoZSBleGFtIGRhdGUgKGZ1bmNfREFURSkgZnJvbSB0aGUgcmVwb3J0LXVwbG9hZFxuICAgIC8vIHRpbWVzdGFtcCAoYXNzYXlfVVBMT0FEX0RBVEUpLiBUaGUgbGF0dGVyIGlzIHdoZW4gdGhlIHJlcG9ydFxuICAgIC8vIHdhcyBmaW5hbGlzZWQgaW4gTkhJJ3Mgc3lzdGVtIFx1MjAxNCBtYXBzIHRvIERpYWdub3N0aWNSZXBvcnQuaXNzdWVkLlxuICAgIC8vIEZhbGxzIGJhY2sgdG8gTm9uZSBpZiBOSEkgZGlkbid0IHNoaXAgb25lLlxuICAgIGlzc3VlZDogcm9jVG9JU08oKGl0ZW0uYXNzYXlfVVBMT0FEX0RBVEUgfHwgXCJcIikuc3BsaXQoL1xccysvKVswXSksXG4gIH07XG59XG4iLCAiLy8gTkhJIEFQSSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgd2hhdCB3ZSBmZXRjaCwgd2hlcmUgZWFjaCByb3cgZ29lcyxcbi8vIHdoaWNoIGFkYXB0ZXIgdG8gY2FsbCBvbiBpdC5cbi8vXG4vLyBFeHRyYWN0ZWQgZnJvbSBiYWNrZ3JvdW5kLmpzIHNvIHdlIGNhbjpcbi8vICAgMS4gVW5pdC10ZXN0IFwiZXZlcnkgZW5kcG9pbnQgbmFtZSBoYXMgYSBDaGluZXNlIGxhYmVsXCIgXHUyMDE0IGhpc3RvcmljYWxseVxuLy8gICAgICBpdCB3YXMgZWFzeSB0byBhZGQgYSBuZXcgZW5kcG9pbnQgYW5kIGZvcmdldCB0byB1cGRhdGVcbi8vICAgICAgRU5EUE9JTlRfTEFCRUxfWkgsIGxlYXZpbmcgdGhlIHBvcHVwJ3MgXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwIHJvdyBsYWJlbGxlZCB3aXRoXG4vLyAgICAgIHRoZSBkZXYtZmxhdm91cmVkIHJhdyBrZXkgKFwib3RoZXJfbGFic1wiIGluc3RlYWQgb2YgXCJcdTZBQTJcdTlBNTdcIikuXG4vLyAgIDIuIEtlZXAgYmFja2dyb3VuZC5qcyBmb2N1c2VkIG9uIGZsb3cgY29udHJvbCArIHRhYi9JTyBsb2dpYy5cbi8vXG4vLyBBZGFwdGVyIHJlZmVyZW5jZXMgbGl2ZSBpbiAuL25oaS1hZGFwdGVycy5qcy4gU2VlIHRoYXQgbW9kdWxlIGZvciB0aGVcbi8vIHBlci1hZGFwdGVyIGZpZWxkLXByaW9yaXR5IGRlY2lzaW9ucyAoZGF0ZSBzZWxlY3Rpb24sIG5hbWUgZmFsbGJhY2tzLFxuLy8gYmlsaW5ndWFsIHNwbGl0dGluZywgZXRjLikuXG5cbmltcG9ydCB7XG4gIGFkYXB0QWR1bHRQcmV2ZW50aXZlLFxuICBhZGFwdEFsbGVyZ3ksXG4gIGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyxcbiAgYWRhcHRDaHJvbmljTGlzdFN0dWIsXG4gIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsXG4gIGFkYXB0SW1hZ2luZ0xpc3RTdHViLFxuICBhZGFwdEltbXVuaXphdGlvbixcbiAgYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIsXG4gIGFkYXB0TGFiSXRlbSxcbiAgYWRhcHRNZWRpY2F0aW9uLFxuICBhZGFwdFByb2NlZHVyZUxpc3RTdHViLFxufSBmcm9tIFwiLi9uaGktYWRhcHRlcnMuanNcIjtcblxuLy8gVXNlci1mYWNpbmcgbGFiZWwgZm9yIGVhY2ggZW5kcG9pbnQgbmFtZS4gVGhlIGJyZWFrZG93biBjb2xsYXBzaWJsZVxuLy8gaW4gdGhlIHBvcHVwIChcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiKSByZWFkcyBmcm9tIHRoaXMgc28gdXNlcnMgc2VlIFwiXHU1QzMxXHU5MUFCIDEyIFx1N0I0NlwiXG4vLyBpbnN0ZWFkIG9mIHRoZSBkZXYtZmxhdm91cmVkIFwiZW5jb3VudGVycz0xMi8xMlwiLiBVbmtub3duIG5hbWVzIGZhbGxcbi8vIHRocm91Z2ggdG8gdGhlIHJhdyBrZXksIHdoaWNoIGtlZXBzIGl0IG9idmlvdXMgZHVyaW5nIGRldmVsb3BtZW50XG4vLyB3aGVuIHdlIGFkZCBhIG5ldyBlbmRwb2ludCBhbmQgaGF2ZW4ndCBsYWJlbGxlZCBpdCB5ZXQuXG5leHBvcnQgY29uc3QgRU5EUE9JTlRfTEFCRUxfWkggPSB7XG4gIGVuY291bnRlcnM6IFwiXHU1QzMxXHU5MUFCXCIsXG4gIGlucGF0aWVudDogXCJcdTRGNEZcdTk2NjJcIixcbiAgaW5wYXRpZW50X2xlZ2FjeTogXCJcdTRGNEZcdTk2NjJcdUZGMDhcdTgyMEFcdUZGMDlcIixcbiAgcHJvY2VkdXJlczogXCJcdTYyNEJcdTg4NTMgLyBcdTg2NTVcdTdGNkVcIixcbiAgbWVkaWNhdGlvbnM6IFwiXHU4NjU1XHU2NUI5XHU4NUU1XHU1NEMxXCIsXG4gIGNocm9uaWNfcHJlc2NyaXB0aW9uczogXCJcdTYxNjJcdTYwMjdcdTg2NTVcdTY1QjlcdTdCOEJcIixcbiAgYWxsZXJnaWVzOiBcIlx1ODVFNVx1NzI2OVx1OTA0RVx1NjU0RlwiLFxuICBhbGxlcmdpZXNfYjogXCJcdTg1RTVcdTcyNjlcdTkwNEVcdTY1NEZcdUZGMDhCXHVGRjA5XCIsXG4gIGFkdWx0X3ByZXZlbnRpdmU6IFwiXHU2MjEwXHU0RUJBXHU1MDY1XHU2QUEyXCIsXG4gIGNhbmNlcl9zY3JlZW5pbmc6IFwiXHU3NjRDXHU3NUM3XHU3QkU5XHU2QUEyXCIsXG4gIGltYWdpbmc6IFwiXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XCIsXG4gIG90aGVyX2xhYnM6IFwiXHU2QUEyXHU5QTU3XCIsXG4gIGNhdGFzdHJvcGhpY19pbGxuZXNzOiBcIlx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNVwiLFxuICBpbW11bml6YXRpb25zOiBcIlx1NzVBQlx1ODJEN1wiLFxufTtcblxuLy8gcGFnZV90eXBlIFx1MjE5MiBiYWNrZW5kIHBhZ2VfdHlwZSBzdHJpbmcgdXNlZCBieSBtYXBwZXJzLlxuLy8gcGF0aCBpcyByZWxhdGl2ZSB0byBuaGlCYXNlLiBtZXRob2QgZGVmYXVsdCBcIkdFVFwiLlxuLy8gYHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlYCA9IGVuZHBvaW50IGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGluIFx1NkMxMVx1NTcwQiBmb3JtYXQuXG4vLyBDb25maXJtZWQgdmlhIFVSTHMgb2JzZXJ2ZWQgaW4gTkhJJ3MgU1BBLiBPdGhlciBlbmRwb2ludHMgZWl0aGVyIGRvbid0XG4vLyBhY2NlcHQgcmFuZ2UgcGFyYW1zLCBvciBOSEkgcmVqZWN0cyB1bmtub3duIHBhcmFtcyBcdTIwMTQgd2UgbGVhdmUgdGhlbSBhbG9uZVxuLy8gKHRoZXkgZmFsbCBiYWNrIHRvIHRoZWlyIGRlZmF1bHQgd2luZG93LCB0eXBpY2FsbHkgMS0yIHllYXJzKS5cbmV4cG9ydCBjb25zdCBOSElfQVBJX0VORFBPSU5UUyA9IFtcbiAgLy8gZW5jb3VudGVycyAvIHByb2NlZHVyZXMgZG9uJ3QgaGF2ZSBhIC9zZWFyY2ggdmFyaWFudCAoNDA0KS4gcGFnZV9sb2FkXG4gIC8vIHNpbGVudGx5IGlnbm9yZXMgc19kYXRlIC8gZV9kYXRlIFx1MjAxNCB2ZXJpZmllZCB0aGUgYXJyYXkgbGVuZ3RoIGlzXG4gIC8vIGlkZW50aWNhbCB3aXRoIG9yIHdpdGhvdXQgZGF0ZXMuIERhdGUgZmlsdGVyIGlzIGVmZmVjdGl2ZWx5IHVuc3VwcG9ydGVkXG4gIC8vIGZvciB0aGVzZSBlbmRwb2ludHM7IHRoZXkgcmV0dXJuIGFsbCBkYXRhIGluIE5ISSdzIGxpZmV0aW1lIHdpbmRvdy5cbiAgLy8gRW5jb3VudGVyIHNvdXJjZTogSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkuIFRoZSAvcGFnZV9sb2FkIHZhcmlhbnRcbiAgLy8gaXMgd2luZG93LWxpbWl0ZWQgdG8gfjEgeWVhciAocmV0dXJuZWQgNTEgdmlzaXRzIGVuZGluZyAxMTQvMDUpO1xuICAvLyAvc2VhcmNoIGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGFuZCBnb2VzIGJhY2sgZnVydGhlciAoMTYyIHZpc2l0c1xuICAvLyB0byAxMTIvMDUgZm9yIHRoZSBzYW1lIHBhdGllbnQpLiBTaW5jZSBsYWJzL21lZHMgZXh0ZW5kIHRvIDN5IHZpYVxuICAvLyB0aGVpciBvd24gL3NlYXJjaCBlbmRwb2ludHMsIGVuY291bnRlciBNVVNUIGFsc28gdXNlIC9zZWFyY2ggb3JcbiAgLy8gdGhlIChob3NwaXRhbCwgZGF0ZSkgbGlua2VyIGhhcyBub3RoaW5nIHRvIG1hdGNoIGFnYWluc3QgZm9yIG9sZGVyXG4gIC8vIGxhYiBkYXRlcy5cbiAgeyBuYW1lOiBcImVuY291bnRlcnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAzczAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT1cIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElucGF0aWVudCAoXHU0RjRGXHU5NjYyKSBcdTIwMTQgSUhLRTMzMDlTMDEgaXMgdGhlIHByaW1hcnkgbGlzdCB3aXRoIGluX0RBVEUvb3V0X0RBVEVcbiAgLy8gc3Bhbi4gSUhLRTMzMDhTMDEgY2FycmllcyBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3JkcyB3aXRoIHRoZVxuICAvLyBzYW1lIGZpZWxkcyAoZnVuY19EQVRFIGluIHNvbWUgcm93cyBpbnN0ZWFkIG9mIGluX0RBVEU7IGFkYXB0ZXJcbiAgLy8gaGFuZGxlcyBib3RoKS4gQm90aCBmZWVkIHRoZSBzYW1lIGVuY291bnRlciBtYXBwZXIuXG4gIHsgbmFtZTogXCJpbnBhdGllbnRcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOXMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJpbnBhdGllbnRfbGVnYWN5XCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOHMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIC8vIFByb2NlZHVyZXMgKElIS0UzMzAxUzA1KSBsaXN0IG9ubHkgaGFzIG9yZGVyLWxldmVsIG1ldGFkYXRhIFx1MjAxNFxuICAvLyBubyBJQ0QtMTAtUENTIGNvZGUgYW5kIG5vIGFjdHVhbCBwZXJmb3JtZWQtZGF0ZS4gVGhlIGZ1bGxcbiAgLy8gcmVjb3JkIGxpdmVzIGF0IElIS0UzMzA4UzAyIChzdWItbGlzdCBjYXJyaWVzIGV4ZV9TX0RBVEUgK1xuICAvLyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHBlciBleGVjdXRpb24pLiBTYW1lIDItc3RlcCBmYW4tb3V0IHBhdHRlcm4gYXNcbiAgLy8gaW1hZ2luZzsgc2VlIF9mZXRjaFByb2NlZHVyZURldGFpbHNJblRhYi5cbiAgeyBuYW1lOiBcInByb2NlZHVyZXNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAxczA1L3BhZ2VfbG9hZFwiLFxuICAgIHBhZ2VfdHlwZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICBhZGFwdDogYWRhcHRQcm9jZWR1cmVMaXN0U3R1YiB9LFxuICAvLyBtZWRpY2F0aW9uczogcGFnZV9sb2FkIG9ubHkgYWNjZXB0cyBlbXB0eSBkYXRlcyAoSFRUUCA0MDAgb3RoZXJ3aXNlKS5cbiAgLy8gVGhlIC9zZWFyY2ggZW5kcG9pbnQgaXMgd2hhdCB0aGUgU1BBIGhpdHMgd2hlbiB1c2VyIHBpY2tzIGEgY3VzdG9tXG4gIC8vIGRhdGUgcmFuZ2UgYW5kIGFjY2VwdHMgSVNPIFx1ODk3Rlx1NTE0MyBkYXRlcyB3aXRoIGRhc2hlcyAoMjAyMy0wMS0wMSkuXG4gIC8vIENvbmZpcm1lZCB2aWEgRGV2VG9vbHMgb2JzZXJ2YXRpb24gb2YgdGhlIFx1N0JFOVx1OTA3OCBwYW5lbCBzdWJtaXQuXG4gIHsgbmFtZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwNnMwMS9zZWFyY2g/c19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMSZzX3R5cGU9QVwiLFxuICAgIHBhZ2VfdHlwZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICBhZGFwdDogYWRhcHRNZWRpY2F0aW9uLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBcdTYxNjJcdTYwMjdcdTg2NTVcdTY1QjlcdTdCOEIgKHJlZmlsbD1cIllcIikgXHUyMDE0IHNlcGFyYXRlIGxpc3QgZW5kcG9pbnQgZnJvbSBtZWRpY2F0aW9ucy5cbiAgLy8gfjUyIG9mIDEyNiBlbnRyaWVzIG92ZXJsYXAgd2l0aCBJSEtFMzMwNlMwMTsgdGhlIHJlc3QgYXJlXG4gIC8vIGNocm9uaWMtb25seSBhbmQgd291bGQgYmUgbWlzc2VkIGlmIHdlIHJlbGllZCBvbiByZWd1bGFyIGxpc3QgYWxvbmUuXG4gIC8vIFRoZSBjaHJvbmljIGRldGFpbCBmYW4tb3V0IHJ1bnMgQkVGT1JFIHRoZSBtZWRpY2F0aW9uIGZhbi1vdXQgYW5kXG4gIC8vIGl0cyByb3dfSURzIGFyZSBwYXNzZWQgdG8gdGhlIG1lZGljYXRpb24gZmFuLW91dCBhcyBza2lwLXNldCBzb1xuICAvLyBlYWNoIHJvdyBpcyBmZXRjaGVkIG9uY2UuIFNlZSBfZmV0Y2hDaHJvbmljTWVkaWNhdGlvbkRldGFpbHNJblRhYlxuICAvLyBpbiBiYWNrZ3JvdW5kLmpzLiBEZXRhaWwgZW5kcG9pbnQgaXMgdGhlIHNhbWUgSUhLRTMzMDZTMDIgYXNcbiAgLy8gcmVndWxhciBtZWRzOyBjdHlwZSBtdXN0IGVxdWFsIHRoZSBsaXN0IHJvdydzIG9yaV9UWVBFICgxPVx1OTU4MFx1OEEzQSxcbiAgLy8gMj1JQ1x1NTM2MSwgOD1cdTg1RTVcdTVDNDApLCBub3QgaGFyZGNvZGVkIHRvIDguXG4gIHsgbmFtZTogXCJjaHJvbmljX3ByZXNjcmlwdGlvbnNcIiwgcGF0aDogXCIvYXBpL2loa2UzMDAwL0lIS0UzMzA3UzAxL3BhZ2VfbG9hZFwiLFxuICAgIHBhZ2VfdHlwZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICBhZGFwdDogYWRhcHRDaHJvbmljTGlzdFN0dWIgfSxcbiAgeyBuYW1lOiBcImFsbGVyZ2llc1wiLCAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAyczAxL1NQX0lIS0UzMjAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcImFsbGVyZ2llc1wiLCAgICAgICAgIGFkYXB0OiBhZGFwdEFsbGVyZ3kgfSxcbiAgeyBuYW1lOiBcImFsbGVyZ2llc19iXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAyczAxL1NQX0lIS0UzMjAyUzA0XCIsXG4gICAgcGFnZV90eXBlOiBcImFsbGVyZ2llc1wiLCAgICAgICAgIGFkYXB0OiBhZGFwdEFsbGVyZ3kgfSxcbiAgLy8gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1XHU3RDUwXHU2NzlDIChJSEtFMzQwMlMwMSk6IG9uZSByb3cgcGVyIHNjcmVlbmluZywgY29udGFpbnNcbiAgLy8gQk1JIC8gdml0YWxzIC8gbGlwaWQgcGFuZWwgLyBMRlQgLyBSRlQgLyBIZXAgQi9DIC8gdXJpYyBhY2lkIGFsbFxuICAvLyBwcmUtY29tcHV0ZWQgYnkgTkhJJ3Mgc2NyZWVuaW5nIHByb2dyYW1tZS4gYWRhcHRBZHVsdFByZXZlbnRpdmVcbiAgLy8gcmV0dXJucyBhbiBhcnJheSAob25lIE9ic2VydmF0aW9uIHBlciBtZWFzdXJlbWVudCkgc28gdGhlXG4gIC8vIGFkYXB0ZXItY2FsbCBsb29wIGZsYXR0ZW5zIGl0LlxuICB7IG5hbWU6IFwiYWR1bHRfcHJldmVudGl2ZVwiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDJzMDEvU1BfSUhLRTM0MDJTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0QWR1bHRQcmV2ZW50aXZlIH0sXG4gIHsgbmFtZTogXCJjYW5jZXJfc2NyZWVuaW5nXCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwNHMwMS9TUF9JSEtFMzQwNFMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtIH0sXG4gIC8vIGdsdWNvc2UgKElIS0UzNDA2UzAxKSArIGxpcGlkIChJSEtFMzQwN1MwMSkgYXJlIHN1YnNldHMgb2ZcbiAgLy8gb3RoZXJfbGFicyAoSUhLRTM0MDlTMDEpIHBlciBOSEkncyBkYXRhIG1vZGVsIFx1MjAxNCBmZXRjaGluZyB0aGVtXG4gIC8vIHNlcGFyYXRlbHkganVzdCBjcmVhdGVzIGR1cCBvYnNlcnZhdGlvbnMsIHNvIHdlIHNraXAgdGhlbS5cbiAgLy8gSW1hZ2luZyBsaXN0IChJSEtFMzQwOFMwMSkgb25seSBjYXJyaWVzIG9yZGVyLWxldmVsIGRhdGE7IGZ1bGxcbiAgLy8gbmFycmF0aXZlIHJlcG9ydCBsaXZlcyBhdCBJSEtFMzQwOFMwMi4gV2UgZG8gYSAyLXN0ZXAgZmV0Y2ggKHNlZVxuICAvLyBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKSB0byBncmFiIHRoZSByZXBvcnQsIHRoZW4gbWFwIHRvIGEgcmVhbFxuICAvLyBEaWFnbm9zdGljUmVwb3J0LiBUaGUgbGlzdCBhZGFwdGVyIGlzIGEgbm8tb3Agc3R1YiBsaWtlIG1lZGljYXRpb25zLlxuICAvLyBpbWFnaW5nOiBzZWFyY2ggZW5kcG9pbnQgYWNjZXB0cyBJU08gZGF0ZSByYW5nZSBsaWtlIG1lZGljYXRpb25zLlxuICB7IG5hbWU6IFwiaW1hZ2luZ1wiLCAgICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDhzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJkaWFnbm9zdGljX3JlcG9ydHNcIiwgYWRhcHQ6IGFkYXB0SW1hZ2luZ0xpc3RTdHViLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBvdGhlcl9sYWJzIGFscmVhZHkgdXNlcyAvc2VhcmNoOyBzYW1lIElTTy1kYXNoIGRhdGUgZm9ybWF0IHdvcmtzLlxuICB7IG5hbWU6IFwib3RoZXJfbGFic1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDlzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBJSEtFMzIwOVMwMSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KSBcdTIwMTQgTkhJLXZldHRlZCBjYXRhc3Ryb3BoaWMtaWxsbmVzcyByZWdpc3RyeS5cbiAgLy8gRWFjaCByb3cgXHUyMTkyIGEgRkhJUiBDb25kaXRpb24gd2l0aCBjYXRlZ29yeT1wcm9ibGVtLWxpc3QtaXRlbSwgdGhlXG4gIC8vIGNsb3Nlc3QgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGVxdWl2YWxlbnQgdG8gYSBjdXJhdGVkIHByb2JsZW0gbGlzdC4gRW5kcG9pbnRcbiAgLy8gZG9lc24ndCBhY2NlcHQgZGF0ZSBwYXJhbXMgKE5ISSByZXR1cm5zIGN1cnJlbnRseS12YWxpZCBjZXJ0cyBvbmx5KS5cbiAgeyBuYW1lOiBcImNhdGFzdHJvcGhpY19pbGxuZXNzXCIsIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwOXMwMS9TUF9JSEtFMzIwOVMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJjb25kaXRpb25zXCIsICAgICAgICBhZGFwdDogYWRhcHRDYXRhc3Ryb3BoaWNJbGxuZXNzIH0sXG4gIC8vIElIS0UzMjAzUzAxIChcdTk4MTBcdTk2MzJcdTYzQTVcdTdBMkVcdTdEMDBcdTkzMDQgLyBcdTc1QUJcdTgyRDcpIFx1MjAxNCBUYWl3YW4gQ0RDIHNvdXJjZWQuIEVhY2ggcm93XG4gIC8vIFx1MjE5MiBGSElSIEltbXVuaXphdGlvbi4gTkhJIHNoaXBzIENoaW5lc2Utb25seSB2YWNjaW5lIG5hbWVzIHdpdGhcbiAgLy8gYmF0Y2ggbnVtYmVyIGlubGluZWQgYXMgXCIoXHU2Mjc5XHU4NjVGWFhYKVwiOyBhZGFwdGVyIHNwbGl0cyB0aGUgbG90LlxuICAvLyBObyBkYXRlIHJhbmdlIHBhcmFtZXRlciAoTkhJIHJldHVybnMgYWxsIGhpc3RvcmljYWwgdmFjY2luYXRpb25zKS5cbiAgeyBuYW1lOiBcImltbXVuaXphdGlvbnNcIiwgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAzczAxL1NQX0lIS0UzMjAzUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcImltbXVuaXphdGlvbnNcIiwgICAgIGFkYXB0OiBhZGFwdEltbXVuaXphdGlvbiB9LFxuXTtcbiIsICIvLyBTZXJ2aWNlIHdvcmtlciBmb3IgTkhJLUZISVIgQnJpZGdlIFx1MjAxNCBvd25zIHRoZSBsb25nLXJ1bm5pbmdcbi8vIFwiU3luYyBUaGlzIFBhdGllbnRcIiB3b3JrZmxvdyBzbyB0aGUgcG9wdXAgY2FuIGNsb3NlIG1pZC1zeW5jIHdpdGhvdXRcbi8vIGFib3J0aW5nIGl0LlxuLy9cbi8vIExpZmVjeWNsZTpcbi8vICAgLSBwb3B1cCBwb3N0cyB7dHlwZTogXCJzdGFydE5oaUFwaVN5bmNcIiwgcGF5bG9hZH0gIFx1MjE5MiBOSEkgSlNPTi1BUEkgc3luY1xuLy8gICAtIGJhY2tncm91bmQgcnVucyB0aGUgZnVsbCBzeW5jIHNlcXVlbmNlLCB1cGRhdGluZyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gICAtIHBvcHVwIHJlYWRzIGNocm9tZS5zdG9yYWdlLmxvY2FsIG9uIHJlb3BlbiB0byBzaG93IHByb2dyZXNzXG4vL1xuLy8gTW9kZXM6XG4vLyAgIC0gXCJsb2NhbFwiICAgXHUyMTkyIGFmdGVyIE5ISSBmZXRjaCwgcnVuIG1hcHBlcnMgaW4tZXh0ZW5zaW9uLCBkb3dubG9hZCBhXG4vLyAgICAgICAgICAgICAgICAgRkhJUiBCdW5kbGUgdG8gdGhlIHVzZXIncyBtYWNoaW5lLiBObyBiYWNrZW5kIHJlcXVpcmVkLlxuLy8gICAtIFwiYmFja2VuZFwiIFx1MjE5MiBQT1NUIHBlci1wYWdlX3R5cGUgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRcbi8vICAgICAgICAgICAgICAgICAoZXhpc3RpbmcgYmVoYXZpb3VyKTsgZGFzaGJvYXJkICsgU01BUlQgYXBwIHVzZSB0aGVcbi8vICAgICAgICAgICAgICAgICBiYWNrZW5kJ3MgRkhJUiBzdG9yZS5cblxuaW1wb3J0IHtcbiAgR1JPVVBfSEFORExFUlMsXG4gIExJU1RfSEFORExFUlMsXG4gIGRlZHVwQWRtaXNzaW9uRGF5QW1iLFxuICBkZXJpdmVQYXRpZW50SWQsXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMsXG4gIG1hcFBhdGllbnQsXG4gIG1hc2tJZCxcbiAgbWFza05hbWUsXG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzLFxufSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcbmltcG9ydCB7XG4gIC8vIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UgaXMgaW52b2tlZCBkaXJlY3RseSBmcm9tIHRoZVxuICAvLyBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dCAob3ZlcnJpZGVzIHRoZSByZWdpc3RyeSdzIGNsYXNzSGludFxuICAvLyB3aXRoIFx1NjAyNVx1OEEzQS9cdTRGNEZcdTk2NjIgZGVyaXZlZCBmcm9tIHRoZSBkZXRhaWwgYm9keSksIHNvIGl0IG5lZWRzIHRvIGJlXG4gIC8vIGEgbmFtZWQgaW1wb3J0IFx1MjAxNCBub3Qgb25seSByZWFjaGFibGUgdmlhIE5ISV9BUElfRU5EUE9JTlRTW2ldLmFkYXB0LlxuICAvLyBGb3JnZXR0aW5nIHRoaXMgcmUtaW1wb3J0IGFmdGVyIGV4dHJhY3RpbmcgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5XG4gIC8vIGluIHYwLjYuMyBzaGlwcGVkIGEgUmVmZXJlbmNlRXJyb3IgdGhhdCBvbmx5IGZpcmVkIGluIHByb2R1Y3Rpb25cbiAgLy8gc3luY3Mgd2l0aCBub24tZW1wdHkgZW5jb3VudGVycy4gVGVzdHMgZG9uJ3QgZXhlcmNpc2UgdGhhdCBwYXRoXG4gIC8vIFx1MjAxNCBzZWUgVE9ET19GT0xMT1dVUCBmb3IgYSBTVy1mbG93IGludGVncmF0aW9uIHRlc3QgaWRlYS5cbiAgYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSxcbiAgYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCxcbiAgYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIsXG4gIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwsXG4gIGFkYXB0UHJvY2VkdXJlRnJvbURldGFpbCxcbiAgaXNvVG9ST0MsXG4gIHBpY2tFbmdsaXNoLFxuICByb2NUb0lTTyxcbn0gZnJvbSBcIi4vbmhpLWFkYXB0ZXJzLmpzXCI7XG5pbXBvcnQgeyBFTkRQT0lOVF9MQUJFTF9aSCwgTkhJX0FQSV9FTkRQT0lOVFMgfSBmcm9tIFwiLi9uaGktZW5kcG9pbnRzLmpzXCI7XG5cbmNvbnN0IFNUT1JBR0VfS0VZID0gXCJzeW5jU3RhdHVzXCI7XG5jb25zdCBzbGVlcCA9IChtcykgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKTtcblxuLy8gQ2FuY2VsbGF0aW9uIGZsYWcgc2V0IGJ5IHBvcHVwJ3Mgc3RvcCBidXR0b24uIENoZWNrZWQgYXQgc3RyYXRlZ2ljIHBvaW50c1xuLy8gaW4gcnVuTmhpQXBpU3luYyAoYmV0d2VlbiBwaGFzZXMsIGJlZm9yZSBlYWNoIGRldGFpbCBwYWdlKSBzbyB0aGVcbi8vIGluLXByb2dyZXNzIHN5bmMgZXhpdHMgcHJvbXB0bHkgd2hlbiB0aGUgdXNlciBoaXRzIFN0b3AuIENsZWFyZWQgYXQgdGhlXG4vLyBzdGFydCBvZiBlYWNoIG5ldyBzeW5jIHJ1bi5cbmxldCBfY2FuY2VsbGVkID0gZmFsc2U7XG4vLyBDb250ZXh0IGZvciB0aGUgaW4tZmxpZ2h0IHN5bmMgc28gdGhlIHN0b3BTeW5jIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuLy8gZGF0YSB3aXRob3V0IHRoZSBwb3B1cCBuZWVkaW5nIHRvIHBhc3MgaXQgYmFjay4gU2V0IGF0IHRoZSB0b3Agb2Zcbi8vIHJ1bk5oaUFwaVN5bmM7IGNsZWFyZWQgb24gY29tcGxldGlvbiAoc3VjY2Vzcy9mYWlsdXJlL2NhbmNlbCkuXG5sZXQgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xuY29uc3QgQ0FOQ0VMX0VSUk9SID0gXCJfX1NZTkNfQ0FOQ0VMTEVEX19cIjtcbi8vIFRocm93biB3aGVuIE5ISSBkZXRlY3RzIHRoZSBzZXNzaW9uIGhhcyBleHBpcmVkIChsb2dpbiBwYWdlIHJlbmRlcmVkLCBvclxuLy8gdGFiIHJlZGlyZWN0ZWQgdG8gYXV0aCBuYW1lc3BhY2UpLiBBYm9ydHMgc3luYyBpbW1lZGlhdGVseSBzbyB0aGUgdXNlciBjYW5cbi8vIHJlLWxvZ2luIGFuZCByZXRyeSBpbnN0ZWFkIG9mIHRpbWluZyBvdXQgb24gZXZlcnkgcmVtYWluaW5nIHBhZ2UuXG5jb25zdCBTRVNTSU9OX0VYUElSRURfRVJST1IgPSBcIl9fU0VTU0lPTl9FWFBJUkVEX19cIjtcbi8vIEVycm9ycyB0aGF0IHNob3VsZCBhYm9ydCB0aGUgZW50aXJlIHN5bmMgaW5zdGVhZCBvZiBiZWluZyBzd2FsbG93ZWRcbi8vIHBlci1waGFzZS5cbmNvbnN0IEFCT1JUX0VSUk9SUyA9IG5ldyBTZXQoW0NBTkNFTF9FUlJPUiwgU0VTU0lPTl9FWFBJUkVEX0VSUk9SXSk7XG5mdW5jdGlvbiBjaGVja0NhbmNlbCgpIHtcbiAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRTdGF0dXMocGFydGlhbCkge1xuICAvLyBBZnRlciBjYW5jZWxsYXRpb24sIHRoZSBwb3B1cCBoYXMgYWxyZWFkeSB3cml0dGVuIHRoZSBkZWZpbml0aXZlXG4gIC8vIFwic3RvcHBlZFwiIHN0YXR1cyBcdTIwMTQgc2lsZW5jZSBhbnkgZnVydGhlciBwcm9ncmVzcyB3cml0ZXMgZnJvbSB0aGVcbiAgLy8gaW4tZmxpZ2h0IHN5bmMgY29kZSBzbyB0aGUgVUkgZG9lc24ndCBib3VuY2Ugd2hpbGUgaXQgdW53aW5kcy5cbiAgaWYgKF9jYW5jZWxsZWQpIHJldHVybjtcbiAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gIGNvbnN0IG5leHQgPSB7IC4uLnByZXYsIC4uLnBhcnRpYWwsIHRzOiBEYXRlLm5vdygpIH07XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IG5leHQgfSk7XG4gIC8vIEJyb2FkY2FzdCB0byBhbnkgb3BlbiBwb3B1cC4gSWYgbm8gbGlzdGVuZXIgKHBvcHVwIGNsb3NlZCksXG4gIC8vIHNlbmRNZXNzYWdlIHJlamVjdHMgXHUyMDE0IHN3YWxsb3cuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzeW5jUHJvZ3Jlc3NcIiwgc3RhdHVzOiBuZXh0IH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuLy8gV3JhcCBhIGxvbmctcnVubmluZyBmYW4tb3V0IHdpdGggYSBwZXJpb2RpYyBlbGFwc2VkLXRpbWUgdGlja2VyIHNvXG4vLyB0aGUgcG9wdXAgZG9lc24ndCBsb29rIGZyb3plbiBkdXJpbmcgNjAtOTAgc2Vjb25kIE5ISSBkZXRhaWwgZmV0Y2hlc1xuLy8gKGVhY2ggUzAyIGRldGFpbCB0cmlnZ2VycyBhIHJlYWwgREIgSk9JTiBzZXJ2ZXItc2lkZTsgdGhlIGZhbi1vdXRcbi8vIHRpbWUgaXMgYm91bmQgYnkgTkhJJ3MgcGVyLXJlcXVlc3QgcHJvY2Vzc2luZyBjb3N0LCBub3QgYW55dGhpbmdcbi8vIHdlIGNhbiBzcGVlZCB1cCBjbGllbnQtc2lkZSkuXG4vL1xuLy8gbGFiZWwgaXMgYSBmdW5jdGlvbiAoZWxhcHNlZFNlYykgXHUyMTkyIHN0cmluZyB0aGF0IGZvcm1hdHMgdGhlIHByb2dyZXNzXG4vLyBtZXNzYWdlOyBjYWxsZWQgZXZlcnkgMyBzZWNvbmRzIHdoaWxlIHRoZSBhd2FpdGVkIHByb21pc2UgaXMgaW5cbi8vIGZsaWdodC4gRmluYWwgc2V0U3RhdHVzIGNhbGwgZmlyZXMgb25seSBvbiBjb21wbGV0aW9uIChzbyB0aGVcbi8vIFwiY29tcGxldGVcIiBtZXNzYWdlIHJlcGxhY2VzIHRoZSBcImluLXByb2dyZXNzXCIgb25lIGNsZWFubHkpLlxuYXN5bmMgZnVuY3Rpb24gX3dpdGhQcm9ncmVzc1RpbWVyKG1ha2VMYWJlbCwgZm4pIHtcbiAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAvLyBJbml0aWFsIHN0YXR1cyBzZXQgaW1tZWRpYXRlbHkgc28gdGhlIHVzZXIgc2VlcyB0aGUgbWVzc2FnZSBiZWZvcmVcbiAgLy8gdGhlIGZpcnN0IDMtc2Vjb25kIHRpY2suIFN1YnNlcXVlbnQgdGlja3MgdXBkYXRlIHRoZSBlbGFwc2VkIHNlY29uZHMuXG4gIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBtYWtlTGFiZWwoMCkgfSk7XG4gIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGNvbnN0IGVsYXBzZWQgPSBNYXRoLnJvdW5kKChEYXRlLm5vdygpIC0gc3RhcnQpIC8gMTAwMCk7XG4gICAgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IG1ha2VMYWJlbChlbGFwc2VkKSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIH0sIDMwMDApO1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgQVBJLWRpcmVjdCBzeW5jIChwYXJhbGxlbCwgbm8gTExNKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBJbnN0ZWFkIG9mIG5hdmlnYXRpbmcgdGhlIHVzZXIncyB0YWIgdG8gZWFjaCBOSEkgcGFnZSwgd2FpdGluZyBmb3IgVnVlIHRvXG4vLyByZW5kZXIsIGNhcHR1cmluZyBIVE1MLCB0aGVuIHNlbmRpbmcgaXQgdGhyb3VnaCBMTE0gZXh0cmFjdGlvbiwgd2UgY2FsbFxuLy8gTkhJJ3MgdW5kZXJseWluZyBKU09OIEFQSSBlbmRwb2ludHMgZGlyZWN0bHkuIFRoZSBcdTUwNjVcdTRGRERcdTdGNzIgU1BBIGZyb250cyBhIHNldFxuLy8gb2YgUkVTVCBlbmRwb2ludHMgdW5kZXIgL2FwaS9paGtlMzAwMC88cGFnZT4vKiB0aGF0IHJldHVybiB3ZWxsLWZvcm1lZFxuLy8gSlNPTjsgY2FsbGluZyB0aGVtIGluIHBhcmFsbGVsIGN1dHMgYSA1LTEwIG1pbnV0ZSBzeW5jIHRvIH4xMCBzZWNvbmRzIGFuZFxuLy8gcmVtb3ZlcyB0aGUgTExNIGNvc3QgZW50aXJlbHkuXG5cbmNvbnN0IE5ISV9IT1NUID0gXCJteWhlYWx0aGJhbmsubmhpLmdvdi50d1wiO1xuXG5cbi8vIE5ISSBKU09OIGFkYXB0ZXJzICsgZGF0ZS9zdHJpbmcgaGVscGVycyBsaXZlIGluIC4vbmhpLWFkYXB0ZXJzLmpzXG4vLyBzbyB0aGV5IGNhbiBiZSB1bml0LXRlc3RlZCBpbiBpc29sYXRpb24gKGJhY2tncm91bmQuanMgY2FuJ3QgYmVcbi8vIGxvYWRlZCB1bmRlciB2aXRlc3QgXHUyMDE0IGNocm9tZS4qIEFQSXMsIFNXIGdsb2JhbHMpLiBTZWUgdGhhdCBtb2R1bGVcbi8vIGZvciB0aGUgZmllbGQtcHJpb3JpdHkgZGVjaXNpb25zIHBlciBhZGFwdGVyLlxuLy9cbi8vIFRoZSBOSEkgQVBJIGVuZHBvaW50IHJlZ2lzdHJ5ICsgXHU0RTJEXHU2NTg3IGxhYmVsIG1hcHBpbmcgbGl2ZSBpblxuLy8gLi9uaGktZW5kcG9pbnRzLmpzIFx1MjAxNCBleHRyYWN0ZWQgc28gYSB1bml0IHRlc3QgY2FuIGd1YXJhbnRlZSBldmVyeVxuLy8gZW5kcG9pbnQgbmFtZSBoYXMgYSBsYWJlbCAod2UgdXNlZCB0byBzaGlwIHJhdyBwYWdlX3R5cGUga2V5cyBsaWtlXG4vLyBcIm90aGVyX2xhYnNcIiBpbnRvIHRoZSBwb3B1cCdzIFx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMCB3aGVuIHNvbWVvbmUgZm9yZ290IHRvXG4vLyByZWdpc3RlciB0aGUgQ2hpbmVzZSB2ZXJzaW9uKS5cblxuLy8gQXBwbHkgYSB7c3RhcnQsIGVuZH0gSVNPIGRhdGUgcmFuZ2UgdG8gYW4gZW5kcG9pbnQgcGF0aDpcbi8vICAgLSBJZiBwYXRoIGFscmVhZHkgaGFzIHNfZGF0ZT0gcGxhY2Vob2xkZXJzLCBmaWxsIHRoZW0gaW4uXG4vLyAgIC0gT3RoZXJ3aXNlIGFwcGVuZCBzX2RhdGU9Li4uJmVfZGF0ZT0uLi4gdG8gdGhlIHF1ZXJ5IHN0cmluZy5cbi8vIEVuZHBvaW50cyB3aXRob3V0IGBzdXBwb3J0c0RhdGVSYW5nZWAgcGFzcyB0aHJvdWdoIHVuY2hhbmdlZC5cbmZ1bmN0aW9uIGFwcGx5RGF0ZVJhbmdlVG9QYXRoKHBhdGgsIGRhdGVSYW5nZSkge1xuICBpZiAoIWRhdGVSYW5nZSB8fCAoIWRhdGVSYW5nZS5zdGFydCAmJiAhZGF0ZVJhbmdlLmVuZCkpIHJldHVybiBwYXRoO1xuICAvLyBOSEkgZXhwZWN0cyBcdTg5N0ZcdTUxNDMgSVNPIGRhdGVzIHdpdGggZGFzaGVzOiAyMDIzLTAxLTAxIChub3QgXHU2QzExXHU1NzBCLCBub3RcbiAgLy8gc2xhc2hlcykuIENvbmZpcm1lZCBieSBvYnNlcnZpbmcgdGhlIFNQQSdzIHJlcXVlc3Qgd2hlbiB1c2VyIHBpY2tzXG4gIC8vIGEgY3VzdG9tIGRhdGUgcmFuZ2UuIFVSTC1lbmNvZGluZyB0aGUgZGFzaGVzIGlzIHVubmVjZXNzYXJ5LlxuICBjb25zdCBzID0gKGRhdGVSYW5nZS5zdGFydCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IGUgPSAoZGF0ZVJhbmdlLmVuZCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGxldCBwID0gcGF0aDtcbiAgaWYgKC9bPyZdc19kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdc19kYXRlPSlbXiZdKi8sIGAkMSR7c31gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IChwLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCIpICsgYHNfZGF0ZT0ke3N9YDtcbiAgfVxuICBpZiAoL1s/Jl1lX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1lX2RhdGU9KVteJl0qLywgYCQxJHtlfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gYCZlX2RhdGU9JHtlfWA7XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDZTMDIgZGV0YWlsIGZldGNoZXMgaW5zaWRlIHRoZSBOSEkgdGFiIHNvIGNvb2tpZXMgKyBKV1Rcbi8vIGF1dGggZmxvdyBuYXR1cmFsbHkuIFdlIHBhc3MgdGhlIHZpc2l0IGxpc3QgKGp1c3Qgcm93X0lEcyArIHRoZWlyIHBhcmVudFxuLy8gZmllbGRzIG5lZWRlZCBmb3IgYWRhcHRhdGlvbikgaW50byB0aGUgdGFiOyB0aGUgdGFiIHJldHVybnMgcGFyYWxsZWxcbi8vIGZldGNoZWQgYm9kaWVzOyB3ZSBhZGFwdCBiYWNrIGluIHRoZSBTVy5cbi8vXG4vLyBgc2tpcFJvd0lkc2A6IFNldDxzdHJpbmc+IG9mIHJvd19JRHMgd2hvc2UgZHJ1Z3MgaGF2ZSBhbHJlYWR5IGJlZW5cbi8vIGZldGNoZWQgYnkgYW5vdGhlciBmYW4tb3V0IChjdXJyZW50bHk6IGNocm9uaWMgcHJlc2NyaXB0aW9ucykuIFdoZW5cbi8vIHRoZSBjaHJvbmljIGxpc3QgKElIS0UzMzA3UzAxKSBhbmQgdGhlIHJlZ3VsYXIgbWVkcyBsaXN0XG4vLyAoSUhLRTMzMDZTMDEpIGJvdGggY29udGFpbiB0aGUgc2FtZSByb3dfSUQgKH41MiBvdmVybGFwIG9uIG9ic2VydmVkXG4vLyBwYXRpZW50KSwgd2Ugc2tpcCB0aGUgcmVndWxhciBjYWxsIHRvIGF2b2lkIGRvdWJsZS1lbWl0dGluZyB0aGVcbi8vIHNhbWUgZHJ1Z3MuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hNZWRpY2F0aW9uRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cywgc2tpcFJvd0lkcyB9KSB7XG4gIGNvbnN0IHNraXAgPSBza2lwUm93SWRzIGluc3RhbmNlb2YgU2V0ID8gc2tpcFJvd0lkcyA6IG5ldyBTZXQoc2tpcFJvd0lkcyB8fCBbXSk7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2KSA9PiAoe1xuICAgICAgcm93X0lEOiB2LnJvd19JRCB8fCB2LnJvd2lkIHx8IHYucm93SUQgfHwgXCJcIixcbiAgICAgIC8vIEtlZXAgcGFyZW50IGZpZWxkcyBuZWVkZWQgYnkgYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbC5cbiAgICAgIHBhcmVudDoge1xuICAgICAgICBmdW5jX0RBVEU6IHYuZnVuY19EQVRFIHx8IHYuZnVuY19kYXRlIHx8IFwiXCIsXG4gICAgICAgIGljZDljbV9DT0RFOiB2LmljZDljbV9DT0RFIHx8IHYuaWNkOWNtX2NvZGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREVfQ05BTUU6IHYuaWNkOWNtX0NPREVfQ05BTUUgfHwgdi5pY2Q5Y21fbmFtZSB8fCBcIlwiLFxuICAgICAgICBob3NwX0FCQlI6IHYuaG9zcF9BQkJSIHx8IHYuaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgICB9LFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEICYmICFza2lwLmhhcyhyLnJvd19JRCkpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTkhJIHVzZXMgZGlmZmVyZW50IGN0eXBlIHZhbHVlcyBmb3IgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIvXHU4NjU1XHU2NUI5XHU3QjhCLiBXZSBkb24ndFxuICAgICAgLy8gaGF2ZSB0aGUgcHVibGljIG1hcHBpbmcsIHNvIHRyeSBjdHlwZSAxLi40IGluIG9yZGVyIGFuZCBzdG9wIGFzXG4gICAgICAvLyBzb29uIGFzIG9uZSByZXR1cm5zIGRydWdzLiBjdHlwZT0yIGNvdmVyZWQgSUNcdTUzNjEgXHU5NTgwXHU4QTNBIGluIG91ciBzYW1wbGUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNF0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keT8uaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICAgICAgICBjb25zdCBoYXNEcnVncyA9IG1haW4uc29tZSgodikgPT5cbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodj8uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSAmJiB2LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC5sZW5ndGggPiAwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIGN0eXBlIHlpZWxkZWQgZHJ1Z3MgXHUyMDE0IHJldHVybiBsYXN0IHN1Y2Nlc3NmdWwgYm9keSBhbnl3YXkgc29cbiAgICAgICAgLy8gZGlhZ25vc3RpY3MgY2FuIHN0aWxsIHNlZSB0aGUgdmlzaXQgbWV0YWRhdGEuXG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaE9uZShyb3dJZCwgMik7XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBkcnVncyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGRydWdMaXN0ID0gQXJyYXkuaXNBcnJheSh2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpID8gdmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0IDogW107XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZHJ1Z0xpc3QpIHtcbiAgICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZCwgdmlzaXQpO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzMzA2UzAyIGRldGFpbCBmZXRjaGVzIGZvciBjaHJvbmljIHByZXNjcmlwdGlvbnMuIFVzZXNcbi8vIHBlci1yb3cgYG9yaV9UWVBFYCBmb3IgY3R5cGUgKDE9XHU5NTgwXHU4QTNBLCAyPUlDXHU1MzYxLCA4PVx1ODVFNVx1NUM0MCkgaW5zdGVhZCBvZlxuLy8gYnJ1dGUtZm9yY2luZyAxLi40IGxpa2UgdGhlIHJlZ3VsYXIgbWVkaWNhdGlvbiBmYW4tb3V0OiBjaHJvbmljXG4vLyBsaXN0IHJvd3MgYWx3YXlzIGNhcnJ5IG9yaV9UWVBFIGFuZCBkZXRhaWwtZW1wdHkgcmVzcG9uc2VzIGNvbmZpcm1cbi8vIHRoYXQgbWlzbWF0Y2hpbmcgY3R5cGUgcmV0dXJucyBhbiBlbXB0eSBhcnJheS4gRXZlcnkgZHJ1ZyBwcm9kdWNlZFxuLy8gaGVyZSBnZXRzIGlzX2Nocm9uaWM9dHJ1ZSBcdTIxOTIgbWFwcGVyIGVtaXRzIGNvdXJzZU9mVGhlcmFweVR5cGU9XG4vLyBjb250aW51b3VzIG9uIHRoZSByZXN1bHRpbmcgTWVkaWNhdGlvblJlcXVlc3QuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hDaHJvbmljTWVkaWNhdGlvbkRldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICAvLyBDaHJvbmljIGxpc3Qgcm93cyBhbHdheXMgaGF2ZSBvcmlfVFlQRTsgZmFsbCBiYWNrIHRvIGJydXRlLVxuICAgICAgLy8gZm9yY2Ugb25seSBpZiBOSEkgZXZlciBzaGlwcyBhIHJvdyB3aXRob3V0IGl0LlxuICAgICAgY3R5cGU6IFN0cmluZyh2Lm9yaV9UWVBFIHx8IHYub3JpX3R5cGUgfHwgXCJcIiksXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGN0eXBlKX1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBUcnkgdGhlIHJvdydzIGRlY2xhcmVkIGN0eXBlIGZpcnN0OyBpZiBlbXB0eSwgZmFsbCBiYWNrIHRvXG4gICAgICAvLyBicnV0ZS1mb3JjZSBzbyBhIG1pc2NsYXNzaWZpZWQgcm93IHN0aWxsIHN1cmZhY2VzIGl0cyBkcnVncy5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgZGVjbGFyZWRDdHlwZSkge1xuICAgICAgICBjb25zdCBzZXEgPSBkZWNsYXJlZEN0eXBlXG4gICAgICAgICAgPyBbZGVjbGFyZWRDdHlwZSwgLi4uWzEsIDIsIDgsIDMsIDRdLmZpbHRlcigoYykgPT4gU3RyaW5nKGMpICE9PSBTdHJpbmcoZGVjbGFyZWRDdHlwZSkpXVxuICAgICAgICAgIDogWzEsIDIsIDgsIDMsIDRdO1xuICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIHNlcSkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaE9uZShyb3dJZCwgY3QpO1xuICAgICAgICAgIGlmIChyLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSByZXR1cm4gcjtcbiAgICAgICAgICBpZiAoci5lcnJvcikgY29udGludWU7XG4gICAgICAgICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Py5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgICAgICAgIGNvbnN0IGhhc0RydWdzID0gbWFpbi5zb21lKCh2KSA9PlxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheSh2Py5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpICYmIHYuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0Lmxlbmd0aCA+IDAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lELCBpdGVtc1tpXS5jdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IGRydWdzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgZHJ1Z0xpc3QgPSBBcnJheS5pc0FycmF5KHZpc2l0LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCkgPyB2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QgOiBbXTtcbiAgICAgIGZvciAoY29uc3QgZCBvZiBkcnVnTGlzdCkge1xuICAgICAgICBjb25zdCBhZGFwdGVkID0gYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbChkLCB2aXNpdCwgeyBpc19jaHJvbmljOiB0cnVlIH0pO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzNDA4UzAyIGRldGFpbCBmZXRjaGVzIGZvciBpbWFnaW5nIFx1MjAxNCBzYW1lIHBhdHRlcm4gYXMgdGhlXG4vLyBtZWRpY2F0aW9uIDItc3RlcC4gY3R5cGUgbWlycm9ycyB0aGUgdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICBjdHlwZTogdi5vcmlfVFlQRSB8fCB2Lm9yaV90eXBlIHx8IFwiQVwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzNDA4UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoY3R5cGUpfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCByZXBvcnRzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwodmlzaXQpO1xuICAgICAgaWYgKGFkYXB0ZWQpIHJlcG9ydHMucHVzaChhZGFwdGVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcG9ydHM7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDhTMDIgZGV0YWlsIGZldGNoZXMgZm9yIHByb2NlZHVyZXMgXHUyMDE0IHNhbWUgMi1zdGVwXG4vLyBwYXR0ZXJuIGFzIGltYWdpbmcgSUhLRTM0MDhTMDEgXHUyMTkyIFMwMi4gVGhlIGxpc3QgKElIS0UzMzAxUzA1KSBvbmx5XG4vLyBjYXJyaWVzIG1ldGFkYXRhOyB0aGUgYWN0dWFsIElDRC0xMC1QQ1MgY29kZSAob3BfQ09ERSkgYW5kIHRoZSByZWFsXG4vLyBwZXJmb3JtYW5jZSBkYXRlIChleGVfU19EQVRFIG9uIHN1Yi1saXN0IGVudHJpZXMpIGxpdmUgaW4gdGhlIGRldGFpbC5cbi8vIGN0eXBlIG1pcnJvcnMgdGhlIGxpc3Qgcm93J3Mgb3JpX3R5cGUgKDM9XHU0RjRGXHU5NjYyIC8gNT1cdTk1ODBcdThBM0Egb2JzZXJ2ZWRcbi8vIGFnYWluc3QgbGl2ZSBwYXlsb2FkcykuIE5ISSBkb2Vzbid0IHB1Ymxpc2ggdGhlIG1hcHBpbmcgc28gd2Vcbi8vIGJydXRlLWZvcmNlIG9uIG1pc3MgbGlrZSB0aGUgbWVkaWNhdGlvbiBmYW4tb3V0LCBqdXN0IGluIGNhc2UuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hQcm9jZWR1cmVEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93X2lkIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgY3R5cGU6IHYub3JpX3R5cGUgfHwgdi5vcmlfVFlQRSB8fCBcIlwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTMzMDhTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2VuY29kZVVSSUNvbXBvbmVudChjdHlwZSl9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gUHJlZmVyIHRoZSByb3cncyBvd24gb3JpX3R5cGUuIElmIHRoYXQgcmV0dXJucyBlbXB0eSAoTkhJXG4gICAgICAvLyBzb21ldGltZXMgc2hpcHMgcm93cyB3aGVyZSBjdHlwZSBleHBlY3RzIGEgZGlmZmVyZW50IHZhbHVlKSxcbiAgICAgIC8vIGJydXRlLWZvcmNlIDEuLjUgdW50aWwgc29tZXRoaW5nIGNvbWVzIGJhY2suXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQsIHByZWZlcnJlZCkge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGVzID0gW107XG4gICAgICAgIGlmIChwcmVmZXJyZWQpIGNhbmRpZGF0ZXMucHVzaChwcmVmZXJyZWQpO1xuICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIFtcIjNcIiwgXCI1XCIsIFwiMVwiLCBcIjJcIiwgXCI0XCJdKSB7XG4gICAgICAgICAgaWYgKCFjYW5kaWRhdGVzLmluY2x1ZGVzKGN0KSkgY2FuZGlkYXRlcy5wdXNoKGN0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGFzdE9rID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCBjdCk7XG4gICAgICAgICAgaWYgKHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHJldHVybiByO1xuICAgICAgICAgIGlmIChyLmVycm9yKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHk/Lmloa2UzMzA4UzAyX21haW5fZGF0YSlcbiAgICAgICAgICAgID8gci5ib2R5Lmloa2UzMzA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiByO1xuICAgICAgICAgIGxhc3RPayA9IHI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhc3RPayB8fCB7IGVycm9yOiBcIm5vIGRldGFpbCBib2R5XCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBwcm9jZWR1cmVzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzMwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3Qgcm93IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGFkYXB0ZWQgPSBhZGFwdFByb2NlZHVyZUZyb21EZXRhaWwocm93KTtcbiAgICAgIGlmIChhZGFwdGVkKSBwcm9jZWR1cmVzLnB1c2goYWRhcHRlZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwcm9jZWR1cmVzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzMzAzUzAyIGRldGFpbCB0byBjbGFzc2lmeSBlYWNoIElIS0UzMzAzUzAxIHZpc2l0IGFzXG4vLyBBTUIgLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUuIFVzZXMgP3JpZD08cm93X0lEPiZ0PU5cbi8vIHdoZXJlIE4gaXMgdGhlIHZpc2l0IHR5cGUgYnVja2V0OyB3ZSBkb24ndCBrbm93IHRoZSBtYXBwaW5nIGEgcHJpb3JpLFxuLy8gc28gZm9yIGVhY2ggdmlzaXQgd2UgdHJ5IHQ9MS4uNSB1bnRpbCBvbmUgcmV0dXJucyBub24tZW1wdHkgbWFpbl9kYXRhLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoRW5jb3VudGVyRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2LCBpZHgpID0+ICh7IGlkeCwgcm93X0lEOiB2LnJvV19JRCB8fCB2LnJvd19JRCB8fCBcIlwiIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICAvLyBJSEtFMzMwM1MwMiB0YWtlcyBjcmlkICsgY3R5cGUgKG1pcnJvcnMgSUhLRTMzMDZTMDIgL1xuICAgICAgICAvLyBJSEtFMzMwOFMwMiBkZXRhaWwgZW5kcG9pbnRzKS4gRWFybGllciBjb2RlIHVzZWQgcmlkICsgdFxuICAgICAgICAvLyBcdTIwMTQgdGhhdCBtYXRjaGVkIE5ISSdzIFVJIHJvdXRlIHF1ZXJ5c3RyaW5nIGJ1dCBOT1QgdGhlIEFQSVxuICAgICAgICAvLyBlbmRwb2ludCwgd2hpY2ggc2lsZW50bHkgcmV0dXJuZWQge2loa2UzMzAzUzAyX21haW5fZGF0YTpbXX1cbiAgICAgICAgLy8gZm9yIGV2ZXJ5IHZpc2l0LiBUaGF0IG1hZGUgY2xhc3NIaW50LCBzZWNvbmRhcnkgZGlhZ25vc2VzLFxuICAgICAgICAvLyBhbmQgcHJpbWFyeS1JQ0QtYmlsaW5ndWFsIGFsbCBmYWxsIHRocm91Z2ggdG8gZGVmYXVsdHMuXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwM1MwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHRtID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRtKTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRm9yIGVhY2ggdmlzaXQsIGZpbmQgdGhlIGN0eXBlIHRoYXQgcmV0dXJucyBub24tZW1wdHkgZGF0YS4gTkhJXG4gICAgICAvLyBvYnNlcnZlZDogY3R5cGU9MiBjb3ZlcnMgXHU4OTdGXHU5MUFCIC8gSUNcdTUzNjEgLyBcdTc1MzNcdTU4MzEgT1BELCBvdGhlcnMgbWF5XG4gICAgICAvLyBjb3JyZXNwb25kIHRvIFx1NEUyRFx1OTFBQiAvIFx1NzI1OVx1OTFBQiAvIFx1NEY0Rlx1OTY2Mi4gV2UgcHJvYmUgYSBzbWFsbCBzZXQuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNCwgNV0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSAoci5ib2R5Py5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiB7IGJvZHk6IHIuYm9keSwgY3R5cGU6IGN0IH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgYm9keTogbnVsbCB9O1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd3MgPSBbXTtcbiAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQyAmJiB3IDwgaXRlbXMubGVuZ3RoOyB3KyspIHdzLnB1c2god29ya2VyKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod3MpO1xuICAgICAgcmV0dXJuIHsgcmVzdWx0czogb3V0IH07XG4gICAgfSxcbiAgICBhcmdzOiBbYmFzZVVybCwgcmVxc10sXG4gIH0pO1xuXG4gIGlmIChyZXN1bHQ/LmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgLy8gUGFpciBlYWNoIGRldGFpbCBib2R5IGJhY2sgdG8gaXRzIHZpc2l0IHBvc2l0aW9uLlxuICBjb25zdCBieUlkeCA9IG5ldyBNYXAoKTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXFzLmxlbmd0aDsgaSsrKSB7XG4gICAgYnlJZHguc2V0KHJlcXNbaV0uaWR4LCByZXN1bHRzW2ldPy5ib2R5IHx8IG51bGwpO1xuICB9XG4gIHJldHVybiBieUlkeDtcbn1cblxuLy8gRmFuIG91dCBJSEtFMzMwOVMwMiBkZXRhaWwgZmV0Y2hlcyBmb3IgaW5wYXRpZW50IGVuY291bnRlcnMuIExpc3Rcbi8vIGVuZHBvaW50IElIS0UzMzA5UzAxIHNoaXBzIGljZDljbV9DT0RFX0NOQU1FIENoaW5lc2Utb25seSBhbmQgaGFzXG4vLyBubyBzZWNvbmRhcnkgZGlhZ25vc2VzIGZpZWxkOyBkZXRhaWwgc2hpcHMgZnVsbCBiaWxpbmd1YWwgcHJpbWFyeVxuLy8gSUNEICsgaWNkY29kZV9kYXRhW10gd2l0aCB1cCB0byAxMisgXHU2QjIxXHU4QTNBXHU2NUI3IChcdTRGNEZcdTk2NjIgdmlzaXRzIHRlbmQgdG9cbi8vIGhhdmUgcmljaGVyIGRpZmZlcmVudGlhbCBcdTIwMTQgb2JzZXJ2ZWQgc2FtcGxlIGhhZCAxMiBzZWNvbmRhcmllcyB2c1xuLy8gNCBmb3IgdGhlIGV5ZS1jbGluaWMgT1BEIGNhc2UpLiBjdHlwZSBpcyBmaXhlZCB0byAzICg9IFx1NEY0Rlx1OTY2MikgZm9yXG4vLyB0aGlzIGVuZHBvaW50OyBwcm9iaW5nIG90aGVyIHZhbHVlcyByZXR1cm5zIGVtcHR5IGFycmF5cy5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaElucGF0aWVudERldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodiwgaWR4KSA9PiAoeyBpZHgsIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dfaWQgfHwgdi5yb1dfSUQgfHwgXCJcIiB9KSlcbiAgICAuZmlsdGVyKChyKSA9PiByLnJvd19JRCk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG5ldyBNYXAoKTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQpIHtcbiAgICAgICAgLy8gSUhLRTMzMDlTMDIgdGFrZXMgY3JpZCArIGN0eXBlIGxpa2UgdGhlIG90aGVyIFMwMiBkZXRhaWxcbiAgICAgICAgLy8gZW5kcG9pbnRzLiBjdHlwZT0zIChcdTRGNEZcdTk2NjIpIGlzIHRoZSBvbmx5IHZhbHVlIHRoYXQgcmV0dXJuc1xuICAgICAgICAvLyBkYXRhIG9uIHRoaXMgZW5kcG9pbnQgcGVyIGxpdmUgcHJvYmU7IHdlIHN0aWxsIGZhbGxiYWNrIHRvXG4gICAgICAgIC8vIDEvMiBkZWZlbnNpdmVseSBpbiBjYXNlIE5ISSdzIG1hcHBpbmcgY2hhbmdlcy5cbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMywgMiwgMV0pIHtcbiAgICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTMzMDlTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2N0fWA7XG4gICAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgICAgY29uc3QgdG0gPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICAgIGlmICghci5vaykgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBtYWluID0gYm9keT8uaWhrZTMzMDlTMDJfbWFpbl9kYXRhIHx8IFtdO1xuICAgICAgICAgICAgaWYgKG1haW4ubGVuZ3RoID4gMCkgcmV0dXJuIHsgYm9keSB9O1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgICBpZiAoZT8ubmFtZSAhPT0gXCJBYm9ydEVycm9yXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwidGltZW91dCAzMHNcIiB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBib2R5OiBudWxsIH07XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IGZldGNoT25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IGJ5SWR4ID0gbmV3IE1hcCgpO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcXMubGVuZ3RoOyBpKyspIHtcbiAgICBieUlkeC5zZXQocmVxc1tpXS5pZHgsIHJlc3VsdHNbaV0/LmJvZHkgfHwgbnVsbCk7XG4gIH1cbiAgcmV0dXJuIGJ5SWR4O1xufVxuXG4vLyBOSEkncyBTMDIgZGV0YWlsIGVuZHBvaW50cyAoSUhLRTMzMDNTMDIgZW5jb3VudGVyLCBJSEtFMzMwOVMwMlxuLy8gaW5wYXRpZW50LCAuLi4pIHdyYXAgdGhlIG1haW4gcm93IHVuZGVyIGEga2V5IG5hbWVkIGFmdGVyIHRoZVxuLy8gZW5kcG9pbnQgXHUyMDE0IGloa2UzMzAzUzAyX21haW5fZGF0YSAvIGloa2UzMzA5UzAyX21haW5fZGF0YSAvIGV0Yy5cbi8vIFRoaXMgaGVscGVyIHBpY2tzIG91dCBtYWluX2RhdGFbMF0gcmVnYXJkbGVzcyBvZiB3aGljaCBTMDIgd2UgaGl0LFxuLy8gc28gdGhlIHRocmVlIGRvd25zdHJlYW0gZXh0cmFjdG9ycyAoX2NsYXNzRnJvbVMwMkRldGFpbCxcbi8vIF9wcmltYXJ5SWNkRnJvbVMwMkRldGFpbCwgX3NlY29uZGFyeUljZHNGcm9tUzAyRGV0YWlsKSB3b3JrIHVuaWZvcm1seS5cbmZ1bmN0aW9uIF9waWNrUzAyTWFpblJvdyhib2R5KSB7XG4gIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhib2R5KSkge1xuICAgIGlmICgvXmloa2VcXGQrUzAyX21haW5fZGF0YSQvaS50ZXN0KGspICYmIEFycmF5LmlzQXJyYXkoYm9keVtrXSkgJiYgYm9keVtrXS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gYm9keVtrXVswXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0Zyb21TMDJEZXRhaWwoYm9keSkge1xuICBjb25zdCBtYWluID0gX3BpY2tTMDJNYWluUm93KGJvZHkpO1xuICBpZiAoIW1haW4pIHJldHVybiBudWxsO1xuICBjb25zdCB0biA9IFN0cmluZyhtYWluLmhvc3BfREFUQV9UWVBFX05BTUUgfHwgXCJcIik7XG4gIGlmICh0bi5pbmNsdWRlcyhcIlx1NjAyNVwiKSkgcmV0dXJuIFwiRU1FUlwiOyAgLy8gXHU2MDI1XHU4QTNBXG4gIGlmICh0bi5pbmNsdWRlcyhcIlx1NEY0Rlx1OTY2MlwiKSkgcmV0dXJuIFwiSU1QXCI7XG4gIC8vIFx1ODk3Rlx1OTFBQiAvIFx1NEUyRFx1OTFBQiAvIFx1NzI1OVx1OTFBQiAvIFx1ODVFNVx1NUM0MCBhbGwgZGVmYXVsdCB0byBBTUJcbiAgcmV0dXJuIFwiQU1CXCI7XG59XG5cbi8vIFB1bGwgdGhlIHByaW1hcnkgSUNEJ3MgYmlsaW5ndWFsIG5hbWUgZnJvbSBJSEtFMzMwM1MwMiBkZXRhaWwuIFRoZVxuLy8gbGlzdCBlbmRwb2ludCBJSEtFMzMwM1MwMSBzb21ldGltZXMgc2hpcHMgaWNEOUNNX0NPREVfQ05BTUUgYXNcbi8vIENoaW5lc2Utb25seSBcIjxjb2RlPi88XHU0RTJEXHU2NTg3PlwiOyBkZXRhaWwgY29uc2lzdGVudGx5IHNoaXBzIGZ1bGwgYmlsaW5ndWFsXG4vLyBcIjxjb2RlPi88XHU0RTJEXHU2NTg3Pnx8PGNvZGU+LzxFbmdsaXNoPlwiLiBDYWxsZXIgcGFzc2VzIHRoZSByZXN1bHQgdmlhXG4vLyBvcHRpb25zLnByaW1hcnlfZGlhZ25vc2lzIHRvIHRoZSBlbmNvdW50ZXIgYWRhcHRlciwgd2hpY2ggcHJlZmVyc1xuLy8gaXQgb3ZlciB0aGUgKHBvdGVudGlhbGx5IENoaW5lc2Utb25seSkgbGlzdC1sZXZlbCBmaWVsZC4gUmVzdWx0OlxuLy8gRW5jb3VudGVyLnJlYXNvbkNvZGVbMF0uY29kaW5nWzBdLmRpc3BsYXkgaXMgcmVsaWFibHkgRW5nbGlzaC5cbmZ1bmN0aW9uIF9wcmltYXJ5SWNkRnJvbVMwMkRldGFpbChib2R5KSB7XG4gIGNvbnN0IG1haW4gPSBfcGlja1MwMk1haW5Sb3coYm9keSk7XG4gIGlmICghbWFpbikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGNvZGVOYW1lID0gbWFpbi5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBtYWluLmljZDljbV9jb2RlX2NuYW1lIHx8IFwiXCI7XG4gIGlmICghY29kZU5hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBjb2RlID0gbWFpbi5pY2Q5Y21fQ09ERSB8fCBtYWluLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IHN0cmlwSWNkUHJlZml4ID0gKHMpID0+IFN0cmluZyhzIHx8IFwiXCIpLnJlcGxhY2UoL15bQS1aMC05Ll0rXFwvXFxzKi8sIFwiXCIpO1xuICBjb25zdCBwaWNrSGFsZiA9IChzLCBoYWxmKSA9PiB7XG4gICAgY29uc3Qgc3RyID0gU3RyaW5nKHMgfHwgXCJcIik7XG4gICAgY29uc3QgaWR4ID0gc3RyLmluZGV4T2YoXCJ8fFwiKTtcbiAgICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuIHN0ci50cmltKCk7XG4gICAgaWYgKGhhbGYgPT09IFwiemhcIikgcmV0dXJuIHN0ci5zbGljZSgwLCBpZHgpLnRyaW0oKSB8fCBzdHIuc2xpY2UoaWR4ICsgMikudHJpbSgpO1xuICAgIHJldHVybiBzdHIuc2xpY2UoaWR4ICsgMikudHJpbSgpIHx8IHN0ci5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbiAgfTtcbiAgY29uc3QgbmFtZV9lbiA9IHN0cmlwSWNkUHJlZml4KHBpY2tIYWxmKGNvZGVOYW1lLCBcImVuXCIpKTtcbiAgY29uc3QgbmFtZV96aCA9IHN0cmlwSWNkUHJlZml4KHBpY2tIYWxmKGNvZGVOYW1lLCBcInpoXCIpKTtcbiAgaWYgKCFjb2RlICYmICFuYW1lX2VuICYmICFuYW1lX3poKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgY29kZSwgbmFtZV9lbiwgbmFtZV96aCB9O1xufVxuXG4vLyBQdWxsIHNlY29uZGFyeSBkaWFnbm9zZXMgKFx1NkIyMVx1OEEzQVx1NjVCNykgZnJvbSBJSEtFMzMwM1MwMiBkZXRhaWwuIExpdmUgZGF0YVxuLy8gc2hvd3MgMC00IGVudHJpZXMgcGVyIGVuY291bnRlcjsgdGhlIGV5ZS1jbGluaWMgY2FzZSBpbiB0aGUgdGVzdFxuLy8gc2FtcGxlIG1heGVzIG91dCBhdCA0LiBFYWNoIGVudHJ5IGlzIHNoYXBlZDpcbi8vICAgeyBpY2RfdGl0OiBcIlx1NkIyMVx1OEEzQVx1NjVCN058fFNlY29uZGFyeSBEaWFnbm9zaXMgTlwiLFxuLy8gICAgIGljZF9jb2RlX25hbWU6IFwiPGNvZGU+LzxcdTRFMkRcdTY1ODc+fHw8Y29kZT4vPEVuZ2xpc2g+XCIgfVxuLy8gUmV0dXJucyBhIG5vcm1hbGl6ZWQgYXJyYXkgcGFzc2VkIHZpYSB0aGUgZW5jb3VudGVyIGFkYXB0ZXInc1xuLy8gb3B0aW9ucy5zZWNvbmRhcnlfZGlhZ25vc2VzIFx1MjE5MiBtYXBwZXIgZW1pdHMgb25lIHJlYXNvbkNvZGVbXSBlbnRyeSBwZXIgaXRlbS5cbmZ1bmN0aW9uIF9zZWNvbmRhcnlJY2RzRnJvbVMwMkRldGFpbChib2R5KSB7XG4gIGNvbnN0IG1haW4gPSBfcGlja1MwMk1haW5Sb3coYm9keSk7XG4gIGlmICghbWFpbikgcmV0dXJuIFtdO1xuICBjb25zdCBsaXN0ID0gQXJyYXkuaXNBcnJheShtYWluLmljZGNvZGVfZGF0YSkgPyBtYWluLmljZGNvZGVfZGF0YSA6IFtdO1xuICBjb25zdCBvdXQgPSBbXTtcbiAgLy8gc3RyaXAgdGhlIFwiPENPREU+L1wiIHByZWZpeCBmcm9tIGVhY2ggaGFsZiAoc2FtZSBwYXR0ZXJuIGFzXG4gIC8vIG1lZGljYXRpb24gLyBlbmNvdW50ZXIgcHJpbWFyeSBJQ0QgYmlsaW5ndWFsKVxuICBjb25zdCBzdHJpcEljZFByZWZpeCA9IChzKSA9PiBTdHJpbmcocyB8fCBcIlwiKS5yZXBsYWNlKC9eW0EtWjAtOS5dK1xcL1xccyovLCBcIlwiKTtcbiAgY29uc3QgcGlja0hhbGYgPSAocywgaGFsZikgPT4ge1xuICAgIGNvbnN0IHN0ciA9IFN0cmluZyhzIHx8IFwiXCIpO1xuICAgIGNvbnN0IGlkeCA9IHN0ci5pbmRleE9mKFwifHxcIik7XG4gICAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBzdHIudHJpbSgpO1xuICAgIGlmIChoYWxmID09PSBcInpoXCIpIHJldHVybiBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCkgfHwgc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKTtcbiAgICByZXR1cm4gc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKSB8fCBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG4gIH07XG4gIGZvciAoY29uc3QgaXRlbSBvZiBsaXN0KSB7XG4gICAgY29uc3QgY29kZU5hbWUgPSBpdGVtPy5pY2RfY29kZV9uYW1lIHx8IGl0ZW0/LmljZF9DT0RFX05BTUUgfHwgXCJcIjtcbiAgICAvLyBFeHRyYWN0IGNvZGUgZnJvbSBlaXRoZXIgaGFsZiAoYm90aCBzaWRlcyBwcmVmaXggd2l0aCBzYW1lIGNvZGUpLlxuICAgIGNvbnN0IGNvZGVNYXRjaCA9IFN0cmluZyhjb2RlTmFtZSkubWF0Y2goL14oW0EtWjAtOS5dKylcXC8vKTtcbiAgICBjb25zdCBjb2RlID0gY29kZU1hdGNoID8gY29kZU1hdGNoWzFdIDogXCJcIjtcbiAgICBjb25zdCBuYW1lX2VuID0gc3RyaXBJY2RQcmVmaXgocGlja0hhbGYoY29kZU5hbWUsIFwiZW5cIikpO1xuICAgIGNvbnN0IG5hbWVfemggPSBzdHJpcEljZFByZWZpeChwaWNrSGFsZihjb2RlTmFtZSwgXCJ6aFwiKSk7XG4gICAgaWYgKCFjb2RlICYmICFuYW1lX2VuICYmICFuYW1lX3poKSBjb250aW51ZTtcbiAgICBvdXQucHVzaCh7IGNvZGUsIG5hbWVfZW4sIG5hbWVfemggfSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3Bvc3RTdHJ1Y3R1cmVkKGJhY2tlbmQsIHBhZ2VfdHlwZSwgaXRlbXMsIHN5bmNBcGlLZXksIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy91cGxvYWQtc3RydWN0dXJlZGAsIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcGFnZV90eXBlLFxuICAgICAgaG9zdDogTkhJX0hPU1QsXG4gICAgICBpdGVtcyxcbiAgICAgIHBhdGllbnRfb3ZlcnJpZGU6IHBhdGllbnRPdmVycmlkZSB8fCBudWxsLFxuICAgIH0pLFxuICB9KTtcbiAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoYFBPU1QgdXBsb2FkLXN0cnVjdHVyZWQgJHtyLnN0YXR1c306ICR7KGF3YWl0IHIudGV4dCgpKS5zbGljZSgwLCAyMDApfWApO1xuICByZXR1cm4gYXdhaXQgci5qc29uKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBtb2RlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFJ1bnMgdGhlIHNhbWUgbWFwcGVycyB0aGUgYmFja2VuZCBydW5zLCB0aGVuIHRyaWdnZXJzIGEgZG93bmxvYWQgb2YgdGhlXG4vLyByZXN1bHRpbmcgRkhJUiBCdW5kbGUuIE5vdGhpbmcgbGVhdmVzIHRoZSB1c2VyJ3MgbWFjaGluZTsgbm8gYmFja2VuZFxuLy8gcmVxdWlyZWQuIE1pcnJvcnMgYmFja2VuZC91cGxvYWQtc3RydWN0dXJlZCBvcmRlcjogZW5jb3VudGVycyBmaXJzdCBzb1xuLy8gdGhhdCBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzIGNhbiBhdHRhY2ggcmVmZXJlbmNlcyB0byBkb3duc3RyZWFtXG4vLyBvYnNlcnZhdGlvbnMvbWVkaWNhdGlvbnMvZXRjLlxuXG5jb25zdCBfTE9DQUxfUEFHRV9UWVBFX09SREVSID0gW1xuICBcImVuY291bnRlcnNcIixcbiAgXCJvYnNlcnZhdGlvbnNcIixcbiAgXCJtZWRpY2F0aW9uc1wiLFxuICBcImNvbmRpdGlvbnNcIixcbiAgXCJhbGxlcmdpZXNcIixcbiAgXCJkaWFnbm9zdGljX3JlcG9ydHNcIixcbiAgXCJwcm9jZWR1cmVzXCIsXG4gIFwiaW1tdW5pemF0aW9uc1wiLFxuXTtcblxuLy8gQ2hlYXAgcHJlLWZsaWdodDogZG9lcyB0aGlzIE5ISSB0YWIgaGF2ZSBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24/XG4vLyBVc2VzIHRoZSBzYW1lIHNlc3Npb25TdG9yYWdlLnRva2VuICsgbGlnaHR3ZWlnaHQgQVBJIGNhbGwgcGF0dGVybiBhc1xuLy8gX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpLiBEb2Vzbid0IHJldHVybiBhbnl0aGluZyBQSUkgXHUyMDE0IGp1c3QgYVxuLy8gYm9vbGVhbiBmb3IgdGhlIHBvcHVwIHRvIGRlY2lkZSB3aGV0aGVyIHRvIHN1cmZhY2UgYSBcImxvZyBpbiBmaXJzdFwiXG4vLyBiYW5uZXIuIFJldHVybnMgbnVsbCB3aGVuIHdlIGNhbid0IHRlbGwgKHNjcmlwdC1pbmplY3Rpb24gYmxvY2tlZCxcbi8vIHRpbWVvdXQsIGV0Yy4pIHNvIHRoZSBwb3B1cCBjYW4gZmFsbCBiYWNrIHRvIFwiZW5hYmxlZFwiIHJhdGhlciB0aGFuXG4vLyBzY2FyaW5nIHRoZSB1c2VyIHdpdGggYSBmYWxzZSBuZWdhdGl2ZS5cbmFzeW5jIGZ1bmN0aW9uIF9jaGVja05oaUxvZ2luU3RhdGUodGFiSWQpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFNhbWUgZW5kcG9pbnQgYXMgdGhlIGNpZCBhdXRvLWZldGNoIFx1MjAxNCBrbm93biB0byBuZWVkIGFuXG4gICAgICAgICAgLy8gYXV0aGVudGljYXRlZCBzZXNzaW9uIGFuZCB0byBiZSBjaGVhcC5cbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goXCIvYXBpL2loa2UzMDAwL2loa2UzNDEwczAxL3BhZ2VfbG9hZFwiLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLCBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dH1gIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gNDAxLzQwMyBcdTIxOTIgc2Vzc2lvbiB0b2tlbiByZWplY3RlZC4gMjAwIFx1MjE5MiBsb2dnZWQgaW4uXG4gICAgICAgICAgcmV0dXJuIHIub2s7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gdHlwZW9mIHJlc3VsdCA9PT0gXCJib29sZWFuXCIgPyByZXN1bHQgOiBudWxsO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGVuZHBvaW50IElIS0UzNDEwUzAxIChcdTYyMTFcdTYzQTVcdTdBMkVcdTdEMDBcdTkzMDQgLyBDT1ZJRCBcdTdCRTlcdTZBQTJcdTdEMDBcdTkzMDQpIGhhcHBlbnNcbi8vIHRvIGNhcnJ5IHRoZSBsb2dnZWQtaW4gdXNlcidzIHJlYWwgY2l0aXplbiBJRCBpbiB0aGUgcmVzcG9uc2UgKGBjaWRgXG4vLyBmaWVsZCwgZS5nLiBcIlAxMjM0NTA4NjZcIikuIFVzZSBpdCB0byBzZWVkIC8gcmVmcmVzaCB0aGUgcGF0aWVudF9cbi8vIG92ZXJyaWRlJ3MgaWRfbm8gc28gaXQgYWx3YXlzIHRyYWNrcyBcIndob3NlIHNlc3Npb24gaXMgY3VycmVudGx5XG4vLyBhY3RpdmUgaW4gdGhlIE5ISSB0YWJcIi5cbi8vXG4vLyBIaXN0b3J5IG5vdGU6IHRoaXMgZnVuY3Rpb24gdXNlZCB0byBlYXJseS1yZXR1cm4gd2hlbmV2ZXIgaWRfbm8gd2FzXG4vLyBhbHJlYWR5IGEgcmVhbC1sb29raW5nIGNpZCAoXCJkb24ndCB0b3VjaCBhIG1hbnVhbGx5LWVudGVyZWQgSURcIikuXG4vLyBUaGF0IHNob3J0LWNpcmN1aXQgcHJlLWRhdGVkIHYwLjYuMCB3aGljaCByZW1vdmVkIGlkX25vIGZyb20gdGhlIFVJXG4vLyBcdTIwMTQgdGhlcmUncyBubyBcIm1hbnVhbFwiIHBhdGggYW55bW9yZSwgdGhlIGZpZWxkIGlzIHB1cmVseSBpbnRlcm5hbC5cbi8vIFRoZSBzaG9ydC1jaXJjdWl0IGFsc28gcHJvZHVjZWQgdGhlIGJ1ZyBwYXR0ZXJuOiB1c2VyIHN0YXJ0cyBzeW5jXG4vLyB3aXRoIFBhdGllbnQgQiBsb2dnZWQgaW4gKGNpZF9CIHdyaXR0ZW4gdG8gb3ZlcnJpZGUpLCByZWFsaXNlcyB3cm9uZ1xuLy8gdGFiLCBzd2l0Y2hlcyBOSEkgdGFiIHRvIFBhdGllbnQgQSwgcmUtc3luY3MgXHUyMDE0IGlkX25vIHN0YXlzIGNpZF9CXG4vLyBiZWNhdXNlIFwiYWxyZWFkeSBhIHJlYWwgY2lkXCIuIE5vdyB3ZSBhbHdheXMgcHJvYmUgYW5kIGZvbGxvdyB0aGVcbi8vIHNlc3Npb24ncyB0cnV0aC4gTWFudWFsIG92ZXJyaWRlIGlzIGdvbmUsIE5ISSBzZXNzaW9uIGlzIGF1dGhvcml0YXRpdmUuXG5hc3luYyBmdW5jdGlvbiBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCBjdXJyZW50ID0gcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCI7XG5cbiAgbGV0IGNpZCA9IG51bGw7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXQpIHJldHVybiBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MTBzMDEvcGFnZV9sb2FkXCIsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0fWAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiBudWxsO1xuICAgICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICByZXR1cm4gYm9keT8uY2lkIHx8IG51bGw7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIFZhbGlkYXRlIGl0IGxvb2tzIGxpa2UgYSBUYWl3YW4gbmF0aW9uYWwgSUQgKDEgbGV0dGVyICsgOSBkaWdpdHMpXG4gICAgLy8gYmVmb3JlIHRydXN0aW5nIGl0LiBBdm9pZHMgYWNjaWRlbnRhbGx5IHByb21vdGluZyBnYXJiYWdlIHRvIHRoZVxuICAgIC8vIFBhdGllbnQgcmVzb3VyY2UncyB1bmlxdWUga2V5LlxuICAgIGlmIChyZXN1bHQgJiYgL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHJlc3VsdCkpIGNpZCA9IHJlc3VsdDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gSUhLRTM0MTAgY2lkIGZldGNoIGZhaWxlZDpcIiwgZT8ubWVzc2FnZSA/PyBlKTtcbiAgfVxuXG4gIGlmIChjaWQgJiYgY2lkICE9PSBjdXJyZW50KSB7XG4gICAgcGF0aWVudE92ZXJyaWRlID0geyAuLi5wYXRpZW50T3ZlcnJpZGUsIGlkX25vOiBjaWQgfTtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwYXRpZW50T3ZlcnJpZGUgfSkuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgLy8gUGF0aWVudC1zd2l0Y2ggY2xlYW51cC4gSWYgdGhlIGNpZCBqdXN0IGNoYW5nZWQgZnJvbSBvbmUgcmVhbFxuICAgIC8vIGNpZCB0byBhbm90aGVyIChub3QganVzdCBcImF1dG8tWFhYWCBcdTIxOTIgcmVhbCBjaWRcIiBmaXJzdC1zeW5jIHN3YXApLFxuICAgIC8vIHRoZSBwcmV2aW91c2x5LXN0YXNoZWQgRkhJUiBidW5kbGUgYmVsb25ncyB0byB0aGUgT1RIRVIgcGF0aWVudC5cbiAgICAvLyBEcm9wIGl0IHNvIHRoZSBwb3B1cCdzIGRvd25sb2FkIGJ1dHRvbiBkb2Vzbid0IGtlZXAgb2ZmZXJpbmcgdGhlXG4gICAgLy8gd3JvbmcgcGF0aWVudCdzIGZpbGUuIFNhbWUgc2V0IG9mIHdpcGVzIHBvcHVwLmpzIGRvZXMgaW5cbiAgICAvLyBzYXZlUGF0aWVudE92ZXJyaWRlIHdoZW4gaXQgZGV0ZWN0cyBwYXRpZW50Q2hhbmdlZC5cbiAgICBjb25zdCBzd2l0Y2hlZFJlYWxQYXRpZW50cyA9XG4gICAgICBjdXJyZW50ICYmICFjdXJyZW50LnN0YXJ0c1dpdGgoXCJhdXRvLVwiKSAmJiBjdXJyZW50ICE9PSBjaWQ7XG4gICAgaWYgKHN3aXRjaGVkUmVhbFBhdGllbnRzKSB7XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhdGllbnRPdmVycmlkZTtcbn1cblxuLy8gUmVhZCB0aGUgbWFzay1uYW1lIHByZWZlcmVuY2UgZnJlc2ggZnJvbSBzdG9yYWdlLiBXZSBkb24ndCBjYWNoZSBcdTIwMTRcbi8vIHJ1bk5oaUFwaVN5bmMgaXMgaW52b2tlZCBhdCBtb3N0IGEgZmV3IHRpbWVzIHBlciBzZXNzaW9uIGFuZCB0aGUgU1dcbi8vIGNhbiBiZSB0b3JuIGRvd24gKyByZXN0YXJ0ZWQgYW55IHRpbWUsIHNvIGEgc2luZ2xlIGdldCgpIHBlciBzeW5jIGlzXG4vLyBjaGVhcGVyIHRoYW4gc3luY2luZyBzdGF0ZSBhY3Jvc3MgU1cgbGlmZWN5Y2xlcy5cbmFzeW5jIGZ1bmN0aW9uIF9pc01hc2tFbmFibGVkKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgbWFza05hbWVFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJtYXNrTmFtZUVuYWJsZWRcIik7XG4gICAgcmV0dXJuIG1hc2tOYW1lRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZE92ZXJyaWRlUGF0aWVudChvdiwgbWFza0VuYWJsZWQpIHtcbiAgY29uc3QgZGlzcGxheU5hbWUgPSBtYXNrRW5hYmxlZCA/IG1hc2tOYW1lKG92Lm5hbWUgfHwgXCJcIikgOiBvdi5uYW1lIHx8IFwiXCI7XG4gIGNvbnN0IHJhdyA9IHtcbiAgICBpZDogb3YuaWRfbm8sXG4gICAgaWRlbnRpZmllcjogb3YuaWRfbm8sXG4gICAgbmFtZTogZGlzcGxheU5hbWUgfHwgb3YuaWRfbm8sXG4gIH07XG4gIGlmIChvdi5iaXJ0aF9kYXRlKSByYXcuYmlydGhEYXRlID0gb3YuYmlydGhfZGF0ZTtcbiAgaWYgKG92LmdlbmRlcikgcmF3LmdlbmRlciA9IG92LmdlbmRlcjtcbiAgcmV0dXJuIG1hcFBhdGllbnQocmF3KTtcbn1cblxuLy8gV2FsayBhIEpTT04tbGlrZSB2YWx1ZSBhbmQgcmVwbGFjZSBldmVyeSBzdHJpbmcgdG9rZW4gZXF1YWwgdG8gb3Jcbi8vIGNvbnRhaW5pbmcgYG5lZWRsZWAgd2l0aCBgcmVwbGFjZW1lbnRgLiBVc2VkIHRvIHNjcnViIHRoZSByZWFsXG4vLyBwYXRpZW50IG5hbWUgb3V0IG9mIE5ISSBuYXJyYXRpdmUgZmllbGRzIChjbGluaWNhbF9ub3RlLCBjb25jbHVzaW9uLFxuLy8gbm90ZSwgZXRjLikgYmVmb3JlIHRoZSBpdGVtcyByZWFjaCB0aGUgbWFwcGVyLiBPbmx5IHRyaWdnZXJlZCB3aGVuXG4vLyB0aGUgdXNlciBoYXMgb3B0ZWQgaW50byBtYXNraW5nIEFORCBzdXBwbGllZCBhIG5hbWUgXHUyMDE0IGFuZCB0aGVcbi8vIHN1YnN0aXR1dGlvbiBpcyBleGFjdC10b2tlbi1yZXBsYWNlLCBub3QgZnV6enksIHNvIGl0IGNhbid0IHN1cnByaXNlXG4vLyB0aGUgdXNlciBieSBjbG9iYmVyaW5nIHVucmVsYXRlZCBjb250ZW50LlxuZnVuY3Rpb24gX3JlcGxhY2VOYW1lRGVlcCh2YWx1ZSwgbmVlZGxlLCByZXBsYWNlbWVudCkge1xuICBpZiAoIW5lZWRsZSB8fCBuZWVkbGUgPT09IHJlcGxhY2VtZW50KSByZXR1cm4gdmFsdWU7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHJldHVybiB2YWx1ZS5zcGxpdChuZWVkbGUpLmpvaW4ocmVwbGFjZW1lbnQpO1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHJldHVybiB2YWx1ZS5tYXAoKHYpID0+IF9yZXBsYWNlTmFtZURlZXAodiwgbmVlZGxlLCByZXBsYWNlbWVudCkpO1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHZhbHVlKSBvdXRba10gPSBfcmVwbGFjZU5hbWVEZWVwKHZhbHVlW2tdLCBuZWVkbGUsIHJlcGxhY2VtZW50KTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKSB7XG4gIGNvbnN0IHBhdGllbnQgPSBfYnVpbGRPdmVycmlkZVBhdGllbnQocGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCk7XG4gIGNvbnN0IHBpZCA9IHBhdGllbnQuaWQ7XG4gIGNvbnN0IGFsbCA9IFtwYXRpZW50XTtcblxuICBmb3IgKGNvbnN0IHB0IG9mIF9MT0NBTF9QQUdFX1RZUEVfT1JERVIpIHtcbiAgICBjb25zdCBpdGVtcyA9IGJ5VHlwZVtwdF07XG4gICAgaWYgKCFpdGVtcyB8fCBpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGxldCBtYXBwZWQ7XG4gICAgaWYgKEdST1VQX0hBTkRMRVJTW3B0XSkge1xuICAgICAgbWFwcGVkID0gR1JPVVBfSEFORExFUlNbcHRdKGl0ZW1zLCBwaWQpO1xuICAgIH0gZWxzZSBpZiAoTElTVF9IQU5ETEVSU1twdF0pIHtcbiAgICAgIGNvbnN0IFtmbl0gPSBMSVNUX0hBTkRMRVJTW3B0XTtcbiAgICAgIG1hcHBlZCA9IGl0ZW1zXG4gICAgICAgIC5maWx0ZXIoKGl0KSA9PiBpdCAmJiB0eXBlb2YgaXQgPT09IFwib2JqZWN0XCIpXG4gICAgICAgIC5tYXAoKGl0KSA9PiBmbihpdCwgcGlkKSlcbiAgICAgICAgLmZpbHRlcigocikgPT4gciAhPT0gbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAocHQgPT09IFwiZW5jb3VudGVyc1wiKSBtYXBwZWQgPSBkZWR1cEFkbWlzc2lvbkRheUFtYihtYXBwZWQpO1xuICAgIGFsbC5wdXNoKC4uLm1hcHBlZCk7XG4gIH1cblxuICAvLyBEZWR1cCBieSAocmVzb3VyY2VUeXBlLCBpZCkgYmVmb3JlIGFzc2VtYmxpbmcgdGhlIEJ1bmRsZS4gTXVsdGlwbGVcbiAgLy8gTkhJIGVuZHBvaW50cyBjYW4gZmVlZCB0aGUgc2FtZSBwYWdlX3R5cGUgKGUuZy4gZW5jb3VudGVycyAvXG4gIC8vIGlucGF0aWVudCAvIGlucGF0aWVudF9sZWdhY3kgYWxsIFx1MjE5MiBwYWdlX3R5cGU9XCJlbmNvdW50ZXJzXCIpLCBhbmQgdGhlXG4gIC8vIG1hcHBlciBwcm9kdWNlcyBkZXRlcm1pbmlzdGljIHN0YWJsZSBJRHMgXHUyMDE0IHNvIHR3byByYXcgaXRlbXMgdGhhdFxuICAvLyBkZXNjcmliZSB0aGUgc2FtZSBtZWRpY2FsIGV2ZW50IGNvbGxhcHNlIHRvIG9uZSByZXNvdXJjZS4gQmFja2VuZFxuICAvLyB1cHNlcnQgaGFuZGxlcyB0aGlzIGF1dG9tYXRpY2FsbHkgKHNhbWUgc3RhYmxlIElEID0gc2FtZSBEQiByb3cpO1xuICAvLyBsb2NhbCBtb2RlIGhhcyB0byBkbyBpdCBleHBsaWNpdGx5LiBXaXRob3V0IHRoaXMgZGVkdXAsIHRoZSBsb2NhbFxuICAvLyBCdW5kbGUgZW5kcyB1cCBpbmZsYXRlZCByZWxhdGl2ZSB0byB3aGF0IGJhY2tlbmQgc3RvcmVzIGZyb20gdGhlXG4gIC8vIGlkZW50aWNhbCBOSEkgaW5wdXQuXG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gIGNvbnN0IHVuaXF1ZSA9IFtdO1xuICBmb3IgKGNvbnN0IHIgb2YgYWxsKSB7XG4gICAgY29uc3Qga2V5ID0gYCR7ci5yZXNvdXJjZVR5cGV9LyR7ci5pZH1gO1xuICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICBzZWVuLmFkZChrZXkpO1xuICAgIHVuaXF1ZS5wdXNoKHIpO1xuICB9XG5cbiAgLy8gTGlua2VyICsgc2V4LXN0cmF0aWZpZWQgcmVzb2x2ZXIgcnVuIG9uY2Ugb3ZlciB0aGUgZnVsbCBhc3NlbWJsZWRcbiAgLy8gbGlzdCAoc2FtZSBwaXBlbGluZSBiYWNrZW5kJ3MgL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQgcnVucywganVzdFxuICAvLyBhZ2FpbnN0IGFuIGluLW1lbW9yeSBjYW5kaWRhdGUgYXJyYXkgaW5zdGVhZCBvZiBhIFNRTGl0ZSBxdWVyeSkuXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXModW5pcXVlLCB1bmlxdWUpO1xuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyhwYXRpZW50LCB1bmlxdWUpO1xuXG4gIHJldHVybiB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkJ1bmRsZVwiLFxuICAgIHR5cGU6IFwiY29sbGVjdGlvblwiLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLlxcZCtaJC8sIFwiWlwiKSxcbiAgICBlbnRyeTogdW5pcXVlLm1hcCgocikgPT4gKHtcbiAgICAgIGZ1bGxVcmw6IGAke3IucmVzb3VyY2VUeXBlfS8ke3IuaWR9YCxcbiAgICAgIHJlc291cmNlOiByLFxuICAgIH0pKSxcbiAgfTtcbn1cblxuLy8gTG9jYWwgbW9kZSBzdGFzaGVzIHRoZSBhc3NlbWJsZWQgQnVuZGxlIGluIGNocm9tZS5zdG9yYWdlLnNlc3Npb25cbi8vIHVuZGVyIGEgc2luZ2xlIFwicGVuZGluZ0ZoaXJCdW5kbGVcIiBzbG90LiBUaGUgcG9wdXAgc2hvd3MgYSBkb3dubG9hZFxuLy8gYnV0dG9uIHdoZW4gdGhpcyBzbG90IGlzIG5vbi1lbXB0eTsgdGhlIGFjdHVhbCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkXG4vLyBjYWxsIGhhcHBlbnMgZnJvbSB0aGUgcG9wdXAgKGluIHJlc3BvbnNlIHRvIGEgdXNlciBjbGljaykgc28gdGhlIGZpbGVcbi8vIGRvZXNuJ3QgYXBwZWFyIGluIHRoZSBEb3dubG9hZHMgYmFyIHVuaW52aXRlZC5cbi8vXG4vLyBXaHkgc2Vzc2lvbiAobm90IGxvY2FsKSBcdTIwMTQgc2VjdXJpdHkgYXVkaXQgIzU6IFBISSBwZXJzaXN0ZWQgaW5cbi8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIHN1cnZpdmVzIGJyb3dzZXIgcmVzdGFydHMgaW5kZWZpbml0ZWx5LiBUaGVcbi8vIE1WMy1uYXRpdmUgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbiBpcyB3aXBlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlXG4vLyBicm93c2VyIGNsb3NlcywgZHJhc3RpY2FsbHkgc2hyaW5raW5nIHRoZSBkaXNrLXJlc2lkZW50IFBISSB3aW5kb3cuXG4vL1xuLy8gQWRkaXRpb25hbGx5OlxuLy8gICAtIFNpbmdsZSBzbG90IG1lYW5zIGEgbmV3IHN5bmMgb3ZlcndyaXRlcyB0aGUgcHJldmlvdXMgcGVuZGluZyBidW5kbGUuXG4vLyAgIC0gVGhlIHBvcHVwJ3MgZG93bmxvYWRQZW5kaW5nQnVuZGxlIHdpcGVzIHRoZSBzbG90IHRoZSBtb21lbnQgdGhlXG4vLyAgICAgdXNlci1pbml0aWF0ZWQgZG93bmxvYWQgY29tcGxldGVzLlxuLy8gICAtIEEgcGVyaW9kaWMgY2hyb21lLmFsYXJtcyBzd2VlcCAoUEVORElOR19CVU5ETEVfVFRMX01TKSB3aXBlcyB0aGVcbi8vICAgICBzbG90IGlmIHRoZSB1c2VyIGxlYXZlcyBhIHN5bmMgc2l0dGluZyB1bmNvbnN1bWVkIGZvciBhbiBob3VyLlxuLy8gY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbiBkZWZhdWx0IHF1b3RhIGlzIDEwIE1COyBhIHR5cGljYWwgTkhJIHN5bmMgaXNcbi8vIHdlbGwgdW5kZXIgMiBNQi5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcbmNvbnN0IFBFTkRJTkdfQlVORExFX1RUTF9NUyA9IDYwICogNjAgKiAxMDAwOyAvLyAxIGhvdXJcbmNvbnN0IFBFTkRJTkdfQlVORExFX1NXRUVQX0FMQVJNID0gXCJwZW5kaW5nLWJ1bmRsZS1zd2VlcFwiO1xuXG4vLyBEZWJ1ZyB0b2dnbGUgZm9yIHRoZSBwZXItZW5kcG9pbnQgXCJmaXJzdCBib2R5IHNhbXBsZVwiIHN0YXNoIHVzZWQgdG9cbi8vIGRpYWdub3NlIGFkYXB0ZXIgbWlzbWF0Y2hlcyAocmF3X2NvdW50ID4gMCBidXQgYWRhcHRlZF9jb3VudCA9PSAwKS5cbi8vIEhBUkQtT0ZGIGluIHRoZSBwdWJsaXNoZWQgZXh0ZW5zaW9uOiB0aGUgc2FtcGxlIGNvbnRhaW5zIHJhdyBOSElcbi8vIHBheWxvYWQgKGxhYiB2YWx1ZXMsIGRydWcgbmFtZXMsIGVuY291bnRlciByZWNvcmRzIFx1MjAxNCBQSEkpLiBGbGlwIHRvXG4vLyB0cnVlICpsb2NhbGx5KiBkdXJpbmcgYWRhcHRlciBkZXZlbG9wbWVudDsgbmV2ZXIgY29tbWl0IGB0cnVlYC5cbmNvbnN0IERFQlVHX1NUQVNIX0JPRFlfU0FNUExFUyA9IGZhbHNlO1xuXG5hc3luYyBmdW5jdGlvbiBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudElkLCBkYXRlUmFuZ2UpIHtcbiAgLy8gRmlsZW5hbWU6IG5oaS17cGlkfS17c3RhcnRZWVlZTU1ERH0te2VuZFlZWVlNTUREfS5qc29uXG4gIC8vIFdoZW4gbm8gZXhwbGljaXQgZGF0ZVJhbmdlIChOSEkgZGVmYXVsdCA9IFx1OEZEMSAxIFx1NUU3NCksIHN5bnRoZXNpemUgdG9kYXktMXkgXHUyMTkyIHRvZGF5LlxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgY29uc3QgZm10ID0gKGQpID0+IGAke2QuZ2V0RnVsbFllYXIoKX0ke3BhZChkLmdldE1vbnRoKCkgKyAxKX0ke3BhZChkLmdldERhdGUoKSl9YDtcbiAgLy8gSGFsZi1tYXNrIHRoZSBJRCBpbiB0aGUgZmlsZW5hbWUgc28gdGhlIHVzZXIncyBEb3dubG9hZHMgZm9sZGVyXG4gIC8vIGRvZXNuJ3QgbGVhayB0aGUgZnVsbCBcdThFQUJcdTUyMDZcdThCNDkgKHdvdWxkIGJlIHZpc2libGUgdG8gYW55b25lIHNlZWluZ1xuICAvLyBhIGZpbGUgbGlzdGluZyBvciBkb3dubG9hZC1iYXIgcHJldmlldykuIGBYYCBiZWNhdXNlIGAqYCBpc1xuICAvLyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIEJ1bmRsZSBDT05URU5UUyBzdGlsbCBjYXJyeSB0aGUgcmVhbFxuICAvLyBJRCB1bmRlciBQYXRpZW50LmlkIFx1MjAxNCBmaWxlIG93bmVyIGtub3dzIHdob3NlIGRhdGEgaXQgaXMuXG4gIGNvbnN0IG1hc2tlZFBpZCA9IG1hc2tJZChwYXRpZW50SWQgfHwgXCJ1bmtub3duXCIsIFwiWFwiKTtcbiAgY29uc3Qgc2FmZVBpZCA9IG1hc2tlZFBpZC5yZXBsYWNlKC9bXkEtWmEtejAtOV8tXS9nLCBcIl9cIik7XG4gIGNvbnN0IGNvbXBhY3QgPSAoZCkgPT4gKGQgfHwgXCJcIikuc2xpY2UoMCwgMTApLnJlcGxhY2UoLy0vZywgXCJcIik7XG4gIGxldCBzLCBlO1xuICBpZiAoZGF0ZVJhbmdlICYmIChkYXRlUmFuZ2Uuc3RhcnQgfHwgZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICBzID0gY29tcGFjdChkYXRlUmFuZ2Uuc3RhcnQpIHx8IGZtdChub3cpO1xuICAgIGUgPSBjb21wYWN0KGRhdGVSYW5nZS5lbmQpIHx8IGZtdChub3cpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG9uZVllYXJBZ28gPSBuZXcgRGF0ZShub3cpO1xuICAgIG9uZVllYXJBZ28uc2V0RnVsbFllYXIob25lWWVhckFnby5nZXRGdWxsWWVhcigpIC0gMSk7XG4gICAgcyA9IGZtdChvbmVZZWFyQWdvKTtcbiAgICBlID0gZm10KG5vdyk7XG4gIH1cbiAgY29uc3QgZmlsZW5hbWUgPSBgbmhpLSR7c2FmZVBpZH0tJHtzfS0ke2V9Lmpzb25gO1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoYnVuZGxlLCBudWxsLCAyKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5zZXQoe1xuICAgIFtQRU5ESU5HX0JVTkRMRV9LRVldOiB7XG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGpzb24sXG4gICAgICBieXRlczoganNvbi5sZW5ndGgsXG4gICAgICBnZW5lcmF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIHBhdGllbnRJZDogcGF0aWVudElkIHx8IG51bGwsXG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiB7IGZpbGVuYW1lLCBieXRlczoganNvbi5sZW5ndGggfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuTmhpQXBpU3luYyh7IHRhYklkLCBtb2RlLCBiYWNrZW5kLCBzeW5jQXBpS2V5LCBuaGlCYXNlLCBwYXRpZW50T3ZlcnJpZGUsIGRhdGVSYW5nZSwgZGF0ZVJhbmdlTGFiZWwgfSkge1xuICBfY2FuY2VsbGVkID0gZmFsc2U7XG4gIGNvbnN0IEJBU0UgPSBuaGlCYXNlIHx8IGBodHRwczovLyR7TkhJX0hPU1R9YDtcblxuICBpZiAoIXBhdGllbnRPdmVycmlkZSkge1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU4QUNCXHU1MTQ4XHU1MjMwXHUzMDBDXHUyNDYxIFx1NjBBOFx1NzY4NFx1OENDN1x1NjU5OVx1MzAwRFx1NTg2Qlx1NUJFQlx1OENDN1x1NjU5OVx1NUY4Q1x1NTE4RFx1OEE2NlwiLFxuICAgICAgICBwaGFzZTogXCJlcnJvclwiLCB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCF0YWJJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkFQSSBzeW5jIHJlcXVpcmVzIE5ISSB0YWIgaWQgKGNvb2tpZXMgYXJlIGZpcnN0LXBhcnR5KVwiKTtcbiAgfVxuXG4gIC8vIEZpcnN0IGNoYW5jZSB0byB1cGdyYWRlIHRoZSBwYXRpZW50IElEOiBpZiB0aGUgcG9wdXAgZ2F2ZSB1cyBhblxuICAvLyBcImF1dG8tWFhYWFhYWFhcIiBwbGFjZWhvbGRlciAodXNlciBkaWRuJ3QgbWFudWFsbHkgdHlwZSBvbmUpLFxuICAvLyBmZXRjaCB0aGUgcmVhbCBvbmUgZnJvbSBOSEkncyBJSEtFMzQxMFMwMSBlbmRwb2ludCAocmVzcG9uc2UuY2lkXG4gIC8vIGlzIHRoZSBjaXRpemVuIElEKS4gUGVyc2lzdCBiYWNrIHRvIHN0b3JhZ2Ugc28gc3Vic2VxdWVudCBzeW5jc1xuICAvLyBhcmUgc3RhYmxlLiBNYW51YWxseS10eXBlZCBJRHMgYXJlIHJlc3BlY3RlZCBhcy1pcy5cbiAgcGF0aWVudE92ZXJyaWRlID0gYXdhaXQgX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpKHRhYklkLCBwYXRpZW50T3ZlcnJpZGUpO1xuXG4gIC8vIFN0YXNoIGNvbnRleHQgc28gdGhlIHN0b3BTeW5jIG1lc3NhZ2UgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4gIC8vIGRhdGEgKERFTEVURSAvc3luYy9wYXRpZW50L3tpZF9ub30pIHdpdGhvdXQgdXMgaGF2aW5nIHRvIHNlbmQgaXRcbiAgLy8gYmFjayB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlLlxuICBfYWN0aXZlU3luY0N0eCA9IHsgYmFja2VuZCwgc3luY0FwaUtleSwgcGF0aWVudElkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfTtcblxuICAvLyBXYWxsLWNsb2NrIHN0YXJ0IHRpbWUgXHUyMDE0IHVzZWQgdG8gY29tcHV0ZSBlbGFwc2VkIHNlY29uZHMgZm9yIHRoZVxuICAvLyBmaW5hbCBzdGF0dXMgbGluZSAoXCJcdTdFM0RcdTgwMTdcdTY2NDIgMTIuMyBcdTc5RDJcIikuIFN0YXNoIG9uIGEgbG9jYWwgc28gd2UgY2FuXG4gIC8vIHJlYWNoIGl0IGZyb20gdGhlIGNvbXBsZXRpb24gbWVzc2FnZSBhdCB0aGUgdmVyeSBlbmQuXG4gIGNvbnN0IF90MCA9IERhdGUubm93KCk7XG4gIC8vIFBlci1waGFzZSB0aW1pbmdzLCBzdXJmYWNlZCBpbnRvIHRoZSBwb3B1cCdzIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHNlZSBleGFjdGx5IHdoZXJlIHRpbWUgaXMgZ29pbmcuIEVhY2ggZW50cnk6IHsgbmFtZSwgbXMgfS5cbiAgY29uc3QgX3BoYXNlcyA9IFtdO1xuICBsZXQgX3BoYXNlU3RhcnQgPSBfdDA7XG4gIGNvbnN0IF9tYXJrUGhhc2UgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgX3BoYXNlcy5wdXNoKHsgbmFtZSwgbXM6IG5vdyAtIF9waGFzZVN0YXJ0IH0pO1xuICAgIF9waGFzZVN0YXJ0ID0gbm93O1xuICB9O1xuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IHRydWUsIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIiwgcGhhc2U6IFwiaW5pdFwiLFxuICAgIHN0YXJ0ZWQ6IF90MCwgdG90YWxSZXNvdXJjZXM6IDAsIGhvc3Q6IE5ISV9IT1NULCBlcnJvcnM6IFtdLFxuICB9KTtcblxuICAvLyBTdGVwIDE6IGZldGNoIGFsbCBlbmRwb2ludHMgaW4gUEFSQUxMRUwgaW5zaWRlIHRoZSBOSEkgdGFiLiBSdW5uaW5nIGluXG4gIC8vIHRhYiBjb250ZXh0IG1lYW5zIHNhbWUtb3JpZ2luIGNvb2tpZXMgYXJlIHNlbnQgYXV0b21hdGljYWxseSBcdTIwMTQgZmV0Y2hcbiAgLy8gZnJvbSB0aGUgU1cgd291bGQgYmUgY3Jvc3Mtb3JpZ2luIGFuZCBTYW1lU2l0ZSBibG9ja3MgdGhlIHNlc3Npb25cbiAgLy8gY29va2llLCBoZW5jZSB3ZSBnb3QgXCJzZXNzaW9uIGV4cGlyZWRcIiBldmVuIHdoZW4gbG9nZ2VkIGluLlxuICAvLyBQYXNzIG9ubHkgc2VyaWFsaXNhYmxlIGRhdGEgKHBhdGhzLCBtZXRob2QsIG5hbWUpOyBhZGFwdGVycyBzdGF5IGluIFNXLlxuICAvLyBJbmplY3QgSVNPLWRhdGUgcmFuZ2UgaW50byBlYWNoIGVuZHBvaW50IHRoYXQgc3VwcG9ydHMgaXQgKGNvbnZlcnRzXG4gIC8vIHRvIFx1NkMxMVx1NTcwQiBmb3JtYXQgdmlhIGlzb1RvUk9DKS4gU2tpcHBlZCBlbmRwb2ludHMga2VlcCB0aGVpciBkZWZhdWx0XG4gIC8vIE5ISS1zaWRlIHdpbmRvdyAoMS0yIHllYXJzIGRlcGVuZGluZyBvbiB0aGUgcGFnZSkuXG4gIGNvbnN0IGZldGNoU3BlYyA9IE5ISV9BUElfRU5EUE9JTlRTLm1hcCgoZXApID0+IHtcbiAgICBjb25zdCBwYXRoID0gZXAuc3VwcG9ydHNEYXRlUmFuZ2UgPyBhcHBseURhdGVSYW5nZVRvUGF0aChlcC5wYXRoLCBkYXRlUmFuZ2UpIDogZXAucGF0aDtcbiAgICByZXR1cm4geyBuYW1lOiBlcC5uYW1lLCB1cmw6IEJBU0UgKyBwYXRoLCBtZXRob2Q6IFwiR0VUXCIgfTtcbiAgfSk7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIGNvbnNvbGUubG9nKFwiW05ISSBBUEkgc3luY10gZGF0ZSByYW5nZTpcIixcbiAgICAgIGAke2RhdGVSYW5nZS5zdGFydCB8fCBcIih1bmJvdW5kZWQpXCJ9IFx1MjE5MiAke2RhdGVSYW5nZS5lbmQgfHwgXCIodW5ib3VuZGVkKVwifWApO1xuICB9XG5cbiAgbGV0IHNldHRsZWRSYXc7XG4gIHRyeSB7XG4gICAgW3sgcmVzdWx0OiBzZXR0bGVkUmF3IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKHNwZWNzKSA9PiB7XG4gICAgICAgIC8vIE5ISSBhdXRoOiBjb29raWVzICsgSldUIGluIHNlc3Npb25TdG9yYWdlLiBUaGUgU1BBJ3MgYXhpb3Mgc2V0c1xuICAgICAgICAvLyBgQXV0aG9yaXphdGlvbjogQmVhcmVyIDx0b2tlbj5gIG9uIGV2ZXJ5IEFQSSBjYWxsLiBTZXNzaW9uXG4gICAgICAgIC8vIGNvb2tpZXMgYWxvbmUgcmV0dXJuIDQwMS5cbiAgICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdG9rZW4pIHJldHVybiBbeyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9XTtcbiAgICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuXG4gICAgICAgIC8vIERldGVjdCBJRExFL3RpbWVvdXQgcGFnZSBhbHJlYWR5IHJlZGlyZWN0ZWQgb24gdGhpcyB0YWIuXG4gICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgICByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyA2MC1zZWNvbmQgdGltZW91dCBwZXIgZmV0Y2ggXHUyMDE0IHNvbWUgTkhJIGVuZHBvaW50cyAoZW5jb3VudGVycyxcbiAgICAgICAgLy8gbWVkcykgdGFrZSAyMCsgc2Vjb25kcy5cbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocywgbXMpIHtcbiAgICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgbXMpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2gocy51cmwsIHtcbiAgICAgICAgICAgICAgbWV0aG9kOiBzLm1ldGhvZCxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgICAgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBjb25zdCBjdCA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICAgIGlmICghY3QuaW5jbHVkZXMoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IGBub24tSlNPTiAoY3Q9JHtjdH0pYCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgICAgICB0cnkgeyBib2R5ID0gYXdhaXQgci5qc29uKCk7IH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiSlNPTiBwYXJzZTogXCIgKyBlLm1lc3NhZ2UgfTsgfVxuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBib2R5IH07XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGlmIChlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcInRpbWVvdXQgNjBzXCIgfTtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uY3VycmVuY3ktbGltaXRlZCBleGVjdXRpb246IG1heCAzIGluIGZsaWdodCBhdCBvbmNlLiBOSEknc1xuICAgICAgICAvLyBhYnVzZSBkZXRlY3Rpb24gYmxvY2tzIGJ1cnN0czsgd2l0aCAxMSBwYXJhbGxlbCBmZXRjaGVzIGl0XG4gICAgICAgIC8vIHRocm90dGxlZCB0aGUgc2Vzc2lvbiBhbmQgcmVkaXJlY3RlZCB0byBJSEtFMzAwMVM5OV9JRExFLlxuICAgICAgICAvLyAzIGF0IGEgdGltZSArIDIwMG1zIGppdHRlciBpcyBnZW50bGUgZW5vdWdoIGZvciAxLXNob3Qgc3luYy5cbiAgICAgICAgY29uc3QgQ09OQ1VSUkVOQ1kgPSAzO1xuICAgICAgICBjb25zdCBKSVRURVJfTVMgPSAyMDA7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBuZXcgQXJyYXkoc3BlY3MubGVuZ3RoKTtcbiAgICAgICAgbGV0IG5leHRJZHggPSAwO1xuICAgICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgICAgd2hpbGUgKG5leHRJZHggPCBzcGVjcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBuZXh0SWR4Kys7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIEpJVFRFUl9NUykpO1xuICAgICAgICAgICAgcmVzdWx0c1tpXSA9IGF3YWl0IGZldGNoT25lKHNwZWNzW2ldLCA2MDAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdvcmtlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DVVJSRU5DWSAmJiB3IDwgc3BlY3MubGVuZ3RoOyB3KyspIHtcbiAgICAgICAgICB3b3JrZXJzLnB1c2god29ya2VyKCkpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdvcmtlcnMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0sXG4gICAgICBhcmdzOiBbZmV0Y2hTcGVjXSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgZXhlY3V0ZVNjcmlwdCBmYWlsZWQ6ICR7ZS5tZXNzYWdlfWApO1xuICB9XG5cbiAgLy8gRGV0ZWN0IHNlc3Npb24gZXhwaXJlZCBhY3Jvc3MgcmVzdWx0cy5cbiAgaWYgKHNldHRsZWRSYXcuc29tZSgocikgPT4gci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgfVxuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuXG4gIC8vIEdlbmVyaWMgbGlzdCBleHRyYWN0aW9uOiBoYW5kbGVzIGFsbCBvYnNlcnZlZCBOSEkgc2hhcGVzLlxuICAvLyAgIC0gUGxhaW4gYXJyYXkgKElIS0UzNDA5IGxhYilcbiAgLy8gICAtIHtzcF9JSEtFPFg+X2RhdGE6IFsuLi5dfSAgKG1lZGljYXRpb25zLCBhbGxlcmdpZXMpXG4gIC8vICAgLSB7d2VzdGVybl9kYXRhLCBjaGluZXNlX2RhdGEsIGRlbnRpc3RfZGF0YTogWy4uLl19IChlbmNvdW50ZXIgbGlzdCxcbiAgLy8gICAgIHNwbGl0IGJ5IFx1ODk3Rlx1OTFBQi9cdTRFMkRcdTkxQUIvXHU3MjU5XHU5MUFCIFx1MjAxNCB3ZSB3YW50IGFsbCB0aHJlZSlcbiAgLy8gRm9yIG11bHRpLWFycmF5IHNoYXBlcyB3ZSBtZXJnZSBhbGwgYXJyYXlzIGFuZCB0YWcgZWFjaCBpdGVtIHdpdGhcbiAgLy8gYF9fc2VjdGlvbmAgKHRoZSBzb3VyY2Uga2V5KSBzbyBhZGFwdGVycyBjYW4gZGlzYW1iaWd1YXRlLlxuICBmdW5jdGlvbiBleHRyYWN0TGlzdChib2R5KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYm9keSkpIHJldHVybiBib2R5O1xuICAgIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIFtdO1xuICAgIGxldCBhcnJheUtleXMgPSBPYmplY3QuZW50cmllcyhib2R5KS5maWx0ZXIoKFtfLCB2XSkgPT4gQXJyYXkuaXNBcnJheSh2KSk7XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICBpZiAoYXJyYXlLZXlzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTtcbiAgICAvLyBNdWx0aXBsZSBhcnJheXMgXHUyMDE0IGRyb3AgVUktaGVscGVyIGFycmF5cyAoZHJvcGRvd24gb3B0aW9ucywgc29ydFxuICAgIC8vIHNlbGVjdG9ycywgbG9va3VwIHRhYmxlcykuIE5ISSBtaXhlcyB0aGVtIGludG8gdGhlIHNhbWUgcmVzcG9uc2VcbiAgICAvLyAoZS5nLiBpbWFnaW5nIHJldHVybnMgc3BfSUhLRTM0MDhTMDFfZGF0YSArIGljZDljbV9zZWxlY3QpLlxuICAgIGNvbnN0IEhFTFBFUl9SRSA9IC9zZWxlY3R8b3B0aW9ufGRyb3Bkb3dufGZpbHRlcnxzb3J0fGxvb2t1cC9pO1xuICAgIGNvbnN0IGRhdGFLZXlzID0gYXJyYXlLZXlzLmZpbHRlcigoW2tdKSA9PiAhSEVMUEVSX1JFLnRlc3QoaykpO1xuICAgIGlmIChkYXRhS2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBkYXRhS2V5c1swXVsxXTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gYXJyYXlLZXlzWzBdWzFdOyAvLyBmYWxsYmFja1xuICAgIGFycmF5S2V5cyA9IGRhdGFLZXlzO1xuICAgIC8vIE11bHRpcGxlIGRhdGEgYXJyYXlzIChlLmcuIHdlc3Rlcm5fZGF0YS9jaGluZXNlX2RhdGEvZGVudGlzdF9kYXRhKVxuICAgIC8vIFx1MjAxNCBtZXJnZSB3aXRoIF9fc2VjdGlvbiB0YWcgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBhcnJheUtleXMpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSB7XG4gICAgICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goeyAuLi5pdGVtLCBfX3NlY3Rpb246IGsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfVxuXG4gIC8vIEFwcGx5IFNXLXNpZGUgYWRhcHRlcnMgdG8gZWFjaCBlbmRwb2ludCdzIGJvZHkuXG4gIGNvbnN0IHNldHRsZWQgPSBzZXR0bGVkUmF3Lm1hcCgociwgaSkgPT4ge1xuICAgIGNvbnN0IGVwID0gTkhJX0FQSV9FTkRQT0lOVFNbaV07XG4gICAgaWYgKHIuZXJyb3IpIHtcbiAgICAgIHJldHVybiB7IHN0YXR1czogXCJyZWplY3RlZFwiLCByZWFzb246IHsgbWVzc2FnZTogYCR7ZXAubmFtZX06ICR7ci5lcnJvcn1gIH0gfTtcbiAgICB9XG4gICAgY29uc3QgbGlzdCA9IGV4dHJhY3RMaXN0KHIuYm9keSk7XG4gICAgLy8gQWRhcHRlcnMgcmV0dXJuIGVpdGhlcjpcbiAgICAvLyAgIC0gb25lIGl0ZW0gICAobW9zdCBhZGFwdGVycyBcdTIwMTQgbGFicywgbWVkcywgZW5jb3VudGVycywgaW1hZ2luZylcbiAgICAvLyAgIC0gbnVsbC91bmRlZmluZWQgKHNraXApXG4gICAgLy8gICAtIGFycmF5IG9mIGl0ZW1zIChhZGFwdEFkdWx0UHJldmVudGl2ZSBcdTIwMTQgdW5mb2xkcyBvbmUgc2NyZWVuaW5nXG4gICAgLy8gICAgIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbiBlbnRyaWVzKVxuICAgIC8vIEZsYXQtaGFuZGxlIGJvdGggc2hhcGVzIHNvIGVhY2ggYWRhcHRlciBjYW4gcGljayB3aGF0ZXZlcidzIGNsZWFyZXN0LlxuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgZm9yIChjb25zdCBpdCBvZiBsaXN0KSB7XG4gICAgICBjb25zdCByID0gZXAuYWRhcHQoaXQpO1xuICAgICAgaWYgKHIgPT09IG51bGwgfHwgciA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHIpKSB7XG4gICAgICAgIGZvciAoY29uc3QgeCBvZiByKSBpZiAoeCkgaXRlbXMucHVzaCh4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zLnB1c2gocik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNuYXBzaG90IGEgYm9keSBzYW1wbGUgZm9yIHNoYXBlcyB3aGVyZSBhZGFwdGVyIHJlamVjdGVkIGV2ZXJ5dGhpbmdcbiAgICAvLyBcdTIwMTQgdXNlZCBieSB0aGUgZGlhZ25vc3RpYyBicmVha2Rvd24gaW4gc3RlcCAyLlxuICAgIGxldCBib2R5U2FtcGxlID0gbnVsbDtcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gSW5jbHVkZSB0aGUgRklSU1QgSVRFTSAoZnVsbCBrZXlzK3ZhbHVlcykgc28gd2UgY2FuIGJ1aWxkIHRoZVxuICAgICAgLy8gY29ycmVjdCBhZGFwdGVyIHdpdGhvdXQgYW5vdGhlciByb3VuZC10cmlwLiBOSEkgaXRlbXMgbWF5IGluY2x1ZGVcbiAgICAgIC8vIFBJSTsgdGhlIHVzZXIgaW5zcGVjdHMgdGhpcyBsb2NhbGx5IHZpYSBzZXJ2aWNlLXdvcmtlciBkZXZ0b29scy5cbiAgICAgIGJvZHlTYW1wbGUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHRvcExldmVsS2V5czogQXJyYXkuaXNBcnJheShyLmJvZHkpID8gbnVsbCA6IE9iamVjdC5rZXlzKHIuYm9keSB8fCB7fSkuc2xpY2UoMCwgMTApLFxuICAgICAgICB3YXNBcnJheTogQXJyYXkuaXNBcnJheShyLmJvZHkpLFxuICAgICAgICBmaXJzdEl0ZW06IGxpc3RbMF0gPz8gbnVsbCxcbiAgICAgICAgc2Vjb25kSXRlbTogbGlzdFsxXSA/PyBudWxsLFxuICAgICAgfSkuc2xpY2UoMCwgNDAwMCk7XG4gICAgfVxuICAgIHJldHVybiB7IHN0YXR1czogXCJmdWxmaWxsZWRcIiwgdmFsdWU6IHsgZXAsIGl0ZW1zLCByYXdfY291bnQ6IGxpc3QubGVuZ3RoLCBib2R5U2FtcGxlLCByYXdMaXN0OiBsaXN0IH0gfTtcbiAgfSk7XG5cbiAgX21hcmtQaGFzZShcIm5oaS1wYXJhbGxlbFwiKTtcblxuICAvLyBTdGVwIDFhOiBlbmNvdW50ZXIgZGV0YWlsIGZhbi1vdXQgKElIS0UzMzAzUzAyKSBcdTIxOTIgY2xhc3NpZnkgZWFjaFxuICAvLyBJSEtFMzMwM1MwMSB2aXNpdCBhcyBBTUIgLyBFTUVSIC8gSU1QIHZpYSBob3NwX0RBVEFfVFlQRV9OQU1FLlxuICAvLyBMaXN0IGVuZHBvaW50IGRvZXNuJ3QgZXhwb3NlIFx1NjAyNVx1OEEzQSBkaXN0aW5jdGlvbjsgZGV0YWlsIGRvZXMuIFdlIHJlLVxuICAvLyBhZGFwdCBlYWNoIGVuY291bnRlciBpdGVtIHdpdGggdGhlIGRpc2NvdmVyZWQgY2xhc3MgYmVmb3JlIHRoZVxuICAvLyBiYWNrZW5kIHVwbG9hZCBzdGVwLlxuICAvLyBDcm9zcy1yZWZlcmVuY2U6IGJ1aWxkIGEgc2V0IG9mIHJvd19JRHMgdGhhdCB0aGUgbWVkaWNhdGlvbiAvIGNocm9uaWNcbiAgLy8gbGlzdCBlbmRwb2ludHMgcmVwb3J0ZWQgYXMgb3JpX1RZUEVfTkFNRT1cIlx1ODVFNVx1NUM0MFwiLiBJSEtFMzMwMyBpdHNlbGZcbiAgLy8gbGFja3MgdGhlIHZpc2l0LXR5cGUgZmllbGQsIHNvIHRoaXMgaXMgaG93IHdlIGNsYXNzaWZ5IHBoYXJtYWN5XG4gIC8vIHBpY2t1cCBldmVudHMgd2l0aG91dCByZXNvcnRpbmcgdG8gaG9zcGl0YWwtbmFtZSBzdHJpbmcgbWF0Y2hpbmcuXG4gIC8vIChBZGFwdGVyIHN0aWxsIHVzZXMgaG9zcGl0YWwgbmFtZSBhcyBhIGRlZmVuc2l2ZSBmYWxsYmFjayBpZiBlaXRoZXJcbiAgLy8gbWVkaWNhdGlvbiBlbmRwb2ludCBmYWlsZWQuKVxuICBjb25zdCBwaGFybWFjeVJvd0lkcyA9IG5ldyBTZXQoKTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIFtcIm1lZGljYXRpb25zXCIsIFwiY2hyb25pY19wcmVzY3JpcHRpb25zXCJdKSB7XG4gICAgY29uc3QgaWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmIChpZHggPCAwIHx8IHNldHRsZWRbaWR4XT8uc3RhdHVzICE9PSBcImZ1bGZpbGxlZFwiKSBjb250aW51ZTtcbiAgICBmb3IgKGNvbnN0IHYgb2Ygc2V0dGxlZFtpZHhdLnZhbHVlLnJhd0xpc3QgfHwgW10pIHtcbiAgICAgIGNvbnN0IGlkID0gdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEO1xuICAgICAgY29uc3Qgb3JpVHlwZU5hbWUgPSB2Lm9yaV9UWVBFX05BTUUgfHwgdi5vcmlfdHlwZV9uYW1lIHx8IFwiXCI7XG4gICAgICBpZiAoaWQgJiYgb3JpVHlwZU5hbWUuaW5jbHVkZXMoXCJcdTg1RTVcdTVDNDBcIikpIHtcbiAgICAgICAgcGhhcm1hY3lSb3dJZHMuYWRkKGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBlbmNJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJlbmNvdW50ZXJzXCIpO1xuICBpZiAoZW5jSWR4ID49IDAgJiYgc2V0dGxlZFtlbmNJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGV0YWlsTWFwID0gYXdhaXQgX3dpdGhQcm9ncmVzc1RpbWVyKFxuICAgICAgICAgIChzZWMpID0+XG4gICAgICAgICAgICBzZWMgPT09IDBcbiAgICAgICAgICAgICAgPyBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUMzMVx1OTFBQlx1N0QwMFx1OTMwNFx1OEE3M1x1NjBDNVx1MjAyNmBcbiAgICAgICAgICAgICAgOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUMzMVx1OTFBQlx1N0QwMFx1OTMwNFx1OEE3M1x1NjBDNVx1MjAyNlx1RkYwOFx1NURGMiAke3NlY30gXHU3OUQyXHVGRjA5YCxcbiAgICAgICAgICAoKSA9PiBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzIH0pLFxuICAgICAgICApO1xuICAgICAgICAvLyBSZS1hZGFwdCB3aXRoIGNsYXNzSGludCArIHNlY29uZGFyeSBkaWFnbm9zZXMgKyBiaWxpbmd1YWxcbiAgICAgICAgLy8gcHJpbWFyeSBJQ0QgYWxsIHNvdXJjZWQgZnJvbSB0aGUgUzAyIGRldGFpbCBib2R5LlxuICAgICAgICBjb25zdCByZUFkYXB0ZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aXNpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxNYXA/LmdldChpKSB8fCBudWxsO1xuICAgICAgICAgIGNvbnN0IGNscyA9IF9jbGFzc0Zyb21TMDJEZXRhaWwoZGV0YWlsKSB8fCBcIkFNQlwiO1xuICAgICAgICAgIGNvbnN0IHNlY29uZGFyeURpYWdub3NlcyA9IF9zZWNvbmRhcnlJY2RzRnJvbVMwMkRldGFpbChkZXRhaWwpO1xuICAgICAgICAgIGNvbnN0IHByaW1hcnlEaWFnbm9zaXMgPSBfcHJpbWFyeUljZEZyb21TMDJEZXRhaWwoZGV0YWlsKTtcbiAgICAgICAgICBjb25zdCB2aXNpdCA9IHZpc2l0c1tpXTtcbiAgICAgICAgICBjb25zdCByb3dJZCA9IHZpc2l0LnJvV19JRCB8fCB2aXNpdC5yb3dfaWQgfHwgdmlzaXQucm93X0lEO1xuICAgICAgICAgIGNvbnN0IGlzUGhhcm1hY3kgPSByb3dJZCA/IHBoYXJtYWN5Um93SWRzLmhhcyhyb3dJZCkgOiBmYWxzZTtcbiAgICAgICAgICBjb25zdCBpdCA9IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UodmlzaXQsIGNscywge1xuICAgICAgICAgICAgcGhhcm1hY3k6IGlzUGhhcm1hY3ksXG4gICAgICAgICAgICBwcmltYXJ5X2RpYWdub3NpczogcHJpbWFyeURpYWdub3NpcyxcbiAgICAgICAgICAgIHNlY29uZGFyeV9kaWFnbm9zZXM6IHNlY29uZGFyeURpYWdub3NlcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXQpIHJlQWRhcHRlZC5wdXNoKGl0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXR0bGVkW2VuY0lkeF0udmFsdWUuaXRlbXMgPSByZUFkYXB0ZWQ7XG4gICAgICAgIHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZUFkYXB0ZWQubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgZW5jb3VudGVyIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJlbmNvdW50ZXItZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWEnOiBpbnBhdGllbnQgZW5jb3VudGVycyBnZXQgdGhlIHNhbWUgUzAyIGRldGFpbCBlbnJpY2htZW50XG4gIC8vIGFzIElIS0UzMzAzIE9QRCBlbmNvdW50ZXJzIFx1MjAxNCBJSEtFMzMwOVMwMSBsaXN0IHNoaXBzIENoaW5lc2Utb25seVxuICAvLyBJQ0QgKyB6ZXJvIHNlY29uZGFyaWVzLCBJSEtFMzMwOVMwMiBkZXRhaWwgKGN0eXBlPTMpIHNoaXBzIGZ1bGxcbiAgLy8gYmlsaW5ndWFsIHByaW1hcnkgKyB1cCB0byAxMisgc2Vjb25kYXJ5IGRpYWdub3NlcyAoXHU0RjRGXHU5NjYyIGNhc2VzIGFyZVxuICAvLyBkaWFnbm9zdGljYWxseSByaWNoZXIgdGhhbiBPUEQpLiBXaXRob3V0IHRoaXMgZmFuLW91dCwgaW5wYXRpZW50XG4gIC8vIEZISVIgRW5jb3VudGVycyBoYXZlIENoaW5lc2Utb25seSByZWFzb25Db2RlIGRpc3BsYXkgYW5kIG5vXG4gIC8vIHNlY29uZGFyeSBkaWFnbm9zZXMgYXQgYWxsLlxuICBjb25zdCBpbnBJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJpbnBhdGllbnRcIik7XG4gIGlmIChpbnBJZHggPj0gMCAmJiBzZXR0bGVkW2lucElkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtpbnBJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkZXRhaWxNYXAgPSBhd2FpdCBfd2l0aFByb2dyZXNzVGltZXIoXG4gICAgICAgICAgKHNlYykgPT5cbiAgICAgICAgICAgIHNlYyA9PT0gMFxuICAgICAgICAgICAgICA/IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU0RjRGXHU5NjYyXHU3RDAwXHU5MzA0XHU4QTczXHU2MEM1XHUyMDI2YFxuICAgICAgICAgICAgICA6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU0RjRGXHU5NjYyXHU3RDAwXHU5MzA0XHU4QTczXHU2MEM1XHUyMDI2XHVGRjA4XHU1REYyICR7c2VjfSBcdTc5RDJcdUZGMDlgLFxuICAgICAgICAgICgpID0+IF9mZXRjaElucGF0aWVudERldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMgfSksXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHJlQWRhcHRlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpc2l0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGRldGFpbE1hcD8uZ2V0KGkpIHx8IG51bGw7XG4gICAgICAgICAgY29uc3QgcHJpbWFyeURpYWdub3NpcyA9IF9wcmltYXJ5SWNkRnJvbVMwMkRldGFpbChkZXRhaWwpO1xuICAgICAgICAgIGNvbnN0IHNlY29uZGFyeURpYWdub3NlcyA9IF9zZWNvbmRhcnlJY2RzRnJvbVMwMkRldGFpbChkZXRhaWwpO1xuICAgICAgICAgIGNvbnN0IGl0ID0gYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIodmlzaXRzW2ldLCB7XG4gICAgICAgICAgICBwcmltYXJ5X2RpYWdub3NpczogcHJpbWFyeURpYWdub3NpcyxcbiAgICAgICAgICAgIHNlY29uZGFyeV9kaWFnbm9zZXM6IHNlY29uZGFyeURpYWdub3NlcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXQpIHJlQWRhcHRlZC5wdXNoKGl0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXR0bGVkW2lucElkeF0udmFsdWUuaXRlbXMgPSByZUFkYXB0ZWQ7XG4gICAgICAgIHNldHRsZWRbaW5wSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZUFkYXB0ZWQubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgaW5wYXRpZW50IGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJpbnBhdGllbnQtZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWI6IG1lZGljYXRpb25zIG5lZWQgYSAyLXN0ZXAgZmV0Y2ggXHUyMDE0IElIS0UzMzA2UzAxIG9ubHkgcmV0dXJuc1xuICAvLyB2aXNpdCBtZXRhZGF0YSAoZGF0ZSwgSUNELCBob3NwaXRhbCksIG5vIGRydWcgbmFtZXMuIERydWdzIGxpdmUgYXRcbiAgLy8gSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiB1bmRlclxuICAvLyBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0LiBGYW4gb3V0IGRldGFpbFxuICAvLyBmZXRjaGVzIGluc2lkZSB0aGUgc2FtZSB0YWIgY29udGV4dCAoY29va2llcyArIEpXVCksIGtlZXBpbmdcbiAgLy8gY29uY3VycmVuY3kgbGltaXRlZCBzbyBOSEkgZG9lc24ndCBJRExFLXJlZGlyZWN0IHVzLlxuICAvLyBTdGVwIDFjOiBpbWFnaW5nIG5lZWRzIElIS0UzNDA4UzAyIGZvciB0aGUgYWN0dWFsIHJlcG9ydCBuYXJyYXRpdmUuXG4gIC8vIExpc3QgZW5kcG9pbnQgb25seSBoYXMgb3JkZXIgbWV0YWRhdGE7IGN0eXBlIHBhcmFtIG1pcnJvcnMgdGhlXG4gIC8vIHZpc2l0J3Mgb3JpX1RZUEUgKEEgLyBFIC8gXHUyMDI2KS5cbiAgY29uc3QgaW1nSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwiaW1hZ2luZ1wiKTtcbiAgaWYgKGltZ0lkeCA+PSAwICYmIHNldHRsZWRbaW1nSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydHMgPSBhd2FpdCBfd2l0aFByb2dyZXNzVGltZXIoXG4gICAgICAgICAgKHNlYykgPT5cbiAgICAgICAgICAgIHNlYyA9PT0gMFxuICAgICAgICAgICAgICA/IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XHU1ODMxXHU1NDRBXHUyMDI2YFxuICAgICAgICAgICAgICA6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XHU1ODMxXHU1NDRBXHUyMDI2XHVGRjA4XHU1REYyICR7c2VjfSBcdTc5RDJcdUZGMDlgLFxuICAgICAgICAgICgpID0+IF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzIH0pLFxuICAgICAgICApO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUuaXRlbXMgPSByZXBvcnRzO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVwb3J0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGltYWdpbmcgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImltYWdpbmctZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWQ6IHByb2NlZHVyZXMgbmVlZCBJSEtFMzMwOFMwMiBmb3IgdGhlIGFjdHVhbCBJQ0QtMTAtUENTXG4gIC8vIG9wX0NPREUgYW5kIHRoZSByZWFsIGV4ZWN1dGlvbiBkYXRlIChleGVfU19EQVRFIG9uIHN1Yi1saXN0XG4gIC8vIGVudHJpZXMpLiBUaGUgbGlzdCBlbmRwb2ludCBJSEtFMzMwMVMwNSBvbmx5IGV4cG9zZXMgbWV0YWRhdGE7XG4gIC8vIHdpdGhvdXQgdGhpcyBmYW4tb3V0LCBpbnBhdGllbnQgcHJvY2VkdXJlcyBnZXQgYW5jaG9yZWQgdG8gdGhlXG4gIC8vIGFkbWlzc2lvbiBkYXkgKGZ1bmNfZGF0ZSkgYW5kIGVtaXR0ZWQgd2l0aCBjb2RlOlwiXCIgKG5vIFBDUyBjb2RlKS5cbiAgY29uc3QgcHJvY0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcInByb2NlZHVyZXNcIik7XG4gIGlmIChwcm9jSWR4ID49IDAgJiYgc2V0dGxlZFtwcm9jSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW3Byb2NJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwcm9jcyA9IGF3YWl0IF93aXRoUHJvZ3Jlc3NUaW1lcihcbiAgICAgICAgICAoc2VjKSA9PlxuICAgICAgICAgICAgc2VjID09PSAwXG4gICAgICAgICAgICAgID8gYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTg2NTVcdTdGNkUvXHU2MjRCXHU4ODUzXHU4QTczXHU2MEM1XHUyMDI2YFxuICAgICAgICAgICAgICA6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1M1x1OEE3M1x1NjBDNVx1MjAyNlx1RkYwOFx1NURGMiAke3NlY30gXHU3OUQyXHVGRjA5YCxcbiAgICAgICAgICAoKSA9PiBfZmV0Y2hQcm9jZWR1cmVEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzIH0pLFxuICAgICAgICApO1xuICAgICAgICBzZXR0bGVkW3Byb2NJZHhdLnZhbHVlLml0ZW1zID0gcHJvY3M7XG4gICAgICAgIHNldHRsZWRbcHJvY0lkeF0udmFsdWUucmF3X2NvdW50ID0gcHJvY3MubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW3Byb2NJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgcHJvY2VkdXJlcyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwicHJvY2VkdXJlcy1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAxZTogY2hyb25pYyBwcmVzY3JpcHRpb25zIChJSEtFMzMwN1MwMSkuIE11c3QgcnVuIEJFRk9SRSB0aGVcbiAgLy8gcmVndWxhciBtZWRpY2F0aW9uIGZhbi1vdXQgYmVjYXVzZSB+NTIvMTI2IChvYnNlcnZlZCkgY2hyb25pYyByb3dzXG4gIC8vIHNoYXJlIHJvd19JRHMgd2l0aCByZWd1bGFyIElIS0UzMzA2UzAxIFx1MjAxNCB3ZSBjb2xsZWN0IGNocm9uaWMgSURzXG4gIC8vIGZpcnN0IGFuZCBwYXNzIHRoZW0gYXMgc2tpcFJvd0lkcyB0byB0aGUgcmVndWxhciBmYW4tb3V0IHNvIGVhY2hcbiAgLy8gcm93IGlzIGZldGNoZWQgZXhhY3RseSBvbmNlLiBDaHJvbmljIGRydWdzIGdldCBpc19jaHJvbmljPXRydWUgXHUyMTkyXG4gIC8vIE1lZGljYXRpb25SZXF1ZXN0LmNvdXJzZU9mVGhlcmFweVR5cGU9Y29udGludW91cy5cbiAgY29uc3QgY2hyb25pY1Jvd0lkcyA9IG5ldyBTZXQoKTtcbiAgY29uc3QgY2hyb25pY0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleChcbiAgICAoZSkgPT4gZS5uYW1lID09PSBcImNocm9uaWNfcHJlc2NyaXB0aW9uc1wiLFxuICApO1xuICBpZiAoY2hyb25pY0lkeCA+PSAwICYmIHNldHRsZWRbY2hyb25pY0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtjaHJvbmljSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZHJ1Z0l0ZW1zID0gYXdhaXQgX3dpdGhQcm9ncmVzc1RpbWVyKFxuICAgICAgICAgIChzZWMpID0+XG4gICAgICAgICAgICBzZWMgPT09IDBcbiAgICAgICAgICAgICAgPyBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NjE2Mlx1NjAyN1x1ODY1NVx1NjVCOVx1N0I4Qlx1MjAyNmBcbiAgICAgICAgICAgICAgOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NjE2Mlx1NjAyN1x1ODY1NVx1NjVCOVx1N0I4Qlx1MjAyNlx1RkYwOFx1NURGMiAke3NlY30gXHU3OUQyXHVGRjA5YCxcbiAgICAgICAgICAoKSA9PiBfZmV0Y2hDaHJvbmljTWVkaWNhdGlvbkRldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMgfSksXG4gICAgICAgICk7XG4gICAgICAgIHNldHRsZWRbY2hyb25pY0lkeF0udmFsdWUuaXRlbXMgPSBkcnVnSXRlbXM7XG4gICAgICAgIHNldHRsZWRbY2hyb25pY0lkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbY2hyb25pY0lkeF0udmFsdWUucmF3X2NvdW50ID0gZHJ1Z0l0ZW1zLmxlbmd0aDtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZpc2l0cykge1xuICAgICAgICAgIGNvbnN0IGlkID0gdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEO1xuICAgICAgICAgIGlmIChpZCkgY2hyb25pY1Jvd0lkcy5hZGQoaWQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBjaHJvbmljIHByZXNjcmlwdGlvbnMgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImNocm9uaWMtZGV0YWlsXCIpO1xuXG4gIGNvbnN0IG1lZElkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcIm1lZGljYXRpb25zXCIpO1xuICBpZiAobWVkSWR4ID49IDAgJiYgc2V0dGxlZFttZWRJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcmVtYWluaW5nID0gdmlzaXRzLmZpbHRlcigodikgPT4ge1xuICAgICAgICBjb25zdCBpZCA9IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRDtcbiAgICAgICAgcmV0dXJuIGlkICYmICFjaHJvbmljUm93SWRzLmhhcyhpZCk7XG4gICAgICB9KS5sZW5ndGg7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkcnVnSXRlbXMgPSBhd2FpdCBfd2l0aFByb2dyZXNzVGltZXIoXG4gICAgICAgICAgKHNlYykgPT5cbiAgICAgICAgICAgIHNlYyA9PT0gMFxuICAgICAgICAgICAgICA/IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7cmVtYWluaW5nfSBcdTdCNDZcdTc1MjhcdTg1RTVcdTY2MEVcdTdEMzBcdTIwMjZgXG4gICAgICAgICAgICAgIDogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHtyZW1haW5pbmd9IFx1N0I0Nlx1NzUyOFx1ODVFNVx1NjYwRVx1N0QzMFx1MjAyNlx1RkYwOFx1NURGMiAke3NlY30gXHU3OUQyXHVGRjA5YCxcbiAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgX2ZldGNoTWVkaWNhdGlvbkRldGFpbHNJblRhYih7XG4gICAgICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsIHNraXBSb3dJZHM6IGNocm9uaWNSb3dJZHMsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLml0ZW1zID0gZHJ1Z0l0ZW1zO1xuICAgICAgICAvLyByYXdfY291bnQgbm93IHJlZmxlY3RzIHRoZSAqZHJ1Zy1sZXZlbCogY291bnQgZm9yIHRoZSBicmVha2Rvd25cbiAgICAgICAgLy8gKHZpc2l0cyBcdTIxOTIgZHJ1Z3MpLiBLZWVwIHRoZSB2aXNpdCBjb3VudCBpbiBhIHNpZGUgZmllbGQgZm9yIGRlYnVnLlxuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdfY291bnQgPSBkcnVnSXRlbXMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgbWVkaWNhdGlvbnMgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcIm1lZGljYXRpb24tZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMjogYWdncmVnYXRlIGl0ZW1zIGJ5IHBhZ2VfdHlwZSwgUE9TVCB0byBiYWNrZW5kLlxuICBjb25zdCBieVR5cGUgPSB7fTtcbiAgbGV0IHJhd190b3RhbCA9IDA7XG4gIGxldCBhZGFwdGVkX3RvdGFsID0gMDtcbiAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBzbyB0aGUgZmluYWwgc3RhdHVzIGNhbiB0ZWxsIHVzZXIgZXhhY3RseVxuICAvLyB3aGljaCBlbmRwb2ludHMgY2FtZSBiYWNrIGVtcHR5IC8gbWlzLXNoYXBlZCBcdTIwMTQgbXVjaCBtb3JlIHVzZWZ1bCB0aGFuXG4gIC8vIGEgc2luZ2xlIGFnZ3JlZ2F0ZWQgbnVtYmVyLlxuICAvLyBCcmVha2Rvd24gc2hvd24gdG8gdGhlIHVzZXIgdW5kZXIgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIi4gVXNlIHRoZSBDaGluZXNlIGxhYmVsXG4gIC8vIHdoZW4ga25vd247IG9ubHkgZmFsbCBiYWNrIHRvIHRoZSByYXcgZW5kcG9pbnQgbmFtZSBmb3IgdW5tYXBwZWRcbiAgLy8gKG5ld2x5IGFkZGVkKSBlbmRwb2ludHMuIEVtcHR5LXJlc3VsdCBlbmRwb2ludHMgYXJlIG9taXR0ZWQgZnJvbVxuICAvLyB0aGUgc3VjY2VzcyBzdW1tYXJ5IGVudGlyZWx5IFx1MjAxNCB0aGV5IGFkZCBub2lzZS4gRXJyb3JzIGFsd2F5cyBzaG93XG4gIC8vIHNvIHRoZSB1c2VyIGtub3dzIHNvbWV0aGluZyBkaWRuJ3QgY29tZSB0aHJvdWdoLlxuICBjb25zdCBicmVha2Rvd24gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0bGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZXAgPSBOSElfQVBJX0VORFBPSU5UU1tpXTtcbiAgICBjb25zdCBzID0gc2V0dGxlZFtpXTtcbiAgICBjb25zdCBsYWJlbCA9IEVORFBPSU5UX0xBQkVMX1pIW2VwLm5hbWVdID8/IGVwLm5hbWU7XG4gICAgaWYgKHMuc3RhdHVzID09PSBcInJlamVjdGVkXCIpIHtcbiAgICAgIGVycm9ycy5wdXNoKGAke2VwLm5hbWV9OiAke3MucmVhc29uLm1lc3NhZ2V9YCk7XG4gICAgICBicmVha2Rvd24ucHVzaChgXHUyNzRDICR7bGFiZWx9XHVGRjFBXHU1M0Q2XHU1Rjk3XHU1OTMxXHU2NTU3YCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgeyBpdGVtcywgcmF3X2NvdW50IH0gPSBzLnZhbHVlO1xuICAgIHJhd190b3RhbCArPSByYXdfY291bnQ7XG4gICAgYWRhcHRlZF90b3RhbCArPSBpdGVtcy5sZW5ndGg7XG4gICAgaWYgKHJhd19jb3VudCA9PT0gMCkgY29udGludWU7IC8vIG5vdGhpbmcgdG8gc2hvd1xuICAgIGlmIChpdGVtcy5sZW5ndGggPiByYXdfY291bnQgJiYgcmF3X2NvdW50ID4gMCkge1xuICAgICAgLy8gMS10by1tYW55IGFkYXB0ZXIgKGUuZy4gYWR1bHRfcHJldmVudGl2ZTogb25lIHNjcmVlbmluZyByb3cgXHUyMTkyXG4gICAgICAvLyB+MTggT2JzZXJ2YXRpb25zKS4gU2hvdyBib3RoIG51bWJlcnMgc28gdGhlIHVzZXIgdW5kZXJzdGFuZHNcbiAgICAgIC8vIHdoeSBvbmUgcmVjb3JkIHByb2R1Y2VkIG1hbnkuXG4gICAgICBicmVha2Rvd24ucHVzaChgJHtsYWJlbH1cdUZGMUEke3Jhd19jb3VudH0gXHU3QjQ2IFx1MjE5MiAke2l0ZW1zLmxlbmd0aH0gXHU5ODA1YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrZG93bi5wdXNoKGAke2xhYmVsfVx1RkYxQSR7aXRlbXMubGVuZ3RofSBcdTdCNDZgKTtcbiAgICB9XG4gICAgLy8gU2F2ZSBib2R5IHNhbXBsZSBmb3IgZmlyc3QgZW5kcG9pbnQgd2l0aCByYXc+MCBidXQgYWRhcHRlZD0wIChhZGFwdGVyXG4gICAgLy8gbWlzbWF0Y2gpIHNvIHdlIGNhbiBpdGVyYXRlLiBTdG9yZWQgdW5kZXIgY2hyb21lLnN0b3JhZ2UubG9jYWwgZm9yXG4gICAgLy8gaW5zcGVjdGlvbiB2aWEgc2VydmljZSB3b3JrZXIgRGV2VG9vbHMuXG4gICAgLy9cbiAgICAvLyBHQVRFRCBvbiBERUJVR19TVEFTSF9CT0RZX1NBTVBMRVM6IHRoZSBzYW1wbGUgY29udGFpbnMgcmF3IE5ISVxuICAgIC8vIFBISSAobGFiIHZhbHVlcywgZHJ1ZyBuYW1lcykgYW5kIHdlIGRvbid0IHdhbnQgaXQgc2l0dGluZyBpblxuICAgIC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIGluZGVmaW5pdGVseSBpbiB0aGUgcHVibGlzaGVkIGV4dGVuc2lvbi5cbiAgICAvLyBGbGlwIHRoZSBmbGFnIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlIHRvIHRydWUgKmxvY2FsbHkqIHdoZW5cbiAgICAvLyBkaWFnbm9zaW5nIGFkYXB0ZXIgbWlzbWF0Y2hlcy5cbiAgICBpZiAoREVCVUdfU1RBU0hfQk9EWV9TQU1QTEVTICYmIHJhd19jb3VudCA+IDAgJiYgaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgICAgIFtgX19zYW1wbGVCb2R5XyR7ZXAubmFtZX1gXTogcy52YWx1ZS5ib2R5U2FtcGxlIHx8IFwibi9hXCIsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH1cbiAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICAoYnlUeXBlW2VwLnBhZ2VfdHlwZV0gPSBieVR5cGVbZXAucGFnZV90eXBlXSB8fCBbXSkucHVzaCguLi5pdGVtcyk7XG4gIH1cblxuICAvLyBNYXNrIGdhdGUgaXMgcmVhZCBmcmVzaCBwZXIgc3luYyBcdTIwMTQgZGVmYXVsdHMgT0ZGIHBlciB0aGUgZGlzY3Vzc2lvblxuICAvLyAoY2l0aXplbi1zZWxmLWRvd25sb2FkIGRvZXNuJ3QgbmVlZCBhbm9ueW1pemF0aW9uKS4gV2hlbiBPTiwgYWxzb1xuICAvLyBzY3J1YiB0aGUgdXNlcidzIHJlYWwgbmFtZSBvdXQgb2YgYW55IE5ISSBuYXJyYXRpdmUgZmllbGQgYmVmb3JlXG4gIC8vIGl0IGZsb3dzIGludG8gdGhlIG1hcHBlci5cbiAgY29uc3QgbWFza0VuYWJsZWQgPSBhd2FpdCBfaXNNYXNrRW5hYmxlZCgpO1xuICBpZiAobWFza0VuYWJsZWQgJiYgcGF0aWVudE92ZXJyaWRlLm5hbWUpIHtcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhieVR5cGUpKSB7XG4gICAgICBieVR5cGVba2V5XSA9IF9yZXBsYWNlTmFtZURlZXAoYnlUeXBlW2tleV0sIHBhdGllbnRPdmVycmlkZS5uYW1lLCByZXBsYWNlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgbGV0IF9sb2NhbEZpbGVuYW1lID0gbnVsbDtcbiAgaWYgKG1vZGUgPT09IFwibG9jYWxcIikge1xuICAgIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbiAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogXCJcdUQ4M0VcdURERUMgXHU4RjQ5XHU2M0RCXHU3MEJBXHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHU2QTk0XHUyMDI2XCIsIHRvdGFsUmVzb3VyY2VzOiAwIH0pO1xuICAgIGxldCBidW5kbGU7XG4gICAgdHJ5IHtcbiAgICAgIGJ1bmRsZSA9IF9hc3NlbWJsZUxvY2FsQnVuZGxlKGJ5VHlwZSwgcGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3JzLnB1c2goYGxvY2FsIG1hcHBpbmc6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgYnVuZGxlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGJ1bmRsZSkge1xuICAgICAgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDQkUgXHU2RTk2XHU1MDk5ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1OENDN1x1NjU5OVx1MjAyNmAsIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubywgZGF0ZVJhbmdlKTtcbiAgICAgICAgX2xvY2FsRmlsZW5hbWUgPSBkbC5maWxlbmFtZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYHN0YXNoIGJ1bmRsZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEJ1aWxkIHRoZSBvdmVycmlkZSB3ZSBzZW5kIHRvIGJhY2tlbmQgd2l0aCB0aGUgbWF5YmUtbWFza2VkIG5hbWVcbiAgICAvLyBzbyBiYWNrZW5kJ3MgYXV0by1jcmVhdGVkIFBhdGllbnQgKyB0aGUgcGVyLWl0ZW0gc3ViamVjdC5kaXNwbGF5XG4gICAgLy8gc2VlIHRoZSBzYW1lIHZhbHVlIHRoZSB1c2VyIG9wdGVkIGludG8uIEl0ZW1zIHRoZW1zZWx2ZXMgd2VyZVxuICAgIC8vIGFscmVhZHkgc2NydWJiZWQgYWJvdmUgKGJ5VHlwZSBwYXNzKSwgc28gdGhpcyBqdXN0IGNvdmVycyB0aGVcbiAgICAvLyBvdmVycmlkZS1kZXJpdmVkIFBhdGllbnQuXG4gICAgY29uc3QgdXBsb2FkT3ZlcnJpZGUgPSBtYXNrRW5hYmxlZCAmJiBwYXRpZW50T3ZlcnJpZGUubmFtZVxuICAgICAgPyB7IC4uLnBhdGllbnRPdmVycmlkZSwgbmFtZTogbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUpIH1cbiAgICAgIDogcGF0aWVudE92ZXJyaWRlO1xuICAgIGZvciAoY29uc3QgW3BhZ2VfdHlwZSwgaXRlbXNdIG9mIE9iamVjdC5lbnRyaWVzKGJ5VHlwZSkpIHtcbiAgICAgIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHUyQjA2XHVGRTBGIFx1NEUwQVx1NTBCMyAke0VORFBPSU5UX0xBQkVMX1pIW3BhZ2VfdHlwZV0gPz8gcGFnZV90eXBlfVx1RkYwOCR7aXRlbXMubGVuZ3RofSBcdTdCNDZcdUZGMDlcdTIwMjZgLFxuICAgICAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgdXBsb2FkT3ZlcnJpZGUpO1xuICAgICAgICB0b3RhbCArPSBkYXRhLmNvdW50IHx8IDA7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGB1cGxvYWQgJHtwYWdlX3R5cGV9OiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZnRlciBiYWNrZW5kIHVwbG9hZCwgYWxzbyBmZXRjaCBhIHNuYXBzaG90IG9mIHRoZSBwYXRpZW50J3MgZnVsbFxuICAgIC8vIGN1bXVsYXRpdmUgRkhJUiBCdW5kbGUgYW5kIHN0YXNoIGl0IGZvciB0aGUgcG9wdXAncyBcIlx1RDgzRFx1RENFNSBcdTRFMEJcdThGMDlcIiBidXR0b24uXG4gICAgLy8gVGhpcyBpcyB3aGF0IGAvZmhpci9leHBvcnRgIHJldHVybnMgXHUyMDE0IHRoZSBiYWNrZW5kJ3MgY29tcGxldGUgdmlld1xuICAgIC8vIG9mIHRoaXMgcGF0aWVudCAodGhpcyBzeW5jICsgYW55IHByaW9yIHN5bmNzKSwgYXMgb3Bwb3NlZCB0byBsb2NhbFxuICAgIC8vIG1vZGUncyBcImp1c3QgdGhpcyBzeW5jXCIgYnVuZGxlLlxuICAgIC8vXG4gICAgLy8gU2tpcCBzdGFzaGluZyBlbnRpcmVseSB3aGVuIHRoZSB1cGxvYWQgcGFzcyBwcm9kdWNlZCBubyByZXNvdXJjZXNcbiAgICAvLyBcdTIwMTQgZXhwb3J0aW5nIDAgZW50cmllcyB0aGVuIHN0YXNoaW5nIHRoZW0gY3JlYXRlcyBhIG1pc2xlYWRpbmdcbiAgICAvLyBcIlx1NjcyQ1x1NTczMCBcdTI3MTMgMCBcdTdCNDZcIiBpbmRpY2F0b3IgYW5kIGEgdXNlbGVzcyBcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzIGJ1dHRvbi5cbiAgICBpZiAocGF0aWVudE92ZXJyaWRlLmlkX25vICYmIHRvdGFsID4gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNEXHVEQ0U2IFx1NjU3NFx1NzQwNlx1NEYzQVx1NjcwRFx1NTY2OFx1NEUwQVx1NzY4NFx1NUI4Q1x1NjU3NFx1OENDN1x1NjU5OVx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogdG90YWwgfSk7XG4gICAgICAgIC8vIEJhY2tlbmQgc3RvcmVzIFBhdGllbnQgdW5kZXIgZGVyaXZlUGF0aWVudElkKHJhd0lkKSwgc28gdGhlXG4gICAgICAgIC8vIGV4cG9ydCBmaWx0ZXIgbXVzdCB1c2UgdGhlIGhhc2hlZCBmb3JtIFx1MjAxNCBxdWVyeWluZyB3aXRoIHRoZVxuICAgICAgICAvLyByYXcgbmF0aW9uYWwgSUQgbWF0Y2hlcyB6ZXJvIHJvd3MgZXZlbiB3aGVuIGRhdGEgaXMgdGhlcmUuXG4gICAgICAgIGNvbnN0IGZoaXJQaWQgPSBkZXJpdmVQYXRpZW50SWQocGF0aWVudE92ZXJyaWRlLmlkX25vKTtcbiAgICAgICAgY29uc3QgZXhwVXJsID0gYCR7YmFja2VuZH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gO1xuICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goZXhwVXJsLCB7XG4gICAgICAgICAgaGVhZGVyczogc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyLm9rKSB7XG4gICAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgLy8gUGFzcyB0aGUgc2FtZSBkYXRlUmFuZ2UgdGhlIHVzZXIgcGlja2VkIHRocm91Z2ggc28gdGhlXG4gICAgICAgICAgLy8gZG93bmxvYWRlZCBmaWxlbmFtZSByZWZsZWN0cyBcIlx1NjcwMFx1OEZEMSAzIFx1NUU3NFwiIFx1MjE5MiAyMDIzLTIwMjYgaW5zdGVhZFxuICAgICAgICAgIC8vIG9mIGFsd2F5cyBzeW50aGVzaXppbmcgdG9kYXktMXkgXHUyMTkyIHRvZGF5LlxuICAgICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubywgZGF0ZVJhbmdlKTtcbiAgICAgICAgICBfbG9jYWxGaWxlbmFtZSA9IGRsLmZpbGVuYW1lO1xuICAgICAgICAgIC8vIEFsaWduIHJlcG9ydGVkIGNvdW50IHdpdGggbG9jYWwgbW9kZTogYnVuZGxlLmVudHJ5Lmxlbmd0aFxuICAgICAgICAgIC8vIGluY2x1ZGVzIHRoZSBQYXRpZW50IHJlc291cmNlICh3aGljaCB0aGUgcGVyLXBhZ2UtdHlwZSBQT1NUXG4gICAgICAgICAgLy8gY291bnRzIGhhZCBwcmV2aW91c2x5IG9taXR0ZWQgYmVjYXVzZSBQYXRpZW50IGlzIGF1dG8tY3JlYXRlZFxuICAgICAgICAgIC8vIHNpbGVudGx5IGZyb20gcGF0aWVudF9vdmVycmlkZSkuIFNhbWUgZGF0YSBcdTIxOTIgc2FtZSBudW1iZXIuXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBEZWZlbnNpdmU6IG9ubHkgT1ZFUldSSVRFIHRvdGFsIHdoZW4gZXhwb3J0IGFjdHVhbGx5IHJldHVybmVkXG4gICAgICAgICAgLy8gc29tZXRoaW5nLiBJZiBleHBvcnQgcmV0dXJucyAwIGVudHJpZXMgZGVzcGl0ZSBhIHN1Y2Nlc3NmdWxcbiAgICAgICAgICAvLyB1cGxvYWQgKGNvdWxkIGhhcHBlbiB3aXRoIGEgc3RhbGUtREIgaGFzaCBtaXNtYXRjaCB3ZSBoYXZlbid0XG4gICAgICAgICAgLy8gZml4ZWQgeWV0KSwgZG9uJ3QgY2xvYmJlciB0aGUgdHJ1dGhmdWwgdXBsb2FkIGNvdW50IFx1MjAxNCB0aGF0J3NcbiAgICAgICAgICAvLyBleGFjdGx5IHRoZSBidWcgdGhhdCBtYWRlIFwiXHU1REYyXHU2NkY0XHU2NUIwIDgxIFx1N0I0NlwiIHNpbGVudGx5IGJlY29tZVxuICAgICAgICAgIC8vIFwiXHU1REYyXHU2NkY0XHU2NUIwIDAgXHU3QjQ2XCIuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYnVuZGxlLmVudHJ5KSAmJiBidW5kbGUuZW50cnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChgZXhwb3J0IGJ1bmRsZTogSFRUUCAke3Iuc3RhdHVzfWApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBleHBvcnQgYnVuZGxlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShtb2RlID09PSBcImxvY2FsXCIgPyBcImFzc2VtYmxlK3N0YXNoXCIgOiBcImJhY2tlbmQtdXBsb2FkXCIpO1xuXG4gIC8vIEZvcm1hdCBlbGFwc2VkIHdhbGwtY2xvY2sgdGltZTogc2Vjb25kcyAoMSBkcCkgZm9yIHNob3J0IHN5bmNzLFxuICAvLyBcIm1tOnNzXCIgb25jZSB3ZSBjcm9zcyB0aGUgbWludXRlIG1hcmsgc28gdGhlIHBvcHVwIHN0YXR1cyBzdGF5cyByZWFkYWJsZS5cbiAgY29uc3QgX2VsYXBzZWRNcyA9IERhdGUubm93KCkgLSBfdDA7XG4gIGNvbnN0IF9lbGFwc2VkU3RyID0gX2VsYXBzZWRNcyA8IDYwXzAwMFxuICAgID8gYCR7KF9lbGFwc2VkTXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgXG4gICAgOiBgJHtNYXRoLmZsb29yKF9lbGFwc2VkTXMgLyA2MF8wMDApfW0ke01hdGgucm91bmQoKF9lbGFwc2VkTXMgJSA2MF8wMDApIC8gMTAwMCl9c2A7XG4gIC8vIE5vIG1vcmUgXCJcdTZBOTRcdTY4NDhcdTVERjJcdTUwOTlcdTU5QTVcdTIwMjZcIiB0YWlsIFx1MjAxNCB0aGUgXHVEODNEXHVEQ0U1IGRvd25sb2FkIGJ1dHRvbiBzaXRzIHJpZ2h0XG4gIC8vIGJlbG93IHRoZSBzdGF0dXMsIHNvIHNheWluZyBcIlx1OUVERVx1NEUwQlx1NjVCOVx1NjMwOVx1OTIxNVwiIGlzIGp1c3Qgbm9pc2UuXG4gIGNvbnN0IF9sb2NhbFRhaWwgPSBcIlwiO1xuICBjb25zdCBfc3VjY2Vzc1ZlcmIgPSBtb2RlID09PSBcImxvY2FsXCIgPyBcIlx1NURGMlx1NzUyMlx1NzUxRlwiIDogXCJcdTVERjJcdTY2RjRcdTY1QjBcIjtcbiAgLy8gUGhhc2UgdGltaW5ncyAoYG5oaS1wYXJhbGxlbD04c2AsIGBiYWNrZW5kLXVwbG9hZD0wLjhzYCkgYXJlIGRldlxuICAvLyBpbmZvIFx1MjAxNCB1c2VmdWwgd2hlbiBpbnZlc3RpZ2F0aW5nIGEgc2xvdyBzeW5jIGJ1dCBub2lzZSBmb3IgYW4gZW5kXG4gIC8vIHVzZXIuIEtlZXAgdGhlbSwgYnV0IHRhZyB3aXRoIHRoZSBcIlx1MjNGMVwiIHByZWZpeCB0aGUgcG9wdXAgdXNlcyB0b1xuICAvLyB0dWNrIHRoZW0gaW50byBhIGRlZXBlciBcIlx1NjI4MFx1ODg1M1x1N0QzMFx1N0JDMFwiIHN1Yi10b2dnbGUuXG4gIGNvbnN0IF9waGFzZUxpbmVzID0gX3BoYXNlcy5tYXAoKHApID0+IGBcdTIzRjEgJHtwLm5hbWV9PSR7KHAubXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgKTtcbiAgY29uc3QgX2Z1bGxCcmVha2Rvd24gPSBbLi4uYnJlYWtkb3duLCAuLi5fcGhhc2VMaW5lc107XG5cbiAgLy8gUGljayB0aGUgcmlnaHQgc3VtbWFyeSBsaW5lLiBaZXJvLXJlc3VsdCBpcyB0aGUgdHJpY2tpZXN0IGNhc2U6XG4gIC8vIHdlIGRvbid0IHdhbnQgYSBncmVlbiBcdTI3MDUgc2F5aW5nIFwiMCBcdTdCNDZcIiBiZWNhdXNlIHRoYXQgcmVhZHMgYXNcbiAgLy8gXCJzdWNjZWVkZWQgd2l0aCB6ZXJvIGRhdGFcIi4gVGhhdCdzIGFsbW9zdCBhbHdheXMgb25lIG9mOlxuICAvLyAgIC0gTkhJIHNlc3Npb24gZXhwaXJlZCBiZXR3ZWVuIHRoZSBsb2dpbiBwcm9iZSBhbmQgdGhlIHN5bmNcbiAgLy8gICAgICh0aGUgSUhLRTM0MTAgcHJvYmUgY2FuIHN0aWxsIHN1Y2NlZWQgd2hpbGUgZGF0YSBlbmRwb2ludHNcbiAgLy8gICAgIHJlc3BvbmQgd2l0aCBlbXB0eSBhcnJheXMpO1xuICAvLyAgIC0gdGhlIHVzZXIgdHJ1bHkgaGFzIG5vIHJlY29yZHMgaW4gdGhlIHNlbGVjdGVkIGRhdGUgcmFuZ2UuXG4gIC8vIEVpdGhlciB3YXkgdGhlIGFjdGlvbmFibGUgbmV4dCBzdGVwIGlzIFwiXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1IE5ISSBcdTUxOERcdThBNjZcdTRFMDBcdTZCMjFcIi5cbiAgbGV0IF9zdW1tYXJ5TGluZTtcbiAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICBfc3VtbWFyeUxpbmUgPSBgXHUyNkEwXHVGRTBGIFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgJHtfc3VjY2Vzc1ZlcmJ9ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1RkYwQyR7ZXJyb3JzLmxlbmd0aH0gXHU5ODA1XHU1OTMxXHU2NTU3XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDkke19sb2NhbFRhaWx9YDtcbiAgfSBlbHNlIGlmICh0b3RhbCA9PT0gMCkge1xuICAgIF9zdW1tYXJ5TGluZSA9XG4gICAgICBgXHUyNkEwXHVGRTBGIFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMFx1NEY0Nlx1NkM5Mlx1NjI5M1x1NTIzMFx1NEVGQlx1NEY1NVx1OENDN1x1NjU5OVx1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5XHUyMDE0IGAgK1xuICAgICAgYFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBzZXNzaW9uIFx1NTNFRlx1ODBGRFx1OTA0RVx1NjcxRlx1RkYwQ1x1OEFDQlx1NTZERVx1OEE3Mlx1NTIwNlx1OTgwMVx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1RkYxQlx1NjIxNlx1NjJDOVx1OTU3N1x1MzAwQ1x1NjVFNVx1NjcxRlx1N0JDNFx1NTcwRFx1MzAwRFx1NTE4RFx1OEE2Nlx1MzAwMmA7XG4gIH0gZWxzZSB7XG4gICAgX3N1bW1hcnlMaW5lID0gYFx1MjcwNSBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTAgXHUwMEI3ICR7X3N1Y2Nlc3NWZXJifSAke3RvdGFsfSBcdTdCNDZcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOSR7X2xvY2FsVGFpbH1gO1xuICB9XG5cbiAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICBydW5uaW5nOiBmYWxzZSxcbiAgICBwcm9ncmVzczogX3N1bW1hcnlMaW5lLFxuICAgIHBoYXNlOiBcImRvbmVcIixcbiAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgIGVsYXBzZWRNczogX2VsYXBzZWRNcyxcbiAgICAvLyBQZXItZW5kcG9pbnQgYnJlYWtkb3duIGZvciB0aGUgcG9wdXAncyAnXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwJyBjb2xsYXBzaWJsZS5cbiAgICAvLyBLZWVwIGFzIGEgcGxhaW4gYXJyYXkgc28gcG9wdXAuanMgY2FuIHJlbmRlciB3aXRoIERPTSBBUEkgKG5vXG4gICAgLy8gaW5uZXJIVE1MIC8gbm8gZXNjYXBpbmcgY29uY2VybnMpLiBJdGVtcyBsb29rIGxpa2VcbiAgICAvLyAnZW5jb3VudGVycz0xMi8xMicgb3IgJ2FkdWx0X3ByZXZlbnRpdmU9MiByb3dzIFx1MjE5MiAzNiBvYnMnLlxuICAgIGJyZWFrZG93bjogX2Z1bGxCcmVha2Rvd24sXG4gICAgZXJyb3JzLFxuICAgIGhpc3RubzogcGF0aWVudE92ZXJyaWRlLmlkX25vLFxuICAgIG1vZGUsXG4gICAgbG9jYWxGaWxlbmFtZTogX2xvY2FsRmlsZW5hbWUsXG4gIH0pO1xuXG4gIC8vIEJlc3QtZWZmb3J0OiB3cml0ZSBhIFN5bmMgSGlzdG9yeSByb3cgdG8gdGhlIGJhY2tlbmQgc28gdGhlIGRhc2hib2FyZFxuICAvLyBjYW4gc2hvdyB3aGVuL3doby9ob3ctbG9uZy93aGF0L3JhbmdlLiBTa2lwcGVkIGluIGxvY2FsIG1vZGUgKHRoZXJlXG4gIC8vIGlzIG5vIGJhY2tlbmQpLiBXcmFwcGVkICsgc3dhbGxvd2VkIHNvIGEgbG9nZ2luZyBmYWlsdXJlIG5ldmVyXG4gIC8vIHByb3BhZ2F0ZXMgYmFjayB0byB0aGUgdXNlci1mYWNpbmcgc3luYyBzdGF0dXMuXG4gIGlmIChtb2RlICE9PSBcImxvY2FsXCIpIHRyeSB7XG4gICAgYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy9sb2dgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc3RhdHVzOiBlcnJvcnMubGVuZ3RoID8gXCJwYXJ0aWFsXCIgOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgcGF0aWVudF9pZDogcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCIsXG4gICAgICAgIC8vIC9zeW5jL2xvZyBsYW5kcyBpbiB0aGUgZGFzaGJvYXJkJ3Mgc3luYy1oaXN0b3J5IHJvdy4gT25seVxuICAgICAgICAvLyBtYXNrIHdoZW4gdGhlIHVzZXIgaGFzIG9wdGVkIGluIFx1MjAxNCBvdGhlcndpc2UgZGFzaGJvYXJkIHNlZXNcbiAgICAgICAgLy8gdGhlIHJhdyBuYW1lIHRoZXkgdHlwZWQgKGNvbnNpc3RlbnQgd2l0aCBcIlx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOFwiIGRlZmF1bHQpLlxuICAgICAgICBwYXRpZW50X25hbWU6IG1hc2tFbmFibGVkXG4gICAgICAgICAgPyBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiKVxuICAgICAgICAgIDogcGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIixcbiAgICAgICAgdG90YWwsXG4gICAgICAgIGJyZWFrZG93bixcbiAgICAgICAgZGF0ZV9yYW5nZTogZGF0ZVJhbmdlTGFiZWwgfHwgXCJcIixcbiAgICAgICAgZWxhcHNlZF9tczogX2VsYXBzZWRNcyxcbiAgICAgICAgc3RhcnRlZF9hdDogbmV3IERhdGUoX3QwKS50b0lTT1N0cmluZygpLFxuICAgICAgICBlcnJvcnMsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gZmFpbGVkIHRvIHdyaXRlIGhpc3RvcnkgbG9nOlwiLCBlKTtcbiAgfVxuICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG59XG5cbi8vIE9uZS10aW1lIG1pZ3JhdGlvbiBmcm9tIGNocm9tZS5zdG9yYWdlLnN5bmMgXHUyMTkyIGNocm9tZS5zdG9yYWdlLmxvY2FsLlxuLy8gUHJldmlvdXMgdmVyc2lvbnMgc3RvcmVkIHN5bmNBcGlLZXkgKyBwYXRpZW50T3ZlcnJpZGUgKGNvbnRhaW5pbmcgdGhlXG4vLyBuYXRpb25hbCBJRCkgdW5kZXIgLnN5bmMsIHdoaWNoIENocm9tZSByZXBsaWNhdGVzIHRvIHRoZSB1c2VyJ3MgR29vZ2xlXG4vLyBhY2NvdW50IGFuZCBwdXNoZXMgdG8gZXZlcnkgZGV2aWNlIHRoZXkgc2lnbiBpbnRvLiBNb3ZlIGV2ZXJ5dGhpbmdcbi8vIHNldHRpbmdzLXJlbGF0ZWQgdG8gLmxvY2FsOyBjbGVhciB0aGUgc3luYyBjb3B5LlxuY29uc3QgU1lOQ19LRVlTX1RPX01JR1JBVEUgPSBbXG4gIFwiYmFja2VuZFVybFwiLFxuICBcInN5bmNBcGlLZXlcIixcbiAgXCJzbWFydEFwcExhdW5jaFVybFwiLFxuICBcInBhdGllbnRPdmVycmlkZVwiLFxuICBcInN5bmNNb2RlXCIsXG4gIFwibWFza05hbWVFbmFibGVkXCIsXG5dO1xuXG5hc3luYyBmdW5jdGlvbiBtaWdyYXRlU3luY1RvTG9jYWwoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3luY2VkID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU1lOQ19LRVlTX1RPX01JR1JBVEUpO1xuICAgIGNvbnN0IHByZXNlbnQgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhzeW5jZWQpLmZpbHRlcigoWywgdl0pID0+IHYgIT09IHVuZGVmaW5lZCksXG4gICAgKTtcbiAgICBpZiAoT2JqZWN0LmtleXMocHJlc2VudCkubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgbG9jYWwgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoT2JqZWN0LmtleXMocHJlc2VudCkpO1xuICAgIC8vIERvbid0IG92ZXJ3cml0ZSBhbnl0aGluZyB0aGUgdXNlciBhbHJlYWR5IHNldCBvbiB0aGlzIG1hY2hpbmUuXG4gICAgY29uc3QgdG9Xcml0ZSA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgIE9iamVjdC5lbnRyaWVzKHByZXNlbnQpLmZpbHRlcigoW2tdKSA9PiBsb2NhbFtrXSA9PT0gdW5kZWZpbmVkKSxcbiAgICApO1xuICAgIGlmIChPYmplY3Qua2V5cyh0b1dyaXRlKS5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQodG9Xcml0ZSk7XG4gICAgfVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMucmVtb3ZlKE9iamVjdC5rZXlzKHByZXNlbnQpKTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gTWlncmF0aW9uIGlzIGJlc3QtZWZmb3J0LiBUaGUgbmV4dCBydW4gZ2V0cyB0byB0cnkgYWdhaW4uXG4gIH1cbn1cblxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoYXN5bmMgKCkgPT4ge1xuICBhd2FpdCBtaWdyYXRlU3luY1RvTG9jYWwoKTtcbiAgLy8gU2VjdXJpdHkgYXVkaXQgIzUgY2xlYW51cDogdXNlcnMgdXBncmFkaW5nIGZyb20gPD0gdjAuOC43IG1heSBoYXZlXG4gIC8vIGEgYHBlbmRpbmdGaGlyQnVuZGxlYCAoZW50aXJlIEZISVIgQnVuZGxlIEpTT04pIGFuZC9vclxuICAvLyBgX19zYW1wbGVCb2R5XypgIGVudHJpZXMgKHJhdyBOSEkgcGF5bG9hZCkgc2l0dGluZyBpblxuICAvLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBmcm9tIHByZXZpb3VzIGluc3RhbGxzLiBUaGUgbmV3IHZlcnNpb24gdXNlc1xuICAvLyBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uIGZvciB0aGUgcGVuZGluZyBidW5kbGUgYW5kIGdhdGVzIHRoZSBib2R5XG4gIC8vIHNhbXBsZXMgYmVoaW5kIGEgZGVidWcgZmxhZyBcdTIwMTQgc28gdGhvc2UgbG9jYWwgZW50cmllcyBhcmUgbm93IHB1cmVcbiAgLy8gUEhJIGRlYWQgd2VpZ2h0LiBTd2VlcCB0aGVtIG9uIGV2ZXJ5IGluc3RhbGwvdXBkYXRlLlxuICB0cnkge1xuICAgIGNvbnN0IGFsbCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChudWxsKTtcbiAgICBjb25zdCBzdGFsZSA9IE9iamVjdC5rZXlzKGFsbCkuZmlsdGVyKFxuICAgICAgKGspID0+IGsgPT09IFwicGVuZGluZ0ZoaXJCdW5kbGVcIiB8fCBrLnN0YXJ0c1dpdGgoXCJfX3NhbXBsZUJvZHlfXCIpLFxuICAgICk7XG4gICAgaWYgKHN0YWxlLmxlbmd0aCkgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKHN0YWxlKTtcbiAgfSBjYXRjaCB7fVxufSk7XG5cbi8vIEFsc28gcnVuIG1pZ3JhdGlvbiBvbiBzZXJ2aWNlLXdvcmtlciB3YWtlLXVwIChjb3ZlcnMgcmVsb2FkL3Jlc3RhcnRcbi8vIHBhdGhzIHdoZXJlIG9uSW5zdGFsbGVkIGRvZXNuJ3QgZmlyZSkuXG5jaHJvbWUucnVudGltZS5vblN0YXJ0dXA/LmFkZExpc3RlbmVyPy4oKCkgPT4ge1xuICBtaWdyYXRlU3luY1RvTG9jYWwoKTtcbn0pO1xubWlncmF0ZVN5bmNUb0xvY2FsKCk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAvLyBTZWN1cml0eSBhdWRpdCAjNjogb25seSBhY2NlcHQgbWVzc2FnZXMgb3JpZ2luYXRpbmcgZnJvbSBUSElTXG4gIC8vIGV4dGVuc2lvbi4gc2VuZGVyLmlkIGlzIHBvcHVsYXRlZCBmb3IgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2VcbiAgLy8gY2FsbHM7IGFuIHVucmVsYXRlZCBleHRlbnNpb24gY2FsbGluZyBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcbiAgLy8gbXlFeHRJZCwgXHUyMDI2KSB3b3VsZCBoYXZlIGl0cyBvd24gaWQgYW5kIGJlIGRyb3BwZWQgc2lsZW50bHkuIFdpdGhvdXRcbiAgLy8gdGhpcyBjaGVjaywgYW55IG90aGVyIGV4dGVuc2lvbiB0aGUgdXNlciBpbnN0YWxscyBjb3VsZCB0cmlnZ2VyIGFcbiAgLy8gc3luYyBhdCBhbiBhdHRhY2tlci1jaG9zZW4gYmFja2VuZCBVUkwgd2l0aCBhdHRhY2tlci1zdXBwbGllZCBBUElcbiAgLy8ga2V5LCBmYW5uaW5nIG91dCB0aGUgTkhJIHRhYidzIFBISSB0aHJvdWdoIG91ciBwaXBlbGluZS5cbiAgLy8gKG1zZy5zZW5kZXIuaWQgaXMgdW5kZWZpbmVkIGZvciBuYXRpdmUtYXBwIG1lc3NhZ2VzIFx1MjAxNCB3ZSBkb24ndCB1c2VcbiAgLy8gdGhvc2UsIHNvIHdlIHRyZWF0IHVuZGVmaW5lZCBhcyBmb3JlaWduIGFuZCByZWplY3QuKVxuICBpZiAoc2VuZGVyPy5pZCAhPT0gY2hyb21lLnJ1bnRpbWUuaWQpIHJldHVybjtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdGFydE5oaUFwaVN5bmNcIikge1xuICAgIHJ1bk5oaUFwaVN5bmMobXNnLnBheWxvYWQpLnRoZW4oXG4gICAgICAoKSA9PiB7IHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pOyB9IGNhdGNoIHt9IH0sXG4gICAgICBhc3luYyAoZSkgPT4ge1xuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gQ0FOQ0VMX0VSUk9SKSB7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUsIGNhbmNlbGxlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gU0VTU0lPTl9FWFBJUkVEX0VSUk9SKSB7XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REQxMiBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdTc2N0JcdTUxNjVcdTkwM0VcdTY2NDIgXHUyMDE0IFx1OEFDQlx1NTZERVx1NTIzMFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1NTIwNlx1OTgwMVx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1RkYwQ1x1NzEzNlx1NUY4Q1x1NTE4RFx1NjMwOVx1MzAwQ1x1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MzAwRFwiLFxuICAgICAgICAgICAgICBwaGFzZTogXCJzZXNzaW9uX2V4cGlyZWRcIixcbiAgICAgICAgICAgICAgdHM6IERhdGUubm93KCksIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBleHBpcmVkOiB0cnVlIH0pOyB9IGNhdGNoIHt9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJydW5OaGlBcGlTeW5jIGZhaWxlZFwiLCBlKTtcbiAgICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcnVubmluZzogZmFsc2UsIHByb2dyZXNzOiBgXHUyNzRDICR7ZS5tZXNzYWdlfWAsIHBoYXNlOiBcImVycm9yXCIgfSk7XG4gICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiBmYWxzZSwgZXJyb3I6IGUubWVzc2FnZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3RvcFN5bmNcIikge1xuICAgIC8vIFNldCB0aGUgY2FuY2VsbGF0aW9uIGZsYWc7IHRoZSBpbi1mbGlnaHQgc3luYyB3aWxsIHRocm93XG4gICAgLy8gQ0FOQ0VMX0VSUk9SIGF0IGl0cyBuZXh0IGNoZWNrQ2FuY2VsKCkgY2FsbC4gIFN0b3JhZ2UgaXMgYWxyZWFkeVxuICAgIC8vIHVwZGF0ZWQgYnkgdGhlIHBvcHVwLCBzbyB3ZSBkb24ndCB0b3VjaCBpdCBoZXJlLlxuICAgIF9jYW5jZWxsZWQgPSB0cnVlO1xuICAgIC8vIERpc2NhcmQgYW55IHBhcnRpYWwgZGF0YSB1cGxvYWRlZCBzbyBmYXIuIFRoZSB1c2VyJ3Mgc3RhdGVkXG4gICAgLy8gY29udHJhY3QgaXMgJ3N0b3AgPSBhYm9ydCwgSSdsbCByZXN5bmMgZnJvbSBzY3JhdGNoIGxhdGVyJyBcdTIwMTQgd2VcbiAgICAvLyBkb24ndCB3YW50IHRvIGxlYXZlIGEgaGFsZi1sb2FkZWQgcGF0aWVudCBpbiB0aGUgRkhJUiBzdG9yZSB0aGF0XG4gICAgLy8gbG9va3MgY29tcGxldGUgdG8gZG93bnN0cmVhbSBTTUFSVCBhcHBzLlxuICAgIGNvbnN0IGN0eCA9IF9hY3RpdmVTeW5jQ3R4O1xuICAgIGlmIChjdHg/LnBhdGllbnRJZCAmJiBjdHguYmFja2VuZCkge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIGRlcml2ZVBhdGllbnRJZChyYXdJZCksIHNvIHRoZVxuICAgICAgICAgIC8vIERFTEVURSBwYXRoIG11c3QgdXNlIHRoZSBoYXNoZWQgZm9ybSBcdTIwMTQgc2VuZGluZyB0aGUgcmF3IElEXG4gICAgICAgICAgLy8gbWF0Y2hlcyBub3RoaW5nIGFuZCBsZWF2ZXMgdGhlIHBhcnRpYWwgdXBsb2FkIGluIHRoZSBzdG9yZS5cbiAgICAgICAgICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKGN0eC5wYXRpZW50SWQpO1xuICAgICAgICAgIGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYCR7Y3R4LmJhY2tlbmR9L3N5bmMvcGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IGN0eC5zeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGN0eC5zeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBTdXJmYWNlIHRoZSB3aXBlIGluIHRoZSBzdGF0dXMgc28gdXNlciBzZWVzIGl0IGFjdHVhbGx5IGhhcHBlbmVkLlxuICAgICAgICAgIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBbU1RPUkFHRV9LRVldOiB7XG4gICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1REYyXHU1MDVDXHU2QjYyXHU0RTI2XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBjYW5jZWwgd2lwZSBmYWlsZWQ6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG4gICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImdldFN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkudGhlbigoZGF0YSkgPT4gc2VuZFJlc3BvbnNlKGRhdGFbU1RPUkFHRV9LRVldIHx8IG51bGwpKTtcbiAgICByZXR1cm4gdHJ1ZTsgIC8vIGFzeW5jIHJlc3BvbnNlXG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjbGVhclN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShTVE9SQUdFX0tFWSkudGhlbigoKSA9PiBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjaGVja05oaUxvZ2luXCIpIHtcbiAgICBfY2hlY2tOaGlMb2dpblN0YXRlKG1zZy50YWJJZCkudGhlbihcbiAgICAgIChzdGF0ZSkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogc3RhdGUgfSk7IH0gY2F0Y2gge30gfSxcbiAgICAgICgpID0+IHsgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgbG9nZ2VkSW46IG51bGwgfSk7IH0gY2F0Y2gge30gfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcblxuLy8gQmVsdC1hbmQtc3VzcGVuZGVycyBTVyBrZWVwYWxpdmU6IGFuIGFsYXJtIGV2ZXJ5IDIwIHMgd2FrZXMgdGhlIFNXIGlmXG4vLyBpZGxlLiBDb21iaW5lZCB3aXRoIHRoZSByZXR1cm4tdHJ1ZSBwYXR0ZXJuIGFib3ZlLCB0aGlzIHByZXZlbnRzIHRoZVxuLy8gMzAgcyBpZGxlIHNodXRkb3duIGZyb20gZW5kaW5nIGFuIGluLXByb2dyZXNzIHN5bmMuXG5jaHJvbWUuYWxhcm1zLmNyZWF0ZShcInN3LWtlZXBhbGl2ZVwiLCB7IHBlcmlvZEluTWludXRlczogMC4zNCB9KTtcblxuLy8gUEhJIFRUTCBzd2VlcCAoc2VjdXJpdHkgYXVkaXQgIzUpOiBldmVuIHRob3VnaCBwZW5kaW5nRmhpckJ1bmRsZSBub3dcbi8vIGxpdmVzIGluIGNocm9tZS5zdG9yYWdlLnNlc3Npb24gKGF1dG8tY2xlYXJlZCBvbiBicm93c2VyIGNsb3NlKSBhbmRcbi8vIGRvd25sb2FkUGVuZGluZ0J1bmRsZSB3aXBlcyBpdCBvbiB1c2VyLWluaXRpYXRlZCBzYXZlLCBhIHVzZXIgd2hvXG4vLyBjb21wbGV0ZXMgYSBzeW5jIGFuZCB0aGVuIGxlYXZlcyB0aGUgYnJvd3NlciBvcGVuIGZvciBob3VycyB3aXRob3V0XG4vLyBkb3dubG9hZGluZyB3b3VsZCBzdGlsbCBoYXZlIGFuIGluLW1lbW9yeSBjb3B5IGxpbmdlcmluZy4gVGhlIDEwLW1pblxuLy8gYWxhcm0gY2hlY2tzIHRoZSBzdGFzaCdzIGFnZSBhbmQgZHJvcHMgaXQgb25jZSBpdCBleGNlZWRzXG4vLyBQRU5ESU5HX0JVTkRMRV9UVExfTVMgKDEgaG91cikuXG5jaHJvbWUuYWxhcm1zLmNyZWF0ZShQRU5ESU5HX0JVTkRMRV9TV0VFUF9BTEFSTSwgeyBwZXJpb2RJbk1pbnV0ZXM6IDEwIH0pO1xuXG5hc3luYyBmdW5jdGlvbiBfc3dlZXBQZW5kaW5nQnVuZGxlSWZTdGFsZSgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgICBpZiAoIXBlbmRpbmcpIHJldHVybjtcbiAgICBjb25zdCBhZ2UgPSBEYXRlLm5vdygpIC0gKHBlbmRpbmcuZ2VuZXJhdGVkQXQgfHwgMCk7XG4gICAgaWYgKGFnZSA+IFBFTkRJTkdfQlVORExFX1RUTF9NUykge1xuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5yZW1vdmUoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgICB9XG4gIH0gY2F0Y2gge31cbn1cblxuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKChhbGFybSkgPT4ge1xuICBpZiAoYWxhcm0ubmFtZSA9PT0gUEVORElOR19CVU5ETEVfU1dFRVBfQUxBUk0pIHtcbiAgICBfc3dlZXBQZW5kaW5nQnVuZGxlSWZTdGFsZSgpO1xuICB9XG4gIC8vIHN3LWtlZXBhbGl2ZSBpcyBhIG5vLW9wOyB0aGUgYWxhcm0gZmlyaW5nIGlzIHdoYXQga2VlcHMgdGhlIFNXIGFsaXZlLlxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FB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LE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJO0FBQUEsUUFDM0Q7QUFFQSxh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QUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1WLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFVVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFjVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVB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SUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBRVYsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUNFO0FBQUEsSUFDRixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBO0FBQUEsSUFFWCxXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7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UyxpQkFBaUI7QUFDakMsYUFBTyxRQUFRLE1BQU0sSUFBSSxXQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsYUFBYSxLQUFLLFdBQVcsS0FBSyxJQUFJLENBQUM7QUFDNUYsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxtQkFBbUI7QUFDbkMsYUFBTyxRQUFRLE1BQU0sT0FBTyxXQUFXLEVBQUUsS0FBSyxNQUFNLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDO0FBQzlFLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsaUJBQWlCO0FBQ2pDLDBCQUFvQixJQUFJLEtBQUssRUFBRTtBQUFBLFFBQzdCLENBQUMsVUFBVTtBQUFFLGNBQUk7QUFBRSx5QkFBYSxFQUFFLFVBQVUsTUFBTSxDQUFDO0FBQUEsVUFBRyxRQUFRO0FBQUEsVUFBQztBQUFBLFFBQUU7QUFBQSxRQUNqRSxNQUFNO0FBQUUsY0FBSTtBQUFFLHlCQUFhLEVBQUUsVUFBVSxLQUFLLENBQUM7QUFBQSxVQUFHLFFBQVE7QUFBQSxVQUFDO0FBQUEsUUFBRTtBQUFBLE1BQzdEO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGLENBQUM7QUFLRCxTQUFPLE9BQU8sT0FBTyxnQkFBZ0IsRUFBRSxpQkFBaUIsS0FBSyxDQUFDO0FBUzlELFNBQU8sT0FBTyxPQUFPLDRCQUE0QixFQUFFLGlCQUFpQixHQUFHLENBQUM7QUFFeEUsaUJBQWUsNkJBQTZCO0FBQzFDLFFBQUk7QUFDRixZQUFNLEVBQUUsQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLElBQ3BDLE1BQU0sT0FBTyxRQUFRLFFBQVEsSUFBSSxrQkFBa0I7QUFDckQsVUFBSSxDQUFDLFFBQVM7QUFDZCxZQUFNLE1BQU0sS0FBSyxJQUFJLEtBQUssUUFBUSxlQUFlO0FBQ2pELFVBQUksTUFBTSx1QkFBdUI7QUFDL0IsY0FBTSxPQUFPLFFBQVEsUUFBUSxPQUFPLGtCQUFrQjtBQUFBLE1BQ3hEO0FBQUEsSUFDRixRQUFRO0FBQUEsSUFBQztBQUFBLEVBQ1g7QUFFQSxTQUFPLE9BQU8sUUFBUSxZQUFZLENBQUMsVUFBVTtBQUMzQyxRQUFJLE1BQU0sU0FBUyw0QkFBNEI7QUFDN0MsaUNBQTJCO0FBQUEsSUFDN0I7QUFBQSxFQUVGLENBQUM7IiwKICAibmFtZXMiOiBbIkJ1ZmZlciIsICJibG9ja3MiLCAiZXhwb3J0cyIsICJtYXBTeXN0ZW0iLCAiZXNjYXBlUmVnZXgiLCAiaGl0IiwgImNqa0NoYXJzIiwgIm9ic0lkIiwgIm1hcFN5c3RlbSIsICJyIl0KfQo=
