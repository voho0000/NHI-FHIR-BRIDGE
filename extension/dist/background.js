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
    return {
      date: start,
      end_date: end,
      class: "IMP",
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
    return {
      date,
      end_date: "",
      class: classHint || "AMB",
      // For pharmacy: emit "藥局" so SMART apps get a clear visit-type
      // marker. For everything else: keep the NHI data-source label
      // (IC卡資料 / 申報資料) — historical contract, still useful for
      // consumers that already wired against it.
      type_display: isPharmacy ? "\u85E5\u5C40" : item.ori_type_name || item.orI_TYPE_NAME || "",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2ltbXVuaXphdGlvbi50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9uaGktYWRhcHRlcnMuanMiLCAiLi4vc3JjL25oaS1lbmRwb2ludHMuanMiLCAiLi4vc3JjL2JhY2tncm91bmQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG4gKiBbanMtc2hhMV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1zaGExfVxuICpcbiAqIEB2ZXJzaW9uIDAuNy4wXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMjRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4vKmpzbGludCBiaXR3aXNlOiB0cnVlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgSU5QVVRfRVJST1IgPSAnaW5wdXQgaXMgaW52YWxpZCB0eXBlJztcbiAgdmFyIEZJTkFMSVpFX0VSUk9SID0gJ2ZpbmFsaXplIGFscmVhZHkgY2FsbGVkJztcbiAgdmFyIFdJTkRPVyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnO1xuICB2YXIgcm9vdCA9IFdJTkRPVyA/IHdpbmRvdyA6IHt9O1xuICBpZiAocm9vdC5KU19TSEExX05PX1dJTkRPVykge1xuICAgIFdJTkRPVyA9IGZhbHNlO1xuICB9XG4gIHZhciBXRUJfV09SS0VSID0gIVdJTkRPVyAmJiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCc7XG4gIHZhciBOT0RFX0pTID0gIXJvb3QuSlNfU0hBMV9OT19OT0RFX0pTICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgaWYgKE5PREVfSlMpIHtcbiAgICByb290ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFdFQl9XT1JLRVIpIHtcbiAgICByb290ID0gc2VsZjtcbiAgfVxuICB2YXIgQ09NTU9OX0pTID0gIXJvb3QuSlNfU0hBMV9OT19DT01NT05fSlMgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHM7XG4gIHZhciBBTUQgPSB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQ7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAhcm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUiAmJiB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcbiAgdmFyIEVYVFJBID0gWy0yMTQ3NDgzNjQ4LCA4Mzg4NjA4LCAzMjc2OCwgMTI4XTtcbiAgdmFyIFNISUZUID0gWzI0LCAxNiwgOCwgMF07XG4gIHZhciBPVVRQVVRfVFlQRVMgPSBbJ2hleCcsICdhcnJheScsICdkaWdlc3QnLCAnYXJyYXlCdWZmZXInXTtcblxuICB2YXIgYmxvY2tzID0gW107XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICBpZiAocm9vdC5KU19TSEExX05PX05PREVfSlMgfHwgIWlzQXJyYXkpIHtcbiAgICBpc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3O1xuICBpZiAoQVJSQVlfQlVGRkVSICYmIChyb290LkpTX1NIQTFfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgfHwgIWlzVmlldykpIHtcbiAgICBpc1ZpZXcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmJ1ZmZlciAmJiBvYmouYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcjtcbiAgICB9O1xuICB9XG5cbiAgLy8gW21lc3NhZ2U6IHN0cmluZywgaXNTdHJpbmc6IGJvb2xdXG4gIHZhciBmb3JtYXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXNzYWdlO1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIFttZXNzYWdlLCB0cnVlXTtcbiAgICB9XG4gICAgaWYgKHR5cGUgIT09ICdvYmplY3QnIHx8IG1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChBUlJBWV9CVUZGRVIgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBbbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSksIGZhbHNlXTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KG1lc3NhZ2UpICYmICFpc1ZpZXcobWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGNyZWF0ZU91dHB1dE1ldGhvZCA9IGZ1bmN0aW9uIChvdXRwdXRUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IFNoYTEodHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2QgPSBjcmVhdGVPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIGlmIChOT0RFX0pTKSB7XG4gICAgICBtZXRob2QgPSBub2RlV3JhcChtZXRob2QpO1xuICAgIH1cbiAgICBtZXRob2QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKCk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuY3JlYXRlKCkudXBkYXRlKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPVVRQVVRfVFlQRVMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0eXBlID0gT1VUUFVUX1RZUEVTW2ldO1xuICAgICAgbWV0aG9kW3R5cGVdID0gY3JlYXRlT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIHZhciBub2RlV3JhcCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgICB2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgIHZhciBidWZmZXJGcm9tO1xuICAgIGlmIChCdWZmZXIuZnJvbSAmJiAhcm9vdC5KU19TSEExX05PX0JVRkZFUl9GUk9NKSB7XG4gICAgICBidWZmZXJGcm9tID0gQnVmZmVyLmZyb207XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlckZyb20gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihtZXNzYWdlKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBub2RlTWV0aG9kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKG1lc3NhZ2UsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSBudWxsIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG1lc3NhZ2UpIHx8IGlzVmlldyhtZXNzYWdlKSB8fFxuICAgICAgICBtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ1ZmZlckZyb20obWVzc2FnZSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGVNZXRob2Q7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSwgdHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlSG1hY01ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlSG1hY091dHB1dE1ldGhvZCgnaGV4Jyk7XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgSG1hY1NoYTEoa2V5KTtcbiAgICB9O1xuICAgIG1ldGhvZC51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZShrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QodHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRob2Q7XG4gIH07XG5cbiAgZnVuY3Rpb24gU2hhMShzaGFyZWRNZW1vcnkpIHtcbiAgICBpZiAoc2hhcmVkTWVtb3J5KSB7XG4gICAgICBibG9ja3NbMF0gPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICBibG9ja3NbOF0gPSBibG9ja3NbOV0gPSBibG9ja3NbMTBdID0gYmxvY2tzWzExXSA9XG4gICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICB9XG5cbiAgICB0aGlzLmgwID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmgxID0gMHhFRkNEQUI4OTtcbiAgICB0aGlzLmgyID0gMHg5OEJBRENGRTtcbiAgICB0aGlzLmgzID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmg0ID0gMHhDM0QyRTFGMDtcblxuICAgIHRoaXMuYmxvY2sgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMDtcbiAgICB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJzdCA9IHRydWU7XG4gIH1cblxuICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEZJTkFMSVpFX0VSUk9SKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShtZXNzYWdlKTtcbiAgICBtZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgIHZhciBpc1N0cmluZyA9IHJlc3VsdFsxXTtcbiAgICB2YXIgY29kZSwgaW5kZXggPSAwLCBpLCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCB8fCAwLCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgICAgIGJsb2Nrc1swXSA9IHRoaXMuYmxvY2s7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYoaXNTdHJpbmcpIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gY29kZSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvZGUgPSAweDEwMDAwICsgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhmMCB8IChjb2RlID4+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSB0aGlzLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgNjQ7ICsraW5kZXgpIHtcbiAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaTtcbiAgICAgIHRoaXMuYnl0ZXMgKz0gaSAtIHRoaXMuc3RhcnQ7XG4gICAgICBpZiAoaSA+PSA2NCkge1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGkgLSA2NDtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDA7XG4gICAgICB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgdmFyIGJsb2NrcyA9IHRoaXMuYmxvY2tzLCBpID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgIGJsb2Nrc1sxNl0gPSB0aGlzLmJsb2NrO1xuICAgIGJsb2Nrc1tpID4+PiAyXSB8PSBFWFRSQVtpICYgM107XG4gICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgaWYgKGkgPj0gNTYpIHtcbiAgICAgIGlmICghdGhpcy5oYXNoZWQpIHtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgfVxuICAgIGJsb2Nrc1sxNF0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjk7XG4gICAgYmxvY2tzWzE1XSA9IHRoaXMuYnl0ZXMgPDwgMztcbiAgICB0aGlzLmhhc2goKTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhID0gdGhpcy5oMCwgYiA9IHRoaXMuaDEsIGMgPSB0aGlzLmgyLCBkID0gdGhpcy5oMywgZSA9IHRoaXMuaDQ7XG4gICAgdmFyIGYsIGosIHQsIGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgZm9yKGogPSAxNjsgaiA8IDgwOyArK2opIHtcbiAgICAgIHQgPSBibG9ja3NbaiAtIDNdIF4gYmxvY2tzW2ogLSA4XSBeIGJsb2Nrc1tqIC0gMTRdIF4gYmxvY2tzW2ogLSAxNl07XG4gICAgICBibG9ja3Nbal0gPSAgKHQgPDwgMSkgfCAodCA+Pj4gMzEpO1xuICAgIH1cblxuICAgIGZvcihqID0gMDsgaiA8IDIwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IChhICYgYikgfCAoKH5hKSAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoKH5lKSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoKH5kKSAmIGEpO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IChjICYgZCkgfCAoKH5jKSAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgNDA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IGEgXiBiIF4gYztcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IGMgXiBkIF4gZTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDYwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSAtIDE4OTQwMDc1ODggKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKGEgJiBjKSB8IChiICYgYyk7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gKGUgJiBhKSB8IChlICYgYikgfCAoYSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoZCAmIGEpIHwgKGUgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKGMgJiBlKSB8IChkICYgZSk7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA4MDsgaiArPSA1KSB7XG4gICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSA4OTk0OTc1MTQgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSBkIF4gZSBeIGE7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IHRoaXMuaDAgKyBhIDw8IDA7XG4gICAgdGhpcy5oMSA9IHRoaXMuaDEgKyBiIDw8IDA7XG4gICAgdGhpcy5oMiA9IHRoaXMuaDIgKyBjIDw8IDA7XG4gICAgdGhpcy5oMyA9IHRoaXMuaDMgKyBkIDw8IDA7XG4gICAgdGhpcy5oNCA9IHRoaXMuaDQgKyBlIDw8IDA7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBoMCA9IHRoaXMuaDAsIGgxID0gdGhpcy5oMSwgaDIgPSB0aGlzLmgyLCBoMyA9IHRoaXMuaDMsIGg0ID0gdGhpcy5oNDtcblxuICAgIHJldHVybiBIRVhfQ0hBUlNbKGgwID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDAgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gyICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDMgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toNCAmIDB4MEZdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLnRvU3RyaW5nID0gU2hhMS5wcm90b3R5cGUuaGV4O1xuXG4gIFNoYTEucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gW1xuICAgICAgKGgwID4+PiAyNCkgJiAweEZGLCAoaDAgPj4+IDE2KSAmIDB4RkYsIChoMCA+Pj4gOCkgJiAweEZGLCBoMCAmIDB4RkYsXG4gICAgICAoaDEgPj4+IDI0KSAmIDB4RkYsIChoMSA+Pj4gMTYpICYgMHhGRiwgKGgxID4+PiA4KSAmIDB4RkYsIGgxICYgMHhGRixcbiAgICAgIChoMiA+Pj4gMjQpICYgMHhGRiwgKGgyID4+PiAxNikgJiAweEZGLCAoaDIgPj4+IDgpICYgMHhGRiwgaDIgJiAweEZGLFxuICAgICAgKGgzID4+PiAyNCkgJiAweEZGLCAoaDMgPj4+IDE2KSAmIDB4RkYsIChoMyA+Pj4gOCkgJiAweEZGLCBoMyAmIDB4RkYsXG4gICAgICAoaDQgPj4+IDI0KSAmIDB4RkYsIChoNCA+Pj4gMTYpICYgMHhGRiwgKGg0ID4+PiA4KSAmIDB4RkYsIGg0ICYgMHhGRlxuICAgIF07XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXkgPSBTaGExLnByb3RvdHlwZS5kaWdlc3Q7XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG4gICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDAsIHRoaXMuaDApO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMig0LCB0aGlzLmgxKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoOCwgdGhpcy5oMik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDEyLCB0aGlzLmgzKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoMTYsIHRoaXMuaDQpO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgZnVuY3Rpb24gSG1hY1NoYTEoa2V5LCBzaGFyZWRNZW1vcnkpIHtcbiAgICB2YXIgaSwgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShrZXkpO1xuICAgIGtleSA9IHJlc3VsdFswXTtcbiAgICBpZiAocmVzdWx0WzFdKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgbGVuZ3RoID0ga2V5Lmxlbmd0aCwgaW5kZXggPSAwLCBjb2RlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvZGUgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4YzAgfCAoY29kZSA+Pj4gNikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHhlMCB8IChjb2RlID4+PiAxMikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweDNmZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gNikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8IChjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBrZXkgPSBieXRlcztcbiAgICB9XG5cbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDY0KSB7XG4gICAgICBrZXkgPSAobmV3IFNoYTEodHJ1ZSkpLnVwZGF0ZShrZXkpLmFycmF5KCk7XG4gICAgfVxuXG4gICAgdmFyIG9LZXlQYWQgPSBbXSwgaUtleVBhZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgKytpKSB7XG4gICAgICB2YXIgYiA9IGtleVtpXSB8fCAwO1xuICAgICAgb0tleVBhZFtpXSA9IDB4NWMgXiBiO1xuICAgICAgaUtleVBhZFtpXSA9IDB4MzYgXiBiO1xuICAgIH1cblxuICAgIFNoYTEuY2FsbCh0aGlzLCBzaGFyZWRNZW1vcnkpO1xuXG4gICAgdGhpcy51cGRhdGUoaUtleVBhZCk7XG4gICAgdGhpcy5vS2V5UGFkID0gb0tleVBhZDtcbiAgICB0aGlzLmlubmVyID0gdHJ1ZTtcbiAgICB0aGlzLnNoYXJlZE1lbW9yeSA9IHNoYXJlZE1lbW9yeTtcbiAgfVxuICBIbWFjU2hhMS5wcm90b3R5cGUgPSBuZXcgU2hhMSgpO1xuXG4gIEhtYWNTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICB0aGlzLmlubmVyID0gZmFsc2U7XG4gICAgICB2YXIgaW5uZXJIYXNoID0gdGhpcy5hcnJheSgpO1xuICAgICAgU2hhMS5jYWxsKHRoaXMsIHRoaXMuc2hhcmVkTWVtb3J5KTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMub0tleVBhZCk7XG4gICAgICB0aGlzLnVwZGF0ZShpbm5lckhhc2gpO1xuICAgICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV4cG9ydHMgPSBjcmVhdGVNZXRob2QoKTtcbiAgZXhwb3J0cy5zaGExID0gZXhwb3J0cztcbiAgZXhwb3J0cy5zaGExLmhtYWMgPSBjcmVhdGVIbWFjTWV0aG9kKCk7XG5cbiAgaWYgKENPTU1PTl9KUykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiAgfSBlbHNlIHtcbiAgICByb290LnNoYTEgPSBleHBvcnRzO1xuICAgIGlmIChBTUQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwgIi8qKlxuICogQ2VudHJhbGlzZWQgRkhJUiBDb2RlU3lzdGVtIC8gSWRlbnRpZmllclN5c3RlbSBVUklzIHVzZWQgYnkgdGhlIG1hcHBlcnMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvZmhpci9zeXN0ZW1zLnB5YC4gV2UgdXNlIFVSTC1mb3JtIHN5c3RlbXMgaW5zdGVhZFxuICogb2YgT0lEcyBiZWNhdXNlOlxuICogICAtIGl0IGRvZXNuJ3QgcmVxdWlyZSBtaW50aW5nL293bmluZyBhIHJlYWwgTkhJL1RXIGNvcmUgT0lELFxuICogICAtIGl0J3Mgc2VsZi1kZXNjcmliaW5nIGluIHRvb2xzIHRoYXQgZG9uJ3QgcmVjb2duaXNlIHRoZSBPSUQsXG4gKiAgIC0gaXQgY2xlYW5seSBzdXJ2aXZlcyB0aGUgVFdOSElGSElSIHZhbGlkYXRvcidzIHN5bnRhY3RpYyBjaGVjay5cbiAqXG4gKiBBbGwgc3lzdGVtcyBsaXZlIGhlcmUgc28gYSBzaW5nbGUgY2hhbmdlIHJpcHBsZXMgdG8gZXZlcnkgbWFwcGVyLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgbmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU1MDY1XHU0RkREXHU3RjcyXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIChsYWIgKyBwcm9jZWR1cmUgb3JkZXIgY29kZXMgXHUyMDE0IHNhbWUgbmFtZXNwYWNlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfTUVESUNBTF9PUkRFUl9DT0RFID1cbiAgXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1tZWRpY2FsLW9yZGVyLWNvZGVcIjtcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1ODVFNVx1NTRDMVx1NEVFM1x1NzhCQyAoZHJ1ZyBjb2RlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfRFJVR19DT0RFID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1kcnVnLWNvZGVcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRhaXdhbiBwYXRpZW50IGlkZW50aWZpZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIChUYWl3YW4gbmF0aW9uYWwgSUQpLiAqL1xuZXhwb3J0IGNvbnN0IFRXX05BVElPTkFMX0lEID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9JZGVudGlmaWVyU3lzdGVtL25hdGlvbmFsLWlkXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBmYWxsYmFja3MgKHBlci1kZXBsb3ltZW50LCBOT1QgY3Jvc3Mtc3lzdGVtIGNhbm9uaWNhbCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTEFCX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWxhYlwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLW1lZGljYXRpb25cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUkVQT1JUX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLXJlcG9ydFwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9DT05ESVRJT05fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1wcm9jZWR1cmVcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQUxMRVJHRU5fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtYWxsZXJnZW5cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUEFUSUVOVF9NUk4gPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0lkZW50aWZpZXJTeXN0ZW0vaGlzLW1yblwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJuYXRpb25hbCBjb2RlIHN5c3RlbXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBMT0lOQyA9IFwiaHR0cDovL2xvaW5jLm9yZ1wiO1xuZXhwb3J0IGNvbnN0IFNOT01FRF9DVCA9IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiO1xuLyoqIElDRC0xMC1DTSAoVGFpd2FuIC8gXHU1MDY1XHU0RkREIHVzZXMgdGhpcywgbm90IGJhcmUgSUNELTEwKS4gKi9cbmV4cG9ydCBjb25zdCBJQ0RfMTBfQ00gPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiO1xuZXhwb3J0IGNvbnN0IElDRF8xMF9QQ1MgPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1wY3NcIjtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBPTkxZIGFcbiAqIGhhc2hlZCBQYXRpZW50LmlkIChlLmcuIHZpYSBhbiBIVFRQIGFjY2VzcyBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGVcbiAqIH4zME0gVGFpd2FuZXNlIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdFxuICogdGhpcyBiZWNhdXNlIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3XG4gKiBuYXRpb25hbCBJRCBpbiBhbnkgbGVha2VkIEJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBCdW5kbGUtbGVha1xuICogc2NlbmFyaW9zIGRpc2Nsb3NlIGJvdGggZmllbGRzIHRvZ2V0aGVyLCBzbyBhIHNhbHQgd291bGQgbm90IG1vdmVcbiAqIHRoZSBuZWVkbGUgdGhlcmUuIFRoZSByZW1haW5pbmcgc2luZ2xlLWZpZWxkIGxlYWsgdmVjdG9yIGlzIEhUVFBcbiAqIGFjY2VzcyBsb2dzOyBkZXBsb3ltZW50cyBzaG91bGQgc2NydWIgYC9maGlyL1BhdGllbnQvW14vXStgIHBhdGhzXG4gKiBhbmQgYD9wYXRpZW50PWAgcXVlcnkgc3RyaW5ncyBhdCB0aGUgcmV2ZXJzZS1wcm94eSBsYXllciAoc2VlXG4gKiBBUkNISVRFQ1RVUkUubWQgXHUwMEE3XCJQYXRpZW50LmlkIFx1NTNDRFx1NjNBOFx1OThBOFx1OTZBQVx1ODIwN1x1N0RFOVx1ODlFM1wiKS5cbiAqXG4gKiBVc2VzIGBqcy1zaGExYCAocHVyZSBKUykgaW5zdGVhZCBvZiBgbm9kZTpjcnlwdG9gIHNvIHRoZSBzYW1lIG1hcHBlclxuICogY29kZSBydW5zIHVubW9kaWZpZWQgaW4gdGhlIENocm9tZSBleHRlbnNpb24ncyBsb2NhbC1vbmx5IG1vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVJZChwYXRpZW50SWQ6IHN0cmluZywgLi4ucGFydHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW3BhdGllbnRJZCwgLi4ucGFydHNdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogTWFwIGEgcmF3IG5hdGlvbmFsIElEIChvciBhbnkgcGF0aWVudCBpZGVudGlmaWVyKSB0byBpdHMgMzItY2hhciBoZXhcbiAqIEZISVIgYFBhdGllbnQuaWRgLiBUaGUgcmF3IHZhbHVlIGlzIGtlcHQgaW4gYFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlYFxuICogXHUyMDE0IG9ubHkgdGhlIEZISVIgbG9naWNhbCBpZCBpcyBoYXNoZWQgc28gaXQgZG9lc24ndCBsZWFrIGludG8gVVJMcyxcbiAqIHN1YmplY3QucmVmZXJlbmNlIGZpZWxkcywgYXVkaXQgbG9ncywgb3IgU01BUlQgdG9rZW4gcGF5bG9hZHMuXG4gKlxuICogRkhJUiBSNCBcdTAwQTcyLjIwIHNheXMgXCJsb2dpY2FsIGlkIFx1MjAyNiBTSE9VTEQgTk9UIGNvbnRhaW4gaWRlbnRpZnlpbmdcbiAqIGluZm9ybWF0aW9uXCIgXHUyMDE0IHRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVQYXRpZW50SWQobmF0aW9uYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW1wicGF0aWVudFwiLCBuYXRpb25hbElkXS5qb2luKFwifFwiKSkuc2xpY2UoMCwgMzIpO1xufVxuXG4vKipcbiAqIFBhcnRpYWxseS1hbm9ueW1pemUgYSBwYXRpZW50IG5hbWUuIEFwcGxpZWQgaW4gbWFwUGF0aWVudCBzbyBldmVyeVxuICogRkhJUiByZXNvdXJjZSB0aGF0IGZsb3dzIG91dCBvZiB0aGlzIGNvZGViYXNlIChkb3dubG9hZGVkIEJ1bmRsZSxcbiAqIGJhY2tlbmQgRkhJUiBzdG9yZSwgZGFzaGJvYXJkLCBTTUFSVCBhcHAgbGF1bmNoZXMpIHNlZXMgdGhlIG1hc2tlZFxuICogZm9ybS4gVGhlIHVzZXIncyByYXcgaW5wdXQgaXMgc3RpbGwga2VwdCBpbiBjaHJvbWUuc3RvcmFnZSBzbyB0aGV5XG4gKiBjYW4gcmV2aWV3IHdoYXQgd2FzIGVudGVyZWQsIGJ1dCBpdCBuZXZlciBsZWF2ZXMgUGF0aWVudCBjb250ZXh0LlxuICpcbiAqIFJ1bGVzIChUYWl3YW4gLyBDSksgY29udmVudGlvbik6XG4gKiAgIC0gMSBjaGFyICAgICBcdTIxOTIga2VlcCBhcy1pcyAobm90aGluZyB0byBtYXNrKVxuICogICAtIDIgY2hhcnMgICAgXHUyMTkyIGtlZXAgZmlyc3QsIHJlcGxhY2Ugc2Vjb25kIHdpdGggTyAgICBcdTczOEJcdTY2MEUgXHUyMTkyIFx1NzM4Qk9cbiAqICAgLSAzKyBjaGFycyAgIFx1MjE5MiBrZWVwIGZpcnN0ICsgbGFzdCwgbWlkZGxlIGFsbCBPICAgICAgXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTY3OTdcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1Njc5N09PXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTRFMkRcdTVDRjZcdTUwNjVcdTZCMjFcdTkwQ0UgXHUyMTkyIFx1NEUyRE9PT1x1OTBDRVxuICpcbiAqIFdlc3Rlcm4gbmFtZXMgKGNvbnRhaW4gd2hpdGVzcGFjZSk6IHNwbGl0IG9uIHNwYWNlLCBrZWVwIGZpcnN0ICtcbiAqIGxhc3QgdG9rZW5zLCBwYXJ0aWFsLW1hc2sgdGhlIGxhc3QgYW5kIG1pZGRsZTpcbiAqICAgSm9obiBTbWl0aCBcdTIxOTIgSm9obiBTKioqXG4gKiAgIEpvaG4gUSBTbWl0aCBcdTIxOTIgSm9obiAqKiogU21pdGhcbiAqL1xuLyoqXG4gKiBIYWxmLW1hc2sgYSBUYWl3YW4gbmF0aW9uYWwgSUQgZm9yIHNob3VsZGVyLXN1cmZpbmctc2FmZSBkaXNwbGF5LlxuICogTWF0Y2hlcyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBJ3Mgb3duIGBoaWRgIGNvbnZlbnRpb24gKGZpcnN0IDYgdmlzaWJsZSwgbGFzdFxuICogNCBoaWRkZW4pOiBgUDEyMzQ1MDg2NmAgXHUyMTkyIGBQMTIzNDUqKioqYC5cbiAqXG4gKiBgY2hhcmAgZGVmYXVsdHMgdG8gYCpgIGZvciBwb3B1cC90b2FzdCBkaXNwbGF5LiBVc2UgYFhgIGZvciBmaWxlbmFtZXNcbiAqIHNpbmNlIGAqYCBpcyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIFRoZSBhdXRvLWdlbmVyYXRlZFxuICogYGF1dG8tWFhYWFhYWFhgIHBsYWNlaG9sZGVycyBmbG93IHRocm91Z2ggdW5jaGFuZ2VkIChhbHJlYWR5XG4gKiBub24taWRlbnRpZnlpbmcpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFza0lkKGlkOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjaGFyID0gXCIqXCIpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKGlkID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gcztcbiAgaWYgKC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChzKSkgcmV0dXJuIHMuc2xpY2UoMCwgNikgKyBjaGFyLnJlcGVhdCg0KTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gcztcbiAgaWYgKHMubGVuZ3RoID4gNikgcmV0dXJuIHMuc2xpY2UoMCwgMikgKyBjaGFyLnJlcGVhdChzLmxlbmd0aCAtIDQpICsgcy5zbGljZSgtMik7XG4gIHJldHVybiBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFza05hbWUobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSAobmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghdHJpbW1lZCB8fCB0cmltbWVkID09PSBcIlVua25vd25cIikgcmV0dXJuIHRyaW1tZWQ7XG5cbiAgaWYgKC9cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoL1xccysvKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSByZXR1cm4gcGFydHNbMF0hO1xuICAgIGNvbnN0IGZpcnN0ID0gcGFydHNbMF0hO1xuICAgIGNvbnN0IGxhc3QgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSE7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gRml4ZWQgMyBzdGFycyByZWdhcmRsZXNzIG9mIG9yaWdpbmFsIGxlbmd0aCBcdTIwMTQgZG9uJ3QgbGVhayBob3dcbiAgICAgIC8vIGxvbmcgdGhlIHN1cm5hbWUgd2FzIHZpYSBtYXNrIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxhc3RNYXNrZWQgPSBsYXN0Lmxlbmd0aCA8PSAxID8gbGFzdCA6IGAke2xhc3RbMF19KioqYDtcbiAgICAgIHJldHVybiBgJHtmaXJzdH0gJHtsYXN0TWFza2VkfWA7XG4gICAgfVxuICAgIGNvbnN0IG1pZGRsZXMgPSBwYXJ0cy5zbGljZSgxLCAtMSkubWFwKCgpID0+IFwiKioqXCIpO1xuICAgIHJldHVybiBbZmlyc3QsIC4uLm1pZGRsZXMsIGxhc3RdLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgLy8gQ0pLIC8gc2luZ2xlLXRva2VuIHBhdGguIEl0ZXJhdGUgY29kZXBvaW50cyAobm90IFVURi0xNiB1bml0cykgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyBjYW4ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKHRyaW1tZWQpO1xuICBpZiAoY2hhcnMubGVuZ3RoIDw9IDEpIHJldHVybiB0cmltbWVkO1xuICBpZiAoY2hhcnMubGVuZ3RoID09PSAyKSByZXR1cm4gYCR7Y2hhcnNbMF19T2A7XG4gIHJldHVybiBjaGFyc1swXSArIFwiT1wiLnJlcGVhdChjaGFycy5sZW5ndGggLSAyKSArIGNoYXJzW2NoYXJzLmxlbmd0aCAtIDFdO1xufVxuIiwgIi8qKlxuICogQWxsZXJneUludG9sZXJhbmNlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvYWxsZXJneS5weWAuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUxMT1dFRF9DQVRFR09SSUVTID0gbmV3IFNldChbXCJtZWRpY2F0aW9uXCIsIFwiZm9vZFwiLCBcImVudmlyb25tZW50XCIsIFwiYmlvbG9naWNcIl0pO1xuY29uc3QgQUxMT1dFRF9DUklUSUNBTElUWSA9IG5ldyBTZXQoW1wiaGlnaFwiLCBcImxvd1wiLCBcInVuYWJsZS10by1hc3Nlc3NcIl0pO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwicnhub3JtXCIpKSByZXR1cm4gXCJodHRwOi8vd3d3Lm5sbS5uaWguZ292L3Jlc2VhcmNoL3VtbHMvcnhub3JtXCI7XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9BTExFUkdFTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQWxsZXJneUludG9sZXJhbmNlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQWxsZXJnZW5cIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQWxsZXJneUludG9sZXJhbmNlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcucmVjb3JkZWRfZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgcGF0aWVudDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjbGluaWNhbFN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtY2xpbmljYWxcIixcbiAgICAgICAgICBjb2RlOiBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtdmVyaWZpY2F0aW9uXCIsXG4gICAgICAgICAgY29kZTogXCJjb25maXJtZWRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGNhdGVnb3J5ID0gcmF3LmNhdGVnb3J5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NBVEVHT1JJRVMuaGFzKGNhdGVnb3J5KSkge1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW2NhdGVnb3J5XTtcbiAgfVxuXG4gIGNvbnN0IGNyaXRpY2FsaXR5ID0gcmF3LmNyaXRpY2FsaXR5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NSSVRJQ0FMSVRZLmhhcyhjcml0aWNhbGl0eSkpIHtcbiAgICByZXNvdXJjZS5jcml0aWNhbGl0eSA9IGNyaXRpY2FsaXR5O1xuICB9XG5cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IHJlYWN0aW9uTm90ZSA9IHJhdy5yZWFjdGlvbiA/PyBcIlwiO1xuICBpZiAocmVhY3Rpb25Ob3RlKSB7XG4gICAgcmVzb3VyY2UucmVhY3Rpb24gPSBbeyBkZXNjcmlwdGlvbjogcmVhY3Rpb25Ob3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogQ29uZGl0aW9uIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvY29uZGl0aW9uLnB5YC4gSW5jbHVkZXMgdGhlIElDRC0xMC1DTVxuICogbm9ybWFsaXNlciAoVFdOSElGSElSIFJvdW5kLTMgZml4KSB3aGljaCBpbnNlcnRzIHRoZSBjYW5vbmljYWwgZG90XG4gKiBiYWNrIGludG8gTkhJJ3MgdW4tZG90dGVkIGNvZGVzIChcIkUxMTIyXCIgXHUyMTkyIFwiRTExLjIyXCIpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbi8vIElDRC0xMC1DTSBjYW5vbmljYWwgZm9ybSBpcyAnWFhYLllZWVtBLVpdJyAoY2F0ZWdvcnkgMyBjaGFycyArIG9wdGlvbmFsXG4vLyBkb3QgKyBzdWJkaXZpc2lvbiArIG9wdGlvbmFsIDd0aC1jaGFyYWN0ZXIgZXh0ZW5zaW9uKS4gTkhJIFx1NTA2NVx1NEZERCBzZW5kc1xuLy8gY29kZXMgV0lUSE9VVCB0aGUgZG90ICgnRTExMjInLCAnTTQ3ODkyJywgJ1MwOTkzWEEnLCAnTTE5MjcxJykuXG4vLyBWYWxpZGF0b3IgcmVqZWN0cyB1bi1kb3R0ZWQgY29kZXMgYXMgJ1Vua25vd24gY29kZScuXG5jb25zdCBJQ0QxMF9DQVRFR09SWV9SRSA9IC9eW0EtWl1bMC05QS1aXXsyfSQvO1xuXG4vKipcbiAqIEluc2VydCB0aGUgZG90IGJhY2sgaW50byBOSEkncyBuby1kb3QgSUNELTEwLUNNIGNvZGVzLlxuICogICBFMTEyMiAgICBcdTIxOTIgRTExLjIyXG4gKiAgIE00Nzg5MiAgIFx1MjE5MiBNNDcuODkyXG4gKiAgIFMwOTkzWEEgIFx1MjE5MiBTMDkuOTNYQVxuICogICBFMTEgICAgICBcdTIxOTIgRTExICAgICAgICAobm8gc3ViZGl2aXNpb247IHBhc3MgdGhyb3VnaClcbiAqICAgRTExLjIyICAgXHUyMTkyIEUxMS4yMiAgICAgKGFscmVhZHkgZG90dGVkOyBwYXNzIHRocm91Z2gpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVJY2QxMENtKGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWNvZGUgfHwgY29kZS5pbmNsdWRlcyhcIi5cIikpIHJldHVybiBjb2RlID8/IFwiXCI7XG4gIGNvbnN0IHMgPSBjb2RlLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAocy5sZW5ndGggPD0gMykgcmV0dXJuIHM7XG4gIGNvbnN0IGhlYWQgPSBzLnNsaWNlKDAsIDMpO1xuICBjb25zdCB0YWlsID0gcy5zbGljZSgzKTtcbiAgaWYgKElDRDEwX0NBVEVHT1JZX1JFLnRlc3QoaGVhZCkpIHtcbiAgICByZXR1cm4gYCR7aGVhZH0uJHt0YWlsfWA7XG4gIH1cbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJpY2QtMTBcIikgfHwgcy5pbmNsdWRlcyhcImljZDEwXCIpKSB7XG4gICAgLy8gTkhJIFx1NTA2NVx1NEZERCBjb2RlcyBhcmUgSUNELTEwLUNNIChVUy9UYWl3YW4gZXh0ZW5kZWQgc2V0IFx1MjAxNCBlLmcuXG4gICAgLy8gRTExLjIyKS4gVGhlIGJhc2UgSUNELTEwIFZhbHVlU2V0IHJlamVjdHMgdGhlc2UgYXMgJ1Vua25vd24gY29kZScuXG4gICAgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX0NNO1xuICB9XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9DT05ESVRJT05fQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcENvbmRpdGlvbihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQ29uZGl0aW9uXCI7XG4gIGxldCBjb2RlID0gcmF3LmNvZGUgYXMgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG4gIGlmIChzeXN0ZW0gPT09IHN5c3RlbXMuSUNEXzEwX0NNICYmIGNvZGUpIHtcbiAgICBjb2RlID0gbm9ybWFsaXplSWNkMTBDbShjb2RlKTtcbiAgfVxuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJDb25kaXRpb25cIixcbiAgICAvLyBTdGFibGUgaWQgZmFsbHMgYmFjayB0byBkaXNwbGF5IHdoZW4gbm8gY29kZSBpcyBwcmVzZW50IChjYXRhc3Ryb3BoaWNcbiAgICAvLyBpbGxuZXNzIHJvd3MgZnJvbSBJSEtFMzIwOSBjYXJyeSB0aGUgQ2hpbmVzZSBuYXJyYXRpdmUgb25seSkuIE1pcnJvcnNcbiAgICAvLyB0aGUgc2FtZSBgY29kZSB8fCBkaXNwbGF5YCBwYXR0ZXJuIGluIGRpYWdub3N0aWMtcmVwb3J0LnRzIGFuZFxuICAgIC8vIGFsbGVyZ3kudHMgXHUyMDE0IGF2b2lkcyBoYXNoIGNvbGxpc2lvbnMgYmV0d2VlbiB0d28gc2FtZS1kYXkgY29kZS1sZXNzXG4gICAgLy8gY29uZGl0aW9ucy5cbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5vbnNldF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IHJhdy5jbGluaWNhbF9zdGF0dXMgPz8gXCJhY3RpdmVcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB2ZXJpZmljYXRpb25TdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLXZlci1zdGF0dXNcIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9O1xuXG4gIC8vIENhdGVnb3J5IHJvdXRlcyB0aGUgQ29uZGl0aW9uIGludG8gdGhlIHJpZ2h0IGRvd25zdHJlYW0gdmlldy5cbiAgLy8gLSBcInByb2JsZW0tbGlzdC1pdGVtXCIgXHUyMTkyIFNNQVJUIC8gSVBTIFByb2JsZW0gTGlzdCBzZWN0aW9uXG4gIC8vIC0gXCJlbmNvdW50ZXItZGlhZ25vc2lzXCIgXHUyMTkyIHBlci1lbmNvdW50ZXIgZGlhZ25vc2VzXG4gIC8vIC0gXCJoZWFsdGgtY29uY2VyblwiIFx1MjE5MiBJUFMgSGVhbHRoIENvbmNlcm5zXG4gIC8vIEFkYXB0ZXItbGV2ZWwgZGVjaXNpb246IFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSByb3dzIG1hcmsgY2F0ZWdvcnk9XCJwcm9ibGVtLWxpc3QtaXRlbVwiO1xuICAvLyBnZW5lcmljIGVuY291bnRlci1kZXJpdmVkIGNvbmRpdGlvbnMgY2FuIG9taXQsIGRlZmF1bHRpbmcgdG8gbm9cbiAgLy8gZXhwbGljaXQgY2F0ZWdvcnkgKFNNQVJUIGFwcHMgZmFsbCB0aHJvdWdoIHRvIGFsbC1jb25kaXRpb25zIHZpZXcpLlxuICBpZiAocmF3LmNhdGVnb3J5KSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogcmF3LmNhdGVnb3J5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICByZXNvdXJjZS5jb2RlID0ge1xuICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgdGV4dDogZGlzcGxheSxcbiAgfTtcblxuICBjb25zdCBzZXZlcml0eSA9IHJhdy5zZXZlcml0eSA/PyBcIlwiO1xuICBpZiAoc2V2ZXJpdHkpIHtcbiAgICByZXNvdXJjZS5zZXZlcml0eSA9IHsgdGV4dDogc2V2ZXJpdHkgfTtcbiAgfVxuXG4gIGlmIChyYXcub25zZXRfZGF0ZSkge1xuICAgIHJlc291cmNlLm9uc2V0RGF0ZVRpbWUgPSBgJHtyYXcub25zZXRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcucmVjb3JkZWRfZGF0ZSkge1xuICAgIHJlc291cmNlLnJlY29yZGVkRGF0ZSA9IGAke3Jhdy5yZWNvcmRlZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBEaWFnbm9zdGljUmVwb3J0IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZGlhZ25vc3RpY19yZXBvcnQucHlgLiBSZXR1cm5zIG51bGwgZm9yXG4gKiBsaXN0LXBhZ2Ugcm93cyBsYWNraW5nIGEgY29uY2x1c2lvbiwgYW5kIGZvciBsYWItdmFsdWUtb25seSBcInJlcG9ydHNcIlxuICogdGhhdCB3b3VsZCBkdXBsaWNhdGUgYSBwcm9wZXIgT2JzZXJ2YXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgVjJfMDA3NCA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92Mi0wMDc0XCI7XG5cbmNvbnN0IENBVEVHT1JZX01BUDogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgTEFCOiBbVjJfMDA3NCwgXCJMQUJcIiwgXCJMYWJvcmF0b3J5XCJdLFxuICBSQUQ6IFtWMl8wMDc0LCBcIlJBRFwiLCBcIlJhZGlvbG9neVwiXSxcbiAgQ0FSOiBbVjJfMDA3NCwgXCJDQVJcIiwgXCJDYXJkaW9sb2d5XCJdLFxuICBQQVRIOiBbVjJfMDA3NCwgXCJQQVRcIiwgXCJQYXRob2xvZ3lcIl0sXG59O1xuXG4vLyBMYWItcmVzdWx0IHBhdHRlcm5zIHRoYXQgbG9vayBsaWtlIHNpbmdsZS12YWx1ZSBsYWIgcmVhZGluZ3MgcmF0aGVyXG4vLyB0aGFuIGEgbmFycmF0aXZlIHJlcG9ydC5cbmNvbnN0IExBQl9VTklUX1JFID1cbiAgL1xcZCsoPzpcXC5cXGQrKT9cXHMqKD86JXxtZ1xcL2RMfGdcXC9kTHxtbW9sXFwvTHxVXFwvTHxJVVxcL0x8bUlVXFwvTHxuZ1xcL21MfFx1MDNCQ2dcXC9kTHx1Z1xcL2RMfHBnXFwvbUx8Zkx8XFwvdUx8MTBcXF4/XFxkK1xcL3VMfHgxMFxcXj9cXGQrXFwvdUx8c2VjfFx1NzlEMnxjb3BpZXNcXC9tTCkvO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIHRydWU7XG4gIGNvbnN0IHRleHQgPSBjb25jbHVzaW9uLnRyaW0oKTtcbiAgLy8gUmVhbCBuYXJyYXRpdmUgcmVwb3J0cyBhbG1vc3QgYWx3YXlzIGNvbnRhaW4gbXVsdGlwbGUgc2VudGVuY2VzLlxuICBpZiAodGV4dC5sZW5ndGggPiAxMDApIHJldHVybiBmYWxzZTtcbiAgLy8gU2luZ2xlIHZhbHVlIHBhdHRlcm4gKyBwYXJlbnRoZXRpY2FsIHJlZmVyZW5jZSByYW5nZSA9IGxhYiBsaW5lLlxuICBpZiAoTEFCX1VOSVRfUkUudGVzdCh0ZXh0KSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcERpYWdub3N0aWNSZXBvcnQoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoKHJhdy5jb25jbHVzaW9uID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWNvbmNsdXNpb24pIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGNhdEtleVJhdyA9IFN0cmluZyhyYXcuY2F0ZWdvcnkgPz8gXCJcIikudG9VcHBlckNhc2UoKTtcbiAgaWYgKGNhdEtleVJhdyA9PT0gXCJMQUJcIiAmJiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUmVwb3J0XCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtSGludCA9IHJhdy5zeXN0ZW0gPz8gXCJcIjtcbiAgY29uc3Qgc3lzdGVtID1cbiAgICB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiAmJiBzeXN0ZW1IaW50LnRvVXBwZXJDYXNlKCkgPT09IFwiTE9JTkNcIlxuICAgICAgPyBzeXN0ZW1zLkxPSU5DXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1JFUE9SVF9DT0RFO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcuZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiByYXcuc3RhdHVzID8/IFwiZmluYWxcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gICAgY29uY2x1c2lvbixcbiAgfTtcblxuICBjb25zdCBjYXRFbnRyeSA9IENBVEVHT1JZX01BUFtjYXRLZXlSYXddO1xuICBpZiAoY2F0RW50cnkpIHtcbiAgICBjb25zdCBbY2F0U3lzLCBjYXRDb2RlLCBjYXREaXNwbGF5XSA9IGNhdEVudHJ5O1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW3sgY29kaW5nOiBbeyBzeXN0ZW06IGNhdFN5cywgY29kZTogY2F0Q29kZSwgZGlzcGxheTogY2F0RGlzcGxheSB9XSB9XTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAocmF3Lmlzc3VlZCkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5pc3N1ZWR9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfSBlbHNlIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIEVuY291bnRlciBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2VuY291bnRlci5weWAuIFN0YWJsZSBJRCBpbmNsdWRlcyBob3NwaXRhbFxuICogc28gc2FtZS1kYXkgdmlzaXRzIHRvIGRpZmZlcmVudCBpbnN0aXR1dGlvbnMgZWFjaCBnZXQgdGhlaXIgb3duXG4gKiBFbmNvdW50ZXIgKHRoZSBwb3N0LW1hcHBpbmcgbGlua2VyIGRlcGVuZHMgb24gdGhpcykuXG4gKi9cblxuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IEFDVENPREVfU1lTVEVNID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YzLUFjdENvZGVcIjtcblxuY29uc3QgQ0xBU1NfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBBTUI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJBTUJcIiwgXCJhbWJ1bGF0b3J5XCJdLFxuICBJTVA6IFtBQ1RDT0RFX1NZU1RFTSwgXCJJTVBcIiwgXCJpbnBhdGllbnQgZW5jb3VudGVyXCJdLFxuICBFTUVSOiBbQUNUQ09ERV9TWVNURU0sIFwiRU1FUlwiLCBcImVtZXJnZW5jeVwiXSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBFbmNvdW50ZXIocmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCBlbmNDbGFzcyA9IFN0cmluZyhyYXcuY2xhc3MgPz8gXCJBTUJcIikudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2xhc3NFbnRyeSA9IENMQVNTX01BUFtlbmNDbGFzc10gPz8gQ0xBU1NfTUFQLkFNQiE7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkVuY291bnRlclwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIHJhdy5kYXRlID8/IFwiXCIsIGVuY0NsYXNzLCAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKSksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5pc2hlZFwiLFxuICAgIGNsYXNzOiB7XG4gICAgICBzeXN0ZW06IGNsYXNzRW50cnlbMF0sXG4gICAgICBjb2RlOiBjbGFzc0VudHJ5WzFdLFxuICAgICAgZGlzcGxheTogY2xhc3NFbnRyeVsyXSxcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgLy8gTkhJJ3MgZW5jb3VudGVyIFwidHlwZVwiIG1hcmtlcnMgXHUyMDE0ICdJQ1x1NTM2MVx1OENDN1x1NjU5OScgLyAnXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5JyAvICdcdTRGNEZcdTk2NjInXG4gIC8vIFx1MjAxNCBhcmUgZGF0YS1vcmlnaW4gbGFiZWxzLCBub3QgU05PTUVEIGNsaW5pY2FsIHR5cGVzLiBLZWVwIHRoZW0gYXNcbiAgLy8gQ29kZWFibGVDb25jZXB0LnRleHQgd2l0aG91dCBjbGFpbWluZyBTTk9NRUQuXG4gIGNvbnN0IHR5cGVEaXNwbGF5ID0gKChyYXcudHlwZV9kaXNwbGF5ID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAodHlwZURpc3BsYXkpIHtcbiAgICByZXNvdXJjZS50eXBlID0gW3sgdGV4dDogdHlwZURpc3BsYXkgfV07XG4gIH1cblxuICBjb25zdCBwZXJpb2Q6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgaWYgKHJhdy5kYXRlKSBwZXJpb2Quc3RhcnQgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3LmVuZF9kYXRlKSBwZXJpb2QuZW5kID0gYCR7cmF3LmVuZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChPYmplY3Qua2V5cyhwZXJpb2QpLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5wZXJpb2QgPSBwZXJpb2Q7XG4gIH1cblxuICBjb25zdCBkZXBhcnRtZW50ID0gcmF3LmRlcGFydG1lbnQgPz8gXCJcIjtcbiAgY29uc3QgcHJvdmlkZXIgPSByYXcucHJvdmlkZXIgPz8gXCJcIjtcbiAgaWYgKGRlcGFydG1lbnQgfHwgcHJvdmlkZXIpIHtcbiAgICBjb25zdCBwYXJ0aWNpcGFudDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChwcm92aWRlcikgcGFydGljaXBhbnQuaW5kaXZpZHVhbCA9IHsgZGlzcGxheTogcHJvdmlkZXIgfTtcbiAgICByZXNvdXJjZS5wYXJ0aWNpcGFudCA9IE9iamVjdC5rZXlzKHBhcnRpY2lwYW50KS5sZW5ndGggPiAwID8gW3BhcnRpY2lwYW50XSA6IFtdO1xuICAgIGlmIChkZXBhcnRtZW50KSB7XG4gICAgICByZXNvdXJjZS5zZXJ2aWNlVHlwZSA9IHsgdGV4dDogZGVwYXJ0bWVudCB9O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnNlcnZpY2VQcm92aWRlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIC8vIEJpbGluZ3VhbCByZWFzb25Db2RlICh2MC44LjApLiBBZGFwdGVyIHNwbGl0cyBOSEkncyBiaWxpbmd1YWwgSUNEXG4gIC8vIG5hbWUgaW50byByYXcucmVhc29uIChFbmdsaXNoKSBhbmQgcmF3LnJlYXNvbl96aCAoXHU3RTQxXHU0RTJEKSwgcGx1cyB0aGVcbiAgLy8gcmF3IElDRC0xMCBjb2RlIGluIHJhdy5yZWFzb25fY29kZS4gUGF0aWVudC1mYWNpbmcgLnRleHQgdXNlcyBcdTdFNDFcdTRFMkRcbiAgLy8gKGZhbGxzIGJhY2sgdG8gRW5nbGlzaCB3aGVuIE5ISSBzaGlwcyBFbmdsaXNoLW9ubHkpOyBjb2RpbmdbXS5kaXNwbGF5XG4gIC8vIHN0YXlzIEVuZ2xpc2ggd2l0aCB0aGUgcHJvcGVyIElDRC0xMC1DTSBzeXN0ZW0uXG4gIC8vXG4gIC8vIHYwLjkuMCBhZGRzIHNlY29uZGFyeSBkaWFnbm9zZXMgKFx1NkIyMVx1OEEzQVx1NjVCNykgXHUyMDE0IElIS0UzMzAzUzAyIGRldGFpbFxuICAvLyBleHBvc2VzIHVwIHRvIDQgYWRkaXRpb25hbCBJQ0RzIHBlciBlbmNvdW50ZXIuIFRoZXkgYXJlIHB1c2hlZFxuICAvLyBhZnRlciB0aGUgcHJpbWFyeSBzbyBTTUFSVCBhcHBzIGNhbiByZW5kZXIgcmVhc29uQ29kZVswXSBhcyB0aGVcbiAgLy8gbWFpbiBkaWFnbm9zaXMgYW5kIHRoZSByZXN0IGFzIHNlY29uZGFyeSBjaGlwcy5cbiAgY29uc3QgcmVhc29uQ29kZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBjb25zdCByZWFzb24gPSAoKHJhdy5yZWFzb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IHJlYXNvblpoID0gKChyYXcucmVhc29uX3poID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCByZWFzb25Db2RlID0gKChyYXcucmVhc29uX2NvZGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChyZWFzb24gfHwgcmVhc29uWmggfHwgcmVhc29uQ29kZSkge1xuICAgIGNvbnN0IHJjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKHJlYXNvbkNvZGUpIHtcbiAgICAgIC8vIFN0cmlwIHRoZSBcIjxjb2RlPiBcIiBwcmVmaXggdGhlIGFkYXB0ZXIgcHJlcGVuZHMgdG8gdGhlIGRpc3BsYXksXG4gICAgICAvLyBzaW5jZSB0aGUgc3RydWN0dXJlZCBgY29kZWAgYWxyZWFkeSBjb252ZXlzIHRoYXQgaW5mb3JtYXRpb24uXG4gICAgICBjb25zdCBkaXNwbGF5UGxhaW4gPSByZWFzb24ucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtyZWFzb25Db2RlfVxcXFxzK2ApLCBcIlwiKS50cmltKCk7XG4gICAgICByYy5jb2RpbmcgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2hsNy5vcmcvZmhpci9zaWQvaWNkLTEwLWNtXCIsXG4gICAgICAgICAgY29kZTogcmVhc29uQ29kZSxcbiAgICAgICAgICBkaXNwbGF5OiBkaXNwbGF5UGxhaW4gfHwgcmVhc29uIHx8IHJlYXNvblpoLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG4gICAgcmMudGV4dCA9IHJlYXNvblpoIHx8IHJlYXNvbjtcbiAgICByZWFzb25Db2Rlcy5wdXNoKHJjKTtcbiAgfVxuICBjb25zdCBzZWNvbmRhcmllcyA9IEFycmF5LmlzQXJyYXkocmF3LnNlY29uZGFyeV9kaWFnbm9zZXMpID8gcmF3LnNlY29uZGFyeV9kaWFnbm9zZXMgOiBbXTtcbiAgZm9yIChjb25zdCBzZWMgb2Ygc2Vjb25kYXJpZXMpIHtcbiAgICBjb25zdCBjb2RlID0gKChzZWM/LmNvZGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gICAgY29uc3QgbmFtZUVuID0gKChzZWM/Lm5hbWVfZW4gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gICAgY29uc3QgbmFtZVpoID0gKChzZWM/Lm5hbWVfemggPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gICAgaWYgKCFjb2RlICYmICFuYW1lRW4gJiYgIW5hbWVaaCkgY29udGludWU7XG4gICAgY29uc3QgZW50cnk6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgZW50cnkuY29kaW5nID0gW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiLFxuICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgZGlzcGxheTogbmFtZUVuIHx8IG5hbWVaaCxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICAgIGVudHJ5LnRleHQgPSBjb2RlID8gYCR7Y29kZX0gJHtuYW1lWmggfHwgbmFtZUVufWAudHJpbSgpIDogbmFtZVpoIHx8IG5hbWVFbjtcbiAgICByZWFzb25Db2Rlcy5wdXNoKGVudHJ5KTtcbiAgfVxuICBpZiAocmVhc29uQ29kZXMubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSByZWFzb25Db2RlcztcbiAgfVxuXG4gIGNvbnN0IGRpc2NoYXJnZSA9IHJhdy5kaXNjaGFyZ2VfZGlzcG9zaXRpb24gPz8gXCJcIjtcbiAgaWYgKGRpc2NoYXJnZSkge1xuICAgIHJlc291cmNlLmhvc3BpdGFsaXphdGlvbiA9IHsgZGlzY2hhcmdlRGlzcG9zaXRpb246IHsgdGV4dDogZGlzY2hhcmdlIH0gfTtcbiAgfVxuXG4gIGNvbnN0IGNsaW5pY2FsTm90ZSA9ICgocmF3LmNsaW5pY2FsX25vdGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChjbGluaWNhbE5vdGUpIHtcbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogY2xpbmljYWxOb3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogSW1tdW5pemF0aW9uIG1hcHBlci5cbiAqXG4gKiBNYXBzIE5ISSBJSEtFMzIwM1MwMSAoXHU5ODEwXHU5NjMyXHU2M0E1XHU3QTJFXHU3RDAwXHU5MzA0KSByb3dzIHRvIEZISVIgUjQgSW1tdW5pemF0aW9uLlxuICogTkhJIHNoaXBzIENoaW5lc2Utb25seSB2YWNjaW5lIG5hbWVzIHdpdGggbm8gdGVybWlub2xvZ3kgY29kZSwgc29cbiAqIHZhY2NpbmVDb2RlIGNhcnJpZXMgb25seSBgdGV4dGAgKGNsZWFuIFx1NEUyRFx1NjU4NyBuYW1lIHdpdGhvdXQgbG90IHN1ZmZpeCkuXG4gKiBGdXR1cmUgZW5oYW5jZW1lbnQ6IGFkZCBDVlggLyBTTk9NRUQgQ1QgY29kaW5nIHZpYSBhIGxvb2t1cCB0YWJsZS5cbiAqXG4gKiBzdGF0dXMgaXMgaGFyZGNvZGVkIHRvIFwiY29tcGxldGVkXCIgYmVjYXVzZSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0Egb25seSBsaXN0c1xuICogYWRtaW5pc3RlcmVkIHZhY2NpbmVzIFx1MjAxNCB0aGVyZSBhcmUgbm8gcGxhbm5lZCAvIG5vdC1naXZlbiBlbnRyaWVzIGluXG4gKiBOSEkncyByZXNwb25zZSBzaGFwZS5cbiAqL1xuXG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEltbXVuaXphdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgdmFjY2luZU5hbWUgPSAoKHJhdy52YWNjaW5lX25hbWUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGRhdGUgPSAoKHJhdy5kYXRlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIXZhY2NpbmVOYW1lIHx8ICFkYXRlKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiSW1tdW5pemF0aW9uXCIsXG4gICAgLy8gU3RhYmxlIGlkIHVzZXMgZGF0ZSArIHZhY2NpbmUgbmFtZSArIGxvdCBcdTIwMTQgc2FtZSB2YWNjaW5lIHNhbWUgZGF5XG4gICAgLy8gd2l0aCB0aGUgc2FtZSBsb3QgY29sbGFwc2VzIChOSEkgcmFyZSBlZGdlIGNhc2UpOyBkaWZmZXJlbnQgbG90c1xuICAgIC8vIHdvdWxkIGJlIGRpc3RpbmN0IEltbXVuaXphdGlvbnMuXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgdmFjY2luZU5hbWUsIGRhdGUsIHJhdy5sb3RfbnVtYmVyID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiY29tcGxldGVkXCIsXG4gICAgdmFjY2luZUNvZGU6IHtcbiAgICAgIC8vIE5vIHRlcm1pbm9sb2d5IGNvZGluZyBcdTIwMTQgTkhJIGdpdmVzIENoaW5lc2UgbmFtZSBvbmx5LiBTTUFSVFxuICAgICAgLy8gYXBwcyByZW5kZXIgLnRleHQgZm9yIGJvdGggcGF0aWVudCBhbmQgY2xpbmljYWwgdmlld3MgKHRoZVxuICAgICAgLy8gdjAuOC4wIGJpbGluZ3VhbCBmYWxsYmFjayBjb250cmFjdDogaWYgRW5nbGlzaCBhYnNlbnQsIHRleHRcbiAgICAgIC8vIGlzIHRoZSBvbmx5IGRpc3BsYXkpLlxuICAgICAgdGV4dDogdmFjY2luZU5hbWUsXG4gICAgfSxcbiAgICBwYXRpZW50OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIG9jY3VycmVuY2VEYXRlVGltZTogYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgLFxuICB9O1xuXG4gIGNvbnN0IGxvdE51bWJlciA9ICgocmF3LmxvdF9udW1iZXIgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChsb3ROdW1iZXIpIHtcbiAgICByZXNvdXJjZS5sb3ROdW1iZXIgPSBsb3ROdW1iZXI7XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICAvLyBwZXJmb3JtZXIuYWN0b3IuZGlzcGxheSBtYXRjaGVzIHRoZSBFbmNvdW50ZXIgbGlua2VyJ3NcbiAgICAvLyAoaG9zcGl0YWwsIGRhdGUpIG1hdGNoIHBhdHRlcm4gaW4gbGluay50cyBcdTIwMTQgdGhvdWdoXG4gICAgLy8gSW1tdW5pemF0aW9uIGlzIG5vdCBjdXJyZW50bHkgaW4gRU5DT1VOVEVSX0xJTktBQkxFLCBhZGRpbmcgaXRcbiAgICAvLyB0aGVyZSBsYXRlciB3b3VsZCBsZXQgU01BUlQgYXBwcyBncm91cCB2YWNjaW5hdGlvbnMgYnkgdmlzaXQuXG4gICAgcmVzb3VyY2UucGVyZm9ybWVyID0gW3sgYWN0b3I6IHsgZGlzcGxheTogaG9zcGl0YWwgfSB9XTtcbiAgfVxuXG4gIGNvbnN0IHNvdXJjZSA9ICgocmF3LnNvdXJjZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKHNvdXJjZSkge1xuICAgIC8vIE5ISSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0Egc3VyZmFjZXMgdGhlIHVwc3RyZWFtIHNvdXJjZS1vZi1yZWNvcmQgb24gZXZlcnlcbiAgICAvLyB2YWNjaW5lIHJvdyAodHlwaWNhbGx5IFwiXHU3NUJFXHU3NUM1XHU3QkExXHU1MjM2XHU3RjcyXCIgPSBUYWl3YW4gQ0RDKS4gUHJlc2VydmUgYXNcbiAgICAvLyBhIG5vdGUgc28gY29uc3VtZXJzIGNhbiB0cmFjZSBwcm92ZW5hbmNlIHdpdGhvdXQgbG9zaW5nIGl0IGluXG4gICAgLy8gdGhlIG1ldGEuc291cmNlIHBhdGggdGhhdCdzIGFscmVhZHkgcG9pbnRpbmcgYXQgdGhlIGJyaWRnZS5cbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogYFx1NEY4Nlx1NkU5MDogJHtzb3VyY2V9YCB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIE1lZGljYXRpb25SZXF1ZXN0IG1hcHBlciArIGJpbGluZ3VhbCBkZWR1cGxpY2F0aW9uLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9tZWRpY2F0aW9uLnB5YC4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSByZXBvcnRzIHRoZVxuICogU0FNRSBwcmVzY3JpcHRpb24gbXVsdGlwbGUgdGltZXMgKEVuZ2xpc2gtb25seSAvIEVuZytcdTRFMkQgLyBcdTRFMkQrRW5nKS5cbiAqIGBtYXBNZWRpY2F0aW9uc0RlZHVwYCBjb2xsYXBzZXMgdGhlc2UgdG8gb25lIE1lZGljYXRpb25SZXF1ZXN0IHBlclxuICogKGRhdGUsIGNhbm9uaWNhbC1kcnVnLWtleSksIHByZWZlcnJpbmcgdGhlIGZvcm0gd2l0aCBtb3JlIENKSyBjaGFyc1xuICogKGNsaW5pY2lhbnMgcmVhZCBcdTU1NDZcdTU0QzFcdTU0MEQgZmlyc3QpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgbm9ybWFsaXplSWNkMTBDbSB9IGZyb20gXCIuL2NvbmRpdGlvblwiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmZ1bmN0aW9uIGlzQ2prKGNoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gXHU0RTAwIChVKzRFMDApIHRvIFx1OUZGRiAoVSs5RkZGKSBjb3ZlcnMgQ0pLIFVuaWZpZWQgSWRlb2dyYXBocy5cbiAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICByZXR1cm4gY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZjtcbn1cblxuZnVuY3Rpb24gY2prQ2hhcnMoczogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSBpZiAoaXNDamsoY2gpKSBuKys7XG4gIHJldHVybiBuO1xufVxuXG4vKipcbiAqIE1hdGNoIGEgXCJsb25nXCIgRW5nbGlzaCBjaHVuayAoXHUyMjY1NCBjaGFycyBvZiBBLVovMC05L3B1bmN0dWF0aW9uIGNvbW1vblxuICogdG8gZHJ1ZyBuYW1lcykuIEF2b2lkIG1hdGNoaW5nIHNob3J0IHRva2VucyBsaWtlIFwiRFwiIG9yIFwiUE9cIiB0aGF0XG4gKiBhcHBlYXIgaW5zaWRlIENoaW5lc2UgbmFtZXMuXG4gKi9cbmNvbnN0IEVOX0NIVU5LX0cgPSAvW0EtWl1bQS1aMC05LiUvXFwtXCInXFxzXXszLH0vZztcblxuLyoqXG4gKiBSZWR1Y2UgYSBkcnVnLW5hbWUgc3RyaW5nIHRvIGEgc3RhYmxlIGNhbm9uaWNhbCBrZXkuIEV4dHJhY3QgdGhlXG4gKiBsb25nZXN0IEVuZ2xpc2ggZnJhZ21lbnQsIHRoZW4gdHJ1bmNhdGUgYXQgY29tbW9uIHNlcGFyYXRvcnMgc28gYVxuICogbmFtZSB3aXRoIGV4dHJhIHRyYWlsaW5nIG1vZGlmaWVycyBzdGlsbCBjb2xsYXBzZXMgdG8gYnJhbmQrc3RyZW5ndGguXG4gKlxuICogRXhhbXBsZXMgKGFsbCBtYXAgdG8gXCJ0aW1vcHRvbCB4ZSAwLjUlIG9waHRoYWxtaWMgc29sdXRpb25cIik6XG4gKiAgIFwiVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OXCJcbiAqICAgXCJUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT04gKFx1OTc1Mlx1NzczQ1x1OTczMlx1MjAyNilcIlxuICogICBcIlx1OTc1Mlx1NzczQ1x1OTczMlx1MjAyNiAoVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OKVwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxEcnVnS2V5KG5hbWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKG5hbWUgPz8gXCJcIikudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2h1bmtzID0gWy4uLnMubWF0Y2hBbGwoRU5fQ0hVTktfRyldLm1hcCgobSkgPT4gbVswXSk7XG4gIGlmIChjaHVua3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIChuYW1lID8/IFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIGxldCBsb25nZXN0ID0gY2h1bmtzLnJlZHVjZSgoYSwgYikgPT4gKGIubGVuZ3RoID4gYS5sZW5ndGggPyBiIDogYSkpLnRyaW0oKTtcbiAgZm9yIChjb25zdCBzZXAgb2YgW1wiIC0gXCIsIFwiIFx1MjAxMyBcIiwgXCIgLyBcIl0pIHtcbiAgICBpZiAobG9uZ2VzdC5pbmNsdWRlcyhzZXApKSB7XG4gICAgICBsb25nZXN0ID0gbG9uZ2VzdC5zcGxpdChzZXApWzBdITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxvbmdlc3QucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogQmVzdC1lZmZvcnQgYWN0aXZlIHZzIGNvbXBsZXRlZCBkZWNpc2lvbiBmb3IgYSBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqIEFjdGl2ZSB3aGlsZSAoYXV0aG9yZWRfZGF0ZSArIGR1cmF0aW9uID4gdG9kYXkpOyBvdGhlcndpc2UgY29tcGxldGVkLlxuICogTWlzc2luZyBkdXJhdGlvbiBcdTIxOTIgYXNzdW1lIDkwLWRheSByZWZpbGwgd2luZG93IChOSEkncyB0eXBpY2FsIGNhZGVuY2UpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVkU3RhdHVzKFxuICBhdXRob3JlZElzbzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgZHVyYXRpb25EYXlzOiBhbnksXG4pOiBcImFjdGl2ZVwiIHwgXCJjb21wbGV0ZWRcIiB7XG4gIGlmICghYXV0aG9yZWRJc28pIHJldHVybiBcImNvbXBsZXRlZFwiO1xuICBjb25zdCBkYXRlUGFydCA9IFN0cmluZyhhdXRob3JlZElzbykuc2xpY2UoMCwgMTApO1xuICBjb25zdCBwYXJzZWQgPSBuZXcgRGF0ZShgJHtkYXRlUGFydH1UMDA6MDA6MDBaYCk7XG4gIGlmIChOdW1iZXIuaXNOYU4ocGFyc2VkLmdldFRpbWUoKSkpIHJldHVybiBcImNvbXBsZXRlZFwiO1xuXG4gIGxldCBkYXlzOiBudW1iZXIgfCBudWxsO1xuICBpZiAoZHVyYXRpb25EYXlzID09PSBudWxsIHx8IGR1cmF0aW9uRGF5cyA9PT0gdW5kZWZpbmVkIHx8IGR1cmF0aW9uRGF5cyA9PT0gXCJcIikge1xuICAgIGRheXMgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG4gPSBOdW1iZXIucGFyc2VJbnQoU3RyaW5nKGR1cmF0aW9uRGF5cyksIDEwKTtcbiAgICBkYXlzID0gTnVtYmVyLmlzRmluaXRlKG4pID8gbiA6IG51bGw7XG4gIH1cbiAgaWYgKGRheXMgPT09IG51bGwpIGRheXMgPSA5MDtcblxuICBjb25zdCBlbmQgPSBuZXcgRGF0ZShwYXJzZWQuZ2V0VGltZSgpKTtcbiAgZW5kLnNldFVUQ0RhdGUoZW5kLmdldFVUQ0RhdGUoKSArIGRheXMpO1xuICAvLyBDb21wYXJlIGRhdGUtb25seSAodG9kYXkgaW4gVVRDIHNpbmNlIHdlIGF1dGhvcmVkSXNvIGlzIGRhdGUtb25seSkuXG4gIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgdG9kYXkuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBlbmQgPj0gdG9kYXkgPyBcImFjdGl2ZVwiIDogXCJjb21wbGV0ZWRcIjtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IG9uZSBzY3JhcGVkIHByZXNjcmlwdGlvbiBkaWN0IFx1MjE5MiBGSElSIFI0IE1lZGljYXRpb25SZXF1ZXN0LlxuICogUmV0dXJucyBudWxsIHdoZW4gcmF3IGhhcyBubyBgZHJ1Z19uYW1lYCAoY2FsbGVyIGZpbHRlcnMgb3V0KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25SZXF1ZXN0KFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkcnVnTmFtZSA9ICgocmF3LmRydWdfbmFtZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKCFkcnVnTmFtZSkgcmV0dXJuIG51bGw7XG5cbiAgLy8gQ2Fub25pY2FsIGtleSAobm90IHJhdyBkcnVnX25hbWUpIGZvciBzdGFibGUgaWQgc28gdGhlIHRocmVlIE5ISVxuICAvLyBcdTRFMkRcdTgyRjEgdmFyaWFudHMgb2YgdGhlIHNhbWUgZHJ1ZyBjb2xsYXBzZSB0byBvbmUgRkhJUiByZXNvdXJjZS5cbiAgY29uc3QgbWVkSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNhbm9uaWNhbERydWdLZXkoZHJ1Z05hbWUpLCByYXcuZGF0ZSA/PyBcIlwiKTtcblxuICBjb25zdCBkcnVnQ29kZSA9ICgocmF3LmNvZGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGNvZGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBzeXN0ZW06IGRydWdDb2RlID8gc3lzdGVtcy5OSElfRFJVR19DT0RFIDogc3lzdGVtcy5ISVNfTE9DQUxfTUVESUNBVElPTl9DT0RFLFxuICAgIGNvZGU6IGRydWdDb2RlIHx8IGRydWdOYW1lLFxuICAgIGRpc3BsYXk6IGRydWdOYW1lLFxuICB9O1xuXG4gIC8vIHYwLjguMCBiaWxpbmd1YWw6IHByZWZlciBcdTdFNDFcdTRFMkQgaW4gQ29kZWFibGVDb25jZXB0LnRleHQgKHBhdGllbnQtZmFjaW5nXG4gIC8vIGRpc3BsYXkpIGFuZCBrZWVwIEVuZ2xpc2ggaW4gY29kaW5nWzBdLmRpc3BsYXkgKGNsaW5pY2FsIGNhbm9uaWNhbCkuXG4gIC8vIEZhbGxzIGJhY2sgdG8gRW5nbGlzaCB3aGVuIE5ISSBkaWRuJ3Qgc2hpcCBhIENoaW5lc2UgbmFtZSBmb3IgdGhlIGRydWcuXG4gIGNvbnN0IGRydWdOYW1lWmggPSAoKHJhdy5kcnVnX25hbWVfemggPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCkgfHwgZHJ1Z05hbWU7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gICAgaWQ6IG1lZElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IG1lZFN0YXR1cyhyYXcuZGF0ZSA/PyBcIlwiLCByYXcuZHVyYXRpb25fZGF5cyksXG4gICAgaW50ZW50OiBcIm9yZGVyXCIsXG4gICAgbWVkaWNhdGlvbkNvZGVhYmxlQ29uY2VwdDoge1xuICAgICAgY29kaW5nOiBbY29kaW5nXSxcbiAgICAgIHRleHQ6IGRydWdOYW1lWmgsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmF1dGhvcmVkT24gPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgLy8gQ2hyb25pYyBwcmVzY3JpcHRpb25zIChmcm9tIE5ISSdzIElIS0UzMzA3UzAxIFx1NjE2Mlx1NjAyN1x1ODY1NVx1NjVCOVx1N0I4QiBsaXN0KSBnZXRcbiAgLy8gdGhlIHN0YW5kYXJkIEZISVIgY29udGludW91cy10aGVyYXB5IG1hcmtlci4gU01BUlQgYXBwcyByZWNvZ25pc2VcbiAgLy8gdGhpcyBjb2RlIGFuZCBjYW4gc3VyZmFjZSBcImxvbmctdGVybSBtZWRpY2F0aW9uXCIgYmFkZ2VzIG9yIGZpbHRlclxuICAvLyBwcm9ibGVtLWxpc3Qgdmlld3MuIEFjdXRlIHByZXNjcmlwdGlvbnMgbGVhdmUgdGhlIGZpZWxkIHVuc2V0LlxuICBjb25zdCBjb3Vyc2VPZlRoZXJhcHkgPSAoKHJhdy5jb3Vyc2Vfb2ZfdGhlcmFweSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGNvdXJzZU9mVGhlcmFweSA9PT0gXCJjb250aW51b3VzXCIpIHtcbiAgICByZXNvdXJjZS5jb3Vyc2VPZlRoZXJhcHlUeXBlID0ge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06XG4gICAgICAgICAgICBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vbWVkaWNhdGlvbnJlcXVlc3QtY291cnNlLW9mLXRoZXJhcHlcIixcbiAgICAgICAgICBjb2RlOiBcImNvbnRpbnVvdXNcIixcbiAgICAgICAgICBkaXNwbGF5OiBcIkNvbnRpbnVvdXMgbG9uZyB0ZXJtIHRoZXJhcHlcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICB0ZXh0OiBcIkNvbnRpbnVvdXMgbG9uZyB0ZXJtIHRoZXJhcHlcIixcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgZHJ1Z0NsYXNzID0gKChyYXcuZHJ1Z19jbGFzcyA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgZHJ1Z0NsYXNzWmggPSAoKHJhdy5kcnVnX2NsYXNzX3poID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoZHJ1Z0NsYXNzIHx8IGRydWdDbGFzc1poKSB7XG4gICAgY29uc3QgY2F0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGRydWdDbGFzcykgY2F0LmNvZGluZyA9IFt7IGRpc3BsYXk6IGRydWdDbGFzcyB9XTtcbiAgICAvLyBQYXRpZW50LWZhY2luZzogcHJlZmVyIFx1N0U0MVx1NEUyRCBpbiAudGV4dCwgZmFsbCBiYWNrIHRvIEVuZ2xpc2guXG4gICAgY2F0LnRleHQgPSBkcnVnQ2xhc3NaaCB8fCBkcnVnQ2xhc3M7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbY2F0XTtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnJlcXVlc3RlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIC8vIERvc2FnZSBcdTIwMTQgb25seSB3aGVuIHNvdXJjZSBhY3R1YWxseSBoYXMgaXQuIE5ISSdzIG1lZGljYXRpb24tbGlzdFxuICAvLyBlbmRwb2ludCBwcm92aWRlcyBub25lIG9mIHRoZXNlOyBvdGhlciBISVMgYWRhcHRlcnMgZ2V0IGFcbiAgLy8gc3RydWN0dXJlZCBkb3NhZ2Ugb3V0LlxuICBjb25zdCBkb3NhZ2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgayBvZiBbXCJkb3NlXCIsIFwidW5pdFwiLCBcImZyZXF1ZW5jeVwiXSBhcyBjb25zdCkge1xuICAgIGlmIChyYXdba10pIHBhcnRzLnB1c2goU3RyaW5nKHJhd1trXSkpO1xuICB9XG4gIGlmIChwYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgZG9zYWdlLnRleHQgPSBwYXJ0cy5qb2luKFwiIFwiKTtcbiAgfVxuICBpZiAocmF3LnJvdXRlKSB7XG4gICAgZG9zYWdlLnJvdXRlID0ge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW06IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiLCBkaXNwbGF5OiByYXcucm91dGUgfV0sXG4gICAgfTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMoZG9zYWdlKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UuZG9zYWdlSW5zdHJ1Y3Rpb24gPSBbZG9zYWdlXTtcbiAgfVxuXG4gIC8vIGRpc3BlbnNlUmVxdWVzdCB3aXRoIHF1YW50aXR5ICsgc3VwcGx5IGR1cmF0aW9uIHdoZW4gcHJlc2VudC5cbiAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcXR5UmF3ID0gcmF3LnF1YW50aXR5O1xuICBpZiAocXR5UmF3ICE9PSBudWxsICYmIHF0eVJhdyAhPT0gdW5kZWZpbmVkICYmIHF0eVJhdyAhPT0gXCJcIikge1xuICAgIGNvbnN0IHF0eU51bSA9IE51bWJlci5wYXJzZUZsb2F0KFN0cmluZyhxdHlSYXcpLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocXR5TnVtKSkge1xuICAgICAgZHIucXVhbnRpdHkgPSB7IHZhbHVlOiBxdHlOdW0gfTtcbiAgICB9XG4gIH1cbiAgaWYgKHJhdy5kdXJhdGlvbl9kYXlzKSB7XG4gICAgY29uc3QgZGF5cyA9IE51bWJlci5wYXJzZUludChTdHJpbmcocmF3LmR1cmF0aW9uX2RheXMpLCAxMCk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShkYXlzKSkge1xuICAgICAgZHIuZXhwZWN0ZWRTdXBwbHlEdXJhdGlvbiA9IHtcbiAgICAgICAgdmFsdWU6IGRheXMsXG4gICAgICAgIHVuaXQ6IFwiZGF5c1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiBcImRcIixcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIC8vIElucGF0aWVudCBkcnVnczogTkhJIGJ1bmRsZXMgZXZlcnkgZHJ1ZyB1c2VkIGR1cmluZyBhbiBhZG1pc3Npb24gaW50b1xuICAvLyBvbmUgcm93IGRhdGVkIHRvIHRoZSBhZG1pc3Npb24gZGF5LiBhdXRob3JlZE9uIGNhcnJpZXMgdGhhdCBhbmNob3I7XG4gIC8vIHZhbGlkaXR5UGVyaW9kIGV4cHJlc3NlcyB0aGUgYWN0dWFsIHVzYWdlIHdpbmRvdyBbYWRtaXQsIGRpc2NoYXJnZV1cbiAgLy8gc28gU01BUlQgYXBwcyBkaXNwbGF5IFwidXNlZCBkdXJpbmcgc3RheSA1LzE4LTUvMjJcIiBpbnN0ZWFkIG9mXG4gIC8vIFwiYWxsIDE0IGRydWdzIHByZXNjcmliZWQgb24gNS8xOFwiLiBPUEQgLyBcdTg1RTVcdTVDNDAgcm93cyBsZWF2ZSBlbmRfZGF0ZVxuICAvLyBlbXB0eSBzbyB0aGlzIGJsb2NrIGRvZXNuJ3QgZmlyZSBcdTIwMTQgc2luZ2xlLWRheSBwcmVzY3JpcHRpb25zIHJlbWFpblxuICAvLyB1bmNoYW5nZWQuIFRoZSBNZWRpY2F0aW9uUmVxdWVzdC5kaXNwZW5zZVJlcXVlc3QudmFsaWRpdHlQZXJpb2QgZmllbGRcbiAgLy8gaXMgYSBzZW1hbnRpYyBzdHJldGNoIChpdHMgc3RyaWN0IGRlZmluaXRpb24gaXMgdGhlIHByZXNjcmlwdGlvbidzXG4gIC8vIHN0YWxlLWRhdGluZyB3aW5kb3cpIGJ1dCBpcyB0aGUgY2xvc2VzdCBleGlzdGluZyBmaWVsZDsgd2UgZG9uJ3RcbiAgLy8gZW1pdCBNZWRpY2F0aW9uQWRtaW5pc3RyYXRpb24gcmVzb3VyY2VzLlxuICBjb25zdCBlbmREYXRlID0gKChyYXcuZW5kX2RhdGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChyYXcuZGF0ZSAmJiBlbmREYXRlICYmIGVuZERhdGUgIT09IHJhdy5kYXRlKSB7XG4gICAgZHIudmFsaWRpdHlQZXJpb2QgPSB7XG4gICAgICBzdGFydDogYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYCxcbiAgICAgIGVuZDogYCR7ZW5kRGF0ZX1UMjM6NTk6NTkrMDg6MDBgLFxuICAgIH07XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKGRyKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UuZGlzcGVuc2VSZXF1ZXN0ID0gZHI7XG4gIH1cblxuICBjb25zdCBpbmRpY2F0aW9uID0gKChyYXcuaW5kaWNhdGlvbiA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgaW5kaWNhdGlvblpoID0gKChyYXcuaW5kaWNhdGlvbl96aCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgaW5kaWNhdGlvbkNvZGUgPSAoKHJhdy5pbmRpY2F0aW9uX2NvZGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChpbmRpY2F0aW9uIHx8IGluZGljYXRpb25aaCB8fCBpbmRpY2F0aW9uQ29kZSkge1xuICAgIGNvbnN0IHJjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGluZGljYXRpb25Db2RlKSB7XG4gICAgICByYy5jb2RpbmcgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IHN5c3RlbXMuSUNEXzEwX0NNLFxuICAgICAgICAgIGNvZGU6IG5vcm1hbGl6ZUljZDEwQ20oaW5kaWNhdGlvbkNvZGUpLFxuICAgICAgICAgIGRpc3BsYXk6IGluZGljYXRpb24gfHwgaW5kaWNhdGlvblpoIHx8IGluZGljYXRpb25Db2RlLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG4gICAgLy8gUGF0aWVudC1mYWNpbmcgcmVhc29uQ29kZSB0ZXh0OiBwcmVmZXIgXHU3RTQxXHU0RTJEIElDRCBkZXNjcmlwdGlvbiwgZmFsbFxuICAgIC8vIGJhY2sgdG8gRW5nbGlzaCwgdGhlbiB0byBqdXN0IHRoZSBjb2RlLiBBbHdheXMgcHJlZml4ZWQgd2l0aCB0aGVcbiAgICAvLyBjb2RlIHNvIFNNQVJUIGFwcCByZW5kZXJpbmcga2VlcHMgXCI8Y29kZT4gPG5hbWU+XCIgc2hhcGUuXG4gICAgY29uc3QgbmFtZVpoID0gaW5kaWNhdGlvblpoIHx8IGluZGljYXRpb247XG4gICAgaWYgKG5hbWVaaCkge1xuICAgICAgcmMudGV4dCA9IGluZGljYXRpb25Db2RlID8gYCR7aW5kaWNhdGlvbkNvZGV9ICR7bmFtZVpofWAudHJpbSgpIDogbmFtZVpoO1xuICAgIH1cbiAgICByZXNvdXJjZS5yZWFzb25Db2RlID0gW3JjXTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLyoqXG4gKiBHcm91cC1hd2FyZSBtZWRpY2F0aW9uIG1hcHBlciB0aGF0IGRlZHVwZXMgXHU0RTJEXHU4MkYxIFx1OTZEOVx1OEE5RSBkdXBsaWNhdGVzLlxuICpcbiAqIFN0cmF0ZWd5OlxuICogICAxLiBDb21wdXRlIGNhbm9uaWNhbCBrZXkgcGVyIGRydWcgbmFtZSAobG9uZ2VzdCBFbmdsaXNoIGNodW5rKS5cbiAqICAgMi4gR3JvdXAgYnkgKGRhdGUsIGNhbm9uaWNhbF9rZXkpLiBLZWVwIE9ORSBlbnRyeSBwZXIgZ3JvdXAsXG4gKiAgICAgIHByZWZlcnJpbmcgdGhlIGZvcm0gd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBicmFuZFxuICogICAgICBuYW1lIFx1MjAxNCBjbGluaWNpYW5zIHNjYW4gRW5nbGlzaCBmaXJzdCkuXG4gKiAgIDMuIE1hcCBlYWNoIGtlcHQgZW50cnkgdGhyb3VnaCBtYXBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqXG4gKiBOb3RlOiBQeXRob24gY29tbWVudCBzYXlzIFwibW9yZSBDSktcIiBidXQgdGhlIGNvZGUgdXNlcyBgPGAgKGZld2VyKTtcbiAqIHdlIHByZXNlcnZlIHRoZSBhY3R1YWwgY29kZSBiZWhhdmlvdXIgdG8ga2VlcCBwYXJpdHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBNZWRpY2F0aW9uc0RlZHVwKHJhd0l0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+PigpO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgcmF3SXRlbXMpIHtcbiAgICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRydWdOYW1lID0gKChpdGVtLmRydWdfbmFtZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgICBpZiAoIWRydWdOYW1lKSBjb250aW51ZTtcbiAgICBjb25zdCBkYXRlUGFydCA9ICgoaXRlbS5kYXRlID8/IFwiXCIpIGFzIHN0cmluZykuc2xpY2UoMCwgMTApO1xuICAgIGNvbnN0IGtleSA9IGAke2RhdGVQYXJ0fXwke2Nhbm9uaWNhbERydWdLZXkoZHJ1Z05hbWUpfWA7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBieUtleS5nZXQoa2V5KTtcbiAgICBpZiAoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFByZWZlciB0aGUgZm9ybSB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGJyYW5kIG5hbWUpLlxuICAgICAgaWYgKGNqa0NoYXJzKGRydWdOYW1lKSA8IGNqa0NoYXJzKGV4aXN0aW5nLmRydWdfbmFtZSA/PyBcIlwiKSkge1xuICAgICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgYnlLZXkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBtID0gbWFwTWVkaWNhdGlvblJlcXVlc3QoaXRlbSwgcGF0aWVudElkKTtcbiAgICBpZiAobSAhPT0gbnVsbCkgb3V0LnB1c2gobSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsICIvKipcbiAqIExPSU5DIG1hcHBpbmcgdGFibGVzIGZvciBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBMT0lOQyBSNCBjb2RpbmdzLlxuICpcbiAqIFB1cmUgZGF0YSwgbm8gbG9naWMuIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9fbG9pbmNfdGFibGVzLnB5YC5cbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDAgX05ISV9UT19MT0lOQyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIHByaW1hcnkgTE9JTkMgbWFwcGluZy4gU291cmNlIG9mIHRydXRoOlxuLy8gVFdOSElGSElSIFBBUyBJbXBsZW1lbnRhdGlvbiBHdWlkZSBDb25jZXB0TWFwLW5oaS1sb2luY1xuLy8gaHR0cHM6Ly9idWlsZC5maGlyLm9yZy9pZy9UV05ISUZISVIvcGFzL0NvbmNlcHRNYXAtbmhpLWxvaW5jLmh0bWxcbi8vXG4vLyBUaGF0IENvbmNlcHRNYXAgZGVjbGFyZXMgNTMgTkhJIGNvZGVzIHdpdGggYGVxdWl2YWxlbmNlOiByZWxhdGVkdG9gXG4vLyBhZ2FpbnN0IDgwNiBMT0lOQyB2YXJpYW50cyAoZGlmZmVyZW50IHNwZWNpbWVucyAvIHVuaXRzIC8gbWV0aG9kc1xuLy8gcGVyIE5ISSBjb2RlIFx1MjAxNCBjb25maXJtaW5nIHRoZSBcIk5ISSBpcyBjb2Fyc2UsIExPSU5DIGlzIGZpbmVcIiB2aWV3KS5cbi8vIEZvciBlYWNoIE5ISSBjb2RlIHdlIGhhbmQtcGljayB0aGUgY2Fub25pY2FsIExPSU5DIG1vc3QgY2xpbmljaWFuc1xuLy8gd291bGQgZXhwZWN0IGluIGEgXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBIGxhYiByZXBvcnQ6IFNlcnVtL1BsYXNtYSArIE1hc3Mtdm9sdW1lXG4vLyAob3IgYXV0by1jb3VudCBmb3IgY2VsbCBjb3VudGVycykuIEVkZ2UgY2FzZXMgbm90ZWQgaW5saW5lLlxuZXhwb3J0IGNvbnN0IE5ISV9UT19MT0lOQzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIEhhZW1hdG9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA4MDAyQ1wiOiBcIjY2OTAtMlwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1NzggXHUyMDE0IExldWtvY3l0ZXMgIy92b2wgQmxvb2QgQXV0b1xuICBcIjA4MDAzQ1wiOiBcIjcxOC03XCIsIC8vIFx1ODg0MFx1ODI3Mlx1N0QyMFx1NkFBMlx1NjdFNSBcdTIwMTQgSGVtb2dsb2JpbiBNYXNzL3ZvbCBCbG9vZFxuICBcIjA4MDA2Q1wiOiBcIjc3Ny0zXCIsIC8vIFx1ODg0MFx1NUMwRlx1Njc3Rlx1OEEwOFx1NjU3OCBcdTIwMTQgUGxhdGVsZXRzICMvdm9sIEJsb29kIEF1dG9cbiAgXCIwODAxM0NcIjogXCI1NzAyMS04XCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1NTIwNlx1OTg1RVx1OEEwOFx1NjU3OCBcdTIwMTQgQ0JDIFcgQXV0byBEaWZmIHBhbmVsXG4gIFwiMDgxMjhCXCI6IFwiNDcyODYtMFwiLCAvLyBcdTlBQThcdTlBRDNcdTdEMzBcdTgwREVcdTVGNjJcdTYxNEJcdTUyMjRcdThCODBcdTU0MDhcdTRGNzVcdTdEMzBcdTgwREVcdTUyMDZcdTk4NUVcdThBMDhcdTY1NzhcbiAgLy8gXHUyNTAwXHUyNTAwIENoZW1pc3RyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAxMUNcIjogXCIxNzg2MS02XCIsIC8vIFx1OTIyMyBcdTIwMTQgQ2FsY2l1bSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxNUNcIjogXCIyMTYwLTBcIiwgLy8gXHU4MDhDXHU5MTc4XHU5MTUwXHUzMDAxXHU4ODQwIFx1MjAxNCBDcmVhdGluaW5lIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDE2Q1wiOiBcIjIxNjEtOFwiLCAvLyBcdTgwOENcdTkxNTBcdTMwMDFcdTVDM0YgXHUyMDE0IENyZWF0aW5pbmUgTWFzcy92b2wgVXJpbmVcbiAgXCIwOTAyNUNcIjogXCIxOTIwLThcIiwgLy8gQVNUL0dPVCBcdTIwMTQgQXNwYXJ0YXRlIGFtaW5vdHJhbnNmZXJhc2UgQWN0IFMvUFxuICBcIjA5MDI2Q1wiOiBcIjE3NDItNlwiLCAvLyBBTFQvR1BUIFx1MjAxNCBBbGFuaW5lIGFtaW5vdHJhbnNmZXJhc2UgQWN0IFMvUFxuICBcIjA5MDI5Q1wiOiBcIjE5NzUtMlwiLCAvLyBcdTgxQkRcdTdEMDVcdTdEMjBcdTdFM0RcdTkxQ0YgXHUyMDE0IEJpbGlydWJpbiB0b3RhbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzMENcIjogXCIxOTY4LTdcIiwgLy8gXHU3NkY0XHU2M0E1XHU4MUJEXHU3RDA1XHU3RDIwIFx1MjAxNCBCaWxpcnViaW4gZGlyZWN0IE1hc3Mvdm9sIFMvUFxuICBcIjA5MDMzQ1wiOiBcIjI1MzItMFwiLCAvLyBcdTRFNzNcdTkxNzhcdTgxMkJcdTZDMkJcdTgxMjIgXHUyMDE0IExESCBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzOENcIjogXCIxNzUxLTdcIiwgLy8gXHU3NjdEXHU4NkNCXHU3NjdEIFx1MjAxNCBBbGJ1bWluIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTM4Q1wiOiBcIjM1NjcyLTVcIiwgLy8gXHU3NkY0XHU2M0E1L1x1N0UzRFx1ODFCRFx1N0QwNVx1N0QyMFx1NkJENFx1NTAzQ1xuICBcIjEyMTEyQlwiOiBcIjE3NTEtN1wiLCAvLyBcdTc2N0RcdTg2Q0JcdTc2N0QoXHU1MTREXHU3NUFCXHU2QkQ0XHU2RkMxXHU2Q0Q1KSBcdTIwMTQgQWxidW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIyNDAwN0JcIjogXCIxOTk1LTBcIiwgLy8gXHU4ODQwXHU2RjNGXHU2RTM4XHU5NkUyXHU5MjIzIFx1MjAxNCBDYWxjaXVtIGlvbml6ZWQgTW9sZXMvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgSG9ybW9uZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkxMjFDXCI6IFwiMjk4Ni04XCIsIC8vIFx1Nzc2QVx1NEUzOFx1OTE2Rlx1OTE4N1x1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgVGVzdG9zdGVyb25lIE1hc3Mvdm9sIFMvUFxuICBcIjI3MDIxQlwiOiBcIjI5OTEtOFwiLCAvLyBcdTc3NkFcdTRFMzhcdTgxMDJcdTkxODdcdTY1M0VcdTVDMDRcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IFRlc3Rvc3Rlcm9uZSBGcmVlIFMvUFxuICAvLyAwOTEyNUMgLyAwOTEyN0MgY29ycmVjdGVkIGFmdGVyIGR1YWwtcmV2aWV3ZXIgYXVkaXQgXHUyMDE0IHRoZSBlYXJsaWVyXG4gIC8vIHZhbHVlcyAoMzAxNi0zIHdhcyBUU0gsIDEwNTAxLTUgd2FzIExIKSB3ZXJlIGp1c3Qgd3JvbmcgY29weS1cbiAgLy8gcGFzdGVzLiBTb3VyY2UgZm9yIHRoZSBuZXcgdmFsdWVzOiBUV05ISUZISVIgUEFTIENvbmNlcHRNYXAuXG4gIFwiMDkxMjVDXCI6IFwiODMwOTgtNFwiLCAvLyBcdTZGRkVcdTZDRTFcdTUyM0FcdTZGQzBcdTdEMjBcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IEZvbGxpdHJvcGluIChGU0gpIEltbXVub2Fzc2F5IFMvUFxuICBcIjA5MTI3Q1wiOiBcIjgzMDk2LThcIiwgLy8gXHU0RThDXHU2QzJCXHU1N0ZBXHU2NjI1XHU2MEM1XHU3RDIwXHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBFc3RyYWRpb2wgSW1tdW5vYXNzYXkgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBUdW1vciBtYXJrZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMDA3Q1wiOiBcIjE4MzQtMVwiLCAvLyBcdTAzQjEtXHU4MENFXHU1MTUyXHU4NkNCXHU3NjdEIChBRlApIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIyNzA0OUNcIjogXCIxODM0LTFcIiwgLy8gXHU3NTMyLVx1ODBDRVx1NTE1Mlx1ODZDQlx1NzY3RCAoQUZQLCBSSUEpXG4gIFwiMTIwODFDXCI6IFwiODMxMTItM1wiLCAvLyBQU0EgKEVJQS9MSUEpIFx1MjAxNCBNYXNzL3ZvbCBTL1AgSW1tdW5vYXNzYXlcbiAgXCIxMjE5OENcIjogXCI4MzExMy0xXCIsIC8vIEZyZWUgUFNBIFx1MjAxNCBNYXNzL3ZvbCBTL1AgSW1tdW5vYXNzYXlcbiAgXCIyNzA1MkNcIjogXCIyODU3LTFcIiwgLy8gXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGIChQU0EpIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIyNzA4M0JcIjogXCIxMDg4Ni0wXCIsIC8vIFx1NkUzOFx1OTZFMlBTQSAoUklBKVxuICAvLyAxMjA1MkIgXHUwM0IyMi1cdTVGQUVcdTc0MDNcdTg2Q0JcdTc2N0QgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIDEwODczLTggd2hpY2ggaXMgYWN0dWFsbHlcbiAgLy8gJ0JldGEtMi1NaWNyb2dsb2J1bGluIFtNYXNzL3RpbWVdIGluIDI0IGhvdXIgVXJpbmUnICh0aW1lZCB1cmluZVxuICAvLyBjb2xsZWN0aW9uLCB2ZXJpZmllZCBsb2luYy5vcmcvMTA4NzMtOC8pLiBUYWl3YW4gMTIwNTJCIGJpbGxpbmcgaXNcbiAgLy8gdHlwaWNhbGx5IGEgc2VydW0gb3JkZXI7IDE5NTItMSBpcyB0aGUgdmVyaWZpZWQgc2VydW0tb3ItcGxhc21hIExPSU5DXG4gIC8vIChDb21wb25lbnQ9QmV0YS0yLU1pY3JvZ2xvYnVsaW4sIFByb3BlcnR5PU1DbmMpIFx1MjAxNCBsb2luYy5vcmcvMTk1Mi0xLy5cbiAgXCIxMjA1MkJcIjogXCIxOTUyLTFcIiwgLy8gXHUwM0IyMi1taWNyb2dsb2J1bGluIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEltbXVub2xvZ3kgLyBwcm90ZWlucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTA2NUJcIjogXCI5MDk5MS0xXCIsIC8vIFx1ODZDQlx1NzY3RFx1OTZGQlx1NkNGM1x1NTIwNlx1Njc5MFxuICAvLyAxMjAyOEIgLyAxMjAyOUIgSWdNIChzZXJ1bSwgaW1tdW5vZGlmZnVzaW9uIC8gbmVwaGVsb21ldHJ5KSBcdTIwMTQgcHJldmlvdXNseVxuICAvLyBib3RoIG1hcHBlZCB0byBMT0lOQyAxNDAwMi0wIHdoaWNoIGlzIGFjdHVhbGx5ICdJZ00gW1VuaXRzL3ZvbHVtZV0gaW5cbiAgLy8gQ29yZCBibG9vZCcgKG5lb25hdGFsIHNwZWNpbWVuLCB2ZXJpZmllZCBsb2luYy5vcmcvMTQwMDItMC8pLiBXcm9uZ1xuICAvLyBzcGVjaW1lbiBmb3IgYW4gYWR1bHQgc2VydW0gb3JkZXIuIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzIHRocm91Z2ggdG9cbiAgLy8gTkhJLWNvZGUtb25seSBjb2RpbmcuIFNlZSBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWQuXG4gIFwiMTIxMDNCXCI6IFwiOTU4MDEtN1wiLCAvLyBcdTUxNERcdTc1QUJcdTk2RkJcdTZDRjNcdTUyMDZcdTY3OTBcbiAgXCIxMjE2MEJcIjogXCIxNTE4OS00XCIsIC8vIElnRyBcdTAzQkEvXHUwM0JCXG4gIFwiMTIxNzFCXCI6IFwiMTczNTEtOFwiLCAvLyBcdTYyOTdcdTU1RENcdTRFMkRcdTYwMjdcdTc0MDNcdTdEMzBcdTgwREVcdThDRUFcdTYyOTdcdTlBRDQgKEFOQ0EpXG4gIFwiMTIyMDRCXCI6IFwiMjA1ODQtOVwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdTg4NjhcdTk3NjJcdTZBMTlcdThBMThcbiAgXCIyNTAxM0JcIjogXCI0NDU5Ni01XCIsIC8vIFx1ODdBMlx1NTE0OVx1NTIwN1x1NzI0N1x1NkFBMlx1NjdFNVxuICAvLyBcdTI1MDBcdTI1MDAgSGVwYXRpdGlzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE0MDMwQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMxQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMyQ1wiOiBcIjUxOTYtMVwiLCAvLyBIQnNBZyAoTWFzcy92b2wpXG4gIFwiMTQwNTFDXCI6IFwiMTM5NTUtMFwiLCAvLyBIQ1YgQWJcbiAgXCIyNzAzM0NcIjogXCI1MTk3LTlcIiwgLy8gSEJzQWcgUklBXG4gIC8vIFx1MjUwMFx1MjUwMCBQYXRob2xvZ3kgLyBjeXRvbG9neSAvIElIQyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjE5NUJcIjogXCIxODQ3NC03XCIsIC8vIEhlci0yL25ldSBJU0hcbiAgXCIyNzA2MUJcIjogXCIxNDEzMC05XCIsIC8vIFx1NTJENVx1NjBDNVx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoRVIpXG4gIFwiMjcwNjJCXCI6IFwiMTA4NjEtM1wiLCAvLyBcdTlFQzNcdTlBRDRcdTZGQzBcdTdEMjBcdTYzQTVcdTUzRDdcdTlBRDQgKFBSKVxuICBcIjMwMTAzQlwiOiBcIjgzMDUyLTFcIiwgLy8gUEQtTDEgSUhDXG4gIC8vIFx1MjUwMFx1MjUwMCBBdWRpb2xvZ3kgLyBwdWxtb25hcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTcwMDlCXCI6IFwiMjQzNDEtMFwiLCAvLyBcdTRFMDBcdTZDMjdcdTUzMTZcdTc4QjNcdTgwQkFcdTcwMzBcdTY1NjNcdTkxQ0ZcbiAgXCIyMjAwMUNcIjogXCI0NTQ5OC0zXCIsIC8vIFx1N0QxNFx1OTdGM1x1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICBcIjIyMDE1QlwiOiBcIjQ1NDk4LTNcIiwgLy8gXHU4QTUwXHU4MDdFXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMjVCXCI6IFwiNDY1MzAtMlwiLCAvLyBcdTgxRUFcdThBMThcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFNVUFBMRU1FTlRBTCAobm90IGluIFBBUyBDb25jZXB0TWFwIFx1MjAxNCBoYW5kLWN1cmF0ZWQgZnJvbSBjb21tb25cbiAgLy8gTkhJIGNvZGVzIHNlZW4gaW4gXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBLiBMT0lOQyB2ZXJpZmllZCBhZ2FpbnN0IGxvaW5jLm9yZ1xuICAvLyBjYW5vbmljYWwgbmFtZXMuIE1ldGhvZC1zcGVjaWZpYyBjb2RlcyAoZS5nLiBocy1DUlApIHBpY2sgdGhlXG4gIC8vIHNwZWNpZmljIExPSU5DOyBnZW5lcmFsLW1ldGhvZCBjb2RlcyBwaWNrIHRoZSBtb3N0IGNvbW1vbiBmb3JtLlxuICAvLyBJZiBcdTUwNjVcdTRGRERcdTdGNzIgcHVibGlzaGVzIGFuIGF1dGhvcml0YXRpdmUgYnJvYWRlciBDb25jZXB0TWFwIGxhdGVyLFxuICAvLyByZXBsYWNlIHRoaXMgc2VjdGlvbiBpbiBvbmUgcGFzcy5cbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIC8gSGJBMWMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDVDXCI6IFwiMTU1OC02XCIsIC8vIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENiAoR2x1LUFDKSBcdTIwMTQgRmFzdGluZyBnbHVjb3NlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTQwQ1wiOiBcIjIzNDUtN1wiLCAvLyBcdTg4NDBcdTdDRDYtXHU5OTEwXHU1RjhDL1x1OTZBOFx1NkE1RiBcdTIwMTQgR2x1Y29zZSBNYXNzL3ZvbCBTL1AgKGdlbmVyYWwpXG4gIFwiMDkwMDZDXCI6IFwiNDU0OC00XCIsIC8vIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMCAoSGJBMWMpIFx1MjAxNCBIZW1vZ2xvYmluIEExYy9IZ2IudG90YWwgQmxvb2RcbiAgLy8gXHUyNTAwXHUyNTAwIFJlbmFsIC8gZWxlY3Ryb2x5dGVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDAyQ1wiOiBcIjMwOTQtMFwiLCAvLyBCVU4gXHUyMDE0IFVyZWEgbml0cm9nZW4gTWFzcy92b2wgUy9QXG4gIFwiMDkwMTNDXCI6IFwiMzA4NC0xXCIsIC8vIFVyaWMgQWNpZCBcdTIwMTQgVXJhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMjFDXCI6IFwiMjk1MS0yXCIsIC8vIE5hIFx1MjAxNCBTb2RpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDIyQ1wiOiBcIjI4MjMtM1wiLCAvLyBLICBcdTIwMTQgUG90YXNzaXVtIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAyNENcIjogXCIyMDI4LTlcIiwgLy8gQ08yIFx1MjAxNCBDYXJib24gZGlveGlkZSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMTJDXCI6IFwiMjc3Ny0xXCIsIC8vIElub3JnYW5pYyBQIFx1MjAxNCBQaG9zcGhhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDZCXCI6IFwiMTkxMjMtOVwiLCAvLyBNZyBcdTIwMTQgTWFnbmVzaXVtIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGlwaWQgcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDFDXCI6IFwiMjA5My0zXCIsIC8vIFQtQ2hvbGVzdGVyb2wgXHUyMDE0IENob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDA0Q1wiOiBcIjI1NzEtOFwiLCAvLyBURyBcdTIwMTQgVHJpZ2x5Y2VyaWRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQzQ1wiOiBcIjIwODUtOVwiLCAvLyBIREwgXHUyMDE0IEhETCBjaG9sZXN0ZXJvbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NENcIjogXCIxMzQ1Ny03XCIsIC8vIExETCBcdTIwMTQgTERMIGNob2xlc3Rlcm9sIChjYWxjdWxhdGVkKSBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIExpdmVyIGZ1bmN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDI3Q1wiOiBcIjY3NjgtNlwiLCAvLyBBTEstUCBcdTIwMTQgQWxrYWxpbmUgcGhvc3BoYXRhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzFDXCI6IFwiMjMyNC0yXCIsIC8vIFx1MDNCMy1HVCBcdTIwMTQgR2FtbWEgZ2x1dGFteWwgdHJhbnNmZXJhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzVDXCI6IFwiMjUwMC03XCIsIC8vIFRJQkMgXHUyMDE0IElyb24gYmluZGluZyBjYXBhY2l0eSBNYXNzL3ZvbCBTL1BcbiAgLy8gMDkwMzdDIFx1ODg0MFx1NkMyOCBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMTgyNy01IHdoaWNoIGlzIGFjdHVhbGx5XG4gIC8vICdBbHBoYSAxIGFudGl0cnlwc2luIE1TIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hJyAodmVyaWZpZWRcbiAgLy8gbG9pbmMub3JnLzE4MjctNS8pLiBXcm9uZyBhbmFseXRlIGVudGlyZWx5LiBMZWF2aW5nIHVubWFwcGVkOyBmYWxsc1xuICAvLyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLiBTZWUgZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kLlxuICBcIjA5MDY0Q1wiOiBcIjMwNDAtM1wiLCAvLyBMaXBhc2UgXHUyMDE0IEFjdGl2aXR5IFMvUFxuICBcIjA5MDU5QlwiOiBcIjE0MTE4LTRcIiwgLy8gTGFjdGF0ZSBcdTIwMTQgTWFzcy92b2wgUGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBIZW1hdG9sb2d5IGV4dHJhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwODAwNENcIjogXCI0NTQ0LTNcIiwgLy8gSENUIFx1MjAxNCBIZW1hdG9jcml0IHZvbHVtZSBmcmFjdGlvbiBCbG9vZFxuICBcIjA4MDA4Q1wiOiBcIjE0MTk2LTBcIiwgLy8gUmV0aWN1bG9jeXRlIFx1MjAxNCBSZXRpY3Vsb2N5dGVzLzEwMCBSQkNcbiAgXCIwODAxMENcIjogXCI3MTEtMlwiLCAvLyBFb3Npbm9waGlsIGNvdW50IFx1MjAxNCAjL3ZvbCBCbG9vZFxuICBcIjA4MDExQ1wiOiBcIjI0MzE3LTBcIiwgLy8gQ0JDIHBhbmVsIFx1MjAxNCBIZW1hdG9sb2d5IHBhbmVsIEJsb29kXG4gIFwiMDgwMjZDXCI6IFwiNjMwMS02XCIsIC8vIFBUL0lOUiBcdTIwMTQgSU5SIFBsYXRlbGV0IHBvb3IgcGxhc21hXG4gIFwiMDgwMzZDXCI6IFwiMTQ5NzktOVwiLCAvLyBBUFRUIFx1MjAxNCBQbGF0ZWxldCBwb29yIHBsYXNtYVxuICBcIjA4MDc1Q1wiOiBcIjI2OTItN1wiLCAvLyBPc21vbGFsaXR5IFx1MjAxNCBTZXJ1bSBvciBQbGFzbWFcbiAgXCIwODA3OUJcIjogXCIzMDI0MC02XCIsIC8vIEQtZGltZXIgXHUyMDE0IFBsdCBwb29yIHBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgVGh5cm9pZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gRnJlZSBUNCBoYXMgVFdPIHZhbGlkIExPSU5DcyB0aGF0IGRpZmZlciBvbmx5IGluIHVuaXQtc3lzdGVtOlxuICAvLyAgIDMwMjQtNyAgQ29tcG9uZW50PVRoeXJveGluZS5mcmVlLCBQcm9wZXJ0eT1NQ25jIChNYXNzIGNvbmMsIG5nL2RMKVxuICAvLyAgIDE0OTIwLTMgQ29tcG9uZW50PVRoeXJveGluZS5mcmVlLCBQcm9wZXJ0eT1TQ25jIChNb2xhciBjb25jLCBwbW9sL0wpXG4gIC8vIEJvdGggYXJlIEZyZWUgVDQgXHUyMDE0IG5laXRoZXIgaXMgVG90YWwgVDQuIEVhcmxpZXIgaGlzdG9yeTpcbiAgLy8gICAtIE9yaWdpbmFsIG1hcHBpbmcgd2FzIDMwMjQtNyAoY29ycmVjdDogbWF0Y2hlcyBUYWl3YW4gbmcvZEwgbGFicykuXG4gIC8vICAgLSBDb21taXQgOWRhNWU1YiBjaGFuZ2VkIGl0IHRvIDE0OTIwLTMgb24gdGhlIHByZW1pc2UgdGhhdCAzMDI0LTdcbiAgLy8gICAgIHdhcyBUb3RhbCBUNC4gVGhhdCBwcmVtaXNlIHdhcyBpbnZlcnRlZCAodmVyaWZpZWQgbG9pbmMub3JnLzMwMjQtNy9cbiAgLy8gICAgIFx1MjAxNCBDb21wb25lbnQgaXMgXCJUaHlyb3hpbmUuZnJlZVwiKTsgdGhlIGNoYW5nZSBpbnRyb2R1Y2VkIGEgTE9JTkNcdTIxOTR1bml0XG4gIC8vICAgICBtaXNtYXRjaCAobW9sYXIgTE9JTkMgcGFpcmVkIHdpdGggYSBuZy9kTCB2YWx1ZSkuXG4gIC8vICAgLSBSZXN0b3JpbmcgMzAyNC03IGhlcmUgc28gdGhlIExPSU5DJ3MgcHJvcGVydHkgY2xhc3MgKE1DbmMpIG1hdGNoZXNcbiAgLy8gICAgIHRoZSB1bml0IGZpZWxkIChuZy9kTCkgVGFpd2FuIGxhYnMgc2hpcC4gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZFxuICAvLyAgICAgc2VjdGlvbiBGIGZvciBmdWxsIGV2aWRlbmNlLlxuICBcIjA5MTA2Q1wiOiBcIjMwMjQtN1wiLCAvLyBGcmVlIFQ0IFx1MjAxNCBUaHlyb3hpbmUgKFQ0KSBmcmVlIFtNYXNzL3ZvbHVtZV0gUy9QXG4gIFwiMDkxMTJDXCI6IFwiMzAxNi0zXCIsICAvLyBUU0ggXHUyMDE0IFRoeXJvdHJvcGluIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZGlhYyBtYXJrZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDk5Q1wiOiBcIjEwODM5LTlcIiwgLy8gVHJvcG9uaW4gSSBcdTIwMTQgVHJvcG9uaW4gSSBjYXJkaWFjIFMvUFxuICBcIjEyMTkyQ1wiOiBcIjMzOTU5LThcIiwgLy8gUHJvY2FsY2l0b25pbiBcdTIwMTQgUy9QXG4gIFwiMTIxOTNDXCI6IFwiMzM3NjItNlwiLCAvLyBOVC1wcm9CTlAgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVml0YW1pbnMgLyBjb2ZhY3RvcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkxMjlDXCI6IFwiMjEzMi05XCIsIC8vIFZpdCBCMTIgXHUyMDE0IENvYmFsYW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTEzMENcIjogXCIyMjg0LThcIiwgLy8gRm9sYXRlIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTExM0NcIjogXCIyMTQzLTZcIiwgLy8gQ29ydGlzb2wgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMTE2Q1wiOiBcIjIyNzYtNFwiLCAvLyBGZXJyaXRpbiBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBBY3V0ZSBwaGFzZSAvIGluZmxhbW1hdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTIwMTVDIGlzIHRoZSBnZW5lcmljIE5ISSBDUlAgb3JkZXIgXHUyMDE0IG1vc3QgY2xpbmljYWwgY29udGV4dHMgaW4gXHU1MDY1XHU0RkREXG4gIC8vIHNlbmQgYSByZWd1bGFyIChub3QgaHMtKSBDUlAsIHNvIG1hcCB0byAxOTg4LTUuIElmIGEgXHU5NjYyXHU2MjQwIHNwZWNpZmljYWxseVxuICAvLyBiaWxscyBocy1DUlAgaXQgd2lsbCBsYW5kIG9uIGEgZGlmZmVyZW50IGNvZGUgKGUuZy4gMTIxODlDKS5cbiAgXCIxMjAxNUNcIjogXCIxOTg4LTVcIiwgLy8gQ1JQIFx1MjAxNCBDIHJlYWN0aXZlIHByb3RlaW4gTWFzcy92b2wgUy9QXG4gIFwiMTIwNTNDXCI6IFwiNTA0OC00XCIsIC8vIEFOQSBcdTIwMTQgQW50aW51Y2xlYXIgQWIgVGl0ZXIgUy9QXG4gIFwiMTIwNTZCXCI6IFwiMTYxMjQtMFwiLCAvLyBBbnRpLW1pdG9jaG9uZHJpYWwgQWIgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA2MDEyQ1wiOiBcIjU3NzgtNlwiLCAvLyBVcmluZSBhcHBlYXJhbmNlIFx1MjAxNCBDb2xvclxuICBcIjA2MDEzQ1wiOiBcIjI0MzU2LThcIiwgLy8gXHU1QzNGXHU3NTFGXHU1MzE2IHBhbmVsIFx1MjAxNCBVcmluYWx5c2lzIG1hY3Jvc2NvcGljIHBhbmVsXG4gIFwiMDcwMDFDXCI6IFwiMTQ1NjMtMVwiLCAvLyBTdG9vbCBvY2N1bHQgYmxvb2RcbiAgXCIwOTEzNENcIjogXCI1ODQ1My0yXCIsIC8vIGlGT0JUIHF1YW50aXRhdGl2ZSBcdTIwMTQgSGVtb2dsb2JpbiBNYXNzL3ZvbCBTdG9vbCBieSBJQVxuICBcIjEyMTExQ1wiOiBcIjIxNjEtOFwiLCAvLyBVcmluZSBDcmVhdGluaW5lIFx1MjAxNCBzYW1lIExPSU5DIGFzIDA5MDE2Q1xuICAvLyBcdTI1MDBcdTI1MDAgU2Vyb2xvZ3kgLyBpbW11bm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMDAxQ1wiOiBcIjUyOTItOFwiLCAvLyBSUFIgXHUyMDE0IFNlcnVtL1BsYXNtYVxuICBcIjEyMDIxQ1wiOiBcIjIwMzktNlwiLCAvLyBDRUEgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDI1QlwiOiBcIjI0NjUtM1wiLCAvLyBJZ0cgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDI3QlwiOiBcIjI0NTgtOFwiLCAvLyBJZ0EgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDMxQ1wiOiBcIjE5MTEzLTBcIiwgLy8gSWdFIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gMTIwNjlCIENyeXB0b2NvY2N1cyBBZyBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgNTEzMi02IHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdETkEgc2luZ2xlIHN0cmFuZCBBYiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bScgKGFudGktc3NETkEsXG4gIC8vIGx1cHVzIHNlcm9sb2d5IFx1MjAxNCB2ZXJpZmllZCBsb2luYy5vcmcvNTEzMi02LykuIENvbXBsZXRlbHkgd3JvbmdcbiAgLy8gYW5hbHl0ZS4gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy5cbiAgLy8gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxMjA3OUNcIjogXCIyNDEwOC0zXCIsIC8vIENBIDE5LTkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQmxvb2QgdHlwZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMTAwMUNcIjogXCI4ODItMVwiLCAvLyBcdTg4NDBcdTU3OEJcdTk0NTFcdTVCOUEgXHUyMDE0IEFCTyArIFJoIGdyb3VwXG4gIFwiMTEwMDNDXCI6IFwiODgyLTFcIiwgLy8gXHU4ODQwXHU1NzhCXHU5NDUxXHU1QjlBIFx1MjAxNCBBQk8gKyBSaCBncm91cFxuICBcIjExMDA0Q1wiOiBcIjg5MC00XCIsIC8vIFx1NjI5N1x1OUFENFx1NTNDRFx1NjFDOSBcdTIwMTQgQW50aWJvZHkgc2NyZWVuXG4gIC8vIFx1MjUwMFx1MjUwMCBNaWNyb2Jpb2xvZ3kgY3VsdHVyZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEzMDA3QyBcdTdEMzBcdTgzQ0NcdTU3RjlcdTk5MEEgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDE0MjE5LTAgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0hUTFYgSSBwMjYgQWIgaW4gU2VydW0nICh2ZXJpZmllZCBhdCBsb2luYy5vcmcpLiBUaGVcbiAgLy8gcmlnaHQgZmFtaWx5IGlzIDY0NjMtNCAvIDExMjY4LTAgKEJhY3RlcmlhIGlkZW50aWZpZWQgYnkgYWVyb2JlXG4gIC8vIGN1bHR1cmUpIGJ1dCB0aGUgc291cmNlIHJvdyBkb2Vzbid0IHRlbGwgdXMgc3BlY2ltZW4gXHUyMDE0IGxlYXZpbmdcbiAgLy8gdW5tYXBwZWQgc28gd2UgZG9uJ3QgbGllLiBGYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLlxuICAvLyAxMzAxM0MgVEIgQ3VsdHVyZSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMzE5NTItNSB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnUmluZGVycGVzdCB2aXJ1cyBBZyBbUHJlc2VuY2VdIGluIEV4dWRhdGUnIChjYXR0bGVcbiAgLy8gbW9yYmlsbGl2aXJ1cywgdmVyaWZpZWQgbG9pbmMub3JnLzMxOTUyLTUvKS4gV3Jvbmcgb3JnYW5pc20gZW50aXJlbHkuXG4gIC8vIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuIFNlZVxuICAvLyBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWQuXG4gIFwiMTMwMTZCXCI6IFwiNjAwLTdcIiwgLy8gQmxvb2QgQ3VsdHVyZSBcdTIwMTQgQmFjdGVyaWEgaWRlbnRpZmllZCBpbiBCbG9vZFxuICAvLyBcdTI1MDBcdTI1MDAgVmlyb2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDE0MDA0QiBDTVYgSWdHIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyA3ODQ5LTMgd2hpY2ggaXMgYWN0dWFsbHlcbiAgLy8gJ1RhZW5pYSBzb2xpdW0gbGFydmEgSWdNIEFiIFtQcmVzZW5jZV0gaW4gU2VydW0nIChwb3JrIHRhcGV3b3JtLFxuICAvLyB2ZXJpZmllZCBsb2luYy5vcmcvNzg0OS0zLykuIE5vIHZlcmlmaWVkIGNhbm9uaWNhbCByZXBsYWNlbWVudCBmb3VuZFxuICAvLyBpbiB0aGlzIHBhc3MgKGNhbmRpZGF0ZXMgNTEyNi04IC8gNTEyNS0wIGFyZSBJZ00gb3IgbWV0aG9kLXNwZWNpZmljLFxuICAvLyAyMjU5Mi05IC8gMjI1OTEtMSAvIDE2MTI1LTUgcmV0dXJuZWQgSFRUUCA1MDAgb24gZXZlcnkgcmV0cnkpLlxuICAvLyBMZWF2aW5nIHVubWFwcGVkOyBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLlxuICBcIjE0MDQ4QlwiOiBcIjc4NTMtNVwiLCAvLyBDTVYgSWdNIFx1MjAxNCBDeXRvbWVnYWxvdmlydXMgSWdNIEFiIFtVbml0cy92b2x1bWVdIFMvUFxuICAvLyAgIHJlc3RvcmVkIGFmdGVyIGF1ZGl0OiAxNDA0OEIgcHJldmlvdXNseSBtYXBwZWQgdG8gNzg1MC0xIHdoaWNoIGlzXG4gIC8vICAgJ1RhZW5pYSBzb2xpdW0gbGFydmEgQWInICh2ZXJpZmllZCBsb2luYy5vcmcvNzg1MC0xLykuIDc4NTMtNVxuICAvLyAgIHZlcmlmaWVkIGFzIHRoZSBjYW5vbmljYWwgQ01WIElnTSBMT0lOQyAoQ29tcG9uZW50PUN5dG9tZWdhbG92aXJ1c1xuICAvLyAgIEFiLklnTSwgUHJvcGVydHk9QUNuYykgXHUyMDE0IGxvaW5jLm9yZy83ODUzLTUvLlxuICBcIjE0MDY2Q1wiOiBcIjgwMzgzLTNcIiwgLy8gSW5mbHVlbnphIEEgXHUyMDE0IEFnIFJlc3BpcmF0b3J5XG4gIFwiMTQwODRDXCI6IFwiOTQ1NTgtNFwiLCAvLyBTQVJTLUNvVi0yIEFnIFx1MjAxNCBSZXNwaXJhdG9yeVxuICBcIjEyMTg0Q1wiOiBcIjg4MTU3LTNcIiwgLy8gQ01WIEROQSBxdWFudCBQQ1IgXHUyMDE0IFBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgTXljb2JhY3Rlcml1bSAvIGFjaWQtZmFzdCAoYWRkZWQgYWZ0ZXIgYXVkaXQpIFx1MjUwMFxuICBcIjEzMDI1Q1wiOiBcIjI5MjYwLTdcIiwgLy8gXHU2Mjk3XHU5MTc4XHU2MDI3XHU2RkMzXHU3RTJFXHU2MkI5XHU3MjQ3XHU2N0QzXHU4MjcyXHU2QUEyXHU2N0U1IFx1MjAxNCBNeWNvYmFjdGVyaXVtIEFGQiBzdGFpblxuICBcIjEzMDI2Q1wiOiBcIjI5NTUzLTVcIiwgLy8gXHU2Mjk3XHU5MTc4XHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBNeWNvYmFjdGVyaXVtIGN1bHR1cmUgbGlxdWlkK3NvbGlkXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgcGFuZWwgKDA5MDQxQikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEludGVudGlvbmFsbHkgTk9UIG1hcHBlZCBoZXJlIFx1MjAxNCAwOTA0MUIgaXMgYSBwYW5lbCBvcmRlciB0aGF0XG4gIC8vIHVuZm9sZHMgaW50byBtYW55IGl0ZW1zIChwSCAvIHBDTzIgLyBwTzIgLyBIQ08zIC8gVENPMiAvIFNCRSAvXG4gIC8vIEFCRSAvIFNCQyAvIFNBVCkuIE1hcHBpbmcgdGhlIHBhbmVsIGNvZGUgdG8gXCJwSFwiIHdvdWxkIG1pcy1sYWJlbFxuICAvLyBldmVyeSBub24tcEggcm93IHRoYXQgc2hhcmVzIHRoaXMgTkhJIGNvZGUuIEVhY2ggaXRlbSBpc1xuICAvLyByZXNvbHZlZCB2aWEgX0xPSU5DX01BUCBkaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgYmVsb3c7IDA5MDQxQlxuICAvLyBhbHNvIGFwcGVhcnMgaW4gX0RJU1BMQVlfRklSU1RfQ09ERVMgc28gZGlzcGxheSBhbHdheXMgd2lucy5cbiAgLy8gXHUyNTAwXHUyNTAwIEJvZHkgZmx1aWQgLyBzeW5vdmlhbCBmbHVpZCBwYW5lbCAoMTYwMDhDIHVuZm9sZHM7IHRoZVxuICAvLyBtZW1iZXIgaXRlbXMgcmVseSBvbiBkaXNwbGF5IGtleXdvcmRzIGZvciBzcGVjaW1lbi1hd2FyZVxuICAvLyBMT0lOQ3MpLiBQYXJlbnQgY29kZSBtYXBzIHRvIHN5bm92aWFsIGZsdWlkIGFuYWx5c2lzIHBhbmVsLiBcdTI1MDBcdTI1MDBcbiAgLy8gMTYwMDhDIFx1NkVEMVx1NkRCMlx1NkFBMlx1NjdFNSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMzM5MDMtNiB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnS2V0b25lcyBbUHJlc2VuY2VdIGluIFVyaW5lJyAodmVyaWZpZWQgbG9pbmMub3JnKS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgdGhlIHBhbmVsIGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGluZyBvbmx5XG4gIC8vIGFuZCB0aGUgcGVyLWl0ZW0gZGlzcGxheXMgaW4gX0xPSU5DX01BUCBjYXJyeSB0aGVpciBvd24gTE9JTkNzXG4gIC8vIHdoZXJlIGtub3duLlxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9ESVNQTEFZX0ZJUlNUX0NPREVTIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIGNvZGVzIHRoYXQgYXJlICpwYW5lbHMqIFx1MjAxNCBvbmUgYmlsbGluZyBjb2RlLCBtYW55IGl0ZW0tc3BlY2lmaWNcbi8vIGRpc3BsYXlzLiBGb3IgdGhlc2UsIGRpc3BsYXkga2V5d29yZCBNVVNUIGJlIHRyaWVkIGZpcnN0IChzbyBcIldCQ1wiXG4vLyB1bmRlciBDQkMgcGFuZWwgMDgwMTFDIGdldHMgNjY5MC0yLCBub3QgdGhlIGdlbmVyaWMgcGFuZWwgTE9JTkMpLlxuLy8gRm9yIGV2ZXJ5dGhpbmcgZWxzZSAoc2luZ2xlLXRlc3QgY29kZXMgbGlrZSAwOTAwNUMgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2LFxuLy8gMDkwNDRDIExETCwgMTQwMzBDIEhCc0FnKSwgdGhlIE5ISSBjb2RlIGlzIG1vcmUgc3BlY2lmaWMgdGhhbiBhbnlcbi8vIGRpc3BsYXkga2V5d29yZCBhbmQgd2lucyBvdXRyaWdodC5cbi8vXG4vLyBERVNJR04gUEhJTE9TT1BIWTogdGhlIGJyaWRnZSBpcyBhICpmYWl0aGZ1bCB0cmFuc3BvcnQqIGxheWVyIFx1MjAxNCBpdFxuLy8gdHJ1c3RzIHRoZSBcdTUwNjVcdTRGREQgYmlsbGluZyBjb2RlIGFzIGF1dGhvcml0YXRpdmUgZm9yIGNsaW5pY2FsIGludGVudFxuLy8gKFx1OTY2Mlx1NjI0MCBiaWxsZWQgMDkwMDVDID0gdGhleSBvcmRlcmVkIGZhc3RpbmcgZ2x1Y29zZSwgcmVnYXJkbGVzcyBvZlxuLy8gd2hldGhlciB0aGUgb3BlcmF0aW9uYWwgc3BlY2ltZW4gd2FzIGEgZmluZ2VyLXN0aWNrKS4gRGlzcGxheS1zdHJpbmdcbi8vIHJlLWludGVycHJldGF0aW9uIG9mIGNsaW5pY2FsIGNvbnRleHQgKEdsdS1BQyB2cyBGSU5HRVIgU1VHQVIgdnNcbi8vIHJhbmRvbSkgaXMgbGVmdCB0byB0aGUgU01BUlQgYXBwLCB3aGljaCBoYXMgbW9yZSBVSSBjb250ZXh0LlxuZXhwb3J0IGNvbnN0IERJU1BMQVlfRklSU1RfQ09ERVM6IFJlYWRvbmx5U2V0PHN0cmluZz4gPSBuZXcgU2V0KFtcbiAgXCIwODAxMUNcIiwgLy8gQ0JDIHBhbmVsXG4gIFwiMDgwMTNDXCIsIC8vIENCQyB3LyBhdXRvIGRpZmYgcGFuZWxcbiAgXCIwNjAxM0NcIiwgLy8gVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA5MDQxQlwiLCAvLyBBQkcgcGFuZWxcbiAgXCIxNjAwOENcIiwgLy8gU3lub3ZpYWwgLyBib2R5LWZsdWlkIHBhbmVsXG5dKTtcblxuLy8gXHUyNTAwXHUyNTAwIF9QQU5FTF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBQYW5lbC1zcGVjaWZpYyBkaXNwbGF5IFx1MjE5MiBMT0lOQyBvdmVycmlkZXMuIFRoZXNlIHJ1biBCRUZPUkUgdGhlIGdsb2JhbFxuLy8gX0xPSU5DX01BUCBzbyB0aGF0IHVyaW5lIGJpbGlydWJpbiB1bmRlciAwNjAxM0MgbWFwcyB0byA1NzcwLTMgKHVyaW5lXG4vLyBzcGVjaW1lbikgaW5zdGVhZCBvZiBiZWluZyBzaGFkb3dlZCBieSB0aGUgZ2xvYmFsICdiaWxpcnViaW4nIHRoYXRcbi8vIHdvdWxkIGltcGx5IHNlcnVtLCBhbmQgYW5hbG9nb3VzIHNwZWNpbWVuLWF3YXJlIGRpc2FtYmlndWF0aW9uIGZvclxuLy8gb3RoZXIgcGFuZWwgc3ViLWl0ZW1zLiBLZXlzIGFyZSBOSEkgcGFuZWwgY29kZXMgKG11c3QgYWxzbyBiZSBpblxuLy8gX0RJU1BMQVlfRklSU1RfQ09ERVMpOyB2YWx1ZXMgYXJlIGRpc3BsYXkta2V5d29yZCBcdTIxOTIgTE9JTkMgZGljdHMgdGhhdFxuLy8gZm9sbG93IHRoZSBzYW1lIG1hdGNoaW5nIHNlbWFudGljcyBhcyBfTE9JTkNfTUFQIChsZWFkaW5nIHdvcmRcbi8vIGJvdW5kYXJ5IGZvciBBU0NJSSwgc3Vic3RyaW5nIGZvciBDSkspLlxuZXhwb3J0IGNvbnN0IFBBTkVMX0xPSU5DX01BUDogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBBbGwgcm91dGluZSBkaXBzdGljayBpdGVtcyByZXNpZGUgb24gYSBzaW5nbGUgTkhJIGJpbGxpbmcgY29kZS5cbiAgLy8gV2l0aG91dCB0aGlzIHRhYmxlIHRoZXknZCBhbGwgY29sbGFwc2UgdG8gdGhlIHBhbmVsIExPSU5DIDI0MzU2LTgsXG4gIC8vIGxvc2luZyBwZXItaXRlbSBncmFudWxhcml0eSB0aGF0J3MgY2xpbmljYWxseSB1c2VmdWwgKGUuZy5cbiAgLy8gYmlsaXJ1YmluIHZzIHVyb2JpbGlub2dlbiBmb3IgbGl2ZXIgd29ya3VwKS5cbiAgXCIwNjAxM0NcIjoge1xuICAgIC8vIE9yZGVyIG1hdHRlcnM6IGxvbmdlci9tb3JlLXNwZWNpZmljIGtleXMgYmVmb3JlIGdlbmVyaWMgb25lc1xuICAgIC8vIChtYXRjaGVzIF9MT0lOQ19NQVAgaXRlcmF0aW9uIHNlbWFudGljcyBcdTIwMTQgZmlyc3QgaGl0IHdpbnMpLlxuICAgIFwic3BlY2lmaWMgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLCAvLyBTcGVjaWZpYyBncmF2aXR5IFVyaW5lXG4gICAgXCJzcC5ncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXCJzcCBncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXHU2QkQ0XHU5MUNEOiBcIjU4MTEtNVwiLFxuICAgIFwibWljcm8tYWxidW1pblwiOiBcIjE0OTU3LTVcIiwgLy8gTWljcm9hbGJ1bWluIE1hc3Mvdm9sIFVyaW5lXG4gICAgbWljcm9hbGJ1bWluOiBcIjE0OTU3LTVcIixcbiAgICBcIm1hbGIodSlcIjogXCIxNDk1Ny01XCIsXG4gICAgbWFsYjogXCIxNDk1Ny01XCIsXG4gICAgXHU1RkFFXHU1QzBGXHU3NjdEXHU4NkNCXHU3NjdEOiBcIjE0OTU3LTVcIixcbiAgICB1YWNyOiBcIjE0OTU5LTFcIiwgLy8gTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgcmF0aW8gVXJpbmVcbiAgICBcInVyaW5lIGdsdWNvc2VcIjogXCI1NzkyLTdcIixcbiAgICBzdWdhcjogXCI1NzkyLTdcIiwgLy8gTkhJICdcdTVDM0ZcdTdDRDYnIC8gJ1N1Z2FyJyB1bmRlciAwNjAxM0NcbiAgICBcdTVDM0ZcdTdDRDY6IFwiNTc5Mi03XCIsXG4gICAgdXJvYmlsaW5vZ2VuOiBcIjU4MTgtMFwiLCAvLyBVcm9iaWxpbm9nZW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMjBcdTUzOUY6IFwiNTgxOC0wXCIsXG4gICAgYmlsaXJ1YmluOiBcIjU3NzAtM1wiLCAvLyBCaWxpcnViaW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMDVcdTdEMjA6IFwiNTc3MC0zXCIsXG4gICAgbml0cml0ZTogXCI1ODAyLTRcIiwgLy8gTml0cml0ZSBVcmluZVxuICAgIFx1NEU5RVx1Nzg1RFx1OTE3ODogXCI1ODAyLTRcIixcbiAgICBrZXRvbmVzOiBcIjU3OTctNlwiLCAvLyBLZXRvbmVzIFVyaW5lXG4gICAga2V0b25lOiBcIjU3OTctNlwiLFxuICAgIFx1OTE2RVx1OUFENDogXCI1Nzk3LTZcIixcbiAgICBwcm90ZWluOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICAgIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgICBsZXVrb2N5dGU6IFwiNTc5OS0yXCIsIC8vIExldWtvY3l0ZXMgVXJpbmVcbiAgICBsZXU6IFwiNTc5OS0yXCIsXG4gICAgXHU3NjdEXHU4ODQwXHU3NDAzXHU5MTZGXHU5MTc2OiBcIjU3OTktMlwiLFxuICAgIGJsb29kOiBcIjU3OTQtM1wiLCAvLyBIZW1vZ2xvYmluIFVyaW5lIFFsXG4gICAgXHU2RjVCXHU4ODQwOiBcIjU3OTQtM1wiLFxuICAgIFx1ODI3MjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgVXJpbmUgKENKSyBzdWJzdHJpbmcpXG4gICAgY29sb3I6IFwiNTc3OC02XCIsXG4gICAgdHVyYmlkaXR5OiBcIjU3NjctOVwiLCAvLyBBcHBlYXJhbmNlIG9mIFVyaW5lXG4gICAgYXBwZWFyYW5jZTogXCI1NzY3LTlcIixcbiAgICBcdTU5MTZcdTg5QzA6IFwiNTc2Ny05XCIsXG4gICAgcGg6IFwiNTgwMy0yXCIsIC8vIHBIIG9mIFVyaW5lICh1cmluZS1zcGVjaWZpYywgTk9UXG4gICAgLy8gdGhlIGFydGVyaWFsIDExNTU4LTQgdGhhdCB0aGVcbiAgICAvLyBnbG9iYWwgbWFwIHBvaW50cyB0bylcbiAgICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiNTgwMy0yXCIsXG4gICAgZ2x1Y29zZTogXCI1NzkyLTdcIiwgLy8gTGFzdCBpbiB0aGlzIGJsb2NrIHNvICd1cmluZVxuICB9LFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDb21tb24gVGFpd2FuZXNlIEhJUyBsYWIgbmFtZXMgXHUyMTkyIExPSU5DIGNvZGUgbWFwcGluZ1xuZXhwb3J0IGNvbnN0IExPSU5DX01BUDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIERpc3BsYXkta2V5d29yZCBmYWxsYmFjayBvbmx5IGtpY2tzIGluIHdoZW4gTk8gTkhJIGNvZGUgaXNcbiAgLy8gcHJlc2VudCAoZGFzaGJvYXJkIHJvd3MsIExMTS1leHRyYWN0ZWQgdGV4dCkuIFdoZW4gdGhlIE5ISSBjb2RlXG4gIC8vIElTIHByZXNlbnQsIDA5MDA1QyBcdTIxOTIgMTU1OC02IChGYXN0aW5nKSBhbmQgMDkxNDBDIFx1MjE5MiAyMzQ1LTdcbiAgLy8gKGdlbmVyaWMpIHdpbnMgZGlyZWN0bHkgdmlhIF9OSElfVE9fTE9JTkMuXG4gIC8vXG4gIC8vIEZhaXRoZnVsLXRyYW5zcG9ydCBwcmluY2lwbGU6IHRoZSBicmlkZ2UgZG9lcyBOT1QgcmUtaW50ZXJwcmV0XG4gIC8vIGRpc3BsYXkgc3RyaW5ncyBsaWtlIFwiRklOR0VSIFNVR0FSXCIgYXMgYSBkaWZmZXJlbnQgTE9JTkMgXHUyMDE0IGl0XG4gIC8vIHByZXNlcnZlcyB0aGUgcmF3IGRpc3BsYXkgaW4gYGNvZGUudGV4dGAgYW5kIHRoZSBvcmlnaW5hbCBOSElcbiAgLy8gY29kZSBpbiBgY29kZS5jb2RpbmdgLiBUaGUgU01BUlQgYXBwIGRvZXMgc3BlY2ltZW4vbWV0aG9kLWF3YXJlXG4gIC8vIGdyb3VwaW5nIG9uIHRoZSBjb25zdW1lciBzaWRlIChzZWUgU01BUlQgYXBwIGhhbmRvZmYgZG9jKS5cbiAgXCJmYXN0aW5nIGdsdWNvc2VcIjogXCIxNTU4LTZcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIjE1NTgtNlwiLFxuICBcImdsdS1hY1wiOiBcIjE1NTgtNlwiLFxuICBcImdsdWNvc2UgYWNcIjogXCIxNTU4LTZcIixcbiAgZ2x1Y29zZTogXCIyMzQ1LTdcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIjIzNDUtN1wiLFxuICBnbHU6IFwiMjM0NS03XCIsXG4gIC8vIEhiQTFjIE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljIFwiaGJcIiBlbnRyaWVzIHNvIHRoZSBsb25nZXN0LXByZWZpeFxuICAvLyBtYXRjaCB3aW5zIGZvciB0aGUgXCJIYkExY1wiIGRpc3BsYXkgc3RyaW5nLiBPdGhlciBBMWMgc3lub255bXNcdTIwMjZcbiAgaGJhMWM6IFwiNDU0OC00XCIsXG4gIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCI0NTQ4LTRcIixcbiAgYTFjOiBcIjQ1NDgtNFwiLFxuICBoZW1vZ2xvYmluOiBcIjcxOC03XCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCI3MTgtN1wiLFxuICBoZ2I6IFwiNzE4LTdcIixcbiAgaGI6IFwiNzE4LTdcIixcbiAgLy8gQ0JDIGRpZmYgXHUyMDE0IGVvc2lub3BoaWwgY291bnQgbXVzdCBwcmVjZWRlIHRoZSBiYXJlICd3YmMnLydcdTc2N0RcdTg4NDBcdTc0MDMnXG4gIC8vIGtleXMgKHdoaWNoIHdvdWxkIG90aGVyd2lzZSB3aW4gYXMgc3Vic3RyaW5ncykuXG4gIC8vIDcxMS0yIHZlcmlmaWVkIGF0IGxvaW5jLm9yZzogJ0Vvc2lub3BoaWxzIFsjL3ZvbHVtZV0gaW4gQmxvb2RcbiAgLy8gYnkgQXV0b21hdGVkIGNvdW50Jy5cbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIjcxMS0yXCIsXG4gIFx1NTVEQ1x1NEYwQVx1N0QwNVx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsOiBcIjcxMS0yXCIsXG4gIGVvc2lub3BoaWxzOiBcIjcxMS0yXCIsXG4gIHdiYzogXCI2NjkwLTJcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIjY2OTAtMlwiLFxuICBwbGF0ZWxldDogXCI3NzctM1wiLFxuICBcdTg4NDBcdTVDMEZcdTY3N0Y6IFwiNzc3LTNcIixcbiAgcGx0OiBcIjc3Ny0zXCIsXG4gIC8vIFJCQyArIFJCQyBpbmRpY2VzIFx1MjAxNCB2ZXJpZmllZCBMT0lOQ3MgKGxvaW5jLm9yZyk6XG4gIC8vIDc4OS04ICBFcnl0aHJvY3l0ZXMgIy92b2wgQmxvb2QgQXV0byAgICAgICAgICAgICAgXHUyMTkyIFJCQ1xuICAvLyA3ODUtNiAgRXJ5dGhyb2N5dGUgbWVhbiBjb3JwdXNjdWxhciBoZW1vZ2xvYmluICAgIFx1MjE5MiBNQ0hcbiAgLy8gTG9uZyBDSksgZm9ybXMgZmlyc3QgKExETC9jaG9sZXN0ZXJvbCBwYXR0ZXJuKSBzbyAnXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXG4gIC8vIFx1ODg0MFx1ODI3Mlx1N0QyMCcgd2lucyBvdmVyIFx1N0QwNVx1ODg0MFx1NzQwMy5cbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIjc4NS02XCIsXG4gIHJiYzogXCI3ODktOFwiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDM6IFwiNzg5LThcIixcbiAgbWNoOiBcIjc4NS02XCIsXG4gIC8vIFVyaW5lIGNyZWF0aW5pbmUgXHUyMDE0IE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljICdjcmVhdGluaW5lJyBzb1xuICAvLyByb3dzIGxpa2UgJ1UtQ1JFIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MCcgb3IgJ0NyZWF0aW5pbmUoVSknIHJlc29sdmUgdG8gdGhlXG4gIC8vIHVyaW5lIExPSU5DICgyMTYxLTgpIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIHNlcnVtXG4gIC8vIGRlZmF1bHQgKDIxNjAtMCkuIFNhbWUgbG9uZ2VzdC1zcGVjaWZpYy1maXJzdCBvcmRlcmluZyBhc1xuICAvLyB0aGUgZmFzdGluZy12cy1yYW5kb20gZ2x1Y29zZSBibG9jay5cbiAgXCJ1cmluZSBjcmVhdGluaW5lXCI6IFwiMjE2MS04XCIsXG4gIFwiY3JlYXRpbmluZSB1cmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUodSlcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZVwiOiBcIjIxNjEtOFwiLFxuICBcInUtY3JlYVwiOiBcIjIxNjEtOFwiLFxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MS04XCIsXG4gIGNyZWF0aW5pbmU6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE3OFx1OTE1MDogXCIyMTYwLTBcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIjIxNjAtMFwiLCAvLyBUYWl3YW4gdmFyaWFudCBzcGVsbGluZ1xuICBjcmVhOiBcIjIxNjAtMFwiLFxuICBidW46IFwiMzA5NC0wXCIsXG4gIFx1NUMzRlx1N0QyMFx1NkMyRTogXCIzMDk0LTBcIixcbiAgYXN0OiBcIjE5MjAtOFwiLFxuICBhbHQ6IFwiMTc0Mi02XCIsXG4gIGZlcnJpdGluOiBcIjIyNzYtNFwiLFxuICBcdTg4NDBcdTZFMDVcdTk0MzVcdTg2Q0JcdTc2N0Q6IFwiMjI3Ni00XCIsXG4gIGZlcnI6IFwiMjI3Ni00XCIsXG4gIC8vIFZpdGFsLXNpZ25zIGZyb20gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1IChJSEtFMzQwMikgXHUyMDE0IHNlcGFyYXRlIGNvZGUgbmFtZXNwYWNlXG4gIC8vIGJ1dCB0aGUgbG9va3VwIGlzIGJ5IGRpc3BsYXktbmFtZSBzdWJzdHJpbmcsIHNhbWUgYXMgZm9yIGxhYnMuXG4gIFwiYm9keSBoZWlnaHRcIjogXCI4MzAyLTJcIixcbiAgXCJib2R5IHdlaWdodFwiOiBcIjI5NDYzLTdcIixcbiAgYm1pOiBcIjM5MTU2LTVcIixcbiAgLy8gV2Fpc3QgY2lyY3VtZmVyZW5jZSBcdTIwMTQgbWVhc3VyZW1lbnQgTE9JTkMgKDgyODAtMCkuIDU2MDg2LTIgaXNcbiAgLy8gdGhlICdBZHVsdCBXYWlzdCBDaXJjdW1mZXJlbmNlIFByb3RvY29sJyBjb2RlLCB3aGljaCBpcyBhXG4gIC8vIHN1cnZleS9wcm90b2NvbCBkZXNjcmlwdG9yLCBOT1QgYSBudW1lcmljIG1lYXN1cmVtZW50XG4gIC8vICh2ZXJpZmllZCBhdCBsb2luYy5vcmcpLiBOSEkgXHU1MDY1XHU0RkREIHJlcG9ydHMgYSBzaW5nbGUgd2Fpc3RsaW5lXG4gIC8vIG51bWJlciBwZXIgdmlzaXQsIHNvIHRoZSBtZWFzdXJlbWVudCBjb2RlIGlzIGNvcnJlY3QuXG4gIFwid2Fpc3QgY2lyY3VtZmVyZW5jZVwiOiBcIjgyODAtMFwiLFxuICBcInN5c3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ4MC02XCIsXG4gIFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ2Mi00XCIsXG4gIC8vIExpcGlkIHBhbmVsIFx1MjAxNCBPUkRFUiBNQVRURVJTLiBMREwvSERMIHZhcmlhbnRzIE1VU1QgcHJlY2VkZSB0aGVcbiAgLy8gZ2VuZXJpYyAnY2hvbGVzdGVyb2wnIGtleSBzbyBhIHJvdyBsYWJlbGxlZCAnTERMIENIT0xFU1RFUk9MJ1xuICAvLyByZXNvbHZlcyB0byAxMzQ1Ny03IChMREwgY2FsY3VsYXRlZCkgYW5kICdIREwgQ0hPTEVTVEVST0wnIHRvXG4gIC8vIDIwODUtOSwgaW5zdGVhZCBvZiBmYWxsaW5nIHRvIDIwOTMtMyAodG90YWwgY2hvbGVzdGVyb2wpIHZpYSB0aGVcbiAgLy8gJ2Nob2xlc3Rlcm9sJyBzdWJzdHJpbmcuIFNhbWUgY2Fub25pY2FsIG9yZGVyaW5nIGFzIF9MQUJfU1lOT05ZTVMuXG4gIFwibGRsIGNob2xlc3Rlcm9sXCI6IFwiMTM0NTctN1wiLFxuICBcImxkbC1jaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgLy8gMTM0NTctNyA9IExETCBjaG9sZXN0ZXJvbCAoY2FsY3VsYXRlZCkgXHUyMDE0IG1hdGNoZXMgdGhlIE5ISSAwOTA0NENcbiAgLy8gYmlsbGluZyBjb2RlJ3MgaW50ZW50IChUYWl3YW4gbGFicyBwcmVkb21pbmFudGx5IHJlcG9ydCBjYWxjdWxhdGVkXG4gIC8vIExETCB2aWEgRnJpZWRld2FsZCkuIEtlZXAgY29uc2lzdGVudCB3aXRoIF9OSElfVE9fTE9JTkNbXCIwOTA0NENcIl0uXG4gIFwibGRsLWNcIjogXCIxMzQ1Ny03XCIsXG4gIGxkbDogXCIxMzQ1Ny03XCIsXG4gIFwiaGRsIGNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFwiaGRsLWNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwODUtOVwiLFxuICBcImhkbC1jXCI6IFwiMjA4NS05XCIsXG4gIGhkbDogXCIyMDg1LTlcIixcbiAgLy8gVG90YWwgY2hvbGVzdGVyb2wgXHUyMDE0IGJhcmUgJ2Nob2xlc3Rlcm9sJyBvbmx5IGZpcmVzIEFGVEVSIHRoZVxuICAvLyBMREwvSERMLXByZWZpeGVkIHZhcmlhbnRzIGFib3ZlIGhhdmUgYmVlbiBjaGVja2VkLlxuICBcInRvdGFsIGNob2xlc3Rlcm9sXCI6IFwiMjA5My0zXCIsXG4gIFwidC1jaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIFx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDkzLTNcIixcbiAgY2hvbGVzdGVyb2w6IFwiMjA5My0zXCIsXG4gIHRyaWdseWNlcmlkZTogXCIyNTcxLThcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIjI1NzEtOFwiLFxuICBcInVyaWMgYWNpZFwiOiBcIjMwODQtMVwiLFxuICBlZ2ZyOiBcIjMzOTE0LTNcIixcbiAgaGJzYWc6IFwiNTE5Ni0xXCIsXG4gIFwiYW50aS1oY3ZcIjogXCIxNjEyOC0xXCIsXG4gIC8vIFVyaW5lIHByb3RlaW4gKGRpc3BsYXkgZmFsbGJhY2sgZm9yIHRoZSBuby1OSEktY29kZSBwYXRoIHRoYXRcbiAgLy8gY29tZXMgZnJvbSBJSEtFMzQwMiB2aXRhbHMgKyBhZHVsdC1wcmV2ZW50aXZlIHN1cHBsZW1lbnRzKS5cbiAgXCJ1cmluZSBwcm90ZWluXCI6IFwiMjA0NTQtNVwiLCAvLyBQcm90ZWluIE1hc3Mvdm9sIFVyaW5lXG4gIFwidS1wcm9cIjogXCIyMDQ1NC01XCIsXG4gIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gIC8vIEFCRyBwYW5lbCBjb21wb25lbnRzIFx1MjAxNCAwOTA0MUIgcGFyZW50IGNvZGUgaW4gTkhJX1RPX0xPSU5DOyBlYWNoXG4gIC8vIG1lbWJlcidzIGRpc3BsYXkgKFwicENPMlwiLCBcInBPMlwiLCBcIkhDTzNcIiwgXCJUQ08yXCIsIFwiU0JFL0FCRVwiLFxuICAvLyBcIlNCQ1wiLCBcIlNBVFwiIC8gXCJTYU8yXCIpIGZhbGxzIHRvIGl0cyBvd24gTE9JTkMuXG4gIC8vIHBIIE1VU1QgY29tZSBiZWZvcmUgcGNvMi9wbzIgc28gdGhlIGJhcmUgXCJwSFwiIGRpc3BsYXkgbGFuZHMgaGVyZS5cbiAgcGg6IFwiMTE1NTgtNFwiLCAvLyBwSCBvZiBBcnRlcmlhbCBibG9vZFxuICBwY28yOiBcIjIwMTktOFwiLCAvLyBDYXJib24gZGlveGlkZSBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBwbzI6IFwiMjcwMy03XCIsIC8vIE94eWdlbiBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBoY28zOiBcIjE5NTktNlwiLCAvLyBCaWNhcmJvbmF0ZSBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgYmljYXJib25hdGU6IFwiMTk1OS02XCIsXG4gIHRjbzI6IFwiMjAyOC05XCIsIC8vIFRvdGFsIENPMiBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgc2JlOiBcIjExNTU1LTBcIiwgLy8gU3RhbmRhcmQgYmFzZSBleGNlc3MgQXJ0ZXJpYWxcbiAgYWJlOiBcIjExNTU1LTBcIixcbiAgc2JjOiBcIjE5MjUtN1wiLCAvLyBTdGFuZGFyZCBiaWNhcmJvbmF0ZSBBcnRlcmlhbFxuICBzYXR1cmF0OiBcIjI3MTMtNlwiLCAvLyBPMiBzYXR1cmF0aW9uIEFydGVyaWFsXG4gIHNhbzI6IFwiMjcxMy02XCIsXG4gIHNhdDogXCIyNzEzLTZcIiwgLy8gTkhJIGRpc3BsYXkgc2hvd3MganVzdCBcIlNBVFwiXG4gIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBjb21wb25lbnRzICgxNjAwOEMgcGFyZW50IGFib3ZlKS5cbiAgXCJzZi5jb2xvclwiOiBcIjU3NzgtNlwiLCAvLyBDb2xvciBvZiBCb2R5IGZsdWlkIChyZXVzZSBVcmluZSBjb2xvciBzcGVjIE9LKVxuICAvLyBOT1RFOiA4MjU1LTIgLyAxMzk0OC01IHByZXZpb3VzbHkgbGlzdGVkIGhlcmUgYm90aCB0dXJuZWQgb3V0XG4gIC8vIHRvIGJlIHVucmVsYXRlZCBMT0lOQ3MgKHZlcmlmaWVkIGxvaW5jLm9yZyBcdTIwMTQgODI1NS0yIGlzXG4gIC8vICdTZXJ2aWNlIGNvbW1lbnQgMTMnLCAxMzk0OC01IGlzICdDb2NjaWRpb2lkZXMgaW1taXRpcyBJZ01cbiAgLy8gQWInKS4gQm9keS1mbHVpZCBBcHBlYXJhbmNlIC8gUkJDIGRvbid0IGhhdmUgd2VsbC1hdHRlc3RlZFxuICAvLyBMT0lOQ3MgaW4gb3VyIHRhYmxlIHlldCBcdTIwMTQgZmFsbGluZyB0aHJvdWdoIHRvIGNvZGUudGV4dC1vbmx5XG4gIC8vIGlzIHNhZmVyIHRoYW4gZW1pdHRpbmcgYSBtaXNsZWFkaW5nIExPSU5DLiBUbyBhZGQgbGF0ZXIsXG4gIC8vIHZlcmlmeSBlYWNoIGFnYWluc3QgbG9pbmMub3JnIGZpcnN0LlxuICBcInNmLndiY1wiOiBcIjI2NDY2LTNcIiwgLy8gV0JDICMvdm9sIEJvZHkgZmx1aWRcbiAgXCJzZi5uZXV0cm9waGlsXCI6IFwiMTAzMjgtNlwiLCAvLyBOZXV0cm9waGlscy8xMDAgbGV1a29jeXRlcyBpbiBCb2R5IGZsdWlkXG4gIFwic2YubHltcGhvXCI6IFwiMTMwNDYtOFwiLCAvLyBMeW1waG9jeXRlcyAjL3ZvbCBCb2R5IGZsdWlkXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0xPSU5DX0RJU1BMQVkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDYW5vbmljYWwgRW5nbGlzaCBkaXNwbGF5IG5hbWVzIGZvciBMT0lOQyBjb2RlcyB0aGUgYnJpZGdlIGVtaXRzLlxuLy8gRmFsbHMgYmFjayB0byB0aGUgcmF3IGlucHV0IGRpc3BsYXkgd2hlbiBhIExPSU5DIGlzbid0IGxpc3RlZCBoZXJlLlxuLy8gU291cmNlZCBmcm9tIGxvaW5jLm9yZyBjYW5vbmljYWwgc2hvcnQgbmFtZXMgd2hlcmUgYXBwbGljYWJsZS5cbi8vIEFkZCBuZXcgZW50cmllcyBhcyB3ZSB3aWRlbiBMT0lOQyBjb3ZlcmFnZSBcdTIwMTQgdGhlIGxvb2t1cCBpcyBrZXllZCBvblxuLy8gTE9JTkMgc3RyaW5nLCBzbyB1bm1hcHBlZCBMT0lOQ3MgZGVncmFkZSBncmFjZWZ1bGx5IHRvIHRoZSBOSEkgdGV4dC5cbmV4cG9ydCBjb25zdCBMT0lOQ19ESVNQTEFZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE1vc3QgY3JpdGljYWwgYmxvY2sgXHUyMDE0IE5ISSdzIFwiQ29sb3IgXHU1QzNGIFx1OTg0RiAgLi4uXCIgc3R5bGUgbGFiZWxzIGFyZVxuICAvLyB3aGF0IHRyaWdnZXJzIGRvd25zdHJlYW0gQ2hpbmVzZS1zdWJzdHJpbmcgbGFiZWxsaW5nIGJ1Z3MuXG4gIFwiNTgwMy0yXCI6IFwicEggb2YgVXJpbmVcIixcbiAgXCI1ODExLTVcIjogXCJTcGVjaWZpYyBncmF2aXR5IG9mIFVyaW5lXCIsXG4gIFwiNTc3MC0zXCI6IFwiQmlsaXJ1YmluIFVyaW5lIFFsXCIsXG4gIFwiNTgwMi00XCI6IFwiTml0cml0ZSBVcmluZSBRbFwiLFxuICBcIjU3NzgtNlwiOiBcIkNvbG9yIG9mIFVyaW5lXCIsXG4gIFwiNTc2Ny05XCI6IFwiQXBwZWFyYW5jZSBvZiBVcmluZVwiLFxuICBcIjU4MTgtMFwiOiBcIlVyb2JpbGlub2dlbiBVcmluZSBRbFwiLFxuICBcIjIwNDU0LTVcIjogXCJQcm90ZWluIE1hc3MvVm9sIGluIFVyaW5lXCIsXG4gIFwiMTQ5NTctNVwiOiBcIk1pY3JvYWxidW1pbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU5LTFcIjogXCJNaWNyb2FsYnVtaW4vQ3JlYXRpbmluZSBSYXRpbyBpbiBVcmluZVwiLFxuICBcIjU3OTItN1wiOiBcIkdsdWNvc2UgVXJpbmUgUWxcIixcbiAgXCI1Nzk3LTZcIjogXCJLZXRvbmVzIFVyaW5lIFFsXCIsXG4gIFwiNTc5NC0zXCI6IFwiSGVtb2dsb2JpbiBVcmluZSBRbFwiLFxuICBcIjU3OTktMlwiOiBcIkxldWtvY3l0ZXMgVXJpbmUgUWxcIixcbiAgXCIyNDM1Ni04XCI6IFwiVXJpbmFseXNpcyBNYWNybyBQYW5lbFwiLFxuICAvLyBBTEwgZW50cmllcyBiZWxvdyB1c2UgdGhlIExPSU5DIGNhbm9uaWNhbCAnTG9uZyBDb21tb24gTmFtZSdcbiAgLy8gYXMgYWNjZXB0ZWQgYnkgdGhlIFRXTkhJRkhJUiB2YWxpZGF0b3IuIFNvdXJjZTogbG9pbmMub3JnIGZvclxuICAvLyBlYWNoIGNvZGUsIGNyb3NzLWNoZWNrZWQgYWdhaW5zdCB0aGUgdmFsaWRhdG9yJ3MgcmVwb3J0ZWRcbiAgLy8gJ1ZhbGlkIGRpc3BsYXkgaXMgb25lIG9mIE4gY2hvaWNlcycgZm9yIGRpc3BsYXlzIHdlIHByZXZpb3VzbHlcbiAgLy8gZ290IHdyb25nICg0NSBMT0lOQ3MgZm91bmQgaW4gdGhlIFAzMzMzMzMzMzMgdmFsaWRhdGlvbiBydW4pLlxuICAvLyBXaGVuIHVwZGF0aW5nLCBjb3B5IHRoZSBleGFjdCBlbi1VUyBsb25nIG5hbWUgZnJvbSBsb2luYy5vcmcgXHUyMDE0XG4gIC8vIHRoZSB2YWxpZGF0b3IgaXMgc2Vuc2l0aXZlIHRvIHNwZWxsaW5nIC8gcHVuY3R1YXRpb24uXG4gIC8vXG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MgcGFuZWwgc3ViLWl0ZW1zKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gXHUyNTAwXHUyNTAwIEFCRyAoMDkwNDFCIHBhbmVsKSBcdTIwMTQgbm90IGluIHZhbGlkYXRvciBvdXRwdXQ7IGxvaW5jLm9yZyBzb3VyY2VkXG4gIFwiMTE1NTgtNFwiOiBcInBIIG9mIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAxOS04XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW1BhcnRpYWwgcHJlc3N1cmVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjcwMy03XCI6IFwiT3h5Z2VuIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjE5NTktNlwiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAyOC05XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTE1NTUtMFwiOiBcIkJhc2UgZXhjZXNzIGluIEFydGVyaWFsIGJsb29kIGJ5IGNhbGN1bGF0aW9uXCIsXG4gIFwiMTkyNS03XCI6IFwiQmljYXJib25hdGUgW01vbGVzL3ZvbHVtZV0gaW4gQXJ0ZXJpYWwgYmxvb2QgLS1zdGFuZGFyZFwiLFxuICBcIjI3MTMtNlwiOiBcIk94eWdlbiBzYXR1cmF0aW9uIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE1NTgtNlwiOiBcIkZhc3RpbmcgZ2x1Y29zZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIzNDUtN1wiOiBcIkdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNzE4LTdcIjogXCJIZW1vZ2xvYmluIFtNYXNzL3ZvbHVtZV0gaW4gQmxvb2RcIixcbiAgXCI0NTQ4LTRcIjogXCJIZW1vZ2xvYmluIEExYy9IZW1vZ2xvYmluLnRvdGFsIGluIEJsb29kXCIsXG4gIFwiNjY5MC0yXCI6IFwiTGV1a29jeXRlcyBbIy92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc3Ny0zXCI6IFwiUGxhdGVsZXRzIFsjL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzg5LThcIjogXCJFcnl0aHJvY3l0ZXMgWyMvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3ODUtNlwiOiBcIk1DSCBbRW50aXRpYyBtYXNzXSBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3MTEtMlwiOiBcIkVvc2lub3BoaWxzIFsjL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNDU0NC0zXCI6IFwiSGVtYXRvY3JpdCBbVm9sdW1lIEZyYWN0aW9uXSBvZiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI1NzAyMS04XCI6IFwiQ0JDIFcgQXV0byBEaWZmZXJlbnRpYWwgcGFuZWwgLSBCbG9vZFwiLFxuICBcIjI0MzE3LTBcIjogXCJIZW1vZ3JhbSBhbmQgcGxhdGVsZXRzIFdPIGRpZmZlcmVudGlhbCBwYW5lbCAtIEJsb29kXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDaGVtaXN0cnkgLyBsaXZlciAvIHJlbmFsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE5MjAtOFwiOiBcIkFzcGFydGF0ZSBhbWlub3RyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzQyLTZcIjogXCJBbGFuaW5lIGFtaW5vdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIxNjAtMFwiOiBcIkNyZWF0aW5pbmUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMTYxLThcIjogXCJDcmVhdGluaW5lIFtNYXNzL3ZvbHVtZV0gaW4gVXJpbmVcIixcbiAgXCIzMzkxNC0zXCI6XG4gICAgXCJHbG9tZXJ1bGFyIGZpbHRyYXRpb24gcmF0ZSBbVm9sdW1lIFJhdGUvQXJlYV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IENyZWF0aW5pbmUtYmFzZWQgZm9ybXVsYSAoTURSRCkvMS43MyBzcSBNXCIsXG4gIFwiMzA5NC0wXCI6IFwiVXJlYSBuaXRyb2dlbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMwODQtMVwiOiBcIlVyYXRlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjk1MS0yXCI6IFwiU29kaXVtIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI4MjMtM1wiOiBcIlBvdGFzc2l1bSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTc1LTJcIjogXCJCaWxpcnViaW4udG90YWwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTY4LTdcIjogXCJCaWxpcnViaW4uZGlyZWN0IFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc1MS03XCI6IFwiQWxidW1pbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI1MzItMFwiOiBcIkxhY3RhdGUgZGVoeWRyb2dlbmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiNjc2OC02XCI6IFwiQWxrYWxpbmUgcGhvc3BoYXRhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIzMjQtMlwiOiBcIkdhbW1hIGdsdXRhbXlsIHRyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzg2MS02XCI6IFwiQ2FsY2l1bSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgTGlwaWQgcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMjA5My0zXCI6IFwiQ2hvbGVzdGVyb2wgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyNTcxLThcIjogXCJUcmlnbHljZXJpZGUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMDg1LTlcIjogXCJDaG9sZXN0ZXJvbCBpbiBIREwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxMzQ1Ny03XCI6IFwiQ2hvbGVzdGVyb2wgaW4gTERMIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IGNhbGN1bGF0aW9uXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIC8gaG9ybW9uZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMzAxNi0zXCI6IFwiVGh5cm90cm9waW4gW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzAyNC03XCI6IFwiVGh5cm94aW5lIChUNCkgZnJlZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE0OTIwLTNcIjogXCJUaHlyb3hpbmUgKFQ0KSBmcmVlIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI5ODYtOFwiOiBcIlRlc3Rvc3Rlcm9uZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjgzMDk4LTRcIjogXCJGb2xsaXRyb3BpbiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgXCI4MzA5Ni04XCI6IFwiRXN0cmFkaW9sIChFMikgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRpYWMgLyBpbmZsYW1tYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTA4MzktOVwiOiBcIlRyb3BvbmluIEkuY2FyZGlhYyBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMzNzYyLTZcIjogXCJOYXRyaXVyZXRpYyBwZXB0aWRlLkIgcHJvaG9ybW9uZSBOLVRlcm1pbmFsIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk4OC01XCI6IFwiQyByZWFjdGl2ZSBwcm90ZWluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzM5NTktOFwiOiBcIlByb2NhbGNpdG9uaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEhlcGF0aXRpcyAvIHNlcm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjUxOTUtM1wiOiBcIkhlcGF0aXRpcyBCIHZpcnVzIHN1cmZhY2UgQWcgW1ByZXNlbmNlXSBpbiBTZXJ1bVwiLFxuICBcIjUxOTYtMVwiOiBcIkhlcGF0aXRpcyBCIHZpcnVzIHN1cmZhY2UgQWcgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW1cIixcbiAgXCIxNjEyOC0xXCI6IFwiSGVwYXRpdGlzIEMgdmlydXMgQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bVwiLFxuICBcIjEzOTU1LTBcIjogXCJIZXBhdGl0aXMgQyB2aXJ1cyBBYiBbUHJlc2VuY2VdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVmlyb2xvZ3kgKGF1ZGl0IDIwMjYtMDUtMTkpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjc4NTMtNVwiOiBcIkN5dG9tZWdhbG92aXJ1cyBJZ00gQWIgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBUdW1vciBtYXJrZXJzIC8gcHJvdGVpbnMgKGF1ZGl0IDIwMjYtMDUtMTkpIFx1MjUwMFx1MjUwMFxuICBcIjE5NTItMVwiOiBcIkJldGEtMi1NaWNyb2dsb2J1bGluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDb2FndWxhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI2MzAxLTZcIjogXCJJTlIgaW4gUGxhdGVsZXQgcG9vciBwbGFzbWEgYnkgQ29hZ3VsYXRpb24gYXNzYXlcIixcbiAgXCIxNDk3OS05XCI6IFwiYVBUVCBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYSBieSBDb2FndWxhdGlvbiBhc3NheVwiLFxuICBcIjMwMjQwLTZcIjogXCJGaWJyaW4gRC1kaW1lciBbTWFzcy92b2x1bWVdIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXRhbCBzaWducyAoSUhLRTM0MDIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjgzMDItMlwiOiBcIkJvZHkgaGVpZ2h0XCIsXG4gIFwiMjk0NjMtN1wiOiBcIkJvZHkgd2VpZ2h0XCIsXG4gIFwiMzkxNTYtNVwiOiBcIkJvZHkgbWFzcyBpbmRleCAoQk1JKSBbUmF0aW9dXCIsXG4gIFwiODI4MC0wXCI6IFwiV2Fpc3QgQ2lyY3VtZmVyZW5jZSBhdCB1bWJpbGljdXMgYnkgVGFwZSBtZWFzdXJlXCIsXG4gIFwiODQ4MC02XCI6IFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NDYyLTRcIjogXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NTM1NC05XCI6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWwgd2l0aCBhbGwgY2hpbGRyZW4gb3B0aW9uYWxcIixcbn07XG4iLCAiLyoqXG4gKiBQdXJlIHBhcnNpbmcgaGVscGVycyBcdTIwMTQgcmVmZXJlbmNlIHJhbmdlLCBxdWFudGl0eSwgVUNVTSB1bml0IG5vcm1hbGlzYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19wYXJzZXJzLnB5YC4gU2VsZi1jb250YWluZWQ6IG5vIGRlcGVuZGVuY2llc1xuICogb24gb3RoZXIgb2JzZXJ2YXRpb24gbW9kdWxlIHBpZWNlcy5cbiAqXG4gKiBQdWJsaWMgQVBJOlxuICogICB0b1VjdW0odW5pdCkgICAgICAgICAgICAgICAgICBcdTIxOTIgY2Fub25pY2FsIFVDVU0gdW5pdCBzdHJpbmcgKG9yIG51bGwpXG4gKiAgIHBhcnNlUmFuZ2VNdWx0aShyYXcsIHVuaXQpICAgIFx1MjE5MiBsaXN0IG9mIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cmllc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvbmUgcGVyIHNleCB3aGVuIHNleC1zdHJhdGlmaWVkKVxuICogICBwYXJzZVJhbmdlKHJhdywgdW5pdCkgICAgICAgICBcdTIxOTIgc2luZ2xlIHJlZmVyZW5jZVJhbmdlIGVudHJ5XG4gKiAgIHRyeVBhcnNlUXVhbnRpdHkocmF3LCB1bml0KSAgIFx1MjE5MiBGSElSIFF1YW50aXR5IGRpY3Qgb3IgbnVsbFxuICovXG5cbmNvbnN0IFVDVU1fU1lTVEVNID0gXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCI7XG5cbi8vIEZISVIgUjQgUXVhbnRpdHkuY29tcGFyYXRvciBhbGxvd2VkIHZhbHVlcy4gTm9ybWFsaXNlIGZ1bGwtd2lkdGggQ0pLXG4vLyBcdUZGMUUgXHVGRjFDIFx1MjI2NyBcdTIyNjYgKyBBU0NJSSB2YXJpYW50cyBzbyBcIlx1RkYxRSA0MC4wXCIgc3RpbGwgcGFyc2VzIGFzIGEgcmVhbCBudW1iZXJcbi8vIGluc3RlYWQgb2YgZmFsbGluZyB0aHJvdWdoIHRvIHZhbHVlU3RyaW5nICh3aGljaCBsb3NlcyB0aGUgdW5pdCkuXG5jb25zdCBGVUxMV0lEVEhfT1BTOiBSZWFkb25seUFycmF5PFtzdHJpbmcsIHN0cmluZ10+ID0gW1xuICBbXCJcdUZGMUVcIiwgXCI+XCJdLFxuICBbXCJcdUZGMUNcIiwgXCI8XCJdLFxuICBbXCJcdTIyNjdcIiwgXCI+PVwiXSxcbiAgW1wiXHUyMjY2XCIsIFwiPD1cIl0sXG4gIFtcIlx1MjI2NVwiLCBcIj49XCJdLFxuICBbXCJcdTIyNjRcIiwgXCI8PVwiXSxcbl07XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZUZ1bGx3aWR0aChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgb3V0ID0gcztcbiAgZm9yIChjb25zdCBbZnJvbSwgdG9dIG9mIEZVTExXSURUSF9PUFMpIHtcbiAgICBpZiAob3V0LmluY2x1ZGVzKGZyb20pKSB7XG4gICAgICBvdXQgPSBvdXQuc3BsaXQoZnJvbSkuam9pbih0byk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmNvbnN0IENPTVBBUkFUT1JfUkUgPSAvXlxccyooPD18Pj18PHw+KVxccyooLispJC87XG5cbi8vIFJlZmVyZW5jZS1yYW5nZSBwYXJzaW5nLiBOSEkgc2hpcHMgdGhlIHJhbmdlIGFzIHBsYWluIHRleHQgbGlrZVxuLy8gXCJbMy44OV1bMjYuOF1cIiwgXCJbNDBdW11cIiwgXCJbTmVnYXRpdmVdXCIgb3IgXCJBTSA4OjAwIDYuMi0xOS40XCIuXG5jb25zdCBSUl9MT1dISUdIX0JSQUNLRVRTID0gL15cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqJC87XG5jb25zdCBSUl9EQVNIX1JBTkdFID0gLygtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlstflx1MjAxM11cXHMqKC0/XFxkKyg/OlxcLlxcZCspPykvO1xuY29uc3QgUlJfQ09NUEFSQVRPUiA9IC9eXFxzKig8PXw+PXw8fD4pXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKiQvO1xuLy8gU2V4LXN0cmF0aWZpZWQgYnJhY2tldGVkIHJhbmdlLCBlLmcuIFwiXHU3NTM3OjEzLjcgXHU1OTczOjExLjFcIiBcdTIwMTQgdXNlZCBieSBzb21lXG4vLyBob3NwaXRhbHMgZm9yIGhhZW1hdG9sb2d5IChIYiwgUkJDLCBIY3QpLiBQdWxscyBvdXQgKHNleCwgdmFsdWUpIHBhaXJzLlxuLy8gVG9sZXJhdGVzIG9wdGlvbmFsIGNvbXBhcmF0b3IgKFx1MjI2Ny9cdTIyNjYvPi88KSBiZWZvcmUgdGhlIG51bWJlci5cbmNvbnN0IFJSX1NFWF9OVU1fRyA9IC8oXHU3NTM3XHU2MDI3fFx1NTk3M1x1NjAyN3xcdTc1Mzd8XHU1OTczfE18RilcXHMqWzpcdUZGMUFdP1xccyooPzpbPD5cdTIyNjdcdTIyNjZdPT8pP1xccyooLT9cXGQrKD86XFwuXFxkKyk/KS9nO1xuY29uc3QgUlJfU0lOR0xFX0JSQUNLRVQgPSAvXlxccypcXFtcXHMqKC4rPylcXHMqXFxdXFxzKiQvO1xuY29uc3QgUlJfUVVBTElUQVRJVkVfUEFSRU4gPVxuICAvXlxccyooTm9ybWFsfFx1NkI2M1x1NUUzOHxOb25yZWFjdGl2ZXxOb24tcmVhY3RpdmUpXFxzKlxcKFxccyooLT9cXGQrKD86XFwuXFxkKyk/KVxccypcXClcXHMqJC9pO1xuXG5jb25zdCBTRVhfVE9fRkhJUjogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIFx1NzUzN1x1NjAyNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIFx1NzUzNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIE06IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBcdTU5NzNcdTYwMjc6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbiAgXHU1OTczOiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG4gIEY6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbn07XG5cbi8vIFB1YmxpYyB0eXBlcyBcdTIwMTQgRkhJUiBRdWFudGl0eSAvIHJlZmVyZW5jZVJhbmdlIHNoYXBlcyB1c2VkIGRvd25zdHJlYW0uXG5leHBvcnQgaW50ZXJmYWNlIFF1YW50aXR5IHtcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdD86IHN0cmluZztcbiAgc3lzdGVtPzogc3RyaW5nO1xuICBjb2RlPzogc3RyaW5nO1xuICBjb21wYXJhdG9yPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlRW50cnkge1xuICB0ZXh0OiBzdHJpbmc7XG4gIGxvdz86IFF1YW50aXR5O1xuICBoaWdoPzogUXVhbnRpdHk7XG4gIGFwcGxpZXNUbz86IEFycmF5PHtcbiAgICBjb2Rpbmc6IEFycmF5PHsgc3lzdGVtOiBzdHJpbmc7IGNvZGU6IHN0cmluZzsgZGlzcGxheTogc3RyaW5nIH0+O1xuICAgIHRleHQ6IHN0cmluZztcbiAgfT47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVQ1VNIG5vcm1hbGlzYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTkhJIGxhYnMgcmVwb3J0IHVuaXRzIGluIGEgbWl4IG9mIFVDVU0tY2xlYW4gc3RyaW5ncyAoJ21nL2RMJyksXG4gKiBUYWl3YW4tc3R5bGUgZXF1aXZhbGVudHMgKCdtRXEvTCcgdnMgVUNVTSAnbWVxL0wnKSwgZnVsbC13aWR0aCBwdW5jdHVhdGlvblxuICogKCdcdUZGMDUnIHZzICclJyksIGFuZCBwbGFjZWhvbGRlciB0ZXh0ICgnXHU3MTIxJykuIFRoZSBUV05ISUZISVIgdmFsaWRhdG9yXG4gKiByZWplY3RzIGV2ZXJ5dGhpbmcgZXhjZXB0IGNhbm9uaWNhbCBVQ1VNIGluIFF1YW50aXR5LmNvZGUsIHNvIHdlXG4gKiBub3JtYWxpc2UuIGBudWxsYCBtZWFucyBcIm9taXQgUXVhbnRpdHkuY29kZSBlbnRpcmVseVwiLlxuICovXG5jb25zdCBVQ1VNX09WRVJSSURFUzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVsbD4gPSB7XG4gIC8vIEZ1bGx3aWR0aCBcdTIxOTIgQVNDSUlcbiAgXCJcdUZGMDVcIjogXCIlXCIsXG4gIC8vIENhc2Utc2Vuc2l0aXZlIFVDVU0gKEVxIGlzICdlcScsIG5vdCAnRXEnKVxuICBcIm1FcS9MXCI6IFwibWVxL0xcIixcbiAgXCJtZXEvbFwiOiBcIm1lcS9MXCIsXG4gIC8vIEJQIHByb2ZpbGUgZml4ZWQtdmFsdWU6IG1tW0hnXSBub3QgbW1IZ1xuICBtbUhnOiBcIm1tW0hnXVwiLFxuICBNTUhHOiBcIm1tW0hnXVwiLFxuICAvLyBDb21tb24gQ2hpbmVzZSAnbm8gdW5pdCcgcGxhY2Vob2xkZXJzIFx1MjE5MiBkcm9wIFVDVU0gY29kZVxuICBcdTcxMjE6IG51bGwsXG4gIFwiXCI6IG51bGwsXG4gIFwiXHUyMDE0XCI6IG51bGwsXG4gIFwiLVwiOiBudWxsLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvVWN1bSh1bml0OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdW5pdCkgcmV0dXJuIG51bGw7XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoVUNVTV9PVkVSUklERVMsIHVuaXQpKSB7XG4gICAgcmV0dXJuIFVDVU1fT1ZFUlJJREVTW3VuaXRdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIHVuaXQ7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBRdWFudGl0eSBidWlsZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBtYWtlUXVhbnRpdHkodmFsdWU6IG51bWJlciwgdW5pdDogc3RyaW5nKTogUXVhbnRpdHkge1xuICBjb25zdCBxOiBRdWFudGl0eSA9IHsgdmFsdWUgfTtcbiAgaWYgKHVuaXQpIHtcbiAgICBxLnVuaXQgPSB1bml0O1xuICAgIHEuc3lzdGVtID0gVUNVTV9TWVNURU07XG4gICAgcS5jb2RlID0gdW5pdDtcbiAgfVxuICByZXR1cm4gcTtcbn1cblxuZnVuY3Rpb24gdHJ5UGFyc2VGbG9hdChzOiBzdHJpbmcpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHMgPT09IFwiXCIgfHwgcyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgLy8gTWlycm9yIFB5dGhvbidzIGZsb2F0KCkgXHUyMDE0IGFsbG93IGxlYWRpbmcvdHJhaWxpbmcgd2hpdGVzcGFjZSxcbiAgLy8gb3B0aW9uYWwgc2lnbiwgZGVjaW1hbC4gUmVqZWN0IGlmIE5hTiBPUiBpZiBhbnkgbm9uLW51bWVyaWMgcmVzaWR1YWxcbiAgLy8gKE51bWJlcihcIjEyYWJjXCIpIHJldHVybnMgTmFOLCBPSzsgXCIxMiAgYWJjXCIgYWxzbyBOYU4sIE9LKS5cbiAgY29uc3QgdHJpbW1lZCA9IHMudHJpbSgpO1xuICBpZiAodHJpbW1lZCA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG4gPSBOdW1iZXIodHJpbW1lZCk7XG4gIGlmIChOdW1iZXIuaXNOYU4obikpIHJldHVybiBudWxsO1xuICByZXR1cm4gbjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHBhcnNlUmFuZ2VNdWx0aSAvIHBhcnNlUmFuZ2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTGlzdCB2YXJpYW50IG9mIHBhcnNlUmFuZ2U6IGVtaXRzIG9uZSBlbnRyeSBwZXIgc2V4IHdoZW4gdGhlIHJhbmdlIGlzXG4gKiBzZXgtc3RyYXRpZmllZCAoXCJbXHU3NTM3OjEzLjcgXHU1OTczOjExLjFdW1x1NzUzNzoxNy4wIFx1NTk3MzoxNS4wXVwiKSwgb3RoZXJ3aXNlIGFcbiAqIHNpbmdsZS1lbGVtZW50IGxpc3QuIEVhY2ggZW50cnkgdGFnZ2VkIHdpdGggYXBwbGllc1RvIHNvIGRvd25zdHJlYW1cbiAqIGNvZGUgY2FuIHBpY2sgdGhlIHJpZ2h0IG9uZSBmb3IgdGhlIHBhdGllbnQncyBzZXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlTXVsdGkocmF3UmFuZ2U6IHN0cmluZywgdW5pdDogc3RyaW5nKTogUmFuZ2VFbnRyeVtdIHtcbiAgY29uc3QgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aCgocmF3UmFuZ2UgfHwgXCJcIikudHJpbSgpKTtcbiAgaWYgKCFzKSByZXR1cm4gW107XG5cbiAgY29uc3QgbG93QnlTZXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaGlnaEJ5U2V4OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGxldCB1c2VkTXVsdGkgPSBmYWxzZTtcblxuICBjb25zdCBtID0gcy5tYXRjaChSUl9MT1dISUdIX0JSQUNLRVRTKTtcbiAgaWYgKG0pIHtcbiAgICBjb25zdCBsb3dCbG9iID0gbVsxXSA/PyBcIlwiO1xuICAgIGNvbnN0IGhpZ2hCbG9iID0gbVsyXSA/PyBcIlwiO1xuICAgIGZvciAoY29uc3Qgc20gb2YgbG93QmxvYi5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICBpZiAoc21bMV0gJiYgc21bMl0pIGxvd0J5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNtIG9mIGhpZ2hCbG9iLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgIGlmIChzbVsxXSAmJiBzbVsyXSkgaGlnaEJ5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gU2luZ2xlLWJyYWNrZXQ6IGVhY2ggcGVyLXNleCB2YWx1ZSdzIGNvbXBhcmF0b3IgZGVjaWRlcyBsb3cgdnMgaGlnaC5cbiAgICBjb25zdCBzaW5nbGUgPSBzLm1hdGNoKFJSX1NJTkdMRV9CUkFDS0VUKTtcbiAgICBpZiAoc2luZ2xlKSB7XG4gICAgICBjb25zdCBpbm5lciA9IHNpbmdsZVsxXSA/PyBcIlwiO1xuICAgICAgZm9yIChjb25zdCBzbSBvZiBpbm5lci5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICAgIGNvbnN0IHNleEtleSA9IHNtWzFdID8/IFwiXCI7XG4gICAgICAgIGNvbnN0IHZhbFN0ciA9IHNtWzJdID8/IFwiXCI7XG4gICAgICAgIC8vIEZpbmQgdGhlIGNvbXBhcmF0b3IgaW1tZWRpYXRlbHkgcHJlY2VkaW5nIHRoaXMgbnVtYmVyLlxuICAgICAgICAvLyBNaXJyb3IgdGhlIFB5dGhvbjogcmVidWlsZCBhIHBlci1zZXgta2V5IHNlYXJjaC5cbiAgICAgICAgY29uc3QgcGF0ID0gbmV3IFJlZ0V4cChgJHtlc2NhcGVSZWdleChzZXhLZXkpfVxcXFxzKls6XHVGRjFBXT9cXFxccyooWzw+XHUyMjY3XHUyMjY2XT0/KT9cXFxccyotP1xcXFxkYCk7XG4gICAgICAgIGNvbnN0IGNtID0gaW5uZXIubWF0Y2gocGF0KTtcbiAgICAgICAgY29uc3Qgb3AgPSBjbT8uWzFdID8/IFwiXCI7XG4gICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgIGxvd0J5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH0gZWxzZSBpZiAob3AgPT09IFwiPFwiIHx8IG9wID09PSBcIjw9XCIpIHtcbiAgICAgICAgICBoaWdoQnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb3dCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gICAgfVxuICB9XG5cbiAgaWYgKHVzZWRNdWx0aSkge1xuICAgIGNvbnN0IGVudHJpZXM6IFJhbmdlRW50cnlbXSA9IFtdO1xuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgdW5pb24gb2Yga2V5cyBhY3R1YWxseSBzZWVuIFx1MjAxNCBwcmVzZXJ2ZSBpbnNlcnRpb24gb3JkZXIuXG4gICAgY29uc3QgYWxsU2V4S2V5czogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLk9iamVjdC5rZXlzKGxvd0J5U2V4KSwgLi4uT2JqZWN0LmtleXMoaGlnaEJ5U2V4KV0pIHtcbiAgICAgIGlmICghYWxsU2V4S2V5cy5pbmNsdWRlcyhrKSkgYWxsU2V4S2V5cy5wdXNoKGspO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNleEtleSBvZiBhbGxTZXhLZXlzKSB7XG4gICAgICBjb25zdCBtYXBwaW5nID0gU0VYX1RPX0ZISVJbc2V4S2V5XTtcbiAgICAgIGlmICghbWFwcGluZykgY29udGludWU7XG4gICAgICBjb25zdCBbZmhpckNvZGUsIGZoaXJEaXNwbGF5XSA9IG1hcHBpbmc7XG4gICAgICBjb25zdCBlbnRyeTogUmFuZ2VFbnRyeSA9IHtcbiAgICAgICAgdGV4dDogcmF3UmFuZ2UsXG4gICAgICAgIGFwcGxpZXNUbzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9obDcub3JnL2ZoaXIvYWRtaW5pc3RyYXRpdmUtZ2VuZGVyXCIsXG4gICAgICAgICAgICAgICAgY29kZTogZmhpckNvZGUsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmhpckRpc3BsYXksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgdGV4dDogZmhpckRpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBpZiAoc2V4S2V5IGluIGxvd0J5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGxvd0J5U2V4W3NleEtleV0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICAgIGlmIChzZXhLZXkgaW4gaGlnaEJ5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGhpZ2hCeVNleFtzZXhLZXldISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgICAgZW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICB9XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gRGUtZHVwIGJ5IEZISVIgc2V4IGNvZGUgaW4gY2FzZSBpbnB1dCBoYXMgYm90aCBcdTc1MzcgYW5kIFx1NzUzN1x1NjAyNy5cbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgIGNvbnN0IG91dDogUmFuZ2VFbnRyeVtdID0gW107XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgZW50cmllcykge1xuICAgICAgICBjb25zdCBjID0gZS5hcHBsaWVzVG8/LlswXT8uY29kaW5nWzBdPy5jb2RlO1xuICAgICAgICBpZiAoIWMgfHwgc2Vlbi5oYXMoYykpIGNvbnRpbnVlO1xuICAgICAgICBzZWVuLmFkZChjKTtcbiAgICAgICAgb3V0LnB1c2goZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uZSA9IHBhcnNlUmFuZ2UocmF3UmFuZ2UsIHVuaXQpO1xuICByZXR1cm4gb25lID8gW29uZV0gOiBbXTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcmVmZXJlbmNlLXJhbmdlIHRleHQgaW50byBhIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cnkuXG4gKlxuICogU3RyYXRlZ3kgaW4gb3JkZXI6XG4gKiAgIDEuIFwiW2xvd11baGlnaF1cIiBicmFja2V0ZWQgZm9ybWF0IFx1MjAxNCBOSEkncyBjYW5vbmljYWwgc2hhcGUuXG4gKiAgIDIuIFwiMy44OS0yNi44XCIgLyBcIjMuODl+MjYuOFwiIGRhc2ggcmFuZ2UuXG4gKiAgIDMuIFwiPiA0MFwiIC8gXCI8IDAuNVwiIHNpbmdsZS1zaWRlZC5cbiAqICAgNC4gUXVhbGl0YXRpdmUgKFwiTmVnYXRpdmVcIiwgXCJBTSA4OjAwIDYuMi0xOS40XCIpIFx1MjAxNCB0ZXh0LW9ubHkuXG4gKlxuICogU2V4LXN0cmF0aWZpZWQgc2hhcGVzIGdvIHRocm91Z2ggcGFyc2VSYW5nZU11bHRpLiBSZXR1cm5zIG51bGwgb25seVxuICogZm9yIGVtcHR5IGlucHV0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSYW5nZShyYXdSYW5nZTogc3RyaW5nLCB1bml0OiBzdHJpbmcpOiBSYW5nZUVudHJ5IHwgbnVsbCB7XG4gIGNvbnN0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoKHJhd1JhbmdlIHx8IFwiXCIpLnRyaW0oKSk7XG4gIGlmICghcykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGVudHJ5OiBSYW5nZUVudHJ5ID0geyB0ZXh0OiByYXdSYW5nZSB9O1xuXG4gIGNvbnN0IG0gPSBzLm1hdGNoKFJSX0xPV0hJR0hfQlJBQ0tFVFMpO1xuICBpZiAobSkge1xuICAgIGNvbnN0IGxvID0gKG1bMV0gPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IGhpID0gKG1bMl0gPz8gXCJcIikudHJpbSgpO1xuICAgIGZvciAoY29uc3QgW3NpZGUsIHNpZGVWYWxdIG9mIFtcbiAgICAgIFtcImxvd1wiLCBsb10sXG4gICAgICBbXCJoaWdoXCIsIGhpXSxcbiAgICBdIGFzIGNvbnN0KSB7XG4gICAgICBpZiAoIXNpZGVWYWwgfHwgc2lkZVZhbCA9PT0gXCJcdTcxMjFcIiB8fCBzaWRlVmFsID09PSBcIlx1N0E3QVx1NzY3RFwiKSBjb250aW51ZTtcblxuICAgICAgLy8gMS4gUGxhaW4gZmxvYXRcbiAgICAgIGNvbnN0IGFzRmxvYXQgPSB0cnlQYXJzZUZsb2F0KHNpZGVWYWwpO1xuICAgICAgaWYgKGFzRmxvYXQgIT09IG51bGwpIHtcbiAgICAgICAgZW50cnlbc2lkZV0gPSBtYWtlUXVhbnRpdHkoYXNGbG9hdCwgdW5pdCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyAyLiBEYXNoIHJhbmdlIFx1MjAxNCBtZWFuaW5nZnVsIG9ubHkgZm9yIGBsb3dgIHNsb3Q7IHNwbGl0cyBpbnRvIGxvdytoaWdoLlxuICAgICAgY29uc3QgZG0gPSBzaWRlVmFsLm1hdGNoKFJSX0RBU0hfUkFOR0UpO1xuICAgICAgaWYgKGRtICYmIHNpZGUgPT09IFwibG93XCIgJiYgZW50cnkuaGlnaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkbVsxXSEpO1xuICAgICAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZG1bMl0hKTtcbiAgICAgICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYxLCB1bml0KTtcbiAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYyLCB1bml0KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAzLiBDb21wYXJhdG9yIChcdTIyNjc2MCwgPD0wLjA0IGV0Yy4pXG4gICAgICBjb25zdCBjbSA9IHNpZGVWYWwubWF0Y2goUlJfQ09NUEFSQVRPUik7XG4gICAgICBpZiAoY20pIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21bMl0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBvcCA9IGNtWzFdO1xuICAgICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA0LiBcIk5vcm1hbCAoIFggKVwiIC8gXCJOb25yZWFjdGl2ZSAoIFggKVwiIFx1MjAxNCBYIGlzIHRoZSBjdXRvZmYgKGhpZ2ggYm91bmQpLlxuICAgICAgY29uc3QgcW0gPSBzaWRlVmFsLm1hdGNoKFJSX1FVQUxJVEFUSVZFX1BBUkVOKTtcbiAgICAgIGlmIChxbSkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChxbVsyXSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgY29uc3QgZGFzaE1hdGNoID0gcy5tYXRjaChSUl9EQVNIX1JBTkdFKTtcbiAgaWYgKGRhc2hNYXRjaCkge1xuICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkYXNoTWF0Y2hbMV0hKTtcbiAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZGFzaE1hdGNoWzJdISk7XG4gICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodjEsIHVuaXQpO1xuICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2MiwgdW5pdCk7XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIGNvbnN0IGNtcE1hdGNoID0gcy5tYXRjaChSUl9DT01QQVJBVE9SKTtcbiAgaWYgKGNtcE1hdGNoKSB7XG4gICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21wTWF0Y2hbMl0hKTtcbiAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgb3AgPSBjbXBNYXRjaFsxXTtcbiAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICAvLyBGYWxsIHRocm91Z2g6IHF1YWxpdGF0aXZlIG9yIGNvbXBsZXggXHUyMDE0IHRleHQtb25seSBpcyBGSElSLWNvcnJlY3QuXG4gIHJldHVybiBlbnRyeTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHRyeVBhcnNlUXVhbnRpdHkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogUGFyc2UgXCI+IDQwLjBcIiAvIFwiPDAuMDEwXCIgLyBcIjEsMjM0LjVcIiBcdTIxOTIgRkhJUiBRdWFudGl0eSB3aXRoIGNvbXBhcmF0b3IuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiB0aGUgcmVzaWR1YWwgYWZ0ZXIgc3RyaXBwaW5nIGEgY29tcGFyYXRvciBzdGlsbFxuICogaXNuJ3QgbnVtZXJpYyBcdTIwMTQgY2FsbGVyIGZhbGxzIGJhY2sgdG8gdmFsdWVTdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cnlQYXJzZVF1YW50aXR5KFxuICByYXdWYWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgdW5pdDogc3RyaW5nLFxuKTogUXVhbnRpdHkgfCBudWxsIHtcbiAgaWYgKHJhd1ZhbHVlID09PSBudWxsIHx8IHJhd1ZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aChTdHJpbmcocmF3VmFsdWUpLnRyaW0oKSk7XG4gIGxldCBjb21wYXJhdG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3QgY20gPSBzLm1hdGNoKENPTVBBUkFUT1JfUkUpO1xuICBpZiAoY20pIHtcbiAgICBjb21wYXJhdG9yID0gY21bMV0gPz8gbnVsbDtcbiAgICBzID0gKGNtWzJdID8/IFwiXCIpLnRyaW0oKTtcbiAgfVxuICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChzLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdWN1bUNvZGUgPSB0b1VjdW0odW5pdCk7XG4gIGNvbnN0IHF0eTogUXVhbnRpdHkgPSB7XG4gICAgdmFsdWU6IHYsXG4gICAgc3lzdGVtOiBVQ1VNX1NZU1RFTSxcbiAgfTtcbiAgLy8gUXVhbnRpdHkudW5pdCAoaHVtYW4tcmVhZGFibGUpIGtlZXBzIHRoZSBvcmlnaW5hbCBOSEkgbGFiZWwgc28gdXNlcnNcbiAgLy8gc3RpbGwgc2VlICdcdUZGMDUnIG9yICdtRXEvTCcgcmF3LiBRdWFudGl0eS5jb2RlIGlzIHN0cmljdCBVQ1VNIG1hY2hpbmVcbiAgLy8gY29kZS4gRHJvcCB1bml0IGRpc3BsYXkgd2hlbiBlbXB0eSBzbyB3ZSBkb24ndCBlbWl0IFwidW5pdFwiOiBcIlwiLlxuICBpZiAodW5pdCkge1xuICAgIHF0eS51bml0ID0gdW5pdDtcbiAgfVxuICBpZiAodWN1bUNvZGUgIT09IG51bGwpIHtcbiAgICBxdHkuY29kZSA9IHVjdW1Db2RlO1xuICB9XG4gIGlmIChjb21wYXJhdG9yKSB7XG4gICAgcXR5LmNvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICB9XG4gIHJldHVybiBxdHk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8vIENoZWNrIHdoZXRoZXIgYSBzaW5nbGUgTE9JTkNfTUFQIGtleSBtYXRjaGVzIHRoZSBsYWIncyBjb21iaW5lZFxuLy8gKGNvZGUgKyBkaXNwbGF5KSBzdHJpbmcuIFR3byBydWxlczpcbi8vXG4vLyAxLiBBU0NJSSBrZXlzOiBgXFxiPGtleT5cXGJgIFx1MjAxNCB3b3JkIGJvdW5kYXJpZXMgb24gQk9USCBzaWRlcy4gVGhlXG4vLyAgICBuby10cmFpbGluZy1ib3VuZGFyeSBzZW1hbnRpYyBvZiB0aGUgb2xkZXIgYFxcYjxrZXk+YCBtYXRjaGVyXG4vLyAgICBjYXVzZWQgc2hvcnQga2V5cyBsaWtlIFwiaGJcIiAoSGVtb2dsb2JpbikgdG8gaW5jb3JyZWN0bHkgbWF0Y2hcbi8vICAgIGxvbmdlciB0ZXJtcyBsaWtlIFwiaGJzYWdcIiAoSEJzQWcpIGFuZCBcInBob3NwaGF0ZVwiIChtYXRjaGVkIGJ5XG4vLyAgICBcInBoXCIpLiBSZXF1aXJpbmcgYW4gZW5kIGJvdW5kYXJ5IG1lYW5zIFwiaGJcIiBvbmx5IG1hdGNoZXMgd2hlblxuLy8gICAgaXQgc3RhbmRzIGFzIGl0cyBvd24gd29yZC5cbi8vXG4vLyAyLiBDSksgLyBub24tQVNDSUkga2V5czogcGxhaW4gc3Vic3RyaW5nIGluY2x1ZGVzKCkuIFxcYiBkb2Vzbid0XG4vLyAgICBzZW1hbnRpY2FsbHkgd29yayBmb3IgQ0pLIChubyB3b3JkLWNoYXJhY3RlciBjbGFzcyBjb25jZXB0KS5cbmZ1bmN0aW9uIF9rZXl3b3JkTWF0Y2hlcyhrZXk6IHN0cmluZywgY29tYmluZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBrID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gIGlmIChpc0FzY2lpT25seShrZXkpKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrKX1cXFxcYmApLnRlc3QoY29tYmluZWQpO1xuICB9XG4gIHJldHVybiBjb21iaW5lZC5pbmNsdWRlcyhrKTtcbn1cblxuLy8gUGljayB0aGUgTE9OR0VTVCBtYXRjaGluZyBrZXkgZnJvbSB0aGUgdGFibGUsIG5vdCB0aGUgZmlyc3QuIEF2b2lkc1xuLy8gdGhlIHNhbWUgYnVnIGZhbWlseSBmcm9tIGEgc2Vjb25kIGFuZ2xlOiBoeXBoZW5hdGVkIGtleXMgbGlrZVxuLy8gXCJsZGwtY2hvbGVzdGVyb2xcIiBzaGFyZSBhIGBcXGIuLi5cXGJgIGJvdW5kYXJ5IGF0IHRoZSBoeXBoZW4sIHNvIFwibGRsXCJcbi8vICgzIGNoYXJzKSBhbHNvIG1hdGNoZXMgYSBcImxkbC1jaG9sZXN0ZXJvbFwiIHN0cmluZy4gTG9uZ2VzdC1tYXRjaFxuLy8gbWFrZXMgdGhlIG1vcmUgc3BlY2lmaWMga2V5IHdpbiByZWdhcmRsZXNzIG9mIGluc2VydGlvbiBvcmRlciwgc29cbi8vIHRoZSBicml0dGxlIFwibG9uZyBtdXN0IGFwcGVhciBiZWZvcmUgc2hvcnRcIiBjb21tZW50cyBzY2F0dGVyZWRcbi8vIHRocm91Z2ggTE9JTkNfTUFQIGJlY29tZSB1bm5lY2Vzc2FyeS5cbmZ1bmN0aW9uIF9maW5kTG9uZ2VzdE1hdGNoKFxuICBjb21iaW5lZDogc3RyaW5nLFxuICB0YWJsZTogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbik6IHN0cmluZyB8IG51bGwge1xuICBsZXQgYmVzdExvaW5jOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGJlc3RLZXlMZW4gPSAwO1xuICBmb3IgKGNvbnN0IFtrZXksIGxvaW5jXSBvZiBPYmplY3QuZW50cmllcyh0YWJsZSkpIHtcbiAgICBpZiAoa2V5Lmxlbmd0aCA+IGJlc3RLZXlMZW4gJiYgX2tleXdvcmRNYXRjaGVzKGtleSwgY29tYmluZWQpKSB7XG4gICAgICBiZXN0TG9pbmMgPSBsb2luYztcbiAgICAgIGJlc3RLZXlMZW4gPSBrZXkubGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYmVzdExvaW5jO1xufVxuXG4vKipcbiAqIFJldHVybiBwcmltYXJ5IExPSU5DIGZvciB0aGlzIGxhYi4gUGFuZWwtYXdhcmUgbG9va3VwOlxuICogICBBLiBTaW5nbGUtdGVzdCBOSEkgY29kZSBcdTIxOTIgdXNlIE5ISV9UT19MT0lOQyBkaXJlY3RseS5cbiAqICAgQi4gUGFuZWwgY29kZSBPUiB1bmtub3duIGNvZGUgXHUyMTkyIHdhbGsgTE9JTkNfTUFQIGJ5IGRpc3BsYXkga2V5d29yZFxuICogICAgICAobG9uZ2VzdC1rZXkgbWF0Y2ggd2lucywgYm90aC1zaWRlIHdvcmQgYm91bmRhcmllcyBlbmZvcmNlZCkuXG4gKiAgIEMuIEZhbGxiYWNrOiBwYW5lbC1sZXZlbCBMT0lOQyBmcm9tIE5ISV9UT19MT0lOQyBpZiBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9pbmMoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgd2lucyBvdXRyaWdodC5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMgJiYgIURJU1BMQVlfRklSU1RfQ09ERVMuaGFzKGNvZGUpKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG5cbiAgY29uc3QgY29tYmluZWQgPSBgJHtjb2RlfSAke2Rpc3BsYXl9YC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIEIxLiBQYW5lbC1zcGVjaWZpYyBrZXl3b3JkIG1hcCBydW5zIEJFRk9SRSB0aGUgZ2xvYmFsIG9uZS5cbiAgaWYgKGNvZGUgaW4gUEFORUxfTE9JTkNfTUFQKSB7XG4gICAgY29uc3QgaGl0ID0gX2ZpbmRMb25nZXN0TWF0Y2goY29tYmluZWQsIFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpO1xuICAgIGlmIChoaXQpIHJldHVybiBoaXQ7XG4gIH1cblxuICAvLyBCLiBEaXNwbGF5LWtleXdvcmQgc2VhcmNoLlxuICBjb25zdCBoaXQgPSBfZmluZExvbmdlc3RNYXRjaChjb21iaW5lZCwgTE9JTkNfTUFQKTtcbiAgaWYgKGhpdCkgcmV0dXJuIGhpdDtcblxuICAvLyBDLiBQYW5lbCBjb2RlIHdpdGggbm8gcmVjb2duaXNlZCBpdGVtIGRpc3BsYXkgXHUyMTkyIGZhbGwgYmFjay5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMpIHtcbiAgICByZXR1cm4gTkhJX1RPX0xPSU5DW2NvZGVdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIE9ic2VydmF0aW9uLmNvZGUuY29kaW5nW10gbGlzdC5cbiAqIFByaW9yaXR5OiBMT0lOQyBcdTIxOTIgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgbG9jYWwgZmFsbGJhY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvZGluZ3MoXG4gIGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGRpc3BsYXk6IHN0cmluZyxcbiAgbG9pbmM6IHN0cmluZyB8IG51bGwsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10ge1xuICBjb25zdCBjb2RpbmdzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10gPSBbXTtcbiAgaWYgKGxvaW5jKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsXG4gICAgICBjb2RlOiBsb2luYyxcbiAgICAgIGRpc3BsYXk6IExPSU5DX0RJU1BMQVlbbG9pbmNdID8/IGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgY29uc3QgY29kZVN0ciA9IChjb2RlID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKGNvZGVTdHIgJiYgTkhJX0xBQl9DT0RFX1JFLnRlc3QoY29kZVN0cikpIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLk5ISV9NRURJQ0FMX09SREVSX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyLFxuICAgICAgZGlzcGxheSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERSxcbiAgICAgIGNvZGU6IGNvZGVTdHIgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGNvZGluZ3M7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBJbnRlcnByZXRhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU5URVJQX1NZUyA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92My1PYnNlcnZhdGlvbkludGVycHJldGF0aW9uXCI7XG5cbmZ1bmN0aW9uIGludGVycENvZGluZyhjb2RlOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICByZXR1cm4geyBzeXN0ZW06IElOVEVSUF9TWVMsIGNvZGUsIGRpc3BsYXkgfTtcbn1cblxuY29uc3QgSU5URVJQX1RBQkxFOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgaGlnaDogW1wiSFwiLCBcIkhpZ2hcIl0sXG4gIGxvdzogW1wiTFwiLCBcIkxvd1wiXSxcbiAgbm9ybWFsOiBbXCJOXCIsIFwiTm9ybWFsXCJdLFxuICBjcml0aWNhbDogW1wiQUFcIiwgXCJDcml0aWNhbCBhYm5vcm1hbFwiXSxcbiAgYWJub3JtYWw6IFtcIkFcIiwgXCJBYm5vcm1hbFwiXSxcbiAgcG9zaXRpdmU6IFtcIlBPU1wiLCBcIlBvc2l0aXZlXCJdLFxuICBuZWdhdGl2ZTogW1wiTkVHXCIsIFwiTmVnYXRpdmVcIl0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWFwSW50ZXJwcmV0YXRpb24oXG4gIGludGVycDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgY29uc3Qga2V5ID0gKGludGVycCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBlbnRyeSA9IElOVEVSUF9UQUJMRVtrZXldO1xuICBpZiAoIWVudHJ5KSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGludGVycENvZGluZyhlbnRyeVswXSwgZW50cnlbMV0pO1xufVxuXG4vLyBQb3NpdGl2ZSBtYXJrZXJzIFx1MjAxNCBcInRoaXMgaXMgZGV0ZWN0ZWQgLyBhYm5vcm1hbFwiLlxuY29uc3QgUE9TX01BUktFUlMgPVxuICAvXlxccyooPzpwb3NpdGl2ZXxwb3N8cmVhY3RpdmV8ZGV0ZWN0ZWR8YWJub3JtYWx8cHJlc2VudHx0cmFjZXxbMS00XT9cXHMqXFwrKD86XFxzKltcXCtcXC1dKSopXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG4vLyBOZWdhdGl2ZSBtYXJrZXJzIFx1MjAxNCBleHBsaWNpdGx5IG5vcm1hbC9hYnNlbnQuXG5jb25zdCBORUdfTUFSS0VSUyA9XG4gIC9eXFxzKig/Om5lZ2F0aXZlfG5lZ3xub25yZWFjdGl2ZXxub25bLVxcc10/cmVhY3RpdmV8bm90Wy1cXHNdP2RldGVjdGVkfG5kfGFic2VudHxub25lfG5vcm1hbHwwfFstXHUyMDE0XHUyMDEzXSspXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG5mdW5jdGlvbiBjbGFzc2lmeVF1YWxpdGF0aXZlKHRleHQ6IHVua25vd24pOiBcInBvc1wiIHwgXCJuZWdcIiB8IG51bGwge1xuICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IFN0cmluZyh0ZXh0KS50cmltKCk7XG4gIGlmIChzLnN0YXJ0c1dpdGgoXCJbXCIpICYmIHMuZW5kc1dpdGgoXCJdXCIpKSB7XG4gICAgcyA9IHMuc2xpY2UoMSwgLTEpLnRyaW0oKTtcbiAgfVxuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBpZiAoTkVHX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwibmVnXCI7XG4gIGlmIChQT1NfTUFSS0VSUy50ZXN0KHMpKSByZXR1cm4gXCJwb3NcIjtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgdmFsdWVSYXc6IHN0cmluZyxcbiAgcXR5OiBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgcnI6IFJhbmdlRW50cnkgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIC8vIDEuIE51bWVyaWMgcGF0aC5cbiAgaWYgKHF0eSAmJiB0eXBlb2YgcXR5LnZhbHVlID09PSBcIm51bWJlclwiICYmIHJyKSB7XG4gICAgY29uc3QgdiA9IHF0eS52YWx1ZTtcbiAgICBjb25zdCBsbyA9IHJyLmxvdz8udmFsdWU7XG4gICAgY29uc3QgaGkgPSByci5oaWdoPy52YWx1ZTtcbiAgICBpZiAodHlwZW9mIGhpID09PSBcIm51bWJlclwiICYmIHYgPiBoaSkgcmV0dXJuIGludGVycENvZGluZyhcIkhcIiwgXCJIaWdoXCIpO1xuICAgIGlmICh0eXBlb2YgbG8gPT09IFwibnVtYmVyXCIgJiYgdiA8IGxvKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTFwiLCBcIkxvd1wiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiIHx8IHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyAyLiBRdWFsaXRhdGl2ZSBwYXRoLlxuICBjb25zdCB2YWxLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZSh2YWx1ZVJhdyk7XG4gIGNvbnN0IHJlZlRleHQgPSBycj8udGV4dCA/PyBcIlwiO1xuICBjb25zdCByZWZLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZShyZWZUZXh0KTtcbiAgaWYgKHZhbEtpbmQgPT09IG51bGwpIHJldHVybiBudWxsO1xuICBpZiAocmVmS2luZCA9PT0gXCJuZWdcIikge1xuICAgIGlmICh2YWxLaW5kID09PSBcInBvc1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiQVwiLCBcIkFibm9ybWFsXCIpO1xuICAgIGlmICh2YWxLaW5kID09PSBcIm5lZ1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTlwiLCBcIk5vcm1hbFwiKTtcbiAgfVxuICByZXR1cm4gdmFsS2luZCA9PT0gXCJwb3NcIiA/IGludGVycENvZGluZyhcIlBPU1wiLCBcIlBvc2l0aXZlXCIpIDogaW50ZXJwQ29kaW5nKFwiTkVHXCIsIFwiTmVnYXRpdmVcIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBDYW5vbmljYWwgbGFiIGtleSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTEFCX1NZTk9OWU1TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBEaWFiZXRlc1xuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXHU3Q0Q2XHU1MzE2XHU4ODQwXHU4MjcyXHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCJIQkExQ1wiLFxuICBcIkdMWUNBVEVEIEhFTU9HTE9CSU5cIjogXCJIQkExQ1wiLFxuICBIQkExQzogXCJIQkExQ1wiLFxuICBBMUM6IFwiSEJBMUNcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcIkZBU1RJTkcgR0xVQ09TRVwiOiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcdTg0NjFcdTg0MDRcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBcdTg4NDBcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBHTFVDT1NFOiBcIkdMVUNPU0VcIixcbiAgLy8gQ0JDXG4gIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJXQkNcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIldCQ1wiLFxuICBXQkM6IFwiV0JDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJSQkNcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIlJCQ1wiLFxuICBSQkM6IFwiUkJDXCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCJIRU1PR0xPQklOXCIsXG4gIEhFTU9HTE9CSU46IFwiSEVNT0dMT0JJTlwiLFxuICBIR0I6IFwiSEVNT0dMT0JJTlwiLFxuICBcdTg4NDBcdTVCQjlcdTdBNERcdTZCRDQ6IFwiSEVNQVRPQ1JJVFwiLFxuICBIRU1BVE9DUklUOiBcIkhFTUFUT0NSSVRcIixcbiAgSENUOiBcIkhFTUFUT0NSSVRcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIlBMQVRFTEVUXCIsXG4gIFBMQVRFTEVUOiBcIlBMQVRFTEVUXCIsXG4gIFBMVDogXCJQTEFURUxFVFwiLFxuICAvLyBDQkMgaW5kaWNlcyAoMTAtY2hhciBhbmQgNy1jaGFyIENKSyBmb3JtcyBiZWF0IGJhcmUgXHU3RDA1XHU4ODQwXHU3NDAzKVxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjBcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjA6IFwiTUNIXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1NkZDM1x1NUVBNjogXCJNQ0hDXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1OUFENFx1N0E0RDogXCJNQ1ZcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzXHU1MjA2XHU1RTAzXHU1QkVDXHU1RUE2OiBcIlJEV1wiLFxuICBNQ1Y6IFwiTUNWXCIsXG4gIE1DSDogXCJNQ0hcIixcbiAgTUNIQzogXCJNQ0hDXCIsXG4gIFJEVzogXCJSRFdcIixcbiAgLy8gQ0JDIGRpZmZlcmVudGlhbFxuICBcdTU1RENcdTRFMkRcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiTkVVVFJPUEhJTFwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTkxNzhcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTlFN0NcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiQkFTT1BISUxcIixcbiAgXHU2RENCXHU1REY0XHU3NDAzOiBcIkxZTVBIT0NZVEVcIixcbiAgXHU1NUFFXHU2ODM4XHU3NDAzOiBcIk1PTk9DWVRFXCIsXG4gIEVPU0lOT1BISUxTOiBcIkVPU0lOT1BISUxcIixcbiAgRU9TSU5PUEhJTDogXCJFT1NJTk9QSElMXCIsXG4gIE5FVVRST1BISUxTOiBcIk5FVVRST1BISUxcIixcbiAgTkVVVFJPUEhJTDogXCJORVVUUk9QSElMXCIsXG4gIEJBU09QSElMUzogXCJCQVNPUEhJTFwiLFxuICBCQVNPUEhJTDogXCJCQVNPUEhJTFwiLFxuICBMWU1QSE9DWVRFUzogXCJMWU1QSE9DWVRFXCIsXG4gIExZTVBIT0NZVEU6IFwiTFlNUEhPQ1lURVwiLFxuICBNT05PQ1lURVM6IFwiTU9OT0NZVEVcIixcbiAgTU9OT0NZVEU6IFwiTU9OT0NZVEVcIixcbiAgLy8gTGlwaWQgXHUyMDE0IExETC9IREwgbXVzdCBwcmVjZWRlIGJhcmUgQ0hPTEVTVEVST0wuXG4gIFwiTERMIENIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ0hPTEVTVEVST0xcIjogXCJMRExfQ1wiLFxuICBcIkhETCBDSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFwiSERMLUNIT0xFU1RFUk9MXCI6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiTERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkhETF9DXCIsXG4gIFx1ODg0MFx1NkUwNVx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlRPVEFMIENIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTEVTVEVST0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTDogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTRFMDlcdTkxNzhcdTc1MThcdTZDQjlcdTkxNkY6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFRSSUdMWUNFUklERTogXCJUUklHTFlDRVJJREVcIixcbiAgXCJIREwtQ1wiOiBcIkhETF9DXCIsXG4gIEhETDogXCJIRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiSERMX0NcIixcbiAgXCJMREwtQyhESVJFQ1QpXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ1wiOiBcIkxETF9DXCIsXG4gIExETDogXCJMRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiTERMX0NcIixcbiAgLy8gUmVuYWwgXHUyMDE0IHVyaW5lIGNyZWF0aW5pbmUgdmFyaWFudHMgYmVmb3JlIHNlcnVtLlxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlVSSU5FIENSRUFUSU5JTkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVBXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNTBcdTkxNzg6IFwiQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoQilcIjogXCJDUkVBVElOSU5FXCIsXG4gIENSRUFUSU5JTkU6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JUTjogXCJDUkVBVElOSU5FXCIsXG4gIEVHRlI6IFwiRUdGUlwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiQlVOXCIsXG4gIEJVTjogXCJCVU5cIixcbiAgXHU1QzNGXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlVSSU5FX1BIXCIsXG4gIFx1NUMzRlx1NkRCMlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiUEhcIixcbiAgXHU1QzNGXHU5MTc4OiBcIlVSSUNfQUNJRFwiLFxuICBcIlVSSUMgQUNJRFwiOiBcIlVSSUNfQUNJRFwiLFxuICBVUklDX0FDSUQ6IFwiVVJJQ19BQ0lEXCIsXG4gIC8vIExpdmVyXG4gIEFTVDogXCJBU1RcIixcbiAgQUxUOiBcIkFMVFwiLFxuICBHT1Q6IFwiQVNUXCIsXG4gIEdQVDogXCJBTFRcIixcbiAgXHU4MUJEXHU3RDA1XHU3RDIwOiBcIkJJTElSVUJJTlwiLFxuICBCSUxJUlVCSU46IFwiQklMSVJVQklOXCIsXG4gIFx1NzY3RFx1ODZDQlx1NzY3RDogXCJBTEJVTUlOXCIsXG4gIEFMQlVNSU46IFwiQUxCVU1JTlwiLFxuICAvLyBDYXJkaWFjXG4gIFx1NUZDM1x1ODA4Q1x1NjVDQlx1OEY0OVx1ODZDQlx1NzY3RDogXCJUUk9QT05JTlwiLFxuICBUUk9QT05JTjogXCJUUk9QT05JTlwiLFxuICBCTlA6IFwiQk5QXCIsXG4gIFx1NUZDM1x1ODFERjogXCJUUk9QT05JTlwiLFxuICAvLyBUaHlyb2lkXG4gIFx1NzUzMlx1NzJDMFx1ODE3QVx1NTIzQVx1NkZDMFx1N0QyMDogXCJUU0hcIixcbiAgVFNIOiBcIlRTSFwiLFxuICBcdTZFMzhcdTk2RTJcdTc1MzJcdTcyQzBcdTgxN0FcdTdEMjA6IFwiRlJFRV9UNFwiLFxuICBcIkZSRUUgVDRcIjogXCJGUkVFX1Q0XCIsXG4gIEZUNDogXCJGUkVFX1Q0XCIsXG4gIC8vIE1pc2NcbiAgQ1x1NTNDRFx1NjFDOVx1NjAyN1x1ODZDQlx1NzY3RDogXCJDUlBcIixcbiAgXCJDLVJFQUNUSVZFIFBST1RFSU5cIjogXCJDUlBcIixcbiAgQ1JQOiBcIkNSUFwiLFxuICBcIkhTLUNSUFwiOiBcIkhTX0NSUFwiLFxuICBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUY6IFwiUFNBXCIsXG4gIFBTQTogXCJQU0FcIixcbiAgXHU5NDM1XHU4NkNCXHU3NjdEOiBcIkZFUlJJVElOXCIsXG4gIEZFUlJJVElOOiBcIkZFUlJJVElOXCIsXG4gIFx1ODQ0OVx1OTE3ODogXCJGT0xBVEVcIixcbiAgRk9MQVRFOiBcIkZPTEFURVwiLFxuICBcdTdEQURcdTc1MUZcdTdEMjBCMTI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVQgQjEyXCI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVRBTUlOIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFx1NzZBRVx1OENFQVx1N0QyMDogXCJDT1JUSVNPTFwiLFxuICBDT1JUSVNPTDogXCJDT1JUSVNPTFwiLFxuICBcdTY4ODVcdTZCRDI6IFwiUlBSXCIsXG4gIFJQUjogXCJSUFJcIixcbiAgXHU5NkIxXHU3NDAzXHU4M0NDXHU2Mjk3XHU1MzlGOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBDUllQQUc6IFwiQ1JZUFRPQ09DQ0FMX0FHXCIsXG4gIFx1ODg0MFx1NkMyODogXCJBTU1PTklBXCIsXG4gIEFNTU9OSUE6IFwiQU1NT05JQVwiLFxuICBcdTUxRERcdTg4NDBcdTkxNzZcdTUzOUZcdTY2NDJcdTk1OTM6IFwiUFRcIixcbiAgQVBUVDogXCJBUFRUXCIsXG4gIElOUjogXCJJTlJcIixcbn07XG5cbi8vIFByZS1zb3J0IGtleXMgbG9uZ2VzdC1maXJzdCBzbyBsb25nZXIvbW9yZS1zcGVjaWZpYyBtYXRjaGVzIHdpbi5cbmNvbnN0IExBQl9TWU5PTllNX0tFWVNfU09SVEVEID0gT2JqZWN0LmtleXMoTEFCX1NZTk9OWU1TKS5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbExhYktleShkaXNwbGF5OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFkaXNwbGF5KSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcyA9IGRpc3BsYXkudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBcIlwiO1xuICBjb25zdCBzVXBwZXIgPSBzLnRvVXBwZXJDYXNlKCk7XG4gIGZvciAoY29uc3Qga2V5IG9mIExBQl9TWU5PTllNX0tFWVNfU09SVEVEKSB7XG4gICAgY29uc3Qga3UgPSBrZXkudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa3UpKSB7XG4gICAgICAvLyBMZWFkaW5nIHdvcmQtYm91bmRhcnkgb25seSBcdTIwMTQgXCJBU1RcIiBpbnNpZGUgXCJESUFTVE9MSUNcIiBzaG91bGQgbm90IG1hdGNoLlxuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrdSl9YCkudGVzdChzVXBwZXIpKSB7XG4gICAgICAgIHJldHVybiBMQUJfU1lOT05ZTVNba2V5XSE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzVXBwZXIuaW5jbHVkZXMoa3UpKSB7XG4gICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBhbmVsIGdyb3VwaW5nIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICAgIGlmIChjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmKSBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGlzRW5nbGlzaERvbWluYW50KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgbGF0aW4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIHtcbiAgICBjb25zdCBjcCA9IGNoLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGNwIDwgMTI4ICYmIC9bQS1aYS16XS8udGVzdChjaCkpIGxhdGluKys7XG4gIH1cbiAgcmV0dXJuIGxhdGluID49IDIgJiYgY2prQ2hhcnMocykgPT09IDA7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAodjogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGxldCBzID0gU3RyaW5nKHYpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXChbXildKlxcKS9nLCBcIlwiKS50cmltKCk7XG4gIHMgPSBzLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWx1ZSkudHJpbSgpO1xuICByZXR1cm4gcyAhPT0gXCJcIiAmJiBzICE9PSBcIlx1MjAxNFwiICYmIHMgIT09IFwiLVwiICYmIHMgIT09IFwiTi9BXCIgJiYgcyAhPT0gXCJudWxsXCI7XG59XG5cbmNvbnN0IE1FQU5JTkdGVUxfSU5URVJQUyA9IG5ldyBTZXQoW1xuICBcIm5vcm1hbFwiLFxuICBcImFibm9ybWFsXCIsXG4gIFwiaGlnaFwiLFxuICBcImxvd1wiLFxuICBcImNyaXRpY2FsXCIsXG4gIFwicG9zaXRpdmVcIixcbiAgXCJuZWdhdGl2ZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIGRlZHVwZVBhbmVsSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5VmFsdWUgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgayA9IG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAoaXQudmFsdWUpO1xuICAgIGNvbnN0IGdyb3VwID0gYnlWYWx1ZS5nZXQoayk7XG4gICAgaWYgKGdyb3VwKSBncm91cC5wdXNoKGl0KTtcbiAgICBlbHNlIGJ5VmFsdWUuc2V0KGssIFtpdF0pO1xuICB9XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgZ3JvdXAgb2YgYnlWYWx1ZS52YWx1ZXMoKSkge1xuICAgIGlmIChncm91cC5sZW5ndGggPT09IDEpIHtcbiAgICAgIG91dC5wdXNoKGdyb3VwWzBdISk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgY2prSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGNqa0NoYXJzKFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpID49IDIpO1xuICAgIGNvbnN0IGVuSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGlzRW5nbGlzaERvbWluYW50KFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpKTtcbiAgICBpZiAoY2prSXRlbXMubGVuZ3RoID4gMCAmJiBlbkl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIG91dC5wdXNoKGVuSXRlbXNbMF0hKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0LnB1c2goLi4uZ3JvdXApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zOiBhbnlbXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgcmF3IG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFyYXcgfHwgdHlwZW9mIHJhdyAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gICAgaWYgKGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheSwgcmF3LmNvZGUgfHwgXCJcIikpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICAgIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICAgIGNvbnN0IGhhc01lYW5pbmdmdWxJbnRlcnAgPSBNRUFOSU5HRlVMX0lOVEVSUFMuaGFzKGludGVycCk7XG4gICAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgY29udGludWU7XG4gICAgb3V0LnB1c2gocmF3KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBkZWR1cGVDcm9zc0Zvcm1hdChpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3Qgb3JkZXJDb2RlID0gKGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nID0+XG4gICAgKChpdC5vcmRlcl9jb2RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG5cbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgbGV0IGlkeENvdW50ZXIgPSAwO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICBjb25zdCB2ID0gU3RyaW5nKGl0ZW0udmFsdWUgPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHVuaXQgPSAoKGl0ZW0udW5pdCBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgICBpZiAoIXYpIHtcbiAgICAgIGJ5S2V5LnNldChgX19ub19kZWR1cF9ffCR7aWR4Q291bnRlcisrfWAsIGl0ZW0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IFtcbiAgICAgIChpdGVtLmRhdGUgYXMgc3RyaW5nKSA/PyBcIlwiLFxuICAgICAgdi50b0xvd2VyQ2FzZSgpLFxuICAgICAgdW5pdC50b0xvd2VyQ2FzZSgpLFxuICAgICAgb3JkZXJDb2RlKGl0ZW0pLFxuICAgIF0uam9pbihcInxcIik7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBieUtleS5nZXQoa2V5KTtcbiAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvLyBQcmVmZXIgdGhlIHJvdyB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGNsaW5pY2FsIHJlYWRzKS5cbiAgICBsZXQgcHJpbWFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBsZXQgc2Vjb25kYXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIGlmIChjamtDaGFycyhpdGVtLmRpc3BsYXkgPz8gXCJcIikgPCBjamtDaGFycyhleGlzdGluZy5kaXNwbGF5ID8/IFwiXCIpKSB7XG4gICAgICBwcmltYXJ5ID0gaXRlbTtcbiAgICAgIHNlY29uZGFyeSA9IGV4aXN0aW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmltYXJ5ID0gZXhpc3Rpbmc7XG4gICAgICBzZWNvbmRhcnkgPSBpdGVtO1xuICAgIH1cbiAgICBjb25zdCBtZXJnZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgW1wib3JkZXJfY29kZVwiLCBcIm9yZGVyX25hbWVcIiwgXCJob3NwaXRhbFwiLCBcImNvZGVcIl0pIHtcbiAgICAgIGlmICghbWVyZ2VkW2ZdICYmIHNlY29uZGFyeVtmXSkgbWVyZ2VkW2ZdID0gc2Vjb25kYXJ5W2ZdO1xuICAgIH1cbiAgICBieUtleS5zZXQoa2V5LCBtZXJnZWQpO1xuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKGJ5S2V5LnZhbHVlcygpKTtcbn1cblxuaW50ZXJmYWNlIEJwQ29tcG9uZW50IHtcbiAgbG9pbmM6IHN0cmluZztcbiAgZGlzcGxheTogc3RyaW5nO1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0OiBzdHJpbmc7XG4gIGludGVycHJldGF0aW9uX3RleHQ6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gY29tYmluZUJwSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgeyBzeXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT47IGRpYXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT4gfVxuICA+KCk7XG4gIGNvbnN0IHBhc3NUaHJvdWdoOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGRpc3AgPSBTdHJpbmcoaXQuZGlzcGxheSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGtleSA9IGAke2l0LmRhdGUgPz8gXCJcIn18JHtpdC5ob3NwaXRhbCA/PyBcIlwifWA7XG4gICAgaWYgKGRpc3AuaW5jbHVkZXMoXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5zeXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIGlmIChkaXNwLmluY2x1ZGVzKFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpKSB7XG4gICAgICBjb25zdCB2ID0gYnlLZXkuZ2V0KGtleSkgPz8ge307XG4gICAgICB2LmRpYXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhc3NUaHJvdWdoLnB1c2goaXQpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgcGFydHMgb2YgYnlLZXkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBzID0gcGFydHMuc3lzdG9saWM7XG4gICAgY29uc3QgZCA9IHBhcnRzLmRpYXN0b2xpYztcbiAgICBjb25zdCBwcmltYXJ5ID0gcyA/PyBkO1xuICAgIGlmICghcHJpbWFyeSkgY29udGludWU7XG4gICAgY29uc3QgY29tcG9uZW50czogQnBDb21wb25lbnRbXSA9IFtdO1xuICAgIGNvbnN0IHRyeUFkZCA9IChzcmM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQsIGxvaW5jOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFzcmMpIHJldHVybjtcbiAgICAgIGNvbnN0IHZhbCA9IHNyYy52YWx1ZTtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBcIlwiIHx8IHZhbCA9PT0gXCItXCIgfHwgdmFsID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgICBjb25zdCBudW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcodmFsKS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG51bSkpIHJldHVybjtcbiAgICAgIGNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgIGxvaW5jLFxuICAgICAgICBkaXNwbGF5LFxuICAgICAgICB2YWx1ZTogbnVtLFxuICAgICAgICB1bml0OiBzcmMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgaW50ZXJwcmV0YXRpb25fdGV4dDogc3JjLnJlZmVyZW5jZV9yYW5nZSB8fCBcIlwiLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB0cnlBZGQocywgXCI4NDgwLTZcIiwgXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKTtcbiAgICB0cnlBZGQoZCwgXCI4NDYyLTRcIiwgXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBjb25zdCBjb21iaW5lZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4ucHJpbWFyeSB9O1xuICAgIGNvbWJpbmVkLmRpc3BsYXkgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfbmFtZSA9IFwiQmxvb2QgUHJlc3N1cmVcIjtcbiAgICBjb21iaW5lZC5jYXRlZ29yeSA9IFwidml0YWwtc2lnbnNcIjtcbiAgICBjb21iaW5lZC5icF9jb21wb25lbnRzID0gY29tcG9uZW50cztcbiAgICBjb21iaW5lZC5icF9wYW5lbF9sb2luYyA9IFwiODUzNTQtOVwiO1xuICAgIGNvbWJpbmVkLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIGNvbWJpbmVkLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgcGFzc1Rocm91Z2gucHVzaChjb21iaW5lZCk7XG4gIH1cblxuICByZXR1cm4gcGFzc1Rocm91Z2g7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTcGVjaW1lbiBpbmZlcmVuY2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IFNQRUNJTUVOX1JVTEVTOiBSZWFkb25seUFycmF5PFtSZWdFeHAsIHN0cmluZ10+ID0gW1xuICBbL1x1NUMzRnx1cmluZXx1cmluYWx5L2ksIFwiVXJpbmVcIl0sXG4gIFsvXHU3Q0RFfFx1NEZCRlx1NkY1Qlx1ODg0MHxzdG9vbHxmZWNhbHxmYWVjYWx8b2NjdWx0XFxzKmJsb29kL2ksIFwiU3Rvb2xcIl0sXG4gIFsvXHU3NUYwfHNwdXR1bS9pLCBcIlNwdXR1bVwiXSxcbiAgWy9cdTgxNjZcdTgxMEFcdTZEQjJ8Y3NmfGNlcmVicm9zcGluYWwvaSwgXCJDZXJlYnJvc3BpbmFsIGZsdWlkXCJdLFxuICBbL1x1ODBGOFx1NkMzNHxwbGV1cmFsL2ksIFwiUGxldXJhbCBmbHVpZFwiXSxcbiAgWy9cdTgxNzlcdTZDMzR8YXNjaXRlc3xwZXJpdG9uZWFsL2ksIFwiUGVyaXRvbmVhbCBmbHVpZFwiXSxcbiAgWy9cdTk2NzBcdTkwNTN8XHU2MkI5XHU3MjQ3fGNlcnZpY2FsfHBhcFxccypzbWVhcnx2YWdpbmFsL2ksIFwiQ2VydmljYWwvVmFnaW5hbFwiXSxcbiAgWy9cdTk1RENcdTdCQzBcdTZEQjJ8c3lub3ZpYWx8am9pbnRcXHMqZmx1aWQvaSwgXCJTeW5vdmlhbCBmbHVpZFwiXSxcbiAgWy9cdTdGOEFcdTZDMzR8YW1uaW90aWMvaSwgXCJBbW5pb3RpYyBmbHVpZFwiXSxcbiAgWy9cdTlBQThcdTlBRDN8Ym9uZVxccyptYXJyb3cvaSwgXCJCb25lIG1hcnJvd1wiXSxcbl07XG5cbmZ1bmN0aW9uIGluZmVyU3BlY2ltZW4oLi4uaGludHM6IEFycmF5PHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ+KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGJsb2IgPSBoaW50c1xuICAgIC5maWx0ZXIoKGgpOiBoIGlzIHN0cmluZyA9PiBCb29sZWFuKGgpKVxuICAgIC5qb2luKFwiIFwiKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIWJsb2IpIHJldHVybiBudWxsO1xuICBmb3IgKGNvbnN0IFtwYXR0ZXJuLCBsYWJlbF0gb2YgU1BFQ0lNRU5fUlVMRVMpIHtcbiAgICBpZiAocGF0dGVybi50ZXN0KGJsb2IpKSByZXR1cm4gbGFiZWw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNYXAgc2luZ2xlIE9ic2VydmF0aW9uIChub24tZ3JvdXBlZCBwYXRoKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIGNvZGUpKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICBpZiAoIWhhc1ZhbHVlICYmICFoYXNNZWFuaW5nZnVsSW50ZXJwKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSwgcmF3LmRhdGUgPz8gXCJcIik7XG4gIGNvbnN0IGxvaW5jID0gZmluZExvaW5jKGNvZGUsIGRpc3BsYXkpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IFwibGFib3JhdG9yeVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgLy8gU291cmNlLXByb2dyYW1tZSB0YWcgXHUyMDE0IHNldCB3aGVuIHRoZSBhZGFwdGVyIHB1bGxlZCB0aGlzIG9ic2VydmF0aW9uXG4gIC8vIG91dCBvZiBhIHNwZWNpZmljIE5ISSBzY3JlZW5pbmcgcHJvZ3JhbW1lIChlLmcuIGFkYXB0QWR1bHRQcmV2ZW50aXZlXG4gIC8vIHNldHMgc291cmNlX3Byb2dyYW09XCJhZHVsdC1wcmV2ZW50aXZlXCIpLiBTdXJmYWNlZCB2aWEgT2JzZXJ2YXRpb24uXG4gIC8vIG1ldGEudGFnIHNvIGRvd25zdHJlYW0gU01BUlQgYXBwcyBjYW4gZmlsdGVyIGJ5IF90YWcgd2l0aG91dCBuZWVkaW5nXG4gIC8vIHRvIGtub3cgYWJvdXQgb3VyIGludGVybmFsIGZpZWxkIG5hbWVzLlxuICBpZiAocmF3LnNvdXJjZV9wcm9ncmFtKSB7XG4gICAgcmVzb3VyY2UubWV0YS50YWcgPSBbXG4gICAgICB7XG4gICAgICAgIHN5c3RlbTogXCJodHRwOi8vbmhpLWZoaXItYnJpZGdlL3NvdXJjZS1wcm9ncmFtXCIsXG4gICAgICAgIGNvZGU6IFN0cmluZyhyYXcuc291cmNlX3Byb2dyYW0pLFxuICAgICAgfSxcbiAgICBdO1xuICB9XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCByciA9IHBhcnNlUmFuZ2UoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnIpIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gW3JyXTtcbiAgfVxuXG4gIGNvbnN0IGludGVycENvZGluZ1Jlc3VsdCA9XG4gICAgbWFwSW50ZXJwcmV0YXRpb24oaW50ZXJwKSB8fFxuICAgIGRlcml2ZUludGVycHJldGF0aW9uKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCA/IFN0cmluZyh2YWx1ZSkgOiBcIlwiLFxuICAgICAgcmVzb3VyY2UudmFsdWVRdWFudGl0eSBhcyBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgICAgIChyZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSBhcyBSYW5nZUVudHJ5W10gfCB1bmRlZmluZWQpPy5bMF0sXG4gICAgKTtcbiAgaWYgKGludGVycENvZGluZ1Jlc3VsdCkge1xuICAgIHJlc291cmNlLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbaW50ZXJwQ29kaW5nUmVzdWx0XSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJ1aWxkIG9ic2VydmF0aW9uIHdpdGhpbiBhIHBhbmVsICh3aXRoIGNhbm9uaWNhbCBsYWIga2V5IGlkKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gYnVpbGRPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbiAgcGFuZWxDb2RlOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIC8vIEJQIHBhbmVsOiBwcmVidWlsdCBieSBjb21iaW5lQnBJdGVtcy5cbiAgaWYgKHJhdy5icF9jb21wb25lbnRzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJvYnNcIiwgXCJCUF9QQU5FTFwiLCBkYXRlLCBob3NwaXRhbCk7XG4gICAgY29uc3QgY29tcG9uZW50UmVzb3VyY2VzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYyBvZiByYXcuYnBfY29tcG9uZW50cyBhcyBCcENvbXBvbmVudFtdKSB7XG4gICAgICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgICAgICB2YWx1ZTogYy52YWx1ZSxcbiAgICAgICAgdW5pdDogYy51bml0IHx8IFwibW1IZ1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiB0b1VjdW0oYy51bml0KSA/PyBcIm1tW0hnXVwiLFxuICAgICAgfTtcbiAgICAgIGNvbXBvbmVudFJlc291cmNlcy5wdXNoKHtcbiAgICAgICAgY29kZToge1xuICAgICAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIiwgY29kZTogYy5sb2luYywgZGlzcGxheTogYy5kaXNwbGF5IH1dLFxuICAgICAgICAgIHRleHQ6IGMuZGlzcGxheSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWVRdWFudGl0eTogcXR5LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGJwT2JzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgICBpZDogb2JzSWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgY29kZTogXCJ2aXRhbC1zaWduc1wiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgICAgICAgY29kZTogcmF3LmJwX3BhbmVsX2xvaW5jID8/IFwiODUzNTQtOVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IFwiQmxvb2QgUHJlc3N1cmVcIixcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgY29tcG9uZW50OiBjb21wb25lbnRSZXNvdXJjZXMsXG4gICAgfTtcbiAgICBpZiAoZGF0ZSkgYnBPYnMuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtkYXRlfVQwMDowMDowMCswODowMGA7XG4gICAgaWYgKGhvc3BpdGFsKSBicE9icy5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgICByZXR1cm4gYnBPYnM7XG4gIH1cblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IChwYW5lbENvZGUgPyBTdHJpbmcocGFuZWxDb2RlKSA6IFwiXCIpIHx8IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCBjYW5vbmljYWwgPSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgfHwgZGlzcGxheTtcbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIGNhbm9uaWNhbCwgcmF3LmRhdGUgPz8gXCJcIiwgcmF3Lmhvc3BpdGFsID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCBjYXRDb2RlID0gcmF3LmNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiO1xuICBjb25zdCBDQVRfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBsYWJvcmF0b3J5OiBcIkxhYm9yYXRvcnlcIixcbiAgICBcInZpdGFsLXNpZ25zXCI6IFwiVml0YWwgU2lnbnNcIixcbiAgICBpbWFnaW5nOiBcIkltYWdpbmdcIixcbiAgICBwcm9jZWR1cmU6IFwiUHJvY2VkdXJlXCIsXG4gICAgXCJzb2NpYWwtaGlzdG9yeVwiOiBcIlNvY2lhbCBIaXN0b3J5XCIsXG4gICAgc3VydmV5OiBcIlN1cnZleVwiLFxuICAgIGV4YW06IFwiRXhhbVwiLFxuICAgIHRoZXJhcHk6IFwiVGhlcmFweVwiLFxuICAgIGFjdGl2aXR5OiBcIkFjdGl2aXR5XCIsXG4gIH07XG4gIGNvbnN0IGNhdERpc3BsYXkgPVxuICAgIENBVF9ESVNQTEFZW2NhdENvZGVdID8/IGNhdENvZGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYXRDb2RlLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgaWQ6IG9ic0lkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICBjYXRlZ29yeTogW1xuICAgICAge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogY2F0Q29kZSxcbiAgICAgICAgICAgIGRpc3BsYXk6IGNhdERpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuaG9zcGl0YWwpIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IHJhdy5ob3NwaXRhbCB9XTtcbiAgY29uc3Qgc3BlY2ltZW4gPSBpbmZlclNwZWNpbWVuKHJhdy5vcmRlcl9uYW1lLCByYXcuZGlzcGxheSwgcmF3LmNvZGUpO1xuICBpZiAoc3BlY2ltZW4pIHJlc291cmNlLnNwZWNpbWVuID0geyBkaXNwbGF5OiBzcGVjaW1lbiB9O1xuXG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBpZiAoaGFzVmFsdWUpIHtcbiAgICBjb25zdCBxdHkgPSB0cnlQYXJzZVF1YW50aXR5KFN0cmluZyh2YWx1ZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChxdHkpIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgPSBxdHk7XG4gICAgZWxzZSByZXNvdXJjZS52YWx1ZVN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBpZiAocmF3LnJlZmVyZW5jZV9yYW5nZSkge1xuICAgIGNvbnN0IHJycyA9IHBhcnNlUmFuZ2VNdWx0aShTdHJpbmcocmF3LnJlZmVyZW5jZV9yYW5nZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChycnMubGVuZ3RoID4gMCkgcmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgPSBycnM7XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBHcm91cCBieSAob3JkZXJfY29kZSwgZGF0ZSwgaG9zcGl0YWwpIFx1MjE5MiBEUiArIE9ic2VydmF0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZ3JvdXBCeU9yZGVyQ29kZShcbiAgY2xlYW5lZDogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGxldCB3b3JraW5nID0gZGVkdXBlQ3Jvc3NGb3JtYXQoY2xlYW5lZCk7XG4gIHdvcmtpbmcgPSBjb21iaW5lQnBJdGVtcyh3b3JraW5nKTtcblxuICBjb25zdCBncm91cHMgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBjb25zdCBrZXlNZXRhID0gbmV3IE1hcDxzdHJpbmcsIHsgZ3JvdXBLZXlDb2RlOiBzdHJpbmc7IGRhdGU6IHN0cmluZzsgaG9zcGl0YWw6IHN0cmluZyB9PigpO1xuICBmb3IgKGNvbnN0IHJhdyBvZiB3b3JraW5nKSB7XG4gICAgY29uc3QgZ3JvdXBLZXlDb2RlID0gcmF3Lm9yZGVyX2NvZGUgfHwgcmF3LmNvZGUgfHwgcmF3LmRpc3BsYXkgfHwgXCJcIjtcbiAgICBjb25zdCBkYXRlID0gcmF3LmRhdGUgPz8gXCJcIjtcbiAgICBjb25zdCBob3NwaXRhbCA9IHJhdy5ob3NwaXRhbCA/PyBcIlwiO1xuICAgIGNvbnN0IGtleSA9IGAke2dyb3VwS2V5Q29kZX18JHtkYXRlfXwke2hvc3BpdGFsfWA7XG4gICAgY29uc3QgYXJyID0gZ3JvdXBzLmdldChrZXkpO1xuICAgIGlmIChhcnIpIGFyci5wdXNoKHJhdyk7XG4gICAgZWxzZSB7XG4gICAgICBncm91cHMuc2V0KGtleSwgW3Jhd10pO1xuICAgICAga2V5TWV0YS5zZXQoa2V5LCB7IGdyb3VwS2V5Q29kZTogU3RyaW5nKGdyb3VwS2V5Q29kZSksIGRhdGUsIGhvc3BpdGFsIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgW2tleSwgaXRlbXNdIG9mIGdyb3Vwcy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBtZXRhID0ga2V5TWV0YS5nZXQoa2V5KSE7XG4gICAgY29uc3QgZGVkdXBlZCA9IGRlZHVwZVBhbmVsSXRlbXMoaXRlbXMpO1xuXG4gICAgY29uc3Qgb2JzUmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgICBjb25zdCBzZWVuT2JzSWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBpdCBvZiBkZWR1cGVkKSB7XG4gICAgICBjb25zdCBvYnMgPSBidWlsZE9ic2VydmF0aW9uKGl0LCBwYXRpZW50SWQsIG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICAgIGlmICghb2JzKSBjb250aW51ZTtcbiAgICAgIGlmIChzZWVuT2JzSWRzLmhhcyhvYnMuaWQpKSBjb250aW51ZTtcbiAgICAgIHNlZW5PYnNJZHMuYWRkKG9icy5pZCk7XG4gICAgICBvYnNSZXNvdXJjZXMucHVzaChvYnMpO1xuICAgIH1cbiAgICBpZiAob2JzUmVzb3VyY2VzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG5cbiAgICAvLyBCUCBwYW5lbDogZW1pdCBPYnNlcnZhdGlvbiBkaXJlY3RseSAobm8gRFIgd3JhcHBlcikuXG4gICAgY29uc3QgaXNCcFBhbmVsID0gZGVkdXBlZC5ldmVyeSgoaXQpID0+IGl0LmJwX2NvbXBvbmVudHMgfHwgaXQuZGlzcGxheSA9PT0gXCJCbG9vZCBQcmVzc3VyZVwiKTtcbiAgICBpZiAoaXNCcFBhbmVsKSB7XG4gICAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JkZXJOYW1lID0gZGVkdXBlZC5maW5kKChpdCkgPT4gaXQub3JkZXJfbmFtZSk/Lm9yZGVyX25hbWUgPz8gbnVsbDtcbiAgICBjb25zdCBtZW1iZXJLZXlzID0gQXJyYXkuZnJvbShcbiAgICAgIG5ldyBTZXQoZGVkdXBlZC5maWx0ZXIoKGl0KSA9PiBpdC5kaXNwbGF5KS5tYXAoKGl0KSA9PiBjYW5vbmljYWxMYWJLZXkoaXQuZGlzcGxheSkpKSxcbiAgICApLnNvcnQoKTtcbiAgICBjb25zdCBwYW5lbFNpZ25hdHVyZSA9IG1lbWJlcktleXMuam9pbihcIixcIikgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICBjb25zdCBkcklkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIkRSXCIsIHBhbmVsU2lnbmF0dXJlLCBtZXRhLmRhdGUsIG1ldGEuaG9zcGl0YWwpO1xuXG4gICAgbGV0IHBhbmVsVGl0bGU6IHN0cmluZztcbiAgICBpZiAoZGVkdXBlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHNpbmdsZURpc3BsYXkgPSBkZWR1cGVkWzBdIS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBwYW5lbFRpdGxlID0gc2luZ2xlRGlzcGxheSB8fCBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWxUaXRsZSA9IG9yZGVyTmFtZSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGRyQ29kZVN5c3RlbSA9IE5ISV9MQUJfQ09ERV9SRS50ZXN0KFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgPz8gXCJcIilcbiAgICAgID8gc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX0xBQl9DT0RFO1xuXG4gICAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICByZXNvdXJjZVR5cGU6IFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICAgICAgaWQ6IGRySWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjItMDA3NFwiLFxuICAgICAgICAgICAgICBjb2RlOiBcIkxBQlwiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIkxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjb2RlOiB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogZHJDb2RlU3lzdGVtLFxuICAgICAgICAgICAgY29kZTogU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKSB8fCBcIlVOS05PV05cIixcbiAgICAgICAgICAgIGRpc3BsYXk6IHBhbmVsVGl0bGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogcGFuZWxUaXRsZSxcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgcmVzdWx0OiBvYnNSZXNvdXJjZXMubWFwKChvKSA9PiAoeyByZWZlcmVuY2U6IGBPYnNlcnZhdGlvbi8ke28uaWR9YCB9KSksXG4gICAgfTtcbiAgICBpZiAobWV0YS5kYXRlKSBkci5lZmZlY3RpdmVEYXRlVGltZSA9IGAke21ldGEuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChtZXRhLmhvc3BpdGFsKSBkci5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBtZXRhLmhvc3BpdGFsIH1dO1xuXG4gICAgb3V0LnB1c2goZHIpO1xuICAgIG91dC5wdXNoKC4uLm9ic1Jlc291cmNlcyk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgY2xlYW5lZCA9IGZpbHRlckxhYlJvd3MocmF3SXRlbXMpO1xuICByZXR1cm4gZ3JvdXBCeU9yZGVyQ29kZShjbGVhbmVkLCBwYXRpZW50SWQpO1xufVxuIiwgIi8qKlxuICogUHJvY2VkdXJlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcHJvY2VkdXJlLnB5YC4gUmV0dXJucyBudWxsIGZvciBsaXN0LXBhZ2VcbiAqIHJvd3MgbGFja2luZyBub3RlL2JvZHlfc2l0ZSBcdTIwMTQgdGhlIGFsdGVybmF0aXZlIGlzIHRoZSBTTUFSVCBhcHAgc2hvd2luZ1xuICogMjUgXCJwcm9jZWR1cmVzXCIgY2FsbGVkIFwiTXljb2JhY3RlcmlhIGN1bHR1cmVcIiAvIFwiVmFnaW5hbCB1bHRyYXNvdW5kXCJcbiAqIC8gZXRjLiB3aGljaCBhcmUgY2xpbmljYWxseSB3cm9uZy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwiaWNkXCIpKSByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfUENTO1xuICByZXR1cm4gc3lzdGVtcy5ISVNfTE9DQUxfUFJPQ0VEVVJFX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQcm9jZWR1cmUoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IG5vdGUgPSAoKHJhdy5ub3RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICBjb25zdCBib2R5U2l0ZSA9ICgocmF3LmJvZHlfc2l0ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFub3RlICYmICFib2R5U2l0ZSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBQcm9jZWR1cmVcIjtcbiAgLy8gdjAuOC4wIGJpbGluZ3VhbDogcHJlZmVyIFx1N0U0MVx1NEUyRCBpbiBjb2RlLnRleHQgKHBhdGllbnQtZmFjaW5nKSB3aGlsZVxuICAvLyBjb2RpbmdbMF0uZGlzcGxheSBzdGF5cyBhcyB0aGUgdGVjaG5pY2FsIEVuZ2xpc2ggKGNhbm9uaWNhbCBmb3IgdGhlXG4gIC8vIFBDUyAvIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgc3lzdGVtKS4gRmFsbHMgYmFjayB0byBFbmdsaXNoIHdoZW4gTkhJIHNoaXBzXG4gIC8vIEVuZ2xpc2gtb25seSBmb3IgYSBwYXJ0aWN1bGFyIHByb2NlZHVyZSBjb2RlLlxuICBjb25zdCBkaXNwbGF5WmggPSAoKHJhdy5kaXNwbGF5X3poID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIlByb2NlZHVyZVwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3LmRhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogcmF3LnN0YXR1cyA/PyBcImNvbXBsZXRlZFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXlaaCxcbiAgICB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lZERhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAoYm9keVNpdGUpIHtcbiAgICByZXNvdXJjZS5ib2R5U2l0ZSA9IFt7IHRleHQ6IGJvZHlTaXRlIH1dO1xuICB9XG4gIGlmIChub3RlKSB7XG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IG5vdGUgfV07XG4gIH1cblxuICAvLyBwZXJmb3JtZXIuYWN0b3IgXHUyMDE0IGRpc3BsYXktb25seSBSZWZlcmVuY2UgKG5vIFByYWN0aXRpb25lciAvIE9yZ2FuaXphdGlvblxuICAvLyByZXNvdXJjZSBtaW50ZWQpLiBNaXJyb3JzIHRoZSBzYW1lIHNoYXBlIGFzIERpYWdub3N0aWNSZXBvcnQucGVyZm9ybWVyXG4gIC8vIGFuZCBNZWRpY2F0aW9uUmVxdWVzdC5yZXF1ZXN0ZXIuIEltcG9ydGFudCBmb3IgbGluay50czogdGhlIGVuY291bnRlclxuICAvLyBsaW5rZXIgbWF0Y2hlcyByZXNvdXJjZXMgdG8gRW5jb3VudGVycyBieSBwZXJmb3JtZXJbXS5kaXNwbGF5IChob3NwaXRhbClcbiAgLy8gKyBkYXRlIFx1MjAxNCB3aXRob3V0IHRoaXMgZmllbGQgYSBwcm9jZWR1cmUgZG9uZSBhdCB0aGUgc2FtZSBob3NwaXRhbCArXG4gIC8vIGRheSBhcyBhbiBFbmNvdW50ZXIgZG9lc24ndCBnZXQgaXRzIGBlbmNvdW50ZXJgIHJlZmVyZW5jZSBiYWNrLWZpbGxlZCxcbiAgLy8gc28gU01BUlQgYXBwcyBzaG93aW5nIFwicHJvY2VkdXJlcyBncm91cGVkIGJ5IHZpc2l0XCIgd291bGQgbGVhdmUgaXRcbiAgLy8gdW4tZ3JvdXBlZC5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2UucGVyZm9ybWVyID0gW3sgYWN0b3I6IHsgZGlzcGxheTogaG9zcGl0YWwgfSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgbWFwcGVyIGRpc3BhdGNoIHRhYmxlcy5cbiAqXG4gKiBDb25zdW1lZCBieSBiYWNrZW5kJ3MgYC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCBhbmQgdGhlIGV4dGVuc2lvbidzXG4gKiBsb2NhbC1tb2RlIGJ1bmRsZSBhc3NlbWJsZXIgc28gYm90aCBwcm9kdWNlIGlkZW50aWNhbCBGSElSIG91dHB1dC5cbiAqL1xuXG5pbXBvcnQgeyBtYXBBbGxlcmd5SW50b2xlcmFuY2UgfSBmcm9tIFwiLi9hbGxlcmd5XCI7XG5pbXBvcnQgeyBtYXBDb25kaXRpb24gfSBmcm9tIFwiLi9jb25kaXRpb25cIjtcbmltcG9ydCB7IG1hcERpYWdub3N0aWNSZXBvcnQgfSBmcm9tIFwiLi9kaWFnbm9zdGljLXJlcG9ydFwiO1xuaW1wb3J0IHsgbWFwRW5jb3VudGVyIH0gZnJvbSBcIi4vZW5jb3VudGVyXCI7XG5pbXBvcnQgeyBtYXBJbW11bml6YXRpb24gfSBmcm9tIFwiLi9pbW11bml6YXRpb25cIjtcbmltcG9ydCB7IG1hcE1lZGljYXRpb25SZXF1ZXN0LCBtYXBNZWRpY2F0aW9uc0RlZHVwIH0gZnJvbSBcIi4vbWVkaWNhdGlvblwiO1xuaW1wb3J0IHsgbWFwT2JzZXJ2YXRpb24sIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQgfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuaW1wb3J0IHsgbWFwUHJvY2VkdXJlIH0gZnJvbSBcIi4vcHJvY2VkdXJlXCI7XG5cbmV4cG9ydCB0eXBlIFBlclJvd01hcHBlciA9IChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbikgPT4gUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGw7XG5cbmV4cG9ydCB0eXBlIEdyb3VwTWFwcGVyID0gKGl0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpID0+IFJlY29yZDxzdHJpbmcsIGFueT5bXTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIChwZXItcm93IG1hcHBlciwgSlNPTiBsaXN0IGtleSBpbnNpZGUgTExNIHJlc3BvbnNlKS5cbiAqIFVzZWQgYnkgdGhlIExMTSBmYWxsYmFjayBwYXRoIGFmdGVyIGV4dHJhY3Rpb247IHRoZSBzdHJ1Y3R1cmVkIHBhdGhcbiAqIGFsc28gY29uc3VsdHMgaXQgZm9yIHBlci1yb3cgcmVzb3VyY2UgdHlwZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBMSVNUX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBbUGVyUm93TWFwcGVyLCBzdHJpbmddPiA9IHtcbiAgb2JzZXJ2YXRpb25zOiBbbWFwT2JzZXJ2YXRpb24sIFwib2JzZXJ2YXRpb25zXCJdLFxuICBtZWRpY2F0aW9uczogW21hcE1lZGljYXRpb25SZXF1ZXN0LCBcIm1lZGljYXRpb25zXCJdLFxuICBjb25kaXRpb25zOiBbbWFwQ29uZGl0aW9uLCBcImNvbmRpdGlvbnNcIl0sXG4gIGFsbGVyZ2llczogW21hcEFsbGVyZ3lJbnRvbGVyYW5jZSwgXCJhbGxlcmdpZXNcIl0sXG4gIGRpYWdub3N0aWNfcmVwb3J0czogW21hcERpYWdub3N0aWNSZXBvcnQsIFwiZGlhZ25vc3RpY19yZXBvcnRzXCJdLFxuICBwcm9jZWR1cmVzOiBbbWFwUHJvY2VkdXJlLCBcInByb2NlZHVyZXNcIl0sXG4gIGVuY291bnRlcnM6IFttYXBFbmNvdW50ZXIsIFwiZW5jb3VudGVyc1wiXSxcbiAgaW1tdW5pemF0aW9uczogW21hcEltbXVuaXphdGlvbiwgXCJpbW11bml6YXRpb25zXCJdLFxufTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIGdyb3VwLWF3YXJlIG1hcHBlciB0aGF0IHRha2VzIHRoZSBGVUxMIGxpc3QgYXQgb25jZS5cbiAqIFVzZWQgd2hlbiBjcm9zcy1yb3cgZ3JvdXBpbmcvZGVkdXAgaXMgcmVxdWlyZWQgKE5ISSBsYWIgcGFuZWxzLFxuICogXHU0RTJEXHU4MkYxIG1lZGljYXRpb24gXHU5NkQ5XHU4QTlFIGRlZHVwKS5cbiAqL1xuZXhwb3J0IGNvbnN0IEdST1VQX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBHcm91cE1hcHBlcj4gPSB7XG4gIG9ic2VydmF0aW9uczogbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCxcbiAgbWVkaWNhdGlvbnM6IG1hcE1lZGljYXRpb25zRGVkdXAsXG59O1xuIiwgIi8qKlxuICogRW5jb3VudGVyIGxpbmtlciBcdTIwMTQgbWF0Y2ggcmVzb3VyY2VzIHRvIEVuY291bnRlcnMgYnkgKGhvc3BpdGFsLCBkYXRlKS5cbiAqXG4gKiBQdXJlIGZ1bmN0aW9uOiBtdXRhdGVzIGByZXNvdXJjZXNgIGluIHBsYWNlIHRvIGFkZCBgZW5jb3VudGVyYFxuICogcmVmZXJlbmNlcyB3aGVuIHRoZXJlJ3MgYW4gdW5hbWJpZ3VvdXMgbWF0Y2ggaW4gdGhlIGNhbmRpZGF0ZVxuICogRW5jb3VudGVyIGxpc3QuIFNhbWUgbG9naWMgYXMgdGhlIGJhY2tlbmQncyBEQi1jb3VwbGVkIHZlcnNpb24sXG4gKiBsaWZ0ZWQgb3V0IHNvIHRoZSBleHRlbnNpb24ncyBsb2NhbCBtb2RlIGNhbiBjYWxsIGl0IG9uIGFuXG4gKiBpbi1tZW1vcnkgYXJyYXkuXG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlSW50ZXJwcmV0YXRpb24gfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuXG5jb25zdCBFTkNPVU5URVJfTElOS0FCTEUgPSBuZXcgU2V0KFtcbiAgXCJPYnNlcnZhdGlvblwiLFxuICBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gIFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICBcIlByb2NlZHVyZVwiLFxuICBcIkNvbmRpdGlvblwiLFxuICBcIkFsbGVyZ3lJbnRvbGVyYW5jZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIHJlc291cmNlRGF0ZShyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgW1xuICAgIFwiZWZmZWN0aXZlRGF0ZVRpbWVcIixcbiAgICBcImF1dGhvcmVkT25cIixcbiAgICBcInBlcmZvcm1lZERhdGVUaW1lXCIsXG4gICAgXCJvbnNldERhdGVUaW1lXCIsXG4gICAgXCJyZWNvcmRlZERhdGVcIixcbiAgICBcImlzc3VlZFwiLFxuICBdKSB7XG4gICAgY29uc3QgdiA9IHJba2V5XTtcbiAgICBpZiAodikgcmV0dXJuIFN0cmluZyh2KS5zbGljZSgwLCAxMCk7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgb2YgW1wiZWZmZWN0aXZlUGVyaW9kXCIsIFwicGVyZm9ybWVkUGVyaW9kXCJdKSB7XG4gICAgY29uc3QgcGVyaW9kID0gcltrZXldO1xuICAgIGlmIChwZXJpb2QgJiYgdHlwZW9mIHBlcmlvZCA9PT0gXCJvYmplY3RcIiAmJiBwZXJpb2Quc3RhcnQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcocGVyaW9kLnN0YXJ0KS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5mdW5jdGlvbiByZXNvdXJjZUhvc3BpdGFsKHI6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICAvLyBwZXJmb3JtZXIgc2hhcGUgZGlmZmVycyBieSByZXNvdXJjZSB0eXBlOlxuICAvLyAgIE9ic2VydmF0aW9uIC8gRGlhZ25vc3RpY1JlcG9ydDogUmVmZXJlbmNlW10gICAgICAgICAgICAgIFx1MjE5MiBwLmRpc3BsYXlcbiAgLy8gICBQcm9jZWR1cmU6ICAgICAgICAgICAgICAgICAgICAgIEJhY2tib25lRWxlbWVudFtdICAgICAgICBcdTIxOTIgcC5hY3Rvci5kaXNwbGF5XG4gIC8vIEZISVIgUjQgXHUwMEE3UHJvY2VkdXJlLnBlcmZvcm1lciBpcyB0aGUgb25seSBwbGFjZSB3ZSBoaXQgYSBCYWNrYm9uZUVsZW1lbnQuXG4gIGZvciAoY29uc3QgcCBvZiByLnBlcmZvcm1lciA/PyBbXSkge1xuICAgIGlmICghcCB8fCB0eXBlb2YgcCAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgaWYgKHR5cGVvZiBwLmRpc3BsYXkgPT09IFwic3RyaW5nXCIgJiYgcC5kaXNwbGF5KSByZXR1cm4gcC5kaXNwbGF5O1xuICAgIGNvbnN0IGFjdG9yID0gcC5hY3RvcjtcbiAgICBpZiAoYWN0b3IgJiYgdHlwZW9mIGFjdG9yID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBhY3Rvci5kaXNwbGF5ID09PSBcInN0cmluZ1wiICYmIGFjdG9yLmRpc3BsYXkpIHtcbiAgICAgIHJldHVybiBhY3Rvci5kaXNwbGF5O1xuICAgIH1cbiAgfVxuICBjb25zdCByZXEgPSByLnJlcXVlc3RlciA/PyB7fTtcbiAgaWYgKHJlcSAmJiB0eXBlb2YgcmVxID09PSBcIm9iamVjdFwiICYmIHJlcS5kaXNwbGF5KSByZXR1cm4gcmVxLmRpc3BsYXk7XG4gIHJldHVybiBcIlwiO1xufVxuXG4vKipcbiAqIERyb3AgQU1CIEVuY291bnRlcnMgd2hvc2UgKGhvc3BpdGFsLCBzdGFydF9kYXRlKSBpcyBhbHJlYWR5IGNvdmVyZWRcbiAqIGJ5IGFuIElNUCBFbmNvdW50ZXIncyBhZG1pc3Npb24gZGF5LiBOSEkgZW1pdHMgdGhlIHNhbWUgaW5wYXRpZW50XG4gKiBzdGF5IHR3aWNlIChJSEtFMzMwMyBBTUIgYmlsbGluZyBlbnRyeSArIElIS0UzMzA5IElNUCBkZXRhaWwpOyB0aGVcbiAqIElNUCBvbmUgaXMgY2Fub25pY2FsLCB0aGUgQU1CIGlzIGEgYmlsbGluZyBhcnRlZmFjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwQWRtaXNzaW9uRGF5QW1iKFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGltcFN0YXJ0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIkVuY291bnRlclwiKSBjb250aW51ZTtcbiAgICBpZiAoKHIuY2xhc3MgPz8ge30pLmNvZGUgIT09IFwiSU1QXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoaG9zcCAmJiBzdGFydCkgaW1wU3RhcnRzLmFkZChgJHtob3NwfSAke3N0YXJ0fWApO1xuICB9XG4gIGlmIChpbXBTdGFydHMuc2l6ZSA9PT0gMCkgcmV0dXJuIHJlc291cmNlcztcbiAgcmV0dXJuIHJlc291cmNlcy5maWx0ZXIoKHIpID0+IHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgPT09IFwiRW5jb3VudGVyXCIgJiYgKHIuY2xhc3MgPz8ge30pLmNvZGUgPT09IFwiQU1CXCIpIHtcbiAgICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChyLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGltcFN0YXJ0cy5oYXMoYCR7aG9zcH0gJHtzdGFydH1gKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIGBlbmNvdW50ZXJgIHJlZmVyZW5jZSB0byBlYWNoIGxpbmthYmxlIHJlc291cmNlIHdoZW4gaXRzXG4gKiAoaG9zcGl0YWwsIGRhdGUpIG1hdGNoZXMgZXhhY3RseSBPTkUgRW5jb3VudGVyIGluIGBjYW5kaWRhdGVzYC5cbiAqIENvbnNlcnZhdGl2ZSBcdTIwMTQgbGVhdmVzIGFtYmlndW91cyAoMCBvciA+MSBtYXRjaCkgY2FzZXMgdW5saW5rZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzKFxuICBjYW5kaWRhdGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogdm9pZCB7XG4gIGlmIChjYW5kaWRhdGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICBjb25zdCBleGFjdEluZGV4ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBjb25zdCBpbXBCeUhvc3AgPSBuZXcgTWFwPHN0cmluZywgQXJyYXk8W3N0cmluZywgc3RyaW5nLCBzdHJpbmddPj4oKTtcblxuICBmb3IgKGNvbnN0IGUgb2YgY2FuZGlkYXRlcykge1xuICAgIGlmIChlLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IChlLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChlLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgIGlmICghaG9zcCB8fCAhc3RhcnQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGtleSA9IGAke2hvc3B9ICR7c3RhcnR9YDtcbiAgICBjb25zdCBhcnIgPSBleGFjdEluZGV4LmdldChrZXkpID8/IFtdO1xuICAgIGFyci5wdXNoKGUuaWQpO1xuICAgIGV4YWN0SW5kZXguc2V0KGtleSwgYXJyKTtcbiAgICBjb25zdCBjbHMgPSAoZS5jbGFzcyA/PyB7fSkuY29kZSA/PyBcIlwiO1xuICAgIGlmIChjbHMgPT09IFwiSU1QXCIpIHtcbiAgICAgIGNvbnN0IGVuZCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLmVuZCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgICBpZiAoZW5kKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdO1xuICAgICAgICBsaXN0LnB1c2goW3N0YXJ0LCBlbmQsIGUuaWRdKTtcbiAgICAgICAgaW1wQnlIb3NwLnNldChob3NwLCBsaXN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZXhhY3RJbmRleC5zaXplID09PSAwICYmIGltcEJ5SG9zcC5zaXplID09PSAwKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmICghRU5DT1VOVEVSX0xJTktBQkxFLmhhcyhyLnJlc291cmNlVHlwZSkpIGNvbnRpbnVlO1xuICAgIGlmIChyLmVuY291bnRlciB8fCByLmNvbnRleHQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSByZXNvdXJjZUhvc3BpdGFsKHIpO1xuICAgIGNvbnN0IGRhdGUgPSByZXNvdXJjZURhdGUocik7XG4gICAgaWYgKCFob3NwIHx8ICFkYXRlKSBjb250aW51ZTtcbiAgICBjb25zdCBtYXRjaGVzOiBzdHJpbmdbXSA9IFsuLi4oZXhhY3RJbmRleC5nZXQoYCR7aG9zcH0gJHtkYXRlfWApID8/IFtdKV07XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGNvbnN0IFtzdGFydCwgZW5kLCBlaWRdIG9mIGltcEJ5SG9zcC5nZXQoaG9zcCkgPz8gW10pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDw9IGRhdGUgJiYgZGF0ZSA8PSBlbmQpIG1hdGNoZXMucHVzaChlaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggIT09IDEpIGNvbnRpbnVlO1xuICAgIHIuZW5jb3VudGVyID0geyByZWZlcmVuY2U6IGBFbmNvdW50ZXIvJHttYXRjaGVzWzBdfWAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFdoZW4gYW4gT2JzZXJ2YXRpb24gY2FycmllcyBtdWx0aXBsZSByZWZlcmVuY2VSYW5nZSBlbnRyaWVzIHRhZ2dlZFxuICogd2l0aCBgYXBwbGllc1RvWypdLmNvZGluZy5jb2RlYCBpbiB7bWFsZSwgZmVtYWxlfSwgcGljayB0aGUgb25lIHRoYXRcbiAqIG1hdGNoZXMgdGhlIHBhdGllbnQncyBnZW5kZXIgYW5kIHJlLWRlcml2ZSBpbnRlcnByZXRhdGlvbiBhZ2FpbnN0IGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMoXG4gIHBhdGllbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoIXBhdGllbnQpIHJldHVybjtcbiAgY29uc3QgZ2VuZGVyID0gU3RyaW5nKHBhdGllbnQuZ2VuZGVyID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChnZW5kZXIgIT09IFwibWFsZVwiICYmIGdlbmRlciAhPT0gXCJmZW1hbGVcIikgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgIT09IFwiT2JzZXJ2YXRpb25cIikgY29udGludWU7XG4gICAgY29uc3QgcnJzOiBhbnlbXSA9IHIucmVmZXJlbmNlUmFuZ2UgPz8gW107XG4gICAgaWYgKHJycy5sZW5ndGggPCAyKSBjb250aW51ZTtcblxuICAgIGxldCBtYXRjaDogYW55ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJycykge1xuICAgICAgZm9yIChjb25zdCBhcCBvZiBlbnRyeS5hcHBsaWVzVG8gPz8gW10pIHtcbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGFwLmNvZGluZyA/PyBbXSkge1xuICAgICAgICAgIGlmIChTdHJpbmcoYy5jb2RlID8/IFwiXCIpLnRvTG93ZXJDYXNlKCkgPT09IGdlbmRlcikge1xuICAgICAgICAgICAgbWF0Y2ggPSBlbnRyeTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2gpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICB9XG4gICAgaWYgKCFtYXRjaCkgY29udGludWU7XG5cbiAgICByLnJlZmVyZW5jZVJhbmdlID0gW21hdGNoXTtcbiAgICBjb25zdCB2YWxTdHIgPVxuICAgICAgU3RyaW5nKChyLnZhbHVlUXVhbnRpdHkgPz8ge30pLnZhbHVlID8/IFwiXCIpIHx8IFN0cmluZyhyLnZhbHVlU3RyaW5nID8/IFwiXCIpO1xuICAgIGNvbnN0IG5ld0ludGVycCA9IGRlcml2ZUludGVycHJldGF0aW9uKHZhbFN0ciwgci52YWx1ZVF1YW50aXR5ID8/IG51bGwsIG1hdGNoKTtcbiAgICBpZiAobmV3SW50ZXJwKSB7XG4gICAgICByLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbbmV3SW50ZXJwXSB9XTtcbiAgICB9XG4gIH1cbn1cbiIsICIvKipcbiAqIFBhdGllbnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9wYXRpZW50LnB5YC4gU2FtZSBwdWJsaWMgQVBJOlxuICogICAtIGxvb2tzTGlrZVR3TmF0aW9uYWxJZCh2YWx1ZSkgXHUyMDE0IGV4cG9zZWQgZm9yIHRlc3RzXG4gKiAgIC0gbWFwUGF0aWVudChyYXcpIFx1MjAxNCBtYWluIGVudHJ5XG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlUGF0aWVudElkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5cbi8vIFRhaXdhbiBuYXRpb25hbCBJRDogMSBsZXR0ZXIgKyA5IGRpZ2l0cyAoQTEyMzQ1Njc4OSkuIFVzZWQgdG8gZGVjaWRlXG4vLyB3aGV0aGVyIHRoZSBwb3B1cC1zdXBwbGllZCBwYXRpZW50X2lkIHNob3VsZCBiZSBjb2RlZCB1bmRlciB0aGVcbi8vIGNhbm9uaWNhbCBuYXRpb25hbC1pZCBzeXN0ZW0gb3IgYXMgYSBsb2NhbCBob3NwaXRhbCBNUk4uXG5jb25zdCBUV19OQVRJT05BTF9JRF9SRSA9IC9eW0EtWl1bMTJdXFxkezh9JC87XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gVFdfTkFUSU9OQUxfSURfUkUudGVzdCh2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQYXRpZW50KHJhdzogUmVjb3JkPHN0cmluZywgYW55Pik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCByYXdJZCA9IFN0cmluZyhyYXcuaWRlbnRpZmllciA/PyByYXcuaWQgPz8gXCJ1bmtub3duXCIpO1xuICAvLyBGSElSIFBhdGllbnQuaWQgaXMgdGhlIGhhc2hlZC9zYWx0ZWQgZm9ybS4gUmVhbCBuYXRpb25hbCBJRCBzdGF5c1xuICAvLyBvbmx5IGluIGlkZW50aWZpZXJbXS52YWx1ZSBzbyBhIGxlYWtlZCBCdW5kbGUgKG9yIGEgU01BUlQgYXBwIHRva2VuXG4gIC8vIHBheWxvYWQgY29udGFpbmluZyBwYXRpZW50X2lkKSBkb2Vzbid0IGRpc2Nsb3NlIGl0IHZpYSBldmVyeVxuICAvLyBzdWJqZWN0LnJlZmVyZW5jZS5cbiAgY29uc3QgcGF0aWVudElkID0gZGVyaXZlUGF0aWVudElkKHJhd0lkKTtcblxuICAvLyBVc2UgYD8/YCAobm90IGp1c3QgZGVmYXVsdCBhcmcpIHNvIGV4cGxpY2l0IG51bGwgZnJvbSB0aGUgTExNIGFsc29cbiAgLy8gZmFsbHMgYmFjay4gTG9jYWwgbW9kZWxzIHNvbWV0aW1lcyBlbWl0IG51bGwgaW5zdGVhZCBvZiBvbWl0dGluZy5cbiAgLy8gVGhlIGNhbGxlciBkZWNpZGVzIHdoZXRoZXIgYHJhdy5uYW1lYCBpcyB0aGUgdXNlcidzIHJlYWwgbmFtZSBvclxuICAvLyBhbHJlYWR5LW1hc2tlZCBcdTIwMTQgbWFwUGF0aWVudCBqdXN0IHRyYW5zY3JpYmVzLiBNYXNraW5nIHBvbGljeSBsaXZlc1xuICAvLyBhdCB0aGUgVUkgLyBleHRlbnNpb24gbGF5ZXIgKGRyaXZlbiBieSB0aGUgdXNlci10b2dnbGVhYmxlXG4gIC8vIGBtYXNrTmFtZUVuYWJsZWRgIHNldHRpbmcpIHNvIHRoZSBzYW1lIG1hcHBlciBpcyBjb3JyZWN0IGZvciBib3RoXG4gIC8vIFwiXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4ID0gcmVhbCBuYW1lXCIgYW5kIFwiXHU5MUFCXHU3NjQyXHU0RUJBXHU1NEUxXHU1OTFBXHU3NUM1XHU0RUJBID0gbWFza2VkXCIgd29ya2Zsb3dzLlxuICBjb25zdCBuYW1lVGV4dCA9IChyYXcubmFtZSA/PyBudWxsKSB8fCBcIlVua25vd25cIjtcbiAgY29uc3QgcGhvbmUgPSAocmF3LnBob25lID8/IG51bGwpIHx8IFwiXCI7XG4gIGNvbnN0IGFkZHJlc3MgPSAocmF3LmFkZHJlc3MgPz8gbnVsbCkgfHwgXCJcIjtcblxuICBjb25zdCBbZmFtaWx5LCBnaXZlbl0gPSBzcGxpdE5hbWUobmFtZVRleHQpO1xuICBjb25zdCBuYW1lRW50cnk6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IHVzZTogXCJvZmZpY2lhbFwiLCB0ZXh0OiBuYW1lVGV4dCB9O1xuICBpZiAoZmFtaWx5KSBuYW1lRW50cnkuZmFtaWx5ID0gZmFtaWx5O1xuICBpZiAoZ2l2ZW4ubGVuZ3RoID4gMCkgbmFtZUVudHJ5LmdpdmVuID0gZ2l2ZW47XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIlBhdGllbnRcIixcbiAgICBpZDogcGF0aWVudElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICB7XG4gICAgICAgIHVzZTogXCJvZmZpY2lhbFwiLFxuICAgICAgICBzeXN0ZW06IGxvb2tzTGlrZVR3TmF0aW9uYWxJZChyYXdJZClcbiAgICAgICAgICA/IHN5c3RlbXMuVFdfTkFUSU9OQUxfSURcbiAgICAgICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1BBVElFTlRfTVJOLFxuICAgICAgICB2YWx1ZTogcmF3SWQsXG4gICAgICB9LFxuICAgIF0sXG4gICAgbmFtZTogW25hbWVFbnRyeV0sXG4gICAgZ2VuZGVyOiBtYXBHZW5kZXIocmF3LmdlbmRlciksXG4gIH07XG5cbiAgY29uc3QgYmlydGhEYXRlID0gcmF3LmJpcnRoRGF0ZTtcbiAgaWYgKGJpcnRoRGF0ZSkgcmVzb3VyY2UuYmlydGhEYXRlID0gYmlydGhEYXRlO1xuXG4gIGlmIChwaG9uZSkge1xuICAgIHJlc291cmNlLnRlbGVjb20gPSBbeyBzeXN0ZW06IFwicGhvbmVcIiwgdXNlOiBcImhvbWVcIiwgdmFsdWU6IHBob25lIH1dO1xuICB9XG5cbiAgaWYgKGFkZHJlc3MpIHtcbiAgICByZXNvdXJjZS5hZGRyZXNzID0gW3sgdXNlOiBcImhvbWVcIiwgdGV4dDogYWRkcmVzcyB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLyoqXG4gKiBTcGxpdCBhIGZ1bGwgbmFtZSBpbnRvIFtmYW1pbHksIFtnaXZlbl1dIGZvciBGSElSIFBhdGllbnQubmFtZS5cbiAqXG4gKiBIZXVyaXN0aWNzOlxuICogICAtIENvbnRhaW5zIHdoaXRlc3BhY2UgXHUyMTkyIFdlc3Rlcm46IGxhc3QgdG9rZW4gPSBmYW1pbHksIHJlc3QgPSBnaXZlbi5cbiAqICAgLSBDSksgLyBzaW5nbGUtdG9rZW4gXHUyMTkyIGZpcnN0IGNoYXIgPSBmYW1pbHksIHJlbWFpbmRlciA9IGdpdmVuLlxuICogICAtIFwiVW5rbm93blwiIG9yIGVtcHR5IFx1MjE5MiBbXCJcIiwgW11dXG4gKlxuICogVHdvLWNoYXIgQ0pLIGZhbWlseSBuYW1lcyAoXHU2QjUwXHU5NjdELCBcdTUzRjhcdTk5QUMsIFx1MjAyNikgYXJlIE5PVCBhdXRvLWRldGVjdGVkLlxuICovXG5mdW5jdGlvbiBzcGxpdE5hbWUoZnVsbE5hbWU6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ1tdXSB7XG4gIGNvbnN0IG5hbWUgPSAoZnVsbE5hbWUgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIW5hbWUgfHwgbmFtZSA9PT0gXCJVbmtub3duXCIpIHJldHVybiBbXCJcIiwgW11dO1xuICBpZiAoL1xccy8udGVzdChuYW1lKSkge1xuICAgIGNvbnN0IHBhcnRzID0gbmFtZS5zcGxpdCgvXFxzKy8pO1xuICAgIHJldHVybiBbcGFydHNbcGFydHMubGVuZ3RoIC0gMV0hLCBwYXJ0cy5zbGljZSgwLCAtMSldO1xuICB9XG4gIC8vIENKSyBmYWxsYmFjayBcdTIwMTQgaXRlcmF0ZSBjb2RlcG9pbnRzLCBub3QgVVRGLTE2IGNvZGUgdW5pdHMsIHNvXG4gIC8vIHN1cnJvZ2F0ZS1wYWlyIGNoYXJhY3RlcnMgKHJhcmUgaW4gQ2hpbmVzZSBuYW1lcyBidXQgcG9zc2libGUpXG4gIC8vIGRvbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjb2RlcG9pbnRzID0gQXJyYXkuZnJvbShuYW1lKTtcbiAgcmV0dXJuIGNvZGVwb2ludHMubGVuZ3RoID4gMSA/IFtjb2RlcG9pbnRzWzBdISwgW2NvZGVwb2ludHMuc2xpY2UoMSkuam9pbihcIlwiKV1dIDogW25hbWUsIFtdXTtcbn1cblxuZnVuY3Rpb24gbWFwR2VuZGVyKGdlbmRlcjogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IGcgPSB0eXBlb2YgZ2VuZGVyID09PSBcInN0cmluZ1wiID8gZ2VuZGVyLnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAoW1wibWFsZVwiLCBcIm1cIiwgXCJcdTc1MzdcIiwgXCJcdTc1MzdcdTYwMjdcIl0uaW5jbHVkZXMoZykpIHJldHVybiBcIm1hbGVcIjtcbiAgaWYgKFtcImZlbWFsZVwiLCBcImZcIiwgXCJcdTU5NzNcIiwgXCJcdTU5NzNcdTYwMjdcIl0uaW5jbHVkZXMoZykpIHJldHVybiBcImZlbWFsZVwiO1xuICByZXR1cm4gXCJ1bmtub3duXCI7XG59XG4iLCAiLy8gTkhJIEpTT04gXHUyMTkyIG5vcm1hbGl6ZWQgc2hhcGUgYWRhcHRlcnMuXG4vL1xuLy8gRXh0cmFjdGVkIGZyb20gYmFja2dyb3VuZC5qcyBzbyBlYWNoIGFkYXB0ZXIgY2FuIGJlIHVuaXQtdGVzdGVkIGluXG4vLyBpc29sYXRpb24uIGJhY2tncm91bmQuanMgaW1wb3J0cyBldmVyeXRoaW5nIGJlbG93OyB0aGUgbGl2ZSBTVyBnbHVlc1xuLy8gdGhlc2Ugb250byBmZXRjaGVkIHBheWxvYWRzIHZpYSB0aGUgZW5kcG9pbnQgcmVnaXN0cnkuXG4vL1xuLy8gV2h5IGV4dHJhY3Q6IHRoZSB2MC42LjEgbGFiK2ltYWdpbmcgZGF0ZS1maWVsZCBidWdzIChjb21taXRzIGIzNzg4NWYgL1xuLy8gOGMxOTkwMSkgc2hpcHBlZCBiZWNhdXNlIHRoZXNlIGZ1bmN0aW9ucyBoYWQgWkVSTyB0ZXN0IGNvdmVyYWdlIFx1MjAxNFxuLy8gYmFja2dyb3VuZC5qcyBjYW4ndCBiZSBsb2FkZWQgaW4gYSB0ZXN0IGVudmlyb25tZW50IChjaHJvbWUuKiBBUElzLFxuLy8gU1cgZ2xvYmFscyksIHNvIHRoZSBhZGFwdCogbG9naWMgcm9kZSBhbG9uZyB1bnRlc3RlZC4gUHVsbGluZyB0aGVtXG4vLyBpbnRvIGEgcHVyZS1mdW5jdGlvbiBtb2R1bGUgbGV0cyB2aXRlc3QgdmVyaWZ5IGZpZWxkLXByaW9yaXR5XG4vLyBkZWNpc2lvbnMgcm93LWJ5LXJvdy5cblxuLy8gQ29udmVydCBOSEkncyBcdTZDMTFcdTU3MEIgZGF0ZSBcIjExNS8wNS8wNVwiIFx1MjE5MiBJU08gXCIyMDI2LTA1LTA1XCIuXG4vLyBTb21lIE5ISSBmaWVsZHMgZW1iZWQgYm90aCBST0MgYW5kIEdyZWdvcmlhbjogXCIxMTUvMDUvMDV8fDIwMjYvMDUvMDVcIiBcdTIwMTQgd2Vcbi8vIGp1c3QgbWF0Y2ggdGhlIGZpcnN0IHNlZ21lbnQuXG5leHBvcnQgZnVuY3Rpb24gcm9jVG9JU08ocm9jRGF0ZSkge1xuICBpZiAoIXJvY0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKHJvY0RhdGUpLm1hdGNoKC9eKFxcZHsyLDN9KVsvLi1dKFxcZHsxLDJ9KVsvLi1dKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApICsgMTkxMTtcbiAgcmV0dXJuIGAke3l9LSR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LSR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gSW52ZXJzZTogSVNPIFwiMjAyMy0wNS0wNVwiIFx1MjE5MiBST0MgXCIxMTIvMDUvMDVcIi4gVXNlZCB0byBidWlsZCBOSEkgZGF0ZS1yYW5nZVxuLy8gcXVlcnkgc3RyaW5ncyAodGhlaXIgZm9ybXMgZXhwZWN0IFx1NkMxMVx1NTcwQiBmb3JtYXQpLlxuZXhwb3J0IGZ1bmN0aW9uIGlzb1RvUk9DKGlzb0RhdGUpIHtcbiAgaWYgKCFpc29EYXRlKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgbSA9IFN0cmluZyhpc29EYXRlKS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApIC0gMTkxMTtcbiAgaWYgKHkgPCAxKSByZXR1cm4gXCJcIjsgLy8gcHJlLVx1NkMxMVx1NTcwQiBkYXRlcyBtYWtlIG5vIHNlbnNlIHRvIE5ISVxuICByZXR1cm4gYCR7eX0vJHttWzJdLnBhZFN0YXJ0KDIsIFwiMFwiKX0vJHttWzNdLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xufVxuXG4vLyBOSEkgYmlsaW5ndWFsIGZpZWxkcyB1c2UgXCJcdTRFMkRcdTY1ODd8fEVuZ2xpc2hcIiBcdTIwMTQgY2xpbmljaWFucyBzY2FuIEVuZ2xpc2ggZmFzdGVyLFxuLy8gc28gcHJlZmVyIHRoYXQgc2lkZS4gSWYgdGhlcmUncyBubyBgfHxgIHdlIGp1c3QgcmV0dXJuIHRoZSBpbnB1dCB0cmltbWVkLlxuZXhwb3J0IGZ1bmN0aW9uIHBpY2tFbmdsaXNoKHMpIHtcbiAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc3RyID0gU3RyaW5nKHMpO1xuICBjb25zdCBpZHggPSBzdHIuaW5kZXhPZihcInx8XCIpO1xuICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuIHN0ci50cmltKCk7XG4gIGNvbnN0IGVuID0gc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKTtcbiAgcmV0dXJuIGVuIHx8IHN0ci5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbn1cblxuLy8gTWlycm9yIG9mIHBpY2tFbmdsaXNoIFx1MjAxNCBleHRyYWN0IHRoZSBcdTRFMkRcdTY1ODcgaGFsZiBvZiBhIGJpbGluZ3VhbFxuLy8gXCJcdTRFMkRcdTY1ODd8fEVuZ2xpc2hcIiBOSEkgZmllbGQuIFJldHVybnMgXCJcIiB3aGVuIGlucHV0IGlzIGVtcHR5LiBGYWxscyBiYWNrXG4vLyB0byB0aGUgd2hvbGUgc3RyaW5nIHdoZW4gbm8gc2VwYXJhdG9yIGV4aXN0cyAoZGVmZW5zaXZlOiBzb21lIE5ISSByb3dzXG4vLyBzaGlwIG9ubHkgb25lIGxhbmd1YWdlKS4gVXNlZCBieSB0aGUgdjAuOC4wIGJpbGluZ3VhbCBtYXBwaW5nIHNvXG4vLyBGSElSIGBDb2RlYWJsZUNvbmNlcHQudGV4dGAgY2FycmllcyB0aGUgcGF0aWVudC1mYWNpbmcgXHU3RTQxXHU0RTJEIGZvcm1cbi8vIHdoaWxlIGBjb2RpbmdbXS5kaXNwbGF5YCBzdGF5cyBhcyB0aGUgY2xpbmljYWwvdGVjaG5pY2FsIEVuZ2xpc2guXG5leHBvcnQgZnVuY3Rpb24gcGlja0NoaW5lc2Uocykge1xuICBpZiAocyA9PT0gbnVsbCB8fCBzID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBjb25zdCBzdHIgPSBTdHJpbmcocyk7XG4gIGNvbnN0IGlkeCA9IHN0ci5pbmRleE9mKFwifHxcIik7XG4gIGlmIChpZHggPT09IC0xKSByZXR1cm4gc3RyLnRyaW0oKTtcbiAgY29uc3QgemggPSBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG4gIHJldHVybiB6aCB8fCBzdHIuc2xpY2UoaWR4ICsgMikudHJpbSgpO1xufVxuXG4vLyBTdHJpcCB0cmFpbGluZyBwdW5jdHVhdGlvbiAvIHdoaXRlc3BhY2UganVuayB0aGF0IHNvbWUgaG9zcGl0YWxzIGxlYXZlXG4vLyBvbiB0aGVpciBmcmVlLXRleHQgbGFiIGxhYmVscyAoZS5nLiBOSEkgcmV0dXJucyBcIkNyZWEsXCIgZnJvbSBvbmUgc2l0ZVxuLy8gYW5kIFwiQ3JlYVwiIGZyb20gYW5vdGhlciBmb3IgdGhlIHNhbWUgcGh5c2ljYWwgdGVzdCkuIFByZS1ub3JtYWxpemluZ1xuLy8gaGVyZSBtZWFucyB0aGUgT2JzZXJ2YXRpb24uY29kZS50ZXh0IGRvd25zdHJlYW0gcmVhZHMgY2xlYW5seSBldmVuXG4vLyB3aGVuIGRvd25zdHJlYW0gVUlzIHN0aWxsIGhhcHBlbiB0byByZW5kZXIgYGNvZGUudGV4dGAgaW5zdGVhZCBvZlxuLy8gcHVsbGluZyBkaXNwbGF5IGZyb20gdGhlIExPSU5DIC8gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBjb2RpbmcuXG5mdW5jdGlvbiBfY2xlYW5MYWJOYW1lKHMpIHtcbiAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgcmV0dXJuIFN0cmluZyhzKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWyxcdUZGMEM7XHVGRjFCXStcXHMqJC8sIFwiXCIpICAvLyB0cmFpbGluZyBcdTUzNEFcdTVGNjIgLyBcdTUxNjhcdTVGNjIgcHVuY3R1YXRpb25cbiAgICAudHJpbSgpO1xufVxuXG4vLyBBZGFwdGVyIGZvciBOSEkgbGFiL29ic2VydmF0aW9uIEpTT04gc2hhcGUgKGNvbmZpcm1lZCBmb3IgSUhLRTM0MDlTMDE7XG4vLyBvdGhlciBsYWIgZW5kcG9pbnRzIGxpa2VseSB1c2UgdGhlIHNhbWUgZmllbGRzKS5cbi8vXG4vLyBEYXRlIGZpZWxkIGNob2ljZSBcdTIwMTQgSUhLRTM0MDkgcmV0dXJucyB0aHJlZSBkYXRlLWlzaCBmaWVsZHMgcGVyIHJvdzpcbi8vICAgLSBmdW5DX0RBVEUgICAgICAgICAgXHU1QzMxXHU4QTNBXHU2NUU1IC8gXHU1MTY1XHU5NjYyXHU2NUU1ICh2aXNpdCByZWdpc3RyYXRpb24gLyBhZG1pc3Npb24pXG4vLyAgIC0gcmVhTF9JTlNQRUNUX0RBVEUgIFx1NUJFNlx1OTY5Qlx1NjNBMVx1NkFBMlx1NjVFNSAoYWN0dWFsIHNhbXBsZS1jb2xsZWN0aW9uIGRhdGUpXG4vLyAgIC0gYXNzYVlfVVBMT0FEX0RBVEUgIFx1NEUwQVx1NTBCM1x1NjVFNSAod2hlbiB0aGUgcmVzdWx0IGhpdCBOSEkncyBzZXJ2ZXIpXG4vLyBGb3IgYW4gaW5wYXRpZW50LCBmdW5DX0RBVEUgaXMgdGhlIGFkbWlzc2lvbiBkYXkgYW5kIGV2ZXJ5IGxhYiBkcmF3blxuLy8gZHVyaW5nIHRoZSBzdGF5IGNhcnJpZXMgdGhlIHNhbWUgZnVuQ19EQVRFIFx1MjAxNCB1c2luZyBpdCBhcyBPYnNlcnZhdGlvbi5cbi8vIGVmZmVjdGl2ZURhdGVUaW1lIG1hZGUgYWxsIFx1NEY0Rlx1OTY2Mlx1NjcxRlx1OTU5MyBsYWJzIGxvb2sgbGlrZSB0aGV5IHdlcmUgZHJhd25cbi8vIG9uIGRheSAxLiBGSElSJ3MgXCJwaHlzaW9sb2dpY2FsbHkgcmVsZXZhbnQgdGltZVwiIGZvciBhIGxhYiBPYnNlcnZhdGlvblxuLy8gaXMgdGhlIHNhbXBsZS1jb2xsZWN0aW9uIGRhdGUsIHNvIHByZWZlciByZWFMX0lOU1BFQ1RfREFURSB3aGVuIE5ISVxuLy8gcmV0dXJucyBpdDsgZmFsbCBiYWNrIHRvIGZ1bkNfREFURSBvbmx5IHdoZW4gdGhlIGluc3BlY3QgZmllbGQgaXNcbi8vIG1pc3NpbmcgKG9sZGVyIHJvd3MgLyBlbmRwb2ludHMgdGhhdCBkb24ndCBjYXJyeSBpdCkuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRMYWJJdGVtKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKFxuICAgIGl0ZW0ucmVhTF9JTlNQRUNUX0RBVEUgfHwgaXRlbS5yZWFsX2luc3BlY3RfZGF0ZSB8fCBpdGVtLmZ1bkNfREFURSxcbiAgKTtcbiAgY29uc3QgdmFsdWUgPSBpdGVtLmFzc2FZX1ZBTFVFO1xuICBpZiAoIWRhdGUgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIC8vIERpc3BsYXkgbmFtZSBmYWxsYmFjayBjaGFpbiAoYWxsIG5vcm1hbGl6ZWQgZm9yIHRyYWlsaW5nIHB1bmN0dWF0aW9uKTpcbiAgLy8gICAxLiBhc3NhWV9JVEVNX05BTUUgXHUyMDE0IGhvc3BpdGFsJ3MgZnVsbCBmcmVlLXRleHQgbGFiZWxcbiAgLy8gICAyLiBvcmRlcl9zaG9ydG5hbWUgXHUyMDE0IE5ISSdzIFVJLXRydW5jYXRlZCBsYWJlbCAob2Z0ZW4gZW5kcyBcIi4uLlwiKVxuICAvLyAgIDMuIG9yZGVSX05BTUUgICAgICBcdTIwMTQgTkhJJ3MgY2Fub25pY2FsIFx1OTFBQlx1NEVFNFx1NzhCQyBkaWN0aW9uYXJ5IG5hbWVcbiAgLy8gYXNzYVlfSVRFTV9OQU1FIHdpbnMgYnkgZGVmYXVsdCBiZWNhdXNlIG9yZGVyX3Nob3J0bmFtZSBjYW4gYmUgY3V0XG4gIC8vIG9mZiBtaWQtd29yZCAoXCJQQyBTdWdhciBcdTk4RUZcdTVGOEMgLi4uXCIpLCB3aGljaCBpcyB3b3JzZSB0aGFuIGEgdHJhaWxpbmctXG4gIC8vIGNvbW1hIGNvc21ldGljIGlzc3VlLiBvcmRlUl9OQU1FIGlzIHRoZSBsYXN0LXJlc29ydCBDaGluZXNlIGZvcm1hbFxuICAvLyBsYWJlbC5cbiAgY29uc3QgZnVsbE5hbWUgPSBfY2xlYW5MYWJOYW1lKGl0ZW0uYXNzYVlfSVRFTV9OQU1FKVxuICAgICAgICAgICAgICAgIHx8IF9jbGVhbkxhYk5hbWUoaXRlbS5vcmRlcl9zaG9ydG5hbWUpXG4gICAgICAgICAgICAgICAgfHwgX2NsZWFuTGFiTmFtZShpdGVtLm9yZGVSX05BTUUpO1xuICBjb25zdCBvcmRlckNvZGUgPSBTdHJpbmcoaXRlbS5vcmRlUl9DT0RFIHx8IFwiXCIpLnRyaW0oKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIG9yZGVyX2NvZGU6IG9yZGVyQ29kZSxcbiAgICBvcmRlcl9uYW1lOiBpdGVtLm9yZGVSX05BTUUgfHwgXCJcIixcbiAgICAvLyBQcmVmZXIgdGhlIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgKFwiMDkxNDBDXCIpIGFzIHRoZSBGSElSIGNvZGluZyBjb2RlIHNvIHRoZVxuICAgIC8vIGRvd25zdHJlYW0gb2JzZXJ2YXRpb24gbWFwcGVyIHJvdXRlcyBpdCB1bmRlciBOSElfTUVESUNBTF9PUkRFUl9cbiAgICAvLyBDT0RFIHN5c3RlbS4gU01BUlQgYXBwcyBncm91cCBsYWIgdGVzdHMgYnkgY29kaW5nIGNvZGU7IHVzaW5nXG4gICAgLy8gZnJlZS10ZXh0IGhlcmUgaXMgd2hhdCBjYXVzZXMgXCJDcmVhXCIgYW5kIFwiQ3JlYSxcIiB0byBiZSBzcGxpdFxuICAgIC8vIGludG8gdHdvIGRpc3RpbmN0IHRlc3RzLiBGYWxsYmFjayB0byB0aGUgY2xlYW5lZCBkaXNwbGF5IHdoZW5cbiAgICAvLyBOSEkgZG9lc24ndCBzdXBwbHkgYW4gb3JkZXIgY29kZSAob2xkZXIgLyBlZGdlLWNhc2Ugcm93cykuXG4gICAgY29kZTogb3JkZXJDb2RlIHx8IGZ1bGxOYW1lLFxuICAgIGRpc3BsYXk6IGZ1bGxOYW1lLFxuICAgIHZhbHVlOiBTdHJpbmcodmFsdWUpLFxuICAgIHVuaXQ6IGl0ZW0udW5pVF9EQVRBIHx8IFwiXCIsXG4gICAgcmVmZXJlbmNlX3JhbmdlOiBpdGVtLmNvbnN1bFRfVkFMVUUgfHwgaXRlbS5zaG9ydF9DT05TVUxUX1ZBTFVFIHx8IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzMzA2UzAxIHJldHVybnMgdmlzaXQtbGV2ZWwgcm93cyBPTkxZIChubyBkcnVnIG5hbWVzKS4gVGhlIGFjdHVhbCBkcnVnXG4vLyBsaXN0IGxpdmVzIGF0IElIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPTxyb3dfSUQ+JmN0eXBlPTIsIGluXG4vLyBgaWhrZTMzMDZTMDJfbWFpbl9kYXRhWypdLnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdGAuIFdlIGRvIHRoYXQgMi1zdGVwXG4vLyBmZXRjaCBzZXBhcmF0ZWx5OyB0aGlzIGZ1bmN0aW9uIGFkYXB0cyBhIHNpbmdsZSBkcnVnIGVudHJ5IGdpdmVuIGl0c1xuLy8gcGFyZW50IHZpc2l0IGNvbnRleHQuXG4vL1xuLy8gRGF0ZSBzZW1hbnRpY3MgKHZhcmllcyBieSB2aXNpdCB0eXBlIFx1MjAxNCB2aXNpYmxlIHZpYSB2aXNpdC5vcmlfVFlQRV9OQU1FKTpcbi8vICAgLSBPUEQgLyBcdTg1RTVcdTVDNDA6IGZ1bmNfREFURSBpcyB0aGUgb25seSBtZWFuaW5nZnVsIGRhdGUuIGN1cmVfRV9EQVRFIGlzXG4vLyAgICAgZW1wdHkuIGF1dGhvcmVkT24gPSBmdW5jX0RBVEUgaXMgYWNjdXJhdGUuXG4vLyAgIC0gXHU0RjRGXHU5NjYyIChpbnBhdGllbnQpOiBOSEkgcmV0dXJucyBPTkUgcm93IHBlciBhZG1pc3Npb24gc3VtbWFyaXNpbmdcbi8vICAgICBldmVyeSBkcnVnIHVzZWQgZHVyaW5nIHRoZSBzdGF5LiBmdW5jX0RBVEUgPSBhZG1pc3Npb24gZGF5LFxuLy8gICAgIGN1cmVfRV9EQVRFID0gZGlzY2hhcmdlIGRheS4gTkhJIGRvZXMgbm90IHByZXNlcnZlIHRoZSBhY3R1YWxcbi8vICAgICBhdXRob3JlZCBkYXRlIG9mIGVhY2ggZHJ1ZyBcdTIwMTQgYSBQUEkgc3RhcnRlZCBvbiBzdGF5LWRheSAzIGxvb2tzXG4vLyAgICAgaWRlbnRpY2FsIHRvIG9uZSBwcmVzY3JpYmVkIG9uIGFkbWlzc2lvbiBkYXkuXG4vLyAgICAgV2Ugc3VyZmFjZSBmdW5jX0RBVEUgXHUyMTkyIGF1dGhvcmVkT24gYXMgYSBiZXN0LWVmZm9ydCBhbmNob3IgYW5kXG4vLyAgICAgQURESVRJT05BTExZIGVtaXQgZW5kX2RhdGUgc28gdGhlIGRvd25zdHJlYW0gbWFwcGVyIGNhbiBhdHRhY2hcbi8vICAgICBkaXNwZW5zZVJlcXVlc3QudmFsaWRpdHlQZXJpb2QgPSB7c3RhcnQ6IGZ1bmNfREFURSwgZW5kOiBjdXJlX0VfREFURX0uXG4vLyAgICAgQ29uc3VtZXJzIHRoZW4gc2VlIFwidGhpcyBkcnVnIHdhcyB1c2VkIGR1cmluZyBhZG1pc3Npb24gNS8xOC01LzIyXCJcbi8vICAgICBpbnN0ZWFkIG9mIFwiMTQgZHJ1Z3MgYWxsIHByZXNjcmliZWQgb24gNS8xOFwiLlxuLy9cbi8vIERydWctcm93IG9yZGVyX2RydWdfZGF5IG5vdGU6IGlucGF0aWVudCByb3dzIHNoaXAgXCJcdUZGMERcIiAoZW0tZGFzaCBzZW50aW5lbFxuLy8gZm9yIFwibm8gZGF0YVwiKSBiZWNhdXNlIE5ISSBkb2Vzbid0IHRyYWNrIHBlci1kcnVnIGRheS1zdXBwbHkgZm9yXG4vLyBpbnBhdGllbnRzLiBOdW1iZXIoXCJcdUZGMERcIikgaXMgTmFOOyB0aGUgIWlzRmluaXRlIGJyYW5jaCBzZW5kcyBpdCB0byAwLFxuLy8gd2hpY2ggdGhlIG1hcHBlciB0cmVhdHMgYXMgZmFsc3kgYW5kIHNvIG9taXRzIGV4cGVjdGVkU3VwcGx5RHVyYXRpb24gXHUyMDE0XG4vLyBjb3JyZWN0OiBiZXR0ZXIgc2lsZW50IHRoYW4gZmFicmljYXRpbmcgYSBzdXBwbHkgY291bnQuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbChkcnVnLCB2aXNpdCwgb3B0aW9ucykge1xuICBpZiAoIWRydWcgfHwgdHlwZW9mIGRydWcgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICAvLyB2aXNpdC5mdW5jX0RBVEUgaXMgXCIxMTUvMDUvMDV8fDIwMjYvMDUvMDVcIiBcdTIwMTQgcm9jVG9JU08gbWF0Y2hlcyB0aGUgUk9DXG4gIC8vIHByZWZpeCBjb3JyZWN0bHkuXG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyh2aXNpdD8uZnVuY19EQVRFIHx8IHZpc2l0Py5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIGNvbnN0IHJhd0RydWdOYW1lID0gZHJ1Zy5kcnVnX25hbWUgfHwgZHJ1Zy5kcnVHX05BTUUgfHwgXCJcIjtcbiAgY29uc3QgZHJ1Z19uYW1lID0gcGlja0VuZ2xpc2gocmF3RHJ1Z05hbWUpO1xuICBpZiAoIWRhdGUgfHwgIWRydWdfbmFtZSkgcmV0dXJuIG51bGw7XG4gIC8vIGN1cmVfRV9EQVRFIG9ubHkgcG9wdWxhdGVkIGZvciBpbnBhdGllbnQgc3VtbWFyeSByb3dzOyBST0MgYmlsaW5ndWFsXG4gIC8vIHdpdGggZW1wdHkgaGFsdmVzIChcInx8XCIpIHBhcnNlcyB0byBcIlwiIHdoaWNoIHdlIHdhbnQuXG4gIGNvbnN0IGVuZF9kYXRlID0gcm9jVG9JU08odmlzaXQ/LmN1cmVfRV9EQVRFIHx8IHZpc2l0Py5jdXJlX2VfZGF0ZSB8fCBcIlwiKTtcbiAgY29uc3QgZGF5cyA9IE51bWJlcihkcnVnLm9yZGVyX2RydWdfZGF5IHx8IGRydWcub3JkZXJfRFJVR19EQVkgfHwgMCk7XG4gIC8vIGlzX2Nocm9uaWMgZmxvd3MgZnJvbSB0aGUgY2hyb25pYy1wcmVzY3JpcHRpb24gZmFuLW91dFxuICAvLyAoSUhLRTMzMDdTMDEgbGlzdCBcdTIxOTIgSUhLRTMzMDZTMDIgZGV0YWlsKS4gV2hlbiB0cnVlLCB0aGUgbWFwcGVyXG4gIC8vIGF0dGFjaGVzIGNvdXJzZU9mVGhlcmFweVR5cGU9Y29udGludW91cy4gRGVmYXVsdHMgZmFsc2Ugc28gT1BEIC9cbiAgLy8gaW5wYXRpZW50IC8gXHU4NUU1XHU1QzQwIGFjdXRlIHByZXNjcmlwdGlvbnMgc3RheSB1bmNoYW5nZWQuXG4gIGNvbnN0IGlzX2Nocm9uaWMgPSAhIShvcHRpb25zICYmIG9wdGlvbnMuaXNfY2hyb25pYyk7XG4gIC8vIE5ISSBcdTg1RTVcdTU0QzFcdTU3RkFcdTY3MkNcdThDQzdcdTY1OTlcdTVFQUIgc2hpcHMgYmlsaW5ndWFsIGBcdTRFMkRcdTY1ODd8fEVuZ2xpc2hgIG9uIHRocmVlIGZpZWxkc1xuICAvLyB3ZSBzdXJmYWNlIFx1MjAxNCBkcnVnX25hbWUsIGFjdCAoXHU4NUU1XHU3NDA2XHU1MjA2XHU5ODVFKSwgaWNkOWNtX0NPREVfQ05BTUUuIHYwLjguMFxuICAvLyBrZWVwcyBib3RoIGhhbHZlcyBzbyB0aGUgbWFwcGVyIGNhbiBwdXQgXHU3RTQxXHU0RTJEIGludG8gQ29kZWFibGVDb25jZXB0XG4gIC8vIC50ZXh0IChwYXRpZW50LWZhY2luZykgYW5kIEVuZ2xpc2ggaW4gY29kaW5nWzBdLmRpc3BsYXkgKGNsaW5pY2FsXG4gIC8vIGNhbm9uaWNhbCkuIGRydWcuZHJ1Z19uYW1lMiAvIHZpc2l0LmljZDljbV9DT0RFX0NOQU1FMiBhcmUgTkhJJ3NcbiAgLy8gb3duIENoaW5lc2Utb25seSBjb252ZW5pZW5jZSBmaWVsZHMgXHUyMDE0IHByZWZlciB0aGVtIHdoZW4gcHJlc2VudCxcbiAgLy8gZWxzZSBmYWxsIGJhY2sgdG8gdGhlIENoaW5lc2UgaGFsZiBvZiB0aGUgYmlsaW5ndWFsIGZpZWxkLlxuICBjb25zdCBkcnVnX25hbWVfemggPVxuICAgIGRydWcuZHJ1Z19uYW1lMiB8fCBkcnVnLmRydUdfTkFNRTIgfHwgcGlja0NoaW5lc2UocmF3RHJ1Z05hbWUpO1xuICBjb25zdCByYXdJbmRpY2F0aW9uID0gdmlzaXQ/LmljZDljbV9DT0RFX0NOQU1FIHx8IHZpc2l0Py5pY2Q5Y21fbmFtZSB8fCBcIlwiO1xuICAvLyBpY2Q5Y21fQ09ERV9DTkFNRSB3cmFwcyBlYWNoIGhhbGYgYXMgXCI8Y29kZT4vPHRleHQ+XCIgXHUyMDE0IHN0cmlwIHRoZVxuICAvLyBsZWFkaW5nIFwiPGNvZGU+L1wiIHNvIGRvd25zdHJlYW0gZG9lc24ndCBkb3VibGUtcHJpbnQgdGhlIGNvZGUgd2hlblxuICAvLyBpdCBjb21wb3NlcyBcIjxjb2RlPiA8dGV4dD5cIiBpdHNlbGYuXG4gIGNvbnN0IHN0cmlwSWNkUHJlZml4ID0gKHMpID0+IHMucmVwbGFjZSgvXltBLVowLTkuXStcXC9cXHMqLywgXCJcIik7XG4gIGNvbnN0IGluZGljYXRpb24gPSBzdHJpcEljZFByZWZpeChwaWNrRW5nbGlzaChyYXdJbmRpY2F0aW9uKSk7XG4gIGNvbnN0IGluZGljYXRpb25femggPVxuICAgIHZpc2l0Py5pY2Q5Y21fQ09ERV9DTkFNRTIgfHxcbiAgICB2aXNpdD8uaWNkOWNtX2NvZGVfY25hbWUyIHx8XG4gICAgc3RyaXBJY2RQcmVmaXgocGlja0NoaW5lc2UocmF3SW5kaWNhdGlvbikpO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgLy8gT25seSBlbWl0IHdoZW4gbWVhbmluZ2Z1bGx5IHBvcHVsYXRlZCBBTkQgZGlmZmVyZW50IGZyb20gc3RhcnQuXG4gICAgLy8gU3VwcHJlc3NpbmcgdGhlIHNhbWUtZGF5IGNhc2Uga2VlcHMgT1BEIC8gXHU4NUU1XHU1QzQwIHJlc291cmNlcyB0aWdodC5cbiAgICBlbmRfZGF0ZTogZW5kX2RhdGUgJiYgZW5kX2RhdGUgIT09IGRhdGUgPyBlbmRfZGF0ZSA6IFwiXCIsXG4gICAgZHJ1Z19uYW1lLFxuICAgIGRydWdfbmFtZV96aCxcbiAgICBjb2RlOiBkcnVnLm9yZGVyX2NvZGUgfHwgZHJ1Zy5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBkb3NlL2ZyZXF1ZW5jeS9yb3V0ZSBcdTIwMTQgb25seSBkYXlzICsgcXR5LlxuICAgIGRvc2U6IFwiXCIsXG4gICAgZnJlcXVlbmN5OiBcIlwiLFxuICAgIHJvdXRlOiBcIlwiLFxuICAgIHF1YW50aXR5OiBkcnVnLm9yZGVyX3F0eSB8fCBkcnVnLm9yZGVyX1FUWSB8fCBcIlwiLFxuICAgIGR1cmF0aW9uX2RheXM6IE51bWJlci5pc0Zpbml0ZShkYXlzKSA/IGRheXMgOiAwLFxuICAgIGluZGljYXRpb24sXG4gICAgaW5kaWNhdGlvbl96aCxcbiAgICBpbmRpY2F0aW9uX2NvZGU6IHZpc2l0Py5pY2Q5Y21fQ09ERSB8fCB2aXNpdD8uaWNkOWNtX2NvZGUgfHwgXCJcIixcbiAgICBkcnVnX2NsYXNzOiBwaWNrRW5nbGlzaChkcnVnLmFjdCB8fCBcIlwiKSxcbiAgICBkcnVnX2NsYXNzX3poOiBwaWNrQ2hpbmVzZShkcnVnLmFjdCB8fCBcIlwiKSxcbiAgICBob3NwaXRhbDogdmlzaXQ/Lmhvc3BfQUJCUiB8fCB2aXNpdD8uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gTWFwcGVyIHJlYWRzIHRoaXMgdG8gc2V0IE1lZGljYXRpb25SZXF1ZXN0LmNvdXJzZU9mVGhlcmFweVR5cGUuXG4gICAgY291cnNlX29mX3RoZXJhcHk6IGlzX2Nocm9uaWMgPyBcImNvbnRpbnVvdXNcIiA6IFwiXCIsXG4gIH07XG59XG5cbi8vIFN0dWIga2VwdCBmb3IgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5IFx1MjAxNCBJSEtFMzMwNlMwMSBsaXN0IG5ldmVyIGhhcyBkcnVncyxcbi8vIHNvIHdlIGFsd2F5cyByZXR1cm4gbnVsbCBhbmQgcmVseSBvbiB0aGUgMi1zdGVwIGRldGFpbCBmZXRjaCBhYm92ZS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdE1lZGljYXRpb24oKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIFN0dWIgZm9yIHRoZSBJSEtFMzMwN1MwMSBcdTYxNjJcdTYwMjdcdTg2NTVcdTY1QjlcdTdCOEIgbGlzdC4gVGhlIGxpc3Qgcm93cyBoYXZlIG5vIGRydWdcbi8vIHBheWxvYWQ7IGRydWdzIGNvbWUgdmlhIHRoZSAyLXN0ZXAgZmFuLW91dCBpbnRvIElIS0UzMzA2UzAyIHdpdGhcbi8vIGN0eXBlPXJvdy5vcmlfVFlQRSAoc2VlIF9mZXRjaENocm9uaWNNZWRpY2F0aW9uRGV0YWlsc0luVGFiIGluXG4vLyBiYWNrZ3JvdW5kLmpzKS4gUmV0dXJuaW5nIG51bGwgaGVyZSBlbnN1cmVzIHRoZSBnZW5lcmljIGxvb3AgZW1pdHNcbi8vIG5vdGhpbmcgZnJvbSB0aGlzIGVuZHBvaW50IFx1MjAxNCB0aGUgZmFuLW91dCBpcyB3aGVyZSB0aGUgbWFya2VkXG4vLyBNZWRpY2F0aW9uUmVxdWVzdCByZXNvdXJjZXMgYXJlIHByb2R1Y2VkLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0Q2hyb25pY0xpc3RTdHViKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBTYW1lIHNoYXBlIGFzIGFkYXB0TWVkaWNhdGlvbjogSUhLRTM0MDhTMDEgKGltYWdpbmcgbGlzdCkgb25seSBjYXJyaWVzXG4vLyBvcmRlci1sZXZlbCBkYXRhOyB0aGUgYWN0dWFsIHJlcG9ydCBuYXJyYXRpdmUgY29tZXMgZnJvbSB0aGUgSUhLRTM0MDhTMDJcbi8vIGRldGFpbCBmYW4tb3V0IChzZWUgYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCkuIFJldHVybmluZyBudWxsIGZyb21cbi8vIHRoZSBsaXN0IGFkYXB0ZXIgZW5zdXJlcyBubyBoYWxmLWZvcm1lZCBEaWFnbm9zdGljUmVwb3J0cyBsZWFrIHRocm91Z2guXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRJbWFnaW5nTGlzdFN0dWIoKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIElIS0UzMjA5UzAxIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpIFx1MjAxNCBOSEkncyBvZmZpY2lhbGx5LXZldHRlZCBjYXRhc3Ryb3BoaWMtaWxsbmVzc1xuLy8gcmVnaXN0cnkuIEVhY2ggcm93IGlzIGEgc2VyaW91cyBjaHJvbmljIGNvbmRpdGlvbiAoY2FuY2VyLCBhdXRvaW1tdW5lLFxuLy8gdHJhbnNwbGFudCBmb2xsb3ctdXAsIGRpYWx5c2lzLCBldGMuKSB0aGUgcGF0aWVudCBpcyBjdXJyZW50bHlcbi8vIHJlZ2lzdGVyZWQgZm9yLiBUaGlzIGlzIHRoZSBjbG9zZXN0IHRoaW5nIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBleHBvc2VzIHRvIGFcbi8vIGN1cmF0ZWQgcHJvYmxlbSBsaXN0IFx1MjAxNCBmYXIgc3Ryb25nZXIgc2lnbmFsIHRoYW4gcmV2ZXJzZS1lbmdpbmVlcmluZ1xuLy8gY2hyb25pYyBjb25kaXRpb25zIGZyb20gZW5jb3VudGVyIElDRHMuXG4vL1xuLy8gTWFwcyB0byBGSElSIENvbmRpdGlvbiB3aXRoIGNhdGVnb3J5PXByb2JsZW0tbGlzdC1pdGVtIHNvIGRvd25zdHJlYW1cbi8vIFNNQVJUIGFwcHMgLyBJUFMgcHJvZmlsZXMgc3VyZmFjZSBpdCBpbiB0aGVpciBwcm9ibGVtLWxpc3Qgdmlldy5cbi8vXG4vLyBQYXlsb2FkIHNoYXBlIChsaXZlIGNhcHR1cmUpOlxuLy8gICBzUF9JSEtFMzIwOVMwMTogW1xuLy8gICAgIHsgaG9zUF9JRCwgaG9zUF9BQkJSLCBob3NQX1VSTCxcbi8vICAgICAgIGljRDEwQ01fQ05BTUU6IFwiXHU2NTFEXHU4Qjc3XHU4MTdBXHU2MEUxXHU2MDI3XHU4MTZCXHU3NjI0XCIsICBcdTIxOTAgQ2hpbmVzZSBuYXJyYXRpdmUgb25seVxuLy8gICAgICAgdmFsaURfU19EQVRFOiAgXCIxMTEvMTEvMTZcIiwgICAgICAgXHUyMTkwIGNlcnRpZmljYXRpb24gdmFsaWQtZnJvbSAoUk9DKVxuLy8gICAgICAgdmFsaURfRV9EQVRFOiAgXCIxMTYvMTEvMTVcIiB9ICAgICAgXHUyMTkwIGNlcnRpZmljYXRpb24gdmFsaWQtdW50aWwgKFJPQywgfjV5KVxuLy8gICBdXG4vL1xuLy8gQ2F2ZWF0cyBkZWxpYmVyYXRlbHkgZW5jb2RlZDpcbi8vICAgLSBOSEkgZG9lc24ndCByZXR1cm4gdGhlIElDRC0xMC1DTSBjb2RlIGluIHRoaXMgZW5kcG9pbnQsIG9ubHkgdGhlXG4vLyAgICAgQ2hpbmVzZSBsYWJlbC4gV2UgbGVhdmUgYGNvZGVgIGVtcHR5OyBtYXBDb25kaXRpb24gZmFsbHMgYmFjayB0b1xuLy8gICAgIGRpc3BsYXktYXMtaWQgZm9yIHN0YWJsZUlkIChtaXJyb3JpbmcgZGlhZ25vc3RpYy1yZXBvcnQudHMpLlxuLy8gICAtIHZhbGlEX0VfREFURSBpcyB3aGVuIHRoZSBDQVJEIGV4cGlyZXMgKHJlbmV3ZWQgZXZlcnkgfjV5KSwgTk9UXG4vLyAgICAgd2hlbiB0aGUgZGlzZWFzZSByZXNvbHZlZC4gV2UgZGVsaWJlcmF0ZWx5IGRvIE5PVCBtYXAgaXQgdG9cbi8vICAgICBhYmF0ZW1lbnREYXRlVGltZSBcdTIwMTQgdGhhdCB3b3VsZCBmYWxzZWx5IGltcGx5IHRoZSBjb25kaXRpb24gc3RvcHBlZC5cbi8vICAgLSBBbGwgcm93cyBoZXJlIGFyZSBjdXJyZW50bHkgYWN0aXZlIGJ5IGRlZmluaXRpb247IE5ISSBvbmx5IHJldHVybnNcbi8vICAgICB2YWxpZCBjZXJ0aWZpY2F0aW9ucy4gY2xpbmljYWxfc3RhdHVzIGhhcmQtY29kZWQgdG8gXCJhY3RpdmVcIi5cbi8vICAgLSBzZXZlcml0eSBzdG9yZWQgYXMgdGV4dCAoXCJTZXZlcmUgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSlcIikgYmVjYXVzZSB0aGUgZm9ybWFsXG4vLyAgICAgc2V2ZXJpdHkgY29kZSBtYXBwaW5nIChTTk9NRUQgMjQ0ODQwMDAgZXRjLikgbmVlZHMgbW9yZSB0aG91Z2h0LlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyhpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChpdGVtLmljRDEwQ01fQ05BTUUgfHwgaXRlbS5pY2QxMGNtX2NuYW1lIHx8IFwiXCIpO1xuICBpZiAoIWRpc3BsYXkpIHJldHVybiBudWxsO1xuICByZXR1cm4ge1xuICAgIGRpc3BsYXksXG4gICAgY29kZTogXCJcIixcbiAgICBzeXN0ZW06IFwiXCIsXG4gICAgb25zZXRfZGF0ZTogcm9jVG9JU08oaXRlbS52YWxpRF9TX0RBVEUgfHwgaXRlbS52YWxpZF9zX2RhdGUgfHwgXCJcIiksXG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS52YWxpRF9TX0RBVEUgfHwgaXRlbS52YWxpZF9zX2RhdGUgfHwgXCJcIiksXG4gICAgY2F0ZWdvcnk6IFwicHJvYmxlbS1saXN0LWl0ZW1cIixcbiAgICBzZXZlcml0eTogXCJTZXZlcmUgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSlcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICBjbGluaWNhbF9zdGF0dXM6IFwiYWN0aXZlXCIsXG4gIH07XG59XG5cbi8vIElIS0UzNDAyUzAxIChcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjVcdTdENTBcdTY3OUMpIFx1MjAxNCBvbmUgcm93IHBlciBzY3JlZW5pbmcgZXZlbnQsIGZsYXRcbi8vIHNjaGVtYS4gTkhJIHJ1bnMgdGhlIHBhbmVsIGl0c2VsZiBhbmQgcmV0dXJucyB2aXRhbHMgKyBhIGZpeGVkXG4vLyBiYXR0ZXJ5IG9mIGxhYiB2YWx1ZXMgcHJlLWNvbXB1dGVkIChCTUkgLyB3YWlzdCAvIEJQIC8gbGlwaWRzIC8gTEZUXG4vLyAvIFJGVCAvIGZhc3RpbmcgZ2x1Y29zZSAvIEhCc0FnIC8gQW50aS1IQ1YgLyB1cmljIGFjaWQgXHUyMDI2KS5cbi8vIFdlIHVuZm9sZCBvbmUgcm93IGludG8gfjE1IE9ic2VydmF0aW9uczogdml0YWxzIGdvIHRvIGNhdGVnb3J5XG4vLyB2aXRhbC1zaWducyAoc28gU01BUlQgYXBwcycgdml0YWxzIHZpZXdzIHBpY2sgdGhlbSB1cCksIGxhYnMgZ28gdG9cbi8vIGNhdGVnb3J5IGxhYm9yYXRvcnkuIFJldHVybnMgYW4gQVJSQVkgXHUyMDE0IGNhbGxlciBtdXN0IGZsYXQtbWFwLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0QWR1bHRQcmV2ZW50aXZlKHJvdykge1xuICBpZiAoIXJvdyB8fCB0eXBlb2Ygcm93ICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKHJvdy5maXJzVF9ESUFHX0RBVEUgfHwgXCJcIik7XG4gIGlmICghZGF0ZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGhvc3BpdGFsID0gcm93Lmhvc1BfQUJCUiB8fCByb3cuaG9zcF9BQkJSIHx8IFwiXCI7XG4gIGNvbnN0IG91dCA9IFtdO1xuICAvLyAoZGlzcGxheSwgdmFsdWUsIHVuaXQsIHJlZlJhbmdlLCBjYXRlZ29yeSwgTkhJIGNvZGUpXG4gIC8vIChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBjb2RlKVxuICAvLyBFdmVyeSBvYnNlcnZhdGlvbiBlbWl0dGVkIGZyb20gdGhpcyBhZGFwdGVyIGNhcnJpZXMgc291cmNlX3Byb2dyYW09XG4gIC8vIFwiYWR1bHQtcHJldmVudGl2ZVwiIHNvIGRvd25zdHJlYW0gRkhJUiBjb25zdW1lcnMgY2FuIGlkZW50aWZ5IHRoZVxuICAvLyBvcmlnaW4gcHJvZ3JhbW1lIHZpYSBPYnNlcnZhdGlvbi5tZXRhLnRhZyAoc2VwYXJhdGUgZnJvbSB0aGVcbiAgLy8gc3luYy1wYWdlLXR5cGUgLyBzeW5jLXJ1bi1pZCBzeW5jLXRyYWNraW5nIHRhZ3MpLlxuICBmdW5jdGlvbiBwdXNoKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIGNvZGUpIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGNvbnN0IHYgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgICAvLyBFbS1kYXNoIFwiXHUyMDE0XCIgKFUrMjAxNCkgaXMgTkhJJ3Mgc2VudGluZWwgXCJubyBkYXRhXCIgbWFya2VyIFx1MjAxNCBkcm9wLlxuICAgIC8vIFBsYWluIGh5cGhlbiBcIi1cIiBpcyBOT1QgYSBuby1kYXRhIG1hcmtlciBwZXItZmllbGQgXHUyMDE0IGl0J3MgdGhlXG4gICAgLy8gY2xpbmljYWwgZGlwc3RpY2sgY29udmVudGlvbiBmb3IgXCJuZWdhdGl2ZVwiIChVcmluZSBQcm90ZWluKS5cbiAgICAvLyBOSEkncyBuby1kYXRhIGZsYWcgZm9yIGFuIGVudGlyZSByb3cgaXMgc2lnbmFsbGVkIGJ5XG4gICAgLy8gZmlyc1RfRElBR19EQVRFID0gXCItXCIgd2hpY2ggdGhlIHJvdy1sZXZlbCBkYXRlIGd1YXJkIGF0IHRoZSB0b3BcbiAgICAvLyBvZiBhZGFwdEFkdWx0UHJldmVudGl2ZSBhbHJlYWR5IHJlamVjdHMsIHNvIFwiLVwiIHJlYWNoaW5nIHB1c2goKVxuICAgIC8vIGFsd2F5cyBtZWFucyBcInRoZSBjbGluaWNpYW4gd3JvdGUgaXQgZG93biBhcyBhIG5lZ2F0aXZlIHJlc3VsdFwiLlxuICAgIGlmICh2ID09PSBcIlwiIHx8IHYgPT09IFwiXHUyMDE0XCIpIHJldHVybjtcbiAgICBvdXQucHVzaCh7XG4gICAgICBkYXRlLFxuICAgICAgaG9zcGl0YWwsXG4gICAgICBjYXRlZ29yeTogY2F0ZWdvcnkgfHwgXCJsYWJvcmF0b3J5XCIsXG4gICAgICBvcmRlcl9jb2RlOiBjb2RlIHx8IFwiXCIsXG4gICAgICBvcmRlcl9uYW1lOiBkaXNwbGF5LFxuICAgICAgY29kZTogY29kZSB8fCBkaXNwbGF5LFxuICAgICAgZGlzcGxheSxcbiAgICAgIHZhbHVlOiB2LFxuICAgICAgdW5pdDogdW5pdCB8fCBcIlwiLFxuICAgICAgcmVmZXJlbmNlX3JhbmdlOiByZWZSYW5nZSB8fCBcIlwiLFxuICAgICAgLy8gU291cmNlLXByb2dyYW1tZSB0YWcgXHUyMDE0IGFkZGVkIHRvIE9ic2VydmF0aW9uLm1ldGEudGFnIGJ5IHRoZVxuICAgICAgLy8gbWFwcGVyOyBsZXRzIFNNQVJUIGFwcHMgZmlsdGVyIC8gY2F0ZWdvcml6ZSBcInRoaXMgY2FtZSBmcm9tXG4gICAgICAvLyBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjUgc2NyZWVuaW5nXCIuXG4gICAgICBzb3VyY2VfcHJvZ3JhbTogXCJhZHVsdC1wcmV2ZW50aXZlXCIsXG4gICAgfSk7XG4gIH1cbiAgLy8gVml0YWwgc2lnbnMgKG5vIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgXHUyMDE0IHRoZXNlIGFyZSBzY3JlZW5pbmcgbWVhc3VyZW1lbnRzLCBub3RcbiAgLy8gbGFiIG9yZGVyczsgdGhleSBoYXZlIGNhbm9uaWNhbCBMT0lOQ3Mgd2hpY2ggZmluZExvaW5jJ3Mga2V5d29yZFxuICAvLyBzZWFyY2ggcmVzb2x2ZXMgY2xlYW5seSB2aWEgdW5pcXVlIHRlcm1zIGxpa2UgXCJib2R5IGhlaWdodFwiIC8gXCJibWlcIlxuICAvLyBcdTIwMTQgbm8gcHJlZml4LWNvbGxpc2lvbiByaXNrIHdpdGggb3RoZXIgTE9JTkNfTUFQIGtleXMpLlxuICBwdXNoKFwiQm9keSBIZWlnaHRcIiwgcm93LmhlaWdodCwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQm9keSBXZWlnaHRcIiwgcm93LndlaWdodCwgXCJrZ1wiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQk1JXCIsIHJvdy5ibWksIFwia2cvbTJcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIldhaXN0IENpcmN1bWZlcmVuY2VcIiwgcm93LndhaXN0bGluZSwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiU3lzdG9saWMgQmxvb2QgUHJlc3N1cmVcIiwgcm93LmJhc0VfU0JQLCBcIm1tSGdcIixcbiAgICAgICByb3cuYmxvRF9QUkVTU19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiRGlhc3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX0VCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgLy8gQWxsIGNoZW1pc3RyeSAvIGhlcCBwYW5lbCByb3dzIHBpbiB0aGUgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBzbyBmaW5kTG9pbmMgdGFrZXNcbiAgLy8gdGhlIE5ISV9UT19MT0lOQyBkaXJlY3QtbG9va3VwIHBhdGggXHUyMDE0IGJ5cGFzc2VzIHRoZSBrZXl3b3JkIHNlYXJjaFxuICAvLyBlbnRpcmVseS4gTWFwcGluZyBjcm9zcy12ZXJpZmllZCBhZ2FpbnN0IHRocmVlIHNvdXJjZXM6IHRoZSBOSEkgVUlcbiAgLy8gc2VjdGlvbiBsYWJlbHMgKFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjUpLCB0aGUgSUhLRTM0MDIgSlNPTiBmaWVsZFxuICAvLyBuYW1lcywgYW5kIHRoZSBleGlzdGluZyBOSElfVE9fTE9JTkMgdGFibGUgY29tbWVudHMuXG4gIC8vXG4gIC8vIExpcGlkIHBhbmVsXG4gIHB1c2goXCJDaG9sZXN0ZXJvbFwiLCAgIHJvdy5jaG8sICAgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDAxQ1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyMDkzLTNcbiAgcHVzaChcIlRyaWdseWNlcmlkZVwiLCAgcm93LmJsb0RfVEcsIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDRDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDI1NzEtOFxuICBwdXNoKFwiSERMXCIsICAgICAgICAgICByb3cuaGRsLCAgICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTA0M0NcIik7ICAvLyBcdTIxOTIgTE9JTkMgMjA4NS05XG4gIHB1c2goXCJMRExcIiwgICAgICAgICAgIHJvdy5sZGwsICAgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDQ0Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAxMzQ1Ny03IChjYWxjKVxuICAvLyBMaXZlciBmdW5jdGlvblxuICBwdXNoKFwiU0dPVCAoQVNUKVwiLCAgICByb3cuc2dvdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMjVDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDE5MjAtOFxuICBwdXNoKFwiU0dQVCAoQUxUKVwiLCAgICByb3cuc2dwdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMjZDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDE3NDItNlxuICAvLyBGYXN0aW5nIGdsdWNvc2VcbiAgcHVzaChcIkdsdS1BQ1wiLCAgICAgICAgcm93LnNfMDkwMDVDLCBcIm1nL2RMXCIsXG4gICAgICAgcm93LnNfMDkwMDVDX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDVDXCIpOyAgICAgICAgLy8gXHUyMTkyIExPSU5DIDE1NTgtNlxuICAvLyBSZW5hbCBmdW5jdGlvbiBcdTIwMTQgYHVyaW5FX0JVTmAgaXMgTkhJJ3MgbWlzbGVhZGluZyBmaWVsZCBuYW1lOyB0aGVcbiAgLy8gdmFsdWUgSVMgc2VydW0gQlVOIChCbG9vZCBVcmVhIE5pdHJvZ2VuKSwgbm90IGEgdXJpbmUgdGVzdC5cbiAgcHVzaChcIkJVTlwiLCAgICAgICAgICAgcm93LnVyaW5FX0JVTiwgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDAyQ1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAzMDk0LTBcbiAgcHVzaChcIkNyZWF0aW5pbmVcIiwgICAgcm93LmJsb0RfQ1JFQVQsICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDE1Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyMTYwLTBcbiAgLy8gZUdGUiBcdTIwMTQgZGVyaXZlZCBmcm9tIENyZWF0aW5pbmUsIG5vIG93biBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDLiBEaXNwbGF5IGtleXdvcmRcbiAgLy8gXCJlZ2ZyXCIgcmVzb2x2ZXMgdG8gTE9JTkMgMzM5MTQtMyB2aWEgZmluZExvaW5jLlxuICBwdXNoKFwiZUdGUlwiLCAgICAgICAgICByb3cuZWdmciwgICAgICAgIFwibUwvbWluLzEuNzNtMlwiLFxuICAgICAgIHJvdy5yRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICAvLyBVcmluZSBQcm90ZWluIGRpcHN0aWNrIFx1MjAxNCBxdWFsaXRhdGl2ZSAoXCItXCIgLyBcIlx1MDBCMVwiIC8gXCIxK1wiIC4uLikuXG4gIC8vIHVyaW5FX1BST1RFSU4gaXMgdGhlIHN0YXR1cyBjb2RlLCB1cmluRV9QUk9URUlOX1RFWFQgaXMgdGhlXG4gIC8vIGRpc3BsYXlhYmxlIHJlc3VsdCAocGFzc2VkIGFzIHZhbHVlKS4gVGhlIHNwZWNpZmljIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgZm9yXG4gIC8vIHByZXZlbnRpdmUtc2NyZWVuaW5nIHVyaW5lIHByb3RlaW4gaXNuJ3QgaW4gb3VyIE5ISV9UT19MT0lOQyB0YWJsZVxuICAvLyB5ZXQ7IHRoZSBrZXl3b3JkIFwidXJpbmUgcHJvdGVpblwiIHJlc29sdmVzIHRvIExPSU5DIDIwNDU0LTUgdmlhXG4gIC8vIGZpbmRMb2luYyAoYWZ0ZXIgdGhlIHYwLjYuNyBsb25nZXN0LW1hdGNoIGZpeCkuXG4gIHB1c2goXCJVcmluZSBQcm90ZWluXCIsIHJvdy51cmluRV9QUk9URUlOX1RFWFQgfHwgXCJcIiwgXCJcIiwgXCJcIik7XG4gIC8vIEhlcGF0aXRpcyBCL0Mgc2NyZWVuaW5nIFx1MjAxNCBzdGF0dXMgY29kZSB2cyBfVEVYVCB0cmFwIGRvY3VtZW50ZWQgYXRcbiAgLy8gbGVuZ3RoIGJlbG93LiBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHBpbm5lZCBzbyBmaW5kTG9pbmMgdGFrZXMgdGhlIE5ISV9UT19MT0lOQ1xuICAvLyBwYXRoIChvdGhlcndpc2UgdGhlIGtleXdvcmQgXCJoYlwiIHByZWZpeC1jb2xsaWRlcyB3aXRoIHRoZSBtb3JlXG4gIC8vIHNwZWNpZmljIFwiaGJzYWdcIiBcdTIwMTQgdGhlIGJ1ZyBvcmlnaW5hbGx5IHJlcG9ydGVkIGluIHYwLjYuNSkuXG4gIC8vICAgMTQwMzJDIFx1MjE5MiBMT0lOQyA1MTk2LTEgIChIQnNBZywgTWFzcy92b2wpXG4gIC8vICAgMTQwNTFDIFx1MjE5MiBMT0lOQyAxMzk1NS0wIChIQ1YgYW50aWJvZHksIFNlcnVtIG9yIFBsYXNtYSlcbiAgLy8gSGlzdG9yeTogcmVncmVzc2VkIGluIHYwLjYuMywgZml4IGxvc3QgdW50aWwgdjAuNi41OyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDXG4gIC8vIHBpbm5pbmcgYWRkZWQgdjAuNi42ICsgdjAuNi44LlxuICBwdXNoKFwiSEJzQWdcIiwgICAgcm93Lmhic2FHX1RFWFQgICB8fCBcIlwiLCBcIlwiLCByb3cuaGJWX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjE0MDMyQ1wiKTtcbiAgcHVzaChcIkFudGktSENWXCIsIHJvdy5hbnRJX0hDVl9URVhUIHx8IFwiXCIsIFwiXCIsIHJvdy5oY1ZfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMTQwNTFDXCIpO1xuICAvLyBVcmljIGFjaWQgKGJsb29kKSBcdTIwMTQgYHVyaUNfQUNJRGAgZmllbGQuIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgMDkwMTNDIFx1MjE5MiBMT0lOQ1xuICAvLyAzMDg0LTEgKFVyYXRlIE1hc3Mvdm9sIFMvUCkuXG4gIC8vXG4gIC8vIE5ISSdzIElIS0UzNDAyIHNjaGVtYSBBTFNPIGNhcnJpZXMgdHdvIHJlbGF0ZWQtbG9va2luZy1idXQtZGlzdGluY3RcbiAgLy8gZmllbGRzIHdlIGRlbGliZXJhdGVseSBza2lwOlxuICAvLyAgIC0gdXJpbkVfVUFfRElBR19BQ0lEIFx1MjAxNCBlbXBpcmljYWxseSBkdXBsaWNhdGVzIHNlcnVtIHVyaWMgYWNpZDtcbiAgLy8gICAgIGVtaXR0aW5nIGl0IHdvdWxkIGNyZWF0ZSBhIGR1cGxpY2F0ZSBPYnNlcnZhdGlvbi5cbiAgLy8gICAtIHVyaW5FX1VBIC8gdXJpbkVfVUFfRElBR19SRVNVTFRfVEVYVCBcdTIwMTQgY2xhaW0gdG8gYmUgYSB1cmluZSBVQVxuICAvLyAgICAgZGlwc3RpY2sgYnV0IERPTidUIGFwcGVhciBhbnl3aGVyZSBpbiBOSEkncyBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgVUkgZm9yXG4gIC8vICAgICBhZHVsdCBwcmV2ZW50aXZlIHNjcmVlbmluZyAodGhlIFx1NUMzRlx1NkRCMlx1NkFBMlx1NjdFNSBzZWN0aW9uIG9ubHkgc2hvd3NcbiAgLy8gICAgIFx1NUMzRlx1NkRCMlx1ODZDQlx1NzY3RFx1OENFQSkuIEFsd2F5cyBlbXB0eSAvIFwiLVwiIGluIG9ic2VydmVkIHBheWxvYWRzLiBMZWdhY3lcbiAgLy8gICAgIHNjaGVtYSBmaWVsZCB3aXRoIG5vIGNsaW5pY2FsIHJlYWxpdHkgXHUyMDE0IGRvIE5PVCBlbWl0LlxuICBwdXNoKFwiVXJpYyBBY2lkXCIsICAgICByb3cudXJpQ19BQ0lELCAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMTNDXCIpO1xuICAvLyBNZXRhYm9saWMgc3luZHJvbWUgc2NyZWVuaW5nIFx1MjAxNCB2YWx1ZSBpcyBhbiBpbnRlcnByZXRhdGlvbiBzdHJpbmdcbiAgLy8gKCdcdTZCNjNcdTVFMzgnIC8gJ1x1NzU3MFx1NUUzOFx1RkYwQ1x1NUVGQVx1OEI3MFx1RkYxQVx1OEFDQlx1NkQzRFx1OEE2Mlx1OTFBQlx1NUUyQicpLCBub3QgYSBudW1iZXIuIFRoZSBtYXBwZXInc1xuICAvLyBfdHJ5X3BhcnNlX3F1YW50aXR5IHdpbGwgcmV0dXJuIE5vbmUgYW5kIGl0IGZhbGxzIHRocm91Z2ggdG9cbiAgLy8gdmFsdWVTdHJpbmcuIE5vIG1hcHBlZCBMT0lOQyBrZXl3b3JkICh5ZXQpIHNvIHRoaXMgbGFuZHMgYXMgYW5cbiAgLy8gT2JzZXJ2YXRpb24gd2l0aCBjb2RlLnRleHQgb25seTsgZG93bnN0cmVhbSBjb25zdW1lcnMgY2FuIHN0aWxsXG4gIC8vIHN1cmZhY2UgaXQgdW5kZXIgdGhlIHBhdGllbnQncyBzY3JlZW5pbmcgc2VjdGlvbiBieSBjb2RlLnRleHQuXG4gIHB1c2goXCJcdTRFRTNcdThCMURcdTc1QzdcdTUwMTlcdTdGQTRcdTdCRTlcdTZBQTIgKE1ldGFib2xpYyBTeW5kcm9tZSBTY3JlZW5pbmcpXCIsXG4gICAgICAgcm93Lm1ldEFfU1lORFJfUkVTVUxUX1RFWFQsIFwiXCIsIFwiXCIpO1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyBJSEtFMzMwOVMwMSAoXHU0RjRGXHU5NjYyIGlucGF0aWVudCBsaXN0KSBcdTIwMTQgZ2l2ZXMgcHJvcGVyIGFkbWlzc2lvbi9kaXNjaGFyZ2UuXG4vLyBTaGFwZToge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIGluX0RBVEUsIG91dF9EQVRFLFxuLy8gICAgICAgICBpY2Q5Y21fQ09ERSwgaWNkOWNtX0NPREVfQ05BTUUsIG9yaV9UWVBFKFwiM1wiKSwgcm93X0lELCAuLi59XG4vLyBJSEtFMzMwOFMwMSBoYXMgdGhlIHNhbWUgc2hhcGUgZm9yIGEgc21hbGwgc2V0IG9mIG9sZGVyIFx1NEY0Rlx1OTY2MiByZWNvcmRzO1xuLy8gYGZ1bmNfREFURWAgaW5zdGVhZCBvZiBgaW5fREFURWAgaW4gc29tZSByb3dzIFx1MjAxNCBhZGFwdGVyIGFjY2VwdHMgYm90aC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdElucGF0aWVudEVuY291bnRlcihpdGVtLCBvcHRpb25zKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHN0YXJ0ID0gcm9jVG9JU08oaXRlbS5pbl9EQVRFIHx8IGl0ZW0uZnVuY19EQVRFIHx8IFwiXCIpO1xuICBjb25zdCBlbmQgPSByb2NUb0lTTyhpdGVtLm91dF9EQVRFIHx8IFwiXCIpO1xuICBpZiAoIXN0YXJ0KSByZXR1cm4gbnVsbDtcbiAgLy8gSUhLRTMzMDlTMDEgbGlzdCBzaGlwcyBpY2Q5Y21fQ09ERV9DTkFNRSBDaGluZXNlLW9ubHkgKFwiXHU1NEIzXHU4ODQwXCIpIHdpdGhcbiAgLy8gbm8gYmlsaW5ndWFsIGB8fGAgYW5kIG5vIHNlY29uZGFyeSBkaWFnbm9zZXMgZmllbGQgXHUyMDE0IHNhbWUgcHJvYmxlbVxuICAvLyBwYXR0ZXJuIGFzIElIS0UzMzAzIE9QRCBlbmNvdW50ZXJzIGJlZm9yZSB2MC44LjQuIENhbGxlciBtYXlcbiAgLy8gc3VwcGx5IG9wdGlvbnMucHJpbWFyeV9kaWFnbm9zaXMgKGJpbGluZ3VhbCB7Y29kZSwgbmFtZV9lbiwgbmFtZV96aH0pXG4gIC8vIGFuZCBvcHRpb25zLnNlY29uZGFyeV9kaWFnbm9zZXMgKGFycmF5KSBmcm9tIHRoZSBJSEtFMzMwOVMwMlxuICAvLyBkZXRhaWwgZmFuLW91dCBzbyB0aGUgbWFwcGVyIHByb2R1Y2VzIEVuZ2xpc2ggY29kaW5nLmRpc3BsYXkgK1xuICAvLyBtdWx0aXBsZSByZWFzb25Db2RlIGVudHJpZXMgXHUyMDE0IHNhbWUgY29udHJhY3QgYXMgYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZS5cbiAgY29uc3Qgc3RyaXBJY2RQcmVmaXggPSAocykgPT4gU3RyaW5nKHMgfHwgXCJcIikucmVwbGFjZSgvXltBLVowLTkuXStcXC9cXHMqLywgXCJcIik7XG4gIGNvbnN0IHMwMlByaW1hcnkgPSBvcHRpb25zICYmIG9wdGlvbnMucHJpbWFyeV9kaWFnbm9zaXM7XG4gIGNvbnN0IGljZENvZGUgPVxuICAgIChzMDJQcmltYXJ5ICYmIHMwMlByaW1hcnkuY29kZSkgfHwgaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGxldCBpY2ROYW1lLCBpY2ROYW1lX3poO1xuICBpZiAoczAyUHJpbWFyeSAmJiAoczAyUHJpbWFyeS5uYW1lX2VuIHx8IHMwMlByaW1hcnkubmFtZV96aCkpIHtcbiAgICBpY2ROYW1lID0gczAyUHJpbWFyeS5uYW1lX2VuIHx8IHMwMlByaW1hcnkubmFtZV96aDtcbiAgICBpY2ROYW1lX3poID0gczAyUHJpbWFyeS5uYW1lX3poIHx8IHMwMlByaW1hcnkubmFtZV9lbjtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCByYXdJY2ROYW1lID0gaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9uYW1lIHx8IFwiXCI7XG4gICAgaWNkTmFtZSA9IHN0cmlwSWNkUHJlZml4KHBpY2tFbmdsaXNoKHJhd0ljZE5hbWUpKTtcbiAgICBpY2ROYW1lX3poID0gc3RyaXBJY2RQcmVmaXgocGlja0NoaW5lc2UocmF3SWNkTmFtZSkpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZGF0ZTogc3RhcnQsXG4gICAgZW5kX2RhdGU6IGVuZCxcbiAgICBjbGFzczogXCJJTVBcIixcbiAgICB0eXBlX2Rpc3BsYXk6IFwiXHU0RjRGXHU5NjYyXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIHJlYXNvbl96aDogaWNkTmFtZV96aCA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lX3pofWAgOiBpY2ROYW1lX3poKSA6IFwiXCIsXG4gICAgcmVhc29uX2NvZGU6IGljZENvZGUsXG4gICAgc2Vjb25kYXJ5X2RpYWdub3NlczpcbiAgICAgIG9wdGlvbnMgJiYgQXJyYXkuaXNBcnJheShvcHRpb25zLnNlY29uZGFyeV9kaWFnbm9zZXMpXG4gICAgICAgID8gb3B0aW9ucy5zZWNvbmRhcnlfZGlhZ25vc2VzXG4gICAgICAgIDogW10sXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgcm93X2lkOiBpdGVtLnJvd19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwM1MwMSAoXHU5MUFCXHU3NjQyXHU4Q0JCXHU3NTI4XHU3NTMzXHU1ODMxKSBpdGVtIHNoYXBlIFx1MjAxNCBmYXIgbW9yZSBjb21wbGV0ZSB0aGFuIHRoZSBvbGRlclxuLy8gSUhLRTMzMDFTMDIgdmlzaXQgbGlzdCAoNTEgdmlzaXRzIHZzIDYgZm9yIHRoZSB0ZXN0IHBhdGllbnQpLiBOSEknc1xuLy8gY2Fub25pY2FsIHNvdXJjZSBvZiB0cnV0aCBmb3IgXCJldmVyeSBiaWxsZWQgZW5jb3VudGVyXCIuXG4vLyAgIGhvc1BfSUQsIGhvc1BfQUJCUiwgaG9zcF91cmxcbi8vICAgZnVuQ19EQVRFICAgICAgICAgICAgICAoXHU2QzExXHU1NzBCIFlZWS9NTS9ERClcbi8vICAgaWNEOUNNX0NPREUgLyBpY0Q5Q01fQ09ERV9DTkFNRVxuLy8gICBvcklfVFlQRSAvIG9yaV90eXBlX25hbWUgICAoXCJJQ1x1NTM2MVx1OENDN1x1NjU5OVwiIC8gXCJcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTlcIikgXHUyMDE0IG9yaWdpbiwgTk9UIFx1OTU4MC9cdTYwMjUvXHU0RjRGXG4vLyAgIHBhcnRfQU1ULCBhcHBsX0RPVCwgXHUyMDI2ICAgKGJpbGxpbmcgXHUyMDE0IGRpc2NhcmRlZClcbi8vICAgcm9XX0lEICAgICAgICAgICAgICAgICAgZGV0YWlsIGtleSBmb3IgSUhLRTMzMDNTMDIgZmFuLW91dCAoUGhhc2UgQilcbi8vIFdlIGRvbid0IGhhdmUgdmlzaXQgY2xhc3MgKFx1OTU4MC9cdTYwMjUvXHU0RjRGKSBhdCB0aGUgbGlzdCBsZXZlbDsgdGhlIFMwMiBkZXRhaWxcbi8vIGhhcyBob3NwX0RBVEFfVFlQRV9OQU1FIChcIlx1ODk3Rlx1OTFBQlwiL1wiXHU0RTJEXHU5MUFCXCIvXCJcdTcyNTlcdTkxQUJcIikuIEZvciBub3cgZGVmYXVsdCBBTUIuXG4vL1xuLy8gUGhhcm1hY3kgcGlja3VwIGRldGVjdGlvbiBcdTIwMTQgTkhJIG1peGVzIHBoYXJtYWN5IGRpc3BlbnNlIGV2ZW50cyBpbnRvXG4vLyBJSEtFMzMwMyBhbG9uZ3NpZGUgY2xpbmljIHZpc2l0cywgd2l0aCBOTyBmaWVsZCBpbiB0aGlzIGVuZHBvaW50IHRoYXRcbi8vIGRpc3Rpbmd1aXNoZXMgdGhlbSAob25seSB0aGUgc2FtZSBcIklDXHU1MzYxXHU4Q0M3XHU2NTk5XCIvXCJcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTlcIiBzb3VyY2UgbGFiZWxcbi8vIGVpdGhlciB0eXBlIHVzZXMpLiBXaXRob3V0IGludGVydmVudGlvbiBTTUFSVCBhcHBzIHNlZSBhbiBFbmNvdW50ZXJcbi8vIHNoYXBlIGlkZW50aWNhbCB0byBjbGluaWMgdmlzaXRzIGFuZCBtdXN0IGd1ZXNzIGZyb20gaG9zcGl0YWwgbmFtZS5cbi8vIFR3byBzaWduYWxzIGF2YWlsYWJsZSwgYm90aCAxMDAlIGNvbmNvcmRhbnQgb24gb2JzZXJ2ZWQgZGF0YTpcbi8vICAgUFJJTUFSWSAgb3B0aW9ucy5waGFybWFjeT10cnVlIFx1MjAxNCBjYWxsZXIgcHJlLWJ1aWx0IGEgc2V0IG9mIHJvd19JRHNcbi8vICAgICAgICAgICAgdGhhdCBhcHBlYXJlZCBpbiBJSEtFMzMwNiAvIElIS0UzMzA3IHdpdGggb3JpX1RZUEVfTkFNRT1cbi8vICAgICAgICAgICAgXCJcdTg1RTVcdTVDNDBcIi4gQXV0aG9yaXRhdGl2ZTogdXNlcyBOSEkncyBvd24gY2xhc3NpZmljYXRpb24uXG4vLyAgIEZBTExCQUNLIGhvc1BfQUJCUiBtYXRjaGVzIC9cdTg1RTVcdTVDNDB8XHU4NUU1XHU2MjNGLyBcdTIwMTQgY292ZXJzIGNhc2VzIHdoZXJlIHRoZVxuLy8gICAgICAgICAgICBjcm9zcy1yZWYgd2Fzbid0IGJ1aWx0IChtZWRpY2F0aW9uIGZhbi1vdXQgdW5hdmFpbGFibGUgL1xuLy8gICAgICAgICAgICBzdGFuZGFsb25lIHRlc3QpIGFuZCB0aGUgZWRnZSBjYXNlIG9mIGEgcGhhcm1hY3kgZXZlbnRcbi8vICAgICAgICAgICAgd2l0aCBubyBhc3NvY2lhdGVkIGRydWcgcmVjb3JkLiBSZWxpYWJsZSBpbiBwcmFjdGljZVxuLy8gICAgICAgICAgICBiZWNhdXNlIFRhaXdhbiBOSEkgcGhhcm1hY3kgZGVzaWduYXRpb25zIGFsd2F5cyBpbmNsdWRlXG4vLyAgICAgICAgICAgIFx1ODVFNVx1NUM0MCBvciBcdTg1RTVcdTYyM0YgaW4gdGhlaXIgb2ZmaWNpYWwgbmFtZS5cbi8vIE1hcmtzIGB0eXBlX2Rpc3BsYXkgPSBcIlx1ODVFNVx1NUM0MFwiYCBmb3IgcGhhcm1hY3kgcm93cyBzbyB0aGUgbWFwcGVyIHByb2R1Y2VzXG4vLyBFbmNvdW50ZXIudHlwZVswXS50ZXh0ID0gXCJcdTg1RTVcdTVDNDBcIjsgZG93bnN0cmVhbSBTTUFSVCBhcHBzIGRldGVjdCB2aWFcbi8vIHRleHQuaW5jbHVkZXMoJ1x1ODVFNVx1NUM0MCcpIHdpdGhvdXQgZmFsbGluZyBiYWNrIHRvIGZyYWdpbGUgbmFtZSBoZXVyaXN0aWNzLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UoaXRlbSwgY2xhc3NIaW50LCBvcHRpb25zKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgLy8gaWNkOWNtX0NPREVfQ05BTUUgd3JhcHMgZWFjaCBoYWxmIGFzIFwiPGNvZGU+Lzx0ZXh0PlwiIFx1MjAxNCBzdHJpcCB0aGVcbiAgLy8gbGVhZGluZyBcIjxjb2RlPi9cIiBzbyBkb3duc3RyZWFtIGRvZXNuJ3QgZG91YmxlLXByaW50IHRoZSBjb2RlIHdoZW5cbiAgLy8gaXQgY29tcG9zZXMgXCI8Y29kZT4gPHRleHQ+XCIgaXRzZWxmIChjb3NtZXRpYzsgU01BUlQgYXBwIHNpZGUgcmVhZHNcbiAgLy8gLnJlYXNvbkNvZGVbMF0udGV4dCBhbmQgc2F3IFwiSTM1OSBJMzU5L05vbnJoZXVtYXRpYy4uLlwiIGJlZm9yZSkuXG4gIGNvbnN0IHN0cmlwSWNkUHJlZml4ID0gKHMpID0+IHMucmVwbGFjZSgvXltBLVowLTkuXStcXC9cXHMqLywgXCJcIik7XG4gIC8vIFBSSU1BUlkgSUNEIHNvdXJjZSBwcmVmZXJlbmNlOlxuICAvLyAgIDEuIG9wdGlvbnMucHJpbWFyeV9kaWFnbm9zaXMgKGZyb20gSUhLRTMzMDNTMDIgZGV0YWlsKSBcdTIwMTQgYWx3YXlzXG4gIC8vICAgICAgYmlsaW5ndWFsLiBDYWxsZXIgbG9va3MgdGhpcyB1cCB2aWEgX3ByaW1hcnlJY2RGcm9tUzAyRGV0YWlsLlxuICAvLyAgIDIuIFMwMSBsaXN0IHJvdydzIGljRDlDTV9DT0RFX0NOQU1FIFx1MjAxNCBzb21ldGltZXMgYmlsaW5ndWFsLFxuICAvLyAgICAgIHNvbWV0aW1lcyBDaGluZXNlLW9ubHkgZGVwZW5kaW5nIG9uIHBhdGllbnQgLyBlbmNvdW50ZXIuXG4gIC8vIFMwMi1zb3VyY2VkIHdpbnMgYmVjYXVzZSBJSEtFMzMwM1MwMSBzaGlwcyBDaGluZXNlLW9ubHkgZm9yIHNvbWVcbiAgLy8gcGF0aWVudHMsIHdoaWNoIHVzZWQgdG8gbGVhdmUgRW5jb3VudGVyLnJlYXNvbkNvZGVbMF0uY29kaW5nWzBdXG4gIC8vIC5kaXNwbGF5IGluIFx1NEUyRFx1NjU4NyAod3JvbmcgYXVkaWVuY2UgXHUyMDE0IHRoYXQgZmllbGQgaXMgdGhlIGNsaW5pY2FsXG4gIC8vIEVuZ2xpc2ggcGVyIHRoZSB2MC44LjAgYmlsaW5ndWFsIGNvbnRyYWN0KS5cbiAgY29uc3QgczAyUHJpbWFyeSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wcmltYXJ5X2RpYWdub3NpcztcbiAgY29uc3QgaWNkQ29kZSA9XG4gICAgKHMwMlByaW1hcnkgJiYgczAyUHJpbWFyeS5jb2RlKSB8fFxuICAgIGl0ZW0uaWNEOUNNX0NPREUgfHxcbiAgICBpdGVtLmljZDljbV9DT0RFIHx8XG4gICAgaXRlbS5pY2Q5Y21fY29kZSB8fFxuICAgIFwiXCI7XG4gIGxldCBpY2ROYW1lLCBpY2ROYW1lX3poO1xuICBpZiAoczAyUHJpbWFyeSAmJiAoczAyUHJpbWFyeS5uYW1lX2VuIHx8IHMwMlByaW1hcnkubmFtZV96aCkpIHtcbiAgICBpY2ROYW1lID0gczAyUHJpbWFyeS5uYW1lX2VuIHx8IHMwMlByaW1hcnkubmFtZV96aDtcbiAgICBpY2ROYW1lX3poID0gczAyUHJpbWFyeS5uYW1lX3poIHx8IHMwMlByaW1hcnkubmFtZV9lbjtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCByYXdJY2ROYW1lID1cbiAgICAgIGl0ZW0uaWNEOUNNX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9uYW1lIHx8IFwiXCI7XG4gICAgaWNkTmFtZSA9IHN0cmlwSWNkUHJlZml4KHBpY2tFbmdsaXNoKHJhd0ljZE5hbWUpKTtcbiAgICBpY2ROYW1lX3poID0gc3RyaXBJY2RQcmVmaXgocGlja0NoaW5lc2UocmF3SWNkTmFtZSkpO1xuICB9XG4gIGNvbnN0IGhvc3BpdGFsID0gaXRlbS5ob3NQX0FCQlIgfHwgaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIjtcbiAgY29uc3QgaXNQaGFybWFjeSA9XG4gICAgKG9wdGlvbnMgJiYgb3B0aW9ucy5waGFybWFjeSA9PT0gdHJ1ZSkgfHwgL1x1ODVFNVx1NUM0MHxcdTg1RTVcdTYyM0YvLnRlc3QoaG9zcGl0YWwpO1xuICAvLyBjbGFzcyBkZWZhdWx0cyB0byBBTUI7IElIS0UzMzAzUzAyIGRldGFpbCBmYW4tb3V0IG1heSBvdmVycmlkZSB0b1xuICAvLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUgKFx1NjAyNVx1OEEzQSAvIFx1NEY0Rlx1OTY2MikuXG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBlbmRfZGF0ZTogXCJcIixcbiAgICBjbGFzczogY2xhc3NIaW50IHx8IFwiQU1CXCIsXG4gICAgLy8gRm9yIHBoYXJtYWN5OiBlbWl0IFwiXHU4NUU1XHU1QzQwXCIgc28gU01BUlQgYXBwcyBnZXQgYSBjbGVhciB2aXNpdC10eXBlXG4gICAgLy8gbWFya2VyLiBGb3IgZXZlcnl0aGluZyBlbHNlOiBrZWVwIHRoZSBOSEkgZGF0YS1zb3VyY2UgbGFiZWxcbiAgICAvLyAoSUNcdTUzNjFcdThDQzdcdTY1OTkgLyBcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTkpIFx1MjAxNCBoaXN0b3JpY2FsIGNvbnRyYWN0LCBzdGlsbCB1c2VmdWwgZm9yXG4gICAgLy8gY29uc3VtZXJzIHRoYXQgYWxyZWFkeSB3aXJlZCBhZ2FpbnN0IGl0LlxuICAgIHR5cGVfZGlzcGxheTogaXNQaGFybWFjeVxuICAgICAgPyBcIlx1ODVFNVx1NUM0MFwiXG4gICAgICA6IGl0ZW0ub3JpX3R5cGVfbmFtZSB8fCBpdGVtLm9ySV9UWVBFX05BTUUgfHwgXCJcIixcbiAgICBkZXBhcnRtZW50OiBcIlwiLFxuICAgIHByb3ZpZGVyOiBcIlwiLFxuICAgIC8vIEVuZ2xpc2ggcmVhc29uIChjbGluaWNhbCkgYW5kIENoaW5lc2UgcmVhc29uIChwYXRpZW50LWZhY2luZykgYXJlXG4gICAgLy8gc291cmNlZCBmcm9tIHRoZSBzYW1lIGJpbGluZ3VhbCBOSEkgZmllbGQ7IG1hcHBlciBwbGFjZXMgRW5nbGlzaFxuICAgIC8vIGludG8gcmVhc29uQ29kZVswXS5jb2RpbmdbMF0uZGlzcGxheSBhbmQgQ2hpbmVzZSBpbnRvIC50ZXh0LlxuICAgIHJlYXNvbjogaWNkTmFtZSA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lfWAgOiBpY2ROYW1lKSA6IFwiXCIsXG4gICAgcmVhc29uX3poOiBpY2ROYW1lX3poID8gKGljZENvZGUgPyBgJHtpY2RDb2RlfSAke2ljZE5hbWVfemh9YCA6IGljZE5hbWVfemgpIDogXCJcIixcbiAgICByZWFzb25fY29kZTogaWNkQ29kZSxcbiAgICAvLyBTZWNvbmRhcnkgZGlhZ25vc2VzIChcdTZCMjFcdThBM0FcdTY1QjcpIGNvbWUgZnJvbSBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dFxuICAgIC8vIFx1MjAxNCBsaXN0IGVuZHBvaW50IG9ubHkgZXhwb3NlcyB0aGUgcHJpbWFyeSBJQ0QuIFRoZSBtYXBwZXIgYXBwZW5kc1xuICAgIC8vIG9uZSBFbmNvdW50ZXIucmVhc29uQ29kZVtdIGVudHJ5IHBlciBzZWNvbmRhcnksIHByZXNlcnZpbmcgb3JkZXJcbiAgICAvLyAocHJpbWFyeSBmaXJzdCwgdGhlbiBcdTZCMjFcdThBM0FcdTY1QjcxLCAyLCAzLCAuLi4gdXAgdG8gNCBvYnNlcnZlZCBpbiBsaXZlXG4gICAgLy8gTkhJIGRhdGEpLiBFbXB0eSBhcnJheSB3aGVuIGNhbGxlciBkaWRuJ3QgZmV0Y2ggZGV0YWlsIG9yIE5ISVxuICAgIC8vIHJldHVybmVkIG5vIHNlY29uZGFyaWVzLlxuICAgIHNlY29uZGFyeV9kaWFnbm9zZXM6XG4gICAgICBvcHRpb25zICYmIEFycmF5LmlzQXJyYXkob3B0aW9ucy5zZWNvbmRhcnlfZGlhZ25vc2VzKVxuICAgICAgICA/IG9wdGlvbnMuc2Vjb25kYXJ5X2RpYWdub3Nlc1xuICAgICAgICA6IFtdLFxuICAgIGhvc3BpdGFsLFxuICAgIC8vIFBhc3MgdGhyb3VnaCBmb3IgdGhlIGV2ZW50dWFsIElIS0UzMzAzUzAyIGRldGFpbCBmZXRjaCAoUGhhc2UgQikuXG4gICAgcm93X2lkOiBpdGVtLnJvV19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzIwM1MwMSAoXHU3NUFCXHU4MkQ3IC8gXHU5ODEwXHU5NjMyXHU2M0E1XHU3QTJFXHU3RDAwXHU5MzA0KSBcdTIwMTQgZmxhdCBsaXN0IGVuZHBvaW50LCByZXNwb25zZSBzaGFwZTpcbi8vICAgc1BfSUhLRTMyMDNTMDE6IFtcbi8vICAgICB7IHJvd251bSwgaW5vY3VsYXRFX0Q6IFwiMTEyLzEyLzI3XCIgKFx1NkMxMVx1NTcwQiksIGNvZEVfQ05BTUU6IFx1NEUyRFx1NjU4N1x1NzVBQlx1ODJEN1x1NTQwRCxcbi8vICAgICAgIGhvc1BfQUJCUjogXHU2M0E1XHU3QTJFXHU5NjYyXHU2MjQwLCBzb3VyY2U6IFwiXHU3NUJFXHU3NUM1XHU3QkExXHU1MjM2XHU3RjcyXCIgfVxuLy8gICBdXG4vL1xuLy8gTkhJIHNoaXBzIENoaW5lc2Utb25seSBvbiBgY29kRV9DTkFNRWAgKG5vIGJpbGluZ3VhbCBgfHxgIGhlcmUpLiBGb3Jcbi8vIENPVklELTE5IHZhY2NpbmVzIE5ISSBidW5kbGVzIHRoZSBsb3QgbnVtYmVyIGludG8gdGhlIG5hbWU6XG4vLyAgIFwiXHU4RjFEXHU3NDVFL0JOVCBDT1ZJRC0xOVx1NzVBQlx1ODJENyhcdTYyNzlcdTg2NUYxSTA3MEEpXCJcbi8vICAgXCJcdTgzQUJcdTVGQjdcdTdEMERTcGlrZXZheFx1OTZEOVx1NTBGOVx1NzVBQlx1ODJENyhPL09fQkEuMSkoXHU2Mjc5XHU4NjVGMDM1RTIyQSlcIlxuLy8gICBcIkNPVklELTE5XHU3NUFCXHU4MkQ3KEFzdHJhWmVuZWNhKShcdTYyNzlcdTg2NUZEMDA2QSlcIlxuLy9cbi8vIEFkYXB0ZXIgc3BsaXRzIFwiKFx1NjI3OVx1ODY1RlhYWFgpXCIgaW50byBhIHNlcGFyYXRlIGxvdF9udW1iZXIgZmllbGQgc28gdGhlXG4vLyBGSElSIG1hcHBlciBjYW4gcG9wdWxhdGUgSW1tdW5pemF0aW9uLmxvdE51bWJlciBhbmQgdGhlIGRpc3BsYXllZFxuLy8gdmFjY2luZSBuYW1lIHN0YXlzIGNsZWFuLiBJbmZsdWVuemEgKFwiXHU2RDQxXHU2MTFGXHU3NUFCXHU4MkQ3XCIpIGhhcyBubyBiYXRjaFxuLy8gc3VmZml4IFx1MjAxNCBsb3RfbnVtYmVyIGVuZHMgdXAgZW1wdHksIG1hcHBlciBvbWl0cyB0aGUgZmllbGQuXG4vL1xuLy8gc3RhdHVzOiBJbW11bml6YXRpb24gcmVjb3JkcyBvbiBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgYXJlIHBvc3QtYWRtaW5pc3RyYXRpb24gb25seVxuLy8gKE5ISSBkb2Vzbid0IHNob3cgcGxhbm5lZCAvIG5vdC1naXZlbiB2YWNjaW5lcyksIHNvIHRoZSBtYXBwZXJcbi8vIGhhcmRjb2RlcyBJbW11bml6YXRpb24uc3RhdHVzID0gXCJjb21wbGV0ZWRcIi5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltbXVuaXphdGlvbihpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmlub2N1bGF0RV9EIHx8IGl0ZW0uaW5vY3VsYXRlX2QgfHwgXCJcIik7XG4gIGNvbnN0IHJhd05hbWUgPSBTdHJpbmcoaXRlbS5jb2RFX0NOQU1FIHx8IGl0ZW0uY29kZV9jbmFtZSB8fCBcIlwiKS50cmltKCk7XG4gIGlmICghZGF0ZSB8fCAhcmF3TmFtZSkgcmV0dXJuIG51bGw7XG4gIC8vIEV4dHJhY3QgdGhlIExBU1QgKFx1NjI3OVx1ODY1RlhYWCkgb2NjdXJyZW5jZTsgc29tZSB2YWNjaW5lcyBoYXZlIG11bHRpcGxlXG4gIC8vIHBhcmVucyBsaWtlIFwiKE8vT19CQS4xKShcdTYyNzlcdTg2NUYwMzVFMjJBKVwiIFx1MjAxNCBvbmx5IHRoZSBcdTYyNzlcdTg2NUYgb25lIGlzIHRoZSBsb3QuXG4gIGNvbnN0IGxvdE1hdGNoID0gcmF3TmFtZS5tYXRjaCgvW1x1RkYwOChdXFxzKlx1NjI3OVx1ODY1RlxccyooW14pXHVGRjA5XSs/KVxccypbKVx1RkYwOV0vKTtcbiAgY29uc3QgbG90TnVtYmVyID0gbG90TWF0Y2ggPyBsb3RNYXRjaFsxXS50cmltKCkgOiBcIlwiO1xuICBjb25zdCBjbGVhbk5hbWUgPSByYXdOYW1lXG4gICAgLnJlcGxhY2UoL1tcdUZGMDgoXVxccypcdTYyNzlcdTg2NUZcXHMqW14pXHVGRjA5XStcXHMqWylcdUZGMDldLywgXCJcIilcbiAgICAudHJpbSgpO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgdmFjY2luZV9uYW1lOiBjbGVhbk5hbWUgfHwgcmF3TmFtZSxcbiAgICBsb3RfbnVtYmVyOiBsb3ROdW1iZXIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gTkhJJ3Mgc291cmNlLW9mLXJlY29yZCBtYXJrZXI7IHByZXNlcnZlZCBvbiB0aGUgcmVzb3VyY2UgYXNcbiAgICAvLyBwZXJmb3JtZXItb3JnIGNvbnRleHQgKFx1NzVCRVx1NzVDNVx1N0JBMVx1NTIzNlx1N0Y3MiA9IFRhaXdhbiBDREMpLlxuICAgIHNvdXJjZTogaXRlbS5zb3VyY2UgfHwgXCJcIixcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0QWxsZXJneShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGFsbGVyZ2VuID1cbiAgICBpdGVtLmFsbGVyZ2VuX25hbWUgfHwgaXRlbS5hbGxlUl9OQU1FIHx8IGl0ZW0ubWVkbmFtZSB8fFxuICAgIGl0ZW0uZHJ1R19OQU1FIHx8IGl0ZW0uYWxsZXJnZW4gfHwgXCJcIjtcbiAgaWYgKCFhbGxlcmdlbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5yZWNvckRfREFURSB8fCBcIlwiKSxcbiAgICBkaXNwbGF5OiBhbGxlcmdlbixcbiAgICBjYXRlZ29yeTogXCJtZWRpY2F0aW9uXCIsXG4gICAgY3JpdGljYWxpdHk6IFwidW5hYmxlLXRvLWFzc2Vzc1wiLFxuICAgIHJlYWN0aW9uOiBpdGVtLnJlYWN0aW9OIHx8IGl0ZW0uc3ltcHRvbSB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwMVMwNSAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBsaXN0KSBpcyBtZXRhZGF0YS1vbmx5OlxuLy8gICB7aG9zcF9pZCwgaG9zcF9hYmJyLCBob3NwX3VybCwgb3JpX3R5cGVfbmFtZSwgb3JpX3R5cGUsIGZ1bmNfZGF0ZSxcbi8vICAgIG91dF9kYXRlLCBpY2Q5Y21fY29kZSwgaWNkOWNtX2NvZGVfY25hbWUsIG9wX2NvZGVfY25hbWUsIHJvd19pZH1cbi8vIE5vIHByb2NlZHVyZSBDT0RFIChJQ0QtMTAtUENTKSBhbmQgbm8gYWN0dWFsIGV4YW0tZGF0ZS4gVGhlIHByb2NlZHVyZVxuLy8gQ09ERSArIGV4ZV9TX0RBVEUgb25seSBzaG93IHVwIG9uIHRoZSBJSEtFMzMwOFMwMiBkZXRhaWwgZW5kcG9pbnRcbi8vIChhbmFsb2dvdXMgdG8gSUhLRTM0MDhTMDEgaW1hZ2luZyBsaXN0IFx1MjE5MiBTMDIgZGV0YWlsKS4gV2UgZG8gYSAyLXN0ZXBcbi8vIGZhbi1vdXQgZnJvbSB0aGUgbGlzdCdzIHJvd19JRDsgdGhlIGxpc3QgYWRhcHRlciB0aGVyZWZvcmUgcmV0dXJuc1xuLy8gbnVsbCBhbmQgdGhlIHJlYWwgd29yayBoYXBwZW5zIGluIGFkYXB0UHJvY2VkdXJlRnJvbURldGFpbCBiZWxvdy5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFByb2NlZHVyZUxpc3RTdHViKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBJSEtFMzMwOFMwMiAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBkZXRhaWwpIHNoYXBlIChwZXIgcm93IGluIGloa2UzMzA4UzAyX21haW5fZGF0YSk6XG4vLyAgIHtyb3dpZCwgbWFpbl90aXQgKFwiMTA1LzA5LzIzIH4gMTA1LzA5LzI2XHVGRjVDXHU0RjRGXHU5NjYyXCIgb3IgXCIxMDUvMDEvMTRcdUZGNUNcdTk1ODBcdThBM0FcIiksXG4vLyAgICBob3NwX0lELCBob3NwX0FCQlIsIGhvc3BfdXJsLCBvcmlfVFlQRV9OQU1FLCBvcmlfVFlQRSxcbi8vICAgIGljZDljbV9DT0RFLCBpY2Q5Y21fQ09ERV9DTkFNRSwgICAgICAgICBcdTIxOTAgcmVhc29uIGZvciBwcm9jZWR1cmVcbi8vICAgIG9wX0NPREUsICAgIG9wX0NPREVfQ05BTUUsICAgICAgICAgICAgICBcdTIxOTAgSUNELTEwLVBDUyArIGJpbGluZ3VhbCBsYWJlbFxuLy8gICAgZnVuY19EQVRFLCBmdW5jX1NFUV9OTywgcGFydF9BTVQsIGFwcGxfRE9ULFxuLy8gICAgc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0OiBbe1xuLy8gICAgICAgZXhlX1NfREFURSAoXCJZWVkvTU0vRER8fFlZWVkvTU0vRERcIiksICBcdTIxOTAgYWN0dWFsIGV4ZWN1dGlvbiBkYXRlXG4vLyAgICAgICBvcmRlcl9DT0RFX05BTUUgKGJpbGluZ3VhbCksICAgICAgICAgICBcdTIxOTAgTkhJIGJpbGxpbmctaXRlbSBuYW1lXG4vLyAgICAgICBvcmRlcl9DT0RFLCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTIxOTAgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQ1xuLy8gICAgfSwgLi4uXX1cbi8vXG4vLyBEYXRlIGZpZWxkIGNob2ljZSBcdTIwMTQgSUhLRTMzMDhTMDIgZGV0YWlsIGV4cG9zZXM6XG4vLyAgIC0gc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0W10uZXhlX1NfREFURSBcdTIwMTQgXHU1N0Y3XHU4ODRDXHU4RDc3XHU1OUNCXHU2NUU1OyB0aGlzIGlzIHRoZVxuLy8gICAgICAgICAgICAgICAgICAgICAgYWN0dWFsIGRheSB0aGUgcGF0aWVudCBoYWQgdGhlIHByb2NlZHVyZS4gRm9yXG4vLyAgICAgICAgICAgICAgICAgICAgICBpbnBhdGllbnQgcHJvY2VkdXJlcyAoYWRtaXQgTS8wMSwgc3VyZ2VyeSBNLzA1LFxuLy8gICAgICAgICAgICAgICAgICAgICAgZGlzY2hhcmdlIE0vMTApIGV4ZV9TX0RBVEUgPSBNLzA1IFx1MjAxNCBjb3JyZWN0LlxuLy8gICAtIGZ1bmNfREFURSAgICAgICBcdTIwMTQgb3JkZXIvdmlzaXQgYW5jaG9yIGRheSAoXHU5NTgwXHU4QTNBXHU5NThCXHU1NUFFXHU2NUU1IC8gXHU1MTY1XHU5NjYyXHU2NUU1KTtcbi8vICAgICAgICAgICAgICAgICAgICAgIHNhbWUgd3JvbmctYW5jaG9yIHBhdHRlcm4gYXMgaW1hZ2luZyBcdTIwMTQgdXNpbmcgaXRcbi8vICAgICAgICAgICAgICAgICAgICAgIGZvciBpbnBhdGllbnQgcHJvY2VkdXJlcyBzaGlmdHMgdGhlIGV4YW0gYmFja1xuLy8gICAgICAgICAgICAgICAgICAgICAgdG8gdGhlIGFkbWlzc2lvbiBkYXkuXG4vLyBGYWxsYmFjayBjaGFpbjogZmlyc3Qgc3ViLWxpc3QgZW50cnkncyBleGVfU19EQVRFIFx1MjE5MiBmdW5jX0RBVEUuXG4vL1xuLy8gRkhJUiBjb2Rpbmcgc3RyYXRlZ3k6XG4vLyAgIC0gUHJvY2VkdXJlLmNvZGUgY29kaW5nIHVzZXMgb3BfQ09ERSAoSUNELTEwLVBDUykgYXMgdGhlIHByaW1hcnlcbi8vICAgICBjb2RlZCB2YWx1ZSB3aXRoIHN5c3RlbT1pY2QtMTAtcGNzIFx1MjAxNCB3YXMgcHJldmlvdXNseSB0aGUgZW1wdHlcbi8vICAgICBzdHJpbmcgYmVjYXVzZSB0aGUgbGlzdCBlbmRwb2ludCBuZXZlciBjYXJyaWVzIGl0LlxuLy8gICAtIGljZDljbV9DT0RFICsgQ05BTUUgbWFwIHRvIGEgUmVhc29uOiBwcmVmaXggaW4gdGhlIG5vdGUgKHNhbWVcbi8vICAgICBwYXR0ZXJuIHRoZSBvbGQgYWRhcHRlciB1c2VkKSBzbyB0aGUgbWFwcGVyJ3MgXCJubyBub3RlIFx1MjE5MiBkcm9wXCJcbi8vICAgICBmaWx0ZXIga2VlcHMgYmVuaWduIHJvd3Mgb3V0IHdoaWxlIGxldHRpbmcgZ2VudWluZSBwcm9jZWR1cmVzXG4vLyAgICAgcGFzcy5cbi8vICAgLSBTdWItbGlzdCBlbnRyaWVzJyBvcmRlcl9DT0RFX05BTUUgKyBvcmRlcl9DT0RFIGdvIGludG8gdGhlIG5vdGVcbi8vICAgICBhcyBcdTY1QkRcdTRGNUM6IGxpbmVzIHNvIFNNQVJUIGFwcHMgY2FuIHNob3cgdGhlIE5ISSBiaWxsaW5nIGJyZWFrZG93bi5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFByb2NlZHVyZUZyb21EZXRhaWwoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBzdWJMaXN0ID0gQXJyYXkuaXNBcnJheShpdGVtLnNwX0lIS0UzMzA4UzA0X2RhdGFfbGlzdClcbiAgICA/IGl0ZW0uc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0XG4gICAgOiBbXTtcbiAgLy8gZXhlX1NfREFURSBmb3JtYXQgaXMgXCIxMTUvMDkvMjN8fDIwMjYvMDkvMjNcIjsgcm9jVG9JU08gYWxyZWFkeVxuICAvLyBtYXRjaGVzIHRoZSBmaXJzdCBST0Mgc2VnbWVudCwgc28gZmVlZGluZyB0aGUgd2hvbGUgc3RyaW5nIHdvcmtzLlxuICBjb25zdCBleGVEYXRlID0gc3ViTGlzdC5sZW5ndGggPiAwXG4gICAgPyAoc3ViTGlzdFswXS5leGVfU19EQVRFIHx8IHN1Ykxpc3RbMF0uZXhlX3NfZGF0ZSB8fCBcIlwiKVxuICAgIDogXCJcIjtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGV4ZURhdGUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgaXRlbS5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIC8vIG9wX0NPREVfQ05BTUUgaXMgXCI8Q09ERT4vPFx1NEUyRFx1NjU4Nz58fDxDT0RFPi88RW5nbGlzaD5cIi4gVGFrZSB0aGVcbiAgLy8gRW5nbGlzaCBoYWxmLCBzdHJpcCB0aGUgbGVhZGluZyBcIjxDT0RFPi9cIiBzbyB0aGUgZGlzcGxheSByZWFkc1xuICAvLyBsaWtlIFwiRXhjaXNpb24gb2YgTGVmdCBWaXRyZW91cywgUGVyY3V0YW5lb3VzIEFwcHJvYWNoXCIgcmF0aGVyXG4gIC8vIHRoYW4gXCIwOEI1M1paL0V4Y2lzaW9uIG9mIExlZnQgVml0cmVvdXNcdTIwMjZcIi5cbiAgY29uc3Qgb3BDb2RlID0gaXRlbS5vcF9DT0RFIHx8IGl0ZW0ub3BfY29kZSB8fCBcIlwiO1xuICBjb25zdCByYXdPcE5hbWUgPSBpdGVtLm9wX0NPREVfQ05BTUUgfHwgaXRlbS5vcF9jb2RlX2NuYW1lIHx8IFwiXCI7XG4gIGNvbnN0IG9wTmFtZSA9IHBpY2tFbmdsaXNoKHJhd09wTmFtZSk7XG4gIGNvbnN0IG9wTmFtZV96aCA9IHBpY2tDaGluZXNlKHJhd09wTmFtZSk7XG4gIGNvbnN0IHN0cmlwQ29kZSA9IChzKSA9PiAocyB8fCBcIlwiKS5yZXBsYWNlKC9eW0EtWjAtOV0rXFwvLywgXCJcIikudHJpbSgpO1xuICBjb25zdCBkaXNwbGF5ID0gc3RyaXBDb2RlKG9wTmFtZSkgfHwgb3BOYW1lLnRyaW0oKTtcbiAgY29uc3QgZGlzcGxheV96aCA9IHN0cmlwQ29kZShvcE5hbWVfemgpO1xuICBpZiAoIWRhdGUgfHwgIWRpc3BsYXkpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHJlYXNvbkNvZGUgPSBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgcmVhc29uTmFtZSA9XG4gICAgKHBpY2tFbmdsaXNoKGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fY29kZV9jbmFtZSB8fCBcIlwiKSB8fCBcIlwiKVxuICAgICAgLnJlcGxhY2UoL15bQS1aMC05XStcXC8vLCBcIlwiKVxuICAgICAgLnRyaW0oKTtcbiAgY29uc3Qgbm90ZVBhcnRzID0gW107XG4gIGlmIChyZWFzb25OYW1lKSB7XG4gICAgbm90ZVBhcnRzLnB1c2gocmVhc29uQ29kZSA/IGBSZWFzb246ICR7cmVhc29uQ29kZX0gJHtyZWFzb25OYW1lfWAgOiBgUmVhc29uOiAke3JlYXNvbk5hbWV9YCk7XG4gIH1cbiAgZm9yIChjb25zdCBzdWIgb2Ygc3ViTGlzdCkge1xuICAgIGNvbnN0IHN1Yk5hbWUgPSBwaWNrRW5nbGlzaChzdWIub3JkZXJfQ09ERV9OQU1FIHx8IHN1Yi5vcmRlcl9jb2RlX25hbWUgfHwgXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHN1YkNvZGUgPSBzdWIub3JkZXJfQ09ERSB8fCBzdWIub3JkZXJfY29kZSB8fCBcIlwiO1xuICAgIGlmIChzdWJOYW1lKSB7XG4gICAgICBub3RlUGFydHMucHVzaChzdWJDb2RlID8gYFx1NjVCRFx1NEY1QzogJHtzdWJOYW1lfSAoTkhJICR7c3ViQ29kZX0pYCA6IGBcdTY1QkRcdTRGNUM6ICR7c3ViTmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogb3BDb2RlLFxuICAgIC8vIEhpbnQgZm9yIG1hcFByb2NlZHVyZS5tYXBTeXN0ZW0gXHUyMDE0IFwiaWNkLTEwLXBjc1wiIHN0cmluZyBjb250YWluc1xuICAgIC8vIFwiaWNkXCIsIHNvIHRoZSBtYXBwZXIgYXNzaWducyBzeXN0ZW1zLklDRF8xMF9QQ1MuXG4gICAgc3lzdGVtOiBvcENvZGUgPyBcImljZC0xMC1wY3NcIiA6IFwiXCIsXG4gICAgZGlzcGxheSxcbiAgICBkaXNwbGF5X3poLFxuICAgIG5vdGU6IG5vdGVQYXJ0cy5qb2luKFwiIC8gXCIpLFxuICAgIGJvZHlfc2l0ZTogXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTM0MDhTMDEgKFx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNSBsaXN0KSBzaGFwZTpcbi8vICAge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIHJlYWxfSU5TUEVDVF9EQVRFLCBvcmRlcl9DT0RFLFxuLy8gICAgb3JkZXJfQ09ERV8yV29yZCwgb3JkZXJfTkFNRSwgb3JpX1RZUEUsIHJvd19JRCwganBHX1NUQVRVUywgLi4ufVxuLy8gTm8gZmluZGluZ3MvY29uY2x1c2lvbiBcdTIwMTQgbGlzdCBpcyBvcmRlci1sZXZlbCBvbmx5LiBXZSBtYXAgdG8gUHJvY2VkdXJlXG4vLyAoYW4gZXhhbSB3YXMgcGVyZm9ybWVkKSByYXRoZXIgdGhhbiBEaWFnbm9zdGljUmVwb3J0ICh3aGljaCBuZWVkcyBhXG4vLyBuYXJyYXRpdmUpLiBJZi93aGVuIHdlIGZldGNoIHRoZSBhY3R1YWwgcmVwb3J0IHRoaXMgYmVjb21lcyBhIERSLlxuLy8gSUhLRTM0MDhTMDIgZGV0YWlsIHByb3ZpZGVzIHRoZSBmdWxsIHJhZGlvbG9neSAvIGVuZG9zY29weSByZXBvcnQgaW5cbi8vIGBkZXNjYC4gQ29tYmluZWQgd2l0aCBvcmRlcl9OQU1FICsgdGhlIGV4YW0gZGF0ZSB0aGlzIGlzIGEgcHJvcGVyIEZISVJcbi8vIERpYWdub3N0aWNSZXBvcnQuIExpc3Qtb25seSBlbnRyaWVzICh3aGVyZSB0aGUgZGV0YWlsIGZldGNoIHJldHVybmVkXG4vLyBubyBgZGVzY2ApIGdldCBkcm9wcGVkIFx1MjAxNCB3aXRob3V0IGEgbmFycmF0aXZlIHRoZSByZXBvcnQgbWFwcGVyIHdvdWxkXG4vLyByZWplY3QgdGhlbSBhbnl3YXkuXG4vL1xuLy8gRGF0ZSBmaWVsZCBjaG9pY2UgXHUyMDE0IElIS0UzNDA4UzAyIGRldGFpbCBwYXlsb2FkIGV4cG9zZXMgKGluIG9yZGVyXG4vLyBvZiBhY2N1cmFjeSBmb3IgXCJ3aGVuIGRpZCB0aGUgcGF0aWVudCBhY3R1YWxseSBoYXZlIHRoZSBleGFtXCIpOlxuLy8gICAtIHJlYWxfSU5TUEVDVF9EQVRFICBcdTVCRTZcdTk2OUJcdTYzQTFcdTZBQTIvXHU1MDVBXHU1RjcxXHU1MENGXHU2NUU1IFx1MjAxNCBtb3N0IGFjY3VyYXRlIGJ1dCBOSElcbi8vICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9ubHkgc2hpcHMgdGhpcyBhcyBudWxsIG9uIFMwMiBkZXRhaWxcbi8vICAgLSBtYWluX3RpdCAgICAgICAgICAgXHU3QzNEXHU2NTM2XHU2NUU1IFx1MjAxNCB0aGUgY2FyZCdzIHByb21pbmVudCBoZWFkZXIgZGF0ZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICBpbiBOSEkncyBvd24gVUkuIFNlbWFudGljYWxseSB0aGlzIGlzIHdoZW5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV4YW0gd2FzIHBlcmZvcm1lZCBhbmQgc2lnbmVkIG9mZiAoTk9UXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBvcmRlciBkYXkpLiBDbG9zZXN0IHByb3h5IHdoZW5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgcmVhbF9JTlNQRUNUX0RBVEUgaXMgbnVsbC5cbi8vICAgLSBmdW5jX0RBVEUgICAgICAgICAgXHU5NTgwXHU4QTNBXHU5NThCXHU1NUFFXHU2NUU1IChPUEQpIC8gXHU1MTY1XHU5NjYyXHU2NUU1IChpbnBhdGllbnQpIFx1MjAxNCB0aGVcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZSB0aGUgb3JkZXIgd2FzIHdyaXR0ZW4sIE5PVCB0aGUgZGF0ZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXhhbSBoYXBwZW5lZC4gRm9yIE9QRCBpbWFnaW5nIHRoYXQgaXNcbi8vICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVkIGxhdGVyIChlLmcuIGVjaG8gb3JkZXJlZCAxLzMxLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBkb25lIDIvMjkpIHVzaW5nIGZ1bmNfREFURSBzaGlmdHMgdGhlIGV4YW1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgYmFjayB0byB0aGUgb3JkZXIgZGF5IFx1MjAxNCB3cm9uZy5cbi8vICAgLSBhc3NheV9VUExPQURfREFURSAgTkhJIFx1NjUzNlx1NkE5NFx1NjY0Mlx1OTU5MyBcdTIwMTQgaW50ZXJuYWwgZGF0YS1waXBlbGluZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA7IGJlbG9uZ3MgdG8gRGlhZ25vc3RpY1JlcG9ydC5pc3N1ZWQuXG4vLyBGYWxsYmFjayBjaGFpbjogcmVhbF9JTlNQRUNUX0RBVEUgXHUyMTkyIG1haW5fdGl0IFx1MjE5MiBmdW5jX0RBVEUuIG1haW5fdGl0XG4vLyBnb2VzIGFib3ZlIGZ1bmNfREFURSBiZWNhdXNlIG1haW5fdGl0IElTIHdoYXQgTkhJIGl0c2VsZiBkaXNwbGF5c1xuLy8gdG8gdGhlIHBhdGllbnQgYXMgXCJ0aGlzIHJlcG9ydCdzIGRhdGVcIiBhbmQgcmVmbGVjdHMgdGhlIHNpZ24tb2ZmIC9cbi8vIGV4YW0gZGF5LiBmdW5jX0RBVEUgcmVtYWlucyBhcyBsYXN0IHJlc29ydCBzbyBhIG1hbGZvcm1lZCByb3dcbi8vIHdpdGhvdXQgbWFpbl90aXQgc3RpbGwgcHJvZHVjZXMgc29tZSBkYXRlIGluc3RlYWQgb2YgYmVpbmcgZHJvcHBlZC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKFxuICAgIGl0ZW0ucmVhbF9JTlNQRUNUX0RBVEUgfHwgaXRlbS5yZWFsX2luc3BlY3RfZGF0ZSB8fFxuICAgIGl0ZW0ubWFpbl90aXQgfHwgaXRlbS5tYWluX1RJVCB8fFxuICAgIGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIsXG4gICk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChpdGVtLm9yZGVyX05BTUUgfHwgaXRlbS5vcmRlcl9uYW1lIHx8IFwiXCIpO1xuICBjb25zdCBjb25jbHVzaW9uID0gKGl0ZW0uZGVzYyB8fCBcIlwiKS50cmltKCk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSB8fCAhY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBpdGVtLm9yZGVyX0NPREUgfHwgaXRlbS5vcmRlcl9jb2RlIHx8IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgY2F0ZWdvcnk6IFwiUkFEXCIsXG4gICAgY29uY2x1c2lvbixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAvLyBOSEkgc2VwYXJhdGVzIHRoZSBleGFtIGRhdGUgKGZ1bmNfREFURSkgZnJvbSB0aGUgcmVwb3J0LXVwbG9hZFxuICAgIC8vIHRpbWVzdGFtcCAoYXNzYXlfVVBMT0FEX0RBVEUpLiBUaGUgbGF0dGVyIGlzIHdoZW4gdGhlIHJlcG9ydFxuICAgIC8vIHdhcyBmaW5hbGlzZWQgaW4gTkhJJ3Mgc3lzdGVtIFx1MjAxNCBtYXBzIHRvIERpYWdub3N0aWNSZXBvcnQuaXNzdWVkLlxuICAgIC8vIEZhbGxzIGJhY2sgdG8gTm9uZSBpZiBOSEkgZGlkbid0IHNoaXAgb25lLlxuICAgIGlzc3VlZDogcm9jVG9JU08oKGl0ZW0uYXNzYXlfVVBMT0FEX0RBVEUgfHwgXCJcIikuc3BsaXQoL1xccysvKVswXSksXG4gIH07XG59XG4iLCAiLy8gTkhJIEFQSSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgd2hhdCB3ZSBmZXRjaCwgd2hlcmUgZWFjaCByb3cgZ29lcyxcbi8vIHdoaWNoIGFkYXB0ZXIgdG8gY2FsbCBvbiBpdC5cbi8vXG4vLyBFeHRyYWN0ZWQgZnJvbSBiYWNrZ3JvdW5kLmpzIHNvIHdlIGNhbjpcbi8vICAgMS4gVW5pdC10ZXN0IFwiZXZlcnkgZW5kcG9pbnQgbmFtZSBoYXMgYSBDaGluZXNlIGxhYmVsXCIgXHUyMDE0IGhpc3RvcmljYWxseVxuLy8gICAgICBpdCB3YXMgZWFzeSB0byBhZGQgYSBuZXcgZW5kcG9pbnQgYW5kIGZvcmdldCB0byB1cGRhdGVcbi8vICAgICAgRU5EUE9JTlRfTEFCRUxfWkgsIGxlYXZpbmcgdGhlIHBvcHVwJ3MgXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwIHJvdyBsYWJlbGxlZCB3aXRoXG4vLyAgICAgIHRoZSBkZXYtZmxhdm91cmVkIHJhdyBrZXkgKFwib3RoZXJfbGFic1wiIGluc3RlYWQgb2YgXCJcdTZBQTJcdTlBNTdcIikuXG4vLyAgIDIuIEtlZXAgYmFja2dyb3VuZC5qcyBmb2N1c2VkIG9uIGZsb3cgY29udHJvbCArIHRhYi9JTyBsb2dpYy5cbi8vXG4vLyBBZGFwdGVyIHJlZmVyZW5jZXMgbGl2ZSBpbiAuL25oaS1hZGFwdGVycy5qcy4gU2VlIHRoYXQgbW9kdWxlIGZvciB0aGVcbi8vIHBlci1hZGFwdGVyIGZpZWxkLXByaW9yaXR5IGRlY2lzaW9ucyAoZGF0ZSBzZWxlY3Rpb24sIG5hbWUgZmFsbGJhY2tzLFxuLy8gYmlsaW5ndWFsIHNwbGl0dGluZywgZXRjLikuXG5cbmltcG9ydCB7XG4gIGFkYXB0QWR1bHRQcmV2ZW50aXZlLFxuICBhZGFwdEFsbGVyZ3ksXG4gIGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyxcbiAgYWRhcHRDaHJvbmljTGlzdFN0dWIsXG4gIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsXG4gIGFkYXB0SW1hZ2luZ0xpc3RTdHViLFxuICBhZGFwdEltbXVuaXphdGlvbixcbiAgYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIsXG4gIGFkYXB0TGFiSXRlbSxcbiAgYWRhcHRNZWRpY2F0aW9uLFxuICBhZGFwdFByb2NlZHVyZUxpc3RTdHViLFxufSBmcm9tIFwiLi9uaGktYWRhcHRlcnMuanNcIjtcblxuLy8gVXNlci1mYWNpbmcgbGFiZWwgZm9yIGVhY2ggZW5kcG9pbnQgbmFtZS4gVGhlIGJyZWFrZG93biBjb2xsYXBzaWJsZVxuLy8gaW4gdGhlIHBvcHVwIChcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiKSByZWFkcyBmcm9tIHRoaXMgc28gdXNlcnMgc2VlIFwiXHU1QzMxXHU5MUFCIDEyIFx1N0I0NlwiXG4vLyBpbnN0ZWFkIG9mIHRoZSBkZXYtZmxhdm91cmVkIFwiZW5jb3VudGVycz0xMi8xMlwiLiBVbmtub3duIG5hbWVzIGZhbGxcbi8vIHRocm91Z2ggdG8gdGhlIHJhdyBrZXksIHdoaWNoIGtlZXBzIGl0IG9idmlvdXMgZHVyaW5nIGRldmVsb3BtZW50XG4vLyB3aGVuIHdlIGFkZCBhIG5ldyBlbmRwb2ludCBhbmQgaGF2ZW4ndCBsYWJlbGxlZCBpdCB5ZXQuXG5leHBvcnQgY29uc3QgRU5EUE9JTlRfTEFCRUxfWkggPSB7XG4gIGVuY291bnRlcnM6IFwiXHU1QzMxXHU5MUFCXCIsXG4gIGlucGF0aWVudDogXCJcdTRGNEZcdTk2NjJcIixcbiAgaW5wYXRpZW50X2xlZ2FjeTogXCJcdTRGNEZcdTk2NjJcdUZGMDhcdTgyMEFcdUZGMDlcIixcbiAgcHJvY2VkdXJlczogXCJcdTYyNEJcdTg4NTMgLyBcdTg2NTVcdTdGNkVcIixcbiAgbWVkaWNhdGlvbnM6IFwiXHU4NjU1XHU2NUI5XHU4NUU1XHU1NEMxXCIsXG4gIGNocm9uaWNfcHJlc2NyaXB0aW9uczogXCJcdTYxNjJcdTYwMjdcdTg2NTVcdTY1QjlcdTdCOEJcIixcbiAgYWxsZXJnaWVzOiBcIlx1ODVFNVx1NzI2OVx1OTA0RVx1NjU0RlwiLFxuICBhbGxlcmdpZXNfYjogXCJcdTg1RTVcdTcyNjlcdTkwNEVcdTY1NEZcdUZGMDhCXHVGRjA5XCIsXG4gIGFkdWx0X3ByZXZlbnRpdmU6IFwiXHU2MjEwXHU0RUJBXHU1MDY1XHU2QUEyXCIsXG4gIGNhbmNlcl9zY3JlZW5pbmc6IFwiXHU3NjRDXHU3NUM3XHU3QkU5XHU2QUEyXCIsXG4gIGltYWdpbmc6IFwiXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XCIsXG4gIG90aGVyX2xhYnM6IFwiXHU2QUEyXHU5QTU3XCIsXG4gIGNhdGFzdHJvcGhpY19pbGxuZXNzOiBcIlx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNVwiLFxuICBpbW11bml6YXRpb25zOiBcIlx1NzVBQlx1ODJEN1wiLFxufTtcblxuLy8gcGFnZV90eXBlIFx1MjE5MiBiYWNrZW5kIHBhZ2VfdHlwZSBzdHJpbmcgdXNlZCBieSBtYXBwZXJzLlxuLy8gcGF0aCBpcyByZWxhdGl2ZSB0byBuaGlCYXNlLiBtZXRob2QgZGVmYXVsdCBcIkdFVFwiLlxuLy8gYHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlYCA9IGVuZHBvaW50IGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGluIFx1NkMxMVx1NTcwQiBmb3JtYXQuXG4vLyBDb25maXJtZWQgdmlhIFVSTHMgb2JzZXJ2ZWQgaW4gTkhJJ3MgU1BBLiBPdGhlciBlbmRwb2ludHMgZWl0aGVyIGRvbid0XG4vLyBhY2NlcHQgcmFuZ2UgcGFyYW1zLCBvciBOSEkgcmVqZWN0cyB1bmtub3duIHBhcmFtcyBcdTIwMTQgd2UgbGVhdmUgdGhlbSBhbG9uZVxuLy8gKHRoZXkgZmFsbCBiYWNrIHRvIHRoZWlyIGRlZmF1bHQgd2luZG93LCB0eXBpY2FsbHkgMS0yIHllYXJzKS5cbmV4cG9ydCBjb25zdCBOSElfQVBJX0VORFBPSU5UUyA9IFtcbiAgLy8gZW5jb3VudGVycyAvIHByb2NlZHVyZXMgZG9uJ3QgaGF2ZSBhIC9zZWFyY2ggdmFyaWFudCAoNDA0KS4gcGFnZV9sb2FkXG4gIC8vIHNpbGVudGx5IGlnbm9yZXMgc19kYXRlIC8gZV9kYXRlIFx1MjAxNCB2ZXJpZmllZCB0aGUgYXJyYXkgbGVuZ3RoIGlzXG4gIC8vIGlkZW50aWNhbCB3aXRoIG9yIHdpdGhvdXQgZGF0ZXMuIERhdGUgZmlsdGVyIGlzIGVmZmVjdGl2ZWx5IHVuc3VwcG9ydGVkXG4gIC8vIGZvciB0aGVzZSBlbmRwb2ludHM7IHRoZXkgcmV0dXJuIGFsbCBkYXRhIGluIE5ISSdzIGxpZmV0aW1lIHdpbmRvdy5cbiAgLy8gRW5jb3VudGVyIHNvdXJjZTogSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkuIFRoZSAvcGFnZV9sb2FkIHZhcmlhbnRcbiAgLy8gaXMgd2luZG93LWxpbWl0ZWQgdG8gfjEgeWVhciAocmV0dXJuZWQgNTEgdmlzaXRzIGVuZGluZyAxMTQvMDUpO1xuICAvLyAvc2VhcmNoIGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGFuZCBnb2VzIGJhY2sgZnVydGhlciAoMTYyIHZpc2l0c1xuICAvLyB0byAxMTIvMDUgZm9yIHRoZSBzYW1lIHBhdGllbnQpLiBTaW5jZSBsYWJzL21lZHMgZXh0ZW5kIHRvIDN5IHZpYVxuICAvLyB0aGVpciBvd24gL3NlYXJjaCBlbmRwb2ludHMsIGVuY291bnRlciBNVVNUIGFsc28gdXNlIC9zZWFyY2ggb3JcbiAgLy8gdGhlIChob3NwaXRhbCwgZGF0ZSkgbGlua2VyIGhhcyBub3RoaW5nIHRvIG1hdGNoIGFnYWluc3QgZm9yIG9sZGVyXG4gIC8vIGxhYiBkYXRlcy5cbiAgeyBuYW1lOiBcImVuY291bnRlcnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAzczAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT1cIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElucGF0aWVudCAoXHU0RjRGXHU5NjYyKSBcdTIwMTQgSUhLRTMzMDlTMDEgaXMgdGhlIHByaW1hcnkgbGlzdCB3aXRoIGluX0RBVEUvb3V0X0RBVEVcbiAgLy8gc3Bhbi4gSUhLRTMzMDhTMDEgY2FycmllcyBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3JkcyB3aXRoIHRoZVxuICAvLyBzYW1lIGZpZWxkcyAoZnVuY19EQVRFIGluIHNvbWUgcm93cyBpbnN0ZWFkIG9mIGluX0RBVEU7IGFkYXB0ZXJcbiAgLy8gaGFuZGxlcyBib3RoKS4gQm90aCBmZWVkIHRoZSBzYW1lIGVuY291bnRlciBtYXBwZXIuXG4gIHsgbmFtZTogXCJpbnBhdGllbnRcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOXMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJpbnBhdGllbnRfbGVnYWN5XCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOHMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIC8vIFByb2NlZHVyZXMgKElIS0UzMzAxUzA1KSBsaXN0IG9ubHkgaGFzIG9yZGVyLWxldmVsIG1ldGFkYXRhIFx1MjAxNFxuICAvLyBubyBJQ0QtMTAtUENTIGNvZGUgYW5kIG5vIGFjdHVhbCBwZXJmb3JtZWQtZGF0ZS4gVGhlIGZ1bGxcbiAgLy8gcmVjb3JkIGxpdmVzIGF0IElIS0UzMzA4UzAyIChzdWItbGlzdCBjYXJyaWVzIGV4ZV9TX0RBVEUgK1xuICAvLyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHBlciBleGVjdXRpb24pLiBTYW1lIDItc3RlcCBmYW4tb3V0IHBhdHRlcm4gYXNcbiAgLy8gaW1hZ2luZzsgc2VlIF9mZXRjaFByb2NlZHVyZURldGFpbHNJblRhYi5cbiAgeyBuYW1lOiBcInByb2NlZHVyZXNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAxczA1L3BhZ2VfbG9hZFwiLFxuICAgIHBhZ2VfdHlwZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICBhZGFwdDogYWRhcHRQcm9jZWR1cmVMaXN0U3R1YiB9LFxuICAvLyBtZWRpY2F0aW9uczogcGFnZV9sb2FkIG9ubHkgYWNjZXB0cyBlbXB0eSBkYXRlcyAoSFRUUCA0MDAgb3RoZXJ3aXNlKS5cbiAgLy8gVGhlIC9zZWFyY2ggZW5kcG9pbnQgaXMgd2hhdCB0aGUgU1BBIGhpdHMgd2hlbiB1c2VyIHBpY2tzIGEgY3VzdG9tXG4gIC8vIGRhdGUgcmFuZ2UgYW5kIGFjY2VwdHMgSVNPIFx1ODk3Rlx1NTE0MyBkYXRlcyB3aXRoIGRhc2hlcyAoMjAyMy0wMS0wMSkuXG4gIC8vIENvbmZpcm1lZCB2aWEgRGV2VG9vbHMgb2JzZXJ2YXRpb24gb2YgdGhlIFx1N0JFOVx1OTA3OCBwYW5lbCBzdWJtaXQuXG4gIHsgbmFtZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwNnMwMS9zZWFyY2g/c19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMSZzX3R5cGU9QVwiLFxuICAgIHBhZ2VfdHlwZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICBhZGFwdDogYWRhcHRNZWRpY2F0aW9uLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBcdTYxNjJcdTYwMjdcdTg2NTVcdTY1QjlcdTdCOEIgKHJlZmlsbD1cIllcIikgXHUyMDE0IHNlcGFyYXRlIGxpc3QgZW5kcG9pbnQgZnJvbSBtZWRpY2F0aW9ucy5cbiAgLy8gfjUyIG9mIDEyNiBlbnRyaWVzIG92ZXJsYXAgd2l0aCBJSEtFMzMwNlMwMTsgdGhlIHJlc3QgYXJlXG4gIC8vIGNocm9uaWMtb25seSBhbmQgd291bGQgYmUgbWlzc2VkIGlmIHdlIHJlbGllZCBvbiByZWd1bGFyIGxpc3QgYWxvbmUuXG4gIC8vIFRoZSBjaHJvbmljIGRldGFpbCBmYW4tb3V0IHJ1bnMgQkVGT1JFIHRoZSBtZWRpY2F0aW9uIGZhbi1vdXQgYW5kXG4gIC8vIGl0cyByb3dfSURzIGFyZSBwYXNzZWQgdG8gdGhlIG1lZGljYXRpb24gZmFuLW91dCBhcyBza2lwLXNldCBzb1xuICAvLyBlYWNoIHJvdyBpcyBmZXRjaGVkIG9uY2UuIFNlZSBfZmV0Y2hDaHJvbmljTWVkaWNhdGlvbkRldGFpbHNJblRhYlxuICAvLyBpbiBiYWNrZ3JvdW5kLmpzLiBEZXRhaWwgZW5kcG9pbnQgaXMgdGhlIHNhbWUgSUhLRTMzMDZTMDIgYXNcbiAgLy8gcmVndWxhciBtZWRzOyBjdHlwZSBtdXN0IGVxdWFsIHRoZSBsaXN0IHJvdydzIG9yaV9UWVBFICgxPVx1OTU4MFx1OEEzQSxcbiAgLy8gMj1JQ1x1NTM2MSwgOD1cdTg1RTVcdTVDNDApLCBub3QgaGFyZGNvZGVkIHRvIDguXG4gIHsgbmFtZTogXCJjaHJvbmljX3ByZXNjcmlwdGlvbnNcIiwgcGF0aDogXCIvYXBpL2loa2UzMDAwL0lIS0UzMzA3UzAxL3BhZ2VfbG9hZFwiLFxuICAgIHBhZ2VfdHlwZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICBhZGFwdDogYWRhcHRDaHJvbmljTGlzdFN0dWIgfSxcbiAgeyBuYW1lOiBcImFsbGVyZ2llc1wiLCAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAyczAxL1NQX0lIS0UzMjAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcImFsbGVyZ2llc1wiLCAgICAgICAgIGFkYXB0OiBhZGFwdEFsbGVyZ3kgfSxcbiAgeyBuYW1lOiBcImFsbGVyZ2llc19iXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAyczAxL1NQX0lIS0UzMjAyUzA0XCIsXG4gICAgcGFnZV90eXBlOiBcImFsbGVyZ2llc1wiLCAgICAgICAgIGFkYXB0OiBhZGFwdEFsbGVyZ3kgfSxcbiAgLy8gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1XHU3RDUwXHU2NzlDIChJSEtFMzQwMlMwMSk6IG9uZSByb3cgcGVyIHNjcmVlbmluZywgY29udGFpbnNcbiAgLy8gQk1JIC8gdml0YWxzIC8gbGlwaWQgcGFuZWwgLyBMRlQgLyBSRlQgLyBIZXAgQi9DIC8gdXJpYyBhY2lkIGFsbFxuICAvLyBwcmUtY29tcHV0ZWQgYnkgTkhJJ3Mgc2NyZWVuaW5nIHByb2dyYW1tZS4gYWRhcHRBZHVsdFByZXZlbnRpdmVcbiAgLy8gcmV0dXJucyBhbiBhcnJheSAob25lIE9ic2VydmF0aW9uIHBlciBtZWFzdXJlbWVudCkgc28gdGhlXG4gIC8vIGFkYXB0ZXItY2FsbCBsb29wIGZsYXR0ZW5zIGl0LlxuICB7IG5hbWU6IFwiYWR1bHRfcHJldmVudGl2ZVwiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDJzMDEvU1BfSUhLRTM0MDJTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0QWR1bHRQcmV2ZW50aXZlIH0sXG4gIHsgbmFtZTogXCJjYW5jZXJfc2NyZWVuaW5nXCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwNHMwMS9TUF9JSEtFMzQwNFMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtIH0sXG4gIC8vIGdsdWNvc2UgKElIS0UzNDA2UzAxKSArIGxpcGlkIChJSEtFMzQwN1MwMSkgYXJlIHN1YnNldHMgb2ZcbiAgLy8gb3RoZXJfbGFicyAoSUhLRTM0MDlTMDEpIHBlciBOSEkncyBkYXRhIG1vZGVsIFx1MjAxNCBmZXRjaGluZyB0aGVtXG4gIC8vIHNlcGFyYXRlbHkganVzdCBjcmVhdGVzIGR1cCBvYnNlcnZhdGlvbnMsIHNvIHdlIHNraXAgdGhlbS5cbiAgLy8gSW1hZ2luZyBsaXN0IChJSEtFMzQwOFMwMSkgb25seSBjYXJyaWVzIG9yZGVyLWxldmVsIGRhdGE7IGZ1bGxcbiAgLy8gbmFycmF0aXZlIHJlcG9ydCBsaXZlcyBhdCBJSEtFMzQwOFMwMi4gV2UgZG8gYSAyLXN0ZXAgZmV0Y2ggKHNlZVxuICAvLyBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKSB0byBncmFiIHRoZSByZXBvcnQsIHRoZW4gbWFwIHRvIGEgcmVhbFxuICAvLyBEaWFnbm9zdGljUmVwb3J0LiBUaGUgbGlzdCBhZGFwdGVyIGlzIGEgbm8tb3Agc3R1YiBsaWtlIG1lZGljYXRpb25zLlxuICAvLyBpbWFnaW5nOiBzZWFyY2ggZW5kcG9pbnQgYWNjZXB0cyBJU08gZGF0ZSByYW5nZSBsaWtlIG1lZGljYXRpb25zLlxuICB7IG5hbWU6IFwiaW1hZ2luZ1wiLCAgICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDhzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJkaWFnbm9zdGljX3JlcG9ydHNcIiwgYWRhcHQ6IGFkYXB0SW1hZ2luZ0xpc3RTdHViLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBvdGhlcl9sYWJzIGFscmVhZHkgdXNlcyAvc2VhcmNoOyBzYW1lIElTTy1kYXNoIGRhdGUgZm9ybWF0IHdvcmtzLlxuICB7IG5hbWU6IFwib3RoZXJfbGFic1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDlzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBJSEtFMzIwOVMwMSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KSBcdTIwMTQgTkhJLXZldHRlZCBjYXRhc3Ryb3BoaWMtaWxsbmVzcyByZWdpc3RyeS5cbiAgLy8gRWFjaCByb3cgXHUyMTkyIGEgRkhJUiBDb25kaXRpb24gd2l0aCBjYXRlZ29yeT1wcm9ibGVtLWxpc3QtaXRlbSwgdGhlXG4gIC8vIGNsb3Nlc3QgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGVxdWl2YWxlbnQgdG8gYSBjdXJhdGVkIHByb2JsZW0gbGlzdC4gRW5kcG9pbnRcbiAgLy8gZG9lc24ndCBhY2NlcHQgZGF0ZSBwYXJhbXMgKE5ISSByZXR1cm5zIGN1cnJlbnRseS12YWxpZCBjZXJ0cyBvbmx5KS5cbiAgeyBuYW1lOiBcImNhdGFzdHJvcGhpY19pbGxuZXNzXCIsIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwOXMwMS9TUF9JSEtFMzIwOVMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJjb25kaXRpb25zXCIsICAgICAgICBhZGFwdDogYWRhcHRDYXRhc3Ryb3BoaWNJbGxuZXNzIH0sXG4gIC8vIElIS0UzMjAzUzAxIChcdTk4MTBcdTk2MzJcdTYzQTVcdTdBMkVcdTdEMDBcdTkzMDQgLyBcdTc1QUJcdTgyRDcpIFx1MjAxNCBUYWl3YW4gQ0RDIHNvdXJjZWQuIEVhY2ggcm93XG4gIC8vIFx1MjE5MiBGSElSIEltbXVuaXphdGlvbi4gTkhJIHNoaXBzIENoaW5lc2Utb25seSB2YWNjaW5lIG5hbWVzIHdpdGhcbiAgLy8gYmF0Y2ggbnVtYmVyIGlubGluZWQgYXMgXCIoXHU2Mjc5XHU4NjVGWFhYKVwiOyBhZGFwdGVyIHNwbGl0cyB0aGUgbG90LlxuICAvLyBObyBkYXRlIHJhbmdlIHBhcmFtZXRlciAoTkhJIHJldHVybnMgYWxsIGhpc3RvcmljYWwgdmFjY2luYXRpb25zKS5cbiAgeyBuYW1lOiBcImltbXVuaXphdGlvbnNcIiwgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAzczAxL1NQX0lIS0UzMjAzUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcImltbXVuaXphdGlvbnNcIiwgICAgIGFkYXB0OiBhZGFwdEltbXVuaXphdGlvbiB9LFxuXTtcbiIsICIvLyBTZXJ2aWNlIHdvcmtlciBmb3IgTkhJLUZISVIgQnJpZGdlIFx1MjAxNCBvd25zIHRoZSBsb25nLXJ1bm5pbmdcbi8vIFwiU3luYyBUaGlzIFBhdGllbnRcIiB3b3JrZmxvdyBzbyB0aGUgcG9wdXAgY2FuIGNsb3NlIG1pZC1zeW5jIHdpdGhvdXRcbi8vIGFib3J0aW5nIGl0LlxuLy9cbi8vIExpZmVjeWNsZTpcbi8vICAgLSBwb3B1cCBwb3N0cyB7dHlwZTogXCJzdGFydE5oaUFwaVN5bmNcIiwgcGF5bG9hZH0gIFx1MjE5MiBOSEkgSlNPTi1BUEkgc3luY1xuLy8gICAtIGJhY2tncm91bmQgcnVucyB0aGUgZnVsbCBzeW5jIHNlcXVlbmNlLCB1cGRhdGluZyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gICAtIHBvcHVwIHJlYWRzIGNocm9tZS5zdG9yYWdlLmxvY2FsIG9uIHJlb3BlbiB0byBzaG93IHByb2dyZXNzXG4vL1xuLy8gTW9kZXM6XG4vLyAgIC0gXCJsb2NhbFwiICAgXHUyMTkyIGFmdGVyIE5ISSBmZXRjaCwgcnVuIG1hcHBlcnMgaW4tZXh0ZW5zaW9uLCBkb3dubG9hZCBhXG4vLyAgICAgICAgICAgICAgICAgRkhJUiBCdW5kbGUgdG8gdGhlIHVzZXIncyBtYWNoaW5lLiBObyBiYWNrZW5kIHJlcXVpcmVkLlxuLy8gICAtIFwiYmFja2VuZFwiIFx1MjE5MiBQT1NUIHBlci1wYWdlX3R5cGUgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRcbi8vICAgICAgICAgICAgICAgICAoZXhpc3RpbmcgYmVoYXZpb3VyKTsgZGFzaGJvYXJkICsgU01BUlQgYXBwIHVzZSB0aGVcbi8vICAgICAgICAgICAgICAgICBiYWNrZW5kJ3MgRkhJUiBzdG9yZS5cblxuaW1wb3J0IHtcbiAgR1JPVVBfSEFORExFUlMsXG4gIExJU1RfSEFORExFUlMsXG4gIGRlZHVwQWRtaXNzaW9uRGF5QW1iLFxuICBkZXJpdmVQYXRpZW50SWQsXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMsXG4gIG1hcFBhdGllbnQsXG4gIG1hc2tJZCxcbiAgbWFza05hbWUsXG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzLFxufSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcbmltcG9ydCB7XG4gIC8vIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UgaXMgaW52b2tlZCBkaXJlY3RseSBmcm9tIHRoZVxuICAvLyBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dCAob3ZlcnJpZGVzIHRoZSByZWdpc3RyeSdzIGNsYXNzSGludFxuICAvLyB3aXRoIFx1NjAyNVx1OEEzQS9cdTRGNEZcdTk2NjIgZGVyaXZlZCBmcm9tIHRoZSBkZXRhaWwgYm9keSksIHNvIGl0IG5lZWRzIHRvIGJlXG4gIC8vIGEgbmFtZWQgaW1wb3J0IFx1MjAxNCBub3Qgb25seSByZWFjaGFibGUgdmlhIE5ISV9BUElfRU5EUE9JTlRTW2ldLmFkYXB0LlxuICAvLyBGb3JnZXR0aW5nIHRoaXMgcmUtaW1wb3J0IGFmdGVyIGV4dHJhY3RpbmcgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5XG4gIC8vIGluIHYwLjYuMyBzaGlwcGVkIGEgUmVmZXJlbmNlRXJyb3IgdGhhdCBvbmx5IGZpcmVkIGluIHByb2R1Y3Rpb25cbiAgLy8gc3luY3Mgd2l0aCBub24tZW1wdHkgZW5jb3VudGVycy4gVGVzdHMgZG9uJ3QgZXhlcmNpc2UgdGhhdCBwYXRoXG4gIC8vIFx1MjAxNCBzZWUgVE9ET19GT0xMT1dVUCBmb3IgYSBTVy1mbG93IGludGVncmF0aW9uIHRlc3QgaWRlYS5cbiAgYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSxcbiAgYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCxcbiAgYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIsXG4gIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwsXG4gIGFkYXB0UHJvY2VkdXJlRnJvbURldGFpbCxcbiAgaXNvVG9ST0MsXG4gIHBpY2tFbmdsaXNoLFxuICByb2NUb0lTTyxcbn0gZnJvbSBcIi4vbmhpLWFkYXB0ZXJzLmpzXCI7XG5pbXBvcnQgeyBFTkRQT0lOVF9MQUJFTF9aSCwgTkhJX0FQSV9FTkRQT0lOVFMgfSBmcm9tIFwiLi9uaGktZW5kcG9pbnRzLmpzXCI7XG5cbmNvbnN0IFNUT1JBR0VfS0VZID0gXCJzeW5jU3RhdHVzXCI7XG5jb25zdCBzbGVlcCA9IChtcykgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKTtcblxuLy8gQ2FuY2VsbGF0aW9uIGZsYWcgc2V0IGJ5IHBvcHVwJ3Mgc3RvcCBidXR0b24uIENoZWNrZWQgYXQgc3RyYXRlZ2ljIHBvaW50c1xuLy8gaW4gcnVuTmhpQXBpU3luYyAoYmV0d2VlbiBwaGFzZXMsIGJlZm9yZSBlYWNoIGRldGFpbCBwYWdlKSBzbyB0aGVcbi8vIGluLXByb2dyZXNzIHN5bmMgZXhpdHMgcHJvbXB0bHkgd2hlbiB0aGUgdXNlciBoaXRzIFN0b3AuIENsZWFyZWQgYXQgdGhlXG4vLyBzdGFydCBvZiBlYWNoIG5ldyBzeW5jIHJ1bi5cbmxldCBfY2FuY2VsbGVkID0gZmFsc2U7XG4vLyBDb250ZXh0IGZvciB0aGUgaW4tZmxpZ2h0IHN5bmMgc28gdGhlIHN0b3BTeW5jIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuLy8gZGF0YSB3aXRob3V0IHRoZSBwb3B1cCBuZWVkaW5nIHRvIHBhc3MgaXQgYmFjay4gU2V0IGF0IHRoZSB0b3Agb2Zcbi8vIHJ1bk5oaUFwaVN5bmM7IGNsZWFyZWQgb24gY29tcGxldGlvbiAoc3VjY2Vzcy9mYWlsdXJlL2NhbmNlbCkuXG5sZXQgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xuY29uc3QgQ0FOQ0VMX0VSUk9SID0gXCJfX1NZTkNfQ0FOQ0VMTEVEX19cIjtcbi8vIFRocm93biB3aGVuIE5ISSBkZXRlY3RzIHRoZSBzZXNzaW9uIGhhcyBleHBpcmVkIChsb2dpbiBwYWdlIHJlbmRlcmVkLCBvclxuLy8gdGFiIHJlZGlyZWN0ZWQgdG8gYXV0aCBuYW1lc3BhY2UpLiBBYm9ydHMgc3luYyBpbW1lZGlhdGVseSBzbyB0aGUgdXNlciBjYW5cbi8vIHJlLWxvZ2luIGFuZCByZXRyeSBpbnN0ZWFkIG9mIHRpbWluZyBvdXQgb24gZXZlcnkgcmVtYWluaW5nIHBhZ2UuXG5jb25zdCBTRVNTSU9OX0VYUElSRURfRVJST1IgPSBcIl9fU0VTU0lPTl9FWFBJUkVEX19cIjtcbi8vIEVycm9ycyB0aGF0IHNob3VsZCBhYm9ydCB0aGUgZW50aXJlIHN5bmMgaW5zdGVhZCBvZiBiZWluZyBzd2FsbG93ZWRcbi8vIHBlci1waGFzZS5cbmNvbnN0IEFCT1JUX0VSUk9SUyA9IG5ldyBTZXQoW0NBTkNFTF9FUlJPUiwgU0VTU0lPTl9FWFBJUkVEX0VSUk9SXSk7XG5mdW5jdGlvbiBjaGVja0NhbmNlbCgpIHtcbiAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRTdGF0dXMocGFydGlhbCkge1xuICAvLyBBZnRlciBjYW5jZWxsYXRpb24sIHRoZSBwb3B1cCBoYXMgYWxyZWFkeSB3cml0dGVuIHRoZSBkZWZpbml0aXZlXG4gIC8vIFwic3RvcHBlZFwiIHN0YXR1cyBcdTIwMTQgc2lsZW5jZSBhbnkgZnVydGhlciBwcm9ncmVzcyB3cml0ZXMgZnJvbSB0aGVcbiAgLy8gaW4tZmxpZ2h0IHN5bmMgY29kZSBzbyB0aGUgVUkgZG9lc24ndCBib3VuY2Ugd2hpbGUgaXQgdW53aW5kcy5cbiAgaWYgKF9jYW5jZWxsZWQpIHJldHVybjtcbiAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gIGNvbnN0IG5leHQgPSB7IC4uLnByZXYsIC4uLnBhcnRpYWwsIHRzOiBEYXRlLm5vdygpIH07XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IG5leHQgfSk7XG4gIC8vIEJyb2FkY2FzdCB0byBhbnkgb3BlbiBwb3B1cC4gSWYgbm8gbGlzdGVuZXIgKHBvcHVwIGNsb3NlZCksXG4gIC8vIHNlbmRNZXNzYWdlIHJlamVjdHMgXHUyMDE0IHN3YWxsb3cuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzeW5jUHJvZ3Jlc3NcIiwgc3RhdHVzOiBuZXh0IH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuLy8gV3JhcCBhIGxvbmctcnVubmluZyBmYW4tb3V0IHdpdGggYSBwZXJpb2RpYyBlbGFwc2VkLXRpbWUgdGlja2VyIHNvXG4vLyB0aGUgcG9wdXAgZG9lc24ndCBsb29rIGZyb3plbiBkdXJpbmcgNjAtOTAgc2Vjb25kIE5ISSBkZXRhaWwgZmV0Y2hlc1xuLy8gKGVhY2ggUzAyIGRldGFpbCB0cmlnZ2VycyBhIHJlYWwgREIgSk9JTiBzZXJ2ZXItc2lkZTsgdGhlIGZhbi1vdXRcbi8vIHRpbWUgaXMgYm91bmQgYnkgTkhJJ3MgcGVyLXJlcXVlc3QgcHJvY2Vzc2luZyBjb3N0LCBub3QgYW55dGhpbmdcbi8vIHdlIGNhbiBzcGVlZCB1cCBjbGllbnQtc2lkZSkuXG4vL1xuLy8gbGFiZWwgaXMgYSBmdW5jdGlvbiAoZWxhcHNlZFNlYykgXHUyMTkyIHN0cmluZyB0aGF0IGZvcm1hdHMgdGhlIHByb2dyZXNzXG4vLyBtZXNzYWdlOyBjYWxsZWQgZXZlcnkgMyBzZWNvbmRzIHdoaWxlIHRoZSBhd2FpdGVkIHByb21pc2UgaXMgaW5cbi8vIGZsaWdodC4gRmluYWwgc2V0U3RhdHVzIGNhbGwgZmlyZXMgb25seSBvbiBjb21wbGV0aW9uIChzbyB0aGVcbi8vIFwiY29tcGxldGVcIiBtZXNzYWdlIHJlcGxhY2VzIHRoZSBcImluLXByb2dyZXNzXCIgb25lIGNsZWFubHkpLlxuYXN5bmMgZnVuY3Rpb24gX3dpdGhQcm9ncmVzc1RpbWVyKG1ha2VMYWJlbCwgZm4pIHtcbiAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAvLyBJbml0aWFsIHN0YXR1cyBzZXQgaW1tZWRpYXRlbHkgc28gdGhlIHVzZXIgc2VlcyB0aGUgbWVzc2FnZSBiZWZvcmVcbiAgLy8gdGhlIGZpcnN0IDMtc2Vjb25kIHRpY2suIFN1YnNlcXVlbnQgdGlja3MgdXBkYXRlIHRoZSBlbGFwc2VkIHNlY29uZHMuXG4gIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBtYWtlTGFiZWwoMCkgfSk7XG4gIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGNvbnN0IGVsYXBzZWQgPSBNYXRoLnJvdW5kKChEYXRlLm5vdygpIC0gc3RhcnQpIC8gMTAwMCk7XG4gICAgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IG1ha2VMYWJlbChlbGFwc2VkKSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gIH0sIDMwMDApO1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICB9XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgQVBJLWRpcmVjdCBzeW5jIChwYXJhbGxlbCwgbm8gTExNKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBJbnN0ZWFkIG9mIG5hdmlnYXRpbmcgdGhlIHVzZXIncyB0YWIgdG8gZWFjaCBOSEkgcGFnZSwgd2FpdGluZyBmb3IgVnVlIHRvXG4vLyByZW5kZXIsIGNhcHR1cmluZyBIVE1MLCB0aGVuIHNlbmRpbmcgaXQgdGhyb3VnaCBMTE0gZXh0cmFjdGlvbiwgd2UgY2FsbFxuLy8gTkhJJ3MgdW5kZXJseWluZyBKU09OIEFQSSBlbmRwb2ludHMgZGlyZWN0bHkuIFRoZSBcdTUwNjVcdTRGRERcdTdGNzIgU1BBIGZyb250cyBhIHNldFxuLy8gb2YgUkVTVCBlbmRwb2ludHMgdW5kZXIgL2FwaS9paGtlMzAwMC88cGFnZT4vKiB0aGF0IHJldHVybiB3ZWxsLWZvcm1lZFxuLy8gSlNPTjsgY2FsbGluZyB0aGVtIGluIHBhcmFsbGVsIGN1dHMgYSA1LTEwIG1pbnV0ZSBzeW5jIHRvIH4xMCBzZWNvbmRzIGFuZFxuLy8gcmVtb3ZlcyB0aGUgTExNIGNvc3QgZW50aXJlbHkuXG5cbmNvbnN0IE5ISV9IT1NUID0gXCJteWhlYWx0aGJhbmsubmhpLmdvdi50d1wiO1xuXG5cbi8vIE5ISSBKU09OIGFkYXB0ZXJzICsgZGF0ZS9zdHJpbmcgaGVscGVycyBsaXZlIGluIC4vbmhpLWFkYXB0ZXJzLmpzXG4vLyBzbyB0aGV5IGNhbiBiZSB1bml0LXRlc3RlZCBpbiBpc29sYXRpb24gKGJhY2tncm91bmQuanMgY2FuJ3QgYmVcbi8vIGxvYWRlZCB1bmRlciB2aXRlc3QgXHUyMDE0IGNocm9tZS4qIEFQSXMsIFNXIGdsb2JhbHMpLiBTZWUgdGhhdCBtb2R1bGVcbi8vIGZvciB0aGUgZmllbGQtcHJpb3JpdHkgZGVjaXNpb25zIHBlciBhZGFwdGVyLlxuLy9cbi8vIFRoZSBOSEkgQVBJIGVuZHBvaW50IHJlZ2lzdHJ5ICsgXHU0RTJEXHU2NTg3IGxhYmVsIG1hcHBpbmcgbGl2ZSBpblxuLy8gLi9uaGktZW5kcG9pbnRzLmpzIFx1MjAxNCBleHRyYWN0ZWQgc28gYSB1bml0IHRlc3QgY2FuIGd1YXJhbnRlZSBldmVyeVxuLy8gZW5kcG9pbnQgbmFtZSBoYXMgYSBsYWJlbCAod2UgdXNlZCB0byBzaGlwIHJhdyBwYWdlX3R5cGUga2V5cyBsaWtlXG4vLyBcIm90aGVyX2xhYnNcIiBpbnRvIHRoZSBwb3B1cCdzIFx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMCB3aGVuIHNvbWVvbmUgZm9yZ290IHRvXG4vLyByZWdpc3RlciB0aGUgQ2hpbmVzZSB2ZXJzaW9uKS5cblxuLy8gQXBwbHkgYSB7c3RhcnQsIGVuZH0gSVNPIGRhdGUgcmFuZ2UgdG8gYW4gZW5kcG9pbnQgcGF0aDpcbi8vICAgLSBJZiBwYXRoIGFscmVhZHkgaGFzIHNfZGF0ZT0gcGxhY2Vob2xkZXJzLCBmaWxsIHRoZW0gaW4uXG4vLyAgIC0gT3RoZXJ3aXNlIGFwcGVuZCBzX2RhdGU9Li4uJmVfZGF0ZT0uLi4gdG8gdGhlIHF1ZXJ5IHN0cmluZy5cbi8vIEVuZHBvaW50cyB3aXRob3V0IGBzdXBwb3J0c0RhdGVSYW5nZWAgcGFzcyB0aHJvdWdoIHVuY2hhbmdlZC5cbmZ1bmN0aW9uIGFwcGx5RGF0ZVJhbmdlVG9QYXRoKHBhdGgsIGRhdGVSYW5nZSkge1xuICBpZiAoIWRhdGVSYW5nZSB8fCAoIWRhdGVSYW5nZS5zdGFydCAmJiAhZGF0ZVJhbmdlLmVuZCkpIHJldHVybiBwYXRoO1xuICAvLyBOSEkgZXhwZWN0cyBcdTg5N0ZcdTUxNDMgSVNPIGRhdGVzIHdpdGggZGFzaGVzOiAyMDIzLTAxLTAxIChub3QgXHU2QzExXHU1NzBCLCBub3RcbiAgLy8gc2xhc2hlcykuIENvbmZpcm1lZCBieSBvYnNlcnZpbmcgdGhlIFNQQSdzIHJlcXVlc3Qgd2hlbiB1c2VyIHBpY2tzXG4gIC8vIGEgY3VzdG9tIGRhdGUgcmFuZ2UuIFVSTC1lbmNvZGluZyB0aGUgZGFzaGVzIGlzIHVubmVjZXNzYXJ5LlxuICBjb25zdCBzID0gKGRhdGVSYW5nZS5zdGFydCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IGUgPSAoZGF0ZVJhbmdlLmVuZCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGxldCBwID0gcGF0aDtcbiAgaWYgKC9bPyZdc19kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdc19kYXRlPSlbXiZdKi8sIGAkMSR7c31gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IChwLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCIpICsgYHNfZGF0ZT0ke3N9YDtcbiAgfVxuICBpZiAoL1s/Jl1lX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1lX2RhdGU9KVteJl0qLywgYCQxJHtlfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gYCZlX2RhdGU9JHtlfWA7XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDZTMDIgZGV0YWlsIGZldGNoZXMgaW5zaWRlIHRoZSBOSEkgdGFiIHNvIGNvb2tpZXMgKyBKV1Rcbi8vIGF1dGggZmxvdyBuYXR1cmFsbHkuIFdlIHBhc3MgdGhlIHZpc2l0IGxpc3QgKGp1c3Qgcm93X0lEcyArIHRoZWlyIHBhcmVudFxuLy8gZmllbGRzIG5lZWRlZCBmb3IgYWRhcHRhdGlvbikgaW50byB0aGUgdGFiOyB0aGUgdGFiIHJldHVybnMgcGFyYWxsZWxcbi8vIGZldGNoZWQgYm9kaWVzOyB3ZSBhZGFwdCBiYWNrIGluIHRoZSBTVy5cbi8vXG4vLyBgc2tpcFJvd0lkc2A6IFNldDxzdHJpbmc+IG9mIHJvd19JRHMgd2hvc2UgZHJ1Z3MgaGF2ZSBhbHJlYWR5IGJlZW5cbi8vIGZldGNoZWQgYnkgYW5vdGhlciBmYW4tb3V0IChjdXJyZW50bHk6IGNocm9uaWMgcHJlc2NyaXB0aW9ucykuIFdoZW5cbi8vIHRoZSBjaHJvbmljIGxpc3QgKElIS0UzMzA3UzAxKSBhbmQgdGhlIHJlZ3VsYXIgbWVkcyBsaXN0XG4vLyAoSUhLRTMzMDZTMDEpIGJvdGggY29udGFpbiB0aGUgc2FtZSByb3dfSUQgKH41MiBvdmVybGFwIG9uIG9ic2VydmVkXG4vLyBwYXRpZW50KSwgd2Ugc2tpcCB0aGUgcmVndWxhciBjYWxsIHRvIGF2b2lkIGRvdWJsZS1lbWl0dGluZyB0aGVcbi8vIHNhbWUgZHJ1Z3MuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hNZWRpY2F0aW9uRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cywgc2tpcFJvd0lkcyB9KSB7XG4gIGNvbnN0IHNraXAgPSBza2lwUm93SWRzIGluc3RhbmNlb2YgU2V0ID8gc2tpcFJvd0lkcyA6IG5ldyBTZXQoc2tpcFJvd0lkcyB8fCBbXSk7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2KSA9PiAoe1xuICAgICAgcm93X0lEOiB2LnJvd19JRCB8fCB2LnJvd2lkIHx8IHYucm93SUQgfHwgXCJcIixcbiAgICAgIC8vIEtlZXAgcGFyZW50IGZpZWxkcyBuZWVkZWQgYnkgYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbC5cbiAgICAgIHBhcmVudDoge1xuICAgICAgICBmdW5jX0RBVEU6IHYuZnVuY19EQVRFIHx8IHYuZnVuY19kYXRlIHx8IFwiXCIsXG4gICAgICAgIGljZDljbV9DT0RFOiB2LmljZDljbV9DT0RFIHx8IHYuaWNkOWNtX2NvZGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREVfQ05BTUU6IHYuaWNkOWNtX0NPREVfQ05BTUUgfHwgdi5pY2Q5Y21fbmFtZSB8fCBcIlwiLFxuICAgICAgICBob3NwX0FCQlI6IHYuaG9zcF9BQkJSIHx8IHYuaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgICB9LFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEICYmICFza2lwLmhhcyhyLnJvd19JRCkpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTkhJIHVzZXMgZGlmZmVyZW50IGN0eXBlIHZhbHVlcyBmb3IgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIvXHU4NjU1XHU2NUI5XHU3QjhCLiBXZSBkb24ndFxuICAgICAgLy8gaGF2ZSB0aGUgcHVibGljIG1hcHBpbmcsIHNvIHRyeSBjdHlwZSAxLi40IGluIG9yZGVyIGFuZCBzdG9wIGFzXG4gICAgICAvLyBzb29uIGFzIG9uZSByZXR1cm5zIGRydWdzLiBjdHlwZT0yIGNvdmVyZWQgSUNcdTUzNjEgXHU5NTgwXHU4QTNBIGluIG91ciBzYW1wbGUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNF0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keT8uaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICAgICAgICBjb25zdCBoYXNEcnVncyA9IG1haW4uc29tZSgodikgPT5cbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodj8uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSAmJiB2LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC5sZW5ndGggPiAwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIGN0eXBlIHlpZWxkZWQgZHJ1Z3MgXHUyMDE0IHJldHVybiBsYXN0IHN1Y2Nlc3NmdWwgYm9keSBhbnl3YXkgc29cbiAgICAgICAgLy8gZGlhZ25vc3RpY3MgY2FuIHN0aWxsIHNlZSB0aGUgdmlzaXQgbWV0YWRhdGEuXG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaE9uZShyb3dJZCwgMik7XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBkcnVncyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGRydWdMaXN0ID0gQXJyYXkuaXNBcnJheSh2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpID8gdmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0IDogW107XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZHJ1Z0xpc3QpIHtcbiAgICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZCwgdmlzaXQpO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzMzA2UzAyIGRldGFpbCBmZXRjaGVzIGZvciBjaHJvbmljIHByZXNjcmlwdGlvbnMuIFVzZXNcbi8vIHBlci1yb3cgYG9yaV9UWVBFYCBmb3IgY3R5cGUgKDE9XHU5NTgwXHU4QTNBLCAyPUlDXHU1MzYxLCA4PVx1ODVFNVx1NUM0MCkgaW5zdGVhZCBvZlxuLy8gYnJ1dGUtZm9yY2luZyAxLi40IGxpa2UgdGhlIHJlZ3VsYXIgbWVkaWNhdGlvbiBmYW4tb3V0OiBjaHJvbmljXG4vLyBsaXN0IHJvd3MgYWx3YXlzIGNhcnJ5IG9yaV9UWVBFIGFuZCBkZXRhaWwtZW1wdHkgcmVzcG9uc2VzIGNvbmZpcm1cbi8vIHRoYXQgbWlzbWF0Y2hpbmcgY3R5cGUgcmV0dXJucyBhbiBlbXB0eSBhcnJheS4gRXZlcnkgZHJ1ZyBwcm9kdWNlZFxuLy8gaGVyZSBnZXRzIGlzX2Nocm9uaWM9dHJ1ZSBcdTIxOTIgbWFwcGVyIGVtaXRzIGNvdXJzZU9mVGhlcmFweVR5cGU9XG4vLyBjb250aW51b3VzIG9uIHRoZSByZXN1bHRpbmcgTWVkaWNhdGlvblJlcXVlc3QuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hDaHJvbmljTWVkaWNhdGlvbkRldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICAvLyBDaHJvbmljIGxpc3Qgcm93cyBhbHdheXMgaGF2ZSBvcmlfVFlQRTsgZmFsbCBiYWNrIHRvIGJydXRlLVxuICAgICAgLy8gZm9yY2Ugb25seSBpZiBOSEkgZXZlciBzaGlwcyBhIHJvdyB3aXRob3V0IGl0LlxuICAgICAgY3R5cGU6IFN0cmluZyh2Lm9yaV9UWVBFIHx8IHYub3JpX3R5cGUgfHwgXCJcIiksXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGN0eXBlKX1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBUcnkgdGhlIHJvdydzIGRlY2xhcmVkIGN0eXBlIGZpcnN0OyBpZiBlbXB0eSwgZmFsbCBiYWNrIHRvXG4gICAgICAvLyBicnV0ZS1mb3JjZSBzbyBhIG1pc2NsYXNzaWZpZWQgcm93IHN0aWxsIHN1cmZhY2VzIGl0cyBkcnVncy5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgZGVjbGFyZWRDdHlwZSkge1xuICAgICAgICBjb25zdCBzZXEgPSBkZWNsYXJlZEN0eXBlXG4gICAgICAgICAgPyBbZGVjbGFyZWRDdHlwZSwgLi4uWzEsIDIsIDgsIDMsIDRdLmZpbHRlcigoYykgPT4gU3RyaW5nKGMpICE9PSBTdHJpbmcoZGVjbGFyZWRDdHlwZSkpXVxuICAgICAgICAgIDogWzEsIDIsIDgsIDMsIDRdO1xuICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIHNlcSkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaE9uZShyb3dJZCwgY3QpO1xuICAgICAgICAgIGlmIChyLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSByZXR1cm4gcjtcbiAgICAgICAgICBpZiAoci5lcnJvcikgY29udGludWU7XG4gICAgICAgICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Py5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgICAgICAgIGNvbnN0IGhhc0RydWdzID0gbWFpbi5zb21lKCh2KSA9PlxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheSh2Py5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpICYmIHYuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0Lmxlbmd0aCA+IDAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lELCBpdGVtc1tpXS5jdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IGRydWdzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgZHJ1Z0xpc3QgPSBBcnJheS5pc0FycmF5KHZpc2l0LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCkgPyB2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QgOiBbXTtcbiAgICAgIGZvciAoY29uc3QgZCBvZiBkcnVnTGlzdCkge1xuICAgICAgICBjb25zdCBhZGFwdGVkID0gYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbChkLCB2aXNpdCwgeyBpc19jaHJvbmljOiB0cnVlIH0pO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzNDA4UzAyIGRldGFpbCBmZXRjaGVzIGZvciBpbWFnaW5nIFx1MjAxNCBzYW1lIHBhdHRlcm4gYXMgdGhlXG4vLyBtZWRpY2F0aW9uIDItc3RlcC4gY3R5cGUgbWlycm9ycyB0aGUgdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICBjdHlwZTogdi5vcmlfVFlQRSB8fCB2Lm9yaV90eXBlIHx8IFwiQVwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzNDA4UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoY3R5cGUpfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCByZXBvcnRzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwodmlzaXQpO1xuICAgICAgaWYgKGFkYXB0ZWQpIHJlcG9ydHMucHVzaChhZGFwdGVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcG9ydHM7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDhTMDIgZGV0YWlsIGZldGNoZXMgZm9yIHByb2NlZHVyZXMgXHUyMDE0IHNhbWUgMi1zdGVwXG4vLyBwYXR0ZXJuIGFzIGltYWdpbmcgSUhLRTM0MDhTMDEgXHUyMTkyIFMwMi4gVGhlIGxpc3QgKElIS0UzMzAxUzA1KSBvbmx5XG4vLyBjYXJyaWVzIG1ldGFkYXRhOyB0aGUgYWN0dWFsIElDRC0xMC1QQ1MgY29kZSAob3BfQ09ERSkgYW5kIHRoZSByZWFsXG4vLyBwZXJmb3JtYW5jZSBkYXRlIChleGVfU19EQVRFIG9uIHN1Yi1saXN0IGVudHJpZXMpIGxpdmUgaW4gdGhlIGRldGFpbC5cbi8vIGN0eXBlIG1pcnJvcnMgdGhlIGxpc3Qgcm93J3Mgb3JpX3R5cGUgKDM9XHU0RjRGXHU5NjYyIC8gNT1cdTk1ODBcdThBM0Egb2JzZXJ2ZWRcbi8vIGFnYWluc3QgbGl2ZSBwYXlsb2FkcykuIE5ISSBkb2Vzbid0IHB1Ymxpc2ggdGhlIG1hcHBpbmcgc28gd2Vcbi8vIGJydXRlLWZvcmNlIG9uIG1pc3MgbGlrZSB0aGUgbWVkaWNhdGlvbiBmYW4tb3V0LCBqdXN0IGluIGNhc2UuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hQcm9jZWR1cmVEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93X2lkIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgY3R5cGU6IHYub3JpX3R5cGUgfHwgdi5vcmlfVFlQRSB8fCBcIlwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTMzMDhTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2VuY29kZVVSSUNvbXBvbmVudChjdHlwZSl9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gUHJlZmVyIHRoZSByb3cncyBvd24gb3JpX3R5cGUuIElmIHRoYXQgcmV0dXJucyBlbXB0eSAoTkhJXG4gICAgICAvLyBzb21ldGltZXMgc2hpcHMgcm93cyB3aGVyZSBjdHlwZSBleHBlY3RzIGEgZGlmZmVyZW50IHZhbHVlKSxcbiAgICAgIC8vIGJydXRlLWZvcmNlIDEuLjUgdW50aWwgc29tZXRoaW5nIGNvbWVzIGJhY2suXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQsIHByZWZlcnJlZCkge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGVzID0gW107XG4gICAgICAgIGlmIChwcmVmZXJyZWQpIGNhbmRpZGF0ZXMucHVzaChwcmVmZXJyZWQpO1xuICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIFtcIjNcIiwgXCI1XCIsIFwiMVwiLCBcIjJcIiwgXCI0XCJdKSB7XG4gICAgICAgICAgaWYgKCFjYW5kaWRhdGVzLmluY2x1ZGVzKGN0KSkgY2FuZGlkYXRlcy5wdXNoKGN0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGFzdE9rID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCBjdCk7XG4gICAgICAgICAgaWYgKHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHJldHVybiByO1xuICAgICAgICAgIGlmIChyLmVycm9yKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHk/Lmloa2UzMzA4UzAyX21haW5fZGF0YSlcbiAgICAgICAgICAgID8gci5ib2R5Lmloa2UzMzA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiByO1xuICAgICAgICAgIGxhc3RPayA9IHI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhc3RPayB8fCB7IGVycm9yOiBcIm5vIGRldGFpbCBib2R5XCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBwcm9jZWR1cmVzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzMwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3Qgcm93IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGFkYXB0ZWQgPSBhZGFwdFByb2NlZHVyZUZyb21EZXRhaWwocm93KTtcbiAgICAgIGlmIChhZGFwdGVkKSBwcm9jZWR1cmVzLnB1c2goYWRhcHRlZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwcm9jZWR1cmVzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzMzAzUzAyIGRldGFpbCB0byBjbGFzc2lmeSBlYWNoIElIS0UzMzAzUzAxIHZpc2l0IGFzXG4vLyBBTUIgLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUuIFVzZXMgP3JpZD08cm93X0lEPiZ0PU5cbi8vIHdoZXJlIE4gaXMgdGhlIHZpc2l0IHR5cGUgYnVja2V0OyB3ZSBkb24ndCBrbm93IHRoZSBtYXBwaW5nIGEgcHJpb3JpLFxuLy8gc28gZm9yIGVhY2ggdmlzaXQgd2UgdHJ5IHQ9MS4uNSB1bnRpbCBvbmUgcmV0dXJucyBub24tZW1wdHkgbWFpbl9kYXRhLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoRW5jb3VudGVyRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2LCBpZHgpID0+ICh7IGlkeCwgcm93X0lEOiB2LnJvV19JRCB8fCB2LnJvd19JRCB8fCBcIlwiIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICAvLyBJSEtFMzMwM1MwMiB0YWtlcyBjcmlkICsgY3R5cGUgKG1pcnJvcnMgSUhLRTMzMDZTMDIgL1xuICAgICAgICAvLyBJSEtFMzMwOFMwMiBkZXRhaWwgZW5kcG9pbnRzKS4gRWFybGllciBjb2RlIHVzZWQgcmlkICsgdFxuICAgICAgICAvLyBcdTIwMTQgdGhhdCBtYXRjaGVkIE5ISSdzIFVJIHJvdXRlIHF1ZXJ5c3RyaW5nIGJ1dCBOT1QgdGhlIEFQSVxuICAgICAgICAvLyBlbmRwb2ludCwgd2hpY2ggc2lsZW50bHkgcmV0dXJuZWQge2loa2UzMzAzUzAyX21haW5fZGF0YTpbXX1cbiAgICAgICAgLy8gZm9yIGV2ZXJ5IHZpc2l0LiBUaGF0IG1hZGUgY2xhc3NIaW50LCBzZWNvbmRhcnkgZGlhZ25vc2VzLFxuICAgICAgICAvLyBhbmQgcHJpbWFyeS1JQ0QtYmlsaW5ndWFsIGFsbCBmYWxsIHRocm91Z2ggdG8gZGVmYXVsdHMuXG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwM1MwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHRtID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRtKTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRm9yIGVhY2ggdmlzaXQsIGZpbmQgdGhlIGN0eXBlIHRoYXQgcmV0dXJucyBub24tZW1wdHkgZGF0YS4gTkhJXG4gICAgICAvLyBvYnNlcnZlZDogY3R5cGU9MiBjb3ZlcnMgXHU4OTdGXHU5MUFCIC8gSUNcdTUzNjEgLyBcdTc1MzNcdTU4MzEgT1BELCBvdGhlcnMgbWF5XG4gICAgICAvLyBjb3JyZXNwb25kIHRvIFx1NEUyRFx1OTFBQiAvIFx1NzI1OVx1OTFBQiAvIFx1NEY0Rlx1OTY2Mi4gV2UgcHJvYmUgYSBzbWFsbCBzZXQuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNCwgNV0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSAoci5ib2R5Py5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiB7IGJvZHk6IHIuYm9keSwgY3R5cGU6IGN0IH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgYm9keTogbnVsbCB9O1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd3MgPSBbXTtcbiAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQyAmJiB3IDwgaXRlbXMubGVuZ3RoOyB3KyspIHdzLnB1c2god29ya2VyKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod3MpO1xuICAgICAgcmV0dXJuIHsgcmVzdWx0czogb3V0IH07XG4gICAgfSxcbiAgICBhcmdzOiBbYmFzZVVybCwgcmVxc10sXG4gIH0pO1xuXG4gIGlmIChyZXN1bHQ/LmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgLy8gUGFpciBlYWNoIGRldGFpbCBib2R5IGJhY2sgdG8gaXRzIHZpc2l0IHBvc2l0aW9uLlxuICBjb25zdCBieUlkeCA9IG5ldyBNYXAoKTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXFzLmxlbmd0aDsgaSsrKSB7XG4gICAgYnlJZHguc2V0KHJlcXNbaV0uaWR4LCByZXN1bHRzW2ldPy5ib2R5IHx8IG51bGwpO1xuICB9XG4gIHJldHVybiBieUlkeDtcbn1cblxuLy8gRmFuIG91dCBJSEtFMzMwOVMwMiBkZXRhaWwgZmV0Y2hlcyBmb3IgaW5wYXRpZW50IGVuY291bnRlcnMuIExpc3Rcbi8vIGVuZHBvaW50IElIS0UzMzA5UzAxIHNoaXBzIGljZDljbV9DT0RFX0NOQU1FIENoaW5lc2Utb25seSBhbmQgaGFzXG4vLyBubyBzZWNvbmRhcnkgZGlhZ25vc2VzIGZpZWxkOyBkZXRhaWwgc2hpcHMgZnVsbCBiaWxpbmd1YWwgcHJpbWFyeVxuLy8gSUNEICsgaWNkY29kZV9kYXRhW10gd2l0aCB1cCB0byAxMisgXHU2QjIxXHU4QTNBXHU2NUI3IChcdTRGNEZcdTk2NjIgdmlzaXRzIHRlbmQgdG9cbi8vIGhhdmUgcmljaGVyIGRpZmZlcmVudGlhbCBcdTIwMTQgb2JzZXJ2ZWQgc2FtcGxlIGhhZCAxMiBzZWNvbmRhcmllcyB2c1xuLy8gNCBmb3IgdGhlIGV5ZS1jbGluaWMgT1BEIGNhc2UpLiBjdHlwZSBpcyBmaXhlZCB0byAzICg9IFx1NEY0Rlx1OTY2MikgZm9yXG4vLyB0aGlzIGVuZHBvaW50OyBwcm9iaW5nIG90aGVyIHZhbHVlcyByZXR1cm5zIGVtcHR5IGFycmF5cy5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaElucGF0aWVudERldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodiwgaWR4KSA9PiAoeyBpZHgsIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dfaWQgfHwgdi5yb1dfSUQgfHwgXCJcIiB9KSlcbiAgICAuZmlsdGVyKChyKSA9PiByLnJvd19JRCk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG5ldyBNYXAoKTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQpIHtcbiAgICAgICAgLy8gSUhLRTMzMDlTMDIgdGFrZXMgY3JpZCArIGN0eXBlIGxpa2UgdGhlIG90aGVyIFMwMiBkZXRhaWxcbiAgICAgICAgLy8gZW5kcG9pbnRzLiBjdHlwZT0zIChcdTRGNEZcdTk2NjIpIGlzIHRoZSBvbmx5IHZhbHVlIHRoYXQgcmV0dXJuc1xuICAgICAgICAvLyBkYXRhIG9uIHRoaXMgZW5kcG9pbnQgcGVyIGxpdmUgcHJvYmU7IHdlIHN0aWxsIGZhbGxiYWNrIHRvXG4gICAgICAgIC8vIDEvMiBkZWZlbnNpdmVseSBpbiBjYXNlIE5ISSdzIG1hcHBpbmcgY2hhbmdlcy5cbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMywgMiwgMV0pIHtcbiAgICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTMzMDlTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2N0fWA7XG4gICAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgICAgY29uc3QgdG0gPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICAgIGlmICghci5vaykgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBtYWluID0gYm9keT8uaWhrZTMzMDlTMDJfbWFpbl9kYXRhIHx8IFtdO1xuICAgICAgICAgICAgaWYgKG1haW4ubGVuZ3RoID4gMCkgcmV0dXJuIHsgYm9keSB9O1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgICBpZiAoZT8ubmFtZSAhPT0gXCJBYm9ydEVycm9yXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwidGltZW91dCAzMHNcIiB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBib2R5OiBudWxsIH07XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IGZldGNoT25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IGJ5SWR4ID0gbmV3IE1hcCgpO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcXMubGVuZ3RoOyBpKyspIHtcbiAgICBieUlkeC5zZXQocmVxc1tpXS5pZHgsIHJlc3VsdHNbaV0/LmJvZHkgfHwgbnVsbCk7XG4gIH1cbiAgcmV0dXJuIGJ5SWR4O1xufVxuXG4vLyBOSEkncyBTMDIgZGV0YWlsIGVuZHBvaW50cyAoSUhLRTMzMDNTMDIgZW5jb3VudGVyLCBJSEtFMzMwOVMwMlxuLy8gaW5wYXRpZW50LCAuLi4pIHdyYXAgdGhlIG1haW4gcm93IHVuZGVyIGEga2V5IG5hbWVkIGFmdGVyIHRoZVxuLy8gZW5kcG9pbnQgXHUyMDE0IGloa2UzMzAzUzAyX21haW5fZGF0YSAvIGloa2UzMzA5UzAyX21haW5fZGF0YSAvIGV0Yy5cbi8vIFRoaXMgaGVscGVyIHBpY2tzIG91dCBtYWluX2RhdGFbMF0gcmVnYXJkbGVzcyBvZiB3aGljaCBTMDIgd2UgaGl0LFxuLy8gc28gdGhlIHRocmVlIGRvd25zdHJlYW0gZXh0cmFjdG9ycyAoX2NsYXNzRnJvbVMwMkRldGFpbCxcbi8vIF9wcmltYXJ5SWNkRnJvbVMwMkRldGFpbCwgX3NlY29uZGFyeUljZHNGcm9tUzAyRGV0YWlsKSB3b3JrIHVuaWZvcm1seS5cbmZ1bmN0aW9uIF9waWNrUzAyTWFpblJvdyhib2R5KSB7XG4gIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhib2R5KSkge1xuICAgIGlmICgvXmloa2VcXGQrUzAyX21haW5fZGF0YSQvaS50ZXN0KGspICYmIEFycmF5LmlzQXJyYXkoYm9keVtrXSkgJiYgYm9keVtrXS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gYm9keVtrXVswXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0Zyb21TMDJEZXRhaWwoYm9keSkge1xuICBjb25zdCBtYWluID0gX3BpY2tTMDJNYWluUm93KGJvZHkpO1xuICBpZiAoIW1haW4pIHJldHVybiBudWxsO1xuICBjb25zdCB0biA9IFN0cmluZyhtYWluLmhvc3BfREFUQV9UWVBFX05BTUUgfHwgXCJcIik7XG4gIGlmICh0bi5pbmNsdWRlcyhcIlx1NjAyNVwiKSkgcmV0dXJuIFwiRU1FUlwiOyAgLy8gXHU2MDI1XHU4QTNBXG4gIGlmICh0bi5pbmNsdWRlcyhcIlx1NEY0Rlx1OTY2MlwiKSkgcmV0dXJuIFwiSU1QXCI7XG4gIC8vIFx1ODk3Rlx1OTFBQiAvIFx1NEUyRFx1OTFBQiAvIFx1NzI1OVx1OTFBQiAvIFx1ODVFNVx1NUM0MCBhbGwgZGVmYXVsdCB0byBBTUJcbiAgcmV0dXJuIFwiQU1CXCI7XG59XG5cbi8vIFB1bGwgdGhlIHByaW1hcnkgSUNEJ3MgYmlsaW5ndWFsIG5hbWUgZnJvbSBJSEtFMzMwM1MwMiBkZXRhaWwuIFRoZVxuLy8gbGlzdCBlbmRwb2ludCBJSEtFMzMwM1MwMSBzb21ldGltZXMgc2hpcHMgaWNEOUNNX0NPREVfQ05BTUUgYXNcbi8vIENoaW5lc2Utb25seSBcIjxjb2RlPi88XHU0RTJEXHU2NTg3PlwiOyBkZXRhaWwgY29uc2lzdGVudGx5IHNoaXBzIGZ1bGwgYmlsaW5ndWFsXG4vLyBcIjxjb2RlPi88XHU0RTJEXHU2NTg3Pnx8PGNvZGU+LzxFbmdsaXNoPlwiLiBDYWxsZXIgcGFzc2VzIHRoZSByZXN1bHQgdmlhXG4vLyBvcHRpb25zLnByaW1hcnlfZGlhZ25vc2lzIHRvIHRoZSBlbmNvdW50ZXIgYWRhcHRlciwgd2hpY2ggcHJlZmVyc1xuLy8gaXQgb3ZlciB0aGUgKHBvdGVudGlhbGx5IENoaW5lc2Utb25seSkgbGlzdC1sZXZlbCBmaWVsZC4gUmVzdWx0OlxuLy8gRW5jb3VudGVyLnJlYXNvbkNvZGVbMF0uY29kaW5nWzBdLmRpc3BsYXkgaXMgcmVsaWFibHkgRW5nbGlzaC5cbmZ1bmN0aW9uIF9wcmltYXJ5SWNkRnJvbVMwMkRldGFpbChib2R5KSB7XG4gIGNvbnN0IG1haW4gPSBfcGlja1MwMk1haW5Sb3coYm9keSk7XG4gIGlmICghbWFpbikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGNvZGVOYW1lID0gbWFpbi5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBtYWluLmljZDljbV9jb2RlX2NuYW1lIHx8IFwiXCI7XG4gIGlmICghY29kZU5hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBjb2RlID0gbWFpbi5pY2Q5Y21fQ09ERSB8fCBtYWluLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IHN0cmlwSWNkUHJlZml4ID0gKHMpID0+IFN0cmluZyhzIHx8IFwiXCIpLnJlcGxhY2UoL15bQS1aMC05Ll0rXFwvXFxzKi8sIFwiXCIpO1xuICBjb25zdCBwaWNrSGFsZiA9IChzLCBoYWxmKSA9PiB7XG4gICAgY29uc3Qgc3RyID0gU3RyaW5nKHMgfHwgXCJcIik7XG4gICAgY29uc3QgaWR4ID0gc3RyLmluZGV4T2YoXCJ8fFwiKTtcbiAgICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuIHN0ci50cmltKCk7XG4gICAgaWYgKGhhbGYgPT09IFwiemhcIikgcmV0dXJuIHN0ci5zbGljZSgwLCBpZHgpLnRyaW0oKSB8fCBzdHIuc2xpY2UoaWR4ICsgMikudHJpbSgpO1xuICAgIHJldHVybiBzdHIuc2xpY2UoaWR4ICsgMikudHJpbSgpIHx8IHN0ci5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbiAgfTtcbiAgY29uc3QgbmFtZV9lbiA9IHN0cmlwSWNkUHJlZml4KHBpY2tIYWxmKGNvZGVOYW1lLCBcImVuXCIpKTtcbiAgY29uc3QgbmFtZV96aCA9IHN0cmlwSWNkUHJlZml4KHBpY2tIYWxmKGNvZGVOYW1lLCBcInpoXCIpKTtcbiAgaWYgKCFjb2RlICYmICFuYW1lX2VuICYmICFuYW1lX3poKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgY29kZSwgbmFtZV9lbiwgbmFtZV96aCB9O1xufVxuXG4vLyBQdWxsIHNlY29uZGFyeSBkaWFnbm9zZXMgKFx1NkIyMVx1OEEzQVx1NjVCNykgZnJvbSBJSEtFMzMwM1MwMiBkZXRhaWwuIExpdmUgZGF0YVxuLy8gc2hvd3MgMC00IGVudHJpZXMgcGVyIGVuY291bnRlcjsgdGhlIGV5ZS1jbGluaWMgY2FzZSBpbiB0aGUgdGVzdFxuLy8gc2FtcGxlIG1heGVzIG91dCBhdCA0LiBFYWNoIGVudHJ5IGlzIHNoYXBlZDpcbi8vICAgeyBpY2RfdGl0OiBcIlx1NkIyMVx1OEEzQVx1NjVCN058fFNlY29uZGFyeSBEaWFnbm9zaXMgTlwiLFxuLy8gICAgIGljZF9jb2RlX25hbWU6IFwiPGNvZGU+LzxcdTRFMkRcdTY1ODc+fHw8Y29kZT4vPEVuZ2xpc2g+XCIgfVxuLy8gUmV0dXJucyBhIG5vcm1hbGl6ZWQgYXJyYXkgcGFzc2VkIHZpYSB0aGUgZW5jb3VudGVyIGFkYXB0ZXInc1xuLy8gb3B0aW9ucy5zZWNvbmRhcnlfZGlhZ25vc2VzIFx1MjE5MiBtYXBwZXIgZW1pdHMgb25lIHJlYXNvbkNvZGVbXSBlbnRyeSBwZXIgaXRlbS5cbmZ1bmN0aW9uIF9zZWNvbmRhcnlJY2RzRnJvbVMwMkRldGFpbChib2R5KSB7XG4gIGNvbnN0IG1haW4gPSBfcGlja1MwMk1haW5Sb3coYm9keSk7XG4gIGlmICghbWFpbikgcmV0dXJuIFtdO1xuICBjb25zdCBsaXN0ID0gQXJyYXkuaXNBcnJheShtYWluLmljZGNvZGVfZGF0YSkgPyBtYWluLmljZGNvZGVfZGF0YSA6IFtdO1xuICBjb25zdCBvdXQgPSBbXTtcbiAgLy8gc3RyaXAgdGhlIFwiPENPREU+L1wiIHByZWZpeCBmcm9tIGVhY2ggaGFsZiAoc2FtZSBwYXR0ZXJuIGFzXG4gIC8vIG1lZGljYXRpb24gLyBlbmNvdW50ZXIgcHJpbWFyeSBJQ0QgYmlsaW5ndWFsKVxuICBjb25zdCBzdHJpcEljZFByZWZpeCA9IChzKSA9PiBTdHJpbmcocyB8fCBcIlwiKS5yZXBsYWNlKC9eW0EtWjAtOS5dK1xcL1xccyovLCBcIlwiKTtcbiAgY29uc3QgcGlja0hhbGYgPSAocywgaGFsZikgPT4ge1xuICAgIGNvbnN0IHN0ciA9IFN0cmluZyhzIHx8IFwiXCIpO1xuICAgIGNvbnN0IGlkeCA9IHN0ci5pbmRleE9mKFwifHxcIik7XG4gICAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBzdHIudHJpbSgpO1xuICAgIGlmIChoYWxmID09PSBcInpoXCIpIHJldHVybiBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCkgfHwgc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKTtcbiAgICByZXR1cm4gc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKSB8fCBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG4gIH07XG4gIGZvciAoY29uc3QgaXRlbSBvZiBsaXN0KSB7XG4gICAgY29uc3QgY29kZU5hbWUgPSBpdGVtPy5pY2RfY29kZV9uYW1lIHx8IGl0ZW0/LmljZF9DT0RFX05BTUUgfHwgXCJcIjtcbiAgICAvLyBFeHRyYWN0IGNvZGUgZnJvbSBlaXRoZXIgaGFsZiAoYm90aCBzaWRlcyBwcmVmaXggd2l0aCBzYW1lIGNvZGUpLlxuICAgIGNvbnN0IGNvZGVNYXRjaCA9IFN0cmluZyhjb2RlTmFtZSkubWF0Y2goL14oW0EtWjAtOS5dKylcXC8vKTtcbiAgICBjb25zdCBjb2RlID0gY29kZU1hdGNoID8gY29kZU1hdGNoWzFdIDogXCJcIjtcbiAgICBjb25zdCBuYW1lX2VuID0gc3RyaXBJY2RQcmVmaXgocGlja0hhbGYoY29kZU5hbWUsIFwiZW5cIikpO1xuICAgIGNvbnN0IG5hbWVfemggPSBzdHJpcEljZFByZWZpeChwaWNrSGFsZihjb2RlTmFtZSwgXCJ6aFwiKSk7XG4gICAgaWYgKCFjb2RlICYmICFuYW1lX2VuICYmICFuYW1lX3poKSBjb250aW51ZTtcbiAgICBvdXQucHVzaCh7IGNvZGUsIG5hbWVfZW4sIG5hbWVfemggfSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3Bvc3RTdHJ1Y3R1cmVkKGJhY2tlbmQsIHBhZ2VfdHlwZSwgaXRlbXMsIHN5bmNBcGlLZXksIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy91cGxvYWQtc3RydWN0dXJlZGAsIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcGFnZV90eXBlLFxuICAgICAgaG9zdDogTkhJX0hPU1QsXG4gICAgICBpdGVtcyxcbiAgICAgIHBhdGllbnRfb3ZlcnJpZGU6IHBhdGllbnRPdmVycmlkZSB8fCBudWxsLFxuICAgIH0pLFxuICB9KTtcbiAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoYFBPU1QgdXBsb2FkLXN0cnVjdHVyZWQgJHtyLnN0YXR1c306ICR7KGF3YWl0IHIudGV4dCgpKS5zbGljZSgwLCAyMDApfWApO1xuICByZXR1cm4gYXdhaXQgci5qc29uKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBtb2RlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFJ1bnMgdGhlIHNhbWUgbWFwcGVycyB0aGUgYmFja2VuZCBydW5zLCB0aGVuIHRyaWdnZXJzIGEgZG93bmxvYWQgb2YgdGhlXG4vLyByZXN1bHRpbmcgRkhJUiBCdW5kbGUuIE5vdGhpbmcgbGVhdmVzIHRoZSB1c2VyJ3MgbWFjaGluZTsgbm8gYmFja2VuZFxuLy8gcmVxdWlyZWQuIE1pcnJvcnMgYmFja2VuZC91cGxvYWQtc3RydWN0dXJlZCBvcmRlcjogZW5jb3VudGVycyBmaXJzdCBzb1xuLy8gdGhhdCBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzIGNhbiBhdHRhY2ggcmVmZXJlbmNlcyB0byBkb3duc3RyZWFtXG4vLyBvYnNlcnZhdGlvbnMvbWVkaWNhdGlvbnMvZXRjLlxuXG5jb25zdCBfTE9DQUxfUEFHRV9UWVBFX09SREVSID0gW1xuICBcImVuY291bnRlcnNcIixcbiAgXCJvYnNlcnZhdGlvbnNcIixcbiAgXCJtZWRpY2F0aW9uc1wiLFxuICBcImNvbmRpdGlvbnNcIixcbiAgXCJhbGxlcmdpZXNcIixcbiAgXCJkaWFnbm9zdGljX3JlcG9ydHNcIixcbiAgXCJwcm9jZWR1cmVzXCIsXG4gIFwiaW1tdW5pemF0aW9uc1wiLFxuXTtcblxuLy8gQ2hlYXAgcHJlLWZsaWdodDogZG9lcyB0aGlzIE5ISSB0YWIgaGF2ZSBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24/XG4vLyBVc2VzIHRoZSBzYW1lIHNlc3Npb25TdG9yYWdlLnRva2VuICsgbGlnaHR3ZWlnaHQgQVBJIGNhbGwgcGF0dGVybiBhc1xuLy8gX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpLiBEb2Vzbid0IHJldHVybiBhbnl0aGluZyBQSUkgXHUyMDE0IGp1c3QgYVxuLy8gYm9vbGVhbiBmb3IgdGhlIHBvcHVwIHRvIGRlY2lkZSB3aGV0aGVyIHRvIHN1cmZhY2UgYSBcImxvZyBpbiBmaXJzdFwiXG4vLyBiYW5uZXIuIFJldHVybnMgbnVsbCB3aGVuIHdlIGNhbid0IHRlbGwgKHNjcmlwdC1pbmplY3Rpb24gYmxvY2tlZCxcbi8vIHRpbWVvdXQsIGV0Yy4pIHNvIHRoZSBwb3B1cCBjYW4gZmFsbCBiYWNrIHRvIFwiZW5hYmxlZFwiIHJhdGhlciB0aGFuXG4vLyBzY2FyaW5nIHRoZSB1c2VyIHdpdGggYSBmYWxzZSBuZWdhdGl2ZS5cbmFzeW5jIGZ1bmN0aW9uIF9jaGVja05oaUxvZ2luU3RhdGUodGFiSWQpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFNhbWUgZW5kcG9pbnQgYXMgdGhlIGNpZCBhdXRvLWZldGNoIFx1MjAxNCBrbm93biB0byBuZWVkIGFuXG4gICAgICAgICAgLy8gYXV0aGVudGljYXRlZCBzZXNzaW9uIGFuZCB0byBiZSBjaGVhcC5cbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goXCIvYXBpL2loa2UzMDAwL2loa2UzNDEwczAxL3BhZ2VfbG9hZFwiLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLCBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dH1gIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gNDAxLzQwMyBcdTIxOTIgc2Vzc2lvbiB0b2tlbiByZWplY3RlZC4gMjAwIFx1MjE5MiBsb2dnZWQgaW4uXG4gICAgICAgICAgcmV0dXJuIHIub2s7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gdHlwZW9mIHJlc3VsdCA9PT0gXCJib29sZWFuXCIgPyByZXN1bHQgOiBudWxsO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGVuZHBvaW50IElIS0UzNDEwUzAxIChcdTYyMTFcdTYzQTVcdTdBMkVcdTdEMDBcdTkzMDQgLyBDT1ZJRCBcdTdCRTlcdTZBQTJcdTdEMDBcdTkzMDQpIGhhcHBlbnNcbi8vIHRvIGNhcnJ5IHRoZSBsb2dnZWQtaW4gdXNlcidzIHJlYWwgY2l0aXplbiBJRCBpbiB0aGUgcmVzcG9uc2UgKGBjaWRgXG4vLyBmaWVsZCwgZS5nLiBcIlAxMjM0NTA4NjZcIikuIFVzZSBpdCB0byBzZWVkIC8gcmVmcmVzaCB0aGUgcGF0aWVudF9cbi8vIG92ZXJyaWRlJ3MgaWRfbm8gc28gaXQgYWx3YXlzIHRyYWNrcyBcIndob3NlIHNlc3Npb24gaXMgY3VycmVudGx5XG4vLyBhY3RpdmUgaW4gdGhlIE5ISSB0YWJcIi5cbi8vXG4vLyBIaXN0b3J5IG5vdGU6IHRoaXMgZnVuY3Rpb24gdXNlZCB0byBlYXJseS1yZXR1cm4gd2hlbmV2ZXIgaWRfbm8gd2FzXG4vLyBhbHJlYWR5IGEgcmVhbC1sb29raW5nIGNpZCAoXCJkb24ndCB0b3VjaCBhIG1hbnVhbGx5LWVudGVyZWQgSURcIikuXG4vLyBUaGF0IHNob3J0LWNpcmN1aXQgcHJlLWRhdGVkIHYwLjYuMCB3aGljaCByZW1vdmVkIGlkX25vIGZyb20gdGhlIFVJXG4vLyBcdTIwMTQgdGhlcmUncyBubyBcIm1hbnVhbFwiIHBhdGggYW55bW9yZSwgdGhlIGZpZWxkIGlzIHB1cmVseSBpbnRlcm5hbC5cbi8vIFRoZSBzaG9ydC1jaXJjdWl0IGFsc28gcHJvZHVjZWQgdGhlIGJ1ZyBwYXR0ZXJuOiB1c2VyIHN0YXJ0cyBzeW5jXG4vLyB3aXRoIFBhdGllbnQgQiBsb2dnZWQgaW4gKGNpZF9CIHdyaXR0ZW4gdG8gb3ZlcnJpZGUpLCByZWFsaXNlcyB3cm9uZ1xuLy8gdGFiLCBzd2l0Y2hlcyBOSEkgdGFiIHRvIFBhdGllbnQgQSwgcmUtc3luY3MgXHUyMDE0IGlkX25vIHN0YXlzIGNpZF9CXG4vLyBiZWNhdXNlIFwiYWxyZWFkeSBhIHJlYWwgY2lkXCIuIE5vdyB3ZSBhbHdheXMgcHJvYmUgYW5kIGZvbGxvdyB0aGVcbi8vIHNlc3Npb24ncyB0cnV0aC4gTWFudWFsIG92ZXJyaWRlIGlzIGdvbmUsIE5ISSBzZXNzaW9uIGlzIGF1dGhvcml0YXRpdmUuXG5hc3luYyBmdW5jdGlvbiBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCBjdXJyZW50ID0gcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCI7XG5cbiAgbGV0IGNpZCA9IG51bGw7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXQpIHJldHVybiBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MTBzMDEvcGFnZV9sb2FkXCIsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0fWAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiBudWxsO1xuICAgICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICByZXR1cm4gYm9keT8uY2lkIHx8IG51bGw7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIFZhbGlkYXRlIGl0IGxvb2tzIGxpa2UgYSBUYWl3YW4gbmF0aW9uYWwgSUQgKDEgbGV0dGVyICsgOSBkaWdpdHMpXG4gICAgLy8gYmVmb3JlIHRydXN0aW5nIGl0LiBBdm9pZHMgYWNjaWRlbnRhbGx5IHByb21vdGluZyBnYXJiYWdlIHRvIHRoZVxuICAgIC8vIFBhdGllbnQgcmVzb3VyY2UncyB1bmlxdWUga2V5LlxuICAgIGlmIChyZXN1bHQgJiYgL15bQS1aXVsxMl1cXGR7OH0kLy50ZXN0KHJlc3VsdCkpIGNpZCA9IHJlc3VsdDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gSUhLRTM0MTAgY2lkIGZldGNoIGZhaWxlZDpcIiwgZT8ubWVzc2FnZSA/PyBlKTtcbiAgfVxuXG4gIGlmIChjaWQgJiYgY2lkICE9PSBjdXJyZW50KSB7XG4gICAgcGF0aWVudE92ZXJyaWRlID0geyAuLi5wYXRpZW50T3ZlcnJpZGUsIGlkX25vOiBjaWQgfTtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwYXRpZW50T3ZlcnJpZGUgfSkuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgLy8gUGF0aWVudC1zd2l0Y2ggY2xlYW51cC4gSWYgdGhlIGNpZCBqdXN0IGNoYW5nZWQgZnJvbSBvbmUgcmVhbFxuICAgIC8vIGNpZCB0byBhbm90aGVyIChub3QganVzdCBcImF1dG8tWFhYWCBcdTIxOTIgcmVhbCBjaWRcIiBmaXJzdC1zeW5jIHN3YXApLFxuICAgIC8vIHRoZSBwcmV2aW91c2x5LXN0YXNoZWQgRkhJUiBidW5kbGUgYmVsb25ncyB0byB0aGUgT1RIRVIgcGF0aWVudC5cbiAgICAvLyBEcm9wIGl0IHNvIHRoZSBwb3B1cCdzIGRvd25sb2FkIGJ1dHRvbiBkb2Vzbid0IGtlZXAgb2ZmZXJpbmcgdGhlXG4gICAgLy8gd3JvbmcgcGF0aWVudCdzIGZpbGUuIFNhbWUgc2V0IG9mIHdpcGVzIHBvcHVwLmpzIGRvZXMgaW5cbiAgICAvLyBzYXZlUGF0aWVudE92ZXJyaWRlIHdoZW4gaXQgZGV0ZWN0cyBwYXRpZW50Q2hhbmdlZC5cbiAgICBjb25zdCBzd2l0Y2hlZFJlYWxQYXRpZW50cyA9XG4gICAgICBjdXJyZW50ICYmICFjdXJyZW50LnN0YXJ0c1dpdGgoXCJhdXRvLVwiKSAmJiBjdXJyZW50ICE9PSBjaWQ7XG4gICAgaWYgKHN3aXRjaGVkUmVhbFBhdGllbnRzKSB7XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhdGllbnRPdmVycmlkZTtcbn1cblxuLy8gUmVhZCB0aGUgbWFzay1uYW1lIHByZWZlcmVuY2UgZnJlc2ggZnJvbSBzdG9yYWdlLiBXZSBkb24ndCBjYWNoZSBcdTIwMTRcbi8vIHJ1bk5oaUFwaVN5bmMgaXMgaW52b2tlZCBhdCBtb3N0IGEgZmV3IHRpbWVzIHBlciBzZXNzaW9uIGFuZCB0aGUgU1dcbi8vIGNhbiBiZSB0b3JuIGRvd24gKyByZXN0YXJ0ZWQgYW55IHRpbWUsIHNvIGEgc2luZ2xlIGdldCgpIHBlciBzeW5jIGlzXG4vLyBjaGVhcGVyIHRoYW4gc3luY2luZyBzdGF0ZSBhY3Jvc3MgU1cgbGlmZWN5Y2xlcy5cbmFzeW5jIGZ1bmN0aW9uIF9pc01hc2tFbmFibGVkKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgbWFza05hbWVFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJtYXNrTmFtZUVuYWJsZWRcIik7XG4gICAgcmV0dXJuIG1hc2tOYW1lRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZE92ZXJyaWRlUGF0aWVudChvdiwgbWFza0VuYWJsZWQpIHtcbiAgY29uc3QgZGlzcGxheU5hbWUgPSBtYXNrRW5hYmxlZCA/IG1hc2tOYW1lKG92Lm5hbWUgfHwgXCJcIikgOiBvdi5uYW1lIHx8IFwiXCI7XG4gIGNvbnN0IHJhdyA9IHtcbiAgICBpZDogb3YuaWRfbm8sXG4gICAgaWRlbnRpZmllcjogb3YuaWRfbm8sXG4gICAgbmFtZTogZGlzcGxheU5hbWUgfHwgb3YuaWRfbm8sXG4gIH07XG4gIGlmIChvdi5iaXJ0aF9kYXRlKSByYXcuYmlydGhEYXRlID0gb3YuYmlydGhfZGF0ZTtcbiAgaWYgKG92LmdlbmRlcikgcmF3LmdlbmRlciA9IG92LmdlbmRlcjtcbiAgcmV0dXJuIG1hcFBhdGllbnQocmF3KTtcbn1cblxuLy8gV2FsayBhIEpTT04tbGlrZSB2YWx1ZSBhbmQgcmVwbGFjZSBldmVyeSBzdHJpbmcgdG9rZW4gZXF1YWwgdG8gb3Jcbi8vIGNvbnRhaW5pbmcgYG5lZWRsZWAgd2l0aCBgcmVwbGFjZW1lbnRgLiBVc2VkIHRvIHNjcnViIHRoZSByZWFsXG4vLyBwYXRpZW50IG5hbWUgb3V0IG9mIE5ISSBuYXJyYXRpdmUgZmllbGRzIChjbGluaWNhbF9ub3RlLCBjb25jbHVzaW9uLFxuLy8gbm90ZSwgZXRjLikgYmVmb3JlIHRoZSBpdGVtcyByZWFjaCB0aGUgbWFwcGVyLiBPbmx5IHRyaWdnZXJlZCB3aGVuXG4vLyB0aGUgdXNlciBoYXMgb3B0ZWQgaW50byBtYXNraW5nIEFORCBzdXBwbGllZCBhIG5hbWUgXHUyMDE0IGFuZCB0aGVcbi8vIHN1YnN0aXR1dGlvbiBpcyBleGFjdC10b2tlbi1yZXBsYWNlLCBub3QgZnV6enksIHNvIGl0IGNhbid0IHN1cnByaXNlXG4vLyB0aGUgdXNlciBieSBjbG9iYmVyaW5nIHVucmVsYXRlZCBjb250ZW50LlxuZnVuY3Rpb24gX3JlcGxhY2VOYW1lRGVlcCh2YWx1ZSwgbmVlZGxlLCByZXBsYWNlbWVudCkge1xuICBpZiAoIW5lZWRsZSB8fCBuZWVkbGUgPT09IHJlcGxhY2VtZW50KSByZXR1cm4gdmFsdWU7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHJldHVybiB2YWx1ZS5zcGxpdChuZWVkbGUpLmpvaW4ocmVwbGFjZW1lbnQpO1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHJldHVybiB2YWx1ZS5tYXAoKHYpID0+IF9yZXBsYWNlTmFtZURlZXAodiwgbmVlZGxlLCByZXBsYWNlbWVudCkpO1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHZhbHVlKSBvdXRba10gPSBfcmVwbGFjZU5hbWVEZWVwKHZhbHVlW2tdLCBuZWVkbGUsIHJlcGxhY2VtZW50KTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKSB7XG4gIGNvbnN0IHBhdGllbnQgPSBfYnVpbGRPdmVycmlkZVBhdGllbnQocGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCk7XG4gIGNvbnN0IHBpZCA9IHBhdGllbnQuaWQ7XG4gIGNvbnN0IGFsbCA9IFtwYXRpZW50XTtcblxuICBmb3IgKGNvbnN0IHB0IG9mIF9MT0NBTF9QQUdFX1RZUEVfT1JERVIpIHtcbiAgICBjb25zdCBpdGVtcyA9IGJ5VHlwZVtwdF07XG4gICAgaWYgKCFpdGVtcyB8fCBpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGxldCBtYXBwZWQ7XG4gICAgaWYgKEdST1VQX0hBTkRMRVJTW3B0XSkge1xuICAgICAgbWFwcGVkID0gR1JPVVBfSEFORExFUlNbcHRdKGl0ZW1zLCBwaWQpO1xuICAgIH0gZWxzZSBpZiAoTElTVF9IQU5ETEVSU1twdF0pIHtcbiAgICAgIGNvbnN0IFtmbl0gPSBMSVNUX0hBTkRMRVJTW3B0XTtcbiAgICAgIG1hcHBlZCA9IGl0ZW1zXG4gICAgICAgIC5maWx0ZXIoKGl0KSA9PiBpdCAmJiB0eXBlb2YgaXQgPT09IFwib2JqZWN0XCIpXG4gICAgICAgIC5tYXAoKGl0KSA9PiBmbihpdCwgcGlkKSlcbiAgICAgICAgLmZpbHRlcigocikgPT4gciAhPT0gbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAocHQgPT09IFwiZW5jb3VudGVyc1wiKSBtYXBwZWQgPSBkZWR1cEFkbWlzc2lvbkRheUFtYihtYXBwZWQpO1xuICAgIGFsbC5wdXNoKC4uLm1hcHBlZCk7XG4gIH1cblxuICAvLyBEZWR1cCBieSAocmVzb3VyY2VUeXBlLCBpZCkgYmVmb3JlIGFzc2VtYmxpbmcgdGhlIEJ1bmRsZS4gTXVsdGlwbGVcbiAgLy8gTkhJIGVuZHBvaW50cyBjYW4gZmVlZCB0aGUgc2FtZSBwYWdlX3R5cGUgKGUuZy4gZW5jb3VudGVycyAvXG4gIC8vIGlucGF0aWVudCAvIGlucGF0aWVudF9sZWdhY3kgYWxsIFx1MjE5MiBwYWdlX3R5cGU9XCJlbmNvdW50ZXJzXCIpLCBhbmQgdGhlXG4gIC8vIG1hcHBlciBwcm9kdWNlcyBkZXRlcm1pbmlzdGljIHN0YWJsZSBJRHMgXHUyMDE0IHNvIHR3byByYXcgaXRlbXMgdGhhdFxuICAvLyBkZXNjcmliZSB0aGUgc2FtZSBtZWRpY2FsIGV2ZW50IGNvbGxhcHNlIHRvIG9uZSByZXNvdXJjZS4gQmFja2VuZFxuICAvLyB1cHNlcnQgaGFuZGxlcyB0aGlzIGF1dG9tYXRpY2FsbHkgKHNhbWUgc3RhYmxlIElEID0gc2FtZSBEQiByb3cpO1xuICAvLyBsb2NhbCBtb2RlIGhhcyB0byBkbyBpdCBleHBsaWNpdGx5LiBXaXRob3V0IHRoaXMgZGVkdXAsIHRoZSBsb2NhbFxuICAvLyBCdW5kbGUgZW5kcyB1cCBpbmZsYXRlZCByZWxhdGl2ZSB0byB3aGF0IGJhY2tlbmQgc3RvcmVzIGZyb20gdGhlXG4gIC8vIGlkZW50aWNhbCBOSEkgaW5wdXQuXG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gIGNvbnN0IHVuaXF1ZSA9IFtdO1xuICBmb3IgKGNvbnN0IHIgb2YgYWxsKSB7XG4gICAgY29uc3Qga2V5ID0gYCR7ci5yZXNvdXJjZVR5cGV9LyR7ci5pZH1gO1xuICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICBzZWVuLmFkZChrZXkpO1xuICAgIHVuaXF1ZS5wdXNoKHIpO1xuICB9XG5cbiAgLy8gTGlua2VyICsgc2V4LXN0cmF0aWZpZWQgcmVzb2x2ZXIgcnVuIG9uY2Ugb3ZlciB0aGUgZnVsbCBhc3NlbWJsZWRcbiAgLy8gbGlzdCAoc2FtZSBwaXBlbGluZSBiYWNrZW5kJ3MgL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQgcnVucywganVzdFxuICAvLyBhZ2FpbnN0IGFuIGluLW1lbW9yeSBjYW5kaWRhdGUgYXJyYXkgaW5zdGVhZCBvZiBhIFNRTGl0ZSBxdWVyeSkuXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXModW5pcXVlLCB1bmlxdWUpO1xuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyhwYXRpZW50LCB1bmlxdWUpO1xuXG4gIHJldHVybiB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkJ1bmRsZVwiLFxuICAgIHR5cGU6IFwiY29sbGVjdGlvblwiLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLlxcZCtaJC8sIFwiWlwiKSxcbiAgICBlbnRyeTogdW5pcXVlLm1hcCgocikgPT4gKHtcbiAgICAgIGZ1bGxVcmw6IGAke3IucmVzb3VyY2VUeXBlfS8ke3IuaWR9YCxcbiAgICAgIHJlc291cmNlOiByLFxuICAgIH0pKSxcbiAgfTtcbn1cblxuLy8gTG9jYWwgbW9kZSBzdGFzaGVzIHRoZSBhc3NlbWJsZWQgQnVuZGxlIGluIGNocm9tZS5zdG9yYWdlLnNlc3Npb25cbi8vIHVuZGVyIGEgc2luZ2xlIFwicGVuZGluZ0ZoaXJCdW5kbGVcIiBzbG90LiBUaGUgcG9wdXAgc2hvd3MgYSBkb3dubG9hZFxuLy8gYnV0dG9uIHdoZW4gdGhpcyBzbG90IGlzIG5vbi1lbXB0eTsgdGhlIGFjdHVhbCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkXG4vLyBjYWxsIGhhcHBlbnMgZnJvbSB0aGUgcG9wdXAgKGluIHJlc3BvbnNlIHRvIGEgdXNlciBjbGljaykgc28gdGhlIGZpbGVcbi8vIGRvZXNuJ3QgYXBwZWFyIGluIHRoZSBEb3dubG9hZHMgYmFyIHVuaW52aXRlZC5cbi8vXG4vLyBXaHkgc2Vzc2lvbiAobm90IGxvY2FsKSBcdTIwMTQgc2VjdXJpdHkgYXVkaXQgIzU6IFBISSBwZXJzaXN0ZWQgaW5cbi8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIHN1cnZpdmVzIGJyb3dzZXIgcmVzdGFydHMgaW5kZWZpbml0ZWx5LiBUaGVcbi8vIE1WMy1uYXRpdmUgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbiBpcyB3aXBlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlXG4vLyBicm93c2VyIGNsb3NlcywgZHJhc3RpY2FsbHkgc2hyaW5raW5nIHRoZSBkaXNrLXJlc2lkZW50IFBISSB3aW5kb3cuXG4vL1xuLy8gQWRkaXRpb25hbGx5OlxuLy8gICAtIFNpbmdsZSBzbG90IG1lYW5zIGEgbmV3IHN5bmMgb3ZlcndyaXRlcyB0aGUgcHJldmlvdXMgcGVuZGluZyBidW5kbGUuXG4vLyAgIC0gVGhlIHBvcHVwJ3MgZG93bmxvYWRQZW5kaW5nQnVuZGxlIHdpcGVzIHRoZSBzbG90IHRoZSBtb21lbnQgdGhlXG4vLyAgICAgdXNlci1pbml0aWF0ZWQgZG93bmxvYWQgY29tcGxldGVzLlxuLy8gICAtIEEgcGVyaW9kaWMgY2hyb21lLmFsYXJtcyBzd2VlcCAoUEVORElOR19CVU5ETEVfVFRMX01TKSB3aXBlcyB0aGVcbi8vICAgICBzbG90IGlmIHRoZSB1c2VyIGxlYXZlcyBhIHN5bmMgc2l0dGluZyB1bmNvbnN1bWVkIGZvciBhbiBob3VyLlxuLy8gY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbiBkZWZhdWx0IHF1b3RhIGlzIDEwIE1COyBhIHR5cGljYWwgTkhJIHN5bmMgaXNcbi8vIHdlbGwgdW5kZXIgMiBNQi5cbmNvbnN0IFBFTkRJTkdfQlVORExFX0tFWSA9IFwicGVuZGluZ0ZoaXJCdW5kbGVcIjtcbmNvbnN0IFBFTkRJTkdfQlVORExFX1RUTF9NUyA9IDYwICogNjAgKiAxMDAwOyAvLyAxIGhvdXJcbmNvbnN0IFBFTkRJTkdfQlVORExFX1NXRUVQX0FMQVJNID0gXCJwZW5kaW5nLWJ1bmRsZS1zd2VlcFwiO1xuXG4vLyBEZWJ1ZyB0b2dnbGUgZm9yIHRoZSBwZXItZW5kcG9pbnQgXCJmaXJzdCBib2R5IHNhbXBsZVwiIHN0YXNoIHVzZWQgdG9cbi8vIGRpYWdub3NlIGFkYXB0ZXIgbWlzbWF0Y2hlcyAocmF3X2NvdW50ID4gMCBidXQgYWRhcHRlZF9jb3VudCA9PSAwKS5cbi8vIEhBUkQtT0ZGIGluIHRoZSBwdWJsaXNoZWQgZXh0ZW5zaW9uOiB0aGUgc2FtcGxlIGNvbnRhaW5zIHJhdyBOSElcbi8vIHBheWxvYWQgKGxhYiB2YWx1ZXMsIGRydWcgbmFtZXMsIGVuY291bnRlciByZWNvcmRzIFx1MjAxNCBQSEkpLiBGbGlwIHRvXG4vLyB0cnVlICpsb2NhbGx5KiBkdXJpbmcgYWRhcHRlciBkZXZlbG9wbWVudDsgbmV2ZXIgY29tbWl0IGB0cnVlYC5cbmNvbnN0IERFQlVHX1NUQVNIX0JPRFlfU0FNUExFUyA9IGZhbHNlO1xuXG5hc3luYyBmdW5jdGlvbiBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudElkLCBkYXRlUmFuZ2UpIHtcbiAgLy8gRmlsZW5hbWU6IG5oaS17cGlkfS17c3RhcnRZWVlZTU1ERH0te2VuZFlZWVlNTUREfS5qc29uXG4gIC8vIFdoZW4gbm8gZXhwbGljaXQgZGF0ZVJhbmdlIChOSEkgZGVmYXVsdCA9IFx1OEZEMSAxIFx1NUU3NCksIHN5bnRoZXNpemUgdG9kYXktMXkgXHUyMTkyIHRvZGF5LlxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgY29uc3QgZm10ID0gKGQpID0+IGAke2QuZ2V0RnVsbFllYXIoKX0ke3BhZChkLmdldE1vbnRoKCkgKyAxKX0ke3BhZChkLmdldERhdGUoKSl9YDtcbiAgLy8gSGFsZi1tYXNrIHRoZSBJRCBpbiB0aGUgZmlsZW5hbWUgc28gdGhlIHVzZXIncyBEb3dubG9hZHMgZm9sZGVyXG4gIC8vIGRvZXNuJ3QgbGVhayB0aGUgZnVsbCBcdThFQUJcdTUyMDZcdThCNDkgKHdvdWxkIGJlIHZpc2libGUgdG8gYW55b25lIHNlZWluZ1xuICAvLyBhIGZpbGUgbGlzdGluZyBvciBkb3dubG9hZC1iYXIgcHJldmlldykuIGBYYCBiZWNhdXNlIGAqYCBpc1xuICAvLyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIEJ1bmRsZSBDT05URU5UUyBzdGlsbCBjYXJyeSB0aGUgcmVhbFxuICAvLyBJRCB1bmRlciBQYXRpZW50LmlkIFx1MjAxNCBmaWxlIG93bmVyIGtub3dzIHdob3NlIGRhdGEgaXQgaXMuXG4gIGNvbnN0IG1hc2tlZFBpZCA9IG1hc2tJZChwYXRpZW50SWQgfHwgXCJ1bmtub3duXCIsIFwiWFwiKTtcbiAgY29uc3Qgc2FmZVBpZCA9IG1hc2tlZFBpZC5yZXBsYWNlKC9bXkEtWmEtejAtOV8tXS9nLCBcIl9cIik7XG4gIGNvbnN0IGNvbXBhY3QgPSAoZCkgPT4gKGQgfHwgXCJcIikuc2xpY2UoMCwgMTApLnJlcGxhY2UoLy0vZywgXCJcIik7XG4gIGxldCBzLCBlO1xuICBpZiAoZGF0ZVJhbmdlICYmIChkYXRlUmFuZ2Uuc3RhcnQgfHwgZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICBzID0gY29tcGFjdChkYXRlUmFuZ2Uuc3RhcnQpIHx8IGZtdChub3cpO1xuICAgIGUgPSBjb21wYWN0KGRhdGVSYW5nZS5lbmQpIHx8IGZtdChub3cpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG9uZVllYXJBZ28gPSBuZXcgRGF0ZShub3cpO1xuICAgIG9uZVllYXJBZ28uc2V0RnVsbFllYXIob25lWWVhckFnby5nZXRGdWxsWWVhcigpIC0gMSk7XG4gICAgcyA9IGZtdChvbmVZZWFyQWdvKTtcbiAgICBlID0gZm10KG5vdyk7XG4gIH1cbiAgY29uc3QgZmlsZW5hbWUgPSBgbmhpLSR7c2FmZVBpZH0tJHtzfS0ke2V9Lmpzb25gO1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoYnVuZGxlLCBudWxsLCAyKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5zZXQoe1xuICAgIFtQRU5ESU5HX0JVTkRMRV9LRVldOiB7XG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGpzb24sXG4gICAgICBieXRlczoganNvbi5sZW5ndGgsXG4gICAgICBnZW5lcmF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIHBhdGllbnRJZDogcGF0aWVudElkIHx8IG51bGwsXG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiB7IGZpbGVuYW1lLCBieXRlczoganNvbi5sZW5ndGggfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuTmhpQXBpU3luYyh7IHRhYklkLCBtb2RlLCBiYWNrZW5kLCBzeW5jQXBpS2V5LCBuaGlCYXNlLCBwYXRpZW50T3ZlcnJpZGUsIGRhdGVSYW5nZSwgZGF0ZVJhbmdlTGFiZWwgfSkge1xuICBfY2FuY2VsbGVkID0gZmFsc2U7XG4gIGNvbnN0IEJBU0UgPSBuaGlCYXNlIHx8IGBodHRwczovLyR7TkhJX0hPU1R9YDtcblxuICBpZiAoIXBhdGllbnRPdmVycmlkZSkge1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU4QUNCXHU1MTQ4XHU1NzI4IHBvcHVwIFx1NTg2Qlx1NUJFQlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1NUY4Q1x1NTE4RFx1OEE2NlwiLFxuICAgICAgICBwaGFzZTogXCJlcnJvclwiLCB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCF0YWJJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkFQSSBzeW5jIHJlcXVpcmVzIE5ISSB0YWIgaWQgKGNvb2tpZXMgYXJlIGZpcnN0LXBhcnR5KVwiKTtcbiAgfVxuXG4gIC8vIEZpcnN0IGNoYW5jZSB0byB1cGdyYWRlIHRoZSBwYXRpZW50IElEOiBpZiB0aGUgcG9wdXAgZ2F2ZSB1cyBhblxuICAvLyBcImF1dG8tWFhYWFhYWFhcIiBwbGFjZWhvbGRlciAodXNlciBkaWRuJ3QgbWFudWFsbHkgdHlwZSBvbmUpLFxuICAvLyBmZXRjaCB0aGUgcmVhbCBvbmUgZnJvbSBOSEkncyBJSEtFMzQxMFMwMSBlbmRwb2ludCAocmVzcG9uc2UuY2lkXG4gIC8vIGlzIHRoZSBjaXRpemVuIElEKS4gUGVyc2lzdCBiYWNrIHRvIHN0b3JhZ2Ugc28gc3Vic2VxdWVudCBzeW5jc1xuICAvLyBhcmUgc3RhYmxlLiBNYW51YWxseS10eXBlZCBJRHMgYXJlIHJlc3BlY3RlZCBhcy1pcy5cbiAgcGF0aWVudE92ZXJyaWRlID0gYXdhaXQgX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpKHRhYklkLCBwYXRpZW50T3ZlcnJpZGUpO1xuXG4gIC8vIFN0YXNoIGNvbnRleHQgc28gdGhlIHN0b3BTeW5jIG1lc3NhZ2UgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4gIC8vIGRhdGEgKERFTEVURSAvc3luYy9wYXRpZW50L3tpZF9ub30pIHdpdGhvdXQgdXMgaGF2aW5nIHRvIHNlbmQgaXRcbiAgLy8gYmFjayB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlLlxuICBfYWN0aXZlU3luY0N0eCA9IHsgYmFja2VuZCwgc3luY0FwaUtleSwgcGF0aWVudElkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfTtcblxuICAvLyBXYWxsLWNsb2NrIHN0YXJ0IHRpbWUgXHUyMDE0IHVzZWQgdG8gY29tcHV0ZSBlbGFwc2VkIHNlY29uZHMgZm9yIHRoZVxuICAvLyBmaW5hbCBzdGF0dXMgbGluZSAoXCJcdTdFM0RcdTgwMTdcdTY2NDIgMTIuMyBcdTc5RDJcIikuIFN0YXNoIG9uIGEgbG9jYWwgc28gd2UgY2FuXG4gIC8vIHJlYWNoIGl0IGZyb20gdGhlIGNvbXBsZXRpb24gbWVzc2FnZSBhdCB0aGUgdmVyeSBlbmQuXG4gIGNvbnN0IF90MCA9IERhdGUubm93KCk7XG4gIC8vIFBlci1waGFzZSB0aW1pbmdzLCBzdXJmYWNlZCBpbnRvIHRoZSBwb3B1cCdzIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHNlZSBleGFjdGx5IHdoZXJlIHRpbWUgaXMgZ29pbmcuIEVhY2ggZW50cnk6IHsgbmFtZSwgbXMgfS5cbiAgY29uc3QgX3BoYXNlcyA9IFtdO1xuICBsZXQgX3BoYXNlU3RhcnQgPSBfdDA7XG4gIGNvbnN0IF9tYXJrUGhhc2UgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgX3BoYXNlcy5wdXNoKHsgbmFtZSwgbXM6IG5vdyAtIF9waGFzZVN0YXJ0IH0pO1xuICAgIF9waGFzZVN0YXJ0ID0gbm93O1xuICB9O1xuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IHRydWUsIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIiwgcGhhc2U6IFwiaW5pdFwiLFxuICAgIHN0YXJ0ZWQ6IF90MCwgdG90YWxSZXNvdXJjZXM6IDAsIGhvc3Q6IE5ISV9IT1NULCBlcnJvcnM6IFtdLFxuICB9KTtcblxuICAvLyBTdGVwIDE6IGZldGNoIGFsbCBlbmRwb2ludHMgaW4gUEFSQUxMRUwgaW5zaWRlIHRoZSBOSEkgdGFiLiBSdW5uaW5nIGluXG4gIC8vIHRhYiBjb250ZXh0IG1lYW5zIHNhbWUtb3JpZ2luIGNvb2tpZXMgYXJlIHNlbnQgYXV0b21hdGljYWxseSBcdTIwMTQgZmV0Y2hcbiAgLy8gZnJvbSB0aGUgU1cgd291bGQgYmUgY3Jvc3Mtb3JpZ2luIGFuZCBTYW1lU2l0ZSBibG9ja3MgdGhlIHNlc3Npb25cbiAgLy8gY29va2llLCBoZW5jZSB3ZSBnb3QgXCJzZXNzaW9uIGV4cGlyZWRcIiBldmVuIHdoZW4gbG9nZ2VkIGluLlxuICAvLyBQYXNzIG9ubHkgc2VyaWFsaXNhYmxlIGRhdGEgKHBhdGhzLCBtZXRob2QsIG5hbWUpOyBhZGFwdGVycyBzdGF5IGluIFNXLlxuICAvLyBJbmplY3QgSVNPLWRhdGUgcmFuZ2UgaW50byBlYWNoIGVuZHBvaW50IHRoYXQgc3VwcG9ydHMgaXQgKGNvbnZlcnRzXG4gIC8vIHRvIFx1NkMxMVx1NTcwQiBmb3JtYXQgdmlhIGlzb1RvUk9DKS4gU2tpcHBlZCBlbmRwb2ludHMga2VlcCB0aGVpciBkZWZhdWx0XG4gIC8vIE5ISS1zaWRlIHdpbmRvdyAoMS0yIHllYXJzIGRlcGVuZGluZyBvbiB0aGUgcGFnZSkuXG4gIGNvbnN0IGZldGNoU3BlYyA9IE5ISV9BUElfRU5EUE9JTlRTLm1hcCgoZXApID0+IHtcbiAgICBjb25zdCBwYXRoID0gZXAuc3VwcG9ydHNEYXRlUmFuZ2UgPyBhcHBseURhdGVSYW5nZVRvUGF0aChlcC5wYXRoLCBkYXRlUmFuZ2UpIDogZXAucGF0aDtcbiAgICByZXR1cm4geyBuYW1lOiBlcC5uYW1lLCB1cmw6IEJBU0UgKyBwYXRoLCBtZXRob2Q6IFwiR0VUXCIgfTtcbiAgfSk7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIGNvbnNvbGUubG9nKFwiW05ISSBBUEkgc3luY10gZGF0ZSByYW5nZTpcIixcbiAgICAgIGAke2RhdGVSYW5nZS5zdGFydCB8fCBcIih1bmJvdW5kZWQpXCJ9IFx1MjE5MiAke2RhdGVSYW5nZS5lbmQgfHwgXCIodW5ib3VuZGVkKVwifWApO1xuICB9XG5cbiAgbGV0IHNldHRsZWRSYXc7XG4gIHRyeSB7XG4gICAgW3sgcmVzdWx0OiBzZXR0bGVkUmF3IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKHNwZWNzKSA9PiB7XG4gICAgICAgIC8vIE5ISSBhdXRoOiBjb29raWVzICsgSldUIGluIHNlc3Npb25TdG9yYWdlLiBUaGUgU1BBJ3MgYXhpb3Mgc2V0c1xuICAgICAgICAvLyBgQXV0aG9yaXphdGlvbjogQmVhcmVyIDx0b2tlbj5gIG9uIGV2ZXJ5IEFQSSBjYWxsLiBTZXNzaW9uXG4gICAgICAgIC8vIGNvb2tpZXMgYWxvbmUgcmV0dXJuIDQwMS5cbiAgICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdG9rZW4pIHJldHVybiBbeyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9XTtcbiAgICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuXG4gICAgICAgIC8vIERldGVjdCBJRExFL3RpbWVvdXQgcGFnZSBhbHJlYWR5IHJlZGlyZWN0ZWQgb24gdGhpcyB0YWIuXG4gICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgICByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyA2MC1zZWNvbmQgdGltZW91dCBwZXIgZmV0Y2ggXHUyMDE0IHNvbWUgTkhJIGVuZHBvaW50cyAoZW5jb3VudGVycyxcbiAgICAgICAgLy8gbWVkcykgdGFrZSAyMCsgc2Vjb25kcy5cbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocywgbXMpIHtcbiAgICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgbXMpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2gocy51cmwsIHtcbiAgICAgICAgICAgICAgbWV0aG9kOiBzLm1ldGhvZCxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgICAgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBjb25zdCBjdCA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICAgIGlmICghY3QuaW5jbHVkZXMoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IGBub24tSlNPTiAoY3Q9JHtjdH0pYCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgICAgICB0cnkgeyBib2R5ID0gYXdhaXQgci5qc29uKCk7IH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiSlNPTiBwYXJzZTogXCIgKyBlLm1lc3NhZ2UgfTsgfVxuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBib2R5IH07XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGlmIChlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcInRpbWVvdXQgNjBzXCIgfTtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uY3VycmVuY3ktbGltaXRlZCBleGVjdXRpb246IG1heCAzIGluIGZsaWdodCBhdCBvbmNlLiBOSEknc1xuICAgICAgICAvLyBhYnVzZSBkZXRlY3Rpb24gYmxvY2tzIGJ1cnN0czsgd2l0aCAxMSBwYXJhbGxlbCBmZXRjaGVzIGl0XG4gICAgICAgIC8vIHRocm90dGxlZCB0aGUgc2Vzc2lvbiBhbmQgcmVkaXJlY3RlZCB0byBJSEtFMzAwMVM5OV9JRExFLlxuICAgICAgICAvLyAzIGF0IGEgdGltZSArIDIwMG1zIGppdHRlciBpcyBnZW50bGUgZW5vdWdoIGZvciAxLXNob3Qgc3luYy5cbiAgICAgICAgY29uc3QgQ09OQ1VSUkVOQ1kgPSAzO1xuICAgICAgICBjb25zdCBKSVRURVJfTVMgPSAyMDA7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBuZXcgQXJyYXkoc3BlY3MubGVuZ3RoKTtcbiAgICAgICAgbGV0IG5leHRJZHggPSAwO1xuICAgICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgICAgd2hpbGUgKG5leHRJZHggPCBzcGVjcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBuZXh0SWR4Kys7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIEpJVFRFUl9NUykpO1xuICAgICAgICAgICAgcmVzdWx0c1tpXSA9IGF3YWl0IGZldGNoT25lKHNwZWNzW2ldLCA2MDAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdvcmtlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DVVJSRU5DWSAmJiB3IDwgc3BlY3MubGVuZ3RoOyB3KyspIHtcbiAgICAgICAgICB3b3JrZXJzLnB1c2god29ya2VyKCkpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdvcmtlcnMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0sXG4gICAgICBhcmdzOiBbZmV0Y2hTcGVjXSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgZXhlY3V0ZVNjcmlwdCBmYWlsZWQ6ICR7ZS5tZXNzYWdlfWApO1xuICB9XG5cbiAgLy8gRGV0ZWN0IHNlc3Npb24gZXhwaXJlZCBhY3Jvc3MgcmVzdWx0cy5cbiAgaWYgKHNldHRsZWRSYXcuc29tZSgocikgPT4gci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgfVxuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuXG4gIC8vIEdlbmVyaWMgbGlzdCBleHRyYWN0aW9uOiBoYW5kbGVzIGFsbCBvYnNlcnZlZCBOSEkgc2hhcGVzLlxuICAvLyAgIC0gUGxhaW4gYXJyYXkgKElIS0UzNDA5IGxhYilcbiAgLy8gICAtIHtzcF9JSEtFPFg+X2RhdGE6IFsuLi5dfSAgKG1lZGljYXRpb25zLCBhbGxlcmdpZXMpXG4gIC8vICAgLSB7d2VzdGVybl9kYXRhLCBjaGluZXNlX2RhdGEsIGRlbnRpc3RfZGF0YTogWy4uLl19IChlbmNvdW50ZXIgbGlzdCxcbiAgLy8gICAgIHNwbGl0IGJ5IFx1ODk3Rlx1OTFBQi9cdTRFMkRcdTkxQUIvXHU3MjU5XHU5MUFCIFx1MjAxNCB3ZSB3YW50IGFsbCB0aHJlZSlcbiAgLy8gRm9yIG11bHRpLWFycmF5IHNoYXBlcyB3ZSBtZXJnZSBhbGwgYXJyYXlzIGFuZCB0YWcgZWFjaCBpdGVtIHdpdGhcbiAgLy8gYF9fc2VjdGlvbmAgKHRoZSBzb3VyY2Uga2V5KSBzbyBhZGFwdGVycyBjYW4gZGlzYW1iaWd1YXRlLlxuICBmdW5jdGlvbiBleHRyYWN0TGlzdChib2R5KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYm9keSkpIHJldHVybiBib2R5O1xuICAgIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIFtdO1xuICAgIGxldCBhcnJheUtleXMgPSBPYmplY3QuZW50cmllcyhib2R5KS5maWx0ZXIoKFtfLCB2XSkgPT4gQXJyYXkuaXNBcnJheSh2KSk7XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICBpZiAoYXJyYXlLZXlzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTtcbiAgICAvLyBNdWx0aXBsZSBhcnJheXMgXHUyMDE0IGRyb3AgVUktaGVscGVyIGFycmF5cyAoZHJvcGRvd24gb3B0aW9ucywgc29ydFxuICAgIC8vIHNlbGVjdG9ycywgbG9va3VwIHRhYmxlcykuIE5ISSBtaXhlcyB0aGVtIGludG8gdGhlIHNhbWUgcmVzcG9uc2VcbiAgICAvLyAoZS5nLiBpbWFnaW5nIHJldHVybnMgc3BfSUhLRTM0MDhTMDFfZGF0YSArIGljZDljbV9zZWxlY3QpLlxuICAgIGNvbnN0IEhFTFBFUl9SRSA9IC9zZWxlY3R8b3B0aW9ufGRyb3Bkb3dufGZpbHRlcnxzb3J0fGxvb2t1cC9pO1xuICAgIGNvbnN0IGRhdGFLZXlzID0gYXJyYXlLZXlzLmZpbHRlcigoW2tdKSA9PiAhSEVMUEVSX1JFLnRlc3QoaykpO1xuICAgIGlmIChkYXRhS2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBkYXRhS2V5c1swXVsxXTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gYXJyYXlLZXlzWzBdWzFdOyAvLyBmYWxsYmFja1xuICAgIGFycmF5S2V5cyA9IGRhdGFLZXlzO1xuICAgIC8vIE11bHRpcGxlIGRhdGEgYXJyYXlzIChlLmcuIHdlc3Rlcm5fZGF0YS9jaGluZXNlX2RhdGEvZGVudGlzdF9kYXRhKVxuICAgIC8vIFx1MjAxNCBtZXJnZSB3aXRoIF9fc2VjdGlvbiB0YWcgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBhcnJheUtleXMpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSB7XG4gICAgICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goeyAuLi5pdGVtLCBfX3NlY3Rpb246IGsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfVxuXG4gIC8vIEFwcGx5IFNXLXNpZGUgYWRhcHRlcnMgdG8gZWFjaCBlbmRwb2ludCdzIGJvZHkuXG4gIGNvbnN0IHNldHRsZWQgPSBzZXR0bGVkUmF3Lm1hcCgociwgaSkgPT4ge1xuICAgIGNvbnN0IGVwID0gTkhJX0FQSV9FTkRQT0lOVFNbaV07XG4gICAgaWYgKHIuZXJyb3IpIHtcbiAgICAgIHJldHVybiB7IHN0YXR1czogXCJyZWplY3RlZFwiLCByZWFzb246IHsgbWVzc2FnZTogYCR7ZXAubmFtZX06ICR7ci5lcnJvcn1gIH0gfTtcbiAgICB9XG4gICAgY29uc3QgbGlzdCA9IGV4dHJhY3RMaXN0KHIuYm9keSk7XG4gICAgLy8gQWRhcHRlcnMgcmV0dXJuIGVpdGhlcjpcbiAgICAvLyAgIC0gb25lIGl0ZW0gICAobW9zdCBhZGFwdGVycyBcdTIwMTQgbGFicywgbWVkcywgZW5jb3VudGVycywgaW1hZ2luZylcbiAgICAvLyAgIC0gbnVsbC91bmRlZmluZWQgKHNraXApXG4gICAgLy8gICAtIGFycmF5IG9mIGl0ZW1zIChhZGFwdEFkdWx0UHJldmVudGl2ZSBcdTIwMTQgdW5mb2xkcyBvbmUgc2NyZWVuaW5nXG4gICAgLy8gICAgIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbiBlbnRyaWVzKVxuICAgIC8vIEZsYXQtaGFuZGxlIGJvdGggc2hhcGVzIHNvIGVhY2ggYWRhcHRlciBjYW4gcGljayB3aGF0ZXZlcidzIGNsZWFyZXN0LlxuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgZm9yIChjb25zdCBpdCBvZiBsaXN0KSB7XG4gICAgICBjb25zdCByID0gZXAuYWRhcHQoaXQpO1xuICAgICAgaWYgKHIgPT09IG51bGwgfHwgciA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHIpKSB7XG4gICAgICAgIGZvciAoY29uc3QgeCBvZiByKSBpZiAoeCkgaXRlbXMucHVzaCh4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zLnB1c2gocik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNuYXBzaG90IGEgYm9keSBzYW1wbGUgZm9yIHNoYXBlcyB3aGVyZSBhZGFwdGVyIHJlamVjdGVkIGV2ZXJ5dGhpbmdcbiAgICAvLyBcdTIwMTQgdXNlZCBieSB0aGUgZGlhZ25vc3RpYyBicmVha2Rvd24gaW4gc3RlcCAyLlxuICAgIGxldCBib2R5U2FtcGxlID0gbnVsbDtcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gSW5jbHVkZSB0aGUgRklSU1QgSVRFTSAoZnVsbCBrZXlzK3ZhbHVlcykgc28gd2UgY2FuIGJ1aWxkIHRoZVxuICAgICAgLy8gY29ycmVjdCBhZGFwdGVyIHdpdGhvdXQgYW5vdGhlciByb3VuZC10cmlwLiBOSEkgaXRlbXMgbWF5IGluY2x1ZGVcbiAgICAgIC8vIFBJSTsgdGhlIHVzZXIgaW5zcGVjdHMgdGhpcyBsb2NhbGx5IHZpYSBzZXJ2aWNlLXdvcmtlciBkZXZ0b29scy5cbiAgICAgIGJvZHlTYW1wbGUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHRvcExldmVsS2V5czogQXJyYXkuaXNBcnJheShyLmJvZHkpID8gbnVsbCA6IE9iamVjdC5rZXlzKHIuYm9keSB8fCB7fSkuc2xpY2UoMCwgMTApLFxuICAgICAgICB3YXNBcnJheTogQXJyYXkuaXNBcnJheShyLmJvZHkpLFxuICAgICAgICBmaXJzdEl0ZW06IGxpc3RbMF0gPz8gbnVsbCxcbiAgICAgICAgc2Vjb25kSXRlbTogbGlzdFsxXSA/PyBudWxsLFxuICAgICAgfSkuc2xpY2UoMCwgNDAwMCk7XG4gICAgfVxuICAgIHJldHVybiB7IHN0YXR1czogXCJmdWxmaWxsZWRcIiwgdmFsdWU6IHsgZXAsIGl0ZW1zLCByYXdfY291bnQ6IGxpc3QubGVuZ3RoLCBib2R5U2FtcGxlLCByYXdMaXN0OiBsaXN0IH0gfTtcbiAgfSk7XG5cbiAgX21hcmtQaGFzZShcIm5oaS1wYXJhbGxlbFwiKTtcblxuICAvLyBTdGVwIDFhOiBlbmNvdW50ZXIgZGV0YWlsIGZhbi1vdXQgKElIS0UzMzAzUzAyKSBcdTIxOTIgY2xhc3NpZnkgZWFjaFxuICAvLyBJSEtFMzMwM1MwMSB2aXNpdCBhcyBBTUIgLyBFTUVSIC8gSU1QIHZpYSBob3NwX0RBVEFfVFlQRV9OQU1FLlxuICAvLyBMaXN0IGVuZHBvaW50IGRvZXNuJ3QgZXhwb3NlIFx1NjAyNVx1OEEzQSBkaXN0aW5jdGlvbjsgZGV0YWlsIGRvZXMuIFdlIHJlLVxuICAvLyBhZGFwdCBlYWNoIGVuY291bnRlciBpdGVtIHdpdGggdGhlIGRpc2NvdmVyZWQgY2xhc3MgYmVmb3JlIHRoZVxuICAvLyBiYWNrZW5kIHVwbG9hZCBzdGVwLlxuICAvLyBDcm9zcy1yZWZlcmVuY2U6IGJ1aWxkIGEgc2V0IG9mIHJvd19JRHMgdGhhdCB0aGUgbWVkaWNhdGlvbiAvIGNocm9uaWNcbiAgLy8gbGlzdCBlbmRwb2ludHMgcmVwb3J0ZWQgYXMgb3JpX1RZUEVfTkFNRT1cIlx1ODVFNVx1NUM0MFwiLiBJSEtFMzMwMyBpdHNlbGZcbiAgLy8gbGFja3MgdGhlIHZpc2l0LXR5cGUgZmllbGQsIHNvIHRoaXMgaXMgaG93IHdlIGNsYXNzaWZ5IHBoYXJtYWN5XG4gIC8vIHBpY2t1cCBldmVudHMgd2l0aG91dCByZXNvcnRpbmcgdG8gaG9zcGl0YWwtbmFtZSBzdHJpbmcgbWF0Y2hpbmcuXG4gIC8vIChBZGFwdGVyIHN0aWxsIHVzZXMgaG9zcGl0YWwgbmFtZSBhcyBhIGRlZmVuc2l2ZSBmYWxsYmFjayBpZiBlaXRoZXJcbiAgLy8gbWVkaWNhdGlvbiBlbmRwb2ludCBmYWlsZWQuKVxuICBjb25zdCBwaGFybWFjeVJvd0lkcyA9IG5ldyBTZXQoKTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIFtcIm1lZGljYXRpb25zXCIsIFwiY2hyb25pY19wcmVzY3JpcHRpb25zXCJdKSB7XG4gICAgY29uc3QgaWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmIChpZHggPCAwIHx8IHNldHRsZWRbaWR4XT8uc3RhdHVzICE9PSBcImZ1bGZpbGxlZFwiKSBjb250aW51ZTtcbiAgICBmb3IgKGNvbnN0IHYgb2Ygc2V0dGxlZFtpZHhdLnZhbHVlLnJhd0xpc3QgfHwgW10pIHtcbiAgICAgIGNvbnN0IGlkID0gdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEO1xuICAgICAgY29uc3Qgb3JpVHlwZU5hbWUgPSB2Lm9yaV9UWVBFX05BTUUgfHwgdi5vcmlfdHlwZV9uYW1lIHx8IFwiXCI7XG4gICAgICBpZiAoaWQgJiYgb3JpVHlwZU5hbWUuaW5jbHVkZXMoXCJcdTg1RTVcdTVDNDBcIikpIHtcbiAgICAgICAgcGhhcm1hY3lSb3dJZHMuYWRkKGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBlbmNJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJlbmNvdW50ZXJzXCIpO1xuICBpZiAoZW5jSWR4ID49IDAgJiYgc2V0dGxlZFtlbmNJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGV0YWlsTWFwID0gYXdhaXQgX3dpdGhQcm9ncmVzc1RpbWVyKFxuICAgICAgICAgIChzZWMpID0+XG4gICAgICAgICAgICBzZWMgPT09IDBcbiAgICAgICAgICAgICAgPyBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUMzMVx1OTFBQlx1N0QwMFx1OTMwNFx1OEE3M1x1NjBDNVx1MjAyNmBcbiAgICAgICAgICAgICAgOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUMzMVx1OTFBQlx1N0QwMFx1OTMwNFx1OEE3M1x1NjBDNVx1MjAyNlx1RkYwOFx1NURGMiAke3NlY30gXHU3OUQyXHVGRjA5YCxcbiAgICAgICAgICAoKSA9PiBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzIH0pLFxuICAgICAgICApO1xuICAgICAgICAvLyBSZS1hZGFwdCB3aXRoIGNsYXNzSGludCArIHNlY29uZGFyeSBkaWFnbm9zZXMgKyBiaWxpbmd1YWxcbiAgICAgICAgLy8gcHJpbWFyeSBJQ0QgYWxsIHNvdXJjZWQgZnJvbSB0aGUgUzAyIGRldGFpbCBib2R5LlxuICAgICAgICBjb25zdCByZUFkYXB0ZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aXNpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxNYXA/LmdldChpKSB8fCBudWxsO1xuICAgICAgICAgIGNvbnN0IGNscyA9IF9jbGFzc0Zyb21TMDJEZXRhaWwoZGV0YWlsKSB8fCBcIkFNQlwiO1xuICAgICAgICAgIGNvbnN0IHNlY29uZGFyeURpYWdub3NlcyA9IF9zZWNvbmRhcnlJY2RzRnJvbVMwMkRldGFpbChkZXRhaWwpO1xuICAgICAgICAgIGNvbnN0IHByaW1hcnlEaWFnbm9zaXMgPSBfcHJpbWFyeUljZEZyb21TMDJEZXRhaWwoZGV0YWlsKTtcbiAgICAgICAgICBjb25zdCB2aXNpdCA9IHZpc2l0c1tpXTtcbiAgICAgICAgICBjb25zdCByb3dJZCA9IHZpc2l0LnJvV19JRCB8fCB2aXNpdC5yb3dfaWQgfHwgdmlzaXQucm93X0lEO1xuICAgICAgICAgIGNvbnN0IGlzUGhhcm1hY3kgPSByb3dJZCA/IHBoYXJtYWN5Um93SWRzLmhhcyhyb3dJZCkgOiBmYWxzZTtcbiAgICAgICAgICBjb25zdCBpdCA9IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UodmlzaXQsIGNscywge1xuICAgICAgICAgICAgcGhhcm1hY3k6IGlzUGhhcm1hY3ksXG4gICAgICAgICAgICBwcmltYXJ5X2RpYWdub3NpczogcHJpbWFyeURpYWdub3NpcyxcbiAgICAgICAgICAgIHNlY29uZGFyeV9kaWFnbm9zZXM6IHNlY29uZGFyeURpYWdub3NlcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXQpIHJlQWRhcHRlZC5wdXNoKGl0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXR0bGVkW2VuY0lkeF0udmFsdWUuaXRlbXMgPSByZUFkYXB0ZWQ7XG4gICAgICAgIHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZUFkYXB0ZWQubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgZW5jb3VudGVyIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJlbmNvdW50ZXItZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWEnOiBpbnBhdGllbnQgZW5jb3VudGVycyBnZXQgdGhlIHNhbWUgUzAyIGRldGFpbCBlbnJpY2htZW50XG4gIC8vIGFzIElIS0UzMzAzIE9QRCBlbmNvdW50ZXJzIFx1MjAxNCBJSEtFMzMwOVMwMSBsaXN0IHNoaXBzIENoaW5lc2Utb25seVxuICAvLyBJQ0QgKyB6ZXJvIHNlY29uZGFyaWVzLCBJSEtFMzMwOVMwMiBkZXRhaWwgKGN0eXBlPTMpIHNoaXBzIGZ1bGxcbiAgLy8gYmlsaW5ndWFsIHByaW1hcnkgKyB1cCB0byAxMisgc2Vjb25kYXJ5IGRpYWdub3NlcyAoXHU0RjRGXHU5NjYyIGNhc2VzIGFyZVxuICAvLyBkaWFnbm9zdGljYWxseSByaWNoZXIgdGhhbiBPUEQpLiBXaXRob3V0IHRoaXMgZmFuLW91dCwgaW5wYXRpZW50XG4gIC8vIEZISVIgRW5jb3VudGVycyBoYXZlIENoaW5lc2Utb25seSByZWFzb25Db2RlIGRpc3BsYXkgYW5kIG5vXG4gIC8vIHNlY29uZGFyeSBkaWFnbm9zZXMgYXQgYWxsLlxuICBjb25zdCBpbnBJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJpbnBhdGllbnRcIik7XG4gIGlmIChpbnBJZHggPj0gMCAmJiBzZXR0bGVkW2lucElkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtpbnBJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkZXRhaWxNYXAgPSBhd2FpdCBfd2l0aFByb2dyZXNzVGltZXIoXG4gICAgICAgICAgKHNlYykgPT5cbiAgICAgICAgICAgIHNlYyA9PT0gMFxuICAgICAgICAgICAgICA/IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU0RjRGXHU5NjYyXHU3RDAwXHU5MzA0XHU4QTczXHU2MEM1XHUyMDI2YFxuICAgICAgICAgICAgICA6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU0RjRGXHU5NjYyXHU3RDAwXHU5MzA0XHU4QTczXHU2MEM1XHUyMDI2XHVGRjA4XHU1REYyICR7c2VjfSBcdTc5RDJcdUZGMDlgLFxuICAgICAgICAgICgpID0+IF9mZXRjaElucGF0aWVudERldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMgfSksXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHJlQWRhcHRlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpc2l0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGRldGFpbE1hcD8uZ2V0KGkpIHx8IG51bGw7XG4gICAgICAgICAgY29uc3QgcHJpbWFyeURpYWdub3NpcyA9IF9wcmltYXJ5SWNkRnJvbVMwMkRldGFpbChkZXRhaWwpO1xuICAgICAgICAgIGNvbnN0IHNlY29uZGFyeURpYWdub3NlcyA9IF9zZWNvbmRhcnlJY2RzRnJvbVMwMkRldGFpbChkZXRhaWwpO1xuICAgICAgICAgIGNvbnN0IGl0ID0gYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIodmlzaXRzW2ldLCB7XG4gICAgICAgICAgICBwcmltYXJ5X2RpYWdub3NpczogcHJpbWFyeURpYWdub3NpcyxcbiAgICAgICAgICAgIHNlY29uZGFyeV9kaWFnbm9zZXM6IHNlY29uZGFyeURpYWdub3NlcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXQpIHJlQWRhcHRlZC5wdXNoKGl0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXR0bGVkW2lucElkeF0udmFsdWUuaXRlbXMgPSByZUFkYXB0ZWQ7XG4gICAgICAgIHNldHRsZWRbaW5wSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZUFkYXB0ZWQubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgaW5wYXRpZW50IGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJpbnBhdGllbnQtZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWI6IG1lZGljYXRpb25zIG5lZWQgYSAyLXN0ZXAgZmV0Y2ggXHUyMDE0IElIS0UzMzA2UzAxIG9ubHkgcmV0dXJuc1xuICAvLyB2aXNpdCBtZXRhZGF0YSAoZGF0ZSwgSUNELCBob3NwaXRhbCksIG5vIGRydWcgbmFtZXMuIERydWdzIGxpdmUgYXRcbiAgLy8gSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiB1bmRlclxuICAvLyBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0LiBGYW4gb3V0IGRldGFpbFxuICAvLyBmZXRjaGVzIGluc2lkZSB0aGUgc2FtZSB0YWIgY29udGV4dCAoY29va2llcyArIEpXVCksIGtlZXBpbmdcbiAgLy8gY29uY3VycmVuY3kgbGltaXRlZCBzbyBOSEkgZG9lc24ndCBJRExFLXJlZGlyZWN0IHVzLlxuICAvLyBTdGVwIDFjOiBpbWFnaW5nIG5lZWRzIElIS0UzNDA4UzAyIGZvciB0aGUgYWN0dWFsIHJlcG9ydCBuYXJyYXRpdmUuXG4gIC8vIExpc3QgZW5kcG9pbnQgb25seSBoYXMgb3JkZXIgbWV0YWRhdGE7IGN0eXBlIHBhcmFtIG1pcnJvcnMgdGhlXG4gIC8vIHZpc2l0J3Mgb3JpX1RZUEUgKEEgLyBFIC8gXHUyMDI2KS5cbiAgY29uc3QgaW1nSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwiaW1hZ2luZ1wiKTtcbiAgaWYgKGltZ0lkeCA+PSAwICYmIHNldHRsZWRbaW1nSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydHMgPSBhd2FpdCBfd2l0aFByb2dyZXNzVGltZXIoXG4gICAgICAgICAgKHNlYykgPT5cbiAgICAgICAgICAgIHNlYyA9PT0gMFxuICAgICAgICAgICAgICA/IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XHU1ODMxXHU1NDRBXHUyMDI2YFxuICAgICAgICAgICAgICA6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XHU1ODMxXHU1NDRBXHUyMDI2XHVGRjA4XHU1REYyICR7c2VjfSBcdTc5RDJcdUZGMDlgLFxuICAgICAgICAgICgpID0+IF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzIH0pLFxuICAgICAgICApO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUuaXRlbXMgPSByZXBvcnRzO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVwb3J0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGltYWdpbmcgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImltYWdpbmctZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWQ6IHByb2NlZHVyZXMgbmVlZCBJSEtFMzMwOFMwMiBmb3IgdGhlIGFjdHVhbCBJQ0QtMTAtUENTXG4gIC8vIG9wX0NPREUgYW5kIHRoZSByZWFsIGV4ZWN1dGlvbiBkYXRlIChleGVfU19EQVRFIG9uIHN1Yi1saXN0XG4gIC8vIGVudHJpZXMpLiBUaGUgbGlzdCBlbmRwb2ludCBJSEtFMzMwMVMwNSBvbmx5IGV4cG9zZXMgbWV0YWRhdGE7XG4gIC8vIHdpdGhvdXQgdGhpcyBmYW4tb3V0LCBpbnBhdGllbnQgcHJvY2VkdXJlcyBnZXQgYW5jaG9yZWQgdG8gdGhlXG4gIC8vIGFkbWlzc2lvbiBkYXkgKGZ1bmNfZGF0ZSkgYW5kIGVtaXR0ZWQgd2l0aCBjb2RlOlwiXCIgKG5vIFBDUyBjb2RlKS5cbiAgY29uc3QgcHJvY0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcInByb2NlZHVyZXNcIik7XG4gIGlmIChwcm9jSWR4ID49IDAgJiYgc2V0dGxlZFtwcm9jSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW3Byb2NJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwcm9jcyA9IGF3YWl0IF93aXRoUHJvZ3Jlc3NUaW1lcihcbiAgICAgICAgICAoc2VjKSA9PlxuICAgICAgICAgICAgc2VjID09PSAwXG4gICAgICAgICAgICAgID8gYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTg2NTVcdTdGNkUvXHU2MjRCXHU4ODUzXHU4QTczXHU2MEM1XHUyMDI2YFxuICAgICAgICAgICAgICA6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1M1x1OEE3M1x1NjBDNVx1MjAyNlx1RkYwOFx1NURGMiAke3NlY30gXHU3OUQyXHVGRjA5YCxcbiAgICAgICAgICAoKSA9PiBfZmV0Y2hQcm9jZWR1cmVEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzIH0pLFxuICAgICAgICApO1xuICAgICAgICBzZXR0bGVkW3Byb2NJZHhdLnZhbHVlLml0ZW1zID0gcHJvY3M7XG4gICAgICAgIHNldHRsZWRbcHJvY0lkeF0udmFsdWUucmF3X2NvdW50ID0gcHJvY3MubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW3Byb2NJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgcHJvY2VkdXJlcyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwicHJvY2VkdXJlcy1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAxZTogY2hyb25pYyBwcmVzY3JpcHRpb25zIChJSEtFMzMwN1MwMSkuIE11c3QgcnVuIEJFRk9SRSB0aGVcbiAgLy8gcmVndWxhciBtZWRpY2F0aW9uIGZhbi1vdXQgYmVjYXVzZSB+NTIvMTI2IChvYnNlcnZlZCkgY2hyb25pYyByb3dzXG4gIC8vIHNoYXJlIHJvd19JRHMgd2l0aCByZWd1bGFyIElIS0UzMzA2UzAxIFx1MjAxNCB3ZSBjb2xsZWN0IGNocm9uaWMgSURzXG4gIC8vIGZpcnN0IGFuZCBwYXNzIHRoZW0gYXMgc2tpcFJvd0lkcyB0byB0aGUgcmVndWxhciBmYW4tb3V0IHNvIGVhY2hcbiAgLy8gcm93IGlzIGZldGNoZWQgZXhhY3RseSBvbmNlLiBDaHJvbmljIGRydWdzIGdldCBpc19jaHJvbmljPXRydWUgXHUyMTkyXG4gIC8vIE1lZGljYXRpb25SZXF1ZXN0LmNvdXJzZU9mVGhlcmFweVR5cGU9Y29udGludW91cy5cbiAgY29uc3QgY2hyb25pY1Jvd0lkcyA9IG5ldyBTZXQoKTtcbiAgY29uc3QgY2hyb25pY0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleChcbiAgICAoZSkgPT4gZS5uYW1lID09PSBcImNocm9uaWNfcHJlc2NyaXB0aW9uc1wiLFxuICApO1xuICBpZiAoY2hyb25pY0lkeCA+PSAwICYmIHNldHRsZWRbY2hyb25pY0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtjaHJvbmljSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZHJ1Z0l0ZW1zID0gYXdhaXQgX3dpdGhQcm9ncmVzc1RpbWVyKFxuICAgICAgICAgIChzZWMpID0+XG4gICAgICAgICAgICBzZWMgPT09IDBcbiAgICAgICAgICAgICAgPyBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NjE2Mlx1NjAyN1x1ODY1NVx1NjVCOVx1N0I4Qlx1MjAyNmBcbiAgICAgICAgICAgICAgOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NjE2Mlx1NjAyN1x1ODY1NVx1NjVCOVx1N0I4Qlx1MjAyNlx1RkYwOFx1NURGMiAke3NlY30gXHU3OUQyXHVGRjA5YCxcbiAgICAgICAgICAoKSA9PiBfZmV0Y2hDaHJvbmljTWVkaWNhdGlvbkRldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMgfSksXG4gICAgICAgICk7XG4gICAgICAgIHNldHRsZWRbY2hyb25pY0lkeF0udmFsdWUuaXRlbXMgPSBkcnVnSXRlbXM7XG4gICAgICAgIHNldHRsZWRbY2hyb25pY0lkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbY2hyb25pY0lkeF0udmFsdWUucmF3X2NvdW50ID0gZHJ1Z0l0ZW1zLmxlbmd0aDtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHZpc2l0cykge1xuICAgICAgICAgIGNvbnN0IGlkID0gdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEO1xuICAgICAgICAgIGlmIChpZCkgY2hyb25pY1Jvd0lkcy5hZGQoaWQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBjaHJvbmljIHByZXNjcmlwdGlvbnMgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImNocm9uaWMtZGV0YWlsXCIpO1xuXG4gIGNvbnN0IG1lZElkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcIm1lZGljYXRpb25zXCIpO1xuICBpZiAobWVkSWR4ID49IDAgJiYgc2V0dGxlZFttZWRJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcmVtYWluaW5nID0gdmlzaXRzLmZpbHRlcigodikgPT4ge1xuICAgICAgICBjb25zdCBpZCA9IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRDtcbiAgICAgICAgcmV0dXJuIGlkICYmICFjaHJvbmljUm93SWRzLmhhcyhpZCk7XG4gICAgICB9KS5sZW5ndGg7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkcnVnSXRlbXMgPSBhd2FpdCBfd2l0aFByb2dyZXNzVGltZXIoXG4gICAgICAgICAgKHNlYykgPT5cbiAgICAgICAgICAgIHNlYyA9PT0gMFxuICAgICAgICAgICAgICA/IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7cmVtYWluaW5nfSBcdTdCNDZcdTc1MjhcdTg1RTVcdTY2MEVcdTdEMzBcdTIwMjZgXG4gICAgICAgICAgICAgIDogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHtyZW1haW5pbmd9IFx1N0I0Nlx1NzUyOFx1ODVFNVx1NjYwRVx1N0QzMFx1MjAyNlx1RkYwOFx1NURGMiAke3NlY30gXHU3OUQyXHVGRjA5YCxcbiAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgX2ZldGNoTWVkaWNhdGlvbkRldGFpbHNJblRhYih7XG4gICAgICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsIHNraXBSb3dJZHM6IGNocm9uaWNSb3dJZHMsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLml0ZW1zID0gZHJ1Z0l0ZW1zO1xuICAgICAgICAvLyByYXdfY291bnQgbm93IHJlZmxlY3RzIHRoZSAqZHJ1Zy1sZXZlbCogY291bnQgZm9yIHRoZSBicmVha2Rvd25cbiAgICAgICAgLy8gKHZpc2l0cyBcdTIxOTIgZHJ1Z3MpLiBLZWVwIHRoZSB2aXNpdCBjb3VudCBpbiBhIHNpZGUgZmllbGQgZm9yIGRlYnVnLlxuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdfY291bnQgPSBkcnVnSXRlbXMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgbWVkaWNhdGlvbnMgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcIm1lZGljYXRpb24tZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMjogYWdncmVnYXRlIGl0ZW1zIGJ5IHBhZ2VfdHlwZSwgUE9TVCB0byBiYWNrZW5kLlxuICBjb25zdCBieVR5cGUgPSB7fTtcbiAgbGV0IHJhd190b3RhbCA9IDA7XG4gIGxldCBhZGFwdGVkX3RvdGFsID0gMDtcbiAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBzbyB0aGUgZmluYWwgc3RhdHVzIGNhbiB0ZWxsIHVzZXIgZXhhY3RseVxuICAvLyB3aGljaCBlbmRwb2ludHMgY2FtZSBiYWNrIGVtcHR5IC8gbWlzLXNoYXBlZCBcdTIwMTQgbXVjaCBtb3JlIHVzZWZ1bCB0aGFuXG4gIC8vIGEgc2luZ2xlIGFnZ3JlZ2F0ZWQgbnVtYmVyLlxuICAvLyBCcmVha2Rvd24gc2hvd24gdG8gdGhlIHVzZXIgdW5kZXIgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIi4gVXNlIHRoZSBDaGluZXNlIGxhYmVsXG4gIC8vIHdoZW4ga25vd247IG9ubHkgZmFsbCBiYWNrIHRvIHRoZSByYXcgZW5kcG9pbnQgbmFtZSBmb3IgdW5tYXBwZWRcbiAgLy8gKG5ld2x5IGFkZGVkKSBlbmRwb2ludHMuIEVtcHR5LXJlc3VsdCBlbmRwb2ludHMgYXJlIG9taXR0ZWQgZnJvbVxuICAvLyB0aGUgc3VjY2VzcyBzdW1tYXJ5IGVudGlyZWx5IFx1MjAxNCB0aGV5IGFkZCBub2lzZS4gRXJyb3JzIGFsd2F5cyBzaG93XG4gIC8vIHNvIHRoZSB1c2VyIGtub3dzIHNvbWV0aGluZyBkaWRuJ3QgY29tZSB0aHJvdWdoLlxuICBjb25zdCBicmVha2Rvd24gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0bGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZXAgPSBOSElfQVBJX0VORFBPSU5UU1tpXTtcbiAgICBjb25zdCBzID0gc2V0dGxlZFtpXTtcbiAgICBjb25zdCBsYWJlbCA9IEVORFBPSU5UX0xBQkVMX1pIW2VwLm5hbWVdID8/IGVwLm5hbWU7XG4gICAgaWYgKHMuc3RhdHVzID09PSBcInJlamVjdGVkXCIpIHtcbiAgICAgIGVycm9ycy5wdXNoKGAke2VwLm5hbWV9OiAke3MucmVhc29uLm1lc3NhZ2V9YCk7XG4gICAgICBicmVha2Rvd24ucHVzaChgXHUyNzRDICR7bGFiZWx9XHVGRjFBXHU1M0Q2XHU1Rjk3XHU1OTMxXHU2NTU3YCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgeyBpdGVtcywgcmF3X2NvdW50IH0gPSBzLnZhbHVlO1xuICAgIHJhd190b3RhbCArPSByYXdfY291bnQ7XG4gICAgYWRhcHRlZF90b3RhbCArPSBpdGVtcy5sZW5ndGg7XG4gICAgaWYgKHJhd19jb3VudCA9PT0gMCkgY29udGludWU7IC8vIG5vdGhpbmcgdG8gc2hvd1xuICAgIGlmIChpdGVtcy5sZW5ndGggPiByYXdfY291bnQgJiYgcmF3X2NvdW50ID4gMCkge1xuICAgICAgLy8gMS10by1tYW55IGFkYXB0ZXIgKGUuZy4gYWR1bHRfcHJldmVudGl2ZTogb25lIHNjcmVlbmluZyByb3cgXHUyMTkyXG4gICAgICAvLyB+MTggT2JzZXJ2YXRpb25zKS4gU2hvdyBib3RoIG51bWJlcnMgc28gdGhlIHVzZXIgdW5kZXJzdGFuZHNcbiAgICAgIC8vIHdoeSBvbmUgcmVjb3JkIHByb2R1Y2VkIG1hbnkuXG4gICAgICBicmVha2Rvd24ucHVzaChgJHtsYWJlbH1cdUZGMUEke3Jhd19jb3VudH0gXHU3QjQ2IFx1MjE5MiAke2l0ZW1zLmxlbmd0aH0gXHU5ODA1YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrZG93bi5wdXNoKGAke2xhYmVsfVx1RkYxQSR7aXRlbXMubGVuZ3RofSBcdTdCNDZgKTtcbiAgICB9XG4gICAgLy8gU2F2ZSBib2R5IHNhbXBsZSBmb3IgZmlyc3QgZW5kcG9pbnQgd2l0aCByYXc+MCBidXQgYWRhcHRlZD0wIChhZGFwdGVyXG4gICAgLy8gbWlzbWF0Y2gpIHNvIHdlIGNhbiBpdGVyYXRlLiBTdG9yZWQgdW5kZXIgY2hyb21lLnN0b3JhZ2UubG9jYWwgZm9yXG4gICAgLy8gaW5zcGVjdGlvbiB2aWEgc2VydmljZSB3b3JrZXIgRGV2VG9vbHMuXG4gICAgLy9cbiAgICAvLyBHQVRFRCBvbiBERUJVR19TVEFTSF9CT0RZX1NBTVBMRVM6IHRoZSBzYW1wbGUgY29udGFpbnMgcmF3IE5ISVxuICAgIC8vIFBISSAobGFiIHZhbHVlcywgZHJ1ZyBuYW1lcykgYW5kIHdlIGRvbid0IHdhbnQgaXQgc2l0dGluZyBpblxuICAgIC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIGluZGVmaW5pdGVseSBpbiB0aGUgcHVibGlzaGVkIGV4dGVuc2lvbi5cbiAgICAvLyBGbGlwIHRoZSBmbGFnIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlIHRvIHRydWUgKmxvY2FsbHkqIHdoZW5cbiAgICAvLyBkaWFnbm9zaW5nIGFkYXB0ZXIgbWlzbWF0Y2hlcy5cbiAgICBpZiAoREVCVUdfU1RBU0hfQk9EWV9TQU1QTEVTICYmIHJhd19jb3VudCA+IDAgJiYgaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgICAgIFtgX19zYW1wbGVCb2R5XyR7ZXAubmFtZX1gXTogcy52YWx1ZS5ib2R5U2FtcGxlIHx8IFwibi9hXCIsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH1cbiAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICAoYnlUeXBlW2VwLnBhZ2VfdHlwZV0gPSBieVR5cGVbZXAucGFnZV90eXBlXSB8fCBbXSkucHVzaCguLi5pdGVtcyk7XG4gIH1cblxuICAvLyBNYXNrIGdhdGUgaXMgcmVhZCBmcmVzaCBwZXIgc3luYyBcdTIwMTQgZGVmYXVsdHMgT0ZGIHBlciB0aGUgZGlzY3Vzc2lvblxuICAvLyAoY2l0aXplbi1zZWxmLWRvd25sb2FkIGRvZXNuJ3QgbmVlZCBhbm9ueW1pemF0aW9uKS4gV2hlbiBPTiwgYWxzb1xuICAvLyBzY3J1YiB0aGUgdXNlcidzIHJlYWwgbmFtZSBvdXQgb2YgYW55IE5ISSBuYXJyYXRpdmUgZmllbGQgYmVmb3JlXG4gIC8vIGl0IGZsb3dzIGludG8gdGhlIG1hcHBlci5cbiAgY29uc3QgbWFza0VuYWJsZWQgPSBhd2FpdCBfaXNNYXNrRW5hYmxlZCgpO1xuICBpZiAobWFza0VuYWJsZWQgJiYgcGF0aWVudE92ZXJyaWRlLm5hbWUpIHtcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhieVR5cGUpKSB7XG4gICAgICBieVR5cGVba2V5XSA9IF9yZXBsYWNlTmFtZURlZXAoYnlUeXBlW2tleV0sIHBhdGllbnRPdmVycmlkZS5uYW1lLCByZXBsYWNlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgbGV0IF9sb2NhbEZpbGVuYW1lID0gbnVsbDtcbiAgaWYgKG1vZGUgPT09IFwibG9jYWxcIikge1xuICAgIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbiAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogXCJcdUQ4M0VcdURERUMgXHU4RjQ5XHU2M0RCXHU3MEJBXHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHU2QTk0XHUyMDI2XCIsIHRvdGFsUmVzb3VyY2VzOiAwIH0pO1xuICAgIGxldCBidW5kbGU7XG4gICAgdHJ5IHtcbiAgICAgIGJ1bmRsZSA9IF9hc3NlbWJsZUxvY2FsQnVuZGxlKGJ5VHlwZSwgcGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3JzLnB1c2goYGxvY2FsIG1hcHBpbmc6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgYnVuZGxlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGJ1bmRsZSkge1xuICAgICAgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDQkUgXHU2RTk2XHU1MDk5ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1OENDN1x1NjU5OVx1MjAyNmAsIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubywgZGF0ZVJhbmdlKTtcbiAgICAgICAgX2xvY2FsRmlsZW5hbWUgPSBkbC5maWxlbmFtZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYHN0YXNoIGJ1bmRsZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEJ1aWxkIHRoZSBvdmVycmlkZSB3ZSBzZW5kIHRvIGJhY2tlbmQgd2l0aCB0aGUgbWF5YmUtbWFza2VkIG5hbWVcbiAgICAvLyBzbyBiYWNrZW5kJ3MgYXV0by1jcmVhdGVkIFBhdGllbnQgKyB0aGUgcGVyLWl0ZW0gc3ViamVjdC5kaXNwbGF5XG4gICAgLy8gc2VlIHRoZSBzYW1lIHZhbHVlIHRoZSB1c2VyIG9wdGVkIGludG8uIEl0ZW1zIHRoZW1zZWx2ZXMgd2VyZVxuICAgIC8vIGFscmVhZHkgc2NydWJiZWQgYWJvdmUgKGJ5VHlwZSBwYXNzKSwgc28gdGhpcyBqdXN0IGNvdmVycyB0aGVcbiAgICAvLyBvdmVycmlkZS1kZXJpdmVkIFBhdGllbnQuXG4gICAgY29uc3QgdXBsb2FkT3ZlcnJpZGUgPSBtYXNrRW5hYmxlZCAmJiBwYXRpZW50T3ZlcnJpZGUubmFtZVxuICAgICAgPyB7IC4uLnBhdGllbnRPdmVycmlkZSwgbmFtZTogbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUpIH1cbiAgICAgIDogcGF0aWVudE92ZXJyaWRlO1xuICAgIGZvciAoY29uc3QgW3BhZ2VfdHlwZSwgaXRlbXNdIG9mIE9iamVjdC5lbnRyaWVzKGJ5VHlwZSkpIHtcbiAgICAgIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHUyQjA2XHVGRTBGIFx1NEUwQVx1NTBCMyAke3BhZ2VfdHlwZX1cdUZGMDgke2l0ZW1zLmxlbmd0aH0gXHU3QjQ2XHVGRjA5XHUyMDI2YCxcbiAgICAgICAgdG90YWxSZXNvdXJjZXM6IHRvdGFsLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgX3Bvc3RTdHJ1Y3R1cmVkKGJhY2tlbmQsIHBhZ2VfdHlwZSwgaXRlbXMsIHN5bmNBcGlLZXksIHVwbG9hZE92ZXJyaWRlKTtcbiAgICAgICAgdG90YWwgKz0gZGF0YS5jb3VudCB8fCAwO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgdXBsb2FkICR7cGFnZV90eXBlfTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWZ0ZXIgYmFja2VuZCB1cGxvYWQsIGFsc28gZmV0Y2ggYSBzbmFwc2hvdCBvZiB0aGUgcGF0aWVudCdzIGZ1bGxcbiAgICAvLyBjdW11bGF0aXZlIEZISVIgQnVuZGxlIGFuZCBzdGFzaCBpdCBmb3IgdGhlIHBvcHVwJ3MgXCJcdUQ4M0RcdURDRTUgXHU0RTBCXHU4RjA5XCIgYnV0dG9uLlxuICAgIC8vIFRoaXMgaXMgd2hhdCBgL2ZoaXIvZXhwb3J0YCByZXR1cm5zIFx1MjAxNCB0aGUgYmFja2VuZCdzIGNvbXBsZXRlIHZpZXdcbiAgICAvLyBvZiB0aGlzIHBhdGllbnQgKHRoaXMgc3luYyArIGFueSBwcmlvciBzeW5jcyksIGFzIG9wcG9zZWQgdG8gbG9jYWxcbiAgICAvLyBtb2RlJ3MgXCJqdXN0IHRoaXMgc3luY1wiIGJ1bmRsZS5cbiAgICAvL1xuICAgIC8vIFNraXAgc3Rhc2hpbmcgZW50aXJlbHkgd2hlbiB0aGUgdXBsb2FkIHBhc3MgcHJvZHVjZWQgbm8gcmVzb3VyY2VzXG4gICAgLy8gXHUyMDE0IGV4cG9ydGluZyAwIGVudHJpZXMgdGhlbiBzdGFzaGluZyB0aGVtIGNyZWF0ZXMgYSBtaXNsZWFkaW5nXG4gICAgLy8gXCJcdTY3MkNcdTU3MzAgXHUyNzEzIDAgXHU3QjQ2XCIgaW5kaWNhdG9yIGFuZCBhIHVzZWxlc3MgXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCMyBidXR0b24uXG4gICAgaWYgKHBhdGllbnRPdmVycmlkZS5pZF9ubyAmJiB0b3RhbCA+IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBcIlx1RDgzRFx1RENFNiBcdTUzRDZcdTVGOTdcdTVGOENcdTdBRUZcdTVCOENcdTY1NzRcdThDQzdcdTY1OTlcdTIwMjZcIiwgdG90YWxSZXNvdXJjZXM6IHRvdGFsIH0pO1xuICAgICAgICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIGRlcml2ZVBhdGllbnRJZChyYXdJZCksIHNvIHRoZVxuICAgICAgICAvLyBleHBvcnQgZmlsdGVyIG11c3QgdXNlIHRoZSBoYXNoZWQgZm9ybSBcdTIwMTQgcXVlcnlpbmcgd2l0aCB0aGVcbiAgICAgICAgLy8gcmF3IG5hdGlvbmFsIElEIG1hdGNoZXMgemVybyByb3dzIGV2ZW4gd2hlbiBkYXRhIGlzIHRoZXJlLlxuICAgICAgICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKHBhdGllbnRPdmVycmlkZS5pZF9ubyk7XG4gICAgICAgIGNvbnN0IGV4cFVybCA9IGAke2JhY2tlbmR9L2ZoaXIvZXhwb3J0P3BhdGllbnQ9JHtlbmNvZGVVUklDb21wb25lbnQoZmhpclBpZCl9YDtcbiAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKGV4cFVybCwge1xuICAgICAgICAgIGhlYWRlcnM6IHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30sXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoci5vaykge1xuICAgICAgICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgIC8vIFBhc3MgdGhlIHNhbWUgZGF0ZVJhbmdlIHRoZSB1c2VyIHBpY2tlZCB0aHJvdWdoIHNvIHRoZVxuICAgICAgICAgIC8vIGRvd25sb2FkZWQgZmlsZW5hbWUgcmVmbGVjdHMgXCJcdTY3MDBcdThGRDEgMyBcdTVFNzRcIiBcdTIxOTIgMjAyMy0yMDI2IGluc3RlYWRcbiAgICAgICAgICAvLyBvZiBhbHdheXMgc3ludGhlc2l6aW5nIHRvZGF5LTF5IFx1MjE5MiB0b2RheS5cbiAgICAgICAgICBjb25zdCBkbCA9IGF3YWl0IF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sIGRhdGVSYW5nZSk7XG4gICAgICAgICAgX2xvY2FsRmlsZW5hbWUgPSBkbC5maWxlbmFtZTtcbiAgICAgICAgICAvLyBBbGlnbiByZXBvcnRlZCBjb3VudCB3aXRoIGxvY2FsIG1vZGU6IGJ1bmRsZS5lbnRyeS5sZW5ndGhcbiAgICAgICAgICAvLyBpbmNsdWRlcyB0aGUgUGF0aWVudCByZXNvdXJjZSAod2hpY2ggdGhlIHBlci1wYWdlLXR5cGUgUE9TVFxuICAgICAgICAgIC8vIGNvdW50cyBoYWQgcHJldmlvdXNseSBvbWl0dGVkIGJlY2F1c2UgUGF0aWVudCBpcyBhdXRvLWNyZWF0ZWRcbiAgICAgICAgICAvLyBzaWxlbnRseSBmcm9tIHBhdGllbnRfb3ZlcnJpZGUpLiBTYW1lIGRhdGEgXHUyMTkyIHNhbWUgbnVtYmVyLlxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gRGVmZW5zaXZlOiBvbmx5IE9WRVJXUklURSB0b3RhbCB3aGVuIGV4cG9ydCBhY3R1YWxseSByZXR1cm5lZFxuICAgICAgICAgIC8vIHNvbWV0aGluZy4gSWYgZXhwb3J0IHJldHVybnMgMCBlbnRyaWVzIGRlc3BpdGUgYSBzdWNjZXNzZnVsXG4gICAgICAgICAgLy8gdXBsb2FkIChjb3VsZCBoYXBwZW4gd2l0aCBhIHN0YWxlLURCIGhhc2ggbWlzbWF0Y2ggd2UgaGF2ZW4ndFxuICAgICAgICAgIC8vIGZpeGVkIHlldCksIGRvbid0IGNsb2JiZXIgdGhlIHRydXRoZnVsIHVwbG9hZCBjb3VudCBcdTIwMTQgdGhhdCdzXG4gICAgICAgICAgLy8gZXhhY3RseSB0aGUgYnVnIHRoYXQgbWFkZSBcIlx1NURGMlx1NjZGNFx1NjVCMCA4MSBcdTdCNDZcIiBzaWxlbnRseSBiZWNvbWVcbiAgICAgICAgICAvLyBcIlx1NURGMlx1NjZGNFx1NjVCMCAwIFx1N0I0NlwiLlxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJ1bmRsZS5lbnRyeSkgJiYgYnVuZGxlLmVudHJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRvdGFsID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2goYGV4cG9ydCBidW5kbGU6IEhUVFAgJHtyLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgZXhwb3J0IGJ1bmRsZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UobW9kZSA9PT0gXCJsb2NhbFwiID8gXCJhc3NlbWJsZStzdGFzaFwiIDogXCJiYWNrZW5kLXVwbG9hZFwiKTtcblxuICAvLyBGb3JtYXQgZWxhcHNlZCB3YWxsLWNsb2NrIHRpbWU6IHNlY29uZHMgKDEgZHApIGZvciBzaG9ydCBzeW5jcyxcbiAgLy8gXCJtbTpzc1wiIG9uY2Ugd2UgY3Jvc3MgdGhlIG1pbnV0ZSBtYXJrIHNvIHRoZSBwb3B1cCBzdGF0dXMgc3RheXMgcmVhZGFibGUuXG4gIGNvbnN0IF9lbGFwc2VkTXMgPSBEYXRlLm5vdygpIC0gX3QwO1xuICBjb25zdCBfZWxhcHNlZFN0ciA9IF9lbGFwc2VkTXMgPCA2MF8wMDBcbiAgICA/IGAkeyhfZWxhcHNlZE1zIC8gMTAwMCkudG9GaXhlZCgxKX1zYFxuICAgIDogYCR7TWF0aC5mbG9vcihfZWxhcHNlZE1zIC8gNjBfMDAwKX1tJHtNYXRoLnJvdW5kKChfZWxhcHNlZE1zICUgNjBfMDAwKSAvIDEwMDApfXNgO1xuICAvLyBObyBtb3JlIFwiXHU2QTk0XHU2ODQ4XHU1REYyXHU1MDk5XHU1OUE1XHUyMDI2XCIgdGFpbCBcdTIwMTQgdGhlIFx1RDgzRFx1RENFNSBkb3dubG9hZCBidXR0b24gc2l0cyByaWdodFxuICAvLyBiZWxvdyB0aGUgc3RhdHVzLCBzbyBzYXlpbmcgXCJcdTlFREVcdTRFMEJcdTY1QjlcdTYzMDlcdTkyMTVcIiBpcyBqdXN0IG5vaXNlLlxuICBjb25zdCBfbG9jYWxUYWlsID0gXCJcIjtcbiAgY29uc3QgX3N1Y2Nlc3NWZXJiID0gbW9kZSA9PT0gXCJsb2NhbFwiID8gXCJcdTVERjJcdTc1MjJcdTc1MUZcIiA6IFwiXHU1REYyXHU2NkY0XHU2NUIwXCI7XG4gIC8vIFBoYXNlIHRpbWluZ3MgKGBuaGktcGFyYWxsZWw9OHNgLCBgYmFja2VuZC11cGxvYWQ9MC44c2ApIGFyZSBkZXZcbiAgLy8gaW5mbyBcdTIwMTQgdXNlZnVsIHdoZW4gaW52ZXN0aWdhdGluZyBhIHNsb3cgc3luYyBidXQgbm9pc2UgZm9yIGFuIGVuZFxuICAvLyB1c2VyLiBLZWVwIHRoZW0sIGJ1dCB0YWcgd2l0aCB0aGUgXCJcdTIzRjFcIiBwcmVmaXggdGhlIHBvcHVwIHVzZXMgdG9cbiAgLy8gdHVjayB0aGVtIGludG8gYSBkZWVwZXIgXCJcdTYyODBcdTg4NTNcdTdEMzBcdTdCQzBcIiBzdWItdG9nZ2xlLlxuICBjb25zdCBfcGhhc2VMaW5lcyA9IF9waGFzZXMubWFwKChwKSA9PiBgXHUyM0YxICR7cC5uYW1lfT0keyhwLm1zIC8gMTAwMCkudG9GaXhlZCgxKX1zYCk7XG4gIGNvbnN0IF9mdWxsQnJlYWtkb3duID0gWy4uLmJyZWFrZG93biwgLi4uX3BoYXNlTGluZXNdO1xuXG4gIC8vIFBpY2sgdGhlIHJpZ2h0IHN1bW1hcnkgbGluZS4gWmVyby1yZXN1bHQgaXMgdGhlIHRyaWNraWVzdCBjYXNlOlxuICAvLyB3ZSBkb24ndCB3YW50IGEgZ3JlZW4gXHUyNzA1IHNheWluZyBcIjAgXHU3QjQ2XCIgYmVjYXVzZSB0aGF0IHJlYWRzIGFzXG4gIC8vIFwic3VjY2VlZGVkIHdpdGggemVybyBkYXRhXCIuIFRoYXQncyBhbG1vc3QgYWx3YXlzIG9uZSBvZjpcbiAgLy8gICAtIE5ISSBzZXNzaW9uIGV4cGlyZWQgYmV0d2VlbiB0aGUgbG9naW4gcHJvYmUgYW5kIHRoZSBzeW5jXG4gIC8vICAgICAodGhlIElIS0UzNDEwIHByb2JlIGNhbiBzdGlsbCBzdWNjZWVkIHdoaWxlIGRhdGEgZW5kcG9pbnRzXG4gIC8vICAgICByZXNwb25kIHdpdGggZW1wdHkgYXJyYXlzKTtcbiAgLy8gICAtIHRoZSB1c2VyIHRydWx5IGhhcyBubyByZWNvcmRzIGluIHRoZSBzZWxlY3RlZCBkYXRlIHJhbmdlLlxuICAvLyBFaXRoZXIgd2F5IHRoZSBhY3Rpb25hYmxlIG5leHQgc3RlcCBpcyBcIlx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NSBOSEkgXHU1MThEXHU4QTY2XHU0RTAwXHU2QjIxXCIuXG4gIGxldCBfc3VtbWFyeUxpbmU7XG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgX3N1bW1hcnlMaW5lID0gYFx1MjZBMFx1RkUwRiBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTAgXHUwMEI3ICR7X3N1Y2Nlc3NWZXJifSAke3RvdGFsfSBcdTdCNDZcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdUZGMEMke2Vycm9ycy5sZW5ndGh9IFx1OTgwNVx1NTkzMVx1NjU1N1x1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5JHtfbG9jYWxUYWlsfWA7XG4gIH0gZWxzZSBpZiAodG90YWwgPT09IDApIHtcbiAgICBfc3VtbWFyeUxpbmUgPVxuICAgICAgYFx1MjZBMFx1RkUwRiBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTBcdTRGNDZcdTZDOTJcdTYyOTNcdTUyMzBcdTRFRkJcdTRGNTVcdThDQzdcdTY1OTlcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOVx1MjAxNCBgICtcbiAgICAgIGBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0Egc2Vzc2lvbiBcdTUzRUZcdTgwRkRcdTkwNEVcdTY3MUZcdUZGMENcdThBQ0JcdTU2REVcdThBNzJcdTUyMDZcdTk4MDFcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcdUZGMUJcdTYyMTZcdTYyQzlcdTk1NzdcdTMwMENcdTY1RTVcdTY3MUZcdTdCQzRcdTU3MERcdTMwMERcdTUxOERcdThBNjZcdTMwMDJgO1xuICB9IGVsc2Uge1xuICAgIF9zdW1tYXJ5TGluZSA9IGBcdTI3MDUgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyAke19zdWNjZXNzVmVyYn0gJHt0b3RhbH0gXHU3QjQ2XHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDkke19sb2NhbFRhaWx9YDtcbiAgfVxuXG4gIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgcnVubmluZzogZmFsc2UsXG4gICAgcHJvZ3Jlc3M6IF9zdW1tYXJ5TGluZSxcbiAgICBwaGFzZTogXCJkb25lXCIsXG4gICAgdG90YWxSZXNvdXJjZXM6IHRvdGFsLFxuICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICBlbGFwc2VkTXM6IF9lbGFwc2VkTXMsXG4gICAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBmb3IgdGhlIHBvcHVwJ3MgJ1x1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMCcgY29sbGFwc2libGUuXG4gICAgLy8gS2VlcCBhcyBhIHBsYWluIGFycmF5IHNvIHBvcHVwLmpzIGNhbiByZW5kZXIgd2l0aCBET00gQVBJIChub1xuICAgIC8vIGlubmVySFRNTCAvIG5vIGVzY2FwaW5nIGNvbmNlcm5zKS4gSXRlbXMgbG9vayBsaWtlXG4gICAgLy8gJ2VuY291bnRlcnM9MTIvMTInIG9yICdhZHVsdF9wcmV2ZW50aXZlPTIgcm93cyBcdTIxOTIgMzYgb2JzJy5cbiAgICBicmVha2Rvd246IF9mdWxsQnJlYWtkb3duLFxuICAgIGVycm9ycyxcbiAgICBoaXN0bm86IHBhdGllbnRPdmVycmlkZS5pZF9ubyxcbiAgICBtb2RlLFxuICAgIGxvY2FsRmlsZW5hbWU6IF9sb2NhbEZpbGVuYW1lLFxuICB9KTtcblxuICAvLyBCZXN0LWVmZm9ydDogd3JpdGUgYSBTeW5jIEhpc3Rvcnkgcm93IHRvIHRoZSBiYWNrZW5kIHNvIHRoZSBkYXNoYm9hcmRcbiAgLy8gY2FuIHNob3cgd2hlbi93aG8vaG93LWxvbmcvd2hhdC9yYW5nZS4gU2tpcHBlZCBpbiBsb2NhbCBtb2RlICh0aGVyZVxuICAvLyBpcyBubyBiYWNrZW5kKS4gV3JhcHBlZCArIHN3YWxsb3dlZCBzbyBhIGxvZ2dpbmcgZmFpbHVyZSBuZXZlclxuICAvLyBwcm9wYWdhdGVzIGJhY2sgdG8gdGhlIHVzZXItZmFjaW5nIHN5bmMgc3RhdHVzLlxuICBpZiAobW9kZSAhPT0gXCJsb2NhbFwiKSB0cnkge1xuICAgIGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3N5bmMvbG9nYCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIC4uLihzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9KSxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHN0YXR1czogZXJyb3JzLmxlbmd0aCA/IFwicGFydGlhbFwiIDogXCJzdWNjZXNzXCIsXG4gICAgICAgIHBhdGllbnRfaWQ6IHBhdGllbnRPdmVycmlkZS5pZF9ubyB8fCBcIlwiLFxuICAgICAgICAvLyAvc3luYy9sb2cgbGFuZHMgaW4gdGhlIGRhc2hib2FyZCdzIHN5bmMtaGlzdG9yeSByb3cuIE9ubHlcbiAgICAgICAgLy8gbWFzayB3aGVuIHRoZSB1c2VyIGhhcyBvcHRlZCBpbiBcdTIwMTQgb3RoZXJ3aXNlIGRhc2hib2FyZCBzZWVzXG4gICAgICAgIC8vIHRoZSByYXcgbmFtZSB0aGV5IHR5cGVkIChjb25zaXN0ZW50IHdpdGggXCJcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjhcIiBkZWZhdWx0KS5cbiAgICAgICAgcGF0aWVudF9uYW1lOiBtYXNrRW5hYmxlZFxuICAgICAgICAgID8gbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIilcbiAgICAgICAgICA6IHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCIsXG4gICAgICAgIHRvdGFsLFxuICAgICAgICBicmVha2Rvd24sXG4gICAgICAgIGRhdGVfcmFuZ2U6IGRhdGVSYW5nZUxhYmVsIHx8IFwiXCIsXG4gICAgICAgIGVsYXBzZWRfbXM6IF9lbGFwc2VkTXMsXG4gICAgICAgIHN0YXJ0ZWRfYXQ6IG5ldyBEYXRlKF90MCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgZXJyb3JzLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIGZhaWxlZCB0byB3cml0ZSBoaXN0b3J5IGxvZzpcIiwgZSk7XG4gIH1cbiAgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xufVxuXG4vLyBPbmUtdGltZSBtaWdyYXRpb24gZnJvbSBjaHJvbWUuc3RvcmFnZS5zeW5jIFx1MjE5MiBjaHJvbWUuc3RvcmFnZS5sb2NhbC5cbi8vIFByZXZpb3VzIHZlcnNpb25zIHN0b3JlZCBzeW5jQXBpS2V5ICsgcGF0aWVudE92ZXJyaWRlIChjb250YWluaW5nIHRoZVxuLy8gbmF0aW9uYWwgSUQpIHVuZGVyIC5zeW5jLCB3aGljaCBDaHJvbWUgcmVwbGljYXRlcyB0byB0aGUgdXNlcidzIEdvb2dsZVxuLy8gYWNjb3VudCBhbmQgcHVzaGVzIHRvIGV2ZXJ5IGRldmljZSB0aGV5IHNpZ24gaW50by4gTW92ZSBldmVyeXRoaW5nXG4vLyBzZXR0aW5ncy1yZWxhdGVkIHRvIC5sb2NhbDsgY2xlYXIgdGhlIHN5bmMgY29weS5cbmNvbnN0IFNZTkNfS0VZU19UT19NSUdSQVRFID0gW1xuICBcImJhY2tlbmRVcmxcIixcbiAgXCJzeW5jQXBpS2V5XCIsXG4gIFwic21hcnRBcHBMYXVuY2hVcmxcIixcbiAgXCJwYXRpZW50T3ZlcnJpZGVcIixcbiAgXCJzeW5jTW9kZVwiLFxuICBcIm1hc2tOYW1lRW5hYmxlZFwiLFxuXTtcblxuYXN5bmMgZnVuY3Rpb24gbWlncmF0ZVN5bmNUb0xvY2FsKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHN5bmNlZCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFNZTkNfS0VZU19UT19NSUdSQVRFKTtcbiAgICBjb25zdCBwcmVzZW50ID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgT2JqZWN0LmVudHJpZXMoc3luY2VkKS5maWx0ZXIoKFssIHZdKSA9PiB2ICE9PSB1bmRlZmluZWQpLFxuICAgICk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHByZXNlbnQpLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IGxvY2FsID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KE9iamVjdC5rZXlzKHByZXNlbnQpKTtcbiAgICAvLyBEb24ndCBvdmVyd3JpdGUgYW55dGhpbmcgdGhlIHVzZXIgYWxyZWFkeSBzZXQgb24gdGhpcyBtYWNoaW5lLlxuICAgIGNvbnN0IHRvV3JpdGUgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhwcmVzZW50KS5maWx0ZXIoKFtrXSkgPT4gbG9jYWxba10gPT09IHVuZGVmaW5lZCksXG4gICAgKTtcbiAgICBpZiAoT2JqZWN0LmtleXModG9Xcml0ZSkubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHRvV3JpdGUpO1xuICAgIH1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLnJlbW92ZShPYmplY3Qua2V5cyhwcmVzZW50KSk7XG4gIH0gY2F0Y2gge1xuICAgIC8vIE1pZ3JhdGlvbiBpcyBiZXN0LWVmZm9ydC4gVGhlIG5leHQgcnVuIGdldHMgdG8gdHJ5IGFnYWluLlxuICB9XG59XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGFzeW5jICgpID0+IHtcbiAgYXdhaXQgbWlncmF0ZVN5bmNUb0xvY2FsKCk7XG4gIC8vIFNlY3VyaXR5IGF1ZGl0ICM1IGNsZWFudXA6IHVzZXJzIHVwZ3JhZGluZyBmcm9tIDw9IHYwLjguNyBtYXkgaGF2ZVxuICAvLyBhIGBwZW5kaW5nRmhpckJ1bmRsZWAgKGVudGlyZSBGSElSIEJ1bmRsZSBKU09OKSBhbmQvb3JcbiAgLy8gYF9fc2FtcGxlQm9keV8qYCBlbnRyaWVzIChyYXcgTkhJIHBheWxvYWQpIHNpdHRpbmcgaW5cbiAgLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwgZnJvbSBwcmV2aW91cyBpbnN0YWxscy4gVGhlIG5ldyB2ZXJzaW9uIHVzZXNcbiAgLy8gY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbiBmb3IgdGhlIHBlbmRpbmcgYnVuZGxlIGFuZCBnYXRlcyB0aGUgYm9keVxuICAvLyBzYW1wbGVzIGJlaGluZCBhIGRlYnVnIGZsYWcgXHUyMDE0IHNvIHRob3NlIGxvY2FsIGVudHJpZXMgYXJlIG5vdyBwdXJlXG4gIC8vIFBISSBkZWFkIHdlaWdodC4gU3dlZXAgdGhlbSBvbiBldmVyeSBpbnN0YWxsL3VwZGF0ZS5cbiAgdHJ5IHtcbiAgICBjb25zdCBhbGwgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQobnVsbCk7XG4gICAgY29uc3Qgc3RhbGUgPSBPYmplY3Qua2V5cyhhbGwpLmZpbHRlcihcbiAgICAgIChrKSA9PiBrID09PSBcInBlbmRpbmdGaGlyQnVuZGxlXCIgfHwgay5zdGFydHNXaXRoKFwiX19zYW1wbGVCb2R5X1wiKSxcbiAgICApO1xuICAgIGlmIChzdGFsZS5sZW5ndGgpIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShzdGFsZSk7XG4gIH0gY2F0Y2gge31cbn0pO1xuXG4vLyBBbHNvIHJ1biBtaWdyYXRpb24gb24gc2VydmljZS13b3JrZXIgd2FrZS11cCAoY292ZXJzIHJlbG9hZC9yZXN0YXJ0XG4vLyBwYXRocyB3aGVyZSBvbkluc3RhbGxlZCBkb2Vzbid0IGZpcmUpLlxuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwPy5hZGRMaXN0ZW5lcj8uKCgpID0+IHtcbiAgbWlncmF0ZVN5bmNUb0xvY2FsKCk7XG59KTtcbm1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZywgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgLy8gU2VjdXJpdHkgYXVkaXQgIzY6IG9ubHkgYWNjZXB0IG1lc3NhZ2VzIG9yaWdpbmF0aW5nIGZyb20gVEhJU1xuICAvLyBleHRlbnNpb24uIHNlbmRlci5pZCBpcyBwb3B1bGF0ZWQgZm9yIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlXG4gIC8vIGNhbGxzOyBhbiB1bnJlbGF0ZWQgZXh0ZW5zaW9uIGNhbGxpbmcgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoXG4gIC8vIG15RXh0SWQsIFx1MjAyNikgd291bGQgaGF2ZSBpdHMgb3duIGlkIGFuZCBiZSBkcm9wcGVkIHNpbGVudGx5LiBXaXRob3V0XG4gIC8vIHRoaXMgY2hlY2ssIGFueSBvdGhlciBleHRlbnNpb24gdGhlIHVzZXIgaW5zdGFsbHMgY291bGQgdHJpZ2dlciBhXG4gIC8vIHN5bmMgYXQgYW4gYXR0YWNrZXItY2hvc2VuIGJhY2tlbmQgVVJMIHdpdGggYXR0YWNrZXItc3VwcGxpZWQgQVBJXG4gIC8vIGtleSwgZmFubmluZyBvdXQgdGhlIE5ISSB0YWIncyBQSEkgdGhyb3VnaCBvdXIgcGlwZWxpbmUuXG4gIC8vIChtc2cuc2VuZGVyLmlkIGlzIHVuZGVmaW5lZCBmb3IgbmF0aXZlLWFwcCBtZXNzYWdlcyBcdTIwMTQgd2UgZG9uJ3QgdXNlXG4gIC8vIHRob3NlLCBzbyB3ZSB0cmVhdCB1bmRlZmluZWQgYXMgZm9yZWlnbiBhbmQgcmVqZWN0LilcbiAgaWYgKHNlbmRlcj8uaWQgIT09IGNocm9tZS5ydW50aW1lLmlkKSByZXR1cm47XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3RhcnROaGlBcGlTeW5jXCIpIHtcbiAgICBydW5OaGlBcGlTeW5jKG1zZy5wYXlsb2FkKS50aGVuKFxuICAgICAgKCkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICAgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgaWYgKGU/Lm1lc3NhZ2UgPT09IENBTkNFTF9FUlJPUikge1xuICAgICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlLCBjYW5jZWxsZWQ6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGU/Lm1lc3NhZ2UgPT09IFNFU1NJT05fRVhQSVJFRF9FUlJPUikge1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdUQ4M0RcdUREMTIgTkhJIHNlc3Npb24gXHU1REYyXHU3NjdCXHU1MUZBIFx1MjAxNCBcdThBQ0JcdTU3MjggTkhJIHRhYiBcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcdTVGOENcdTUxOERcdTlFREUgU3luY1wiLFxuICAgICAgICAgICAgICBwaGFzZTogXCJzZXNzaW9uX2V4cGlyZWRcIixcbiAgICAgICAgICAgICAgdHM6IERhdGUubm93KCksIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBleHBpcmVkOiB0cnVlIH0pOyB9IGNhdGNoIHt9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJydW5OaGlBcGlTeW5jIGZhaWxlZFwiLCBlKTtcbiAgICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcnVubmluZzogZmFsc2UsIHByb2dyZXNzOiBgXHUyNzRDICR7ZS5tZXNzYWdlfWAsIHBoYXNlOiBcImVycm9yXCIgfSk7XG4gICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiBmYWxzZSwgZXJyb3I6IGUubWVzc2FnZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3RvcFN5bmNcIikge1xuICAgIC8vIFNldCB0aGUgY2FuY2VsbGF0aW9uIGZsYWc7IHRoZSBpbi1mbGlnaHQgc3luYyB3aWxsIHRocm93XG4gICAgLy8gQ0FOQ0VMX0VSUk9SIGF0IGl0cyBuZXh0IGNoZWNrQ2FuY2VsKCkgY2FsbC4gIFN0b3JhZ2UgaXMgYWxyZWFkeVxuICAgIC8vIHVwZGF0ZWQgYnkgdGhlIHBvcHVwLCBzbyB3ZSBkb24ndCB0b3VjaCBpdCBoZXJlLlxuICAgIF9jYW5jZWxsZWQgPSB0cnVlO1xuICAgIC8vIERpc2NhcmQgYW55IHBhcnRpYWwgZGF0YSB1cGxvYWRlZCBzbyBmYXIuIFRoZSB1c2VyJ3Mgc3RhdGVkXG4gICAgLy8gY29udHJhY3QgaXMgJ3N0b3AgPSBhYm9ydCwgSSdsbCByZXN5bmMgZnJvbSBzY3JhdGNoIGxhdGVyJyBcdTIwMTQgd2VcbiAgICAvLyBkb24ndCB3YW50IHRvIGxlYXZlIGEgaGFsZi1sb2FkZWQgcGF0aWVudCBpbiB0aGUgRkhJUiBzdG9yZSB0aGF0XG4gICAgLy8gbG9va3MgY29tcGxldGUgdG8gZG93bnN0cmVhbSBTTUFSVCBhcHBzLlxuICAgIGNvbnN0IGN0eCA9IF9hY3RpdmVTeW5jQ3R4O1xuICAgIGlmIChjdHg/LnBhdGllbnRJZCAmJiBjdHguYmFja2VuZCkge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIGRlcml2ZVBhdGllbnRJZChyYXdJZCksIHNvIHRoZVxuICAgICAgICAgIC8vIERFTEVURSBwYXRoIG11c3QgdXNlIHRoZSBoYXNoZWQgZm9ybSBcdTIwMTQgc2VuZGluZyB0aGUgcmF3IElEXG4gICAgICAgICAgLy8gbWF0Y2hlcyBub3RoaW5nIGFuZCBsZWF2ZXMgdGhlIHBhcnRpYWwgdXBsb2FkIGluIHRoZSBzdG9yZS5cbiAgICAgICAgICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKGN0eC5wYXRpZW50SWQpO1xuICAgICAgICAgIGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYCR7Y3R4LmJhY2tlbmR9L3N5bmMvcGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IGN0eC5zeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGN0eC5zeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBTdXJmYWNlIHRoZSB3aXBlIGluIHRoZSBzdGF0dXMgc28gdXNlciBzZWVzIGl0IGFjdHVhbGx5IGhhcHBlbmVkLlxuICAgICAgICAgIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBbU1RPUkFHRV9LRVldOiB7XG4gICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1REYyXHU1MDVDXHU2QjYyXHU0RTI2XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBjYW5jZWwgd2lwZSBmYWlsZWQ6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG4gICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImdldFN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkudGhlbigoZGF0YSkgPT4gc2VuZFJlc3BvbnNlKGRhdGFbU1RPUkFHRV9LRVldIHx8IG51bGwpKTtcbiAgICByZXR1cm4gdHJ1ZTsgIC8vIGFzeW5jIHJlc3BvbnNlXG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjbGVhclN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShTVE9SQUdFX0tFWSkudGhlbigoKSA9PiBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjaGVja05oaUxvZ2luXCIpIHtcbiAgICBfY2hlY2tOaGlMb2dpblN0YXRlKG1zZy50YWJJZCkudGhlbihcbiAgICAgIChzdGF0ZSkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogc3RhdGUgfSk7IH0gY2F0Y2gge30gfSxcbiAgICAgICgpID0+IHsgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgbG9nZ2VkSW46IG51bGwgfSk7IH0gY2F0Y2gge30gfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcblxuLy8gQmVsdC1hbmQtc3VzcGVuZGVycyBTVyBrZWVwYWxpdmU6IGFuIGFsYXJtIGV2ZXJ5IDIwIHMgd2FrZXMgdGhlIFNXIGlmXG4vLyBpZGxlLiBDb21iaW5lZCB3aXRoIHRoZSByZXR1cm4tdHJ1ZSBwYXR0ZXJuIGFib3ZlLCB0aGlzIHByZXZlbnRzIHRoZVxuLy8gMzAgcyBpZGxlIHNodXRkb3duIGZyb20gZW5kaW5nIGFuIGluLXByb2dyZXNzIHN5bmMuXG5jaHJvbWUuYWxhcm1zLmNyZWF0ZShcInN3LWtlZXBhbGl2ZVwiLCB7IHBlcmlvZEluTWludXRlczogMC4zNCB9KTtcblxuLy8gUEhJIFRUTCBzd2VlcCAoc2VjdXJpdHkgYXVkaXQgIzUpOiBldmVuIHRob3VnaCBwZW5kaW5nRmhpckJ1bmRsZSBub3dcbi8vIGxpdmVzIGluIGNocm9tZS5zdG9yYWdlLnNlc3Npb24gKGF1dG8tY2xlYXJlZCBvbiBicm93c2VyIGNsb3NlKSBhbmRcbi8vIGRvd25sb2FkUGVuZGluZ0J1bmRsZSB3aXBlcyBpdCBvbiB1c2VyLWluaXRpYXRlZCBzYXZlLCBhIHVzZXIgd2hvXG4vLyBjb21wbGV0ZXMgYSBzeW5jIGFuZCB0aGVuIGxlYXZlcyB0aGUgYnJvd3NlciBvcGVuIGZvciBob3VycyB3aXRob3V0XG4vLyBkb3dubG9hZGluZyB3b3VsZCBzdGlsbCBoYXZlIGFuIGluLW1lbW9yeSBjb3B5IGxpbmdlcmluZy4gVGhlIDEwLW1pblxuLy8gYWxhcm0gY2hlY2tzIHRoZSBzdGFzaCdzIGFnZSBhbmQgZHJvcHMgaXQgb25jZSBpdCBleGNlZWRzXG4vLyBQRU5ESU5HX0JVTkRMRV9UVExfTVMgKDEgaG91cikuXG5jaHJvbWUuYWxhcm1zLmNyZWF0ZShQRU5ESU5HX0JVTkRMRV9TV0VFUF9BTEFSTSwgeyBwZXJpb2RJbk1pbnV0ZXM6IDEwIH0pO1xuXG5hc3luYyBmdW5jdGlvbiBfc3dlZXBQZW5kaW5nQnVuZGxlSWZTdGFsZSgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IFtQRU5ESU5HX0JVTkRMRV9LRVldOiBwZW5kaW5nIH0gPVxuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5nZXQoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgICBpZiAoIXBlbmRpbmcpIHJldHVybjtcbiAgICBjb25zdCBhZ2UgPSBEYXRlLm5vdygpIC0gKHBlbmRpbmcuZ2VuZXJhdGVkQXQgfHwgMCk7XG4gICAgaWYgKGFnZSA+IFBFTkRJTkdfQlVORExFX1RUTF9NUykge1xuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5yZW1vdmUoUEVORElOR19CVU5ETEVfS0VZKTtcbiAgICB9XG4gIH0gY2F0Y2gge31cbn1cblxuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKChhbGFybSkgPT4ge1xuICBpZiAoYWxhcm0ubmFtZSA9PT0gUEVORElOR19CVU5ETEVfU1dFRVBfQUxBUk0pIHtcbiAgICBfc3dlZXBQZW5kaW5nQnVuZGxlSWZTdGFsZSgpO1xuICB9XG4gIC8vIHN3LWtlZXBhbGl2ZSBpcyBhIG5vLW9wOyB0aGUgYWxhcm0gZmly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QU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFP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QU87QUFBQSxFQUNUOzs7QUNyUk8sTUFBTSxlQUF1QztBQUFBO0FBQUEsSUFFbEQsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1WLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFVVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFjVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTVYsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFZVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBUVYsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQWdCWjtB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YTtBQUFBO0FBQUEsRUFDZjtBQVFPLE1BQU0sZ0JBQXdDO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJbkQsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFXWCxXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBRVYsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUNFO0FBQUEsSUFDRixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7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QVEsS0FBSyxrQ0FBa0MsQ0FBQztBQUFBLFVBQ2xEO0FBQUEsUUFDRixHQUFHO0FBQUEsTUFDTDtBQUNBLHVCQUFpQjtBQUNqQixVQUFJO0FBQUUscUJBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQztBQUFBLE1BQUcsUUFBUTtBQUFBLE1BQUM7QUFDM0MsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxpQkFBaUI7QUFDakMsYUFBTyxRQUFRLE1BQU0sSUFBSSxXQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsYUFBYSxLQUFLLFdBQVcsS0FBSyxJQUFJLENBQUM7QUFDNUYsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxtQkFBbUI7QUFDbkMsYUFBTyxRQUFRLE1BQU0sT0FBTyxXQUFXLEVBQUUsS0FBSyxNQUFNLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDO0FBQzlFLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsaUJBQWlCO0FBQ2pDLDBCQUFvQixJQUFJLEtBQUssRUFBRTtBQUFBLFFBQzdCLENBQUMsVUFBVTtBQUFFLGNBQUk7QUFBRSx5QkFBYSxFQUFFLFVBQVUsTUFBTSxDQUFDO0FBQUEsVUFBRyxRQUFRO0FBQUEsVUFBQztBQUFBLFFBQUU7QUFBQSxRQUNqRSxNQUFNO0FBQUUsY0FBSTtBQUFFLHlCQUFhLEVBQUUsVUFBVSxLQUFLLENBQUM7QUFBQSxVQUFHLFFBQVE7QUFBQSxVQUFDO0FBQUEsUUFBRTtBQUFBLE1BQzdEO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGLENBQUM7QUFLRCxTQUFPLE9BQU8sT0FBTyxnQkFBZ0IsRUFBRSxpQkFBaUIsS0FBSyxDQUFDO0FBUzlELFNBQU8sT0FBTyxPQUFPLDRCQUE0QixFQUFFLGlCQUFpQixHQUFHLENBQUM7QUFFeEUsaUJBQWUsNkJBQTZCO0FBQzFDLFFBQUk7QUFDRixZQUFNLEVBQUUsQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLElBQ3BDLE1BQU0sT0FBTyxRQUFRLFFBQVEsSUFBSSxrQkFBa0I7QUFDckQsVUFBSSxDQUFDLFFBQVM7QUFDZCxZQUFNLE1BQU0sS0FBSyxJQUFJLEtBQUssUUFBUSxlQUFlO0FBQ2pELFVBQUksTUFBTSx1QkFBdUI7QUFDL0IsY0FBTSxPQUFPLFFBQVEsUUFBUSxPQUFPLGtCQUFrQjtBQUFBLE1BQ3hEO0FBQUEsSUFDRixRQUFRO0FBQUEsSUFBQztBQUFBLEVBQ1g7QUFFQSxTQUFPLE9BQU8sUUFBUSxZQUFZLENBQUMsVUFBVTtBQUMzQyxRQUFJLE1BQU0sU0FBUyw0QkFBNEI7QUFDN0MsaUNBQTJCO0FBQUEsSUFDN0I7QUFBQSxFQUVGLENBQUM7IiwKICAibmFtZXMiOiBbIkJ1ZmZlciIsICJibG9ja3MiLCAiZXhwb3J0cyIsICJtYXBTeXN0ZW0iLCAiZXNjYXBlUmVnZXgiLCAiaGl0IiwgImNqa0NoYXJzIiwgIm9ic0lkIiwgIm1hcFN5c3RlbSIsICJyIl0KfQo=
