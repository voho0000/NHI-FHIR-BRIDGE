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
    push("Urine Protein", row.urinE_PROTEIN_TEXT || "", "", "");
    push("HBsAg", row.hbsaG_TEXT || "", "", row.hbV_RESULT_TEXT || "", "laboratory", "14032C");
    push("Anti-HCV", row.antI_HCV_TEXT || "", "", row.hcV_RESULT_TEXT || "", "laboratory", "14051C");
    push("Uric Acid", row.uriC_ACID, "mg/dL");
    push("Urine UA", row.urinE_UA_DIAG_RESULT_TEXT || "", "", "");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9uaGktYWRhcHRlcnMuanMiLCAiLi4vc3JjL25oaS1lbmRwb2ludHMuanMiLCAiLi4vc3JjL2JhY2tncm91bmQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG4gKiBbanMtc2hhMV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1zaGExfVxuICpcbiAqIEB2ZXJzaW9uIDAuNy4wXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMjRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4vKmpzbGludCBiaXR3aXNlOiB0cnVlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgSU5QVVRfRVJST1IgPSAnaW5wdXQgaXMgaW52YWxpZCB0eXBlJztcbiAgdmFyIEZJTkFMSVpFX0VSUk9SID0gJ2ZpbmFsaXplIGFscmVhZHkgY2FsbGVkJztcbiAgdmFyIFdJTkRPVyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnO1xuICB2YXIgcm9vdCA9IFdJTkRPVyA/IHdpbmRvdyA6IHt9O1xuICBpZiAocm9vdC5KU19TSEExX05PX1dJTkRPVykge1xuICAgIFdJTkRPVyA9IGZhbHNlO1xuICB9XG4gIHZhciBXRUJfV09SS0VSID0gIVdJTkRPVyAmJiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCc7XG4gIHZhciBOT0RFX0pTID0gIXJvb3QuSlNfU0hBMV9OT19OT0RFX0pTICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgaWYgKE5PREVfSlMpIHtcbiAgICByb290ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFdFQl9XT1JLRVIpIHtcbiAgICByb290ID0gc2VsZjtcbiAgfVxuICB2YXIgQ09NTU9OX0pTID0gIXJvb3QuSlNfU0hBMV9OT19DT01NT05fSlMgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHM7XG4gIHZhciBBTUQgPSB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQ7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAhcm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUiAmJiB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcbiAgdmFyIEVYVFJBID0gWy0yMTQ3NDgzNjQ4LCA4Mzg4NjA4LCAzMjc2OCwgMTI4XTtcbiAgdmFyIFNISUZUID0gWzI0LCAxNiwgOCwgMF07XG4gIHZhciBPVVRQVVRfVFlQRVMgPSBbJ2hleCcsICdhcnJheScsICdkaWdlc3QnLCAnYXJyYXlCdWZmZXInXTtcblxuICB2YXIgYmxvY2tzID0gW107XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICBpZiAocm9vdC5KU19TSEExX05PX05PREVfSlMgfHwgIWlzQXJyYXkpIHtcbiAgICBpc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3O1xuICBpZiAoQVJSQVlfQlVGRkVSICYmIChyb290LkpTX1NIQTFfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgfHwgIWlzVmlldykpIHtcbiAgICBpc1ZpZXcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmJ1ZmZlciAmJiBvYmouYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcjtcbiAgICB9O1xuICB9XG5cbiAgLy8gW21lc3NhZ2U6IHN0cmluZywgaXNTdHJpbmc6IGJvb2xdXG4gIHZhciBmb3JtYXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXNzYWdlO1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIFttZXNzYWdlLCB0cnVlXTtcbiAgICB9XG4gICAgaWYgKHR5cGUgIT09ICdvYmplY3QnIHx8IG1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChBUlJBWV9CVUZGRVIgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBbbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSksIGZhbHNlXTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KG1lc3NhZ2UpICYmICFpc1ZpZXcobWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGNyZWF0ZU91dHB1dE1ldGhvZCA9IGZ1bmN0aW9uIChvdXRwdXRUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IFNoYTEodHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2QgPSBjcmVhdGVPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIGlmIChOT0RFX0pTKSB7XG4gICAgICBtZXRob2QgPSBub2RlV3JhcChtZXRob2QpO1xuICAgIH1cbiAgICBtZXRob2QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKCk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuY3JlYXRlKCkudXBkYXRlKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPVVRQVVRfVFlQRVMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0eXBlID0gT1VUUFVUX1RZUEVTW2ldO1xuICAgICAgbWV0aG9kW3R5cGVdID0gY3JlYXRlT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIHZhciBub2RlV3JhcCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgICB2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgIHZhciBidWZmZXJGcm9tO1xuICAgIGlmIChCdWZmZXIuZnJvbSAmJiAhcm9vdC5KU19TSEExX05PX0JVRkZFUl9GUk9NKSB7XG4gICAgICBidWZmZXJGcm9tID0gQnVmZmVyLmZyb207XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlckZyb20gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihtZXNzYWdlKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBub2RlTWV0aG9kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKG1lc3NhZ2UsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSBudWxsIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG1lc3NhZ2UpIHx8IGlzVmlldyhtZXNzYWdlKSB8fFxuICAgICAgICBtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ1ZmZlckZyb20obWVzc2FnZSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGVNZXRob2Q7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSwgdHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlSG1hY01ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlSG1hY091dHB1dE1ldGhvZCgnaGV4Jyk7XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgSG1hY1NoYTEoa2V5KTtcbiAgICB9O1xuICAgIG1ldGhvZC51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZShrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QodHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRob2Q7XG4gIH07XG5cbiAgZnVuY3Rpb24gU2hhMShzaGFyZWRNZW1vcnkpIHtcbiAgICBpZiAoc2hhcmVkTWVtb3J5KSB7XG4gICAgICBibG9ja3NbMF0gPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICBibG9ja3NbOF0gPSBibG9ja3NbOV0gPSBibG9ja3NbMTBdID0gYmxvY2tzWzExXSA9XG4gICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICB9XG5cbiAgICB0aGlzLmgwID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmgxID0gMHhFRkNEQUI4OTtcbiAgICB0aGlzLmgyID0gMHg5OEJBRENGRTtcbiAgICB0aGlzLmgzID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmg0ID0gMHhDM0QyRTFGMDtcblxuICAgIHRoaXMuYmxvY2sgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMDtcbiAgICB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJzdCA9IHRydWU7XG4gIH1cblxuICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEZJTkFMSVpFX0VSUk9SKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShtZXNzYWdlKTtcbiAgICBtZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgIHZhciBpc1N0cmluZyA9IHJlc3VsdFsxXTtcbiAgICB2YXIgY29kZSwgaW5kZXggPSAwLCBpLCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCB8fCAwLCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgICAgIGJsb2Nrc1swXSA9IHRoaXMuYmxvY2s7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYoaXNTdHJpbmcpIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gY29kZSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvZGUgPSAweDEwMDAwICsgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhmMCB8IChjb2RlID4+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSB0aGlzLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgNjQ7ICsraW5kZXgpIHtcbiAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaTtcbiAgICAgIHRoaXMuYnl0ZXMgKz0gaSAtIHRoaXMuc3RhcnQ7XG4gICAgICBpZiAoaSA+PSA2NCkge1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGkgLSA2NDtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDA7XG4gICAgICB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgdmFyIGJsb2NrcyA9IHRoaXMuYmxvY2tzLCBpID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgIGJsb2Nrc1sxNl0gPSB0aGlzLmJsb2NrO1xuICAgIGJsb2Nrc1tpID4+PiAyXSB8PSBFWFRSQVtpICYgM107XG4gICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgaWYgKGkgPj0gNTYpIHtcbiAgICAgIGlmICghdGhpcy5oYXNoZWQpIHtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgfVxuICAgIGJsb2Nrc1sxNF0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjk7XG4gICAgYmxvY2tzWzE1XSA9IHRoaXMuYnl0ZXMgPDwgMztcbiAgICB0aGlzLmhhc2goKTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhID0gdGhpcy5oMCwgYiA9IHRoaXMuaDEsIGMgPSB0aGlzLmgyLCBkID0gdGhpcy5oMywgZSA9IHRoaXMuaDQ7XG4gICAgdmFyIGYsIGosIHQsIGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgZm9yKGogPSAxNjsgaiA8IDgwOyArK2opIHtcbiAgICAgIHQgPSBibG9ja3NbaiAtIDNdIF4gYmxvY2tzW2ogLSA4XSBeIGJsb2Nrc1tqIC0gMTRdIF4gYmxvY2tzW2ogLSAxNl07XG4gICAgICBibG9ja3Nbal0gPSAgKHQgPDwgMSkgfCAodCA+Pj4gMzEpO1xuICAgIH1cblxuICAgIGZvcihqID0gMDsgaiA8IDIwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IChhICYgYikgfCAoKH5hKSAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoKH5lKSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoKH5kKSAmIGEpO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IChjICYgZCkgfCAoKH5jKSAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgNDA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IGEgXiBiIF4gYztcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IGMgXiBkIF4gZTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDYwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSAtIDE4OTQwMDc1ODggKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKGEgJiBjKSB8IChiICYgYyk7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gKGUgJiBhKSB8IChlICYgYikgfCAoYSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoZCAmIGEpIHwgKGUgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKGMgJiBlKSB8IChkICYgZSk7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA4MDsgaiArPSA1KSB7XG4gICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSA4OTk0OTc1MTQgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSBkIF4gZSBeIGE7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IHRoaXMuaDAgKyBhIDw8IDA7XG4gICAgdGhpcy5oMSA9IHRoaXMuaDEgKyBiIDw8IDA7XG4gICAgdGhpcy5oMiA9IHRoaXMuaDIgKyBjIDw8IDA7XG4gICAgdGhpcy5oMyA9IHRoaXMuaDMgKyBkIDw8IDA7XG4gICAgdGhpcy5oNCA9IHRoaXMuaDQgKyBlIDw8IDA7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBoMCA9IHRoaXMuaDAsIGgxID0gdGhpcy5oMSwgaDIgPSB0aGlzLmgyLCBoMyA9IHRoaXMuaDMsIGg0ID0gdGhpcy5oNDtcblxuICAgIHJldHVybiBIRVhfQ0hBUlNbKGgwID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDAgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gyICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDMgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toNCAmIDB4MEZdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLnRvU3RyaW5nID0gU2hhMS5wcm90b3R5cGUuaGV4O1xuXG4gIFNoYTEucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gW1xuICAgICAgKGgwID4+PiAyNCkgJiAweEZGLCAoaDAgPj4+IDE2KSAmIDB4RkYsIChoMCA+Pj4gOCkgJiAweEZGLCBoMCAmIDB4RkYsXG4gICAgICAoaDEgPj4+IDI0KSAmIDB4RkYsIChoMSA+Pj4gMTYpICYgMHhGRiwgKGgxID4+PiA4KSAmIDB4RkYsIGgxICYgMHhGRixcbiAgICAgIChoMiA+Pj4gMjQpICYgMHhGRiwgKGgyID4+PiAxNikgJiAweEZGLCAoaDIgPj4+IDgpICYgMHhGRiwgaDIgJiAweEZGLFxuICAgICAgKGgzID4+PiAyNCkgJiAweEZGLCAoaDMgPj4+IDE2KSAmIDB4RkYsIChoMyA+Pj4gOCkgJiAweEZGLCBoMyAmIDB4RkYsXG4gICAgICAoaDQgPj4+IDI0KSAmIDB4RkYsIChoNCA+Pj4gMTYpICYgMHhGRiwgKGg0ID4+PiA4KSAmIDB4RkYsIGg0ICYgMHhGRlxuICAgIF07XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXkgPSBTaGExLnByb3RvdHlwZS5kaWdlc3Q7XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG4gICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDAsIHRoaXMuaDApO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMig0LCB0aGlzLmgxKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoOCwgdGhpcy5oMik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDEyLCB0aGlzLmgzKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoMTYsIHRoaXMuaDQpO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgZnVuY3Rpb24gSG1hY1NoYTEoa2V5LCBzaGFyZWRNZW1vcnkpIHtcbiAgICB2YXIgaSwgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShrZXkpO1xuICAgIGtleSA9IHJlc3VsdFswXTtcbiAgICBpZiAocmVzdWx0WzFdKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgbGVuZ3RoID0ga2V5Lmxlbmd0aCwgaW5kZXggPSAwLCBjb2RlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvZGUgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4YzAgfCAoY29kZSA+Pj4gNikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHhlMCB8IChjb2RlID4+PiAxMikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweDNmZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gNikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8IChjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBrZXkgPSBieXRlcztcbiAgICB9XG5cbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDY0KSB7XG4gICAgICBrZXkgPSAobmV3IFNoYTEodHJ1ZSkpLnVwZGF0ZShrZXkpLmFycmF5KCk7XG4gICAgfVxuXG4gICAgdmFyIG9LZXlQYWQgPSBbXSwgaUtleVBhZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgKytpKSB7XG4gICAgICB2YXIgYiA9IGtleVtpXSB8fCAwO1xuICAgICAgb0tleVBhZFtpXSA9IDB4NWMgXiBiO1xuICAgICAgaUtleVBhZFtpXSA9IDB4MzYgXiBiO1xuICAgIH1cblxuICAgIFNoYTEuY2FsbCh0aGlzLCBzaGFyZWRNZW1vcnkpO1xuXG4gICAgdGhpcy51cGRhdGUoaUtleVBhZCk7XG4gICAgdGhpcy5vS2V5UGFkID0gb0tleVBhZDtcbiAgICB0aGlzLmlubmVyID0gdHJ1ZTtcbiAgICB0aGlzLnNoYXJlZE1lbW9yeSA9IHNoYXJlZE1lbW9yeTtcbiAgfVxuICBIbWFjU2hhMS5wcm90b3R5cGUgPSBuZXcgU2hhMSgpO1xuXG4gIEhtYWNTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICB0aGlzLmlubmVyID0gZmFsc2U7XG4gICAgICB2YXIgaW5uZXJIYXNoID0gdGhpcy5hcnJheSgpO1xuICAgICAgU2hhMS5jYWxsKHRoaXMsIHRoaXMuc2hhcmVkTWVtb3J5KTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMub0tleVBhZCk7XG4gICAgICB0aGlzLnVwZGF0ZShpbm5lckhhc2gpO1xuICAgICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV4cG9ydHMgPSBjcmVhdGVNZXRob2QoKTtcbiAgZXhwb3J0cy5zaGExID0gZXhwb3J0cztcbiAgZXhwb3J0cy5zaGExLmhtYWMgPSBjcmVhdGVIbWFjTWV0aG9kKCk7XG5cbiAgaWYgKENPTU1PTl9KUykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiAgfSBlbHNlIHtcbiAgICByb290LnNoYTEgPSBleHBvcnRzO1xuICAgIGlmIChBTUQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwgIi8qKlxuICogQ2VudHJhbGlzZWQgRkhJUiBDb2RlU3lzdGVtIC8gSWRlbnRpZmllclN5c3RlbSBVUklzIHVzZWQgYnkgdGhlIG1hcHBlcnMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvZmhpci9zeXN0ZW1zLnB5YC4gV2UgdXNlIFVSTC1mb3JtIHN5c3RlbXMgaW5zdGVhZFxuICogb2YgT0lEcyBiZWNhdXNlOlxuICogICAtIGl0IGRvZXNuJ3QgcmVxdWlyZSBtaW50aW5nL293bmluZyBhIHJlYWwgTkhJL1RXIGNvcmUgT0lELFxuICogICAtIGl0J3Mgc2VsZi1kZXNjcmliaW5nIGluIHRvb2xzIHRoYXQgZG9uJ3QgcmVjb2duaXNlIHRoZSBPSUQsXG4gKiAgIC0gaXQgY2xlYW5seSBzdXJ2aXZlcyB0aGUgVFdOSElGSElSIHZhbGlkYXRvcidzIHN5bnRhY3RpYyBjaGVjay5cbiAqXG4gKiBBbGwgc3lzdGVtcyBsaXZlIGhlcmUgc28gYSBzaW5nbGUgY2hhbmdlIHJpcHBsZXMgdG8gZXZlcnkgbWFwcGVyLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgbmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU1MDY1XHU0RkREXHU3RjcyXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIChsYWIgKyBwcm9jZWR1cmUgb3JkZXIgY29kZXMgXHUyMDE0IHNhbWUgbmFtZXNwYWNlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfTUVESUNBTF9PUkRFUl9DT0RFID1cbiAgXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1tZWRpY2FsLW9yZGVyLWNvZGVcIjtcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1ODVFNVx1NTRDMVx1NEVFM1x1NzhCQyAoZHJ1ZyBjb2RlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfRFJVR19DT0RFID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1kcnVnLWNvZGVcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRhaXdhbiBwYXRpZW50IGlkZW50aWZpZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIChUYWl3YW4gbmF0aW9uYWwgSUQpLiAqL1xuZXhwb3J0IGNvbnN0IFRXX05BVElPTkFMX0lEID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9JZGVudGlmaWVyU3lzdGVtL25hdGlvbmFsLWlkXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBmYWxsYmFja3MgKHBlci1kZXBsb3ltZW50LCBOT1QgY3Jvc3Mtc3lzdGVtIGNhbm9uaWNhbCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTEFCX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWxhYlwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLW1lZGljYXRpb25cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUkVQT1JUX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLXJlcG9ydFwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9DT05ESVRJT05fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1wcm9jZWR1cmVcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQUxMRVJHRU5fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtYWxsZXJnZW5cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUEFUSUVOVF9NUk4gPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0lkZW50aWZpZXJTeXN0ZW0vaGlzLW1yblwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJuYXRpb25hbCBjb2RlIHN5c3RlbXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBMT0lOQyA9IFwiaHR0cDovL2xvaW5jLm9yZ1wiO1xuZXhwb3J0IGNvbnN0IFNOT01FRF9DVCA9IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiO1xuLyoqIElDRC0xMC1DTSAoVGFpd2FuIC8gXHU1MDY1XHU0RkREIHVzZXMgdGhpcywgbm90IGJhcmUgSUNELTEwKS4gKi9cbmV4cG9ydCBjb25zdCBJQ0RfMTBfQ00gPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiO1xuZXhwb3J0IGNvbnN0IElDRF8xMF9QQ1MgPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1wY3NcIjtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBhIGhhc2hlZFxuICogUGF0aWVudC5pZCAoZS5nLiB2aWEgSFRUUCBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGUgfjMwTSBUYWl3YW5lc2VcbiAqIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdCB0aGlzIGJlY2F1c2VcbiAqIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3IG5hdGlvbmFsIElEIGluXG4gKiBhbnkgbGVha2VkIGJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBsZWFrIHNjZW5hcmlvcyBkaXNjbG9zZSBib3RoXG4gKiBmaWVsZHMgdG9nZXRoZXIsIHNvIGEgc2FsdCB3b3VsZCBub3QgbW92ZSB0aGUgbmVlZGxlLlxuICpcbiAqIFVzZXMgYGpzLXNoYTFgIChwdXJlIEpTKSBpbnN0ZWFkIG9mIGBub2RlOmNyeXB0b2Agc28gdGhlIHNhbWUgbWFwcGVyXG4gKiBjb2RlIHJ1bnMgdW5tb2RpZmllZCBpbiB0aGUgQ2hyb21lIGV4dGVuc2lvbidzIGxvY2FsLW9ubHkgbW9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWJsZUlkKHBhdGllbnRJZDogc3RyaW5nLCAuLi5wYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBNYXAgYSByYXcgbmF0aW9uYWwgSUQgKG9yIGFueSBwYXRpZW50IGlkZW50aWZpZXIpIHRvIGl0cyAzMi1jaGFyIGhleFxuICogRkhJUiBgUGF0aWVudC5pZGAuIFRoZSByYXcgdmFsdWUgaXMga2VwdCBpbiBgUGF0aWVudC5pZGVudGlmaWVyW10udmFsdWVgXG4gKiBcdTIwMTQgb25seSB0aGUgRkhJUiBsb2dpY2FsIGlkIGlzIGhhc2hlZCBzbyBpdCBkb2Vzbid0IGxlYWsgaW50byBVUkxzLFxuICogc3ViamVjdC5yZWZlcmVuY2UgZmllbGRzLCBhdWRpdCBsb2dzLCBvciBTTUFSVCB0b2tlbiBwYXlsb2Fkcy5cbiAqXG4gKiBGSElSIFI0IFx1MDBBNzIuMjAgc2F5cyBcImxvZ2ljYWwgaWQgXHUyMDI2IFNIT1VMRCBOT1QgY29udGFpbiBpZGVudGlmeWluZ1xuICogaW5mb3JtYXRpb25cIiBcdTIwMTQgdGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVBhdGllbnRJZChuYXRpb25hbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc2hhMShbXCJwYXRpZW50XCIsIG5hdGlvbmFsSWRdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogUGFydGlhbGx5LWFub255bWl6ZSBhIHBhdGllbnQgbmFtZS4gQXBwbGllZCBpbiBtYXBQYXRpZW50IHNvIGV2ZXJ5XG4gKiBGSElSIHJlc291cmNlIHRoYXQgZmxvd3Mgb3V0IG9mIHRoaXMgY29kZWJhc2UgKGRvd25sb2FkZWQgQnVuZGxlLFxuICogYmFja2VuZCBGSElSIHN0b3JlLCBkYXNoYm9hcmQsIFNNQVJUIGFwcCBsYXVuY2hlcykgc2VlcyB0aGUgbWFza2VkXG4gKiBmb3JtLiBUaGUgdXNlcidzIHJhdyBpbnB1dCBpcyBzdGlsbCBrZXB0IGluIGNocm9tZS5zdG9yYWdlIHNvIHRoZXlcbiAqIGNhbiByZXZpZXcgd2hhdCB3YXMgZW50ZXJlZCwgYnV0IGl0IG5ldmVyIGxlYXZlcyBQYXRpZW50IGNvbnRleHQuXG4gKlxuICogUnVsZXMgKFRhaXdhbiAvIENKSyBjb252ZW50aW9uKTpcbiAqICAgLSAxIGNoYXIgICAgIFx1MjE5MiBrZWVwIGFzLWlzIChub3RoaW5nIHRvIG1hc2spXG4gKiAgIC0gMiBjaGFycyAgICBcdTIxOTIga2VlcCBmaXJzdCwgcmVwbGFjZSBzZWNvbmQgd2l0aCBPICAgIFx1NzM4Qlx1NjYwRSBcdTIxOTIgXHU3MzhCT1xuICogICAtIDMrIGNoYXJzICAgXHUyMTkyIGtlZXAgZmlyc3QgKyBsYXN0LCBtaWRkbGUgYWxsIE8gICAgICBcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1OTBFRE9cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1Njc5N1x1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU2Nzk3T09cdTY1QjBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1NEUyRFx1NUNGNlx1NTA2NVx1NkIyMVx1OTBDRSBcdTIxOTIgXHU0RTJET09PXHU5MENFXG4gKlxuICogV2VzdGVybiBuYW1lcyAoY29udGFpbiB3aGl0ZXNwYWNlKTogc3BsaXQgb24gc3BhY2UsIGtlZXAgZmlyc3QgK1xuICogbGFzdCB0b2tlbnMsIHBhcnRpYWwtbWFzayB0aGUgbGFzdCBhbmQgbWlkZGxlOlxuICogICBKb2huIFNtaXRoIFx1MjE5MiBKb2huIFMqKipcbiAqICAgSm9obiBRIFNtaXRoIFx1MjE5MiBKb2huICoqKiBTbWl0aFxuICovXG4vKipcbiAqIEhhbGYtbWFzayBhIFRhaXdhbiBuYXRpb25hbCBJRCBmb3Igc2hvdWxkZXItc3VyZmluZy1zYWZlIGRpc3BsYXkuXG4gKiBNYXRjaGVzIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EncyBvd24gYGhpZGAgY29udmVudGlvbiAoZmlyc3QgNiB2aXNpYmxlLCBsYXN0XG4gKiA0IGhpZGRlbik6IGBQMTIzNDUwODY2YCBcdTIxOTIgYFAxMjM0NSoqKipgLlxuICpcbiAqIGBjaGFyYCBkZWZhdWx0cyB0byBgKmAgZm9yIHBvcHVwL3RvYXN0IGRpc3BsYXkuIFVzZSBgWGAgZm9yIGZpbGVuYW1lc1xuICogc2luY2UgYCpgIGlzIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gVGhlIGF1dG8tZ2VuZXJhdGVkXG4gKiBgYXV0by1YWFhYWFhYWGAgcGxhY2Vob2xkZXJzIGZsb3cgdGhyb3VnaCB1bmNoYW5nZWQgKGFscmVhZHlcbiAqIG5vbi1pZGVudGlmeWluZykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrSWQoaWQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGNoYXIgPSBcIipcIik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAoaWQgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBzO1xuICBpZiAoL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHMpKSByZXR1cm4gcy5zbGljZSgwLCA2KSArIGNoYXIucmVwZWF0KDQpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiYXV0by1cIikpIHJldHVybiBzO1xuICBpZiAocy5sZW5ndGggPiA2KSByZXR1cm4gcy5zbGljZSgwLCAyKSArIGNoYXIucmVwZWF0KHMubGVuZ3RoIC0gNCkgKyBzLnNsaWNlKC0yKTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXNrTmFtZShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IChuYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkIHx8IHRyaW1tZWQgPT09IFwiVW5rbm93blwiKSByZXR1cm4gdHJpbW1lZDtcblxuICBpZiAoL1xccy8udGVzdCh0cmltbWVkKSkge1xuICAgIGNvbnN0IHBhcnRzID0gdHJpbW1lZC5zcGxpdCgvXFxzKy8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHJldHVybiBwYXJ0c1swXSE7XG4gICAgY29uc3QgZmlyc3QgPSBwYXJ0c1swXSE7XG4gICAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdITtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBGaXhlZCAzIHN0YXJzIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luYWwgbGVuZ3RoIFx1MjAxNCBkb24ndCBsZWFrIGhvd1xuICAgICAgLy8gbG9uZyB0aGUgc3VybmFtZSB3YXMgdmlhIG1hc2sgbGVuZ3RoLlxuICAgICAgY29uc3QgbGFzdE1hc2tlZCA9IGxhc3QubGVuZ3RoIDw9IDEgPyBsYXN0IDogYCR7bGFzdFswXX0qKipgO1xuICAgICAgcmV0dXJuIGAke2ZpcnN0fSAke2xhc3RNYXNrZWR9YDtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlcyA9IHBhcnRzLnNsaWNlKDEsIC0xKS5tYXAoKCkgPT4gXCIqKipcIik7XG4gICAgcmV0dXJuIFtmaXJzdCwgLi4ubWlkZGxlcywgbGFzdF0uam9pbihcIiBcIik7XG4gIH1cblxuICAvLyBDSksgLyBzaW5nbGUtdG9rZW4gcGF0aC4gSXRlcmF0ZSBjb2RlcG9pbnRzIChub3QgVVRGLTE2IHVuaXRzKSBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIGNhbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjaGFycyA9IEFycmF5LmZyb20odHJpbW1lZCk7XG4gIGlmIChjaGFycy5sZW5ndGggPD0gMSkgcmV0dXJuIHRyaW1tZWQ7XG4gIGlmIChjaGFycy5sZW5ndGggPT09IDIpIHJldHVybiBgJHtjaGFyc1swXX1PYDtcbiAgcmV0dXJuIGNoYXJzWzBdICsgXCJPXCIucmVwZWF0KGNoYXJzLmxlbmd0aCAtIDIpICsgY2hhcnNbY2hhcnMubGVuZ3RoIC0gMV07XG59XG4iLCAiLyoqXG4gKiBBbGxlcmd5SW50b2xlcmFuY2UgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9hbGxlcmd5LnB5YC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBBTExPV0VEX0NBVEVHT1JJRVMgPSBuZXcgU2V0KFtcIm1lZGljYXRpb25cIiwgXCJmb29kXCIsIFwiZW52aXJvbm1lbnRcIiwgXCJiaW9sb2dpY1wiXSk7XG5jb25zdCBBTExPV0VEX0NSSVRJQ0FMSVRZID0gbmV3IFNldChbXCJoaWdoXCIsIFwibG93XCIsIFwidW5hYmxlLXRvLWFzc2Vzc1wiXSk7XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJyeG5vcm1cIikpIHJldHVybiBcImh0dHA6Ly93d3cubmxtLm5paC5nb3YvcmVzZWFyY2gvdW1scy9yeG5vcm1cIjtcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0FMTEVSR0VOX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBBbGxlcmd5SW50b2xlcmFuY2UoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBBbGxlcmdlblwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5yZWNvcmRlZF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBwYXRpZW50OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IFwiYWN0aXZlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgdmVyaWZpY2F0aW9uU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2FsbGVyZ3lpbnRvbGVyYW5jZS12ZXJpZmljYXRpb25cIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgY2F0ZWdvcnkgPSByYXcuY2F0ZWdvcnkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ0FURUdPUklFUy5oYXMoY2F0ZWdvcnkpKSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbY2F0ZWdvcnldO1xuICB9XG5cbiAgY29uc3QgY3JpdGljYWxpdHkgPSByYXcuY3JpdGljYWxpdHkgPz8gXCJcIjtcbiAgaWYgKEFMTE9XRURfQ1JJVElDQUxJVFkuaGFzKGNyaXRpY2FsaXR5KSkge1xuICAgIHJlc291cmNlLmNyaXRpY2FsaXR5ID0gY3JpdGljYWxpdHk7XG4gIH1cblxuICBpZiAocmF3LnJlY29yZGVkX2RhdGUpIHtcbiAgICByZXNvdXJjZS5yZWNvcmRlZERhdGUgPSBgJHtyYXcucmVjb3JkZWRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgY29uc3QgcmVhY3Rpb25Ob3RlID0gcmF3LnJlYWN0aW9uID8/IFwiXCI7XG4gIGlmIChyZWFjdGlvbk5vdGUpIHtcbiAgICByZXNvdXJjZS5yZWFjdGlvbiA9IFt7IGRlc2NyaXB0aW9uOiByZWFjdGlvbk5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBDb25kaXRpb24gbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9jb25kaXRpb24ucHlgLiBJbmNsdWRlcyB0aGUgSUNELTEwLUNNXG4gKiBub3JtYWxpc2VyIChUV05ISUZISVIgUm91bmQtMyBmaXgpIHdoaWNoIGluc2VydHMgdGhlIGNhbm9uaWNhbCBkb3RcbiAqIGJhY2sgaW50byBOSEkncyB1bi1kb3R0ZWQgY29kZXMgKFwiRTExMjJcIiBcdTIxOTIgXCJFMTEuMjJcIikuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuLy8gSUNELTEwLUNNIGNhbm9uaWNhbCBmb3JtIGlzICdYWFguWVlZW0EtWl0nIChjYXRlZ29yeSAzIGNoYXJzICsgb3B0aW9uYWxcbi8vIGRvdCArIHN1YmRpdmlzaW9uICsgb3B0aW9uYWwgN3RoLWNoYXJhY3RlciBleHRlbnNpb24pLiBOSEkgXHU1MDY1XHU0RkREIHNlbmRzXG4vLyBjb2RlcyBXSVRIT1VUIHRoZSBkb3QgKCdFMTEyMicsICdNNDc4OTInLCAnUzA5OTNYQScsICdNMTkyNzEnKS5cbi8vIFZhbGlkYXRvciByZWplY3RzIHVuLWRvdHRlZCBjb2RlcyBhcyAnVW5rbm93biBjb2RlJy5cbmNvbnN0IElDRDEwX0NBVEVHT1JZX1JFID0gL15bQS1aXVswLTlBLVpdezJ9JC87XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBkb3QgYmFjayBpbnRvIE5ISSdzIG5vLWRvdCBJQ0QtMTAtQ00gY29kZXMuXG4gKiAgIEUxMTIyICAgIFx1MjE5MiBFMTEuMjJcbiAqICAgTTQ3ODkyICAgXHUyMTkyIE00Ny44OTJcbiAqICAgUzA5OTNYQSAgXHUyMTkyIFMwOS45M1hBXG4gKiAgIEUxMSAgICAgIFx1MjE5MiBFMTEgICAgICAgIChubyBzdWJkaXZpc2lvbjsgcGFzcyB0aHJvdWdoKVxuICogICBFMTEuMjIgICBcdTIxOTIgRTExLjIyICAgICAoYWxyZWFkeSBkb3R0ZWQ7IHBhc3MgdGhyb3VnaClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUljZDEwQ20oY29kZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghY29kZSB8fCBjb2RlLmluY2x1ZGVzKFwiLlwiKSkgcmV0dXJuIGNvZGUgPz8gXCJcIjtcbiAgY29uc3QgcyA9IGNvZGUudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG4gIGlmIChzLmxlbmd0aCA8PSAzKSByZXR1cm4gcztcbiAgY29uc3QgaGVhZCA9IHMuc2xpY2UoMCwgMyk7XG4gIGNvbnN0IHRhaWwgPSBzLnNsaWNlKDMpO1xuICBpZiAoSUNEMTBfQ0FURUdPUllfUkUudGVzdChoZWFkKSkge1xuICAgIHJldHVybiBgJHtoZWFkfS4ke3RhaWx9YDtcbiAgfVxuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZC0xMFwiKSB8fCBzLmluY2x1ZGVzKFwiaWNkMTBcIikpIHtcbiAgICAvLyBOSEkgXHU1MDY1XHU0RkREIGNvZGVzIGFyZSBJQ0QtMTAtQ00gKFVTL1RhaXdhbiBleHRlbmRlZCBzZXQgXHUyMDE0IGUuZy5cbiAgICAvLyBFMTEuMjIpLiBUaGUgYmFzZSBJQ0QtMTAgVmFsdWVTZXQgcmVqZWN0cyB0aGVzZSBhcyAnVW5rbm93biBjb2RlJy5cbiAgICByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfQ007XG4gIH1cbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX0NPTkRJVElPTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQ29uZGl0aW9uKHJhdzogUmVjb3JkPHN0cmluZywgYW55PiwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBDb25kaXRpb25cIjtcbiAgbGV0IGNvZGUgPSByYXcuY29kZSBhcyBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcbiAgaWYgKHN5c3RlbSA9PT0gc3lzdGVtcy5JQ0RfMTBfQ00gJiYgY29kZSkge1xuICAgIGNvZGUgPSBub3JtYWxpemVJY2QxMENtKGNvZGUpO1xuICB9XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkNvbmRpdGlvblwiLFxuICAgIC8vIFN0YWJsZSBpZCBmYWxscyBiYWNrIHRvIGRpc3BsYXkgd2hlbiBubyBjb2RlIGlzIHByZXNlbnQgKGNhdGFzdHJvcGhpY1xuICAgIC8vIGlsbG5lc3Mgcm93cyBmcm9tIElIS0UzMjA5IGNhcnJ5IHRoZSBDaGluZXNlIG5hcnJhdGl2ZSBvbmx5KS4gTWlycm9yc1xuICAgIC8vIHRoZSBzYW1lIGBjb2RlIHx8IGRpc3BsYXlgIHBhdHRlcm4gaW4gZGlhZ25vc3RpYy1yZXBvcnQudHMgYW5kXG4gICAgLy8gYWxsZXJneS50cyBcdTIwMTQgYXZvaWRzIGhhc2ggY29sbGlzaW9ucyBiZXR3ZWVuIHR3byBzYW1lLWRheSBjb2RlLWxlc3NcbiAgICAvLyBjb25kaXRpb25zLlxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3Lm9uc2V0X2RhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY2xpbmljYWxTdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLWNsaW5pY2FsXCIsXG4gICAgICAgICAgY29kZTogcmF3LmNsaW5pY2FsX3N0YXR1cyA/PyBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9jb25kaXRpb24tdmVyLXN0YXR1c1wiLFxuICAgICAgICAgIGNvZGU6IFwiY29uZmlybWVkXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH07XG5cbiAgLy8gQ2F0ZWdvcnkgcm91dGVzIHRoZSBDb25kaXRpb24gaW50byB0aGUgcmlnaHQgZG93bnN0cmVhbSB2aWV3LlxuICAvLyAtIFwicHJvYmxlbS1saXN0LWl0ZW1cIiBcdTIxOTIgU01BUlQgLyBJUFMgUHJvYmxlbSBMaXN0IHNlY3Rpb25cbiAgLy8gLSBcImVuY291bnRlci1kaWFnbm9zaXNcIiBcdTIxOTIgcGVyLWVuY291bnRlciBkaWFnbm9zZXNcbiAgLy8gLSBcImhlYWx0aC1jb25jZXJuXCIgXHUyMTkyIElQUyBIZWFsdGggQ29uY2VybnNcbiAgLy8gQWRhcHRlci1sZXZlbCBkZWNpc2lvbjogXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1IHJvd3MgbWFyayBjYXRlZ29yeT1cInByb2JsZW0tbGlzdC1pdGVtXCI7XG4gIC8vIGdlbmVyaWMgZW5jb3VudGVyLWRlcml2ZWQgY29uZGl0aW9ucyBjYW4gb21pdCwgZGVmYXVsdGluZyB0byBub1xuICAvLyBleHBsaWNpdCBjYXRlZ29yeSAoU01BUlQgYXBwcyBmYWxsIHRocm91Z2ggdG8gYWxsLWNvbmRpdGlvbnMgdmlldykuXG4gIGlmIChyYXcuY2F0ZWdvcnkpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiByYXcuY2F0ZWdvcnksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIHJlc291cmNlLmNvZGUgPSB7XG4gICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICB0ZXh0OiBkaXNwbGF5LFxuICB9O1xuXG4gIGNvbnN0IHNldmVyaXR5ID0gcmF3LnNldmVyaXR5ID8/IFwiXCI7XG4gIGlmIChzZXZlcml0eSkge1xuICAgIHJlc291cmNlLnNldmVyaXR5ID0geyB0ZXh0OiBzZXZlcml0eSB9O1xuICB9XG5cbiAgaWYgKHJhdy5vbnNldF9kYXRlKSB7XG4gICAgcmVzb3VyY2Uub25zZXREYXRlVGltZSA9IGAke3Jhdy5vbnNldF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIERpYWdub3N0aWNSZXBvcnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9kaWFnbm9zdGljX3JlcG9ydC5weWAuIFJldHVybnMgbnVsbCBmb3JcbiAqIGxpc3QtcGFnZSByb3dzIGxhY2tpbmcgYSBjb25jbHVzaW9uLCBhbmQgZm9yIGxhYi12YWx1ZS1vbmx5IFwicmVwb3J0c1wiXG4gKiB0aGF0IHdvdWxkIGR1cGxpY2F0ZSBhIHByb3BlciBPYnNlcnZhdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBWMl8wMDc0ID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIjtcblxuY29uc3QgQ0FURUdPUllfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBMQUI6IFtWMl8wMDc0LCBcIkxBQlwiLCBcIkxhYm9yYXRvcnlcIl0sXG4gIFJBRDogW1YyXzAwNzQsIFwiUkFEXCIsIFwiUmFkaW9sb2d5XCJdLFxuICBDQVI6IFtWMl8wMDc0LCBcIkNBUlwiLCBcIkNhcmRpb2xvZ3lcIl0sXG4gIFBBVEg6IFtWMl8wMDc0LCBcIlBBVFwiLCBcIlBhdGhvbG9neVwiXSxcbn07XG5cbi8vIExhYi1yZXN1bHQgcGF0dGVybnMgdGhhdCBsb29rIGxpa2Ugc2luZ2xlLXZhbHVlIGxhYiByZWFkaW5ncyByYXRoZXJcbi8vIHRoYW4gYSBuYXJyYXRpdmUgcmVwb3J0LlxuY29uc3QgTEFCX1VOSVRfUkUgPVxuICAvXFxkKyg/OlxcLlxcZCspP1xccyooPzolfG1nXFwvZEx8Z1xcL2RMfG1tb2xcXC9MfFVcXC9MfElVXFwvTHxtSVVcXC9MfG5nXFwvbUx8XHUwM0JDZ1xcL2RMfHVnXFwvZEx8cGdcXC9tTHxmTHxcXC91THwxMFxcXj9cXGQrXFwvdUx8eDEwXFxeP1xcZCtcXC91THxzZWN8XHU3OUQyfGNvcGllc1xcL21MKS87XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgdGV4dCA9IGNvbmNsdXNpb24udHJpbSgpO1xuICAvLyBSZWFsIG5hcnJhdGl2ZSByZXBvcnRzIGFsbW9zdCBhbHdheXMgY29udGFpbiBtdWx0aXBsZSBzZW50ZW5jZXMuXG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDEwMCkgcmV0dXJuIGZhbHNlO1xuICAvLyBTaW5nbGUgdmFsdWUgcGF0dGVybiArIHBhcmVudGhldGljYWwgcmVmZXJlbmNlIHJhbmdlID0gbGFiIGxpbmUuXG4gIGlmIChMQUJfVU5JVF9SRS50ZXN0KHRleHQpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwRGlhZ25vc3RpY1JlcG9ydChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgY29uY2x1c2lvbiA9ICgocmF3LmNvbmNsdXNpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY2F0S2V5UmF3ID0gU3RyaW5nKHJhdy5jYXRlZ29yeSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAoY2F0S2V5UmF3ID09PSBcIkxBQlwiICYmIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBSZXBvcnRcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW1IaW50ID0gcmF3LnN5c3RlbSA/PyBcIlwiO1xuICBjb25zdCBzeXN0ZW0gPVxuICAgIHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiICYmIHN5c3RlbUhpbnQudG9VcHBlckNhc2UoKSA9PT0gXCJMT0lOQ1wiXG4gICAgICA/IHN5c3RlbXMuTE9JTkNcbiAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfUkVQT1JUX0NPREU7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJmaW5hbFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgICBjb25jbHVzaW9uLFxuICB9O1xuXG4gIGNvbnN0IGNhdEVudHJ5ID0gQ0FURUdPUllfTUFQW2NhdEtleVJhd107XG4gIGlmIChjYXRFbnRyeSkge1xuICAgIGNvbnN0IFtjYXRTeXMsIGNhdENvZGUsIGNhdERpc3BsYXldID0gY2F0RW50cnk7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbeyBjb2Rpbmc6IFt7IHN5c3RlbTogY2F0U3lzLCBjb2RlOiBjYXRDb2RlLCBkaXNwbGF5OiBjYXREaXNwbGF5IH1dIH1dO1xuICB9XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcuaXNzdWVkKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3Lmlzc3VlZH1UMDA6MDA6MDArMDg6MDBgO1xuICB9IGVsc2UgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IGhvc3BpdGFsIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogRW5jb3VudGVyIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZW5jb3VudGVyLnB5YC4gU3RhYmxlIElEIGluY2x1ZGVzIGhvc3BpdGFsXG4gKiBzbyBzYW1lLWRheSB2aXNpdHMgdG8gZGlmZmVyZW50IGluc3RpdHV0aW9ucyBlYWNoIGdldCB0aGVpciBvd25cbiAqIEVuY291bnRlciAodGhlIHBvc3QtbWFwcGluZyBsaW5rZXIgZGVwZW5kcyBvbiB0aGlzKS5cbiAqL1xuXG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUNUQ09ERV9TWVNURU0gPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtQWN0Q29kZVwiO1xuXG5jb25zdCBDTEFTU19NQVA6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4gPSB7XG4gIEFNQjogW0FDVENPREVfU1lTVEVNLCBcIkFNQlwiLCBcImFtYnVsYXRvcnlcIl0sXG4gIElNUDogW0FDVENPREVfU1lTVEVNLCBcIklNUFwiLCBcImlucGF0aWVudCBlbmNvdW50ZXJcIl0sXG4gIEVNRVI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJFTUVSXCIsIFwiZW1lcmdlbmN5XCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEVuY291bnRlcihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGVuY0NsYXNzID0gU3RyaW5nKHJhdy5jbGFzcyA/PyBcIkFNQlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjbGFzc0VudHJ5ID0gQ0xBU1NfTUFQW2VuY0NsYXNzXSA/PyBDTEFTU19NQVAuQU1CITtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiRW5jb3VudGVyXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgcmF3LmRhdGUgPz8gXCJcIiwgZW5jQ2xhc3MsICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmlzaGVkXCIsXG4gICAgY2xhc3M6IHtcbiAgICAgIHN5c3RlbTogY2xhc3NFbnRyeVswXSxcbiAgICAgIGNvZGU6IGNsYXNzRW50cnlbMV0sXG4gICAgICBkaXNwbGF5OiBjbGFzc0VudHJ5WzJdLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICAvLyBOSEkncyBlbmNvdW50ZXIgXCJ0eXBlXCIgbWFya2VycyBcdTIwMTQgJ0lDXHU1MzYxXHU4Q0M3XHU2NTk5JyAvICdcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTknIC8gJ1x1NEY0Rlx1OTY2MidcbiAgLy8gXHUyMDE0IGFyZSBkYXRhLW9yaWdpbiBsYWJlbHMsIG5vdCBTTk9NRUQgY2xpbmljYWwgdHlwZXMuIEtlZXAgdGhlbSBhc1xuICAvLyBDb2RlYWJsZUNvbmNlcHQudGV4dCB3aXRob3V0IGNsYWltaW5nIFNOT01FRC5cbiAgY29uc3QgdHlwZURpc3BsYXkgPSAoKHJhdy50eXBlX2Rpc3BsYXkgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICh0eXBlRGlzcGxheSkge1xuICAgIHJlc291cmNlLnR5cGUgPSBbeyB0ZXh0OiB0eXBlRGlzcGxheSB9XTtcbiAgfVxuXG4gIGNvbnN0IHBlcmlvZDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBpZiAocmF3LmRhdGUpIHBlcmlvZC5zdGFydCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuZW5kX2RhdGUpIHBlcmlvZC5lbmQgPSBgJHtyYXcuZW5kX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKE9iamVjdC5rZXlzKHBlcmlvZCkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLnBlcmlvZCA9IHBlcmlvZDtcbiAgfVxuXG4gIGNvbnN0IGRlcGFydG1lbnQgPSByYXcuZGVwYXJ0bWVudCA/PyBcIlwiO1xuICBjb25zdCBwcm92aWRlciA9IHJhdy5wcm92aWRlciA/PyBcIlwiO1xuICBpZiAoZGVwYXJ0bWVudCB8fCBwcm92aWRlcikge1xuICAgIGNvbnN0IHBhcnRpY2lwYW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKHByb3ZpZGVyKSBwYXJ0aWNpcGFudC5pbmRpdmlkdWFsID0geyBkaXNwbGF5OiBwcm92aWRlciB9O1xuICAgIHJlc291cmNlLnBhcnRpY2lwYW50ID0gT2JqZWN0LmtleXMocGFydGljaXBhbnQpLmxlbmd0aCA+IDAgPyBbcGFydGljaXBhbnRdIDogW107XG4gICAgaWYgKGRlcGFydG1lbnQpIHtcbiAgICAgIHJlc291cmNlLnNlcnZpY2VUeXBlID0geyB0ZXh0OiBkZXBhcnRtZW50IH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2Uuc2VydmljZVByb3ZpZGVyID0geyBkaXNwbGF5OiBob3NwaXRhbCB9O1xuICB9XG5cbiAgY29uc3QgcmVhc29uID0gcmF3LnJlYXNvbiA/PyBcIlwiO1xuICBpZiAocmVhc29uKSB7XG4gICAgcmVzb3VyY2UucmVhc29uQ29kZSA9IFt7IHRleHQ6IHJlYXNvbiB9XTtcbiAgfVxuXG4gIGNvbnN0IGRpc2NoYXJnZSA9IHJhdy5kaXNjaGFyZ2VfZGlzcG9zaXRpb24gPz8gXCJcIjtcbiAgaWYgKGRpc2NoYXJnZSkge1xuICAgIHJlc291cmNlLmhvc3BpdGFsaXphdGlvbiA9IHsgZGlzY2hhcmdlRGlzcG9zaXRpb246IHsgdGV4dDogZGlzY2hhcmdlIH0gfTtcbiAgfVxuXG4gIGNvbnN0IGNsaW5pY2FsTm90ZSA9ICgocmF3LmNsaW5pY2FsX25vdGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChjbGluaWNhbE5vdGUpIHtcbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogY2xpbmljYWxOb3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogTWVkaWNhdGlvblJlcXVlc3QgbWFwcGVyICsgYmlsaW5ndWFsIGRlZHVwbGljYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL21lZGljYXRpb24ucHlgLiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHJlcG9ydHMgdGhlXG4gKiBTQU1FIHByZXNjcmlwdGlvbiBtdWx0aXBsZSB0aW1lcyAoRW5nbGlzaC1vbmx5IC8gRW5nK1x1NEUyRCAvIFx1NEUyRCtFbmcpLlxuICogYG1hcE1lZGljYXRpb25zRGVkdXBgIGNvbGxhcHNlcyB0aGVzZSB0byBvbmUgTWVkaWNhdGlvblJlcXVlc3QgcGVyXG4gKiAoZGF0ZSwgY2Fub25pY2FsLWRydWcta2V5KSwgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIG1vcmUgQ0pLIGNoYXJzXG4gKiAoY2xpbmljaWFucyByZWFkIFx1NTU0Nlx1NTRDMVx1NTQwRCBmaXJzdCkuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBub3JtYWxpemVJY2QxMENtIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gaXNDamsoY2g6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTRFMDAgKFUrNEUwMCkgdG8gXHU5RkZGIChVKzlGRkYpIGNvdmVycyBDSksgVW5pZmllZCBJZGVvZ3JhcGhzLlxuICBjb25zdCBjcCA9IGNoLmNvZGVQb2ludEF0KDApID8/IDA7XG4gIHJldHVybiBjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmO1xufVxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgaWYgKCFzKSByZXR1cm4gMDtcbiAgbGV0IG4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIGlmIChpc0NqayhjaCkpIG4rKztcbiAgcmV0dXJuIG47XG59XG5cbi8qKlxuICogTWF0Y2ggYSBcImxvbmdcIiBFbmdsaXNoIGNodW5rIChcdTIyNjU0IGNoYXJzIG9mIEEtWi8wLTkvcHVuY3R1YXRpb24gY29tbW9uXG4gKiB0byBkcnVnIG5hbWVzKS4gQXZvaWQgbWF0Y2hpbmcgc2hvcnQgdG9rZW5zIGxpa2UgXCJEXCIgb3IgXCJQT1wiIHRoYXRcbiAqIGFwcGVhciBpbnNpZGUgQ2hpbmVzZSBuYW1lcy5cbiAqL1xuY29uc3QgRU5fQ0hVTktfRyA9IC9bQS1aXVtBLVowLTkuJS9cXC1cIidcXHNdezMsfS9nO1xuXG4vKipcbiAqIFJlZHVjZSBhIGRydWctbmFtZSBzdHJpbmcgdG8gYSBzdGFibGUgY2Fub25pY2FsIGtleS4gRXh0cmFjdCB0aGVcbiAqIGxvbmdlc3QgRW5nbGlzaCBmcmFnbWVudCwgdGhlbiB0cnVuY2F0ZSBhdCBjb21tb24gc2VwYXJhdG9ycyBzbyBhXG4gKiBuYW1lIHdpdGggZXh0cmEgdHJhaWxpbmcgbW9kaWZpZXJzIHN0aWxsIGNvbGxhcHNlcyB0byBicmFuZCtzdHJlbmd0aC5cbiAqXG4gKiBFeGFtcGxlcyAoYWxsIG1hcCB0byBcInRpbW9wdG9sIHhlIDAuNSUgb3BodGhhbG1pYyBzb2x1dGlvblwiKTpcbiAqICAgXCJUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT05cIlxuICogICBcIlRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTiAoXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2KVwiXG4gKiAgIFwiXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2IChUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT04pXCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbERydWdLZXkobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAobmFtZSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjaHVua3MgPSBbLi4ucy5tYXRjaEFsbChFTl9DSFVOS19HKV0ubWFwKChtKSA9PiBtWzBdKTtcbiAgaWYgKGNodW5rcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKG5hbWUgPz8gXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgbGV0IGxvbmdlc3QgPSBjaHVua3MucmVkdWNlKChhLCBiKSA9PiAoYi5sZW5ndGggPiBhLmxlbmd0aCA/IGIgOiBhKSkudHJpbSgpO1xuICBmb3IgKGNvbnN0IHNlcCBvZiBbXCIgLSBcIiwgXCIgXHUyMDEzIFwiLCBcIiAvIFwiXSkge1xuICAgIGlmIChsb25nZXN0LmluY2x1ZGVzKHNlcCkpIHtcbiAgICAgIGxvbmdlc3QgPSBsb25nZXN0LnNwbGl0KHNlcClbMF0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbG9uZ2VzdC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBCZXN0LWVmZm9ydCBhY3RpdmUgdnMgY29tcGxldGVkIGRlY2lzaW9uIGZvciBhIE1lZGljYXRpb25SZXF1ZXN0LlxuICogQWN0aXZlIHdoaWxlIChhdXRob3JlZF9kYXRlICsgZHVyYXRpb24gPiB0b2RheSk7IG90aGVyd2lzZSBjb21wbGV0ZWQuXG4gKiBNaXNzaW5nIGR1cmF0aW9uIFx1MjE5MiBhc3N1bWUgOTAtZGF5IHJlZmlsbCB3aW5kb3cgKE5ISSdzIHR5cGljYWwgY2FkZW5jZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZWRTdGF0dXMoXG4gIGF1dGhvcmVkSXNvOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkdXJhdGlvbkRheXM6IGFueSxcbik6IFwiYWN0aXZlXCIgfCBcImNvbXBsZXRlZFwiIHtcbiAgaWYgKCFhdXRob3JlZElzbykgcmV0dXJuIFwiY29tcGxldGVkXCI7XG4gIGNvbnN0IGRhdGVQYXJ0ID0gU3RyaW5nKGF1dGhvcmVkSXNvKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IHBhcnNlZCA9IG5ldyBEYXRlKGAke2RhdGVQYXJ0fVQwMDowMDowMFpgKTtcbiAgaWYgKE51bWJlci5pc05hTihwYXJzZWQuZ2V0VGltZSgpKSkgcmV0dXJuIFwiY29tcGxldGVkXCI7XG5cbiAgbGV0IGRheXM6IG51bWJlciB8IG51bGw7XG4gIGlmIChkdXJhdGlvbkRheXMgPT09IG51bGwgfHwgZHVyYXRpb25EYXlzID09PSB1bmRlZmluZWQgfHwgZHVyYXRpb25EYXlzID09PSBcIlwiKSB7XG4gICAgZGF5cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbiA9IE51bWJlci5wYXJzZUludChTdHJpbmcoZHVyYXRpb25EYXlzKSwgMTApO1xuICAgIGRheXMgPSBOdW1iZXIuaXNGaW5pdGUobikgPyBuIDogbnVsbDtcbiAgfVxuICBpZiAoZGF5cyA9PT0gbnVsbCkgZGF5cyA9IDkwO1xuXG4gIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHBhcnNlZC5nZXRUaW1lKCkpO1xuICBlbmQuc2V0VVRDRGF0ZShlbmQuZ2V0VVRDRGF0ZSgpICsgZGF5cyk7XG4gIC8vIENvbXBhcmUgZGF0ZS1vbmx5ICh0b2RheSBpbiBVVEMgc2luY2Ugd2UgYXV0aG9yZWRJc28gaXMgZGF0ZS1vbmx5KS5cbiAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICB0b2RheS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGVuZCA+PSB0b2RheSA/IFwiYWN0aXZlXCIgOiBcImNvbXBsZXRlZFwiO1xufVxuXG4vKipcbiAqIENvbnZlcnQgb25lIHNjcmFwZWQgcHJlc2NyaXB0aW9uIGRpY3QgXHUyMTkyIEZISVIgUjQgTWVkaWNhdGlvblJlcXVlc3QuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiByYXcgaGFzIG5vIGBkcnVnX25hbWVgIChjYWxsZXIgZmlsdGVycyBvdXQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTWVkaWNhdGlvblJlcXVlc3QoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGRydWdOYW1lID0gKChyYXcuZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWRydWdOYW1lKSByZXR1cm4gbnVsbDtcblxuICAvLyBDYW5vbmljYWwga2V5IChub3QgcmF3IGRydWdfbmFtZSkgZm9yIHN0YWJsZSBpZCBzbyB0aGUgdGhyZWUgTkhJXG4gIC8vIFx1NEUyRFx1ODJGMSB2YXJpYW50cyBvZiB0aGUgc2FtZSBkcnVnIGNvbGxhcHNlIHRvIG9uZSBGSElSIHJlc291cmNlLlxuICBjb25zdCBtZWRJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSksIHJhdy5kYXRlID8/IFwiXCIpO1xuXG4gIGNvbnN0IGRydWdDb2RlID0gKChyYXcuY29kZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgY29kaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIHN5c3RlbTogZHJ1Z0NvZGUgPyBzeXN0ZW1zLk5ISV9EUlVHX0NPREUgOiBzeXN0ZW1zLkhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUsXG4gICAgY29kZTogZHJ1Z0NvZGUgfHwgZHJ1Z05hbWUsXG4gICAgZGlzcGxheTogZHJ1Z05hbWUsXG4gIH07XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gICAgaWQ6IG1lZElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IG1lZFN0YXR1cyhyYXcuZGF0ZSA/PyBcIlwiLCByYXcuZHVyYXRpb25fZGF5cyksXG4gICAgaW50ZW50OiBcIm9yZGVyXCIsXG4gICAgbWVkaWNhdGlvbkNvZGVhYmxlQ29uY2VwdDoge1xuICAgICAgY29kaW5nOiBbY29kaW5nXSxcbiAgICAgIHRleHQ6IGRydWdOYW1lLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5hdXRob3JlZE9uID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGRydWdDbGFzcyA9ICgocmF3LmRydWdfY2xhc3MgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChkcnVnQ2xhc3MpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFt7IHRleHQ6IGRydWdDbGFzcyB9XTtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnJlcXVlc3RlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIC8vIERvc2FnZSBcdTIwMTQgb25seSB3aGVuIHNvdXJjZSBhY3R1YWxseSBoYXMgaXQuIE5ISSdzIG1lZGljYXRpb24tbGlzdFxuICAvLyBlbmRwb2ludCBwcm92aWRlcyBub25lIG9mIHRoZXNlOyBvdGhlciBISVMgYWRhcHRlcnMgZ2V0IGFcbiAgLy8gc3RydWN0dXJlZCBkb3NhZ2Ugb3V0LlxuICBjb25zdCBkb3NhZ2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgayBvZiBbXCJkb3NlXCIsIFwidW5pdFwiLCBcImZyZXF1ZW5jeVwiXSBhcyBjb25zdCkge1xuICAgIGlmIChyYXdba10pIHBhcnRzLnB1c2goU3RyaW5nKHJhd1trXSkpO1xuICB9XG4gIGlmIChwYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgZG9zYWdlLnRleHQgPSBwYXJ0cy5qb2luKFwiIFwiKTtcbiAgfVxuICBpZiAocmF3LnJvdXRlKSB7XG4gICAgZG9zYWdlLnJvdXRlID0ge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW06IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiLCBkaXNwbGF5OiByYXcucm91dGUgfV0sXG4gICAgfTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMoZG9zYWdlKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UuZG9zYWdlSW5zdHJ1Y3Rpb24gPSBbZG9zYWdlXTtcbiAgfVxuXG4gIC8vIGRpc3BlbnNlUmVxdWVzdCB3aXRoIHF1YW50aXR5ICsgc3VwcGx5IGR1cmF0aW9uIHdoZW4gcHJlc2VudC5cbiAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcXR5UmF3ID0gcmF3LnF1YW50aXR5O1xuICBpZiAocXR5UmF3ICE9PSBudWxsICYmIHF0eVJhdyAhPT0gdW5kZWZpbmVkICYmIHF0eVJhdyAhPT0gXCJcIikge1xuICAgIGNvbnN0IHF0eU51bSA9IE51bWJlci5wYXJzZUZsb2F0KFN0cmluZyhxdHlSYXcpLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocXR5TnVtKSkge1xuICAgICAgZHIucXVhbnRpdHkgPSB7IHZhbHVlOiBxdHlOdW0gfTtcbiAgICB9XG4gIH1cbiAgaWYgKHJhdy5kdXJhdGlvbl9kYXlzKSB7XG4gICAgY29uc3QgZGF5cyA9IE51bWJlci5wYXJzZUludChTdHJpbmcocmF3LmR1cmF0aW9uX2RheXMpLCAxMCk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShkYXlzKSkge1xuICAgICAgZHIuZXhwZWN0ZWRTdXBwbHlEdXJhdGlvbiA9IHtcbiAgICAgICAgdmFsdWU6IGRheXMsXG4gICAgICAgIHVuaXQ6IFwiZGF5c1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiBcImRcIixcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkcikubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRpc3BlbnNlUmVxdWVzdCA9IGRyO1xuICB9XG5cbiAgY29uc3QgaW5kaWNhdGlvbiA9ICgocmF3LmluZGljYXRpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25Db2RlID0gKChyYXcuaW5kaWNhdGlvbl9jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uQ29kZSkge1xuICAgIGNvbnN0IHJjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGluZGljYXRpb25Db2RlKSB7XG4gICAgICByYy5jb2RpbmcgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IHN5c3RlbXMuSUNEXzEwX0NNLFxuICAgICAgICAgIGNvZGU6IG5vcm1hbGl6ZUljZDEwQ20oaW5kaWNhdGlvbkNvZGUpLFxuICAgICAgICAgIGRpc3BsYXk6IGluZGljYXRpb24gfHwgaW5kaWNhdGlvbkNvZGUsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAoaW5kaWNhdGlvbikge1xuICAgICAgcmMudGV4dCA9IGluZGljYXRpb25Db2RlID8gYCR7aW5kaWNhdGlvbkNvZGV9ICR7aW5kaWNhdGlvbn1gLnRyaW0oKSA6IGluZGljYXRpb247XG4gICAgfVxuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbcmNdO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIEdyb3VwLWF3YXJlIG1lZGljYXRpb24gbWFwcGVyIHRoYXQgZGVkdXBlcyBcdTRFMkRcdTgyRjEgXHU5NkQ5XHU4QTlFIGR1cGxpY2F0ZXMuXG4gKlxuICogU3RyYXRlZ3k6XG4gKiAgIDEuIENvbXB1dGUgY2Fub25pY2FsIGtleSBwZXIgZHJ1ZyBuYW1lIChsb25nZXN0IEVuZ2xpc2ggY2h1bmspLlxuICogICAyLiBHcm91cCBieSAoZGF0ZSwgY2Fub25pY2FsX2tleSkuIEtlZXAgT05FIGVudHJ5IHBlciBncm91cCxcbiAqICAgICAgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGJyYW5kXG4gKiAgICAgIG5hbWUgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZpcnN0KS5cbiAqICAgMy4gTWFwIGVhY2gga2VwdCBlbnRyeSB0aHJvdWdoIG1hcE1lZGljYXRpb25SZXF1ZXN0LlxuICpcbiAqIE5vdGU6IFB5dGhvbiBjb21tZW50IHNheXMgXCJtb3JlIENKS1wiIGJ1dCB0aGUgY29kZSB1c2VzIGA8YCAoZmV3ZXIpO1xuICogd2UgcHJlc2VydmUgdGhlIGFjdHVhbCBjb2RlIGJlaGF2aW91ciB0byBrZWVwIHBhcml0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25zRGVkdXAocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGZvciAoY29uc3QgaXRlbSBvZiByYXdJdGVtcykge1xuICAgIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZHJ1Z05hbWUgPSAoKGl0ZW0uZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGlmICghZHJ1Z05hbWUpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRhdGVQYXJ0ID0gKChpdGVtLmRhdGUgPz8gXCJcIikgYXMgc3RyaW5nKS5zbGljZSgwLCAxMCk7XG4gICAgY29uc3Qga2V5ID0gYCR7ZGF0ZVBhcnR9fCR7Y2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSl9YDtcbiAgICBjb25zdCBleGlzdGluZyA9IGJ5S2V5LmdldChrZXkpO1xuICAgIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUHJlZmVyIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmQgbmFtZSkuXG4gICAgICBpZiAoY2prQ2hhcnMoZHJ1Z05hbWUpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZHJ1Z19uYW1lID8/IFwiXCIpKSB7XG4gICAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBieUtleS52YWx1ZXMoKSkge1xuICAgIGNvbnN0IG0gPSBtYXBNZWRpY2F0aW9uUmVxdWVzdChpdGVtLCBwYXRpZW50SWQpO1xuICAgIGlmIChtICE9PSBudWxsKSBvdXQucHVzaChtKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwgIi8qKlxuICogTE9JTkMgbWFwcGluZyB0YWJsZXMgZm9yIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIExPSU5DIFI0IGNvZGluZ3MuXG4gKlxuICogUHVyZSBkYXRhLCBubyBsb2dpYy4gUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19sb2luY190YWJsZXMucHlgLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBfTkhJX1RPX0xPSU5DIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgcHJpbWFyeSBMT0lOQyBtYXBwaW5nLiBTb3VyY2Ugb2YgdHJ1dGg6XG4vLyBUV05ISUZISVIgUEFTIEltcGxlbWVudGF0aW9uIEd1aWRlIENvbmNlcHRNYXAtbmhpLWxvaW5jXG4vLyBodHRwczovL2J1aWxkLmZoaXIub3JnL2lnL1RXTkhJRkhJUi9wYXMvQ29uY2VwdE1hcC1uaGktbG9pbmMuaHRtbFxuLy9cbi8vIFRoYXQgQ29uY2VwdE1hcCBkZWNsYXJlcyA1MyBOSEkgY29kZXMgd2l0aCBgZXF1aXZhbGVuY2U6IHJlbGF0ZWR0b2Bcbi8vIGFnYWluc3QgODA2IExPSU5DIHZhcmlhbnRzIChkaWZmZXJlbnQgc3BlY2ltZW5zIC8gdW5pdHMgLyBtZXRob2RzXG4vLyBwZXIgTkhJIGNvZGUgXHUyMDE0IGNvbmZpcm1pbmcgdGhlIFwiTkhJIGlzIGNvYXJzZSwgTE9JTkMgaXMgZmluZVwiIHZpZXcpLlxuLy8gRm9yIGVhY2ggTkhJIGNvZGUgd2UgaGFuZC1waWNrIHRoZSBjYW5vbmljYWwgTE9JTkMgbW9zdCBjbGluaWNpYW5zXG4vLyB3b3VsZCBleHBlY3QgaW4gYSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgbGFiIHJlcG9ydDogU2VydW0vUGxhc21hICsgTWFzcy12b2x1bWVcbi8vIChvciBhdXRvLWNvdW50IGZvciBjZWxsIGNvdW50ZXJzKS4gRWRnZSBjYXNlcyBub3RlZCBpbmxpbmUuXG5leHBvcnQgY29uc3QgTkhJX1RPX0xPSU5DOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgSGFlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDJDXCI6IFwiNjY5MC0yXCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3OCBcdTIwMTQgTGV1a29jeXRlcyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMDNDXCI6IFwiNzE4LTdcIiwgLy8gXHU4ODQwXHU4MjcyXHU3RDIwXHU2QUEyXHU2N0U1IFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIEJsb29kXG4gIFwiMDgwMDZDXCI6IFwiNzc3LTNcIiwgLy8gXHU4ODQwXHU1QzBGXHU2NzdGXHU4QTA4XHU2NTc4IFx1MjAxNCBQbGF0ZWxldHMgIy92b2wgQmxvb2QgQXV0b1xuICBcIjA4MDEzQ1wiOiBcIjU3MDIxLThcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4IFx1MjAxNCBDQkMgVyBBdXRvIERpZmYgcGFuZWxcbiAgXCIwODEyOEJcIjogXCI0NzI4Ni0wXCIsIC8vIFx1OUFBOFx1OUFEM1x1N0QzMFx1ODBERVx1NUY2Mlx1NjE0Qlx1NTIyNFx1OEI4MFx1NTQwOFx1NEY3NVx1N0QzMFx1ODBERVx1NTIwNlx1OTg1RVx1OEEwOFx1NjU3OFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDExQ1wiOiBcIjE3ODYxLTZcIiwgLy8gXHU5MjIzIFx1MjAxNCBDYWxjaXVtIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDE1Q1wiOiBcIjIxNjAtMFwiLCAvLyBcdTgwOENcdTkxNzhcdTkxNTBcdTMwMDFcdTg4NDAgXHUyMDE0IENyZWF0aW5pbmUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMTZDXCI6IFwiMjE2MS04XCIsIC8vIFx1ODA4Q1x1OTE1MFx1MzAwMVx1NUMzRiBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBVcmluZVxuICBcIjA5MDI1Q1wiOiBcIjE5MjAtOFwiLCAvLyBBU1QvR09UIFx1MjAxNCBBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjZDXCI6IFwiMTc0Mi02XCIsIC8vIEFMVC9HUFQgXHUyMDE0IEFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjlDXCI6IFwiMTk3NS0yXCIsIC8vIFx1ODFCRFx1N0QwNVx1N0QyMFx1N0UzRFx1OTFDRiBcdTIwMTQgQmlsaXJ1YmluIHRvdGFsIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDMwQ1wiOiBcIjE5NjgtN1wiLCAvLyBcdTc2RjRcdTYzQTVcdTgxQkRcdTdEMDVcdTdEMjAgXHUyMDE0IEJpbGlydWJpbiBkaXJlY3QgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzNDXCI6IFwiMjUzMi0wXCIsIC8vIFx1NEU3M1x1OTE3OFx1ODEyQlx1NkMyQlx1ODEyMiBcdTIwMTQgTERIIEFjdGl2aXR5IFMvUFxuICBcIjA5MDM4Q1wiOiBcIjE3NTEtN1wiLCAvLyBcdTc2N0RcdTg2Q0JcdTc2N0QgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzhDXCI6IFwiMzU2NzItNVwiLCAvLyBcdTc2RjRcdTYzQTUvXHU3RTNEXHU4MUJEXHU3RDA1XHU3RDIwXHU2QkQ0XHU1MDNDXG4gIFwiMTIxMTJCXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RChcdTUxNERcdTc1QUJcdTZCRDRcdTZGQzFcdTZDRDUpIFx1MjAxNCBBbGJ1bWluIE1hc3Mvdm9sIFMvUFxuICBcIjI0MDA3QlwiOiBcIjE5OTUtMFwiLCAvLyBcdTg4NDBcdTZGM0ZcdTZFMzhcdTk2RTJcdTkyMjMgXHUyMDE0IENhbGNpdW0gaW9uaXplZCBNb2xlcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBIb3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyMUNcIjogXCIyOTg2LThcIiwgLy8gXHU3NzZBXHU0RTM4XHU5MTZGXHU5MTg3XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgTWFzcy92b2wgUy9QXG4gIFwiMjcwMjFCXCI6IFwiMjk5MS04XCIsIC8vIFx1Nzc2QVx1NEUzOFx1ODEwMlx1OTE4N1x1NjUzRVx1NUMwNFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgVGVzdG9zdGVyb25lIEZyZWUgUy9QXG4gIC8vIDA5MTI1QyAvIDA5MTI3QyBjb3JyZWN0ZWQgYWZ0ZXIgZHVhbC1yZXZpZXdlciBhdWRpdCBcdTIwMTQgdGhlIGVhcmxpZXJcbiAgLy8gdmFsdWVzICgzMDE2LTMgd2FzIFRTSCwgMTA1MDEtNSB3YXMgTEgpIHdlcmUganVzdCB3cm9uZyBjb3B5LVxuICAvLyBwYXN0ZXMuIFNvdXJjZSBmb3IgdGhlIG5ldyB2YWx1ZXM6IFRXTkhJRkhJUiBQQVMgQ29uY2VwdE1hcC5cbiAgXCIwOTEyNUNcIjogXCI4MzA5OC00XCIsIC8vIFx1NkZGRVx1NkNFMVx1NTIzQVx1NkZDMFx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRm9sbGl0cm9waW4gKEZTSCkgSW1tdW5vYXNzYXkgUy9QXG4gIFwiMDkxMjdDXCI6IFwiODMwOTYtOFwiLCAvLyBcdTRFOENcdTZDMkJcdTU3RkFcdTY2MjVcdTYwQzVcdTdEMjBcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IEVzdHJhZGlvbCBJbW11bm9hc3NheSBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFR1bW9yIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDdDXCI6IFwiMTgzNC0xXCIsIC8vIFx1MDNCMS1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDQ5Q1wiOiBcIjE4MzQtMVwiLCAvLyBcdTc1MzItXHU4MENFXHU1MTUyXHU4NkNCXHU3NjdEIChBRlAsIFJJQSlcbiAgXCIxMjA4MUNcIjogXCI4MzExMi0zXCIsIC8vIFBTQSAoRUlBL0xJQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjEyMTk4Q1wiOiBcIjgzMTEzLTFcIiwgLy8gRnJlZSBQU0EgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjI3MDUyQ1wiOiBcIjI4NTctMVwiLCAvLyBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUYgKFBTQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDgzQlwiOiBcIjEwODg2LTBcIiwgLy8gXHU2RTM4XHU5NkUyUFNBIChSSUEpXG4gIFwiMTIwNTJCXCI6IFwiMTA4NzMtOFwiLCAvLyBcdTAzQjIyLVx1NUZBRVx1NzQwM1x1ODZDQlx1NzY3RFxuICAvLyBcdTI1MDBcdTI1MDAgSW1tdW5vbG9neSAvIHByb3RlaW5zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDY1QlwiOiBcIjkwOTkxLTFcIiwgLy8gXHU4NkNCXHU3NjdEXHU5NkZCXHU2Q0YzXHU1MjA2XHU2NzkwXG4gIFwiMTIwMjhCXCI6IFwiMTQwMDItMFwiLCAvLyBJZ00gXHU1NUFFXHU1NDExXHU1MTREXHU3NUFCXHU2NEY0XHU2NTYzXG4gIFwiMTIwMjlCXCI6IFwiMTQwMDItMFwiLCAvLyBJZ00gXHU1MTREXHU3NUFCXHU2QkQ0XHU2RkMxXHU2Q0Q1XG4gIFwiMTIxMDNCXCI6IFwiOTU4MDEtN1wiLCAvLyBcdTUxNERcdTc1QUJcdTk2RkJcdTZDRjNcdTUyMDZcdTY3OTBcbiAgXCIxMjE2MEJcIjogXCIxNTE4OS00XCIsIC8vIElnRyBcdTAzQkEvXHUwM0JCXG4gIFwiMTIxNzFCXCI6IFwiMTczNTEtOFwiLCAvLyBcdTYyOTdcdTU1RENcdTRFMkRcdTYwMjdcdTc0MDNcdTdEMzBcdTgwREVcdThDRUFcdTYyOTdcdTlBRDQgKEFOQ0EpXG4gIFwiMTIyMDRCXCI6IFwiMjA1ODQtOVwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdTg4NjhcdTk3NjJcdTZBMTlcdThBMThcbiAgXCIyNTAxM0JcIjogXCI0NDU5Ni01XCIsIC8vIFx1ODdBMlx1NTE0OVx1NTIwN1x1NzI0N1x1NkFBMlx1NjdFNVxuICAvLyBcdTI1MDBcdTI1MDAgSGVwYXRpdGlzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE0MDMwQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMxQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMyQ1wiOiBcIjUxOTYtMVwiLCAvLyBIQnNBZyAoTWFzcy92b2wpXG4gIFwiMTQwNTFDXCI6IFwiMTM5NTUtMFwiLCAvLyBIQ1YgQWJcbiAgXCIyNzAzM0NcIjogXCI1MTk3LTlcIiwgLy8gSEJzQWcgUklBXG4gIC8vIFx1MjUwMFx1MjUwMCBQYXRob2xvZ3kgLyBjeXRvbG9neSAvIElIQyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjE5NUJcIjogXCIxODQ3NC03XCIsIC8vIEhlci0yL25ldSBJU0hcbiAgXCIyNzA2MUJcIjogXCIxNDEzMC05XCIsIC8vIFx1NTJENVx1NjBDNVx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoRVIpXG4gIFwiMjcwNjJCXCI6IFwiMTA4NjEtM1wiLCAvLyBcdTlFQzNcdTlBRDRcdTZGQzBcdTdEMjBcdTYzQTVcdTUzRDdcdTlBRDQgKFBSKVxuICBcIjMwMTAzQlwiOiBcIjgzMDUyLTFcIiwgLy8gUEQtTDEgSUhDXG4gIC8vIFx1MjUwMFx1MjUwMCBBdWRpb2xvZ3kgLyBwdWxtb25hcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTcwMDlCXCI6IFwiMjQzNDEtMFwiLCAvLyBcdTRFMDBcdTZDMjdcdTUzMTZcdTc4QjNcdTgwQkFcdTcwMzBcdTY1NjNcdTkxQ0ZcbiAgXCIyMjAwMUNcIjogXCI0NTQ5OC0zXCIsIC8vIFx1N0QxNFx1OTdGM1x1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICBcIjIyMDE1QlwiOiBcIjQ1NDk4LTNcIiwgLy8gXHU4QTUwXHU4MDdFXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMjVCXCI6IFwiNDY1MzAtMlwiLCAvLyBcdTgxRUFcdThBMThcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFNVUFBMRU1FTlRBTCAobm90IGluIFBBUyBDb25jZXB0TWFwIFx1MjAxNCBoYW5kLWN1cmF0ZWQgZnJvbSBjb21tb25cbiAgLy8gTkhJIGNvZGVzIHNlZW4gaW4gXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBLiBMT0lOQyB2ZXJpZmllZCBhZ2FpbnN0IGxvaW5jLm9yZ1xuICAvLyBjYW5vbmljYWwgbmFtZXMuIE1ldGhvZC1zcGVjaWZpYyBjb2RlcyAoZS5nLiBocy1DUlApIHBpY2sgdGhlXG4gIC8vIHNwZWNpZmljIExPSU5DOyBnZW5lcmFsLW1ldGhvZCBjb2RlcyBwaWNrIHRoZSBtb3N0IGNvbW1vbiBmb3JtLlxuICAvLyBJZiBcdTUwNjVcdTRGRERcdTdGNzIgcHVibGlzaGVzIGFuIGF1dGhvcml0YXRpdmUgYnJvYWRlciBDb25jZXB0TWFwIGxhdGVyLFxuICAvLyByZXBsYWNlIHRoaXMgc2VjdGlvbiBpbiBvbmUgcGFzcy5cbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIC8gSGJBMWMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDVDXCI6IFwiMTU1OC02XCIsIC8vIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENiAoR2x1LUFDKSBcdTIwMTQgRmFzdGluZyBnbHVjb3NlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTQwQ1wiOiBcIjIzNDUtN1wiLCAvLyBcdTg4NDBcdTdDRDYtXHU5OTEwXHU1RjhDL1x1OTZBOFx1NkE1RiBcdTIwMTQgR2x1Y29zZSBNYXNzL3ZvbCBTL1AgKGdlbmVyYWwpXG4gIFwiMDkwMDZDXCI6IFwiNDU0OC00XCIsIC8vIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMCAoSGJBMWMpIFx1MjAxNCBIZW1vZ2xvYmluIEExYy9IZ2IudG90YWwgQmxvb2RcbiAgLy8gXHUyNTAwXHUyNTAwIFJlbmFsIC8gZWxlY3Ryb2x5dGVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDAyQ1wiOiBcIjMwOTQtMFwiLCAvLyBCVU4gXHUyMDE0IFVyZWEgbml0cm9nZW4gTWFzcy92b2wgUy9QXG4gIFwiMDkwMTNDXCI6IFwiMzA4NC0xXCIsIC8vIFVyaWMgQWNpZCBcdTIwMTQgVXJhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMjFDXCI6IFwiMjk1MS0yXCIsIC8vIE5hIFx1MjAxNCBTb2RpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDIyQ1wiOiBcIjI4MjMtM1wiLCAvLyBLICBcdTIwMTQgUG90YXNzaXVtIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAyNENcIjogXCIyMDI4LTlcIiwgLy8gQ08yIFx1MjAxNCBDYXJib24gZGlveGlkZSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMTJDXCI6IFwiMjc3Ny0xXCIsIC8vIElub3JnYW5pYyBQIFx1MjAxNCBQaG9zcGhhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDZCXCI6IFwiMTkxMjMtOVwiLCAvLyBNZyBcdTIwMTQgTWFnbmVzaXVtIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGlwaWQgcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDFDXCI6IFwiMjA5My0zXCIsIC8vIFQtQ2hvbGVzdGVyb2wgXHUyMDE0IENob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDA0Q1wiOiBcIjI1NzEtOFwiLCAvLyBURyBcdTIwMTQgVHJpZ2x5Y2VyaWRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQzQ1wiOiBcIjIwODUtOVwiLCAvLyBIREwgXHUyMDE0IEhETCBjaG9sZXN0ZXJvbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NENcIjogXCIxMzQ1Ny03XCIsIC8vIExETCBcdTIwMTQgTERMIGNob2xlc3Rlcm9sIChjYWxjdWxhdGVkKSBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIExpdmVyIGZ1bmN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDI3Q1wiOiBcIjY3NjgtNlwiLCAvLyBBTEstUCBcdTIwMTQgQWxrYWxpbmUgcGhvc3BoYXRhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzFDXCI6IFwiMjMyNC0yXCIsIC8vIFx1MDNCMy1HVCBcdTIwMTQgR2FtbWEgZ2x1dGFteWwgdHJhbnNmZXJhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzVDXCI6IFwiMjUwMC03XCIsIC8vIFRJQkMgXHUyMDE0IElyb24gYmluZGluZyBjYXBhY2l0eSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzN0NcIjogXCIxODI3LTVcIiwgLy8gQW1tb25pYSBcdTIwMTQgUGxhc21hXG4gIFwiMDkwNjRDXCI6IFwiMzA0MC0zXCIsIC8vIExpcGFzZSBcdTIwMTQgQWN0aXZpdHkgUy9QXG4gIFwiMDkwNTlCXCI6IFwiMTQxMTgtNFwiLCAvLyBMYWN0YXRlIFx1MjAxNCBNYXNzL3ZvbCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgZXh0cmFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA4MDA0Q1wiOiBcIjQ1NDQtM1wiLCAvLyBIQ1QgXHUyMDE0IEhlbWF0b2NyaXQgdm9sdW1lIGZyYWN0aW9uIEJsb29kXG4gIFwiMDgwMDhDXCI6IFwiMTQxOTYtMFwiLCAvLyBSZXRpY3Vsb2N5dGUgXHUyMDE0IFJldGljdWxvY3l0ZXMvMTAwIFJCQ1xuICBcIjA4MDEwQ1wiOiBcIjcxMS0yXCIsIC8vIEVvc2lub3BoaWwgY291bnQgXHUyMDE0ICMvdm9sIEJsb29kXG4gIFwiMDgwMTFDXCI6IFwiMjQzMTctMFwiLCAvLyBDQkMgcGFuZWwgXHUyMDE0IEhlbWF0b2xvZ3kgcGFuZWwgQmxvb2RcbiAgXCIwODAyNkNcIjogXCI2MzAxLTZcIiwgLy8gUFQvSU5SIFx1MjAxNCBJTlIgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODAzNkNcIjogXCIxNDk3OS05XCIsIC8vIEFQVFQgXHUyMDE0IFBsYXRlbGV0IHBvb3IgcGxhc21hXG4gIFwiMDgwNzVDXCI6IFwiMjY5Mi03XCIsIC8vIE9zbW9sYWxpdHkgXHUyMDE0IFNlcnVtIG9yIFBsYXNtYVxuICBcIjA4MDc5QlwiOiBcIjMwMjQwLTZcIiwgLy8gRC1kaW1lciBcdTIwMTQgUGx0IHBvb3IgcGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTA2Q1wiOiBcIjMwMjQtN1wiLCAvLyBGcmVlIFQ0IFx1MjAxNCBUaHlyb3hpbmUgZnJlZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTExMkNcIjogXCIzMDE2LTNcIiwgLy8gVFNIIFx1MjAxNCBUaHlyb3Ryb3BpbiBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRpYWMgbWFya2VycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTA5OUNcIjogXCIxMDgzOS05XCIsIC8vIFRyb3BvbmluIEkgXHUyMDE0IFRyb3BvbmluIEkgY2FyZGlhYyBTL1BcbiAgXCIxMjE5MkNcIjogXCIzMzk1OS04XCIsIC8vIFByb2NhbGNpdG9uaW4gXHUyMDE0IFMvUFxuICBcIjEyMTkzQ1wiOiBcIjMzNzYyLTZcIiwgLy8gTlQtcHJvQk5QIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFZpdGFtaW5zIC8gY29mYWN0b3JzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTI5Q1wiOiBcIjIxMzItOVwiLCAvLyBWaXQgQjEyIFx1MjAxNCBDb2JhbGFtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzBDXCI6IFwiMjI4NC04XCIsIC8vIEZvbGF0ZSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMDkxMTNDXCI6IFwiMjE0My02XCIsIC8vIENvcnRpc29sIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjExNkNcIjogXCIyMjc2LTRcIiwgLy8gRmVycml0aW4gXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQWN1dGUgcGhhc2UgLyBpbmZsYW1tYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEyMDE1QyBpcyB0aGUgZ2VuZXJpYyBOSEkgQ1JQIG9yZGVyIFx1MjAxNCBtb3N0IGNsaW5pY2FsIGNvbnRleHRzIGluIFx1NTA2NVx1NEZERFxuICAvLyBzZW5kIGEgcmVndWxhciAobm90IGhzLSkgQ1JQLCBzbyBtYXAgdG8gMTk4OC01LiBJZiBhIFx1OTY2Mlx1NjI0MCBzcGVjaWZpY2FsbHlcbiAgLy8gYmlsbHMgaHMtQ1JQIGl0IHdpbGwgbGFuZCBvbiBhIGRpZmZlcmVudCBjb2RlIChlLmcuIDEyMTg5QykuXG4gIFwiMTIwMTVDXCI6IFwiMTk4OC01XCIsIC8vIENSUCBcdTIwMTQgQyByZWFjdGl2ZSBwcm90ZWluIE1hc3Mvdm9sIFMvUFxuICBcIjEyMDUzQ1wiOiBcIjUwNDgtNFwiLCAvLyBBTkEgXHUyMDE0IEFudGludWNsZWFyIEFiIFRpdGVyIFMvUFxuICBcIjEyMDU2QlwiOiBcIjE2MTI0LTBcIiwgLy8gQW50aS1taXRvY2hvbmRyaWFsIEFiIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwNjAxMkNcIjogXCI1Nzc4LTZcIiwgLy8gVXJpbmUgYXBwZWFyYW5jZSBcdTIwMTQgQ29sb3JcbiAgXCIwNjAxM0NcIjogXCIyNDM1Ni04XCIsIC8vIFx1NUMzRlx1NzUxRlx1NTMxNiBwYW5lbCBcdTIwMTQgVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA3MDAxQ1wiOiBcIjE0NTYzLTFcIiwgLy8gU3Rvb2wgb2NjdWx0IGJsb29kXG4gIFwiMDkxMzRDXCI6IFwiNTg0NTMtMlwiLCAvLyBpRk9CVCBxdWFudGl0YXRpdmUgXHUyMDE0IEhlbW9nbG9iaW4gTWFzcy92b2wgU3Rvb2wgYnkgSUFcbiAgXCIxMjExMUNcIjogXCIyMTYxLThcIiwgLy8gVXJpbmUgQ3JlYXRpbmluZSBcdTIwMTQgc2FtZSBMT0lOQyBhcyAwOTAxNkNcbiAgLy8gXHUyNTAwXHUyNTAwIFNlcm9sb2d5IC8gaW1tdW5vbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjAwMUNcIjogXCI1MjkyLThcIiwgLy8gUlBSIFx1MjAxNCBTZXJ1bS9QbGFzbWFcbiAgXCIxMjAyMUNcIjogXCIyMDM5LTZcIiwgLy8gQ0VBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyNUJcIjogXCIyNDY1LTNcIiwgLy8gSWdHIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyN0JcIjogXCIyNDU4LThcIiwgLy8gSWdBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAzMUNcIjogXCIxOTExMy0wXCIsIC8vIElnRSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwNjlCXCI6IFwiNTEzMi02XCIsIC8vIENyeXB0b2NvY2N1cyBBZyBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwNzlDXCI6IFwiMjQxMDgtM1wiLCAvLyBDQSAxOS05IFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEJsb29kIHR5cGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTEwMDFDXCI6IFwiODgyLTFcIiwgLy8gXHU4ODQwXHU1NzhCXHU5NDUxXHU1QjlBIFx1MjAxNCBBQk8gKyBSaCBncm91cFxuICBcIjExMDAzQ1wiOiBcIjg4Mi0xXCIsIC8vIFx1ODg0MFx1NTc4Qlx1OTQ1MVx1NUI5QSBcdTIwMTQgQUJPICsgUmggZ3JvdXBcbiAgXCIxMTAwNENcIjogXCI4OTAtNFwiLCAvLyBcdTYyOTdcdTlBRDRcdTUzQ0RcdTYxQzkgXHUyMDE0IEFudGlib2R5IHNjcmVlblxuICAvLyBcdTI1MDBcdTI1MDAgTWljcm9iaW9sb2d5IGN1bHR1cmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxMzAwN0MgXHU3RDMwXHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAxNDIxOS0wIHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdIVExWIEkgcDI2IEFiIGluIFNlcnVtJyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gVGhlXG4gIC8vIHJpZ2h0IGZhbWlseSBpcyA2NDYzLTQgLyAxMTI2OC0wIChCYWN0ZXJpYSBpZGVudGlmaWVkIGJ5IGFlcm9iZVxuICAvLyBjdWx0dXJlKSBidXQgdGhlIHNvdXJjZSByb3cgZG9lc24ndCB0ZWxsIHVzIHNwZWNpbWVuIFx1MjAxNCBsZWF2aW5nXG4gIC8vIHVubWFwcGVkIHNvIHdlIGRvbid0IGxpZS4gRmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy5cbiAgXCIxMzAxM0NcIjogXCIzMTk1Mi01XCIsIC8vIFRCIEN1bHR1cmUgXHUyMDE0IE15Y29iYWN0ZXJpdW0gdHViZXJjdWxvc2lzIGN1bHR1cmVcbiAgXCIxMzAxNkJcIjogXCI2MDAtN1wiLCAvLyBCbG9vZCBDdWx0dXJlIFx1MjAxNCBCYWN0ZXJpYSBpZGVudGlmaWVkIGluIEJsb29kXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNDAwNEJcIjogXCI3ODQ5LTNcIiwgLy8gQ01WIElnRyBcdTIwMTQgQWIgUy9QXG4gIFwiMTQwNDhCXCI6IFwiNzg1MC0xXCIsIC8vIENNViBJZ00gXHUyMDE0IEFiIFMvUFxuICBcIjE0MDY2Q1wiOiBcIjgwMzgzLTNcIiwgLy8gSW5mbHVlbnphIEEgXHUyMDE0IEFnIFJlc3BpcmF0b3J5XG4gIFwiMTQwODRDXCI6IFwiOTQ1NTgtNFwiLCAvLyBTQVJTLUNvVi0yIEFnIFx1MjAxNCBSZXNwaXJhdG9yeVxuICBcIjEyMTg0Q1wiOiBcIjg4MTU3LTNcIiwgLy8gQ01WIEROQSBxdWFudCBQQ1IgXHUyMDE0IFBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgTXljb2JhY3Rlcml1bSAvIGFjaWQtZmFzdCAoYWRkZWQgYWZ0ZXIgYXVkaXQpIFx1MjUwMFxuICBcIjEzMDI1Q1wiOiBcIjI5MjYwLTdcIiwgLy8gXHU2Mjk3XHU5MTc4XHU2MDI3XHU2RkMzXHU3RTJFXHU2MkI5XHU3MjQ3XHU2N0QzXHU4MjcyXHU2QUEyXHU2N0U1IFx1MjAxNCBNeWNvYmFjdGVyaXVtIEFGQiBzdGFpblxuICBcIjEzMDI2Q1wiOiBcIjI5NTUzLTVcIiwgLy8gXHU2Mjk3XHU5MTc4XHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBNeWNvYmFjdGVyaXVtIGN1bHR1cmUgbGlxdWlkK3NvbGlkXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgcGFuZWwgKDA5MDQxQikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEludGVudGlvbmFsbHkgTk9UIG1hcHBlZCBoZXJlIFx1MjAxNCAwOTA0MUIgaXMgYSBwYW5lbCBvcmRlciB0aGF0XG4gIC8vIHVuZm9sZHMgaW50byBtYW55IGl0ZW1zIChwSCAvIHBDTzIgLyBwTzIgLyBIQ08zIC8gVENPMiAvIFNCRSAvXG4gIC8vIEFCRSAvIFNCQyAvIFNBVCkuIE1hcHBpbmcgdGhlIHBhbmVsIGNvZGUgdG8gXCJwSFwiIHdvdWxkIG1pcy1sYWJlbFxuICAvLyBldmVyeSBub24tcEggcm93IHRoYXQgc2hhcmVzIHRoaXMgTkhJIGNvZGUuIEVhY2ggaXRlbSBpc1xuICAvLyByZXNvbHZlZCB2aWEgX0xPSU5DX01BUCBkaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgYmVsb3c7IDA5MDQxQlxuICAvLyBhbHNvIGFwcGVhcnMgaW4gX0RJU1BMQVlfRklSU1RfQ09ERVMgc28gZGlzcGxheSBhbHdheXMgd2lucy5cbiAgLy8gXHUyNTAwXHUyNTAwIEJvZHkgZmx1aWQgLyBzeW5vdmlhbCBmbHVpZCBwYW5lbCAoMTYwMDhDIHVuZm9sZHM7IHRoZVxuICAvLyBtZW1iZXIgaXRlbXMgcmVseSBvbiBkaXNwbGF5IGtleXdvcmRzIGZvciBzcGVjaW1lbi1hd2FyZVxuICAvLyBMT0lOQ3MpLiBQYXJlbnQgY29kZSBtYXBzIHRvIHN5bm92aWFsIGZsdWlkIGFuYWx5c2lzIHBhbmVsLiBcdTI1MDBcdTI1MDBcbiAgLy8gMTYwMDhDIFx1NkVEMVx1NkRCMlx1NkFBMlx1NjdFNSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMzM5MDMtNiB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnS2V0b25lcyBbUHJlc2VuY2VdIGluIFVyaW5lJyAodmVyaWZpZWQgbG9pbmMub3JnKS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgdGhlIHBhbmVsIGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGluZyBvbmx5XG4gIC8vIGFuZCB0aGUgcGVyLWl0ZW0gZGlzcGxheXMgaW4gX0xPSU5DX01BUCBjYXJyeSB0aGVpciBvd24gTE9JTkNzXG4gIC8vIHdoZXJlIGtub3duLlxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9ESVNQTEFZX0ZJUlNUX0NPREVTIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIGNvZGVzIHRoYXQgYXJlICpwYW5lbHMqIFx1MjAxNCBvbmUgYmlsbGluZyBjb2RlLCBtYW55IGl0ZW0tc3BlY2lmaWNcbi8vIGRpc3BsYXlzLiBGb3IgdGhlc2UsIGRpc3BsYXkga2V5d29yZCBNVVNUIGJlIHRyaWVkIGZpcnN0IChzbyBcIldCQ1wiXG4vLyB1bmRlciBDQkMgcGFuZWwgMDgwMTFDIGdldHMgNjY5MC0yLCBub3QgdGhlIGdlbmVyaWMgcGFuZWwgTE9JTkMpLlxuLy8gRm9yIGV2ZXJ5dGhpbmcgZWxzZSAoc2luZ2xlLXRlc3QgY29kZXMgbGlrZSAwOTAwNUMgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2LFxuLy8gMDkwNDRDIExETCwgMTQwMzBDIEhCc0FnKSwgdGhlIE5ISSBjb2RlIGlzIG1vcmUgc3BlY2lmaWMgdGhhbiBhbnlcbi8vIGRpc3BsYXkga2V5d29yZCBhbmQgd2lucyBvdXRyaWdodC5cbi8vXG4vLyBERVNJR04gUEhJTE9TT1BIWTogdGhlIGJyaWRnZSBpcyBhICpmYWl0aGZ1bCB0cmFuc3BvcnQqIGxheWVyIFx1MjAxNCBpdFxuLy8gdHJ1c3RzIHRoZSBcdTUwNjVcdTRGREQgYmlsbGluZyBjb2RlIGFzIGF1dGhvcml0YXRpdmUgZm9yIGNsaW5pY2FsIGludGVudFxuLy8gKFx1OTY2Mlx1NjI0MCBiaWxsZWQgMDkwMDVDID0gdGhleSBvcmRlcmVkIGZhc3RpbmcgZ2x1Y29zZSwgcmVnYXJkbGVzcyBvZlxuLy8gd2hldGhlciB0aGUgb3BlcmF0aW9uYWwgc3BlY2ltZW4gd2FzIGEgZmluZ2VyLXN0aWNrKS4gRGlzcGxheS1zdHJpbmdcbi8vIHJlLWludGVycHJldGF0aW9uIG9mIGNsaW5pY2FsIGNvbnRleHQgKEdsdS1BQyB2cyBGSU5HRVIgU1VHQVIgdnNcbi8vIHJhbmRvbSkgaXMgbGVmdCB0byB0aGUgU01BUlQgYXBwLCB3aGljaCBoYXMgbW9yZSBVSSBjb250ZXh0LlxuZXhwb3J0IGNvbnN0IERJU1BMQVlfRklSU1RfQ09ERVM6IFJlYWRvbmx5U2V0PHN0cmluZz4gPSBuZXcgU2V0KFtcbiAgXCIwODAxMUNcIiwgLy8gQ0JDIHBhbmVsXG4gIFwiMDgwMTNDXCIsIC8vIENCQyB3LyBhdXRvIGRpZmYgcGFuZWxcbiAgXCIwNjAxM0NcIiwgLy8gVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA5MDQxQlwiLCAvLyBBQkcgcGFuZWxcbiAgXCIxNjAwOENcIiwgLy8gU3lub3ZpYWwgLyBib2R5LWZsdWlkIHBhbmVsXG5dKTtcblxuLy8gXHUyNTAwXHUyNTAwIF9QQU5FTF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBQYW5lbC1zcGVjaWZpYyBkaXNwbGF5IFx1MjE5MiBMT0lOQyBvdmVycmlkZXMuIFRoZXNlIHJ1biBCRUZPUkUgdGhlIGdsb2JhbFxuLy8gX0xPSU5DX01BUCBzbyB0aGF0IHVyaW5lIGJpbGlydWJpbiB1bmRlciAwNjAxM0MgbWFwcyB0byA1NzcwLTMgKHVyaW5lXG4vLyBzcGVjaW1lbikgaW5zdGVhZCBvZiBiZWluZyBzaGFkb3dlZCBieSB0aGUgZ2xvYmFsICdiaWxpcnViaW4nIHRoYXRcbi8vIHdvdWxkIGltcGx5IHNlcnVtLCBhbmQgYW5hbG9nb3VzIHNwZWNpbWVuLWF3YXJlIGRpc2FtYmlndWF0aW9uIGZvclxuLy8gb3RoZXIgcGFuZWwgc3ViLWl0ZW1zLiBLZXlzIGFyZSBOSEkgcGFuZWwgY29kZXMgKG11c3QgYWxzbyBiZSBpblxuLy8gX0RJU1BMQVlfRklSU1RfQ09ERVMpOyB2YWx1ZXMgYXJlIGRpc3BsYXkta2V5d29yZCBcdTIxOTIgTE9JTkMgZGljdHMgdGhhdFxuLy8gZm9sbG93IHRoZSBzYW1lIG1hdGNoaW5nIHNlbWFudGljcyBhcyBfTE9JTkNfTUFQIChsZWFkaW5nIHdvcmRcbi8vIGJvdW5kYXJ5IGZvciBBU0NJSSwgc3Vic3RyaW5nIGZvciBDSkspLlxuZXhwb3J0IGNvbnN0IFBBTkVMX0xPSU5DX01BUDogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBBbGwgcm91dGluZSBkaXBzdGljayBpdGVtcyByZXNpZGUgb24gYSBzaW5nbGUgTkhJIGJpbGxpbmcgY29kZS5cbiAgLy8gV2l0aG91dCB0aGlzIHRhYmxlIHRoZXknZCBhbGwgY29sbGFwc2UgdG8gdGhlIHBhbmVsIExPSU5DIDI0MzU2LTgsXG4gIC8vIGxvc2luZyBwZXItaXRlbSBncmFudWxhcml0eSB0aGF0J3MgY2xpbmljYWxseSB1c2VmdWwgKGUuZy5cbiAgLy8gYmlsaXJ1YmluIHZzIHVyb2JpbGlub2dlbiBmb3IgbGl2ZXIgd29ya3VwKS5cbiAgXCIwNjAxM0NcIjoge1xuICAgIC8vIE9yZGVyIG1hdHRlcnM6IGxvbmdlci9tb3JlLXNwZWNpZmljIGtleXMgYmVmb3JlIGdlbmVyaWMgb25lc1xuICAgIC8vIChtYXRjaGVzIF9MT0lOQ19NQVAgaXRlcmF0aW9uIHNlbWFudGljcyBcdTIwMTQgZmlyc3QgaGl0IHdpbnMpLlxuICAgIFwic3BlY2lmaWMgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLCAvLyBTcGVjaWZpYyBncmF2aXR5IFVyaW5lXG4gICAgXCJzcC5ncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXCJzcCBncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXHU2QkQ0XHU5MUNEOiBcIjU4MTEtNVwiLFxuICAgIFwibWljcm8tYWxidW1pblwiOiBcIjE0OTU3LTVcIiwgLy8gTWljcm9hbGJ1bWluIE1hc3Mvdm9sIFVyaW5lXG4gICAgbWljcm9hbGJ1bWluOiBcIjE0OTU3LTVcIixcbiAgICBcIm1hbGIodSlcIjogXCIxNDk1Ny01XCIsXG4gICAgbWFsYjogXCIxNDk1Ny01XCIsXG4gICAgXHU1RkFFXHU1QzBGXHU3NjdEXHU4NkNCXHU3NjdEOiBcIjE0OTU3LTVcIixcbiAgICB1YWNyOiBcIjE0OTU5LTFcIiwgLy8gTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgcmF0aW8gVXJpbmVcbiAgICBcInVyaW5lIGdsdWNvc2VcIjogXCI1NzkyLTdcIixcbiAgICBzdWdhcjogXCI1NzkyLTdcIiwgLy8gTkhJICdcdTVDM0ZcdTdDRDYnIC8gJ1N1Z2FyJyB1bmRlciAwNjAxM0NcbiAgICBcdTVDM0ZcdTdDRDY6IFwiNTc5Mi03XCIsXG4gICAgdXJvYmlsaW5vZ2VuOiBcIjU4MTgtMFwiLCAvLyBVcm9iaWxpbm9nZW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMjBcdTUzOUY6IFwiNTgxOC0wXCIsXG4gICAgYmlsaXJ1YmluOiBcIjU3NzAtM1wiLCAvLyBCaWxpcnViaW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMDVcdTdEMjA6IFwiNTc3MC0zXCIsXG4gICAgbml0cml0ZTogXCI1ODAyLTRcIiwgLy8gTml0cml0ZSBVcmluZVxuICAgIFx1NEU5RVx1Nzg1RFx1OTE3ODogXCI1ODAyLTRcIixcbiAgICBrZXRvbmVzOiBcIjU3OTctNlwiLCAvLyBLZXRvbmVzIFVyaW5lXG4gICAga2V0b25lOiBcIjU3OTctNlwiLFxuICAgIFx1OTE2RVx1OUFENDogXCI1Nzk3LTZcIixcbiAgICBwcm90ZWluOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICAgIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgICBsZXVrb2N5dGU6IFwiNTc5OS0yXCIsIC8vIExldWtvY3l0ZXMgVXJpbmVcbiAgICBsZXU6IFwiNTc5OS0yXCIsXG4gICAgXHU3NjdEXHU4ODQwXHU3NDAzXHU5MTZGXHU5MTc2OiBcIjU3OTktMlwiLFxuICAgIGJsb29kOiBcIjU3OTQtM1wiLCAvLyBIZW1vZ2xvYmluIFVyaW5lIFFsXG4gICAgXHU2RjVCXHU4ODQwOiBcIjU3OTQtM1wiLFxuICAgIFx1ODI3MjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgVXJpbmUgKENKSyBzdWJzdHJpbmcpXG4gICAgY29sb3I6IFwiNTc3OC02XCIsXG4gICAgdHVyYmlkaXR5OiBcIjU3NjctOVwiLCAvLyBBcHBlYXJhbmNlIG9mIFVyaW5lXG4gICAgYXBwZWFyYW5jZTogXCI1NzY3LTlcIixcbiAgICBcdTU5MTZcdTg5QzA6IFwiNTc2Ny05XCIsXG4gICAgcGg6IFwiNTgwMy0yXCIsIC8vIHBIIG9mIFVyaW5lICh1cmluZS1zcGVjaWZpYywgTk9UXG4gICAgLy8gdGhlIGFydGVyaWFsIDExNTU4LTQgdGhhdCB0aGVcbiAgICAvLyBnbG9iYWwgbWFwIHBvaW50cyB0bylcbiAgICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiNTgwMy0yXCIsXG4gICAgZ2x1Y29zZTogXCI1NzkyLTdcIiwgLy8gTGFzdCBpbiB0aGlzIGJsb2NrIHNvICd1cmluZVxuICB9LFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDb21tb24gVGFpd2FuZXNlIEhJUyBsYWIgbmFtZXMgXHUyMTkyIExPSU5DIGNvZGUgbWFwcGluZ1xuZXhwb3J0IGNvbnN0IExPSU5DX01BUDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIERpc3BsYXkta2V5d29yZCBmYWxsYmFjayBvbmx5IGtpY2tzIGluIHdoZW4gTk8gTkhJIGNvZGUgaXNcbiAgLy8gcHJlc2VudCAoZGFzaGJvYXJkIHJvd3MsIExMTS1leHRyYWN0ZWQgdGV4dCkuIFdoZW4gdGhlIE5ISSBjb2RlXG4gIC8vIElTIHByZXNlbnQsIDA5MDA1QyBcdTIxOTIgMTU1OC02IChGYXN0aW5nKSBhbmQgMDkxNDBDIFx1MjE5MiAyMzQ1LTdcbiAgLy8gKGdlbmVyaWMpIHdpbnMgZGlyZWN0bHkgdmlhIF9OSElfVE9fTE9JTkMuXG4gIC8vXG4gIC8vIEZhaXRoZnVsLXRyYW5zcG9ydCBwcmluY2lwbGU6IHRoZSBicmlkZ2UgZG9lcyBOT1QgcmUtaW50ZXJwcmV0XG4gIC8vIGRpc3BsYXkgc3RyaW5ncyBsaWtlIFwiRklOR0VSIFNVR0FSXCIgYXMgYSBkaWZmZXJlbnQgTE9JTkMgXHUyMDE0IGl0XG4gIC8vIHByZXNlcnZlcyB0aGUgcmF3IGRpc3BsYXkgaW4gYGNvZGUudGV4dGAgYW5kIHRoZSBvcmlnaW5hbCBOSElcbiAgLy8gY29kZSBpbiBgY29kZS5jb2RpbmdgLiBUaGUgU01BUlQgYXBwIGRvZXMgc3BlY2ltZW4vbWV0aG9kLWF3YXJlXG4gIC8vIGdyb3VwaW5nIG9uIHRoZSBjb25zdW1lciBzaWRlIChzZWUgU01BUlQgYXBwIGhhbmRvZmYgZG9jKS5cbiAgXCJmYXN0aW5nIGdsdWNvc2VcIjogXCIxNTU4LTZcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIjE1NTgtNlwiLFxuICBcImdsdS1hY1wiOiBcIjE1NTgtNlwiLFxuICBcImdsdWNvc2UgYWNcIjogXCIxNTU4LTZcIixcbiAgZ2x1Y29zZTogXCIyMzQ1LTdcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIjIzNDUtN1wiLFxuICBnbHU6IFwiMjM0NS03XCIsXG4gIC8vIEhiQTFjIE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljIFwiaGJcIiBlbnRyaWVzIHNvIHRoZSBsb25nZXN0LXByZWZpeFxuICAvLyBtYXRjaCB3aW5zIGZvciB0aGUgXCJIYkExY1wiIGRpc3BsYXkgc3RyaW5nLiBPdGhlciBBMWMgc3lub255bXNcdTIwMjZcbiAgaGJhMWM6IFwiNDU0OC00XCIsXG4gIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCI0NTQ4LTRcIixcbiAgYTFjOiBcIjQ1NDgtNFwiLFxuICBoZW1vZ2xvYmluOiBcIjcxOC03XCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCI3MTgtN1wiLFxuICBoZ2I6IFwiNzE4LTdcIixcbiAgaGI6IFwiNzE4LTdcIixcbiAgLy8gQ0JDIGRpZmYgXHUyMDE0IGVvc2lub3BoaWwgY291bnQgbXVzdCBwcmVjZWRlIHRoZSBiYXJlICd3YmMnLydcdTc2N0RcdTg4NDBcdTc0MDMnXG4gIC8vIGtleXMgKHdoaWNoIHdvdWxkIG90aGVyd2lzZSB3aW4gYXMgc3Vic3RyaW5ncykuXG4gIC8vIDcxMS0yIHZlcmlmaWVkIGF0IGxvaW5jLm9yZzogJ0Vvc2lub3BoaWxzIFsjL3ZvbHVtZV0gaW4gQmxvb2RcbiAgLy8gYnkgQXV0b21hdGVkIGNvdW50Jy5cbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIjcxMS0yXCIsXG4gIFx1NTVEQ1x1NEYwQVx1N0QwNVx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsOiBcIjcxMS0yXCIsXG4gIGVvc2lub3BoaWxzOiBcIjcxMS0yXCIsXG4gIHdiYzogXCI2NjkwLTJcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIjY2OTAtMlwiLFxuICBwbGF0ZWxldDogXCI3NzctM1wiLFxuICBcdTg4NDBcdTVDMEZcdTY3N0Y6IFwiNzc3LTNcIixcbiAgcGx0OiBcIjc3Ny0zXCIsXG4gIC8vIFJCQyArIFJCQyBpbmRpY2VzIFx1MjAxNCB2ZXJpZmllZCBMT0lOQ3MgKGxvaW5jLm9yZyk6XG4gIC8vIDc4OS04ICBFcnl0aHJvY3l0ZXMgIy92b2wgQmxvb2QgQXV0byAgICAgICAgICAgICAgXHUyMTkyIFJCQ1xuICAvLyA3ODUtNiAgRXJ5dGhyb2N5dGUgbWVhbiBjb3JwdXNjdWxhciBoZW1vZ2xvYmluICAgIFx1MjE5MiBNQ0hcbiAgLy8gTG9uZyBDSksgZm9ybXMgZmlyc3QgKExETC9jaG9sZXN0ZXJvbCBwYXR0ZXJuKSBzbyAnXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXG4gIC8vIFx1ODg0MFx1ODI3Mlx1N0QyMCcgd2lucyBvdmVyIFx1N0QwNVx1ODg0MFx1NzQwMy5cbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIjc4NS02XCIsXG4gIHJiYzogXCI3ODktOFwiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDM6IFwiNzg5LThcIixcbiAgbWNoOiBcIjc4NS02XCIsXG4gIC8vIFVyaW5lIGNyZWF0aW5pbmUgXHUyMDE0IE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljICdjcmVhdGluaW5lJyBzb1xuICAvLyByb3dzIGxpa2UgJ1UtQ1JFIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MCcgb3IgJ0NyZWF0aW5pbmUoVSknIHJlc29sdmUgdG8gdGhlXG4gIC8vIHVyaW5lIExPSU5DICgyMTYxLTgpIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIHNlcnVtXG4gIC8vIGRlZmF1bHQgKDIxNjAtMCkuIFNhbWUgbG9uZ2VzdC1zcGVjaWZpYy1maXJzdCBvcmRlcmluZyBhc1xuICAvLyB0aGUgZmFzdGluZy12cy1yYW5kb20gZ2x1Y29zZSBibG9jay5cbiAgXCJ1cmluZSBjcmVhdGluaW5lXCI6IFwiMjE2MS04XCIsXG4gIFwiY3JlYXRpbmluZSB1cmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUodSlcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZVwiOiBcIjIxNjEtOFwiLFxuICBcInUtY3JlYVwiOiBcIjIxNjEtOFwiLFxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MS04XCIsXG4gIGNyZWF0aW5pbmU6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE3OFx1OTE1MDogXCIyMTYwLTBcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIjIxNjAtMFwiLCAvLyBUYWl3YW4gdmFyaWFudCBzcGVsbGluZ1xuICBjcmVhOiBcIjIxNjAtMFwiLFxuICBidW46IFwiMzA5NC0wXCIsXG4gIFx1NUMzRlx1N0QyMFx1NkMyRTogXCIzMDk0LTBcIixcbiAgYXN0OiBcIjE5MjAtOFwiLFxuICBhbHQ6IFwiMTc0Mi02XCIsXG4gIGZlcnJpdGluOiBcIjIyNzYtNFwiLFxuICBcdTg4NDBcdTZFMDVcdTk0MzVcdTg2Q0JcdTc2N0Q6IFwiMjI3Ni00XCIsXG4gIGZlcnI6IFwiMjI3Ni00XCIsXG4gIC8vIFZpdGFsLXNpZ25zIGZyb20gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1IChJSEtFMzQwMikgXHUyMDE0IHNlcGFyYXRlIGNvZGUgbmFtZXNwYWNlXG4gIC8vIGJ1dCB0aGUgbG9va3VwIGlzIGJ5IGRpc3BsYXktbmFtZSBzdWJzdHJpbmcsIHNhbWUgYXMgZm9yIGxhYnMuXG4gIFwiYm9keSBoZWlnaHRcIjogXCI4MzAyLTJcIixcbiAgXCJib2R5IHdlaWdodFwiOiBcIjI5NDYzLTdcIixcbiAgYm1pOiBcIjM5MTU2LTVcIixcbiAgLy8gV2Fpc3QgY2lyY3VtZmVyZW5jZSBcdTIwMTQgbWVhc3VyZW1lbnQgTE9JTkMgKDgyODAtMCkuIDU2MDg2LTIgaXNcbiAgLy8gdGhlICdBZHVsdCBXYWlzdCBDaXJjdW1mZXJlbmNlIFByb3RvY29sJyBjb2RlLCB3aGljaCBpcyBhXG4gIC8vIHN1cnZleS9wcm90b2NvbCBkZXNjcmlwdG9yLCBOT1QgYSBudW1lcmljIG1lYXN1cmVtZW50XG4gIC8vICh2ZXJpZmllZCBhdCBsb2luYy5vcmcpLiBOSEkgXHU1MDY1XHU0RkREIHJlcG9ydHMgYSBzaW5nbGUgd2Fpc3RsaW5lXG4gIC8vIG51bWJlciBwZXIgdmlzaXQsIHNvIHRoZSBtZWFzdXJlbWVudCBjb2RlIGlzIGNvcnJlY3QuXG4gIFwid2Fpc3QgY2lyY3VtZmVyZW5jZVwiOiBcIjgyODAtMFwiLFxuICBcInN5c3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ4MC02XCIsXG4gIFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ2Mi00XCIsXG4gIC8vIExpcGlkIHBhbmVsIFx1MjAxNCBPUkRFUiBNQVRURVJTLiBMREwvSERMIHZhcmlhbnRzIE1VU1QgcHJlY2VkZSB0aGVcbiAgLy8gZ2VuZXJpYyAnY2hvbGVzdGVyb2wnIGtleSBzbyBhIHJvdyBsYWJlbGxlZCAnTERMIENIT0xFU1RFUk9MJ1xuICAvLyByZXNvbHZlcyB0byAxMzQ1Ny03IChMREwgY2FsY3VsYXRlZCkgYW5kICdIREwgQ0hPTEVTVEVST0wnIHRvXG4gIC8vIDIwODUtOSwgaW5zdGVhZCBvZiBmYWxsaW5nIHRvIDIwOTMtMyAodG90YWwgY2hvbGVzdGVyb2wpIHZpYSB0aGVcbiAgLy8gJ2Nob2xlc3Rlcm9sJyBzdWJzdHJpbmcuIFNhbWUgY2Fub25pY2FsIG9yZGVyaW5nIGFzIF9MQUJfU1lOT05ZTVMuXG4gIFwibGRsIGNob2xlc3Rlcm9sXCI6IFwiMTM0NTctN1wiLFxuICBcImxkbC1jaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgLy8gMTM0NTctNyA9IExETCBjaG9sZXN0ZXJvbCAoY2FsY3VsYXRlZCkgXHUyMDE0IG1hdGNoZXMgdGhlIE5ISSAwOTA0NENcbiAgLy8gYmlsbGluZyBjb2RlJ3MgaW50ZW50IChUYWl3YW4gbGFicyBwcmVkb21pbmFudGx5IHJlcG9ydCBjYWxjdWxhdGVkXG4gIC8vIExETCB2aWEgRnJpZWRld2FsZCkuIEtlZXAgY29uc2lzdGVudCB3aXRoIF9OSElfVE9fTE9JTkNbXCIwOTA0NENcIl0uXG4gIFwibGRsLWNcIjogXCIxMzQ1Ny03XCIsXG4gIGxkbDogXCIxMzQ1Ny03XCIsXG4gIFwiaGRsIGNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFwiaGRsLWNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwODUtOVwiLFxuICBcImhkbC1jXCI6IFwiMjA4NS05XCIsXG4gIGhkbDogXCIyMDg1LTlcIixcbiAgLy8gVG90YWwgY2hvbGVzdGVyb2wgXHUyMDE0IGJhcmUgJ2Nob2xlc3Rlcm9sJyBvbmx5IGZpcmVzIEFGVEVSIHRoZVxuICAvLyBMREwvSERMLXByZWZpeGVkIHZhcmlhbnRzIGFib3ZlIGhhdmUgYmVlbiBjaGVja2VkLlxuICBcInRvdGFsIGNob2xlc3Rlcm9sXCI6IFwiMjA5My0zXCIsXG4gIFwidC1jaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIFx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDkzLTNcIixcbiAgY2hvbGVzdGVyb2w6IFwiMjA5My0zXCIsXG4gIHRyaWdseWNlcmlkZTogXCIyNTcxLThcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIjI1NzEtOFwiLFxuICBcInVyaWMgYWNpZFwiOiBcIjMwODQtMVwiLFxuICBlZ2ZyOiBcIjMzOTE0LTNcIixcbiAgaGJzYWc6IFwiNTE5Ni0xXCIsXG4gIFwiYW50aS1oY3ZcIjogXCIxNjEyOC0xXCIsXG4gIC8vIFVyaW5lIHByb3RlaW4gKGRpc3BsYXkgZmFsbGJhY2sgZm9yIHRoZSBuby1OSEktY29kZSBwYXRoIHRoYXRcbiAgLy8gY29tZXMgZnJvbSBJSEtFMzQwMiB2aXRhbHMgKyBhZHVsdC1wcmV2ZW50aXZlIHN1cHBsZW1lbnRzKS5cbiAgXCJ1cmluZSBwcm90ZWluXCI6IFwiMjA0NTQtNVwiLCAvLyBQcm90ZWluIE1hc3Mvdm9sIFVyaW5lXG4gIFwidS1wcm9cIjogXCIyMDQ1NC01XCIsXG4gIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gIC8vIEFCRyBwYW5lbCBjb21wb25lbnRzIFx1MjAxNCAwOTA0MUIgcGFyZW50IGNvZGUgaW4gTkhJX1RPX0xPSU5DOyBlYWNoXG4gIC8vIG1lbWJlcidzIGRpc3BsYXkgKFwicENPMlwiLCBcInBPMlwiLCBcIkhDTzNcIiwgXCJUQ08yXCIsIFwiU0JFL0FCRVwiLFxuICAvLyBcIlNCQ1wiLCBcIlNBVFwiIC8gXCJTYU8yXCIpIGZhbGxzIHRvIGl0cyBvd24gTE9JTkMuXG4gIC8vIHBIIE1VU1QgY29tZSBiZWZvcmUgcGNvMi9wbzIgc28gdGhlIGJhcmUgXCJwSFwiIGRpc3BsYXkgbGFuZHMgaGVyZS5cbiAgcGg6IFwiMTE1NTgtNFwiLCAvLyBwSCBvZiBBcnRlcmlhbCBibG9vZFxuICBwY28yOiBcIjIwMTktOFwiLCAvLyBDYXJib24gZGlveGlkZSBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBwbzI6IFwiMjcwMy03XCIsIC8vIE94eWdlbiBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBoY28zOiBcIjE5NTktNlwiLCAvLyBCaWNhcmJvbmF0ZSBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgYmljYXJib25hdGU6IFwiMTk1OS02XCIsXG4gIHRjbzI6IFwiMjAyOC05XCIsIC8vIFRvdGFsIENPMiBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgc2JlOiBcIjExNTU1LTBcIiwgLy8gU3RhbmRhcmQgYmFzZSBleGNlc3MgQXJ0ZXJpYWxcbiAgYWJlOiBcIjExNTU1LTBcIixcbiAgc2JjOiBcIjE5MjUtN1wiLCAvLyBTdGFuZGFyZCBiaWNhcmJvbmF0ZSBBcnRlcmlhbFxuICBzYXR1cmF0OiBcIjI3MTMtNlwiLCAvLyBPMiBzYXR1cmF0aW9uIEFydGVyaWFsXG4gIHNhbzI6IFwiMjcxMy02XCIsXG4gIHNhdDogXCIyNzEzLTZcIiwgLy8gTkhJIGRpc3BsYXkgc2hvd3MganVzdCBcIlNBVFwiXG4gIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBjb21wb25lbnRzICgxNjAwOEMgcGFyZW50IGFib3ZlKS5cbiAgXCJzZi5jb2xvclwiOiBcIjU3NzgtNlwiLCAvLyBDb2xvciBvZiBCb2R5IGZsdWlkIChyZXVzZSBVcmluZSBjb2xvciBzcGVjIE9LKVxuICAvLyBOT1RFOiA4MjU1LTIgLyAxMzk0OC01IHByZXZpb3VzbHkgbGlzdGVkIGhlcmUgYm90aCB0dXJuZWQgb3V0XG4gIC8vIHRvIGJlIHVucmVsYXRlZCBMT0lOQ3MgKHZlcmlmaWVkIGxvaW5jLm9yZyBcdTIwMTQgODI1NS0yIGlzXG4gIC8vICdTZXJ2aWNlIGNvbW1lbnQgMTMnLCAxMzk0OC01IGlzICdDb2NjaWRpb2lkZXMgaW1taXRpcyBJZ01cbiAgLy8gQWInKS4gQm9keS1mbHVpZCBBcHBlYXJhbmNlIC8gUkJDIGRvbid0IGhhdmUgd2VsbC1hdHRlc3RlZFxuICAvLyBMT0lOQ3MgaW4gb3VyIHRhYmxlIHlldCBcdTIwMTQgZmFsbGluZyB0aHJvdWdoIHRvIGNvZGUudGV4dC1vbmx5XG4gIC8vIGlzIHNhZmVyIHRoYW4gZW1pdHRpbmcgYSBtaXNsZWFkaW5nIExPSU5DLiBUbyBhZGQgbGF0ZXIsXG4gIC8vIHZlcmlmeSBlYWNoIGFnYWluc3QgbG9pbmMub3JnIGZpcnN0LlxuICBcInNmLndiY1wiOiBcIjI2NDY2LTNcIiwgLy8gV0JDICMvdm9sIEJvZHkgZmx1aWRcbiAgXCJzZi5uZXV0cm9waGlsXCI6IFwiMTAzMjgtNlwiLCAvLyBOZXV0cm9waGlscy8xMDAgbGV1a29jeXRlcyBpbiBCb2R5IGZsdWlkXG4gIFwic2YubHltcGhvXCI6IFwiMTMwNDYtOFwiLCAvLyBMeW1waG9jeXRlcyAjL3ZvbCBCb2R5IGZsdWlkXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0xPSU5DX0RJU1BMQVkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDYW5vbmljYWwgRW5nbGlzaCBkaXNwbGF5IG5hbWVzIGZvciBMT0lOQyBjb2RlcyB0aGUgYnJpZGdlIGVtaXRzLlxuLy8gRmFsbHMgYmFjayB0byB0aGUgcmF3IGlucHV0IGRpc3BsYXkgd2hlbiBhIExPSU5DIGlzbid0IGxpc3RlZCBoZXJlLlxuLy8gU291cmNlZCBmcm9tIGxvaW5jLm9yZyBjYW5vbmljYWwgc2hvcnQgbmFtZXMgd2hlcmUgYXBwbGljYWJsZS5cbi8vIEFkZCBuZXcgZW50cmllcyBhcyB3ZSB3aWRlbiBMT0lOQyBjb3ZlcmFnZSBcdTIwMTQgdGhlIGxvb2t1cCBpcyBrZXllZCBvblxuLy8gTE9JTkMgc3RyaW5nLCBzbyB1bm1hcHBlZCBMT0lOQ3MgZGVncmFkZSBncmFjZWZ1bGx5IHRvIHRoZSBOSEkgdGV4dC5cbmV4cG9ydCBjb25zdCBMT0lOQ19ESVNQTEFZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE1vc3QgY3JpdGljYWwgYmxvY2sgXHUyMDE0IE5ISSdzIFwiQ29sb3IgXHU1QzNGIFx1OTg0RiAgLi4uXCIgc3R5bGUgbGFiZWxzIGFyZVxuICAvLyB3aGF0IHRyaWdnZXJzIGRvd25zdHJlYW0gQ2hpbmVzZS1zdWJzdHJpbmcgbGFiZWxsaW5nIGJ1Z3MuXG4gIFwiNTgwMy0yXCI6IFwicEggb2YgVXJpbmVcIixcbiAgXCI1ODExLTVcIjogXCJTcGVjaWZpYyBncmF2aXR5IG9mIFVyaW5lXCIsXG4gIFwiNTc3MC0zXCI6IFwiQmlsaXJ1YmluIFVyaW5lIFFsXCIsXG4gIFwiNTgwMi00XCI6IFwiTml0cml0ZSBVcmluZSBRbFwiLFxuICBcIjU3NzgtNlwiOiBcIkNvbG9yIG9mIFVyaW5lXCIsXG4gIFwiNTc2Ny05XCI6IFwiQXBwZWFyYW5jZSBvZiBVcmluZVwiLFxuICBcIjU4MTgtMFwiOiBcIlVyb2JpbGlub2dlbiBVcmluZSBRbFwiLFxuICBcIjIwNDU0LTVcIjogXCJQcm90ZWluIE1hc3MvVm9sIGluIFVyaW5lXCIsXG4gIFwiMTQ5NTctNVwiOiBcIk1pY3JvYWxidW1pbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU5LTFcIjogXCJNaWNyb2FsYnVtaW4vQ3JlYXRpbmluZSBSYXRpbyBpbiBVcmluZVwiLFxuICBcIjU3OTItN1wiOiBcIkdsdWNvc2UgVXJpbmUgUWxcIixcbiAgXCI1Nzk3LTZcIjogXCJLZXRvbmVzIFVyaW5lIFFsXCIsXG4gIFwiNTc5NC0zXCI6IFwiSGVtb2dsb2JpbiBVcmluZSBRbFwiLFxuICBcIjU3OTktMlwiOiBcIkxldWtvY3l0ZXMgVXJpbmUgUWxcIixcbiAgXCIyNDM1Ni04XCI6IFwiVXJpbmFseXNpcyBNYWNybyBQYW5lbFwiLFxuICAvLyBBTEwgZW50cmllcyBiZWxvdyB1c2UgdGhlIExPSU5DIGNhbm9uaWNhbCAnTG9uZyBDb21tb24gTmFtZSdcbiAgLy8gYXMgYWNjZXB0ZWQgYnkgdGhlIFRXTkhJRkhJUiB2YWxpZGF0b3IuIFNvdXJjZTogbG9pbmMub3JnIGZvclxuICAvLyBlYWNoIGNvZGUsIGNyb3NzLWNoZWNrZWQgYWdhaW5zdCB0aGUgdmFsaWRhdG9yJ3MgcmVwb3J0ZWRcbiAgLy8gJ1ZhbGlkIGRpc3BsYXkgaXMgb25lIG9mIE4gY2hvaWNlcycgZm9yIGRpc3BsYXlzIHdlIHByZXZpb3VzbHlcbiAgLy8gZ290IHdyb25nICg0NSBMT0lOQ3MgZm91bmQgaW4gdGhlIFAzMzMzMzMzMzMgdmFsaWRhdGlvbiBydW4pLlxuICAvLyBXaGVuIHVwZGF0aW5nLCBjb3B5IHRoZSBleGFjdCBlbi1VUyBsb25nIG5hbWUgZnJvbSBsb2luYy5vcmcgXHUyMDE0XG4gIC8vIHRoZSB2YWxpZGF0b3IgaXMgc2Vuc2l0aXZlIHRvIHNwZWxsaW5nIC8gcHVuY3R1YXRpb24uXG4gIC8vXG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MgcGFuZWwgc3ViLWl0ZW1zKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gXHUyNTAwXHUyNTAwIEFCRyAoMDkwNDFCIHBhbmVsKSBcdTIwMTQgbm90IGluIHZhbGlkYXRvciBvdXRwdXQ7IGxvaW5jLm9yZyBzb3VyY2VkXG4gIFwiMTE1NTgtNFwiOiBcInBIIG9mIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAxOS04XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW1BhcnRpYWwgcHJlc3N1cmVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjcwMy03XCI6IFwiT3h5Z2VuIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjE5NTktNlwiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAyOC05XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTE1NTUtMFwiOiBcIkJhc2UgZXhjZXNzIGluIEFydGVyaWFsIGJsb29kIGJ5IGNhbGN1bGF0aW9uXCIsXG4gIFwiMTkyNS03XCI6IFwiQmljYXJib25hdGUgW01vbGVzL3ZvbHVtZV0gaW4gQXJ0ZXJpYWwgYmxvb2QgLS1zdGFuZGFyZFwiLFxuICBcIjI3MTMtNlwiOiBcIk94eWdlbiBzYXR1cmF0aW9uIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE1NTgtNlwiOiBcIkZhc3RpbmcgZ2x1Y29zZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIzNDUtN1wiOiBcIkdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNzE4LTdcIjogXCJIZW1vZ2xvYmluIFtNYXNzL3ZvbHVtZV0gaW4gQmxvb2RcIixcbiAgXCI0NTQ4LTRcIjogXCJIZW1vZ2xvYmluIEExYy9IZW1vZ2xvYmluLnRvdGFsIGluIEJsb29kXCIsXG4gIFwiNjY5MC0yXCI6IFwiTGV1a29jeXRlcyBbLCAgLy8gL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzc3LTNcIjogXCJQbGF0ZWxldHMgWywgIC8vIC92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc4OS04XCI6IFwiRXJ5dGhyb2N5dGVzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3ODUtNlwiOiBcIk1DSCBbRW50aXRpYyBtYXNzXSBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3MTEtMlwiOiBcIkVvc2lub3BoaWxzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI0NTQ0LTNcIjogXCJIZW1hdG9jcml0IFtWb2x1bWUgRnJhY3Rpb25dIG9mIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjU3MDIxLThcIjogXCJDQkMgVyBBdXRvIERpZmZlcmVudGlhbCBwYW5lbCAtIEJsb29kXCIsXG4gIFwiMjQzMTctMFwiOiBcIkhlbW9ncmFtIGFuZCBwbGF0ZWxldHMgV08gZGlmZmVyZW50aWFsIHBhbmVsIC0gQmxvb2RcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENoZW1pc3RyeSAvIGxpdmVyIC8gcmVuYWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTkyMC04XCI6IFwiQXNwYXJ0YXRlIGFtaW5vdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3NDItNlwiOiBcIkFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjE2MC0wXCI6IFwiQ3JlYXRpbmluZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIxNjEtOFwiOiBcIkNyZWF0aW5pbmUgW01hc3Mvdm9sdW1lXSBpbiBVcmluZVwiLFxuICBcIjMzOTE0LTNcIjpcbiAgICBcIkdsb21lcnVsYXIgZmlsdHJhdGlvbiByYXRlIFtWb2x1bWUgUmF0ZS9BcmVhXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgQ3JlYXRpbmluZS1iYXNlZCBmb3JtdWxhIChNRFJEKS8xLjczIHNxIE1cIixcbiAgXCIzMDk0LTBcIjogXCJVcmVhIG5pdHJvZ2VuIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzA4NC0xXCI6IFwiVXJhdGUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyOTUxLTJcIjogXCJTb2RpdW0gW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjgyMy0zXCI6IFwiUG90YXNzaXVtIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5NzUtMlwiOiBcIkJpbGlydWJpbi50b3RhbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5NjgtN1wiOiBcIkJpbGlydWJpbi5kaXJlY3QgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzUxLTdcIjogXCJBbGJ1bWluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjUzMi0wXCI6IFwiTGFjdGF0ZSBkZWh5ZHJvZ2VuYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCI2NzY4LTZcIjogXCJBbGthbGluZSBwaG9zcGhhdGFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjMyNC0yXCI6IFwiR2FtbWEgZ2x1dGFteWwgdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3ODYxLTZcIjogXCJDYWxjaXVtIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXBpZCBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIyMDkzLTNcIjogXCJDaG9sZXN0ZXJvbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI1NzEtOFwiOiBcIlRyaWdseWNlcmlkZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIwODUtOVwiOiBcIkNob2xlc3Rlcm9sIGluIEhETCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjEzNDU3LTdcIjogXCJDaG9sZXN0ZXJvbCBpbiBMREwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgY2FsY3VsYXRpb25cIixcbiAgLy8gXHUyNTAwXHUyNTAwIFRoeXJvaWQgLyBob3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIzMDE2LTNcIjogXCJUaHlyb3Ryb3BpbiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMDI0LTdcIjogXCJUaHlyb3hpbmUgKFQ0KSBmcmVlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjk4Ni04XCI6IFwiVGVzdG9zdGVyb25lIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiODMwOTgtNFwiOiBcIkZvbGxpdHJvcGluIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICBcIjgzMDk2LThcIjogXCJFc3RyYWRpb2wgKEUyKSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZGlhYyAvIGluZmxhbW1hdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMDgzOS05XCI6IFwiVHJvcG9uaW4gSS5jYXJkaWFjIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzM3NjItNlwiOiBcIk5hdHJpdXJldGljIHBlcHRpZGUuQiBwcm9ob3Jtb25lIE4tVGVybWluYWwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTg4LTVcIjogXCJDIHJlYWN0aXZlIHByb3RlaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMzk1OS04XCI6IFwiUHJvY2FsY2l0b25pbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgSGVwYXRpdGlzIC8gc2Vyb2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNTE5NS0zXCI6IFwiSGVwYXRpdGlzIEIgdmlydXMgc3VyZmFjZSBBZyBbUHJlc2VuY2VdIGluIFNlcnVtXCIsXG4gIFwiNTE5Ni0xXCI6IFwiSGVwYXRpdGlzIEIgdmlydXMgc3VyZmFjZSBBZyBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bVwiLFxuICBcIjE2MTI4LTFcIjogXCJIZXBhdGl0aXMgQyB2aXJ1cyBBYiBbUHJlc2VuY2VdIGluIFNlcnVtXCIsXG4gIFwiMTM5NTUtMFwiOiBcIkhlcGF0aXRpcyBDIHZpcnVzIEFiIFtQcmVzZW5jZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDb2FndWxhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI2MzAxLTZcIjogXCJJTlIgaW4gUGxhdGVsZXQgcG9vciBwbGFzbWEgYnkgQ29hZ3VsYXRpb24gYXNzYXlcIixcbiAgXCIxNDk3OS05XCI6IFwiYVBUVCBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYSBieSBDb2FndWxhdGlvbiBhc3NheVwiLFxuICBcIjMwMjQwLTZcIjogXCJGaWJyaW4gRC1kaW1lciBbTWFzcy92b2x1bWVdIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXRhbCBzaWducyAoSUhLRTM0MDIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjgzMDItMlwiOiBcIkJvZHkgaGVpZ2h0XCIsXG4gIFwiMjk0NjMtN1wiOiBcIkJvZHkgd2VpZ2h0XCIsXG4gIFwiMzkxNTYtNVwiOiBcIkJvZHkgbWFzcyBpbmRleCAoQk1JKSBbUmF0aW9dXCIsXG4gIFwiODI4MC0wXCI6IFwiV2Fpc3QgQ2lyY3VtZmVyZW5jZSBhdCB1bWJpbGljdXMgYnkgVGFwZSBtZWFzdXJlXCIsXG4gIFwiODQ4MC02XCI6IFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NDYyLTRcIjogXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NTM1NC05XCI6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWwgd2l0aCBhbGwgY2hpbGRyZW4gb3B0aW9uYWxcIixcbn07XG4iLCAiLyoqXG4gKiBQdXJlIHBhcnNpbmcgaGVscGVycyBcdTIwMTQgcmVmZXJlbmNlIHJhbmdlLCBxdWFudGl0eSwgVUNVTSB1bml0IG5vcm1hbGlzYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19wYXJzZXJzLnB5YC4gU2VsZi1jb250YWluZWQ6IG5vIGRlcGVuZGVuY2llc1xuICogb24gb3RoZXIgb2JzZXJ2YXRpb24gbW9kdWxlIHBpZWNlcy5cbiAqXG4gKiBQdWJsaWMgQVBJOlxuICogICB0b1VjdW0odW5pdCkgICAgICAgICAgICAgICAgICBcdTIxOTIgY2Fub25pY2FsIFVDVU0gdW5pdCBzdHJpbmcgKG9yIG51bGwpXG4gKiAgIHBhcnNlUmFuZ2VNdWx0aShyYXcsIHVuaXQpICAgIFx1MjE5MiBsaXN0IG9mIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cmllc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvbmUgcGVyIHNleCB3aGVuIHNleC1zdHJhdGlmaWVkKVxuICogICBwYXJzZVJhbmdlKHJhdywgdW5pdCkgICAgICAgICBcdTIxOTIgc2luZ2xlIHJlZmVyZW5jZVJhbmdlIGVudHJ5XG4gKiAgIHRyeVBhcnNlUXVhbnRpdHkocmF3LCB1bml0KSAgIFx1MjE5MiBGSElSIFF1YW50aXR5IGRpY3Qgb3IgbnVsbFxuICovXG5cbmNvbnN0IFVDVU1fU1lTVEVNID0gXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCI7XG5cbi8vIEZISVIgUjQgUXVhbnRpdHkuY29tcGFyYXRvciBhbGxvd2VkIHZhbHVlcy4gTm9ybWFsaXNlIGZ1bGwtd2lkdGggQ0pLXG4vLyBcdUZGMUUgXHVGRjFDIFx1MjI2NyBcdTIyNjYgKyBBU0NJSSB2YXJpYW50cyBzbyBcIlx1RkYxRSA0MC4wXCIgc3RpbGwgcGFyc2VzIGFzIGEgcmVhbCBudW1iZXJcbi8vIGluc3RlYWQgb2YgZmFsbGluZyB0aHJvdWdoIHRvIHZhbHVlU3RyaW5nICh3aGljaCBsb3NlcyB0aGUgdW5pdCkuXG5jb25zdCBGVUxMV0lEVEhfT1BTOiBSZWFkb25seUFycmF5PFtzdHJpbmcsIHN0cmluZ10+ID0gW1xuICBbXCJcdUZGMUVcIiwgXCI+XCJdLFxuICBbXCJcdUZGMUNcIiwgXCI8XCJdLFxuICBbXCJcdTIyNjdcIiwgXCI+PVwiXSxcbiAgW1wiXHUyMjY2XCIsIFwiPD1cIl0sXG4gIFtcIlx1MjI2NVwiLCBcIj49XCJdLFxuICBbXCJcdTIyNjRcIiwgXCI8PVwiXSxcbl07XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZUZ1bGx3aWR0aChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgb3V0ID0gcztcbiAgZm9yIChjb25zdCBbZnJvbSwgdG9dIG9mIEZVTExXSURUSF9PUFMpIHtcbiAgICBpZiAob3V0LmluY2x1ZGVzKGZyb20pKSB7XG4gICAgICBvdXQgPSBvdXQuc3BsaXQoZnJvbSkuam9pbih0byk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmNvbnN0IENPTVBBUkFUT1JfUkUgPSAvXlxccyooPD18Pj18PHw+KVxccyooLispJC87XG5cbi8vIFJlZmVyZW5jZS1yYW5nZSBwYXJzaW5nLiBOSEkgc2hpcHMgdGhlIHJhbmdlIGFzIHBsYWluIHRleHQgbGlrZVxuLy8gXCJbMy44OV1bMjYuOF1cIiwgXCJbNDBdW11cIiwgXCJbTmVnYXRpdmVdXCIgb3IgXCJBTSA4OjAwIDYuMi0xOS40XCIuXG5jb25zdCBSUl9MT1dISUdIX0JSQUNLRVRTID0gL15cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqJC87XG5jb25zdCBSUl9EQVNIX1JBTkdFID0gLygtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlstflx1MjAxM11cXHMqKC0/XFxkKyg/OlxcLlxcZCspPykvO1xuY29uc3QgUlJfQ09NUEFSQVRPUiA9IC9eXFxzKig8PXw+PXw8fD4pXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKiQvO1xuLy8gU2V4LXN0cmF0aWZpZWQgYnJhY2tldGVkIHJhbmdlLCBlLmcuIFwiXHU3NTM3OjEzLjcgXHU1OTczOjExLjFcIiBcdTIwMTQgdXNlZCBieSBzb21lXG4vLyBob3NwaXRhbHMgZm9yIGhhZW1hdG9sb2d5IChIYiwgUkJDLCBIY3QpLiBQdWxscyBvdXQgKHNleCwgdmFsdWUpIHBhaXJzLlxuLy8gVG9sZXJhdGVzIG9wdGlvbmFsIGNvbXBhcmF0b3IgKFx1MjI2Ny9cdTIyNjYvPi88KSBiZWZvcmUgdGhlIG51bWJlci5cbmNvbnN0IFJSX1NFWF9OVU1fRyA9IC8oXHU3NTM3XHU2MDI3fFx1NTk3M1x1NjAyN3xcdTc1Mzd8XHU1OTczfE18RilcXHMqWzpcdUZGMUFdP1xccyooPzpbPD5cdTIyNjdcdTIyNjZdPT8pP1xccyooLT9cXGQrKD86XFwuXFxkKyk/KS9nO1xuY29uc3QgUlJfU0lOR0xFX0JSQUNLRVQgPSAvXlxccypcXFtcXHMqKC4rPylcXHMqXFxdXFxzKiQvO1xuY29uc3QgUlJfUVVBTElUQVRJVkVfUEFSRU4gPVxuICAvXlxccyooTm9ybWFsfFx1NkI2M1x1NUUzOHxOb25yZWFjdGl2ZXxOb24tcmVhY3RpdmUpXFxzKlxcKFxccyooLT9cXGQrKD86XFwuXFxkKyk/KVxccypcXClcXHMqJC9pO1xuXG5jb25zdCBTRVhfVE9fRkhJUjogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIFx1NzUzN1x1NjAyNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIFx1NzUzNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIE06IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBcdTU5NzNcdTYwMjc6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbiAgXHU1OTczOiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG4gIEY6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbn07XG5cbi8vIFB1YmxpYyB0eXBlcyBcdTIwMTQgRkhJUiBRdWFudGl0eSAvIHJlZmVyZW5jZVJhbmdlIHNoYXBlcyB1c2VkIGRvd25zdHJlYW0uXG5leHBvcnQgaW50ZXJmYWNlIFF1YW50aXR5IHtcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdD86IHN0cmluZztcbiAgc3lzdGVtPzogc3RyaW5nO1xuICBjb2RlPzogc3RyaW5nO1xuICBjb21wYXJhdG9yPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlRW50cnkge1xuICB0ZXh0OiBzdHJpbmc7XG4gIGxvdz86IFF1YW50aXR5O1xuICBoaWdoPzogUXVhbnRpdHk7XG4gIGFwcGxpZXNUbz86IEFycmF5PHtcbiAgICBjb2Rpbmc6IEFycmF5PHsgc3lzdGVtOiBzdHJpbmc7IGNvZGU6IHN0cmluZzsgZGlzcGxheTogc3RyaW5nIH0+O1xuICAgIHRleHQ6IHN0cmluZztcbiAgfT47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVQ1VNIG5vcm1hbGlzYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTkhJIGxhYnMgcmVwb3J0IHVuaXRzIGluIGEgbWl4IG9mIFVDVU0tY2xlYW4gc3RyaW5ncyAoJ21nL2RMJyksXG4gKiBUYWl3YW4tc3R5bGUgZXF1aXZhbGVudHMgKCdtRXEvTCcgdnMgVUNVTSAnbWVxL0wnKSwgZnVsbC13aWR0aCBwdW5jdHVhdGlvblxuICogKCdcdUZGMDUnIHZzICclJyksIGFuZCBwbGFjZWhvbGRlciB0ZXh0ICgnXHU3MTIxJykuIFRoZSBUV05ISUZISVIgdmFsaWRhdG9yXG4gKiByZWplY3RzIGV2ZXJ5dGhpbmcgZXhjZXB0IGNhbm9uaWNhbCBVQ1VNIGluIFF1YW50aXR5LmNvZGUsIHNvIHdlXG4gKiBub3JtYWxpc2UuIGBudWxsYCBtZWFucyBcIm9taXQgUXVhbnRpdHkuY29kZSBlbnRpcmVseVwiLlxuICovXG5jb25zdCBVQ1VNX09WRVJSSURFUzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVsbD4gPSB7XG4gIC8vIEZ1bGx3aWR0aCBcdTIxOTIgQVNDSUlcbiAgXCJcdUZGMDVcIjogXCIlXCIsXG4gIC8vIENhc2Utc2Vuc2l0aXZlIFVDVU0gKEVxIGlzICdlcScsIG5vdCAnRXEnKVxuICBcIm1FcS9MXCI6IFwibWVxL0xcIixcbiAgXCJtZXEvbFwiOiBcIm1lcS9MXCIsXG4gIC8vIEJQIHByb2ZpbGUgZml4ZWQtdmFsdWU6IG1tW0hnXSBub3QgbW1IZ1xuICBtbUhnOiBcIm1tW0hnXVwiLFxuICBNTUhHOiBcIm1tW0hnXVwiLFxuICAvLyBDb21tb24gQ2hpbmVzZSAnbm8gdW5pdCcgcGxhY2Vob2xkZXJzIFx1MjE5MiBkcm9wIFVDVU0gY29kZVxuICBcdTcxMjE6IG51bGwsXG4gIFwiXCI6IG51bGwsXG4gIFwiXHUyMDE0XCI6IG51bGwsXG4gIFwiLVwiOiBudWxsLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvVWN1bSh1bml0OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdW5pdCkgcmV0dXJuIG51bGw7XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoVUNVTV9PVkVSUklERVMsIHVuaXQpKSB7XG4gICAgcmV0dXJuIFVDVU1fT1ZFUlJJREVTW3VuaXRdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIHVuaXQ7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBRdWFudGl0eSBidWlsZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBtYWtlUXVhbnRpdHkodmFsdWU6IG51bWJlciwgdW5pdDogc3RyaW5nKTogUXVhbnRpdHkge1xuICBjb25zdCBxOiBRdWFudGl0eSA9IHsgdmFsdWUgfTtcbiAgaWYgKHVuaXQpIHtcbiAgICBxLnVuaXQgPSB1bml0O1xuICAgIHEuc3lzdGVtID0gVUNVTV9TWVNURU07XG4gICAgcS5jb2RlID0gdW5pdDtcbiAgfVxuICByZXR1cm4gcTtcbn1cblxuZnVuY3Rpb24gdHJ5UGFyc2VGbG9hdChzOiBzdHJpbmcpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHMgPT09IFwiXCIgfHwgcyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgLy8gTWlycm9yIFB5dGhvbidzIGZsb2F0KCkgXHUyMDE0IGFsbG93IGxlYWRpbmcvdHJhaWxpbmcgd2hpdGVzcGFjZSxcbiAgLy8gb3B0aW9uYWwgc2lnbiwgZGVjaW1hbC4gUmVqZWN0IGlmIE5hTiBPUiBpZiBhbnkgbm9uLW51bWVyaWMgcmVzaWR1YWxcbiAgLy8gKE51bWJlcihcIjEyYWJjXCIpIHJldHVybnMgTmFOLCBPSzsgXCIxMiAgYWJjXCIgYWxzbyBOYU4sIE9LKS5cbiAgY29uc3QgdHJpbW1lZCA9IHMudHJpbSgpO1xuICBpZiAodHJpbW1lZCA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG4gPSBOdW1iZXIodHJpbW1lZCk7XG4gIGlmIChOdW1iZXIuaXNOYU4obikpIHJldHVybiBudWxsO1xuICByZXR1cm4gbjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHBhcnNlUmFuZ2VNdWx0aSAvIHBhcnNlUmFuZ2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTGlzdCB2YXJpYW50IG9mIHBhcnNlUmFuZ2U6IGVtaXRzIG9uZSBlbnRyeSBwZXIgc2V4IHdoZW4gdGhlIHJhbmdlIGlzXG4gKiBzZXgtc3RyYXRpZmllZCAoXCJbXHU3NTM3OjEzLjcgXHU1OTczOjExLjFdW1x1NzUzNzoxNy4wIFx1NTk3MzoxNS4wXVwiKSwgb3RoZXJ3aXNlIGFcbiAqIHNpbmdsZS1lbGVtZW50IGxpc3QuIEVhY2ggZW50cnkgdGFnZ2VkIHdpdGggYXBwbGllc1RvIHNvIGRvd25zdHJlYW1cbiAqIGNvZGUgY2FuIHBpY2sgdGhlIHJpZ2h0IG9uZSBmb3IgdGhlIHBhdGllbnQncyBzZXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlTXVsdGkocmF3UmFuZ2U6IHN0cmluZywgdW5pdDogc3RyaW5nKTogUmFuZ2VFbnRyeVtdIHtcbiAgY29uc3QgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aCgocmF3UmFuZ2UgfHwgXCJcIikudHJpbSgpKTtcbiAgaWYgKCFzKSByZXR1cm4gW107XG5cbiAgY29uc3QgbG93QnlTZXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaGlnaEJ5U2V4OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGxldCB1c2VkTXVsdGkgPSBmYWxzZTtcblxuICBjb25zdCBtID0gcy5tYXRjaChSUl9MT1dISUdIX0JSQUNLRVRTKTtcbiAgaWYgKG0pIHtcbiAgICBjb25zdCBsb3dCbG9iID0gbVsxXSA/PyBcIlwiO1xuICAgIGNvbnN0IGhpZ2hCbG9iID0gbVsyXSA/PyBcIlwiO1xuICAgIGZvciAoY29uc3Qgc20gb2YgbG93QmxvYi5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICBpZiAoc21bMV0gJiYgc21bMl0pIGxvd0J5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNtIG9mIGhpZ2hCbG9iLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgIGlmIChzbVsxXSAmJiBzbVsyXSkgaGlnaEJ5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gU2luZ2xlLWJyYWNrZXQ6IGVhY2ggcGVyLXNleCB2YWx1ZSdzIGNvbXBhcmF0b3IgZGVjaWRlcyBsb3cgdnMgaGlnaC5cbiAgICBjb25zdCBzaW5nbGUgPSBzLm1hdGNoKFJSX1NJTkdMRV9CUkFDS0VUKTtcbiAgICBpZiAoc2luZ2xlKSB7XG4gICAgICBjb25zdCBpbm5lciA9IHNpbmdsZVsxXSA/PyBcIlwiO1xuICAgICAgZm9yIChjb25zdCBzbSBvZiBpbm5lci5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICAgIGNvbnN0IHNleEtleSA9IHNtWzFdID8/IFwiXCI7XG4gICAgICAgIGNvbnN0IHZhbFN0ciA9IHNtWzJdID8/IFwiXCI7XG4gICAgICAgIC8vIEZpbmQgdGhlIGNvbXBhcmF0b3IgaW1tZWRpYXRlbHkgcHJlY2VkaW5nIHRoaXMgbnVtYmVyLlxuICAgICAgICAvLyBNaXJyb3IgdGhlIFB5dGhvbjogcmVidWlsZCBhIHBlci1zZXgta2V5IHNlYXJjaC5cbiAgICAgICAgY29uc3QgcGF0ID0gbmV3IFJlZ0V4cChgJHtlc2NhcGVSZWdleChzZXhLZXkpfVxcXFxzKls6XHVGRjFBXT9cXFxccyooWzw+XHUyMjY3XHUyMjY2XT0/KT9cXFxccyotP1xcXFxkYCk7XG4gICAgICAgIGNvbnN0IGNtID0gaW5uZXIubWF0Y2gocGF0KTtcbiAgICAgICAgY29uc3Qgb3AgPSBjbT8uWzFdID8/IFwiXCI7XG4gICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgIGxvd0J5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH0gZWxzZSBpZiAob3AgPT09IFwiPFwiIHx8IG9wID09PSBcIjw9XCIpIHtcbiAgICAgICAgICBoaWdoQnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb3dCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gICAgfVxuICB9XG5cbiAgaWYgKHVzZWRNdWx0aSkge1xuICAgIGNvbnN0IGVudHJpZXM6IFJhbmdlRW50cnlbXSA9IFtdO1xuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgdW5pb24gb2Yga2V5cyBhY3R1YWxseSBzZWVuIFx1MjAxNCBwcmVzZXJ2ZSBpbnNlcnRpb24gb3JkZXIuXG4gICAgY29uc3QgYWxsU2V4S2V5czogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLk9iamVjdC5rZXlzKGxvd0J5U2V4KSwgLi4uT2JqZWN0LmtleXMoaGlnaEJ5U2V4KV0pIHtcbiAgICAgIGlmICghYWxsU2V4S2V5cy5pbmNsdWRlcyhrKSkgYWxsU2V4S2V5cy5wdXNoKGspO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNleEtleSBvZiBhbGxTZXhLZXlzKSB7XG4gICAgICBjb25zdCBtYXBwaW5nID0gU0VYX1RPX0ZISVJbc2V4S2V5XTtcbiAgICAgIGlmICghbWFwcGluZykgY29udGludWU7XG4gICAgICBjb25zdCBbZmhpckNvZGUsIGZoaXJEaXNwbGF5XSA9IG1hcHBpbmc7XG4gICAgICBjb25zdCBlbnRyeTogUmFuZ2VFbnRyeSA9IHtcbiAgICAgICAgdGV4dDogcmF3UmFuZ2UsXG4gICAgICAgIGFwcGxpZXNUbzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9obDcub3JnL2ZoaXIvYWRtaW5pc3RyYXRpdmUtZ2VuZGVyXCIsXG4gICAgICAgICAgICAgICAgY29kZTogZmhpckNvZGUsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmhpckRpc3BsYXksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgdGV4dDogZmhpckRpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBpZiAoc2V4S2V5IGluIGxvd0J5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGxvd0J5U2V4W3NleEtleV0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICAgIGlmIChzZXhLZXkgaW4gaGlnaEJ5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGhpZ2hCeVNleFtzZXhLZXldISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgICAgZW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICB9XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gRGUtZHVwIGJ5IEZISVIgc2V4IGNvZGUgaW4gY2FzZSBpbnB1dCBoYXMgYm90aCBcdTc1MzcgYW5kIFx1NzUzN1x1NjAyNy5cbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgIGNvbnN0IG91dDogUmFuZ2VFbnRyeVtdID0gW107XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgZW50cmllcykge1xuICAgICAgICBjb25zdCBjID0gZS5hcHBsaWVzVG8/LlswXT8uY29kaW5nWzBdPy5jb2RlO1xuICAgICAgICBpZiAoIWMgfHwgc2Vlbi5oYXMoYykpIGNvbnRpbnVlO1xuICAgICAgICBzZWVuLmFkZChjKTtcbiAgICAgICAgb3V0LnB1c2goZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uZSA9IHBhcnNlUmFuZ2UocmF3UmFuZ2UsIHVuaXQpO1xuICByZXR1cm4gb25lID8gW29uZV0gOiBbXTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcmVmZXJlbmNlLXJhbmdlIHRleHQgaW50byBhIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cnkuXG4gKlxuICogU3RyYXRlZ3kgaW4gb3JkZXI6XG4gKiAgIDEuIFwiW2xvd11baGlnaF1cIiBicmFja2V0ZWQgZm9ybWF0IFx1MjAxNCBOSEkncyBjYW5vbmljYWwgc2hhcGUuXG4gKiAgIDIuIFwiMy44OS0yNi44XCIgLyBcIjMuODl+MjYuOFwiIGRhc2ggcmFuZ2UuXG4gKiAgIDMuIFwiPiA0MFwiIC8gXCI8IDAuNVwiIHNpbmdsZS1zaWRlZC5cbiAqICAgNC4gUXVhbGl0YXRpdmUgKFwiTmVnYXRpdmVcIiwgXCJBTSA4OjAwIDYuMi0xOS40XCIpIFx1MjAxNCB0ZXh0LW9ubHkuXG4gKlxuICogU2V4LXN0cmF0aWZpZWQgc2hhcGVzIGdvIHRocm91Z2ggcGFyc2VSYW5nZU11bHRpLiBSZXR1cm5zIG51bGwgb25seVxuICogZm9yIGVtcHR5IGlucHV0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSYW5nZShyYXdSYW5nZTogc3RyaW5nLCB1bml0OiBzdHJpbmcpOiBSYW5nZUVudHJ5IHwgbnVsbCB7XG4gIGNvbnN0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoKHJhd1JhbmdlIHx8IFwiXCIpLnRyaW0oKSk7XG4gIGlmICghcykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGVudHJ5OiBSYW5nZUVudHJ5ID0geyB0ZXh0OiByYXdSYW5nZSB9O1xuXG4gIGNvbnN0IG0gPSBzLm1hdGNoKFJSX0xPV0hJR0hfQlJBQ0tFVFMpO1xuICBpZiAobSkge1xuICAgIGNvbnN0IGxvID0gKG1bMV0gPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IGhpID0gKG1bMl0gPz8gXCJcIikudHJpbSgpO1xuICAgIGZvciAoY29uc3QgW3NpZGUsIHNpZGVWYWxdIG9mIFtcbiAgICAgIFtcImxvd1wiLCBsb10sXG4gICAgICBbXCJoaWdoXCIsIGhpXSxcbiAgICBdIGFzIGNvbnN0KSB7XG4gICAgICBpZiAoIXNpZGVWYWwgfHwgc2lkZVZhbCA9PT0gXCJcdTcxMjFcIiB8fCBzaWRlVmFsID09PSBcIlx1N0E3QVx1NzY3RFwiKSBjb250aW51ZTtcblxuICAgICAgLy8gMS4gUGxhaW4gZmxvYXRcbiAgICAgIGNvbnN0IGFzRmxvYXQgPSB0cnlQYXJzZUZsb2F0KHNpZGVWYWwpO1xuICAgICAgaWYgKGFzRmxvYXQgIT09IG51bGwpIHtcbiAgICAgICAgZW50cnlbc2lkZV0gPSBtYWtlUXVhbnRpdHkoYXNGbG9hdCwgdW5pdCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyAyLiBEYXNoIHJhbmdlIFx1MjAxNCBtZWFuaW5nZnVsIG9ubHkgZm9yIGBsb3dgIHNsb3Q7IHNwbGl0cyBpbnRvIGxvdytoaWdoLlxuICAgICAgY29uc3QgZG0gPSBzaWRlVmFsLm1hdGNoKFJSX0RBU0hfUkFOR0UpO1xuICAgICAgaWYgKGRtICYmIHNpZGUgPT09IFwibG93XCIgJiYgZW50cnkuaGlnaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkbVsxXSEpO1xuICAgICAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZG1bMl0hKTtcbiAgICAgICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYxLCB1bml0KTtcbiAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYyLCB1bml0KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAzLiBDb21wYXJhdG9yIChcdTIyNjc2MCwgPD0wLjA0IGV0Yy4pXG4gICAgICBjb25zdCBjbSA9IHNpZGVWYWwubWF0Y2goUlJfQ09NUEFSQVRPUik7XG4gICAgICBpZiAoY20pIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21bMl0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBvcCA9IGNtWzFdO1xuICAgICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA0LiBcIk5vcm1hbCAoIFggKVwiIC8gXCJOb25yZWFjdGl2ZSAoIFggKVwiIFx1MjAxNCBYIGlzIHRoZSBjdXRvZmYgKGhpZ2ggYm91bmQpLlxuICAgICAgY29uc3QgcW0gPSBzaWRlVmFsLm1hdGNoKFJSX1FVQUxJVEFUSVZFX1BBUkVOKTtcbiAgICAgIGlmIChxbSkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChxbVsyXSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgY29uc3QgZGFzaE1hdGNoID0gcy5tYXRjaChSUl9EQVNIX1JBTkdFKTtcbiAgaWYgKGRhc2hNYXRjaCkge1xuICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkYXNoTWF0Y2hbMV0hKTtcbiAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZGFzaE1hdGNoWzJdISk7XG4gICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodjEsIHVuaXQpO1xuICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2MiwgdW5pdCk7XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIGNvbnN0IGNtcE1hdGNoID0gcy5tYXRjaChSUl9DT01QQVJBVE9SKTtcbiAgaWYgKGNtcE1hdGNoKSB7XG4gICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21wTWF0Y2hbMl0hKTtcbiAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgb3AgPSBjbXBNYXRjaFsxXTtcbiAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICAvLyBGYWxsIHRocm91Z2g6IHF1YWxpdGF0aXZlIG9yIGNvbXBsZXggXHUyMDE0IHRleHQtb25seSBpcyBGSElSLWNvcnJlY3QuXG4gIHJldHVybiBlbnRyeTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHRyeVBhcnNlUXVhbnRpdHkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogUGFyc2UgXCI+IDQwLjBcIiAvIFwiPDAuMDEwXCIgLyBcIjEsMjM0LjVcIiBcdTIxOTIgRkhJUiBRdWFudGl0eSB3aXRoIGNvbXBhcmF0b3IuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiB0aGUgcmVzaWR1YWwgYWZ0ZXIgc3RyaXBwaW5nIGEgY29tcGFyYXRvciBzdGlsbFxuICogaXNuJ3QgbnVtZXJpYyBcdTIwMTQgY2FsbGVyIGZhbGxzIGJhY2sgdG8gdmFsdWVTdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cnlQYXJzZVF1YW50aXR5KFxuICByYXdWYWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgdW5pdDogc3RyaW5nLFxuKTogUXVhbnRpdHkgfCBudWxsIHtcbiAgaWYgKHJhd1ZhbHVlID09PSBudWxsIHx8IHJhd1ZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aChTdHJpbmcocmF3VmFsdWUpLnRyaW0oKSk7XG4gIGxldCBjb21wYXJhdG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3QgY20gPSBzLm1hdGNoKENPTVBBUkFUT1JfUkUpO1xuICBpZiAoY20pIHtcbiAgICBjb21wYXJhdG9yID0gY21bMV0gPz8gbnVsbDtcbiAgICBzID0gKGNtWzJdID8/IFwiXCIpLnRyaW0oKTtcbiAgfVxuICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChzLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdWN1bUNvZGUgPSB0b1VjdW0odW5pdCk7XG4gIGNvbnN0IHF0eTogUXVhbnRpdHkgPSB7XG4gICAgdmFsdWU6IHYsXG4gICAgc3lzdGVtOiBVQ1VNX1NZU1RFTSxcbiAgfTtcbiAgLy8gUXVhbnRpdHkudW5pdCAoaHVtYW4tcmVhZGFibGUpIGtlZXBzIHRoZSBvcmlnaW5hbCBOSEkgbGFiZWwgc28gdXNlcnNcbiAgLy8gc3RpbGwgc2VlICdcdUZGMDUnIG9yICdtRXEvTCcgcmF3LiBRdWFudGl0eS5jb2RlIGlzIHN0cmljdCBVQ1VNIG1hY2hpbmVcbiAgLy8gY29kZS4gRHJvcCB1bml0IGRpc3BsYXkgd2hlbiBlbXB0eSBzbyB3ZSBkb24ndCBlbWl0IFwidW5pdFwiOiBcIlwiLlxuICBpZiAodW5pdCkge1xuICAgIHF0eS51bml0ID0gdW5pdDtcbiAgfVxuICBpZiAodWN1bUNvZGUgIT09IG51bGwpIHtcbiAgICBxdHkuY29kZSA9IHVjdW1Db2RlO1xuICB9XG4gIGlmIChjb21wYXJhdG9yKSB7XG4gICAgcXR5LmNvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICB9XG4gIHJldHVybiBxdHk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8vIENoZWNrIHdoZXRoZXIgYSBzaW5nbGUgTE9JTkNfTUFQIGtleSBtYXRjaGVzIHRoZSBsYWIncyBjb21iaW5lZFxuLy8gKGNvZGUgKyBkaXNwbGF5KSBzdHJpbmcuIFR3byBydWxlczpcbi8vXG4vLyAxLiBBU0NJSSBrZXlzOiBgXFxiPGtleT5cXGJgIFx1MjAxNCB3b3JkIGJvdW5kYXJpZXMgb24gQk9USCBzaWRlcy4gVGhlXG4vLyAgICBuby10cmFpbGluZy1ib3VuZGFyeSBzZW1hbnRpYyBvZiB0aGUgb2xkZXIgYFxcYjxrZXk+YCBtYXRjaGVyXG4vLyAgICBjYXVzZWQgc2hvcnQga2V5cyBsaWtlIFwiaGJcIiAoSGVtb2dsb2JpbikgdG8gaW5jb3JyZWN0bHkgbWF0Y2hcbi8vICAgIGxvbmdlciB0ZXJtcyBsaWtlIFwiaGJzYWdcIiAoSEJzQWcpIGFuZCBcInBob3NwaGF0ZVwiIChtYXRjaGVkIGJ5XG4vLyAgICBcInBoXCIpLiBSZXF1aXJpbmcgYW4gZW5kIGJvdW5kYXJ5IG1lYW5zIFwiaGJcIiBvbmx5IG1hdGNoZXMgd2hlblxuLy8gICAgaXQgc3RhbmRzIGFzIGl0cyBvd24gd29yZC5cbi8vXG4vLyAyLiBDSksgLyBub24tQVNDSUkga2V5czogcGxhaW4gc3Vic3RyaW5nIGluY2x1ZGVzKCkuIFxcYiBkb2Vzbid0XG4vLyAgICBzZW1hbnRpY2FsbHkgd29yayBmb3IgQ0pLIChubyB3b3JkLWNoYXJhY3RlciBjbGFzcyBjb25jZXB0KS5cbmZ1bmN0aW9uIF9rZXl3b3JkTWF0Y2hlcyhrZXk6IHN0cmluZywgY29tYmluZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBrID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gIGlmIChpc0FzY2lpT25seShrZXkpKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrKX1cXFxcYmApLnRlc3QoY29tYmluZWQpO1xuICB9XG4gIHJldHVybiBjb21iaW5lZC5pbmNsdWRlcyhrKTtcbn1cblxuLy8gUGljayB0aGUgTE9OR0VTVCBtYXRjaGluZyBrZXkgZnJvbSB0aGUgdGFibGUsIG5vdCB0aGUgZmlyc3QuIEF2b2lkc1xuLy8gdGhlIHNhbWUgYnVnIGZhbWlseSBmcm9tIGEgc2Vjb25kIGFuZ2xlOiBoeXBoZW5hdGVkIGtleXMgbGlrZVxuLy8gXCJsZGwtY2hvbGVzdGVyb2xcIiBzaGFyZSBhIGBcXGIuLi5cXGJgIGJvdW5kYXJ5IGF0IHRoZSBoeXBoZW4sIHNvIFwibGRsXCJcbi8vICgzIGNoYXJzKSBhbHNvIG1hdGNoZXMgYSBcImxkbC1jaG9sZXN0ZXJvbFwiIHN0cmluZy4gTG9uZ2VzdC1tYXRjaFxuLy8gbWFrZXMgdGhlIG1vcmUgc3BlY2lmaWMga2V5IHdpbiByZWdhcmRsZXNzIG9mIGluc2VydGlvbiBvcmRlciwgc29cbi8vIHRoZSBicml0dGxlIFwibG9uZyBtdXN0IGFwcGVhciBiZWZvcmUgc2hvcnRcIiBjb21tZW50cyBzY2F0dGVyZWRcbi8vIHRocm91Z2ggTE9JTkNfTUFQIGJlY29tZSB1bm5lY2Vzc2FyeS5cbmZ1bmN0aW9uIF9maW5kTG9uZ2VzdE1hdGNoKFxuICBjb21iaW5lZDogc3RyaW5nLFxuICB0YWJsZTogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbik6IHN0cmluZyB8IG51bGwge1xuICBsZXQgYmVzdExvaW5jOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGJlc3RLZXlMZW4gPSAwO1xuICBmb3IgKGNvbnN0IFtrZXksIGxvaW5jXSBvZiBPYmplY3QuZW50cmllcyh0YWJsZSkpIHtcbiAgICBpZiAoa2V5Lmxlbmd0aCA+IGJlc3RLZXlMZW4gJiYgX2tleXdvcmRNYXRjaGVzKGtleSwgY29tYmluZWQpKSB7XG4gICAgICBiZXN0TG9pbmMgPSBsb2luYztcbiAgICAgIGJlc3RLZXlMZW4gPSBrZXkubGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYmVzdExvaW5jO1xufVxuXG4vKipcbiAqIFJldHVybiBwcmltYXJ5IExPSU5DIGZvciB0aGlzIGxhYi4gUGFuZWwtYXdhcmUgbG9va3VwOlxuICogICBBLiBTaW5nbGUtdGVzdCBOSEkgY29kZSBcdTIxOTIgdXNlIE5ISV9UT19MT0lOQyBkaXJlY3RseS5cbiAqICAgQi4gUGFuZWwgY29kZSBPUiB1bmtub3duIGNvZGUgXHUyMTkyIHdhbGsgTE9JTkNfTUFQIGJ5IGRpc3BsYXkga2V5d29yZFxuICogICAgICAobG9uZ2VzdC1rZXkgbWF0Y2ggd2lucywgYm90aC1zaWRlIHdvcmQgYm91bmRhcmllcyBlbmZvcmNlZCkuXG4gKiAgIEMuIEZhbGxiYWNrOiBwYW5lbC1sZXZlbCBMT0lOQyBmcm9tIE5ISV9UT19MT0lOQyBpZiBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9pbmMoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgd2lucyBvdXRyaWdodC5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMgJiYgIURJU1BMQVlfRklSU1RfQ09ERVMuaGFzKGNvZGUpKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG5cbiAgY29uc3QgY29tYmluZWQgPSBgJHtjb2RlfSAke2Rpc3BsYXl9YC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIEIxLiBQYW5lbC1zcGVjaWZpYyBrZXl3b3JkIG1hcCBydW5zIEJFRk9SRSB0aGUgZ2xvYmFsIG9uZS5cbiAgaWYgKGNvZGUgaW4gUEFORUxfTE9JTkNfTUFQKSB7XG4gICAgY29uc3QgaGl0ID0gX2ZpbmRMb25nZXN0TWF0Y2goY29tYmluZWQsIFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpO1xuICAgIGlmIChoaXQpIHJldHVybiBoaXQ7XG4gIH1cblxuICAvLyBCLiBEaXNwbGF5LWtleXdvcmQgc2VhcmNoLlxuICBjb25zdCBoaXQgPSBfZmluZExvbmdlc3RNYXRjaChjb21iaW5lZCwgTE9JTkNfTUFQKTtcbiAgaWYgKGhpdCkgcmV0dXJuIGhpdDtcblxuICAvLyBDLiBQYW5lbCBjb2RlIHdpdGggbm8gcmVjb2duaXNlZCBpdGVtIGRpc3BsYXkgXHUyMTkyIGZhbGwgYmFjay5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMpIHtcbiAgICByZXR1cm4gTkhJX1RPX0xPSU5DW2NvZGVdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIE9ic2VydmF0aW9uLmNvZGUuY29kaW5nW10gbGlzdC5cbiAqIFByaW9yaXR5OiBMT0lOQyBcdTIxOTIgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgbG9jYWwgZmFsbGJhY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvZGluZ3MoXG4gIGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGRpc3BsYXk6IHN0cmluZyxcbiAgbG9pbmM6IHN0cmluZyB8IG51bGwsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10ge1xuICBjb25zdCBjb2RpbmdzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10gPSBbXTtcbiAgaWYgKGxvaW5jKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsXG4gICAgICBjb2RlOiBsb2luYyxcbiAgICAgIGRpc3BsYXk6IExPSU5DX0RJU1BMQVlbbG9pbmNdID8/IGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgY29uc3QgY29kZVN0ciA9IChjb2RlID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKGNvZGVTdHIgJiYgTkhJX0xBQl9DT0RFX1JFLnRlc3QoY29kZVN0cikpIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLk5ISV9NRURJQ0FMX09SREVSX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyLFxuICAgICAgZGlzcGxheSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERSxcbiAgICAgIGNvZGU6IGNvZGVTdHIgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGNvZGluZ3M7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBJbnRlcnByZXRhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU5URVJQX1NZUyA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92My1PYnNlcnZhdGlvbkludGVycHJldGF0aW9uXCI7XG5cbmZ1bmN0aW9uIGludGVycENvZGluZyhjb2RlOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICByZXR1cm4geyBzeXN0ZW06IElOVEVSUF9TWVMsIGNvZGUsIGRpc3BsYXkgfTtcbn1cblxuY29uc3QgSU5URVJQX1RBQkxFOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgaGlnaDogW1wiSFwiLCBcIkhpZ2hcIl0sXG4gIGxvdzogW1wiTFwiLCBcIkxvd1wiXSxcbiAgbm9ybWFsOiBbXCJOXCIsIFwiTm9ybWFsXCJdLFxuICBjcml0aWNhbDogW1wiQUFcIiwgXCJDcml0aWNhbCBhYm5vcm1hbFwiXSxcbiAgYWJub3JtYWw6IFtcIkFcIiwgXCJBYm5vcm1hbFwiXSxcbiAgcG9zaXRpdmU6IFtcIlBPU1wiLCBcIlBvc2l0aXZlXCJdLFxuICBuZWdhdGl2ZTogW1wiTkVHXCIsIFwiTmVnYXRpdmVcIl0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWFwSW50ZXJwcmV0YXRpb24oXG4gIGludGVycDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgY29uc3Qga2V5ID0gKGludGVycCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBlbnRyeSA9IElOVEVSUF9UQUJMRVtrZXldO1xuICBpZiAoIWVudHJ5KSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGludGVycENvZGluZyhlbnRyeVswXSwgZW50cnlbMV0pO1xufVxuXG4vLyBQb3NpdGl2ZSBtYXJrZXJzIFx1MjAxNCBcInRoaXMgaXMgZGV0ZWN0ZWQgLyBhYm5vcm1hbFwiLlxuY29uc3QgUE9TX01BUktFUlMgPVxuICAvXlxccyooPzpwb3NpdGl2ZXxwb3N8cmVhY3RpdmV8ZGV0ZWN0ZWR8YWJub3JtYWx8cHJlc2VudHx0cmFjZXxbMS00XT9cXHMqXFwrKD86XFxzKltcXCtcXC1dKSopXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG4vLyBOZWdhdGl2ZSBtYXJrZXJzIFx1MjAxNCBleHBsaWNpdGx5IG5vcm1hbC9hYnNlbnQuXG5jb25zdCBORUdfTUFSS0VSUyA9XG4gIC9eXFxzKig/Om5lZ2F0aXZlfG5lZ3xub25yZWFjdGl2ZXxub25bLVxcc10/cmVhY3RpdmV8bm90Wy1cXHNdP2RldGVjdGVkfG5kfGFic2VudHxub25lfG5vcm1hbHwwfFstXHUyMDE0XHUyMDEzXSspXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG5mdW5jdGlvbiBjbGFzc2lmeVF1YWxpdGF0aXZlKHRleHQ6IHVua25vd24pOiBcInBvc1wiIHwgXCJuZWdcIiB8IG51bGwge1xuICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IFN0cmluZyh0ZXh0KS50cmltKCk7XG4gIGlmIChzLnN0YXJ0c1dpdGgoXCJbXCIpICYmIHMuZW5kc1dpdGgoXCJdXCIpKSB7XG4gICAgcyA9IHMuc2xpY2UoMSwgLTEpLnRyaW0oKTtcbiAgfVxuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBpZiAoTkVHX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwibmVnXCI7XG4gIGlmIChQT1NfTUFSS0VSUy50ZXN0KHMpKSByZXR1cm4gXCJwb3NcIjtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgdmFsdWVSYXc6IHN0cmluZyxcbiAgcXR5OiBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgcnI6IFJhbmdlRW50cnkgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIC8vIDEuIE51bWVyaWMgcGF0aC5cbiAgaWYgKHF0eSAmJiB0eXBlb2YgcXR5LnZhbHVlID09PSBcIm51bWJlclwiICYmIHJyKSB7XG4gICAgY29uc3QgdiA9IHF0eS52YWx1ZTtcbiAgICBjb25zdCBsbyA9IHJyLmxvdz8udmFsdWU7XG4gICAgY29uc3QgaGkgPSByci5oaWdoPy52YWx1ZTtcbiAgICBpZiAodHlwZW9mIGhpID09PSBcIm51bWJlclwiICYmIHYgPiBoaSkgcmV0dXJuIGludGVycENvZGluZyhcIkhcIiwgXCJIaWdoXCIpO1xuICAgIGlmICh0eXBlb2YgbG8gPT09IFwibnVtYmVyXCIgJiYgdiA8IGxvKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTFwiLCBcIkxvd1wiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiIHx8IHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyAyLiBRdWFsaXRhdGl2ZSBwYXRoLlxuICBjb25zdCB2YWxLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZSh2YWx1ZVJhdyk7XG4gIGNvbnN0IHJlZlRleHQgPSBycj8udGV4dCA/PyBcIlwiO1xuICBjb25zdCByZWZLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZShyZWZUZXh0KTtcbiAgaWYgKHZhbEtpbmQgPT09IG51bGwpIHJldHVybiBudWxsO1xuICBpZiAocmVmS2luZCA9PT0gXCJuZWdcIikge1xuICAgIGlmICh2YWxLaW5kID09PSBcInBvc1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiQVwiLCBcIkFibm9ybWFsXCIpO1xuICAgIGlmICh2YWxLaW5kID09PSBcIm5lZ1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTlwiLCBcIk5vcm1hbFwiKTtcbiAgfVxuICByZXR1cm4gdmFsS2luZCA9PT0gXCJwb3NcIiA/IGludGVycENvZGluZyhcIlBPU1wiLCBcIlBvc2l0aXZlXCIpIDogaW50ZXJwQ29kaW5nKFwiTkVHXCIsIFwiTmVnYXRpdmVcIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBDYW5vbmljYWwgbGFiIGtleSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTEFCX1NZTk9OWU1TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBEaWFiZXRlc1xuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXHU3Q0Q2XHU1MzE2XHU4ODQwXHU4MjcyXHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCJIQkExQ1wiLFxuICBcIkdMWUNBVEVEIEhFTU9HTE9CSU5cIjogXCJIQkExQ1wiLFxuICBIQkExQzogXCJIQkExQ1wiLFxuICBBMUM6IFwiSEJBMUNcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcIkZBU1RJTkcgR0xVQ09TRVwiOiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcdTg0NjFcdTg0MDRcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBcdTg4NDBcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBHTFVDT1NFOiBcIkdMVUNPU0VcIixcbiAgLy8gQ0JDXG4gIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJXQkNcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIldCQ1wiLFxuICBXQkM6IFwiV0JDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJSQkNcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIlJCQ1wiLFxuICBSQkM6IFwiUkJDXCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCJIRU1PR0xPQklOXCIsXG4gIEhFTU9HTE9CSU46IFwiSEVNT0dMT0JJTlwiLFxuICBIR0I6IFwiSEVNT0dMT0JJTlwiLFxuICBcdTg4NDBcdTVCQjlcdTdBNERcdTZCRDQ6IFwiSEVNQVRPQ1JJVFwiLFxuICBIRU1BVE9DUklUOiBcIkhFTUFUT0NSSVRcIixcbiAgSENUOiBcIkhFTUFUT0NSSVRcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIlBMQVRFTEVUXCIsXG4gIFBMQVRFTEVUOiBcIlBMQVRFTEVUXCIsXG4gIFBMVDogXCJQTEFURUxFVFwiLFxuICAvLyBDQkMgaW5kaWNlcyAoMTAtY2hhciBhbmQgNy1jaGFyIENKSyBmb3JtcyBiZWF0IGJhcmUgXHU3RDA1XHU4ODQwXHU3NDAzKVxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjBcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjA6IFwiTUNIXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1NkZDM1x1NUVBNjogXCJNQ0hDXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1OUFENFx1N0E0RDogXCJNQ1ZcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzXHU1MjA2XHU1RTAzXHU1QkVDXHU1RUE2OiBcIlJEV1wiLFxuICBNQ1Y6IFwiTUNWXCIsXG4gIE1DSDogXCJNQ0hcIixcbiAgTUNIQzogXCJNQ0hDXCIsXG4gIFJEVzogXCJSRFdcIixcbiAgLy8gQ0JDIGRpZmZlcmVudGlhbFxuICBcdTU1RENcdTRFMkRcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiTkVVVFJPUEhJTFwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTkxNzhcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTlFN0NcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiQkFTT1BISUxcIixcbiAgXHU2RENCXHU1REY0XHU3NDAzOiBcIkxZTVBIT0NZVEVcIixcbiAgXHU1NUFFXHU2ODM4XHU3NDAzOiBcIk1PTk9DWVRFXCIsXG4gIEVPU0lOT1BISUxTOiBcIkVPU0lOT1BISUxcIixcbiAgRU9TSU5PUEhJTDogXCJFT1NJTk9QSElMXCIsXG4gIE5FVVRST1BISUxTOiBcIk5FVVRST1BISUxcIixcbiAgTkVVVFJPUEhJTDogXCJORVVUUk9QSElMXCIsXG4gIEJBU09QSElMUzogXCJCQVNPUEhJTFwiLFxuICBCQVNPUEhJTDogXCJCQVNPUEhJTFwiLFxuICBMWU1QSE9DWVRFUzogXCJMWU1QSE9DWVRFXCIsXG4gIExZTVBIT0NZVEU6IFwiTFlNUEhPQ1lURVwiLFxuICBNT05PQ1lURVM6IFwiTU9OT0NZVEVcIixcbiAgTU9OT0NZVEU6IFwiTU9OT0NZVEVcIixcbiAgLy8gTGlwaWQgXHUyMDE0IExETC9IREwgbXVzdCBwcmVjZWRlIGJhcmUgQ0hPTEVTVEVST0wuXG4gIFwiTERMIENIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ0hPTEVTVEVST0xcIjogXCJMRExfQ1wiLFxuICBcIkhETCBDSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFwiSERMLUNIT0xFU1RFUk9MXCI6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiTERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkhETF9DXCIsXG4gIFx1ODg0MFx1NkUwNVx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlRPVEFMIENIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTEVTVEVST0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTDogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTRFMDlcdTkxNzhcdTc1MThcdTZDQjlcdTkxNkY6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFRSSUdMWUNFUklERTogXCJUUklHTFlDRVJJREVcIixcbiAgXCJIREwtQ1wiOiBcIkhETF9DXCIsXG4gIEhETDogXCJIRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiSERMX0NcIixcbiAgXCJMREwtQyhESVJFQ1QpXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ1wiOiBcIkxETF9DXCIsXG4gIExETDogXCJMRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiTERMX0NcIixcbiAgLy8gUmVuYWwgXHUyMDE0IHVyaW5lIGNyZWF0aW5pbmUgdmFyaWFudHMgYmVmb3JlIHNlcnVtLlxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlVSSU5FIENSRUFUSU5JTkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVBXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNTBcdTkxNzg6IFwiQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoQilcIjogXCJDUkVBVElOSU5FXCIsXG4gIENSRUFUSU5JTkU6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JUTjogXCJDUkVBVElOSU5FXCIsXG4gIEVHRlI6IFwiRUdGUlwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiQlVOXCIsXG4gIEJVTjogXCJCVU5cIixcbiAgXHU1QzNGXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlVSSU5FX1BIXCIsXG4gIFx1NUMzRlx1NkRCMlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiUEhcIixcbiAgXHU1QzNGXHU5MTc4OiBcIlVSSUNfQUNJRFwiLFxuICBcIlVSSUMgQUNJRFwiOiBcIlVSSUNfQUNJRFwiLFxuICBVUklDX0FDSUQ6IFwiVVJJQ19BQ0lEXCIsXG4gIC8vIExpdmVyXG4gIEFTVDogXCJBU1RcIixcbiAgQUxUOiBcIkFMVFwiLFxuICBHT1Q6IFwiQVNUXCIsXG4gIEdQVDogXCJBTFRcIixcbiAgXHU4MUJEXHU3RDA1XHU3RDIwOiBcIkJJTElSVUJJTlwiLFxuICBCSUxJUlVCSU46IFwiQklMSVJVQklOXCIsXG4gIFx1NzY3RFx1ODZDQlx1NzY3RDogXCJBTEJVTUlOXCIsXG4gIEFMQlVNSU46IFwiQUxCVU1JTlwiLFxuICAvLyBDYXJkaWFjXG4gIFx1NUZDM1x1ODA4Q1x1NjVDQlx1OEY0OVx1ODZDQlx1NzY3RDogXCJUUk9QT05JTlwiLFxuICBUUk9QT05JTjogXCJUUk9QT05JTlwiLFxuICBCTlA6IFwiQk5QXCIsXG4gIFx1NUZDM1x1ODFERjogXCJUUk9QT05JTlwiLFxuICAvLyBUaHlyb2lkXG4gIFx1NzUzMlx1NzJDMFx1ODE3QVx1NTIzQVx1NkZDMFx1N0QyMDogXCJUU0hcIixcbiAgVFNIOiBcIlRTSFwiLFxuICBcdTZFMzhcdTk2RTJcdTc1MzJcdTcyQzBcdTgxN0FcdTdEMjA6IFwiRlJFRV9UNFwiLFxuICBcIkZSRUUgVDRcIjogXCJGUkVFX1Q0XCIsXG4gIEZUNDogXCJGUkVFX1Q0XCIsXG4gIC8vIE1pc2NcbiAgQ1x1NTNDRFx1NjFDOVx1NjAyN1x1ODZDQlx1NzY3RDogXCJDUlBcIixcbiAgXCJDLVJFQUNUSVZFIFBST1RFSU5cIjogXCJDUlBcIixcbiAgQ1JQOiBcIkNSUFwiLFxuICBcIkhTLUNSUFwiOiBcIkhTX0NSUFwiLFxuICBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUY6IFwiUFNBXCIsXG4gIFBTQTogXCJQU0FcIixcbiAgXHU5NDM1XHU4NkNCXHU3NjdEOiBcIkZFUlJJVElOXCIsXG4gIEZFUlJJVElOOiBcIkZFUlJJVElOXCIsXG4gIFx1ODQ0OVx1OTE3ODogXCJGT0xBVEVcIixcbiAgRk9MQVRFOiBcIkZPTEFURVwiLFxuICBcdTdEQURcdTc1MUZcdTdEMjBCMTI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVQgQjEyXCI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVRBTUlOIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFx1NzZBRVx1OENFQVx1N0QyMDogXCJDT1JUSVNPTFwiLFxuICBDT1JUSVNPTDogXCJDT1JUSVNPTFwiLFxuICBcdTY4ODVcdTZCRDI6IFwiUlBSXCIsXG4gIFJQUjogXCJSUFJcIixcbiAgXHU5NkIxXHU3NDAzXHU4M0NDXHU2Mjk3XHU1MzlGOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBDUllQQUc6IFwiQ1JZUFRPQ09DQ0FMX0FHXCIsXG4gIFx1ODg0MFx1NkMyODogXCJBTU1PTklBXCIsXG4gIEFNTU9OSUE6IFwiQU1NT05JQVwiLFxuICBcdTUxRERcdTg4NDBcdTkxNzZcdTUzOUZcdTY2NDJcdTk1OTM6IFwiUFRcIixcbiAgQVBUVDogXCJBUFRUXCIsXG4gIElOUjogXCJJTlJcIixcbn07XG5cbi8vIFByZS1zb3J0IGtleXMgbG9uZ2VzdC1maXJzdCBzbyBsb25nZXIvbW9yZS1zcGVjaWZpYyBtYXRjaGVzIHdpbi5cbmNvbnN0IExBQl9TWU5PTllNX0tFWVNfU09SVEVEID0gT2JqZWN0LmtleXMoTEFCX1NZTk9OWU1TKS5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbExhYktleShkaXNwbGF5OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFkaXNwbGF5KSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcyA9IGRpc3BsYXkudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBcIlwiO1xuICBjb25zdCBzVXBwZXIgPSBzLnRvVXBwZXJDYXNlKCk7XG4gIGZvciAoY29uc3Qga2V5IG9mIExBQl9TWU5PTllNX0tFWVNfU09SVEVEKSB7XG4gICAgY29uc3Qga3UgPSBrZXkudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa3UpKSB7XG4gICAgICAvLyBMZWFkaW5nIHdvcmQtYm91bmRhcnkgb25seSBcdTIwMTQgXCJBU1RcIiBpbnNpZGUgXCJESUFTVE9MSUNcIiBzaG91bGQgbm90IG1hdGNoLlxuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrdSl9YCkudGVzdChzVXBwZXIpKSB7XG4gICAgICAgIHJldHVybiBMQUJfU1lOT05ZTVNba2V5XSE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzVXBwZXIuaW5jbHVkZXMoa3UpKSB7XG4gICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBhbmVsIGdyb3VwaW5nIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICAgIGlmIChjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmKSBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGlzRW5nbGlzaERvbWluYW50KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgbGF0aW4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIHtcbiAgICBjb25zdCBjcCA9IGNoLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGNwIDwgMTI4ICYmIC9bQS1aYS16XS8udGVzdChjaCkpIGxhdGluKys7XG4gIH1cbiAgcmV0dXJuIGxhdGluID49IDIgJiYgY2prQ2hhcnMocykgPT09IDA7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAodjogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGxldCBzID0gU3RyaW5nKHYpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXChbXildKlxcKS9nLCBcIlwiKS50cmltKCk7XG4gIHMgPSBzLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWx1ZSkudHJpbSgpO1xuICByZXR1cm4gcyAhPT0gXCJcIiAmJiBzICE9PSBcIlx1MjAxNFwiICYmIHMgIT09IFwiLVwiICYmIHMgIT09IFwiTi9BXCIgJiYgcyAhPT0gXCJudWxsXCI7XG59XG5cbmNvbnN0IE1FQU5JTkdGVUxfSU5URVJQUyA9IG5ldyBTZXQoW1xuICBcIm5vcm1hbFwiLFxuICBcImFibm9ybWFsXCIsXG4gIFwiaGlnaFwiLFxuICBcImxvd1wiLFxuICBcImNyaXRpY2FsXCIsXG4gIFwicG9zaXRpdmVcIixcbiAgXCJuZWdhdGl2ZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIGRlZHVwZVBhbmVsSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5VmFsdWUgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgayA9IG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAoaXQudmFsdWUpO1xuICAgIGNvbnN0IGdyb3VwID0gYnlWYWx1ZS5nZXQoayk7XG4gICAgaWYgKGdyb3VwKSBncm91cC5wdXNoKGl0KTtcbiAgICBlbHNlIGJ5VmFsdWUuc2V0KGssIFtpdF0pO1xuICB9XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgZ3JvdXAgb2YgYnlWYWx1ZS52YWx1ZXMoKSkge1xuICAgIGlmIChncm91cC5sZW5ndGggPT09IDEpIHtcbiAgICAgIG91dC5wdXNoKGdyb3VwWzBdISk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgY2prSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGNqa0NoYXJzKFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpID49IDIpO1xuICAgIGNvbnN0IGVuSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGlzRW5nbGlzaERvbWluYW50KFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpKTtcbiAgICBpZiAoY2prSXRlbXMubGVuZ3RoID4gMCAmJiBlbkl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIG91dC5wdXNoKGVuSXRlbXNbMF0hKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0LnB1c2goLi4uZ3JvdXApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zOiBhbnlbXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgcmF3IG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFyYXcgfHwgdHlwZW9mIHJhdyAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gICAgaWYgKGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheSwgcmF3LmNvZGUgfHwgXCJcIikpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICAgIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICAgIGNvbnN0IGhhc01lYW5pbmdmdWxJbnRlcnAgPSBNRUFOSU5HRlVMX0lOVEVSUFMuaGFzKGludGVycCk7XG4gICAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgY29udGludWU7XG4gICAgb3V0LnB1c2gocmF3KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBkZWR1cGVDcm9zc0Zvcm1hdChpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3Qgb3JkZXJDb2RlID0gKGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nID0+XG4gICAgKChpdC5vcmRlcl9jb2RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG5cbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgbGV0IGlkeENvdW50ZXIgPSAwO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICBjb25zdCB2ID0gU3RyaW5nKGl0ZW0udmFsdWUgPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHVuaXQgPSAoKGl0ZW0udW5pdCBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgICBpZiAoIXYpIHtcbiAgICAgIGJ5S2V5LnNldChgX19ub19kZWR1cF9ffCR7aWR4Q291bnRlcisrfWAsIGl0ZW0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IFtcbiAgICAgIChpdGVtLmRhdGUgYXMgc3RyaW5nKSA/PyBcIlwiLFxuICAgICAgdi50b0xvd2VyQ2FzZSgpLFxuICAgICAgdW5pdC50b0xvd2VyQ2FzZSgpLFxuICAgICAgb3JkZXJDb2RlKGl0ZW0pLFxuICAgIF0uam9pbihcInxcIik7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBieUtleS5nZXQoa2V5KTtcbiAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvLyBQcmVmZXIgdGhlIHJvdyB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGNsaW5pY2FsIHJlYWRzKS5cbiAgICBsZXQgcHJpbWFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBsZXQgc2Vjb25kYXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIGlmIChjamtDaGFycyhpdGVtLmRpc3BsYXkgPz8gXCJcIikgPCBjamtDaGFycyhleGlzdGluZy5kaXNwbGF5ID8/IFwiXCIpKSB7XG4gICAgICBwcmltYXJ5ID0gaXRlbTtcbiAgICAgIHNlY29uZGFyeSA9IGV4aXN0aW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmltYXJ5ID0gZXhpc3Rpbmc7XG4gICAgICBzZWNvbmRhcnkgPSBpdGVtO1xuICAgIH1cbiAgICBjb25zdCBtZXJnZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgW1wib3JkZXJfY29kZVwiLCBcIm9yZGVyX25hbWVcIiwgXCJob3NwaXRhbFwiLCBcImNvZGVcIl0pIHtcbiAgICAgIGlmICghbWVyZ2VkW2ZdICYmIHNlY29uZGFyeVtmXSkgbWVyZ2VkW2ZdID0gc2Vjb25kYXJ5W2ZdO1xuICAgIH1cbiAgICBieUtleS5zZXQoa2V5LCBtZXJnZWQpO1xuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKGJ5S2V5LnZhbHVlcygpKTtcbn1cblxuaW50ZXJmYWNlIEJwQ29tcG9uZW50IHtcbiAgbG9pbmM6IHN0cmluZztcbiAgZGlzcGxheTogc3RyaW5nO1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0OiBzdHJpbmc7XG4gIGludGVycHJldGF0aW9uX3RleHQ6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gY29tYmluZUJwSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgeyBzeXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT47IGRpYXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT4gfVxuICA+KCk7XG4gIGNvbnN0IHBhc3NUaHJvdWdoOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGRpc3AgPSBTdHJpbmcoaXQuZGlzcGxheSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGtleSA9IGAke2l0LmRhdGUgPz8gXCJcIn18JHtpdC5ob3NwaXRhbCA/PyBcIlwifWA7XG4gICAgaWYgKGRpc3AuaW5jbHVkZXMoXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5zeXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIGlmIChkaXNwLmluY2x1ZGVzKFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpKSB7XG4gICAgICBjb25zdCB2ID0gYnlLZXkuZ2V0KGtleSkgPz8ge307XG4gICAgICB2LmRpYXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhc3NUaHJvdWdoLnB1c2goaXQpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgcGFydHMgb2YgYnlLZXkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBzID0gcGFydHMuc3lzdG9saWM7XG4gICAgY29uc3QgZCA9IHBhcnRzLmRpYXN0b2xpYztcbiAgICBjb25zdCBwcmltYXJ5ID0gcyA/PyBkO1xuICAgIGlmICghcHJpbWFyeSkgY29udGludWU7XG4gICAgY29uc3QgY29tcG9uZW50czogQnBDb21wb25lbnRbXSA9IFtdO1xuICAgIGNvbnN0IHRyeUFkZCA9IChzcmM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQsIGxvaW5jOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFzcmMpIHJldHVybjtcbiAgICAgIGNvbnN0IHZhbCA9IHNyYy52YWx1ZTtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBcIlwiIHx8IHZhbCA9PT0gXCItXCIgfHwgdmFsID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgICBjb25zdCBudW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcodmFsKS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG51bSkpIHJldHVybjtcbiAgICAgIGNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgIGxvaW5jLFxuICAgICAgICBkaXNwbGF5LFxuICAgICAgICB2YWx1ZTogbnVtLFxuICAgICAgICB1bml0OiBzcmMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgaW50ZXJwcmV0YXRpb25fdGV4dDogc3JjLnJlZmVyZW5jZV9yYW5nZSB8fCBcIlwiLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB0cnlBZGQocywgXCI4NDgwLTZcIiwgXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKTtcbiAgICB0cnlBZGQoZCwgXCI4NDYyLTRcIiwgXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBjb25zdCBjb21iaW5lZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4ucHJpbWFyeSB9O1xuICAgIGNvbWJpbmVkLmRpc3BsYXkgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfbmFtZSA9IFwiQmxvb2QgUHJlc3N1cmVcIjtcbiAgICBjb21iaW5lZC5jYXRlZ29yeSA9IFwidml0YWwtc2lnbnNcIjtcbiAgICBjb21iaW5lZC5icF9jb21wb25lbnRzID0gY29tcG9uZW50cztcbiAgICBjb21iaW5lZC5icF9wYW5lbF9sb2luYyA9IFwiODUzNTQtOVwiO1xuICAgIGNvbWJpbmVkLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIGNvbWJpbmVkLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgcGFzc1Rocm91Z2gucHVzaChjb21iaW5lZCk7XG4gIH1cblxuICByZXR1cm4gcGFzc1Rocm91Z2g7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTcGVjaW1lbiBpbmZlcmVuY2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IFNQRUNJTUVOX1JVTEVTOiBSZWFkb25seUFycmF5PFtSZWdFeHAsIHN0cmluZ10+ID0gW1xuICBbL1x1NUMzRnx1cmluZXx1cmluYWx5L2ksIFwiVXJpbmVcIl0sXG4gIFsvXHU3Q0RFfFx1NEZCRlx1NkY1Qlx1ODg0MHxzdG9vbHxmZWNhbHxmYWVjYWx8b2NjdWx0XFxzKmJsb29kL2ksIFwiU3Rvb2xcIl0sXG4gIFsvXHU3NUYwfHNwdXR1bS9pLCBcIlNwdXR1bVwiXSxcbiAgWy9cdTgxNjZcdTgxMEFcdTZEQjJ8Y3NmfGNlcmVicm9zcGluYWwvaSwgXCJDZXJlYnJvc3BpbmFsIGZsdWlkXCJdLFxuICBbL1x1ODBGOFx1NkMzNHxwbGV1cmFsL2ksIFwiUGxldXJhbCBmbHVpZFwiXSxcbiAgWy9cdTgxNzlcdTZDMzR8YXNjaXRlc3xwZXJpdG9uZWFsL2ksIFwiUGVyaXRvbmVhbCBmbHVpZFwiXSxcbiAgWy9cdTk2NzBcdTkwNTN8XHU2MkI5XHU3MjQ3fGNlcnZpY2FsfHBhcFxccypzbWVhcnx2YWdpbmFsL2ksIFwiQ2VydmljYWwvVmFnaW5hbFwiXSxcbiAgWy9cdTk1RENcdTdCQzBcdTZEQjJ8c3lub3ZpYWx8am9pbnRcXHMqZmx1aWQvaSwgXCJTeW5vdmlhbCBmbHVpZFwiXSxcbiAgWy9cdTdGOEFcdTZDMzR8YW1uaW90aWMvaSwgXCJBbW5pb3RpYyBmbHVpZFwiXSxcbiAgWy9cdTlBQThcdTlBRDN8Ym9uZVxccyptYXJyb3cvaSwgXCJCb25lIG1hcnJvd1wiXSxcbl07XG5cbmZ1bmN0aW9uIGluZmVyU3BlY2ltZW4oLi4uaGludHM6IEFycmF5PHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ+KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGJsb2IgPSBoaW50c1xuICAgIC5maWx0ZXIoKGgpOiBoIGlzIHN0cmluZyA9PiBCb29sZWFuKGgpKVxuICAgIC5qb2luKFwiIFwiKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIWJsb2IpIHJldHVybiBudWxsO1xuICBmb3IgKGNvbnN0IFtwYXR0ZXJuLCBsYWJlbF0gb2YgU1BFQ0lNRU5fUlVMRVMpIHtcbiAgICBpZiAocGF0dGVybi50ZXN0KGJsb2IpKSByZXR1cm4gbGFiZWw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNYXAgc2luZ2xlIE9ic2VydmF0aW9uIChub24tZ3JvdXBlZCBwYXRoKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIGNvZGUpKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICBpZiAoIWhhc1ZhbHVlICYmICFoYXNNZWFuaW5nZnVsSW50ZXJwKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSwgcmF3LmRhdGUgPz8gXCJcIik7XG4gIGNvbnN0IGxvaW5jID0gZmluZExvaW5jKGNvZGUsIGRpc3BsYXkpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IFwibGFib3JhdG9yeVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCByciA9IHBhcnNlUmFuZ2UoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnIpIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gW3JyXTtcbiAgfVxuXG4gIGNvbnN0IGludGVycENvZGluZ1Jlc3VsdCA9XG4gICAgbWFwSW50ZXJwcmV0YXRpb24oaW50ZXJwKSB8fFxuICAgIGRlcml2ZUludGVycHJldGF0aW9uKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCA/IFN0cmluZyh2YWx1ZSkgOiBcIlwiLFxuICAgICAgcmVzb3VyY2UudmFsdWVRdWFudGl0eSBhcyBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgICAgIChyZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSBhcyBSYW5nZUVudHJ5W10gfCB1bmRlZmluZWQpPy5bMF0sXG4gICAgKTtcbiAgaWYgKGludGVycENvZGluZ1Jlc3VsdCkge1xuICAgIHJlc291cmNlLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbaW50ZXJwQ29kaW5nUmVzdWx0XSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJ1aWxkIG9ic2VydmF0aW9uIHdpdGhpbiBhIHBhbmVsICh3aXRoIGNhbm9uaWNhbCBsYWIga2V5IGlkKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gYnVpbGRPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbiAgcGFuZWxDb2RlOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIC8vIEJQIHBhbmVsOiBwcmVidWlsdCBieSBjb21iaW5lQnBJdGVtcy5cbiAgaWYgKHJhdy5icF9jb21wb25lbnRzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJvYnNcIiwgXCJCUF9QQU5FTFwiLCBkYXRlLCBob3NwaXRhbCk7XG4gICAgY29uc3QgY29tcG9uZW50UmVzb3VyY2VzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYyBvZiByYXcuYnBfY29tcG9uZW50cyBhcyBCcENvbXBvbmVudFtdKSB7XG4gICAgICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgICAgICB2YWx1ZTogYy52YWx1ZSxcbiAgICAgICAgdW5pdDogYy51bml0IHx8IFwibW1IZ1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiB0b1VjdW0oYy51bml0KSA/PyBcIm1tW0hnXVwiLFxuICAgICAgfTtcbiAgICAgIGNvbXBvbmVudFJlc291cmNlcy5wdXNoKHtcbiAgICAgICAgY29kZToge1xuICAgICAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIiwgY29kZTogYy5sb2luYywgZGlzcGxheTogYy5kaXNwbGF5IH1dLFxuICAgICAgICAgIHRleHQ6IGMuZGlzcGxheSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWVRdWFudGl0eTogcXR5LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGJwT2JzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgICBpZDogb2JzSWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgY29kZTogXCJ2aXRhbC1zaWduc1wiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgICAgICAgY29kZTogcmF3LmJwX3BhbmVsX2xvaW5jID8/IFwiODUzNTQtOVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IFwiQmxvb2QgUHJlc3N1cmVcIixcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgY29tcG9uZW50OiBjb21wb25lbnRSZXNvdXJjZXMsXG4gICAgfTtcbiAgICBpZiAoZGF0ZSkgYnBPYnMuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtkYXRlfVQwMDowMDowMCswODowMGA7XG4gICAgaWYgKGhvc3BpdGFsKSBicE9icy5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgICByZXR1cm4gYnBPYnM7XG4gIH1cblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IChwYW5lbENvZGUgPyBTdHJpbmcocGFuZWxDb2RlKSA6IFwiXCIpIHx8IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCBjYW5vbmljYWwgPSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgfHwgZGlzcGxheTtcbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIGNhbm9uaWNhbCwgcmF3LmRhdGUgPz8gXCJcIiwgcmF3Lmhvc3BpdGFsID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCBjYXRDb2RlID0gcmF3LmNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiO1xuICBjb25zdCBDQVRfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBsYWJvcmF0b3J5OiBcIkxhYm9yYXRvcnlcIixcbiAgICBcInZpdGFsLXNpZ25zXCI6IFwiVml0YWwgU2lnbnNcIixcbiAgICBpbWFnaW5nOiBcIkltYWdpbmdcIixcbiAgICBwcm9jZWR1cmU6IFwiUHJvY2VkdXJlXCIsXG4gICAgXCJzb2NpYWwtaGlzdG9yeVwiOiBcIlNvY2lhbCBIaXN0b3J5XCIsXG4gICAgc3VydmV5OiBcIlN1cnZleVwiLFxuICAgIGV4YW06IFwiRXhhbVwiLFxuICAgIHRoZXJhcHk6IFwiVGhlcmFweVwiLFxuICAgIGFjdGl2aXR5OiBcIkFjdGl2aXR5XCIsXG4gIH07XG4gIGNvbnN0IGNhdERpc3BsYXkgPVxuICAgIENBVF9ESVNQTEFZW2NhdENvZGVdID8/IGNhdENvZGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYXRDb2RlLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgaWQ6IG9ic0lkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICBjYXRlZ29yeTogW1xuICAgICAge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogY2F0Q29kZSxcbiAgICAgICAgICAgIGRpc3BsYXk6IGNhdERpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuaG9zcGl0YWwpIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IHJhdy5ob3NwaXRhbCB9XTtcbiAgY29uc3Qgc3BlY2ltZW4gPSBpbmZlclNwZWNpbWVuKHJhdy5vcmRlcl9uYW1lLCByYXcuZGlzcGxheSwgcmF3LmNvZGUpO1xuICBpZiAoc3BlY2ltZW4pIHJlc291cmNlLnNwZWNpbWVuID0geyBkaXNwbGF5OiBzcGVjaW1lbiB9O1xuXG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBpZiAoaGFzVmFsdWUpIHtcbiAgICBjb25zdCBxdHkgPSB0cnlQYXJzZVF1YW50aXR5KFN0cmluZyh2YWx1ZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChxdHkpIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgPSBxdHk7XG4gICAgZWxzZSByZXNvdXJjZS52YWx1ZVN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBpZiAocmF3LnJlZmVyZW5jZV9yYW5nZSkge1xuICAgIGNvbnN0IHJycyA9IHBhcnNlUmFuZ2VNdWx0aShTdHJpbmcocmF3LnJlZmVyZW5jZV9yYW5nZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChycnMubGVuZ3RoID4gMCkgcmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgPSBycnM7XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBHcm91cCBieSAob3JkZXJfY29kZSwgZGF0ZSwgaG9zcGl0YWwpIFx1MjE5MiBEUiArIE9ic2VydmF0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZ3JvdXBCeU9yZGVyQ29kZShcbiAgY2xlYW5lZDogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGxldCB3b3JraW5nID0gZGVkdXBlQ3Jvc3NGb3JtYXQoY2xlYW5lZCk7XG4gIHdvcmtpbmcgPSBjb21iaW5lQnBJdGVtcyh3b3JraW5nKTtcblxuICBjb25zdCBncm91cHMgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBjb25zdCBrZXlNZXRhID0gbmV3IE1hcDxzdHJpbmcsIHsgZ3JvdXBLZXlDb2RlOiBzdHJpbmc7IGRhdGU6IHN0cmluZzsgaG9zcGl0YWw6IHN0cmluZyB9PigpO1xuICBmb3IgKGNvbnN0IHJhdyBvZiB3b3JraW5nKSB7XG4gICAgY29uc3QgZ3JvdXBLZXlDb2RlID0gcmF3Lm9yZGVyX2NvZGUgfHwgcmF3LmNvZGUgfHwgcmF3LmRpc3BsYXkgfHwgXCJcIjtcbiAgICBjb25zdCBkYXRlID0gcmF3LmRhdGUgPz8gXCJcIjtcbiAgICBjb25zdCBob3NwaXRhbCA9IHJhdy5ob3NwaXRhbCA/PyBcIlwiO1xuICAgIGNvbnN0IGtleSA9IGAke2dyb3VwS2V5Q29kZX18JHtkYXRlfXwke2hvc3BpdGFsfWA7XG4gICAgY29uc3QgYXJyID0gZ3JvdXBzLmdldChrZXkpO1xuICAgIGlmIChhcnIpIGFyci5wdXNoKHJhdyk7XG4gICAgZWxzZSB7XG4gICAgICBncm91cHMuc2V0KGtleSwgW3Jhd10pO1xuICAgICAga2V5TWV0YS5zZXQoa2V5LCB7IGdyb3VwS2V5Q29kZTogU3RyaW5nKGdyb3VwS2V5Q29kZSksIGRhdGUsIGhvc3BpdGFsIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgW2tleSwgaXRlbXNdIG9mIGdyb3Vwcy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBtZXRhID0ga2V5TWV0YS5nZXQoa2V5KSE7XG4gICAgY29uc3QgZGVkdXBlZCA9IGRlZHVwZVBhbmVsSXRlbXMoaXRlbXMpO1xuXG4gICAgY29uc3Qgb2JzUmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgICBjb25zdCBzZWVuT2JzSWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBpdCBvZiBkZWR1cGVkKSB7XG4gICAgICBjb25zdCBvYnMgPSBidWlsZE9ic2VydmF0aW9uKGl0LCBwYXRpZW50SWQsIG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICAgIGlmICghb2JzKSBjb250aW51ZTtcbiAgICAgIGlmIChzZWVuT2JzSWRzLmhhcyhvYnMuaWQpKSBjb250aW51ZTtcbiAgICAgIHNlZW5PYnNJZHMuYWRkKG9icy5pZCk7XG4gICAgICBvYnNSZXNvdXJjZXMucHVzaChvYnMpO1xuICAgIH1cbiAgICBpZiAob2JzUmVzb3VyY2VzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG5cbiAgICAvLyBCUCBwYW5lbDogZW1pdCBPYnNlcnZhdGlvbiBkaXJlY3RseSAobm8gRFIgd3JhcHBlcikuXG4gICAgY29uc3QgaXNCcFBhbmVsID0gZGVkdXBlZC5ldmVyeSgoaXQpID0+IGl0LmJwX2NvbXBvbmVudHMgfHwgaXQuZGlzcGxheSA9PT0gXCJCbG9vZCBQcmVzc3VyZVwiKTtcbiAgICBpZiAoaXNCcFBhbmVsKSB7XG4gICAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JkZXJOYW1lID0gZGVkdXBlZC5maW5kKChpdCkgPT4gaXQub3JkZXJfbmFtZSk/Lm9yZGVyX25hbWUgPz8gbnVsbDtcbiAgICBjb25zdCBtZW1iZXJLZXlzID0gQXJyYXkuZnJvbShcbiAgICAgIG5ldyBTZXQoZGVkdXBlZC5maWx0ZXIoKGl0KSA9PiBpdC5kaXNwbGF5KS5tYXAoKGl0KSA9PiBjYW5vbmljYWxMYWJLZXkoaXQuZGlzcGxheSkpKSxcbiAgICApLnNvcnQoKTtcbiAgICBjb25zdCBwYW5lbFNpZ25hdHVyZSA9IG1lbWJlcktleXMuam9pbihcIixcIikgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICBjb25zdCBkcklkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIkRSXCIsIHBhbmVsU2lnbmF0dXJlLCBtZXRhLmRhdGUsIG1ldGEuaG9zcGl0YWwpO1xuXG4gICAgbGV0IHBhbmVsVGl0bGU6IHN0cmluZztcbiAgICBpZiAoZGVkdXBlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHNpbmdsZURpc3BsYXkgPSBkZWR1cGVkWzBdIS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBwYW5lbFRpdGxlID0gc2luZ2xlRGlzcGxheSB8fCBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWxUaXRsZSA9IG9yZGVyTmFtZSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGRyQ29kZVN5c3RlbSA9IE5ISV9MQUJfQ09ERV9SRS50ZXN0KFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgPz8gXCJcIilcbiAgICAgID8gc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX0xBQl9DT0RFO1xuXG4gICAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICByZXNvdXJjZVR5cGU6IFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICAgICAgaWQ6IGRySWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjItMDA3NFwiLFxuICAgICAgICAgICAgICBjb2RlOiBcIkxBQlwiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIkxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjb2RlOiB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogZHJDb2RlU3lzdGVtLFxuICAgICAgICAgICAgY29kZTogU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKSB8fCBcIlVOS05PV05cIixcbiAgICAgICAgICAgIGRpc3BsYXk6IHBhbmVsVGl0bGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogcGFuZWxUaXRsZSxcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgcmVzdWx0OiBvYnNSZXNvdXJjZXMubWFwKChvKSA9PiAoeyByZWZlcmVuY2U6IGBPYnNlcnZhdGlvbi8ke28uaWR9YCB9KSksXG4gICAgfTtcbiAgICBpZiAobWV0YS5kYXRlKSBkci5lZmZlY3RpdmVEYXRlVGltZSA9IGAke21ldGEuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChtZXRhLmhvc3BpdGFsKSBkci5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBtZXRhLmhvc3BpdGFsIH1dO1xuXG4gICAgb3V0LnB1c2goZHIpO1xuICAgIG91dC5wdXNoKC4uLm9ic1Jlc291cmNlcyk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgY2xlYW5lZCA9IGZpbHRlckxhYlJvd3MocmF3SXRlbXMpO1xuICByZXR1cm4gZ3JvdXBCeU9yZGVyQ29kZShjbGVhbmVkLCBwYXRpZW50SWQpO1xufVxuIiwgIi8qKlxuICogUHJvY2VkdXJlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcHJvY2VkdXJlLnB5YC4gUmV0dXJucyBudWxsIGZvciBsaXN0LXBhZ2VcbiAqIHJvd3MgbGFja2luZyBub3RlL2JvZHlfc2l0ZSBcdTIwMTQgdGhlIGFsdGVybmF0aXZlIGlzIHRoZSBTTUFSVCBhcHAgc2hvd2luZ1xuICogMjUgXCJwcm9jZWR1cmVzXCIgY2FsbGVkIFwiTXljb2JhY3RlcmlhIGN1bHR1cmVcIiAvIFwiVmFnaW5hbCB1bHRyYXNvdW5kXCJcbiAqIC8gZXRjLiB3aGljaCBhcmUgY2xpbmljYWxseSB3cm9uZy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwiaWNkXCIpKSByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfUENTO1xuICByZXR1cm4gc3lzdGVtcy5ISVNfTE9DQUxfUFJPQ0VEVVJFX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQcm9jZWR1cmUoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IG5vdGUgPSAoKHJhdy5ub3RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICBjb25zdCBib2R5U2l0ZSA9ICgocmF3LmJvZHlfc2l0ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFub3RlICYmICFib2R5U2l0ZSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBQcm9jZWR1cmVcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiUHJvY2VkdXJlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcuZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiByYXcuc3RhdHVzID8/IFwiY29tcGxldGVkXCIsXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lZERhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAoYm9keVNpdGUpIHtcbiAgICByZXNvdXJjZS5ib2R5U2l0ZSA9IFt7IHRleHQ6IGJvZHlTaXRlIH1dO1xuICB9XG4gIGlmIChub3RlKSB7XG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IG5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIG1hcHBlciBkaXNwYXRjaCB0YWJsZXMuXG4gKlxuICogQ29uc3VtZWQgYnkgYmFja2VuZCdzIGAvc3luYy91cGxvYWQtc3RydWN0dXJlZGAgYW5kIHRoZSBleHRlbnNpb24nc1xuICogbG9jYWwtbW9kZSBidW5kbGUgYXNzZW1ibGVyIHNvIGJvdGggcHJvZHVjZSBpZGVudGljYWwgRkhJUiBvdXRwdXQuXG4gKi9cblxuaW1wb3J0IHsgbWFwQWxsZXJneUludG9sZXJhbmNlIH0gZnJvbSBcIi4vYWxsZXJneVwiO1xuaW1wb3J0IHsgbWFwQ29uZGl0aW9uIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBtYXBEaWFnbm9zdGljUmVwb3J0IH0gZnJvbSBcIi4vZGlhZ25vc3RpYy1yZXBvcnRcIjtcbmltcG9ydCB7IG1hcEVuY291bnRlciB9IGZyb20gXCIuL2VuY291bnRlclwiO1xuaW1wb3J0IHsgbWFwTWVkaWNhdGlvblJlcXVlc3QsIG1hcE1lZGljYXRpb25zRGVkdXAgfSBmcm9tIFwiLi9tZWRpY2F0aW9uXCI7XG5pbXBvcnQgeyBtYXBPYnNlcnZhdGlvbiwgbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCB9IGZyb20gXCIuL29ic2VydmF0aW9uXCI7XG5pbXBvcnQgeyBtYXBQcm9jZWR1cmUgfSBmcm9tIFwiLi9wcm9jZWR1cmVcIjtcblxuZXhwb3J0IHR5cGUgUGVyUm93TWFwcGVyID0gKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKSA9PiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbDtcblxuZXhwb3J0IHR5cGUgR3JvdXBNYXBwZXIgPSAoaXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZykgPT4gUmVjb3JkPHN0cmluZywgYW55PltdO1xuXG4vKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgKHBlci1yb3cgbWFwcGVyLCBKU09OIGxpc3Qga2V5IGluc2lkZSBMTE0gcmVzcG9uc2UpLlxuICogVXNlZCBieSB0aGUgTExNIGZhbGxiYWNrIHBhdGggYWZ0ZXIgZXh0cmFjdGlvbjsgdGhlIHN0cnVjdHVyZWQgcGF0aFxuICogYWxzbyBjb25zdWx0cyBpdCBmb3IgcGVyLXJvdyByZXNvdXJjZSB0eXBlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IExJU1RfSEFORExFUlM6IFJlY29yZDxzdHJpbmcsIFtQZXJSb3dNYXBwZXIsIHN0cmluZ10+ID0ge1xuICBvYnNlcnZhdGlvbnM6IFttYXBPYnNlcnZhdGlvbiwgXCJvYnNlcnZhdGlvbnNcIl0sXG4gIG1lZGljYXRpb25zOiBbbWFwTWVkaWNhdGlvblJlcXVlc3QsIFwibWVkaWNhdGlvbnNcIl0sXG4gIGNvbmRpdGlvbnM6IFttYXBDb25kaXRpb24sIFwiY29uZGl0aW9uc1wiXSxcbiAgYWxsZXJnaWVzOiBbbWFwQWxsZXJneUludG9sZXJhbmNlLCBcImFsbGVyZ2llc1wiXSxcbiAgZGlhZ25vc3RpY19yZXBvcnRzOiBbbWFwRGlhZ25vc3RpY1JlcG9ydCwgXCJkaWFnbm9zdGljX3JlcG9ydHNcIl0sXG4gIHByb2NlZHVyZXM6IFttYXBQcm9jZWR1cmUsIFwicHJvY2VkdXJlc1wiXSxcbiAgZW5jb3VudGVyczogW21hcEVuY291bnRlciwgXCJlbmNvdW50ZXJzXCJdLFxufTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIGdyb3VwLWF3YXJlIG1hcHBlciB0aGF0IHRha2VzIHRoZSBGVUxMIGxpc3QgYXQgb25jZS5cbiAqIFVzZWQgd2hlbiBjcm9zcy1yb3cgZ3JvdXBpbmcvZGVkdXAgaXMgcmVxdWlyZWQgKE5ISSBsYWIgcGFuZWxzLFxuICogXHU0RTJEXHU4MkYxIG1lZGljYXRpb24gXHU5NkQ5XHU4QTlFIGRlZHVwKS5cbiAqL1xuZXhwb3J0IGNvbnN0IEdST1VQX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBHcm91cE1hcHBlcj4gPSB7XG4gIG9ic2VydmF0aW9uczogbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCxcbiAgbWVkaWNhdGlvbnM6IG1hcE1lZGljYXRpb25zRGVkdXAsXG59O1xuIiwgIi8qKlxuICogRW5jb3VudGVyIGxpbmtlciBcdTIwMTQgbWF0Y2ggcmVzb3VyY2VzIHRvIEVuY291bnRlcnMgYnkgKGhvc3BpdGFsLCBkYXRlKS5cbiAqXG4gKiBQdXJlIGZ1bmN0aW9uOiBtdXRhdGVzIGByZXNvdXJjZXNgIGluIHBsYWNlIHRvIGFkZCBgZW5jb3VudGVyYFxuICogcmVmZXJlbmNlcyB3aGVuIHRoZXJlJ3MgYW4gdW5hbWJpZ3VvdXMgbWF0Y2ggaW4gdGhlIGNhbmRpZGF0ZVxuICogRW5jb3VudGVyIGxpc3QuIFNhbWUgbG9naWMgYXMgdGhlIGJhY2tlbmQncyBEQi1jb3VwbGVkIHZlcnNpb24sXG4gKiBsaWZ0ZWQgb3V0IHNvIHRoZSBleHRlbnNpb24ncyBsb2NhbCBtb2RlIGNhbiBjYWxsIGl0IG9uIGFuXG4gKiBpbi1tZW1vcnkgYXJyYXkuXG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlSW50ZXJwcmV0YXRpb24gfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuXG5jb25zdCBFTkNPVU5URVJfTElOS0FCTEUgPSBuZXcgU2V0KFtcbiAgXCJPYnNlcnZhdGlvblwiLFxuICBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gIFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICBcIlByb2NlZHVyZVwiLFxuICBcIkNvbmRpdGlvblwiLFxuICBcIkFsbGVyZ3lJbnRvbGVyYW5jZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIHJlc291cmNlRGF0ZShyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgW1xuICAgIFwiZWZmZWN0aXZlRGF0ZVRpbWVcIixcbiAgICBcImF1dGhvcmVkT25cIixcbiAgICBcInBlcmZvcm1lZERhdGVUaW1lXCIsXG4gICAgXCJvbnNldERhdGVUaW1lXCIsXG4gICAgXCJyZWNvcmRlZERhdGVcIixcbiAgICBcImlzc3VlZFwiLFxuICBdKSB7XG4gICAgY29uc3QgdiA9IHJba2V5XTtcbiAgICBpZiAodikgcmV0dXJuIFN0cmluZyh2KS5zbGljZSgwLCAxMCk7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgb2YgW1wiZWZmZWN0aXZlUGVyaW9kXCIsIFwicGVyZm9ybWVkUGVyaW9kXCJdKSB7XG4gICAgY29uc3QgcGVyaW9kID0gcltrZXldO1xuICAgIGlmIChwZXJpb2QgJiYgdHlwZW9mIHBlcmlvZCA9PT0gXCJvYmplY3RcIiAmJiBwZXJpb2Quc3RhcnQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcocGVyaW9kLnN0YXJ0KS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5mdW5jdGlvbiByZXNvdXJjZUhvc3BpdGFsKHI6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBmb3IgKGNvbnN0IHAgb2Ygci5wZXJmb3JtZXIgPz8gW10pIHtcbiAgICBjb25zdCBkID0gKHAgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBpZiAoZCkgcmV0dXJuIGQ7XG4gIH1cbiAgY29uc3QgcmVxID0gci5yZXF1ZXN0ZXIgPz8ge307XG4gIGlmIChyZXEgJiYgdHlwZW9mIHJlcSA9PT0gXCJvYmplY3RcIiAmJiByZXEuZGlzcGxheSkgcmV0dXJuIHJlcS5kaXNwbGF5O1xuICByZXR1cm4gXCJcIjtcbn1cblxuLyoqXG4gKiBEcm9wIEFNQiBFbmNvdW50ZXJzIHdob3NlIChob3NwaXRhbCwgc3RhcnRfZGF0ZSkgaXMgYWxyZWFkeSBjb3ZlcmVkXG4gKiBieSBhbiBJTVAgRW5jb3VudGVyJ3MgYWRtaXNzaW9uIGRheS4gTkhJIGVtaXRzIHRoZSBzYW1lIGlucGF0aWVudFxuICogc3RheSB0d2ljZSAoSUhLRTMzMDMgQU1CIGJpbGxpbmcgZW50cnkgKyBJSEtFMzMwOSBJTVAgZGV0YWlsKTsgdGhlXG4gKiBJTVAgb25lIGlzIGNhbm9uaWNhbCwgdGhlIEFNQiBpcyBhIGJpbGxpbmcgYXJ0ZWZhY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cEFkbWlzc2lvbkRheUFtYihcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBpbXBTdGFydHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgaWYgKChyLmNsYXNzID8/IHt9KS5jb2RlICE9PSBcIklNUFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKHIucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgaWYgKGhvc3AgJiYgc3RhcnQpIGltcFN0YXJ0cy5hZGQoYCR7aG9zcH0gJHtzdGFydH1gKTtcbiAgfVxuICBpZiAoaW1wU3RhcnRzLnNpemUgPT09IDApIHJldHVybiByZXNvdXJjZXM7XG4gIHJldHVybiByZXNvdXJjZXMuZmlsdGVyKChyKSA9PiB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlID09PSBcIkVuY291bnRlclwiICYmIChyLmNsYXNzID8/IHt9KS5jb2RlID09PSBcIkFNQlwiKSB7XG4gICAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICAgIGlmIChpbXBTdGFydHMuaGFzKGAke2hvc3B9ICR7c3RhcnR9YCkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFkZCBgZW5jb3VudGVyYCByZWZlcmVuY2UgdG8gZWFjaCBsaW5rYWJsZSByZXNvdXJjZSB3aGVuIGl0c1xuICogKGhvc3BpdGFsLCBkYXRlKSBtYXRjaGVzIGV4YWN0bHkgT05FIEVuY291bnRlciBpbiBgY2FuZGlkYXRlc2AuXG4gKiBDb25zZXJ2YXRpdmUgXHUyMDE0IGxlYXZlcyBhbWJpZ3VvdXMgKDAgb3IgPjEgbWF0Y2gpIGNhc2VzIHVubGlua2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlua0VuY291bnRlcnNJblJlc291cmNlcyhcbiAgY2FuZGlkYXRlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoY2FuZGlkYXRlcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgY29uc3QgZXhhY3RJbmRleCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgY29uc3QgaW1wQnlIb3NwID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4+KCk7XG5cbiAgZm9yIChjb25zdCBlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICBpZiAoZS5yZXNvdXJjZVR5cGUgIT09IFwiRW5jb3VudGVyXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoZS5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoIWhvc3AgfHwgIXN0YXJ0KSBjb250aW51ZTtcbiAgICBjb25zdCBrZXkgPSBgJHtob3NwfSAke3N0YXJ0fWA7XG4gICAgY29uc3QgYXJyID0gZXhhY3RJbmRleC5nZXQoa2V5KSA/PyBbXTtcbiAgICBhcnIucHVzaChlLmlkKTtcbiAgICBleGFjdEluZGV4LnNldChrZXksIGFycik7XG4gICAgY29uc3QgY2xzID0gKGUuY2xhc3MgPz8ge30pLmNvZGUgPz8gXCJcIjtcbiAgICBpZiAoY2xzID09PSBcIklNUFwiKSB7XG4gICAgICBjb25zdCBlbmQgPSBTdHJpbmcoKGUucGVyaW9kID8/IHt9KS5lbmQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGVuZCkge1xuICAgICAgICBjb25zdCBsaXN0ID0gaW1wQnlIb3NwLmdldChob3NwKSA/PyBbXTtcbiAgICAgICAgbGlzdC5wdXNoKFtzdGFydCwgZW5kLCBlLmlkXSk7XG4gICAgICAgIGltcEJ5SG9zcC5zZXQoaG9zcCwgbGlzdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGV4YWN0SW5kZXguc2l6ZSA9PT0gMCAmJiBpbXBCeUhvc3Auc2l6ZSA9PT0gMCkgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoIUVOQ09VTlRFUl9MSU5LQUJMRS5oYXMoci5yZXNvdXJjZVR5cGUpKSBjb250aW51ZTtcbiAgICBpZiAoci5lbmNvdW50ZXIgfHwgci5jb250ZXh0KSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gcmVzb3VyY2VIb3NwaXRhbChyKTtcbiAgICBjb25zdCBkYXRlID0gcmVzb3VyY2VEYXRlKHIpO1xuICAgIGlmICghaG9zcCB8fCAhZGF0ZSkgY29udGludWU7XG4gICAgY29uc3QgbWF0Y2hlczogc3RyaW5nW10gPSBbLi4uKGV4YWN0SW5kZXguZ2V0KGAke2hvc3B9ICR7ZGF0ZX1gKSA/PyBbXSldO1xuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChjb25zdCBbc3RhcnQsIGVuZCwgZWlkXSBvZiBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdKSB7XG4gICAgICAgIGlmIChzdGFydCA8PSBkYXRlICYmIGRhdGUgPD0gZW5kKSBtYXRjaGVzLnB1c2goZWlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoICE9PSAxKSBjb250aW51ZTtcbiAgICByLmVuY291bnRlciA9IHsgcmVmZXJlbmNlOiBgRW5jb3VudGVyLyR7bWF0Y2hlc1swXX1gIH07XG4gIH1cbn1cblxuLyoqXG4gKiBXaGVuIGFuIE9ic2VydmF0aW9uIGNhcnJpZXMgbXVsdGlwbGUgcmVmZXJlbmNlUmFuZ2UgZW50cmllcyB0YWdnZWRcbiAqIHdpdGggYGFwcGxpZXNUb1sqXS5jb2RpbmcuY29kZWAgaW4ge21hbGUsIGZlbWFsZX0sIHBpY2sgdGhlIG9uZSB0aGF0XG4gKiBtYXRjaGVzIHRoZSBwYXRpZW50J3MgZ2VuZGVyIGFuZCByZS1kZXJpdmUgaW50ZXJwcmV0YXRpb24gYWdhaW5zdCBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzKFxuICBwYXRpZW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCxcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiB2b2lkIHtcbiAgaWYgKCFwYXRpZW50KSByZXR1cm47XG4gIGNvbnN0IGdlbmRlciA9IFN0cmluZyhwYXRpZW50LmdlbmRlciA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoZ2VuZGVyICE9PSBcIm1hbGVcIiAmJiBnZW5kZXIgIT09IFwiZmVtYWxlXCIpIHJldHVybjtcblxuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIk9ic2VydmF0aW9uXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHJyczogYW55W10gPSByLnJlZmVyZW5jZVJhbmdlID8/IFtdO1xuICAgIGlmIChycnMubGVuZ3RoIDwgMikgY29udGludWU7XG5cbiAgICBsZXQgbWF0Y2g6IGFueSA9IG51bGw7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBycnMpIHtcbiAgICAgIGZvciAoY29uc3QgYXAgb2YgZW50cnkuYXBwbGllc1RvID8/IFtdKSB7XG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBhcC5jb2RpbmcgPz8gW10pIHtcbiAgICAgICAgICBpZiAoU3RyaW5nKGMuY29kZSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpID09PSBnZW5kZXIpIHtcbiAgICAgICAgICAgIG1hdGNoID0gZW50cnk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaCkgYnJlYWs7XG4gICAgfVxuICAgIGlmICghbWF0Y2gpIGNvbnRpbnVlO1xuXG4gICAgci5yZWZlcmVuY2VSYW5nZSA9IFttYXRjaF07XG4gICAgY29uc3QgdmFsU3RyID1cbiAgICAgIFN0cmluZygoci52YWx1ZVF1YW50aXR5ID8/IHt9KS52YWx1ZSA/PyBcIlwiKSB8fCBTdHJpbmcoci52YWx1ZVN0cmluZyA/PyBcIlwiKTtcbiAgICBjb25zdCBuZXdJbnRlcnAgPSBkZXJpdmVJbnRlcnByZXRhdGlvbih2YWxTdHIsIHIudmFsdWVRdWFudGl0eSA/PyBudWxsLCBtYXRjaCk7XG4gICAgaWYgKG5ld0ludGVycCkge1xuICAgICAgci5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW25ld0ludGVycF0gfV07XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBQYXRpZW50IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcGF0aWVudC5weWAuIFNhbWUgcHVibGljIEFQSTpcbiAqICAgLSBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWUpIFx1MjAxNCBleHBvc2VkIGZvciB0ZXN0c1xuICogICAtIG1hcFBhdGllbnQocmF3KSBcdTIwMTQgbWFpbiBlbnRyeVxuICovXG5cbmltcG9ydCB7IGRlcml2ZVBhdGllbnRJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuXG4vLyBUYWl3YW4gbmF0aW9uYWwgSUQ6IDEgbGV0dGVyICsgOSBkaWdpdHMgKEExMjM0NTY3ODkpLiBVc2VkIHRvIGRlY2lkZVxuLy8gd2hldGhlciB0aGUgcG9wdXAtc3VwcGxpZWQgcGF0aWVudF9pZCBzaG91bGQgYmUgY29kZWQgdW5kZXIgdGhlXG4vLyBjYW5vbmljYWwgbmF0aW9uYWwtaWQgc3lzdGVtIG9yIGFzIGEgbG9jYWwgaG9zcGl0YWwgTVJOLlxuY29uc3QgVFdfTkFUSU9OQUxfSURfUkUgPSAvXltBLVpdWzEyXVxcZHs4fSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9va3NMaWtlVHdOYXRpb25hbElkKHZhbHVlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gIGlmICghdmFsdWUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIFRXX05BVElPTkFMX0lEX1JFLnRlc3QodmFsdWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUGF0aWVudChyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgcmF3SWQgPSBTdHJpbmcocmF3LmlkZW50aWZpZXIgPz8gcmF3LmlkID8/IFwidW5rbm93blwiKTtcbiAgLy8gRkhJUiBQYXRpZW50LmlkIGlzIHRoZSBoYXNoZWQvc2FsdGVkIGZvcm0uIFJlYWwgbmF0aW9uYWwgSUQgc3RheXNcbiAgLy8gb25seSBpbiBpZGVudGlmaWVyW10udmFsdWUgc28gYSBsZWFrZWQgQnVuZGxlIChvciBhIFNNQVJUIGFwcCB0b2tlblxuICAvLyBwYXlsb2FkIGNvbnRhaW5pbmcgcGF0aWVudF9pZCkgZG9lc24ndCBkaXNjbG9zZSBpdCB2aWEgZXZlcnlcbiAgLy8gc3ViamVjdC5yZWZlcmVuY2UuXG4gIGNvbnN0IHBhdGllbnRJZCA9IGRlcml2ZVBhdGllbnRJZChyYXdJZCk7XG5cbiAgLy8gVXNlIGA/P2AgKG5vdCBqdXN0IGRlZmF1bHQgYXJnKSBzbyBleHBsaWNpdCBudWxsIGZyb20gdGhlIExMTSBhbHNvXG4gIC8vIGZhbGxzIGJhY2suIExvY2FsIG1vZGVscyBzb21ldGltZXMgZW1pdCBudWxsIGluc3RlYWQgb2Ygb21pdHRpbmcuXG4gIC8vIFRoZSBjYWxsZXIgZGVjaWRlcyB3aGV0aGVyIGByYXcubmFtZWAgaXMgdGhlIHVzZXIncyByZWFsIG5hbWUgb3JcbiAgLy8gYWxyZWFkeS1tYXNrZWQgXHUyMDE0IG1hcFBhdGllbnQganVzdCB0cmFuc2NyaWJlcy4gTWFza2luZyBwb2xpY3kgbGl2ZXNcbiAgLy8gYXQgdGhlIFVJIC8gZXh0ZW5zaW9uIGxheWVyIChkcml2ZW4gYnkgdGhlIHVzZXItdG9nZ2xlYWJsZVxuICAvLyBgbWFza05hbWVFbmFibGVkYCBzZXR0aW5nKSBzbyB0aGUgc2FtZSBtYXBwZXIgaXMgY29ycmVjdCBmb3IgYm90aFxuICAvLyBcIlx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOCA9IHJlYWwgbmFtZVwiIGFuZCBcIlx1OTFBQlx1NzY0Mlx1NEVCQVx1NTRFMVx1NTkxQVx1NzVDNVx1NEVCQSA9IG1hc2tlZFwiIHdvcmtmbG93cy5cbiAgY29uc3QgbmFtZVRleHQgPSAocmF3Lm5hbWUgPz8gbnVsbCkgfHwgXCJVbmtub3duXCI7XG4gIGNvbnN0IHBob25lID0gKHJhdy5waG9uZSA/PyBudWxsKSB8fCBcIlwiO1xuICBjb25zdCBhZGRyZXNzID0gKHJhdy5hZGRyZXNzID8/IG51bGwpIHx8IFwiXCI7XG5cbiAgY29uc3QgW2ZhbWlseSwgZ2l2ZW5dID0gc3BsaXROYW1lKG5hbWVUZXh0KTtcbiAgY29uc3QgbmFtZUVudHJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyB1c2U6IFwib2ZmaWNpYWxcIiwgdGV4dDogbmFtZVRleHQgfTtcbiAgaWYgKGZhbWlseSkgbmFtZUVudHJ5LmZhbWlseSA9IGZhbWlseTtcbiAgaWYgKGdpdmVuLmxlbmd0aCA+IDApIG5hbWVFbnRyeS5naXZlbiA9IGdpdmVuO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJQYXRpZW50XCIsXG4gICAgaWQ6IHBhdGllbnRJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgaWRlbnRpZmllcjogW1xuICAgICAge1xuICAgICAgICB1c2U6IFwib2ZmaWNpYWxcIixcbiAgICAgICAgc3lzdGVtOiBsb29rc0xpa2VUd05hdGlvbmFsSWQocmF3SWQpXG4gICAgICAgICAgPyBzeXN0ZW1zLlRXX05BVElPTkFMX0lEXG4gICAgICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9QQVRJRU5UX01STixcbiAgICAgICAgdmFsdWU6IHJhd0lkLFxuICAgICAgfSxcbiAgICBdLFxuICAgIG5hbWU6IFtuYW1lRW50cnldLFxuICAgIGdlbmRlcjogbWFwR2VuZGVyKHJhdy5nZW5kZXIpLFxuICB9O1xuXG4gIGNvbnN0IGJpcnRoRGF0ZSA9IHJhdy5iaXJ0aERhdGU7XG4gIGlmIChiaXJ0aERhdGUpIHJlc291cmNlLmJpcnRoRGF0ZSA9IGJpcnRoRGF0ZTtcblxuICBpZiAocGhvbmUpIHtcbiAgICByZXNvdXJjZS50ZWxlY29tID0gW3sgc3lzdGVtOiBcInBob25lXCIsIHVzZTogXCJob21lXCIsIHZhbHVlOiBwaG9uZSB9XTtcbiAgfVxuXG4gIGlmIChhZGRyZXNzKSB7XG4gICAgcmVzb3VyY2UuYWRkcmVzcyA9IFt7IHVzZTogXCJob21lXCIsIHRleHQ6IGFkZHJlc3MgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8qKlxuICogU3BsaXQgYSBmdWxsIG5hbWUgaW50byBbZmFtaWx5LCBbZ2l2ZW5dXSBmb3IgRkhJUiBQYXRpZW50Lm5hbWUuXG4gKlxuICogSGV1cmlzdGljczpcbiAqICAgLSBDb250YWlucyB3aGl0ZXNwYWNlIFx1MjE5MiBXZXN0ZXJuOiBsYXN0IHRva2VuID0gZmFtaWx5LCByZXN0ID0gZ2l2ZW4uXG4gKiAgIC0gQ0pLIC8gc2luZ2xlLXRva2VuIFx1MjE5MiBmaXJzdCBjaGFyID0gZmFtaWx5LCByZW1haW5kZXIgPSBnaXZlbi5cbiAqICAgLSBcIlVua25vd25cIiBvciBlbXB0eSBcdTIxOTIgW1wiXCIsIFtdXVxuICpcbiAqIFR3by1jaGFyIENKSyBmYW1pbHkgbmFtZXMgKFx1NkI1MFx1OTY3RCwgXHU1M0Y4XHU5OUFDLCBcdTIwMjYpIGFyZSBOT1QgYXV0by1kZXRlY3RlZC5cbiAqL1xuZnVuY3Rpb24gc3BsaXROYW1lKGZ1bGxOYW1lOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmdbXV0ge1xuICBjb25zdCBuYW1lID0gKGZ1bGxOYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFuYW1lIHx8IG5hbWUgPT09IFwiVW5rbm93blwiKSByZXR1cm4gW1wiXCIsIFtdXTtcbiAgaWYgKC9cXHMvLnRlc3QobmFtZSkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IG5hbWUuc3BsaXQoL1xccysvKTtcbiAgICByZXR1cm4gW3BhcnRzW3BhcnRzLmxlbmd0aCAtIDFdISwgcGFydHMuc2xpY2UoMCwgLTEpXTtcbiAgfVxuICAvLyBDSksgZmFsbGJhY2sgXHUyMDE0IGl0ZXJhdGUgY29kZXBvaW50cywgbm90IFVURi0xNiBjb2RlIHVuaXRzLCBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIChyYXJlIGluIENoaW5lc2UgbmFtZXMgYnV0IHBvc3NpYmxlKVxuICAvLyBkb24ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY29kZXBvaW50cyA9IEFycmF5LmZyb20obmFtZSk7XG4gIHJldHVybiBjb2RlcG9pbnRzLmxlbmd0aCA+IDEgPyBbY29kZXBvaW50c1swXSEsIFtjb2RlcG9pbnRzLnNsaWNlKDEpLmpvaW4oXCJcIildXSA6IFtuYW1lLCBbXV07XG59XG5cbmZ1bmN0aW9uIG1hcEdlbmRlcihnZW5kZXI6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBnID0gdHlwZW9mIGdlbmRlciA9PT0gXCJzdHJpbmdcIiA/IGdlbmRlci50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKFtcIm1hbGVcIiwgXCJtXCIsIFwiXHU3NTM3XCIsIFwiXHU3NTM3XHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJtYWxlXCI7XG4gIGlmIChbXCJmZW1hbGVcIiwgXCJmXCIsIFwiXHU1OTczXCIsIFwiXHU1OTczXHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJmZW1hbGVcIjtcbiAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuIiwgIi8vIE5ISSBKU09OIFx1MjE5MiBub3JtYWxpemVkIHNoYXBlIGFkYXB0ZXJzLlxuLy9cbi8vIEV4dHJhY3RlZCBmcm9tIGJhY2tncm91bmQuanMgc28gZWFjaCBhZGFwdGVyIGNhbiBiZSB1bml0LXRlc3RlZCBpblxuLy8gaXNvbGF0aW9uLiBiYWNrZ3JvdW5kLmpzIGltcG9ydHMgZXZlcnl0aGluZyBiZWxvdzsgdGhlIGxpdmUgU1cgZ2x1ZXNcbi8vIHRoZXNlIG9udG8gZmV0Y2hlZCBwYXlsb2FkcyB2aWEgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5LlxuLy9cbi8vIFdoeSBleHRyYWN0OiB0aGUgdjAuNi4xIGxhYitpbWFnaW5nIGRhdGUtZmllbGQgYnVncyAoY29tbWl0cyBiMzc4ODVmIC9cbi8vIDhjMTk5MDEpIHNoaXBwZWQgYmVjYXVzZSB0aGVzZSBmdW5jdGlvbnMgaGFkIFpFUk8gdGVzdCBjb3ZlcmFnZSBcdTIwMTRcbi8vIGJhY2tncm91bmQuanMgY2FuJ3QgYmUgbG9hZGVkIGluIGEgdGVzdCBlbnZpcm9ubWVudCAoY2hyb21lLiogQVBJcyxcbi8vIFNXIGdsb2JhbHMpLCBzbyB0aGUgYWRhcHQqIGxvZ2ljIHJvZGUgYWxvbmcgdW50ZXN0ZWQuIFB1bGxpbmcgdGhlbVxuLy8gaW50byBhIHB1cmUtZnVuY3Rpb24gbW9kdWxlIGxldHMgdml0ZXN0IHZlcmlmeSBmaWVsZC1wcmlvcml0eVxuLy8gZGVjaXNpb25zIHJvdy1ieS1yb3cuXG5cbi8vIENvbnZlcnQgTkhJJ3MgXHU2QzExXHU1NzBCIGRhdGUgXCIxMTUvMDUvMDVcIiBcdTIxOTIgSVNPIFwiMjAyNi0wNS0wNVwiLlxuLy8gU29tZSBOSEkgZmllbGRzIGVtYmVkIGJvdGggUk9DIGFuZCBHcmVnb3JpYW46IFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHdlXG4vLyBqdXN0IG1hdGNoIHRoZSBmaXJzdCBzZWdtZW50LlxuZXhwb3J0IGZ1bmN0aW9uIHJvY1RvSVNPKHJvY0RhdGUpIHtcbiAgaWYgKCFyb2NEYXRlKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgbSA9IFN0cmluZyhyb2NEYXRlKS5tYXRjaCgvXihcXGR7MiwzfSlbLy4tXShcXGR7MSwyfSlbLy4tXShcXGR7MSwyfSkvKTtcbiAgaWYgKCFtKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeSA9IHBhcnNlSW50KG1bMV0sIDEwKSArIDE5MTE7XG4gIHJldHVybiBgJHt5fS0ke21bMl0ucGFkU3RhcnQoMiwgXCIwXCIpfS0ke21bM10ucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG59XG5cbi8vIEludmVyc2U6IElTTyBcIjIwMjMtMDUtMDVcIiBcdTIxOTIgUk9DIFwiMTEyLzA1LzA1XCIuIFVzZWQgdG8gYnVpbGQgTkhJIGRhdGUtcmFuZ2Vcbi8vIHF1ZXJ5IHN0cmluZ3MgKHRoZWlyIGZvcm1zIGV4cGVjdCBcdTZDMTFcdTU3MEIgZm9ybWF0KS5cbmV4cG9ydCBmdW5jdGlvbiBpc29Ub1JPQyhpc29EYXRlKSB7XG4gIGlmICghaXNvRGF0ZSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IG0gPSBTdHJpbmcoaXNvRGF0ZSkubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSkvKTtcbiAgaWYgKCFtKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeSA9IHBhcnNlSW50KG1bMV0sIDEwKSAtIDE5MTE7XG4gIGlmICh5IDwgMSkgcmV0dXJuIFwiXCI7IC8vIHByZS1cdTZDMTFcdTU3MEIgZGF0ZXMgbWFrZSBubyBzZW5zZSB0byBOSElcbiAgcmV0dXJuIGAke3l9LyR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LyR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gTkhJIGJpbGluZ3VhbCBmaWVsZHMgdXNlIFwiXHU0RTJEXHU2NTg3fHxFbmdsaXNoXCIgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZhc3Rlcixcbi8vIHNvIHByZWZlciB0aGF0IHNpZGUuIElmIHRoZXJlJ3Mgbm8gYHx8YCB3ZSBqdXN0IHJldHVybiB0aGUgaW5wdXQgdHJpbW1lZC5cbmV4cG9ydCBmdW5jdGlvbiBwaWNrRW5nbGlzaChzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHN0ciA9IFN0cmluZyhzKTtcbiAgY29uc3QgaWR4ID0gc3RyLmluZGV4T2YoXCJ8fFwiKTtcbiAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBzdHIudHJpbSgpO1xuICBjb25zdCBlbiA9IHN0ci5zbGljZShpZHggKyAyKS50cmltKCk7XG4gIHJldHVybiBlbiB8fCBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG59XG5cbi8vIFN0cmlwIHRyYWlsaW5nIHB1bmN0dWF0aW9uIC8gd2hpdGVzcGFjZSBqdW5rIHRoYXQgc29tZSBob3NwaXRhbHMgbGVhdmVcbi8vIG9uIHRoZWlyIGZyZWUtdGV4dCBsYWIgbGFiZWxzIChlLmcuIE5ISSByZXR1cm5zIFwiQ3JlYSxcIiBmcm9tIG9uZSBzaXRlXG4vLyBhbmQgXCJDcmVhXCIgZnJvbSBhbm90aGVyIGZvciB0aGUgc2FtZSBwaHlzaWNhbCB0ZXN0KS4gUHJlLW5vcm1hbGl6aW5nXG4vLyBoZXJlIG1lYW5zIHRoZSBPYnNlcnZhdGlvbi5jb2RlLnRleHQgZG93bnN0cmVhbSByZWFkcyBjbGVhbmx5IGV2ZW5cbi8vIHdoZW4gZG93bnN0cmVhbSBVSXMgc3RpbGwgaGFwcGVuIHRvIHJlbmRlciBgY29kZS50ZXh0YCBpbnN0ZWFkIG9mXG4vLyBwdWxsaW5nIGRpc3BsYXkgZnJvbSB0aGUgTE9JTkMgLyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIGNvZGluZy5cbmZ1bmN0aW9uIF9jbGVhbkxhYk5hbWUocykge1xuICBpZiAocyA9PT0gbnVsbCB8fCBzID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICByZXR1cm4gU3RyaW5nKHMpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9bLFx1RkYwQztcdUZGMUJdK1xccyokLywgXCJcIikgIC8vIHRyYWlsaW5nIFx1NTM0QVx1NUY2MiAvIFx1NTE2OFx1NUY2MiBwdW5jdHVhdGlvblxuICAgIC50cmltKCk7XG59XG5cbi8vIEFkYXB0ZXIgZm9yIE5ISSBsYWIvb2JzZXJ2YXRpb24gSlNPTiBzaGFwZSAoY29uZmlybWVkIGZvciBJSEtFMzQwOVMwMTtcbi8vIG90aGVyIGxhYiBlbmRwb2ludHMgbGlrZWx5IHVzZSB0aGUgc2FtZSBmaWVsZHMpLlxuLy9cbi8vIERhdGUgZmllbGQgY2hvaWNlIFx1MjAxNCBJSEtFMzQwOSByZXR1cm5zIHRocmVlIGRhdGUtaXNoIGZpZWxkcyBwZXIgcm93OlxuLy8gICAtIGZ1bkNfREFURSAgICAgICAgICBcdTVDMzFcdThBM0FcdTY1RTUgLyBcdTUxNjVcdTk2NjJcdTY1RTUgKHZpc2l0IHJlZ2lzdHJhdGlvbiAvIGFkbWlzc2lvbilcbi8vICAgLSByZWFMX0lOU1BFQ1RfREFURSAgXHU1QkU2XHU5NjlCXHU2M0ExXHU2QUEyXHU2NUU1IChhY3R1YWwgc2FtcGxlLWNvbGxlY3Rpb24gZGF0ZSlcbi8vICAgLSBhc3NhWV9VUExPQURfREFURSAgXHU0RTBBXHU1MEIzXHU2NUU1ICh3aGVuIHRoZSByZXN1bHQgaGl0IE5ISSdzIHNlcnZlcilcbi8vIEZvciBhbiBpbnBhdGllbnQsIGZ1bkNfREFURSBpcyB0aGUgYWRtaXNzaW9uIGRheSBhbmQgZXZlcnkgbGFiIGRyYXduXG4vLyBkdXJpbmcgdGhlIHN0YXkgY2FycmllcyB0aGUgc2FtZSBmdW5DX0RBVEUgXHUyMDE0IHVzaW5nIGl0IGFzIE9ic2VydmF0aW9uLlxuLy8gZWZmZWN0aXZlRGF0ZVRpbWUgbWFkZSBhbGwgXHU0RjRGXHU5NjYyXHU2NzFGXHU5NTkzIGxhYnMgbG9vayBsaWtlIHRoZXkgd2VyZSBkcmF3blxuLy8gb24gZGF5IDEuIEZISVIncyBcInBoeXNpb2xvZ2ljYWxseSByZWxldmFudCB0aW1lXCIgZm9yIGEgbGFiIE9ic2VydmF0aW9uXG4vLyBpcyB0aGUgc2FtcGxlLWNvbGxlY3Rpb24gZGF0ZSwgc28gcHJlZmVyIHJlYUxfSU5TUEVDVF9EQVRFIHdoZW4gTkhJXG4vLyByZXR1cm5zIGl0OyBmYWxsIGJhY2sgdG8gZnVuQ19EQVRFIG9ubHkgd2hlbiB0aGUgaW5zcGVjdCBmaWVsZCBpc1xuLy8gbWlzc2luZyAob2xkZXIgcm93cyAvIGVuZHBvaW50cyB0aGF0IGRvbid0IGNhcnJ5IGl0KS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdExhYkl0ZW0oaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oXG4gICAgaXRlbS5yZWFMX0lOU1BFQ1RfREFURSB8fCBpdGVtLnJlYWxfaW5zcGVjdF9kYXRlIHx8IGl0ZW0uZnVuQ19EQVRFLFxuICApO1xuICBjb25zdCB2YWx1ZSA9IGl0ZW0uYXNzYVlfVkFMVUU7XG4gIGlmICghZGF0ZSB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgLy8gRGlzcGxheSBuYW1lIGZhbGxiYWNrIGNoYWluIChhbGwgbm9ybWFsaXplZCBmb3IgdHJhaWxpbmcgcHVuY3R1YXRpb24pOlxuICAvLyAgIDEuIGFzc2FZX0lURU1fTkFNRSBcdTIwMTQgaG9zcGl0YWwncyBmdWxsIGZyZWUtdGV4dCBsYWJlbFxuICAvLyAgIDIuIG9yZGVyX3Nob3J0bmFtZSBcdTIwMTQgTkhJJ3MgVUktdHJ1bmNhdGVkIGxhYmVsIChvZnRlbiBlbmRzIFwiLi4uXCIpXG4gIC8vICAgMy4gb3JkZVJfTkFNRSAgICAgIFx1MjAxNCBOSEkncyBjYW5vbmljYWwgXHU5MUFCXHU0RUU0XHU3OEJDIGRpY3Rpb25hcnkgbmFtZVxuICAvLyBhc3NhWV9JVEVNX05BTUUgd2lucyBieSBkZWZhdWx0IGJlY2F1c2Ugb3JkZXJfc2hvcnRuYW1lIGNhbiBiZSBjdXRcbiAgLy8gb2ZmIG1pZC13b3JkIChcIlBDIFN1Z2FyIFx1OThFRlx1NUY4QyAuLi5cIiksIHdoaWNoIGlzIHdvcnNlIHRoYW4gYSB0cmFpbGluZy1cbiAgLy8gY29tbWEgY29zbWV0aWMgaXNzdWUuIG9yZGVSX05BTUUgaXMgdGhlIGxhc3QtcmVzb3J0IENoaW5lc2UgZm9ybWFsXG4gIC8vIGxhYmVsLlxuICBjb25zdCBmdWxsTmFtZSA9IF9jbGVhbkxhYk5hbWUoaXRlbS5hc3NhWV9JVEVNX05BTUUpXG4gICAgICAgICAgICAgICAgfHwgX2NsZWFuTGFiTmFtZShpdGVtLm9yZGVyX3Nob3J0bmFtZSlcbiAgICAgICAgICAgICAgICB8fCBfY2xlYW5MYWJOYW1lKGl0ZW0ub3JkZVJfTkFNRSk7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IFN0cmluZyhpdGVtLm9yZGVSX0NPREUgfHwgXCJcIikudHJpbSgpO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgb3JkZXJfY29kZTogb3JkZXJDb2RlLFxuICAgIG9yZGVyX25hbWU6IGl0ZW0ub3JkZVJfTkFNRSB8fCBcIlwiLFxuICAgIC8vIFByZWZlciB0aGUgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyAoXCIwOTE0MENcIikgYXMgdGhlIEZISVIgY29kaW5nIGNvZGUgc28gdGhlXG4gICAgLy8gZG93bnN0cmVhbSBvYnNlcnZhdGlvbiBtYXBwZXIgcm91dGVzIGl0IHVuZGVyIE5ISV9NRURJQ0FMX09SREVSX1xuICAgIC8vIENPREUgc3lzdGVtLiBTTUFSVCBhcHBzIGdyb3VwIGxhYiB0ZXN0cyBieSBjb2RpbmcgY29kZTsgdXNpbmdcbiAgICAvLyBmcmVlLXRleHQgaGVyZSBpcyB3aGF0IGNhdXNlcyBcIkNyZWFcIiBhbmQgXCJDcmVhLFwiIHRvIGJlIHNwbGl0XG4gICAgLy8gaW50byB0d28gZGlzdGluY3QgdGVzdHMuIEZhbGxiYWNrIHRvIHRoZSBjbGVhbmVkIGRpc3BsYXkgd2hlblxuICAgIC8vIE5ISSBkb2Vzbid0IHN1cHBseSBhbiBvcmRlciBjb2RlIChvbGRlciAvIGVkZ2UtY2FzZSByb3dzKS5cbiAgICBjb2RlOiBvcmRlckNvZGUgfHwgZnVsbE5hbWUsXG4gICAgZGlzcGxheTogZnVsbE5hbWUsXG4gICAgdmFsdWU6IFN0cmluZyh2YWx1ZSksXG4gICAgdW5pdDogaXRlbS51bmlUX0RBVEEgfHwgXCJcIixcbiAgICByZWZlcmVuY2VfcmFuZ2U6IGl0ZW0uY29uc3VsVF9WQUxVRSB8fCBpdGVtLnNob3J0X0NPTlNVTFRfVkFMVUUgfHwgXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDZTMDEgcmV0dXJucyB2aXNpdC1sZXZlbCByb3dzIE9OTFkgKG5vIGRydWcgbmFtZXMpLiBUaGUgYWN0dWFsIGRydWdcbi8vIGxpc3QgbGl2ZXMgYXQgSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiwgaW5cbi8vIGBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0YC4gV2UgZG8gdGhhdCAyLXN0ZXBcbi8vIGZldGNoIHNlcGFyYXRlbHk7IHRoaXMgZnVuY3Rpb24gYWRhcHRzIGEgc2luZ2xlIGRydWcgZW50cnkgZ2l2ZW4gaXRzXG4vLyBwYXJlbnQgdmlzaXQgY29udGV4dC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsKGRydWcsIHZpc2l0KSB7XG4gIGlmICghZHJ1ZyB8fCB0eXBlb2YgZHJ1ZyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIC8vIHZpc2l0LmZ1bmNfREFURSBpcyBcIjExNS8wNS8wNXx8MjAyNi8wNS8wNVwiIFx1MjAxNCByb2NUb0lTTyBtYXRjaGVzIHRoZSBST0NcbiAgLy8gcHJlZml4IGNvcnJlY3RseS5cbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKHZpc2l0Py5mdW5jX0RBVEUgfHwgdmlzaXQ/LmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgY29uc3QgZHJ1Z19uYW1lID0gcGlja0VuZ2xpc2goZHJ1Zy5kcnVnX25hbWUgfHwgZHJ1Zy5kcnVHX05BTUUgfHwgXCJcIik7XG4gIGlmICghZGF0ZSB8fCAhZHJ1Z19uYW1lKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF5cyA9IE51bWJlcihkcnVnLm9yZGVyX2RydWdfZGF5IHx8IGRydWcub3JkZXJfRFJVR19EQVkgfHwgMCk7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBkcnVnX25hbWUsXG4gICAgY29kZTogZHJ1Zy5vcmRlcl9jb2RlIHx8IGRydWcub3JkZVJfQ09ERSB8fCBcIlwiLFxuICAgIC8vIExpc3QgZW5kcG9pbnQgZG9lc24ndCBleHBvc2UgZG9zZS9mcmVxdWVuY3kvcm91dGUgXHUyMDE0IG9ubHkgZGF5cyArIHF0eS5cbiAgICBkb3NlOiBcIlwiLFxuICAgIGZyZXF1ZW5jeTogXCJcIixcbiAgICByb3V0ZTogXCJcIixcbiAgICBxdWFudGl0eTogZHJ1Zy5vcmRlcl9xdHkgfHwgZHJ1Zy5vcmRlcl9RVFkgfHwgXCJcIixcbiAgICBkdXJhdGlvbl9kYXlzOiBOdW1iZXIuaXNGaW5pdGUoZGF5cykgPyBkYXlzIDogMCxcbiAgICAvLyBwaWNrRW5nbGlzaCBvbiBpY2RfbmFtZSB0dXJucyBcdTgyNkZcdTYwMjdcdTY1MURcdThCNzdcdTgxN0EuLi58fEJlbmlnbiBwcm9zdGF0aWMuLi4gaW50byB0aGUgRU4gc2lkZS5cbiAgICBpbmRpY2F0aW9uOiBwaWNrRW5nbGlzaCh2aXNpdD8uaWNkOWNtX0NPREVfQ05BTUUgfHwgdmlzaXQ/LmljZDljbV9uYW1lIHx8IFwiXCIpLFxuICAgIGluZGljYXRpb25fY29kZTogdmlzaXQ/LmljZDljbV9DT0RFIHx8IHZpc2l0Py5pY2Q5Y21fY29kZSB8fCBcIlwiLFxuICAgIGRydWdfY2xhc3M6IHBpY2tFbmdsaXNoKGRydWcuYWN0IHx8IFwiXCIpLFxuICAgIGhvc3BpdGFsOiB2aXNpdD8uaG9zcF9BQkJSIHx8IHZpc2l0Py5ob3NwX2FiYnIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gU3R1YiBrZXB0IGZvciB0aGUgZW5kcG9pbnQgcmVnaXN0cnkgXHUyMDE0IElIS0UzMzA2UzAxIGxpc3QgbmV2ZXIgaGFzIGRydWdzLFxuLy8gc28gd2UgYWx3YXlzIHJldHVybiBudWxsIGFuZCByZWx5IG9uIHRoZSAyLXN0ZXAgZGV0YWlsIGZldGNoIGFib3ZlLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbigpIHsgcmV0dXJuIG51bGw7IH1cblxuLy8gU2FtZSBzaGFwZSBhcyBhZGFwdE1lZGljYXRpb246IElIS0UzNDA4UzAxIChpbWFnaW5nIGxpc3QpIG9ubHkgY2Fycmllc1xuLy8gb3JkZXItbGV2ZWwgZGF0YTsgdGhlIGFjdHVhbCByZXBvcnQgbmFycmF0aXZlIGNvbWVzIGZyb20gdGhlIElIS0UzNDA4UzAyXG4vLyBkZXRhaWwgZmFuLW91dCAoc2VlIGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwpLiBSZXR1cm5pbmcgbnVsbCBmcm9tXG4vLyB0aGUgbGlzdCBhZGFwdGVyIGVuc3VyZXMgbm8gaGFsZi1mb3JtZWQgRGlhZ25vc3RpY1JlcG9ydHMgbGVhayB0aHJvdWdoLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0SW1hZ2luZ0xpc3RTdHViKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBJSEtFMzIwOVMwMSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KSBcdTIwMTQgTkhJJ3Mgb2ZmaWNpYWxseS12ZXR0ZWQgY2F0YXN0cm9waGljLWlsbG5lc3Ncbi8vIHJlZ2lzdHJ5LiBFYWNoIHJvdyBpcyBhIHNlcmlvdXMgY2hyb25pYyBjb25kaXRpb24gKGNhbmNlciwgYXV0b2ltbXVuZSxcbi8vIHRyYW5zcGxhbnQgZm9sbG93LXVwLCBkaWFseXNpcywgZXRjLikgdGhlIHBhdGllbnQgaXMgY3VycmVudGx5XG4vLyByZWdpc3RlcmVkIGZvci4gVGhpcyBpcyB0aGUgY2xvc2VzdCB0aGluZyBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZXhwb3NlcyB0byBhXG4vLyBjdXJhdGVkIHByb2JsZW0gbGlzdCBcdTIwMTQgZmFyIHN0cm9uZ2VyIHNpZ25hbCB0aGFuIHJldmVyc2UtZW5naW5lZXJpbmdcbi8vIGNocm9uaWMgY29uZGl0aW9ucyBmcm9tIGVuY291bnRlciBJQ0RzLlxuLy9cbi8vIE1hcHMgdG8gRkhJUiBDb25kaXRpb24gd2l0aCBjYXRlZ29yeT1wcm9ibGVtLWxpc3QtaXRlbSBzbyBkb3duc3RyZWFtXG4vLyBTTUFSVCBhcHBzIC8gSVBTIHByb2ZpbGVzIHN1cmZhY2UgaXQgaW4gdGhlaXIgcHJvYmxlbS1saXN0IHZpZXcuXG4vL1xuLy8gUGF5bG9hZCBzaGFwZSAobGl2ZSBjYXB0dXJlKTpcbi8vICAgc1BfSUhLRTMyMDlTMDE6IFtcbi8vICAgICB7IGhvc1BfSUQsIGhvc1BfQUJCUiwgaG9zUF9VUkwsXG4vLyAgICAgICBpY0QxMENNX0NOQU1FOiBcIlx1NjUxRFx1OEI3N1x1ODE3QVx1NjBFMVx1NjAyN1x1ODE2Qlx1NzYyNFwiLCAgXHUyMTkwIENoaW5lc2UgbmFycmF0aXZlIG9ubHlcbi8vICAgICAgIHZhbGlEX1NfREFURTogIFwiMTExLzExLzE2XCIsICAgICAgIFx1MjE5MCBjZXJ0aWZpY2F0aW9uIHZhbGlkLWZyb20gKFJPQylcbi8vICAgICAgIHZhbGlEX0VfREFURTogIFwiMTE2LzExLzE1XCIgfSAgICAgIFx1MjE5MCBjZXJ0aWZpY2F0aW9uIHZhbGlkLXVudGlsIChST0MsIH41eSlcbi8vICAgXVxuLy9cbi8vIENhdmVhdHMgZGVsaWJlcmF0ZWx5IGVuY29kZWQ6XG4vLyAgIC0gTkhJIGRvZXNuJ3QgcmV0dXJuIHRoZSBJQ0QtMTAtQ00gY29kZSBpbiB0aGlzIGVuZHBvaW50LCBvbmx5IHRoZVxuLy8gICAgIENoaW5lc2UgbGFiZWwuIFdlIGxlYXZlIGBjb2RlYCBlbXB0eTsgbWFwQ29uZGl0aW9uIGZhbGxzIGJhY2sgdG9cbi8vICAgICBkaXNwbGF5LWFzLWlkIGZvciBzdGFibGVJZCAobWlycm9yaW5nIGRpYWdub3N0aWMtcmVwb3J0LnRzKS5cbi8vICAgLSB2YWxpRF9FX0RBVEUgaXMgd2hlbiB0aGUgQ0FSRCBleHBpcmVzIChyZW5ld2VkIGV2ZXJ5IH41eSksIE5PVFxuLy8gICAgIHdoZW4gdGhlIGRpc2Vhc2UgcmVzb2x2ZWQuIFdlIGRlbGliZXJhdGVseSBkbyBOT1QgbWFwIGl0IHRvXG4vLyAgICAgYWJhdGVtZW50RGF0ZVRpbWUgXHUyMDE0IHRoYXQgd291bGQgZmFsc2VseSBpbXBseSB0aGUgY29uZGl0aW9uIHN0b3BwZWQuXG4vLyAgIC0gQWxsIHJvd3MgaGVyZSBhcmUgY3VycmVudGx5IGFjdGl2ZSBieSBkZWZpbml0aW9uOyBOSEkgb25seSByZXR1cm5zXG4vLyAgICAgdmFsaWQgY2VydGlmaWNhdGlvbnMuIGNsaW5pY2FsX3N0YXR1cyBoYXJkLWNvZGVkIHRvIFwiYWN0aXZlXCIuXG4vLyAgIC0gc2V2ZXJpdHkgc3RvcmVkIGFzIHRleHQgKFwiU2V2ZXJlIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpXCIpIGJlY2F1c2UgdGhlIGZvcm1hbFxuLy8gICAgIHNldmVyaXR5IGNvZGUgbWFwcGluZyAoU05PTUVEIDI0NDg0MDAwIGV0Yy4pIG5lZWRzIG1vcmUgdGhvdWdodC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdENhdGFzdHJvcGhpY0lsbG5lc3MoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkaXNwbGF5ID0gcGlja0VuZ2xpc2goaXRlbS5pY0QxMENNX0NOQU1FIHx8IGl0ZW0uaWNkMTBjbV9jbmFtZSB8fCBcIlwiKTtcbiAgaWYgKCFkaXNwbGF5KSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkaXNwbGF5LFxuICAgIGNvZGU6IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIG9uc2V0X2RhdGU6IHJvY1RvSVNPKGl0ZW0udmFsaURfU19EQVRFIHx8IGl0ZW0udmFsaWRfc19kYXRlIHx8IFwiXCIpLFxuICAgIHJlY29yZGVkX2RhdGU6IHJvY1RvSVNPKGl0ZW0udmFsaURfU19EQVRFIHx8IGl0ZW0udmFsaWRfc19kYXRlIHx8IFwiXCIpLFxuICAgIGNhdGVnb3J5OiBcInByb2JsZW0tbGlzdC1pdGVtXCIsXG4gICAgc2V2ZXJpdHk6IFwiU2V2ZXJlIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgY2xpbmljYWxfc3RhdHVzOiBcImFjdGl2ZVwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzQwMlMwMSAoXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1XHU3RDUwXHU2NzlDKSBcdTIwMTQgb25lIHJvdyBwZXIgc2NyZWVuaW5nIGV2ZW50LCBmbGF0XG4vLyBzY2hlbWEuIE5ISSBydW5zIHRoZSBwYW5lbCBpdHNlbGYgYW5kIHJldHVybnMgdml0YWxzICsgYSBmaXhlZFxuLy8gYmF0dGVyeSBvZiBsYWIgdmFsdWVzIHByZS1jb21wdXRlZCAoQk1JIC8gd2Fpc3QgLyBCUCAvIGxpcGlkcyAvIExGVFxuLy8gLyBSRlQgLyBmYXN0aW5nIGdsdWNvc2UgLyBIQnNBZyAvIEFudGktSENWIC8gdXJpYyBhY2lkIFx1MjAyNikuXG4vLyBXZSB1bmZvbGQgb25lIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbnM6IHZpdGFscyBnbyB0byBjYXRlZ29yeVxuLy8gdml0YWwtc2lnbnMgKHNvIFNNQVJUIGFwcHMnIHZpdGFscyB2aWV3cyBwaWNrIHRoZW0gdXApLCBsYWJzIGdvIHRvXG4vLyBjYXRlZ29yeSBsYWJvcmF0b3J5LiBSZXR1cm5zIGFuIEFSUkFZIFx1MjAxNCBjYWxsZXIgbXVzdCBmbGF0LW1hcC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEFkdWx0UHJldmVudGl2ZShyb3cpIHtcbiAgaWYgKCFyb3cgfHwgdHlwZW9mIHJvdyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhyb3cuZmlyc1RfRElBR19EQVRFIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUpIHJldHVybiBudWxsO1xuICBjb25zdCBob3NwaXRhbCA9IHJvdy5ob3NQX0FCQlIgfHwgcm93Lmhvc3BfQUJCUiB8fCBcIlwiO1xuICBjb25zdCBvdXQgPSBbXTtcbiAgLy8gKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIE5ISSBjb2RlKVxuICBmdW5jdGlvbiBwdXNoKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIGNvZGUpIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGNvbnN0IHYgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgICAvLyBFbS1kYXNoIFwiXHUyMDE0XCIgKFUrMjAxNCkgaXMgTkhJJ3Mgc2VudGluZWwgXCJubyBkYXRhXCIgbWFya2VyIFx1MjAxNCBkcm9wLlxuICAgIC8vIFBsYWluIGh5cGhlbiBcIi1cIiBpcyBOT1QgYSBuby1kYXRhIG1hcmtlciBwZXItZmllbGQgXHUyMDE0IGl0J3MgdGhlXG4gICAgLy8gY2xpbmljYWwgZGlwc3RpY2sgY29udmVudGlvbiBmb3IgXCJuZWdhdGl2ZVwiIChVcmluZSBQcm90ZWluLFxuICAgIC8vIFVyaW5lIFVBIGRpcHN0aWNrKS4gTkhJJ3Mgbm8tZGF0YSBmbGFnIGZvciBhbiBlbnRpcmUgcm93IGlzXG4gICAgLy8gc2lnbmFsbGVkIGJ5IGZpcnNUX0RJQUdfREFURSA9IFwiLVwiIHdoaWNoIHRoZSByb3ctbGV2ZWwgZGF0ZVxuICAgIC8vIGd1YXJkIGF0IHRoZSB0b3Agb2YgYWRhcHRBZHVsdFByZXZlbnRpdmUgYWxyZWFkeSByZWplY3RzLCBzb1xuICAgIC8vIFwiLVwiIHJlYWNoaW5nIHB1c2goKSBhbHdheXMgbWVhbnMgXCJ0aGUgY2xpbmljaWFuIHdyb3RlIGl0IGRvd25cbiAgICAvLyBhcyBhIG5lZ2F0aXZlIHJlc3VsdFwiLiBLZWVwLlxuICAgIGlmICh2ID09PSBcIlwiIHx8IHYgPT09IFwiXHUyMDE0XCIpIHJldHVybjtcbiAgICBvdXQucHVzaCh7XG4gICAgICBkYXRlLFxuICAgICAgaG9zcGl0YWwsXG4gICAgICBjYXRlZ29yeTogY2F0ZWdvcnkgfHwgXCJsYWJvcmF0b3J5XCIsXG4gICAgICBvcmRlcl9jb2RlOiBjb2RlIHx8IFwiXCIsXG4gICAgICBvcmRlcl9uYW1lOiBkaXNwbGF5LFxuICAgICAgY29kZTogY29kZSB8fCBkaXNwbGF5LFxuICAgICAgZGlzcGxheSxcbiAgICAgIHZhbHVlOiB2LFxuICAgICAgdW5pdDogdW5pdCB8fCBcIlwiLFxuICAgICAgcmVmZXJlbmNlX3JhbmdlOiByZWZSYW5nZSB8fCBcIlwiLFxuICAgIH0pO1xuICB9XG4gIC8vIFZpdGFsIHNpZ25zXG4gIHB1c2goXCJCb2R5IEhlaWdodFwiLCByb3cuaGVpZ2h0LCBcImNtXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJCb2R5IFdlaWdodFwiLCByb3cud2VpZ2h0LCBcImtnXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJCTUlcIiwgcm93LmJtaSwgXCJrZy9tMlwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiV2Fpc3QgQ2lyY3VtZmVyZW5jZVwiLCByb3cud2Fpc3RsaW5lLCBcImNtXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJTeXN0b2xpYyBCbG9vZCBQcmVzc3VyZVwiLCByb3cuYmFzRV9TQlAsIFwibW1IZ1wiLFxuICAgICAgIHJvdy5ibG9EX1BSRVNTX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJEaWFzdG9saWMgQmxvb2QgUHJlc3N1cmVcIiwgcm93LmJhc0VfRUJQLCBcIm1tSGdcIixcbiAgICAgICByb3cuYmxvRF9QUkVTU19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICAvLyBMaXBpZCBwYW5lbFxuICBwdXNoKFwiQ2hvbGVzdGVyb2xcIiwgICByb3cuY2hvLCAgICAgXCJtZy9kTFwiKTtcbiAgcHVzaChcIlRyaWdseWNlcmlkZVwiLCAgcm93LmJsb0RfVEcsIFwibWcvZExcIik7XG4gIHB1c2goXCJIRExcIiwgICAgICAgICAgIHJvdy5oZGwsICAgICBcIm1nL2RMXCIpO1xuICBwdXNoKFwiTERMXCIsICAgICAgICAgICByb3cubGRsLCAgICAgXCJtZy9kTFwiKTtcbiAgLy8gTGl2ZXIgZnVuY3Rpb25cbiAgcHVzaChcIlNHT1QgKEFTVClcIiwgICAgcm93LnNnb3QsICAgIFwiVS9MXCIsIHJvdy5sRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICBwdXNoKFwiU0dQVCAoQUxUKVwiLCAgICByb3cuc2dwdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIC8vIEZhc3RpbmcgZ2x1Y29zZSBcdTIwMTQgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyAwOTAwNUNcbiAgcHVzaChcIkdsdS1BQ1wiLCAgICAgICAgcm93LnNfMDkwMDVDLCBcIm1nL2RMXCIsXG4gICAgICAgcm93LnNfMDkwMDVDX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDVDXCIpO1xuICAvLyBSZW5hbCBmdW5jdGlvblxuICBwdXNoKFwiQlVOXCIsICAgICAgICAgICByb3cudXJpbkVfQlVOLCAgIFwibWcvZExcIik7XG4gIHB1c2goXCJDcmVhdGluaW5lXCIsICAgIHJvdy5ibG9EX0NSRUFULCAgXCJtZy9kTFwiKTtcbiAgcHVzaChcImVHRlJcIiwgICAgICAgICAgcm93LmVnZnIsICAgICAgICBcIm1ML21pbi8xLjczbTJcIixcbiAgICAgICByb3cuckZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiKTtcbiAgLy8gVXJpbmUgUHJvdGVpbiBkaXBzdGljayBpcyBxdWFsaXRhdGl2ZSAoXCItXCIgLyBcIlx1MDBCMVwiIC8gXCIxK1wiIC8gXCIyK1wiIC8gXCIzK1wiXG4gIC8vIC8gXCI0K1wiKS4gTkhJIHJldHVybnMgdGhlIHN0YXR1cyBjb2RlIGluIGB1cmluRV9QUk9URUlOYCAoXCIwXCIgLyBcIjFcIiAvXG4gIC8vIFwiMlwiIC4uLikgYW5kIHRoZSB0ZXh0IGluIGB1cmluRV9QUk9URUlOX1RFWFRgIChcIi1cIiAvIFwiXHUwMEIxXCIgLyBcIjErXCIgLi4uKS5cbiAgLy8gU2FtZSBjb2RlLXZzLXRleHQgdHJhcCBhcyB0aGUgSEJWL0hDViBwYWlyIGFib3ZlIFx1MjAxNCBwYXNzaW5nIHRoZSBjb2RlXG4gIC8vIGFzIHRoZSBvYnNlcnZhdGlvbiB2YWx1ZSBsYW5kcyBhcyB2YWx1ZVF1YW50aXR5ID0gMCwgbG9va3MgbGlrZVxuICAvLyBcIjAgbWcvZEwgcHJvdGVpblwiICh3cm9uZyBjYXRlZ29yeSBvZiBhbnN3ZXIpLiBVc2UgdGhlIHRleHQuXG4gIHB1c2goXCJVcmluZSBQcm90ZWluXCIsIHJvdy51cmluRV9QUk9URUlOX1RFWFQgfHwgXCJcIiwgXCJcIiwgXCJcIik7XG4gIC8vIEhlcGF0aXRpcyBCL0Mgc2NyZWVuaW5nLlxuICAvL1xuICAvLyBDUklUSUNBTCBcdTIwMTQgcmVhZCBiZWZvcmUgXCJzaW1wbGlmeWluZ1wiIHRoZSBmaWVsZCBjaG9pY2U6XG4gIC8vIE5ISSdzIElIS0UzNDAyIHJldHVybnMgcXVhbGl0YXRpdmUgcmVzdWx0cyBhcyBhIHN0YXR1cy1jb2RlL3RleHQgcGFpcjpcbiAgLy8gICAtIGBoYnNhZ2AgLyBgYW50SV9IQ1ZgIGFyZSBTVEFUVVMgQ09ERVMgKFwiMVwiPVx1OTY3MCwgXCIyXCI9XHU5NjdELCBcIjNcIj1cdTY3MkFcdTZBQTJcdTlBNTcpXG4gIC8vICAgLSBgaGJzYUdfVEVYVGAgLyBgYW50SV9IQ1ZfVEVYVGAgYXJlIHRoZSBodW1hbi1yZWFkYWJsZSByZXN1bHRcbiAgLy8gUGFzc2luZyB0aGUgc3RhdHVzIGNvZGUgYXMgdGhlIG9ic2VydmF0aW9uIHZhbHVlIGdldHMgcGFyc2VkIGFzIGFcbiAgLy8gbnVtZXJpYyBxdWFudGl0eSBkb3duc3RyZWFtIFx1MjE5MiBPYnNlcnZhdGlvbi52YWx1ZVF1YW50aXR5ID0gMSwgd2hpY2ggYVxuICAvLyBTTUFSVCBhcHAgc3VyZmFjZXMgYXMgXCJIQnNBZyA9IDFcIiAobG9va3MgbGlrZSBhIHJlYWwgbGFiIG51bWJlcikuXG4gIC8vIEFsd2F5cyB1c2UgdGhlIF9URVhUIHNpZGUgYXMgdGhlIHZhbHVlLiBXaGVuIHRoZSB0ZXN0IHdhc24ndCBwZXJmb3JtZWRcbiAgLy8gX1RFWFQgaXMgZW1wdHkgYW5kIHB1c2goKSByZXR1cm5zIGVhcmx5LCBubyBvYnNlcnZhdGlvbiBlbWl0dGVkLlxuICAvL1xuICAvLyBGb3IgdGhlIHJlZmVyZW5jZVJhbmdlIHdlIHBhc3MgdGhlIE9WRVJBTEwgcGFuZWwgaW50ZXJwcmV0YXRpb25cbiAgLy8gKGhiVl9SRVNVTFRfVEVYVCAvIGhjVl9SRVNVTFRfVEVYVCkgXHUyMDE0IHRoYXQncyBOSEkncyBjbGluaWNpYW4tc2lkZVxuICAvLyBzdW1tYXJ5IGZvciB0aGUgd2hvbGUgSEJWL0hDViBwYW5lbC5cbiAgLy9cbiAgLy8gSGlzdG9yeTogcmVncmVzc2VkIGluIHYwLjYuMyAodGhlIGFkYXB0ZXItZXh0cmFjdGlvbiByZWZhY3RvciBjb3BpZWRcbiAgLy8gYW4gb2xkZXIgdmVyc2lvbiBvZiB0aGUgZnVuY3Rpb24gXHUyMDE0IHRoZSBmaXggZnJvbSA4ZjkyZjhkIHdhcyBsb3N0XG4gIC8vIHVudGlsIHYwLjYuNSBhZGRlZCB0aGUgc25hcHNob3QgdGVzdCArIHJlc3RvcmVkIHRoaXMgY29kZSBwYXRoKS5cbiAgLy9cbiAgLy8gQ09ERSBhc3NpZ25tZW50ICg2dGggYXJnKSBcdTIwMTQgSUhLRTM0MDIncyBmbGF0IHBheWxvYWQgZG9lc24ndCBjYXJyeVxuICAvLyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHBlciBmaWVsZDsgd2UgcGluIHRoZSBjYW5vbmljYWwgY29kZXMgaGVyZSBzbyBmaW5kTG9pbmNcbiAgLy8gY2FuIE5ISV9UT19MT0lOQyBsb29rdXAgdGhlbSBkaXJlY3RseS4gV2l0aG91dCB0aGlzLCBmaW5kTG9pbmMnc1xuICAvLyBrZXl3b3JkIHNlYXJjaCBoaXRzIHRoZSBnZW5lcmljIFwiaGJcIiBrZXl3b3JkIChIZW1vZ2xvYmluIExPSU5DXG4gIC8vIDcxOC03KSBCRUZPUkUgdGhlIG1vcmUgc3BlY2lmaWMgXCJoYnNhZ1wiIGtleSAoNTE5Ni0xKSBiZWNhdXNlIHRoZVxuICAvLyBrZXl3b3JkIGxvb3AgaXMgZmlyc3QtbWF0Y2gsIG5vdCBsb25nZXN0LW1hdGNoLiBSZXN1bHQgYmVmb3JlXG4gIC8vIHRoaXMgZml4OiBIQnNBZyBvYnNlcnZhdGlvbnMgd2VyZSB0YWdnZWQgYXMgSGVtb2dsb2JpbiBMT0lOQyBcdTIwMTRcbiAgLy8gU01BUlQgYXBwcyByZWx5aW5nIG9uIExPSU5DIGZvciBncm91cGluZyB3b3VsZCBtaXNzIHRoZW0gZW50aXJlbHkuXG4gIC8vICAgMTQwMzJDIFx1MjE5MiBMT0lOQyA1MTk2LTEgIChIQnNBZywgTWFzcy92b2wpXG4gIC8vICAgMTQwNTFDIFx1MjE5MiBMT0lOQyAxMzk1NS0wIChIQ1YgYW50aWJvZHksIFNlcnVtIG9yIFBsYXNtYSlcbiAgcHVzaChcIkhCc0FnXCIsICAgIHJvdy5oYnNhR19URVhUICAgfHwgXCJcIiwgXCJcIiwgcm93LmhiVl9SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIxNDAzMkNcIik7XG4gIHB1c2goXCJBbnRpLUhDVlwiLCByb3cuYW50SV9IQ1ZfVEVYVCB8fCBcIlwiLCBcIlwiLCByb3cuaGNWX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjE0MDUxQ1wiKTtcbiAgLy8gVXJpYyBhY2lkIFx1MjAxNCBub3RlOiBOSEkncyBJSEtFMzQwMiBzY2hlbWEgYWxzbyBoYXMgYSBmaWVsZCBjYWxsZWRcbiAgLy8gYHVyaW5FX1VBX0RJQUdfQUNJRGAgdGhhdCBMT09LUyBsaWtlIHVyaW5lIFVBIGJ1dCB0aGUgdmFsdWVzIGFyZVxuICAvLyBpZGVudGljYWwgdG8gYHVyaUNfQUNJRGAgKHNlcnVtLCBtZy9kTCkuIEl0J3MgYSBtaXNuYW1lZCBkdXBsaWNhdGVcbiAgLy8gd2UgZGVsaWJlcmF0ZWx5IHNraXAgXHUyMDE0IHVzaW5nIGJvdGggd291bGQgY3JlYXRlIHR3byBGSElSXG4gIC8vIE9ic2VydmF0aW9ucyB3aXRoIHRoZSBzYW1lIHZhbHVlIGJ1dCBjb250cmFkaWN0b3J5IHNwZWNpbWVucy5cbiAgcHVzaChcIlVyaWMgQWNpZFwiLCAgICAgcm93LnVyaUNfQUNJRCwgICBcIm1nL2RMXCIpO1xuICAvLyBVcmluZSBVQSAocXVhbGl0YXRpdmUgdXJpbmUgZGlwc3RpY2sgdGVzdCBcdTIwMTQgZGlzdGluY3QgZnJvbSB0aGVcbiAgLy8gbWlzbGFiZWxlZCB1cmluRV9VQV9ESUFHX0FDSUQgYWJvdmU7IHRoaXMgYHVyaW5FX1VBYCBpcyB0aGUgcmVhbFxuICAvLyB1cmluZSBVQSByZXN1bHQsIHVzdWFsbHkgYSArLy0gc3RyaW5nIG9yIGVtcHR5IHdoZW4gbm90IHJ1bikuXG4gIC8vIFNhbWUgY29kZS12cy10ZXh0IHBhdHRlcm4gYXMgdXJpbkVfUFJPVEVJTiBcdTIwMTQgdXNlIHRoZSBfVEVYVCBmaWVsZC5cbiAgcHVzaChcIlVyaW5lIFVBXCIsICAgICAgcm93LnVyaW5FX1VBX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJcIiwgXCJcIik7XG4gIC8vIE1ldGFib2xpYyBzeW5kcm9tZSBzY3JlZW5pbmcgXHUyMDE0IHZhbHVlIGlzIGFuIGludGVycHJldGF0aW9uIHN0cmluZ1xuICAvLyAoJ1x1NkI2M1x1NUUzOCcgLyAnXHU3NTcwXHU1RTM4XHVGRjBDXHU1RUZBXHU4QjcwXHVGRjFBXHU4QUNCXHU2RDNEXHU4QTYyXHU5MUFCXHU1RTJCJyksIG5vdCBhIG51bWJlci4gVGhlIG1hcHBlcidzXG4gIC8vIF90cnlfcGFyc2VfcXVhbnRpdHkgd2lsbCByZXR1cm4gTm9uZSBhbmQgaXQgZmFsbHMgdGhyb3VnaCB0b1xuICAvLyB2YWx1ZVN0cmluZy4gTm8gbWFwcGVkIExPSU5DIGtleXdvcmQgKHlldCkgc28gdGhpcyBsYW5kcyBhcyBhblxuICAvLyBPYnNlcnZhdGlvbiB3aXRoIGNvZGUudGV4dCBvbmx5OyBkb3duc3RyZWFtIGNvbnN1bWVycyBjYW4gc3RpbGxcbiAgLy8gc3VyZmFjZSBpdCB1bmRlciB0aGUgcGF0aWVudCdzIHNjcmVlbmluZyBzZWN0aW9uIGJ5IGNvZGUudGV4dC5cbiAgcHVzaChcIlx1NEVFM1x1OEIxRFx1NzVDN1x1NTAxOVx1N0ZBNFx1N0JFOVx1NkFBMiAoTWV0YWJvbGljIFN5bmRyb21lIFNjcmVlbmluZylcIixcbiAgICAgICByb3cubWV0QV9TWU5EUl9SRVNVTFRfVEVYVCwgXCJcIiwgXCJcIik7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8vIElIS0UzMzA5UzAxIChcdTRGNEZcdTk2NjIgaW5wYXRpZW50IGxpc3QpIFx1MjAxNCBnaXZlcyBwcm9wZXIgYWRtaXNzaW9uL2Rpc2NoYXJnZS5cbi8vIFNoYXBlOiB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgaW5fREFURSwgb3V0X0RBVEUsXG4vLyAgICAgICAgIGljZDljbV9DT0RFLCBpY2Q5Y21fQ09ERV9DTkFNRSwgb3JpX1RZUEUoXCIzXCIpLCByb3dfSUQsIC4uLn1cbi8vIElIS0UzMzA4UzAxIGhhcyB0aGUgc2FtZSBzaGFwZSBmb3IgYSBzbWFsbCBzZXQgb2Ygb2xkZXIgXHU0RjRGXHU5NjYyIHJlY29yZHM7XG4vLyBgZnVuY19EQVRFYCBpbnN0ZWFkIG9mIGBpbl9EQVRFYCBpbiBzb21lIHJvd3MgXHUyMDE0IGFkYXB0ZXIgYWNjZXB0cyBib3RoLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0SW5wYXRpZW50RW5jb3VudGVyKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc3RhcnQgPSByb2NUb0lTTyhpdGVtLmluX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgXCJcIik7XG4gIGNvbnN0IGVuZCA9IHJvY1RvSVNPKGl0ZW0ub3V0X0RBVEUgfHwgXCJcIik7XG4gIGlmICghc3RhcnQpIHJldHVybiBudWxsO1xuICAvLyBpY2Q5Y20gbmFtZSBvbiBcdTRGNEZcdTk2NjIgbGlzdCBpcyBqdXN0IENoaW5lc2UgKG5vIHx8IEVuZ2xpc2ggc3BsaXQgb2JzZXJ2ZWQpLlxuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX25hbWUgfHwgXCJcIik7XG4gIHJldHVybiB7XG4gICAgZGF0ZTogc3RhcnQsXG4gICAgZW5kX2RhdGU6IGVuZCxcbiAgICBjbGFzczogXCJJTVBcIixcbiAgICB0eXBlX2Rpc3BsYXk6IFwiXHU0RjRGXHU5NjYyXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIHJvd19pZDogaXRlbS5yb3dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkgaXRlbSBzaGFwZSBcdTIwMTQgZmFyIG1vcmUgY29tcGxldGUgdGhhbiB0aGUgb2xkZXJcbi8vIElIS0UzMzAxUzAyIHZpc2l0IGxpc3QgKDUxIHZpc2l0cyB2cyA2IGZvciB0aGUgdGVzdCBwYXRpZW50KS4gTkhJJ3Ncbi8vIGNhbm9uaWNhbCBzb3VyY2Ugb2YgdHJ1dGggZm9yIFwiZXZlcnkgYmlsbGVkIGVuY291bnRlclwiLlxuLy8gICBob3NQX0lELCBob3NQX0FCQlIsIGhvc3BfdXJsXG4vLyAgIGZ1bkNfREFURSAgICAgICAgICAgICAgKFx1NkMxMVx1NTcwQiBZWVkvTU0vREQpXG4vLyAgIGljRDlDTV9DT0RFIC8gaWNEOUNNX0NPREVfQ05BTUVcbi8vICAgb3JJX1RZUEUgLyBvcmlfdHlwZV9uYW1lICAgKFwiSUNcdTUzNjFcdThDQzdcdTY1OTlcIiAvIFwiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIpIFx1MjAxNCBvcmlnaW4sIE5PVCBcdTk1ODAvXHU2MDI1L1x1NEY0RlxuLy8gICBwYXJ0X0FNVCwgYXBwbF9ET1QsIFx1MjAyNiAgIChiaWxsaW5nIFx1MjAxNCBkaXNjYXJkZWQpXG4vLyAgIHJvV19JRCAgICAgICAgICAgICAgICAgIGRldGFpbCBrZXkgZm9yIElIS0UzMzAzUzAyIGZhbi1vdXQgKFBoYXNlIEIpXG4vLyBXZSBkb24ndCBoYXZlIHZpc2l0IGNsYXNzIChcdTk1ODAvXHU2MDI1L1x1NEY0RikgYXQgdGhlIGxpc3QgbGV2ZWw7IHRoZSBTMDIgZGV0YWlsXG4vLyBoYXMgaG9zcF9EQVRBX1RZUEVfTkFNRSAoXCJcdTg5N0ZcdTkxQUJcIi9cIlx1NEUyRFx1OTFBQlwiL1wiXHU3MjU5XHU5MUFCXCIpLiBGb3Igbm93IGRlZmF1bHQgQU1CLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UoaXRlbSwgY2xhc3NIaW50KSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaWNkQ29kZSA9IGl0ZW0uaWNEOUNNX0NPREUgfHwgaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChcbiAgICBpdGVtLmljRDlDTV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fbmFtZSB8fCBcIlwiXG4gICk7XG4gIC8vIGNsYXNzIGRlZmF1bHRzIHRvIEFNQjsgSUhLRTMzMDNTMDIgZGV0YWlsIGZhbi1vdXQgbWF5IG92ZXJyaWRlIHRvXG4gIC8vIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRSAoXHU2MDI1XHU4QTNBIC8gXHU0RjRGXHU5NjYyKS5cbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGVuZF9kYXRlOiBcIlwiLFxuICAgIGNsYXNzOiBjbGFzc0hpbnQgfHwgXCJBTUJcIixcbiAgICAvLyBPcmlnaW4gbWFya2VyIGlzbid0IGEgY2xpbmljYWwgY2xhc3MsIGJ1dCBzdGFzaCBpdCBhcyB0eXBlX2Rpc3BsYXlcbiAgICAvLyBzbyBkb3duc3RyZWFtIHNlZXMgdGhlIE5ISSBsYWJlbCB3aXRob3V0IHVzIGludmVudGluZyBvbmUuXG4gICAgdHlwZV9kaXNwbGF5OiBpdGVtLm9yaV90eXBlX25hbWUgfHwgaXRlbS5vcklfVFlQRV9OQU1FIHx8IFwiXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIFBhc3MgdGhyb3VnaCBmb3IgdGhlIGV2ZW50dWFsIElIS0UzMzAzUzAyIGRldGFpbCBmZXRjaCAoUGhhc2UgQikuXG4gICAgcm93X2lkOiBpdGVtLnJvV19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRBbGxlcmd5KGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgYWxsZXJnZW4gPVxuICAgIGl0ZW0uYWxsZXJnZW5fbmFtZSB8fCBpdGVtLmFsbGVSX05BTUUgfHwgaXRlbS5tZWRuYW1lIHx8XG4gICAgaXRlbS5kcnVHX05BTUUgfHwgaXRlbS5hbGxlcmdlbiB8fCBcIlwiO1xuICBpZiAoIWFsbGVyZ2VuKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICByZWNvcmRlZF9kYXRlOiByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLnJlY29yRF9EQVRFIHx8IFwiXCIpLFxuICAgIGRpc3BsYXk6IGFsbGVyZ2VuLFxuICAgIGNhdGVnb3J5OiBcIm1lZGljYXRpb25cIixcbiAgICBjcml0aWNhbGl0eTogXCJ1bmFibGUtdG8tYXNzZXNzXCIsXG4gICAgcmVhY3Rpb246IGl0ZW0ucmVhY3Rpb04gfHwgaXRlbS5zeW1wdG9tIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzMzAxUzA1IChcdTg2NTVcdTdGNkUvXHU2MjRCXHU4ODUzIGxpc3QpIHNoYXBlOlxuLy8gICB7aG9zcF9pZCwgaG9zcF9hYmJyLCBob3NwX3VybCwgb3JpX3R5cGVfbmFtZSwgb3JpX3R5cGUsIGZ1bmNfZGF0ZSxcbi8vICAgIG91dF9kYXRlLCBpY2Q5Y21fY29kZSwgaWNkOWNtX2NvZGVfY25hbWUsIG9wX2NvZGVfY25hbWUsIHJvd19pZH1cbi8vIE5vdGU6IG5vIHByb2NlZHVyZSBDT0RFIGluIGxpc3QgXHUyMDE0IG9wX2NvZGVfY25hbWUgaXMgdGhlIG9ubHkgbGFiZWwuXG4vLyBEYXRlIG5vdGU6IE5ISSBkb2Vzbid0IGV4cG9zZSBhIHNlcGFyYXRlIFwiYWN0dWFsIHByb2NlZHVyZSBkYXRlXCIgaGVyZSxcbi8vIHNvIGZvciBpbnBhdGllbnQgcHJvY2VkdXJlcyAod2hlcmUgZnVuY19kYXRlID0gYWRtaXNzaW9uLCBvdXRfZGF0ZSA9XG4vLyBkaXNjaGFyZ2UpIHdlIGRlbGliZXJhdGVseSB1c2UgZnVuY19kYXRlIGFzIHRoZSBhbmNob3IuIFRoZSBwcm9jZWR1cmVcbi8vIFwiaGFwcGVuZWQgc29tZXdoZXJlIGluIHRoaXMgYWRtaXNzaW9uXCIgXHUyMDE0IGFuY2hvcmluZyB0byB0aGUgc3RhcnQgZGF5XG4vLyBpcyBhIHNtYWxsIGxvc3Mgb2YgYWNjdXJhY3kgdnMuIGludmVudGluZyBhIHBlcmZvcm1lZFBlcmlvZCB0aGF0IHdvdWxkXG4vLyBzdWdnZXN0IHRoZSBwcm9jZWR1cmUgc3Bhbm5lZCB0aGUgd2hvbGUgc3RheS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFByb2NlZHVyZShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bmNfZGF0ZSB8fCBpdGVtLmZ1bkNfREFURSk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChcbiAgICBpdGVtLm9wX2NvZGVfY25hbWUgfHwgaXRlbS5wcm9DX05BTUUgfHwgaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCJcbiAgKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5KSByZXR1cm4gbnVsbDtcbiAgLy8gRGlhZ25vc2lzIChpY2Q5Y21fY29kZV9jbmFtZSkgaXMgdGhlICpyZWFzb24qIGZvciB0aGUgcHJvY2VkdXJlLCBub3RcbiAgLy8gdGhlIHByb2NlZHVyZSBjb2RlIGl0c2VsZi4gU3Rhc2ggaXQgaW4gYG5vdGVgIHNvIGl0IHNob3dzIHVwIGluIHRoZVxuICAvLyBGSElSIHJlc291cmNlIHdpdGhvdXQgcG9sbHV0aW5nIHRoZSBjb2RlIGZpZWxkLlxuICBjb25zdCByZWFzb25Db2RlID0gaXRlbS5pY2Q5Y21fY29kZSB8fCBpdGVtLmljZDljbV9DT0RFIHx8IFwiXCI7XG4gIGNvbnN0IHJlYXNvbk5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9jb2RlX2NuYW1lIHx8IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgXCJcIik7XG4gIGNvbnN0IG5vdGUgPSByZWFzb25OYW1lXG4gICAgPyAocmVhc29uQ29kZSA/IGBSZWFzb246ICR7cmVhc29uQ29kZX0gJHtyZWFzb25OYW1lfWAgOiBgUmVhc29uOiAke3JlYXNvbk5hbWV9YClcbiAgICA6IFwiXCI7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgbm90ZSxcbiAgICBib2R5X3NpdGU6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9hYmJyIHx8IGl0ZW0uaG9zUF9BQkJSIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzNDA4UzAxIChcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTUgbGlzdCkgc2hhcGU6XG4vLyAgIHtob3NwX0lELCBob3NwX0FCQlIsIGhvc3BfdXJsLCByZWFsX0lOU1BFQ1RfREFURSwgb3JkZXJfQ09ERSxcbi8vICAgIG9yZGVyX0NPREVfMldvcmQsIG9yZGVyX05BTUUsIG9yaV9UWVBFLCByb3dfSUQsIGpwR19TVEFUVVMsIC4uLn1cbi8vIE5vIGZpbmRpbmdzL2NvbmNsdXNpb24gXHUyMDE0IGxpc3QgaXMgb3JkZXItbGV2ZWwgb25seS4gV2UgbWFwIHRvIFByb2NlZHVyZVxuLy8gKGFuIGV4YW0gd2FzIHBlcmZvcm1lZCkgcmF0aGVyIHRoYW4gRGlhZ25vc3RpY1JlcG9ydCAod2hpY2ggbmVlZHMgYVxuLy8gbmFycmF0aXZlKS4gSWYvd2hlbiB3ZSBmZXRjaCB0aGUgYWN0dWFsIHJlcG9ydCB0aGlzIGJlY29tZXMgYSBEUi5cbi8vIElIS0UzNDA4UzAyIGRldGFpbCBwcm92aWRlcyB0aGUgZnVsbCByYWRpb2xvZ3kgLyBlbmRvc2NvcHkgcmVwb3J0IGluXG4vLyBgZGVzY2AuIENvbWJpbmVkIHdpdGggb3JkZXJfTkFNRSArIHRoZSBleGFtIGRhdGUgdGhpcyBpcyBhIHByb3BlciBGSElSXG4vLyBEaWFnbm9zdGljUmVwb3J0LiBMaXN0LW9ubHkgZW50cmllcyAod2hlcmUgdGhlIGRldGFpbCBmZXRjaCByZXR1cm5lZFxuLy8gbm8gYGRlc2NgKSBnZXQgZHJvcHBlZCBcdTIwMTQgd2l0aG91dCBhIG5hcnJhdGl2ZSB0aGUgcmVwb3J0IG1hcHBlciB3b3VsZFxuLy8gcmVqZWN0IHRoZW0gYW55d2F5LlxuLy9cbi8vIERhdGUgZmllbGQgY2hvaWNlIFx1MjAxNCBJSEtFMzQwOFMwMiBkZXRhaWwgcGF5bG9hZCBleHBvc2VzOlxuLy8gICAtIHJlYWxfSU5TUEVDVF9EQVRFICBcdTVCRTZcdTk2OUJcdTYzQTFcdTZBQTIvXHU1MDVBXHU1RjcxXHU1MENGXHU2NUU1IChtb3N0IGFjY3VyYXRlIHdoZW4gcHJlc2VudClcbi8vICAgLSBmdW5jX0RBVEUgICAgICAgICAgXHU1QzMxXHU4QTNBL1x1NTE2NVx1OTY2Mlx1NjVFNSAodmlzaXQgYW5jaG9yKVxuLy8gICAtIGFzc2F5X1VQTE9BRF9EQVRFICBcdTU4MzFcdTU0NEFcdTRFMEFcdTUwQjNcdTY2NDJcdTk1OTMgKG9mdGVuIHdlZWtzIGFmdGVyIHRoZSBleGFtIFx1MjAxNFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBiZWxvbmdzIHRvIERpYWdub3N0aWNSZXBvcnQuaXNzdWVkLCBOT1Rcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWZmZWN0aXZlRGF0ZVRpbWUpXG4vLyBJbiBwcmFjdGljZSByZWFsX0lOU1BFQ1RfREFURSBpcyBvZnRlbiBudWxsIG9uIHRoZSBTMDIgZGV0YWlsXG4vLyAoY29uZmlybWVkIGFnYWluc3QgbGl2ZSBOSEkgcGF5bG9hZHMpOyB3ZSB0aGVuIGZhbGwgYmFjayB0b1xuLy8gZnVuY19EQVRFIHJhdGhlciB0aGFuIHRoZSB1cGxvYWQgdGltZS4gRmFsbGluZyBiYWNrIHRvIHRoZVxuLy8gdXBsb2FkIGRhdGUgd291bGQgbGFuZCB0aGUgZXhhbSBpbiBhIGRhdGUgdGhhdCdzIGV2ZW4gZnVydGhlclxuLy8gZnJvbSByZWFsaXR5IChlLmcuIENUIGRvbmUgMjAyNi8wMS8xNCwgdXBsb2FkIDIwMjYvMDIvMjQgXHUyMTkyIHVzaW5nXG4vLyB1cGxvYWQgZGF0ZSB3b3VsZCBzYXkgXCJoYWQgYSBDVCBvbiAyMDI2LzAyLzI0XCIgd2hpY2ggaXMgd3JvbmcpLlxuLy8gZnVuY19EQVRFIGF0IHdvcnN0IG1lYW5zIFwiZXhhbSBoYXBwZW5lZCBkdXJpbmcgdGhpcyBhZG1pc3Npb25cIi5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKFxuICAgIGl0ZW0ucmVhbF9JTlNQRUNUX0RBVEUgfHwgaXRlbS5yZWFsX2luc3BlY3RfZGF0ZSB8fFxuICAgIGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIsXG4gICk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChpdGVtLm9yZGVyX05BTUUgfHwgaXRlbS5vcmRlcl9uYW1lIHx8IFwiXCIpO1xuICBjb25zdCBjb25jbHVzaW9uID0gKGl0ZW0uZGVzYyB8fCBcIlwiKS50cmltKCk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSB8fCAhY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBpdGVtLm9yZGVyX0NPREUgfHwgaXRlbS5vcmRlcl9jb2RlIHx8IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgY2F0ZWdvcnk6IFwiUkFEXCIsXG4gICAgY29uY2x1c2lvbixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAvLyBOSEkgc2VwYXJhdGVzIHRoZSBleGFtIGRhdGUgKGZ1bmNfREFURSkgZnJvbSB0aGUgcmVwb3J0LXVwbG9hZFxuICAgIC8vIHRpbWVzdGFtcCAoYXNzYXlfVVBMT0FEX0RBVEUpLiBUaGUgbGF0dGVyIGlzIHdoZW4gdGhlIHJlcG9ydFxuICAgIC8vIHdhcyBmaW5hbGlzZWQgaW4gTkhJJ3Mgc3lzdGVtIFx1MjAxNCBtYXBzIHRvIERpYWdub3N0aWNSZXBvcnQuaXNzdWVkLlxuICAgIC8vIEZhbGxzIGJhY2sgdG8gTm9uZSBpZiBOSEkgZGlkbid0IHNoaXAgb25lLlxuICAgIGlzc3VlZDogcm9jVG9JU08oKGl0ZW0uYXNzYXlfVVBMT0FEX0RBVEUgfHwgXCJcIikuc3BsaXQoL1xccysvKVswXSksXG4gIH07XG59XG4iLCAiLy8gTkhJIEFQSSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgd2hhdCB3ZSBmZXRjaCwgd2hlcmUgZWFjaCByb3cgZ29lcyxcbi8vIHdoaWNoIGFkYXB0ZXIgdG8gY2FsbCBvbiBpdC5cbi8vXG4vLyBFeHRyYWN0ZWQgZnJvbSBiYWNrZ3JvdW5kLmpzIHNvIHdlIGNhbjpcbi8vICAgMS4gVW5pdC10ZXN0IFwiZXZlcnkgZW5kcG9pbnQgbmFtZSBoYXMgYSBDaGluZXNlIGxhYmVsXCIgXHUyMDE0IGhpc3RvcmljYWxseVxuLy8gICAgICBpdCB3YXMgZWFzeSB0byBhZGQgYSBuZXcgZW5kcG9pbnQgYW5kIGZvcmdldCB0byB1cGRhdGVcbi8vICAgICAgRU5EUE9JTlRfTEFCRUxfWkgsIGxlYXZpbmcgdGhlIHBvcHVwJ3MgXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwIHJvdyBsYWJlbGxlZCB3aXRoXG4vLyAgICAgIHRoZSBkZXYtZmxhdm91cmVkIHJhdyBrZXkgKFwib3RoZXJfbGFic1wiIGluc3RlYWQgb2YgXCJcdTZBQTJcdTlBNTdcIikuXG4vLyAgIDIuIEtlZXAgYmFja2dyb3VuZC5qcyBmb2N1c2VkIG9uIGZsb3cgY29udHJvbCArIHRhYi9JTyBsb2dpYy5cbi8vXG4vLyBBZGFwdGVyIHJlZmVyZW5jZXMgbGl2ZSBpbiAuL25oaS1hZGFwdGVycy5qcy4gU2VlIHRoYXQgbW9kdWxlIGZvciB0aGVcbi8vIHBlci1hZGFwdGVyIGZpZWxkLXByaW9yaXR5IGRlY2lzaW9ucyAoZGF0ZSBzZWxlY3Rpb24sIG5hbWUgZmFsbGJhY2tzLFxuLy8gYmlsaW5ndWFsIHNwbGl0dGluZywgZXRjLikuXG5cbmltcG9ydCB7XG4gIGFkYXB0QWR1bHRQcmV2ZW50aXZlLFxuICBhZGFwdEFsbGVyZ3ksXG4gIGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyxcbiAgYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSxcbiAgYWRhcHRJbWFnaW5nTGlzdFN0dWIsXG4gIGFkYXB0SW5wYXRpZW50RW5jb3VudGVyLFxuICBhZGFwdExhYkl0ZW0sXG4gIGFkYXB0TWVkaWNhdGlvbixcbiAgYWRhcHRQcm9jZWR1cmUsXG59IGZyb20gXCIuL25oaS1hZGFwdGVycy5qc1wiO1xuXG4vLyBVc2VyLWZhY2luZyBsYWJlbCBmb3IgZWFjaCBlbmRwb2ludCBuYW1lLiBUaGUgYnJlYWtkb3duIGNvbGxhcHNpYmxlXG4vLyBpbiB0aGUgcG9wdXAgKFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIpIHJlYWRzIGZyb20gdGhpcyBzbyB1c2VycyBzZWUgXCJcdTVDMzFcdTkxQUIgMTIgXHU3QjQ2XCJcbi8vIGluc3RlYWQgb2YgdGhlIGRldi1mbGF2b3VyZWQgXCJlbmNvdW50ZXJzPTEyLzEyXCIuIFVua25vd24gbmFtZXMgZmFsbFxuLy8gdGhyb3VnaCB0byB0aGUgcmF3IGtleSwgd2hpY2gga2VlcHMgaXQgb2J2aW91cyBkdXJpbmcgZGV2ZWxvcG1lbnRcbi8vIHdoZW4gd2UgYWRkIGEgbmV3IGVuZHBvaW50IGFuZCBoYXZlbid0IGxhYmVsbGVkIGl0IHlldC5cbmV4cG9ydCBjb25zdCBFTkRQT0lOVF9MQUJFTF9aSCA9IHtcbiAgZW5jb3VudGVyczogXCJcdTVDMzFcdTkxQUJcIixcbiAgaW5wYXRpZW50OiBcIlx1NEY0Rlx1OTY2MlwiLFxuICBpbnBhdGllbnRfbGVnYWN5OiBcIlx1NEY0Rlx1OTY2Mlx1RkYwOFx1ODIwQVx1RkYwOVwiLFxuICBwcm9jZWR1cmVzOiBcIlx1NjI0Qlx1ODg1MyAvIFx1ODY1NVx1N0Y2RVwiLFxuICBtZWRpY2F0aW9uczogXCJcdTg2NTVcdTY1QjlcdTg1RTVcdTU0QzFcIixcbiAgYWxsZXJnaWVzOiBcIlx1ODVFNVx1NzI2OVx1OTA0RVx1NjU0RlwiLFxuICBhbGxlcmdpZXNfYjogXCJcdTg1RTVcdTcyNjlcdTkwNEVcdTY1NEZcdUZGMDhCXHVGRjA5XCIsXG4gIGFkdWx0X3ByZXZlbnRpdmU6IFwiXHU2MjEwXHU0RUJBXHU1MDY1XHU2QUEyXCIsXG4gIGNhbmNlcl9zY3JlZW5pbmc6IFwiXHU3NjRDXHU3NUM3XHU3QkU5XHU2QUEyXCIsXG4gIGltYWdpbmc6IFwiXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XCIsXG4gIG90aGVyX2xhYnM6IFwiXHU2QUEyXHU5QTU3XCIsXG4gIGNhdGFzdHJvcGhpY19pbGxuZXNzOiBcIlx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNVwiLFxufTtcblxuLy8gcGFnZV90eXBlIFx1MjE5MiBiYWNrZW5kIHBhZ2VfdHlwZSBzdHJpbmcgdXNlZCBieSBtYXBwZXJzLlxuLy8gcGF0aCBpcyByZWxhdGl2ZSB0byBuaGlCYXNlLiBtZXRob2QgZGVmYXVsdCBcIkdFVFwiLlxuLy8gYHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlYCA9IGVuZHBvaW50IGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGluIFx1NkMxMVx1NTcwQiBmb3JtYXQuXG4vLyBDb25maXJtZWQgdmlhIFVSTHMgb2JzZXJ2ZWQgaW4gTkhJJ3MgU1BBLiBPdGhlciBlbmRwb2ludHMgZWl0aGVyIGRvbid0XG4vLyBhY2NlcHQgcmFuZ2UgcGFyYW1zLCBvciBOSEkgcmVqZWN0cyB1bmtub3duIHBhcmFtcyBcdTIwMTQgd2UgbGVhdmUgdGhlbSBhbG9uZVxuLy8gKHRoZXkgZmFsbCBiYWNrIHRvIHRoZWlyIGRlZmF1bHQgd2luZG93LCB0eXBpY2FsbHkgMS0yIHllYXJzKS5cbmV4cG9ydCBjb25zdCBOSElfQVBJX0VORFBPSU5UUyA9IFtcbiAgLy8gZW5jb3VudGVycyAvIHByb2NlZHVyZXMgZG9uJ3QgaGF2ZSBhIC9zZWFyY2ggdmFyaWFudCAoNDA0KS4gcGFnZV9sb2FkXG4gIC8vIHNpbGVudGx5IGlnbm9yZXMgc19kYXRlIC8gZV9kYXRlIFx1MjAxNCB2ZXJpZmllZCB0aGUgYXJyYXkgbGVuZ3RoIGlzXG4gIC8vIGlkZW50aWNhbCB3aXRoIG9yIHdpdGhvdXQgZGF0ZXMuIERhdGUgZmlsdGVyIGlzIGVmZmVjdGl2ZWx5IHVuc3VwcG9ydGVkXG4gIC8vIGZvciB0aGVzZSBlbmRwb2ludHM7IHRoZXkgcmV0dXJuIGFsbCBkYXRhIGluIE5ISSdzIGxpZmV0aW1lIHdpbmRvdy5cbiAgLy8gRW5jb3VudGVyIHNvdXJjZTogSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkuIFRoZSAvcGFnZV9sb2FkIHZhcmlhbnRcbiAgLy8gaXMgd2luZG93LWxpbWl0ZWQgdG8gfjEgeWVhciAocmV0dXJuZWQgNTEgdmlzaXRzIGVuZGluZyAxMTQvMDUpO1xuICAvLyAvc2VhcmNoIGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGFuZCBnb2VzIGJhY2sgZnVydGhlciAoMTYyIHZpc2l0c1xuICAvLyB0byAxMTIvMDUgZm9yIHRoZSBzYW1lIHBhdGllbnQpLiBTaW5jZSBsYWJzL21lZHMgZXh0ZW5kIHRvIDN5IHZpYVxuICAvLyB0aGVpciBvd24gL3NlYXJjaCBlbmRwb2ludHMsIGVuY291bnRlciBNVVNUIGFsc28gdXNlIC9zZWFyY2ggb3JcbiAgLy8gdGhlIChob3NwaXRhbCwgZGF0ZSkgbGlua2VyIGhhcyBub3RoaW5nIHRvIG1hdGNoIGFnYWluc3QgZm9yIG9sZGVyXG4gIC8vIGxhYiBkYXRlcy5cbiAgeyBuYW1lOiBcImVuY291bnRlcnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAzczAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT1cIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElucGF0aWVudCAoXHU0RjRGXHU5NjYyKSBcdTIwMTQgSUhLRTMzMDlTMDEgaXMgdGhlIHByaW1hcnkgbGlzdCB3aXRoIGluX0RBVEUvb3V0X0RBVEVcbiAgLy8gc3Bhbi4gSUhLRTMzMDhTMDEgY2FycmllcyBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3JkcyB3aXRoIHRoZVxuICAvLyBzYW1lIGZpZWxkcyAoZnVuY19EQVRFIGluIHNvbWUgcm93cyBpbnN0ZWFkIG9mIGluX0RBVEU7IGFkYXB0ZXJcbiAgLy8gaGFuZGxlcyBib3RoKS4gQm90aCBmZWVkIHRoZSBzYW1lIGVuY291bnRlciBtYXBwZXIuXG4gIHsgbmFtZTogXCJpbnBhdGllbnRcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOXMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJpbnBhdGllbnRfbGVnYWN5XCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOHMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwMXMwNS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0UHJvY2VkdXJlIH0sXG4gIC8vIG1lZGljYXRpb25zOiBwYWdlX2xvYWQgb25seSBhY2NlcHRzIGVtcHR5IGRhdGVzIChIVFRQIDQwMCBvdGhlcndpc2UpLlxuICAvLyBUaGUgL3NlYXJjaCBlbmRwb2ludCBpcyB3aGF0IHRoZSBTUEEgaGl0cyB3aGVuIHVzZXIgcGlja3MgYSBjdXN0b21cbiAgLy8gZGF0ZSByYW5nZSBhbmQgYWNjZXB0cyBJU08gXHU4OTdGXHU1MTQzIGRhdGVzIHdpdGggZGFzaGVzICgyMDIzLTAxLTAxKS5cbiAgLy8gQ29uZmlybWVkIHZpYSBEZXZUb29scyBvYnNlcnZhdGlvbiBvZiB0aGUgXHU3QkU5XHU5MDc4IHBhbmVsIHN1Ym1pdC5cbiAgeyBuYW1lOiBcIm1lZGljYXRpb25zXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA2czAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExJnNfdHlwZT1BXCIsXG4gICAgcGFnZV90eXBlOiBcIm1lZGljYXRpb25zXCIsICAgICAgIGFkYXB0OiBhZGFwdE1lZGljYXRpb24sIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNfYlwiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwNFwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIC8vIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NVx1N0Q1MFx1Njc5QyAoSUhLRTM0MDJTMDEpOiBvbmUgcm93IHBlciBzY3JlZW5pbmcsIGNvbnRhaW5zXG4gIC8vIEJNSSAvIHZpdGFscyAvIGxpcGlkIHBhbmVsIC8gTEZUIC8gUkZUIC8gSGVwIEIvQyAvIHVyaWMgYWNpZCBhbGxcbiAgLy8gcHJlLWNvbXB1dGVkIGJ5IE5ISSdzIHNjcmVlbmluZyBwcm9ncmFtbWUuIGFkYXB0QWR1bHRQcmV2ZW50aXZlXG4gIC8vIHJldHVybnMgYW4gYXJyYXkgKG9uZSBPYnNlcnZhdGlvbiBwZXIgbWVhc3VyZW1lbnQpIHNvIHRoZVxuICAvLyBhZGFwdGVyLWNhbGwgbG9vcCBmbGF0dGVucyBpdC5cbiAgeyBuYW1lOiBcImFkdWx0X3ByZXZlbnRpdmVcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDAyczAxL1NQX0lIS0UzNDAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdEFkdWx0UHJldmVudGl2ZSB9LFxuICB7IG5hbWU6IFwiY2FuY2VyX3NjcmVlbmluZ1wiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDRzMDEvU1BfSUhLRTM0MDRTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0TGFiSXRlbSB9LFxuICAvLyBnbHVjb3NlIChJSEtFMzQwNlMwMSkgKyBsaXBpZCAoSUhLRTM0MDdTMDEpIGFyZSBzdWJzZXRzIG9mXG4gIC8vIG90aGVyX2xhYnMgKElIS0UzNDA5UzAxKSBwZXIgTkhJJ3MgZGF0YSBtb2RlbCBcdTIwMTQgZmV0Y2hpbmcgdGhlbVxuICAvLyBzZXBhcmF0ZWx5IGp1c3QgY3JlYXRlcyBkdXAgb2JzZXJ2YXRpb25zLCBzbyB3ZSBza2lwIHRoZW0uXG4gIC8vIEltYWdpbmcgbGlzdCAoSUhLRTM0MDhTMDEpIG9ubHkgY2FycmllcyBvcmRlci1sZXZlbCBkYXRhOyBmdWxsXG4gIC8vIG5hcnJhdGl2ZSByZXBvcnQgbGl2ZXMgYXQgSUhLRTM0MDhTMDIuIFdlIGRvIGEgMi1zdGVwIGZldGNoIChzZWVcbiAgLy8gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYikgdG8gZ3JhYiB0aGUgcmVwb3J0LCB0aGVuIG1hcCB0byBhIHJlYWxcbiAgLy8gRGlhZ25vc3RpY1JlcG9ydC4gVGhlIGxpc3QgYWRhcHRlciBpcyBhIG5vLW9wIHN0dWIgbGlrZSBtZWRpY2F0aW9ucy5cbiAgLy8gaW1hZ2luZzogc2VhcmNoIGVuZHBvaW50IGFjY2VwdHMgSVNPIGRhdGUgcmFuZ2UgbGlrZSBtZWRpY2F0aW9ucy5cbiAgeyBuYW1lOiBcImltYWdpbmdcIiwgICAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA4czAxL3NlYXJjaD9zX3R5cGU9JnNfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTFcIixcbiAgICBwYWdlX3R5cGU6IFwiZGlhZ25vc3RpY19yZXBvcnRzXCIsIGFkYXB0OiBhZGFwdEltYWdpbmdMaXN0U3R1Yiwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbiAgLy8gb3RoZXJfbGFicyBhbHJlYWR5IHVzZXMgL3NlYXJjaDsgc2FtZSBJU08tZGFzaCBkYXRlIGZvcm1hdCB3b3Jrcy5cbiAgeyBuYW1lOiBcIm90aGVyX2xhYnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA5czAxL3NlYXJjaD9zX3R5cGU9JnNfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0TGFiSXRlbSwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbiAgLy8gSUhLRTMyMDlTMDEgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSkgXHUyMDE0IE5ISS12ZXR0ZWQgY2F0YXN0cm9waGljLWlsbG5lc3MgcmVnaXN0cnkuXG4gIC8vIEVhY2ggcm93IFx1MjE5MiBhIEZISVIgQ29uZGl0aW9uIHdpdGggY2F0ZWdvcnk9cHJvYmxlbS1saXN0LWl0ZW0sIHRoZVxuICAvLyBjbG9zZXN0IFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBlcXVpdmFsZW50IHRvIGEgY3VyYXRlZCBwcm9ibGVtIGxpc3QuIEVuZHBvaW50XG4gIC8vIGRvZXNuJ3QgYWNjZXB0IGRhdGUgcGFyYW1zIChOSEkgcmV0dXJucyBjdXJyZW50bHktdmFsaWQgY2VydHMgb25seSkuXG4gIHsgbmFtZTogXCJjYXRhc3Ryb3BoaWNfaWxsbmVzc1wiLCBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMyMDlzMDEvU1BfSUhLRTMyMDlTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwiY29uZGl0aW9uc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyB9LFxuXTtcbiIsICIvLyBTZXJ2aWNlIHdvcmtlciBmb3IgTkhJLUZISVIgQnJpZGdlIFx1MjAxNCBvd25zIHRoZSBsb25nLXJ1bm5pbmdcbi8vIFwiU3luYyBUaGlzIFBhdGllbnRcIiB3b3JrZmxvdyBzbyB0aGUgcG9wdXAgY2FuIGNsb3NlIG1pZC1zeW5jIHdpdGhvdXRcbi8vIGFib3J0aW5nIGl0LlxuLy9cbi8vIExpZmVjeWNsZTpcbi8vICAgLSBwb3B1cCBwb3N0cyB7dHlwZTogXCJzdGFydE5oaUFwaVN5bmNcIiwgcGF5bG9hZH0gIFx1MjE5MiBOSEkgSlNPTi1BUEkgc3luY1xuLy8gICAtIGJhY2tncm91bmQgcnVucyB0aGUgZnVsbCBzeW5jIHNlcXVlbmNlLCB1cGRhdGluZyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gICAtIHBvcHVwIHJlYWRzIGNocm9tZS5zdG9yYWdlLmxvY2FsIG9uIHJlb3BlbiB0byBzaG93IHByb2dyZXNzXG4vL1xuLy8gTW9kZXM6XG4vLyAgIC0gXCJsb2NhbFwiICAgXHUyMTkyIGFmdGVyIE5ISSBmZXRjaCwgcnVuIG1hcHBlcnMgaW4tZXh0ZW5zaW9uLCBkb3dubG9hZCBhXG4vLyAgICAgICAgICAgICAgICAgRkhJUiBCdW5kbGUgdG8gdGhlIHVzZXIncyBtYWNoaW5lLiBObyBiYWNrZW5kIHJlcXVpcmVkLlxuLy8gICAtIFwiYmFja2VuZFwiIFx1MjE5MiBQT1NUIHBlci1wYWdlX3R5cGUgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRcbi8vICAgICAgICAgICAgICAgICAoZXhpc3RpbmcgYmVoYXZpb3VyKTsgZGFzaGJvYXJkICsgU01BUlQgYXBwIHVzZSB0aGVcbi8vICAgICAgICAgICAgICAgICBiYWNrZW5kJ3MgRkhJUiBzdG9yZS5cblxuaW1wb3J0IHtcbiAgR1JPVVBfSEFORExFUlMsXG4gIExJU1RfSEFORExFUlMsXG4gIGRlZHVwQWRtaXNzaW9uRGF5QW1iLFxuICBkZXJpdmVQYXRpZW50SWQsXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMsXG4gIG1hcFBhdGllbnQsXG4gIG1hc2tJZCxcbiAgbWFza05hbWUsXG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzLFxufSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcbmltcG9ydCB7XG4gIC8vIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UgaXMgaW52b2tlZCBkaXJlY3RseSBmcm9tIHRoZVxuICAvLyBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dCAob3ZlcnJpZGVzIHRoZSByZWdpc3RyeSdzIGNsYXNzSGludFxuICAvLyB3aXRoIFx1NjAyNVx1OEEzQS9cdTRGNEZcdTk2NjIgZGVyaXZlZCBmcm9tIHRoZSBkZXRhaWwgYm9keSksIHNvIGl0IG5lZWRzIHRvIGJlXG4gIC8vIGEgbmFtZWQgaW1wb3J0IFx1MjAxNCBub3Qgb25seSByZWFjaGFibGUgdmlhIE5ISV9BUElfRU5EUE9JTlRTW2ldLmFkYXB0LlxuICAvLyBGb3JnZXR0aW5nIHRoaXMgcmUtaW1wb3J0IGFmdGVyIGV4dHJhY3RpbmcgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5XG4gIC8vIGluIHYwLjYuMyBzaGlwcGVkIGEgUmVmZXJlbmNlRXJyb3IgdGhhdCBvbmx5IGZpcmVkIGluIHByb2R1Y3Rpb25cbiAgLy8gc3luY3Mgd2l0aCBub24tZW1wdHkgZW5jb3VudGVycy4gVGVzdHMgZG9uJ3QgZXhlcmNpc2UgdGhhdCBwYXRoXG4gIC8vIFx1MjAxNCBzZWUgVE9ET19GT0xMT1dVUCBmb3IgYSBTVy1mbG93IGludGVncmF0aW9uIHRlc3QgaWRlYS5cbiAgYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSxcbiAgYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCxcbiAgYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbCxcbiAgaXNvVG9ST0MsXG4gIHBpY2tFbmdsaXNoLFxuICByb2NUb0lTTyxcbn0gZnJvbSBcIi4vbmhpLWFkYXB0ZXJzLmpzXCI7XG5pbXBvcnQgeyBFTkRQT0lOVF9MQUJFTF9aSCwgTkhJX0FQSV9FTkRQT0lOVFMgfSBmcm9tIFwiLi9uaGktZW5kcG9pbnRzLmpzXCI7XG5cbmNvbnN0IFNUT1JBR0VfS0VZID0gXCJzeW5jU3RhdHVzXCI7XG5jb25zdCBzbGVlcCA9IChtcykgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKTtcblxuLy8gQ2FuY2VsbGF0aW9uIGZsYWcgc2V0IGJ5IHBvcHVwJ3Mgc3RvcCBidXR0b24uIENoZWNrZWQgYXQgc3RyYXRlZ2ljIHBvaW50c1xuLy8gaW4gcnVuTmhpQXBpU3luYyAoYmV0d2VlbiBwaGFzZXMsIGJlZm9yZSBlYWNoIGRldGFpbCBwYWdlKSBzbyB0aGVcbi8vIGluLXByb2dyZXNzIHN5bmMgZXhpdHMgcHJvbXB0bHkgd2hlbiB0aGUgdXNlciBoaXRzIFN0b3AuIENsZWFyZWQgYXQgdGhlXG4vLyBzdGFydCBvZiBlYWNoIG5ldyBzeW5jIHJ1bi5cbmxldCBfY2FuY2VsbGVkID0gZmFsc2U7XG4vLyBDb250ZXh0IGZvciB0aGUgaW4tZmxpZ2h0IHN5bmMgc28gdGhlIHN0b3BTeW5jIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuLy8gZGF0YSB3aXRob3V0IHRoZSBwb3B1cCBuZWVkaW5nIHRvIHBhc3MgaXQgYmFjay4gU2V0IGF0IHRoZSB0b3Agb2Zcbi8vIHJ1bk5oaUFwaVN5bmM7IGNsZWFyZWQgb24gY29tcGxldGlvbiAoc3VjY2Vzcy9mYWlsdXJlL2NhbmNlbCkuXG5sZXQgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xuY29uc3QgQ0FOQ0VMX0VSUk9SID0gXCJfX1NZTkNfQ0FOQ0VMTEVEX19cIjtcbi8vIFRocm93biB3aGVuIE5ISSBkZXRlY3RzIHRoZSBzZXNzaW9uIGhhcyBleHBpcmVkIChsb2dpbiBwYWdlIHJlbmRlcmVkLCBvclxuLy8gdGFiIHJlZGlyZWN0ZWQgdG8gYXV0aCBuYW1lc3BhY2UpLiBBYm9ydHMgc3luYyBpbW1lZGlhdGVseSBzbyB0aGUgdXNlciBjYW5cbi8vIHJlLWxvZ2luIGFuZCByZXRyeSBpbnN0ZWFkIG9mIHRpbWluZyBvdXQgb24gZXZlcnkgcmVtYWluaW5nIHBhZ2UuXG5jb25zdCBTRVNTSU9OX0VYUElSRURfRVJST1IgPSBcIl9fU0VTU0lPTl9FWFBJUkVEX19cIjtcbi8vIEVycm9ycyB0aGF0IHNob3VsZCBhYm9ydCB0aGUgZW50aXJlIHN5bmMgaW5zdGVhZCBvZiBiZWluZyBzd2FsbG93ZWRcbi8vIHBlci1waGFzZS5cbmNvbnN0IEFCT1JUX0VSUk9SUyA9IG5ldyBTZXQoW0NBTkNFTF9FUlJPUiwgU0VTU0lPTl9FWFBJUkVEX0VSUk9SXSk7XG5mdW5jdGlvbiBjaGVja0NhbmNlbCgpIHtcbiAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRTdGF0dXMocGFydGlhbCkge1xuICAvLyBBZnRlciBjYW5jZWxsYXRpb24sIHRoZSBwb3B1cCBoYXMgYWxyZWFkeSB3cml0dGVuIHRoZSBkZWZpbml0aXZlXG4gIC8vIFwic3RvcHBlZFwiIHN0YXR1cyBcdTIwMTQgc2lsZW5jZSBhbnkgZnVydGhlciBwcm9ncmVzcyB3cml0ZXMgZnJvbSB0aGVcbiAgLy8gaW4tZmxpZ2h0IHN5bmMgY29kZSBzbyB0aGUgVUkgZG9lc24ndCBib3VuY2Ugd2hpbGUgaXQgdW53aW5kcy5cbiAgaWYgKF9jYW5jZWxsZWQpIHJldHVybjtcbiAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gIGNvbnN0IG5leHQgPSB7IC4uLnByZXYsIC4uLnBhcnRpYWwsIHRzOiBEYXRlLm5vdygpIH07XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IG5leHQgfSk7XG4gIC8vIEJyb2FkY2FzdCB0byBhbnkgb3BlbiBwb3B1cC4gSWYgbm8gbGlzdGVuZXIgKHBvcHVwIGNsb3NlZCksXG4gIC8vIHNlbmRNZXNzYWdlIHJlamVjdHMgXHUyMDE0IHN3YWxsb3cuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzeW5jUHJvZ3Jlc3NcIiwgc3RhdHVzOiBuZXh0IH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIE5ISSBBUEktZGlyZWN0IHN5bmMgKHBhcmFsbGVsLCBubyBMTE0pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEluc3RlYWQgb2YgbmF2aWdhdGluZyB0aGUgdXNlcidzIHRhYiB0byBlYWNoIE5ISSBwYWdlLCB3YWl0aW5nIGZvciBWdWUgdG9cbi8vIHJlbmRlciwgY2FwdHVyaW5nIEhUTUwsIHRoZW4gc2VuZGluZyBpdCB0aHJvdWdoIExMTSBleHRyYWN0aW9uLCB3ZSBjYWxsXG4vLyBOSEkncyB1bmRlcmx5aW5nIEpTT04gQVBJIGVuZHBvaW50cyBkaXJlY3RseS4gVGhlIFx1NTA2NVx1NEZERFx1N0Y3MiBTUEEgZnJvbnRzIGEgc2V0XG4vLyBvZiBSRVNUIGVuZHBvaW50cyB1bmRlciAvYXBpL2loa2UzMDAwLzxwYWdlPi8qIHRoYXQgcmV0dXJuIHdlbGwtZm9ybWVkXG4vLyBKU09OOyBjYWxsaW5nIHRoZW0gaW4gcGFyYWxsZWwgY3V0cyBhIDUtMTAgbWludXRlIHN5bmMgdG8gfjEwIHNlY29uZHMgYW5kXG4vLyByZW1vdmVzIHRoZSBMTE0gY29zdCBlbnRpcmVseS5cblxuY29uc3QgTkhJX0hPU1QgPSBcIm15aGVhbHRoYmFuay5uaGkuZ292LnR3XCI7XG5cblxuLy8gTkhJIEpTT04gYWRhcHRlcnMgKyBkYXRlL3N0cmluZyBoZWxwZXJzIGxpdmUgaW4gLi9uaGktYWRhcHRlcnMuanNcbi8vIHNvIHRoZXkgY2FuIGJlIHVuaXQtdGVzdGVkIGluIGlzb2xhdGlvbiAoYmFja2dyb3VuZC5qcyBjYW4ndCBiZVxuLy8gbG9hZGVkIHVuZGVyIHZpdGVzdCBcdTIwMTQgY2hyb21lLiogQVBJcywgU1cgZ2xvYmFscykuIFNlZSB0aGF0IG1vZHVsZVxuLy8gZm9yIHRoZSBmaWVsZC1wcmlvcml0eSBkZWNpc2lvbnMgcGVyIGFkYXB0ZXIuXG4vL1xuLy8gVGhlIE5ISSBBUEkgZW5kcG9pbnQgcmVnaXN0cnkgKyBcdTRFMkRcdTY1ODcgbGFiZWwgbWFwcGluZyBsaXZlIGluXG4vLyAuL25oaS1lbmRwb2ludHMuanMgXHUyMDE0IGV4dHJhY3RlZCBzbyBhIHVuaXQgdGVzdCBjYW4gZ3VhcmFudGVlIGV2ZXJ5XG4vLyBlbmRwb2ludCBuYW1lIGhhcyBhIGxhYmVsICh3ZSB1c2VkIHRvIHNoaXAgcmF3IHBhZ2VfdHlwZSBrZXlzIGxpa2Vcbi8vIFwib3RoZXJfbGFic1wiIGludG8gdGhlIHBvcHVwJ3MgXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwIHdoZW4gc29tZW9uZSBmb3Jnb3QgdG9cbi8vIHJlZ2lzdGVyIHRoZSBDaGluZXNlIHZlcnNpb24pLlxuXG4vLyBBcHBseSBhIHtzdGFydCwgZW5kfSBJU08gZGF0ZSByYW5nZSB0byBhbiBlbmRwb2ludCBwYXRoOlxuLy8gICAtIElmIHBhdGggYWxyZWFkeSBoYXMgc19kYXRlPSBwbGFjZWhvbGRlcnMsIGZpbGwgdGhlbSBpbi5cbi8vICAgLSBPdGhlcndpc2UgYXBwZW5kIHNfZGF0ZT0uLi4mZV9kYXRlPS4uLiB0byB0aGUgcXVlcnkgc3RyaW5nLlxuLy8gRW5kcG9pbnRzIHdpdGhvdXQgYHN1cHBvcnRzRGF0ZVJhbmdlYCBwYXNzIHRocm91Z2ggdW5jaGFuZ2VkLlxuZnVuY3Rpb24gYXBwbHlEYXRlUmFuZ2VUb1BhdGgocGF0aCwgZGF0ZVJhbmdlKSB7XG4gIGlmICghZGF0ZVJhbmdlIHx8ICghZGF0ZVJhbmdlLnN0YXJ0ICYmICFkYXRlUmFuZ2UuZW5kKSkgcmV0dXJuIHBhdGg7XG4gIC8vIE5ISSBleHBlY3RzIFx1ODk3Rlx1NTE0MyBJU08gZGF0ZXMgd2l0aCBkYXNoZXM6IDIwMjMtMDEtMDEgKG5vdCBcdTZDMTFcdTU3MEIsIG5vdFxuICAvLyBzbGFzaGVzKS4gQ29uZmlybWVkIGJ5IG9ic2VydmluZyB0aGUgU1BBJ3MgcmVxdWVzdCB3aGVuIHVzZXIgcGlja3NcbiAgLy8gYSBjdXN0b20gZGF0ZSByYW5nZS4gVVJMLWVuY29kaW5nIHRoZSBkYXNoZXMgaXMgdW5uZWNlc3NhcnkuXG4gIGNvbnN0IHMgPSAoZGF0ZVJhbmdlLnN0YXJ0IHx8IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgY29uc3QgZSA9IChkYXRlUmFuZ2UuZW5kIHx8IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgbGV0IHAgPSBwYXRoO1xuICBpZiAoL1s/Jl1zX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1zX2RhdGU9KVteJl0qLywgYCQxJHtzfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gKHAuaW5jbHVkZXMoXCI/XCIpID8gXCImXCIgOiBcIj9cIikgKyBgc19kYXRlPSR7c31gO1xuICB9XG4gIGlmICgvWz8mXWVfZGF0ZT0vLnRlc3QocCkpIHtcbiAgICBwID0gcC5yZXBsYWNlKC8oWz8mXWVfZGF0ZT0pW14mXSovLCBgJDEke2V9YCk7XG4gIH0gZWxzZSB7XG4gICAgcCArPSBgJmVfZGF0ZT0ke2V9YDtcbiAgfVxuICByZXR1cm4gcDtcbn1cblxuLy8gRmFuIG91dCBJSEtFMzMwNlMwMiBkZXRhaWwgZmV0Y2hlcyBpbnNpZGUgdGhlIE5ISSB0YWIgc28gY29va2llcyArIEpXVFxuLy8gYXV0aCBmbG93IG5hdHVyYWxseS4gV2UgcGFzcyB0aGUgdmlzaXQgbGlzdCAoanVzdCByb3dfSURzICsgdGhlaXIgcGFyZW50XG4vLyBmaWVsZHMgbmVlZGVkIGZvciBhZGFwdGF0aW9uKSBpbnRvIHRoZSB0YWI7IHRoZSB0YWIgcmV0dXJucyBwYXJhbGxlbFxuLy8gZmV0Y2hlZCBib2RpZXM7IHdlIGFkYXB0IGJhY2sgaW4gdGhlIFNXLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoTWVkaWNhdGlvbkRldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICAvLyBLZWVwIHBhcmVudCBmaWVsZHMgbmVlZGVkIGJ5IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwuXG4gICAgICBwYXJlbnQ6IHtcbiAgICAgICAgZnVuY19EQVRFOiB2LmZ1bmNfREFURSB8fCB2LmZ1bmNfZGF0ZSB8fCBcIlwiLFxuICAgICAgICBpY2Q5Y21fQ09ERTogdi5pY2Q5Y21fQ09ERSB8fCB2LmljZDljbV9jb2RlIHx8IFwiXCIsXG4gICAgICAgIGljZDljbV9DT0RFX0NOQU1FOiB2LmljZDljbV9DT0RFX0NOQU1FIHx8IHYuaWNkOWNtX25hbWUgfHwgXCJcIixcbiAgICAgICAgaG9zcF9BQkJSOiB2Lmhvc3BfQUJCUiB8fCB2Lmhvc3BfYWJiciB8fCBcIlwiLFxuICAgICAgfSxcbiAgICB9KSlcbiAgICAuZmlsdGVyKChyKSA9PiByLnJvd19JRCk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgZnVuYzogYXN5bmMgKGJhc2UsIGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgIGlmICghdG9rZW4pIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICB9XG4gICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICBhc3luYyBmdW5jdGlvbiBmZXRjaE9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtjdHlwZX1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBOSEkgdXNlcyBkaWZmZXJlbnQgY3R5cGUgdmFsdWVzIGZvciBcdTg5N0ZcdTkxQUIvXHU0RTJEXHU5MUFCL1x1NzI1OVx1OTFBQi9cdTg2NTVcdTY1QjlcdTdCOEIuIFdlIGRvbid0XG4gICAgICAvLyBoYXZlIHRoZSBwdWJsaWMgbWFwcGluZywgc28gdHJ5IGN0eXBlIDEuLjQgaW4gb3JkZXIgYW5kIHN0b3AgYXNcbiAgICAgIC8vIHNvb24gYXMgb25lIHJldHVybnMgZHJ1Z3MuIGN0eXBlPTIgY292ZXJlZCBJQ1x1NTM2MSBcdTk1ODBcdThBM0EgaW4gb3VyIHNhbXBsZS5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCkge1xuICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIFsyLCAxLCAzLCA0XSkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaE9uZShyb3dJZCwgY3QpO1xuICAgICAgICAgIGlmIChyLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSByZXR1cm4gcjtcbiAgICAgICAgICBpZiAoci5lcnJvcikgY29udGludWU7XG4gICAgICAgICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Py5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgICAgICAgIGNvbnN0IGhhc0RydWdzID0gbWFpbi5zb21lKCh2KSA9PlxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheSh2Py5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpICYmIHYuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0Lmxlbmd0aCA+IDBcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChoYXNEcnVncykgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm8gY3R5cGUgeWllbGRlZCBkcnVncyBcdTIwMTQgcmV0dXJuIGxhc3Qgc3VjY2Vzc2Z1bCBib2R5IGFueXdheSBzb1xuICAgICAgICAvLyBkaWFnbm9zdGljcyBjYW4gc3RpbGwgc2VlIHRoZSB2aXNpdCBtZXRhZGF0YS5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGZldGNoT25lKHJvd0lkLCAyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IGRydWdzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgZHJ1Z0xpc3QgPSBBcnJheS5pc0FycmF5KHZpc2l0LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCkgPyB2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QgOiBbXTtcbiAgICAgIGZvciAoY29uc3QgZCBvZiBkcnVnTGlzdCkge1xuICAgICAgICBjb25zdCBhZGFwdGVkID0gYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbChkLCB2aXNpdCk7XG4gICAgICAgIGlmIChhZGFwdGVkKSBkcnVncy5wdXNoKGFkYXB0ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZHJ1Z3M7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTM0MDhTMDIgZGV0YWlsIGZldGNoZXMgZm9yIGltYWdpbmcgXHUyMDE0IHNhbWUgcGF0dGVybiBhcyB0aGVcbi8vIG1lZGljYXRpb24gMi1zdGVwLiBjdHlwZSBtaXJyb3JzIHRoZSB2aXNpdCdzIG9yaV9UWVBFIChBIC8gRSAvIFx1MjAyNikuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2KSA9PiAoe1xuICAgICAgcm93X0lEOiB2LnJvd19JRCB8fCB2LnJvd2lkIHx8IHYucm93SUQgfHwgXCJcIixcbiAgICAgIGN0eXBlOiB2Lm9yaV9UWVBFIHx8IHYub3JpX3R5cGUgfHwgXCJBXCIsXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gb25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTM0MDhTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2VuY29kZVVSSUNvbXBvbmVudChjdHlwZSl9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lELCBpdGVtc1tpXS5jdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IHJlcG9ydHMgPSBbXTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgciA9IHJlc3VsdHNbaV07XG4gICAgaWYgKCFyIHx8IHIuZXJyb3IgfHwgIXIuYm9keSkgY29udGludWU7XG4gICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTM0MDhTMDJfbWFpbl9kYXRhIDogW107XG4gICAgZm9yIChjb25zdCB2aXNpdCBvZiBtYWluKSB7XG4gICAgICBjb25zdCBhZGFwdGVkID0gYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCh2aXNpdCk7XG4gICAgICBpZiAoYWRhcHRlZCkgcmVwb3J0cy5wdXNoKGFkYXB0ZWQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVwb3J0cztcbn1cblxuLy8gRmFuIG91dCBJSEtFMzMwM1MwMiBkZXRhaWwgdG8gY2xhc3NpZnkgZWFjaCBJSEtFMzMwM1MwMSB2aXNpdCBhc1xuLy8gQU1CIC8gRU1FUiAvIElNUCBiYXNlZCBvbiBob3NwX0RBVEFfVFlQRV9OQU1FLiBVc2VzID9yaWQ9PHJvd19JRD4mdD1OXG4vLyB3aGVyZSBOIGlzIHRoZSB2aXNpdCB0eXBlIGJ1Y2tldDsgd2UgZG9uJ3Qga25vdyB0aGUgbWFwcGluZyBhIHByaW9yaSxcbi8vIHNvIGZvciBlYWNoIHZpc2l0IHdlIHRyeSB0PTEuLjUgdW50aWwgb25lIHJldHVybnMgbm9uLWVtcHR5IG1haW5fZGF0YS5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaEVuY291bnRlckRldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodiwgaWR4KSA9PiAoeyBpZHgsIHJvd19JRDogdi5yb1dfSUQgfHwgdi5yb3dfSUQgfHwgXCJcIiB9KSlcbiAgICAuZmlsdGVyKChyKSA9PiByLnJvd19JRCk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgZnVuYzogYXN5bmMgKGJhc2UsIGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgIGlmICghdG9rZW4pIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICB9XG4gICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICBhc3luYyBmdW5jdGlvbiBmZXRjaE9uZShyb3dJZCwgdCkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvaWhrZTMzMDNzMDIvcGFnZV9sb2FkP3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JnQ9JHt0fWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0bSA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRtKTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEZvciBlYWNoIHZpc2l0LCBmaW5kIHRoZSBgdGAgdGhhdCByZXR1cm5zIG5vbi1lbXB0eSBkYXRhLiBOSElcbiAgICAgIC8vIHVzZXMgdD0xIGZvciBvdXRwYXRpZW50IFx1ODk3Rlx1OTFBQiwgdD0yIG1heWJlIFx1NjAyNVx1OEEzQS9cdTRFMkRcdTkxQUIsIHQ9MyBcdTRGNEZcdTk2NjIsXG4gICAgICAvLyB0PTQgXHU3MjU5XHU5MUFCXHUyMDI2IGRvbid0IGhhdmUgYW4gYXV0aG9yaXRhdGl2ZSBtYXBwaW5nIHNvIHdlIHByb2JlLlxuICAgICAgYXN5bmMgZnVuY3Rpb24gb25lKHJvd0lkKSB7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBbMSwgMiwgMywgNCwgNV0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIHQpO1xuICAgICAgICAgIGlmIChyLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSByZXR1cm4gcjtcbiAgICAgICAgICBpZiAoci5lcnJvcikgY29udGludWU7XG4gICAgICAgICAgY29uc3QgbWFpbiA9IChyLmJvZHk/Lmloa2UzMzAzUzAyX21haW5fZGF0YSkgfHwgW107XG4gICAgICAgICAgaWYgKG1haW4ubGVuZ3RoID4gMCkgcmV0dXJuIHsgYm9keTogci5ib2R5LCB0IH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgYm9keTogbnVsbCB9O1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd3MgPSBbXTtcbiAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQyAmJiB3IDwgaXRlbXMubGVuZ3RoOyB3KyspIHdzLnB1c2god29ya2VyKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod3MpO1xuICAgICAgcmV0dXJuIHsgcmVzdWx0czogb3V0IH07XG4gICAgfSxcbiAgICBhcmdzOiBbYmFzZVVybCwgcmVxc10sXG4gIH0pO1xuXG4gIGlmIChyZXN1bHQ/LmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgLy8gUGFpciBlYWNoIGRldGFpbCBib2R5IGJhY2sgdG8gaXRzIHZpc2l0IHBvc2l0aW9uLlxuICBjb25zdCBieUlkeCA9IG5ldyBNYXAoKTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXFzLmxlbmd0aDsgaSsrKSB7XG4gICAgYnlJZHguc2V0KHJlcXNbaV0uaWR4LCByZXN1bHRzW2ldPy5ib2R5IHx8IG51bGwpO1xuICB9XG4gIHJldHVybiBieUlkeDtcbn1cblxuZnVuY3Rpb24gX2NsYXNzRnJvbVMwMkRldGFpbChib2R5KSB7XG4gIGlmICghYm9keSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG1haW4gPSAoYm9keS5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICBpZiAobWFpbi5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICBjb25zdCB0biA9IFN0cmluZyhtYWluWzBdLmhvc3BfREFUQV9UWVBFX05BTUUgfHwgXCJcIik7XG4gIGlmICh0bi5pbmNsdWRlcyhcIlx1NjAyNVwiKSkgcmV0dXJuIFwiRU1FUlwiOyAgLy8gXHU2MDI1XHU4QTNBXG4gIGlmICh0bi5pbmNsdWRlcyhcIlx1NEY0Rlx1OTY2MlwiKSkgcmV0dXJuIFwiSU1QXCI7XG4gIC8vIFx1ODk3Rlx1OTFBQiAvIFx1NEUyRFx1OTFBQiAvIFx1NzI1OVx1OTFBQiAvIFx1ODVFNVx1NUM0MCBhbGwgZGVmYXVsdCB0byBBTUJcbiAgcmV0dXJuIFwiQU1CXCI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9wb3N0U3RydWN0dXJlZChiYWNrZW5kLCBwYWdlX3R5cGUsIGl0ZW1zLCBzeW5jQXBpS2V5LCBwYXRpZW50T3ZlcnJpZGUpIHtcbiAgY29uc3QgciA9IGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRgLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgIC4uLihzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9KSxcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHBhZ2VfdHlwZSxcbiAgICAgIGhvc3Q6IE5ISV9IT1NULFxuICAgICAgaXRlbXMsXG4gICAgICBwYXRpZW50X292ZXJyaWRlOiBwYXRpZW50T3ZlcnJpZGUgfHwgbnVsbCxcbiAgICB9KSxcbiAgfSk7XG4gIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKGBQT1NUIHVwbG9hZC1zdHJ1Y3R1cmVkICR7ci5zdGF0dXN9OiAkeyhhd2FpdCByLnRleHQoKSkuc2xpY2UoMCwgMjAwKX1gKTtcbiAgcmV0dXJuIGF3YWl0IHIuanNvbigpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTG9jYWwgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBSdW5zIHRoZSBzYW1lIG1hcHBlcnMgdGhlIGJhY2tlbmQgcnVucywgdGhlbiB0cmlnZ2VycyBhIGRvd25sb2FkIG9mIHRoZVxuLy8gcmVzdWx0aW5nIEZISVIgQnVuZGxlLiBOb3RoaW5nIGxlYXZlcyB0aGUgdXNlcidzIG1hY2hpbmU7IG5vIGJhY2tlbmRcbi8vIHJlcXVpcmVkLiBNaXJyb3JzIGJhY2tlbmQvdXBsb2FkLXN0cnVjdHVyZWQgb3JkZXI6IGVuY291bnRlcnMgZmlyc3Qgc29cbi8vIHRoYXQgbGlua0VuY291bnRlcnNJblJlc291cmNlcyBjYW4gYXR0YWNoIHJlZmVyZW5jZXMgdG8gZG93bnN0cmVhbVxuLy8gb2JzZXJ2YXRpb25zL21lZGljYXRpb25zL2V0Yy5cblxuY29uc3QgX0xPQ0FMX1BBR0VfVFlQRV9PUkRFUiA9IFtcbiAgXCJlbmNvdW50ZXJzXCIsXG4gIFwib2JzZXJ2YXRpb25zXCIsXG4gIFwibWVkaWNhdGlvbnNcIixcbiAgXCJjb25kaXRpb25zXCIsXG4gIFwiYWxsZXJnaWVzXCIsXG4gIFwiZGlhZ25vc3RpY19yZXBvcnRzXCIsXG4gIFwicHJvY2VkdXJlc1wiLFxuXTtcblxuLy8gQ2hlYXAgcHJlLWZsaWdodDogZG9lcyB0aGlzIE5ISSB0YWIgaGF2ZSBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24/XG4vLyBVc2VzIHRoZSBzYW1lIHNlc3Npb25TdG9yYWdlLnRva2VuICsgbGlnaHR3ZWlnaHQgQVBJIGNhbGwgcGF0dGVybiBhc1xuLy8gX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpLiBEb2Vzbid0IHJldHVybiBhbnl0aGluZyBQSUkgXHUyMDE0IGp1c3QgYVxuLy8gYm9vbGVhbiBmb3IgdGhlIHBvcHVwIHRvIGRlY2lkZSB3aGV0aGVyIHRvIHN1cmZhY2UgYSBcImxvZyBpbiBmaXJzdFwiXG4vLyBiYW5uZXIuIFJldHVybnMgbnVsbCB3aGVuIHdlIGNhbid0IHRlbGwgKHNjcmlwdC1pbmplY3Rpb24gYmxvY2tlZCxcbi8vIHRpbWVvdXQsIGV0Yy4pIHNvIHRoZSBwb3B1cCBjYW4gZmFsbCBiYWNrIHRvIFwiZW5hYmxlZFwiIHJhdGhlciB0aGFuXG4vLyBzY2FyaW5nIHRoZSB1c2VyIHdpdGggYSBmYWxzZSBuZWdhdGl2ZS5cbmFzeW5jIGZ1bmN0aW9uIF9jaGVja05oaUxvZ2luU3RhdGUodGFiSWQpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFNhbWUgZW5kcG9pbnQgYXMgdGhlIGNpZCBhdXRvLWZldGNoIFx1MjAxNCBrbm93biB0byBuZWVkIGFuXG4gICAgICAgICAgLy8gYXV0aGVudGljYXRlZCBzZXNzaW9uIGFuZCB0byBiZSBjaGVhcC5cbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goXCIvYXBpL2loa2UzMDAwL2loa2UzNDEwczAxL3BhZ2VfbG9hZFwiLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLCBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dH1gIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gNDAxLzQwMyBcdTIxOTIgc2Vzc2lvbiB0b2tlbiByZWplY3RlZC4gMjAwIFx1MjE5MiBsb2dnZWQgaW4uXG4gICAgICAgICAgcmV0dXJuIHIub2s7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gdHlwZW9mIHJlc3VsdCA9PT0gXCJib29sZWFuXCIgPyByZXN1bHQgOiBudWxsO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGVuZHBvaW50IElIS0UzNDEwUzAxIChcdTYyMTFcdTYzQTVcdTdBMkVcdTdEMDBcdTkzMDQgLyBDT1ZJRCBcdTdCRTlcdTZBQTJcdTdEMDBcdTkzMDQpIGhhcHBlbnNcbi8vIHRvIGNhcnJ5IHRoZSBsb2dnZWQtaW4gdXNlcidzIHJlYWwgY2l0aXplbiBJRCBpbiB0aGUgcmVzcG9uc2UgKGBjaWRgXG4vLyBmaWVsZCwgZS5nLiBcIlAxMjM0NTA4NjZcIikuIFVzZSBpdCB0byBzZWVkIC8gcmVmcmVzaCB0aGUgcGF0aWVudF9cbi8vIG92ZXJyaWRlJ3MgaWRfbm8gc28gaXQgYWx3YXlzIHRyYWNrcyBcIndob3NlIHNlc3Npb24gaXMgY3VycmVudGx5XG4vLyBhY3RpdmUgaW4gdGhlIE5ISSB0YWJcIi5cbi8vXG4vLyBIaXN0b3J5IG5vdGU6IHRoaXMgZnVuY3Rpb24gdXNlZCB0byBlYXJseS1yZXR1cm4gd2hlbmV2ZXIgaWRfbm8gd2FzXG4vLyBhbHJlYWR5IGEgcmVhbC1sb29raW5nIGNpZCAoXCJkb24ndCB0b3VjaCBhIG1hbnVhbGx5LWVudGVyZWQgSURcIikuXG4vLyBUaGF0IHNob3J0LWNpcmN1aXQgcHJlLWRhdGVkIHYwLjYuMCB3aGljaCByZW1vdmVkIGlkX25vIGZyb20gdGhlIFVJXG4vLyBcdTIwMTQgdGhlcmUncyBubyBcIm1hbnVhbFwiIHBhdGggYW55bW9yZSwgdGhlIGZpZWxkIGlzIHB1cmVseSBpbnRlcm5hbC5cbi8vIFRoZSBzaG9ydC1jaXJjdWl0IGFsc28gcHJvZHVjZWQgdGhlIGJ1ZyBwYXR0ZXJuOiB1c2VyIHN0YXJ0cyBzeW5jXG4vLyB3aXRoIFBhdGllbnQgQiBsb2dnZWQgaW4gKGNpZF9CIHdyaXR0ZW4gdG8gb3ZlcnJpZGUpLCByZWFsaXNlcyB3cm9uZ1xuLy8gdGFiLCBzd2l0Y2hlcyBOSEkgdGFiIHRvIFBhdGllbnQgQSwgcmUtc3luY3MgXHUyMDE0IGlkX25vIHN0YXlzIGNpZF9CXG4vLyBiZWNhdXNlIFwiYWxyZWFkeSBhIHJlYWwgY2lkXCIuIE5vdyB3ZSBhbHdheXMgcHJvYmUgYW5kIGZvbGxvdyB0aGVcbi8vIHNlc3Npb24ncyB0cnV0aC4gTWFudWFsIG92ZXJyaWRlIGlzIGdvbmUsIE5ISSBzZXNzaW9uIGlzIGF1dGhvcml0YXRpdmUuXG5hc3luYyBmdW5jdGlvbiBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCBjdXJyZW50ID0gcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCI7XG5cbiAgbGV0IGNpZCA9IG51bGw7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXQpIHJldHVybiBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MTBzMDEvcGFnZV9sb2FkXCIsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0fWAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiBudWxsO1xuICAgICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICByZXR1cm4gYm9keT8uY2lkIHx8IG51bGw7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIFZhbGlkYXRlIGl0IGxvb2tzIGxpa2UgYSBUYWl3YW4gbmF0aW9uYWwgSUQgKDEgbGV0dGVyICsgOSBkaWdpdHMpXG4gICAgLy8gYmVmb3JlIHRydXN0aW5nIGl0LiBBdm9pZHMgYWNjaWRlbnRhbGx5IHByb21vdGluZyBnYXJiYWdlIHRvIHRoZVxuICAgIC8vIFBhdGllbnQgcmVzb3VyY2UncyB1bmlxdWUga2V5LlxuICAgIGlmIChyZXN1bHQgJiYgL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHJlc3VsdCkpIGNpZCA9IHJlc3VsdDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gSUhLRTM0MTAgY2lkIGZldGNoIGZhaWxlZDpcIiwgZT8ubWVzc2FnZSA/PyBlKTtcbiAgfVxuXG4gIGlmIChjaWQgJiYgY2lkICE9PSBjdXJyZW50KSB7XG4gICAgcGF0aWVudE92ZXJyaWRlID0geyAuLi5wYXRpZW50T3ZlcnJpZGUsIGlkX25vOiBjaWQgfTtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwYXRpZW50T3ZlcnJpZGUgfSkuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgLy8gUGF0aWVudC1zd2l0Y2ggY2xlYW51cC4gSWYgdGhlIGNpZCBqdXN0IGNoYW5nZWQgZnJvbSBvbmUgcmVhbFxuICAgIC8vIGNpZCB0byBhbm90aGVyIChub3QganVzdCBcImF1dG8tWFhYWCBcdTIxOTIgcmVhbCBjaWRcIiBmaXJzdC1zeW5jIHN3YXApLFxuICAgIC8vIHRoZSBwcmV2aW91c2x5LXN0YXNoZWQgRkhJUiBidW5kbGUgYmVsb25ncyB0byB0aGUgT1RIRVIgcGF0aWVudC5cbiAgICAvLyBEcm9wIGl0IHNvIHRoZSBwb3B1cCdzIGRvd25sb2FkIGJ1dHRvbiBkb2Vzbid0IGtlZXAgb2ZmZXJpbmcgdGhlXG4gICAgLy8gd3JvbmcgcGF0aWVudCdzIGZpbGUuIFNhbWUgc2V0IG9mIHdpcGVzIHBvcHVwLmpzIGRvZXMgaW5cbiAgICAvLyBzYXZlUGF0aWVudE92ZXJyaWRlIHdoZW4gaXQgZGV0ZWN0cyBwYXRpZW50Q2hhbmdlZC5cbiAgICBjb25zdCBzd2l0Y2hlZFJlYWxQYXRpZW50cyA9XG4gICAgICBjdXJyZW50ICYmICFjdXJyZW50LnN0YXJ0c1dpdGgoXCJhdXRvLVwiKSAmJiBjdXJyZW50ICE9PSBjaWQ7XG4gICAgaWYgKHN3aXRjaGVkUmVhbFBhdGllbnRzKSB7XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoUEVORElOR19CVU5ETEVfS0VZKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXRpZW50T3ZlcnJpZGU7XG59XG5cbi8vIFJlYWQgdGhlIG1hc2stbmFtZSBwcmVmZXJlbmNlIGZyZXNoIGZyb20gc3RvcmFnZS4gV2UgZG9uJ3QgY2FjaGUgXHUyMDE0XG4vLyBydW5OaGlBcGlTeW5jIGlzIGludm9rZWQgYXQgbW9zdCBhIGZldyB0aW1lcyBwZXIgc2Vzc2lvbiBhbmQgdGhlIFNXXG4vLyBjYW4gYmUgdG9ybiBkb3duICsgcmVzdGFydGVkIGFueSB0aW1lLCBzbyBhIHNpbmdsZSBnZXQoKSBwZXIgc3luYyBpc1xuLy8gY2hlYXBlciB0aGFuIHN5bmNpbmcgc3RhdGUgYWNyb3NzIFNXIGxpZmVjeWNsZXMuXG5hc3luYyBmdW5jdGlvbiBfaXNNYXNrRW5hYmxlZCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IG1hc2tOYW1lRW5hYmxlZCB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwibWFza05hbWVFbmFibGVkXCIpO1xuICAgIHJldHVybiBtYXNrTmFtZUVuYWJsZWQgPT09IHRydWU7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYnVpbGRPdmVycmlkZVBhdGllbnQob3YsIG1hc2tFbmFibGVkKSB7XG4gIGNvbnN0IGRpc3BsYXlOYW1lID0gbWFza0VuYWJsZWQgPyBtYXNrTmFtZShvdi5uYW1lIHx8IFwiXCIpIDogb3YubmFtZSB8fCBcIlwiO1xuICBjb25zdCByYXcgPSB7XG4gICAgaWQ6IG92LmlkX25vLFxuICAgIGlkZW50aWZpZXI6IG92LmlkX25vLFxuICAgIG5hbWU6IGRpc3BsYXlOYW1lIHx8IG92LmlkX25vLFxuICB9O1xuICBpZiAob3YuYmlydGhfZGF0ZSkgcmF3LmJpcnRoRGF0ZSA9IG92LmJpcnRoX2RhdGU7XG4gIGlmIChvdi5nZW5kZXIpIHJhdy5nZW5kZXIgPSBvdi5nZW5kZXI7XG4gIHJldHVybiBtYXBQYXRpZW50KHJhdyk7XG59XG5cbi8vIFdhbGsgYSBKU09OLWxpa2UgdmFsdWUgYW5kIHJlcGxhY2UgZXZlcnkgc3RyaW5nIHRva2VuIGVxdWFsIHRvIG9yXG4vLyBjb250YWluaW5nIGBuZWVkbGVgIHdpdGggYHJlcGxhY2VtZW50YC4gVXNlZCB0byBzY3J1YiB0aGUgcmVhbFxuLy8gcGF0aWVudCBuYW1lIG91dCBvZiBOSEkgbmFycmF0aXZlIGZpZWxkcyAoY2xpbmljYWxfbm90ZSwgY29uY2x1c2lvbixcbi8vIG5vdGUsIGV0Yy4pIGJlZm9yZSB0aGUgaXRlbXMgcmVhY2ggdGhlIG1hcHBlci4gT25seSB0cmlnZ2VyZWQgd2hlblxuLy8gdGhlIHVzZXIgaGFzIG9wdGVkIGludG8gbWFza2luZyBBTkQgc3VwcGxpZWQgYSBuYW1lIFx1MjAxNCBhbmQgdGhlXG4vLyBzdWJzdGl0dXRpb24gaXMgZXhhY3QtdG9rZW4tcmVwbGFjZSwgbm90IGZ1enp5LCBzbyBpdCBjYW4ndCBzdXJwcmlzZVxuLy8gdGhlIHVzZXIgYnkgY2xvYmJlcmluZyB1bnJlbGF0ZWQgY29udGVudC5cbmZ1bmN0aW9uIF9yZXBsYWNlTmFtZURlZXAodmFsdWUsIG5lZWRsZSwgcmVwbGFjZW1lbnQpIHtcbiAgaWYgKCFuZWVkbGUgfHwgbmVlZGxlID09PSByZXBsYWNlbWVudCkgcmV0dXJuIHZhbHVlO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsdWUuc3BsaXQobmVlZGxlKS5qb2luKHJlcGxhY2VtZW50KTtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gdmFsdWUubWFwKCh2KSA9PiBfcmVwbGFjZU5hbWVEZWVwKHYsIG5lZWRsZSwgcmVwbGFjZW1lbnQpKTtcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiB2YWx1ZSkgb3V0W2tdID0gX3JlcGxhY2VOYW1lRGVlcCh2YWx1ZVtrXSwgbmVlZGxlLCByZXBsYWNlbWVudCk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIF9hc3NlbWJsZUxvY2FsQnVuZGxlKGJ5VHlwZSwgcGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCkge1xuICBjb25zdCBwYXRpZW50ID0gX2J1aWxkT3ZlcnJpZGVQYXRpZW50KHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpO1xuICBjb25zdCBwaWQgPSBwYXRpZW50LmlkO1xuICBjb25zdCBhbGwgPSBbcGF0aWVudF07XG5cbiAgZm9yIChjb25zdCBwdCBvZiBfTE9DQUxfUEFHRV9UWVBFX09SREVSKSB7XG4gICAgY29uc3QgaXRlbXMgPSBieVR5cGVbcHRdO1xuICAgIGlmICghaXRlbXMgfHwgaXRlbXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBsZXQgbWFwcGVkO1xuICAgIGlmIChHUk9VUF9IQU5ETEVSU1twdF0pIHtcbiAgICAgIG1hcHBlZCA9IEdST1VQX0hBTkRMRVJTW3B0XShpdGVtcywgcGlkKTtcbiAgICB9IGVsc2UgaWYgKExJU1RfSEFORExFUlNbcHRdKSB7XG4gICAgICBjb25zdCBbZm5dID0gTElTVF9IQU5ETEVSU1twdF07XG4gICAgICBtYXBwZWQgPSBpdGVtc1xuICAgICAgICAuZmlsdGVyKChpdCkgPT4gaXQgJiYgdHlwZW9mIGl0ID09PSBcIm9iamVjdFwiKVxuICAgICAgICAubWFwKChpdCkgPT4gZm4oaXQsIHBpZCkpXG4gICAgICAgIC5maWx0ZXIoKHIpID0+IHIgIT09IG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHB0ID09PSBcImVuY291bnRlcnNcIikgbWFwcGVkID0gZGVkdXBBZG1pc3Npb25EYXlBbWIobWFwcGVkKTtcbiAgICBhbGwucHVzaCguLi5tYXBwZWQpO1xuICB9XG5cbiAgLy8gRGVkdXAgYnkgKHJlc291cmNlVHlwZSwgaWQpIGJlZm9yZSBhc3NlbWJsaW5nIHRoZSBCdW5kbGUuIE11bHRpcGxlXG4gIC8vIE5ISSBlbmRwb2ludHMgY2FuIGZlZWQgdGhlIHNhbWUgcGFnZV90eXBlIChlLmcuIGVuY291bnRlcnMgL1xuICAvLyBpbnBhdGllbnQgLyBpbnBhdGllbnRfbGVnYWN5IGFsbCBcdTIxOTIgcGFnZV90eXBlPVwiZW5jb3VudGVyc1wiKSwgYW5kIHRoZVxuICAvLyBtYXBwZXIgcHJvZHVjZXMgZGV0ZXJtaW5pc3RpYyBzdGFibGUgSURzIFx1MjAxNCBzbyB0d28gcmF3IGl0ZW1zIHRoYXRcbiAgLy8gZGVzY3JpYmUgdGhlIHNhbWUgbWVkaWNhbCBldmVudCBjb2xsYXBzZSB0byBvbmUgcmVzb3VyY2UuIEJhY2tlbmRcbiAgLy8gdXBzZXJ0IGhhbmRsZXMgdGhpcyBhdXRvbWF0aWNhbGx5IChzYW1lIHN0YWJsZSBJRCA9IHNhbWUgREIgcm93KTtcbiAgLy8gbG9jYWwgbW9kZSBoYXMgdG8gZG8gaXQgZXhwbGljaXRseS4gV2l0aG91dCB0aGlzIGRlZHVwLCB0aGUgbG9jYWxcbiAgLy8gQnVuZGxlIGVuZHMgdXAgaW5mbGF0ZWQgcmVsYXRpdmUgdG8gd2hhdCBiYWNrZW5kIHN0b3JlcyBmcm9tIHRoZVxuICAvLyBpZGVudGljYWwgTkhJIGlucHV0LlxuICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICBjb25zdCB1bmlxdWUgPSBbXTtcbiAgZm9yIChjb25zdCByIG9mIGFsbCkge1xuICAgIGNvbnN0IGtleSA9IGAke3IucmVzb3VyY2VUeXBlfS8ke3IuaWR9YDtcbiAgICBpZiAoc2Vlbi5oYXMoa2V5KSkgY29udGludWU7XG4gICAgc2Vlbi5hZGQoa2V5KTtcbiAgICB1bmlxdWUucHVzaChyKTtcbiAgfVxuXG4gIC8vIExpbmtlciArIHNleC1zdHJhdGlmaWVkIHJlc29sdmVyIHJ1biBvbmNlIG92ZXIgdGhlIGZ1bGwgYXNzZW1ibGVkXG4gIC8vIGxpc3QgKHNhbWUgcGlwZWxpbmUgYmFja2VuZCdzIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkIHJ1bnMsIGp1c3RcbiAgLy8gYWdhaW5zdCBhbiBpbi1tZW1vcnkgY2FuZGlkYXRlIGFycmF5IGluc3RlYWQgb2YgYSBTUUxpdGUgcXVlcnkpLlxuICBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzKHVuaXF1ZSwgdW5pcXVlKTtcbiAgcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMocGF0aWVudCwgdW5pcXVlKTtcblxuICByZXR1cm4ge1xuICAgIHJlc291cmNlVHlwZTogXCJCdW5kbGVcIixcbiAgICB0eXBlOiBcImNvbGxlY3Rpb25cIixcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9cXC5cXGQrWiQvLCBcIlpcIiksXG4gICAgZW50cnk6IHVuaXF1ZS5tYXAoKHIpID0+ICh7XG4gICAgICBmdWxsVXJsOiBgJHtyLnJlc291cmNlVHlwZX0vJHtyLmlkfWAsXG4gICAgICByZXNvdXJjZTogcixcbiAgICB9KSksXG4gIH07XG59XG5cbi8vIExvY2FsIG1vZGUgc3Rhc2hlcyB0aGUgYXNzZW1ibGVkIEJ1bmRsZSBpbiBjaHJvbWUuc3RvcmFnZS5sb2NhbCB1bmRlclxuLy8gYSBzaW5nbGUgXCJwZW5kaW5nRmhpckJ1bmRsZVwiIHNsb3QuIFRoZSBwb3B1cCBzaG93cyBhIGRvd25sb2FkIGJ1dHRvblxuLy8gd2hlbiB0aGlzIHNsb3QgaXMgbm9uLWVtcHR5OyB0aGUgYWN0dWFsIGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQgY2FsbFxuLy8gaGFwcGVucyBmcm9tIHRoZSBwb3B1cCAoaW4gcmVzcG9uc2UgdG8gYSB1c2VyIGNsaWNrKSBzbyB0aGUgZmlsZVxuLy8gZG9lc24ndCBhcHBlYXIgaW4gdGhlIERvd25sb2FkcyBiYXIgdW5pbnZpdGVkLlxuLy9cbi8vIFNpbmdsZSBzbG90IG1lYW5zIGEgbmV3IHN5bmMgb3ZlcndyaXRlcyB0aGUgcHJldmlvdXMgcGVuZGluZyBidW5kbGUuXG4vLyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBkZWZhdWx0IHF1b3RhIGlzIDEwIE1COyBhIHR5cGljYWwgTkhJIHN5bmMgaXNcbi8vIHdlbGwgdW5kZXIgMiBNQi5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcblxuYXN5bmMgZnVuY3Rpb24gX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRJZCwgZGF0ZVJhbmdlKSB7XG4gIC8vIEZpbGVuYW1lOiBuaGkte3BpZH0te3N0YXJ0WVlZWU1NRER9LXtlbmRZWVlZTU1ERH0uanNvblxuICAvLyBXaGVuIG5vIGV4cGxpY2l0IGRhdGVSYW5nZSAoTkhJIGRlZmF1bHQgPSBcdThGRDEgMSBcdTVFNzQpLCBzeW50aGVzaXplIHRvZGF5LTF5IFx1MjE5MiB0b2RheS5cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgcGFkID0gKG4pID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gIGNvbnN0IGZtdCA9IChkKSA9PiBgJHtkLmdldEZ1bGxZZWFyKCl9JHtwYWQoZC5nZXRNb250aCgpICsgMSl9JHtwYWQoZC5nZXREYXRlKCkpfWA7XG4gIC8vIEhhbGYtbWFzayB0aGUgSUQgaW4gdGhlIGZpbGVuYW1lIHNvIHRoZSB1c2VyJ3MgRG93bmxvYWRzIGZvbGRlclxuICAvLyBkb2Vzbid0IGxlYWsgdGhlIGZ1bGwgXHU4RUFCXHU1MjA2XHU4QjQ5ICh3b3VsZCBiZSB2aXNpYmxlIHRvIGFueW9uZSBzZWVpbmdcbiAgLy8gYSBmaWxlIGxpc3Rpbmcgb3IgZG93bmxvYWQtYmFyIHByZXZpZXcpLiBgWGAgYmVjYXVzZSBgKmAgaXNcbiAgLy8gaW52YWxpZCBpbiBXaW5kb3dzIHBhdGhzLiBCdW5kbGUgQ09OVEVOVFMgc3RpbGwgY2FycnkgdGhlIHJlYWxcbiAgLy8gSUQgdW5kZXIgUGF0aWVudC5pZCBcdTIwMTQgZmlsZSBvd25lciBrbm93cyB3aG9zZSBkYXRhIGl0IGlzLlxuICBjb25zdCBtYXNrZWRQaWQgPSBtYXNrSWQocGF0aWVudElkIHx8IFwidW5rbm93blwiLCBcIlhcIik7XG4gIGNvbnN0IHNhZmVQaWQgPSBtYXNrZWRQaWQucmVwbGFjZSgvW15BLVphLXowLTlfLV0vZywgXCJfXCIpO1xuICBjb25zdCBjb21wYWN0ID0gKGQpID0+IChkIHx8IFwiXCIpLnNsaWNlKDAsIDEwKS5yZXBsYWNlKC8tL2csIFwiXCIpO1xuICBsZXQgcywgZTtcbiAgaWYgKGRhdGVSYW5nZSAmJiAoZGF0ZVJhbmdlLnN0YXJ0IHx8IGRhdGVSYW5nZS5lbmQpKSB7XG4gICAgcyA9IGNvbXBhY3QoZGF0ZVJhbmdlLnN0YXJ0KSB8fCBmbXQobm93KTtcbiAgICBlID0gY29tcGFjdChkYXRlUmFuZ2UuZW5kKSB8fCBmbXQobm93KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvbmVZZWFyQWdvID0gbmV3IERhdGUobm93KTtcbiAgICBvbmVZZWFyQWdvLnNldEZ1bGxZZWFyKG9uZVllYXJBZ28uZ2V0RnVsbFllYXIoKSAtIDEpO1xuICAgIHMgPSBmbXQob25lWWVhckFnbyk7XG4gICAgZSA9IGZtdChub3cpO1xuICB9XG4gIGNvbnN0IGZpbGVuYW1lID0gYG5oaS0ke3NhZmVQaWR9LSR7c30tJHtlfS5qc29uYDtcbiAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KGJ1bmRsZSwgbnVsbCwgMik7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgW1BFTkRJTkdfQlVORExFX0tFWV06IHtcbiAgICAgIGZpbGVuYW1lLFxuICAgICAganNvbixcbiAgICAgIGJ5dGVzOiBqc29uLmxlbmd0aCxcbiAgICAgIGdlbmVyYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgcGF0aWVudElkOiBwYXRpZW50SWQgfHwgbnVsbCxcbiAgICB9LFxuICB9KTtcbiAgcmV0dXJuIHsgZmlsZW5hbWUsIGJ5dGVzOiBqc29uLmxlbmd0aCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBydW5OaGlBcGlTeW5jKHsgdGFiSWQsIG1vZGUsIGJhY2tlbmQsIHN5bmNBcGlLZXksIG5oaUJhc2UsIHBhdGllbnRPdmVycmlkZSwgZGF0ZVJhbmdlLCBkYXRlUmFuZ2VMYWJlbCB9KSB7XG4gIF9jYW5jZWxsZWQgPSBmYWxzZTtcbiAgY29uc3QgQkFTRSA9IG5oaUJhc2UgfHwgYGh0dHBzOi8vJHtOSElfSE9TVH1gO1xuXG4gIGlmICghcGF0aWVudE92ZXJyaWRlKSB7XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdThBQ0JcdTUxNDhcdTU3MjggcG9wdXAgXHU1ODZCXHU1QkVCXHU3NUM1XHU0RUJBXHU4Q0M3XHU2NTk5XHU1RjhDXHU1MThEXHU4QTY2XCIsXG4gICAgICAgIHBoYXNlOiBcImVycm9yXCIsIHRzOiBEYXRlLm5vdygpLCBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIXRhYklkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQVBJIHN5bmMgcmVxdWlyZXMgTkhJIHRhYiBpZCAoY29va2llcyBhcmUgZmlyc3QtcGFydHkpXCIpO1xuICB9XG5cbiAgLy8gRmlyc3QgY2hhbmNlIHRvIHVwZ3JhZGUgdGhlIHBhdGllbnQgSUQ6IGlmIHRoZSBwb3B1cCBnYXZlIHVzIGFuXG4gIC8vIFwiYXV0by1YWFhYWFhYWFwiIHBsYWNlaG9sZGVyICh1c2VyIGRpZG4ndCBtYW51YWxseSB0eXBlIG9uZSksXG4gIC8vIGZldGNoIHRoZSByZWFsIG9uZSBmcm9tIE5ISSdzIElIS0UzNDEwUzAxIGVuZHBvaW50IChyZXNwb25zZS5jaWRcbiAgLy8gaXMgdGhlIGNpdGl6ZW4gSUQpLiBQZXJzaXN0IGJhY2sgdG8gc3RvcmFnZSBzbyBzdWJzZXF1ZW50IHN5bmNzXG4gIC8vIGFyZSBzdGFibGUuIE1hbnVhbGx5LXR5cGVkIElEcyBhcmUgcmVzcGVjdGVkIGFzLWlzLlxuICBwYXRpZW50T3ZlcnJpZGUgPSBhd2FpdCBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSk7XG5cbiAgLy8gU3Rhc2ggY29udGV4dCBzbyB0aGUgc3RvcFN5bmMgbWVzc2FnZSBoYW5kbGVyIGNhbiB3aXBlIHBhcnRpYWxcbiAgLy8gZGF0YSAoREVMRVRFIC9zeW5jL3BhdGllbnQve2lkX25vfSkgd2l0aG91dCB1cyBoYXZpbmcgdG8gc2VuZCBpdFxuICAvLyBiYWNrIHRocm91Z2ggY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UuXG4gIF9hY3RpdmVTeW5jQ3R4ID0geyBiYWNrZW5kLCBzeW5jQXBpS2V5LCBwYXRpZW50SWQ6IHBhdGllbnRPdmVycmlkZS5pZF9ubyB9O1xuXG4gIC8vIFdhbGwtY2xvY2sgc3RhcnQgdGltZSBcdTIwMTQgdXNlZCB0byBjb21wdXRlIGVsYXBzZWQgc2Vjb25kcyBmb3IgdGhlXG4gIC8vIGZpbmFsIHN0YXR1cyBsaW5lIChcIlx1N0UzRFx1ODAxN1x1NjY0MiAxMi4zIFx1NzlEMlwiKS4gU3Rhc2ggb24gYSBsb2NhbCBzbyB3ZSBjYW5cbiAgLy8gcmVhY2ggaXQgZnJvbSB0aGUgY29tcGxldGlvbiBtZXNzYWdlIGF0IHRoZSB2ZXJ5IGVuZC5cbiAgY29uc3QgX3QwID0gRGF0ZS5ub3coKTtcbiAgLy8gUGVyLXBoYXNlIHRpbWluZ3MsIHN1cmZhY2VkIGludG8gdGhlIHBvcHVwJ3MgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIiBzbyB0aGUgdXNlclxuICAvLyBjYW4gc2VlIGV4YWN0bHkgd2hlcmUgdGltZSBpcyBnb2luZy4gRWFjaCBlbnRyeTogeyBuYW1lLCBtcyB9LlxuICBjb25zdCBfcGhhc2VzID0gW107XG4gIGxldCBfcGhhc2VTdGFydCA9IF90MDtcbiAgY29uc3QgX21hcmtQaGFzZSA9IChuYW1lKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBfcGhhc2VzLnB1c2goeyBuYW1lLCBtczogbm93IC0gX3BoYXNlU3RhcnQgfSk7XG4gICAgX3BoYXNlU3RhcnQgPSBub3c7XG4gIH07XG4gIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgcnVubmluZzogdHJ1ZSwgcHJvZ3Jlc3M6IFwiXHVEODNEXHVERTgwIFx1OTU4Qlx1NTlDQlx1NTNENlx1NUY5N1x1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QVx1OENDN1x1NjU5OVx1MjAyNlwiLCBwaGFzZTogXCJpbml0XCIsXG4gICAgc3RhcnRlZDogX3QwLCB0b3RhbFJlc291cmNlczogMCwgaG9zdDogTkhJX0hPU1QsIGVycm9yczogW10sXG4gIH0pO1xuXG4gIC8vIFN0ZXAgMTogZmV0Y2ggYWxsIGVuZHBvaW50cyBpbiBQQVJBTExFTCBpbnNpZGUgdGhlIE5ISSB0YWIuIFJ1bm5pbmcgaW5cbiAgLy8gdGFiIGNvbnRleHQgbWVhbnMgc2FtZS1vcmlnaW4gY29va2llcyBhcmUgc2VudCBhdXRvbWF0aWNhbGx5IFx1MjAxNCBmZXRjaFxuICAvLyBmcm9tIHRoZSBTVyB3b3VsZCBiZSBjcm9zcy1vcmlnaW4gYW5kIFNhbWVTaXRlIGJsb2NrcyB0aGUgc2Vzc2lvblxuICAvLyBjb29raWUsIGhlbmNlIHdlIGdvdCBcInNlc3Npb24gZXhwaXJlZFwiIGV2ZW4gd2hlbiBsb2dnZWQgaW4uXG4gIC8vIFBhc3Mgb25seSBzZXJpYWxpc2FibGUgZGF0YSAocGF0aHMsIG1ldGhvZCwgbmFtZSk7IGFkYXB0ZXJzIHN0YXkgaW4gU1cuXG4gIC8vIEluamVjdCBJU08tZGF0ZSByYW5nZSBpbnRvIGVhY2ggZW5kcG9pbnQgdGhhdCBzdXBwb3J0cyBpdCAoY29udmVydHNcbiAgLy8gdG8gXHU2QzExXHU1NzBCIGZvcm1hdCB2aWEgaXNvVG9ST0MpLiBTa2lwcGVkIGVuZHBvaW50cyBrZWVwIHRoZWlyIGRlZmF1bHRcbiAgLy8gTkhJLXNpZGUgd2luZG93ICgxLTIgeWVhcnMgZGVwZW5kaW5nIG9uIHRoZSBwYWdlKS5cbiAgY29uc3QgZmV0Y2hTcGVjID0gTkhJX0FQSV9FTkRQT0lOVFMubWFwKChlcCkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSBlcC5zdXBwb3J0c0RhdGVSYW5nZSA/IGFwcGx5RGF0ZVJhbmdlVG9QYXRoKGVwLnBhdGgsIGRhdGVSYW5nZSkgOiBlcC5wYXRoO1xuICAgIHJldHVybiB7IG5hbWU6IGVwLm5hbWUsIHVybDogQkFTRSArIHBhdGgsIG1ldGhvZDogXCJHRVRcIiB9O1xuICB9KTtcbiAgaWYgKGRhdGVSYW5nZSAmJiAoZGF0ZVJhbmdlLnN0YXJ0IHx8IGRhdGVSYW5nZS5lbmQpKSB7XG4gICAgY29uc29sZS5sb2coXCJbTkhJIEFQSSBzeW5jXSBkYXRlIHJhbmdlOlwiLFxuICAgICAgYCR7ZGF0ZVJhbmdlLnN0YXJ0IHx8IFwiKHVuYm91bmRlZClcIn0gXHUyMTkyICR7ZGF0ZVJhbmdlLmVuZCB8fCBcIih1bmJvdW5kZWQpXCJ9YCk7XG4gIH1cblxuICBsZXQgc2V0dGxlZFJhdztcbiAgdHJ5IHtcbiAgICBbeyByZXN1bHQ6IHNldHRsZWRSYXcgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiBhc3luYyAoc3BlY3MpID0+IHtcbiAgICAgICAgLy8gTkhJIGF1dGg6IGNvb2tpZXMgKyBKV1QgaW4gc2Vzc2lvblN0b3JhZ2UuIFRoZSBTUEEncyBheGlvcyBzZXRzXG4gICAgICAgIC8vIGBBdXRob3JpemF0aW9uOiBCZWFyZXIgPHRva2VuPmAgb24gZXZlcnkgQVBJIGNhbGwuIFNlc3Npb25cbiAgICAgICAgLy8gY29va2llcyBhbG9uZSByZXR1cm4gNDAxLlxuICAgICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIFt7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH1dO1xuICAgICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG5cbiAgICAgICAgLy8gRGV0ZWN0IElETEUvdGltZW91dCBwYWdlIGFscmVhZHkgcmVkaXJlY3RlZCBvbiB0aGlzIHRhYi5cbiAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICAgIHJldHVybiBbeyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDYwLXNlY29uZCB0aW1lb3V0IHBlciBmZXRjaCBcdTIwMTQgc29tZSBOSEkgZW5kcG9pbnRzIChlbmNvdW50ZXJzLFxuICAgICAgICAvLyBtZWRzKSB0YWtlIDIwKyBzZWNvbmRzLlxuICAgICAgICBhc3luYyBmdW5jdGlvbiBmZXRjaE9uZShzLCBtcykge1xuICAgICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCBtcyk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChzLnVybCwge1xuICAgICAgICAgICAgICBtZXRob2Q6IHMubWV0aG9kLFxuICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgICBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGNvbnN0IGN0ID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykge1xuICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgICAgaWYgKCFjdC5pbmNsdWRlcyhcImFwcGxpY2F0aW9uL2pzb25cIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogYG5vbi1KU09OIChjdD0ke2N0fSlgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgYm9keTtcbiAgICAgICAgICAgIHRyeSB7IGJvZHkgPSBhd2FpdCByLmpzb24oKTsgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHsgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJKU09OIHBhcnNlOiBcIiArIGUubWVzc2FnZSB9OyB9XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGJvZHkgfTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgaWYgKGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIpIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwidGltZW91dCA2MHNcIiB9O1xuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb25jdXJyZW5jeS1saW1pdGVkIGV4ZWN1dGlvbjogbWF4IDMgaW4gZmxpZ2h0IGF0IG9uY2UuIE5ISSdzXG4gICAgICAgIC8vIGFidXNlIGRldGVjdGlvbiBibG9ja3MgYnVyc3RzOyB3aXRoIDExIHBhcmFsbGVsIGZldGNoZXMgaXRcbiAgICAgICAgLy8gdGhyb3R0bGVkIHRoZSBzZXNzaW9uIGFuZCByZWRpcmVjdGVkIHRvIElIS0UzMDAxUzk5X0lETEUuXG4gICAgICAgIC8vIDMgYXQgYSB0aW1lICsgMjAwbXMgaml0dGVyIGlzIGdlbnRsZSBlbm91Z2ggZm9yIDEtc2hvdCBzeW5jLlxuICAgICAgICBjb25zdCBDT05DVVJSRU5DWSA9IDM7XG4gICAgICAgIGNvbnN0IEpJVFRFUl9NUyA9IDIwMDtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IG5ldyBBcnJheShzcGVjcy5sZW5ndGgpO1xuICAgICAgICBsZXQgbmV4dElkeCA9IDA7XG4gICAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgICB3aGlsZSAobmV4dElkeCA8IHNwZWNzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgaSA9IG5leHRJZHgrKztcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHIgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogSklUVEVSX01TKSk7XG4gICAgICAgICAgICByZXN1bHRzW2ldID0gYXdhaXQgZmV0Y2hPbmUoc3BlY3NbaV0sIDYwMDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd29ya2VycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkNVUlJFTkNZICYmIHcgPCBzcGVjcy5sZW5ndGg7IHcrKykge1xuICAgICAgICAgIHdvcmtlcnMucHVzaCh3b3JrZXIoKSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod29ya2Vycyk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSxcbiAgICAgIGFyZ3M6IFtmZXRjaFNwZWNdLFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBleGVjdXRlU2NyaXB0IGZhaWxlZDogJHtlLm1lc3NhZ2V9YCk7XG4gIH1cblxuICAvLyBEZXRlY3Qgc2Vzc2lvbiBleHBpcmVkIGFjcm9zcyByZXN1bHRzLlxuICBpZiAoc2V0dGxlZFJhdy5zb21lKChyKSA9PiByLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICB9XG5cbiAgY29uc3QgZXJyb3JzID0gW107XG5cbiAgLy8gR2VuZXJpYyBsaXN0IGV4dHJhY3Rpb246IGhhbmRsZXMgYWxsIG9ic2VydmVkIE5ISSBzaGFwZXMuXG4gIC8vICAgLSBQbGFpbiBhcnJheSAoSUhLRTM0MDkgbGFiKVxuICAvLyAgIC0ge3NwX0lIS0U8WD5fZGF0YTogWy4uLl19ICAobWVkaWNhdGlvbnMsIGFsbGVyZ2llcylcbiAgLy8gICAtIHt3ZXN0ZXJuX2RhdGEsIGNoaW5lc2VfZGF0YSwgZGVudGlzdF9kYXRhOiBbLi4uXX0gKGVuY291bnRlciBsaXN0LFxuICAvLyAgICAgc3BsaXQgYnkgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIgXHUyMDE0IHdlIHdhbnQgYWxsIHRocmVlKVxuICAvLyBGb3IgbXVsdGktYXJyYXkgc2hhcGVzIHdlIG1lcmdlIGFsbCBhcnJheXMgYW5kIHRhZyBlYWNoIGl0ZW0gd2l0aFxuICAvLyBgX19zZWN0aW9uYCAodGhlIHNvdXJjZSBrZXkpIHNvIGFkYXB0ZXJzIGNhbiBkaXNhbWJpZ3VhdGUuXG4gIGZ1bmN0aW9uIGV4dHJhY3RMaXN0KGJvZHkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShib2R5KSkgcmV0dXJuIGJvZHk7XG4gICAgaWYgKCFib2R5IHx8IHR5cGVvZiBib2R5ICE9PSBcIm9iamVjdFwiKSByZXR1cm4gW107XG4gICAgbGV0IGFycmF5S2V5cyA9IE9iamVjdC5lbnRyaWVzKGJvZHkpLmZpbHRlcigoW18sIHZdKSA9PiBBcnJheS5pc0FycmF5KHYpKTtcbiAgICBpZiAoYXJyYXlLZXlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgIGlmIChhcnJheUtleXMubGVuZ3RoID09PSAxKSByZXR1cm4gYXJyYXlLZXlzWzBdWzFdO1xuICAgIC8vIE11bHRpcGxlIGFycmF5cyBcdTIwMTQgZHJvcCBVSS1oZWxwZXIgYXJyYXlzIChkcm9wZG93biBvcHRpb25zLCBzb3J0XG4gICAgLy8gc2VsZWN0b3JzLCBsb29rdXAgdGFibGVzKS4gTkhJIG1peGVzIHRoZW0gaW50byB0aGUgc2FtZSByZXNwb25zZVxuICAgIC8vIChlLmcuIGltYWdpbmcgcmV0dXJucyBzcF9JSEtFMzQwOFMwMV9kYXRhICsgaWNkOWNtX3NlbGVjdCkuXG4gICAgY29uc3QgSEVMUEVSX1JFID0gL3NlbGVjdHxvcHRpb258ZHJvcGRvd258ZmlsdGVyfHNvcnR8bG9va3VwL2k7XG4gICAgY29uc3QgZGF0YUtleXMgPSBhcnJheUtleXMuZmlsdGVyKChba10pID0+ICFIRUxQRVJfUkUudGVzdChrKSk7XG4gICAgaWYgKGRhdGFLZXlzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGRhdGFLZXlzWzBdWzFdO1xuICAgIGlmIChkYXRhS2V5cy5sZW5ndGggPT09IDApIHJldHVybiBhcnJheUtleXNbMF1bMV07IC8vIGZhbGxiYWNrXG4gICAgYXJyYXlLZXlzID0gZGF0YUtleXM7XG4gICAgLy8gTXVsdGlwbGUgZGF0YSBhcnJheXMgKGUuZy4gd2VzdGVybl9kYXRhL2NoaW5lc2VfZGF0YS9kZW50aXN0X2RhdGEpXG4gICAgLy8gXHUyMDE0IG1lcmdlIHdpdGggX19zZWN0aW9uIHRhZyBzbyBhZGFwdGVycyBjYW4gZGlzYW1iaWd1YXRlLlxuICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIGFycmF5S2V5cykge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHYpIHtcbiAgICAgICAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICBtZXJnZWQucHVzaCh7IC4uLml0ZW0sIF9fc2VjdGlvbjogayB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXJnZWQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkO1xuICB9XG5cbiAgLy8gQXBwbHkgU1ctc2lkZSBhZGFwdGVycyB0byBlYWNoIGVuZHBvaW50J3MgYm9keS5cbiAgY29uc3Qgc2V0dGxlZCA9IHNldHRsZWRSYXcubWFwKChyLCBpKSA9PiB7XG4gICAgY29uc3QgZXAgPSBOSElfQVBJX0VORFBPSU5UU1tpXTtcbiAgICBpZiAoci5lcnJvcikge1xuICAgICAgcmV0dXJuIHsgc3RhdHVzOiBcInJlamVjdGVkXCIsIHJlYXNvbjogeyBtZXNzYWdlOiBgJHtlcC5uYW1lfTogJHtyLmVycm9yfWAgfSB9O1xuICAgIH1cbiAgICBjb25zdCBsaXN0ID0gZXh0cmFjdExpc3Qoci5ib2R5KTtcbiAgICAvLyBBZGFwdGVycyByZXR1cm4gZWl0aGVyOlxuICAgIC8vICAgLSBvbmUgaXRlbSAgIChtb3N0IGFkYXB0ZXJzIFx1MjAxNCBsYWJzLCBtZWRzLCBlbmNvdW50ZXJzLCBpbWFnaW5nKVxuICAgIC8vICAgLSBudWxsL3VuZGVmaW5lZCAoc2tpcClcbiAgICAvLyAgIC0gYXJyYXkgb2YgaXRlbXMgKGFkYXB0QWR1bHRQcmV2ZW50aXZlIFx1MjAxNCB1bmZvbGRzIG9uZSBzY3JlZW5pbmdcbiAgICAvLyAgICAgcm93IGludG8gfjE1IE9ic2VydmF0aW9uIGVudHJpZXMpXG4gICAgLy8gRmxhdC1oYW5kbGUgYm90aCBzaGFwZXMgc28gZWFjaCBhZGFwdGVyIGNhbiBwaWNrIHdoYXRldmVyJ3MgY2xlYXJlc3QuXG4gICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGxpc3QpIHtcbiAgICAgIGNvbnN0IHIgPSBlcC5hZGFwdChpdCk7XG4gICAgICBpZiAociA9PT0gbnVsbCB8fCByID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocikpIHtcbiAgICAgICAgZm9yIChjb25zdCB4IG9mIHIpIGlmICh4KSBpdGVtcy5wdXNoKHgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbXMucHVzaChyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gU25hcHNob3QgYSBib2R5IHNhbXBsZSBmb3Igc2hhcGVzIHdoZXJlIGFkYXB0ZXIgcmVqZWN0ZWQgZXZlcnl0aGluZ1xuICAgIC8vIFx1MjAxNCB1c2VkIGJ5IHRoZSBkaWFnbm9zdGljIGJyZWFrZG93biBpbiBzdGVwIDIuXG4gICAgbGV0IGJvZHlTYW1wbGUgPSBudWxsO1xuICAgIGlmIChsaXN0Lmxlbmd0aCA+IDAgJiYgaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBJbmNsdWRlIHRoZSBGSVJTVCBJVEVNIChmdWxsIGtleXMrdmFsdWVzKSBzbyB3ZSBjYW4gYnVpbGQgdGhlXG4gICAgICAvLyBjb3JyZWN0IGFkYXB0ZXIgd2l0aG91dCBhbm90aGVyIHJvdW5kLXRyaXAuIE5ISSBpdGVtcyBtYXkgaW5jbHVkZVxuICAgICAgLy8gUElJOyB0aGUgdXNlciBpbnNwZWN0cyB0aGlzIGxvY2FsbHkgdmlhIHNlcnZpY2Utd29ya2VyIGRldnRvb2xzLlxuICAgICAgYm9keVNhbXBsZSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdG9wTGV2ZWxLZXlzOiBBcnJheS5pc0FycmF5KHIuYm9keSkgPyBudWxsIDogT2JqZWN0LmtleXMoci5ib2R5IHx8IHt9KS5zbGljZSgwLCAxMCksXG4gICAgICAgIHdhc0FycmF5OiBBcnJheS5pc0FycmF5KHIuYm9keSksXG4gICAgICAgIGZpcnN0SXRlbTogbGlzdFswXSA/PyBudWxsLFxuICAgICAgICBzZWNvbmRJdGVtOiBsaXN0WzFdID8/IG51bGwsXG4gICAgICB9KS5zbGljZSgwLCA0MDAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc3RhdHVzOiBcImZ1bGZpbGxlZFwiLCB2YWx1ZTogeyBlcCwgaXRlbXMsIHJhd19jb3VudDogbGlzdC5sZW5ndGgsIGJvZHlTYW1wbGUsIHJhd0xpc3Q6IGxpc3QgfSB9O1xuICB9KTtcblxuICBfbWFya1BoYXNlKFwibmhpLXBhcmFsbGVsXCIpO1xuXG4gIC8vIFN0ZXAgMWE6IGVuY291bnRlciBkZXRhaWwgZmFuLW91dCAoSUhLRTMzMDNTMDIpIFx1MjE5MiBjbGFzc2lmeSBlYWNoXG4gIC8vIElIS0UzMzAzUzAxIHZpc2l0IGFzIEFNQiAvIEVNRVIgLyBJTVAgdmlhIGhvc3BfREFUQV9UWVBFX05BTUUuXG4gIC8vIExpc3QgZW5kcG9pbnQgZG9lc24ndCBleHBvc2UgXHU2MDI1XHU4QTNBIGRpc3RpbmN0aW9uOyBkZXRhaWwgZG9lcy4gV2UgcmUtXG4gIC8vIGFkYXB0IGVhY2ggZW5jb3VudGVyIGl0ZW0gd2l0aCB0aGUgZGlzY292ZXJlZCBjbGFzcyBiZWZvcmUgdGhlXG4gIC8vIGJhY2tlbmQgdXBsb2FkIHN0ZXAuXG4gIGNvbnN0IGVuY0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcImVuY291bnRlcnNcIik7XG4gIGlmIChlbmNJZHggPj0gMCAmJiBzZXR0bGVkW2VuY0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtlbmNJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTVDMzFcdTkxQUJcdTdEMDBcdTkzMDRcdThBNzNcdTYwQzVcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkZXRhaWxNYXAgPSBhd2FpdCBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBSZS1hZGFwdCB3aXRoIGNsYXNzSGludCBmcm9tIGRldGFpbDsgZmFsbCBiYWNrIHRvIEFNQi5cbiAgICAgICAgY29uc3QgcmVBZGFwdGVkID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlzaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZGV0YWlsID0gZGV0YWlsTWFwPy5nZXQoaSkgfHwgbnVsbDtcbiAgICAgICAgICBjb25zdCBjbHMgPSBfY2xhc3NGcm9tUzAyRGV0YWlsKGRldGFpbCkgfHwgXCJBTUJcIjtcbiAgICAgICAgICBjb25zdCBpdCA9IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UodmlzaXRzW2ldLCBjbHMpO1xuICAgICAgICAgIGlmIChpdCkgcmVBZGFwdGVkLnB1c2goaXQpO1xuICAgICAgICB9XG4gICAgICAgIHNldHRsZWRbZW5jSWR4XS52YWx1ZS5pdGVtcyA9IHJlQWRhcHRlZDtcbiAgICAgICAgc2V0dGxlZFtlbmNJZHhdLnZhbHVlLnJhd19jb3VudCA9IHJlQWRhcHRlZC5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBlbmNvdW50ZXIgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImVuY291bnRlci1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAxYjogbWVkaWNhdGlvbnMgbmVlZCBhIDItc3RlcCBmZXRjaCBcdTIwMTQgSUhLRTMzMDZTMDEgb25seSByZXR1cm5zXG4gIC8vIHZpc2l0IG1ldGFkYXRhIChkYXRlLCBJQ0QsIGhvc3BpdGFsKSwgbm8gZHJ1ZyBuYW1lcy4gRHJ1Z3MgbGl2ZSBhdFxuICAvLyBJSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD08cm93X0lEPiZjdHlwZT0yIHVuZGVyXG4gIC8vIGloa2UzMzA2UzAyX21haW5fZGF0YVsqXS5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QuIEZhbiBvdXQgZGV0YWlsXG4gIC8vIGZldGNoZXMgaW5zaWRlIHRoZSBzYW1lIHRhYiBjb250ZXh0IChjb29raWVzICsgSldUKSwga2VlcGluZ1xuICAvLyBjb25jdXJyZW5jeSBsaW1pdGVkIHNvIE5ISSBkb2Vzbid0IElETEUtcmVkaXJlY3QgdXMuXG4gIC8vIFN0ZXAgMWM6IGltYWdpbmcgbmVlZHMgSUhLRTM0MDhTMDIgZm9yIHRoZSBhY3R1YWwgcmVwb3J0IG5hcnJhdGl2ZS5cbiAgLy8gTGlzdCBlbmRwb2ludCBvbmx5IGhhcyBvcmRlciBtZXRhZGF0YTsgY3R5cGUgcGFyYW0gbWlycm9ycyB0aGVcbiAgLy8gdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuICBjb25zdCBpbWdJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJpbWFnaW5nXCIpO1xuICBpZiAoaW1nSWR4ID49IDAgJiYgc2V0dGxlZFtpbWdJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbaW1nSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XHU1ODMxXHU1NDRBXHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVwb3J0cyA9IGF3YWl0IF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUuaXRlbXMgPSByZXBvcnRzO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVwb3J0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGltYWdpbmcgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImltYWdpbmctZGV0YWlsXCIpO1xuXG4gIGNvbnN0IG1lZElkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcIm1lZGljYXRpb25zXCIpO1xuICBpZiAobWVkSWR4ID49IDAgJiYgc2V0dGxlZFttZWRJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU3NTI4XHU4NUU1XHU2NjBFXHU3RDMwXHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZHJ1Z0l0ZW1zID0gYXdhaXQgX2ZldGNoTWVkaWNhdGlvbkRldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS5pdGVtcyA9IGRydWdJdGVtcztcbiAgICAgICAgLy8gcmF3X2NvdW50IG5vdyByZWZsZWN0cyB0aGUgKmRydWctbGV2ZWwqIGNvdW50IGZvciB0aGUgYnJlYWtkb3duXG4gICAgICAgIC8vICh2aXNpdHMgXHUyMTkyIGRydWdzKS4gS2VlcCB0aGUgdmlzaXQgY291bnQgaW4gYSBzaWRlIGZpZWxkIGZvciBkZWJ1Zy5cbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUucmF3X2NvdW50ID0gZHJ1Z0l0ZW1zLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYG1lZGljYXRpb25zIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJtZWRpY2F0aW9uLWRldGFpbFwiKTtcblxuICAvLyBTdGVwIDI6IGFnZ3JlZ2F0ZSBpdGVtcyBieSBwYWdlX3R5cGUsIFBPU1QgdG8gYmFja2VuZC5cbiAgY29uc3QgYnlUeXBlID0ge307XG4gIGxldCByYXdfdG90YWwgPSAwO1xuICBsZXQgYWRhcHRlZF90b3RhbCA9IDA7XG4gIC8vIFBlci1lbmRwb2ludCBicmVha2Rvd24gc28gdGhlIGZpbmFsIHN0YXR1cyBjYW4gdGVsbCB1c2VyIGV4YWN0bHlcbiAgLy8gd2hpY2ggZW5kcG9pbnRzIGNhbWUgYmFjayBlbXB0eSAvIG1pcy1zaGFwZWQgXHUyMDE0IG11Y2ggbW9yZSB1c2VmdWwgdGhhblxuICAvLyBhIHNpbmdsZSBhZ2dyZWdhdGVkIG51bWJlci5cbiAgLy8gQnJlYWtkb3duIHNob3duIHRvIHRoZSB1c2VyIHVuZGVyIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIuIFVzZSB0aGUgQ2hpbmVzZSBsYWJlbFxuICAvLyB3aGVuIGtub3duOyBvbmx5IGZhbGwgYmFjayB0byB0aGUgcmF3IGVuZHBvaW50IG5hbWUgZm9yIHVubWFwcGVkXG4gIC8vIChuZXdseSBhZGRlZCkgZW5kcG9pbnRzLiBFbXB0eS1yZXN1bHQgZW5kcG9pbnRzIGFyZSBvbWl0dGVkIGZyb21cbiAgLy8gdGhlIHN1Y2Nlc3Mgc3VtbWFyeSBlbnRpcmVseSBcdTIwMTQgdGhleSBhZGQgbm9pc2UuIEVycm9ycyBhbHdheXMgc2hvd1xuICAvLyBzbyB0aGUgdXNlciBrbm93cyBzb21ldGhpbmcgZGlkbid0IGNvbWUgdGhyb3VnaC5cbiAgY29uc3QgYnJlYWtkb3duID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0dGxlZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGVwID0gTkhJX0FQSV9FTkRQT0lOVFNbaV07XG4gICAgY29uc3QgcyA9IHNldHRsZWRbaV07XG4gICAgY29uc3QgbGFiZWwgPSBFTkRQT0lOVF9MQUJFTF9aSFtlcC5uYW1lXSA/PyBlcC5uYW1lO1xuICAgIGlmIChzLnN0YXR1cyA9PT0gXCJyZWplY3RlZFwiKSB7XG4gICAgICBlcnJvcnMucHVzaChgJHtlcC5uYW1lfTogJHtzLnJlYXNvbi5tZXNzYWdlfWApO1xuICAgICAgYnJlYWtkb3duLnB1c2goYFx1Mjc0QyAke2xhYmVsfVx1RkYxQVx1NTNENlx1NUY5N1x1NTkzMVx1NjU1N2ApO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHsgaXRlbXMsIHJhd19jb3VudCB9ID0gcy52YWx1ZTtcbiAgICByYXdfdG90YWwgKz0gcmF3X2NvdW50O1xuICAgIGFkYXB0ZWRfdG90YWwgKz0gaXRlbXMubGVuZ3RoO1xuICAgIGlmIChyYXdfY291bnQgPT09IDApIGNvbnRpbnVlOyAvLyBub3RoaW5nIHRvIHNob3dcbiAgICBpZiAoaXRlbXMubGVuZ3RoID4gcmF3X2NvdW50ICYmIHJhd19jb3VudCA+IDApIHtcbiAgICAgIC8vIDEtdG8tbWFueSBhZGFwdGVyIChlLmcuIGFkdWx0X3ByZXZlbnRpdmU6IG9uZSBzY3JlZW5pbmcgcm93IFx1MjE5MlxuICAgICAgLy8gfjE4IE9ic2VydmF0aW9ucykuIFNob3cgYm90aCBudW1iZXJzIHNvIHRoZSB1c2VyIHVuZGVyc3RhbmRzXG4gICAgICAvLyB3aHkgb25lIHJlY29yZCBwcm9kdWNlZCBtYW55LlxuICAgICAgYnJlYWtkb3duLnB1c2goYCR7bGFiZWx9XHVGRjFBJHtyYXdfY291bnR9IFx1N0I0NiBcdTIxOTIgJHtpdGVtcy5sZW5ndGh9IFx1OTgwNWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVha2Rvd24ucHVzaChgJHtsYWJlbH1cdUZGMUEke2l0ZW1zLmxlbmd0aH0gXHU3QjQ2YCk7XG4gICAgfVxuICAgIC8vIFNhdmUgYm9keSBzYW1wbGUgZm9yIGZpcnN0IGVuZHBvaW50IHdpdGggcmF3PjAgYnV0IGFkYXB0ZWQ9MCAoYWRhcHRlclxuICAgIC8vIG1pc21hdGNoKSBzbyB3ZSBjYW4gaXRlcmF0ZS4gU3RvcmVkIHVuZGVyIGNocm9tZS5zdG9yYWdlLmxvY2FsIGZvclxuICAgIC8vIGluc3BlY3Rpb24gdmlhIHNlcnZpY2Ugd29ya2VyIERldlRvb2xzLlxuICAgIGlmIChyYXdfY291bnQgPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICBbYF9fc2FtcGxlQm9keV8ke2VwLm5hbWV9YF06IHMudmFsdWUuYm9keVNhbXBsZSB8fCBcIm4vYVwiLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2gge31cbiAgICB9XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgKGJ5VHlwZVtlcC5wYWdlX3R5cGVdID0gYnlUeXBlW2VwLnBhZ2VfdHlwZV0gfHwgW10pLnB1c2goLi4uaXRlbXMpO1xuICB9XG5cbiAgLy8gTWFzayBnYXRlIGlzIHJlYWQgZnJlc2ggcGVyIHN5bmMgXHUyMDE0IGRlZmF1bHRzIE9GRiBwZXIgdGhlIGRpc2N1c3Npb25cbiAgLy8gKGNpdGl6ZW4tc2VsZi1kb3dubG9hZCBkb2Vzbid0IG5lZWQgYW5vbnltaXphdGlvbikuIFdoZW4gT04sIGFsc29cbiAgLy8gc2NydWIgdGhlIHVzZXIncyByZWFsIG5hbWUgb3V0IG9mIGFueSBOSEkgbmFycmF0aXZlIGZpZWxkIGJlZm9yZVxuICAvLyBpdCBmbG93cyBpbnRvIHRoZSBtYXBwZXIuXG4gIGNvbnN0IG1hc2tFbmFibGVkID0gYXdhaXQgX2lzTWFza0VuYWJsZWQoKTtcbiAgaWYgKG1hc2tFbmFibGVkICYmIHBhdGllbnRPdmVycmlkZS5uYW1lKSB7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoYnlUeXBlKSkge1xuICAgICAgYnlUeXBlW2tleV0gPSBfcmVwbGFjZU5hbWVEZWVwKGJ5VHlwZVtrZXldLCBwYXRpZW50T3ZlcnJpZGUubmFtZSwgcmVwbGFjZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIGxldCB0b3RhbCA9IDA7XG4gIGxldCBfbG9jYWxGaWxlbmFtZSA9IG51bGw7XG4gIGlmIChtb2RlID09PSBcImxvY2FsXCIpIHtcbiAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNFXHVEREVDIFx1OEY0OVx1NjNEQlx1NzBCQVx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1NkE5NFx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogMCB9KTtcbiAgICBsZXQgYnVuZGxlO1xuICAgIHRyeSB7XG4gICAgICBidW5kbGUgPSBfYXNzZW1ibGVMb2NhbEJ1bmRsZShieVR5cGUsIHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9ycy5wdXNoKGBsb2NhbCBtYXBwaW5nOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIGJ1bmRsZSA9IG51bGw7XG4gICAgfVxuICAgIGlmIChidW5kbGUpIHtcbiAgICAgIHRvdGFsID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBgXHVEODNEXHVEQ0JFIFx1NkU5Nlx1NTA5OSAke3RvdGFsfSBcdTdCNDYgRkhJUiBcdThDQzdcdTZFOTBcdTIwMjZgLCB0b3RhbFJlc291cmNlczogdG90YWwgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkbCA9IGF3YWl0IF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sIGRhdGVSYW5nZSk7XG4gICAgICAgIF9sb2NhbEZpbGVuYW1lID0gZGwuZmlsZW5hbWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBzdGFzaCBidW5kbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBCdWlsZCB0aGUgb3ZlcnJpZGUgd2Ugc2VuZCB0byBiYWNrZW5kIHdpdGggdGhlIG1heWJlLW1hc2tlZCBuYW1lXG4gICAgLy8gc28gYmFja2VuZCdzIGF1dG8tY3JlYXRlZCBQYXRpZW50ICsgdGhlIHBlci1pdGVtIHN1YmplY3QuZGlzcGxheVxuICAgIC8vIHNlZSB0aGUgc2FtZSB2YWx1ZSB0aGUgdXNlciBvcHRlZCBpbnRvLiBJdGVtcyB0aGVtc2VsdmVzIHdlcmVcbiAgICAvLyBhbHJlYWR5IHNjcnViYmVkIGFib3ZlIChieVR5cGUgcGFzcyksIHNvIHRoaXMganVzdCBjb3ZlcnMgdGhlXG4gICAgLy8gb3ZlcnJpZGUtZGVyaXZlZCBQYXRpZW50LlxuICAgIGNvbnN0IHVwbG9hZE92ZXJyaWRlID0gbWFza0VuYWJsZWQgJiYgcGF0aWVudE92ZXJyaWRlLm5hbWVcbiAgICAgID8geyAuLi5wYXRpZW50T3ZlcnJpZGUsIG5hbWU6IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lKSB9XG4gICAgICA6IHBhdGllbnRPdmVycmlkZTtcbiAgICBmb3IgKGNvbnN0IFtwYWdlX3R5cGUsIGl0ZW1zXSBvZiBPYmplY3QuZW50cmllcyhieVR5cGUpKSB7XG4gICAgICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1MkIwNlx1RkUwRiBcdTRFMEFcdTUwQjMgJHtwYWdlX3R5cGV9XHVGRjA4JHtpdGVtcy5sZW5ndGh9IFx1N0I0Nlx1RkYwOVx1MjAyNmAsXG4gICAgICAgIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IF9wb3N0U3RydWN0dXJlZChiYWNrZW5kLCBwYWdlX3R5cGUsIGl0ZW1zLCBzeW5jQXBpS2V5LCB1cGxvYWRPdmVycmlkZSk7XG4gICAgICAgIHRvdGFsICs9IGRhdGEuY291bnQgfHwgMDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYHVwbG9hZCAke3BhZ2VfdHlwZX06ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFmdGVyIGJhY2tlbmQgdXBsb2FkLCBhbHNvIGZldGNoIGEgc25hcHNob3Qgb2YgdGhlIHBhdGllbnQncyBmdWxsXG4gICAgLy8gY3VtdWxhdGl2ZSBGSElSIEJ1bmRsZSBhbmQgc3Rhc2ggaXQgZm9yIHRoZSBwb3B1cCdzIFwiXHVEODNEXHVEQ0U1IFx1NEUwQlx1OEYwOVwiIGJ1dHRvbi5cbiAgICAvLyBUaGlzIGlzIHdoYXQgYC9maGlyL2V4cG9ydGAgcmV0dXJucyBcdTIwMTQgdGhlIGJhY2tlbmQncyBjb21wbGV0ZSB2aWV3XG4gICAgLy8gb2YgdGhpcyBwYXRpZW50ICh0aGlzIHN5bmMgKyBhbnkgcHJpb3Igc3luY3MpLCBhcyBvcHBvc2VkIHRvIGxvY2FsXG4gICAgLy8gbW9kZSdzIFwianVzdCB0aGlzIHN5bmNcIiBidW5kbGUuXG4gICAgLy9cbiAgICAvLyBTa2lwIHN0YXNoaW5nIGVudGlyZWx5IHdoZW4gdGhlIHVwbG9hZCBwYXNzIHByb2R1Y2VkIG5vIHJlc291cmNlc1xuICAgIC8vIFx1MjAxNCBleHBvcnRpbmcgMCBlbnRyaWVzIHRoZW4gc3Rhc2hpbmcgdGhlbSBjcmVhdGVzIGEgbWlzbGVhZGluZ1xuICAgIC8vIFwiXHU2NzJDXHU1NzMwIFx1MjcxMyAwIFx1N0I0NlwiIGluZGljYXRvciBhbmQgYSB1c2VsZXNzIFx1RDgzRFx1RENFNCBcdTRFMEFcdTUwQjMgYnV0dG9uLlxuICAgIGlmIChwYXRpZW50T3ZlcnJpZGUuaWRfbm8gJiYgdG90YWwgPiAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogXCJcdUQ4M0RcdURDRTYgXHU1M0Q2XHU1Rjk3XHU1RjhDXHU3QUVGXHU1QjhDXHU2NTc0XHU4Q0M3XHU2NTk5XHUyMDI2XCIsIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCB9KTtcbiAgICAgICAgLy8gQmFja2VuZCBzdG9yZXMgUGF0aWVudCB1bmRlciBkZXJpdmVQYXRpZW50SWQocmF3SWQpLCBzbyB0aGVcbiAgICAgICAgLy8gZXhwb3J0IGZpbHRlciBtdXN0IHVzZSB0aGUgaGFzaGVkIGZvcm0gXHUyMDE0IHF1ZXJ5aW5nIHdpdGggdGhlXG4gICAgICAgIC8vIHJhdyBuYXRpb25hbCBJRCBtYXRjaGVzIHplcm8gcm93cyBldmVuIHdoZW4gZGF0YSBpcyB0aGVyZS5cbiAgICAgICAgY29uc3QgZmhpclBpZCA9IGRlcml2ZVBhdGllbnRJZChwYXRpZW50T3ZlcnJpZGUuaWRfbm8pO1xuICAgICAgICBjb25zdCBleHBVcmwgPSBgJHtiYWNrZW5kfS9maGlyL2V4cG9ydD9wYXRpZW50PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWA7XG4gICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChleHBVcmwsIHtcbiAgICAgICAgICBoZWFkZXJzOiBzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9LFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHIub2spIHtcbiAgICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAvLyBQYXNzIHRoZSBzYW1lIGRhdGVSYW5nZSB0aGUgdXNlciBwaWNrZWQgdGhyb3VnaCBzbyB0aGVcbiAgICAgICAgICAvLyBkb3dubG9hZGVkIGZpbGVuYW1lIHJlZmxlY3RzIFwiXHU2NzAwXHU4RkQxIDMgXHU1RTc0XCIgXHUyMTkyIDIwMjMtMjAyNiBpbnN0ZWFkXG4gICAgICAgICAgLy8gb2YgYWx3YXlzIHN5bnRoZXNpemluZyB0b2RheS0xeSBcdTIxOTIgdG9kYXkuXG4gICAgICAgICAgY29uc3QgZGwgPSBhd2FpdCBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudE92ZXJyaWRlLmlkX25vLCBkYXRlUmFuZ2UpO1xuICAgICAgICAgIF9sb2NhbEZpbGVuYW1lID0gZGwuZmlsZW5hbWU7XG4gICAgICAgICAgLy8gQWxpZ24gcmVwb3J0ZWQgY291bnQgd2l0aCBsb2NhbCBtb2RlOiBidW5kbGUuZW50cnkubGVuZ3RoXG4gICAgICAgICAgLy8gaW5jbHVkZXMgdGhlIFBhdGllbnQgcmVzb3VyY2UgKHdoaWNoIHRoZSBwZXItcGFnZS10eXBlIFBPU1RcbiAgICAgICAgICAvLyBjb3VudHMgaGFkIHByZXZpb3VzbHkgb21pdHRlZCBiZWNhdXNlIFBhdGllbnQgaXMgYXV0by1jcmVhdGVkXG4gICAgICAgICAgLy8gc2lsZW50bHkgZnJvbSBwYXRpZW50X292ZXJyaWRlKS4gU2FtZSBkYXRhIFx1MjE5MiBzYW1lIG51bWJlci5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIERlZmVuc2l2ZTogb25seSBPVkVSV1JJVEUgdG90YWwgd2hlbiBleHBvcnQgYWN0dWFsbHkgcmV0dXJuZWRcbiAgICAgICAgICAvLyBzb21ldGhpbmcuIElmIGV4cG9ydCByZXR1cm5zIDAgZW50cmllcyBkZXNwaXRlIGEgc3VjY2Vzc2Z1bFxuICAgICAgICAgIC8vIHVwbG9hZCAoY291bGQgaGFwcGVuIHdpdGggYSBzdGFsZS1EQiBoYXNoIG1pc21hdGNoIHdlIGhhdmVuJ3RcbiAgICAgICAgICAvLyBmaXhlZCB5ZXQpLCBkb24ndCBjbG9iYmVyIHRoZSB0cnV0aGZ1bCB1cGxvYWQgY291bnQgXHUyMDE0IHRoYXQnc1xuICAgICAgICAgIC8vIGV4YWN0bHkgdGhlIGJ1ZyB0aGF0IG1hZGUgXCJcdTVERjJcdTY2RjRcdTY1QjAgODEgXHU3QjQ2XCIgc2lsZW50bHkgYmVjb21lXG4gICAgICAgICAgLy8gXCJcdTVERjJcdTY2RjRcdTY1QjAgMCBcdTdCNDZcIi5cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShidW5kbGUuZW50cnkpICYmIGJ1bmRsZS5lbnRyeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0b3RhbCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9ycy5wdXNoKGBleHBvcnQgYnVuZGxlOiBIVFRQICR7ci5zdGF0dXN9YCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGV4cG9ydCBidW5kbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKG1vZGUgPT09IFwibG9jYWxcIiA/IFwiYXNzZW1ibGUrc3Rhc2hcIiA6IFwiYmFja2VuZC11cGxvYWRcIik7XG5cbiAgLy8gRm9ybWF0IGVsYXBzZWQgd2FsbC1jbG9jayB0aW1lOiBzZWNvbmRzICgxIGRwKSBmb3Igc2hvcnQgc3luY3MsXG4gIC8vIFwibW06c3NcIiBvbmNlIHdlIGNyb3NzIHRoZSBtaW51dGUgbWFyayBzbyB0aGUgcG9wdXAgc3RhdHVzIHN0YXlzIHJlYWRhYmxlLlxuICBjb25zdCBfZWxhcHNlZE1zID0gRGF0ZS5ub3coKSAtIF90MDtcbiAgY29uc3QgX2VsYXBzZWRTdHIgPSBfZWxhcHNlZE1zIDwgNjBfMDAwXG4gICAgPyBgJHsoX2VsYXBzZWRNcyAvIDEwMDApLnRvRml4ZWQoMSl9c2BcbiAgICA6IGAke01hdGguZmxvb3IoX2VsYXBzZWRNcyAvIDYwXzAwMCl9bSR7TWF0aC5yb3VuZCgoX2VsYXBzZWRNcyAlIDYwXzAwMCkgLyAxMDAwKX1zYDtcbiAgLy8gTm8gbW9yZSBcIlx1NkE5NFx1Njg0OFx1NURGMlx1NTA5OVx1NTlBNVx1MjAyNlwiIHRhaWwgXHUyMDE0IHRoZSBcdUQ4M0RcdURDRTUgZG93bmxvYWQgYnV0dG9uIHNpdHMgcmlnaHRcbiAgLy8gYmVsb3cgdGhlIHN0YXR1cywgc28gc2F5aW5nIFwiXHU5RURFXHU0RTBCXHU2NUI5XHU2MzA5XHU5MjE1XCIgaXMganVzdCBub2lzZS5cbiAgY29uc3QgX2xvY2FsVGFpbCA9IFwiXCI7XG4gIGNvbnN0IF9zdWNjZXNzVmVyYiA9IG1vZGUgPT09IFwibG9jYWxcIiA/IFwiXHU1REYyXHU3NTIyXHU3NTFGXCIgOiBcIlx1NURGMlx1NjZGNFx1NjVCMFwiO1xuICAvLyBQaGFzZSB0aW1pbmdzIChgbmhpLXBhcmFsbGVsPThzYCwgYGJhY2tlbmQtdXBsb2FkPTAuOHNgKSBhcmUgZGV2XG4gIC8vIGluZm8gXHUyMDE0IHVzZWZ1bCB3aGVuIGludmVzdGlnYXRpbmcgYSBzbG93IHN5bmMgYnV0IG5vaXNlIGZvciBhbiBlbmRcbiAgLy8gdXNlci4gS2VlcCB0aGVtLCBidXQgdGFnIHdpdGggdGhlIFwiXHUyM0YxXCIgcHJlZml4IHRoZSBwb3B1cCB1c2VzIHRvXG4gIC8vIHR1Y2sgdGhlbSBpbnRvIGEgZGVlcGVyIFwiXHU2MjgwXHU4ODUzXHU3RDMwXHU3QkMwXCIgc3ViLXRvZ2dsZS5cbiAgY29uc3QgX3BoYXNlTGluZXMgPSBfcGhhc2VzLm1hcCgocCkgPT4gYFx1MjNGMSAke3AubmFtZX09JHsocC5tcyAvIDEwMDApLnRvRml4ZWQoMSl9c2ApO1xuICBjb25zdCBfZnVsbEJyZWFrZG93biA9IFsuLi5icmVha2Rvd24sIC4uLl9waGFzZUxpbmVzXTtcblxuICAvLyBQaWNrIHRoZSByaWdodCBzdW1tYXJ5IGxpbmUuIFplcm8tcmVzdWx0IGlzIHRoZSB0cmlja2llc3QgY2FzZTpcbiAgLy8gd2UgZG9uJ3Qgd2FudCBhIGdyZWVuIFx1MjcwNSBzYXlpbmcgXCIwIFx1N0I0NlwiIGJlY2F1c2UgdGhhdCByZWFkcyBhc1xuICAvLyBcInN1Y2NlZWRlZCB3aXRoIHplcm8gZGF0YVwiLiBUaGF0J3MgYWxtb3N0IGFsd2F5cyBvbmUgb2Y6XG4gIC8vICAgLSBOSEkgc2Vzc2lvbiBleHBpcmVkIGJldHdlZW4gdGhlIGxvZ2luIHByb2JlIGFuZCB0aGUgc3luY1xuICAvLyAgICAgKHRoZSBJSEtFMzQxMCBwcm9iZSBjYW4gc3RpbGwgc3VjY2VlZCB3aGlsZSBkYXRhIGVuZHBvaW50c1xuICAvLyAgICAgcmVzcG9uZCB3aXRoIGVtcHR5IGFycmF5cyk7XG4gIC8vICAgLSB0aGUgdXNlciB0cnVseSBoYXMgbm8gcmVjb3JkcyBpbiB0aGUgc2VsZWN0ZWQgZGF0ZSByYW5nZS5cbiAgLy8gRWl0aGVyIHdheSB0aGUgYWN0aW9uYWJsZSBuZXh0IHN0ZXAgaXMgXCJcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjUgTkhJIFx1NTE4RFx1OEE2Nlx1NEUwMFx1NkIyMVwiLlxuICBsZXQgX3N1bW1hcnlMaW5lO1xuICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgIF9zdW1tYXJ5TGluZSA9IGBcdTI2QTBcdUZFMEYgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyAke19zdWNjZXNzVmVyYn0gJHt0b3RhbH0gXHU3QjQ2XHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHVGRjBDJHtlcnJvcnMubGVuZ3RofSBcdTk4MDVcdTU5MzFcdTY1NTdcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOSR7X2xvY2FsVGFpbH1gO1xuICB9IGVsc2UgaWYgKHRvdGFsID09PSAwKSB7XG4gICAgX3N1bW1hcnlMaW5lID1cbiAgICAgIGBcdTI2QTBcdUZFMEYgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwXHU0RjQ2XHU2QzkyXHU2MjkzXHU1MjMwXHU0RUZCXHU0RjU1XHU4Q0M3XHU2NTk5XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDlcdTIwMTQgYCArXG4gICAgICBgXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBIHNlc3Npb24gXHU1M0VGXHU4MEZEXHU5MDRFXHU2NzFGXHVGRjBDXHU4QUNCXHU1NkRFXHU4QTcyXHU1MjA2XHU5ODAxXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XHVGRjFCXHU2MjE2XHU2MkM5XHU5NTc3XHUzMDBDXHU2NUU1XHU2NzFGXHU3QkM0XHU1NzBEXHUzMDBEXHU1MThEXHU4QTY2XHUzMDAyYDtcbiAgfSBlbHNlIHtcbiAgICBfc3VtbWFyeUxpbmUgPSBgXHUyNzA1IFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgJHtfc3VjY2Vzc1ZlcmJ9ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5JHtfbG9jYWxUYWlsfWA7XG4gIH1cblxuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgIHByb2dyZXNzOiBfc3VtbWFyeUxpbmUsXG4gICAgcGhhc2U6IFwiZG9uZVwiLFxuICAgIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCxcbiAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgZWxhcHNlZE1zOiBfZWxhcHNlZE1zLFxuICAgIC8vIFBlci1lbmRwb2ludCBicmVha2Rvd24gZm9yIHRoZSBwb3B1cCdzICdcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzAnIGNvbGxhcHNpYmxlLlxuICAgIC8vIEtlZXAgYXMgYSBwbGFpbiBhcnJheSBzbyBwb3B1cC5qcyBjYW4gcmVuZGVyIHdpdGggRE9NIEFQSSAobm9cbiAgICAvLyBpbm5lckhUTUwgLyBubyBlc2NhcGluZyBjb25jZXJucykuIEl0ZW1zIGxvb2sgbGlrZVxuICAgIC8vICdlbmNvdW50ZXJzPTEyLzEyJyBvciAnYWR1bHRfcHJldmVudGl2ZT0yIHJvd3MgXHUyMTkyIDM2IG9icycuXG4gICAgYnJlYWtkb3duOiBfZnVsbEJyZWFrZG93bixcbiAgICBlcnJvcnMsXG4gICAgaGlzdG5vOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sXG4gICAgbW9kZSxcbiAgICBsb2NhbEZpbGVuYW1lOiBfbG9jYWxGaWxlbmFtZSxcbiAgfSk7XG5cbiAgLy8gQmVzdC1lZmZvcnQ6IHdyaXRlIGEgU3luYyBIaXN0b3J5IHJvdyB0byB0aGUgYmFja2VuZCBzbyB0aGUgZGFzaGJvYXJkXG4gIC8vIGNhbiBzaG93IHdoZW4vd2hvL2hvdy1sb25nL3doYXQvcmFuZ2UuIFNraXBwZWQgaW4gbG9jYWwgbW9kZSAodGhlcmVcbiAgLy8gaXMgbm8gYmFja2VuZCkuIFdyYXBwZWQgKyBzd2FsbG93ZWQgc28gYSBsb2dnaW5nIGZhaWx1cmUgbmV2ZXJcbiAgLy8gcHJvcGFnYXRlcyBiYWNrIHRvIHRoZSB1c2VyLWZhY2luZyBzeW5jIHN0YXR1cy5cbiAgaWYgKG1vZGUgIT09IFwibG9jYWxcIikgdHJ5IHtcbiAgICBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL2xvZ2AsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBzdGF0dXM6IGVycm9ycy5sZW5ndGggPyBcInBhcnRpYWxcIiA6IFwic3VjY2Vzc1wiLFxuICAgICAgICBwYXRpZW50X2lkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIixcbiAgICAgICAgLy8gL3N5bmMvbG9nIGxhbmRzIGluIHRoZSBkYXNoYm9hcmQncyBzeW5jLWhpc3Rvcnkgcm93LiBPbmx5XG4gICAgICAgIC8vIG1hc2sgd2hlbiB0aGUgdXNlciBoYXMgb3B0ZWQgaW4gXHUyMDE0IG90aGVyd2lzZSBkYXNoYm9hcmQgc2Vlc1xuICAgICAgICAvLyB0aGUgcmF3IG5hbWUgdGhleSB0eXBlZCAoY29uc2lzdGVudCB3aXRoIFwiXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4XCIgZGVmYXVsdCkuXG4gICAgICAgIHBhdGllbnRfbmFtZTogbWFza0VuYWJsZWRcbiAgICAgICAgICA/IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCIpXG4gICAgICAgICAgOiBwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiLFxuICAgICAgICB0b3RhbCxcbiAgICAgICAgYnJlYWtkb3duLFxuICAgICAgICBkYXRlX3JhbmdlOiBkYXRlUmFuZ2VMYWJlbCB8fCBcIlwiLFxuICAgICAgICBlbGFwc2VkX21zOiBfZWxhcHNlZE1zLFxuICAgICAgICBzdGFydGVkX2F0OiBuZXcgRGF0ZShfdDApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIGVycm9ycyxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBmYWlsZWQgdG8gd3JpdGUgaGlzdG9yeSBsb2c6XCIsIGUpO1xuICB9XG4gIF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbn1cblxuLy8gT25lLXRpbWUgbWlncmF0aW9uIGZyb20gY2hyb21lLnN0b3JhZ2Uuc3luYyBcdTIxOTIgY2hyb21lLnN0b3JhZ2UubG9jYWwuXG4vLyBQcmV2aW91cyB2ZXJzaW9ucyBzdG9yZWQgc3luY0FwaUtleSArIHBhdGllbnRPdmVycmlkZSAoY29udGFpbmluZyB0aGVcbi8vIG5hdGlvbmFsIElEKSB1bmRlciAuc3luYywgd2hpY2ggQ2hyb21lIHJlcGxpY2F0ZXMgdG8gdGhlIHVzZXIncyBHb29nbGVcbi8vIGFjY291bnQgYW5kIHB1c2hlcyB0byBldmVyeSBkZXZpY2UgdGhleSBzaWduIGludG8uIE1vdmUgZXZlcnl0aGluZ1xuLy8gc2V0dGluZ3MtcmVsYXRlZCB0byAubG9jYWw7IGNsZWFyIHRoZSBzeW5jIGNvcHkuXG5jb25zdCBTWU5DX0tFWVNfVE9fTUlHUkFURSA9IFtcbiAgXCJiYWNrZW5kVXJsXCIsXG4gIFwic3luY0FwaUtleVwiLFxuICBcInNtYXJ0QXBwTGF1bmNoVXJsXCIsXG4gIFwicGF0aWVudE92ZXJyaWRlXCIsXG4gIFwic3luY01vZGVcIixcbiAgXCJtYXNrTmFtZUVuYWJsZWRcIixcbl07XG5cbmFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGVTeW5jVG9Mb2NhbCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzeW5jZWQgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChTWU5DX0tFWVNfVE9fTUlHUkFURSk7XG4gICAgY29uc3QgcHJlc2VudCA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgIE9iamVjdC5lbnRyaWVzKHN5bmNlZCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkKSxcbiAgICApO1xuICAgIGlmIChPYmplY3Qua2V5cyhwcmVzZW50KS5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBjb25zdCBsb2NhbCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChPYmplY3Qua2V5cyhwcmVzZW50KSk7XG4gICAgLy8gRG9uJ3Qgb3ZlcndyaXRlIGFueXRoaW5nIHRoZSB1c2VyIGFscmVhZHkgc2V0IG9uIHRoaXMgbWFjaGluZS5cbiAgICBjb25zdCB0b1dyaXRlID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgT2JqZWN0LmVudHJpZXMocHJlc2VudCkuZmlsdGVyKChba10pID0+IGxvY2FsW2tdID09PSB1bmRlZmluZWQpLFxuICAgICk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHRvV3JpdGUpLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh0b1dyaXRlKTtcbiAgICB9XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoT2JqZWN0LmtleXMocHJlc2VudCkpO1xuICB9IGNhdGNoIHtcbiAgICAvLyBNaWdyYXRpb24gaXMgYmVzdC1lZmZvcnQuIFRoZSBuZXh0IHJ1biBnZXRzIHRvIHRyeSBhZ2Fpbi5cbiAgfVxufVxuXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihhc3luYyAoKSA9PiB7XG4gIGF3YWl0IG1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xufSk7XG5cbi8vIEFsc28gcnVuIG1pZ3JhdGlvbiBvbiBzZXJ2aWNlLXdvcmtlciB3YWtlLXVwIChjb3ZlcnMgcmVsb2FkL3Jlc3RhcnRcbi8vIHBhdGhzIHdoZXJlIG9uSW5zdGFsbGVkIGRvZXNuJ3QgZmlyZSkuXG5jaHJvbWUucnVudGltZS5vblN0YXJ0dXA/LmFkZExpc3RlbmVyPy4oKCkgPT4ge1xuICBtaWdyYXRlU3luY1RvTG9jYWwoKTtcbn0pO1xubWlncmF0ZVN5bmNUb0xvY2FsKCk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICBpZiAobXNnPy50eXBlID09PSBcInN0YXJ0TmhpQXBpU3luY1wiKSB7XG4gICAgcnVuTmhpQXBpU3luYyhtc2cucGF5bG9hZCkudGhlbihcbiAgICAgICgpID0+IHsgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge30gfSxcbiAgICAgIGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGlmIChlPy5tZXNzYWdlID09PSBDQU5DRUxfRVJST1IpIHtcbiAgICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSwgY2FuY2VsbGVkOiB0cnVlIH0pOyB9IGNhdGNoIHt9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlPy5tZXNzYWdlID09PSBTRVNTSU9OX0VYUElSRURfRVJST1IpIHtcbiAgICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgICAgICAgc3luY1N0YXR1czoge1xuICAgICAgICAgICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgcHJvZ3Jlc3M6IFwiXHVEODNEXHVERDEyIE5ISSBzZXNzaW9uIFx1NURGMlx1NzY3Qlx1NTFGQSBcdTIwMTQgXHU4QUNCXHU1NzI4IE5ISSB0YWIgXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1XHU1RjhDXHU1MThEXHU5RURFIFN5bmNcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwic2Vzc2lvbl9leHBpcmVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLCBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiBmYWxzZSwgZXhwaXJlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmVycm9yKFwicnVuTmhpQXBpU3luYyBmYWlsZWRcIiwgZSk7XG4gICAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHJ1bm5pbmc6IGZhbHNlLCBwcm9ncmVzczogYFx1Mjc0QyAke2UubWVzc2FnZX1gLCBwaGFzZTogXCJlcnJvclwiIH0pO1xuICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGVycm9yOiBlLm1lc3NhZ2UgfSk7IH0gY2F0Y2gge31cbiAgICAgIH0sXG4gICAgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcInN0b3BTeW5jXCIpIHtcbiAgICAvLyBTZXQgdGhlIGNhbmNlbGxhdGlvbiBmbGFnOyB0aGUgaW4tZmxpZ2h0IHN5bmMgd2lsbCB0aHJvd1xuICAgIC8vIENBTkNFTF9FUlJPUiBhdCBpdHMgbmV4dCBjaGVja0NhbmNlbCgpIGNhbGwuICBTdG9yYWdlIGlzIGFscmVhZHlcbiAgICAvLyB1cGRhdGVkIGJ5IHRoZSBwb3B1cCwgc28gd2UgZG9uJ3QgdG91Y2ggaXQgaGVyZS5cbiAgICBfY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAvLyBEaXNjYXJkIGFueSBwYXJ0aWFsIGRhdGEgdXBsb2FkZWQgc28gZmFyLiBUaGUgdXNlcidzIHN0YXRlZFxuICAgIC8vIGNvbnRyYWN0IGlzICdzdG9wID0gYWJvcnQsIEknbGwgcmVzeW5jIGZyb20gc2NyYXRjaCBsYXRlcicgXHUyMDE0IHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byBsZWF2ZSBhIGhhbGYtbG9hZGVkIHBhdGllbnQgaW4gdGhlIEZISVIgc3RvcmUgdGhhdFxuICAgIC8vIGxvb2tzIGNvbXBsZXRlIHRvIGRvd25zdHJlYW0gU01BUlQgYXBwcy5cbiAgICBjb25zdCBjdHggPSBfYWN0aXZlU3luY0N0eDtcbiAgICBpZiAoY3R4Py5wYXRpZW50SWQgJiYgY3R4LmJhY2tlbmQpIHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICBgJHtjdHguYmFja2VuZH0vc3luYy9wYXRpZW50LyR7ZW5jb2RlVVJJQ29tcG9uZW50KGN0eC5wYXRpZW50SWQpfWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgaGVhZGVyczogY3R4LnN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogY3R4LnN5bmNBcGlLZXkgfSA6IHt9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIFN1cmZhY2UgdGhlIHdpcGUgaW4gdGhlIHN0YXR1cyBzbyB1c2VyIHNlZXMgaXQgYWN0dWFsbHkgaGFwcGVuZWQuXG4gICAgICAgICAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIFtTVE9SQUdFX0tFWV06IHtcbiAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdTVERjJcdTUwNUNcdTZCNjJcdTRFMjZcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTkgXHUyMDE0IFx1OEFDQlx1OTFDRFx1NjVCMFx1NTNENlx1NUY5N1wiLFxuICAgICAgICAgICAgICBwaGFzZTogXCJjYW5jZWxsZWRcIixcbiAgICAgICAgICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICAgICAgICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIGNhbmNlbCB3aXBlIGZhaWxlZDpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfVxuICAgIF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbiAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2c/LnR5cGUgPT09IFwiZ2V0U3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKS50aGVuKChkYXRhKSA9PiBzZW5kUmVzcG9uc2UoZGF0YVtTVE9SQUdFX0tFWV0gfHwgbnVsbCkpO1xuICAgIHJldHVybiB0cnVlOyAgLy8gYXN5bmMgcmVzcG9uc2VcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImNsZWFyU3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFNUT1JBR0VfS0VZKS50aGVuKCgpID0+IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImNoZWNrTmhpTG9naW5cIikge1xuICAgIF9jaGVja05oaUxvZ2luU3RhdGUobXNnLnRhYklkKS50aGVuKFxuICAgICAgKHN0YXRlKSA9PiB7IHRyeSB7IHNlbmRSZXNwb25zZSh7IGxvZ2dlZEluOiBzdGF0ZSB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICAgKCkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogbnVsbCB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuXG4vLyBCZWx0LWFuZC1zdXNwZW5kZXJzIFNXIGtlZXBhbGl2ZTogYW4gYWxhcm0gZXZlcnkgMjAgcyB3YWtlcyB0aGUgU1cgaWZcbi8vIGlkbGUuIENvbWJpbmVkIHdpdGggdGhlIHJldHVybi10cnVlIHBhdHRlcm4gYWJvdmUsIHRoaXMgcHJldmVudHMgdGhlXG4vLyAzMCBzIGlkbGUgc2h1dGRvd24gZnJvbSBlbmRpbmcgYW4gaW4tcHJvZ3Jlc3Mgc3luYy5cbmNocm9tZS5hbGFybXMuY3JlYXRlKFwic3cta2VlcGFsaXZlXCIsIHsgcGVyaW9kSW5NaW51dGVzOiAwLjM0IH0pO1xuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKCgpID0+IHsgLyogbm8tb3A7IHByZXNlbmNlIGlzIHRoZSBwb2ludCAqLyB9KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBU0EsT0FBQyxXQUFXO0FBQ1Y7QUFFQSxZQUFJLGNBQWM7QUFDbEIsWUFBSSxpQkFBaUI7QUFDckIsWUFBSSxTQUFTLE9BQU8sV0FBVztBQUMvQixZQUFJLE9BQU8sU0FBUyxTQUFTLENBQUM7QUFDOUIsWUFBSSxLQUFLLG1CQUFtQjtBQUMxQixtQkFBUztBQUFBLFFBQ1g7QUFDQSxZQUFJLGFBQWEsQ0FBQyxVQUFVLE9BQU8sU0FBUztBQUM1QyxZQUFJLFVBQVUsQ0FBQyxLQUFLLHNCQUFzQixPQUFPLFlBQVksWUFBWSxRQUFRLFlBQVksUUFBUSxTQUFTO0FBQzlHLFlBQUksU0FBUztBQUNYLGlCQUFPO0FBQUEsUUFDVCxXQUFXLFlBQVk7QUFDckIsaUJBQU87QUFBQSxRQUNUO0FBQ0EsWUFBSSxZQUFZLENBQUMsS0FBSyx3QkFBd0IsT0FBTyxXQUFXLFlBQVksT0FBTztBQUNuRixZQUFJLE1BQU0sT0FBTyxXQUFXLGNBQWMsT0FBTztBQUNqRCxZQUFJLGVBQWUsQ0FBQyxLQUFLLDJCQUEyQixPQUFPLGdCQUFnQjtBQUMzRSxZQUFJLFlBQVksbUJBQW1CLE1BQU0sRUFBRTtBQUMzQyxZQUFJLFFBQVEsQ0FBQyxh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QU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUk7QUFBQSxRQUMzRDtBQUVBLGFBQUssVUFBVSxXQUFXLEtBQUssVUFBVTtBQUV6QyxhQUFLLFVBQVUsU0FBUyxXQUFZO0FBQ2xDLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLO0FBRXRFLGlCQUFPO0FBQUEsWUFDSixPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxJQUFLO0FBQUEsWUFBTSxLQUFLO0FBQUEsWUFDL0QsT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sSUFBSztBQUFBLFlBQU0sS0FBSztBQUFBLFlBQy9ELE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLElBQUs7QUFBQSxZQUFNLEtBQUs7QUFBQSxZQUMvRCxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxJQUFLO0FBQUEsWUFBTSxLQUFLO0FBQUEsWUFDL0QsT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sSUFBSztB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QUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFVVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtB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O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVdYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQ0U7QUFBQSxJQUNGLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFV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Z0JBQ0gsU0FBUztBQUFBLGdCQUNULFVBQVU7QUFBQSxnQkFDVixPQUFPO0FBQUEsZ0JBQ1AsSUFBSSxLQUFLLElBQUk7QUFBQSxnQkFDYixXQUFXLEtBQUssSUFBSTtBQUFBLGNBQ3RCO0FBQUEsWUFDRixDQUFDO0FBQUEsVUFDSCxTQUFTLEdBQUc7QUFDVixvQkFBUSxLQUFLLGtDQUFrQyxDQUFDO0FBQUEsVUFDbEQ7QUFBQSxRQUNGLEdBQUc7QUFBQSxNQUNMO0FBQ0EsdUJBQWlCO0FBQ2pCLFVBQUk7QUFBRSxxQkFBYSxFQUFFLElBQUksS0FBSyxDQUFDO0FBQUEsTUFBRyxRQUFRO0FBQUEsTUFBQztBQUMzQyxhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLGlCQUFpQjtBQUNqQyxhQUFPLFFBQVEsTUFBTSxJQUFJLFdBQVcsRUFBRSxLQUFLLENBQUMsU0FBUyxhQUFhLEtBQUssV0FBVyxLQUFLLElBQUksQ0FBQztBQUM1RixhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLG1CQUFtQjtBQUNuQyxhQUFPLFFBQVEsTUFBTSxPQUFPLFdBQVcsRUFBRSxLQUFLLE1BQU0sYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUM7QUFDOUUsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxpQkFBaUI7QUFDakMsMEJBQW9CLElBQUksS0FBSyxFQUFFO0FBQUEsUUFDN0IsQ0FBQyxVQUFVO0FBQUUsY0FBSTtBQUFFLHlCQUFhLEVBQUUsVUFBVSxNQUFNLENBQUM7QUFBQSxVQUFHLFFBQVE7QUFBQSxVQUFDO0FBQUEsUUFBRTtBQUFBLFFBQ2pFLE1BQU07QUFBRSxjQUFJO0FBQUUseUJBQWEsRUFBRSxVQUFVLEtBQUssQ0FBQztBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUFFO0FBQUEsTUFDN0Q7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUtELFNBQU8sT0FBTyxPQUFPLGdCQUFnQixFQUFFLGlCQUFpQixLQUFLLENBQUM7QUFDOUQsU0FBTyxPQUFPLFFBQVEsWUFBWSxNQUFNO0FBQUEsRUFBcUMsQ0FBQzsiLAogICJuYW1lcyI6IFsiQnVmZmVyIiwgImJsb2NrcyIsICJleHBvcnRzIiwgIm1hcFN5c3RlbSIsICJlc2NhcGVSZWdleCIsICJoaXQiLCAiY2prQ2hhcnMiLCAib2JzSWQiLCAibWFwU3lzdGVtIiwgInIiXQp9Cg==
