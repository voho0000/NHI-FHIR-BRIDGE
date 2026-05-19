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
    // Historical bug (caught externally): NHI 09106C was mapped to LOINC
    // 3024-7 with a comment claiming "Thyroxine free", but 3024-7 is
    // actually TOTAL T4 ("Thyroxine (T4) [Mass/volume] in Serum or
    // Plasma"). Downstream SMART apps using LOINC to route the value
    // sent Free T4 results to their Total T4 column — Free T4 column
    // stayed empty. Correct LOINC for Free T4 is 14920-3. Same family
    // of "copy-paste wrong LOINC" bug as the FSH/Estradiol pair fixed
    // in the dual-reviewer audit above; this one slipped through.
    "09106C": "14920-3",
    // Free T4 — Thyroxine (T4) free Mass/vol S/P
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
    "3024-7": "Thyroxine (T4) [Mass/volume] in Serum or Plasma",
    "14920-3": "Thyroxine (T4) free [Mass/volume] in Serum or Plasma",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9uaGktYWRhcHRlcnMuanMiLCAiLi4vc3JjL25oaS1lbmRwb2ludHMuanMiLCAiLi4vc3JjL2JhY2tncm91bmQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG4gKiBbanMtc2hhMV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1zaGExfVxuICpcbiAqIEB2ZXJzaW9uIDAuNy4wXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMjRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4vKmpzbGludCBiaXR3aXNlOiB0cnVlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgSU5QVVRfRVJST1IgPSAnaW5wdXQgaXMgaW52YWxpZCB0eXBlJztcbiAgdmFyIEZJTkFMSVpFX0VSUk9SID0gJ2ZpbmFsaXplIGFscmVhZHkgY2FsbGVkJztcbiAgdmFyIFdJTkRPVyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnO1xuICB2YXIgcm9vdCA9IFdJTkRPVyA/IHdpbmRvdyA6IHt9O1xuICBpZiAocm9vdC5KU19TSEExX05PX1dJTkRPVykge1xuICAgIFdJTkRPVyA9IGZhbHNlO1xuICB9XG4gIHZhciBXRUJfV09SS0VSID0gIVdJTkRPVyAmJiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCc7XG4gIHZhciBOT0RFX0pTID0gIXJvb3QuSlNfU0hBMV9OT19OT0RFX0pTICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgaWYgKE5PREVfSlMpIHtcbiAgICByb290ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFdFQl9XT1JLRVIpIHtcbiAgICByb290ID0gc2VsZjtcbiAgfVxuICB2YXIgQ09NTU9OX0pTID0gIXJvb3QuSlNfU0hBMV9OT19DT01NT05fSlMgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHM7XG4gIHZhciBBTUQgPSB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQ7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAhcm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUiAmJiB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcbiAgdmFyIEVYVFJBID0gWy0yMTQ3NDgzNjQ4LCA4Mzg4NjA4LCAzMjc2OCwgMTI4XTtcbiAgdmFyIFNISUZUID0gWzI0LCAxNiwgOCwgMF07XG4gIHZhciBPVVRQVVRfVFlQRVMgPSBbJ2hleCcsICdhcnJheScsICdkaWdlc3QnLCAnYXJyYXlCdWZmZXInXTtcblxuICB2YXIgYmxvY2tzID0gW107XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICBpZiAocm9vdC5KU19TSEExX05PX05PREVfSlMgfHwgIWlzQXJyYXkpIHtcbiAgICBpc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3O1xuICBpZiAoQVJSQVlfQlVGRkVSICYmIChyb290LkpTX1NIQTFfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgfHwgIWlzVmlldykpIHtcbiAgICBpc1ZpZXcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmJ1ZmZlciAmJiBvYmouYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcjtcbiAgICB9O1xuICB9XG5cbiAgLy8gW21lc3NhZ2U6IHN0cmluZywgaXNTdHJpbmc6IGJvb2xdXG4gIHZhciBmb3JtYXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXNzYWdlO1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIFttZXNzYWdlLCB0cnVlXTtcbiAgICB9XG4gICAgaWYgKHR5cGUgIT09ICdvYmplY3QnIHx8IG1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChBUlJBWV9CVUZGRVIgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBbbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSksIGZhbHNlXTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KG1lc3NhZ2UpICYmICFpc1ZpZXcobWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGNyZWF0ZU91dHB1dE1ldGhvZCA9IGZ1bmN0aW9uIChvdXRwdXRUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IFNoYTEodHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2QgPSBjcmVhdGVPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIGlmIChOT0RFX0pTKSB7XG4gICAgICBtZXRob2QgPSBub2RlV3JhcChtZXRob2QpO1xuICAgIH1cbiAgICBtZXRob2QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKCk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuY3JlYXRlKCkudXBkYXRlKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPVVRQVVRfVFlQRVMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0eXBlID0gT1VUUFVUX1RZUEVTW2ldO1xuICAgICAgbWV0aG9kW3R5cGVdID0gY3JlYXRlT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIHZhciBub2RlV3JhcCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgICB2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgIHZhciBidWZmZXJGcm9tO1xuICAgIGlmIChCdWZmZXIuZnJvbSAmJiAhcm9vdC5KU19TSEExX05PX0JVRkZFUl9GUk9NKSB7XG4gICAgICBidWZmZXJGcm9tID0gQnVmZmVyLmZyb207XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlckZyb20gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihtZXNzYWdlKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBub2RlTWV0aG9kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKG1lc3NhZ2UsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSBudWxsIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG1lc3NhZ2UpIHx8IGlzVmlldyhtZXNzYWdlKSB8fFxuICAgICAgICBtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ1ZmZlckZyb20obWVzc2FnZSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGVNZXRob2Q7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSwgdHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlSG1hY01ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlSG1hY091dHB1dE1ldGhvZCgnaGV4Jyk7XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgSG1hY1NoYTEoa2V5KTtcbiAgICB9O1xuICAgIG1ldGhvZC51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZShrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QodHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRob2Q7XG4gIH07XG5cbiAgZnVuY3Rpb24gU2hhMShzaGFyZWRNZW1vcnkpIHtcbiAgICBpZiAoc2hhcmVkTWVtb3J5KSB7XG4gICAgICBibG9ja3NbMF0gPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICBibG9ja3NbOF0gPSBibG9ja3NbOV0gPSBibG9ja3NbMTBdID0gYmxvY2tzWzExXSA9XG4gICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICB9XG5cbiAgICB0aGlzLmgwID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmgxID0gMHhFRkNEQUI4OTtcbiAgICB0aGlzLmgyID0gMHg5OEJBRENGRTtcbiAgICB0aGlzLmgzID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmg0ID0gMHhDM0QyRTFGMDtcblxuICAgIHRoaXMuYmxvY2sgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMDtcbiAgICB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJzdCA9IHRydWU7XG4gIH1cblxuICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEZJTkFMSVpFX0VSUk9SKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShtZXNzYWdlKTtcbiAgICBtZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgIHZhciBpc1N0cmluZyA9IHJlc3VsdFsxXTtcbiAgICB2YXIgY29kZSwgaW5kZXggPSAwLCBpLCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCB8fCAwLCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgICAgIGJsb2Nrc1swXSA9IHRoaXMuYmxvY2s7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYoaXNTdHJpbmcpIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gY29kZSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvZGUgPSAweDEwMDAwICsgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhmMCB8IChjb2RlID4+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSB0aGlzLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgNjQ7ICsraW5kZXgpIHtcbiAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaTtcbiAgICAgIHRoaXMuYnl0ZXMgKz0gaSAtIHRoaXMuc3RhcnQ7XG4gICAgICBpZiAoaSA+PSA2NCkge1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGkgLSA2NDtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDA7XG4gICAgICB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgdmFyIGJsb2NrcyA9IHRoaXMuYmxvY2tzLCBpID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgIGJsb2Nrc1sxNl0gPSB0aGlzLmJsb2NrO1xuICAgIGJsb2Nrc1tpID4+PiAyXSB8PSBFWFRSQVtpICYgM107XG4gICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgaWYgKGkgPj0gNTYpIHtcbiAgICAgIGlmICghdGhpcy5oYXNoZWQpIHtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgfVxuICAgIGJsb2Nrc1sxNF0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjk7XG4gICAgYmxvY2tzWzE1XSA9IHRoaXMuYnl0ZXMgPDwgMztcbiAgICB0aGlzLmhhc2goKTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhID0gdGhpcy5oMCwgYiA9IHRoaXMuaDEsIGMgPSB0aGlzLmgyLCBkID0gdGhpcy5oMywgZSA9IHRoaXMuaDQ7XG4gICAgdmFyIGYsIGosIHQsIGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgZm9yKGogPSAxNjsgaiA8IDgwOyArK2opIHtcbiAgICAgIHQgPSBibG9ja3NbaiAtIDNdIF4gYmxvY2tzW2ogLSA4XSBeIGJsb2Nrc1tqIC0gMTRdIF4gYmxvY2tzW2ogLSAxNl07XG4gICAgICBibG9ja3Nbal0gPSAgKHQgPDwgMSkgfCAodCA+Pj4gMzEpO1xuICAgIH1cblxuICAgIGZvcihqID0gMDsgaiA8IDIwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IChhICYgYikgfCAoKH5hKSAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoKH5lKSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoKH5kKSAmIGEpO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IChjICYgZCkgfCAoKH5jKSAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgNDA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IGEgXiBiIF4gYztcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IGMgXiBkIF4gZTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDYwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSAtIDE4OTQwMDc1ODggKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKGEgJiBjKSB8IChiICYgYyk7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gKGUgJiBhKSB8IChlICYgYikgfCAoYSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoZCAmIGEpIHwgKGUgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKGMgJiBlKSB8IChkICYgZSk7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA4MDsgaiArPSA1KSB7XG4gICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSA4OTk0OTc1MTQgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSBkIF4gZSBeIGE7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IHRoaXMuaDAgKyBhIDw8IDA7XG4gICAgdGhpcy5oMSA9IHRoaXMuaDEgKyBiIDw8IDA7XG4gICAgdGhpcy5oMiA9IHRoaXMuaDIgKyBjIDw8IDA7XG4gICAgdGhpcy5oMyA9IHRoaXMuaDMgKyBkIDw8IDA7XG4gICAgdGhpcy5oNCA9IHRoaXMuaDQgKyBlIDw8IDA7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBoMCA9IHRoaXMuaDAsIGgxID0gdGhpcy5oMSwgaDIgPSB0aGlzLmgyLCBoMyA9IHRoaXMuaDMsIGg0ID0gdGhpcy5oNDtcblxuICAgIHJldHVybiBIRVhfQ0hBUlNbKGgwID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDAgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gyICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDMgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toNCAmIDB4MEZdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLnRvU3RyaW5nID0gU2hhMS5wcm90b3R5cGUuaGV4O1xuXG4gIFNoYTEucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gW1xuICAgICAgKGgwID4+PiAyNCkgJiAweEZGLCAoaDAgPj4+IDE2KSAmIDB4RkYsIChoMCA+Pj4gOCkgJiAweEZGLCBoMCAmIDB4RkYsXG4gICAgICAoaDEgPj4+IDI0KSAmIDB4RkYsIChoMSA+Pj4gMTYpICYgMHhGRiwgKGgxID4+PiA4KSAmIDB4RkYsIGgxICYgMHhGRixcbiAgICAgIChoMiA+Pj4gMjQpICYgMHhGRiwgKGgyID4+PiAxNikgJiAweEZGLCAoaDIgPj4+IDgpICYgMHhGRiwgaDIgJiAweEZGLFxuICAgICAgKGgzID4+PiAyNCkgJiAweEZGLCAoaDMgPj4+IDE2KSAmIDB4RkYsIChoMyA+Pj4gOCkgJiAweEZGLCBoMyAmIDB4RkYsXG4gICAgICAoaDQgPj4+IDI0KSAmIDB4RkYsIChoNCA+Pj4gMTYpICYgMHhGRiwgKGg0ID4+PiA4KSAmIDB4RkYsIGg0ICYgMHhGRlxuICAgIF07XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXkgPSBTaGExLnByb3RvdHlwZS5kaWdlc3Q7XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG4gICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDAsIHRoaXMuaDApO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMig0LCB0aGlzLmgxKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoOCwgdGhpcy5oMik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDEyLCB0aGlzLmgzKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoMTYsIHRoaXMuaDQpO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgZnVuY3Rpb24gSG1hY1NoYTEoa2V5LCBzaGFyZWRNZW1vcnkpIHtcbiAgICB2YXIgaSwgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShrZXkpO1xuICAgIGtleSA9IHJlc3VsdFswXTtcbiAgICBpZiAocmVzdWx0WzFdKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgbGVuZ3RoID0ga2V5Lmxlbmd0aCwgaW5kZXggPSAwLCBjb2RlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvZGUgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4YzAgfCAoY29kZSA+Pj4gNikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHhlMCB8IChjb2RlID4+PiAxMikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweDNmZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gNikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8IChjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBrZXkgPSBieXRlcztcbiAgICB9XG5cbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDY0KSB7XG4gICAgICBrZXkgPSAobmV3IFNoYTEodHJ1ZSkpLnVwZGF0ZShrZXkpLmFycmF5KCk7XG4gICAgfVxuXG4gICAgdmFyIG9LZXlQYWQgPSBbXSwgaUtleVBhZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgKytpKSB7XG4gICAgICB2YXIgYiA9IGtleVtpXSB8fCAwO1xuICAgICAgb0tleVBhZFtpXSA9IDB4NWMgXiBiO1xuICAgICAgaUtleVBhZFtpXSA9IDB4MzYgXiBiO1xuICAgIH1cblxuICAgIFNoYTEuY2FsbCh0aGlzLCBzaGFyZWRNZW1vcnkpO1xuXG4gICAgdGhpcy51cGRhdGUoaUtleVBhZCk7XG4gICAgdGhpcy5vS2V5UGFkID0gb0tleVBhZDtcbiAgICB0aGlzLmlubmVyID0gdHJ1ZTtcbiAgICB0aGlzLnNoYXJlZE1lbW9yeSA9IHNoYXJlZE1lbW9yeTtcbiAgfVxuICBIbWFjU2hhMS5wcm90b3R5cGUgPSBuZXcgU2hhMSgpO1xuXG4gIEhtYWNTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICB0aGlzLmlubmVyID0gZmFsc2U7XG4gICAgICB2YXIgaW5uZXJIYXNoID0gdGhpcy5hcnJheSgpO1xuICAgICAgU2hhMS5jYWxsKHRoaXMsIHRoaXMuc2hhcmVkTWVtb3J5KTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMub0tleVBhZCk7XG4gICAgICB0aGlzLnVwZGF0ZShpbm5lckhhc2gpO1xuICAgICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV4cG9ydHMgPSBjcmVhdGVNZXRob2QoKTtcbiAgZXhwb3J0cy5zaGExID0gZXhwb3J0cztcbiAgZXhwb3J0cy5zaGExLmhtYWMgPSBjcmVhdGVIbWFjTWV0aG9kKCk7XG5cbiAgaWYgKENPTU1PTl9KUykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiAgfSBlbHNlIHtcbiAgICByb290LnNoYTEgPSBleHBvcnRzO1xuICAgIGlmIChBTUQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwgIi8qKlxuICogQ2VudHJhbGlzZWQgRkhJUiBDb2RlU3lzdGVtIC8gSWRlbnRpZmllclN5c3RlbSBVUklzIHVzZWQgYnkgdGhlIG1hcHBlcnMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvZmhpci9zeXN0ZW1zLnB5YC4gV2UgdXNlIFVSTC1mb3JtIHN5c3RlbXMgaW5zdGVhZFxuICogb2YgT0lEcyBiZWNhdXNlOlxuICogICAtIGl0IGRvZXNuJ3QgcmVxdWlyZSBtaW50aW5nL293bmluZyBhIHJlYWwgTkhJL1RXIGNvcmUgT0lELFxuICogICAtIGl0J3Mgc2VsZi1kZXNjcmliaW5nIGluIHRvb2xzIHRoYXQgZG9uJ3QgcmVjb2duaXNlIHRoZSBPSUQsXG4gKiAgIC0gaXQgY2xlYW5seSBzdXJ2aXZlcyB0aGUgVFdOSElGSElSIHZhbGlkYXRvcidzIHN5bnRhY3RpYyBjaGVjay5cbiAqXG4gKiBBbGwgc3lzdGVtcyBsaXZlIGhlcmUgc28gYSBzaW5nbGUgY2hhbmdlIHJpcHBsZXMgdG8gZXZlcnkgbWFwcGVyLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgbmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU1MDY1XHU0RkREXHU3RjcyXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIChsYWIgKyBwcm9jZWR1cmUgb3JkZXIgY29kZXMgXHUyMDE0IHNhbWUgbmFtZXNwYWNlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfTUVESUNBTF9PUkRFUl9DT0RFID1cbiAgXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1tZWRpY2FsLW9yZGVyLWNvZGVcIjtcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1ODVFNVx1NTRDMVx1NEVFM1x1NzhCQyAoZHJ1ZyBjb2RlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfRFJVR19DT0RFID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1kcnVnLWNvZGVcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRhaXdhbiBwYXRpZW50IGlkZW50aWZpZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIChUYWl3YW4gbmF0aW9uYWwgSUQpLiAqL1xuZXhwb3J0IGNvbnN0IFRXX05BVElPTkFMX0lEID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9JZGVudGlmaWVyU3lzdGVtL25hdGlvbmFsLWlkXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBmYWxsYmFja3MgKHBlci1kZXBsb3ltZW50LCBOT1QgY3Jvc3Mtc3lzdGVtIGNhbm9uaWNhbCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTEFCX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWxhYlwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLW1lZGljYXRpb25cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUkVQT1JUX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLXJlcG9ydFwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9DT05ESVRJT05fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1wcm9jZWR1cmVcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQUxMRVJHRU5fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtYWxsZXJnZW5cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUEFUSUVOVF9NUk4gPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0lkZW50aWZpZXJTeXN0ZW0vaGlzLW1yblwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJuYXRpb25hbCBjb2RlIHN5c3RlbXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBMT0lOQyA9IFwiaHR0cDovL2xvaW5jLm9yZ1wiO1xuZXhwb3J0IGNvbnN0IFNOT01FRF9DVCA9IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiO1xuLyoqIElDRC0xMC1DTSAoVGFpd2FuIC8gXHU1MDY1XHU0RkREIHVzZXMgdGhpcywgbm90IGJhcmUgSUNELTEwKS4gKi9cbmV4cG9ydCBjb25zdCBJQ0RfMTBfQ00gPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiO1xuZXhwb3J0IGNvbnN0IElDRF8xMF9QQ1MgPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1wY3NcIjtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIzNDUwODY2YCBcdTIxOTIgYFAxMjM0NSoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBBbGxlcmd5SW50b2xlcmFuY2UgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9hbGxlcmd5LnB5YC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBBTExPV0VEX0NBVEVHT1JJRVMgPSBuZXcgU2V0KFtcIm1lZGljYXRpb25cIiwgXCJmb29kXCIsIFwiZW52aXJvbm1lbnRcIiwgXCJiaW9sb2dpY1wiXSk7XG5jb25zdCBBTExPV0VEX0NSSVRJQ0FMSVRZID0gbmV3IFNldChbXCJoaWdoXCIsIFwibG93XCIsIFwidW5hYmxlLXRvLWFzc2Vzc1wiXSk7XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJyeG5vcm1cIikpIHJldHVybiBcImh0dHA6Ly93d3cubmxtLm5paC5nb3YvcmVzZWFyY2gvdW1scy9yeG5vcm1cIjtcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0FMTEVSR0VOX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBBbGxlcmd5SW50b2xlcmFuY2UoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBBbGxlcmdlblwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5yZWNvcmRlZF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBwYXRpZW50OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgdmVyaWZpY2F0aW9uU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS12ZXJpZmljYXRpb25cIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgY2F0ZWdvcnkgPSByYXcuY2F0ZWdvcnkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ0FURUdPUklFUy5oYXMoY2F0ZWdvcnkpKSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbY2F0ZWdvcnldO1xuICB9XG5cbiAgY29uc3QgY3JpdGljYWxpdHkgPSByYXcuY3JpdGljYWxpdHkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ1JJVElDQUxJVFkuaGFzKGNyaXRpY2FsaXR5KSkge1xuICAgIHJlc291cmNlLmNyaXRpY2FsaXR5ID0gY3JpdGljYWxpdHk7XG4gIH1cblxuICBpZiAocmF3LnJlY29yZGVkX2RhdGUpIHtcbiAgICByZXNvdXJjZS5yZWNvcmRlZERhdGUgPSBgJHtyYXcucmVjb3JkZWRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgcmVhY3Rpb25Ob3RlID0gcmF3LnJlYWN0aW9uID8/IFwiXCI7XG4gIGlmIChyZWFjdGlvbk5vdGUpIHtcbiAgICByZXNvdXJjZS5yZWFjdGlvbiA9IFt7IGRlc2NyaXB0aW9uOiByZWFjdGlvbk5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBDb25kaXRpb24gbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9jb25kaXRpb24ucHlgLiBJbmNsdWRlcyB0aGUgSUNELTEwLUNNXG4gKiBub3JtYWxpc2VyIChUV05ISUZISVIgUm91bmQtMyBmaXgpIHdoaWNoIGluc2VydHMgdGhlIGNhbm9uaWNhbCBkb3RcbiAqIGJhY2sgaW50byBOSEkncyB1bi1kb3R0ZWQgY29kZXMgKFwiRTExMjJcIiBcdTIxOTIgXCJFMTEuMjJcIikuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuLy8gSUNELTEwLUNNIGNhbm9uaWNhbCBmb3JtIGlzICdYWFguWVlZW0EtWl0nIChjYXRlZ29yeSAzIGNoYXJzICsgb3B0aW9uYWxcbi8vIGRvdCArIHN1YmRpdmlzaW9uICsgb3B0aW9uYWwgN3RoLWNoYXJhY3RlciBleHRlbnNpb24pLiBOSEkgXHU1MDY1XHU0RkREIHNlbmRzXG4vLyBjb2RlcyBXSVRIT1VUIHRoZSBkb3QgKCdFMTEyMicsICdNNDc4OTInLCAnUzA5OTNYQScsICdNMTkyNzEnKS5cbi8vIFZhbGlkYXRvciByZWplY3RzIHVuLWRvdHRlZCBjb2RlcyBhcyAnVW5rbm93biBjb2RlJy5cbmNvbnN0IElDRDEwX0NBVEVHT1JZX1JFID0gL15bQS1aXVswLTlBLVpdezJ9JC87XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBkb3QgYmFjayBpbnRvIE5ISSdzIG5vLWRvdCBJQ0QtMTAtQ00gY29kZXMuXG4gKiAgIEUxMTIyICAgIFx1MjE5MiBFMTEuMjJcbiAqICAgTTQ3ODkyICAgXHUyMTkyIE00Ny44OTJcbiAqICAgUzA5OTNYQSAgXHUyMTkyIFMwOS45M1hBXG4gKiAgIEUxMSAgICAgIFx1MjE5MiBFMTEgICAgICAgIChubyBzdWJkaXZpc2lvbjsgcGFzcyB0aHJvdWdoKVxuICogICBFMTEuMjIgICBcdTIxOTIgRTExLjIyICAgICAoYWxyZWFkeSBkb3R0ZWQ7IHBhc3MgdGhyb3VnaClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUljZDEwQ20oY29kZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghY29kZSB8fCBjb2RlLmluY2x1ZGVzKFwiLlwiKSkgcmV0dXJuIGNvZGUgPz8gXCJcIjtcbiAgY29uc3QgcyA9IGNvZGUudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG4gIGlmIChzLmxlbmd0aCA8PSAzKSByZXR1cm4gcztcbiAgY29uc3QgaGVhZCA9IHMuc2xpY2UoMCwgMyk7XG4gIGNvbnN0IHRhaWwgPSBzLnNsaWNlKDMpO1xuICBpZiAoSUNEMTBfQ0FURUdPUllfUkUudGVzdChoZWFkKSkge1xuICAgIHJldHVybiBgJHtoZWFkfS4ke3RhaWx9YDtcbiAgfVxuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZC0xMFwiKSB8fCBzLmluY2x1ZGVzKFwiaWNkMTBcIikpIHtcbiAgICAvLyBOSEkgXHU1MDY1XHU0RkREIGNvZGVzIGFyZSBJQ0QtMTAtQ00gKFVTL1RhaXdhbiBleHRlbmRlZCBzZXQgXHUyMDE0IGUuZy5cbiAgICAvLyBFMTEuMjIpLiBUaGUgYmFzZSBJQ0QtMTAgVmFsdWVTZXQgcmVqZWN0cyB0aGVzZSBhcyAnVW5rbm93biBjb2RlJy5cbiAgICByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfQ007XG4gIH1cbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0NPTkRJVElPTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQ29uZGl0aW9uKHJhdzogUmVjb3JkPHN0cmluZywgYW55PiwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBDb25kaXRpb25cIjtcbiAgbGV0IGNvZGUgPSByYXcuY29kZSBhcyBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcbiAgaWYgKHN5c3RlbSA9PT0gc3lzdGVtcy5JQ0RfMTBfQ00gJiYgY29kZSkge1xuICAgIGNvZGUgPSBub3JtYWxpemVJY2QxMENtKGNvZGUpO1xuICB9XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkNvbmRpdGlvblwiLFxuICAgIC8vIFN0YWJsZSBpZCBmYWxscyBiYWNrIHRvIGRpc3BsYXkgd2hlbiBubyBjb2RlIGlzIHByZXNlbnQgKGNhdGFzdHJvcGhpY1xuICAgIC8vIGlsbG5lc3Mgcm93cyBmcm9tIElIS0UzMjA5IGNhcnJ5IHRoZSBDaGluZXNlIG5hcnJhdGl2ZSBvbmx5KS4gTWlycm9yc1xuICAgIC8vIHRoZSBzYW1lIGBjb2RlIHx8IGRpc3BsYXlgIHBhdHRlcm4gaW4gZGlhZ25vc3RpYy1yZXBvcnQudHMgYW5kXG4gICAgLy8gYWxsZXJneS50cyBcdTIwMTQgYXZvaWRzIGhhc2ggY29sbGlzaW9ucyBiZXR3ZWVuIHR3byBzYW1lLWRheSBjb2RlLWxlc3NcbiAgICAvLyBjb25kaXRpb25zLlxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3Lm9uc2V0X2RhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY2xpbmljYWxTdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLWNsaW5pY2FsXCIsXG4gICAgICAgICAgY29kZTogcmF3LmNsaW5pY2FsX3N0YXR1cyA/PyBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9jb25kaXRpb24tdmVyLXN0YXR1c1wiLFxuICAgICAgICAgIGNvZGU6IFwiY29uZmlybWVkXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH07XG5cbiAgLy8gQ2F0ZWdvcnkgcm91dGVzIHRoZSBDb25kaXRpb24gaW50byB0aGUgcmlnaHQgZG93bnN0cmVhbSB2aWV3LlxuICAvLyAtIFwicHJvYmxlbS1saXN0LWl0ZW1cIiBcdTIxOTIgU01BUlQgLyBJUFMgUHJvYmxlbSBMaXN0IHNlY3Rpb25cbiAgLy8gLSBcImVuY291bnRlci1kaWFnbm9zaXNcIiBcdTIxOTIgcGVyLWVuY291bnRlciBkaWFnbm9zZXNcbiAgLy8gLSBcImhlYWx0aC1jb25jZXJuXCIgXHUyMTkyIElQUyBIZWFsdGggQ29uY2VybnNcbiAgLy8gQWRhcHRlci1sZXZlbCBkZWNpc2lvbjogXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1IHJvd3MgbWFyayBjYXRlZ29yeT1cInByb2JsZW0tbGlzdC1pdGVtXCI7XG4gIC8vIGdlbmVyaWMgZW5jb3VudGVyLWRlcml2ZWQgY29uZGl0aW9ucyBjYW4gb21pdCwgZGVmYXVsdGluZyB0byBub1xuICAvLyBleHBsaWNpdCBjYXRlZ29yeSAoU01BUlQgYXBwcyBmYWxsIHRocm91Z2ggdG8gYWxsLWNvbmRpdGlvbnMgdmlldykuXG4gIGlmIChyYXcuY2F0ZWdvcnkpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiByYXcuY2F0ZWdvcnksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIHJlc291cmNlLmNvZGUgPSB7XG4gICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICB0ZXh0OiBkaXNwbGF5LFxuICB9O1xuXG4gIGNvbnN0IHNldmVyaXR5ID0gcmF3LnNldmVyaXR5ID8/IFwiXCI7XG4gIGlmIChzZXZlcml0eSkge1xuICAgIHJlc291cmNlLnNldmVyaXR5ID0geyB0ZXh0OiBzZXZlcml0eSB9O1xuICB9XG5cbiAgaWYgKHJhdy5vbnNldF9kYXRlKSB7XG4gICAgcmVzb3VyY2Uub25zZXREYXRlVGltZSA9IGAke3Jhdy5vbnNldF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIERpYWdub3N0aWNSZXBvcnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9kaWFnbm9zdGljX3JlcG9ydC5weWAuIFJldHVybnMgbnVsbCBmb3JcbiAqIGxpc3QtcGFnZSByb3dzIGxhY2tpbmcgYSBjb25jbHVzaW9uLCBhbmQgZm9yIGxhYi12YWx1ZS1vbmx5IFwicmVwb3J0c1wiXG4gKiB0aGF0IHdvdWxkIGR1cGxpY2F0ZSBhIHByb3BlciBPYnNlcnZhdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBWMl8wMDc0ID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIjtcblxuY29uc3QgQ0FURUdPUllfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBMQUI6IFtWMl8wMDc0LCBcIkxBQlwiLCBcIkxhYm9yYXRvcnlcIl0sXG4gIFJBRDogW1YyXzAwNzQsIFwiUkFEXCIsIFwiUmFkaW9sb2d5XCJdLFxuICBDQVI6IFtWMl8wMDc0LCBcIkNBUlwiLCBcIkNhcmRpb2xvZ3lcIl0sXG4gIFBBVEg6IFtWMl8wMDc0LCBcIlBBVFwiLCBcIlBhdGhvbG9neVwiXSxcbn07XG5cbi8vIExhYi1yZXN1bHQgcGF0dGVybnMgdGhhdCBsb29rIGxpa2Ugc2luZ2xlLXZhbHVlIGxhYiByZWFkaW5ncyByYXRoZXJcbi8vIHRoYW4gYSBuYXJyYXRpdmUgcmVwb3J0LlxuY29uc3QgTEFCX1VOSVRfUkUgPVxuICAvXFxkKyg/OlxcLlxcZCspP1xccyooPzolfG1nXFwvZEx8Z1xcL2RMfG1tb2xcXC9MfFVcXC9MfElVXFwvTHxtSVVcXC9MfG5nXFwvbUx8XHUwM0JDZ1xcL2RMfHVnXFwvZEx8cGdcXC9tTHxmTHxcXC91THwxMFxcXj9cXGQrXFwvdUx8eDEwXFxeP1xcZCtcXC91THxzZWN8XHU3OUQyfGNvcGllc1xcL21MKS87XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgdGV4dCA9IGNvbmNsdXNpb24udHJpbSgpO1xuICAvLyBSZWFsIG5hcnJhdGl2ZSByZXBvcnRzIGFsbW9zdCBhbHdheXMgY29udGFpbiBtdWx0aXBsZSBzZW50ZW5jZXMuXG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDEwMCkgcmV0dXJuIGZhbHNlO1xuICAvLyBTaW5nbGUgdmFsdWUgcGF0dGVybiArIHBhcmVudGhldGljYWwgcmVmZXJlbmNlIHJhbmdlID0gbGFiIGxpbmUuXG4gIGlmIChMQUJfVU5JVF9SRS50ZXN0KHRleHQpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwRGlhZ25vc3RpY1JlcG9ydChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgY29uY2x1c2lvbiA9ICgocmF3LmNvbmNsdXNpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY2F0S2V5UmF3ID0gU3RyaW5nKHJhdy5jYXRlZ29yeSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAoY2F0S2V5UmF3ID09PSBcIkxBQlwiICYmIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBSZXBvcnRcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW1IaW50ID0gcmF3LnN5c3RlbSA/PyBcIlwiO1xuICBjb25zdCBzeXN0ZW0gPVxuICAgIHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiICYmIHN5c3RlbUhpbnQudG9VcHBlckNhc2UoKSA9PT0gXCJMT0lOQ1wiXG4gICAgICA/IHN5c3RlbXMuTE9JTkNcbiAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfUkVQT1JUX0NPREU7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJmaW5hbFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgICBjb25jbHVzaW9uLFxuICB9O1xuXG4gIGNvbnN0IGNhdEVudHJ5ID0gQ0FURUdPUllfTUFQW2NhdEtleVJhd107XG4gIGlmIChjYXRFbnRyeSkge1xuICAgIGNvbnN0IFtjYXRTeXMsIGNhdENvZGUsIGNhdERpc3BsYXldID0gY2F0RW50cnk7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbeyBjb2Rpbmc6IFt7IHN5c3RlbTogY2F0U3lzLCBjb2RlOiBjYXRDb2RlLCBkaXNwbGF5OiBjYXREaXNwbGF5IH1dIH1dO1xuICB9XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcuaXNzdWVkKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3Lmlzc3VlZH1UMDA6MDA6MDArMDg6MDBgO1xuICB9IGVsc2UgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IGhvc3BpdGFsIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogRW5jb3VudGVyIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZW5jb3VudGVyLnB5YC4gU3RhYmxlIElEIGluY2x1ZGVzIGhvc3BpdGFsXG4gKiBzbyBzYW1lLWRheSB2aXNpdHMgdG8gZGlmZmVyZW50IGluc3RpdHV0aW9ucyBlYWNoIGdldCB0aGVpciBvd25cbiAqIEVuY291bnRlciAodGhlIHBvc3QtbWFwcGluZyBsaW5rZXIgZGVwZW5kcyBvbiB0aGlzKS5cbiAqL1xuXG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUNUQ09ERV9TWVNURU0gPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtQWN0Q29kZVwiO1xuXG5jb25zdCBDTEFTU19NQVA6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4gPSB7XG4gIEFNQjogW0FDVENPREVfU1lTVEVNLCBcIkFNQlwiLCBcImFtYnVsYXRvcnlcIl0sXG4gIElNUDogW0FDVENPREVfU1lTVEVNLCBcIklNUFwiLCBcImlucGF0aWVudCBlbmNvdW50ZXJcIl0sXG4gIEVNRVI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJFTUVSXCIsIFwiZW1lcmdlbmN5XCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEVuY291bnRlcihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGVuY0NsYXNzID0gU3RyaW5nKHJhdy5jbGFzcyA/PyBcIkFNQlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjbGFzc0VudHJ5ID0gQ0xBU1NfTUFQW2VuY0NsYXNzXSA/PyBDTEFTU19NQVAuQU1CITtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiRW5jb3VudGVyXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgcmF3LmRhdGUgPz8gXCJcIiwgZW5jQ2xhc3MsICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmlzaGVkXCIsXG4gICAgY2xhc3M6IHtcbiAgICAgIHN5c3RlbTogY2xhc3NFbnRyeVswXSxcbiAgICAgIGNvZGU6IGNsYXNzRW50cnlbMV0sXG4gICAgICBkaXNwbGF5OiBjbGFzc0VudHJ5WzJdLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICAvLyBOSEkncyBlbmNvdW50ZXIgXCJ0eXBlXCIgbWFya2VycyBcdTIwMTQgJ0lDXHU1MzYxXHU4Q0M3XHU2NTk5JyAvICdcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTknIC8gJ1x1NEY0Rlx1OTY2MidcbiAgLy8gXHUyMDE0IGFyZSBkYXRhLW9yaWdpbiBsYWJlbHMsIG5vdCBTTk9NRUQgY2xpbmljYWwgdHlwZXMuIEtlZXAgdGhlbSBhc1xuICAvLyBDb2RlYWJsZUNvbmNlcHQudGV4dCB3aXRob3V0IGNsYWltaW5nIFNOT01FRC5cbiAgY29uc3QgdHlwZURpc3BsYXkgPSAoKHJhdy50eXBlX2Rpc3BsYXkgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICh0eXBlRGlzcGxheSkge1xuICAgIHJlc291cmNlLnR5cGUgPSBbeyB0ZXh0OiB0eXBlRGlzcGxheSB9XTtcbiAgfVxuXG4gIGNvbnN0IHBlcmlvZDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBpZiAocmF3LmRhdGUpIHBlcmlvZC5zdGFydCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuZW5kX2RhdGUpIHBlcmlvZC5lbmQgPSBgJHtyYXcuZW5kX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKE9iamVjdC5rZXlzKHBlcmlvZCkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLnBlcmlvZCA9IHBlcmlvZDtcbiAgfVxuXG4gIGNvbnN0IGRlcGFydG1lbnQgPSByYXcuZGVwYXJ0bWVudCA/PyBcIlwiO1xuICBjb25zdCBwcm92aWRlciA9IHJhdy5wcm92aWRlciA/PyBcIlwiO1xuICBpZiAoZGVwYXJ0bWVudCB8fCBwcm92aWRlcikge1xuICAgIGNvbnN0IHBhcnRpY2lwYW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKHByb3ZpZGVyKSBwYXJ0aWNpcGFudC5pbmRpdmlkdWFsID0geyBkaXNwbGF5OiBwcm92aWRlciB9O1xuICAgIHJlc291cmNlLnBhcnRpY2lwYW50ID0gT2JqZWN0LmtleXMocGFydGljaXBhbnQpLmxlbmd0aCA+IDAgPyBbcGFydGljaXBhbnRdIDogW107XG4gICAgaWYgKGRlcGFydG1lbnQpIHtcbiAgICAgIHJlc291cmNlLnNlcnZpY2VUeXBlID0geyB0ZXh0OiBkZXBhcnRtZW50IH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2Uuc2VydmljZVByb3ZpZGVyID0geyBkaXNwbGF5OiBob3NwaXRhbCB9O1xuICB9XG5cbiAgY29uc3QgcmVhc29uID0gcmF3LnJlYXNvbiA/PyBcIlwiO1xuICBpZiAocmVhc29uKSB7XG4gICAgcmVzb3VyY2UucmVhc29uQ29kZSA9IFt7IHRleHQ6IHJlYXNvbiB9XTtcbiAgfVxuXG4gIGNvbnN0IGRpc2NoYXJnZSA9IHJhdy5kaXNjaGFyZ2VfZGlzcG9zaXRpb24gPz8gXCJcIjtcbiAgaWYgKGRpc2NoYXJnZSkge1xuICAgIHJlc291cmNlLmhvc3BpdGFsaXphdGlvbiA9IHsgZGlzY2hhcmdlRGlzcG9zaXRpb246IHsgdGV4dDogZGlzY2hhcmdlIH0gfTtcbiAgfVxuXG4gIGNvbnN0IGNsaW5pY2FsTm90ZSA9ICgocmF3LmNsaW5pY2FsX25vdGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChjbGluaWNhbE5vdGUpIHtcbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogY2xpbmljYWxOb3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogTWVkaWNhdGlvblJlcXVlc3QgbWFwcGVyICsgYmlsaW5ndWFsIGRlZHVwbGljYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL21lZGljYXRpb24ucHlgLiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHJlcG9ydHMgdGhlXG4gKiBTQU1FIHByZXNjcmlwdGlvbiBtdWx0aXBsZSB0aW1lcyAoRW5nbGlzaC1vbmx5IC8gRW5nK1x1NEUyRCAvIFx1NEUyRCtFbmcpLlxuICogYG1hcE1lZGljYXRpb25zRGVkdXBgIGNvbGxhcHNlcyB0aGVzZSB0byBvbmUgTWVkaWNhdGlvblJlcXVlc3QgcGVyXG4gKiAoZGF0ZSwgY2Fub25pY2FsLWRydWcta2V5KSwgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIG1vcmUgQ0pLIGNoYXJzXG4gKiAoY2xpbmljaWFucyByZWFkIFx1NTU0Nlx1NTRDMVx1NTQwRCBmaXJzdCkuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBub3JtYWxpemVJY2QxMENtIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gaXNDamsoY2g6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTRFMDAgKFUrNEUwMCkgdG8gXHU5RkZGIChVKzlGRkYpIGNvdmVycyBDSksgVW5pZmllZCBJZGVvZ3JhcGhzLlxuICBjb25zdCBjcCA9IGNoLmNvZGVQb2ludEF0KDApID8/IDA7XG4gIHJldHVybiBjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmO1xufVxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgaWYgKCFzKSByZXR1cm4gMDtcbiAgbGV0IG4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIGlmIChpc0NqayhjaCkpIG4rKztcbiAgcmV0dXJuIG47XG59XG5cbi8qKlxuICogTWF0Y2ggYSBcImxvbmdcIiBFbmdsaXNoIGNodW5rIChcdTIyNjU0IGNoYXJzIG9mIEEtWi8wLTkvcHVuY3R1YXRpb24gY29tbW9uXG4gKiB0byBkcnVnIG5hbWVzKS4gQXZvaWQgbWF0Y2hpbmcgc2hvcnQgdG9rZW5zIGxpa2UgXCJEXCIgb3IgXCJQT1wiIHRoYXRcbiAqIGFwcGVhciBpbnNpZGUgQ2hpbmVzZSBuYW1lcy5cbiAqL1xuY29uc3QgRU5fQ0hVTktfRyA9IC9bQS1aXVtBLVowLTkuJS9cXC1cIidcXHNdezMsfS9nO1xuXG4vKipcbiAqIFJlZHVjZSBhIGRydWctbmFtZSBzdHJpbmcgdG8gYSBzdGFibGUgY2Fub25pY2FsIGtleS4gRXh0cmFjdCB0aGVcbiAqIGxvbmdlc3QgRW5nbGlzaCBmcmFnbWVudCwgdGhlbiB0cnVuY2F0ZSBhdCBjb21tb24gc2VwYXJhdG9ycyBzbyBhXG4gKiBuYW1lIHdpdGggZXh0cmEgdHJhaWxpbmcgbW9kaWZpZXJzIHN0aWxsIGNvbGxhcHNlcyB0byBicmFuZCtzdHJlbmd0aC5cbiAqXG4gKiBFeGFtcGxlcyAoYWxsIG1hcCB0byBcInRpbW9wdG9sIHhlIDAuNSUgb3BodGhhbG1pYyBzb2x1dGlvblwiKTpcbiAqICAgXCJUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT05cIlxuICogICBcIlRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTiAoXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2KVwiXG4gKiAgIFwiXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2IChUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT04pXCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbERydWdLZXkobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAobmFtZSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjaHVua3MgPSBbLi4ucy5tYXRjaEFsbChFTl9DSFVOS19HKV0ubWFwKChtKSA9PiBtWzBdKTtcbiAgaWYgKGNodW5rcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKG5hbWUgPz8gXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgbGV0IGxvbmdlc3QgPSBjaHVua3MucmVkdWNlKChhLCBiKSA9PiAoYi5sZW5ndGggPiBhLmxlbmd0aCA/IGIgOiBhKSkudHJpbSgpO1xuICBmb3IgKGNvbnN0IHNlcCBvZiBbXCIgLSBcIiwgXCIgXHUyMDEzIFwiLCBcIiAvIFwiXSkge1xuICAgIGlmIChsb25nZXN0LmluY2x1ZGVzKHNlcCkpIHtcbiAgICAgIGxvbmdlc3QgPSBsb25nZXN0LnNwbGl0KHNlcClbMF0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbG9uZ2VzdC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBCZXN0LWVmZm9ydCBhY3RpdmUgdnMgY29tcGxldGVkIGRlY2lzaW9uIGZvciBhIE1lZGljYXRpb25SZXF1ZXN0LlxuICogQWN0aXZlIHdoaWxlIChhdXRob3JlZF9kYXRlICsgZHVyYXRpb24gPiB0b2RheSk7IG90aGVyd2lzZSBjb21wbGV0ZWQuXG4gKiBNaXNzaW5nIGR1cmF0aW9uIFx1MjE5MiBhc3N1bWUgOTAtZGF5IHJlZmlsbCB3aW5kb3cgKE5ISSdzIHR5cGljYWwgY2FkZW5jZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZWRTdGF0dXMoXG4gIGF1dGhvcmVkSXNvOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkdXJhdGlvbkRheXM6IGFueSxcbik6IFwiYWN0aXZlXCIgfCBcImNvbXBsZXRlZFwiIHtcbiAgaWYgKCFhdXRob3JlZElzbykgcmV0dXJuIFwiY29tcGxldGVkXCI7XG4gIGNvbnN0IGRhdGVQYXJ0ID0gU3RyaW5nKGF1dGhvcmVkSXNvKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IHBhcnNlZCA9IG5ldyBEYXRlKGAke2RhdGVQYXJ0fVQwMDowMDowMFpgKTtcbiAgaWYgKE51bWJlci5pc05hTihwYXJzZWQuZ2V0VGltZSgpKSkgcmV0dXJuIFwiY29tcGxldGVkXCI7XG5cbiAgbGV0IGRheXM6IG51bWJlciB8IG51bGw7XG4gIGlmIChkdXJhdGlvbkRheXMgPT09IG51bGwgfHwgZHVyYXRpb25EYXlzID09PSB1bmRlZmluZWQgfHwgZHVyYXRpb25EYXlzID09PSBcIlwiKSB7XG4gICAgZGF5cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbiA9IE51bWJlci5wYXJzZUludChTdHJpbmcoZHVyYXRpb25EYXlzKSwgMTApO1xuICAgIGRheXMgPSBOdW1iZXIuaXNGaW5pdGUobikgPyBuIDogbnVsbDtcbiAgfVxuICBpZiAoZGF5cyA9PT0gbnVsbCkgZGF5cyA9IDkwO1xuXG4gIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHBhcnNlZC5nZXRUaW1lKCkpO1xuICBlbmQuc2V0VVRDRGF0ZShlbmQuZ2V0VVRDRGF0ZSgpICsgZGF5cyk7XG4gIC8vIENvbXBhcmUgZGF0ZS1vbmx5ICh0b2RheSBpbiBVVEMgc2luY2Ugd2UgYXV0aG9yZWRJc28gaXMgZGF0ZS1vbmx5KS5cbiAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICB0b2RheS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGVuZCA+PSB0b2RheSA/IFwiYWN0aXZlXCIgOiBcImNvbXBsZXRlZFwiO1xufVxuXG4vKipcbiAqIENvbnZlcnQgb25lIHNjcmFwZWQgcHJlc2NyaXB0aW9uIGRpY3QgXHUyMTkyIEZISVIgUjQgTWVkaWNhdGlvblJlcXVlc3QuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiByYXcgaGFzIG5vIGBkcnVnX25hbWVgIChjYWxsZXIgZmlsdGVycyBvdXQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTWVkaWNhdGlvblJlcXVlc3QoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGRydWdOYW1lID0gKChyYXcuZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWRydWdOYW1lKSByZXR1cm4gbnVsbDtcblxuICAvLyBDYW5vbmljYWwga2V5IChub3QgcmF3IGRydWdfbmFtZSkgZm9yIHN0YWJsZSBpZCBzbyB0aGUgdGhyZWUgTkhJXG4gIC8vIFx1NEUyRFx1ODJGMSB2YXJpYW50cyBvZiB0aGUgc2FtZSBkcnVnIGNvbGxhcHNlIHRvIG9uZSBGSElSIHJlc291cmNlLlxuICBjb25zdCBtZWRJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSksIHJhdy5kYXRlID8/IFwiXCIpO1xuXG4gIGNvbnN0IGRydWdDb2RlID0gKChyYXcuY29kZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgY29kaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIHN5c3RlbTogZHJ1Z0NvZGUgPyBzeXN0ZW1zLk5ISV9EUlVHX0NPREUgOiBzeXN0ZW1zLkhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUsXG4gICAgY29kZTogZHJ1Z0NvZGUgfHwgZHJ1Z05hbWUsXG4gICAgZGlzcGxheTogZHJ1Z05hbWUsXG4gIH07XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gICAgaWQ6IG1lZElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IG1lZFN0YXR1cyhyYXcuZGF0ZSA/PyBcIlwiLCByYXcuZHVyYXRpb25fZGF5cyksXG4gICAgaW50ZW50OiBcIm9yZGVyXCIsXG4gICAgbWVkaWNhdGlvbkNvZGVhYmxlQ29uY2VwdDoge1xuICAgICAgY29kaW5nOiBbY29kaW5nXSxcbiAgICAgIHRleHQ6IGRydWdOYW1lLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5hdXRob3JlZE9uID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGRydWdDbGFzcyA9ICgocmF3LmRydWdfY2xhc3MgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChkcnVnQ2xhc3MpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFt7IHRleHQ6IGRydWdDbGFzcyB9XTtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnJlcXVlc3RlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIC8vIERvc2FnZSBcdTIwMTQgb25seSB3aGVuIHNvdXJjZSBhY3R1YWxseSBoYXMgaXQuIE5ISSdzIG1lZGljYXRpb24tbGlzdFxuICAvLyBlbmRwb2ludCBwcm92aWRlcyBub25lIG9mIHRoZXNlOyBvdGhlciBISVMgYWRhcHRlcnMgZ2V0IGFcbiAgLy8gc3RydWN0dXJlZCBkb3NhZ2Ugb3V0LlxuICBjb25zdCBkb3NhZ2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgayBvZiBbXCJkb3NlXCIsIFwidW5pdFwiLCBcImZyZXF1ZW5jeVwiXSBhcyBjb25zdCkge1xuICAgIGlmIChyYXdba10pIHBhcnRzLnB1c2goU3RyaW5nKHJhd1trXSkpO1xuICB9XG4gIGlmIChwYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgZG9zYWdlLnRleHQgPSBwYXJ0cy5qb2luKFwiIFwiKTtcbiAgfVxuICBpZiAocmF3LnJvdXRlKSB7XG4gICAgZG9zYWdlLnJvdXRlID0ge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW06IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiLCBkaXNwbGF5OiByYXcucm91dGUgfV0sXG4gICAgfTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMoZG9zYWdlKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UuZG9zYWdlSW5zdHJ1Y3Rpb24gPSBbZG9zYWdlXTtcbiAgfVxuXG4gIC8vIGRpc3BlbnNlUmVxdWVzdCB3aXRoIHF1YW50aXR5ICsgc3VwcGx5IGR1cmF0aW9uIHdoZW4gcHJlc2VudC5cbiAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcXR5UmF3ID0gcmF3LnF1YW50aXR5O1xuICBpZiAocXR5UmF3ICE9PSBudWxsICYmIHF0eVJhdyAhPT0gdW5kZWZpbmVkICYmIHF0eVJhdyAhPT0gXCJcIikge1xuICAgIGNvbnN0IHF0eU51bSA9IE51bWJlci5wYXJzZUZsb2F0KFN0cmluZyhxdHlSYXcpLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocXR5TnVtKSkge1xuICAgICAgZHIucXVhbnRpdHkgPSB7IHZhbHVlOiBxdHlOdW0gfTtcbiAgICB9XG4gIH1cbiAgaWYgKHJhdy5kdXJhdGlvbl9kYXlzKSB7XG4gICAgY29uc3QgZGF5cyA9IE51bWJlci5wYXJzZUludChTdHJpbmcocmF3LmR1cmF0aW9uX2RheXMpLCAxMCk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShkYXlzKSkge1xuICAgICAgZHIuZXhwZWN0ZWRTdXBwbHlEdXJhdGlvbiA9IHtcbiAgICAgICAgdmFsdWU6IGRheXMsXG4gICAgICAgIHVuaXQ6IFwiZGF5c1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiBcImRcIixcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkcikubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRpc3BlbnNlUmVxdWVzdCA9IGRyO1xuICB9XG5cbiAgY29uc3QgaW5kaWNhdGlvbiA9ICgocmF3LmluZGljYXRpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25Db2RlID0gKChyYXcuaW5kaWNhdGlvbl9jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uQ29kZSkge1xuICAgIGNvbnN0IHJjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGluZGljYXRpb25Db2RlKSB7XG4gICAgICByYy5jb2RpbmcgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IHN5c3RlbXMuSUNEXzEwX0NNLFxuICAgICAgICAgIGNvZGU6IG5vcm1hbGl6ZUljZDEwQ20oaW5kaWNhdGlvbkNvZGUpLFxuICAgICAgICAgIGRpc3BsYXk6IGluZGljYXRpb24gfHwgaW5kaWNhdGlvbkNvZGUsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAoaW5kaWNhdGlvbikge1xuICAgICAgcmMudGV4dCA9IGluZGljYXRpb25Db2RlID8gYCR7aW5kaWNhdGlvbkNvZGV9ICR7aW5kaWNhdGlvbn1gLnRyaW0oKSA6IGluZGljYXRpb247XG4gICAgfVxuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbcmNdO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIEdyb3VwLWF3YXJlIG1lZGljYXRpb24gbWFwcGVyIHRoYXQgZGVkdXBlcyBcdTRFMkRcdTgyRjEgXHU5NkQ5XHU4QTlFIGR1cGxpY2F0ZXMuXG4gKlxuICogU3RyYXRlZ3k6XG4gKiAgIDEuIENvbXB1dGUgY2Fub25pY2FsIGtleSBwZXIgZHJ1ZyBuYW1lIChsb25nZXN0IEVuZ2xpc2ggY2h1bmspLlxuICogICAyLiBHcm91cCBieSAoZGF0ZSwgY2Fub25pY2FsX2tleSkuIEtlZXAgT05FIGVudHJ5IHBlciBncm91cCxcbiAqICAgICAgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGJyYW5kXG4gKiAgICAgIG5hbWUgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZpcnN0KS5cbiAqICAgMy4gTWFwIGVhY2gga2VwdCBlbnRyeSB0aHJvdWdoIG1hcE1lZGljYXRpb25SZXF1ZXN0LlxuICpcbiAqIE5vdGU6IFB5dGhvbiBjb21tZW50IHNheXMgXCJtb3JlIENKS1wiIGJ1dCB0aGUgY29kZSB1c2VzIGA8YCAoZmV3ZXIpO1xuICogd2UgcHJlc2VydmUgdGhlIGFjdHVhbCBjb2RlIGJlaGF2aW91ciB0byBrZWVwIHBhcml0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25zRGVkdXAocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGZvciAoY29uc3QgaXRlbSBvZiByYXdJdGVtcykge1xuICAgIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZHJ1Z05hbWUgPSAoKGl0ZW0uZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGlmICghZHJ1Z05hbWUpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRhdGVQYXJ0ID0gKChpdGVtLmRhdGUgPz8gXCJcIikgYXMgc3RyaW5nKS5zbGljZSgwLCAxMCk7XG4gICAgY29uc3Qga2V5ID0gYCR7ZGF0ZVBhcnR9fCR7Y2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSl9YDtcbiAgICBjb25zdCBleGlzdGluZyA9IGJ5S2V5LmdldChrZXkpO1xuICAgIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUHJlZmVyIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmQgbmFtZSkuXG4gICAgICBpZiAoY2prQ2hhcnMoZHJ1Z05hbWUpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZHJ1Z19uYW1lID8/IFwiXCIpKSB7XG4gICAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBieUtleS52YWx1ZXMoKSkge1xuICAgIGNvbnN0IG0gPSBtYXBNZWRpY2F0aW9uUmVxdWVzdChpdGVtLCBwYXRpZW50SWQpO1xuICAgIGlmIChtICE9PSBudWxsKSBvdXQucHVzaChtKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwgIi8qKlxuICogTE9JTkMgbWFwcGluZyB0YWJsZXMgZm9yIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIExPSU5DIFI0IGNvZGluZ3MuXG4gKlxuICogUHVyZSBkYXRhLCBubyBsb2dpYy4gUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19sb2luY190YWJsZXMucHlgLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBfTkhJX1RPX0xPSU5DIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgcHJpbWFyeSBMT0lOQyBtYXBwaW5nLiBTb3VyY2Ugb2YgdHJ1dGg6XG4vLyBUV05ISUZISVIgUEFTIEltcGxlbWVudGF0aW9uIEd1aWRlIENvbmNlcHRNYXAtbmhpLWxvaW5jXG4vLyBodHRwczovL2J1aWxkLmZoaXIub3JnL2lnL1RXTkhJRkhJUi9wYXMvQ29uY2VwdE1hcC1uaGktbG9pbmMuaHRtbFxuLy9cbi8vIFRoYXQgQ29uY2VwdE1hcCBkZWNsYXJlcyA1MyBOSEkgY29kZXMgd2l0aCBgZXF1aXZhbGVuY2U6IHJlbGF0ZWR0b2Bcbi8vIGFnYWluc3QgODA2IExPSU5DIHZhcmlhbnRzIChkaWZmZXJlbnQgc3BlY2ltZW5zIC8gdW5pdHMgLyBtZXRob2RzXG4vLyBwZXIgTkhJIGNvZGUgXHUyMDE0IGNvbmZpcm1pbmcgdGhlIFwiTkhJIGlzIGNvYXJzZSwgTE9JTkMgaXMgZmluZVwiIHZpZXcpLlxuLy8gRm9yIGVhY2ggTkhJIGNvZGUgd2UgaGFuZC1waWNrIHRoZSBjYW5vbmljYWwgTE9JTkMgbW9zdCBjbGluaWNpYW5zXG4vLyB3b3VsZCBleHBlY3QgaW4gYSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgbGFiIHJlcG9ydDogU2VydW0vUGxhc21hICsgTWFzcy12b2x1bWVcbi8vIChvciBhdXRvLWNvdW50IGZvciBjZWxsIGNvdW50ZXJzKS4gRWRnZSBjYXNlcyBub3RlZCBpbmxpbmUuXG5leHBvcnQgY29uc3QgTkhJX1RPX0xPSU5DOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgSGFlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDJDXCI6IFwiNjY5MC0yXCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3OCBcdTIwMTQgTGV1a29jeXRlcyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMDNDXCI6IFwiNzE4LTdcIiwgLy8gXHU4ODQwXHU4MjcyXHU3RDIwXHU2QUEyXHU2N0U1IFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIEJsb29kXG4gIFwiMDgwMDZDXCI6IFwiNzc3LTNcIiwgLy8gXHU4ODQwXHU1QzBGXHU2NzdGXHU4QTA4XHU2NTc4IFx1MjAxNCBQbGF0ZWxldHMgIy92b2wgQmxvb2QgQXV0b1xuICBcIjA4MDEzQ1wiOiBcIjU3MDIxLThcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4IFx1MjAxNCBDQkMgVyBBdXRvIERpZmYgcGFuZWxcbiAgXCIwODEyOEJcIjogXCI0NzI4Ni0wXCIsIC8vIFx1OUFBOFx1OUFEM1x1N0QzMFx1ODBERVx1NUY2Mlx1NjE0Qlx1NTIyNFx1OEI4MFx1NTQwOFx1NEY3NVx1N0QzMFx1ODBERVx1NTIwNlx1OTg1RVx1OEEwOFx1NjU3OFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDExQ1wiOiBcIjE3ODYxLTZcIiwgLy8gXHU5MjIzIFx1MjAxNCBDYWxjaXVtIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDE1Q1wiOiBcIjIxNjAtMFwiLCAvLyBcdTgwOENcdTkxNzhcdTkxNTBcdTMwMDFcdTg4NDAgXHUyMDE0IENyZWF0aW5pbmUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMTZDXCI6IFwiMjE2MS04XCIsIC8vIFx1ODA4Q1x1OTE1MFx1MzAwMVx1NUMzRiBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBVcmluZVxuICBcIjA5MDI1Q1wiOiBcIjE5MjAtOFwiLCAvLyBBU1QvR09UIFx1MjAxNCBBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjZDXCI6IFwiMTc0Mi02XCIsIC8vIEFMVC9HUFQgXHUyMDE0IEFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjlDXCI6IFwiMTk3NS0yXCIsIC8vIFx1ODFCRFx1N0QwNVx1N0QyMFx1N0UzRFx1OTFDRiBcdTIwMTQgQmlsaXJ1YmluIHRvdGFsIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDMwQ1wiOiBcIjE5NjgtN1wiLCAvLyBcdTc2RjRcdTYzQTVcdTgxQkRcdTdEMDVcdTdEMjAgXHUyMDE0IEJpbGlydWJpbiBkaXJlY3QgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzNDXCI6IFwiMjUzMi0wXCIsIC8vIFx1NEU3M1x1OTE3OFx1ODEyQlx1NkMyQlx1ODEyMiBcdTIwMTQgTERIIEFjdGl2aXR5IFMvUFxuICBcIjA5MDM4Q1wiOiBcIjE3NTEtN1wiLCAvLyBcdTc2N0RcdTg2Q0JcdTc2N0QgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzhDXCI6IFwiMzU2NzItNVwiLCAvLyBcdTc2RjRcdTYzQTUvXHU3RTNEXHU4MUJEXHU3RDA1XHU3RDIwXHU2QkQ0XHU1MDNDXG4gIFwiMTIxMTJCXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RChcdTUxNERcdTc1QUJcdTZCRDRcdTZGQzFcdTZDRDUpIFx1MjAxNCBBbGJ1bWluIE1hc3Mvdm9sIFMvUFxuICBcIjI0MDA3QlwiOiBcIjE5OTUtMFwiLCAvLyBcdTg4NDBcdTZGM0ZcdTZFMzhcdTk2RTJcdTkyMjMgXHUyMDE0IENhbGNpdW0gaW9uaXplZCBNb2xlcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBIb3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyMUNcIjogXCIyOTg2LThcIiwgLy8gXHU3NzZBXHU0RTM4XHU5MTZGXHU5MTg3XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgTWFzcy92b2wgUy9QXG4gIFwiMjcwMjFCXCI6IFwiMjk5MS04XCIsIC8vIFx1Nzc2QVx1NEUzOFx1ODEwMlx1OTE4N1x1NjUzRVx1NUMwNFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgVGVzdG9zdGVyb25lIEZyZWUgUy9QXG4gIC8vIDA5MTI1QyAvIDA5MTI3QyBjb3JyZWN0ZWQgYWZ0ZXIgZHVhbC1yZXZpZXdlciBhdWRpdCBcdTIwMTQgdGhlIGVhcmxpZXJcbiAgLy8gdmFsdWVzICgzMDE2LTMgd2FzIFRTSCwgMTA1MDEtNSB3YXMgTEgpIHdlcmUganVzdCB3cm9uZyBjb3B5LVxuICAvLyBwYXN0ZXMuIFNvdXJjZSBmb3IgdGhlIG5ldyB2YWx1ZXM6IFRXTkhJRkhJUiBQQVMgQ29uY2VwdE1hcC5cbiAgXCIwOTEyNUNcIjogXCI4MzA5OC00XCIsIC8vIFx1NkZGRVx1NkNFMVx1NTIzQVx1NkZDMFx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRm9sbGl0cm9waW4gKEZTSCkgSW1tdW5vYXNzYXkgUy9QXG4gIFwiMDkxMjdDXCI6IFwiODMwOTYtOFwiLCAvLyBcdTRFOENcdTZDMkJcdTU3RkFcdTY2MjVcdTYwQzVcdTdEMjBcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IEVzdHJhZGlvbCBJbW11bm9hc3NheSBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFR1bW9yIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDdDXCI6IFwiMTgzNC0xXCIsIC8vIFx1MDNCMS1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDQ5Q1wiOiBcIjE4MzQtMVwiLCAvLyBcdTc1MzItXHU4MENFXHU1MTUyXHU4NkNCXHU3NjdEIChBRlAsIFJJQSlcbiAgXCIxMjA4MUNcIjogXCI4MzExMi0zXCIsIC8vIFBTQSAoRUlBL0xJQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjEyMTk4Q1wiOiBcIjgzMTEzLTFcIiwgLy8gRnJlZSBQU0EgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjI3MDUyQ1wiOiBcIjI4NTctMVwiLCAvLyBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUYgKFBTQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDgzQlwiOiBcIjEwODg2LTBcIiwgLy8gXHU2RTM4XHU5NkUyUFNBIChSSUEpXG4gIFwiMTIwNTJCXCI6IFwiMTA4NzMtOFwiLCAvLyBcdTAzQjIyLVx1NUZBRVx1NzQwM1x1ODZDQlx1NzY3RFxuICAvLyBcdTI1MDBcdTI1MDAgSW1tdW5vbG9neSAvIHByb3RlaW5zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDY1QlwiOiBcIjkwOTkxLTFcIiwgLy8gXHU4NkNCXHU3NjdEXHU5NkZCXHU2Q0YzXHU1MjA2XHU2NzkwXG4gIC8vIDEyMDI4QiAvIDEyMDI5QiBJZ00gKHNlcnVtLCBpbW11bm9kaWZmdXNpb24gLyBuZXBoZWxvbWV0cnkpIFx1MjAxNCBwcmV2aW91c2x5XG4gIC8vIGJvdGggbWFwcGVkIHRvIExPSU5DIDE0MDAyLTAgd2hpY2ggaXMgYWN0dWFsbHkgJ0lnTSBbVW5pdHMvdm9sdW1lXSBpblxuICAvLyBDb3JkIGJsb29kJyAobmVvbmF0YWwgc3BlY2ltZW4sIHZlcmlmaWVkIGxvaW5jLm9yZy8xNDAwMi0wLykuIFdyb25nXG4gIC8vIHNwZWNpbWVuIGZvciBhbiBhZHVsdCBzZXJ1bSBvcmRlci4gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0b1xuICAvLyBOSEktY29kZS1vbmx5IGNvZGluZy4gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxMjEwM0JcIjogXCI5NTgwMS03XCIsIC8vIFx1NTE0RFx1NzVBQlx1OTZGQlx1NkNGM1x1NTIwNlx1Njc5MFxuICBcIjEyMTYwQlwiOiBcIjE1MTg5LTRcIiwgLy8gSWdHIFx1MDNCQS9cdTAzQkJcbiAgXCIxMjE3MUJcIjogXCIxNzM1MS04XCIsIC8vIFx1NjI5N1x1NTVEQ1x1NEUyRFx1NjAyN1x1NzQwM1x1N0QzMFx1ODBERVx1OENFQVx1NjI5N1x1OUFENCAoQU5DQSlcbiAgXCIxMjIwNEJcIjogXCIyMDU4NC05XCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1ODg2OFx1OTc2Mlx1NkExOVx1OEExOFxuICBcIjI1MDEzQlwiOiBcIjQ0NTk2LTVcIiwgLy8gXHU4N0EyXHU1MTQ5XHU1MjA3XHU3MjQ3XHU2QUEyXHU2N0U1XG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTQwMzBDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzFDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzJDXCI6IFwiNTE5Ni0xXCIsIC8vIEhCc0FnIChNYXNzL3ZvbClcbiAgXCIxNDA1MUNcIjogXCIxMzk1NS0wXCIsIC8vIEhDViBBYlxuICBcIjI3MDMzQ1wiOiBcIjUxOTctOVwiLCAvLyBIQnNBZyBSSUFcbiAgLy8gXHUyNTAwXHUyNTAwIFBhdGhvbG9neSAvIGN5dG9sb2d5IC8gSUhDIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMTk1QlwiOiBcIjE4NDc0LTdcIiwgLy8gSGVyLTIvbmV1IElTSFxuICBcIjI3MDYxQlwiOiBcIjE0MTMwLTlcIiwgLy8gXHU1MkQ1XHU2MEM1XHU2RkMwXHU3RDIwXHU2M0E1XHU1M0Q3XHU5QUQ0IChFUilcbiAgXCIyNzA2MkJcIjogXCIxMDg2MS0zXCIsIC8vIFx1OUVDM1x1OUFENFx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoUFIpXG4gIFwiMzAxMDNCXCI6IFwiODMwNTItMVwiLCAvLyBQRC1MMSBJSENcbiAgLy8gXHUyNTAwXHUyNTAwIEF1ZGlvbG9neSAvIHB1bG1vbmFyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNzAwOUJcIjogXCIyNDM0MS0wXCIsIC8vIFx1NEUwMFx1NkMyN1x1NTMxNlx1NzhCM1x1ODBCQVx1NzAzMFx1NjU2M1x1OTFDRlxuICBcIjIyMDAxQ1wiOiBcIjQ1NDk4LTNcIiwgLy8gXHU3RDE0XHU5N0YzXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMTVCXCI6IFwiNDU0OTgtM1wiLCAvLyBcdThBNTBcdTgwN0VcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgXCIyMjAyNUJcIjogXCI0NjUzMC0yXCIsIC8vIFx1ODFFQVx1OEExOFx1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gU1VQUExFTUVOVEFMIChub3QgaW4gUEFTIENvbmNlcHRNYXAgXHUyMDE0IGhhbmQtY3VyYXRlZCBmcm9tIGNvbW1vblxuICAvLyBOSEkgY29kZXMgc2VlbiBpbiBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EuIExPSU5DIHZlcmlmaWVkIGFnYWluc3QgbG9pbmMub3JnXG4gIC8vIGNhbm9uaWNhbCBuYW1lcy4gTWV0aG9kLXNwZWNpZmljIGNvZGVzIChlLmcuIGhzLUNSUCkgcGljayB0aGVcbiAgLy8gc3BlY2lmaWMgTE9JTkM7IGdlbmVyYWwtbWV0aG9kIGNvZGVzIHBpY2sgdGhlIG1vc3QgY29tbW9uIGZvcm0uXG4gIC8vIElmIFx1NTA2NVx1NEZERFx1N0Y3MiBwdWJsaXNoZXMgYW4gYXV0aG9yaXRhdGl2ZSBicm9hZGVyIENvbmNlcHRNYXAgbGF0ZXIsXG4gIC8vIHJlcGxhY2UgdGhpcyBzZWN0aW9uIGluIG9uZSBwYXNzLlxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgLyBIYkExYyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwNUNcIjogXCIxNTU4LTZcIiwgLy8gXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2IChHbHUtQUMpIFx1MjAxNCBGYXN0aW5nIGdsdWNvc2UgTWFzcy92b2wgUy9QXG4gIFwiMDkxNDBDXCI6IFwiMjM0NS03XCIsIC8vIFx1ODg0MFx1N0NENi1cdTk5MTBcdTVGOEMvXHU5NkE4XHU2QTVGIFx1MjAxNCBHbHVjb3NlIE1hc3Mvdm9sIFMvUCAoZ2VuZXJhbClcbiAgXCIwOTAwNkNcIjogXCI0NTQ4LTRcIiwgLy8gXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwIChIYkExYykgXHUyMDE0IEhlbW9nbG9iaW4gQTFjL0hnYi50b3RhbCBCbG9vZFxuICAvLyBcdTI1MDBcdTI1MDAgUmVuYWwgLyBlbGVjdHJvbHl0ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDJDXCI6IFwiMzA5NC0wXCIsIC8vIEJVTiBcdTIwMTQgVXJlYSBuaXRyb2dlbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxM0NcIjogXCIzMDg0LTFcIiwgLy8gVXJpYyBBY2lkIFx1MjAxNCBVcmF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAyMUNcIjogXCIyOTUxLTJcIiwgLy8gTmEgXHUyMDE0IFNvZGl1bSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMjJDXCI6IFwiMjgyMy0zXCIsIC8vIEsgIFx1MjAxNCBQb3Rhc3NpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDI0Q1wiOiBcIjIwMjgtOVwiLCAvLyBDTzIgXHUyMDE0IENhcmJvbiBkaW94aWRlIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAxMkNcIjogXCIyNzc3LTFcIiwgLy8gSW5vcmdhbmljIFAgXHUyMDE0IFBob3NwaGF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NkJcIjogXCIxOTEyMy05XCIsIC8vIE1nIFx1MjAxNCBNYWduZXNpdW0gTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXBpZCBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwMUNcIjogXCIyMDkzLTNcIiwgLy8gVC1DaG9sZXN0ZXJvbCBcdTIwMTQgQ2hvbGVzdGVyb2wgTWFzcy92b2wgUy9QXG4gIFwiMDkwMDRDXCI6IFwiMjU3MS04XCIsIC8vIFRHIFx1MjAxNCBUcmlnbHljZXJpZGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDNDXCI6IFwiMjA4NS05XCIsIC8vIEhETCBcdTIwMTQgSERMIGNob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQ0Q1wiOiBcIjEzNDU3LTdcIiwgLy8gTERMIFx1MjAxNCBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGl2ZXIgZnVuY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMjdDXCI6IFwiNjc2OC02XCIsIC8vIEFMSy1QIFx1MjAxNCBBbGthbGluZSBwaG9zcGhhdGFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzMUNcIjogXCIyMzI0LTJcIiwgLy8gXHUwM0IzLUdUIFx1MjAxNCBHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzNUNcIjogXCIyNTAwLTdcIiwgLy8gVElCQyBcdTIwMTQgSXJvbiBiaW5kaW5nIGNhcGFjaXR5IE1hc3Mvdm9sIFMvUFxuICAvLyAwOTAzN0MgXHU4ODQwXHU2QzI4IFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAxODI3LTUgd2hpY2ggaXMgYWN0dWFsbHlcbiAgLy8gJ0FscGhhIDEgYW50aXRyeXBzaW4gTVMgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEnICh2ZXJpZmllZFxuICAvLyBsb2luYy5vcmcvMTgyNy01LykuIFdyb25nIGFuYWx5dGUgZW50aXJlbHkuIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzXG4gIC8vIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuIFNlZSBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWQuXG4gIFwiMDkwNjRDXCI6IFwiMzA0MC0zXCIsIC8vIExpcGFzZSBcdTIwMTQgQWN0aXZpdHkgUy9QXG4gIFwiMDkwNTlCXCI6IFwiMTQxMTgtNFwiLCAvLyBMYWN0YXRlIFx1MjAxNCBNYXNzL3ZvbCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgZXh0cmFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA4MDA0Q1wiOiBcIjQ1NDQtM1wiLCAvLyBIQ1QgXHUyMDE0IEhlbWF0b2NyaXQgdm9sdW1lIGZyYWN0aW9uIEJsb29kXG4gIFwiMDgwMDhDXCI6IFwiMTQxOTYtMFwiLCAvLyBSZXRpY3Vsb2N5dGUgXHUyMDE0IFJldGljdWxvY3l0ZXMvMTAwIFJCQ1xuICBcIjA4MDEwQ1wiOiBcIjcxMS0yXCIsIC8vIEVvc2lub3BoaWwgY291bnQgXHUyMDE0ICMvdm9sIEJsb29kXG4gIFwiMDgwMTFDXCI6IFwiMjQzMTctMFwiLCAvLyBDQkMgcGFuZWwgXHUyMDE0IEhlbWF0b2xvZ3kgcGFuZWwgQmxvb2RcbiAgXCIwODAyNkNcIjogXCI2MzAxLTZcIiwgLy8gUFQvSU5SIFx1MjAxNCBJTlIgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODAzNkNcIjogXCIxNDk3OS05XCIsIC8vIEFQVFQgXHUyMDE0IFBsYXRlbGV0IHBvb3IgcGxhc21hXG4gIFwiMDgwNzVDXCI6IFwiMjY5Mi03XCIsIC8vIE9zbW9sYWxpdHkgXHUyMDE0IFNlcnVtIG9yIFBsYXNtYVxuICBcIjA4MDc5QlwiOiBcIjMwMjQwLTZcIiwgLy8gRC1kaW1lciBcdTIwMTQgUGx0IHBvb3IgcGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBIaXN0b3JpY2FsIGJ1ZyAoY2F1Z2h0IGV4dGVybmFsbHkpOiBOSEkgMDkxMDZDIHdhcyBtYXBwZWQgdG8gTE9JTkNcbiAgLy8gMzAyNC03IHdpdGggYSBjb21tZW50IGNsYWltaW5nIFwiVGh5cm94aW5lIGZyZWVcIiwgYnV0IDMwMjQtNyBpc1xuICAvLyBhY3R1YWxseSBUT1RBTCBUNCAoXCJUaHlyb3hpbmUgKFQ0KSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yXG4gIC8vIFBsYXNtYVwiKS4gRG93bnN0cmVhbSBTTUFSVCBhcHBzIHVzaW5nIExPSU5DIHRvIHJvdXRlIHRoZSB2YWx1ZVxuICAvLyBzZW50IEZyZWUgVDQgcmVzdWx0cyB0byB0aGVpciBUb3RhbCBUNCBjb2x1bW4gXHUyMDE0IEZyZWUgVDQgY29sdW1uXG4gIC8vIHN0YXllZCBlbXB0eS4gQ29ycmVjdCBMT0lOQyBmb3IgRnJlZSBUNCBpcyAxNDkyMC0zLiBTYW1lIGZhbWlseVxuICAvLyBvZiBcImNvcHktcGFzdGUgd3JvbmcgTE9JTkNcIiBidWcgYXMgdGhlIEZTSC9Fc3RyYWRpb2wgcGFpciBmaXhlZFxuICAvLyBpbiB0aGUgZHVhbC1yZXZpZXdlciBhdWRpdCBhYm92ZTsgdGhpcyBvbmUgc2xpcHBlZCB0aHJvdWdoLlxuICBcIjA5MTA2Q1wiOiBcIjE0OTIwLTNcIiwgLy8gRnJlZSBUNCBcdTIwMTQgVGh5cm94aW5lIChUNCkgZnJlZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTExMkNcIjogXCIzMDE2LTNcIiwgIC8vIFRTSCBcdTIwMTQgVGh5cm90cm9waW4gUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkaWFjIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwOTlDXCI6IFwiMTA4MzktOVwiLCAvLyBUcm9wb25pbiBJIFx1MjAxNCBUcm9wb25pbiBJIGNhcmRpYWMgUy9QXG4gIFwiMTIxOTJDXCI6IFwiMzM5NTktOFwiLCAvLyBQcm9jYWxjaXRvbmluIFx1MjAxNCBTL1BcbiAgXCIxMjE5M0NcIjogXCIzMzc2Mi02XCIsIC8vIE5ULXByb0JOUCBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXRhbWlucyAvIGNvZmFjdG9ycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyOUNcIjogXCIyMTMyLTlcIiwgLy8gVml0IEIxMiBcdTIwMTQgQ29iYWxhbWluIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTMwQ1wiOiBcIjIyODQtOFwiLCAvLyBGb2xhdGUgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjA5MTEzQ1wiOiBcIjIxNDMtNlwiLCAvLyBDb3J0aXNvbCBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIxMTZDXCI6IFwiMjI3Ni00XCIsIC8vIEZlcnJpdGluIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEFjdXRlIHBoYXNlIC8gaW5mbGFtbWF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxMjAxNUMgaXMgdGhlIGdlbmVyaWMgTkhJIENSUCBvcmRlciBcdTIwMTQgbW9zdCBjbGluaWNhbCBjb250ZXh0cyBpbiBcdTUwNjVcdTRGRERcbiAgLy8gc2VuZCBhIHJlZ3VsYXIgKG5vdCBocy0pIENSUCwgc28gbWFwIHRvIDE5ODgtNS4gSWYgYSBcdTk2NjJcdTYyNDAgc3BlY2lmaWNhbGx5XG4gIC8vIGJpbGxzIGhzLUNSUCBpdCB3aWxsIGxhbmQgb24gYSBkaWZmZXJlbnQgY29kZSAoZS5nLiAxMjE4OUMpLlxuICBcIjEyMDE1Q1wiOiBcIjE5ODgtNVwiLCAvLyBDUlAgXHUyMDE0IEMgcmVhY3RpdmUgcHJvdGVpbiBNYXNzL3ZvbCBTL1BcbiAgXCIxMjA1M0NcIjogXCI1MDQ4LTRcIiwgLy8gQU5BIFx1MjAxNCBBbnRpbnVjbGVhciBBYiBUaXRlciBTL1BcbiAgXCIxMjA1NkJcIjogXCIxNjEyNC0wXCIsIC8vIEFudGktbWl0b2Nob25kcmlhbCBBYiBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDYwMTJDXCI6IFwiNTc3OC02XCIsIC8vIFVyaW5lIGFwcGVhcmFuY2UgXHUyMDE0IENvbG9yXG4gIFwiMDYwMTNDXCI6IFwiMjQzNTYtOFwiLCAvLyBcdTVDM0ZcdTc1MUZcdTUzMTYgcGFuZWwgXHUyMDE0IFVyaW5hbHlzaXMgbWFjcm9zY29waWMgcGFuZWxcbiAgXCIwNzAwMUNcIjogXCIxNDU2My0xXCIsIC8vIFN0b29sIG9jY3VsdCBibG9vZFxuICBcIjA5MTM0Q1wiOiBcIjU4NDUzLTJcIiwgLy8gaUZPQlQgcXVhbnRpdGF0aXZlIFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIFN0b29sIGJ5IElBXG4gIFwiMTIxMTFDXCI6IFwiMjE2MS04XCIsIC8vIFVyaW5lIENyZWF0aW5pbmUgXHUyMDE0IHNhbWUgTE9JTkMgYXMgMDkwMTZDXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXJvbG9neSAvIGltbXVub2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDFDXCI6IFwiNTI5Mi04XCIsIC8vIFJQUiBcdTIwMTQgU2VydW0vUGxhc21hXG4gIFwiMTIwMjFDXCI6IFwiMjAzOS02XCIsIC8vIENFQSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMjVCXCI6IFwiMjQ2NS0zXCIsIC8vIElnRyBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMjdCXCI6IFwiMjQ1OC04XCIsIC8vIElnQSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMzFDXCI6IFwiMTkxMTMtMFwiLCAvLyBJZ0UgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyAxMjA2OUIgQ3J5cHRvY29jY3VzIEFnIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyA1MTMyLTYgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0ROQSBzaW5nbGUgc3RyYW5kIEFiIFtVbml0cy92b2x1bWVdIGluIFNlcnVtJyAoYW50aS1zc0ROQSxcbiAgLy8gbHVwdXMgc2Vyb2xvZ3kgXHUyMDE0IHZlcmlmaWVkIGxvaW5jLm9yZy81MTMyLTYvKS4gQ29tcGxldGVseSB3cm9uZ1xuICAvLyBhbmFseXRlLiBMZWF2aW5nIHVubWFwcGVkOyBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLlxuICAvLyBTZWUgZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kLlxuICBcIjEyMDc5Q1wiOiBcIjI0MTA4LTNcIiwgLy8gQ0EgMTktOSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBCbG9vZCB0eXBlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjExMDAxQ1wiOiBcIjg4Mi0xXCIsIC8vIFx1ODg0MFx1NTc4Qlx1OTQ1MVx1NUI5QSBcdTIwMTQgQUJPICsgUmggZ3JvdXBcbiAgXCIxMTAwM0NcIjogXCI4ODItMVwiLCAvLyBcdTg4NDBcdTU3OEJcdTk0NTFcdTVCOUEgXHUyMDE0IEFCTyArIFJoIGdyb3VwXG4gIFwiMTEwMDRDXCI6IFwiODkwLTRcIiwgLy8gXHU2Mjk3XHU5QUQ0XHU1M0NEXHU2MUM5IFx1MjAxNCBBbnRpYm9keSBzY3JlZW5cbiAgLy8gXHUyNTAwXHUyNTAwIE1pY3JvYmlvbG9neSBjdWx0dXJlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTMwMDdDIFx1N0QzMFx1ODNDQ1x1NTdGOVx1OTkwQSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMTQyMTktMCB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnSFRMViBJIHAyNiBBYiBpbiBTZXJ1bScgKHZlcmlmaWVkIGF0IGxvaW5jLm9yZykuIFRoZVxuICAvLyByaWdodCBmYW1pbHkgaXMgNjQ2My00IC8gMTEyNjgtMCAoQmFjdGVyaWEgaWRlbnRpZmllZCBieSBhZXJvYmVcbiAgLy8gY3VsdHVyZSkgYnV0IHRoZSBzb3VyY2Ugcm93IGRvZXNuJ3QgdGVsbCB1cyBzcGVjaW1lbiBcdTIwMTQgbGVhdmluZ1xuICAvLyB1bm1hcHBlZCBzbyB3ZSBkb24ndCBsaWUuIEZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuXG4gIC8vIDEzMDEzQyBUQiBDdWx0dXJlIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAzMTk1Mi01IHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdSaW5kZXJwZXN0IHZpcnVzIEFnIFtQcmVzZW5jZV0gaW4gRXh1ZGF0ZScgKGNhdHRsZVxuICAvLyBtb3JiaWxsaXZpcnVzLCB2ZXJpZmllZCBsb2luYy5vcmcvMzE5NTItNS8pLiBXcm9uZyBvcmdhbmlzbSBlbnRpcmVseS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy4gU2VlXG4gIC8vIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxMzAxNkJcIjogXCI2MDAtN1wiLCAvLyBCbG9vZCBDdWx0dXJlIFx1MjAxNCBCYWN0ZXJpYSBpZGVudGlmaWVkIGluIEJsb29kXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTQwMDRCIENNViBJZ0cgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDc4NDktMyB3aGljaCBpcyBhY3R1YWxseVxuICAvLyAnVGFlbmlhIHNvbGl1bSBsYXJ2YSBJZ00gQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bScgKHBvcmsgdGFwZXdvcm0sXG4gIC8vIHZlcmlmaWVkIGxvaW5jLm9yZy83ODQ5LTMvKS4gV3Jvbmcgb3JnYW5pc20gZW50aXJlbHkuIExlYXZpbmdcbiAgLy8gdW5tYXBwZWQ7IGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuXG4gIC8vIDE0MDQ4QiBDTVYgSWdNIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyA3ODUwLTEgd2hpY2ggaXMgYWN0dWFsbHlcbiAgLy8gJ1RhZW5pYSBzb2xpdW0gbGFydmEgQWIgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0nICh2ZXJpZmllZFxuICAvLyBsb2luYy5vcmcvNzg1MC0xLykuIFNhbWUgY29weS1wYXN0ZS13cm9uZy1MT0lOQyBwYXR0ZXJuIGFzIDE0MDA0Qi5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZC4gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxNDA2NkNcIjogXCI4MDM4My0zXCIsIC8vIEluZmx1ZW56YSBBIFx1MjAxNCBBZyBSZXNwaXJhdG9yeVxuICBcIjE0MDg0Q1wiOiBcIjk0NTU4LTRcIiwgLy8gU0FSUy1Db1YtMiBBZyBcdTIwMTQgUmVzcGlyYXRvcnlcbiAgXCIxMjE4NENcIjogXCI4ODE1Ny0zXCIsIC8vIENNViBETkEgcXVhbnQgUENSIFx1MjAxNCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIE15Y29iYWN0ZXJpdW0gLyBhY2lkLWZhc3QgKGFkZGVkIGFmdGVyIGF1ZGl0KSBcdTI1MDBcbiAgXCIxMzAyNUNcIjogXCIyOTI2MC03XCIsIC8vIFx1NjI5N1x1OTE3OFx1NjAyN1x1NkZDM1x1N0UyRVx1NjJCOVx1NzI0N1x1NjdEM1x1ODI3Mlx1NkFBMlx1NjdFNSBcdTIwMTQgTXljb2JhY3Rlcml1bSBBRkIgc3RhaW5cbiAgXCIxMzAyNkNcIjogXCIyOTU1My01XCIsIC8vIFx1NjI5N1x1OTE3OFx1ODNDQ1x1NTdGOVx1OTkwQSBcdTIwMTQgTXljb2JhY3Rlcml1bSBjdWx0dXJlIGxpcXVpZCtzb2xpZFxuICAvLyBcdTI1MDBcdTI1MDAgQUJHIHBhbmVsICgwOTA0MUIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBJbnRlbnRpb25hbGx5IE5PVCBtYXBwZWQgaGVyZSBcdTIwMTQgMDkwNDFCIGlzIGEgcGFuZWwgb3JkZXIgdGhhdFxuICAvLyB1bmZvbGRzIGludG8gbWFueSBpdGVtcyAocEggLyBwQ08yIC8gcE8yIC8gSENPMyAvIFRDTzIgLyBTQkUgL1xuICAvLyBBQkUgLyBTQkMgLyBTQVQpLiBNYXBwaW5nIHRoZSBwYW5lbCBjb2RlIHRvIFwicEhcIiB3b3VsZCBtaXMtbGFiZWxcbiAgLy8gZXZlcnkgbm9uLXBIIHJvdyB0aGF0IHNoYXJlcyB0aGlzIE5ISSBjb2RlLiBFYWNoIGl0ZW0gaXNcbiAgLy8gcmVzb2x2ZWQgdmlhIF9MT0lOQ19NQVAgZGlzcGxheS1rZXl3b3JkIGZhbGxiYWNrIGJlbG93OyAwOTA0MUJcbiAgLy8gYWxzbyBhcHBlYXJzIGluIF9ESVNQTEFZX0ZJUlNUX0NPREVTIHNvIGRpc3BsYXkgYWx3YXlzIHdpbnMuXG4gIC8vIFx1MjUwMFx1MjUwMCBCb2R5IGZsdWlkIC8gc3lub3ZpYWwgZmx1aWQgcGFuZWwgKDE2MDA4QyB1bmZvbGRzOyB0aGVcbiAgLy8gbWVtYmVyIGl0ZW1zIHJlbHkgb24gZGlzcGxheSBrZXl3b3JkcyBmb3Igc3BlY2ltZW4tYXdhcmVcbiAgLy8gTE9JTkNzKS4gUGFyZW50IGNvZGUgbWFwcyB0byBzeW5vdmlhbCBmbHVpZCBhbmFseXNpcyBwYW5lbC4gXHUyNTAwXHUyNTAwXG4gIC8vIDE2MDA4QyBcdTZFRDFcdTZEQjJcdTZBQTJcdTY3RTUgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDMzOTAzLTYgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0tldG9uZXMgW1ByZXNlbmNlXSBpbiBVcmluZScgKHZlcmlmaWVkIGxvaW5jLm9yZykuXG4gIC8vIExlYXZpbmcgdW5tYXBwZWQ7IHRoZSBwYW5lbCBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2Rpbmcgb25seVxuICAvLyBhbmQgdGhlIHBlci1pdGVtIGRpc3BsYXlzIGluIF9MT0lOQ19NQVAgY2FycnkgdGhlaXIgb3duIExPSU5Dc1xuICAvLyB3aGVyZSBrbm93bi5cbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfRElTUExBWV9GSVJTVF9DT0RFUyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBjb2RlcyB0aGF0IGFyZSAqcGFuZWxzKiBcdTIwMTQgb25lIGJpbGxpbmcgY29kZSwgbWFueSBpdGVtLXNwZWNpZmljXG4vLyBkaXNwbGF5cy4gRm9yIHRoZXNlLCBkaXNwbGF5IGtleXdvcmQgTVVTVCBiZSB0cmllZCBmaXJzdCAoc28gXCJXQkNcIlxuLy8gdW5kZXIgQ0JDIHBhbmVsIDA4MDExQyBnZXRzIDY2OTAtMiwgbm90IHRoZSBnZW5lcmljIHBhbmVsIExPSU5DKS5cbi8vIEZvciBldmVyeXRoaW5nIGVsc2UgKHNpbmdsZS10ZXN0IGNvZGVzIGxpa2UgMDkwMDVDIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENixcbi8vIDA5MDQ0QyBMREwsIDE0MDMwQyBIQnNBZyksIHRoZSBOSEkgY29kZSBpcyBtb3JlIHNwZWNpZmljIHRoYW4gYW55XG4vLyBkaXNwbGF5IGtleXdvcmQgYW5kIHdpbnMgb3V0cmlnaHQuXG4vL1xuLy8gREVTSUdOIFBISUxPU09QSFk6IHRoZSBicmlkZ2UgaXMgYSAqZmFpdGhmdWwgdHJhbnNwb3J0KiBsYXllciBcdTIwMTQgaXRcbi8vIHRydXN0cyB0aGUgXHU1MDY1XHU0RkREIGJpbGxpbmcgY29kZSBhcyBhdXRob3JpdGF0aXZlIGZvciBjbGluaWNhbCBpbnRlbnRcbi8vIChcdTk2NjJcdTYyNDAgYmlsbGVkIDA5MDA1QyA9IHRoZXkgb3JkZXJlZCBmYXN0aW5nIGdsdWNvc2UsIHJlZ2FyZGxlc3Mgb2Zcbi8vIHdoZXRoZXIgdGhlIG9wZXJhdGlvbmFsIHNwZWNpbWVuIHdhcyBhIGZpbmdlci1zdGljaykuIERpc3BsYXktc3RyaW5nXG4vLyByZS1pbnRlcnByZXRhdGlvbiBvZiBjbGluaWNhbCBjb250ZXh0IChHbHUtQUMgdnMgRklOR0VSIFNVR0FSIHZzXG4vLyByYW5kb20pIGlzIGxlZnQgdG8gdGhlIFNNQVJUIGFwcCwgd2hpY2ggaGFzIG1vcmUgVUkgY29udGV4dC5cbmV4cG9ydCBjb25zdCBESVNQTEFZX0ZJUlNUX0NPREVTOiBSZWFkb25seVNldDxzdHJpbmc+ID0gbmV3IFNldChbXG4gIFwiMDgwMTFDXCIsIC8vIENCQyBwYW5lbFxuICBcIjA4MDEzQ1wiLCAvLyBDQkMgdy8gYXV0byBkaWZmIHBhbmVsXG4gIFwiMDYwMTNDXCIsIC8vIFVyaW5hbHlzaXMgbWFjcm9zY29waWMgcGFuZWxcbiAgXCIwOTA0MUJcIiwgLy8gQUJHIHBhbmVsXG4gIFwiMTYwMDhDXCIsIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBwYW5lbFxuXSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBfUEFORUxfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gUGFuZWwtc3BlY2lmaWMgZGlzcGxheSBcdTIxOTIgTE9JTkMgb3ZlcnJpZGVzLiBUaGVzZSBydW4gQkVGT1JFIHRoZSBnbG9iYWxcbi8vIF9MT0lOQ19NQVAgc28gdGhhdCB1cmluZSBiaWxpcnViaW4gdW5kZXIgMDYwMTNDIG1hcHMgdG8gNTc3MC0zICh1cmluZVxuLy8gc3BlY2ltZW4pIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIGdsb2JhbCAnYmlsaXJ1YmluJyB0aGF0XG4vLyB3b3VsZCBpbXBseSBzZXJ1bSwgYW5kIGFuYWxvZ291cyBzcGVjaW1lbi1hd2FyZSBkaXNhbWJpZ3VhdGlvbiBmb3Jcbi8vIG90aGVyIHBhbmVsIHN1Yi1pdGVtcy4gS2V5cyBhcmUgTkhJIHBhbmVsIGNvZGVzIChtdXN0IGFsc28gYmUgaW5cbi8vIF9ESVNQTEFZX0ZJUlNUX0NPREVTKTsgdmFsdWVzIGFyZSBkaXNwbGF5LWtleXdvcmQgXHUyMTkyIExPSU5DIGRpY3RzIHRoYXRcbi8vIGZvbGxvdyB0aGUgc2FtZSBtYXRjaGluZyBzZW1hbnRpY3MgYXMgX0xPSU5DX01BUCAobGVhZGluZyB3b3JkXG4vLyBib3VuZGFyeSBmb3IgQVNDSUksIHN1YnN0cmluZyBmb3IgQ0pLKS5cbmV4cG9ydCBjb25zdCBQQU5FTF9MT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gQWxsIHJvdXRpbmUgZGlwc3RpY2sgaXRlbXMgcmVzaWRlIG9uIGEgc2luZ2xlIE5ISSBiaWxsaW5nIGNvZGUuXG4gIC8vIFdpdGhvdXQgdGhpcyB0YWJsZSB0aGV5J2QgYWxsIGNvbGxhcHNlIHRvIHRoZSBwYW5lbCBMT0lOQyAyNDM1Ni04LFxuICAvLyBsb3NpbmcgcGVyLWl0ZW0gZ3JhbnVsYXJpdHkgdGhhdCdzIGNsaW5pY2FsbHkgdXNlZnVsIChlLmcuXG4gIC8vIGJpbGlydWJpbiB2cyB1cm9iaWxpbm9nZW4gZm9yIGxpdmVyIHdvcmt1cCkuXG4gIFwiMDYwMTNDXCI6IHtcbiAgICAvLyBPcmRlciBtYXR0ZXJzOiBsb25nZXIvbW9yZS1zcGVjaWZpYyBrZXlzIGJlZm9yZSBnZW5lcmljIG9uZXNcbiAgICAvLyAobWF0Y2hlcyBfTE9JTkNfTUFQIGl0ZXJhdGlvbiBzZW1hbnRpY3MgXHUyMDE0IGZpcnN0IGhpdCB3aW5zKS5cbiAgICBcInNwZWNpZmljIGdyYXZpdHlcIjogXCI1ODExLTVcIiwgLy8gU3BlY2lmaWMgZ3Jhdml0eSBVcmluZVxuICAgIFwic3AuZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFwic3AgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFx1NkJENFx1OTFDRDogXCI1ODExLTVcIixcbiAgICBcIm1pY3JvLWFsYnVtaW5cIjogXCIxNDk1Ny01XCIsIC8vIE1pY3JvYWxidW1pbiBNYXNzL3ZvbCBVcmluZVxuICAgIG1pY3JvYWxidW1pbjogXCIxNDk1Ny01XCIsXG4gICAgXCJtYWxiKHUpXCI6IFwiMTQ5NTctNVwiLFxuICAgIG1hbGI6IFwiMTQ5NTctNVwiLFxuICAgIFx1NUZBRVx1NUMwRlx1NzY3RFx1ODZDQlx1NzY3RDogXCIxNDk1Ny01XCIsXG4gICAgdWFjcjogXCIxNDk1OS0xXCIsIC8vIE1pY3JvYWxidW1pbi9DcmVhdGluaW5lIHJhdGlvIFVyaW5lXG4gICAgXCJ1cmluZSBnbHVjb3NlXCI6IFwiNTc5Mi03XCIsXG4gICAgc3VnYXI6IFwiNTc5Mi03XCIsIC8vIE5ISSAnXHU1QzNGXHU3Q0Q2JyAvICdTdWdhcicgdW5kZXIgMDYwMTNDXG4gICAgXHU1QzNGXHU3Q0Q2OiBcIjU3OTItN1wiLFxuICAgIHVyb2JpbGlub2dlbjogXCI1ODE4LTBcIiwgLy8gVXJvYmlsaW5vZ2VuIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDIwXHU1MzlGOiBcIjU4MTgtMFwiLFxuICAgIGJpbGlydWJpbjogXCI1NzcwLTNcIiwgLy8gQmlsaXJ1YmluIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDA1XHU3RDIwOiBcIjU3NzAtM1wiLFxuICAgIG5pdHJpdGU6IFwiNTgwMi00XCIsIC8vIE5pdHJpdGUgVXJpbmVcbiAgICBcdTRFOUVcdTc4NURcdTkxNzg6IFwiNTgwMi00XCIsXG4gICAga2V0b25lczogXCI1Nzk3LTZcIiwgLy8gS2V0b25lcyBVcmluZVxuICAgIGtldG9uZTogXCI1Nzk3LTZcIixcbiAgICBcdTkxNkVcdTlBRDQ6IFwiNTc5Ny02XCIsXG4gICAgcHJvdGVpbjogXCIyMDQ1NC01XCIsIC8vIFByb3RlaW4gTWFzcy92b2wgVXJpbmVcbiAgICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAgIFx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgbGV1a29jeXRlOiBcIjU3OTktMlwiLCAvLyBMZXVrb2N5dGVzIFVyaW5lXG4gICAgbGV1OiBcIjU3OTktMlwiLFxuICAgIFx1NzY3RFx1ODg0MFx1NzQwM1x1OTE2Rlx1OTE3NjogXCI1Nzk5LTJcIixcbiAgICBibG9vZDogXCI1Nzk0LTNcIiwgLy8gSGVtb2dsb2JpbiBVcmluZSBRbFxuICAgIFx1NkY1Qlx1ODg0MDogXCI1Nzk0LTNcIixcbiAgICBcdTgyNzI6IFwiNTc3OC02XCIsIC8vIENvbG9yIG9mIFVyaW5lIChDSksgc3Vic3RyaW5nKVxuICAgIGNvbG9yOiBcIjU3NzgtNlwiLFxuICAgIHR1cmJpZGl0eTogXCI1NzY3LTlcIiwgLy8gQXBwZWFyYW5jZSBvZiBVcmluZVxuICAgIGFwcGVhcmFuY2U6IFwiNTc2Ny05XCIsXG4gICAgXHU1OTE2XHU4OUMwOiBcIjU3NjctOVwiLFxuICAgIHBoOiBcIjU4MDMtMlwiLCAvLyBwSCBvZiBVcmluZSAodXJpbmUtc3BlY2lmaWMsIE5PVFxuICAgIC8vIHRoZSBhcnRlcmlhbCAxMTU1OC00IHRoYXQgdGhlXG4gICAgLy8gZ2xvYmFsIG1hcCBwb2ludHMgdG8pXG4gICAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIjU4MDMtMlwiLFxuICAgIGdsdWNvc2U6IFwiNTc5Mi03XCIsIC8vIExhc3QgaW4gdGhpcyBibG9jayBzbyAndXJpbmVcbiAgfSxcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ29tbW9uIFRhaXdhbmVzZSBISVMgbGFiIG5hbWVzIFx1MjE5MiBMT0lOQyBjb2RlIG1hcHBpbmdcbmV4cG9ydCBjb25zdCBMT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBEaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgb25seSBraWNrcyBpbiB3aGVuIE5PIE5ISSBjb2RlIGlzXG4gIC8vIHByZXNlbnQgKGRhc2hib2FyZCByb3dzLCBMTE0tZXh0cmFjdGVkIHRleHQpLiBXaGVuIHRoZSBOSEkgY29kZVxuICAvLyBJUyBwcmVzZW50LCAwOTAwNUMgXHUyMTkyIDE1NTgtNiAoRmFzdGluZykgYW5kIDA5MTQwQyBcdTIxOTIgMjM0NS03XG4gIC8vIChnZW5lcmljKSB3aW5zIGRpcmVjdGx5IHZpYSBfTkhJX1RPX0xPSU5DLlxuICAvL1xuICAvLyBGYWl0aGZ1bC10cmFuc3BvcnQgcHJpbmNpcGxlOiB0aGUgYnJpZGdlIGRvZXMgTk9UIHJlLWludGVycHJldFxuICAvLyBkaXNwbGF5IHN0cmluZ3MgbGlrZSBcIkZJTkdFUiBTVUdBUlwiIGFzIGEgZGlmZmVyZW50IExPSU5DIFx1MjAxNCBpdFxuICAvLyBwcmVzZXJ2ZXMgdGhlIHJhdyBkaXNwbGF5IGluIGBjb2RlLnRleHRgIGFuZCB0aGUgb3JpZ2luYWwgTkhJXG4gIC8vIGNvZGUgaW4gYGNvZGUuY29kaW5nYC4gVGhlIFNNQVJUIGFwcCBkb2VzIHNwZWNpbWVuL21ldGhvZC1hd2FyZVxuICAvLyBncm91cGluZyBvbiB0aGUgY29uc3VtZXIgc2lkZSAoc2VlIFNNQVJUIGFwcCBoYW5kb2ZmIGRvYykuXG4gIFwiZmFzdGluZyBnbHVjb3NlXCI6IFwiMTU1OC02XCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCIxNTU4LTZcIixcbiAgXCJnbHUtYWNcIjogXCIxNTU4LTZcIixcbiAgXCJnbHVjb3NlIGFjXCI6IFwiMTU1OC02XCIsXG4gIGdsdWNvc2U6IFwiMjM0NS03XCIsXG4gIFx1ODg0MFx1N0NENjogXCIyMzQ1LTdcIixcbiAgZ2x1OiBcIjIzNDUtN1wiLFxuICAvLyBIYkExYyBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyBcImhiXCIgZW50cmllcyBzbyB0aGUgbG9uZ2VzdC1wcmVmaXhcbiAgLy8gbWF0Y2ggd2lucyBmb3IgdGhlIFwiSGJBMWNcIiBkaXNwbGF5IHN0cmluZy4gT3RoZXIgQTFjIHN5bm9ueW1zXHUyMDI2XG4gIGhiYTFjOiBcIjQ1NDgtNFwiLFxuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNDU0OC00XCIsXG4gIGExYzogXCI0NTQ4LTRcIixcbiAgaGVtb2dsb2JpbjogXCI3MTgtN1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNzE4LTdcIixcbiAgaGdiOiBcIjcxOC03XCIsXG4gIGhiOiBcIjcxOC03XCIsXG4gIC8vIENCQyBkaWZmIFx1MjAxNCBlb3Npbm9waGlsIGNvdW50IG11c3QgcHJlY2VkZSB0aGUgYmFyZSAnd2JjJy8nXHU3NjdEXHU4ODQwXHU3NDAzJ1xuICAvLyBrZXlzICh3aGljaCB3b3VsZCBvdGhlcndpc2Ugd2luIGFzIHN1YnN0cmluZ3MpLlxuICAvLyA3MTEtMiB2ZXJpZmllZCBhdCBsb2luYy5vcmc6ICdFb3Npbm9waGlscyBbIy92b2x1bWVdIGluIEJsb29kXG4gIC8vIGJ5IEF1dG9tYXRlZCBjb3VudCcuXG4gIFx1NTVEQ1x1OTE3OFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNzExLTJcIixcbiAgZW9zaW5vcGhpbDogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsczogXCI3MTEtMlwiLFxuICB3YmM6IFwiNjY5MC0yXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCI2NjkwLTJcIixcbiAgcGxhdGVsZXQ6IFwiNzc3LTNcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIjc3Ny0zXCIsXG4gIHBsdDogXCI3NzctM1wiLFxuICAvLyBSQkMgKyBSQkMgaW5kaWNlcyBcdTIwMTQgdmVyaWZpZWQgTE9JTkNzIChsb2luYy5vcmcpOlxuICAvLyA3ODktOCAgRXJ5dGhyb2N5dGVzICMvdm9sIEJsb29kIEF1dG8gICAgICAgICAgICAgIFx1MjE5MiBSQkNcbiAgLy8gNzg1LTYgIEVyeXRocm9jeXRlIG1lYW4gY29ycHVzY3VsYXIgaGVtb2dsb2JpbiAgICBcdTIxOTIgTUNIXG4gIC8vIExvbmcgQ0pLIGZvcm1zIGZpcnN0IChMREwvY2hvbGVzdGVyb2wgcGF0dGVybikgc28gJ1x1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1xuICAvLyBcdTg4NDBcdTgyNzJcdTdEMjAnIHdpbnMgb3ZlciBcdTdEMDVcdTg4NDBcdTc0MDMuXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMDogXCI3ODUtNlwiLFxuICByYmM6IFwiNzg5LThcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIjc4OS04XCIsXG4gIG1jaDogXCI3ODUtNlwiLFxuICAvLyBVcmluZSBjcmVhdGluaW5lIFx1MjAxNCBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyAnY3JlYXRpbmluZScgc29cbiAgLy8gcm93cyBsaWtlICdVLUNSRSBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTAnIG9yICdDcmVhdGluaW5lKFUpJyByZXNvbHZlIHRvIHRoZVxuICAvLyB1cmluZSBMT0lOQyAoMjE2MS04KSBpbnN0ZWFkIG9mIGJlaW5nIHNoYWRvd2VkIGJ5IHRoZSBzZXJ1bVxuICAvLyBkZWZhdWx0ICgyMTYwLTApLiBTYW1lIGxvbmdlc3Qtc3BlY2lmaWMtZmlyc3Qgb3JkZXJpbmcgYXNcbiAgLy8gdGhlIGZhc3RpbmctdnMtcmFuZG9tIGdsdWNvc2UgYmxvY2suXG4gIFwidXJpbmUgY3JlYXRpbmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUgdXJpbmVcIjogXCIyMTYxLThcIixcbiAgXCJjcmVhdGluaW5lKHUpXCI6IFwiMjE2MS04XCIsXG4gIFwidS1jcmVcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZWFcIjogXCIyMTYxLThcIixcbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIjIxNjEtOFwiLFxuICBjcmVhdGluaW5lOiBcIjIxNjAtMFwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE1MFx1OTE3ODogXCIyMTYwLTBcIiwgLy8gVGFpd2FuIHZhcmlhbnQgc3BlbGxpbmdcbiAgY3JlYTogXCIyMTYwLTBcIixcbiAgYnVuOiBcIjMwOTQtMFwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiMzA5NC0wXCIsXG4gIGFzdDogXCIxOTIwLThcIixcbiAgYWx0OiBcIjE3NDItNlwiLFxuICBmZXJyaXRpbjogXCIyMjc2LTRcIixcbiAgXHU4ODQwXHU2RTA1XHU5NDM1XHU4NkNCXHU3NjdEOiBcIjIyNzYtNFwiLFxuICBmZXJyOiBcIjIyNzYtNFwiLFxuICAvLyBWaXRhbC1zaWducyBmcm9tIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NSAoSUhLRTM0MDIpIFx1MjAxNCBzZXBhcmF0ZSBjb2RlIG5hbWVzcGFjZVxuICAvLyBidXQgdGhlIGxvb2t1cCBpcyBieSBkaXNwbGF5LW5hbWUgc3Vic3RyaW5nLCBzYW1lIGFzIGZvciBsYWJzLlxuICBcImJvZHkgaGVpZ2h0XCI6IFwiODMwMi0yXCIsXG4gIFwiYm9keSB3ZWlnaHRcIjogXCIyOTQ2My03XCIsXG4gIGJtaTogXCIzOTE1Ni01XCIsXG4gIC8vIFdhaXN0IGNpcmN1bWZlcmVuY2UgXHUyMDE0IG1lYXN1cmVtZW50IExPSU5DICg4MjgwLTApLiA1NjA4Ni0yIGlzXG4gIC8vIHRoZSAnQWR1bHQgV2Fpc3QgQ2lyY3VtZmVyZW5jZSBQcm90b2NvbCcgY29kZSwgd2hpY2ggaXMgYVxuICAvLyBzdXJ2ZXkvcHJvdG9jb2wgZGVzY3JpcHRvciwgTk9UIGEgbnVtZXJpYyBtZWFzdXJlbWVudFxuICAvLyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gTkhJIFx1NTA2NVx1NEZERCByZXBvcnRzIGEgc2luZ2xlIHdhaXN0bGluZVxuICAvLyBudW1iZXIgcGVyIHZpc2l0LCBzbyB0aGUgbWVhc3VyZW1lbnQgY29kZSBpcyBjb3JyZWN0LlxuICBcIndhaXN0IGNpcmN1bWZlcmVuY2VcIjogXCI4MjgwLTBcIixcbiAgXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0ODAtNlwiLFxuICBcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0NjItNFwiLFxuICAvLyBMaXBpZCBwYW5lbCBcdTIwMTQgT1JERVIgTUFUVEVSUy4gTERML0hETCB2YXJpYW50cyBNVVNUIHByZWNlZGUgdGhlXG4gIC8vIGdlbmVyaWMgJ2Nob2xlc3Rlcm9sJyBrZXkgc28gYSByb3cgbGFiZWxsZWQgJ0xETCBDSE9MRVNURVJPTCdcbiAgLy8gcmVzb2x2ZXMgdG8gMTM0NTctNyAoTERMIGNhbGN1bGF0ZWQpIGFuZCAnSERMIENIT0xFU1RFUk9MJyB0b1xuICAvLyAyMDg1LTksIGluc3RlYWQgb2YgZmFsbGluZyB0byAyMDkzLTMgKHRvdGFsIGNob2xlc3Rlcm9sKSB2aWEgdGhlXG4gIC8vICdjaG9sZXN0ZXJvbCcgc3Vic3RyaW5nLiBTYW1lIGNhbm9uaWNhbCBvcmRlcmluZyBhcyBfTEFCX1NZTk9OWU1TLlxuICBcImxkbCBjaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXCJsZGwtY2hvbGVzdGVyb2xcIjogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIC8vIDEzNDU3LTcgPSBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIFx1MjAxNCBtYXRjaGVzIHRoZSBOSEkgMDkwNDRDXG4gIC8vIGJpbGxpbmcgY29kZSdzIGludGVudCAoVGFpd2FuIGxhYnMgcHJlZG9taW5hbnRseSByZXBvcnQgY2FsY3VsYXRlZFxuICAvLyBMREwgdmlhIEZyaWVkZXdhbGQpLiBLZWVwIGNvbnNpc3RlbnQgd2l0aCBfTkhJX1RPX0xPSU5DW1wiMDkwNDRDXCJdLlxuICBcImxkbC1jXCI6IFwiMTM0NTctN1wiLFxuICBsZGw6IFwiMTM0NTctN1wiLFxuICBcImhkbCBjaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcImhkbC1jaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXCJoZGwtY1wiOiBcIjIwODUtOVwiLFxuICBoZGw6IFwiMjA4NS05XCIsXG4gIC8vIFRvdGFsIGNob2xlc3Rlcm9sIFx1MjAxNCBiYXJlICdjaG9sZXN0ZXJvbCcgb25seSBmaXJlcyBBRlRFUiB0aGVcbiAgLy8gTERML0hETC1wcmVmaXhlZCB2YXJpYW50cyBhYm92ZSBoYXZlIGJlZW4gY2hlY2tlZC5cbiAgXCJ0b3RhbCBjaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcInQtY2hvbGVzdGVyb2xcIjogXCIyMDkzLTNcIixcbiAgXHU4ODQwXHU2RTA1XHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwOTMtM1wiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIGNob2xlc3Rlcm9sOiBcIjIwOTMtM1wiLFxuICB0cmlnbHljZXJpZGU6IFwiMjU3MS04XCIsXG4gIFx1NEUwOVx1OTE3OFx1NzUxOFx1NkNCOVx1OTE2RjogXCIyNTcxLThcIixcbiAgXCJ1cmljIGFjaWRcIjogXCIzMDg0LTFcIixcbiAgZWdmcjogXCIzMzkxNC0zXCIsXG4gIGhic2FnOiBcIjUxOTYtMVwiLFxuICBcImFudGktaGN2XCI6IFwiMTYxMjgtMVwiLFxuICAvLyBVcmluZSBwcm90ZWluIChkaXNwbGF5IGZhbGxiYWNrIGZvciB0aGUgbm8tTkhJLWNvZGUgcGF0aCB0aGF0XG4gIC8vIGNvbWVzIGZyb20gSUhLRTM0MDIgdml0YWxzICsgYWR1bHQtcHJldmVudGl2ZSBzdXBwbGVtZW50cykuXG4gIFwidXJpbmUgcHJvdGVpblwiOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICBcInUtcHJvXCI6IFwiMjA0NTQtNVwiLFxuICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAvLyBBQkcgcGFuZWwgY29tcG9uZW50cyBcdTIwMTQgMDkwNDFCIHBhcmVudCBjb2RlIGluIE5ISV9UT19MT0lOQzsgZWFjaFxuICAvLyBtZW1iZXIncyBkaXNwbGF5IChcInBDTzJcIiwgXCJwTzJcIiwgXCJIQ08zXCIsIFwiVENPMlwiLCBcIlNCRS9BQkVcIixcbiAgLy8gXCJTQkNcIiwgXCJTQVRcIiAvIFwiU2FPMlwiKSBmYWxscyB0byBpdHMgb3duIExPSU5DLlxuICAvLyBwSCBNVVNUIGNvbWUgYmVmb3JlIHBjbzIvcG8yIHNvIHRoZSBiYXJlIFwicEhcIiBkaXNwbGF5IGxhbmRzIGhlcmUuXG4gIHBoOiBcIjExNTU4LTRcIiwgLy8gcEggb2YgQXJ0ZXJpYWwgYmxvb2RcbiAgcGNvMjogXCIyMDE5LThcIiwgLy8gQ2FyYm9uIGRpb3hpZGUgcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgcG8yOiBcIjI3MDMtN1wiLCAvLyBPeHlnZW4gcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgaGNvMzogXCIxOTU5LTZcIiwgLy8gQmljYXJib25hdGUgTW9sZXMvdm9sIEFydGVyaWFsXG4gIGJpY2FyYm9uYXRlOiBcIjE5NTktNlwiLFxuICB0Y28yOiBcIjIwMjgtOVwiLCAvLyBUb3RhbCBDTzIgTW9sZXMvdm9sIEFydGVyaWFsXG4gIHNiZTogXCIxMTU1NS0wXCIsIC8vIFN0YW5kYXJkIGJhc2UgZXhjZXNzIEFydGVyaWFsXG4gIGFiZTogXCIxMTU1NS0wXCIsXG4gIHNiYzogXCIxOTI1LTdcIiwgLy8gU3RhbmRhcmQgYmljYXJib25hdGUgQXJ0ZXJpYWxcbiAgc2F0dXJhdDogXCIyNzEzLTZcIiwgLy8gTzIgc2F0dXJhdGlvbiBBcnRlcmlhbFxuICBzYW8yOiBcIjI3MTMtNlwiLFxuICBzYXQ6IFwiMjcxMy02XCIsIC8vIE5ISSBkaXNwbGF5IHNob3dzIGp1c3QgXCJTQVRcIlxuICAvLyBTeW5vdmlhbCAvIGJvZHktZmx1aWQgY29tcG9uZW50cyAoMTYwMDhDIHBhcmVudCBhYm92ZSkuXG4gIFwic2YuY29sb3JcIjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgQm9keSBmbHVpZCAocmV1c2UgVXJpbmUgY29sb3Igc3BlYyBPSylcbiAgLy8gTk9URTogODI1NS0yIC8gMTM5NDgtNSBwcmV2aW91c2x5IGxpc3RlZCBoZXJlIGJvdGggdHVybmVkIG91dFxuICAvLyB0byBiZSB1bnJlbGF0ZWQgTE9JTkNzICh2ZXJpZmllZCBsb2luYy5vcmcgXHUyMDE0IDgyNTUtMiBpc1xuICAvLyAnU2VydmljZSBjb21tZW50IDEzJywgMTM5NDgtNSBpcyAnQ29jY2lkaW9pZGVzIGltbWl0aXMgSWdNXG4gIC8vIEFiJykuIEJvZHktZmx1aWQgQXBwZWFyYW5jZSAvIFJCQyBkb24ndCBoYXZlIHdlbGwtYXR0ZXN0ZWRcbiAgLy8gTE9JTkNzIGluIG91ciB0YWJsZSB5ZXQgXHUyMDE0IGZhbGxpbmcgdGhyb3VnaCB0byBjb2RlLnRleHQtb25seVxuICAvLyBpcyBzYWZlciB0aGFuIGVtaXR0aW5nIGEgbWlzbGVhZGluZyBMT0lOQy4gVG8gYWRkIGxhdGVyLFxuICAvLyB2ZXJpZnkgZWFjaCBhZ2FpbnN0IGxvaW5jLm9yZyBmaXJzdC5cbiAgXCJzZi53YmNcIjogXCIyNjQ2Ni0zXCIsIC8vIFdCQyAjL3ZvbCBCb2R5IGZsdWlkXG4gIFwic2YubmV1dHJvcGhpbFwiOiBcIjEwMzI4LTZcIiwgLy8gTmV1dHJvcGhpbHMvMTAwIGxldWtvY3l0ZXMgaW4gQm9keSBmbHVpZFxuICBcInNmLmx5bXBob1wiOiBcIjEzMDQ2LThcIiwgLy8gTHltcGhvY3l0ZXMgIy92b2wgQm9keSBmbHVpZFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19ESVNQTEFZIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ2Fub25pY2FsIEVuZ2xpc2ggZGlzcGxheSBuYW1lcyBmb3IgTE9JTkMgY29kZXMgdGhlIGJyaWRnZSBlbWl0cy5cbi8vIEZhbGxzIGJhY2sgdG8gdGhlIHJhdyBpbnB1dCBkaXNwbGF5IHdoZW4gYSBMT0lOQyBpc24ndCBsaXN0ZWQgaGVyZS5cbi8vIFNvdXJjZWQgZnJvbSBsb2luYy5vcmcgY2Fub25pY2FsIHNob3J0IG5hbWVzIHdoZXJlIGFwcGxpY2FibGUuXG4vLyBBZGQgbmV3IGVudHJpZXMgYXMgd2Ugd2lkZW4gTE9JTkMgY292ZXJhZ2UgXHUyMDE0IHRoZSBsb29rdXAgaXMga2V5ZWQgb25cbi8vIExPSU5DIHN0cmluZywgc28gdW5tYXBwZWQgTE9JTkNzIGRlZ3JhZGUgZ3JhY2VmdWxseSB0byB0aGUgTkhJIHRleHQuXG5leHBvcnQgY29uc3QgTE9JTkNfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQyBwYW5lbCBzdWItaXRlbXMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBNb3N0IGNyaXRpY2FsIGJsb2NrIFx1MjAxNCBOSEkncyBcIkNvbG9yIFx1NUMzRiBcdTk4NEYgIC4uLlwiIHN0eWxlIGxhYmVscyBhcmVcbiAgLy8gd2hhdCB0cmlnZ2VycyBkb3duc3RyZWFtIENoaW5lc2Utc3Vic3RyaW5nIGxhYmVsbGluZyBidWdzLlxuICBcIjU4MDMtMlwiOiBcInBIIG9mIFVyaW5lXCIsXG4gIFwiNTgxMS01XCI6IFwiU3BlY2lmaWMgZ3Jhdml0eSBvZiBVcmluZVwiLFxuICBcIjU3NzAtM1wiOiBcIkJpbGlydWJpbiBVcmluZSBRbFwiLFxuICBcIjU4MDItNFwiOiBcIk5pdHJpdGUgVXJpbmUgUWxcIixcbiAgXCI1Nzc4LTZcIjogXCJDb2xvciBvZiBVcmluZVwiLFxuICBcIjU3NjctOVwiOiBcIkFwcGVhcmFuY2Ugb2YgVXJpbmVcIixcbiAgXCI1ODE4LTBcIjogXCJVcm9iaWxpbm9nZW4gVXJpbmUgUWxcIixcbiAgXCIyMDQ1NC01XCI6IFwiUHJvdGVpbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU3LTVcIjogXCJNaWNyb2FsYnVtaW4gTWFzcy9Wb2wgaW4gVXJpbmVcIixcbiAgXCIxNDk1OS0xXCI6IFwiTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgUmF0aW8gaW4gVXJpbmVcIixcbiAgXCI1NzkyLTdcIjogXCJHbHVjb3NlIFVyaW5lIFFsXCIsXG4gIFwiNTc5Ny02XCI6IFwiS2V0b25lcyBVcmluZSBRbFwiLFxuICBcIjU3OTQtM1wiOiBcIkhlbW9nbG9iaW4gVXJpbmUgUWxcIixcbiAgXCI1Nzk5LTJcIjogXCJMZXVrb2N5dGVzIFVyaW5lIFFsXCIsXG4gIFwiMjQzNTYtOFwiOiBcIlVyaW5hbHlzaXMgTWFjcm8gUGFuZWxcIixcbiAgLy8gQUxMIGVudHJpZXMgYmVsb3cgdXNlIHRoZSBMT0lOQyBjYW5vbmljYWwgJ0xvbmcgQ29tbW9uIE5hbWUnXG4gIC8vIGFzIGFjY2VwdGVkIGJ5IHRoZSBUV05ISUZISVIgdmFsaWRhdG9yLiBTb3VyY2U6IGxvaW5jLm9yZyBmb3JcbiAgLy8gZWFjaCBjb2RlLCBjcm9zcy1jaGVja2VkIGFnYWluc3QgdGhlIHZhbGlkYXRvcidzIHJlcG9ydGVkXG4gIC8vICdWYWxpZCBkaXNwbGF5IGlzIG9uZSBvZiBOIGNob2ljZXMnIGZvciBkaXNwbGF5cyB3ZSBwcmV2aW91c2x5XG4gIC8vIGdvdCB3cm9uZyAoNDUgTE9JTkNzIGZvdW5kIGluIHRoZSBQMzMzMzMzMzMzIHZhbGlkYXRpb24gcnVuKS5cbiAgLy8gV2hlbiB1cGRhdGluZywgY29weSB0aGUgZXhhY3QgZW4tVVMgbG9uZyBuYW1lIGZyb20gbG9pbmMub3JnIFx1MjAxNFxuICAvLyB0aGUgdmFsaWRhdG9yIGlzIHNlbnNpdGl2ZSB0byBzcGVsbGluZyAvIHB1bmN0dWF0aW9uLlxuICAvL1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgKDA5MDQxQiBwYW5lbCkgXHUyMDE0IG5vdCBpbiB2YWxpZGF0b3Igb3V0cHV0OyBsb2luYy5vcmcgc291cmNlZFxuICBcIjExNTU4LTRcIjogXCJwSCBvZiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMTktOFwiOiBcIkNhcmJvbiBkaW94aWRlIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjI3MDMtN1wiOiBcIk94eWdlbiBbUGFydGlhbCBwcmVzc3VyZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIxOTU5LTZcIjogXCJCaWNhcmJvbmF0ZSBbTW9sZXMvdm9sdW1lXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMjgtOVwiOiBcIkNhcmJvbiBkaW94aWRlIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjExNTU1LTBcIjogXCJCYXNlIGV4Y2VzcyBpbiBBcnRlcmlhbCBibG9vZCBieSBjYWxjdWxhdGlvblwiLFxuICBcIjE5MjUtN1wiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kIC0tc3RhbmRhcmRcIixcbiAgXCIyNzEzLTZcIjogXCJPeHlnZW4gc2F0dXJhdGlvbiBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNTU4LTZcIjogXCJGYXN0aW5nIGdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzQ1LTdcIjogXCJHbHVjb3NlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZW1hdG9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjcxOC03XCI6IFwiSGVtb2dsb2JpbiBbTWFzcy92b2x1bWVdIGluIEJsb29kXCIsXG4gIFwiNDU0OC00XCI6IFwiSGVtb2dsb2JpbiBBMWMvSGVtb2dsb2Jpbi50b3RhbCBpbiBCbG9vZFwiLFxuICBcIjY2OTAtMlwiOiBcIkxldWtvY3l0ZXMgWywgIC8vIC92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc3Ny0zXCI6IFwiUGxhdGVsZXRzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3ODktOFwiOiBcIkVyeXRocm9jeXRlcyBbLCAgLy8gL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzg1LTZcIjogXCJNQ0ggW0VudGl0aWMgbWFzc10gYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzExLTJcIjogXCJFb3Npbm9waGlscyBbLCAgLy8gL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNDU0NC0zXCI6IFwiSGVtYXRvY3JpdCBbVm9sdW1lIEZyYWN0aW9uXSBvZiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI1NzAyMS04XCI6IFwiQ0JDIFcgQXV0byBEaWZmZXJlbnRpYWwgcGFuZWwgLSBCbG9vZFwiLFxuICBcIjI0MzE3LTBcIjogXCJIZW1vZ3JhbSBhbmQgcGxhdGVsZXRzIFdPIGRpZmZlcmVudGlhbCBwYW5lbCAtIEJsb29kXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDaGVtaXN0cnkgLyBsaXZlciAvIHJlbmFsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE5MjAtOFwiOiBcIkFzcGFydGF0ZSBhbWlub3RyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzQyLTZcIjogXCJBbGFuaW5lIGFtaW5vdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIxNjAtMFwiOiBcIkNyZWF0aW5pbmUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMTYxLThcIjogXCJDcmVhdGluaW5lIFtNYXNzL3ZvbHVtZV0gaW4gVXJpbmVcIixcbiAgXCIzMzkxNC0zXCI6XG4gICAgXCJHbG9tZXJ1bGFyIGZpbHRyYXRpb24gcmF0ZSBbVm9sdW1lIFJhdGUvQXJlYV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IENyZWF0aW5pbmUtYmFzZWQgZm9ybXVsYSAoTURSRCkvMS43MyBzcSBNXCIsXG4gIFwiMzA5NC0wXCI6IFwiVXJlYSBuaXRyb2dlbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMwODQtMVwiOiBcIlVyYXRlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjk1MS0yXCI6IFwiU29kaXVtIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI4MjMtM1wiOiBcIlBvdGFzc2l1bSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTc1LTJcIjogXCJCaWxpcnViaW4udG90YWwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTY4LTdcIjogXCJCaWxpcnViaW4uZGlyZWN0IFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc1MS03XCI6IFwiQWxidW1pbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI1MzItMFwiOiBcIkxhY3RhdGUgZGVoeWRyb2dlbmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiNjc2OC02XCI6IFwiQWxrYWxpbmUgcGhvc3BoYXRhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIzMjQtMlwiOiBcIkdhbW1hIGdsdXRhbXlsIHRyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzg2MS02XCI6IFwiQ2FsY2l1bSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgTGlwaWQgcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMjA5My0zXCI6IFwiQ2hvbGVzdGVyb2wgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyNTcxLThcIjogXCJUcmlnbHljZXJpZGUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMDg1LTlcIjogXCJDaG9sZXN0ZXJvbCBpbiBIREwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxMzQ1Ny03XCI6IFwiQ2hvbGVzdGVyb2wgaW4gTERMIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IGNhbGN1bGF0aW9uXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIC8gaG9ybW9uZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMzAxNi0zXCI6IFwiVGh5cm90cm9waW4gW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzAyNC03XCI6IFwiVGh5cm94aW5lIChUNCkgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNDkyMC0zXCI6IFwiVGh5cm94aW5lIChUNCkgZnJlZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI5ODYtOFwiOiBcIlRlc3Rvc3Rlcm9uZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjgzMDk4LTRcIjogXCJGb2xsaXRyb3BpbiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgXCI4MzA5Ni04XCI6IFwiRXN0cmFkaW9sIChFMikgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRpYWMgLyBpbmZsYW1tYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTA4MzktOVwiOiBcIlRyb3BvbmluIEkuY2FyZGlhYyBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMzNzYyLTZcIjogXCJOYXRyaXVyZXRpYyBwZXB0aWRlLkIgcHJvaG9ybW9uZSBOLVRlcm1pbmFsIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk4OC01XCI6IFwiQyByZWFjdGl2ZSBwcm90ZWluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzM5NTktOFwiOiBcIlByb2NhbGNpdG9uaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEhlcGF0aXRpcyAvIHNlcm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjUxOTUtM1wiOiBcIkhlcGF0aXRpcyBCIHZpcnVzIHN1cmZhY2UgQWcgW1ByZXNlbmNlXSBpbiBTZXJ1bVwiLFxuICBcIjUxOTYtMVwiOiBcIkhlcGF0aXRpcyBCIHZpcnVzIHN1cmZhY2UgQWcgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW1cIixcbiAgXCIxNjEyOC0xXCI6IFwiSGVwYXRpdGlzIEMgdmlydXMgQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bVwiLFxuICBcIjEzOTU1LTBcIjogXCJIZXBhdGl0aXMgQyB2aXJ1cyBBYiBbUHJlc2VuY2VdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ29hZ3VsYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNjMwMS02XCI6IFwiSU5SIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hIGJ5IENvYWd1bGF0aW9uIGFzc2F5XCIsXG4gIFwiMTQ5NzktOVwiOiBcImFQVFQgaW4gUGxhdGVsZXQgcG9vciBwbGFzbWEgYnkgQ29hZ3VsYXRpb24gYXNzYXlcIixcbiAgXCIzMDI0MC02XCI6IFwiRmlicmluIEQtZGltZXIgW01hc3Mvdm9sdW1lXSBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVml0YWwgc2lnbnMgKElIS0UzNDAyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI4MzAyLTJcIjogXCJCb2R5IGhlaWdodFwiLFxuICBcIjI5NDYzLTdcIjogXCJCb2R5IHdlaWdodFwiLFxuICBcIjM5MTU2LTVcIjogXCJCb2R5IG1hc3MgaW5kZXggKEJNSSkgW1JhdGlvXVwiLFxuICBcIjgyODAtMFwiOiBcIldhaXN0IENpcmN1bWZlcmVuY2UgYXQgdW1iaWxpY3VzIGJ5IFRhcGUgbWVhc3VyZVwiLFxuICBcIjg0ODAtNlwiOiBcIlN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIsXG4gIFwiODQ2Mi00XCI6IFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIsXG4gIFwiODUzNTQtOVwiOiBcIkJsb29kIHByZXNzdXJlIHBhbmVsIHdpdGggYWxsIGNoaWxkcmVuIG9wdGlvbmFsXCIsXG59O1xuIiwgIi8qKlxuICogUHVyZSBwYXJzaW5nIGhlbHBlcnMgXHUyMDE0IHJlZmVyZW5jZSByYW5nZSwgcXVhbnRpdHksIFVDVU0gdW5pdCBub3JtYWxpc2F0aW9uLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9fcGFyc2Vycy5weWAuIFNlbGYtY29udGFpbmVkOiBubyBkZXBlbmRlbmNpZXNcbiAqIG9uIG90aGVyIG9ic2VydmF0aW9uIG1vZHVsZSBwaWVjZXMuXG4gKlxuICogUHVibGljIEFQSTpcbiAqICAgdG9VY3VtKHVuaXQpICAgICAgICAgICAgICAgICAgXHUyMTkyIGNhbm9uaWNhbCBVQ1VNIHVuaXQgc3RyaW5nIChvciBudWxsKVxuICogICBwYXJzZVJhbmdlTXVsdGkocmF3LCB1bml0KSAgICBcdTIxOTIgbGlzdCBvZiBGSElSIHJlZmVyZW5jZVJhbmdlIGVudHJpZXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob25lIHBlciBzZXggd2hlbiBzZXgtc3RyYXRpZmllZClcbiAqICAgcGFyc2VSYW5nZShyYXcsIHVuaXQpICAgICAgICAgXHUyMTkyIHNpbmdsZSByZWZlcmVuY2VSYW5nZSBlbnRyeVxuICogICB0cnlQYXJzZVF1YW50aXR5KHJhdywgdW5pdCkgICBcdTIxOTIgRkhJUiBRdWFudGl0eSBkaWN0IG9yIG51bGxcbiAqL1xuXG5jb25zdCBVQ1VNX1NZU1RFTSA9IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiO1xuXG4vLyBGSElSIFI0IFF1YW50aXR5LmNvbXBhcmF0b3IgYWxsb3dlZCB2YWx1ZXMuIE5vcm1hbGlzZSBmdWxsLXdpZHRoIENKS1xuLy8gXHVGRjFFIFx1RkYxQyBcdTIyNjcgXHUyMjY2ICsgQVNDSUkgdmFyaWFudHMgc28gXCJcdUZGMUUgNDAuMFwiIHN0aWxsIHBhcnNlcyBhcyBhIHJlYWwgbnVtYmVyXG4vLyBpbnN0ZWFkIG9mIGZhbGxpbmcgdGhyb3VnaCB0byB2YWx1ZVN0cmluZyAod2hpY2ggbG9zZXMgdGhlIHVuaXQpLlxuY29uc3QgRlVMTFdJRFRIX09QUzogUmVhZG9ubHlBcnJheTxbc3RyaW5nLCBzdHJpbmddPiA9IFtcbiAgW1wiXHVGRjFFXCIsIFwiPlwiXSxcbiAgW1wiXHVGRjFDXCIsIFwiPFwiXSxcbiAgW1wiXHUyMjY3XCIsIFwiPj1cIl0sXG4gIFtcIlx1MjI2NlwiLCBcIjw9XCJdLFxuICBbXCJcdTIyNjVcIiwgXCI+PVwiXSxcbiAgW1wiXHUyMjY0XCIsIFwiPD1cIl0sXG5dO1xuXG5mdW5jdGlvbiB0cmFuc2xhdGVGdWxsd2lkdGgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IG91dCA9IHM7XG4gIGZvciAoY29uc3QgW2Zyb20sIHRvXSBvZiBGVUxMV0lEVEhfT1BTKSB7XG4gICAgaWYgKG91dC5pbmNsdWRlcyhmcm9tKSkge1xuICAgICAgb3V0ID0gb3V0LnNwbGl0KGZyb20pLmpvaW4odG8pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5jb25zdCBDT01QQVJBVE9SX1JFID0gL15cXHMqKDw9fD49fDx8PilcXHMqKC4rKSQvO1xuXG4vLyBSZWZlcmVuY2UtcmFuZ2UgcGFyc2luZy4gTkhJIHNoaXBzIHRoZSByYW5nZSBhcyBwbGFpbiB0ZXh0IGxpa2Vcbi8vIFwiWzMuODldWzI2LjhdXCIsIFwiWzQwXVtdXCIsIFwiW05lZ2F0aXZlXVwiIG9yIFwiQU0gODowMCA2LjItMTkuNFwiLlxuY29uc3QgUlJfTE9XSElHSF9CUkFDS0VUUyA9IC9eXFxzKlxcW1xccyooW15cXF1dKilcXHMqXFxdXFxzKlxcW1xccyooW15cXF1dKilcXHMqXFxdXFxzKiQvO1xuY29uc3QgUlJfREFTSF9SQU5HRSA9IC8oLT9cXGQrKD86XFwuXFxkKyk/KVxccypbLX5cdTIwMTNdXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pLztcbmNvbnN0IFJSX0NPTVBBUkFUT1IgPSAvXlxccyooPD18Pj18PHw+KVxccyooLT9cXGQrKD86XFwuXFxkKyk/KVxccyokLztcbi8vIFNleC1zdHJhdGlmaWVkIGJyYWNrZXRlZCByYW5nZSwgZS5nLiBcIlx1NzUzNzoxMy43IFx1NTk3MzoxMS4xXCIgXHUyMDE0IHVzZWQgYnkgc29tZVxuLy8gaG9zcGl0YWxzIGZvciBoYWVtYXRvbG9neSAoSGIsIFJCQywgSGN0KS4gUHVsbHMgb3V0IChzZXgsIHZhbHVlKSBwYWlycy5cbi8vIFRvbGVyYXRlcyBvcHRpb25hbCBjb21wYXJhdG9yIChcdTIyNjcvXHUyMjY2Lz4vPCkgYmVmb3JlIHRoZSBudW1iZXIuXG5jb25zdCBSUl9TRVhfTlVNX0cgPSAvKFx1NzUzN1x1NjAyN3xcdTU5NzNcdTYwMjd8XHU3NTM3fFx1NTk3M3xNfEYpXFxzKls6XHVGRjFBXT9cXHMqKD86Wzw+XHUyMjY3XHUyMjY2XT0/KT9cXHMqKC0/XFxkKyg/OlxcLlxcZCspPykvZztcbmNvbnN0IFJSX1NJTkdMRV9CUkFDS0VUID0gL15cXHMqXFxbXFxzKiguKz8pXFxzKlxcXVxccyokLztcbmNvbnN0IFJSX1FVQUxJVEFUSVZFX1BBUkVOID1cbiAgL15cXHMqKE5vcm1hbHxcdTZCNjNcdTVFMzh8Tm9ucmVhY3RpdmV8Tm9uLXJlYWN0aXZlKVxccypcXChcXHMqKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqXFwpXFxzKiQvaTtcblxuY29uc3QgU0VYX1RPX0ZISVI6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBcdTc1MzdcdTYwMjc6IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBcdTc1Mzc6IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBNOiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgXHU1OTczXHU2MDI3OiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG4gIFx1NTk3MzogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxuICBGOiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG59O1xuXG4vLyBQdWJsaWMgdHlwZXMgXHUyMDE0IEZISVIgUXVhbnRpdHkgLyByZWZlcmVuY2VSYW5nZSBzaGFwZXMgdXNlZCBkb3duc3RyZWFtLlxuZXhwb3J0IGludGVyZmFjZSBRdWFudGl0eSB7XG4gIHZhbHVlOiBudW1iZXI7XG4gIHVuaXQ/OiBzdHJpbmc7XG4gIHN5c3RlbT86IHN0cmluZztcbiAgY29kZT86IHN0cmluZztcbiAgY29tcGFyYXRvcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSYW5nZUVudHJ5IHtcbiAgdGV4dDogc3RyaW5nO1xuICBsb3c/OiBRdWFudGl0eTtcbiAgaGlnaD86IFF1YW50aXR5O1xuICBhcHBsaWVzVG8/OiBBcnJheTx7XG4gICAgY29kaW5nOiBBcnJheTx7IHN5c3RlbTogc3RyaW5nOyBjb2RlOiBzdHJpbmc7IGRpc3BsYXk6IHN0cmluZyB9PjtcbiAgICB0ZXh0OiBzdHJpbmc7XG4gIH0+O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVUNVTSBub3JtYWxpc2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIE5ISSBsYWJzIHJlcG9ydCB1bml0cyBpbiBhIG1peCBvZiBVQ1VNLWNsZWFuIHN0cmluZ3MgKCdtZy9kTCcpLFxuICogVGFpd2FuLXN0eWxlIGVxdWl2YWxlbnRzICgnbUVxL0wnIHZzIFVDVU0gJ21lcS9MJyksIGZ1bGwtd2lkdGggcHVuY3R1YXRpb25cbiAqICgnXHVGRjA1JyB2cyAnJScpLCBhbmQgcGxhY2Vob2xkZXIgdGV4dCAoJ1x1NzEyMScpLiBUaGUgVFdOSElGSElSIHZhbGlkYXRvclxuICogcmVqZWN0cyBldmVyeXRoaW5nIGV4Y2VwdCBjYW5vbmljYWwgVUNVTSBpbiBRdWFudGl0eS5jb2RlLCBzbyB3ZVxuICogbm9ybWFsaXNlLiBgbnVsbGAgbWVhbnMgXCJvbWl0IFF1YW50aXR5LmNvZGUgZW50aXJlbHlcIi5cbiAqL1xuY29uc3QgVUNVTV9PVkVSUklERVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bGw+ID0ge1xuICAvLyBGdWxsd2lkdGggXHUyMTkyIEFTQ0lJXG4gIFwiXHVGRjA1XCI6IFwiJVwiLFxuICAvLyBDYXNlLXNlbnNpdGl2ZSBVQ1VNIChFcSBpcyAnZXEnLCBub3QgJ0VxJylcbiAgXCJtRXEvTFwiOiBcIm1lcS9MXCIsXG4gIFwibWVxL2xcIjogXCJtZXEvTFwiLFxuICAvLyBCUCBwcm9maWxlIGZpeGVkLXZhbHVlOiBtbVtIZ10gbm90IG1tSGdcbiAgbW1IZzogXCJtbVtIZ11cIixcbiAgTU1IRzogXCJtbVtIZ11cIixcbiAgLy8gQ29tbW9uIENoaW5lc2UgJ25vIHVuaXQnIHBsYWNlaG9sZGVycyBcdTIxOTIgZHJvcCBVQ1VNIGNvZGVcbiAgXHU3MTIxOiBudWxsLFxuICBcIlwiOiBudWxsLFxuICBcIlx1MjAxNFwiOiBudWxsLFxuICBcIi1cIjogbnVsbCxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VjdW0odW5pdDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXVuaXQpIHJldHVybiBudWxsO1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFVDVU1fT1ZFUlJJREVTLCB1bml0KSkge1xuICAgIHJldHVybiBVQ1VNX09WRVJSSURFU1t1bml0XSA/PyBudWxsO1xuICB9XG4gIHJldHVybiB1bml0O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUXVhbnRpdHkgYnVpbGRlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gbWFrZVF1YW50aXR5KHZhbHVlOiBudW1iZXIsIHVuaXQ6IHN0cmluZyk6IFF1YW50aXR5IHtcbiAgY29uc3QgcTogUXVhbnRpdHkgPSB7IHZhbHVlIH07XG4gIGlmICh1bml0KSB7XG4gICAgcS51bml0ID0gdW5pdDtcbiAgICBxLnN5c3RlbSA9IFVDVU1fU1lTVEVNO1xuICAgIHEuY29kZSA9IHVuaXQ7XG4gIH1cbiAgcmV0dXJuIHE7XG59XG5cbmZ1bmN0aW9uIHRyeVBhcnNlRmxvYXQoczogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmIChzID09PSBcIlwiIHx8IHMgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIC8vIE1pcnJvciBQeXRob24ncyBmbG9hdCgpIFx1MjAxNCBhbGxvdyBsZWFkaW5nL3RyYWlsaW5nIHdoaXRlc3BhY2UsXG4gIC8vIG9wdGlvbmFsIHNpZ24sIGRlY2ltYWwuIFJlamVjdCBpZiBOYU4gT1IgaWYgYW55IG5vbi1udW1lcmljIHJlc2lkdWFsXG4gIC8vIChOdW1iZXIoXCIxMmFiY1wiKSByZXR1cm5zIE5hTiwgT0s7IFwiMTIgIGFiY1wiIGFsc28gTmFOLCBPSykuXG4gIGNvbnN0IHRyaW1tZWQgPSBzLnRyaW0oKTtcbiAgaWYgKHRyaW1tZWQgPT09IFwiXCIpIHJldHVybiBudWxsO1xuICBjb25zdCBuID0gTnVtYmVyKHRyaW1tZWQpO1xuICBpZiAoTnVtYmVyLmlzTmFOKG4pKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIG47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBwYXJzZVJhbmdlTXVsdGkgLyBwYXJzZVJhbmdlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIExpc3QgdmFyaWFudCBvZiBwYXJzZVJhbmdlOiBlbWl0cyBvbmUgZW50cnkgcGVyIHNleCB3aGVuIHRoZSByYW5nZSBpc1xuICogc2V4LXN0cmF0aWZpZWQgKFwiW1x1NzUzNzoxMy43IFx1NTk3MzoxMS4xXVtcdTc1Mzc6MTcuMCBcdTU5NzM6MTUuMF1cIiksIG90aGVyd2lzZSBhXG4gKiBzaW5nbGUtZWxlbWVudCBsaXN0LiBFYWNoIGVudHJ5IHRhZ2dlZCB3aXRoIGFwcGxpZXNUbyBzbyBkb3duc3RyZWFtXG4gKiBjb2RlIGNhbiBwaWNrIHRoZSByaWdodCBvbmUgZm9yIHRoZSBwYXRpZW50J3Mgc2V4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSYW5nZU11bHRpKHJhd1JhbmdlOiBzdHJpbmcsIHVuaXQ6IHN0cmluZyk6IFJhbmdlRW50cnlbXSB7XG4gIGNvbnN0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoKHJhd1JhbmdlIHx8IFwiXCIpLnRyaW0oKSk7XG4gIGlmICghcykgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IGxvd0J5U2V4OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IGhpZ2hCeVNleDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBsZXQgdXNlZE11bHRpID0gZmFsc2U7XG5cbiAgY29uc3QgbSA9IHMubWF0Y2goUlJfTE9XSElHSF9CUkFDS0VUUyk7XG4gIGlmIChtKSB7XG4gICAgY29uc3QgbG93QmxvYiA9IG1bMV0gPz8gXCJcIjtcbiAgICBjb25zdCBoaWdoQmxvYiA9IG1bMl0gPz8gXCJcIjtcbiAgICBmb3IgKGNvbnN0IHNtIG9mIGxvd0Jsb2IubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgaWYgKHNtWzFdICYmIHNtWzJdKSBsb3dCeVNleFtzbVsxXV0gPSBzbVsyXTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzbSBvZiBoaWdoQmxvYi5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICBpZiAoc21bMV0gJiYgc21bMl0pIGhpZ2hCeVNleFtzbVsxXV0gPSBzbVsyXTtcbiAgICB9XG4gICAgdXNlZE11bHRpID0gT2JqZWN0LmtleXMobG93QnlTZXgpLmxlbmd0aCA+IDAgfHwgT2JqZWN0LmtleXMoaGlnaEJ5U2V4KS5sZW5ndGggPiAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFNpbmdsZS1icmFja2V0OiBlYWNoIHBlci1zZXggdmFsdWUncyBjb21wYXJhdG9yIGRlY2lkZXMgbG93IHZzIGhpZ2guXG4gICAgY29uc3Qgc2luZ2xlID0gcy5tYXRjaChSUl9TSU5HTEVfQlJBQ0tFVCk7XG4gICAgaWYgKHNpbmdsZSkge1xuICAgICAgY29uc3QgaW5uZXIgPSBzaW5nbGVbMV0gPz8gXCJcIjtcbiAgICAgIGZvciAoY29uc3Qgc20gb2YgaW5uZXIubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgICBjb25zdCBzZXhLZXkgPSBzbVsxXSA/PyBcIlwiO1xuICAgICAgICBjb25zdCB2YWxTdHIgPSBzbVsyXSA/PyBcIlwiO1xuICAgICAgICAvLyBGaW5kIHRoZSBjb21wYXJhdG9yIGltbWVkaWF0ZWx5IHByZWNlZGluZyB0aGlzIG51bWJlci5cbiAgICAgICAgLy8gTWlycm9yIHRoZSBQeXRob246IHJlYnVpbGQgYSBwZXItc2V4LWtleSBzZWFyY2guXG4gICAgICAgIGNvbnN0IHBhdCA9IG5ldyBSZWdFeHAoYCR7ZXNjYXBlUmVnZXgoc2V4S2V5KX1cXFxccypbOlx1RkYxQV0/XFxcXHMqKFs8Plx1MjI2N1x1MjI2Nl09Pyk/XFxcXHMqLT9cXFxcZGApO1xuICAgICAgICBjb25zdCBjbSA9IGlubmVyLm1hdGNoKHBhdCk7XG4gICAgICAgIGNvbnN0IG9wID0gY20/LlsxXSA/PyBcIlwiO1xuICAgICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgICBsb3dCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9IGVsc2UgaWYgKG9wID09PSBcIjxcIiB8fCBvcCA9PT0gXCI8PVwiKSB7XG4gICAgICAgICAgaGlnaEJ5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG93QnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdXNlZE11bHRpID0gT2JqZWN0LmtleXMobG93QnlTZXgpLmxlbmd0aCA+IDAgfHwgT2JqZWN0LmtleXMoaGlnaEJ5U2V4KS5sZW5ndGggPiAwO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1c2VkTXVsdGkpIHtcbiAgICBjb25zdCBlbnRyaWVzOiBSYW5nZUVudHJ5W10gPSBbXTtcbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIHVuaW9uIG9mIGtleXMgYWN0dWFsbHkgc2VlbiBcdTIwMTQgcHJlc2VydmUgaW5zZXJ0aW9uIG9yZGVyLlxuICAgIGNvbnN0IGFsbFNleEtleXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBrIG9mIFsuLi5PYmplY3Qua2V5cyhsb3dCeVNleCksIC4uLk9iamVjdC5rZXlzKGhpZ2hCeVNleCldKSB7XG4gICAgICBpZiAoIWFsbFNleEtleXMuaW5jbHVkZXMoaykpIGFsbFNleEtleXMucHVzaChrKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzZXhLZXkgb2YgYWxsU2V4S2V5cykge1xuICAgICAgY29uc3QgbWFwcGluZyA9IFNFWF9UT19GSElSW3NleEtleV07XG4gICAgICBpZiAoIW1hcHBpbmcpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgW2ZoaXJDb2RlLCBmaGlyRGlzcGxheV0gPSBtYXBwaW5nO1xuICAgICAgY29uc3QgZW50cnk6IFJhbmdlRW50cnkgPSB7XG4gICAgICAgIHRleHQ6IHJhd1JhbmdlLFxuICAgICAgICBhcHBsaWVzVG86IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vaGw3Lm9yZy9maGlyL2FkbWluaXN0cmF0aXZlLWdlbmRlclwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IGZoaXJDb2RlLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZoaXJEaXNwbGF5LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHRleHQ6IGZoaXJEaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgICAgaWYgKHNleEtleSBpbiBsb3dCeVNleCkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChsb3dCeVNleFtzZXhLZXldISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgICBpZiAoc2V4S2V5IGluIGhpZ2hCeVNleCkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChoaWdoQnlTZXhbc2V4S2V5XSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICAgIGVudHJpZXMucHVzaChlbnRyeSk7XG4gICAgfVxuICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIERlLWR1cCBieSBGSElSIHNleCBjb2RlIGluIGNhc2UgaW5wdXQgaGFzIGJvdGggXHU3NTM3IGFuZCBcdTc1MzdcdTYwMjcuXG4gICAgICBjb25zdCBzZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICBjb25zdCBvdXQ6IFJhbmdlRW50cnlbXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBlIG9mIGVudHJpZXMpIHtcbiAgICAgICAgY29uc3QgYyA9IGUuYXBwbGllc1RvPy5bMF0/LmNvZGluZ1swXT8uY29kZTtcbiAgICAgICAgaWYgKCFjIHx8IHNlZW4uaGFzKGMpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoYyk7XG4gICAgICAgIG91dC5wdXNoKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvbmUgPSBwYXJzZVJhbmdlKHJhd1JhbmdlLCB1bml0KTtcbiAgcmV0dXJuIG9uZSA/IFtvbmVdIDogW107XG59XG5cbi8qKlxuICogQ29udmVydCBhIHJlZmVyZW5jZS1yYW5nZSB0ZXh0IGludG8gYSBGSElSIHJlZmVyZW5jZVJhbmdlIGVudHJ5LlxuICpcbiAqIFN0cmF0ZWd5IGluIG9yZGVyOlxuICogICAxLiBcIltsb3ddW2hpZ2hdXCIgYnJhY2tldGVkIGZvcm1hdCBcdTIwMTQgTkhJJ3MgY2Fub25pY2FsIHNoYXBlLlxuICogICAyLiBcIjMuODktMjYuOFwiIC8gXCIzLjg5fjI2LjhcIiBkYXNoIHJhbmdlLlxuICogICAzLiBcIj4gNDBcIiAvIFwiPCAwLjVcIiBzaW5nbGUtc2lkZWQuXG4gKiAgIDQuIFF1YWxpdGF0aXZlIChcIk5lZ2F0aXZlXCIsIFwiQU0gODowMCA2LjItMTkuNFwiKSBcdTIwMTQgdGV4dC1vbmx5LlxuICpcbiAqIFNleC1zdHJhdGlmaWVkIHNoYXBlcyBnbyB0aHJvdWdoIHBhcnNlUmFuZ2VNdWx0aS4gUmV0dXJucyBudWxsIG9ubHlcbiAqIGZvciBlbXB0eSBpbnB1dC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmFuZ2UocmF3UmFuZ2U6IHN0cmluZywgdW5pdDogc3RyaW5nKTogUmFuZ2VFbnRyeSB8IG51bGwge1xuICBjb25zdCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKChyYXdSYW5nZSB8fCBcIlwiKS50cmltKCkpO1xuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBjb25zdCBlbnRyeTogUmFuZ2VFbnRyeSA9IHsgdGV4dDogcmF3UmFuZ2UgfTtcblxuICBjb25zdCBtID0gcy5tYXRjaChSUl9MT1dISUdIX0JSQUNLRVRTKTtcbiAgaWYgKG0pIHtcbiAgICBjb25zdCBsbyA9IChtWzFdID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCBoaSA9IChtWzJdID8/IFwiXCIpLnRyaW0oKTtcbiAgICBmb3IgKGNvbnN0IFtzaWRlLCBzaWRlVmFsXSBvZiBbXG4gICAgICBbXCJsb3dcIiwgbG9dLFxuICAgICAgW1wiaGlnaFwiLCBoaV0sXG4gICAgXSBhcyBjb25zdCkge1xuICAgICAgaWYgKCFzaWRlVmFsIHx8IHNpZGVWYWwgPT09IFwiXHU3MTIxXCIgfHwgc2lkZVZhbCA9PT0gXCJcdTdBN0FcdTc2N0RcIikgY29udGludWU7XG5cbiAgICAgIC8vIDEuIFBsYWluIGZsb2F0XG4gICAgICBjb25zdCBhc0Zsb2F0ID0gdHJ5UGFyc2VGbG9hdChzaWRlVmFsKTtcbiAgICAgIGlmIChhc0Zsb2F0ICE9PSBudWxsKSB7XG4gICAgICAgIGVudHJ5W3NpZGVdID0gbWFrZVF1YW50aXR5KGFzRmxvYXQsIHVuaXQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gMi4gRGFzaCByYW5nZSBcdTIwMTQgbWVhbmluZ2Z1bCBvbmx5IGZvciBgbG93YCBzbG90OyBzcGxpdHMgaW50byBsb3craGlnaC5cbiAgICAgIGNvbnN0IGRtID0gc2lkZVZhbC5tYXRjaChSUl9EQVNIX1JBTkdFKTtcbiAgICAgIGlmIChkbSAmJiBzaWRlID09PSBcImxvd1wiICYmIGVudHJ5LmhpZ2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCB2MSA9IHRyeVBhcnNlRmxvYXQoZG1bMV0hKTtcbiAgICAgICAgY29uc3QgdjIgPSB0cnlQYXJzZUZsb2F0KGRtWzJdISk7XG4gICAgICAgIGlmICh2MSAhPT0gbnVsbCAmJiB2MiAhPT0gbnVsbCkge1xuICAgICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2MSwgdW5pdCk7XG4gICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2MiwgdW5pdCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gMy4gQ29tcGFyYXRvciAoXHUyMjY3NjAsIDw9MC4wNCBldGMuKVxuICAgICAgY29uc3QgY20gPSBzaWRlVmFsLm1hdGNoKFJSX0NPTVBBUkFUT1IpO1xuICAgICAgaWYgKGNtKSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGNtWzJdISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3Qgb3AgPSBjbVsxXTtcbiAgICAgICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gNC4gXCJOb3JtYWwgKCBYIClcIiAvIFwiTm9ucmVhY3RpdmUgKCBYIClcIiBcdTIwMTQgWCBpcyB0aGUgY3V0b2ZmIChoaWdoIGJvdW5kKS5cbiAgICAgIGNvbnN0IHFtID0gc2lkZVZhbC5tYXRjaChSUl9RVUFMSVRBVElWRV9QQVJFTik7XG4gICAgICBpZiAocW0pIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQocW1bMl0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIGNvbnN0IGRhc2hNYXRjaCA9IHMubWF0Y2goUlJfREFTSF9SQU5HRSk7XG4gIGlmIChkYXNoTWF0Y2gpIHtcbiAgICBjb25zdCB2MSA9IHRyeVBhcnNlRmxvYXQoZGFzaE1hdGNoWzFdISk7XG4gICAgY29uc3QgdjIgPSB0cnlQYXJzZUZsb2F0KGRhc2hNYXRjaFsyXSEpO1xuICAgIGlmICh2MSAhPT0gbnVsbCAmJiB2MiAhPT0gbnVsbCkge1xuICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYxLCB1bml0KTtcbiAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodjIsIHVuaXQpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBjb25zdCBjbXBNYXRjaCA9IHMubWF0Y2goUlJfQ09NUEFSQVRPUik7XG4gIGlmIChjbXBNYXRjaCkge1xuICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGNtcE1hdGNoWzJdISk7XG4gICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG9wID0gY21wTWF0Y2hbMV07XG4gICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgLy8gRmFsbCB0aHJvdWdoOiBxdWFsaXRhdGl2ZSBvciBjb21wbGV4IFx1MjAxNCB0ZXh0LW9ubHkgaXMgRkhJUi1jb3JyZWN0LlxuICByZXR1cm4gZW50cnk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCB0cnlQYXJzZVF1YW50aXR5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIFBhcnNlIFwiPiA0MC4wXCIgLyBcIjwwLjAxMFwiIC8gXCIxLDIzNC41XCIgXHUyMTkyIEZISVIgUXVhbnRpdHkgd2l0aCBjb21wYXJhdG9yLlxuICogUmV0dXJucyBudWxsIHdoZW4gdGhlIHJlc2lkdWFsIGFmdGVyIHN0cmlwcGluZyBhIGNvbXBhcmF0b3Igc3RpbGxcbiAqIGlzbid0IG51bWVyaWMgXHUyMDE0IGNhbGxlciBmYWxscyBiYWNrIHRvIHZhbHVlU3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJ5UGFyc2VRdWFudGl0eShcbiAgcmF3VmFsdWU6IHN0cmluZyB8IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHVuaXQ6IHN0cmluZyxcbik6IFF1YW50aXR5IHwgbnVsbCB7XG4gIGlmIChyYXdWYWx1ZSA9PT0gbnVsbCB8fCByYXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoU3RyaW5nKHJhd1ZhbHVlKS50cmltKCkpO1xuICBsZXQgY29tcGFyYXRvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGNtID0gcy5tYXRjaChDT01QQVJBVE9SX1JFKTtcbiAgaWYgKGNtKSB7XG4gICAgY29tcGFyYXRvciA9IGNtWzFdID8/IG51bGw7XG4gICAgcyA9IChjbVsyXSA/PyBcIlwiKS50cmltKCk7XG4gIH1cbiAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQocy5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgaWYgKHYgPT09IG51bGwpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHVjdW1Db2RlID0gdG9VY3VtKHVuaXQpO1xuICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgIHZhbHVlOiB2LFxuICAgIHN5c3RlbTogVUNVTV9TWVNURU0sXG4gIH07XG4gIC8vIFF1YW50aXR5LnVuaXQgKGh1bWFuLXJlYWRhYmxlKSBrZWVwcyB0aGUgb3JpZ2luYWwgTkhJIGxhYmVsIHNvIHVzZXJzXG4gIC8vIHN0aWxsIHNlZSAnXHVGRjA1JyBvciAnbUVxL0wnIHJhdy4gUXVhbnRpdHkuY29kZSBpcyBzdHJpY3QgVUNVTSBtYWNoaW5lXG4gIC8vIGNvZGUuIERyb3AgdW5pdCBkaXNwbGF5IHdoZW4gZW1wdHkgc28gd2UgZG9uJ3QgZW1pdCBcInVuaXRcIjogXCJcIi5cbiAgaWYgKHVuaXQpIHtcbiAgICBxdHkudW5pdCA9IHVuaXQ7XG4gIH1cbiAgaWYgKHVjdW1Db2RlICE9PSBudWxsKSB7XG4gICAgcXR5LmNvZGUgPSB1Y3VtQ29kZTtcbiAgfVxuICBpZiAoY29tcGFyYXRvcikge1xuICAgIHF0eS5jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgfVxuICByZXR1cm4gcXR5O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuIiwgIi8qKlxuICogT2JzZXJ2YXRpb24gbWFwcGVyIFx1MjAxNCBzaW5nbGUtcm93IGFuZCBwYW5lbC1ncm91cGVkIHZhcmlhbnRzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9vYnNlcnZhdGlvbi5weWAgKDEyMTIgbGluZXMpLiBJbmNsdWRlczpcbiAqICAgLSBtYXBPYnNlcnZhdGlvbihyYXcsIHBhdGllbnRJZCkgXHUyMTkyIHNpbmdsZSBPYnNlcnZhdGlvblxuICogICAtIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQoaXRlbXMsIHBhdGllbnRJZCkgXHUyMTkyIERpYWdub3N0aWNSZXBvcnQgKyBPYnNlcnZhdGlvbnNcbiAqICAgLSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgXHUyMDE0IGNyb3NzLXBhZ2UgZGVkdXAga2V5XG4gKiAgIC0gZmluZExvaW5jLCBidWlsZENvZGluZ3MsIG1hcEludGVycHJldGF0aW9uLCBkZXJpdmVJbnRlcnByZXRhdGlvblxuICogICAtIGRlZHVwZUNyb3NzRm9ybWF0LCBjb21iaW5lQnBJdGVtcywgZ3JvdXBCeU9yZGVyQ29kZVxuICogICAtIGluZmVyU3BlY2ltZW5cbiAqXG4gKiBGdW5jdGlvbmFsIHBhcml0eSB3aXRoIHRoZSBQeXRob24gaW1wbGVtZW50YXRpb24gaXMgdGhlIGdvYWwuIEZpZWxkXG4gKiBvcmRlciBpbiB0aGUgZW1pdHRlZCByZXNvdXJjZXMgbWF5IGRpZmZlciAoSlMgb2JqZWN0IGxpdGVyYWwgb3JkZXIpXG4gKiBidXQgY29udGVudCBpcyBpZGVudGljYWwuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB7XG4gIERJU1BMQVlfRklSU1RfQ09ERVMsXG4gIExPSU5DX0RJU1BMQVksXG4gIExPSU5DX01BUCxcbiAgTkhJX1RPX0xPSU5DLFxuICBQQU5FTF9MT0lOQ19NQVAsXG59IGZyb20gXCIuL2xvaW5jLXRhYmxlc1wiO1xuaW1wb3J0IHtcbiAgdHlwZSBRdWFudGl0eSxcbiAgdHlwZSBSYW5nZUVudHJ5LFxuICBwYXJzZVJhbmdlLFxuICBwYXJzZVJhbmdlTXVsdGksXG4gIHRvVWN1bSxcbiAgdHJ5UGFyc2VRdWFudGl0eSxcbn0gZnJvbSBcIi4vcGFyc2Vyc1wiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW1hZ2luZyBkZXRlY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElNQUdJTkdfS0VZV09SRFM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgXCJ1bHRyYXNvdW5kXCIsXG4gIFwic29ub2dyYW1cIixcbiAgXCJzb25vZ3JhcGh5XCIsXG4gIFwiZWNob1wiLFxuICBcImN0IFwiLFxuICBcImN0L1wiLFxuICBcImN0LVwiLFxuICBcImNvbXB1dGVkIHRvbW9ncmFwaHlcIixcbiAgXCJtcmlcIixcbiAgXCJtYWduZXRpYyByZXNvbmFuY2VcIixcbiAgXCJ4LXJheVwiLFxuICBcInhyYXlcIixcbiAgXCJ4IHJheVwiLFxuICBcIm1hbW1vZ3JhcGh5XCIsXG4gIFwibWFtbW9cIixcbiAgXCJla2dcIixcbiAgXCJlY2dcIixcbiAgXCJlbGVjdHJvY2FyZGlvZ3JhbVwiLFxuICBcImVuZG9zY29wXCIsXG4gIFwiY29sb25vc2NvcFwiLFxuICBcImdhc3Ryb3Njb3BcIixcbiAgXCJicm9uY2hvc2NvcFwiLFxuICBcInBldC9jdFwiLFxuICBcInBldCBcIixcbiAgXCJzcGVjdFwiLFxuICBcIlx1NUY3MVx1NTBDRlwiLFxuICBcIlx1OEQ4NVx1OTdGM1x1NkNFMlwiLFxuICBcIlx1OTZGQlx1ODE2Nlx1NjVCN1x1NUM2NFwiLFxuICBcIlx1NjgzOFx1NzhDMVx1NTE3MVx1NjMyRlwiLFxuICBcIlx1NUZDM1x1OTZGQlx1NTcxNlwiLFxuICBcIlx1NTE2N1x1ODk5Nlx1OTNFMVwiLFxuICBcIlx1NEU3M1x1NjIzRlx1NjUxRFx1NUY3MVwiLFxuXTtcblxuZnVuY3Rpb24gbG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5OiBzdHJpbmcsIGNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBoYXlzdGFjayA9IGAke2Rpc3BsYXl9ICR7Y29kZX1gLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBJTUFHSU5HX0tFWVdPUkRTLnNvbWUoKGt3KSA9PiBoYXlzdGFjay5pbmNsdWRlcyhrdykpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTE9JTkMgbG9va3VwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBOSElfTEFCX0NPREVfUkUgPSAvXlxcZHs0LDZ9W0EtWl0kLztcblxuZnVuY3Rpb24gaXNBc2NpaU9ubHkoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgPiAxMjcpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuXG4vLyBDaGVjayB3aGV0aGVyIGEgc2luZ2xlIExPSU5DX01BUCBrZXkgbWF0Y2hlcyB0aGUgbGFiJ3MgY29tYmluZWRcbi8vIChjb2RlICsgZGlzcGxheSkgc3RyaW5nLiBUd28gcnVsZXM6XG4vL1xuLy8gMS4gQVNDSUkga2V5czogYFxcYjxrZXk+XFxiYCBcdTIwMTQgd29yZCBib3VuZGFyaWVzIG9uIEJPVEggc2lkZXMuIFRoZVxuLy8gICAgbm8tdHJhaWxpbmctYm91bmRhcnkgc2VtYW50aWMgb2YgdGhlIG9sZGVyIGBcXGI8a2V5PmAgbWF0Y2hlclxuLy8gICAgY2F1c2VkIHNob3J0IGtleXMgbGlrZSBcImhiXCIgKEhlbW9nbG9iaW4pIHRvIGluY29ycmVjdGx5IG1hdGNoXG4vLyAgICBsb25nZXIgdGVybXMgbGlrZSBcImhic2FnXCIgKEhCc0FnKSBhbmQgXCJwaG9zcGhhdGVcIiAobWF0Y2hlZCBieVxuLy8gICAgXCJwaFwiKS4gUmVxdWlyaW5nIGFuIGVuZCBib3VuZGFyeSBtZWFucyBcImhiXCIgb25seSBtYXRjaGVzIHdoZW5cbi8vICAgIGl0IHN0YW5kcyBhcyBpdHMgb3duIHdvcmQuXG4vL1xuLy8gMi4gQ0pLIC8gbm9uLUFTQ0lJIGtleXM6IHBsYWluIHN1YnN0cmluZyBpbmNsdWRlcygpLiBcXGIgZG9lc24ndFxuLy8gICAgc2VtYW50aWNhbGx5IHdvcmsgZm9yIENKSyAobm8gd29yZC1jaGFyYWN0ZXIgY2xhc3MgY29uY2VwdCkuXG5mdW5jdGlvbiBfa2V5d29yZE1hdGNoZXMoa2V5OiBzdHJpbmcsIGNvbWJpbmVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgayA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoayl9XFxcXGJgKS50ZXN0KGNvbWJpbmVkKTtcbiAgfVxuICByZXR1cm4gY29tYmluZWQuaW5jbHVkZXMoayk7XG59XG5cbi8vIFBpY2sgdGhlIExPTkdFU1QgbWF0Y2hpbmcga2V5IGZyb20gdGhlIHRhYmxlLCBub3QgdGhlIGZpcnN0LiBBdm9pZHNcbi8vIHRoZSBzYW1lIGJ1ZyBmYW1pbHkgZnJvbSBhIHNlY29uZCBhbmdsZTogaHlwaGVuYXRlZCBrZXlzIGxpa2Vcbi8vIFwibGRsLWNob2xlc3Rlcm9sXCIgc2hhcmUgYSBgXFxiLi4uXFxiYCBib3VuZGFyeSBhdCB0aGUgaHlwaGVuLCBzbyBcImxkbFwiXG4vLyAoMyBjaGFycykgYWxzbyBtYXRjaGVzIGEgXCJsZGwtY2hvbGVzdGVyb2xcIiBzdHJpbmcuIExvbmdlc3QtbWF0Y2hcbi8vIG1ha2VzIHRoZSBtb3JlIHNwZWNpZmljIGtleSB3aW4gcmVnYXJkbGVzcyBvZiBpbnNlcnRpb24gb3JkZXIsIHNvXG4vLyB0aGUgYnJpdHRsZSBcImxvbmcgbXVzdCBhcHBlYXIgYmVmb3JlIHNob3J0XCIgY29tbWVudHMgc2NhdHRlcmVkXG4vLyB0aHJvdWdoIExPSU5DX01BUCBiZWNvbWUgdW5uZWNlc3NhcnkuXG5mdW5jdGlvbiBfZmluZExvbmdlc3RNYXRjaChcbiAgY29tYmluZWQ6IHN0cmluZyxcbiAgdGFibGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgbGV0IGJlc3RMb2luYzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBiZXN0S2V5TGVuID0gMDtcbiAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXModGFibGUpKSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiBiZXN0S2V5TGVuICYmIF9rZXl3b3JkTWF0Y2hlcyhrZXksIGNvbWJpbmVkKSkge1xuICAgICAgYmVzdExvaW5jID0gbG9pbmM7XG4gICAgICBiZXN0S2V5TGVuID0ga2V5Lmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJlc3RMb2luYztcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJpbWFyeSBMT0lOQyBmb3IgdGhpcyBsYWIuIFBhbmVsLWF3YXJlIGxvb2t1cDpcbiAqICAgQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgXHUyMTkyIHVzZSBOSElfVE9fTE9JTkMgZGlyZWN0bHkuXG4gKiAgIEIuIFBhbmVsIGNvZGUgT1IgdW5rbm93biBjb2RlIFx1MjE5MiB3YWxrIExPSU5DX01BUCBieSBkaXNwbGF5IGtleXdvcmRcbiAqICAgICAgKGxvbmdlc3Qta2V5IG1hdGNoIHdpbnMsIGJvdGgtc2lkZSB3b3JkIGJvdW5kYXJpZXMgZW5mb3JjZWQpLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGNvbnN0IGhpdCA9IF9maW5kTG9uZ2VzdE1hdGNoKGNvbWJpbmVkLCBQQU5FTF9MT0lOQ19NQVBbY29kZV0hKTtcbiAgICBpZiAoaGl0KSByZXR1cm4gaGl0O1xuICB9XG5cbiAgLy8gQi4gRGlzcGxheS1rZXl3b3JkIHNlYXJjaC5cbiAgY29uc3QgaGl0ID0gX2ZpbmRMb25nZXN0TWF0Y2goY29tYmluZWQsIExPSU5DX01BUCk7XG4gIGlmIChoaXQpIHJldHVybiBoaXQ7XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIC8vIFNvdXJjZS1wcm9ncmFtbWUgdGFnIFx1MjAxNCBzZXQgd2hlbiB0aGUgYWRhcHRlciBwdWxsZWQgdGhpcyBvYnNlcnZhdGlvblxuICAvLyBvdXQgb2YgYSBzcGVjaWZpYyBOSEkgc2NyZWVuaW5nIHByb2dyYW1tZSAoZS5nLiBhZGFwdEFkdWx0UHJldmVudGl2ZVxuICAvLyBzZXRzIHNvdXJjZV9wcm9ncmFtPVwiYWR1bHQtcHJldmVudGl2ZVwiKS4gU3VyZmFjZWQgdmlhIE9ic2VydmF0aW9uLlxuICAvLyBtZXRhLnRhZyBzbyBkb3duc3RyZWFtIFNNQVJUIGFwcHMgY2FuIGZpbHRlciBieSBfdGFnIHdpdGhvdXQgbmVlZGluZ1xuICAvLyB0byBrbm93IGFib3V0IG91ciBpbnRlcm5hbCBmaWVsZCBuYW1lcy5cbiAgaWYgKHJhdy5zb3VyY2VfcHJvZ3JhbSkge1xuICAgIHJlc291cmNlLm1ldGEudGFnID0gW1xuICAgICAge1xuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL25oaS1maGlyLWJyaWRnZS9zb3VyY2UtcHJvZ3JhbVwiLFxuICAgICAgICBjb2RlOiBTdHJpbmcocmF3LnNvdXJjZV9wcm9ncmFtKSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvKipcbiAqIFByb2NlZHVyZSBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL3Byb2NlZHVyZS5weWAuIFJldHVybnMgbnVsbCBmb3IgbGlzdC1wYWdlXG4gKiByb3dzIGxhY2tpbmcgbm90ZS9ib2R5X3NpdGUgXHUyMDE0IHRoZSBhbHRlcm5hdGl2ZSBpcyB0aGUgU01BUlQgYXBwIHNob3dpbmdcbiAqIDI1IFwicHJvY2VkdXJlc1wiIGNhbGxlZCBcIk15Y29iYWN0ZXJpYSBjdWx0dXJlXCIgLyBcIlZhZ2luYWwgdWx0cmFzb3VuZFwiXG4gKiAvIGV0Yy4gd2hpY2ggYXJlIGNsaW5pY2FsbHkgd3JvbmcuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZFwiKSkgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX1BDUztcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUHJvY2VkdXJlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBub3RlID0gKChyYXcubm90ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgY29uc3QgYm9keVNpdGUgPSAoKHJhdy5ib2R5X3NpdGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghbm90ZSAmJiAhYm9keVNpdGUpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUHJvY2VkdXJlXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIlByb2NlZHVyZVwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3LmRhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogcmF3LnN0YXR1cyA/PyBcImNvbXBsZXRlZFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZWREYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKGJvZHlTaXRlKSB7XG4gICAgcmVzb3VyY2UuYm9keVNpdGUgPSBbeyB0ZXh0OiBib2R5U2l0ZSB9XTtcbiAgfVxuICBpZiAobm90ZSkge1xuICAgIHJlc291cmNlLm5vdGUgPSBbeyB0ZXh0OiBub3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiBtYXBwZXIgZGlzcGF0Y2ggdGFibGVzLlxuICpcbiAqIENvbnN1bWVkIGJ5IGJhY2tlbmQncyBgL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRgIGFuZCB0aGUgZXh0ZW5zaW9uJ3NcbiAqIGxvY2FsLW1vZGUgYnVuZGxlIGFzc2VtYmxlciBzbyBib3RoIHByb2R1Y2UgaWRlbnRpY2FsIEZISVIgb3V0cHV0LlxuICovXG5cbmltcG9ydCB7IG1hcEFsbGVyZ3lJbnRvbGVyYW5jZSB9IGZyb20gXCIuL2FsbGVyZ3lcIjtcbmltcG9ydCB7IG1hcENvbmRpdGlvbiB9IGZyb20gXCIuL2NvbmRpdGlvblwiO1xuaW1wb3J0IHsgbWFwRGlhZ25vc3RpY1JlcG9ydCB9IGZyb20gXCIuL2RpYWdub3N0aWMtcmVwb3J0XCI7XG5pbXBvcnQgeyBtYXBFbmNvdW50ZXIgfSBmcm9tIFwiLi9lbmNvdW50ZXJcIjtcbmltcG9ydCB7IG1hcE1lZGljYXRpb25SZXF1ZXN0LCBtYXBNZWRpY2F0aW9uc0RlZHVwIH0gZnJvbSBcIi4vbWVkaWNhdGlvblwiO1xuaW1wb3J0IHsgbWFwT2JzZXJ2YXRpb24sIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQgfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuaW1wb3J0IHsgbWFwUHJvY2VkdXJlIH0gZnJvbSBcIi4vcHJvY2VkdXJlXCI7XG5cbmV4cG9ydCB0eXBlIFBlclJvd01hcHBlciA9IChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbikgPT4gUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGw7XG5cbmV4cG9ydCB0eXBlIEdyb3VwTWFwcGVyID0gKGl0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpID0+IFJlY29yZDxzdHJpbmcsIGFueT5bXTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIChwZXItcm93IG1hcHBlciwgSlNPTiBsaXN0IGtleSBpbnNpZGUgTExNIHJlc3BvbnNlKS5cbiAqIFVzZWQgYnkgdGhlIExMTSBmYWxsYmFjayBwYXRoIGFmdGVyIGV4dHJhY3Rpb247IHRoZSBzdHJ1Y3R1cmVkIHBhdGhcbiAqIGFsc28gY29uc3VsdHMgaXQgZm9yIHBlci1yb3cgcmVzb3VyY2UgdHlwZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBMSVNUX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBbUGVyUm93TWFwcGVyLCBzdHJpbmddPiA9IHtcbiAgb2JzZXJ2YXRpb25zOiBbbWFwT2JzZXJ2YXRpb24sIFwib2JzZXJ2YXRpb25zXCJdLFxuICBtZWRpY2F0aW9uczogW21hcE1lZGljYXRpb25SZXF1ZXN0LCBcIm1lZGljYXRpb25zXCJdLFxuICBjb25kaXRpb25zOiBbbWFwQ29uZGl0aW9uLCBcImNvbmRpdGlvbnNcIl0sXG4gIGFsbGVyZ2llczogW21hcEFsbGVyZ3lJbnRvbGVyYW5jZSwgXCJhbGxlcmdpZXNcIl0sXG4gIGRpYWdub3N0aWNfcmVwb3J0czogW21hcERpYWdub3N0aWNSZXBvcnQsIFwiZGlhZ25vc3RpY19yZXBvcnRzXCJdLFxuICBwcm9jZWR1cmVzOiBbbWFwUHJvY2VkdXJlLCBcInByb2NlZHVyZXNcIl0sXG4gIGVuY291bnRlcnM6IFttYXBFbmNvdW50ZXIsIFwiZW5jb3VudGVyc1wiXSxcbn07XG5cbi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiBncm91cC1hd2FyZSBtYXBwZXIgdGhhdCB0YWtlcyB0aGUgRlVMTCBsaXN0IGF0IG9uY2UuXG4gKiBVc2VkIHdoZW4gY3Jvc3Mtcm93IGdyb3VwaW5nL2RlZHVwIGlzIHJlcXVpcmVkIChOSEkgbGFiIHBhbmVscyxcbiAqIFx1NEUyRFx1ODJGMSBtZWRpY2F0aW9uIFx1OTZEOVx1OEE5RSBkZWR1cCkuXG4gKi9cbmV4cG9ydCBjb25zdCBHUk9VUF9IQU5ETEVSUzogUmVjb3JkPHN0cmluZywgR3JvdXBNYXBwZXI+ID0ge1xuICBvYnNlcnZhdGlvbnM6IG1hcE9ic2VydmF0aW9uc0dyb3VwZWQsXG4gIG1lZGljYXRpb25zOiBtYXBNZWRpY2F0aW9uc0RlZHVwLFxufTtcbiIsICIvKipcbiAqIEVuY291bnRlciBsaW5rZXIgXHUyMDE0IG1hdGNoIHJlc291cmNlcyB0byBFbmNvdW50ZXJzIGJ5IChob3NwaXRhbCwgZGF0ZSkuXG4gKlxuICogUHVyZSBmdW5jdGlvbjogbXV0YXRlcyBgcmVzb3VyY2VzYCBpbiBwbGFjZSB0byBhZGQgYGVuY291bnRlcmBcbiAqIHJlZmVyZW5jZXMgd2hlbiB0aGVyZSdzIGFuIHVuYW1iaWd1b3VzIG1hdGNoIGluIHRoZSBjYW5kaWRhdGVcbiAqIEVuY291bnRlciBsaXN0LiBTYW1lIGxvZ2ljIGFzIHRoZSBiYWNrZW5kJ3MgREItY291cGxlZCB2ZXJzaW9uLFxuICogbGlmdGVkIG91dCBzbyB0aGUgZXh0ZW5zaW9uJ3MgbG9jYWwgbW9kZSBjYW4gY2FsbCBpdCBvbiBhblxuICogaW4tbWVtb3J5IGFycmF5LlxuICovXG5cbmltcG9ydCB7IGRlcml2ZUludGVycHJldGF0aW9uIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb25cIjtcblxuY29uc3QgRU5DT1VOVEVSX0xJTktBQkxFID0gbmV3IFNldChbXG4gIFwiT2JzZXJ2YXRpb25cIixcbiAgXCJNZWRpY2F0aW9uUmVxdWVzdFwiLFxuICBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgXCJQcm9jZWR1cmVcIixcbiAgXCJDb25kaXRpb25cIixcbiAgXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbl0pO1xuXG5mdW5jdGlvbiByZXNvdXJjZURhdGUocjogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImVmZmVjdGl2ZURhdGVUaW1lXCIsXG4gICAgXCJhdXRob3JlZE9uXCIsXG4gICAgXCJwZXJmb3JtZWREYXRlVGltZVwiLFxuICAgIFwib25zZXREYXRlVGltZVwiLFxuICAgIFwicmVjb3JkZWREYXRlXCIsXG4gICAgXCJpc3N1ZWRcIixcbiAgXSkge1xuICAgIGNvbnN0IHYgPSByW2tleV07XG4gICAgaWYgKHYpIHJldHVybiBTdHJpbmcodikuc2xpY2UoMCwgMTApO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IG9mIFtcImVmZmVjdGl2ZVBlcmlvZFwiLCBcInBlcmZvcm1lZFBlcmlvZFwiXSkge1xuICAgIGNvbnN0IHBlcmlvZCA9IHJba2V5XTtcbiAgICBpZiAocGVyaW9kICYmIHR5cGVvZiBwZXJpb2QgPT09IFwib2JqZWN0XCIgJiYgcGVyaW9kLnN0YXJ0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHBlcmlvZC5zdGFydCkuc2xpY2UoMCwgMTApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gXCJcIjtcbn1cblxuZnVuY3Rpb24gcmVzb3VyY2VIb3NwaXRhbChyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgZm9yIChjb25zdCBwIG9mIHIucGVyZm9ybWVyID8/IFtdKSB7XG4gICAgY29uc3QgZCA9IChwID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgaWYgKGQpIHJldHVybiBkO1xuICB9XG4gIGNvbnN0IHJlcSA9IHIucmVxdWVzdGVyID8/IHt9O1xuICBpZiAocmVxICYmIHR5cGVvZiByZXEgPT09IFwib2JqZWN0XCIgJiYgcmVxLmRpc3BsYXkpIHJldHVybiByZXEuZGlzcGxheTtcbiAgcmV0dXJuIFwiXCI7XG59XG5cbi8qKlxuICogRHJvcCBBTUIgRW5jb3VudGVycyB3aG9zZSAoaG9zcGl0YWwsIHN0YXJ0X2RhdGUpIGlzIGFscmVhZHkgY292ZXJlZFxuICogYnkgYW4gSU1QIEVuY291bnRlcidzIGFkbWlzc2lvbiBkYXkuIE5ISSBlbWl0cyB0aGUgc2FtZSBpbnBhdGllbnRcbiAqIHN0YXkgdHdpY2UgKElIS0UzMzAzIEFNQiBiaWxsaW5nIGVudHJ5ICsgSUhLRTMzMDkgSU1QIGRldGFpbCk7IHRoZVxuICogSU1QIG9uZSBpcyBjYW5vbmljYWwsIHRoZSBBTUIgaXMgYSBiaWxsaW5nIGFydGVmYWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVkdXBBZG1pc3Npb25EYXlBbWIoXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgaW1wU3RhcnRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgIT09IFwiRW5jb3VudGVyXCIpIGNvbnRpbnVlO1xuICAgIGlmICgoci5jbGFzcyA/PyB7fSkuY29kZSAhPT0gXCJJTVBcIikgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IChyLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChyLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgIGlmIChob3NwICYmIHN0YXJ0KSBpbXBTdGFydHMuYWRkKGAke2hvc3B9ICR7c3RhcnR9YCk7XG4gIH1cbiAgaWYgKGltcFN0YXJ0cy5zaXplID09PSAwKSByZXR1cm4gcmVzb3VyY2VzO1xuICByZXR1cm4gcmVzb3VyY2VzLmZpbHRlcigocikgPT4ge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSA9PT0gXCJFbmNvdW50ZXJcIiAmJiAoci5jbGFzcyA/PyB7fSkuY29kZSA9PT0gXCJBTUJcIikge1xuICAgICAgY29uc3QgaG9zcCA9IChyLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKHIucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgICBpZiAoaW1wU3RhcnRzLmhhcyhgJHtob3NwfSAke3N0YXJ0fWApKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgYGVuY291bnRlcmAgcmVmZXJlbmNlIHRvIGVhY2ggbGlua2FibGUgcmVzb3VyY2Ugd2hlbiBpdHNcbiAqIChob3NwaXRhbCwgZGF0ZSkgbWF0Y2hlcyBleGFjdGx5IE9ORSBFbmNvdW50ZXIgaW4gYGNhbmRpZGF0ZXNgLlxuICogQ29uc2VydmF0aXZlIFx1MjAxNCBsZWF2ZXMgYW1iaWd1b3VzICgwIG9yID4xIG1hdGNoKSBjYXNlcyB1bmxpbmtlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMoXG4gIGNhbmRpZGF0ZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiB2b2lkIHtcbiAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gIGNvbnN0IGV4YWN0SW5kZXggPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KCk7XG4gIGNvbnN0IGltcEJ5SG9zcCA9IG5ldyBNYXA8c3RyaW5nLCBBcnJheTxbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+PigpO1xuXG4gIGZvciAoY29uc3QgZSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgaWYgKGUucmVzb3VyY2VUeXBlICE9PSBcIkVuY291bnRlclwiKSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gKGUuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKGUucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgaWYgKCFob3NwIHx8ICFzdGFydCkgY29udGludWU7XG4gICAgY29uc3Qga2V5ID0gYCR7aG9zcH0gJHtzdGFydH1gO1xuICAgIGNvbnN0IGFyciA9IGV4YWN0SW5kZXguZ2V0KGtleSkgPz8gW107XG4gICAgYXJyLnB1c2goZS5pZCk7XG4gICAgZXhhY3RJbmRleC5zZXQoa2V5LCBhcnIpO1xuICAgIGNvbnN0IGNscyA9IChlLmNsYXNzID8/IHt9KS5jb2RlID8/IFwiXCI7XG4gICAgaWYgKGNscyA9PT0gXCJJTVBcIikge1xuICAgICAgY29uc3QgZW5kID0gU3RyaW5nKChlLnBlcmlvZCA/PyB7fSkuZW5kID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IGltcEJ5SG9zcC5nZXQoaG9zcCkgPz8gW107XG4gICAgICAgIGxpc3QucHVzaChbc3RhcnQsIGVuZCwgZS5pZF0pO1xuICAgICAgICBpbXBCeUhvc3Auc2V0KGhvc3AsIGxpc3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChleGFjdEluZGV4LnNpemUgPT09IDAgJiYgaW1wQnlIb3NwLnNpemUgPT09IDApIHJldHVybjtcblxuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKCFFTkNPVU5URVJfTElOS0FCTEUuaGFzKHIucmVzb3VyY2VUeXBlKSkgY29udGludWU7XG4gICAgaWYgKHIuZW5jb3VudGVyIHx8IHIuY29udGV4dCkgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IHJlc291cmNlSG9zcGl0YWwocik7XG4gICAgY29uc3QgZGF0ZSA9IHJlc291cmNlRGF0ZShyKTtcbiAgICBpZiAoIWhvc3AgfHwgIWRhdGUpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1hdGNoZXM6IHN0cmluZ1tdID0gWy4uLihleGFjdEluZGV4LmdldChgJHtob3NwfSAke2RhdGV9YCkgPz8gW10pXTtcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZvciAoY29uc3QgW3N0YXJ0LCBlbmQsIGVpZF0gb2YgaW1wQnlIb3NwLmdldChob3NwKSA/PyBbXSkge1xuICAgICAgICBpZiAoc3RhcnQgPD0gZGF0ZSAmJiBkYXRlIDw9IGVuZCkgbWF0Y2hlcy5wdXNoKGVpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCAhPT0gMSkgY29udGludWU7XG4gICAgci5lbmNvdW50ZXIgPSB7IHJlZmVyZW5jZTogYEVuY291bnRlci8ke21hdGNoZXNbMF19YCB9O1xuICB9XG59XG5cbi8qKlxuICogV2hlbiBhbiBPYnNlcnZhdGlvbiBjYXJyaWVzIG11bHRpcGxlIHJlZmVyZW5jZVJhbmdlIGVudHJpZXMgdGFnZ2VkXG4gKiB3aXRoIGBhcHBsaWVzVG9bKl0uY29kaW5nLmNvZGVgIGluIHttYWxlLCBmZW1hbGV9LCBwaWNrIHRoZSBvbmUgdGhhdFxuICogbWF0Y2hlcyB0aGUgcGF0aWVudCdzIGdlbmRlciBhbmQgcmUtZGVyaXZlIGludGVycHJldGF0aW9uIGFnYWluc3QgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyhcbiAgcGF0aWVudDogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwsXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogdm9pZCB7XG4gIGlmICghcGF0aWVudCkgcmV0dXJuO1xuICBjb25zdCBnZW5kZXIgPSBTdHJpbmcocGF0aWVudC5nZW5kZXIgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGdlbmRlciAhPT0gXCJtYWxlXCIgJiYgZ2VuZGVyICE9PSBcImZlbWFsZVwiKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSAhPT0gXCJPYnNlcnZhdGlvblwiKSBjb250aW51ZTtcbiAgICBjb25zdCBycnM6IGFueVtdID0gci5yZWZlcmVuY2VSYW5nZSA/PyBbXTtcbiAgICBpZiAocnJzLmxlbmd0aCA8IDIpIGNvbnRpbnVlO1xuXG4gICAgbGV0IG1hdGNoOiBhbnkgPSBudWxsO1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgcnJzKSB7XG4gICAgICBmb3IgKGNvbnN0IGFwIG9mIGVudHJ5LmFwcGxpZXNUbyA/PyBbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgYXAuY29kaW5nID8/IFtdKSB7XG4gICAgICAgICAgaWYgKFN0cmluZyhjLmNvZGUgPz8gXCJcIikudG9Mb3dlckNhc2UoKSA9PT0gZ2VuZGVyKSB7XG4gICAgICAgICAgICBtYXRjaCA9IGVudHJ5O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaCkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAobWF0Y2gpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIW1hdGNoKSBjb250aW51ZTtcblxuICAgIHIucmVmZXJlbmNlUmFuZ2UgPSBbbWF0Y2hdO1xuICAgIGNvbnN0IHZhbFN0ciA9XG4gICAgICBTdHJpbmcoKHIudmFsdWVRdWFudGl0eSA/PyB7fSkudmFsdWUgPz8gXCJcIikgfHwgU3RyaW5nKHIudmFsdWVTdHJpbmcgPz8gXCJcIik7XG4gICAgY29uc3QgbmV3SW50ZXJwID0gZGVyaXZlSW50ZXJwcmV0YXRpb24odmFsU3RyLCByLnZhbHVlUXVhbnRpdHkgPz8gbnVsbCwgbWF0Y2gpO1xuICAgIGlmIChuZXdJbnRlcnApIHtcbiAgICAgIHIuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtuZXdJbnRlcnBdIH1dO1xuICAgIH1cbiAgfVxufVxuIiwgIi8qKlxuICogUGF0aWVudCBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL3BhdGllbnQucHlgLiBTYW1lIHB1YmxpYyBBUEk6XG4gKiAgIC0gbG9va3NMaWtlVHdOYXRpb25hbElkKHZhbHVlKSBcdTIwMTQgZXhwb3NlZCBmb3IgdGVzdHNcbiAqICAgLSBtYXBQYXRpZW50KHJhdykgXHUyMDE0IG1haW4gZW50cnlcbiAqL1xuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcblxuLy8gVGFpd2FuIG5hdGlvbmFsIElEOiAxIGxldHRlciArIDkgZGlnaXRzIChBMTIzNDU2Nzg5KS4gVXNlZCB0byBkZWNpZGVcbi8vIHdoZXRoZXIgdGhlIHBvcHVwLXN1cHBsaWVkIHBhdGllbnRfaWQgc2hvdWxkIGJlIGNvZGVkIHVuZGVyIHRoZVxuLy8gY2Fub25pY2FsIG5hdGlvbmFsLWlkIHN5c3RlbSBvciBhcyBhIGxvY2FsIGhvc3BpdGFsIE1STi5cbmNvbnN0IFRXX05BVElPTkFMX0lEX1JFID0gL15bQS1aXVsxMl1cXGR7OH0kLztcblxuZXhwb3J0IGZ1bmN0aW9uIGxvb2tzTGlrZVR3TmF0aW9uYWxJZCh2YWx1ZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBUV19OQVRJT05BTF9JRF9SRS50ZXN0KHZhbHVlLnRyaW0oKS50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFBhdGllbnQocmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IHJhd0lkID0gU3RyaW5nKHJhdy5pZGVudGlmaWVyID8/IHJhdy5pZCA/PyBcInVua25vd25cIik7XG4gIC8vIEZISVIgUGF0aWVudC5pZCBpcyB0aGUgaGFzaGVkL3NhbHRlZCBmb3JtLiBSZWFsIG5hdGlvbmFsIElEIHN0YXlzXG4gIC8vIG9ubHkgaW4gaWRlbnRpZmllcltdLnZhbHVlIHNvIGEgbGVha2VkIEJ1bmRsZSAob3IgYSBTTUFSVCBhcHAgdG9rZW5cbiAgLy8gcGF5bG9hZCBjb250YWluaW5nIHBhdGllbnRfaWQpIGRvZXNuJ3QgZGlzY2xvc2UgaXQgdmlhIGV2ZXJ5XG4gIC8vIHN1YmplY3QucmVmZXJlbmNlLlxuICBjb25zdCBwYXRpZW50SWQgPSBkZXJpdmVQYXRpZW50SWQocmF3SWQpO1xuXG4gIC8vIFVzZSBgPz9gIChub3QganVzdCBkZWZhdWx0IGFyZykgc28gZXhwbGljaXQgbnVsbCBmcm9tIHRoZSBMTE0gYWxzb1xuICAvLyBmYWxscyBiYWNrLiBMb2NhbCBtb2RlbHMgc29tZXRpbWVzIGVtaXQgbnVsbCBpbnN0ZWFkIG9mIG9taXR0aW5nLlxuICAvLyBUaGUgY2FsbGVyIGRlY2lkZXMgd2hldGhlciBgcmF3Lm5hbWVgIGlzIHRoZSB1c2VyJ3MgcmVhbCBuYW1lIG9yXG4gIC8vIGFscmVhZHktbWFza2VkIFx1MjAxNCBtYXBQYXRpZW50IGp1c3QgdHJhbnNjcmliZXMuIE1hc2tpbmcgcG9saWN5IGxpdmVzXG4gIC8vIGF0IHRoZSBVSSAvIGV4dGVuc2lvbiBsYXllciAoZHJpdmVuIGJ5IHRoZSB1c2VyLXRvZ2dsZWFibGVcbiAgLy8gYG1hc2tOYW1lRW5hYmxlZGAgc2V0dGluZykgc28gdGhlIHNhbWUgbWFwcGVyIGlzIGNvcnJlY3QgZm9yIGJvdGhcbiAgLy8gXCJcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjggPSByZWFsIG5hbWVcIiBhbmQgXCJcdTkxQUJcdTc2NDJcdTRFQkFcdTU0RTFcdTU5MUFcdTc1QzVcdTRFQkEgPSBtYXNrZWRcIiB3b3JrZmxvd3MuXG4gIGNvbnN0IG5hbWVUZXh0ID0gKHJhdy5uYW1lID8/IG51bGwpIHx8IFwiVW5rbm93blwiO1xuICBjb25zdCBwaG9uZSA9IChyYXcucGhvbmUgPz8gbnVsbCkgfHwgXCJcIjtcbiAgY29uc3QgYWRkcmVzcyA9IChyYXcuYWRkcmVzcyA/PyBudWxsKSB8fCBcIlwiO1xuXG4gIGNvbnN0IFtmYW1pbHksIGdpdmVuXSA9IHNwbGl0TmFtZShuYW1lVGV4dCk7XG4gIGNvbnN0IG5hbWVFbnRyeTogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgdXNlOiBcIm9mZmljaWFsXCIsIHRleHQ6IG5hbWVUZXh0IH07XG4gIGlmIChmYW1pbHkpIG5hbWVFbnRyeS5mYW1pbHkgPSBmYW1pbHk7XG4gIGlmIChnaXZlbi5sZW5ndGggPiAwKSBuYW1lRW50cnkuZ2l2ZW4gPSBnaXZlbjtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiUGF0aWVudFwiLFxuICAgIGlkOiBwYXRpZW50SWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgIHtcbiAgICAgICAgdXNlOiBcIm9mZmljaWFsXCIsXG4gICAgICAgIHN5c3RlbTogbG9va3NMaWtlVHdOYXRpb25hbElkKHJhd0lkKVxuICAgICAgICAgID8gc3lzdGVtcy5UV19OQVRJT05BTF9JRFxuICAgICAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfUEFUSUVOVF9NUk4sXG4gICAgICAgIHZhbHVlOiByYXdJZCxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBuYW1lOiBbbmFtZUVudHJ5XSxcbiAgICBnZW5kZXI6IG1hcEdlbmRlcihyYXcuZ2VuZGVyKSxcbiAgfTtcblxuICBjb25zdCBiaXJ0aERhdGUgPSByYXcuYmlydGhEYXRlO1xuICBpZiAoYmlydGhEYXRlKSByZXNvdXJjZS5iaXJ0aERhdGUgPSBiaXJ0aERhdGU7XG5cbiAgaWYgKHBob25lKSB7XG4gICAgcmVzb3VyY2UudGVsZWNvbSA9IFt7IHN5c3RlbTogXCJwaG9uZVwiLCB1c2U6IFwiaG9tZVwiLCB2YWx1ZTogcGhvbmUgfV07XG4gIH1cblxuICBpZiAoYWRkcmVzcykge1xuICAgIHJlc291cmNlLmFkZHJlc3MgPSBbeyB1c2U6IFwiaG9tZVwiLCB0ZXh0OiBhZGRyZXNzIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIFNwbGl0IGEgZnVsbCBuYW1lIGludG8gW2ZhbWlseSwgW2dpdmVuXV0gZm9yIEZISVIgUGF0aWVudC5uYW1lLlxuICpcbiAqIEhldXJpc3RpY3M6XG4gKiAgIC0gQ29udGFpbnMgd2hpdGVzcGFjZSBcdTIxOTIgV2VzdGVybjogbGFzdCB0b2tlbiA9IGZhbWlseSwgcmVzdCA9IGdpdmVuLlxuICogICAtIENKSyAvIHNpbmdsZS10b2tlbiBcdTIxOTIgZmlyc3QgY2hhciA9IGZhbWlseSwgcmVtYWluZGVyID0gZ2l2ZW4uXG4gKiAgIC0gXCJVbmtub3duXCIgb3IgZW1wdHkgXHUyMTkyIFtcIlwiLCBbXV1cbiAqXG4gKiBUd28tY2hhciBDSksgZmFtaWx5IG5hbWVzIChcdTZCNTBcdTk2N0QsIFx1NTNGOFx1OTlBQywgXHUyMDI2KSBhcmUgTk9UIGF1dG8tZGV0ZWN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHNwbGl0TmFtZShmdWxsTmFtZTogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nW11dIHtcbiAgY29uc3QgbmFtZSA9IChmdWxsTmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghbmFtZSB8fCBuYW1lID09PSBcIlVua25vd25cIikgcmV0dXJuIFtcIlwiLCBbXV07XG4gIGlmICgvXFxzLy50ZXN0KG5hbWUpKSB7XG4gICAgY29uc3QgcGFydHMgPSBuYW1lLnNwbGl0KC9cXHMrLyk7XG4gICAgcmV0dXJuIFtwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSEsIHBhcnRzLnNsaWNlKDAsIC0xKV07XG4gIH1cbiAgLy8gQ0pLIGZhbGxiYWNrIFx1MjAxNCBpdGVyYXRlIGNvZGVwb2ludHMsIG5vdCBVVEYtMTYgY29kZSB1bml0cywgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyAocmFyZSBpbiBDaGluZXNlIG5hbWVzIGJ1dCBwb3NzaWJsZSlcbiAgLy8gZG9uJ3QgZ2V0IHNwbGl0IG1pZC1jaGFyYWN0ZXIuXG4gIGNvbnN0IGNvZGVwb2ludHMgPSBBcnJheS5mcm9tKG5hbWUpO1xuICByZXR1cm4gY29kZXBvaW50cy5sZW5ndGggPiAxID8gW2NvZGVwb2ludHNbMF0hLCBbY29kZXBvaW50cy5zbGljZSgxKS5qb2luKFwiXCIpXV0gOiBbbmFtZSwgW11dO1xufVxuXG5mdW5jdGlvbiBtYXBHZW5kZXIoZ2VuZGVyOiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgZyA9IHR5cGVvZiBnZW5kZXIgPT09IFwic3RyaW5nXCIgPyBnZW5kZXIudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChbXCJtYWxlXCIsIFwibVwiLCBcIlx1NzUzN1wiLCBcIlx1NzUzN1x1NjAyN1wiXS5pbmNsdWRlcyhnKSkgcmV0dXJuIFwibWFsZVwiO1xuICBpZiAoW1wiZmVtYWxlXCIsIFwiZlwiLCBcIlx1NTk3M1wiLCBcIlx1NTk3M1x1NjAyN1wiXS5pbmNsdWRlcyhnKSkgcmV0dXJuIFwiZmVtYWxlXCI7XG4gIHJldHVybiBcInVua25vd25cIjtcbn1cbiIsICIvLyBOSEkgSlNPTiBcdTIxOTIgbm9ybWFsaXplZCBzaGFwZSBhZGFwdGVycy5cbi8vXG4vLyBFeHRyYWN0ZWQgZnJvbSBiYWNrZ3JvdW5kLmpzIHNvIGVhY2ggYWRhcHRlciBjYW4gYmUgdW5pdC10ZXN0ZWQgaW5cbi8vIGlzb2xhdGlvbi4gYmFja2dyb3VuZC5qcyBpbXBvcnRzIGV2ZXJ5dGhpbmcgYmVsb3c7IHRoZSBsaXZlIFNXIGdsdWVzXG4vLyB0aGVzZSBvbnRvIGZldGNoZWQgcGF5bG9hZHMgdmlhIHRoZSBlbmRwb2ludCByZWdpc3RyeS5cbi8vXG4vLyBXaHkgZXh0cmFjdDogdGhlIHYwLjYuMSBsYWIraW1hZ2luZyBkYXRlLWZpZWxkIGJ1Z3MgKGNvbW1pdHMgYjM3ODg1ZiAvXG4vLyA4YzE5OTAxKSBzaGlwcGVkIGJlY2F1c2UgdGhlc2UgZnVuY3Rpb25zIGhhZCBaRVJPIHRlc3QgY292ZXJhZ2UgXHUyMDE0XG4vLyBiYWNrZ3JvdW5kLmpzIGNhbid0IGJlIGxvYWRlZCBpbiBhIHRlc3QgZW52aXJvbm1lbnQgKGNocm9tZS4qIEFQSXMsXG4vLyBTVyBnbG9iYWxzKSwgc28gdGhlIGFkYXB0KiBsb2dpYyByb2RlIGFsb25nIHVudGVzdGVkLiBQdWxsaW5nIHRoZW1cbi8vIGludG8gYSBwdXJlLWZ1bmN0aW9uIG1vZHVsZSBsZXRzIHZpdGVzdCB2ZXJpZnkgZmllbGQtcHJpb3JpdHlcbi8vIGRlY2lzaW9ucyByb3ctYnktcm93LlxuXG4vLyBDb252ZXJ0IE5ISSdzIFx1NkMxMVx1NTcwQiBkYXRlIFwiMTE1LzA1LzA1XCIgXHUyMTkyIElTTyBcIjIwMjYtMDUtMDVcIi5cbi8vIFNvbWUgTkhJIGZpZWxkcyBlbWJlZCBib3RoIFJPQyBhbmQgR3JlZ29yaWFuOiBcIjExNS8wNS8wNXx8MjAyNi8wNS8wNVwiIFx1MjAxNCB3ZVxuLy8ganVzdCBtYXRjaCB0aGUgZmlyc3Qgc2VnbWVudC5cbmV4cG9ydCBmdW5jdGlvbiByb2NUb0lTTyhyb2NEYXRlKSB7XG4gIGlmICghcm9jRGF0ZSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IG0gPSBTdHJpbmcocm9jRGF0ZSkubWF0Y2goL14oXFxkezIsM30pWy8uLV0oXFxkezEsMn0pWy8uLV0oXFxkezEsMn0pLyk7XG4gIGlmICghbSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHkgPSBwYXJzZUludChtWzFdLCAxMCkgKyAxOTExO1xuICByZXR1cm4gYCR7eX0tJHttWzJdLnBhZFN0YXJ0KDIsIFwiMFwiKX0tJHttWzNdLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xufVxuXG4vLyBJbnZlcnNlOiBJU08gXCIyMDIzLTA1LTA1XCIgXHUyMTkyIFJPQyBcIjExMi8wNS8wNVwiLiBVc2VkIHRvIGJ1aWxkIE5ISSBkYXRlLXJhbmdlXG4vLyBxdWVyeSBzdHJpbmdzICh0aGVpciBmb3JtcyBleHBlY3QgXHU2QzExXHU1NzBCIGZvcm1hdCkuXG5leHBvcnQgZnVuY3Rpb24gaXNvVG9ST0MoaXNvRGF0ZSkge1xuICBpZiAoIWlzb0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKGlzb0RhdGUpLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pLyk7XG4gIGlmICghbSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHkgPSBwYXJzZUludChtWzFdLCAxMCkgLSAxOTExO1xuICBpZiAoeSA8IDEpIHJldHVybiBcIlwiOyAvLyBwcmUtXHU2QzExXHU1NzBCIGRhdGVzIG1ha2Ugbm8gc2Vuc2UgdG8gTkhJXG4gIHJldHVybiBgJHt5fS8ke21bMl0ucGFkU3RhcnQoMiwgXCIwXCIpfS8ke21bM10ucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG59XG5cbi8vIE5ISSBiaWxpbmd1YWwgZmllbGRzIHVzZSBcIlx1NEUyRFx1NjU4N3x8RW5nbGlzaFwiIFx1MjAxNCBjbGluaWNpYW5zIHNjYW4gRW5nbGlzaCBmYXN0ZXIsXG4vLyBzbyBwcmVmZXIgdGhhdCBzaWRlLiBJZiB0aGVyZSdzIG5vIGB8fGAgd2UganVzdCByZXR1cm4gdGhlIGlucHV0IHRyaW1tZWQuXG5leHBvcnQgZnVuY3Rpb24gcGlja0VuZ2xpc2gocykge1xuICBpZiAocyA9PT0gbnVsbCB8fCBzID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBjb25zdCBzdHIgPSBTdHJpbmcocyk7XG4gIGNvbnN0IGlkeCA9IHN0ci5pbmRleE9mKFwifHxcIik7XG4gIGlmIChpZHggPT09IC0xKSByZXR1cm4gc3RyLnRyaW0oKTtcbiAgY29uc3QgZW4gPSBzdHIuc2xpY2UoaWR4ICsgMikudHJpbSgpO1xuICByZXR1cm4gZW4gfHwgc3RyLnNsaWNlKDAsIGlkeCkudHJpbSgpO1xufVxuXG4vLyBTdHJpcCB0cmFpbGluZyBwdW5jdHVhdGlvbiAvIHdoaXRlc3BhY2UganVuayB0aGF0IHNvbWUgaG9zcGl0YWxzIGxlYXZlXG4vLyBvbiB0aGVpciBmcmVlLXRleHQgbGFiIGxhYmVscyAoZS5nLiBOSEkgcmV0dXJucyBcIkNyZWEsXCIgZnJvbSBvbmUgc2l0ZVxuLy8gYW5kIFwiQ3JlYVwiIGZyb20gYW5vdGhlciBmb3IgdGhlIHNhbWUgcGh5c2ljYWwgdGVzdCkuIFByZS1ub3JtYWxpemluZ1xuLy8gaGVyZSBtZWFucyB0aGUgT2JzZXJ2YXRpb24uY29kZS50ZXh0IGRvd25zdHJlYW0gcmVhZHMgY2xlYW5seSBldmVuXG4vLyB3aGVuIGRvd25zdHJlYW0gVUlzIHN0aWxsIGhhcHBlbiB0byByZW5kZXIgYGNvZGUudGV4dGAgaW5zdGVhZCBvZlxuLy8gcHVsbGluZyBkaXNwbGF5IGZyb20gdGhlIExPSU5DIC8gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBjb2RpbmcuXG5mdW5jdGlvbiBfY2xlYW5MYWJOYW1lKHMpIHtcbiAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgcmV0dXJuIFN0cmluZyhzKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWyxcdUZGMEM7XHVGRjFCXStcXHMqJC8sIFwiXCIpICAvLyB0cmFpbGluZyBcdTUzNEFcdTVGNjIgLyBcdTUxNjhcdTVGNjIgcHVuY3R1YXRpb25cbiAgICAudHJpbSgpO1xufVxuXG4vLyBBZGFwdGVyIGZvciBOSEkgbGFiL29ic2VydmF0aW9uIEpTT04gc2hhcGUgKGNvbmZpcm1lZCBmb3IgSUhLRTM0MDlTMDE7XG4vLyBvdGhlciBsYWIgZW5kcG9pbnRzIGxpa2VseSB1c2UgdGhlIHNhbWUgZmllbGRzKS5cbi8vXG4vLyBEYXRlIGZpZWxkIGNob2ljZSBcdTIwMTQgSUhLRTM0MDkgcmV0dXJucyB0aHJlZSBkYXRlLWlzaCBmaWVsZHMgcGVyIHJvdzpcbi8vICAgLSBmdW5DX0RBVEUgICAgICAgICAgXHU1QzMxXHU4QTNBXHU2NUU1IC8gXHU1MTY1XHU5NjYyXHU2NUU1ICh2aXNpdCByZWdpc3RyYXRpb24gLyBhZG1pc3Npb24pXG4vLyAgIC0gcmVhTF9JTlNQRUNUX0RBVEUgIFx1NUJFNlx1OTY5Qlx1NjNBMVx1NkFBMlx1NjVFNSAoYWN0dWFsIHNhbXBsZS1jb2xsZWN0aW9uIGRhdGUpXG4vLyAgIC0gYXNzYVlfVVBMT0FEX0RBVEUgIFx1NEUwQVx1NTBCM1x1NjVFNSAod2hlbiB0aGUgcmVzdWx0IGhpdCBOSEkncyBzZXJ2ZXIpXG4vLyBGb3IgYW4gaW5wYXRpZW50LCBmdW5DX0RBVEUgaXMgdGhlIGFkbWlzc2lvbiBkYXkgYW5kIGV2ZXJ5IGxhYiBkcmF3blxuLy8gZHVyaW5nIHRoZSBzdGF5IGNhcnJpZXMgdGhlIHNhbWUgZnVuQ19EQVRFIFx1MjAxNCB1c2luZyBpdCBhcyBPYnNlcnZhdGlvbi5cbi8vIGVmZmVjdGl2ZURhdGVUaW1lIG1hZGUgYWxsIFx1NEY0Rlx1OTY2Mlx1NjcxRlx1OTU5MyBsYWJzIGxvb2sgbGlrZSB0aGV5IHdlcmUgZHJhd25cbi8vIG9uIGRheSAxLiBGSElSJ3MgXCJwaHlzaW9sb2dpY2FsbHkgcmVsZXZhbnQgdGltZVwiIGZvciBhIGxhYiBPYnNlcnZhdGlvblxuLy8gaXMgdGhlIHNhbXBsZS1jb2xsZWN0aW9uIGRhdGUsIHNvIHByZWZlciByZWFMX0lOU1BFQ1RfREFURSB3aGVuIE5ISVxuLy8gcmV0dXJucyBpdDsgZmFsbCBiYWNrIHRvIGZ1bkNfREFURSBvbmx5IHdoZW4gdGhlIGluc3BlY3QgZmllbGQgaXNcbi8vIG1pc3NpbmcgKG9sZGVyIHJvd3MgLyBlbmRwb2ludHMgdGhhdCBkb24ndCBjYXJyeSBpdCkuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRMYWJJdGVtKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKFxuICAgIGl0ZW0ucmVhTF9JTlNQRUNUX0RBVEUgfHwgaXRlbS5yZWFsX2luc3BlY3RfZGF0ZSB8fCBpdGVtLmZ1bkNfREFURSxcbiAgKTtcbiAgY29uc3QgdmFsdWUgPSBpdGVtLmFzc2FZX1ZBTFVFO1xuICBpZiAoIWRhdGUgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIC8vIERpc3BsYXkgbmFtZSBmYWxsYmFjayBjaGFpbiAoYWxsIG5vcm1hbGl6ZWQgZm9yIHRyYWlsaW5nIHB1bmN0dWF0aW9uKTpcbiAgLy8gICAxLiBhc3NhWV9JVEVNX05BTUUgXHUyMDE0IGhvc3BpdGFsJ3MgZnVsbCBmcmVlLXRleHQgbGFiZWxcbiAgLy8gICAyLiBvcmRlcl9zaG9ydG5hbWUgXHUyMDE0IE5ISSdzIFVJLXRydW5jYXRlZCBsYWJlbCAob2Z0ZW4gZW5kcyBcIi4uLlwiKVxuICAvLyAgIDMuIG9yZGVSX05BTUUgICAgICBcdTIwMTQgTkhJJ3MgY2Fub25pY2FsIFx1OTFBQlx1NEVFNFx1NzhCQyBkaWN0aW9uYXJ5IG5hbWVcbiAgLy8gYXNzYVlfSVRFTV9OQU1FIHdpbnMgYnkgZGVmYXVsdCBiZWNhdXNlIG9yZGVyX3Nob3J0bmFtZSBjYW4gYmUgY3V0XG4gIC8vIG9mZiBtaWQtd29yZCAoXCJQQyBTdWdhciBcdTk4RUZcdTVGOEMgLi4uXCIpLCB3aGljaCBpcyB3b3JzZSB0aGFuIGEgdHJhaWxpbmctXG4gIC8vIGNvbW1hIGNvc21ldGljIGlzc3VlLiBvcmRlUl9OQU1FIGlzIHRoZSBsYXN0LXJlc29ydCBDaGluZXNlIGZvcm1hbFxuICAvLyBsYWJlbC5cbiAgY29uc3QgZnVsbE5hbWUgPSBfY2xlYW5MYWJOYW1lKGl0ZW0uYXNzYVlfSVRFTV9OQU1FKVxuICAgICAgICAgICAgICAgIHx8IF9jbGVhbkxhYk5hbWUoaXRlbS5vcmRlcl9zaG9ydG5hbWUpXG4gICAgICAgICAgICAgICAgfHwgX2NsZWFuTGFiTmFtZShpdGVtLm9yZGVSX05BTUUpO1xuICBjb25zdCBvcmRlckNvZGUgPSBTdHJpbmcoaXRlbS5vcmRlUl9DT0RFIHx8IFwiXCIpLnRyaW0oKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIG9yZGVyX2NvZGU6IG9yZGVyQ29kZSxcbiAgICBvcmRlcl9uYW1lOiBpdGVtLm9yZGVSX05BTUUgfHwgXCJcIixcbiAgICAvLyBQcmVmZXIgdGhlIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgKFwiMDkxNDBDXCIpIGFzIHRoZSBGSElSIGNvZGluZyBjb2RlIHNvIHRoZVxuICAgIC8vIGRvd25zdHJlYW0gb2JzZXJ2YXRpb24gbWFwcGVyIHJvdXRlcyBpdCB1bmRlciBOSElfTUVESUNBTF9PUkRFUl9cbiAgICAvLyBDT0RFIHN5c3RlbS4gU01BUlQgYXBwcyBncm91cCBsYWIgdGVzdHMgYnkgY29kaW5nIGNvZGU7IHVzaW5nXG4gICAgLy8gZnJlZS10ZXh0IGhlcmUgaXMgd2hhdCBjYXVzZXMgXCJDcmVhXCIgYW5kIFwiQ3JlYSxcIiB0byBiZSBzcGxpdFxuICAgIC8vIGludG8gdHdvIGRpc3RpbmN0IHRlc3RzLiBGYWxsYmFjayB0byB0aGUgY2xlYW5lZCBkaXNwbGF5IHdoZW5cbiAgICAvLyBOSEkgZG9lc24ndCBzdXBwbHkgYW4gb3JkZXIgY29kZSAob2xkZXIgLyBlZGdlLWNhc2Ugcm93cykuXG4gICAgY29kZTogb3JkZXJDb2RlIHx8IGZ1bGxOYW1lLFxuICAgIGRpc3BsYXk6IGZ1bGxOYW1lLFxuICAgIHZhbHVlOiBTdHJpbmcodmFsdWUpLFxuICAgIHVuaXQ6IGl0ZW0udW5pVF9EQVRBIHx8IFwiXCIsXG4gICAgcmVmZXJlbmNlX3JhbmdlOiBpdGVtLmNvbnN1bFRfVkFMVUUgfHwgaXRlbS5zaG9ydF9DT05TVUxUX1ZBTFVFIHx8IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzMzA2UzAxIHJldHVybnMgdmlzaXQtbGV2ZWwgcm93cyBPTkxZIChubyBkcnVnIG5hbWVzKS4gVGhlIGFjdHVhbCBkcnVnXG4vLyBsaXN0IGxpdmVzIGF0IElIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPTxyb3dfSUQ+JmN0eXBlPTIsIGluXG4vLyBgaWhrZTMzMDZTMDJfbWFpbl9kYXRhWypdLnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdGAuIFdlIGRvIHRoYXQgMi1zdGVwXG4vLyBmZXRjaCBzZXBhcmF0ZWx5OyB0aGlzIGZ1bmN0aW9uIGFkYXB0cyBhIHNpbmdsZSBkcnVnIGVudHJ5IGdpdmVuIGl0c1xuLy8gcGFyZW50IHZpc2l0IGNvbnRleHQuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbChkcnVnLCB2aXNpdCkge1xuICBpZiAoIWRydWcgfHwgdHlwZW9mIGRydWcgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICAvLyB2aXNpdC5mdW5jX0RBVEUgaXMgXCIxMTUvMDUvMDV8fDIwMjYvMDUvMDVcIiBcdTIwMTQgcm9jVG9JU08gbWF0Y2hlcyB0aGUgUk9DXG4gIC8vIHByZWZpeCBjb3JyZWN0bHkuXG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyh2aXNpdD8uZnVuY19EQVRFIHx8IHZpc2l0Py5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIGNvbnN0IGRydWdfbmFtZSA9IHBpY2tFbmdsaXNoKGRydWcuZHJ1Z19uYW1lIHx8IGRydWcuZHJ1R19OQU1FIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUgfHwgIWRydWdfbmFtZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRheXMgPSBOdW1iZXIoZHJ1Zy5vcmRlcl9kcnVnX2RheSB8fCBkcnVnLm9yZGVyX0RSVUdfREFZIHx8IDApO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgZHJ1Z19uYW1lLFxuICAgIGNvZGU6IGRydWcub3JkZXJfY29kZSB8fCBkcnVnLm9yZGVSX0NPREUgfHwgXCJcIixcbiAgICAvLyBMaXN0IGVuZHBvaW50IGRvZXNuJ3QgZXhwb3NlIGRvc2UvZnJlcXVlbmN5L3JvdXRlIFx1MjAxNCBvbmx5IGRheXMgKyBxdHkuXG4gICAgZG9zZTogXCJcIixcbiAgICBmcmVxdWVuY3k6IFwiXCIsXG4gICAgcm91dGU6IFwiXCIsXG4gICAgcXVhbnRpdHk6IGRydWcub3JkZXJfcXR5IHx8IGRydWcub3JkZXJfUVRZIHx8IFwiXCIsXG4gICAgZHVyYXRpb25fZGF5czogTnVtYmVyLmlzRmluaXRlKGRheXMpID8gZGF5cyA6IDAsXG4gICAgLy8gcGlja0VuZ2xpc2ggb24gaWNkX25hbWUgdHVybnMgXHU4MjZGXHU2MDI3XHU2NTFEXHU4Qjc3XHU4MTdBLi4ufHxCZW5pZ24gcHJvc3RhdGljLi4uIGludG8gdGhlIEVOIHNpZGUuXG4gICAgaW5kaWNhdGlvbjogcGlja0VuZ2xpc2godmlzaXQ/LmljZDljbV9DT0RFX0NOQU1FIHx8IHZpc2l0Py5pY2Q5Y21fbmFtZSB8fCBcIlwiKSxcbiAgICBpbmRpY2F0aW9uX2NvZGU6IHZpc2l0Py5pY2Q5Y21fQ09ERSB8fCB2aXNpdD8uaWNkOWNtX2NvZGUgfHwgXCJcIixcbiAgICBkcnVnX2NsYXNzOiBwaWNrRW5nbGlzaChkcnVnLmFjdCB8fCBcIlwiKSxcbiAgICBob3NwaXRhbDogdmlzaXQ/Lmhvc3BfQUJCUiB8fCB2aXNpdD8uaG9zcF9hYmJyIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIFN0dWIga2VwdCBmb3IgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5IFx1MjAxNCBJSEtFMzMwNlMwMSBsaXN0IG5ldmVyIGhhcyBkcnVncyxcbi8vIHNvIHdlIGFsd2F5cyByZXR1cm4gbnVsbCBhbmQgcmVseSBvbiB0aGUgMi1zdGVwIGRldGFpbCBmZXRjaCBhYm92ZS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdE1lZGljYXRpb24oKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIFNhbWUgc2hhcGUgYXMgYWRhcHRNZWRpY2F0aW9uOiBJSEtFMzQwOFMwMSAoaW1hZ2luZyBsaXN0KSBvbmx5IGNhcnJpZXNcbi8vIG9yZGVyLWxldmVsIGRhdGE7IHRoZSBhY3R1YWwgcmVwb3J0IG5hcnJhdGl2ZSBjb21lcyBmcm9tIHRoZSBJSEtFMzQwOFMwMlxuLy8gZGV0YWlsIGZhbi1vdXQgKHNlZSBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKS4gUmV0dXJuaW5nIG51bGwgZnJvbVxuLy8gdGhlIGxpc3QgYWRhcHRlciBlbnN1cmVzIG5vIGhhbGYtZm9ybWVkIERpYWdub3N0aWNSZXBvcnRzIGxlYWsgdGhyb3VnaC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltYWdpbmdMaXN0U3R1YigpIHsgcmV0dXJuIG51bGw7IH1cblxuLy8gSUhLRTMyMDlTMDEgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSkgXHUyMDE0IE5ISSdzIG9mZmljaWFsbHktdmV0dGVkIGNhdGFzdHJvcGhpYy1pbGxuZXNzXG4vLyByZWdpc3RyeS4gRWFjaCByb3cgaXMgYSBzZXJpb3VzIGNocm9uaWMgY29uZGl0aW9uIChjYW5jZXIsIGF1dG9pbW11bmUsXG4vLyB0cmFuc3BsYW50IGZvbGxvdy11cCwgZGlhbHlzaXMsIGV0Yy4pIHRoZSBwYXRpZW50IGlzIGN1cnJlbnRseVxuLy8gcmVnaXN0ZXJlZCBmb3IuIFRoaXMgaXMgdGhlIGNsb3Nlc3QgdGhpbmcgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGV4cG9zZXMgdG8gYVxuLy8gY3VyYXRlZCBwcm9ibGVtIGxpc3QgXHUyMDE0IGZhciBzdHJvbmdlciBzaWduYWwgdGhhbiByZXZlcnNlLWVuZ2luZWVyaW5nXG4vLyBjaHJvbmljIGNvbmRpdGlvbnMgZnJvbSBlbmNvdW50ZXIgSUNEcy5cbi8vXG4vLyBNYXBzIHRvIEZISVIgQ29uZGl0aW9uIHdpdGggY2F0ZWdvcnk9cHJvYmxlbS1saXN0LWl0ZW0gc28gZG93bnN0cmVhbVxuLy8gU01BUlQgYXBwcyAvIElQUyBwcm9maWxlcyBzdXJmYWNlIGl0IGluIHRoZWlyIHByb2JsZW0tbGlzdCB2aWV3LlxuLy9cbi8vIFBheWxvYWQgc2hhcGUgKGxpdmUgY2FwdHVyZSk6XG4vLyAgIHNQX0lIS0UzMjA5UzAxOiBbXG4vLyAgICAgeyBob3NQX0lELCBob3NQX0FCQlIsIGhvc1BfVVJMLFxuLy8gICAgICAgaWNEMTBDTV9DTkFNRTogXCJcdTY1MURcdThCNzdcdTgxN0FcdTYwRTFcdTYwMjdcdTgxNkJcdTc2MjRcIiwgIFx1MjE5MCBDaGluZXNlIG5hcnJhdGl2ZSBvbmx5XG4vLyAgICAgICB2YWxpRF9TX0RBVEU6ICBcIjExMS8xMS8xNlwiLCAgICAgICBcdTIxOTAgY2VydGlmaWNhdGlvbiB2YWxpZC1mcm9tIChST0MpXG4vLyAgICAgICB2YWxpRF9FX0RBVEU6ICBcIjExNi8xMS8xNVwiIH0gICAgICBcdTIxOTAgY2VydGlmaWNhdGlvbiB2YWxpZC11bnRpbCAoUk9DLCB+NXkpXG4vLyAgIF1cbi8vXG4vLyBDYXZlYXRzIGRlbGliZXJhdGVseSBlbmNvZGVkOlxuLy8gICAtIE5ISSBkb2Vzbid0IHJldHVybiB0aGUgSUNELTEwLUNNIGNvZGUgaW4gdGhpcyBlbmRwb2ludCwgb25seSB0aGVcbi8vICAgICBDaGluZXNlIGxhYmVsLiBXZSBsZWF2ZSBgY29kZWAgZW1wdHk7IG1hcENvbmRpdGlvbiBmYWxscyBiYWNrIHRvXG4vLyAgICAgZGlzcGxheS1hcy1pZCBmb3Igc3RhYmxlSWQgKG1pcnJvcmluZyBkaWFnbm9zdGljLXJlcG9ydC50cykuXG4vLyAgIC0gdmFsaURfRV9EQVRFIGlzIHdoZW4gdGhlIENBUkQgZXhwaXJlcyAocmVuZXdlZCBldmVyeSB+NXkpLCBOT1Rcbi8vICAgICB3aGVuIHRoZSBkaXNlYXNlIHJlc29sdmVkLiBXZSBkZWxpYmVyYXRlbHkgZG8gTk9UIG1hcCBpdCB0b1xuLy8gICAgIGFiYXRlbWVudERhdGVUaW1lIFx1MjAxNCB0aGF0IHdvdWxkIGZhbHNlbHkgaW1wbHkgdGhlIGNvbmRpdGlvbiBzdG9wcGVkLlxuLy8gICAtIEFsbCByb3dzIGhlcmUgYXJlIGN1cnJlbnRseSBhY3RpdmUgYnkgZGVmaW5pdGlvbjsgTkhJIG9ubHkgcmV0dXJuc1xuLy8gICAgIHZhbGlkIGNlcnRpZmljYXRpb25zLiBjbGluaWNhbF9zdGF0dXMgaGFyZC1jb2RlZCB0byBcImFjdGl2ZVwiLlxuLy8gICAtIHNldmVyaXR5IHN0b3JlZCBhcyB0ZXh0IChcIlNldmVyZSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KVwiKSBiZWNhdXNlIHRoZSBmb3JtYWxcbi8vICAgICBzZXZlcml0eSBjb2RlIG1hcHBpbmcgKFNOT01FRCAyNDQ4NDAwMCBldGMuKSBuZWVkcyBtb3JlIHRob3VnaHQuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRDYXRhc3Ryb3BoaWNJbGxuZXNzKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGlzcGxheSA9IHBpY2tFbmdsaXNoKGl0ZW0uaWNEMTBDTV9DTkFNRSB8fCBpdGVtLmljZDEwY21fY25hbWUgfHwgXCJcIik7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgZGlzcGxheSxcbiAgICBjb2RlOiBcIlwiLFxuICAgIHN5c3RlbTogXCJcIixcbiAgICBvbnNldF9kYXRlOiByb2NUb0lTTyhpdGVtLnZhbGlEX1NfREFURSB8fCBpdGVtLnZhbGlkX3NfZGF0ZSB8fCBcIlwiKSxcbiAgICByZWNvcmRlZF9kYXRlOiByb2NUb0lTTyhpdGVtLnZhbGlEX1NfREFURSB8fCBpdGVtLnZhbGlkX3NfZGF0ZSB8fCBcIlwiKSxcbiAgICBjYXRlZ29yeTogXCJwcm9ibGVtLWxpc3QtaXRlbVwiLFxuICAgIHNldmVyaXR5OiBcIlNldmVyZSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KVwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIGNsaW5pY2FsX3N0YXR1czogXCJhY3RpdmVcIixcbiAgfTtcbn1cblxuLy8gSUhLRTM0MDJTMDEgKFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NVx1N0Q1MFx1Njc5QykgXHUyMDE0IG9uZSByb3cgcGVyIHNjcmVlbmluZyBldmVudCwgZmxhdFxuLy8gc2NoZW1hLiBOSEkgcnVucyB0aGUgcGFuZWwgaXRzZWxmIGFuZCByZXR1cm5zIHZpdGFscyArIGEgZml4ZWRcbi8vIGJhdHRlcnkgb2YgbGFiIHZhbHVlcyBwcmUtY29tcHV0ZWQgKEJNSSAvIHdhaXN0IC8gQlAgLyBsaXBpZHMgLyBMRlRcbi8vIC8gUkZUIC8gZmFzdGluZyBnbHVjb3NlIC8gSEJzQWcgLyBBbnRpLUhDViAvIHVyaWMgYWNpZCBcdTIwMjYpLlxuLy8gV2UgdW5mb2xkIG9uZSByb3cgaW50byB+MTUgT2JzZXJ2YXRpb25zOiB2aXRhbHMgZ28gdG8gY2F0ZWdvcnlcbi8vIHZpdGFsLXNpZ25zIChzbyBTTUFSVCBhcHBzJyB2aXRhbHMgdmlld3MgcGljayB0aGVtIHVwKSwgbGFicyBnbyB0b1xuLy8gY2F0ZWdvcnkgbGFib3JhdG9yeS4gUmV0dXJucyBhbiBBUlJBWSBcdTIwMTQgY2FsbGVyIG11c3QgZmxhdC1tYXAuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRBZHVsdFByZXZlbnRpdmUocm93KSB7XG4gIGlmICghcm93IHx8IHR5cGVvZiByb3cgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08ocm93LmZpcnNUX0RJQUdfREFURSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaG9zcGl0YWwgPSByb3cuaG9zUF9BQkJSIHx8IHJvdy5ob3NwX0FCQlIgfHwgXCJcIjtcbiAgY29uc3Qgb3V0ID0gW107XG4gIC8vIChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBOSEkgY29kZSlcbiAgLy8gKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIGNvZGUpXG4gIC8vIEV2ZXJ5IG9ic2VydmF0aW9uIGVtaXR0ZWQgZnJvbSB0aGlzIGFkYXB0ZXIgY2FycmllcyBzb3VyY2VfcHJvZ3JhbT1cbiAgLy8gXCJhZHVsdC1wcmV2ZW50aXZlXCIgc28gZG93bnN0cmVhbSBGSElSIGNvbnN1bWVycyBjYW4gaWRlbnRpZnkgdGhlXG4gIC8vIG9yaWdpbiBwcm9ncmFtbWUgdmlhIE9ic2VydmF0aW9uLm1ldGEudGFnIChzZXBhcmF0ZSBmcm9tIHRoZVxuICAvLyBzeW5jLXBhZ2UtdHlwZSAvIHN5bmMtcnVuLWlkIHN5bmMtdHJhY2tpbmcgdGFncykuXG4gIGZ1bmN0aW9uIHB1c2goZGlzcGxheSwgdmFsdWUsIHVuaXQsIHJlZlJhbmdlLCBjYXRlZ29yeSwgY29kZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm47XG4gICAgY29uc3QgdiA9IFN0cmluZyh2YWx1ZSkudHJpbSgpO1xuICAgIC8vIEVtLWRhc2ggXCJcdTIwMTRcIiAoVSsyMDE0KSBpcyBOSEkncyBzZW50aW5lbCBcIm5vIGRhdGFcIiBtYXJrZXIgXHUyMDE0IGRyb3AuXG4gICAgLy8gUGxhaW4gaHlwaGVuIFwiLVwiIGlzIE5PVCBhIG5vLWRhdGEgbWFya2VyIHBlci1maWVsZCBcdTIwMTQgaXQncyB0aGVcbiAgICAvLyBjbGluaWNhbCBkaXBzdGljayBjb252ZW50aW9uIGZvciBcIm5lZ2F0aXZlXCIgKFVyaW5lIFByb3RlaW4pLlxuICAgIC8vIE5ISSdzIG5vLWRhdGEgZmxhZyBmb3IgYW4gZW50aXJlIHJvdyBpcyBzaWduYWxsZWQgYnlcbiAgICAvLyBmaXJzVF9ESUFHX0RBVEUgPSBcIi1cIiB3aGljaCB0aGUgcm93LWxldmVsIGRhdGUgZ3VhcmQgYXQgdGhlIHRvcFxuICAgIC8vIG9mIGFkYXB0QWR1bHRQcmV2ZW50aXZlIGFscmVhZHkgcmVqZWN0cywgc28gXCItXCIgcmVhY2hpbmcgcHVzaCgpXG4gICAgLy8gYWx3YXlzIG1lYW5zIFwidGhlIGNsaW5pY2lhbiB3cm90ZSBpdCBkb3duIGFzIGEgbmVnYXRpdmUgcmVzdWx0XCIuXG4gICAgaWYgKHYgPT09IFwiXCIgfHwgdiA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgIG91dC5wdXNoKHtcbiAgICAgIGRhdGUsXG4gICAgICBob3NwaXRhbCxcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIixcbiAgICAgIG9yZGVyX2NvZGU6IGNvZGUgfHwgXCJcIixcbiAgICAgIG9yZGVyX25hbWU6IGRpc3BsYXksXG4gICAgICBjb2RlOiBjb2RlIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgICAgdmFsdWU6IHYsXG4gICAgICB1bml0OiB1bml0IHx8IFwiXCIsXG4gICAgICByZWZlcmVuY2VfcmFuZ2U6IHJlZlJhbmdlIHx8IFwiXCIsXG4gICAgICAvLyBTb3VyY2UtcHJvZ3JhbW1lIHRhZyBcdTIwMTQgYWRkZWQgdG8gT2JzZXJ2YXRpb24ubWV0YS50YWcgYnkgdGhlXG4gICAgICAvLyBtYXBwZXI7IGxldHMgU01BUlQgYXBwcyBmaWx0ZXIgLyBjYXRlZ29yaXplIFwidGhpcyBjYW1lIGZyb21cbiAgICAgIC8vIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NSBzY3JlZW5pbmdcIi5cbiAgICAgIHNvdXJjZV9wcm9ncmFtOiBcImFkdWx0LXByZXZlbnRpdmVcIixcbiAgICB9KTtcbiAgfVxuICAvLyBWaXRhbCBzaWducyAobm8gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBcdTIwMTQgdGhlc2UgYXJlIHNjcmVlbmluZyBtZWFzdXJlbWVudHMsIG5vdFxuICAvLyBsYWIgb3JkZXJzOyB0aGV5IGhhdmUgY2Fub25pY2FsIExPSU5DcyB3aGljaCBmaW5kTG9pbmMncyBrZXl3b3JkXG4gIC8vIHNlYXJjaCByZXNvbHZlcyBjbGVhbmx5IHZpYSB1bmlxdWUgdGVybXMgbGlrZSBcImJvZHkgaGVpZ2h0XCIgLyBcImJtaVwiXG4gIC8vIFx1MjAxNCBubyBwcmVmaXgtY29sbGlzaW9uIHJpc2sgd2l0aCBvdGhlciBMT0lOQ19NQVAga2V5cykuXG4gIHB1c2goXCJCb2R5IEhlaWdodFwiLCByb3cuaGVpZ2h0LCBcImNtXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJCb2R5IFdlaWdodFwiLCByb3cud2VpZ2h0LCBcImtnXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJCTUlcIiwgcm93LmJtaSwgXCJrZy9tMlwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiV2Fpc3QgQ2lyY3VtZmVyZW5jZVwiLCByb3cud2Fpc3RsaW5lLCBcImNtXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJTeXN0b2xpYyBCbG9vZCBQcmVzc3VyZVwiLCByb3cuYmFzRV9TQlAsIFwibW1IZ1wiLFxuICAgICAgIHJvdy5ibG9EX1BSRVNTX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJEaWFzdG9saWMgQmxvb2QgUHJlc3N1cmVcIiwgcm93LmJhc0VfRUJQLCBcIm1tSGdcIixcbiAgICAgICByb3cuYmxvRF9QUkVTU19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICAvLyBBbGwgY2hlbWlzdHJ5IC8gaGVwIHBhbmVsIHJvd3MgcGluIHRoZSBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHNvIGZpbmRMb2luYyB0YWtlc1xuICAvLyB0aGUgTkhJX1RPX0xPSU5DIGRpcmVjdC1sb29rdXAgcGF0aCBcdTIwMTQgYnlwYXNzZXMgdGhlIGtleXdvcmQgc2VhcmNoXG4gIC8vIGVudGlyZWx5LiBNYXBwaW5nIGNyb3NzLXZlcmlmaWVkIGFnYWluc3QgdGhyZWUgc291cmNlczogdGhlIE5ISSBVSVxuICAvLyBzZWN0aW9uIGxhYmVscyAoXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NSksIHRoZSBJSEtFMzQwMiBKU09OIGZpZWxkXG4gIC8vIG5hbWVzLCBhbmQgdGhlIGV4aXN0aW5nIE5ISV9UT19MT0lOQyB0YWJsZSBjb21tZW50cy5cbiAgLy9cbiAgLy8gTGlwaWQgcGFuZWxcbiAgcHVzaChcIkNob2xlc3Rlcm9sXCIsICAgcm93LmNobywgICAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDFDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDIwOTMtM1xuICBwdXNoKFwiVHJpZ2x5Y2VyaWRlXCIsICByb3cuYmxvRF9URywgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwNENcIik7ICAvLyBcdTIxOTIgTE9JTkMgMjU3MS04XG4gIHB1c2goXCJIRExcIiwgICAgICAgICAgIHJvdy5oZGwsICAgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDQzQ1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyMDg1LTlcbiAgcHVzaChcIkxETFwiLCAgICAgICAgICAgcm93LmxkbCwgICAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwNDRDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDEzNDU3LTcgKGNhbGMpXG4gIC8vIExpdmVyIGZ1bmN0aW9uXG4gIHB1c2goXCJTR09UIChBU1QpXCIsICAgIHJvdy5zZ290LCAgICBcIlUvTFwiLCByb3cubEZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAyNUNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMTkyMC04XG4gIHB1c2goXCJTR1BUIChBTFQpXCIsICAgIHJvdy5zZ3B0LCAgICBcIlUvTFwiLCByb3cubEZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAyNkNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMTc0Mi02XG4gIC8vIEZhc3RpbmcgZ2x1Y29zZVxuICBwdXNoKFwiR2x1LUFDXCIsICAgICAgICByb3cuc18wOTAwNUMsIFwibWcvZExcIixcbiAgICAgICByb3cuc18wOTAwNUNfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwNUNcIik7ICAgICAgICAvLyBcdTIxOTIgTE9JTkMgMTU1OC02XG4gIC8vIFJlbmFsIGZ1bmN0aW9uIFx1MjAxNCBgdXJpbkVfQlVOYCBpcyBOSEkncyBtaXNsZWFkaW5nIGZpZWxkIG5hbWU7IHRoZVxuICAvLyB2YWx1ZSBJUyBzZXJ1bSBCVU4gKEJsb29kIFVyZWEgTml0cm9nZW4pLCBub3QgYSB1cmluZSB0ZXN0LlxuICBwdXNoKFwiQlVOXCIsICAgICAgICAgICByb3cudXJpbkVfQlVOLCAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDJDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDMwOTQtMFxuICBwdXNoKFwiQ3JlYXRpbmluZVwiLCAgICByb3cuYmxvRF9DUkVBVCwgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMTVDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDIxNjAtMFxuICAvLyBlR0ZSIFx1MjAxNCBkZXJpdmVkIGZyb20gQ3JlYXRpbmluZSwgbm8gb3duIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMuIERpc3BsYXkga2V5d29yZFxuICAvLyBcImVnZnJcIiByZXNvbHZlcyB0byBMT0lOQyAzMzkxNC0zIHZpYSBmaW5kTG9pbmMuXG4gIHB1c2goXCJlR0ZSXCIsICAgICAgICAgIHJvdy5lZ2ZyLCAgICAgICAgXCJtTC9taW4vMS43M20yXCIsXG4gICAgICAgcm93LnJGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIC8vIFVyaW5lIFByb3RlaW4gZGlwc3RpY2sgXHUyMDE0IHF1YWxpdGF0aXZlIChcIi1cIiAvIFwiXHUwMEIxXCIgLyBcIjErXCIgLi4uKS5cbiAgLy8gdXJpbkVfUFJPVEVJTiBpcyB0aGUgc3RhdHVzIGNvZGUsIHVyaW5FX1BST1RFSU5fVEVYVCBpcyB0aGVcbiAgLy8gZGlzcGxheWFibGUgcmVzdWx0IChwYXNzZWQgYXMgdmFsdWUpLiBUaGUgc3BlY2lmaWMgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBmb3JcbiAgLy8gcHJldmVudGl2ZS1zY3JlZW5pbmcgdXJpbmUgcHJvdGVpbiBpc24ndCBpbiBvdXIgTkhJX1RPX0xPSU5DIHRhYmxlXG4gIC8vIHlldDsgdGhlIGtleXdvcmQgXCJ1cmluZSBwcm90ZWluXCIgcmVzb2x2ZXMgdG8gTE9JTkMgMjA0NTQtNSB2aWFcbiAgLy8gZmluZExvaW5jIChhZnRlciB0aGUgdjAuNi43IGxvbmdlc3QtbWF0Y2ggZml4KS5cbiAgcHVzaChcIlVyaW5lIFByb3RlaW5cIiwgcm93LnVyaW5FX1BST1RFSU5fVEVYVCB8fCBcIlwiLCBcIlwiLCBcIlwiKTtcbiAgLy8gSGVwYXRpdGlzIEIvQyBzY3JlZW5pbmcgXHUyMDE0IHN0YXR1cyBjb2RlIHZzIF9URVhUIHRyYXAgZG9jdW1lbnRlZCBhdFxuICAvLyBsZW5ndGggYmVsb3cuIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgcGlubmVkIHNvIGZpbmRMb2luYyB0YWtlcyB0aGUgTkhJX1RPX0xPSU5DXG4gIC8vIHBhdGggKG90aGVyd2lzZSB0aGUga2V5d29yZCBcImhiXCIgcHJlZml4LWNvbGxpZGVzIHdpdGggdGhlIG1vcmVcbiAgLy8gc3BlY2lmaWMgXCJoYnNhZ1wiIFx1MjAxNCB0aGUgYnVnIG9yaWdpbmFsbHkgcmVwb3J0ZWQgaW4gdjAuNi41KS5cbiAgLy8gICAxNDAzMkMgXHUyMTkyIExPSU5DIDUxOTYtMSAgKEhCc0FnLCBNYXNzL3ZvbClcbiAgLy8gICAxNDA1MUMgXHUyMTkyIExPSU5DIDEzOTU1LTAgKEhDViBhbnRpYm9keSwgU2VydW0gb3IgUGxhc21hKVxuICAvLyBIaXN0b3J5OiByZWdyZXNzZWQgaW4gdjAuNi4zLCBmaXggbG9zdCB1bnRpbCB2MC42LjU7IE5ISSBcdTkxQUJcdTRFRTRcdTc4QkNcbiAgLy8gcGlubmluZyBhZGRlZCB2MC42LjYgKyB2MC42LjguXG4gIHB1c2goXCJIQnNBZ1wiLCAgICByb3cuaGJzYUdfVEVYVCAgIHx8IFwiXCIsIFwiXCIsIHJvdy5oYlZfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMTQwMzJDXCIpO1xuICBwdXNoKFwiQW50aS1IQ1ZcIiwgcm93LmFudElfSENWX1RFWFQgfHwgXCJcIiwgXCJcIiwgcm93LmhjVl9SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIxNDA1MUNcIik7XG4gIC8vIFVyaWMgYWNpZCAoYmxvb2QpIFx1MjAxNCBgdXJpQ19BQ0lEYCBmaWVsZC4gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyAwOTAxM0MgXHUyMTkyIExPSU5DXG4gIC8vIDMwODQtMSAoVXJhdGUgTWFzcy92b2wgUy9QKS5cbiAgLy9cbiAgLy8gTkhJJ3MgSUhLRTM0MDIgc2NoZW1hIEFMU08gY2FycmllcyB0d28gcmVsYXRlZC1sb29raW5nLWJ1dC1kaXN0aW5jdFxuICAvLyBmaWVsZHMgd2UgZGVsaWJlcmF0ZWx5IHNraXA6XG4gIC8vICAgLSB1cmluRV9VQV9ESUFHX0FDSUQgXHUyMDE0IGVtcGlyaWNhbGx5IGR1cGxpY2F0ZXMgc2VydW0gdXJpYyBhY2lkO1xuICAvLyAgICAgZW1pdHRpbmcgaXQgd291bGQgY3JlYXRlIGEgZHVwbGljYXRlIE9ic2VydmF0aW9uLlxuICAvLyAgIC0gdXJpbkVfVUEgLyB1cmluRV9VQV9ESUFHX1JFU1VMVF9URVhUIFx1MjAxNCBjbGFpbSB0byBiZSBhIHVyaW5lIFVBXG4gIC8vICAgICBkaXBzdGljayBidXQgRE9OJ1QgYXBwZWFyIGFueXdoZXJlIGluIE5ISSdzIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBVSSBmb3JcbiAgLy8gICAgIGFkdWx0IHByZXZlbnRpdmUgc2NyZWVuaW5nICh0aGUgXHU1QzNGXHU2REIyXHU2QUEyXHU2N0U1IHNlY3Rpb24gb25seSBzaG93c1xuICAvLyAgICAgXHU1QzNGXHU2REIyXHU4NkNCXHU3NjdEXHU4Q0VBKS4gQWx3YXlzIGVtcHR5IC8gXCItXCIgaW4gb2JzZXJ2ZWQgcGF5bG9hZHMuIExlZ2FjeVxuICAvLyAgICAgc2NoZW1hIGZpZWxkIHdpdGggbm8gY2xpbmljYWwgcmVhbGl0eSBcdTIwMTQgZG8gTk9UIGVtaXQuXG4gIHB1c2goXCJVcmljIEFjaWRcIiwgICAgIHJvdy51cmlDX0FDSUQsICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAxM0NcIik7XG4gIC8vIE1ldGFib2xpYyBzeW5kcm9tZSBzY3JlZW5pbmcgXHUyMDE0IHZhbHVlIGlzIGFuIGludGVycHJldGF0aW9uIHN0cmluZ1xuICAvLyAoJ1x1NkI2M1x1NUUzOCcgLyAnXHU3NTcwXHU1RTM4XHVGRjBDXHU1RUZBXHU4QjcwXHVGRjFBXHU4QUNCXHU2RDNEXHU4QTYyXHU5MUFCXHU1RTJCJyksIG5vdCBhIG51bWJlci4gVGhlIG1hcHBlcidzXG4gIC8vIF90cnlfcGFyc2VfcXVhbnRpdHkgd2lsbCByZXR1cm4gTm9uZSBhbmQgaXQgZmFsbHMgdGhyb3VnaCB0b1xuICAvLyB2YWx1ZVN0cmluZy4gTm8gbWFwcGVkIExPSU5DIGtleXdvcmQgKHlldCkgc28gdGhpcyBsYW5kcyBhcyBhblxuICAvLyBPYnNlcnZhdGlvbiB3aXRoIGNvZGUudGV4dCBvbmx5OyBkb3duc3RyZWFtIGNvbnN1bWVycyBjYW4gc3RpbGxcbiAgLy8gc3VyZmFjZSBpdCB1bmRlciB0aGUgcGF0aWVudCdzIHNjcmVlbmluZyBzZWN0aW9uIGJ5IGNvZGUudGV4dC5cbiAgcHVzaChcIlx1NEVFM1x1OEIxRFx1NzVDN1x1NTAxOVx1N0ZBNFx1N0JFOVx1NkFBMiAoTWV0YWJvbGljIFN5bmRyb21lIFNjcmVlbmluZylcIixcbiAgICAgICByb3cubWV0QV9TWU5EUl9SRVNVTFRfVEVYVCwgXCJcIiwgXCJcIik7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8vIElIS0UzMzA5UzAxIChcdTRGNEZcdTk2NjIgaW5wYXRpZW50IGxpc3QpIFx1MjAxNCBnaXZlcyBwcm9wZXIgYWRtaXNzaW9uL2Rpc2NoYXJnZS5cbi8vIFNoYXBlOiB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgaW5fREFURSwgb3V0X0RBVEUsXG4vLyAgICAgICAgIGljZDljbV9DT0RFLCBpY2Q5Y21fQ09ERV9DTkFNRSwgb3JpX1RZUEUoXCIzXCIpLCByb3dfSUQsIC4uLn1cbi8vIElIS0UzMzA4UzAxIGhhcyB0aGUgc2FtZSBzaGFwZSBmb3IgYSBzbWFsbCBzZXQgb2Ygb2xkZXIgXHU0RjRGXHU5NjYyIHJlY29yZHM7XG4vLyBgZnVuY19EQVRFYCBpbnN0ZWFkIG9mIGBpbl9EQVRFYCBpbiBzb21lIHJvd3MgXHUyMDE0IGFkYXB0ZXIgYWNjZXB0cyBib3RoLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0SW5wYXRpZW50RW5jb3VudGVyKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc3RhcnQgPSByb2NUb0lTTyhpdGVtLmluX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgXCJcIik7XG4gIGNvbnN0IGVuZCA9IHJvY1RvSVNPKGl0ZW0ub3V0X0RBVEUgfHwgXCJcIik7XG4gIGlmICghc3RhcnQpIHJldHVybiBudWxsO1xuICAvLyBpY2Q5Y20gbmFtZSBvbiBcdTRGNEZcdTk2NjIgbGlzdCBpcyBqdXN0IENoaW5lc2UgKG5vIHx8IEVuZ2xpc2ggc3BsaXQgb2JzZXJ2ZWQpLlxuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX25hbWUgfHwgXCJcIik7XG4gIHJldHVybiB7XG4gICAgZGF0ZTogc3RhcnQsXG4gICAgZW5kX2RhdGU6IGVuZCxcbiAgICBjbGFzczogXCJJTVBcIixcbiAgICB0eXBlX2Rpc3BsYXk6IFwiXHU0RjRGXHU5NjYyXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIHJvd19pZDogaXRlbS5yb3dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkgaXRlbSBzaGFwZSBcdTIwMTQgZmFyIG1vcmUgY29tcGxldGUgdGhhbiB0aGUgb2xkZXJcbi8vIElIS0UzMzAxUzAyIHZpc2l0IGxpc3QgKDUxIHZpc2l0cyB2cyA2IGZvciB0aGUgdGVzdCBwYXRpZW50KS4gTkhJJ3Ncbi8vIGNhbm9uaWNhbCBzb3VyY2Ugb2YgdHJ1dGggZm9yIFwiZXZlcnkgYmlsbGVkIGVuY291bnRlclwiLlxuLy8gICBob3NQX0lELCBob3NQX0FCQlIsIGhvc3BfdXJsXG4vLyAgIGZ1bkNfREFURSAgICAgICAgICAgICAgKFx1NkMxMVx1NTcwQiBZWVkvTU0vREQpXG4vLyAgIGljRDlDTV9DT0RFIC8gaWNEOUNNX0NPREVfQ05BTUVcbi8vICAgb3JJX1RZUEUgLyBvcmlfdHlwZV9uYW1lICAgKFwiSUNcdTUzNjFcdThDQzdcdTY1OTlcIiAvIFwiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIpIFx1MjAxNCBvcmlnaW4sIE5PVCBcdTk1ODAvXHU2MDI1L1x1NEY0RlxuLy8gICBwYXJ0X0FNVCwgYXBwbF9ET1QsIFx1MjAyNiAgIChiaWxsaW5nIFx1MjAxNCBkaXNjYXJkZWQpXG4vLyAgIHJvV19JRCAgICAgICAgICAgICAgICAgIGRldGFpbCBrZXkgZm9yIElIS0UzMzAzUzAyIGZhbi1vdXQgKFBoYXNlIEIpXG4vLyBXZSBkb24ndCBoYXZlIHZpc2l0IGNsYXNzIChcdTk1ODAvXHU2MDI1L1x1NEY0RikgYXQgdGhlIGxpc3QgbGV2ZWw7IHRoZSBTMDIgZGV0YWlsXG4vLyBoYXMgaG9zcF9EQVRBX1RZUEVfTkFNRSAoXCJcdTg5N0ZcdTkxQUJcIi9cIlx1NEUyRFx1OTFBQlwiL1wiXHU3MjU5XHU5MUFCXCIpLiBGb3Igbm93IGRlZmF1bHQgQU1CLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UoaXRlbSwgY2xhc3NIaW50KSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaWNkQ29kZSA9IGl0ZW0uaWNEOUNNX0NPREUgfHwgaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChcbiAgICBpdGVtLmljRDlDTV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fbmFtZSB8fCBcIlwiXG4gICk7XG4gIC8vIGNsYXNzIGRlZmF1bHRzIHRvIEFNQjsgSUhLRTMzMDNTMDIgZGV0YWlsIGZhbi1vdXQgbWF5IG92ZXJyaWRlIHRvXG4gIC8vIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRSAoXHU2MDI1XHU4QTNBIC8gXHU0RjRGXHU5NjYyKS5cbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGVuZF9kYXRlOiBcIlwiLFxuICAgIGNsYXNzOiBjbGFzc0hpbnQgfHwgXCJBTUJcIixcbiAgICAvLyBPcmlnaW4gbWFya2VyIGlzbid0IGEgY2xpbmljYWwgY2xhc3MsIGJ1dCBzdGFzaCBpdCBhcyB0eXBlX2Rpc3BsYXlcbiAgICAvLyBzbyBkb3duc3RyZWFtIHNlZXMgdGhlIE5ISSBsYWJlbCB3aXRob3V0IHVzIGludmVudGluZyBvbmUuXG4gICAgdHlwZV9kaXNwbGF5OiBpdGVtLm9yaV90eXBlX25hbWUgfHwgaXRlbS5vcklfVFlQRV9OQU1FIHx8IFwiXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIFBhc3MgdGhyb3VnaCBmb3IgdGhlIGV2ZW50dWFsIElIS0UzMzAzUzAyIGRldGFpbCBmZXRjaCAoUGhhc2UgQikuXG4gICAgcm93X2lkOiBpdGVtLnJvV19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRBbGxlcmd5KGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgYWxsZXJnZW4gPVxuICAgIGl0ZW0uYWxsZXJnZW5fbmFtZSB8fCBpdGVtLmFsbGVSX05BTUUgfHwgaXRlbS5tZWRuYW1lIHx8XG4gICAgaXRlbS5kcnVHX05BTUUgfHwgaXRlbS5hbGxlcmdlbiB8fCBcIlwiO1xuICBpZiAoIWFsbGVyZ2VuKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICByZWNvcmRlZF9kYXRlOiByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLnJlY29yRF9EQVRFIHx8IFwiXCIpLFxuICAgIGRpc3BsYXk6IGFsbGVyZ2VuLFxuICAgIGNhdGVnb3J5OiBcIm1lZGljYXRpb25cIixcbiAgICBjcml0aWNhbGl0eTogXCJ1bmFibGUtdG8tYXNzZXNzXCIsXG4gICAgcmVhY3Rpb246IGl0ZW0ucmVhY3Rpb04gfHwgaXRlbS5zeW1wdG9tIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzMzAxUzA1IChcdTg2NTVcdTdGNkUvXHU2MjRCXHU4ODUzIGxpc3QpIHNoYXBlOlxuLy8gICB7aG9zcF9pZCwgaG9zcF9hYmJyLCBob3NwX3VybCwgb3JpX3R5cGVfbmFtZSwgb3JpX3R5cGUsIGZ1bmNfZGF0ZSxcbi8vICAgIG91dF9kYXRlLCBpY2Q5Y21fY29kZSwgaWNkOWNtX2NvZGVfY25hbWUsIG9wX2NvZGVfY25hbWUsIHJvd19pZH1cbi8vIE5vdGU6IG5vIHByb2NlZHVyZSBDT0RFIGluIGxpc3QgXHUyMDE0IG9wX2NvZGVfY25hbWUgaXMgdGhlIG9ubHkgbGFiZWwuXG4vLyBEYXRlIG5vdGU6IE5ISSBkb2Vzbid0IGV4cG9zZSBhIHNlcGFyYXRlIFwiYWN0dWFsIHByb2NlZHVyZSBkYXRlXCIgaGVyZSxcbi8vIHNvIGZvciBpbnBhdGllbnQgcHJvY2VkdXJlcyAod2hlcmUgZnVuY19kYXRlID0gYWRtaXNzaW9uLCBvdXRfZGF0ZSA9XG4vLyBkaXNjaGFyZ2UpIHdlIGRlbGliZXJhdGVseSB1c2UgZnVuY19kYXRlIGFzIHRoZSBhbmNob3IuIFRoZSBwcm9jZWR1cmVcbi8vIFwiaGFwcGVuZWQgc29tZXdoZXJlIGluIHRoaXMgYWRtaXNzaW9uXCIgXHUyMDE0IGFuY2hvcmluZyB0byB0aGUgc3RhcnQgZGF5XG4vLyBpcyBhIHNtYWxsIGxvc3Mgb2YgYWNjdXJhY3kgdnMuIGludmVudGluZyBhIHBlcmZvcm1lZFBlcmlvZCB0aGF0IHdvdWxkXG4vLyBzdWdnZXN0IHRoZSBwcm9jZWR1cmUgc3Bhbm5lZCB0aGUgd2hvbGUgc3RheS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFByb2NlZHVyZShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bmNfZGF0ZSB8fCBpdGVtLmZ1bkNfREFURSk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChcbiAgICBpdGVtLm9wX2NvZGVfY25hbWUgfHwgaXRlbS5wcm9DX05BTUUgfHwgaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCJcbiAgKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5KSByZXR1cm4gbnVsbDtcbiAgLy8gRGlhZ25vc2lzIChpY2Q5Y21fY29kZV9jbmFtZSkgaXMgdGhlICpyZWFzb24qIGZvciB0aGUgcHJvY2VkdXJlLCBub3RcbiAgLy8gdGhlIHByb2NlZHVyZSBjb2RlIGl0c2VsZi4gU3Rhc2ggaXQgaW4gYG5vdGVgIHNvIGl0IHNob3dzIHVwIGluIHRoZVxuICAvLyBGSElSIHJlc291cmNlIHdpdGhvdXQgcG9sbHV0aW5nIHRoZSBjb2RlIGZpZWxkLlxuICBjb25zdCByZWFzb25Db2RlID0gaXRlbS5pY2Q5Y21fY29kZSB8fCBpdGVtLmljZDljbV9DT0RFIHx8IFwiXCI7XG4gIGNvbnN0IHJlYXNvbk5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9jb2RlX2NuYW1lIHx8IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgXCJcIik7XG4gIGNvbnN0IG5vdGUgPSByZWFzb25OYW1lXG4gICAgPyAocmVhc29uQ29kZSA/IGBSZWFzb246ICR7cmVhc29uQ29kZX0gJHtyZWFzb25OYW1lfWAgOiBgUmVhc29uOiAke3JlYXNvbk5hbWV9YClcbiAgICA6IFwiXCI7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgbm90ZSxcbiAgICBib2R5X3NpdGU6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9hYmJyIHx8IGl0ZW0uaG9zUF9BQkJSIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzNDA4UzAxIChcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTUgbGlzdCkgc2hhcGU6XG4vLyAgIHtob3NwX0lELCBob3NwX0FCQlIsIGhvc3BfdXJsLCByZWFsX0lOU1BFQ1RfREFURSwgb3JkZXJfQ09ERSxcbi8vICAgIG9yZGVyX0NPREVfMldvcmQsIG9yZGVyX05BTUUsIG9yaV9UWVBFLCByb3dfSUQsIGpwR19TVEFUVVMsIC4uLn1cbi8vIE5vIGZpbmRpbmdzL2NvbmNsdXNpb24gXHUyMDE0IGxpc3QgaXMgb3JkZXItbGV2ZWwgb25seS4gV2UgbWFwIHRvIFByb2NlZHVyZVxuLy8gKGFuIGV4YW0gd2FzIHBlcmZvcm1lZCkgcmF0aGVyIHRoYW4gRGlhZ25vc3RpY1JlcG9ydCAod2hpY2ggbmVlZHMgYVxuLy8gbmFycmF0aXZlKS4gSWYvd2hlbiB3ZSBmZXRjaCB0aGUgYWN0dWFsIHJlcG9ydCB0aGlzIGJlY29tZXMgYSBEUi5cbi8vIElIS0UzNDA4UzAyIGRldGFpbCBwcm92aWRlcyB0aGUgZnVsbCByYWRpb2xvZ3kgLyBlbmRvc2NvcHkgcmVwb3J0IGluXG4vLyBgZGVzY2AuIENvbWJpbmVkIHdpdGggb3JkZXJfTkFNRSArIHRoZSBleGFtIGRhdGUgdGhpcyBpcyBhIHByb3BlciBGSElSXG4vLyBEaWFnbm9zdGljUmVwb3J0LiBMaXN0LW9ubHkgZW50cmllcyAod2hlcmUgdGhlIGRldGFpbCBmZXRjaCByZXR1cm5lZFxuLy8gbm8gYGRlc2NgKSBnZXQgZHJvcHBlZCBcdTIwMTQgd2l0aG91dCBhIG5hcnJhdGl2ZSB0aGUgcmVwb3J0IG1hcHBlciB3b3VsZFxuLy8gcmVqZWN0IHRoZW0gYW55d2F5LlxuLy9cbi8vIERhdGUgZmllbGQgY2hvaWNlIFx1MjAxNCBJSEtFMzQwOFMwMiBkZXRhaWwgcGF5bG9hZCBleHBvc2VzOlxuLy8gICAtIHJlYWxfSU5TUEVDVF9EQVRFICBcdTVCRTZcdTk2OUJcdTYzQTFcdTZBQTIvXHU1MDVBXHU1RjcxXHU1MENGXHU2NUU1IChtb3N0IGFjY3VyYXRlIHdoZW4gcHJlc2VudClcbi8vICAgLSBmdW5jX0RBVEUgICAgICAgICAgXHU1QzMxXHU4QTNBL1x1NTE2NVx1OTY2Mlx1NjVFNSAodmlzaXQgYW5jaG9yKVxuLy8gICAtIGFzc2F5X1VQTE9BRF9EQVRFICBcdTU4MzFcdTU0NEFcdTRFMEFcdTUwQjNcdTY2NDJcdTk1OTMgKG9mdGVuIHdlZWtzIGFmdGVyIHRoZSBleGFtIFx1MjAxNFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBiZWxvbmdzIHRvIERpYWdub3N0aWNSZXBvcnQuaXNzdWVkLCBOT1Rcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWZmZWN0aXZlRGF0ZVRpbWUpXG4vLyBJbiBwcmFjdGljZSByZWFsX0lOU1BFQ1RfREFURSBpcyBvZnRlbiBudWxsIG9uIHRoZSBTMDIgZGV0YWlsXG4vLyAoY29uZmlybWVkIGFnYWluc3QgbGl2ZSBOSEkgcGF5bG9hZHMpOyB3ZSB0aGVuIGZhbGwgYmFjayB0b1xuLy8gZnVuY19EQVRFIHJhdGhlciB0aGFuIHRoZSB1cGxvYWQgdGltZS4gRmFsbGluZyBiYWNrIHRvIHRoZVxuLy8gdXBsb2FkIGRhdGUgd291bGQgbGFuZCB0aGUgZXhhbSBpbiBhIGRhdGUgdGhhdCdzIGV2ZW4gZnVydGhlclxuLy8gZnJvbSByZWFsaXR5IChlLmcuIENUIGRvbmUgMjAyNi8wMS8xNCwgdXBsb2FkIDIwMjYvMDIvMjQgXHUyMTkyIHVzaW5nXG4vLyB1cGxvYWQgZGF0ZSB3b3VsZCBzYXkgXCJoYWQgYSBDVCBvbiAyMDI2LzAyLzI0XCIgd2hpY2ggaXMgd3JvbmcpLlxuLy8gZnVuY19EQVRFIGF0IHdvcnN0IG1lYW5zIFwiZXhhbSBoYXBwZW5lZCBkdXJpbmcgdGhpcyBhZG1pc3Npb25cIi5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKFxuICAgIGl0ZW0ucmVhbF9JTlNQRUNUX0RBVEUgfHwgaXRlbS5yZWFsX2luc3BlY3RfZGF0ZSB8fFxuICAgIGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIsXG4gICk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChpdGVtLm9yZGVyX05BTUUgfHwgaXRlbS5vcmRlcl9uYW1lIHx8IFwiXCIpO1xuICBjb25zdCBjb25jbHVzaW9uID0gKGl0ZW0uZGVzYyB8fCBcIlwiKS50cmltKCk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSB8fCAhY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBpdGVtLm9yZGVyX0NPREUgfHwgaXRlbS5vcmRlcl9jb2RlIHx8IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgY2F0ZWdvcnk6IFwiUkFEXCIsXG4gICAgY29uY2x1c2lvbixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAvLyBOSEkgc2VwYXJhdGVzIHRoZSBleGFtIGRhdGUgKGZ1bmNfREFURSkgZnJvbSB0aGUgcmVwb3J0LXVwbG9hZFxuICAgIC8vIHRpbWVzdGFtcCAoYXNzYXlfVVBMT0FEX0RBVEUpLiBUaGUgbGF0dGVyIGlzIHdoZW4gdGhlIHJlcG9ydFxuICAgIC8vIHdhcyBmaW5hbGlzZWQgaW4gTkhJJ3Mgc3lzdGVtIFx1MjAxNCBtYXBzIHRvIERpYWdub3N0aWNSZXBvcnQuaXNzdWVkLlxuICAgIC8vIEZhbGxzIGJhY2sgdG8gTm9uZSBpZiBOSEkgZGlkbid0IHNoaXAgb25lLlxuICAgIGlzc3VlZDogcm9jVG9JU08oKGl0ZW0uYXNzYXlfVVBMT0FEX0RBVEUgfHwgXCJcIikuc3BsaXQoL1xccysvKVswXSksXG4gIH07XG59XG4iLCAiLy8gTkhJIEFQSSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgd2hhdCB3ZSBmZXRjaCwgd2hlcmUgZWFjaCByb3cgZ29lcyxcbi8vIHdoaWNoIGFkYXB0ZXIgdG8gY2FsbCBvbiBpdC5cbi8vXG4vLyBFeHRyYWN0ZWQgZnJvbSBiYWNrZ3JvdW5kLmpzIHNvIHdlIGNhbjpcbi8vICAgMS4gVW5pdC10ZXN0IFwiZXZlcnkgZW5kcG9pbnQgbmFtZSBoYXMgYSBDaGluZXNlIGxhYmVsXCIgXHUyMDE0IGhpc3RvcmljYWxseVxuLy8gICAgICBpdCB3YXMgZWFzeSB0byBhZGQgYSBuZXcgZW5kcG9pbnQgYW5kIGZvcmdldCB0byB1cGRhdGVcbi8vICAgICAgRU5EUE9JTlRfTEFCRUxfWkgsIGxlYXZpbmcgdGhlIHBvcHVwJ3MgXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwIHJvdyBsYWJlbGxlZCB3aXRoXG4vLyAgICAgIHRoZSBkZXYtZmxhdm91cmVkIHJhdyBrZXkgKFwib3RoZXJfbGFic1wiIGluc3RlYWQgb2YgXCJcdTZBQTJcdTlBNTdcIikuXG4vLyAgIDIuIEtlZXAgYmFja2dyb3VuZC5qcyBmb2N1c2VkIG9uIGZsb3cgY29udHJvbCArIHRhYi9JTyBsb2dpYy5cbi8vXG4vLyBBZGFwdGVyIHJlZmVyZW5jZXMgbGl2ZSBpbiAuL25oaS1hZGFwdGVycy5qcy4gU2VlIHRoYXQgbW9kdWxlIGZvciB0aGVcbi8vIHBlci1hZGFwdGVyIGZpZWxkLXByaW9yaXR5IGRlY2lzaW9ucyAoZGF0ZSBzZWxlY3Rpb24sIG5hbWUgZmFsbGJhY2tzLFxuLy8gYmlsaW5ndWFsIHNwbGl0dGluZywgZXRjLikuXG5cbmltcG9ydCB7XG4gIGFkYXB0QWR1bHRQcmV2ZW50aXZlLFxuICBhZGFwdEFsbGVyZ3ksXG4gIGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyxcbiAgYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSxcbiAgYWRhcHRJbWFnaW5nTGlzdFN0dWIsXG4gIGFkYXB0SW5wYXRpZW50RW5jb3VudGVyLFxuICBhZGFwdExhYkl0ZW0sXG4gIGFkYXB0TWVkaWNhdGlvbixcbiAgYWRhcHRQcm9jZWR1cmUsXG59IGZyb20gXCIuL25oaS1hZGFwdGVycy5qc1wiO1xuXG4vLyBVc2VyLWZhY2luZyBsYWJlbCBmb3IgZWFjaCBlbmRwb2ludCBuYW1lLiBUaGUgYnJlYWtkb3duIGNvbGxhcHNpYmxlXG4vLyBpbiB0aGUgcG9wdXAgKFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIpIHJlYWRzIGZyb20gdGhpcyBzbyB1c2VycyBzZWUgXCJcdTVDMzFcdTkxQUIgMTIgXHU3QjQ2XCJcbi8vIGluc3RlYWQgb2YgdGhlIGRldi1mbGF2b3VyZWQgXCJlbmNvdW50ZXJzPTEyLzEyXCIuIFVua25vd24gbmFtZXMgZmFsbFxuLy8gdGhyb3VnaCB0byB0aGUgcmF3IGtleSwgd2hpY2gga2VlcHMgaXQgb2J2aW91cyBkdXJpbmcgZGV2ZWxvcG1lbnRcbi8vIHdoZW4gd2UgYWRkIGEgbmV3IGVuZHBvaW50IGFuZCBoYXZlbid0IGxhYmVsbGVkIGl0IHlldC5cbmV4cG9ydCBjb25zdCBFTkRQT0lOVF9MQUJFTF9aSCA9IHtcbiAgZW5jb3VudGVyczogXCJcdTVDMzFcdTkxQUJcIixcbiAgaW5wYXRpZW50OiBcIlx1NEY0Rlx1OTY2MlwiLFxuICBpbnBhdGllbnRfbGVnYWN5OiBcIlx1NEY0Rlx1OTY2Mlx1RkYwOFx1ODIwQVx1RkYwOVwiLFxuICBwcm9jZWR1cmVzOiBcIlx1NjI0Qlx1ODg1MyAvIFx1ODY1NVx1N0Y2RVwiLFxuICBtZWRpY2F0aW9uczogXCJcdTg2NTVcdTY1QjlcdTg1RTVcdTU0QzFcIixcbiAgYWxsZXJnaWVzOiBcIlx1ODVFNVx1NzI2OVx1OTA0RVx1NjU0RlwiLFxuICBhbGxlcmdpZXNfYjogXCJcdTg1RTVcdTcyNjlcdTkwNEVcdTY1NEZcdUZGMDhCXHVGRjA5XCIsXG4gIGFkdWx0X3ByZXZlbnRpdmU6IFwiXHU2MjEwXHU0RUJBXHU1MDY1XHU2QUEyXCIsXG4gIGNhbmNlcl9zY3JlZW5pbmc6IFwiXHU3NjRDXHU3NUM3XHU3QkU5XHU2QUEyXCIsXG4gIGltYWdpbmc6IFwiXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XCIsXG4gIG90aGVyX2xhYnM6IFwiXHU2QUEyXHU5QTU3XCIsXG4gIGNhdGFzdHJvcGhpY19pbGxuZXNzOiBcIlx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNVwiLFxufTtcblxuLy8gcGFnZV90eXBlIFx1MjE5MiBiYWNrZW5kIHBhZ2VfdHlwZSBzdHJpbmcgdXNlZCBieSBtYXBwZXJzLlxuLy8gcGF0aCBpcyByZWxhdGl2ZSB0byBuaGlCYXNlLiBtZXRob2QgZGVmYXVsdCBcIkdFVFwiLlxuLy8gYHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlYCA9IGVuZHBvaW50IGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGluIFx1NkMxMVx1NTcwQiBmb3JtYXQuXG4vLyBDb25maXJtZWQgdmlhIFVSTHMgb2JzZXJ2ZWQgaW4gTkhJJ3MgU1BBLiBPdGhlciBlbmRwb2ludHMgZWl0aGVyIGRvbid0XG4vLyBhY2NlcHQgcmFuZ2UgcGFyYW1zLCBvciBOSEkgcmVqZWN0cyB1bmtub3duIHBhcmFtcyBcdTIwMTQgd2UgbGVhdmUgdGhlbSBhbG9uZVxuLy8gKHRoZXkgZmFsbCBiYWNrIHRvIHRoZWlyIGRlZmF1bHQgd2luZG93LCB0eXBpY2FsbHkgMS0yIHllYXJzKS5cbmV4cG9ydCBjb25zdCBOSElfQVBJX0VORFBPSU5UUyA9IFtcbiAgLy8gZW5jb3VudGVycyAvIHByb2NlZHVyZXMgZG9uJ3QgaGF2ZSBhIC9zZWFyY2ggdmFyaWFudCAoNDA0KS4gcGFnZV9sb2FkXG4gIC8vIHNpbGVudGx5IGlnbm9yZXMgc19kYXRlIC8gZV9kYXRlIFx1MjAxNCB2ZXJpZmllZCB0aGUgYXJyYXkgbGVuZ3RoIGlzXG4gIC8vIGlkZW50aWNhbCB3aXRoIG9yIHdpdGhvdXQgZGF0ZXMuIERhdGUgZmlsdGVyIGlzIGVmZmVjdGl2ZWx5IHVuc3VwcG9ydGVkXG4gIC8vIGZvciB0aGVzZSBlbmRwb2ludHM7IHRoZXkgcmV0dXJuIGFsbCBkYXRhIGluIE5ISSdzIGxpZmV0aW1lIHdpbmRvdy5cbiAgLy8gRW5jb3VudGVyIHNvdXJjZTogSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkuIFRoZSAvcGFnZV9sb2FkIHZhcmlhbnRcbiAgLy8gaXMgd2luZG93LWxpbWl0ZWQgdG8gfjEgeWVhciAocmV0dXJuZWQgNTEgdmlzaXRzIGVuZGluZyAxMTQvMDUpO1xuICAvLyAvc2VhcmNoIGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGFuZCBnb2VzIGJhY2sgZnVydGhlciAoMTYyIHZpc2l0c1xuICAvLyB0byAxMTIvMDUgZm9yIHRoZSBzYW1lIHBhdGllbnQpLiBTaW5jZSBsYWJzL21lZHMgZXh0ZW5kIHRvIDN5IHZpYVxuICAvLyB0aGVpciBvd24gL3NlYXJjaCBlbmRwb2ludHMsIGVuY291bnRlciBNVVNUIGFsc28gdXNlIC9zZWFyY2ggb3JcbiAgLy8gdGhlIChob3NwaXRhbCwgZGF0ZSkgbGlua2VyIGhhcyBub3RoaW5nIHRvIG1hdGNoIGFnYWluc3QgZm9yIG9sZGVyXG4gIC8vIGxhYiBkYXRlcy5cbiAgeyBuYW1lOiBcImVuY291bnRlcnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAzczAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT1cIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElucGF0aWVudCAoXHU0RjRGXHU5NjYyKSBcdTIwMTQgSUhLRTMzMDlTMDEgaXMgdGhlIHByaW1hcnkgbGlzdCB3aXRoIGluX0RBVEUvb3V0X0RBVEVcbiAgLy8gc3Bhbi4gSUhLRTMzMDhTMDEgY2FycmllcyBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3JkcyB3aXRoIHRoZVxuICAvLyBzYW1lIGZpZWxkcyAoZnVuY19EQVRFIGluIHNvbWUgcm93cyBpbnN0ZWFkIG9mIGluX0RBVEU7IGFkYXB0ZXJcbiAgLy8gaGFuZGxlcyBib3RoKS4gQm90aCBmZWVkIHRoZSBzYW1lIGVuY291bnRlciBtYXBwZXIuXG4gIHsgbmFtZTogXCJpbnBhdGllbnRcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOXMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJpbnBhdGllbnRfbGVnYWN5XCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOHMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwMXMwNS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0UHJvY2VkdXJlIH0sXG4gIC8vIG1lZGljYXRpb25zOiBwYWdlX2xvYWQgb25seSBhY2NlcHRzIGVtcHR5IGRhdGVzIChIVFRQIDQwMCBvdGhlcndpc2UpLlxuICAvLyBUaGUgL3NlYXJjaCBlbmRwb2ludCBpcyB3aGF0IHRoZSBTUEEgaGl0cyB3aGVuIHVzZXIgcGlja3MgYSBjdXN0b21cbiAgLy8gZGF0ZSByYW5nZSBhbmQgYWNjZXB0cyBJU08gXHU4OTdGXHU1MTQzIGRhdGVzIHdpdGggZGFzaGVzICgyMDIzLTAxLTAxKS5cbiAgLy8gQ29uZmlybWVkIHZpYSBEZXZUb29scyBvYnNlcnZhdGlvbiBvZiB0aGUgXHU3QkU5XHU5MDc4IHBhbmVsIHN1Ym1pdC5cbiAgeyBuYW1lOiBcIm1lZGljYXRpb25zXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA2czAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExJnNfdHlwZT1BXCIsXG4gICAgcGFnZV90eXBlOiBcIm1lZGljYXRpb25zXCIsICAgICAgIGFkYXB0OiBhZGFwdE1lZGljYXRpb24sIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNfYlwiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwNFwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIC8vIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NVx1N0Q1MFx1Njc5QyAoSUhLRTM0MDJTMDEpOiBvbmUgcm93IHBlciBzY3JlZW5pbmcsIGNvbnRhaW5zXG4gIC8vIEJNSSAvIHZpdGFscyAvIGxpcGlkIHBhbmVsIC8gTEZUIC8gUkZUIC8gSGVwIEIvQyAvIHVyaWMgYWNpZCBhbGxcbiAgLy8gcHJlLWNvbXB1dGVkIGJ5IE5ISSdzIHNjcmVlbmluZyBwcm9ncmFtbWUuIGFkYXB0QWR1bHRQcmV2ZW50aXZlXG4gIC8vIHJldHVybnMgYW4gYXJyYXkgKG9uZSBPYnNlcnZhdGlvbiBwZXIgbWVhc3VyZW1lbnQpIHNvIHRoZVxuICAvLyBhZGFwdGVyLWNhbGwgbG9vcCBmbGF0dGVucyBpdC5cbiAgeyBuYW1lOiBcImFkdWx0X3ByZXZlbnRpdmVcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDAyczAxL1NQX0lIS0UzNDAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdEFkdWx0UHJldmVudGl2ZSB9LFxuICB7IG5hbWU6IFwiY2FuY2VyX3NjcmVlbmluZ1wiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDRzMDEvU1BfSUhLRTM0MDRTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0TGFiSXRlbSB9LFxuICAvLyBnbHVjb3NlIChJSEtFMzQwNlMwMSkgKyBsaXBpZCAoSUhLRTM0MDdTMDEpIGFyZSBzdWJzZXRzIG9mXG4gIC8vIG90aGVyX2xhYnMgKElIS0UzNDA5UzAxKSBwZXIgTkhJJ3MgZGF0YSBtb2RlbCBcdTIwMTQgZmV0Y2hpbmcgdGhlbVxuICAvLyBzZXBhcmF0ZWx5IGp1c3QgY3JlYXRlcyBkdXAgb2JzZXJ2YXRpb25zLCBzbyB3ZSBza2lwIHRoZW0uXG4gIC8vIEltYWdpbmcgbGlzdCAoSUhLRTM0MDhTMDEpIG9ubHkgY2FycmllcyBvcmRlci1sZXZlbCBkYXRhOyBmdWxsXG4gIC8vIG5hcnJhdGl2ZSByZXBvcnQgbGl2ZXMgYXQgSUhLRTM0MDhTMDIuIFdlIGRvIGEgMi1zdGVwIGZldGNoIChzZWVcbiAgLy8gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYikgdG8gZ3JhYiB0aGUgcmVwb3J0LCB0aGVuIG1hcCB0byBhIHJlYWxcbiAgLy8gRGlhZ25vc3RpY1JlcG9ydC4gVGhlIGxpc3QgYWRhcHRlciBpcyBhIG5vLW9wIHN0dWIgbGlrZSBtZWRpY2F0aW9ucy5cbiAgLy8gaW1hZ2luZzogc2VhcmNoIGVuZHBvaW50IGFjY2VwdHMgSVNPIGRhdGUgcmFuZ2UgbGlrZSBtZWRpY2F0aW9ucy5cbiAgeyBuYW1lOiBcImltYWdpbmdcIiwgICAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA4czAxL3NlYXJjaD9zX3R5cGU9JnNfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTFcIixcbiAgICBwYWdlX3R5cGU6IFwiZGlhZ25vc3RpY19yZXBvcnRzXCIsIGFkYXB0OiBhZGFwdEltYWdpbmdMaXN0U3R1Yiwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbiAgLy8gb3RoZXJfbGFicyBhbHJlYWR5IHVzZXMgL3NlYXJjaDsgc2FtZSBJU08tZGFzaCBkYXRlIGZvcm1hdCB3b3Jrcy5cbiAgeyBuYW1lOiBcIm90aGVyX2xhYnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA5czAxL3NlYXJjaD9zX3R5cGU9JnNfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0TGFiSXRlbSwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbiAgLy8gSUhLRTMyMDlTMDEgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSkgXHUyMDE0IE5ISS12ZXR0ZWQgY2F0YXN0cm9waGljLWlsbG5lc3MgcmVnaXN0cnkuXG4gIC8vIEVhY2ggcm93IFx1MjE5MiBhIEZISVIgQ29uZGl0aW9uIHdpdGggY2F0ZWdvcnk9cHJvYmxlbS1saXN0LWl0ZW0sIHRoZVxuICAvLyBjbG9zZXN0IFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBlcXVpdmFsZW50IHRvIGEgY3VyYXRlZCBwcm9ibGVtIGxpc3QuIEVuZHBvaW50XG4gIC8vIGRvZXNuJ3QgYWNjZXB0IGRhdGUgcGFyYW1zIChOSEkgcmV0dXJucyBjdXJyZW50bHktdmFsaWQgY2VydHMgb25seSkuXG4gIHsgbmFtZTogXCJjYXRhc3Ryb3BoaWNfaWxsbmVzc1wiLCBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMyMDlzMDEvU1BfSUhLRTMyMDlTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwiY29uZGl0aW9uc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyB9LFxuXTtcbiIsICIvLyBTZXJ2aWNlIHdvcmtlciBmb3IgTkhJLUZISVIgQnJpZGdlIFx1MjAxNCBvd25zIHRoZSBsb25nLXJ1bm5pbmdcbi8vIFwiU3luYyBUaGlzIFBhdGllbnRcIiB3b3JrZmxvdyBzbyB0aGUgcG9wdXAgY2FuIGNsb3NlIG1pZC1zeW5jIHdpdGhvdXRcbi8vIGFib3J0aW5nIGl0LlxuLy9cbi8vIExpZmVjeWNsZTpcbi8vICAgLSBwb3B1cCBwb3N0cyB7dHlwZTogXCJzdGFydE5oaUFwaVN5bmNcIiwgcGF5bG9hZH0gIFx1MjE5MiBOSEkgSlNPTi1BUEkgc3luY1xuLy8gICAtIGJhY2tncm91bmQgcnVucyB0aGUgZnVsbCBzeW5jIHNlcXVlbmNlLCB1cGRhdGluZyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gICAtIHBvcHVwIHJlYWRzIGNocm9tZS5zdG9yYWdlLmxvY2FsIG9uIHJlb3BlbiB0byBzaG93IHByb2dyZXNzXG4vL1xuLy8gTW9kZXM6XG4vLyAgIC0gXCJsb2NhbFwiICAgXHUyMTkyIGFmdGVyIE5ISSBmZXRjaCwgcnVuIG1hcHBlcnMgaW4tZXh0ZW5zaW9uLCBkb3dubG9hZCBhXG4vLyAgICAgICAgICAgICAgICAgRkhJUiBCdW5kbGUgdG8gdGhlIHVzZXIncyBtYWNoaW5lLiBObyBiYWNrZW5kIHJlcXVpcmVkLlxuLy8gICAtIFwiYmFja2VuZFwiIFx1MjE5MiBQT1NUIHBlci1wYWdlX3R5cGUgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRcbi8vICAgICAgICAgICAgICAgICAoZXhpc3RpbmcgYmVoYXZpb3VyKTsgZGFzaGJvYXJkICsgU01BUlQgYXBwIHVzZSB0aGVcbi8vICAgICAgICAgICAgICAgICBiYWNrZW5kJ3MgRkhJUiBzdG9yZS5cblxuaW1wb3J0IHtcbiAgR1JPVVBfSEFORExFUlMsXG4gIExJU1RfSEFORExFUlMsXG4gIGRlZHVwQWRtaXNzaW9uRGF5QW1iLFxuICBkZXJpdmVQYXRpZW50SWQsXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMsXG4gIG1hcFBhdGllbnQsXG4gIG1hc2tJZCxcbiAgbWFza05hbWUsXG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzLFxufSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcbmltcG9ydCB7XG4gIC8vIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UgaXMgaW52b2tlZCBkaXJlY3RseSBmcm9tIHRoZVxuICAvLyBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dCAob3ZlcnJpZGVzIHRoZSByZWdpc3RyeSdzIGNsYXNzSGludFxuICAvLyB3aXRoIFx1NjAyNVx1OEEzQS9cdTRGNEZcdTk2NjIgZGVyaXZlZCBmcm9tIHRoZSBkZXRhaWwgYm9keSksIHNvIGl0IG5lZWRzIHRvIGJlXG4gIC8vIGEgbmFtZWQgaW1wb3J0IFx1MjAxNCBub3Qgb25seSByZWFjaGFibGUgdmlhIE5ISV9BUElfRU5EUE9JTlRTW2ldLmFkYXB0LlxuICAvLyBGb3JnZXR0aW5nIHRoaXMgcmUtaW1wb3J0IGFmdGVyIGV4dHJhY3RpbmcgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5XG4gIC8vIGluIHYwLjYuMyBzaGlwcGVkIGEgUmVmZXJlbmNlRXJyb3IgdGhhdCBvbmx5IGZpcmVkIGluIHByb2R1Y3Rpb25cbiAgLy8gc3luY3Mgd2l0aCBub24tZW1wdHkgZW5jb3VudGVycy4gVGVzdHMgZG9uJ3QgZXhlcmNpc2UgdGhhdCBwYXRoXG4gIC8vIFx1MjAxNCBzZWUgVE9ET19GT0xMT1dVUCBmb3IgYSBTVy1mbG93IGludGVncmF0aW9uIHRlc3QgaWRlYS5cbiAgYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSxcbiAgYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCxcbiAgYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbCxcbiAgaXNvVG9ST0MsXG4gIHBpY2tFbmdsaXNoLFxuICByb2NUb0lTTyxcbn0gZnJvbSBcIi4vbmhpLWFkYXB0ZXJzLmpzXCI7XG5pbXBvcnQgeyBFTkRQT0lOVF9MQUJFTF9aSCwgTkhJX0FQSV9FTkRQT0lOVFMgfSBmcm9tIFwiLi9uaGktZW5kcG9pbnRzLmpzXCI7XG5cbmNvbnN0IFNUT1JBR0VfS0VZID0gXCJzeW5jU3RhdHVzXCI7XG5jb25zdCBzbGVlcCA9IChtcykgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKTtcblxuLy8gQ2FuY2VsbGF0aW9uIGZsYWcgc2V0IGJ5IHBvcHVwJ3Mgc3RvcCBidXR0b24uIENoZWNrZWQgYXQgc3RyYXRlZ2ljIHBvaW50c1xuLy8gaW4gcnVuTmhpQXBpU3luYyAoYmV0d2VlbiBwaGFzZXMsIGJlZm9yZSBlYWNoIGRldGFpbCBwYWdlKSBzbyB0aGVcbi8vIGluLXByb2dyZXNzIHN5bmMgZXhpdHMgcHJvbXB0bHkgd2hlbiB0aGUgdXNlciBoaXRzIFN0b3AuIENsZWFyZWQgYXQgdGhlXG4vLyBzdGFydCBvZiBlYWNoIG5ldyBzeW5jIHJ1bi5cbmxldCBfY2FuY2VsbGVkID0gZmFsc2U7XG4vLyBDb250ZXh0IGZvciB0aGUgaW4tZmxpZ2h0IHN5bmMgc28gdGhlIHN0b3BTeW5jIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuLy8gZGF0YSB3aXRob3V0IHRoZSBwb3B1cCBuZWVkaW5nIHRvIHBhc3MgaXQgYmFjay4gU2V0IGF0IHRoZSB0b3Agb2Zcbi8vIHJ1bk5oaUFwaVN5bmM7IGNsZWFyZWQgb24gY29tcGxldGlvbiAoc3VjY2Vzcy9mYWlsdXJlL2NhbmNlbCkuXG5sZXQgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xuY29uc3QgQ0FOQ0VMX0VSUk9SID0gXCJfX1NZTkNfQ0FOQ0VMTEVEX19cIjtcbi8vIFRocm93biB3aGVuIE5ISSBkZXRlY3RzIHRoZSBzZXNzaW9uIGhhcyBleHBpcmVkIChsb2dpbiBwYWdlIHJlbmRlcmVkLCBvclxuLy8gdGFiIHJlZGlyZWN0ZWQgdG8gYXV0aCBuYW1lc3BhY2UpLiBBYm9ydHMgc3luYyBpbW1lZGlhdGVseSBzbyB0aGUgdXNlciBjYW5cbi8vIHJlLWxvZ2luIGFuZCByZXRyeSBpbnN0ZWFkIG9mIHRpbWluZyBvdXQgb24gZXZlcnkgcmVtYWluaW5nIHBhZ2UuXG5jb25zdCBTRVNTSU9OX0VYUElSRURfRVJST1IgPSBcIl9fU0VTU0lPTl9FWFBJUkVEX19cIjtcbi8vIEVycm9ycyB0aGF0IHNob3VsZCBhYm9ydCB0aGUgZW50aXJlIHN5bmMgaW5zdGVhZCBvZiBiZWluZyBzd2FsbG93ZWRcbi8vIHBlci1waGFzZS5cbmNvbnN0IEFCT1JUX0VSUk9SUyA9IG5ldyBTZXQoW0NBTkNFTF9FUlJPUiwgU0VTU0lPTl9FWFBJUkVEX0VSUk9SXSk7XG5mdW5jdGlvbiBjaGVja0NhbmNlbCgpIHtcbiAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRTdGF0dXMocGFydGlhbCkge1xuICAvLyBBZnRlciBjYW5jZWxsYXRpb24sIHRoZSBwb3B1cCBoYXMgYWxyZWFkeSB3cml0dGVuIHRoZSBkZWZpbml0aXZlXG4gIC8vIFwic3RvcHBlZFwiIHN0YXR1cyBcdTIwMTQgc2lsZW5jZSBhbnkgZnVydGhlciBwcm9ncmVzcyB3cml0ZXMgZnJvbSB0aGVcbiAgLy8gaW4tZmxpZ2h0IHN5bmMgY29kZSBzbyB0aGUgVUkgZG9lc24ndCBib3VuY2Ugd2hpbGUgaXQgdW53aW5kcy5cbiAgaWYgKF9jYW5jZWxsZWQpIHJldHVybjtcbiAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gIGNvbnN0IG5leHQgPSB7IC4uLnByZXYsIC4uLnBhcnRpYWwsIHRzOiBEYXRlLm5vdygpIH07XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IG5leHQgfSk7XG4gIC8vIEJyb2FkY2FzdCB0byBhbnkgb3BlbiBwb3B1cC4gSWYgbm8gbGlzdGVuZXIgKHBvcHVwIGNsb3NlZCksXG4gIC8vIHNlbmRNZXNzYWdlIHJlamVjdHMgXHUyMDE0IHN3YWxsb3cuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzeW5jUHJvZ3Jlc3NcIiwgc3RhdHVzOiBuZXh0IH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIE5ISSBBUEktZGlyZWN0IHN5bmMgKHBhcmFsbGVsLCBubyBMTE0pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEluc3RlYWQgb2YgbmF2aWdhdGluZyB0aGUgdXNlcidzIHRhYiB0byBlYWNoIE5ISSBwYWdlLCB3YWl0aW5nIGZvciBWdWUgdG9cbi8vIHJlbmRlciwgY2FwdHVyaW5nIEhUTUwsIHRoZW4gc2VuZGluZyBpdCB0aHJvdWdoIExMTSBleHRyYWN0aW9uLCB3ZSBjYWxsXG4vLyBOSEkncyB1bmRlcmx5aW5nIEpTT04gQVBJIGVuZHBvaW50cyBkaXJlY3RseS4gVGhlIFx1NTA2NVx1NEZERFx1N0Y3MiBTUEEgZnJvbnRzIGEgc2V0XG4vLyBvZiBSRVNUIGVuZHBvaW50cyB1bmRlciAvYXBpL2loa2UzMDAwLzxwYWdlPi8qIHRoYXQgcmV0dXJuIHdlbGwtZm9ybWVkXG4vLyBKU09OOyBjYWxsaW5nIHRoZW0gaW4gcGFyYWxsZWwgY3V0cyBhIDUtMTAgbWludXRlIHN5bmMgdG8gfjEwIHNlY29uZHMgYW5kXG4vLyByZW1vdmVzIHRoZSBMTE0gY29zdCBlbnRpcmVseS5cblxuY29uc3QgTkhJX0hPU1QgPSBcIm15aGVhbHRoYmFuay5uaGkuZ292LnR3XCI7XG5cblxuLy8gTkhJIEpTT04gYWRhcHRlcnMgKyBkYXRlL3N0cmluZyBoZWxwZXJzIGxpdmUgaW4gLi9uaGktYWRhcHRlcnMuanNcbi8vIHNvIHRoZXkgY2FuIGJlIHVuaXQtdGVzdGVkIGluIGlzb2xhdGlvbiAoYmFja2dyb3VuZC5qcyBjYW4ndCBiZVxuLy8gbG9hZGVkIHVuZGVyIHZpdGVzdCBcdTIwMTQgY2hyb21lLiogQVBJcywgU1cgZ2xvYmFscykuIFNlZSB0aGF0IG1vZHVsZVxuLy8gZm9yIHRoZSBmaWVsZC1wcmlvcml0eSBkZWNpc2lvbnMgcGVyIGFkYXB0ZXIuXG4vL1xuLy8gVGhlIE5ISSBBUEkgZW5kcG9pbnQgcmVnaXN0cnkgKyBcdTRFMkRcdTY1ODcgbGFiZWwgbWFwcGluZyBsaXZlIGluXG4vLyAuL25oaS1lbmRwb2ludHMuanMgXHUyMDE0IGV4dHJhY3RlZCBzbyBhIHVuaXQgdGVzdCBjYW4gZ3VhcmFudGVlIGV2ZXJ5XG4vLyBlbmRwb2ludCBuYW1lIGhhcyBhIGxhYmVsICh3ZSB1c2VkIHRvIHNoaXAgcmF3IHBhZ2VfdHlwZSBrZXlzIGxpa2Vcbi8vIFwib3RoZXJfbGFic1wiIGludG8gdGhlIHBvcHVwJ3MgXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwIHdoZW4gc29tZW9uZSBmb3Jnb3QgdG9cbi8vIHJlZ2lzdGVyIHRoZSBDaGluZXNlIHZlcnNpb24pLlxuXG4vLyBBcHBseSBhIHtzdGFydCwgZW5kfSBJU08gZGF0ZSByYW5nZSB0byBhbiBlbmRwb2ludCBwYXRoOlxuLy8gICAtIElmIHBhdGggYWxyZWFkeSBoYXMgc19kYXRlPSBwbGFjZWhvbGRlcnMsIGZpbGwgdGhlbSBpbi5cbi8vICAgLSBPdGhlcndpc2UgYXBwZW5kIHNfZGF0ZT0uLi4mZV9kYXRlPS4uLiB0byB0aGUgcXVlcnkgc3RyaW5nLlxuLy8gRW5kcG9pbnRzIHdpdGhvdXQgYHN1cHBvcnRzRGF0ZVJhbmdlYCBwYXNzIHRocm91Z2ggdW5jaGFuZ2VkLlxuZnVuY3Rpb24gYXBwbHlEYXRlUmFuZ2VUb1BhdGgocGF0aCwgZGF0ZVJhbmdlKSB7XG4gIGlmICghZGF0ZVJhbmdlIHx8ICghZGF0ZVJhbmdlLnN0YXJ0ICYmICFkYXRlUmFuZ2UuZW5kKSkgcmV0dXJuIHBhdGg7XG4gIC8vIE5ISSBleHBlY3RzIFx1ODk3Rlx1NTE0MyBJU08gZGF0ZXMgd2l0aCBkYXNoZXM6IDIwMjMtMDEtMDEgKG5vdCBcdTZDMTFcdTU3MEIsIG5vdFxuICAvLyBzbGFzaGVzKS4gQ29uZmlybWVkIGJ5IG9ic2VydmluZyB0aGUgU1BBJ3MgcmVxdWVzdCB3aGVuIHVzZXIgcGlja3NcbiAgLy8gYSBjdXN0b20gZGF0ZSByYW5nZS4gVVJMLWVuY29kaW5nIHRoZSBkYXNoZXMgaXMgdW5uZWNlc3NhcnkuXG4gIGNvbnN0IHMgPSAoZGF0ZVJhbmdlLnN0YXJ0IHx8IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgY29uc3QgZSA9IChkYXRlUmFuZ2UuZW5kIHx8IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgbGV0IHAgPSBwYXRoO1xuICBpZiAoL1s/Jl1zX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1zX2RhdGU9KVteJl0qLywgYCQxJHtzfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gKHAuaW5jbHVkZXMoXCI/XCIpID8gXCImXCIgOiBcIj9cIikgKyBgc19kYXRlPSR7c31gO1xuICB9XG4gIGlmICgvWz8mXWVfZGF0ZT0vLnRlc3QocCkpIHtcbiAgICBwID0gcC5yZXBsYWNlKC8oWz8mXWVfZGF0ZT0pW14mXSovLCBgJDEke2V9YCk7XG4gIH0gZWxzZSB7XG4gICAgcCArPSBgJmVfZGF0ZT0ke2V9YDtcbiAgfVxuICByZXR1cm4gcDtcbn1cblxuLy8gRmFuIG91dCBJSEtFMzMwNlMwMiBkZXRhaWwgZmV0Y2hlcyBpbnNpZGUgdGhlIE5ISSB0YWIgc28gY29va2llcyArIEpXVFxuLy8gYXV0aCBmbG93IG5hdHVyYWxseS4gV2UgcGFzcyB0aGUgdmlzaXQgbGlzdCAoanVzdCByb3dfSURzICsgdGhlaXIgcGFyZW50XG4vLyBmaWVsZHMgbmVlZGVkIGZvciBhZGFwdGF0aW9uKSBpbnRvIHRoZSB0YWI7IHRoZSB0YWIgcmV0dXJucyBwYXJhbGxlbFxuLy8gZmV0Y2hlZCBib2RpZXM7IHdlIGFkYXB0IGJhY2sgaW4gdGhlIFNXLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoTWVkaWNhdGlvbkRldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICAvLyBLZWVwIHBhcmVudCBmaWVsZHMgbmVlZGVkIGJ5IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwuXG4gICAgICBwYXJlbnQ6IHtcbiAgICAgICAgZnVuY19EQVRFOiB2LmZ1bmNfREFURSB8fCB2LmZ1bmNfZGF0ZSB8fCBcIlwiLFxuICAgICAgICBpY2Q5Y21fQ09ERTogdi5pY2Q5Y21fQ09ERSB8fCB2LmljZDljbV9jb2RlIHx8IFwiXCIsXG4gICAgICAgIGljZDljbV9DT0RFX0NOQU1FOiB2LmljZDljbV9DT0RFX0NOQU1FIHx8IHYuaWNkOWNtX25hbWUgfHwgXCJcIixcbiAgICAgICAgaG9zcF9BQkJSOiB2Lmhvc3BfQUJCUiB8fCB2Lmhvc3BfYWJiciB8fCBcIlwiLFxuICAgICAgfSxcbiAgICB9KSlcbiAgICAuZmlsdGVyKChyKSA9PiByLnJvd19JRCk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgZnVuYzogYXN5bmMgKGJhc2UsIGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgIGlmICghdG9rZW4pIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICB9XG4gICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICBhc3luYyBmdW5jdGlvbiBmZXRjaE9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtjdHlwZX1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBOSEkgdXNlcyBkaWZmZXJlbnQgY3R5cGUgdmFsdWVzIGZvciBcdTg5N0ZcdTkxQUIvXHU0RTJEXHU5MUFCL1x1NzI1OVx1OTFBQi9cdTg2NTVcdTY1QjlcdTdCOEIuIFdlIGRvbid0XG4gICAgICAvLyBoYXZlIHRoZSBwdWJsaWMgbWFwcGluZywgc28gdHJ5IGN0eXBlIDEuLjQgaW4gb3JkZXIgYW5kIHN0b3AgYXNcbiAgICAgIC8vIHNvb24gYXMgb25lIHJldHVybnMgZHJ1Z3MuIGN0eXBlPTIgY292ZXJlZCBJQ1x1NTM2MSBcdTk1ODBcdThBM0EgaW4gb3VyIHNhbXBsZS5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCkge1xuICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIFsyLCAxLCAzLCA0XSkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaE9uZShyb3dJZCwgY3QpO1xuICAgICAgICAgIGlmIChyLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSByZXR1cm4gcjtcbiAgICAgICAgICBpZiAoci5lcnJvcikgY29udGludWU7XG4gICAgICAgICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Py5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgICAgICAgIGNvbnN0IGhhc0RydWdzID0gbWFpbi5zb21lKCh2KSA9PlxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheSh2Py5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpICYmIHYuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0Lmxlbmd0aCA+IDBcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChoYXNEcnVncykgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm8gY3R5cGUgeWllbGRlZCBkcnVncyBcdTIwMTQgcmV0dXJuIGxhc3Qgc3VjY2Vzc2Z1bCBib2R5IGFueXdheSBzb1xuICAgICAgICAvLyBkaWFnbm9zdGljcyBjYW4gc3RpbGwgc2VlIHRoZSB2aXNpdCBtZXRhZGF0YS5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGZldGNoT25lKHJvd0lkLCAyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IGRydWdzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgZHJ1Z0xpc3QgPSBBcnJheS5pc0FycmF5KHZpc2l0LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCkgPyB2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QgOiBbXTtcbiAgICAgIGZvciAoY29uc3QgZCBvZiBkcnVnTGlzdCkge1xuICAgICAgICBjb25zdCBhZGFwdGVkID0gYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbChkLCB2aXNpdCk7XG4gICAgICAgIGlmIChhZGFwdGVkKSBkcnVncy5wdXNoKGFkYXB0ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZHJ1Z3M7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTM0MDhTMDIgZGV0YWlsIGZldGNoZXMgZm9yIGltYWdpbmcgXHUyMDE0IHNhbWUgcGF0dGVybiBhcyB0aGVcbi8vIG1lZGljYXRpb24gMi1zdGVwLiBjdHlwZSBtaXJyb3JzIHRoZSB2aXNpdCdzIG9yaV9UWVBFIChBIC8gRSAvIFx1MjAyNikuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2KSA9PiAoe1xuICAgICAgcm93X0lEOiB2LnJvd19JRCB8fCB2LnJvd2lkIHx8IHYucm93SUQgfHwgXCJcIixcbiAgICAgIGN0eXBlOiB2Lm9yaV9UWVBFIHx8IHYub3JpX3R5cGUgfHwgXCJBXCIsXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gb25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTM0MDhTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2VuY29kZVVSSUNvbXBvbmVudChjdHlwZSl9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lELCBpdGVtc1tpXS5jdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IHJlcG9ydHMgPSBbXTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgciA9IHJlc3VsdHNbaV07XG4gICAgaWYgKCFyIHx8IHIuZXJyb3IgfHwgIXIuYm9keSkgY29udGludWU7XG4gICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTM0MDhTMDJfbWFpbl9kYXRhIDogW107XG4gICAgZm9yIChjb25zdCB2aXNpdCBvZiBtYWluKSB7XG4gICAgICBjb25zdCBhZGFwdGVkID0gYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCh2aXNpdCk7XG4gICAgICBpZiAoYWRhcHRlZCkgcmVwb3J0cy5wdXNoKGFkYXB0ZWQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVwb3J0cztcbn1cblxuLy8gRmFuIG91dCBJSEtFMzMwM1MwMiBkZXRhaWwgdG8gY2xhc3NpZnkgZWFjaCBJSEtFMzMwM1MwMSB2aXNpdCBhc1xuLy8gQU1CIC8gRU1FUiAvIElNUCBiYXNlZCBvbiBob3NwX0RBVEFfVFlQRV9OQU1FLiBVc2VzID9yaWQ9PHJvd19JRD4mdD1OXG4vLyB3aGVyZSBOIGlzIHRoZSB2aXNpdCB0eXBlIGJ1Y2tldDsgd2UgZG9uJ3Qga25vdyB0aGUgbWFwcGluZyBhIHByaW9yaSxcbi8vIHNvIGZvciBlYWNoIHZpc2l0IHdlIHRyeSB0PTEuLjUgdW50aWwgb25lIHJldHVybnMgbm9uLWVtcHR5IG1haW5fZGF0YS5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaEVuY291bnRlckRldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodiwgaWR4KSA9PiAoeyBpZHgsIHJvd19JRDogdi5yb1dfSUQgfHwgdi5yb3dfSUQgfHwgXCJcIiB9KSlcbiAgICAuZmlsdGVyKChyKSA9PiByLnJvd19JRCk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgZnVuYzogYXN5bmMgKGJhc2UsIGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgIGlmICghdG9rZW4pIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICB9XG4gICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICBhc3luYyBmdW5jdGlvbiBmZXRjaE9uZShyb3dJZCwgdCkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvaWhrZTMzMDNzMDIvcGFnZV9sb2FkP3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JnQ9JHt0fWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0bSA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRtKTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEZvciBlYWNoIHZpc2l0LCBmaW5kIHRoZSBgdGAgdGhhdCByZXR1cm5zIG5vbi1lbXB0eSBkYXRhLiBOSElcbiAgICAgIC8vIHVzZXMgdD0xIGZvciBvdXRwYXRpZW50IFx1ODk3Rlx1OTFBQiwgdD0yIG1heWJlIFx1NjAyNVx1OEEzQS9cdTRFMkRcdTkxQUIsIHQ9MyBcdTRGNEZcdTk2NjIsXG4gICAgICAvLyB0PTQgXHU3MjU5XHU5MUFCXHUyMDI2IGRvbid0IGhhdmUgYW4gYXV0aG9yaXRhdGl2ZSBtYXBwaW5nIHNvIHdlIHByb2JlLlxuICAgICAgYXN5bmMgZnVuY3Rpb24gb25lKHJvd0lkKSB7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBbMSwgMiwgMywgNCwgNV0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIHQpO1xuICAgICAgICAgIGlmIChyLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSByZXR1cm4gcjtcbiAgICAgICAgICBpZiAoci5lcnJvcikgY29udGludWU7XG4gICAgICAgICAgY29uc3QgbWFpbiA9IChyLmJvZHk/Lmloa2UzMzAzUzAyX21haW5fZGF0YSkgfHwgW107XG4gICAgICAgICAgaWYgKG1haW4ubGVuZ3RoID4gMCkgcmV0dXJuIHsgYm9keTogci5ib2R5LCB0IH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgYm9keTogbnVsbCB9O1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd3MgPSBbXTtcbiAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQyAmJiB3IDwgaXRlbXMubGVuZ3RoOyB3KyspIHdzLnB1c2god29ya2VyKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod3MpO1xuICAgICAgcmV0dXJuIHsgcmVzdWx0czogb3V0IH07XG4gICAgfSxcbiAgICBhcmdzOiBbYmFzZVVybCwgcmVxc10sXG4gIH0pO1xuXG4gIGlmIChyZXN1bHQ/LmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgLy8gUGFpciBlYWNoIGRldGFpbCBib2R5IGJhY2sgdG8gaXRzIHZpc2l0IHBvc2l0aW9uLlxuICBjb25zdCBieUlkeCA9IG5ldyBNYXAoKTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXFzLmxlbmd0aDsgaSsrKSB7XG4gICAgYnlJZHguc2V0KHJlcXNbaV0uaWR4LCByZXN1bHRzW2ldPy5ib2R5IHx8IG51bGwpO1xuICB9XG4gIHJldHVybiBieUlkeDtcbn1cblxuZnVuY3Rpb24gX2NsYXNzRnJvbVMwMkRldGFpbChib2R5KSB7XG4gIGlmICghYm9keSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG1haW4gPSAoYm9keS5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICBpZiAobWFpbi5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICBjb25zdCB0biA9IFN0cmluZyhtYWluWzBdLmhvc3BfREFUQV9UWVBFX05BTUUgfHwgXCJcIik7XG4gIGlmICh0bi5pbmNsdWRlcyhcIlx1NjAyNVwiKSkgcmV0dXJuIFwiRU1FUlwiOyAgLy8gXHU2MDI1XHU4QTNBXG4gIGlmICh0bi5pbmNsdWRlcyhcIlx1NEY0Rlx1OTY2MlwiKSkgcmV0dXJuIFwiSU1QXCI7XG4gIC8vIFx1ODk3Rlx1OTFBQiAvIFx1NEUyRFx1OTFBQiAvIFx1NzI1OVx1OTFBQiAvIFx1ODVFNVx1NUM0MCBhbGwgZGVmYXVsdCB0byBBTUJcbiAgcmV0dXJuIFwiQU1CXCI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9wb3N0U3RydWN0dXJlZChiYWNrZW5kLCBwYWdlX3R5cGUsIGl0ZW1zLCBzeW5jQXBpS2V5LCBwYXRpZW50T3ZlcnJpZGUpIHtcbiAgY29uc3QgciA9IGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRgLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgIC4uLihzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9KSxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHBhZ2VfdHlwZSxcbiAgICAgIGhvc3Q6IE5ISV9IT1NULFxuICAgICAgaXRlbXMsXG4gICAgICBwYXRpZW50X292ZXJyaWRlOiBwYXRpZW50T3ZlcnJpZGUgfHwgbnVsbCxcbiAgICB9KSxcbiAgfSk7XG4gIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKGBQT1NUIHVwbG9hZC1zdHJ1Y3R1cmVkICR7ci5zdGF0dXN9OiAkeyhhd2FpdCByLnRleHQoKSkuc2xpY2UoMCwgMjAwKX1gKTtcbiAgcmV0dXJuIGF3YWl0IHIuanNvbigpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTG9jYWwgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBSdW5zIHRoZSBzYW1lIG1hcHBlcnMgdGhlIGJhY2tlbmQgcnVucywgdGhlbiB0cmlnZ2VycyBhIGRvd25sb2FkIG9mIHRoZVxuLy8gcmVzdWx0aW5nIEZISVIgQnVuZGxlLiBOb3RoaW5nIGxlYXZlcyB0aGUgdXNlcidzIG1hY2hpbmU7IG5vIGJhY2tlbmRcbi8vIHJlcXVpcmVkLiBNaXJyb3JzIGJhY2tlbmQvdXBsb2FkLXN0cnVjdHVyZWQgb3JkZXI6IGVuY291bnRlcnMgZmlyc3Qgc29cbi8vIHRoYXQgbGlua0VuY291bnRlcnNJblJlc291cmNlcyBjYW4gYXR0YWNoIHJlZmVyZW5jZXMgdG8gZG93bnN0cmVhbVxuLy8gb2JzZXJ2YXRpb25zL21lZGljYXRpb25zL2V0Yy5cblxuY29uc3QgX0xPQ0FMX1BBR0VfVFlQRV9PUkRFUiA9IFtcbiAgXCJlbmNvdW50ZXJzXCIsXG4gIFwib2JzZXJ2YXRpb25zXCIsXG4gIFwibWVkaWNhdGlvbnNcIixcbiAgXCJjb25kaXRpb25zXCIsXG4gIFwiYWxsZXJnaWVzXCIsXG4gIFwiZGlhZ25vc3RpY19yZXBvcnRzXCIsXG4gIFwicHJvY2VkdXJlc1wiLFxuXTtcblxuLy8gQ2hlYXAgcHJlLWZsaWdodDogZG9lcyB0aGlzIE5ISSB0YWIgaGF2ZSBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24/XG4vLyBVc2VzIHRoZSBzYW1lIHNlc3Npb25TdG9yYWdlLnRva2VuICsgbGlnaHR3ZWlnaHQgQVBJIGNhbGwgcGF0dGVybiBhc1xuLy8gX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpLiBEb2Vzbid0IHJldHVybiBhbnl0aGluZyBQSUkgXHUyMDE0IGp1c3QgYVxuLy8gYm9vbGVhbiBmb3IgdGhlIHBvcHVwIHRvIGRlY2lkZSB3aGV0aGVyIHRvIHN1cmZhY2UgYSBcImxvZyBpbiBmaXJzdFwiXG4vLyBiYW5uZXIuIFJldHVybnMgbnVsbCB3aGVuIHdlIGNhbid0IHRlbGwgKHNjcmlwdC1pbmplY3Rpb24gYmxvY2tlZCxcbi8vIHRpbWVvdXQsIGV0Yy4pIHNvIHRoZSBwb3B1cCBjYW4gZmFsbCBiYWNrIHRvIFwiZW5hYmxlZFwiIHJhdGhlciB0aGFuXG4vLyBzY2FyaW5nIHRoZSB1c2VyIHdpdGggYSBmYWxzZSBuZWdhdGl2ZS5cbmFzeW5jIGZ1bmN0aW9uIF9jaGVja05oaUxvZ2luU3RhdGUodGFiSWQpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFNhbWUgZW5kcG9pbnQgYXMgdGhlIGNpZCBhdXRvLWZldGNoIFx1MjAxNCBrbm93biB0byBuZWVkIGFuXG4gICAgICAgICAgLy8gYXV0aGVudGljYXRlZCBzZXNzaW9uIGFuZCB0byBiZSBjaGVhcC5cbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goXCIvYXBpL2loa2UzMDAwL2loa2UzNDEwczAxL3BhZ2VfbG9hZFwiLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLCBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dH1gIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gNDAxLzQwMyBcdTIxOTIgc2Vzc2lvbiB0b2tlbiByZWplY3RlZC4gMjAwIFx1MjE5MiBsb2dnZWQgaW4uXG4gICAgICAgICAgcmV0dXJuIHIub2s7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gdHlwZW9mIHJlc3VsdCA9PT0gXCJib29sZWFuXCIgPyByZXN1bHQgOiBudWxsO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGVuZHBvaW50IElIS0UzNDEwUzAxIChcdTYyMTFcdTYzQTVcdTdBMkVcdTdEMDBcdTkzMDQgLyBDT1ZJRCBcdTdCRTlcdTZBQTJcdTdEMDBcdTkzMDQpIGhhcHBlbnNcbi8vIHRvIGNhcnJ5IHRoZSBsb2dnZWQtaW4gdXNlcidzIHJlYWwgY2l0aXplbiBJRCBpbiB0aGUgcmVzcG9uc2UgKGBjaWRgXG4vLyBmaWVsZCwgZS5nLiBcIlAxMjM0NTA4NjZcIikuIFVzZSBpdCB0byBzZWVkIC8gcmVmcmVzaCB0aGUgcGF0aWVudF9cbi8vIG92ZXJyaWRlJ3MgaWRfbm8gc28gaXQgYWx3YXlzIHRyYWNrcyBcIndob3NlIHNlc3Npb24gaXMgY3VycmVudGx5XG4vLyBhY3RpdmUgaW4gdGhlIE5ISSB0YWJcIi5cbi8vXG4vLyBIaXN0b3J5IG5vdGU6IHRoaXMgZnVuY3Rpb24gdXNlZCB0byBlYXJseS1yZXR1cm4gd2hlbmV2ZXIgaWRfbm8gd2FzXG4vLyBhbHJlYWR5IGEgcmVhbC1sb29raW5nIGNpZCAoXCJkb24ndCB0b3VjaCBhIG1hbnVhbGx5LWVudGVyZWQgSURcIikuXG4vLyBUaGF0IHNob3J0LWNpcmN1aXQgcHJlLWRhdGVkIHYwLjYuMCB3aGljaCByZW1vdmVkIGlkX25vIGZyb20gdGhlIFVJXG4vLyBcdTIwMTQgdGhlcmUncyBubyBcIm1hbnVhbFwiIHBhdGggYW55bW9yZSwgdGhlIGZpZWxkIGlzIHB1cmVseSBpbnRlcm5hbC5cbi8vIFRoZSBzaG9ydC1jaXJjdWl0IGFsc28gcHJvZHVjZWQgdGhlIGJ1ZyBwYXR0ZXJuOiB1c2VyIHN0YXJ0cyBzeW5jXG4vLyB3aXRoIFBhdGllbnQgQiBsb2dnZWQgaW4gKGNpZF9CIHdyaXR0ZW4gdG8gb3ZlcnJpZGUpLCByZWFsaXNlcyB3cm9uZ1xuLy8gdGFiLCBzd2l0Y2hlcyBOSEkgdGFiIHRvIFBhdGllbnQgQSwgcmUtc3luY3MgXHUyMDE0IGlkX25vIHN0YXlzIGNpZF9CXG4vLyBiZWNhdXNlIFwiYWxyZWFkeSBhIHJlYWwgY2lkXCIuIE5vdyB3ZSBhbHdheXMgcHJvYmUgYW5kIGZvbGxvdyB0aGVcbi8vIHNlc3Npb24ncyB0cnV0aC4gTWFudWFsIG92ZXJyaWRlIGlzIGdvbmUsIE5ISSBzZXNzaW9uIGlzIGF1dGhvcml0YXRpdmUuXG5hc3luYyBmdW5jdGlvbiBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCBjdXJyZW50ID0gcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCI7XG5cbiAgbGV0IGNpZCA9IG51bGw7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXQpIHJldHVybiBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MTBzMDEvcGFnZV9sb2FkXCIsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0fWAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiBudWxsO1xuICAgICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICByZXR1cm4gYm9keT8uY2lkIHx8IG51bGw7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIFZhbGlkYXRlIGl0IGxvb2tzIGxpa2UgYSBUYWl3YW4gbmF0aW9uYWwgSUQgKDEgbGV0dGVyICsgOSBkaWdpdHMpXG4gICAgLy8gYmVmb3JlIHRydXN0aW5nIGl0LiBBdm9pZHMgYWNjaWRlbnRhbGx5IHByb21vdGluZyBnYXJiYWdlIHRvIHRoZVxuICAgIC8vIFBhdGllbnQgcmVzb3VyY2UncyB1bmlxdWUga2V5LlxuICAgIGlmIChyZXN1bHQgJiYgL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHJlc3VsdCkpIGNpZCA9IHJlc3VsdDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gSUhLRTM0MTAgY2lkIGZldGNoIGZhaWxlZDpcIiwgZT8ubWVzc2FnZSA/PyBlKTtcbiAgfVxuXG4gIGlmIChjaWQgJiYgY2lkICE9PSBjdXJyZW50KSB7XG4gICAgcGF0aWVudE92ZXJyaWRlID0geyAuLi5wYXRpZW50T3ZlcnJpZGUsIGlkX25vOiBjaWQgfTtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwYXRpZW50T3ZlcnJpZGUgfSkuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgLy8gUGF0aWVudC1zd2l0Y2ggY2xlYW51cC4gSWYgdGhlIGNpZCBqdXN0IGNoYW5nZWQgZnJvbSBvbmUgcmVhbFxuICAgIC8vIGNpZCB0byBhbm90aGVyIChub3QganVzdCBcImF1dG8tWFhYWCBcdTIxOTIgcmVhbCBjaWRcIiBmaXJzdC1zeW5jIHN3YXApLFxuICAgIC8vIHRoZSBwcmV2aW91c2x5LXN0YXNoZWQgRkhJUiBidW5kbGUgYmVsb25ncyB0byB0aGUgT1RIRVIgcGF0aWVudC5cbiAgICAvLyBEcm9wIGl0IHNvIHRoZSBwb3B1cCdzIGRvd25sb2FkIGJ1dHRvbiBkb2Vzbid0IGtlZXAgb2ZmZXJpbmcgdGhlXG4gICAgLy8gd3JvbmcgcGF0aWVudCdzIGZpbGUuIFNhbWUgc2V0IG9mIHdpcGVzIHBvcHVwLmpzIGRvZXMgaW5cbiAgICAvLyBzYXZlUGF0aWVudE92ZXJyaWRlIHdoZW4gaXQgZGV0ZWN0cyBwYXRpZW50Q2hhbmdlZC5cbiAgICBjb25zdCBzd2l0Y2hlZFJlYWxQYXRpZW50cyA9XG4gICAgICBjdXJyZW50ICYmICFjdXJyZW50LnN0YXJ0c1dpdGgoXCJhdXRvLVwiKSAmJiBjdXJyZW50ICE9PSBjaWQ7XG4gICAgaWYgKHN3aXRjaGVkUmVhbFBhdGllbnRzKSB7XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoUEVORElOR19CVU5ETEVfS0VZKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXRpZW50T3ZlcnJpZGU7XG59XG5cbi8vIFJlYWQgdGhlIG1hc2stbmFtZSBwcmVmZXJlbmNlIGZyZXNoIGZyb20gc3RvcmFnZS4gV2UgZG9uJ3QgY2FjaGUgXHUyMDE0XG4vLyBydW5OaGlBcGlTeW5jIGlzIGludm9rZWQgYXQgbW9zdCBhIGZldyB0aW1lcyBwZXIgc2Vzc2lvbiBhbmQgdGhlIFNXXG4vLyBjYW4gYmUgdG9ybiBkb3duICsgcmVzdGFydGVkIGFueSB0aW1lLCBzbyBhIHNpbmdsZSBnZXQoKSBwZXIgc3luYyBpc1xuLy8gY2hlYXBlciB0aGFuIHN5bmNpbmcgc3RhdGUgYWNyb3NzIFNXIGxpZmVjeWNsZXMuXG5hc3luYyBmdW5jdGlvbiBfaXNNYXNrRW5hYmxlZCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IG1hc2tOYW1lRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwibWFza05hbWVFbmFibGVkXCIpO1xuICAgIHJldHVybiBtYXNrTmFtZUVuYWJsZWQgPT09IHRydWU7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYnVpbGRPdmVycmlkZVBhdGllbnQob3YsIG1hc2tFbmFibGVkKSB7XG4gIGNvbnN0IGRpc3BsYXlOYW1lID0gbWFza0VuYWJsZWQgPyBtYXNrTmFtZShvdi5uYW1lIHx8IFwiXCIpIDogb3YubmFtZSB8fCBcIlwiO1xuICBjb25zdCByYXcgPSB7XG4gICAgaWQ6IG92LmlkX25vLFxuICAgIGlkZW50aWZpZXI6IG92LmlkX25vLFxuICAgIG5hbWU6IGRpc3BsYXlOYW1lIHx8IG92LmlkX25vLFxuICB9O1xuICBpZiAob3YuYmlydGhfZGF0ZSkgcmF3LmJpcnRoRGF0ZSA9IG92LmJpcnRoX2RhdGU7XG4gIGlmIChvdi5nZW5kZXIpIHJhdy5nZW5kZXIgPSBvdi5nZW5kZXI7XG4gIHJldHVybiBtYXBQYXRpZW50KHJhdyk7XG59XG5cbi8vIFdhbGsgYSBKU09OLWxpa2UgdmFsdWUgYW5kIHJlcGxhY2UgZXZlcnkgc3RyaW5nIHRva2VuIGVxdWFsIHRvIG9yXG4vLyBjb250YWluaW5nIGBuZWVkbGVgIHdpdGggYHJlcGxhY2VtZW50YC4gVXNlZCB0byBzY3J1YiB0aGUgcmVhbFxuLy8gcGF0aWVudCBuYW1lIG91dCBvZiBOSEkgbmFycmF0aXZlIGZpZWxkcyAoY2xpbmljYWxfbm90ZSwgY29uY2x1c2lvbixcbi8vIG5vdGUsIGV0Yy4pIGJlZm9yZSB0aGUgaXRlbXMgcmVhY2ggdGhlIG1hcHBlci4gT25seSB0cmlnZ2VyZWQgd2hlblxuLy8gdGhlIHVzZXIgaGFzIG9wdGVkIGludG8gbWFza2luZyBBTkQgc3VwcGxpZWQgYSBuYW1lIFx1MjAxNCBhbmQgdGhlXG4vLyBzdWJzdGl0dXRpb24gaXMgZXhhY3QtdG9rZW4tcmVwbGFjZSwgbm90IGZ1enp5LCBzbyBpdCBjYW4ndCBzdXJwcmlzZVxuLy8gdGhlIHVzZXIgYnkgY2xvYmJlcmluZyB1bnJlbGF0ZWQgY29udGVudC5cbmZ1bmN0aW9uIF9yZXBsYWNlTmFtZURlZXAodmFsdWUsIG5lZWRsZSwgcmVwbGFjZW1lbnQpIHtcbiAgaWYgKCFuZWVkbGUgfHwgbmVlZGxlID09PSByZXBsYWNlbWVudCkgcmV0dXJuIHZhbHVlO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsdWUuc3BsaXQobmVlZGxlKS5qb2luKHJlcGxhY2VtZW50KTtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gdmFsdWUubWFwKCh2KSA9PiBfcmVwbGFjZU5hbWVEZWVwKHYsIG5lZWRsZSwgcmVwbGFjZW1lbnQpKTtcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiB2YWx1ZSkgb3V0W2tdID0gX3JlcGxhY2VOYW1lRGVlcCh2YWx1ZVtrXSwgbmVlZGxlLCByZXBsYWNlbWVudCk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIF9hc3NlbWJsZUxvY2FsQnVuZGxlKGJ5VHlwZSwgcGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCkge1xuICBjb25zdCBwYXRpZW50ID0gX2J1aWxkT3ZlcnJpZGVQYXRpZW50KHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpO1xuICBjb25zdCBwaWQgPSBwYXRpZW50LmlkO1xuICBjb25zdCBhbGwgPSBbcGF0aWVudF07XG5cbiAgZm9yIChjb25zdCBwdCBvZiBfTE9DQUxfUEFHRV9UWVBFX09SREVSKSB7XG4gICAgY29uc3QgaXRlbXMgPSBieVR5cGVbcHRdO1xuICAgIGlmICghaXRlbXMgfHwgaXRlbXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBsZXQgbWFwcGVkO1xuICAgIGlmIChHUk9VUF9IQU5ETEVSU1twdF0pIHtcbiAgICAgIG1hcHBlZCA9IEdST1VQX0hBTkRMRVJTW3B0XShpdGVtcywgcGlkKTtcbiAgICB9IGVsc2UgaWYgKExJU1RfSEFORExFUlNbcHRdKSB7XG4gICAgICBjb25zdCBbZm5dID0gTElTVF9IQU5ETEVSU1twdF07XG4gICAgICBtYXBwZWQgPSBpdGVtc1xuICAgICAgICAuZmlsdGVyKChpdCkgPT4gaXQgJiYgdHlwZW9mIGl0ID09PSBcIm9iamVjdFwiKVxuICAgICAgICAubWFwKChpdCkgPT4gZm4oaXQsIHBpZCkpXG4gICAgICAgIC5maWx0ZXIoKHIpID0+IHIgIT09IG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHB0ID09PSBcImVuY291bnRlcnNcIikgbWFwcGVkID0gZGVkdXBBZG1pc3Npb25EYXlBbWIobWFwcGVkKTtcbiAgICBhbGwucHVzaCguLi5tYXBwZWQpO1xuICB9XG5cbiAgLy8gRGVkdXAgYnkgKHJlc291cmNlVHlwZSwgaWQpIGJlZm9yZSBhc3NlbWJsaW5nIHRoZSBCdW5kbGUuIE11bHRpcGxlXG4gIC8vIE5ISSBlbmRwb2ludHMgY2FuIGZlZWQgdGhlIHNhbWUgcGFnZV90eXBlIChlLmcuIGVuY291bnRlcnMgL1xuICAvLyBpbnBhdGllbnQgLyBpbnBhdGllbnRfbGVnYWN5IGFsbCBcdTIxOTIgcGFnZV90eXBlPVwiZW5jb3VudGVyc1wiKSwgYW5kIHRoZVxuICAvLyBtYXBwZXIgcHJvZHVjZXMgZGV0ZXJtaW5pc3RpYyBzdGFibGUgSURzIFx1MjAxNCBzbyB0d28gcmF3IGl0ZW1zIHRoYXRcbiAgLy8gZGVzY3JpYmUgdGhlIHNhbWUgbWVkaWNhbCBldmVudCBjb2xsYXBzZSB0byBvbmUgcmVzb3VyY2UuIEJhY2tlbmRcbiAgLy8gdXBzZXJ0IGhhbmRsZXMgdGhpcyBhdXRvbWF0aWNhbGx5IChzYW1lIHN0YWJsZSBJRCA9IHNhbWUgREIgcm93KTtcbiAgLy8gbG9jYWwgbW9kZSBoYXMgdG8gZG8gaXQgZXhwbGljaXRseS4gV2l0aG91dCB0aGlzIGRlZHVwLCB0aGUgbG9jYWxcbiAgLy8gQnVuZGxlIGVuZHMgdXAgaW5mbGF0ZWQgcmVsYXRpdmUgdG8gd2hhdCBiYWNrZW5kIHN0b3JlcyBmcm9tIHRoZVxuICAvLyBpZGVudGljYWwgTkhJIGlucHV0LlxuICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICBjb25zdCB1bmlxdWUgPSBbXTtcbiAgZm9yIChjb25zdCByIG9mIGFsbCkge1xuICAgIGNvbnN0IGtleSA9IGAke3IucmVzb3VyY2VUeXBlfS8ke3IuaWR9YDtcbiAgICBpZiAoc2Vlbi5oYXMoa2V5KSkgY29udGludWU7XG4gICAgc2Vlbi5hZGQoa2V5KTtcbiAgICB1bmlxdWUucHVzaChyKTtcbiAgfVxuXG4gIC8vIExpbmtlciArIHNleC1zdHJhdGlmaWVkIHJlc29sdmVyIHJ1biBvbmNlIG92ZXIgdGhlIGZ1bGwgYXNzZW1ibGVkXG4gIC8vIGxpc3QgKHNhbWUgcGlwZWxpbmUgYmFja2VuZCdzIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkIHJ1bnMsIGp1c3RcbiAgLy8gYWdhaW5zdCBhbiBpbi1tZW1vcnkgY2FuZGlkYXRlIGFycmF5IGluc3RlYWQgb2YgYSBTUUxpdGUgcXVlcnkpLlxuICBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzKHVuaXF1ZSwgdW5pcXVlKTtcbiAgcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMocGF0aWVudCwgdW5pcXVlKTtcblxuICByZXR1cm4ge1xuICAgIHJlc291cmNlVHlwZTogXCJCdW5kbGVcIixcbiAgICB0eXBlOiBcImNvbGxlY3Rpb25cIixcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9cXC5cXGQrWiQvLCBcIlpcIiksXG4gICAgZW50cnk6IHVuaXF1ZS5tYXAoKHIpID0+ICh7XG4gICAgICBmdWxsVXJsOiBgJHtyLnJlc291cmNlVHlwZX0vJHtyLmlkfWAsXG4gICAgICByZXNvdXJjZTogcixcbiAgICB9KSksXG4gIH07XG59XG5cbi8vIExvY2FsIG1vZGUgc3Rhc2hlcyB0aGUgYXNzZW1ibGVkIEJ1bmRsZSBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlclxuLy8gYSBzaW5nbGUgXCJwZW5kaW5nRmhpckJ1bmRsZVwiIHNsb3QuIFRoZSBwb3B1cCBzaG93cyBhIGRvd25sb2FkIGJ1dHRvblxuLy8gd2hlbiB0aGlzIHNsb3QgaXMgbm9uLWVtcHR5OyB0aGUgYWN0dWFsIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgY2FsbFxuLy8gaGFwcGVucyBmcm9tIHRoZSBwb3B1cCAoaW4gcmVzcG9uc2UgdG8gYSB1c2VyIGNsaWNrKSBzbyB0aGUgZmlsZVxuLy8gZG9lc24ndCBhcHBlYXIgaW4gdGhlIERvd25sb2FkcyBiYXIgdW5pbnZpdGVkLlxuLy9cbi8vIFNpbmdsZSBzbG90IG1lYW5zIGEgbmV3IHN5bmMgb3ZlcndyaXRlcyB0aGUgcHJldmlvdXMgcGVuZGluZyBidW5kbGUuXG4vLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBkZWZhdWx0IHF1b3RhIGlzIDEwIE1COyBhIHR5cGljYWwgTkhJIHN5bmMgaXNcbi8vIHdlbGwgdW5kZXIgMiBNQi5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcblxuYXN5bmMgZnVuY3Rpb24gX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRJZCwgZGF0ZVJhbmdlKSB7XG4gIC8vIEZpbGVuYW1lOiBuaGkte3BpZH0te3N0YXJ0WVlZWU1NRER9LXtlbmRZWVlZTU1ERH0uanNvblxuICAvLyBXaGVuIG5vIGV4cGxpY2l0IGRhdGVSYW5nZSAoTkhJIGRlZmF1bHQgPSBcdThGRDEgMSBcdTVFNzQpLCBzeW50aGVzaXplIHRvZGF5LTF5IFx1MjE5MiB0b2RheS5cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gIGNvbnN0IGZtdCA9IChkKSA9PiBgJHtkLmdldEZ1bGxZZWFyKCl9JHtwYWQoZC5nZXRNb250aCgpICsgMSl9JHtwYWQoZC5nZXREYXRlKCkpfWA7XG4gIC8vIEhhbGYtbWFzayB0aGUgSUQgaW4gdGhlIGZpbGVuYW1lIHNvIHRoZSB1c2VyJ3MgRG93bmxvYWRzIGZvbGRlclxuICAvLyBkb2Vzbid0IGxlYWsgdGhlIGZ1bGwgXHU4RUFCXHU1MjA2XHU4QjQ5ICh3b3VsZCBiZSB2aXNpYmxlIHRvIGFueW9uZSBzZWVpbmdcbiAgLy8gYSBmaWxlIGxpc3Rpbmcgb3IgZG93bmxvYWQtYmFyIHByZXZpZXcpLiBgWGAgYmVjYXVzZSBgKmAgaXNcbiAgLy8gaW52YWxpZCBpbiBXaW5kb3dzIHBhdGhzLiBCdW5kbGUgQ09OVEVOVFMgc3RpbGwgY2FycnkgdGhlIHJlYWxcbiAgLy8gSUQgdW5kZXIgUGF0aWVudC5pZCBcdTIwMTQgZmlsZSBvd25lciBrbm93cyB3aG9zZSBkYXRhIGl0IGlzLlxuICBjb25zdCBtYXNrZWRQaWQgPSBtYXNrSWQocGF0aWVudElkIHx8IFwidW5rbm93blwiLCBcIlhcIik7XG4gIGNvbnN0IHNhZmVQaWQgPSBtYXNrZWRQaWQucmVwbGFjZSgvW15BLVphLXowLTlfLV0vZywgXCJfXCIpO1xuICBjb25zdCBjb21wYWN0ID0gKGQpID0+IChkIHx8IFwiXCIpLnNsaWNlKDAsIDEwKS5yZXBsYWNlKC8tL2csIFwiXCIpO1xuICBsZXQgcywgZTtcbiAgaWYgKGRhdGVSYW5nZSAmJiAoZGF0ZVJhbmdlLnN0YXJ0IHx8IGRhdGVSYW5nZS5lbmQpKSB7XG4gICAgcyA9IGNvbXBhY3QoZGF0ZVJhbmdlLnN0YXJ0KSB8fCBmbXQobm93KTtcbiAgICBlID0gY29tcGFjdChkYXRlUmFuZ2UuZW5kKSB8fCBmbXQobm93KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvbmVZZWFyQWdvID0gbmV3IERhdGUobm93KTtcbiAgICBvbmVZZWFyQWdvLnNldEZ1bGxZZWFyKG9uZVllYXJBZ28uZ2V0RnVsbFllYXIoKSAtIDEpO1xuICAgIHMgPSBmbXQob25lWWVhckFnbyk7XG4gICAgZSA9IGZtdChub3cpO1xuICB9XG4gIGNvbnN0IGZpbGVuYW1lID0gYG5oaS0ke3NhZmVQaWR9LSR7c30tJHtlfS5qc29uYDtcbiAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KGJ1bmRsZSwgbnVsbCwgMik7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgW1BFTkRJTkdfQlVORExFX0tFWV06IHtcbiAgICAgIGZpbGVuYW1lLFxuICAgICAganNvbixcbiAgICAgIGJ5dGVzOiBqc29uLmxlbmd0aCxcbiAgICAgIGdlbmVyYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgcGF0aWVudElkOiBwYXRpZW50SWQgfHwgbnVsbCxcbiAgICB9LFxuICB9KTtcbiAgcmV0dXJuIHsgZmlsZW5hbWUsIGJ5dGVzOiBqc29uLmxlbmd0aCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBydW5OaGlBcGlTeW5jKHsgdGFiSWQsIG1vZGUsIGJhY2tlbmQsIHN5bmNBcGlLZXksIG5oaUJhc2UsIHBhdGllbnRPdmVycmlkZSwgZGF0ZVJhbmdlLCBkYXRlUmFuZ2VMYWJlbCB9KSB7XG4gIF9jYW5jZWxsZWQgPSBmYWxzZTtcbiAgY29uc3QgQkFTRSA9IG5oaUJhc2UgfHwgYGh0dHBzOi8vJHtOSElfSE9TVH1gO1xuXG4gIGlmICghcGF0aWVudE92ZXJyaWRlKSB7XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdThBQ0JcdTUxNDhcdTU3MjggcG9wdXAgXHU1ODZCXHU1QkVCXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XHU1RjhDXHU1MThEXHU4QTY2XCIsXG4gICAgICAgIHBoYXNlOiBcImVycm9yXCIsIHRzOiBEYXRlLm5vdygpLCBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIXRhYklkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQVBJIHN5bmMgcmVxdWlyZXMgTkhJIHRhYiBpZCAoY29va2llcyBhcmUgZmlyc3QtcGFydHkpXCIpO1xuICB9XG5cbiAgLy8gRmlyc3QgY2hhbmNlIHRvIHVwZ3JhZGUgdGhlIHBhdGllbnQgSUQ6IGlmIHRoZSBwb3B1cCBnYXZlIHVzIGFuXG4gIC8vIFwiYXV0by1YWFhYWFhYWFwiIHBsYWNlaG9sZGVyICh1c2VyIGRpZG4ndCBtYW51YWxseSB0eXBlIG9uZSksXG4gIC8vIGZldGNoIHRoZSByZWFsIG9uZSBmcm9tIE5ISSdzIElIS0UzNDEwUzAxIGVuZHBvaW50IChyZXNwb25zZS5jaWRcbiAgLy8gaXMgdGhlIGNpdGl6ZW4gSUQpLiBQZXJzaXN0IGJhY2sgdG8gc3RvcmFnZSBzbyBzdWJzZXF1ZW50IHN5bmNzXG4gIC8vIGFyZSBzdGFibGUuIE1hbnVhbGx5LXR5cGVkIElEcyBhcmUgcmVzcGVjdGVkIGFzLWlzLlxuICBwYXRpZW50T3ZlcnJpZGUgPSBhd2FpdCBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSk7XG5cbiAgLy8gU3Rhc2ggY29udGV4dCBzbyB0aGUgc3RvcFN5bmMgbWVzc2FnZSBoYW5kbGVyIGNhbiB3aXBlIHBhcnRpYWxcbiAgLy8gZGF0YSAoREVMRVRFIC9zeW5jL3BhdGllbnQve2lkX25vfSkgd2l0aG91dCB1cyBoYXZpbmcgdG8gc2VuZCBpdFxuICAvLyBiYWNrIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UuXG4gIF9hY3RpdmVTeW5jQ3R4ID0geyBiYWNrZW5kLCBzeW5jQXBpS2V5LCBwYXRpZW50SWQ6IHBhdGllbnRPdmVycmlkZS5pZF9ubyB9O1xuXG4gIC8vIFdhbGwtY2xvY2sgc3RhcnQgdGltZSBcdTIwMTQgdXNlZCB0byBjb21wdXRlIGVsYXBzZWQgc2Vjb25kcyBmb3IgdGhlXG4gIC8vIGZpbmFsIHN0YXR1cyBsaW5lIChcIlx1N0UzRFx1ODAxN1x1NjY0MiAxMi4zIFx1NzlEMlwiKS4gU3Rhc2ggb24gYSBsb2NhbCBzbyB3ZSBjYW5cbiAgLy8gcmVhY2ggaXQgZnJvbSB0aGUgY29tcGxldGlvbiBtZXNzYWdlIGF0IHRoZSB2ZXJ5IGVuZC5cbiAgY29uc3QgX3QwID0gRGF0ZS5ub3coKTtcbiAgLy8gUGVyLXBoYXNlIHRpbWluZ3MsIHN1cmZhY2VkIGludG8gdGhlIHBvcHVwJ3MgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIiBzbyB0aGUgdXNlclxuICAvLyBjYW4gc2VlIGV4YWN0bHkgd2hlcmUgdGltZSBpcyBnb2luZy4gRWFjaCBlbnRyeTogeyBuYW1lLCBtcyB9LlxuICBjb25zdCBfcGhhc2VzID0gW107XG4gIGxldCBfcGhhc2VTdGFydCA9IF90MDtcbiAgY29uc3QgX21hcmtQaGFzZSA9IChuYW1lKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBfcGhhc2VzLnB1c2goeyBuYW1lLCBtczogbm93IC0gX3BoYXNlU3RhcnQgfSk7XG4gICAgX3BoYXNlU3RhcnQgPSBub3c7XG4gIH07XG4gIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgcnVubmluZzogdHJ1ZSwgcHJvZ3Jlc3M6IFwiXHVEODNEXHVERTgwIFx1OTU4Qlx1NTlDQlx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MjAyNlwiLCBwaGFzZTogXCJpbml0XCIsXG4gICAgc3RhcnRlZDogX3QwLCB0b3RhbFJlc291cmNlczogMCwgaG9zdDogTkhJX0hPU1QsIGVycm9yczogW10sXG4gIH0pO1xuXG4gIC8vIFN0ZXAgMTogZmV0Y2ggYWxsIGVuZHBvaW50cyBpbiBQQVJBTExFTCBpbnNpZGUgdGhlIE5ISSB0YWIuIFJ1bm5pbmcgaW5cbiAgLy8gdGFiIGNvbnRleHQgbWVhbnMgc2FtZS1vcmlnaW4gY29va2llcyBhcmUgc2VudCBhdXRvbWF0aWNhbGx5IFx1MjAxNCBmZXRjaFxuICAvLyBmcm9tIHRoZSBTVyB3b3VsZCBiZSBjcm9zcy1vcmlnaW4gYW5kIFNhbWVTaXRlIGJsb2NrcyB0aGUgc2Vzc2lvblxuICAvLyBjb29raWUsIGhlbmNlIHdlIGdvdCBcInNlc3Npb24gZXhwaXJlZFwiIGV2ZW4gd2hlbiBsb2dnZWQgaW4uXG4gIC8vIFBhc3Mgb25seSBzZXJpYWxpc2FibGUgZGF0YSAocGF0aHMsIG1ldGhvZCwgbmFtZSk7IGFkYXB0ZXJzIHN0YXkgaW4gU1cuXG4gIC8vIEluamVjdCBJU08tZGF0ZSByYW5nZSBpbnRvIGVhY2ggZW5kcG9pbnQgdGhhdCBzdXBwb3J0cyBpdCAoY29udmVydHNcbiAgLy8gdG8gXHU2QzExXHU1NzBCIGZvcm1hdCB2aWEgaXNvVG9ST0MpLiBTa2lwcGVkIGVuZHBvaW50cyBrZWVwIHRoZWlyIGRlZmF1bHRcbiAgLy8gTkhJLXNpZGUgd2luZG93ICgxLTIgeWVhcnMgZGVwZW5kaW5nIG9uIHRoZSBwYWdlKS5cbiAgY29uc3QgZmV0Y2hTcGVjID0gTkhJX0FQSV9FTkRQT0lOVFMubWFwKChlcCkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSBlcC5zdXBwb3J0c0RhdGVSYW5nZSA/IGFwcGx5RGF0ZVJhbmdlVG9QYXRoKGVwLnBhdGgsIGRhdGVSYW5nZSkgOiBlcC5wYXRoO1xuICAgIHJldHVybiB7IG5hbWU6IGVwLm5hbWUsIHVybDogQkFTRSArIHBhdGgsIG1ldGhvZDogXCJHRVRcIiB9O1xuICB9KTtcbiAgaWYgKGRhdGVSYW5nZSAmJiAoZGF0ZVJhbmdlLnN0YXJ0IHx8IGRhdGVSYW5nZS5lbmQpKSB7XG4gICAgY29uc29sZS5sb2coXCJbTkhJIEFQSSBzeW5jXSBkYXRlIHJhbmdlOlwiLFxuICAgICAgYCR7ZGF0ZVJhbmdlLnN0YXJ0IHx8IFwiKHVuYm91bmRlZClcIn0gXHUyMTkyICR7ZGF0ZVJhbmdlLmVuZCB8fCBcIih1bmJvdW5kZWQpXCJ9YCk7XG4gIH1cblxuICBsZXQgc2V0dGxlZFJhdztcbiAgdHJ5IHtcbiAgICBbeyByZXN1bHQ6IHNldHRsZWRSYXcgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiBhc3luYyAoc3BlY3MpID0+IHtcbiAgICAgICAgLy8gTkhJIGF1dGg6IGNvb2tpZXMgKyBKV1QgaW4gc2Vzc2lvblN0b3JhZ2UuIFRoZSBTUEEncyBheGlvcyBzZXRzXG4gICAgICAgIC8vIGBBdXRob3JpemF0aW9uOiBCZWFyZXIgPHRva2VuPmAgb24gZXZlcnkgQVBJIGNhbGwuIFNlc3Npb25cbiAgICAgICAgLy8gY29va2llcyBhbG9uZSByZXR1cm4gNDAxLlxuICAgICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIFt7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH1dO1xuICAgICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG5cbiAgICAgICAgLy8gRGV0ZWN0IElETEUvdGltZW91dCBwYWdlIGFscmVhZHkgcmVkaXJlY3RlZCBvbiB0aGlzIHRhYi5cbiAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICAgIHJldHVybiBbeyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDYwLXNlY29uZCB0aW1lb3V0IHBlciBmZXRjaCBcdTIwMTQgc29tZSBOSEkgZW5kcG9pbnRzIChlbmNvdW50ZXJzLFxuICAgICAgICAvLyBtZWRzKSB0YWtlIDIwKyBzZWNvbmRzLlxuICAgICAgICBhc3luYyBmdW5jdGlvbiBmZXRjaE9uZShzLCBtcykge1xuICAgICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCBtcyk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChzLnVybCwge1xuICAgICAgICAgICAgICBtZXRob2Q6IHMubWV0aG9kLFxuICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgICBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGNvbnN0IGN0ID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykge1xuICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgICAgaWYgKCFjdC5pbmNsdWRlcyhcImFwcGxpY2F0aW9uL2pzb25cIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogYG5vbi1KU09OIChjdD0ke2N0fSlgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgYm9keTtcbiAgICAgICAgICAgIHRyeSB7IGJvZHkgPSBhd2FpdCByLmpzb24oKTsgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHsgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJKU09OIHBhcnNlOiBcIiArIGUubWVzc2FnZSB9OyB9XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGJvZHkgfTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgaWYgKGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIpIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwidGltZW91dCA2MHNcIiB9O1xuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb25jdXJyZW5jeS1saW1pdGVkIGV4ZWN1dGlvbjogbWF4IDMgaW4gZmxpZ2h0IGF0IG9uY2UuIE5ISSdzXG4gICAgICAgIC8vIGFidXNlIGRldGVjdGlvbiBibG9ja3MgYnVyc3RzOyB3aXRoIDExIHBhcmFsbGVsIGZldGNoZXMgaXRcbiAgICAgICAgLy8gdGhyb3R0bGVkIHRoZSBzZXNzaW9uIGFuZCByZWRpcmVjdGVkIHRvIElIS0UzMDAxUzk5X0lETEUuXG4gICAgICAgIC8vIDMgYXQgYSB0aW1lICsgMjAwbXMgaml0dGVyIGlzIGdlbnRsZSBlbm91Z2ggZm9yIDEtc2hvdCBzeW5jLlxuICAgICAgICBjb25zdCBDT05DVVJSRU5DWSA9IDM7XG4gICAgICAgIGNvbnN0IEpJVFRFUl9NUyA9IDIwMDtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IG5ldyBBcnJheShzcGVjcy5sZW5ndGgpO1xuICAgICAgICBsZXQgbmV4dElkeCA9IDA7XG4gICAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgICB3aGlsZSAobmV4dElkeCA8IHNwZWNzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgaSA9IG5leHRJZHgrKztcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHIgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogSklUVEVSX01TKSk7XG4gICAgICAgICAgICByZXN1bHRzW2ldID0gYXdhaXQgZmV0Y2hPbmUoc3BlY3NbaV0sIDYwMDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd29ya2VycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkNVUlJFTkNZICYmIHcgPCBzcGVjcy5sZW5ndGg7IHcrKykge1xuICAgICAgICAgIHdvcmtlcnMucHVzaCh3b3JrZXIoKSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod29ya2Vycyk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSxcbiAgICAgIGFyZ3M6IFtmZXRjaFNwZWNdLFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBleGVjdXRlU2NyaXB0IGZhaWxlZDogJHtlLm1lc3NhZ2V9YCk7XG4gIH1cblxuICAvLyBEZXRlY3Qgc2Vzc2lvbiBleHBpcmVkIGFjcm9zcyByZXN1bHRzLlxuICBpZiAoc2V0dGxlZFJhdy5zb21lKChyKSA9PiByLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICB9XG5cbiAgY29uc3QgZXJyb3JzID0gW107XG5cbiAgLy8gR2VuZXJpYyBsaXN0IGV4dHJhY3Rpb246IGhhbmRsZXMgYWxsIG9ic2VydmVkIE5ISSBzaGFwZXMuXG4gIC8vICAgLSBQbGFpbiBhcnJheSAoSUhLRTM0MDkgbGFiKVxuICAvLyAgIC0ge3NwX0lIS0U8WD5fZGF0YTogWy4uLl19ICAobWVkaWNhdGlvbnMsIGFsbGVyZ2llcylcbiAgLy8gICAtIHt3ZXN0ZXJuX2RhdGEsIGNoaW5lc2VfZGF0YSwgZGVudGlzdF9kYXRhOiBbLi4uXX0gKGVuY291bnRlciBsaXN0LFxuICAvLyAgICAgc3BsaXQgYnkgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIgXHUyMDE0IHdlIHdhbnQgYWxsIHRocmVlKVxuICAvLyBGb3IgbXVsdGktYXJyYXkgc2hhcGVzIHdlIG1lcmdlIGFsbCBhcnJheXMgYW5kIHRhZyBlYWNoIGl0ZW0gd2l0aFxuICAvLyBgX19zZWN0aW9uYCAodGhlIHNvdXJjZSBrZXkpIHNvIGFkYXB0ZXJzIGNhbiBkaXNhbWJpZ3VhdGUuXG4gIGZ1bmN0aW9uIGV4dHJhY3RMaXN0KGJvZHkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShib2R5KSkgcmV0dXJuIGJvZHk7XG4gICAgaWYgKCFib2R5IHx8IHR5cGVvZiBib2R5ICE9PSBcIm9iamVjdFwiKSByZXR1cm4gW107XG4gICAgbGV0IGFycmF5S2V5cyA9IE9iamVjdC5lbnRyaWVzKGJvZHkpLmZpbHRlcigoW18sIHZdKSA9PiBBcnJheS5pc0FycmF5KHYpKTtcbiAgICBpZiAoYXJyYXlLZXlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgIGlmIChhcnJheUtleXMubGVuZ3RoID09PSAxKSByZXR1cm4gYXJyYXlLZXlzWzBdWzFdO1xuICAgIC8vIE11bHRpcGxlIGFycmF5cyBcdTIwMTQgZHJvcCBVSS1oZWxwZXIgYXJyYXlzIChkcm9wZG93biBvcHRpb25zLCBzb3J0XG4gICAgLy8gc2VsZWN0b3JzLCBsb29rdXAgdGFibGVzKS4gTkhJIG1peGVzIHRoZW0gaW50byB0aGUgc2FtZSByZXNwb25zZVxuICAgIC8vIChlLmcuIGltYWdpbmcgcmV0dXJucyBzcF9JSEtFMzQwOFMwMV9kYXRhICsgaWNkOWNtX3NlbGVjdCkuXG4gICAgY29uc3QgSEVMUEVSX1JFID0gL3NlbGVjdHxvcHRpb258ZHJvcGRvd258ZmlsdGVyfHNvcnR8bG9va3VwL2k7XG4gICAgY29uc3QgZGF0YUtleXMgPSBhcnJheUtleXMuZmlsdGVyKChba10pID0+ICFIRUxQRVJfUkUudGVzdChrKSk7XG4gICAgaWYgKGRhdGFLZXlzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGRhdGFLZXlzWzBdWzFdO1xuICAgIGlmIChkYXRhS2V5cy5sZW5ndGggPT09IDApIHJldHVybiBhcnJheUtleXNbMF1bMV07IC8vIGZhbGxiYWNrXG4gICAgYXJyYXlLZXlzID0gZGF0YUtleXM7XG4gICAgLy8gTXVsdGlwbGUgZGF0YSBhcnJheXMgKGUuZy4gd2VzdGVybl9kYXRhL2NoaW5lc2VfZGF0YS9kZW50aXN0X2RhdGEpXG4gICAgLy8gXHUyMDE0IG1lcmdlIHdpdGggX19zZWN0aW9uIHRhZyBzbyBhZGFwdGVycyBjYW4gZGlzYW1iaWd1YXRlLlxuICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIGFycmF5S2V5cykge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHYpIHtcbiAgICAgICAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICBtZXJnZWQucHVzaCh7IC4uLml0ZW0sIF9fc2VjdGlvbjogayB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXJnZWQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkO1xuICB9XG5cbiAgLy8gQXBwbHkgU1ctc2lkZSBhZGFwdGVycyB0byBlYWNoIGVuZHBvaW50J3MgYm9keS5cbiAgY29uc3Qgc2V0dGxlZCA9IHNldHRsZWRSYXcubWFwKChyLCBpKSA9PiB7XG4gICAgY29uc3QgZXAgPSBOSElfQVBJX0VORFBPSU5UU1tpXTtcbiAgICBpZiAoci5lcnJvcikge1xuICAgICAgcmV0dXJuIHsgc3RhdHVzOiBcInJlamVjdGVkXCIsIHJlYXNvbjogeyBtZXNzYWdlOiBgJHtlcC5uYW1lfTogJHtyLmVycm9yfWAgfSB9O1xuICAgIH1cbiAgICBjb25zdCBsaXN0ID0gZXh0cmFjdExpc3Qoci5ib2R5KTtcbiAgICAvLyBBZGFwdGVycyByZXR1cm4gZWl0aGVyOlxuICAgIC8vICAgLSBvbmUgaXRlbSAgIChtb3N0IGFkYXB0ZXJzIFx1MjAxNCBsYWJzLCBtZWRzLCBlbmNvdW50ZXJzLCBpbWFnaW5nKVxuICAgIC8vICAgLSBudWxsL3VuZGVmaW5lZCAoc2tpcClcbiAgICAvLyAgIC0gYXJyYXkgb2YgaXRlbXMgKGFkYXB0QWR1bHRQcmV2ZW50aXZlIFx1MjAxNCB1bmZvbGRzIG9uZSBzY3JlZW5pbmdcbiAgICAvLyAgICAgcm93IGludG8gfjE1IE9ic2VydmF0aW9uIGVudHJpZXMpXG4gICAgLy8gRmxhdC1oYW5kbGUgYm90aCBzaGFwZXMgc28gZWFjaCBhZGFwdGVyIGNhbiBwaWNrIHdoYXRldmVyJ3MgY2xlYXJlc3QuXG4gICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGxpc3QpIHtcbiAgICAgIGNvbnN0IHIgPSBlcC5hZGFwdChpdCk7XG4gICAgICBpZiAociA9PT0gbnVsbCB8fCByID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocikpIHtcbiAgICAgICAgZm9yIChjb25zdCB4IG9mIHIpIGlmICh4KSBpdGVtcy5wdXNoKHgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbXMucHVzaChyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gU25hcHNob3QgYSBib2R5IHNhbXBsZSBmb3Igc2hhcGVzIHdoZXJlIGFkYXB0ZXIgcmVqZWN0ZWQgZXZlcnl0aGluZ1xuICAgIC8vIFx1MjAxNCB1c2VkIGJ5IHRoZSBkaWFnbm9zdGljIGJyZWFrZG93biBpbiBzdGVwIDIuXG4gICAgbGV0IGJvZHlTYW1wbGUgPSBudWxsO1xuICAgIGlmIChsaXN0Lmxlbmd0aCA+IDAgJiYgaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBJbmNsdWRlIHRoZSBGSVJTVCBJVEVNIChmdWxsIGtleXMrdmFsdWVzKSBzbyB3ZSBjYW4gYnVpbGQgdGhlXG4gICAgICAvLyBjb3JyZWN0IGFkYXB0ZXIgd2l0aG91dCBhbm90aGVyIHJvdW5kLXRyaXAuIE5ISSBpdGVtcyBtYXkgaW5jbHVkZVxuICAgICAgLy8gUElJOyB0aGUgdXNlciBpbnNwZWN0cyB0aGlzIGxvY2FsbHkgdmlhIHNlcnZpY2Utd29ya2VyIGRldnRvb2xzLlxuICAgICAgYm9keVNhbXBsZSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdG9wTGV2ZWxLZXlzOiBBcnJheS5pc0FycmF5KHIuYm9keSkgPyBudWxsIDogT2JqZWN0LmtleXMoci5ib2R5IHx8IHt9KS5zbGljZSgwLCAxMCksXG4gICAgICAgIHdhc0FycmF5OiBBcnJheS5pc0FycmF5KHIuYm9keSksXG4gICAgICAgIGZpcnN0SXRlbTogbGlzdFswXSA/PyBudWxsLFxuICAgICAgICBzZWNvbmRJdGVtOiBsaXN0WzFdID8/IG51bGwsXG4gICAgICB9KS5zbGljZSgwLCA0MDAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc3RhdHVzOiBcImZ1bGZpbGxlZFwiLCB2YWx1ZTogeyBlcCwgaXRlbXMsIHJhd19jb3VudDogbGlzdC5sZW5ndGgsIGJvZHlTYW1wbGUsIHJhd0xpc3Q6IGxpc3QgfSB9O1xuICB9KTtcblxuICBfbWFya1BoYXNlKFwibmhpLXBhcmFsbGVsXCIpO1xuXG4gIC8vIFN0ZXAgMWE6IGVuY291bnRlciBkZXRhaWwgZmFuLW91dCAoSUhLRTMzMDNTMDIpIFx1MjE5MiBjbGFzc2lmeSBlYWNoXG4gIC8vIElIS0UzMzAzUzAxIHZpc2l0IGFzIEFNQiAvIEVNRVIgLyBJTVAgdmlhIGhvc3BfREFUQV9UWVBFX05BTUUuXG4gIC8vIExpc3QgZW5kcG9pbnQgZG9lc24ndCBleHBvc2UgXHU2MDI1XHU4QTNBIGRpc3RpbmN0aW9uOyBkZXRhaWwgZG9lcy4gV2UgcmUtXG4gIC8vIGFkYXB0IGVhY2ggZW5jb3VudGVyIGl0ZW0gd2l0aCB0aGUgZGlzY292ZXJlZCBjbGFzcyBiZWZvcmUgdGhlXG4gIC8vIGJhY2tlbmQgdXBsb2FkIHN0ZXAuXG4gIGNvbnN0IGVuY0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcImVuY291bnRlcnNcIik7XG4gIGlmIChlbmNJZHggPj0gMCAmJiBzZXR0bGVkW2VuY0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtlbmNJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTVDMzFcdTkxQUJcdTdEMDBcdTkzMDRcdThBNzNcdTYwQzVcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkZXRhaWxNYXAgPSBhd2FpdCBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBSZS1hZGFwdCB3aXRoIGNsYXNzSGludCBmcm9tIGRldGFpbDsgZmFsbCBiYWNrIHRvIEFNQi5cbiAgICAgICAgY29uc3QgcmVBZGFwdGVkID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlzaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZGV0YWlsID0gZGV0YWlsTWFwPy5nZXQoaSkgfHwgbnVsbDtcbiAgICAgICAgICBjb25zdCBjbHMgPSBfY2xhc3NGcm9tUzAyRGV0YWlsKGRldGFpbCkgfHwgXCJBTUJcIjtcbiAgICAgICAgICBjb25zdCBpdCA9IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UodmlzaXRzW2ldLCBjbHMpO1xuICAgICAgICAgIGlmIChpdCkgcmVBZGFwdGVkLnB1c2goaXQpO1xuICAgICAgICB9XG4gICAgICAgIHNldHRsZWRbZW5jSWR4XS52YWx1ZS5pdGVtcyA9IHJlQWRhcHRlZDtcbiAgICAgICAgc2V0dGxlZFtlbmNJZHhdLnZhbHVlLnJhd19jb3VudCA9IHJlQWRhcHRlZC5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBlbmNvdW50ZXIgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImVuY291bnRlci1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAxYjogbWVkaWNhdGlvbnMgbmVlZCBhIDItc3RlcCBmZXRjaCBcdTIwMTQgSUhLRTMzMDZTMDEgb25seSByZXR1cm5zXG4gIC8vIHZpc2l0IG1ldGFkYXRhIChkYXRlLCBJQ0QsIGhvc3BpdGFsKSwgbm8gZHJ1ZyBuYW1lcy4gRHJ1Z3MgbGl2ZSBhdFxuICAvLyBJSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD08cm93X0lEPiZjdHlwZT0yIHVuZGVyXG4gIC8vIGloa2UzMzA2UzAyX21haW5fZGF0YVsqXS5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QuIEZhbiBvdXQgZGV0YWlsXG4gIC8vIGZldGNoZXMgaW5zaWRlIHRoZSBzYW1lIHRhYiBjb250ZXh0IChjb29raWVzICsgSldUKSwga2VlcGluZ1xuICAvLyBjb25jdXJyZW5jeSBsaW1pdGVkIHNvIE5ISSBkb2Vzbid0IElETEUtcmVkaXJlY3QgdXMuXG4gIC8vIFN0ZXAgMWM6IGltYWdpbmcgbmVlZHMgSUhLRTM0MDhTMDIgZm9yIHRoZSBhY3R1YWwgcmVwb3J0IG5hcnJhdGl2ZS5cbiAgLy8gTGlzdCBlbmRwb2ludCBvbmx5IGhhcyBvcmRlciBtZXRhZGF0YTsgY3R5cGUgcGFyYW0gbWlycm9ycyB0aGVcbiAgLy8gdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuICBjb25zdCBpbWdJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJpbWFnaW5nXCIpO1xuICBpZiAoaW1nSWR4ID49IDAgJiYgc2V0dGxlZFtpbWdJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbaW1nSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XHU1ODMxXHU1NDRBXHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVwb3J0cyA9IGF3YWl0IF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUuaXRlbXMgPSByZXBvcnRzO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVwb3J0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGltYWdpbmcgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImltYWdpbmctZGV0YWlsXCIpO1xuXG4gIGNvbnN0IG1lZElkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcIm1lZGljYXRpb25zXCIpO1xuICBpZiAobWVkSWR4ID49IDAgJiYgc2V0dGxlZFttZWRJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU3NTI4XHU4NUU1XHU2NjBFXHU3RDMwXHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZHJ1Z0l0ZW1zID0gYXdhaXQgX2ZldGNoTWVkaWNhdGlvbkRldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS5pdGVtcyA9IGRydWdJdGVtcztcbiAgICAgICAgLy8gcmF3X2NvdW50IG5vdyByZWZsZWN0cyB0aGUgKmRydWctbGV2ZWwqIGNvdW50IGZvciB0aGUgYnJlYWtkb3duXG4gICAgICAgIC8vICh2aXNpdHMgXHUyMTkyIGRydWdzKS4gS2VlcCB0aGUgdmlzaXQgY291bnQgaW4gYSBzaWRlIGZpZWxkIGZvciBkZWJ1Zy5cbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUucmF3X2NvdW50ID0gZHJ1Z0l0ZW1zLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYG1lZGljYXRpb25zIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJtZWRpY2F0aW9uLWRldGFpbFwiKTtcblxuICAvLyBTdGVwIDI6IGFnZ3JlZ2F0ZSBpdGVtcyBieSBwYWdlX3R5cGUsIFBPU1QgdG8gYmFja2VuZC5cbiAgY29uc3QgYnlUeXBlID0ge307XG4gIGxldCByYXdfdG90YWwgPSAwO1xuICBsZXQgYWRhcHRlZF90b3RhbCA9IDA7XG4gIC8vIFBlci1lbmRwb2ludCBicmVha2Rvd24gc28gdGhlIGZpbmFsIHN0YXR1cyBjYW4gdGVsbCB1c2VyIGV4YWN0bHlcbiAgLy8gd2hpY2ggZW5kcG9pbnRzIGNhbWUgYmFjayBlbXB0eSAvIG1pcy1zaGFwZWQgXHUyMDE0IG11Y2ggbW9yZSB1c2VmdWwgdGhhblxuICAvLyBhIHNpbmdsZSBhZ2dyZWdhdGVkIG51bWJlci5cbiAgLy8gQnJlYWtkb3duIHNob3duIHRvIHRoZSB1c2VyIHVuZGVyIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIuIFVzZSB0aGUgQ2hpbmVzZSBsYWJlbFxuICAvLyB3aGVuIGtub3duOyBvbmx5IGZhbGwgYmFjayB0byB0aGUgcmF3IGVuZHBvaW50IG5hbWUgZm9yIHVubWFwcGVkXG4gIC8vIChuZXdseSBhZGRlZCkgZW5kcG9pbnRzLiBFbXB0eS1yZXN1bHQgZW5kcG9pbnRzIGFyZSBvbWl0dGVkIGZyb21cbiAgLy8gdGhlIHN1Y2Nlc3Mgc3VtbWFyeSBlbnRpcmVseSBcdTIwMTQgdGhleSBhZGQgbm9pc2UuIEVycm9ycyBhbHdheXMgc2hvd1xuICAvLyBzbyB0aGUgdXNlciBrbm93cyBzb21ldGhpbmcgZGlkbid0IGNvbWUgdGhyb3VnaC5cbiAgY29uc3QgYnJlYWtkb3duID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0dGxlZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGVwID0gTkhJX0FQSV9FTkRQT0lOVFNbaV07XG4gICAgY29uc3QgcyA9IHNldHRsZWRbaV07XG4gICAgY29uc3QgbGFiZWwgPSBFTkRQT0lOVF9MQUJFTF9aSFtlcC5uYW1lXSA/PyBlcC5uYW1lO1xuICAgIGlmIChzLnN0YXR1cyA9PT0gXCJyZWplY3RlZFwiKSB7XG4gICAgICBlcnJvcnMucHVzaChgJHtlcC5uYW1lfTogJHtzLnJlYXNvbi5tZXNzYWdlfWApO1xuICAgICAgYnJlYWtkb3duLnB1c2goYFx1Mjc0QyAke2xhYmVsfVx1RkYxQVx1NTNENlx1NUY5N1x1NTkzMVx1NjU1N2ApO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHsgaXRlbXMsIHJhd19jb3VudCB9ID0gcy52YWx1ZTtcbiAgICByYXdfdG90YWwgKz0gcmF3X2NvdW50O1xuICAgIGFkYXB0ZWRfdG90YWwgKz0gaXRlbXMubGVuZ3RoO1xuICAgIGlmIChyYXdfY291bnQgPT09IDApIGNvbnRpbnVlOyAvLyBub3RoaW5nIHRvIHNob3dcbiAgICBpZiAoaXRlbXMubGVuZ3RoID4gcmF3X2NvdW50ICYmIHJhd19jb3VudCA+IDApIHtcbiAgICAgIC8vIDEtdG8tbWFueSBhZGFwdGVyIChlLmcuIGFkdWx0X3ByZXZlbnRpdmU6IG9uZSBzY3JlZW5pbmcgcm93IFx1MjE5MlxuICAgICAgLy8gfjE4IE9ic2VydmF0aW9ucykuIFNob3cgYm90aCBudW1iZXJzIHNvIHRoZSB1c2VyIHVuZGVyc3RhbmRzXG4gICAgICAvLyB3aHkgb25lIHJlY29yZCBwcm9kdWNlZCBtYW55LlxuICAgICAgYnJlYWtkb3duLnB1c2goYCR7bGFiZWx9XHVGRjFBJHtyYXdfY291bnR9IFx1N0I0NiBcdTIxOTIgJHtpdGVtcy5sZW5ndGh9IFx1OTgwNWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVha2Rvd24ucHVzaChgJHtsYWJlbH1cdUZGMUEke2l0ZW1zLmxlbmd0aH0gXHU3QjQ2YCk7XG4gICAgfVxuICAgIC8vIFNhdmUgYm9keSBzYW1wbGUgZm9yIGZpcnN0IGVuZHBvaW50IHdpdGggcmF3PjAgYnV0IGFkYXB0ZWQ9MCAoYWRhcHRlclxuICAgIC8vIG1pc21hdGNoKSBzbyB3ZSBjYW4gaXRlcmF0ZS4gU3RvcmVkIHVuZGVyIGNocm9tZS5zdG9yYWdlLmxvY2FsIGZvclxuICAgIC8vIGluc3BlY3Rpb24gdmlhIHNlcnZpY2Ugd29ya2VyIERldlRvb2xzLlxuICAgIGlmIChyYXdfY291bnQgPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICBbYF9fc2FtcGxlQm9keV8ke2VwLm5hbWV9YF06IHMudmFsdWUuYm9keVNhbXBsZSB8fCBcIm4vYVwiLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2gge31cbiAgICB9XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgKGJ5VHlwZVtlcC5wYWdlX3R5cGVdID0gYnlUeXBlW2VwLnBhZ2VfdHlwZV0gfHwgW10pLnB1c2goLi4uaXRlbXMpO1xuICB9XG5cbiAgLy8gTWFzayBnYXRlIGlzIHJlYWQgZnJlc2ggcGVyIHN5bmMgXHUyMDE0IGRlZmF1bHRzIE9GRiBwZXIgdGhlIGRpc2N1c3Npb25cbiAgLy8gKGNpdGl6ZW4tc2VsZi1kb3dubG9hZCBkb2Vzbid0IG5lZWQgYW5vbnltaXphdGlvbikuIFdoZW4gT04sIGFsc29cbiAgLy8gc2NydWIgdGhlIHVzZXIncyByZWFsIG5hbWUgb3V0IG9mIGFueSBOSEkgbmFycmF0aXZlIGZpZWxkIGJlZm9yZVxuICAvLyBpdCBmbG93cyBpbnRvIHRoZSBtYXBwZXIuXG4gIGNvbnN0IG1hc2tFbmFibGVkID0gYXdhaXQgX2lzTWFza0VuYWJsZWQoKTtcbiAgaWYgKG1hc2tFbmFibGVkICYmIHBhdGllbnRPdmVycmlkZS5uYW1lKSB7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoYnlUeXBlKSkge1xuICAgICAgYnlUeXBlW2tleV0gPSBfcmVwbGFjZU5hbWVEZWVwKGJ5VHlwZVtrZXldLCBwYXRpZW50T3ZlcnJpZGUubmFtZSwgcmVwbGFjZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIGxldCB0b3RhbCA9IDA7XG4gIGxldCBfbG9jYWxGaWxlbmFtZSA9IG51bGw7XG4gIGlmIChtb2RlID09PSBcImxvY2FsXCIpIHtcbiAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNFXHVEREVDIFx1OEY0OVx1NjNEQlx1NzBCQVx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1NkE5NFx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogMCB9KTtcbiAgICBsZXQgYnVuZGxlO1xuICAgIHRyeSB7XG4gICAgICBidW5kbGUgPSBfYXNzZW1ibGVMb2NhbEJ1bmRsZShieVR5cGUsIHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9ycy5wdXNoKGBsb2NhbCBtYXBwaW5nOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIGJ1bmRsZSA9IG51bGw7XG4gICAgfVxuICAgIGlmIChidW5kbGUpIHtcbiAgICAgIHRvdGFsID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBgXHVEODNEXHVEQ0JFIFx1NkU5Nlx1NTA5OSAke3RvdGFsfSBcdTdCNDYgRkhJUiBcdThDQzdcdTZFOTBcdTIwMjZgLCB0b3RhbFJlc291cmNlczogdG90YWwgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkbCA9IGF3YWl0IF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sIGRhdGVSYW5nZSk7XG4gICAgICAgIF9sb2NhbEZpbGVuYW1lID0gZGwuZmlsZW5hbWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBzdGFzaCBidW5kbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBCdWlsZCB0aGUgb3ZlcnJpZGUgd2Ugc2VuZCB0byBiYWNrZW5kIHdpdGggdGhlIG1heWJlLW1hc2tlZCBuYW1lXG4gICAgLy8gc28gYmFja2VuZCdzIGF1dG8tY3JlYXRlZCBQYXRpZW50ICsgdGhlIHBlci1pdGVtIHN1YmplY3QuZGlzcGxheVxuICAgIC8vIHNlZSB0aGUgc2FtZSB2YWx1ZSB0aGUgdXNlciBvcHRlZCBpbnRvLiBJdGVtcyB0aGVtc2VsdmVzIHdlcmVcbiAgICAvLyBhbHJlYWR5IHNjcnViYmVkIGFib3ZlIChieVR5cGUgcGFzcyksIHNvIHRoaXMganVzdCBjb3ZlcnMgdGhlXG4gICAgLy8gb3ZlcnJpZGUtZGVyaXZlZCBQYXRpZW50LlxuICAgIGNvbnN0IHVwbG9hZE92ZXJyaWRlID0gbWFza0VuYWJsZWQgJiYgcGF0aWVudE92ZXJyaWRlLm5hbWVcbiAgICAgID8geyAuLi5wYXRpZW50T3ZlcnJpZGUsIG5hbWU6IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lKSB9XG4gICAgICA6IHBhdGllbnRPdmVycmlkZTtcbiAgICBmb3IgKGNvbnN0IFtwYWdlX3R5cGUsIGl0ZW1zXSBvZiBPYmplY3QuZW50cmllcyhieVR5cGUpKSB7XG4gICAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1MkIwNlx1RkUwRiBcdTRFMEFcdTUwQjMgJHtwYWdlX3R5cGV9XHVGRjA4JHtpdGVtcy5sZW5ndGh9IFx1N0I0Nlx1RkYwOVx1MjAyNmAsXG4gICAgICAgIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IF9wb3N0U3RydWN0dXJlZChiYWNrZW5kLCBwYWdlX3R5cGUsIGl0ZW1zLCBzeW5jQXBpS2V5LCB1cGxvYWRPdmVycmlkZSk7XG4gICAgICAgIHRvdGFsICs9IGRhdGEuY291bnQgfHwgMDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYHVwbG9hZCAke3BhZ2VfdHlwZX06ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFmdGVyIGJhY2tlbmQgdXBsb2FkLCBhbHNvIGZldGNoIGEgc25hcHNob3Qgb2YgdGhlIHBhdGllbnQncyBmdWxsXG4gICAgLy8gY3VtdWxhdGl2ZSBGSElSIEJ1bmRsZSBhbmQgc3Rhc2ggaXQgZm9yIHRoZSBwb3B1cCdzIFwiXHVEODNEXHVEQ0U1IFx1NEUwQlx1OEYwOVwiIGJ1dHRvbi5cbiAgICAvLyBUaGlzIGlzIHdoYXQgYC9maGlyL2V4cG9ydGAgcmV0dXJucyBcdTIwMTQgdGhlIGJhY2tlbmQncyBjb21wbGV0ZSB2aWV3XG4gICAgLy8gb2YgdGhpcyBwYXRpZW50ICh0aGlzIHN5bmMgKyBhbnkgcHJpb3Igc3luY3MpLCBhcyBvcHBvc2VkIHRvIGxvY2FsXG4gICAgLy8gbW9kZSdzIFwianVzdCB0aGlzIHN5bmNcIiBidW5kbGUuXG4gICAgLy9cbiAgICAvLyBTa2lwIHN0YXNoaW5nIGVudGlyZWx5IHdoZW4gdGhlIHVwbG9hZCBwYXNzIHByb2R1Y2VkIG5vIHJlc291cmNlc1xuICAgIC8vIFx1MjAxNCBleHBvcnRpbmcgMCBlbnRyaWVzIHRoZW4gc3Rhc2hpbmcgdGhlbSBjcmVhdGVzIGEgbWlzbGVhZGluZ1xuICAgIC8vIFwiXHU2NzJDXHU1NzMwIFx1MjcxMyAwIFx1N0I0NlwiIGluZGljYXRvciBhbmQgYSB1c2VsZXNzIFx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjMgYnV0dG9uLlxuICAgIGlmIChwYXRpZW50T3ZlcnJpZGUuaWRfbm8gJiYgdG90YWwgPiAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogXCJcdUQ4M0RcdURDRTYgXHU1M0Q2XHU1Rjk3XHU1RjhDXHU3QUVGXHU1QjhDXHU2NTc0XHU4Q0M3XHU2NTk5XHUyMDI2XCIsIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCB9KTtcbiAgICAgICAgLy8gQmFja2VuZCBzdG9yZXMgUGF0aWVudCB1bmRlciBkZXJpdmVQYXRpZW50SWQocmF3SWQpLCBzbyB0aGVcbiAgICAgICAgLy8gZXhwb3J0IGZpbHRlciBtdXN0IHVzZSB0aGUgaGFzaGVkIGZvcm0gXHUyMDE0IHF1ZXJ5aW5nIHdpdGggdGhlXG4gICAgICAgIC8vIHJhdyBuYXRpb25hbCBJRCBtYXRjaGVzIHplcm8gcm93cyBldmVuIHdoZW4gZGF0YSBpcyB0aGVyZS5cbiAgICAgICAgY29uc3QgZmhpclBpZCA9IGRlcml2ZVBhdGllbnRJZChwYXRpZW50T3ZlcnJpZGUuaWRfbm8pO1xuICAgICAgICBjb25zdCBleHBVcmwgPSBgJHtiYWNrZW5kfS9maGlyL2V4cG9ydD9wYXRpZW50PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWA7XG4gICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChleHBVcmwsIHtcbiAgICAgICAgICBoZWFkZXJzOiBzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9LFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHIub2spIHtcbiAgICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAvLyBQYXNzIHRoZSBzYW1lIGRhdGVSYW5nZSB0aGUgdXNlciBwaWNrZWQgdGhyb3VnaCBzbyB0aGVcbiAgICAgICAgICAvLyBkb3dubG9hZGVkIGZpbGVuYW1lIHJlZmxlY3RzIFwiXHU2NzAwXHU4RkQxIDMgXHU1RTc0XCIgXHUyMTkyIDIwMjMtMjAyNiBpbnN0ZWFkXG4gICAgICAgICAgLy8gb2YgYWx3YXlzIHN5bnRoZXNpemluZyB0b2RheS0xeSBcdTIxOTIgdG9kYXkuXG4gICAgICAgICAgY29uc3QgZGwgPSBhd2FpdCBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudE92ZXJyaWRlLmlkX25vLCBkYXRlUmFuZ2UpO1xuICAgICAgICAgIF9sb2NhbEZpbGVuYW1lID0gZGwuZmlsZW5hbWU7XG4gICAgICAgICAgLy8gQWxpZ24gcmVwb3J0ZWQgY291bnQgd2l0aCBsb2NhbCBtb2RlOiBidW5kbGUuZW50cnkubGVuZ3RoXG4gICAgICAgICAgLy8gaW5jbHVkZXMgdGhlIFBhdGllbnQgcmVzb3VyY2UgKHdoaWNoIHRoZSBwZXItcGFnZS10eXBlIFBPU1RcbiAgICAgICAgICAvLyBjb3VudHMgaGFkIHByZXZpb3VzbHkgb21pdHRlZCBiZWNhdXNlIFBhdGllbnQgaXMgYXV0by1jcmVhdGVkXG4gICAgICAgICAgLy8gc2lsZW50bHkgZnJvbSBwYXRpZW50X292ZXJyaWRlKS4gU2FtZSBkYXRhIFx1MjE5MiBzYW1lIG51bWJlci5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIERlZmVuc2l2ZTogb25seSBPVkVSV1JJVEUgdG90YWwgd2hlbiBleHBvcnQgYWN0dWFsbHkgcmV0dXJuZWRcbiAgICAgICAgICAvLyBzb21ldGhpbmcuIElmIGV4cG9ydCByZXR1cm5zIDAgZW50cmllcyBkZXNwaXRlIGEgc3VjY2Vzc2Z1bFxuICAgICAgICAgIC8vIHVwbG9hZCAoY291bGQgaGFwcGVuIHdpdGggYSBzdGFsZS1EQiBoYXNoIG1pc21hdGNoIHdlIGhhdmVuJ3RcbiAgICAgICAgICAvLyBmaXhlZCB5ZXQpLCBkb24ndCBjbG9iYmVyIHRoZSB0cnV0aGZ1bCB1cGxvYWQgY291bnQgXHUyMDE0IHRoYXQnc1xuICAgICAgICAgIC8vIGV4YWN0bHkgdGhlIGJ1ZyB0aGF0IG1hZGUgXCJcdTVERjJcdTY2RjRcdTY1QjAgODEgXHU3QjQ2XCIgc2lsZW50bHkgYmVjb21lXG4gICAgICAgICAgLy8gXCJcdTVERjJcdTY2RjRcdTY1QjAgMCBcdTdCNDZcIi5cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShidW5kbGUuZW50cnkpICYmIGJ1bmRsZS5lbnRyeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0b3RhbCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9ycy5wdXNoKGBleHBvcnQgYnVuZGxlOiBIVFRQICR7ci5zdGF0dXN9YCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGV4cG9ydCBidW5kbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKG1vZGUgPT09IFwibG9jYWxcIiA/IFwiYXNzZW1ibGUrc3Rhc2hcIiA6IFwiYmFja2VuZC11cGxvYWRcIik7XG5cbiAgLy8gRm9ybWF0IGVsYXBzZWQgd2FsbC1jbG9jayB0aW1lOiBzZWNvbmRzICgxIGRwKSBmb3Igc2hvcnQgc3luY3MsXG4gIC8vIFwibW06c3NcIiBvbmNlIHdlIGNyb3NzIHRoZSBtaW51dGUgbWFyayBzbyB0aGUgcG9wdXAgc3RhdHVzIHN0YXlzIHJlYWRhYmxlLlxuICBjb25zdCBfZWxhcHNlZE1zID0gRGF0ZS5ub3coKSAtIF90MDtcbiAgY29uc3QgX2VsYXBzZWRTdHIgPSBfZWxhcHNlZE1zIDwgNjBfMDAwXG4gICAgPyBgJHsoX2VsYXBzZWRNcyAvIDEwMDApLnRvRml4ZWQoMSl9c2BcbiAgICA6IGAke01hdGguZmxvb3IoX2VsYXBzZWRNcyAvIDYwXzAwMCl9bSR7TWF0aC5yb3VuZCgoX2VsYXBzZWRNcyAlIDYwXzAwMCkgLyAxMDAwKX1zYDtcbiAgLy8gTm8gbW9yZSBcIlx1NkE5NFx1Njg0OFx1NURGMlx1NTA5OVx1NTlBNVx1MjAyNlwiIHRhaWwgXHUyMDE0IHRoZSBcdUQ4M0RcdURDRTUgZG93bmxvYWQgYnV0dG9uIHNpdHMgcmlnaHRcbiAgLy8gYmVsb3cgdGhlIHN0YXR1cywgc28gc2F5aW5nIFwiXHU5RURFXHU0RTBCXHU2NUI5XHU2MzA5XHU5MjE1XCIgaXMganVzdCBub2lzZS5cbiAgY29uc3QgX2xvY2FsVGFpbCA9IFwiXCI7XG4gIGNvbnN0IF9zdWNjZXNzVmVyYiA9IG1vZGUgPT09IFwibG9jYWxcIiA/IFwiXHU1REYyXHU3NTIyXHU3NTFGXCIgOiBcIlx1NURGMlx1NjZGNFx1NjVCMFwiO1xuICAvLyBQaGFzZSB0aW1pbmdzIChgbmhpLXBhcmFsbGVsPThzYCwgYGJhY2tlbmQtdXBsb2FkPTAuOHNgKSBhcmUgZGV2XG4gIC8vIGluZm8gXHUyMDE0IHVzZWZ1bCB3aGVuIGludmVzdGlnYXRpbmcgYSBzbG93IHN5bmMgYnV0IG5vaXNlIGZvciBhbiBlbmRcbiAgLy8gdXNlci4gS2VlcCB0aGVtLCBidXQgdGFnIHdpdGggdGhlIFwiXHUyM0YxXCIgcHJlZml4IHRoZSBwb3B1cCB1c2VzIHRvXG4gIC8vIHR1Y2sgdGhlbSBpbnRvIGEgZGVlcGVyIFwiXHU2MjgwXHU4ODUzXHU3RDMwXHU3QkMwXCIgc3ViLXRvZ2dsZS5cbiAgY29uc3QgX3BoYXNlTGluZXMgPSBfcGhhc2VzLm1hcCgocCkgPT4gYFx1MjNGMSAke3AubmFtZX09JHsocC5tcyAvIDEwMDApLnRvRml4ZWQoMSl9c2ApO1xuICBjb25zdCBfZnVsbEJyZWFrZG93biA9IFsuLi5icmVha2Rvd24sIC4uLl9waGFzZUxpbmVzXTtcblxuICAvLyBQaWNrIHRoZSByaWdodCBzdW1tYXJ5IGxpbmUuIFplcm8tcmVzdWx0IGlzIHRoZSB0cmlja2llc3QgY2FzZTpcbiAgLy8gd2UgZG9uJ3Qgd2FudCBhIGdyZWVuIFx1MjcwNSBzYXlpbmcgXCIwIFx1N0I0NlwiIGJlY2F1c2UgdGhhdCByZWFkcyBhc1xuICAvLyBcInN1Y2NlZWRlZCB3aXRoIHplcm8gZGF0YVwiLiBUaGF0J3MgYWxtb3N0IGFsd2F5cyBvbmUgb2Y6XG4gIC8vICAgLSBOSEkgc2Vzc2lvbiBleHBpcmVkIGJldHdlZW4gdGhlIGxvZ2luIHByb2JlIGFuZCB0aGUgc3luY1xuICAvLyAgICAgKHRoZSBJSEtFMzQxMCBwcm9iZSBjYW4gc3RpbGwgc3VjY2VlZCB3aGlsZSBkYXRhIGVuZHBvaW50c1xuICAvLyAgICAgcmVzcG9uZCB3aXRoIGVtcHR5IGFycmF5cyk7XG4gIC8vICAgLSB0aGUgdXNlciB0cnVseSBoYXMgbm8gcmVjb3JkcyBpbiB0aGUgc2VsZWN0ZWQgZGF0ZSByYW5nZS5cbiAgLy8gRWl0aGVyIHdheSB0aGUgYWN0aW9uYWJsZSBuZXh0IHN0ZXAgaXMgXCJcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjUgTkhJIFx1NTE4RFx1OEE2Nlx1NEUwMFx1NkIyMVwiLlxuICBsZXQgX3N1bW1hcnlMaW5lO1xuICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgIF9zdW1tYXJ5TGluZSA9IGBcdTI2QTBcdUZFMEYgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyAke19zdWNjZXNzVmVyYn0gJHt0b3RhbH0gXHU3QjQ2XHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHVGRjBDJHtlcnJvcnMubGVuZ3RofSBcdTk4MDVcdTU5MzFcdTY1NTdcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOSR7X2xvY2FsVGFpbH1gO1xuICB9IGVsc2UgaWYgKHRvdGFsID09PSAwKSB7XG4gICAgX3N1bW1hcnlMaW5lID1cbiAgICAgIGBcdTI2QTBcdUZFMEYgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwXHU0RjQ2XHU2QzkyXHU2MjkzXHU1MjMwXHU0RUZCXHU0RjU1XHU4Q0M3XHU2NTk5XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDlcdTIwMTQgYCArXG4gICAgICBgXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBIHNlc3Npb24gXHU1M0VGXHU4MEZEXHU5MDRFXHU2NzFGXHVGRjBDXHU4QUNCXHU1NkRFXHU4QTcyXHU1MjA2XHU5ODAxXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XHVGRjFCXHU2MjE2XHU2MkM5XHU5NTc3XHUzMDBDXHU2NUU1XHU2NzFGXHU3QkM0XHU1NzBEXHUzMDBEXHU1MThEXHU4QTY2XHUzMDAyYDtcbiAgfSBlbHNlIHtcbiAgICBfc3VtbWFyeUxpbmUgPSBgXHUyNzA1IFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgJHtfc3VjY2Vzc1ZlcmJ9ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5JHtfbG9jYWxUYWlsfWA7XG4gIH1cblxuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgIHByb2dyZXNzOiBfc3VtbWFyeUxpbmUsXG4gICAgcGhhc2U6IFwiZG9uZVwiLFxuICAgIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCxcbiAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgZWxhcHNlZE1zOiBfZWxhcHNlZE1zLFxuICAgIC8vIFBlci1lbmRwb2ludCBicmVha2Rvd24gZm9yIHRoZSBwb3B1cCdzICdcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzAnIGNvbGxhcHNpYmxlLlxuICAgIC8vIEtlZXAgYXMgYSBwbGFpbiBhcnJheSBzbyBwb3B1cC5qcyBjYW4gcmVuZGVyIHdpdGggRE9NIEFQSSAobm9cbiAgICAvLyBpbm5lckhUTUwgLyBubyBlc2NhcGluZyBjb25jZXJucykuIEl0ZW1zIGxvb2sgbGlrZVxuICAgIC8vICdlbmNvdW50ZXJzPTEyLzEyJyBvciAnYWR1bHRfcHJldmVudGl2ZT0yIHJvd3MgXHUyMTkyIDM2IG9icycuXG4gICAgYnJlYWtkb3duOiBfZnVsbEJyZWFrZG93bixcbiAgICBlcnJvcnMsXG4gICAgaGlzdG5vOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sXG4gICAgbW9kZSxcbiAgICBsb2NhbEZpbGVuYW1lOiBfbG9jYWxGaWxlbmFtZSxcbiAgfSk7XG5cbiAgLy8gQmVzdC1lZmZvcnQ6IHdyaXRlIGEgU3luYyBIaXN0b3J5IHJvdyB0byB0aGUgYmFja2VuZCBzbyB0aGUgZGFzaGJvYXJkXG4gIC8vIGNhbiBzaG93IHdoZW4vd2hvL2hvdy1sb25nL3doYXQvcmFuZ2UuIFNraXBwZWQgaW4gbG9jYWwgbW9kZSAodGhlcmVcbiAgLy8gaXMgbm8gYmFja2VuZCkuIFdyYXBwZWQgKyBzd2FsbG93ZWQgc28gYSBsb2dnaW5nIGZhaWx1cmUgbmV2ZXJcbiAgLy8gcHJvcGFnYXRlcyBiYWNrIHRvIHRoZSB1c2VyLWZhY2luZyBzeW5jIHN0YXR1cy5cbiAgaWYgKG1vZGUgIT09IFwibG9jYWxcIikgdHJ5IHtcbiAgICBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL2xvZ2AsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBzdGF0dXM6IGVycm9ycy5sZW5ndGggPyBcInBhcnRpYWxcIiA6IFwic3VjY2Vzc1wiLFxuICAgICAgICBwYXRpZW50X2lkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIixcbiAgICAgICAgLy8gL3N5bmMvbG9nIGxhbmRzIGluIHRoZSBkYXNoYm9hcmQncyBzeW5jLWhpc3Rvcnkgcm93LiBPbmx5XG4gICAgICAgIC8vIG1hc2sgd2hlbiB0aGUgdXNlciBoYXMgb3B0ZWQgaW4gXHUyMDE0IG90aGVyd2lzZSBkYXNoYm9hcmQgc2Vlc1xuICAgICAgICAvLyB0aGUgcmF3IG5hbWUgdGhleSB0eXBlZCAoY29uc2lzdGVudCB3aXRoIFwiXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4XCIgZGVmYXVsdCkuXG4gICAgICAgIHBhdGllbnRfbmFtZTogbWFza0VuYWJsZWRcbiAgICAgICAgICA/IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCIpXG4gICAgICAgICAgOiBwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiLFxuICAgICAgICB0b3RhbCxcbiAgICAgICAgYnJlYWtkb3duLFxuICAgICAgICBkYXRlX3JhbmdlOiBkYXRlUmFuZ2VMYWJlbCB8fCBcIlwiLFxuICAgICAgICBlbGFwc2VkX21zOiBfZWxhcHNlZE1zLFxuICAgICAgICBzdGFydGVkX2F0OiBuZXcgRGF0ZShfdDApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIGVycm9ycyxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBmYWlsZWQgdG8gd3JpdGUgaGlzdG9yeSBsb2c6XCIsIGUpO1xuICB9XG4gIF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbn1cblxuLy8gT25lLXRpbWUgbWlncmF0aW9uIGZyb20gY2hyb21lLnN0b3JhZ2Uuc3luYyBcdTIxOTIgY2hyb21lLnN0b3JhZ2UubG9jYWwuXG4vLyBQcmV2aW91cyB2ZXJzaW9ucyBzdG9yZWQgc3luY0FwaUtleSArIHBhdGllbnRPdmVycmlkZSAoY29udGFpbmluZyB0aGVcbi8vIG5hdGlvbmFsIElEKSB1bmRlciAuc3luYywgd2hpY2ggQ2hyb21lIHJlcGxpY2F0ZXMgdG8gdGhlIHVzZXIncyBHb29nbGVcbi8vIGFjY291bnQgYW5kIHB1c2hlcyB0byBldmVyeSBkZXZpY2UgdGhleSBzaWduIGludG8uIE1vdmUgZXZlcnl0aGluZ1xuLy8gc2V0dGluZ3MtcmVsYXRlZCB0byAubG9jYWw7IGNsZWFyIHRoZSBzeW5jIGNvcHkuXG5jb25zdCBTWU5DX0tFWVNfVE9fTUlHUkFURSA9IFtcbiAgXCJiYWNrZW5kVXJsXCIsXG4gIFwic3luY0FwaUtleVwiLFxuICBcInNtYXJ0QXBwTGF1bmNoVXJsXCIsXG4gIFwicGF0aWVudE92ZXJyaWRlXCIsXG4gIFwic3luY01vZGVcIixcbiAgXCJtYXNrTmFtZUVuYWJsZWRcIixcbl07XG5cbmFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGVTeW5jVG9Mb2NhbCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzeW5jZWQgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChTWU5DX0tFWVNfVE9fTUlHUkFURSk7XG4gICAgY29uc3QgcHJlc2VudCA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgIE9iamVjdC5lbnRyaWVzKHN5bmNlZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgICApO1xuICAgIGlmIChPYmplY3Qua2V5cyhwcmVzZW50KS5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBjb25zdCBsb2NhbCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChPYmplY3Qua2V5cyhwcmVzZW50KSk7XG4gICAgLy8gRG9uJ3Qgb3ZlcndyaXRlIGFueXRoaW5nIHRoZSB1c2VyIGFscmVhZHkgc2V0IG9uIHRoaXMgbWFjaGluZS5cbiAgICBjb25zdCB0b1dyaXRlID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgT2JqZWN0LmVudHJpZXMocHJlc2VudCkuZmlsdGVyKChba10pID0+IGxvY2FsW2tdID09PSB1bmRlZmluZWQpLFxuICAgICk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHRvV3JpdGUpLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh0b1dyaXRlKTtcbiAgICB9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoT2JqZWN0LmtleXMocHJlc2VudCkpO1xuICB9IGNhdGNoIHtcbiAgICAvLyBNaWdyYXRpb24gaXMgYmVzdC1lZmZvcnQuIFRoZSBuZXh0IHJ1biBnZXRzIHRvIHRyeSBhZ2Fpbi5cbiAgfVxufVxuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihhc3luYyAoKSA9PiB7XG4gIGF3YWl0IG1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xufSk7XG5cbi8vIEFsc28gcnVuIG1pZ3JhdGlvbiBvbiBzZXJ2aWNlLXdvcmtlciB3YWtlLXVwIChjb3ZlcnMgcmVsb2FkL3Jlc3RhcnRcbi8vIHBhdGhzIHdoZXJlIG9uSW5zdGFsbGVkIGRvZXNuJ3QgZmlyZSkuXG5jaHJvbWUucnVudGltZS5vblN0YXJ0dXA/LmFkZExpc3RlbmVyPy4oKCkgPT4ge1xuICBtaWdyYXRlU3luY1RvTG9jYWwoKTtcbn0pO1xubWlncmF0ZVN5bmNUb0xvY2FsKCk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICBpZiAobXNnPy50eXBlID09PSBcInN0YXJ0TmhpQXBpU3luY1wiKSB7XG4gICAgcnVuTmhpQXBpU3luYyhtc2cucGF5bG9hZCkudGhlbihcbiAgICAgICgpID0+IHsgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge30gfSxcbiAgICAgIGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGlmIChlPy5tZXNzYWdlID09PSBDQU5DRUxfRVJST1IpIHtcbiAgICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSwgY2FuY2VsbGVkOiB0cnVlIH0pOyB9IGNhdGNoIHt9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlPy5tZXNzYWdlID09PSBTRVNTSU9OX0VYUElSRURfRVJST1IpIHtcbiAgICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgICAgICAgc3luY1N0YXR1czoge1xuICAgICAgICAgICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgcHJvZ3Jlc3M6IFwiXHVEODNEXHVERDEyIE5ISSBzZXNzaW9uIFx1NURGMlx1NzY3Qlx1NTFGQSBcdTIwMTQgXHU4QUNCXHU1NzI4IE5ISSB0YWIgXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XHU1RjhDXHU1MThEXHU5RURFIFN5bmNcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwic2Vzc2lvbl9leHBpcmVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLCBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiBmYWxzZSwgZXhwaXJlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmVycm9yKFwicnVuTmhpQXBpU3luYyBmYWlsZWRcIiwgZSk7XG4gICAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHJ1bm5pbmc6IGZhbHNlLCBwcm9ncmVzczogYFx1Mjc0QyAke2UubWVzc2FnZX1gLCBwaGFzZTogXCJlcnJvclwiIH0pO1xuICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGVycm9yOiBlLm1lc3NhZ2UgfSk7IH0gY2F0Y2gge31cbiAgICAgIH0sXG4gICAgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcInN0b3BTeW5jXCIpIHtcbiAgICAvLyBTZXQgdGhlIGNhbmNlbGxhdGlvbiBmbGFnOyB0aGUgaW4tZmxpZ2h0IHN5bmMgd2lsbCB0aHJvd1xuICAgIC8vIENBTkNFTF9FUlJPUiBhdCBpdHMgbmV4dCBjaGVja0NhbmNlbCgpIGNhbGwuICBTdG9yYWdlIGlzIGFscmVhZHlcbiAgICAvLyB1cGRhdGVkIGJ5IHRoZSBwb3B1cCwgc28gd2UgZG9uJ3QgdG91Y2ggaXQgaGVyZS5cbiAgICBfY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAvLyBEaXNjYXJkIGFueSBwYXJ0aWFsIGRhdGEgdXBsb2FkZWQgc28gZmFyLiBUaGUgdXNlcidzIHN0YXRlZFxuICAgIC8vIGNvbnRyYWN0IGlzICdzdG9wID0gYWJvcnQsIEknbGwgcmVzeW5jIGZyb20gc2NyYXRjaCBsYXRlcicgXHUyMDE0IHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byBsZWF2ZSBhIGhhbGYtbG9hZGVkIHBhdGllbnQgaW4gdGhlIEZISVIgc3RvcmUgdGhhdFxuICAgIC8vIGxvb2tzIGNvbXBsZXRlIHRvIGRvd25zdHJlYW0gU01BUlQgYXBwcy5cbiAgICBjb25zdCBjdHggPSBfYWN0aXZlU3luY0N0eDtcbiAgICBpZiAoY3R4Py5wYXRpZW50SWQgJiYgY3R4LmJhY2tlbmQpIHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICBgJHtjdHguYmFja2VuZH0vc3luYy9wYXRpZW50LyR7ZW5jb2RlVVJJQ29tcG9uZW50KGN0eC5wYXRpZW50SWQpfWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgaGVhZGVyczogY3R4LnN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogY3R4LnN5bmNBcGlLZXkgfSA6IHt9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIFN1cmZhY2UgdGhlIHdpcGUgaW4gdGhlIHN0YXR1cyBzbyB1c2VyIHNlZXMgaXQgYWN0dWFsbHkgaGFwcGVuZWQuXG4gICAgICAgICAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIFtTVE9SQUdFX0tFWV06IHtcbiAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdTVERjJcdTUwNUNcdTZCNjJcdTRFMjZcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTkgXHUyMDE0IFx1OEFDQlx1OTFDRFx1NjVCMFx1NTNENlx1NUY5N1wiLFxuICAgICAgICAgICAgICBwaGFzZTogXCJjYW5jZWxsZWRcIixcbiAgICAgICAgICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICAgICAgICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIGNhbmNlbCB3aXBlIGZhaWxlZDpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfVxuICAgIF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbiAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2c/LnR5cGUgPT09IFwiZ2V0U3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKS50aGVuKChkYXRhKSA9PiBzZW5kUmVzcG9uc2UoZGF0YVtTVE9SQUdFX0tFWV0gfHwgbnVsbCkpO1xuICAgIHJldHVybiB0cnVlOyAgLy8gYXN5bmMgcmVzcG9uc2VcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImNsZWFyU3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFNUT1JBR0VfS0VZKS50aGVuKCgpID0+IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImNoZWNrTmhpTG9naW5cIikge1xuICAgIF9jaGVja05oaUxvZ2luU3RhdGUobXNnLnRhYklkKS50aGVuKFxuICAgICAgKHN0YXRlKSA9PiB7IHRyeSB7IHNlbmRSZXNwb25zZSh7IGxvZ2dlZEluOiBzdGF0ZSB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICAgKCkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogbnVsbCB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuXG4vLyBCZWx0LWFuZC1zdXNwZW5kZXJzIFNXIGtlZXBhbGl2ZTogYW4gYWxhcm0gZXZlcnkgMjAgcyB3YWtlcyB0aGUgU1cgaWZcbi8vIGlkbGUuIENvbWJpbmVkIHdpdGggdGhlIHJldHVybi10cnVlIHBhdHRlcm4gYWJvdmUsIHRoaXMgcHJldmVudHMgdGhlXG4vLyAzMCBzIGlkbGUgc2h1dGRvd24gZnJvbSBlbmRpbmcgYW4gaW4tcHJvZ3Jlc3Mgc3luYy5cbmNocm9tZS5hbGFybXMuY3JlYXRlKFwic3cta2VlcGFsaXZlXCIsIHsgcGVyaW9kSW5NaW51dGVzOiAwLjM0IH0pO1xuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKCgpID0+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QVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUk7QUFBQSxRQUMzRDtBQUVBLGFBQUssVUFBVSxXQUFXLEtBQUssVUFBVTtBQUV6QyxhQUFLLFVBQVUsU0FBUyxXQUFZO0FBQ2xDLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLO0FBRXRFLGlCQUFPO0FBQUEsWUFDSixPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxJQUFLO0FBQUEsWUFBTSxLQUFLO0FBQUEsWUFDL0QsT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sSUFBSztBQUFBLFlBQU0sS0FBSztBQUFBLFlBQy9ELE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLElBQUs7QUFBQSxZQUFNLEtBQUs7QUFBQSxZQUMvRCxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxJQUFLO0FBQUEsWUFBTSxLQUFLO0FBQUEsWUFDL0QsT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sSUFBSztBQUFBLFlBQU0sS0FBSztBQUFBLFVBQ2xFO0FBQUEsUUFDRjtBQUVBLGFBQUssVUFBVSxRQUFRLEtBQUssVUFBVTtBQUV0QyxhQUFLLFVBQVUsY0FBYyxXQUFZO0FBQ3ZDLGVBQUssU0FBUztBQUVkLGNBQUksU0FBUyxJQUFJLFlBQVksRUFBRTtBQUMvQixjQUFJLFdBQVcsSUFBSSxTQUFTLE1BQU07QUFDbEMsbUJBQVMsVUFBVSxHQUFHLEtBQUssRUFBRTtBQUM3QixtQkFBUyxVQUFVLEdBQUcsS0FBSyxFQUFFO0FBQzdCLG1CQUFTLFVBQVUsR0FBRyxLQUFLLEVBQUU7QUFDN0IsbUJBQVMsVUFBVSxJQUFJLEtBQUssRUFBRTtBQUM5QixtQkFBUyxVQUFVLElBQUksS0FBSyxFQUFFO0FBQzlCLGlCQUFPO0FBQUEsUUFDVDtBQUVBLGlCQUFTLFNBQVMsS0FBSyxjQUFjO0FBQ25DLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUNqQyxnQkFBTSxPQUFPLENBQUM7QUFDZCxjQUFJLE9BQU8sQ0FBQyxHQUFHO0FBQ2IsZ0JBQUksUUFBUSxDQUFDLEdBQUcsU0FBUyxJQUFJLFFBQVEsUUFBUSxHQUFHO0FBQ2hELGlCQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxHQUFHO0FBQzNCLHFCQUFPLElBQUksV0FBVyxDQUFDO0FBQ3ZCLGtCQUFJLE9BQU8sS0FBTTtBQUNmLHNCQUFNLE9BQU8sSUFBSTtBQUFBLGNBQ25CLFdBQVcsT0FBTyxNQUFPO0FBQ3ZCLHNCQUFNLE9BQU8sSUFBSyxNQUFRLFNBQVM7QUFDbkMsc0JBQU0sT0FBTyxJQUFLLE1BQVEsT0FBTztBQUFBLGNBQ25DLFdBQVcsT0FBTyxTQUFVLFFBQVEsT0FBUTtBQUMxQyxzQkFBTSxPQUFPLElBQUssTUFBUSxTQUFTO0FBQ25DLHNCQUFNLE9BQU8sSUFBSyxNQUFTLFNBQVMsSUFBSztBQUN6QyxzQkFBTSxPQUFPLElBQUssTUFBUSxPQUFPO0FBQUEsY0FDbkMsT0FBTztBQUNMLHVCQUFPLFVBQWEsT0FBTyxTQUFVLEtBQU8sSUFBSSxXQUFXLEVBQUUsQ0FBQyxJQUFJO0FBQ2xFLHNCQUFNLE9BQU8sSUFBSyxNQUFRLFNBQVM7QUFDbkMsc0JBQU0sT0FBTyxJQUFLLE1BQVMsU0FBUyxLQUFNO0FBQzFDLHNCQUFNLE9BQU8sSUFBSyxNQUFTLFNBQVMsSUFBSztBQUN6QyxzQkFBTSxPQUFPLElBQUssTUFBUSxPQUFPO0FBQUEsY0FDbkM7QUFBQSxZQUNGO0FBQ0Esa0JBQU07QUFBQSxVQUNSO0FBRUEsY0FBSSxJQUFJLFNBQVMsSUFBSTtBQUNuQixrQkFBTyxJQUFJLEtBQUssSUFBSSxFQUFHLE9BQU8sR0FBRyxFQUFFLE1BQU07QUFBQSxVQUMzQztBQUVBLGNBQUksVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO0FBQzdCLGVBQUssSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDdkIsZ0JBQUksSUFBSSxJQUFJLENBQUMsS0FBSztBQUNsQixvQkFBUSxDQUFDLElBQUksS0FBTztBQUNwQixvQkFBUSxDQUFDLElBQUksS0FBTztBQUFBLFVBQ3RCO0FBRUEsZUFBSyxLQUFLLE1BQU0sWUFBWTtBQUU1QixlQUFLLE9BQU8sT0FBTztBQUNuQixlQUFLLFVBQVU7QUFDZixlQUFLLFFBQVE7QUFDYixlQUFLLGVBQWU7QUFBQSxRQUN0QjtBQUNBLGlCQUFTLFlBQVksSUFBSSxLQUFLO0FBRTlCLGlCQUFTLFVBQVUsV0FBVyxXQUFZO0FBQ3hDLGVBQUssVUFBVSxTQUFTLEtBQUssSUFBSTtBQUNqQyxjQUFJLEtBQUssT0FBTztBQUNkLGlCQUFLLFFBQVE7QUFDYixnQkFBSSxZQUFZLEtBQUssTUFBTTtBQUMzQixpQkFBSyxLQUFLLE1BQU0sS0FBSyxZQUFZO0FBQ2pDLGlCQUFLLE9BQU8sS0FBSyxPQUFPO0FBQ3hCLGlCQUFLLE9BQU8sU0FBUztBQUNyQixpQkFBSyxVQUFVLFNBQVMsS0FBSyxJQUFJO0FBQUEsVUFDbkM7QUFBQSxRQUNGO0FBRUEsWUFBSUMsV0FBVSxhQUFhO0FBQzNCLFFBQUFBLFNBQVEsT0FBT0E7QUFDZixRQUFBQSxTQUFRLEtBQUssT0FBTyxpQkFBaUI7QUFFckMsWUFBSSxXQUFXO0FBQ2IsaUJBQU8sVUFBVUE7QUFBQSxRQUNuQixPQUFPO0FBQ0wsZUFBSyxPQUFPQTtBQUNaLGNBQUksS0FBSztBQUNQLG1CQUFPLFdBQVk7QUFDakIscUJBQU9BO0FBQUEsWUFDVCxDQUFDO0FBQUEsVUFDSDtBQUFBLFFBQ0Y7QUFBQSxNQUNGLEdBQUc7QUFBQTtBQUFBOzs7QUM5ZUksTUFBTSx5QkFDWDtBQUdLLE1BQU0sZ0JBQWdCO0FBS3RCLE1BQU0saUJBQWlCO0FBSXZCLE1BQU0scUJBQXFCO0FBQzNCLE1BQU0sNEJBQ1g7QUFDSyxNQUFNLHdCQUF3QjtBQUM5QixNQUFNLDJCQUNYO0FBQ0ssTUFBTSwyQkFDWDtBQUNLLE1BQU0sMEJBQ1g7QUFDSyxNQUFNLHdCQUF3QjtBQUk5QixNQUFNLFFBQVE7QUFDZCxNQUFNLFlBQVk7QUFFbEIsTUFBTSxZQUFZO0FBQ2xCLE1BQU0sYUFBYTs7O0FDMUMxQix1QkFBcUI7QUFtQmQsV0FBUyxTQUFTLGNBQXNCLE9BQXlCO0FBQ3RFLGVBQU8scUJBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUU7QUFBQSxFQUMxRDtBQVdPLFdBQVMsZ0JBQWdCLFlBQTRCO0FBQzFELGVBQU8scUJBQUssQ0FBQyxXQUFXLFVBQVUsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFFO0FBQUEsRUFDNUQ7QUErQk8sV0FBUyxPQUFPLElBQStCLE9BQU8sS0FBYTtBQUN4RSxVQUFNLEtBQUssTUFBTSxJQUFJLEtBQUs7QUFDMUIsUUFBSSxDQUFDLEVBQUcsUUFBTztBQUNmLFFBQUksbUJBQW1CLEtBQUssQ0FBQyxFQUFHLFFBQU8sRUFBRSxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDO0FBQ3BFLFFBQUksRUFBRSxXQUFXLE9BQU8sRUFBRyxRQUFPO0FBQ2xDLFFBQUksRUFBRSxTQUFTLEVBQUcsUUFBTyxFQUFFLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDL0UsV0FBTztBQUFBLEVBQ1Q7QUFFTyxXQUFTLFNBQVMsTUFBeUM7QUFDaEUsVUFBTSxXQUFXLFFBQVEsSUFBSSxLQUFLO0FBQ2xDLFFBQUksQ0FBQyxXQUFXLFlBQVksVUFBVyxRQUFPO0FBRTlDLFFBQUksS0FBSyxLQUFLLE9BQU8sR0FBRztBQUN0QixZQUFNLFFBQVEsUUFBUSxNQUFNLEtBQUs7QUFDakMsVUFBSSxNQUFNLFdBQVcsRUFBRyxRQUFPLE1BQU0sQ0FBQztBQUN0QyxZQUFNLFFBQVEsTUFBTSxDQUFDO0FBQ3JCLFlBQU0sT0FBTyxNQUFNLE1BQU0sU0FBUyxDQUFDO0FBQ25DLFVBQUksTUFBTSxXQUFXLEdBQUc7QUFHdEIsY0FBTSxhQUFhLEtBQUssVUFBVSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQztBQUN2RCxlQUFPLEdBQUcsS0FBSyxJQUFJLFVBQVU7QUFBQSxNQUMvQjtBQUNBLFlBQU0sVUFBVSxNQUFNLE1BQU0sR0FBRyxFQUFFLEVBQUUsSUFBSSxNQUFNLEtBQUs7QUFDbEQsYUFBTyxDQUFDLE9BQU8sR0FBRyxTQUFTLElBQUksRUFBRSxLQUFLLEdBQUc7QUFBQSxJQUMzQztBQUlBLFVBQU0sUUFBUSxNQUFNLEtBQUssT0FBTztBQUNoQyxRQUFJLE1BQU0sVUFBVSxFQUFHLFFBQU87QUFDOUIsUUFBSSxNQUFNLFdBQVcsRUFBRyxRQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDMUMsV0FBTyxNQUFNLENBQUMsSUFBSSxJQUFJLE9BQU8sTUFBTSxTQUFTLENBQUMsSUFBSSxNQUFNLE1BQU0sU0FBUyxDQUFDO0FBQUEsRUFDekU7OztBQzlGQSxNQUFNLHFCQUFxQixvQkFBSSxJQUFJLENBQUMsY0FBYyxRQUFRLGVBQWUsVUFBVSxDQUFDO0FBQ3BGLE1BQU0sc0JBQXNCLG9CQUFJLElBQUksQ0FBQyxRQUFRLE9BQU8sa0JBQWtCLENBQUM7QUFFdkUsV0FBUyxVQUFVLFlBQTZCO0FBQzlDLFVBQU0sSUFBSSxPQUFPLGVBQWUsV0FBVyxXQUFXLFlBQVksSUFBSTtBQUN0RSxRQUFJLEVBQUUsU0FBUyxRQUFRLEVBQUcsUUFBZTtBQUN6QyxRQUFJLEVBQUUsU0FBUyxRQUFRLEVBQUcsUUFBTztBQUNqQyxXQUFlO0FBQUEsRUFDakI7QUFFTyxXQUFTLHNCQUNkLEtBQ0EsV0FDcUI7QUFDckIsVUFBTSxVQUFVLElBQUksV0FBVztBQUMvQixVQUFNLE9BQU8sSUFBSTtBQUNqQixVQUFNLFNBQVMsVUFBVSxJQUFJLFVBQVUsRUFBRTtBQUV6QyxVQUFNLFdBQWdDO0FBQUEsTUFDcEMsY0FBYztBQUFBLE1BQ2QsSUFBSSxTQUFTLFdBQVcsUUFBUSxTQUFTLElBQUksaUJBQWlCLEVBQUU7QUFBQSxNQUNoRSxNQUFNLEVBQUUsV0FBVyxLQUFLLFFBQVEsMEJBQTBCO0FBQUEsTUFDMUQsU0FBUyxFQUFFLFdBQVcsV0FBVyxTQUFTLEdBQUc7QUFBQSxNQUM3QyxnQkFBZ0I7QUFBQSxRQUNkLFFBQVE7QUFBQSxVQUNOO0FBQUEsWUFDRSxRQUFRO0FBQUEsWUFDUixNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxvQkFBb0I7QUFBQSxRQUNsQixRQUFRO0FBQUEsVUFDTjtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsTUFBTTtBQUFBLFFBQ0osUUFBUSxDQUFDLEVBQUUsUUFBUSxNQUFNLFFBQVEsU0FBUyxRQUFRLENBQUM7QUFBQSxRQUNuRCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFFQSxVQUFNLFdBQVcsSUFBSSxZQUFZO0FBQ2pDLFFBQUksbUJBQW1CLElBQUksUUFBUSxHQUFHO0FBQ3BDLGVBQVMsV0FBVyxDQUFDLFFBQVE7QUFBQSxJQUMvQjtBQUVBLFVBQU0sY0FBYyxJQUFJLGVBQWU7QUFDdkMsUUFBSSxvQkFBb0IsSUFBSSxXQUFXLEdBQUc7QUFDeEMsZUFBUyxjQUFjO0FBQUEsSUFDekI7QUFFQSxRQUFJLElBQUksZUFBZTtBQUNyQixlQUFTLGVBQWUsR0FBRyxJQUFJLGFBQWE7QUFBQSxJQUM5QztBQUVBLFVBQU0sZUFBZSxJQUFJLFlBQVk7QUFDckMsUUFBSSxjQUFjO0FBQ2hCLGVBQVMsV0FBVyxDQUFDLEVBQUUsYUFBYSxhQUFhLENBQUM7QUFBQSxJQUNwRDtBQUVBLFdBQU87QUFBQSxFQUNUOzs7QUMzREEsTUFBTSxvQkFBb0I7QUFVbkIsV0FBUyxpQkFBaUIsTUFBeUM7QUFDeEUsUUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEdBQUcsRUFBRyxRQUFPLFFBQVE7QUFDaEQsVUFBTSxJQUFJLEtBQUssS0FBSyxFQUFFLFlBQVk7QUFDbEMsUUFBSSxFQUFFLFVBQVUsRUFBRyxRQUFPO0FBQzFCLFVBQU0sT0FBTyxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBQ3pCLFVBQU0sT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUN0QixRQUFJLGtCQUFrQixLQUFLLElBQUksR0FBRztBQUNoQyxhQUFPLEdBQUcsSUFBSSxJQUFJLElBQUk7QUFBQSxJQUN4QjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBRUEsV0FBU0MsV0FBVSxZQUE2QjtBQUM5QyxVQUFNLElBQUksT0FBTyxlQUFlLFdBQVcsV0FBVyxZQUFZLElBQUk7QUFDdEUsUUFBSSxFQUFFLFNBQVMsUUFBUSxFQUFHLFFBQWU7QUFDekMsUUFBSSxFQUFFLFNBQVMsUUFBUSxLQUFLLEVBQUUsU0FBUyxPQUFPLEdBQUc7QUFHL0MsYUFBZTtBQUFBLElBQ2pCO0FBQ0EsV0FBZTtBQUFBLEVBQ2pCO0FBRU8sV0FBUyxhQUFhLEtBQTBCLFdBQXdDO0FBQzdGLFVBQU0sVUFBVSxJQUFJLFdBQVc7QUFDL0IsUUFBSSxPQUFPLElBQUk7QUFDZixVQUFNLFNBQVNBLFdBQVUsSUFBSSxVQUFVLEVBQUU7QUFDekMsUUFBSSxXQUFtQixhQUFhLE1BQU07QUFDeEMsYUFBTyxpQkFBaUIsSUFBSTtBQUFBLElBQzlCO0FBRUEsVUFBTSxXQUFnQztBQUFBLE1BQ3BDLGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFNZCxJQUFJLFNBQVMsV0FBVyxRQUFRLFNBQVMsSUFBSSxjQUFjLEVBQUU7QUFBQSxNQUM3RCxNQUFNLEVBQUUsV0FBVyxLQUFLLFFBQVEsMEJBQTBCO0FBQUEsTUFDMUQsU0FBUyxFQUFFLFdBQVcsV0FBVyxTQUFTLEdBQUc7QUFBQSxNQUM3QyxnQkFBZ0I7QUFBQSxRQUNkLFFBQVE7QUFBQSxVQUNOO0FBQUEsWUFDRSxRQUFRO0FBQUEsWUFDUixNQUFNLElBQUksbUJBQW1CO0FBQUEsVUFDL0I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0Esb0JBQW9CO0FBQUEsUUFDbEIsUUFBUTtBQUFBLFVBQ047QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBU0EsUUFBSSxJQUFJLFVBQVU7QUFDaEIsZUFBUyxXQUFXO0FBQUEsUUFDbEI7QUFBQSxVQUNFLFFBQVE7QUFBQSxZQUNOO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixNQUFNLElBQUk7QUFBQSxZQUNaO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVBLGFBQVMsT0FBTztBQUFBLE1BQ2QsUUFBUSxDQUFDLEVBQUUsUUFBUSxNQUFNLFFBQVEsU0FBUyxRQUFRLENBQUM7QUFBQSxNQUNuRCxNQUFNO0FBQUEsSUFDUjtBQUVBLFVBQU0sV0FBVyxJQUFJLFlBQVk7QUFDakMsUUFBSSxVQUFVO0FBQ1osZUFBUyxXQUFXLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDdkM7QUFFQSxRQUFJLElBQUksWUFBWTtBQUNsQixlQUFTLGdCQUFnQixHQUFHLElBQUksVUFBVTtBQUFBLElBQzVDO0FBQ0EsUUFBSSxJQUFJLGVBQWU7QUFDckIsZUFBUyxlQUFlLEdBQUcsSUFBSSxhQUFhO0FBQUEsSUFDOUM7QUFFQSxXQUFPO0FBQUEsRUFDVDs7O0FDL0dBLE1BQU0sVUFBVTtBQUVoQixNQUFNLGVBQXlEO0FBQUEsSUFDN0QsS0FBSyxDQUFDLFNBQVMsT0FBTyxZQUFZO0FBQUEsSUFDbEMsS0FBSyxDQUFDLFNBQVMsT0FBTyxXQUFXO0FBQUEsSUFDakMsS0FBSyxDQUFDLFNBQVMsT0FBTyxZQUFZO0FBQUEsSUFDbEMsTUFBTSxDQUFDLFNBQVMsT0FBTyxXQUFXO0FBQUEsRUFDcEM7QUFJQSxNQUFNLGNBQ0o7QUFFRixXQUFTLHNCQUFzQixZQUE2QjtBQUMxRCxRQUFJLENBQUMsV0FBWSxRQUFPO0FBQ3hCLFVBQU0sT0FBTyxXQUFXLEtBQUs7QUFFN0IsUUFBSSxLQUFLLFNBQVMsSUFBSyxRQUFPO0FBRTlCLFFBQUksWUFBWSxLQUFLLElBQUksRUFBRyxRQUFPO0FBQ25DLFdBQU87QUFBQSxFQUNUO0FBRU8sV0FBUyxvQkFDZCxLQUNBLFdBQzRCO0FBQzVCLFVBQU0sY0FBZSxJQUFJLGNBQWMsSUFBZSxLQUFLO0FBQzNELFFBQUksQ0FBQyxXQUFZLFFBQU87QUFFeEIsVUFBTSxZQUFZLE9BQU8sSUFBSSxZQUFZLEVBQUUsRUFBRSxZQUFZO0FBQ3pELFFBQUksY0FBYyxTQUFTLHNCQUFzQixVQUFVLEdBQUc7QUFDNUQsYUFBTztBQUFBLElBQ1Q7QUFFQSxVQUFNLFVBQVUsSUFBSSxXQUFXO0FBQy9CLFVBQU0sT0FBTyxJQUFJO0FBQ2pCLFVBQU0sYUFBYSxJQUFJLFVBQVU7QUFDakMsVUFBTSxTQUNKLE9BQU8sZUFBZSxZQUFZLFdBQVcsWUFBWSxNQUFNLFVBQ25ELFFBQ0E7QUFFZCxVQUFNLFdBQWdDO0FBQUEsTUFDcEMsY0FBYztBQUFBLE1BQ2QsSUFBSSxTQUFTLFdBQVcsUUFBUSxTQUFTLElBQUksUUFBUSxFQUFFO0FBQUEsTUFDdkQsTUFBTSxFQUFFLFdBQVcsS0FBSyxRQUFRLDBCQUEwQjtBQUFBLE1BQzFELFFBQVEsSUFBSSxVQUFVO0FBQUEsTUFDdEIsU0FBUyxFQUFFLFdBQVcsV0FBVyxTQUFTLEdBQUc7QUFBQSxNQUM3QyxNQUFNO0FBQUEsUUFDSixRQUFRLENBQUMsRUFBRSxRQUFRLE1BQU0sUUFBUSxTQUFTLFFBQVEsQ0FBQztBQUFBLFFBQ25ELE1BQU07QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFFQSxVQUFNLFdBQVcsYUFBYSxTQUFTO0FBQ3ZDLFFBQUksVUFBVTtBQUNaLFlBQU0sQ0FBQyxRQUFRLFNBQVMsVUFBVSxJQUFJO0FBQ3RDLGVBQVMsV0FBVyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsUUFBUSxRQUFRLE1BQU0sU0FBUyxTQUFTLFdBQVcsQ0FBQyxFQUFFLENBQUM7QUFBQSxJQUMzRjtBQUVBLFFBQUksSUFBSSxNQUFNO0FBQ1osZUFBUyxvQkFBb0IsR0FBRyxJQUFJLElBQUk7QUFBQSxJQUMxQztBQUNBLFFBQUksSUFBSSxRQUFRO0FBQ2QsZUFBUyxTQUFTLEdBQUcsSUFBSSxNQUFNO0FBQUEsSUFDakMsV0FBVyxJQUFJLE1BQU07QUFDbkIsZUFBUyxTQUFTLEdBQUcsSUFBSSxJQUFJO0FBQUEsSUFDL0I7QUFFQSxVQUFNLFlBQWEsSUFBSSxZQUFZLElBQWUsS0FBSztBQUN2RCxRQUFJLFVBQVU7QUFDWixlQUFTLFlBQVksQ0FBQyxFQUFFLFNBQVMsU0FBUyxDQUFDO0FBQUEsSUFDN0M7QUFFQSxXQUFPO0FBQUEsRUFDVDs7O0FDL0VBLE1BQU0saUJBQWlCO0FBRXZCLE1BQU0sWUFBc0Q7QUFBQSxJQUMxRCxLQUFLLENBQUMsZ0JBQWdCLE9BQU8sWUFBWTtBQUFBLElBQ3pDLEtBQUssQ0FBQyxnQkFBZ0IsT0FBTyxxQkFBcUI7QUFBQSxJQUNsRCxNQUFNLENBQUMsZ0JBQWdCLFFBQVEsV0FBVztBQUFBLEVBQzVDO0FBRU8sV0FBUyxhQUFhLEtBQTBCLFdBQXdDO0FBQzdGLFVBQU0sV0FBVyxPQUFPLElBQUksU0FBUyxLQUFLLEVBQUUsWUFBWTtBQUN4RCxVQUFNLGFBQWEsVUFBVSxRQUFRLEtBQUssVUFBVTtBQUVwRCxVQUFNLFdBQWdDO0FBQUEsTUFDcEMsY0FBYztBQUFBLE1BQ2QsSUFBSSxTQUFTLFdBQVcsSUFBSSxRQUFRLElBQUksV0FBWSxJQUFJLFlBQVksSUFBZSxLQUFLLENBQUM7QUFBQSxNQUN6RixNQUFNLEVBQUUsV0FBVyxLQUFLLFFBQVEsMEJBQTBCO0FBQUEsTUFDMUQsUUFBUTtBQUFBLE1BQ1IsT0FBTztBQUFBLFFBQ0wsUUFBUSxXQUFXLENBQUM7QUFBQSxRQUNwQixNQUFNLFdBQVcsQ0FBQztBQUFBLFFBQ2xCLFNBQVMsV0FBVyxDQUFDO0FBQUEsTUFDdkI7QUFBQSxNQUNBLFNBQVMsRUFBRSxXQUFXLFdBQVcsU0FBUyxHQUFHO0FBQUEsSUFDL0M7QUFLQSxVQUFNLGVBQWdCLElBQUksZ0JBQWdCLElBQWUsS0FBSztBQUM5RCxRQUFJLGFBQWE7QUFDZixlQUFTLE9BQU8sQ0FBQyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQUEsSUFDeEM7QUFFQSxVQUFNLFNBQWlDLENBQUM7QUFDeEMsUUFBSSxJQUFJLEtBQU0sUUFBTyxRQUFRLEdBQUcsSUFBSSxJQUFJO0FBQ3hDLFFBQUksSUFBSSxTQUFVLFFBQU8sTUFBTSxHQUFHLElBQUksUUFBUTtBQUM5QyxRQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUUsU0FBUyxHQUFHO0FBQ2xDLGVBQVMsU0FBUztBQUFBLElBQ3BCO0FBRUEsVUFBTSxhQUFhLElBQUksY0FBYztBQUNyQyxVQUFNLFdBQVcsSUFBSSxZQUFZO0FBQ2pDLFFBQUksY0FBYyxVQUFVO0FBQzFCLFlBQU0sY0FBbUMsQ0FBQztBQUMxQyxVQUFJLFNBQVUsYUFBWSxhQUFhLEVBQUUsU0FBUyxTQUFTO0FBQzNELGVBQVMsY0FBYyxPQUFPLEtBQUssV0FBVyxFQUFFLFNBQVMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDO0FBQzlFLFVBQUksWUFBWTtBQUNkLGlCQUFTLGNBQWMsRUFBRSxNQUFNLFdBQVc7QUFBQSxNQUM1QztBQUFBLElBQ0Y7QUFFQSxVQUFNLFlBQWEsSUFBSSxZQUFZLElBQWUsS0FBSztBQUN2RCxRQUFJLFVBQVU7QUFDWixlQUFTLGtCQUFrQixFQUFFLFNBQVMsU0FBUztBQUFBLElBQ2pEO0FBRUEsVUFBTSxTQUFTLElBQUksVUFBVTtBQUM3QixRQUFJLFFBQVE7QUFDVixlQUFTLGFBQWEsQ0FBQyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQUEsSUFDekM7QUFFQSxVQUFNLFlBQVksSUFBSSx5QkFBeUI7QUFDL0MsUUFBSSxXQUFXO0FBQ2IsZUFBUyxrQkFBa0IsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLFVBQVUsRUFBRTtBQUFBLElBQ3pFO0FBRUEsVUFBTSxnQkFBaUIsSUFBSSxpQkFBaUIsSUFBZSxLQUFLO0FBQ2hFLFFBQUksY0FBYztBQUNoQixlQUFTLE9BQU8sQ0FBQyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQUEsSUFDekM7QUFFQSxXQUFPO0FBQUEsRUFDVDs7O0FDcEVBLFdBQVMsTUFBTSxJQUFxQjtBQUVsQyxVQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSztBQUNoQyxXQUFPLE1BQU0sU0FBVSxNQUFNO0FBQUEsRUFDL0I7QUFFQSxXQUFTLFNBQVMsR0FBc0M7QUFDdEQsUUFBSSxDQUFDLEVBQUcsUUFBTztBQUNmLFFBQUksSUFBSTtBQUNSLGVBQVcsTUFBTSxFQUFHLEtBQUksTUFBTSxFQUFFLEVBQUc7QUFDbkMsV0FBTztBQUFBLEVBQ1Q7QUFPQSxNQUFNLGFBQWE7QUFZWixXQUFTLGlCQUFpQixNQUF5QztBQUN4RSxVQUFNLEtBQUssUUFBUSxJQUFJLFlBQVk7QUFDbkMsVUFBTSxTQUFTLENBQUMsR0FBRyxFQUFFLFNBQVMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDMUQsUUFBSSxPQUFPLFdBQVcsR0FBRztBQUN2QixjQUFRLFFBQVEsSUFBSSxLQUFLLEVBQUUsWUFBWTtBQUFBLElBQ3pDO0FBQ0EsUUFBSSxVQUFVLE9BQU8sT0FBTyxDQUFDLEdBQUcsTUFBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLElBQUksQ0FBRSxFQUFFLEtBQUs7QUFDMUUsZUFBVyxPQUFPLENBQUMsT0FBTyxZQUFPLEtBQUssR0FBRztBQUN2QyxVQUFJLFFBQVEsU0FBUyxHQUFHLEdBQUc7QUFDekIsa0JBQVUsUUFBUSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQUEsTUFDaEM7QUFBQSxJQUNGO0FBQ0EsV0FBTyxRQUFRLFFBQVEsUUFBUSxHQUFHLEVBQUUsS0FBSyxFQUFFLFlBQVk7QUFBQSxFQUN6RDtBQU9PLFdBQVMsVUFDZCxhQUNBLGNBQ3dCO0FBQ3hCLFFBQUksQ0FBQyxZQUFhLFFBQU87QUFDekIsVUFBTSxXQUFXLE9BQU8sV0FBVyxFQUFFLE1BQU0sR0FBRyxFQUFFO0FBQ2hELFVBQU0sU0FBUyxvQkFBSSxLQUFLLEdBQUcsUUFBUSxZQUFZO0FBQy9DLFFBQUksT0FBTyxNQUFNLE9BQU8sUUFBUSxDQUFDLEVBQUcsUUFBTztBQUUzQyxRQUFJO0FBQ0osUUFBSSxpQkFBaUIsUUFBUSxpQkFBaUIsVUFBYSxpQkFBaUIsSUFBSTtBQUM5RSxhQUFPO0FBQUEsSUFDVCxPQUFPO0FBQ0wsWUFBTSxJQUFJLE9BQU8sU0FBUyxPQUFPLFlBQVksR0FBRyxFQUFFO0FBQ2xELGFBQU8sT0FBTyxTQUFTLENBQUMsSUFBSSxJQUFJO0FBQUEsSUFDbEM7QUFDQSxRQUFJLFNBQVMsS0FBTSxRQUFPO0FBRTFCLFVBQU0sTUFBTSxJQUFJLEtBQUssT0FBTyxRQUFRLENBQUM7QUFDckMsUUFBSSxXQUFXLElBQUksV0FBVyxJQUFJLElBQUk7QUFFdEMsVUFBTSxRQUFRLG9CQUFJLEtBQUs7QUFDdkIsVUFBTSxZQUFZLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDNUIsV0FBTyxPQUFPLFFBQVEsV0FBVztBQUFBLEVBQ25DO0FBTU8sV0FBUyxxQkFDZCxLQUNBLFdBQzRCO0FBQzVCLFVBQU0sWUFBYSxJQUFJLGFBQWEsSUFBZSxLQUFLO0FBQ3hELFFBQUksQ0FBQyxTQUFVLFFBQU87QUFJdEIsVUFBTSxRQUFRLFNBQVMsV0FBVyxpQkFBaUIsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFO0FBRTVFLFVBQU0sWUFBYSxJQUFJLFFBQVEsSUFBZSxLQUFLO0FBQ25ELFVBQU0sU0FBaUM7QUFBQSxNQUNyQyxRQUFRLFdBQW1CLGdCQUF3QjtBQUFBLE1BQ25ELE1BQU0sWUFBWTtBQUFBLE1BQ2xCLFNBQVM7QUFBQSxJQUNYO0FBRUEsVUFBTSxXQUFnQztBQUFBLE1BQ3BDLGNBQWM7QUFBQSxNQUNkLElBQUk7QUFBQSxNQUNKLE1BQU0sRUFBRSxXQUFXLEtBQUssUUFBUSwwQkFBMEI7QUFBQSxNQUMxRCxRQUFRLFVBQVUsSUFBSSxRQUFRLElBQUksSUFBSSxhQUFhO0FBQUEsTUFDbkQsUUFBUTtBQUFBLE1BQ1IsMkJBQTJCO0FBQUEsUUFDekIsUUFBUSxDQUFDLE1BQU07QUFBQSxRQUNmLE1BQU07QUFBQSxNQUNSO0FBQUEsTUFDQSxTQUFTLEVBQUUsV0FBVyxXQUFXLFNBQVMsR0FBRztBQUFBLElBQy9DO0FBRUEsUUFBSSxJQUFJLE1BQU07QUFDWixlQUFTLGFBQWEsR0FBRyxJQUFJLElBQUk7QUFBQSxJQUNuQztBQUVBLFVBQU0sYUFBYyxJQUFJLGNBQWMsSUFBZSxLQUFLO0FBQzFELFFBQUksV0FBVztBQUNiLGVBQVMsV0FBVyxDQUFDLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFBQSxJQUMxQztBQUVBLFVBQU0sWUFBYSxJQUFJLFlBQVksSUFBZSxLQUFLO0FBQ3ZELFFBQUksVUFBVTtBQUNaLGVBQVMsWUFBWSxFQUFFLFNBQVMsU0FBUztBQUFBLElBQzNDO0FBS0EsVUFBTSxTQUE4QixDQUFDO0FBQ3JDLFVBQU0sUUFBa0IsQ0FBQztBQUN6QixlQUFXLEtBQUssQ0FBQyxRQUFRLFFBQVEsV0FBVyxHQUFZO0FBQ3RELFVBQUksSUFBSSxDQUFDLEVBQUcsT0FBTSxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztBQUFBLElBQ3ZDO0FBQ0EsUUFBSSxNQUFNLFNBQVMsR0FBRztBQUNwQixhQUFPLE9BQU8sTUFBTSxLQUFLLEdBQUc7QUFBQSxJQUM5QjtBQUNBLFFBQUksSUFBSSxPQUFPO0FBQ2IsYUFBTyxRQUFRO0FBQUEsUUFDYixRQUFRLENBQUMsRUFBRSxRQUFRLDBCQUEwQixTQUFTLElBQUksTUFBTSxDQUFDO0FBQUEsTUFDbkU7QUFBQSxJQUNGO0FBQ0EsUUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFLFNBQVMsR0FBRztBQUNsQyxlQUFTLG9CQUFvQixDQUFDLE1BQU07QUFBQSxJQUN0QztBQUdBLFVBQU0sS0FBMEIsQ0FBQztBQUNqQyxVQUFNLFNBQVMsSUFBSTtBQUNuQixRQUFJLFdBQVcsUUFBUSxXQUFXLFVBQWEsV0FBVyxJQUFJO0FBQzVELFlBQU0sU0FBUyxPQUFPLFdBQVcsT0FBTyxNQUFNLEVBQUUsUUFBUSxNQUFNLEVBQUUsQ0FBQztBQUNqRSxVQUFJLE9BQU8sU0FBUyxNQUFNLEdBQUc7QUFDM0IsV0FBRyxXQUFXLEVBQUUsT0FBTyxPQUFPO0FBQUEsTUFDaEM7QUFBQSxJQUNGO0FBQ0EsUUFBSSxJQUFJLGVBQWU7QUFDckIsWUFBTSxPQUFPLE9BQU8sU0FBUyxPQUFPLElBQUksYUFBYSxHQUFHLEVBQUU7QUFDMUQsVUFBSSxPQUFPLFNBQVMsSUFBSSxHQUFHO0FBQ3pCLFdBQUcseUJBQXlCO0FBQUEsVUFDMUIsT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUNBLFFBQUksT0FBTyxLQUFLLEVBQUUsRUFBRSxTQUFTLEdBQUc7QUFDOUIsZUFBUyxrQkFBa0I7QUFBQSxJQUM3QjtBQUVBLFVBQU0sY0FBZSxJQUFJLGNBQWMsSUFBZSxLQUFLO0FBQzNELFVBQU0sa0JBQW1CLElBQUksbUJBQW1CLElBQWUsS0FBSztBQUNwRSxRQUFJLGNBQWMsZ0JBQWdCO0FBQ2hDLFlBQU0sS0FBMEIsQ0FBQztBQUNqQyxVQUFJLGdCQUFnQjtBQUNsQixXQUFHLFNBQVM7QUFBQSxVQUNWO0FBQUEsWUFDRSxRQUFnQjtBQUFBLFlBQ2hCLE1BQU0saUJBQWlCLGNBQWM7QUFBQSxZQUNyQyxTQUFTLGNBQWM7QUFBQSxVQUN6QjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQ0EsVUFBSSxZQUFZO0FBQ2QsV0FBRyxPQUFPLGlCQUFpQixHQUFHLGNBQWMsSUFBSSxVQUFVLEdBQUcsS0FBSyxJQUFJO0FBQUEsTUFDeEU7QUFDQSxlQUFTLGFBQWEsQ0FBQyxFQUFFO0FBQUEsSUFDM0I7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQWVPLFdBQVMsb0JBQW9CLFVBQWlCLFdBQTBDO0FBQzdGLFVBQU0sUUFBUSxvQkFBSSxJQUFpQztBQUNuRCxlQUFXLFFBQVEsVUFBVTtBQUMzQixVQUFJLENBQUMsUUFBUSxPQUFPLFNBQVMsU0FBVTtBQUN2QyxZQUFNLFlBQWEsS0FBSyxhQUFhLElBQWUsS0FBSztBQUN6RCxVQUFJLENBQUMsU0FBVTtBQUNmLFlBQU0sWUFBYSxLQUFLLFFBQVEsSUFBZSxNQUFNLEdBQUcsRUFBRTtBQUMxRCxZQUFNLE1BQU0sR0FBRyxRQUFRLElBQUksaUJBQWlCLFFBQVEsQ0FBQztBQUNyRCxZQUFNLFdBQVcsTUFBTSxJQUFJLEdBQUc7QUFDOUIsVUFBSSxhQUFhLFFBQVc7QUFDMUIsY0FBTSxJQUFJLEtBQUssSUFBSTtBQUFBLE1BQ3JCLE9BQU87QUFFTCxZQUFJLFNBQVMsUUFBUSxJQUFJLFNBQVMsU0FBUyxhQUFhLEVBQUUsR0FBRztBQUMzRCxnQkFBTSxJQUFJLEtBQUssSUFBSTtBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFQSxVQUFNLE1BQTZCLENBQUM7QUFDcEMsZUFBVyxRQUFRLE1BQU0sT0FBTyxHQUFHO0FBQ2pDLFlBQU0sSUFBSSxxQkFBcUIsTUFBTSxTQUFTO0FBQzlDLFVBQUksTUFBTSxLQUFNLEtBQUksS0FBSyxDQUFDO0FBQUEsSUFDNUI7QUFDQSxXQUFPO0FBQUEsRUFDVDs7O0FDbE9PLE1BQU0sZUFBdUM7QUFBQTtBQUFBLElBRWxELFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFVVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBVVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1W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QVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FDRTtBQUFBLElBQ0YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLEVBQ2I7OztBQ3ZpQkEsTUFBTSxjQUFjO0FBS3BCLE1BQU0sZ0JBQWlEO0FBQUEsSUFDckQsQ0FBQyxVQUFLLEdBQUc7QUFBQSxJQUNU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QUFBLGdCQUNiLEdBQUc7QUFBQSxnQkFDSCxTQUFTO0FBQUEsZ0JBQ1QsVUFBVTtBQUFBLGdCQUNWLE9BQU87QUFBQSxnQkFDUCxJQUFJLEtBQUssSUFBSTtBQUFBLGdCQUNiLFdBQVcsS0FBSyxJQUFJO0FBQUEsY0FDdEI7QUFBQSxZQUNGLENBQUM7QUFBQSxVQUNILFNBQVMsR0FBRztBQUNWLG9CQUFRLEtBQUssa0NBQWtDLENBQUM7QUFBQSxVQUNsRDtBQUFBLFFBQ0YsR0FBRztBQUFBLE1BQ0w7QUFDQSx1QkFBaUI7QUFDakIsVUFBSTtBQUFFLHFCQUFhLEVBQUUsSUFBSSxLQUFLLENBQUM7QUFBQSxNQUFHLFFBQVE7QUFBQSxNQUFDO0FBQzNDLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsaUJBQWlCO0FBQ2pDLGFBQU8sUUFBUSxNQUFNLElBQUksV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUFTLGFBQWEsS0FBSyxXQUFXLEtBQUssSUFBSSxDQUFDO0FBQzVGLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsbUJBQW1CO0FBQ25DLGFBQU8sUUFBUSxNQUFNLE9BQU8sV0FBVyxFQUFFLEtBQUssTUFBTSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQztBQUM5RSxhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLGlCQUFpQjtBQUNqQywwQkFBb0IsSUFBSSxLQUFLLEVBQUU7QUFBQSxRQUM3QixDQUFDLFVBQVU7QUFBRSxjQUFJO0FBQUUseUJBQWEsRUFBRSxVQUFVLE1BQU0sQ0FBQztBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUFFO0FBQUEsUUFDakUsTUFBTTtBQUFFLGNBQUk7QUFBRSx5QkFBYSxFQUFFLFVBQVUsS0FBSyxDQUFDO0FBQUEsVUFBRyxRQUFRO0FBQUEsVUFBQztBQUFBLFFBQUU7QUFBQSxNQUM3RDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBS0QsU0FBTyxPQUFPLE9BQU8sZ0JBQWdCLEVBQUUsaUJBQWlCLEtBQUssQ0FBQztBQUM5RCxTQUFPLE9BQU8sUUFBUSxZQUFZLE1BQU07QUFBQSxFQUFxQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJCdWZmZXIiLCAiYmxvY2tzIiwgImV4cG9ydHMiLCAibWFwU3lzdGVtIiwgImVzY2FwZVJlZ2V4IiwgImhpdCIsICJjamtDaGFycyIsICJvYnNJZCIsICJtYXBTeXN0ZW0iLCAiciJdCn0K
