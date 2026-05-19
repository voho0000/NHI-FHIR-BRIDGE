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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9uaGktYWRhcHRlcnMuanMiLCAiLi4vc3JjL25oaS1lbmRwb2ludHMuanMiLCAiLi4vc3JjL2JhY2tncm91bmQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG4gKiBbanMtc2hhMV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1zaGExfVxuICpcbiAqIEB2ZXJzaW9uIDAuNy4wXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMjRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4vKmpzbGludCBiaXR3aXNlOiB0cnVlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgSU5QVVRfRVJST1IgPSAnaW5wdXQgaXMgaW52YWxpZCB0eXBlJztcbiAgdmFyIEZJTkFMSVpFX0VSUk9SID0gJ2ZpbmFsaXplIGFscmVhZHkgY2FsbGVkJztcbiAgdmFyIFdJTkRPVyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnO1xuICB2YXIgcm9vdCA9IFdJTkRPVyA/IHdpbmRvdyA6IHt9O1xuICBpZiAocm9vdC5KU19TSEExX05PX1dJTkRPVykge1xuICAgIFdJTkRPVyA9IGZhbHNlO1xuICB9XG4gIHZhciBXRUJfV09SS0VSID0gIVdJTkRPVyAmJiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCc7XG4gIHZhciBOT0RFX0pTID0gIXJvb3QuSlNfU0hBMV9OT19OT0RFX0pTICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgaWYgKE5PREVfSlMpIHtcbiAgICByb290ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFdFQl9XT1JLRVIpIHtcbiAgICByb290ID0gc2VsZjtcbiAgfVxuICB2YXIgQ09NTU9OX0pTID0gIXJvb3QuSlNfU0hBMV9OT19DT01NT05fSlMgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHM7XG4gIHZhciBBTUQgPSB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQ7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAhcm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUiAmJiB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcbiAgdmFyIEVYVFJBID0gWy0yMTQ3NDgzNjQ4LCA4Mzg4NjA4LCAzMjc2OCwgMTI4XTtcbiAgdmFyIFNISUZUID0gWzI0LCAxNiwgOCwgMF07XG4gIHZhciBPVVRQVVRfVFlQRVMgPSBbJ2hleCcsICdhcnJheScsICdkaWdlc3QnLCAnYXJyYXlCdWZmZXInXTtcblxuICB2YXIgYmxvY2tzID0gW107XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICBpZiAocm9vdC5KU19TSEExX05PX05PREVfSlMgfHwgIWlzQXJyYXkpIHtcbiAgICBpc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3O1xuICBpZiAoQVJSQVlfQlVGRkVSICYmIChyb290LkpTX1NIQTFfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgfHwgIWlzVmlldykpIHtcbiAgICBpc1ZpZXcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmJ1ZmZlciAmJiBvYmouYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcjtcbiAgICB9O1xuICB9XG5cbiAgLy8gW21lc3NhZ2U6IHN0cmluZywgaXNTdHJpbmc6IGJvb2xdXG4gIHZhciBmb3JtYXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXNzYWdlO1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIFttZXNzYWdlLCB0cnVlXTtcbiAgICB9XG4gICAgaWYgKHR5cGUgIT09ICdvYmplY3QnIHx8IG1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChBUlJBWV9CVUZGRVIgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBbbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSksIGZhbHNlXTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KG1lc3NhZ2UpICYmICFpc1ZpZXcobWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGNyZWF0ZU91dHB1dE1ldGhvZCA9IGZ1bmN0aW9uIChvdXRwdXRUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IFNoYTEodHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2QgPSBjcmVhdGVPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIGlmIChOT0RFX0pTKSB7XG4gICAgICBtZXRob2QgPSBub2RlV3JhcChtZXRob2QpO1xuICAgIH1cbiAgICBtZXRob2QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKCk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuY3JlYXRlKCkudXBkYXRlKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPVVRQVVRfVFlQRVMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0eXBlID0gT1VUUFVUX1RZUEVTW2ldO1xuICAgICAgbWV0aG9kW3R5cGVdID0gY3JlYXRlT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIHZhciBub2RlV3JhcCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgICB2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgIHZhciBidWZmZXJGcm9tO1xuICAgIGlmIChCdWZmZXIuZnJvbSAmJiAhcm9vdC5KU19TSEExX05PX0JVRkZFUl9GUk9NKSB7XG4gICAgICBidWZmZXJGcm9tID0gQnVmZmVyLmZyb207XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlckZyb20gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihtZXNzYWdlKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBub2RlTWV0aG9kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKG1lc3NhZ2UsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSBudWxsIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG1lc3NhZ2UpIHx8IGlzVmlldyhtZXNzYWdlKSB8fFxuICAgICAgICBtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ1ZmZlckZyb20obWVzc2FnZSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGVNZXRob2Q7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSwgdHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlSG1hY01ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlSG1hY091dHB1dE1ldGhvZCgnaGV4Jyk7XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgSG1hY1NoYTEoa2V5KTtcbiAgICB9O1xuICAgIG1ldGhvZC51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZShrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QodHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRob2Q7XG4gIH07XG5cbiAgZnVuY3Rpb24gU2hhMShzaGFyZWRNZW1vcnkpIHtcbiAgICBpZiAoc2hhcmVkTWVtb3J5KSB7XG4gICAgICBibG9ja3NbMF0gPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICBibG9ja3NbOF0gPSBibG9ja3NbOV0gPSBibG9ja3NbMTBdID0gYmxvY2tzWzExXSA9XG4gICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICB9XG5cbiAgICB0aGlzLmgwID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmgxID0gMHhFRkNEQUI4OTtcbiAgICB0aGlzLmgyID0gMHg5OEJBRENGRTtcbiAgICB0aGlzLmgzID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmg0ID0gMHhDM0QyRTFGMDtcblxuICAgIHRoaXMuYmxvY2sgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMDtcbiAgICB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJzdCA9IHRydWU7XG4gIH1cblxuICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEZJTkFMSVpFX0VSUk9SKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShtZXNzYWdlKTtcbiAgICBtZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgIHZhciBpc1N0cmluZyA9IHJlc3VsdFsxXTtcbiAgICB2YXIgY29kZSwgaW5kZXggPSAwLCBpLCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCB8fCAwLCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgICAgIGJsb2Nrc1swXSA9IHRoaXMuYmxvY2s7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYoaXNTdHJpbmcpIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gY29kZSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvZGUgPSAweDEwMDAwICsgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhmMCB8IChjb2RlID4+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSB0aGlzLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgNjQ7ICsraW5kZXgpIHtcbiAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaTtcbiAgICAgIHRoaXMuYnl0ZXMgKz0gaSAtIHRoaXMuc3RhcnQ7XG4gICAgICBpZiAoaSA+PSA2NCkge1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGkgLSA2NDtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDA7XG4gICAgICB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgdmFyIGJsb2NrcyA9IHRoaXMuYmxvY2tzLCBpID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgIGJsb2Nrc1sxNl0gPSB0aGlzLmJsb2NrO1xuICAgIGJsb2Nrc1tpID4+PiAyXSB8PSBFWFRSQVtpICYgM107XG4gICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgaWYgKGkgPj0gNTYpIHtcbiAgICAgIGlmICghdGhpcy5oYXNoZWQpIHtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgfVxuICAgIGJsb2Nrc1sxNF0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjk7XG4gICAgYmxvY2tzWzE1XSA9IHRoaXMuYnl0ZXMgPDwgMztcbiAgICB0aGlzLmhhc2goKTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhID0gdGhpcy5oMCwgYiA9IHRoaXMuaDEsIGMgPSB0aGlzLmgyLCBkID0gdGhpcy5oMywgZSA9IHRoaXMuaDQ7XG4gICAgdmFyIGYsIGosIHQsIGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgZm9yKGogPSAxNjsgaiA8IDgwOyArK2opIHtcbiAgICAgIHQgPSBibG9ja3NbaiAtIDNdIF4gYmxvY2tzW2ogLSA4XSBeIGJsb2Nrc1tqIC0gMTRdIF4gYmxvY2tzW2ogLSAxNl07XG4gICAgICBibG9ja3Nbal0gPSAgKHQgPDwgMSkgfCAodCA+Pj4gMzEpO1xuICAgIH1cblxuICAgIGZvcihqID0gMDsgaiA8IDIwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IChhICYgYikgfCAoKH5hKSAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoKH5lKSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoKH5kKSAmIGEpO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IChjICYgZCkgfCAoKH5jKSAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgNDA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IGEgXiBiIF4gYztcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IGMgXiBkIF4gZTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDYwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSAtIDE4OTQwMDc1ODggKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKGEgJiBjKSB8IChiICYgYyk7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gKGUgJiBhKSB8IChlICYgYikgfCAoYSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoZCAmIGEpIHwgKGUgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKGMgJiBlKSB8IChkICYgZSk7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA4MDsgaiArPSA1KSB7XG4gICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSA4OTk0OTc1MTQgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSBkIF4gZSBeIGE7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IHRoaXMuaDAgKyBhIDw8IDA7XG4gICAgdGhpcy5oMSA9IHRoaXMuaDEgKyBiIDw8IDA7XG4gICAgdGhpcy5oMiA9IHRoaXMuaDIgKyBjIDw8IDA7XG4gICAgdGhpcy5oMyA9IHRoaXMuaDMgKyBkIDw8IDA7XG4gICAgdGhpcy5oNCA9IHRoaXMuaDQgKyBlIDw8IDA7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBoMCA9IHRoaXMuaDAsIGgxID0gdGhpcy5oMSwgaDIgPSB0aGlzLmgyLCBoMyA9IHRoaXMuaDMsIGg0ID0gdGhpcy5oNDtcblxuICAgIHJldHVybiBIRVhfQ0hBUlNbKGgwID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDAgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gyICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDMgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toNCAmIDB4MEZdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLnRvU3RyaW5nID0gU2hhMS5wcm90b3R5cGUuaGV4O1xuXG4gIFNoYTEucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gW1xuICAgICAgKGgwID4+PiAyNCkgJiAweEZGLCAoaDAgPj4+IDE2KSAmIDB4RkYsIChoMCA+Pj4gOCkgJiAweEZGLCBoMCAmIDB4RkYsXG4gICAgICAoaDEgPj4+IDI0KSAmIDB4RkYsIChoMSA+Pj4gMTYpICYgMHhGRiwgKGgxID4+PiA4KSAmIDB4RkYsIGgxICYgMHhGRixcbiAgICAgIChoMiA+Pj4gMjQpICYgMHhGRiwgKGgyID4+PiAxNikgJiAweEZGLCAoaDIgPj4+IDgpICYgMHhGRiwgaDIgJiAweEZGLFxuICAgICAgKGgzID4+PiAyNCkgJiAweEZGLCAoaDMgPj4+IDE2KSAmIDB4RkYsIChoMyA+Pj4gOCkgJiAweEZGLCBoMyAmIDB4RkYsXG4gICAgICAoaDQgPj4+IDI0KSAmIDB4RkYsIChoNCA+Pj4gMTYpICYgMHhGRiwgKGg0ID4+PiA4KSAmIDB4RkYsIGg0ICYgMHhGRlxuICAgIF07XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXkgPSBTaGExLnByb3RvdHlwZS5kaWdlc3Q7XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG4gICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDAsIHRoaXMuaDApO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMig0LCB0aGlzLmgxKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoOCwgdGhpcy5oMik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDEyLCB0aGlzLmgzKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoMTYsIHRoaXMuaDQpO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgZnVuY3Rpb24gSG1hY1NoYTEoa2V5LCBzaGFyZWRNZW1vcnkpIHtcbiAgICB2YXIgaSwgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShrZXkpO1xuICAgIGtleSA9IHJlc3VsdFswXTtcbiAgICBpZiAocmVzdWx0WzFdKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgbGVuZ3RoID0ga2V5Lmxlbmd0aCwgaW5kZXggPSAwLCBjb2RlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvZGUgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4YzAgfCAoY29kZSA+Pj4gNikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHhlMCB8IChjb2RlID4+PiAxMikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweDNmZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gNikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8IChjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBrZXkgPSBieXRlcztcbiAgICB9XG5cbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDY0KSB7XG4gICAgICBrZXkgPSAobmV3IFNoYTEodHJ1ZSkpLnVwZGF0ZShrZXkpLmFycmF5KCk7XG4gICAgfVxuXG4gICAgdmFyIG9LZXlQYWQgPSBbXSwgaUtleVBhZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgKytpKSB7XG4gICAgICB2YXIgYiA9IGtleVtpXSB8fCAwO1xuICAgICAgb0tleVBhZFtpXSA9IDB4NWMgXiBiO1xuICAgICAgaUtleVBhZFtpXSA9IDB4MzYgXiBiO1xuICAgIH1cblxuICAgIFNoYTEuY2FsbCh0aGlzLCBzaGFyZWRNZW1vcnkpO1xuXG4gICAgdGhpcy51cGRhdGUoaUtleVBhZCk7XG4gICAgdGhpcy5vS2V5UGFkID0gb0tleVBhZDtcbiAgICB0aGlzLmlubmVyID0gdHJ1ZTtcbiAgICB0aGlzLnNoYXJlZE1lbW9yeSA9IHNoYXJlZE1lbW9yeTtcbiAgfVxuICBIbWFjU2hhMS5wcm90b3R5cGUgPSBuZXcgU2hhMSgpO1xuXG4gIEhtYWNTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICB0aGlzLmlubmVyID0gZmFsc2U7XG4gICAgICB2YXIgaW5uZXJIYXNoID0gdGhpcy5hcnJheSgpO1xuICAgICAgU2hhMS5jYWxsKHRoaXMsIHRoaXMuc2hhcmVkTWVtb3J5KTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMub0tleVBhZCk7XG4gICAgICB0aGlzLnVwZGF0ZShpbm5lckhhc2gpO1xuICAgICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV4cG9ydHMgPSBjcmVhdGVNZXRob2QoKTtcbiAgZXhwb3J0cy5zaGExID0gZXhwb3J0cztcbiAgZXhwb3J0cy5zaGExLmhtYWMgPSBjcmVhdGVIbWFjTWV0aG9kKCk7XG5cbiAgaWYgKENPTU1PTl9KUykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiAgfSBlbHNlIHtcbiAgICByb290LnNoYTEgPSBleHBvcnRzO1xuICAgIGlmIChBTUQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwgIi8qKlxuICogQ2VudHJhbGlzZWQgRkhJUiBDb2RlU3lzdGVtIC8gSWRlbnRpZmllclN5c3RlbSBVUklzIHVzZWQgYnkgdGhlIG1hcHBlcnMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvZmhpci9zeXN0ZW1zLnB5YC4gV2UgdXNlIFVSTC1mb3JtIHN5c3RlbXMgaW5zdGVhZFxuICogb2YgT0lEcyBiZWNhdXNlOlxuICogICAtIGl0IGRvZXNuJ3QgcmVxdWlyZSBtaW50aW5nL293bmluZyBhIHJlYWwgTkhJL1RXIGNvcmUgT0lELFxuICogICAtIGl0J3Mgc2VsZi1kZXNjcmliaW5nIGluIHRvb2xzIHRoYXQgZG9uJ3QgcmVjb2duaXNlIHRoZSBPSUQsXG4gKiAgIC0gaXQgY2xlYW5seSBzdXJ2aXZlcyB0aGUgVFdOSElGSElSIHZhbGlkYXRvcidzIHN5bnRhY3RpYyBjaGVjay5cbiAqXG4gKiBBbGwgc3lzdGVtcyBsaXZlIGhlcmUgc28gYSBzaW5nbGUgY2hhbmdlIHJpcHBsZXMgdG8gZXZlcnkgbWFwcGVyLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgbmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU1MDY1XHU0RkREXHU3RjcyXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIChsYWIgKyBwcm9jZWR1cmUgb3JkZXIgY29kZXMgXHUyMDE0IHNhbWUgbmFtZXNwYWNlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfTUVESUNBTF9PUkRFUl9DT0RFID1cbiAgXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1tZWRpY2FsLW9yZGVyLWNvZGVcIjtcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1ODVFNVx1NTRDMVx1NEVFM1x1NzhCQyAoZHJ1ZyBjb2RlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfRFJVR19DT0RFID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1kcnVnLWNvZGVcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRhaXdhbiBwYXRpZW50IGlkZW50aWZpZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIChUYWl3YW4gbmF0aW9uYWwgSUQpLiAqL1xuZXhwb3J0IGNvbnN0IFRXX05BVElPTkFMX0lEID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9JZGVudGlmaWVyU3lzdGVtL25hdGlvbmFsLWlkXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBmYWxsYmFja3MgKHBlci1kZXBsb3ltZW50LCBOT1QgY3Jvc3Mtc3lzdGVtIGNhbm9uaWNhbCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTEFCX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWxhYlwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLW1lZGljYXRpb25cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUkVQT1JUX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLXJlcG9ydFwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9DT05ESVRJT05fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1wcm9jZWR1cmVcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQUxMRVJHRU5fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtYWxsZXJnZW5cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUEFUSUVOVF9NUk4gPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0lkZW50aWZpZXJTeXN0ZW0vaGlzLW1yblwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJuYXRpb25hbCBjb2RlIHN5c3RlbXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBMT0lOQyA9IFwiaHR0cDovL2xvaW5jLm9yZ1wiO1xuZXhwb3J0IGNvbnN0IFNOT01FRF9DVCA9IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiO1xuLyoqIElDRC0xMC1DTSAoVGFpd2FuIC8gXHU1MDY1XHU0RkREIHVzZXMgdGhpcywgbm90IGJhcmUgSUNELTEwKS4gKi9cbmV4cG9ydCBjb25zdCBJQ0RfMTBfQ00gPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiO1xuZXhwb3J0IGNvbnN0IElDRF8xMF9QQ1MgPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1wY3NcIjtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBPTkxZIGFcbiAqIGhhc2hlZCBQYXRpZW50LmlkIChlLmcuIHZpYSBhbiBIVFRQIGFjY2VzcyBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGVcbiAqIH4zME0gVGFpd2FuZXNlIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdFxuICogdGhpcyBiZWNhdXNlIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3XG4gKiBuYXRpb25hbCBJRCBpbiBhbnkgbGVha2VkIEJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBCdW5kbGUtbGVha1xuICogc2NlbmFyaW9zIGRpc2Nsb3NlIGJvdGggZmllbGRzIHRvZ2V0aGVyLCBzbyBhIHNhbHQgd291bGQgbm90IG1vdmVcbiAqIHRoZSBuZWVkbGUgdGhlcmUuIFRoZSByZW1haW5pbmcgc2luZ2xlLWZpZWxkIGxlYWsgdmVjdG9yIGlzIEhUVFBcbiAqIGFjY2VzcyBsb2dzOyBkZXBsb3ltZW50cyBzaG91bGQgc2NydWIgYC9maGlyL1BhdGllbnQvW14vXStgIHBhdGhzXG4gKiBhbmQgYD9wYXRpZW50PWAgcXVlcnkgc3RyaW5ncyBhdCB0aGUgcmV2ZXJzZS1wcm94eSBsYXllciAoc2VlXG4gKiBBUkNISVRFQ1RVUkUubWQgXHUwMEE3XCJQYXRpZW50LmlkIFx1NTNDRFx1NjNBOFx1OThBOFx1OTZBQVx1ODIwN1x1N0RFOVx1ODlFM1wiKS5cbiAqXG4gKiBVc2VzIGBqcy1zaGExYCAocHVyZSBKUykgaW5zdGVhZCBvZiBgbm9kZTpjcnlwdG9gIHNvIHRoZSBzYW1lIG1hcHBlclxuICogY29kZSBydW5zIHVubW9kaWZpZWQgaW4gdGhlIENocm9tZSBleHRlbnNpb24ncyBsb2NhbC1vbmx5IG1vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVJZChwYXRpZW50SWQ6IHN0cmluZywgLi4ucGFydHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW3BhdGllbnRJZCwgLi4ucGFydHNdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogTWFwIGEgcmF3IG5hdGlvbmFsIElEIChvciBhbnkgcGF0aWVudCBpZGVudGlmaWVyKSB0byBpdHMgMzItY2hhciBoZXhcbiAqIEZISVIgYFBhdGllbnQuaWRgLiBUaGUgcmF3IHZhbHVlIGlzIGtlcHQgaW4gYFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlYFxuICogXHUyMDE0IG9ubHkgdGhlIEZISVIgbG9naWNhbCBpZCBpcyBoYXNoZWQgc28gaXQgZG9lc24ndCBsZWFrIGludG8gVVJMcyxcbiAqIHN1YmplY3QucmVmZXJlbmNlIGZpZWxkcywgYXVkaXQgbG9ncywgb3IgU01BUlQgdG9rZW4gcGF5bG9hZHMuXG4gKlxuICogRkhJUiBSNCBcdTAwQTcyLjIwIHNheXMgXCJsb2dpY2FsIGlkIFx1MjAyNiBTSE9VTEQgTk9UIGNvbnRhaW4gaWRlbnRpZnlpbmdcbiAqIGluZm9ybWF0aW9uXCIgXHUyMDE0IHRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVQYXRpZW50SWQobmF0aW9uYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW1wicGF0aWVudFwiLCBuYXRpb25hbElkXS5qb2luKFwifFwiKSkuc2xpY2UoMCwgMzIpO1xufVxuXG4vKipcbiAqIFBhcnRpYWxseS1hbm9ueW1pemUgYSBwYXRpZW50IG5hbWUuIEFwcGxpZWQgaW4gbWFwUGF0aWVudCBzbyBldmVyeVxuICogRkhJUiByZXNvdXJjZSB0aGF0IGZsb3dzIG91dCBvZiB0aGlzIGNvZGViYXNlIChkb3dubG9hZGVkIEJ1bmRsZSxcbiAqIGJhY2tlbmQgRkhJUiBzdG9yZSwgZGFzaGJvYXJkLCBTTUFSVCBhcHAgbGF1bmNoZXMpIHNlZXMgdGhlIG1hc2tlZFxuICogZm9ybS4gVGhlIHVzZXIncyByYXcgaW5wdXQgaXMgc3RpbGwga2VwdCBpbiBjaHJvbWUuc3RvcmFnZSBzbyB0aGV5XG4gKiBjYW4gcmV2aWV3IHdoYXQgd2FzIGVudGVyZWQsIGJ1dCBpdCBuZXZlciBsZWF2ZXMgUGF0aWVudCBjb250ZXh0LlxuICpcbiAqIFJ1bGVzIChUYWl3YW4gLyBDSksgY29udmVudGlvbik6XG4gKiAgIC0gMSBjaGFyICAgICBcdTIxOTIga2VlcCBhcy1pcyAobm90aGluZyB0byBtYXNrKVxuICogICAtIDIgY2hhcnMgICAgXHUyMTkyIGtlZXAgZmlyc3QsIHJlcGxhY2Ugc2Vjb25kIHdpdGggTyAgICBcdTczOEJcdTY2MEUgXHUyMTkyIFx1NzM4Qk9cbiAqICAgLSAzKyBjaGFycyAgIFx1MjE5MiBrZWVwIGZpcnN0ICsgbGFzdCwgbWlkZGxlIGFsbCBPICAgICAgXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTY3OTdcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1Njc5N09PXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTRFMkRcdTVDRjZcdTUwNjVcdTZCMjFcdTkwQ0UgXHUyMTkyIFx1NEUyRE9PT1x1OTBDRVxuICpcbiAqIFdlc3Rlcm4gbmFtZXMgKGNvbnRhaW4gd2hpdGVzcGFjZSk6IHNwbGl0IG9uIHNwYWNlLCBrZWVwIGZpcnN0ICtcbiAqIGxhc3QgdG9rZW5zLCBwYXJ0aWFsLW1hc2sgdGhlIGxhc3QgYW5kIG1pZGRsZTpcbiAqICAgSm9obiBTbWl0aCBcdTIxOTIgSm9obiBTKioqXG4gKiAgIEpvaG4gUSBTbWl0aCBcdTIxOTIgSm9obiAqKiogU21pdGhcbiAqL1xuLyoqXG4gKiBIYWxmLW1hc2sgYSBUYWl3YW4gbmF0aW9uYWwgSUQgZm9yIHNob3VsZGVyLXN1cmZpbmctc2FmZSBkaXNwbGF5LlxuICogTWF0Y2hlcyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBJ3Mgb3duIGBoaWRgIGNvbnZlbnRpb24gKGZpcnN0IDYgdmlzaWJsZSwgbGFzdFxuICogNCBoaWRkZW4pOiBgUDEyMzQ1MDg2NmAgXHUyMTkyIGBQMTIzNDUqKioqYC5cbiAqXG4gKiBgY2hhcmAgZGVmYXVsdHMgdG8gYCpgIGZvciBwb3B1cC90b2FzdCBkaXNwbGF5LiBVc2UgYFhgIGZvciBmaWxlbmFtZXNcbiAqIHNpbmNlIGAqYCBpcyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIFRoZSBhdXRvLWdlbmVyYXRlZFxuICogYGF1dG8tWFhYWFhYWFhgIHBsYWNlaG9sZGVycyBmbG93IHRocm91Z2ggdW5jaGFuZ2VkIChhbHJlYWR5XG4gKiBub24taWRlbnRpZnlpbmcpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFza0lkKGlkOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjaGFyID0gXCIqXCIpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKGlkID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gcztcbiAgaWYgKC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChzKSkgcmV0dXJuIHMuc2xpY2UoMCwgNikgKyBjaGFyLnJlcGVhdCg0KTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gcztcbiAgaWYgKHMubGVuZ3RoID4gNikgcmV0dXJuIHMuc2xpY2UoMCwgMikgKyBjaGFyLnJlcGVhdChzLmxlbmd0aCAtIDQpICsgcy5zbGljZSgtMik7XG4gIHJldHVybiBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFza05hbWUobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSAobmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghdHJpbW1lZCB8fCB0cmltbWVkID09PSBcIlVua25vd25cIikgcmV0dXJuIHRyaW1tZWQ7XG5cbiAgaWYgKC9cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoL1xccysvKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSByZXR1cm4gcGFydHNbMF0hO1xuICAgIGNvbnN0IGZpcnN0ID0gcGFydHNbMF0hO1xuICAgIGNvbnN0IGxhc3QgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSE7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gRml4ZWQgMyBzdGFycyByZWdhcmRsZXNzIG9mIG9yaWdpbmFsIGxlbmd0aCBcdTIwMTQgZG9uJ3QgbGVhayBob3dcbiAgICAgIC8vIGxvbmcgdGhlIHN1cm5hbWUgd2FzIHZpYSBtYXNrIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxhc3RNYXNrZWQgPSBsYXN0Lmxlbmd0aCA8PSAxID8gbGFzdCA6IGAke2xhc3RbMF19KioqYDtcbiAgICAgIHJldHVybiBgJHtmaXJzdH0gJHtsYXN0TWFza2VkfWA7XG4gICAgfVxuICAgIGNvbnN0IG1pZGRsZXMgPSBwYXJ0cy5zbGljZSgxLCAtMSkubWFwKCgpID0+IFwiKioqXCIpO1xuICAgIHJldHVybiBbZmlyc3QsIC4uLm1pZGRsZXMsIGxhc3RdLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgLy8gQ0pLIC8gc2luZ2xlLXRva2VuIHBhdGguIEl0ZXJhdGUgY29kZXBvaW50cyAobm90IFVURi0xNiB1bml0cykgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyBjYW4ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKHRyaW1tZWQpO1xuICBpZiAoY2hhcnMubGVuZ3RoIDw9IDEpIHJldHVybiB0cmltbWVkO1xuICBpZiAoY2hhcnMubGVuZ3RoID09PSAyKSByZXR1cm4gYCR7Y2hhcnNbMF19T2A7XG4gIHJldHVybiBjaGFyc1swXSArIFwiT1wiLnJlcGVhdChjaGFycy5sZW5ndGggLSAyKSArIGNoYXJzW2NoYXJzLmxlbmd0aCAtIDFdO1xufVxuIiwgIi8qKlxuICogQWxsZXJneUludG9sZXJhbmNlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvYWxsZXJneS5weWAuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUxMT1dFRF9DQVRFR09SSUVTID0gbmV3IFNldChbXCJtZWRpY2F0aW9uXCIsIFwiZm9vZFwiLCBcImVudmlyb25tZW50XCIsIFwiYmlvbG9naWNcIl0pO1xuY29uc3QgQUxMT1dFRF9DUklUSUNBTElUWSA9IG5ldyBTZXQoW1wiaGlnaFwiLCBcImxvd1wiLCBcInVuYWJsZS10by1hc3Nlc3NcIl0pO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwicnhub3JtXCIpKSByZXR1cm4gXCJodHRwOi8vd3d3Lm5sbS5uaWguZ292L3Jlc2VhcmNoL3VtbHMvcnhub3JtXCI7XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9BTExFUkdFTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQWxsZXJneUludG9sZXJhbmNlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQWxsZXJnZW5cIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQWxsZXJneUludG9sZXJhbmNlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcucmVjb3JkZWRfZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgcGF0aWVudDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjbGluaWNhbFN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtY2xpbmljYWxcIixcbiAgICAgICAgICBjb2RlOiBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtdmVyaWZpY2F0aW9uXCIsXG4gICAgICAgICAgY29kZTogXCJjb25maXJtZWRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGNhdGVnb3J5ID0gcmF3LmNhdGVnb3J5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NBVEVHT1JJRVMuaGFzKGNhdGVnb3J5KSkge1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW2NhdGVnb3J5XTtcbiAgfVxuXG4gIGNvbnN0IGNyaXRpY2FsaXR5ID0gcmF3LmNyaXRpY2FsaXR5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NSSVRJQ0FMSVRZLmhhcyhjcml0aWNhbGl0eSkpIHtcbiAgICByZXNvdXJjZS5jcml0aWNhbGl0eSA9IGNyaXRpY2FsaXR5O1xuICB9XG5cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IHJlYWN0aW9uTm90ZSA9IHJhdy5yZWFjdGlvbiA/PyBcIlwiO1xuICBpZiAocmVhY3Rpb25Ob3RlKSB7XG4gICAgcmVzb3VyY2UucmVhY3Rpb24gPSBbeyBkZXNjcmlwdGlvbjogcmVhY3Rpb25Ob3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogQ29uZGl0aW9uIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvY29uZGl0aW9uLnB5YC4gSW5jbHVkZXMgdGhlIElDRC0xMC1DTVxuICogbm9ybWFsaXNlciAoVFdOSElGSElSIFJvdW5kLTMgZml4KSB3aGljaCBpbnNlcnRzIHRoZSBjYW5vbmljYWwgZG90XG4gKiBiYWNrIGludG8gTkhJJ3MgdW4tZG90dGVkIGNvZGVzIChcIkUxMTIyXCIgXHUyMTkyIFwiRTExLjIyXCIpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbi8vIElDRC0xMC1DTSBjYW5vbmljYWwgZm9ybSBpcyAnWFhYLllZWVtBLVpdJyAoY2F0ZWdvcnkgMyBjaGFycyArIG9wdGlvbmFsXG4vLyBkb3QgKyBzdWJkaXZpc2lvbiArIG9wdGlvbmFsIDd0aC1jaGFyYWN0ZXIgZXh0ZW5zaW9uKS4gTkhJIFx1NTA2NVx1NEZERCBzZW5kc1xuLy8gY29kZXMgV0lUSE9VVCB0aGUgZG90ICgnRTExMjInLCAnTTQ3ODkyJywgJ1MwOTkzWEEnLCAnTTE5MjcxJykuXG4vLyBWYWxpZGF0b3IgcmVqZWN0cyB1bi1kb3R0ZWQgY29kZXMgYXMgJ1Vua25vd24gY29kZScuXG5jb25zdCBJQ0QxMF9DQVRFR09SWV9SRSA9IC9eW0EtWl1bMC05QS1aXXsyfSQvO1xuXG4vKipcbiAqIEluc2VydCB0aGUgZG90IGJhY2sgaW50byBOSEkncyBuby1kb3QgSUNELTEwLUNNIGNvZGVzLlxuICogICBFMTEyMiAgICBcdTIxOTIgRTExLjIyXG4gKiAgIE00Nzg5MiAgIFx1MjE5MiBNNDcuODkyXG4gKiAgIFMwOTkzWEEgIFx1MjE5MiBTMDkuOTNYQVxuICogICBFMTEgICAgICBcdTIxOTIgRTExICAgICAgICAobm8gc3ViZGl2aXNpb247IHBhc3MgdGhyb3VnaClcbiAqICAgRTExLjIyICAgXHUyMTkyIEUxMS4yMiAgICAgKGFscmVhZHkgZG90dGVkOyBwYXNzIHRocm91Z2gpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVJY2QxMENtKGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWNvZGUgfHwgY29kZS5pbmNsdWRlcyhcIi5cIikpIHJldHVybiBjb2RlID8/IFwiXCI7XG4gIGNvbnN0IHMgPSBjb2RlLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAocy5sZW5ndGggPD0gMykgcmV0dXJuIHM7XG4gIGNvbnN0IGhlYWQgPSBzLnNsaWNlKDAsIDMpO1xuICBjb25zdCB0YWlsID0gcy5zbGljZSgzKTtcbiAgaWYgKElDRDEwX0NBVEVHT1JZX1JFLnRlc3QoaGVhZCkpIHtcbiAgICByZXR1cm4gYCR7aGVhZH0uJHt0YWlsfWA7XG4gIH1cbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJpY2QtMTBcIikgfHwgcy5pbmNsdWRlcyhcImljZDEwXCIpKSB7XG4gICAgLy8gTkhJIFx1NTA2NVx1NEZERCBjb2RlcyBhcmUgSUNELTEwLUNNIChVUy9UYWl3YW4gZXh0ZW5kZWQgc2V0IFx1MjAxNCBlLmcuXG4gICAgLy8gRTExLjIyKS4gVGhlIGJhc2UgSUNELTEwIFZhbHVlU2V0IHJlamVjdHMgdGhlc2UgYXMgJ1Vua25vd24gY29kZScuXG4gICAgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX0NNO1xuICB9XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9DT05ESVRJT05fQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcENvbmRpdGlvbihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQ29uZGl0aW9uXCI7XG4gIGxldCBjb2RlID0gcmF3LmNvZGUgYXMgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG4gIGlmIChzeXN0ZW0gPT09IHN5c3RlbXMuSUNEXzEwX0NNICYmIGNvZGUpIHtcbiAgICBjb2RlID0gbm9ybWFsaXplSWNkMTBDbShjb2RlKTtcbiAgfVxuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJDb25kaXRpb25cIixcbiAgICAvLyBTdGFibGUgaWQgZmFsbHMgYmFjayB0byBkaXNwbGF5IHdoZW4gbm8gY29kZSBpcyBwcmVzZW50IChjYXRhc3Ryb3BoaWNcbiAgICAvLyBpbGxuZXNzIHJvd3MgZnJvbSBJSEtFMzIwOSBjYXJyeSB0aGUgQ2hpbmVzZSBuYXJyYXRpdmUgb25seSkuIE1pcnJvcnNcbiAgICAvLyB0aGUgc2FtZSBgY29kZSB8fCBkaXNwbGF5YCBwYXR0ZXJuIGluIGRpYWdub3N0aWMtcmVwb3J0LnRzIGFuZFxuICAgIC8vIGFsbGVyZ3kudHMgXHUyMDE0IGF2b2lkcyBoYXNoIGNvbGxpc2lvbnMgYmV0d2VlbiB0d28gc2FtZS1kYXkgY29kZS1sZXNzXG4gICAgLy8gY29uZGl0aW9ucy5cbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5vbnNldF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IHJhdy5jbGluaWNhbF9zdGF0dXMgPz8gXCJhY3RpdmVcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB2ZXJpZmljYXRpb25TdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLXZlci1zdGF0dXNcIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9O1xuXG4gIC8vIENhdGVnb3J5IHJvdXRlcyB0aGUgQ29uZGl0aW9uIGludG8gdGhlIHJpZ2h0IGRvd25zdHJlYW0gdmlldy5cbiAgLy8gLSBcInByb2JsZW0tbGlzdC1pdGVtXCIgXHUyMTkyIFNNQVJUIC8gSVBTIFByb2JsZW0gTGlzdCBzZWN0aW9uXG4gIC8vIC0gXCJlbmNvdW50ZXItZGlhZ25vc2lzXCIgXHUyMTkyIHBlci1lbmNvdW50ZXIgZGlhZ25vc2VzXG4gIC8vIC0gXCJoZWFsdGgtY29uY2VyblwiIFx1MjE5MiBJUFMgSGVhbHRoIENvbmNlcm5zXG4gIC8vIEFkYXB0ZXItbGV2ZWwgZGVjaXNpb246IFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSByb3dzIG1hcmsgY2F0ZWdvcnk9XCJwcm9ibGVtLWxpc3QtaXRlbVwiO1xuICAvLyBnZW5lcmljIGVuY291bnRlci1kZXJpdmVkIGNvbmRpdGlvbnMgY2FuIG9taXQsIGRlZmF1bHRpbmcgdG8gbm9cbiAgLy8gZXhwbGljaXQgY2F0ZWdvcnkgKFNNQVJUIGFwcHMgZmFsbCB0aHJvdWdoIHRvIGFsbC1jb25kaXRpb25zIHZpZXcpLlxuICBpZiAocmF3LmNhdGVnb3J5KSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogcmF3LmNhdGVnb3J5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICByZXNvdXJjZS5jb2RlID0ge1xuICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgdGV4dDogZGlzcGxheSxcbiAgfTtcblxuICBjb25zdCBzZXZlcml0eSA9IHJhdy5zZXZlcml0eSA/PyBcIlwiO1xuICBpZiAoc2V2ZXJpdHkpIHtcbiAgICByZXNvdXJjZS5zZXZlcml0eSA9IHsgdGV4dDogc2V2ZXJpdHkgfTtcbiAgfVxuXG4gIGlmIChyYXcub25zZXRfZGF0ZSkge1xuICAgIHJlc291cmNlLm9uc2V0RGF0ZVRpbWUgPSBgJHtyYXcub25zZXRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcucmVjb3JkZWRfZGF0ZSkge1xuICAgIHJlc291cmNlLnJlY29yZGVkRGF0ZSA9IGAke3Jhdy5yZWNvcmRlZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBEaWFnbm9zdGljUmVwb3J0IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZGlhZ25vc3RpY19yZXBvcnQucHlgLiBSZXR1cm5zIG51bGwgZm9yXG4gKiBsaXN0LXBhZ2Ugcm93cyBsYWNraW5nIGEgY29uY2x1c2lvbiwgYW5kIGZvciBsYWItdmFsdWUtb25seSBcInJlcG9ydHNcIlxuICogdGhhdCB3b3VsZCBkdXBsaWNhdGUgYSBwcm9wZXIgT2JzZXJ2YXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgVjJfMDA3NCA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92Mi0wMDc0XCI7XG5cbmNvbnN0IENBVEVHT1JZX01BUDogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgTEFCOiBbVjJfMDA3NCwgXCJMQUJcIiwgXCJMYWJvcmF0b3J5XCJdLFxuICBSQUQ6IFtWMl8wMDc0LCBcIlJBRFwiLCBcIlJhZGlvbG9neVwiXSxcbiAgQ0FSOiBbVjJfMDA3NCwgXCJDQVJcIiwgXCJDYXJkaW9sb2d5XCJdLFxuICBQQVRIOiBbVjJfMDA3NCwgXCJQQVRcIiwgXCJQYXRob2xvZ3lcIl0sXG59O1xuXG4vLyBMYWItcmVzdWx0IHBhdHRlcm5zIHRoYXQgbG9vayBsaWtlIHNpbmdsZS12YWx1ZSBsYWIgcmVhZGluZ3MgcmF0aGVyXG4vLyB0aGFuIGEgbmFycmF0aXZlIHJlcG9ydC5cbmNvbnN0IExBQl9VTklUX1JFID1cbiAgL1xcZCsoPzpcXC5cXGQrKT9cXHMqKD86JXxtZ1xcL2RMfGdcXC9kTHxtbW9sXFwvTHxVXFwvTHxJVVxcL0x8bUlVXFwvTHxuZ1xcL21MfFx1MDNCQ2dcXC9kTHx1Z1xcL2RMfHBnXFwvbUx8Zkx8XFwvdUx8MTBcXF4/XFxkK1xcL3VMfHgxMFxcXj9cXGQrXFwvdUx8c2VjfFx1NzlEMnxjb3BpZXNcXC9tTCkvO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIHRydWU7XG4gIGNvbnN0IHRleHQgPSBjb25jbHVzaW9uLnRyaW0oKTtcbiAgLy8gUmVhbCBuYXJyYXRpdmUgcmVwb3J0cyBhbG1vc3QgYWx3YXlzIGNvbnRhaW4gbXVsdGlwbGUgc2VudGVuY2VzLlxuICBpZiAodGV4dC5sZW5ndGggPiAxMDApIHJldHVybiBmYWxzZTtcbiAgLy8gU2luZ2xlIHZhbHVlIHBhdHRlcm4gKyBwYXJlbnRoZXRpY2FsIHJlZmVyZW5jZSByYW5nZSA9IGxhYiBsaW5lLlxuICBpZiAoTEFCX1VOSVRfUkUudGVzdCh0ZXh0KSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcERpYWdub3N0aWNSZXBvcnQoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoKHJhdy5jb25jbHVzaW9uID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWNvbmNsdXNpb24pIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGNhdEtleVJhdyA9IFN0cmluZyhyYXcuY2F0ZWdvcnkgPz8gXCJcIikudG9VcHBlckNhc2UoKTtcbiAgaWYgKGNhdEtleVJhdyA9PT0gXCJMQUJcIiAmJiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUmVwb3J0XCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtSGludCA9IHJhdy5zeXN0ZW0gPz8gXCJcIjtcbiAgY29uc3Qgc3lzdGVtID1cbiAgICB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiAmJiBzeXN0ZW1IaW50LnRvVXBwZXJDYXNlKCkgPT09IFwiTE9JTkNcIlxuICAgICAgPyBzeXN0ZW1zLkxPSU5DXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1JFUE9SVF9DT0RFO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcuZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiByYXcuc3RhdHVzID8/IFwiZmluYWxcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gICAgY29uY2x1c2lvbixcbiAgfTtcblxuICBjb25zdCBjYXRFbnRyeSA9IENBVEVHT1JZX01BUFtjYXRLZXlSYXddO1xuICBpZiAoY2F0RW50cnkpIHtcbiAgICBjb25zdCBbY2F0U3lzLCBjYXRDb2RlLCBjYXREaXNwbGF5XSA9IGNhdEVudHJ5O1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW3sgY29kaW5nOiBbeyBzeXN0ZW06IGNhdFN5cywgY29kZTogY2F0Q29kZSwgZGlzcGxheTogY2F0RGlzcGxheSB9XSB9XTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAocmF3Lmlzc3VlZCkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5pc3N1ZWR9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfSBlbHNlIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIEVuY291bnRlciBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2VuY291bnRlci5weWAuIFN0YWJsZSBJRCBpbmNsdWRlcyBob3NwaXRhbFxuICogc28gc2FtZS1kYXkgdmlzaXRzIHRvIGRpZmZlcmVudCBpbnN0aXR1dGlvbnMgZWFjaCBnZXQgdGhlaXIgb3duXG4gKiBFbmNvdW50ZXIgKHRoZSBwb3N0LW1hcHBpbmcgbGlua2VyIGRlcGVuZHMgb24gdGhpcykuXG4gKi9cblxuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IEFDVENPREVfU1lTVEVNID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YzLUFjdENvZGVcIjtcblxuY29uc3QgQ0xBU1NfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBBTUI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJBTUJcIiwgXCJhbWJ1bGF0b3J5XCJdLFxuICBJTVA6IFtBQ1RDT0RFX1NZU1RFTSwgXCJJTVBcIiwgXCJpbnBhdGllbnQgZW5jb3VudGVyXCJdLFxuICBFTUVSOiBbQUNUQ09ERV9TWVNURU0sIFwiRU1FUlwiLCBcImVtZXJnZW5jeVwiXSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBFbmNvdW50ZXIocmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCBlbmNDbGFzcyA9IFN0cmluZyhyYXcuY2xhc3MgPz8gXCJBTUJcIikudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2xhc3NFbnRyeSA9IENMQVNTX01BUFtlbmNDbGFzc10gPz8gQ0xBU1NfTUFQLkFNQiE7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkVuY291bnRlclwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIHJhdy5kYXRlID8/IFwiXCIsIGVuY0NsYXNzLCAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKSksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5pc2hlZFwiLFxuICAgIGNsYXNzOiB7XG4gICAgICBzeXN0ZW06IGNsYXNzRW50cnlbMF0sXG4gICAgICBjb2RlOiBjbGFzc0VudHJ5WzFdLFxuICAgICAgZGlzcGxheTogY2xhc3NFbnRyeVsyXSxcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgLy8gTkhJJ3MgZW5jb3VudGVyIFwidHlwZVwiIG1hcmtlcnMgXHUyMDE0ICdJQ1x1NTM2MVx1OENDN1x1NjU5OScgLyAnXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5JyAvICdcdTRGNEZcdTk2NjInXG4gIC8vIFx1MjAxNCBhcmUgZGF0YS1vcmlnaW4gbGFiZWxzLCBub3QgU05PTUVEIGNsaW5pY2FsIHR5cGVzLiBLZWVwIHRoZW0gYXNcbiAgLy8gQ29kZWFibGVDb25jZXB0LnRleHQgd2l0aG91dCBjbGFpbWluZyBTTk9NRUQuXG4gIGNvbnN0IHR5cGVEaXNwbGF5ID0gKChyYXcudHlwZV9kaXNwbGF5ID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAodHlwZURpc3BsYXkpIHtcbiAgICByZXNvdXJjZS50eXBlID0gW3sgdGV4dDogdHlwZURpc3BsYXkgfV07XG4gIH1cblxuICBjb25zdCBwZXJpb2Q6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgaWYgKHJhdy5kYXRlKSBwZXJpb2Quc3RhcnQgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3LmVuZF9kYXRlKSBwZXJpb2QuZW5kID0gYCR7cmF3LmVuZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChPYmplY3Qua2V5cyhwZXJpb2QpLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5wZXJpb2QgPSBwZXJpb2Q7XG4gIH1cblxuICBjb25zdCBkZXBhcnRtZW50ID0gcmF3LmRlcGFydG1lbnQgPz8gXCJcIjtcbiAgY29uc3QgcHJvdmlkZXIgPSByYXcucHJvdmlkZXIgPz8gXCJcIjtcbiAgaWYgKGRlcGFydG1lbnQgfHwgcHJvdmlkZXIpIHtcbiAgICBjb25zdCBwYXJ0aWNpcGFudDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChwcm92aWRlcikgcGFydGljaXBhbnQuaW5kaXZpZHVhbCA9IHsgZGlzcGxheTogcHJvdmlkZXIgfTtcbiAgICByZXNvdXJjZS5wYXJ0aWNpcGFudCA9IE9iamVjdC5rZXlzKHBhcnRpY2lwYW50KS5sZW5ndGggPiAwID8gW3BhcnRpY2lwYW50XSA6IFtdO1xuICAgIGlmIChkZXBhcnRtZW50KSB7XG4gICAgICByZXNvdXJjZS5zZXJ2aWNlVHlwZSA9IHsgdGV4dDogZGVwYXJ0bWVudCB9O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnNlcnZpY2VQcm92aWRlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIGNvbnN0IHJlYXNvbiA9IHJhdy5yZWFzb24gPz8gXCJcIjtcbiAgaWYgKHJlYXNvbikge1xuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbeyB0ZXh0OiByZWFzb24gfV07XG4gIH1cblxuICBjb25zdCBkaXNjaGFyZ2UgPSByYXcuZGlzY2hhcmdlX2Rpc3Bvc2l0aW9uID8/IFwiXCI7XG4gIGlmIChkaXNjaGFyZ2UpIHtcbiAgICByZXNvdXJjZS5ob3NwaXRhbGl6YXRpb24gPSB7IGRpc2NoYXJnZURpc3Bvc2l0aW9uOiB7IHRleHQ6IGRpc2NoYXJnZSB9IH07XG4gIH1cblxuICBjb25zdCBjbGluaWNhbE5vdGUgPSAoKHJhdy5jbGluaWNhbF9ub3RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoY2xpbmljYWxOb3RlKSB7XG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IGNsaW5pY2FsTm90ZSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIE1lZGljYXRpb25SZXF1ZXN0IG1hcHBlciArIGJpbGluZ3VhbCBkZWR1cGxpY2F0aW9uLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9tZWRpY2F0aW9uLnB5YC4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSByZXBvcnRzIHRoZVxuICogU0FNRSBwcmVzY3JpcHRpb24gbXVsdGlwbGUgdGltZXMgKEVuZ2xpc2gtb25seSAvIEVuZytcdTRFMkQgLyBcdTRFMkQrRW5nKS5cbiAqIGBtYXBNZWRpY2F0aW9uc0RlZHVwYCBjb2xsYXBzZXMgdGhlc2UgdG8gb25lIE1lZGljYXRpb25SZXF1ZXN0IHBlclxuICogKGRhdGUsIGNhbm9uaWNhbC1kcnVnLWtleSksIHByZWZlcnJpbmcgdGhlIGZvcm0gd2l0aCBtb3JlIENKSyBjaGFyc1xuICogKGNsaW5pY2lhbnMgcmVhZCBcdTU1NDZcdTU0QzFcdTU0MEQgZmlyc3QpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgbm9ybWFsaXplSWNkMTBDbSB9IGZyb20gXCIuL2NvbmRpdGlvblwiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmZ1bmN0aW9uIGlzQ2prKGNoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gXHU0RTAwIChVKzRFMDApIHRvIFx1OUZGRiAoVSs5RkZGKSBjb3ZlcnMgQ0pLIFVuaWZpZWQgSWRlb2dyYXBocy5cbiAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICByZXR1cm4gY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZjtcbn1cblxuZnVuY3Rpb24gY2prQ2hhcnMoczogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSBpZiAoaXNDamsoY2gpKSBuKys7XG4gIHJldHVybiBuO1xufVxuXG4vKipcbiAqIE1hdGNoIGEgXCJsb25nXCIgRW5nbGlzaCBjaHVuayAoXHUyMjY1NCBjaGFycyBvZiBBLVovMC05L3B1bmN0dWF0aW9uIGNvbW1vblxuICogdG8gZHJ1ZyBuYW1lcykuIEF2b2lkIG1hdGNoaW5nIHNob3J0IHRva2VucyBsaWtlIFwiRFwiIG9yIFwiUE9cIiB0aGF0XG4gKiBhcHBlYXIgaW5zaWRlIENoaW5lc2UgbmFtZXMuXG4gKi9cbmNvbnN0IEVOX0NIVU5LX0cgPSAvW0EtWl1bQS1aMC05LiUvXFwtXCInXFxzXXszLH0vZztcblxuLyoqXG4gKiBSZWR1Y2UgYSBkcnVnLW5hbWUgc3RyaW5nIHRvIGEgc3RhYmxlIGNhbm9uaWNhbCBrZXkuIEV4dHJhY3QgdGhlXG4gKiBsb25nZXN0IEVuZ2xpc2ggZnJhZ21lbnQsIHRoZW4gdHJ1bmNhdGUgYXQgY29tbW9uIHNlcGFyYXRvcnMgc28gYVxuICogbmFtZSB3aXRoIGV4dHJhIHRyYWlsaW5nIG1vZGlmaWVycyBzdGlsbCBjb2xsYXBzZXMgdG8gYnJhbmQrc3RyZW5ndGguXG4gKlxuICogRXhhbXBsZXMgKGFsbCBtYXAgdG8gXCJ0aW1vcHRvbCB4ZSAwLjUlIG9waHRoYWxtaWMgc29sdXRpb25cIik6XG4gKiAgIFwiVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OXCJcbiAqICAgXCJUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT04gKFx1OTc1Mlx1NzczQ1x1OTczMlx1MjAyNilcIlxuICogICBcIlx1OTc1Mlx1NzczQ1x1OTczMlx1MjAyNiAoVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OKVwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxEcnVnS2V5KG5hbWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKG5hbWUgPz8gXCJcIikudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2h1bmtzID0gWy4uLnMubWF0Y2hBbGwoRU5fQ0hVTktfRyldLm1hcCgobSkgPT4gbVswXSk7XG4gIGlmIChjaHVua3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIChuYW1lID8/IFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIGxldCBsb25nZXN0ID0gY2h1bmtzLnJlZHVjZSgoYSwgYikgPT4gKGIubGVuZ3RoID4gYS5sZW5ndGggPyBiIDogYSkpLnRyaW0oKTtcbiAgZm9yIChjb25zdCBzZXAgb2YgW1wiIC0gXCIsIFwiIFx1MjAxMyBcIiwgXCIgLyBcIl0pIHtcbiAgICBpZiAobG9uZ2VzdC5pbmNsdWRlcyhzZXApKSB7XG4gICAgICBsb25nZXN0ID0gbG9uZ2VzdC5zcGxpdChzZXApWzBdITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxvbmdlc3QucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogQmVzdC1lZmZvcnQgYWN0aXZlIHZzIGNvbXBsZXRlZCBkZWNpc2lvbiBmb3IgYSBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqIEFjdGl2ZSB3aGlsZSAoYXV0aG9yZWRfZGF0ZSArIGR1cmF0aW9uID4gdG9kYXkpOyBvdGhlcndpc2UgY29tcGxldGVkLlxuICogTWlzc2luZyBkdXJhdGlvbiBcdTIxOTIgYXNzdW1lIDkwLWRheSByZWZpbGwgd2luZG93IChOSEkncyB0eXBpY2FsIGNhZGVuY2UpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVkU3RhdHVzKFxuICBhdXRob3JlZElzbzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgZHVyYXRpb25EYXlzOiBhbnksXG4pOiBcImFjdGl2ZVwiIHwgXCJjb21wbGV0ZWRcIiB7XG4gIGlmICghYXV0aG9yZWRJc28pIHJldHVybiBcImNvbXBsZXRlZFwiO1xuICBjb25zdCBkYXRlUGFydCA9IFN0cmluZyhhdXRob3JlZElzbykuc2xpY2UoMCwgMTApO1xuICBjb25zdCBwYXJzZWQgPSBuZXcgRGF0ZShgJHtkYXRlUGFydH1UMDA6MDA6MDBaYCk7XG4gIGlmIChOdW1iZXIuaXNOYU4ocGFyc2VkLmdldFRpbWUoKSkpIHJldHVybiBcImNvbXBsZXRlZFwiO1xuXG4gIGxldCBkYXlzOiBudW1iZXIgfCBudWxsO1xuICBpZiAoZHVyYXRpb25EYXlzID09PSBudWxsIHx8IGR1cmF0aW9uRGF5cyA9PT0gdW5kZWZpbmVkIHx8IGR1cmF0aW9uRGF5cyA9PT0gXCJcIikge1xuICAgIGRheXMgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG4gPSBOdW1iZXIucGFyc2VJbnQoU3RyaW5nKGR1cmF0aW9uRGF5cyksIDEwKTtcbiAgICBkYXlzID0gTnVtYmVyLmlzRmluaXRlKG4pID8gbiA6IG51bGw7XG4gIH1cbiAgaWYgKGRheXMgPT09IG51bGwpIGRheXMgPSA5MDtcblxuICBjb25zdCBlbmQgPSBuZXcgRGF0ZShwYXJzZWQuZ2V0VGltZSgpKTtcbiAgZW5kLnNldFVUQ0RhdGUoZW5kLmdldFVUQ0RhdGUoKSArIGRheXMpO1xuICAvLyBDb21wYXJlIGRhdGUtb25seSAodG9kYXkgaW4gVVRDIHNpbmNlIHdlIGF1dGhvcmVkSXNvIGlzIGRhdGUtb25seSkuXG4gIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgdG9kYXkuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBlbmQgPj0gdG9kYXkgPyBcImFjdGl2ZVwiIDogXCJjb21wbGV0ZWRcIjtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IG9uZSBzY3JhcGVkIHByZXNjcmlwdGlvbiBkaWN0IFx1MjE5MiBGSElSIFI0IE1lZGljYXRpb25SZXF1ZXN0LlxuICogUmV0dXJucyBudWxsIHdoZW4gcmF3IGhhcyBubyBgZHJ1Z19uYW1lYCAoY2FsbGVyIGZpbHRlcnMgb3V0KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25SZXF1ZXN0KFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkcnVnTmFtZSA9ICgocmF3LmRydWdfbmFtZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKCFkcnVnTmFtZSkgcmV0dXJuIG51bGw7XG5cbiAgLy8gQ2Fub25pY2FsIGtleSAobm90IHJhdyBkcnVnX25hbWUpIGZvciBzdGFibGUgaWQgc28gdGhlIHRocmVlIE5ISVxuICAvLyBcdTRFMkRcdTgyRjEgdmFyaWFudHMgb2YgdGhlIHNhbWUgZHJ1ZyBjb2xsYXBzZSB0byBvbmUgRkhJUiByZXNvdXJjZS5cbiAgY29uc3QgbWVkSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNhbm9uaWNhbERydWdLZXkoZHJ1Z05hbWUpLCByYXcuZGF0ZSA/PyBcIlwiKTtcblxuICBjb25zdCBkcnVnQ29kZSA9ICgocmF3LmNvZGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGNvZGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBzeXN0ZW06IGRydWdDb2RlID8gc3lzdGVtcy5OSElfRFJVR19DT0RFIDogc3lzdGVtcy5ISVNfTE9DQUxfTUVESUNBVElPTl9DT0RFLFxuICAgIGNvZGU6IGRydWdDb2RlIHx8IGRydWdOYW1lLFxuICAgIGRpc3BsYXk6IGRydWdOYW1lLFxuICB9O1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJNZWRpY2F0aW9uUmVxdWVzdFwiLFxuICAgIGlkOiBtZWRJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBtZWRTdGF0dXMocmF3LmRhdGUgPz8gXCJcIiwgcmF3LmR1cmF0aW9uX2RheXMpLFxuICAgIGludGVudDogXCJvcmRlclwiLFxuICAgIG1lZGljYXRpb25Db2RlYWJsZUNvbmNlcHQ6IHtcbiAgICAgIGNvZGluZzogW2NvZGluZ10sXG4gICAgICB0ZXh0OiBkcnVnTmFtZSxcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuYXV0aG9yZWRPbiA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBjb25zdCBkcnVnQ2xhc3MgPSAoKHJhdy5kcnVnX2NsYXNzID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoZHJ1Z0NsYXNzKSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbeyB0ZXh0OiBkcnVnQ2xhc3MgfV07XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5yZXF1ZXN0ZXIgPSB7IGRpc3BsYXk6IGhvc3BpdGFsIH07XG4gIH1cblxuICAvLyBEb3NhZ2UgXHUyMDE0IG9ubHkgd2hlbiBzb3VyY2UgYWN0dWFsbHkgaGFzIGl0LiBOSEkncyBtZWRpY2F0aW9uLWxpc3RcbiAgLy8gZW5kcG9pbnQgcHJvdmlkZXMgbm9uZSBvZiB0aGVzZTsgb3RoZXIgSElTIGFkYXB0ZXJzIGdldCBhXG4gIC8vIHN0cnVjdHVyZWQgZG9zYWdlIG91dC5cbiAgY29uc3QgZG9zYWdlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGsgb2YgW1wiZG9zZVwiLCBcInVuaXRcIiwgXCJmcmVxdWVuY3lcIl0gYXMgY29uc3QpIHtcbiAgICBpZiAocmF3W2tdKSBwYXJ0cy5wdXNoKFN0cmluZyhyYXdba10pKTtcbiAgfVxuICBpZiAocGFydHMubGVuZ3RoID4gMCkge1xuICAgIGRvc2FnZS50ZXh0ID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cbiAgaWYgKHJhdy5yb3V0ZSkge1xuICAgIGRvc2FnZS5yb3V0ZSA9IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9zbm9tZWQuaW5mby9zY3RcIiwgZGlzcGxheTogcmF3LnJvdXRlIH1dLFxuICAgIH07XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKGRvc2FnZSkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRvc2FnZUluc3RydWN0aW9uID0gW2Rvc2FnZV07XG4gIH1cblxuICAvLyBkaXNwZW5zZVJlcXVlc3Qgd2l0aCBxdWFudGl0eSArIHN1cHBseSBkdXJhdGlvbiB3aGVuIHByZXNlbnQuXG4gIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHF0eVJhdyA9IHJhdy5xdWFudGl0eTtcbiAgaWYgKHF0eVJhdyAhPT0gbnVsbCAmJiBxdHlSYXcgIT09IHVuZGVmaW5lZCAmJiBxdHlSYXcgIT09IFwiXCIpIHtcbiAgICBjb25zdCBxdHlOdW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcocXR5UmF3KS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHF0eU51bSkpIHtcbiAgICAgIGRyLnF1YW50aXR5ID0geyB2YWx1ZTogcXR5TnVtIH07XG4gICAgfVxuICB9XG4gIGlmIChyYXcuZHVyYXRpb25fZGF5cykge1xuICAgIGNvbnN0IGRheXMgPSBOdW1iZXIucGFyc2VJbnQoU3RyaW5nKHJhdy5kdXJhdGlvbl9kYXlzKSwgMTApO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoZGF5cykpIHtcbiAgICAgIGRyLmV4cGVjdGVkU3VwcGx5RHVyYXRpb24gPSB7XG4gICAgICAgIHZhbHVlOiBkYXlzLFxuICAgICAgICB1bml0OiBcImRheXNcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogXCJkXCIsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoT2JqZWN0LmtleXMoZHIpLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5kaXNwZW5zZVJlcXVlc3QgPSBkcjtcbiAgfVxuXG4gIGNvbnN0IGluZGljYXRpb24gPSAoKHJhdy5pbmRpY2F0aW9uID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCBpbmRpY2F0aW9uQ29kZSA9ICgocmF3LmluZGljYXRpb25fY29kZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGluZGljYXRpb24gfHwgaW5kaWNhdGlvbkNvZGUpIHtcbiAgICBjb25zdCByYzogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChpbmRpY2F0aW9uQ29kZSkge1xuICAgICAgcmMuY29kaW5nID0gW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBzeXN0ZW1zLklDRF8xMF9DTSxcbiAgICAgICAgICBjb2RlOiBub3JtYWxpemVJY2QxMENtKGluZGljYXRpb25Db2RlKSxcbiAgICAgICAgICBkaXNwbGF5OiBpbmRpY2F0aW9uIHx8IGluZGljYXRpb25Db2RlLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG4gICAgaWYgKGluZGljYXRpb24pIHtcbiAgICAgIHJjLnRleHQgPSBpbmRpY2F0aW9uQ29kZSA/IGAke2luZGljYXRpb25Db2RlfSAke2luZGljYXRpb259YC50cmltKCkgOiBpbmRpY2F0aW9uO1xuICAgIH1cbiAgICByZXNvdXJjZS5yZWFzb25Db2RlID0gW3JjXTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLyoqXG4gKiBHcm91cC1hd2FyZSBtZWRpY2F0aW9uIG1hcHBlciB0aGF0IGRlZHVwZXMgXHU0RTJEXHU4MkYxIFx1OTZEOVx1OEE5RSBkdXBsaWNhdGVzLlxuICpcbiAqIFN0cmF0ZWd5OlxuICogICAxLiBDb21wdXRlIGNhbm9uaWNhbCBrZXkgcGVyIGRydWcgbmFtZSAobG9uZ2VzdCBFbmdsaXNoIGNodW5rKS5cbiAqICAgMi4gR3JvdXAgYnkgKGRhdGUsIGNhbm9uaWNhbF9rZXkpLiBLZWVwIE9ORSBlbnRyeSBwZXIgZ3JvdXAsXG4gKiAgICAgIHByZWZlcnJpbmcgdGhlIGZvcm0gd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBicmFuZFxuICogICAgICBuYW1lIFx1MjAxNCBjbGluaWNpYW5zIHNjYW4gRW5nbGlzaCBmaXJzdCkuXG4gKiAgIDMuIE1hcCBlYWNoIGtlcHQgZW50cnkgdGhyb3VnaCBtYXBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqXG4gKiBOb3RlOiBQeXRob24gY29tbWVudCBzYXlzIFwibW9yZSBDSktcIiBidXQgdGhlIGNvZGUgdXNlcyBgPGAgKGZld2VyKTtcbiAqIHdlIHByZXNlcnZlIHRoZSBhY3R1YWwgY29kZSBiZWhhdmlvdXIgdG8ga2VlcCBwYXJpdHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBNZWRpY2F0aW9uc0RlZHVwKHJhd0l0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+PigpO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgcmF3SXRlbXMpIHtcbiAgICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRydWdOYW1lID0gKChpdGVtLmRydWdfbmFtZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgICBpZiAoIWRydWdOYW1lKSBjb250aW51ZTtcbiAgICBjb25zdCBkYXRlUGFydCA9ICgoaXRlbS5kYXRlID8/IFwiXCIpIGFzIHN0cmluZykuc2xpY2UoMCwgMTApO1xuICAgIGNvbnN0IGtleSA9IGAke2RhdGVQYXJ0fXwke2Nhbm9uaWNhbERydWdLZXkoZHJ1Z05hbWUpfWA7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBieUtleS5nZXQoa2V5KTtcbiAgICBpZiAoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFByZWZlciB0aGUgZm9ybSB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGJyYW5kIG5hbWUpLlxuICAgICAgaWYgKGNqa0NoYXJzKGRydWdOYW1lKSA8IGNqa0NoYXJzKGV4aXN0aW5nLmRydWdfbmFtZSA/PyBcIlwiKSkge1xuICAgICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgYnlLZXkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBtID0gbWFwTWVkaWNhdGlvblJlcXVlc3QoaXRlbSwgcGF0aWVudElkKTtcbiAgICBpZiAobSAhPT0gbnVsbCkgb3V0LnB1c2gobSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsICIvKipcbiAqIExPSU5DIG1hcHBpbmcgdGFibGVzIGZvciBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBMT0lOQyBSNCBjb2RpbmdzLlxuICpcbiAqIFB1cmUgZGF0YSwgbm8gbG9naWMuIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9fbG9pbmNfdGFibGVzLnB5YC5cbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDAgX05ISV9UT19MT0lOQyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIHByaW1hcnkgTE9JTkMgbWFwcGluZy4gU291cmNlIG9mIHRydXRoOlxuLy8gVFdOSElGSElSIFBBUyBJbXBsZW1lbnRhdGlvbiBHdWlkZSBDb25jZXB0TWFwLW5oaS1sb2luY1xuLy8gaHR0cHM6Ly9idWlsZC5maGlyLm9yZy9pZy9UV05ISUZISVIvcGFzL0NvbmNlcHRNYXAtbmhpLWxvaW5jLmh0bWxcbi8vXG4vLyBUaGF0IENvbmNlcHRNYXAgZGVjbGFyZXMgNTMgTkhJIGNvZGVzIHdpdGggYGVxdWl2YWxlbmNlOiByZWxhdGVkdG9gXG4vLyBhZ2FpbnN0IDgwNiBMT0lOQyB2YXJpYW50cyAoZGlmZmVyZW50IHNwZWNpbWVucyAvIHVuaXRzIC8gbWV0aG9kc1xuLy8gcGVyIE5ISSBjb2RlIFx1MjAxNCBjb25maXJtaW5nIHRoZSBcIk5ISSBpcyBjb2Fyc2UsIExPSU5DIGlzIGZpbmVcIiB2aWV3KS5cbi8vIEZvciBlYWNoIE5ISSBjb2RlIHdlIGhhbmQtcGljayB0aGUgY2Fub25pY2FsIExPSU5DIG1vc3QgY2xpbmljaWFuc1xuLy8gd291bGQgZXhwZWN0IGluIGEgXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBIGxhYiByZXBvcnQ6IFNlcnVtL1BsYXNtYSArIE1hc3Mtdm9sdW1lXG4vLyAob3IgYXV0by1jb3VudCBmb3IgY2VsbCBjb3VudGVycykuIEVkZ2UgY2FzZXMgbm90ZWQgaW5saW5lLlxuZXhwb3J0IGNvbnN0IE5ISV9UT19MT0lOQzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIEhhZW1hdG9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA4MDAyQ1wiOiBcIjY2OTAtMlwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1NzggXHUyMDE0IExldWtvY3l0ZXMgIy92b2wgQmxvb2QgQXV0b1xuICBcIjA4MDAzQ1wiOiBcIjcxOC03XCIsIC8vIFx1ODg0MFx1ODI3Mlx1N0QyMFx1NkFBMlx1NjdFNSBcdTIwMTQgSGVtb2dsb2JpbiBNYXNzL3ZvbCBCbG9vZFxuICBcIjA4MDA2Q1wiOiBcIjc3Ny0zXCIsIC8vIFx1ODg0MFx1NUMwRlx1Njc3Rlx1OEEwOFx1NjU3OCBcdTIwMTQgUGxhdGVsZXRzICMvdm9sIEJsb29kIEF1dG9cbiAgXCIwODAxM0NcIjogXCI1NzAyMS04XCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1NTIwNlx1OTg1RVx1OEEwOFx1NjU3OCBcdTIwMTQgQ0JDIFcgQXV0byBEaWZmIHBhbmVsXG4gIFwiMDgxMjhCXCI6IFwiNDcyODYtMFwiLCAvLyBcdTlBQThcdTlBRDNcdTdEMzBcdTgwREVcdTVGNjJcdTYxNEJcdTUyMjRcdThCODBcdTU0MDhcdTRGNzVcdTdEMzBcdTgwREVcdTUyMDZcdTk4NUVcdThBMDhcdTY1NzhcbiAgLy8gXHUyNTAwXHUyNTAwIENoZW1pc3RyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAxMUNcIjogXCIxNzg2MS02XCIsIC8vIFx1OTIyMyBcdTIwMTQgQ2FsY2l1bSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxNUNcIjogXCIyMTYwLTBcIiwgLy8gXHU4MDhDXHU5MTc4XHU5MTUwXHUzMDAxXHU4ODQwIFx1MjAxNCBDcmVhdGluaW5lIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDE2Q1wiOiBcIjIxNjEtOFwiLCAvLyBcdTgwOENcdTkxNTBcdTMwMDFcdTVDM0YgXHUyMDE0IENyZWF0aW5pbmUgTWFzcy92b2wgVXJpbmVcbiAgXCIwOTAyNUNcIjogXCIxOTIwLThcIiwgLy8gQVNUL0dPVCBcdTIwMTQgQXNwYXJ0YXRlIGFtaW5vdHJhbnNmZXJhc2UgQWN0IFMvUFxuICBcIjA5MDI2Q1wiOiBcIjE3NDItNlwiLCAvLyBBTFQvR1BUIFx1MjAxNCBBbGFuaW5lIGFtaW5vdHJhbnNmZXJhc2UgQWN0IFMvUFxuICBcIjA5MDI5Q1wiOiBcIjE5NzUtMlwiLCAvLyBcdTgxQkRcdTdEMDVcdTdEMjBcdTdFM0RcdTkxQ0YgXHUyMDE0IEJpbGlydWJpbiB0b3RhbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzMENcIjogXCIxOTY4LTdcIiwgLy8gXHU3NkY0XHU2M0E1XHU4MUJEXHU3RDA1XHU3RDIwIFx1MjAxNCBCaWxpcnViaW4gZGlyZWN0IE1hc3Mvdm9sIFMvUFxuICBcIjA5MDMzQ1wiOiBcIjI1MzItMFwiLCAvLyBcdTRFNzNcdTkxNzhcdTgxMkJcdTZDMkJcdTgxMjIgXHUyMDE0IExESCBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzOENcIjogXCIxNzUxLTdcIiwgLy8gXHU3NjdEXHU4NkNCXHU3NjdEIFx1MjAxNCBBbGJ1bWluIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTM4Q1wiOiBcIjM1NjcyLTVcIiwgLy8gXHU3NkY0XHU2M0E1L1x1N0UzRFx1ODFCRFx1N0QwNVx1N0QyMFx1NkJENFx1NTAzQ1xuICBcIjEyMTEyQlwiOiBcIjE3NTEtN1wiLCAvLyBcdTc2N0RcdTg2Q0JcdTc2N0QoXHU1MTREXHU3NUFCXHU2QkQ0XHU2RkMxXHU2Q0Q1KSBcdTIwMTQgQWxidW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIyNDAwN0JcIjogXCIxOTk1LTBcIiwgLy8gXHU4ODQwXHU2RjNGXHU2RTM4XHU5NkUyXHU5MjIzIFx1MjAxNCBDYWxjaXVtIGlvbml6ZWQgTW9sZXMvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgSG9ybW9uZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkxMjFDXCI6IFwiMjk4Ni04XCIsIC8vIFx1Nzc2QVx1NEUzOFx1OTE2Rlx1OTE4N1x1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgVGVzdG9zdGVyb25lIE1hc3Mvdm9sIFMvUFxuICBcIjI3MDIxQlwiOiBcIjI5OTEtOFwiLCAvLyBcdTc3NkFcdTRFMzhcdTgxMDJcdTkxODdcdTY1M0VcdTVDMDRcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IFRlc3Rvc3Rlcm9uZSBGcmVlIFMvUFxuICAvLyAwOTEyNUMgLyAwOTEyN0MgY29ycmVjdGVkIGFmdGVyIGR1YWwtcmV2aWV3ZXIgYXVkaXQgXHUyMDE0IHRoZSBlYXJsaWVyXG4gIC8vIHZhbHVlcyAoMzAxNi0zIHdhcyBUU0gsIDEwNTAxLTUgd2FzIExIKSB3ZXJlIGp1c3Qgd3JvbmcgY29weS1cbiAgLy8gcGFzdGVzLiBTb3VyY2UgZm9yIHRoZSBuZXcgdmFsdWVzOiBUV05ISUZISVIgUEFTIENvbmNlcHRNYXAuXG4gIFwiMDkxMjVDXCI6IFwiODMwOTgtNFwiLCAvLyBcdTZGRkVcdTZDRTFcdTUyM0FcdTZGQzBcdTdEMjBcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IEZvbGxpdHJvcGluIChGU0gpIEltbXVub2Fzc2F5IFMvUFxuICBcIjA5MTI3Q1wiOiBcIjgzMDk2LThcIiwgLy8gXHU0RThDXHU2QzJCXHU1N0ZBXHU2NjI1XHU2MEM1XHU3RDIwXHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBFc3RyYWRpb2wgSW1tdW5vYXNzYXkgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBUdW1vciBtYXJrZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMDA3Q1wiOiBcIjE4MzQtMVwiLCAvLyBcdTAzQjEtXHU4MENFXHU1MTUyXHU4NkNCXHU3NjdEIChBRlApIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIyNzA0OUNcIjogXCIxODM0LTFcIiwgLy8gXHU3NTMyLVx1ODBDRVx1NTE1Mlx1ODZDQlx1NzY3RCAoQUZQLCBSSUEpXG4gIFwiMTIwODFDXCI6IFwiODMxMTItM1wiLCAvLyBQU0EgKEVJQS9MSUEpIFx1MjAxNCBNYXNzL3ZvbCBTL1AgSW1tdW5vYXNzYXlcbiAgXCIxMjE5OENcIjogXCI4MzExMy0xXCIsIC8vIEZyZWUgUFNBIFx1MjAxNCBNYXNzL3ZvbCBTL1AgSW1tdW5vYXNzYXlcbiAgXCIyNzA1MkNcIjogXCIyODU3LTFcIiwgLy8gXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGIChQU0EpIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIyNzA4M0JcIjogXCIxMDg4Ni0wXCIsIC8vIFx1NkUzOFx1OTZFMlBTQSAoUklBKVxuICAvLyAxMjA1MkIgXHUwM0IyMi1cdTVGQUVcdTc0MDNcdTg2Q0JcdTc2N0QgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIDEwODczLTggd2hpY2ggaXMgYWN0dWFsbHlcbiAgLy8gJ0JldGEtMi1NaWNyb2dsb2J1bGluIFtNYXNzL3RpbWVdIGluIDI0IGhvdXIgVXJpbmUnICh0aW1lZCB1cmluZVxuICAvLyBjb2xsZWN0aW9uLCB2ZXJpZmllZCBsb2luYy5vcmcvMTA4NzMtOC8pLiBUYWl3YW4gMTIwNTJCIGJpbGxpbmcgaXNcbiAgLy8gdHlwaWNhbGx5IGEgc2VydW0gb3JkZXI7IDE5NTItMSBpcyB0aGUgdmVyaWZpZWQgc2VydW0tb3ItcGxhc21hIExPSU5DXG4gIC8vIChDb21wb25lbnQ9QmV0YS0yLU1pY3JvZ2xvYnVsaW4sIFByb3BlcnR5PU1DbmMpIFx1MjAxNCBsb2luYy5vcmcvMTk1Mi0xLy5cbiAgXCIxMjA1MkJcIjogXCIxOTUyLTFcIiwgLy8gXHUwM0IyMi1taWNyb2dsb2J1bGluIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEltbXVub2xvZ3kgLyBwcm90ZWlucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTA2NUJcIjogXCI5MDk5MS0xXCIsIC8vIFx1ODZDQlx1NzY3RFx1OTZGQlx1NkNGM1x1NTIwNlx1Njc5MFxuICAvLyAxMjAyOEIgLyAxMjAyOUIgSWdNIChzZXJ1bSwgaW1tdW5vZGlmZnVzaW9uIC8gbmVwaGVsb21ldHJ5KSBcdTIwMTQgcHJldmlvdXNseVxuICAvLyBib3RoIG1hcHBlZCB0byBMT0lOQyAxNDAwMi0wIHdoaWNoIGlzIGFjdHVhbGx5ICdJZ00gW1VuaXRzL3ZvbHVtZV0gaW5cbiAgLy8gQ29yZCBibG9vZCcgKG5lb25hdGFsIHNwZWNpbWVuLCB2ZXJpZmllZCBsb2luYy5vcmcvMTQwMDItMC8pLiBXcm9uZ1xuICAvLyBzcGVjaW1lbiBmb3IgYW4gYWR1bHQgc2VydW0gb3JkZXIuIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzIHRocm91Z2ggdG9cbiAgLy8gTkhJLWNvZGUtb25seSBjb2RpbmcuIFNlZSBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWQuXG4gIFwiMTIxMDNCXCI6IFwiOTU4MDEtN1wiLCAvLyBcdTUxNERcdTc1QUJcdTk2RkJcdTZDRjNcdTUyMDZcdTY3OTBcbiAgXCIxMjE2MEJcIjogXCIxNTE4OS00XCIsIC8vIElnRyBcdTAzQkEvXHUwM0JCXG4gIFwiMTIxNzFCXCI6IFwiMTczNTEtOFwiLCAvLyBcdTYyOTdcdTU1RENcdTRFMkRcdTYwMjdcdTc0MDNcdTdEMzBcdTgwREVcdThDRUFcdTYyOTdcdTlBRDQgKEFOQ0EpXG4gIFwiMTIyMDRCXCI6IFwiMjA1ODQtOVwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdTg4NjhcdTk3NjJcdTZBMTlcdThBMThcbiAgXCIyNTAxM0JcIjogXCI0NDU5Ni01XCIsIC8vIFx1ODdBMlx1NTE0OVx1NTIwN1x1NzI0N1x1NkFBMlx1NjdFNVxuICAvLyBcdTI1MDBcdTI1MDAgSGVwYXRpdGlzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE0MDMwQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMxQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMyQ1wiOiBcIjUxOTYtMVwiLCAvLyBIQnNBZyAoTWFzcy92b2wpXG4gIFwiMTQwNTFDXCI6IFwiMTM5NTUtMFwiLCAvLyBIQ1YgQWJcbiAgXCIyNzAzM0NcIjogXCI1MTk3LTlcIiwgLy8gSEJzQWcgUklBXG4gIC8vIFx1MjUwMFx1MjUwMCBQYXRob2xvZ3kgLyBjeXRvbG9neSAvIElIQyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjE5NUJcIjogXCIxODQ3NC03XCIsIC8vIEhlci0yL25ldSBJU0hcbiAgXCIyNzA2MUJcIjogXCIxNDEzMC05XCIsIC8vIFx1NTJENVx1NjBDNVx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoRVIpXG4gIFwiMjcwNjJCXCI6IFwiMTA4NjEtM1wiLCAvLyBcdTlFQzNcdTlBRDRcdTZGQzBcdTdEMjBcdTYzQTVcdTUzRDdcdTlBRDQgKFBSKVxuICBcIjMwMTAzQlwiOiBcIjgzMDUyLTFcIiwgLy8gUEQtTDEgSUhDXG4gIC8vIFx1MjUwMFx1MjUwMCBBdWRpb2xvZ3kgLyBwdWxtb25hcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTcwMDlCXCI6IFwiMjQzNDEtMFwiLCAvLyBcdTRFMDBcdTZDMjdcdTUzMTZcdTc4QjNcdTgwQkFcdTcwMzBcdTY1NjNcdTkxQ0ZcbiAgXCIyMjAwMUNcIjogXCI0NTQ5OC0zXCIsIC8vIFx1N0QxNFx1OTdGM1x1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICBcIjIyMDE1QlwiOiBcIjQ1NDk4LTNcIiwgLy8gXHU4QTUwXHU4MDdFXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMjVCXCI6IFwiNDY1MzAtMlwiLCAvLyBcdTgxRUFcdThBMThcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFNVUFBMRU1FTlRBTCAobm90IGluIFBBUyBDb25jZXB0TWFwIFx1MjAxNCBoYW5kLWN1cmF0ZWQgZnJvbSBjb21tb25cbiAgLy8gTkhJIGNvZGVzIHNlZW4gaW4gXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBLiBMT0lOQyB2ZXJpZmllZCBhZ2FpbnN0IGxvaW5jLm9yZ1xuICAvLyBjYW5vbmljYWwgbmFtZXMuIE1ldGhvZC1zcGVjaWZpYyBjb2RlcyAoZS5nLiBocy1DUlApIHBpY2sgdGhlXG4gIC8vIHNwZWNpZmljIExPSU5DOyBnZW5lcmFsLW1ldGhvZCBjb2RlcyBwaWNrIHRoZSBtb3N0IGNvbW1vbiBmb3JtLlxuICAvLyBJZiBcdTUwNjVcdTRGRERcdTdGNzIgcHVibGlzaGVzIGFuIGF1dGhvcml0YXRpdmUgYnJvYWRlciBDb25jZXB0TWFwIGxhdGVyLFxuICAvLyByZXBsYWNlIHRoaXMgc2VjdGlvbiBpbiBvbmUgcGFzcy5cbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIC8gSGJBMWMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDVDXCI6IFwiMTU1OC02XCIsIC8vIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENiAoR2x1LUFDKSBcdTIwMTQgRmFzdGluZyBnbHVjb3NlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTQwQ1wiOiBcIjIzNDUtN1wiLCAvLyBcdTg4NDBcdTdDRDYtXHU5OTEwXHU1RjhDL1x1OTZBOFx1NkE1RiBcdTIwMTQgR2x1Y29zZSBNYXNzL3ZvbCBTL1AgKGdlbmVyYWwpXG4gIFwiMDkwMDZDXCI6IFwiNDU0OC00XCIsIC8vIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMCAoSGJBMWMpIFx1MjAxNCBIZW1vZ2xvYmluIEExYy9IZ2IudG90YWwgQmxvb2RcbiAgLy8gXHUyNTAwXHUyNTAwIFJlbmFsIC8gZWxlY3Ryb2x5dGVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDAyQ1wiOiBcIjMwOTQtMFwiLCAvLyBCVU4gXHUyMDE0IFVyZWEgbml0cm9nZW4gTWFzcy92b2wgUy9QXG4gIFwiMDkwMTNDXCI6IFwiMzA4NC0xXCIsIC8vIFVyaWMgQWNpZCBcdTIwMTQgVXJhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMjFDXCI6IFwiMjk1MS0yXCIsIC8vIE5hIFx1MjAxNCBTb2RpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDIyQ1wiOiBcIjI4MjMtM1wiLCAvLyBLICBcdTIwMTQgUG90YXNzaXVtIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAyNENcIjogXCIyMDI4LTlcIiwgLy8gQ08yIFx1MjAxNCBDYXJib24gZGlveGlkZSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMTJDXCI6IFwiMjc3Ny0xXCIsIC8vIElub3JnYW5pYyBQIFx1MjAxNCBQaG9zcGhhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDZCXCI6IFwiMTkxMjMtOVwiLCAvLyBNZyBcdTIwMTQgTWFnbmVzaXVtIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGlwaWQgcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDFDXCI6IFwiMjA5My0zXCIsIC8vIFQtQ2hvbGVzdGVyb2wgXHUyMDE0IENob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDA0Q1wiOiBcIjI1NzEtOFwiLCAvLyBURyBcdTIwMTQgVHJpZ2x5Y2VyaWRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQzQ1wiOiBcIjIwODUtOVwiLCAvLyBIREwgXHUyMDE0IEhETCBjaG9sZXN0ZXJvbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NENcIjogXCIxMzQ1Ny03XCIsIC8vIExETCBcdTIwMTQgTERMIGNob2xlc3Rlcm9sIChjYWxjdWxhdGVkKSBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIExpdmVyIGZ1bmN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDI3Q1wiOiBcIjY3NjgtNlwiLCAvLyBBTEstUCBcdTIwMTQgQWxrYWxpbmUgcGhvc3BoYXRhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzFDXCI6IFwiMjMyNC0yXCIsIC8vIFx1MDNCMy1HVCBcdTIwMTQgR2FtbWEgZ2x1dGFteWwgdHJhbnNmZXJhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzVDXCI6IFwiMjUwMC03XCIsIC8vIFRJQkMgXHUyMDE0IElyb24gYmluZGluZyBjYXBhY2l0eSBNYXNzL3ZvbCBTL1BcbiAgLy8gMDkwMzdDIFx1ODg0MFx1NkMyOCBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMTgyNy01IHdoaWNoIGlzIGFjdHVhbGx5XG4gIC8vICdBbHBoYSAxIGFudGl0cnlwc2luIE1TIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hJyAodmVyaWZpZWRcbiAgLy8gbG9pbmMub3JnLzE4MjctNS8pLiBXcm9uZyBhbmFseXRlIGVudGlyZWx5LiBMZWF2aW5nIHVubWFwcGVkOyBmYWxsc1xuICAvLyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLiBTZWUgZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kLlxuICBcIjA5MDY0Q1wiOiBcIjMwNDAtM1wiLCAvLyBMaXBhc2UgXHUyMDE0IEFjdGl2aXR5IFMvUFxuICBcIjA5MDU5QlwiOiBcIjE0MTE4LTRcIiwgLy8gTGFjdGF0ZSBcdTIwMTQgTWFzcy92b2wgUGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBIZW1hdG9sb2d5IGV4dHJhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwODAwNENcIjogXCI0NTQ0LTNcIiwgLy8gSENUIFx1MjAxNCBIZW1hdG9jcml0IHZvbHVtZSBmcmFjdGlvbiBCbG9vZFxuICBcIjA4MDA4Q1wiOiBcIjE0MTk2LTBcIiwgLy8gUmV0aWN1bG9jeXRlIFx1MjAxNCBSZXRpY3Vsb2N5dGVzLzEwMCBSQkNcbiAgXCIwODAxMENcIjogXCI3MTEtMlwiLCAvLyBFb3Npbm9waGlsIGNvdW50IFx1MjAxNCAjL3ZvbCBCbG9vZFxuICBcIjA4MDExQ1wiOiBcIjI0MzE3LTBcIiwgLy8gQ0JDIHBhbmVsIFx1MjAxNCBIZW1hdG9sb2d5IHBhbmVsIEJsb29kXG4gIFwiMDgwMjZDXCI6IFwiNjMwMS02XCIsIC8vIFBUL0lOUiBcdTIwMTQgSU5SIFBsYXRlbGV0IHBvb3IgcGxhc21hXG4gIFwiMDgwMzZDXCI6IFwiMTQ5NzktOVwiLCAvLyBBUFRUIFx1MjAxNCBQbGF0ZWxldCBwb29yIHBsYXNtYVxuICBcIjA4MDc1Q1wiOiBcIjI2OTItN1wiLCAvLyBPc21vbGFsaXR5IFx1MjAxNCBTZXJ1bSBvciBQbGFzbWFcbiAgXCIwODA3OUJcIjogXCIzMDI0MC02XCIsIC8vIEQtZGltZXIgXHUyMDE0IFBsdCBwb29yIHBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgVGh5cm9pZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gRnJlZSBUNCBoYXMgVFdPIHZhbGlkIExPSU5DcyB0aGF0IGRpZmZlciBvbmx5IGluIHVuaXQtc3lzdGVtOlxuICAvLyAgIDMwMjQtNyAgQ29tcG9uZW50PVRoeXJveGluZS5mcmVlLCBQcm9wZXJ0eT1NQ25jIChNYXNzIGNvbmMsIG5nL2RMKVxuICAvLyAgIDE0OTIwLTMgQ29tcG9uZW50PVRoeXJveGluZS5mcmVlLCBQcm9wZXJ0eT1TQ25jIChNb2xhciBjb25jLCBwbW9sL0wpXG4gIC8vIEJvdGggYXJlIEZyZWUgVDQgXHUyMDE0IG5laXRoZXIgaXMgVG90YWwgVDQuIEVhcmxpZXIgaGlzdG9yeTpcbiAgLy8gICAtIE9yaWdpbmFsIG1hcHBpbmcgd2FzIDMwMjQtNyAoY29ycmVjdDogbWF0Y2hlcyBUYWl3YW4gbmcvZEwgbGFicykuXG4gIC8vICAgLSBDb21taXQgOWRhNWU1YiBjaGFuZ2VkIGl0IHRvIDE0OTIwLTMgb24gdGhlIHByZW1pc2UgdGhhdCAzMDI0LTdcbiAgLy8gICAgIHdhcyBUb3RhbCBUNC4gVGhhdCBwcmVtaXNlIHdhcyBpbnZlcnRlZCAodmVyaWZpZWQgbG9pbmMub3JnLzMwMjQtNy9cbiAgLy8gICAgIFx1MjAxNCBDb21wb25lbnQgaXMgXCJUaHlyb3hpbmUuZnJlZVwiKTsgdGhlIGNoYW5nZSBpbnRyb2R1Y2VkIGEgTE9JTkNcdTIxOTR1bml0XG4gIC8vICAgICBtaXNtYXRjaCAobW9sYXIgTE9JTkMgcGFpcmVkIHdpdGggYSBuZy9kTCB2YWx1ZSkuXG4gIC8vICAgLSBSZXN0b3JpbmcgMzAyNC03IGhlcmUgc28gdGhlIExPSU5DJ3MgcHJvcGVydHkgY2xhc3MgKE1DbmMpIG1hdGNoZXNcbiAgLy8gICAgIHRoZSB1bml0IGZpZWxkIChuZy9kTCkgVGFpd2FuIGxhYnMgc2hpcC4gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZFxuICAvLyAgICAgc2VjdGlvbiBGIGZvciBmdWxsIGV2aWRlbmNlLlxuICBcIjA5MTA2Q1wiOiBcIjMwMjQtN1wiLCAvLyBGcmVlIFQ0IFx1MjAxNCBUaHlyb3hpbmUgKFQ0KSBmcmVlIFtNYXNzL3ZvbHVtZV0gUy9QXG4gIFwiMDkxMTJDXCI6IFwiMzAxNi0zXCIsICAvLyBUU0ggXHUyMDE0IFRoeXJvdHJvcGluIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZGlhYyBtYXJrZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDk5Q1wiOiBcIjEwODM5LTlcIiwgLy8gVHJvcG9uaW4gSSBcdTIwMTQgVHJvcG9uaW4gSSBjYXJkaWFjIFMvUFxuICBcIjEyMTkyQ1wiOiBcIjMzOTU5LThcIiwgLy8gUHJvY2FsY2l0b25pbiBcdTIwMTQgUy9QXG4gIFwiMTIxOTNDXCI6IFwiMzM3NjItNlwiLCAvLyBOVC1wcm9CTlAgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVml0YW1pbnMgLyBjb2ZhY3RvcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkxMjlDXCI6IFwiMjEzMi05XCIsIC8vIFZpdCBCMTIgXHUyMDE0IENvYmFsYW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTEzMENcIjogXCIyMjg0LThcIiwgLy8gRm9sYXRlIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTExM0NcIjogXCIyMTQzLTZcIiwgLy8gQ29ydGlzb2wgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMTE2Q1wiOiBcIjIyNzYtNFwiLCAvLyBGZXJyaXRpbiBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBBY3V0ZSBwaGFzZSAvIGluZmxhbW1hdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTIwMTVDIGlzIHRoZSBnZW5lcmljIE5ISSBDUlAgb3JkZXIgXHUyMDE0IG1vc3QgY2xpbmljYWwgY29udGV4dHMgaW4gXHU1MDY1XHU0RkREXG4gIC8vIHNlbmQgYSByZWd1bGFyIChub3QgaHMtKSBDUlAsIHNvIG1hcCB0byAxOTg4LTUuIElmIGEgXHU5NjYyXHU2MjQwIHNwZWNpZmljYWxseVxuICAvLyBiaWxscyBocy1DUlAgaXQgd2lsbCBsYW5kIG9uIGEgZGlmZmVyZW50IGNvZGUgKGUuZy4gMTIxODlDKS5cbiAgXCIxMjAxNUNcIjogXCIxOTg4LTVcIiwgLy8gQ1JQIFx1MjAxNCBDIHJlYWN0aXZlIHByb3RlaW4gTWFzcy92b2wgUy9QXG4gIFwiMTIwNTNDXCI6IFwiNTA0OC00XCIsIC8vIEFOQSBcdTIwMTQgQW50aW51Y2xlYXIgQWIgVGl0ZXIgUy9QXG4gIFwiMTIwNTZCXCI6IFwiMTYxMjQtMFwiLCAvLyBBbnRpLW1pdG9jaG9uZHJpYWwgQWIgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA2MDEyQ1wiOiBcIjU3NzgtNlwiLCAvLyBVcmluZSBhcHBlYXJhbmNlIFx1MjAxNCBDb2xvclxuICBcIjA2MDEzQ1wiOiBcIjI0MzU2LThcIiwgLy8gXHU1QzNGXHU3NTFGXHU1MzE2IHBhbmVsIFx1MjAxNCBVcmluYWx5c2lzIG1hY3Jvc2NvcGljIHBhbmVsXG4gIFwiMDcwMDFDXCI6IFwiMTQ1NjMtMVwiLCAvLyBTdG9vbCBvY2N1bHQgYmxvb2RcbiAgXCIwOTEzNENcIjogXCI1ODQ1My0yXCIsIC8vIGlGT0JUIHF1YW50aXRhdGl2ZSBcdTIwMTQgSGVtb2dsb2JpbiBNYXNzL3ZvbCBTdG9vbCBieSBJQVxuICBcIjEyMTExQ1wiOiBcIjIxNjEtOFwiLCAvLyBVcmluZSBDcmVhdGluaW5lIFx1MjAxNCBzYW1lIExPSU5DIGFzIDA5MDE2Q1xuICAvLyBcdTI1MDBcdTI1MDAgU2Vyb2xvZ3kgLyBpbW11bm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMDAxQ1wiOiBcIjUyOTItOFwiLCAvLyBSUFIgXHUyMDE0IFNlcnVtL1BsYXNtYVxuICBcIjEyMDIxQ1wiOiBcIjIwMzktNlwiLCAvLyBDRUEgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDI1QlwiOiBcIjI0NjUtM1wiLCAvLyBJZ0cgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDI3QlwiOiBcIjI0NTgtOFwiLCAvLyBJZ0EgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDMxQ1wiOiBcIjE5MTEzLTBcIiwgLy8gSWdFIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gMTIwNjlCIENyeXB0b2NvY2N1cyBBZyBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgNTEzMi02IHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdETkEgc2luZ2xlIHN0cmFuZCBBYiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bScgKGFudGktc3NETkEsXG4gIC8vIGx1cHVzIHNlcm9sb2d5IFx1MjAxNCB2ZXJpZmllZCBsb2luYy5vcmcvNTEzMi02LykuIENvbXBsZXRlbHkgd3JvbmdcbiAgLy8gYW5hbHl0ZS4gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy5cbiAgLy8gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxMjA3OUNcIjogXCIyNDEwOC0zXCIsIC8vIENBIDE5LTkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQmxvb2QgdHlwZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMTAwMUNcIjogXCI4ODItMVwiLCAvLyBcdTg4NDBcdTU3OEJcdTk0NTFcdTVCOUEgXHUyMDE0IEFCTyArIFJoIGdyb3VwXG4gIFwiMTEwMDNDXCI6IFwiODgyLTFcIiwgLy8gXHU4ODQwXHU1NzhCXHU5NDUxXHU1QjlBIFx1MjAxNCBBQk8gKyBSaCBncm91cFxuICBcIjExMDA0Q1wiOiBcIjg5MC00XCIsIC8vIFx1NjI5N1x1OUFENFx1NTNDRFx1NjFDOSBcdTIwMTQgQW50aWJvZHkgc2NyZWVuXG4gIC8vIFx1MjUwMFx1MjUwMCBNaWNyb2Jpb2xvZ3kgY3VsdHVyZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEzMDA3QyBcdTdEMzBcdTgzQ0NcdTU3RjlcdTk5MEEgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDE0MjE5LTAgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0hUTFYgSSBwMjYgQWIgaW4gU2VydW0nICh2ZXJpZmllZCBhdCBsb2luYy5vcmcpLiBUaGVcbiAgLy8gcmlnaHQgZmFtaWx5IGlzIDY0NjMtNCAvIDExMjY4LTAgKEJhY3RlcmlhIGlkZW50aWZpZWQgYnkgYWVyb2JlXG4gIC8vIGN1bHR1cmUpIGJ1dCB0aGUgc291cmNlIHJvdyBkb2Vzbid0IHRlbGwgdXMgc3BlY2ltZW4gXHUyMDE0IGxlYXZpbmdcbiAgLy8gdW5tYXBwZWQgc28gd2UgZG9uJ3QgbGllLiBGYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLlxuICAvLyAxMzAxM0MgVEIgQ3VsdHVyZSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMzE5NTItNSB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnUmluZGVycGVzdCB2aXJ1cyBBZyBbUHJlc2VuY2VdIGluIEV4dWRhdGUnIChjYXR0bGVcbiAgLy8gbW9yYmlsbGl2aXJ1cywgdmVyaWZpZWQgbG9pbmMub3JnLzMxOTUyLTUvKS4gV3Jvbmcgb3JnYW5pc20gZW50aXJlbHkuXG4gIC8vIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuIFNlZVxuICAvLyBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWQuXG4gIFwiMTMwMTZCXCI6IFwiNjAwLTdcIiwgLy8gQmxvb2QgQ3VsdHVyZSBcdTIwMTQgQmFjdGVyaWEgaWRlbnRpZmllZCBpbiBCbG9vZFxuICAvLyBcdTI1MDBcdTI1MDAgVmlyb2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDE0MDA0QiBDTVYgSWdHIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyA3ODQ5LTMgd2hpY2ggaXMgYWN0dWFsbHlcbiAgLy8gJ1RhZW5pYSBzb2xpdW0gbGFydmEgSWdNIEFiIFtQcmVzZW5jZV0gaW4gU2VydW0nIChwb3JrIHRhcGV3b3JtLFxuICAvLyB2ZXJpZmllZCBsb2luYy5vcmcvNzg0OS0zLykuIE5vIHZlcmlmaWVkIGNhbm9uaWNhbCByZXBsYWNlbWVudCBmb3VuZFxuICAvLyBpbiB0aGlzIHBhc3MgKGNhbmRpZGF0ZXMgNTEyNi04IC8gNTEyNS0wIGFyZSBJZ00gb3IgbWV0aG9kLXNwZWNpZmljLFxuICAvLyAyMjU5Mi05IC8gMjI1OTEtMSAvIDE2MTI1LTUgcmV0dXJuZWQgSFRUUCA1MDAgb24gZXZlcnkgcmV0cnkpLlxuICAvLyBMZWF2aW5nIHVubWFwcGVkOyBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLlxuICBcIjE0MDQ4QlwiOiBcIjc4NTMtNVwiLCAvLyBDTVYgSWdNIFx1MjAxNCBDeXRvbWVnYWxvdmlydXMgSWdNIEFiIFtVbml0cy92b2x1bWVdIFMvUFxuICAvLyAgIHJlc3RvcmVkIGFmdGVyIGF1ZGl0OiAxNDA0OEIgcHJldmlvdXNseSBtYXBwZWQgdG8gNzg1MC0xIHdoaWNoIGlzXG4gIC8vICAgJ1RhZW5pYSBzb2xpdW0gbGFydmEgQWInICh2ZXJpZmllZCBsb2luYy5vcmcvNzg1MC0xLykuIDc4NTMtNVxuICAvLyAgIHZlcmlmaWVkIGFzIHRoZSBjYW5vbmljYWwgQ01WIElnTSBMT0lOQyAoQ29tcG9uZW50PUN5dG9tZWdhbG92aXJ1c1xuICAvLyAgIEFiLklnTSwgUHJvcGVydHk9QUNuYykgXHUyMDE0IGxvaW5jLm9yZy83ODUzLTUvLlxuICBcIjE0MDY2Q1wiOiBcIjgwMzgzLTNcIiwgLy8gSW5mbHVlbnphIEEgXHUyMDE0IEFnIFJlc3BpcmF0b3J5XG4gIFwiMTQwODRDXCI6IFwiOTQ1NTgtNFwiLCAvLyBTQVJTLUNvVi0yIEFnIFx1MjAxNCBSZXNwaXJhdG9yeVxuICBcIjEyMTg0Q1wiOiBcIjg4MTU3LTNcIiwgLy8gQ01WIEROQSBxdWFudCBQQ1IgXHUyMDE0IFBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgTXljb2JhY3Rlcml1bSAvIGFjaWQtZmFzdCAoYWRkZWQgYWZ0ZXIgYXVkaXQpIFx1MjUwMFxuICBcIjEzMDI1Q1wiOiBcIjI5MjYwLTdcIiwgLy8gXHU2Mjk3XHU5MTc4XHU2MDI3XHU2RkMzXHU3RTJFXHU2MkI5XHU3MjQ3XHU2N0QzXHU4MjcyXHU2QUEyXHU2N0U1IFx1MjAxNCBNeWNvYmFjdGVyaXVtIEFGQiBzdGFpblxuICBcIjEzMDI2Q1wiOiBcIjI5NTUzLTVcIiwgLy8gXHU2Mjk3XHU5MTc4XHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBNeWNvYmFjdGVyaXVtIGN1bHR1cmUgbGlxdWlkK3NvbGlkXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgcGFuZWwgKDA5MDQxQikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEludGVudGlvbmFsbHkgTk9UIG1hcHBlZCBoZXJlIFx1MjAxNCAwOTA0MUIgaXMgYSBwYW5lbCBvcmRlciB0aGF0XG4gIC8vIHVuZm9sZHMgaW50byBtYW55IGl0ZW1zIChwSCAvIHBDTzIgLyBwTzIgLyBIQ08zIC8gVENPMiAvIFNCRSAvXG4gIC8vIEFCRSAvIFNCQyAvIFNBVCkuIE1hcHBpbmcgdGhlIHBhbmVsIGNvZGUgdG8gXCJwSFwiIHdvdWxkIG1pcy1sYWJlbFxuICAvLyBldmVyeSBub24tcEggcm93IHRoYXQgc2hhcmVzIHRoaXMgTkhJIGNvZGUuIEVhY2ggaXRlbSBpc1xuICAvLyByZXNvbHZlZCB2aWEgX0xPSU5DX01BUCBkaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgYmVsb3c7IDA5MDQxQlxuICAvLyBhbHNvIGFwcGVhcnMgaW4gX0RJU1BMQVlfRklSU1RfQ09ERVMgc28gZGlzcGxheSBhbHdheXMgd2lucy5cbiAgLy8gXHUyNTAwXHUyNTAwIEJvZHkgZmx1aWQgLyBzeW5vdmlhbCBmbHVpZCBwYW5lbCAoMTYwMDhDIHVuZm9sZHM7IHRoZVxuICAvLyBtZW1iZXIgaXRlbXMgcmVseSBvbiBkaXNwbGF5IGtleXdvcmRzIGZvciBzcGVjaW1lbi1hd2FyZVxuICAvLyBMT0lOQ3MpLiBQYXJlbnQgY29kZSBtYXBzIHRvIHN5bm92aWFsIGZsdWlkIGFuYWx5c2lzIHBhbmVsLiBcdTI1MDBcdTI1MDBcbiAgLy8gMTYwMDhDIFx1NkVEMVx1NkRCMlx1NkFBMlx1NjdFNSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMzM5MDMtNiB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnS2V0b25lcyBbUHJlc2VuY2VdIGluIFVyaW5lJyAodmVyaWZpZWQgbG9pbmMub3JnKS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgdGhlIHBhbmVsIGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGluZyBvbmx5XG4gIC8vIGFuZCB0aGUgcGVyLWl0ZW0gZGlzcGxheXMgaW4gX0xPSU5DX01BUCBjYXJyeSB0aGVpciBvd24gTE9JTkNzXG4gIC8vIHdoZXJlIGtub3duLlxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9ESVNQTEFZX0ZJUlNUX0NPREVTIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIGNvZGVzIHRoYXQgYXJlICpwYW5lbHMqIFx1MjAxNCBvbmUgYmlsbGluZyBjb2RlLCBtYW55IGl0ZW0tc3BlY2lmaWNcbi8vIGRpc3BsYXlzLiBGb3IgdGhlc2UsIGRpc3BsYXkga2V5d29yZCBNVVNUIGJlIHRyaWVkIGZpcnN0IChzbyBcIldCQ1wiXG4vLyB1bmRlciBDQkMgcGFuZWwgMDgwMTFDIGdldHMgNjY5MC0yLCBub3QgdGhlIGdlbmVyaWMgcGFuZWwgTE9JTkMpLlxuLy8gRm9yIGV2ZXJ5dGhpbmcgZWxzZSAoc2luZ2xlLXRlc3QgY29kZXMgbGlrZSAwOTAwNUMgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2LFxuLy8gMDkwNDRDIExETCwgMTQwMzBDIEhCc0FnKSwgdGhlIE5ISSBjb2RlIGlzIG1vcmUgc3BlY2lmaWMgdGhhbiBhbnlcbi8vIGRpc3BsYXkga2V5d29yZCBhbmQgd2lucyBvdXRyaWdodC5cbi8vXG4vLyBERVNJR04gUEhJTE9TT1BIWTogdGhlIGJyaWRnZSBpcyBhICpmYWl0aGZ1bCB0cmFuc3BvcnQqIGxheWVyIFx1MjAxNCBpdFxuLy8gdHJ1c3RzIHRoZSBcdTUwNjVcdTRGREQgYmlsbGluZyBjb2RlIGFzIGF1dGhvcml0YXRpdmUgZm9yIGNsaW5pY2FsIGludGVudFxuLy8gKFx1OTY2Mlx1NjI0MCBiaWxsZWQgMDkwMDVDID0gdGhleSBvcmRlcmVkIGZhc3RpbmcgZ2x1Y29zZSwgcmVnYXJkbGVzcyBvZlxuLy8gd2hldGhlciB0aGUgb3BlcmF0aW9uYWwgc3BlY2ltZW4gd2FzIGEgZmluZ2VyLXN0aWNrKS4gRGlzcGxheS1zdHJpbmdcbi8vIHJlLWludGVycHJldGF0aW9uIG9mIGNsaW5pY2FsIGNvbnRleHQgKEdsdS1BQyB2cyBGSU5HRVIgU1VHQVIgdnNcbi8vIHJhbmRvbSkgaXMgbGVmdCB0byB0aGUgU01BUlQgYXBwLCB3aGljaCBoYXMgbW9yZSBVSSBjb250ZXh0LlxuZXhwb3J0IGNvbnN0IERJU1BMQVlfRklSU1RfQ09ERVM6IFJlYWRvbmx5U2V0PHN0cmluZz4gPSBuZXcgU2V0KFtcbiAgXCIwODAxMUNcIiwgLy8gQ0JDIHBhbmVsXG4gIFwiMDgwMTNDXCIsIC8vIENCQyB3LyBhdXRvIGRpZmYgcGFuZWxcbiAgXCIwNjAxM0NcIiwgLy8gVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA5MDQxQlwiLCAvLyBBQkcgcGFuZWxcbiAgXCIxNjAwOENcIiwgLy8gU3lub3ZpYWwgLyBib2R5LWZsdWlkIHBhbmVsXG5dKTtcblxuLy8gXHUyNTAwXHUyNTAwIF9QQU5FTF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBQYW5lbC1zcGVjaWZpYyBkaXNwbGF5IFx1MjE5MiBMT0lOQyBvdmVycmlkZXMuIFRoZXNlIHJ1biBCRUZPUkUgdGhlIGdsb2JhbFxuLy8gX0xPSU5DX01BUCBzbyB0aGF0IHVyaW5lIGJpbGlydWJpbiB1bmRlciAwNjAxM0MgbWFwcyB0byA1NzcwLTMgKHVyaW5lXG4vLyBzcGVjaW1lbikgaW5zdGVhZCBvZiBiZWluZyBzaGFkb3dlZCBieSB0aGUgZ2xvYmFsICdiaWxpcnViaW4nIHRoYXRcbi8vIHdvdWxkIGltcGx5IHNlcnVtLCBhbmQgYW5hbG9nb3VzIHNwZWNpbWVuLWF3YXJlIGRpc2FtYmlndWF0aW9uIGZvclxuLy8gb3RoZXIgcGFuZWwgc3ViLWl0ZW1zLiBLZXlzIGFyZSBOSEkgcGFuZWwgY29kZXMgKG11c3QgYWxzbyBiZSBpblxuLy8gX0RJU1BMQVlfRklSU1RfQ09ERVMpOyB2YWx1ZXMgYXJlIGRpc3BsYXkta2V5d29yZCBcdTIxOTIgTE9JTkMgZGljdHMgdGhhdFxuLy8gZm9sbG93IHRoZSBzYW1lIG1hdGNoaW5nIHNlbWFudGljcyBhcyBfTE9JTkNfTUFQIChsZWFkaW5nIHdvcmRcbi8vIGJvdW5kYXJ5IGZvciBBU0NJSSwgc3Vic3RyaW5nIGZvciBDSkspLlxuZXhwb3J0IGNvbnN0IFBBTkVMX0xPSU5DX01BUDogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBBbGwgcm91dGluZSBkaXBzdGljayBpdGVtcyByZXNpZGUgb24gYSBzaW5nbGUgTkhJIGJpbGxpbmcgY29kZS5cbiAgLy8gV2l0aG91dCB0aGlzIHRhYmxlIHRoZXknZCBhbGwgY29sbGFwc2UgdG8gdGhlIHBhbmVsIExPSU5DIDI0MzU2LTgsXG4gIC8vIGxvc2luZyBwZXItaXRlbSBncmFudWxhcml0eSB0aGF0J3MgY2xpbmljYWxseSB1c2VmdWwgKGUuZy5cbiAgLy8gYmlsaXJ1YmluIHZzIHVyb2JpbGlub2dlbiBmb3IgbGl2ZXIgd29ya3VwKS5cbiAgXCIwNjAxM0NcIjoge1xuICAgIC8vIE9yZGVyIG1hdHRlcnM6IGxvbmdlci9tb3JlLXNwZWNpZmljIGtleXMgYmVmb3JlIGdlbmVyaWMgb25lc1xuICAgIC8vIChtYXRjaGVzIF9MT0lOQ19NQVAgaXRlcmF0aW9uIHNlbWFudGljcyBcdTIwMTQgZmlyc3QgaGl0IHdpbnMpLlxuICAgIFwic3BlY2lmaWMgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLCAvLyBTcGVjaWZpYyBncmF2aXR5IFVyaW5lXG4gICAgXCJzcC5ncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXCJzcCBncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXHU2QkQ0XHU5MUNEOiBcIjU4MTEtNVwiLFxuICAgIFwibWljcm8tYWxidW1pblwiOiBcIjE0OTU3LTVcIiwgLy8gTWljcm9hbGJ1bWluIE1hc3Mvdm9sIFVyaW5lXG4gICAgbWljcm9hbGJ1bWluOiBcIjE0OTU3LTVcIixcbiAgICBcIm1hbGIodSlcIjogXCIxNDk1Ny01XCIsXG4gICAgbWFsYjogXCIxNDk1Ny01XCIsXG4gICAgXHU1RkFFXHU1QzBGXHU3NjdEXHU4NkNCXHU3NjdEOiBcIjE0OTU3LTVcIixcbiAgICB1YWNyOiBcIjE0OTU5LTFcIiwgLy8gTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgcmF0aW8gVXJpbmVcbiAgICBcInVyaW5lIGdsdWNvc2VcIjogXCI1NzkyLTdcIixcbiAgICBzdWdhcjogXCI1NzkyLTdcIiwgLy8gTkhJICdcdTVDM0ZcdTdDRDYnIC8gJ1N1Z2FyJyB1bmRlciAwNjAxM0NcbiAgICBcdTVDM0ZcdTdDRDY6IFwiNTc5Mi03XCIsXG4gICAgdXJvYmlsaW5vZ2VuOiBcIjU4MTgtMFwiLCAvLyBVcm9iaWxpbm9nZW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMjBcdTUzOUY6IFwiNTgxOC0wXCIsXG4gICAgYmlsaXJ1YmluOiBcIjU3NzAtM1wiLCAvLyBCaWxpcnViaW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMDVcdTdEMjA6IFwiNTc3MC0zXCIsXG4gICAgbml0cml0ZTogXCI1ODAyLTRcIiwgLy8gTml0cml0ZSBVcmluZVxuICAgIFx1NEU5RVx1Nzg1RFx1OTE3ODogXCI1ODAyLTRcIixcbiAgICBrZXRvbmVzOiBcIjU3OTctNlwiLCAvLyBLZXRvbmVzIFVyaW5lXG4gICAga2V0b25lOiBcIjU3OTctNlwiLFxuICAgIFx1OTE2RVx1OUFENDogXCI1Nzk3LTZcIixcbiAgICBwcm90ZWluOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICAgIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgICBsZXVrb2N5dGU6IFwiNTc5OS0yXCIsIC8vIExldWtvY3l0ZXMgVXJpbmVcbiAgICBsZXU6IFwiNTc5OS0yXCIsXG4gICAgXHU3NjdEXHU4ODQwXHU3NDAzXHU5MTZGXHU5MTc2OiBcIjU3OTktMlwiLFxuICAgIGJsb29kOiBcIjU3OTQtM1wiLCAvLyBIZW1vZ2xvYmluIFVyaW5lIFFsXG4gICAgXHU2RjVCXHU4ODQwOiBcIjU3OTQtM1wiLFxuICAgIFx1ODI3MjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgVXJpbmUgKENKSyBzdWJzdHJpbmcpXG4gICAgY29sb3I6IFwiNTc3OC02XCIsXG4gICAgdHVyYmlkaXR5OiBcIjU3NjctOVwiLCAvLyBBcHBlYXJhbmNlIG9mIFVyaW5lXG4gICAgYXBwZWFyYW5jZTogXCI1NzY3LTlcIixcbiAgICBcdTU5MTZcdTg5QzA6IFwiNTc2Ny05XCIsXG4gICAgcGg6IFwiNTgwMy0yXCIsIC8vIHBIIG9mIFVyaW5lICh1cmluZS1zcGVjaWZpYywgTk9UXG4gICAgLy8gdGhlIGFydGVyaWFsIDExNTU4LTQgdGhhdCB0aGVcbiAgICAvLyBnbG9iYWwgbWFwIHBvaW50cyB0bylcbiAgICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiNTgwMy0yXCIsXG4gICAgZ2x1Y29zZTogXCI1NzkyLTdcIiwgLy8gTGFzdCBpbiB0aGlzIGJsb2NrIHNvICd1cmluZVxuICB9LFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDb21tb24gVGFpd2FuZXNlIEhJUyBsYWIgbmFtZXMgXHUyMTkyIExPSU5DIGNvZGUgbWFwcGluZ1xuZXhwb3J0IGNvbnN0IExPSU5DX01BUDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIERpc3BsYXkta2V5d29yZCBmYWxsYmFjayBvbmx5IGtpY2tzIGluIHdoZW4gTk8gTkhJIGNvZGUgaXNcbiAgLy8gcHJlc2VudCAoZGFzaGJvYXJkIHJvd3MsIExMTS1leHRyYWN0ZWQgdGV4dCkuIFdoZW4gdGhlIE5ISSBjb2RlXG4gIC8vIElTIHByZXNlbnQsIDA5MDA1QyBcdTIxOTIgMTU1OC02IChGYXN0aW5nKSBhbmQgMDkxNDBDIFx1MjE5MiAyMzQ1LTdcbiAgLy8gKGdlbmVyaWMpIHdpbnMgZGlyZWN0bHkgdmlhIF9OSElfVE9fTE9JTkMuXG4gIC8vXG4gIC8vIEZhaXRoZnVsLXRyYW5zcG9ydCBwcmluY2lwbGU6IHRoZSBicmlkZ2UgZG9lcyBOT1QgcmUtaW50ZXJwcmV0XG4gIC8vIGRpc3BsYXkgc3RyaW5ncyBsaWtlIFwiRklOR0VSIFNVR0FSXCIgYXMgYSBkaWZmZXJlbnQgTE9JTkMgXHUyMDE0IGl0XG4gIC8vIHByZXNlcnZlcyB0aGUgcmF3IGRpc3BsYXkgaW4gYGNvZGUudGV4dGAgYW5kIHRoZSBvcmlnaW5hbCBOSElcbiAgLy8gY29kZSBpbiBgY29kZS5jb2RpbmdgLiBUaGUgU01BUlQgYXBwIGRvZXMgc3BlY2ltZW4vbWV0aG9kLWF3YXJlXG4gIC8vIGdyb3VwaW5nIG9uIHRoZSBjb25zdW1lciBzaWRlIChzZWUgU01BUlQgYXBwIGhhbmRvZmYgZG9jKS5cbiAgXCJmYXN0aW5nIGdsdWNvc2VcIjogXCIxNTU4LTZcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIjE1NTgtNlwiLFxuICBcImdsdS1hY1wiOiBcIjE1NTgtNlwiLFxuICBcImdsdWNvc2UgYWNcIjogXCIxNTU4LTZcIixcbiAgZ2x1Y29zZTogXCIyMzQ1LTdcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIjIzNDUtN1wiLFxuICBnbHU6IFwiMjM0NS03XCIsXG4gIC8vIEhiQTFjIE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljIFwiaGJcIiBlbnRyaWVzIHNvIHRoZSBsb25nZXN0LXByZWZpeFxuICAvLyBtYXRjaCB3aW5zIGZvciB0aGUgXCJIYkExY1wiIGRpc3BsYXkgc3RyaW5nLiBPdGhlciBBMWMgc3lub255bXNcdTIwMjZcbiAgaGJhMWM6IFwiNDU0OC00XCIsXG4gIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCI0NTQ4LTRcIixcbiAgYTFjOiBcIjQ1NDgtNFwiLFxuICBoZW1vZ2xvYmluOiBcIjcxOC03XCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCI3MTgtN1wiLFxuICBoZ2I6IFwiNzE4LTdcIixcbiAgaGI6IFwiNzE4LTdcIixcbiAgLy8gQ0JDIGRpZmYgXHUyMDE0IGVvc2lub3BoaWwgY291bnQgbXVzdCBwcmVjZWRlIHRoZSBiYXJlICd3YmMnLydcdTc2N0RcdTg4NDBcdTc0MDMnXG4gIC8vIGtleXMgKHdoaWNoIHdvdWxkIG90aGVyd2lzZSB3aW4gYXMgc3Vic3RyaW5ncykuXG4gIC8vIDcxMS0yIHZlcmlmaWVkIGF0IGxvaW5jLm9yZzogJ0Vvc2lub3BoaWxzIFsjL3ZvbHVtZV0gaW4gQmxvb2RcbiAgLy8gYnkgQXV0b21hdGVkIGNvdW50Jy5cbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIjcxMS0yXCIsXG4gIFx1NTVEQ1x1NEYwQVx1N0QwNVx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsOiBcIjcxMS0yXCIsXG4gIGVvc2lub3BoaWxzOiBcIjcxMS0yXCIsXG4gIHdiYzogXCI2NjkwLTJcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIjY2OTAtMlwiLFxuICBwbGF0ZWxldDogXCI3NzctM1wiLFxuICBcdTg4NDBcdTVDMEZcdTY3N0Y6IFwiNzc3LTNcIixcbiAgcGx0OiBcIjc3Ny0zXCIsXG4gIC8vIFJCQyArIFJCQyBpbmRpY2VzIFx1MjAxNCB2ZXJpZmllZCBMT0lOQ3MgKGxvaW5jLm9yZyk6XG4gIC8vIDc4OS04ICBFcnl0aHJvY3l0ZXMgIy92b2wgQmxvb2QgQXV0byAgICAgICAgICAgICAgXHUyMTkyIFJCQ1xuICAvLyA3ODUtNiAgRXJ5dGhyb2N5dGUgbWVhbiBjb3JwdXNjdWxhciBoZW1vZ2xvYmluICAgIFx1MjE5MiBNQ0hcbiAgLy8gTG9uZyBDSksgZm9ybXMgZmlyc3QgKExETC9jaG9sZXN0ZXJvbCBwYXR0ZXJuKSBzbyAnXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXG4gIC8vIFx1ODg0MFx1ODI3Mlx1N0QyMCcgd2lucyBvdmVyIFx1N0QwNVx1ODg0MFx1NzQwMy5cbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIjc4NS02XCIsXG4gIHJiYzogXCI3ODktOFwiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDM6IFwiNzg5LThcIixcbiAgbWNoOiBcIjc4NS02XCIsXG4gIC8vIFVyaW5lIGNyZWF0aW5pbmUgXHUyMDE0IE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljICdjcmVhdGluaW5lJyBzb1xuICAvLyByb3dzIGxpa2UgJ1UtQ1JFIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MCcgb3IgJ0NyZWF0aW5pbmUoVSknIHJlc29sdmUgdG8gdGhlXG4gIC8vIHVyaW5lIExPSU5DICgyMTYxLTgpIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIHNlcnVtXG4gIC8vIGRlZmF1bHQgKDIxNjAtMCkuIFNhbWUgbG9uZ2VzdC1zcGVjaWZpYy1maXJzdCBvcmRlcmluZyBhc1xuICAvLyB0aGUgZmFzdGluZy12cy1yYW5kb20gZ2x1Y29zZSBibG9jay5cbiAgXCJ1cmluZSBjcmVhdGluaW5lXCI6IFwiMjE2MS04XCIsXG4gIFwiY3JlYXRpbmluZSB1cmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUodSlcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZVwiOiBcIjIxNjEtOFwiLFxuICBcInUtY3JlYVwiOiBcIjIxNjEtOFwiLFxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MS04XCIsXG4gIGNyZWF0aW5pbmU6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE3OFx1OTE1MDogXCIyMTYwLTBcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIjIxNjAtMFwiLCAvLyBUYWl3YW4gdmFyaWFudCBzcGVsbGluZ1xuICBjcmVhOiBcIjIxNjAtMFwiLFxuICBidW46IFwiMzA5NC0wXCIsXG4gIFx1NUMzRlx1N0QyMFx1NkMyRTogXCIzMDk0LTBcIixcbiAgYXN0OiBcIjE5MjAtOFwiLFxuICBhbHQ6IFwiMTc0Mi02XCIsXG4gIGZlcnJpdGluOiBcIjIyNzYtNFwiLFxuICBcdTg4NDBcdTZFMDVcdTk0MzVcdTg2Q0JcdTc2N0Q6IFwiMjI3Ni00XCIsXG4gIGZlcnI6IFwiMjI3Ni00XCIsXG4gIC8vIFZpdGFsLXNpZ25zIGZyb20gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1IChJSEtFMzQwMikgXHUyMDE0IHNlcGFyYXRlIGNvZGUgbmFtZXNwYWNlXG4gIC8vIGJ1dCB0aGUgbG9va3VwIGlzIGJ5IGRpc3BsYXktbmFtZSBzdWJzdHJpbmcsIHNhbWUgYXMgZm9yIGxhYnMuXG4gIFwiYm9keSBoZWlnaHRcIjogXCI4MzAyLTJcIixcbiAgXCJib2R5IHdlaWdodFwiOiBcIjI5NDYzLTdcIixcbiAgYm1pOiBcIjM5MTU2LTVcIixcbiAgLy8gV2Fpc3QgY2lyY3VtZmVyZW5jZSBcdTIwMTQgbWVhc3VyZW1lbnQgTE9JTkMgKDgyODAtMCkuIDU2MDg2LTIgaXNcbiAgLy8gdGhlICdBZHVsdCBXYWlzdCBDaXJjdW1mZXJlbmNlIFByb3RvY29sJyBjb2RlLCB3aGljaCBpcyBhXG4gIC8vIHN1cnZleS9wcm90b2NvbCBkZXNjcmlwdG9yLCBOT1QgYSBudW1lcmljIG1lYXN1cmVtZW50XG4gIC8vICh2ZXJpZmllZCBhdCBsb2luYy5vcmcpLiBOSEkgXHU1MDY1XHU0RkREIHJlcG9ydHMgYSBzaW5nbGUgd2Fpc3RsaW5lXG4gIC8vIG51bWJlciBwZXIgdmlzaXQsIHNvIHRoZSBtZWFzdXJlbWVudCBjb2RlIGlzIGNvcnJlY3QuXG4gIFwid2Fpc3QgY2lyY3VtZmVyZW5jZVwiOiBcIjgyODAtMFwiLFxuICBcInN5c3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ4MC02XCIsXG4gIFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ2Mi00XCIsXG4gIC8vIExpcGlkIHBhbmVsIFx1MjAxNCBPUkRFUiBNQVRURVJTLiBMREwvSERMIHZhcmlhbnRzIE1VU1QgcHJlY2VkZSB0aGVcbiAgLy8gZ2VuZXJpYyAnY2hvbGVzdGVyb2wnIGtleSBzbyBhIHJvdyBsYWJlbGxlZCAnTERMIENIT0xFU1RFUk9MJ1xuICAvLyByZXNvbHZlcyB0byAxMzQ1Ny03IChMREwgY2FsY3VsYXRlZCkgYW5kICdIREwgQ0hPTEVTVEVST0wnIHRvXG4gIC8vIDIwODUtOSwgaW5zdGVhZCBvZiBmYWxsaW5nIHRvIDIwOTMtMyAodG90YWwgY2hvbGVzdGVyb2wpIHZpYSB0aGVcbiAgLy8gJ2Nob2xlc3Rlcm9sJyBzdWJzdHJpbmcuIFNhbWUgY2Fub25pY2FsIG9yZGVyaW5nIGFzIF9MQUJfU1lOT05ZTVMuXG4gIFwibGRsIGNob2xlc3Rlcm9sXCI6IFwiMTM0NTctN1wiLFxuICBcImxkbC1jaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgLy8gMTM0NTctNyA9IExETCBjaG9sZXN0ZXJvbCAoY2FsY3VsYXRlZCkgXHUyMDE0IG1hdGNoZXMgdGhlIE5ISSAwOTA0NENcbiAgLy8gYmlsbGluZyBjb2RlJ3MgaW50ZW50IChUYWl3YW4gbGFicyBwcmVkb21pbmFudGx5IHJlcG9ydCBjYWxjdWxhdGVkXG4gIC8vIExETCB2aWEgRnJpZWRld2FsZCkuIEtlZXAgY29uc2lzdGVudCB3aXRoIF9OSElfVE9fTE9JTkNbXCIwOTA0NENcIl0uXG4gIFwibGRsLWNcIjogXCIxMzQ1Ny03XCIsXG4gIGxkbDogXCIxMzQ1Ny03XCIsXG4gIFwiaGRsIGNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFwiaGRsLWNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwODUtOVwiLFxuICBcImhkbC1jXCI6IFwiMjA4NS05XCIsXG4gIGhkbDogXCIyMDg1LTlcIixcbiAgLy8gVG90YWwgY2hvbGVzdGVyb2wgXHUyMDE0IGJhcmUgJ2Nob2xlc3Rlcm9sJyBvbmx5IGZpcmVzIEFGVEVSIHRoZVxuICAvLyBMREwvSERMLXByZWZpeGVkIHZhcmlhbnRzIGFib3ZlIGhhdmUgYmVlbiBjaGVja2VkLlxuICBcInRvdGFsIGNob2xlc3Rlcm9sXCI6IFwiMjA5My0zXCIsXG4gIFwidC1jaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIFx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDkzLTNcIixcbiAgY2hvbGVzdGVyb2w6IFwiMjA5My0zXCIsXG4gIHRyaWdseWNlcmlkZTogXCIyNTcxLThcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIjI1NzEtOFwiLFxuICBcInVyaWMgYWNpZFwiOiBcIjMwODQtMVwiLFxuICBlZ2ZyOiBcIjMzOTE0LTNcIixcbiAgaGJzYWc6IFwiNTE5Ni0xXCIsXG4gIFwiYW50aS1oY3ZcIjogXCIxNjEyOC0xXCIsXG4gIC8vIFVyaW5lIHByb3RlaW4gKGRpc3BsYXkgZmFsbGJhY2sgZm9yIHRoZSBuby1OSEktY29kZSBwYXRoIHRoYXRcbiAgLy8gY29tZXMgZnJvbSBJSEtFMzQwMiB2aXRhbHMgKyBhZHVsdC1wcmV2ZW50aXZlIHN1cHBsZW1lbnRzKS5cbiAgXCJ1cmluZSBwcm90ZWluXCI6IFwiMjA0NTQtNVwiLCAvLyBQcm90ZWluIE1hc3Mvdm9sIFVyaW5lXG4gIFwidS1wcm9cIjogXCIyMDQ1NC01XCIsXG4gIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gIC8vIEFCRyBwYW5lbCBjb21wb25lbnRzIFx1MjAxNCAwOTA0MUIgcGFyZW50IGNvZGUgaW4gTkhJX1RPX0xPSU5DOyBlYWNoXG4gIC8vIG1lbWJlcidzIGRpc3BsYXkgKFwicENPMlwiLCBcInBPMlwiLCBcIkhDTzNcIiwgXCJUQ08yXCIsIFwiU0JFL0FCRVwiLFxuICAvLyBcIlNCQ1wiLCBcIlNBVFwiIC8gXCJTYU8yXCIpIGZhbGxzIHRvIGl0cyBvd24gTE9JTkMuXG4gIC8vIHBIIE1VU1QgY29tZSBiZWZvcmUgcGNvMi9wbzIgc28gdGhlIGJhcmUgXCJwSFwiIGRpc3BsYXkgbGFuZHMgaGVyZS5cbiAgcGg6IFwiMTE1NTgtNFwiLCAvLyBwSCBvZiBBcnRlcmlhbCBibG9vZFxuICBwY28yOiBcIjIwMTktOFwiLCAvLyBDYXJib24gZGlveGlkZSBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBwbzI6IFwiMjcwMy03XCIsIC8vIE94eWdlbiBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBoY28zOiBcIjE5NTktNlwiLCAvLyBCaWNhcmJvbmF0ZSBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgYmljYXJib25hdGU6IFwiMTk1OS02XCIsXG4gIHRjbzI6IFwiMjAyOC05XCIsIC8vIFRvdGFsIENPMiBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgc2JlOiBcIjExNTU1LTBcIiwgLy8gU3RhbmRhcmQgYmFzZSBleGNlc3MgQXJ0ZXJpYWxcbiAgYWJlOiBcIjExNTU1LTBcIixcbiAgc2JjOiBcIjE5MjUtN1wiLCAvLyBTdGFuZGFyZCBiaWNhcmJvbmF0ZSBBcnRlcmlhbFxuICBzYXR1cmF0OiBcIjI3MTMtNlwiLCAvLyBPMiBzYXR1cmF0aW9uIEFydGVyaWFsXG4gIHNhbzI6IFwiMjcxMy02XCIsXG4gIHNhdDogXCIyNzEzLTZcIiwgLy8gTkhJIGRpc3BsYXkgc2hvd3MganVzdCBcIlNBVFwiXG4gIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBjb21wb25lbnRzICgxNjAwOEMgcGFyZW50IGFib3ZlKS5cbiAgXCJzZi5jb2xvclwiOiBcIjU3NzgtNlwiLCAvLyBDb2xvciBvZiBCb2R5IGZsdWlkIChyZXVzZSBVcmluZSBjb2xvciBzcGVjIE9LKVxuICAvLyBOT1RFOiA4MjU1LTIgLyAxMzk0OC01IHByZXZpb3VzbHkgbGlzdGVkIGhlcmUgYm90aCB0dXJuZWQgb3V0XG4gIC8vIHRvIGJlIHVucmVsYXRlZCBMT0lOQ3MgKHZlcmlmaWVkIGxvaW5jLm9yZyBcdTIwMTQgODI1NS0yIGlzXG4gIC8vICdTZXJ2aWNlIGNvbW1lbnQgMTMnLCAxMzk0OC01IGlzICdDb2NjaWRpb2lkZXMgaW1taXRpcyBJZ01cbiAgLy8gQWInKS4gQm9keS1mbHVpZCBBcHBlYXJhbmNlIC8gUkJDIGRvbid0IGhhdmUgd2VsbC1hdHRlc3RlZFxuICAvLyBMT0lOQ3MgaW4gb3VyIHRhYmxlIHlldCBcdTIwMTQgZmFsbGluZyB0aHJvdWdoIHRvIGNvZGUudGV4dC1vbmx5XG4gIC8vIGlzIHNhZmVyIHRoYW4gZW1pdHRpbmcgYSBtaXNsZWFkaW5nIExPSU5DLiBUbyBhZGQgbGF0ZXIsXG4gIC8vIHZlcmlmeSBlYWNoIGFnYWluc3QgbG9pbmMub3JnIGZpcnN0LlxuICBcInNmLndiY1wiOiBcIjI2NDY2LTNcIiwgLy8gV0JDICMvdm9sIEJvZHkgZmx1aWRcbiAgXCJzZi5uZXV0cm9waGlsXCI6IFwiMTAzMjgtNlwiLCAvLyBOZXV0cm9waGlscy8xMDAgbGV1a29jeXRlcyBpbiBCb2R5IGZsdWlkXG4gIFwic2YubHltcGhvXCI6IFwiMTMwNDYtOFwiLCAvLyBMeW1waG9jeXRlcyAjL3ZvbCBCb2R5IGZsdWlkXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0xPSU5DX0RJU1BMQVkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDYW5vbmljYWwgRW5nbGlzaCBkaXNwbGF5IG5hbWVzIGZvciBMT0lOQyBjb2RlcyB0aGUgYnJpZGdlIGVtaXRzLlxuLy8gRmFsbHMgYmFjayB0byB0aGUgcmF3IGlucHV0IGRpc3BsYXkgd2hlbiBhIExPSU5DIGlzbid0IGxpc3RlZCBoZXJlLlxuLy8gU291cmNlZCBmcm9tIGxvaW5jLm9yZyBjYW5vbmljYWwgc2hvcnQgbmFtZXMgd2hlcmUgYXBwbGljYWJsZS5cbi8vIEFkZCBuZXcgZW50cmllcyBhcyB3ZSB3aWRlbiBMT0lOQyBjb3ZlcmFnZSBcdTIwMTQgdGhlIGxvb2t1cCBpcyBrZXllZCBvblxuLy8gTE9JTkMgc3RyaW5nLCBzbyB1bm1hcHBlZCBMT0lOQ3MgZGVncmFkZSBncmFjZWZ1bGx5IHRvIHRoZSBOSEkgdGV4dC5cbmV4cG9ydCBjb25zdCBMT0lOQ19ESVNQTEFZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE1vc3QgY3JpdGljYWwgYmxvY2sgXHUyMDE0IE5ISSdzIFwiQ29sb3IgXHU1QzNGIFx1OTg0RiAgLi4uXCIgc3R5bGUgbGFiZWxzIGFyZVxuICAvLyB3aGF0IHRyaWdnZXJzIGRvd25zdHJlYW0gQ2hpbmVzZS1zdWJzdHJpbmcgbGFiZWxsaW5nIGJ1Z3MuXG4gIFwiNTgwMy0yXCI6IFwicEggb2YgVXJpbmVcIixcbiAgXCI1ODExLTVcIjogXCJTcGVjaWZpYyBncmF2aXR5IG9mIFVyaW5lXCIsXG4gIFwiNTc3MC0zXCI6IFwiQmlsaXJ1YmluIFVyaW5lIFFsXCIsXG4gIFwiNTgwMi00XCI6IFwiTml0cml0ZSBVcmluZSBRbFwiLFxuICBcIjU3NzgtNlwiOiBcIkNvbG9yIG9mIFVyaW5lXCIsXG4gIFwiNTc2Ny05XCI6IFwiQXBwZWFyYW5jZSBvZiBVcmluZVwiLFxuICBcIjU4MTgtMFwiOiBcIlVyb2JpbGlub2dlbiBVcmluZSBRbFwiLFxuICBcIjIwNDU0LTVcIjogXCJQcm90ZWluIE1hc3MvVm9sIGluIFVyaW5lXCIsXG4gIFwiMTQ5NTctNVwiOiBcIk1pY3JvYWxidW1pbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU5LTFcIjogXCJNaWNyb2FsYnVtaW4vQ3JlYXRpbmluZSBSYXRpbyBpbiBVcmluZVwiLFxuICBcIjU3OTItN1wiOiBcIkdsdWNvc2UgVXJpbmUgUWxcIixcbiAgXCI1Nzk3LTZcIjogXCJLZXRvbmVzIFVyaW5lIFFsXCIsXG4gIFwiNTc5NC0zXCI6IFwiSGVtb2dsb2JpbiBVcmluZSBRbFwiLFxuICBcIjU3OTktMlwiOiBcIkxldWtvY3l0ZXMgVXJpbmUgUWxcIixcbiAgXCIyNDM1Ni04XCI6IFwiVXJpbmFseXNpcyBNYWNybyBQYW5lbFwiLFxuICAvLyBBTEwgZW50cmllcyBiZWxvdyB1c2UgdGhlIExPSU5DIGNhbm9uaWNhbCAnTG9uZyBDb21tb24gTmFtZSdcbiAgLy8gYXMgYWNjZXB0ZWQgYnkgdGhlIFRXTkhJRkhJUiB2YWxpZGF0b3IuIFNvdXJjZTogbG9pbmMub3JnIGZvclxuICAvLyBlYWNoIGNvZGUsIGNyb3NzLWNoZWNrZWQgYWdhaW5zdCB0aGUgdmFsaWRhdG9yJ3MgcmVwb3J0ZWRcbiAgLy8gJ1ZhbGlkIGRpc3BsYXkgaXMgb25lIG9mIE4gY2hvaWNlcycgZm9yIGRpc3BsYXlzIHdlIHByZXZpb3VzbHlcbiAgLy8gZ290IHdyb25nICg0NSBMT0lOQ3MgZm91bmQgaW4gdGhlIFAzMzMzMzMzMzMgdmFsaWRhdGlvbiBydW4pLlxuICAvLyBXaGVuIHVwZGF0aW5nLCBjb3B5IHRoZSBleGFjdCBlbi1VUyBsb25nIG5hbWUgZnJvbSBsb2luYy5vcmcgXHUyMDE0XG4gIC8vIHRoZSB2YWxpZGF0b3IgaXMgc2Vuc2l0aXZlIHRvIHNwZWxsaW5nIC8gcHVuY3R1YXRpb24uXG4gIC8vXG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MgcGFuZWwgc3ViLWl0ZW1zKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gXHUyNTAwXHUyNTAwIEFCRyAoMDkwNDFCIHBhbmVsKSBcdTIwMTQgbm90IGluIHZhbGlkYXRvciBvdXRwdXQ7IGxvaW5jLm9yZyBzb3VyY2VkXG4gIFwiMTE1NTgtNFwiOiBcInBIIG9mIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAxOS04XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW1BhcnRpYWwgcHJlc3N1cmVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjcwMy03XCI6IFwiT3h5Z2VuIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjE5NTktNlwiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAyOC05XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTE1NTUtMFwiOiBcIkJhc2UgZXhjZXNzIGluIEFydGVyaWFsIGJsb29kIGJ5IGNhbGN1bGF0aW9uXCIsXG4gIFwiMTkyNS03XCI6IFwiQmljYXJib25hdGUgW01vbGVzL3ZvbHVtZV0gaW4gQXJ0ZXJpYWwgYmxvb2QgLS1zdGFuZGFyZFwiLFxuICBcIjI3MTMtNlwiOiBcIk94eWdlbiBzYXR1cmF0aW9uIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE1NTgtNlwiOiBcIkZhc3RpbmcgZ2x1Y29zZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIzNDUtN1wiOiBcIkdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNzE4LTdcIjogXCJIZW1vZ2xvYmluIFtNYXNzL3ZvbHVtZV0gaW4gQmxvb2RcIixcbiAgXCI0NTQ4LTRcIjogXCJIZW1vZ2xvYmluIEExYy9IZW1vZ2xvYmluLnRvdGFsIGluIEJsb29kXCIsXG4gIFwiNjY5MC0yXCI6IFwiTGV1a29jeXRlcyBbIy92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc3Ny0zXCI6IFwiUGxhdGVsZXRzIFsjL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzg5LThcIjogXCJFcnl0aHJvY3l0ZXMgWyMvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3ODUtNlwiOiBcIk1DSCBbRW50aXRpYyBtYXNzXSBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3MTEtMlwiOiBcIkVvc2lub3BoaWxzIFsjL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNDU0NC0zXCI6IFwiSGVtYXRvY3JpdCBbVm9sdW1lIEZyYWN0aW9uXSBvZiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI1NzAyMS04XCI6IFwiQ0JDIFcgQXV0byBEaWZmZXJlbnRpYWwgcGFuZWwgLSBCbG9vZFwiLFxuICBcIjI0MzE3LTBcIjogXCJIZW1vZ3JhbSBhbmQgcGxhdGVsZXRzIFdPIGRpZmZlcmVudGlhbCBwYW5lbCAtIEJsb29kXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDaGVtaXN0cnkgLyBsaXZlciAvIHJlbmFsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE5MjAtOFwiOiBcIkFzcGFydGF0ZSBhbWlub3RyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzQyLTZcIjogXCJBbGFuaW5lIGFtaW5vdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIxNjAtMFwiOiBcIkNyZWF0aW5pbmUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMTYxLThcIjogXCJDcmVhdGluaW5lIFtNYXNzL3ZvbHVtZV0gaW4gVXJpbmVcIixcbiAgXCIzMzkxNC0zXCI6XG4gICAgXCJHbG9tZXJ1bGFyIGZpbHRyYXRpb24gcmF0ZSBbVm9sdW1lIFJhdGUvQXJlYV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IENyZWF0aW5pbmUtYmFzZWQgZm9ybXVsYSAoTURSRCkvMS43MyBzcSBNXCIsXG4gIFwiMzA5NC0wXCI6IFwiVXJlYSBuaXRyb2dlbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMwODQtMVwiOiBcIlVyYXRlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjk1MS0yXCI6IFwiU29kaXVtIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI4MjMtM1wiOiBcIlBvdGFzc2l1bSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTc1LTJcIjogXCJCaWxpcnViaW4udG90YWwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTY4LTdcIjogXCJCaWxpcnViaW4uZGlyZWN0IFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc1MS03XCI6IFwiQWxidW1pbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI1MzItMFwiOiBcIkxhY3RhdGUgZGVoeWRyb2dlbmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiNjc2OC02XCI6IFwiQWxrYWxpbmUgcGhvc3BoYXRhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIzMjQtMlwiOiBcIkdhbW1hIGdsdXRhbXlsIHRyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzg2MS02XCI6IFwiQ2FsY2l1bSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgTGlwaWQgcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMjA5My0zXCI6IFwiQ2hvbGVzdGVyb2wgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyNTcxLThcIjogXCJUcmlnbHljZXJpZGUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMDg1LTlcIjogXCJDaG9sZXN0ZXJvbCBpbiBIREwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxMzQ1Ny03XCI6IFwiQ2hvbGVzdGVyb2wgaW4gTERMIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IGNhbGN1bGF0aW9uXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIC8gaG9ybW9uZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMzAxNi0zXCI6IFwiVGh5cm90cm9waW4gW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzAyNC03XCI6IFwiVGh5cm94aW5lIChUNCkgZnJlZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE0OTIwLTNcIjogXCJUaHlyb3hpbmUgKFQ0KSBmcmVlIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI5ODYtOFwiOiBcIlRlc3Rvc3Rlcm9uZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjgzMDk4LTRcIjogXCJGb2xsaXRyb3BpbiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgXCI4MzA5Ni04XCI6IFwiRXN0cmFkaW9sIChFMikgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRpYWMgLyBpbmZsYW1tYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTA4MzktOVwiOiBcIlRyb3BvbmluIEkuY2FyZGlhYyBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMzNzYyLTZcIjogXCJOYXRyaXVyZXRpYyBwZXB0aWRlLkIgcHJvaG9ybW9uZSBOLVRlcm1pbmFsIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk4OC01XCI6IFwiQyByZWFjdGl2ZSBwcm90ZWluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzM5NTktOFwiOiBcIlByb2NhbGNpdG9uaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEhlcGF0aXRpcyAvIHNlcm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjUxOTUtM1wiOiBcIkhlcGF0aXRpcyBCIHZpcnVzIHN1cmZhY2UgQWcgW1ByZXNlbmNlXSBpbiBTZXJ1bVwiLFxuICBcIjUxOTYtMVwiOiBcIkhlcGF0aXRpcyBCIHZpcnVzIHN1cmZhY2UgQWcgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW1cIixcbiAgXCIxNjEyOC0xXCI6IFwiSGVwYXRpdGlzIEMgdmlydXMgQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bVwiLFxuICBcIjEzOTU1LTBcIjogXCJIZXBhdGl0aXMgQyB2aXJ1cyBBYiBbUHJlc2VuY2VdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVmlyb2xvZ3kgKGF1ZGl0IDIwMjYtMDUtMTkpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjc4NTMtNVwiOiBcIkN5dG9tZWdhbG92aXJ1cyBJZ00gQWIgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBUdW1vciBtYXJrZXJzIC8gcHJvdGVpbnMgKGF1ZGl0IDIwMjYtMDUtMTkpIFx1MjUwMFx1MjUwMFxuICBcIjE5NTItMVwiOiBcIkJldGEtMi1NaWNyb2dsb2J1bGluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDb2FndWxhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI2MzAxLTZcIjogXCJJTlIgaW4gUGxhdGVsZXQgcG9vciBwbGFzbWEgYnkgQ29hZ3VsYXRpb24gYXNzYXlcIixcbiAgXCIxNDk3OS05XCI6IFwiYVBUVCBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYSBieSBDb2FndWxhdGlvbiBhc3NheVwiLFxuICBcIjMwMjQwLTZcIjogXCJGaWJyaW4gRC1kaW1lciBbTWFzcy92b2x1bWVdIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXRhbCBzaWducyAoSUhLRTM0MDIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjgzMDItMlwiOiBcIkJvZHkgaGVpZ2h0XCIsXG4gIFwiMjk0NjMtN1wiOiBcIkJvZHkgd2VpZ2h0XCIsXG4gIFwiMzkxNTYtNVwiOiBcIkJvZHkgbWFzcyBpbmRleCAoQk1JKSBbUmF0aW9dXCIsXG4gIFwiODI4MC0wXCI6IFwiV2Fpc3QgQ2lyY3VtZmVyZW5jZSBhdCB1bWJpbGljdXMgYnkgVGFwZSBtZWFzdXJlXCIsXG4gIFwiODQ4MC02XCI6IFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NDYyLTRcIjogXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NTM1NC05XCI6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWwgd2l0aCBhbGwgY2hpbGRyZW4gb3B0aW9uYWxcIixcbn07XG4iLCAiLyoqXG4gKiBQdXJlIHBhcnNpbmcgaGVscGVycyBcdTIwMTQgcmVmZXJlbmNlIHJhbmdlLCBxdWFudGl0eSwgVUNVTSB1bml0IG5vcm1hbGlzYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19wYXJzZXJzLnB5YC4gU2VsZi1jb250YWluZWQ6IG5vIGRlcGVuZGVuY2llc1xuICogb24gb3RoZXIgb2JzZXJ2YXRpb24gbW9kdWxlIHBpZWNlcy5cbiAqXG4gKiBQdWJsaWMgQVBJOlxuICogICB0b1VjdW0odW5pdCkgICAgICAgICAgICAgICAgICBcdTIxOTIgY2Fub25pY2FsIFVDVU0gdW5pdCBzdHJpbmcgKG9yIG51bGwpXG4gKiAgIHBhcnNlUmFuZ2VNdWx0aShyYXcsIHVuaXQpICAgIFx1MjE5MiBsaXN0IG9mIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cmllc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvbmUgcGVyIHNleCB3aGVuIHNleC1zdHJhdGlmaWVkKVxuICogICBwYXJzZVJhbmdlKHJhdywgdW5pdCkgICAgICAgICBcdTIxOTIgc2luZ2xlIHJlZmVyZW5jZVJhbmdlIGVudHJ5XG4gKiAgIHRyeVBhcnNlUXVhbnRpdHkocmF3LCB1bml0KSAgIFx1MjE5MiBGSElSIFF1YW50aXR5IGRpY3Qgb3IgbnVsbFxuICovXG5cbmNvbnN0IFVDVU1fU1lTVEVNID0gXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCI7XG5cbi8vIEZISVIgUjQgUXVhbnRpdHkuY29tcGFyYXRvciBhbGxvd2VkIHZhbHVlcy4gTm9ybWFsaXNlIGZ1bGwtd2lkdGggQ0pLXG4vLyBcdUZGMUUgXHVGRjFDIFx1MjI2NyBcdTIyNjYgKyBBU0NJSSB2YXJpYW50cyBzbyBcIlx1RkYxRSA0MC4wXCIgc3RpbGwgcGFyc2VzIGFzIGEgcmVhbCBudW1iZXJcbi8vIGluc3RlYWQgb2YgZmFsbGluZyB0aHJvdWdoIHRvIHZhbHVlU3RyaW5nICh3aGljaCBsb3NlcyB0aGUgdW5pdCkuXG5jb25zdCBGVUxMV0lEVEhfT1BTOiBSZWFkb25seUFycmF5PFtzdHJpbmcsIHN0cmluZ10+ID0gW1xuICBbXCJcdUZGMUVcIiwgXCI+XCJdLFxuICBbXCJcdUZGMUNcIiwgXCI8XCJdLFxuICBbXCJcdTIyNjdcIiwgXCI+PVwiXSxcbiAgW1wiXHUyMjY2XCIsIFwiPD1cIl0sXG4gIFtcIlx1MjI2NVwiLCBcIj49XCJdLFxuICBbXCJcdTIyNjRcIiwgXCI8PVwiXSxcbl07XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZUZ1bGx3aWR0aChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgb3V0ID0gcztcbiAgZm9yIChjb25zdCBbZnJvbSwgdG9dIG9mIEZVTExXSURUSF9PUFMpIHtcbiAgICBpZiAob3V0LmluY2x1ZGVzKGZyb20pKSB7XG4gICAgICBvdXQgPSBvdXQuc3BsaXQoZnJvbSkuam9pbih0byk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmNvbnN0IENPTVBBUkFUT1JfUkUgPSAvXlxccyooPD18Pj18PHw+KVxccyooLispJC87XG5cbi8vIFJlZmVyZW5jZS1yYW5nZSBwYXJzaW5nLiBOSEkgc2hpcHMgdGhlIHJhbmdlIGFzIHBsYWluIHRleHQgbGlrZVxuLy8gXCJbMy44OV1bMjYuOF1cIiwgXCJbNDBdW11cIiwgXCJbTmVnYXRpdmVdXCIgb3IgXCJBTSA4OjAwIDYuMi0xOS40XCIuXG5jb25zdCBSUl9MT1dISUdIX0JSQUNLRVRTID0gL15cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqJC87XG5jb25zdCBSUl9EQVNIX1JBTkdFID0gLygtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlstflx1MjAxM11cXHMqKC0/XFxkKyg/OlxcLlxcZCspPykvO1xuY29uc3QgUlJfQ09NUEFSQVRPUiA9IC9eXFxzKig8PXw+PXw8fD4pXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKiQvO1xuLy8gU2V4LXN0cmF0aWZpZWQgYnJhY2tldGVkIHJhbmdlLCBlLmcuIFwiXHU3NTM3OjEzLjcgXHU1OTczOjExLjFcIiBcdTIwMTQgdXNlZCBieSBzb21lXG4vLyBob3NwaXRhbHMgZm9yIGhhZW1hdG9sb2d5IChIYiwgUkJDLCBIY3QpLiBQdWxscyBvdXQgKHNleCwgdmFsdWUpIHBhaXJzLlxuLy8gVG9sZXJhdGVzIG9wdGlvbmFsIGNvbXBhcmF0b3IgKFx1MjI2Ny9cdTIyNjYvPi88KSBiZWZvcmUgdGhlIG51bWJlci5cbmNvbnN0IFJSX1NFWF9OVU1fRyA9IC8oXHU3NTM3XHU2MDI3fFx1NTk3M1x1NjAyN3xcdTc1Mzd8XHU1OTczfE18RilcXHMqWzpcdUZGMUFdP1xccyooPzpbPD5cdTIyNjdcdTIyNjZdPT8pP1xccyooLT9cXGQrKD86XFwuXFxkKyk/KS9nO1xuY29uc3QgUlJfU0lOR0xFX0JSQUNLRVQgPSAvXlxccypcXFtcXHMqKC4rPylcXHMqXFxdXFxzKiQvO1xuY29uc3QgUlJfUVVBTElUQVRJVkVfUEFSRU4gPVxuICAvXlxccyooTm9ybWFsfFx1NkI2M1x1NUUzOHxOb25yZWFjdGl2ZXxOb24tcmVhY3RpdmUpXFxzKlxcKFxccyooLT9cXGQrKD86XFwuXFxkKyk/KVxccypcXClcXHMqJC9pO1xuXG5jb25zdCBTRVhfVE9fRkhJUjogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIFx1NzUzN1x1NjAyNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIFx1NzUzNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIE06IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBcdTU5NzNcdTYwMjc6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbiAgXHU1OTczOiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG4gIEY6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbn07XG5cbi8vIFB1YmxpYyB0eXBlcyBcdTIwMTQgRkhJUiBRdWFudGl0eSAvIHJlZmVyZW5jZVJhbmdlIHNoYXBlcyB1c2VkIGRvd25zdHJlYW0uXG5leHBvcnQgaW50ZXJmYWNlIFF1YW50aXR5IHtcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdD86IHN0cmluZztcbiAgc3lzdGVtPzogc3RyaW5nO1xuICBjb2RlPzogc3RyaW5nO1xuICBjb21wYXJhdG9yPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlRW50cnkge1xuICB0ZXh0OiBzdHJpbmc7XG4gIGxvdz86IFF1YW50aXR5O1xuICBoaWdoPzogUXVhbnRpdHk7XG4gIGFwcGxpZXNUbz86IEFycmF5PHtcbiAgICBjb2Rpbmc6IEFycmF5PHsgc3lzdGVtOiBzdHJpbmc7IGNvZGU6IHN0cmluZzsgZGlzcGxheTogc3RyaW5nIH0+O1xuICAgIHRleHQ6IHN0cmluZztcbiAgfT47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVQ1VNIG5vcm1hbGlzYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTkhJIGxhYnMgcmVwb3J0IHVuaXRzIGluIGEgbWl4IG9mIFVDVU0tY2xlYW4gc3RyaW5ncyAoJ21nL2RMJyksXG4gKiBUYWl3YW4tc3R5bGUgZXF1aXZhbGVudHMgKCdtRXEvTCcgdnMgVUNVTSAnbWVxL0wnKSwgZnVsbC13aWR0aCBwdW5jdHVhdGlvblxuICogKCdcdUZGMDUnIHZzICclJyksIGFuZCBwbGFjZWhvbGRlciB0ZXh0ICgnXHU3MTIxJykuIFRoZSBUV05ISUZISVIgdmFsaWRhdG9yXG4gKiByZWplY3RzIGV2ZXJ5dGhpbmcgZXhjZXB0IGNhbm9uaWNhbCBVQ1VNIGluIFF1YW50aXR5LmNvZGUsIHNvIHdlXG4gKiBub3JtYWxpc2UuIGBudWxsYCBtZWFucyBcIm9taXQgUXVhbnRpdHkuY29kZSBlbnRpcmVseVwiLlxuICovXG5jb25zdCBVQ1VNX09WRVJSSURFUzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVsbD4gPSB7XG4gIC8vIEZ1bGx3aWR0aCBcdTIxOTIgQVNDSUlcbiAgXCJcdUZGMDVcIjogXCIlXCIsXG4gIC8vIENhc2Utc2Vuc2l0aXZlIFVDVU0gKEVxIGlzICdlcScsIG5vdCAnRXEnKVxuICBcIm1FcS9MXCI6IFwibWVxL0xcIixcbiAgXCJtZXEvbFwiOiBcIm1lcS9MXCIsXG4gIC8vIEJQIHByb2ZpbGUgZml4ZWQtdmFsdWU6IG1tW0hnXSBub3QgbW1IZ1xuICBtbUhnOiBcIm1tW0hnXVwiLFxuICBNTUhHOiBcIm1tW0hnXVwiLFxuICAvLyBDb21tb24gQ2hpbmVzZSAnbm8gdW5pdCcgcGxhY2Vob2xkZXJzIFx1MjE5MiBkcm9wIFVDVU0gY29kZVxuICBcdTcxMjE6IG51bGwsXG4gIFwiXCI6IG51bGwsXG4gIFwiXHUyMDE0XCI6IG51bGwsXG4gIFwiLVwiOiBudWxsLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvVWN1bSh1bml0OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdW5pdCkgcmV0dXJuIG51bGw7XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoVUNVTV9PVkVSUklERVMsIHVuaXQpKSB7XG4gICAgcmV0dXJuIFVDVU1fT1ZFUlJJREVTW3VuaXRdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIHVuaXQ7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBRdWFudGl0eSBidWlsZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBtYWtlUXVhbnRpdHkodmFsdWU6IG51bWJlciwgdW5pdDogc3RyaW5nKTogUXVhbnRpdHkge1xuICBjb25zdCBxOiBRdWFudGl0eSA9IHsgdmFsdWUgfTtcbiAgaWYgKHVuaXQpIHtcbiAgICBxLnVuaXQgPSB1bml0O1xuICAgIHEuc3lzdGVtID0gVUNVTV9TWVNURU07XG4gICAgcS5jb2RlID0gdW5pdDtcbiAgfVxuICByZXR1cm4gcTtcbn1cblxuZnVuY3Rpb24gdHJ5UGFyc2VGbG9hdChzOiBzdHJpbmcpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHMgPT09IFwiXCIgfHwgcyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgLy8gTWlycm9yIFB5dGhvbidzIGZsb2F0KCkgXHUyMDE0IGFsbG93IGxlYWRpbmcvdHJhaWxpbmcgd2hpdGVzcGFjZSxcbiAgLy8gb3B0aW9uYWwgc2lnbiwgZGVjaW1hbC4gUmVqZWN0IGlmIE5hTiBPUiBpZiBhbnkgbm9uLW51bWVyaWMgcmVzaWR1YWxcbiAgLy8gKE51bWJlcihcIjEyYWJjXCIpIHJldHVybnMgTmFOLCBPSzsgXCIxMiAgYWJjXCIgYWxzbyBOYU4sIE9LKS5cbiAgY29uc3QgdHJpbW1lZCA9IHMudHJpbSgpO1xuICBpZiAodHJpbW1lZCA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG4gPSBOdW1iZXIodHJpbW1lZCk7XG4gIGlmIChOdW1iZXIuaXNOYU4obikpIHJldHVybiBudWxsO1xuICByZXR1cm4gbjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHBhcnNlUmFuZ2VNdWx0aSAvIHBhcnNlUmFuZ2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTGlzdCB2YXJpYW50IG9mIHBhcnNlUmFuZ2U6IGVtaXRzIG9uZSBlbnRyeSBwZXIgc2V4IHdoZW4gdGhlIHJhbmdlIGlzXG4gKiBzZXgtc3RyYXRpZmllZCAoXCJbXHU3NTM3OjEzLjcgXHU1OTczOjExLjFdW1x1NzUzNzoxNy4wIFx1NTk3MzoxNS4wXVwiKSwgb3RoZXJ3aXNlIGFcbiAqIHNpbmdsZS1lbGVtZW50IGxpc3QuIEVhY2ggZW50cnkgdGFnZ2VkIHdpdGggYXBwbGllc1RvIHNvIGRvd25zdHJlYW1cbiAqIGNvZGUgY2FuIHBpY2sgdGhlIHJpZ2h0IG9uZSBmb3IgdGhlIHBhdGllbnQncyBzZXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlTXVsdGkocmF3UmFuZ2U6IHN0cmluZywgdW5pdDogc3RyaW5nKTogUmFuZ2VFbnRyeVtdIHtcbiAgY29uc3QgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aCgocmF3UmFuZ2UgfHwgXCJcIikudHJpbSgpKTtcbiAgaWYgKCFzKSByZXR1cm4gW107XG5cbiAgY29uc3QgbG93QnlTZXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaGlnaEJ5U2V4OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGxldCB1c2VkTXVsdGkgPSBmYWxzZTtcblxuICBjb25zdCBtID0gcy5tYXRjaChSUl9MT1dISUdIX0JSQUNLRVRTKTtcbiAgaWYgKG0pIHtcbiAgICBjb25zdCBsb3dCbG9iID0gbVsxXSA/PyBcIlwiO1xuICAgIGNvbnN0IGhpZ2hCbG9iID0gbVsyXSA/PyBcIlwiO1xuICAgIGZvciAoY29uc3Qgc20gb2YgbG93QmxvYi5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICBpZiAoc21bMV0gJiYgc21bMl0pIGxvd0J5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNtIG9mIGhpZ2hCbG9iLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgIGlmIChzbVsxXSAmJiBzbVsyXSkgaGlnaEJ5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gU2luZ2xlLWJyYWNrZXQ6IGVhY2ggcGVyLXNleCB2YWx1ZSdzIGNvbXBhcmF0b3IgZGVjaWRlcyBsb3cgdnMgaGlnaC5cbiAgICBjb25zdCBzaW5nbGUgPSBzLm1hdGNoKFJSX1NJTkdMRV9CUkFDS0VUKTtcbiAgICBpZiAoc2luZ2xlKSB7XG4gICAgICBjb25zdCBpbm5lciA9IHNpbmdsZVsxXSA/PyBcIlwiO1xuICAgICAgZm9yIChjb25zdCBzbSBvZiBpbm5lci5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICAgIGNvbnN0IHNleEtleSA9IHNtWzFdID8/IFwiXCI7XG4gICAgICAgIGNvbnN0IHZhbFN0ciA9IHNtWzJdID8/IFwiXCI7XG4gICAgICAgIC8vIEZpbmQgdGhlIGNvbXBhcmF0b3IgaW1tZWRpYXRlbHkgcHJlY2VkaW5nIHRoaXMgbnVtYmVyLlxuICAgICAgICAvLyBNaXJyb3IgdGhlIFB5dGhvbjogcmVidWlsZCBhIHBlci1zZXgta2V5IHNlYXJjaC5cbiAgICAgICAgY29uc3QgcGF0ID0gbmV3IFJlZ0V4cChgJHtlc2NhcGVSZWdleChzZXhLZXkpfVxcXFxzKls6XHVGRjFBXT9cXFxccyooWzw+XHUyMjY3XHUyMjY2XT0/KT9cXFxccyotP1xcXFxkYCk7XG4gICAgICAgIGNvbnN0IGNtID0gaW5uZXIubWF0Y2gocGF0KTtcbiAgICAgICAgY29uc3Qgb3AgPSBjbT8uWzFdID8/IFwiXCI7XG4gICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgIGxvd0J5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH0gZWxzZSBpZiAob3AgPT09IFwiPFwiIHx8IG9wID09PSBcIjw9XCIpIHtcbiAgICAgICAgICBoaWdoQnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb3dCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gICAgfVxuICB9XG5cbiAgaWYgKHVzZWRNdWx0aSkge1xuICAgIGNvbnN0IGVudHJpZXM6IFJhbmdlRW50cnlbXSA9IFtdO1xuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgdW5pb24gb2Yga2V5cyBhY3R1YWxseSBzZWVuIFx1MjAxNCBwcmVzZXJ2ZSBpbnNlcnRpb24gb3JkZXIuXG4gICAgY29uc3QgYWxsU2V4S2V5czogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLk9iamVjdC5rZXlzKGxvd0J5U2V4KSwgLi4uT2JqZWN0LmtleXMoaGlnaEJ5U2V4KV0pIHtcbiAgICAgIGlmICghYWxsU2V4S2V5cy5pbmNsdWRlcyhrKSkgYWxsU2V4S2V5cy5wdXNoKGspO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNleEtleSBvZiBhbGxTZXhLZXlzKSB7XG4gICAgICBjb25zdCBtYXBwaW5nID0gU0VYX1RPX0ZISVJbc2V4S2V5XTtcbiAgICAgIGlmICghbWFwcGluZykgY29udGludWU7XG4gICAgICBjb25zdCBbZmhpckNvZGUsIGZoaXJEaXNwbGF5XSA9IG1hcHBpbmc7XG4gICAgICBjb25zdCBlbnRyeTogUmFuZ2VFbnRyeSA9IHtcbiAgICAgICAgdGV4dDogcmF3UmFuZ2UsXG4gICAgICAgIGFwcGxpZXNUbzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9obDcub3JnL2ZoaXIvYWRtaW5pc3RyYXRpdmUtZ2VuZGVyXCIsXG4gICAgICAgICAgICAgICAgY29kZTogZmhpckNvZGUsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmhpckRpc3BsYXksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgdGV4dDogZmhpckRpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBpZiAoc2V4S2V5IGluIGxvd0J5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGxvd0J5U2V4W3NleEtleV0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICAgIGlmIChzZXhLZXkgaW4gaGlnaEJ5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGhpZ2hCeVNleFtzZXhLZXldISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgICAgZW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICB9XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gRGUtZHVwIGJ5IEZISVIgc2V4IGNvZGUgaW4gY2FzZSBpbnB1dCBoYXMgYm90aCBcdTc1MzcgYW5kIFx1NzUzN1x1NjAyNy5cbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgIGNvbnN0IG91dDogUmFuZ2VFbnRyeVtdID0gW107XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgZW50cmllcykge1xuICAgICAgICBjb25zdCBjID0gZS5hcHBsaWVzVG8/LlswXT8uY29kaW5nWzBdPy5jb2RlO1xuICAgICAgICBpZiAoIWMgfHwgc2Vlbi5oYXMoYykpIGNvbnRpbnVlO1xuICAgICAgICBzZWVuLmFkZChjKTtcbiAgICAgICAgb3V0LnB1c2goZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uZSA9IHBhcnNlUmFuZ2UocmF3UmFuZ2UsIHVuaXQpO1xuICByZXR1cm4gb25lID8gW29uZV0gOiBbXTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcmVmZXJlbmNlLXJhbmdlIHRleHQgaW50byBhIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cnkuXG4gKlxuICogU3RyYXRlZ3kgaW4gb3JkZXI6XG4gKiAgIDEuIFwiW2xvd11baGlnaF1cIiBicmFja2V0ZWQgZm9ybWF0IFx1MjAxNCBOSEkncyBjYW5vbmljYWwgc2hhcGUuXG4gKiAgIDIuIFwiMy44OS0yNi44XCIgLyBcIjMuODl+MjYuOFwiIGRhc2ggcmFuZ2UuXG4gKiAgIDMuIFwiPiA0MFwiIC8gXCI8IDAuNVwiIHNpbmdsZS1zaWRlZC5cbiAqICAgNC4gUXVhbGl0YXRpdmUgKFwiTmVnYXRpdmVcIiwgXCJBTSA4OjAwIDYuMi0xOS40XCIpIFx1MjAxNCB0ZXh0LW9ubHkuXG4gKlxuICogU2V4LXN0cmF0aWZpZWQgc2hhcGVzIGdvIHRocm91Z2ggcGFyc2VSYW5nZU11bHRpLiBSZXR1cm5zIG51bGwgb25seVxuICogZm9yIGVtcHR5IGlucHV0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSYW5nZShyYXdSYW5nZTogc3RyaW5nLCB1bml0OiBzdHJpbmcpOiBSYW5nZUVudHJ5IHwgbnVsbCB7XG4gIGNvbnN0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoKHJhd1JhbmdlIHx8IFwiXCIpLnRyaW0oKSk7XG4gIGlmICghcykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGVudHJ5OiBSYW5nZUVudHJ5ID0geyB0ZXh0OiByYXdSYW5nZSB9O1xuXG4gIGNvbnN0IG0gPSBzLm1hdGNoKFJSX0xPV0hJR0hfQlJBQ0tFVFMpO1xuICBpZiAobSkge1xuICAgIGNvbnN0IGxvID0gKG1bMV0gPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IGhpID0gKG1bMl0gPz8gXCJcIikudHJpbSgpO1xuICAgIGZvciAoY29uc3QgW3NpZGUsIHNpZGVWYWxdIG9mIFtcbiAgICAgIFtcImxvd1wiLCBsb10sXG4gICAgICBbXCJoaWdoXCIsIGhpXSxcbiAgICBdIGFzIGNvbnN0KSB7XG4gICAgICBpZiAoIXNpZGVWYWwgfHwgc2lkZVZhbCA9PT0gXCJcdTcxMjFcIiB8fCBzaWRlVmFsID09PSBcIlx1N0E3QVx1NzY3RFwiKSBjb250aW51ZTtcblxuICAgICAgLy8gMS4gUGxhaW4gZmxvYXRcbiAgICAgIGNvbnN0IGFzRmxvYXQgPSB0cnlQYXJzZUZsb2F0KHNpZGVWYWwpO1xuICAgICAgaWYgKGFzRmxvYXQgIT09IG51bGwpIHtcbiAgICAgICAgZW50cnlbc2lkZV0gPSBtYWtlUXVhbnRpdHkoYXNGbG9hdCwgdW5pdCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyAyLiBEYXNoIHJhbmdlIFx1MjAxNCBtZWFuaW5nZnVsIG9ubHkgZm9yIGBsb3dgIHNsb3Q7IHNwbGl0cyBpbnRvIGxvdytoaWdoLlxuICAgICAgY29uc3QgZG0gPSBzaWRlVmFsLm1hdGNoKFJSX0RBU0hfUkFOR0UpO1xuICAgICAgaWYgKGRtICYmIHNpZGUgPT09IFwibG93XCIgJiYgZW50cnkuaGlnaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkbVsxXSEpO1xuICAgICAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZG1bMl0hKTtcbiAgICAgICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYxLCB1bml0KTtcbiAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYyLCB1bml0KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAzLiBDb21wYXJhdG9yIChcdTIyNjc2MCwgPD0wLjA0IGV0Yy4pXG4gICAgICBjb25zdCBjbSA9IHNpZGVWYWwubWF0Y2goUlJfQ09NUEFSQVRPUik7XG4gICAgICBpZiAoY20pIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21bMl0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBvcCA9IGNtWzFdO1xuICAgICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA0LiBcIk5vcm1hbCAoIFggKVwiIC8gXCJOb25yZWFjdGl2ZSAoIFggKVwiIFx1MjAxNCBYIGlzIHRoZSBjdXRvZmYgKGhpZ2ggYm91bmQpLlxuICAgICAgY29uc3QgcW0gPSBzaWRlVmFsLm1hdGNoKFJSX1FVQUxJVEFUSVZFX1BBUkVOKTtcbiAgICAgIGlmIChxbSkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChxbVsyXSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgY29uc3QgZGFzaE1hdGNoID0gcy5tYXRjaChSUl9EQVNIX1JBTkdFKTtcbiAgaWYgKGRhc2hNYXRjaCkge1xuICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkYXNoTWF0Y2hbMV0hKTtcbiAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZGFzaE1hdGNoWzJdISk7XG4gICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodjEsIHVuaXQpO1xuICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2MiwgdW5pdCk7XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIGNvbnN0IGNtcE1hdGNoID0gcy5tYXRjaChSUl9DT01QQVJBVE9SKTtcbiAgaWYgKGNtcE1hdGNoKSB7XG4gICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21wTWF0Y2hbMl0hKTtcbiAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgb3AgPSBjbXBNYXRjaFsxXTtcbiAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICAvLyBGYWxsIHRocm91Z2g6IHF1YWxpdGF0aXZlIG9yIGNvbXBsZXggXHUyMDE0IHRleHQtb25seSBpcyBGSElSLWNvcnJlY3QuXG4gIHJldHVybiBlbnRyeTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHRyeVBhcnNlUXVhbnRpdHkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogUGFyc2UgXCI+IDQwLjBcIiAvIFwiPDAuMDEwXCIgLyBcIjEsMjM0LjVcIiBcdTIxOTIgRkhJUiBRdWFudGl0eSB3aXRoIGNvbXBhcmF0b3IuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiB0aGUgcmVzaWR1YWwgYWZ0ZXIgc3RyaXBwaW5nIGEgY29tcGFyYXRvciBzdGlsbFxuICogaXNuJ3QgbnVtZXJpYyBcdTIwMTQgY2FsbGVyIGZhbGxzIGJhY2sgdG8gdmFsdWVTdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cnlQYXJzZVF1YW50aXR5KFxuICByYXdWYWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgdW5pdDogc3RyaW5nLFxuKTogUXVhbnRpdHkgfCBudWxsIHtcbiAgaWYgKHJhd1ZhbHVlID09PSBudWxsIHx8IHJhd1ZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aChTdHJpbmcocmF3VmFsdWUpLnRyaW0oKSk7XG4gIGxldCBjb21wYXJhdG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3QgY20gPSBzLm1hdGNoKENPTVBBUkFUT1JfUkUpO1xuICBpZiAoY20pIHtcbiAgICBjb21wYXJhdG9yID0gY21bMV0gPz8gbnVsbDtcbiAgICBzID0gKGNtWzJdID8/IFwiXCIpLnRyaW0oKTtcbiAgfVxuICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChzLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdWN1bUNvZGUgPSB0b1VjdW0odW5pdCk7XG4gIGNvbnN0IHF0eTogUXVhbnRpdHkgPSB7XG4gICAgdmFsdWU6IHYsXG4gICAgc3lzdGVtOiBVQ1VNX1NZU1RFTSxcbiAgfTtcbiAgLy8gUXVhbnRpdHkudW5pdCAoaHVtYW4tcmVhZGFibGUpIGtlZXBzIHRoZSBvcmlnaW5hbCBOSEkgbGFiZWwgc28gdXNlcnNcbiAgLy8gc3RpbGwgc2VlICdcdUZGMDUnIG9yICdtRXEvTCcgcmF3LiBRdWFudGl0eS5jb2RlIGlzIHN0cmljdCBVQ1VNIG1hY2hpbmVcbiAgLy8gY29kZS4gRHJvcCB1bml0IGRpc3BsYXkgd2hlbiBlbXB0eSBzbyB3ZSBkb24ndCBlbWl0IFwidW5pdFwiOiBcIlwiLlxuICBpZiAodW5pdCkge1xuICAgIHF0eS51bml0ID0gdW5pdDtcbiAgfVxuICBpZiAodWN1bUNvZGUgIT09IG51bGwpIHtcbiAgICBxdHkuY29kZSA9IHVjdW1Db2RlO1xuICB9XG4gIGlmIChjb21wYXJhdG9yKSB7XG4gICAgcXR5LmNvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICB9XG4gIHJldHVybiBxdHk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8vIENoZWNrIHdoZXRoZXIgYSBzaW5nbGUgTE9JTkNfTUFQIGtleSBtYXRjaGVzIHRoZSBsYWIncyBjb21iaW5lZFxuLy8gKGNvZGUgKyBkaXNwbGF5KSBzdHJpbmcuIFR3byBydWxlczpcbi8vXG4vLyAxLiBBU0NJSSBrZXlzOiBgXFxiPGtleT5cXGJgIFx1MjAxNCB3b3JkIGJvdW5kYXJpZXMgb24gQk9USCBzaWRlcy4gVGhlXG4vLyAgICBuby10cmFpbGluZy1ib3VuZGFyeSBzZW1hbnRpYyBvZiB0aGUgb2xkZXIgYFxcYjxrZXk+YCBtYXRjaGVyXG4vLyAgICBjYXVzZWQgc2hvcnQga2V5cyBsaWtlIFwiaGJcIiAoSGVtb2dsb2JpbikgdG8gaW5jb3JyZWN0bHkgbWF0Y2hcbi8vICAgIGxvbmdlciB0ZXJtcyBsaWtlIFwiaGJzYWdcIiAoSEJzQWcpIGFuZCBcInBob3NwaGF0ZVwiIChtYXRjaGVkIGJ5XG4vLyAgICBcInBoXCIpLiBSZXF1aXJpbmcgYW4gZW5kIGJvdW5kYXJ5IG1lYW5zIFwiaGJcIiBvbmx5IG1hdGNoZXMgd2hlblxuLy8gICAgaXQgc3RhbmRzIGFzIGl0cyBvd24gd29yZC5cbi8vXG4vLyAyLiBDSksgLyBub24tQVNDSUkga2V5czogcGxhaW4gc3Vic3RyaW5nIGluY2x1ZGVzKCkuIFxcYiBkb2Vzbid0XG4vLyAgICBzZW1hbnRpY2FsbHkgd29yayBmb3IgQ0pLIChubyB3b3JkLWNoYXJhY3RlciBjbGFzcyBjb25jZXB0KS5cbmZ1bmN0aW9uIF9rZXl3b3JkTWF0Y2hlcyhrZXk6IHN0cmluZywgY29tYmluZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBrID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gIGlmIChpc0FzY2lpT25seShrZXkpKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrKX1cXFxcYmApLnRlc3QoY29tYmluZWQpO1xuICB9XG4gIHJldHVybiBjb21iaW5lZC5pbmNsdWRlcyhrKTtcbn1cblxuLy8gUGljayB0aGUgTE9OR0VTVCBtYXRjaGluZyBrZXkgZnJvbSB0aGUgdGFibGUsIG5vdCB0aGUgZmlyc3QuIEF2b2lkc1xuLy8gdGhlIHNhbWUgYnVnIGZhbWlseSBmcm9tIGEgc2Vjb25kIGFuZ2xlOiBoeXBoZW5hdGVkIGtleXMgbGlrZVxuLy8gXCJsZGwtY2hvbGVzdGVyb2xcIiBzaGFyZSBhIGBcXGIuLi5cXGJgIGJvdW5kYXJ5IGF0IHRoZSBoeXBoZW4sIHNvIFwibGRsXCJcbi8vICgzIGNoYXJzKSBhbHNvIG1hdGNoZXMgYSBcImxkbC1jaG9sZXN0ZXJvbFwiIHN0cmluZy4gTG9uZ2VzdC1tYXRjaFxuLy8gbWFrZXMgdGhlIG1vcmUgc3BlY2lmaWMga2V5IHdpbiByZWdhcmRsZXNzIG9mIGluc2VydGlvbiBvcmRlciwgc29cbi8vIHRoZSBicml0dGxlIFwibG9uZyBtdXN0IGFwcGVhciBiZWZvcmUgc2hvcnRcIiBjb21tZW50cyBzY2F0dGVyZWRcbi8vIHRocm91Z2ggTE9JTkNfTUFQIGJlY29tZSB1bm5lY2Vzc2FyeS5cbmZ1bmN0aW9uIF9maW5kTG9uZ2VzdE1hdGNoKFxuICBjb21iaW5lZDogc3RyaW5nLFxuICB0YWJsZTogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbik6IHN0cmluZyB8IG51bGwge1xuICBsZXQgYmVzdExvaW5jOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgbGV0IGJlc3RLZXlMZW4gPSAwO1xuICBmb3IgKGNvbnN0IFtrZXksIGxvaW5jXSBvZiBPYmplY3QuZW50cmllcyh0YWJsZSkpIHtcbiAgICBpZiAoa2V5Lmxlbmd0aCA+IGJlc3RLZXlMZW4gJiYgX2tleXdvcmRNYXRjaGVzKGtleSwgY29tYmluZWQpKSB7XG4gICAgICBiZXN0TG9pbmMgPSBsb2luYztcbiAgICAgIGJlc3RLZXlMZW4gPSBrZXkubGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYmVzdExvaW5jO1xufVxuXG4vKipcbiAqIFJldHVybiBwcmltYXJ5IExPSU5DIGZvciB0aGlzIGxhYi4gUGFuZWwtYXdhcmUgbG9va3VwOlxuICogICBBLiBTaW5nbGUtdGVzdCBOSEkgY29kZSBcdTIxOTIgdXNlIE5ISV9UT19MT0lOQyBkaXJlY3RseS5cbiAqICAgQi4gUGFuZWwgY29kZSBPUiB1bmtub3duIGNvZGUgXHUyMTkyIHdhbGsgTE9JTkNfTUFQIGJ5IGRpc3BsYXkga2V5d29yZFxuICogICAgICAobG9uZ2VzdC1rZXkgbWF0Y2ggd2lucywgYm90aC1zaWRlIHdvcmQgYm91bmRhcmllcyBlbmZvcmNlZCkuXG4gKiAgIEMuIEZhbGxiYWNrOiBwYW5lbC1sZXZlbCBMT0lOQyBmcm9tIE5ISV9UT19MT0lOQyBpZiBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9pbmMoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gQS4gU2luZ2xlLXRlc3QgTkhJIGNvZGUgd2lucyBvdXRyaWdodC5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMgJiYgIURJU1BMQVlfRklSU1RfQ09ERVMuaGFzKGNvZGUpKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG5cbiAgY29uc3QgY29tYmluZWQgPSBgJHtjb2RlfSAke2Rpc3BsYXl9YC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIEIxLiBQYW5lbC1zcGVjaWZpYyBrZXl3b3JkIG1hcCBydW5zIEJFRk9SRSB0aGUgZ2xvYmFsIG9uZS5cbiAgaWYgKGNvZGUgaW4gUEFORUxfTE9JTkNfTUFQKSB7XG4gICAgY29uc3QgaGl0ID0gX2ZpbmRMb25nZXN0TWF0Y2goY29tYmluZWQsIFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpO1xuICAgIGlmIChoaXQpIHJldHVybiBoaXQ7XG4gIH1cblxuICAvLyBCLiBEaXNwbGF5LWtleXdvcmQgc2VhcmNoLlxuICBjb25zdCBoaXQgPSBfZmluZExvbmdlc3RNYXRjaChjb21iaW5lZCwgTE9JTkNfTUFQKTtcbiAgaWYgKGhpdCkgcmV0dXJuIGhpdDtcblxuICAvLyBDLiBQYW5lbCBjb2RlIHdpdGggbm8gcmVjb2duaXNlZCBpdGVtIGRpc3BsYXkgXHUyMTkyIGZhbGwgYmFjay5cbiAgaWYgKGNvZGUgJiYgY29kZSBpbiBOSElfVE9fTE9JTkMpIHtcbiAgICByZXR1cm4gTkhJX1RPX0xPSU5DW2NvZGVdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIE9ic2VydmF0aW9uLmNvZGUuY29kaW5nW10gbGlzdC5cbiAqIFByaW9yaXR5OiBMT0lOQyBcdTIxOTIgTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgbG9jYWwgZmFsbGJhY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvZGluZ3MoXG4gIGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGRpc3BsYXk6IHN0cmluZyxcbiAgbG9pbmM6IHN0cmluZyB8IG51bGwsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10ge1xuICBjb25zdCBjb2RpbmdzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10gPSBbXTtcbiAgaWYgKGxvaW5jKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsXG4gICAgICBjb2RlOiBsb2luYyxcbiAgICAgIGRpc3BsYXk6IExPSU5DX0RJU1BMQVlbbG9pbmNdID8/IGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgY29uc3QgY29kZVN0ciA9IChjb2RlID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKGNvZGVTdHIgJiYgTkhJX0xBQl9DT0RFX1JFLnRlc3QoY29kZVN0cikpIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLk5ISV9NRURJQ0FMX09SREVSX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyLFxuICAgICAgZGlzcGxheSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERSxcbiAgICAgIGNvZGU6IGNvZGVTdHIgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGNvZGluZ3M7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBJbnRlcnByZXRhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU5URVJQX1NZUyA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92My1PYnNlcnZhdGlvbkludGVycHJldGF0aW9uXCI7XG5cbmZ1bmN0aW9uIGludGVycENvZGluZyhjb2RlOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICByZXR1cm4geyBzeXN0ZW06IElOVEVSUF9TWVMsIGNvZGUsIGRpc3BsYXkgfTtcbn1cblxuY29uc3QgSU5URVJQX1RBQkxFOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgaGlnaDogW1wiSFwiLCBcIkhpZ2hcIl0sXG4gIGxvdzogW1wiTFwiLCBcIkxvd1wiXSxcbiAgbm9ybWFsOiBbXCJOXCIsIFwiTm9ybWFsXCJdLFxuICBjcml0aWNhbDogW1wiQUFcIiwgXCJDcml0aWNhbCBhYm5vcm1hbFwiXSxcbiAgYWJub3JtYWw6IFtcIkFcIiwgXCJBYm5vcm1hbFwiXSxcbiAgcG9zaXRpdmU6IFtcIlBPU1wiLCBcIlBvc2l0aXZlXCJdLFxuICBuZWdhdGl2ZTogW1wiTkVHXCIsIFwiTmVnYXRpdmVcIl0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWFwSW50ZXJwcmV0YXRpb24oXG4gIGludGVycDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgY29uc3Qga2V5ID0gKGludGVycCA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBlbnRyeSA9IElOVEVSUF9UQUJMRVtrZXldO1xuICBpZiAoIWVudHJ5KSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGludGVycENvZGluZyhlbnRyeVswXSwgZW50cnlbMV0pO1xufVxuXG4vLyBQb3NpdGl2ZSBtYXJrZXJzIFx1MjAxNCBcInRoaXMgaXMgZGV0ZWN0ZWQgLyBhYm5vcm1hbFwiLlxuY29uc3QgUE9TX01BUktFUlMgPVxuICAvXlxccyooPzpwb3NpdGl2ZXxwb3N8cmVhY3RpdmV8ZGV0ZWN0ZWR8YWJub3JtYWx8cHJlc2VudHx0cmFjZXxbMS00XT9cXHMqXFwrKD86XFxzKltcXCtcXC1dKSopXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG4vLyBOZWdhdGl2ZSBtYXJrZXJzIFx1MjAxNCBleHBsaWNpdGx5IG5vcm1hbC9hYnNlbnQuXG5jb25zdCBORUdfTUFSS0VSUyA9XG4gIC9eXFxzKig/Om5lZ2F0aXZlfG5lZ3xub25yZWFjdGl2ZXxub25bLVxcc10/cmVhY3RpdmV8bm90Wy1cXHNdP2RldGVjdGVkfG5kfGFic2VudHxub25lfG5vcm1hbHwwfFstXHUyMDE0XHUyMDEzXSspXFxzKig/OlxcKC4qXFwpKT9cXHMqJC9pO1xuXG5mdW5jdGlvbiBjbGFzc2lmeVF1YWxpdGF0aXZlKHRleHQ6IHVua25vd24pOiBcInBvc1wiIHwgXCJuZWdcIiB8IG51bGwge1xuICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IFN0cmluZyh0ZXh0KS50cmltKCk7XG4gIGlmIChzLnN0YXJ0c1dpdGgoXCJbXCIpICYmIHMuZW5kc1dpdGgoXCJdXCIpKSB7XG4gICAgcyA9IHMuc2xpY2UoMSwgLTEpLnRyaW0oKTtcbiAgfVxuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBpZiAoTkVHX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwibmVnXCI7XG4gIGlmIChQT1NfTUFSS0VSUy50ZXN0KHMpKSByZXR1cm4gXCJwb3NcIjtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgdmFsdWVSYXc6IHN0cmluZyxcbiAgcXR5OiBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgcnI6IFJhbmdlRW50cnkgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIC8vIDEuIE51bWVyaWMgcGF0aC5cbiAgaWYgKHF0eSAmJiB0eXBlb2YgcXR5LnZhbHVlID09PSBcIm51bWJlclwiICYmIHJyKSB7XG4gICAgY29uc3QgdiA9IHF0eS52YWx1ZTtcbiAgICBjb25zdCBsbyA9IHJyLmxvdz8udmFsdWU7XG4gICAgY29uc3QgaGkgPSByci5oaWdoPy52YWx1ZTtcbiAgICBpZiAodHlwZW9mIGhpID09PSBcIm51bWJlclwiICYmIHYgPiBoaSkgcmV0dXJuIGludGVycENvZGluZyhcIkhcIiwgXCJIaWdoXCIpO1xuICAgIGlmICh0eXBlb2YgbG8gPT09IFwibnVtYmVyXCIgJiYgdiA8IGxvKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTFwiLCBcIkxvd1wiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiIHx8IHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyAyLiBRdWFsaXRhdGl2ZSBwYXRoLlxuICBjb25zdCB2YWxLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZSh2YWx1ZVJhdyk7XG4gIGNvbnN0IHJlZlRleHQgPSBycj8udGV4dCA/PyBcIlwiO1xuICBjb25zdCByZWZLaW5kID0gY2xhc3NpZnlRdWFsaXRhdGl2ZShyZWZUZXh0KTtcbiAgaWYgKHZhbEtpbmQgPT09IG51bGwpIHJldHVybiBudWxsO1xuICBpZiAocmVmS2luZCA9PT0gXCJuZWdcIikge1xuICAgIGlmICh2YWxLaW5kID09PSBcInBvc1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiQVwiLCBcIkFibm9ybWFsXCIpO1xuICAgIGlmICh2YWxLaW5kID09PSBcIm5lZ1wiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTlwiLCBcIk5vcm1hbFwiKTtcbiAgfVxuICByZXR1cm4gdmFsS2luZCA9PT0gXCJwb3NcIiA/IGludGVycENvZGluZyhcIlBPU1wiLCBcIlBvc2l0aXZlXCIpIDogaW50ZXJwQ29kaW5nKFwiTkVHXCIsIFwiTmVnYXRpdmVcIik7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBDYW5vbmljYWwgbGFiIGtleSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTEFCX1NZTk9OWU1TOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBEaWFiZXRlc1xuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXHU3Q0Q2XHU1MzE2XHU4ODQwXHU4MjcyXHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCJIQkExQ1wiLFxuICBcIkdMWUNBVEVEIEhFTU9HTE9CSU5cIjogXCJIQkExQ1wiLFxuICBIQkExQzogXCJIQkExQ1wiLFxuICBBMUM6IFwiSEJBMUNcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcIkZBU1RJTkcgR0xVQ09TRVwiOiBcIkdMVUNPU0VfRkFTVElOR1wiLFxuICBcdTg0NjFcdTg0MDRcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBcdTg4NDBcdTdDRDY6IFwiR0xVQ09TRVwiLFxuICBHTFVDT1NFOiBcIkdMVUNPU0VcIixcbiAgLy8gQ0JDXG4gIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJXQkNcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIldCQ1wiLFxuICBXQkM6IFwiV0JDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3ODogXCJSQkNcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIlJCQ1wiLFxuICBSQkM6IFwiUkJDXCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCJIRU1PR0xPQklOXCIsXG4gIEhFTU9HTE9CSU46IFwiSEVNT0dMT0JJTlwiLFxuICBIR0I6IFwiSEVNT0dMT0JJTlwiLFxuICBcdTg4NDBcdTVCQjlcdTdBNERcdTZCRDQ6IFwiSEVNQVRPQ1JJVFwiLFxuICBIRU1BVE9DUklUOiBcIkhFTUFUT0NSSVRcIixcbiAgSENUOiBcIkhFTUFUT0NSSVRcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIlBMQVRFTEVUXCIsXG4gIFBMQVRFTEVUOiBcIlBMQVRFTEVUXCIsXG4gIFBMVDogXCJQTEFURUxFVFwiLFxuICAvLyBDQkMgaW5kaWNlcyAoMTAtY2hhciBhbmQgNy1jaGFyIENKSyBmb3JtcyBiZWF0IGJhcmUgXHU3RDA1XHU4ODQwXHU3NDAzKVxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjBcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjA6IFwiTUNIXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1NkZDM1x1NUVBNjogXCJNQ0hDXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1OUFENFx1N0E0RDogXCJNQ1ZcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzXHU1MjA2XHU1RTAzXHU1QkVDXHU1RUE2OiBcIlJEV1wiLFxuICBNQ1Y6IFwiTUNWXCIsXG4gIE1DSDogXCJNQ0hcIixcbiAgTUNIQzogXCJNQ0hDXCIsXG4gIFJEVzogXCJSRFdcIixcbiAgLy8gQ0JDIGRpZmZlcmVudGlhbFxuICBcdTU1RENcdTRFMkRcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiTkVVVFJPUEhJTFwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTkxNzhcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiRU9TSU5PUEhJTFwiLFxuICBcdTU1RENcdTlFN0NcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiQkFTT1BISUxcIixcbiAgXHU2RENCXHU1REY0XHU3NDAzOiBcIkxZTVBIT0NZVEVcIixcbiAgXHU1NUFFXHU2ODM4XHU3NDAzOiBcIk1PTk9DWVRFXCIsXG4gIEVPU0lOT1BISUxTOiBcIkVPU0lOT1BISUxcIixcbiAgRU9TSU5PUEhJTDogXCJFT1NJTk9QSElMXCIsXG4gIE5FVVRST1BISUxTOiBcIk5FVVRST1BISUxcIixcbiAgTkVVVFJPUEhJTDogXCJORVVUUk9QSElMXCIsXG4gIEJBU09QSElMUzogXCJCQVNPUEhJTFwiLFxuICBCQVNPUEhJTDogXCJCQVNPUEhJTFwiLFxuICBMWU1QSE9DWVRFUzogXCJMWU1QSE9DWVRFXCIsXG4gIExZTVBIT0NZVEU6IFwiTFlNUEhPQ1lURVwiLFxuICBNT05PQ1lURVM6IFwiTU9OT0NZVEVcIixcbiAgTU9OT0NZVEU6IFwiTU9OT0NZVEVcIixcbiAgLy8gTGlwaWQgXHUyMDE0IExETC9IREwgbXVzdCBwcmVjZWRlIGJhcmUgQ0hPTEVTVEVST0wuXG4gIFwiTERMIENIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ0hPTEVTVEVST0xcIjogXCJMRExfQ1wiLFxuICBcIkhETCBDSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFwiSERMLUNIT0xFU1RFUk9MXCI6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiTERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkhETF9DXCIsXG4gIFx1ODg0MFx1NkUwNVx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJULUNIT0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlRPVEFMIENIT0xFU1RFUk9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTEVTVEVST0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgQ0hPTDogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcdTRFMDlcdTkxNzhcdTc1MThcdTZDQjlcdTkxNkY6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFRSSUdMWUNFUklERTogXCJUUklHTFlDRVJJREVcIixcbiAgXCJIREwtQ1wiOiBcIkhETF9DXCIsXG4gIEhETDogXCJIRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiSERMX0NcIixcbiAgXCJMREwtQyhESVJFQ1QpXCI6IFwiTERMX0NcIixcbiAgXCJMREwtQ1wiOiBcIkxETF9DXCIsXG4gIExETDogXCJMRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0Q6IFwiTERMX0NcIixcbiAgLy8gUmVuYWwgXHUyMDE0IHVyaW5lIGNyZWF0aW5pbmUgdmFyaWFudHMgYmVmb3JlIHNlcnVtLlxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlVSSU5FIENSRUFUSU5JTkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQShVKVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBLVVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVS1DUkVBXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiQ1JFQVRJTklORVwiLFxuICBcdTgwOENcdTkxNTBcdTkxNzg6IFwiQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoQilcIjogXCJDUkVBVElOSU5FXCIsXG4gIENSRUFUSU5JTkU6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JUTjogXCJDUkVBVElOSU5FXCIsXG4gIEVHRlI6IFwiRUdGUlwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiQlVOXCIsXG4gIEJVTjogXCJCVU5cIixcbiAgXHU1QzNGXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlVSSU5FX1BIXCIsXG4gIFx1NUMzRlx1NkRCMlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiUEhcIixcbiAgXHU1QzNGXHU5MTc4OiBcIlVSSUNfQUNJRFwiLFxuICBcIlVSSUMgQUNJRFwiOiBcIlVSSUNfQUNJRFwiLFxuICBVUklDX0FDSUQ6IFwiVVJJQ19BQ0lEXCIsXG4gIC8vIExpdmVyXG4gIEFTVDogXCJBU1RcIixcbiAgQUxUOiBcIkFMVFwiLFxuICBHT1Q6IFwiQVNUXCIsXG4gIEdQVDogXCJBTFRcIixcbiAgXHU4MUJEXHU3RDA1XHU3RDIwOiBcIkJJTElSVUJJTlwiLFxuICBCSUxJUlVCSU46IFwiQklMSVJVQklOXCIsXG4gIFx1NzY3RFx1ODZDQlx1NzY3RDogXCJBTEJVTUlOXCIsXG4gIEFMQlVNSU46IFwiQUxCVU1JTlwiLFxuICAvLyBDYXJkaWFjXG4gIFx1NUZDM1x1ODA4Q1x1NjVDQlx1OEY0OVx1ODZDQlx1NzY3RDogXCJUUk9QT05JTlwiLFxuICBUUk9QT05JTjogXCJUUk9QT05JTlwiLFxuICBCTlA6IFwiQk5QXCIsXG4gIFx1NUZDM1x1ODFERjogXCJUUk9QT05JTlwiLFxuICAvLyBUaHlyb2lkXG4gIFx1NzUzMlx1NzJDMFx1ODE3QVx1NTIzQVx1NkZDMFx1N0QyMDogXCJUU0hcIixcbiAgVFNIOiBcIlRTSFwiLFxuICBcdTZFMzhcdTk2RTJcdTc1MzJcdTcyQzBcdTgxN0FcdTdEMjA6IFwiRlJFRV9UNFwiLFxuICBcIkZSRUUgVDRcIjogXCJGUkVFX1Q0XCIsXG4gIEZUNDogXCJGUkVFX1Q0XCIsXG4gIC8vIE1pc2NcbiAgQ1x1NTNDRFx1NjFDOVx1NjAyN1x1ODZDQlx1NzY3RDogXCJDUlBcIixcbiAgXCJDLVJFQUNUSVZFIFBST1RFSU5cIjogXCJDUlBcIixcbiAgQ1JQOiBcIkNSUFwiLFxuICBcIkhTLUNSUFwiOiBcIkhTX0NSUFwiLFxuICBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUY6IFwiUFNBXCIsXG4gIFBTQTogXCJQU0FcIixcbiAgXHU5NDM1XHU4NkNCXHU3NjdEOiBcIkZFUlJJVElOXCIsXG4gIEZFUlJJVElOOiBcIkZFUlJJVElOXCIsXG4gIFx1ODQ0OVx1OTE3ODogXCJGT0xBVEVcIixcbiAgRk9MQVRFOiBcIkZPTEFURVwiLFxuICBcdTdEQURcdTc1MUZcdTdEMjBCMTI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVQgQjEyXCI6IFwiVklUQU1JTl9CMTJcIixcbiAgXCJWSVRBTUlOIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFx1NzZBRVx1OENFQVx1N0QyMDogXCJDT1JUSVNPTFwiLFxuICBDT1JUSVNPTDogXCJDT1JUSVNPTFwiLFxuICBcdTY4ODVcdTZCRDI6IFwiUlBSXCIsXG4gIFJQUjogXCJSUFJcIixcbiAgXHU5NkIxXHU3NDAzXHU4M0NDXHU2Mjk3XHU1MzlGOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBDUllQQUc6IFwiQ1JZUFRPQ09DQ0FMX0FHXCIsXG4gIFx1ODg0MFx1NkMyODogXCJBTU1PTklBXCIsXG4gIEFNTU9OSUE6IFwiQU1NT05JQVwiLFxuICBcdTUxRERcdTg4NDBcdTkxNzZcdTUzOUZcdTY2NDJcdTk1OTM6IFwiUFRcIixcbiAgQVBUVDogXCJBUFRUXCIsXG4gIElOUjogXCJJTlJcIixcbn07XG5cbi8vIFByZS1zb3J0IGtleXMgbG9uZ2VzdC1maXJzdCBzbyBsb25nZXIvbW9yZS1zcGVjaWZpYyBtYXRjaGVzIHdpbi5cbmNvbnN0IExBQl9TWU5PTllNX0tFWVNfU09SVEVEID0gT2JqZWN0LmtleXMoTEFCX1NZTk9OWU1TKS5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbExhYktleShkaXNwbGF5OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFkaXNwbGF5KSByZXR1cm4gXCJcIjtcbiAgY29uc3QgcyA9IGRpc3BsYXkudHJpbSgpO1xuICBpZiAoIXMpIHJldHVybiBcIlwiO1xuICBjb25zdCBzVXBwZXIgPSBzLnRvVXBwZXJDYXNlKCk7XG4gIGZvciAoY29uc3Qga2V5IG9mIExBQl9TWU5PTllNX0tFWVNfU09SVEVEKSB7XG4gICAgY29uc3Qga3UgPSBrZXkudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa3UpKSB7XG4gICAgICAvLyBMZWFkaW5nIHdvcmQtYm91bmRhcnkgb25seSBcdTIwMTQgXCJBU1RcIiBpbnNpZGUgXCJESUFTVE9MSUNcIiBzaG91bGQgbm90IG1hdGNoLlxuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrdSl9YCkudGVzdChzVXBwZXIpKSB7XG4gICAgICAgIHJldHVybiBMQUJfU1lOT05ZTVNba2V5XSE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzVXBwZXIuaW5jbHVkZXMoa3UpKSB7XG4gICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnRyaW0oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFBhbmVsIGdyb3VwaW5nIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGNqa0NoYXJzKHM6IHN0cmluZyk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICAgIGlmIChjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmKSBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGlzRW5nbGlzaERvbWluYW50KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgbGF0aW4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIHtcbiAgICBjb25zdCBjcCA9IGNoLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGNwIDwgMTI4ICYmIC9bQS1aYS16XS8udGVzdChjaCkpIGxhdGluKys7XG4gIH1cbiAgcmV0dXJuIGxhdGluID49IDIgJiYgY2prQ2hhcnMocykgPT09IDA7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAodjogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGxldCBzID0gU3RyaW5nKHYpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXChbXildKlxcKS9nLCBcIlwiKS50cmltKCk7XG4gIHMgPSBzLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgcyA9IFN0cmluZyh2YWx1ZSkudHJpbSgpO1xuICByZXR1cm4gcyAhPT0gXCJcIiAmJiBzICE9PSBcIlx1MjAxNFwiICYmIHMgIT09IFwiLVwiICYmIHMgIT09IFwiTi9BXCIgJiYgcyAhPT0gXCJudWxsXCI7XG59XG5cbmNvbnN0IE1FQU5JTkdGVUxfSU5URVJQUyA9IG5ldyBTZXQoW1xuICBcIm5vcm1hbFwiLFxuICBcImFibm9ybWFsXCIsXG4gIFwiaGlnaFwiLFxuICBcImxvd1wiLFxuICBcImNyaXRpY2FsXCIsXG4gIFwicG9zaXRpdmVcIixcbiAgXCJuZWdhdGl2ZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIGRlZHVwZVBhbmVsSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5VmFsdWUgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgayA9IG5vcm1hbGl6ZVZhbHVlRm9yRGVkdXAoaXQudmFsdWUpO1xuICAgIGNvbnN0IGdyb3VwID0gYnlWYWx1ZS5nZXQoayk7XG4gICAgaWYgKGdyb3VwKSBncm91cC5wdXNoKGl0KTtcbiAgICBlbHNlIGJ5VmFsdWUuc2V0KGssIFtpdF0pO1xuICB9XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgZ3JvdXAgb2YgYnlWYWx1ZS52YWx1ZXMoKSkge1xuICAgIGlmIChncm91cC5sZW5ndGggPT09IDEpIHtcbiAgICAgIG91dC5wdXNoKGdyb3VwWzBdISk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgY2prSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGNqa0NoYXJzKFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpID49IDIpO1xuICAgIGNvbnN0IGVuSXRlbXMgPSBncm91cC5maWx0ZXIoKGcpID0+IGlzRW5nbGlzaERvbWluYW50KFN0cmluZyhnLmRpc3BsYXkgPz8gXCJcIikpKTtcbiAgICBpZiAoY2prSXRlbXMubGVuZ3RoID4gMCAmJiBlbkl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIG91dC5wdXNoKGVuSXRlbXNbMF0hKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0LnB1c2goLi4uZ3JvdXApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zOiBhbnlbXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgcmF3IG9mIHJhd0l0ZW1zKSB7XG4gICAgaWYgKCFyYXcgfHwgdHlwZW9mIHJhdyAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gICAgaWYgKGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheSwgcmF3LmNvZGUgfHwgXCJcIikpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICAgIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICAgIGNvbnN0IGhhc01lYW5pbmdmdWxJbnRlcnAgPSBNRUFOSU5HRlVMX0lOVEVSUFMuaGFzKGludGVycCk7XG4gICAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgY29udGludWU7XG4gICAgb3V0LnB1c2gocmF3KTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBkZWR1cGVDcm9zc0Zvcm1hdChpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3Qgb3JkZXJDb2RlID0gKGl0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nID0+XG4gICAgKChpdC5vcmRlcl9jb2RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG5cbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcbiAgbGV0IGlkeENvdW50ZXIgPSAwO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICBjb25zdCB2ID0gU3RyaW5nKGl0ZW0udmFsdWUgPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHVuaXQgPSAoKGl0ZW0udW5pdCBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgICBpZiAoIXYpIHtcbiAgICAgIGJ5S2V5LnNldChgX19ub19kZWR1cF9ffCR7aWR4Q291bnRlcisrfWAsIGl0ZW0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IFtcbiAgICAgIChpdGVtLmRhdGUgYXMgc3RyaW5nKSA/PyBcIlwiLFxuICAgICAgdi50b0xvd2VyQ2FzZSgpLFxuICAgICAgdW5pdC50b0xvd2VyQ2FzZSgpLFxuICAgICAgb3JkZXJDb2RlKGl0ZW0pLFxuICAgIF0uam9pbihcInxcIik7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBieUtleS5nZXQoa2V5KTtcbiAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvLyBQcmVmZXIgdGhlIHJvdyB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGNsaW5pY2FsIHJlYWRzKS5cbiAgICBsZXQgcHJpbWFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBsZXQgc2Vjb25kYXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIGlmIChjamtDaGFycyhpdGVtLmRpc3BsYXkgPz8gXCJcIikgPCBjamtDaGFycyhleGlzdGluZy5kaXNwbGF5ID8/IFwiXCIpKSB7XG4gICAgICBwcmltYXJ5ID0gaXRlbTtcbiAgICAgIHNlY29uZGFyeSA9IGV4aXN0aW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmltYXJ5ID0gZXhpc3Rpbmc7XG4gICAgICBzZWNvbmRhcnkgPSBpdGVtO1xuICAgIH1cbiAgICBjb25zdCBtZXJnZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgW1wib3JkZXJfY29kZVwiLCBcIm9yZGVyX25hbWVcIiwgXCJob3NwaXRhbFwiLCBcImNvZGVcIl0pIHtcbiAgICAgIGlmICghbWVyZ2VkW2ZdICYmIHNlY29uZGFyeVtmXSkgbWVyZ2VkW2ZdID0gc2Vjb25kYXJ5W2ZdO1xuICAgIH1cbiAgICBieUtleS5zZXQoa2V5LCBtZXJnZWQpO1xuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKGJ5S2V5LnZhbHVlcygpKTtcbn1cblxuaW50ZXJmYWNlIEJwQ29tcG9uZW50IHtcbiAgbG9pbmM6IHN0cmluZztcbiAgZGlzcGxheTogc3RyaW5nO1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0OiBzdHJpbmc7XG4gIGludGVycHJldGF0aW9uX3RleHQ6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gY29tYmluZUJwSXRlbXMoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxcbiAgICBzdHJpbmcsXG4gICAgeyBzeXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT47IGRpYXN0b2xpYz86IFJlY29yZDxzdHJpbmcsIGFueT4gfVxuICA+KCk7XG4gIGNvbnN0IHBhc3NUaHJvdWdoOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGRpc3AgPSBTdHJpbmcoaXQuZGlzcGxheSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGtleSA9IGAke2l0LmRhdGUgPz8gXCJcIn18JHtpdC5ob3NwaXRhbCA/PyBcIlwifWA7XG4gICAgaWYgKGRpc3AuaW5jbHVkZXMoXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5zeXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIGlmIChkaXNwLmluY2x1ZGVzKFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpKSB7XG4gICAgICBjb25zdCB2ID0gYnlLZXkuZ2V0KGtleSkgPz8ge307XG4gICAgICB2LmRpYXN0b2xpYyA9IGl0O1xuICAgICAgYnlLZXkuc2V0KGtleSwgdik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhc3NUaHJvdWdoLnB1c2goaXQpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgcGFydHMgb2YgYnlLZXkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBzID0gcGFydHMuc3lzdG9saWM7XG4gICAgY29uc3QgZCA9IHBhcnRzLmRpYXN0b2xpYztcbiAgICBjb25zdCBwcmltYXJ5ID0gcyA/PyBkO1xuICAgIGlmICghcHJpbWFyeSkgY29udGludWU7XG4gICAgY29uc3QgY29tcG9uZW50czogQnBDb21wb25lbnRbXSA9IFtdO1xuICAgIGNvbnN0IHRyeUFkZCA9IChzcmM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQsIGxvaW5jOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFzcmMpIHJldHVybjtcbiAgICAgIGNvbnN0IHZhbCA9IHNyYy52YWx1ZTtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBcIlwiIHx8IHZhbCA9PT0gXCItXCIgfHwgdmFsID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgICBjb25zdCBudW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcodmFsKS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG51bSkpIHJldHVybjtcbiAgICAgIGNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgIGxvaW5jLFxuICAgICAgICBkaXNwbGF5LFxuICAgICAgICB2YWx1ZTogbnVtLFxuICAgICAgICB1bml0OiBzcmMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgaW50ZXJwcmV0YXRpb25fdGV4dDogc3JjLnJlZmVyZW5jZV9yYW5nZSB8fCBcIlwiLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB0cnlBZGQocywgXCI4NDgwLTZcIiwgXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKTtcbiAgICB0cnlBZGQoZCwgXCI4NDYyLTRcIiwgXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBjb25zdCBjb21iaW5lZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4ucHJpbWFyeSB9O1xuICAgIGNvbWJpbmVkLmRpc3BsYXkgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfY29kZSA9IFwiXCI7XG4gICAgY29tYmluZWQub3JkZXJfbmFtZSA9IFwiQmxvb2QgUHJlc3N1cmVcIjtcbiAgICBjb21iaW5lZC5jYXRlZ29yeSA9IFwidml0YWwtc2lnbnNcIjtcbiAgICBjb21iaW5lZC5icF9jb21wb25lbnRzID0gY29tcG9uZW50cztcbiAgICBjb21iaW5lZC5icF9wYW5lbF9sb2luYyA9IFwiODUzNTQtOVwiO1xuICAgIGNvbWJpbmVkLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIGNvbWJpbmVkLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgcGFzc1Rocm91Z2gucHVzaChjb21iaW5lZCk7XG4gIH1cblxuICByZXR1cm4gcGFzc1Rocm91Z2g7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBTcGVjaW1lbiBpbmZlcmVuY2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IFNQRUNJTUVOX1JVTEVTOiBSZWFkb25seUFycmF5PFtSZWdFeHAsIHN0cmluZ10+ID0gW1xuICBbL1x1NUMzRnx1cmluZXx1cmluYWx5L2ksIFwiVXJpbmVcIl0sXG4gIFsvXHU3Q0RFfFx1NEZCRlx1NkY1Qlx1ODg0MHxzdG9vbHxmZWNhbHxmYWVjYWx8b2NjdWx0XFxzKmJsb29kL2ksIFwiU3Rvb2xcIl0sXG4gIFsvXHU3NUYwfHNwdXR1bS9pLCBcIlNwdXR1bVwiXSxcbiAgWy9cdTgxNjZcdTgxMEFcdTZEQjJ8Y3NmfGNlcmVicm9zcGluYWwvaSwgXCJDZXJlYnJvc3BpbmFsIGZsdWlkXCJdLFxuICBbL1x1ODBGOFx1NkMzNHxwbGV1cmFsL2ksIFwiUGxldXJhbCBmbHVpZFwiXSxcbiAgWy9cdTgxNzlcdTZDMzR8YXNjaXRlc3xwZXJpdG9uZWFsL2ksIFwiUGVyaXRvbmVhbCBmbHVpZFwiXSxcbiAgWy9cdTk2NzBcdTkwNTN8XHU2MkI5XHU3MjQ3fGNlcnZpY2FsfHBhcFxccypzbWVhcnx2YWdpbmFsL2ksIFwiQ2VydmljYWwvVmFnaW5hbFwiXSxcbiAgWy9cdTk1RENcdTdCQzBcdTZEQjJ8c3lub3ZpYWx8am9pbnRcXHMqZmx1aWQvaSwgXCJTeW5vdmlhbCBmbHVpZFwiXSxcbiAgWy9cdTdGOEFcdTZDMzR8YW1uaW90aWMvaSwgXCJBbW5pb3RpYyBmbHVpZFwiXSxcbiAgWy9cdTlBQThcdTlBRDN8Ym9uZVxccyptYXJyb3cvaSwgXCJCb25lIG1hcnJvd1wiXSxcbl07XG5cbmZ1bmN0aW9uIGluZmVyU3BlY2ltZW4oLi4uaGludHM6IEFycmF5PHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ+KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGJsb2IgPSBoaW50c1xuICAgIC5maWx0ZXIoKGgpOiBoIGlzIHN0cmluZyA9PiBCb29sZWFuKGgpKVxuICAgIC5qb2luKFwiIFwiKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIWJsb2IpIHJldHVybiBudWxsO1xuICBmb3IgKGNvbnN0IFtwYXR0ZXJuLCBsYWJlbF0gb2YgU1BFQ0lNRU5fUlVMRVMpIHtcbiAgICBpZiAocGF0dGVybi50ZXN0KGJsb2IpKSByZXR1cm4gbGFiZWw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNYXAgc2luZ2xlIE9ic2VydmF0aW9uIChub24tZ3JvdXBlZCBwYXRoKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIGNvZGUpKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICBpZiAoIWhhc1ZhbHVlICYmICFoYXNNZWFuaW5nZnVsSW50ZXJwKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSwgcmF3LmRhdGUgPz8gXCJcIik7XG4gIGNvbnN0IGxvaW5jID0gZmluZExvaW5jKGNvZGUsIGRpc3BsYXkpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IFwibGFib3JhdG9yeVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgLy8gU291cmNlLXByb2dyYW1tZSB0YWcgXHUyMDE0IHNldCB3aGVuIHRoZSBhZGFwdGVyIHB1bGxlZCB0aGlzIG9ic2VydmF0aW9uXG4gIC8vIG91dCBvZiBhIHNwZWNpZmljIE5ISSBzY3JlZW5pbmcgcHJvZ3JhbW1lIChlLmcuIGFkYXB0QWR1bHRQcmV2ZW50aXZlXG4gIC8vIHNldHMgc291cmNlX3Byb2dyYW09XCJhZHVsdC1wcmV2ZW50aXZlXCIpLiBTdXJmYWNlZCB2aWEgT2JzZXJ2YXRpb24uXG4gIC8vIG1ldGEudGFnIHNvIGRvd25zdHJlYW0gU01BUlQgYXBwcyBjYW4gZmlsdGVyIGJ5IF90YWcgd2l0aG91dCBuZWVkaW5nXG4gIC8vIHRvIGtub3cgYWJvdXQgb3VyIGludGVybmFsIGZpZWxkIG5hbWVzLlxuICBpZiAocmF3LnNvdXJjZV9wcm9ncmFtKSB7XG4gICAgcmVzb3VyY2UubWV0YS50YWcgPSBbXG4gICAgICB7XG4gICAgICAgIHN5c3RlbTogXCJodHRwOi8vbmhpLWZoaXItYnJpZGdlL3NvdXJjZS1wcm9ncmFtXCIsXG4gICAgICAgIGNvZGU6IFN0cmluZyhyYXcuc291cmNlX3Byb2dyYW0pLFxuICAgICAgfSxcbiAgICBdO1xuICB9XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG5cbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCByciA9IHBhcnNlUmFuZ2UoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnIpIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gW3JyXTtcbiAgfVxuXG4gIGNvbnN0IGludGVycENvZGluZ1Jlc3VsdCA9XG4gICAgbWFwSW50ZXJwcmV0YXRpb24oaW50ZXJwKSB8fFxuICAgIGRlcml2ZUludGVycHJldGF0aW9uKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCA/IFN0cmluZyh2YWx1ZSkgOiBcIlwiLFxuICAgICAgcmVzb3VyY2UudmFsdWVRdWFudGl0eSBhcyBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgICAgIChyZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSBhcyBSYW5nZUVudHJ5W10gfCB1bmRlZmluZWQpPy5bMF0sXG4gICAgKTtcbiAgaWYgKGludGVycENvZGluZ1Jlc3VsdCkge1xuICAgIHJlc291cmNlLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbaW50ZXJwQ29kaW5nUmVzdWx0XSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJ1aWxkIG9ic2VydmF0aW9uIHdpdGhpbiBhIHBhbmVsICh3aXRoIGNhbm9uaWNhbCBsYWIga2V5IGlkKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gYnVpbGRPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbiAgcGFuZWxDb2RlOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIC8vIEJQIHBhbmVsOiBwcmVidWlsdCBieSBjb21iaW5lQnBJdGVtcy5cbiAgaWYgKHJhdy5icF9jb21wb25lbnRzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJvYnNcIiwgXCJCUF9QQU5FTFwiLCBkYXRlLCBob3NwaXRhbCk7XG4gICAgY29uc3QgY29tcG9uZW50UmVzb3VyY2VzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYyBvZiByYXcuYnBfY29tcG9uZW50cyBhcyBCcENvbXBvbmVudFtdKSB7XG4gICAgICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgICAgICB2YWx1ZTogYy52YWx1ZSxcbiAgICAgICAgdW5pdDogYy51bml0IHx8IFwibW1IZ1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiB0b1VjdW0oYy51bml0KSA/PyBcIm1tW0hnXVwiLFxuICAgICAgfTtcbiAgICAgIGNvbXBvbmVudFJlc291cmNlcy5wdXNoKHtcbiAgICAgICAgY29kZToge1xuICAgICAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIiwgY29kZTogYy5sb2luYywgZGlzcGxheTogYy5kaXNwbGF5IH1dLFxuICAgICAgICAgIHRleHQ6IGMuZGlzcGxheSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWVRdWFudGl0eTogcXR5LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGJwT2JzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgICBpZDogb2JzSWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgY29kZTogXCJ2aXRhbC1zaWduc1wiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgICAgICAgY29kZTogcmF3LmJwX3BhbmVsX2xvaW5jID8/IFwiODUzNTQtOVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IFwiQmxvb2QgUHJlc3N1cmVcIixcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgY29tcG9uZW50OiBjb21wb25lbnRSZXNvdXJjZXMsXG4gICAgfTtcbiAgICBpZiAoZGF0ZSkgYnBPYnMuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtkYXRlfVQwMDowMDowMCswODowMGA7XG4gICAgaWYgKGhvc3BpdGFsKSBicE9icy5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgICByZXR1cm4gYnBPYnM7XG4gIH1cblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgY29kZSA9IChwYW5lbENvZGUgPyBTdHJpbmcocGFuZWxDb2RlKSA6IFwiXCIpIHx8IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCBjYW5vbmljYWwgPSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgfHwgZGlzcGxheTtcbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIGNhbm9uaWNhbCwgcmF3LmRhdGUgPz8gXCJcIiwgcmF3Lmhvc3BpdGFsID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCBjYXRDb2RlID0gcmF3LmNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiO1xuICBjb25zdCBDQVRfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBsYWJvcmF0b3J5OiBcIkxhYm9yYXRvcnlcIixcbiAgICBcInZpdGFsLXNpZ25zXCI6IFwiVml0YWwgU2lnbnNcIixcbiAgICBpbWFnaW5nOiBcIkltYWdpbmdcIixcbiAgICBwcm9jZWR1cmU6IFwiUHJvY2VkdXJlXCIsXG4gICAgXCJzb2NpYWwtaGlzdG9yeVwiOiBcIlNvY2lhbCBIaXN0b3J5XCIsXG4gICAgc3VydmV5OiBcIlN1cnZleVwiLFxuICAgIGV4YW06IFwiRXhhbVwiLFxuICAgIHRoZXJhcHk6IFwiVGhlcmFweVwiLFxuICAgIGFjdGl2aXR5OiBcIkFjdGl2aXR5XCIsXG4gIH07XG4gIGNvbnN0IGNhdERpc3BsYXkgPVxuICAgIENBVF9ESVNQTEFZW2NhdENvZGVdID8/IGNhdENvZGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYXRDb2RlLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgaWQ6IG9ic0lkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICBjYXRlZ29yeTogW1xuICAgICAge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogY2F0Q29kZSxcbiAgICAgICAgICAgIGRpc3BsYXk6IGNhdERpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IGJ1aWxkQ29kaW5ncyhjb2RlLCBkaXNwbGF5LCBsb2luYyksXG4gICAgICB0ZXh0OiBkaXNwbGF5IHx8IFwiVW5rbm93biBMYWJcIixcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuaG9zcGl0YWwpIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IHJhdy5ob3NwaXRhbCB9XTtcbiAgY29uc3Qgc3BlY2ltZW4gPSBpbmZlclNwZWNpbWVuKHJhdy5vcmRlcl9uYW1lLCByYXcuZGlzcGxheSwgcmF3LmNvZGUpO1xuICBpZiAoc3BlY2ltZW4pIHJlc291cmNlLnNwZWNpbWVuID0geyBkaXNwbGF5OiBzcGVjaW1lbiB9O1xuXG4gIGNvbnN0IGhhc1ZhbHVlID0gaXNNZWFuaW5nZnVsVmFsdWUodmFsdWUpO1xuICBpZiAoaGFzVmFsdWUpIHtcbiAgICBjb25zdCBxdHkgPSB0cnlQYXJzZVF1YW50aXR5KFN0cmluZyh2YWx1ZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChxdHkpIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgPSBxdHk7XG4gICAgZWxzZSByZXNvdXJjZS52YWx1ZVN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBpZiAocmF3LnJlZmVyZW5jZV9yYW5nZSkge1xuICAgIGNvbnN0IHJycyA9IHBhcnNlUmFuZ2VNdWx0aShTdHJpbmcocmF3LnJlZmVyZW5jZV9yYW5nZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChycnMubGVuZ3RoID4gMCkgcmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgPSBycnM7XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBHcm91cCBieSAob3JkZXJfY29kZSwgZGF0ZSwgaG9zcGl0YWwpIFx1MjE5MiBEUiArIE9ic2VydmF0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZ3JvdXBCeU9yZGVyQ29kZShcbiAgY2xlYW5lZDogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGxldCB3b3JraW5nID0gZGVkdXBlQ3Jvc3NGb3JtYXQoY2xlYW5lZCk7XG4gIHdvcmtpbmcgPSBjb21iaW5lQnBJdGVtcyh3b3JraW5nKTtcblxuICBjb25zdCBncm91cHMgPSBuZXcgTWFwPHN0cmluZywgUmVjb3JkPHN0cmluZywgYW55PltdPigpO1xuICBjb25zdCBrZXlNZXRhID0gbmV3IE1hcDxzdHJpbmcsIHsgZ3JvdXBLZXlDb2RlOiBzdHJpbmc7IGRhdGU6IHN0cmluZzsgaG9zcGl0YWw6IHN0cmluZyB9PigpO1xuICBmb3IgKGNvbnN0IHJhdyBvZiB3b3JraW5nKSB7XG4gICAgY29uc3QgZ3JvdXBLZXlDb2RlID0gcmF3Lm9yZGVyX2NvZGUgfHwgcmF3LmNvZGUgfHwgcmF3LmRpc3BsYXkgfHwgXCJcIjtcbiAgICBjb25zdCBkYXRlID0gcmF3LmRhdGUgPz8gXCJcIjtcbiAgICBjb25zdCBob3NwaXRhbCA9IHJhdy5ob3NwaXRhbCA/PyBcIlwiO1xuICAgIGNvbnN0IGtleSA9IGAke2dyb3VwS2V5Q29kZX18JHtkYXRlfXwke2hvc3BpdGFsfWA7XG4gICAgY29uc3QgYXJyID0gZ3JvdXBzLmdldChrZXkpO1xuICAgIGlmIChhcnIpIGFyci5wdXNoKHJhdyk7XG4gICAgZWxzZSB7XG4gICAgICBncm91cHMuc2V0KGtleSwgW3Jhd10pO1xuICAgICAga2V5TWV0YS5zZXQoa2V5LCB7IGdyb3VwS2V5Q29kZTogU3RyaW5nKGdyb3VwS2V5Q29kZSksIGRhdGUsIGhvc3BpdGFsIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgW2tleSwgaXRlbXNdIG9mIGdyb3Vwcy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBtZXRhID0ga2V5TWV0YS5nZXQoa2V5KSE7XG4gICAgY29uc3QgZGVkdXBlZCA9IGRlZHVwZVBhbmVsSXRlbXMoaXRlbXMpO1xuXG4gICAgY29uc3Qgb2JzUmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgICBjb25zdCBzZWVuT2JzSWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBpdCBvZiBkZWR1cGVkKSB7XG4gICAgICBjb25zdCBvYnMgPSBidWlsZE9ic2VydmF0aW9uKGl0LCBwYXRpZW50SWQsIG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICAgIGlmICghb2JzKSBjb250aW51ZTtcbiAgICAgIGlmIChzZWVuT2JzSWRzLmhhcyhvYnMuaWQpKSBjb250aW51ZTtcbiAgICAgIHNlZW5PYnNJZHMuYWRkKG9icy5pZCk7XG4gICAgICBvYnNSZXNvdXJjZXMucHVzaChvYnMpO1xuICAgIH1cbiAgICBpZiAob2JzUmVzb3VyY2VzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG5cbiAgICAvLyBCUCBwYW5lbDogZW1pdCBPYnNlcnZhdGlvbiBkaXJlY3RseSAobm8gRFIgd3JhcHBlcikuXG4gICAgY29uc3QgaXNCcFBhbmVsID0gZGVkdXBlZC5ldmVyeSgoaXQpID0+IGl0LmJwX2NvbXBvbmVudHMgfHwgaXQuZGlzcGxheSA9PT0gXCJCbG9vZCBQcmVzc3VyZVwiKTtcbiAgICBpZiAoaXNCcFBhbmVsKSB7XG4gICAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JkZXJOYW1lID0gZGVkdXBlZC5maW5kKChpdCkgPT4gaXQub3JkZXJfbmFtZSk/Lm9yZGVyX25hbWUgPz8gbnVsbDtcbiAgICBjb25zdCBtZW1iZXJLZXlzID0gQXJyYXkuZnJvbShcbiAgICAgIG5ldyBTZXQoZGVkdXBlZC5maWx0ZXIoKGl0KSA9PiBpdC5kaXNwbGF5KS5tYXAoKGl0KSA9PiBjYW5vbmljYWxMYWJLZXkoaXQuZGlzcGxheSkpKSxcbiAgICApLnNvcnQoKTtcbiAgICBjb25zdCBwYW5lbFNpZ25hdHVyZSA9IG1lbWJlcktleXMuam9pbihcIixcIikgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICBjb25zdCBkcklkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIkRSXCIsIHBhbmVsU2lnbmF0dXJlLCBtZXRhLmRhdGUsIG1ldGEuaG9zcGl0YWwpO1xuXG4gICAgbGV0IHBhbmVsVGl0bGU6IHN0cmluZztcbiAgICBpZiAoZGVkdXBlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IHNpbmdsZURpc3BsYXkgPSBkZWR1cGVkWzBdIS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBwYW5lbFRpdGxlID0gc2luZ2xlRGlzcGxheSB8fCBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZWxUaXRsZSA9IG9yZGVyTmFtZSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGRyQ29kZVN5c3RlbSA9IE5ISV9MQUJfQ09ERV9SRS50ZXN0KFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgPz8gXCJcIilcbiAgICAgID8gc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX0xBQl9DT0RFO1xuXG4gICAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICByZXNvdXJjZVR5cGU6IFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICAgICAgaWQ6IGRySWQsXG4gICAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICAgIGNhdGVnb3J5OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjItMDA3NFwiLFxuICAgICAgICAgICAgICBjb2RlOiBcIkxBQlwiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIkxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjb2RlOiB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogZHJDb2RlU3lzdGVtLFxuICAgICAgICAgICAgY29kZTogU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKSB8fCBcIlVOS05PV05cIixcbiAgICAgICAgICAgIGRpc3BsYXk6IHBhbmVsVGl0bGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogcGFuZWxUaXRsZSxcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgICAgcmVzdWx0OiBvYnNSZXNvdXJjZXMubWFwKChvKSA9PiAoeyByZWZlcmVuY2U6IGBPYnNlcnZhdGlvbi8ke28uaWR9YCB9KSksXG4gICAgfTtcbiAgICBpZiAobWV0YS5kYXRlKSBkci5lZmZlY3RpdmVEYXRlVGltZSA9IGAke21ldGEuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChtZXRhLmhvc3BpdGFsKSBkci5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBtZXRhLmhvc3BpdGFsIH1dO1xuXG4gICAgb3V0LnB1c2goZHIpO1xuICAgIG91dC5wdXNoKC4uLm9ic1Jlc291cmNlcyk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChyYXdJdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgY2xlYW5lZCA9IGZpbHRlckxhYlJvd3MocmF3SXRlbXMpO1xuICByZXR1cm4gZ3JvdXBCeU9yZGVyQ29kZShjbGVhbmVkLCBwYXRpZW50SWQpO1xufVxuIiwgIi8qKlxuICogUHJvY2VkdXJlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcHJvY2VkdXJlLnB5YC4gUmV0dXJucyBudWxsIGZvciBsaXN0LXBhZ2VcbiAqIHJvd3MgbGFja2luZyBub3RlL2JvZHlfc2l0ZSBcdTIwMTQgdGhlIGFsdGVybmF0aXZlIGlzIHRoZSBTTUFSVCBhcHAgc2hvd2luZ1xuICogMjUgXCJwcm9jZWR1cmVzXCIgY2FsbGVkIFwiTXljb2JhY3RlcmlhIGN1bHR1cmVcIiAvIFwiVmFnaW5hbCB1bHRyYXNvdW5kXCJcbiAqIC8gZXRjLiB3aGljaCBhcmUgY2xpbmljYWxseSB3cm9uZy5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwiaWNkXCIpKSByZXR1cm4gc3lzdGVtcy5JQ0RfMTBfUENTO1xuICByZXR1cm4gc3lzdGVtcy5ISVNfTE9DQUxfUFJPQ0VEVVJFX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQcm9jZWR1cmUoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IG5vdGUgPSAoKHJhdy5ub3RlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICBjb25zdCBib2R5U2l0ZSA9ICgocmF3LmJvZHlfc2l0ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFub3RlICYmICFib2R5U2l0ZSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBQcm9jZWR1cmVcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiUHJvY2VkdXJlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcuZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiByYXcuc3RhdHVzID8/IFwiY29tcGxldGVkXCIsXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lZERhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAoYm9keVNpdGUpIHtcbiAgICByZXNvdXJjZS5ib2R5U2l0ZSA9IFt7IHRleHQ6IGJvZHlTaXRlIH1dO1xuICB9XG4gIGlmIChub3RlKSB7XG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IG5vdGUgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIG1hcHBlciBkaXNwYXRjaCB0YWJsZXMuXG4gKlxuICogQ29uc3VtZWQgYnkgYmFja2VuZCdzIGAvc3luYy91cGxvYWQtc3RydWN0dXJlZGAgYW5kIHRoZSBleHRlbnNpb24nc1xuICogbG9jYWwtbW9kZSBidW5kbGUgYXNzZW1ibGVyIHNvIGJvdGggcHJvZHVjZSBpZGVudGljYWwgRkhJUiBvdXRwdXQuXG4gKi9cblxuaW1wb3J0IHsgbWFwQWxsZXJneUludG9sZXJhbmNlIH0gZnJvbSBcIi4vYWxsZXJneVwiO1xuaW1wb3J0IHsgbWFwQ29uZGl0aW9uIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBtYXBEaWFnbm9zdGljUmVwb3J0IH0gZnJvbSBcIi4vZGlhZ25vc3RpYy1yZXBvcnRcIjtcbmltcG9ydCB7IG1hcEVuY291bnRlciB9IGZyb20gXCIuL2VuY291bnRlclwiO1xuaW1wb3J0IHsgbWFwTWVkaWNhdGlvblJlcXVlc3QsIG1hcE1lZGljYXRpb25zRGVkdXAgfSBmcm9tIFwiLi9tZWRpY2F0aW9uXCI7XG5pbXBvcnQgeyBtYXBPYnNlcnZhdGlvbiwgbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCB9IGZyb20gXCIuL29ic2VydmF0aW9uXCI7XG5pbXBvcnQgeyBtYXBQcm9jZWR1cmUgfSBmcm9tIFwiLi9wcm9jZWR1cmVcIjtcblxuZXhwb3J0IHR5cGUgUGVyUm93TWFwcGVyID0gKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKSA9PiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbDtcblxuZXhwb3J0IHR5cGUgR3JvdXBNYXBwZXIgPSAoaXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZykgPT4gUmVjb3JkPHN0cmluZywgYW55PltdO1xuXG4vKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgKHBlci1yb3cgbWFwcGVyLCBKU09OIGxpc3Qga2V5IGluc2lkZSBMTE0gcmVzcG9uc2UpLlxuICogVXNlZCBieSB0aGUgTExNIGZhbGxiYWNrIHBhdGggYWZ0ZXIgZXh0cmFjdGlvbjsgdGhlIHN0cnVjdHVyZWQgcGF0aFxuICogYWxzbyBjb25zdWx0cyBpdCBmb3IgcGVyLXJvdyByZXNvdXJjZSB0eXBlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IExJU1RfSEFORExFUlM6IFJlY29yZDxzdHJpbmcsIFtQZXJSb3dNYXBwZXIsIHN0cmluZ10+ID0ge1xuICBvYnNlcnZhdGlvbnM6IFttYXBPYnNlcnZhdGlvbiwgXCJvYnNlcnZhdGlvbnNcIl0sXG4gIG1lZGljYXRpb25zOiBbbWFwTWVkaWNhdGlvblJlcXVlc3QsIFwibWVkaWNhdGlvbnNcIl0sXG4gIGNvbmRpdGlvbnM6IFttYXBDb25kaXRpb24sIFwiY29uZGl0aW9uc1wiXSxcbiAgYWxsZXJnaWVzOiBbbWFwQWxsZXJneUludG9sZXJhbmNlLCBcImFsbGVyZ2llc1wiXSxcbiAgZGlhZ25vc3RpY19yZXBvcnRzOiBbbWFwRGlhZ25vc3RpY1JlcG9ydCwgXCJkaWFnbm9zdGljX3JlcG9ydHNcIl0sXG4gIHByb2NlZHVyZXM6IFttYXBQcm9jZWR1cmUsIFwicHJvY2VkdXJlc1wiXSxcbiAgZW5jb3VudGVyczogW21hcEVuY291bnRlciwgXCJlbmNvdW50ZXJzXCJdLFxufTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIGdyb3VwLWF3YXJlIG1hcHBlciB0aGF0IHRha2VzIHRoZSBGVUxMIGxpc3QgYXQgb25jZS5cbiAqIFVzZWQgd2hlbiBjcm9zcy1yb3cgZ3JvdXBpbmcvZGVkdXAgaXMgcmVxdWlyZWQgKE5ISSBsYWIgcGFuZWxzLFxuICogXHU0RTJEXHU4MkYxIG1lZGljYXRpb24gXHU5NkQ5XHU4QTlFIGRlZHVwKS5cbiAqL1xuZXhwb3J0IGNvbnN0IEdST1VQX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBHcm91cE1hcHBlcj4gPSB7XG4gIG9ic2VydmF0aW9uczogbWFwT2JzZXJ2YXRpb25zR3JvdXBlZCxcbiAgbWVkaWNhdGlvbnM6IG1hcE1lZGljYXRpb25zRGVkdXAsXG59O1xuIiwgIi8qKlxuICogRW5jb3VudGVyIGxpbmtlciBcdTIwMTQgbWF0Y2ggcmVzb3VyY2VzIHRvIEVuY291bnRlcnMgYnkgKGhvc3BpdGFsLCBkYXRlKS5cbiAqXG4gKiBQdXJlIGZ1bmN0aW9uOiBtdXRhdGVzIGByZXNvdXJjZXNgIGluIHBsYWNlIHRvIGFkZCBgZW5jb3VudGVyYFxuICogcmVmZXJlbmNlcyB3aGVuIHRoZXJlJ3MgYW4gdW5hbWJpZ3VvdXMgbWF0Y2ggaW4gdGhlIGNhbmRpZGF0ZVxuICogRW5jb3VudGVyIGxpc3QuIFNhbWUgbG9naWMgYXMgdGhlIGJhY2tlbmQncyBEQi1jb3VwbGVkIHZlcnNpb24sXG4gKiBsaWZ0ZWQgb3V0IHNvIHRoZSBleHRlbnNpb24ncyBsb2NhbCBtb2RlIGNhbiBjYWxsIGl0IG9uIGFuXG4gKiBpbi1tZW1vcnkgYXJyYXkuXG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlSW50ZXJwcmV0YXRpb24gfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuXG5jb25zdCBFTkNPVU5URVJfTElOS0FCTEUgPSBuZXcgU2V0KFtcbiAgXCJPYnNlcnZhdGlvblwiLFxuICBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gIFwiRGlhZ25vc3RpY1JlcG9ydFwiLFxuICBcIlByb2NlZHVyZVwiLFxuICBcIkNvbmRpdGlvblwiLFxuICBcIkFsbGVyZ3lJbnRvbGVyYW5jZVwiLFxuXSk7XG5cbmZ1bmN0aW9uIHJlc291cmNlRGF0ZShyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgW1xuICAgIFwiZWZmZWN0aXZlRGF0ZVRpbWVcIixcbiAgICBcImF1dGhvcmVkT25cIixcbiAgICBcInBlcmZvcm1lZERhdGVUaW1lXCIsXG4gICAgXCJvbnNldERhdGVUaW1lXCIsXG4gICAgXCJyZWNvcmRlZERhdGVcIixcbiAgICBcImlzc3VlZFwiLFxuICBdKSB7XG4gICAgY29uc3QgdiA9IHJba2V5XTtcbiAgICBpZiAodikgcmV0dXJuIFN0cmluZyh2KS5zbGljZSgwLCAxMCk7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgb2YgW1wiZWZmZWN0aXZlUGVyaW9kXCIsIFwicGVyZm9ybWVkUGVyaW9kXCJdKSB7XG4gICAgY29uc3QgcGVyaW9kID0gcltrZXldO1xuICAgIGlmIChwZXJpb2QgJiYgdHlwZW9mIHBlcmlvZCA9PT0gXCJvYmplY3RcIiAmJiBwZXJpb2Quc3RhcnQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcocGVyaW9kLnN0YXJ0KS5zbGljZSgwLCAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG5mdW5jdGlvbiByZXNvdXJjZUhvc3BpdGFsKHI6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBmb3IgKGNvbnN0IHAgb2Ygci5wZXJmb3JtZXIgPz8gW10pIHtcbiAgICBjb25zdCBkID0gKHAgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBpZiAoZCkgcmV0dXJuIGQ7XG4gIH1cbiAgY29uc3QgcmVxID0gci5yZXF1ZXN0ZXIgPz8ge307XG4gIGlmIChyZXEgJiYgdHlwZW9mIHJlcSA9PT0gXCJvYmplY3RcIiAmJiByZXEuZGlzcGxheSkgcmV0dXJuIHJlcS5kaXNwbGF5O1xuICByZXR1cm4gXCJcIjtcbn1cblxuLyoqXG4gKiBEcm9wIEFNQiBFbmNvdW50ZXJzIHdob3NlIChob3NwaXRhbCwgc3RhcnRfZGF0ZSkgaXMgYWxyZWFkeSBjb3ZlcmVkXG4gKiBieSBhbiBJTVAgRW5jb3VudGVyJ3MgYWRtaXNzaW9uIGRheS4gTkhJIGVtaXRzIHRoZSBzYW1lIGlucGF0aWVudFxuICogc3RheSB0d2ljZSAoSUhLRTMzMDMgQU1CIGJpbGxpbmcgZW50cnkgKyBJSEtFMzMwOSBJTVAgZGV0YWlsKTsgdGhlXG4gKiBJTVAgb25lIGlzIGNhbm9uaWNhbCwgdGhlIEFNQiBpcyBhIGJpbGxpbmcgYXJ0ZWZhY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cEFkbWlzc2lvbkRheUFtYihcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBpbXBTdGFydHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgaWYgKChyLmNsYXNzID8/IHt9KS5jb2RlICE9PSBcIklNUFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKHIucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgaWYgKGhvc3AgJiYgc3RhcnQpIGltcFN0YXJ0cy5hZGQoYCR7aG9zcH0gJHtzdGFydH1gKTtcbiAgfVxuICBpZiAoaW1wU3RhcnRzLnNpemUgPT09IDApIHJldHVybiByZXNvdXJjZXM7XG4gIHJldHVybiByZXNvdXJjZXMuZmlsdGVyKChyKSA9PiB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlID09PSBcIkVuY291bnRlclwiICYmIChyLmNsYXNzID8/IHt9KS5jb2RlID09PSBcIkFNQlwiKSB7XG4gICAgICBjb25zdCBob3NwID0gKHIuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICAgIGlmIChpbXBTdGFydHMuaGFzKGAke2hvc3B9ICR7c3RhcnR9YCkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFkZCBgZW5jb3VudGVyYCByZWZlcmVuY2UgdG8gZWFjaCBsaW5rYWJsZSByZXNvdXJjZSB3aGVuIGl0c1xuICogKGhvc3BpdGFsLCBkYXRlKSBtYXRjaGVzIGV4YWN0bHkgT05FIEVuY291bnRlciBpbiBgY2FuZGlkYXRlc2AuXG4gKiBDb25zZXJ2YXRpdmUgXHUyMDE0IGxlYXZlcyBhbWJpZ3VvdXMgKDAgb3IgPjEgbWF0Y2gpIGNhc2VzIHVubGlua2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlua0VuY291bnRlcnNJblJlc291cmNlcyhcbiAgY2FuZGlkYXRlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoY2FuZGlkYXRlcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgY29uc3QgZXhhY3RJbmRleCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgY29uc3QgaW1wQnlIb3NwID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4+KCk7XG5cbiAgZm9yIChjb25zdCBlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICBpZiAoZS5yZXNvdXJjZVR5cGUgIT09IFwiRW5jb3VudGVyXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoZS5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoIWhvc3AgfHwgIXN0YXJ0KSBjb250aW51ZTtcbiAgICBjb25zdCBrZXkgPSBgJHtob3NwfSAke3N0YXJ0fWA7XG4gICAgY29uc3QgYXJyID0gZXhhY3RJbmRleC5nZXQoa2V5KSA/PyBbXTtcbiAgICBhcnIucHVzaChlLmlkKTtcbiAgICBleGFjdEluZGV4LnNldChrZXksIGFycik7XG4gICAgY29uc3QgY2xzID0gKGUuY2xhc3MgPz8ge30pLmNvZGUgPz8gXCJcIjtcbiAgICBpZiAoY2xzID09PSBcIklNUFwiKSB7XG4gICAgICBjb25zdCBlbmQgPSBTdHJpbmcoKGUucGVyaW9kID8/IHt9KS5lbmQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGVuZCkge1xuICAgICAgICBjb25zdCBsaXN0ID0gaW1wQnlIb3NwLmdldChob3NwKSA/PyBbXTtcbiAgICAgICAgbGlzdC5wdXNoKFtzdGFydCwgZW5kLCBlLmlkXSk7XG4gICAgICAgIGltcEJ5SG9zcC5zZXQoaG9zcCwgbGlzdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGV4YWN0SW5kZXguc2l6ZSA9PT0gMCAmJiBpbXBCeUhvc3Auc2l6ZSA9PT0gMCkgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoIUVOQ09VTlRFUl9MSU5LQUJMRS5oYXMoci5yZXNvdXJjZVR5cGUpKSBjb250aW51ZTtcbiAgICBpZiAoci5lbmNvdW50ZXIgfHwgci5jb250ZXh0KSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gcmVzb3VyY2VIb3NwaXRhbChyKTtcbiAgICBjb25zdCBkYXRlID0gcmVzb3VyY2VEYXRlKHIpO1xuICAgIGlmICghaG9zcCB8fCAhZGF0ZSkgY29udGludWU7XG4gICAgY29uc3QgbWF0Y2hlczogc3RyaW5nW10gPSBbLi4uKGV4YWN0SW5kZXguZ2V0KGAke2hvc3B9ICR7ZGF0ZX1gKSA/PyBbXSldO1xuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChjb25zdCBbc3RhcnQsIGVuZCwgZWlkXSBvZiBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdKSB7XG4gICAgICAgIGlmIChzdGFydCA8PSBkYXRlICYmIGRhdGUgPD0gZW5kKSBtYXRjaGVzLnB1c2goZWlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoICE9PSAxKSBjb250aW51ZTtcbiAgICByLmVuY291bnRlciA9IHsgcmVmZXJlbmNlOiBgRW5jb3VudGVyLyR7bWF0Y2hlc1swXX1gIH07XG4gIH1cbn1cblxuLyoqXG4gKiBXaGVuIGFuIE9ic2VydmF0aW9uIGNhcnJpZXMgbXVsdGlwbGUgcmVmZXJlbmNlUmFuZ2UgZW50cmllcyB0YWdnZWRcbiAqIHdpdGggYGFwcGxpZXNUb1sqXS5jb2RpbmcuY29kZWAgaW4ge21hbGUsIGZlbWFsZX0sIHBpY2sgdGhlIG9uZSB0aGF0XG4gKiBtYXRjaGVzIHRoZSBwYXRpZW50J3MgZ2VuZGVyIGFuZCByZS1kZXJpdmUgaW50ZXJwcmV0YXRpb24gYWdhaW5zdCBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzKFxuICBwYXRpZW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCxcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiB2b2lkIHtcbiAgaWYgKCFwYXRpZW50KSByZXR1cm47XG4gIGNvbnN0IGdlbmRlciA9IFN0cmluZyhwYXRpZW50LmdlbmRlciA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoZ2VuZGVyICE9PSBcIm1hbGVcIiAmJiBnZW5kZXIgIT09IFwiZmVtYWxlXCIpIHJldHVybjtcblxuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIk9ic2VydmF0aW9uXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHJyczogYW55W10gPSByLnJlZmVyZW5jZVJhbmdlID8/IFtdO1xuICAgIGlmIChycnMubGVuZ3RoIDwgMikgY29udGludWU7XG5cbiAgICBsZXQgbWF0Y2g6IGFueSA9IG51bGw7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBycnMpIHtcbiAgICAgIGZvciAoY29uc3QgYXAgb2YgZW50cnkuYXBwbGllc1RvID8/IFtdKSB7XG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBhcC5jb2RpbmcgPz8gW10pIHtcbiAgICAgICAgICBpZiAoU3RyaW5nKGMuY29kZSA/PyBcIlwiKS50b0xvd2VyQ2FzZSgpID09PSBnZW5kZXIpIHtcbiAgICAgICAgICAgIG1hdGNoID0gZW50cnk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaCkgYnJlYWs7XG4gICAgfVxuICAgIGlmICghbWF0Y2gpIGNvbnRpbnVlO1xuXG4gICAgci5yZWZlcmVuY2VSYW5nZSA9IFttYXRjaF07XG4gICAgY29uc3QgdmFsU3RyID1cbiAgICAgIFN0cmluZygoci52YWx1ZVF1YW50aXR5ID8/IHt9KS52YWx1ZSA/PyBcIlwiKSB8fCBTdHJpbmcoci52YWx1ZVN0cmluZyA/PyBcIlwiKTtcbiAgICBjb25zdCBuZXdJbnRlcnAgPSBkZXJpdmVJbnRlcnByZXRhdGlvbih2YWxTdHIsIHIudmFsdWVRdWFudGl0eSA/PyBudWxsLCBtYXRjaCk7XG4gICAgaWYgKG5ld0ludGVycCkge1xuICAgICAgci5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW25ld0ludGVycF0gfV07XG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBQYXRpZW50IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvcGF0aWVudC5weWAuIFNhbWUgcHVibGljIEFQSTpcbiAqICAgLSBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWUpIFx1MjAxNCBleHBvc2VkIGZvciB0ZXN0c1xuICogICAtIG1hcFBhdGllbnQocmF3KSBcdTIwMTQgbWFpbiBlbnRyeVxuICovXG5cbmltcG9ydCB7IGRlcml2ZVBhdGllbnRJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuXG4vLyBUYWl3YW4gbmF0aW9uYWwgSUQ6IDEgbGV0dGVyICsgOSBkaWdpdHMgKEExMjM0NTY3ODkpLiBVc2VkIHRvIGRlY2lkZVxuLy8gd2hldGhlciB0aGUgcG9wdXAtc3VwcGxpZWQgcGF0aWVudF9pZCBzaG91bGQgYmUgY29kZWQgdW5kZXIgdGhlXG4vLyBjYW5vbmljYWwgbmF0aW9uYWwtaWQgc3lzdGVtIG9yIGFzIGEgbG9jYWwgaG9zcGl0YWwgTVJOLlxuY29uc3QgVFdfTkFUSU9OQUxfSURfUkUgPSAvXltBLVpdWzEyXVxcZHs4fSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9va3NMaWtlVHdOYXRpb25hbElkKHZhbHVlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gIGlmICghdmFsdWUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIFRXX05BVElPTkFMX0lEX1JFLnRlc3QodmFsdWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUGF0aWVudChyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgcmF3SWQgPSBTdHJpbmcocmF3LmlkZW50aWZpZXIgPz8gcmF3LmlkID8/IFwidW5rbm93blwiKTtcbiAgLy8gRkhJUiBQYXRpZW50LmlkIGlzIHRoZSBoYXNoZWQvc2FsdGVkIGZvcm0uIFJlYWwgbmF0aW9uYWwgSUQgc3RheXNcbiAgLy8gb25seSBpbiBpZGVudGlmaWVyW10udmFsdWUgc28gYSBsZWFrZWQgQnVuZGxlIChvciBhIFNNQVJUIGFwcCB0b2tlblxuICAvLyBwYXlsb2FkIGNvbnRhaW5pbmcgcGF0aWVudF9pZCkgZG9lc24ndCBkaXNjbG9zZSBpdCB2aWEgZXZlcnlcbiAgLy8gc3ViamVjdC5yZWZlcmVuY2UuXG4gIGNvbnN0IHBhdGllbnRJZCA9IGRlcml2ZVBhdGllbnRJZChyYXdJZCk7XG5cbiAgLy8gVXNlIGA/P2AgKG5vdCBqdXN0IGRlZmF1bHQgYXJnKSBzbyBleHBsaWNpdCBudWxsIGZyb20gdGhlIExMTSBhbHNvXG4gIC8vIGZhbGxzIGJhY2suIExvY2FsIG1vZGVscyBzb21ldGltZXMgZW1pdCBudWxsIGluc3RlYWQgb2Ygb21pdHRpbmcuXG4gIC8vIFRoZSBjYWxsZXIgZGVjaWRlcyB3aGV0aGVyIGByYXcubmFtZWAgaXMgdGhlIHVzZXIncyByZWFsIG5hbWUgb3JcbiAgLy8gYWxyZWFkeS1tYXNrZWQgXHUyMDE0IG1hcFBhdGllbnQganVzdCB0cmFuc2NyaWJlcy4gTWFza2luZyBwb2xpY3kgbGl2ZXNcbiAgLy8gYXQgdGhlIFVJIC8gZXh0ZW5zaW9uIGxheWVyIChkcml2ZW4gYnkgdGhlIHVzZXItdG9nZ2xlYWJsZVxuICAvLyBgbWFza05hbWVFbmFibGVkYCBzZXR0aW5nKSBzbyB0aGUgc2FtZSBtYXBwZXIgaXMgY29ycmVjdCBmb3IgYm90aFxuICAvLyBcIlx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOCA9IHJlYWwgbmFtZVwiIGFuZCBcIlx1OTFBQlx1NzY0Mlx1NEVCQVx1NTRFMVx1NTkxQVx1NzVDNVx1NEVCQSA9IG1hc2tlZFwiIHdvcmtmbG93cy5cbiAgY29uc3QgbmFtZVRleHQgPSAocmF3Lm5hbWUgPz8gbnVsbCkgfHwgXCJVbmtub3duXCI7XG4gIGNvbnN0IHBob25lID0gKHJhdy5waG9uZSA/PyBudWxsKSB8fCBcIlwiO1xuICBjb25zdCBhZGRyZXNzID0gKHJhdy5hZGRyZXNzID8/IG51bGwpIHx8IFwiXCI7XG5cbiAgY29uc3QgW2ZhbWlseSwgZ2l2ZW5dID0gc3BsaXROYW1lKG5hbWVUZXh0KTtcbiAgY29uc3QgbmFtZUVudHJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyB1c2U6IFwib2ZmaWNpYWxcIiwgdGV4dDogbmFtZVRleHQgfTtcbiAgaWYgKGZhbWlseSkgbmFtZUVudHJ5LmZhbWlseSA9IGZhbWlseTtcbiAgaWYgKGdpdmVuLmxlbmd0aCA+IDApIG5hbWVFbnRyeS5naXZlbiA9IGdpdmVuO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJQYXRpZW50XCIsXG4gICAgaWQ6IHBhdGllbnRJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgaWRlbnRpZmllcjogW1xuICAgICAge1xuICAgICAgICB1c2U6IFwib2ZmaWNpYWxcIixcbiAgICAgICAgc3lzdGVtOiBsb29rc0xpa2VUd05hdGlvbmFsSWQocmF3SWQpXG4gICAgICAgICAgPyBzeXN0ZW1zLlRXX05BVElPTkFMX0lEXG4gICAgICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9QQVRJRU5UX01STixcbiAgICAgICAgdmFsdWU6IHJhd0lkLFxuICAgICAgfSxcbiAgICBdLFxuICAgIG5hbWU6IFtuYW1lRW50cnldLFxuICAgIGdlbmRlcjogbWFwR2VuZGVyKHJhdy5nZW5kZXIpLFxuICB9O1xuXG4gIGNvbnN0IGJpcnRoRGF0ZSA9IHJhdy5iaXJ0aERhdGU7XG4gIGlmIChiaXJ0aERhdGUpIHJlc291cmNlLmJpcnRoRGF0ZSA9IGJpcnRoRGF0ZTtcblxuICBpZiAocGhvbmUpIHtcbiAgICByZXNvdXJjZS50ZWxlY29tID0gW3sgc3lzdGVtOiBcInBob25lXCIsIHVzZTogXCJob21lXCIsIHZhbHVlOiBwaG9uZSB9XTtcbiAgfVxuXG4gIGlmIChhZGRyZXNzKSB7XG4gICAgcmVzb3VyY2UuYWRkcmVzcyA9IFt7IHVzZTogXCJob21lXCIsIHRleHQ6IGFkZHJlc3MgfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8qKlxuICogU3BsaXQgYSBmdWxsIG5hbWUgaW50byBbZmFtaWx5LCBbZ2l2ZW5dXSBmb3IgRkhJUiBQYXRpZW50Lm5hbWUuXG4gKlxuICogSGV1cmlzdGljczpcbiAqICAgLSBDb250YWlucyB3aGl0ZXNwYWNlIFx1MjE5MiBXZXN0ZXJuOiBsYXN0IHRva2VuID0gZmFtaWx5LCByZXN0ID0gZ2l2ZW4uXG4gKiAgIC0gQ0pLIC8gc2luZ2xlLXRva2VuIFx1MjE5MiBmaXJzdCBjaGFyID0gZmFtaWx5LCByZW1haW5kZXIgPSBnaXZlbi5cbiAqICAgLSBcIlVua25vd25cIiBvciBlbXB0eSBcdTIxOTIgW1wiXCIsIFtdXVxuICpcbiAqIFR3by1jaGFyIENKSyBmYW1pbHkgbmFtZXMgKFx1NkI1MFx1OTY3RCwgXHU1M0Y4XHU5OUFDLCBcdTIwMjYpIGFyZSBOT1QgYXV0by1kZXRlY3RlZC5cbiAqL1xuZnVuY3Rpb24gc3BsaXROYW1lKGZ1bGxOYW1lOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmdbXV0ge1xuICBjb25zdCBuYW1lID0gKGZ1bGxOYW1lID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFuYW1lIHx8IG5hbWUgPT09IFwiVW5rbm93blwiKSByZXR1cm4gW1wiXCIsIFtdXTtcbiAgaWYgKC9cXHMvLnRlc3QobmFtZSkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IG5hbWUuc3BsaXQoL1xccysvKTtcbiAgICByZXR1cm4gW3BhcnRzW3BhcnRzLmxlbmd0aCAtIDFdISwgcGFydHMuc2xpY2UoMCwgLTEpXTtcbiAgfVxuICAvLyBDSksgZmFsbGJhY2sgXHUyMDE0IGl0ZXJhdGUgY29kZXBvaW50cywgbm90IFVURi0xNiBjb2RlIHVuaXRzLCBzb1xuICAvLyBzdXJyb2dhdGUtcGFpciBjaGFyYWN0ZXJzIChyYXJlIGluIENoaW5lc2UgbmFtZXMgYnV0IHBvc3NpYmxlKVxuICAvLyBkb24ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY29kZXBvaW50cyA9IEFycmF5LmZyb20obmFtZSk7XG4gIHJldHVybiBjb2RlcG9pbnRzLmxlbmd0aCA+IDEgPyBbY29kZXBvaW50c1swXSEsIFtjb2RlcG9pbnRzLnNsaWNlKDEpLmpvaW4oXCJcIildXSA6IFtuYW1lLCBbXV07XG59XG5cbmZ1bmN0aW9uIG1hcEdlbmRlcihnZW5kZXI6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBnID0gdHlwZW9mIGdlbmRlciA9PT0gXCJzdHJpbmdcIiA/IGdlbmRlci50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKFtcIm1hbGVcIiwgXCJtXCIsIFwiXHU3NTM3XCIsIFwiXHU3NTM3XHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJtYWxlXCI7XG4gIGlmIChbXCJmZW1hbGVcIiwgXCJmXCIsIFwiXHU1OTczXCIsIFwiXHU1OTczXHU2MDI3XCJdLmluY2x1ZGVzKGcpKSByZXR1cm4gXCJmZW1hbGVcIjtcbiAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuIiwgIi8vIE5ISSBKU09OIFx1MjE5MiBub3JtYWxpemVkIHNoYXBlIGFkYXB0ZXJzLlxuLy9cbi8vIEV4dHJhY3RlZCBmcm9tIGJhY2tncm91bmQuanMgc28gZWFjaCBhZGFwdGVyIGNhbiBiZSB1bml0LXRlc3RlZCBpblxuLy8gaXNvbGF0aW9uLiBiYWNrZ3JvdW5kLmpzIGltcG9ydHMgZXZlcnl0aGluZyBiZWxvdzsgdGhlIGxpdmUgU1cgZ2x1ZXNcbi8vIHRoZXNlIG9udG8gZmV0Y2hlZCBwYXlsb2FkcyB2aWEgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5LlxuLy9cbi8vIFdoeSBleHRyYWN0OiB0aGUgdjAuNi4xIGxhYitpbWFnaW5nIGRhdGUtZmllbGQgYnVncyAoY29tbWl0cyBiMzc4ODVmIC9cbi8vIDhjMTk5MDEpIHNoaXBwZWQgYmVjYXVzZSB0aGVzZSBmdW5jdGlvbnMgaGFkIFpFUk8gdGVzdCBjb3ZlcmFnZSBcdTIwMTRcbi8vIGJhY2tncm91bmQuanMgY2FuJ3QgYmUgbG9hZGVkIGluIGEgdGVzdCBlbnZpcm9ubWVudCAoY2hyb21lLiogQVBJcyxcbi8vIFNXIGdsb2JhbHMpLCBzbyB0aGUgYWRhcHQqIGxvZ2ljIHJvZGUgYWxvbmcgdW50ZXN0ZWQuIFB1bGxpbmcgdGhlbVxuLy8gaW50byBhIHB1cmUtZnVuY3Rpb24gbW9kdWxlIGxldHMgdml0ZXN0IHZlcmlmeSBmaWVsZC1wcmlvcml0eVxuLy8gZGVjaXNpb25zIHJvdy1ieS1yb3cuXG5cbi8vIENvbnZlcnQgTkhJJ3MgXHU2QzExXHU1NzBCIGRhdGUgXCIxMTUvMDUvMDVcIiBcdTIxOTIgSVNPIFwiMjAyNi0wNS0wNVwiLlxuLy8gU29tZSBOSEkgZmllbGRzIGVtYmVkIGJvdGggUk9DIGFuZCBHcmVnb3JpYW46IFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHdlXG4vLyBqdXN0IG1hdGNoIHRoZSBmaXJzdCBzZWdtZW50LlxuZXhwb3J0IGZ1bmN0aW9uIHJvY1RvSVNPKHJvY0RhdGUpIHtcbiAgaWYgKCFyb2NEYXRlKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgbSA9IFN0cmluZyhyb2NEYXRlKS5tYXRjaCgvXihcXGR7MiwzfSlbLy4tXShcXGR7MSwyfSlbLy4tXShcXGR7MSwyfSkvKTtcbiAgaWYgKCFtKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeSA9IHBhcnNlSW50KG1bMV0sIDEwKSArIDE5MTE7XG4gIHJldHVybiBgJHt5fS0ke21bMl0ucGFkU3RhcnQoMiwgXCIwXCIpfS0ke21bM10ucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG59XG5cbi8vIEludmVyc2U6IElTTyBcIjIwMjMtMDUtMDVcIiBcdTIxOTIgUk9DIFwiMTEyLzA1LzA1XCIuIFVzZWQgdG8gYnVpbGQgTkhJIGRhdGUtcmFuZ2Vcbi8vIHF1ZXJ5IHN0cmluZ3MgKHRoZWlyIGZvcm1zIGV4cGVjdCBcdTZDMTFcdTU3MEIgZm9ybWF0KS5cbmV4cG9ydCBmdW5jdGlvbiBpc29Ub1JPQyhpc29EYXRlKSB7XG4gIGlmICghaXNvRGF0ZSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IG0gPSBTdHJpbmcoaXNvRGF0ZSkubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSkvKTtcbiAgaWYgKCFtKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeSA9IHBhcnNlSW50KG1bMV0sIDEwKSAtIDE5MTE7XG4gIGlmICh5IDwgMSkgcmV0dXJuIFwiXCI7IC8vIHByZS1cdTZDMTFcdTU3MEIgZGF0ZXMgbWFrZSBubyBzZW5zZSB0byBOSElcbiAgcmV0dXJuIGAke3l9LyR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LyR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gTkhJIGJpbGluZ3VhbCBmaWVsZHMgdXNlIFwiXHU0RTJEXHU2NTg3fHxFbmdsaXNoXCIgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZhc3Rlcixcbi8vIHNvIHByZWZlciB0aGF0IHNpZGUuIElmIHRoZXJlJ3Mgbm8gYHx8YCB3ZSBqdXN0IHJldHVybiB0aGUgaW5wdXQgdHJpbW1lZC5cbmV4cG9ydCBmdW5jdGlvbiBwaWNrRW5nbGlzaChzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHN0ciA9IFN0cmluZyhzKTtcbiAgY29uc3QgaWR4ID0gc3RyLmluZGV4T2YoXCJ8fFwiKTtcbiAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBzdHIudHJpbSgpO1xuICBjb25zdCBlbiA9IHN0ci5zbGljZShpZHggKyAyKS50cmltKCk7XG4gIHJldHVybiBlbiB8fCBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG59XG5cbi8vIFN0cmlwIHRyYWlsaW5nIHB1bmN0dWF0aW9uIC8gd2hpdGVzcGFjZSBqdW5rIHRoYXQgc29tZSBob3NwaXRhbHMgbGVhdmVcbi8vIG9uIHRoZWlyIGZyZWUtdGV4dCBsYWIgbGFiZWxzIChlLmcuIE5ISSByZXR1cm5zIFwiQ3JlYSxcIiBmcm9tIG9uZSBzaXRlXG4vLyBhbmQgXCJDcmVhXCIgZnJvbSBhbm90aGVyIGZvciB0aGUgc2FtZSBwaHlzaWNhbCB0ZXN0KS4gUHJlLW5vcm1hbGl6aW5nXG4vLyBoZXJlIG1lYW5zIHRoZSBPYnNlcnZhdGlvbi5jb2RlLnRleHQgZG93bnN0cmVhbSByZWFkcyBjbGVhbmx5IGV2ZW5cbi8vIHdoZW4gZG93bnN0cmVhbSBVSXMgc3RpbGwgaGFwcGVuIHRvIHJlbmRlciBgY29kZS50ZXh0YCBpbnN0ZWFkIG9mXG4vLyBwdWxsaW5nIGRpc3BsYXkgZnJvbSB0aGUgTE9JTkMgLyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIGNvZGluZy5cbmZ1bmN0aW9uIF9jbGVhbkxhYk5hbWUocykge1xuICBpZiAocyA9PT0gbnVsbCB8fCBzID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICByZXR1cm4gU3RyaW5nKHMpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9bLFx1RkYwQztcdUZGMUJdK1xccyokLywgXCJcIikgIC8vIHRyYWlsaW5nIFx1NTM0QVx1NUY2MiAvIFx1NTE2OFx1NUY2MiBwdW5jdHVhdGlvblxuICAgIC50cmltKCk7XG59XG5cbi8vIEFkYXB0ZXIgZm9yIE5ISSBsYWIvb2JzZXJ2YXRpb24gSlNPTiBzaGFwZSAoY29uZmlybWVkIGZvciBJSEtFMzQwOVMwMTtcbi8vIG90aGVyIGxhYiBlbmRwb2ludHMgbGlrZWx5IHVzZSB0aGUgc2FtZSBmaWVsZHMpLlxuLy9cbi8vIERhdGUgZmllbGQgY2hvaWNlIFx1MjAxNCBJSEtFMzQwOSByZXR1cm5zIHRocmVlIGRhdGUtaXNoIGZpZWxkcyBwZXIgcm93OlxuLy8gICAtIGZ1bkNfREFURSAgICAgICAgICBcdTVDMzFcdThBM0FcdTY1RTUgLyBcdTUxNjVcdTk2NjJcdTY1RTUgKHZpc2l0IHJlZ2lzdHJhdGlvbiAvIGFkbWlzc2lvbilcbi8vICAgLSByZWFMX0lOU1BFQ1RfREFURSAgXHU1QkU2XHU5NjlCXHU2M0ExXHU2QUEyXHU2NUU1IChhY3R1YWwgc2FtcGxlLWNvbGxlY3Rpb24gZGF0ZSlcbi8vICAgLSBhc3NhWV9VUExPQURfREFURSAgXHU0RTBBXHU1MEIzXHU2NUU1ICh3aGVuIHRoZSByZXN1bHQgaGl0IE5ISSdzIHNlcnZlcilcbi8vIEZvciBhbiBpbnBhdGllbnQsIGZ1bkNfREFURSBpcyB0aGUgYWRtaXNzaW9uIGRheSBhbmQgZXZlcnkgbGFiIGRyYXduXG4vLyBkdXJpbmcgdGhlIHN0YXkgY2FycmllcyB0aGUgc2FtZSBmdW5DX0RBVEUgXHUyMDE0IHVzaW5nIGl0IGFzIE9ic2VydmF0aW9uLlxuLy8gZWZmZWN0aXZlRGF0ZVRpbWUgbWFkZSBhbGwgXHU0RjRGXHU5NjYyXHU2NzFGXHU5NTkzIGxhYnMgbG9vayBsaWtlIHRoZXkgd2VyZSBkcmF3blxuLy8gb24gZGF5IDEuIEZISVIncyBcInBoeXNpb2xvZ2ljYWxseSByZWxldmFudCB0aW1lXCIgZm9yIGEgbGFiIE9ic2VydmF0aW9uXG4vLyBpcyB0aGUgc2FtcGxlLWNvbGxlY3Rpb24gZGF0ZSwgc28gcHJlZmVyIHJlYUxfSU5TUEVDVF9EQVRFIHdoZW4gTkhJXG4vLyByZXR1cm5zIGl0OyBmYWxsIGJhY2sgdG8gZnVuQ19EQVRFIG9ubHkgd2hlbiB0aGUgaW5zcGVjdCBmaWVsZCBpc1xuLy8gbWlzc2luZyAob2xkZXIgcm93cyAvIGVuZHBvaW50cyB0aGF0IGRvbid0IGNhcnJ5IGl0KS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdExhYkl0ZW0oaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oXG4gICAgaXRlbS5yZWFMX0lOU1BFQ1RfREFURSB8fCBpdGVtLnJlYWxfaW5zcGVjdF9kYXRlIHx8IGl0ZW0uZnVuQ19EQVRFLFxuICApO1xuICBjb25zdCB2YWx1ZSA9IGl0ZW0uYXNzYVlfVkFMVUU7XG4gIGlmICghZGF0ZSB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgLy8gRGlzcGxheSBuYW1lIGZhbGxiYWNrIGNoYWluIChhbGwgbm9ybWFsaXplZCBmb3IgdHJhaWxpbmcgcHVuY3R1YXRpb24pOlxuICAvLyAgIDEuIGFzc2FZX0lURU1fTkFNRSBcdTIwMTQgaG9zcGl0YWwncyBmdWxsIGZyZWUtdGV4dCBsYWJlbFxuICAvLyAgIDIuIG9yZGVyX3Nob3J0bmFtZSBcdTIwMTQgTkhJJ3MgVUktdHJ1bmNhdGVkIGxhYmVsIChvZnRlbiBlbmRzIFwiLi4uXCIpXG4gIC8vICAgMy4gb3JkZVJfTkFNRSAgICAgIFx1MjAxNCBOSEkncyBjYW5vbmljYWwgXHU5MUFCXHU0RUU0XHU3OEJDIGRpY3Rpb25hcnkgbmFtZVxuICAvLyBhc3NhWV9JVEVNX05BTUUgd2lucyBieSBkZWZhdWx0IGJlY2F1c2Ugb3JkZXJfc2hvcnRuYW1lIGNhbiBiZSBjdXRcbiAgLy8gb2ZmIG1pZC13b3JkIChcIlBDIFN1Z2FyIFx1OThFRlx1NUY4QyAuLi5cIiksIHdoaWNoIGlzIHdvcnNlIHRoYW4gYSB0cmFpbGluZy1cbiAgLy8gY29tbWEgY29zbWV0aWMgaXNzdWUuIG9yZGVSX05BTUUgaXMgdGhlIGxhc3QtcmVzb3J0IENoaW5lc2UgZm9ybWFsXG4gIC8vIGxhYmVsLlxuICBjb25zdCBmdWxsTmFtZSA9IF9jbGVhbkxhYk5hbWUoaXRlbS5hc3NhWV9JVEVNX05BTUUpXG4gICAgICAgICAgICAgICAgfHwgX2NsZWFuTGFiTmFtZShpdGVtLm9yZGVyX3Nob3J0bmFtZSlcbiAgICAgICAgICAgICAgICB8fCBfY2xlYW5MYWJOYW1lKGl0ZW0ub3JkZVJfTkFNRSk7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IFN0cmluZyhpdGVtLm9yZGVSX0NPREUgfHwgXCJcIikudHJpbSgpO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgb3JkZXJfY29kZTogb3JkZXJDb2RlLFxuICAgIG9yZGVyX25hbWU6IGl0ZW0ub3JkZVJfTkFNRSB8fCBcIlwiLFxuICAgIC8vIFByZWZlciB0aGUgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyAoXCIwOTE0MENcIikgYXMgdGhlIEZISVIgY29kaW5nIGNvZGUgc28gdGhlXG4gICAgLy8gZG93bnN0cmVhbSBvYnNlcnZhdGlvbiBtYXBwZXIgcm91dGVzIGl0IHVuZGVyIE5ISV9NRURJQ0FMX09SREVSX1xuICAgIC8vIENPREUgc3lzdGVtLiBTTUFSVCBhcHBzIGdyb3VwIGxhYiB0ZXN0cyBieSBjb2RpbmcgY29kZTsgdXNpbmdcbiAgICAvLyBmcmVlLXRleHQgaGVyZSBpcyB3aGF0IGNhdXNlcyBcIkNyZWFcIiBhbmQgXCJDcmVhLFwiIHRvIGJlIHNwbGl0XG4gICAgLy8gaW50byB0d28gZGlzdGluY3QgdGVzdHMuIEZhbGxiYWNrIHRvIHRoZSBjbGVhbmVkIGRpc3BsYXkgd2hlblxuICAgIC8vIE5ISSBkb2Vzbid0IHN1cHBseSBhbiBvcmRlciBjb2RlIChvbGRlciAvIGVkZ2UtY2FzZSByb3dzKS5cbiAgICBjb2RlOiBvcmRlckNvZGUgfHwgZnVsbE5hbWUsXG4gICAgZGlzcGxheTogZnVsbE5hbWUsXG4gICAgdmFsdWU6IFN0cmluZyh2YWx1ZSksXG4gICAgdW5pdDogaXRlbS51bmlUX0RBVEEgfHwgXCJcIixcbiAgICByZWZlcmVuY2VfcmFuZ2U6IGl0ZW0uY29uc3VsVF9WQUxVRSB8fCBpdGVtLnNob3J0X0NPTlNVTFRfVkFMVUUgfHwgXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDZTMDEgcmV0dXJucyB2aXNpdC1sZXZlbCByb3dzIE9OTFkgKG5vIGRydWcgbmFtZXMpLiBUaGUgYWN0dWFsIGRydWdcbi8vIGxpc3QgbGl2ZXMgYXQgSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiwgaW5cbi8vIGBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0YC4gV2UgZG8gdGhhdCAyLXN0ZXBcbi8vIGZldGNoIHNlcGFyYXRlbHk7IHRoaXMgZnVuY3Rpb24gYWRhcHRzIGEgc2luZ2xlIGRydWcgZW50cnkgZ2l2ZW4gaXRzXG4vLyBwYXJlbnQgdmlzaXQgY29udGV4dC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsKGRydWcsIHZpc2l0KSB7XG4gIGlmICghZHJ1ZyB8fCB0eXBlb2YgZHJ1ZyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIC8vIHZpc2l0LmZ1bmNfREFURSBpcyBcIjExNS8wNS8wNXx8MjAyNi8wNS8wNVwiIFx1MjAxNCByb2NUb0lTTyBtYXRjaGVzIHRoZSBST0NcbiAgLy8gcHJlZml4IGNvcnJlY3RseS5cbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKHZpc2l0Py5mdW5jX0RBVEUgfHwgdmlzaXQ/LmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgY29uc3QgZHJ1Z19uYW1lID0gcGlja0VuZ2xpc2goZHJ1Zy5kcnVnX25hbWUgfHwgZHJ1Zy5kcnVHX05BTUUgfHwgXCJcIik7XG4gIGlmICghZGF0ZSB8fCAhZHJ1Z19uYW1lKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF5cyA9IE51bWJlcihkcnVnLm9yZGVyX2RydWdfZGF5IHx8IGRydWcub3JkZXJfRFJVR19EQVkgfHwgMCk7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBkcnVnX25hbWUsXG4gICAgY29kZTogZHJ1Zy5vcmRlcl9jb2RlIHx8IGRydWcub3JkZVJfQ09ERSB8fCBcIlwiLFxuICAgIC8vIExpc3QgZW5kcG9pbnQgZG9lc24ndCBleHBvc2UgZG9zZS9mcmVxdWVuY3kvcm91dGUgXHUyMDE0IG9ubHkgZGF5cyArIHF0eS5cbiAgICBkb3NlOiBcIlwiLFxuICAgIGZyZXF1ZW5jeTogXCJcIixcbiAgICByb3V0ZTogXCJcIixcbiAgICBxdWFudGl0eTogZHJ1Zy5vcmRlcl9xdHkgfHwgZHJ1Zy5vcmRlcl9RVFkgfHwgXCJcIixcbiAgICBkdXJhdGlvbl9kYXlzOiBOdW1iZXIuaXNGaW5pdGUoZGF5cykgPyBkYXlzIDogMCxcbiAgICAvLyBwaWNrRW5nbGlzaCBvbiBpY2RfbmFtZSB0dXJucyBcdTgyNkZcdTYwMjdcdTY1MURcdThCNzdcdTgxN0EuLi58fEJlbmlnbiBwcm9zdGF0aWMuLi4gaW50byB0aGUgRU4gc2lkZS5cbiAgICBpbmRpY2F0aW9uOiBwaWNrRW5nbGlzaCh2aXNpdD8uaWNkOWNtX0NPREVfQ05BTUUgfHwgdmlzaXQ/LmljZDljbV9uYW1lIHx8IFwiXCIpLFxuICAgIGluZGljYXRpb25fY29kZTogdmlzaXQ/LmljZDljbV9DT0RFIHx8IHZpc2l0Py5pY2Q5Y21fY29kZSB8fCBcIlwiLFxuICAgIGRydWdfY2xhc3M6IHBpY2tFbmdsaXNoKGRydWcuYWN0IHx8IFwiXCIpLFxuICAgIGhvc3BpdGFsOiB2aXNpdD8uaG9zcF9BQkJSIHx8IHZpc2l0Py5ob3NwX2FiYnIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gU3R1YiBrZXB0IGZvciB0aGUgZW5kcG9pbnQgcmVnaXN0cnkgXHUyMDE0IElIS0UzMzA2UzAxIGxpc3QgbmV2ZXIgaGFzIGRydWdzLFxuLy8gc28gd2UgYWx3YXlzIHJldHVybiBudWxsIGFuZCByZWx5IG9uIHRoZSAyLXN0ZXAgZGV0YWlsIGZldGNoIGFib3ZlLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbigpIHsgcmV0dXJuIG51bGw7IH1cblxuLy8gU2FtZSBzaGFwZSBhcyBhZGFwdE1lZGljYXRpb246IElIS0UzNDA4UzAxIChpbWFnaW5nIGxpc3QpIG9ubHkgY2Fycmllc1xuLy8gb3JkZXItbGV2ZWwgZGF0YTsgdGhlIGFjdHVhbCByZXBvcnQgbmFycmF0aXZlIGNvbWVzIGZyb20gdGhlIElIS0UzNDA4UzAyXG4vLyBkZXRhaWwgZmFuLW91dCAoc2VlIGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwpLiBSZXR1cm5pbmcgbnVsbCBmcm9tXG4vLyB0aGUgbGlzdCBhZGFwdGVyIGVuc3VyZXMgbm8gaGFsZi1mb3JtZWQgRGlhZ25vc3RpY1JlcG9ydHMgbGVhayB0aHJvdWdoLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0SW1hZ2luZ0xpc3RTdHViKCkgeyByZXR1cm4gbnVsbDsgfVxuXG4vLyBJSEtFMzIwOVMwMSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KSBcdTIwMTQgTkhJJ3Mgb2ZmaWNpYWxseS12ZXR0ZWQgY2F0YXN0cm9waGljLWlsbG5lc3Ncbi8vIHJlZ2lzdHJ5LiBFYWNoIHJvdyBpcyBhIHNlcmlvdXMgY2hyb25pYyBjb25kaXRpb24gKGNhbmNlciwgYXV0b2ltbXVuZSxcbi8vIHRyYW5zcGxhbnQgZm9sbG93LXVwLCBkaWFseXNpcywgZXRjLikgdGhlIHBhdGllbnQgaXMgY3VycmVudGx5XG4vLyByZWdpc3RlcmVkIGZvci4gVGhpcyBpcyB0aGUgY2xvc2VzdCB0aGluZyBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZXhwb3NlcyB0byBhXG4vLyBjdXJhdGVkIHByb2JsZW0gbGlzdCBcdTIwMTQgZmFyIHN0cm9uZ2VyIHNpZ25hbCB0aGFuIHJldmVyc2UtZW5naW5lZXJpbmdcbi8vIGNocm9uaWMgY29uZGl0aW9ucyBmcm9tIGVuY291bnRlciBJQ0RzLlxuLy9cbi8vIE1hcHMgdG8gRkhJUiBDb25kaXRpb24gd2l0aCBjYXRlZ29yeT1wcm9ibGVtLWxpc3QtaXRlbSBzbyBkb3duc3RyZWFtXG4vLyBTTUFSVCBhcHBzIC8gSVBTIHByb2ZpbGVzIHN1cmZhY2UgaXQgaW4gdGhlaXIgcHJvYmxlbS1saXN0IHZpZXcuXG4vL1xuLy8gUGF5bG9hZCBzaGFwZSAobGl2ZSBjYXB0dXJlKTpcbi8vICAgc1BfSUhLRTMyMDlTMDE6IFtcbi8vICAgICB7IGhvc1BfSUQsIGhvc1BfQUJCUiwgaG9zUF9VUkwsXG4vLyAgICAgICBpY0QxMENNX0NOQU1FOiBcIlx1NjUxRFx1OEI3N1x1ODE3QVx1NjBFMVx1NjAyN1x1ODE2Qlx1NzYyNFwiLCAgXHUyMTkwIENoaW5lc2UgbmFycmF0aXZlIG9ubHlcbi8vICAgICAgIHZhbGlEX1NfREFURTogIFwiMTExLzExLzE2XCIsICAgICAgIFx1MjE5MCBjZXJ0aWZpY2F0aW9uIHZhbGlkLWZyb20gKFJPQylcbi8vICAgICAgIHZhbGlEX0VfREFURTogIFwiMTE2LzExLzE1XCIgfSAgICAgIFx1MjE5MCBjZXJ0aWZpY2F0aW9uIHZhbGlkLXVudGlsIChST0MsIH41eSlcbi8vICAgXVxuLy9cbi8vIENhdmVhdHMgZGVsaWJlcmF0ZWx5IGVuY29kZWQ6XG4vLyAgIC0gTkhJIGRvZXNuJ3QgcmV0dXJuIHRoZSBJQ0QtMTAtQ00gY29kZSBpbiB0aGlzIGVuZHBvaW50LCBvbmx5IHRoZVxuLy8gICAgIENoaW5lc2UgbGFiZWwuIFdlIGxlYXZlIGBjb2RlYCBlbXB0eTsgbWFwQ29uZGl0aW9uIGZhbGxzIGJhY2sgdG9cbi8vICAgICBkaXNwbGF5LWFzLWlkIGZvciBzdGFibGVJZCAobWlycm9yaW5nIGRpYWdub3N0aWMtcmVwb3J0LnRzKS5cbi8vICAgLSB2YWxpRF9FX0RBVEUgaXMgd2hlbiB0aGUgQ0FSRCBleHBpcmVzIChyZW5ld2VkIGV2ZXJ5IH41eSksIE5PVFxuLy8gICAgIHdoZW4gdGhlIGRpc2Vhc2UgcmVzb2x2ZWQuIFdlIGRlbGliZXJhdGVseSBkbyBOT1QgbWFwIGl0IHRvXG4vLyAgICAgYWJhdGVtZW50RGF0ZVRpbWUgXHUyMDE0IHRoYXQgd291bGQgZmFsc2VseSBpbXBseSB0aGUgY29uZGl0aW9uIHN0b3BwZWQuXG4vLyAgIC0gQWxsIHJvd3MgaGVyZSBhcmUgY3VycmVudGx5IGFjdGl2ZSBieSBkZWZpbml0aW9uOyBOSEkgb25seSByZXR1cm5zXG4vLyAgICAgdmFsaWQgY2VydGlmaWNhdGlvbnMuIGNsaW5pY2FsX3N0YXR1cyBoYXJkLWNvZGVkIHRvIFwiYWN0aXZlXCIuXG4vLyAgIC0gc2V2ZXJpdHkgc3RvcmVkIGFzIHRleHQgKFwiU2V2ZXJlIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpXCIpIGJlY2F1c2UgdGhlIGZvcm1hbFxuLy8gICAgIHNldmVyaXR5IGNvZGUgbWFwcGluZyAoU05PTUVEIDI0NDg0MDAwIGV0Yy4pIG5lZWRzIG1vcmUgdGhvdWdodC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdENhdGFzdHJvcGhpY0lsbG5lc3MoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkaXNwbGF5ID0gcGlja0VuZ2xpc2goaXRlbS5pY0QxMENNX0NOQU1FIHx8IGl0ZW0uaWNkMTBjbV9jbmFtZSB8fCBcIlwiKTtcbiAgaWYgKCFkaXNwbGF5KSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkaXNwbGF5LFxuICAgIGNvZGU6IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIG9uc2V0X2RhdGU6IHJvY1RvSVNPKGl0ZW0udmFsaURfU19EQVRFIHx8IGl0ZW0udmFsaWRfc19kYXRlIHx8IFwiXCIpLFxuICAgIHJlY29yZGVkX2RhdGU6IHJvY1RvSVNPKGl0ZW0udmFsaURfU19EQVRFIHx8IGl0ZW0udmFsaWRfc19kYXRlIHx8IFwiXCIpLFxuICAgIGNhdGVnb3J5OiBcInByb2JsZW0tbGlzdC1pdGVtXCIsXG4gICAgc2V2ZXJpdHk6IFwiU2V2ZXJlIChcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzUpXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgY2xpbmljYWxfc3RhdHVzOiBcImFjdGl2ZVwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzQwMlMwMSAoXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1XHU3RDUwXHU2NzlDKSBcdTIwMTQgb25lIHJvdyBwZXIgc2NyZWVuaW5nIGV2ZW50LCBmbGF0XG4vLyBzY2hlbWEuIE5ISSBydW5zIHRoZSBwYW5lbCBpdHNlbGYgYW5kIHJldHVybnMgdml0YWxzICsgYSBmaXhlZFxuLy8gYmF0dGVyeSBvZiBsYWIgdmFsdWVzIHByZS1jb21wdXRlZCAoQk1JIC8gd2Fpc3QgLyBCUCAvIGxpcGlkcyAvIExGVFxuLy8gLyBSRlQgLyBmYXN0aW5nIGdsdWNvc2UgLyBIQnNBZyAvIEFudGktSENWIC8gdXJpYyBhY2lkIFx1MjAyNikuXG4vLyBXZSB1bmZvbGQgb25lIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbnM6IHZpdGFscyBnbyB0byBjYXRlZ29yeVxuLy8gdml0YWwtc2lnbnMgKHNvIFNNQVJUIGFwcHMnIHZpdGFscyB2aWV3cyBwaWNrIHRoZW0gdXApLCBsYWJzIGdvIHRvXG4vLyBjYXRlZ29yeSBsYWJvcmF0b3J5LiBSZXR1cm5zIGFuIEFSUkFZIFx1MjAxNCBjYWxsZXIgbXVzdCBmbGF0LW1hcC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEFkdWx0UHJldmVudGl2ZShyb3cpIHtcbiAgaWYgKCFyb3cgfHwgdHlwZW9mIHJvdyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhyb3cuZmlyc1RfRElBR19EQVRFIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUpIHJldHVybiBudWxsO1xuICBjb25zdCBob3NwaXRhbCA9IHJvdy5ob3NQX0FCQlIgfHwgcm93Lmhvc3BfQUJCUiB8fCBcIlwiO1xuICBjb25zdCBvdXQgPSBbXTtcbiAgLy8gKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIE5ISSBjb2RlKVxuICAvLyAoZGlzcGxheSwgdmFsdWUsIHVuaXQsIHJlZlJhbmdlLCBjYXRlZ29yeSwgY29kZSlcbiAgLy8gRXZlcnkgb2JzZXJ2YXRpb24gZW1pdHRlZCBmcm9tIHRoaXMgYWRhcHRlciBjYXJyaWVzIHNvdXJjZV9wcm9ncmFtPVxuICAvLyBcImFkdWx0LXByZXZlbnRpdmVcIiBzbyBkb3duc3RyZWFtIEZISVIgY29uc3VtZXJzIGNhbiBpZGVudGlmeSB0aGVcbiAgLy8gb3JpZ2luIHByb2dyYW1tZSB2aWEgT2JzZXJ2YXRpb24ubWV0YS50YWcgKHNlcGFyYXRlIGZyb20gdGhlXG4gIC8vIHN5bmMtcGFnZS10eXBlIC8gc3luYy1ydW4taWQgc3luYy10cmFja2luZyB0YWdzKS5cbiAgZnVuY3Rpb24gcHVzaChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBjb2RlKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybjtcbiAgICBjb25zdCB2ID0gU3RyaW5nKHZhbHVlKS50cmltKCk7XG4gICAgLy8gRW0tZGFzaCBcIlx1MjAxNFwiIChVKzIwMTQpIGlzIE5ISSdzIHNlbnRpbmVsIFwibm8gZGF0YVwiIG1hcmtlciBcdTIwMTQgZHJvcC5cbiAgICAvLyBQbGFpbiBoeXBoZW4gXCItXCIgaXMgTk9UIGEgbm8tZGF0YSBtYXJrZXIgcGVyLWZpZWxkIFx1MjAxNCBpdCdzIHRoZVxuICAgIC8vIGNsaW5pY2FsIGRpcHN0aWNrIGNvbnZlbnRpb24gZm9yIFwibmVnYXRpdmVcIiAoVXJpbmUgUHJvdGVpbikuXG4gICAgLy8gTkhJJ3Mgbm8tZGF0YSBmbGFnIGZvciBhbiBlbnRpcmUgcm93IGlzIHNpZ25hbGxlZCBieVxuICAgIC8vIGZpcnNUX0RJQUdfREFURSA9IFwiLVwiIHdoaWNoIHRoZSByb3ctbGV2ZWwgZGF0ZSBndWFyZCBhdCB0aGUgdG9wXG4gICAgLy8gb2YgYWRhcHRBZHVsdFByZXZlbnRpdmUgYWxyZWFkeSByZWplY3RzLCBzbyBcIi1cIiByZWFjaGluZyBwdXNoKClcbiAgICAvLyBhbHdheXMgbWVhbnMgXCJ0aGUgY2xpbmljaWFuIHdyb3RlIGl0IGRvd24gYXMgYSBuZWdhdGl2ZSByZXN1bHRcIi5cbiAgICBpZiAodiA9PT0gXCJcIiB8fCB2ID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgb3V0LnB1c2goe1xuICAgICAgZGF0ZSxcbiAgICAgIGhvc3BpdGFsLFxuICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiLFxuICAgICAgb3JkZXJfY29kZTogY29kZSB8fCBcIlwiLFxuICAgICAgb3JkZXJfbmFtZTogZGlzcGxheSxcbiAgICAgIGNvZGU6IGNvZGUgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgICB2YWx1ZTogdixcbiAgICAgIHVuaXQ6IHVuaXQgfHwgXCJcIixcbiAgICAgIHJlZmVyZW5jZV9yYW5nZTogcmVmUmFuZ2UgfHwgXCJcIixcbiAgICAgIC8vIFNvdXJjZS1wcm9ncmFtbWUgdGFnIFx1MjAxNCBhZGRlZCB0byBPYnNlcnZhdGlvbi5tZXRhLnRhZyBieSB0aGVcbiAgICAgIC8vIG1hcHBlcjsgbGV0cyBTTUFSVCBhcHBzIGZpbHRlciAvIGNhdGVnb3JpemUgXCJ0aGlzIGNhbWUgZnJvbVxuICAgICAgLy8gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1IHNjcmVlbmluZ1wiLlxuICAgICAgc291cmNlX3Byb2dyYW06IFwiYWR1bHQtcHJldmVudGl2ZVwiLFxuICAgIH0pO1xuICB9XG4gIC8vIFZpdGFsIHNpZ25zIChubyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIFx1MjAxNCB0aGVzZSBhcmUgc2NyZWVuaW5nIG1lYXN1cmVtZW50cywgbm90XG4gIC8vIGxhYiBvcmRlcnM7IHRoZXkgaGF2ZSBjYW5vbmljYWwgTE9JTkNzIHdoaWNoIGZpbmRMb2luYydzIGtleXdvcmRcbiAgLy8gc2VhcmNoIHJlc29sdmVzIGNsZWFubHkgdmlhIHVuaXF1ZSB0ZXJtcyBsaWtlIFwiYm9keSBoZWlnaHRcIiAvIFwiYm1pXCJcbiAgLy8gXHUyMDE0IG5vIHByZWZpeC1jb2xsaXNpb24gcmlzayB3aXRoIG90aGVyIExPSU5DX01BUCBrZXlzKS5cbiAgcHVzaChcIkJvZHkgSGVpZ2h0XCIsIHJvdy5oZWlnaHQsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJvZHkgV2VpZ2h0XCIsIHJvdy53ZWlnaHQsIFwia2dcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJNSVwiLCByb3cuYm1pLCBcImtnL20yXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJXYWlzdCBDaXJjdW1mZXJlbmNlXCIsIHJvdy53YWlzdGxpbmUsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIlN5c3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX1NCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkRpYXN0b2xpYyBCbG9vZCBQcmVzc3VyZVwiLCByb3cuYmFzRV9FQlAsIFwibW1IZ1wiLFxuICAgICAgIHJvdy5ibG9EX1BSRVNTX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIC8vIEFsbCBjaGVtaXN0cnkgLyBoZXAgcGFuZWwgcm93cyBwaW4gdGhlIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgc28gZmluZExvaW5jIHRha2VzXG4gIC8vIHRoZSBOSElfVE9fTE9JTkMgZGlyZWN0LWxvb2t1cCBwYXRoIFx1MjAxNCBieXBhc3NlcyB0aGUga2V5d29yZCBzZWFyY2hcbiAgLy8gZW50aXJlbHkuIE1hcHBpbmcgY3Jvc3MtdmVyaWZpZWQgYWdhaW5zdCB0aHJlZSBzb3VyY2VzOiB0aGUgTkhJIFVJXG4gIC8vIHNlY3Rpb24gbGFiZWxzIChcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1KSwgdGhlIElIS0UzNDAyIEpTT04gZmllbGRcbiAgLy8gbmFtZXMsIGFuZCB0aGUgZXhpc3RpbmcgTkhJX1RPX0xPSU5DIHRhYmxlIGNvbW1lbnRzLlxuICAvL1xuICAvLyBMaXBpZCBwYW5lbFxuICBwdXNoKFwiQ2hvbGVzdGVyb2xcIiwgICByb3cuY2hvLCAgICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwMUNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMjA5My0zXG4gIHB1c2goXCJUcmlnbHljZXJpZGVcIiwgIHJvdy5ibG9EX1RHLCBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDA0Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyNTcxLThcbiAgcHVzaChcIkhETFwiLCAgICAgICAgICAgcm93LmhkbCwgICAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwNDNDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDIwODUtOVxuICBwdXNoKFwiTERMXCIsICAgICAgICAgICByb3cubGRsLCAgICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTA0NENcIik7ICAvLyBcdTIxOTIgTE9JTkMgMTM0NTctNyAoY2FsYylcbiAgLy8gTGl2ZXIgZnVuY3Rpb25cbiAgcHVzaChcIlNHT1QgKEFTVClcIiwgICAgcm93LnNnb3QsICAgIFwiVS9MXCIsIHJvdy5sRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDI1Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAxOTIwLThcbiAgcHVzaChcIlNHUFQgKEFMVClcIiwgICAgcm93LnNncHQsICAgIFwiVS9MXCIsIHJvdy5sRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDI2Q1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAxNzQyLTZcbiAgLy8gRmFzdGluZyBnbHVjb3NlXG4gIHB1c2goXCJHbHUtQUNcIiwgICAgICAgIHJvdy5zXzA5MDA1QywgXCJtZy9kTFwiLFxuICAgICAgIHJvdy5zXzA5MDA1Q19ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDA1Q1wiKTsgICAgICAgIC8vIFx1MjE5MiBMT0lOQyAxNTU4LTZcbiAgLy8gUmVuYWwgZnVuY3Rpb24gXHUyMDE0IGB1cmluRV9CVU5gIGlzIE5ISSdzIG1pc2xlYWRpbmcgZmllbGQgbmFtZTsgdGhlXG4gIC8vIHZhbHVlIElTIHNlcnVtIEJVTiAoQmxvb2QgVXJlYSBOaXRyb2dlbiksIG5vdCBhIHVyaW5lIHRlc3QuXG4gIHB1c2goXCJCVU5cIiwgICAgICAgICAgIHJvdy51cmluRV9CVU4sICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwMkNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMzA5NC0wXG4gIHB1c2goXCJDcmVhdGluaW5lXCIsICAgIHJvdy5ibG9EX0NSRUFULCAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAxNUNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMjE2MC0wXG4gIC8vIGVHRlIgXHUyMDE0IGRlcml2ZWQgZnJvbSBDcmVhdGluaW5lLCBubyBvd24gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQy4gRGlzcGxheSBrZXl3b3JkXG4gIC8vIFwiZWdmclwiIHJlc29sdmVzIHRvIExPSU5DIDMzOTE0LTMgdmlhIGZpbmRMb2luYy5cbiAgcHVzaChcImVHRlJcIiwgICAgICAgICAgcm93LmVnZnIsICAgICAgICBcIm1ML21pbi8xLjczbTJcIixcbiAgICAgICByb3cuckZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiKTtcbiAgLy8gVXJpbmUgUHJvdGVpbiBkaXBzdGljayBcdTIwMTQgcXVhbGl0YXRpdmUgKFwiLVwiIC8gXCJcdTAwQjFcIiAvIFwiMStcIiAuLi4pLlxuICAvLyB1cmluRV9QUk9URUlOIGlzIHRoZSBzdGF0dXMgY29kZSwgdXJpbkVfUFJPVEVJTl9URVhUIGlzIHRoZVxuICAvLyBkaXNwbGF5YWJsZSByZXN1bHQgKHBhc3NlZCBhcyB2YWx1ZSkuIFRoZSBzcGVjaWZpYyBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIGZvclxuICAvLyBwcmV2ZW50aXZlLXNjcmVlbmluZyB1cmluZSBwcm90ZWluIGlzbid0IGluIG91ciBOSElfVE9fTE9JTkMgdGFibGVcbiAgLy8geWV0OyB0aGUga2V5d29yZCBcInVyaW5lIHByb3RlaW5cIiByZXNvbHZlcyB0byBMT0lOQyAyMDQ1NC01IHZpYVxuICAvLyBmaW5kTG9pbmMgKGFmdGVyIHRoZSB2MC42LjcgbG9uZ2VzdC1tYXRjaCBmaXgpLlxuICBwdXNoKFwiVXJpbmUgUHJvdGVpblwiLCByb3cudXJpbkVfUFJPVEVJTl9URVhUIHx8IFwiXCIsIFwiXCIsIFwiXCIpO1xuICAvLyBIZXBhdGl0aXMgQi9DIHNjcmVlbmluZyBcdTIwMTQgc3RhdHVzIGNvZGUgdnMgX1RFWFQgdHJhcCBkb2N1bWVudGVkIGF0XG4gIC8vIGxlbmd0aCBiZWxvdy4gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBwaW5uZWQgc28gZmluZExvaW5jIHRha2VzIHRoZSBOSElfVE9fTE9JTkNcbiAgLy8gcGF0aCAob3RoZXJ3aXNlIHRoZSBrZXl3b3JkIFwiaGJcIiBwcmVmaXgtY29sbGlkZXMgd2l0aCB0aGUgbW9yZVxuICAvLyBzcGVjaWZpYyBcImhic2FnXCIgXHUyMDE0IHRoZSBidWcgb3JpZ2luYWxseSByZXBvcnRlZCBpbiB2MC42LjUpLlxuICAvLyAgIDE0MDMyQyBcdTIxOTIgTE9JTkMgNTE5Ni0xICAoSEJzQWcsIE1hc3Mvdm9sKVxuICAvLyAgIDE0MDUxQyBcdTIxOTIgTE9JTkMgMTM5NTUtMCAoSENWIGFudGlib2R5LCBTZXJ1bSBvciBQbGFzbWEpXG4gIC8vIEhpc3Rvcnk6IHJlZ3Jlc3NlZCBpbiB2MC42LjMsIGZpeCBsb3N0IHVudGlsIHYwLjYuNTsgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQ1xuICAvLyBwaW5uaW5nIGFkZGVkIHYwLjYuNiArIHYwLjYuOC5cbiAgcHVzaChcIkhCc0FnXCIsICAgIHJvdy5oYnNhR19URVhUICAgfHwgXCJcIiwgXCJcIiwgcm93LmhiVl9SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIxNDAzMkNcIik7XG4gIHB1c2goXCJBbnRpLUhDVlwiLCByb3cuYW50SV9IQ1ZfVEVYVCB8fCBcIlwiLCBcIlwiLCByb3cuaGNWX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjE0MDUxQ1wiKTtcbiAgLy8gVXJpYyBhY2lkIChibG9vZCkgXHUyMDE0IGB1cmlDX0FDSURgIGZpZWxkLiBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIDA5MDEzQyBcdTIxOTIgTE9JTkNcbiAgLy8gMzA4NC0xIChVcmF0ZSBNYXNzL3ZvbCBTL1ApLlxuICAvL1xuICAvLyBOSEkncyBJSEtFMzQwMiBzY2hlbWEgQUxTTyBjYXJyaWVzIHR3byByZWxhdGVkLWxvb2tpbmctYnV0LWRpc3RpbmN0XG4gIC8vIGZpZWxkcyB3ZSBkZWxpYmVyYXRlbHkgc2tpcDpcbiAgLy8gICAtIHVyaW5FX1VBX0RJQUdfQUNJRCBcdTIwMTQgZW1waXJpY2FsbHkgZHVwbGljYXRlcyBzZXJ1bSB1cmljIGFjaWQ7XG4gIC8vICAgICBlbWl0dGluZyBpdCB3b3VsZCBjcmVhdGUgYSBkdXBsaWNhdGUgT2JzZXJ2YXRpb24uXG4gIC8vICAgLSB1cmluRV9VQSAvIHVyaW5FX1VBX0RJQUdfUkVTVUxUX1RFWFQgXHUyMDE0IGNsYWltIHRvIGJlIGEgdXJpbmUgVUFcbiAgLy8gICAgIGRpcHN0aWNrIGJ1dCBET04nVCBhcHBlYXIgYW55d2hlcmUgaW4gTkhJJ3MgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIFVJIGZvclxuICAvLyAgICAgYWR1bHQgcHJldmVudGl2ZSBzY3JlZW5pbmcgKHRoZSBcdTVDM0ZcdTZEQjJcdTZBQTJcdTY3RTUgc2VjdGlvbiBvbmx5IHNob3dzXG4gIC8vICAgICBcdTVDM0ZcdTZEQjJcdTg2Q0JcdTc2N0RcdThDRUEpLiBBbHdheXMgZW1wdHkgLyBcIi1cIiBpbiBvYnNlcnZlZCBwYXlsb2Fkcy4gTGVnYWN5XG4gIC8vICAgICBzY2hlbWEgZmllbGQgd2l0aCBubyBjbGluaWNhbCByZWFsaXR5IFx1MjAxNCBkbyBOT1QgZW1pdC5cbiAgcHVzaChcIlVyaWMgQWNpZFwiLCAgICAgcm93LnVyaUNfQUNJRCwgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDEzQ1wiKTtcbiAgLy8gTWV0YWJvbGljIHN5bmRyb21lIHNjcmVlbmluZyBcdTIwMTQgdmFsdWUgaXMgYW4gaW50ZXJwcmV0YXRpb24gc3RyaW5nXG4gIC8vICgnXHU2QjYzXHU1RTM4JyAvICdcdTc1NzBcdTVFMzhcdUZGMENcdTVFRkFcdThCNzBcdUZGMUFcdThBQ0JcdTZEM0RcdThBNjJcdTkxQUJcdTVFMkInKSwgbm90IGEgbnVtYmVyLiBUaGUgbWFwcGVyJ3NcbiAgLy8gX3RyeV9wYXJzZV9xdWFudGl0eSB3aWxsIHJldHVybiBOb25lIGFuZCBpdCBmYWxscyB0aHJvdWdoIHRvXG4gIC8vIHZhbHVlU3RyaW5nLiBObyBtYXBwZWQgTE9JTkMga2V5d29yZCAoeWV0KSBzbyB0aGlzIGxhbmRzIGFzIGFuXG4gIC8vIE9ic2VydmF0aW9uIHdpdGggY29kZS50ZXh0IG9ubHk7IGRvd25zdHJlYW0gY29uc3VtZXJzIGNhbiBzdGlsbFxuICAvLyBzdXJmYWNlIGl0IHVuZGVyIHRoZSBwYXRpZW50J3Mgc2NyZWVuaW5nIHNlY3Rpb24gYnkgY29kZS50ZXh0LlxuICBwdXNoKFwiXHU0RUUzXHU4QjFEXHU3NUM3XHU1MDE5XHU3RkE0XHU3QkU5XHU2QUEyIChNZXRhYm9saWMgU3luZHJvbWUgU2NyZWVuaW5nKVwiLFxuICAgICAgIHJvdy5tZXRBX1NZTkRSX1JFU1VMVF9URVhULCBcIlwiLCBcIlwiKTtcbiAgcmV0dXJuIG91dDtcbn1cblxuLy8gSUhLRTMzMDlTMDEgKFx1NEY0Rlx1OTY2MiBpbnBhdGllbnQgbGlzdCkgXHUyMDE0IGdpdmVzIHByb3BlciBhZG1pc3Npb24vZGlzY2hhcmdlLlxuLy8gU2hhcGU6IHtob3NwX0lELCBob3NwX0FCQlIsIGhvc3BfdXJsLCBpbl9EQVRFLCBvdXRfREFURSxcbi8vICAgICAgICAgaWNkOWNtX0NPREUsIGljZDljbV9DT0RFX0NOQU1FLCBvcmlfVFlQRShcIjNcIiksIHJvd19JRCwgLi4ufVxuLy8gSUhLRTMzMDhTMDEgaGFzIHRoZSBzYW1lIHNoYXBlIGZvciBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3Jkcztcbi8vIGBmdW5jX0RBVEVgIGluc3RlYWQgb2YgYGluX0RBVEVgIGluIHNvbWUgcm93cyBcdTIwMTQgYWRhcHRlciBhY2NlcHRzIGJvdGguXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBzdGFydCA9IHJvY1RvSVNPKGl0ZW0uaW5fREFURSB8fCBpdGVtLmZ1bmNfREFURSB8fCBcIlwiKTtcbiAgY29uc3QgZW5kID0gcm9jVG9JU08oaXRlbS5vdXRfREFURSB8fCBcIlwiKTtcbiAgaWYgKCFzdGFydCkgcmV0dXJuIG51bGw7XG4gIC8vIGljZDljbSBuYW1lIG9uIFx1NEY0Rlx1OTY2MiBsaXN0IGlzIGp1c3QgQ2hpbmVzZSAobm8gfHwgRW5nbGlzaCBzcGxpdCBvYnNlcnZlZCkuXG4gIGNvbnN0IGljZENvZGUgPSBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgaWNkTmFtZSA9IHBpY2tFbmdsaXNoKGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fbmFtZSB8fCBcIlwiKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlOiBzdGFydCxcbiAgICBlbmRfZGF0ZTogZW5kLFxuICAgIGNsYXNzOiBcIklNUFwiLFxuICAgIHR5cGVfZGlzcGxheTogXCJcdTRGNEZcdTk2NjJcIixcbiAgICBkZXBhcnRtZW50OiBcIlwiLFxuICAgIHByb3ZpZGVyOiBcIlwiLFxuICAgIHJlYXNvbjogaWNkTmFtZSA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lfWAgOiBpY2ROYW1lKSA6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgcm93X2lkOiBpdGVtLnJvd19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwM1MwMSAoXHU5MUFCXHU3NjQyXHU4Q0JCXHU3NTI4XHU3NTMzXHU1ODMxKSBpdGVtIHNoYXBlIFx1MjAxNCBmYXIgbW9yZSBjb21wbGV0ZSB0aGFuIHRoZSBvbGRlclxuLy8gSUhLRTMzMDFTMDIgdmlzaXQgbGlzdCAoNTEgdmlzaXRzIHZzIDYgZm9yIHRoZSB0ZXN0IHBhdGllbnQpLiBOSEknc1xuLy8gY2Fub25pY2FsIHNvdXJjZSBvZiB0cnV0aCBmb3IgXCJldmVyeSBiaWxsZWQgZW5jb3VudGVyXCIuXG4vLyAgIGhvc1BfSUQsIGhvc1BfQUJCUiwgaG9zcF91cmxcbi8vICAgZnVuQ19EQVRFICAgICAgICAgICAgICAoXHU2QzExXHU1NzBCIFlZWS9NTS9ERClcbi8vICAgaWNEOUNNX0NPREUgLyBpY0Q5Q01fQ09ERV9DTkFNRVxuLy8gICBvcklfVFlQRSAvIG9yaV90eXBlX25hbWUgICAoXCJJQ1x1NTM2MVx1OENDN1x1NjU5OVwiIC8gXCJcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTlcIikgXHUyMDE0IG9yaWdpbiwgTk9UIFx1OTU4MC9cdTYwMjUvXHU0RjRGXG4vLyAgIHBhcnRfQU1ULCBhcHBsX0RPVCwgXHUyMDI2ICAgKGJpbGxpbmcgXHUyMDE0IGRpc2NhcmRlZClcbi8vICAgcm9XX0lEICAgICAgICAgICAgICAgICAgZGV0YWlsIGtleSBmb3IgSUhLRTMzMDNTMDIgZmFuLW91dCAoUGhhc2UgQilcbi8vIFdlIGRvbid0IGhhdmUgdmlzaXQgY2xhc3MgKFx1OTU4MC9cdTYwMjUvXHU0RjRGKSBhdCB0aGUgbGlzdCBsZXZlbDsgdGhlIFMwMiBkZXRhaWxcbi8vIGhhcyBob3NwX0RBVEFfVFlQRV9OQU1FIChcIlx1ODk3Rlx1OTFBQlwiL1wiXHU0RTJEXHU5MUFCXCIvXCJcdTcyNTlcdTkxQUJcIikuIEZvciBub3cgZGVmYXVsdCBBTUIuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZShpdGVtLCBjbGFzc0hpbnQpIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFIHx8IGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUpIHJldHVybiBudWxsO1xuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY0Q5Q01fQ09ERSB8fCBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgaWNkTmFtZSA9IHBpY2tFbmdsaXNoKFxuICAgIGl0ZW0uaWNEOUNNX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9uYW1lIHx8IFwiXCJcbiAgKTtcbiAgLy8gY2xhc3MgZGVmYXVsdHMgdG8gQU1COyBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dCBtYXkgb3ZlcnJpZGUgdG9cbiAgLy8gRU1FUiAvIElNUCBiYXNlZCBvbiBob3NwX0RBVEFfVFlQRV9OQU1FIChcdTYwMjVcdThBM0EgLyBcdTRGNEZcdTk2NjIpLlxuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgZW5kX2RhdGU6IFwiXCIsXG4gICAgY2xhc3M6IGNsYXNzSGludCB8fCBcIkFNQlwiLFxuICAgIC8vIE9yaWdpbiBtYXJrZXIgaXNuJ3QgYSBjbGluaWNhbCBjbGFzcywgYnV0IHN0YXNoIGl0IGFzIHR5cGVfZGlzcGxheVxuICAgIC8vIHNvIGRvd25zdHJlYW0gc2VlcyB0aGUgTkhJIGxhYmVsIHdpdGhvdXQgdXMgaW52ZW50aW5nIG9uZS5cbiAgICB0eXBlX2Rpc3BsYXk6IGl0ZW0ub3JpX3R5cGVfbmFtZSB8fCBpdGVtLm9ySV9UWVBFX05BTUUgfHwgXCJcIixcbiAgICBkZXBhcnRtZW50OiBcIlwiLFxuICAgIHByb3ZpZGVyOiBcIlwiLFxuICAgIHJlYXNvbjogaWNkTmFtZSA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lfWAgOiBpY2ROYW1lKSA6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gUGFzcyB0aHJvdWdoIGZvciB0aGUgZXZlbnR1YWwgSUhLRTMzMDNTMDIgZGV0YWlsIGZldGNoIChQaGFzZSBCKS5cbiAgICByb3dfaWQ6IGl0ZW0ucm9XX0lEIHx8IGl0ZW0ucm93X2lkIHx8IFwiXCIsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEFsbGVyZ3koaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBhbGxlcmdlbiA9XG4gICAgaXRlbS5hbGxlcmdlbl9uYW1lIHx8IGl0ZW0uYWxsZVJfTkFNRSB8fCBpdGVtLm1lZG5hbWUgfHxcbiAgICBpdGVtLmRydUdfTkFNRSB8fCBpdGVtLmFsbGVyZ2VuIHx8IFwiXCI7XG4gIGlmICghYWxsZXJnZW4pIHJldHVybiBudWxsO1xuICByZXR1cm4ge1xuICAgIHJlY29yZGVkX2RhdGU6IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFIHx8IGl0ZW0ucmVjb3JEX0RBVEUgfHwgXCJcIiksXG4gICAgZGlzcGxheTogYWxsZXJnZW4sXG4gICAgY2F0ZWdvcnk6IFwibWVkaWNhdGlvblwiLFxuICAgIGNyaXRpY2FsaXR5OiBcInVuYWJsZS10by1hc3Nlc3NcIixcbiAgICByZWFjdGlvbjogaXRlbS5yZWFjdGlvTiB8fCBpdGVtLnN5bXB0b20gfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDFTMDUgKFx1ODY1NVx1N0Y2RS9cdTYyNEJcdTg4NTMgbGlzdCkgc2hhcGU6XG4vLyAgIHtob3NwX2lkLCBob3NwX2FiYnIsIGhvc3BfdXJsLCBvcmlfdHlwZV9uYW1lLCBvcmlfdHlwZSwgZnVuY19kYXRlLFxuLy8gICAgb3V0X2RhdGUsIGljZDljbV9jb2RlLCBpY2Q5Y21fY29kZV9jbmFtZSwgb3BfY29kZV9jbmFtZSwgcm93X2lkfVxuLy8gTm90ZTogbm8gcHJvY2VkdXJlIENPREUgaW4gbGlzdCBcdTIwMTQgb3BfY29kZV9jbmFtZSBpcyB0aGUgb25seSBsYWJlbC5cbi8vIERhdGUgbm90ZTogTkhJIGRvZXNuJ3QgZXhwb3NlIGEgc2VwYXJhdGUgXCJhY3R1YWwgcHJvY2VkdXJlIGRhdGVcIiBoZXJlLFxuLy8gc28gZm9yIGlucGF0aWVudCBwcm9jZWR1cmVzICh3aGVyZSBmdW5jX2RhdGUgPSBhZG1pc3Npb24sIG91dF9kYXRlID1cbi8vIGRpc2NoYXJnZSkgd2UgZGVsaWJlcmF0ZWx5IHVzZSBmdW5jX2RhdGUgYXMgdGhlIGFuY2hvci4gVGhlIHByb2NlZHVyZVxuLy8gXCJoYXBwZW5lZCBzb21ld2hlcmUgaW4gdGhpcyBhZG1pc3Npb25cIiBcdTIwMTQgYW5jaG9yaW5nIHRvIHRoZSBzdGFydCBkYXlcbi8vIGlzIGEgc21hbGwgbG9zcyBvZiBhY2N1cmFjeSB2cy4gaW52ZW50aW5nIGEgcGVyZm9ybWVkUGVyaW9kIHRoYXQgd291bGRcbi8vIHN1Z2dlc3QgdGhlIHByb2NlZHVyZSBzcGFubmVkIHRoZSB3aG9sZSBzdGF5LlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0UHJvY2VkdXJlKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuY19kYXRlIHx8IGl0ZW0uZnVuQ19EQVRFKTtcbiAgY29uc3QgZGlzcGxheSA9IHBpY2tFbmdsaXNoKFxuICAgIGl0ZW0ub3BfY29kZV9jbmFtZSB8fCBpdGVtLnByb0NfTkFNRSB8fCBpdGVtLm9yZGVSX05BTUUgfHwgXCJcIlxuICApO1xuICBpZiAoIWRhdGUgfHwgIWRpc3BsYXkpIHJldHVybiBudWxsO1xuICAvLyBEaWFnbm9zaXMgKGljZDljbV9jb2RlX2NuYW1lKSBpcyB0aGUgKnJlYXNvbiogZm9yIHRoZSBwcm9jZWR1cmUsIG5vdFxuICAvLyB0aGUgcHJvY2VkdXJlIGNvZGUgaXRzZWxmLiBTdGFzaCBpdCBpbiBgbm90ZWAgc28gaXQgc2hvd3MgdXAgaW4gdGhlXG4gIC8vIEZISVIgcmVzb3VyY2Ugd2l0aG91dCBwb2xsdXRpbmcgdGhlIGNvZGUgZmllbGQuXG4gIGNvbnN0IHJlYXNvbkNvZGUgPSBpdGVtLmljZDljbV9jb2RlIHx8IGl0ZW0uaWNkOWNtX0NPREUgfHwgXCJcIjtcbiAgY29uc3QgcmVhc29uTmFtZSA9IHBpY2tFbmdsaXNoKGl0ZW0uaWNkOWNtX2NvZGVfY25hbWUgfHwgaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBcIlwiKTtcbiAgY29uc3Qgbm90ZSA9IHJlYXNvbk5hbWVcbiAgICA/IChyZWFzb25Db2RlID8gYFJlYXNvbjogJHtyZWFzb25Db2RlfSAke3JlYXNvbk5hbWV9YCA6IGBSZWFzb246ICR7cmVhc29uTmFtZX1gKVxuICAgIDogXCJcIjtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IFwiXCIsXG4gICAgZGlzcGxheSxcbiAgICBub3RlLFxuICAgIGJvZHlfc2l0ZTogXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NwX2FiYnIgfHwgaXRlbS5ob3NQX0FCQlIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTM0MDhTMDEgKFx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNSBsaXN0KSBzaGFwZTpcbi8vICAge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIHJlYWxfSU5TUEVDVF9EQVRFLCBvcmRlcl9DT0RFLFxuLy8gICAgb3JkZXJfQ09ERV8yV29yZCwgb3JkZXJfTkFNRSwgb3JpX1RZUEUsIHJvd19JRCwganBHX1NUQVRVUywgLi4ufVxuLy8gTm8gZmluZGluZ3MvY29uY2x1c2lvbiBcdTIwMTQgbGlzdCBpcyBvcmRlci1sZXZlbCBvbmx5LiBXZSBtYXAgdG8gUHJvY2VkdXJlXG4vLyAoYW4gZXhhbSB3YXMgcGVyZm9ybWVkKSByYXRoZXIgdGhhbiBEaWFnbm9zdGljUmVwb3J0ICh3aGljaCBuZWVkcyBhXG4vLyBuYXJyYXRpdmUpLiBJZi93aGVuIHdlIGZldGNoIHRoZSBhY3R1YWwgcmVwb3J0IHRoaXMgYmVjb21lcyBhIERSLlxuLy8gSUhLRTM0MDhTMDIgZGV0YWlsIHByb3ZpZGVzIHRoZSBmdWxsIHJhZGlvbG9neSAvIGVuZG9zY29weSByZXBvcnQgaW5cbi8vIGBkZXNjYC4gQ29tYmluZWQgd2l0aCBvcmRlcl9OQU1FICsgdGhlIGV4YW0gZGF0ZSB0aGlzIGlzIGEgcHJvcGVyIEZISVJcbi8vIERpYWdub3N0aWNSZXBvcnQuIExpc3Qtb25seSBlbnRyaWVzICh3aGVyZSB0aGUgZGV0YWlsIGZldGNoIHJldHVybmVkXG4vLyBubyBgZGVzY2ApIGdldCBkcm9wcGVkIFx1MjAxNCB3aXRob3V0IGEgbmFycmF0aXZlIHRoZSByZXBvcnQgbWFwcGVyIHdvdWxkXG4vLyByZWplY3QgdGhlbSBhbnl3YXkuXG4vL1xuLy8gRGF0ZSBmaWVsZCBjaG9pY2UgXHUyMDE0IElIS0UzNDA4UzAyIGRldGFpbCBwYXlsb2FkIGV4cG9zZXM6XG4vLyAgIC0gcmVhbF9JTlNQRUNUX0RBVEUgIFx1NUJFNlx1OTY5Qlx1NjNBMVx1NkFBMi9cdTUwNUFcdTVGNzFcdTUwQ0ZcdTY1RTUgKG1vc3QgYWNjdXJhdGUgd2hlbiBwcmVzZW50KVxuLy8gICAtIGZ1bmNfREFURSAgICAgICAgICBcdTVDMzFcdThBM0EvXHU1MTY1XHU5NjYyXHU2NUU1ICh2aXNpdCBhbmNob3IpXG4vLyAgIC0gYXNzYXlfVVBMT0FEX0RBVEUgIFx1NTgzMVx1NTQ0QVx1NEUwQVx1NTBCM1x1NjY0Mlx1OTU5MyAob2Z0ZW4gd2Vla3MgYWZ0ZXIgdGhlIGV4YW0gXHUyMDE0XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGJlbG9uZ3MgdG8gRGlhZ25vc3RpY1JlcG9ydC5pc3N1ZWQsIE5PVFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RpdmVEYXRlVGltZSlcbi8vIEluIHByYWN0aWNlIHJlYWxfSU5TUEVDVF9EQVRFIGlzIG9mdGVuIG51bGwgb24gdGhlIFMwMiBkZXRhaWxcbi8vIChjb25maXJtZWQgYWdhaW5zdCBsaXZlIE5ISSBwYXlsb2Fkcyk7IHdlIHRoZW4gZmFsbCBiYWNrIHRvXG4vLyBmdW5jX0RBVEUgcmF0aGVyIHRoYW4gdGhlIHVwbG9hZCB0aW1lLiBGYWxsaW5nIGJhY2sgdG8gdGhlXG4vLyB1cGxvYWQgZGF0ZSB3b3VsZCBsYW5kIHRoZSBleGFtIGluIGEgZGF0ZSB0aGF0J3MgZXZlbiBmdXJ0aGVyXG4vLyBmcm9tIHJlYWxpdHkgKGUuZy4gQ1QgZG9uZSAyMDI2LzAxLzE0LCB1cGxvYWQgMjAyNi8wMi8yNCBcdTIxOTIgdXNpbmdcbi8vIHVwbG9hZCBkYXRlIHdvdWxkIHNheSBcImhhZCBhIENUIG9uIDIwMjYvMDIvMjRcIiB3aGljaCBpcyB3cm9uZykuXG4vLyBmdW5jX0RBVEUgYXQgd29yc3QgbWVhbnMgXCJleGFtIGhhcHBlbmVkIGR1cmluZyB0aGlzIGFkbWlzc2lvblwiLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oXG4gICAgaXRlbS5yZWFsX0lOU1BFQ1RfREFURSB8fCBpdGVtLnJlYWxfaW5zcGVjdF9kYXRlIHx8XG4gICAgaXRlbS5mdW5jX0RBVEUgfHwgaXRlbS5mdW5jX2RhdGUgfHwgXCJcIixcbiAgKTtcbiAgY29uc3QgZGlzcGxheSA9IHBpY2tFbmdsaXNoKGl0ZW0ub3JkZXJfTkFNRSB8fCBpdGVtLm9yZGVyX25hbWUgfHwgXCJcIik7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoaXRlbS5kZXNjIHx8IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5IHx8ICFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IGl0ZW0ub3JkZXJfQ09ERSB8fCBpdGVtLm9yZGVyX2NvZGUgfHwgXCJcIixcbiAgICBzeXN0ZW06IFwiXCIsXG4gICAgZGlzcGxheSxcbiAgICBjYXRlZ29yeTogXCJSQURcIixcbiAgICBjb25jbHVzaW9uLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIE5ISSBzZXBhcmF0ZXMgdGhlIGV4YW0gZGF0ZSAoZnVuY19EQVRFKSBmcm9tIHRoZSByZXBvcnQtdXBsb2FkXG4gICAgLy8gdGltZXN0YW1wIChhc3NheV9VUExPQURfREFURSkuIFRoZSBsYXR0ZXIgaXMgd2hlbiB0aGUgcmVwb3J0XG4gICAgLy8gd2FzIGZpbmFsaXNlZCBpbiBOSEkncyBzeXN0ZW0gXHUyMDE0IG1hcHMgdG8gRGlhZ25vc3RpY1JlcG9ydC5pc3N1ZWQuXG4gICAgLy8gRmFsbHMgYmFjayB0byBOb25lIGlmIE5ISSBkaWRuJ3Qgc2hpcCBvbmUuXG4gICAgaXNzdWVkOiByb2NUb0lTTygoaXRlbS5hc3NheV9VUExPQURfREFURSB8fCBcIlwiKS5zcGxpdCgvXFxzKy8pWzBdKSxcbiAgfTtcbn1cbiIsICIvLyBOSEkgQVBJIGVuZHBvaW50IHJlZ2lzdHJ5IFx1MjAxNCB3aGF0IHdlIGZldGNoLCB3aGVyZSBlYWNoIHJvdyBnb2VzLFxuLy8gd2hpY2ggYWRhcHRlciB0byBjYWxsIG9uIGl0LlxuLy9cbi8vIEV4dHJhY3RlZCBmcm9tIGJhY2tncm91bmQuanMgc28gd2UgY2FuOlxuLy8gICAxLiBVbml0LXRlc3QgXCJldmVyeSBlbmRwb2ludCBuYW1lIGhhcyBhIENoaW5lc2UgbGFiZWxcIiBcdTIwMTQgaGlzdG9yaWNhbGx5XG4vLyAgICAgIGl0IHdhcyBlYXN5IHRvIGFkZCBhIG5ldyBlbmRwb2ludCBhbmQgZm9yZ2V0IHRvIHVwZGF0ZVxuLy8gICAgICBFTkRQT0lOVF9MQUJFTF9aSCwgbGVhdmluZyB0aGUgcG9wdXAncyBcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzAgcm93IGxhYmVsbGVkIHdpdGhcbi8vICAgICAgdGhlIGRldi1mbGF2b3VyZWQgcmF3IGtleSAoXCJvdGhlcl9sYWJzXCIgaW5zdGVhZCBvZiBcIlx1NkFBMlx1OUE1N1wiKS5cbi8vICAgMi4gS2VlcCBiYWNrZ3JvdW5kLmpzIGZvY3VzZWQgb24gZmxvdyBjb250cm9sICsgdGFiL0lPIGxvZ2ljLlxuLy9cbi8vIEFkYXB0ZXIgcmVmZXJlbmNlcyBsaXZlIGluIC4vbmhpLWFkYXB0ZXJzLmpzLiBTZWUgdGhhdCBtb2R1bGUgZm9yIHRoZVxuLy8gcGVyLWFkYXB0ZXIgZmllbGQtcHJpb3JpdHkgZGVjaXNpb25zIChkYXRlIHNlbGVjdGlvbiwgbmFtZSBmYWxsYmFja3MsXG4vLyBiaWxpbmd1YWwgc3BsaXR0aW5nLCBldGMuKS5cblxuaW1wb3J0IHtcbiAgYWRhcHRBZHVsdFByZXZlbnRpdmUsXG4gIGFkYXB0QWxsZXJneSxcbiAgYWRhcHRDYXRhc3Ryb3BoaWNJbGxuZXNzLFxuICBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlLFxuICBhZGFwdEltYWdpbmdMaXN0U3R1YixcbiAgYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIsXG4gIGFkYXB0TGFiSXRlbSxcbiAgYWRhcHRNZWRpY2F0aW9uLFxuICBhZGFwdFByb2NlZHVyZSxcbn0gZnJvbSBcIi4vbmhpLWFkYXB0ZXJzLmpzXCI7XG5cbi8vIFVzZXItZmFjaW5nIGxhYmVsIGZvciBlYWNoIGVuZHBvaW50IG5hbWUuIFRoZSBicmVha2Rvd24gY29sbGFwc2libGVcbi8vIGluIHRoZSBwb3B1cCAoXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIikgcmVhZHMgZnJvbSB0aGlzIHNvIHVzZXJzIHNlZSBcIlx1NUMzMVx1OTFBQiAxMiBcdTdCNDZcIlxuLy8gaW5zdGVhZCBvZiB0aGUgZGV2LWZsYXZvdXJlZCBcImVuY291bnRlcnM9MTIvMTJcIi4gVW5rbm93biBuYW1lcyBmYWxsXG4vLyB0aHJvdWdoIHRvIHRoZSByYXcga2V5LCB3aGljaCBrZWVwcyBpdCBvYnZpb3VzIGR1cmluZyBkZXZlbG9wbWVudFxuLy8gd2hlbiB3ZSBhZGQgYSBuZXcgZW5kcG9pbnQgYW5kIGhhdmVuJ3QgbGFiZWxsZWQgaXQgeWV0LlxuZXhwb3J0IGNvbnN0IEVORFBPSU5UX0xBQkVMX1pIID0ge1xuICBlbmNvdW50ZXJzOiBcIlx1NUMzMVx1OTFBQlwiLFxuICBpbnBhdGllbnQ6IFwiXHU0RjRGXHU5NjYyXCIsXG4gIGlucGF0aWVudF9sZWdhY3k6IFwiXHU0RjRGXHU5NjYyXHVGRjA4XHU4MjBBXHVGRjA5XCIsXG4gIHByb2NlZHVyZXM6IFwiXHU2MjRCXHU4ODUzIC8gXHU4NjU1XHU3RjZFXCIsXG4gIG1lZGljYXRpb25zOiBcIlx1ODY1NVx1NjVCOVx1ODVFNVx1NTRDMVwiLFxuICBhbGxlcmdpZXM6IFwiXHU4NUU1XHU3MjY5XHU5MDRFXHU2NTRGXCIsXG4gIGFsbGVyZ2llc19iOiBcIlx1ODVFNVx1NzI2OVx1OTA0RVx1NjU0Rlx1RkYwOEJcdUZGMDlcIixcbiAgYWR1bHRfcHJldmVudGl2ZTogXCJcdTYyMTBcdTRFQkFcdTUwNjVcdTZBQTJcIixcbiAgY2FuY2VyX3NjcmVlbmluZzogXCJcdTc2NENcdTc1QzdcdTdCRTlcdTZBQTJcIixcbiAgaW1hZ2luZzogXCJcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTVcIixcbiAgb3RoZXJfbGFiczogXCJcdTZBQTJcdTlBNTdcIixcbiAgY2F0YXN0cm9waGljX2lsbG5lc3M6IFwiXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1XCIsXG59O1xuXG4vLyBwYWdlX3R5cGUgXHUyMTkyIGJhY2tlbmQgcGFnZV90eXBlIHN0cmluZyB1c2VkIGJ5IG1hcHBlcnMuXG4vLyBwYXRoIGlzIHJlbGF0aXZlIHRvIG5oaUJhc2UuIG1ldGhvZCBkZWZhdWx0IFwiR0VUXCIuXG4vLyBgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWVgID0gZW5kcG9pbnQgYWNjZXB0cyBzX2RhdGUgLyBlX2RhdGUgaW4gXHU2QzExXHU1NzBCIGZvcm1hdC5cbi8vIENvbmZpcm1lZCB2aWEgVVJMcyBvYnNlcnZlZCBpbiBOSEkncyBTUEEuIE90aGVyIGVuZHBvaW50cyBlaXRoZXIgZG9uJ3Rcbi8vIGFjY2VwdCByYW5nZSBwYXJhbXMsIG9yIE5ISSByZWplY3RzIHVua25vd24gcGFyYW1zIFx1MjAxNCB3ZSBsZWF2ZSB0aGVtIGFsb25lXG4vLyAodGhleSBmYWxsIGJhY2sgdG8gdGhlaXIgZGVmYXVsdCB3aW5kb3csIHR5cGljYWxseSAxLTIgeWVhcnMpLlxuZXhwb3J0IGNvbnN0IE5ISV9BUElfRU5EUE9JTlRTID0gW1xuICAvLyBlbmNvdW50ZXJzIC8gcHJvY2VkdXJlcyBkb24ndCBoYXZlIGEgL3NlYXJjaCB2YXJpYW50ICg0MDQpLiBwYWdlX2xvYWRcbiAgLy8gc2lsZW50bHkgaWdub3JlcyBzX2RhdGUgLyBlX2RhdGUgXHUyMDE0IHZlcmlmaWVkIHRoZSBhcnJheSBsZW5ndGggaXNcbiAgLy8gaWRlbnRpY2FsIHdpdGggb3Igd2l0aG91dCBkYXRlcy4gRGF0ZSBmaWx0ZXIgaXMgZWZmZWN0aXZlbHkgdW5zdXBwb3J0ZWRcbiAgLy8gZm9yIHRoZXNlIGVuZHBvaW50czsgdGhleSByZXR1cm4gYWxsIGRhdGEgaW4gTkhJJ3MgbGlmZXRpbWUgd2luZG93LlxuICAvLyBFbmNvdW50ZXIgc291cmNlOiBJSEtFMzMwM1MwMSAoXHU5MUFCXHU3NjQyXHU4Q0JCXHU3NTI4XHU3NTMzXHU1ODMxKS4gVGhlIC9wYWdlX2xvYWQgdmFyaWFudFxuICAvLyBpcyB3aW5kb3ctbGltaXRlZCB0byB+MSB5ZWFyIChyZXR1cm5lZCA1MSB2aXNpdHMgZW5kaW5nIDExNC8wNSk7XG4gIC8vIC9zZWFyY2ggYWNjZXB0cyBzX2RhdGUgLyBlX2RhdGUgYW5kIGdvZXMgYmFjayBmdXJ0aGVyICgxNjIgdmlzaXRzXG4gIC8vIHRvIDExMi8wNSBmb3IgdGhlIHNhbWUgcGF0aWVudCkuIFNpbmNlIGxhYnMvbWVkcyBleHRlbmQgdG8gM3kgdmlhXG4gIC8vIHRoZWlyIG93biAvc2VhcmNoIGVuZHBvaW50cywgZW5jb3VudGVyIE1VU1QgYWxzbyB1c2UgL3NlYXJjaCBvclxuICAvLyB0aGUgKGhvc3BpdGFsLCBkYXRlKSBsaW5rZXIgaGFzIG5vdGhpbmcgdG8gbWF0Y2ggYWdhaW5zdCBmb3Igb2xkZXJcbiAgLy8gbGFiIGRhdGVzLlxuICB7IG5hbWU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDNzMDEvc2VhcmNoP3NfZGF0ZT0mZV9kYXRlPVwiLFxuICAgIHBhZ2VfdHlwZTogXCJlbmNvdW50ZXJzXCIsICAgICAgICBhZGFwdDogYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbiAgLy8gSW5wYXRpZW50IChcdTRGNEZcdTk2NjIpIFx1MjAxNCBJSEtFMzMwOVMwMSBpcyB0aGUgcHJpbWFyeSBsaXN0IHdpdGggaW5fREFURS9vdXRfREFURVxuICAvLyBzcGFuLiBJSEtFMzMwOFMwMSBjYXJyaWVzIGEgc21hbGwgc2V0IG9mIG9sZGVyIFx1NEY0Rlx1OTY2MiByZWNvcmRzIHdpdGggdGhlXG4gIC8vIHNhbWUgZmllbGRzIChmdW5jX0RBVEUgaW4gc29tZSByb3dzIGluc3RlYWQgb2YgaW5fREFURTsgYWRhcHRlclxuICAvLyBoYW5kbGVzIGJvdGgpLiBCb3RoIGZlZWQgdGhlIHNhbWUgZW5jb3VudGVyIG1hcHBlci5cbiAgeyBuYW1lOiBcImlucGF0aWVudFwiLCAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA5czAxL3BhZ2VfbG9hZFwiLFxuICAgIHBhZ2VfdHlwZTogXCJlbmNvdW50ZXJzXCIsICAgICAgICBhZGFwdDogYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIgfSxcbiAgeyBuYW1lOiBcImlucGF0aWVudF9sZWdhY3lcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA4czAxL3BhZ2VfbG9hZFwiLFxuICAgIHBhZ2VfdHlwZTogXCJlbmNvdW50ZXJzXCIsICAgICAgICBhZGFwdDogYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIgfSxcbiAgeyBuYW1lOiBcInByb2NlZHVyZXNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAxczA1L3BhZ2VfbG9hZFwiLFxuICAgIHBhZ2VfdHlwZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICBhZGFwdDogYWRhcHRQcm9jZWR1cmUgfSxcbiAgLy8gbWVkaWNhdGlvbnM6IHBhZ2VfbG9hZCBvbmx5IGFjY2VwdHMgZW1wdHkgZGF0ZXMgKEhUVFAgNDAwIG90aGVyd2lzZSkuXG4gIC8vIFRoZSAvc2VhcmNoIGVuZHBvaW50IGlzIHdoYXQgdGhlIFNQQSBoaXRzIHdoZW4gdXNlciBwaWNrcyBhIGN1c3RvbVxuICAvLyBkYXRlIHJhbmdlIGFuZCBhY2NlcHRzIElTTyBcdTg5N0ZcdTUxNDMgZGF0ZXMgd2l0aCBkYXNoZXMgKDIwMjMtMDEtMDEpLlxuICAvLyBDb25maXJtZWQgdmlhIERldlRvb2xzIG9ic2VydmF0aW9uIG9mIHRoZSBcdTdCRTlcdTkwNzggcGFuZWwgc3VibWl0LlxuICB7IG5hbWU6IFwibWVkaWNhdGlvbnNcIiwgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDZzMDEvc2VhcmNoP3NfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTEmc190eXBlPUFcIixcbiAgICBwYWdlX3R5cGU6IFwibWVkaWNhdGlvbnNcIiwgICAgICAgYWRhcHQ6IGFkYXB0TWVkaWNhdGlvbiwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbiAgeyBuYW1lOiBcImFsbGVyZ2llc1wiLCAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAyczAxL1NQX0lIS0UzMjAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcImFsbGVyZ2llc1wiLCAgICAgICAgIGFkYXB0OiBhZGFwdEFsbGVyZ3kgfSxcbiAgeyBuYW1lOiBcImFsbGVyZ2llc19iXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAyczAxL1NQX0lIS0UzMjAyUzA0XCIsXG4gICAgcGFnZV90eXBlOiBcImFsbGVyZ2llc1wiLCAgICAgICAgIGFkYXB0OiBhZGFwdEFsbGVyZ3kgfSxcbiAgLy8gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1XHU3RDUwXHU2NzlDIChJSEtFMzQwMlMwMSk6IG9uZSByb3cgcGVyIHNjcmVlbmluZywgY29udGFpbnNcbiAgLy8gQk1JIC8gdml0YWxzIC8gbGlwaWQgcGFuZWwgLyBMRlQgLyBSRlQgLyBIZXAgQi9DIC8gdXJpYyBhY2lkIGFsbFxuICAvLyBwcmUtY29tcHV0ZWQgYnkgTkhJJ3Mgc2NyZWVuaW5nIHByb2dyYW1tZS4gYWRhcHRBZHVsdFByZXZlbnRpdmVcbiAgLy8gcmV0dXJucyBhbiBhcnJheSAob25lIE9ic2VydmF0aW9uIHBlciBtZWFzdXJlbWVudCkgc28gdGhlXG4gIC8vIGFkYXB0ZXItY2FsbCBsb29wIGZsYXR0ZW5zIGl0LlxuICB7IG5hbWU6IFwiYWR1bHRfcHJldmVudGl2ZVwiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDJzMDEvU1BfSUhLRTM0MDJTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0QWR1bHRQcmV2ZW50aXZlIH0sXG4gIHsgbmFtZTogXCJjYW5jZXJfc2NyZWVuaW5nXCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwNHMwMS9TUF9JSEtFMzQwNFMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtIH0sXG4gIC8vIGdsdWNvc2UgKElIS0UzNDA2UzAxKSArIGxpcGlkIChJSEtFMzQwN1MwMSkgYXJlIHN1YnNldHMgb2ZcbiAgLy8gb3RoZXJfbGFicyAoSUhLRTM0MDlTMDEpIHBlciBOSEkncyBkYXRhIG1vZGVsIFx1MjAxNCBmZXRjaGluZyB0aGVtXG4gIC8vIHNlcGFyYXRlbHkganVzdCBjcmVhdGVzIGR1cCBvYnNlcnZhdGlvbnMsIHNvIHdlIHNraXAgdGhlbS5cbiAgLy8gSW1hZ2luZyBsaXN0IChJSEtFMzQwOFMwMSkgb25seSBjYXJyaWVzIG9yZGVyLWxldmVsIGRhdGE7IGZ1bGxcbiAgLy8gbmFycmF0aXZlIHJlcG9ydCBsaXZlcyBhdCBJSEtFMzQwOFMwMi4gV2UgZG8gYSAyLXN0ZXAgZmV0Y2ggKHNlZVxuICAvLyBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKSB0byBncmFiIHRoZSByZXBvcnQsIHRoZW4gbWFwIHRvIGEgcmVhbFxuICAvLyBEaWFnbm9zdGljUmVwb3J0LiBUaGUgbGlzdCBhZGFwdGVyIGlzIGEgbm8tb3Agc3R1YiBsaWtlIG1lZGljYXRpb25zLlxuICAvLyBpbWFnaW5nOiBzZWFyY2ggZW5kcG9pbnQgYWNjZXB0cyBJU08gZGF0ZSByYW5nZSBsaWtlIG1lZGljYXRpb25zLlxuICB7IG5hbWU6IFwiaW1hZ2luZ1wiLCAgICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDhzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJkaWFnbm9zdGljX3JlcG9ydHNcIiwgYWRhcHQ6IGFkYXB0SW1hZ2luZ0xpc3RTdHViLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBvdGhlcl9sYWJzIGFscmVhZHkgdXNlcyAvc2VhcmNoOyBzYW1lIElTTy1kYXNoIGRhdGUgZm9ybWF0IHdvcmtzLlxuICB7IG5hbWU6IFwib3RoZXJfbGFic1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDlzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBJSEtFMzIwOVMwMSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KSBcdTIwMTQgTkhJLXZldHRlZCBjYXRhc3Ryb3BoaWMtaWxsbmVzcyByZWdpc3RyeS5cbiAgLy8gRWFjaCByb3cgXHUyMTkyIGEgRkhJUiBDb25kaXRpb24gd2l0aCBjYXRlZ29yeT1wcm9ibGVtLWxpc3QtaXRlbSwgdGhlXG4gIC8vIGNsb3Nlc3QgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGVxdWl2YWxlbnQgdG8gYSBjdXJhdGVkIHByb2JsZW0gbGlzdC4gRW5kcG9pbnRcbiAgLy8gZG9lc24ndCBhY2NlcHQgZGF0ZSBwYXJhbXMgKE5ISSByZXR1cm5zIGN1cnJlbnRseS12YWxpZCBjZXJ0cyBvbmx5KS5cbiAgeyBuYW1lOiBcImNhdGFzdHJvcGhpY19pbGxuZXNzXCIsIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwOXMwMS9TUF9JSEtFMzIwOVMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJjb25kaXRpb25zXCIsICAgICAgICBhZGFwdDogYWRhcHRDYXRhc3Ryb3BoaWNJbGxuZXNzIH0sXG5dO1xuIiwgIi8vIFNlcnZpY2Ugd29ya2VyIGZvciBOSEktRkhJUiBCcmlkZ2UgXHUyMDE0IG93bnMgdGhlIGxvbmctcnVubmluZ1xuLy8gXCJTeW5jIFRoaXMgUGF0aWVudFwiIHdvcmtmbG93IHNvIHRoZSBwb3B1cCBjYW4gY2xvc2UgbWlkLXN5bmMgd2l0aG91dFxuLy8gYWJvcnRpbmcgaXQuXG4vL1xuLy8gTGlmZWN5Y2xlOlxuLy8gICAtIHBvcHVwIHBvc3RzIHt0eXBlOiBcInN0YXJ0TmhpQXBpU3luY1wiLCBwYXlsb2FkfSAgXHUyMTkyIE5ISSBKU09OLUFQSSBzeW5jXG4vLyAgIC0gYmFja2dyb3VuZCBydW5zIHRoZSBmdWxsIHN5bmMgc2VxdWVuY2UsIHVwZGF0aW5nIGNocm9tZS5zdG9yYWdlLmxvY2FsXG4vLyAgIC0gcG9wdXAgcmVhZHMgY2hyb21lLnN0b3JhZ2UubG9jYWwgb24gcmVvcGVuIHRvIHNob3cgcHJvZ3Jlc3Ncbi8vXG4vLyBNb2Rlczpcbi8vICAgLSBcImxvY2FsXCIgICBcdTIxOTIgYWZ0ZXIgTkhJIGZldGNoLCBydW4gbWFwcGVycyBpbi1leHRlbnNpb24sIGRvd25sb2FkIGFcbi8vICAgICAgICAgICAgICAgICBGSElSIEJ1bmRsZSB0byB0aGUgdXNlcidzIG1hY2hpbmUuIE5vIGJhY2tlbmQgcmVxdWlyZWQuXG4vLyAgIC0gXCJiYWNrZW5kXCIgXHUyMTkyIFBPU1QgcGVyLXBhZ2VfdHlwZSBpdGVtcyB0byAvc3luYy91cGxvYWQtc3RydWN0dXJlZFxuLy8gICAgICAgICAgICAgICAgIChleGlzdGluZyBiZWhhdmlvdXIpOyBkYXNoYm9hcmQgKyBTTUFSVCBhcHAgdXNlIHRoZVxuLy8gICAgICAgICAgICAgICAgIGJhY2tlbmQncyBGSElSIHN0b3JlLlxuXG5pbXBvcnQge1xuICBHUk9VUF9IQU5ETEVSUyxcbiAgTElTVF9IQU5ETEVSUyxcbiAgZGVkdXBBZG1pc3Npb25EYXlBbWIsXG4gIGRlcml2ZVBhdGllbnRJZCxcbiAgbGlua0VuY291bnRlcnNJblJlc291cmNlcyxcbiAgbWFwUGF0aWVudCxcbiAgbWFza0lkLFxuICBtYXNrTmFtZSxcbiAgcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMsXG59IGZyb20gXCJAbmhpLWZoaXItYnJpZGdlL21hcHBlclwiO1xuaW1wb3J0IHtcbiAgLy8gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSBpcyBpbnZva2VkIGRpcmVjdGx5IGZyb20gdGhlXG4gIC8vIElIS0UzMzAzUzAyIGRldGFpbCBmYW4tb3V0IChvdmVycmlkZXMgdGhlIHJlZ2lzdHJ5J3MgY2xhc3NIaW50XG4gIC8vIHdpdGggXHU2MDI1XHU4QTNBL1x1NEY0Rlx1OTY2MiBkZXJpdmVkIGZyb20gdGhlIGRldGFpbCBib2R5KSwgc28gaXQgbmVlZHMgdG8gYmVcbiAgLy8gYSBuYW1lZCBpbXBvcnQgXHUyMDE0IG5vdCBvbmx5IHJlYWNoYWJsZSB2aWEgTkhJX0FQSV9FTkRQT0lOVFNbaV0uYWRhcHQuXG4gIC8vIEZvcmdldHRpbmcgdGhpcyByZS1pbXBvcnQgYWZ0ZXIgZXh0cmFjdGluZyB0aGUgZW5kcG9pbnQgcmVnaXN0cnlcbiAgLy8gaW4gdjAuNi4zIHNoaXBwZWQgYSBSZWZlcmVuY2VFcnJvciB0aGF0IG9ubHkgZmlyZWQgaW4gcHJvZHVjdGlvblxuICAvLyBzeW5jcyB3aXRoIG5vbi1lbXB0eSBlbmNvdW50ZXJzLiBUZXN0cyBkb24ndCBleGVyY2lzZSB0aGF0IHBhdGhcbiAgLy8gXHUyMDE0IHNlZSBUT0RPX0ZPTExPV1VQIGZvciBhIFNXLWZsb3cgaW50ZWdyYXRpb24gdGVzdCBpZGVhLlxuICBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlLFxuICBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsLFxuICBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsLFxuICBpc29Ub1JPQyxcbiAgcGlja0VuZ2xpc2gsXG4gIHJvY1RvSVNPLFxufSBmcm9tIFwiLi9uaGktYWRhcHRlcnMuanNcIjtcbmltcG9ydCB7IEVORFBPSU5UX0xBQkVMX1pILCBOSElfQVBJX0VORFBPSU5UUyB9IGZyb20gXCIuL25oaS1lbmRwb2ludHMuanNcIjtcblxuY29uc3QgU1RPUkFHRV9LRVkgPSBcInN5bmNTdGF0dXNcIjtcbmNvbnN0IHNsZWVwID0gKG1zKSA9PiBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBtcykpO1xuXG4vLyBDYW5jZWxsYXRpb24gZmxhZyBzZXQgYnkgcG9wdXAncyBzdG9wIGJ1dHRvbi4gQ2hlY2tlZCBhdCBzdHJhdGVnaWMgcG9pbnRzXG4vLyBpbiBydW5OaGlBcGlTeW5jIChiZXR3ZWVuIHBoYXNlcywgYmVmb3JlIGVhY2ggZGV0YWlsIHBhZ2UpIHNvIHRoZVxuLy8gaW4tcHJvZ3Jlc3Mgc3luYyBleGl0cyBwcm9tcHRseSB3aGVuIHRoZSB1c2VyIGhpdHMgU3RvcC4gQ2xlYXJlZCBhdCB0aGVcbi8vIHN0YXJ0IG9mIGVhY2ggbmV3IHN5bmMgcnVuLlxubGV0IF9jYW5jZWxsZWQgPSBmYWxzZTtcbi8vIENvbnRleHQgZm9yIHRoZSBpbi1mbGlnaHQgc3luYyBzbyB0aGUgc3RvcFN5bmMgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4vLyBkYXRhIHdpdGhvdXQgdGhlIHBvcHVwIG5lZWRpbmcgdG8gcGFzcyBpdCBiYWNrLiBTZXQgYXQgdGhlIHRvcCBvZlxuLy8gcnVuTmhpQXBpU3luYzsgY2xlYXJlZCBvbiBjb21wbGV0aW9uIChzdWNjZXNzL2ZhaWx1cmUvY2FuY2VsKS5cbmxldCBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG5jb25zdCBDQU5DRUxfRVJST1IgPSBcIl9fU1lOQ19DQU5DRUxMRURfX1wiO1xuLy8gVGhyb3duIHdoZW4gTkhJIGRldGVjdHMgdGhlIHNlc3Npb24gaGFzIGV4cGlyZWQgKGxvZ2luIHBhZ2UgcmVuZGVyZWQsIG9yXG4vLyB0YWIgcmVkaXJlY3RlZCB0byBhdXRoIG5hbWVzcGFjZSkuIEFib3J0cyBzeW5jIGltbWVkaWF0ZWx5IHNvIHRoZSB1c2VyIGNhblxuLy8gcmUtbG9naW4gYW5kIHJldHJ5IGluc3RlYWQgb2YgdGltaW5nIG91dCBvbiBldmVyeSByZW1haW5pbmcgcGFnZS5cbmNvbnN0IFNFU1NJT05fRVhQSVJFRF9FUlJPUiA9IFwiX19TRVNTSU9OX0VYUElSRURfX1wiO1xuLy8gRXJyb3JzIHRoYXQgc2hvdWxkIGFib3J0IHRoZSBlbnRpcmUgc3luYyBpbnN0ZWFkIG9mIGJlaW5nIHN3YWxsb3dlZFxuLy8gcGVyLXBoYXNlLlxuY29uc3QgQUJPUlRfRVJST1JTID0gbmV3IFNldChbQ0FOQ0VMX0VSUk9SLCBTRVNTSU9OX0VYUElSRURfRVJST1JdKTtcbmZ1bmN0aW9uIGNoZWNrQ2FuY2VsKCkge1xuICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldFN0YXR1cyhwYXJ0aWFsKSB7XG4gIC8vIEFmdGVyIGNhbmNlbGxhdGlvbiwgdGhlIHBvcHVwIGhhcyBhbHJlYWR5IHdyaXR0ZW4gdGhlIGRlZmluaXRpdmVcbiAgLy8gXCJzdG9wcGVkXCIgc3RhdHVzIFx1MjAxNCBzaWxlbmNlIGFueSBmdXJ0aGVyIHByb2dyZXNzIHdyaXRlcyBmcm9tIHRoZVxuICAvLyBpbi1mbGlnaHQgc3luYyBjb2RlIHNvIHRoZSBVSSBkb2Vzbid0IGJvdW5jZSB3aGlsZSBpdCB1bndpbmRzLlxuICBpZiAoX2NhbmNlbGxlZCkgcmV0dXJuO1xuICBjb25zdCBwcmV2ID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkpW1NUT1JBR0VfS0VZXSB8fCB7fTtcbiAgY29uc3QgbmV4dCA9IHsgLi4ucHJldiwgLi4ucGFydGlhbCwgdHM6IERhdGUubm93KCkgfTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgW1NUT1JBR0VfS0VZXTogbmV4dCB9KTtcbiAgLy8gQnJvYWRjYXN0IHRvIGFueSBvcGVuIHBvcHVwLiBJZiBubyBsaXN0ZW5lciAocG9wdXAgY2xvc2VkKSxcbiAgLy8gc2VuZE1lc3NhZ2UgcmVqZWN0cyBcdTIwMTQgc3dhbGxvdy5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcInN5bmNQcm9ncmVzc1wiLCBzdGF0dXM6IG5leHQgfSkuY2F0Y2goKCkgPT4ge30pO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTkhJIEFQSS1kaXJlY3Qgc3luYyAocGFyYWxsZWwsIG5vIExMTSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gSW5zdGVhZCBvZiBuYXZpZ2F0aW5nIHRoZSB1c2VyJ3MgdGFiIHRvIGVhY2ggTkhJIHBhZ2UsIHdhaXRpbmcgZm9yIFZ1ZSB0b1xuLy8gcmVuZGVyLCBjYXB0dXJpbmcgSFRNTCwgdGhlbiBzZW5kaW5nIGl0IHRocm91Z2ggTExNIGV4dHJhY3Rpb24sIHdlIGNhbGxcbi8vIE5ISSdzIHVuZGVybHlpbmcgSlNPTiBBUEkgZW5kcG9pbnRzIGRpcmVjdGx5LiBUaGUgXHU1MDY1XHU0RkREXHU3RjcyIFNQQSBmcm9udHMgYSBzZXRcbi8vIG9mIFJFU1QgZW5kcG9pbnRzIHVuZGVyIC9hcGkvaWhrZTMwMDAvPHBhZ2U+LyogdGhhdCByZXR1cm4gd2VsbC1mb3JtZWRcbi8vIEpTT047IGNhbGxpbmcgdGhlbSBpbiBwYXJhbGxlbCBjdXRzIGEgNS0xMCBtaW51dGUgc3luYyB0byB+MTAgc2Vjb25kcyBhbmRcbi8vIHJlbW92ZXMgdGhlIExMTSBjb3N0IGVudGlyZWx5LlxuXG5jb25zdCBOSElfSE9TVCA9IFwibXloZWFsdGhiYW5rLm5oaS5nb3YudHdcIjtcblxuXG4vLyBOSEkgSlNPTiBhZGFwdGVycyArIGRhdGUvc3RyaW5nIGhlbHBlcnMgbGl2ZSBpbiAuL25oaS1hZGFwdGVycy5qc1xuLy8gc28gdGhleSBjYW4gYmUgdW5pdC10ZXN0ZWQgaW4gaXNvbGF0aW9uIChiYWNrZ3JvdW5kLmpzIGNhbid0IGJlXG4vLyBsb2FkZWQgdW5kZXIgdml0ZXN0IFx1MjAxNCBjaHJvbWUuKiBBUElzLCBTVyBnbG9iYWxzKS4gU2VlIHRoYXQgbW9kdWxlXG4vLyBmb3IgdGhlIGZpZWxkLXByaW9yaXR5IGRlY2lzaW9ucyBwZXIgYWRhcHRlci5cbi8vXG4vLyBUaGUgTkhJIEFQSSBlbmRwb2ludCByZWdpc3RyeSArIFx1NEUyRFx1NjU4NyBsYWJlbCBtYXBwaW5nIGxpdmUgaW5cbi8vIC4vbmhpLWVuZHBvaW50cy5qcyBcdTIwMTQgZXh0cmFjdGVkIHNvIGEgdW5pdCB0ZXN0IGNhbiBndWFyYW50ZWUgZXZlcnlcbi8vIGVuZHBvaW50IG5hbWUgaGFzIGEgbGFiZWwgKHdlIHVzZWQgdG8gc2hpcCByYXcgcGFnZV90eXBlIGtleXMgbGlrZVxuLy8gXCJvdGhlcl9sYWJzXCIgaW50byB0aGUgcG9wdXAncyBcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzAgd2hlbiBzb21lb25lIGZvcmdvdCB0b1xuLy8gcmVnaXN0ZXIgdGhlIENoaW5lc2UgdmVyc2lvbikuXG5cbi8vIEFwcGx5IGEge3N0YXJ0LCBlbmR9IElTTyBkYXRlIHJhbmdlIHRvIGFuIGVuZHBvaW50IHBhdGg6XG4vLyAgIC0gSWYgcGF0aCBhbHJlYWR5IGhhcyBzX2RhdGU9IHBsYWNlaG9sZGVycywgZmlsbCB0aGVtIGluLlxuLy8gICAtIE90aGVyd2lzZSBhcHBlbmQgc19kYXRlPS4uLiZlX2RhdGU9Li4uIHRvIHRoZSBxdWVyeSBzdHJpbmcuXG4vLyBFbmRwb2ludHMgd2l0aG91dCBgc3VwcG9ydHNEYXRlUmFuZ2VgIHBhc3MgdGhyb3VnaCB1bmNoYW5nZWQuXG5mdW5jdGlvbiBhcHBseURhdGVSYW5nZVRvUGF0aChwYXRoLCBkYXRlUmFuZ2UpIHtcbiAgaWYgKCFkYXRlUmFuZ2UgfHwgKCFkYXRlUmFuZ2Uuc3RhcnQgJiYgIWRhdGVSYW5nZS5lbmQpKSByZXR1cm4gcGF0aDtcbiAgLy8gTkhJIGV4cGVjdHMgXHU4OTdGXHU1MTQzIElTTyBkYXRlcyB3aXRoIGRhc2hlczogMjAyMy0wMS0wMSAobm90IFx1NkMxMVx1NTcwQiwgbm90XG4gIC8vIHNsYXNoZXMpLiBDb25maXJtZWQgYnkgb2JzZXJ2aW5nIHRoZSBTUEEncyByZXF1ZXN0IHdoZW4gdXNlciBwaWNrc1xuICAvLyBhIGN1c3RvbSBkYXRlIHJhbmdlLiBVUkwtZW5jb2RpbmcgdGhlIGRhc2hlcyBpcyB1bm5lY2Vzc2FyeS5cbiAgY29uc3QgcyA9IChkYXRlUmFuZ2Uuc3RhcnQgfHwgXCJcIikuc2xpY2UoMCwgMTApO1xuICBjb25zdCBlID0gKGRhdGVSYW5nZS5lbmQgfHwgXCJcIikuc2xpY2UoMCwgMTApO1xuICBsZXQgcCA9IHBhdGg7XG4gIGlmICgvWz8mXXNfZGF0ZT0vLnRlc3QocCkpIHtcbiAgICBwID0gcC5yZXBsYWNlKC8oWz8mXXNfZGF0ZT0pW14mXSovLCBgJDEke3N9YCk7XG4gIH0gZWxzZSB7XG4gICAgcCArPSAocC5pbmNsdWRlcyhcIj9cIikgPyBcIiZcIiA6IFwiP1wiKSArIGBzX2RhdGU9JHtzfWA7XG4gIH1cbiAgaWYgKC9bPyZdZV9kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdZV9kYXRlPSlbXiZdKi8sIGAkMSR7ZX1gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IGAmZV9kYXRlPSR7ZX1gO1xuICB9XG4gIHJldHVybiBwO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzMzA2UzAyIGRldGFpbCBmZXRjaGVzIGluc2lkZSB0aGUgTkhJIHRhYiBzbyBjb29raWVzICsgSldUXG4vLyBhdXRoIGZsb3cgbmF0dXJhbGx5LiBXZSBwYXNzIHRoZSB2aXNpdCBsaXN0IChqdXN0IHJvd19JRHMgKyB0aGVpciBwYXJlbnRcbi8vIGZpZWxkcyBuZWVkZWQgZm9yIGFkYXB0YXRpb24pIGludG8gdGhlIHRhYjsgdGhlIHRhYiByZXR1cm5zIHBhcmFsbGVsXG4vLyBmZXRjaGVkIGJvZGllczsgd2UgYWRhcHQgYmFjayBpbiB0aGUgU1cuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hNZWRpY2F0aW9uRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2KSA9PiAoe1xuICAgICAgcm93X0lEOiB2LnJvd19JRCB8fCB2LnJvd2lkIHx8IHYucm93SUQgfHwgXCJcIixcbiAgICAgIC8vIEtlZXAgcGFyZW50IGZpZWxkcyBuZWVkZWQgYnkgYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbC5cbiAgICAgIHBhcmVudDoge1xuICAgICAgICBmdW5jX0RBVEU6IHYuZnVuY19EQVRFIHx8IHYuZnVuY19kYXRlIHx8IFwiXCIsXG4gICAgICAgIGljZDljbV9DT0RFOiB2LmljZDljbV9DT0RFIHx8IHYuaWNkOWNtX2NvZGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREVfQ05BTUU6IHYuaWNkOWNtX0NPREVfQ05BTUUgfHwgdi5pY2Q5Y21fbmFtZSB8fCBcIlwiLFxuICAgICAgICBob3NwX0FCQlI6IHYuaG9zcF9BQkJSIHx8IHYuaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgICB9LFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2N0eXBlfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIE5ISSB1c2VzIGRpZmZlcmVudCBjdHlwZSB2YWx1ZXMgZm9yIFx1ODk3Rlx1OTFBQi9cdTRFMkRcdTkxQUIvXHU3MjU5XHU5MUFCL1x1ODY1NVx1NjVCOVx1N0I4Qi4gV2UgZG9uJ3RcbiAgICAgIC8vIGhhdmUgdGhlIHB1YmxpYyBtYXBwaW5nLCBzbyB0cnkgY3R5cGUgMS4uNCBpbiBvcmRlciBhbmQgc3RvcCBhc1xuICAgICAgLy8gc29vbiBhcyBvbmUgcmV0dXJucyBkcnVncy4gY3R5cGU9MiBjb3ZlcmVkIElDXHU1MzYxIFx1OTU4MFx1OEEzQSBpbiBvdXIgc2FtcGxlLlxuICAgICAgYXN5bmMgZnVuY3Rpb24gb25lKHJvd0lkKSB7XG4gICAgICAgIGZvciAoY29uc3QgY3Qgb2YgWzIsIDEsIDMsIDRdKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCBjdCk7XG4gICAgICAgICAgaWYgKHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHJldHVybiByO1xuICAgICAgICAgIGlmIChyLmVycm9yKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHk/Lmloa2UzMzA2UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhIDogW107XG4gICAgICAgICAgY29uc3QgaGFzRHJ1Z3MgPSBtYWluLnNvbWUoKHYpID0+XG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHY/LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCkgJiYgdi5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QubGVuZ3RoID4gMFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGhhc0RydWdzKSByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgICAgICAvLyBObyBjdHlwZSB5aWVsZGVkIGRydWdzIFx1MjAxNCByZXR1cm4gbGFzdCBzdWNjZXNzZnVsIGJvZHkgYW55d2F5IHNvXG4gICAgICAgIC8vIGRpYWdub3N0aWNzIGNhbiBzdGlsbCBzZWUgdGhlIHZpc2l0IG1ldGFkYXRhLlxuICAgICAgICByZXR1cm4gYXdhaXQgZmV0Y2hPbmUocm93SWQsIDIpO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd3MgPSBbXTtcbiAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQyAmJiB3IDwgaXRlbXMubGVuZ3RoOyB3KyspIHdzLnB1c2god29ya2VyKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod3MpO1xuICAgICAgcmV0dXJuIHsgcmVzdWx0czogb3V0IH07XG4gICAgfSxcbiAgICBhcmdzOiBbYmFzZVVybCwgcmVxc10sXG4gIH0pO1xuXG4gIGlmIChyZXN1bHQ/LmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgY29uc3QgZHJ1Z3MgPSBbXTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgciA9IHJlc3VsdHNbaV07XG4gICAgaWYgKCFyIHx8IHIuZXJyb3IgfHwgIXIuYm9keSkgY29udGludWU7XG4gICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhIDogW107XG4gICAgZm9yIChjb25zdCB2aXNpdCBvZiBtYWluKSB7XG4gICAgICBjb25zdCBkcnVnTGlzdCA9IEFycmF5LmlzQXJyYXkodmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSA/IHZpc2l0LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCA6IFtdO1xuICAgICAgZm9yIChjb25zdCBkIG9mIGRydWdMaXN0KSB7XG4gICAgICAgIGNvbnN0IGFkYXB0ZWQgPSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsKGQsIHZpc2l0KTtcbiAgICAgICAgaWYgKGFkYXB0ZWQpIGRydWdzLnB1c2goYWRhcHRlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkcnVncztcbn1cblxuLy8gRmFuIG91dCBJSEtFMzQwOFMwMiBkZXRhaWwgZmV0Y2hlcyBmb3IgaW1hZ2luZyBcdTIwMTQgc2FtZSBwYXR0ZXJuIGFzIHRoZVxuLy8gbWVkaWNhdGlvbiAyLXN0ZXAuIGN0eXBlIG1pcnJvcnMgdGhlIHZpc2l0J3Mgb3JpX1RZUEUgKEEgLyBFIC8gXHUyMDI2KS5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgY3R5cGU6IHYub3JpX1RZUEUgfHwgdi5vcmlfdHlwZSB8fCBcIkFcIixcbiAgICB9KSlcbiAgICAuZmlsdGVyKChyKSA9PiByLnJvd19JRCk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgZnVuYzogYXN5bmMgKGJhc2UsIGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgIGlmICghdG9rZW4pIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICB9XG4gICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzQwOFMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGN0eXBlKX1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQsIGl0ZW1zW2ldLmN0eXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd3MgPSBbXTtcbiAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQyAmJiB3IDwgaXRlbXMubGVuZ3RoOyB3KyspIHdzLnB1c2god29ya2VyKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod3MpO1xuICAgICAgcmV0dXJuIHsgcmVzdWx0czogb3V0IH07XG4gICAgfSxcbiAgICBhcmdzOiBbYmFzZVVybCwgcmVxc10sXG4gIH0pO1xuXG4gIGlmIChyZXN1bHQ/LmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgY29uc3QgcmVwb3J0cyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTM0MDhTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGFkYXB0ZWQgPSBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKHZpc2l0KTtcbiAgICAgIGlmIChhZGFwdGVkKSByZXBvcnRzLnB1c2goYWRhcHRlZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXBvcnRzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzMzAzUzAyIGRldGFpbCB0byBjbGFzc2lmeSBlYWNoIElIS0UzMzAzUzAxIHZpc2l0IGFzXG4vLyBBTUIgLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUuIFVzZXMgP3JpZD08cm93X0lEPiZ0PU5cbi8vIHdoZXJlIE4gaXMgdGhlIHZpc2l0IHR5cGUgYnVja2V0OyB3ZSBkb24ndCBrbm93IHRoZSBtYXBwaW5nIGEgcHJpb3JpLFxuLy8gc28gZm9yIGVhY2ggdmlzaXQgd2UgdHJ5IHQ9MS4uNSB1bnRpbCBvbmUgcmV0dXJucyBub24tZW1wdHkgbWFpbl9kYXRhLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoRW5jb3VudGVyRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2LCBpZHgpID0+ICh7IGlkeCwgcm93X0lEOiB2LnJvV19JRCB8fCB2LnJvd19JRCB8fCBcIlwiIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCB0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9paGtlMzMwM3MwMi9wYWdlX2xvYWQ/cmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mdD0ke3R9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHRtID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRtKTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRm9yIGVhY2ggdmlzaXQsIGZpbmQgdGhlIGB0YCB0aGF0IHJldHVybnMgbm9uLWVtcHR5IGRhdGEuIE5ISVxuICAgICAgLy8gdXNlcyB0PTEgZm9yIG91dHBhdGllbnQgXHU4OTdGXHU5MUFCLCB0PTIgbWF5YmUgXHU2MDI1XHU4QTNBL1x1NEUyRFx1OTFBQiwgdD0zIFx1NEY0Rlx1OTY2MixcbiAgICAgIC8vIHQ9NCBcdTcyNTlcdTkxQUJcdTIwMjYgZG9uJ3QgaGF2ZSBhbiBhdXRob3JpdGF0aXZlIG1hcHBpbmcgc28gd2UgcHJvYmUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIFsxLCAyLCAzLCA0LCA1XSkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaE9uZShyb3dJZCwgdCk7XG4gICAgICAgICAgaWYgKHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHJldHVybiByO1xuICAgICAgICAgIGlmIChyLmVycm9yKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBtYWluID0gKHIuYm9keT8uaWhrZTMzMDNTMDJfbWFpbl9kYXRhKSB8fCBbXTtcbiAgICAgICAgICBpZiAobWFpbi5sZW5ndGggPiAwKSByZXR1cm4geyBib2R5OiByLmJvZHksIHQgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBib2R5OiBudWxsIH07XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICAvLyBQYWlyIGVhY2ggZGV0YWlsIGJvZHkgYmFjayB0byBpdHMgdmlzaXQgcG9zaXRpb24uXG4gIGNvbnN0IGJ5SWR4ID0gbmV3IE1hcCgpO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcXMubGVuZ3RoOyBpKyspIHtcbiAgICBieUlkeC5zZXQocmVxc1tpXS5pZHgsIHJlc3VsdHNbaV0/LmJvZHkgfHwgbnVsbCk7XG4gIH1cbiAgcmV0dXJuIGJ5SWR4O1xufVxuXG5mdW5jdGlvbiBfY2xhc3NGcm9tUzAyRGV0YWlsKGJvZHkpIHtcbiAgaWYgKCFib2R5KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbWFpbiA9IChib2R5Lmloa2UzMzAzUzAyX21haW5fZGF0YSkgfHwgW107XG4gIGlmIChtYWluLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHRuID0gU3RyaW5nKG1haW5bMF0uaG9zcF9EQVRBX1RZUEVfTkFNRSB8fCBcIlwiKTtcbiAgaWYgKHRuLmluY2x1ZGVzKFwiXHU2MDI1XCIpKSByZXR1cm4gXCJFTUVSXCI7ICAvLyBcdTYwMjVcdThBM0FcbiAgaWYgKHRuLmluY2x1ZGVzKFwiXHU0RjRGXHU5NjYyXCIpKSByZXR1cm4gXCJJTVBcIjtcbiAgLy8gXHU4OTdGXHU5MUFCIC8gXHU0RTJEXHU5MUFCIC8gXHU3MjU5XHU5MUFCIC8gXHU4NUU1XHU1QzQwIGFsbCBkZWZhdWx0IHRvIEFNQlxuICByZXR1cm4gXCJBTUJcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3Bvc3RTdHJ1Y3R1cmVkKGJhY2tlbmQsIHBhZ2VfdHlwZSwgaXRlbXMsIHN5bmNBcGlLZXksIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy91cGxvYWQtc3RydWN0dXJlZGAsIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcGFnZV90eXBlLFxuICAgICAgaG9zdDogTkhJX0hPU1QsXG4gICAgICBpdGVtcyxcbiAgICAgIHBhdGllbnRfb3ZlcnJpZGU6IHBhdGllbnRPdmVycmlkZSB8fCBudWxsLFxuICAgIH0pLFxuICB9KTtcbiAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoYFBPU1QgdXBsb2FkLXN0cnVjdHVyZWQgJHtyLnN0YXR1c306ICR7KGF3YWl0IHIudGV4dCgpKS5zbGljZSgwLCAyMDApfWApO1xuICByZXR1cm4gYXdhaXQgci5qc29uKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBtb2RlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFJ1bnMgdGhlIHNhbWUgbWFwcGVycyB0aGUgYmFja2VuZCBydW5zLCB0aGVuIHRyaWdnZXJzIGEgZG93bmxvYWQgb2YgdGhlXG4vLyByZXN1bHRpbmcgRkhJUiBCdW5kbGUuIE5vdGhpbmcgbGVhdmVzIHRoZSB1c2VyJ3MgbWFjaGluZTsgbm8gYmFja2VuZFxuLy8gcmVxdWlyZWQuIE1pcnJvcnMgYmFja2VuZC91cGxvYWQtc3RydWN0dXJlZCBvcmRlcjogZW5jb3VudGVycyBmaXJzdCBzb1xuLy8gdGhhdCBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzIGNhbiBhdHRhY2ggcmVmZXJlbmNlcyB0byBkb3duc3RyZWFtXG4vLyBvYnNlcnZhdGlvbnMvbWVkaWNhdGlvbnMvZXRjLlxuXG5jb25zdCBfTE9DQUxfUEFHRV9UWVBFX09SREVSID0gW1xuICBcImVuY291bnRlcnNcIixcbiAgXCJvYnNlcnZhdGlvbnNcIixcbiAgXCJtZWRpY2F0aW9uc1wiLFxuICBcImNvbmRpdGlvbnNcIixcbiAgXCJhbGxlcmdpZXNcIixcbiAgXCJkaWFnbm9zdGljX3JlcG9ydHNcIixcbiAgXCJwcm9jZWR1cmVzXCIsXG5dO1xuXG4vLyBDaGVhcCBwcmUtZmxpZ2h0OiBkb2VzIHRoaXMgTkhJIHRhYiBoYXZlIGFuIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbj9cbi8vIFVzZXMgdGhlIHNhbWUgc2Vzc2lvblN0b3JhZ2UudG9rZW4gKyBsaWdodHdlaWdodCBBUEkgY2FsbCBwYXR0ZXJuIGFzXG4vLyBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkuIERvZXNuJ3QgcmV0dXJuIGFueXRoaW5nIFBJSSBcdTIwMTQganVzdCBhXG4vLyBib29sZWFuIGZvciB0aGUgcG9wdXAgdG8gZGVjaWRlIHdoZXRoZXIgdG8gc3VyZmFjZSBhIFwibG9nIGluIGZpcnN0XCJcbi8vIGJhbm5lci4gUmV0dXJucyBudWxsIHdoZW4gd2UgY2FuJ3QgdGVsbCAoc2NyaXB0LWluamVjdGlvbiBibG9ja2VkLFxuLy8gdGltZW91dCwgZXRjLikgc28gdGhlIHBvcHVwIGNhbiBmYWxsIGJhY2sgdG8gXCJlbmFibGVkXCIgcmF0aGVyIHRoYW5cbi8vIHNjYXJpbmcgdGhlIHVzZXIgd2l0aCBhIGZhbHNlIG5lZ2F0aXZlLlxuYXN5bmMgZnVuY3Rpb24gX2NoZWNrTmhpTG9naW5TdGF0ZSh0YWJJZCkge1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU2FtZSBlbmRwb2ludCBhcyB0aGUgY2lkIGF1dG8tZmV0Y2ggXHUyMDE0IGtub3duIHRvIG5lZWQgYW5cbiAgICAgICAgICAvLyBhdXRoZW50aWNhdGVkIHNlc3Npb24gYW5kIHRvIGJlIGNoZWFwLlxuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MTBzMDEvcGFnZV9sb2FkXCIsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0fWAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyA0MDEvNDAzIFx1MjE5MiBzZXNzaW9uIHRva2VuIHJlamVjdGVkLiAyMDAgXHUyMTkyIGxvZ2dlZCBpbi5cbiAgICAgICAgICByZXR1cm4gci5vaztcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09PSBcImJvb2xlYW5cIiA/IHJlc3VsdCA6IG51bGw7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8vIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZW5kcG9pbnQgSUhLRTM0MTBTMDEgKFx1NjIxMVx1NjNBNVx1N0EyRVx1N0QwMFx1OTMwNCAvIENPVklEIFx1N0JFOVx1NkFBMlx1N0QwMFx1OTMwNCkgaGFwcGVuc1xuLy8gdG8gY2FycnkgdGhlIGxvZ2dlZC1pbiB1c2VyJ3MgcmVhbCBjaXRpemVuIElEIGluIHRoZSByZXNwb25zZSAoYGNpZGBcbi8vIGZpZWxkLCBlLmcuIFwiUDEyMzQ1MDg2NlwiKS4gVXNlIGl0IHRvIHNlZWQgLyByZWZyZXNoIHRoZSBwYXRpZW50X1xuLy8gb3ZlcnJpZGUncyBpZF9ubyBzbyBpdCBhbHdheXMgdHJhY2tzIFwid2hvc2Ugc2Vzc2lvbiBpcyBjdXJyZW50bHlcbi8vIGFjdGl2ZSBpbiB0aGUgTkhJIHRhYlwiLlxuLy9cbi8vIEhpc3Rvcnkgbm90ZTogdGhpcyBmdW5jdGlvbiB1c2VkIHRvIGVhcmx5LXJldHVybiB3aGVuZXZlciBpZF9ubyB3YXNcbi8vIGFscmVhZHkgYSByZWFsLWxvb2tpbmcgY2lkIChcImRvbid0IHRvdWNoIGEgbWFudWFsbHktZW50ZXJlZCBJRFwiKS5cbi8vIFRoYXQgc2hvcnQtY2lyY3VpdCBwcmUtZGF0ZWQgdjAuNi4wIHdoaWNoIHJlbW92ZWQgaWRfbm8gZnJvbSB0aGUgVUlcbi8vIFx1MjAxNCB0aGVyZSdzIG5vIFwibWFudWFsXCIgcGF0aCBhbnltb3JlLCB0aGUgZmllbGQgaXMgcHVyZWx5IGludGVybmFsLlxuLy8gVGhlIHNob3J0LWNpcmN1aXQgYWxzbyBwcm9kdWNlZCB0aGUgYnVnIHBhdHRlcm46IHVzZXIgc3RhcnRzIHN5bmNcbi8vIHdpdGggUGF0aWVudCBCIGxvZ2dlZCBpbiAoY2lkX0Igd3JpdHRlbiB0byBvdmVycmlkZSksIHJlYWxpc2VzIHdyb25nXG4vLyB0YWIsIHN3aXRjaGVzIE5ISSB0YWIgdG8gUGF0aWVudCBBLCByZS1zeW5jcyBcdTIwMTQgaWRfbm8gc3RheXMgY2lkX0Jcbi8vIGJlY2F1c2UgXCJhbHJlYWR5IGEgcmVhbCBjaWRcIi4gTm93IHdlIGFsd2F5cyBwcm9iZSBhbmQgZm9sbG93IHRoZVxuLy8gc2Vzc2lvbidzIHRydXRoLiBNYW51YWwgb3ZlcnJpZGUgaXMgZ29uZSwgTkhJIHNlc3Npb24gaXMgYXV0aG9yaXRhdGl2ZS5cbmFzeW5jIGZ1bmN0aW9uIF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaSh0YWJJZCwgcGF0aWVudE92ZXJyaWRlKSB7XG4gIGNvbnN0IGN1cnJlbnQgPSBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIjtcblxuICBsZXQgY2lkID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKFwiL2FwaS9paGtlMzAwMC9paGtlMzQxMHMwMS9wYWdlX2xvYWRcIiwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIiwgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3R9YCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIG51bGw7XG4gICAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgIHJldHVybiBib2R5Py5jaWQgfHwgbnVsbDtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gVmFsaWRhdGUgaXQgbG9va3MgbGlrZSBhIFRhaXdhbiBuYXRpb25hbCBJRCAoMSBsZXR0ZXIgKyA5IGRpZ2l0cylcbiAgICAvLyBiZWZvcmUgdHJ1c3RpbmcgaXQuIEF2b2lkcyBhY2NpZGVudGFsbHkgcHJvbW90aW5nIGdhcmJhZ2UgdG8gdGhlXG4gICAgLy8gUGF0aWVudCByZXNvdXJjZSdzIHVuaXF1ZSBrZXkuXG4gICAgaWYgKHJlc3VsdCAmJiAvXltBLVpdWzEyXVxcZHs4fSQvLnRlc3QocmVzdWx0KSkgY2lkID0gcmVzdWx0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBJSEtFMzQxMCBjaWQgZmV0Y2ggZmFpbGVkOlwiLCBlPy5tZXNzYWdlID8/IGUpO1xuICB9XG5cbiAgaWYgKGNpZCAmJiBjaWQgIT09IGN1cnJlbnQpIHtcbiAgICBwYXRpZW50T3ZlcnJpZGUgPSB7IC4uLnBhdGllbnRPdmVycmlkZSwgaWRfbm86IGNpZCB9O1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHBhdGllbnRPdmVycmlkZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICAvLyBQYXRpZW50LXN3aXRjaCBjbGVhbnVwLiBJZiB0aGUgY2lkIGp1c3QgY2hhbmdlZCBmcm9tIG9uZSByZWFsXG4gICAgLy8gY2lkIHRvIGFub3RoZXIgKG5vdCBqdXN0IFwiYXV0by1YWFhYIFx1MjE5MiByZWFsIGNpZFwiIGZpcnN0LXN5bmMgc3dhcCksXG4gICAgLy8gdGhlIHByZXZpb3VzbHktc3Rhc2hlZCBGSElSIGJ1bmRsZSBiZWxvbmdzIHRvIHRoZSBPVEhFUiBwYXRpZW50LlxuICAgIC8vIERyb3AgaXQgc28gdGhlIHBvcHVwJ3MgZG93bmxvYWQgYnV0dG9uIGRvZXNuJ3Qga2VlcCBvZmZlcmluZyB0aGVcbiAgICAvLyB3cm9uZyBwYXRpZW50J3MgZmlsZS4gU2FtZSBzZXQgb2Ygd2lwZXMgcG9wdXAuanMgZG9lcyBpblxuICAgIC8vIHNhdmVQYXRpZW50T3ZlcnJpZGUgd2hlbiBpdCBkZXRlY3RzIHBhdGllbnRDaGFuZ2VkLlxuICAgIGNvbnN0IHN3aXRjaGVkUmVhbFBhdGllbnRzID1cbiAgICAgIGN1cnJlbnQgJiYgIWN1cnJlbnQuc3RhcnRzV2l0aChcImF1dG8tXCIpICYmIGN1cnJlbnQgIT09IGNpZDtcbiAgICBpZiAoc3dpdGNoZWRSZWFsUGF0aWVudHMpIHtcbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhdGllbnRPdmVycmlkZTtcbn1cblxuLy8gUmVhZCB0aGUgbWFzay1uYW1lIHByZWZlcmVuY2UgZnJlc2ggZnJvbSBzdG9yYWdlLiBXZSBkb24ndCBjYWNoZSBcdTIwMTRcbi8vIHJ1bk5oaUFwaVN5bmMgaXMgaW52b2tlZCBhdCBtb3N0IGEgZmV3IHRpbWVzIHBlciBzZXNzaW9uIGFuZCB0aGUgU1dcbi8vIGNhbiBiZSB0b3JuIGRvd24gKyByZXN0YXJ0ZWQgYW55IHRpbWUsIHNvIGEgc2luZ2xlIGdldCgpIHBlciBzeW5jIGlzXG4vLyBjaGVhcGVyIHRoYW4gc3luY2luZyBzdGF0ZSBhY3Jvc3MgU1cgbGlmZWN5Y2xlcy5cbmFzeW5jIGZ1bmN0aW9uIF9pc01hc2tFbmFibGVkKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgbWFza05hbWVFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJtYXNrTmFtZUVuYWJsZWRcIik7XG4gICAgcmV0dXJuIG1hc2tOYW1lRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZE92ZXJyaWRlUGF0aWVudChvdiwgbWFza0VuYWJsZWQpIHtcbiAgY29uc3QgZGlzcGxheU5hbWUgPSBtYXNrRW5hYmxlZCA/IG1hc2tOYW1lKG92Lm5hbWUgfHwgXCJcIikgOiBvdi5uYW1lIHx8IFwiXCI7XG4gIGNvbnN0IHJhdyA9IHtcbiAgICBpZDogb3YuaWRfbm8sXG4gICAgaWRlbnRpZmllcjogb3YuaWRfbm8sXG4gICAgbmFtZTogZGlzcGxheU5hbWUgfHwgb3YuaWRfbm8sXG4gIH07XG4gIGlmIChvdi5iaXJ0aF9kYXRlKSByYXcuYmlydGhEYXRlID0gb3YuYmlydGhfZGF0ZTtcbiAgaWYgKG92LmdlbmRlcikgcmF3LmdlbmRlciA9IG92LmdlbmRlcjtcbiAgcmV0dXJuIG1hcFBhdGllbnQocmF3KTtcbn1cblxuLy8gV2FsayBhIEpTT04tbGlrZSB2YWx1ZSBhbmQgcmVwbGFjZSBldmVyeSBzdHJpbmcgdG9rZW4gZXF1YWwgdG8gb3Jcbi8vIGNvbnRhaW5pbmcgYG5lZWRsZWAgd2l0aCBgcmVwbGFjZW1lbnRgLiBVc2VkIHRvIHNjcnViIHRoZSByZWFsXG4vLyBwYXRpZW50IG5hbWUgb3V0IG9mIE5ISSBuYXJyYXRpdmUgZmllbGRzIChjbGluaWNhbF9ub3RlLCBjb25jbHVzaW9uLFxuLy8gbm90ZSwgZXRjLikgYmVmb3JlIHRoZSBpdGVtcyByZWFjaCB0aGUgbWFwcGVyLiBPbmx5IHRyaWdnZXJlZCB3aGVuXG4vLyB0aGUgdXNlciBoYXMgb3B0ZWQgaW50byBtYXNraW5nIEFORCBzdXBwbGllZCBhIG5hbWUgXHUyMDE0IGFuZCB0aGVcbi8vIHN1YnN0aXR1dGlvbiBpcyBleGFjdC10b2tlbi1yZXBsYWNlLCBub3QgZnV6enksIHNvIGl0IGNhbid0IHN1cnByaXNlXG4vLyB0aGUgdXNlciBieSBjbG9iYmVyaW5nIHVucmVsYXRlZCBjb250ZW50LlxuZnVuY3Rpb24gX3JlcGxhY2VOYW1lRGVlcCh2YWx1ZSwgbmVlZGxlLCByZXBsYWNlbWVudCkge1xuICBpZiAoIW5lZWRsZSB8fCBuZWVkbGUgPT09IHJlcGxhY2VtZW50KSByZXR1cm4gdmFsdWU7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHJldHVybiB2YWx1ZS5zcGxpdChuZWVkbGUpLmpvaW4ocmVwbGFjZW1lbnQpO1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHJldHVybiB2YWx1ZS5tYXAoKHYpID0+IF9yZXBsYWNlTmFtZURlZXAodiwgbmVlZGxlLCByZXBsYWNlbWVudCkpO1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHZhbHVlKSBvdXRba10gPSBfcmVwbGFjZU5hbWVEZWVwKHZhbHVlW2tdLCBuZWVkbGUsIHJlcGxhY2VtZW50KTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKSB7XG4gIGNvbnN0IHBhdGllbnQgPSBfYnVpbGRPdmVycmlkZVBhdGllbnQocGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCk7XG4gIGNvbnN0IHBpZCA9IHBhdGllbnQuaWQ7XG4gIGNvbnN0IGFsbCA9IFtwYXRpZW50XTtcblxuICBmb3IgKGNvbnN0IHB0IG9mIF9MT0NBTF9QQUdFX1RZUEVfT1JERVIpIHtcbiAgICBjb25zdCBpdGVtcyA9IGJ5VHlwZVtwdF07XG4gICAgaWYgKCFpdGVtcyB8fCBpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGxldCBtYXBwZWQ7XG4gICAgaWYgKEdST1VQX0hBTkRMRVJTW3B0XSkge1xuICAgICAgbWFwcGVkID0gR1JPVVBfSEFORExFUlNbcHRdKGl0ZW1zLCBwaWQpO1xuICAgIH0gZWxzZSBpZiAoTElTVF9IQU5ETEVSU1twdF0pIHtcbiAgICAgIGNvbnN0IFtmbl0gPSBMSVNUX0hBTkRMRVJTW3B0XTtcbiAgICAgIG1hcHBlZCA9IGl0ZW1zXG4gICAgICAgIC5maWx0ZXIoKGl0KSA9PiBpdCAmJiB0eXBlb2YgaXQgPT09IFwib2JqZWN0XCIpXG4gICAgICAgIC5tYXAoKGl0KSA9PiBmbihpdCwgcGlkKSlcbiAgICAgICAgLmZpbHRlcigocikgPT4gciAhPT0gbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAocHQgPT09IFwiZW5jb3VudGVyc1wiKSBtYXBwZWQgPSBkZWR1cEFkbWlzc2lvbkRheUFtYihtYXBwZWQpO1xuICAgIGFsbC5wdXNoKC4uLm1hcHBlZCk7XG4gIH1cblxuICAvLyBEZWR1cCBieSAocmVzb3VyY2VUeXBlLCBpZCkgYmVmb3JlIGFzc2VtYmxpbmcgdGhlIEJ1bmRsZS4gTXVsdGlwbGVcbiAgLy8gTkhJIGVuZHBvaW50cyBjYW4gZmVlZCB0aGUgc2FtZSBwYWdlX3R5cGUgKGUuZy4gZW5jb3VudGVycyAvXG4gIC8vIGlucGF0aWVudCAvIGlucGF0aWVudF9sZWdhY3kgYWxsIFx1MjE5MiBwYWdlX3R5cGU9XCJlbmNvdW50ZXJzXCIpLCBhbmQgdGhlXG4gIC8vIG1hcHBlciBwcm9kdWNlcyBkZXRlcm1pbmlzdGljIHN0YWJsZSBJRHMgXHUyMDE0IHNvIHR3byByYXcgaXRlbXMgdGhhdFxuICAvLyBkZXNjcmliZSB0aGUgc2FtZSBtZWRpY2FsIGV2ZW50IGNvbGxhcHNlIHRvIG9uZSByZXNvdXJjZS4gQmFja2VuZFxuICAvLyB1cHNlcnQgaGFuZGxlcyB0aGlzIGF1dG9tYXRpY2FsbHkgKHNhbWUgc3RhYmxlIElEID0gc2FtZSBEQiByb3cpO1xuICAvLyBsb2NhbCBtb2RlIGhhcyB0byBkbyBpdCBleHBsaWNpdGx5LiBXaXRob3V0IHRoaXMgZGVkdXAsIHRoZSBsb2NhbFxuICAvLyBCdW5kbGUgZW5kcyB1cCBpbmZsYXRlZCByZWxhdGl2ZSB0byB3aGF0IGJhY2tlbmQgc3RvcmVzIGZyb20gdGhlXG4gIC8vIGlkZW50aWNhbCBOSEkgaW5wdXQuXG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gIGNvbnN0IHVuaXF1ZSA9IFtdO1xuICBmb3IgKGNvbnN0IHIgb2YgYWxsKSB7XG4gICAgY29uc3Qga2V5ID0gYCR7ci5yZXNvdXJjZVR5cGV9LyR7ci5pZH1gO1xuICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICBzZWVuLmFkZChrZXkpO1xuICAgIHVuaXF1ZS5wdXNoKHIpO1xuICB9XG5cbiAgLy8gTGlua2VyICsgc2V4LXN0cmF0aWZpZWQgcmVzb2x2ZXIgcnVuIG9uY2Ugb3ZlciB0aGUgZnVsbCBhc3NlbWJsZWRcbiAgLy8gbGlzdCAoc2FtZSBwaXBlbGluZSBiYWNrZW5kJ3MgL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQgcnVucywganVzdFxuICAvLyBhZ2FpbnN0IGFuIGluLW1lbW9yeSBjYW5kaWRhdGUgYXJyYXkgaW5zdGVhZCBvZiBhIFNRTGl0ZSBxdWVyeSkuXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXModW5pcXVlLCB1bmlxdWUpO1xuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyhwYXRpZW50LCB1bmlxdWUpO1xuXG4gIHJldHVybiB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkJ1bmRsZVwiLFxuICAgIHR5cGU6IFwiY29sbGVjdGlvblwiLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLlxcZCtaJC8sIFwiWlwiKSxcbiAgICBlbnRyeTogdW5pcXVlLm1hcCgocikgPT4gKHtcbiAgICAgIGZ1bGxVcmw6IGAke3IucmVzb3VyY2VUeXBlfS8ke3IuaWR9YCxcbiAgICAgIHJlc291cmNlOiByLFxuICAgIH0pKSxcbiAgfTtcbn1cblxuLy8gTG9jYWwgbW9kZSBzdGFzaGVzIHRoZSBhc3NlbWJsZWQgQnVuZGxlIGluIGNocm9tZS5zdG9yYWdlLmxvY2FsIHVuZGVyXG4vLyBhIHNpbmdsZSBcInBlbmRpbmdGaGlyQnVuZGxlXCIgc2xvdC4gVGhlIHBvcHVwIHNob3dzIGEgZG93bmxvYWQgYnV0dG9uXG4vLyB3aGVuIHRoaXMgc2xvdCBpcyBub24tZW1wdHk7IHRoZSBhY3R1YWwgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBjYWxsXG4vLyBoYXBwZW5zIGZyb20gdGhlIHBvcHVwIChpbiByZXNwb25zZSB0byBhIHVzZXIgY2xpY2spIHNvIHRoZSBmaWxlXG4vLyBkb2Vzbid0IGFwcGVhciBpbiB0aGUgRG93bmxvYWRzIGJhciB1bmludml0ZWQuXG4vL1xuLy8gU2luZ2xlIHNsb3QgbWVhbnMgYSBuZXcgc3luYyBvdmVyd3JpdGVzIHRoZSBwcmV2aW91cyBwZW5kaW5nIGJ1bmRsZS5cbi8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIGRlZmF1bHQgcXVvdGEgaXMgMTAgTUI7IGEgdHlwaWNhbCBOSEkgc3luYyBpc1xuLy8gd2VsbCB1bmRlciAyIE1CLlxuY29uc3QgUEVORElOR19CVU5ETEVfS0VZID0gXCJwZW5kaW5nRmhpckJ1bmRsZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudElkLCBkYXRlUmFuZ2UpIHtcbiAgLy8gRmlsZW5hbWU6IG5oaS17cGlkfS17c3RhcnRZWVlZTU1ERH0te2VuZFlZWVlNTUREfS5qc29uXG4gIC8vIFdoZW4gbm8gZXhwbGljaXQgZGF0ZVJhbmdlIChOSEkgZGVmYXVsdCA9IFx1OEZEMSAxIFx1NUU3NCksIHN5bnRoZXNpemUgdG9kYXktMXkgXHUyMTkyIHRvZGF5LlxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgY29uc3QgZm10ID0gKGQpID0+IGAke2QuZ2V0RnVsbFllYXIoKX0ke3BhZChkLmdldE1vbnRoKCkgKyAxKX0ke3BhZChkLmdldERhdGUoKSl9YDtcbiAgLy8gSGFsZi1tYXNrIHRoZSBJRCBpbiB0aGUgZmlsZW5hbWUgc28gdGhlIHVzZXIncyBEb3dubG9hZHMgZm9sZGVyXG4gIC8vIGRvZXNuJ3QgbGVhayB0aGUgZnVsbCBcdThFQUJcdTUyMDZcdThCNDkgKHdvdWxkIGJlIHZpc2libGUgdG8gYW55b25lIHNlZWluZ1xuICAvLyBhIGZpbGUgbGlzdGluZyBvciBkb3dubG9hZC1iYXIgcHJldmlldykuIGBYYCBiZWNhdXNlIGAqYCBpc1xuICAvLyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIEJ1bmRsZSBDT05URU5UUyBzdGlsbCBjYXJyeSB0aGUgcmVhbFxuICAvLyBJRCB1bmRlciBQYXRpZW50LmlkIFx1MjAxNCBmaWxlIG93bmVyIGtub3dzIHdob3NlIGRhdGEgaXQgaXMuXG4gIGNvbnN0IG1hc2tlZFBpZCA9IG1hc2tJZChwYXRpZW50SWQgfHwgXCJ1bmtub3duXCIsIFwiWFwiKTtcbiAgY29uc3Qgc2FmZVBpZCA9IG1hc2tlZFBpZC5yZXBsYWNlKC9bXkEtWmEtejAtOV8tXS9nLCBcIl9cIik7XG4gIGNvbnN0IGNvbXBhY3QgPSAoZCkgPT4gKGQgfHwgXCJcIikuc2xpY2UoMCwgMTApLnJlcGxhY2UoLy0vZywgXCJcIik7XG4gIGxldCBzLCBlO1xuICBpZiAoZGF0ZVJhbmdlICYmIChkYXRlUmFuZ2Uuc3RhcnQgfHwgZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICBzID0gY29tcGFjdChkYXRlUmFuZ2Uuc3RhcnQpIHx8IGZtdChub3cpO1xuICAgIGUgPSBjb21wYWN0KGRhdGVSYW5nZS5lbmQpIHx8IGZtdChub3cpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG9uZVllYXJBZ28gPSBuZXcgRGF0ZShub3cpO1xuICAgIG9uZVllYXJBZ28uc2V0RnVsbFllYXIob25lWWVhckFnby5nZXRGdWxsWWVhcigpIC0gMSk7XG4gICAgcyA9IGZtdChvbmVZZWFyQWdvKTtcbiAgICBlID0gZm10KG5vdyk7XG4gIH1cbiAgY29uc3QgZmlsZW5hbWUgPSBgbmhpLSR7c2FmZVBpZH0tJHtzfS0ke2V9Lmpzb25gO1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoYnVuZGxlLCBudWxsLCAyKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBbUEVORElOR19CVU5ETEVfS0VZXToge1xuICAgICAgZmlsZW5hbWUsXG4gICAgICBqc29uLFxuICAgICAgYnl0ZXM6IGpzb24ubGVuZ3RoLFxuICAgICAgZ2VuZXJhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICBwYXRpZW50SWQ6IHBhdGllbnRJZCB8fCBudWxsLFxuICAgIH0sXG4gIH0pO1xuICByZXR1cm4geyBmaWxlbmFtZSwgYnl0ZXM6IGpzb24ubGVuZ3RoIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bk5oaUFwaVN5bmMoeyB0YWJJZCwgbW9kZSwgYmFja2VuZCwgc3luY0FwaUtleSwgbmhpQmFzZSwgcGF0aWVudE92ZXJyaWRlLCBkYXRlUmFuZ2UsIGRhdGVSYW5nZUxhYmVsIH0pIHtcbiAgX2NhbmNlbGxlZCA9IGZhbHNlO1xuICBjb25zdCBCQVNFID0gbmhpQmFzZSB8fCBgaHR0cHM6Ly8ke05ISV9IT1NUfWA7XG5cbiAgaWYgKCFwYXRpZW50T3ZlcnJpZGUpIHtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgc3luY1N0YXR1czoge1xuICAgICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgICAgcHJvZ3Jlc3M6IFwiXHUyNkQ0IFx1OEFDQlx1NTE0OFx1NTcyOCBwb3B1cCBcdTU4NkJcdTVCRUJcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcdTVGOENcdTUxOERcdThBNjZcIixcbiAgICAgICAgcGhhc2U6IFwiZXJyb3JcIiwgdHM6IERhdGUubm93KCksIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghdGFiSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBUEkgc3luYyByZXF1aXJlcyBOSEkgdGFiIGlkIChjb29raWVzIGFyZSBmaXJzdC1wYXJ0eSlcIik7XG4gIH1cblxuICAvLyBGaXJzdCBjaGFuY2UgdG8gdXBncmFkZSB0aGUgcGF0aWVudCBJRDogaWYgdGhlIHBvcHVwIGdhdmUgdXMgYW5cbiAgLy8gXCJhdXRvLVhYWFhYWFhYXCIgcGxhY2Vob2xkZXIgKHVzZXIgZGlkbid0IG1hbnVhbGx5IHR5cGUgb25lKSxcbiAgLy8gZmV0Y2ggdGhlIHJlYWwgb25lIGZyb20gTkhJJ3MgSUhLRTM0MTBTMDEgZW5kcG9pbnQgKHJlc3BvbnNlLmNpZFxuICAvLyBpcyB0aGUgY2l0aXplbiBJRCkuIFBlcnNpc3QgYmFjayB0byBzdG9yYWdlIHNvIHN1YnNlcXVlbnQgc3luY3NcbiAgLy8gYXJlIHN0YWJsZS4gTWFudWFsbHktdHlwZWQgSURzIGFyZSByZXNwZWN0ZWQgYXMtaXMuXG4gIHBhdGllbnRPdmVycmlkZSA9IGF3YWl0IF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaSh0YWJJZCwgcGF0aWVudE92ZXJyaWRlKTtcblxuICAvLyBTdGFzaCBjb250ZXh0IHNvIHRoZSBzdG9wU3luYyBtZXNzYWdlIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuICAvLyBkYXRhIChERUxFVEUgL3N5bmMvcGF0aWVudC97aWRfbm99KSB3aXRob3V0IHVzIGhhdmluZyB0byBzZW5kIGl0XG4gIC8vIGJhY2sgdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZS5cbiAgX2FjdGl2ZVN5bmNDdHggPSB7IGJhY2tlbmQsIHN5bmNBcGlLZXksIHBhdGllbnRJZDogcGF0aWVudE92ZXJyaWRlLmlkX25vIH07XG5cbiAgLy8gV2FsbC1jbG9jayBzdGFydCB0aW1lIFx1MjAxNCB1c2VkIHRvIGNvbXB1dGUgZWxhcHNlZCBzZWNvbmRzIGZvciB0aGVcbiAgLy8gZmluYWwgc3RhdHVzIGxpbmUgKFwiXHU3RTNEXHU4MDE3XHU2NjQyIDEyLjMgXHU3OUQyXCIpLiBTdGFzaCBvbiBhIGxvY2FsIHNvIHdlIGNhblxuICAvLyByZWFjaCBpdCBmcm9tIHRoZSBjb21wbGV0aW9uIG1lc3NhZ2UgYXQgdGhlIHZlcnkgZW5kLlxuICBjb25zdCBfdDAgPSBEYXRlLm5vdygpO1xuICAvLyBQZXItcGhhc2UgdGltaW5ncywgc3VyZmFjZWQgaW50byB0aGUgcG9wdXAncyBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiIHNvIHRoZSB1c2VyXG4gIC8vIGNhbiBzZWUgZXhhY3RseSB3aGVyZSB0aW1lIGlzIGdvaW5nLiBFYWNoIGVudHJ5OiB7IG5hbWUsIG1zIH0uXG4gIGNvbnN0IF9waGFzZXMgPSBbXTtcbiAgbGV0IF9waGFzZVN0YXJ0ID0gX3QwO1xuICBjb25zdCBfbWFya1BoYXNlID0gKG5hbWUpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIF9waGFzZXMucHVzaCh7IG5hbWUsIG1zOiBub3cgLSBfcGhhc2VTdGFydCB9KTtcbiAgICBfcGhhc2VTdGFydCA9IG5vdztcbiAgfTtcbiAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICBydW5uaW5nOiB0cnVlLCBwcm9ncmVzczogXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIHBoYXNlOiBcImluaXRcIixcbiAgICBzdGFydGVkOiBfdDAsIHRvdGFsUmVzb3VyY2VzOiAwLCBob3N0OiBOSElfSE9TVCwgZXJyb3JzOiBbXSxcbiAgfSk7XG5cbiAgLy8gU3RlcCAxOiBmZXRjaCBhbGwgZW5kcG9pbnRzIGluIFBBUkFMTEVMIGluc2lkZSB0aGUgTkhJIHRhYi4gUnVubmluZyBpblxuICAvLyB0YWIgY29udGV4dCBtZWFucyBzYW1lLW9yaWdpbiBjb29raWVzIGFyZSBzZW50IGF1dG9tYXRpY2FsbHkgXHUyMDE0IGZldGNoXG4gIC8vIGZyb20gdGhlIFNXIHdvdWxkIGJlIGNyb3NzLW9yaWdpbiBhbmQgU2FtZVNpdGUgYmxvY2tzIHRoZSBzZXNzaW9uXG4gIC8vIGNvb2tpZSwgaGVuY2Ugd2UgZ290IFwic2Vzc2lvbiBleHBpcmVkXCIgZXZlbiB3aGVuIGxvZ2dlZCBpbi5cbiAgLy8gUGFzcyBvbmx5IHNlcmlhbGlzYWJsZSBkYXRhIChwYXRocywgbWV0aG9kLCBuYW1lKTsgYWRhcHRlcnMgc3RheSBpbiBTVy5cbiAgLy8gSW5qZWN0IElTTy1kYXRlIHJhbmdlIGludG8gZWFjaCBlbmRwb2ludCB0aGF0IHN1cHBvcnRzIGl0IChjb252ZXJ0c1xuICAvLyB0byBcdTZDMTFcdTU3MEIgZm9ybWF0IHZpYSBpc29Ub1JPQykuIFNraXBwZWQgZW5kcG9pbnRzIGtlZXAgdGhlaXIgZGVmYXVsdFxuICAvLyBOSEktc2lkZSB3aW5kb3cgKDEtMiB5ZWFycyBkZXBlbmRpbmcgb24gdGhlIHBhZ2UpLlxuICBjb25zdCBmZXRjaFNwZWMgPSBOSElfQVBJX0VORFBPSU5UUy5tYXAoKGVwKSA9PiB7XG4gICAgY29uc3QgcGF0aCA9IGVwLnN1cHBvcnRzRGF0ZVJhbmdlID8gYXBwbHlEYXRlUmFuZ2VUb1BhdGgoZXAucGF0aCwgZGF0ZVJhbmdlKSA6IGVwLnBhdGg7XG4gICAgcmV0dXJuIHsgbmFtZTogZXAubmFtZSwgdXJsOiBCQVNFICsgcGF0aCwgbWV0aG9kOiBcIkdFVFwiIH07XG4gIH0pO1xuICBpZiAoZGF0ZVJhbmdlICYmIChkYXRlUmFuZ2Uuc3RhcnQgfHwgZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICBjb25zb2xlLmxvZyhcIltOSEkgQVBJIHN5bmNdIGRhdGUgcmFuZ2U6XCIsXG4gICAgICBgJHtkYXRlUmFuZ2Uuc3RhcnQgfHwgXCIodW5ib3VuZGVkKVwifSBcdTIxOTIgJHtkYXRlUmFuZ2UuZW5kIHx8IFwiKHVuYm91bmRlZClcIn1gKTtcbiAgfVxuXG4gIGxldCBzZXR0bGVkUmF3O1xuICB0cnkge1xuICAgIFt7IHJlc3VsdDogc2V0dGxlZFJhdyB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jIChzcGVjcykgPT4ge1xuICAgICAgICAvLyBOSEkgYXV0aDogY29va2llcyArIEpXVCBpbiBzZXNzaW9uU3RvcmFnZS4gVGhlIFNQQSdzIGF4aW9zIHNldHNcbiAgICAgICAgLy8gYEF1dGhvcml6YXRpb246IEJlYXJlciA8dG9rZW4+YCBvbiBldmVyeSBBUEkgY2FsbC4gU2Vzc2lvblxuICAgICAgICAvLyBjb29raWVzIGFsb25lIHJldHVybiA0MDEuXG4gICAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXRva2VuKSByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcblxuICAgICAgICAvLyBEZXRlY3QgSURMRS90aW1lb3V0IHBhZ2UgYWxyZWFkeSByZWRpcmVjdGVkIG9uIHRoaXMgdGFiLlxuICAgICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFt7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH1dO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gNjAtc2Vjb25kIHRpbWVvdXQgcGVyIGZldGNoIFx1MjAxNCBzb21lIE5ISSBlbmRwb2ludHMgKGVuY291bnRlcnMsXG4gICAgICAgIC8vIG1lZHMpIHRha2UgMjArIHNlY29uZHMuXG4gICAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHMsIG1zKSB7XG4gICAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIG1zKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHMudXJsLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogcy5tZXRob2QsXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICAgIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgY29uc3QgY3QgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgICBpZiAoIWN0LmluY2x1ZGVzKFwiYXBwbGljYXRpb24vanNvblwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgbm9uLUpTT04gKGN0PSR7Y3R9KWAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBib2R5O1xuICAgICAgICAgICAgdHJ5IHsgYm9keSA9IGF3YWl0IHIuanNvbigpOyB9XG4gICAgICAgICAgICBjYXRjaCAoZSkgeyByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcIkpTT04gcGFyc2U6IFwiICsgZS5tZXNzYWdlIH07IH1cbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgYm9keSB9O1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBpZiAoZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIikgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJ0aW1lb3V0IDYwc1wiIH07XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbmN1cnJlbmN5LWxpbWl0ZWQgZXhlY3V0aW9uOiBtYXggMyBpbiBmbGlnaHQgYXQgb25jZS4gTkhJJ3NcbiAgICAgICAgLy8gYWJ1c2UgZGV0ZWN0aW9uIGJsb2NrcyBidXJzdHM7IHdpdGggMTEgcGFyYWxsZWwgZmV0Y2hlcyBpdFxuICAgICAgICAvLyB0aHJvdHRsZWQgdGhlIHNlc3Npb24gYW5kIHJlZGlyZWN0ZWQgdG8gSUhLRTMwMDFTOTlfSURMRS5cbiAgICAgICAgLy8gMyBhdCBhIHRpbWUgKyAyMDBtcyBqaXR0ZXIgaXMgZ2VudGxlIGVub3VnaCBmb3IgMS1zaG90IHN5bmMuXG4gICAgICAgIGNvbnN0IENPTkNVUlJFTkNZID0gMztcbiAgICAgICAgY29uc3QgSklUVEVSX01TID0gMjAwO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gbmV3IEFycmF5KHNwZWNzLmxlbmd0aCk7XG4gICAgICAgIGxldCBuZXh0SWR4ID0gMDtcbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICAgIHdoaWxlIChuZXh0SWR4IDwgc3BlY3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gbmV4dElkeCsrO1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiBKSVRURVJfTVMpKTtcbiAgICAgICAgICAgIHJlc3VsdHNbaV0gPSBhd2FpdCBmZXRjaE9uZShzcGVjc1tpXSwgNjAwMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3b3JrZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQ1VSUkVOQ1kgJiYgdyA8IHNwZWNzLmxlbmd0aDsgdysrKSB7XG4gICAgICAgICAgd29ya2Vycy5wdXNoKHdvcmtlcigpKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCh3b3JrZXJzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9LFxuICAgICAgYXJnczogW2ZldGNoU3BlY10sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGV4ZWN1dGVTY3JpcHQgZmFpbGVkOiAke2UubWVzc2FnZX1gKTtcbiAgfVxuXG4gIC8vIERldGVjdCBzZXNzaW9uIGV4cGlyZWQgYWNyb3NzIHJlc3VsdHMuXG4gIGlmIChzZXR0bGVkUmF3LnNvbWUoKHIpID0+IHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIH1cblxuICBjb25zdCBlcnJvcnMgPSBbXTtcblxuICAvLyBHZW5lcmljIGxpc3QgZXh0cmFjdGlvbjogaGFuZGxlcyBhbGwgb2JzZXJ2ZWQgTkhJIHNoYXBlcy5cbiAgLy8gICAtIFBsYWluIGFycmF5IChJSEtFMzQwOSBsYWIpXG4gIC8vICAgLSB7c3BfSUhLRTxYPl9kYXRhOiBbLi4uXX0gIChtZWRpY2F0aW9ucywgYWxsZXJnaWVzKVxuICAvLyAgIC0ge3dlc3Rlcm5fZGF0YSwgY2hpbmVzZV9kYXRhLCBkZW50aXN0X2RhdGE6IFsuLi5dfSAoZW5jb3VudGVyIGxpc3QsXG4gIC8vICAgICBzcGxpdCBieSBcdTg5N0ZcdTkxQUIvXHU0RTJEXHU5MUFCL1x1NzI1OVx1OTFBQiBcdTIwMTQgd2Ugd2FudCBhbGwgdGhyZWUpXG4gIC8vIEZvciBtdWx0aS1hcnJheSBzaGFwZXMgd2UgbWVyZ2UgYWxsIGFycmF5cyBhbmQgdGFnIGVhY2ggaXRlbSB3aXRoXG4gIC8vIGBfX3NlY3Rpb25gICh0aGUgc291cmNlIGtleSkgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgZnVuY3Rpb24gZXh0cmFjdExpc3QoYm9keSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGJvZHkpKSByZXR1cm4gYm9keTtcbiAgICBpZiAoIWJvZHkgfHwgdHlwZW9mIGJvZHkgIT09IFwib2JqZWN0XCIpIHJldHVybiBbXTtcbiAgICBsZXQgYXJyYXlLZXlzID0gT2JqZWN0LmVudHJpZXMoYm9keSkuZmlsdGVyKChbXywgdl0pID0+IEFycmF5LmlzQXJyYXkodikpO1xuICAgIGlmIChhcnJheUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBhcnJheUtleXNbMF1bMV07XG4gICAgLy8gTXVsdGlwbGUgYXJyYXlzIFx1MjAxNCBkcm9wIFVJLWhlbHBlciBhcnJheXMgKGRyb3Bkb3duIG9wdGlvbnMsIHNvcnRcbiAgICAvLyBzZWxlY3RvcnMsIGxvb2t1cCB0YWJsZXMpLiBOSEkgbWl4ZXMgdGhlbSBpbnRvIHRoZSBzYW1lIHJlc3BvbnNlXG4gICAgLy8gKGUuZy4gaW1hZ2luZyByZXR1cm5zIHNwX0lIS0UzNDA4UzAxX2RhdGEgKyBpY2Q5Y21fc2VsZWN0KS5cbiAgICBjb25zdCBIRUxQRVJfUkUgPSAvc2VsZWN0fG9wdGlvbnxkcm9wZG93bnxmaWx0ZXJ8c29ydHxsb29rdXAvaTtcbiAgICBjb25zdCBkYXRhS2V5cyA9IGFycmF5S2V5cy5maWx0ZXIoKFtrXSkgPT4gIUhFTFBFUl9SRS50ZXN0KGspKTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAxKSByZXR1cm4gZGF0YUtleXNbMF1bMV07XG4gICAgaWYgKGRhdGFLZXlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTsgLy8gZmFsbGJhY2tcbiAgICBhcnJheUtleXMgPSBkYXRhS2V5cztcbiAgICAvLyBNdWx0aXBsZSBkYXRhIGFycmF5cyAoZS5nLiB3ZXN0ZXJuX2RhdGEvY2hpbmVzZV9kYXRhL2RlbnRpc3RfZGF0YSlcbiAgICAvLyBcdTIwMTQgbWVyZ2Ugd2l0aCBfX3NlY3Rpb24gdGFnIHNvIGFkYXB0ZXJzIGNhbiBkaXNhbWJpZ3VhdGUuXG4gICAgY29uc3QgbWVyZ2VkID0gW107XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgYXJyYXlLZXlzKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygdikge1xuICAgICAgICBpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgIG1lcmdlZC5wdXNoKHsgLi4uaXRlbSwgX19zZWN0aW9uOiBrIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lcmdlZC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWQ7XG4gIH1cblxuICAvLyBBcHBseSBTVy1zaWRlIGFkYXB0ZXJzIHRvIGVhY2ggZW5kcG9pbnQncyBib2R5LlxuICBjb25zdCBzZXR0bGVkID0gc2V0dGxlZFJhdy5tYXAoKHIsIGkpID0+IHtcbiAgICBjb25zdCBlcCA9IE5ISV9BUElfRU5EUE9JTlRTW2ldO1xuICAgIGlmIChyLmVycm9yKSB7XG4gICAgICByZXR1cm4geyBzdGF0dXM6IFwicmVqZWN0ZWRcIiwgcmVhc29uOiB7IG1lc3NhZ2U6IGAke2VwLm5hbWV9OiAke3IuZXJyb3J9YCB9IH07XG4gICAgfVxuICAgIGNvbnN0IGxpc3QgPSBleHRyYWN0TGlzdChyLmJvZHkpO1xuICAgIC8vIEFkYXB0ZXJzIHJldHVybiBlaXRoZXI6XG4gICAgLy8gICAtIG9uZSBpdGVtICAgKG1vc3QgYWRhcHRlcnMgXHUyMDE0IGxhYnMsIG1lZHMsIGVuY291bnRlcnMsIGltYWdpbmcpXG4gICAgLy8gICAtIG51bGwvdW5kZWZpbmVkIChza2lwKVxuICAgIC8vICAgLSBhcnJheSBvZiBpdGVtcyAoYWRhcHRBZHVsdFByZXZlbnRpdmUgXHUyMDE0IHVuZm9sZHMgb25lIHNjcmVlbmluZ1xuICAgIC8vICAgICByb3cgaW50byB+MTUgT2JzZXJ2YXRpb24gZW50cmllcylcbiAgICAvLyBGbGF0LWhhbmRsZSBib3RoIHNoYXBlcyBzbyBlYWNoIGFkYXB0ZXIgY2FuIHBpY2sgd2hhdGV2ZXIncyBjbGVhcmVzdC5cbiAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgIGZvciAoY29uc3QgaXQgb2YgbGlzdCkge1xuICAgICAgY29uc3QgciA9IGVwLmFkYXB0KGl0KTtcbiAgICAgIGlmIChyID09PSBudWxsIHx8IHIgPT09IHVuZGVmaW5lZCkgY29udGludWU7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHggb2YgcikgaWYgKHgpIGl0ZW1zLnB1c2goeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtcy5wdXNoKHIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBTbmFwc2hvdCBhIGJvZHkgc2FtcGxlIGZvciBzaGFwZXMgd2hlcmUgYWRhcHRlciByZWplY3RlZCBldmVyeXRoaW5nXG4gICAgLy8gXHUyMDE0IHVzZWQgYnkgdGhlIGRpYWdub3N0aWMgYnJlYWtkb3duIGluIHN0ZXAgMi5cbiAgICBsZXQgYm9keVNhbXBsZSA9IG51bGw7XG4gICAgaWYgKGxpc3QubGVuZ3RoID4gMCAmJiBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIEluY2x1ZGUgdGhlIEZJUlNUIElURU0gKGZ1bGwga2V5cyt2YWx1ZXMpIHNvIHdlIGNhbiBidWlsZCB0aGVcbiAgICAgIC8vIGNvcnJlY3QgYWRhcHRlciB3aXRob3V0IGFub3RoZXIgcm91bmQtdHJpcC4gTkhJIGl0ZW1zIG1heSBpbmNsdWRlXG4gICAgICAvLyBQSUk7IHRoZSB1c2VyIGluc3BlY3RzIHRoaXMgbG9jYWxseSB2aWEgc2VydmljZS13b3JrZXIgZGV2dG9vbHMuXG4gICAgICBib2R5U2FtcGxlID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0b3BMZXZlbEtleXM6IEFycmF5LmlzQXJyYXkoci5ib2R5KSA/IG51bGwgOiBPYmplY3Qua2V5cyhyLmJvZHkgfHwge30pLnNsaWNlKDAsIDEwKSxcbiAgICAgICAgd2FzQXJyYXk6IEFycmF5LmlzQXJyYXkoci5ib2R5KSxcbiAgICAgICAgZmlyc3RJdGVtOiBsaXN0WzBdID8/IG51bGwsXG4gICAgICAgIHNlY29uZEl0ZW06IGxpc3RbMV0gPz8gbnVsbCxcbiAgICAgIH0pLnNsaWNlKDAsIDQwMDApO1xuICAgIH1cbiAgICByZXR1cm4geyBzdGF0dXM6IFwiZnVsZmlsbGVkXCIsIHZhbHVlOiB7IGVwLCBpdGVtcywgcmF3X2NvdW50OiBsaXN0Lmxlbmd0aCwgYm9keVNhbXBsZSwgcmF3TGlzdDogbGlzdCB9IH07XG4gIH0pO1xuXG4gIF9tYXJrUGhhc2UoXCJuaGktcGFyYWxsZWxcIik7XG5cbiAgLy8gU3RlcCAxYTogZW5jb3VudGVyIGRldGFpbCBmYW4tb3V0IChJSEtFMzMwM1MwMikgXHUyMTkyIGNsYXNzaWZ5IGVhY2hcbiAgLy8gSUhLRTMzMDNTMDEgdmlzaXQgYXMgQU1CIC8gRU1FUiAvIElNUCB2aWEgaG9zcF9EQVRBX1RZUEVfTkFNRS5cbiAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBcdTYwMjVcdThBM0EgZGlzdGluY3Rpb247IGRldGFpbCBkb2VzLiBXZSByZS1cbiAgLy8gYWRhcHQgZWFjaCBlbmNvdW50ZXIgaXRlbSB3aXRoIHRoZSBkaXNjb3ZlcmVkIGNsYXNzIGJlZm9yZSB0aGVcbiAgLy8gYmFja2VuZCB1cGxvYWQgc3RlcC5cbiAgY29uc3QgZW5jSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwiZW5jb3VudGVyc1wiKTtcbiAgaWYgKGVuY0lkeCA+PSAwICYmIHNldHRsZWRbZW5jSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW2VuY0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUMzMVx1OTFBQlx1N0QwMFx1OTMwNFx1OEE3M1x1NjBDNVx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRldGFpbE1hcCA9IGF3YWl0IF9mZXRjaEVuY291bnRlckRldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJlLWFkYXB0IHdpdGggY2xhc3NIaW50IGZyb20gZGV0YWlsOyBmYWxsIGJhY2sgdG8gQU1CLlxuICAgICAgICBjb25zdCByZUFkYXB0ZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aXNpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxNYXA/LmdldChpKSB8fCBudWxsO1xuICAgICAgICAgIGNvbnN0IGNscyA9IF9jbGFzc0Zyb21TMDJEZXRhaWwoZGV0YWlsKSB8fCBcIkFNQlwiO1xuICAgICAgICAgIGNvbnN0IGl0ID0gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSh2aXNpdHNbaV0sIGNscyk7XG4gICAgICAgICAgaWYgKGl0KSByZUFkYXB0ZWQucHVzaChpdCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0dGxlZFtlbmNJZHhdLnZhbHVlLml0ZW1zID0gcmVBZGFwdGVkO1xuICAgICAgICBzZXR0bGVkW2VuY0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVBZGFwdGVkLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGVuY291bnRlciBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwiZW5jb3VudGVyLWRldGFpbFwiKTtcblxuICAvLyBTdGVwIDFiOiBtZWRpY2F0aW9ucyBuZWVkIGEgMi1zdGVwIGZldGNoIFx1MjAxNCBJSEtFMzMwNlMwMSBvbmx5IHJldHVybnNcbiAgLy8gdmlzaXQgbWV0YWRhdGEgKGRhdGUsIElDRCwgaG9zcGl0YWwpLCBubyBkcnVnIG5hbWVzLiBEcnVncyBsaXZlIGF0XG4gIC8vIElIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPTxyb3dfSUQ+JmN0eXBlPTIgdW5kZXJcbiAgLy8gaWhrZTMzMDZTMDJfbWFpbl9kYXRhWypdLnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC4gRmFuIG91dCBkZXRhaWxcbiAgLy8gZmV0Y2hlcyBpbnNpZGUgdGhlIHNhbWUgdGFiIGNvbnRleHQgKGNvb2tpZXMgKyBKV1QpLCBrZWVwaW5nXG4gIC8vIGNvbmN1cnJlbmN5IGxpbWl0ZWQgc28gTkhJIGRvZXNuJ3QgSURMRS1yZWRpcmVjdCB1cy5cbiAgLy8gU3RlcCAxYzogaW1hZ2luZyBuZWVkcyBJSEtFMzQwOFMwMiBmb3IgdGhlIGFjdHVhbCByZXBvcnQgbmFycmF0aXZlLlxuICAvLyBMaXN0IGVuZHBvaW50IG9ubHkgaGFzIG9yZGVyIG1ldGFkYXRhOyBjdHlwZSBwYXJhbSBtaXJyb3JzIHRoZVxuICAvLyB2aXNpdCdzIG9yaV9UWVBFIChBIC8gRSAvIFx1MjAyNikuXG4gIGNvbnN0IGltZ0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcImltYWdpbmdcIik7XG4gIGlmIChpbWdJZHggPj0gMCAmJiBzZXR0bGVkW2ltZ0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTVcdTU4MzFcdTU0NEFcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXBvcnRzID0gYXdhaXQgX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS5pdGVtcyA9IHJlcG9ydHM7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZXBvcnRzLmxlbmd0aDtcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgaW1hZ2luZyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwiaW1hZ2luZy1kZXRhaWxcIik7XG5cbiAgY29uc3QgbWVkSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwibWVkaWNhdGlvbnNcIik7XG4gIGlmIChtZWRJZHggPj0gMCAmJiBzZXR0bGVkW21lZElkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFttZWRJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTc1MjhcdTg1RTVcdTY2MEVcdTdEMzBcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkcnVnSXRlbXMgPSBhd2FpdCBfZmV0Y2hNZWRpY2F0aW9uRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLml0ZW1zID0gZHJ1Z0l0ZW1zO1xuICAgICAgICAvLyByYXdfY291bnQgbm93IHJlZmxlY3RzIHRoZSAqZHJ1Zy1sZXZlbCogY291bnQgZm9yIHRoZSBicmVha2Rvd25cbiAgICAgICAgLy8gKHZpc2l0cyBcdTIxOTIgZHJ1Z3MpLiBLZWVwIHRoZSB2aXNpdCBjb3VudCBpbiBhIHNpZGUgZmllbGQgZm9yIGRlYnVnLlxuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdfY291bnQgPSBkcnVnSXRlbXMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgbWVkaWNhdGlvbnMgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcIm1lZGljYXRpb24tZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMjogYWdncmVnYXRlIGl0ZW1zIGJ5IHBhZ2VfdHlwZSwgUE9TVCB0byBiYWNrZW5kLlxuICBjb25zdCBieVR5cGUgPSB7fTtcbiAgbGV0IHJhd190b3RhbCA9IDA7XG4gIGxldCBhZGFwdGVkX3RvdGFsID0gMDtcbiAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBzbyB0aGUgZmluYWwgc3RhdHVzIGNhbiB0ZWxsIHVzZXIgZXhhY3RseVxuICAvLyB3aGljaCBlbmRwb2ludHMgY2FtZSBiYWNrIGVtcHR5IC8gbWlzLXNoYXBlZCBcdTIwMTQgbXVjaCBtb3JlIHVzZWZ1bCB0aGFuXG4gIC8vIGEgc2luZ2xlIGFnZ3JlZ2F0ZWQgbnVtYmVyLlxuICAvLyBCcmVha2Rvd24gc2hvd24gdG8gdGhlIHVzZXIgdW5kZXIgXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIi4gVXNlIHRoZSBDaGluZXNlIGxhYmVsXG4gIC8vIHdoZW4ga25vd247IG9ubHkgZmFsbCBiYWNrIHRvIHRoZSByYXcgZW5kcG9pbnQgbmFtZSBmb3IgdW5tYXBwZWRcbiAgLy8gKG5ld2x5IGFkZGVkKSBlbmRwb2ludHMuIEVtcHR5LXJlc3VsdCBlbmRwb2ludHMgYXJlIG9taXR0ZWQgZnJvbVxuICAvLyB0aGUgc3VjY2VzcyBzdW1tYXJ5IGVudGlyZWx5IFx1MjAxNCB0aGV5IGFkZCBub2lzZS4gRXJyb3JzIGFsd2F5cyBzaG93XG4gIC8vIHNvIHRoZSB1c2VyIGtub3dzIHNvbWV0aGluZyBkaWRuJ3QgY29tZSB0aHJvdWdoLlxuICBjb25zdCBicmVha2Rvd24gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0bGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZXAgPSBOSElfQVBJX0VORFBPSU5UU1tpXTtcbiAgICBjb25zdCBzID0gc2V0dGxlZFtpXTtcbiAgICBjb25zdCBsYWJlbCA9IEVORFBPSU5UX0xBQkVMX1pIW2VwLm5hbWVdID8/IGVwLm5hbWU7XG4gICAgaWYgKHMuc3RhdHVzID09PSBcInJlamVjdGVkXCIpIHtcbiAgICAgIGVycm9ycy5wdXNoKGAke2VwLm5hbWV9OiAke3MucmVhc29uLm1lc3NhZ2V9YCk7XG4gICAgICBicmVha2Rvd24ucHVzaChgXHUyNzRDICR7bGFiZWx9XHVGRjFBXHU1M0Q2XHU1Rjk3XHU1OTMxXHU2NTU3YCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgeyBpdGVtcywgcmF3X2NvdW50IH0gPSBzLnZhbHVlO1xuICAgIHJhd190b3RhbCArPSByYXdfY291bnQ7XG4gICAgYWRhcHRlZF90b3RhbCArPSBpdGVtcy5sZW5ndGg7XG4gICAgaWYgKHJhd19jb3VudCA9PT0gMCkgY29udGludWU7IC8vIG5vdGhpbmcgdG8gc2hvd1xuICAgIGlmIChpdGVtcy5sZW5ndGggPiByYXdfY291bnQgJiYgcmF3X2NvdW50ID4gMCkge1xuICAgICAgLy8gMS10by1tYW55IGFkYXB0ZXIgKGUuZy4gYWR1bHRfcHJldmVudGl2ZTogb25lIHNjcmVlbmluZyByb3cgXHUyMTkyXG4gICAgICAvLyB+MTggT2JzZXJ2YXRpb25zKS4gU2hvdyBib3RoIG51bWJlcnMgc28gdGhlIHVzZXIgdW5kZXJzdGFuZHNcbiAgICAgIC8vIHdoeSBvbmUgcmVjb3JkIHByb2R1Y2VkIG1hbnkuXG4gICAgICBicmVha2Rvd24ucHVzaChgJHtsYWJlbH1cdUZGMUEke3Jhd19jb3VudH0gXHU3QjQ2IFx1MjE5MiAke2l0ZW1zLmxlbmd0aH0gXHU5ODA1YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrZG93bi5wdXNoKGAke2xhYmVsfVx1RkYxQSR7aXRlbXMubGVuZ3RofSBcdTdCNDZgKTtcbiAgICB9XG4gICAgLy8gU2F2ZSBib2R5IHNhbXBsZSBmb3IgZmlyc3QgZW5kcG9pbnQgd2l0aCByYXc+MCBidXQgYWRhcHRlZD0wIChhZGFwdGVyXG4gICAgLy8gbWlzbWF0Y2gpIHNvIHdlIGNhbiBpdGVyYXRlLiBTdG9yZWQgdW5kZXIgY2hyb21lLnN0b3JhZ2UubG9jYWwgZm9yXG4gICAgLy8gaW5zcGVjdGlvbiB2aWEgc2VydmljZSB3b3JrZXIgRGV2VG9vbHMuXG4gICAgaWYgKHJhd19jb3VudCA+IDAgJiYgaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgICAgIFtgX19zYW1wbGVCb2R5XyR7ZXAubmFtZX1gXTogcy52YWx1ZS5ib2R5U2FtcGxlIHx8IFwibi9hXCIsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH1cbiAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICAoYnlUeXBlW2VwLnBhZ2VfdHlwZV0gPSBieVR5cGVbZXAucGFnZV90eXBlXSB8fCBbXSkucHVzaCguLi5pdGVtcyk7XG4gIH1cblxuICAvLyBNYXNrIGdhdGUgaXMgcmVhZCBmcmVzaCBwZXIgc3luYyBcdTIwMTQgZGVmYXVsdHMgT0ZGIHBlciB0aGUgZGlzY3Vzc2lvblxuICAvLyAoY2l0aXplbi1zZWxmLWRvd25sb2FkIGRvZXNuJ3QgbmVlZCBhbm9ueW1pemF0aW9uKS4gV2hlbiBPTiwgYWxzb1xuICAvLyBzY3J1YiB0aGUgdXNlcidzIHJlYWwgbmFtZSBvdXQgb2YgYW55IE5ISSBuYXJyYXRpdmUgZmllbGQgYmVmb3JlXG4gIC8vIGl0IGZsb3dzIGludG8gdGhlIG1hcHBlci5cbiAgY29uc3QgbWFza0VuYWJsZWQgPSBhd2FpdCBfaXNNYXNrRW5hYmxlZCgpO1xuICBpZiAobWFza0VuYWJsZWQgJiYgcGF0aWVudE92ZXJyaWRlLm5hbWUpIHtcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IG1hc2tOYW1lKHBhdGllbnRPdmVycmlkZS5uYW1lKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhieVR5cGUpKSB7XG4gICAgICBieVR5cGVba2V5XSA9IF9yZXBsYWNlTmFtZURlZXAoYnlUeXBlW2tleV0sIHBhdGllbnRPdmVycmlkZS5uYW1lLCByZXBsYWNlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IHRvdGFsID0gMDtcbiAgbGV0IF9sb2NhbEZpbGVuYW1lID0gbnVsbDtcbiAgaWYgKG1vZGUgPT09IFwibG9jYWxcIikge1xuICAgIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbiAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogXCJcdUQ4M0VcdURERUMgXHU4RjQ5XHU2M0RCXHU3MEJBXHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHU2QTk0XHUyMDI2XCIsIHRvdGFsUmVzb3VyY2VzOiAwIH0pO1xuICAgIGxldCBidW5kbGU7XG4gICAgdHJ5IHtcbiAgICAgIGJ1bmRsZSA9IF9hc3NlbWJsZUxvY2FsQnVuZGxlKGJ5VHlwZSwgcGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3JzLnB1c2goYGxvY2FsIG1hcHBpbmc6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgYnVuZGxlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGJ1bmRsZSkge1xuICAgICAgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDQkUgXHU2RTk2XHU1MDk5ICR7dG90YWx9IFx1N0I0NiBGSElSIFx1OENDN1x1NkU5MFx1MjAyNmAsIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubywgZGF0ZVJhbmdlKTtcbiAgICAgICAgX2xvY2FsRmlsZW5hbWUgPSBkbC5maWxlbmFtZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYHN0YXNoIGJ1bmRsZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEJ1aWxkIHRoZSBvdmVycmlkZSB3ZSBzZW5kIHRvIGJhY2tlbmQgd2l0aCB0aGUgbWF5YmUtbWFza2VkIG5hbWVcbiAgICAvLyBzbyBiYWNrZW5kJ3MgYXV0by1jcmVhdGVkIFBhdGllbnQgKyB0aGUgcGVyLWl0ZW0gc3ViamVjdC5kaXNwbGF5XG4gICAgLy8gc2VlIHRoZSBzYW1lIHZhbHVlIHRoZSB1c2VyIG9wdGVkIGludG8uIEl0ZW1zIHRoZW1zZWx2ZXMgd2VyZVxuICAgIC8vIGFscmVhZHkgc2NydWJiZWQgYWJvdmUgKGJ5VHlwZSBwYXNzKSwgc28gdGhpcyBqdXN0IGNvdmVycyB0aGVcbiAgICAvLyBvdmVycmlkZS1kZXJpdmVkIFBhdGllbnQuXG4gICAgY29uc3QgdXBsb2FkT3ZlcnJpZGUgPSBtYXNrRW5hYmxlZCAmJiBwYXRpZW50T3ZlcnJpZGUubmFtZVxuICAgICAgPyB7IC4uLnBhdGllbnRPdmVycmlkZSwgbmFtZTogbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUpIH1cbiAgICAgIDogcGF0aWVudE92ZXJyaWRlO1xuICAgIGZvciAoY29uc3QgW3BhZ2VfdHlwZSwgaXRlbXNdIG9mIE9iamVjdC5lbnRyaWVzKGJ5VHlwZSkpIHtcbiAgICAgIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHUyQjA2XHVGRTBGIFx1NEUwQVx1NTBCMyAke3BhZ2VfdHlwZX1cdUZGMDgke2l0ZW1zLmxlbmd0aH0gXHU3QjQ2XHVGRjA5XHUyMDI2YCxcbiAgICAgICAgdG90YWxSZXNvdXJjZXM6IHRvdGFsLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgX3Bvc3RTdHJ1Y3R1cmVkKGJhY2tlbmQsIHBhZ2VfdHlwZSwgaXRlbXMsIHN5bmNBcGlLZXksIHVwbG9hZE92ZXJyaWRlKTtcbiAgICAgICAgdG90YWwgKz0gZGF0YS5jb3VudCB8fCAwO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgdXBsb2FkICR7cGFnZV90eXBlfTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWZ0ZXIgYmFja2VuZCB1cGxvYWQsIGFsc28gZmV0Y2ggYSBzbmFwc2hvdCBvZiB0aGUgcGF0aWVudCdzIGZ1bGxcbiAgICAvLyBjdW11bGF0aXZlIEZISVIgQnVuZGxlIGFuZCBzdGFzaCBpdCBmb3IgdGhlIHBvcHVwJ3MgXCJcdUQ4M0RcdURDRTUgXHU0RTBCXHU4RjA5XCIgYnV0dG9uLlxuICAgIC8vIFRoaXMgaXMgd2hhdCBgL2ZoaXIvZXhwb3J0YCByZXR1cm5zIFx1MjAxNCB0aGUgYmFja2VuZCdzIGNvbXBsZXRlIHZpZXdcbiAgICAvLyBvZiB0aGlzIHBhdGllbnQgKHRoaXMgc3luYyArIGFueSBwcmlvciBzeW5jcyksIGFzIG9wcG9zZWQgdG8gbG9jYWxcbiAgICAvLyBtb2RlJ3MgXCJqdXN0IHRoaXMgc3luY1wiIGJ1bmRsZS5cbiAgICAvL1xuICAgIC8vIFNraXAgc3Rhc2hpbmcgZW50aXJlbHkgd2hlbiB0aGUgdXBsb2FkIHBhc3MgcHJvZHVjZWQgbm8gcmVzb3VyY2VzXG4gICAgLy8gXHUyMDE0IGV4cG9ydGluZyAwIGVudHJpZXMgdGhlbiBzdGFzaGluZyB0aGVtIGNyZWF0ZXMgYSBtaXNsZWFkaW5nXG4gICAgLy8gXCJcdTY3MkNcdTU3MzAgXHUyNzEzIDAgXHU3QjQ2XCIgaW5kaWNhdG9yIGFuZCBhIHVzZWxlc3MgXHVEODNEXHVEQ0U0IFx1NEUwQVx1NTBCMyBidXR0b24uXG4gICAgaWYgKHBhdGllbnRPdmVycmlkZS5pZF9ubyAmJiB0b3RhbCA+IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBcIlx1RDgzRFx1RENFNiBcdTUzRDZcdTVGOTdcdTVGOENcdTdBRUZcdTVCOENcdTY1NzRcdThDQzdcdTY1OTlcdTIwMjZcIiwgdG90YWxSZXNvdXJjZXM6IHRvdGFsIH0pO1xuICAgICAgICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIGRlcml2ZVBhdGllbnRJZChyYXdJZCksIHNvIHRoZVxuICAgICAgICAvLyBleHBvcnQgZmlsdGVyIG11c3QgdXNlIHRoZSBoYXNoZWQgZm9ybSBcdTIwMTQgcXVlcnlpbmcgd2l0aCB0aGVcbiAgICAgICAgLy8gcmF3IG5hdGlvbmFsIElEIG1hdGNoZXMgemVybyByb3dzIGV2ZW4gd2hlbiBkYXRhIGlzIHRoZXJlLlxuICAgICAgICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKHBhdGllbnRPdmVycmlkZS5pZF9ubyk7XG4gICAgICAgIGNvbnN0IGV4cFVybCA9IGAke2JhY2tlbmR9L2ZoaXIvZXhwb3J0P3BhdGllbnQ9JHtlbmNvZGVVUklDb21wb25lbnQoZmhpclBpZCl9YDtcbiAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKGV4cFVybCwge1xuICAgICAgICAgIGhlYWRlcnM6IHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30sXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoci5vaykge1xuICAgICAgICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgIC8vIFBhc3MgdGhlIHNhbWUgZGF0ZVJhbmdlIHRoZSB1c2VyIHBpY2tlZCB0aHJvdWdoIHNvIHRoZVxuICAgICAgICAgIC8vIGRvd25sb2FkZWQgZmlsZW5hbWUgcmVmbGVjdHMgXCJcdTY3MDBcdThGRDEgMyBcdTVFNzRcIiBcdTIxOTIgMjAyMy0yMDI2IGluc3RlYWRcbiAgICAgICAgICAvLyBvZiBhbHdheXMgc3ludGhlc2l6aW5nIHRvZGF5LTF5IFx1MjE5MiB0b2RheS5cbiAgICAgICAgICBjb25zdCBkbCA9IGF3YWl0IF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sIGRhdGVSYW5nZSk7XG4gICAgICAgICAgX2xvY2FsRmlsZW5hbWUgPSBkbC5maWxlbmFtZTtcbiAgICAgICAgICAvLyBBbGlnbiByZXBvcnRlZCBjb3VudCB3aXRoIGxvY2FsIG1vZGU6IGJ1bmRsZS5lbnRyeS5sZW5ndGhcbiAgICAgICAgICAvLyBpbmNsdWRlcyB0aGUgUGF0aWVudCByZXNvdXJjZSAod2hpY2ggdGhlIHBlci1wYWdlLXR5cGUgUE9TVFxuICAgICAgICAgIC8vIGNvdW50cyBoYWQgcHJldmlvdXNseSBvbWl0dGVkIGJlY2F1c2UgUGF0aWVudCBpcyBhdXRvLWNyZWF0ZWRcbiAgICAgICAgICAvLyBzaWxlbnRseSBmcm9tIHBhdGllbnRfb3ZlcnJpZGUpLiBTYW1lIGRhdGEgXHUyMTkyIHNhbWUgbnVtYmVyLlxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gRGVmZW5zaXZlOiBvbmx5IE9WRVJXUklURSB0b3RhbCB3aGVuIGV4cG9ydCBhY3R1YWxseSByZXR1cm5lZFxuICAgICAgICAgIC8vIHNvbWV0aGluZy4gSWYgZXhwb3J0IHJldHVybnMgMCBlbnRyaWVzIGRlc3BpdGUgYSBzdWNjZXNzZnVsXG4gICAgICAgICAgLy8gdXBsb2FkIChjb3VsZCBoYXBwZW4gd2l0aCBhIHN0YWxlLURCIGhhc2ggbWlzbWF0Y2ggd2UgaGF2ZW4ndFxuICAgICAgICAgIC8vIGZpeGVkIHlldCksIGRvbid0IGNsb2JiZXIgdGhlIHRydXRoZnVsIHVwbG9hZCBjb3VudCBcdTIwMTQgdGhhdCdzXG4gICAgICAgICAgLy8gZXhhY3RseSB0aGUgYnVnIHRoYXQgbWFkZSBcIlx1NURGMlx1NjZGNFx1NjVCMCA4MSBcdTdCNDZcIiBzaWxlbnRseSBiZWNvbWVcbiAgICAgICAgICAvLyBcIlx1NURGMlx1NjZGNFx1NjVCMCAwIFx1N0I0NlwiLlxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJ1bmRsZS5lbnRyeSkgJiYgYnVuZGxlLmVudHJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRvdGFsID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2goYGV4cG9ydCBidW5kbGU6IEhUVFAgJHtyLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgZXhwb3J0IGJ1bmRsZTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UobW9kZSA9PT0gXCJsb2NhbFwiID8gXCJhc3NlbWJsZStzdGFzaFwiIDogXCJiYWNrZW5kLXVwbG9hZFwiKTtcblxuICAvLyBGb3JtYXQgZWxhcHNlZCB3YWxsLWNsb2NrIHRpbWU6IHNlY29uZHMgKDEgZHApIGZvciBzaG9ydCBzeW5jcyxcbiAgLy8gXCJtbTpzc1wiIG9uY2Ugd2UgY3Jvc3MgdGhlIG1pbnV0ZSBtYXJrIHNvIHRoZSBwb3B1cCBzdGF0dXMgc3RheXMgcmVhZGFibGUuXG4gIGNvbnN0IF9lbGFwc2VkTXMgPSBEYXRlLm5vdygpIC0gX3QwO1xuICBjb25zdCBfZWxhcHNlZFN0ciA9IF9lbGFwc2VkTXMgPCA2MF8wMDBcbiAgICA/IGAkeyhfZWxhcHNlZE1zIC8gMTAwMCkudG9GaXhlZCgxKX1zYFxuICAgIDogYCR7TWF0aC5mbG9vcihfZWxhcHNlZE1zIC8gNjBfMDAwKX1tJHtNYXRoLnJvdW5kKChfZWxhcHNlZE1zICUgNjBfMDAwKSAvIDEwMDApfXNgO1xuICAvLyBObyBtb3JlIFwiXHU2QTk0XHU2ODQ4XHU1REYyXHU1MDk5XHU1OUE1XHUyMDI2XCIgdGFpbCBcdTIwMTQgdGhlIFx1RDgzRFx1RENFNSBkb3dubG9hZCBidXR0b24gc2l0cyByaWdodFxuICAvLyBiZWxvdyB0aGUgc3RhdHVzLCBzbyBzYXlpbmcgXCJcdTlFREVcdTRFMEJcdTY1QjlcdTYzMDlcdTkyMTVcIiBpcyBqdXN0IG5vaXNlLlxuICBjb25zdCBfbG9jYWxUYWlsID0gXCJcIjtcbiAgY29uc3QgX3N1Y2Nlc3NWZXJiID0gbW9kZSA9PT0gXCJsb2NhbFwiID8gXCJcdTVERjJcdTc1MjJcdTc1MUZcIiA6IFwiXHU1REYyXHU2NkY0XHU2NUIwXCI7XG4gIC8vIFBoYXNlIHRpbWluZ3MgKGBuaGktcGFyYWxsZWw9OHNgLCBgYmFja2VuZC11cGxvYWQ9MC44c2ApIGFyZSBkZXZcbiAgLy8gaW5mbyBcdTIwMTQgdXNlZnVsIHdoZW4gaW52ZXN0aWdhdGluZyBhIHNsb3cgc3luYyBidXQgbm9pc2UgZm9yIGFuIGVuZFxuICAvLyB1c2VyLiBLZWVwIHRoZW0sIGJ1dCB0YWcgd2l0aCB0aGUgXCJcdTIzRjFcIiBwcmVmaXggdGhlIHBvcHVwIHVzZXMgdG9cbiAgLy8gdHVjayB0aGVtIGludG8gYSBkZWVwZXIgXCJcdTYyODBcdTg4NTNcdTdEMzBcdTdCQzBcIiBzdWItdG9nZ2xlLlxuICBjb25zdCBfcGhhc2VMaW5lcyA9IF9waGFzZXMubWFwKChwKSA9PiBgXHUyM0YxICR7cC5uYW1lfT0keyhwLm1zIC8gMTAwMCkudG9GaXhlZCgxKX1zYCk7XG4gIGNvbnN0IF9mdWxsQnJlYWtkb3duID0gWy4uLmJyZWFrZG93biwgLi4uX3BoYXNlTGluZXNdO1xuXG4gIC8vIFBpY2sgdGhlIHJpZ2h0IHN1bW1hcnkgbGluZS4gWmVyby1yZXN1bHQgaXMgdGhlIHRyaWNraWVzdCBjYXNlOlxuICAvLyB3ZSBkb24ndCB3YW50IGEgZ3JlZW4gXHUyNzA1IHNheWluZyBcIjAgXHU3QjQ2XCIgYmVjYXVzZSB0aGF0IHJlYWRzIGFzXG4gIC8vIFwic3VjY2VlZGVkIHdpdGggemVybyBkYXRhXCIuIFRoYXQncyBhbG1vc3QgYWx3YXlzIG9uZSBvZjpcbiAgLy8gICAtIE5ISSBzZXNzaW9uIGV4cGlyZWQgYmV0d2VlbiB0aGUgbG9naW4gcHJvYmUgYW5kIHRoZSBzeW5jXG4gIC8vICAgICAodGhlIElIS0UzNDEwIHByb2JlIGNhbiBzdGlsbCBzdWNjZWVkIHdoaWxlIGRhdGEgZW5kcG9pbnRzXG4gIC8vICAgICByZXNwb25kIHdpdGggZW1wdHkgYXJyYXlzKTtcbiAgLy8gICAtIHRoZSB1c2VyIHRydWx5IGhhcyBubyByZWNvcmRzIGluIHRoZSBzZWxlY3RlZCBkYXRlIHJhbmdlLlxuICAvLyBFaXRoZXIgd2F5IHRoZSBhY3Rpb25hYmxlIG5leHQgc3RlcCBpcyBcIlx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NSBOSEkgXHU1MThEXHU4QTY2XHU0RTAwXHU2QjIxXCIuXG4gIGxldCBfc3VtbWFyeUxpbmU7XG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgX3N1bW1hcnlMaW5lID0gYFx1MjZBMFx1RkUwRiBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTAgXHUwMEI3ICR7X3N1Y2Nlc3NWZXJifSAke3RvdGFsfSBcdTdCNDZcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdUZGMEMke2Vycm9ycy5sZW5ndGh9IFx1OTgwNVx1NTkzMVx1NjU1N1x1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5JHtfbG9jYWxUYWlsfWA7XG4gIH0gZWxzZSBpZiAodG90YWwgPT09IDApIHtcbiAgICBfc3VtbWFyeUxpbmUgPVxuICAgICAgYFx1MjZBMFx1RkUwRiBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTBcdTRGNDZcdTZDOTJcdTYyOTNcdTUyMzBcdTRFRkJcdTRGNTVcdThDQzdcdTY1OTlcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOVx1MjAxNCBgICtcbiAgICAgIGBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0Egc2Vzc2lvbiBcdTUzRUZcdTgwRkRcdTkwNEVcdTY3MUZcdUZGMENcdThBQ0JcdTU2REVcdThBNzJcdTUyMDZcdTk4MDFcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcdUZGMUJcdTYyMTZcdTYyQzlcdTk1NzdcdTMwMENcdTY1RTVcdTY3MUZcdTdCQzRcdTU3MERcdTMwMERcdTUxOERcdThBNjZcdTMwMDJgO1xuICB9IGVsc2Uge1xuICAgIF9zdW1tYXJ5TGluZSA9IGBcdTI3MDUgXHU1M0Q2XHU1Rjk3XHU1QjhDXHU2MjEwIFx1MDBCNyAke19zdWNjZXNzVmVyYn0gJHt0b3RhbH0gXHU3QjQ2XHU1MDY1XHU1RUI3XHU3RDAwXHU5MzA0XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDkke19sb2NhbFRhaWx9YDtcbiAgfVxuXG4gIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgcnVubmluZzogZmFsc2UsXG4gICAgcHJvZ3Jlc3M6IF9zdW1tYXJ5TGluZSxcbiAgICBwaGFzZTogXCJkb25lXCIsXG4gICAgdG90YWxSZXNvdXJjZXM6IHRvdGFsLFxuICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICBlbGFwc2VkTXM6IF9lbGFwc2VkTXMsXG4gICAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBmb3IgdGhlIHBvcHVwJ3MgJ1x1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMCcgY29sbGFwc2libGUuXG4gICAgLy8gS2VlcCBhcyBhIHBsYWluIGFycmF5IHNvIHBvcHVwLmpzIGNhbiByZW5kZXIgd2l0aCBET00gQVBJIChub1xuICAgIC8vIGlubmVySFRNTCAvIG5vIGVzY2FwaW5nIGNvbmNlcm5zKS4gSXRlbXMgbG9vayBsaWtlXG4gICAgLy8gJ2VuY291bnRlcnM9MTIvMTInIG9yICdhZHVsdF9wcmV2ZW50aXZlPTIgcm93cyBcdTIxOTIgMzYgb2JzJy5cbiAgICBicmVha2Rvd246IF9mdWxsQnJlYWtkb3duLFxuICAgIGVycm9ycyxcbiAgICBoaXN0bm86IHBhdGllbnRPdmVycmlkZS5pZF9ubyxcbiAgICBtb2RlLFxuICAgIGxvY2FsRmlsZW5hbWU6IF9sb2NhbEZpbGVuYW1lLFxuICB9KTtcblxuICAvLyBCZXN0LWVmZm9ydDogd3JpdGUgYSBTeW5jIEhpc3Rvcnkgcm93IHRvIHRoZSBiYWNrZW5kIHNvIHRoZSBkYXNoYm9hcmRcbiAgLy8gY2FuIHNob3cgd2hlbi93aG8vaG93LWxvbmcvd2hhdC9yYW5nZS4gU2tpcHBlZCBpbiBsb2NhbCBtb2RlICh0aGVyZVxuICAvLyBpcyBubyBiYWNrZW5kKS4gV3JhcHBlZCArIHN3YWxsb3dlZCBzbyBhIGxvZ2dpbmcgZmFpbHVyZSBuZXZlclxuICAvLyBwcm9wYWdhdGVzIGJhY2sgdG8gdGhlIHVzZXItZmFjaW5nIHN5bmMgc3RhdHVzLlxuICBpZiAobW9kZSAhPT0gXCJsb2NhbFwiKSB0cnkge1xuICAgIGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3N5bmMvbG9nYCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIC4uLihzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9KSxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHN0YXR1czogZXJyb3JzLmxlbmd0aCA/IFwicGFydGlhbFwiIDogXCJzdWNjZXNzXCIsXG4gICAgICAgIHBhdGllbnRfaWQ6IHBhdGllbnRPdmVycmlkZS5pZF9ubyB8fCBcIlwiLFxuICAgICAgICAvLyAvc3luYy9sb2cgbGFuZHMgaW4gdGhlIGRhc2hib2FyZCdzIHN5bmMtaGlzdG9yeSByb3cuIE9ubHlcbiAgICAgICAgLy8gbWFzayB3aGVuIHRoZSB1c2VyIGhhcyBvcHRlZCBpbiBcdTIwMTQgb3RoZXJ3aXNlIGRhc2hib2FyZCBzZWVzXG4gICAgICAgIC8vIHRoZSByYXcgbmFtZSB0aGV5IHR5cGVkIChjb25zaXN0ZW50IHdpdGggXCJcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjhcIiBkZWZhdWx0KS5cbiAgICAgICAgcGF0aWVudF9uYW1lOiBtYXNrRW5hYmxlZFxuICAgICAgICAgID8gbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIilcbiAgICAgICAgICA6IHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCIsXG4gICAgICAgIHRvdGFsLFxuICAgICAgICBicmVha2Rvd24sXG4gICAgICAgIGRhdGVfcmFuZ2U6IGRhdGVSYW5nZUxhYmVsIHx8IFwiXCIsXG4gICAgICAgIGVsYXBzZWRfbXM6IF9lbGFwc2VkTXMsXG4gICAgICAgIHN0YXJ0ZWRfYXQ6IG5ldyBEYXRlKF90MCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgZXJyb3JzLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIGZhaWxlZCB0byB3cml0ZSBoaXN0b3J5IGxvZzpcIiwgZSk7XG4gIH1cbiAgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xufVxuXG4vLyBPbmUtdGltZSBtaWdyYXRpb24gZnJvbSBjaHJvbWUuc3RvcmFnZS5zeW5jIFx1MjE5MiBjaHJvbWUuc3RvcmFnZS5sb2NhbC5cbi8vIFByZXZpb3VzIHZlcnNpb25zIHN0b3JlZCBzeW5jQXBpS2V5ICsgcGF0aWVudE92ZXJyaWRlIChjb250YWluaW5nIHRoZVxuLy8gbmF0aW9uYWwgSUQpIHVuZGVyIC5zeW5jLCB3aGljaCBDaHJvbWUgcmVwbGljYXRlcyB0byB0aGUgdXNlcidzIEdvb2dsZVxuLy8gYWNjb3VudCBhbmQgcHVzaGVzIHRvIGV2ZXJ5IGRldmljZSB0aGV5IHNpZ24gaW50by4gTW92ZSBldmVyeXRoaW5nXG4vLyBzZXR0aW5ncy1yZWxhdGVkIHRvIC5sb2NhbDsgY2xlYXIgdGhlIHN5bmMgY29weS5cbmNvbnN0IFNZTkNfS0VZU19UT19NSUdSQVRFID0gW1xuICBcImJhY2tlbmRVcmxcIixcbiAgXCJzeW5jQXBpS2V5XCIsXG4gIFwic21hcnRBcHBMYXVuY2hVcmxcIixcbiAgXCJwYXRpZW50T3ZlcnJpZGVcIixcbiAgXCJzeW5jTW9kZVwiLFxuICBcIm1hc2tOYW1lRW5hYmxlZFwiLFxuXTtcblxuYXN5bmMgZnVuY3Rpb24gbWlncmF0ZVN5bmNUb0xvY2FsKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHN5bmNlZCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFNZTkNfS0VZU19UT19NSUdSQVRFKTtcbiAgICBjb25zdCBwcmVzZW50ID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgT2JqZWN0LmVudHJpZXMoc3luY2VkKS5maWx0ZXIoKFssIHZdKSA9PiB2ICE9PSB1bmRlZmluZWQpLFxuICAgICk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHByZXNlbnQpLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IGxvY2FsID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KE9iamVjdC5rZXlzKHByZXNlbnQpKTtcbiAgICAvLyBEb24ndCBvdmVyd3JpdGUgYW55dGhpbmcgdGhlIHVzZXIgYWxyZWFkeSBzZXQgb24gdGhpcyBtYWNoaW5lLlxuICAgIGNvbnN0IHRvV3JpdGUgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhwcmVzZW50KS5maWx0ZXIoKFtrXSkgPT4gbG9jYWxba10gPT09IHVuZGVmaW5lZCksXG4gICAgKTtcbiAgICBpZiAoT2JqZWN0LmtleXModG9Xcml0ZSkubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHRvV3JpdGUpO1xuICAgIH1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLnJlbW92ZShPYmplY3Qua2V5cyhwcmVzZW50KSk7XG4gIH0gY2F0Y2gge1xuICAgIC8vIE1pZ3JhdGlvbiBpcyBiZXN0LWVmZm9ydC4gVGhlIG5leHQgcnVuIGdldHMgdG8gdHJ5IGFnYWluLlxuICB9XG59XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGFzeW5jICgpID0+IHtcbiAgYXdhaXQgbWlncmF0ZVN5bmNUb0xvY2FsKCk7XG59KTtcblxuLy8gQWxzbyBydW4gbWlncmF0aW9uIG9uIHNlcnZpY2Utd29ya2VyIHdha2UtdXAgKGNvdmVycyByZWxvYWQvcmVzdGFydFxuLy8gcGF0aHMgd2hlcmUgb25JbnN0YWxsZWQgZG9lc24ndCBmaXJlKS5cbmNocm9tZS5ydW50aW1lLm9uU3RhcnR1cD8uYWRkTGlzdGVuZXI/LigoKSA9PiB7XG4gIG1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xufSk7XG5taWdyYXRlU3luY1RvTG9jYWwoKTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2csIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3RhcnROaGlBcGlTeW5jXCIpIHtcbiAgICBydW5OaGlBcGlTeW5jKG1zZy5wYXlsb2FkKS50aGVuKFxuICAgICAgKCkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICAgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgaWYgKGU/Lm1lc3NhZ2UgPT09IENBTkNFTF9FUlJPUikge1xuICAgICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlLCBjYW5jZWxsZWQ6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGU/Lm1lc3NhZ2UgPT09IFNFU1NJT05fRVhQSVJFRF9FUlJPUikge1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdUQ4M0RcdUREMTIgTkhJIHNlc3Npb24gXHU1REYyXHU3NjdCXHU1MUZBIFx1MjAxNCBcdThBQ0JcdTU3MjggTkhJIHRhYiBcdTkxQ0RcdTY1QjBcdTc2N0JcdTUxNjVcdTVGOENcdTUxOERcdTlFREUgU3luY1wiLFxuICAgICAgICAgICAgICBwaGFzZTogXCJzZXNzaW9uX2V4cGlyZWRcIixcbiAgICAgICAgICAgICAgdHM6IERhdGUubm93KCksIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBleHBpcmVkOiB0cnVlIH0pOyB9IGNhdGNoIHt9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJydW5OaGlBcGlTeW5jIGZhaWxlZFwiLCBlKTtcbiAgICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcnVubmluZzogZmFsc2UsIHByb2dyZXNzOiBgXHUyNzRDICR7ZS5tZXNzYWdlfWAsIHBoYXNlOiBcImVycm9yXCIgfSk7XG4gICAgICAgIHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiBmYWxzZSwgZXJyb3I6IGUubWVzc2FnZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3RvcFN5bmNcIikge1xuICAgIC8vIFNldCB0aGUgY2FuY2VsbGF0aW9uIGZsYWc7IHRoZSBpbi1mbGlnaHQgc3luYyB3aWxsIHRocm93XG4gICAgLy8gQ0FOQ0VMX0VSUk9SIGF0IGl0cyBuZXh0IGNoZWNrQ2FuY2VsKCkgY2FsbC4gIFN0b3JhZ2UgaXMgYWxyZWFkeVxuICAgIC8vIHVwZGF0ZWQgYnkgdGhlIHBvcHVwLCBzbyB3ZSBkb24ndCB0b3VjaCBpdCBoZXJlLlxuICAgIF9jYW5jZWxsZWQgPSB0cnVlO1xuICAgIC8vIERpc2NhcmQgYW55IHBhcnRpYWwgZGF0YSB1cGxvYWRlZCBzbyBmYXIuIFRoZSB1c2VyJ3Mgc3RhdGVkXG4gICAgLy8gY29udHJhY3QgaXMgJ3N0b3AgPSBhYm9ydCwgSSdsbCByZXN5bmMgZnJvbSBzY3JhdGNoIGxhdGVyJyBcdTIwMTQgd2VcbiAgICAvLyBkb24ndCB3YW50IHRvIGxlYXZlIGEgaGFsZi1sb2FkZWQgcGF0aWVudCBpbiB0aGUgRkhJUiBzdG9yZSB0aGF0XG4gICAgLy8gbG9va3MgY29tcGxldGUgdG8gZG93bnN0cmVhbSBTTUFSVCBhcHBzLlxuICAgIGNvbnN0IGN0eCA9IF9hY3RpdmVTeW5jQ3R4O1xuICAgIGlmIChjdHg/LnBhdGllbnRJZCAmJiBjdHguYmFja2VuZCkge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBCYWNrZW5kIHN0b3JlcyBQYXRpZW50IHVuZGVyIGRlcml2ZVBhdGllbnRJZChyYXdJZCksIHNvIHRoZVxuICAgICAgICAgIC8vIERFTEVURSBwYXRoIG11c3QgdXNlIHRoZSBoYXNoZWQgZm9ybSBcdTIwMTQgc2VuZGluZyB0aGUgcmF3IElEXG4gICAgICAgICAgLy8gbWF0Y2hlcyBub3RoaW5nIGFuZCBsZWF2ZXMgdGhlIHBhcnRpYWwgdXBsb2FkIGluIHRoZSBzdG9yZS5cbiAgICAgICAgICBjb25zdCBmaGlyUGlkID0gZGVyaXZlUGF0aWVudElkKGN0eC5wYXRpZW50SWQpO1xuICAgICAgICAgIGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYCR7Y3R4LmJhY2tlbmR9L3N5bmMvcGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IGN0eC5zeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGN0eC5zeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBTdXJmYWNlIHRoZSB3aXBlIGluIHRoZSBzdGF0dXMgc28gdXNlciBzZWVzIGl0IGFjdHVhbGx5IGhhcHBlbmVkLlxuICAgICAgICAgIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBbU1RPUkFHRV9LRVldOiB7XG4gICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1REYyXHU1MDVDXHU2QjYyXHU0RTI2XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBjYW5jZWwgd2lwZSBmYWlsZWQ6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG4gICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImdldFN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkudGhlbigoZGF0YSkgPT4gc2VuZFJlc3BvbnNlKGRhdGFbU1RPUkFHRV9LRVldIHx8IG51bGwpKTtcbiAgICByZXR1cm4gdHJ1ZTsgIC8vIGFzeW5jIHJlc3BvbnNlXG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjbGVhclN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShTVE9SQUdFX0tFWSkudGhlbigoKSA9PiBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjaGVja05oaUxvZ2luXCIpIHtcbiAgICBfY2hlY2tOaGlMb2dpblN0YXRlKG1zZy50YWJJZCkudGhlbihcbiAgICAgIChzdGF0ZSkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogc3RhdGUgfSk7IH0gY2F0Y2gge30gfSxcbiAgICAgICgpID0+IHsgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgbG9nZ2VkSW46IG51bGwgfSk7IH0gY2F0Y2gge30gfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcblxuLy8gQmVsdC1hbmQtc3VzcGVuZGVycyBTVyBrZWVwYWxpdmU6IGFuIGFsYXJtIGV2ZXJ5IDIwIHMgd2FrZXMgdGhlIFNXIGlmXG4vLyBpZGxlLiBDb21iaW5lZCB3aXRoIHRoZSByZXR1cm4tdHJ1ZSBwYXR0ZXJuIGFib3ZlLCB0aGlzIHByZXZlbnRzIHRoZVxuLy8gMzAgcyBpZGxlIHNodXRkb3duIGZyb20gZW5kaW5nIGFuIGluLXByb2dyZXNzIHN5bmMuXG5jaHJvbWUuYWxhcm1zLmNyZWF0ZShcInN3LWtlZXBhbGl2ZVwiLCB7IHBlcmlvZEluTWludXRlczogMC4zNCB9KTtcbmNocm9tZS5hbGFybXMub25BbGFybS5hZGRMaXN0ZW5lcigoKSA9PiB7IC8qIG5vLW9wOyBwcmVzZW5jZSBpcyB0aGUgcG9pbnQgKi8gfSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQVNBLE9BQUMsV0FBVztBQUNWO0FBRUEsWUFBSSxjQUFjO0FBQ2xCLFlBQUksaUJBQWlCO0FBQ3JCLFlBQUksU0FBUyxPQUFPLFdBQVc7QUFDL0IsWUFBSSxPQUFPLFNBQVMsU0FBUyxDQUFDO0FBQzlCLFlBQUksS0FBSyxtQkFBbUI7QUFDMUIsbUJBQVM7QUFBQSxRQUNYO0FBQ0EsWUFBSSxhQUFhLENBQUMsVUFBVSxPQUFPLFNBQVM7QUFDNUMsWUFBSSxVQUFVLENBQUMsS0FBSyxzQkFBc0IsT0FBTyxZQUFZLFlBQVksUUFBUSxZQUFZLFFBQVEsU0FBUztBQUM5RyxZQUFJLFNBQVM7QUFDWCxpQkFBTztBQUFBLFFBQ1QsV0FBVyxZQUFZO0FBQ3JCLGlCQUFPO0FBQUEsUUFDVDtBQUNBLFlBQUksWUFBWSxDQUFDLEtBQUssd0JBQXdCLE9BQU8sV0FBVyxZQUFZLE9BQU87QUFDbkYsWUFBSSxNQUFNLE9BQU8sV0FBVyxjQUFjLE9BQU87QUFDakQsWUFBSSxlQUFlLENBQUMsS0FBSywyQkFBMkIsT0FBTyxnQkFBZ0I7QUFDM0UsWUFBSSxZQUFZLG1CQUFtQixNQUFNLEVBQUU7QUFDM0MsWUFBSSxRQUFRLENBQUMsYUFBYSxTQUFTLE9BQU8sR0FBRztBQUM3QyxZQUFJLFFBQVEsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDO0FBQ3pCLFlBQUksZUFBZSxDQUFDLE9BQU8sU0FBUyxVQUFVLGFBQWE7QUFFM0QsWUFBSSxTQUFTLENBQUM7QUFFZCxZQUFJLFVBQVUsTUFBTTtBQUNwQixZQUFJLEtBQUssc0JBQXNC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QUMvQixlQUFLLFNBQVM7QUFFZCxjQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSztBQUV0RSxpQkFBTyxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFD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SUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTVYsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1WLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEs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QSxJQVdYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQ0U7QUFBQSxJQUNGLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBRVYsVUFB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QUFpQixtQkFBbUIsT0FBTyxDQUFDO0FBQUEsY0FDMUQ7QUFBQSxnQkFDRSxRQUFRO0FBQUEsZ0JBQ1IsU0FBUyxJQUFJLGFBQWEsRUFBRSxrQkFBa0IsSUFBSSxXQUFXLElBQUksQ0FBQztBQUFBLGNBQ3BFO0FBQUEsWUFDRjtBQUVBLGtCQUFNLFFBQVEsTUFBTSxPQUFPLFFBQVEsTUFBTSxJQUFJLFdBQVcsR0FBRyxXQUFXLEtBQUssQ0FBQztBQUM1RSxrQkFBTSxPQUFPLFFBQVEsTUFBTSxJQUFJO0FBQUEsY0FDN0IsQ0FBQyxXQUFXLEdBQUc7QUFBQSxnQkFDYixHQUFHO0FBQUEsZ0JBQ0gsU0FBUztBQUFBLGdCQUNULFVBQVU7QUFBQSxnQkFDVixPQUFPO0FBQUEsZ0JBQ1AsSUFBSSxLQUFLLElBQUk7QUFBQSxnQkFDYixXQUFXLEtBQUssSUFBSTtBQUFBLGNBQ3RCO0FBQUEsWUFDRixDQUFDO0FBQUEsVUFDSCxTQUFTLEdBQUc7QUFDVixvQkFBUSxLQUFLLGtDQUFrQyxDQUFDO0FBQUEsVUFDbEQ7QUFBQSxRQUNGLEdBQUc7QUFBQSxNQUNMO0FBQ0EsdUJBQWlCO0FBQ2pCLFVBQUk7QUFBRSxxQkFBYSxFQUFFLElBQUksS0FBSyxDQUFDO0FBQUEsTUFBRyxRQUFRO0FBQUEsTUFBQztBQUMzQyxhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLGlCQUFpQjtBQUNqQyxhQUFPLFFBQVEsTUFBTSxJQUFJLFdBQVcsRUFBRSxLQUFLLENBQUMsU0FBUyxhQUFhLEtBQUssV0FBVyxLQUFLLElBQUksQ0FBQztBQUM1RixhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLG1CQUFtQjtBQUNuQyxhQUFPLFFBQVEsTUFBTSxPQUFPLFdBQVcsRUFBRSxLQUFLLE1BQU0sYUFBYSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUM7QUFDOUUsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxpQkFBaUI7QUFDakMsMEJBQW9CLElBQUksS0FBSyxFQUFFO0FBQUEsUUFDN0IsQ0FBQyxVQUFVO0FBQUUsY0FBSTtBQUFFLHlCQUFhLEVBQUUsVUFBVSxNQUFNLENBQUM7QUFBQSxVQUFHLFFBQVE7QUFBQSxVQUFDO0FBQUEsUUFBRTtBQUFBLFFBQ2pFLE1BQU07QUFBRSxjQUFJO0FBQUUseUJBQWEsRUFBRSxVQUFVLEtBQUssQ0FBQztBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUFFO0FBQUEsTUFDN0Q7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUtELFNBQU8sT0FBTyxPQUFPLGdCQUFnQixFQUFFLGlCQUFpQixLQUFLLENBQUM7QUFDOUQsU0FBTyxPQUFPLFFBQVEsWUFBWSxNQUFNO0FBQUEsRUFBcUMsQ0FBQzsiLAogICJuYW1lcyI6IFsiQnVmZmVyIiwgImJsb2NrcyIsICJleHBvcnRzIiwgIm1hcFN5c3RlbSIsICJlc2NhcGVSZWdleCIsICJoaXQiLCAiY2prQ2hhcnMiLCAib2JzSWQiLCAibWFwU3lzdGVtIiwgInIiXQp9Cg==
