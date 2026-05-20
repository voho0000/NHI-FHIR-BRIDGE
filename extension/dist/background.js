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
      resource.reasonCode = [rc];
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
  function adaptInpatientEncounter(item) {
    if (!item || typeof item !== "object") return null;
    const start = rocToISO(item.in_DATE || item.func_DATE || "");
    const end = rocToISO(item.out_DATE || "");
    if (!start) return null;
    const icdCode = item.icd9cm_CODE || item.icd9cm_code || "";
    const rawIcdName = item.icd9cm_CODE_CNAME || item.icd9cm_name || "";
    const stripIcdPrefix = (s) => s.replace(/^[A-Z0-9.]+\/\s*/, "");
    const icdName = stripIcdPrefix(pickEnglish(rawIcdName));
    const icdName_zh = stripIcdPrefix(pickChinese(rawIcdName));
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
      hospital: item.hosp_ABBR || item.hosp_abbr || "",
      row_id: item.row_ID || item.row_id || ""
    };
  }
  function adaptEncounterFromMedExpense(item, classHint, options) {
    if (!item || typeof item !== "object") return null;
    const date = rocToISO(item.funC_DATE || item.func_DATE || item.func_date || "");
    if (!date) return null;
    const icdCode = item.icD9CM_CODE || item.icd9cm_CODE || item.icd9cm_code || "";
    const stripIcdPrefix = (s) => s.replace(/^[A-Z0-9.]+\/\s*/, "");
    const rawIcdName = item.icD9CM_CODE_CNAME || item.icd9cm_CODE_CNAME || item.icd9cm_name || "";
    const icdName = stripIcdPrefix(pickEnglish(rawIcdName));
    const icdName_zh = stripIcdPrefix(pickChinese(rawIcdName));
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
      hospital,
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
            const visit = visits[i];
            const rowId = visit.roW_ID || visit.row_id || visit.row_ID;
            const isPharmacy = rowId ? pharmacyRowIds.has(rowId) : false;
            const it = adaptEncounterFromMedExpense(visit, cls, {
              pharmacy: isPharmacy
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
    const procIdx = NHI_API_ENDPOINTS.findIndex((e) => e.name === "procedures");
    if (procIdx >= 0 && settled[procIdx].status === "fulfilled") {
      const visits = settled[procIdx].value.rawList || [];
      if (visits.length > 0) {
        await setStatus({
          progress: `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u8655\u7F6E/\u624B\u8853\u8A73\u60C5\u2026`
        });
        try {
          const procs = await _fetchProcedureDetailsInTab({
            tabId,
            baseUrl: BASE,
            visits
          });
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
        await setStatus({
          progress: `\u{1F4E5} \u53D6\u5F97 ${visits.length} \u7B46\u6162\u6027\u8655\u65B9\u7B8B\u2026`
        });
        try {
          const drugItems = await _fetchChronicMedicationDetailsInTab({
            tabId,
            baseUrl: BASE,
            visits
          });
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
        await setStatus({
          progress: `\u{1F4E5} \u53D6\u5F97 ${remaining} \u7B46\u7528\u85E5\u660E\u7D30\u2026`
        });
        try {
          const drugItems = await _fetchMedicationDetailsInTab({
            tabId,
            baseUrl: BASE,
            visits,
            skipRowIds: chronicRowIds
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9uaGktYWRhcHRlcnMuanMiLCAiLi4vc3JjL25oaS1lbmRwb2ludHMuanMiLCAiLi4vc3JjL2JhY2tncm91bmQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG4gKiBbanMtc2hhMV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1zaGExfVxuICpcbiAqIEB2ZXJzaW9uIDAuNy4wXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMjRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4vKmpzbGludCBiaXR3aXNlOiB0cnVlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgSU5QVVRfRVJST1IgPSAnaW5wdXQgaXMgaW52YWxpZCB0eXBlJztcbiAgdmFyIEZJTkFMSVpFX0VSUk9SID0gJ2ZpbmFsaXplIGFscmVhZHkgY2FsbGVkJztcbiAgdmFyIFdJTkRPVyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnO1xuICB2YXIgcm9vdCA9IFdJTkRPVyA/IHdpbmRvdyA6IHt9O1xuICBpZiAocm9vdC5KU19TSEExX05PX1dJTkRPVykge1xuICAgIFdJTkRPVyA9IGZhbHNlO1xuICB9XG4gIHZhciBXRUJfV09SS0VSID0gIVdJTkRPVyAmJiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCc7XG4gIHZhciBOT0RFX0pTID0gIXJvb3QuSlNfU0hBMV9OT19OT0RFX0pTICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgaWYgKE5PREVfSlMpIHtcbiAgICByb290ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFdFQl9XT1JLRVIpIHtcbiAgICByb290ID0gc2VsZjtcbiAgfVxuICB2YXIgQ09NTU9OX0pTID0gIXJvb3QuSlNfU0hBMV9OT19DT01NT05fSlMgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHM7XG4gIHZhciBBTUQgPSB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQ7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAhcm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUiAmJiB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcbiAgdmFyIEVYVFJBID0gWy0yMTQ3NDgzNjQ4LCA4Mzg4NjA4LCAzMjc2OCwgMTI4XTtcbiAgdmFyIFNISUZUID0gWzI0LCAxNiwgOCwgMF07XG4gIHZhciBPVVRQVVRfVFlQRVMgPSBbJ2hleCcsICdhcnJheScsICdkaWdlc3QnLCAnYXJyYXlCdWZmZXInXTtcblxuICB2YXIgYmxvY2tzID0gW107XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICBpZiAocm9vdC5KU19TSEExX05PX05PREVfSlMgfHwgIWlzQXJyYXkpIHtcbiAgICBpc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3O1xuICBpZiAoQVJSQVlfQlVGRkVSICYmIChyb290LkpTX1NIQTFfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgfHwgIWlzVmlldykpIHtcbiAgICBpc1ZpZXcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmJ1ZmZlciAmJiBvYmouYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcjtcbiAgICB9O1xuICB9XG5cbiAgLy8gW21lc3NhZ2U6IHN0cmluZywgaXNTdHJpbmc6IGJvb2xdXG4gIHZhciBmb3JtYXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXNzYWdlO1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIFttZXNzYWdlLCB0cnVlXTtcbiAgICB9XG4gICAgaWYgKHR5cGUgIT09ICdvYmplY3QnIHx8IG1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChBUlJBWV9CVUZGRVIgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBbbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSksIGZhbHNlXTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KG1lc3NhZ2UpICYmICFpc1ZpZXcobWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGNyZWF0ZU91dHB1dE1ldGhvZCA9IGZ1bmN0aW9uIChvdXRwdXRUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IFNoYTEodHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2QgPSBjcmVhdGVPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIGlmIChOT0RFX0pTKSB7XG4gICAgICBtZXRob2QgPSBub2RlV3JhcChtZXRob2QpO1xuICAgIH1cbiAgICBtZXRob2QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKCk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuY3JlYXRlKCkudXBkYXRlKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPVVRQVVRfVFlQRVMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0eXBlID0gT1VUUFVUX1RZUEVTW2ldO1xuICAgICAgbWV0aG9kW3R5cGVdID0gY3JlYXRlT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIHZhciBub2RlV3JhcCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgICB2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgIHZhciBidWZmZXJGcm9tO1xuICAgIGlmIChCdWZmZXIuZnJvbSAmJiAhcm9vdC5KU19TSEExX05PX0JVRkZFUl9GUk9NKSB7XG4gICAgICBidWZmZXJGcm9tID0gQnVmZmVyLmZyb207XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlckZyb20gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihtZXNzYWdlKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBub2RlTWV0aG9kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKG1lc3NhZ2UsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSBudWxsIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG1lc3NhZ2UpIHx8IGlzVmlldyhtZXNzYWdlKSB8fFxuICAgICAgICBtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ1ZmZlckZyb20obWVzc2FnZSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGVNZXRob2Q7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSwgdHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlSG1hY01ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlSG1hY091dHB1dE1ldGhvZCgnaGV4Jyk7XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgSG1hY1NoYTEoa2V5KTtcbiAgICB9O1xuICAgIG1ldGhvZC51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZShrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QodHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRob2Q7XG4gIH07XG5cbiAgZnVuY3Rpb24gU2hhMShzaGFyZWRNZW1vcnkpIHtcbiAgICBpZiAoc2hhcmVkTWVtb3J5KSB7XG4gICAgICBibG9ja3NbMF0gPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICBibG9ja3NbOF0gPSBibG9ja3NbOV0gPSBibG9ja3NbMTBdID0gYmxvY2tzWzExXSA9XG4gICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICB9XG5cbiAgICB0aGlzLmgwID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmgxID0gMHhFRkNEQUI4OTtcbiAgICB0aGlzLmgyID0gMHg5OEJBRENGRTtcbiAgICB0aGlzLmgzID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmg0ID0gMHhDM0QyRTFGMDtcblxuICAgIHRoaXMuYmxvY2sgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMDtcbiAgICB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJzdCA9IHRydWU7XG4gIH1cblxuICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEZJTkFMSVpFX0VSUk9SKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShtZXNzYWdlKTtcbiAgICBtZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgIHZhciBpc1N0cmluZyA9IHJlc3VsdFsxXTtcbiAgICB2YXIgY29kZSwgaW5kZXggPSAwLCBpLCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCB8fCAwLCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgICAgIGJsb2Nrc1swXSA9IHRoaXMuYmxvY2s7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYoaXNTdHJpbmcpIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gY29kZSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvZGUgPSAweDEwMDAwICsgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhmMCB8IChjb2RlID4+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSB0aGlzLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgNjQ7ICsraW5kZXgpIHtcbiAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaTtcbiAgICAgIHRoaXMuYnl0ZXMgKz0gaSAtIHRoaXMuc3RhcnQ7XG4gICAgICBpZiAoaSA+PSA2NCkge1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGkgLSA2NDtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDA7XG4gICAgICB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgdmFyIGJsb2NrcyA9IHRoaXMuYmxvY2tzLCBpID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgIGJsb2Nrc1sxNl0gPSB0aGlzLmJsb2NrO1xuICAgIGJsb2Nrc1tpID4+PiAyXSB8PSBFWFRSQVtpICYgM107XG4gICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgaWYgKGkgPj0gNTYpIHtcbiAgICAgIGlmICghdGhpcy5oYXNoZWQpIHtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgfVxuICAgIGJsb2Nrc1sxNF0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjk7XG4gICAgYmxvY2tzWzE1XSA9IHRoaXMuYnl0ZXMgPDwgMztcbiAgICB0aGlzLmhhc2goKTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhID0gdGhpcy5oMCwgYiA9IHRoaXMuaDEsIGMgPSB0aGlzLmgyLCBkID0gdGhpcy5oMywgZSA9IHRoaXMuaDQ7XG4gICAgdmFyIGYsIGosIHQsIGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgZm9yKGogPSAxNjsgaiA8IDgwOyArK2opIHtcbiAgICAgIHQgPSBibG9ja3NbaiAtIDNdIF4gYmxvY2tzW2ogLSA4XSBeIGJsb2Nrc1tqIC0gMTRdIF4gYmxvY2tzW2ogLSAxNl07XG4gICAgICBibG9ja3Nbal0gPSAgKHQgPDwgMSkgfCAodCA+Pj4gMzEpO1xuICAgIH1cblxuICAgIGZvcihqID0gMDsgaiA8IDIwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IChhICYgYikgfCAoKH5hKSAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoKH5lKSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoKH5kKSAmIGEpO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IChjICYgZCkgfCAoKH5jKSAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgNDA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IGEgXiBiIF4gYztcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IGMgXiBkIF4gZTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDYwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSAtIDE4OTQwMDc1ODggKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKGEgJiBjKSB8IChiICYgYyk7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gKGUgJiBhKSB8IChlICYgYikgfCAoYSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoZCAmIGEpIHwgKGUgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKGMgJiBlKSB8IChkICYgZSk7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA4MDsgaiArPSA1KSB7XG4gICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSA4OTk0OTc1MTQgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSBkIF4gZSBeIGE7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IHRoaXMuaDAgKyBhIDw8IDA7XG4gICAgdGhpcy5oMSA9IHRoaXMuaDEgKyBiIDw8IDA7XG4gICAgdGhpcy5oMiA9IHRoaXMuaDIgKyBjIDw8IDA7XG4gICAgdGhpcy5oMyA9IHRoaXMuaDMgKyBkIDw8IDA7XG4gICAgdGhpcy5oNCA9IHRoaXMuaDQgKyBlIDw8IDA7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBoMCA9IHRoaXMuaDAsIGgxID0gdGhpcy5oMSwgaDIgPSB0aGlzLmgyLCBoMyA9IHRoaXMuaDMsIGg0ID0gdGhpcy5oNDtcblxuICAgIHJldHVybiBIRVhfQ0hBUlNbKGgwID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDAgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gyICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDMgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toNCAmIDB4MEZdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLnRvU3RyaW5nID0gU2hhMS5wcm90b3R5cGUuaGV4O1xuXG4gIFNoYTEucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gW1xuICAgICAgKGgwID4+PiAyNCkgJiAweEZGLCAoaDAgPj4+IDE2KSAmIDB4RkYsIChoMCA+Pj4gOCkgJiAweEZGLCBoMCAmIDB4RkYsXG4gICAgICAoaDEgPj4+IDI0KSAmIDB4RkYsIChoMSA+Pj4gMTYpICYgMHhGRiwgKGgxID4+PiA4KSAmIDB4RkYsIGgxICYgMHhGRixcbiAgICAgIChoMiA+Pj4gMjQpICYgMHhGRiwgKGgyID4+PiAxNikgJiAweEZGLCAoaDIgPj4+IDgpICYgMHhGRiwgaDIgJiAweEZGLFxuICAgICAgKGgzID4+PiAyNCkgJiAweEZGLCAoaDMgPj4+IDE2KSAmIDB4RkYsIChoMyA+Pj4gOCkgJiAweEZGLCBoMyAmIDB4RkYsXG4gICAgICAoaDQgPj4+IDI0KSAmIDB4RkYsIChoNCA+Pj4gMTYpICYgMHhGRiwgKGg0ID4+PiA4KSAmIDB4RkYsIGg0ICYgMHhGRlxuICAgIF07XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXkgPSBTaGExLnByb3RvdHlwZS5kaWdlc3Q7XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG4gICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDAsIHRoaXMuaDApO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMig0LCB0aGlzLmgxKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoOCwgdGhpcy5oMik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDEyLCB0aGlzLmgzKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoMTYsIHRoaXMuaDQpO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgZnVuY3Rpb24gSG1hY1NoYTEoa2V5LCBzaGFyZWRNZW1vcnkpIHtcbiAgICB2YXIgaSwgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShrZXkpO1xuICAgIGtleSA9IHJlc3VsdFswXTtcbiAgICBpZiAocmVzdWx0WzFdKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgbGVuZ3RoID0ga2V5Lmxlbmd0aCwgaW5kZXggPSAwLCBjb2RlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvZGUgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4YzAgfCAoY29kZSA+Pj4gNikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHhlMCB8IChjb2RlID4+PiAxMikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweDNmZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gNikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8IChjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBrZXkgPSBieXRlcztcbiAgICB9XG5cbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDY0KSB7XG4gICAgICBrZXkgPSAobmV3IFNoYTEodHJ1ZSkpLnVwZGF0ZShrZXkpLmFycmF5KCk7XG4gICAgfVxuXG4gICAgdmFyIG9LZXlQYWQgPSBbXSwgaUtleVBhZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgKytpKSB7XG4gICAgICB2YXIgYiA9IGtleVtpXSB8fCAwO1xuICAgICAgb0tleVBhZFtpXSA9IDB4NWMgXiBiO1xuICAgICAgaUtleVBhZFtpXSA9IDB4MzYgXiBiO1xuICAgIH1cblxuICAgIFNoYTEuY2FsbCh0aGlzLCBzaGFyZWRNZW1vcnkpO1xuXG4gICAgdGhpcy51cGRhdGUoaUtleVBhZCk7XG4gICAgdGhpcy5vS2V5UGFkID0gb0tleVBhZDtcbiAgICB0aGlzLmlubmVyID0gdHJ1ZTtcbiAgICB0aGlzLnNoYXJlZE1lbW9yeSA9IHNoYXJlZE1lbW9yeTtcbiAgfVxuICBIbWFjU2hhMS5wcm90b3R5cGUgPSBuZXcgU2hhMSgpO1xuXG4gIEhtYWNTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICB0aGlzLmlubmVyID0gZmFsc2U7XG4gICAgICB2YXIgaW5uZXJIYXNoID0gdGhpcy5hcnJheSgpO1xuICAgICAgU2hhMS5jYWxsKHRoaXMsIHRoaXMuc2hhcmVkTWVtb3J5KTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMub0tleVBhZCk7XG4gICAgICB0aGlzLnVwZGF0ZShpbm5lckhhc2gpO1xuICAgICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV4cG9ydHMgPSBjcmVhdGVNZXRob2QoKTtcbiAgZXhwb3J0cy5zaGExID0gZXhwb3J0cztcbiAgZXhwb3J0cy5zaGExLmhtYWMgPSBjcmVhdGVIbWFjTWV0aG9kKCk7XG5cbiAgaWYgKENPTU1PTl9KUykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiAgfSBlbHNlIHtcbiAgICByb290LnNoYTEgPSBleHBvcnRzO1xuICAgIGlmIChBTUQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwgIi8qKlxuICogQ2VudHJhbGlzZWQgRkhJUiBDb2RlU3lzdGVtIC8gSWRlbnRpZmllclN5c3RlbSBVUklzIHVzZWQgYnkgdGhlIG1hcHBlcnMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvZmhpci9zeXN0ZW1zLnB5YC4gV2UgdXNlIFVSTC1mb3JtIHN5c3RlbXMgaW5zdGVhZFxuICogb2YgT0lEcyBiZWNhdXNlOlxuICogICAtIGl0IGRvZXNuJ3QgcmVxdWlyZSBtaW50aW5nL293bmluZyBhIHJlYWwgTkhJL1RXIGNvcmUgT0lELFxuICogICAtIGl0J3Mgc2VsZi1kZXNjcmliaW5nIGluIHRvb2xzIHRoYXQgZG9uJ3QgcmVjb2duaXNlIHRoZSBPSUQsXG4gKiAgIC0gaXQgY2xlYW5seSBzdXJ2aXZlcyB0aGUgVFdOSElGSElSIHZhbGlkYXRvcidzIHN5bnRhY3RpYyBjaGVjay5cbiAqXG4gKiBBbGwgc3lzdGVtcyBsaXZlIGhlcmUgc28gYSBzaW5nbGUgY2hhbmdlIHJpcHBsZXMgdG8gZXZlcnkgbWFwcGVyLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgbmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU1MDY1XHU0RkREXHU3RjcyXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIChsYWIgKyBwcm9jZWR1cmUgb3JkZXIgY29kZXMgXHUyMDE0IHNhbWUgbmFtZXNwYWNlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfTUVESUNBTF9PUkRFUl9DT0RFID1cbiAgXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1tZWRpY2FsLW9yZGVyLWNvZGVcIjtcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1ODVFNVx1NTRDMVx1NEVFM1x1NzhCQyAoZHJ1ZyBjb2RlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfRFJVR19DT0RFID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1kcnVnLWNvZGVcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRhaXdhbiBwYXRpZW50IGlkZW50aWZpZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIChUYWl3YW4gbmF0aW9uYWwgSUQpLiAqL1xuZXhwb3J0IGNvbnN0IFRXX05BVElPTkFMX0lEID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9JZGVudGlmaWVyU3lzdGVtL25hdGlvbmFsLWlkXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBmYWxsYmFja3MgKHBlci1kZXBsb3ltZW50LCBOT1QgY3Jvc3Mtc3lzdGVtIGNhbm9uaWNhbCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTEFCX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWxhYlwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLW1lZGljYXRpb25cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUkVQT1JUX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLXJlcG9ydFwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9DT05ESVRJT05fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1wcm9jZWR1cmVcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQUxMRVJHRU5fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtYWxsZXJnZW5cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUEFUSUVOVF9NUk4gPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0lkZW50aWZpZXJTeXN0ZW0vaGlzLW1yblwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJuYXRpb25hbCBjb2RlIHN5c3RlbXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBMT0lOQyA9IFwiaHR0cDovL2xvaW5jLm9yZ1wiO1xuZXhwb3J0IGNvbnN0IFNOT01FRF9DVCA9IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiO1xuLyoqIElDRC0xMC1DTSAoVGFpd2FuIC8gXHU1MDY1XHU0RkREIHVzZXMgdGhpcywgbm90IGJhcmUgSUNELTEwKS4gKi9cbmV4cG9ydCBjb25zdCBJQ0RfMTBfQ00gPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiO1xuZXhwb3J0IGNvbnN0IElDRF8xMF9QQ1MgPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1wY3NcIjtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBPTkxZIGFcbiAqIGhhc2hlZCBQYXRpZW50LmlkIChlLmcuIHZpYSBhbiBIVFRQIGFjY2VzcyBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGVcbiAqIH4zME0gVGFpd2FuZXNlIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdFxuICogdGhpcyBiZWNhdXNlIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3XG4gKiBuYXRpb25hbCBJRCBpbiBhbnkgbGVha2VkIEJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBCdW5kbGUtbGVha1xuICogc2NlbmFyaW9zIGRpc2Nsb3NlIGJvdGggZmllbGRzIHRvZ2V0aGVyLCBzbyBhIHNhbHQgd291bGQgbm90IG1vdmVcbiAqIHRoZSBuZWVkbGUgdGhlcmUuIFRoZSByZW1haW5pbmcgc2luZ2xlLWZpZWxkIGxlYWsgdmVjdG9yIGlzIEhUVFBcbiAqIGFjY2VzcyBsb2dzOyBkZXBsb3ltZW50cyBzaG91bGQgc2NydWIgYC9maGlyL1BhdGllbnQvW14vXStgIHBhdGhzXG4gKiBhbmQgYD9wYXRpZW50PWAgcXVlcnkgc3RyaW5ncyBhdCB0aGUgcmV2ZXJzZS1wcm94eSBsYXllciAoc2VlXG4gKiBBUkNISVRFQ1RVUkUubWQgXHUwMEE3XCJQYXRpZW50LmlkIFx1NTNDRFx1NjNBOFx1OThBOFx1OTZBQVx1ODIwN1x1N0RFOVx1ODlFM1wiKS5cbiAqXG4gKiBVc2VzIGBqcy1zaGExYCAocHVyZSBKUykgaW5zdGVhZCBvZiBgbm9kZTpjcnlwdG9gIHNvIHRoZSBzYW1lIG1hcHBlclxuICogY29kZSBydW5zIHVubW9kaWZpZWQgaW4gdGhlIENocm9tZSBleHRlbnNpb24ncyBsb2NhbC1vbmx5IG1vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVJZChwYXRpZW50SWQ6IHN0cmluZywgLi4ucGFydHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW3BhdGllbnRJZCwgLi4ucGFydHNdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogTWFwIGEgcmF3IG5hdGlvbmFsIElEIChvciBhbnkgcGF0aWVudCBpZGVudGlmaWVyKSB0byBpdHMgMzItY2hhciBoZXhcbiAqIEZISVIgYFBhdGllbnQuaWRgLiBUaGUgcmF3IHZhbHVlIGlzIGtlcHQgaW4gYFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlYFxuICogXHUyMDE0IG9ubHkgdGhlIEZISVIgbG9naWNhbCBpZCBpcyBoYXNoZWQgc28gaXQgZG9lc24ndCBsZWFrIGludG8gVVJMcyxcbiAqIHN1YmplY3QucmVmZXJlbmNlIGZpZWxkcywgYXVkaXQgbG9ncywgb3IgU01BUlQgdG9rZW4gcGF5bG9hZHMuXG4gKlxuICogRkhJUiBSNCBcdTAwQTcyLjIwIHNheXMgXCJsb2dpY2FsIGlkIFx1MjAyNiBTSE9VTEQgTk9UIGNvbnRhaW4gaWRlbnRpZnlpbmdcbiAqIGluZm9ybWF0aW9uXCIgXHUyMDE0IHRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVQYXRpZW50SWQobmF0aW9uYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW1wicGF0aWVudFwiLCBuYXRpb25hbElkXS5qb2luKFwifFwiKSkuc2xpY2UoMCwgMzIpO1xufVxuXG4vKipcbiAqIFBhcnRpYWxseS1hbm9ueW1pemUgYSBwYXRpZW50IG5hbWUuIEFwcGxpZWQgaW4gbWFwUGF0aWVudCBzbyBldmVyeVxuICogRkhJUiByZXNvdXJjZSB0aGF0IGZsb3dzIG91dCBvZiB0aGlzIGNvZGViYXNlIChkb3dubG9hZGVkIEJ1bmRsZSxcbiAqIGJhY2tlbmQgRkhJUiBzdG9yZSwgZGFzaGJvYXJkLCBTTUFSVCBhcHAgbGF1bmNoZXMpIHNlZXMgdGhlIG1hc2tlZFxuICogZm9ybS4gVGhlIHVzZXIncyByYXcgaW5wdXQgaXMgc3RpbGwga2VwdCBpbiBjaHJvbWUuc3RvcmFnZSBzbyB0aGV5XG4gKiBjYW4gcmV2aWV3IHdoYXQgd2FzIGVudGVyZWQsIGJ1dCBpdCBuZXZlciBsZWF2ZXMgUGF0aWVudCBjb250ZXh0LlxuICpcbiAqIFJ1bGVzIChUYWl3YW4gLyBDSksgY29udmVudGlvbik6XG4gKiAgIC0gMSBjaGFyICAgICBcdTIxOTIga2VlcCBhcy1pcyAobm90aGluZyB0byBtYXNrKVxuICogICAtIDIgY2hhcnMgICAgXHUyMTkyIGtlZXAgZmlyc3QsIHJlcGxhY2Ugc2Vjb25kIHdpdGggTyAgICBcdTczOEJcdTY2MEUgXHUyMTkyIFx1NzM4Qk9cbiAqICAgLSAzKyBjaGFycyAgIFx1MjE5MiBrZWVwIGZpcnN0ICsgbGFzdCwgbWlkZGxlIGFsbCBPICAgICAgXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTY3OTdcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1Njc5N09PXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTRFMkRcdTVDRjZcdTUwNjVcdTZCMjFcdTkwQ0UgXHUyMTkyIFx1NEUyRE9PT1x1OTBDRVxuICpcbiAqIFdlc3Rlcm4gbmFtZXMgKGNvbnRhaW4gd2hpdGVzcGFjZSk6IHNwbGl0IG9uIHNwYWNlLCBrZWVwIGZpcnN0ICtcbiAqIGxhc3QgdG9rZW5zLCBwYXJ0aWFsLW1hc2sgdGhlIGxhc3QgYW5kIG1pZGRsZTpcbiAqICAgSm9obiBTbWl0aCBcdTIxOTIgSm9obiBTKioqXG4gKiAgIEpvaG4gUSBTbWl0aCBcdTIxOTIgSm9obiAqKiogU21pdGhcbiAqL1xuLyoqXG4gKiBIYWxmLW1hc2sgYSBUYWl3YW4gbmF0aW9uYWwgSUQgZm9yIHNob3VsZGVyLXN1cmZpbmctc2FmZSBkaXNwbGF5LlxuICogTWF0Y2hlcyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBJ3Mgb3duIGBoaWRgIGNvbnZlbnRpb24gKGZpcnN0IDYgdmlzaWJsZSwgbGFzdFxuICogNCBoaWRkZW4pOiBgUDEyMzQ1MDg2NmAgXHUyMTkyIGBQMTIzNDUqKioqYC5cbiAqXG4gKiBgY2hhcmAgZGVmYXVsdHMgdG8gYCpgIGZvciBwb3B1cC90b2FzdCBkaXNwbGF5LiBVc2UgYFhgIGZvciBmaWxlbmFtZXNcbiAqIHNpbmNlIGAqYCBpcyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIFRoZSBhdXRvLWdlbmVyYXRlZFxuICogYGF1dG8tWFhYWFhYWFhgIHBsYWNlaG9sZGVycyBmbG93IHRocm91Z2ggdW5jaGFuZ2VkIChhbHJlYWR5XG4gKiBub24taWRlbnRpZnlpbmcpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFza0lkKGlkOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjaGFyID0gXCIqXCIpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKGlkID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gcztcbiAgaWYgKC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChzKSkgcmV0dXJuIHMuc2xpY2UoMCwgNikgKyBjaGFyLnJlcGVhdCg0KTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gcztcbiAgaWYgKHMubGVuZ3RoID4gNikgcmV0dXJuIHMuc2xpY2UoMCwgMikgKyBjaGFyLnJlcGVhdChzLmxlbmd0aCAtIDQpICsgcy5zbGljZSgtMik7XG4gIHJldHVybiBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFza05hbWUobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSAobmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghdHJpbW1lZCB8fCB0cmltbWVkID09PSBcIlVua25vd25cIikgcmV0dXJuIHRyaW1tZWQ7XG5cbiAgaWYgKC9cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoL1xccysvKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSByZXR1cm4gcGFydHNbMF0hO1xuICAgIGNvbnN0IGZpcnN0ID0gcGFydHNbMF0hO1xuICAgIGNvbnN0IGxhc3QgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSE7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gRml4ZWQgMyBzdGFycyByZWdhcmRsZXNzIG9mIG9yaWdpbmFsIGxlbmd0aCBcdTIwMTQgZG9uJ3QgbGVhayBob3dcbiAgICAgIC8vIGxvbmcgdGhlIHN1cm5hbWUgd2FzIHZpYSBtYXNrIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxhc3RNYXNrZWQgPSBsYXN0Lmxlbmd0aCA8PSAxID8gbGFzdCA6IGAke2xhc3RbMF19KioqYDtcbiAgICAgIHJldHVybiBgJHtmaXJzdH0gJHtsYXN0TWFza2VkfWA7XG4gICAgfVxuICAgIGNvbnN0IG1pZGRsZXMgPSBwYXJ0cy5zbGljZSgxLCAtMSkubWFwKCgpID0+IFwiKioqXCIpO1xuICAgIHJldHVybiBbZmlyc3QsIC4uLm1pZGRsZXMsIGxhc3RdLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgLy8gQ0pLIC8gc2luZ2xlLXRva2VuIHBhdGguIEl0ZXJhdGUgY29kZXBvaW50cyAobm90IFVURi0xNiB1bml0cykgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyBjYW4ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKHRyaW1tZWQpO1xuICBpZiAoY2hhcnMubGVuZ3RoIDw9IDEpIHJldHVybiB0cmltbWVkO1xuICBpZiAoY2hhcnMubGVuZ3RoID09PSAyKSByZXR1cm4gYCR7Y2hhcnNbMF19T2A7XG4gIHJldHVybiBjaGFyc1swXSArIFwiT1wiLnJlcGVhdChjaGFycy5sZW5ndGggLSAyKSArIGNoYXJzW2NoYXJzLmxlbmd0aCAtIDFdO1xufVxuIiwgIi8qKlxuICogQWxsZXJneUludG9sZXJhbmNlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvYWxsZXJneS5weWAuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUxMT1dFRF9DQVRFR09SSUVTID0gbmV3IFNldChbXCJtZWRpY2F0aW9uXCIsIFwiZm9vZFwiLCBcImVudmlyb25tZW50XCIsIFwiYmlvbG9naWNcIl0pO1xuY29uc3QgQUxMT1dFRF9DUklUSUNBTElUWSA9IG5ldyBTZXQoW1wiaGlnaFwiLCBcImxvd1wiLCBcInVuYWJsZS10by1hc3Nlc3NcIl0pO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwicnhub3JtXCIpKSByZXR1cm4gXCJodHRwOi8vd3d3Lm5sbS5uaWguZ292L3Jlc2VhcmNoL3VtbHMvcnhub3JtXCI7XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9BTExFUkdFTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQWxsZXJneUludG9sZXJhbmNlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQWxsZXJnZW5cIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQWxsZXJneUludG9sZXJhbmNlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcucmVjb3JkZWRfZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgcGF0aWVudDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjbGluaWNhbFN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtY2xpbmljYWxcIixcbiAgICAgICAgICBjb2RlOiBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtdmVyaWZpY2F0aW9uXCIsXG4gICAgICAgICAgY29kZTogXCJjb25maXJtZWRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGNhdGVnb3J5ID0gcmF3LmNhdGVnb3J5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NBVEVHT1JJRVMuaGFzKGNhdGVnb3J5KSkge1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW2NhdGVnb3J5XTtcbiAgfVxuXG4gIGNvbnN0IGNyaXRpY2FsaXR5ID0gcmF3LmNyaXRpY2FsaXR5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NSSVRJQ0FMSVRZLmhhcyhjcml0aWNhbGl0eSkpIHtcbiAgICByZXNvdXJjZS5jcml0aWNhbGl0eSA9IGNyaXRpY2FsaXR5O1xuICB9XG5cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IHJlYWN0aW9uTm90ZSA9IHJhdy5yZWFjdGlvbiA/PyBcIlwiO1xuICBpZiAocmVhY3Rpb25Ob3RlKSB7XG4gICAgcmVzb3VyY2UucmVhY3Rpb24gPSBbeyBkZXNjcmlwdGlvbjogcmVhY3Rpb25Ob3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogQ29uZGl0aW9uIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvY29uZGl0aW9uLnB5YC4gSW5jbHVkZXMgdGhlIElDRC0xMC1DTVxuICogbm9ybWFsaXNlciAoVFdOSElGSElSIFJvdW5kLTMgZml4KSB3aGljaCBpbnNlcnRzIHRoZSBjYW5vbmljYWwgZG90XG4gKiBiYWNrIGludG8gTkhJJ3MgdW4tZG90dGVkIGNvZGVzIChcIkUxMTIyXCIgXHUyMTkyIFwiRTExLjIyXCIpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbi8vIElDRC0xMC1DTSBjYW5vbmljYWwgZm9ybSBpcyAnWFhYLllZWVtBLVpdJyAoY2F0ZWdvcnkgMyBjaGFycyArIG9wdGlvbmFsXG4vLyBkb3QgKyBzdWJkaXZpc2lvbiArIG9wdGlvbmFsIDd0aC1jaGFyYWN0ZXIgZXh0ZW5zaW9uKS4gTkhJIFx1NTA2NVx1NEZERCBzZW5kc1xuLy8gY29kZXMgV0lUSE9VVCB0aGUgZG90ICgnRTExMjInLCAnTTQ3ODkyJywgJ1MwOTkzWEEnLCAnTTE5MjcxJykuXG4vLyBWYWxpZGF0b3IgcmVqZWN0cyB1bi1kb3R0ZWQgY29kZXMgYXMgJ1Vua25vd24gY29kZScuXG5jb25zdCBJQ0QxMF9DQVRFR09SWV9SRSA9IC9eW0EtWl1bMC05QS1aXXsyfSQvO1xuXG4vKipcbiAqIEluc2VydCB0aGUgZG90IGJhY2sgaW50byBOSEkncyBuby1kb3QgSUNELTEwLUNNIGNvZGVzLlxuICogICBFMTEyMiAgICBcdTIxOTIgRTExLjIyXG4gKiAgIE00Nzg5MiAgIFx1MjE5MiBNNDcuODkyXG4gKiAgIFMwOTkzWEEgIFx1MjE5MiBTMDkuOTNYQVxuICogICBFMTEgICAgICBcdTIxOTIgRTExICAgICAgICAobm8gc3ViZGl2aXNpb247IHBhc3MgdGhyb3VnaClcbiAqICAgRTExLjIyICAgXHUyMTkyIEUxMS4yMiAgICAgKGFscmVhZHkgZG90dGVkOyBwYXNzIHRocm91Z2gpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVJY2QxMENtKGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWNvZGUgfHwgY29kZS5pbmNsdWRlcyhcIi5cIikpIHJldHVybiBjb2RlID8/IFwiXCI7XG4gIGNvbnN0IHMgPSBjb2RlLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAocy5sZW5ndGggPD0gMykgcmV0dXJuIHM7XG4gIGNvbnN0IGhlYWQgPSBzLnNsaWNlKDAsIDMpO1xuICBjb25zdCB0YWlsID0gcy5zbGljZSgzKTtcbiAgaWYgKElDRDEwX0NBVEVHT1JZX1JFLnRlc3QoaGVhZCkpIHtcbiAgICByZXR1cm4gYCR7aGVhZH0uJHt0YWlsfWA7XG4gIH1cbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJpY2QtMTBcIikgfHwgcy5pbmNsdWRlcyhcImljZDEwXCIpKSB7XG4gICAgLy8gTkhJIFx1NTA2NVx1NEZERCBjb2RlcyBhcmUgSUNELTEwLUNNIChVUy9UYWl3YW4gZXh0ZW5kZWQgc2V0IFx1MjAxNCBlLmcuXG4gICAgLy8gRTExLjIyKS4gVGhlIGJhc2UgSUNELTEwIFZhbHVlU2V0IHJlamVjdHMgdGhlc2UgYXMgJ1Vua25vd24gY29kZScuXG4gICAgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX0NNO1xuICB9XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9DT05ESVRJT05fQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcENvbmRpdGlvbihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQ29uZGl0aW9uXCI7XG4gIGxldCBjb2RlID0gcmF3LmNvZGUgYXMgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG4gIGlmIChzeXN0ZW0gPT09IHN5c3RlbXMuSUNEXzEwX0NNICYmIGNvZGUpIHtcbiAgICBjb2RlID0gbm9ybWFsaXplSWNkMTBDbShjb2RlKTtcbiAgfVxuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJDb25kaXRpb25cIixcbiAgICAvLyBTdGFibGUgaWQgZmFsbHMgYmFjayB0byBkaXNwbGF5IHdoZW4gbm8gY29kZSBpcyBwcmVzZW50IChjYXRhc3Ryb3BoaWNcbiAgICAvLyBpbGxuZXNzIHJvd3MgZnJvbSBJSEtFMzIwOSBjYXJyeSB0aGUgQ2hpbmVzZSBuYXJyYXRpdmUgb25seSkuIE1pcnJvcnNcbiAgICAvLyB0aGUgc2FtZSBgY29kZSB8fCBkaXNwbGF5YCBwYXR0ZXJuIGluIGRpYWdub3N0aWMtcmVwb3J0LnRzIGFuZFxuICAgIC8vIGFsbGVyZ3kudHMgXHUyMDE0IGF2b2lkcyBoYXNoIGNvbGxpc2lvbnMgYmV0d2VlbiB0d28gc2FtZS1kYXkgY29kZS1sZXNzXG4gICAgLy8gY29uZGl0aW9ucy5cbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5vbnNldF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IHJhdy5jbGluaWNhbF9zdGF0dXMgPz8gXCJhY3RpdmVcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB2ZXJpZmljYXRpb25TdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLXZlci1zdGF0dXNcIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9O1xuXG4gIC8vIENhdGVnb3J5IHJvdXRlcyB0aGUgQ29uZGl0aW9uIGludG8gdGhlIHJpZ2h0IGRvd25zdHJlYW0gdmlldy5cbiAgLy8gLSBcInByb2JsZW0tbGlzdC1pdGVtXCIgXHUyMTkyIFNNQVJUIC8gSVBTIFByb2JsZW0gTGlzdCBzZWN0aW9uXG4gIC8vIC0gXCJlbmNvdW50ZXItZGlhZ25vc2lzXCIgXHUyMTkyIHBlci1lbmNvdW50ZXIgZGlhZ25vc2VzXG4gIC8vIC0gXCJoZWFsdGgtY29uY2VyblwiIFx1MjE5MiBJUFMgSGVhbHRoIENvbmNlcm5zXG4gIC8vIEFkYXB0ZXItbGV2ZWwgZGVjaXNpb246IFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSByb3dzIG1hcmsgY2F0ZWdvcnk9XCJwcm9ibGVtLWxpc3QtaXRlbVwiO1xuICAvLyBnZW5lcmljIGVuY291bnRlci1kZXJpdmVkIGNvbmRpdGlvbnMgY2FuIG9taXQsIGRlZmF1bHRpbmcgdG8gbm9cbiAgLy8gZXhwbGljaXQgY2F0ZWdvcnkgKFNNQVJUIGFwcHMgZmFsbCB0aHJvdWdoIHRvIGFsbC1jb25kaXRpb25zIHZpZXcpLlxuICBpZiAocmF3LmNhdGVnb3J5KSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogcmF3LmNhdGVnb3J5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICByZXNvdXJjZS5jb2RlID0ge1xuICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgdGV4dDogZGlzcGxheSxcbiAgfTtcblxuICBjb25zdCBzZXZlcml0eSA9IHJhdy5zZXZlcml0eSA/PyBcIlwiO1xuICBpZiAoc2V2ZXJpdHkpIHtcbiAgICByZXNvdXJjZS5zZXZlcml0eSA9IHsgdGV4dDogc2V2ZXJpdHkgfTtcbiAgfVxuXG4gIGlmIChyYXcub25zZXRfZGF0ZSkge1xuICAgIHJlc291cmNlLm9uc2V0RGF0ZVRpbWUgPSBgJHtyYXcub25zZXRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcucmVjb3JkZWRfZGF0ZSkge1xuICAgIHJlc291cmNlLnJlY29yZGVkRGF0ZSA9IGAke3Jhdy5yZWNvcmRlZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBEaWFnbm9zdGljUmVwb3J0IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZGlhZ25vc3RpY19yZXBvcnQucHlgLiBSZXR1cm5zIG51bGwgZm9yXG4gKiBsaXN0LXBhZ2Ugcm93cyBsYWNraW5nIGEgY29uY2x1c2lvbiwgYW5kIGZvciBsYWItdmFsdWUtb25seSBcInJlcG9ydHNcIlxuICogdGhhdCB3b3VsZCBkdXBsaWNhdGUgYSBwcm9wZXIgT2JzZXJ2YXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgVjJfMDA3NCA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92Mi0wMDc0XCI7XG5cbmNvbnN0IENBVEVHT1JZX01BUDogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgTEFCOiBbVjJfMDA3NCwgXCJMQUJcIiwgXCJMYWJvcmF0b3J5XCJdLFxuICBSQUQ6IFtWMl8wMDc0LCBcIlJBRFwiLCBcIlJhZGlvbG9neVwiXSxcbiAgQ0FSOiBbVjJfMDA3NCwgXCJDQVJcIiwgXCJDYXJkaW9sb2d5XCJdLFxuICBQQVRIOiBbVjJfMDA3NCwgXCJQQVRcIiwgXCJQYXRob2xvZ3lcIl0sXG59O1xuXG4vLyBMYWItcmVzdWx0IHBhdHRlcm5zIHRoYXQgbG9vayBsaWtlIHNpbmdsZS12YWx1ZSBsYWIgcmVhZGluZ3MgcmF0aGVyXG4vLyB0aGFuIGEgbmFycmF0aXZlIHJlcG9ydC5cbmNvbnN0IExBQl9VTklUX1JFID1cbiAgL1xcZCsoPzpcXC5cXGQrKT9cXHMqKD86JXxtZ1xcL2RMfGdcXC9kTHxtbW9sXFwvTHxVXFwvTHxJVVxcL0x8bUlVXFwvTHxuZ1xcL21MfFx1MDNCQ2dcXC9kTHx1Z1xcL2RMfHBnXFwvbUx8Zkx8XFwvdUx8MTBcXF4/XFxkK1xcL3VMfHgxMFxcXj9cXGQrXFwvdUx8c2VjfFx1NzlEMnxjb3BpZXNcXC9tTCkvO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIHRydWU7XG4gIGNvbnN0IHRleHQgPSBjb25jbHVzaW9uLnRyaW0oKTtcbiAgLy8gUmVhbCBuYXJyYXRpdmUgcmVwb3J0cyBhbG1vc3QgYWx3YXlzIGNvbnRhaW4gbXVsdGlwbGUgc2VudGVuY2VzLlxuICBpZiAodGV4dC5sZW5ndGggPiAxMDApIHJldHVybiBmYWxzZTtcbiAgLy8gU2luZ2xlIHZhbHVlIHBhdHRlcm4gKyBwYXJlbnRoZXRpY2FsIHJlZmVyZW5jZSByYW5nZSA9IGxhYiBsaW5lLlxuICBpZiAoTEFCX1VOSVRfUkUudGVzdCh0ZXh0KSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcERpYWdub3N0aWNSZXBvcnQoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoKHJhdy5jb25jbHVzaW9uID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWNvbmNsdXNpb24pIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGNhdEtleVJhdyA9IFN0cmluZyhyYXcuY2F0ZWdvcnkgPz8gXCJcIikudG9VcHBlckNhc2UoKTtcbiAgaWYgKGNhdEtleVJhdyA9PT0gXCJMQUJcIiAmJiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUmVwb3J0XCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtSGludCA9IHJhdy5zeXN0ZW0gPz8gXCJcIjtcbiAgY29uc3Qgc3lzdGVtID1cbiAgICB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiAmJiBzeXN0ZW1IaW50LnRvVXBwZXJDYXNlKCkgPT09IFwiTE9JTkNcIlxuICAgICAgPyBzeXN0ZW1zLkxPSU5DXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1JFUE9SVF9DT0RFO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcuZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiByYXcuc3RhdHVzID8/IFwiZmluYWxcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gICAgY29uY2x1c2lvbixcbiAgfTtcblxuICBjb25zdCBjYXRFbnRyeSA9IENBVEVHT1JZX01BUFtjYXRLZXlSYXddO1xuICBpZiAoY2F0RW50cnkpIHtcbiAgICBjb25zdCBbY2F0U3lzLCBjYXRDb2RlLCBjYXREaXNwbGF5XSA9IGNhdEVudHJ5O1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW3sgY29kaW5nOiBbeyBzeXN0ZW06IGNhdFN5cywgY29kZTogY2F0Q29kZSwgZGlzcGxheTogY2F0RGlzcGxheSB9XSB9XTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAocmF3Lmlzc3VlZCkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5pc3N1ZWR9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfSBlbHNlIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIEVuY291bnRlciBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2VuY291bnRlci5weWAuIFN0YWJsZSBJRCBpbmNsdWRlcyBob3NwaXRhbFxuICogc28gc2FtZS1kYXkgdmlzaXRzIHRvIGRpZmZlcmVudCBpbnN0aXR1dGlvbnMgZWFjaCBnZXQgdGhlaXIgb3duXG4gKiBFbmNvdW50ZXIgKHRoZSBwb3N0LW1hcHBpbmcgbGlua2VyIGRlcGVuZHMgb24gdGhpcykuXG4gKi9cblxuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IEFDVENPREVfU1lTVEVNID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YzLUFjdENvZGVcIjtcblxuY29uc3QgQ0xBU1NfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBBTUI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJBTUJcIiwgXCJhbWJ1bGF0b3J5XCJdLFxuICBJTVA6IFtBQ1RDT0RFX1NZU1RFTSwgXCJJTVBcIiwgXCJpbnBhdGllbnQgZW5jb3VudGVyXCJdLFxuICBFTUVSOiBbQUNUQ09ERV9TWVNURU0sIFwiRU1FUlwiLCBcImVtZXJnZW5jeVwiXSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBFbmNvdW50ZXIocmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCBlbmNDbGFzcyA9IFN0cmluZyhyYXcuY2xhc3MgPz8gXCJBTUJcIikudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2xhc3NFbnRyeSA9IENMQVNTX01BUFtlbmNDbGFzc10gPz8gQ0xBU1NfTUFQLkFNQiE7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkVuY291bnRlclwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIHJhdy5kYXRlID8/IFwiXCIsIGVuY0NsYXNzLCAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKSksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5pc2hlZFwiLFxuICAgIGNsYXNzOiB7XG4gICAgICBzeXN0ZW06IGNsYXNzRW50cnlbMF0sXG4gICAgICBjb2RlOiBjbGFzc0VudHJ5WzFdLFxuICAgICAgZGlzcGxheTogY2xhc3NFbnRyeVsyXSxcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgLy8gTkhJJ3MgZW5jb3VudGVyIFwidHlwZVwiIG1hcmtlcnMgXHUyMDE0ICdJQ1x1NTM2MVx1OENDN1x1NjU5OScgLyAnXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5JyAvICdcdTRGNEZcdTk2NjInXG4gIC8vIFx1MjAxNCBhcmUgZGF0YS1vcmlnaW4gbGFiZWxzLCBub3QgU05PTUVEIGNsaW5pY2FsIHR5cGVzLiBLZWVwIHRoZW0gYXNcbiAgLy8gQ29kZWFibGVDb25jZXB0LnRleHQgd2l0aG91dCBjbGFpbWluZyBTTk9NRUQuXG4gIGNvbnN0IHR5cGVEaXNwbGF5ID0gKChyYXcudHlwZV9kaXNwbGF5ID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAodHlwZURpc3BsYXkpIHtcbiAgICByZXNvdXJjZS50eXBlID0gW3sgdGV4dDogdHlwZURpc3BsYXkgfV07XG4gIH1cblxuICBjb25zdCBwZXJpb2Q6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgaWYgKHJhdy5kYXRlKSBwZXJpb2Quc3RhcnQgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3LmVuZF9kYXRlKSBwZXJpb2QuZW5kID0gYCR7cmF3LmVuZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChPYmplY3Qua2V5cyhwZXJpb2QpLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5wZXJpb2QgPSBwZXJpb2Q7XG4gIH1cblxuICBjb25zdCBkZXBhcnRtZW50ID0gcmF3LmRlcGFydG1lbnQgPz8gXCJcIjtcbiAgY29uc3QgcHJvdmlkZXIgPSByYXcucHJvdmlkZXIgPz8gXCJcIjtcbiAgaWYgKGRlcGFydG1lbnQgfHwgcHJvdmlkZXIpIHtcbiAgICBjb25zdCBwYXJ0aWNpcGFudDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChwcm92aWRlcikgcGFydGljaXBhbnQuaW5kaXZpZHVhbCA9IHsgZGlzcGxheTogcHJvdmlkZXIgfTtcbiAgICByZXNvdXJjZS5wYXJ0aWNpcGFudCA9IE9iamVjdC5rZXlzKHBhcnRpY2lwYW50KS5sZW5ndGggPiAwID8gW3BhcnRpY2lwYW50XSA6IFtdO1xuICAgIGlmIChkZXBhcnRtZW50KSB7XG4gICAgICByZXNvdXJjZS5zZXJ2aWNlVHlwZSA9IHsgdGV4dDogZGVwYXJ0bWVudCB9O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnNlcnZpY2VQcm92aWRlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIC8vIEJpbGluZ3VhbCByZWFzb25Db2RlICh2MC44LjApLiBBZGFwdGVyIHNwbGl0cyBOSEkncyBiaWxpbmd1YWwgSUNEXG4gIC8vIG5hbWUgaW50byByYXcucmVhc29uIChFbmdsaXNoKSBhbmQgcmF3LnJlYXNvbl96aCAoXHU3RTQxXHU0RTJEKSwgcGx1cyB0aGVcbiAgLy8gcmF3IElDRC0xMCBjb2RlIGluIHJhdy5yZWFzb25fY29kZS4gUGF0aWVudC1mYWNpbmcgLnRleHQgdXNlcyBcdTdFNDFcdTRFMkRcbiAgLy8gKGZhbGxzIGJhY2sgdG8gRW5nbGlzaCB3aGVuIE5ISSBzaGlwcyBFbmdsaXNoLW9ubHkpOyBjb2RpbmdbXS5kaXNwbGF5XG4gIC8vIHN0YXlzIEVuZ2xpc2ggd2l0aCB0aGUgcHJvcGVyIElDRC0xMC1DTSBzeXN0ZW0uXG4gIGNvbnN0IHJlYXNvbiA9ICgocmF3LnJlYXNvbiA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgcmVhc29uWmggPSAoKHJhdy5yZWFzb25femggPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IHJlYXNvbkNvZGUgPSAoKHJhdy5yZWFzb25fY29kZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKHJlYXNvbiB8fCByZWFzb25aaCB8fCByZWFzb25Db2RlKSB7XG4gICAgY29uc3QgcmM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBpZiAocmVhc29uQ29kZSkge1xuICAgICAgLy8gU3RyaXAgdGhlIFwiPGNvZGU+IFwiIHByZWZpeCB0aGUgYWRhcHRlciBwcmVwZW5kcyB0byB0aGUgZGlzcGxheSxcbiAgICAgIC8vIHNpbmNlIHRoZSBzdHJ1Y3R1cmVkIGBjb2RlYCBhbHJlYWR5IGNvbnZleXMgdGhhdCBpbmZvcm1hdGlvbi5cbiAgICAgIGNvbnN0IGRpc3BsYXlQbGFpbiA9IHJlYXNvbi5yZXBsYWNlKG5ldyBSZWdFeHAoYF4ke3JlYXNvbkNvZGV9XFxcXHMrYCksIFwiXCIpLnRyaW0oKTtcbiAgICAgIHJjLmNvZGluZyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtY21cIixcbiAgICAgICAgICBjb2RlOiByZWFzb25Db2RlLFxuICAgICAgICAgIGRpc3BsYXk6IGRpc3BsYXlQbGFpbiB8fCByZWFzb24gfHwgcmVhc29uWmgsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICByYy50ZXh0ID0gcmVhc29uWmggfHwgcmVhc29uO1xuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbcmNdO1xuICB9XG5cbiAgY29uc3QgZGlzY2hhcmdlID0gcmF3LmRpc2NoYXJnZV9kaXNwb3NpdGlvbiA/PyBcIlwiO1xuICBpZiAoZGlzY2hhcmdlKSB7XG4gICAgcmVzb3VyY2UuaG9zcGl0YWxpemF0aW9uID0geyBkaXNjaGFyZ2VEaXNwb3NpdGlvbjogeyB0ZXh0OiBkaXNjaGFyZ2UgfSB9O1xuICB9XG5cbiAgY29uc3QgY2xpbmljYWxOb3RlID0gKChyYXcuY2xpbmljYWxfbm90ZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGNsaW5pY2FsTm90ZSkge1xuICAgIHJlc291cmNlLm5vdGUgPSBbeyB0ZXh0OiBjbGluaWNhbE5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBNZWRpY2F0aW9uUmVxdWVzdCBtYXBwZXIgKyBiaWxpbmd1YWwgZGVkdXBsaWNhdGlvbi5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvbWVkaWNhdGlvbi5weWAuIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgcmVwb3J0cyB0aGVcbiAqIFNBTUUgcHJlc2NyaXB0aW9uIG11bHRpcGxlIHRpbWVzIChFbmdsaXNoLW9ubHkgLyBFbmcrXHU0RTJEIC8gXHU0RTJEK0VuZykuXG4gKiBgbWFwTWVkaWNhdGlvbnNEZWR1cGAgY29sbGFwc2VzIHRoZXNlIHRvIG9uZSBNZWRpY2F0aW9uUmVxdWVzdCBwZXJcbiAqIChkYXRlLCBjYW5vbmljYWwtZHJ1Zy1rZXkpLCBwcmVmZXJyaW5nIHRoZSBmb3JtIHdpdGggbW9yZSBDSksgY2hhcnNcbiAqIChjbGluaWNpYW5zIHJlYWQgXHU1NTQ2XHU1NEMxXHU1NDBEIGZpcnN0KS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZUljZDEwQ20gfSBmcm9tIFwiLi9jb25kaXRpb25cIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5mdW5jdGlvbiBpc0NqayhjaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFx1NEUwMCAoVSs0RTAwKSB0byBcdTlGRkYgKFUrOUZGRikgY292ZXJzIENKSyBVbmlmaWVkIElkZW9ncmFwaHMuXG4gIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgcmV0dXJuIGNwID49IDB4NGUwMCAmJiBjcCA8PSAweDlmZmY7XG59XG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2YgcykgaWYgKGlzQ2prKGNoKSkgbisrO1xuICByZXR1cm4gbjtcbn1cblxuLyoqXG4gKiBNYXRjaCBhIFwibG9uZ1wiIEVuZ2xpc2ggY2h1bmsgKFx1MjI2NTQgY2hhcnMgb2YgQS1aLzAtOS9wdW5jdHVhdGlvbiBjb21tb25cbiAqIHRvIGRydWcgbmFtZXMpLiBBdm9pZCBtYXRjaGluZyBzaG9ydCB0b2tlbnMgbGlrZSBcIkRcIiBvciBcIlBPXCIgdGhhdFxuICogYXBwZWFyIGluc2lkZSBDaGluZXNlIG5hbWVzLlxuICovXG5jb25zdCBFTl9DSFVOS19HID0gL1tBLVpdW0EtWjAtOS4lL1xcLVwiJ1xcc117Myx9L2c7XG5cbi8qKlxuICogUmVkdWNlIGEgZHJ1Zy1uYW1lIHN0cmluZyB0byBhIHN0YWJsZSBjYW5vbmljYWwga2V5LiBFeHRyYWN0IHRoZVxuICogbG9uZ2VzdCBFbmdsaXNoIGZyYWdtZW50LCB0aGVuIHRydW5jYXRlIGF0IGNvbW1vbiBzZXBhcmF0b3JzIHNvIGFcbiAqIG5hbWUgd2l0aCBleHRyYSB0cmFpbGluZyBtb2RpZmllcnMgc3RpbGwgY29sbGFwc2VzIHRvIGJyYW5kK3N0cmVuZ3RoLlxuICpcbiAqIEV4YW1wbGVzIChhbGwgbWFwIHRvIFwidGltb3B0b2wgeGUgMC41JSBvcGh0aGFsbWljIHNvbHV0aW9uXCIpOlxuICogICBcIlRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTlwiXG4gKiAgIFwiVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OIChcdTk3NTJcdTc3M0NcdTk3MzJcdTIwMjYpXCJcbiAqICAgXCJcdTk3NTJcdTc3M0NcdTk3MzJcdTIwMjYgKFRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTilcIlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsRHJ1Z0tleShuYW1lOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IChuYW1lID8/IFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGNodW5rcyA9IFsuLi5zLm1hdGNoQWxsKEVOX0NIVU5LX0cpXS5tYXAoKG0pID0+IG1bMF0pO1xuICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAobmFtZSA/PyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuICBsZXQgbG9uZ2VzdCA9IGNodW5rcy5yZWR1Y2UoKGEsIGIpID0+IChiLmxlbmd0aCA+IGEubGVuZ3RoID8gYiA6IGEpKS50cmltKCk7XG4gIGZvciAoY29uc3Qgc2VwIG9mIFtcIiAtIFwiLCBcIiBcdTIwMTMgXCIsIFwiIC8gXCJdKSB7XG4gICAgaWYgKGxvbmdlc3QuaW5jbHVkZXMoc2VwKSkge1xuICAgICAgbG9uZ2VzdCA9IGxvbmdlc3Quc3BsaXQoc2VwKVswXSE7XG4gICAgfVxuICB9XG4gIHJldHVybiBsb25nZXN0LnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiAqIEJlc3QtZWZmb3J0IGFjdGl2ZSB2cyBjb21wbGV0ZWQgZGVjaXNpb24gZm9yIGEgTWVkaWNhdGlvblJlcXVlc3QuXG4gKiBBY3RpdmUgd2hpbGUgKGF1dGhvcmVkX2RhdGUgKyBkdXJhdGlvbiA+IHRvZGF5KTsgb3RoZXJ3aXNlIGNvbXBsZXRlZC5cbiAqIE1pc3NpbmcgZHVyYXRpb24gXHUyMTkyIGFzc3VtZSA5MC1kYXkgcmVmaWxsIHdpbmRvdyAoTkhJJ3MgdHlwaWNhbCBjYWRlbmNlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lZFN0YXR1cyhcbiAgYXV0aG9yZWRJc286IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGR1cmF0aW9uRGF5czogYW55LFxuKTogXCJhY3RpdmVcIiB8IFwiY29tcGxldGVkXCIge1xuICBpZiAoIWF1dGhvcmVkSXNvKSByZXR1cm4gXCJjb21wbGV0ZWRcIjtcbiAgY29uc3QgZGF0ZVBhcnQgPSBTdHJpbmcoYXV0aG9yZWRJc28pLnNsaWNlKDAsIDEwKTtcbiAgY29uc3QgcGFyc2VkID0gbmV3IERhdGUoYCR7ZGF0ZVBhcnR9VDAwOjAwOjAwWmApO1xuICBpZiAoTnVtYmVyLmlzTmFOKHBhcnNlZC5nZXRUaW1lKCkpKSByZXR1cm4gXCJjb21wbGV0ZWRcIjtcblxuICBsZXQgZGF5czogbnVtYmVyIHwgbnVsbDtcbiAgaWYgKGR1cmF0aW9uRGF5cyA9PT0gbnVsbCB8fCBkdXJhdGlvbkRheXMgPT09IHVuZGVmaW5lZCB8fCBkdXJhdGlvbkRheXMgPT09IFwiXCIpIHtcbiAgICBkYXlzID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBuID0gTnVtYmVyLnBhcnNlSW50KFN0cmluZyhkdXJhdGlvbkRheXMpLCAxMCk7XG4gICAgZGF5cyA9IE51bWJlci5pc0Zpbml0ZShuKSA/IG4gOiBudWxsO1xuICB9XG4gIGlmIChkYXlzID09PSBudWxsKSBkYXlzID0gOTA7XG5cbiAgY29uc3QgZW5kID0gbmV3IERhdGUocGFyc2VkLmdldFRpbWUoKSk7XG4gIGVuZC5zZXRVVENEYXRlKGVuZC5nZXRVVENEYXRlKCkgKyBkYXlzKTtcbiAgLy8gQ29tcGFyZSBkYXRlLW9ubHkgKHRvZGF5IGluIFVUQyBzaW5jZSB3ZSBhdXRob3JlZElzbyBpcyBkYXRlLW9ubHkpLlxuICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gIHRvZGF5LnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICByZXR1cm4gZW5kID49IHRvZGF5ID8gXCJhY3RpdmVcIiA6IFwiY29tcGxldGVkXCI7XG59XG5cbi8qKlxuICogQ29udmVydCBvbmUgc2NyYXBlZCBwcmVzY3JpcHRpb24gZGljdCBcdTIxOTIgRkhJUiBSNCBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqIFJldHVybnMgbnVsbCB3aGVuIHJhdyBoYXMgbm8gYGRydWdfbmFtZWAgKGNhbGxlciBmaWx0ZXJzIG91dCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBNZWRpY2F0aW9uUmVxdWVzdChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZHJ1Z05hbWUgPSAoKHJhdy5kcnVnX25hbWUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghZHJ1Z05hbWUpIHJldHVybiBudWxsO1xuXG4gIC8vIENhbm9uaWNhbCBrZXkgKG5vdCByYXcgZHJ1Z19uYW1lKSBmb3Igc3RhYmxlIGlkIHNvIHRoZSB0aHJlZSBOSElcbiAgLy8gXHU0RTJEXHU4MkYxIHZhcmlhbnRzIG9mIHRoZSBzYW1lIGRydWcgY29sbGFwc2UgdG8gb25lIEZISVIgcmVzb3VyY2UuXG4gIGNvbnN0IG1lZElkID0gc3RhYmxlSWQocGF0aWVudElkLCBjYW5vbmljYWxEcnVnS2V5KGRydWdOYW1lKSwgcmF3LmRhdGUgPz8gXCJcIik7XG5cbiAgY29uc3QgZHJ1Z0NvZGUgPSAoKHJhdy5jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCBjb2Rpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgc3lzdGVtOiBkcnVnQ29kZSA/IHN5c3RlbXMuTkhJX0RSVUdfQ09ERSA6IHN5c3RlbXMuSElTX0xPQ0FMX01FRElDQVRJT05fQ09ERSxcbiAgICBjb2RlOiBkcnVnQ29kZSB8fCBkcnVnTmFtZSxcbiAgICBkaXNwbGF5OiBkcnVnTmFtZSxcbiAgfTtcblxuICAvLyB2MC44LjAgYmlsaW5ndWFsOiBwcmVmZXIgXHU3RTQxXHU0RTJEIGluIENvZGVhYmxlQ29uY2VwdC50ZXh0IChwYXRpZW50LWZhY2luZ1xuICAvLyBkaXNwbGF5KSBhbmQga2VlcCBFbmdsaXNoIGluIGNvZGluZ1swXS5kaXNwbGF5IChjbGluaWNhbCBjYW5vbmljYWwpLlxuICAvLyBGYWxscyBiYWNrIHRvIEVuZ2xpc2ggd2hlbiBOSEkgZGlkbid0IHNoaXAgYSBDaGluZXNlIG5hbWUgZm9yIHRoZSBkcnVnLlxuICBjb25zdCBkcnVnTmFtZVpoID0gKChyYXcuZHJ1Z19uYW1lX3poID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpIHx8IGRydWdOYW1lO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJNZWRpY2F0aW9uUmVxdWVzdFwiLFxuICAgIGlkOiBtZWRJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBtZWRTdGF0dXMocmF3LmRhdGUgPz8gXCJcIiwgcmF3LmR1cmF0aW9uX2RheXMpLFxuICAgIGludGVudDogXCJvcmRlclwiLFxuICAgIG1lZGljYXRpb25Db2RlYWJsZUNvbmNlcHQ6IHtcbiAgICAgIGNvZGluZzogW2NvZGluZ10sXG4gICAgICB0ZXh0OiBkcnVnTmFtZVpoLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5hdXRob3JlZE9uID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIC8vIENocm9uaWMgcHJlc2NyaXB0aW9ucyAoZnJvbSBOSEkncyBJSEtFMzMwN1MwMSBcdTYxNjJcdTYwMjdcdTg2NTVcdTY1QjlcdTdCOEIgbGlzdCkgZ2V0XG4gIC8vIHRoZSBzdGFuZGFyZCBGSElSIGNvbnRpbnVvdXMtdGhlcmFweSBtYXJrZXIuIFNNQVJUIGFwcHMgcmVjb2duaXNlXG4gIC8vIHRoaXMgY29kZSBhbmQgY2FuIHN1cmZhY2UgXCJsb25nLXRlcm0gbWVkaWNhdGlvblwiIGJhZGdlcyBvciBmaWx0ZXJcbiAgLy8gcHJvYmxlbS1saXN0IHZpZXdzLiBBY3V0ZSBwcmVzY3JpcHRpb25zIGxlYXZlIHRoZSBmaWVsZCB1bnNldC5cbiAgY29uc3QgY291cnNlT2ZUaGVyYXB5ID0gKChyYXcuY291cnNlX29mX3RoZXJhcHkgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChjb3Vyc2VPZlRoZXJhcHkgPT09IFwiY29udGludW91c1wiKSB7XG4gICAgcmVzb3VyY2UuY291cnNlT2ZUaGVyYXB5VHlwZSA9IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOlxuICAgICAgICAgICAgXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL21lZGljYXRpb25yZXF1ZXN0LWNvdXJzZS1vZi10aGVyYXB5XCIsXG4gICAgICAgICAgY29kZTogXCJjb250aW51b3VzXCIsXG4gICAgICAgICAgZGlzcGxheTogXCJDb250aW51b3VzIGxvbmcgdGVybSB0aGVyYXB5XCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgdGV4dDogXCJDb250aW51b3VzIGxvbmcgdGVybSB0aGVyYXB5XCIsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGRydWdDbGFzcyA9ICgocmF3LmRydWdfY2xhc3MgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGRydWdDbGFzc1poID0gKChyYXcuZHJ1Z19jbGFzc196aCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGRydWdDbGFzcyB8fCBkcnVnQ2xhc3NaaCkge1xuICAgIGNvbnN0IGNhdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChkcnVnQ2xhc3MpIGNhdC5jb2RpbmcgPSBbeyBkaXNwbGF5OiBkcnVnQ2xhc3MgfV07XG4gICAgLy8gUGF0aWVudC1mYWNpbmc6IHByZWZlciBcdTdFNDFcdTRFMkQgaW4gLnRleHQsIGZhbGwgYmFjayB0byBFbmdsaXNoLlxuICAgIGNhdC50ZXh0ID0gZHJ1Z0NsYXNzWmggfHwgZHJ1Z0NsYXNzO1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW2NhdF07XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5yZXF1ZXN0ZXIgPSB7IGRpc3BsYXk6IGhvc3BpdGFsIH07XG4gIH1cblxuICAvLyBEb3NhZ2UgXHUyMDE0IG9ubHkgd2hlbiBzb3VyY2UgYWN0dWFsbHkgaGFzIGl0LiBOSEkncyBtZWRpY2F0aW9uLWxpc3RcbiAgLy8gZW5kcG9pbnQgcHJvdmlkZXMgbm9uZSBvZiB0aGVzZTsgb3RoZXIgSElTIGFkYXB0ZXJzIGdldCBhXG4gIC8vIHN0cnVjdHVyZWQgZG9zYWdlIG91dC5cbiAgY29uc3QgZG9zYWdlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGsgb2YgW1wiZG9zZVwiLCBcInVuaXRcIiwgXCJmcmVxdWVuY3lcIl0gYXMgY29uc3QpIHtcbiAgICBpZiAocmF3W2tdKSBwYXJ0cy5wdXNoKFN0cmluZyhyYXdba10pKTtcbiAgfVxuICBpZiAocGFydHMubGVuZ3RoID4gMCkge1xuICAgIGRvc2FnZS50ZXh0ID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cbiAgaWYgKHJhdy5yb3V0ZSkge1xuICAgIGRvc2FnZS5yb3V0ZSA9IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9zbm9tZWQuaW5mby9zY3RcIiwgZGlzcGxheTogcmF3LnJvdXRlIH1dLFxuICAgIH07XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKGRvc2FnZSkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRvc2FnZUluc3RydWN0aW9uID0gW2Rvc2FnZV07XG4gIH1cblxuICAvLyBkaXNwZW5zZVJlcXVlc3Qgd2l0aCBxdWFudGl0eSArIHN1cHBseSBkdXJhdGlvbiB3aGVuIHByZXNlbnQuXG4gIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHF0eVJhdyA9IHJhdy5xdWFudGl0eTtcbiAgaWYgKHF0eVJhdyAhPT0gbnVsbCAmJiBxdHlSYXcgIT09IHVuZGVmaW5lZCAmJiBxdHlSYXcgIT09IFwiXCIpIHtcbiAgICBjb25zdCBxdHlOdW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcocXR5UmF3KS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHF0eU51bSkpIHtcbiAgICAgIGRyLnF1YW50aXR5ID0geyB2YWx1ZTogcXR5TnVtIH07XG4gICAgfVxuICB9XG4gIGlmIChyYXcuZHVyYXRpb25fZGF5cykge1xuICAgIGNvbnN0IGRheXMgPSBOdW1iZXIucGFyc2VJbnQoU3RyaW5nKHJhdy5kdXJhdGlvbl9kYXlzKSwgMTApO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoZGF5cykpIHtcbiAgICAgIGRyLmV4cGVjdGVkU3VwcGx5RHVyYXRpb24gPSB7XG4gICAgICAgIHZhbHVlOiBkYXlzLFxuICAgICAgICB1bml0OiBcImRheXNcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogXCJkXCIsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICAvLyBJbnBhdGllbnQgZHJ1Z3M6IE5ISSBidW5kbGVzIGV2ZXJ5IGRydWcgdXNlZCBkdXJpbmcgYW4gYWRtaXNzaW9uIGludG9cbiAgLy8gb25lIHJvdyBkYXRlZCB0byB0aGUgYWRtaXNzaW9uIGRheS4gYXV0aG9yZWRPbiBjYXJyaWVzIHRoYXQgYW5jaG9yO1xuICAvLyB2YWxpZGl0eVBlcmlvZCBleHByZXNzZXMgdGhlIGFjdHVhbCB1c2FnZSB3aW5kb3cgW2FkbWl0LCBkaXNjaGFyZ2VdXG4gIC8vIHNvIFNNQVJUIGFwcHMgZGlzcGxheSBcInVzZWQgZHVyaW5nIHN0YXkgNS8xOC01LzIyXCIgaW5zdGVhZCBvZlxuICAvLyBcImFsbCAxNCBkcnVncyBwcmVzY3JpYmVkIG9uIDUvMThcIi4gT1BEIC8gXHU4NUU1XHU1QzQwIHJvd3MgbGVhdmUgZW5kX2RhdGVcbiAgLy8gZW1wdHkgc28gdGhpcyBibG9jayBkb2Vzbid0IGZpcmUgXHUyMDE0IHNpbmdsZS1kYXkgcHJlc2NyaXB0aW9ucyByZW1haW5cbiAgLy8gdW5jaGFuZ2VkLiBUaGUgTWVkaWNhdGlvblJlcXVlc3QuZGlzcGVuc2VSZXF1ZXN0LnZhbGlkaXR5UGVyaW9kIGZpZWxkXG4gIC8vIGlzIGEgc2VtYW50aWMgc3RyZXRjaCAoaXRzIHN0cmljdCBkZWZpbml0aW9uIGlzIHRoZSBwcmVzY3JpcHRpb24nc1xuICAvLyBzdGFsZS1kYXRpbmcgd2luZG93KSBidXQgaXMgdGhlIGNsb3Nlc3QgZXhpc3RpbmcgZmllbGQ7IHdlIGRvbid0XG4gIC8vIGVtaXQgTWVkaWNhdGlvbkFkbWluaXN0cmF0aW9uIHJlc291cmNlcy5cbiAgY29uc3QgZW5kRGF0ZSA9ICgocmF3LmVuZF9kYXRlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAocmF3LmRhdGUgJiYgZW5kRGF0ZSAmJiBlbmREYXRlICE9PSByYXcuZGF0ZSkge1xuICAgIGRyLnZhbGlkaXR5UGVyaW9kID0ge1xuICAgICAgc3RhcnQ6IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGAsXG4gICAgICBlbmQ6IGAke2VuZERhdGV9VDIzOjU5OjU5KzA4OjAwYCxcbiAgICB9O1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkcikubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRpc3BlbnNlUmVxdWVzdCA9IGRyO1xuICB9XG5cbiAgY29uc3QgaW5kaWNhdGlvbiA9ICgocmF3LmluZGljYXRpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25aaCA9ICgocmF3LmluZGljYXRpb25femggPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25Db2RlID0gKChyYXcuaW5kaWNhdGlvbl9jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uWmggfHwgaW5kaWNhdGlvbkNvZGUpIHtcbiAgICBjb25zdCByYzogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChpbmRpY2F0aW9uQ29kZSkge1xuICAgICAgcmMuY29kaW5nID0gW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBzeXN0ZW1zLklDRF8xMF9DTSxcbiAgICAgICAgICBjb2RlOiBub3JtYWxpemVJY2QxMENtKGluZGljYXRpb25Db2RlKSxcbiAgICAgICAgICBkaXNwbGF5OiBpbmRpY2F0aW9uIHx8IGluZGljYXRpb25aaCB8fCBpbmRpY2F0aW9uQ29kZSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICAgIC8vIFBhdGllbnQtZmFjaW5nIHJlYXNvbkNvZGUgdGV4dDogcHJlZmVyIFx1N0U0MVx1NEUyRCBJQ0QgZGVzY3JpcHRpb24sIGZhbGxcbiAgICAvLyBiYWNrIHRvIEVuZ2xpc2gsIHRoZW4gdG8ganVzdCB0aGUgY29kZS4gQWx3YXlzIHByZWZpeGVkIHdpdGggdGhlXG4gICAgLy8gY29kZSBzbyBTTUFSVCBhcHAgcmVuZGVyaW5nIGtlZXBzIFwiPGNvZGU+IDxuYW1lPlwiIHNoYXBlLlxuICAgIGNvbnN0IG5hbWVaaCA9IGluZGljYXRpb25aaCB8fCBpbmRpY2F0aW9uO1xuICAgIGlmIChuYW1lWmgpIHtcbiAgICAgIHJjLnRleHQgPSBpbmRpY2F0aW9uQ29kZSA/IGAke2luZGljYXRpb25Db2RlfSAke25hbWVaaH1gLnRyaW0oKSA6IG5hbWVaaDtcbiAgICB9XG4gICAgcmVzb3VyY2UucmVhc29uQ29kZSA9IFtyY107XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8qKlxuICogR3JvdXAtYXdhcmUgbWVkaWNhdGlvbiBtYXBwZXIgdGhhdCBkZWR1cGVzIFx1NEUyRFx1ODJGMSBcdTk2RDlcdThBOUUgZHVwbGljYXRlcy5cbiAqXG4gKiBTdHJhdGVneTpcbiAqICAgMS4gQ29tcHV0ZSBjYW5vbmljYWwga2V5IHBlciBkcnVnIG5hbWUgKGxvbmdlc3QgRW5nbGlzaCBjaHVuaykuXG4gKiAgIDIuIEdyb3VwIGJ5IChkYXRlLCBjYW5vbmljYWxfa2V5KS4gS2VlcCBPTkUgZW50cnkgcGVyIGdyb3VwLFxuICogICAgICBwcmVmZXJyaW5nIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmRcbiAqICAgICAgbmFtZSBcdTIwMTQgY2xpbmljaWFucyBzY2FuIEVuZ2xpc2ggZmlyc3QpLlxuICogICAzLiBNYXAgZWFjaCBrZXB0IGVudHJ5IHRocm91Z2ggbWFwTWVkaWNhdGlvblJlcXVlc3QuXG4gKlxuICogTm90ZTogUHl0aG9uIGNvbW1lbnQgc2F5cyBcIm1vcmUgQ0pLXCIgYnV0IHRoZSBjb2RlIHVzZXMgYDxgIChmZXdlcik7XG4gKiB3ZSBwcmVzZXJ2ZSB0aGUgYWN0dWFsIGNvZGUgYmVoYXZpb3VyIHRvIGtlZXAgcGFyaXR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTWVkaWNhdGlvbnNEZWR1cChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBkcnVnTmFtZSA9ICgoaXRlbS5kcnVnX25hbWUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gICAgaWYgKCFkcnVnTmFtZSkgY29udGludWU7XG4gICAgY29uc3QgZGF0ZVBhcnQgPSAoKGl0ZW0uZGF0ZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnNsaWNlKDAsIDEwKTtcbiAgICBjb25zdCBrZXkgPSBgJHtkYXRlUGFydH18JHtjYW5vbmljYWxEcnVnS2V5KGRydWdOYW1lKX1gO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQcmVmZXIgdGhlIGZvcm0gd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBicmFuZCBuYW1lKS5cbiAgICAgIGlmIChjamtDaGFycyhkcnVnTmFtZSkgPCBjamtDaGFycyhleGlzdGluZy5kcnVnX25hbWUgPz8gXCJcIikpIHtcbiAgICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgbSA9IG1hcE1lZGljYXRpb25SZXF1ZXN0KGl0ZW0sIHBhdGllbnRJZCk7XG4gICAgaWYgKG0gIT09IG51bGwpIG91dC5wdXNoKG0pO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCAiLyoqXG4gKiBMT0lOQyBtYXBwaW5nIHRhYmxlcyBmb3IgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgTE9JTkMgUjQgY29kaW5ncy5cbiAqXG4gKiBQdXJlIGRhdGEsIG5vIGxvZ2ljLiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvX2xvaW5jX3RhYmxlcy5weWAuXG4gKi9cblxuLy8gXHUyNTAwXHUyNTAwIF9OSElfVE9fTE9JTkMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBwcmltYXJ5IExPSU5DIG1hcHBpbmcuIFNvdXJjZSBvZiB0cnV0aDpcbi8vIFRXTkhJRkhJUiBQQVMgSW1wbGVtZW50YXRpb24gR3VpZGUgQ29uY2VwdE1hcC1uaGktbG9pbmNcbi8vIGh0dHBzOi8vYnVpbGQuZmhpci5vcmcvaWcvVFdOSElGSElSL3Bhcy9Db25jZXB0TWFwLW5oaS1sb2luYy5odG1sXG4vL1xuLy8gVGhhdCBDb25jZXB0TWFwIGRlY2xhcmVzIDUzIE5ISSBjb2RlcyB3aXRoIGBlcXVpdmFsZW5jZTogcmVsYXRlZHRvYFxuLy8gYWdhaW5zdCA4MDYgTE9JTkMgdmFyaWFudHMgKGRpZmZlcmVudCBzcGVjaW1lbnMgLyB1bml0cyAvIG1ldGhvZHNcbi8vIHBlciBOSEkgY29kZSBcdTIwMTQgY29uZmlybWluZyB0aGUgXCJOSEkgaXMgY29hcnNlLCBMT0lOQyBpcyBmaW5lXCIgdmlldykuXG4vLyBGb3IgZWFjaCBOSEkgY29kZSB3ZSBoYW5kLXBpY2sgdGhlIGNhbm9uaWNhbCBMT0lOQyBtb3N0IGNsaW5pY2lhbnNcbi8vIHdvdWxkIGV4cGVjdCBpbiBhIFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBsYWIgcmVwb3J0OiBTZXJ1bS9QbGFzbWEgKyBNYXNzLXZvbHVtZVxuLy8gKG9yIGF1dG8tY291bnQgZm9yIGNlbGwgY291bnRlcnMpLiBFZGdlIGNhc2VzIG5vdGVkIGlubGluZS5cbmV4cG9ydCBjb25zdCBOSElfVE9fTE9JTkM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBIYWVtYXRvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwODAwMkNcIjogXCI2NjkwLTJcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4IFx1MjAxNCBMZXVrb2N5dGVzICMvdm9sIEJsb29kIEF1dG9cbiAgXCIwODAwM0NcIjogXCI3MTgtN1wiLCAvLyBcdTg4NDBcdTgyNzJcdTdEMjBcdTZBQTJcdTY3RTUgXHUyMDE0IEhlbW9nbG9iaW4gTWFzcy92b2wgQmxvb2RcbiAgXCIwODAwNkNcIjogXCI3NzctM1wiLCAvLyBcdTg4NDBcdTVDMEZcdTY3N0ZcdThBMDhcdTY1NzggXHUyMDE0IFBsYXRlbGV0cyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMTNDXCI6IFwiNTcwMjEtOFwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdTUyMDZcdTk4NUVcdThBMDhcdTY1NzggXHUyMDE0IENCQyBXIEF1dG8gRGlmZiBwYW5lbFxuICBcIjA4MTI4QlwiOiBcIjQ3Mjg2LTBcIiwgLy8gXHU5QUE4XHU5QUQzXHU3RDMwXHU4MERFXHU1RjYyXHU2MTRCXHU1MjI0XHU4QjgwXHU1NDA4XHU0Rjc1XHU3RDMwXHU4MERFXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4XG4gIC8vIFx1MjUwMFx1MjUwMCBDaGVtaXN0cnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMTFDXCI6IFwiMTc4NjEtNlwiLCAvLyBcdTkyMjMgXHUyMDE0IENhbGNpdW0gTWFzcy92b2wgUy9QXG4gIFwiMDkwMTVDXCI6IFwiMjE2MC0wXCIsIC8vIFx1ODA4Q1x1OTE3OFx1OTE1MFx1MzAwMVx1ODg0MCBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxNkNcIjogXCIyMTYxLThcIiwgLy8gXHU4MDhDXHU5MTUwXHUzMDAxXHU1QzNGIFx1MjAxNCBDcmVhdGluaW5lIE1hc3Mvdm9sIFVyaW5lXG4gIFwiMDkwMjVDXCI6IFwiMTkyMC04XCIsIC8vIEFTVC9HT1QgXHUyMDE0IEFzcGFydGF0ZSBhbWlub3RyYW5zZmVyYXNlIEFjdCBTL1BcbiAgXCIwOTAyNkNcIjogXCIxNzQyLTZcIiwgLy8gQUxUL0dQVCBcdTIwMTQgQWxhbmluZSBhbWlub3RyYW5zZmVyYXNlIEFjdCBTL1BcbiAgXCIwOTAyOUNcIjogXCIxOTc1LTJcIiwgLy8gXHU4MUJEXHU3RDA1XHU3RDIwXHU3RTNEXHU5MUNGIFx1MjAxNCBCaWxpcnViaW4gdG90YWwgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzBDXCI6IFwiMTk2OC03XCIsIC8vIFx1NzZGNFx1NjNBNVx1ODFCRFx1N0QwNVx1N0QyMCBcdTIwMTQgQmlsaXJ1YmluIGRpcmVjdCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzM0NcIjogXCIyNTMyLTBcIiwgLy8gXHU0RTczXHU5MTc4XHU4MTJCXHU2QzJCXHU4MTIyIFx1MjAxNCBMREggQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzhDXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RCBcdTIwMTQgQWxidW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTEzOENcIjogXCIzNTY3Mi01XCIsIC8vIFx1NzZGNFx1NjNBNS9cdTdFM0RcdTgxQkRcdTdEMDVcdTdEMjBcdTZCRDRcdTUwM0NcbiAgXCIxMjExMkJcIjogXCIxNzUxLTdcIiwgLy8gXHU3NjdEXHU4NkNCXHU3NjdEKFx1NTE0RFx1NzVBQlx1NkJENFx1NkZDMVx1NkNENSkgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMjQwMDdCXCI6IFwiMTk5NS0wXCIsIC8vIFx1ODg0MFx1NkYzRlx1NkUzOFx1OTZFMlx1OTIyMyBcdTIwMTQgQ2FsY2l1bSBpb25pemVkIE1vbGVzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEhvcm1vbmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTIxQ1wiOiBcIjI5ODYtOFwiLCAvLyBcdTc3NkFcdTRFMzhcdTkxNkZcdTkxODdcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IFRlc3Rvc3Rlcm9uZSBNYXNzL3ZvbCBTL1BcbiAgXCIyNzAyMUJcIjogXCIyOTkxLThcIiwgLy8gXHU3NzZBXHU0RTM4XHU4MTAyXHU5MTg3XHU2NTNFXHU1QzA0XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgRnJlZSBTL1BcbiAgLy8gMDkxMjVDIC8gMDkxMjdDIGNvcnJlY3RlZCBhZnRlciBkdWFsLXJldmlld2VyIGF1ZGl0IFx1MjAxNCB0aGUgZWFybGllclxuICAvLyB2YWx1ZXMgKDMwMTYtMyB3YXMgVFNILCAxMDUwMS01IHdhcyBMSCkgd2VyZSBqdXN0IHdyb25nIGNvcHktXG4gIC8vIHBhc3Rlcy4gU291cmNlIGZvciB0aGUgbmV3IHZhbHVlczogVFdOSElGSElSIFBBUyBDb25jZXB0TWFwLlxuICBcIjA5MTI1Q1wiOiBcIjgzMDk4LTRcIiwgLy8gXHU2RkZFXHU2Q0UxXHU1MjNBXHU2RkMwXHU3RDIwXHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBGb2xsaXRyb3BpbiAoRlNIKSBJbW11bm9hc3NheSBTL1BcbiAgXCIwOTEyN0NcIjogXCI4MzA5Ni04XCIsIC8vIFx1NEU4Q1x1NkMyQlx1NTdGQVx1NjYyNVx1NjBDNVx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRXN0cmFkaW9sIEltbXVub2Fzc2F5IFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVHVtb3IgbWFya2VycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjAwN0NcIjogXCIxODM0LTFcIiwgLy8gXHUwM0IxLVx1ODBDRVx1NTE1Mlx1ODZDQlx1NzY3RCAoQUZQKSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMjcwNDlDXCI6IFwiMTgzNC0xXCIsIC8vIFx1NzUzMi1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCwgUklBKVxuICBcIjEyMDgxQ1wiOiBcIjgzMTEyLTNcIiwgLy8gUFNBIChFSUEvTElBKSBcdTIwMTQgTWFzcy92b2wgUy9QIEltbXVub2Fzc2F5XG4gIFwiMTIxOThDXCI6IFwiODMxMTMtMVwiLCAvLyBGcmVlIFBTQSBcdTIwMTQgTWFzcy92b2wgUy9QIEltbXVub2Fzc2F5XG4gIFwiMjcwNTJDXCI6IFwiMjg1Ny0xXCIsIC8vIFx1NjUxRFx1OEI3N1x1ODE3QVx1NzI3OVx1NzU3MFx1NjI5N1x1NTM5RiAoUFNBKSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMjcwODNCXCI6IFwiMTA4ODYtMFwiLCAvLyBcdTZFMzhcdTk2RTJQU0EgKFJJQSlcbiAgLy8gMTIwNTJCIFx1MDNCMjItXHU1RkFFXHU3NDAzXHU4NkNCXHU3NjdEIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byAxMDg3My04IHdoaWNoIGlzIGFjdHVhbGx5XG4gIC8vICdCZXRhLTItTWljcm9nbG9idWxpbiBbTWFzcy90aW1lXSBpbiAyNCBob3VyIFVyaW5lJyAodGltZWQgdXJpbmVcbiAgLy8gY29sbGVjdGlvbiwgdmVyaWZpZWQgbG9pbmMub3JnLzEwODczLTgvKS4gVGFpd2FuIDEyMDUyQiBiaWxsaW5nIGlzXG4gIC8vIHR5cGljYWxseSBhIHNlcnVtIG9yZGVyOyAxOTUyLTEgaXMgdGhlIHZlcmlmaWVkIHNlcnVtLW9yLXBsYXNtYSBMT0lOQ1xuICAvLyAoQ29tcG9uZW50PUJldGEtMi1NaWNyb2dsb2J1bGluLCBQcm9wZXJ0eT1NQ25jKSBcdTIwMTQgbG9pbmMub3JnLzE5NTItMS8uXG4gIFwiMTIwNTJCXCI6IFwiMTk1Mi0xXCIsIC8vIFx1MDNCMjItbWljcm9nbG9idWxpbiBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBJbW11bm9sb2d5IC8gcHJvdGVpbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwNjVCXCI6IFwiOTA5OTEtMVwiLCAvLyBcdTg2Q0JcdTc2N0RcdTk2RkJcdTZDRjNcdTUyMDZcdTY3OTBcbiAgLy8gMTIwMjhCIC8gMTIwMjlCIElnTSAoc2VydW0sIGltbXVub2RpZmZ1c2lvbiAvIG5lcGhlbG9tZXRyeSkgXHUyMDE0IHByZXZpb3VzbHlcbiAgLy8gYm90aCBtYXBwZWQgdG8gTE9JTkMgMTQwMDItMCB3aGljaCBpcyBhY3R1YWxseSAnSWdNIFtVbml0cy92b2x1bWVdIGluXG4gIC8vIENvcmQgYmxvb2QnIChuZW9uYXRhbCBzcGVjaW1lbiwgdmVyaWZpZWQgbG9pbmMub3JnLzE0MDAyLTAvKS4gV3JvbmdcbiAgLy8gc3BlY2ltZW4gZm9yIGFuIGFkdWx0IHNlcnVtIG9yZGVyLiBMZWF2aW5nIHVubWFwcGVkOyBmYWxscyB0aHJvdWdoIHRvXG4gIC8vIE5ISS1jb2RlLW9ubHkgY29kaW5nLiBTZWUgZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kLlxuICBcIjEyMTAzQlwiOiBcIjk1ODAxLTdcIiwgLy8gXHU1MTREXHU3NUFCXHU5NkZCXHU2Q0YzXHU1MjA2XHU2NzkwXG4gIFwiMTIxNjBCXCI6IFwiMTUxODktNFwiLCAvLyBJZ0cgXHUwM0JBL1x1MDNCQlxuICBcIjEyMTcxQlwiOiBcIjE3MzUxLThcIiwgLy8gXHU2Mjk3XHU1NURDXHU0RTJEXHU2MDI3XHU3NDAzXHU3RDMwXHU4MERFXHU4Q0VBXHU2Mjk3XHU5QUQ0IChBTkNBKVxuICBcIjEyMjA0QlwiOiBcIjIwNTg0LTlcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU4ODY4XHU5NzYyXHU2QTE5XHU4QTE4XG4gIFwiMjUwMTNCXCI6IFwiNDQ1OTYtNVwiLCAvLyBcdTg3QTJcdTUxNDlcdTUyMDdcdTcyNDdcdTZBQTJcdTY3RTVcbiAgLy8gXHUyNTAwXHUyNTAwIEhlcGF0aXRpcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNDAzMENcIjogXCI1MTk1LTNcIiwgLy8gSEJzQWdcbiAgXCIxNDAzMUNcIjogXCI1MTk1LTNcIiwgLy8gSEJzQWdcbiAgXCIxNDAzMkNcIjogXCI1MTk2LTFcIiwgLy8gSEJzQWcgKE1hc3Mvdm9sKVxuICBcIjE0MDUxQ1wiOiBcIjEzOTU1LTBcIiwgLy8gSENWIEFiXG4gIFwiMjcwMzNDXCI6IFwiNTE5Ny05XCIsIC8vIEhCc0FnIFJJQVxuICAvLyBcdTI1MDBcdTI1MDAgUGF0aG9sb2d5IC8gY3l0b2xvZ3kgLyBJSEMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIxOTVCXCI6IFwiMTg0NzQtN1wiLCAvLyBIZXItMi9uZXUgSVNIXG4gIFwiMjcwNjFCXCI6IFwiMTQxMzAtOVwiLCAvLyBcdTUyRDVcdTYwQzVcdTZGQzBcdTdEMjBcdTYzQTVcdTUzRDdcdTlBRDQgKEVSKVxuICBcIjI3MDYyQlwiOiBcIjEwODYxLTNcIiwgLy8gXHU5RUMzXHU5QUQ0XHU2RkMwXHU3RDIwXHU2M0E1XHU1M0Q3XHU5QUQ0IChQUilcbiAgXCIzMDEwM0JcIjogXCI4MzA1Mi0xXCIsIC8vIFBELUwxIElIQ1xuICAvLyBcdTI1MDBcdTI1MDAgQXVkaW9sb2d5IC8gcHVsbW9uYXJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE3MDA5QlwiOiBcIjI0MzQxLTBcIiwgLy8gXHU0RTAwXHU2QzI3XHU1MzE2XHU3OEIzXHU4MEJBXHU3MDMwXHU2NTYzXHU5MUNGXG4gIFwiMjIwMDFDXCI6IFwiNDU0OTgtM1wiLCAvLyBcdTdEMTRcdTk3RjNcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgXCIyMjAxNUJcIjogXCI0NTQ5OC0zXCIsIC8vIFx1OEE1MFx1ODA3RVx1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICBcIjIyMDI1QlwiOiBcIjQ2NTMwLTJcIiwgLy8gXHU4MUVBXHU4QTE4XHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIC8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuICAvLyBTVVBQTEVNRU5UQUwgKG5vdCBpbiBQQVMgQ29uY2VwdE1hcCBcdTIwMTQgaGFuZC1jdXJhdGVkIGZyb20gY29tbW9uXG4gIC8vIE5ISSBjb2RlcyBzZWVuIGluIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QS4gTE9JTkMgdmVyaWZpZWQgYWdhaW5zdCBsb2luYy5vcmdcbiAgLy8gY2Fub25pY2FsIG5hbWVzLiBNZXRob2Qtc3BlY2lmaWMgY29kZXMgKGUuZy4gaHMtQ1JQKSBwaWNrIHRoZVxuICAvLyBzcGVjaWZpYyBMT0lOQzsgZ2VuZXJhbC1tZXRob2QgY29kZXMgcGljayB0aGUgbW9zdCBjb21tb24gZm9ybS5cbiAgLy8gSWYgXHU1MDY1XHU0RkREXHU3RjcyIHB1Ymxpc2hlcyBhbiBhdXRob3JpdGF0aXZlIGJyb2FkZXIgQ29uY2VwdE1hcCBsYXRlcixcbiAgLy8gcmVwbGFjZSB0aGlzIHNlY3Rpb24gaW4gb25lIHBhc3MuXG4gIC8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSAvIEhiQTFjIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDA1Q1wiOiBcIjE1NTgtNlwiLCAvLyBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDYgKEdsdS1BQykgXHUyMDE0IEZhc3RpbmcgZ2x1Y29zZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTE0MENcIjogXCIyMzQ1LTdcIiwgLy8gXHU4ODQwXHU3Q0Q2LVx1OTkxMFx1NUY4Qy9cdTk2QThcdTZBNUYgXHUyMDE0IEdsdWNvc2UgTWFzcy92b2wgUy9QIChnZW5lcmFsKVxuICBcIjA5MDA2Q1wiOiBcIjQ1NDgtNFwiLCAvLyBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjAgKEhiQTFjKSBcdTIwMTQgSGVtb2dsb2JpbiBBMWMvSGdiLnRvdGFsIEJsb29kXG4gIC8vIFx1MjUwMFx1MjUwMCBSZW5hbCAvIGVsZWN0cm9seXRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwMkNcIjogXCIzMDk0LTBcIiwgLy8gQlVOIFx1MjAxNCBVcmVhIG5pdHJvZ2VuIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDEzQ1wiOiBcIjMwODQtMVwiLCAvLyBVcmljIEFjaWQgXHUyMDE0IFVyYXRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDIxQ1wiOiBcIjI5NTEtMlwiLCAvLyBOYSBcdTIwMTQgU29kaXVtIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAyMkNcIjogXCIyODIzLTNcIiwgLy8gSyAgXHUyMDE0IFBvdGFzc2l1bSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMjRDXCI6IFwiMjAyOC05XCIsIC8vIENPMiBcdTIwMTQgQ2FyYm9uIGRpb3hpZGUgTW9sZXMvdm9sIFMvUFxuICBcIjA5MDEyQ1wiOiBcIjI3NzctMVwiLCAvLyBJbm9yZ2FuaWMgUCBcdTIwMTQgUGhvc3BoYXRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQ2QlwiOiBcIjE5MTIzLTlcIiwgLy8gTWcgXHUyMDE0IE1hZ25lc2l1bSBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIExpcGlkIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDAxQ1wiOiBcIjIwOTMtM1wiLCAvLyBULUNob2xlc3Rlcm9sIFx1MjAxNCBDaG9sZXN0ZXJvbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAwNENcIjogXCIyNTcxLThcIiwgLy8gVEcgXHUyMDE0IFRyaWdseWNlcmlkZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0M0NcIjogXCIyMDg1LTlcIiwgLy8gSERMIFx1MjAxNCBIREwgY2hvbGVzdGVyb2wgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDRDXCI6IFwiMTM0NTctN1wiLCAvLyBMREwgXHUyMDE0IExETCBjaG9sZXN0ZXJvbCAoY2FsY3VsYXRlZCkgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXZlciBmdW5jdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAyN0NcIjogXCI2NzY4LTZcIiwgLy8gQUxLLVAgXHUyMDE0IEFsa2FsaW5lIHBob3NwaGF0YXNlIEFjdGl2aXR5IFMvUFxuICBcIjA5MDMxQ1wiOiBcIjIzMjQtMlwiLCAvLyBcdTAzQjMtR1QgXHUyMDE0IEdhbW1hIGdsdXRhbXlsIHRyYW5zZmVyYXNlIEFjdGl2aXR5IFMvUFxuICBcIjA5MDM1Q1wiOiBcIjI1MDAtN1wiLCAvLyBUSUJDIFx1MjAxNCBJcm9uIGJpbmRpbmcgY2FwYWNpdHkgTWFzcy92b2wgUy9QXG4gIC8vIDA5MDM3QyBcdTg4NDBcdTZDMjggXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDE4MjctNSB3aGljaCBpcyBhY3R1YWxseVxuICAvLyAnQWxwaGEgMSBhbnRpdHJ5cHNpbiBNUyBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYScgKHZlcmlmaWVkXG4gIC8vIGxvaW5jLm9yZy8xODI3LTUvKS4gV3JvbmcgYW5hbHl0ZSBlbnRpcmVseS4gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHNcbiAgLy8gdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy4gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIwOTA2NENcIjogXCIzMDQwLTNcIiwgLy8gTGlwYXNlIFx1MjAxNCBBY3Rpdml0eSBTL1BcbiAgXCIwOTA1OUJcIjogXCIxNDExOC00XCIsIC8vIExhY3RhdGUgXHUyMDE0IE1hc3Mvdm9sIFBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgSGVtYXRvbG9neSBleHRyYXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDRDXCI6IFwiNDU0NC0zXCIsIC8vIEhDVCBcdTIwMTQgSGVtYXRvY3JpdCB2b2x1bWUgZnJhY3Rpb24gQmxvb2RcbiAgXCIwODAwOENcIjogXCIxNDE5Ni0wXCIsIC8vIFJldGljdWxvY3l0ZSBcdTIwMTQgUmV0aWN1bG9jeXRlcy8xMDAgUkJDXG4gIFwiMDgwMTBDXCI6IFwiNzExLTJcIiwgLy8gRW9zaW5vcGhpbCBjb3VudCBcdTIwMTQgIy92b2wgQmxvb2RcbiAgXCIwODAxMUNcIjogXCIyNDMxNy0wXCIsIC8vIENCQyBwYW5lbCBcdTIwMTQgSGVtYXRvbG9neSBwYW5lbCBCbG9vZFxuICBcIjA4MDI2Q1wiOiBcIjYzMDEtNlwiLCAvLyBQVC9JTlIgXHUyMDE0IElOUiBQbGF0ZWxldCBwb29yIHBsYXNtYVxuICBcIjA4MDM2Q1wiOiBcIjE0OTc5LTlcIiwgLy8gQVBUVCBcdTIwMTQgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODA3NUNcIjogXCIyNjkyLTdcIiwgLy8gT3Ntb2xhbGl0eSBcdTIwMTQgU2VydW0gb3IgUGxhc21hXG4gIFwiMDgwNzlCXCI6IFwiMzAyNDAtNlwiLCAvLyBELWRpbWVyIFx1MjAxNCBQbHQgcG9vciBwbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIFRoeXJvaWQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEZyZWUgVDQgaGFzIFRXTyB2YWxpZCBMT0lOQ3MgdGhhdCBkaWZmZXIgb25seSBpbiB1bml0LXN5c3RlbTpcbiAgLy8gICAzMDI0LTcgIENvbXBvbmVudD1UaHlyb3hpbmUuZnJlZSwgUHJvcGVydHk9TUNuYyAoTWFzcyBjb25jLCBuZy9kTClcbiAgLy8gICAxNDkyMC0zIENvbXBvbmVudD1UaHlyb3hpbmUuZnJlZSwgUHJvcGVydHk9U0NuYyAoTW9sYXIgY29uYywgcG1vbC9MKVxuICAvLyBCb3RoIGFyZSBGcmVlIFQ0IFx1MjAxNCBuZWl0aGVyIGlzIFRvdGFsIFQ0LiBFYXJsaWVyIGhpc3Rvcnk6XG4gIC8vICAgLSBPcmlnaW5hbCBtYXBwaW5nIHdhcyAzMDI0LTcgKGNvcnJlY3Q6IG1hdGNoZXMgVGFpd2FuIG5nL2RMIGxhYnMpLlxuICAvLyAgIC0gQ29tbWl0IDlkYTVlNWIgY2hhbmdlZCBpdCB0byAxNDkyMC0zIG9uIHRoZSBwcmVtaXNlIHRoYXQgMzAyNC03XG4gIC8vICAgICB3YXMgVG90YWwgVDQuIFRoYXQgcHJlbWlzZSB3YXMgaW52ZXJ0ZWQgKHZlcmlmaWVkIGxvaW5jLm9yZy8zMDI0LTcvXG4gIC8vICAgICBcdTIwMTQgQ29tcG9uZW50IGlzIFwiVGh5cm94aW5lLmZyZWVcIik7IHRoZSBjaGFuZ2UgaW50cm9kdWNlZCBhIExPSU5DXHUyMTk0dW5pdFxuICAvLyAgICAgbWlzbWF0Y2ggKG1vbGFyIExPSU5DIHBhaXJlZCB3aXRoIGEgbmcvZEwgdmFsdWUpLlxuICAvLyAgIC0gUmVzdG9yaW5nIDMwMjQtNyBoZXJlIHNvIHRoZSBMT0lOQydzIHByb3BlcnR5IGNsYXNzIChNQ25jKSBtYXRjaGVzXG4gIC8vICAgICB0aGUgdW5pdCBmaWVsZCAobmcvZEwpIFRhaXdhbiBsYWJzIHNoaXAuIFNlZSBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWRcbiAgLy8gICAgIHNlY3Rpb24gRiBmb3IgZnVsbCBldmlkZW5jZS5cbiAgXCIwOTEwNkNcIjogXCIzMDI0LTdcIiwgLy8gRnJlZSBUNCBcdTIwMTQgVGh5cm94aW5lIChUNCkgZnJlZSBbTWFzcy92b2x1bWVdIFMvUFxuICBcIjA5MTEyQ1wiOiBcIjMwMTYtM1wiLCAgLy8gVFNIIFx1MjAxNCBUaHlyb3Ryb3BpbiBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRpYWMgbWFya2VycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTA5OUNcIjogXCIxMDgzOS05XCIsIC8vIFRyb3BvbmluIEkgXHUyMDE0IFRyb3BvbmluIEkgY2FyZGlhYyBTL1BcbiAgXCIxMjE5MkNcIjogXCIzMzk1OS04XCIsIC8vIFByb2NhbGNpdG9uaW4gXHUyMDE0IFMvUFxuICBcIjEyMTkzQ1wiOiBcIjMzNzYyLTZcIiwgLy8gTlQtcHJvQk5QIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFZpdGFtaW5zIC8gY29mYWN0b3JzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTI5Q1wiOiBcIjIxMzItOVwiLCAvLyBWaXQgQjEyIFx1MjAxNCBDb2JhbGFtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzBDXCI6IFwiMjI4NC04XCIsIC8vIEZvbGF0ZSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMDkxMTNDXCI6IFwiMjE0My02XCIsIC8vIENvcnRpc29sIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjExNkNcIjogXCIyMjc2LTRcIiwgLy8gRmVycml0aW4gXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQWN1dGUgcGhhc2UgLyBpbmZsYW1tYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEyMDE1QyBpcyB0aGUgZ2VuZXJpYyBOSEkgQ1JQIG9yZGVyIFx1MjAxNCBtb3N0IGNsaW5pY2FsIGNvbnRleHRzIGluIFx1NTA2NVx1NEZERFxuICAvLyBzZW5kIGEgcmVndWxhciAobm90IGhzLSkgQ1JQLCBzbyBtYXAgdG8gMTk4OC01LiBJZiBhIFx1OTY2Mlx1NjI0MCBzcGVjaWZpY2FsbHlcbiAgLy8gYmlsbHMgaHMtQ1JQIGl0IHdpbGwgbGFuZCBvbiBhIGRpZmZlcmVudCBjb2RlIChlLmcuIDEyMTg5QykuXG4gIFwiMTIwMTVDXCI6IFwiMTk4OC01XCIsIC8vIENSUCBcdTIwMTQgQyByZWFjdGl2ZSBwcm90ZWluIE1hc3Mvdm9sIFMvUFxuICBcIjEyMDUzQ1wiOiBcIjUwNDgtNFwiLCAvLyBBTkEgXHUyMDE0IEFudGludWNsZWFyIEFiIFRpdGVyIFMvUFxuICBcIjEyMDU2QlwiOiBcIjE2MTI0LTBcIiwgLy8gQW50aS1taXRvY2hvbmRyaWFsIEFiIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwNjAxMkNcIjogXCI1Nzc4LTZcIiwgLy8gVXJpbmUgYXBwZWFyYW5jZSBcdTIwMTQgQ29sb3JcbiAgXCIwNjAxM0NcIjogXCIyNDM1Ni04XCIsIC8vIFx1NUMzRlx1NzUxRlx1NTMxNiBwYW5lbCBcdTIwMTQgVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA3MDAxQ1wiOiBcIjE0NTYzLTFcIiwgLy8gU3Rvb2wgb2NjdWx0IGJsb29kXG4gIFwiMDkxMzRDXCI6IFwiNTg0NTMtMlwiLCAvLyBpRk9CVCBxdWFudGl0YXRpdmUgXHUyMDE0IEhlbW9nbG9iaW4gTWFzcy92b2wgU3Rvb2wgYnkgSUFcbiAgXCIxMjExMUNcIjogXCIyMTYxLThcIiwgLy8gVXJpbmUgQ3JlYXRpbmluZSBcdTIwMTQgc2FtZSBMT0lOQyBhcyAwOTAxNkNcbiAgLy8gXHUyNTAwXHUyNTAwIFNlcm9sb2d5IC8gaW1tdW5vbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjAwMUNcIjogXCI1MjkyLThcIiwgLy8gUlBSIFx1MjAxNCBTZXJ1bS9QbGFzbWFcbiAgXCIxMjAyMUNcIjogXCIyMDM5LTZcIiwgLy8gQ0VBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyNUJcIjogXCIyNDY1LTNcIiwgLy8gSWdHIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyN0JcIjogXCIyNDU4LThcIiwgLy8gSWdBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAzMUNcIjogXCIxOTExMy0wXCIsIC8vIElnRSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIDEyMDY5QiBDcnlwdG9jb2NjdXMgQWcgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDUxMzItNiB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnRE5BIHNpbmdsZSBzdHJhbmQgQWIgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0nIChhbnRpLXNzRE5BLFxuICAvLyBsdXB1cyBzZXJvbG9neSBcdTIwMTQgdmVyaWZpZWQgbG9pbmMub3JnLzUxMzItNi8pLiBDb21wbGV0ZWx5IHdyb25nXG4gIC8vIGFuYWx5dGUuIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuXG4gIC8vIFNlZSBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWQuXG4gIFwiMTIwNzlDXCI6IFwiMjQxMDgtM1wiLCAvLyBDQSAxOS05IFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEJsb29kIHR5cGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTEwMDFDXCI6IFwiODgyLTFcIiwgLy8gXHU4ODQwXHU1NzhCXHU5NDUxXHU1QjlBIFx1MjAxNCBBQk8gKyBSaCBncm91cFxuICBcIjExMDAzQ1wiOiBcIjg4Mi0xXCIsIC8vIFx1ODg0MFx1NTc4Qlx1OTQ1MVx1NUI5QSBcdTIwMTQgQUJPICsgUmggZ3JvdXBcbiAgXCIxMTAwNENcIjogXCI4OTAtNFwiLCAvLyBcdTYyOTdcdTlBRDRcdTUzQ0RcdTYxQzkgXHUyMDE0IEFudGlib2R5IHNjcmVlblxuICAvLyBcdTI1MDBcdTI1MDAgTWljcm9iaW9sb2d5IGN1bHR1cmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxMzAwN0MgXHU3RDMwXHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAxNDIxOS0wIHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdIVExWIEkgcDI2IEFiIGluIFNlcnVtJyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gVGhlXG4gIC8vIHJpZ2h0IGZhbWlseSBpcyA2NDYzLTQgLyAxMTI2OC0wIChCYWN0ZXJpYSBpZGVudGlmaWVkIGJ5IGFlcm9iZVxuICAvLyBjdWx0dXJlKSBidXQgdGhlIHNvdXJjZSByb3cgZG9lc24ndCB0ZWxsIHVzIHNwZWNpbWVuIFx1MjAxNCBsZWF2aW5nXG4gIC8vIHVubWFwcGVkIHNvIHdlIGRvbid0IGxpZS4gRmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy5cbiAgLy8gMTMwMTNDIFRCIEN1bHR1cmUgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDMxOTUyLTUgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ1JpbmRlcnBlc3QgdmlydXMgQWcgW1ByZXNlbmNlXSBpbiBFeHVkYXRlJyAoY2F0dGxlXG4gIC8vIG1vcmJpbGxpdmlydXMsIHZlcmlmaWVkIGxvaW5jLm9yZy8zMTk1Mi01LykuIFdyb25nIG9yZ2FuaXNtIGVudGlyZWx5LlxuICAvLyBMZWF2aW5nIHVubWFwcGVkOyBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLiBTZWVcbiAgLy8gZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kLlxuICBcIjEzMDE2QlwiOiBcIjYwMC03XCIsIC8vIEJsb29kIEN1bHR1cmUgXHUyMDE0IEJhY3RlcmlhIGlkZW50aWZpZWQgaW4gQmxvb2RcbiAgLy8gXHUyNTAwXHUyNTAwIFZpcm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxNDAwNEIgQ01WIElnRyBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgNzg0OS0zIHdoaWNoIGlzIGFjdHVhbGx5XG4gIC8vICdUYWVuaWEgc29saXVtIGxhcnZhIElnTSBBYiBbUHJlc2VuY2VdIGluIFNlcnVtJyAocG9yayB0YXBld29ybSxcbiAgLy8gdmVyaWZpZWQgbG9pbmMub3JnLzc4NDktMy8pLiBObyB2ZXJpZmllZCBjYW5vbmljYWwgcmVwbGFjZW1lbnQgZm91bmRcbiAgLy8gaW4gdGhpcyBwYXNzIChjYW5kaWRhdGVzIDUxMjYtOCAvIDUxMjUtMCBhcmUgSWdNIG9yIG1ldGhvZC1zcGVjaWZpYyxcbiAgLy8gMjI1OTItOSAvIDIyNTkxLTEgLyAxNjEyNS01IHJldHVybmVkIEhUVFAgNTAwIG9uIGV2ZXJ5IHJldHJ5KS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy5cbiAgXCIxNDA0OEJcIjogXCI3ODUzLTVcIiwgLy8gQ01WIElnTSBcdTIwMTQgQ3l0b21lZ2Fsb3ZpcnVzIElnTSBBYiBbVW5pdHMvdm9sdW1lXSBTL1BcbiAgLy8gICByZXN0b3JlZCBhZnRlciBhdWRpdDogMTQwNDhCIHByZXZpb3VzbHkgbWFwcGVkIHRvIDc4NTAtMSB3aGljaCBpc1xuICAvLyAgICdUYWVuaWEgc29saXVtIGxhcnZhIEFiJyAodmVyaWZpZWQgbG9pbmMub3JnLzc4NTAtMS8pLiA3ODUzLTVcbiAgLy8gICB2ZXJpZmllZCBhcyB0aGUgY2Fub25pY2FsIENNViBJZ00gTE9JTkMgKENvbXBvbmVudD1DeXRvbWVnYWxvdmlydXNcbiAgLy8gICBBYi5JZ00sIFByb3BlcnR5PUFDbmMpIFx1MjAxNCBsb2luYy5vcmcvNzg1My01Ly5cbiAgXCIxNDA2NkNcIjogXCI4MDM4My0zXCIsIC8vIEluZmx1ZW56YSBBIFx1MjAxNCBBZyBSZXNwaXJhdG9yeVxuICBcIjE0MDg0Q1wiOiBcIjk0NTU4LTRcIiwgLy8gU0FSUy1Db1YtMiBBZyBcdTIwMTQgUmVzcGlyYXRvcnlcbiAgXCIxMjE4NENcIjogXCI4ODE1Ny0zXCIsIC8vIENNViBETkEgcXVhbnQgUENSIFx1MjAxNCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIE15Y29iYWN0ZXJpdW0gLyBhY2lkLWZhc3QgKGFkZGVkIGFmdGVyIGF1ZGl0KSBcdTI1MDBcbiAgXCIxMzAyNUNcIjogXCIyOTI2MC03XCIsIC8vIFx1NjI5N1x1OTE3OFx1NjAyN1x1NkZDM1x1N0UyRVx1NjJCOVx1NzI0N1x1NjdEM1x1ODI3Mlx1NkFBMlx1NjdFNSBcdTIwMTQgTXljb2JhY3Rlcml1bSBBRkIgc3RhaW5cbiAgXCIxMzAyNkNcIjogXCIyOTU1My01XCIsIC8vIFx1NjI5N1x1OTE3OFx1ODNDQ1x1NTdGOVx1OTkwQSBcdTIwMTQgTXljb2JhY3Rlcml1bSBjdWx0dXJlIGxpcXVpZCtzb2xpZFxuICAvLyBcdTI1MDBcdTI1MDAgQUJHIHBhbmVsICgwOTA0MUIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBJbnRlbnRpb25hbGx5IE5PVCBtYXBwZWQgaGVyZSBcdTIwMTQgMDkwNDFCIGlzIGEgcGFuZWwgb3JkZXIgdGhhdFxuICAvLyB1bmZvbGRzIGludG8gbWFueSBpdGVtcyAocEggLyBwQ08yIC8gcE8yIC8gSENPMyAvIFRDTzIgLyBTQkUgL1xuICAvLyBBQkUgLyBTQkMgLyBTQVQpLiBNYXBwaW5nIHRoZSBwYW5lbCBjb2RlIHRvIFwicEhcIiB3b3VsZCBtaXMtbGFiZWxcbiAgLy8gZXZlcnkgbm9uLXBIIHJvdyB0aGF0IHNoYXJlcyB0aGlzIE5ISSBjb2RlLiBFYWNoIGl0ZW0gaXNcbiAgLy8gcmVzb2x2ZWQgdmlhIF9MT0lOQ19NQVAgZGlzcGxheS1rZXl3b3JkIGZhbGxiYWNrIGJlbG93OyAwOTA0MUJcbiAgLy8gYWxzbyBhcHBlYXJzIGluIF9ESVNQTEFZX0ZJUlNUX0NPREVTIHNvIGRpc3BsYXkgYWx3YXlzIHdpbnMuXG4gIC8vIFx1MjUwMFx1MjUwMCBCb2R5IGZsdWlkIC8gc3lub3ZpYWwgZmx1aWQgcGFuZWwgKDE2MDA4QyB1bmZvbGRzOyB0aGVcbiAgLy8gbWVtYmVyIGl0ZW1zIHJlbHkgb24gZGlzcGxheSBrZXl3b3JkcyBmb3Igc3BlY2ltZW4tYXdhcmVcbiAgLy8gTE9JTkNzKS4gUGFyZW50IGNvZGUgbWFwcyB0byBzeW5vdmlhbCBmbHVpZCBhbmFseXNpcyBwYW5lbC4gXHUyNTAwXHUyNTAwXG4gIC8vIDE2MDA4QyBcdTZFRDFcdTZEQjJcdTZBQTJcdTY3RTUgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDMzOTAzLTYgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0tldG9uZXMgW1ByZXNlbmNlXSBpbiBVcmluZScgKHZlcmlmaWVkIGxvaW5jLm9yZykuXG4gIC8vIExlYXZpbmcgdW5tYXBwZWQ7IHRoZSBwYW5lbCBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2Rpbmcgb25seVxuICAvLyBhbmQgdGhlIHBlci1pdGVtIGRpc3BsYXlzIGluIF9MT0lOQ19NQVAgY2FycnkgdGhlaXIgb3duIExPSU5Dc1xuICAvLyB3aGVyZSBrbm93bi5cbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfRElTUExBWV9GSVJTVF9DT0RFUyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBjb2RlcyB0aGF0IGFyZSAqcGFuZWxzKiBcdTIwMTQgb25lIGJpbGxpbmcgY29kZSwgbWFueSBpdGVtLXNwZWNpZmljXG4vLyBkaXNwbGF5cy4gRm9yIHRoZXNlLCBkaXNwbGF5IGtleXdvcmQgTVVTVCBiZSB0cmllZCBmaXJzdCAoc28gXCJXQkNcIlxuLy8gdW5kZXIgQ0JDIHBhbmVsIDA4MDExQyBnZXRzIDY2OTAtMiwgbm90IHRoZSBnZW5lcmljIHBhbmVsIExPSU5DKS5cbi8vIEZvciBldmVyeXRoaW5nIGVsc2UgKHNpbmdsZS10ZXN0IGNvZGVzIGxpa2UgMDkwMDVDIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENixcbi8vIDA5MDQ0QyBMREwsIDE0MDMwQyBIQnNBZyksIHRoZSBOSEkgY29kZSBpcyBtb3JlIHNwZWNpZmljIHRoYW4gYW55XG4vLyBkaXNwbGF5IGtleXdvcmQgYW5kIHdpbnMgb3V0cmlnaHQuXG4vL1xuLy8gREVTSUdOIFBISUxPU09QSFk6IHRoZSBicmlkZ2UgaXMgYSAqZmFpdGhmdWwgdHJhbnNwb3J0KiBsYXllciBcdTIwMTQgaXRcbi8vIHRydXN0cyB0aGUgXHU1MDY1XHU0RkREIGJpbGxpbmcgY29kZSBhcyBhdXRob3JpdGF0aXZlIGZvciBjbGluaWNhbCBpbnRlbnRcbi8vIChcdTk2NjJcdTYyNDAgYmlsbGVkIDA5MDA1QyA9IHRoZXkgb3JkZXJlZCBmYXN0aW5nIGdsdWNvc2UsIHJlZ2FyZGxlc3Mgb2Zcbi8vIHdoZXRoZXIgdGhlIG9wZXJhdGlvbmFsIHNwZWNpbWVuIHdhcyBhIGZpbmdlci1zdGljaykuIERpc3BsYXktc3RyaW5nXG4vLyByZS1pbnRlcnByZXRhdGlvbiBvZiBjbGluaWNhbCBjb250ZXh0IChHbHUtQUMgdnMgRklOR0VSIFNVR0FSIHZzXG4vLyByYW5kb20pIGlzIGxlZnQgdG8gdGhlIFNNQVJUIGFwcCwgd2hpY2ggaGFzIG1vcmUgVUkgY29udGV4dC5cbmV4cG9ydCBjb25zdCBESVNQTEFZX0ZJUlNUX0NPREVTOiBSZWFkb25seVNldDxzdHJpbmc+ID0gbmV3IFNldChbXG4gIFwiMDgwMTFDXCIsIC8vIENCQyBwYW5lbFxuICBcIjA4MDEzQ1wiLCAvLyBDQkMgdy8gYXV0byBkaWZmIHBhbmVsXG4gIFwiMDYwMTNDXCIsIC8vIFVyaW5hbHlzaXMgbWFjcm9zY29waWMgcGFuZWxcbiAgXCIwOTA0MUJcIiwgLy8gQUJHIHBhbmVsXG4gIFwiMTYwMDhDXCIsIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBwYW5lbFxuXSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBfUEFORUxfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gUGFuZWwtc3BlY2lmaWMgZGlzcGxheSBcdTIxOTIgTE9JTkMgb3ZlcnJpZGVzLiBUaGVzZSBydW4gQkVGT1JFIHRoZSBnbG9iYWxcbi8vIF9MT0lOQ19NQVAgc28gdGhhdCB1cmluZSBiaWxpcnViaW4gdW5kZXIgMDYwMTNDIG1hcHMgdG8gNTc3MC0zICh1cmluZVxuLy8gc3BlY2ltZW4pIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIGdsb2JhbCAnYmlsaXJ1YmluJyB0aGF0XG4vLyB3b3VsZCBpbXBseSBzZXJ1bSwgYW5kIGFuYWxvZ291cyBzcGVjaW1lbi1hd2FyZSBkaXNhbWJpZ3VhdGlvbiBmb3Jcbi8vIG90aGVyIHBhbmVsIHN1Yi1pdGVtcy4gS2V5cyBhcmUgTkhJIHBhbmVsIGNvZGVzIChtdXN0IGFsc28gYmUgaW5cbi8vIF9ESVNQTEFZX0ZJUlNUX0NPREVTKTsgdmFsdWVzIGFyZSBkaXNwbGF5LWtleXdvcmQgXHUyMTkyIExPSU5DIGRpY3RzIHRoYXRcbi8vIGZvbGxvdyB0aGUgc2FtZSBtYXRjaGluZyBzZW1hbnRpY3MgYXMgX0xPSU5DX01BUCAobGVhZGluZyB3b3JkXG4vLyBib3VuZGFyeSBmb3IgQVNDSUksIHN1YnN0cmluZyBmb3IgQ0pLKS5cbmV4cG9ydCBjb25zdCBQQU5FTF9MT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gQWxsIHJvdXRpbmUgZGlwc3RpY2sgaXRlbXMgcmVzaWRlIG9uIGEgc2luZ2xlIE5ISSBiaWxsaW5nIGNvZGUuXG4gIC8vIFdpdGhvdXQgdGhpcyB0YWJsZSB0aGV5J2QgYWxsIGNvbGxhcHNlIHRvIHRoZSBwYW5lbCBMT0lOQyAyNDM1Ni04LFxuICAvLyBsb3NpbmcgcGVyLWl0ZW0gZ3JhbnVsYXJpdHkgdGhhdCdzIGNsaW5pY2FsbHkgdXNlZnVsIChlLmcuXG4gIC8vIGJpbGlydWJpbiB2cyB1cm9iaWxpbm9nZW4gZm9yIGxpdmVyIHdvcmt1cCkuXG4gIFwiMDYwMTNDXCI6IHtcbiAgICAvLyBPcmRlciBtYXR0ZXJzOiBsb25nZXIvbW9yZS1zcGVjaWZpYyBrZXlzIGJlZm9yZSBnZW5lcmljIG9uZXNcbiAgICAvLyAobWF0Y2hlcyBfTE9JTkNfTUFQIGl0ZXJhdGlvbiBzZW1hbnRpY3MgXHUyMDE0IGZpcnN0IGhpdCB3aW5zKS5cbiAgICBcInNwZWNpZmljIGdyYXZpdHlcIjogXCI1ODExLTVcIiwgLy8gU3BlY2lmaWMgZ3Jhdml0eSBVcmluZVxuICAgIFwic3AuZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFwic3AgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFx1NkJENFx1OTFDRDogXCI1ODExLTVcIixcbiAgICBcIm1pY3JvLWFsYnVtaW5cIjogXCIxNDk1Ny01XCIsIC8vIE1pY3JvYWxidW1pbiBNYXNzL3ZvbCBVcmluZVxuICAgIG1pY3JvYWxidW1pbjogXCIxNDk1Ny01XCIsXG4gICAgXCJtYWxiKHUpXCI6IFwiMTQ5NTctNVwiLFxuICAgIG1hbGI6IFwiMTQ5NTctNVwiLFxuICAgIFx1NUZBRVx1NUMwRlx1NzY3RFx1ODZDQlx1NzY3RDogXCIxNDk1Ny01XCIsXG4gICAgdWFjcjogXCIxNDk1OS0xXCIsIC8vIE1pY3JvYWxidW1pbi9DcmVhdGluaW5lIHJhdGlvIFVyaW5lXG4gICAgXCJ1cmluZSBnbHVjb3NlXCI6IFwiNTc5Mi03XCIsXG4gICAgc3VnYXI6IFwiNTc5Mi03XCIsIC8vIE5ISSAnXHU1QzNGXHU3Q0Q2JyAvICdTdWdhcicgdW5kZXIgMDYwMTNDXG4gICAgXHU1QzNGXHU3Q0Q2OiBcIjU3OTItN1wiLFxuICAgIHVyb2JpbGlub2dlbjogXCI1ODE4LTBcIiwgLy8gVXJvYmlsaW5vZ2VuIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDIwXHU1MzlGOiBcIjU4MTgtMFwiLFxuICAgIGJpbGlydWJpbjogXCI1NzcwLTNcIiwgLy8gQmlsaXJ1YmluIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDA1XHU3RDIwOiBcIjU3NzAtM1wiLFxuICAgIG5pdHJpdGU6IFwiNTgwMi00XCIsIC8vIE5pdHJpdGUgVXJpbmVcbiAgICBcdTRFOUVcdTc4NURcdTkxNzg6IFwiNTgwMi00XCIsXG4gICAga2V0b25lczogXCI1Nzk3LTZcIiwgLy8gS2V0b25lcyBVcmluZVxuICAgIGtldG9uZTogXCI1Nzk3LTZcIixcbiAgICBcdTkxNkVcdTlBRDQ6IFwiNTc5Ny02XCIsXG4gICAgcHJvdGVpbjogXCIyMDQ1NC01XCIsIC8vIFByb3RlaW4gTWFzcy92b2wgVXJpbmVcbiAgICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAgIFx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgbGV1a29jeXRlOiBcIjU3OTktMlwiLCAvLyBMZXVrb2N5dGVzIFVyaW5lXG4gICAgbGV1OiBcIjU3OTktMlwiLFxuICAgIFx1NzY3RFx1ODg0MFx1NzQwM1x1OTE2Rlx1OTE3NjogXCI1Nzk5LTJcIixcbiAgICBibG9vZDogXCI1Nzk0LTNcIiwgLy8gSGVtb2dsb2JpbiBVcmluZSBRbFxuICAgIFx1NkY1Qlx1ODg0MDogXCI1Nzk0LTNcIixcbiAgICBcdTgyNzI6IFwiNTc3OC02XCIsIC8vIENvbG9yIG9mIFVyaW5lIChDSksgc3Vic3RyaW5nKVxuICAgIGNvbG9yOiBcIjU3NzgtNlwiLFxuICAgIHR1cmJpZGl0eTogXCI1NzY3LTlcIiwgLy8gQXBwZWFyYW5jZSBvZiBVcmluZVxuICAgIGFwcGVhcmFuY2U6IFwiNTc2Ny05XCIsXG4gICAgXHU1OTE2XHU4OUMwOiBcIjU3NjctOVwiLFxuICAgIHBoOiBcIjU4MDMtMlwiLCAvLyBwSCBvZiBVcmluZSAodXJpbmUtc3BlY2lmaWMsIE5PVFxuICAgIC8vIHRoZSBhcnRlcmlhbCAxMTU1OC00IHRoYXQgdGhlXG4gICAgLy8gZ2xvYmFsIG1hcCBwb2ludHMgdG8pXG4gICAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIjU4MDMtMlwiLFxuICAgIGdsdWNvc2U6IFwiNTc5Mi03XCIsIC8vIExhc3QgaW4gdGhpcyBibG9jayBzbyAndXJpbmVcbiAgfSxcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ29tbW9uIFRhaXdhbmVzZSBISVMgbGFiIG5hbWVzIFx1MjE5MiBMT0lOQyBjb2RlIG1hcHBpbmdcbmV4cG9ydCBjb25zdCBMT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBEaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgb25seSBraWNrcyBpbiB3aGVuIE5PIE5ISSBjb2RlIGlzXG4gIC8vIHByZXNlbnQgKGRhc2hib2FyZCByb3dzLCBMTE0tZXh0cmFjdGVkIHRleHQpLiBXaGVuIHRoZSBOSEkgY29kZVxuICAvLyBJUyBwcmVzZW50LCAwOTAwNUMgXHUyMTkyIDE1NTgtNiAoRmFzdGluZykgYW5kIDA5MTQwQyBcdTIxOTIgMjM0NS03XG4gIC8vIChnZW5lcmljKSB3aW5zIGRpcmVjdGx5IHZpYSBfTkhJX1RPX0xPSU5DLlxuICAvL1xuICAvLyBGYWl0aGZ1bC10cmFuc3BvcnQgcHJpbmNpcGxlOiB0aGUgYnJpZGdlIGRvZXMgTk9UIHJlLWludGVycHJldFxuICAvLyBkaXNwbGF5IHN0cmluZ3MgbGlrZSBcIkZJTkdFUiBTVUdBUlwiIGFzIGEgZGlmZmVyZW50IExPSU5DIFx1MjAxNCBpdFxuICAvLyBwcmVzZXJ2ZXMgdGhlIHJhdyBkaXNwbGF5IGluIGBjb2RlLnRleHRgIGFuZCB0aGUgb3JpZ2luYWwgTkhJXG4gIC8vIGNvZGUgaW4gYGNvZGUuY29kaW5nYC4gVGhlIFNNQVJUIGFwcCBkb2VzIHNwZWNpbWVuL21ldGhvZC1hd2FyZVxuICAvLyBncm91cGluZyBvbiB0aGUgY29uc3VtZXIgc2lkZSAoc2VlIFNNQVJUIGFwcCBoYW5kb2ZmIGRvYykuXG4gIFwiZmFzdGluZyBnbHVjb3NlXCI6IFwiMTU1OC02XCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCIxNTU4LTZcIixcbiAgXCJnbHUtYWNcIjogXCIxNTU4LTZcIixcbiAgXCJnbHVjb3NlIGFjXCI6IFwiMTU1OC02XCIsXG4gIGdsdWNvc2U6IFwiMjM0NS03XCIsXG4gIFx1ODg0MFx1N0NENjogXCIyMzQ1LTdcIixcbiAgZ2x1OiBcIjIzNDUtN1wiLFxuICAvLyBIYkExYyBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyBcImhiXCIgZW50cmllcyBzbyB0aGUgbG9uZ2VzdC1wcmVmaXhcbiAgLy8gbWF0Y2ggd2lucyBmb3IgdGhlIFwiSGJBMWNcIiBkaXNwbGF5IHN0cmluZy4gT3RoZXIgQTFjIHN5bm9ueW1zXHUyMDI2XG4gIGhiYTFjOiBcIjQ1NDgtNFwiLFxuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNDU0OC00XCIsXG4gIGExYzogXCI0NTQ4LTRcIixcbiAgaGVtb2dsb2JpbjogXCI3MTgtN1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNzE4LTdcIixcbiAgaGdiOiBcIjcxOC03XCIsXG4gIGhiOiBcIjcxOC03XCIsXG4gIC8vIENCQyBkaWZmIFx1MjAxNCBlb3Npbm9waGlsIGNvdW50IG11c3QgcHJlY2VkZSB0aGUgYmFyZSAnd2JjJy8nXHU3NjdEXHU4ODQwXHU3NDAzJ1xuICAvLyBrZXlzICh3aGljaCB3b3VsZCBvdGhlcndpc2Ugd2luIGFzIHN1YnN0cmluZ3MpLlxuICAvLyA3MTEtMiB2ZXJpZmllZCBhdCBsb2luYy5vcmc6ICdFb3Npbm9waGlscyBbIy92b2x1bWVdIGluIEJsb29kXG4gIC8vIGJ5IEF1dG9tYXRlZCBjb3VudCcuXG4gIFx1NTVEQ1x1OTE3OFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNzExLTJcIixcbiAgZW9zaW5vcGhpbDogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsczogXCI3MTEtMlwiLFxuICB3YmM6IFwiNjY5MC0yXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCI2NjkwLTJcIixcbiAgcGxhdGVsZXQ6IFwiNzc3LTNcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIjc3Ny0zXCIsXG4gIHBsdDogXCI3NzctM1wiLFxuICAvLyBSQkMgKyBSQkMgaW5kaWNlcyBcdTIwMTQgdmVyaWZpZWQgTE9JTkNzIChsb2luYy5vcmcpOlxuICAvLyA3ODktOCAgRXJ5dGhyb2N5dGVzICMvdm9sIEJsb29kIEF1dG8gICAgICAgICAgICAgIFx1MjE5MiBSQkNcbiAgLy8gNzg1LTYgIEVyeXRocm9jeXRlIG1lYW4gY29ycHVzY3VsYXIgaGVtb2dsb2JpbiAgICBcdTIxOTIgTUNIXG4gIC8vIExvbmcgQ0pLIGZvcm1zIGZpcnN0IChMREwvY2hvbGVzdGVyb2wgcGF0dGVybikgc28gJ1x1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1xuICAvLyBcdTg4NDBcdTgyNzJcdTdEMjAnIHdpbnMgb3ZlciBcdTdEMDVcdTg4NDBcdTc0MDMuXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMDogXCI3ODUtNlwiLFxuICByYmM6IFwiNzg5LThcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIjc4OS04XCIsXG4gIG1jaDogXCI3ODUtNlwiLFxuICAvLyBVcmluZSBjcmVhdGluaW5lIFx1MjAxNCBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyAnY3JlYXRpbmluZScgc29cbiAgLy8gcm93cyBsaWtlICdVLUNSRSBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTAnIG9yICdDcmVhdGluaW5lKFUpJyByZXNvbHZlIHRvIHRoZVxuICAvLyB1cmluZSBMT0lOQyAoMjE2MS04KSBpbnN0ZWFkIG9mIGJlaW5nIHNoYWRvd2VkIGJ5IHRoZSBzZXJ1bVxuICAvLyBkZWZhdWx0ICgyMTYwLTApLiBTYW1lIGxvbmdlc3Qtc3BlY2lmaWMtZmlyc3Qgb3JkZXJpbmcgYXNcbiAgLy8gdGhlIGZhc3RpbmctdnMtcmFuZG9tIGdsdWNvc2UgYmxvY2suXG4gIFwidXJpbmUgY3JlYXRpbmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUgdXJpbmVcIjogXCIyMTYxLThcIixcbiAgXCJjcmVhdGluaW5lKHUpXCI6IFwiMjE2MS04XCIsXG4gIFwidS1jcmVcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZWFcIjogXCIyMTYxLThcIixcbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIjIxNjEtOFwiLFxuICBjcmVhdGluaW5lOiBcIjIxNjAtMFwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE1MFx1OTE3ODogXCIyMTYwLTBcIiwgLy8gVGFpd2FuIHZhcmlhbnQgc3BlbGxpbmdcbiAgY3JlYTogXCIyMTYwLTBcIixcbiAgYnVuOiBcIjMwOTQtMFwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiMzA5NC0wXCIsXG4gIGFzdDogXCIxOTIwLThcIixcbiAgYWx0OiBcIjE3NDItNlwiLFxuICBmZXJyaXRpbjogXCIyMjc2LTRcIixcbiAgXHU4ODQwXHU2RTA1XHU5NDM1XHU4NkNCXHU3NjdEOiBcIjIyNzYtNFwiLFxuICBmZXJyOiBcIjIyNzYtNFwiLFxuICAvLyBWaXRhbC1zaWducyBmcm9tIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NSAoSUhLRTM0MDIpIFx1MjAxNCBzZXBhcmF0ZSBjb2RlIG5hbWVzcGFjZVxuICAvLyBidXQgdGhlIGxvb2t1cCBpcyBieSBkaXNwbGF5LW5hbWUgc3Vic3RyaW5nLCBzYW1lIGFzIGZvciBsYWJzLlxuICBcImJvZHkgaGVpZ2h0XCI6IFwiODMwMi0yXCIsXG4gIFwiYm9keSB3ZWlnaHRcIjogXCIyOTQ2My03XCIsXG4gIGJtaTogXCIzOTE1Ni01XCIsXG4gIC8vIFdhaXN0IGNpcmN1bWZlcmVuY2UgXHUyMDE0IG1lYXN1cmVtZW50IExPSU5DICg4MjgwLTApLiA1NjA4Ni0yIGlzXG4gIC8vIHRoZSAnQWR1bHQgV2Fpc3QgQ2lyY3VtZmVyZW5jZSBQcm90b2NvbCcgY29kZSwgd2hpY2ggaXMgYVxuICAvLyBzdXJ2ZXkvcHJvdG9jb2wgZGVzY3JpcHRvciwgTk9UIGEgbnVtZXJpYyBtZWFzdXJlbWVudFxuICAvLyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gTkhJIFx1NTA2NVx1NEZERCByZXBvcnRzIGEgc2luZ2xlIHdhaXN0bGluZVxuICAvLyBudW1iZXIgcGVyIHZpc2l0LCBzbyB0aGUgbWVhc3VyZW1lbnQgY29kZSBpcyBjb3JyZWN0LlxuICBcIndhaXN0IGNpcmN1bWZlcmVuY2VcIjogXCI4MjgwLTBcIixcbiAgXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0ODAtNlwiLFxuICBcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0NjItNFwiLFxuICAvLyBMaXBpZCBwYW5lbCBcdTIwMTQgT1JERVIgTUFUVEVSUy4gTERML0hETCB2YXJpYW50cyBNVVNUIHByZWNlZGUgdGhlXG4gIC8vIGdlbmVyaWMgJ2Nob2xlc3Rlcm9sJyBrZXkgc28gYSByb3cgbGFiZWxsZWQgJ0xETCBDSE9MRVNURVJPTCdcbiAgLy8gcmVzb2x2ZXMgdG8gMTM0NTctNyAoTERMIGNhbGN1bGF0ZWQpIGFuZCAnSERMIENIT0xFU1RFUk9MJyB0b1xuICAvLyAyMDg1LTksIGluc3RlYWQgb2YgZmFsbGluZyB0byAyMDkzLTMgKHRvdGFsIGNob2xlc3Rlcm9sKSB2aWEgdGhlXG4gIC8vICdjaG9sZXN0ZXJvbCcgc3Vic3RyaW5nLiBTYW1lIGNhbm9uaWNhbCBvcmRlcmluZyBhcyBfTEFCX1NZTk9OWU1TLlxuICBcImxkbCBjaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXCJsZGwtY2hvbGVzdGVyb2xcIjogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIC8vIDEzNDU3LTcgPSBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIFx1MjAxNCBtYXRjaGVzIHRoZSBOSEkgMDkwNDRDXG4gIC8vIGJpbGxpbmcgY29kZSdzIGludGVudCAoVGFpd2FuIGxhYnMgcHJlZG9taW5hbnRseSByZXBvcnQgY2FsY3VsYXRlZFxuICAvLyBMREwgdmlhIEZyaWVkZXdhbGQpLiBLZWVwIGNvbnNpc3RlbnQgd2l0aCBfTkhJX1RPX0xPSU5DW1wiMDkwNDRDXCJdLlxuICBcImxkbC1jXCI6IFwiMTM0NTctN1wiLFxuICBsZGw6IFwiMTM0NTctN1wiLFxuICBcImhkbCBjaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcImhkbC1jaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXCJoZGwtY1wiOiBcIjIwODUtOVwiLFxuICBoZGw6IFwiMjA4NS05XCIsXG4gIC8vIFRvdGFsIGNob2xlc3Rlcm9sIFx1MjAxNCBiYXJlICdjaG9sZXN0ZXJvbCcgb25seSBmaXJlcyBBRlRFUiB0aGVcbiAgLy8gTERML0hETC1wcmVmaXhlZCB2YXJpYW50cyBhYm92ZSBoYXZlIGJlZW4gY2hlY2tlZC5cbiAgXCJ0b3RhbCBjaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcInQtY2hvbGVzdGVyb2xcIjogXCIyMDkzLTNcIixcbiAgXHU4ODQwXHU2RTA1XHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwOTMtM1wiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIGNob2xlc3Rlcm9sOiBcIjIwOTMtM1wiLFxuICB0cmlnbHljZXJpZGU6IFwiMjU3MS04XCIsXG4gIFx1NEUwOVx1OTE3OFx1NzUxOFx1NkNCOVx1OTE2RjogXCIyNTcxLThcIixcbiAgXCJ1cmljIGFjaWRcIjogXCIzMDg0LTFcIixcbiAgZWdmcjogXCIzMzkxNC0zXCIsXG4gIGhic2FnOiBcIjUxOTYtMVwiLFxuICBcImFudGktaGN2XCI6IFwiMTYxMjgtMVwiLFxuICAvLyBVcmluZSBwcm90ZWluIChkaXNwbGF5IGZhbGxiYWNrIGZvciB0aGUgbm8tTkhJLWNvZGUgcGF0aCB0aGF0XG4gIC8vIGNvbWVzIGZyb20gSUhLRTM0MDIgdml0YWxzICsgYWR1bHQtcHJldmVudGl2ZSBzdXBwbGVtZW50cykuXG4gIFwidXJpbmUgcHJvdGVpblwiOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICBcInUtcHJvXCI6IFwiMjA0NTQtNVwiLFxuICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAvLyBBQkcgcGFuZWwgY29tcG9uZW50cyBcdTIwMTQgMDkwNDFCIHBhcmVudCBjb2RlIGluIE5ISV9UT19MT0lOQzsgZWFjaFxuICAvLyBtZW1iZXIncyBkaXNwbGF5IChcInBDTzJcIiwgXCJwTzJcIiwgXCJIQ08zXCIsIFwiVENPMlwiLCBcIlNCRS9BQkVcIixcbiAgLy8gXCJTQkNcIiwgXCJTQVRcIiAvIFwiU2FPMlwiKSBmYWxscyB0byBpdHMgb3duIExPSU5DLlxuICAvLyBwSCBNVVNUIGNvbWUgYmVmb3JlIHBjbzIvcG8yIHNvIHRoZSBiYXJlIFwicEhcIiBkaXNwbGF5IGxhbmRzIGhlcmUuXG4gIHBoOiBcIjExNTU4LTRcIiwgLy8gcEggb2YgQXJ0ZXJpYWwgYmxvb2RcbiAgcGNvMjogXCIyMDE5LThcIiwgLy8gQ2FyYm9uIGRpb3hpZGUgcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgcG8yOiBcIjI3MDMtN1wiLCAvLyBPeHlnZW4gcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgaGNvMzogXCIxOTU5LTZcIiwgLy8gQmljYXJib25hdGUgTW9sZXMvdm9sIEFydGVyaWFsXG4gIGJpY2FyYm9uYXRlOiBcIjE5NTktNlwiLFxuICB0Y28yOiBcIjIwMjgtOVwiLCAvLyBUb3RhbCBDTzIgTW9sZXMvdm9sIEFydGVyaWFsXG4gIHNiZTogXCIxMTU1NS0wXCIsIC8vIFN0YW5kYXJkIGJhc2UgZXhjZXNzIEFydGVyaWFsXG4gIGFiZTogXCIxMTU1NS0wXCIsXG4gIHNiYzogXCIxOTI1LTdcIiwgLy8gU3RhbmRhcmQgYmljYXJib25hdGUgQXJ0ZXJpYWxcbiAgc2F0dXJhdDogXCIyNzEzLTZcIiwgLy8gTzIgc2F0dXJhdGlvbiBBcnRlcmlhbFxuICBzYW8yOiBcIjI3MTMtNlwiLFxuICBzYXQ6IFwiMjcxMy02XCIsIC8vIE5ISSBkaXNwbGF5IHNob3dzIGp1c3QgXCJTQVRcIlxuICAvLyBTeW5vdmlhbCAvIGJvZHktZmx1aWQgY29tcG9uZW50cyAoMTYwMDhDIHBhcmVudCBhYm92ZSkuXG4gIFwic2YuY29sb3JcIjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgQm9keSBmbHVpZCAocmV1c2UgVXJpbmUgY29sb3Igc3BlYyBPSylcbiAgLy8gTk9URTogODI1NS0yIC8gMTM5NDgtNSBwcmV2aW91c2x5IGxpc3RlZCBoZXJlIGJvdGggdHVybmVkIG91dFxuICAvLyB0byBiZSB1bnJlbGF0ZWQgTE9JTkNzICh2ZXJpZmllZCBsb2luYy5vcmcgXHUyMDE0IDgyNTUtMiBpc1xuICAvLyAnU2VydmljZSBjb21tZW50IDEzJywgMTM5NDgtNSBpcyAnQ29jY2lkaW9pZGVzIGltbWl0aXMgSWdNXG4gIC8vIEFiJykuIEJvZHktZmx1aWQgQXBwZWFyYW5jZSAvIFJCQyBkb24ndCBoYXZlIHdlbGwtYXR0ZXN0ZWRcbiAgLy8gTE9JTkNzIGluIG91ciB0YWJsZSB5ZXQgXHUyMDE0IGZhbGxpbmcgdGhyb3VnaCB0byBjb2RlLnRleHQtb25seVxuICAvLyBpcyBzYWZlciB0aGFuIGVtaXR0aW5nIGEgbWlzbGVhZGluZyBMT0lOQy4gVG8gYWRkIGxhdGVyLFxuICAvLyB2ZXJpZnkgZWFjaCBhZ2FpbnN0IGxvaW5jLm9yZyBmaXJzdC5cbiAgXCJzZi53YmNcIjogXCIyNjQ2Ni0zXCIsIC8vIFdCQyAjL3ZvbCBCb2R5IGZsdWlkXG4gIFwic2YubmV1dHJvcGhpbFwiOiBcIjEwMzI4LTZcIiwgLy8gTmV1dHJvcGhpbHMvMTAwIGxldWtvY3l0ZXMgaW4gQm9keSBmbHVpZFxuICBcInNmLmx5bXBob1wiOiBcIjEzMDQ2LThcIiwgLy8gTHltcGhvY3l0ZXMgIy92b2wgQm9keSBmbHVpZFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19ESVNQTEFZIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ2Fub25pY2FsIEVuZ2xpc2ggZGlzcGxheSBuYW1lcyBmb3IgTE9JTkMgY29kZXMgdGhlIGJyaWRnZSBlbWl0cy5cbi8vIEZhbGxzIGJhY2sgdG8gdGhlIHJhdyBpbnB1dCBkaXNwbGF5IHdoZW4gYSBMT0lOQyBpc24ndCBsaXN0ZWQgaGVyZS5cbi8vIFNvdXJjZWQgZnJvbSBsb2luYy5vcmcgY2Fub25pY2FsIHNob3J0IG5hbWVzIHdoZXJlIGFwcGxpY2FibGUuXG4vLyBBZGQgbmV3IGVudHJpZXMgYXMgd2Ugd2lkZW4gTE9JTkMgY292ZXJhZ2UgXHUyMDE0IHRoZSBsb29rdXAgaXMga2V5ZWQgb25cbi8vIExPSU5DIHN0cmluZywgc28gdW5tYXBwZWQgTE9JTkNzIGRlZ3JhZGUgZ3JhY2VmdWxseSB0byB0aGUgTkhJIHRleHQuXG5leHBvcnQgY29uc3QgTE9JTkNfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQyBwYW5lbCBzdWItaXRlbXMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBNb3N0IGNyaXRpY2FsIGJsb2NrIFx1MjAxNCBOSEkncyBcIkNvbG9yIFx1NUMzRiBcdTk4NEYgIC4uLlwiIHN0eWxlIGxhYmVscyBhcmVcbiAgLy8gd2hhdCB0cmlnZ2VycyBkb3duc3RyZWFtIENoaW5lc2Utc3Vic3RyaW5nIGxhYmVsbGluZyBidWdzLlxuICBcIjU4MDMtMlwiOiBcInBIIG9mIFVyaW5lXCIsXG4gIFwiNTgxMS01XCI6IFwiU3BlY2lmaWMgZ3Jhdml0eSBvZiBVcmluZVwiLFxuICBcIjU3NzAtM1wiOiBcIkJpbGlydWJpbiBVcmluZSBRbFwiLFxuICBcIjU4MDItNFwiOiBcIk5pdHJpdGUgVXJpbmUgUWxcIixcbiAgXCI1Nzc4LTZcIjogXCJDb2xvciBvZiBVcmluZVwiLFxuICBcIjU3NjctOVwiOiBcIkFwcGVhcmFuY2Ugb2YgVXJpbmVcIixcbiAgXCI1ODE4LTBcIjogXCJVcm9iaWxpbm9nZW4gVXJpbmUgUWxcIixcbiAgXCIyMDQ1NC01XCI6IFwiUHJvdGVpbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU3LTVcIjogXCJNaWNyb2FsYnVtaW4gTWFzcy9Wb2wgaW4gVXJpbmVcIixcbiAgXCIxNDk1OS0xXCI6IFwiTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgUmF0aW8gaW4gVXJpbmVcIixcbiAgXCI1NzkyLTdcIjogXCJHbHVjb3NlIFVyaW5lIFFsXCIsXG4gIFwiNTc5Ny02XCI6IFwiS2V0b25lcyBVcmluZSBRbFwiLFxuICBcIjU3OTQtM1wiOiBcIkhlbW9nbG9iaW4gVXJpbmUgUWxcIixcbiAgXCI1Nzk5LTJcIjogXCJMZXVrb2N5dGVzIFVyaW5lIFFsXCIsXG4gIFwiMjQzNTYtOFwiOiBcIlVyaW5hbHlzaXMgTWFjcm8gUGFuZWxcIixcbiAgLy8gQUxMIGVudHJpZXMgYmVsb3cgdXNlIHRoZSBMT0lOQyBjYW5vbmljYWwgJ0xvbmcgQ29tbW9uIE5hbWUnXG4gIC8vIGFzIGFjY2VwdGVkIGJ5IHRoZSBUV05ISUZISVIgdmFsaWRhdG9yLiBTb3VyY2U6IGxvaW5jLm9yZyBmb3JcbiAgLy8gZWFjaCBjb2RlLCBjcm9zcy1jaGVja2VkIGFnYWluc3QgdGhlIHZhbGlkYXRvcidzIHJlcG9ydGVkXG4gIC8vICdWYWxpZCBkaXNwbGF5IGlzIG9uZSBvZiBOIGNob2ljZXMnIGZvciBkaXNwbGF5cyB3ZSBwcmV2aW91c2x5XG4gIC8vIGdvdCB3cm9uZyAoNDUgTE9JTkNzIGZvdW5kIGluIHRoZSBQMzMzMzMzMzMzIHZhbGlkYXRpb24gcnVuKS5cbiAgLy8gV2hlbiB1cGRhdGluZywgY29weSB0aGUgZXhhY3QgZW4tVVMgbG9uZyBuYW1lIGZyb20gbG9pbmMub3JnIFx1MjAxNFxuICAvLyB0aGUgdmFsaWRhdG9yIGlzIHNlbnNpdGl2ZSB0byBzcGVsbGluZyAvIHB1bmN0dWF0aW9uLlxuICAvL1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgKDA5MDQxQiBwYW5lbCkgXHUyMDE0IG5vdCBpbiB2YWxpZGF0b3Igb3V0cHV0OyBsb2luYy5vcmcgc291cmNlZFxuICBcIjExNTU4LTRcIjogXCJwSCBvZiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMTktOFwiOiBcIkNhcmJvbiBkaW94aWRlIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjI3MDMtN1wiOiBcIk94eWdlbiBbUGFydGlhbCBwcmVzc3VyZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIxOTU5LTZcIjogXCJCaWNhcmJvbmF0ZSBbTW9sZXMvdm9sdW1lXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMjgtOVwiOiBcIkNhcmJvbiBkaW94aWRlIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjExNTU1LTBcIjogXCJCYXNlIGV4Y2VzcyBpbiBBcnRlcmlhbCBibG9vZCBieSBjYWxjdWxhdGlvblwiLFxuICBcIjE5MjUtN1wiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kIC0tc3RhbmRhcmRcIixcbiAgXCIyNzEzLTZcIjogXCJPeHlnZW4gc2F0dXJhdGlvbiBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNTU4LTZcIjogXCJGYXN0aW5nIGdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzQ1LTdcIjogXCJHbHVjb3NlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZW1hdG9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjcxOC03XCI6IFwiSGVtb2dsb2JpbiBbTWFzcy92b2x1bWVdIGluIEJsb29kXCIsXG4gIFwiNDU0OC00XCI6IFwiSGVtb2dsb2JpbiBBMWMvSGVtb2dsb2Jpbi50b3RhbCBpbiBCbG9vZFwiLFxuICBcIjY2OTAtMlwiOiBcIkxldWtvY3l0ZXMgWyMvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3NzctM1wiOiBcIlBsYXRlbGV0cyBbIy92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc4OS04XCI6IFwiRXJ5dGhyb2N5dGVzIFsjL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzg1LTZcIjogXCJNQ0ggW0VudGl0aWMgbWFzc10gYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzExLTJcIjogXCJFb3Npbm9waGlscyBbIy92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjQ1NDQtM1wiOiBcIkhlbWF0b2NyaXQgW1ZvbHVtZSBGcmFjdGlvbl0gb2YgQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNTcwMjEtOFwiOiBcIkNCQyBXIEF1dG8gRGlmZmVyZW50aWFsIHBhbmVsIC0gQmxvb2RcIixcbiAgXCIyNDMxNy0wXCI6IFwiSGVtb2dyYW0gYW5kIHBsYXRlbGV0cyBXTyBkaWZmZXJlbnRpYWwgcGFuZWwgLSBCbG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IC8gbGl2ZXIgLyByZW5hbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxOTIwLThcIjogXCJBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc0Mi02XCI6IFwiQWxhbmluZSBhbWlub3RyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMTYwLTBcIjogXCJDcmVhdGluaW5lIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjE2MS04XCI6IFwiQ3JlYXRpbmluZSBbTWFzcy92b2x1bWVdIGluIFVyaW5lXCIsXG4gIFwiMzM5MTQtM1wiOlxuICAgIFwiR2xvbWVydWxhciBmaWx0cmF0aW9uIHJhdGUgW1ZvbHVtZSBSYXRlL0FyZWFdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBDcmVhdGluaW5lLWJhc2VkIGZvcm11bGEgKE1EUkQpLzEuNzMgc3EgTVwiLFxuICBcIjMwOTQtMFwiOiBcIlVyZWEgbml0cm9nZW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMDg0LTFcIjogXCJVcmF0ZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI5NTEtMlwiOiBcIlNvZGl1bSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyODIzLTNcIjogXCJQb3Rhc3NpdW0gW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk3NS0yXCI6IFwiQmlsaXJ1YmluLnRvdGFsIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk2OC03XCI6IFwiQmlsaXJ1YmluLmRpcmVjdCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3NTEtN1wiOiBcIkFsYnVtaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyNTMyLTBcIjogXCJMYWN0YXRlIGRlaHlkcm9nZW5hc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjY3NjgtNlwiOiBcIkFsa2FsaW5lIHBob3NwaGF0YXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzI0LTJcIjogXCJHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc4NjEtNlwiOiBcIkNhbGNpdW0gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIExpcGlkIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjIwOTMtM1wiOiBcIkNob2xlc3Rlcm9sIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjU3MS04XCI6IFwiVHJpZ2x5Y2VyaWRlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjA4NS05XCI6IFwiQ2hvbGVzdGVyb2wgaW4gSERMIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTM0NTctN1wiOiBcIkNob2xlc3Rlcm9sIGluIExETCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBjYWxjdWxhdGlvblwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVGh5cm9pZCAvIGhvcm1vbmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjMwMTYtM1wiOiBcIlRoeXJvdHJvcGluIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMwMjQtN1wiOiBcIlRoeXJveGluZSAoVDQpIGZyZWUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNDkyMC0zXCI6IFwiVGh5cm94aW5lIChUNCkgZnJlZSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyOTg2LThcIjogXCJUZXN0b3N0ZXJvbmUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCI4MzA5OC00XCI6IFwiRm9sbGl0cm9waW4gW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIFwiODMwOTYtOFwiOiBcIkVzdHJhZGlvbCAoRTIpIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkaWFjIC8gaW5mbGFtbWF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEwODM5LTlcIjogXCJUcm9wb25pbiBJLmNhcmRpYWMgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMzc2Mi02XCI6IFwiTmF0cml1cmV0aWMgcGVwdGlkZS5CIHByb2hvcm1vbmUgTi1UZXJtaW5hbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5ODgtNVwiOiBcIkMgcmVhY3RpdmUgcHJvdGVpbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMzOTU5LThcIjogXCJQcm9jYWxjaXRvbmluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgLyBzZXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI1MTk1LTNcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCI1MTk2LTFcIjogXCJIZXBhdGl0aXMgQiB2aXJ1cyBzdXJmYWNlIEFnIFtVbml0cy92b2x1bWVdIGluIFNlcnVtXCIsXG4gIFwiMTYxMjgtMVwiOiBcIkhlcGF0aXRpcyBDIHZpcnVzIEFiIFtQcmVzZW5jZV0gaW4gU2VydW1cIixcbiAgXCIxMzk1NS0wXCI6IFwiSGVwYXRpdGlzIEMgdmlydXMgQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgLy8gXHUyNTAwXHUyNTAwIFZpcm9sb2d5IChhdWRpdCAyMDI2LTA1LTE5KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI3ODUzLTVcIjogXCJDeXRvbWVnYWxvdmlydXMgSWdNIEFiIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVHVtb3IgbWFya2VycyAvIHByb3RlaW5zIChhdWRpdCAyMDI2LTA1LTE5KSBcdTI1MDBcdTI1MDBcbiAgXCIxOTUyLTFcIjogXCJCZXRhLTItTWljcm9nbG9idWxpbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ29hZ3VsYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNjMwMS02XCI6IFwiSU5SIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hIGJ5IENvYWd1bGF0aW9uIGFzc2F5XCIsXG4gIFwiMTQ5NzktOVwiOiBcImFQVFQgaW4gUGxhdGVsZXQgcG9vciBwbGFzbWEgYnkgQ29hZ3VsYXRpb24gYXNzYXlcIixcbiAgXCIzMDI0MC02XCI6IFwiRmlicmluIEQtZGltZXIgW01hc3Mvdm9sdW1lXSBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVml0YWwgc2lnbnMgKElIS0UzNDAyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI4MzAyLTJcIjogXCJCb2R5IGhlaWdodFwiLFxuICBcIjI5NDYzLTdcIjogXCJCb2R5IHdlaWdodFwiLFxuICBcIjM5MTU2LTVcIjogXCJCb2R5IG1hc3MgaW5kZXggKEJNSSkgW1JhdGlvXVwiLFxuICBcIjgyODAtMFwiOiBcIldhaXN0IENpcmN1bWZlcmVuY2UgYXQgdW1iaWxpY3VzIGJ5IFRhcGUgbWVhc3VyZVwiLFxuICBcIjg0ODAtNlwiOiBcIlN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIsXG4gIFwiODQ2Mi00XCI6IFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIsXG4gIFwiODUzNTQtOVwiOiBcIkJsb29kIHByZXNzdXJlIHBhbmVsIHdpdGggYWxsIGNoaWxkcmVuIG9wdGlvbmFsXCIsXG59O1xuIiwgIi8qKlxuICogUHVyZSBwYXJzaW5nIGhlbHBlcnMgXHUyMDE0IHJlZmVyZW5jZSByYW5nZSwgcXVhbnRpdHksIFVDVU0gdW5pdCBub3JtYWxpc2F0aW9uLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9fcGFyc2Vycy5weWAuIFNlbGYtY29udGFpbmVkOiBubyBkZXBlbmRlbmNpZXNcbiAqIG9uIG90aGVyIG9ic2VydmF0aW9uIG1vZHVsZSBwaWVjZXMuXG4gKlxuICogUHVibGljIEFQSTpcbiAqICAgdG9VY3VtKHVuaXQpICAgICAgICAgICAgICAgICAgXHUyMTkyIGNhbm9uaWNhbCBVQ1VNIHVuaXQgc3RyaW5nIChvciBudWxsKVxuICogICBwYXJzZVJhbmdlTXVsdGkocmF3LCB1bml0KSAgICBcdTIxOTIgbGlzdCBvZiBGSElSIHJlZmVyZW5jZVJhbmdlIGVudHJpZXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob25lIHBlciBzZXggd2hlbiBzZXgtc3RyYXRpZmllZClcbiAqICAgcGFyc2VSYW5nZShyYXcsIHVuaXQpICAgICAgICAgXHUyMTkyIHNpbmdsZSByZWZlcmVuY2VSYW5nZSBlbnRyeVxuICogICB0cnlQYXJzZVF1YW50aXR5KHJhdywgdW5pdCkgICBcdTIxOTIgRkhJUiBRdWFudGl0eSBkaWN0IG9yIG51bGxcbiAqL1xuXG5jb25zdCBVQ1VNX1NZU1RFTSA9IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiO1xuXG4vLyBGSElSIFI0IFF1YW50aXR5LmNvbXBhcmF0b3IgYWxsb3dlZCB2YWx1ZXMuIE5vcm1hbGlzZSBmdWxsLXdpZHRoIENKS1xuLy8gXHVGRjFFIFx1RkYxQyBcdTIyNjcgXHUyMjY2ICsgQVNDSUkgdmFyaWFudHMgc28gXCJcdUZGMUUgNDAuMFwiIHN0aWxsIHBhcnNlcyBhcyBhIHJlYWwgbnVtYmVyXG4vLyBpbnN0ZWFkIG9mIGZhbGxpbmcgdGhyb3VnaCB0byB2YWx1ZVN0cmluZyAod2hpY2ggbG9zZXMgdGhlIHVuaXQpLlxuY29uc3QgRlVMTFdJRFRIX09QUzogUmVhZG9ubHlBcnJheTxbc3RyaW5nLCBzdHJpbmddPiA9IFtcbiAgW1wiXHVGRjFFXCIsIFwiPlwiXSxcbiAgW1wiXHVGRjFDXCIsIFwiPFwiXSxcbiAgW1wiXHUyMjY3XCIsIFwiPj1cIl0sXG4gIFtcIlx1MjI2NlwiLCBcIjw9XCJdLFxuICBbXCJcdTIyNjVcIiwgXCI+PVwiXSxcbiAgW1wiXHUyMjY0XCIsIFwiPD1cIl0sXG5dO1xuXG5mdW5jdGlvbiB0cmFuc2xhdGVGdWxsd2lkdGgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IG91dCA9IHM7XG4gIGZvciAoY29uc3QgW2Zyb20sIHRvXSBvZiBGVUxMV0lEVEhfT1BTKSB7XG4gICAgaWYgKG91dC5pbmNsdWRlcyhmcm9tKSkge1xuICAgICAgb3V0ID0gb3V0LnNwbGl0KGZyb20pLmpvaW4odG8pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5jb25zdCBDT01QQVJBVE9SX1JFID0gL15cXHMqKDw9fD49fDx8PilcXHMqKC4rKSQvO1xuXG4vLyBSZWZlcmVuY2UtcmFuZ2UgcGFyc2luZy4gTkhJIHNoaXBzIHRoZSByYW5nZSBhcyBwbGFpbiB0ZXh0IGxpa2Vcbi8vIFwiWzMuODldWzI2LjhdXCIsIFwiWzQwXVtdXCIsIFwiW05lZ2F0aXZlXVwiIG9yIFwiQU0gODowMCA2LjItMTkuNFwiLlxuY29uc3QgUlJfTE9XSElHSF9CUkFDS0VUUyA9IC9eXFxzKlxcW1xccyooW15cXF1dKilcXHMqXFxdXFxzKlxcW1xccyooW15cXF1dKilcXHMqXFxdXFxzKiQvO1xuY29uc3QgUlJfREFTSF9SQU5HRSA9IC8oLT9cXGQrKD86XFwuXFxkKyk/KVxccypbLX5cdTIwMTNdXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pLztcbmNvbnN0IFJSX0NPTVBBUkFUT1IgPSAvXlxccyooPD18Pj18PHw+KVxccyooLT9cXGQrKD86XFwuXFxkKyk/KVxccyokLztcbi8vIFNleC1zdHJhdGlmaWVkIGJyYWNrZXRlZCByYW5nZSwgZS5nLiBcIlx1NzUzNzoxMy43IFx1NTk3MzoxMS4xXCIgXHUyMDE0IHVzZWQgYnkgc29tZVxuLy8gaG9zcGl0YWxzIGZvciBoYWVtYXRvbG9neSAoSGIsIFJCQywgSGN0KS4gUHVsbHMgb3V0IChzZXgsIHZhbHVlKSBwYWlycy5cbi8vIFRvbGVyYXRlcyBvcHRpb25hbCBjb21wYXJhdG9yIChcdTIyNjcvXHUyMjY2Lz4vPCkgYmVmb3JlIHRoZSBudW1iZXIuXG5jb25zdCBSUl9TRVhfTlVNX0cgPSAvKFx1NzUzN1x1NjAyN3xcdTU5NzNcdTYwMjd8XHU3NTM3fFx1NTk3M3xNfEYpXFxzKls6XHVGRjFBXT9cXHMqKD86Wzw+XHUyMjY3XHUyMjY2XT0/KT9cXHMqKC0/XFxkKyg/OlxcLlxcZCspPykvZztcbmNvbnN0IFJSX1NJTkdMRV9CUkFDS0VUID0gL15cXHMqXFxbXFxzKiguKz8pXFxzKlxcXVxccyokLztcbmNvbnN0IFJSX1FVQUxJVEFUSVZFX1BBUkVOID1cbiAgL15cXHMqKE5vcm1hbHxcdTZCNjNcdTVFMzh8Tm9ucmVhY3RpdmV8Tm9uLXJlYWN0aXZlKVxccypcXChcXHMqKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqXFwpXFxzKiQvaTtcblxuY29uc3QgU0VYX1RPX0ZISVI6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBcdTc1MzdcdTYwMjc6IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBcdTc1Mzc6IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBNOiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgXHU1OTczXHU2MDI3OiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG4gIFx1NTk3MzogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxuICBGOiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG59O1xuXG4vLyBQdWJsaWMgdHlwZXMgXHUyMDE0IEZISVIgUXVhbnRpdHkgLyByZWZlcmVuY2VSYW5nZSBzaGFwZXMgdXNlZCBkb3duc3RyZWFtLlxuZXhwb3J0IGludGVyZmFjZSBRdWFudGl0eSB7XG4gIHZhbHVlOiBudW1iZXI7XG4gIHVuaXQ/OiBzdHJpbmc7XG4gIHN5c3RlbT86IHN0cmluZztcbiAgY29kZT86IHN0cmluZztcbiAgY29tcGFyYXRvcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSYW5nZUVudHJ5IHtcbiAgdGV4dDogc3RyaW5nO1xuICBsb3c/OiBRdWFudGl0eTtcbiAgaGlnaD86IFF1YW50aXR5O1xuICBhcHBsaWVzVG8/OiBBcnJheTx7XG4gICAgY29kaW5nOiBBcnJheTx7IHN5c3RlbTogc3RyaW5nOyBjb2RlOiBzdHJpbmc7IGRpc3BsYXk6IHN0cmluZyB9PjtcbiAgICB0ZXh0OiBzdHJpbmc7XG4gIH0+O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVUNVTSBub3JtYWxpc2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIE5ISSBsYWJzIHJlcG9ydCB1bml0cyBpbiBhIG1peCBvZiBVQ1VNLWNsZWFuIHN0cmluZ3MgKCdtZy9kTCcpLFxuICogVGFpd2FuLXN0eWxlIGVxdWl2YWxlbnRzICgnbUVxL0wnIHZzIFVDVU0gJ21lcS9MJyksIGZ1bGwtd2lkdGggcHVuY3R1YXRpb25cbiAqICgnXHVGRjA1JyB2cyAnJScpLCBhbmQgcGxhY2Vob2xkZXIgdGV4dCAoJ1x1NzEyMScpLiBUaGUgVFdOSElGSElSIHZhbGlkYXRvclxuICogcmVqZWN0cyBldmVyeXRoaW5nIGV4Y2VwdCBjYW5vbmljYWwgVUNVTSBpbiBRdWFudGl0eS5jb2RlLCBzbyB3ZVxuICogbm9ybWFsaXNlLiBgbnVsbGAgbWVhbnMgXCJvbWl0IFF1YW50aXR5LmNvZGUgZW50aXJlbHlcIi5cbiAqL1xuY29uc3QgVUNVTV9PVkVSUklERVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bGw+ID0ge1xuICAvLyBGdWxsd2lkdGggXHUyMTkyIEFTQ0lJXG4gIFwiXHVGRjA1XCI6IFwiJVwiLFxuICAvLyBDYXNlLXNlbnNpdGl2ZSBVQ1VNIChFcSBpcyAnZXEnLCBub3QgJ0VxJylcbiAgXCJtRXEvTFwiOiBcIm1lcS9MXCIsXG4gIFwibWVxL2xcIjogXCJtZXEvTFwiLFxuICAvLyBCUCBwcm9maWxlIGZpeGVkLXZhbHVlOiBtbVtIZ10gbm90IG1tSGdcbiAgbW1IZzogXCJtbVtIZ11cIixcbiAgTU1IRzogXCJtbVtIZ11cIixcbiAgLy8gQ29tbW9uIENoaW5lc2UgJ25vIHVuaXQnIHBsYWNlaG9sZGVycyBcdTIxOTIgZHJvcCBVQ1VNIGNvZGVcbiAgXHU3MTIxOiBudWxsLFxuICBcIlwiOiBudWxsLFxuICBcIlx1MjAxNFwiOiBudWxsLFxuICBcIi1cIjogbnVsbCxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VjdW0odW5pdDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXVuaXQpIHJldHVybiBudWxsO1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFVDVU1fT1ZFUlJJREVTLCB1bml0KSkge1xuICAgIHJldHVybiBVQ1VNX09WRVJSSURFU1t1bml0XSA/PyBudWxsO1xuICB9XG4gIHJldHVybiB1bml0O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUXVhbnRpdHkgYnVpbGRlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gbWFrZVF1YW50aXR5KHZhbHVlOiBudW1iZXIsIHVuaXQ6IHN0cmluZyk6IFF1YW50aXR5IHtcbiAgY29uc3QgcTogUXVhbnRpdHkgPSB7IHZhbHVlIH07XG4gIGlmICh1bml0KSB7XG4gICAgcS51bml0ID0gdW5pdDtcbiAgICBxLnN5c3RlbSA9IFVDVU1fU1lTVEVNO1xuICAgIHEuY29kZSA9IHVuaXQ7XG4gIH1cbiAgcmV0dXJuIHE7XG59XG5cbmZ1bmN0aW9uIHRyeVBhcnNlRmxvYXQoczogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmIChzID09PSBcIlwiIHx8IHMgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIC8vIE1pcnJvciBQeXRob24ncyBmbG9hdCgpIFx1MjAxNCBhbGxvdyBsZWFkaW5nL3RyYWlsaW5nIHdoaXRlc3BhY2UsXG4gIC8vIG9wdGlvbmFsIHNpZ24sIGRlY2ltYWwuIFJlamVjdCBpZiBOYU4gT1IgaWYgYW55IG5vbi1udW1lcmljIHJlc2lkdWFsXG4gIC8vIChOdW1iZXIoXCIxMmFiY1wiKSByZXR1cm5zIE5hTiwgT0s7IFwiMTIgIGFiY1wiIGFsc28gTmFOLCBPSykuXG4gIGNvbnN0IHRyaW1tZWQgPSBzLnRyaW0oKTtcbiAgaWYgKHRyaW1tZWQgPT09IFwiXCIpIHJldHVybiBudWxsO1xuICBjb25zdCBuID0gTnVtYmVyKHRyaW1tZWQpO1xuICBpZiAoTnVtYmVyLmlzTmFOKG4pKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIG47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBwYXJzZVJhbmdlTXVsdGkgLyBwYXJzZVJhbmdlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIExpc3QgdmFyaWFudCBvZiBwYXJzZVJhbmdlOiBlbWl0cyBvbmUgZW50cnkgcGVyIHNleCB3aGVuIHRoZSByYW5nZSBpc1xuICogc2V4LXN0cmF0aWZpZWQgKFwiW1x1NzUzNzoxMy43IFx1NTk3MzoxMS4xXVtcdTc1Mzc6MTcuMCBcdTU5NzM6MTUuMF1cIiksIG90aGVyd2lzZSBhXG4gKiBzaW5nbGUtZWxlbWVudCBsaXN0LiBFYWNoIGVudHJ5IHRhZ2dlZCB3aXRoIGFwcGxpZXNUbyBzbyBkb3duc3RyZWFtXG4gKiBjb2RlIGNhbiBwaWNrIHRoZSByaWdodCBvbmUgZm9yIHRoZSBwYXRpZW50J3Mgc2V4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSYW5nZU11bHRpKHJhd1JhbmdlOiBzdHJpbmcsIHVuaXQ6IHN0cmluZyk6IFJhbmdlRW50cnlbXSB7XG4gIGNvbnN0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoKHJhd1JhbmdlIHx8IFwiXCIpLnRyaW0oKSk7XG4gIGlmICghcykgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IGxvd0J5U2V4OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IGhpZ2hCeVNleDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBsZXQgdXNlZE11bHRpID0gZmFsc2U7XG5cbiAgY29uc3QgbSA9IHMubWF0Y2goUlJfTE9XSElHSF9CUkFDS0VUUyk7XG4gIGlmIChtKSB7XG4gICAgY29uc3QgbG93QmxvYiA9IG1bMV0gPz8gXCJcIjtcbiAgICBjb25zdCBoaWdoQmxvYiA9IG1bMl0gPz8gXCJcIjtcbiAgICBmb3IgKGNvbnN0IHNtIG9mIGxvd0Jsb2IubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgaWYgKHNtWzFdICYmIHNtWzJdKSBsb3dCeVNleFtzbVsxXV0gPSBzbVsyXTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzbSBvZiBoaWdoQmxvYi5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICBpZiAoc21bMV0gJiYgc21bMl0pIGhpZ2hCeVNleFtzbVsxXV0gPSBzbVsyXTtcbiAgICB9XG4gICAgdXNlZE11bHRpID0gT2JqZWN0LmtleXMobG93QnlTZXgpLmxlbmd0aCA+IDAgfHwgT2JqZWN0LmtleXMoaGlnaEJ5U2V4KS5sZW5ndGggPiAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFNpbmdsZS1icmFja2V0OiBlYWNoIHBlci1zZXggdmFsdWUncyBjb21wYXJhdG9yIGRlY2lkZXMgbG93IHZzIGhpZ2guXG4gICAgY29uc3Qgc2luZ2xlID0gcy5tYXRjaChSUl9TSU5HTEVfQlJBQ0tFVCk7XG4gICAgaWYgKHNpbmdsZSkge1xuICAgICAgY29uc3QgaW5uZXIgPSBzaW5nbGVbMV0gPz8gXCJcIjtcbiAgICAgIGZvciAoY29uc3Qgc20gb2YgaW5uZXIubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgICBjb25zdCBzZXhLZXkgPSBzbVsxXSA/PyBcIlwiO1xuICAgICAgICBjb25zdCB2YWxTdHIgPSBzbVsyXSA/PyBcIlwiO1xuICAgICAgICAvLyBGaW5kIHRoZSBjb21wYXJhdG9yIGltbWVkaWF0ZWx5IHByZWNlZGluZyB0aGlzIG51bWJlci5cbiAgICAgICAgLy8gTWlycm9yIHRoZSBQeXRob246IHJlYnVpbGQgYSBwZXItc2V4LWtleSBzZWFyY2guXG4gICAgICAgIGNvbnN0IHBhdCA9IG5ldyBSZWdFeHAoYCR7ZXNjYXBlUmVnZXgoc2V4S2V5KX1cXFxccypbOlx1RkYxQV0/XFxcXHMqKFs8Plx1MjI2N1x1MjI2Nl09Pyk/XFxcXHMqLT9cXFxcZGApO1xuICAgICAgICBjb25zdCBjbSA9IGlubmVyLm1hdGNoKHBhdCk7XG4gICAgICAgIGNvbnN0IG9wID0gY20/LlsxXSA/PyBcIlwiO1xuICAgICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgICBsb3dCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9IGVsc2UgaWYgKG9wID09PSBcIjxcIiB8fCBvcCA9PT0gXCI8PVwiKSB7XG4gICAgICAgICAgaGlnaEJ5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG93QnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdXNlZE11bHRpID0gT2JqZWN0LmtleXMobG93QnlTZXgpLmxlbmd0aCA+IDAgfHwgT2JqZWN0LmtleXMoaGlnaEJ5U2V4KS5sZW5ndGggPiAwO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1c2VkTXVsdGkpIHtcbiAgICBjb25zdCBlbnRyaWVzOiBSYW5nZUVudHJ5W10gPSBbXTtcbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIHVuaW9uIG9mIGtleXMgYWN0dWFsbHkgc2VlbiBcdTIwMTQgcHJlc2VydmUgaW5zZXJ0aW9uIG9yZGVyLlxuICAgIGNvbnN0IGFsbFNleEtleXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBrIG9mIFsuLi5PYmplY3Qua2V5cyhsb3dCeVNleCksIC4uLk9iamVjdC5rZXlzKGhpZ2hCeVNleCldKSB7XG4gICAgICBpZiAoIWFsbFNleEtleXMuaW5jbHVkZXMoaykpIGFsbFNleEtleXMucHVzaChrKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzZXhLZXkgb2YgYWxsU2V4S2V5cykge1xuICAgICAgY29uc3QgbWFwcGluZyA9IFNFWF9UT19GSElSW3NleEtleV07XG4gICAgICBpZiAoIW1hcHBpbmcpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgW2ZoaXJDb2RlLCBmaGlyRGlzcGxheV0gPSBtYXBwaW5nO1xuICAgICAgY29uc3QgZW50cnk6IFJhbmdlRW50cnkgPSB7XG4gICAgICAgIHRleHQ6IHJhd1JhbmdlLFxuICAgICAgICBhcHBsaWVzVG86IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vaGw3Lm9yZy9maGlyL2FkbWluaXN0cmF0aXZlLWdlbmRlclwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IGZoaXJDb2RlLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZoaXJEaXNwbGF5LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHRleHQ6IGZoaXJEaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgICAgaWYgKHNleEtleSBpbiBsb3dCeVNleCkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChsb3dCeVNleFtzZXhLZXldISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgICBpZiAoc2V4S2V5IGluIGhpZ2hCeVNleCkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChoaWdoQnlTZXhbc2V4S2V5XSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICAgIGVudHJpZXMucHVzaChlbnRyeSk7XG4gICAgfVxuICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIERlLWR1cCBieSBGSElSIHNleCBjb2RlIGluIGNhc2UgaW5wdXQgaGFzIGJvdGggXHU3NTM3IGFuZCBcdTc1MzdcdTYwMjcuXG4gICAgICBjb25zdCBzZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICBjb25zdCBvdXQ6IFJhbmdlRW50cnlbXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBlIG9mIGVudHJpZXMpIHtcbiAgICAgICAgY29uc3QgYyA9IGUuYXBwbGllc1RvPy5bMF0/LmNvZGluZ1swXT8uY29kZTtcbiAgICAgICAgaWYgKCFjIHx8IHNlZW4uaGFzKGMpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoYyk7XG4gICAgICAgIG91dC5wdXNoKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvbmUgPSBwYXJzZVJhbmdlKHJhd1JhbmdlLCB1bml0KTtcbiAgcmV0dXJuIG9uZSA/IFtvbmVdIDogW107XG59XG5cbi8qKlxuICogQ29udmVydCBhIHJlZmVyZW5jZS1yYW5nZSB0ZXh0IGludG8gYSBGSElSIHJlZmVyZW5jZVJhbmdlIGVudHJ5LlxuICpcbiAqIFN0cmF0ZWd5IGluIG9yZGVyOlxuICogICAxLiBcIltsb3ddW2hpZ2hdXCIgYnJhY2tldGVkIGZvcm1hdCBcdTIwMTQgTkhJJ3MgY2Fub25pY2FsIHNoYXBlLlxuICogICAyLiBcIjMuODktMjYuOFwiIC8gXCIzLjg5fjI2LjhcIiBkYXNoIHJhbmdlLlxuICogICAzLiBcIj4gNDBcIiAvIFwiPCAwLjVcIiBzaW5nbGUtc2lkZWQuXG4gKiAgIDQuIFF1YWxpdGF0aXZlIChcIk5lZ2F0aXZlXCIsIFwiQU0gODowMCA2LjItMTkuNFwiKSBcdTIwMTQgdGV4dC1vbmx5LlxuICpcbiAqIFNleC1zdHJhdGlmaWVkIHNoYXBlcyBnbyB0aHJvdWdoIHBhcnNlUmFuZ2VNdWx0aS4gUmV0dXJucyBudWxsIG9ubHlcbiAqIGZvciBlbXB0eSBpbnB1dC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmFuZ2UocmF3UmFuZ2U6IHN0cmluZywgdW5pdDogc3RyaW5nKTogUmFuZ2VFbnRyeSB8IG51bGwge1xuICBjb25zdCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKChyYXdSYW5nZSB8fCBcIlwiKS50cmltKCkpO1xuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBjb25zdCBlbnRyeTogUmFuZ2VFbnRyeSA9IHsgdGV4dDogcmF3UmFuZ2UgfTtcblxuICBjb25zdCBtID0gcy5tYXRjaChSUl9MT1dISUdIX0JSQUNLRVRTKTtcbiAgaWYgKG0pIHtcbiAgICBjb25zdCBsbyA9IChtWzFdID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCBoaSA9IChtWzJdID8/IFwiXCIpLnRyaW0oKTtcbiAgICBmb3IgKGNvbnN0IFtzaWRlLCBzaWRlVmFsXSBvZiBbXG4gICAgICBbXCJsb3dcIiwgbG9dLFxuICAgICAgW1wiaGlnaFwiLCBoaV0sXG4gICAgXSBhcyBjb25zdCkge1xuICAgICAgaWYgKCFzaWRlVmFsIHx8IHNpZGVWYWwgPT09IFwiXHU3MTIxXCIgfHwgc2lkZVZhbCA9PT0gXCJcdTdBN0FcdTc2N0RcIikgY29udGludWU7XG5cbiAgICAgIC8vIDEuIFBsYWluIGZsb2F0XG4gICAgICBjb25zdCBhc0Zsb2F0ID0gdHJ5UGFyc2VGbG9hdChzaWRlVmFsKTtcbiAgICAgIGlmIChhc0Zsb2F0ICE9PSBudWxsKSB7XG4gICAgICAgIGVudHJ5W3NpZGVdID0gbWFrZVF1YW50aXR5KGFzRmxvYXQsIHVuaXQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gMi4gRGFzaCByYW5nZSBcdTIwMTQgbWVhbmluZ2Z1bCBvbmx5IGZvciBgbG93YCBzbG90OyBzcGxpdHMgaW50byBsb3craGlnaC5cbiAgICAgIGNvbnN0IGRtID0gc2lkZVZhbC5tYXRjaChSUl9EQVNIX1JBTkdFKTtcbiAgICAgIGlmIChkbSAmJiBzaWRlID09PSBcImxvd1wiICYmIGVudHJ5LmhpZ2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCB2MSA9IHRyeVBhcnNlRmxvYXQoZG1bMV0hKTtcbiAgICAgICAgY29uc3QgdjIgPSB0cnlQYXJzZUZsb2F0KGRtWzJdISk7XG4gICAgICAgIGlmICh2MSAhPT0gbnVsbCAmJiB2MiAhPT0gbnVsbCkge1xuICAgICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2MSwgdW5pdCk7XG4gICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2MiwgdW5pdCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gMy4gQ29tcGFyYXRvciAoXHUyMjY3NjAsIDw9MC4wNCBldGMuKVxuICAgICAgY29uc3QgY20gPSBzaWRlVmFsLm1hdGNoKFJSX0NPTVBBUkFUT1IpO1xuICAgICAgaWYgKGNtKSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGNtWzJdISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3Qgb3AgPSBjbVsxXTtcbiAgICAgICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gNC4gXCJOb3JtYWwgKCBYIClcIiAvIFwiTm9ucmVhY3RpdmUgKCBYIClcIiBcdTIwMTQgWCBpcyB0aGUgY3V0b2ZmIChoaWdoIGJvdW5kKS5cbiAgICAgIGNvbnN0IHFtID0gc2lkZVZhbC5tYXRjaChSUl9RVUFMSVRBVElWRV9QQVJFTik7XG4gICAgICBpZiAocW0pIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQocW1bMl0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIGNvbnN0IGRhc2hNYXRjaCA9IHMubWF0Y2goUlJfREFTSF9SQU5HRSk7XG4gIGlmIChkYXNoTWF0Y2gpIHtcbiAgICBjb25zdCB2MSA9IHRyeVBhcnNlRmxvYXQoZGFzaE1hdGNoWzFdISk7XG4gICAgY29uc3QgdjIgPSB0cnlQYXJzZUZsb2F0KGRhc2hNYXRjaFsyXSEpO1xuICAgIGlmICh2MSAhPT0gbnVsbCAmJiB2MiAhPT0gbnVsbCkge1xuICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYxLCB1bml0KTtcbiAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodjIsIHVuaXQpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBjb25zdCBjbXBNYXRjaCA9IHMubWF0Y2goUlJfQ09NUEFSQVRPUik7XG4gIGlmIChjbXBNYXRjaCkge1xuICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGNtcE1hdGNoWzJdISk7XG4gICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG9wID0gY21wTWF0Y2hbMV07XG4gICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgLy8gRmFsbCB0aHJvdWdoOiBxdWFsaXRhdGl2ZSBvciBjb21wbGV4IFx1MjAxNCB0ZXh0LW9ubHkgaXMgRkhJUi1jb3JyZWN0LlxuICByZXR1cm4gZW50cnk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCB0cnlQYXJzZVF1YW50aXR5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIFBhcnNlIFwiPiA0MC4wXCIgLyBcIjwwLjAxMFwiIC8gXCIxLDIzNC41XCIgXHUyMTkyIEZISVIgUXVhbnRpdHkgd2l0aCBjb21wYXJhdG9yLlxuICogUmV0dXJucyBudWxsIHdoZW4gdGhlIHJlc2lkdWFsIGFmdGVyIHN0cmlwcGluZyBhIGNvbXBhcmF0b3Igc3RpbGxcbiAqIGlzbid0IG51bWVyaWMgXHUyMDE0IGNhbGxlciBmYWxscyBiYWNrIHRvIHZhbHVlU3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJ5UGFyc2VRdWFudGl0eShcbiAgcmF3VmFsdWU6IHN0cmluZyB8IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHVuaXQ6IHN0cmluZyxcbik6IFF1YW50aXR5IHwgbnVsbCB7XG4gIGlmIChyYXdWYWx1ZSA9PT0gbnVsbCB8fCByYXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoU3RyaW5nKHJhd1ZhbHVlKS50cmltKCkpO1xuICBsZXQgY29tcGFyYXRvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGNtID0gcy5tYXRjaChDT01QQVJBVE9SX1JFKTtcbiAgaWYgKGNtKSB7XG4gICAgY29tcGFyYXRvciA9IGNtWzFdID8/IG51bGw7XG4gICAgcyA9IChjbVsyXSA/PyBcIlwiKS50cmltKCk7XG4gIH1cbiAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQocy5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgaWYgKHYgPT09IG51bGwpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHVjdW1Db2RlID0gdG9VY3VtKHVuaXQpO1xuICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgIHZhbHVlOiB2LFxuICAgIHN5c3RlbTogVUNVTV9TWVNURU0sXG4gIH07XG4gIC8vIFF1YW50aXR5LnVuaXQgKGh1bWFuLXJlYWRhYmxlKSBrZWVwcyB0aGUgb3JpZ2luYWwgTkhJIGxhYmVsIHNvIHVzZXJzXG4gIC8vIHN0aWxsIHNlZSAnXHVGRjA1JyBvciAnbUVxL0wnIHJhdy4gUXVhbnRpdHkuY29kZSBpcyBzdHJpY3QgVUNVTSBtYWNoaW5lXG4gIC8vIGNvZGUuIERyb3AgdW5pdCBkaXNwbGF5IHdoZW4gZW1wdHkgc28gd2UgZG9uJ3QgZW1pdCBcInVuaXRcIjogXCJcIi5cbiAgaWYgKHVuaXQpIHtcbiAgICBxdHkudW5pdCA9IHVuaXQ7XG4gIH1cbiAgaWYgKHVjdW1Db2RlICE9PSBudWxsKSB7XG4gICAgcXR5LmNvZGUgPSB1Y3VtQ29kZTtcbiAgfVxuICBpZiAoY29tcGFyYXRvcikge1xuICAgIHF0eS5jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgfVxuICByZXR1cm4gcXR5O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuIiwgIi8qKlxuICogT2JzZXJ2YXRpb24gbWFwcGVyIFx1MjAxNCBzaW5nbGUtcm93IGFuZCBwYW5lbC1ncm91cGVkIHZhcmlhbnRzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9vYnNlcnZhdGlvbi5weWAgKDEyMTIgbGluZXMpLiBJbmNsdWRlczpcbiAqICAgLSBtYXBPYnNlcnZhdGlvbihyYXcsIHBhdGllbnRJZCkgXHUyMTkyIHNpbmdsZSBPYnNlcnZhdGlvblxuICogICAtIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQoaXRlbXMsIHBhdGllbnRJZCkgXHUyMTkyIERpYWdub3N0aWNSZXBvcnQgKyBPYnNlcnZhdGlvbnNcbiAqICAgLSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgXHUyMDE0IGNyb3NzLXBhZ2UgZGVkdXAga2V5XG4gKiAgIC0gZmluZExvaW5jLCBidWlsZENvZGluZ3MsIG1hcEludGVycHJldGF0aW9uLCBkZXJpdmVJbnRlcnByZXRhdGlvblxuICogICAtIGRlZHVwZUNyb3NzRm9ybWF0LCBjb21iaW5lQnBJdGVtcywgZ3JvdXBCeU9yZGVyQ29kZVxuICogICAtIGluZmVyU3BlY2ltZW5cbiAqXG4gKiBGdW5jdGlvbmFsIHBhcml0eSB3aXRoIHRoZSBQeXRob24gaW1wbGVtZW50YXRpb24gaXMgdGhlIGdvYWwuIEZpZWxkXG4gKiBvcmRlciBpbiB0aGUgZW1pdHRlZCByZXNvdXJjZXMgbWF5IGRpZmZlciAoSlMgb2JqZWN0IGxpdGVyYWwgb3JkZXIpXG4gKiBidXQgY29udGVudCBpcyBpZGVudGljYWwuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB7XG4gIERJU1BMQVlfRklSU1RfQ09ERVMsXG4gIExPSU5DX0RJU1BMQVksXG4gIExPSU5DX01BUCxcbiAgTkhJX1RPX0xPSU5DLFxuICBQQU5FTF9MT0lOQ19NQVAsXG59IGZyb20gXCIuL2xvaW5jLXRhYmxlc1wiO1xuaW1wb3J0IHtcbiAgdHlwZSBRdWFudGl0eSxcbiAgdHlwZSBSYW5nZUVudHJ5LFxuICBwYXJzZVJhbmdlLFxuICBwYXJzZVJhbmdlTXVsdGksXG4gIHRvVWN1bSxcbiAgdHJ5UGFyc2VRdWFudGl0eSxcbn0gZnJvbSBcIi4vcGFyc2Vyc1wiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW1hZ2luZyBkZXRlY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElNQUdJTkdfS0VZV09SRFM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgXCJ1bHRyYXNvdW5kXCIsXG4gIFwic29ub2dyYW1cIixcbiAgXCJzb25vZ3JhcGh5XCIsXG4gIFwiZWNob1wiLFxuICBcImN0IFwiLFxuICBcImN0L1wiLFxuICBcImN0LVwiLFxuICBcImNvbXB1dGVkIHRvbW9ncmFwaHlcIixcbiAgXCJtcmlcIixcbiAgXCJtYWduZXRpYyByZXNvbmFuY2VcIixcbiAgXCJ4LXJheVwiLFxuICBcInhyYXlcIixcbiAgXCJ4IHJheVwiLFxuICBcIm1hbW1vZ3JhcGh5XCIsXG4gIFwibWFtbW9cIixcbiAgXCJla2dcIixcbiAgXCJlY2dcIixcbiAgXCJlbGVjdHJvY2FyZGlvZ3JhbVwiLFxuICBcImVuZG9zY29wXCIsXG4gIFwiY29sb25vc2NvcFwiLFxuICBcImdhc3Ryb3Njb3BcIixcbiAgXCJicm9uY2hvc2NvcFwiLFxuICBcInBldC9jdFwiLFxuICBcInBldCBcIixcbiAgXCJzcGVjdFwiLFxuICBcIlx1NUY3MVx1NTBDRlwiLFxuICBcIlx1OEQ4NVx1OTdGM1x1NkNFMlwiLFxuICBcIlx1OTZGQlx1ODE2Nlx1NjVCN1x1NUM2NFwiLFxuICBcIlx1NjgzOFx1NzhDMVx1NTE3MVx1NjMyRlwiLFxuICBcIlx1NUZDM1x1OTZGQlx1NTcxNlwiLFxuICBcIlx1NTE2N1x1ODk5Nlx1OTNFMVwiLFxuICBcIlx1NEU3M1x1NjIzRlx1NjUxRFx1NUY3MVwiLFxuXTtcblxuZnVuY3Rpb24gbG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5OiBzdHJpbmcsIGNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBoYXlzdGFjayA9IGAke2Rpc3BsYXl9ICR7Y29kZX1gLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBJTUFHSU5HX0tFWVdPUkRTLnNvbWUoKGt3KSA9PiBoYXlzdGFjay5pbmNsdWRlcyhrdykpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTE9JTkMgbG9va3VwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBOSElfTEFCX0NPREVfUkUgPSAvXlxcZHs0LDZ9W0EtWl0kLztcblxuZnVuY3Rpb24gaXNBc2NpaU9ubHkoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgPiAxMjcpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuXG4vLyBDaGVjayB3aGV0aGVyIGEgc2luZ2xlIExPSU5DX01BUCBrZXkgbWF0Y2hlcyB0aGUgbGFiJ3MgY29tYmluZWRcbi8vIChjb2RlICsgZGlzcGxheSkgc3RyaW5nLiBUd28gcnVsZXM6XG4vL1xuLy8gMS4gQVNDSUkga2V5czogYFxcYjxrZXk+XFxiYCBcdTIwMTQgd29yZCBib3VuZGFyaWVzIG9uIEJPVEggc2lkZXMuIFRoZVxuLy8gICAgbm8tdHJhaWxpbmctYm91bmRhcnkgc2VtYW50aWMgb2YgdGhlIG9sZGVyIGBcXGI8a2V5PmAgbWF0Y2hlclxuLy8gICAgY2F1c2VkIHNob3J0IGtleXMgbGlrZSBcImhiXCIgKEhlbW9nbG9iaW4pIHRvIGluY29ycmVjdGx5IG1hdGNoXG4vLyAgICBsb25nZXIgdGVybXMgbGlrZSBcImhic2FnXCIgKEhCc0FnKSBhbmQgXCJwaG9zcGhhdGVcIiAobWF0Y2hlZCBieVxuLy8gICAgXCJwaFwiKS4gUmVxdWlyaW5nIGFuIGVuZCBib3VuZGFyeSBtZWFucyBcImhiXCIgb25seSBtYXRjaGVzIHdoZW5cbi8vICAgIGl0IHN0YW5kcyBhcyBpdHMgb3duIHdvcmQuXG4vL1xuLy8gMi4gQ0pLIC8gbm9uLUFTQ0lJIGtleXM6IHBsYWluIHN1YnN0cmluZyBpbmNsdWRlcygpLiBcXGIgZG9lc24ndFxuLy8gICAgc2VtYW50aWNhbGx5IHdvcmsgZm9yIENKSyAobm8gd29yZC1jaGFyYWN0ZXIgY2xhc3MgY29uY2VwdCkuXG5mdW5jdGlvbiBfa2V5d29yZE1hdGNoZXMoa2V5OiBzdHJpbmcsIGNvbWJpbmVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgayA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoayl9XFxcXGJgKS50ZXN0KGNvbWJpbmVkKTtcbiAgfVxuICByZXR1cm4gY29tYmluZWQuaW5jbHVkZXMoayk7XG59XG5cbi8vIFBpY2sgdGhlIExPTkdFU1QgbWF0Y2hpbmcga2V5IGZyb20gdGhlIHRhYmxlLCBub3QgdGhlIGZpcnN0LiBBdm9pZHNcbi8vIHRoZSBzYW1lIGJ1ZyBmYW1pbHkgZnJvbSBhIHNlY29uZCBhbmdsZTogaHlwaGVuYXRlZCBrZXlzIGxpa2Vcbi8vIFwibGRsLWNob2xlc3Rlcm9sXCIgc2hhcmUgYSBgXFxiLi4uXFxiYCBib3VuZGFyeSBhdCB0aGUgaHlwaGVuLCBzbyBcImxkbFwiXG4vLyAoMyBjaGFycykgYWxzbyBtYXRjaGVzIGEgXCJsZGwtY2hvbGVzdGVyb2xcIiBzdHJpbmcuIExvbmdlc3QtbWF0Y2hcbi8vIG1ha2VzIHRoZSBtb3JlIHNwZWNpZmljIGtleSB3aW4gcmVnYXJkbGVzcyBvZiBpbnNlcnRpb24gb3JkZXIsIHNvXG4vLyB0aGUgYnJpdHRsZSBcImxvbmcgbXVzdCBhcHBlYXIgYmVmb3JlIHNob3J0XCIgY29tbWVudHMgc2NhdHRlcmVkXG4vLyB0aHJvdWdoIExPSU5DX01BUCBiZWNvbWUgdW5uZWNlc3NhcnkuXG5mdW5jdGlvbiBfZmluZExvbmdlc3RNYXRjaChcbiAgY29tYmluZWQ6IHN0cmluZyxcbiAgdGFibGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgbGV0IGJlc3RMb2luYzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBiZXN0S2V5TGVuID0gMDtcbiAgZm9yIChjb25zdCBba2V5LCBsb2luY10gb2YgT2JqZWN0LmVudHJpZXModGFibGUpKSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiBiZXN0S2V5TGVuICYmIF9rZXl3b3JkTWF0Y2hlcyhrZXksIGNvbWJpbmVkKSkge1xuICAgICAgYmVzdExvaW5jID0gbG9pbmM7XG4gICAgICBiZXN0S2V5TGVuID0ga2V5Lmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJlc3RMb2luYztcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJpbWFyeSBMT0lOQyBmb3IgdGhpcyBsYWIuIFBhbmVsLWF3YXJlIGxvb2t1cDpcbiAqICAgQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgXHUyMTkyIHVzZSBOSElfVE9fTE9JTkMgZGlyZWN0bHkuXG4gKiAgIEIuIFBhbmVsIGNvZGUgT1IgdW5rbm93biBjb2RlIFx1MjE5MiB3YWxrIExPSU5DX01BUCBieSBkaXNwbGF5IGtleXdvcmRcbiAqICAgICAgKGxvbmdlc3Qta2V5IG1hdGNoIHdpbnMsIGJvdGgtc2lkZSB3b3JkIGJvdW5kYXJpZXMgZW5mb3JjZWQpLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGNvbnN0IGhpdCA9IF9maW5kTG9uZ2VzdE1hdGNoKGNvbWJpbmVkLCBQQU5FTF9MT0lOQ19NQVBbY29kZV0hKTtcbiAgICBpZiAoaGl0KSByZXR1cm4gaGl0O1xuICB9XG5cbiAgLy8gQi4gRGlzcGxheS1rZXl3b3JkIHNlYXJjaC5cbiAgY29uc3QgaGl0ID0gX2ZpbmRMb25nZXN0TWF0Y2goY29tYmluZWQsIExPSU5DX01BUCk7XG4gIGlmIChoaXQpIHJldHVybiBoaXQ7XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIC8vIFNvdXJjZS1wcm9ncmFtbWUgdGFnIFx1MjAxNCBzZXQgd2hlbiB0aGUgYWRhcHRlciBwdWxsZWQgdGhpcyBvYnNlcnZhdGlvblxuICAvLyBvdXQgb2YgYSBzcGVjaWZpYyBOSEkgc2NyZWVuaW5nIHByb2dyYW1tZSAoZS5nLiBhZGFwdEFkdWx0UHJldmVudGl2ZVxuICAvLyBzZXRzIHNvdXJjZV9wcm9ncmFtPVwiYWR1bHQtcHJldmVudGl2ZVwiKS4gU3VyZmFjZWQgdmlhIE9ic2VydmF0aW9uLlxuICAvLyBtZXRhLnRhZyBzbyBkb3duc3RyZWFtIFNNQVJUIGFwcHMgY2FuIGZpbHRlciBieSBfdGFnIHdpdGhvdXQgbmVlZGluZ1xuICAvLyB0byBrbm93IGFib3V0IG91ciBpbnRlcm5hbCBmaWVsZCBuYW1lcy5cbiAgaWYgKHJhdy5zb3VyY2VfcHJvZ3JhbSkge1xuICAgIHJlc291cmNlLm1ldGEudGFnID0gW1xuICAgICAge1xuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL25oaS1maGlyLWJyaWRnZS9zb3VyY2UtcHJvZ3JhbVwiLFxuICAgICAgICBjb2RlOiBTdHJpbmcocmF3LnNvdXJjZV9wcm9ncmFtKSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvKipcbiAqIFByb2NlZHVyZSBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL3Byb2NlZHVyZS5weWAuIFJldHVybnMgbnVsbCBmb3IgbGlzdC1wYWdlXG4gKiByb3dzIGxhY2tpbmcgbm90ZS9ib2R5X3NpdGUgXHUyMDE0IHRoZSBhbHRlcm5hdGl2ZSBpcyB0aGUgU01BUlQgYXBwIHNob3dpbmdcbiAqIDI1IFwicHJvY2VkdXJlc1wiIGNhbGxlZCBcIk15Y29iYWN0ZXJpYSBjdWx0dXJlXCIgLyBcIlZhZ2luYWwgdWx0cmFzb3VuZFwiXG4gKiAvIGV0Yy4gd2hpY2ggYXJlIGNsaW5pY2FsbHkgd3JvbmcuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZFwiKSkgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX1BDUztcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUHJvY2VkdXJlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBub3RlID0gKChyYXcubm90ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgY29uc3QgYm9keVNpdGUgPSAoKHJhdy5ib2R5X3NpdGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghbm90ZSAmJiAhYm9keVNpdGUpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUHJvY2VkdXJlXCI7XG4gIC8vIHYwLjguMCBiaWxpbmd1YWw6IHByZWZlciBcdTdFNDFcdTRFMkQgaW4gY29kZS50ZXh0IChwYXRpZW50LWZhY2luZykgd2hpbGVcbiAgLy8gY29kaW5nWzBdLmRpc3BsYXkgc3RheXMgYXMgdGhlIHRlY2huaWNhbCBFbmdsaXNoIChjYW5vbmljYWwgZm9yIHRoZVxuICAvLyBQQ1MgLyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHN5c3RlbSkuIEZhbGxzIGJhY2sgdG8gRW5nbGlzaCB3aGVuIE5ISSBzaGlwc1xuICAvLyBFbmdsaXNoLW9ubHkgZm9yIGEgcGFydGljdWxhciBwcm9jZWR1cmUgY29kZS5cbiAgY29uc3QgZGlzcGxheVpoID0gKChyYXcuZGlzcGxheV96aCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKSB8fCBkaXNwbGF5O1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJQcm9jZWR1cmVcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJjb21wbGV0ZWRcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5WmgsXG4gICAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZWREYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKGJvZHlTaXRlKSB7XG4gICAgcmVzb3VyY2UuYm9keVNpdGUgPSBbeyB0ZXh0OiBib2R5U2l0ZSB9XTtcbiAgfVxuICBpZiAobm90ZSkge1xuICAgIHJlc291cmNlLm5vdGUgPSBbeyB0ZXh0OiBub3RlIH1dO1xuICB9XG5cbiAgLy8gcGVyZm9ybWVyLmFjdG9yIFx1MjAxNCBkaXNwbGF5LW9ubHkgUmVmZXJlbmNlIChubyBQcmFjdGl0aW9uZXIgLyBPcmdhbml6YXRpb25cbiAgLy8gcmVzb3VyY2UgbWludGVkKS4gTWlycm9ycyB0aGUgc2FtZSBzaGFwZSBhcyBEaWFnbm9zdGljUmVwb3J0LnBlcmZvcm1lclxuICAvLyBhbmQgTWVkaWNhdGlvblJlcXVlc3QucmVxdWVzdGVyLiBJbXBvcnRhbnQgZm9yIGxpbmsudHM6IHRoZSBlbmNvdW50ZXJcbiAgLy8gbGlua2VyIG1hdGNoZXMgcmVzb3VyY2VzIHRvIEVuY291bnRlcnMgYnkgcGVyZm9ybWVyW10uZGlzcGxheSAoaG9zcGl0YWwpXG4gIC8vICsgZGF0ZSBcdTIwMTQgd2l0aG91dCB0aGlzIGZpZWxkIGEgcHJvY2VkdXJlIGRvbmUgYXQgdGhlIHNhbWUgaG9zcGl0YWwgK1xuICAvLyBkYXkgYXMgYW4gRW5jb3VudGVyIGRvZXNuJ3QgZ2V0IGl0cyBgZW5jb3VudGVyYCByZWZlcmVuY2UgYmFjay1maWxsZWQsXG4gIC8vIHNvIFNNQVJUIGFwcHMgc2hvd2luZyBcInByb2NlZHVyZXMgZ3JvdXBlZCBieSB2aXNpdFwiIHdvdWxkIGxlYXZlIGl0XG4gIC8vIHVuLWdyb3VwZWQuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGFjdG9yOiB7IGRpc3BsYXk6IGhvc3BpdGFsIH0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIG1hcHBlciBkaXNwYXRjaCB0YWJsZXMuXG4gKlxuICogQ29uc3VtZWQgYnkgYmFja2VuZCdzIGAvc3luYy91cGxvYWQtc3RydWN0dXJlZGAgYW5kIHRoZSBleHRlbnNpb24nc1xuICogbG9jYWwtbW9kZSBidW5kbGUgYXNzZW1ibGVyIHNvIGJvdGggcHJvZHVjZSBpZGVudGljYWwgRkhJUiBvdXRwdXQuXG4gKi9cblxuaW1wb3J0IHsgbWFwQWxsZXJneUludG9sZXJhbmNlIH0gZnJvbSBcIi4vYWxsZXJneVwiO1xuaW1wb3J0IHsgbWFwQ29uZGl0aW9uIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBtYXBEaWFnbm9zdGljUmVwb3J0IH0gZnJvbSBcIi4vZGlhZ25vc3RpYy1yZXBvcnRcIjtcbmltcG9ydCB7IG1hcEVuY291bnRlciB9IGZyb20gXCIuL2VuY291bnRlclwiO1xuaW1wb3J0IHsgbWFwTWVkaWNhdGlvblJlcXVlc3QsIG1hcE1lZGljYXRpb25zRGVkdXAgfSBmcm9tIFwiLi9tZWRpY2F0aW9uXCI7XG5pbXBvcnQgeyBtYXBPYnNlcnZhdGlvbiwgbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCB9IGZyb20gXCIuL29ic2VydmF0aW9uXCI7XG5pbXBvcnQgeyBtYXBQcm9jZWR1cmUgfSBmcm9tIFwiLi9wcm9jZWR1cmVcIjtcblxuZXhwb3J0IHR5cGUgUGVyUm93TWFwcGVyID0gKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKSA9PiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbDtcblxuZXhwb3J0IHR5cGUgR3JvdXBNYXBwZXIgPSAoaXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZykgPT4gUmVjb3JkPHN0cmluZywgYW55PltdO1xuXG4vKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgKHBlci1yb3cgbWFwcGVyLCBKU09OIGxpc3Qga2V5IGluc2lkZSBMTE0gcmVzcG9uc2UpLlxuICogVXNlZCBieSB0aGUgTExNIGZhbGxiYWNrIHBhdGggYWZ0ZXIgZXh0cmFjdGlvbjsgdGhlIHN0cnVjdHVyZWQgcGF0aFxuICogYWxzbyBjb25zdWx0cyBpdCBmb3IgcGVyLXJvdyByZXNvdXJjZSB0eXBlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IExJU1RfSEFORExFUlM6IFJlY29yZDxzdHJpbmcsIFtQZXJSb3dNYXBwZXIsIHN0cmluZ10+ID0ge1xuICBvYnNlcnZhdGlvbnM6IFttYXBPYnNlcnZhdGlvbiwgXCJvYnNlcnZhdGlvbnNcIl0sXG4gIG1lZGljYXRpb25zOiBbbWFwTWVkaWNhdGlvblJlcXVlc3QsIFwibWVkaWNhdGlvbnNcIl0sXG4gIGNvbmRpdGlvbnM6IFttYXBDb25kaXRpb24sIFwiY29uZGl0aW9uc1wiXSxcbiAgYWxsZXJnaWVzOiBbbWFwQWxsZXJneUludG9sZXJhbmNlLCBcImFsbGVyZ2llc1wiXSxcbiAgZGlhZ25vc3RpY19yZXBvcnRzOiBbbWFwRGlhZ25vc3RpY1JlcG9ydCwgXCJkaWFnbm9zdGljX3JlcG9ydHNcIl0sXG4gIHByb2NlZHVyZXM6IFttYXBQcm9jZWR1cmUsIFwicHJvY2VkdXJlc1wiXSxcbiAgZW5jb3VudGVyczogW21hcEVuY291bnRlciwgXCJlbmNvdW50ZXJzXCJdLFxufTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIGdyb3VwLWF3YXJlIG1hcHBlciB0aGF0IHRha2VzIHRoZSBGVUxMIGxpc3QgYXQgb25jZS5cbiAqIFVzZWQgd2hlbiBjcm9zcy1yb3cgZ3JvdXBpbmcvZGVkdXAgaXMgcmVxdWlyZWQgKE5ISSBsYWIgcGFuZWxzLFxuICogXHU0RTJEXHU4MkYxIG1lZGljYXRpb24gXHU5NkQ5XHU4QTlFIGRlZHVwKS5cbiAqL1xuZXhwb3J0IGNvbnN0IEdST1VQX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBHcm91cE1hcHBlcj4gPSB7XG4gIG9ic2VydmF0aW9uczogbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCxcbiAgbWVkaWNhdGlvbnM6IG1hcE1lZGljYXRpb25zRGVkdXAsXG59O1xuIiwgIi8qKlxuICogRW5jb3VudGVyIGxpbmtlciBcdTIwMTQgbWF0Y2ggcmVzb3VyY2VzIHRvIEVuY291bnRlcnMgYnkgKGhvc3BpdGFsLCBkYXRlKS5cbiAqXG4gKiBQdXJlIGZ1bmN0aW9uOiBtdXRhdGVzIGByZXNvdXJjZXNgIGluIHBsYWNlIHRvIGFkZCBgZW5jb3VudGVyYFxuICogcmVmZXJlbmNlcyB3aGVuIHRoZXJlJ3MgYW4gdW5hbWJpZ3VvdXMgbWF0Y2ggaW4gdGhlIGNhbmRpZGF0ZVxuICogRW5jb3VudGVyIGxpc3QuIFNhbWUgbG9naWMgYXMgdGhlIGJhY2tlbmQncyBEQi1jb3VwbGVkIHZlcnNpb24sXG4gKiBsaWZ0ZWQgb3V0IHNvIHRoZSBleHRlbnNpb24ncyBsb2NhbCBtb2RlIGNhbiBjYWxsIGl0IG9uIGFuXG4gKiBpbi1tZW1vcnkgYXJyYXkuXG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlSW50ZXJwcmV0YXRpb24gfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuXG5jb25zdCBFTkNPVU5URVJfTElOS0FCTEUgPSBuZXcgU2V0KFtcbiAgXCJPYnNlcnZhdGlvblwiLFxuICBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gIFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICBcIlByb2NlZHVyZVwiLFxuICBcIkNvbmRpdGlvblwiLFxuICBcIkFsbGVyZ3lJbnRvbGVyYW5jZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIHJlc291cmNlRGF0ZShyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgW1xuICAgIFwiZWZmZWN0aXZlRGF0ZVRpbWVcIixcbiAgICBcImF1dGhvcmVkT25cIixcbiAgICBcInBlcmZvcm1lZERhdGVUaW1lXCIsXG4gICAgXCJvbnNldERhdGVUaW1lXCIsXG4gICAgXCJyZWNvcmRlZERhdGVcIixcbiAgICBcImlzc3VlZFwiLFxuICBdKSB7XG4gICAgY29uc3QgdiA9IHJba2V5XTtcbiAgICBpZiAodikgcmV0dXJuIFN0cmluZyh2KS5zbGljZSgwLCAxMCk7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgb2YgW1wiZWZmZWN0aXZlUGVyaW9kXCIsIFwicGVyZm9ybWVkUGVyaW9kXCJdKSB7XG4gICAgY29uc3QgcGVyaW9kID0gcltrZXldO1xuICAgIGlmIChwZXJpb2QgJiYgdHlwZW9mIHBlcmlvZCA9PT0gXCJvYmplY3RcIiAmJiBwZXJpb2Quc3RhcnQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcocGVyaW9kLnN0YXJ0KS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5mdW5jdGlvbiByZXNvdXJjZUhvc3BpdGFsKHI6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICAvLyBwZXJmb3JtZXIgc2hhcGUgZGlmZmVycyBieSByZXNvdXJjZSB0eXBlOlxuICAvLyAgIE9ic2VydmF0aW9uIC8gRGlhZ25vc3RpY1JlcG9ydDogUmVmZXJlbmNlW10gICAgICAgICAgICAgIFx1MjE5MiBwLmRpc3BsYXlcbiAgLy8gICBQcm9jZWR1cmU6ICAgICAgICAgICAgICAgICAgICAgIEJhY2tib25lRWxlbWVudFtdICAgICAgICBcdTIxOTIgcC5hY3Rvci5kaXNwbGF5XG4gIC8vIEZISVIgUjQgXHUwMEE3UHJvY2VkdXJlLnBlcmZvcm1lciBpcyB0aGUgb25seSBwbGFjZSB3ZSBoaXQgYSBCYWNrYm9uZUVsZW1lbnQuXG4gIGZvciAoY29uc3QgcCBvZiByLnBlcmZvcm1lciA/PyBbXSkge1xuICAgIGlmICghcCB8fCB0eXBlb2YgcCAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgaWYgKHR5cGVvZiBwLmRpc3BsYXkgPT09IFwic3RyaW5nXCIgJiYgcC5kaXNwbGF5KSByZXR1cm4gcC5kaXNwbGF5O1xuICAgIGNvbnN0IGFjdG9yID0gcC5hY3RvcjtcbiAgICBpZiAoYWN0b3IgJiYgdHlwZW9mIGFjdG9yID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBhY3Rvci5kaXNwbGF5ID09PSBcInN0cmluZ1wiICYmIGFjdG9yLmRpc3BsYXkpIHtcbiAgICAgIHJldHVybiBhY3Rvci5kaXNwbGF5O1xuICAgIH1cbiAgfVxuICBjb25zdCByZXEgPSByLnJlcXVlc3RlciA/PyB7fTtcbiAgaWYgKHJlcSAmJiB0eXBlb2YgcmVxID09PSBcIm9iamVjdFwiICYmIHJlcS5kaXNwbGF5KSByZXR1cm4gcmVxLmRpc3BsYXk7XG4gIHJldHVybiBcIlwiO1xufVxuXG4vKipcbiAqIERyb3AgQU1CIEVuY291bnRlcnMgd2hvc2UgKGhvc3BpdGFsLCBzdGFydF9kYXRlKSBpcyBhbHJlYWR5IGNvdmVyZWRcbiAqIGJ5IGFuIElNUCBFbmNvdW50ZXIncyBhZG1pc3Npb24gZGF5LiBOSEkgZW1pdHMgdGhlIHNhbWUgaW5wYXRpZW50XG4gKiBzdGF5IHR3aWNlIChJSEtFMzMwMyBBTUIgYmlsbGluZyBlbnRyeSArIElIS0UzMzA5IElNUCBkZXRhaWwpOyB0aGVcbiAqIElNUCBvbmUgaXMgY2Fub25pY2FsLCB0aGUgQU1CIGlzIGEgYmlsbGluZyBhcnRlZmFjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwQWRtaXNzaW9uRGF5QW1iKFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGltcFN0YXJ0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIkVuY291bnRlclwiKSBjb250aW51ZTtcbiAgICBpZiAoKHIuY2xhc3MgPz8ge30pLmNvZGUgIT09IFwiSU1QXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoaG9zcCAmJiBzdGFydCkgaW1wU3RhcnRzLmFkZChgJHtob3NwfSAke3N0YXJ0fWApO1xuICB9XG4gIGlmIChpbXBTdGFydHMuc2l6ZSA9PT0gMCkgcmV0dXJuIHJlc291cmNlcztcbiAgcmV0dXJuIHJlc291cmNlcy5maWx0ZXIoKHIpID0+IHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgPT09IFwiRW5jb3VudGVyXCIgJiYgKHIuY2xhc3MgPz8ge30pLmNvZGUgPT09IFwiQU1CXCIpIHtcbiAgICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChyLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGltcFN0YXJ0cy5oYXMoYCR7aG9zcH0gJHtzdGFydH1gKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIGBlbmNvdW50ZXJgIHJlZmVyZW5jZSB0byBlYWNoIGxpbmthYmxlIHJlc291cmNlIHdoZW4gaXRzXG4gKiAoaG9zcGl0YWwsIGRhdGUpIG1hdGNoZXMgZXhhY3RseSBPTkUgRW5jb3VudGVyIGluIGBjYW5kaWRhdGVzYC5cbiAqIENvbnNlcnZhdGl2ZSBcdTIwMTQgbGVhdmVzIGFtYmlndW91cyAoMCBvciA+MSBtYXRjaCkgY2FzZXMgdW5saW5rZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzKFxuICBjYW5kaWRhdGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogdm9pZCB7XG4gIGlmIChjYW5kaWRhdGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICBjb25zdCBleGFjdEluZGV4ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBjb25zdCBpbXBCeUhvc3AgPSBuZXcgTWFwPHN0cmluZywgQXJyYXk8W3N0cmluZywgc3RyaW5nLCBzdHJpbmddPj4oKTtcblxuICBmb3IgKGNvbnN0IGUgb2YgY2FuZGlkYXRlcykge1xuICAgIGlmIChlLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IChlLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChlLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgIGlmICghaG9zcCB8fCAhc3RhcnQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGtleSA9IGAke2hvc3B9ICR7c3RhcnR9YDtcbiAgICBjb25zdCBhcnIgPSBleGFjdEluZGV4LmdldChrZXkpID8/IFtdO1xuICAgIGFyci5wdXNoKGUuaWQpO1xuICAgIGV4YWN0SW5kZXguc2V0KGtleSwgYXJyKTtcbiAgICBjb25zdCBjbHMgPSAoZS5jbGFzcyA/PyB7fSkuY29kZSA/PyBcIlwiO1xuICAgIGlmIChjbHMgPT09IFwiSU1QXCIpIHtcbiAgICAgIGNvbnN0IGVuZCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLmVuZCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgICBpZiAoZW5kKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdO1xuICAgICAgICBsaXN0LnB1c2goW3N0YXJ0LCBlbmQsIGUuaWRdKTtcbiAgICAgICAgaW1wQnlIb3NwLnNldChob3NwLCBsaXN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZXhhY3RJbmRleC5zaXplID09PSAwICYmIGltcEJ5SG9zcC5zaXplID09PSAwKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmICghRU5DT1VOVEVSX0xJTktBQkxFLmhhcyhyLnJlc291cmNlVHlwZSkpIGNvbnRpbnVlO1xuICAgIGlmIChyLmVuY291bnRlciB8fCByLmNvbnRleHQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSByZXNvdXJjZUhvc3BpdGFsKHIpO1xuICAgIGNvbnN0IGRhdGUgPSByZXNvdXJjZURhdGUocik7XG4gICAgaWYgKCFob3NwIHx8ICFkYXRlKSBjb250aW51ZTtcbiAgICBjb25zdCBtYXRjaGVzOiBzdHJpbmdbXSA9IFsuLi4oZXhhY3RJbmRleC5nZXQoYCR7aG9zcH0gJHtkYXRlfWApID8/IFtdKV07XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGNvbnN0IFtzdGFydCwgZW5kLCBlaWRdIG9mIGltcEJ5SG9zcC5nZXQoaG9zcCkgPz8gW10pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDw9IGRhdGUgJiYgZGF0ZSA8PSBlbmQpIG1hdGNoZXMucHVzaChlaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggIT09IDEpIGNvbnRpbnVlO1xuICAgIHIuZW5jb3VudGVyID0geyByZWZlcmVuY2U6IGBFbmNvdW50ZXIvJHttYXRjaGVzWzBdfWAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFdoZW4gYW4gT2JzZXJ2YXRpb24gY2FycmllcyBtdWx0aXBsZSByZWZlcmVuY2VSYW5nZSBlbnRyaWVzIHRhZ2dlZFxuICogd2l0aCBgYXBwbGllc1RvWypdLmNvZGluZy5jb2RlYCBpbiB7bWFsZSwgZmVtYWxlfSwgcGljayB0aGUgb25lIHRoYXRcbiAqIG1hdGNoZXMgdGhlIHBhdGllbnQncyBnZW5kZXIgYW5kIHJlLWRlcml2ZSBpbnRlcnByZXRhdGlvbiBhZ2FpbnN0IGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMoXG4gIHBhdGllbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoIXBhdGllbnQpIHJldHVybjtcbiAgY29uc3QgZ2VuZGVyID0gU3RyaW5nKHBhdGllbnQuZ2VuZGVyID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChnZW5kZXIgIT09IFwibWFsZVwiICYmIGdlbmRlciAhPT0gXCJmZW1hbGVcIikgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgIT09IFwiT2JzZXJ2YXRpb25cIikgY29udGludWU7XG4gICAgY29uc3QgcnJzOiBhbnlbXSA9IHIucmVmZXJlbmNlUmFuZ2UgPz8gW107XG4gICAgaWYgKHJycy5sZW5ndGggPCAyKSBjb250aW51ZTtcblxuICAgIGxldCBtYXRjaDogYW55ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJycykge1xuICAgICAgZm9yIChjb25zdCBhcCBvZiBlbnRyeS5hcHBsaWVzVG8gPz8gW10pIHtcbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGFwLmNvZGluZyA/PyBbXSkge1xuICAgICAgICAgIGlmIChTdHJpbmcoYy5jb2RlID8/IFwiXCIpLnRvTG93ZXJDYXNlKCkgPT09IGdlbmRlcikge1xuICAgICAgICAgICAgbWF0Y2ggPSBlbnRyeTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2gpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICB9XG4gICAgaWYgKCFtYXRjaCkgY29udGludWU7XG5cbiAgICByLnJlZmVyZW5jZVJhbmdlID0gW21hdGNoXTtcbiAgICBjb25zdCB2YWxTdHIgPVxuICAgICAgU3RyaW5nKChyLnZhbHVlUXVhbnRpdHkgPz8ge30pLnZhbHVlID8/IFwiXCIpIHx8IFN0cmluZyhyLnZhbHVlU3RyaW5nID8/IFwiXCIpO1xuICAgIGNvbnN0IG5ld0ludGVycCA9IGRlcml2ZUludGVycHJldGF0aW9uKHZhbFN0ciwgci52YWx1ZVF1YW50aXR5ID8/IG51bGwsIG1hdGNoKTtcbiAgICBpZiAobmV3SW50ZXJwKSB7XG4gICAgICByLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbbmV3SW50ZXJwXSB9XTtcbiAgICB9XG4gIH1cbn1cbiIsICIvKipcbiAqIFBhdGllbnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9wYXRpZW50LnB5YC4gU2FtZSBwdWJsaWMgQVBJOlxuICogICAtIGxvb2tzTGlrZVR3TmF0aW9uYWxJZCh2YWx1ZSkgXHUyMDE0IGV4cG9zZWQgZm9yIHRlc3RzXG4gKiAgIC0gbWFwUGF0aWVudChyYXcpIFx1MjAxNCBtYWluIGVudHJ5XG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlUGF0aWVudElkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5cbi8vIFRhaXdhbiBuYXRpb25hbCBJRDogMSBsZXR0ZXIgKyA5IGRpZ2l0cyAoQTEyMzQ1Njc4OSkuIFVzZWQgdG8gZGVjaWRlXG4vLyB3aGV0aGVyIHRoZSBwb3B1cC1zdXBwbGllZCBwYXRpZW50X2lkIHNob3VsZCBiZSBjb2RlZCB1bmRlciB0aGVcbi8vIGNhbm9uaWNhbCBuYXRpb25hbC1pZCBzeXN0ZW0gb3IgYXMgYSBsb2NhbCBob3NwaXRhbCBNUk4uXG5jb25zdCBUV19OQVRJT05BTF9JRF9SRSA9IC9eW0EtWl1bMTJdXFxkezh9JC87XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gVFdfTkFUSU9OQUxfSURfUkUudGVzdCh2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQYXRpZW50KHJhdzogUmVjb3JkPHN0cmluZywgYW55Pik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCByYXdJZCA9IFN0cmluZyhyYXcuaWRlbnRpZmllciA/PyByYXcuaWQgPz8gXCJ1bmtub3duXCIpO1xuICAvLyBGSElSIFBhdGllbnQuaWQgaXMgdGhlIGhhc2hlZC9zYWx0ZWQgZm9ybS4gUmVhbCBuYXRpb25hbCBJRCBzdGF5c1xuICAvLyBvbmx5IGluIGlkZW50aWZpZXJbXS52YWx1ZSBzbyBhIGxlYWtlZCBCdW5kbGUgKG9yIGEgU01BUlQgYXBwIHRva2VuXG4gIC8vIHBheWxvYWQgY29udGFpbmluZyBwYXRpZW50X2lkKSBkb2Vzbid0IGRpc2Nsb3NlIGl0IHZpYSBldmVyeVxuICAvLyBzdWJqZWN0LnJlZmVyZW5jZS5cbiAgY29uc3QgcGF0aWVudElkID0gZGVyaXZlUGF0aWVudElkKHJhd0lkKTtcblxuICAvLyBVc2UgYD8/YCAobm90IGp1c3QgZGVmYXVsdCBhcmcpIHNvIGV4cGxpY2l0IG51bGwgZnJvbSB0aGUgTExNIGFsc29cbiAgLy8gZmFsbHMgYmFjay4gTG9jYWwgbW9kZWxzIHNvbWV0aW1lcyBlbWl0IG51bGwgaW5zdGVhZCBvZiBvbWl0dGluZy5cbiAgLy8gVGhlIGNhbGxlciBkZWNpZGVzIHdoZXRoZXIgYHJhdy5uYW1lYCBpcyB0aGUgdXNlcidzIHJlYWwgbmFtZSBvclxuICAvLyBhbHJlYWR5LW1hc2tlZCBcdTIwMTQgbWFwUGF0aWVudCBqdXN0IHRyYW5zY3JpYmVzLiBNYXNraW5nIHBvbGljeSBsaXZlc1xuICAvLyBhdCB0aGUgVUkgLyBleHRlbnNpb24gbGF5ZXIgKGRyaXZlbiBieSB0aGUgdXNlci10b2dnbGVhYmxlXG4gIC8vIGBtYXNrTmFtZUVuYWJsZWRgIHNldHRpbmcpIHNvIHRoZSBzYW1lIG1hcHBlciBpcyBjb3JyZWN0IGZvciBib3RoXG4gIC8vIFwiXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4ID0gcmVhbCBuYW1lXCIgYW5kIFwiXHU5MUFCXHU3NjQyXHU0RUJBXHU1NEUxXHU1OTFBXHU3NUM1XHU0RUJBID0gbWFza2VkXCIgd29ya2Zsb3dzLlxuICBjb25zdCBuYW1lVGV4dCA9IChyYXcubmFtZSA/PyBudWxsKSB8fCBcIlVua25vd25cIjtcbiAgY29uc3QgcGhvbmUgPSAocmF3LnBob25lID8/IG51bGwpIHx8IFwiXCI7XG4gIGNvbnN0IGFkZHJlc3MgPSAocmF3LmFkZHJlc3MgPz8gbnVsbCkgfHwgXCJcIjtcblxuICBjb25zdCBbZmFtaWx5LCBnaXZlbl0gPSBzcGxpdE5hbWUobmFtZVRleHQpO1xuICBjb25zdCBuYW1lRW50cnk6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IHVzZTogXCJvZmZpY2lhbFwiLCB0ZXh0OiBuYW1lVGV4dCB9O1xuICBpZiAoZmFtaWx5KSBuYW1lRW50cnkuZmFtaWx5ID0gZmFtaWx5O1xuICBpZiAoZ2l2ZW4ubGVuZ3RoID4gMCkgbmFtZUVudHJ5LmdpdmVuID0gZ2l2ZW47XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIlBhdGllbnRcIixcbiAgICBpZDogcGF0aWVudElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICB7XG4gICAgICAgIHVzZTogXCJvZmZpY2lhbFwiLFxuICAgICAgICBzeXN0ZW06IGxvb2tzTGlrZVR3TmF0aW9uYWxJZChyYXdJZClcbiAgICAgICAgICA/IHN5c3RlbXMuVFdfTkFUSU9OQUxfSURcbiAgICAgICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1BBVElFTlRfTVJOLFxuICAgICAgICB2YWx1ZTogcmF3SWQsXG4gICAgICB9LFxuICAgIF0sXG4gICAgbmFtZTogW25hbWVFbnRyeV0sXG4gICAgZ2VuZGVyOiBtYXBHZW5kZXIocmF3LmdlbmRlciksXG4gIH07XG5cbiAgY29uc3QgYmlydGhEYXRlID0gcmF3LmJpcnRoRGF0ZTtcbiAgaWYgKGJpcnRoRGF0ZSkgcmVzb3VyY2UuYmlydGhEYXRlID0gYmlydGhEYXRlO1xuXG4gIGlmIChwaG9uZSkge1xuICAgIHJlc291cmNlLnRlbGVjb20gPSBbeyBzeXN0ZW06IFwicGhvbmVcIiwgdXNlOiBcImhvbWVcIiwgdmFsdWU6IHBob25lIH1dO1xuICB9XG5cbiAgaWYgKGFkZHJlc3MpIHtcbiAgICByZXNvdXJjZS5hZGRyZXNzID0gW3sgdXNlOiBcImhvbWVcIiwgdGV4dDogYWRkcmVzcyB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLyoqXG4gKiBTcGxpdCBhIGZ1bGwgbmFtZSBpbnRvIFtmYW1pbHksIFtnaXZlbl1dIGZvciBGSElSIFBhdGllbnQubmFtZS5cbiAqXG4gKiBIZXVyaXN0aWNzOlxuICogICAtIENvbnRhaW5zIHdoaXRlc3BhY2UgXHUyMTkyIFdlc3Rlcm46IGxhc3QgdG9rZW4gPSBmYW1pbHksIHJlc3QgPSBnaXZlbi5cbiAqICAgLSBDSksgLyBzaW5nbGUtdG9rZW4gXHUyMTkyIGZpcnN0IGNoYXIgPSBmYW1pbHksIHJlbWFpbmRlciA9IGdpdmVuLlxuICogICAtIFwiVW5rbm93blwiIG9yIGVtcHR5IFx1MjE5MiBbXCJcIiwgW11dXG4gKlxuICogVHdvLWNoYXIgQ0pLIGZhbWlseSBuYW1lcyAoXHU2QjUwXHU5NjdELCBcdTUzRjhcdTk5QUMsIFx1MjAyNikgYXJlIE5PVCBhdXRvLWRldGVjdGVkLlxuICovXG5mdW5jdGlvbiBzcGxpdE5hbWUoZnVsbE5hbWU6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ1tdXSB7XG4gIGNvbnN0IG5hbWUgPSAoZnVsbE5hbWUgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIW5hbWUgfHwgbmFtZSA9PT0gXCJVbmtub3duXCIpIHJldHVybiBbXCJcIiwgW11dO1xuICBpZiAoL1xccy8udGVzdChuYW1lKSkge1xuICAgIGNvbnN0IHBhcnRzID0gbmFtZS5zcGxpdCgvXFxzKy8pO1xuICAgIHJldHVybiBbcGFydHNbcGFydHMubGVuZ3RoIC0gMV0hLCBwYXJ0cy5zbGljZSgwLCAtMSldO1xuICB9XG4gIC8vIENKSyBmYWxsYmFjayBcdTIwMTQgaXRlcmF0ZSBjb2RlcG9pbnRzLCBub3QgVVRGLTE2IGNvZGUgdW5pdHMsIHNvXG4gIC8vIHN1cnJvZ2F0ZS1wYWlyIGNoYXJhY3RlcnMgKHJhcmUgaW4gQ2hpbmVzZSBuYW1lcyBidXQgcG9zc2libGUpXG4gIC8vIGRvbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjb2RlcG9pbnRzID0gQXJyYXkuZnJvbShuYW1lKTtcbiAgcmV0dXJuIGNvZGVwb2ludHMubGVuZ3RoID4gMSA/IFtjb2RlcG9pbnRzWzBdISwgW2NvZGVwb2ludHMuc2xpY2UoMSkuam9pbihcIlwiKV1dIDogW25hbWUsIFtdXTtcbn1cblxuZnVuY3Rpb24gbWFwR2VuZGVyKGdlbmRlcjogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IGcgPSB0eXBlb2YgZ2VuZGVyID09PSBcInN0cmluZ1wiID8gZ2VuZGVyLnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAoW1wibWFsZVwiLCBcIm1cIiwgXCJcdTc1MzdcIiwgXCJcdTc1MzdcdTYwMjdcIl0uaW5jbHVkZXMoZykpIHJldHVybiBcIm1hbGVcIjtcbiAgaWYgKFtcImZlbWFsZVwiLCBcImZcIiwgXCJcdTU5NzNcIiwgXCJcdTU5NzNcdTYwMjdcIl0uaW5jbHVkZXMoZykpIHJldHVybiBcImZlbWFsZVwiO1xuICByZXR1cm4gXCJ1bmtub3duXCI7XG59XG4iLCAiLy8gTkhJIEpTT04gXHUyMTkyIG5vcm1hbGl6ZWQgc2hhcGUgYWRhcHRlcnMuXG4vL1xuLy8gRXh0cmFjdGVkIGZyb20gYmFja2dyb3VuZC5qcyBzbyBlYWNoIGFkYXB0ZXIgY2FuIGJlIHVuaXQtdGVzdGVkIGluXG4vLyBpc29sYXRpb24uIGJhY2tncm91bmQuanMgaW1wb3J0cyBldmVyeXRoaW5nIGJlbG93OyB0aGUgbGl2ZSBTVyBnbHVlc1xuLy8gdGhlc2Ugb250byBmZXRjaGVkIHBheWxvYWRzIHZpYSB0aGUgZW5kcG9pbnQgcmVnaXN0cnkuXG4vL1xuLy8gV2h5IGV4dHJhY3Q6IHRoZSB2MC42LjEgbGFiK2ltYWdpbmcgZGF0ZS1maWVsZCBidWdzIChjb21taXRzIGIzNzg4NWYgL1xuLy8gOGMxOTkwMSkgc2hpcHBlZCBiZWNhdXNlIHRoZXNlIGZ1bmN0aW9ucyBoYWQgWkVSTyB0ZXN0IGNvdmVyYWdlIFx1MjAxNFxuLy8gYmFja2dyb3VuZC5qcyBjYW4ndCBiZSBsb2FkZWQgaW4gYSB0ZXN0IGVudmlyb25tZW50IChjaHJvbWUuKiBBUElzLFxuLy8gU1cgZ2xvYmFscyksIHNvIHRoZSBhZGFwdCogbG9naWMgcm9kZSBhbG9uZyB1bnRlc3RlZC4gUHVsbGluZyB0aGVtXG4vLyBpbnRvIGEgcHVyZS1mdW5jdGlvbiBtb2R1bGUgbGV0cyB2aXRlc3QgdmVyaWZ5IGZpZWxkLXByaW9yaXR5XG4vLyBkZWNpc2lvbnMgcm93LWJ5LXJvdy5cblxuLy8gQ29udmVydCBOSEkncyBcdTZDMTFcdTU3MEIgZGF0ZSBcIjExNS8wNS8wNVwiIFx1MjE5MiBJU08gXCIyMDI2LTA1LTA1XCIuXG4vLyBTb21lIE5ISSBmaWVsZHMgZW1iZWQgYm90aCBST0MgYW5kIEdyZWdvcmlhbjogXCIxMTUvMDUvMDV8fDIwMjYvMDUvMDVcIiBcdTIwMTQgd2Vcbi8vIGp1c3QgbWF0Y2ggdGhlIGZpcnN0IHNlZ21lbnQuXG5leHBvcnQgZnVuY3Rpb24gcm9jVG9JU08ocm9jRGF0ZSkge1xuICBpZiAoIXJvY0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKHJvY0RhdGUpLm1hdGNoKC9eKFxcZHsyLDN9KVsvLi1dKFxcZHsxLDJ9KVsvLi1dKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApICsgMTkxMTtcbiAgcmV0dXJuIGAke3l9LSR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LSR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gSW52ZXJzZTogSVNPIFwiMjAyMy0wNS0wNVwiIFx1MjE5MiBST0MgXCIxMTIvMDUvMDVcIi4gVXNlZCB0byBidWlsZCBOSEkgZGF0ZS1yYW5nZVxuLy8gcXVlcnkgc3RyaW5ncyAodGhlaXIgZm9ybXMgZXhwZWN0IFx1NkMxMVx1NTcwQiBmb3JtYXQpLlxuZXhwb3J0IGZ1bmN0aW9uIGlzb1RvUk9DKGlzb0RhdGUpIHtcbiAgaWYgKCFpc29EYXRlKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgbSA9IFN0cmluZyhpc29EYXRlKS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApIC0gMTkxMTtcbiAgaWYgKHkgPCAxKSByZXR1cm4gXCJcIjsgLy8gcHJlLVx1NkMxMVx1NTcwQiBkYXRlcyBtYWtlIG5vIHNlbnNlIHRvIE5ISVxuICByZXR1cm4gYCR7eX0vJHttWzJdLnBhZFN0YXJ0KDIsIFwiMFwiKX0vJHttWzNdLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xufVxuXG4vLyBOSEkgYmlsaW5ndWFsIGZpZWxkcyB1c2UgXCJcdTRFMkRcdTY1ODd8fEVuZ2xpc2hcIiBcdTIwMTQgY2xpbmljaWFucyBzY2FuIEVuZ2xpc2ggZmFzdGVyLFxuLy8gc28gcHJlZmVyIHRoYXQgc2lkZS4gSWYgdGhlcmUncyBubyBgfHxgIHdlIGp1c3QgcmV0dXJuIHRoZSBpbnB1dCB0cmltbWVkLlxuZXhwb3J0IGZ1bmN0aW9uIHBpY2tFbmdsaXNoKHMpIHtcbiAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc3RyID0gU3RyaW5nKHMpO1xuICBjb25zdCBpZHggPSBzdHIuaW5kZXhPZihcInx8XCIpO1xuICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuIHN0ci50cmltKCk7XG4gIGNvbnN0IGVuID0gc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKTtcbiAgcmV0dXJuIGVuIHx8IHN0ci5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbn1cblxuLy8gTWlycm9yIG9mIHBpY2tFbmdsaXNoIFx1MjAxNCBleHRyYWN0IHRoZSBcdTRFMkRcdTY1ODcgaGFsZiBvZiBhIGJpbGluZ3VhbFxuLy8gXCJcdTRFMkRcdTY1ODd8fEVuZ2xpc2hcIiBOSEkgZmllbGQuIFJldHVybnMgXCJcIiB3aGVuIGlucHV0IGlzIGVtcHR5LiBGYWxscyBiYWNrXG4vLyB0byB0aGUgd2hvbGUgc3RyaW5nIHdoZW4gbm8gc2VwYXJhdG9yIGV4aXN0cyAoZGVmZW5zaXZlOiBzb21lIE5ISSByb3dzXG4vLyBzaGlwIG9ubHkgb25lIGxhbmd1YWdlKS4gVXNlZCBieSB0aGUgdjAuOC4wIGJpbGluZ3VhbCBtYXBwaW5nIHNvXG4vLyBGSElSIGBDb2RlYWJsZUNvbmNlcHQudGV4dGAgY2FycmllcyB0aGUgcGF0aWVudC1mYWNpbmcgXHU3RTQxXHU0RTJEIGZvcm1cbi8vIHdoaWxlIGBjb2RpbmdbXS5kaXNwbGF5YCBzdGF5cyBhcyB0aGUgY2xpbmljYWwvdGVjaG5pY2FsIEVuZ2xpc2guXG5leHBvcnQgZnVuY3Rpb24gcGlja0NoaW5lc2Uocykge1xuICBpZiAocyA9PT0gbnVsbCB8fCBzID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBjb25zdCBzdHIgPSBTdHJpbmcocyk7XG4gIGNvbnN0IGlkeCA9IHN0ci5pbmRleE9mKFwifHxcIik7XG4gIGlmIChpZHggPT09IC0xKSByZXR1cm4gc3RyLnRyaW0oKTtcbiAgY29uc3QgemggPSBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG4gIHJldHVybiB6aCB8fCBzdHIuc2xpY2UoaWR4ICsgMikudHJpbSgpO1xufVxuXG4vLyBTdHJpcCB0cmFpbGluZyBwdW5jdHVhdGlvbiAvIHdoaXRlc3BhY2UganVuayB0aGF0IHNvbWUgaG9zcGl0YWxzIGxlYXZlXG4vLyBvbiB0aGVpciBmcmVlLXRleHQgbGFiIGxhYmVscyAoZS5nLiBOSEkgcmV0dXJucyBcIkNyZWEsXCIgZnJvbSBvbmUgc2l0ZVxuLy8gYW5kIFwiQ3JlYVwiIGZyb20gYW5vdGhlciBmb3IgdGhlIHNhbWUgcGh5c2ljYWwgdGVzdCkuIFByZS1ub3JtYWxpemluZ1xuLy8gaGVyZSBtZWFucyB0aGUgT2JzZXJ2YXRpb24uY29kZS50ZXh0IGRvd25zdHJlYW0gcmVhZHMgY2xlYW5seSBldmVuXG4vLyB3aGVuIGRvd25zdHJlYW0gVUlzIHN0aWxsIGhhcHBlbiB0byByZW5kZXIgYGNvZGUudGV4dGAgaW5zdGVhZCBvZlxuLy8gcHVsbGluZyBkaXNwbGF5IGZyb20gdGhlIExPSU5DIC8gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBjb2RpbmcuXG5mdW5jdGlvbiBfY2xlYW5MYWJOYW1lKHMpIHtcbiAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgcmV0dXJuIFN0cmluZyhzKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWyxcdUZGMEM7XHVGRjFCXStcXHMqJC8sIFwiXCIpICAvLyB0cmFpbGluZyBcdTUzNEFcdTVGNjIgLyBcdTUxNjhcdTVGNjIgcHVuY3R1YXRpb25cbiAgICAudHJpbSgpO1xufVxuXG4vLyBBZGFwdGVyIGZvciBOSEkgbGFiL29ic2VydmF0aW9uIEpTT04gc2hhcGUgKGNvbmZpcm1lZCBmb3IgSUhLRTM0MDlTMDE7XG4vLyBvdGhlciBsYWIgZW5kcG9pbnRzIGxpa2VseSB1c2UgdGhlIHNhbWUgZmllbGRzKS5cbi8vXG4vLyBEYXRlIGZpZWxkIGNob2ljZSBcdTIwMTQgSUhLRTM0MDkgcmV0dXJucyB0aHJlZSBkYXRlLWlzaCBmaWVsZHMgcGVyIHJvdzpcbi8vICAgLSBmdW5DX0RBVEUgICAgICAgICAgXHU1QzMxXHU4QTNBXHU2NUU1IC8gXHU1MTY1XHU5NjYyXHU2NUU1ICh2aXNpdCByZWdpc3RyYXRpb24gLyBhZG1pc3Npb24pXG4vLyAgIC0gcmVhTF9JTlNQRUNUX0RBVEUgIFx1NUJFNlx1OTY5Qlx1NjNBMVx1NkFBMlx1NjVFNSAoYWN0dWFsIHNhbXBsZS1jb2xsZWN0aW9uIGRhdGUpXG4vLyAgIC0gYXNzYVlfVVBMT0FEX0RBVEUgIFx1NEUwQVx1NTBCM1x1NjVFNSAod2hlbiB0aGUgcmVzdWx0IGhpdCBOSEkncyBzZXJ2ZXIpXG4vLyBGb3IgYW4gaW5wYXRpZW50LCBmdW5DX0RBVEUgaXMgdGhlIGFkbWlzc2lvbiBkYXkgYW5kIGV2ZXJ5IGxhYiBkcmF3blxuLy8gZHVyaW5nIHRoZSBzdGF5IGNhcnJpZXMgdGhlIHNhbWUgZnVuQ19EQVRFIFx1MjAxNCB1c2luZyBpdCBhcyBPYnNlcnZhdGlvbi5cbi8vIGVmZmVjdGl2ZURhdGVUaW1lIG1hZGUgYWxsIFx1NEY0Rlx1OTY2Mlx1NjcxRlx1OTU5MyBsYWJzIGxvb2sgbGlrZSB0aGV5IHdlcmUgZHJhd25cbi8vIG9uIGRheSAxLiBGSElSJ3MgXCJwaHlzaW9sb2dpY2FsbHkgcmVsZXZhbnQgdGltZVwiIGZvciBhIGxhYiBPYnNlcnZhdGlvblxuLy8gaXMgdGhlIHNhbXBsZS1jb2xsZWN0aW9uIGRhdGUsIHNvIHByZWZlciByZWFMX0lOU1BFQ1RfREFURSB3aGVuIE5ISVxuLy8gcmV0dXJucyBpdDsgZmFsbCBiYWNrIHRvIGZ1bkNfREFURSBvbmx5IHdoZW4gdGhlIGluc3BlY3QgZmllbGQgaXNcbi8vIG1pc3NpbmcgKG9sZGVyIHJvd3MgLyBlbmRwb2ludHMgdGhhdCBkb24ndCBjYXJyeSBpdCkuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRMYWJJdGVtKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKFxuICAgIGl0ZW0ucmVhTF9JTlNQRUNUX0RBVEUgfHwgaXRlbS5yZWFsX2luc3BlY3RfZGF0ZSB8fCBpdGVtLmZ1bkNfREFURSxcbiAgKTtcbiAgY29uc3QgdmFsdWUgPSBpdGVtLmFzc2FZX1ZBTFVFO1xuICBpZiAoIWRhdGUgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIC8vIERpc3BsYXkgbmFtZSBmYWxsYmFjayBjaGFpbiAoYWxsIG5vcm1hbGl6ZWQgZm9yIHRyYWlsaW5nIHB1bmN0dWF0aW9uKTpcbiAgLy8gICAxLiBhc3NhWV9JVEVNX05BTUUgXHUyMDE0IGhvc3BpdGFsJ3MgZnVsbCBmcmVlLXRleHQgbGFiZWxcbiAgLy8gICAyLiBvcmRlcl9zaG9ydG5hbWUgXHUyMDE0IE5ISSdzIFVJLXRydW5jYXRlZCBsYWJlbCAob2Z0ZW4gZW5kcyBcIi4uLlwiKVxuICAvLyAgIDMuIG9yZGVSX05BTUUgICAgICBcdTIwMTQgTkhJJ3MgY2Fub25pY2FsIFx1OTFBQlx1NEVFNFx1NzhCQyBkaWN0aW9uYXJ5IG5hbWVcbiAgLy8gYXNzYVlfSVRFTV9OQU1FIHdpbnMgYnkgZGVmYXVsdCBiZWNhdXNlIG9yZGVyX3Nob3J0bmFtZSBjYW4gYmUgY3V0XG4gIC8vIG9mZiBtaWQtd29yZCAoXCJQQyBTdWdhciBcdTk4RUZcdTVGOEMgLi4uXCIpLCB3aGljaCBpcyB3b3JzZSB0aGFuIGEgdHJhaWxpbmctXG4gIC8vIGNvbW1hIGNvc21ldGljIGlzc3VlLiBvcmRlUl9OQU1FIGlzIHRoZSBsYXN0LXJlc29ydCBDaGluZXNlIGZvcm1hbFxuICAvLyBsYWJlbC5cbiAgY29uc3QgZnVsbE5hbWUgPSBfY2xlYW5MYWJOYW1lKGl0ZW0uYXNzYVlfSVRFTV9OQU1FKVxuICAgICAgICAgICAgICAgIHx8IF9jbGVhbkxhYk5hbWUoaXRlbS5vcmRlcl9zaG9ydG5hbWUpXG4gICAgICAgICAgICAgICAgfHwgX2NsZWFuTGFiTmFtZShpdGVtLm9yZGVSX05BTUUpO1xuICBjb25zdCBvcmRlckNvZGUgPSBTdHJpbmcoaXRlbS5vcmRlUl9DT0RFIHx8IFwiXCIpLnRyaW0oKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIG9yZGVyX2NvZGU6IG9yZGVyQ29kZSxcbiAgICBvcmRlcl9uYW1lOiBpdGVtLm9yZGVSX05BTUUgfHwgXCJcIixcbiAgICAvLyBQcmVmZXIgdGhlIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgKFwiMDkxNDBDXCIpIGFzIHRoZSBGSElSIGNvZGluZyBjb2RlIHNvIHRoZVxuICAgIC8vIGRvd25zdHJlYW0gb2JzZXJ2YXRpb24gbWFwcGVyIHJvdXRlcyBpdCB1bmRlciBOSElfTUVESUNBTF9PUkRFUl9cbiAgICAvLyBDT0RFIHN5c3RlbS4gU01BUlQgYXBwcyBncm91cCBsYWIgdGVzdHMgYnkgY29kaW5nIGNvZGU7IHVzaW5nXG4gICAgLy8gZnJlZS10ZXh0IGhlcmUgaXMgd2hhdCBjYXVzZXMgXCJDcmVhXCIgYW5kIFwiQ3JlYSxcIiB0byBiZSBzcGxpdFxuICAgIC8vIGludG8gdHdvIGRpc3RpbmN0IHRlc3RzLiBGYWxsYmFjayB0byB0aGUgY2xlYW5lZCBkaXNwbGF5IHdoZW5cbiAgICAvLyBOSEkgZG9lc24ndCBzdXBwbHkgYW4gb3JkZXIgY29kZSAob2xkZXIgLyBlZGdlLWNhc2Ugcm93cykuXG4gICAgY29kZTogb3JkZXJDb2RlIHx8IGZ1bGxOYW1lLFxuICAgIGRpc3BsYXk6IGZ1bGxOYW1lLFxuICAgIHZhbHVlOiBTdHJpbmcodmFsdWUpLFxuICAgIHVuaXQ6IGl0ZW0udW5pVF9EQVRBIHx8IFwiXCIsXG4gICAgcmVmZXJlbmNlX3JhbmdlOiBpdGVtLmNvbnN1bFRfVkFMVUUgfHwgaXRlbS5zaG9ydF9DT05TVUxUX1ZBTFVFIHx8IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzMzA2UzAxIHJldHVybnMgdmlzaXQtbGV2ZWwgcm93cyBPTkxZIChubyBkcnVnIG5hbWVzKS4gVGhlIGFjdHVhbCBkcnVnXG4vLyBsaXN0IGxpdmVzIGF0IElIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPTxyb3dfSUQ+JmN0eXBlPTIsIGluXG4vLyBgaWhrZTMzMDZTMDJfbWFpbl9kYXRhWypdLnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdGAuIFdlIGRvIHRoYXQgMi1zdGVwXG4vLyBmZXRjaCBzZXBhcmF0ZWx5OyB0aGlzIGZ1bmN0aW9uIGFkYXB0cyBhIHNpbmdsZSBkcnVnIGVudHJ5IGdpdmVuIGl0c1xuLy8gcGFyZW50IHZpc2l0IGNvbnRleHQuXG4vL1xuLy8gRGF0ZSBzZW1hbnRpY3MgKHZhcmllcyBieSB2aXNpdCB0eXBlIFx1MjAxNCB2aXNpYmxlIHZpYSB2aXNpdC5vcmlfVFlQRV9OQU1FKTpcbi8vICAgLSBPUEQgLyBcdTg1RTVcdTVDNDA6IGZ1bmNfREFURSBpcyB0aGUgb25seSBtZWFuaW5nZnVsIGRhdGUuIGN1cmVfRV9EQVRFIGlzXG4vLyAgICAgZW1wdHkuIGF1dGhvcmVkT24gPSBmdW5jX0RBVEUgaXMgYWNjdXJhdGUuXG4vLyAgIC0gXHU0RjRGXHU5NjYyIChpbnBhdGllbnQpOiBOSEkgcmV0dXJucyBPTkUgcm93IHBlciBhZG1pc3Npb24gc3VtbWFyaXNpbmdcbi8vICAgICBldmVyeSBkcnVnIHVzZWQgZHVyaW5nIHRoZSBzdGF5LiBmdW5jX0RBVEUgPSBhZG1pc3Npb24gZGF5LFxuLy8gICAgIGN1cmVfRV9EQVRFID0gZGlzY2hhcmdlIGRheS4gTkhJIGRvZXMgbm90IHByZXNlcnZlIHRoZSBhY3R1YWxcbi8vICAgICBhdXRob3JlZCBkYXRlIG9mIGVhY2ggZHJ1ZyBcdTIwMTQgYSBQUEkgc3RhcnRlZCBvbiBzdGF5LWRheSAzIGxvb2tzXG4vLyAgICAgaWRlbnRpY2FsIHRvIG9uZSBwcmVzY3JpYmVkIG9uIGFkbWlzc2lvbiBkYXkuXG4vLyAgICAgV2Ugc3VyZmFjZSBmdW5jX0RBVEUgXHUyMTkyIGF1dGhvcmVkT24gYXMgYSBiZXN0LWVmZm9ydCBhbmNob3IgYW5kXG4vLyAgICAgQURESVRJT05BTExZIGVtaXQgZW5kX2RhdGUgc28gdGhlIGRvd25zdHJlYW0gbWFwcGVyIGNhbiBhdHRhY2hcbi8vICAgICBkaXNwZW5zZVJlcXVlc3QudmFsaWRpdHlQZXJpb2QgPSB7c3RhcnQ6IGZ1bmNfREFURSwgZW5kOiBjdXJlX0VfREFURX0uXG4vLyAgICAgQ29uc3VtZXJzIHRoZW4gc2VlIFwidGhpcyBkcnVnIHdhcyB1c2VkIGR1cmluZyBhZG1pc3Npb24gNS8xOC01LzIyXCJcbi8vICAgICBpbnN0ZWFkIG9mIFwiMTQgZHJ1Z3MgYWxsIHByZXNjcmliZWQgb24gNS8xOFwiLlxuLy9cbi8vIERydWctcm93IG9yZGVyX2RydWdfZGF5IG5vdGU6IGlucGF0aWVudCByb3dzIHNoaXAgXCJcdUZGMERcIiAoZW0tZGFzaCBzZW50aW5lbFxuLy8gZm9yIFwibm8gZGF0YVwiKSBiZWNhdXNlIE5ISSBkb2Vzbid0IHRyYWNrIHBlci1kcnVnIGRheS1zdXBwbHkgZm9yXG4vLyBpbnBhdGllbnRzLiBOdW1iZXIoXCJcdUZGMERcIikgaXMgTmFOOyB0aGUgIWlzRmluaXRlIGJyYW5jaCBzZW5kcyBpdCB0byAwLFxuLy8gd2hpY2ggdGhlIG1hcHBlciB0cmVhdHMgYXMgZmFsc3kgYW5kIHNvIG9taXRzIGV4cGVjdGVkU3VwcGx5RHVyYXRpb24gXHUyMDE0XG4vLyBjb3JyZWN0OiBiZXR0ZXIgc2lsZW50IHRoYW4gZmFicmljYXRpbmcgYSBzdXBwbHkgY291bnQuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbChkcnVnLCB2aXNpdCwgb3B0aW9ucykge1xuICBpZiAoIWRydWcgfHwgdHlwZW9mIGRydWcgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICAvLyB2aXNpdC5mdW5jX0RBVEUgaXMgXCIxMTUvMDUvMDV8fDIwMjYvMDUvMDVcIiBcdTIwMTQgcm9jVG9JU08gbWF0Y2hlcyB0aGUgUk9DXG4gIC8vIHByZWZpeCBjb3JyZWN0bHkuXG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyh2aXNpdD8uZnVuY19EQVRFIHx8IHZpc2l0Py5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIGNvbnN0IHJhd0RydWdOYW1lID0gZHJ1Zy5kcnVnX25hbWUgfHwgZHJ1Zy5kcnVHX05BTUUgfHwgXCJcIjtcbiAgY29uc3QgZHJ1Z19uYW1lID0gcGlja0VuZ2xpc2gocmF3RHJ1Z05hbWUpO1xuICBpZiAoIWRhdGUgfHwgIWRydWdfbmFtZSkgcmV0dXJuIG51bGw7XG4gIC8vIGN1cmVfRV9EQVRFIG9ubHkgcG9wdWxhdGVkIGZvciBpbnBhdGllbnQgc3VtbWFyeSByb3dzOyBST0MgYmlsaW5ndWFsXG4gIC8vIHdpdGggZW1wdHkgaGFsdmVzIChcInx8XCIpIHBhcnNlcyB0byBcIlwiIHdoaWNoIHdlIHdhbnQuXG4gIGNvbnN0IGVuZF9kYXRlID0gcm9jVG9JU08odmlzaXQ/LmN1cmVfRV9EQVRFIHx8IHZpc2l0Py5jdXJlX2VfZGF0ZSB8fCBcIlwiKTtcbiAgY29uc3QgZGF5cyA9IE51bWJlcihkcnVnLm9yZGVyX2RydWdfZGF5IHx8IGRydWcub3JkZXJfRFJVR19EQVkgfHwgMCk7XG4gIC8vIGlzX2Nocm9uaWMgZmxvd3MgZnJvbSB0aGUgY2hyb25pYy1wcmVzY3JpcHRpb24gZmFuLW91dFxuICAvLyAoSUhLRTMzMDdTMDEgbGlzdCBcdTIxOTIgSUhLRTMzMDZTMDIgZGV0YWlsKS4gV2hlbiB0cnVlLCB0aGUgbWFwcGVyXG4gIC8vIGF0dGFjaGVzIGNvdXJzZU9mVGhlcmFweVR5cGU9Y29udGludW91cy4gRGVmYXVsdHMgZmFsc2Ugc28gT1BEIC9cbiAgLy8gaW5wYXRpZW50IC8gXHU4NUU1XHU1QzQwIGFjdXRlIHByZXNjcmlwdGlvbnMgc3RheSB1bmNoYW5nZWQuXG4gIGNvbnN0IGlzX2Nocm9uaWMgPSAhIShvcHRpb25zICYmIG9wdGlvbnMuaXNfY2hyb25pYyk7XG4gIC8vIE5ISSBcdTg1RTVcdTU0QzFcdTU3RkFcdTY3MkNcdThDQzdcdTY1OTlcdTVFQUIgc2hpcHMgYmlsaW5ndWFsIGBcdTRFMkRcdTY1ODd8fEVuZ2xpc2hgIG9uIHRocmVlIGZpZWxkc1xuICAvLyB3ZSBzdXJmYWNlIFx1MjAxNCBkcnVnX25hbWUsIGFjdCAoXHU4NUU1XHU3NDA2XHU1MjA2XHU5ODVFKSwgaWNkOWNtX0NPREVfQ05BTUUuIHYwLjguMFxuICAvLyBrZWVwcyBib3RoIGhhbHZlcyBzbyB0aGUgbWFwcGVyIGNhbiBwdXQgXHU3RTQxXHU0RTJEIGludG8gQ29kZWFibGVDb25jZXB0XG4gIC8vIC50ZXh0IChwYXRpZW50LWZhY2luZykgYW5kIEVuZ2xpc2ggaW4gY29kaW5nWzBdLmRpc3BsYXkgKGNsaW5pY2FsXG4gIC8vIGNhbm9uaWNhbCkuIGRydWcuZHJ1Z19uYW1lMiAvIHZpc2l0LmljZDljbV9DT0RFX0NOQU1FMiBhcmUgTkhJJ3NcbiAgLy8gb3duIENoaW5lc2Utb25seSBjb252ZW5pZW5jZSBmaWVsZHMgXHUyMDE0IHByZWZlciB0aGVtIHdoZW4gcHJlc2VudCxcbiAgLy8gZWxzZSBmYWxsIGJhY2sgdG8gdGhlIENoaW5lc2UgaGFsZiBvZiB0aGUgYmlsaW5ndWFsIGZpZWxkLlxuICBjb25zdCBkcnVnX25hbWVfemggPVxuICAgIGRydWcuZHJ1Z19uYW1lMiB8fCBkcnVnLmRydUdfTkFNRTIgfHwgcGlja0NoaW5lc2UocmF3RHJ1Z05hbWUpO1xuICBjb25zdCByYXdJbmRpY2F0aW9uID0gdmlzaXQ/LmljZDljbV9DT0RFX0NOQU1FIHx8IHZpc2l0Py5pY2Q5Y21fbmFtZSB8fCBcIlwiO1xuICAvLyBpY2Q5Y21fQ09ERV9DTkFNRSB3cmFwcyBlYWNoIGhhbGYgYXMgXCI8Y29kZT4vPHRleHQ+XCIgXHUyMDE0IHN0cmlwIHRoZVxuICAvLyBsZWFkaW5nIFwiPGNvZGU+L1wiIHNvIGRvd25zdHJlYW0gZG9lc24ndCBkb3VibGUtcHJpbnQgdGhlIGNvZGUgd2hlblxuICAvLyBpdCBjb21wb3NlcyBcIjxjb2RlPiA8dGV4dD5cIiBpdHNlbGYuXG4gIGNvbnN0IHN0cmlwSWNkUHJlZml4ID0gKHMpID0+IHMucmVwbGFjZSgvXltBLVowLTkuXStcXC9cXHMqLywgXCJcIik7XG4gIGNvbnN0IGluZGljYXRpb24gPSBzdHJpcEljZFByZWZpeChwaWNrRW5nbGlzaChyYXdJbmRpY2F0aW9uKSk7XG4gIGNvbnN0IGluZGljYXRpb25femggPVxuICAgIHZpc2l0Py5pY2Q5Y21fQ09ERV9DTkFNRTIgfHxcbiAgICB2aXNpdD8uaWNkOWNtX2NvZGVfY25hbWUyIHx8XG4gICAgc3RyaXBJY2RQcmVmaXgocGlja0NoaW5lc2UocmF3SW5kaWNhdGlvbikpO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgLy8gT25seSBlbWl0IHdoZW4gbWVhbmluZ2Z1bGx5IHBvcHVsYXRlZCBBTkQgZGlmZmVyZW50IGZyb20gc3RhcnQuXG4gICAgLy8gU3VwcHJlc3NpbmcgdGhlIHNhbWUtZGF5IGNhc2Uga2VlcHMgT1BEIC8gXHU4NUU1XHU1QzQwIHJlc291cmNlcyB0aWdodC5cbiAgICBlbmRfZGF0ZTogZW5kX2RhdGUgJiYgZW5kX2RhdGUgIT09IGRhdGUgPyBlbmRfZGF0ZSA6IFwiXCIsXG4gICAgZHJ1Z19uYW1lLFxuICAgIGRydWdfbmFtZV96aCxcbiAgICBjb2RlOiBkcnVnLm9yZGVyX2NvZGUgfHwgZHJ1Zy5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBkb3NlL2ZyZXF1ZW5jeS9yb3V0ZSBcdTIwMTQgb25seSBkYXlzICsgcXR5LlxuICAgIGRvc2U6IFwiXCIsXG4gICAgZnJlcXVlbmN5OiBcIlwiLFxuICAgIHJvdXRlOiBcIlwiLFxuICAgIHF1YW50aXR5OiBkcnVnLm9yZGVyX3F0eSB8fCBkcnVnLm9yZGVyX1FUWSB8fCBcIlwiLFxuICAgIGR1cmF0aW9uX2RheXM6IE51bWJlci5pc0Zpbml0ZShkYXlzKSA/IGRheXMgOiAwLFxuICAgIGluZGljYXRpb24sXG4gICAgaW5kaWNhdGlvbl96aCxcbiAgICBpbmRpY2F0aW9uX2NvZGU6IHZpc2l0Py5pY2Q5Y21fQ09ERSB8fCB2aXNpdD8uaWNkOWNtX2NvZGUgfHwgXCJcIixcbiAgICBkcnVnX2NsYXNzOiBwaWNrRW5nbGlzaChkcnVnLmFjdCB8fCBcIlwiKSxcbiAgICBkcnVnX2NsYXNzX3poOiBwaWNrQ2hpbmVzZShkcnVnLmFjdCB8fCBcIlwiKSxcbiAgICBob3NwaXRhbDogdmlzaXQ/Lmhvc3BfQUJCUiB8fCB2aXNpdD8uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gTWFwcGVyIHJlYWRzIHRoaXMgdG8gc2V0IE1lZGljYXRpb25SZXF1ZXN0LmNvdXJzZU9mVGhlcmFweVR5cGUuXG4gICAgY291cnNlX29mX3RoZXJhcHk6IGlzX2Nocm9uaWMgPyBcImNvbnRpbnVvdXNcIiA6IFwiXCIsXG4gIH07XG59XG5cbi8vIFN0dWIga2VwdCBmb3IgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5IFx1MjAxNCBJSEtFMzMwNlMwMSBsaXN0IG5ldmVyIGhhcyBkcnVncyxcbi8vIHNvIHdlIGFsd2F5cyByZXR1cm4gbnVsbCBhbmQgcmVseSBvbiB0aGUgMi1zdGVwIGRldGFpbCBmZXRjaCBhYm92ZS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdE1lZGljYXRpb24oKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIFN0dWIgZm9yIHRoZSBJSEtFMzMwN1MwMSBcdTYxNjJcdTYwMjdcdTg2NTVcdTY1QjlcdTdCOEIgbGlzdC4gVGhlIGxpc3Qgcm93cyBoYXZlIG5vIGRydWdcbi8vIHBheWxvYWQ7IGRydWdzIGNvbWUgdmlhIHRoZSAyLXN0ZXAgZmFuLW91dCBpbnRvIElIS0UzMzA2UzAyIHdpdGhcbi8vIGN0eXBlPXJvdy5vcmlfVFlQRSAoc2VlIF9mZXRjaENocm9uaWNNZWRpY2F0aW9uRGV0YWlsc0luVGFiIGluXG4vLyBiYWNrZ3JvdW5kLmpzKS4gUmV0dXJuaW5nIG51bGwgaGVyZSBlbnN1cmVzIHRoZSBnZW5lcmljIGxvb3AgZW1pdHNcbi8vIG5vdGhpbmcgZnJvbSB0aGlzIGVuZHBvaW50IFx1MjAxNCB0aGUgZmFuLW91dCBpcyB3aGVyZSB0aGUgbWFya2VkXG4vLyBNZWRpY2F0aW9uUmVxdWVzdCByZXNvdXJjZXMgYXJlIHByb2R1Y2VkLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0Q2hyb25pY0xpc3RTdHViKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBTYW1lIHNoYXBlIGFzIGFkYXB0TWVkaWNhdGlvbjogSUhLRTM0MDhTMDEgKGltYWdpbmcgbGlzdCkgb25seSBjYXJyaWVzXG4vLyBvcmRlci1sZXZlbCBkYXRhOyB0aGUgYWN0dWFsIHJlcG9ydCBuYXJyYXRpdmUgY29tZXMgZnJvbSB0aGUgSUhLRTM0MDhTMDJcbi8vIGRldGFpbCBmYW4tb3V0IChzZWUgYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCkuIFJldHVybmluZyBudWxsIGZyb21cbi8vIHRoZSBsaXN0IGFkYXB0ZXIgZW5zdXJlcyBubyBoYWxmLWZvcm1lZCBEaWFnbm9zdGljUmVwb3J0cyBsZWFrIHRocm91Z2guXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRJbWFnaW5nTGlzdFN0dWIoKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIElIS0UzMjA5UzAxIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpIFx1MjAxNCBOSEkncyBvZmZpY2lhbGx5LXZldHRlZCBjYXRhc3Ryb3BoaWMtaWxsbmVzc1xuLy8gcmVnaXN0cnkuIEVhY2ggcm93IGlzIGEgc2VyaW91cyBjaHJvbmljIGNvbmRpdGlvbiAoY2FuY2VyLCBhdXRvaW1tdW5lLFxuLy8gdHJhbnNwbGFudCBmb2xsb3ctdXAsIGRpYWx5c2lzLCBldGMuKSB0aGUgcGF0aWVudCBpcyBjdXJyZW50bHlcbi8vIHJlZ2lzdGVyZWQgZm9yLiBUaGlzIGlzIHRoZSBjbG9zZXN0IHRoaW5nIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBleHBvc2VzIHRvIGFcbi8vIGN1cmF0ZWQgcHJvYmxlbSBsaXN0IFx1MjAxNCBmYXIgc3Ryb25nZXIgc2lnbmFsIHRoYW4gcmV2ZXJzZS1lbmdpbmVlcmluZ1xuLy8gY2hyb25pYyBjb25kaXRpb25zIGZyb20gZW5jb3VudGVyIElDRHMuXG4vL1xuLy8gTWFwcyB0byBGSElSIENvbmRpdGlvbiB3aXRoIGNhdGVnb3J5PXByb2JsZW0tbGlzdC1pdGVtIHNvIGRvd25zdHJlYW1cbi8vIFNNQVJUIGFwcHMgLyBJUFMgcHJvZmlsZXMgc3VyZmFjZSBpdCBpbiB0aGVpciBwcm9ibGVtLWxpc3Qgdmlldy5cbi8vXG4vLyBQYXlsb2FkIHNoYXBlIChsaXZlIGNhcHR1cmUpOlxuLy8gICBzUF9JSEtFMzIwOVMwMTogW1xuLy8gICAgIHsgaG9zUF9JRCwgaG9zUF9BQkJSLCBob3NQX1VSTCxcbi8vICAgICAgIGljRDEwQ01fQ05BTUU6IFwiXHU2NTFEXHU4Qjc3XHU4MTdBXHU2MEUxXHU2MDI3XHU4MTZCXHU3NjI0XCIsICBcdTIxOTAgQ2hpbmVzZSBuYXJyYXRpdmUgb25seVxuLy8gICAgICAgdmFsaURfU19EQVRFOiAgXCIxMTEvMTEvMTZcIiwgICAgICAgXHUyMTkwIGNlcnRpZmljYXRpb24gdmFsaWQtZnJvbSAoUk9DKVxuLy8gICAgICAgdmFsaURfRV9EQVRFOiAgXCIxMTYvMTEvMTVcIiB9ICAgICAgXHUyMTkwIGNlcnRpZmljYXRpb24gdmFsaWQtdW50aWwgKFJPQywgfjV5KVxuLy8gICBdXG4vL1xuLy8gQ2F2ZWF0cyBkZWxpYmVyYXRlbHkgZW5jb2RlZDpcbi8vICAgLSBOSEkgZG9lc24ndCByZXR1cm4gdGhlIElDRC0xMC1DTSBjb2RlIGluIHRoaXMgZW5kcG9pbnQsIG9ubHkgdGhlXG4vLyAgICAgQ2hpbmVzZSBsYWJlbC4gV2UgbGVhdmUgYGNvZGVgIGVtcHR5OyBtYXBDb25kaXRpb24gZmFsbHMgYmFjayB0b1xuLy8gICAgIGRpc3BsYXktYXMtaWQgZm9yIHN0YWJsZUlkIChtaXJyb3JpbmcgZGlhZ25vc3RpYy1yZXBvcnQudHMpLlxuLy8gICAtIHZhbGlEX0VfREFURSBpcyB3aGVuIHRoZSBDQVJEIGV4cGlyZXMgKHJlbmV3ZWQgZXZlcnkgfjV5KSwgTk9UXG4vLyAgICAgd2hlbiB0aGUgZGlzZWFzZSByZXNvbHZlZC4gV2UgZGVsaWJlcmF0ZWx5IGRvIE5PVCBtYXAgaXQgdG9cbi8vICAgICBhYmF0ZW1lbnREYXRlVGltZSBcdTIwMTQgdGhhdCB3b3VsZCBmYWxzZWx5IGltcGx5IHRoZSBjb25kaXRpb24gc3RvcHBlZC5cbi8vICAgLSBBbGwgcm93cyBoZXJlIGFyZSBjdXJyZW50bHkgYWN0aXZlIGJ5IGRlZmluaXRpb247IE5ISSBvbmx5IHJldHVybnNcbi8vICAgICB2YWxpZCBjZXJ0aWZpY2F0aW9ucy4gY2xpbmljYWxfc3RhdHVzIGhhcmQtY29kZWQgdG8gXCJhY3RpdmVcIi5cbi8vICAgLSBzZXZlcml0eSBzdG9yZWQgYXMgdGV4dCAoXCJTZXZlcmUgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSlcIikgYmVjYXVzZSB0aGUgZm9ybWFsXG4vLyAgICAgc2V2ZXJpdHkgY29kZSBtYXBwaW5nIChTTk9NRUQgMjQ0ODQwMDAgZXRjLikgbmVlZHMgbW9yZSB0aG91Z2h0LlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyhpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChpdGVtLmljRDEwQ01fQ05BTUUgfHwgaXRlbS5pY2QxMGNtX2NuYW1lIHx8IFwiXCIpO1xuICBpZiAoIWRpc3BsYXkpIHJldHVybiBudWxsO1xuICByZXR1cm4ge1xuICAgIGRpc3BsYXksXG4gICAgY29kZTogXCJcIixcbiAgICBzeXN0ZW06IFwiXCIsXG4gICAgb25zZXRfZGF0ZTogcm9jVG9JU08oaXRlbS52YWxpRF9TX0RBVEUgfHwgaXRlbS52YWxpZF9zX2RhdGUgfHwgXCJcIiksXG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS52YWxpRF9TX0RBVEUgfHwgaXRlbS52YWxpZF9zX2RhdGUgfHwgXCJcIiksXG4gICAgY2F0ZWdvcnk6IFwicHJvYmxlbS1saXN0LWl0ZW1cIixcbiAgICBzZXZlcml0eTogXCJTZXZlcmUgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSlcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICBjbGluaWNhbF9zdGF0dXM6IFwiYWN0aXZlXCIsXG4gIH07XG59XG5cbi8vIElIS0UzNDAyUzAxIChcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjVcdTdENTBcdTY3OUMpIFx1MjAxNCBvbmUgcm93IHBlciBzY3JlZW5pbmcgZXZlbnQsIGZsYXRcbi8vIHNjaGVtYS4gTkhJIHJ1bnMgdGhlIHBhbmVsIGl0c2VsZiBhbmQgcmV0dXJucyB2aXRhbHMgKyBhIGZpeGVkXG4vLyBiYXR0ZXJ5IG9mIGxhYiB2YWx1ZXMgcHJlLWNvbXB1dGVkIChCTUkgLyB3YWlzdCAvIEJQIC8gbGlwaWRzIC8gTEZUXG4vLyAvIFJGVCAvIGZhc3RpbmcgZ2x1Y29zZSAvIEhCc0FnIC8gQW50aS1IQ1YgLyB1cmljIGFjaWQgXHUyMDI2KS5cbi8vIFdlIHVuZm9sZCBvbmUgcm93IGludG8gfjE1IE9ic2VydmF0aW9uczogdml0YWxzIGdvIHRvIGNhdGVnb3J5XG4vLyB2aXRhbC1zaWducyAoc28gU01BUlQgYXBwcycgdml0YWxzIHZpZXdzIHBpY2sgdGhlbSB1cCksIGxhYnMgZ28gdG9cbi8vIGNhdGVnb3J5IGxhYm9yYXRvcnkuIFJldHVybnMgYW4gQVJSQVkgXHUyMDE0IGNhbGxlciBtdXN0IGZsYXQtbWFwLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0QWR1bHRQcmV2ZW50aXZlKHJvdykge1xuICBpZiAoIXJvdyB8fCB0eXBlb2Ygcm93ICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKHJvdy5maXJzVF9ESUFHX0RBVEUgfHwgXCJcIik7XG4gIGlmICghZGF0ZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGhvc3BpdGFsID0gcm93Lmhvc1BfQUJCUiB8fCByb3cuaG9zcF9BQkJSIHx8IFwiXCI7XG4gIGNvbnN0IG91dCA9IFtdO1xuICAvLyAoZGlzcGxheSwgdmFsdWUsIHVuaXQsIHJlZlJhbmdlLCBjYXRlZ29yeSwgTkhJIGNvZGUpXG4gIC8vIChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBjb2RlKVxuICAvLyBFdmVyeSBvYnNlcnZhdGlvbiBlbWl0dGVkIGZyb20gdGhpcyBhZGFwdGVyIGNhcnJpZXMgc291cmNlX3Byb2dyYW09XG4gIC8vIFwiYWR1bHQtcHJldmVudGl2ZVwiIHNvIGRvd25zdHJlYW0gRkhJUiBjb25zdW1lcnMgY2FuIGlkZW50aWZ5IHRoZVxuICAvLyBvcmlnaW4gcHJvZ3JhbW1lIHZpYSBPYnNlcnZhdGlvbi5tZXRhLnRhZyAoc2VwYXJhdGUgZnJvbSB0aGVcbiAgLy8gc3luYy1wYWdlLXR5cGUgLyBzeW5jLXJ1bi1pZCBzeW5jLXRyYWNraW5nIHRhZ3MpLlxuICBmdW5jdGlvbiBwdXNoKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIGNvZGUpIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGNvbnN0IHYgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgICAvLyBFbS1kYXNoIFwiXHUyMDE0XCIgKFUrMjAxNCkgaXMgTkhJJ3Mgc2VudGluZWwgXCJubyBkYXRhXCIgbWFya2VyIFx1MjAxNCBkcm9wLlxuICAgIC8vIFBsYWluIGh5cGhlbiBcIi1cIiBpcyBOT1QgYSBuby1kYXRhIG1hcmtlciBwZXItZmllbGQgXHUyMDE0IGl0J3MgdGhlXG4gICAgLy8gY2xpbmljYWwgZGlwc3RpY2sgY29udmVudGlvbiBmb3IgXCJuZWdhdGl2ZVwiIChVcmluZSBQcm90ZWluKS5cbiAgICAvLyBOSEkncyBuby1kYXRhIGZsYWcgZm9yIGFuIGVudGlyZSByb3cgaXMgc2lnbmFsbGVkIGJ5XG4gICAgLy8gZmlyc1RfRElBR19EQVRFID0gXCItXCIgd2hpY2ggdGhlIHJvdy1sZXZlbCBkYXRlIGd1YXJkIGF0IHRoZSB0b3BcbiAgICAvLyBvZiBhZGFwdEFkdWx0UHJldmVudGl2ZSBhbHJlYWR5IHJlamVjdHMsIHNvIFwiLVwiIHJlYWNoaW5nIHB1c2goKVxuICAgIC8vIGFsd2F5cyBtZWFucyBcInRoZSBjbGluaWNpYW4gd3JvdGUgaXQgZG93biBhcyBhIG5lZ2F0aXZlIHJlc3VsdFwiLlxuICAgIGlmICh2ID09PSBcIlwiIHx8IHYgPT09IFwiXHUyMDE0XCIpIHJldHVybjtcbiAgICBvdXQucHVzaCh7XG4gICAgICBkYXRlLFxuICAgICAgaG9zcGl0YWwsXG4gICAgICBjYXRlZ29yeTogY2F0ZWdvcnkgfHwgXCJsYWJvcmF0b3J5XCIsXG4gICAgICBvcmRlcl9jb2RlOiBjb2RlIHx8IFwiXCIsXG4gICAgICBvcmRlcl9uYW1lOiBkaXNwbGF5LFxuICAgICAgY29kZTogY29kZSB8fCBkaXNwbGF5LFxuICAgICAgZGlzcGxheSxcbiAgICAgIHZhbHVlOiB2LFxuICAgICAgdW5pdDogdW5pdCB8fCBcIlwiLFxuICAgICAgcmVmZXJlbmNlX3JhbmdlOiByZWZSYW5nZSB8fCBcIlwiLFxuICAgICAgLy8gU291cmNlLXByb2dyYW1tZSB0YWcgXHUyMDE0IGFkZGVkIHRvIE9ic2VydmF0aW9uLm1ldGEudGFnIGJ5IHRoZVxuICAgICAgLy8gbWFwcGVyOyBsZXRzIFNNQVJUIGFwcHMgZmlsdGVyIC8gY2F0ZWdvcml6ZSBcInRoaXMgY2FtZSBmcm9tXG4gICAgICAvLyBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjUgc2NyZWVuaW5nXCIuXG4gICAgICBzb3VyY2VfcHJvZ3JhbTogXCJhZHVsdC1wcmV2ZW50aXZlXCIsXG4gICAgfSk7XG4gIH1cbiAgLy8gVml0YWwgc2lnbnMgKG5vIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgXHUyMDE0IHRoZXNlIGFyZSBzY3JlZW5pbmcgbWVhc3VyZW1lbnRzLCBub3RcbiAgLy8gbGFiIG9yZGVyczsgdGhleSBoYXZlIGNhbm9uaWNhbCBMT0lOQ3Mgd2hpY2ggZmluZExvaW5jJ3Mga2V5d29yZFxuICAvLyBzZWFyY2ggcmVzb2x2ZXMgY2xlYW5seSB2aWEgdW5pcXVlIHRlcm1zIGxpa2UgXCJib2R5IGhlaWdodFwiIC8gXCJibWlcIlxuICAvLyBcdTIwMTQgbm8gcHJlZml4LWNvbGxpc2lvbiByaXNrIHdpdGggb3RoZXIgTE9JTkNfTUFQIGtleXMpLlxuICBwdXNoKFwiQm9keSBIZWlnaHRcIiwgcm93LmhlaWdodCwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQm9keSBXZWlnaHRcIiwgcm93LndlaWdodCwgXCJrZ1wiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQk1JXCIsIHJvdy5ibWksIFwia2cvbTJcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIldhaXN0IENpcmN1bWZlcmVuY2VcIiwgcm93LndhaXN0bGluZSwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiU3lzdG9saWMgQmxvb2QgUHJlc3N1cmVcIiwgcm93LmJhc0VfU0JQLCBcIm1tSGdcIixcbiAgICAgICByb3cuYmxvRF9QUkVTU19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiRGlhc3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX0VCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgLy8gQWxsIGNoZW1pc3RyeSAvIGhlcCBwYW5lbCByb3dzIHBpbiB0aGUgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBzbyBmaW5kTG9pbmMgdGFrZXNcbiAgLy8gdGhlIE5ISV9UT19MT0lOQyBkaXJlY3QtbG9va3VwIHBhdGggXHUyMDE0IGJ5cGFzc2VzIHRoZSBrZXl3b3JkIHNlYXJjaFxuICAvLyBlbnRpcmVseS4gTWFwcGluZyBjcm9zcy12ZXJpZmllZCBhZ2FpbnN0IHRocmVlIHNvdXJjZXM6IHRoZSBOSEkgVUlcbiAgLy8gc2VjdGlvbiBsYWJlbHMgKFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjUpLCB0aGUgSUhLRTM0MDIgSlNPTiBmaWVsZFxuICAvLyBuYW1lcywgYW5kIHRoZSBleGlzdGluZyBOSElfVE9fTE9JTkMgdGFibGUgY29tbWVudHMuXG4gIC8vXG4gIC8vIExpcGlkIHBhbmVsXG4gIHB1c2goXCJDaG9sZXN0ZXJvbFwiLCAgIHJvdy5jaG8sICAgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDAxQ1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyMDkzLTNcbiAgcHVzaChcIlRyaWdseWNlcmlkZVwiLCAgcm93LmJsb0RfVEcsIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDRDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDI1NzEtOFxuICBwdXNoKFwiSERMXCIsICAgICAgICAgICByb3cuaGRsLCAgICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTA0M0NcIik7ICAvLyBcdTIxOTIgTE9JTkMgMjA4NS05XG4gIHB1c2goXCJMRExcIiwgICAgICAgICAgIHJvdy5sZGwsICAgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDQ0Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAxMzQ1Ny03IChjYWxjKVxuICAvLyBMaXZlciBmdW5jdGlvblxuICBwdXNoKFwiU0dPVCAoQVNUKVwiLCAgICByb3cuc2dvdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMjVDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDE5MjAtOFxuICBwdXNoKFwiU0dQVCAoQUxUKVwiLCAgICByb3cuc2dwdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMjZDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDE3NDItNlxuICAvLyBGYXN0aW5nIGdsdWNvc2VcbiAgcHVzaChcIkdsdS1BQ1wiLCAgICAgICAgcm93LnNfMDkwMDVDLCBcIm1nL2RMXCIsXG4gICAgICAgcm93LnNfMDkwMDVDX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDVDXCIpOyAgICAgICAgLy8gXHUyMTkyIExPSU5DIDE1NTgtNlxuICAvLyBSZW5hbCBmdW5jdGlvbiBcdTIwMTQgYHVyaW5FX0JVTmAgaXMgTkhJJ3MgbWlzbGVhZGluZyBmaWVsZCBuYW1lOyB0aGVcbiAgLy8gdmFsdWUgSVMgc2VydW0gQlVOIChCbG9vZCBVcmVhIE5pdHJvZ2VuKSwgbm90IGEgdXJpbmUgdGVzdC5cbiAgcHVzaChcIkJVTlwiLCAgICAgICAgICAgcm93LnVyaW5FX0JVTiwgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDAyQ1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAzMDk0LTBcbiAgcHVzaChcIkNyZWF0aW5pbmVcIiwgICAgcm93LmJsb0RfQ1JFQVQsICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDE1Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyMTYwLTBcbiAgLy8gZUdGUiBcdTIwMTQgZGVyaXZlZCBmcm9tIENyZWF0aW5pbmUsIG5vIG93biBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDLiBEaXNwbGF5IGtleXdvcmRcbiAgLy8gXCJlZ2ZyXCIgcmVzb2x2ZXMgdG8gTE9JTkMgMzM5MTQtMyB2aWEgZmluZExvaW5jLlxuICBwdXNoKFwiZUdGUlwiLCAgICAgICAgICByb3cuZWdmciwgICAgICAgIFwibUwvbWluLzEuNzNtMlwiLFxuICAgICAgIHJvdy5yRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICAvLyBVcmluZSBQcm90ZWluIGRpcHN0aWNrIFx1MjAxNCBxdWFsaXRhdGl2ZSAoXCItXCIgLyBcIlx1MDBCMVwiIC8gXCIxK1wiIC4uLikuXG4gIC8vIHVyaW5FX1BST1RFSU4gaXMgdGhlIHN0YXR1cyBjb2RlLCB1cmluRV9QUk9URUlOX1RFWFQgaXMgdGhlXG4gIC8vIGRpc3BsYXlhYmxlIHJlc3VsdCAocGFzc2VkIGFzIHZhbHVlKS4gVGhlIHNwZWNpZmljIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgZm9yXG4gIC8vIHByZXZlbnRpdmUtc2NyZWVuaW5nIHVyaW5lIHByb3RlaW4gaXNuJ3QgaW4gb3VyIE5ISV9UT19MT0lOQyB0YWJsZVxuICAvLyB5ZXQ7IHRoZSBrZXl3b3JkIFwidXJpbmUgcHJvdGVpblwiIHJlc29sdmVzIHRvIExPSU5DIDIwNDU0LTUgdmlhXG4gIC8vIGZpbmRMb2luYyAoYWZ0ZXIgdGhlIHYwLjYuNyBsb25nZXN0LW1hdGNoIGZpeCkuXG4gIHB1c2goXCJVcmluZSBQcm90ZWluXCIsIHJvdy51cmluRV9QUk9URUlOX1RFWFQgfHwgXCJcIiwgXCJcIiwgXCJcIik7XG4gIC8vIEhlcGF0aXRpcyBCL0Mgc2NyZWVuaW5nIFx1MjAxNCBzdGF0dXMgY29kZSB2cyBfVEVYVCB0cmFwIGRvY3VtZW50ZWQgYXRcbiAgLy8gbGVuZ3RoIGJlbG93LiBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHBpbm5lZCBzbyBmaW5kTG9pbmMgdGFrZXMgdGhlIE5ISV9UT19MT0lOQ1xuICAvLyBwYXRoIChvdGhlcndpc2UgdGhlIGtleXdvcmQgXCJoYlwiIHByZWZpeC1jb2xsaWRlcyB3aXRoIHRoZSBtb3JlXG4gIC8vIHNwZWNpZmljIFwiaGJzYWdcIiBcdTIwMTQgdGhlIGJ1ZyBvcmlnaW5hbGx5IHJlcG9ydGVkIGluIHYwLjYuNSkuXG4gIC8vICAgMTQwMzJDIFx1MjE5MiBMT0lOQyA1MTk2LTEgIChIQnNBZywgTWFzcy92b2wpXG4gIC8vICAgMTQwNTFDIFx1MjE5MiBMT0lOQyAxMzk1NS0wIChIQ1YgYW50aWJvZHksIFNlcnVtIG9yIFBsYXNtYSlcbiAgLy8gSGlzdG9yeTogcmVncmVzc2VkIGluIHYwLjYuMywgZml4IGxvc3QgdW50aWwgdjAuNi41OyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDXG4gIC8vIHBpbm5pbmcgYWRkZWQgdjAuNi42ICsgdjAuNi44LlxuICBwdXNoKFwiSEJzQWdcIiwgICAgcm93Lmhic2FHX1RFWFQgICB8fCBcIlwiLCBcIlwiLCByb3cuaGJWX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjE0MDMyQ1wiKTtcbiAgcHVzaChcIkFudGktSENWXCIsIHJvdy5hbnRJX0hDVl9URVhUIHx8IFwiXCIsIFwiXCIsIHJvdy5oY1ZfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMTQwNTFDXCIpO1xuICAvLyBVcmljIGFjaWQgKGJsb29kKSBcdTIwMTQgYHVyaUNfQUNJRGAgZmllbGQuIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgMDkwMTNDIFx1MjE5MiBMT0lOQ1xuICAvLyAzMDg0LTEgKFVyYXRlIE1hc3Mvdm9sIFMvUCkuXG4gIC8vXG4gIC8vIE5ISSdzIElIS0UzNDAyIHNjaGVtYSBBTFNPIGNhcnJpZXMgdHdvIHJlbGF0ZWQtbG9va2luZy1idXQtZGlzdGluY3RcbiAgLy8gZmllbGRzIHdlIGRlbGliZXJhdGVseSBza2lwOlxuICAvLyAgIC0gdXJpbkVfVUFfRElBR19BQ0lEIFx1MjAxNCBlbXBpcmljYWxseSBkdXBsaWNhdGVzIHNlcnVtIHVyaWMgYWNpZDtcbiAgLy8gICAgIGVtaXR0aW5nIGl0IHdvdWxkIGNyZWF0ZSBhIGR1cGxpY2F0ZSBPYnNlcnZhdGlvbi5cbiAgLy8gICAtIHVyaW5FX1VBIC8gdXJpbkVfVUFfRElBR19SRVNVTFRfVEVYVCBcdTIwMTQgY2xhaW0gdG8gYmUgYSB1cmluZSBVQVxuICAvLyAgICAgZGlwc3RpY2sgYnV0IERPTidUIGFwcGVhciBhbnl3aGVyZSBpbiBOSEkncyBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgVUkgZm9yXG4gIC8vICAgICBhZHVsdCBwcmV2ZW50aXZlIHNjcmVlbmluZyAodGhlIFx1NUMzRlx1NkRCMlx1NkFBMlx1NjdFNSBzZWN0aW9uIG9ubHkgc2hvd3NcbiAgLy8gICAgIFx1NUMzRlx1NkRCMlx1ODZDQlx1NzY3RFx1OENFQSkuIEFsd2F5cyBlbXB0eSAvIFwiLVwiIGluIG9ic2VydmVkIHBheWxvYWRzLiBMZWdhY3lcbiAgLy8gICAgIHNjaGVtYSBmaWVsZCB3aXRoIG5vIGNsaW5pY2FsIHJlYWxpdHkgXHUyMDE0IGRvIE5PVCBlbWl0LlxuICBwdXNoKFwiVXJpYyBBY2lkXCIsICAgICByb3cudXJpQ19BQ0lELCAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMTNDXCIpO1xuICAvLyBNZXRhYm9saWMgc3luZHJvbWUgc2NyZWVuaW5nIFx1MjAxNCB2YWx1ZSBpcyBhbiBpbnRlcnByZXRhdGlvbiBzdHJpbmdcbiAgLy8gKCdcdTZCNjNcdTVFMzgnIC8gJ1x1NzU3MFx1NUUzOFx1RkYwQ1x1NUVGQVx1OEI3MFx1RkYxQVx1OEFDQlx1NkQzRFx1OEE2Mlx1OTFBQlx1NUUyQicpLCBub3QgYSBudW1iZXIuIFRoZSBtYXBwZXInc1xuICAvLyBfdHJ5X3BhcnNlX3F1YW50aXR5IHdpbGwgcmV0dXJuIE5vbmUgYW5kIGl0IGZhbGxzIHRocm91Z2ggdG9cbiAgLy8gdmFsdWVTdHJpbmcuIE5vIG1hcHBlZCBMT0lOQyBrZXl3b3JkICh5ZXQpIHNvIHRoaXMgbGFuZHMgYXMgYW5cbiAgLy8gT2JzZXJ2YXRpb24gd2l0aCBjb2RlLnRleHQgb25seTsgZG93bnN0cmVhbSBjb25zdW1lcnMgY2FuIHN0aWxsXG4gIC8vIHN1cmZhY2UgaXQgdW5kZXIgdGhlIHBhdGllbnQncyBzY3JlZW5pbmcgc2VjdGlvbiBieSBjb2RlLnRleHQuXG4gIHB1c2goXCJcdTRFRTNcdThCMURcdTc1QzdcdTUwMTlcdTdGQTRcdTdCRTlcdTZBQTIgKE1ldGFib2xpYyBTeW5kcm9tZSBTY3JlZW5pbmcpXCIsXG4gICAgICAgcm93Lm1ldEFfU1lORFJfUkVTVUxUX1RFWFQsIFwiXCIsIFwiXCIpO1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyBJSEtFMzMwOVMwMSAoXHU0RjRGXHU5NjYyIGlucGF0aWVudCBsaXN0KSBcdTIwMTQgZ2l2ZXMgcHJvcGVyIGFkbWlzc2lvbi9kaXNjaGFyZ2UuXG4vLyBTaGFwZToge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIGluX0RBVEUsIG91dF9EQVRFLFxuLy8gICAgICAgICBpY2Q5Y21fQ09ERSwgaWNkOWNtX0NPREVfQ05BTUUsIG9yaV9UWVBFKFwiM1wiKSwgcm93X0lELCAuLi59XG4vLyBJSEtFMzMwOFMwMSBoYXMgdGhlIHNhbWUgc2hhcGUgZm9yIGEgc21hbGwgc2V0IG9mIG9sZGVyIFx1NEY0Rlx1OTY2MiByZWNvcmRzO1xuLy8gYGZ1bmNfREFURWAgaW5zdGVhZCBvZiBgaW5fREFURWAgaW4gc29tZSByb3dzIFx1MjAxNCBhZGFwdGVyIGFjY2VwdHMgYm90aC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdElucGF0aWVudEVuY291bnRlcihpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHN0YXJ0ID0gcm9jVG9JU08oaXRlbS5pbl9EQVRFIHx8IGl0ZW0uZnVuY19EQVRFIHx8IFwiXCIpO1xuICBjb25zdCBlbmQgPSByb2NUb0lTTyhpdGVtLm91dF9EQVRFIHx8IFwiXCIpO1xuICBpZiAoIXN0YXJ0KSByZXR1cm4gbnVsbDtcbiAgLy8gaWNkOWNtIG5hbWUgb24gXHU0RjRGXHU5NjYyIGxpc3QgaXMganVzdCBDaGluZXNlIChubyB8fCBFbmdsaXNoIHNwbGl0IG9ic2VydmVkKVxuICAvLyBoaXN0b3JpY2FsbHk7IHRyZWF0IGRlZmVuc2l2ZWx5IGFzIGJpbGluZ3VhbCBzbyBmdXR1cmUgTkhJIGNoYW5nZXMgZG9uJ3RcbiAgLy8gc3VycHJpc2UgdXMuIFdoZW4gb25seSBDaGluZXNlIGlzIHNoaXBwZWQsIHBpY2tFbmdsaXNoIGZhbGxzIGJhY2sgdG8gaXQuXG4gIGNvbnN0IGljZENvZGUgPSBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgcmF3SWNkTmFtZSA9IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fbmFtZSB8fCBcIlwiO1xuICBjb25zdCBzdHJpcEljZFByZWZpeCA9IChzKSA9PiBzLnJlcGxhY2UoL15bQS1aMC05Ll0rXFwvXFxzKi8sIFwiXCIpO1xuICBjb25zdCBpY2ROYW1lID0gc3RyaXBJY2RQcmVmaXgocGlja0VuZ2xpc2gocmF3SWNkTmFtZSkpO1xuICBjb25zdCBpY2ROYW1lX3poID0gc3RyaXBJY2RQcmVmaXgocGlja0NoaW5lc2UocmF3SWNkTmFtZSkpO1xuICByZXR1cm4ge1xuICAgIGRhdGU6IHN0YXJ0LFxuICAgIGVuZF9kYXRlOiBlbmQsXG4gICAgY2xhc3M6IFwiSU1QXCIsXG4gICAgdHlwZV9kaXNwbGF5OiBcIlx1NEY0Rlx1OTY2MlwiLFxuICAgIGRlcGFydG1lbnQ6IFwiXCIsXG4gICAgcHJvdmlkZXI6IFwiXCIsXG4gICAgcmVhc29uOiBpY2ROYW1lID8gKGljZENvZGUgPyBgJHtpY2RDb2RlfSAke2ljZE5hbWV9YCA6IGljZE5hbWUpIDogXCJcIixcbiAgICByZWFzb25femg6IGljZE5hbWVfemggPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZV96aH1gIDogaWNkTmFtZV96aCkgOiBcIlwiLFxuICAgIHJlYXNvbl9jb2RlOiBpY2RDb2RlLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIHJvd19pZDogaXRlbS5yb3dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkgaXRlbSBzaGFwZSBcdTIwMTQgZmFyIG1vcmUgY29tcGxldGUgdGhhbiB0aGUgb2xkZXJcbi8vIElIS0UzMzAxUzAyIHZpc2l0IGxpc3QgKDUxIHZpc2l0cyB2cyA2IGZvciB0aGUgdGVzdCBwYXRpZW50KS4gTkhJJ3Ncbi8vIGNhbm9uaWNhbCBzb3VyY2Ugb2YgdHJ1dGggZm9yIFwiZXZlcnkgYmlsbGVkIGVuY291bnRlclwiLlxuLy8gICBob3NQX0lELCBob3NQX0FCQlIsIGhvc3BfdXJsXG4vLyAgIGZ1bkNfREFURSAgICAgICAgICAgICAgKFx1NkMxMVx1NTcwQiBZWVkvTU0vREQpXG4vLyAgIGljRDlDTV9DT0RFIC8gaWNEOUNNX0NPREVfQ05BTUVcbi8vICAgb3JJX1RZUEUgLyBvcmlfdHlwZV9uYW1lICAgKFwiSUNcdTUzNjFcdThDQzdcdTY1OTlcIiAvIFwiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIpIFx1MjAxNCBvcmlnaW4sIE5PVCBcdTk1ODAvXHU2MDI1L1x1NEY0RlxuLy8gICBwYXJ0X0FNVCwgYXBwbF9ET1QsIFx1MjAyNiAgIChiaWxsaW5nIFx1MjAxNCBkaXNjYXJkZWQpXG4vLyAgIHJvV19JRCAgICAgICAgICAgICAgICAgIGRldGFpbCBrZXkgZm9yIElIS0UzMzAzUzAyIGZhbi1vdXQgKFBoYXNlIEIpXG4vLyBXZSBkb24ndCBoYXZlIHZpc2l0IGNsYXNzIChcdTk1ODAvXHU2MDI1L1x1NEY0RikgYXQgdGhlIGxpc3QgbGV2ZWw7IHRoZSBTMDIgZGV0YWlsXG4vLyBoYXMgaG9zcF9EQVRBX1RZUEVfTkFNRSAoXCJcdTg5N0ZcdTkxQUJcIi9cIlx1NEUyRFx1OTFBQlwiL1wiXHU3MjU5XHU5MUFCXCIpLiBGb3Igbm93IGRlZmF1bHQgQU1CLlxuLy9cbi8vIFBoYXJtYWN5IHBpY2t1cCBkZXRlY3Rpb24gXHUyMDE0IE5ISSBtaXhlcyBwaGFybWFjeSBkaXNwZW5zZSBldmVudHMgaW50b1xuLy8gSUhLRTMzMDMgYWxvbmdzaWRlIGNsaW5pYyB2aXNpdHMsIHdpdGggTk8gZmllbGQgaW4gdGhpcyBlbmRwb2ludCB0aGF0XG4vLyBkaXN0aW5ndWlzaGVzIHRoZW0gKG9ubHkgdGhlIHNhbWUgXCJJQ1x1NTM2MVx1OENDN1x1NjU5OVwiL1wiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIgc291cmNlIGxhYmVsXG4vLyBlaXRoZXIgdHlwZSB1c2VzKS4gV2l0aG91dCBpbnRlcnZlbnRpb24gU01BUlQgYXBwcyBzZWUgYW4gRW5jb3VudGVyXG4vLyBzaGFwZSBpZGVudGljYWwgdG8gY2xpbmljIHZpc2l0cyBhbmQgbXVzdCBndWVzcyBmcm9tIGhvc3BpdGFsIG5hbWUuXG4vLyBUd28gc2lnbmFscyBhdmFpbGFibGUsIGJvdGggMTAwJSBjb25jb3JkYW50IG9uIG9ic2VydmVkIGRhdGE6XG4vLyAgIFBSSU1BUlkgIG9wdGlvbnMucGhhcm1hY3k9dHJ1ZSBcdTIwMTQgY2FsbGVyIHByZS1idWlsdCBhIHNldCBvZiByb3dfSURzXG4vLyAgICAgICAgICAgIHRoYXQgYXBwZWFyZWQgaW4gSUhLRTMzMDYgLyBJSEtFMzMwNyB3aXRoIG9yaV9UWVBFX05BTUU9XG4vLyAgICAgICAgICAgIFwiXHU4NUU1XHU1QzQwXCIuIEF1dGhvcml0YXRpdmU6IHVzZXMgTkhJJ3Mgb3duIGNsYXNzaWZpY2F0aW9uLlxuLy8gICBGQUxMQkFDSyBob3NQX0FCQlIgbWF0Y2hlcyAvXHU4NUU1XHU1QzQwfFx1ODVFNVx1NjIzRi8gXHUyMDE0IGNvdmVycyBjYXNlcyB3aGVyZSB0aGVcbi8vICAgICAgICAgICAgY3Jvc3MtcmVmIHdhc24ndCBidWlsdCAobWVkaWNhdGlvbiBmYW4tb3V0IHVuYXZhaWxhYmxlIC9cbi8vICAgICAgICAgICAgc3RhbmRhbG9uZSB0ZXN0KSBhbmQgdGhlIGVkZ2UgY2FzZSBvZiBhIHBoYXJtYWN5IGV2ZW50XG4vLyAgICAgICAgICAgIHdpdGggbm8gYXNzb2NpYXRlZCBkcnVnIHJlY29yZC4gUmVsaWFibGUgaW4gcHJhY3RpY2Vcbi8vICAgICAgICAgICAgYmVjYXVzZSBUYWl3YW4gTkhJIHBoYXJtYWN5IGRlc2lnbmF0aW9ucyBhbHdheXMgaW5jbHVkZVxuLy8gICAgICAgICAgICBcdTg1RTVcdTVDNDAgb3IgXHU4NUU1XHU2MjNGIGluIHRoZWlyIG9mZmljaWFsIG5hbWUuXG4vLyBNYXJrcyBgdHlwZV9kaXNwbGF5ID0gXCJcdTg1RTVcdTVDNDBcImAgZm9yIHBoYXJtYWN5IHJvd3Mgc28gdGhlIG1hcHBlciBwcm9kdWNlc1xuLy8gRW5jb3VudGVyLnR5cGVbMF0udGV4dCA9IFwiXHU4NUU1XHU1QzQwXCI7IGRvd25zdHJlYW0gU01BUlQgYXBwcyBkZXRlY3QgdmlhXG4vLyB0ZXh0LmluY2x1ZGVzKCdcdTg1RTVcdTVDNDAnKSB3aXRob3V0IGZhbGxpbmcgYmFjayB0byBmcmFnaWxlIG5hbWUgaGV1cmlzdGljcy5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlKGl0ZW0sIGNsYXNzSGludCwgb3B0aW9ucykge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgaXRlbS5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIGlmICghZGF0ZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGljZENvZGUgPSBpdGVtLmljRDlDTV9DT0RFIHx8IGl0ZW0uaWNkOWNtX0NPREUgfHwgaXRlbS5pY2Q5Y21fY29kZSB8fCBcIlwiO1xuICAvLyBpY2Q5Y21fQ09ERV9DTkFNRSB3cmFwcyBlYWNoIGhhbGYgYXMgXCI8Y29kZT4vPHRleHQ+XCIgXHUyMDE0IHN0cmlwIHRoZVxuICAvLyBsZWFkaW5nIFwiPGNvZGU+L1wiIHNvIGRvd25zdHJlYW0gZG9lc24ndCBkb3VibGUtcHJpbnQgdGhlIGNvZGUgd2hlblxuICAvLyBpdCBjb21wb3NlcyBcIjxjb2RlPiA8dGV4dD5cIiBpdHNlbGYgKGNvc21ldGljOyBTTUFSVCBhcHAgc2lkZSByZWFkc1xuICAvLyAucmVhc29uQ29kZVswXS50ZXh0IGFuZCBzYXcgXCJJMzU5IEkzNTkvTm9ucmhldW1hdGljLi4uXCIgYmVmb3JlKS5cbiAgY29uc3Qgc3RyaXBJY2RQcmVmaXggPSAocykgPT4gcy5yZXBsYWNlKC9eW0EtWjAtOS5dK1xcL1xccyovLCBcIlwiKTtcbiAgY29uc3QgcmF3SWNkTmFtZSA9IGl0ZW0uaWNEOUNNX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9uYW1lIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBzdHJpcEljZFByZWZpeChwaWNrRW5nbGlzaChyYXdJY2ROYW1lKSk7XG4gIGNvbnN0IGljZE5hbWVfemggPSBzdHJpcEljZFByZWZpeChwaWNrQ2hpbmVzZShyYXdJY2ROYW1lKSk7XG4gIGNvbnN0IGhvc3BpdGFsID0gaXRlbS5ob3NQX0FCQlIgfHwgaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIjtcbiAgY29uc3QgaXNQaGFybWFjeSA9XG4gICAgKG9wdGlvbnMgJiYgb3B0aW9ucy5waGFybWFjeSA9PT0gdHJ1ZSkgfHwgL1x1ODVFNVx1NUM0MHxcdTg1RTVcdTYyM0YvLnRlc3QoaG9zcGl0YWwpO1xuICAvLyBjbGFzcyBkZWZhdWx0cyB0byBBTUI7IElIS0UzMzAzUzAyIGRldGFpbCBmYW4tb3V0IG1heSBvdmVycmlkZSB0b1xuICAvLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUgKFx1NjAyNVx1OEEzQSAvIFx1NEY0Rlx1OTY2MikuXG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBlbmRfZGF0ZTogXCJcIixcbiAgICBjbGFzczogY2xhc3NIaW50IHx8IFwiQU1CXCIsXG4gICAgLy8gRm9yIHBoYXJtYWN5OiBlbWl0IFwiXHU4NUU1XHU1QzQwXCIgc28gU01BUlQgYXBwcyBnZXQgYSBjbGVhciB2aXNpdC10eXBlXG4gICAgLy8gbWFya2VyLiBGb3IgZXZlcnl0aGluZyBlbHNlOiBrZWVwIHRoZSBOSEkgZGF0YS1zb3VyY2UgbGFiZWxcbiAgICAvLyAoSUNcdTUzNjFcdThDQzdcdTY1OTkgLyBcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTkpIFx1MjAxNCBoaXN0b3JpY2FsIGNvbnRyYWN0LCBzdGlsbCB1c2VmdWwgZm9yXG4gICAgLy8gY29uc3VtZXJzIHRoYXQgYWxyZWFkeSB3aXJlZCBhZ2FpbnN0IGl0LlxuICAgIHR5cGVfZGlzcGxheTogaXNQaGFybWFjeVxuICAgICAgPyBcIlx1ODVFNVx1NUM0MFwiXG4gICAgICA6IGl0ZW0ub3JpX3R5cGVfbmFtZSB8fCBpdGVtLm9ySV9UWVBFX05BTUUgfHwgXCJcIixcbiAgICBkZXBhcnRtZW50OiBcIlwiLFxuICAgIHByb3ZpZGVyOiBcIlwiLFxuICAgIC8vIEVuZ2xpc2ggcmVhc29uIChjbGluaWNhbCkgYW5kIENoaW5lc2UgcmVhc29uIChwYXRpZW50LWZhY2luZykgYXJlXG4gICAgLy8gc291cmNlZCBmcm9tIHRoZSBzYW1lIGJpbGluZ3VhbCBOSEkgZmllbGQ7IG1hcHBlciBwbGFjZXMgRW5nbGlzaFxuICAgIC8vIGludG8gcmVhc29uQ29kZVswXS5jb2RpbmdbMF0uZGlzcGxheSBhbmQgQ2hpbmVzZSBpbnRvIC50ZXh0LlxuICAgIHJlYXNvbjogaWNkTmFtZSA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lfWAgOiBpY2ROYW1lKSA6IFwiXCIsXG4gICAgcmVhc29uX3poOiBpY2ROYW1lX3poID8gKGljZENvZGUgPyBgJHtpY2RDb2RlfSAke2ljZE5hbWVfemh9YCA6IGljZE5hbWVfemgpIDogXCJcIixcbiAgICByZWFzb25fY29kZTogaWNkQ29kZSxcbiAgICBob3NwaXRhbCxcbiAgICAvLyBQYXNzIHRocm91Z2ggZm9yIHRoZSBldmVudHVhbCBJSEtFMzMwM1MwMiBkZXRhaWwgZmV0Y2ggKFBoYXNlIEIpLlxuICAgIHJvd19pZDogaXRlbS5yb1dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0QWxsZXJneShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGFsbGVyZ2VuID1cbiAgICBpdGVtLmFsbGVyZ2VuX25hbWUgfHwgaXRlbS5hbGxlUl9OQU1FIHx8IGl0ZW0ubWVkbmFtZSB8fFxuICAgIGl0ZW0uZHJ1R19OQU1FIHx8IGl0ZW0uYWxsZXJnZW4gfHwgXCJcIjtcbiAgaWYgKCFhbGxlcmdlbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5yZWNvckRfREFURSB8fCBcIlwiKSxcbiAgICBkaXNwbGF5OiBhbGxlcmdlbixcbiAgICBjYXRlZ29yeTogXCJtZWRpY2F0aW9uXCIsXG4gICAgY3JpdGljYWxpdHk6IFwidW5hYmxlLXRvLWFzc2Vzc1wiLFxuICAgIHJlYWN0aW9uOiBpdGVtLnJlYWN0aW9OIHx8IGl0ZW0uc3ltcHRvbSB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwMVMwNSAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBsaXN0KSBpcyBtZXRhZGF0YS1vbmx5OlxuLy8gICB7aG9zcF9pZCwgaG9zcF9hYmJyLCBob3NwX3VybCwgb3JpX3R5cGVfbmFtZSwgb3JpX3R5cGUsIGZ1bmNfZGF0ZSxcbi8vICAgIG91dF9kYXRlLCBpY2Q5Y21fY29kZSwgaWNkOWNtX2NvZGVfY25hbWUsIG9wX2NvZGVfY25hbWUsIHJvd19pZH1cbi8vIE5vIHByb2NlZHVyZSBDT0RFIChJQ0QtMTAtUENTKSBhbmQgbm8gYWN0dWFsIGV4YW0tZGF0ZS4gVGhlIHByb2NlZHVyZVxuLy8gQ09ERSArIGV4ZV9TX0RBVEUgb25seSBzaG93IHVwIG9uIHRoZSBJSEtFMzMwOFMwMiBkZXRhaWwgZW5kcG9pbnRcbi8vIChhbmFsb2dvdXMgdG8gSUhLRTM0MDhTMDEgaW1hZ2luZyBsaXN0IFx1MjE5MiBTMDIgZGV0YWlsKS4gV2UgZG8gYSAyLXN0ZXBcbi8vIGZhbi1vdXQgZnJvbSB0aGUgbGlzdCdzIHJvd19JRDsgdGhlIGxpc3QgYWRhcHRlciB0aGVyZWZvcmUgcmV0dXJuc1xuLy8gbnVsbCBhbmQgdGhlIHJlYWwgd29yayBoYXBwZW5zIGluIGFkYXB0UHJvY2VkdXJlRnJvbURldGFpbCBiZWxvdy5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFByb2NlZHVyZUxpc3RTdHViKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBJSEtFMzMwOFMwMiAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBkZXRhaWwpIHNoYXBlIChwZXIgcm93IGluIGloa2UzMzA4UzAyX21haW5fZGF0YSk6XG4vLyAgIHtyb3dpZCwgbWFpbl90aXQgKFwiMTA1LzA5LzIzIH4gMTA1LzA5LzI2XHVGRjVDXHU0RjRGXHU5NjYyXCIgb3IgXCIxMDUvMDEvMTRcdUZGNUNcdTk1ODBcdThBM0FcIiksXG4vLyAgICBob3NwX0lELCBob3NwX0FCQlIsIGhvc3BfdXJsLCBvcmlfVFlQRV9OQU1FLCBvcmlfVFlQRSxcbi8vICAgIGljZDljbV9DT0RFLCBpY2Q5Y21fQ09ERV9DTkFNRSwgICAgICAgICBcdTIxOTAgcmVhc29uIGZvciBwcm9jZWR1cmVcbi8vICAgIG9wX0NPREUsICAgIG9wX0NPREVfQ05BTUUsICAgICAgICAgICAgICBcdTIxOTAgSUNELTEwLVBDUyArIGJpbGluZ3VhbCBsYWJlbFxuLy8gICAgZnVuY19EQVRFLCBmdW5jX1NFUV9OTywgcGFydF9BTVQsIGFwcGxfRE9ULFxuLy8gICAgc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0OiBbe1xuLy8gICAgICAgZXhlX1NfREFURSAoXCJZWVkvTU0vRER8fFlZWVkvTU0vRERcIiksICBcdTIxOTAgYWN0dWFsIGV4ZWN1dGlvbiBkYXRlXG4vLyAgICAgICBvcmRlcl9DT0RFX05BTUUgKGJpbGluZ3VhbCksICAgICAgICAgICBcdTIxOTAgTkhJIGJpbGxpbmctaXRlbSBuYW1lXG4vLyAgICAgICBvcmRlcl9DT0RFLCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTIxOTAgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQ1xuLy8gICAgfSwgLi4uXX1cbi8vXG4vLyBEYXRlIGZpZWxkIGNob2ljZSBcdTIwMTQgSUhLRTMzMDhTMDIgZGV0YWlsIGV4cG9zZXM6XG4vLyAgIC0gc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0W10uZXhlX1NfREFURSBcdTIwMTQgXHU1N0Y3XHU4ODRDXHU4RDc3XHU1OUNCXHU2NUU1OyB0aGlzIGlzIHRoZVxuLy8gICAgICAgICAgICAgICAgICAgICAgYWN0dWFsIGRheSB0aGUgcGF0aWVudCBoYWQgdGhlIHByb2NlZHVyZS4gRm9yXG4vLyAgICAgICAgICAgICAgICAgICAgICBpbnBhdGllbnQgcHJvY2VkdXJlcyAoYWRtaXQgTS8wMSwgc3VyZ2VyeSBNLzA1LFxuLy8gICAgICAgICAgICAgICAgICAgICAgZGlzY2hhcmdlIE0vMTApIGV4ZV9TX0RBVEUgPSBNLzA1IFx1MjAxNCBjb3JyZWN0LlxuLy8gICAtIGZ1bmNfREFURSAgICAgICBcdTIwMTQgb3JkZXIvdmlzaXQgYW5jaG9yIGRheSAoXHU5NTgwXHU4QTNBXHU5NThCXHU1NUFFXHU2NUU1IC8gXHU1MTY1XHU5NjYyXHU2NUU1KTtcbi8vICAgICAgICAgICAgICAgICAgICAgIHNhbWUgd3JvbmctYW5jaG9yIHBhdHRlcm4gYXMgaW1hZ2luZyBcdTIwMTQgdXNpbmcgaXRcbi8vICAgICAgICAgICAgICAgICAgICAgIGZvciBpbnBhdGllbnQgcHJvY2VkdXJlcyBzaGlmdHMgdGhlIGV4YW0gYmFja1xuLy8gICAgICAgICAgICAgICAgICAgICAgdG8gdGhlIGFkbWlzc2lvbiBkYXkuXG4vLyBGYWxsYmFjayBjaGFpbjogZmlyc3Qgc3ViLWxpc3QgZW50cnkncyBleGVfU19EQVRFIFx1MjE5MiBmdW5jX0RBVEUuXG4vL1xuLy8gRkhJUiBjb2Rpbmcgc3RyYXRlZ3k6XG4vLyAgIC0gUHJvY2VkdXJlLmNvZGUgY29kaW5nIHVzZXMgb3BfQ09ERSAoSUNELTEwLVBDUykgYXMgdGhlIHByaW1hcnlcbi8vICAgICBjb2RlZCB2YWx1ZSB3aXRoIHN5c3RlbT1pY2QtMTAtcGNzIFx1MjAxNCB3YXMgcHJldmlvdXNseSB0aGUgZW1wdHlcbi8vICAgICBzdHJpbmcgYmVjYXVzZSB0aGUgbGlzdCBlbmRwb2ludCBuZXZlciBjYXJyaWVzIGl0LlxuLy8gICAtIGljZDljbV9DT0RFICsgQ05BTUUgbWFwIHRvIGEgUmVhc29uOiBwcmVmaXggaW4gdGhlIG5vdGUgKHNhbWVcbi8vICAgICBwYXR0ZXJuIHRoZSBvbGQgYWRhcHRlciB1c2VkKSBzbyB0aGUgbWFwcGVyJ3MgXCJubyBub3RlIFx1MjE5MiBkcm9wXCJcbi8vICAgICBmaWx0ZXIga2VlcHMgYmVuaWduIHJvd3Mgb3V0IHdoaWxlIGxldHRpbmcgZ2VudWluZSBwcm9jZWR1cmVzXG4vLyAgICAgcGFzcy5cbi8vICAgLSBTdWItbGlzdCBlbnRyaWVzJyBvcmRlcl9DT0RFX05BTUUgKyBvcmRlcl9DT0RFIGdvIGludG8gdGhlIG5vdGVcbi8vICAgICBhcyBcdTY1QkRcdTRGNUM6IGxpbmVzIHNvIFNNQVJUIGFwcHMgY2FuIHNob3cgdGhlIE5ISSBiaWxsaW5nIGJyZWFrZG93bi5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdFByb2NlZHVyZUZyb21EZXRhaWwoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBzdWJMaXN0ID0gQXJyYXkuaXNBcnJheShpdGVtLnNwX0lIS0UzMzA4UzA0X2RhdGFfbGlzdClcbiAgICA/IGl0ZW0uc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0XG4gICAgOiBbXTtcbiAgLy8gZXhlX1NfREFURSBmb3JtYXQgaXMgXCIxMTUvMDkvMjN8fDIwMjYvMDkvMjNcIjsgcm9jVG9JU08gYWxyZWFkeVxuICAvLyBtYXRjaGVzIHRoZSBmaXJzdCBST0Mgc2VnbWVudCwgc28gZmVlZGluZyB0aGUgd2hvbGUgc3RyaW5nIHdvcmtzLlxuICBjb25zdCBleGVEYXRlID0gc3ViTGlzdC5sZW5ndGggPiAwXG4gICAgPyAoc3ViTGlzdFswXS5leGVfU19EQVRFIHx8IHN1Ykxpc3RbMF0uZXhlX3NfZGF0ZSB8fCBcIlwiKVxuICAgIDogXCJcIjtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGV4ZURhdGUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgaXRlbS5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIC8vIG9wX0NPREVfQ05BTUUgaXMgXCI8Q09ERT4vPFx1NEUyRFx1NjU4Nz58fDxDT0RFPi88RW5nbGlzaD5cIi4gVGFrZSB0aGVcbiAgLy8gRW5nbGlzaCBoYWxmLCBzdHJpcCB0aGUgbGVhZGluZyBcIjxDT0RFPi9cIiBzbyB0aGUgZGlzcGxheSByZWFkc1xuICAvLyBsaWtlIFwiRXhjaXNpb24gb2YgTGVmdCBWaXRyZW91cywgUGVyY3V0YW5lb3VzIEFwcHJvYWNoXCIgcmF0aGVyXG4gIC8vIHRoYW4gXCIwOEI1M1paL0V4Y2lzaW9uIG9mIExlZnQgVml0cmVvdXNcdTIwMjZcIi5cbiAgY29uc3Qgb3BDb2RlID0gaXRlbS5vcF9DT0RFIHx8IGl0ZW0ub3BfY29kZSB8fCBcIlwiO1xuICBjb25zdCByYXdPcE5hbWUgPSBpdGVtLm9wX0NPREVfQ05BTUUgfHwgaXRlbS5vcF9jb2RlX2NuYW1lIHx8IFwiXCI7XG4gIGNvbnN0IG9wTmFtZSA9IHBpY2tFbmdsaXNoKHJhd09wTmFtZSk7XG4gIGNvbnN0IG9wTmFtZV96aCA9IHBpY2tDaGluZXNlKHJhd09wTmFtZSk7XG4gIGNvbnN0IHN0cmlwQ29kZSA9IChzKSA9PiAocyB8fCBcIlwiKS5yZXBsYWNlKC9eW0EtWjAtOV0rXFwvLywgXCJcIikudHJpbSgpO1xuICBjb25zdCBkaXNwbGF5ID0gc3RyaXBDb2RlKG9wTmFtZSkgfHwgb3BOYW1lLnRyaW0oKTtcbiAgY29uc3QgZGlzcGxheV96aCA9IHN0cmlwQ29kZShvcE5hbWVfemgpO1xuICBpZiAoIWRhdGUgfHwgIWRpc3BsYXkpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHJlYXNvbkNvZGUgPSBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgcmVhc29uTmFtZSA9XG4gICAgKHBpY2tFbmdsaXNoKGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fY29kZV9jbmFtZSB8fCBcIlwiKSB8fCBcIlwiKVxuICAgICAgLnJlcGxhY2UoL15bQS1aMC05XStcXC8vLCBcIlwiKVxuICAgICAgLnRyaW0oKTtcbiAgY29uc3Qgbm90ZVBhcnRzID0gW107XG4gIGlmIChyZWFzb25OYW1lKSB7XG4gICAgbm90ZVBhcnRzLnB1c2gocmVhc29uQ29kZSA/IGBSZWFzb246ICR7cmVhc29uQ29kZX0gJHtyZWFzb25OYW1lfWAgOiBgUmVhc29uOiAke3JlYXNvbk5hbWV9YCk7XG4gIH1cbiAgZm9yIChjb25zdCBzdWIgb2Ygc3ViTGlzdCkge1xuICAgIGNvbnN0IHN1Yk5hbWUgPSBwaWNrRW5nbGlzaChzdWIub3JkZXJfQ09ERV9OQU1FIHx8IHN1Yi5vcmRlcl9jb2RlX25hbWUgfHwgXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHN1YkNvZGUgPSBzdWIub3JkZXJfQ09ERSB8fCBzdWIub3JkZXJfY29kZSB8fCBcIlwiO1xuICAgIGlmIChzdWJOYW1lKSB7XG4gICAgICBub3RlUGFydHMucHVzaChzdWJDb2RlID8gYFx1NjVCRFx1NEY1QzogJHtzdWJOYW1lfSAoTkhJICR7c3ViQ29kZX0pYCA6IGBcdTY1QkRcdTRGNUM6ICR7c3ViTmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogb3BDb2RlLFxuICAgIC8vIEhpbnQgZm9yIG1hcFByb2NlZHVyZS5tYXBTeXN0ZW0gXHUyMDE0IFwiaWNkLTEwLXBjc1wiIHN0cmluZyBjb250YWluc1xuICAgIC8vIFwiaWNkXCIsIHNvIHRoZSBtYXBwZXIgYXNzaWducyBzeXN0ZW1zLklDRF8xMF9QQ1MuXG4gICAgc3lzdGVtOiBvcENvZGUgPyBcImljZC0xMC1wY3NcIiA6IFwiXCIsXG4gICAgZGlzcGxheSxcbiAgICBkaXNwbGF5X3poLFxuICAgIG5vdGU6IG5vdGVQYXJ0cy5qb2luKFwiIC8gXCIpLFxuICAgIGJvZHlfc2l0ZTogXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTM0MDhTMDEgKFx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNSBsaXN0KSBzaGFwZTpcbi8vICAge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIHJlYWxfSU5TUEVDVF9EQVRFLCBvcmRlcl9DT0RFLFxuLy8gICAgb3JkZXJfQ09ERV8yV29yZCwgb3JkZXJfTkFNRSwgb3JpX1RZUEUsIHJvd19JRCwganBHX1NUQVRVUywgLi4ufVxuLy8gTm8gZmluZGluZ3MvY29uY2x1c2lvbiBcdTIwMTQgbGlzdCBpcyBvcmRlci1sZXZlbCBvbmx5LiBXZSBtYXAgdG8gUHJvY2VkdXJlXG4vLyAoYW4gZXhhbSB3YXMgcGVyZm9ybWVkKSByYXRoZXIgdGhhbiBEaWFnbm9zdGljUmVwb3J0ICh3aGljaCBuZWVkcyBhXG4vLyBuYXJyYXRpdmUpLiBJZi93aGVuIHdlIGZldGNoIHRoZSBhY3R1YWwgcmVwb3J0IHRoaXMgYmVjb21lcyBhIERSLlxuLy8gSUhLRTM0MDhTMDIgZGV0YWlsIHByb3ZpZGVzIHRoZSBmdWxsIHJhZGlvbG9neSAvIGVuZG9zY29weSByZXBvcnQgaW5cbi8vIGBkZXNjYC4gQ29tYmluZWQgd2l0aCBvcmRlcl9OQU1FICsgdGhlIGV4YW0gZGF0ZSB0aGlzIGlzIGEgcHJvcGVyIEZISVJcbi8vIERpYWdub3N0aWNSZXBvcnQuIExpc3Qtb25seSBlbnRyaWVzICh3aGVyZSB0aGUgZGV0YWlsIGZldGNoIHJldHVybmVkXG4vLyBubyBgZGVzY2ApIGdldCBkcm9wcGVkIFx1MjAxNCB3aXRob3V0IGEgbmFycmF0aXZlIHRoZSByZXBvcnQgbWFwcGVyIHdvdWxkXG4vLyByZWplY3QgdGhlbSBhbnl3YXkuXG4vL1xuLy8gRGF0ZSBmaWVsZCBjaG9pY2UgXHUyMDE0IElIS0UzNDA4UzAyIGRldGFpbCBwYXlsb2FkIGV4cG9zZXMgKGluIG9yZGVyXG4vLyBvZiBhY2N1cmFjeSBmb3IgXCJ3aGVuIGRpZCB0aGUgcGF0aWVudCBhY3R1YWxseSBoYXZlIHRoZSBleGFtXCIpOlxuLy8gICAtIHJlYWxfSU5TUEVDVF9EQVRFICBcdTVCRTZcdTk2OUJcdTYzQTFcdTZBQTIvXHU1MDVBXHU1RjcxXHU1MENGXHU2NUU1IFx1MjAxNCBtb3N0IGFjY3VyYXRlIGJ1dCBOSElcbi8vICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9ubHkgc2hpcHMgdGhpcyBhcyBudWxsIG9uIFMwMiBkZXRhaWxcbi8vICAgLSBtYWluX3RpdCAgICAgICAgICAgXHU3QzNEXHU2NTM2XHU2NUU1IFx1MjAxNCB0aGUgY2FyZCdzIHByb21pbmVudCBoZWFkZXIgZGF0ZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICBpbiBOSEkncyBvd24gVUkuIFNlbWFudGljYWxseSB0aGlzIGlzIHdoZW5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV4YW0gd2FzIHBlcmZvcm1lZCBhbmQgc2lnbmVkIG9mZiAoTk9UXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBvcmRlciBkYXkpLiBDbG9zZXN0IHByb3h5IHdoZW5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgcmVhbF9JTlNQRUNUX0RBVEUgaXMgbnVsbC5cbi8vICAgLSBmdW5jX0RBVEUgICAgICAgICAgXHU5NTgwXHU4QTNBXHU5NThCXHU1NUFFXHU2NUU1IChPUEQpIC8gXHU1MTY1XHU5NjYyXHU2NUU1IChpbnBhdGllbnQpIFx1MjAxNCB0aGVcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZSB0aGUgb3JkZXIgd2FzIHdyaXR0ZW4sIE5PVCB0aGUgZGF0ZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXhhbSBoYXBwZW5lZC4gRm9yIE9QRCBpbWFnaW5nIHRoYXQgaXNcbi8vICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVkIGxhdGVyIChlLmcuIGVjaG8gb3JkZXJlZCAxLzMxLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBkb25lIDIvMjkpIHVzaW5nIGZ1bmNfREFURSBzaGlmdHMgdGhlIGV4YW1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgYmFjayB0byB0aGUgb3JkZXIgZGF5IFx1MjAxNCB3cm9uZy5cbi8vICAgLSBhc3NheV9VUExPQURfREFURSAgTkhJIFx1NjUzNlx1NkE5NFx1NjY0Mlx1OTU5MyBcdTIwMTQgaW50ZXJuYWwgZGF0YS1waXBlbGluZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA7IGJlbG9uZ3MgdG8gRGlhZ25vc3RpY1JlcG9ydC5pc3N1ZWQuXG4vLyBGYWxsYmFjayBjaGFpbjogcmVhbF9JTlNQRUNUX0RBVEUgXHUyMTkyIG1haW5fdGl0IFx1MjE5MiBmdW5jX0RBVEUuIG1haW5fdGl0XG4vLyBnb2VzIGFib3ZlIGZ1bmNfREFURSBiZWNhdXNlIG1haW5fdGl0IElTIHdoYXQgTkhJIGl0c2VsZiBkaXNwbGF5c1xuLy8gdG8gdGhlIHBhdGllbnQgYXMgXCJ0aGlzIHJlcG9ydCdzIGRhdGVcIiBhbmQgcmVmbGVjdHMgdGhlIHNpZ24tb2ZmIC9cbi8vIGV4YW0gZGF5LiBmdW5jX0RBVEUgcmVtYWlucyBhcyBsYXN0IHJlc29ydCBzbyBhIG1hbGZvcm1lZCByb3dcbi8vIHdpdGhvdXQgbWFpbl90aXQgc3RpbGwgcHJvZHVjZXMgc29tZSBkYXRlIGluc3RlYWQgb2YgYmVpbmcgZHJvcHBlZC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKFxuICAgIGl0ZW0ucmVhbF9JTlNQRUNUX0RBVEUgfHwgaXRlbS5yZWFsX2luc3BlY3RfZGF0ZSB8fFxuICAgIGl0ZW0ubWFpbl90aXQgfHwgaXRlbS5tYWluX1RJVCB8fFxuICAgIGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIsXG4gICk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChpdGVtLm9yZGVyX05BTUUgfHwgaXRlbS5vcmRlcl9uYW1lIHx8IFwiXCIpO1xuICBjb25zdCBjb25jbHVzaW9uID0gKGl0ZW0uZGVzYyB8fCBcIlwiKS50cmltKCk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSB8fCAhY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBpdGVtLm9yZGVyX0NPREUgfHwgaXRlbS5vcmRlcl9jb2RlIHx8IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgY2F0ZWdvcnk6IFwiUkFEXCIsXG4gICAgY29uY2x1c2lvbixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAvLyBOSEkgc2VwYXJhdGVzIHRoZSBleGFtIGRhdGUgKGZ1bmNfREFURSkgZnJvbSB0aGUgcmVwb3J0LXVwbG9hZFxuICAgIC8vIHRpbWVzdGFtcCAoYXNzYXlfVVBMT0FEX0RBVEUpLiBUaGUgbGF0dGVyIGlzIHdoZW4gdGhlIHJlcG9ydFxuICAgIC8vIHdhcyBmaW5hbGlzZWQgaW4gTkhJJ3Mgc3lzdGVtIFx1MjAxNCBtYXBzIHRvIERpYWdub3N0aWNSZXBvcnQuaXNzdWVkLlxuICAgIC8vIEZhbGxzIGJhY2sgdG8gTm9uZSBpZiBOSEkgZGlkbid0IHNoaXAgb25lLlxuICAgIGlzc3VlZDogcm9jVG9JU08oKGl0ZW0uYXNzYXlfVVBMT0FEX0RBVEUgfHwgXCJcIikuc3BsaXQoL1xccysvKVswXSksXG4gIH07XG59XG4iLCAiLy8gTkhJIEFQSSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgd2hhdCB3ZSBmZXRjaCwgd2hlcmUgZWFjaCByb3cgZ29lcyxcbi8vIHdoaWNoIGFkYXB0ZXIgdG8gY2FsbCBvbiBpdC5cbi8vXG4vLyBFeHRyYWN0ZWQgZnJvbSBiYWNrZ3JvdW5kLmpzIHNvIHdlIGNhbjpcbi8vICAgMS4gVW5pdC10ZXN0IFwiZXZlcnkgZW5kcG9pbnQgbmFtZSBoYXMgYSBDaGluZXNlIGxhYmVsXCIgXHUyMDE0IGhpc3RvcmljYWxseVxuLy8gICAgICBpdCB3YXMgZWFzeSB0byBhZGQgYSBuZXcgZW5kcG9pbnQgYW5kIGZvcmdldCB0byB1cGRhdGVcbi8vICAgICAgRU5EUE9JTlRfTEFCRUxfWkgsIGxlYXZpbmcgdGhlIHBvcHVwJ3MgXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwIHJvdyBsYWJlbGxlZCB3aXRoXG4vLyAgICAgIHRoZSBkZXYtZmxhdm91cmVkIHJhdyBrZXkgKFwib3RoZXJfbGFic1wiIGluc3RlYWQgb2YgXCJcdTZBQTJcdTlBNTdcIikuXG4vLyAgIDIuIEtlZXAgYmFja2dyb3VuZC5qcyBmb2N1c2VkIG9uIGZsb3cgY29udHJvbCArIHRhYi9JTyBsb2dpYy5cbi8vXG4vLyBBZGFwdGVyIHJlZmVyZW5jZXMgbGl2ZSBpbiAuL25oaS1hZGFwdGVycy5qcy4gU2VlIHRoYXQgbW9kdWxlIGZvciB0aGVcbi8vIHBlci1hZGFwdGVyIGZpZWxkLXByaW9yaXR5IGRlY2lzaW9ucyAoZGF0ZSBzZWxlY3Rpb24sIG5hbWUgZmFsbGJhY2tzLFxuLy8gYmlsaW5ndWFsIHNwbGl0dGluZywgZXRjLikuXG5cbmltcG9ydCB7XG4gIGFkYXB0QWR1bHRQcmV2ZW50aXZlLFxuICBhZGFwdEFsbGVyZ3ksXG4gIGFkYXB0Q2F0YXN0cm9waGljSWxsbmVzcyxcbiAgYWRhcHRDaHJvbmljTGlzdFN0dWIsXG4gIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsXG4gIGFkYXB0SW1hZ2luZ0xpc3RTdHViLFxuICBhZGFwdElucGF0aWVudEVuY291bnRlcixcbiAgYWRhcHRMYWJJdGVtLFxuICBhZGFwdE1lZGljYXRpb24sXG4gIGFkYXB0UHJvY2VkdXJlTGlzdFN0dWIsXG59IGZyb20gXCIuL25oaS1hZGFwdGVycy5qc1wiO1xuXG4vLyBVc2VyLWZhY2luZyBsYWJlbCBmb3IgZWFjaCBlbmRwb2ludCBuYW1lLiBUaGUgYnJlYWtkb3duIGNvbGxhcHNpYmxlXG4vLyBpbiB0aGUgcG9wdXAgKFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIpIHJlYWRzIGZyb20gdGhpcyBzbyB1c2VycyBzZWUgXCJcdTVDMzFcdTkxQUIgMTIgXHU3QjQ2XCJcbi8vIGluc3RlYWQgb2YgdGhlIGRldi1mbGF2b3VyZWQgXCJlbmNvdW50ZXJzPTEyLzEyXCIuIFVua25vd24gbmFtZXMgZmFsbFxuLy8gdGhyb3VnaCB0byB0aGUgcmF3IGtleSwgd2hpY2gga2VlcHMgaXQgb2J2aW91cyBkdXJpbmcgZGV2ZWxvcG1lbnRcbi8vIHdoZW4gd2UgYWRkIGEgbmV3IGVuZHBvaW50IGFuZCBoYXZlbid0IGxhYmVsbGVkIGl0IHlldC5cbmV4cG9ydCBjb25zdCBFTkRQT0lOVF9MQUJFTF9aSCA9IHtcbiAgZW5jb3VudGVyczogXCJcdTVDMzFcdTkxQUJcIixcbiAgaW5wYXRpZW50OiBcIlx1NEY0Rlx1OTY2MlwiLFxuICBpbnBhdGllbnRfbGVnYWN5OiBcIlx1NEY0Rlx1OTY2Mlx1RkYwOFx1ODIwQVx1RkYwOVwiLFxuICBwcm9jZWR1cmVzOiBcIlx1NjI0Qlx1ODg1MyAvIFx1ODY1NVx1N0Y2RVwiLFxuICBtZWRpY2F0aW9uczogXCJcdTg2NTVcdTY1QjlcdTg1RTVcdTU0QzFcIixcbiAgY2hyb25pY19wcmVzY3JpcHRpb25zOiBcIlx1NjE2Mlx1NjAyN1x1ODY1NVx1NjVCOVx1N0I4QlwiLFxuICBhbGxlcmdpZXM6IFwiXHU4NUU1XHU3MjY5XHU5MDRFXHU2NTRGXCIsXG4gIGFsbGVyZ2llc19iOiBcIlx1ODVFNVx1NzI2OVx1OTA0RVx1NjU0Rlx1RkYwOEJcdUZGMDlcIixcbiAgYWR1bHRfcHJldmVudGl2ZTogXCJcdTYyMTBcdTRFQkFcdTUwNjVcdTZBQTJcIixcbiAgY2FuY2VyX3NjcmVlbmluZzogXCJcdTc2NENcdTc1QzdcdTdCRTlcdTZBQTJcIixcbiAgaW1hZ2luZzogXCJcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTVcIixcbiAgb3RoZXJfbGFiczogXCJcdTZBQTJcdTlBNTdcIixcbiAgY2F0YXN0cm9waGljX2lsbG5lc3M6IFwiXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1XCIsXG59O1xuXG4vLyBwYWdlX3R5cGUgXHUyMTkyIGJhY2tlbmQgcGFnZV90eXBlIHN0cmluZyB1c2VkIGJ5IG1hcHBlcnMuXG4vLyBwYXRoIGlzIHJlbGF0aXZlIHRvIG5oaUJhc2UuIG1ldGhvZCBkZWZhdWx0IFwiR0VUXCIuXG4vLyBgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWVgID0gZW5kcG9pbnQgYWNjZXB0cyBzX2RhdGUgLyBlX2RhdGUgaW4gXHU2QzExXHU1NzBCIGZvcm1hdC5cbi8vIENvbmZpcm1lZCB2aWEgVVJMcyBvYnNlcnZlZCBpbiBOSEkncyBTUEEuIE90aGVyIGVuZHBvaW50cyBlaXRoZXIgZG9uJ3Rcbi8vIGFjY2VwdCByYW5nZSBwYXJhbXMsIG9yIE5ISSByZWplY3RzIHVua25vd24gcGFyYW1zIFx1MjAxNCB3ZSBsZWF2ZSB0aGVtIGFsb25lXG4vLyAodGhleSBmYWxsIGJhY2sgdG8gdGhlaXIgZGVmYXVsdCB3aW5kb3csIHR5cGljYWxseSAxLTIgeWVhcnMpLlxuZXhwb3J0IGNvbnN0IE5ISV9BUElfRU5EUE9JTlRTID0gW1xuICAvLyBlbmNvdW50ZXJzIC8gcHJvY2VkdXJlcyBkb24ndCBoYXZlIGEgL3NlYXJjaCB2YXJpYW50ICg0MDQpLiBwYWdlX2xvYWRcbiAgLy8gc2lsZW50bHkgaWdub3JlcyBzX2RhdGUgLyBlX2RhdGUgXHUyMDE0IHZlcmlmaWVkIHRoZSBhcnJheSBsZW5ndGggaXNcbiAgLy8gaWRlbnRpY2FsIHdpdGggb3Igd2l0aG91dCBkYXRlcy4gRGF0ZSBmaWx0ZXIgaXMgZWZmZWN0aXZlbHkgdW5zdXBwb3J0ZWRcbiAgLy8gZm9yIHRoZXNlIGVuZHBvaW50czsgdGhleSByZXR1cm4gYWxsIGRhdGEgaW4gTkhJJ3MgbGlmZXRpbWUgd2luZG93LlxuICAvLyBFbmNvdW50ZXIgc291cmNlOiBJSEtFMzMwM1MwMSAoXHU5MUFCXHU3NjQyXHU4Q0JCXHU3NTI4XHU3NTMzXHU1ODMxKS4gVGhlIC9wYWdlX2xvYWQgdmFyaWFudFxuICAvLyBpcyB3aW5kb3ctbGltaXRlZCB0byB+MSB5ZWFyIChyZXR1cm5lZCA1MSB2aXNpdHMgZW5kaW5nIDExNC8wNSk7XG4gIC8vIC9zZWFyY2ggYWNjZXB0cyBzX2RhdGUgLyBlX2RhdGUgYW5kIGdvZXMgYmFjayBmdXJ0aGVyICgxNjIgdmlzaXRzXG4gIC8vIHRvIDExMi8wNSBmb3IgdGhlIHNhbWUgcGF0aWVudCkuIFNpbmNlIGxhYnMvbWVkcyBleHRlbmQgdG8gM3kgdmlhXG4gIC8vIHRoZWlyIG93biAvc2VhcmNoIGVuZHBvaW50cywgZW5jb3VudGVyIE1VU1QgYWxzbyB1c2UgL3NlYXJjaCBvclxuICAvLyB0aGUgKGhvc3BpdGFsLCBkYXRlKSBsaW5rZXIgaGFzIG5vdGhpbmcgdG8gbWF0Y2ggYWdhaW5zdCBmb3Igb2xkZXJcbiAgLy8gbGFiIGRhdGVzLlxuICB7IG5hbWU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDNzMDEvc2VhcmNoP3NfZGF0ZT0mZV9kYXRlPVwiLFxuICAgIHBhZ2VfdHlwZTogXCJlbmNvdW50ZXJzXCIsICAgICAgICBhZGFwdDogYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbiAgLy8gSW5wYXRpZW50IChcdTRGNEZcdTk2NjIpIFx1MjAxNCBJSEtFMzMwOVMwMSBpcyB0aGUgcHJpbWFyeSBsaXN0IHdpdGggaW5fREFURS9vdXRfREFURVxuICAvLyBzcGFuLiBJSEtFMzMwOFMwMSBjYXJyaWVzIGEgc21hbGwgc2V0IG9mIG9sZGVyIFx1NEY0Rlx1OTY2MiByZWNvcmRzIHdpdGggdGhlXG4gIC8vIHNhbWUgZmllbGRzIChmdW5jX0RBVEUgaW4gc29tZSByb3dzIGluc3RlYWQgb2YgaW5fREFURTsgYWRhcHRlclxuICAvLyBoYW5kbGVzIGJvdGgpLiBCb3RoIGZlZWQgdGhlIHNhbWUgZW5jb3VudGVyIG1hcHBlci5cbiAgeyBuYW1lOiBcImlucGF0aWVudFwiLCAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA5czAxL3BhZ2VfbG9hZFwiLFxuICAgIHBhZ2VfdHlwZTogXCJlbmNvdW50ZXJzXCIsICAgICAgICBhZGFwdDogYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIgfSxcbiAgeyBuYW1lOiBcImlucGF0aWVudF9sZWdhY3lcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA4czAxL3BhZ2VfbG9hZFwiLFxuICAgIHBhZ2VfdHlwZTogXCJlbmNvdW50ZXJzXCIsICAgICAgICBhZGFwdDogYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIgfSxcbiAgLy8gUHJvY2VkdXJlcyAoSUhLRTMzMDFTMDUpIGxpc3Qgb25seSBoYXMgb3JkZXItbGV2ZWwgbWV0YWRhdGEgXHUyMDE0XG4gIC8vIG5vIElDRC0xMC1QQ1MgY29kZSBhbmQgbm8gYWN0dWFsIHBlcmZvcm1lZC1kYXRlLiBUaGUgZnVsbFxuICAvLyByZWNvcmQgbGl2ZXMgYXQgSUhLRTMzMDhTMDIgKHN1Yi1saXN0IGNhcnJpZXMgZXhlX1NfREFURSArXG4gIC8vIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgcGVyIGV4ZWN1dGlvbikuIFNhbWUgMi1zdGVwIGZhbi1vdXQgcGF0dGVybiBhc1xuICAvLyBpbWFnaW5nOyBzZWUgX2ZldGNoUHJvY2VkdXJlRGV0YWlsc0luVGFiLlxuICB7IG5hbWU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDFzMDUvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcInByb2NlZHVyZXNcIiwgICAgICAgIGFkYXB0OiBhZGFwdFByb2NlZHVyZUxpc3RTdHViIH0sXG4gIC8vIG1lZGljYXRpb25zOiBwYWdlX2xvYWQgb25seSBhY2NlcHRzIGVtcHR5IGRhdGVzIChIVFRQIDQwMCBvdGhlcndpc2UpLlxuICAvLyBUaGUgL3NlYXJjaCBlbmRwb2ludCBpcyB3aGF0IHRoZSBTUEEgaGl0cyB3aGVuIHVzZXIgcGlja3MgYSBjdXN0b21cbiAgLy8gZGF0ZSByYW5nZSBhbmQgYWNjZXB0cyBJU08gXHU4OTdGXHU1MTQzIGRhdGVzIHdpdGggZGFzaGVzICgyMDIzLTAxLTAxKS5cbiAgLy8gQ29uZmlybWVkIHZpYSBEZXZUb29scyBvYnNlcnZhdGlvbiBvZiB0aGUgXHU3QkU5XHU5MDc4IHBhbmVsIHN1Ym1pdC5cbiAgeyBuYW1lOiBcIm1lZGljYXRpb25zXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA2czAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExJnNfdHlwZT1BXCIsXG4gICAgcGFnZV90eXBlOiBcIm1lZGljYXRpb25zXCIsICAgICAgIGFkYXB0OiBhZGFwdE1lZGljYXRpb24sIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIFx1NjE2Mlx1NjAyN1x1ODY1NVx1NjVCOVx1N0I4QiAocmVmaWxsPVwiWVwiKSBcdTIwMTQgc2VwYXJhdGUgbGlzdCBlbmRwb2ludCBmcm9tIG1lZGljYXRpb25zLlxuICAvLyB+NTIgb2YgMTI2IGVudHJpZXMgb3ZlcmxhcCB3aXRoIElIS0UzMzA2UzAxOyB0aGUgcmVzdCBhcmVcbiAgLy8gY2hyb25pYy1vbmx5IGFuZCB3b3VsZCBiZSBtaXNzZWQgaWYgd2UgcmVsaWVkIG9uIHJlZ3VsYXIgbGlzdCBhbG9uZS5cbiAgLy8gVGhlIGNocm9uaWMgZGV0YWlsIGZhbi1vdXQgcnVucyBCRUZPUkUgdGhlIG1lZGljYXRpb24gZmFuLW91dCBhbmRcbiAgLy8gaXRzIHJvd19JRHMgYXJlIHBhc3NlZCB0byB0aGUgbWVkaWNhdGlvbiBmYW4tb3V0IGFzIHNraXAtc2V0IHNvXG4gIC8vIGVhY2ggcm93IGlzIGZldGNoZWQgb25jZS4gU2VlIF9mZXRjaENocm9uaWNNZWRpY2F0aW9uRGV0YWlsc0luVGFiXG4gIC8vIGluIGJhY2tncm91bmQuanMuIERldGFpbCBlbmRwb2ludCBpcyB0aGUgc2FtZSBJSEtFMzMwNlMwMiBhc1xuICAvLyByZWd1bGFyIG1lZHM7IGN0eXBlIG11c3QgZXF1YWwgdGhlIGxpc3Qgcm93J3Mgb3JpX1RZUEUgKDE9XHU5NTgwXHU4QTNBLFxuICAvLyAyPUlDXHU1MzYxLCA4PVx1ODVFNVx1NUM0MCksIG5vdCBoYXJkY29kZWQgdG8gOC5cbiAgeyBuYW1lOiBcImNocm9uaWNfcHJlc2NyaXB0aW9uc1wiLCBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvSUhLRTMzMDdTMDEvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcIm1lZGljYXRpb25zXCIsICAgICAgIGFkYXB0OiBhZGFwdENocm9uaWNMaXN0U3R1YiB9LFxuICB7IG5hbWU6IFwiYWxsZXJnaWVzXCIsICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMyMDJzMDEvU1BfSUhLRTMyMDJTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwiYWxsZXJnaWVzXCIsICAgICAgICAgYWRhcHQ6IGFkYXB0QWxsZXJneSB9LFxuICB7IG5hbWU6IFwiYWxsZXJnaWVzX2JcIiwgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMyMDJzMDEvU1BfSUhLRTMyMDJTMDRcIixcbiAgICBwYWdlX3R5cGU6IFwiYWxsZXJnaWVzXCIsICAgICAgICAgYWRhcHQ6IGFkYXB0QWxsZXJneSB9LFxuICAvLyBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjVcdTdENTBcdTY3OUMgKElIS0UzNDAyUzAxKTogb25lIHJvdyBwZXIgc2NyZWVuaW5nLCBjb250YWluc1xuICAvLyBCTUkgLyB2aXRhbHMgLyBsaXBpZCBwYW5lbCAvIExGVCAvIFJGVCAvIEhlcCBCL0MgLyB1cmljIGFjaWQgYWxsXG4gIC8vIHByZS1jb21wdXRlZCBieSBOSEkncyBzY3JlZW5pbmcgcHJvZ3JhbW1lLiBhZGFwdEFkdWx0UHJldmVudGl2ZVxuICAvLyByZXR1cm5zIGFuIGFycmF5IChvbmUgT2JzZXJ2YXRpb24gcGVyIG1lYXN1cmVtZW50KSBzbyB0aGVcbiAgLy8gYWRhcHRlci1jYWxsIGxvb3AgZmxhdHRlbnMgaXQuXG4gIHsgbmFtZTogXCJhZHVsdF9wcmV2ZW50aXZlXCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwMnMwMS9TUF9JSEtFMzQwMlMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRBZHVsdFByZXZlbnRpdmUgfSxcbiAgeyBuYW1lOiBcImNhbmNlcl9zY3JlZW5pbmdcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA0czAxL1NQX0lIS0UzNDA0UzAxXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdExhYkl0ZW0gfSxcbiAgLy8gZ2x1Y29zZSAoSUhLRTM0MDZTMDEpICsgbGlwaWQgKElIS0UzNDA3UzAxKSBhcmUgc3Vic2V0cyBvZlxuICAvLyBvdGhlcl9sYWJzIChJSEtFMzQwOVMwMSkgcGVyIE5ISSdzIGRhdGEgbW9kZWwgXHUyMDE0IGZldGNoaW5nIHRoZW1cbiAgLy8gc2VwYXJhdGVseSBqdXN0IGNyZWF0ZXMgZHVwIG9ic2VydmF0aW9ucywgc28gd2Ugc2tpcCB0aGVtLlxuICAvLyBJbWFnaW5nIGxpc3QgKElIS0UzNDA4UzAxKSBvbmx5IGNhcnJpZXMgb3JkZXItbGV2ZWwgZGF0YTsgZnVsbFxuICAvLyBuYXJyYXRpdmUgcmVwb3J0IGxpdmVzIGF0IElIS0UzNDA4UzAyLiBXZSBkbyBhIDItc3RlcCBmZXRjaCAoc2VlXG4gIC8vIF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIpIHRvIGdyYWIgdGhlIHJlcG9ydCwgdGhlbiBtYXAgdG8gYSByZWFsXG4gIC8vIERpYWdub3N0aWNSZXBvcnQuIFRoZSBsaXN0IGFkYXB0ZXIgaXMgYSBuby1vcCBzdHViIGxpa2UgbWVkaWNhdGlvbnMuXG4gIC8vIGltYWdpbmc6IHNlYXJjaCBlbmRwb2ludCBhY2NlcHRzIElTTyBkYXRlIHJhbmdlIGxpa2UgbWVkaWNhdGlvbnMuXG4gIHsgbmFtZTogXCJpbWFnaW5nXCIsICAgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwOHMwMS9zZWFyY2g/c190eXBlPSZzX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExXCIsXG4gICAgcGFnZV90eXBlOiBcImRpYWdub3N0aWNfcmVwb3J0c1wiLCBhZGFwdDogYWRhcHRJbWFnaW5nTGlzdFN0dWIsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIG90aGVyX2xhYnMgYWxyZWFkeSB1c2VzIC9zZWFyY2g7IHNhbWUgSVNPLWRhc2ggZGF0ZSBmb3JtYXQgd29ya3MuXG4gIHsgbmFtZTogXCJvdGhlcl9sYWJzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwOXMwMS9zZWFyY2g/c190eXBlPSZzX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdExhYkl0ZW0sIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElIS0UzMjA5UzAxIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpIFx1MjAxNCBOSEktdmV0dGVkIGNhdGFzdHJvcGhpYy1pbGxuZXNzIHJlZ2lzdHJ5LlxuICAvLyBFYWNoIHJvdyBcdTIxOTIgYSBGSElSIENvbmRpdGlvbiB3aXRoIGNhdGVnb3J5PXByb2JsZW0tbGlzdC1pdGVtLCB0aGVcbiAgLy8gY2xvc2VzdCBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZXF1aXZhbGVudCB0byBhIGN1cmF0ZWQgcHJvYmxlbSBsaXN0LiBFbmRwb2ludFxuICAvLyBkb2Vzbid0IGFjY2VwdCBkYXRlIHBhcmFtcyAoTkhJIHJldHVybnMgY3VycmVudGx5LXZhbGlkIGNlcnRzIG9ubHkpLlxuICB7IG5hbWU6IFwiY2F0YXN0cm9waGljX2lsbG5lc3NcIiwgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjA5czAxL1NQX0lIS0UzMjA5UzAxXCIsXG4gICAgcGFnZV90eXBlOiBcImNvbmRpdGlvbnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdENhdGFzdHJvcGhpY0lsbG5lc3MgfSxcbl07XG4iLCAiLy8gU2VydmljZSB3b3JrZXIgZm9yIE5ISS1GSElSIEJyaWRnZSBcdTIwMTQgb3ducyB0aGUgbG9uZy1ydW5uaW5nXG4vLyBcIlN5bmMgVGhpcyBQYXRpZW50XCIgd29ya2Zsb3cgc28gdGhlIHBvcHVwIGNhbiBjbG9zZSBtaWQtc3luYyB3aXRob3V0XG4vLyBhYm9ydGluZyBpdC5cbi8vXG4vLyBMaWZlY3ljbGU6XG4vLyAgIC0gcG9wdXAgcG9zdHMge3R5cGU6IFwic3RhcnROaGlBcGlTeW5jXCIsIHBheWxvYWR9ICBcdTIxOTIgTkhJIEpTT04tQVBJIHN5bmNcbi8vICAgLSBiYWNrZ3JvdW5kIHJ1bnMgdGhlIGZ1bGwgc3luYyBzZXF1ZW5jZSwgdXBkYXRpbmcgY2hyb21lLnN0b3JhZ2UubG9jYWxcbi8vICAgLSBwb3B1cCByZWFkcyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBvbiByZW9wZW4gdG8gc2hvdyBwcm9ncmVzc1xuLy9cbi8vIE1vZGVzOlxuLy8gICAtIFwibG9jYWxcIiAgIFx1MjE5MiBhZnRlciBOSEkgZmV0Y2gsIHJ1biBtYXBwZXJzIGluLWV4dGVuc2lvbiwgZG93bmxvYWQgYVxuLy8gICAgICAgICAgICAgICAgIEZISVIgQnVuZGxlIHRvIHRoZSB1c2VyJ3MgbWFjaGluZS4gTm8gYmFja2VuZCByZXF1aXJlZC5cbi8vICAgLSBcImJhY2tlbmRcIiBcdTIxOTIgUE9TVCBwZXItcGFnZV90eXBlIGl0ZW1zIHRvIC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkXG4vLyAgICAgICAgICAgICAgICAgKGV4aXN0aW5nIGJlaGF2aW91cik7IGRhc2hib2FyZCArIFNNQVJUIGFwcCB1c2UgdGhlXG4vLyAgICAgICAgICAgICAgICAgYmFja2VuZCdzIEZISVIgc3RvcmUuXG5cbmltcG9ydCB7XG4gIEdST1VQX0hBTkRMRVJTLFxuICBMSVNUX0hBTkRMRVJTLFxuICBkZWR1cEFkbWlzc2lvbkRheUFtYixcbiAgZGVyaXZlUGF0aWVudElkLFxuICBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzLFxuICBtYXBQYXRpZW50LFxuICBtYXNrSWQsXG4gIG1hc2tOYW1lLFxuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyxcbn0gZnJvbSBcIkBuaGktZmhpci1icmlkZ2UvbWFwcGVyXCI7XG5pbXBvcnQge1xuICAvLyBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlIGlzIGludm9rZWQgZGlyZWN0bHkgZnJvbSB0aGVcbiAgLy8gSUhLRTMzMDNTMDIgZGV0YWlsIGZhbi1vdXQgKG92ZXJyaWRlcyB0aGUgcmVnaXN0cnkncyBjbGFzc0hpbnRcbiAgLy8gd2l0aCBcdTYwMjVcdThBM0EvXHU0RjRGXHU5NjYyIGRlcml2ZWQgZnJvbSB0aGUgZGV0YWlsIGJvZHkpLCBzbyBpdCBuZWVkcyB0byBiZVxuICAvLyBhIG5hbWVkIGltcG9ydCBcdTIwMTQgbm90IG9ubHkgcmVhY2hhYmxlIHZpYSBOSElfQVBJX0VORFBPSU5UU1tpXS5hZGFwdC5cbiAgLy8gRm9yZ2V0dGluZyB0aGlzIHJlLWltcG9ydCBhZnRlciBleHRyYWN0aW5nIHRoZSBlbmRwb2ludCByZWdpc3RyeVxuICAvLyBpbiB2MC42LjMgc2hpcHBlZCBhIFJlZmVyZW5jZUVycm9yIHRoYXQgb25seSBmaXJlZCBpbiBwcm9kdWN0aW9uXG4gIC8vIHN5bmNzIHdpdGggbm9uLWVtcHR5IGVuY291bnRlcnMuIFRlc3RzIGRvbid0IGV4ZXJjaXNlIHRoYXQgcGF0aFxuICAvLyBcdTIwMTQgc2VlIFRPRE9fRk9MTE9XVVAgZm9yIGEgU1ctZmxvdyBpbnRlZ3JhdGlvbiB0ZXN0IGlkZWEuXG4gIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsXG4gIGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwsXG4gIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwsXG4gIGFkYXB0UHJvY2VkdXJlRnJvbURldGFpbCxcbiAgaXNvVG9ST0MsXG4gIHBpY2tFbmdsaXNoLFxuICByb2NUb0lTTyxcbn0gZnJvbSBcIi4vbmhpLWFkYXB0ZXJzLmpzXCI7XG5pbXBvcnQgeyBFTkRQT0lOVF9MQUJFTF9aSCwgTkhJX0FQSV9FTkRQT0lOVFMgfSBmcm9tIFwiLi9uaGktZW5kcG9pbnRzLmpzXCI7XG5cbmNvbnN0IFNUT1JBR0VfS0VZID0gXCJzeW5jU3RhdHVzXCI7XG5jb25zdCBzbGVlcCA9IChtcykgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKTtcblxuLy8gQ2FuY2VsbGF0aW9uIGZsYWcgc2V0IGJ5IHBvcHVwJ3Mgc3RvcCBidXR0b24uIENoZWNrZWQgYXQgc3RyYXRlZ2ljIHBvaW50c1xuLy8gaW4gcnVuTmhpQXBpU3luYyAoYmV0d2VlbiBwaGFzZXMsIGJlZm9yZSBlYWNoIGRldGFpbCBwYWdlKSBzbyB0aGVcbi8vIGluLXByb2dyZXNzIHN5bmMgZXhpdHMgcHJvbXB0bHkgd2hlbiB0aGUgdXNlciBoaXRzIFN0b3AuIENsZWFyZWQgYXQgdGhlXG4vLyBzdGFydCBvZiBlYWNoIG5ldyBzeW5jIHJ1bi5cbmxldCBfY2FuY2VsbGVkID0gZmFsc2U7XG4vLyBDb250ZXh0IGZvciB0aGUgaW4tZmxpZ2h0IHN5bmMgc28gdGhlIHN0b3BTeW5jIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuLy8gZGF0YSB3aXRob3V0IHRoZSBwb3B1cCBuZWVkaW5nIHRvIHBhc3MgaXQgYmFjay4gU2V0IGF0IHRoZSB0b3Agb2Zcbi8vIHJ1bk5oaUFwaVN5bmM7IGNsZWFyZWQgb24gY29tcGxldGlvbiAoc3VjY2Vzcy9mYWlsdXJlL2NhbmNlbCkuXG5sZXQgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xuY29uc3QgQ0FOQ0VMX0VSUk9SID0gXCJfX1NZTkNfQ0FOQ0VMTEVEX19cIjtcbi8vIFRocm93biB3aGVuIE5ISSBkZXRlY3RzIHRoZSBzZXNzaW9uIGhhcyBleHBpcmVkIChsb2dpbiBwYWdlIHJlbmRlcmVkLCBvclxuLy8gdGFiIHJlZGlyZWN0ZWQgdG8gYXV0aCBuYW1lc3BhY2UpLiBBYm9ydHMgc3luYyBpbW1lZGlhdGVseSBzbyB0aGUgdXNlciBjYW5cbi8vIHJlLWxvZ2luIGFuZCByZXRyeSBpbnN0ZWFkIG9mIHRpbWluZyBvdXQgb24gZXZlcnkgcmVtYWluaW5nIHBhZ2UuXG5jb25zdCBTRVNTSU9OX0VYUElSRURfRVJST1IgPSBcIl9fU0VTU0lPTl9FWFBJUkVEX19cIjtcbi8vIEVycm9ycyB0aGF0IHNob3VsZCBhYm9ydCB0aGUgZW50aXJlIHN5bmMgaW5zdGVhZCBvZiBiZWluZyBzd2FsbG93ZWRcbi8vIHBlci1waGFzZS5cbmNvbnN0IEFCT1JUX0VSUk9SUyA9IG5ldyBTZXQoW0NBTkNFTF9FUlJPUiwgU0VTU0lPTl9FWFBJUkVEX0VSUk9SXSk7XG5mdW5jdGlvbiBjaGVja0NhbmNlbCgpIHtcbiAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRTdGF0dXMocGFydGlhbCkge1xuICAvLyBBZnRlciBjYW5jZWxsYXRpb24sIHRoZSBwb3B1cCBoYXMgYWxyZWFkeSB3cml0dGVuIHRoZSBkZWZpbml0aXZlXG4gIC8vIFwic3RvcHBlZFwiIHN0YXR1cyBcdTIwMTQgc2lsZW5jZSBhbnkgZnVydGhlciBwcm9ncmVzcyB3cml0ZXMgZnJvbSB0aGVcbiAgLy8gaW4tZmxpZ2h0IHN5bmMgY29kZSBzbyB0aGUgVUkgZG9lc24ndCBib3VuY2Ugd2hpbGUgaXQgdW53aW5kcy5cbiAgaWYgKF9jYW5jZWxsZWQpIHJldHVybjtcbiAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gIGNvbnN0IG5leHQgPSB7IC4uLnByZXYsIC4uLnBhcnRpYWwsIHRzOiBEYXRlLm5vdygpIH07XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IG5leHQgfSk7XG4gIC8vIEJyb2FkY2FzdCB0byBhbnkgb3BlbiBwb3B1cC4gSWYgbm8gbGlzdGVuZXIgKHBvcHVwIGNsb3NlZCksXG4gIC8vIHNlbmRNZXNzYWdlIHJlamVjdHMgXHUyMDE0IHN3YWxsb3cuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzeW5jUHJvZ3Jlc3NcIiwgc3RhdHVzOiBuZXh0IH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIE5ISSBBUEktZGlyZWN0IHN5bmMgKHBhcmFsbGVsLCBubyBMTE0pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEluc3RlYWQgb2YgbmF2aWdhdGluZyB0aGUgdXNlcidzIHRhYiB0byBlYWNoIE5ISSBwYWdlLCB3YWl0aW5nIGZvciBWdWUgdG9cbi8vIHJlbmRlciwgY2FwdHVyaW5nIEhUTUwsIHRoZW4gc2VuZGluZyBpdCB0aHJvdWdoIExMTSBleHRyYWN0aW9uLCB3ZSBjYWxsXG4vLyBOSEkncyB1bmRlcmx5aW5nIEpTT04gQVBJIGVuZHBvaW50cyBkaXJlY3RseS4gVGhlIFx1NTA2NVx1NEZERFx1N0Y3MiBTUEEgZnJvbnRzIGEgc2V0XG4vLyBvZiBSRVNUIGVuZHBvaW50cyB1bmRlciAvYXBpL2loa2UzMDAwLzxwYWdlPi8qIHRoYXQgcmV0dXJuIHdlbGwtZm9ybWVkXG4vLyBKU09OOyBjYWxsaW5nIHRoZW0gaW4gcGFyYWxsZWwgY3V0cyBhIDUtMTAgbWludXRlIHN5bmMgdG8gfjEwIHNlY29uZHMgYW5kXG4vLyByZW1vdmVzIHRoZSBMTE0gY29zdCBlbnRpcmVseS5cblxuY29uc3QgTkhJX0hPU1QgPSBcIm15aGVhbHRoYmFuay5uaGkuZ292LnR3XCI7XG5cblxuLy8gTkhJIEpTT04gYWRhcHRlcnMgKyBkYXRlL3N0cmluZyBoZWxwZXJzIGxpdmUgaW4gLi9uaGktYWRhcHRlcnMuanNcbi8vIHNvIHRoZXkgY2FuIGJlIHVuaXQtdGVzdGVkIGluIGlzb2xhdGlvbiAoYmFja2dyb3VuZC5qcyBjYW4ndCBiZVxuLy8gbG9hZGVkIHVuZGVyIHZpdGVzdCBcdTIwMTQgY2hyb21lLiogQVBJcywgU1cgZ2xvYmFscykuIFNlZSB0aGF0IG1vZHVsZVxuLy8gZm9yIHRoZSBmaWVsZC1wcmlvcml0eSBkZWNpc2lvbnMgcGVyIGFkYXB0ZXIuXG4vL1xuLy8gVGhlIE5ISSBBUEkgZW5kcG9pbnQgcmVnaXN0cnkgKyBcdTRFMkRcdTY1ODcgbGFiZWwgbWFwcGluZyBsaXZlIGluXG4vLyAuL25oaS1lbmRwb2ludHMuanMgXHUyMDE0IGV4dHJhY3RlZCBzbyBhIHVuaXQgdGVzdCBjYW4gZ3VhcmFudGVlIGV2ZXJ5XG4vLyBlbmRwb2ludCBuYW1lIGhhcyBhIGxhYmVsICh3ZSB1c2VkIHRvIHNoaXAgcmF3IHBhZ2VfdHlwZSBrZXlzIGxpa2Vcbi8vIFwib3RoZXJfbGFic1wiIGludG8gdGhlIHBvcHVwJ3MgXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwIHdoZW4gc29tZW9uZSBmb3Jnb3QgdG9cbi8vIHJlZ2lzdGVyIHRoZSBDaGluZXNlIHZlcnNpb24pLlxuXG4vLyBBcHBseSBhIHtzdGFydCwgZW5kfSBJU08gZGF0ZSByYW5nZSB0byBhbiBlbmRwb2ludCBwYXRoOlxuLy8gICAtIElmIHBhdGggYWxyZWFkeSBoYXMgc19kYXRlPSBwbGFjZWhvbGRlcnMsIGZpbGwgdGhlbSBpbi5cbi8vICAgLSBPdGhlcndpc2UgYXBwZW5kIHNfZGF0ZT0uLi4mZV9kYXRlPS4uLiB0byB0aGUgcXVlcnkgc3RyaW5nLlxuLy8gRW5kcG9pbnRzIHdpdGhvdXQgYHN1cHBvcnRzRGF0ZVJhbmdlYCBwYXNzIHRocm91Z2ggdW5jaGFuZ2VkLlxuZnVuY3Rpb24gYXBwbHlEYXRlUmFuZ2VUb1BhdGgocGF0aCwgZGF0ZVJhbmdlKSB7XG4gIGlmICghZGF0ZVJhbmdlIHx8ICghZGF0ZVJhbmdlLnN0YXJ0ICYmICFkYXRlUmFuZ2UuZW5kKSkgcmV0dXJuIHBhdGg7XG4gIC8vIE5ISSBleHBlY3RzIFx1ODk3Rlx1NTE0MyBJU08gZGF0ZXMgd2l0aCBkYXNoZXM6IDIwMjMtMDEtMDEgKG5vdCBcdTZDMTFcdTU3MEIsIG5vdFxuICAvLyBzbGFzaGVzKS4gQ29uZmlybWVkIGJ5IG9ic2VydmluZyB0aGUgU1BBJ3MgcmVxdWVzdCB3aGVuIHVzZXIgcGlja3NcbiAgLy8gYSBjdXN0b20gZGF0ZSByYW5nZS4gVVJMLWVuY29kaW5nIHRoZSBkYXNoZXMgaXMgdW5uZWNlc3NhcnkuXG4gIGNvbnN0IHMgPSAoZGF0ZVJhbmdlLnN0YXJ0IHx8IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgY29uc3QgZSA9IChkYXRlUmFuZ2UuZW5kIHx8IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgbGV0IHAgPSBwYXRoO1xuICBpZiAoL1s/Jl1zX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1zX2RhdGU9KVteJl0qLywgYCQxJHtzfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gKHAuaW5jbHVkZXMoXCI/XCIpID8gXCImXCIgOiBcIj9cIikgKyBgc19kYXRlPSR7c31gO1xuICB9XG4gIGlmICgvWz8mXWVfZGF0ZT0vLnRlc3QocCkpIHtcbiAgICBwID0gcC5yZXBsYWNlKC8oWz8mXWVfZGF0ZT0pW14mXSovLCBgJDEke2V9YCk7XG4gIH0gZWxzZSB7XG4gICAgcCArPSBgJmVfZGF0ZT0ke2V9YDtcbiAgfVxuICByZXR1cm4gcDtcbn1cblxuLy8gRmFuIG91dCBJSEtFMzMwNlMwMiBkZXRhaWwgZmV0Y2hlcyBpbnNpZGUgdGhlIE5ISSB0YWIgc28gY29va2llcyArIEpXVFxuLy8gYXV0aCBmbG93IG5hdHVyYWxseS4gV2UgcGFzcyB0aGUgdmlzaXQgbGlzdCAoanVzdCByb3dfSURzICsgdGhlaXIgcGFyZW50XG4vLyBmaWVsZHMgbmVlZGVkIGZvciBhZGFwdGF0aW9uKSBpbnRvIHRoZSB0YWI7IHRoZSB0YWIgcmV0dXJucyBwYXJhbGxlbFxuLy8gZmV0Y2hlZCBib2RpZXM7IHdlIGFkYXB0IGJhY2sgaW4gdGhlIFNXLlxuLy9cbi8vIGBza2lwUm93SWRzYDogU2V0PHN0cmluZz4gb2Ygcm93X0lEcyB3aG9zZSBkcnVncyBoYXZlIGFscmVhZHkgYmVlblxuLy8gZmV0Y2hlZCBieSBhbm90aGVyIGZhbi1vdXQgKGN1cnJlbnRseTogY2hyb25pYyBwcmVzY3JpcHRpb25zKS4gV2hlblxuLy8gdGhlIGNocm9uaWMgbGlzdCAoSUhLRTMzMDdTMDEpIGFuZCB0aGUgcmVndWxhciBtZWRzIGxpc3Rcbi8vIChJSEtFMzMwNlMwMSkgYm90aCBjb250YWluIHRoZSBzYW1lIHJvd19JRCAofjUyIG92ZXJsYXAgb24gb2JzZXJ2ZWRcbi8vIHBhdGllbnQpLCB3ZSBza2lwIHRoZSByZWd1bGFyIGNhbGwgdG8gYXZvaWQgZG91YmxlLWVtaXR0aW5nIHRoZVxuLy8gc2FtZSBkcnVncy5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzLCBza2lwUm93SWRzIH0pIHtcbiAgY29uc3Qgc2tpcCA9IHNraXBSb3dJZHMgaW5zdGFuY2VvZiBTZXQgPyBza2lwUm93SWRzIDogbmV3IFNldChza2lwUm93SWRzIHx8IFtdKTtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgLy8gS2VlcCBwYXJlbnQgZmllbGRzIG5lZWRlZCBieSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsLlxuICAgICAgcGFyZW50OiB7XG4gICAgICAgIGZ1bmNfREFURTogdi5mdW5jX0RBVEUgfHwgdi5mdW5jX2RhdGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREU6IHYuaWNkOWNtX0NPREUgfHwgdi5pY2Q5Y21fY29kZSB8fCBcIlwiLFxuICAgICAgICBpY2Q5Y21fQ09ERV9DTkFNRTogdi5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2LmljZDljbV9uYW1lIHx8IFwiXCIsXG4gICAgICAgIGhvc3BfQUJCUjogdi5ob3NwX0FCQlIgfHwgdi5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAgIH0sXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQgJiYgIXNraXAuaGFzKHIucm93X0lEKSk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgZnVuYzogYXN5bmMgKGJhc2UsIGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgIGlmICghdG9rZW4pIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICB9XG4gICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICBhc3luYyBmdW5jdGlvbiBmZXRjaE9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtjdHlwZX1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBOSEkgdXNlcyBkaWZmZXJlbnQgY3R5cGUgdmFsdWVzIGZvciBcdTg5N0ZcdTkxQUIvXHU0RTJEXHU5MUFCL1x1NzI1OVx1OTFBQi9cdTg2NTVcdTY1QjlcdTdCOEIuIFdlIGRvbid0XG4gICAgICAvLyBoYXZlIHRoZSBwdWJsaWMgbWFwcGluZywgc28gdHJ5IGN0eXBlIDEuLjQgaW4gb3JkZXIgYW5kIHN0b3AgYXNcbiAgICAgIC8vIHNvb24gYXMgb25lIHJldHVybnMgZHJ1Z3MuIGN0eXBlPTIgY292ZXJlZCBJQ1x1NTM2MSBcdTk1ODBcdThBM0EgaW4gb3VyIHNhbXBsZS5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCkge1xuICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIFsyLCAxLCAzLCA0XSkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaE9uZShyb3dJZCwgY3QpO1xuICAgICAgICAgIGlmIChyLmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSByZXR1cm4gcjtcbiAgICAgICAgICBpZiAoci5lcnJvcikgY29udGludWU7XG4gICAgICAgICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Py5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgICAgICAgIGNvbnN0IGhhc0RydWdzID0gbWFpbi5zb21lKCh2KSA9PlxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheSh2Py5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpICYmIHYuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0Lmxlbmd0aCA+IDBcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChoYXNEcnVncykgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm8gY3R5cGUgeWllbGRlZCBkcnVncyBcdTIwMTQgcmV0dXJuIGxhc3Qgc3VjY2Vzc2Z1bCBib2R5IGFueXdheSBzb1xuICAgICAgICAvLyBkaWFnbm9zdGljcyBjYW4gc3RpbGwgc2VlIHRoZSB2aXNpdCBtZXRhZGF0YS5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGZldGNoT25lKHJvd0lkLCAyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IGRydWdzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgZHJ1Z0xpc3QgPSBBcnJheS5pc0FycmF5KHZpc2l0LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCkgPyB2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QgOiBbXTtcbiAgICAgIGZvciAoY29uc3QgZCBvZiBkcnVnTGlzdCkge1xuICAgICAgICBjb25zdCBhZGFwdGVkID0gYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbChkLCB2aXNpdCk7XG4gICAgICAgIGlmIChhZGFwdGVkKSBkcnVncy5wdXNoKGFkYXB0ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZHJ1Z3M7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDZTMDIgZGV0YWlsIGZldGNoZXMgZm9yIGNocm9uaWMgcHJlc2NyaXB0aW9ucy4gVXNlc1xuLy8gcGVyLXJvdyBgb3JpX1RZUEVgIGZvciBjdHlwZSAoMT1cdTk1ODBcdThBM0EsIDI9SUNcdTUzNjEsIDg9XHU4NUU1XHU1QzQwKSBpbnN0ZWFkIG9mXG4vLyBicnV0ZS1mb3JjaW5nIDEuLjQgbGlrZSB0aGUgcmVndWxhciBtZWRpY2F0aW9uIGZhbi1vdXQ6IGNocm9uaWNcbi8vIGxpc3Qgcm93cyBhbHdheXMgY2Fycnkgb3JpX1RZUEUgYW5kIGRldGFpbC1lbXB0eSByZXNwb25zZXMgY29uZmlybVxuLy8gdGhhdCBtaXNtYXRjaGluZyBjdHlwZSByZXR1cm5zIGFuIGVtcHR5IGFycmF5LiBFdmVyeSBkcnVnIHByb2R1Y2VkXG4vLyBoZXJlIGdldHMgaXNfY2hyb25pYz10cnVlIFx1MjE5MiBtYXBwZXIgZW1pdHMgY291cnNlT2ZUaGVyYXB5VHlwZT1cbi8vIGNvbnRpbnVvdXMgb24gdGhlIHJlc3VsdGluZyBNZWRpY2F0aW9uUmVxdWVzdC5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaENocm9uaWNNZWRpY2F0aW9uRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2KSA9PiAoe1xuICAgICAgcm93X0lEOiB2LnJvd19JRCB8fCB2LnJvd2lkIHx8IHYucm93SUQgfHwgXCJcIixcbiAgICAgIC8vIENocm9uaWMgbGlzdCByb3dzIGFsd2F5cyBoYXZlIG9yaV9UWVBFOyBmYWxsIGJhY2sgdG8gYnJ1dGUtXG4gICAgICAvLyBmb3JjZSBvbmx5IGlmIE5ISSBldmVyIHNoaXBzIGEgcm93IHdpdGhvdXQgaXQuXG4gICAgICBjdHlwZTogU3RyaW5nKHYub3JpX1RZUEUgfHwgdi5vcmlfdHlwZSB8fCBcIlwiKSxcbiAgICB9KSlcbiAgICAuZmlsdGVyKChyKSA9PiByLnJvd19JRCk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgZnVuYzogYXN5bmMgKGJhc2UsIGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgIGlmICghdG9rZW4pIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICB9XG4gICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICBhc3luYyBmdW5jdGlvbiBmZXRjaE9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoY3R5cGUpfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFRyeSB0aGUgcm93J3MgZGVjbGFyZWQgY3R5cGUgZmlyc3Q7IGlmIGVtcHR5LCBmYWxsIGJhY2sgdG9cbiAgICAgIC8vIGJydXRlLWZvcmNlIHNvIGEgbWlzY2xhc3NpZmllZCByb3cgc3RpbGwgc3VyZmFjZXMgaXRzIGRydWdzLlxuICAgICAgYXN5bmMgZnVuY3Rpb24gb25lKHJvd0lkLCBkZWNsYXJlZEN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHNlcSA9IGRlY2xhcmVkQ3R5cGVcbiAgICAgICAgICA/IFtkZWNsYXJlZEN0eXBlLCAuLi5bMSwgMiwgOCwgMywgNF0uZmlsdGVyKChjKSA9PiBTdHJpbmcoYykgIT09IFN0cmluZyhkZWNsYXJlZEN0eXBlKSldXG4gICAgICAgICAgOiBbMSwgMiwgOCwgMywgNF07XG4gICAgICAgIGZvciAoY29uc3QgY3Qgb2Ygc2VxKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCBjdCk7XG4gICAgICAgICAgaWYgKHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHJldHVybiByO1xuICAgICAgICAgIGlmIChyLmVycm9yKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHk/Lmloa2UzMzA2UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhIDogW107XG4gICAgICAgICAgY29uc3QgaGFzRHJ1Z3MgPSBtYWluLnNvbWUoKHYpID0+XG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHY/LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCkgJiYgdi5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QubGVuZ3RoID4gMCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChoYXNEcnVncykgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQsIGl0ZW1zW2ldLmN0eXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd3MgPSBbXTtcbiAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQyAmJiB3IDwgaXRlbXMubGVuZ3RoOyB3KyspIHdzLnB1c2god29ya2VyKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod3MpO1xuICAgICAgcmV0dXJuIHsgcmVzdWx0czogb3V0IH07XG4gICAgfSxcbiAgICBhcmdzOiBbYmFzZVVybCwgcmVxc10sXG4gIH0pO1xuXG4gIGlmIChyZXN1bHQ/LmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgY29uc3QgZHJ1Z3MgPSBbXTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgciA9IHJlc3VsdHNbaV07XG4gICAgaWYgKCFyIHx8IHIuZXJyb3IgfHwgIXIuYm9keSkgY29udGludWU7XG4gICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhIDogW107XG4gICAgZm9yIChjb25zdCB2aXNpdCBvZiBtYWluKSB7XG4gICAgICBjb25zdCBkcnVnTGlzdCA9IEFycmF5LmlzQXJyYXkodmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSA/IHZpc2l0LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCA6IFtdO1xuICAgICAgZm9yIChjb25zdCBkIG9mIGRydWdMaXN0KSB7XG4gICAgICAgIGNvbnN0IGFkYXB0ZWQgPSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsKGQsIHZpc2l0LCB7IGlzX2Nocm9uaWM6IHRydWUgfSk7XG4gICAgICAgIGlmIChhZGFwdGVkKSBkcnVncy5wdXNoKGFkYXB0ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZHJ1Z3M7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTM0MDhTMDIgZGV0YWlsIGZldGNoZXMgZm9yIGltYWdpbmcgXHUyMDE0IHNhbWUgcGF0dGVybiBhcyB0aGVcbi8vIG1lZGljYXRpb24gMi1zdGVwLiBjdHlwZSBtaXJyb3JzIHRoZSB2aXNpdCdzIG9yaV9UWVBFIChBIC8gRSAvIFx1MjAyNikuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2KSA9PiAoe1xuICAgICAgcm93X0lEOiB2LnJvd19JRCB8fCB2LnJvd2lkIHx8IHYucm93SUQgfHwgXCJcIixcbiAgICAgIGN0eXBlOiB2Lm9yaV9UWVBFIHx8IHYub3JpX3R5cGUgfHwgXCJBXCIsXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gb25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTM0MDhTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2VuY29kZVVSSUNvbXBvbmVudChjdHlwZSl9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lELCBpdGVtc1tpXS5jdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IHJlcG9ydHMgPSBbXTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgciA9IHJlc3VsdHNbaV07XG4gICAgaWYgKCFyIHx8IHIuZXJyb3IgfHwgIXIuYm9keSkgY29udGludWU7XG4gICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTM0MDhTMDJfbWFpbl9kYXRhIDogW107XG4gICAgZm9yIChjb25zdCB2aXNpdCBvZiBtYWluKSB7XG4gICAgICBjb25zdCBhZGFwdGVkID0gYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbCh2aXNpdCk7XG4gICAgICBpZiAoYWRhcHRlZCkgcmVwb3J0cy5wdXNoKGFkYXB0ZWQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVwb3J0cztcbn1cblxuLy8gRmFuIG91dCBJSEtFMzMwOFMwMiBkZXRhaWwgZmV0Y2hlcyBmb3IgcHJvY2VkdXJlcyBcdTIwMTQgc2FtZSAyLXN0ZXBcbi8vIHBhdHRlcm4gYXMgaW1hZ2luZyBJSEtFMzQwOFMwMSBcdTIxOTIgUzAyLiBUaGUgbGlzdCAoSUhLRTMzMDFTMDUpIG9ubHlcbi8vIGNhcnJpZXMgbWV0YWRhdGE7IHRoZSBhY3R1YWwgSUNELTEwLVBDUyBjb2RlIChvcF9DT0RFKSBhbmQgdGhlIHJlYWxcbi8vIHBlcmZvcm1hbmNlIGRhdGUgKGV4ZV9TX0RBVEUgb24gc3ViLWxpc3QgZW50cmllcykgbGl2ZSBpbiB0aGUgZGV0YWlsLlxuLy8gY3R5cGUgbWlycm9ycyB0aGUgbGlzdCByb3cncyBvcmlfdHlwZSAoMz1cdTRGNEZcdTk2NjIgLyA1PVx1OTU4MFx1OEEzQSBvYnNlcnZlZFxuLy8gYWdhaW5zdCBsaXZlIHBheWxvYWRzKS4gTkhJIGRvZXNuJ3QgcHVibGlzaCB0aGUgbWFwcGluZyBzbyB3ZVxuLy8gYnJ1dGUtZm9yY2Ugb24gbWlzcyBsaWtlIHRoZSBtZWRpY2F0aW9uIGZhbi1vdXQsIGp1c3QgaW4gY2FzZS5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaFByb2NlZHVyZURldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dfaWQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICBjdHlwZTogdi5vcmlfdHlwZSB8fCB2Lm9yaV9UWVBFIHx8IFwiXCIsXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwOFMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGN0eXBlKX1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBQcmVmZXIgdGhlIHJvdydzIG93biBvcmlfdHlwZS4gSWYgdGhhdCByZXR1cm5zIGVtcHR5IChOSElcbiAgICAgIC8vIHNvbWV0aW1lcyBzaGlwcyByb3dzIHdoZXJlIGN0eXBlIGV4cGVjdHMgYSBkaWZmZXJlbnQgdmFsdWUpLFxuICAgICAgLy8gYnJ1dGUtZm9yY2UgMS4uNSB1bnRpbCBzb21ldGhpbmcgY29tZXMgYmFjay5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgcHJlZmVycmVkKSB7XG4gICAgICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBbXTtcbiAgICAgICAgaWYgKHByZWZlcnJlZCkgY2FuZGlkYXRlcy5wdXNoKHByZWZlcnJlZCk7XG4gICAgICAgIGZvciAoY29uc3QgY3Qgb2YgW1wiM1wiLCBcIjVcIiwgXCIxXCIsIFwiMlwiLCBcIjRcIl0pIHtcbiAgICAgICAgICBpZiAoIWNhbmRpZGF0ZXMuaW5jbHVkZXMoY3QpKSBjYW5kaWRhdGVzLnB1c2goY3QpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsYXN0T2sgPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keT8uaWhrZTMzMDhTMDJfbWFpbl9kYXRhKVxuICAgICAgICAgICAgPyByLmJvZHkuaWhrZTMzMDhTMDJfbWFpbl9kYXRhIDogW107XG4gICAgICAgICAgaWYgKG1haW4ubGVuZ3RoID4gMCkgcmV0dXJuIHI7XG4gICAgICAgICAgbGFzdE9rID0gcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFzdE9rIHx8IHsgZXJyb3I6IFwibm8gZGV0YWlsIGJvZHlcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lELCBpdGVtc1tpXS5jdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIGNvbnN0IHByb2NlZHVyZXMgPSBbXTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgciA9IHJlc3VsdHNbaV07XG4gICAgaWYgKCFyIHx8IHIuZXJyb3IgfHwgIXIuYm9keSkgY29udGludWU7XG4gICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Lmloa2UzMzA4UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTMzMDhTMDJfbWFpbl9kYXRhIDogW107XG4gICAgZm9yIChjb25zdCByb3cgb2YgbWFpbikge1xuICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0UHJvY2VkdXJlRnJvbURldGFpbChyb3cpO1xuICAgICAgaWYgKGFkYXB0ZWQpIHByb2NlZHVyZXMucHVzaChhZGFwdGVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByb2NlZHVyZXM7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDNTMDIgZGV0YWlsIHRvIGNsYXNzaWZ5IGVhY2ggSUhLRTMzMDNTMDEgdmlzaXQgYXNcbi8vIEFNQiAvIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRS4gVXNlcyA/cmlkPTxyb3dfSUQ+JnQ9TlxuLy8gd2hlcmUgTiBpcyB0aGUgdmlzaXQgdHlwZSBidWNrZXQ7IHdlIGRvbid0IGtub3cgdGhlIG1hcHBpbmcgYSBwcmlvcmksXG4vLyBzbyBmb3IgZWFjaCB2aXNpdCB3ZSB0cnkgdD0xLi41IHVudGlsIG9uZSByZXR1cm5zIG5vbi1lbXB0eSBtYWluX2RhdGEuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYsIGlkeCkgPT4gKHsgaWR4LCByb3dfSUQ6IHYucm9XX0lEIHx8IHYucm93X0lEIHx8IFwiXCIgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIHQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL2loa2UzMzAzczAyL3BhZ2VfbG9hZD9yaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZ0PSR7dH1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdG0gPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBGb3IgZWFjaCB2aXNpdCwgZmluZCB0aGUgYHRgIHRoYXQgcmV0dXJucyBub24tZW1wdHkgZGF0YS4gTkhJXG4gICAgICAvLyB1c2VzIHQ9MSBmb3Igb3V0cGF0aWVudCBcdTg5N0ZcdTkxQUIsIHQ9MiBtYXliZSBcdTYwMjVcdThBM0EvXHU0RTJEXHU5MUFCLCB0PTMgXHU0RjRGXHU5NjYyLFxuICAgICAgLy8gdD00IFx1NzI1OVx1OTFBQlx1MjAyNiBkb24ndCBoYXZlIGFuIGF1dGhvcml0YXRpdmUgbWFwcGluZyBzbyB3ZSBwcm9iZS5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgWzEsIDIsIDMsIDQsIDVdKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCB0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSAoci5ib2R5Py5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiB7IGJvZHk6IHIuYm9keSwgdCB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGJvZHk6IG51bGwgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIC8vIFBhaXIgZWFjaCBkZXRhaWwgYm9keSBiYWNrIHRvIGl0cyB2aXNpdCBwb3NpdGlvbi5cbiAgY29uc3QgYnlJZHggPSBuZXcgTWFwKCk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxcy5sZW5ndGg7IGkrKykge1xuICAgIGJ5SWR4LnNldChyZXFzW2ldLmlkeCwgcmVzdWx0c1tpXT8uYm9keSB8fCBudWxsKTtcbiAgfVxuICByZXR1cm4gYnlJZHg7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0Zyb21TMDJEZXRhaWwoYm9keSkge1xuICBpZiAoIWJvZHkpIHJldHVybiBudWxsO1xuICBjb25zdCBtYWluID0gKGJvZHkuaWhrZTMzMDNTMDJfbWFpbl9kYXRhKSB8fCBbXTtcbiAgaWYgKG1haW4ubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdG4gPSBTdHJpbmcobWFpblswXS5ob3NwX0RBVEFfVFlQRV9OQU1FIHx8IFwiXCIpO1xuICBpZiAodG4uaW5jbHVkZXMoXCJcdTYwMjVcIikpIHJldHVybiBcIkVNRVJcIjsgIC8vIFx1NjAyNVx1OEEzQVxuICBpZiAodG4uaW5jbHVkZXMoXCJcdTRGNEZcdTk2NjJcIikpIHJldHVybiBcIklNUFwiO1xuICAvLyBcdTg5N0ZcdTkxQUIgLyBcdTRFMkRcdTkxQUIgLyBcdTcyNTlcdTkxQUIgLyBcdTg1RTVcdTVDNDAgYWxsIGRlZmF1bHQgdG8gQU1CXG4gIHJldHVybiBcIkFNQlwiO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgcGF0aWVudE92ZXJyaWRlKSB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBwYWdlX3R5cGUsXG4gICAgICBob3N0OiBOSElfSE9TVCxcbiAgICAgIGl0ZW1zLFxuICAgICAgcGF0aWVudF9vdmVycmlkZTogcGF0aWVudE92ZXJyaWRlIHx8IG51bGwsXG4gICAgfSksXG4gIH0pO1xuICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcihgUE9TVCB1cGxvYWQtc3RydWN0dXJlZCAke3Iuc3RhdHVzfTogJHsoYXdhaXQgci50ZXh0KCkpLnNsaWNlKDAsIDIwMCl9YCk7XG4gIHJldHVybiBhd2FpdCByLmpzb24oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExvY2FsIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gUnVucyB0aGUgc2FtZSBtYXBwZXJzIHRoZSBiYWNrZW5kIHJ1bnMsIHRoZW4gdHJpZ2dlcnMgYSBkb3dubG9hZCBvZiB0aGVcbi8vIHJlc3VsdGluZyBGSElSIEJ1bmRsZS4gTm90aGluZyBsZWF2ZXMgdGhlIHVzZXIncyBtYWNoaW5lOyBubyBiYWNrZW5kXG4vLyByZXF1aXJlZC4gTWlycm9ycyBiYWNrZW5kL3VwbG9hZC1zdHJ1Y3R1cmVkIG9yZGVyOiBlbmNvdW50ZXJzIGZpcnN0IHNvXG4vLyB0aGF0IGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMgY2FuIGF0dGFjaCByZWZlcmVuY2VzIHRvIGRvd25zdHJlYW1cbi8vIG9ic2VydmF0aW9ucy9tZWRpY2F0aW9ucy9ldGMuXG5cbmNvbnN0IF9MT0NBTF9QQUdFX1RZUEVfT1JERVIgPSBbXG4gIFwiZW5jb3VudGVyc1wiLFxuICBcIm9ic2VydmF0aW9uc1wiLFxuICBcIm1lZGljYXRpb25zXCIsXG4gIFwiY29uZGl0aW9uc1wiLFxuICBcImFsbGVyZ2llc1wiLFxuICBcImRpYWdub3N0aWNfcmVwb3J0c1wiLFxuICBcInByb2NlZHVyZXNcIixcbl07XG5cbi8vIENoZWFwIHByZS1mbGlnaHQ6IGRvZXMgdGhpcyBOSEkgdGFiIGhhdmUgYW4gYXV0aGVudGljYXRlZCBzZXNzaW9uP1xuLy8gVXNlcyB0aGUgc2FtZSBzZXNzaW9uU3RvcmFnZS50b2tlbiArIGxpZ2h0d2VpZ2h0IEFQSSBjYWxsIHBhdHRlcm4gYXNcbi8vIF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaS4gRG9lc24ndCByZXR1cm4gYW55dGhpbmcgUElJIFx1MjAxNCBqdXN0IGFcbi8vIGJvb2xlYW4gZm9yIHRoZSBwb3B1cCB0byBkZWNpZGUgd2hldGhlciB0byBzdXJmYWNlIGEgXCJsb2cgaW4gZmlyc3RcIlxuLy8gYmFubmVyLiBSZXR1cm5zIG51bGwgd2hlbiB3ZSBjYW4ndCB0ZWxsIChzY3JpcHQtaW5qZWN0aW9uIGJsb2NrZWQsXG4vLyB0aW1lb3V0LCBldGMuKSBzbyB0aGUgcG9wdXAgY2FuIGZhbGwgYmFjayB0byBcImVuYWJsZWRcIiByYXRoZXIgdGhhblxuLy8gc2NhcmluZyB0aGUgdXNlciB3aXRoIGEgZmFsc2UgbmVnYXRpdmUuXG5hc3luYyBmdW5jdGlvbiBfY2hlY2tOaGlMb2dpblN0YXRlKHRhYklkKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTYW1lIGVuZHBvaW50IGFzIHRoZSBjaWQgYXV0by1mZXRjaCBcdTIwMTQga25vd24gdG8gbmVlZCBhblxuICAgICAgICAgIC8vIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbiBhbmQgdG8gYmUgY2hlYXAuXG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKFwiL2FwaS9paGtlMzAwMC9paGtlMzQxMHMwMS9wYWdlX2xvYWRcIiwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIiwgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3R9YCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIDQwMS80MDMgXHUyMTkyIHNlc3Npb24gdG9rZW4gcmVqZWN0ZWQuIDIwMCBcdTIxOTIgbG9nZ2VkIGluLlxuICAgICAgICAgIHJldHVybiByLm9rO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHR5cGVvZiByZXN1bHQgPT09IFwiYm9vbGVhblwiID8gcmVzdWx0IDogbnVsbDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBlbmRwb2ludCBJSEtFMzQxMFMwMSAoXHU2MjExXHU2M0E1XHU3QTJFXHU3RDAwXHU5MzA0IC8gQ09WSUQgXHU3QkU5XHU2QUEyXHU3RDAwXHU5MzA0KSBoYXBwZW5zXG4vLyB0byBjYXJyeSB0aGUgbG9nZ2VkLWluIHVzZXIncyByZWFsIGNpdGl6ZW4gSUQgaW4gdGhlIHJlc3BvbnNlIChgY2lkYFxuLy8gZmllbGQsIGUuZy4gXCJQMTIzNDUwODY2XCIpLiBVc2UgaXQgdG8gc2VlZCAvIHJlZnJlc2ggdGhlIHBhdGllbnRfXG4vLyBvdmVycmlkZSdzIGlkX25vIHNvIGl0IGFsd2F5cyB0cmFja3MgXCJ3aG9zZSBzZXNzaW9uIGlzIGN1cnJlbnRseVxuLy8gYWN0aXZlIGluIHRoZSBOSEkgdGFiXCIuXG4vL1xuLy8gSGlzdG9yeSBub3RlOiB0aGlzIGZ1bmN0aW9uIHVzZWQgdG8gZWFybHktcmV0dXJuIHdoZW5ldmVyIGlkX25vIHdhc1xuLy8gYWxyZWFkeSBhIHJlYWwtbG9va2luZyBjaWQgKFwiZG9uJ3QgdG91Y2ggYSBtYW51YWxseS1lbnRlcmVkIElEXCIpLlxuLy8gVGhhdCBzaG9ydC1jaXJjdWl0IHByZS1kYXRlZCB2MC42LjAgd2hpY2ggcmVtb3ZlZCBpZF9ubyBmcm9tIHRoZSBVSVxuLy8gXHUyMDE0IHRoZXJlJ3Mgbm8gXCJtYW51YWxcIiBwYXRoIGFueW1vcmUsIHRoZSBmaWVsZCBpcyBwdXJlbHkgaW50ZXJuYWwuXG4vLyBUaGUgc2hvcnQtY2lyY3VpdCBhbHNvIHByb2R1Y2VkIHRoZSBidWcgcGF0dGVybjogdXNlciBzdGFydHMgc3luY1xuLy8gd2l0aCBQYXRpZW50IEIgbG9nZ2VkIGluIChjaWRfQiB3cml0dGVuIHRvIG92ZXJyaWRlKSwgcmVhbGlzZXMgd3Jvbmdcbi8vIHRhYiwgc3dpdGNoZXMgTkhJIHRhYiB0byBQYXRpZW50IEEsIHJlLXN5bmNzIFx1MjAxNCBpZF9ubyBzdGF5cyBjaWRfQlxuLy8gYmVjYXVzZSBcImFscmVhZHkgYSByZWFsIGNpZFwiLiBOb3cgd2UgYWx3YXlzIHByb2JlIGFuZCBmb2xsb3cgdGhlXG4vLyBzZXNzaW9uJ3MgdHJ1dGguIE1hbnVhbCBvdmVycmlkZSBpcyBnb25lLCBOSEkgc2Vzc2lvbiBpcyBhdXRob3JpdGF0aXZlLlxuYXN5bmMgZnVuY3Rpb24gX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpKHRhYklkLCBwYXRpZW50T3ZlcnJpZGUpIHtcbiAgY29uc3QgY3VycmVudCA9IHBhdGllbnRPdmVycmlkZS5pZF9ubyB8fCBcIlwiO1xuXG4gIGxldCBjaWQgPSBudWxsO1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0KSByZXR1cm4gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goXCIvYXBpL2loa2UzMDAwL2loa2UzNDEwczAxL3BhZ2VfbG9hZFwiLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLCBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dH1gIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgcmV0dXJuIGJvZHk/LmNpZCB8fCBudWxsO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBWYWxpZGF0ZSBpdCBsb29rcyBsaWtlIGEgVGFpd2FuIG5hdGlvbmFsIElEICgxIGxldHRlciArIDkgZGlnaXRzKVxuICAgIC8vIGJlZm9yZSB0cnVzdGluZyBpdC4gQXZvaWRzIGFjY2lkZW50YWxseSBwcm9tb3RpbmcgZ2FyYmFnZSB0byB0aGVcbiAgICAvLyBQYXRpZW50IHJlc291cmNlJ3MgdW5pcXVlIGtleS5cbiAgICBpZiAocmVzdWx0ICYmIC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChyZXN1bHQpKSBjaWQgPSByZXN1bHQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIElIS0UzNDEwIGNpZCBmZXRjaCBmYWlsZWQ6XCIsIGU/Lm1lc3NhZ2UgPz8gZSk7XG4gIH1cblxuICBpZiAoY2lkICYmIGNpZCAhPT0gY3VycmVudCkge1xuICAgIHBhdGllbnRPdmVycmlkZSA9IHsgLi4ucGF0aWVudE92ZXJyaWRlLCBpZF9ubzogY2lkIH07XG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcGF0aWVudE92ZXJyaWRlIH0pLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIC8vIFBhdGllbnQtc3dpdGNoIGNsZWFudXAuIElmIHRoZSBjaWQganVzdCBjaGFuZ2VkIGZyb20gb25lIHJlYWxcbiAgICAvLyBjaWQgdG8gYW5vdGhlciAobm90IGp1c3QgXCJhdXRvLVhYWFggXHUyMTkyIHJlYWwgY2lkXCIgZmlyc3Qtc3luYyBzd2FwKSxcbiAgICAvLyB0aGUgcHJldmlvdXNseS1zdGFzaGVkIEZISVIgYnVuZGxlIGJlbG9uZ3MgdG8gdGhlIE9USEVSIHBhdGllbnQuXG4gICAgLy8gRHJvcCBpdCBzbyB0aGUgcG9wdXAncyBkb3dubG9hZCBidXR0b24gZG9lc24ndCBrZWVwIG9mZmVyaW5nIHRoZVxuICAgIC8vIHdyb25nIHBhdGllbnQncyBmaWxlLiBTYW1lIHNldCBvZiB3aXBlcyBwb3B1cC5qcyBkb2VzIGluXG4gICAgLy8gc2F2ZVBhdGllbnRPdmVycmlkZSB3aGVuIGl0IGRldGVjdHMgcGF0aWVudENoYW5nZWQuXG4gICAgY29uc3Qgc3dpdGNoZWRSZWFsUGF0aWVudHMgPVxuICAgICAgY3VycmVudCAmJiAhY3VycmVudC5zdGFydHNXaXRoKFwiYXV0by1cIikgJiYgY3VycmVudCAhPT0gY2lkO1xuICAgIGlmIChzd2l0Y2hlZFJlYWxQYXRpZW50cykge1xuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFBFTkRJTkdfQlVORExFX0tFWSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGF0aWVudE92ZXJyaWRlO1xufVxuXG4vLyBSZWFkIHRoZSBtYXNrLW5hbWUgcHJlZmVyZW5jZSBmcmVzaCBmcm9tIHN0b3JhZ2UuIFdlIGRvbid0IGNhY2hlIFx1MjAxNFxuLy8gcnVuTmhpQXBpU3luYyBpcyBpbnZva2VkIGF0IG1vc3QgYSBmZXcgdGltZXMgcGVyIHNlc3Npb24gYW5kIHRoZSBTV1xuLy8gY2FuIGJlIHRvcm4gZG93biArIHJlc3RhcnRlZCBhbnkgdGltZSwgc28gYSBzaW5nbGUgZ2V0KCkgcGVyIHN5bmMgaXNcbi8vIGNoZWFwZXIgdGhhbiBzeW5jaW5nIHN0YXRlIGFjcm9zcyBTVyBsaWZlY3ljbGVzLlxuYXN5bmMgZnVuY3Rpb24gX2lzTWFza0VuYWJsZWQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBtYXNrTmFtZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcIm1hc2tOYW1lRW5hYmxlZFwiKTtcbiAgICByZXR1cm4gbWFza05hbWVFbmFibGVkID09PSB0cnVlO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2J1aWxkT3ZlcnJpZGVQYXRpZW50KG92LCBtYXNrRW5hYmxlZCkge1xuICBjb25zdCBkaXNwbGF5TmFtZSA9IG1hc2tFbmFibGVkID8gbWFza05hbWUob3YubmFtZSB8fCBcIlwiKSA6IG92Lm5hbWUgfHwgXCJcIjtcbiAgY29uc3QgcmF3ID0ge1xuICAgIGlkOiBvdi5pZF9ubyxcbiAgICBpZGVudGlmaWVyOiBvdi5pZF9ubyxcbiAgICBuYW1lOiBkaXNwbGF5TmFtZSB8fCBvdi5pZF9ubyxcbiAgfTtcbiAgaWYgKG92LmJpcnRoX2RhdGUpIHJhdy5iaXJ0aERhdGUgPSBvdi5iaXJ0aF9kYXRlO1xuICBpZiAob3YuZ2VuZGVyKSByYXcuZ2VuZGVyID0gb3YuZ2VuZGVyO1xuICByZXR1cm4gbWFwUGF0aWVudChyYXcpO1xufVxuXG4vLyBXYWxrIGEgSlNPTi1saWtlIHZhbHVlIGFuZCByZXBsYWNlIGV2ZXJ5IHN0cmluZyB0b2tlbiBlcXVhbCB0byBvclxuLy8gY29udGFpbmluZyBgbmVlZGxlYCB3aXRoIGByZXBsYWNlbWVudGAuIFVzZWQgdG8gc2NydWIgdGhlIHJlYWxcbi8vIHBhdGllbnQgbmFtZSBvdXQgb2YgTkhJIG5hcnJhdGl2ZSBmaWVsZHMgKGNsaW5pY2FsX25vdGUsIGNvbmNsdXNpb24sXG4vLyBub3RlLCBldGMuKSBiZWZvcmUgdGhlIGl0ZW1zIHJlYWNoIHRoZSBtYXBwZXIuIE9ubHkgdHJpZ2dlcmVkIHdoZW5cbi8vIHRoZSB1c2VyIGhhcyBvcHRlZCBpbnRvIG1hc2tpbmcgQU5EIHN1cHBsaWVkIGEgbmFtZSBcdTIwMTQgYW5kIHRoZVxuLy8gc3Vic3RpdHV0aW9uIGlzIGV4YWN0LXRva2VuLXJlcGxhY2UsIG5vdCBmdXp6eSwgc28gaXQgY2FuJ3Qgc3VycHJpc2Vcbi8vIHRoZSB1c2VyIGJ5IGNsb2JiZXJpbmcgdW5yZWxhdGVkIGNvbnRlbnQuXG5mdW5jdGlvbiBfcmVwbGFjZU5hbWVEZWVwKHZhbHVlLCBuZWVkbGUsIHJlcGxhY2VtZW50KSB7XG4gIGlmICghbmVlZGxlIHx8IG5lZWRsZSA9PT0gcmVwbGFjZW1lbnQpIHJldHVybiB2YWx1ZTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHZhbHVlLnNwbGl0KG5lZWRsZSkuam9pbihyZXBsYWNlbWVudCk7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkgcmV0dXJuIHZhbHVlLm1hcCgodikgPT4gX3JlcGxhY2VOYW1lRGVlcCh2LCBuZWVkbGUsIHJlcGxhY2VtZW50KSk7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gdmFsdWUpIG91dFtrXSA9IF9yZXBsYWNlTmFtZURlZXAodmFsdWVba10sIG5lZWRsZSwgcmVwbGFjZW1lbnQpO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBfYXNzZW1ibGVMb2NhbEJ1bmRsZShieVR5cGUsIHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpIHtcbiAgY29uc3QgcGF0aWVudCA9IF9idWlsZE92ZXJyaWRlUGF0aWVudChwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKTtcbiAgY29uc3QgcGlkID0gcGF0aWVudC5pZDtcbiAgY29uc3QgYWxsID0gW3BhdGllbnRdO1xuXG4gIGZvciAoY29uc3QgcHQgb2YgX0xPQ0FMX1BBR0VfVFlQRV9PUkRFUikge1xuICAgIGNvbnN0IGl0ZW1zID0gYnlUeXBlW3B0XTtcbiAgICBpZiAoIWl0ZW1zIHx8IGl0ZW1zLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgbGV0IG1hcHBlZDtcbiAgICBpZiAoR1JPVVBfSEFORExFUlNbcHRdKSB7XG4gICAgICBtYXBwZWQgPSBHUk9VUF9IQU5ETEVSU1twdF0oaXRlbXMsIHBpZCk7XG4gICAgfSBlbHNlIGlmIChMSVNUX0hBTkRMRVJTW3B0XSkge1xuICAgICAgY29uc3QgW2ZuXSA9IExJU1RfSEFORExFUlNbcHRdO1xuICAgICAgbWFwcGVkID0gaXRlbXNcbiAgICAgICAgLmZpbHRlcigoaXQpID0+IGl0ICYmIHR5cGVvZiBpdCA9PT0gXCJvYmplY3RcIilcbiAgICAgICAgLm1hcCgoaXQpID0+IGZuKGl0LCBwaWQpKVxuICAgICAgICAuZmlsdGVyKChyKSA9PiByICE9PSBudWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChwdCA9PT0gXCJlbmNvdW50ZXJzXCIpIG1hcHBlZCA9IGRlZHVwQWRtaXNzaW9uRGF5QW1iKG1hcHBlZCk7XG4gICAgYWxsLnB1c2goLi4ubWFwcGVkKTtcbiAgfVxuXG4gIC8vIERlZHVwIGJ5IChyZXNvdXJjZVR5cGUsIGlkKSBiZWZvcmUgYXNzZW1ibGluZyB0aGUgQnVuZGxlLiBNdWx0aXBsZVxuICAvLyBOSEkgZW5kcG9pbnRzIGNhbiBmZWVkIHRoZSBzYW1lIHBhZ2VfdHlwZSAoZS5nLiBlbmNvdW50ZXJzIC9cbiAgLy8gaW5wYXRpZW50IC8gaW5wYXRpZW50X2xlZ2FjeSBhbGwgXHUyMTkyIHBhZ2VfdHlwZT1cImVuY291bnRlcnNcIiksIGFuZCB0aGVcbiAgLy8gbWFwcGVyIHByb2R1Y2VzIGRldGVybWluaXN0aWMgc3RhYmxlIElEcyBcdTIwMTQgc28gdHdvIHJhdyBpdGVtcyB0aGF0XG4gIC8vIGRlc2NyaWJlIHRoZSBzYW1lIG1lZGljYWwgZXZlbnQgY29sbGFwc2UgdG8gb25lIHJlc291cmNlLiBCYWNrZW5kXG4gIC8vIHVwc2VydCBoYW5kbGVzIHRoaXMgYXV0b21hdGljYWxseSAoc2FtZSBzdGFibGUgSUQgPSBzYW1lIERCIHJvdyk7XG4gIC8vIGxvY2FsIG1vZGUgaGFzIHRvIGRvIGl0IGV4cGxpY2l0bHkuIFdpdGhvdXQgdGhpcyBkZWR1cCwgdGhlIGxvY2FsXG4gIC8vIEJ1bmRsZSBlbmRzIHVwIGluZmxhdGVkIHJlbGF0aXZlIHRvIHdoYXQgYmFja2VuZCBzdG9yZXMgZnJvbSB0aGVcbiAgLy8gaWRlbnRpY2FsIE5ISSBpbnB1dC5cbiAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgY29uc3QgdW5pcXVlID0gW107XG4gIGZvciAoY29uc3QgciBvZiBhbGwpIHtcbiAgICBjb25zdCBrZXkgPSBgJHtyLnJlc291cmNlVHlwZX0vJHtyLmlkfWA7XG4gICAgaWYgKHNlZW4uaGFzKGtleSkpIGNvbnRpbnVlO1xuICAgIHNlZW4uYWRkKGtleSk7XG4gICAgdW5pcXVlLnB1c2gocik7XG4gIH1cblxuICAvLyBMaW5rZXIgKyBzZXgtc3RyYXRpZmllZCByZXNvbHZlciBydW4gb25jZSBvdmVyIHRoZSBmdWxsIGFzc2VtYmxlZFxuICAvLyBsaXN0IChzYW1lIHBpcGVsaW5lIGJhY2tlbmQncyAvc3luYy91cGxvYWQtc3RydWN0dXJlZCBydW5zLCBqdXN0XG4gIC8vIGFnYWluc3QgYW4gaW4tbWVtb3J5IGNhbmRpZGF0ZSBhcnJheSBpbnN0ZWFkIG9mIGEgU1FMaXRlIHF1ZXJ5KS5cbiAgbGlua0VuY291bnRlcnNJblJlc291cmNlcyh1bmlxdWUsIHVuaXF1ZSk7XG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzKHBhdGllbnQsIHVuaXF1ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQnVuZGxlXCIsXG4gICAgdHlwZTogXCJjb2xsZWN0aW9uXCIsXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvXFwuXFxkK1okLywgXCJaXCIpLFxuICAgIGVudHJ5OiB1bmlxdWUubWFwKChyKSA9PiAoe1xuICAgICAgZnVsbFVybDogYCR7ci5yZXNvdXJjZVR5cGV9LyR7ci5pZH1gLFxuICAgICAgcmVzb3VyY2U6IHIsXG4gICAgfSkpLFxuICB9O1xufVxuXG4vLyBMb2NhbCBtb2RlIHN0YXNoZXMgdGhlIGFzc2VtYmxlZCBCdW5kbGUgaW4gY2hyb21lLnN0b3JhZ2UubG9jYWwgdW5kZXJcbi8vIGEgc2luZ2xlIFwicGVuZGluZ0ZoaXJCdW5kbGVcIiBzbG90LiBUaGUgcG9wdXAgc2hvd3MgYSBkb3dubG9hZCBidXR0b25cbi8vIHdoZW4gdGhpcyBzbG90IGlzIG5vbi1lbXB0eTsgdGhlIGFjdHVhbCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGNhbGxcbi8vIGhhcHBlbnMgZnJvbSB0aGUgcG9wdXAgKGluIHJlc3BvbnNlIHRvIGEgdXNlciBjbGljaykgc28gdGhlIGZpbGVcbi8vIGRvZXNuJ3QgYXBwZWFyIGluIHRoZSBEb3dubG9hZHMgYmFyIHVuaW52aXRlZC5cbi8vXG4vLyBTaW5nbGUgc2xvdCBtZWFucyBhIG5ldyBzeW5jIG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzIHBlbmRpbmcgYnVuZGxlLlxuLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwgZGVmYXVsdCBxdW90YSBpcyAxMCBNQjsgYSB0eXBpY2FsIE5ISSBzeW5jIGlzXG4vLyB3ZWxsIHVuZGVyIDIgTUIuXG5jb25zdCBQRU5ESU5HX0JVTkRMRV9LRVkgPSBcInBlbmRpbmdGaGlyQnVuZGxlXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50SWQsIGRhdGVSYW5nZSkge1xuICAvLyBGaWxlbmFtZTogbmhpLXtwaWR9LXtzdGFydFlZWVlNTUREfS17ZW5kWVlZWU1NRER9Lmpzb25cbiAgLy8gV2hlbiBubyBleHBsaWNpdCBkYXRlUmFuZ2UgKE5ISSBkZWZhdWx0ID0gXHU4RkQxIDEgXHU1RTc0KSwgc3ludGhlc2l6ZSB0b2RheS0xeSBcdTIxOTIgdG9kYXkuXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgXCIwXCIpO1xuICBjb25zdCBmbXQgPSAoZCkgPT4gYCR7ZC5nZXRGdWxsWWVhcigpfSR7cGFkKGQuZ2V0TW9udGgoKSArIDEpfSR7cGFkKGQuZ2V0RGF0ZSgpKX1gO1xuICAvLyBIYWxmLW1hc2sgdGhlIElEIGluIHRoZSBmaWxlbmFtZSBzbyB0aGUgdXNlcidzIERvd25sb2FkcyBmb2xkZXJcbiAgLy8gZG9lc24ndCBsZWFrIHRoZSBmdWxsIFx1OEVBQlx1NTIwNlx1OEI0OSAod291bGQgYmUgdmlzaWJsZSB0byBhbnlvbmUgc2VlaW5nXG4gIC8vIGEgZmlsZSBsaXN0aW5nIG9yIGRvd25sb2FkLWJhciBwcmV2aWV3KS4gYFhgIGJlY2F1c2UgYCpgIGlzXG4gIC8vIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gQnVuZGxlIENPTlRFTlRTIHN0aWxsIGNhcnJ5IHRoZSByZWFsXG4gIC8vIElEIHVuZGVyIFBhdGllbnQuaWQgXHUyMDE0IGZpbGUgb3duZXIga25vd3Mgd2hvc2UgZGF0YSBpdCBpcy5cbiAgY29uc3QgbWFza2VkUGlkID0gbWFza0lkKHBhdGllbnRJZCB8fCBcInVua25vd25cIiwgXCJYXCIpO1xuICBjb25zdCBzYWZlUGlkID0gbWFza2VkUGlkLnJlcGxhY2UoL1teQS1aYS16MC05Xy1dL2csIFwiX1wiKTtcbiAgY29uc3QgY29tcGFjdCA9IChkKSA9PiAoZCB8fCBcIlwiKS5zbGljZSgwLCAxMCkucmVwbGFjZSgvLS9nLCBcIlwiKTtcbiAgbGV0IHMsIGU7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIHMgPSBjb21wYWN0KGRhdGVSYW5nZS5zdGFydCkgfHwgZm10KG5vdyk7XG4gICAgZSA9IGNvbXBhY3QoZGF0ZVJhbmdlLmVuZCkgfHwgZm10KG5vdyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb25lWWVhckFnbyA9IG5ldyBEYXRlKG5vdyk7XG4gICAgb25lWWVhckFnby5zZXRGdWxsWWVhcihvbmVZZWFyQWdvLmdldEZ1bGxZZWFyKCkgLSAxKTtcbiAgICBzID0gZm10KG9uZVllYXJBZ28pO1xuICAgIGUgPSBmbXQobm93KTtcbiAgfVxuICBjb25zdCBmaWxlbmFtZSA9IGBuaGktJHtzYWZlUGlkfS0ke3N9LSR7ZX0uanNvbmA7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShidW5kbGUsIG51bGwsIDIpO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIFtQRU5ESU5HX0JVTkRMRV9LRVldOiB7XG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGpzb24sXG4gICAgICBieXRlczoganNvbi5sZW5ndGgsXG4gICAgICBnZW5lcmF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIHBhdGllbnRJZDogcGF0aWVudElkIHx8IG51bGwsXG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiB7IGZpbGVuYW1lLCBieXRlczoganNvbi5sZW5ndGggfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuTmhpQXBpU3luYyh7IHRhYklkLCBtb2RlLCBiYWNrZW5kLCBzeW5jQXBpS2V5LCBuaGlCYXNlLCBwYXRpZW50T3ZlcnJpZGUsIGRhdGVSYW5nZSwgZGF0ZVJhbmdlTGFiZWwgfSkge1xuICBfY2FuY2VsbGVkID0gZmFsc2U7XG4gIGNvbnN0IEJBU0UgPSBuaGlCYXNlIHx8IGBodHRwczovLyR7TkhJX0hPU1R9YDtcblxuICBpZiAoIXBhdGllbnRPdmVycmlkZSkge1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU4QUNCXHU1MTQ4XHU1NzI4IHBvcHVwIFx1NTg2Qlx1NUJFQlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1NUY4Q1x1NTE4RFx1OEE2NlwiLFxuICAgICAgICBwaGFzZTogXCJlcnJvclwiLCB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCF0YWJJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkFQSSBzeW5jIHJlcXVpcmVzIE5ISSB0YWIgaWQgKGNvb2tpZXMgYXJlIGZpcnN0LXBhcnR5KVwiKTtcbiAgfVxuXG4gIC8vIEZpcnN0IGNoYW5jZSB0byB1cGdyYWRlIHRoZSBwYXRpZW50IElEOiBpZiB0aGUgcG9wdXAgZ2F2ZSB1cyBhblxuICAvLyBcImF1dG8tWFhYWFhYWFhcIiBwbGFjZWhvbGRlciAodXNlciBkaWRuJ3QgbWFudWFsbHkgdHlwZSBvbmUpLFxuICAvLyBmZXRjaCB0aGUgcmVhbCBvbmUgZnJvbSBOSEkncyBJSEtFMzQxMFMwMSBlbmRwb2ludCAocmVzcG9uc2UuY2lkXG4gIC8vIGlzIHRoZSBjaXRpemVuIElEKS4gUGVyc2lzdCBiYWNrIHRvIHN0b3JhZ2Ugc28gc3Vic2VxdWVudCBzeW5jc1xuICAvLyBhcmUgc3RhYmxlLiBNYW51YWxseS10eXBlZCBJRHMgYXJlIHJlc3BlY3RlZCBhcy1pcy5cbiAgcGF0aWVudE92ZXJyaWRlID0gYXdhaXQgX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpKHRhYklkLCBwYXRpZW50T3ZlcnJpZGUpO1xuXG4gIC8vIFN0YXNoIGNvbnRleHQgc28gdGhlIHN0b3BTeW5jIG1lc3NhZ2UgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4gIC8vIGRhdGEgKERFTEVURSAvc3luYy9wYXRpZW50L3tpZF9ub30pIHdpdGhvdXQgdXMgaGF2aW5nIHRvIHNlbmQgaXRcbiAgLy8gYmFjayB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlLlxuICBfYWN0aXZlU3luY0N0eCA9IHsgYmFja2VuZCwgc3luY0FwaUtleSwgcGF0aWVudElkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfTtcblxuICAvLyBXYWxsLWNsb2NrIHN0YXJ0IHRpbWUgXHUyMDE0IHVzZWQgdG8gY29tcHV0ZSBlbGFwc2VkIHNlY29uZHMgZm9yIHRoZVxuICAvLyBmaW5hbCBzdGF0dXMgbGluZSAoXCJcdTdFM0RcdTgwMTdcdTY2NDIgMTIuMyBcdTc5RDJcIikuIFN0YXNoIG9uIGEgbG9jYWwgc28gd2UgY2FuXG4gIC8vIHJlYWNoIGl0IGZyb20gdGhlIGNvbXBsZXRpb24gbWVzc2FnZSBhdCB0aGUgdmVyeSBlbmQuXG4gIGNvbnN0IF90MCA9IERhdGUubm93KCk7XG4gIC8vIFBlci1waGFzZSB0aW1pbmdzLCBzdXJmYWNlZCBpbnRvIHRoZSBwb3B1cCdzIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHNlZSBleGFjdGx5IHdoZXJlIHRpbWUgaXMgZ29pbmcuIEVhY2ggZW50cnk6IHsgbmFtZSwgbXMgfS5cbiAgY29uc3QgX3BoYXNlcyA9IFtdO1xuICBsZXQgX3BoYXNlU3RhcnQgPSBfdDA7XG4gIGNvbnN0IF9tYXJrUGhhc2UgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgX3BoYXNlcy5wdXNoKHsgbmFtZSwgbXM6IG5vdyAtIF9waGFzZVN0YXJ0IH0pO1xuICAgIF9waGFzZVN0YXJ0ID0gbm93O1xuICB9O1xuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IHRydWUsIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIiwgcGhhc2U6IFwiaW5pdFwiLFxuICAgIHN0YXJ0ZWQ6IF90MCwgdG90YWxSZXNvdXJjZXM6IDAsIGhvc3Q6IE5ISV9IT1NULCBlcnJvcnM6IFtdLFxuICB9KTtcblxuICAvLyBTdGVwIDE6IGZldGNoIGFsbCBlbmRwb2ludHMgaW4gUEFSQUxMRUwgaW5zaWRlIHRoZSBOSEkgdGFiLiBSdW5uaW5nIGluXG4gIC8vIHRhYiBjb250ZXh0IG1lYW5zIHNhbWUtb3JpZ2luIGNvb2tpZXMgYXJlIHNlbnQgYXV0b21hdGljYWxseSBcdTIwMTQgZmV0Y2hcbiAgLy8gZnJvbSB0aGUgU1cgd291bGQgYmUgY3Jvc3Mtb3JpZ2luIGFuZCBTYW1lU2l0ZSBibG9ja3MgdGhlIHNlc3Npb25cbiAgLy8gY29va2llLCBoZW5jZSB3ZSBnb3QgXCJzZXNzaW9uIGV4cGlyZWRcIiBldmVuIHdoZW4gbG9nZ2VkIGluLlxuICAvLyBQYXNzIG9ubHkgc2VyaWFsaXNhYmxlIGRhdGEgKHBhdGhzLCBtZXRob2QsIG5hbWUpOyBhZGFwdGVycyBzdGF5IGluIFNXLlxuICAvLyBJbmplY3QgSVNPLWRhdGUgcmFuZ2UgaW50byBlYWNoIGVuZHBvaW50IHRoYXQgc3VwcG9ydHMgaXQgKGNvbnZlcnRzXG4gIC8vIHRvIFx1NkMxMVx1NTcwQiBmb3JtYXQgdmlhIGlzb1RvUk9DKS4gU2tpcHBlZCBlbmRwb2ludHMga2VlcCB0aGVpciBkZWZhdWx0XG4gIC8vIE5ISS1zaWRlIHdpbmRvdyAoMS0yIHllYXJzIGRlcGVuZGluZyBvbiB0aGUgcGFnZSkuXG4gIGNvbnN0IGZldGNoU3BlYyA9IE5ISV9BUElfRU5EUE9JTlRTLm1hcCgoZXApID0+IHtcbiAgICBjb25zdCBwYXRoID0gZXAuc3VwcG9ydHNEYXRlUmFuZ2UgPyBhcHBseURhdGVSYW5nZVRvUGF0aChlcC5wYXRoLCBkYXRlUmFuZ2UpIDogZXAucGF0aDtcbiAgICByZXR1cm4geyBuYW1lOiBlcC5uYW1lLCB1cmw6IEJBU0UgKyBwYXRoLCBtZXRob2Q6IFwiR0VUXCIgfTtcbiAgfSk7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIGNvbnNvbGUubG9nKFwiW05ISSBBUEkgc3luY10gZGF0ZSByYW5nZTpcIixcbiAgICAgIGAke2RhdGVSYW5nZS5zdGFydCB8fCBcIih1bmJvdW5kZWQpXCJ9IFx1MjE5MiAke2RhdGVSYW5nZS5lbmQgfHwgXCIodW5ib3VuZGVkKVwifWApO1xuICB9XG5cbiAgbGV0IHNldHRsZWRSYXc7XG4gIHRyeSB7XG4gICAgW3sgcmVzdWx0OiBzZXR0bGVkUmF3IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKHNwZWNzKSA9PiB7XG4gICAgICAgIC8vIE5ISSBhdXRoOiBjb29raWVzICsgSldUIGluIHNlc3Npb25TdG9yYWdlLiBUaGUgU1BBJ3MgYXhpb3Mgc2V0c1xuICAgICAgICAvLyBgQXV0aG9yaXphdGlvbjogQmVhcmVyIDx0b2tlbj5gIG9uIGV2ZXJ5IEFQSSBjYWxsLiBTZXNzaW9uXG4gICAgICAgIC8vIGNvb2tpZXMgYWxvbmUgcmV0dXJuIDQwMS5cbiAgICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdG9rZW4pIHJldHVybiBbeyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9XTtcbiAgICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuXG4gICAgICAgIC8vIERldGVjdCBJRExFL3RpbWVvdXQgcGFnZSBhbHJlYWR5IHJlZGlyZWN0ZWQgb24gdGhpcyB0YWIuXG4gICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgICByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyA2MC1zZWNvbmQgdGltZW91dCBwZXIgZmV0Y2ggXHUyMDE0IHNvbWUgTkhJIGVuZHBvaW50cyAoZW5jb3VudGVycyxcbiAgICAgICAgLy8gbWVkcykgdGFrZSAyMCsgc2Vjb25kcy5cbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocywgbXMpIHtcbiAgICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgbXMpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2gocy51cmwsIHtcbiAgICAgICAgICAgICAgbWV0aG9kOiBzLm1ldGhvZCxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgICAgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBjb25zdCBjdCA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICAgIGlmICghY3QuaW5jbHVkZXMoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IGBub24tSlNPTiAoY3Q9JHtjdH0pYCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgICAgICB0cnkgeyBib2R5ID0gYXdhaXQgci5qc29uKCk7IH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiSlNPTiBwYXJzZTogXCIgKyBlLm1lc3NhZ2UgfTsgfVxuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBib2R5IH07XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGlmIChlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcInRpbWVvdXQgNjBzXCIgfTtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uY3VycmVuY3ktbGltaXRlZCBleGVjdXRpb246IG1heCAzIGluIGZsaWdodCBhdCBvbmNlLiBOSEknc1xuICAgICAgICAvLyBhYnVzZSBkZXRlY3Rpb24gYmxvY2tzIGJ1cnN0czsgd2l0aCAxMSBwYXJhbGxlbCBmZXRjaGVzIGl0XG4gICAgICAgIC8vIHRocm90dGxlZCB0aGUgc2Vzc2lvbiBhbmQgcmVkaXJlY3RlZCB0byBJSEtFMzAwMVM5OV9JRExFLlxuICAgICAgICAvLyAzIGF0IGEgdGltZSArIDIwMG1zIGppdHRlciBpcyBnZW50bGUgZW5vdWdoIGZvciAxLXNob3Qgc3luYy5cbiAgICAgICAgY29uc3QgQ09OQ1VSUkVOQ1kgPSAzO1xuICAgICAgICBjb25zdCBKSVRURVJfTVMgPSAyMDA7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBuZXcgQXJyYXkoc3BlY3MubGVuZ3RoKTtcbiAgICAgICAgbGV0IG5leHRJZHggPSAwO1xuICAgICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgICAgd2hpbGUgKG5leHRJZHggPCBzcGVjcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBuZXh0SWR4Kys7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIEpJVFRFUl9NUykpO1xuICAgICAgICAgICAgcmVzdWx0c1tpXSA9IGF3YWl0IGZldGNoT25lKHNwZWNzW2ldLCA2MDAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdvcmtlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DVVJSRU5DWSAmJiB3IDwgc3BlY3MubGVuZ3RoOyB3KyspIHtcbiAgICAgICAgICB3b3JrZXJzLnB1c2god29ya2VyKCkpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdvcmtlcnMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0sXG4gICAgICBhcmdzOiBbZmV0Y2hTcGVjXSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgZXhlY3V0ZVNjcmlwdCBmYWlsZWQ6ICR7ZS5tZXNzYWdlfWApO1xuICB9XG5cbiAgLy8gRGV0ZWN0IHNlc3Npb24gZXhwaXJlZCBhY3Jvc3MgcmVzdWx0cy5cbiAgaWYgKHNldHRsZWRSYXcuc29tZSgocikgPT4gci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgfVxuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuXG4gIC8vIEdlbmVyaWMgbGlzdCBleHRyYWN0aW9uOiBoYW5kbGVzIGFsbCBvYnNlcnZlZCBOSEkgc2hhcGVzLlxuICAvLyAgIC0gUGxhaW4gYXJyYXkgKElIS0UzNDA5IGxhYilcbiAgLy8gICAtIHtzcF9JSEtFPFg+X2RhdGE6IFsuLi5dfSAgKG1lZGljYXRpb25zLCBhbGxlcmdpZXMpXG4gIC8vICAgLSB7d2VzdGVybl9kYXRhLCBjaGluZXNlX2RhdGEsIGRlbnRpc3RfZGF0YTogWy4uLl19IChlbmNvdW50ZXIgbGlzdCxcbiAgLy8gICAgIHNwbGl0IGJ5IFx1ODk3Rlx1OTFBQi9cdTRFMkRcdTkxQUIvXHU3MjU5XHU5MUFCIFx1MjAxNCB3ZSB3YW50IGFsbCB0aHJlZSlcbiAgLy8gRm9yIG11bHRpLWFycmF5IHNoYXBlcyB3ZSBtZXJnZSBhbGwgYXJyYXlzIGFuZCB0YWcgZWFjaCBpdGVtIHdpdGhcbiAgLy8gYF9fc2VjdGlvbmAgKHRoZSBzb3VyY2Uga2V5KSBzbyBhZGFwdGVycyBjYW4gZGlzYW1iaWd1YXRlLlxuICBmdW5jdGlvbiBleHRyYWN0TGlzdChib2R5KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYm9keSkpIHJldHVybiBib2R5O1xuICAgIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIFtdO1xuICAgIGxldCBhcnJheUtleXMgPSBPYmplY3QuZW50cmllcyhib2R5KS5maWx0ZXIoKFtfLCB2XSkgPT4gQXJyYXkuaXNBcnJheSh2KSk7XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICBpZiAoYXJyYXlLZXlzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTtcbiAgICAvLyBNdWx0aXBsZSBhcnJheXMgXHUyMDE0IGRyb3AgVUktaGVscGVyIGFycmF5cyAoZHJvcGRvd24gb3B0aW9ucywgc29ydFxuICAgIC8vIHNlbGVjdG9ycywgbG9va3VwIHRhYmxlcykuIE5ISSBtaXhlcyB0aGVtIGludG8gdGhlIHNhbWUgcmVzcG9uc2VcbiAgICAvLyAoZS5nLiBpbWFnaW5nIHJldHVybnMgc3BfSUhLRTM0MDhTMDFfZGF0YSArIGljZDljbV9zZWxlY3QpLlxuICAgIGNvbnN0IEhFTFBFUl9SRSA9IC9zZWxlY3R8b3B0aW9ufGRyb3Bkb3dufGZpbHRlcnxzb3J0fGxvb2t1cC9pO1xuICAgIGNvbnN0IGRhdGFLZXlzID0gYXJyYXlLZXlzLmZpbHRlcigoW2tdKSA9PiAhSEVMUEVSX1JFLnRlc3QoaykpO1xuICAgIGlmIChkYXRhS2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBkYXRhS2V5c1swXVsxXTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gYXJyYXlLZXlzWzBdWzFdOyAvLyBmYWxsYmFja1xuICAgIGFycmF5S2V5cyA9IGRhdGFLZXlzO1xuICAgIC8vIE11bHRpcGxlIGRhdGEgYXJyYXlzIChlLmcuIHdlc3Rlcm5fZGF0YS9jaGluZXNlX2RhdGEvZGVudGlzdF9kYXRhKVxuICAgIC8vIFx1MjAxNCBtZXJnZSB3aXRoIF9fc2VjdGlvbiB0YWcgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBhcnJheUtleXMpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSB7XG4gICAgICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goeyAuLi5pdGVtLCBfX3NlY3Rpb246IGsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfVxuXG4gIC8vIEFwcGx5IFNXLXNpZGUgYWRhcHRlcnMgdG8gZWFjaCBlbmRwb2ludCdzIGJvZHkuXG4gIGNvbnN0IHNldHRsZWQgPSBzZXR0bGVkUmF3Lm1hcCgociwgaSkgPT4ge1xuICAgIGNvbnN0IGVwID0gTkhJX0FQSV9FTkRQT0lOVFNbaV07XG4gICAgaWYgKHIuZXJyb3IpIHtcbiAgICAgIHJldHVybiB7IHN0YXR1czogXCJyZWplY3RlZFwiLCByZWFzb246IHsgbWVzc2FnZTogYCR7ZXAubmFtZX06ICR7ci5lcnJvcn1gIH0gfTtcbiAgICB9XG4gICAgY29uc3QgbGlzdCA9IGV4dHJhY3RMaXN0KHIuYm9keSk7XG4gICAgLy8gQWRhcHRlcnMgcmV0dXJuIGVpdGhlcjpcbiAgICAvLyAgIC0gb25lIGl0ZW0gICAobW9zdCBhZGFwdGVycyBcdTIwMTQgbGFicywgbWVkcywgZW5jb3VudGVycywgaW1hZ2luZylcbiAgICAvLyAgIC0gbnVsbC91bmRlZmluZWQgKHNraXApXG4gICAgLy8gICAtIGFycmF5IG9mIGl0ZW1zIChhZGFwdEFkdWx0UHJldmVudGl2ZSBcdTIwMTQgdW5mb2xkcyBvbmUgc2NyZWVuaW5nXG4gICAgLy8gICAgIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbiBlbnRyaWVzKVxuICAgIC8vIEZsYXQtaGFuZGxlIGJvdGggc2hhcGVzIHNvIGVhY2ggYWRhcHRlciBjYW4gcGljayB3aGF0ZXZlcidzIGNsZWFyZXN0LlxuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgZm9yIChjb25zdCBpdCBvZiBsaXN0KSB7XG4gICAgICBjb25zdCByID0gZXAuYWRhcHQoaXQpO1xuICAgICAgaWYgKHIgPT09IG51bGwgfHwgciA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHIpKSB7XG4gICAgICAgIGZvciAoY29uc3QgeCBvZiByKSBpZiAoeCkgaXRlbXMucHVzaCh4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zLnB1c2gocik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNuYXBzaG90IGEgYm9keSBzYW1wbGUgZm9yIHNoYXBlcyB3aGVyZSBhZGFwdGVyIHJlamVjdGVkIGV2ZXJ5dGhpbmdcbiAgICAvLyBcdTIwMTQgdXNlZCBieSB0aGUgZGlhZ25vc3RpYyBicmVha2Rvd24gaW4gc3RlcCAyLlxuICAgIGxldCBib2R5U2FtcGxlID0gbnVsbDtcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gSW5jbHVkZSB0aGUgRklSU1QgSVRFTSAoZnVsbCBrZXlzK3ZhbHVlcykgc28gd2UgY2FuIGJ1aWxkIHRoZVxuICAgICAgLy8gY29ycmVjdCBhZGFwdGVyIHdpdGhvdXQgYW5vdGhlciByb3VuZC10cmlwLiBOSEkgaXRlbXMgbWF5IGluY2x1ZGVcbiAgICAgIC8vIFBJSTsgdGhlIHVzZXIgaW5zcGVjdHMgdGhpcyBsb2NhbGx5IHZpYSBzZXJ2aWNlLXdvcmtlciBkZXZ0b29scy5cbiAgICAgIGJvZHlTYW1wbGUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHRvcExldmVsS2V5czogQXJyYXkuaXNBcnJheShyLmJvZHkpID8gbnVsbCA6IE9iamVjdC5rZXlzKHIuYm9keSB8fCB7fSkuc2xpY2UoMCwgMTApLFxuICAgICAgICB3YXNBcnJheTogQXJyYXkuaXNBcnJheShyLmJvZHkpLFxuICAgICAgICBmaXJzdEl0ZW06IGxpc3RbMF0gPz8gbnVsbCxcbiAgICAgICAgc2Vjb25kSXRlbTogbGlzdFsxXSA/PyBudWxsLFxuICAgICAgfSkuc2xpY2UoMCwgNDAwMCk7XG4gICAgfVxuICAgIHJldHVybiB7IHN0YXR1czogXCJmdWxmaWxsZWRcIiwgdmFsdWU6IHsgZXAsIGl0ZW1zLCByYXdfY291bnQ6IGxpc3QubGVuZ3RoLCBib2R5U2FtcGxlLCByYXdMaXN0OiBsaXN0IH0gfTtcbiAgfSk7XG5cbiAgX21hcmtQaGFzZShcIm5oaS1wYXJhbGxlbFwiKTtcblxuICAvLyBTdGVwIDFhOiBlbmNvdW50ZXIgZGV0YWlsIGZhbi1vdXQgKElIS0UzMzAzUzAyKSBcdTIxOTIgY2xhc3NpZnkgZWFjaFxuICAvLyBJSEtFMzMwM1MwMSB2aXNpdCBhcyBBTUIgLyBFTUVSIC8gSU1QIHZpYSBob3NwX0RBVEFfVFlQRV9OQU1FLlxuICAvLyBMaXN0IGVuZHBvaW50IGRvZXNuJ3QgZXhwb3NlIFx1NjAyNVx1OEEzQSBkaXN0aW5jdGlvbjsgZGV0YWlsIGRvZXMuIFdlIHJlLVxuICAvLyBhZGFwdCBlYWNoIGVuY291bnRlciBpdGVtIHdpdGggdGhlIGRpc2NvdmVyZWQgY2xhc3MgYmVmb3JlIHRoZVxuICAvLyBiYWNrZW5kIHVwbG9hZCBzdGVwLlxuICAvLyBDcm9zcy1yZWZlcmVuY2U6IGJ1aWxkIGEgc2V0IG9mIHJvd19JRHMgdGhhdCB0aGUgbWVkaWNhdGlvbiAvIGNocm9uaWNcbiAgLy8gbGlzdCBlbmRwb2ludHMgcmVwb3J0ZWQgYXMgb3JpX1RZUEVfTkFNRT1cIlx1ODVFNVx1NUM0MFwiLiBJSEtFMzMwMyBpdHNlbGZcbiAgLy8gbGFja3MgdGhlIHZpc2l0LXR5cGUgZmllbGQsIHNvIHRoaXMgaXMgaG93IHdlIGNsYXNzaWZ5IHBoYXJtYWN5XG4gIC8vIHBpY2t1cCBldmVudHMgd2l0aG91dCByZXNvcnRpbmcgdG8gaG9zcGl0YWwtbmFtZSBzdHJpbmcgbWF0Y2hpbmcuXG4gIC8vIChBZGFwdGVyIHN0aWxsIHVzZXMgaG9zcGl0YWwgbmFtZSBhcyBhIGRlZmVuc2l2ZSBmYWxsYmFjayBpZiBlaXRoZXJcbiAgLy8gbWVkaWNhdGlvbiBlbmRwb2ludCBmYWlsZWQuKVxuICBjb25zdCBwaGFybWFjeVJvd0lkcyA9IG5ldyBTZXQoKTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIFtcIm1lZGljYXRpb25zXCIsIFwiY2hyb25pY19wcmVzY3JpcHRpb25zXCJdKSB7XG4gICAgY29uc3QgaWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmIChpZHggPCAwIHx8IHNldHRsZWRbaWR4XT8uc3RhdHVzICE9PSBcImZ1bGZpbGxlZFwiKSBjb250aW51ZTtcbiAgICBmb3IgKGNvbnN0IHYgb2Ygc2V0dGxlZFtpZHhdLnZhbHVlLnJhd0xpc3QgfHwgW10pIHtcbiAgICAgIGNvbnN0IGlkID0gdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEO1xuICAgICAgY29uc3Qgb3JpVHlwZU5hbWUgPSB2Lm9yaV9UWVBFX05BTUUgfHwgdi5vcmlfdHlwZV9uYW1lIHx8IFwiXCI7XG4gICAgICBpZiAoaWQgJiYgb3JpVHlwZU5hbWUuaW5jbHVkZXMoXCJcdTg1RTVcdTVDNDBcIikpIHtcbiAgICAgICAgcGhhcm1hY3lSb3dJZHMuYWRkKGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBlbmNJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJlbmNvdW50ZXJzXCIpO1xuICBpZiAoZW5jSWR4ID49IDAgJiYgc2V0dGxlZFtlbmNJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1QzMxXHU5MUFCXHU3RDAwXHU5MzA0XHU4QTczXHU2MEM1XHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGV0YWlsTWFwID0gYXdhaXQgX2ZldGNoRW5jb3VudGVyRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gUmUtYWRhcHQgd2l0aCBjbGFzc0hpbnQgZnJvbSBkZXRhaWw7IGZhbGwgYmFjayB0byBBTUIuXG4gICAgICAgIGNvbnN0IHJlQWRhcHRlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpc2l0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGRldGFpbE1hcD8uZ2V0KGkpIHx8IG51bGw7XG4gICAgICAgICAgY29uc3QgY2xzID0gX2NsYXNzRnJvbVMwMkRldGFpbChkZXRhaWwpIHx8IFwiQU1CXCI7XG4gICAgICAgICAgY29uc3QgdmlzaXQgPSB2aXNpdHNbaV07XG4gICAgICAgICAgY29uc3Qgcm93SWQgPSB2aXNpdC5yb1dfSUQgfHwgdmlzaXQucm93X2lkIHx8IHZpc2l0LnJvd19JRDtcbiAgICAgICAgICBjb25zdCBpc1BoYXJtYWN5ID0gcm93SWQgPyBwaGFybWFjeVJvd0lkcy5oYXMocm93SWQpIDogZmFsc2U7XG4gICAgICAgICAgY29uc3QgaXQgPSBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlKHZpc2l0LCBjbHMsIHtcbiAgICAgICAgICAgIHBoYXJtYWN5OiBpc1BoYXJtYWN5LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpdCkgcmVBZGFwdGVkLnB1c2goaXQpO1xuICAgICAgICB9XG4gICAgICAgIHNldHRsZWRbZW5jSWR4XS52YWx1ZS5pdGVtcyA9IHJlQWRhcHRlZDtcbiAgICAgICAgc2V0dGxlZFtlbmNJZHhdLnZhbHVlLnJhd19jb3VudCA9IHJlQWRhcHRlZC5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBlbmNvdW50ZXIgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImVuY291bnRlci1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAxYjogbWVkaWNhdGlvbnMgbmVlZCBhIDItc3RlcCBmZXRjaCBcdTIwMTQgSUhLRTMzMDZTMDEgb25seSByZXR1cm5zXG4gIC8vIHZpc2l0IG1ldGFkYXRhIChkYXRlLCBJQ0QsIGhvc3BpdGFsKSwgbm8gZHJ1ZyBuYW1lcy4gRHJ1Z3MgbGl2ZSBhdFxuICAvLyBJSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD08cm93X0lEPiZjdHlwZT0yIHVuZGVyXG4gIC8vIGloa2UzMzA2UzAyX21haW5fZGF0YVsqXS5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QuIEZhbiBvdXQgZGV0YWlsXG4gIC8vIGZldGNoZXMgaW5zaWRlIHRoZSBzYW1lIHRhYiBjb250ZXh0IChjb29raWVzICsgSldUKSwga2VlcGluZ1xuICAvLyBjb25jdXJyZW5jeSBsaW1pdGVkIHNvIE5ISSBkb2Vzbid0IElETEUtcmVkaXJlY3QgdXMuXG4gIC8vIFN0ZXAgMWM6IGltYWdpbmcgbmVlZHMgSUhLRTM0MDhTMDIgZm9yIHRoZSBhY3R1YWwgcmVwb3J0IG5hcnJhdGl2ZS5cbiAgLy8gTGlzdCBlbmRwb2ludCBvbmx5IGhhcyBvcmRlciBtZXRhZGF0YTsgY3R5cGUgcGFyYW0gbWlycm9ycyB0aGVcbiAgLy8gdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuICBjb25zdCBpbWdJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJpbWFnaW5nXCIpO1xuICBpZiAoaW1nSWR4ID49IDAgJiYgc2V0dGxlZFtpbWdJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbaW1nSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1XHU1ODMxXHU1NDRBXHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVwb3J0cyA9IGF3YWl0IF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUuaXRlbXMgPSByZXBvcnRzO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVwb3J0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGltYWdpbmcgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcImltYWdpbmctZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWQ6IHByb2NlZHVyZXMgbmVlZCBJSEtFMzMwOFMwMiBmb3IgdGhlIGFjdHVhbCBJQ0QtMTAtUENTXG4gIC8vIG9wX0NPREUgYW5kIHRoZSByZWFsIGV4ZWN1dGlvbiBkYXRlIChleGVfU19EQVRFIG9uIHN1Yi1saXN0XG4gIC8vIGVudHJpZXMpLiBUaGUgbGlzdCBlbmRwb2ludCBJSEtFMzMwMVMwNSBvbmx5IGV4cG9zZXMgbWV0YWRhdGE7XG4gIC8vIHdpdGhvdXQgdGhpcyBmYW4tb3V0LCBpbnBhdGllbnQgcHJvY2VkdXJlcyBnZXQgYW5jaG9yZWQgdG8gdGhlXG4gIC8vIGFkbWlzc2lvbiBkYXkgKGZ1bmNfZGF0ZSkgYW5kIGVtaXR0ZWQgd2l0aCBjb2RlOlwiXCIgKG5vIFBDUyBjb2RlKS5cbiAgY29uc3QgcHJvY0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcInByb2NlZHVyZXNcIik7XG4gIGlmIChwcm9jSWR4ID49IDAgJiYgc2V0dGxlZFtwcm9jSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW3Byb2NJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTg2NTVcdTdGNkUvXHU2MjRCXHU4ODUzXHU4QTczXHU2MEM1XHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcHJvY3MgPSBhd2FpdCBfZmV0Y2hQcm9jZWR1cmVEZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW3Byb2NJZHhdLnZhbHVlLml0ZW1zID0gcHJvY3M7XG4gICAgICAgIHNldHRsZWRbcHJvY0lkeF0udmFsdWUucmF3X2NvdW50ID0gcHJvY3MubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW3Byb2NJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgcHJvY2VkdXJlcyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwicHJvY2VkdXJlcy1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAxZTogY2hyb25pYyBwcmVzY3JpcHRpb25zIChJSEtFMzMwN1MwMSkuIE11c3QgcnVuIEJFRk9SRSB0aGVcbiAgLy8gcmVndWxhciBtZWRpY2F0aW9uIGZhbi1vdXQgYmVjYXVzZSB+NTIvMTI2IChvYnNlcnZlZCkgY2hyb25pYyByb3dzXG4gIC8vIHNoYXJlIHJvd19JRHMgd2l0aCByZWd1bGFyIElIS0UzMzA2UzAxIFx1MjAxNCB3ZSBjb2xsZWN0IGNocm9uaWMgSURzXG4gIC8vIGZpcnN0IGFuZCBwYXNzIHRoZW0gYXMgc2tpcFJvd0lkcyB0byB0aGUgcmVndWxhciBmYW4tb3V0IHNvIGVhY2hcbiAgLy8gcm93IGlzIGZldGNoZWQgZXhhY3RseSBvbmNlLiBDaHJvbmljIGRydWdzIGdldCBpc19jaHJvbmljPXRydWUgXHUyMTkyXG4gIC8vIE1lZGljYXRpb25SZXF1ZXN0LmNvdXJzZU9mVGhlcmFweVR5cGU9Y29udGludW91cy5cbiAgY29uc3QgY2hyb25pY1Jvd0lkcyA9IG5ldyBTZXQoKTtcbiAgY29uc3QgY2hyb25pY0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleChcbiAgICAoZSkgPT4gZS5uYW1lID09PSBcImNocm9uaWNfcHJlc2NyaXB0aW9uc1wiLFxuICApO1xuICBpZiAoY2hyb25pY0lkeCA+PSAwICYmIHNldHRsZWRbY2hyb25pY0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtjaHJvbmljSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU2MTYyXHU2MDI3XHU4NjU1XHU2NUI5XHU3QjhCXHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZHJ1Z0l0ZW1zID0gYXdhaXQgX2ZldGNoQ2hyb25pY01lZGljYXRpb25EZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW2Nocm9uaWNJZHhdLnZhbHVlLml0ZW1zID0gZHJ1Z0l0ZW1zO1xuICAgICAgICBzZXR0bGVkW2Nocm9uaWNJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW2Nocm9uaWNJZHhdLnZhbHVlLnJhd19jb3VudCA9IGRydWdJdGVtcy5sZW5ndGg7XG4gICAgICAgIGZvciAoY29uc3QgdiBvZiB2aXNpdHMpIHtcbiAgICAgICAgICBjb25zdCBpZCA9IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRDtcbiAgICAgICAgICBpZiAoaWQpIGNocm9uaWNSb3dJZHMuYWRkKGlkKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgY2hyb25pYyBwcmVzY3JpcHRpb25zIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJjaHJvbmljLWRldGFpbFwiKTtcblxuICBjb25zdCBtZWRJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJtZWRpY2F0aW9uc1wiKTtcbiAgaWYgKG1lZElkeCA+PSAwICYmIHNldHRsZWRbbWVkSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW21lZElkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHJlbWFpbmluZyA9IHZpc2l0cy5maWx0ZXIoKHYpID0+IHtcbiAgICAgICAgY29uc3QgaWQgPSB2LnJvd19JRCB8fCB2LnJvd2lkIHx8IHYucm93SUQ7XG4gICAgICAgIHJldHVybiBpZCAmJiAhY2hyb25pY1Jvd0lkcy5oYXMoaWQpO1xuICAgICAgfSkubGVuZ3RoO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7cmVtYWluaW5nfSBcdTdCNDZcdTc1MjhcdTg1RTVcdTY2MEVcdTdEMzBcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkcnVnSXRlbXMgPSBhd2FpdCBfZmV0Y2hNZWRpY2F0aW9uRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLCBza2lwUm93SWRzOiBjaHJvbmljUm93SWRzLFxuICAgICAgICB9KTtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLml0ZW1zID0gZHJ1Z0l0ZW1zO1xuICAgICAgICAvLyByYXdfY291bnQgbm93IHJlZmxlY3RzIHRoZSAqZHJ1Zy1sZXZlbCogY291bnQgZm9yIHRoZSBicmVha2Rvd25cbiAgICAgICAgLy8gKHZpc2l0cyBcdTIxOTIgZHJ1Z3MpLiBLZWVwIHRoZSB2aXNpdCBjb3VudCBpbiBhIHNpZGUgZmllbGQgZm9yIGRlYnVnLlxuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdfY291bnQgPSBkcnVnSXRlbXMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgbWVkaWNhdGlvbnMgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcIm1lZGljYXRpb24tZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMjogYWdncmVnYXRlIGl0ZW1zIGJ5IHBhZ2VfdHlwZSwgUE9TVCB0byBiYWNrZW5kLlxuICBjb25zdCBieVR5cGUgPSB7fTtcbiAgbGV0IHJhd190b3RhbCA9IDA7XG4gIGxldCBhZGFwdGVkX3RvdGFsID0gMDtcbiAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBzbyB0aGUgZmluYWwgc3RhdHVzIGNhbiB0ZWxsIHVzZXIgZXhhY3RseVxuICAvLyB3aGljaCBlbmRwb2ludHMgY2FtZSBiYWNrIGVtcHR5IC8gbWlzLXNoYXBlZCBcdTIwMTQgbXVjaCBtb3JlIHVzZWZ1bCB0aGFuXG4gIC8vIGEgc2luZ2xlIGFnZ3JlZ2F0ZWQgbnVtYmVyLlxuICAvLyBCcmVha2Rvd24gc2hvd24gdG8gdGhlIHVzZXIgdW5kZXIgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIi4gVXNlIHRoZSBDaGluZXNlIGxhYmVsXG4gIC8vIHdoZW4ga25vd247IG9ubHkgZmFsbCBiYWNrIHRvIHRoZSByYXcgZW5kcG9pbnQgbmFtZSBmb3IgdW5tYXBwZWRcbiAgLy8gKG5ld2x5IGFkZGVkKSBlbmRwb2ludHMuIEVtcHR5LXJlc3VsdCBlbmRwb2ludHMgYXJlIG9taXR0ZWQgZnJvbVxuICAvLyB0aGUgc3VjY2VzcyBzdW1tYXJ5IGVudGlyZWx5IFx1MjAxNCB0aGV5IGFkZCBub2lzZS4gRXJyb3JzIGFsd2F5cyBzaG93XG4gIC8vIHNvIHRoZSB1c2VyIGtub3dzIHNvbWV0aGluZyBkaWRuJ3QgY29tZSB0aHJvdWdoLlxuICBjb25zdCBicmVha2Rvd24gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0bGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZXAgPSBOSElfQVBJX0VORFBPSU5UU1tpXTtcbiAgICBjb25zdCBzID0gc2V0dGxlZFtpXTtcbiAgICBjb25zdCBsYWJlbCA9IEVORFBPSU5UX0xBQkVMX1pIW2VwLm5hbWVdID8/IGVwLm5hbWU7XG4gICAgaWYgKHMuc3RhdHVzID09PSBcInJlamVjdGVkXCIpIHtcbiAgICAgIGVycm9ycy5wdXNoKGAke2VwLm5hbWV9OiAke3MucmVhc29uLm1lc3NhZ2V9YCk7XG4gICAgICBicmVha2Rvd24ucHVzaChgXHUyNzRDICR7bGFiZWx9XHVGRjFBXHU1M0Q2XHU1Rjk3XHU1OTMxXHU2NTU3YCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgeyBpdGVtcywgcmF3X2NvdW50IH0gPSBzLnZhbHVlO1xuICAgIHJhd190b3RhbCArPSByYXdfY291bnQ7XG4gICAgYWRhcHRlZF90b3RhbCArPSBpdGVtcy5sZW5ndGg7XG4gICAgaWYgKHJhd19jb3VudCA9PT0gMCkgY29udGludWU7IC8vIG5vdGhpbmcgdG8gc2hvd1xuICAgIGlmIChpdGVtcy5sZW5ndGggPiByYXdfY291bnQgJiYgcmF3X2NvdW50ID4gMCkge1xuICAgICAgLy8gMS10by1tYW55IGFkYXB0ZXIgKGUuZy4gYWR1bHRfcHJldmVudGl2ZTogb25lIHNjcmVlbmluZyByb3cgXHUyMTkyXG4gICAgICAvLyB+MTggT2JzZXJ2YXRpb25zKS4gU2hvdyBib3RoIG51bWJlcnMgc28gdGhlIHVzZXIgdW5kZXJzdGFuZHNcbiAgICAgIC8vIHdoeSBvbmUgcmVjb3JkIHByb2R1Y2VkIG1hbnkuXG4gICAgICBicmVha2Rvd24ucHVzaChgJHtsYWJlbH1cdUZGMUEke3Jhd19jb3VudH0gXHU3QjQ2IFx1MjE5MiAke2l0ZW1zLmxlbmd0aH0gXHU5ODA1YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrZG93bi5wdXNoKGAke2xhYmVsfVx1RkYxQSR7aXRlbXMubGVuZ3RofSBcdTdCNDZgKTtcbiAgICB9XG4gICAgLy8gU2F2ZSBib2R5IHNhbXBsZSBmb3IgZmlyc3QgZW5kcG9pbnQgd2l0aCByYXc+MCBidXQgYWRhcHRlZD0wIChhZGFwdGVyXG4gICAgLy8gbWlzbWF0Y2gpIHNvIHdlIGNhbiBpdGVyYXRlLiBTdG9yZWQgdW5kZXIgY2hyb21lLnN0b3JhZ2UubG9jYWwgZm9yXG4gICAgLy8gaW5zcGVjdGlvbiB2aWEgc2VydmljZSB3b3JrZXIgRGV2VG9vbHMuXG4gICAgaWYgKHJhd19jb3VudCA+IDAgJiYgaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgICAgIFtgX19zYW1wbGVCb2R5XyR7ZXAubmFtZX1gXTogcy52YWx1ZS5ib2R5U2FtcGxlIHx8IFwibi9hXCIsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH1cbiAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICAoYnlUeXBlW2VwLnBhZ2VfdHlwZV0gPSBieVR5cGVbZXAucGFnZV90eXBlXSB8fCBbXSkucHVzaCguLi5pdGVtcyk7XG4gIH1cblxuICAvLyBNYXNrIGdhdGUgaXMgcmVhZCBmcmVzaCBwZXIgc3luYyBcdTIwMTQgZGVmYXVsdHMgT0ZGIHBlciB0aGUgZGlzY3Vzc2lvblxuICAvLyAoY2l0aXplbi1zZWxmLWRvd25sb2FkIGRvZXNuJ3QgbmVlZCBhbm9ueW1pemF0aW9uKS4gV2hlbiBPTiwgYWxzb1xuICAvLyBzY3J1YiB0aGUgdXNlcidzIHJlYWwgbmFtZSBvdXQgb2YgYW55IE5ISSBuYXJyYXRpdmUgZmllbGQgYmVmb3JlXG4gIC8vIGl0IGZsb3dzIGludG8gdGhlIG1hcHBlci5cbiAgY29uc3QgbWFza0VuYWJsZWQgPSBhd2FpdCBfaXNNYXNrRW5hYmxlZCgpO1xuICBpZiAobWFza0VuYWJsZWQgJiYgcGF0aWVudE92ZXJyaWRlLm5hbWUpIHtcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhieVR5cGUpKSB7XG4gICAgICBieVR5cGVba2V5XSA9IF9yZXBsYWNlTmFtZURlZXAoYnlUeXBlW2tleV0sIHBhdGllbnRPdmVycmlkZS5uYW1lLCByZXBsYWNlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgbGV0IF9sb2NhbEZpbGVuYW1lID0gbnVsbDtcbiAgaWYgKG1vZGUgPT09IFwibG9jYWxcIikge1xuICAgIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbiAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogXCJcdUQ4M0VcdURERUMgXHU4RjQ5XHU2M0RCXHU3MEJBXHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHU2QTk0XHUyMDI2XCIsIHRvdGFsUmVzb3VyY2VzOiAwIH0pO1xuICAgIGxldCBidW5kbGU7XG4gICAgdHJ5IHtcbiAgICAgIGJ1bmRsZSA9IF9hc3NlbWJsZUxvY2FsQnVuZGxlKGJ5VHlwZSwgcGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3JzLnB1c2goYGxvY2FsIG1hcHBpbmc6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgYnVuZGxlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGJ1bmRsZSkge1xuICAgICAgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDQkUgXHU2RTk2XHU1MDk5ICR7dG90YWx9IFx1N0I0NiBGSElSIFx1OENDN1x1NkU5MFx1MjAyNmAsIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubywgZGF0ZVJhbmdlKTtcbiAgICAgICAgX2xvY2FsRmlsZW5hbWUgPSBkbC5maWxlbmFtZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYHN0YXNoIGJ1bmRsZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEJ1aWxkIHRoZSBvdmVycmlkZSB3ZSBzZW5kIHRvIGJhY2tlbmQgd2l0aCB0aGUgbWF5YmUtbWFza2VkIG5hbWVcbiAgICAvLyBzbyBiYWNrZW5kJ3MgYXV0by1jcmVhdGVkIFBhdGllbnQgKyB0aGUgcGVyLWl0ZW0gc3ViamVjdC5kaXNwbGF5XG4gICAgLy8gc2VlIHRoZSBzYW1lIHZhbHVlIHRoZSB1c2VyIG9wdGVkIGludG8uIEl0ZW1zIHRoZW1zZWx2ZXMgd2VyZVxuICAgIC8vIGFscmVhZHkgc2NydWJiZWQgYWJvdmUgKGJ5VHlwZSBwYXNzKSwgc28gdGhpcyBqdXN0IGNvdmVycyB0aGVcbiAgICAvLyBvdmVycmlkZS1kZXJpdmVkIFBhdGllbnQuXG4gICAgY29uc3QgdXBsb2FkT3ZlcnJpZGUgPSBtYXNrRW5hYmxlZCAmJiBwYXRpZW50T3ZlcnJpZGUubmFtZVxuICAgICAgPyB7IC4uLnBhdGllbnRPdmVycmlkZSwgbmFtZTogbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUpIH1cbiAgICAgIDogcGF0aWVudE92ZXJyaWRlO1xuICAgIGZvciAoY29uc3QgW3BhZ2VfdHlwZSwgaXRlbXNdIG9mIE9iamVjdC5lbnRyaWVzKGJ5VHlwZSkpIHtcbiAgICAgIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHUyQjA2XHVGRTBGIFx1NEUwQVx1NTBCMyAke3BhZ2VfdHlwZX1cdUZGMDgke2l0ZW1zLmxlbmd0aH0gXHU3QjQ2XHVGRjA5XHUyMDI2YCxcbiAgICAgICAgdG90YWxSZXNvdXJjZXM6IHRvdGFsLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgX3Bvc3RTdHJ1Y3R1cmVkKGJhY2tlbmQsIHBhZ2VfdHlwZSwgaXRlbXMsIHN5bmNBcGlLZXksIHVwbG9hZE92ZXJyaWRlKTtcbiAgICAgICAgdG90YWwgKz0gZGF0YS5jb3VudCB8fCAwO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgdXBsb2FkICR7cGFnZV90eXBlfTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWZ0ZXIgYmFja2VuZCB1cGxvYWQsIGFsc28gZmV0Y2ggYSBzbmFwc2hvdCBvZiB0aGUgcGF0aWVudCdzIGZ1bGxcbiAgICAvLyBjdW11bGF0aXZlIEZISVIgQnVuZGxlIGFuZCBzdGFzaCBpdCBmb3IgdGhlIHBvcHVwJ3MgXCJcdUQ4M0RcdURDRTUgXHU0RTBCXHU4RjA5XCIgYnV0dG9uLlxuICAgIC8vIFRoaXMgaXMgd2hhdCBgL2ZoaXIvZXhwb3J0YCByZXR1cm5zIFx1MjAxNCB0aGUgYmFja2VuZCdzIGNvbXBsZXRlIHZpZXdcbiAgICAvLyBvZiB0aGlzIHBhdGllbnQgKHRoaXMgc3luYyArIGFueSBwcmlvciBzeW5jcyksIGFzIG9wcG9zZWQgdG8gbG9jYWxcbiAgICAvLyBtb2RlJ3MgXCJqdXN0IHRoaXMgc3luY1wiIGJ1bmRsZS5cbiAgICAvL1xuICAgIC8vIFNraXAgc3Rhc2hpbmcgZW50aXJlbHkgd2hlbiB0aGUgdXBsb2FkIHBhc3MgcHJvZHVjZWQgbm8gcmVzb3VyY2VzXG4gICAgLy8gXHUyMDE0IGV4cG9ydGluZyAwIGVudHJpZXMgdGhlbiBzdGFzaGluZyB0aGVtIGNyZWF0ZXMgYSBtaXNsZWFkaW5nXG4gICAgLy8gXCJcdTY3MkNcdTU3MzAgXHUyNzEzIDAgXHU3QjQ2XCIgaW5kaWNhdG9yIGFuZCBhIHVzZWxlc3MgXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCMyBidXR0b24uXG4gICAgaWYgKHBhdGllbnRPdmVycmlkZS5pZF9ubyAmJiB0b3RhbCA+IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBcIlx1RDgzRFx1RENFNiBcdTUzRDZcdTVGOTdcdTVGOENcdTdBRUZcdTVCOENcdTY1NzRcdThDQzdcdTY1OTlcdTIwMjZcIiwgdG90YWxSZXNvdXJjZXM6IHRvdGFsIH0pO1xuICAgICAgICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIGRlcml2ZVBhdGllbnRJZChyYXdJZCksIHNvIHRoZVxuICAgICAgICAvLyBleHBvcnQgZmlsdGVyIG11c3QgdXNlIHRoZSBoYXNoZWQgZm9ybSBcdTIwMTQgcXVlcnlpbmcgd2l0aCB0aGVcbiAgICAgICAgLy8gcmF3IG5hdGlvbmFsIElEIG1hdGNoZXMgemVybyByb3dzIGV2ZW4gd2hlbiBkYXRhIGlzIHRoZXJlLlxuICAgICAgICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKHBhdGllbnRPdmVycmlkZS5pZF9ubyk7XG4gICAgICAgIGNvbnN0IGV4cFVybCA9IGAke2JhY2tlbmR9L2ZoaXIvZXhwb3J0P3BhdGllbnQ9JHtlbmNvZGVVUklDb21wb25lbnQoZmhpclBpZCl9YDtcbiAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKGV4cFVybCwge1xuICAgICAgICAgIGhlYWRlcnM6IHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30sXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoci5vaykge1xuICAgICAgICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgIC8vIFBhc3MgdGhlIHNhbWUgZGF0ZVJhbmdlIHRoZSB1c2VyIHBpY2tlZCB0aHJvdWdoIHNvIHRoZVxuICAgICAgICAgIC8vIGRvd25sb2FkZWQgZmlsZW5hbWUgcmVmbGVjdHMgXCJcdTY3MDBcdThGRDEgMyBcdTVFNzRcIiBcdTIxOTIgMjAyMy0yMDI2IGluc3RlYWRcbiAgICAgICAgICAvLyBvZiBhbHdheXMgc3ludGhlc2l6aW5nIHRvZGF5LTF5IFx1MjE5MiB0b2RheS5cbiAgICAgICAgICBjb25zdCBkbCA9IGF3YWl0IF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sIGRhdGVSYW5nZSk7XG4gICAgICAgICAgX2xvY2FsRmlsZW5hbWUgPSBkbC5maWxlbmFtZTtcbiAgICAgICAgICAvLyBBbGlnbiByZXBvcnRlZCBjb3VudCB3aXRoIGxvY2FsIG1vZGU6IGJ1bmRsZS5lbnRyeS5sZW5ndGhcbiAgICAgICAgICAvLyBpbmNsdWRlcyB0aGUgUGF0aWVudCByZXNvdXJjZSAod2hpY2ggdGhlIHBlci1wYWdlLXR5cGUgUE9TVFxuICAgICAgICAgIC8vIGNvdW50cyBoYWQgcHJldmlvdXNseSBvbWl0dGVkIGJlY2F1c2UgUGF0aWVudCBpcyBhdXRvLWNyZWF0ZWRcbiAgICAgICAgICAvLyBzaWxlbnRseSBmcm9tIHBhdGllbnRfb3ZlcnJpZGUpLiBTYW1lIGRhdGEgXHUyMTkyIHNhbWUgbnVtYmVyLlxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gRGVmZW5zaXZlOiBvbmx5IE9WRVJXUklURSB0b3RhbCB3aGVuIGV4cG9ydCBhY3R1YWxseSByZXR1cm5lZFxuICAgICAgICAgIC8vIHNvbWV0aGluZy4gSWYgZXhwb3J0IHJldHVybnMgMCBlbnRyaWVzIGRlc3BpdGUgYSBzdWNjZXNzZnVsXG4gICAgICAgICAgLy8gdXBsb2FkIChjb3VsZCBoYXBwZW4gd2l0aCBhIHN0YWxlLURCIGhhc2ggbWlzbWF0Y2ggd2UgaGF2ZW4ndFxuICAgICAgICAgIC8vIGZpeGVkIHlldCksIGRvbid0IGNsb2JiZXIgdGhlIHRydXRoZnVsIHVwbG9hZCBjb3VudCBcdTIwMTQgdGhhdCdzXG4gICAgICAgICAgLy8gZXhhY3RseSB0aGUgYnVnIHRoYXQgbWFkZSBcIlx1NURGMlx1NjZGNFx1NjVCMCA4MSBcdTdCNDZcIiBzaWxlbnRseSBiZWNvbWVcbiAgICAgICAgICAvLyBcIlx1NURGMlx1NjZGNFx1NjVCMCAwIFx1N0I0NlwiLlxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJ1bmRsZS5lbnRyeSkgJiYgYnVuZGxlLmVudHJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRvdGFsID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2goYGV4cG9ydCBidW5kbGU6IEhUVFAgJHtyLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgZXhwb3J0IGJ1bmRsZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UobW9kZSA9PT0gXCJsb2NhbFwiID8gXCJhc3NlbWJsZStzdGFzaFwiIDogXCJiYWNrZW5kLXVwbG9hZFwiKTtcblxuICAvLyBGb3JtYXQgZWxhcHNlZCB3YWxsLWNsb2NrIHRpbWU6IHNlY29uZHMgKDEgZHApIGZvciBzaG9ydCBzeW5jcyxcbiAgLy8gXCJtbTpzc1wiIG9uY2Ugd2UgY3Jvc3MgdGhlIG1pbnV0ZSBtYXJrIHNvIHRoZSBwb3B1cCBzdGF0dXMgc3RheXMgcmVhZGFibGUuXG4gIGNvbnN0IF9lbGFwc2VkTXMgPSBEYXRlLm5vdygpIC0gX3QwO1xuICBjb25zdCBfZWxhcHNlZFN0ciA9IF9lbGFwc2VkTXMgPCA2MF8wMDBcbiAgICA/IGAkeyhfZWxhcHNlZE1zIC8gMTAwMCkudG9GaXhlZCgxKX1zYFxuICAgIDogYCR7TWF0aC5mbG9vcihfZWxhcHNlZE1zIC8gNjBfMDAwKX1tJHtNYXRoLnJvdW5kKChfZWxhcHNlZE1zICUgNjBfMDAwKSAvIDEwMDApfXNgO1xuICAvLyBObyBtb3JlIFwiXHU2QTk0XHU2ODQ4XHU1REYyXHU1MDk5XHU1OUE1XHUyMDI2XCIgdGFpbCBcdTIwMTQgdGhlIFx1RDgzRFx1RENFNSBkb3dubG9hZCBidXR0b24gc2l0cyByaWdodFxuICAvLyBiZWxvdyB0aGUgc3RhdHVzLCBzbyBzYXlpbmcgXCJcdTlFREVcdTRFMEJcdTY1QjlcdTYzMDlcdTkyMTVcIiBpcyBqdXN0IG5vaXNlLlxuICBjb25zdCBfbG9jYWxUYWlsID0gXCJcIjtcbiAgY29uc3QgX3N1Y2Nlc3NWZXJiID0gbW9kZSA9PT0gXCJsb2NhbFwiID8gXCJcdTVERjJcdTc1MjJcdTc1MUZcIiA6IFwiXHU1REYyXHU2NkY0XHU2NUIwXCI7XG4gIC8vIFBoYXNlIHRpbWluZ3MgKGBuaGktcGFyYWxsZWw9OHNgLCBgYmFja2VuZC11cGxvYWQ9MC44c2ApIGFyZSBkZXZcbiAgLy8gaW5mbyBcdTIwMTQgdXNlZnVsIHdoZW4gaW52ZXN0aWdhdGluZyBhIHNsb3cgc3luYyBidXQgbm9pc2UgZm9yIGFuIGVuZFxuICAvLyB1c2VyLiBLZWVwIHRoZW0sIGJ1dCB0YWcgd2l0aCB0aGUgXCJcdTIzRjFcIiBwcmVmaXggdGhlIHBvcHVwIHVzZXMgdG9cbiAgLy8gdHVjayB0aGVtIGludG8gYSBkZWVwZXIgXCJcdTYyODBcdTg4NTNcdTdEMzBcdTdCQzBcIiBzdWItdG9nZ2xlLlxuICBjb25zdCBfcGhhc2VMaW5lcyA9IF9waGFzZXMubWFwKChwKSA9PiBgXHUyM0YxICR7cC5uYW1lfT0keyhwLm1zIC8gMTAwMCkudG9GaXhlZCgxKX1zYCk7XG4gIGNvbnN0IF9mdWxsQnJlYWtkb3duID0gWy4uLmJyZWFrZG93biwgLi4uX3BoYXNlTGluZXNdO1xuXG4gIC8vIFBpY2sgdGhlIHJpZ2h0IHN1bW1hcnkgbGluZS4gWmVyby1yZXN1bHQgaXMgdGhlIHRyaWNraWVzdCBjYXNlOlxuICAvLyB3ZSBkb24ndCB3YW50IGEgZ3JlZW4gXHUyNzA1IHNheWluZyBcIjAgXHU3QjQ2XCIgYmVjYXVzZSB0aGF0IHJlYWRzIGFzXG4gIC8vIFwic3VjY2VlZGVkIHdpdGggemVybyBkYXRhXCIuIFRoYXQncyBhbG1vc3QgYWx3YXlzIG9uZSBvZjpcbiAgLy8gICAtIE5ISSBzZXNzaW9uIGV4cGlyZWQgYmV0d2VlbiB0aGUgbG9naW4gcHJvYmUgYW5kIHRoZSBzeW5jXG4gIC8vICAgICAodGhlIElIS0UzNDEwIHByb2JlIGNhbiBzdGlsbCBzdWNjZWVkIHdoaWxlIGRhdGEgZW5kcG9pbnRzXG4gIC8vICAgICByZXNwb25kIHdpdGggZW1wdHkgYXJyYXlzKTtcbiAgLy8gICAtIHRoZSB1c2VyIHRydWx5IGhhcyBubyByZWNvcmRzIGluIHRoZSBzZWxlY3RlZCBkYXRlIHJhbmdlLlxuICAvLyBFaXRoZXIgd2F5IHRoZSBhY3Rpb25hYmxlIG5leHQgc3RlcCBpcyBcIlx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NSBOSEkgXHU1MThEXHU4QTY2XHU0RTAwXHU2QjIxXCIuXG4gIGxldCBfc3VtbWFyeUxpbmU7XG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgX3N1bW1hcnlMaW5lID0gYFx1MjZBMFx1RkUwRiBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTAgXHUwMEI3ICR7X3N1Y2Nlc3NWZXJifSAke3RvdGFsfSBcdTdCNDZcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdUZGMEMke2Vycm9ycy5sZW5ndGh9IFx1OTgwNVx1NTkzMVx1NjU1N1x1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5JHtfbG9jYWxUYWlsfWA7XG4gIH0gZWxzZSBpZiAodG90YWwgPT09IDApIHtcbiAgICBfc3VtbWFyeUxpbmUgPVxuICAgICAgYFx1MjZBMFx1RkUwRiBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTBcdTRGNDZcdTZDOTJcdTYyOTNcdTUyMzBcdTRFRkJcdTRGNTVcdThDQzdcdTY1OTlcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOVx1MjAxNCBgICtcbiAgICAgIGBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0Egc2Vzc2lvbiBcdTUzRUZcdTgwRkRcdTkwNEVcdTY3MUZcdUZGMENcdThBQ0JcdTU2REVcdThBNzJcdTUyMDZcdTk4MDFcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcdUZGMUJcdTYyMTZcdTYyQzlcdTk1NzdcdTMwMENcdTY1RTVcdTY3MUZcdTdCQzRcdTU3MERcdTMwMERcdTUxOERcdThBNjZcdTMwMDJgO1xuICB9IGVsc2Uge1xuICAgIF9zdW1tYXJ5TGluZSA9IGBcdTI3MDUgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyAke19zdWNjZXNzVmVyYn0gJHt0b3RhbH0gXHU3QjQ2XHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDkke19sb2NhbFRhaWx9YDtcbiAgfVxuXG4gIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgcnVubmluZzogZmFsc2UsXG4gICAgcHJvZ3Jlc3M6IF9zdW1tYXJ5TGluZSxcbiAgICBwaGFzZTogXCJkb25lXCIsXG4gICAgdG90YWxSZXNvdXJjZXM6IHRvdGFsLFxuICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICBlbGFwc2VkTXM6IF9lbGFwc2VkTXMsXG4gICAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBmb3IgdGhlIHBvcHVwJ3MgJ1x1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMCcgY29sbGFwc2libGUuXG4gICAgLy8gS2VlcCBhcyBhIHBsYWluIGFycmF5IHNvIHBvcHVwLmpzIGNhbiByZW5kZXIgd2l0aCBET00gQVBJIChub1xuICAgIC8vIGlubmVySFRNTCAvIG5vIGVzY2FwaW5nIGNvbmNlcm5zKS4gSXRlbXMgbG9vayBsaWtlXG4gICAgLy8gJ2VuY291bnRlcnM9MTIvMTInIG9yICdhZHVsdF9wcmV2ZW50aXZlPTIgcm93cyBcdTIxOTIgMzYgb2JzJy5cbiAgICBicmVha2Rvd246IF9mdWxsQnJlYWtkb3duLFxuICAgIGVycm9ycyxcbiAgICBoaXN0bm86IHBhdGllbnRPdmVycmlkZS5pZF9ubyxcbiAgICBtb2RlLFxuICAgIGxvY2FsRmlsZW5hbWU6IF9sb2NhbEZpbGVuYW1lLFxuICB9KTtcblxuICAvLyBCZXN0LWVmZm9ydDogd3JpdGUgYSBTeW5jIEhpc3Rvcnkgcm93IHRvIHRoZSBiYWNrZW5kIHNvIHRoZSBkYXNoYm9hcmRcbiAgLy8gY2FuIHNob3cgd2hlbi93aG8vaG93LWxvbmcvd2hhdC9yYW5nZS4gU2tpcHBlZCBpbiBsb2NhbCBtb2RlICh0aGVyZVxuICAvLyBpcyBubyBiYWNrZW5kKS4gV3JhcHBlZCArIHN3YWxsb3dlZCBzbyBhIGxvZ2dpbmcgZmFpbHVyZSBuZXZlclxuICAvLyBwcm9wYWdhdGVzIGJhY2sgdG8gdGhlIHVzZXItZmFjaW5nIHN5bmMgc3RhdHVzLlxuICBpZiAobW9kZSAhPT0gXCJsb2NhbFwiKSB0cnkge1xuICAgIGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3N5bmMvbG9nYCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIC4uLihzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9KSxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHN0YXR1czogZXJyb3JzLmxlbmd0aCA/IFwicGFydGlhbFwiIDogXCJzdWNjZXNzXCIsXG4gICAgICAgIHBhdGllbnRfaWQ6IHBhdGllbnRPdmVycmlkZS5pZF9ubyB8fCBcIlwiLFxuICAgICAgICAvLyAvc3luYy9sb2cgbGFuZHMgaW4gdGhlIGRhc2hib2FyZCdzIHN5bmMtaGlzdG9yeSByb3cuIE9ubHlcbiAgICAgICAgLy8gbWFzayB3aGVuIHRoZSB1c2VyIGhhcyBvcHRlZCBpbiBcdTIwMTQgb3RoZXJ3aXNlIGRhc2hib2FyZCBzZWVzXG4gICAgICAgIC8vIHRoZSByYXcgbmFtZSB0aGV5IHR5cGVkIChjb25zaXN0ZW50IHdpdGggXCJcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjhcIiBkZWZhdWx0KS5cbiAgICAgICAgcGF0aWVudF9uYW1lOiBtYXNrRW5hYmxlZFxuICAgICAgICAgID8gbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIilcbiAgICAgICAgICA6IHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCIsXG4gICAgICAgIHRvdGFsLFxuICAgICAgICBicmVha2Rvd24sXG4gICAgICAgIGRhdGVfcmFuZ2U6IGRhdGVSYW5nZUxhYmVsIHx8IFwiXCIsXG4gICAgICAgIGVsYXBzZWRfbXM6IF9lbGFwc2VkTXMsXG4gICAgICAgIHN0YXJ0ZWRfYXQ6IG5ldyBEYXRlKF90MCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgZXJyb3JzLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIGZhaWxlZCB0byB3cml0ZSBoaXN0b3J5IGxvZzpcIiwgZSk7XG4gIH1cbiAgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xufVxuXG4vLyBPbmUtdGltZSBtaWdyYXRpb24gZnJvbSBjaHJvbWUuc3RvcmFnZS5zeW5jIFx1MjE5MiBjaHJvbWUuc3RvcmFnZS5sb2NhbC5cbi8vIFByZXZpb3VzIHZlcnNpb25zIHN0b3JlZCBzeW5jQXBpS2V5ICsgcGF0aWVudE92ZXJyaWRlIChjb250YWluaW5nIHRoZVxuLy8gbmF0aW9uYWwgSUQpIHVuZGVyIC5zeW5jLCB3aGljaCBDaHJvbWUgcmVwbGljYXRlcyB0byB0aGUgdXNlcidzIEdvb2dsZVxuLy8gYWNjb3VudCBhbmQgcHVzaGVzIHRvIGV2ZXJ5IGRldmljZSB0aGV5IHNpZ24gaW50by4gTW92ZSBldmVyeXRoaW5nXG4vLyBzZXR0aW5ncy1yZWxhdGVkIHRvIC5sb2NhbDsgY2xlYXIgdGhlIHN5bmMgY29weS5cbmNvbnN0IFNZTkNfS0VZU19UT19NSUdSQVRFID0gW1xuICBcImJhY2tlbmRVcmxcIixcbiAgXCJzeW5jQXBpS2V5XCIsXG4gIFwic21hcnRBcHBMYXVuY2hVcmxcIixcbiAgXCJwYXRpZW50T3ZlcnJpZGVcIixcbiAgXCJzeW5jTW9kZVwiLFxuICBcIm1hc2tOYW1lRW5hYmxlZFwiLFxuXTtcblxuYXN5bmMgZnVuY3Rpb24gbWlncmF0ZVN5bmNUb0xvY2FsKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHN5bmNlZCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFNZTkNfS0VZU19UT19NSUdSQVRFKTtcbiAgICBjb25zdCBwcmVzZW50ID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgT2JqZWN0LmVudHJpZXMoc3luY2VkKS5maWx0ZXIoKFssIHZdKSA9PiB2ICE9PSB1bmRlZmluZWQpLFxuICAgICk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHByZXNlbnQpLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IGxvY2FsID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KE9iamVjdC5rZXlzKHByZXNlbnQpKTtcbiAgICAvLyBEb24ndCBvdmVyd3JpdGUgYW55dGhpbmcgdGhlIHVzZXIgYWxyZWFkeSBzZXQgb24gdGhpcyBtYWNoaW5lLlxuICAgIGNvbnN0IHRvV3JpdGUgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhwcmVzZW50KS5maWx0ZXIoKFtrXSkgPT4gbG9jYWxba10gPT09IHVuZGVmaW5lZCksXG4gICAgKTtcbiAgICBpZiAoT2JqZWN0LmtleXModG9Xcml0ZSkubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHRvV3JpdGUpO1xuICAgIH1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLnJlbW92ZShPYmplY3Qua2V5cyhwcmVzZW50KSk7XG4gIH0gY2F0Y2gge1xuICAgIC8vIE1pZ3JhdGlvbiBpcyBiZXN0LWVmZm9ydC4gVGhlIG5leHQgcnVuIGdldHMgdG8gdHJ5IGFnYWluLlxuICB9XG59XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGFzeW5jICgpID0+IHtcbiAgYXdhaXQgbWlncmF0ZVN5bmNUb0xvY2FsKCk7XG59KTtcblxuLy8gQWxzbyBydW4gbWlncmF0aW9uIG9uIHNlcnZpY2Utd29ya2VyIHdha2UtdXAgKGNvdmVycyByZWxvYWQvcmVzdGFydFxuLy8gcGF0aHMgd2hlcmUgb25JbnN0YWxsZWQgZG9lc24ndCBmaXJlKS5cbmNocm9tZS5ydW50aW1lLm9uU3RhcnR1cD8uYWRkTGlzdGVuZXI/LigoKSA9PiB7XG4gIG1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xufSk7XG5taWdyYXRlU3luY1RvTG9jYWwoKTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2csIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3RhcnROaGlBcGlTeW5jXCIpIHtcbiAgICBydW5OaGlBcGlTeW5jKG1zZy5wYXlsb2FkKS50aGVuKFxuICAgICAgKCkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICAgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgaWYgKGU/Lm1lc3NhZ2UgPT09IENBTkNFTF9FUlJPUikge1xuICAgICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlLCBjYW5jZWxsZWQ6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGU/Lm1lc3NhZ2UgPT09IFNFU1NJT05fRVhQSVJFRF9FUlJPUikge1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdUQ4M0RcdUREMTIgTkhJIHNlc3Npb24gXHU1REYyXHU3NjdCXHU1MUZBIFx1MjAxNCBcdThBQ0JcdTU3MjggTkhJIHRhYiBcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcdTVGOENcdTUxOERcdTlFREUgU3luY1wiLFxuICAgICAgICAgICAgICBwaGFzZTogXCJzZXNzaW9uX2V4cGlyZWRcIixcbiAgICAgICAgICAgICAgdHM6IERhdGUubm93KCksIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBleHBpcmVkOiB0cnVlIH0pOyB9IGNhdGNoIHt9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJydW5OaGlBcGlTeW5jIGZhaWxlZFwiLCBlKTtcbiAgICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcnVubmluZzogZmFsc2UsIHByb2dyZXNzOiBgXHUyNzRDICR7ZS5tZXNzYWdlfWAsIHBoYXNlOiBcImVycm9yXCIgfSk7XG4gICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiBmYWxzZSwgZXJyb3I6IGUubWVzc2FnZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3RvcFN5bmNcIikge1xuICAgIC8vIFNldCB0aGUgY2FuY2VsbGF0aW9uIGZsYWc7IHRoZSBpbi1mbGlnaHQgc3luYyB3aWxsIHRocm93XG4gICAgLy8gQ0FOQ0VMX0VSUk9SIGF0IGl0cyBuZXh0IGNoZWNrQ2FuY2VsKCkgY2FsbC4gIFN0b3JhZ2UgaXMgYWxyZWFkeVxuICAgIC8vIHVwZGF0ZWQgYnkgdGhlIHBvcHVwLCBzbyB3ZSBkb24ndCB0b3VjaCBpdCBoZXJlLlxuICAgIF9jYW5jZWxsZWQgPSB0cnVlO1xuICAgIC8vIERpc2NhcmQgYW55IHBhcnRpYWwgZGF0YSB1cGxvYWRlZCBzbyBmYXIuIFRoZSB1c2VyJ3Mgc3RhdGVkXG4gICAgLy8gY29udHJhY3QgaXMgJ3N0b3AgPSBhYm9ydCwgSSdsbCByZXN5bmMgZnJvbSBzY3JhdGNoIGxhdGVyJyBcdTIwMTQgd2VcbiAgICAvLyBkb24ndCB3YW50IHRvIGxlYXZlIGEgaGFsZi1sb2FkZWQgcGF0aWVudCBpbiB0aGUgRkhJUiBzdG9yZSB0aGF0XG4gICAgLy8gbG9va3MgY29tcGxldGUgdG8gZG93bnN0cmVhbSBTTUFSVCBhcHBzLlxuICAgIGNvbnN0IGN0eCA9IF9hY3RpdmVTeW5jQ3R4O1xuICAgIGlmIChjdHg/LnBhdGllbnRJZCAmJiBjdHguYmFja2VuZCkge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIGRlcml2ZVBhdGllbnRJZChyYXdJZCksIHNvIHRoZVxuICAgICAgICAgIC8vIERFTEVURSBwYXRoIG11c3QgdXNlIHRoZSBoYXNoZWQgZm9ybSBcdTIwMTQgc2VuZGluZyB0aGUgcmF3IElEXG4gICAgICAgICAgLy8gbWF0Y2hlcyBub3RoaW5nIGFuZCBsZWF2ZXMgdGhlIHBhcnRpYWwgdXBsb2FkIGluIHRoZSBzdG9yZS5cbiAgICAgICAgICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKGN0eC5wYXRpZW50SWQpO1xuICAgICAgICAgIGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYCR7Y3R4LmJhY2tlbmR9L3N5bmMvcGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IGN0eC5zeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGN0eC5zeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBTdXJmYWNlIHRoZSB3aXBlIGluIHRoZSBzdGF0dXMgc28gdXNlciBzZWVzIGl0IGFjdHVhbGx5IGhhcHBlbmVkLlxuICAgICAgICAgIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBbU1RPUkFHRV9LRVldOiB7XG4gICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1REYyXHU1MDVDXHU2QjYyXHU0RTI2XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBjYW5jZWwgd2lwZSBmYWlsZWQ6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG4gICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImdldFN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkudGhlbigoZGF0YSkgPT4gc2VuZFJlc3BvbnNlKGRhdGFbU1RPUkFHRV9LRVldIHx8IG51bGwpKTtcbiAgICByZXR1cm4gdHJ1ZTsgIC8vIGFzeW5jIHJlc3BvbnNlXG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjbGVhclN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShTVE9SQUdFX0tFWSkudGhlbigoKSA9PiBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjaGVja05oaUxvZ2luXCIpIHtcbiAgICBfY2hlY2tOaGlMb2dpblN0YXRlKG1zZy50YWJJZCkudGhlbihcbiAgICAgIChzdGF0ZSkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogc3RhdGUgfSk7IH0gY2F0Y2gge30gfSxcbiAgICAgICgpID0+IHsgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgbG9nZ2VkSW46IG51bGwgfSk7IH0gY2F0Y2gge30gfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcblxuLy8gQmVsdC1hbmQtc3VzcGVuZGVycyBTVyBrZWVwYWxpdmU6IGFuIGFsYXJtIGV2ZXJ5IDIwIHMgd2FrZXMgdGhlIFNXIGlmXG4vLyBpZGxlLiBDb21iaW5lZCB3aXRoIHRoZSByZXR1cm4tdHJ1ZSBwYXR0ZXJuIGFib3ZlLCB0aGlzIHByZXZlbnRzIHRoZVxuLy8gMzAgcyBpZGxlIHNodXRkb3duIGZyb20gZW5kaW5nIGFuIGluLXByb2dyZXNzIHN5bmMuXG5jaHJvbWUuYWxhcm1zLmNyZWF0ZShcInN3LWtlZXBhbGl2ZVwiLCB7IHBlcmlvZEluTWludXRlczogMC4zNCB9KTtcbmNocm9tZS5hbGFybXMub25BbGFybS5hZGRMaXN0ZW5lcigoKSA9PiB7IC8qIG5vLW9wOyBwcmVzZW5jZSBpcyB0aGUgcG9pbnQgKi8gfSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQVNBLE9BQUMsV0FBVztBQUNWO0FBRUEsWUFBSSxjQUFjO0FBQ2xCLFlBQUksaUJBQWlCO0FBQ3JCLFlBQUksU0FBUyxPQUFPLFdBQVc7QUFDL0IsWUFBSSxPQUFPLFNBQVMsU0FBUyxDQUFDO0FBQzlCLFlBQUksS0FBSyxtQkFBbUI7QUFDMUIsbUJBQVM7QUFBQSxRQUNYO0FBQ0EsWUFBSSxhQUFhLENBQUMsVUFBVSxPQUFPLFNBQVM7QUFDNUMsWUFBSSxVQUFVLENBQUMsS0FBSyxzQkFBc0IsT0FBTyxZQUFZLFlBQVksUUFBUSxZQUFZLFFBQVEsU0FBUztBQUM5RyxZQUFJLFNBQVM7QUFDWCxpQkFBTztBQUFBLFFBQ1QsV0FBVyxZQUFZO0FBQ3JCLGlCQUFPO0FBQUEsUUFDVDtBQUNBLFlBQUksWUFBWSxDQUFDLEtBQUssd0JBQXdCLE9BQU8sV0FBVyxZQUFZLE9BQU87QUFDbkYsWUFBSSxNQUFNLE9BQU8sV0FBVyxjQUFjLE9BQU87QUFDakQsWUFBSSxlQUFlLENBQUMsS0FBSywyQkFBMkIsT0FBTyxnQkFBZ0I7QUFDM0UsWUFBSSxZQUFZLG1CQUFtQixNQUFNLEVBQUU7QUFDM0MsWUFBSSxRQUFRLENBQUMsYUFBYSxTQUFTLE9BQU8sR0FBRztBQUM3QyxZQUFJLFFBQVEsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDO0FBQ3pCLFlBQUksZUFBZSxDQUFDLE9BQU8sU0FBUyxVQUFVLGFBQWE7QUFFM0QsWUFBSSxTQUFTLENBQUM7QUFFZCxZQUFJLFVBQVUsTUFBTTtB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YUFBSyxVQUFVLE1BQU0sV0FBWTtBQUMvQixlQUFLLFNBQVM7QUFFZCxjQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSztBQUV0RSxpQkFBTyxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElB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QUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTVYsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1WLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FB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SUFDVixXQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVdYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQ0U7QUFBQSxJQUNGLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gs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RjtBQUVBLGtCQUFNLFFBQVEsTUFBTSxPQUFPLFFBQVEsTUFBTSxJQUFJLFdBQVcsR0FBRyxXQUFXLEtBQUssQ0FBQztBQUM1RSxrQkFBTSxPQUFPLFFBQVEsTUFBTSxJQUFJO0FBQUEsY0FDN0IsQ0FBQyxXQUFXLEdBQUc7QUFBQSxnQkFDYixHQUFHO0FBQUEsZ0JBQ0gsU0FBUztBQUFBLGdCQUNULFVBQVU7QUFBQSxnQkFDVixPQUFPO0FBQUEsZ0JBQ1AsSUFBSSxLQUFLLElBQUk7QUFBQSxnQkFDYixXQUFXLEtBQUssSUFBSTtBQUFBLGNBQ3RCO0FBQUEsWUFDRixDQUFDO0FBQUEsVUFDSCxTQUFTLEdBQUc7QUFDVixvQkFBUSxLQUFLLGtDQUFrQyxDQUFDO0FBQUEsVUFDbEQ7QUFBQSxRQUNGLEdBQUc7QUFBQSxNQUNMO0FBQ0EsdUJBQWlCO0FBQ2pCLFVBQUk7QUFBRSxxQkFBYSxFQUFFLElBQUksS0FBSyxDQUFDO0FBQUEsTUFBRyxRQUFRO0FBQUEsTUFBQztBQUMzQyxhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLGlCQUFpQjtBQUNqQyxhQUFPLFFBQVEsTUFBTSxJQUFJLFdBQVcsRUFBRSxLQUFLLENBQUMsU0FBUyxhQUFhLEtBQUssV0FBVyxLQUFLLElBQUksQ0FBQztBQUM1RixhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLG1CQUFtQjtBQUNuQyxhQUFPLFFBQVEsTUFBTSxPQUFPLFdBQVcsRUFBRSxLQUFLLE1BQU0sYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUM7QUFDOUUsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxpQkFBaUI7QUFDakMsMEJBQW9CLElBQUksS0FBSyxFQUFFO0FBQUEsUUFDN0IsQ0FBQyxVQUFVO0FBQUUsY0FBSTtBQUFFLHlCQUFhLEVBQUUsVUFBVSxNQUFNLENBQUM7QUFBQSxVQUFHLFFBQVE7QUFBQSxVQUFDO0FBQUEsUUFBRTtBQUFBLFFBQ2pFLE1BQU07QUFBRSxjQUFJO0FBQUUseUJBQWEsRUFBRSxVQUFVLEtBQUssQ0FBQztBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUFFO0FBQUEsTUFDN0Q7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUtELFNBQU8sT0FBTyxPQUFPLGdCQUFnQixFQUFFLGlCQUFpQixLQUFLLENBQUM7QUFDOUQsU0FBTyxPQUFPLFFBQVEsWUFBWSxNQUFNO0FBQUEsRUFBcUMsQ0FBQzsiLAogICJuYW1lcyI6IFsiQnVmZmVyIiwgImJsb2NrcyIsICJleHBvcnRzIiwgIm1hcFN5c3RlbSIsICJlc2NhcGVSZWdleCIsICJoaXQiLCAiY2prQ2hhcnMiLCAib2JzSWQiLCAibWFwU3lzdGVtIiwgInIiXQp9Cg==
