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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9iYWNrZ3JvdW5kLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENlbnRyYWxpc2VkIEZISVIgQ29kZVN5c3RlbSAvIElkZW50aWZpZXJTeXN0ZW0gVVJJcyB1c2VkIGJ5IHRoZSBtYXBwZXJzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL2ZoaXIvc3lzdGVtcy5weWAuIFdlIHVzZSBVUkwtZm9ybSBzeXN0ZW1zIGluc3RlYWRcbiAqIG9mIE9JRHMgYmVjYXVzZTpcbiAqICAgLSBpdCBkb2Vzbid0IHJlcXVpcmUgbWludGluZy9vd25pbmcgYSByZWFsIE5ISS9UVyBjb3JlIE9JRCxcbiAqICAgLSBpdCdzIHNlbGYtZGVzY3JpYmluZyBpbiB0b29scyB0aGF0IGRvbid0IHJlY29nbmlzZSB0aGUgT0lELFxuICogICAtIGl0IGNsZWFubHkgc3Vydml2ZXMgdGhlIFRXTkhJRkhJUiB2YWxpZGF0b3IncyBzeW50YWN0aWMgY2hlY2suXG4gKlxuICogQWxsIHN5c3RlbXMgbGl2ZSBoZXJlIHNvIGEgc2luZ2xlIGNoYW5nZSByaXBwbGVzIHRvIGV2ZXJ5IG1hcHBlci5cbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDAgTkhJIG5hdGlvbmFsIGNvZGUgc3lzdGVtcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyAobGFiICsgcHJvY2VkdXJlIG9yZGVyIGNvZGVzIFx1MjAxNCBzYW1lIG5hbWVzcGFjZSkuICovXG5leHBvcnQgY29uc3QgTkhJX01FRElDQUxfT1JERVJfQ09ERSA9XG4gIFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvQ29kZVN5c3RlbS9uaGktbWVkaWNhbC1vcmRlci1jb2RlXCI7XG5cbi8qKiBcdTUwNjVcdTRGRERcdTdGNzJcdTg1RTVcdTU0QzFcdTRFRTNcdTc4QkMgKGRydWcgY29kZSkuICovXG5leHBvcnQgY29uc3QgTkhJX0RSVUdfQ09ERSA9IFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvQ29kZVN5c3RlbS9uaGktZHJ1Zy1jb2RlXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBUYWl3YW4gcGF0aWVudCBpZGVudGlmaWVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RiAoVGFpd2FuIG5hdGlvbmFsIElEKS4gKi9cbmV4cG9ydCBjb25zdCBUV19OQVRJT05BTF9JRCA9IFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvSWRlbnRpZmllclN5c3RlbS9uYXRpb25hbC1pZFwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgTG9jYWwgZmFsbGJhY2tzIChwZXItZGVwbG95bWVudCwgTk9UIGNyb3NzLXN5c3RlbSBjYW5vbmljYWwpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX0xBQl9DT0RFID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1sYWJcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTUVESUNBVElPTl9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1tZWRpY2F0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1JFUE9SVF9DT0RFID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1yZXBvcnRcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQ09ORElUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWNvbmRpdGlvblwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9QUk9DRURVUkVfQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtcHJvY2VkdXJlXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX0FMTEVSR0VOX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWFsbGVyZ2VuXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BBVElFTlRfTVJOID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9JZGVudGlmaWVyU3lzdGVtL2hpcy1tcm5cIjtcblxuLy8gXHUyNTAwXHUyNTAwIEludGVybmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgY29uc3QgTE9JTkMgPSBcImh0dHA6Ly9sb2luYy5vcmdcIjtcbmV4cG9ydCBjb25zdCBTTk9NRURfQ1QgPSBcImh0dHA6Ly9zbm9tZWQuaW5mby9zY3RcIjtcbi8qKiBJQ0QtMTAtQ00gKFRhaXdhbiAvIFx1NTA2NVx1NEZERCB1c2VzIHRoaXMsIG5vdCBiYXJlIElDRC0xMCkuICovXG5leHBvcnQgY29uc3QgSUNEXzEwX0NNID0gXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtY21cIjtcbmV4cG9ydCBjb25zdCBJQ0RfMTBfUENTID0gXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtcGNzXCI7XG4iLCAiLyoqXG4gKiBDcm9zcy1tYXBwZXIgaGVscGVycyBzaGFyZWQgYnkgc2V2ZXJhbCBGSElSIHJlc291cmNlIG1hcHBlcnMuXG4gKi9cblxuaW1wb3J0IHsgc2hhMSB9IGZyb20gXCJqcy1zaGExXCI7XG5cbi8qKlxuICogRGV0ZXJtaW5pc3RpYyAzMi1jaGFyIGhleCBJRCBkZXJpdmVkIGZyb20gdGhlIHBhdGllbnQgSUQgKyBhcmJpdHJhcnlcbiAqIGtleSBwYXJ0cy4gU2FtZSBTSEEtMSArIHRydW5jYXRlLTMyIGFsZ29yaXRobSB1c2VkIGluIGJvdGggYmFja2VuZFxuICogYW5kIGV4dGVuc2lvbiBzbyB0aGUgdHdvIHByb2R1Y2UgaWRlbnRpY2FsIElEcyBmb3IgdGhlIHNhbWUgaW5wdXQgXHUyMDE0XG4gKiB0aGlzIGlzIHdoYXQgbWFrZXMgXCJleHRlbnNpb24gbG9jYWwgYnVuZGxlIFx1MjE5MiBiYWNrZW5kIC9maGlyL2ltcG9ydFwiXG4gKiB3b3JrIHdpdGhvdXQgcHJvZHVjaW5nIGR1cGxpY2F0ZSBQYXRpZW50IHJvd3MuXG4gKlxuICogTm90ZTogZGV0ZXJtaW5pc3RpYyArIG5vIHNhbHQgbWVhbnMgYW4gYXR0YWNrZXIgd2hvIG9idGFpbnMgYSBoYXNoZWRcbiAqIFBhdGllbnQuaWQgKGUuZy4gdmlhIEhUVFAgbG9nKSBjYW4gYnJ1dGUtZm9yY2UgdGhlIH4zME0gVGFpd2FuZXNlXG4gKiBuYXRpb25hbCBJRCBzcGFjZSBhbmQgcmVjb3ZlciB0aGUgcmF3IElELiBXZSBhY2NlcHQgdGhpcyBiZWNhdXNlXG4gKiBQYXRpZW50LmlkZW50aWZpZXJbXS52YWx1ZSBhbHJlYWR5IGNhcnJpZXMgdGhlIHJhdyBuYXRpb25hbCBJRCBpblxuICogYW55IGxlYWtlZCBidW5kbGUgXHUyMDE0IHRoZSByZWFsaXN0aWMgbGVhayBzY2VuYXJpb3MgZGlzY2xvc2UgYm90aFxuICogZmllbGRzIHRvZ2V0aGVyLCBzbyBhIHNhbHQgd291bGQgbm90IG1vdmUgdGhlIG5lZWRsZS5cbiAqXG4gKiBVc2VzIGBqcy1zaGExYCAocHVyZSBKUykgaW5zdGVhZCBvZiBgbm9kZTpjcnlwdG9gIHNvIHRoZSBzYW1lIG1hcHBlclxuICogY29kZSBydW5zIHVubW9kaWZpZWQgaW4gdGhlIENocm9tZSBleHRlbnNpb24ncyBsb2NhbC1vbmx5IG1vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVJZChwYXRpZW50SWQ6IHN0cmluZywgLi4ucGFydHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW3BhdGllbnRJZCwgLi4ucGFydHNdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogTWFwIGEgcmF3IG5hdGlvbmFsIElEIChvciBhbnkgcGF0aWVudCBpZGVudGlmaWVyKSB0byBpdHMgMzItY2hhciBoZXhcbiAqIEZISVIgYFBhdGllbnQuaWRgLiBUaGUgcmF3IHZhbHVlIGlzIGtlcHQgaW4gYFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlYFxuICogXHUyMDE0IG9ubHkgdGhlIEZISVIgbG9naWNhbCBpZCBpcyBoYXNoZWQgc28gaXQgZG9lc24ndCBsZWFrIGludG8gVVJMcyxcbiAqIHN1YmplY3QucmVmZXJlbmNlIGZpZWxkcywgYXVkaXQgbG9ncywgb3IgU01BUlQgdG9rZW4gcGF5bG9hZHMuXG4gKlxuICogRkhJUiBSNCBcdTAwQTcyLjIwIHNheXMgXCJsb2dpY2FsIGlkIFx1MjAyNiBTSE9VTEQgTk9UIGNvbnRhaW4gaWRlbnRpZnlpbmdcbiAqIGluZm9ybWF0aW9uXCIgXHUyMDE0IHRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVQYXRpZW50SWQobmF0aW9uYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW1wicGF0aWVudFwiLCBuYXRpb25hbElkXS5qb2luKFwifFwiKSkuc2xpY2UoMCwgMzIpO1xufVxuXG4vKipcbiAqIFBhcnRpYWxseS1hbm9ueW1pemUgYSBwYXRpZW50IG5hbWUuIEFwcGxpZWQgaW4gbWFwUGF0aWVudCBzbyBldmVyeVxuICogRkhJUiByZXNvdXJjZSB0aGF0IGZsb3dzIG91dCBvZiB0aGlzIGNvZGViYXNlIChkb3dubG9hZGVkIEJ1bmRsZSxcbiAqIGJhY2tlbmQgRkhJUiBzdG9yZSwgZGFzaGJvYXJkLCBTTUFSVCBhcHAgbGF1bmNoZXMpIHNlZXMgdGhlIG1hc2tlZFxuICogZm9ybS4gVGhlIHVzZXIncyByYXcgaW5wdXQgaXMgc3RpbGwga2VwdCBpbiBjaHJvbWUuc3RvcmFnZSBzbyB0aGV5XG4gKiBjYW4gcmV2aWV3IHdoYXQgd2FzIGVudGVyZWQsIGJ1dCBpdCBuZXZlciBsZWF2ZXMgUGF0aWVudCBjb250ZXh0LlxuICpcbiAqIFJ1bGVzIChUYWl3YW4gLyBDSksgY29udmVudGlvbik6XG4gKiAgIC0gMSBjaGFyICAgICBcdTIxOTIga2VlcCBhcy1pcyAobm90aGluZyB0byBtYXNrKVxuICogICAtIDIgY2hhcnMgICAgXHUyMTkyIGtlZXAgZmlyc3QsIHJlcGxhY2Ugc2Vjb25kIHdpdGggTyAgICBcdTczOEJcdTY2MEUgXHUyMTkyIFx1NzM4Qk9cbiAqICAgLSAzKyBjaGFycyAgIFx1MjE5MiBrZWVwIGZpcnN0ICsgbGFzdCwgbWlkZGxlIGFsbCBPICAgICAgXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTY3OTdcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1Njc5N09PXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTRFMkRcdTVDRjZcdTUwNjVcdTZCMjFcdTkwQ0UgXHUyMTkyIFx1NEUyRE9PT1x1OTBDRVxuICpcbiAqIFdlc3Rlcm4gbmFtZXMgKGNvbnRhaW4gd2hpdGVzcGFjZSk6IHNwbGl0IG9uIHNwYWNlLCBrZWVwIGZpcnN0ICtcbiAqIGxhc3QgdG9rZW5zLCBwYXJ0aWFsLW1hc2sgdGhlIGxhc3QgYW5kIG1pZGRsZTpcbiAqICAgSm9obiBTbWl0aCBcdTIxOTIgSm9obiBTKioqXG4gKiAgIEpvaG4gUSBTbWl0aCBcdTIxOTIgSm9obiAqKiogU21pdGhcbiAqL1xuLyoqXG4gKiBIYWxmLW1hc2sgYSBUYWl3YW4gbmF0aW9uYWwgSUQgZm9yIHNob3VsZGVyLXN1cmZpbmctc2FmZSBkaXNwbGF5LlxuICogTWF0Y2hlcyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBJ3Mgb3duIGBoaWRgIGNvbnZlbnRpb24gKGZpcnN0IDYgdmlzaWJsZSwgbGFzdFxuICogNCBoaWRkZW4pOiBgUDEyMzQ1MDg2NmAgXHUyMTkyIGBQMTIzNDUqKioqYC5cbiAqXG4gKiBgY2hhcmAgZGVmYXVsdHMgdG8gYCpgIGZvciBwb3B1cC90b2FzdCBkaXNwbGF5LiBVc2UgYFhgIGZvciBmaWxlbmFtZXNcbiAqIHNpbmNlIGAqYCBpcyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIFRoZSBhdXRvLWdlbmVyYXRlZFxuICogYGF1dG8tWFhYWFhYWFhgIHBsYWNlaG9sZGVycyBmbG93IHRocm91Z2ggdW5jaGFuZ2VkIChhbHJlYWR5XG4gKiBub24taWRlbnRpZnlpbmcpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFza0lkKGlkOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjaGFyID0gXCIqXCIpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKGlkID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gcztcbiAgaWYgKC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChzKSkgcmV0dXJuIHMuc2xpY2UoMCwgNikgKyBjaGFyLnJlcGVhdCg0KTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gcztcbiAgaWYgKHMubGVuZ3RoID4gNikgcmV0dXJuIHMuc2xpY2UoMCwgMikgKyBjaGFyLnJlcGVhdChzLmxlbmd0aCAtIDQpICsgcy5zbGljZSgtMik7XG4gIHJldHVybiBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFza05hbWUobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSAobmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghdHJpbW1lZCB8fCB0cmltbWVkID09PSBcIlVua25vd25cIikgcmV0dXJuIHRyaW1tZWQ7XG5cbiAgaWYgKC9cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoL1xccysvKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSByZXR1cm4gcGFydHNbMF0hO1xuICAgIGNvbnN0IGZpcnN0ID0gcGFydHNbMF0hO1xuICAgIGNvbnN0IGxhc3QgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSE7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gRml4ZWQgMyBzdGFycyByZWdhcmRsZXNzIG9mIG9yaWdpbmFsIGxlbmd0aCBcdTIwMTQgZG9uJ3QgbGVhayBob3dcbiAgICAgIC8vIGxvbmcgdGhlIHN1cm5hbWUgd2FzIHZpYSBtYXNrIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxhc3RNYXNrZWQgPSBsYXN0Lmxlbmd0aCA8PSAxID8gbGFzdCA6IGAke2xhc3RbMF19KioqYDtcbiAgICAgIHJldHVybiBgJHtmaXJzdH0gJHtsYXN0TWFza2VkfWA7XG4gICAgfVxuICAgIGNvbnN0IG1pZGRsZXMgPSBwYXJ0cy5zbGljZSgxLCAtMSkubWFwKCgpID0+IFwiKioqXCIpO1xuICAgIHJldHVybiBbZmlyc3QsIC4uLm1pZGRsZXMsIGxhc3RdLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgLy8gQ0pLIC8gc2luZ2xlLXRva2VuIHBhdGguIEl0ZXJhdGUgY29kZXBvaW50cyAobm90IFVURi0xNiB1bml0cykgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyBjYW4ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKHRyaW1tZWQpO1xuICBpZiAoY2hhcnMubGVuZ3RoIDw9IDEpIHJldHVybiB0cmltbWVkO1xuICBpZiAoY2hhcnMubGVuZ3RoID09PSAyKSByZXR1cm4gYCR7Y2hhcnNbMF19T2A7XG4gIHJldHVybiBjaGFyc1swXSArIFwiT1wiLnJlcGVhdChjaGFycy5sZW5ndGggLSAyKSArIGNoYXJzW2NoYXJzLmxlbmd0aCAtIDFdO1xufVxuIiwgIi8qKlxuICogQWxsZXJneUludG9sZXJhbmNlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvYWxsZXJneS5weWAuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUxMT1dFRF9DQVRFR09SSUVTID0gbmV3IFNldChbXCJtZWRpY2F0aW9uXCIsIFwiZm9vZFwiLCBcImVudmlyb25tZW50XCIsIFwiYmlvbG9naWNcIl0pO1xuY29uc3QgQUxMT1dFRF9DUklUSUNBTElUWSA9IG5ldyBTZXQoW1wiaGlnaFwiLCBcImxvd1wiLCBcInVuYWJsZS10by1hc3Nlc3NcIl0pO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwicnhub3JtXCIpKSByZXR1cm4gXCJodHRwOi8vd3d3Lm5sbS5uaWguZ292L3Jlc2VhcmNoL3VtbHMvcnhub3JtXCI7XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9BTExFUkdFTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQWxsZXJneUludG9sZXJhbmNlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQWxsZXJnZW5cIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQWxsZXJneUludG9sZXJhbmNlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcucmVjb3JkZWRfZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgcGF0aWVudDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjbGluaWNhbFN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtY2xpbmljYWxcIixcbiAgICAgICAgICBjb2RlOiBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtdmVyaWZpY2F0aW9uXCIsXG4gICAgICAgICAgY29kZTogXCJjb25maXJtZWRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGNhdGVnb3J5ID0gcmF3LmNhdGVnb3J5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NBVEVHT1JJRVMuaGFzKGNhdGVnb3J5KSkge1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW2NhdGVnb3J5XTtcbiAgfVxuXG4gIGNvbnN0IGNyaXRpY2FsaXR5ID0gcmF3LmNyaXRpY2FsaXR5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NSSVRJQ0FMSVRZLmhhcyhjcml0aWNhbGl0eSkpIHtcbiAgICByZXNvdXJjZS5jcml0aWNhbGl0eSA9IGNyaXRpY2FsaXR5O1xuICB9XG5cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IHJlYWN0aW9uTm90ZSA9IHJhdy5yZWFjdGlvbiA/PyBcIlwiO1xuICBpZiAocmVhY3Rpb25Ob3RlKSB7XG4gICAgcmVzb3VyY2UucmVhY3Rpb24gPSBbeyBkZXNjcmlwdGlvbjogcmVhY3Rpb25Ob3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogQ29uZGl0aW9uIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvY29uZGl0aW9uLnB5YC4gSW5jbHVkZXMgdGhlIElDRC0xMC1DTVxuICogbm9ybWFsaXNlciAoVFdOSElGSElSIFJvdW5kLTMgZml4KSB3aGljaCBpbnNlcnRzIHRoZSBjYW5vbmljYWwgZG90XG4gKiBiYWNrIGludG8gTkhJJ3MgdW4tZG90dGVkIGNvZGVzIChcIkUxMTIyXCIgXHUyMTkyIFwiRTExLjIyXCIpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbi8vIElDRC0xMC1DTSBjYW5vbmljYWwgZm9ybSBpcyAnWFhYLllZWVtBLVpdJyAoY2F0ZWdvcnkgMyBjaGFycyArIG9wdGlvbmFsXG4vLyBkb3QgKyBzdWJkaXZpc2lvbiArIG9wdGlvbmFsIDd0aC1jaGFyYWN0ZXIgZXh0ZW5zaW9uKS4gTkhJIFx1NTA2NVx1NEZERCBzZW5kc1xuLy8gY29kZXMgV0lUSE9VVCB0aGUgZG90ICgnRTExMjInLCAnTTQ3ODkyJywgJ1MwOTkzWEEnLCAnTTE5MjcxJykuXG4vLyBWYWxpZGF0b3IgcmVqZWN0cyB1bi1kb3R0ZWQgY29kZXMgYXMgJ1Vua25vd24gY29kZScuXG5jb25zdCBJQ0QxMF9DQVRFR09SWV9SRSA9IC9eW0EtWl1bMC05QS1aXXsyfSQvO1xuXG4vKipcbiAqIEluc2VydCB0aGUgZG90IGJhY2sgaW50byBOSEkncyBuby1kb3QgSUNELTEwLUNNIGNvZGVzLlxuICogICBFMTEyMiAgICBcdTIxOTIgRTExLjIyXG4gKiAgIE00Nzg5MiAgIFx1MjE5MiBNNDcuODkyXG4gKiAgIFMwOTkzWEEgIFx1MjE5MiBTMDkuOTNYQVxuICogICBFMTEgICAgICBcdTIxOTIgRTExICAgICAgICAobm8gc3ViZGl2aXNpb247IHBhc3MgdGhyb3VnaClcbiAqICAgRTExLjIyICAgXHUyMTkyIEUxMS4yMiAgICAgKGFscmVhZHkgZG90dGVkOyBwYXNzIHRocm91Z2gpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVJY2QxMENtKGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWNvZGUgfHwgY29kZS5pbmNsdWRlcyhcIi5cIikpIHJldHVybiBjb2RlID8/IFwiXCI7XG4gIGNvbnN0IHMgPSBjb2RlLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAocy5sZW5ndGggPD0gMykgcmV0dXJuIHM7XG4gIGNvbnN0IGhlYWQgPSBzLnNsaWNlKDAsIDMpO1xuICBjb25zdCB0YWlsID0gcy5zbGljZSgzKTtcbiAgaWYgKElDRDEwX0NBVEVHT1JZX1JFLnRlc3QoaGVhZCkpIHtcbiAgICByZXR1cm4gYCR7aGVhZH0uJHt0YWlsfWA7XG4gIH1cbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJpY2QtMTBcIikgfHwgcy5pbmNsdWRlcyhcImljZDEwXCIpKSB7XG4gICAgLy8gTkhJIFx1NTA2NVx1NEZERCBjb2RlcyBhcmUgSUNELTEwLUNNIChVUy9UYWl3YW4gZXh0ZW5kZWQgc2V0IFx1MjAxNCBlLmcuXG4gICAgLy8gRTExLjIyKS4gVGhlIGJhc2UgSUNELTEwIFZhbHVlU2V0IHJlamVjdHMgdGhlc2UgYXMgJ1Vua25vd24gY29kZScuXG4gICAgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX0NNO1xuICB9XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9DT05ESVRJT05fQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcENvbmRpdGlvbihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJDb25kaXRpb25cIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCByYXcuY29kZSA/PyBcIlwiLCByYXcub25zZXRfZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjbGluaWNhbFN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9jb25kaXRpb24tY2xpbmljYWxcIixcbiAgICAgICAgICBjb2RlOiByYXcuY2xpbmljYWxfc3RhdHVzID8/IFwiYWN0aXZlXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgdmVyaWZpY2F0aW9uU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi12ZXItc3RhdHVzXCIsXG4gICAgICAgICAgY29kZTogXCJjb25maXJtZWRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgPz8gXCJVbmtub3duIENvbmRpdGlvblwiO1xuICBsZXQgY29kZSA9IHJhdy5jb2RlIGFzIHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuICBpZiAoc3lzdGVtID09PSBzeXN0ZW1zLklDRF8xMF9DTSAmJiBjb2RlKSB7XG4gICAgY29kZSA9IG5vcm1hbGl6ZUljZDEwQ20oY29kZSk7XG4gIH1cbiAgcmVzb3VyY2UuY29kZSA9IHtcbiAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgIHRleHQ6IGRpc3BsYXksXG4gIH07XG5cbiAgY29uc3Qgc2V2ZXJpdHkgPSByYXcuc2V2ZXJpdHkgPz8gXCJcIjtcbiAgaWYgKHNldmVyaXR5KSB7XG4gICAgcmVzb3VyY2Uuc2V2ZXJpdHkgPSB7IHRleHQ6IHNldmVyaXR5IH07XG4gIH1cblxuICBpZiAocmF3Lm9uc2V0X2RhdGUpIHtcbiAgICByZXNvdXJjZS5vbnNldERhdGVUaW1lID0gYCR7cmF3Lm9uc2V0X2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIERpYWdub3N0aWNSZXBvcnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9kaWFnbm9zdGljX3JlcG9ydC5weWAuIFJldHVybnMgbnVsbCBmb3JcbiAqIGxpc3QtcGFnZSByb3dzIGxhY2tpbmcgYSBjb25jbHVzaW9uLCBhbmQgZm9yIGxhYi12YWx1ZS1vbmx5IFwicmVwb3J0c1wiXG4gKiB0aGF0IHdvdWxkIGR1cGxpY2F0ZSBhIHByb3BlciBPYnNlcnZhdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG5jb25zdCBWMl8wMDc0ID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIjtcblxuY29uc3QgQ0FURUdPUllfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBMQUI6IFtWMl8wMDc0LCBcIkxBQlwiLCBcIkxhYm9yYXRvcnlcIl0sXG4gIFJBRDogW1YyXzAwNzQsIFwiUkFEXCIsIFwiUmFkaW9sb2d5XCJdLFxuICBDQVI6IFtWMl8wMDc0LCBcIkNBUlwiLCBcIkNhcmRpb2xvZ3lcIl0sXG4gIFBBVEg6IFtWMl8wMDc0LCBcIlBBVFwiLCBcIlBhdGhvbG9neVwiXSxcbn07XG5cbi8vIExhYi1yZXN1bHQgcGF0dGVybnMgdGhhdCBsb29rIGxpa2Ugc2luZ2xlLXZhbHVlIGxhYiByZWFkaW5ncyByYXRoZXJcbi8vIHRoYW4gYSBuYXJyYXRpdmUgcmVwb3J0LlxuY29uc3QgTEFCX1VOSVRfUkUgPVxuICAvXFxkKyg/OlxcLlxcZCspP1xccyooPzolfG1nXFwvZEx8Z1xcL2RMfG1tb2xcXC9MfFVcXC9MfElVXFwvTHxtSVVcXC9MfG5nXFwvbUx8XHUwM0JDZ1xcL2RMfHVnXFwvZEx8cGdcXC9tTHxmTHxcXC91THwxMFxcXj9cXGQrXFwvdUx8eDEwXFxeP1xcZCtcXC91THxzZWN8XHU3OUQyfGNvcGllc1xcL21MKS87XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgdGV4dCA9IGNvbmNsdXNpb24udHJpbSgpO1xuICAvLyBSZWFsIG5hcnJhdGl2ZSByZXBvcnRzIGFsbW9zdCBhbHdheXMgY29udGFpbiBtdWx0aXBsZSBzZW50ZW5jZXMuXG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDEwMCkgcmV0dXJuIGZhbHNlO1xuICAvLyBTaW5nbGUgdmFsdWUgcGF0dGVybiArIHBhcmVudGhldGljYWwgcmVmZXJlbmNlIHJhbmdlID0gbGFiIGxpbmUuXG4gIGlmIChMQUJfVU5JVF9SRS50ZXN0KHRleHQpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwRGlhZ25vc3RpY1JlcG9ydChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgY29uY2x1c2lvbiA9ICgocmF3LmNvbmNsdXNpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY2F0S2V5UmF3ID0gU3RyaW5nKHJhdy5jYXRlZ29yeSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAoY2F0S2V5UmF3ID09PSBcIkxBQlwiICYmIGxvb2tzTGlrZUxhYlZhbHVlT25seShjb25jbHVzaW9uKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBSZXBvcnRcIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW1IaW50ID0gcmF3LnN5c3RlbSA/PyBcIlwiO1xuICBjb25zdCBzeXN0ZW0gPVxuICAgIHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiICYmIHN5c3RlbUhpbnQudG9VcHBlckNhc2UoKSA9PT0gXCJMT0lOQ1wiXG4gICAgICA/IHN5c3RlbXMuTE9JTkNcbiAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfUkVQT1JUX0NPREU7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJmaW5hbFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgICBjb25jbHVzaW9uLFxuICB9O1xuXG4gIGNvbnN0IGNhdEVudHJ5ID0gQ0FURUdPUllfTUFQW2NhdEtleVJhd107XG4gIGlmIChjYXRFbnRyeSkge1xuICAgIGNvbnN0IFtjYXRTeXMsIGNhdENvZGUsIGNhdERpc3BsYXldID0gY2F0RW50cnk7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbeyBjb2Rpbmc6IFt7IHN5c3RlbTogY2F0U3lzLCBjb2RlOiBjYXRDb2RlLCBkaXNwbGF5OiBjYXREaXNwbGF5IH1dIH1dO1xuICB9XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcuaXNzdWVkKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3Lmlzc3VlZH1UMDA6MDA6MDArMDg6MDBgO1xuICB9IGVsc2UgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuaXNzdWVkID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IGhvc3BpdGFsIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogRW5jb3VudGVyIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZW5jb3VudGVyLnB5YC4gU3RhYmxlIElEIGluY2x1ZGVzIGhvc3BpdGFsXG4gKiBzbyBzYW1lLWRheSB2aXNpdHMgdG8gZGlmZmVyZW50IGluc3RpdHV0aW9ucyBlYWNoIGdldCB0aGVpciBvd25cbiAqIEVuY291bnRlciAodGhlIHBvc3QtbWFwcGluZyBsaW5rZXIgZGVwZW5kcyBvbiB0aGlzKS5cbiAqL1xuXG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUNUQ09ERV9TWVNURU0gPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtQWN0Q29kZVwiO1xuXG5jb25zdCBDTEFTU19NQVA6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXT4gPSB7XG4gIEFNQjogW0FDVENPREVfU1lTVEVNLCBcIkFNQlwiLCBcImFtYnVsYXRvcnlcIl0sXG4gIElNUDogW0FDVENPREVfU1lTVEVNLCBcIklNUFwiLCBcImlucGF0aWVudCBlbmNvdW50ZXJcIl0sXG4gIEVNRVI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJFTUVSXCIsIFwiZW1lcmdlbmN5XCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEVuY291bnRlcihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGVuY0NsYXNzID0gU3RyaW5nKHJhdy5jbGFzcyA/PyBcIkFNQlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjbGFzc0VudHJ5ID0gQ0xBU1NfTUFQW2VuY0NsYXNzXSA/PyBDTEFTU19NQVAuQU1CITtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiRW5jb3VudGVyXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgcmF3LmRhdGUgPz8gXCJcIiwgZW5jQ2xhc3MsICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmlzaGVkXCIsXG4gICAgY2xhc3M6IHtcbiAgICAgIHN5c3RlbTogY2xhc3NFbnRyeVswXSxcbiAgICAgIGNvZGU6IGNsYXNzRW50cnlbMV0sXG4gICAgICBkaXNwbGF5OiBjbGFzc0VudHJ5WzJdLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICAvLyBOSEkncyBlbmNvdW50ZXIgXCJ0eXBlXCIgbWFya2VycyBcdTIwMTQgJ0lDXHU1MzYxXHU4Q0M3XHU2NTk5JyAvICdcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTknIC8gJ1x1NEY0Rlx1OTY2MidcbiAgLy8gXHUyMDE0IGFyZSBkYXRhLW9yaWdpbiBsYWJlbHMsIG5vdCBTTk9NRUQgY2xpbmljYWwgdHlwZXMuIEtlZXAgdGhlbSBhc1xuICAvLyBDb2RlYWJsZUNvbmNlcHQudGV4dCB3aXRob3V0IGNsYWltaW5nIFNOT01FRC5cbiAgY29uc3QgdHlwZURpc3BsYXkgPSAoKHJhdy50eXBlX2Rpc3BsYXkgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmICh0eXBlRGlzcGxheSkge1xuICAgIHJlc291cmNlLnR5cGUgPSBbeyB0ZXh0OiB0eXBlRGlzcGxheSB9XTtcbiAgfVxuXG4gIGNvbnN0IHBlcmlvZDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBpZiAocmF3LmRhdGUpIHBlcmlvZC5zdGFydCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChyYXcuZW5kX2RhdGUpIHBlcmlvZC5lbmQgPSBgJHtyYXcuZW5kX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKE9iamVjdC5rZXlzKHBlcmlvZCkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLnBlcmlvZCA9IHBlcmlvZDtcbiAgfVxuXG4gIGNvbnN0IGRlcGFydG1lbnQgPSByYXcuZGVwYXJ0bWVudCA/PyBcIlwiO1xuICBjb25zdCBwcm92aWRlciA9IHJhdy5wcm92aWRlciA/PyBcIlwiO1xuICBpZiAoZGVwYXJ0bWVudCB8fCBwcm92aWRlcikge1xuICAgIGNvbnN0IHBhcnRpY2lwYW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKHByb3ZpZGVyKSBwYXJ0aWNpcGFudC5pbmRpdmlkdWFsID0geyBkaXNwbGF5OiBwcm92aWRlciB9O1xuICAgIHJlc291cmNlLnBhcnRpY2lwYW50ID0gT2JqZWN0LmtleXMocGFydGljaXBhbnQpLmxlbmd0aCA+IDAgPyBbcGFydGljaXBhbnRdIDogW107XG4gICAgaWYgKGRlcGFydG1lbnQpIHtcbiAgICAgIHJlc291cmNlLnNlcnZpY2VUeXBlID0geyB0ZXh0OiBkZXBhcnRtZW50IH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaG9zcGl0YWwgPSAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGhvc3BpdGFsKSB7XG4gICAgcmVzb3VyY2Uuc2VydmljZVByb3ZpZGVyID0geyBkaXNwbGF5OiBob3NwaXRhbCB9O1xuICB9XG5cbiAgY29uc3QgcmVhc29uID0gcmF3LnJlYXNvbiA/PyBcIlwiO1xuICBpZiAocmVhc29uKSB7XG4gICAgcmVzb3VyY2UucmVhc29uQ29kZSA9IFt7IHRleHQ6IHJlYXNvbiB9XTtcbiAgfVxuXG4gIGNvbnN0IGRpc2NoYXJnZSA9IHJhdy5kaXNjaGFyZ2VfZGlzcG9zaXRpb24gPz8gXCJcIjtcbiAgaWYgKGRpc2NoYXJnZSkge1xuICAgIHJlc291cmNlLmhvc3BpdGFsaXphdGlvbiA9IHsgZGlzY2hhcmdlRGlzcG9zaXRpb246IHsgdGV4dDogZGlzY2hhcmdlIH0gfTtcbiAgfVxuXG4gIGNvbnN0IGNsaW5pY2FsTm90ZSA9ICgocmF3LmNsaW5pY2FsX25vdGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChjbGluaWNhbE5vdGUpIHtcbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogY2xpbmljYWxOb3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogTWVkaWNhdGlvblJlcXVlc3QgbWFwcGVyICsgYmlsaW5ndWFsIGRlZHVwbGljYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL21lZGljYXRpb24ucHlgLiBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIHJlcG9ydHMgdGhlXG4gKiBTQU1FIHByZXNjcmlwdGlvbiBtdWx0aXBsZSB0aW1lcyAoRW5nbGlzaC1vbmx5IC8gRW5nK1x1NEUyRCAvIFx1NEUyRCtFbmcpLlxuICogYG1hcE1lZGljYXRpb25zRGVkdXBgIGNvbGxhcHNlcyB0aGVzZSB0byBvbmUgTWVkaWNhdGlvblJlcXVlc3QgcGVyXG4gKiAoZGF0ZSwgY2Fub25pY2FsLWRydWcta2V5KSwgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIG1vcmUgQ0pLIGNoYXJzXG4gKiAoY2xpbmljaWFucyByZWFkIFx1NTU0Nlx1NTRDMVx1NTQwRCBmaXJzdCkuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBub3JtYWxpemVJY2QxMENtIH0gZnJvbSBcIi4vY29uZGl0aW9uXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gaXNDamsoY2g6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBcdTRFMDAgKFUrNEUwMCkgdG8gXHU5RkZGIChVKzlGRkYpIGNvdmVycyBDSksgVW5pZmllZCBJZGVvZ3JhcGhzLlxuICBjb25zdCBjcCA9IGNoLmNvZGVQb2ludEF0KDApID8/IDA7XG4gIHJldHVybiBjcCA+PSAweDRlMDAgJiYgY3AgPD0gMHg5ZmZmO1xufVxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgaWYgKCFzKSByZXR1cm4gMDtcbiAgbGV0IG4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIGlmIChpc0NqayhjaCkpIG4rKztcbiAgcmV0dXJuIG47XG59XG5cbi8qKlxuICogTWF0Y2ggYSBcImxvbmdcIiBFbmdsaXNoIGNodW5rIChcdTIyNjU0IGNoYXJzIG9mIEEtWi8wLTkvcHVuY3R1YXRpb24gY29tbW9uXG4gKiB0byBkcnVnIG5hbWVzKS4gQXZvaWQgbWF0Y2hpbmcgc2hvcnQgdG9rZW5zIGxpa2UgXCJEXCIgb3IgXCJQT1wiIHRoYXRcbiAqIGFwcGVhciBpbnNpZGUgQ2hpbmVzZSBuYW1lcy5cbiAqL1xuY29uc3QgRU5fQ0hVTktfRyA9IC9bQS1aXVtBLVowLTkuJS9cXC1cIidcXHNdezMsfS9nO1xuXG4vKipcbiAqIFJlZHVjZSBhIGRydWctbmFtZSBzdHJpbmcgdG8gYSBzdGFibGUgY2Fub25pY2FsIGtleS4gRXh0cmFjdCB0aGVcbiAqIGxvbmdlc3QgRW5nbGlzaCBmcmFnbWVudCwgdGhlbiB0cnVuY2F0ZSBhdCBjb21tb24gc2VwYXJhdG9ycyBzbyBhXG4gKiBuYW1lIHdpdGggZXh0cmEgdHJhaWxpbmcgbW9kaWZpZXJzIHN0aWxsIGNvbGxhcHNlcyB0byBicmFuZCtzdHJlbmd0aC5cbiAqXG4gKiBFeGFtcGxlcyAoYWxsIG1hcCB0byBcInRpbW9wdG9sIHhlIDAuNSUgb3BodGhhbG1pYyBzb2x1dGlvblwiKTpcbiAqICAgXCJUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT05cIlxuICogICBcIlRJTU9QVE9MIFhFIDAuNSUgT1BIVEhBTE1JQyBTT0xVVElPTiAoXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2KVwiXG4gKiAgIFwiXHU5NzUyXHU3NzNDXHU5NzMyXHUyMDI2IChUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT04pXCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbERydWdLZXkobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSAobmFtZSA/PyBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBjb25zdCBjaHVua3MgPSBbLi4ucy5tYXRjaEFsbChFTl9DSFVOS19HKV0ubWFwKChtKSA9PiBtWzBdKTtcbiAgaWYgKGNodW5rcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKG5hbWUgPz8gXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgbGV0IGxvbmdlc3QgPSBjaHVua3MucmVkdWNlKChhLCBiKSA9PiAoYi5sZW5ndGggPiBhLmxlbmd0aCA/IGIgOiBhKSkudHJpbSgpO1xuICBmb3IgKGNvbnN0IHNlcCBvZiBbXCIgLSBcIiwgXCIgXHUyMDEzIFwiLCBcIiAvIFwiXSkge1xuICAgIGlmIChsb25nZXN0LmluY2x1ZGVzKHNlcCkpIHtcbiAgICAgIGxvbmdlc3QgPSBsb25nZXN0LnNwbGl0KHNlcClbMF0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbG9uZ2VzdC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBCZXN0LWVmZm9ydCBhY3RpdmUgdnMgY29tcGxldGVkIGRlY2lzaW9uIGZvciBhIE1lZGljYXRpb25SZXF1ZXN0LlxuICogQWN0aXZlIHdoaWxlIChhdXRob3JlZF9kYXRlICsgZHVyYXRpb24gPiB0b2RheSk7IG90aGVyd2lzZSBjb21wbGV0ZWQuXG4gKiBNaXNzaW5nIGR1cmF0aW9uIFx1MjE5MiBhc3N1bWUgOTAtZGF5IHJlZmlsbCB3aW5kb3cgKE5ISSdzIHR5cGljYWwgY2FkZW5jZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZWRTdGF0dXMoXG4gIGF1dGhvcmVkSXNvOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkdXJhdGlvbkRheXM6IGFueSxcbik6IFwiYWN0aXZlXCIgfCBcImNvbXBsZXRlZFwiIHtcbiAgaWYgKCFhdXRob3JlZElzbykgcmV0dXJuIFwiY29tcGxldGVkXCI7XG4gIGNvbnN0IGRhdGVQYXJ0ID0gU3RyaW5nKGF1dGhvcmVkSXNvKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IHBhcnNlZCA9IG5ldyBEYXRlKGAke2RhdGVQYXJ0fVQwMDowMDowMFpgKTtcbiAgaWYgKE51bWJlci5pc05hTihwYXJzZWQuZ2V0VGltZSgpKSkgcmV0dXJuIFwiY29tcGxldGVkXCI7XG5cbiAgbGV0IGRheXM6IG51bWJlciB8IG51bGw7XG4gIGlmIChkdXJhdGlvbkRheXMgPT09IG51bGwgfHwgZHVyYXRpb25EYXlzID09PSB1bmRlZmluZWQgfHwgZHVyYXRpb25EYXlzID09PSBcIlwiKSB7XG4gICAgZGF5cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbiA9IE51bWJlci5wYXJzZUludChTdHJpbmcoZHVyYXRpb25EYXlzKSwgMTApO1xuICAgIGRheXMgPSBOdW1iZXIuaXNGaW5pdGUobikgPyBuIDogbnVsbDtcbiAgfVxuICBpZiAoZGF5cyA9PT0gbnVsbCkgZGF5cyA9IDkwO1xuXG4gIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHBhcnNlZC5nZXRUaW1lKCkpO1xuICBlbmQuc2V0VVRDRGF0ZShlbmQuZ2V0VVRDRGF0ZSgpICsgZGF5cyk7XG4gIC8vIENvbXBhcmUgZGF0ZS1vbmx5ICh0b2RheSBpbiBVVEMgc2luY2Ugd2UgYXV0aG9yZWRJc28gaXMgZGF0ZS1vbmx5KS5cbiAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICB0b2RheS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGVuZCA+PSB0b2RheSA/IFwiYWN0aXZlXCIgOiBcImNvbXBsZXRlZFwiO1xufVxuXG4vKipcbiAqIENvbnZlcnQgb25lIHNjcmFwZWQgcHJlc2NyaXB0aW9uIGRpY3QgXHUyMTkyIEZISVIgUjQgTWVkaWNhdGlvblJlcXVlc3QuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiByYXcgaGFzIG5vIGBkcnVnX25hbWVgIChjYWxsZXIgZmlsdGVycyBvdXQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTWVkaWNhdGlvblJlcXVlc3QoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGRydWdOYW1lID0gKChyYXcuZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWRydWdOYW1lKSByZXR1cm4gbnVsbDtcblxuICAvLyBDYW5vbmljYWwga2V5IChub3QgcmF3IGRydWdfbmFtZSkgZm9yIHN0YWJsZSBpZCBzbyB0aGUgdGhyZWUgTkhJXG4gIC8vIFx1NEUyRFx1ODJGMSB2YXJpYW50cyBvZiB0aGUgc2FtZSBkcnVnIGNvbGxhcHNlIHRvIG9uZSBGSElSIHJlc291cmNlLlxuICBjb25zdCBtZWRJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgY2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSksIHJhdy5kYXRlID8/IFwiXCIpO1xuXG4gIGNvbnN0IGRydWdDb2RlID0gKChyYXcuY29kZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgY29uc3QgY29kaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIHN5c3RlbTogZHJ1Z0NvZGUgPyBzeXN0ZW1zLk5ISV9EUlVHX0NPREUgOiBzeXN0ZW1zLkhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUsXG4gICAgY29kZTogZHJ1Z0NvZGUgfHwgZHJ1Z05hbWUsXG4gICAgZGlzcGxheTogZHJ1Z05hbWUsXG4gIH07XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk1lZGljYXRpb25SZXF1ZXN0XCIsXG4gICAgaWQ6IG1lZElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IG1lZFN0YXR1cyhyYXcuZGF0ZSA/PyBcIlwiLCByYXcuZHVyYXRpb25fZGF5cyksXG4gICAgaW50ZW50OiBcIm9yZGVyXCIsXG4gICAgbWVkaWNhdGlvbkNvZGVhYmxlQ29uY2VwdDoge1xuICAgICAgY29kaW5nOiBbY29kaW5nXSxcbiAgICAgIHRleHQ6IGRydWdOYW1lLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5hdXRob3JlZE9uID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IGRydWdDbGFzcyA9ICgocmF3LmRydWdfY2xhc3MgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChkcnVnQ2xhc3MpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFt7IHRleHQ6IGRydWdDbGFzcyB9XTtcbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnJlcXVlc3RlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIC8vIERvc2FnZSBcdTIwMTQgb25seSB3aGVuIHNvdXJjZSBhY3R1YWxseSBoYXMgaXQuIE5ISSdzIG1lZGljYXRpb24tbGlzdFxuICAvLyBlbmRwb2ludCBwcm92aWRlcyBub25lIG9mIHRoZXNlOyBvdGhlciBISVMgYWRhcHRlcnMgZ2V0IGFcbiAgLy8gc3RydWN0dXJlZCBkb3NhZ2Ugb3V0LlxuICBjb25zdCBkb3NhZ2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgayBvZiBbXCJkb3NlXCIsIFwidW5pdFwiLCBcImZyZXF1ZW5jeVwiXSBhcyBjb25zdCkge1xuICAgIGlmIChyYXdba10pIHBhcnRzLnB1c2goU3RyaW5nKHJhd1trXSkpO1xuICB9XG4gIGlmIChwYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgZG9zYWdlLnRleHQgPSBwYXJ0cy5qb2luKFwiIFwiKTtcbiAgfVxuICBpZiAocmF3LnJvdXRlKSB7XG4gICAgZG9zYWdlLnJvdXRlID0ge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW06IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiLCBkaXNwbGF5OiByYXcucm91dGUgfV0sXG4gICAgfTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMoZG9zYWdlKS5sZW5ndGggPiAwKSB7XG4gICAgcmVzb3VyY2UuZG9zYWdlSW5zdHJ1Y3Rpb24gPSBbZG9zYWdlXTtcbiAgfVxuXG4gIC8vIGRpc3BlbnNlUmVxdWVzdCB3aXRoIHF1YW50aXR5ICsgc3VwcGx5IGR1cmF0aW9uIHdoZW4gcHJlc2VudC5cbiAgY29uc3QgZHI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgcXR5UmF3ID0gcmF3LnF1YW50aXR5O1xuICBpZiAocXR5UmF3ICE9PSBudWxsICYmIHF0eVJhdyAhPT0gdW5kZWZpbmVkICYmIHF0eVJhdyAhPT0gXCJcIikge1xuICAgIGNvbnN0IHF0eU51bSA9IE51bWJlci5wYXJzZUZsb2F0KFN0cmluZyhxdHlSYXcpLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocXR5TnVtKSkge1xuICAgICAgZHIucXVhbnRpdHkgPSB7IHZhbHVlOiBxdHlOdW0gfTtcbiAgICB9XG4gIH1cbiAgaWYgKHJhdy5kdXJhdGlvbl9kYXlzKSB7XG4gICAgY29uc3QgZGF5cyA9IE51bWJlci5wYXJzZUludChTdHJpbmcocmF3LmR1cmF0aW9uX2RheXMpLCAxMCk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShkYXlzKSkge1xuICAgICAgZHIuZXhwZWN0ZWRTdXBwbHlEdXJhdGlvbiA9IHtcbiAgICAgICAgdmFsdWU6IGRheXMsXG4gICAgICAgIHVuaXQ6IFwiZGF5c1wiLFxuICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiLFxuICAgICAgICBjb2RlOiBcImRcIixcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkcikubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRpc3BlbnNlUmVxdWVzdCA9IGRyO1xuICB9XG5cbiAgY29uc3QgaW5kaWNhdGlvbiA9ICgocmF3LmluZGljYXRpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25Db2RlID0gKChyYXcuaW5kaWNhdGlvbl9jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uQ29kZSkge1xuICAgIGNvbnN0IHJjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGluZGljYXRpb25Db2RlKSB7XG4gICAgICByYy5jb2RpbmcgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IHN5c3RlbXMuSUNEXzEwX0NNLFxuICAgICAgICAgIGNvZGU6IG5vcm1hbGl6ZUljZDEwQ20oaW5kaWNhdGlvbkNvZGUpLFxuICAgICAgICAgIGRpc3BsYXk6IGluZGljYXRpb24gfHwgaW5kaWNhdGlvbkNvZGUsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAoaW5kaWNhdGlvbikge1xuICAgICAgcmMudGV4dCA9IGluZGljYXRpb25Db2RlID8gYCR7aW5kaWNhdGlvbkNvZGV9ICR7aW5kaWNhdGlvbn1gLnRyaW0oKSA6IGluZGljYXRpb247XG4gICAgfVxuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbcmNdO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIEdyb3VwLWF3YXJlIG1lZGljYXRpb24gbWFwcGVyIHRoYXQgZGVkdXBlcyBcdTRFMkRcdTgyRjEgXHU5NkQ5XHU4QTlFIGR1cGxpY2F0ZXMuXG4gKlxuICogU3RyYXRlZ3k6XG4gKiAgIDEuIENvbXB1dGUgY2Fub25pY2FsIGtleSBwZXIgZHJ1ZyBuYW1lIChsb25nZXN0IEVuZ2xpc2ggY2h1bmspLlxuICogICAyLiBHcm91cCBieSAoZGF0ZSwgY2Fub25pY2FsX2tleSkuIEtlZXAgT05FIGVudHJ5IHBlciBncm91cCxcbiAqICAgICAgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGJyYW5kXG4gKiAgICAgIG5hbWUgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZpcnN0KS5cbiAqICAgMy4gTWFwIGVhY2gga2VwdCBlbnRyeSB0aHJvdWdoIG1hcE1lZGljYXRpb25SZXF1ZXN0LlxuICpcbiAqIE5vdGU6IFB5dGhvbiBjb21tZW50IHNheXMgXCJtb3JlIENKS1wiIGJ1dCB0aGUgY29kZSB1c2VzIGA8YCAoZmV3ZXIpO1xuICogd2UgcHJlc2VydmUgdGhlIGFjdHVhbCBjb2RlIGJlaGF2aW91ciB0byBrZWVwIHBhcml0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25zRGVkdXAocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGZvciAoY29uc3QgaXRlbSBvZiByYXdJdGVtcykge1xuICAgIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZHJ1Z05hbWUgPSAoKGl0ZW0uZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGlmICghZHJ1Z05hbWUpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRhdGVQYXJ0ID0gKChpdGVtLmRhdGUgPz8gXCJcIikgYXMgc3RyaW5nKS5zbGljZSgwLCAxMCk7XG4gICAgY29uc3Qga2V5ID0gYCR7ZGF0ZVBhcnR9fCR7Y2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSl9YDtcbiAgICBjb25zdCBleGlzdGluZyA9IGJ5S2V5LmdldChrZXkpO1xuICAgIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUHJlZmVyIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmQgbmFtZSkuXG4gICAgICBpZiAoY2prQ2hhcnMoZHJ1Z05hbWUpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZHJ1Z19uYW1lID8/IFwiXCIpKSB7XG4gICAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBieUtleS52YWx1ZXMoKSkge1xuICAgIGNvbnN0IG0gPSBtYXBNZWRpY2F0aW9uUmVxdWVzdChpdGVtLCBwYXRpZW50SWQpO1xuICAgIGlmIChtICE9PSBudWxsKSBvdXQucHVzaChtKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwgIi8qKlxuICogTE9JTkMgbWFwcGluZyB0YWJsZXMgZm9yIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIExPSU5DIFI0IGNvZGluZ3MuXG4gKlxuICogUHVyZSBkYXRhLCBubyBsb2dpYy4gUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19sb2luY190YWJsZXMucHlgLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBfTkhJX1RPX0xPSU5DIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgcHJpbWFyeSBMT0lOQyBtYXBwaW5nLiBTb3VyY2Ugb2YgdHJ1dGg6XG4vLyBUV05ISUZISVIgUEFTIEltcGxlbWVudGF0aW9uIEd1aWRlIENvbmNlcHRNYXAtbmhpLWxvaW5jXG4vLyBodHRwczovL2J1aWxkLmZoaXIub3JnL2lnL1RXTkhJRkhJUi9wYXMvQ29uY2VwdE1hcC1uaGktbG9pbmMuaHRtbFxuLy9cbi8vIFRoYXQgQ29uY2VwdE1hcCBkZWNsYXJlcyA1MyBOSEkgY29kZXMgd2l0aCBgZXF1aXZhbGVuY2U6IHJlbGF0ZWR0b2Bcbi8vIGFnYWluc3QgODA2IExPSU5DIHZhcmlhbnRzIChkaWZmZXJlbnQgc3BlY2ltZW5zIC8gdW5pdHMgLyBtZXRob2RzXG4vLyBwZXIgTkhJIGNvZGUgXHUyMDE0IGNvbmZpcm1pbmcgdGhlIFwiTkhJIGlzIGNvYXJzZSwgTE9JTkMgaXMgZmluZVwiIHZpZXcpLlxuLy8gRm9yIGVhY2ggTkhJIGNvZGUgd2UgaGFuZC1waWNrIHRoZSBjYW5vbmljYWwgTE9JTkMgbW9zdCBjbGluaWNpYW5zXG4vLyB3b3VsZCBleHBlY3QgaW4gYSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgbGFiIHJlcG9ydDogU2VydW0vUGxhc21hICsgTWFzcy12b2x1bWVcbi8vIChvciBhdXRvLWNvdW50IGZvciBjZWxsIGNvdW50ZXJzKS4gRWRnZSBjYXNlcyBub3RlZCBpbmxpbmUuXG5leHBvcnQgY29uc3QgTkhJX1RPX0xPSU5DOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgSGFlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDJDXCI6IFwiNjY5MC0yXCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3OCBcdTIwMTQgTGV1a29jeXRlcyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMDNDXCI6IFwiNzE4LTdcIiwgLy8gXHU4ODQwXHU4MjcyXHU3RDIwXHU2QUEyXHU2N0U1IFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIEJsb29kXG4gIFwiMDgwMDZDXCI6IFwiNzc3LTNcIiwgLy8gXHU4ODQwXHU1QzBGXHU2NzdGXHU4QTA4XHU2NTc4IFx1MjAxNCBQbGF0ZWxldHMgIy92b2wgQmxvb2QgQXV0b1xuICBcIjA4MDEzQ1wiOiBcIjU3MDIxLThcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4IFx1MjAxNCBDQkMgVyBBdXRvIERpZmYgcGFuZWxcbiAgXCIwODEyOEJcIjogXCI0NzI4Ni0wXCIsIC8vIFx1OUFBOFx1OUFEM1x1N0QzMFx1ODBERVx1NUY2Mlx1NjE0Qlx1NTIyNFx1OEI4MFx1NTQwOFx1NEY3NVx1N0QzMFx1ODBERVx1NTIwNlx1OTg1RVx1OEEwOFx1NjU3OFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDExQ1wiOiBcIjE3ODYxLTZcIiwgLy8gXHU5MjIzIFx1MjAxNCBDYWxjaXVtIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDE1Q1wiOiBcIjIxNjAtMFwiLCAvLyBcdTgwOENcdTkxNzhcdTkxNTBcdTMwMDFcdTg4NDAgXHUyMDE0IENyZWF0aW5pbmUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMTZDXCI6IFwiMjE2MS04XCIsIC8vIFx1ODA4Q1x1OTE1MFx1MzAwMVx1NUMzRiBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBVcmluZVxuICBcIjA5MDI1Q1wiOiBcIjE5MjAtOFwiLCAvLyBBU1QvR09UIFx1MjAxNCBBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjZDXCI6IFwiMTc0Mi02XCIsIC8vIEFMVC9HUFQgXHUyMDE0IEFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjlDXCI6IFwiMTk3NS0yXCIsIC8vIFx1ODFCRFx1N0QwNVx1N0QyMFx1N0UzRFx1OTFDRiBcdTIwMTQgQmlsaXJ1YmluIHRvdGFsIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDMwQ1wiOiBcIjE5NjgtN1wiLCAvLyBcdTc2RjRcdTYzQTVcdTgxQkRcdTdEMDVcdTdEMjAgXHUyMDE0IEJpbGlydWJpbiBkaXJlY3QgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzNDXCI6IFwiMjUzMi0wXCIsIC8vIFx1NEU3M1x1OTE3OFx1ODEyQlx1NkMyQlx1ODEyMiBcdTIwMTQgTERIIEFjdGl2aXR5IFMvUFxuICBcIjA5MDM4Q1wiOiBcIjE3NTEtN1wiLCAvLyBcdTc2N0RcdTg2Q0JcdTc2N0QgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzhDXCI6IFwiMzU2NzItNVwiLCAvLyBcdTc2RjRcdTYzQTUvXHU3RTNEXHU4MUJEXHU3RDA1XHU3RDIwXHU2QkQ0XHU1MDNDXG4gIFwiMTIxMTJCXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RChcdTUxNERcdTc1QUJcdTZCRDRcdTZGQzFcdTZDRDUpIFx1MjAxNCBBbGJ1bWluIE1hc3Mvdm9sIFMvUFxuICBcIjI0MDA3QlwiOiBcIjE5OTUtMFwiLCAvLyBcdTg4NDBcdTZGM0ZcdTZFMzhcdTk2RTJcdTkyMjMgXHUyMDE0IENhbGNpdW0gaW9uaXplZCBNb2xlcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBIb3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyMUNcIjogXCIyOTg2LThcIiwgLy8gXHU3NzZBXHU0RTM4XHU5MTZGXHU5MTg3XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgTWFzcy92b2wgUy9QXG4gIFwiMjcwMjFCXCI6IFwiMjk5MS04XCIsIC8vIFx1Nzc2QVx1NEUzOFx1ODEwMlx1OTE4N1x1NjUzRVx1NUMwNFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgVGVzdG9zdGVyb25lIEZyZWUgUy9QXG4gIC8vIDA5MTI1QyAvIDA5MTI3QyBjb3JyZWN0ZWQgYWZ0ZXIgZHVhbC1yZXZpZXdlciBhdWRpdCBcdTIwMTQgdGhlIGVhcmxpZXJcbiAgLy8gdmFsdWVzICgzMDE2LTMgd2FzIFRTSCwgMTA1MDEtNSB3YXMgTEgpIHdlcmUganVzdCB3cm9uZyBjb3B5LVxuICAvLyBwYXN0ZXMuIFNvdXJjZSBmb3IgdGhlIG5ldyB2YWx1ZXM6IFRXTkhJRkhJUiBQQVMgQ29uY2VwdE1hcC5cbiAgXCIwOTEyNUNcIjogXCI4MzA5OC00XCIsIC8vIFx1NkZGRVx1NkNFMVx1NTIzQVx1NkZDMFx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRm9sbGl0cm9waW4gKEZTSCkgSW1tdW5vYXNzYXkgUy9QXG4gIFwiMDkxMjdDXCI6IFwiODMwOTYtOFwiLCAvLyBcdTRFOENcdTZDMkJcdTU3RkFcdTY2MjVcdTYwQzVcdTdEMjBcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IEVzdHJhZGlvbCBJbW11bm9hc3NheSBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFR1bW9yIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDdDXCI6IFwiMTgzNC0xXCIsIC8vIFx1MDNCMS1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDQ5Q1wiOiBcIjE4MzQtMVwiLCAvLyBcdTc1MzItXHU4MENFXHU1MTUyXHU4NkNCXHU3NjdEIChBRlAsIFJJQSlcbiAgXCIxMjA4MUNcIjogXCI4MzExMi0zXCIsIC8vIFBTQSAoRUlBL0xJQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjEyMTk4Q1wiOiBcIjgzMTEzLTFcIiwgLy8gRnJlZSBQU0EgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjI3MDUyQ1wiOiBcIjI4NTctMVwiLCAvLyBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUYgKFBTQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDgzQlwiOiBcIjEwODg2LTBcIiwgLy8gXHU2RTM4XHU5NkUyUFNBIChSSUEpXG4gIFwiMTIwNTJCXCI6IFwiMTA4NzMtOFwiLCAvLyBcdTAzQjIyLVx1NUZBRVx1NzQwM1x1ODZDQlx1NzY3RFxuICAvLyBcdTI1MDBcdTI1MDAgSW1tdW5vbG9neSAvIHByb3RlaW5zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDY1QlwiOiBcIjkwOTkxLTFcIiwgLy8gXHU4NkNCXHU3NjdEXHU5NkZCXHU2Q0YzXHU1MjA2XHU2NzkwXG4gIFwiMTIwMjhCXCI6IFwiMTQwMDItMFwiLCAvLyBJZ00gXHU1NUFFXHU1NDExXHU1MTREXHU3NUFCXHU2NEY0XHU2NTYzXG4gIFwiMTIwMjlCXCI6IFwiMTQwMDItMFwiLCAvLyBJZ00gXHU1MTREXHU3NUFCXHU2QkQ0XHU2RkMxXHU2Q0Q1XG4gIFwiMTIxMDNCXCI6IFwiOTU4MDEtN1wiLCAvLyBcdTUxNERcdTc1QUJcdTk2RkJcdTZDRjNcdTUyMDZcdTY3OTBcbiAgXCIxMjE2MEJcIjogXCIxNTE4OS00XCIsIC8vIElnRyBcdTAzQkEvXHUwM0JCXG4gIFwiMTIxNzFCXCI6IFwiMTczNTEtOFwiLCAvLyBcdTYyOTdcdTU1RENcdTRFMkRcdTYwMjdcdTc0MDNcdTdEMzBcdTgwREVcdThDRUFcdTYyOTdcdTlBRDQgKEFOQ0EpXG4gIFwiMTIyMDRCXCI6IFwiMjA1ODQtOVwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdTg4NjhcdTk3NjJcdTZBMTlcdThBMThcbiAgXCIyNTAxM0JcIjogXCI0NDU5Ni01XCIsIC8vIFx1ODdBMlx1NTE0OVx1NTIwN1x1NzI0N1x1NkFBMlx1NjdFNVxuICAvLyBcdTI1MDBcdTI1MDAgSGVwYXRpdGlzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE0MDMwQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMxQ1wiOiBcIjUxOTUtM1wiLCAvLyBIQnNBZ1xuICBcIjE0MDMyQ1wiOiBcIjUxOTYtMVwiLCAvLyBIQnNBZyAoTWFzcy92b2wpXG4gIFwiMTQwNTFDXCI6IFwiMTM5NTUtMFwiLCAvLyBIQ1YgQWJcbiAgXCIyNzAzM0NcIjogXCI1MTk3LTlcIiwgLy8gSEJzQWcgUklBXG4gIC8vIFx1MjUwMFx1MjUwMCBQYXRob2xvZ3kgLyBjeXRvbG9neSAvIElIQyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjE5NUJcIjogXCIxODQ3NC03XCIsIC8vIEhlci0yL25ldSBJU0hcbiAgXCIyNzA2MUJcIjogXCIxNDEzMC05XCIsIC8vIFx1NTJENVx1NjBDNVx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoRVIpXG4gIFwiMjcwNjJCXCI6IFwiMTA4NjEtM1wiLCAvLyBcdTlFQzNcdTlBRDRcdTZGQzBcdTdEMjBcdTYzQTVcdTUzRDdcdTlBRDQgKFBSKVxuICBcIjMwMTAzQlwiOiBcIjgzMDUyLTFcIiwgLy8gUEQtTDEgSUhDXG4gIC8vIFx1MjUwMFx1MjUwMCBBdWRpb2xvZ3kgLyBwdWxtb25hcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTcwMDlCXCI6IFwiMjQzNDEtMFwiLCAvLyBcdTRFMDBcdTZDMjdcdTUzMTZcdTc4QjNcdTgwQkFcdTcwMzBcdTY1NjNcdTkxQ0ZcbiAgXCIyMjAwMUNcIjogXCI0NTQ5OC0zXCIsIC8vIFx1N0QxNFx1OTdGM1x1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICBcIjIyMDE1QlwiOiBcIjQ1NDk4LTNcIiwgLy8gXHU4QTUwXHU4MDdFXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMjVCXCI6IFwiNDY1MzAtMlwiLCAvLyBcdTgxRUFcdThBMThcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFNVUFBMRU1FTlRBTCAobm90IGluIFBBUyBDb25jZXB0TWFwIFx1MjAxNCBoYW5kLWN1cmF0ZWQgZnJvbSBjb21tb25cbiAgLy8gTkhJIGNvZGVzIHNlZW4gaW4gXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBLiBMT0lOQyB2ZXJpZmllZCBhZ2FpbnN0IGxvaW5jLm9yZ1xuICAvLyBjYW5vbmljYWwgbmFtZXMuIE1ldGhvZC1zcGVjaWZpYyBjb2RlcyAoZS5nLiBocy1DUlApIHBpY2sgdGhlXG4gIC8vIHNwZWNpZmljIExPSU5DOyBnZW5lcmFsLW1ldGhvZCBjb2RlcyBwaWNrIHRoZSBtb3N0IGNvbW1vbiBmb3JtLlxuICAvLyBJZiBcdTUwNjVcdTRGRERcdTdGNzIgcHVibGlzaGVzIGFuIGF1dGhvcml0YXRpdmUgYnJvYWRlciBDb25jZXB0TWFwIGxhdGVyLFxuICAvLyByZXBsYWNlIHRoaXMgc2VjdGlvbiBpbiBvbmUgcGFzcy5cbiAgLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIC8gSGJBMWMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDVDXCI6IFwiMTU1OC02XCIsIC8vIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENiAoR2x1LUFDKSBcdTIwMTQgRmFzdGluZyBnbHVjb3NlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTQwQ1wiOiBcIjIzNDUtN1wiLCAvLyBcdTg4NDBcdTdDRDYtXHU5OTEwXHU1RjhDL1x1OTZBOFx1NkE1RiBcdTIwMTQgR2x1Y29zZSBNYXNzL3ZvbCBTL1AgKGdlbmVyYWwpXG4gIFwiMDkwMDZDXCI6IFwiNDU0OC00XCIsIC8vIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMCAoSGJBMWMpIFx1MjAxNCBIZW1vZ2xvYmluIEExYy9IZ2IudG90YWwgQmxvb2RcbiAgLy8gXHUyNTAwXHUyNTAwIFJlbmFsIC8gZWxlY3Ryb2x5dGVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDAyQ1wiOiBcIjMwOTQtMFwiLCAvLyBCVU4gXHUyMDE0IFVyZWEgbml0cm9nZW4gTWFzcy92b2wgUy9QXG4gIFwiMDkwMTNDXCI6IFwiMzA4NC0xXCIsIC8vIFVyaWMgQWNpZCBcdTIwMTQgVXJhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMjFDXCI6IFwiMjk1MS0yXCIsIC8vIE5hIFx1MjAxNCBTb2RpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDIyQ1wiOiBcIjI4MjMtM1wiLCAvLyBLICBcdTIwMTQgUG90YXNzaXVtIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAyNENcIjogXCIyMDI4LTlcIiwgLy8gQ08yIFx1MjAxNCBDYXJib24gZGlveGlkZSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMTJDXCI6IFwiMjc3Ny0xXCIsIC8vIElub3JnYW5pYyBQIFx1MjAxNCBQaG9zcGhhdGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDZCXCI6IFwiMTkxMjMtOVwiLCAvLyBNZyBcdTIwMTQgTWFnbmVzaXVtIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGlwaWQgcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDFDXCI6IFwiMjA5My0zXCIsIC8vIFQtQ2hvbGVzdGVyb2wgXHUyMDE0IENob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDA0Q1wiOiBcIjI1NzEtOFwiLCAvLyBURyBcdTIwMTQgVHJpZ2x5Y2VyaWRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQzQ1wiOiBcIjIwODUtOVwiLCAvLyBIREwgXHUyMDE0IEhETCBjaG9sZXN0ZXJvbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NENcIjogXCIxMzQ1Ny03XCIsIC8vIExETCBcdTIwMTQgTERMIGNob2xlc3Rlcm9sIChjYWxjdWxhdGVkKSBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIExpdmVyIGZ1bmN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDI3Q1wiOiBcIjY3NjgtNlwiLCAvLyBBTEstUCBcdTIwMTQgQWxrYWxpbmUgcGhvc3BoYXRhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzFDXCI6IFwiMjMyNC0yXCIsIC8vIFx1MDNCMy1HVCBcdTIwMTQgR2FtbWEgZ2x1dGFteWwgdHJhbnNmZXJhc2UgQWN0aXZpdHkgUy9QXG4gIFwiMDkwMzVDXCI6IFwiMjUwMC03XCIsIC8vIFRJQkMgXHUyMDE0IElyb24gYmluZGluZyBjYXBhY2l0eSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzN0NcIjogXCIxODI3LTVcIiwgLy8gQW1tb25pYSBcdTIwMTQgUGxhc21hXG4gIFwiMDkwNjRDXCI6IFwiMzA0MC0zXCIsIC8vIExpcGFzZSBcdTIwMTQgQWN0aXZpdHkgUy9QXG4gIFwiMDkwNTlCXCI6IFwiMTQxMTgtNFwiLCAvLyBMYWN0YXRlIFx1MjAxNCBNYXNzL3ZvbCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgZXh0cmFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA4MDA0Q1wiOiBcIjQ1NDQtM1wiLCAvLyBIQ1QgXHUyMDE0IEhlbWF0b2NyaXQgdm9sdW1lIGZyYWN0aW9uIEJsb29kXG4gIFwiMDgwMDhDXCI6IFwiMTQxOTYtMFwiLCAvLyBSZXRpY3Vsb2N5dGUgXHUyMDE0IFJldGljdWxvY3l0ZXMvMTAwIFJCQ1xuICBcIjA4MDEwQ1wiOiBcIjcxMS0yXCIsIC8vIEVvc2lub3BoaWwgY291bnQgXHUyMDE0ICMvdm9sIEJsb29kXG4gIFwiMDgwMTFDXCI6IFwiMjQzMTctMFwiLCAvLyBDQkMgcGFuZWwgXHUyMDE0IEhlbWF0b2xvZ3kgcGFuZWwgQmxvb2RcbiAgXCIwODAyNkNcIjogXCI2MzAxLTZcIiwgLy8gUFQvSU5SIFx1MjAxNCBJTlIgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODAzNkNcIjogXCIxNDk3OS05XCIsIC8vIEFQVFQgXHUyMDE0IFBsYXRlbGV0IHBvb3IgcGxhc21hXG4gIFwiMDgwNzVDXCI6IFwiMjY5Mi03XCIsIC8vIE9zbW9sYWxpdHkgXHUyMDE0IFNlcnVtIG9yIFBsYXNtYVxuICBcIjA4MDc5QlwiOiBcIjMwMjQwLTZcIiwgLy8gRC1kaW1lciBcdTIwMTQgUGx0IHBvb3IgcGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTA2Q1wiOiBcIjMwMjQtN1wiLCAvLyBGcmVlIFQ0IFx1MjAxNCBUaHlyb3hpbmUgZnJlZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTExMkNcIjogXCIzMDE2LTNcIiwgLy8gVFNIIFx1MjAxNCBUaHlyb3Ryb3BpbiBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRpYWMgbWFya2VycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTA5OUNcIjogXCIxMDgzOS05XCIsIC8vIFRyb3BvbmluIEkgXHUyMDE0IFRyb3BvbmluIEkgY2FyZGlhYyBTL1BcbiAgXCIxMjE5MkNcIjogXCIzMzk1OS04XCIsIC8vIFByb2NhbGNpdG9uaW4gXHUyMDE0IFMvUFxuICBcIjEyMTkzQ1wiOiBcIjMzNzYyLTZcIiwgLy8gTlQtcHJvQk5QIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFZpdGFtaW5zIC8gY29mYWN0b3JzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MTI5Q1wiOiBcIjIxMzItOVwiLCAvLyBWaXQgQjEyIFx1MjAxNCBDb2JhbGFtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzBDXCI6IFwiMjI4NC04XCIsIC8vIEZvbGF0ZSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMDkxMTNDXCI6IFwiMjE0My02XCIsIC8vIENvcnRpc29sIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjExNkNcIjogXCIyMjc2LTRcIiwgLy8gRmVycml0aW4gXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgQWN1dGUgcGhhc2UgLyBpbmZsYW1tYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEyMDE1QyBpcyB0aGUgZ2VuZXJpYyBOSEkgQ1JQIG9yZGVyIFx1MjAxNCBtb3N0IGNsaW5pY2FsIGNvbnRleHRzIGluIFx1NTA2NVx1NEZERFxuICAvLyBzZW5kIGEgcmVndWxhciAobm90IGhzLSkgQ1JQLCBzbyBtYXAgdG8gMTk4OC01LiBJZiBhIFx1OTY2Mlx1NjI0MCBzcGVjaWZpY2FsbHlcbiAgLy8gYmlsbHMgaHMtQ1JQIGl0IHdpbGwgbGFuZCBvbiBhIGRpZmZlcmVudCBjb2RlIChlLmcuIDEyMTg5QykuXG4gIFwiMTIwMTVDXCI6IFwiMTk4OC01XCIsIC8vIENSUCBcdTIwMTQgQyByZWFjdGl2ZSBwcm90ZWluIE1hc3Mvdm9sIFMvUFxuICBcIjEyMDUzQ1wiOiBcIjUwNDgtNFwiLCAvLyBBTkEgXHUyMDE0IEFudGludWNsZWFyIEFiIFRpdGVyIFMvUFxuICBcIjEyMDU2QlwiOiBcIjE2MTI0LTBcIiwgLy8gQW50aS1taXRvY2hvbmRyaWFsIEFiIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwNjAxMkNcIjogXCI1Nzc4LTZcIiwgLy8gVXJpbmUgYXBwZWFyYW5jZSBcdTIwMTQgQ29sb3JcbiAgXCIwNjAxM0NcIjogXCIyNDM1Ni04XCIsIC8vIFx1NUMzRlx1NzUxRlx1NTMxNiBwYW5lbCBcdTIwMTQgVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA3MDAxQ1wiOiBcIjE0NTYzLTFcIiwgLy8gU3Rvb2wgb2NjdWx0IGJsb29kXG4gIFwiMDkxMzRDXCI6IFwiNTg0NTMtMlwiLCAvLyBpRk9CVCBxdWFudGl0YXRpdmUgXHUyMDE0IEhlbW9nbG9iaW4gTWFzcy92b2wgU3Rvb2wgYnkgSUFcbiAgXCIxMjExMUNcIjogXCIyMTYxLThcIiwgLy8gVXJpbmUgQ3JlYXRpbmluZSBcdTIwMTQgc2FtZSBMT0lOQyBhcyAwOTAxNkNcbiAgLy8gXHUyNTAwXHUyNTAwIFNlcm9sb2d5IC8gaW1tdW5vbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMjAwMUNcIjogXCI1MjkyLThcIiwgLy8gUlBSIFx1MjAxNCBTZXJ1bS9QbGFzbWFcbiAgXCIxMjAyMUNcIjogXCIyMDM5LTZcIiwgLy8gQ0VBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyNUJcIjogXCIyNDY1LTNcIiwgLy8gSWdHIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAyN0JcIjogXCIyNDU4LThcIiwgLy8gSWdBIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIxMjAzMUNcIjogXCIxOTExMy0wXCIsIC8vIElnRSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwNjlCXCI6IFwiNTEzMi02XCIsIC8vIENyeXB0b2NvY2N1cyBBZyBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwNzlDXCI6IFwiMjQxMDgtM1wiLCAvLyBDQSAxOS05IFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEJsb29kIHR5cGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTEwMDFDXCI6IFwiODgyLTFcIiwgLy8gXHU4ODQwXHU1NzhCXHU5NDUxXHU1QjlBIFx1MjAxNCBBQk8gKyBSaCBncm91cFxuICBcIjExMDAzQ1wiOiBcIjg4Mi0xXCIsIC8vIFx1ODg0MFx1NTc4Qlx1OTQ1MVx1NUI5QSBcdTIwMTQgQUJPICsgUmggZ3JvdXBcbiAgXCIxMTAwNENcIjogXCI4OTAtNFwiLCAvLyBcdTYyOTdcdTlBRDRcdTUzQ0RcdTYxQzkgXHUyMDE0IEFudGlib2R5IHNjcmVlblxuICAvLyBcdTI1MDBcdTI1MDAgTWljcm9iaW9sb2d5IGN1bHR1cmVzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxMzAwN0MgXHU3RDMwXHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAxNDIxOS0wIHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdIVExWIEkgcDI2IEFiIGluIFNlcnVtJyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gVGhlXG4gIC8vIHJpZ2h0IGZhbWlseSBpcyA2NDYzLTQgLyAxMTI2OC0wIChCYWN0ZXJpYSBpZGVudGlmaWVkIGJ5IGFlcm9iZVxuICAvLyBjdWx0dXJlKSBidXQgdGhlIHNvdXJjZSByb3cgZG9lc24ndCB0ZWxsIHVzIHNwZWNpbWVuIFx1MjAxNCBsZWF2aW5nXG4gIC8vIHVubWFwcGVkIHNvIHdlIGRvbid0IGxpZS4gRmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy5cbiAgXCIxMzAxM0NcIjogXCIzMTk1Mi01XCIsIC8vIFRCIEN1bHR1cmUgXHUyMDE0IE15Y29iYWN0ZXJpdW0gdHViZXJjdWxvc2lzIGN1bHR1cmVcbiAgXCIxMzAxNkJcIjogXCI2MDAtN1wiLCAvLyBCbG9vZCBDdWx0dXJlIFx1MjAxNCBCYWN0ZXJpYSBpZGVudGlmaWVkIGluIEJsb29kXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNDAwNEJcIjogXCI3ODQ5LTNcIiwgLy8gQ01WIElnRyBcdTIwMTQgQWIgUy9QXG4gIFwiMTQwNDhCXCI6IFwiNzg1MC0xXCIsIC8vIENNViBJZ00gXHUyMDE0IEFiIFMvUFxuICBcIjE0MDY2Q1wiOiBcIjgwMzgzLTNcIiwgLy8gSW5mbHVlbnphIEEgXHUyMDE0IEFnIFJlc3BpcmF0b3J5XG4gIFwiMTQwODRDXCI6IFwiOTQ1NTgtNFwiLCAvLyBTQVJTLUNvVi0yIEFnIFx1MjAxNCBSZXNwaXJhdG9yeVxuICBcIjEyMTg0Q1wiOiBcIjg4MTU3LTNcIiwgLy8gQ01WIEROQSBxdWFudCBQQ1IgXHUyMDE0IFBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgTXljb2JhY3Rlcml1bSAvIGFjaWQtZmFzdCAoYWRkZWQgYWZ0ZXIgYXVkaXQpIFx1MjUwMFxuICBcIjEzMDI1Q1wiOiBcIjI5MjYwLTdcIiwgLy8gXHU2Mjk3XHU5MTc4XHU2MDI3XHU2RkMzXHU3RTJFXHU2MkI5XHU3MjQ3XHU2N0QzXHU4MjcyXHU2QUEyXHU2N0U1IFx1MjAxNCBNeWNvYmFjdGVyaXVtIEFGQiBzdGFpblxuICBcIjEzMDI2Q1wiOiBcIjI5NTUzLTVcIiwgLy8gXHU2Mjk3XHU5MTc4XHU4M0NDXHU1N0Y5XHU5OTBBIFx1MjAxNCBNeWNvYmFjdGVyaXVtIGN1bHR1cmUgbGlxdWlkK3NvbGlkXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgcGFuZWwgKDA5MDQxQikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEludGVudGlvbmFsbHkgTk9UIG1hcHBlZCBoZXJlIFx1MjAxNCAwOTA0MUIgaXMgYSBwYW5lbCBvcmRlciB0aGF0XG4gIC8vIHVuZm9sZHMgaW50byBtYW55IGl0ZW1zIChwSCAvIHBDTzIgLyBwTzIgLyBIQ08zIC8gVENPMiAvIFNCRSAvXG4gIC8vIEFCRSAvIFNCQyAvIFNBVCkuIE1hcHBpbmcgdGhlIHBhbmVsIGNvZGUgdG8gXCJwSFwiIHdvdWxkIG1pcy1sYWJlbFxuICAvLyBldmVyeSBub24tcEggcm93IHRoYXQgc2hhcmVzIHRoaXMgTkhJIGNvZGUuIEVhY2ggaXRlbSBpc1xuICAvLyByZXNvbHZlZCB2aWEgX0xPSU5DX01BUCBkaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgYmVsb3c7IDA5MDQxQlxuICAvLyBhbHNvIGFwcGVhcnMgaW4gX0RJU1BMQVlfRklSU1RfQ09ERVMgc28gZGlzcGxheSBhbHdheXMgd2lucy5cbiAgLy8gXHUyNTAwXHUyNTAwIEJvZHkgZmx1aWQgLyBzeW5vdmlhbCBmbHVpZCBwYW5lbCAoMTYwMDhDIHVuZm9sZHM7IHRoZVxuICAvLyBtZW1iZXIgaXRlbXMgcmVseSBvbiBkaXNwbGF5IGtleXdvcmRzIGZvciBzcGVjaW1lbi1hd2FyZVxuICAvLyBMT0lOQ3MpLiBQYXJlbnQgY29kZSBtYXBzIHRvIHN5bm92aWFsIGZsdWlkIGFuYWx5c2lzIHBhbmVsLiBcdTI1MDBcdTI1MDBcbiAgLy8gMTYwMDhDIFx1NkVEMVx1NkRCMlx1NkFBMlx1NjdFNSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMzM5MDMtNiB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnS2V0b25lcyBbUHJlc2VuY2VdIGluIFVyaW5lJyAodmVyaWZpZWQgbG9pbmMub3JnKS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgdGhlIHBhbmVsIGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGluZyBvbmx5XG4gIC8vIGFuZCB0aGUgcGVyLWl0ZW0gZGlzcGxheXMgaW4gX0xPSU5DX01BUCBjYXJyeSB0aGVpciBvd24gTE9JTkNzXG4gIC8vIHdoZXJlIGtub3duLlxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9ESVNQTEFZX0ZJUlNUX0NPREVTIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIGNvZGVzIHRoYXQgYXJlICpwYW5lbHMqIFx1MjAxNCBvbmUgYmlsbGluZyBjb2RlLCBtYW55IGl0ZW0tc3BlY2lmaWNcbi8vIGRpc3BsYXlzLiBGb3IgdGhlc2UsIGRpc3BsYXkga2V5d29yZCBNVVNUIGJlIHRyaWVkIGZpcnN0IChzbyBcIldCQ1wiXG4vLyB1bmRlciBDQkMgcGFuZWwgMDgwMTFDIGdldHMgNjY5MC0yLCBub3QgdGhlIGdlbmVyaWMgcGFuZWwgTE9JTkMpLlxuLy8gRm9yIGV2ZXJ5dGhpbmcgZWxzZSAoc2luZ2xlLXRlc3QgY29kZXMgbGlrZSAwOTAwNUMgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2LFxuLy8gMDkwNDRDIExETCwgMTQwMzBDIEhCc0FnKSwgdGhlIE5ISSBjb2RlIGlzIG1vcmUgc3BlY2lmaWMgdGhhbiBhbnlcbi8vIGRpc3BsYXkga2V5d29yZCBhbmQgd2lucyBvdXRyaWdodC5cbi8vXG4vLyBERVNJR04gUEhJTE9TT1BIWTogdGhlIGJyaWRnZSBpcyBhICpmYWl0aGZ1bCB0cmFuc3BvcnQqIGxheWVyIFx1MjAxNCBpdFxuLy8gdHJ1c3RzIHRoZSBcdTUwNjVcdTRGREQgYmlsbGluZyBjb2RlIGFzIGF1dGhvcml0YXRpdmUgZm9yIGNsaW5pY2FsIGludGVudFxuLy8gKFx1OTY2Mlx1NjI0MCBiaWxsZWQgMDkwMDVDID0gdGhleSBvcmRlcmVkIGZhc3RpbmcgZ2x1Y29zZSwgcmVnYXJkbGVzcyBvZlxuLy8gd2hldGhlciB0aGUgb3BlcmF0aW9uYWwgc3BlY2ltZW4gd2FzIGEgZmluZ2VyLXN0aWNrKS4gRGlzcGxheS1zdHJpbmdcbi8vIHJlLWludGVycHJldGF0aW9uIG9mIGNsaW5pY2FsIGNvbnRleHQgKEdsdS1BQyB2cyBGSU5HRVIgU1VHQVIgdnNcbi8vIHJhbmRvbSkgaXMgbGVmdCB0byB0aGUgU01BUlQgYXBwLCB3aGljaCBoYXMgbW9yZSBVSSBjb250ZXh0LlxuZXhwb3J0IGNvbnN0IERJU1BMQVlfRklSU1RfQ09ERVM6IFJlYWRvbmx5U2V0PHN0cmluZz4gPSBuZXcgU2V0KFtcbiAgXCIwODAxMUNcIiwgLy8gQ0JDIHBhbmVsXG4gIFwiMDgwMTNDXCIsIC8vIENCQyB3LyBhdXRvIGRpZmYgcGFuZWxcbiAgXCIwNjAxM0NcIiwgLy8gVXJpbmFseXNpcyBtYWNyb3Njb3BpYyBwYW5lbFxuICBcIjA5MDQxQlwiLCAvLyBBQkcgcGFuZWxcbiAgXCIxNjAwOENcIiwgLy8gU3lub3ZpYWwgLyBib2R5LWZsdWlkIHBhbmVsXG5dKTtcblxuLy8gXHUyNTAwXHUyNTAwIF9QQU5FTF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBQYW5lbC1zcGVjaWZpYyBkaXNwbGF5IFx1MjE5MiBMT0lOQyBvdmVycmlkZXMuIFRoZXNlIHJ1biBCRUZPUkUgdGhlIGdsb2JhbFxuLy8gX0xPSU5DX01BUCBzbyB0aGF0IHVyaW5lIGJpbGlydWJpbiB1bmRlciAwNjAxM0MgbWFwcyB0byA1NzcwLTMgKHVyaW5lXG4vLyBzcGVjaW1lbikgaW5zdGVhZCBvZiBiZWluZyBzaGFkb3dlZCBieSB0aGUgZ2xvYmFsICdiaWxpcnViaW4nIHRoYXRcbi8vIHdvdWxkIGltcGx5IHNlcnVtLCBhbmQgYW5hbG9nb3VzIHNwZWNpbWVuLWF3YXJlIGRpc2FtYmlndWF0aW9uIGZvclxuLy8gb3RoZXIgcGFuZWwgc3ViLWl0ZW1zLiBLZXlzIGFyZSBOSEkgcGFuZWwgY29kZXMgKG11c3QgYWxzbyBiZSBpblxuLy8gX0RJU1BMQVlfRklSU1RfQ09ERVMpOyB2YWx1ZXMgYXJlIGRpc3BsYXkta2V5d29yZCBcdTIxOTIgTE9JTkMgZGljdHMgdGhhdFxuLy8gZm9sbG93IHRoZSBzYW1lIG1hdGNoaW5nIHNlbWFudGljcyBhcyBfTE9JTkNfTUFQIChsZWFkaW5nIHdvcmRcbi8vIGJvdW5kYXJ5IGZvciBBU0NJSSwgc3Vic3RyaW5nIGZvciBDSkspLlxuZXhwb3J0IGNvbnN0IFBBTkVMX0xPSU5DX01BUDogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBBbGwgcm91dGluZSBkaXBzdGljayBpdGVtcyByZXNpZGUgb24gYSBzaW5nbGUgTkhJIGJpbGxpbmcgY29kZS5cbiAgLy8gV2l0aG91dCB0aGlzIHRhYmxlIHRoZXknZCBhbGwgY29sbGFwc2UgdG8gdGhlIHBhbmVsIExPSU5DIDI0MzU2LTgsXG4gIC8vIGxvc2luZyBwZXItaXRlbSBncmFudWxhcml0eSB0aGF0J3MgY2xpbmljYWxseSB1c2VmdWwgKGUuZy5cbiAgLy8gYmlsaXJ1YmluIHZzIHVyb2JpbGlub2dlbiBmb3IgbGl2ZXIgd29ya3VwKS5cbiAgXCIwNjAxM0NcIjoge1xuICAgIC8vIE9yZGVyIG1hdHRlcnM6IGxvbmdlci9tb3JlLXNwZWNpZmljIGtleXMgYmVmb3JlIGdlbmVyaWMgb25lc1xuICAgIC8vIChtYXRjaGVzIF9MT0lOQ19NQVAgaXRlcmF0aW9uIHNlbWFudGljcyBcdTIwMTQgZmlyc3QgaGl0IHdpbnMpLlxuICAgIFwic3BlY2lmaWMgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLCAvLyBTcGVjaWZpYyBncmF2aXR5IFVyaW5lXG4gICAgXCJzcC5ncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXCJzcCBncmF2aXR5XCI6IFwiNTgxMS01XCIsXG4gICAgXHU2QkQ0XHU5MUNEOiBcIjU4MTEtNVwiLFxuICAgIFwibWljcm8tYWxidW1pblwiOiBcIjE0OTU3LTVcIiwgLy8gTWljcm9hbGJ1bWluIE1hc3Mvdm9sIFVyaW5lXG4gICAgbWljcm9hbGJ1bWluOiBcIjE0OTU3LTVcIixcbiAgICBcIm1hbGIodSlcIjogXCIxNDk1Ny01XCIsXG4gICAgbWFsYjogXCIxNDk1Ny01XCIsXG4gICAgXHU1RkFFXHU1QzBGXHU3NjdEXHU4NkNCXHU3NjdEOiBcIjE0OTU3LTVcIixcbiAgICB1YWNyOiBcIjE0OTU5LTFcIiwgLy8gTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgcmF0aW8gVXJpbmVcbiAgICBcInVyaW5lIGdsdWNvc2VcIjogXCI1NzkyLTdcIixcbiAgICBzdWdhcjogXCI1NzkyLTdcIiwgLy8gTkhJICdcdTVDM0ZcdTdDRDYnIC8gJ1N1Z2FyJyB1bmRlciAwNjAxM0NcbiAgICBcdTVDM0ZcdTdDRDY6IFwiNTc5Mi03XCIsXG4gICAgdXJvYmlsaW5vZ2VuOiBcIjU4MTgtMFwiLCAvLyBVcm9iaWxpbm9nZW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMjBcdTUzOUY6IFwiNTgxOC0wXCIsXG4gICAgYmlsaXJ1YmluOiBcIjU3NzAtM1wiLCAvLyBCaWxpcnViaW4gVXJpbmUgUWxcbiAgICBcdTVDM0ZcdTgxQkRcdTdEMDVcdTdEMjA6IFwiNTc3MC0zXCIsXG4gICAgbml0cml0ZTogXCI1ODAyLTRcIiwgLy8gTml0cml0ZSBVcmluZVxuICAgIFx1NEU5RVx1Nzg1RFx1OTE3ODogXCI1ODAyLTRcIixcbiAgICBrZXRvbmVzOiBcIjU3OTctNlwiLCAvLyBLZXRvbmVzIFVyaW5lXG4gICAga2V0b25lOiBcIjU3OTctNlwiLFxuICAgIFx1OTE2RVx1OUFENDogXCI1Nzk3LTZcIixcbiAgICBwcm90ZWluOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICAgIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgICBsZXVrb2N5dGU6IFwiNTc5OS0yXCIsIC8vIExldWtvY3l0ZXMgVXJpbmVcbiAgICBsZXU6IFwiNTc5OS0yXCIsXG4gICAgXHU3NjdEXHU4ODQwXHU3NDAzXHU5MTZGXHU5MTc2OiBcIjU3OTktMlwiLFxuICAgIGJsb29kOiBcIjU3OTQtM1wiLCAvLyBIZW1vZ2xvYmluIFVyaW5lIFFsXG4gICAgXHU2RjVCXHU4ODQwOiBcIjU3OTQtM1wiLFxuICAgIFx1ODI3MjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgVXJpbmUgKENKSyBzdWJzdHJpbmcpXG4gICAgY29sb3I6IFwiNTc3OC02XCIsXG4gICAgdHVyYmlkaXR5OiBcIjU3NjctOVwiLCAvLyBBcHBlYXJhbmNlIG9mIFVyaW5lXG4gICAgYXBwZWFyYW5jZTogXCI1NzY3LTlcIixcbiAgICBcdTU5MTZcdTg5QzA6IFwiNTc2Ny05XCIsXG4gICAgcGg6IFwiNTgwMy0yXCIsIC8vIHBIIG9mIFVyaW5lICh1cmluZS1zcGVjaWZpYywgTk9UXG4gICAgLy8gdGhlIGFydGVyaWFsIDExNTU4LTQgdGhhdCB0aGVcbiAgICAvLyBnbG9iYWwgbWFwIHBvaW50cyB0bylcbiAgICBcdTkxNzhcdTlFN0NcdTVFQTY6IFwiNTgwMy0yXCIsXG4gICAgZ2x1Y29zZTogXCI1NzkyLTdcIiwgLy8gTGFzdCBpbiB0aGlzIGJsb2NrIHNvICd1cmluZVxuICB9LFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19NQVAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDb21tb24gVGFpd2FuZXNlIEhJUyBsYWIgbmFtZXMgXHUyMTkyIExPSU5DIGNvZGUgbWFwcGluZ1xuZXhwb3J0IGNvbnN0IExPSU5DX01BUDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIERpc3BsYXkta2V5d29yZCBmYWxsYmFjayBvbmx5IGtpY2tzIGluIHdoZW4gTk8gTkhJIGNvZGUgaXNcbiAgLy8gcHJlc2VudCAoZGFzaGJvYXJkIHJvd3MsIExMTS1leHRyYWN0ZWQgdGV4dCkuIFdoZW4gdGhlIE5ISSBjb2RlXG4gIC8vIElTIHByZXNlbnQsIDA5MDA1QyBcdTIxOTIgMTU1OC02IChGYXN0aW5nKSBhbmQgMDkxNDBDIFx1MjE5MiAyMzQ1LTdcbiAgLy8gKGdlbmVyaWMpIHdpbnMgZGlyZWN0bHkgdmlhIF9OSElfVE9fTE9JTkMuXG4gIC8vXG4gIC8vIEZhaXRoZnVsLXRyYW5zcG9ydCBwcmluY2lwbGU6IHRoZSBicmlkZ2UgZG9lcyBOT1QgcmUtaW50ZXJwcmV0XG4gIC8vIGRpc3BsYXkgc3RyaW5ncyBsaWtlIFwiRklOR0VSIFNVR0FSXCIgYXMgYSBkaWZmZXJlbnQgTE9JTkMgXHUyMDE0IGl0XG4gIC8vIHByZXNlcnZlcyB0aGUgcmF3IGRpc3BsYXkgaW4gYGNvZGUudGV4dGAgYW5kIHRoZSBvcmlnaW5hbCBOSElcbiAgLy8gY29kZSBpbiBgY29kZS5jb2RpbmdgLiBUaGUgU01BUlQgYXBwIGRvZXMgc3BlY2ltZW4vbWV0aG9kLWF3YXJlXG4gIC8vIGdyb3VwaW5nIG9uIHRoZSBjb25zdW1lciBzaWRlIChzZWUgU01BUlQgYXBwIGhhbmRvZmYgZG9jKS5cbiAgXCJmYXN0aW5nIGdsdWNvc2VcIjogXCIxNTU4LTZcIixcbiAgXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2OiBcIjE1NTgtNlwiLFxuICBcImdsdS1hY1wiOiBcIjE1NTgtNlwiLFxuICBcImdsdWNvc2UgYWNcIjogXCIxNTU4LTZcIixcbiAgZ2x1Y29zZTogXCIyMzQ1LTdcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIjIzNDUtN1wiLFxuICBnbHU6IFwiMjM0NS03XCIsXG4gIC8vIEhiQTFjIE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljIFwiaGJcIiBlbnRyaWVzIHNvIHRoZSBsb25nZXN0LXByZWZpeFxuICAvLyBtYXRjaCB3aW5zIGZvciB0aGUgXCJIYkExY1wiIGRpc3BsYXkgc3RyaW5nLiBPdGhlciBBMWMgc3lub255bXNcdTIwMjZcbiAgaGJhMWM6IFwiNDU0OC00XCIsXG4gIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCI0NTQ4LTRcIixcbiAgYTFjOiBcIjQ1NDgtNFwiLFxuICBoZW1vZ2xvYmluOiBcIjcxOC03XCIsXG4gIFx1ODg0MFx1N0QwNVx1N0QyMDogXCI3MTgtN1wiLFxuICBoZ2I6IFwiNzE4LTdcIixcbiAgaGI6IFwiNzE4LTdcIixcbiAgLy8gQ0JDIGRpZmYgXHUyMDE0IGVvc2lub3BoaWwgY291bnQgbXVzdCBwcmVjZWRlIHRoZSBiYXJlICd3YmMnLydcdTc2N0RcdTg4NDBcdTc0MDMnXG4gIC8vIGtleXMgKHdoaWNoIHdvdWxkIG90aGVyd2lzZSB3aW4gYXMgc3Vic3RyaW5ncykuXG4gIC8vIDcxMS0yIHZlcmlmaWVkIGF0IGxvaW5jLm9yZzogJ0Vvc2lub3BoaWxzIFsjL3ZvbHVtZV0gaW4gQmxvb2RcbiAgLy8gYnkgQXV0b21hdGVkIGNvdW50Jy5cbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIjcxMS0yXCIsXG4gIFx1NTVEQ1x1NEYwQVx1N0QwNVx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsOiBcIjcxMS0yXCIsXG4gIGVvc2lub3BoaWxzOiBcIjcxMS0yXCIsXG4gIHdiYzogXCI2NjkwLTJcIixcbiAgXHU3NjdEXHU4ODQwXHU3NDAzOiBcIjY2OTAtMlwiLFxuICBwbGF0ZWxldDogXCI3NzctM1wiLFxuICBcdTg4NDBcdTVDMEZcdTY3N0Y6IFwiNzc3LTNcIixcbiAgcGx0OiBcIjc3Ny0zXCIsXG4gIC8vIFJCQyArIFJCQyBpbmRpY2VzIFx1MjAxNCB2ZXJpZmllZCBMT0lOQ3MgKGxvaW5jLm9yZyk6XG4gIC8vIDc4OS04ICBFcnl0aHJvY3l0ZXMgIy92b2wgQmxvb2QgQXV0byAgICAgICAgICAgICAgXHUyMTkyIFJCQ1xuICAvLyA3ODUtNiAgRXJ5dGhyb2N5dGUgbWVhbiBjb3JwdXNjdWxhciBoZW1vZ2xvYmluICAgIFx1MjE5MiBNQ0hcbiAgLy8gTG9uZyBDSksgZm9ybXMgZmlyc3QgKExETC9jaG9sZXN0ZXJvbCBwYXR0ZXJuKSBzbyAnXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXG4gIC8vIFx1ODg0MFx1ODI3Mlx1N0QyMCcgd2lucyBvdmVyIFx1N0QwNVx1ODg0MFx1NzQwMy5cbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIjc4NS02XCIsXG4gIHJiYzogXCI3ODktOFwiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDM6IFwiNzg5LThcIixcbiAgbWNoOiBcIjc4NS02XCIsXG4gIC8vIFVyaW5lIGNyZWF0aW5pbmUgXHUyMDE0IE1VU1QgYXBwZWFyIGJlZm9yZSBnZW5lcmljICdjcmVhdGluaW5lJyBzb1xuICAvLyByb3dzIGxpa2UgJ1UtQ1JFIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MCcgb3IgJ0NyZWF0aW5pbmUoVSknIHJlc29sdmUgdG8gdGhlXG4gIC8vIHVyaW5lIExPSU5DICgyMTYxLTgpIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIHNlcnVtXG4gIC8vIGRlZmF1bHQgKDIxNjAtMCkuIFNhbWUgbG9uZ2VzdC1zcGVjaWZpYy1maXJzdCBvcmRlcmluZyBhc1xuICAvLyB0aGUgZmFzdGluZy12cy1yYW5kb20gZ2x1Y29zZSBibG9jay5cbiAgXCJ1cmluZSBjcmVhdGluaW5lXCI6IFwiMjE2MS04XCIsXG4gIFwiY3JlYXRpbmluZSB1cmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUodSlcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZVwiOiBcIjIxNjEtOFwiLFxuICBcInUtY3JlYVwiOiBcIjIxNjEtOFwiLFxuICBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MS04XCIsXG4gIGNyZWF0aW5pbmU6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE3OFx1OTE1MDogXCIyMTYwLTBcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIjIxNjAtMFwiLCAvLyBUYWl3YW4gdmFyaWFudCBzcGVsbGluZ1xuICBjcmVhOiBcIjIxNjAtMFwiLFxuICBidW46IFwiMzA5NC0wXCIsXG4gIFx1NUMzRlx1N0QyMFx1NkMyRTogXCIzMDk0LTBcIixcbiAgYXN0OiBcIjE5MjAtOFwiLFxuICBhbHQ6IFwiMTc0Mi02XCIsXG4gIGZlcnJpdGluOiBcIjIyNzYtNFwiLFxuICBcdTg4NDBcdTZFMDVcdTk0MzVcdTg2Q0JcdTc2N0Q6IFwiMjI3Ni00XCIsXG4gIGZlcnI6IFwiMjI3Ni00XCIsXG4gIC8vIFZpdGFsLXNpZ25zIGZyb20gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1IChJSEtFMzQwMikgXHUyMDE0IHNlcGFyYXRlIGNvZGUgbmFtZXNwYWNlXG4gIC8vIGJ1dCB0aGUgbG9va3VwIGlzIGJ5IGRpc3BsYXktbmFtZSBzdWJzdHJpbmcsIHNhbWUgYXMgZm9yIGxhYnMuXG4gIFwiYm9keSBoZWlnaHRcIjogXCI4MzAyLTJcIixcbiAgXCJib2R5IHdlaWdodFwiOiBcIjI5NDYzLTdcIixcbiAgYm1pOiBcIjM5MTU2LTVcIixcbiAgLy8gV2Fpc3QgY2lyY3VtZmVyZW5jZSBcdTIwMTQgbWVhc3VyZW1lbnQgTE9JTkMgKDgyODAtMCkuIDU2MDg2LTIgaXNcbiAgLy8gdGhlICdBZHVsdCBXYWlzdCBDaXJjdW1mZXJlbmNlIFByb3RvY29sJyBjb2RlLCB3aGljaCBpcyBhXG4gIC8vIHN1cnZleS9wcm90b2NvbCBkZXNjcmlwdG9yLCBOT1QgYSBudW1lcmljIG1lYXN1cmVtZW50XG4gIC8vICh2ZXJpZmllZCBhdCBsb2luYy5vcmcpLiBOSEkgXHU1MDY1XHU0RkREIHJlcG9ydHMgYSBzaW5nbGUgd2Fpc3RsaW5lXG4gIC8vIG51bWJlciBwZXIgdmlzaXQsIHNvIHRoZSBtZWFzdXJlbWVudCBjb2RlIGlzIGNvcnJlY3QuXG4gIFwid2Fpc3QgY2lyY3VtZmVyZW5jZVwiOiBcIjgyODAtMFwiLFxuICBcInN5c3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ4MC02XCIsXG4gIFwiZGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCI6IFwiODQ2Mi00XCIsXG4gIC8vIExpcGlkIHBhbmVsIFx1MjAxNCBPUkRFUiBNQVRURVJTLiBMREwvSERMIHZhcmlhbnRzIE1VU1QgcHJlY2VkZSB0aGVcbiAgLy8gZ2VuZXJpYyAnY2hvbGVzdGVyb2wnIGtleSBzbyBhIHJvdyBsYWJlbGxlZCAnTERMIENIT0xFU1RFUk9MJ1xuICAvLyByZXNvbHZlcyB0byAxMzQ1Ny03IChMREwgY2FsY3VsYXRlZCkgYW5kICdIREwgQ0hPTEVTVEVST0wnIHRvXG4gIC8vIDIwODUtOSwgaW5zdGVhZCBvZiBmYWxsaW5nIHRvIDIwOTMtMyAodG90YWwgY2hvbGVzdGVyb2wpIHZpYSB0aGVcbiAgLy8gJ2Nob2xlc3Rlcm9sJyBzdWJzdHJpbmcuIFNhbWUgY2Fub25pY2FsIG9yZGVyaW5nIGFzIF9MQUJfU1lOT05ZTVMuXG4gIFwibGRsIGNob2xlc3Rlcm9sXCI6IFwiMTM0NTctN1wiLFxuICBcImxkbC1jaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjEzNDU3LTdcIixcbiAgLy8gMTM0NTctNyA9IExETCBjaG9sZXN0ZXJvbCAoY2FsY3VsYXRlZCkgXHUyMDE0IG1hdGNoZXMgdGhlIE5ISSAwOTA0NENcbiAgLy8gYmlsbGluZyBjb2RlJ3MgaW50ZW50IChUYWl3YW4gbGFicyBwcmVkb21pbmFudGx5IHJlcG9ydCBjYWxjdWxhdGVkXG4gIC8vIExETCB2aWEgRnJpZWRld2FsZCkuIEtlZXAgY29uc2lzdGVudCB3aXRoIF9OSElfVE9fTE9JTkNbXCIwOTA0NENcIl0uXG4gIFwibGRsLWNcIjogXCIxMzQ1Ny03XCIsXG4gIGxkbDogXCIxMzQ1Ny03XCIsXG4gIFwiaGRsIGNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFwiaGRsLWNob2xlc3Rlcm9sXCI6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwODUtOVwiLFxuICBcImhkbC1jXCI6IFwiMjA4NS05XCIsXG4gIGhkbDogXCIyMDg1LTlcIixcbiAgLy8gVG90YWwgY2hvbGVzdGVyb2wgXHUyMDE0IGJhcmUgJ2Nob2xlc3Rlcm9sJyBvbmx5IGZpcmVzIEFGVEVSIHRoZVxuICAvLyBMREwvSERMLXByZWZpeGVkIHZhcmlhbnRzIGFib3ZlIGhhdmUgYmVlbiBjaGVja2VkLlxuICBcInRvdGFsIGNob2xlc3Rlcm9sXCI6IFwiMjA5My0zXCIsXG4gIFwidC1jaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIFx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDkzLTNcIixcbiAgY2hvbGVzdGVyb2w6IFwiMjA5My0zXCIsXG4gIHRyaWdseWNlcmlkZTogXCIyNTcxLThcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIjI1NzEtOFwiLFxuICBcInVyaWMgYWNpZFwiOiBcIjMwODQtMVwiLFxuICBlZ2ZyOiBcIjMzOTE0LTNcIixcbiAgaGJzYWc6IFwiNTE5Ni0xXCIsXG4gIFwiYW50aS1oY3ZcIjogXCIxNjEyOC0xXCIsXG4gIC8vIFVyaW5lIHByb3RlaW4gKGRpc3BsYXkgZmFsbGJhY2sgZm9yIHRoZSBuby1OSEktY29kZSBwYXRoIHRoYXRcbiAgLy8gY29tZXMgZnJvbSBJSEtFMzQwMiB2aXRhbHMgKyBhZHVsdC1wcmV2ZW50aXZlIHN1cHBsZW1lbnRzKS5cbiAgXCJ1cmluZSBwcm90ZWluXCI6IFwiMjA0NTQtNVwiLCAvLyBQcm90ZWluIE1hc3Mvdm9sIFVyaW5lXG4gIFwidS1wcm9cIjogXCIyMDQ1NC01XCIsXG4gIFx1NUMzRlx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gIC8vIEFCRyBwYW5lbCBjb21wb25lbnRzIFx1MjAxNCAwOTA0MUIgcGFyZW50IGNvZGUgaW4gTkhJX1RPX0xPSU5DOyBlYWNoXG4gIC8vIG1lbWJlcidzIGRpc3BsYXkgKFwicENPMlwiLCBcInBPMlwiLCBcIkhDTzNcIiwgXCJUQ08yXCIsIFwiU0JFL0FCRVwiLFxuICAvLyBcIlNCQ1wiLCBcIlNBVFwiIC8gXCJTYU8yXCIpIGZhbGxzIHRvIGl0cyBvd24gTE9JTkMuXG4gIC8vIHBIIE1VU1QgY29tZSBiZWZvcmUgcGNvMi9wbzIgc28gdGhlIGJhcmUgXCJwSFwiIGRpc3BsYXkgbGFuZHMgaGVyZS5cbiAgcGg6IFwiMTE1NTgtNFwiLCAvLyBwSCBvZiBBcnRlcmlhbCBibG9vZFxuICBwY28yOiBcIjIwMTktOFwiLCAvLyBDYXJib24gZGlveGlkZSBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBwbzI6IFwiMjcwMy03XCIsIC8vIE94eWdlbiBwcCBpbiBBcnRlcmlhbCBibG9vZFxuICBoY28zOiBcIjE5NTktNlwiLCAvLyBCaWNhcmJvbmF0ZSBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgYmljYXJib25hdGU6IFwiMTk1OS02XCIsXG4gIHRjbzI6IFwiMjAyOC05XCIsIC8vIFRvdGFsIENPMiBNb2xlcy92b2wgQXJ0ZXJpYWxcbiAgc2JlOiBcIjExNTU1LTBcIiwgLy8gU3RhbmRhcmQgYmFzZSBleGNlc3MgQXJ0ZXJpYWxcbiAgYWJlOiBcIjExNTU1LTBcIixcbiAgc2JjOiBcIjE5MjUtN1wiLCAvLyBTdGFuZGFyZCBiaWNhcmJvbmF0ZSBBcnRlcmlhbFxuICBzYXR1cmF0OiBcIjI3MTMtNlwiLCAvLyBPMiBzYXR1cmF0aW9uIEFydGVyaWFsXG4gIHNhbzI6IFwiMjcxMy02XCIsXG4gIHNhdDogXCIyNzEzLTZcIiwgLy8gTkhJIGRpc3BsYXkgc2hvd3MganVzdCBcIlNBVFwiXG4gIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBjb21wb25lbnRzICgxNjAwOEMgcGFyZW50IGFib3ZlKS5cbiAgXCJzZi5jb2xvclwiOiBcIjU3NzgtNlwiLCAvLyBDb2xvciBvZiBCb2R5IGZsdWlkIChyZXVzZSBVcmluZSBjb2xvciBzcGVjIE9LKVxuICAvLyBOT1RFOiA4MjU1LTIgLyAxMzk0OC01IHByZXZpb3VzbHkgbGlzdGVkIGhlcmUgYm90aCB0dXJuZWQgb3V0XG4gIC8vIHRvIGJlIHVucmVsYXRlZCBMT0lOQ3MgKHZlcmlmaWVkIGxvaW5jLm9yZyBcdTIwMTQgODI1NS0yIGlzXG4gIC8vICdTZXJ2aWNlIGNvbW1lbnQgMTMnLCAxMzk0OC01IGlzICdDb2NjaWRpb2lkZXMgaW1taXRpcyBJZ01cbiAgLy8gQWInKS4gQm9keS1mbHVpZCBBcHBlYXJhbmNlIC8gUkJDIGRvbid0IGhhdmUgd2VsbC1hdHRlc3RlZFxuICAvLyBMT0lOQ3MgaW4gb3VyIHRhYmxlIHlldCBcdTIwMTQgZmFsbGluZyB0aHJvdWdoIHRvIGNvZGUudGV4dC1vbmx5XG4gIC8vIGlzIHNhZmVyIHRoYW4gZW1pdHRpbmcgYSBtaXNsZWFkaW5nIExPSU5DLiBUbyBhZGQgbGF0ZXIsXG4gIC8vIHZlcmlmeSBlYWNoIGFnYWluc3QgbG9pbmMub3JnIGZpcnN0LlxuICBcInNmLndiY1wiOiBcIjI2NDY2LTNcIiwgLy8gV0JDICMvdm9sIEJvZHkgZmx1aWRcbiAgXCJzZi5uZXV0cm9waGlsXCI6IFwiMTAzMjgtNlwiLCAvLyBOZXV0cm9waGlscy8xMDAgbGV1a29jeXRlcyBpbiBCb2R5IGZsdWlkXG4gIFwic2YubHltcGhvXCI6IFwiMTMwNDYtOFwiLCAvLyBMeW1waG9jeXRlcyAjL3ZvbCBCb2R5IGZsdWlkXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0xPSU5DX0RJU1BMQVkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDYW5vbmljYWwgRW5nbGlzaCBkaXNwbGF5IG5hbWVzIGZvciBMT0lOQyBjb2RlcyB0aGUgYnJpZGdlIGVtaXRzLlxuLy8gRmFsbHMgYmFjayB0byB0aGUgcmF3IGlucHV0IGRpc3BsYXkgd2hlbiBhIExPSU5DIGlzbid0IGxpc3RlZCBoZXJlLlxuLy8gU291cmNlZCBmcm9tIGxvaW5jLm9yZyBjYW5vbmljYWwgc2hvcnQgbmFtZXMgd2hlcmUgYXBwbGljYWJsZS5cbi8vIEFkZCBuZXcgZW50cmllcyBhcyB3ZSB3aWRlbiBMT0lOQyBjb3ZlcmFnZSBcdTIwMTQgdGhlIGxvb2t1cCBpcyBrZXllZCBvblxuLy8gTE9JTkMgc3RyaW5nLCBzbyB1bm1hcHBlZCBMT0lOQ3MgZGVncmFkZSBncmFjZWZ1bGx5IHRvIHRoZSBOSEkgdGV4dC5cbmV4cG9ydCBjb25zdCBMT0lOQ19ESVNQTEFZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIE1vc3QgY3JpdGljYWwgYmxvY2sgXHUyMDE0IE5ISSdzIFwiQ29sb3IgXHU1QzNGIFx1OTg0RiAgLi4uXCIgc3R5bGUgbGFiZWxzIGFyZVxuICAvLyB3aGF0IHRyaWdnZXJzIGRvd25zdHJlYW0gQ2hpbmVzZS1zdWJzdHJpbmcgbGFiZWxsaW5nIGJ1Z3MuXG4gIFwiNTgwMy0yXCI6IFwicEggb2YgVXJpbmVcIixcbiAgXCI1ODExLTVcIjogXCJTcGVjaWZpYyBncmF2aXR5IG9mIFVyaW5lXCIsXG4gIFwiNTc3MC0zXCI6IFwiQmlsaXJ1YmluIFVyaW5lIFFsXCIsXG4gIFwiNTgwMi00XCI6IFwiTml0cml0ZSBVcmluZSBRbFwiLFxuICBcIjU3NzgtNlwiOiBcIkNvbG9yIG9mIFVyaW5lXCIsXG4gIFwiNTc2Ny05XCI6IFwiQXBwZWFyYW5jZSBvZiBVcmluZVwiLFxuICBcIjU4MTgtMFwiOiBcIlVyb2JpbGlub2dlbiBVcmluZSBRbFwiLFxuICBcIjIwNDU0LTVcIjogXCJQcm90ZWluIE1hc3MvVm9sIGluIFVyaW5lXCIsXG4gIFwiMTQ5NTctNVwiOiBcIk1pY3JvYWxidW1pbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU5LTFcIjogXCJNaWNyb2FsYnVtaW4vQ3JlYXRpbmluZSBSYXRpbyBpbiBVcmluZVwiLFxuICBcIjU3OTItN1wiOiBcIkdsdWNvc2UgVXJpbmUgUWxcIixcbiAgXCI1Nzk3LTZcIjogXCJLZXRvbmVzIFVyaW5lIFFsXCIsXG4gIFwiNTc5NC0zXCI6IFwiSGVtb2dsb2JpbiBVcmluZSBRbFwiLFxuICBcIjU3OTktMlwiOiBcIkxldWtvY3l0ZXMgVXJpbmUgUWxcIixcbiAgXCIyNDM1Ni04XCI6IFwiVXJpbmFseXNpcyBNYWNybyBQYW5lbFwiLFxuICAvLyBBTEwgZW50cmllcyBiZWxvdyB1c2UgdGhlIExPSU5DIGNhbm9uaWNhbCAnTG9uZyBDb21tb24gTmFtZSdcbiAgLy8gYXMgYWNjZXB0ZWQgYnkgdGhlIFRXTkhJRkhJUiB2YWxpZGF0b3IuIFNvdXJjZTogbG9pbmMub3JnIGZvclxuICAvLyBlYWNoIGNvZGUsIGNyb3NzLWNoZWNrZWQgYWdhaW5zdCB0aGUgdmFsaWRhdG9yJ3MgcmVwb3J0ZWRcbiAgLy8gJ1ZhbGlkIGRpc3BsYXkgaXMgb25lIG9mIE4gY2hvaWNlcycgZm9yIGRpc3BsYXlzIHdlIHByZXZpb3VzbHlcbiAgLy8gZ290IHdyb25nICg0NSBMT0lOQ3MgZm91bmQgaW4gdGhlIFAzMzMzMzMzMzMgdmFsaWRhdGlvbiBydW4pLlxuICAvLyBXaGVuIHVwZGF0aW5nLCBjb3B5IHRoZSBleGFjdCBlbi1VUyBsb25nIG5hbWUgZnJvbSBsb2luYy5vcmcgXHUyMDE0XG4gIC8vIHRoZSB2YWxpZGF0b3IgaXMgc2Vuc2l0aXZlIHRvIHNwZWxsaW5nIC8gcHVuY3R1YXRpb24uXG4gIC8vXG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MgcGFuZWwgc3ViLWl0ZW1zKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gXHUyNTAwXHUyNTAwIEFCRyAoMDkwNDFCIHBhbmVsKSBcdTIwMTQgbm90IGluIHZhbGlkYXRvciBvdXRwdXQ7IGxvaW5jLm9yZyBzb3VyY2VkXG4gIFwiMTE1NTgtNFwiOiBcInBIIG9mIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAxOS04XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW1BhcnRpYWwgcHJlc3N1cmVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjcwMy03XCI6IFwiT3h5Z2VuIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjE5NTktNlwiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMjAyOC05XCI6IFwiQ2FyYm9uIGRpb3hpZGUgW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTE1NTUtMFwiOiBcIkJhc2UgZXhjZXNzIGluIEFydGVyaWFsIGJsb29kIGJ5IGNhbGN1bGF0aW9uXCIsXG4gIFwiMTkyNS03XCI6IFwiQmljYXJib25hdGUgW01vbGVzL3ZvbHVtZV0gaW4gQXJ0ZXJpYWwgYmxvb2QgLS1zdGFuZGFyZFwiLFxuICBcIjI3MTMtNlwiOiBcIk94eWdlbiBzYXR1cmF0aW9uIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE1NTgtNlwiOiBcIkZhc3RpbmcgZ2x1Y29zZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIzNDUtN1wiOiBcIkdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNzE4LTdcIjogXCJIZW1vZ2xvYmluIFtNYXNzL3ZvbHVtZV0gaW4gQmxvb2RcIixcbiAgXCI0NTQ4LTRcIjogXCJIZW1vZ2xvYmluIEExYy9IZW1vZ2xvYmluLnRvdGFsIGluIEJsb29kXCIsXG4gIFwiNjY5MC0yXCI6IFwiTGV1a29jeXRlcyBbLCAgLy8gL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzc3LTNcIjogXCJQbGF0ZWxldHMgWywgIC8vIC92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc4OS04XCI6IFwiRXJ5dGhyb2N5dGVzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3ODUtNlwiOiBcIk1DSCBbRW50aXRpYyBtYXNzXSBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3MTEtMlwiOiBcIkVvc2lub3BoaWxzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI0NTQ0LTNcIjogXCJIZW1hdG9jcml0IFtWb2x1bWUgRnJhY3Rpb25dIG9mIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjU3MDIxLThcIjogXCJDQkMgVyBBdXRvIERpZmZlcmVudGlhbCBwYW5lbCAtIEJsb29kXCIsXG4gIFwiMjQzMTctMFwiOiBcIkhlbW9ncmFtIGFuZCBwbGF0ZWxldHMgV08gZGlmZmVyZW50aWFsIHBhbmVsIC0gQmxvb2RcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENoZW1pc3RyeSAvIGxpdmVyIC8gcmVuYWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTkyMC04XCI6IFwiQXNwYXJ0YXRlIGFtaW5vdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3NDItNlwiOiBcIkFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjE2MC0wXCI6IFwiQ3JlYXRpbmluZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIxNjEtOFwiOiBcIkNyZWF0aW5pbmUgW01hc3Mvdm9sdW1lXSBpbiBVcmluZVwiLFxuICBcIjMzOTE0LTNcIjpcbiAgICBcIkdsb21lcnVsYXIgZmlsdHJhdGlvbiByYXRlIFtWb2x1bWUgUmF0ZS9BcmVhXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgQ3JlYXRpbmluZS1iYXNlZCBmb3JtdWxhIChNRFJEKS8xLjczIHNxIE1cIixcbiAgXCIzMDk0LTBcIjogXCJVcmVhIG5pdHJvZ2VuIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzA4NC0xXCI6IFwiVXJhdGUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyOTUxLTJcIjogXCJTb2RpdW0gW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjgyMy0zXCI6IFwiUG90YXNzaXVtIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5NzUtMlwiOiBcIkJpbGlydWJpbi50b3RhbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5NjgtN1wiOiBcIkJpbGlydWJpbi5kaXJlY3QgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzUxLTdcIjogXCJBbGJ1bWluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjUzMi0wXCI6IFwiTGFjdGF0ZSBkZWh5ZHJvZ2VuYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCI2NzY4LTZcIjogXCJBbGthbGluZSBwaG9zcGhhdGFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjMyNC0yXCI6IFwiR2FtbWEgZ2x1dGFteWwgdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3ODYxLTZcIjogXCJDYWxjaXVtIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXBpZCBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIyMDkzLTNcIjogXCJDaG9sZXN0ZXJvbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI1NzEtOFwiOiBcIlRyaWdseWNlcmlkZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIwODUtOVwiOiBcIkNob2xlc3Rlcm9sIGluIEhETCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjEzNDU3LTdcIjogXCJDaG9sZXN0ZXJvbCBpbiBMREwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgY2FsY3VsYXRpb25cIixcbiAgLy8gXHUyNTAwXHUyNTAwIFRoeXJvaWQgLyBob3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIzMDE2LTNcIjogXCJUaHlyb3Ryb3BpbiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMDI0LTdcIjogXCJUaHlyb3hpbmUgKFQ0KSBmcmVlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjk4Ni04XCI6IFwiVGVzdG9zdGVyb25lIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiODMwOTgtNFwiOiBcIkZvbGxpdHJvcGluIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICBcIjgzMDk2LThcIjogXCJFc3RyYWRpb2wgKEUyKSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZGlhYyAvIGluZmxhbW1hdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMDgzOS05XCI6IFwiVHJvcG9uaW4gSS5jYXJkaWFjIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzM3NjItNlwiOiBcIk5hdHJpdXJldGljIHBlcHRpZGUuQiBwcm9ob3Jtb25lIE4tVGVybWluYWwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTg4LTVcIjogXCJDIHJlYWN0aXZlIHByb3RlaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMzk1OS04XCI6IFwiUHJvY2FsY2l0b25pbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgSGVwYXRpdGlzIC8gc2Vyb2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNTE5NS0zXCI6IFwiSGVwYXRpdGlzIEIgdmlydXMgc3VyZmFjZSBBZyBbUHJlc2VuY2VdIGluIFNlcnVtXCIsXG4gIFwiNTE5Ni0xXCI6IFwiSGVwYXRpdGlzIEIgdmlydXMgc3VyZmFjZSBBZyBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bVwiLFxuICBcIjE2MTI4LTFcIjogXCJIZXBhdGl0aXMgQyB2aXJ1cyBBYiBbUHJlc2VuY2VdIGluIFNlcnVtXCIsXG4gIFwiMTM5NTUtMFwiOiBcIkhlcGF0aXRpcyBDIHZpcnVzIEFiIFtQcmVzZW5jZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDb2FndWxhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI2MzAxLTZcIjogXCJJTlIgaW4gUGxhdGVsZXQgcG9vciBwbGFzbWEgYnkgQ29hZ3VsYXRpb24gYXNzYXlcIixcbiAgXCIxNDk3OS05XCI6IFwiYVBUVCBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYSBieSBDb2FndWxhdGlvbiBhc3NheVwiLFxuICBcIjMwMjQwLTZcIjogXCJGaWJyaW4gRC1kaW1lciBbTWFzcy92b2x1bWVdIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXRhbCBzaWducyAoSUhLRTM0MDIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjgzMDItMlwiOiBcIkJvZHkgaGVpZ2h0XCIsXG4gIFwiMjk0NjMtN1wiOiBcIkJvZHkgd2VpZ2h0XCIsXG4gIFwiMzkxNTYtNVwiOiBcIkJvZHkgbWFzcyBpbmRleCAoQk1JKSBbUmF0aW9dXCIsXG4gIFwiODI4MC0wXCI6IFwiV2Fpc3QgQ2lyY3VtZmVyZW5jZSBhdCB1bWJpbGljdXMgYnkgVGFwZSBtZWFzdXJlXCIsXG4gIFwiODQ4MC02XCI6IFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NDYyLTRcIjogXCJEaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIixcbiAgXCI4NTM1NC05XCI6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWwgd2l0aCBhbGwgY2hpbGRyZW4gb3B0aW9uYWxcIixcbn07XG4iLCAiLyoqXG4gKiBQdXJlIHBhcnNpbmcgaGVscGVycyBcdTIwMTQgcmVmZXJlbmNlIHJhbmdlLCBxdWFudGl0eSwgVUNVTSB1bml0IG5vcm1hbGlzYXRpb24uXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19wYXJzZXJzLnB5YC4gU2VsZi1jb250YWluZWQ6IG5vIGRlcGVuZGVuY2llc1xuICogb24gb3RoZXIgb2JzZXJ2YXRpb24gbW9kdWxlIHBpZWNlcy5cbiAqXG4gKiBQdWJsaWMgQVBJOlxuICogICB0b1VjdW0odW5pdCkgICAgICAgICAgICAgICAgICBcdTIxOTIgY2Fub25pY2FsIFVDVU0gdW5pdCBzdHJpbmcgKG9yIG51bGwpXG4gKiAgIHBhcnNlUmFuZ2VNdWx0aShyYXcsIHVuaXQpICAgIFx1MjE5MiBsaXN0IG9mIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cmllc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvbmUgcGVyIHNleCB3aGVuIHNleC1zdHJhdGlmaWVkKVxuICogICBwYXJzZVJhbmdlKHJhdywgdW5pdCkgICAgICAgICBcdTIxOTIgc2luZ2xlIHJlZmVyZW5jZVJhbmdlIGVudHJ5XG4gKiAgIHRyeVBhcnNlUXVhbnRpdHkocmF3LCB1bml0KSAgIFx1MjE5MiBGSElSIFF1YW50aXR5IGRpY3Qgb3IgbnVsbFxuICovXG5cbmNvbnN0IFVDVU1fU1lTVEVNID0gXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCI7XG5cbi8vIEZISVIgUjQgUXVhbnRpdHkuY29tcGFyYXRvciBhbGxvd2VkIHZhbHVlcy4gTm9ybWFsaXNlIGZ1bGwtd2lkdGggQ0pLXG4vLyBcdUZGMUUgXHVGRjFDIFx1MjI2NyBcdTIyNjYgKyBBU0NJSSB2YXJpYW50cyBzbyBcIlx1RkYxRSA0MC4wXCIgc3RpbGwgcGFyc2VzIGFzIGEgcmVhbCBudW1iZXJcbi8vIGluc3RlYWQgb2YgZmFsbGluZyB0aHJvdWdoIHRvIHZhbHVlU3RyaW5nICh3aGljaCBsb3NlcyB0aGUgdW5pdCkuXG5jb25zdCBGVUxMV0lEVEhfT1BTOiBSZWFkb25seUFycmF5PFtzdHJpbmcsIHN0cmluZ10+ID0gW1xuICBbXCJcdUZGMUVcIiwgXCI+XCJdLFxuICBbXCJcdUZGMUNcIiwgXCI8XCJdLFxuICBbXCJcdTIyNjdcIiwgXCI+PVwiXSxcbiAgW1wiXHUyMjY2XCIsIFwiPD1cIl0sXG4gIFtcIlx1MjI2NVwiLCBcIj49XCJdLFxuICBbXCJcdTIyNjRcIiwgXCI8PVwiXSxcbl07XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZUZ1bGx3aWR0aChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgb3V0ID0gcztcbiAgZm9yIChjb25zdCBbZnJvbSwgdG9dIG9mIEZVTExXSURUSF9PUFMpIHtcbiAgICBpZiAob3V0LmluY2x1ZGVzKGZyb20pKSB7XG4gICAgICBvdXQgPSBvdXQuc3BsaXQoZnJvbSkuam9pbih0byk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmNvbnN0IENPTVBBUkFUT1JfUkUgPSAvXlxccyooPD18Pj18PHw+KVxccyooLispJC87XG5cbi8vIFJlZmVyZW5jZS1yYW5nZSBwYXJzaW5nLiBOSEkgc2hpcHMgdGhlIHJhbmdlIGFzIHBsYWluIHRleHQgbGlrZVxuLy8gXCJbMy44OV1bMjYuOF1cIiwgXCJbNDBdW11cIiwgXCJbTmVnYXRpdmVdXCIgb3IgXCJBTSA4OjAwIDYuMi0xOS40XCIuXG5jb25zdCBSUl9MT1dISUdIX0JSQUNLRVRTID0gL15cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqXFxbXFxzKihbXlxcXV0qKVxccypcXF1cXHMqJC87XG5jb25zdCBSUl9EQVNIX1JBTkdFID0gLygtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlstflx1MjAxM11cXHMqKC0/XFxkKyg/OlxcLlxcZCspPykvO1xuY29uc3QgUlJfQ09NUEFSQVRPUiA9IC9eXFxzKig8PXw+PXw8fD4pXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKiQvO1xuLy8gU2V4LXN0cmF0aWZpZWQgYnJhY2tldGVkIHJhbmdlLCBlLmcuIFwiXHU3NTM3OjEzLjcgXHU1OTczOjExLjFcIiBcdTIwMTQgdXNlZCBieSBzb21lXG4vLyBob3NwaXRhbHMgZm9yIGhhZW1hdG9sb2d5IChIYiwgUkJDLCBIY3QpLiBQdWxscyBvdXQgKHNleCwgdmFsdWUpIHBhaXJzLlxuLy8gVG9sZXJhdGVzIG9wdGlvbmFsIGNvbXBhcmF0b3IgKFx1MjI2Ny9cdTIyNjYvPi88KSBiZWZvcmUgdGhlIG51bWJlci5cbmNvbnN0IFJSX1NFWF9OVU1fRyA9IC8oXHU3NTM3XHU2MDI3fFx1NTk3M1x1NjAyN3xcdTc1Mzd8XHU1OTczfE18RilcXHMqWzpcdUZGMUFdP1xccyooPzpbPD5cdTIyNjdcdTIyNjZdPT8pP1xccyooLT9cXGQrKD86XFwuXFxkKyk/KS9nO1xuY29uc3QgUlJfU0lOR0xFX0JSQUNLRVQgPSAvXlxccypcXFtcXHMqKC4rPylcXHMqXFxdXFxzKiQvO1xuY29uc3QgUlJfUVVBTElUQVRJVkVfUEFSRU4gPVxuICAvXlxccyooTm9ybWFsfFx1NkI2M1x1NUUzOHxOb25yZWFjdGl2ZXxOb24tcmVhY3RpdmUpXFxzKlxcKFxccyooLT9cXGQrKD86XFwuXFxkKyk/KVxccypcXClcXHMqJC9pO1xuXG5jb25zdCBTRVhfVE9fRkhJUjogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIFx1NzUzN1x1NjAyNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIFx1NzUzNzogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIE06IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBcdTU5NzNcdTYwMjc6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbiAgXHU1OTczOiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG4gIEY6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbn07XG5cbi8vIFB1YmxpYyB0eXBlcyBcdTIwMTQgRkhJUiBRdWFudGl0eSAvIHJlZmVyZW5jZVJhbmdlIHNoYXBlcyB1c2VkIGRvd25zdHJlYW0uXG5leHBvcnQgaW50ZXJmYWNlIFF1YW50aXR5IHtcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdD86IHN0cmluZztcbiAgc3lzdGVtPzogc3RyaW5nO1xuICBjb2RlPzogc3RyaW5nO1xuICBjb21wYXJhdG9yPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlRW50cnkge1xuICB0ZXh0OiBzdHJpbmc7XG4gIGxvdz86IFF1YW50aXR5O1xuICBoaWdoPzogUXVhbnRpdHk7XG4gIGFwcGxpZXNUbz86IEFycmF5PHtcbiAgICBjb2Rpbmc6IEFycmF5PHsgc3lzdGVtOiBzdHJpbmc7IGNvZGU6IHN0cmluZzsgZGlzcGxheTogc3RyaW5nIH0+O1xuICAgIHRleHQ6IHN0cmluZztcbiAgfT47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBVQ1VNIG5vcm1hbGlzYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTkhJIGxhYnMgcmVwb3J0IHVuaXRzIGluIGEgbWl4IG9mIFVDVU0tY2xlYW4gc3RyaW5ncyAoJ21nL2RMJyksXG4gKiBUYWl3YW4tc3R5bGUgZXF1aXZhbGVudHMgKCdtRXEvTCcgdnMgVUNVTSAnbWVxL0wnKSwgZnVsbC13aWR0aCBwdW5jdHVhdGlvblxuICogKCdcdUZGMDUnIHZzICclJyksIGFuZCBwbGFjZWhvbGRlciB0ZXh0ICgnXHU3MTIxJykuIFRoZSBUV05ISUZISVIgdmFsaWRhdG9yXG4gKiByZWplY3RzIGV2ZXJ5dGhpbmcgZXhjZXB0IGNhbm9uaWNhbCBVQ1VNIGluIFF1YW50aXR5LmNvZGUsIHNvIHdlXG4gKiBub3JtYWxpc2UuIGBudWxsYCBtZWFucyBcIm9taXQgUXVhbnRpdHkuY29kZSBlbnRpcmVseVwiLlxuICovXG5jb25zdCBVQ1VNX09WRVJSSURFUzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVsbD4gPSB7XG4gIC8vIEZ1bGx3aWR0aCBcdTIxOTIgQVNDSUlcbiAgXCJcdUZGMDVcIjogXCIlXCIsXG4gIC8vIENhc2Utc2Vuc2l0aXZlIFVDVU0gKEVxIGlzICdlcScsIG5vdCAnRXEnKVxuICBcIm1FcS9MXCI6IFwibWVxL0xcIixcbiAgXCJtZXEvbFwiOiBcIm1lcS9MXCIsXG4gIC8vIEJQIHByb2ZpbGUgZml4ZWQtdmFsdWU6IG1tW0hnXSBub3QgbW1IZ1xuICBtbUhnOiBcIm1tW0hnXVwiLFxuICBNTUhHOiBcIm1tW0hnXVwiLFxuICAvLyBDb21tb24gQ2hpbmVzZSAnbm8gdW5pdCcgcGxhY2Vob2xkZXJzIFx1MjE5MiBkcm9wIFVDVU0gY29kZVxuICBcdTcxMjE6IG51bGwsXG4gIFwiXCI6IG51bGwsXG4gIFwiXHUyMDE0XCI6IG51bGwsXG4gIFwiLVwiOiBudWxsLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvVWN1bSh1bml0OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdW5pdCkgcmV0dXJuIG51bGw7XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoVUNVTV9PVkVSUklERVMsIHVuaXQpKSB7XG4gICAgcmV0dXJuIFVDVU1fT1ZFUlJJREVTW3VuaXRdID8/IG51bGw7XG4gIH1cbiAgcmV0dXJuIHVuaXQ7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBRdWFudGl0eSBidWlsZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBtYWtlUXVhbnRpdHkodmFsdWU6IG51bWJlciwgdW5pdDogc3RyaW5nKTogUXVhbnRpdHkge1xuICBjb25zdCBxOiBRdWFudGl0eSA9IHsgdmFsdWUgfTtcbiAgaWYgKHVuaXQpIHtcbiAgICBxLnVuaXQgPSB1bml0O1xuICAgIHEuc3lzdGVtID0gVUNVTV9TWVNURU07XG4gICAgcS5jb2RlID0gdW5pdDtcbiAgfVxuICByZXR1cm4gcTtcbn1cblxuZnVuY3Rpb24gdHJ5UGFyc2VGbG9hdChzOiBzdHJpbmcpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHMgPT09IFwiXCIgfHwgcyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgLy8gTWlycm9yIFB5dGhvbidzIGZsb2F0KCkgXHUyMDE0IGFsbG93IGxlYWRpbmcvdHJhaWxpbmcgd2hpdGVzcGFjZSxcbiAgLy8gb3B0aW9uYWwgc2lnbiwgZGVjaW1hbC4gUmVqZWN0IGlmIE5hTiBPUiBpZiBhbnkgbm9uLW51bWVyaWMgcmVzaWR1YWxcbiAgLy8gKE51bWJlcihcIjEyYWJjXCIpIHJldHVybnMgTmFOLCBPSzsgXCIxMiAgYWJjXCIgYWxzbyBOYU4sIE9LKS5cbiAgY29uc3QgdHJpbW1lZCA9IHMudHJpbSgpO1xuICBpZiAodHJpbW1lZCA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IG4gPSBOdW1iZXIodHJpbW1lZCk7XG4gIGlmIChOdW1iZXIuaXNOYU4obikpIHJldHVybiBudWxsO1xuICByZXR1cm4gbjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHBhcnNlUmFuZ2VNdWx0aSAvIHBhcnNlUmFuZ2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogTGlzdCB2YXJpYW50IG9mIHBhcnNlUmFuZ2U6IGVtaXRzIG9uZSBlbnRyeSBwZXIgc2V4IHdoZW4gdGhlIHJhbmdlIGlzXG4gKiBzZXgtc3RyYXRpZmllZCAoXCJbXHU3NTM3OjEzLjcgXHU1OTczOjExLjFdW1x1NzUzNzoxNy4wIFx1NTk3MzoxNS4wXVwiKSwgb3RoZXJ3aXNlIGFcbiAqIHNpbmdsZS1lbGVtZW50IGxpc3QuIEVhY2ggZW50cnkgdGFnZ2VkIHdpdGggYXBwbGllc1RvIHNvIGRvd25zdHJlYW1cbiAqIGNvZGUgY2FuIHBpY2sgdGhlIHJpZ2h0IG9uZSBmb3IgdGhlIHBhdGllbnQncyBzZXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlTXVsdGkocmF3UmFuZ2U6IHN0cmluZywgdW5pdDogc3RyaW5nKTogUmFuZ2VFbnRyeVtdIHtcbiAgY29uc3QgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aCgocmF3UmFuZ2UgfHwgXCJcIikudHJpbSgpKTtcbiAgaWYgKCFzKSByZXR1cm4gW107XG5cbiAgY29uc3QgbG93QnlTZXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaGlnaEJ5U2V4OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGxldCB1c2VkTXVsdGkgPSBmYWxzZTtcblxuICBjb25zdCBtID0gcy5tYXRjaChSUl9MT1dISUdIX0JSQUNLRVRTKTtcbiAgaWYgKG0pIHtcbiAgICBjb25zdCBsb3dCbG9iID0gbVsxXSA/PyBcIlwiO1xuICAgIGNvbnN0IGhpZ2hCbG9iID0gbVsyXSA/PyBcIlwiO1xuICAgIGZvciAoY29uc3Qgc20gb2YgbG93QmxvYi5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICBpZiAoc21bMV0gJiYgc21bMl0pIGxvd0J5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNtIG9mIGhpZ2hCbG9iLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgIGlmIChzbVsxXSAmJiBzbVsyXSkgaGlnaEJ5U2V4W3NtWzFdXSA9IHNtWzJdO1xuICAgIH1cbiAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gU2luZ2xlLWJyYWNrZXQ6IGVhY2ggcGVyLXNleCB2YWx1ZSdzIGNvbXBhcmF0b3IgZGVjaWRlcyBsb3cgdnMgaGlnaC5cbiAgICBjb25zdCBzaW5nbGUgPSBzLm1hdGNoKFJSX1NJTkdMRV9CUkFDS0VUKTtcbiAgICBpZiAoc2luZ2xlKSB7XG4gICAgICBjb25zdCBpbm5lciA9IHNpbmdsZVsxXSA/PyBcIlwiO1xuICAgICAgZm9yIChjb25zdCBzbSBvZiBpbm5lci5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICAgIGNvbnN0IHNleEtleSA9IHNtWzFdID8/IFwiXCI7XG4gICAgICAgIGNvbnN0IHZhbFN0ciA9IHNtWzJdID8/IFwiXCI7XG4gICAgICAgIC8vIEZpbmQgdGhlIGNvbXBhcmF0b3IgaW1tZWRpYXRlbHkgcHJlY2VkaW5nIHRoaXMgbnVtYmVyLlxuICAgICAgICAvLyBNaXJyb3IgdGhlIFB5dGhvbjogcmVidWlsZCBhIHBlci1zZXgta2V5IHNlYXJjaC5cbiAgICAgICAgY29uc3QgcGF0ID0gbmV3IFJlZ0V4cChgJHtlc2NhcGVSZWdleChzZXhLZXkpfVxcXFxzKls6XHVGRjFBXT9cXFxccyooWzw+XHUyMjY3XHUyMjY2XT0/KT9cXFxccyotP1xcXFxkYCk7XG4gICAgICAgIGNvbnN0IGNtID0gaW5uZXIubWF0Y2gocGF0KTtcbiAgICAgICAgY29uc3Qgb3AgPSBjbT8uWzFdID8/IFwiXCI7XG4gICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgIGxvd0J5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH0gZWxzZSBpZiAob3AgPT09IFwiPFwiIHx8IG9wID09PSBcIjw9XCIpIHtcbiAgICAgICAgICBoaWdoQnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb3dCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB1c2VkTXVsdGkgPSBPYmplY3Qua2V5cyhsb3dCeVNleCkubGVuZ3RoID4gMCB8fCBPYmplY3Qua2V5cyhoaWdoQnlTZXgpLmxlbmd0aCA+IDA7XG4gICAgfVxuICB9XG5cbiAgaWYgKHVzZWRNdWx0aSkge1xuICAgIGNvbnN0IGVudHJpZXM6IFJhbmdlRW50cnlbXSA9IFtdO1xuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgdW5pb24gb2Yga2V5cyBhY3R1YWxseSBzZWVuIFx1MjAxNCBwcmVzZXJ2ZSBpbnNlcnRpb24gb3JkZXIuXG4gICAgY29uc3QgYWxsU2V4S2V5czogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgWy4uLk9iamVjdC5rZXlzKGxvd0J5U2V4KSwgLi4uT2JqZWN0LmtleXMoaGlnaEJ5U2V4KV0pIHtcbiAgICAgIGlmICghYWxsU2V4S2V5cy5pbmNsdWRlcyhrKSkgYWxsU2V4S2V5cy5wdXNoKGspO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNleEtleSBvZiBhbGxTZXhLZXlzKSB7XG4gICAgICBjb25zdCBtYXBwaW5nID0gU0VYX1RPX0ZISVJbc2V4S2V5XTtcbiAgICAgIGlmICghbWFwcGluZykgY29udGludWU7XG4gICAgICBjb25zdCBbZmhpckNvZGUsIGZoaXJEaXNwbGF5XSA9IG1hcHBpbmc7XG4gICAgICBjb25zdCBlbnRyeTogUmFuZ2VFbnRyeSA9IHtcbiAgICAgICAgdGV4dDogcmF3UmFuZ2UsXG4gICAgICAgIGFwcGxpZXNUbzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9obDcub3JnL2ZoaXIvYWRtaW5pc3RyYXRpdmUtZ2VuZGVyXCIsXG4gICAgICAgICAgICAgICAgY29kZTogZmhpckNvZGUsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmhpckRpc3BsYXksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgdGV4dDogZmhpckRpc3BsYXksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBpZiAoc2V4S2V5IGluIGxvd0J5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGxvd0J5U2V4W3NleEtleV0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICAgIGlmIChzZXhLZXkgaW4gaGlnaEJ5U2V4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGhpZ2hCeVNleFtzZXhLZXldISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgICAgZW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICB9XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gRGUtZHVwIGJ5IEZISVIgc2V4IGNvZGUgaW4gY2FzZSBpbnB1dCBoYXMgYm90aCBcdTc1MzcgYW5kIFx1NzUzN1x1NjAyNy5cbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgIGNvbnN0IG91dDogUmFuZ2VFbnRyeVtdID0gW107XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgZW50cmllcykge1xuICAgICAgICBjb25zdCBjID0gZS5hcHBsaWVzVG8/LlswXT8uY29kaW5nWzBdPy5jb2RlO1xuICAgICAgICBpZiAoIWMgfHwgc2Vlbi5oYXMoYykpIGNvbnRpbnVlO1xuICAgICAgICBzZWVuLmFkZChjKTtcbiAgICAgICAgb3V0LnB1c2goZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uZSA9IHBhcnNlUmFuZ2UocmF3UmFuZ2UsIHVuaXQpO1xuICByZXR1cm4gb25lID8gW29uZV0gOiBbXTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcmVmZXJlbmNlLXJhbmdlIHRleHQgaW50byBhIEZISVIgcmVmZXJlbmNlUmFuZ2UgZW50cnkuXG4gKlxuICogU3RyYXRlZ3kgaW4gb3JkZXI6XG4gKiAgIDEuIFwiW2xvd11baGlnaF1cIiBicmFja2V0ZWQgZm9ybWF0IFx1MjAxNCBOSEkncyBjYW5vbmljYWwgc2hhcGUuXG4gKiAgIDIuIFwiMy44OS0yNi44XCIgLyBcIjMuODl+MjYuOFwiIGRhc2ggcmFuZ2UuXG4gKiAgIDMuIFwiPiA0MFwiIC8gXCI8IDAuNVwiIHNpbmdsZS1zaWRlZC5cbiAqICAgNC4gUXVhbGl0YXRpdmUgKFwiTmVnYXRpdmVcIiwgXCJBTSA4OjAwIDYuMi0xOS40XCIpIFx1MjAxNCB0ZXh0LW9ubHkuXG4gKlxuICogU2V4LXN0cmF0aWZpZWQgc2hhcGVzIGdvIHRocm91Z2ggcGFyc2VSYW5nZU11bHRpLiBSZXR1cm5zIG51bGwgb25seVxuICogZm9yIGVtcHR5IGlucHV0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSYW5nZShyYXdSYW5nZTogc3RyaW5nLCB1bml0OiBzdHJpbmcpOiBSYW5nZUVudHJ5IHwgbnVsbCB7XG4gIGNvbnN0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoKHJhd1JhbmdlIHx8IFwiXCIpLnRyaW0oKSk7XG4gIGlmICghcykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGVudHJ5OiBSYW5nZUVudHJ5ID0geyB0ZXh0OiByYXdSYW5nZSB9O1xuXG4gIGNvbnN0IG0gPSBzLm1hdGNoKFJSX0xPV0hJR0hfQlJBQ0tFVFMpO1xuICBpZiAobSkge1xuICAgIGNvbnN0IGxvID0gKG1bMV0gPz8gXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IGhpID0gKG1bMl0gPz8gXCJcIikudHJpbSgpO1xuICAgIGZvciAoY29uc3QgW3NpZGUsIHNpZGVWYWxdIG9mIFtcbiAgICAgIFtcImxvd1wiLCBsb10sXG4gICAgICBbXCJoaWdoXCIsIGhpXSxcbiAgICBdIGFzIGNvbnN0KSB7XG4gICAgICBpZiAoIXNpZGVWYWwgfHwgc2lkZVZhbCA9PT0gXCJcdTcxMjFcIiB8fCBzaWRlVmFsID09PSBcIlx1N0E3QVx1NzY3RFwiKSBjb250aW51ZTtcblxuICAgICAgLy8gMS4gUGxhaW4gZmxvYXRcbiAgICAgIGNvbnN0IGFzRmxvYXQgPSB0cnlQYXJzZUZsb2F0KHNpZGVWYWwpO1xuICAgICAgaWYgKGFzRmxvYXQgIT09IG51bGwpIHtcbiAgICAgICAgZW50cnlbc2lkZV0gPSBtYWtlUXVhbnRpdHkoYXNGbG9hdCwgdW5pdCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyAyLiBEYXNoIHJhbmdlIFx1MjAxNCBtZWFuaW5nZnVsIG9ubHkgZm9yIGBsb3dgIHNsb3Q7IHNwbGl0cyBpbnRvIGxvdytoaWdoLlxuICAgICAgY29uc3QgZG0gPSBzaWRlVmFsLm1hdGNoKFJSX0RBU0hfUkFOR0UpO1xuICAgICAgaWYgKGRtICYmIHNpZGUgPT09IFwibG93XCIgJiYgZW50cnkuaGlnaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkbVsxXSEpO1xuICAgICAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZG1bMl0hKTtcbiAgICAgICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYxLCB1bml0KTtcbiAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYyLCB1bml0KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAzLiBDb21wYXJhdG9yIChcdTIyNjc2MCwgPD0wLjA0IGV0Yy4pXG4gICAgICBjb25zdCBjbSA9IHNpZGVWYWwubWF0Y2goUlJfQ09NUEFSQVRPUik7XG4gICAgICBpZiAoY20pIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21bMl0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBvcCA9IGNtWzFdO1xuICAgICAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA0LiBcIk5vcm1hbCAoIFggKVwiIC8gXCJOb25yZWFjdGl2ZSAoIFggKVwiIFx1MjAxNCBYIGlzIHRoZSBjdXRvZmYgKGhpZ2ggYm91bmQpLlxuICAgICAgY29uc3QgcW0gPSBzaWRlVmFsLm1hdGNoKFJSX1FVQUxJVEFUSVZFX1BBUkVOKTtcbiAgICAgIGlmIChxbSkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChxbVsyXSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgY29uc3QgZGFzaE1hdGNoID0gcy5tYXRjaChSUl9EQVNIX1JBTkdFKTtcbiAgaWYgKGRhc2hNYXRjaCkge1xuICAgIGNvbnN0IHYxID0gdHJ5UGFyc2VGbG9hdChkYXNoTWF0Y2hbMV0hKTtcbiAgICBjb25zdCB2MiA9IHRyeVBhcnNlRmxvYXQoZGFzaE1hdGNoWzJdISk7XG4gICAgaWYgKHYxICE9PSBudWxsICYmIHYyICE9PSBudWxsKSB7XG4gICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodjEsIHVuaXQpO1xuICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2MiwgdW5pdCk7XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIGNvbnN0IGNtcE1hdGNoID0gcy5tYXRjaChSUl9DT01QQVJBVE9SKTtcbiAgaWYgKGNtcE1hdGNoKSB7XG4gICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoY21wTWF0Y2hbMl0hKTtcbiAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgb3AgPSBjbXBNYXRjaFsxXTtcbiAgICAgIGlmIChvcCA9PT0gXCI+XCIgfHwgb3AgPT09IFwiPj1cIikge1xuICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICAvLyBGYWxsIHRocm91Z2g6IHF1YWxpdGF0aXZlIG9yIGNvbXBsZXggXHUyMDE0IHRleHQtb25seSBpcyBGSElSLWNvcnJlY3QuXG4gIHJldHVybiBlbnRyeTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIHRyeVBhcnNlUXVhbnRpdHkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogUGFyc2UgXCI+IDQwLjBcIiAvIFwiPDAuMDEwXCIgLyBcIjEsMjM0LjVcIiBcdTIxOTIgRkhJUiBRdWFudGl0eSB3aXRoIGNvbXBhcmF0b3IuXG4gKiBSZXR1cm5zIG51bGwgd2hlbiB0aGUgcmVzaWR1YWwgYWZ0ZXIgc3RyaXBwaW5nIGEgY29tcGFyYXRvciBzdGlsbFxuICogaXNuJ3QgbnVtZXJpYyBcdTIwMTQgY2FsbGVyIGZhbGxzIGJhY2sgdG8gdmFsdWVTdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cnlQYXJzZVF1YW50aXR5KFxuICByYXdWYWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgdW5pdDogc3RyaW5nLFxuKTogUXVhbnRpdHkgfCBudWxsIHtcbiAgaWYgKHJhd1ZhbHVlID09PSBudWxsIHx8IHJhd1ZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBsZXQgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aChTdHJpbmcocmF3VmFsdWUpLnRyaW0oKSk7XG4gIGxldCBjb21wYXJhdG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY29uc3QgY20gPSBzLm1hdGNoKENPTVBBUkFUT1JfUkUpO1xuICBpZiAoY20pIHtcbiAgICBjb21wYXJhdG9yID0gY21bMV0gPz8gbnVsbDtcbiAgICBzID0gKGNtWzJdID8/IFwiXCIpLnRyaW0oKTtcbiAgfVxuICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChzLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICBpZiAodiA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdWN1bUNvZGUgPSB0b1VjdW0odW5pdCk7XG4gIGNvbnN0IHF0eTogUXVhbnRpdHkgPSB7XG4gICAgdmFsdWU6IHYsXG4gICAgc3lzdGVtOiBVQ1VNX1NZU1RFTSxcbiAgfTtcbiAgLy8gUXVhbnRpdHkudW5pdCAoaHVtYW4tcmVhZGFibGUpIGtlZXBzIHRoZSBvcmlnaW5hbCBOSEkgbGFiZWwgc28gdXNlcnNcbiAgLy8gc3RpbGwgc2VlICdcdUZGMDUnIG9yICdtRXEvTCcgcmF3LiBRdWFudGl0eS5jb2RlIGlzIHN0cmljdCBVQ1VNIG1hY2hpbmVcbiAgLy8gY29kZS4gRHJvcCB1bml0IGRpc3BsYXkgd2hlbiBlbXB0eSBzbyB3ZSBkb24ndCBlbWl0IFwidW5pdFwiOiBcIlwiLlxuICBpZiAodW5pdCkge1xuICAgIHF0eS51bml0ID0gdW5pdDtcbiAgfVxuICBpZiAodWN1bUNvZGUgIT09IG51bGwpIHtcbiAgICBxdHkuY29kZSA9IHVjdW1Db2RlO1xuICB9XG4gIGlmIChjb21wYXJhdG9yKSB7XG4gICAgcXR5LmNvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICB9XG4gIHJldHVybiBxdHk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG4iLCAiLyoqXG4gKiBPYnNlcnZhdGlvbiBtYXBwZXIgXHUyMDE0IHNpbmdsZS1yb3cgYW5kIHBhbmVsLWdyb3VwZWQgdmFyaWFudHMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL29ic2VydmF0aW9uLnB5YCAoMTIxMiBsaW5lcykuIEluY2x1ZGVzOlxuICogICAtIG1hcE9ic2VydmF0aW9uKHJhdywgcGF0aWVudElkKSBcdTIxOTIgc2luZ2xlIE9ic2VydmF0aW9uXG4gKiAgIC0gbWFwT2JzZXJ2YXRpb25zR3JvdXBlZChpdGVtcywgcGF0aWVudElkKSBcdTIxOTIgRGlhZ25vc3RpY1JlcG9ydCArIE9ic2VydmF0aW9uc1xuICogICAtIGNhbm9uaWNhbExhYktleShkaXNwbGF5KSBcdTIwMTQgY3Jvc3MtcGFnZSBkZWR1cCBrZXlcbiAqICAgLSBmaW5kTG9pbmMsIGJ1aWxkQ29kaW5ncywgbWFwSW50ZXJwcmV0YXRpb24sIGRlcml2ZUludGVycHJldGF0aW9uXG4gKiAgIC0gZGVkdXBlQ3Jvc3NGb3JtYXQsIGNvbWJpbmVCcEl0ZW1zLCBncm91cEJ5T3JkZXJDb2RlXG4gKiAgIC0gaW5mZXJTcGVjaW1lblxuICpcbiAqIEZ1bmN0aW9uYWwgcGFyaXR5IHdpdGggdGhlIFB5dGhvbiBpbXBsZW1lbnRhdGlvbiBpcyB0aGUgZ29hbC4gRmllbGRcbiAqIG9yZGVyIGluIHRoZSBlbWl0dGVkIHJlc291cmNlcyBtYXkgZGlmZmVyIChKUyBvYmplY3QgbGl0ZXJhbCBvcmRlcilcbiAqIGJ1dCBjb250ZW50IGlzIGlkZW50aWNhbC5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtcbiAgRElTUExBWV9GSVJTVF9DT0RFUyxcbiAgTE9JTkNfRElTUExBWSxcbiAgTE9JTkNfTUFQLFxuICBOSElfVE9fTE9JTkMsXG4gIFBBTkVMX0xPSU5DX01BUCxcbn0gZnJvbSBcIi4vbG9pbmMtdGFibGVzXCI7XG5pbXBvcnQge1xuICB0eXBlIFF1YW50aXR5LFxuICB0eXBlIFJhbmdlRW50cnksXG4gIHBhcnNlUmFuZ2UsXG4gIHBhcnNlUmFuZ2VNdWx0aSxcbiAgdG9VY3VtLFxuICB0cnlQYXJzZVF1YW50aXR5LFxufSBmcm9tIFwiLi9wYXJzZXJzXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBJbWFnaW5nIGRldGVjdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgSU1BR0lOR19LRVlXT1JEUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICBcInVsdHJhc291bmRcIixcbiAgXCJzb25vZ3JhbVwiLFxuICBcInNvbm9ncmFwaHlcIixcbiAgXCJlY2hvXCIsXG4gIFwiY3QgXCIsXG4gIFwiY3QvXCIsXG4gIFwiY3QtXCIsXG4gIFwiY29tcHV0ZWQgdG9tb2dyYXBoeVwiLFxuICBcIm1yaVwiLFxuICBcIm1hZ25ldGljIHJlc29uYW5jZVwiLFxuICBcIngtcmF5XCIsXG4gIFwieHJheVwiLFxuICBcInggcmF5XCIsXG4gIFwibWFtbW9ncmFwaHlcIixcbiAgXCJtYW1tb1wiLFxuICBcImVrZ1wiLFxuICBcImVjZ1wiLFxuICBcImVsZWN0cm9jYXJkaW9ncmFtXCIsXG4gIFwiZW5kb3Njb3BcIixcbiAgXCJjb2xvbm9zY29wXCIsXG4gIFwiZ2FzdHJvc2NvcFwiLFxuICBcImJyb25jaG9zY29wXCIsXG4gIFwicGV0L2N0XCIsXG4gIFwicGV0IFwiLFxuICBcInNwZWN0XCIsXG4gIFwiXHU1RjcxXHU1MENGXCIsXG4gIFwiXHU4RDg1XHU5N0YzXHU2Q0UyXCIsXG4gIFwiXHU5NkZCXHU4MTY2XHU2NUI3XHU1QzY0XCIsXG4gIFwiXHU2ODM4XHU3OEMxXHU1MTcxXHU2MzJGXCIsXG4gIFwiXHU1RkMzXHU5NkZCXHU1NzE2XCIsXG4gIFwiXHU1MTY3XHU4OTk2XHU5M0UxXCIsXG4gIFwiXHU0RTczXHU2MjNGXHU2NTFEXHU1RjcxXCIsXG5dO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXk6IHN0cmluZywgY29kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGhheXN0YWNrID0gYCR7ZGlzcGxheX0gJHtjb2RlfWAudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIElNQUdJTkdfS0VZV09SRFMuc29tZSgoa3cpID0+IGhheXN0YWNrLmluY2x1ZGVzKGt3KSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMT0lOQyBsb29rdXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IE5ISV9MQUJfQ09ERV9SRSA9IC9eXFxkezQsNn1bQS1aXSQvO1xuXG5mdW5jdGlvbiBpc0FzY2lpT25seShzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSA+IDEyNykgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkLlxuICogICBDLiBGYWxsYmFjazogcGFuZWwtbGV2ZWwgTE9JTkMgZnJvbSBOSElfVE9fTE9JTkMgaWYgYXZhaWxhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExvaW5jKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIHdpbnMgb3V0cmlnaHQuXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DICYmICFESVNQTEFZX0ZJUlNUX0NPREVTLmhhcyhjb2RlKSkge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gYCR7Y29kZX0gJHtkaXNwbGF5fWAudG9Mb3dlckNhc2UoKTtcblxuICAvLyBCMS4gUGFuZWwtc3BlY2lmaWMga2V5d29yZCBtYXAgcnVucyBCRUZPUkUgdGhlIGdsb2JhbCBvbmUuXG4gIGlmIChjb2RlIGluIFBBTkVMX0xPSU5DX01BUCkge1xuICAgIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKFBBTkVMX0xPSU5DX01BUFtjb2RlXSEpKSB7XG4gICAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGtleS50b0xvd2VyQ2FzZSgpKX1gKS50ZXN0KGNvbWJpbmVkKSkge1xuICAgICAgICAgIHJldHVybiBsb2luYztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb21iaW5lZC5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKExPSU5DX01BUCkpIHtcbiAgICBpZiAoaXNBc2NpaU9ubHkoa2V5KSkge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrZXkudG9Mb3dlckNhc2UoKSl9YCkudGVzdChjb21iaW5lZCkpIHtcbiAgICAgICAgcmV0dXJuIGxvaW5jO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tYmluZWQuaW5jbHVkZXMoa2V5LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICByZXR1cm4gbG9pbmM7XG4gICAgfVxuICB9XG5cbiAgLy8gQy4gUGFuZWwgY29kZSB3aXRoIG5vIHJlY29nbmlzZWQgaXRlbSBkaXNwbGF5IFx1MjE5MiBmYWxsIGJhY2suXG4gIGlmIChjb2RlICYmIGNvZGUgaW4gTkhJX1RPX0xPSU5DKSB7XG4gICAgcmV0dXJuIE5ISV9UT19MT0lOQ1tjb2RlXSA/PyBudWxsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBPYnNlcnZhdGlvbi5jb2RlLmNvZGluZ1tdIGxpc3QuXG4gKiBQcmlvcml0eTogTE9JTkMgXHUyMTkyIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIGxvY2FsIGZhbGxiYWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb2RpbmdzKFxuICBjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkaXNwbGF5OiBzdHJpbmcsXG4gIGxvaW5jOiBzdHJpbmcgfCBudWxsLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHtcbiAgY29uc3QgY29kaW5nczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIGlmIChsb2luYykge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLFxuICAgICAgY29kZTogbG9pbmMsXG4gICAgICBkaXNwbGF5OiBMT0lOQ19ESVNQTEFZW2xvaW5jXSA/PyBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGNvZGVTdHIgPSAoY29kZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmIChjb2RlU3RyICYmIE5ISV9MQUJfQ09ERV9SRS50ZXN0KGNvZGVTdHIpKSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5OSElfTUVESUNBTF9PUkRFUl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0cixcbiAgICAgIGRpc3BsYXksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29kaW5ncy5wdXNoKHtcbiAgICAgIHN5c3RlbTogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREUsXG4gICAgICBjb2RlOiBjb2RlU3RyIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBjb2RpbmdzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJwcmV0YXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElOVEVSUF9TWVMgPSBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vdjMtT2JzZXJ2YXRpb25JbnRlcnByZXRhdGlvblwiO1xuXG5mdW5jdGlvbiBpbnRlcnBDb2RpbmcoY29kZTogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgcmV0dXJuIHsgc3lzdGVtOiBJTlRFUlBfU1lTLCBjb2RlLCBkaXNwbGF5IH07XG59XG5cbmNvbnN0IElOVEVSUF9UQUJMRTogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nXT4gPSB7XG4gIGhpZ2g6IFtcIkhcIiwgXCJIaWdoXCJdLFxuICBsb3c6IFtcIkxcIiwgXCJMb3dcIl0sXG4gIG5vcm1hbDogW1wiTlwiLCBcIk5vcm1hbFwiXSxcbiAgY3JpdGljYWw6IFtcIkFBXCIsIFwiQ3JpdGljYWwgYWJub3JtYWxcIl0sXG4gIGFibm9ybWFsOiBbXCJBXCIsIFwiQWJub3JtYWxcIl0sXG4gIHBvc2l0aXZlOiBbXCJQT1NcIiwgXCJQb3NpdGl2ZVwiXSxcbiAgbmVnYXRpdmU6IFtcIk5FR1wiLCBcIk5lZ2F0aXZlXCJdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEludGVycHJldGF0aW9uKFxuICBpbnRlcnA6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGNvbnN0IGtleSA9IChpbnRlcnAgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgZW50cnkgPSBJTlRFUlBfVEFCTEVba2V5XTtcbiAgaWYgKCFlbnRyeSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpbnRlcnBDb2RpbmcoZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuLy8gUG9zaXRpdmUgbWFya2VycyBcdTIwMTQgXCJ0aGlzIGlzIGRldGVjdGVkIC8gYWJub3JtYWxcIi5cbmNvbnN0IFBPU19NQVJLRVJTID1cbiAgL15cXHMqKD86cG9zaXRpdmV8cG9zfHJlYWN0aXZlfGRldGVjdGVkfGFibm9ybWFsfHByZXNlbnR8dHJhY2V8WzEtNF0/XFxzKlxcKyg/OlxccypbXFwrXFwtXSkqKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuLy8gTmVnYXRpdmUgbWFya2VycyBcdTIwMTQgZXhwbGljaXRseSBub3JtYWwvYWJzZW50LlxuY29uc3QgTkVHX01BUktFUlMgPVxuICAvXlxccyooPzpuZWdhdGl2ZXxuZWd8bm9ucmVhY3RpdmV8bm9uWy1cXHNdP3JlYWN0aXZlfG5vdFstXFxzXT9kZXRlY3RlZHxuZHxhYnNlbnR8bm9uZXxub3JtYWx8MHxbLVx1MjAxNFx1MjAxM10rKVxccyooPzpcXCguKlxcKSk/XFxzKiQvaTtcblxuZnVuY3Rpb24gY2xhc3NpZnlRdWFsaXRhdGl2ZSh0ZXh0OiB1bmtub3duKTogXCJwb3NcIiB8IFwibmVnXCIgfCBudWxsIHtcbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSBTdHJpbmcodGV4dCkudHJpbSgpO1xuICBpZiAocy5zdGFydHNXaXRoKFwiW1wiKSAmJiBzLmVuZHNXaXRoKFwiXVwiKSkge1xuICAgIHMgPSBzLnNsaWNlKDEsIC0xKS50cmltKCk7XG4gIH1cbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgaWYgKE5FR19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcIm5lZ1wiO1xuICBpZiAoUE9TX01BUktFUlMudGVzdChzKSkgcmV0dXJuIFwicG9zXCI7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gIHZhbHVlUmF3OiBzdHJpbmcsXG4gIHF0eTogUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gIHJyOiBSYW5nZUVudHJ5IHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICAvLyAxLiBOdW1lcmljIHBhdGguXG4gIGlmIChxdHkgJiYgdHlwZW9mIHF0eS52YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiBycikge1xuICAgIGNvbnN0IHYgPSBxdHkudmFsdWU7XG4gICAgY29uc3QgbG8gPSByci5sb3c/LnZhbHVlO1xuICAgIGNvbnN0IGhpID0gcnIuaGlnaD8udmFsdWU7XG4gICAgaWYgKHR5cGVvZiBoaSA9PT0gXCJudW1iZXJcIiAmJiB2ID4gaGkpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJIXCIsIFwiSGlnaFwiKTtcbiAgICBpZiAodHlwZW9mIGxvID09PSBcIm51bWJlclwiICYmIHYgPCBsbykgcmV0dXJuIGludGVycENvZGluZyhcIkxcIiwgXCJMb3dcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gMi4gUXVhbGl0YXRpdmUgcGF0aC5cbiAgY29uc3QgdmFsS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUodmFsdWVSYXcpO1xuICBjb25zdCByZWZUZXh0ID0gcnI/LnRleHQgPz8gXCJcIjtcbiAgY29uc3QgcmVmS2luZCA9IGNsYXNzaWZ5UXVhbGl0YXRpdmUocmVmVGV4dCk7XG4gIGlmICh2YWxLaW5kID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgaWYgKHJlZktpbmQgPT09IFwibmVnXCIpIHtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJwb3NcIikgcmV0dXJuIGludGVycENvZGluZyhcIkFcIiwgXCJBYm5vcm1hbFwiKTtcbiAgICBpZiAodmFsS2luZCA9PT0gXCJuZWdcIikgcmV0dXJuIGludGVycENvZGluZyhcIk5cIiwgXCJOb3JtYWxcIik7XG4gIH1cbiAgcmV0dXJuIHZhbEtpbmQgPT09IFwicG9zXCIgPyBpbnRlcnBDb2RpbmcoXCJQT1NcIiwgXCJQb3NpdGl2ZVwiKSA6IGludGVycENvZGluZyhcIk5FR1wiLCBcIk5lZ2F0aXZlXCIpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2Fub25pY2FsIGxhYiBrZXkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IExBQl9TWU5PTllNUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRGlhYmV0ZXNcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFx1N0NENlx1NTMxNlx1ODg0MFx1ODI3Mlx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEJBMUNcIixcbiAgXCJHTFlDQVRFRCBIRU1PR0xPQklOXCI6IFwiSEJBMUNcIixcbiAgSEJBMUM6IFwiSEJBMUNcIixcbiAgQTFDOiBcIkhCQTFDXCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXCJGQVNUSU5HIEdMVUNPU0VcIjogXCJHTFVDT1NFX0ZBU1RJTkdcIixcbiAgXHU4NDYxXHU4NDA0XHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgXHU4ODQwXHU3Q0Q2OiBcIkdMVUNPU0VcIixcbiAgR0xVQ09TRTogXCJHTFVDT1NFXCIsXG4gIC8vIENCQ1xuICBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiV0JDXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCJXQkNcIixcbiAgV0JDOiBcIldCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdThBMDhcdTY1Nzg6IFwiUkJDXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCJSQkNcIixcbiAgUkJDOiBcIlJCQ1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiSEVNT0dMT0JJTlwiLFxuICBIRU1PR0xPQklOOiBcIkhFTU9HTE9CSU5cIixcbiAgSEdCOiBcIkhFTU9HTE9CSU5cIixcbiAgXHU4ODQwXHU1QkI5XHU3QTREXHU2QkQ0OiBcIkhFTUFUT0NSSVRcIixcbiAgSEVNQVRPQ1JJVDogXCJIRU1BVE9DUklUXCIsXG4gIEhDVDogXCJIRU1BVE9DUklUXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCJQTEFURUxFVFwiLFxuICBQTEFURUxFVDogXCJQTEFURUxFVFwiLFxuICBQTFQ6IFwiUExBVEVMRVRcIixcbiAgLy8gQ0JDIGluZGljZXMgKDEwLWNoYXIgYW5kIDctY2hhciBDSksgZm9ybXMgYmVhdCBiYXJlIFx1N0QwNVx1ODg0MFx1NzQwMylcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU4ODQwXHU4MjcyXHU3RDIwOiBcIk1DSFwiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTZGQzNcdTVFQTY6IFwiTUNIQ1wiLFxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTlBRDRcdTdBNEQ6IFwiTUNWXCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwM1x1NTIwNlx1NUUwM1x1NUJFQ1x1NUVBNjogXCJSRFdcIixcbiAgTUNWOiBcIk1DVlwiLFxuICBNQ0g6IFwiTUNIXCIsXG4gIE1DSEM6IFwiTUNIQ1wiLFxuICBSRFc6IFwiUkRXXCIsXG4gIC8vIENCQyBkaWZmZXJlbnRpYWxcbiAgXHU1NURDXHU0RTJEXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIk5FVVRST1BISUxcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5MTc4XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkVPU0lOT1BISUxcIixcbiAgXHU1NURDXHU5RTdDXHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIkJBU09QSElMXCIsXG4gIFx1NkRDQlx1NURGNFx1NzQwMzogXCJMWU1QSE9DWVRFXCIsXG4gIFx1NTVBRVx1NjgzOFx1NzQwMzogXCJNT05PQ1lURVwiLFxuICBFT1NJTk9QSElMUzogXCJFT1NJTk9QSElMXCIsXG4gIEVPU0lOT1BISUw6IFwiRU9TSU5PUEhJTFwiLFxuICBORVVUUk9QSElMUzogXCJORVVUUk9QSElMXCIsXG4gIE5FVVRST1BISUw6IFwiTkVVVFJPUEhJTFwiLFxuICBCQVNPUEhJTFM6IFwiQkFTT1BISUxcIixcbiAgQkFTT1BISUw6IFwiQkFTT1BISUxcIixcbiAgTFlNUEhPQ1lURVM6IFwiTFlNUEhPQ1lURVwiLFxuICBMWU1QSE9DWVRFOiBcIkxZTVBIT0NZVEVcIixcbiAgTU9OT0NZVEVTOiBcIk1PTk9DWVRFXCIsXG4gIE1PTk9DWVRFOiBcIk1PTk9DWVRFXCIsXG4gIC8vIExpcGlkIFx1MjAxNCBMREwvSERMIG11c3QgcHJlY2VkZSBiYXJlIENIT0xFU1RFUk9MLlxuICBcIkxETCBDSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNIT0xFU1RFUk9MXCI6IFwiTERMX0NcIixcbiAgXCJIREwgQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcIkhETC1DSE9MRVNURVJPTFwiOiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIkxETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJIRExfQ1wiLFxuICBcdTg4NDBcdTZFMDVcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVC1DSE9MXCI6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXCJUT1RBTCBDSE9MRVNURVJPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0xFU1RFUk9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIENIT0w6IFwiVE9UQUxfQ0hPTEVTVEVST0xcIixcbiAgXHU0RTA5XHU5MTc4XHU3NTE4XHU2Q0I5XHU5MTZGOiBcIlRSSUdMWUNFUklERVwiLFxuICBUUklHTFlDRVJJREU6IFwiVFJJR0xZQ0VSSURFXCIsXG4gIFwiSERMLUNcIjogXCJIRExfQ1wiLFxuICBIREw6IFwiSERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkhETF9DXCIsXG4gIFwiTERMLUMoRElSRUNUKVwiOiBcIkxETF9DXCIsXG4gIFwiTERMLUNcIjogXCJMRExfQ1wiLFxuICBMREw6IFwiTERMX0NcIixcbiAgXHU0RjRFXHU1QkM2XHU1RUE2XHU4MTAyXHU4NkNCXHU3NjdEOiBcIkxETF9DXCIsXG4gIC8vIFJlbmFsIFx1MjAxNCB1cmluZSBjcmVhdGluaW5lIHZhcmlhbnRzIGJlZm9yZSBzZXJ1bS5cbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVUklORSBDUkVBVElOSU5FXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEoVSlcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiQ1JFQS1VXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIlUtQ1JFQVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIkNSRUFUSU5JTkVcIixcbiAgXHU4MDhDXHU5MTUwXHU5MTc4OiBcIkNSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKEIpXCI6IFwiQ1JFQVRJTklORVwiLFxuICBDUkVBVElOSU5FOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQTogXCJDUkVBVElOSU5FXCIsXG4gIENSVE46IFwiQ1JFQVRJTklORVwiLFxuICBFR0ZSOiBcIkVHRlJcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIkJVTlwiLFxuICBCVU46IFwiQlVOXCIsXG4gIFx1NUMzRlx1OTE3OFx1OUU3Q1x1NUVBNjogXCJVUklORV9QSFwiLFxuICBcdTVDM0ZcdTZEQjJcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlBIXCIsXG4gIFx1NUMzRlx1OTE3ODogXCJVUklDX0FDSURcIixcbiAgXCJVUklDIEFDSURcIjogXCJVUklDX0FDSURcIixcbiAgVVJJQ19BQ0lEOiBcIlVSSUNfQUNJRFwiLFxuICAvLyBMaXZlclxuICBBU1Q6IFwiQVNUXCIsXG4gIEFMVDogXCJBTFRcIixcbiAgR09UOiBcIkFTVFwiLFxuICBHUFQ6IFwiQUxUXCIsXG4gIFx1ODFCRFx1N0QwNVx1N0QyMDogXCJCSUxJUlVCSU5cIixcbiAgQklMSVJVQklOOiBcIkJJTElSVUJJTlwiLFxuICBcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiQUxCVU1JTlwiLFxuICBBTEJVTUlOOiBcIkFMQlVNSU5cIixcbiAgLy8gQ2FyZGlhY1xuICBcdTVGQzNcdTgwOENcdTY1Q0JcdThGNDlcdTg2Q0JcdTc2N0Q6IFwiVFJPUE9OSU5cIixcbiAgVFJPUE9OSU46IFwiVFJPUE9OSU5cIixcbiAgQk5QOiBcIkJOUFwiLFxuICBcdTVGQzNcdTgxREY6IFwiVFJPUE9OSU5cIixcbiAgLy8gVGh5cm9pZFxuICBcdTc1MzJcdTcyQzBcdTgxN0FcdTUyM0FcdTZGQzBcdTdEMjA6IFwiVFNIXCIsXG4gIFRTSDogXCJUU0hcIixcbiAgXHU2RTM4XHU5NkUyXHU3NTMyXHU3MkMwXHU4MTdBXHU3RDIwOiBcIkZSRUVfVDRcIixcbiAgXCJGUkVFIFQ0XCI6IFwiRlJFRV9UNFwiLFxuICBGVDQ6IFwiRlJFRV9UNFwiLFxuICAvLyBNaXNjXG4gIENcdTUzQ0RcdTYxQzlcdTYwMjdcdTg2Q0JcdTc2N0Q6IFwiQ1JQXCIsXG4gIFwiQy1SRUFDVElWRSBQUk9URUlOXCI6IFwiQ1JQXCIsXG4gIENSUDogXCJDUlBcIixcbiAgXCJIUy1DUlBcIjogXCJIU19DUlBcIixcbiAgXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGOiBcIlBTQVwiLFxuICBQU0E6IFwiUFNBXCIsXG4gIFx1OTQzNVx1ODZDQlx1NzY3RDogXCJGRVJSSVRJTlwiLFxuICBGRVJSSVRJTjogXCJGRVJSSVRJTlwiLFxuICBcdTg0NDlcdTkxNzg6IFwiRk9MQVRFXCIsXG4gIEZPTEFURTogXCJGT0xBVEVcIixcbiAgXHU3REFEXHU3NTFGXHU3RDIwQjEyOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUIEIxMlwiOiBcIlZJVEFNSU5fQjEyXCIsXG4gIFwiVklUQU1JTiBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcdTc2QUVcdThDRUFcdTdEMjA6IFwiQ09SVElTT0xcIixcbiAgQ09SVElTT0w6IFwiQ09SVElTT0xcIixcbiAgXHU2ODg1XHU2QkQyOiBcIlJQUlwiLFxuICBSUFI6IFwiUlBSXCIsXG4gIFx1OTZCMVx1NzQwM1x1ODNDQ1x1NjI5N1x1NTM5RjogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgQ1JZUEFHOiBcIkNSWVBUT0NPQ0NBTF9BR1wiLFxuICBcdTg4NDBcdTZDMjg6IFwiQU1NT05JQVwiLFxuICBBTU1PTklBOiBcIkFNTU9OSUFcIixcbiAgXHU1MUREXHU4ODQwXHU5MTc2XHU1MzlGXHU2NjQyXHU5NTkzOiBcIlBUXCIsXG4gIEFQVFQ6IFwiQVBUVFwiLFxuICBJTlI6IFwiSU5SXCIsXG59O1xuXG4vLyBQcmUtc29ydCBrZXlzIGxvbmdlc3QtZmlyc3Qgc28gbG9uZ2VyL21vcmUtc3BlY2lmaWMgbWF0Y2hlcyB3aW4uXG5jb25zdCBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCA9IE9iamVjdC5rZXlzKExBQl9TWU5PTllNUykuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxMYWJLZXkoZGlzcGxheTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHMgPSBkaXNwbGF5LnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc1VwcGVyID0gcy50b1VwcGVyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGtleSBvZiBMQUJfU1lOT05ZTV9LRVlTX1NPUlRFRCkge1xuICAgIGNvbnN0IGt1ID0ga2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGt1KSkge1xuICAgICAgLy8gTGVhZGluZyB3b3JkLWJvdW5kYXJ5IG9ubHkgXHUyMDE0IFwiQVNUXCIgaW5zaWRlIFwiRElBU1RPTElDXCIgc2hvdWxkIG5vdCBtYXRjaC5cbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa3UpfWApLnRlc3Qoc1VwcGVyKSkge1xuICAgICAgICByZXR1cm4gTEFCX1NZTk9OWU1TW2tleV0hO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc1VwcGVyLmluY2x1ZGVzKGt1KSkge1xuICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYW5lbCBncm91cGluZyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBjamtDaGFycyhzOiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoIXMpIHJldHVybiAwO1xuICBsZXQgbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY29kZVBvaW50QXQoMCkgPz8gMDtcbiAgICBpZiAoY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZikgbisrO1xuICB9XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VuZ2xpc2hEb21pbmFudChzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGxhdGluID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSB7XG4gICAgY29uc3QgY3AgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChjcCA8IDEyOCAmJiAvW0EtWmEtel0vLnRlc3QoY2gpKSBsYXRpbisrO1xuICB9XG4gIHJldHVybiBsYXRpbiA+PSAyICYmIGNqa0NoYXJzKHMpID09PSAwO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWYWx1ZUZvckRlZHVwKHY6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBsZXQgcyA9IFN0cmluZyh2KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcyA9IHMucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgXCJcIikudHJpbSgpO1xuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHMgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgcmV0dXJuIHMgIT09IFwiXCIgJiYgcyAhPT0gXCJcdTIwMTRcIiAmJiBzICE9PSBcIi1cIiAmJiBzICE9PSBcIk4vQVwiICYmIHMgIT09IFwibnVsbFwiO1xufVxuXG5jb25zdCBNRUFOSU5HRlVMX0lOVEVSUFMgPSBuZXcgU2V0KFtcbiAgXCJub3JtYWxcIixcbiAgXCJhYm5vcm1hbFwiLFxuICBcImhpZ2hcIixcbiAgXCJsb3dcIixcbiAgXCJjcml0aWNhbFwiLFxuICBcInBvc2l0aXZlXCIsXG4gIFwibmVnYXRpdmVcIixcbl0pO1xuXG5mdW5jdGlvbiBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieVZhbHVlID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgZm9yIChjb25zdCBpdCBvZiBpdGVtcykge1xuICAgIGNvbnN0IGsgPSBub3JtYWxpemVWYWx1ZUZvckRlZHVwKGl0LnZhbHVlKTtcbiAgICBjb25zdCBncm91cCA9IGJ5VmFsdWUuZ2V0KGspO1xuICAgIGlmIChncm91cCkgZ3JvdXAucHVzaChpdCk7XG4gICAgZWxzZSBieVZhbHVlLnNldChrLCBbaXRdKTtcbiAgfVxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGdyb3VwIG9mIGJ5VmFsdWUudmFsdWVzKCkpIHtcbiAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAxKSB7XG4gICAgICBvdXQucHVzaChncm91cFswXSEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNqa0l0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBjamtDaGFycyhTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSA+PSAyKTtcbiAgICBjb25zdCBlbkl0ZW1zID0gZ3JvdXAuZmlsdGVyKChnKSA9PiBpc0VuZ2xpc2hEb21pbmFudChTdHJpbmcoZy5kaXNwbGF5ID8/IFwiXCIpKSk7XG4gICAgaWYgKGNqa0l0ZW1zLmxlbmd0aCA+IDAgJiYgZW5JdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvdXQucHVzaChlbkl0ZW1zWzBdISk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKC4uLmdyb3VwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZmlsdGVyTGFiUm93cyhyYXdJdGVtczogYW55W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHJhdyBvZiByYXdJdGVtcykge1xuICAgIGlmICghcmF3IHx8IHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICAgIGlmIChsb29rc0xpa2VJbWFnaW5nKGRpc3BsYXksIHJhdy5jb2RlIHx8IFwiXCIpKSBjb250aW51ZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgICBjb25zdCBoYXNNZWFuaW5nZnVsSW50ZXJwID0gTUVBTklOR0ZVTF9JTlRFUlBTLmhhcyhpbnRlcnApO1xuICAgIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHJhdyk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gZGVkdXBlQ3Jvc3NGb3JtYXQoaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IG9yZGVyQ29kZSA9IChpdDogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyA9PlxuICAgICgoaXQub3JkZXJfY29kZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuXG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGxldCBpZHhDb3VudGVyID0gMDtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgdiA9IFN0cmluZyhpdGVtLnZhbHVlID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCB1bml0ID0gKChpdGVtLnVuaXQgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gICAgaWYgKCF2KSB7XG4gICAgICBieUtleS5zZXQoYF9fbm9fZGVkdXBfX3wke2lkeENvdW50ZXIrK31gLCBpdGVtKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSBbXG4gICAgICAoaXRlbS5kYXRlIGFzIHN0cmluZykgPz8gXCJcIixcbiAgICAgIHYudG9Mb3dlckNhc2UoKSxcbiAgICAgIHVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yZGVyQ29kZShpdGVtKSxcbiAgICBdLmpvaW4oXCJ8XCIpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYnlLZXkuZ2V0KGtleSk7XG4gICAgaWYgKCFleGlzdGluZykge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gUHJlZmVyIHRoZSByb3cgd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBjbGluaWNhbCByZWFkcykuXG4gICAgbGV0IHByaW1hcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgbGV0IHNlY29uZGFyeTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBpZiAoY2prQ2hhcnMoaXRlbS5kaXNwbGF5ID8/IFwiXCIpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZGlzcGxheSA/PyBcIlwiKSkge1xuICAgICAgcHJpbWFyeSA9IGl0ZW07XG4gICAgICBzZWNvbmRhcnkgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbWFyeSA9IGV4aXN0aW5nO1xuICAgICAgc2Vjb25kYXJ5ID0gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgbWVyZ2VkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgZm9yIChjb25zdCBmIG9mIFtcIm9yZGVyX2NvZGVcIiwgXCJvcmRlcl9uYW1lXCIsIFwiaG9zcGl0YWxcIiwgXCJjb2RlXCJdKSB7XG4gICAgICBpZiAoIW1lcmdlZFtmXSAmJiBzZWNvbmRhcnlbZl0pIG1lcmdlZFtmXSA9IHNlY29uZGFyeVtmXTtcbiAgICB9XG4gICAgYnlLZXkuc2V0KGtleSwgbWVyZ2VkKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShieUtleS52YWx1ZXMoKSk7XG59XG5cbmludGVyZmFjZSBCcENvbXBvbmVudCB7XG4gIGxvaW5jOiBzdHJpbmc7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVCcEl0ZW1zKGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgc3lzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyBkaWFzdG9saWM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH1cbiAgPigpO1xuICBjb25zdCBwYXNzVGhyb3VnaDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBkaXNwID0gU3RyaW5nKGl0LmRpc3BsYXkgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBrZXkgPSBgJHtpdC5kYXRlID8/IFwiXCJ9fCR7aXQuaG9zcGl0YWwgPz8gXCJcIn1gO1xuICAgIGlmIChkaXNwLmluY2x1ZGVzKFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuc3lzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSBpZiAoZGlzcC5pbmNsdWRlcyhcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKSkge1xuICAgICAgY29uc3QgdiA9IGJ5S2V5LmdldChrZXkpID8/IHt9O1xuICAgICAgdi5kaWFzdG9saWMgPSBpdDtcbiAgICAgIGJ5S2V5LnNldChrZXksIHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXNzVGhyb3VnaC5wdXNoKGl0KTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhcnRzIG9mIGJ5S2V5LnZhbHVlcygpKSB7XG4gICAgY29uc3QgcyA9IHBhcnRzLnN5c3RvbGljO1xuICAgIGNvbnN0IGQgPSBwYXJ0cy5kaWFzdG9saWM7XG4gICAgY29uc3QgcHJpbWFyeSA9IHMgPz8gZDtcbiAgICBpZiAoIXByaW1hcnkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IEJwQ29tcG9uZW50W10gPSBbXTtcbiAgICBjb25zdCB0cnlBZGQgPSAoc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkLCBsb2luYzogc3RyaW5nLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghc3JjKSByZXR1cm47XG4gICAgICBjb25zdCB2YWwgPSBzcmMudmFsdWU7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gXCJcIiB8fCB2YWwgPT09IFwiLVwiIHx8IHZhbCA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgICAgY29uc3QgbnVtID0gTnVtYmVyLnBhcnNlRmxvYXQoU3RyaW5nKHZhbCkucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShudW0pKSByZXR1cm47XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBsb2luYyxcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdmFsdWU6IG51bSxcbiAgICAgICAgdW5pdDogc3JjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIGludGVycHJldGF0aW9uX3RleHQ6IHNyYy5yZWZlcmVuY2VfcmFuZ2UgfHwgXCJcIixcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdHJ5QWRkKHMsIFwiODQ4MC02XCIsIFwiU3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIik7XG4gICAgdHJ5QWRkKGQsIFwiODQ2Mi00XCIsIFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgY29uc3QgY29tYmluZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLnByaW1hcnkgfTtcbiAgICBjb21iaW5lZC5kaXNwbGF5ID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX2NvZGUgPSBcIlwiO1xuICAgIGNvbWJpbmVkLm9yZGVyX25hbWUgPSBcIkJsb29kIFByZXNzdXJlXCI7XG4gICAgY29tYmluZWQuY2F0ZWdvcnkgPSBcInZpdGFsLXNpZ25zXCI7XG4gICAgY29tYmluZWQuYnBfY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgY29tYmluZWQuYnBfcGFuZWxfbG9pbmMgPSBcIjg1MzU0LTlcIjtcbiAgICBjb21iaW5lZC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBjb21iaW5lZC51bml0ID0gdW5kZWZpbmVkO1xuICAgIHBhc3NUaHJvdWdoLnB1c2goY29tYmluZWQpO1xuICB9XG5cbiAgcmV0dXJuIHBhc3NUaHJvdWdoO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU3BlY2ltZW4gaW5mZXJlbmNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTUEVDSU1FTl9SVUxFUzogUmVhZG9ubHlBcnJheTxbUmVnRXhwLCBzdHJpbmddPiA9IFtcbiAgWy9cdTVDM0Z8dXJpbmV8dXJpbmFseS9pLCBcIlVyaW5lXCJdLFxuICBbL1x1N0NERXxcdTRGQkZcdTZGNUJcdTg4NDB8c3Rvb2x8ZmVjYWx8ZmFlY2FsfG9jY3VsdFxccypibG9vZC9pLCBcIlN0b29sXCJdLFxuICBbL1x1NzVGMHxzcHV0dW0vaSwgXCJTcHV0dW1cIl0sXG4gIFsvXHU4MTY2XHU4MTBBXHU2REIyfGNzZnxjZXJlYnJvc3BpbmFsL2ksIFwiQ2VyZWJyb3NwaW5hbCBmbHVpZFwiXSxcbiAgWy9cdTgwRjhcdTZDMzR8cGxldXJhbC9pLCBcIlBsZXVyYWwgZmx1aWRcIl0sXG4gIFsvXHU4MTc5XHU2QzM0fGFzY2l0ZXN8cGVyaXRvbmVhbC9pLCBcIlBlcml0b25lYWwgZmx1aWRcIl0sXG4gIFsvXHU5NjcwXHU5MDUzfFx1NjJCOVx1NzI0N3xjZXJ2aWNhbHxwYXBcXHMqc21lYXJ8dmFnaW5hbC9pLCBcIkNlcnZpY2FsL1ZhZ2luYWxcIl0sXG4gIFsvXHU5NURDXHU3QkMwXHU2REIyfHN5bm92aWFsfGpvaW50XFxzKmZsdWlkL2ksIFwiU3lub3ZpYWwgZmx1aWRcIl0sXG4gIFsvXHU3RjhBXHU2QzM0fGFtbmlvdGljL2ksIFwiQW1uaW90aWMgZmx1aWRcIl0sXG4gIFsvXHU5QUE4XHU5QUQzfGJvbmVcXHMqbWFycm93L2ksIFwiQm9uZSBtYXJyb3dcIl0sXG5dO1xuXG5mdW5jdGlvbiBpbmZlclNwZWNpbWVuKC4uLmhpbnRzOiBBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBibG9iID0gaGludHNcbiAgICAuZmlsdGVyKChoKTogaCBpcyBzdHJpbmcgPT4gQm9vbGVhbihoKSlcbiAgICAuam9pbihcIiBcIilcbiAgICAudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCFibG9iKSByZXR1cm4gbnVsbDtcbiAgZm9yIChjb25zdCBbcGF0dGVybiwgbGFiZWxdIG9mIFNQRUNJTUVOX1JVTEVTKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdChibG9iKSkgcmV0dXJuIGxhYmVsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTWFwIHNpbmdsZSBPYnNlcnZhdGlvbiAobm9uLWdyb3VwZWQgcGF0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbihcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZSB8fCBcIlwiO1xuICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCBjb2RlKSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgaWYgKCFoYXNWYWx1ZSAmJiAhaGFzTWVhbmluZ2Z1bEludGVycCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUsIHJhdy5kYXRlID8/IFwiXCIpO1xuICBjb25zdCBsb2luYyA9IGZpbmRMb2luYyhjb2RlLCBkaXNwbGF5KTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBcImxhYm9yYXRvcnlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnIgPSBwYXJzZVJhbmdlKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJyKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IFtycl07XG4gIH1cblxuICBjb25zdCBpbnRlcnBDb2RpbmdSZXN1bHQgPVxuICAgIG1hcEludGVycHJldGF0aW9uKGludGVycCkgfHxcbiAgICBkZXJpdmVJbnRlcnByZXRhdGlvbihcbiAgICAgIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBTdHJpbmcodmFsdWUpIDogXCJcIixcbiAgICAgIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgYXMgUXVhbnRpdHkgfCB1bmRlZmluZWQsXG4gICAgICAocmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgYXMgUmFuZ2VFbnRyeVtdIHwgdW5kZWZpbmVkKT8uWzBdLFxuICAgICk7XG4gIGlmIChpbnRlcnBDb2RpbmdSZXN1bHQpIHtcbiAgICByZXNvdXJjZS5pbnRlcnByZXRhdGlvbiA9IFt7IGNvZGluZzogW2ludGVycENvZGluZ1Jlc3VsdF0gfV07XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCdWlsZCBvYnNlcnZhdGlvbiB3aXRoaW4gYSBwYW5lbCAod2l0aCBjYW5vbmljYWwgbGFiIGtleSBpZCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGJ1aWxkT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4gIHBhbmVsQ29kZTogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICAvLyBCUCBwYW5lbDogcHJlYnVpbHQgYnkgY29tYmluZUJwSXRlbXMuXG4gIGlmIChyYXcuYnBfY29tcG9uZW50cykge1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qgb2JzSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwib2JzXCIsIFwiQlBfUEFORUxcIiwgZGF0ZSwgaG9zcGl0YWwpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlc291cmNlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgcmF3LmJwX2NvbXBvbmVudHMgYXMgQnBDb21wb25lbnRbXSkge1xuICAgICAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICAgICAgdmFsdWU6IGMudmFsdWUsXG4gICAgICAgIHVuaXQ6IGMudW5pdCB8fCBcIm1tSGdcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogdG9VY3VtKGMudW5pdCkgPz8gXCJtbVtIZ11cIixcbiAgICAgIH07XG4gICAgICBjb21wb25lbnRSZXNvdXJjZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICBjb2Rpbmc6IFt7IHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsIGNvZGU6IGMubG9pbmMsIGRpc3BsYXk6IGMuZGlzcGxheSB9XSxcbiAgICAgICAgICB0ZXh0OiBjLmRpc3BsYXksXG4gICAgICAgIH0sXG4gICAgICAgIHZhbHVlUXVhbnRpdHk6IHF0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBicE9iczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgICAgaWQ6IG9ic0lkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwidml0YWwtc2lnbnNcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJWaXRhbCBTaWduc1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgICAgICAgIGNvZGU6IHJhdy5icF9wYW5lbF9sb2luYyA/PyBcIjg1MzU0LTlcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiQmxvb2QgcHJlc3N1cmUgcGFuZWxcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBcIkJsb29kIFByZXNzdXJlXCIsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50UmVzb3VyY2VzLFxuICAgIH07XG4gICAgaWYgKGRhdGUpIGJwT2JzLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7ZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICAgIGlmIChob3NwaXRhbCkgYnBPYnMucGVyZm9ybWVyID0gW3sgZGlzcGxheTogaG9zcGl0YWwgfV07XG4gICAgcmV0dXJuIGJwT2JzO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5IHx8IHJhdy5jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGNvZGUgPSAocGFuZWxDb2RlID8gU3RyaW5nKHBhbmVsQ29kZSkgOiBcIlwiKSB8fCByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCB2YWx1ZSA9IHJhdy52YWx1ZTtcbiAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgY2Fub25pY2FsID0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIHx8IGRpc3BsYXk7XG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBjYW5vbmljYWwsIHJhdy5kYXRlID8/IFwiXCIsIHJhdy5ob3NwaXRhbCA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgY2F0Q29kZSA9IHJhdy5jYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIjtcbiAgY29uc3QgQ0FUX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbGFib3JhdG9yeTogXCJMYWJvcmF0b3J5XCIsXG4gICAgXCJ2aXRhbC1zaWduc1wiOiBcIlZpdGFsIFNpZ25zXCIsXG4gICAgaW1hZ2luZzogXCJJbWFnaW5nXCIsXG4gICAgcHJvY2VkdXJlOiBcIlByb2NlZHVyZVwiLFxuICAgIFwic29jaWFsLWhpc3RvcnlcIjogXCJTb2NpYWwgSGlzdG9yeVwiLFxuICAgIHN1cnZleTogXCJTdXJ2ZXlcIixcbiAgICBleGFtOiBcIkV4YW1cIixcbiAgICB0aGVyYXB5OiBcIlRoZXJhcHlcIixcbiAgICBhY3Rpdml0eTogXCJBY3Rpdml0eVwiLFxuICB9O1xuICBjb25zdCBjYXREaXNwbGF5ID1cbiAgICBDQVRfRElTUExBWVtjYXRDb2RlXSA/PyBjYXRDb2RlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2F0Q29kZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJPYnNlcnZhdGlvblwiLFxuICAgIGlkOiBvYnNJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgY2F0ZWdvcnk6IFtcbiAgICAgIHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vb2JzZXJ2YXRpb24tY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIGNvZGU6IGNhdENvZGUsXG4gICAgICAgICAgICBkaXNwbGF5OiBjYXREaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBidWlsZENvZGluZ3MoY29kZSwgZGlzcGxheSwgbG9pbmMpLFxuICAgICAgdGV4dDogZGlzcGxheSB8fCBcIlVua25vd24gTGFiXCIsXG4gICAgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICB9O1xuXG4gIGlmIChyYXcuZGF0ZSkgcmVzb3VyY2UuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3Lmhvc3BpdGFsKSByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiByYXcuaG9zcGl0YWwgfV07XG4gIGNvbnN0IHNwZWNpbWVuID0gaW5mZXJTcGVjaW1lbihyYXcub3JkZXJfbmFtZSwgcmF3LmRpc3BsYXksIHJhdy5jb2RlKTtcbiAgaWYgKHNwZWNpbWVuKSByZXNvdXJjZS5zcGVjaW1lbiA9IHsgZGlzcGxheTogc3BlY2ltZW4gfTtcblxuICBjb25zdCBoYXNWYWx1ZSA9IGlzTWVhbmluZ2Z1bFZhbHVlKHZhbHVlKTtcbiAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgY29uc3QgcXR5ID0gdHJ5UGFyc2VRdWFudGl0eShTdHJpbmcodmFsdWUpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocXR5KSByZXNvdXJjZS52YWx1ZVF1YW50aXR5ID0gcXR5O1xuICAgIGVsc2UgcmVzb3VyY2UudmFsdWVTdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgaWYgKHJhdy5yZWZlcmVuY2VfcmFuZ2UpIHtcbiAgICBjb25zdCBycnMgPSBwYXJzZVJhbmdlTXVsdGkoU3RyaW5nKHJhdy5yZWZlcmVuY2VfcmFuZ2UpLCByYXcudW5pdCA/PyBcIlwiKTtcbiAgICBpZiAocnJzLmxlbmd0aCA+IDApIHJlc291cmNlLnJlZmVyZW5jZVJhbmdlID0gcnJzO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR3JvdXAgYnkgKG9yZGVyX2NvZGUsIGRhdGUsIGhvc3BpdGFsKSBcdTIxOTIgRFIgKyBPYnNlcnZhdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGdyb3VwQnlPcmRlckNvZGUoXG4gIGNsZWFuZWQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBsZXQgd29ya2luZyA9IGRlZHVwZUNyb3NzRm9ybWF0KGNsZWFuZWQpO1xuICB3b3JraW5nID0gY29tYmluZUJwSXRlbXMod29ya2luZyk7XG5cbiAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT5bXT4oKTtcbiAgY29uc3Qga2V5TWV0YSA9IG5ldyBNYXA8c3RyaW5nLCB7IGdyb3VwS2V5Q29kZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IGhvc3BpdGFsOiBzdHJpbmcgfT4oKTtcbiAgZm9yIChjb25zdCByYXcgb2Ygd29ya2luZykge1xuICAgIGNvbnN0IGdyb3VwS2V5Q29kZSA9IHJhdy5vcmRlcl9jb2RlIHx8IHJhdy5jb2RlIHx8IHJhdy5kaXNwbGF5IHx8IFwiXCI7XG4gICAgY29uc3QgZGF0ZSA9IHJhdy5kYXRlID8/IFwiXCI7XG4gICAgY29uc3QgaG9zcGl0YWwgPSByYXcuaG9zcGl0YWwgPz8gXCJcIjtcbiAgICBjb25zdCBrZXkgPSBgJHtncm91cEtleUNvZGV9fCR7ZGF0ZX18JHtob3NwaXRhbH1gO1xuICAgIGNvbnN0IGFyciA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaChyYXcpO1xuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLnNldChrZXksIFtyYXddKTtcbiAgICAgIGtleU1ldGEuc2V0KGtleSwgeyBncm91cEtleUNvZGU6IFN0cmluZyhncm91cEtleUNvZGUpLCBkYXRlLCBob3NwaXRhbCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGl0ZW1zXSBvZiBncm91cHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbWV0YSA9IGtleU1ldGEuZ2V0KGtleSkhO1xuICAgIGNvbnN0IGRlZHVwZWQgPSBkZWR1cGVQYW5lbEl0ZW1zKGl0ZW1zKTtcblxuICAgIGNvbnN0IG9ic1Jlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gICAgY29uc3Qgc2Vlbk9ic0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgaXQgb2YgZGVkdXBlZCkge1xuICAgICAgY29uc3Qgb2JzID0gYnVpbGRPYnNlcnZhdGlvbihpdCwgcGF0aWVudElkLCBtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgICBpZiAoIW9icykgY29udGludWU7XG4gICAgICBpZiAoc2Vlbk9ic0lkcy5oYXMob2JzLmlkKSkgY29udGludWU7XG4gICAgICBzZWVuT2JzSWRzLmFkZChvYnMuaWQpO1xuICAgICAgb2JzUmVzb3VyY2VzLnB1c2gob2JzKTtcbiAgICB9XG4gICAgaWYgKG9ic1Jlc291cmNlcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuXG4gICAgLy8gQlAgcGFuZWw6IGVtaXQgT2JzZXJ2YXRpb24gZGlyZWN0bHkgKG5vIERSIHdyYXBwZXIpLlxuICAgIGNvbnN0IGlzQnBQYW5lbCA9IGRlZHVwZWQuZXZlcnkoKGl0KSA9PiBpdC5icF9jb21wb25lbnRzIHx8IGl0LmRpc3BsYXkgPT09IFwiQmxvb2QgUHJlc3N1cmVcIik7XG4gICAgaWYgKGlzQnBQYW5lbCkge1xuICAgICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yZGVyTmFtZSA9IGRlZHVwZWQuZmluZCgoaXQpID0+IGl0Lm9yZGVyX25hbWUpPy5vcmRlcl9uYW1lID8/IG51bGw7XG4gICAgY29uc3QgbWVtYmVyS2V5cyA9IEFycmF5LmZyb20oXG4gICAgICBuZXcgU2V0KGRlZHVwZWQuZmlsdGVyKChpdCkgPT4gaXQuZGlzcGxheSkubWFwKChpdCkgPT4gY2Fub25pY2FsTGFiS2V5KGl0LmRpc3BsYXkpKSksXG4gICAgKS5zb3J0KCk7XG4gICAgY29uc3QgcGFuZWxTaWduYXR1cmUgPSBtZW1iZXJLZXlzLmpvaW4oXCIsXCIpIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgY29uc3QgZHJJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJEUlwiLCBwYW5lbFNpZ25hdHVyZSwgbWV0YS5kYXRlLCBtZXRhLmhvc3BpdGFsKTtcblxuICAgIGxldCBwYW5lbFRpdGxlOiBzdHJpbmc7XG4gICAgaWYgKGRlZHVwZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaW5nbGVEaXNwbGF5ID0gZGVkdXBlZFswXSEuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgcGFuZWxUaXRsZSA9IHNpbmdsZURpc3BsYXkgfHwgb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmVsVGl0bGUgPSBvcmRlck5hbWUgfHwgU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBkckNvZGVTeXN0ZW0gPSBOSElfTEFCX0NPREVfUkUudGVzdChTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpID8/IFwiXCIpXG4gICAgICA/IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERVxuICAgICAgOiBzeXN0ZW1zLkhJU19MT0NBTF9MQUJfQ09ERTtcblxuICAgIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgcmVzb3VyY2VUeXBlOiBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgICAgIGlkOiBkcklkLFxuICAgICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgICAgc3RhdHVzOiBcImZpbmFsXCIsXG4gICAgICBjYXRlZ29yeTogW1xuICAgICAgICB7XG4gICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YyLTAwNzRcIixcbiAgICAgICAgICAgICAgY29kZTogXCJMQUJcIixcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJMYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgY29kZToge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IGRyQ29kZVN5c3RlbSxcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSkgfHwgXCJVTktOT1dOXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBwYW5lbFRpdGxlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRleHQ6IHBhbmVsVGl0bGUsXG4gICAgICB9LFxuICAgICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICAgIHJlc3VsdDogb2JzUmVzb3VyY2VzLm1hcCgobykgPT4gKHsgcmVmZXJlbmNlOiBgT2JzZXJ2YXRpb24vJHtvLmlkfWAgfSkpLFxuICAgIH07XG4gICAgaWYgKG1ldGEuZGF0ZSkgZHIuZWZmZWN0aXZlRGF0ZVRpbWUgPSBgJHttZXRhLmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAobWV0YS5ob3NwaXRhbCkgZHIucGVyZm9ybWVyID0gW3sgZGlzcGxheTogbWV0YS5ob3NwaXRhbCB9XTtcblxuICAgIG91dC5wdXNoKGRyKTtcbiAgICBvdXQucHVzaCguLi5vYnNSZXNvdXJjZXMpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGNsZWFuZWQgPSBmaWx0ZXJMYWJSb3dzKHJhd0l0ZW1zKTtcbiAgcmV0dXJuIGdyb3VwQnlPcmRlckNvZGUoY2xlYW5lZCwgcGF0aWVudElkKTtcbn1cbiIsICIvKipcbiAqIFByb2NlZHVyZSBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL3Byb2NlZHVyZS5weWAuIFJldHVybnMgbnVsbCBmb3IgbGlzdC1wYWdlXG4gKiByb3dzIGxhY2tpbmcgbm90ZS9ib2R5X3NpdGUgXHUyMDE0IHRoZSBhbHRlcm5hdGl2ZSBpcyB0aGUgU01BUlQgYXBwIHNob3dpbmdcbiAqIDI1IFwicHJvY2VkdXJlc1wiIGNhbGxlZCBcIk15Y29iYWN0ZXJpYSBjdWx0dXJlXCIgLyBcIlZhZ2luYWwgdWx0cmFzb3VuZFwiXG4gKiAvIGV0Yy4gd2hpY2ggYXJlIGNsaW5pY2FsbHkgd3JvbmcuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcImljZFwiKSkgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX1BDUztcbiAgcmV0dXJuIHN5c3RlbXMuSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUHJvY2VkdXJlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBub3RlID0gKChyYXcubm90ZSBhcyBzdHJpbmcpID8/IFwiXCIpLnRyaW0oKTtcbiAgY29uc3QgYm9keVNpdGUgPSAoKHJhdy5ib2R5X3NpdGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghbm90ZSAmJiAhYm9keVNpdGUpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUHJvY2VkdXJlXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIlByb2NlZHVyZVwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3LmRhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogcmF3LnN0YXR1cyA/PyBcImNvbXBsZXRlZFwiLFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZWREYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cbiAgaWYgKGJvZHlTaXRlKSB7XG4gICAgcmVzb3VyY2UuYm9keVNpdGUgPSBbeyB0ZXh0OiBib2R5U2l0ZSB9XTtcbiAgfVxuICBpZiAobm90ZSkge1xuICAgIHJlc291cmNlLm5vdGUgPSBbeyB0ZXh0OiBub3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiBtYXBwZXIgZGlzcGF0Y2ggdGFibGVzLlxuICpcbiAqIENvbnN1bWVkIGJ5IGJhY2tlbmQncyBgL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRgIGFuZCB0aGUgZXh0ZW5zaW9uJ3NcbiAqIGxvY2FsLW1vZGUgYnVuZGxlIGFzc2VtYmxlciBzbyBib3RoIHByb2R1Y2UgaWRlbnRpY2FsIEZISVIgb3V0cHV0LlxuICovXG5cbmltcG9ydCB7IG1hcEFsbGVyZ3lJbnRvbGVyYW5jZSB9IGZyb20gXCIuL2FsbGVyZ3lcIjtcbmltcG9ydCB7IG1hcENvbmRpdGlvbiB9IGZyb20gXCIuL2NvbmRpdGlvblwiO1xuaW1wb3J0IHsgbWFwRGlhZ25vc3RpY1JlcG9ydCB9IGZyb20gXCIuL2RpYWdub3N0aWMtcmVwb3J0XCI7XG5pbXBvcnQgeyBtYXBFbmNvdW50ZXIgfSBmcm9tIFwiLi9lbmNvdW50ZXJcIjtcbmltcG9ydCB7IG1hcE1lZGljYXRpb25SZXF1ZXN0LCBtYXBNZWRpY2F0aW9uc0RlZHVwIH0gZnJvbSBcIi4vbWVkaWNhdGlvblwiO1xuaW1wb3J0IHsgbWFwT2JzZXJ2YXRpb24sIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQgfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuaW1wb3J0IHsgbWFwUHJvY2VkdXJlIH0gZnJvbSBcIi4vcHJvY2VkdXJlXCI7XG5cbmV4cG9ydCB0eXBlIFBlclJvd01hcHBlciA9IChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbikgPT4gUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGw7XG5cbmV4cG9ydCB0eXBlIEdyb3VwTWFwcGVyID0gKGl0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpID0+IFJlY29yZDxzdHJpbmcsIGFueT5bXTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIChwZXItcm93IG1hcHBlciwgSlNPTiBsaXN0IGtleSBpbnNpZGUgTExNIHJlc3BvbnNlKS5cbiAqIFVzZWQgYnkgdGhlIExMTSBmYWxsYmFjayBwYXRoIGFmdGVyIGV4dHJhY3Rpb247IHRoZSBzdHJ1Y3R1cmVkIHBhdGhcbiAqIGFsc28gY29uc3VsdHMgaXQgZm9yIHBlci1yb3cgcmVzb3VyY2UgdHlwZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBMSVNUX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBbUGVyUm93TWFwcGVyLCBzdHJpbmddPiA9IHtcbiAgb2JzZXJ2YXRpb25zOiBbbWFwT2JzZXJ2YXRpb24sIFwib2JzZXJ2YXRpb25zXCJdLFxuICBtZWRpY2F0aW9uczogW21hcE1lZGljYXRpb25SZXF1ZXN0LCBcIm1lZGljYXRpb25zXCJdLFxuICBjb25kaXRpb25zOiBbbWFwQ29uZGl0aW9uLCBcImNvbmRpdGlvbnNcIl0sXG4gIGFsbGVyZ2llczogW21hcEFsbGVyZ3lJbnRvbGVyYW5jZSwgXCJhbGxlcmdpZXNcIl0sXG4gIGRpYWdub3N0aWNfcmVwb3J0czogW21hcERpYWdub3N0aWNSZXBvcnQsIFwiZGlhZ25vc3RpY19yZXBvcnRzXCJdLFxuICBwcm9jZWR1cmVzOiBbbWFwUHJvY2VkdXJlLCBcInByb2NlZHVyZXNcIl0sXG4gIGVuY291bnRlcnM6IFttYXBFbmNvdW50ZXIsIFwiZW5jb3VudGVyc1wiXSxcbn07XG5cbi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiBncm91cC1hd2FyZSBtYXBwZXIgdGhhdCB0YWtlcyB0aGUgRlVMTCBsaXN0IGF0IG9uY2UuXG4gKiBVc2VkIHdoZW4gY3Jvc3Mtcm93IGdyb3VwaW5nL2RlZHVwIGlzIHJlcXVpcmVkIChOSEkgbGFiIHBhbmVscyxcbiAqIFx1NEUyRFx1ODJGMSBtZWRpY2F0aW9uIFx1OTZEOVx1OEE5RSBkZWR1cCkuXG4gKi9cbmV4cG9ydCBjb25zdCBHUk9VUF9IQU5ETEVSUzogUmVjb3JkPHN0cmluZywgR3JvdXBNYXBwZXI+ID0ge1xuICBvYnNlcnZhdGlvbnM6IG1hcE9ic2VydmF0aW9uc0dyb3VwZWQsXG4gIG1lZGljYXRpb25zOiBtYXBNZWRpY2F0aW9uc0RlZHVwLFxufTtcbiIsICIvKipcbiAqIEVuY291bnRlciBsaW5rZXIgXHUyMDE0IG1hdGNoIHJlc291cmNlcyB0byBFbmNvdW50ZXJzIGJ5IChob3NwaXRhbCwgZGF0ZSkuXG4gKlxuICogUHVyZSBmdW5jdGlvbjogbXV0YXRlcyBgcmVzb3VyY2VzYCBpbiBwbGFjZSB0byBhZGQgYGVuY291bnRlcmBcbiAqIHJlZmVyZW5jZXMgd2hlbiB0aGVyZSdzIGFuIHVuYW1iaWd1b3VzIG1hdGNoIGluIHRoZSBjYW5kaWRhdGVcbiAqIEVuY291bnRlciBsaXN0LiBTYW1lIGxvZ2ljIGFzIHRoZSBiYWNrZW5kJ3MgREItY291cGxlZCB2ZXJzaW9uLFxuICogbGlmdGVkIG91dCBzbyB0aGUgZXh0ZW5zaW9uJ3MgbG9jYWwgbW9kZSBjYW4gY2FsbCBpdCBvbiBhblxuICogaW4tbWVtb3J5IGFycmF5LlxuICovXG5cbmltcG9ydCB7IGRlcml2ZUludGVycHJldGF0aW9uIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb25cIjtcblxuY29uc3QgRU5DT1VOVEVSX0xJTktBQkxFID0gbmV3IFNldChbXG4gIFwiT2JzZXJ2YXRpb25cIixcbiAgXCJNZWRpY2F0aW9uUmVxdWVzdFwiLFxuICBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgXCJQcm9jZWR1cmVcIixcbiAgXCJDb25kaXRpb25cIixcbiAgXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbl0pO1xuXG5mdW5jdGlvbiByZXNvdXJjZURhdGUocjogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImVmZmVjdGl2ZURhdGVUaW1lXCIsXG4gICAgXCJhdXRob3JlZE9uXCIsXG4gICAgXCJwZXJmb3JtZWREYXRlVGltZVwiLFxuICAgIFwib25zZXREYXRlVGltZVwiLFxuICAgIFwicmVjb3JkZWREYXRlXCIsXG4gICAgXCJpc3N1ZWRcIixcbiAgXSkge1xuICAgIGNvbnN0IHYgPSByW2tleV07XG4gICAgaWYgKHYpIHJldHVybiBTdHJpbmcodikuc2xpY2UoMCwgMTApO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IG9mIFtcImVmZmVjdGl2ZVBlcmlvZFwiLCBcInBlcmZvcm1lZFBlcmlvZFwiXSkge1xuICAgIGNvbnN0IHBlcmlvZCA9IHJba2V5XTtcbiAgICBpZiAocGVyaW9kICYmIHR5cGVvZiBwZXJpb2QgPT09IFwib2JqZWN0XCIgJiYgcGVyaW9kLnN0YXJ0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHBlcmlvZC5zdGFydCkuc2xpY2UoMCwgMTApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gXCJcIjtcbn1cblxuZnVuY3Rpb24gcmVzb3VyY2VIb3NwaXRhbChyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgZm9yIChjb25zdCBwIG9mIHIucGVyZm9ybWVyID8/IFtdKSB7XG4gICAgY29uc3QgZCA9IChwID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgaWYgKGQpIHJldHVybiBkO1xuICB9XG4gIGNvbnN0IHJlcSA9IHIucmVxdWVzdGVyID8/IHt9O1xuICBpZiAocmVxICYmIHR5cGVvZiByZXEgPT09IFwib2JqZWN0XCIgJiYgcmVxLmRpc3BsYXkpIHJldHVybiByZXEuZGlzcGxheTtcbiAgcmV0dXJuIFwiXCI7XG59XG5cbi8qKlxuICogRHJvcCBBTUIgRW5jb3VudGVycyB3aG9zZSAoaG9zcGl0YWwsIHN0YXJ0X2RhdGUpIGlzIGFscmVhZHkgY292ZXJlZFxuICogYnkgYW4gSU1QIEVuY291bnRlcidzIGFkbWlzc2lvbiBkYXkuIE5ISSBlbWl0cyB0aGUgc2FtZSBpbnBhdGllbnRcbiAqIHN0YXkgdHdpY2UgKElIS0UzMzAzIEFNQiBiaWxsaW5nIGVudHJ5ICsgSUhLRTMzMDkgSU1QIGRldGFpbCk7IHRoZVxuICogSU1QIG9uZSBpcyBjYW5vbmljYWwsIHRoZSBBTUIgaXMgYSBiaWxsaW5nIGFydGVmYWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVkdXBBZG1pc3Npb25EYXlBbWIoXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgaW1wU3RhcnRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgIT09IFwiRW5jb3VudGVyXCIpIGNvbnRpbnVlO1xuICAgIGlmICgoci5jbGFzcyA/PyB7fSkuY29kZSAhPT0gXCJJTVBcIikgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IChyLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChyLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgIGlmIChob3NwICYmIHN0YXJ0KSBpbXBTdGFydHMuYWRkKGAke2hvc3B9ICR7c3RhcnR9YCk7XG4gIH1cbiAgaWYgKGltcFN0YXJ0cy5zaXplID09PSAwKSByZXR1cm4gcmVzb3VyY2VzO1xuICByZXR1cm4gcmVzb3VyY2VzLmZpbHRlcigocikgPT4ge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSA9PT0gXCJFbmNvdW50ZXJcIiAmJiAoci5jbGFzcyA/PyB7fSkuY29kZSA9PT0gXCJBTUJcIikge1xuICAgICAgY29uc3QgaG9zcCA9IChyLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKHIucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgICBpZiAoaW1wU3RhcnRzLmhhcyhgJHtob3NwfSAke3N0YXJ0fWApKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgYGVuY291bnRlcmAgcmVmZXJlbmNlIHRvIGVhY2ggbGlua2FibGUgcmVzb3VyY2Ugd2hlbiBpdHNcbiAqIChob3NwaXRhbCwgZGF0ZSkgbWF0Y2hlcyBleGFjdGx5IE9ORSBFbmNvdW50ZXIgaW4gYGNhbmRpZGF0ZXNgLlxuICogQ29uc2VydmF0aXZlIFx1MjAxNCBsZWF2ZXMgYW1iaWd1b3VzICgwIG9yID4xIG1hdGNoKSBjYXNlcyB1bmxpbmtlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMoXG4gIGNhbmRpZGF0ZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiB2b2lkIHtcbiAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gIGNvbnN0IGV4YWN0SW5kZXggPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KCk7XG4gIGNvbnN0IGltcEJ5SG9zcCA9IG5ldyBNYXA8c3RyaW5nLCBBcnJheTxbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+PigpO1xuXG4gIGZvciAoY29uc3QgZSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgaWYgKGUucmVzb3VyY2VUeXBlICE9PSBcIkVuY291bnRlclwiKSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gKGUuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKGUucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgaWYgKCFob3NwIHx8ICFzdGFydCkgY29udGludWU7XG4gICAgY29uc3Qga2V5ID0gYCR7aG9zcH0gJHtzdGFydH1gO1xuICAgIGNvbnN0IGFyciA9IGV4YWN0SW5kZXguZ2V0KGtleSkgPz8gW107XG4gICAgYXJyLnB1c2goZS5pZCk7XG4gICAgZXhhY3RJbmRleC5zZXQoa2V5LCBhcnIpO1xuICAgIGNvbnN0IGNscyA9IChlLmNsYXNzID8/IHt9KS5jb2RlID8/IFwiXCI7XG4gICAgaWYgKGNscyA9PT0gXCJJTVBcIikge1xuICAgICAgY29uc3QgZW5kID0gU3RyaW5nKChlLnBlcmlvZCA/PyB7fSkuZW5kID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IGltcEJ5SG9zcC5nZXQoaG9zcCkgPz8gW107XG4gICAgICAgIGxpc3QucHVzaChbc3RhcnQsIGVuZCwgZS5pZF0pO1xuICAgICAgICBpbXBCeUhvc3Auc2V0KGhvc3AsIGxpc3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChleGFjdEluZGV4LnNpemUgPT09IDAgJiYgaW1wQnlIb3NwLnNpemUgPT09IDApIHJldHVybjtcblxuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKCFFTkNPVU5URVJfTElOS0FCTEUuaGFzKHIucmVzb3VyY2VUeXBlKSkgY29udGludWU7XG4gICAgaWYgKHIuZW5jb3VudGVyIHx8IHIuY29udGV4dCkgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IHJlc291cmNlSG9zcGl0YWwocik7XG4gICAgY29uc3QgZGF0ZSA9IHJlc291cmNlRGF0ZShyKTtcbiAgICBpZiAoIWhvc3AgfHwgIWRhdGUpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1hdGNoZXM6IHN0cmluZ1tdID0gWy4uLihleGFjdEluZGV4LmdldChgJHtob3NwfSAke2RhdGV9YCkgPz8gW10pXTtcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZvciAoY29uc3QgW3N0YXJ0LCBlbmQsIGVpZF0gb2YgaW1wQnlIb3NwLmdldChob3NwKSA/PyBbXSkge1xuICAgICAgICBpZiAoc3RhcnQgPD0gZGF0ZSAmJiBkYXRlIDw9IGVuZCkgbWF0Y2hlcy5wdXNoKGVpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCAhPT0gMSkgY29udGludWU7XG4gICAgci5lbmNvdW50ZXIgPSB7IHJlZmVyZW5jZTogYEVuY291bnRlci8ke21hdGNoZXNbMF19YCB9O1xuICB9XG59XG5cbi8qKlxuICogV2hlbiBhbiBPYnNlcnZhdGlvbiBjYXJyaWVzIG11bHRpcGxlIHJlZmVyZW5jZVJhbmdlIGVudHJpZXMgdGFnZ2VkXG4gKiB3aXRoIGBhcHBsaWVzVG9bKl0uY29kaW5nLmNvZGVgIGluIHttYWxlLCBmZW1hbGV9LCBwaWNrIHRoZSBvbmUgdGhhdFxuICogbWF0Y2hlcyB0aGUgcGF0aWVudCdzIGdlbmRlciBhbmQgcmUtZGVyaXZlIGludGVycHJldGF0aW9uIGFnYWluc3QgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyhcbiAgcGF0aWVudDogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwsXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogdm9pZCB7XG4gIGlmICghcGF0aWVudCkgcmV0dXJuO1xuICBjb25zdCBnZW5kZXIgPSBTdHJpbmcocGF0aWVudC5nZW5kZXIgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGdlbmRlciAhPT0gXCJtYWxlXCIgJiYgZ2VuZGVyICE9PSBcImZlbWFsZVwiKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSAhPT0gXCJPYnNlcnZhdGlvblwiKSBjb250aW51ZTtcbiAgICBjb25zdCBycnM6IGFueVtdID0gci5yZWZlcmVuY2VSYW5nZSA/PyBbXTtcbiAgICBpZiAocnJzLmxlbmd0aCA8IDIpIGNvbnRpbnVlO1xuXG4gICAgbGV0IG1hdGNoOiBhbnkgPSBudWxsO1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgcnJzKSB7XG4gICAgICBmb3IgKGNvbnN0IGFwIG9mIGVudHJ5LmFwcGxpZXNUbyA/PyBbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgYXAuY29kaW5nID8/IFtdKSB7XG4gICAgICAgICAgaWYgKFN0cmluZyhjLmNvZGUgPz8gXCJcIikudG9Mb3dlckNhc2UoKSA9PT0gZ2VuZGVyKSB7XG4gICAgICAgICAgICBtYXRjaCA9IGVudHJ5O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaCkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAobWF0Y2gpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIW1hdGNoKSBjb250aW51ZTtcblxuICAgIHIucmVmZXJlbmNlUmFuZ2UgPSBbbWF0Y2hdO1xuICAgIGNvbnN0IHZhbFN0ciA9XG4gICAgICBTdHJpbmcoKHIudmFsdWVRdWFudGl0eSA/PyB7fSkudmFsdWUgPz8gXCJcIikgfHwgU3RyaW5nKHIudmFsdWVTdHJpbmcgPz8gXCJcIik7XG4gICAgY29uc3QgbmV3SW50ZXJwID0gZGVyaXZlSW50ZXJwcmV0YXRpb24odmFsU3RyLCByLnZhbHVlUXVhbnRpdHkgPz8gbnVsbCwgbWF0Y2gpO1xuICAgIGlmIChuZXdJbnRlcnApIHtcbiAgICAgIHIuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtuZXdJbnRlcnBdIH1dO1xuICAgIH1cbiAgfVxufVxuIiwgIi8qKlxuICogUGF0aWVudCBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL3BhdGllbnQucHlgLiBTYW1lIHB1YmxpYyBBUEk6XG4gKiAgIC0gbG9va3NMaWtlVHdOYXRpb25hbElkKHZhbHVlKSBcdTIwMTQgZXhwb3NlZCBmb3IgdGVzdHNcbiAqICAgLSBtYXBQYXRpZW50KHJhdykgXHUyMDE0IG1haW4gZW50cnlcbiAqL1xuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcblxuLy8gVGFpd2FuIG5hdGlvbmFsIElEOiAxIGxldHRlciArIDkgZGlnaXRzIChBMTIzNDU2Nzg5KS4gVXNlZCB0byBkZWNpZGVcbi8vIHdoZXRoZXIgdGhlIHBvcHVwLXN1cHBsaWVkIHBhdGllbnRfaWQgc2hvdWxkIGJlIGNvZGVkIHVuZGVyIHRoZVxuLy8gY2Fub25pY2FsIG5hdGlvbmFsLWlkIHN5c3RlbSBvciBhcyBhIGxvY2FsIGhvc3BpdGFsIE1STi5cbmNvbnN0IFRXX05BVElPTkFMX0lEX1JFID0gL15bQS1aXVsxMl1cXGR7OH0kLztcblxuZXhwb3J0IGZ1bmN0aW9uIGxvb2tzTGlrZVR3TmF0aW9uYWxJZCh2YWx1ZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBUV19OQVRJT05BTF9JRF9SRS50ZXN0KHZhbHVlLnRyaW0oKS50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFBhdGllbnQocmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IHJhd0lkID0gU3RyaW5nKHJhdy5pZGVudGlmaWVyID8/IHJhdy5pZCA/PyBcInVua25vd25cIik7XG4gIC8vIEZISVIgUGF0aWVudC5pZCBpcyB0aGUgaGFzaGVkL3NhbHRlZCBmb3JtLiBSZWFsIG5hdGlvbmFsIElEIHN0YXlzXG4gIC8vIG9ubHkgaW4gaWRlbnRpZmllcltdLnZhbHVlIHNvIGEgbGVha2VkIEJ1bmRsZSAob3IgYSBTTUFSVCBhcHAgdG9rZW5cbiAgLy8gcGF5bG9hZCBjb250YWluaW5nIHBhdGllbnRfaWQpIGRvZXNuJ3QgZGlzY2xvc2UgaXQgdmlhIGV2ZXJ5XG4gIC8vIHN1YmplY3QucmVmZXJlbmNlLlxuICBjb25zdCBwYXRpZW50SWQgPSBkZXJpdmVQYXRpZW50SWQocmF3SWQpO1xuXG4gIC8vIFVzZSBgPz9gIChub3QganVzdCBkZWZhdWx0IGFyZykgc28gZXhwbGljaXQgbnVsbCBmcm9tIHRoZSBMTE0gYWxzb1xuICAvLyBmYWxscyBiYWNrLiBMb2NhbCBtb2RlbHMgc29tZXRpbWVzIGVtaXQgbnVsbCBpbnN0ZWFkIG9mIG9taXR0aW5nLlxuICAvLyBUaGUgY2FsbGVyIGRlY2lkZXMgd2hldGhlciBgcmF3Lm5hbWVgIGlzIHRoZSB1c2VyJ3MgcmVhbCBuYW1lIG9yXG4gIC8vIGFscmVhZHktbWFza2VkIFx1MjAxNCBtYXBQYXRpZW50IGp1c3QgdHJhbnNjcmliZXMuIE1hc2tpbmcgcG9saWN5IGxpdmVzXG4gIC8vIGF0IHRoZSBVSSAvIGV4dGVuc2lvbiBsYXllciAoZHJpdmVuIGJ5IHRoZSB1c2VyLXRvZ2dsZWFibGVcbiAgLy8gYG1hc2tOYW1lRW5hYmxlZGAgc2V0dGluZykgc28gdGhlIHNhbWUgbWFwcGVyIGlzIGNvcnJlY3QgZm9yIGJvdGhcbiAgLy8gXCJcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjggPSByZWFsIG5hbWVcIiBhbmQgXCJcdTkxQUJcdTc2NDJcdTRFQkFcdTU0RTFcdTU5MUFcdTc1QzVcdTRFQkEgPSBtYXNrZWRcIiB3b3JrZmxvd3MuXG4gIGNvbnN0IG5hbWVUZXh0ID0gKHJhdy5uYW1lID8/IG51bGwpIHx8IFwiVW5rbm93blwiO1xuICBjb25zdCBwaG9uZSA9IChyYXcucGhvbmUgPz8gbnVsbCkgfHwgXCJcIjtcbiAgY29uc3QgYWRkcmVzcyA9IChyYXcuYWRkcmVzcyA/PyBudWxsKSB8fCBcIlwiO1xuXG4gIGNvbnN0IFtmYW1pbHksIGdpdmVuXSA9IHNwbGl0TmFtZShuYW1lVGV4dCk7XG4gIGNvbnN0IG5hbWVFbnRyeTogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgdXNlOiBcIm9mZmljaWFsXCIsIHRleHQ6IG5hbWVUZXh0IH07XG4gIGlmIChmYW1pbHkpIG5hbWVFbnRyeS5mYW1pbHkgPSBmYW1pbHk7XG4gIGlmIChnaXZlbi5sZW5ndGggPiAwKSBuYW1lRW50cnkuZ2l2ZW4gPSBnaXZlbjtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiUGF0aWVudFwiLFxuICAgIGlkOiBwYXRpZW50SWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgIHtcbiAgICAgICAgdXNlOiBcIm9mZmljaWFsXCIsXG4gICAgICAgIHN5c3RlbTogbG9va3NMaWtlVHdOYXRpb25hbElkKHJhd0lkKVxuICAgICAgICAgID8gc3lzdGVtcy5UV19OQVRJT05BTF9JRFxuICAgICAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfUEFUSUVOVF9NUk4sXG4gICAgICAgIHZhbHVlOiByYXdJZCxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBuYW1lOiBbbmFtZUVudHJ5XSxcbiAgICBnZW5kZXI6IG1hcEdlbmRlcihyYXcuZ2VuZGVyKSxcbiAgfTtcblxuICBjb25zdCBiaXJ0aERhdGUgPSByYXcuYmlydGhEYXRlO1xuICBpZiAoYmlydGhEYXRlKSByZXNvdXJjZS5iaXJ0aERhdGUgPSBiaXJ0aERhdGU7XG5cbiAgaWYgKHBob25lKSB7XG4gICAgcmVzb3VyY2UudGVsZWNvbSA9IFt7IHN5c3RlbTogXCJwaG9uZVwiLCB1c2U6IFwiaG9tZVwiLCB2YWx1ZTogcGhvbmUgfV07XG4gIH1cblxuICBpZiAoYWRkcmVzcykge1xuICAgIHJlc291cmNlLmFkZHJlc3MgPSBbeyB1c2U6IFwiaG9tZVwiLCB0ZXh0OiBhZGRyZXNzIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIFNwbGl0IGEgZnVsbCBuYW1lIGludG8gW2ZhbWlseSwgW2dpdmVuXV0gZm9yIEZISVIgUGF0aWVudC5uYW1lLlxuICpcbiAqIEhldXJpc3RpY3M6XG4gKiAgIC0gQ29udGFpbnMgd2hpdGVzcGFjZSBcdTIxOTIgV2VzdGVybjogbGFzdCB0b2tlbiA9IGZhbWlseSwgcmVzdCA9IGdpdmVuLlxuICogICAtIENKSyAvIHNpbmdsZS10b2tlbiBcdTIxOTIgZmlyc3QgY2hhciA9IGZhbWlseSwgcmVtYWluZGVyID0gZ2l2ZW4uXG4gKiAgIC0gXCJVbmtub3duXCIgb3IgZW1wdHkgXHUyMTkyIFtcIlwiLCBbXV1cbiAqXG4gKiBUd28tY2hhciBDSksgZmFtaWx5IG5hbWVzIChcdTZCNTBcdTk2N0QsIFx1NTNGOFx1OTlBQywgXHUyMDI2KSBhcmUgTk9UIGF1dG8tZGV0ZWN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHNwbGl0TmFtZShmdWxsTmFtZTogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nW11dIHtcbiAgY29uc3QgbmFtZSA9IChmdWxsTmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghbmFtZSB8fCBuYW1lID09PSBcIlVua25vd25cIikgcmV0dXJuIFtcIlwiLCBbXV07XG4gIGlmICgvXFxzLy50ZXN0KG5hbWUpKSB7XG4gICAgY29uc3QgcGFydHMgPSBuYW1lLnNwbGl0KC9cXHMrLyk7XG4gICAgcmV0dXJuIFtwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSEsIHBhcnRzLnNsaWNlKDAsIC0xKV07XG4gIH1cbiAgLy8gQ0pLIGZhbGxiYWNrIFx1MjAxNCBpdGVyYXRlIGNvZGVwb2ludHMsIG5vdCBVVEYtMTYgY29kZSB1bml0cywgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyAocmFyZSBpbiBDaGluZXNlIG5hbWVzIGJ1dCBwb3NzaWJsZSlcbiAgLy8gZG9uJ3QgZ2V0IHNwbGl0IG1pZC1jaGFyYWN0ZXIuXG4gIGNvbnN0IGNvZGVwb2ludHMgPSBBcnJheS5mcm9tKG5hbWUpO1xuICByZXR1cm4gY29kZXBvaW50cy5sZW5ndGggPiAxID8gW2NvZGVwb2ludHNbMF0hLCBbY29kZXBvaW50cy5zbGljZSgxKS5qb2luKFwiXCIpXV0gOiBbbmFtZSwgW11dO1xufVxuXG5mdW5jdGlvbiBtYXBHZW5kZXIoZ2VuZGVyOiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgZyA9IHR5cGVvZiBnZW5kZXIgPT09IFwic3RyaW5nXCIgPyBnZW5kZXIudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChbXCJtYWxlXCIsIFwibVwiLCBcIlx1NzUzN1wiLCBcIlx1NzUzN1x1NjAyN1wiXS5pbmNsdWRlcyhnKSkgcmV0dXJuIFwibWFsZVwiO1xuICBpZiAoW1wiZmVtYWxlXCIsIFwiZlwiLCBcIlx1NTk3M1wiLCBcIlx1NTk3M1x1NjAyN1wiXS5pbmNsdWRlcyhnKSkgcmV0dXJuIFwiZmVtYWxlXCI7XG4gIHJldHVybiBcInVua25vd25cIjtcbn1cbiIsICIvLyBTZXJ2aWNlIHdvcmtlciBmb3IgTkhJLUZISVIgQnJpZGdlIFx1MjAxNCBvd25zIHRoZSBsb25nLXJ1bm5pbmdcbi8vIFwiU3luYyBUaGlzIFBhdGllbnRcIiB3b3JrZmxvdyBzbyB0aGUgcG9wdXAgY2FuIGNsb3NlIG1pZC1zeW5jIHdpdGhvdXRcbi8vIGFib3J0aW5nIGl0LlxuLy9cbi8vIExpZmVjeWNsZTpcbi8vICAgLSBwb3B1cCBwb3N0cyB7dHlwZTogXCJzdGFydE5oaUFwaVN5bmNcIiwgcGF5bG9hZH0gIFx1MjE5MiBOSEkgSlNPTi1BUEkgc3luY1xuLy8gICAtIGJhY2tncm91bmQgcnVucyB0aGUgZnVsbCBzeW5jIHNlcXVlbmNlLCB1cGRhdGluZyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gICAtIHBvcHVwIHJlYWRzIGNocm9tZS5zdG9yYWdlLmxvY2FsIG9uIHJlb3BlbiB0byBzaG93IHByb2dyZXNzXG4vL1xuLy8gTW9kZXM6XG4vLyAgIC0gXCJsb2NhbFwiICAgXHUyMTkyIGFmdGVyIE5ISSBmZXRjaCwgcnVuIG1hcHBlcnMgaW4tZXh0ZW5zaW9uLCBkb3dubG9hZCBhXG4vLyAgICAgICAgICAgICAgICAgRkhJUiBCdW5kbGUgdG8gdGhlIHVzZXIncyBtYWNoaW5lLiBObyBiYWNrZW5kIHJlcXVpcmVkLlxuLy8gICAtIFwiYmFja2VuZFwiIFx1MjE5MiBQT1NUIHBlci1wYWdlX3R5cGUgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRcbi8vICAgICAgICAgICAgICAgICAoZXhpc3RpbmcgYmVoYXZpb3VyKTsgZGFzaGJvYXJkICsgU01BUlQgYXBwIHVzZSB0aGVcbi8vICAgICAgICAgICAgICAgICBiYWNrZW5kJ3MgRkhJUiBzdG9yZS5cblxuaW1wb3J0IHtcbiAgR1JPVVBfSEFORExFUlMsXG4gIExJU1RfSEFORExFUlMsXG4gIGRlZHVwQWRtaXNzaW9uRGF5QW1iLFxuICBkZXJpdmVQYXRpZW50SWQsXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMsXG4gIG1hcFBhdGllbnQsXG4gIG1hc2tJZCxcbiAgbWFza05hbWUsXG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzLFxufSBmcm9tIFwiQG5oaS1maGlyLWJyaWRnZS9tYXBwZXJcIjtcblxuY29uc3QgU1RPUkFHRV9LRVkgPSBcInN5bmNTdGF0dXNcIjtcbmNvbnN0IHNsZWVwID0gKG1zKSA9PiBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBtcykpO1xuXG4vLyBDYW5jZWxsYXRpb24gZmxhZyBzZXQgYnkgcG9wdXAncyBzdG9wIGJ1dHRvbi4gQ2hlY2tlZCBhdCBzdHJhdGVnaWMgcG9pbnRzXG4vLyBpbiBydW5OaGlBcGlTeW5jIChiZXR3ZWVuIHBoYXNlcywgYmVmb3JlIGVhY2ggZGV0YWlsIHBhZ2UpIHNvIHRoZVxuLy8gaW4tcHJvZ3Jlc3Mgc3luYyBleGl0cyBwcm9tcHRseSB3aGVuIHRoZSB1c2VyIGhpdHMgU3RvcC4gQ2xlYXJlZCBhdCB0aGVcbi8vIHN0YXJ0IG9mIGVhY2ggbmV3IHN5bmMgcnVuLlxubGV0IF9jYW5jZWxsZWQgPSBmYWxzZTtcbi8vIENvbnRleHQgZm9yIHRoZSBpbi1mbGlnaHQgc3luYyBzbyB0aGUgc3RvcFN5bmMgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4vLyBkYXRhIHdpdGhvdXQgdGhlIHBvcHVwIG5lZWRpbmcgdG8gcGFzcyBpdCBiYWNrLiBTZXQgYXQgdGhlIHRvcCBvZlxuLy8gcnVuTmhpQXBpU3luYzsgY2xlYXJlZCBvbiBjb21wbGV0aW9uIChzdWNjZXNzL2ZhaWx1cmUvY2FuY2VsKS5cbmxldCBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG5jb25zdCBDQU5DRUxfRVJST1IgPSBcIl9fU1lOQ19DQU5DRUxMRURfX1wiO1xuLy8gVGhyb3duIHdoZW4gTkhJIGRldGVjdHMgdGhlIHNlc3Npb24gaGFzIGV4cGlyZWQgKGxvZ2luIHBhZ2UgcmVuZGVyZWQsIG9yXG4vLyB0YWIgcmVkaXJlY3RlZCB0byBhdXRoIG5hbWVzcGFjZSkuIEFib3J0cyBzeW5jIGltbWVkaWF0ZWx5IHNvIHRoZSB1c2VyIGNhblxuLy8gcmUtbG9naW4gYW5kIHJldHJ5IGluc3RlYWQgb2YgdGltaW5nIG91dCBvbiBldmVyeSByZW1haW5pbmcgcGFnZS5cbmNvbnN0IFNFU1NJT05fRVhQSVJFRF9FUlJPUiA9IFwiX19TRVNTSU9OX0VYUElSRURfX1wiO1xuLy8gRXJyb3JzIHRoYXQgc2hvdWxkIGFib3J0IHRoZSBlbnRpcmUgc3luYyBpbnN0ZWFkIG9mIGJlaW5nIHN3YWxsb3dlZFxuLy8gcGVyLXBoYXNlLlxuY29uc3QgQUJPUlRfRVJST1JTID0gbmV3IFNldChbQ0FOQ0VMX0VSUk9SLCBTRVNTSU9OX0VYUElSRURfRVJST1JdKTtcbmZ1bmN0aW9uIGNoZWNrQ2FuY2VsKCkge1xuICBpZiAoX2NhbmNlbGxlZCkgdGhyb3cgbmV3IEVycm9yKENBTkNFTF9FUlJPUik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldFN0YXR1cyhwYXJ0aWFsKSB7XG4gIC8vIEFmdGVyIGNhbmNlbGxhdGlvbiwgdGhlIHBvcHVwIGhhcyBhbHJlYWR5IHdyaXR0ZW4gdGhlIGRlZmluaXRpdmVcbiAgLy8gXCJzdG9wcGVkXCIgc3RhdHVzIFx1MjAxNCBzaWxlbmNlIGFueSBmdXJ0aGVyIHByb2dyZXNzIHdyaXRlcyBmcm9tIHRoZVxuICAvLyBpbi1mbGlnaHQgc3luYyBjb2RlIHNvIHRoZSBVSSBkb2Vzbid0IGJvdW5jZSB3aGlsZSBpdCB1bndpbmRzLlxuICBpZiAoX2NhbmNlbGxlZCkgcmV0dXJuO1xuICBjb25zdCBwcmV2ID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkpW1NUT1JBR0VfS0VZXSB8fCB7fTtcbiAgY29uc3QgbmV4dCA9IHsgLi4ucHJldiwgLi4ucGFydGlhbCwgdHM6IERhdGUubm93KCkgfTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgW1NUT1JBR0VfS0VZXTogbmV4dCB9KTtcbiAgLy8gQnJvYWRjYXN0IHRvIGFueSBvcGVuIHBvcHVwLiBJZiBubyBsaXN0ZW5lciAocG9wdXAgY2xvc2VkKSxcbiAgLy8gc2VuZE1lc3NhZ2UgcmVqZWN0cyBcdTIwMTQgc3dhbGxvdy5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcInN5bmNQcm9ncmVzc1wiLCBzdGF0dXM6IG5leHQgfSkuY2F0Y2goKCkgPT4ge30pO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTkhJIEFQSS1kaXJlY3Qgc3luYyAocGFyYWxsZWwsIG5vIExMTSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gSW5zdGVhZCBvZiBuYXZpZ2F0aW5nIHRoZSB1c2VyJ3MgdGFiIHRvIGVhY2ggTkhJIHBhZ2UsIHdhaXRpbmcgZm9yIFZ1ZSB0b1xuLy8gcmVuZGVyLCBjYXB0dXJpbmcgSFRNTCwgdGhlbiBzZW5kaW5nIGl0IHRocm91Z2ggTExNIGV4dHJhY3Rpb24sIHdlIGNhbGxcbi8vIE5ISSdzIHVuZGVybHlpbmcgSlNPTiBBUEkgZW5kcG9pbnRzIGRpcmVjdGx5LiBUaGUgXHU1MDY1XHU0RkREXHU3RjcyIFNQQSBmcm9udHMgYSBzZXRcbi8vIG9mIFJFU1QgZW5kcG9pbnRzIHVuZGVyIC9hcGkvaWhrZTMwMDAvPHBhZ2U+LyogdGhhdCByZXR1cm4gd2VsbC1mb3JtZWRcbi8vIEpTT047IGNhbGxpbmcgdGhlbSBpbiBwYXJhbGxlbCBjdXRzIGEgNS0xMCBtaW51dGUgc3luYyB0byB+MTAgc2Vjb25kcyBhbmRcbi8vIHJlbW92ZXMgdGhlIExMTSBjb3N0IGVudGlyZWx5LlxuXG5jb25zdCBOSElfSE9TVCA9IFwibXloZWFsdGhiYW5rLm5oaS5nb3YudHdcIjtcblxuLy8gQ29udmVydCBOSEkncyBcdTZDMTFcdTU3MEIgZGF0ZSBcIjExNS8wNS8wNVwiIFx1MjE5MiBJU08gXCIyMDI2LTA1LTA1XCIuXG4vLyBTb21lIE5ISSBmaWVsZHMgZW1iZWQgYm90aCBST0MgYW5kIEdyZWdvcmlhbjogXCIxMTUvMDUvMDV8fDIwMjYvMDUvMDVcIiBcdTIwMTQgd2Vcbi8vIGp1c3QgbWF0Y2ggdGhlIGZpcnN0IHNlZ21lbnQuXG5mdW5jdGlvbiByb2NUb0lTTyhyb2NEYXRlKSB7XG4gIGlmICghcm9jRGF0ZSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IG0gPSBTdHJpbmcocm9jRGF0ZSkubWF0Y2goL14oXFxkezIsM30pWy8uLV0oXFxkezEsMn0pWy8uLV0oXFxkezEsMn0pLyk7XG4gIGlmICghbSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHkgPSBwYXJzZUludChtWzFdLCAxMCkgKyAxOTExO1xuICByZXR1cm4gYCR7eX0tJHttWzJdLnBhZFN0YXJ0KDIsIFwiMFwiKX0tJHttWzNdLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xufVxuXG4vLyBJbnZlcnNlOiBJU08gXCIyMDIzLTA1LTA1XCIgXHUyMTkyIFJPQyBcIjExMi8wNS8wNVwiLiBVc2VkIHRvIGJ1aWxkIE5ISSBkYXRlLXJhbmdlXG4vLyBxdWVyeSBzdHJpbmdzICh0aGVpciBmb3JtcyBleHBlY3QgXHU2QzExXHU1NzBCIGZvcm1hdCkuXG5mdW5jdGlvbiBpc29Ub1JPQyhpc29EYXRlKSB7XG4gIGlmICghaXNvRGF0ZSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IG0gPSBTdHJpbmcoaXNvRGF0ZSkubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSkvKTtcbiAgaWYgKCFtKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgeSA9IHBhcnNlSW50KG1bMV0sIDEwKSAtIDE5MTE7XG4gIGlmICh5IDwgMSkgcmV0dXJuIFwiXCI7IC8vIHByZS1cdTZDMTFcdTU3MEIgZGF0ZXMgbWFrZSBubyBzZW5zZSB0byBOSElcbiAgcmV0dXJuIGAke3l9LyR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LyR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gTkhJIGJpbGluZ3VhbCBmaWVsZHMgdXNlIFwiXHU0RTJEXHU2NTg3fHxFbmdsaXNoXCIgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZhc3Rlcixcbi8vIHNvIHByZWZlciB0aGF0IHNpZGUuIElmIHRoZXJlJ3Mgbm8gYHx8YCB3ZSBqdXN0IHJldHVybiB0aGUgaW5wdXQgdHJpbW1lZC5cbmZ1bmN0aW9uIHBpY2tFbmdsaXNoKHMpIHtcbiAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc3RyID0gU3RyaW5nKHMpO1xuICBjb25zdCBpZHggPSBzdHIuaW5kZXhPZihcInx8XCIpO1xuICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuIHN0ci50cmltKCk7XG4gIGNvbnN0IGVuID0gc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKTtcbiAgcmV0dXJuIGVuIHx8IHN0ci5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbn1cblxuLy8gQWRhcHRlciBmb3IgTkhJIGxhYi9vYnNlcnZhdGlvbiBKU09OIHNoYXBlIChjb25maXJtZWQgZm9yIElIS0UzNDA5UzAxO1xuLy8gb3RoZXIgbGFiIGVuZHBvaW50cyBsaWtlbHkgdXNlIHRoZSBzYW1lIGZpZWxkcykuXG5mdW5jdGlvbiBhZGFwdExhYkl0ZW0oaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUpO1xuICBjb25zdCB2YWx1ZSA9IGl0ZW0uYXNzYVlfVkFMVUU7XG4gIGlmICghZGF0ZSB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgLy8gSU1QT1JUQU5UOiBgb3JkZXJfc2hvcnRuYW1lYCBpcyBOSEkncyBVSS10cnVuY2F0ZWQgbGFiZWwgKH4xNSBjaGFyc1xuICAvLyArIFwiIC4uLlwiKSwgc3VpdGFibGUgZm9yIHRoZWlyIGxvbmctdGFibGUgZGlzcGxheSBidXQgTk9UIGZvciBGSElSXG4gIC8vIE9ic2VydmF0aW9uLmNvZGUudGV4dCBcdTIwMTQgZG93bnN0cmVhbSBTTUFSVCBhcHBzIGVuZCB1cCBzaG93aW5nIGhhbGZcbiAgLy8gbmFtZXMgbGlrZSBcIlBDIFN1Z2FyIFx1OThFRlx1NUY4QyAuLi5cIiB3aXRoIG5vIGZpZWxkIHRvIHJlY292ZXIgdGhlIGZ1bGxcbiAgLy8gbmFtZSBmcm9tLiBBbHdheXMgcHJlZmVyIGBhc3NhWV9JVEVNX05BTUVgICh0aGUgZnVsbCBpdGVtIG5hbWUsXG4gIC8vIHR5cGljYWxseSBiaWxpbmd1YWwgbGlrZSBcIlBDIFN1Z2FyIFx1OThFRlx1NUY4Q1x1NTE2OVx1NUMwRlx1NjY0Mlx1ODg0MFx1N0NENlwiKSBhbmQgb25seSBmYWxsXG4gIC8vIGJhY2sgdG8gdGhlIHNob3J0bmFtZSB3aGVuIHRoZSBmdWxsIG5hbWUgaXMgZ2VudWluZWx5IGFic2VudC5cbiAgLy8gU2FtZSBwcmlvcml0eSBhcHBsaWVkIHRvIGBjb2RlYCBhbmQgYGRpc3BsYXlgIHNvIGJvdGhcbiAgLy8gT2JzZXJ2YXRpb24uY29kZS50ZXh0IGFuZCBjb2RpbmdbXS5kaXNwbGF5IGNhcnJ5IHRoZSBmdWxsIGxhYmVsLlxuICBjb25zdCBmdWxsTmFtZSA9IGl0ZW0uYXNzYVlfSVRFTV9OQU1FIHx8IGl0ZW0ub3JkZXJfc2hvcnRuYW1lIHx8IFwiXCI7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBvcmRlcl9jb2RlOiBpdGVtLm9yZGVSX0NPREUgfHwgXCJcIixcbiAgICBvcmRlcl9uYW1lOiBpdGVtLm9yZGVSX05BTUUgfHwgXCJcIixcbiAgICBjb2RlOiBmdWxsTmFtZSxcbiAgICBkaXNwbGF5OiBmdWxsTmFtZSxcbiAgICB2YWx1ZTogU3RyaW5nKHZhbHVlKSxcbiAgICB1bml0OiBpdGVtLnVuaVRfREFUQSB8fCBcIlwiLFxuICAgIHJlZmVyZW5jZV9yYW5nZTogaXRlbS5jb25zdWxUX1ZBTFVFIHx8IGl0ZW0uc2hvcnRfQ09OU1VMVF9WQUxVRSB8fCBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwNlMwMSByZXR1cm5zIHZpc2l0LWxldmVsIHJvd3MgT05MWSAobm8gZHJ1ZyBuYW1lcykuIFRoZSBhY3R1YWwgZHJ1Z1xuLy8gbGlzdCBsaXZlcyBhdCBJSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD08cm93X0lEPiZjdHlwZT0yLCBpblxuLy8gYGloa2UzMzA2UzAyX21haW5fZGF0YVsqXS5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3RgLiBXZSBkbyB0aGF0IDItc3RlcFxuLy8gZmV0Y2ggc2VwYXJhdGVseTsgdGhpcyBmdW5jdGlvbiBhZGFwdHMgYSBzaW5nbGUgZHJ1ZyBlbnRyeSBnaXZlbiBpdHNcbi8vIHBhcmVudCB2aXNpdCBjb250ZXh0LlxuZnVuY3Rpb24gYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbChkcnVnLCB2aXNpdCkge1xuICBpZiAoIWRydWcgfHwgdHlwZW9mIGRydWcgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICAvLyB2aXNpdC5mdW5jX0RBVEUgaXMgXCIxMTUvMDUvMDV8fDIwMjYvMDUvMDVcIiBcdTIwMTQgcm9jVG9JU08gbWF0Y2hlcyB0aGUgUk9DXG4gIC8vIHByZWZpeCBjb3JyZWN0bHkuXG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyh2aXNpdD8uZnVuY19EQVRFIHx8IHZpc2l0Py5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIGNvbnN0IGRydWdfbmFtZSA9IHBpY2tFbmdsaXNoKGRydWcuZHJ1Z19uYW1lIHx8IGRydWcuZHJ1R19OQU1FIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUgfHwgIWRydWdfbmFtZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRheXMgPSBOdW1iZXIoZHJ1Zy5vcmRlcl9kcnVnX2RheSB8fCBkcnVnLm9yZGVyX0RSVUdfREFZIHx8IDApO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgZHJ1Z19uYW1lLFxuICAgIGNvZGU6IGRydWcub3JkZXJfY29kZSB8fCBkcnVnLm9yZGVSX0NPREUgfHwgXCJcIixcbiAgICAvLyBMaXN0IGVuZHBvaW50IGRvZXNuJ3QgZXhwb3NlIGRvc2UvZnJlcXVlbmN5L3JvdXRlIFx1MjAxNCBvbmx5IGRheXMgKyBxdHkuXG4gICAgZG9zZTogXCJcIixcbiAgICBmcmVxdWVuY3k6IFwiXCIsXG4gICAgcm91dGU6IFwiXCIsXG4gICAgcXVhbnRpdHk6IGRydWcub3JkZXJfcXR5IHx8IGRydWcub3JkZXJfUVRZIHx8IFwiXCIsXG4gICAgZHVyYXRpb25fZGF5czogTnVtYmVyLmlzRmluaXRlKGRheXMpID8gZGF5cyA6IDAsXG4gICAgLy8gcGlja0VuZ2xpc2ggb24gaWNkX25hbWUgdHVybnMgXHU4MjZGXHU2MDI3XHU2NTFEXHU4Qjc3XHU4MTdBLi4ufHxCZW5pZ24gcHJvc3RhdGljLi4uIGludG8gdGhlIEVOIHNpZGUuXG4gICAgaW5kaWNhdGlvbjogcGlja0VuZ2xpc2godmlzaXQ/LmljZDljbV9DT0RFX0NOQU1FIHx8IHZpc2l0Py5pY2Q5Y21fbmFtZSB8fCBcIlwiKSxcbiAgICBpbmRpY2F0aW9uX2NvZGU6IHZpc2l0Py5pY2Q5Y21fQ09ERSB8fCB2aXNpdD8uaWNkOWNtX2NvZGUgfHwgXCJcIixcbiAgICBkcnVnX2NsYXNzOiBwaWNrRW5nbGlzaChkcnVnLmFjdCB8fCBcIlwiKSxcbiAgICBob3NwaXRhbDogdmlzaXQ/Lmhvc3BfQUJCUiB8fCB2aXNpdD8uaG9zcF9hYmJyIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIFN0dWIga2VwdCBmb3IgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5IFx1MjAxNCBJSEtFMzMwNlMwMSBsaXN0IG5ldmVyIGhhcyBkcnVncyxcbi8vIHNvIHdlIGFsd2F5cyByZXR1cm4gbnVsbCBhbmQgcmVseSBvbiB0aGUgMi1zdGVwIGRldGFpbCBmZXRjaCBhYm92ZS5cbmZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbigpIHsgcmV0dXJuIG51bGw7IH1cblxuLy8gSUhLRTM0MDJTMDEgKFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NVx1N0Q1MFx1Njc5QykgXHUyMDE0IG9uZSByb3cgcGVyIHNjcmVlbmluZyBldmVudCwgZmxhdFxuLy8gc2NoZW1hLiBOSEkgcnVucyB0aGUgcGFuZWwgaXRzZWxmIGFuZCByZXR1cm5zIHZpdGFscyArIGEgZml4ZWRcbi8vIGJhdHRlcnkgb2YgbGFiIHZhbHVlcyBwcmUtY29tcHV0ZWQgKEJNSSAvIHdhaXN0IC8gQlAgLyBsaXBpZHMgLyBMRlRcbi8vIC8gUkZUIC8gZmFzdGluZyBnbHVjb3NlIC8gSEJzQWcgLyBBbnRpLUhDViAvIHVyaWMgYWNpZCBcdTIwMjYpLlxuLy8gV2UgdW5mb2xkIG9uZSByb3cgaW50byB+MTUgT2JzZXJ2YXRpb25zOiB2aXRhbHMgZ28gdG8gY2F0ZWdvcnlcbi8vIHZpdGFsLXNpZ25zIChzbyBTTUFSVCBhcHBzJyB2aXRhbHMgdmlld3MgcGljayB0aGVtIHVwKSwgbGFicyBnbyB0b1xuLy8gY2F0ZWdvcnkgbGFib3JhdG9yeS4gUmV0dXJucyBhbiBBUlJBWSBcdTIwMTQgY2FsbGVyIG11c3QgZmxhdC1tYXAuXG5mdW5jdGlvbiBhZGFwdEFkdWx0UHJldmVudGl2ZShyb3cpIHtcbiAgaWYgKCFyb3cgfHwgdHlwZW9mIHJvdyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhyb3cuZmlyc1RfRElBR19EQVRFIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUpIHJldHVybiBudWxsO1xuICBjb25zdCBob3NwaXRhbCA9IHJvdy5ob3NQX0FCQlIgfHwgcm93Lmhvc3BfQUJCUiB8fCBcIlwiO1xuICBjb25zdCBvdXQgPSBbXTtcbiAgLy8gKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIE5ISSBjb2RlKVxuICBmdW5jdGlvbiBwdXNoKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIGNvZGUpIHtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGNvbnN0IHYgPSBTdHJpbmcodmFsdWUpLnRyaW0oKTtcbiAgICBpZiAodiA9PT0gXCJcIiB8fCB2ID09PSBcIi1cIiB8fCB2ID09PSBcIlx1MjAxNFwiKSByZXR1cm47XG4gICAgb3V0LnB1c2goe1xuICAgICAgZGF0ZSxcbiAgICAgIGhvc3BpdGFsLFxuICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5IHx8IFwibGFib3JhdG9yeVwiLFxuICAgICAgb3JkZXJfY29kZTogY29kZSB8fCBcIlwiLFxuICAgICAgb3JkZXJfbmFtZTogZGlzcGxheSxcbiAgICAgIGNvZGU6IGNvZGUgfHwgZGlzcGxheSxcbiAgICAgIGRpc3BsYXksXG4gICAgICB2YWx1ZTogdixcbiAgICAgIHVuaXQ6IHVuaXQgfHwgXCJcIixcbiAgICAgIHJlZmVyZW5jZV9yYW5nZTogcmVmUmFuZ2UgfHwgXCJcIixcbiAgICB9KTtcbiAgfVxuICAvLyBWaXRhbCBzaWduc1xuICBwdXNoKFwiQm9keSBIZWlnaHRcIiwgcm93LmhlaWdodCwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQm9keSBXZWlnaHRcIiwgcm93LndlaWdodCwgXCJrZ1wiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiQk1JXCIsIHJvdy5ibWksIFwia2cvbTJcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIldhaXN0IENpcmN1bWZlcmVuY2VcIiwgcm93LndhaXN0bGluZSwgXCJjbVwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiU3lzdG9saWMgQmxvb2QgUHJlc3N1cmVcIiwgcm93LmJhc0VfU0JQLCBcIm1tSGdcIixcbiAgICAgICByb3cuYmxvRF9QUkVTU19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiRGlhc3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX0VCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgLy8gTGlwaWQgcGFuZWxcbiAgcHVzaChcIkNob2xlc3Rlcm9sXCIsICAgcm93LmNobywgICAgIFwibWcvZExcIik7XG4gIHB1c2goXCJUcmlnbHljZXJpZGVcIiwgIHJvdy5ibG9EX1RHLCBcIm1nL2RMXCIpO1xuICBwdXNoKFwiSERMXCIsICAgICAgICAgICByb3cuaGRsLCAgICAgXCJtZy9kTFwiKTtcbiAgcHVzaChcIkxETFwiLCAgICAgICAgICAgcm93LmxkbCwgICAgIFwibWcvZExcIik7XG4gIC8vIExpdmVyIGZ1bmN0aW9uXG4gIHB1c2goXCJTR09UIChBU1QpXCIsICAgIHJvdy5zZ290LCAgICBcIlUvTFwiLCByb3cubEZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiKTtcbiAgcHVzaChcIlNHUFQgKEFMVClcIiwgICAgcm93LnNncHQsICAgIFwiVS9MXCIsIHJvdy5sRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICAvLyBGYXN0aW5nIGdsdWNvc2UgXHUyMDE0IE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgMDkwMDVDXG4gIHB1c2goXCJHbHUtQUNcIiwgICAgICAgIHJvdy5zXzA5MDA1QywgXCJtZy9kTFwiLFxuICAgICAgIHJvdy5zXzA5MDA1Q19ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDA1Q1wiKTtcbiAgLy8gUmVuYWwgZnVuY3Rpb25cbiAgcHVzaChcIkJVTlwiLCAgICAgICAgICAgcm93LnVyaW5FX0JVTiwgICBcIm1nL2RMXCIpO1xuICBwdXNoKFwiQ3JlYXRpbmluZVwiLCAgICByb3cuYmxvRF9DUkVBVCwgIFwibWcvZExcIik7XG4gIHB1c2goXCJlR0ZSXCIsICAgICAgICAgIHJvdy5lZ2ZyLCAgICAgICAgXCJtTC9taW4vMS43M20yXCIsXG4gICAgICAgcm93LnJGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIHB1c2goXCJVcmluZSBQcm90ZWluXCIsIHJvdy51cmluRV9QUk9URUlOLCBcIlwiLFxuICAgICAgIHJvdy51cmluRV9QUk9URUlOX1RFWFQgfHwgXCJcIik7XG4gIC8vIEhlcGF0aXRpcyBCL0Mgc2NyZWVuaW5nXG4gIHB1c2goXCJIQnNBZ1wiLCAgICAgICAgIHJvdy5oYnNhZywgICAgICAgXCJcIiwgcm93Lmhic2FHX1RFWFQgfHwgXCJcIik7XG4gIHB1c2goXCJBbnRpLUhDVlwiLCAgICAgIHJvdy5hbnRJX0hDViwgICAgXCJcIiwgcm93LmFudElfSENWX1RFWFQgfHwgXCJcIik7XG4gIC8vIFVyaWMgYWNpZCBcdTIwMTQgbm90ZTogTkhJJ3MgSUhLRTM0MDIgc2NoZW1hIGFsc28gaGFzIGEgZmllbGQgY2FsbGVkXG4gIC8vIGB1cmluRV9VQV9ESUFHX0FDSURgIHRoYXQgTE9PS1MgbGlrZSB1cmluZSBVQSBidXQgdGhlIHZhbHVlcyBhcmVcbiAgLy8gaWRlbnRpY2FsIHRvIGB1cmlDX0FDSURgIChzZXJ1bSwgbWcvZEwpLiBJdCdzIGEgbWlzbmFtZWQgZHVwbGljYXRlXG4gIC8vIHdlIGRlbGliZXJhdGVseSBza2lwIFx1MjAxNCB1c2luZyBib3RoIHdvdWxkIGNyZWF0ZSB0d28gRkhJUlxuICAvLyBPYnNlcnZhdGlvbnMgd2l0aCB0aGUgc2FtZSB2YWx1ZSBidXQgY29udHJhZGljdG9yeSBzcGVjaW1lbnMuXG4gIHB1c2goXCJVcmljIEFjaWRcIiwgICAgIHJvdy51cmlDX0FDSUQsICAgXCJtZy9kTFwiKTtcbiAgLy8gVXJpbmUgVUEgKHF1YWxpdGF0aXZlIHVyaW5lIGRpcHN0aWNrIHRlc3QgXHUyMDE0IGRpc3RpbmN0IGZyb20gdGhlXG4gIC8vIG1pc2xhYmVsZWQgdXJpbkVfVUFfRElBR19BQ0lEIGFib3ZlOyB0aGlzIGB1cmluRV9VQWAgaXMgdGhlIHJlYWxcbiAgLy8gdXJpbmUgVUEgcmVzdWx0LCB1c3VhbGx5IGEgKy8tIHN0cmluZyBvciBlbXB0eSB3aGVuIG5vdCBydW4pLlxuICBwdXNoKFwiVXJpbmUgVUFcIiwgICAgICByb3cudXJpbkVfVUEsICAgIFwiXCIsXG4gICAgICAgcm93LnVyaW5FX1VBX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIC8vIE1ldGFib2xpYyBzeW5kcm9tZSBzY3JlZW5pbmcgXHUyMDE0IHZhbHVlIGlzIGFuIGludGVycHJldGF0aW9uIHN0cmluZ1xuICAvLyAoJ1x1NkI2M1x1NUUzOCcgLyAnXHU3NTcwXHU1RTM4XHVGRjBDXHU1RUZBXHU4QjcwXHVGRjFBXHU4QUNCXHU2RDNEXHU4QTYyXHU5MUFCXHU1RTJCJyksIG5vdCBhIG51bWJlci4gVGhlIG1hcHBlcidzXG4gIC8vIF90cnlfcGFyc2VfcXVhbnRpdHkgd2lsbCByZXR1cm4gTm9uZSBhbmQgaXQgZmFsbHMgdGhyb3VnaCB0b1xuICAvLyB2YWx1ZVN0cmluZy4gTm8gbWFwcGVkIExPSU5DIGtleXdvcmQgKHlldCkgc28gdGhpcyBsYW5kcyBhcyBhblxuICAvLyBPYnNlcnZhdGlvbiB3aXRoIGNvZGUudGV4dCBvbmx5OyBkb3duc3RyZWFtIGNvbnN1bWVycyBjYW4gc3RpbGxcbiAgLy8gc3VyZmFjZSBpdCB1bmRlciB0aGUgcGF0aWVudCdzIHNjcmVlbmluZyBzZWN0aW9uIGJ5IGNvZGUudGV4dC5cbiAgcHVzaChcIlx1NEVFM1x1OEIxRFx1NzVDN1x1NTAxOVx1N0ZBNFx1N0JFOVx1NkFBMiAoTWV0YWJvbGljIFN5bmRyb21lIFNjcmVlbmluZylcIixcbiAgICAgICByb3cubWV0QV9TWU5EUl9SRVNVTFRfVEVYVCwgXCJcIiwgXCJcIik7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8vIElIS0UzMzA5UzAxIChcdTRGNEZcdTk2NjIgaW5wYXRpZW50IGxpc3QpIFx1MjAxNCBnaXZlcyBwcm9wZXIgYWRtaXNzaW9uL2Rpc2NoYXJnZS5cbi8vIFNoYXBlOiB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgaW5fREFURSwgb3V0X0RBVEUsXG4vLyAgICAgICAgIGljZDljbV9DT0RFLCBpY2Q5Y21fQ09ERV9DTkFNRSwgb3JpX1RZUEUoXCIzXCIpLCByb3dfSUQsIC4uLn1cbi8vIElIS0UzMzA4UzAxIGhhcyB0aGUgc2FtZSBzaGFwZSBmb3IgYSBzbWFsbCBzZXQgb2Ygb2xkZXIgXHU0RjRGXHU5NjYyIHJlY29yZHM7XG4vLyBgZnVuY19EQVRFYCBpbnN0ZWFkIG9mIGBpbl9EQVRFYCBpbiBzb21lIHJvd3MgXHUyMDE0IGFkYXB0ZXIgYWNjZXB0cyBib3RoLlxuZnVuY3Rpb24gYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBzdGFydCA9IHJvY1RvSVNPKGl0ZW0uaW5fREFURSB8fCBpdGVtLmZ1bmNfREFURSB8fCBcIlwiKTtcbiAgY29uc3QgZW5kID0gcm9jVG9JU08oaXRlbS5vdXRfREFURSB8fCBcIlwiKTtcbiAgaWYgKCFzdGFydCkgcmV0dXJuIG51bGw7XG4gIC8vIGljZDljbSBuYW1lIG9uIFx1NEY0Rlx1OTY2MiBsaXN0IGlzIGp1c3QgQ2hpbmVzZSAobm8gfHwgRW5nbGlzaCBzcGxpdCBvYnNlcnZlZCkuXG4gIGNvbnN0IGljZENvZGUgPSBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgaWNkTmFtZSA9IHBpY2tFbmdsaXNoKGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fbmFtZSB8fCBcIlwiKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlOiBzdGFydCxcbiAgICBlbmRfZGF0ZTogZW5kLFxuICAgIGNsYXNzOiBcIklNUFwiLFxuICAgIHR5cGVfZGlzcGxheTogXCJcdTRGNEZcdTk2NjJcIixcbiAgICBkZXBhcnRtZW50OiBcIlwiLFxuICAgIHByb3ZpZGVyOiBcIlwiLFxuICAgIHJlYXNvbjogaWNkTmFtZSA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lfWAgOiBpY2ROYW1lKSA6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgcm93X2lkOiBpdGVtLnJvd19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwM1MwMSAoXHU5MUFCXHU3NjQyXHU4Q0JCXHU3NTI4XHU3NTMzXHU1ODMxKSBpdGVtIHNoYXBlIFx1MjAxNCBmYXIgbW9yZSBjb21wbGV0ZSB0aGFuIHRoZSBvbGRlclxuLy8gSUhLRTMzMDFTMDIgdmlzaXQgbGlzdCAoNTEgdmlzaXRzIHZzIDYgZm9yIHRoZSB0ZXN0IHBhdGllbnQpLiBOSEknc1xuLy8gY2Fub25pY2FsIHNvdXJjZSBvZiB0cnV0aCBmb3IgXCJldmVyeSBiaWxsZWQgZW5jb3VudGVyXCIuXG4vLyAgIGhvc1BfSUQsIGhvc1BfQUJCUiwgaG9zcF91cmxcbi8vICAgZnVuQ19EQVRFICAgICAgICAgICAgICAoXHU2QzExXHU1NzBCIFlZWS9NTS9ERClcbi8vICAgaWNEOUNNX0NPREUgLyBpY0Q5Q01fQ09ERV9DTkFNRVxuLy8gICBvcklfVFlQRSAvIG9yaV90eXBlX25hbWUgICAoXCJJQ1x1NTM2MVx1OENDN1x1NjU5OVwiIC8gXCJcdTc1MzNcdTU4MzFcdThDQzdcdTY1OTlcIikgXHUyMDE0IG9yaWdpbiwgTk9UIFx1OTU4MC9cdTYwMjUvXHU0RjRGXG4vLyAgIHBhcnRfQU1ULCBhcHBsX0RPVCwgXHUyMDI2ICAgKGJpbGxpbmcgXHUyMDE0IGRpc2NhcmRlZClcbi8vICAgcm9XX0lEICAgICAgICAgICAgICAgICAgZGV0YWlsIGtleSBmb3IgSUhLRTMzMDNTMDIgZmFuLW91dCAoUGhhc2UgQilcbi8vIFdlIGRvbid0IGhhdmUgdmlzaXQgY2xhc3MgKFx1OTU4MC9cdTYwMjUvXHU0RjRGKSBhdCB0aGUgbGlzdCBsZXZlbDsgdGhlIFMwMiBkZXRhaWxcbi8vIGhhcyBob3NwX0RBVEFfVFlQRV9OQU1FIChcIlx1ODk3Rlx1OTFBQlwiL1wiXHU0RTJEXHU5MUFCXCIvXCJcdTcyNTlcdTkxQUJcIikuIEZvciBub3cgZGVmYXVsdCBBTUIuXG5mdW5jdGlvbiBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlKGl0ZW0sIGNsYXNzSGludCkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgaXRlbS5mdW5jX2RhdGUgfHwgXCJcIik7XG4gIGlmICghZGF0ZSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGljZENvZGUgPSBpdGVtLmljRDlDTV9DT0RFIHx8IGl0ZW0uaWNkOWNtX0NPREUgfHwgaXRlbS5pY2Q5Y21fY29kZSB8fCBcIlwiO1xuICBjb25zdCBpY2ROYW1lID0gcGlja0VuZ2xpc2goXG4gICAgaXRlbS5pY0Q5Q01fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX25hbWUgfHwgXCJcIlxuICApO1xuICAvLyBjbGFzcyBkZWZhdWx0cyB0byBBTUI7IElIS0UzMzAzUzAyIGRldGFpbCBmYW4tb3V0IG1heSBvdmVycmlkZSB0b1xuICAvLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUgKFx1NjAyNVx1OEEzQSAvIFx1NEY0Rlx1OTY2MikuXG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBlbmRfZGF0ZTogXCJcIixcbiAgICBjbGFzczogY2xhc3NIaW50IHx8IFwiQU1CXCIsXG4gICAgLy8gT3JpZ2luIG1hcmtlciBpc24ndCBhIGNsaW5pY2FsIGNsYXNzLCBidXQgc3Rhc2ggaXQgYXMgdHlwZV9kaXNwbGF5XG4gICAgLy8gc28gZG93bnN0cmVhbSBzZWVzIHRoZSBOSEkgbGFiZWwgd2l0aG91dCB1cyBpbnZlbnRpbmcgb25lLlxuICAgIHR5cGVfZGlzcGxheTogaXRlbS5vcmlfdHlwZV9uYW1lIHx8IGl0ZW0ub3JJX1RZUEVfTkFNRSB8fCBcIlwiLFxuICAgIGRlcGFydG1lbnQ6IFwiXCIsXG4gICAgcHJvdmlkZXI6IFwiXCIsXG4gICAgcmVhc29uOiBpY2ROYW1lID8gKGljZENvZGUgPyBgJHtpY2RDb2RlfSAke2ljZE5hbWV9YCA6IGljZE5hbWUpIDogXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgaXRlbS5ob3NwX0FCQlIgfHwgaXRlbS5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAvLyBQYXNzIHRocm91Z2ggZm9yIHRoZSBldmVudHVhbCBJSEtFMzMwM1MwMiBkZXRhaWwgZmV0Y2ggKFBoYXNlIEIpLlxuICAgIHJvd19pZDogaXRlbS5yb1dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRhcHRBbGxlcmd5KGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgYWxsZXJnZW4gPVxuICAgIGl0ZW0uYWxsZXJnZW5fbmFtZSB8fCBpdGVtLmFsbGVSX05BTUUgfHwgaXRlbS5tZWRuYW1lIHx8XG4gICAgaXRlbS5kcnVHX05BTUUgfHwgaXRlbS5hbGxlcmdlbiB8fCBcIlwiO1xuICBpZiAoIWFsbGVyZ2VuKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICByZWNvcmRlZF9kYXRlOiByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLnJlY29yRF9EQVRFIHx8IFwiXCIpLFxuICAgIGRpc3BsYXk6IGFsbGVyZ2VuLFxuICAgIGNhdGVnb3J5OiBcIm1lZGljYXRpb25cIixcbiAgICBjcml0aWNhbGl0eTogXCJ1bmFibGUtdG8tYXNzZXNzXCIsXG4gICAgcmVhY3Rpb246IGl0ZW0ucmVhY3Rpb04gfHwgaXRlbS5zeW1wdG9tIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzMzAxUzA1IChcdTg2NTVcdTdGNkUvXHU2MjRCXHU4ODUzIGxpc3QpIHNoYXBlOlxuLy8gICB7aG9zcF9pZCwgaG9zcF9hYmJyLCBob3NwX3VybCwgb3JpX3R5cGVfbmFtZSwgb3JpX3R5cGUsIGZ1bmNfZGF0ZSxcbi8vICAgIG91dF9kYXRlLCBpY2Q5Y21fY29kZSwgaWNkOWNtX2NvZGVfY25hbWUsIG9wX2NvZGVfY25hbWUsIHJvd19pZH1cbi8vIE5vdGU6IG5vIHByb2NlZHVyZSBDT0RFIGluIGxpc3QgXHUyMDE0IG9wX2NvZGVfY25hbWUgaXMgdGhlIG9ubHkgbGFiZWwuXG5mdW5jdGlvbiBhZGFwdFByb2NlZHVyZShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bmNfZGF0ZSB8fCBpdGVtLmZ1bkNfREFURSk7XG4gIGNvbnN0IGRpc3BsYXkgPSBwaWNrRW5nbGlzaChcbiAgICBpdGVtLm9wX2NvZGVfY25hbWUgfHwgaXRlbS5wcm9DX05BTUUgfHwgaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCJcbiAgKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5KSByZXR1cm4gbnVsbDtcbiAgLy8gRGlhZ25vc2lzIChpY2Q5Y21fY29kZV9jbmFtZSkgaXMgdGhlICpyZWFzb24qIGZvciB0aGUgcHJvY2VkdXJlLCBub3RcbiAgLy8gdGhlIHByb2NlZHVyZSBjb2RlIGl0c2VsZi4gU3Rhc2ggaXQgaW4gYG5vdGVgIHNvIGl0IHNob3dzIHVwIGluIHRoZVxuICAvLyBGSElSIHJlc291cmNlIHdpdGhvdXQgcG9sbHV0aW5nIHRoZSBjb2RlIGZpZWxkLlxuICBjb25zdCByZWFzb25Db2RlID0gaXRlbS5pY2Q5Y21fY29kZSB8fCBpdGVtLmljZDljbV9DT0RFIHx8IFwiXCI7XG4gIGNvbnN0IHJlYXNvbk5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9jb2RlX2NuYW1lIHx8IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgXCJcIik7XG4gIGNvbnN0IG5vdGUgPSByZWFzb25OYW1lXG4gICAgPyAocmVhc29uQ29kZSA/IGBSZWFzb246ICR7cmVhc29uQ29kZX0gJHtyZWFzb25OYW1lfWAgOiBgUmVhc29uOiAke3JlYXNvbk5hbWV9YClcbiAgICA6IFwiXCI7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBjb2RlOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgbm90ZSxcbiAgICBib2R5X3NpdGU6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9hYmJyIHx8IGl0ZW0uaG9zUF9BQkJSIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzNDA4UzAxIChcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTUgbGlzdCkgc2hhcGU6XG4vLyAgIHtob3NwX0lELCBob3NwX0FCQlIsIGhvc3BfdXJsLCByZWFsX0lOU1BFQ1RfREFURSwgb3JkZXJfQ09ERSxcbi8vICAgIG9yZGVyX0NPREVfMldvcmQsIG9yZGVyX05BTUUsIG9yaV9UWVBFLCByb3dfSUQsIGpwR19TVEFUVVMsIC4uLn1cbi8vIE5vIGZpbmRpbmdzL2NvbmNsdXNpb24gXHUyMDE0IGxpc3QgaXMgb3JkZXItbGV2ZWwgb25seS4gV2UgbWFwIHRvIFByb2NlZHVyZVxuLy8gKGFuIGV4YW0gd2FzIHBlcmZvcm1lZCkgcmF0aGVyIHRoYW4gRGlhZ25vc3RpY1JlcG9ydCAod2hpY2ggbmVlZHMgYVxuLy8gbmFycmF0aXZlKS4gSWYvd2hlbiB3ZSBmZXRjaCB0aGUgYWN0dWFsIHJlcG9ydCB0aGlzIGJlY29tZXMgYSBEUi5cbi8vIElIS0UzNDA4UzAyIGRldGFpbCBwcm92aWRlcyB0aGUgZnVsbCByYWRpb2xvZ3kgLyBlbmRvc2NvcHkgcmVwb3J0IGluXG4vLyBgZGVzY2AuIENvbWJpbmVkIHdpdGggb3JkZXJfTkFNRSArIGZ1bmNfREFURSB0aGlzIGlzIGEgcHJvcGVyIEZISVJcbi8vIERpYWdub3N0aWNSZXBvcnQuIExpc3Qtb25seSBlbnRyaWVzICh3aGVyZSB0aGUgZGV0YWlsIGZldGNoIHJldHVybmVkXG4vLyBubyBgZGVzY2ApIGdldCBkcm9wcGVkIFx1MjAxNCB3aXRob3V0IGEgbmFycmF0aXZlIHRoZSByZXBvcnQgbWFwcGVyIHdvdWxkXG4vLyByZWplY3QgdGhlbSBhbnl3YXkuXG5mdW5jdGlvbiBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBjb25zdCBkaXNwbGF5ID0gcGlja0VuZ2xpc2goaXRlbS5vcmRlcl9OQU1FIHx8IGl0ZW0ub3JkZXJfbmFtZSB8fCBcIlwiKTtcbiAgY29uc3QgY29uY2x1c2lvbiA9IChpdGVtLmRlc2MgfHwgXCJcIikudHJpbSgpO1xuICBpZiAoIWRhdGUgfHwgIWRpc3BsYXkgfHwgIWNvbmNsdXNpb24pIHJldHVybiBudWxsO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogaXRlbS5vcmRlcl9DT0RFIHx8IGl0ZW0ub3JkZXJfY29kZSB8fCBcIlwiLFxuICAgIHN5c3RlbTogXCJcIixcbiAgICBkaXNwbGF5LFxuICAgIGNhdGVnb3J5OiBcIlJBRFwiLFxuICAgIGNvbmNsdXNpb24sXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gTkhJIHNlcGFyYXRlcyB0aGUgZXhhbSBkYXRlIChmdW5jX0RBVEUpIGZyb20gdGhlIHJlcG9ydC11cGxvYWRcbiAgICAvLyB0aW1lc3RhbXAgKGFzc2F5X1VQTE9BRF9EQVRFKS4gVGhlIGxhdHRlciBpcyB3aGVuIHRoZSByZXBvcnRcbiAgICAvLyB3YXMgZmluYWxpc2VkIGluIE5ISSdzIHN5c3RlbSBcdTIwMTQgbWFwcyB0byBEaWFnbm9zdGljUmVwb3J0Lmlzc3VlZC5cbiAgICAvLyBGYWxscyBiYWNrIHRvIE5vbmUgaWYgTkhJIGRpZG4ndCBzaGlwIG9uZS5cbiAgICBpc3N1ZWQ6IHJvY1RvSVNPKChpdGVtLmFzc2F5X1VQTE9BRF9EQVRFIHx8IFwiXCIpLnNwbGl0KC9cXHMrLylbMF0pLFxuICB9O1xufVxuXG5mdW5jdGlvbiBhZGFwdERpYWdSZXBvcnQoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUpO1xuICBjb25zdCBkaXNwbGF5ID0gaXRlbS5vcmRlUl9OQU1FIHx8IGl0ZW0uYXNzYVlfSVRFTV9OQU1FIHx8IGl0ZW0uZXhhbU5hbWUgfHwgXCJcIjtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgY29uY2x1c2lvbiA9XG4gICAgaXRlbS5yZXBvcnQgfHwgaXRlbS5maW5kaW5nUyB8fCBpdGVtLmltUF9EQVRBIHx8IGl0ZW0uY29uc3VsVF9WQUxVRSB8fCBcIlwiO1xuICBpZiAoIWNvbmNsdXNpb24pIHJldHVybiBudWxsO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogaXRlbS5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgc3lzdGVtOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgY2F0ZWdvcnk6IFwiUkFEXCIsXG4gICAgY29uY2x1c2lvbixcbiAgfTtcbn1cblxuLy8gcGFnZV90eXBlIFx1MjE5MiBiYWNrZW5kIHBhZ2VfdHlwZSBzdHJpbmcgdXNlZCBieSBtYXBwZXJzLlxuLy8gcGF0aCBpcyByZWxhdGl2ZSB0byBuaGlCYXNlLiBtZXRob2QgZGVmYXVsdCBcIkdFVFwiLlxuLy8gYHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlYCA9IGVuZHBvaW50IGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGluIFx1NkMxMVx1NTcwQiBmb3JtYXQuXG4vLyBDb25maXJtZWQgdmlhIFVSTHMgb2JzZXJ2ZWQgaW4gTkhJJ3MgU1BBLiBPdGhlciBlbmRwb2ludHMgZWl0aGVyIGRvbid0XG4vLyBhY2NlcHQgcmFuZ2UgcGFyYW1zLCBvciBOSEkgcmVqZWN0cyB1bmtub3duIHBhcmFtcyBcdTIwMTQgd2UgbGVhdmUgdGhlbSBhbG9uZVxuLy8gKHRoZXkgZmFsbCBiYWNrIHRvIHRoZWlyIGRlZmF1bHQgd2luZG93LCB0eXBpY2FsbHkgMS0yIHllYXJzKS5cbi8vIFVzZXItZmFjaW5nIGxhYmVsIGZvciBlYWNoIGVuZHBvaW50IG5hbWUuIFRoZSBicmVha2Rvd24gY29sbGFwc2libGVcbi8vIGluIHRoZSBwb3B1cCAoXCJcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzBcIikgcmVhZHMgZnJvbSB0aGlzIHNvIHVzZXJzIHNlZSBcIlx1NUMzMVx1OTFBQiAxMiBcdTdCNDZcIlxuLy8gaW5zdGVhZCBvZiB0aGUgZGV2LWZsYXZvdXJlZCBcImVuY291bnRlcnM9MTIvMTJcIi4gVW5rbm93biBuYW1lcyBmYWxsXG4vLyB0aHJvdWdoIHRvIHRoZSByYXcga2V5LCB3aGljaCBrZWVwcyBpdCBvYnZpb3VzIGR1cmluZyBkZXZlbG9wbWVudFxuLy8gd2hlbiB3ZSBhZGQgYSBuZXcgZW5kcG9pbnQgYW5kIGhhdmVuJ3QgbGFiZWxsZWQgaXQgeWV0LlxuY29uc3QgRU5EUE9JTlRfTEFCRUxfWkggPSB7XG4gIGVuY291bnRlcnM6IFwiXHU1QzMxXHU5MUFCXCIsXG4gIGlucGF0aWVudDogXCJcdTRGNEZcdTk2NjJcIixcbiAgaW5wYXRpZW50X2xlZ2FjeTogXCJcdTRGNEZcdTk2NjJcdUZGMDhcdTgyMEFcdUZGMDlcIixcbiAgcHJvY2VkdXJlczogXCJcdTYyNEJcdTg4NTMgLyBcdTg2NTVcdTdGNkVcIixcbiAgbWVkaWNhdGlvbnM6IFwiXHU4NjU1XHU2NUI5XHU4NUU1XHU1NEMxXCIsXG4gIGFsbGVyZ2llczogXCJcdTg1RTVcdTcyNjlcdTkwNEVcdTY1NEZcIixcbiAgYWxsZXJnaWVzX2I6IFwiXHU4NUU1XHU3MjY5XHU5MDRFXHU2NTRGXHVGRjA4Qlx1RkYwOVwiLFxuICBhZHVsdF9wcmV2ZW50aXZlOiBcIlx1NjIxMFx1NEVCQVx1NTA2NVx1NkFBMlwiLFxuICBjYW5jZXJfc2NyZWVuaW5nOiBcIlx1NzY0Q1x1NzVDN1x1N0JFOVx1NkFBMlwiLFxuICBpbWFnaW5nOiBcIlx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNVwiLFxuICBvdGhlcl9sYWJzOiBcIlx1NkFBMlx1OUE1N1wiLFxufTtcblxuY29uc3QgTkhJX0FQSV9FTkRQT0lOVFMgPSBbXG4gIC8vIGVuY291bnRlcnMgLyBwcm9jZWR1cmVzIGRvbid0IGhhdmUgYSAvc2VhcmNoIHZhcmlhbnQgKDQwNCkuIHBhZ2VfbG9hZFxuICAvLyBzaWxlbnRseSBpZ25vcmVzIHNfZGF0ZSAvIGVfZGF0ZSBcdTIwMTQgdmVyaWZpZWQgdGhlIGFycmF5IGxlbmd0aCBpc1xuICAvLyBpZGVudGljYWwgd2l0aCBvciB3aXRob3V0IGRhdGVzLiBEYXRlIGZpbHRlciBpcyBlZmZlY3RpdmVseSB1bnN1cHBvcnRlZFxuICAvLyBmb3IgdGhlc2UgZW5kcG9pbnRzOyB0aGV5IHJldHVybiBhbGwgZGF0YSBpbiBOSEkncyBsaWZldGltZSB3aW5kb3cuXG4gIC8vIEVuY291bnRlciBzb3VyY2U6IElIS0UzMzAzUzAxIChcdTkxQUJcdTc2NDJcdThDQkJcdTc1MjhcdTc1MzNcdTU4MzEpLiBUaGUgL3BhZ2VfbG9hZCB2YXJpYW50XG4gIC8vIGlzIHdpbmRvdy1saW1pdGVkIHRvIH4xIHllYXIgKHJldHVybmVkIDUxIHZpc2l0cyBlbmRpbmcgMTE0LzA1KTtcbiAgLy8gL3NlYXJjaCBhY2NlcHRzIHNfZGF0ZSAvIGVfZGF0ZSBhbmQgZ29lcyBiYWNrIGZ1cnRoZXIgKDE2MiB2aXNpdHNcbiAgLy8gdG8gMTEyLzA1IGZvciB0aGUgc2FtZSBwYXRpZW50KS4gU2luY2UgbGFicy9tZWRzIGV4dGVuZCB0byAzeSB2aWFcbiAgLy8gdGhlaXIgb3duIC9zZWFyY2ggZW5kcG9pbnRzLCBlbmNvdW50ZXIgTVVTVCBhbHNvIHVzZSAvc2VhcmNoIG9yXG4gIC8vIHRoZSAoaG9zcGl0YWwsIGRhdGUpIGxpbmtlciBoYXMgbm90aGluZyB0byBtYXRjaCBhZ2FpbnN0IGZvciBvbGRlclxuICAvLyBsYWIgZGF0ZXMuXG4gIHsgbmFtZTogXCJlbmNvdW50ZXJzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwM3MwMS9zZWFyY2g/c19kYXRlPSZlX2RhdGU9XCIsXG4gICAgcGFnZV90eXBlOiBcImVuY291bnRlcnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBJbnBhdGllbnQgKFx1NEY0Rlx1OTY2MikgXHUyMDE0IElIS0UzMzA5UzAxIGlzIHRoZSBwcmltYXJ5IGxpc3Qgd2l0aCBpbl9EQVRFL291dF9EQVRFXG4gIC8vIHNwYW4uIElIS0UzMzA4UzAxIGNhcnJpZXMgYSBzbWFsbCBzZXQgb2Ygb2xkZXIgXHU0RjRGXHU5NjYyIHJlY29yZHMgd2l0aCB0aGVcbiAgLy8gc2FtZSBmaWVsZHMgKGZ1bmNfREFURSBpbiBzb21lIHJvd3MgaW5zdGVhZCBvZiBpbl9EQVRFOyBhZGFwdGVyXG4gIC8vIGhhbmRsZXMgYm90aCkuIEJvdGggZmVlZCB0aGUgc2FtZSBlbmNvdW50ZXIgbWFwcGVyLlxuICB7IG5hbWU6IFwiaW5wYXRpZW50XCIsICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDlzMDEvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcImVuY291bnRlcnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdElucGF0aWVudEVuY291bnRlciB9LFxuICB7IG5hbWU6IFwiaW5wYXRpZW50X2xlZ2FjeVwiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDhzMDEvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcImVuY291bnRlcnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdElucGF0aWVudEVuY291bnRlciB9LFxuICB7IG5hbWU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDFzMDUvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcInByb2NlZHVyZXNcIiwgICAgICAgIGFkYXB0OiBhZGFwdFByb2NlZHVyZSB9LFxuICAvLyBtZWRpY2F0aW9uczogcGFnZV9sb2FkIG9ubHkgYWNjZXB0cyBlbXB0eSBkYXRlcyAoSFRUUCA0MDAgb3RoZXJ3aXNlKS5cbiAgLy8gVGhlIC9zZWFyY2ggZW5kcG9pbnQgaXMgd2hhdCB0aGUgU1BBIGhpdHMgd2hlbiB1c2VyIHBpY2tzIGEgY3VzdG9tXG4gIC8vIGRhdGUgcmFuZ2UgYW5kIGFjY2VwdHMgSVNPIFx1ODk3Rlx1NTE0MyBkYXRlcyB3aXRoIGRhc2hlcyAoMjAyMy0wMS0wMSkuXG4gIC8vIENvbmZpcm1lZCB2aWEgRGV2VG9vbHMgb2JzZXJ2YXRpb24gb2YgdGhlIFx1N0JFOVx1OTA3OCBwYW5lbCBzdWJtaXQuXG4gIHsgbmFtZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwNnMwMS9zZWFyY2g/c19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMSZzX3R5cGU9QVwiLFxuICAgIHBhZ2VfdHlwZTogXCJtZWRpY2F0aW9uc1wiLCAgICAgICBhZGFwdDogYWRhcHRNZWRpY2F0aW9uLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICB7IG5hbWU6IFwiYWxsZXJnaWVzXCIsICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMyMDJzMDEvU1BfSUhLRTMyMDJTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwiYWxsZXJnaWVzXCIsICAgICAgICAgYWRhcHQ6IGFkYXB0QWxsZXJneSB9LFxuICB7IG5hbWU6IFwiYWxsZXJnaWVzX2JcIiwgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMyMDJzMDEvU1BfSUhLRTMyMDJTMDRcIixcbiAgICBwYWdlX3R5cGU6IFwiYWxsZXJnaWVzXCIsICAgICAgICAgYWRhcHQ6IGFkYXB0QWxsZXJneSB9LFxuICAvLyBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjVcdTdENTBcdTY3OUMgKElIS0UzNDAyUzAxKTogb25lIHJvdyBwZXIgc2NyZWVuaW5nLCBjb250YWluc1xuICAvLyBCTUkgLyB2aXRhbHMgLyBsaXBpZCBwYW5lbCAvIExGVCAvIFJGVCAvIEhlcCBCL0MgLyB1cmljIGFjaWQgYWxsXG4gIC8vIHByZS1jb21wdXRlZCBieSBOSEkncyBzY3JlZW5pbmcgcHJvZ3JhbW1lLiBhZGFwdEFkdWx0UHJldmVudGl2ZVxuICAvLyByZXR1cm5zIGFuIGFycmF5IChvbmUgT2JzZXJ2YXRpb24gcGVyIG1lYXN1cmVtZW50KSBzbyB0aGVcbiAgLy8gYWRhcHRlci1jYWxsIGxvb3AgZmxhdHRlbnMgaXQuXG4gIHsgbmFtZTogXCJhZHVsdF9wcmV2ZW50aXZlXCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwMnMwMS9TUF9JSEtFMzQwMlMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRBZHVsdFByZXZlbnRpdmUgfSxcbiAgeyBuYW1lOiBcImNhbmNlcl9zY3JlZW5pbmdcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA0czAxL1NQX0lIS0UzNDA0UzAxXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdExhYkl0ZW0gfSxcbiAgLy8gZ2x1Y29zZSAoSUhLRTM0MDZTMDEpICsgbGlwaWQgKElIS0UzNDA3UzAxKSBhcmUgc3Vic2V0cyBvZlxuICAvLyBvdGhlcl9sYWJzIChJSEtFMzQwOVMwMSkgcGVyIE5ISSdzIGRhdGEgbW9kZWwgXHUyMDE0IGZldGNoaW5nIHRoZW1cbiAgLy8gc2VwYXJhdGVseSBqdXN0IGNyZWF0ZXMgZHVwIG9ic2VydmF0aW9ucywgc28gd2Ugc2tpcCB0aGVtLlxuICAvLyBJbWFnaW5nIGxpc3QgKElIS0UzNDA4UzAxKSBvbmx5IGNhcnJpZXMgb3JkZXItbGV2ZWwgZGF0YTsgZnVsbFxuICAvLyBuYXJyYXRpdmUgcmVwb3J0IGxpdmVzIGF0IElIS0UzNDA4UzAyLiBXZSBkbyBhIDItc3RlcCBmZXRjaCAoc2VlXG4gIC8vIF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIpIHRvIGdyYWIgdGhlIHJlcG9ydCwgdGhlbiBtYXAgdG8gYSByZWFsXG4gIC8vIERpYWdub3N0aWNSZXBvcnQuIFRoZSBsaXN0IGFkYXB0ZXIgaXMgYSBuby1vcCBzdHViIGxpa2UgbWVkaWNhdGlvbnMuXG4gIC8vIGltYWdpbmc6IHNlYXJjaCBlbmRwb2ludCBhY2NlcHRzIElTTyBkYXRlIHJhbmdlIGxpa2UgbWVkaWNhdGlvbnMuXG4gIHsgbmFtZTogXCJpbWFnaW5nXCIsICAgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwOHMwMS9zZWFyY2g/c190eXBlPSZzX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExXCIsXG4gICAgcGFnZV90eXBlOiBcImRpYWdub3N0aWNfcmVwb3J0c1wiLCBhZGFwdDogKCkgPT4gbnVsbCwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbiAgLy8gb3RoZXJfbGFicyBhbHJlYWR5IHVzZXMgL3NlYXJjaDsgc2FtZSBJU08tZGFzaCBkYXRlIGZvcm1hdCB3b3Jrcy5cbiAgeyBuYW1lOiBcIm90aGVyX2xhYnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA5czAxL3NlYXJjaD9zX3R5cGU9JnNfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0TGFiSXRlbSwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbl07XG5cbi8vIEFwcGx5IGEge3N0YXJ0LCBlbmR9IElTTyBkYXRlIHJhbmdlIHRvIGFuIGVuZHBvaW50IHBhdGg6XG4vLyAgIC0gSWYgcGF0aCBhbHJlYWR5IGhhcyBzX2RhdGU9IHBsYWNlaG9sZGVycywgZmlsbCB0aGVtIGluLlxuLy8gICAtIE90aGVyd2lzZSBhcHBlbmQgc19kYXRlPS4uLiZlX2RhdGU9Li4uIHRvIHRoZSBxdWVyeSBzdHJpbmcuXG4vLyBFbmRwb2ludHMgd2l0aG91dCBgc3VwcG9ydHNEYXRlUmFuZ2VgIHBhc3MgdGhyb3VnaCB1bmNoYW5nZWQuXG5mdW5jdGlvbiBhcHBseURhdGVSYW5nZVRvUGF0aChwYXRoLCBkYXRlUmFuZ2UpIHtcbiAgaWYgKCFkYXRlUmFuZ2UgfHwgKCFkYXRlUmFuZ2Uuc3RhcnQgJiYgIWRhdGVSYW5nZS5lbmQpKSByZXR1cm4gcGF0aDtcbiAgLy8gTkhJIGV4cGVjdHMgXHU4OTdGXHU1MTQzIElTTyBkYXRlcyB3aXRoIGRhc2hlczogMjAyMy0wMS0wMSAobm90IFx1NkMxMVx1NTcwQiwgbm90XG4gIC8vIHNsYXNoZXMpLiBDb25maXJtZWQgYnkgb2JzZXJ2aW5nIHRoZSBTUEEncyByZXF1ZXN0IHdoZW4gdXNlciBwaWNrc1xuICAvLyBhIGN1c3RvbSBkYXRlIHJhbmdlLiBVUkwtZW5jb2RpbmcgdGhlIGRhc2hlcyBpcyB1bm5lY2Vzc2FyeS5cbiAgY29uc3QgcyA9IChkYXRlUmFuZ2Uuc3RhcnQgfHwgXCJcIikuc2xpY2UoMCwgMTApO1xuICBjb25zdCBlID0gKGRhdGVSYW5nZS5lbmQgfHwgXCJcIikuc2xpY2UoMCwgMTApO1xuICBsZXQgcCA9IHBhdGg7XG4gIGlmICgvWz8mXXNfZGF0ZT0vLnRlc3QocCkpIHtcbiAgICBwID0gcC5yZXBsYWNlKC8oWz8mXXNfZGF0ZT0pW14mXSovLCBgJDEke3N9YCk7XG4gIH0gZWxzZSB7XG4gICAgcCArPSAocC5pbmNsdWRlcyhcIj9cIikgPyBcIiZcIiA6IFwiP1wiKSArIGBzX2RhdGU9JHtzfWA7XG4gIH1cbiAgaWYgKC9bPyZdZV9kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdZV9kYXRlPSlbXiZdKi8sIGAkMSR7ZX1gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IGAmZV9kYXRlPSR7ZX1gO1xuICB9XG4gIHJldHVybiBwO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzMzA2UzAyIGRldGFpbCBmZXRjaGVzIGluc2lkZSB0aGUgTkhJIHRhYiBzbyBjb29raWVzICsgSldUXG4vLyBhdXRoIGZsb3cgbmF0dXJhbGx5LiBXZSBwYXNzIHRoZSB2aXNpdCBsaXN0IChqdXN0IHJvd19JRHMgKyB0aGVpciBwYXJlbnRcbi8vIGZpZWxkcyBuZWVkZWQgZm9yIGFkYXB0YXRpb24pIGludG8gdGhlIHRhYjsgdGhlIHRhYiByZXR1cm5zIHBhcmFsbGVsXG4vLyBmZXRjaGVkIGJvZGllczsgd2UgYWRhcHQgYmFjayBpbiB0aGUgU1cuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hNZWRpY2F0aW9uRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2KSA9PiAoe1xuICAgICAgcm93X0lEOiB2LnJvd19JRCB8fCB2LnJvd2lkIHx8IHYucm93SUQgfHwgXCJcIixcbiAgICAgIC8vIEtlZXAgcGFyZW50IGZpZWxkcyBuZWVkZWQgYnkgYWRhcHRNZWRpY2F0aW9uRnJvbURldGFpbC5cbiAgICAgIHBhcmVudDoge1xuICAgICAgICBmdW5jX0RBVEU6IHYuZnVuY19EQVRFIHx8IHYuZnVuY19kYXRlIHx8IFwiXCIsXG4gICAgICAgIGljZDljbV9DT0RFOiB2LmljZDljbV9DT0RFIHx8IHYuaWNkOWNtX2NvZGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREVfQ05BTUU6IHYuaWNkOWNtX0NPREVfQ05BTUUgfHwgdi5pY2Q5Y21fbmFtZSB8fCBcIlwiLFxuICAgICAgICBob3NwX0FCQlI6IHYuaG9zcF9BQkJSIHx8IHYuaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgICB9LFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2N0eXBlfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIE5ISSB1c2VzIGRpZmZlcmVudCBjdHlwZSB2YWx1ZXMgZm9yIFx1ODk3Rlx1OTFBQi9cdTRFMkRcdTkxQUIvXHU3MjU5XHU5MUFCL1x1ODY1NVx1NjVCOVx1N0I4Qi4gV2UgZG9uJ3RcbiAgICAgIC8vIGhhdmUgdGhlIHB1YmxpYyBtYXBwaW5nLCBzbyB0cnkgY3R5cGUgMS4uNCBpbiBvcmRlciBhbmQgc3RvcCBhc1xuICAgICAgLy8gc29vbiBhcyBvbmUgcmV0dXJucyBkcnVncy4gY3R5cGU9MiBjb3ZlcmVkIElDXHU1MzYxIFx1OTU4MFx1OEEzQSBpbiBvdXIgc2FtcGxlLlxuICAgICAgYXN5bmMgZnVuY3Rpb24gb25lKHJvd0lkKSB7XG4gICAgICAgIGZvciAoY29uc3QgY3Qgb2YgWzIsIDEsIDMsIDRdKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCBjdCk7XG4gICAgICAgICAgaWYgKHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHJldHVybiByO1xuICAgICAgICAgIGlmIChyLmVycm9yKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHk/Lmloa2UzMzA2UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhIDogW107XG4gICAgICAgICAgY29uc3QgaGFzRHJ1Z3MgPSBtYWluLnNvbWUoKHYpID0+XG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHY/LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCkgJiYgdi5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QubGVuZ3RoID4gMFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGhhc0RydWdzKSByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgICAgICAvLyBObyBjdHlwZSB5aWVsZGVkIGRydWdzIFx1MjAxNCByZXR1cm4gbGFzdCBzdWNjZXNzZnVsIGJvZHkgYW55d2F5IHNvXG4gICAgICAgIC8vIGRpYWdub3N0aWNzIGNhbiBzdGlsbCBzZWUgdGhlIHZpc2l0IG1ldGFkYXRhLlxuICAgICAgICByZXR1cm4gYXdhaXQgZmV0Y2hPbmUocm93SWQsIDIpO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICBsZXQgbmV4dCA9IDA7XG4gICAgICBjb25zdCBDT05DID0gMztcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHdvcmtlcigpIHtcbiAgICAgICAgd2hpbGUgKG5leHQgPCBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBpID0gbmV4dCsrO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiAxNTApKTtcbiAgICAgICAgICBvdXRbaV0gPSBhd2FpdCBvbmUoaXRlbXNbaV0ucm93X0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd3MgPSBbXTtcbiAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQyAmJiB3IDwgaXRlbXMubGVuZ3RoOyB3KyspIHdzLnB1c2god29ya2VyKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod3MpO1xuICAgICAgcmV0dXJuIHsgcmVzdWx0czogb3V0IH07XG4gICAgfSxcbiAgICBhcmdzOiBbYmFzZVVybCwgcmVxc10sXG4gIH0pO1xuXG4gIGlmIChyZXN1bHQ/LmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgY29uc3QgZHJ1Z3MgPSBbXTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlc3VsdD8ucmVzdWx0cyB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgciA9IHJlc3VsdHNbaV07XG4gICAgaWYgKCFyIHx8IHIuZXJyb3IgfHwgIXIuYm9keSkgY29udGludWU7XG4gICAgY29uc3QgbWFpbiA9IEFycmF5LmlzQXJyYXkoci5ib2R5Lmloa2UzMzA2UzAyX21haW5fZGF0YSkgPyByLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhIDogW107XG4gICAgZm9yIChjb25zdCB2aXNpdCBvZiBtYWluKSB7XG4gICAgICBjb25zdCBkcnVnTGlzdCA9IEFycmF5LmlzQXJyYXkodmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSA/IHZpc2l0LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdCA6IFtdO1xuICAgICAgZm9yIChjb25zdCBkIG9mIGRydWdMaXN0KSB7XG4gICAgICAgIGNvbnN0IGFkYXB0ZWQgPSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsKGQsIHZpc2l0KTtcbiAgICAgICAgaWYgKGFkYXB0ZWQpIGRydWdzLnB1c2goYWRhcHRlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkcnVncztcbn1cblxuLy8gRmFuIG91dCBJSEtFMzQwOFMwMiBkZXRhaWwgZmV0Y2hlcyBmb3IgaW1hZ2luZyBcdTIwMTQgc2FtZSBwYXR0ZXJuIGFzIHRoZVxuLy8gbWVkaWNhdGlvbiAyLXN0ZXAuIGN0eXBlIG1pcnJvcnMgdGhlIHZpc2l0J3Mgb3JpX1RZUEUgKEEgLyBFIC8gXHUyMDI2KS5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaEltYWdpbmdEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgY3R5cGU6IHYub3JpX1RZUEUgfHwgdi5vcmlfdHlwZSB8fCBcIkFcIixcbiAgICB9KSlcbiAgICAuZmlsdGVyKChyKSA9PiByLnJvd19JRCk7XG4gIGlmIChyZXFzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgZnVuYzogYXN5bmMgKGJhc2UsIGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgIGlmICghdG9rZW4pIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICB9XG4gICAgICBjb25zdCBhdXRoID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzQwOFMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGN0eXBlKX1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgMzAwMDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIiwgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiwgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQsIGl0ZW1zW2ldLmN0eXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd3MgPSBbXTtcbiAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQyAmJiB3IDwgaXRlbXMubGVuZ3RoOyB3KyspIHdzLnB1c2god29ya2VyKCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwod3MpO1xuICAgICAgcmV0dXJuIHsgcmVzdWx0czogb3V0IH07XG4gICAgfSxcbiAgICBhcmdzOiBbYmFzZVVybCwgcmVxc10sXG4gIH0pO1xuXG4gIGlmIChyZXN1bHQ/LmVycm9yID09PSBcIlNFU1NJT05fRVhQSVJFRFwiKSB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgY29uc3QgcmVwb3J0cyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTM0MDhTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGFkYXB0ZWQgPSBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKHZpc2l0KTtcbiAgICAgIGlmIChhZGFwdGVkKSByZXBvcnRzLnB1c2goYWRhcHRlZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXBvcnRzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzMzAzUzAyIGRldGFpbCB0byBjbGFzc2lmeSBlYWNoIElIS0UzMzAzUzAxIHZpc2l0IGFzXG4vLyBBTUIgLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUuIFVzZXMgP3JpZD08cm93X0lEPiZ0PU5cbi8vIHdoZXJlIE4gaXMgdGhlIHZpc2l0IHR5cGUgYnVja2V0OyB3ZSBkb24ndCBrbm93IHRoZSBtYXBwaW5nIGEgcHJpb3JpLFxuLy8gc28gZm9yIGVhY2ggdmlzaXQgd2UgdHJ5IHQ9MS4uNSB1bnRpbCBvbmUgcmV0dXJucyBub24tZW1wdHkgbWFpbl9kYXRhLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoRW5jb3VudGVyRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2LCBpZHgpID0+ICh7IGlkeCwgcm93X0lEOiB2LnJvV19JRCB8fCB2LnJvd19JRCB8fCBcIlwiIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCB0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9paGtlMzMwM3MwMi9wYWdlX2xvYWQ/cmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mdD0ke3R9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHRtID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRtKTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRm9yIGVhY2ggdmlzaXQsIGZpbmQgdGhlIGB0YCB0aGF0IHJldHVybnMgbm9uLWVtcHR5IGRhdGEuIE5ISVxuICAgICAgLy8gdXNlcyB0PTEgZm9yIG91dHBhdGllbnQgXHU4OTdGXHU5MUFCLCB0PTIgbWF5YmUgXHU2MDI1XHU4QTNBL1x1NEUyRFx1OTFBQiwgdD0zIFx1NEY0Rlx1OTY2MixcbiAgICAgIC8vIHQ9NCBcdTcyNTlcdTkxQUJcdTIwMjYgZG9uJ3QgaGF2ZSBhbiBhdXRob3JpdGF0aXZlIG1hcHBpbmcgc28gd2UgcHJvYmUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIFsxLCAyLCAzLCA0LCA1XSkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaE9uZShyb3dJZCwgdCk7XG4gICAgICAgICAgaWYgKHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHJldHVybiByO1xuICAgICAgICAgIGlmIChyLmVycm9yKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBtYWluID0gKHIuYm9keT8uaWhrZTMzMDNTMDJfbWFpbl9kYXRhKSB8fCBbXTtcbiAgICAgICAgICBpZiAobWFpbi5sZW5ndGggPiAwKSByZXR1cm4geyBib2R5OiByLmJvZHksIHQgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBib2R5OiBudWxsIH07XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICAvLyBQYWlyIGVhY2ggZGV0YWlsIGJvZHkgYmFjayB0byBpdHMgdmlzaXQgcG9zaXRpb24uXG4gIGNvbnN0IGJ5SWR4ID0gbmV3IE1hcCgpO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcXMubGVuZ3RoOyBpKyspIHtcbiAgICBieUlkeC5zZXQocmVxc1tpXS5pZHgsIHJlc3VsdHNbaV0/LmJvZHkgfHwgbnVsbCk7XG4gIH1cbiAgcmV0dXJuIGJ5SWR4O1xufVxuXG5mdW5jdGlvbiBfY2xhc3NGcm9tUzAyRGV0YWlsKGJvZHkpIHtcbiAgaWYgKCFib2R5KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbWFpbiA9IChib2R5Lmloa2UzMzAzUzAyX21haW5fZGF0YSkgfHwgW107XG4gIGlmIChtYWluLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHRuID0gU3RyaW5nKG1haW5bMF0uaG9zcF9EQVRBX1RZUEVfTkFNRSB8fCBcIlwiKTtcbiAgaWYgKHRuLmluY2x1ZGVzKFwiXHU2MDI1XCIpKSByZXR1cm4gXCJFTUVSXCI7ICAvLyBcdTYwMjVcdThBM0FcbiAgaWYgKHRuLmluY2x1ZGVzKFwiXHU0RjRGXHU5NjYyXCIpKSByZXR1cm4gXCJJTVBcIjtcbiAgLy8gXHU4OTdGXHU5MUFCIC8gXHU0RTJEXHU5MUFCIC8gXHU3MjU5XHU5MUFCIC8gXHU4NUU1XHU1QzQwIGFsbCBkZWZhdWx0IHRvIEFNQlxuICByZXR1cm4gXCJBTUJcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3Bvc3RTdHJ1Y3R1cmVkKGJhY2tlbmQsIHBhZ2VfdHlwZSwgaXRlbXMsIHN5bmNBcGlLZXksIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy91cGxvYWQtc3RydWN0dXJlZGAsIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcGFnZV90eXBlLFxuICAgICAgaG9zdDogTkhJX0hPU1QsXG4gICAgICBpdGVtcyxcbiAgICAgIHBhdGllbnRfb3ZlcnJpZGU6IHBhdGllbnRPdmVycmlkZSB8fCBudWxsLFxuICAgIH0pLFxuICB9KTtcbiAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoYFBPU1QgdXBsb2FkLXN0cnVjdHVyZWQgJHtyLnN0YXR1c306ICR7KGF3YWl0IHIudGV4dCgpKS5zbGljZSgwLCAyMDApfWApO1xuICByZXR1cm4gYXdhaXQgci5qc29uKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBtb2RlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFJ1bnMgdGhlIHNhbWUgbWFwcGVycyB0aGUgYmFja2VuZCBydW5zLCB0aGVuIHRyaWdnZXJzIGEgZG93bmxvYWQgb2YgdGhlXG4vLyByZXN1bHRpbmcgRkhJUiBCdW5kbGUuIE5vdGhpbmcgbGVhdmVzIHRoZSB1c2VyJ3MgbWFjaGluZTsgbm8gYmFja2VuZFxuLy8gcmVxdWlyZWQuIE1pcnJvcnMgYmFja2VuZC91cGxvYWQtc3RydWN0dXJlZCBvcmRlcjogZW5jb3VudGVycyBmaXJzdCBzb1xuLy8gdGhhdCBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzIGNhbiBhdHRhY2ggcmVmZXJlbmNlcyB0byBkb3duc3RyZWFtXG4vLyBvYnNlcnZhdGlvbnMvbWVkaWNhdGlvbnMvZXRjLlxuXG5jb25zdCBfTE9DQUxfUEFHRV9UWVBFX09SREVSID0gW1xuICBcImVuY291bnRlcnNcIixcbiAgXCJvYnNlcnZhdGlvbnNcIixcbiAgXCJtZWRpY2F0aW9uc1wiLFxuICBcImNvbmRpdGlvbnNcIixcbiAgXCJhbGxlcmdpZXNcIixcbiAgXCJkaWFnbm9zdGljX3JlcG9ydHNcIixcbiAgXCJwcm9jZWR1cmVzXCIsXG5dO1xuXG4vLyBDaGVhcCBwcmUtZmxpZ2h0OiBkb2VzIHRoaXMgTkhJIHRhYiBoYXZlIGFuIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbj9cbi8vIFVzZXMgdGhlIHNhbWUgc2Vzc2lvblN0b3JhZ2UudG9rZW4gKyBsaWdodHdlaWdodCBBUEkgY2FsbCBwYXR0ZXJuIGFzXG4vLyBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkuIERvZXNuJ3QgcmV0dXJuIGFueXRoaW5nIFBJSSBcdTIwMTQganVzdCBhXG4vLyBib29sZWFuIGZvciB0aGUgcG9wdXAgdG8gZGVjaWRlIHdoZXRoZXIgdG8gc3VyZmFjZSBhIFwibG9nIGluIGZpcnN0XCJcbi8vIGJhbm5lci4gUmV0dXJucyBudWxsIHdoZW4gd2UgY2FuJ3QgdGVsbCAoc2NyaXB0LWluamVjdGlvbiBibG9ja2VkLFxuLy8gdGltZW91dCwgZXRjLikgc28gdGhlIHBvcHVwIGNhbiBmYWxsIGJhY2sgdG8gXCJlbmFibGVkXCIgcmF0aGVyIHRoYW5cbi8vIHNjYXJpbmcgdGhlIHVzZXIgd2l0aCBhIGZhbHNlIG5lZ2F0aXZlLlxuYXN5bmMgZnVuY3Rpb24gX2NoZWNrTmhpTG9naW5TdGF0ZSh0YWJJZCkge1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU2FtZSBlbmRwb2ludCBhcyB0aGUgY2lkIGF1dG8tZmV0Y2ggXHUyMDE0IGtub3duIHRvIG5lZWQgYW5cbiAgICAgICAgICAvLyBhdXRoZW50aWNhdGVkIHNlc3Npb24gYW5kIHRvIGJlIGNoZWFwLlxuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MTBzMDEvcGFnZV9sb2FkXCIsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0fWAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyA0MDEvNDAzIFx1MjE5MiBzZXNzaW9uIHRva2VuIHJlamVjdGVkLiAyMDAgXHUyMTkyIGxvZ2dlZCBpbi5cbiAgICAgICAgICByZXR1cm4gci5vaztcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09PSBcImJvb2xlYW5cIiA/IHJlc3VsdCA6IG51bGw7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8vIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZW5kcG9pbnQgSUhLRTM0MTBTMDEgKFx1NjIxMVx1NjNBNVx1N0EyRVx1N0QwMFx1OTMwNCAvIENPVklEIFx1N0JFOVx1NkFBMlx1N0QwMFx1OTMwNCkgaGFwcGVuc1xuLy8gdG8gY2FycnkgdGhlIGxvZ2dlZC1pbiB1c2VyJ3MgcmVhbCBjaXRpemVuIElEIGluIHRoZSByZXNwb25zZSAoYGNpZGBcbi8vIGZpZWxkLCBlLmcuIFwiUDEyMzQ1MDg2NlwiKS4gVXNlIGl0IHRvIGZpbGwgdGhlIHBhdGllbnRfb3ZlcnJpZGUnc1xuLy8gaWRfbm8gd2hlbiB0aGUgdXNlciBsZWZ0IGl0IGJsYW5rIFx1MjAxNCB0aGF0IHdheSB0aGV5IGRvbid0IGhhdmUgdG8gdHlwZVxuLy8gdGhlaXIgb3duIFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RiBqdXN0IHRvIHNlZWQgRkhJUidzIFBhdGllbnQuaWQuXG4vL1xuLy8gQXV0by1yZXBsYWNlIHBvbGljeTogb25seSBmaWxsIHdoZW4gdGhlIG92ZXJyaWRlIGlkX25vIGlzIG1pc3Npbmcgb3Jcbi8vIGlzIHN0aWxsIGFuIFwiYXV0by1YWFhYWFhYWFwiIHBsYWNlaG9sZGVyIGdlbmVyYXRlZCBieSBhbiBlYXJsaWVyIHNhdmUuXG4vLyBBbnl0aGluZyBlbHNlIChlLmcuIHVzZXIgbWFudWFsbHkgdHlwZWQgYSBmYWtlIElEIGZvciBzY3JlZW4tc2hhcmVcbi8vIG9yIGdyb3VwaW5nKSBpcyByZXNwZWN0ZWQgYXMtaXMuXG5hc3luYyBmdW5jdGlvbiBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCBjdXJyZW50ID0gcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCI7XG4gIGNvbnN0IGlzUGxhY2Vob2xkZXIgPSAhY3VycmVudCB8fCBjdXJyZW50LnN0YXJ0c1dpdGgoXCJhdXRvLVwiKTtcbiAgaWYgKCFpc1BsYWNlaG9sZGVyKSByZXR1cm4gcGF0aWVudE92ZXJyaWRlO1xuXG4gIGxldCBjaWQgPSBudWxsO1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0KSByZXR1cm4gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goXCIvYXBpL2loa2UzMDAwL2loa2UzNDEwczAxL3BhZ2VfbG9hZFwiLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLCBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dH1gIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgcmV0dXJuIGJvZHk/LmNpZCB8fCBudWxsO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBWYWxpZGF0ZSBpdCBsb29rcyBsaWtlIGEgVGFpd2FuIG5hdGlvbmFsIElEICgxIGxldHRlciArIDkgZGlnaXRzKVxuICAgIC8vIGJlZm9yZSB0cnVzdGluZyBpdC4gQXZvaWRzIGFjY2lkZW50YWxseSBwcm9tb3RpbmcgZ2FyYmFnZSB0byB0aGVcbiAgICAvLyBQYXRpZW50IHJlc291cmNlJ3MgdW5pcXVlIGtleS5cbiAgICBpZiAocmVzdWx0ICYmIC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChyZXN1bHQpKSBjaWQgPSByZXN1bHQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIElIS0UzNDEwIGNpZCBmZXRjaCBmYWlsZWQ6XCIsIGU/Lm1lc3NhZ2UgPz8gZSk7XG4gIH1cblxuICBpZiAoY2lkICYmIGNpZCAhPT0gY3VycmVudCkge1xuICAgIHBhdGllbnRPdmVycmlkZSA9IHsgLi4ucGF0aWVudE92ZXJyaWRlLCBpZF9ubzogY2lkIH07XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcGF0aWVudE92ZXJyaWRlIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgfVxuICByZXR1cm4gcGF0aWVudE92ZXJyaWRlO1xufVxuXG4vLyBSZWFkIHRoZSBtYXNrLW5hbWUgcHJlZmVyZW5jZSBmcmVzaCBmcm9tIHN0b3JhZ2UuIFdlIGRvbid0IGNhY2hlIFx1MjAxNFxuLy8gcnVuTmhpQXBpU3luYyBpcyBpbnZva2VkIGF0IG1vc3QgYSBmZXcgdGltZXMgcGVyIHNlc3Npb24gYW5kIHRoZSBTV1xuLy8gY2FuIGJlIHRvcm4gZG93biArIHJlc3RhcnRlZCBhbnkgdGltZSwgc28gYSBzaW5nbGUgZ2V0KCkgcGVyIHN5bmMgaXNcbi8vIGNoZWFwZXIgdGhhbiBzeW5jaW5nIHN0YXRlIGFjcm9zcyBTVyBsaWZlY3ljbGVzLlxuYXN5bmMgZnVuY3Rpb24gX2lzTWFza0VuYWJsZWQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBtYXNrTmFtZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcIm1hc2tOYW1lRW5hYmxlZFwiKTtcbiAgICByZXR1cm4gbWFza05hbWVFbmFibGVkID09PSB0cnVlO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2J1aWxkT3ZlcnJpZGVQYXRpZW50KG92LCBtYXNrRW5hYmxlZCkge1xuICBjb25zdCBkaXNwbGF5TmFtZSA9IG1hc2tFbmFibGVkID8gbWFza05hbWUob3YubmFtZSB8fCBcIlwiKSA6IG92Lm5hbWUgfHwgXCJcIjtcbiAgY29uc3QgcmF3ID0ge1xuICAgIGlkOiBvdi5pZF9ubyxcbiAgICBpZGVudGlmaWVyOiBvdi5pZF9ubyxcbiAgICBuYW1lOiBkaXNwbGF5TmFtZSB8fCBvdi5pZF9ubyxcbiAgfTtcbiAgaWYgKG92LmJpcnRoX2RhdGUpIHJhdy5iaXJ0aERhdGUgPSBvdi5iaXJ0aF9kYXRlO1xuICBpZiAob3YuZ2VuZGVyKSByYXcuZ2VuZGVyID0gb3YuZ2VuZGVyO1xuICByZXR1cm4gbWFwUGF0aWVudChyYXcpO1xufVxuXG4vLyBXYWxrIGEgSlNPTi1saWtlIHZhbHVlIGFuZCByZXBsYWNlIGV2ZXJ5IHN0cmluZyB0b2tlbiBlcXVhbCB0byBvclxuLy8gY29udGFpbmluZyBgbmVlZGxlYCB3aXRoIGByZXBsYWNlbWVudGAuIFVzZWQgdG8gc2NydWIgdGhlIHJlYWxcbi8vIHBhdGllbnQgbmFtZSBvdXQgb2YgTkhJIG5hcnJhdGl2ZSBmaWVsZHMgKGNsaW5pY2FsX25vdGUsIGNvbmNsdXNpb24sXG4vLyBub3RlLCBldGMuKSBiZWZvcmUgdGhlIGl0ZW1zIHJlYWNoIHRoZSBtYXBwZXIuIE9ubHkgdHJpZ2dlcmVkIHdoZW5cbi8vIHRoZSB1c2VyIGhhcyBvcHRlZCBpbnRvIG1hc2tpbmcgQU5EIHN1cHBsaWVkIGEgbmFtZSBcdTIwMTQgYW5kIHRoZVxuLy8gc3Vic3RpdHV0aW9uIGlzIGV4YWN0LXRva2VuLXJlcGxhY2UsIG5vdCBmdXp6eSwgc28gaXQgY2FuJ3Qgc3VycHJpc2Vcbi8vIHRoZSB1c2VyIGJ5IGNsb2JiZXJpbmcgdW5yZWxhdGVkIGNvbnRlbnQuXG5mdW5jdGlvbiBfcmVwbGFjZU5hbWVEZWVwKHZhbHVlLCBuZWVkbGUsIHJlcGxhY2VtZW50KSB7XG4gIGlmICghbmVlZGxlIHx8IG5lZWRsZSA9PT0gcmVwbGFjZW1lbnQpIHJldHVybiB2YWx1ZTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHZhbHVlLnNwbGl0KG5lZWRsZSkuam9pbihyZXBsYWNlbWVudCk7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkgcmV0dXJuIHZhbHVlLm1hcCgodikgPT4gX3JlcGxhY2VOYW1lRGVlcCh2LCBuZWVkbGUsIHJlcGxhY2VtZW50KSk7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gdmFsdWUpIG91dFtrXSA9IF9yZXBsYWNlTmFtZURlZXAodmFsdWVba10sIG5lZWRsZSwgcmVwbGFjZW1lbnQpO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBfYXNzZW1ibGVMb2NhbEJ1bmRsZShieVR5cGUsIHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpIHtcbiAgY29uc3QgcGF0aWVudCA9IF9idWlsZE92ZXJyaWRlUGF0aWVudChwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKTtcbiAgY29uc3QgcGlkID0gcGF0aWVudC5pZDtcbiAgY29uc3QgYWxsID0gW3BhdGllbnRdO1xuXG4gIGZvciAoY29uc3QgcHQgb2YgX0xPQ0FMX1BBR0VfVFlQRV9PUkRFUikge1xuICAgIGNvbnN0IGl0ZW1zID0gYnlUeXBlW3B0XTtcbiAgICBpZiAoIWl0ZW1zIHx8IGl0ZW1zLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgbGV0IG1hcHBlZDtcbiAgICBpZiAoR1JPVVBfSEFORExFUlNbcHRdKSB7XG4gICAgICBtYXBwZWQgPSBHUk9VUF9IQU5ETEVSU1twdF0oaXRlbXMsIHBpZCk7XG4gICAgfSBlbHNlIGlmIChMSVNUX0hBTkRMRVJTW3B0XSkge1xuICAgICAgY29uc3QgW2ZuXSA9IExJU1RfSEFORExFUlNbcHRdO1xuICAgICAgbWFwcGVkID0gaXRlbXNcbiAgICAgICAgLmZpbHRlcigoaXQpID0+IGl0ICYmIHR5cGVvZiBpdCA9PT0gXCJvYmplY3RcIilcbiAgICAgICAgLm1hcCgoaXQpID0+IGZuKGl0LCBwaWQpKVxuICAgICAgICAuZmlsdGVyKChyKSA9PiByICE9PSBudWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChwdCA9PT0gXCJlbmNvdW50ZXJzXCIpIG1hcHBlZCA9IGRlZHVwQWRtaXNzaW9uRGF5QW1iKG1hcHBlZCk7XG4gICAgYWxsLnB1c2goLi4ubWFwcGVkKTtcbiAgfVxuXG4gIC8vIERlZHVwIGJ5IChyZXNvdXJjZVR5cGUsIGlkKSBiZWZvcmUgYXNzZW1ibGluZyB0aGUgQnVuZGxlLiBNdWx0aXBsZVxuICAvLyBOSEkgZW5kcG9pbnRzIGNhbiBmZWVkIHRoZSBzYW1lIHBhZ2VfdHlwZSAoZS5nLiBlbmNvdW50ZXJzIC9cbiAgLy8gaW5wYXRpZW50IC8gaW5wYXRpZW50X2xlZ2FjeSBhbGwgXHUyMTkyIHBhZ2VfdHlwZT1cImVuY291bnRlcnNcIiksIGFuZCB0aGVcbiAgLy8gbWFwcGVyIHByb2R1Y2VzIGRldGVybWluaXN0aWMgc3RhYmxlIElEcyBcdTIwMTQgc28gdHdvIHJhdyBpdGVtcyB0aGF0XG4gIC8vIGRlc2NyaWJlIHRoZSBzYW1lIG1lZGljYWwgZXZlbnQgY29sbGFwc2UgdG8gb25lIHJlc291cmNlLiBCYWNrZW5kXG4gIC8vIHVwc2VydCBoYW5kbGVzIHRoaXMgYXV0b21hdGljYWxseSAoc2FtZSBzdGFibGUgSUQgPSBzYW1lIERCIHJvdyk7XG4gIC8vIGxvY2FsIG1vZGUgaGFzIHRvIGRvIGl0IGV4cGxpY2l0bHkuIFdpdGhvdXQgdGhpcyBkZWR1cCwgdGhlIGxvY2FsXG4gIC8vIEJ1bmRsZSBlbmRzIHVwIGluZmxhdGVkIHJlbGF0aXZlIHRvIHdoYXQgYmFja2VuZCBzdG9yZXMgZnJvbSB0aGVcbiAgLy8gaWRlbnRpY2FsIE5ISSBpbnB1dC5cbiAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgY29uc3QgdW5pcXVlID0gW107XG4gIGZvciAoY29uc3QgciBvZiBhbGwpIHtcbiAgICBjb25zdCBrZXkgPSBgJHtyLnJlc291cmNlVHlwZX0vJHtyLmlkfWA7XG4gICAgaWYgKHNlZW4uaGFzKGtleSkpIGNvbnRpbnVlO1xuICAgIHNlZW4uYWRkKGtleSk7XG4gICAgdW5pcXVlLnB1c2gocik7XG4gIH1cblxuICAvLyBMaW5rZXIgKyBzZXgtc3RyYXRpZmllZCByZXNvbHZlciBydW4gb25jZSBvdmVyIHRoZSBmdWxsIGFzc2VtYmxlZFxuICAvLyBsaXN0IChzYW1lIHBpcGVsaW5lIGJhY2tlbmQncyAvc3luYy91cGxvYWQtc3RydWN0dXJlZCBydW5zLCBqdXN0XG4gIC8vIGFnYWluc3QgYW4gaW4tbWVtb3J5IGNhbmRpZGF0ZSBhcnJheSBpbnN0ZWFkIG9mIGEgU1FMaXRlIHF1ZXJ5KS5cbiAgbGlua0VuY291bnRlcnNJblJlc291cmNlcyh1bmlxdWUsIHVuaXF1ZSk7XG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzKHBhdGllbnQsIHVuaXF1ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQnVuZGxlXCIsXG4gICAgdHlwZTogXCJjb2xsZWN0aW9uXCIsXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvXFwuXFxkK1okLywgXCJaXCIpLFxuICAgIGVudHJ5OiB1bmlxdWUubWFwKChyKSA9PiAoe1xuICAgICAgZnVsbFVybDogYCR7ci5yZXNvdXJjZVR5cGV9LyR7ci5pZH1gLFxuICAgICAgcmVzb3VyY2U6IHIsXG4gICAgfSkpLFxuICB9O1xufVxuXG4vLyBMb2NhbCBtb2RlIHN0YXNoZXMgdGhlIGFzc2VtYmxlZCBCdW5kbGUgaW4gY2hyb21lLnN0b3JhZ2UubG9jYWwgdW5kZXJcbi8vIGEgc2luZ2xlIFwicGVuZGluZ0ZoaXJCdW5kbGVcIiBzbG90LiBUaGUgcG9wdXAgc2hvd3MgYSBkb3dubG9hZCBidXR0b25cbi8vIHdoZW4gdGhpcyBzbG90IGlzIG5vbi1lbXB0eTsgdGhlIGFjdHVhbCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGNhbGxcbi8vIGhhcHBlbnMgZnJvbSB0aGUgcG9wdXAgKGluIHJlc3BvbnNlIHRvIGEgdXNlciBjbGljaykgc28gdGhlIGZpbGVcbi8vIGRvZXNuJ3QgYXBwZWFyIGluIHRoZSBEb3dubG9hZHMgYmFyIHVuaW52aXRlZC5cbi8vXG4vLyBTaW5nbGUgc2xvdCBtZWFucyBhIG5ldyBzeW5jIG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzIHBlbmRpbmcgYnVuZGxlLlxuLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwgZGVmYXVsdCBxdW90YSBpcyAxMCBNQjsgYSB0eXBpY2FsIE5ISSBzeW5jIGlzXG4vLyB3ZWxsIHVuZGVyIDIgTUIuXG5jb25zdCBQRU5ESU5HX0JVTkRMRV9LRVkgPSBcInBlbmRpbmdGaGlyQnVuZGxlXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50SWQsIGRhdGVSYW5nZSkge1xuICAvLyBGaWxlbmFtZTogbmhpLXtwaWR9LXtzdGFydFlZWVlNTUREfS17ZW5kWVlZWU1NRER9Lmpzb25cbiAgLy8gV2hlbiBubyBleHBsaWNpdCBkYXRlUmFuZ2UgKE5ISSBkZWZhdWx0ID0gXHU4RkQxIDEgXHU1RTc0KSwgc3ludGhlc2l6ZSB0b2RheS0xeSBcdTIxOTIgdG9kYXkuXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgXCIwXCIpO1xuICBjb25zdCBmbXQgPSAoZCkgPT4gYCR7ZC5nZXRGdWxsWWVhcigpfSR7cGFkKGQuZ2V0TW9udGgoKSArIDEpfSR7cGFkKGQuZ2V0RGF0ZSgpKX1gO1xuICAvLyBIYWxmLW1hc2sgdGhlIElEIGluIHRoZSBmaWxlbmFtZSBzbyB0aGUgdXNlcidzIERvd25sb2FkcyBmb2xkZXJcbiAgLy8gZG9lc24ndCBsZWFrIHRoZSBmdWxsIFx1OEVBQlx1NTIwNlx1OEI0OSAod291bGQgYmUgdmlzaWJsZSB0byBhbnlvbmUgc2VlaW5nXG4gIC8vIGEgZmlsZSBsaXN0aW5nIG9yIGRvd25sb2FkLWJhciBwcmV2aWV3KS4gYFhgIGJlY2F1c2UgYCpgIGlzXG4gIC8vIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gQnVuZGxlIENPTlRFTlRTIHN0aWxsIGNhcnJ5IHRoZSByZWFsXG4gIC8vIElEIHVuZGVyIFBhdGllbnQuaWQgXHUyMDE0IGZpbGUgb3duZXIga25vd3Mgd2hvc2UgZGF0YSBpdCBpcy5cbiAgY29uc3QgbWFza2VkUGlkID0gbWFza0lkKHBhdGllbnRJZCB8fCBcInVua25vd25cIiwgXCJYXCIpO1xuICBjb25zdCBzYWZlUGlkID0gbWFza2VkUGlkLnJlcGxhY2UoL1teQS1aYS16MC05Xy1dL2csIFwiX1wiKTtcbiAgY29uc3QgY29tcGFjdCA9IChkKSA9PiAoZCB8fCBcIlwiKS5zbGljZSgwLCAxMCkucmVwbGFjZSgvLS9nLCBcIlwiKTtcbiAgbGV0IHMsIGU7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIHMgPSBjb21wYWN0KGRhdGVSYW5nZS5zdGFydCkgfHwgZm10KG5vdyk7XG4gICAgZSA9IGNvbXBhY3QoZGF0ZVJhbmdlLmVuZCkgfHwgZm10KG5vdyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb25lWWVhckFnbyA9IG5ldyBEYXRlKG5vdyk7XG4gICAgb25lWWVhckFnby5zZXRGdWxsWWVhcihvbmVZZWFyQWdvLmdldEZ1bGxZZWFyKCkgLSAxKTtcbiAgICBzID0gZm10KG9uZVllYXJBZ28pO1xuICAgIGUgPSBmbXQobm93KTtcbiAgfVxuICBjb25zdCBmaWxlbmFtZSA9IGBuaGktJHtzYWZlUGlkfS0ke3N9LSR7ZX0uanNvbmA7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShidW5kbGUsIG51bGwsIDIpO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIFtQRU5ESU5HX0JVTkRMRV9LRVldOiB7XG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGpzb24sXG4gICAgICBieXRlczoganNvbi5sZW5ndGgsXG4gICAgICBnZW5lcmF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIHBhdGllbnRJZDogcGF0aWVudElkIHx8IG51bGwsXG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiB7IGZpbGVuYW1lLCBieXRlczoganNvbi5sZW5ndGggfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuTmhpQXBpU3luYyh7IHRhYklkLCBtb2RlLCBiYWNrZW5kLCBzeW5jQXBpS2V5LCBuaGlCYXNlLCBwYXRpZW50T3ZlcnJpZGUsIGRhdGVSYW5nZSwgZGF0ZVJhbmdlTGFiZWwgfSkge1xuICBfY2FuY2VsbGVkID0gZmFsc2U7XG4gIGNvbnN0IEJBU0UgPSBuaGlCYXNlIHx8IGBodHRwczovLyR7TkhJX0hPU1R9YDtcblxuICBpZiAoIXBhdGllbnRPdmVycmlkZSkge1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU4QUNCXHU1MTQ4XHU1NzI4IHBvcHVwIFx1NTg2Qlx1NUJFQlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1NUY4Q1x1NTE4RFx1OEE2NlwiLFxuICAgICAgICBwaGFzZTogXCJlcnJvclwiLCB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCF0YWJJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkFQSSBzeW5jIHJlcXVpcmVzIE5ISSB0YWIgaWQgKGNvb2tpZXMgYXJlIGZpcnN0LXBhcnR5KVwiKTtcbiAgfVxuXG4gIC8vIEZpcnN0IGNoYW5jZSB0byB1cGdyYWRlIHRoZSBwYXRpZW50IElEOiBpZiB0aGUgcG9wdXAgZ2F2ZSB1cyBhblxuICAvLyBcImF1dG8tWFhYWFhYWFhcIiBwbGFjZWhvbGRlciAodXNlciBkaWRuJ3QgbWFudWFsbHkgdHlwZSBvbmUpLFxuICAvLyBmZXRjaCB0aGUgcmVhbCBvbmUgZnJvbSBOSEkncyBJSEtFMzQxMFMwMSBlbmRwb2ludCAocmVzcG9uc2UuY2lkXG4gIC8vIGlzIHRoZSBjaXRpemVuIElEKS4gUGVyc2lzdCBiYWNrIHRvIHN0b3JhZ2Ugc28gc3Vic2VxdWVudCBzeW5jc1xuICAvLyBhcmUgc3RhYmxlLiBNYW51YWxseS10eXBlZCBJRHMgYXJlIHJlc3BlY3RlZCBhcy1pcy5cbiAgcGF0aWVudE92ZXJyaWRlID0gYXdhaXQgX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpKHRhYklkLCBwYXRpZW50T3ZlcnJpZGUpO1xuXG4gIC8vIFN0YXNoIGNvbnRleHQgc28gdGhlIHN0b3BTeW5jIG1lc3NhZ2UgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4gIC8vIGRhdGEgKERFTEVURSAvc3luYy9wYXRpZW50L3tpZF9ub30pIHdpdGhvdXQgdXMgaGF2aW5nIHRvIHNlbmQgaXRcbiAgLy8gYmFjayB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlLlxuICBfYWN0aXZlU3luY0N0eCA9IHsgYmFja2VuZCwgc3luY0FwaUtleSwgcGF0aWVudElkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfTtcblxuICAvLyBXYWxsLWNsb2NrIHN0YXJ0IHRpbWUgXHUyMDE0IHVzZWQgdG8gY29tcHV0ZSBlbGFwc2VkIHNlY29uZHMgZm9yIHRoZVxuICAvLyBmaW5hbCBzdGF0dXMgbGluZSAoXCJcdTdFM0RcdTgwMTdcdTY2NDIgMTIuMyBcdTc5RDJcIikuIFN0YXNoIG9uIGEgbG9jYWwgc28gd2UgY2FuXG4gIC8vIHJlYWNoIGl0IGZyb20gdGhlIGNvbXBsZXRpb24gbWVzc2FnZSBhdCB0aGUgdmVyeSBlbmQuXG4gIGNvbnN0IF90MCA9IERhdGUubm93KCk7XG4gIC8vIFBlci1waGFzZSB0aW1pbmdzLCBzdXJmYWNlZCBpbnRvIHRoZSBwb3B1cCdzIFwiXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwXCIgc28gdGhlIHVzZXJcbiAgLy8gY2FuIHNlZSBleGFjdGx5IHdoZXJlIHRpbWUgaXMgZ29pbmcuIEVhY2ggZW50cnk6IHsgbmFtZSwgbXMgfS5cbiAgY29uc3QgX3BoYXNlcyA9IFtdO1xuICBsZXQgX3BoYXNlU3RhcnQgPSBfdDA7XG4gIGNvbnN0IF9tYXJrUGhhc2UgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgX3BoYXNlcy5wdXNoKHsgbmFtZSwgbXM6IG5vdyAtIF9waGFzZVN0YXJ0IH0pO1xuICAgIF9waGFzZVN0YXJ0ID0gbm93O1xuICB9O1xuICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgIHJ1bm5pbmc6IHRydWUsIHByb2dyZXNzOiBcIlx1RDgzRFx1REU4MCBcdTk1OEJcdTU5Q0JcdTUzRDZcdTVGOTdcdTUwNjVcdTRGRERcdTVCNThcdTY0N0FcdThDQzdcdTY1OTlcdTIwMjZcIiwgcGhhc2U6IFwiaW5pdFwiLFxuICAgIHN0YXJ0ZWQ6IF90MCwgdG90YWxSZXNvdXJjZXM6IDAsIGhvc3Q6IE5ISV9IT1NULCBlcnJvcnM6IFtdLFxuICB9KTtcblxuICAvLyBTdGVwIDE6IGZldGNoIGFsbCBlbmRwb2ludHMgaW4gUEFSQUxMRUwgaW5zaWRlIHRoZSBOSEkgdGFiLiBSdW5uaW5nIGluXG4gIC8vIHRhYiBjb250ZXh0IG1lYW5zIHNhbWUtb3JpZ2luIGNvb2tpZXMgYXJlIHNlbnQgYXV0b21hdGljYWxseSBcdTIwMTQgZmV0Y2hcbiAgLy8gZnJvbSB0aGUgU1cgd291bGQgYmUgY3Jvc3Mtb3JpZ2luIGFuZCBTYW1lU2l0ZSBibG9ja3MgdGhlIHNlc3Npb25cbiAgLy8gY29va2llLCBoZW5jZSB3ZSBnb3QgXCJzZXNzaW9uIGV4cGlyZWRcIiBldmVuIHdoZW4gbG9nZ2VkIGluLlxuICAvLyBQYXNzIG9ubHkgc2VyaWFsaXNhYmxlIGRhdGEgKHBhdGhzLCBtZXRob2QsIG5hbWUpOyBhZGFwdGVycyBzdGF5IGluIFNXLlxuICAvLyBJbmplY3QgSVNPLWRhdGUgcmFuZ2UgaW50byBlYWNoIGVuZHBvaW50IHRoYXQgc3VwcG9ydHMgaXQgKGNvbnZlcnRzXG4gIC8vIHRvIFx1NkMxMVx1NTcwQiBmb3JtYXQgdmlhIGlzb1RvUk9DKS4gU2tpcHBlZCBlbmRwb2ludHMga2VlcCB0aGVpciBkZWZhdWx0XG4gIC8vIE5ISS1zaWRlIHdpbmRvdyAoMS0yIHllYXJzIGRlcGVuZGluZyBvbiB0aGUgcGFnZSkuXG4gIGNvbnN0IGZldGNoU3BlYyA9IE5ISV9BUElfRU5EUE9JTlRTLm1hcCgoZXApID0+IHtcbiAgICBjb25zdCBwYXRoID0gZXAuc3VwcG9ydHNEYXRlUmFuZ2UgPyBhcHBseURhdGVSYW5nZVRvUGF0aChlcC5wYXRoLCBkYXRlUmFuZ2UpIDogZXAucGF0aDtcbiAgICByZXR1cm4geyBuYW1lOiBlcC5uYW1lLCB1cmw6IEJBU0UgKyBwYXRoLCBtZXRob2Q6IFwiR0VUXCIgfTtcbiAgfSk7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIGNvbnNvbGUubG9nKFwiW05ISSBBUEkgc3luY10gZGF0ZSByYW5nZTpcIixcbiAgICAgIGAke2RhdGVSYW5nZS5zdGFydCB8fCBcIih1bmJvdW5kZWQpXCJ9IFx1MjE5MiAke2RhdGVSYW5nZS5lbmQgfHwgXCIodW5ib3VuZGVkKVwifWApO1xuICB9XG5cbiAgbGV0IHNldHRsZWRSYXc7XG4gIHRyeSB7XG4gICAgW3sgcmVzdWx0OiBzZXR0bGVkUmF3IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgZnVuYzogYXN5bmMgKHNwZWNzKSA9PiB7XG4gICAgICAgIC8vIE5ISSBhdXRoOiBjb29raWVzICsgSldUIGluIHNlc3Npb25TdG9yYWdlLiBUaGUgU1BBJ3MgYXhpb3Mgc2V0c1xuICAgICAgICAvLyBgQXV0aG9yaXphdGlvbjogQmVhcmVyIDx0b2tlbj5gIG9uIGV2ZXJ5IEFQSSBjYWxsLiBTZXNzaW9uXG4gICAgICAgIC8vIGNvb2tpZXMgYWxvbmUgcmV0dXJuIDQwMS5cbiAgICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdG9rZW4pIHJldHVybiBbeyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9XTtcbiAgICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuXG4gICAgICAgIC8vIERldGVjdCBJRExFL3RpbWVvdXQgcGFnZSBhbHJlYWR5IHJlZGlyZWN0ZWQgb24gdGhpcyB0YWIuXG4gICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgICByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyA2MC1zZWNvbmQgdGltZW91dCBwZXIgZmV0Y2ggXHUyMDE0IHNvbWUgTkhJIGVuZHBvaW50cyAoZW5jb3VudGVycyxcbiAgICAgICAgLy8gbWVkcykgdGFrZSAyMCsgc2Vjb25kcy5cbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocywgbXMpIHtcbiAgICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgbXMpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2gocy51cmwsIHtcbiAgICAgICAgICAgICAgbWV0aG9kOiBzLm1ldGhvZCxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgICAgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBjb25zdCBjdCA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICAgIGlmICghY3QuaW5jbHVkZXMoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IGBub24tSlNPTiAoY3Q9JHtjdH0pYCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgICAgICB0cnkgeyBib2R5ID0gYXdhaXQgci5qc29uKCk7IH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiSlNPTiBwYXJzZTogXCIgKyBlLm1lc3NhZ2UgfTsgfVxuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBib2R5IH07XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIGlmIChlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiKSByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcInRpbWVvdXQgNjBzXCIgfTtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uY3VycmVuY3ktbGltaXRlZCBleGVjdXRpb246IG1heCAzIGluIGZsaWdodCBhdCBvbmNlLiBOSEknc1xuICAgICAgICAvLyBhYnVzZSBkZXRlY3Rpb24gYmxvY2tzIGJ1cnN0czsgd2l0aCAxMSBwYXJhbGxlbCBmZXRjaGVzIGl0XG4gICAgICAgIC8vIHRocm90dGxlZCB0aGUgc2Vzc2lvbiBhbmQgcmVkaXJlY3RlZCB0byBJSEtFMzAwMVM5OV9JRExFLlxuICAgICAgICAvLyAzIGF0IGEgdGltZSArIDIwMG1zIGppdHRlciBpcyBnZW50bGUgZW5vdWdoIGZvciAxLXNob3Qgc3luYy5cbiAgICAgICAgY29uc3QgQ09OQ1VSUkVOQ1kgPSAzO1xuICAgICAgICBjb25zdCBKSVRURVJfTVMgPSAyMDA7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBuZXcgQXJyYXkoc3BlY3MubGVuZ3RoKTtcbiAgICAgICAgbGV0IG5leHRJZHggPSAwO1xuICAgICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgICAgd2hpbGUgKG5leHRJZHggPCBzcGVjcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBuZXh0SWR4Kys7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIEpJVFRFUl9NUykpO1xuICAgICAgICAgICAgcmVzdWx0c1tpXSA9IGF3YWl0IGZldGNoT25lKHNwZWNzW2ldLCA2MDAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdvcmtlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DVVJSRU5DWSAmJiB3IDwgc3BlY3MubGVuZ3RoOyB3KyspIHtcbiAgICAgICAgICB3b3JrZXJzLnB1c2god29ya2VyKCkpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdvcmtlcnMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0sXG4gICAgICBhcmdzOiBbZmV0Y2hTcGVjXSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgZXhlY3V0ZVNjcmlwdCBmYWlsZWQ6ICR7ZS5tZXNzYWdlfWApO1xuICB9XG5cbiAgLy8gRGV0ZWN0IHNlc3Npb24gZXhwaXJlZCBhY3Jvc3MgcmVzdWx0cy5cbiAgaWYgKHNldHRsZWRSYXcuc29tZSgocikgPT4gci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoU0VTU0lPTl9FWFBJUkVEX0VSUk9SKTtcbiAgfVxuXG4gIGNvbnN0IGVycm9ycyA9IFtdO1xuXG4gIC8vIEdlbmVyaWMgbGlzdCBleHRyYWN0aW9uOiBoYW5kbGVzIGFsbCBvYnNlcnZlZCBOSEkgc2hhcGVzLlxuICAvLyAgIC0gUGxhaW4gYXJyYXkgKElIS0UzNDA5IGxhYilcbiAgLy8gICAtIHtzcF9JSEtFPFg+X2RhdGE6IFsuLi5dfSAgKG1lZGljYXRpb25zLCBhbGxlcmdpZXMpXG4gIC8vICAgLSB7d2VzdGVybl9kYXRhLCBjaGluZXNlX2RhdGEsIGRlbnRpc3RfZGF0YTogWy4uLl19IChlbmNvdW50ZXIgbGlzdCxcbiAgLy8gICAgIHNwbGl0IGJ5IFx1ODk3Rlx1OTFBQi9cdTRFMkRcdTkxQUIvXHU3MjU5XHU5MUFCIFx1MjAxNCB3ZSB3YW50IGFsbCB0aHJlZSlcbiAgLy8gRm9yIG11bHRpLWFycmF5IHNoYXBlcyB3ZSBtZXJnZSBhbGwgYXJyYXlzIGFuZCB0YWcgZWFjaCBpdGVtIHdpdGhcbiAgLy8gYF9fc2VjdGlvbmAgKHRoZSBzb3VyY2Uga2V5KSBzbyBhZGFwdGVycyBjYW4gZGlzYW1iaWd1YXRlLlxuICBmdW5jdGlvbiBleHRyYWN0TGlzdChib2R5KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYm9keSkpIHJldHVybiBib2R5O1xuICAgIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIFtdO1xuICAgIGxldCBhcnJheUtleXMgPSBPYmplY3QuZW50cmllcyhib2R5KS5maWx0ZXIoKFtfLCB2XSkgPT4gQXJyYXkuaXNBcnJheSh2KSk7XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgICBpZiAoYXJyYXlLZXlzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTtcbiAgICAvLyBNdWx0aXBsZSBhcnJheXMgXHUyMDE0IGRyb3AgVUktaGVscGVyIGFycmF5cyAoZHJvcGRvd24gb3B0aW9ucywgc29ydFxuICAgIC8vIHNlbGVjdG9ycywgbG9va3VwIHRhYmxlcykuIE5ISSBtaXhlcyB0aGVtIGludG8gdGhlIHNhbWUgcmVzcG9uc2VcbiAgICAvLyAoZS5nLiBpbWFnaW5nIHJldHVybnMgc3BfSUhLRTM0MDhTMDFfZGF0YSArIGljZDljbV9zZWxlY3QpLlxuICAgIGNvbnN0IEhFTFBFUl9SRSA9IC9zZWxlY3R8b3B0aW9ufGRyb3Bkb3dufGZpbHRlcnxzb3J0fGxvb2t1cC9pO1xuICAgIGNvbnN0IGRhdGFLZXlzID0gYXJyYXlLZXlzLmZpbHRlcigoW2tdKSA9PiAhSEVMUEVSX1JFLnRlc3QoaykpO1xuICAgIGlmIChkYXRhS2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBkYXRhS2V5c1swXVsxXTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gYXJyYXlLZXlzWzBdWzFdOyAvLyBmYWxsYmFja1xuICAgIGFycmF5S2V5cyA9IGRhdGFLZXlzO1xuICAgIC8vIE11bHRpcGxlIGRhdGEgYXJyYXlzIChlLmcuIHdlc3Rlcm5fZGF0YS9jaGluZXNlX2RhdGEvZGVudGlzdF9kYXRhKVxuICAgIC8vIFx1MjAxNCBtZXJnZSB3aXRoIF9fc2VjdGlvbiB0YWcgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBhcnJheUtleXMpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSB7XG4gICAgICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goeyAuLi5pdGVtLCBfX3NlY3Rpb246IGsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVyZ2VkLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfVxuXG4gIC8vIEFwcGx5IFNXLXNpZGUgYWRhcHRlcnMgdG8gZWFjaCBlbmRwb2ludCdzIGJvZHkuXG4gIGNvbnN0IHNldHRsZWQgPSBzZXR0bGVkUmF3Lm1hcCgociwgaSkgPT4ge1xuICAgIGNvbnN0IGVwID0gTkhJX0FQSV9FTkRQT0lOVFNbaV07XG4gICAgaWYgKHIuZXJyb3IpIHtcbiAgICAgIHJldHVybiB7IHN0YXR1czogXCJyZWplY3RlZFwiLCByZWFzb246IHsgbWVzc2FnZTogYCR7ZXAubmFtZX06ICR7ci5lcnJvcn1gIH0gfTtcbiAgICB9XG4gICAgY29uc3QgbGlzdCA9IGV4dHJhY3RMaXN0KHIuYm9keSk7XG4gICAgLy8gQWRhcHRlcnMgcmV0dXJuIGVpdGhlcjpcbiAgICAvLyAgIC0gb25lIGl0ZW0gICAobW9zdCBhZGFwdGVycyBcdTIwMTQgbGFicywgbWVkcywgZW5jb3VudGVycywgaW1hZ2luZylcbiAgICAvLyAgIC0gbnVsbC91bmRlZmluZWQgKHNraXApXG4gICAgLy8gICAtIGFycmF5IG9mIGl0ZW1zIChhZGFwdEFkdWx0UHJldmVudGl2ZSBcdTIwMTQgdW5mb2xkcyBvbmUgc2NyZWVuaW5nXG4gICAgLy8gICAgIHJvdyBpbnRvIH4xNSBPYnNlcnZhdGlvbiBlbnRyaWVzKVxuICAgIC8vIEZsYXQtaGFuZGxlIGJvdGggc2hhcGVzIHNvIGVhY2ggYWRhcHRlciBjYW4gcGljayB3aGF0ZXZlcidzIGNsZWFyZXN0LlxuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgZm9yIChjb25zdCBpdCBvZiBsaXN0KSB7XG4gICAgICBjb25zdCByID0gZXAuYWRhcHQoaXQpO1xuICAgICAgaWYgKHIgPT09IG51bGwgfHwgciA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHIpKSB7XG4gICAgICAgIGZvciAoY29uc3QgeCBvZiByKSBpZiAoeCkgaXRlbXMucHVzaCh4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zLnB1c2gocik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNuYXBzaG90IGEgYm9keSBzYW1wbGUgZm9yIHNoYXBlcyB3aGVyZSBhZGFwdGVyIHJlamVjdGVkIGV2ZXJ5dGhpbmdcbiAgICAvLyBcdTIwMTQgdXNlZCBieSB0aGUgZGlhZ25vc3RpYyBicmVha2Rvd24gaW4gc3RlcCAyLlxuICAgIGxldCBib2R5U2FtcGxlID0gbnVsbDtcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwICYmIGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gSW5jbHVkZSB0aGUgRklSU1QgSVRFTSAoZnVsbCBrZXlzK3ZhbHVlcykgc28gd2UgY2FuIGJ1aWxkIHRoZVxuICAgICAgLy8gY29ycmVjdCBhZGFwdGVyIHdpdGhvdXQgYW5vdGhlciByb3VuZC10cmlwLiBOSEkgaXRlbXMgbWF5IGluY2x1ZGVcbiAgICAgIC8vIFBJSTsgdGhlIHVzZXIgaW5zcGVjdHMgdGhpcyBsb2NhbGx5IHZpYSBzZXJ2aWNlLXdvcmtlciBkZXZ0b29scy5cbiAgICAgIGJvZHlTYW1wbGUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHRvcExldmVsS2V5czogQXJyYXkuaXNBcnJheShyLmJvZHkpID8gbnVsbCA6IE9iamVjdC5rZXlzKHIuYm9keSB8fCB7fSkuc2xpY2UoMCwgMTApLFxuICAgICAgICB3YXNBcnJheTogQXJyYXkuaXNBcnJheShyLmJvZHkpLFxuICAgICAgICBmaXJzdEl0ZW06IGxpc3RbMF0gPz8gbnVsbCxcbiAgICAgICAgc2Vjb25kSXRlbTogbGlzdFsxXSA/PyBudWxsLFxuICAgICAgfSkuc2xpY2UoMCwgNDAwMCk7XG4gICAgfVxuICAgIHJldHVybiB7IHN0YXR1czogXCJmdWxmaWxsZWRcIiwgdmFsdWU6IHsgZXAsIGl0ZW1zLCByYXdfY291bnQ6IGxpc3QubGVuZ3RoLCBib2R5U2FtcGxlLCByYXdMaXN0OiBsaXN0IH0gfTtcbiAgfSk7XG5cbiAgX21hcmtQaGFzZShcIm5oaS1wYXJhbGxlbFwiKTtcblxuICAvLyBTdGVwIDFhOiBlbmNvdW50ZXIgZGV0YWlsIGZhbi1vdXQgKElIS0UzMzAzUzAyKSBcdTIxOTIgY2xhc3NpZnkgZWFjaFxuICAvLyBJSEtFMzMwM1MwMSB2aXNpdCBhcyBBTUIgLyBFTUVSIC8gSU1QIHZpYSBob3NwX0RBVEFfVFlQRV9OQU1FLlxuICAvLyBMaXN0IGVuZHBvaW50IGRvZXNuJ3QgZXhwb3NlIFx1NjAyNVx1OEEzQSBkaXN0aW5jdGlvbjsgZGV0YWlsIGRvZXMuIFdlIHJlLVxuICAvLyBhZGFwdCBlYWNoIGVuY291bnRlciBpdGVtIHdpdGggdGhlIGRpc2NvdmVyZWQgY2xhc3MgYmVmb3JlIHRoZVxuICAvLyBiYWNrZW5kIHVwbG9hZCBzdGVwLlxuICBjb25zdCBlbmNJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJlbmNvdW50ZXJzXCIpO1xuICBpZiAoZW5jSWR4ID49IDAgJiYgc2V0dGxlZFtlbmNJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdMaXN0IHx8IFtdO1xuICAgIGlmICh2aXNpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdUQ4M0RcdURDRTUgXHU1M0Q2XHU1Rjk3ICR7dmlzaXRzLmxlbmd0aH0gXHU3QjQ2XHU1QzMxXHU5MUFCXHU3RDAwXHU5MzA0XHU4QTczXHU2MEM1XHUyMDI2YCxcbiAgICAgIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGV0YWlsTWFwID0gYXdhaXQgX2ZldGNoRW5jb3VudGVyRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gUmUtYWRhcHQgd2l0aCBjbGFzc0hpbnQgZnJvbSBkZXRhaWw7IGZhbGwgYmFjayB0byBBTUIuXG4gICAgICAgIGNvbnN0IHJlQWRhcHRlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpc2l0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGRldGFpbE1hcD8uZ2V0KGkpIHx8IG51bGw7XG4gICAgICAgICAgY29uc3QgY2xzID0gX2NsYXNzRnJvbVMwMkRldGFpbChkZXRhaWwpIHx8IFwiQU1CXCI7XG4gICAgICAgICAgY29uc3QgaXQgPSBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlKHZpc2l0c1tpXSwgY2xzKTtcbiAgICAgICAgICBpZiAoaXQpIHJlQWRhcHRlZC5wdXNoKGl0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXR0bGVkW2VuY0lkeF0udmFsdWUuaXRlbXMgPSByZUFkYXB0ZWQ7XG4gICAgICAgIHNldHRsZWRbZW5jSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZUFkYXB0ZWQubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgZW5jb3VudGVyIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJlbmNvdW50ZXItZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMWI6IG1lZGljYXRpb25zIG5lZWQgYSAyLXN0ZXAgZmV0Y2ggXHUyMDE0IElIS0UzMzA2UzAxIG9ubHkgcmV0dXJuc1xuICAvLyB2aXNpdCBtZXRhZGF0YSAoZGF0ZSwgSUNELCBob3NwaXRhbCksIG5vIGRydWcgbmFtZXMuIERydWdzIGxpdmUgYXRcbiAgLy8gSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiB1bmRlclxuICAvLyBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0LiBGYW4gb3V0IGRldGFpbFxuICAvLyBmZXRjaGVzIGluc2lkZSB0aGUgc2FtZSB0YWIgY29udGV4dCAoY29va2llcyArIEpXVCksIGtlZXBpbmdcbiAgLy8gY29uY3VycmVuY3kgbGltaXRlZCBzbyBOSEkgZG9lc24ndCBJRExFLXJlZGlyZWN0IHVzLlxuICAvLyBTdGVwIDFjOiBpbWFnaW5nIG5lZWRzIElIS0UzNDA4UzAyIGZvciB0aGUgYWN0dWFsIHJlcG9ydCBuYXJyYXRpdmUuXG4gIC8vIExpc3QgZW5kcG9pbnQgb25seSBoYXMgb3JkZXIgbWV0YWRhdGE7IGN0eXBlIHBhcmFtIG1pcnJvcnMgdGhlXG4gIC8vIHZpc2l0J3Mgb3JpX1RZUEUgKEEgLyBFIC8gXHUyMDI2KS5cbiAgY29uc3QgaW1nSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwiaW1hZ2luZ1wiKTtcbiAgaWYgKGltZ0lkeCA+PSAwICYmIHNldHRsZWRbaW1nSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW2ltZ0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNVx1NTgzMVx1NTQ0QVx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydHMgPSBhd2FpdCBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLml0ZW1zID0gcmVwb3J0cztcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnJhd19jb3VudCA9IHJlcG9ydHMubGVuZ3RoO1xuICAgICAgICBzZXR0bGVkW2ltZ0lkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBpbWFnaW5nIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJpbWFnaW5nLWRldGFpbFwiKTtcblxuICBjb25zdCBtZWRJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJtZWRpY2F0aW9uc1wiKTtcbiAgaWYgKG1lZElkeCA+PSAwICYmIHNldHRsZWRbbWVkSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW21lZElkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NzUyOFx1ODVFNVx1NjYwRVx1N0QzMFx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRydWdJdGVtcyA9IGF3YWl0IF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUuaXRlbXMgPSBkcnVnSXRlbXM7XG4gICAgICAgIC8vIHJhd19jb3VudCBub3cgcmVmbGVjdHMgdGhlICpkcnVnLWxldmVsKiBjb3VudCBmb3IgdGhlIGJyZWFrZG93blxuICAgICAgICAvLyAodmlzaXRzIFx1MjE5MiBkcnVncykuIEtlZXAgdGhlIHZpc2l0IGNvdW50IGluIGEgc2lkZSBmaWVsZCBmb3IgZGVidWcuXG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLnJhd19jb3VudCA9IGRydWdJdGVtcy5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBtZWRpY2F0aW9ucyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwibWVkaWNhdGlvbi1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAyOiBhZ2dyZWdhdGUgaXRlbXMgYnkgcGFnZV90eXBlLCBQT1NUIHRvIGJhY2tlbmQuXG4gIGNvbnN0IGJ5VHlwZSA9IHt9O1xuICBsZXQgcmF3X3RvdGFsID0gMDtcbiAgbGV0IGFkYXB0ZWRfdG90YWwgPSAwO1xuICAvLyBQZXItZW5kcG9pbnQgYnJlYWtkb3duIHNvIHRoZSBmaW5hbCBzdGF0dXMgY2FuIHRlbGwgdXNlciBleGFjdGx5XG4gIC8vIHdoaWNoIGVuZHBvaW50cyBjYW1lIGJhY2sgZW1wdHkgLyBtaXMtc2hhcGVkIFx1MjAxNCBtdWNoIG1vcmUgdXNlZnVsIHRoYW5cbiAgLy8gYSBzaW5nbGUgYWdncmVnYXRlZCBudW1iZXIuXG4gIC8vIEJyZWFrZG93biBzaG93biB0byB0aGUgdXNlciB1bmRlciBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiLiBVc2UgdGhlIENoaW5lc2UgbGFiZWxcbiAgLy8gd2hlbiBrbm93bjsgb25seSBmYWxsIGJhY2sgdG8gdGhlIHJhdyBlbmRwb2ludCBuYW1lIGZvciB1bm1hcHBlZFxuICAvLyAobmV3bHkgYWRkZWQpIGVuZHBvaW50cy4gRW1wdHktcmVzdWx0IGVuZHBvaW50cyBhcmUgb21pdHRlZCBmcm9tXG4gIC8vIHRoZSBzdWNjZXNzIHN1bW1hcnkgZW50aXJlbHkgXHUyMDE0IHRoZXkgYWRkIG5vaXNlLiBFcnJvcnMgYWx3YXlzIHNob3dcbiAgLy8gc28gdGhlIHVzZXIga25vd3Mgc29tZXRoaW5nIGRpZG4ndCBjb21lIHRocm91Z2guXG4gIGNvbnN0IGJyZWFrZG93biA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNldHRsZWQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBlcCA9IE5ISV9BUElfRU5EUE9JTlRTW2ldO1xuICAgIGNvbnN0IHMgPSBzZXR0bGVkW2ldO1xuICAgIGNvbnN0IGxhYmVsID0gRU5EUE9JTlRfTEFCRUxfWkhbZXAubmFtZV0gPz8gZXAubmFtZTtcbiAgICBpZiAocy5zdGF0dXMgPT09IFwicmVqZWN0ZWRcIikge1xuICAgICAgZXJyb3JzLnB1c2goYCR7ZXAubmFtZX06ICR7cy5yZWFzb24ubWVzc2FnZX1gKTtcbiAgICAgIGJyZWFrZG93bi5wdXNoKGBcdTI3NEMgJHtsYWJlbH1cdUZGMUFcdTUzRDZcdTVGOTdcdTU5MzFcdTY1NTdgKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCB7IGl0ZW1zLCByYXdfY291bnQgfSA9IHMudmFsdWU7XG4gICAgcmF3X3RvdGFsICs9IHJhd19jb3VudDtcbiAgICBhZGFwdGVkX3RvdGFsICs9IGl0ZW1zLmxlbmd0aDtcbiAgICBpZiAocmF3X2NvdW50ID09PSAwKSBjb250aW51ZTsgLy8gbm90aGluZyB0byBzaG93XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA+IHJhd19jb3VudCAmJiByYXdfY291bnQgPiAwKSB7XG4gICAgICAvLyAxLXRvLW1hbnkgYWRhcHRlciAoZS5nLiBhZHVsdF9wcmV2ZW50aXZlOiBvbmUgc2NyZWVuaW5nIHJvdyBcdTIxOTJcbiAgICAgIC8vIH4xOCBPYnNlcnZhdGlvbnMpLiBTaG93IGJvdGggbnVtYmVycyBzbyB0aGUgdXNlciB1bmRlcnN0YW5kc1xuICAgICAgLy8gd2h5IG9uZSByZWNvcmQgcHJvZHVjZWQgbWFueS5cbiAgICAgIGJyZWFrZG93bi5wdXNoKGAke2xhYmVsfVx1RkYxQSR7cmF3X2NvdW50fSBcdTdCNDYgXHUyMTkyICR7aXRlbXMubGVuZ3RofSBcdTk4MDVgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWtkb3duLnB1c2goYCR7bGFiZWx9XHVGRjFBJHtpdGVtcy5sZW5ndGh9IFx1N0I0NmApO1xuICAgIH1cbiAgICAvLyBTYXZlIGJvZHkgc2FtcGxlIGZvciBmaXJzdCBlbmRwb2ludCB3aXRoIHJhdz4wIGJ1dCBhZGFwdGVkPTAgKGFkYXB0ZXJcbiAgICAvLyBtaXNtYXRjaCkgc28gd2UgY2FuIGl0ZXJhdGUuIFN0b3JlZCB1bmRlciBjaHJvbWUuc3RvcmFnZS5sb2NhbCBmb3JcbiAgICAvLyBpbnNwZWN0aW9uIHZpYSBzZXJ2aWNlIHdvcmtlciBEZXZUb29scy5cbiAgICBpZiAocmF3X2NvdW50ID4gMCAmJiBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgW2BfX3NhbXBsZUJvZHlfJHtlcC5uYW1lfWBdOiBzLnZhbHVlLmJvZHlTYW1wbGUgfHwgXCJuL2FcIixcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIChieVR5cGVbZXAucGFnZV90eXBlXSA9IGJ5VHlwZVtlcC5wYWdlX3R5cGVdIHx8IFtdKS5wdXNoKC4uLml0ZW1zKTtcbiAgfVxuXG4gIC8vIE1hc2sgZ2F0ZSBpcyByZWFkIGZyZXNoIHBlciBzeW5jIFx1MjAxNCBkZWZhdWx0cyBPRkYgcGVyIHRoZSBkaXNjdXNzaW9uXG4gIC8vIChjaXRpemVuLXNlbGYtZG93bmxvYWQgZG9lc24ndCBuZWVkIGFub255bWl6YXRpb24pLiBXaGVuIE9OLCBhbHNvXG4gIC8vIHNjcnViIHRoZSB1c2VyJ3MgcmVhbCBuYW1lIG91dCBvZiBhbnkgTkhJIG5hcnJhdGl2ZSBmaWVsZCBiZWZvcmVcbiAgLy8gaXQgZmxvd3MgaW50byB0aGUgbWFwcGVyLlxuICBjb25zdCBtYXNrRW5hYmxlZCA9IGF3YWl0IF9pc01hc2tFbmFibGVkKCk7XG4gIGlmIChtYXNrRW5hYmxlZCAmJiBwYXRpZW50T3ZlcnJpZGUubmFtZSkge1xuICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGJ5VHlwZSkpIHtcbiAgICAgIGJ5VHlwZVtrZXldID0gX3JlcGxhY2VOYW1lRGVlcChieVR5cGVba2V5XSwgcGF0aWVudE92ZXJyaWRlLm5hbWUsIHJlcGxhY2VtZW50KTtcbiAgICB9XG4gIH1cblxuICBsZXQgdG90YWwgPSAwO1xuICBsZXQgX2xvY2FsRmlsZW5hbWUgPSBudWxsO1xuICBpZiAobW9kZSA9PT0gXCJsb2NhbFwiKSB7XG4gICAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xuICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBcIlx1RDgzRVx1RERFQyBcdThGNDlcdTYzREJcdTcwQkFcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdTZBOTRcdTIwMjZcIiwgdG90YWxSZXNvdXJjZXM6IDAgfSk7XG4gICAgbGV0IGJ1bmRsZTtcbiAgICB0cnkge1xuICAgICAgYnVuZGxlID0gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvcnMucHVzaChgbG9jYWwgbWFwcGluZzogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICBidW5kbGUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoYnVuZGxlKSB7XG4gICAgICB0b3RhbCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogYFx1RDgzRFx1RENCRSBcdTZFOTZcdTUwOTkgJHt0b3RhbH0gXHU3QjQ2IEZISVIgXHU4Q0M3XHU2RTkwXHUyMDI2YCwgdG90YWxSZXNvdXJjZXM6IHRvdGFsIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGwgPSBhd2FpdCBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudE92ZXJyaWRlLmlkX25vLCBkYXRlUmFuZ2UpO1xuICAgICAgICBfbG9jYWxGaWxlbmFtZSA9IGRsLmZpbGVuYW1lO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgc3Rhc2ggYnVuZGxlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gQnVpbGQgdGhlIG92ZXJyaWRlIHdlIHNlbmQgdG8gYmFja2VuZCB3aXRoIHRoZSBtYXliZS1tYXNrZWQgbmFtZVxuICAgIC8vIHNvIGJhY2tlbmQncyBhdXRvLWNyZWF0ZWQgUGF0aWVudCArIHRoZSBwZXItaXRlbSBzdWJqZWN0LmRpc3BsYXlcbiAgICAvLyBzZWUgdGhlIHNhbWUgdmFsdWUgdGhlIHVzZXIgb3B0ZWQgaW50by4gSXRlbXMgdGhlbXNlbHZlcyB3ZXJlXG4gICAgLy8gYWxyZWFkeSBzY3J1YmJlZCBhYm92ZSAoYnlUeXBlIHBhc3MpLCBzbyB0aGlzIGp1c3QgY292ZXJzIHRoZVxuICAgIC8vIG92ZXJyaWRlLWRlcml2ZWQgUGF0aWVudC5cbiAgICBjb25zdCB1cGxvYWRPdmVycmlkZSA9IG1hc2tFbmFibGVkICYmIHBhdGllbnRPdmVycmlkZS5uYW1lXG4gICAgICA/IHsgLi4ucGF0aWVudE92ZXJyaWRlLCBuYW1lOiBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSkgfVxuICAgICAgOiBwYXRpZW50T3ZlcnJpZGU7XG4gICAgZm9yIChjb25zdCBbcGFnZV90eXBlLCBpdGVtc10gb2YgT2JqZWN0LmVudHJpZXMoYnlUeXBlKSkge1xuICAgICAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdTJCMDZcdUZFMEYgXHU0RTBBXHU1MEIzICR7cGFnZV90eXBlfVx1RkYwOCR7aXRlbXMubGVuZ3RofSBcdTdCNDZcdUZGMDlcdTIwMjZgLFxuICAgICAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgdXBsb2FkT3ZlcnJpZGUpO1xuICAgICAgICB0b3RhbCArPSBkYXRhLmNvdW50IHx8IDA7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGB1cGxvYWQgJHtwYWdlX3R5cGV9OiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZnRlciBiYWNrZW5kIHVwbG9hZCwgYWxzbyBmZXRjaCBhIHNuYXBzaG90IG9mIHRoZSBwYXRpZW50J3MgZnVsbFxuICAgIC8vIGN1bXVsYXRpdmUgRkhJUiBCdW5kbGUgYW5kIHN0YXNoIGl0IGZvciB0aGUgcG9wdXAncyBcIlx1RDgzRFx1RENFNSBcdTRFMEJcdThGMDlcIiBidXR0b24uXG4gICAgLy8gVGhpcyBpcyB3aGF0IGAvZmhpci9leHBvcnRgIHJldHVybnMgXHUyMDE0IHRoZSBiYWNrZW5kJ3MgY29tcGxldGUgdmlld1xuICAgIC8vIG9mIHRoaXMgcGF0aWVudCAodGhpcyBzeW5jICsgYW55IHByaW9yIHN5bmNzKSwgYXMgb3Bwb3NlZCB0byBsb2NhbFxuICAgIC8vIG1vZGUncyBcImp1c3QgdGhpcyBzeW5jXCIgYnVuZGxlLlxuICAgIC8vXG4gICAgLy8gU2tpcCBzdGFzaGluZyBlbnRpcmVseSB3aGVuIHRoZSB1cGxvYWQgcGFzcyBwcm9kdWNlZCBubyByZXNvdXJjZXNcbiAgICAvLyBcdTIwMTQgZXhwb3J0aW5nIDAgZW50cmllcyB0aGVuIHN0YXNoaW5nIHRoZW0gY3JlYXRlcyBhIG1pc2xlYWRpbmdcbiAgICAvLyBcIlx1NjcyQ1x1NTczMCBcdTI3MTMgMCBcdTdCNDZcIiBpbmRpY2F0b3IgYW5kIGEgdXNlbGVzcyBcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzIGJ1dHRvbi5cbiAgICBpZiAocGF0aWVudE92ZXJyaWRlLmlkX25vICYmIHRvdGFsID4gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNEXHVEQ0U2IFx1NTNENlx1NUY5N1x1NUY4Q1x1N0FFRlx1NUI4Q1x1NjU3NFx1OENDN1x1NjU5OVx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogdG90YWwgfSk7XG4gICAgICAgIC8vIEJhY2tlbmQgc3RvcmVzIFBhdGllbnQgdW5kZXIgZGVyaXZlUGF0aWVudElkKHJhd0lkKSwgc28gdGhlXG4gICAgICAgIC8vIGV4cG9ydCBmaWx0ZXIgbXVzdCB1c2UgdGhlIGhhc2hlZCBmb3JtIFx1MjAxNCBxdWVyeWluZyB3aXRoIHRoZVxuICAgICAgICAvLyByYXcgbmF0aW9uYWwgSUQgbWF0Y2hlcyB6ZXJvIHJvd3MgZXZlbiB3aGVuIGRhdGEgaXMgdGhlcmUuXG4gICAgICAgIGNvbnN0IGZoaXJQaWQgPSBkZXJpdmVQYXRpZW50SWQocGF0aWVudE92ZXJyaWRlLmlkX25vKTtcbiAgICAgICAgY29uc3QgZXhwVXJsID0gYCR7YmFja2VuZH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gO1xuICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goZXhwVXJsLCB7XG4gICAgICAgICAgaGVhZGVyczogc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyLm9rKSB7XG4gICAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgLy8gUGFzcyB0aGUgc2FtZSBkYXRlUmFuZ2UgdGhlIHVzZXIgcGlja2VkIHRocm91Z2ggc28gdGhlXG4gICAgICAgICAgLy8gZG93bmxvYWRlZCBmaWxlbmFtZSByZWZsZWN0cyBcIlx1NjcwMFx1OEZEMSAzIFx1NUU3NFwiIFx1MjE5MiAyMDIzLTIwMjYgaW5zdGVhZFxuICAgICAgICAgIC8vIG9mIGFsd2F5cyBzeW50aGVzaXppbmcgdG9kYXktMXkgXHUyMTkyIHRvZGF5LlxuICAgICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubywgZGF0ZVJhbmdlKTtcbiAgICAgICAgICBfbG9jYWxGaWxlbmFtZSA9IGRsLmZpbGVuYW1lO1xuICAgICAgICAgIC8vIEFsaWduIHJlcG9ydGVkIGNvdW50IHdpdGggbG9jYWwgbW9kZTogYnVuZGxlLmVudHJ5Lmxlbmd0aFxuICAgICAgICAgIC8vIGluY2x1ZGVzIHRoZSBQYXRpZW50IHJlc291cmNlICh3aGljaCB0aGUgcGVyLXBhZ2UtdHlwZSBQT1NUXG4gICAgICAgICAgLy8gY291bnRzIGhhZCBwcmV2aW91c2x5IG9taXR0ZWQgYmVjYXVzZSBQYXRpZW50IGlzIGF1dG8tY3JlYXRlZFxuICAgICAgICAgIC8vIHNpbGVudGx5IGZyb20gcGF0aWVudF9vdmVycmlkZSkuIFNhbWUgZGF0YSBcdTIxOTIgc2FtZSBudW1iZXIuXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBEZWZlbnNpdmU6IG9ubHkgT1ZFUldSSVRFIHRvdGFsIHdoZW4gZXhwb3J0IGFjdHVhbGx5IHJldHVybmVkXG4gICAgICAgICAgLy8gc29tZXRoaW5nLiBJZiBleHBvcnQgcmV0dXJucyAwIGVudHJpZXMgZGVzcGl0ZSBhIHN1Y2Nlc3NmdWxcbiAgICAgICAgICAvLyB1cGxvYWQgKGNvdWxkIGhhcHBlbiB3aXRoIGEgc3RhbGUtREIgaGFzaCBtaXNtYXRjaCB3ZSBoYXZlbid0XG4gICAgICAgICAgLy8gZml4ZWQgeWV0KSwgZG9uJ3QgY2xvYmJlciB0aGUgdHJ1dGhmdWwgdXBsb2FkIGNvdW50IFx1MjAxNCB0aGF0J3NcbiAgICAgICAgICAvLyBleGFjdGx5IHRoZSBidWcgdGhhdCBtYWRlIFwiXHU1REYyXHU2NkY0XHU2NUIwIDgxIFx1N0I0NlwiIHNpbGVudGx5IGJlY29tZVxuICAgICAgICAgIC8vIFwiXHU1REYyXHU2NkY0XHU2NUIwIDAgXHU3QjQ2XCIuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYnVuZGxlLmVudHJ5KSAmJiBidW5kbGUuZW50cnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChgZXhwb3J0IGJ1bmRsZTogSFRUUCAke3Iuc3RhdHVzfWApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBleHBvcnQgYnVuZGxlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShtb2RlID09PSBcImxvY2FsXCIgPyBcImFzc2VtYmxlK3N0YXNoXCIgOiBcImJhY2tlbmQtdXBsb2FkXCIpO1xuXG4gIC8vIEZvcm1hdCBlbGFwc2VkIHdhbGwtY2xvY2sgdGltZTogc2Vjb25kcyAoMSBkcCkgZm9yIHNob3J0IHN5bmNzLFxuICAvLyBcIm1tOnNzXCIgb25jZSB3ZSBjcm9zcyB0aGUgbWludXRlIG1hcmsgc28gdGhlIHBvcHVwIHN0YXR1cyBzdGF5cyByZWFkYWJsZS5cbiAgY29uc3QgX2VsYXBzZWRNcyA9IERhdGUubm93KCkgLSBfdDA7XG4gIGNvbnN0IF9lbGFwc2VkU3RyID0gX2VsYXBzZWRNcyA8IDYwXzAwMFxuICAgID8gYCR7KF9lbGFwc2VkTXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgXG4gICAgOiBgJHtNYXRoLmZsb29yKF9lbGFwc2VkTXMgLyA2MF8wMDApfW0ke01hdGgucm91bmQoKF9lbGFwc2VkTXMgJSA2MF8wMDApIC8gMTAwMCl9c2A7XG4gIC8vIE5vIG1vcmUgXCJcdTZBOTRcdTY4NDhcdTVERjJcdTUwOTlcdTU5QTVcdTIwMjZcIiB0YWlsIFx1MjAxNCB0aGUgXHVEODNEXHVEQ0U1IGRvd25sb2FkIGJ1dHRvbiBzaXRzIHJpZ2h0XG4gIC8vIGJlbG93IHRoZSBzdGF0dXMsIHNvIHNheWluZyBcIlx1OUVERVx1NEUwQlx1NjVCOVx1NjMwOVx1OTIxNVwiIGlzIGp1c3Qgbm9pc2UuXG4gIGNvbnN0IF9sb2NhbFRhaWwgPSBcIlwiO1xuICBjb25zdCBfc3VjY2Vzc1ZlcmIgPSBtb2RlID09PSBcImxvY2FsXCIgPyBcIlx1NURGMlx1NzUyMlx1NzUxRlwiIDogXCJcdTVERjJcdTY2RjRcdTY1QjBcIjtcbiAgLy8gUGhhc2UgdGltaW5ncyAoYG5oaS1wYXJhbGxlbD04c2AsIGBiYWNrZW5kLXVwbG9hZD0wLjhzYCkgYXJlIGRldlxuICAvLyBpbmZvIFx1MjAxNCB1c2VmdWwgd2hlbiBpbnZlc3RpZ2F0aW5nIGEgc2xvdyBzeW5jIGJ1dCBub2lzZSBmb3IgYW4gZW5kXG4gIC8vIHVzZXIuIEtlZXAgdGhlbSwgYnV0IHRhZyB3aXRoIHRoZSBcIlx1MjNGMVwiIHByZWZpeCB0aGUgcG9wdXAgdXNlcyB0b1xuICAvLyB0dWNrIHRoZW0gaW50byBhIGRlZXBlciBcIlx1NjI4MFx1ODg1M1x1N0QzMFx1N0JDMFwiIHN1Yi10b2dnbGUuXG4gIGNvbnN0IF9waGFzZUxpbmVzID0gX3BoYXNlcy5tYXAoKHApID0+IGBcdTIzRjEgJHtwLm5hbWV9PSR7KHAubXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgKTtcbiAgY29uc3QgX2Z1bGxCcmVha2Rvd24gPSBbLi4uYnJlYWtkb3duLCAuLi5fcGhhc2VMaW5lc107XG5cbiAgLy8gUGljayB0aGUgcmlnaHQgc3VtbWFyeSBsaW5lLiBaZXJvLXJlc3VsdCBpcyB0aGUgdHJpY2tpZXN0IGNhc2U6XG4gIC8vIHdlIGRvbid0IHdhbnQgYSBncmVlbiBcdTI3MDUgc2F5aW5nIFwiMCBcdTdCNDZcIiBiZWNhdXNlIHRoYXQgcmVhZHMgYXNcbiAgLy8gXCJzdWNjZWVkZWQgd2l0aCB6ZXJvIGRhdGFcIi4gVGhhdCdzIGFsbW9zdCBhbHdheXMgb25lIG9mOlxuICAvLyAgIC0gTkhJIHNlc3Npb24gZXhwaXJlZCBiZXR3ZWVuIHRoZSBsb2dpbiBwcm9iZSBhbmQgdGhlIHN5bmNcbiAgLy8gICAgICh0aGUgSUhLRTM0MTAgcHJvYmUgY2FuIHN0aWxsIHN1Y2NlZWQgd2hpbGUgZGF0YSBlbmRwb2ludHNcbiAgLy8gICAgIHJlc3BvbmQgd2l0aCBlbXB0eSBhcnJheXMpO1xuICAvLyAgIC0gdGhlIHVzZXIgdHJ1bHkgaGFzIG5vIHJlY29yZHMgaW4gdGhlIHNlbGVjdGVkIGRhdGUgcmFuZ2UuXG4gIC8vIEVpdGhlciB3YXkgdGhlIGFjdGlvbmFibGUgbmV4dCBzdGVwIGlzIFwiXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1IE5ISSBcdTUxOERcdThBNjZcdTRFMDBcdTZCMjFcIi5cbiAgbGV0IF9zdW1tYXJ5TGluZTtcbiAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICBfc3VtbWFyeUxpbmUgPSBgXHUyNkEwXHVGRTBGIFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgJHtfc3VjY2Vzc1ZlcmJ9ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1RkYwQyR7ZXJyb3JzLmxlbmd0aH0gXHU5ODA1XHU1OTMxXHU2NTU3XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDkke19sb2NhbFRhaWx9YDtcbiAgfSBlbHNlIGlmICh0b3RhbCA9PT0gMCkge1xuICAgIF9zdW1tYXJ5TGluZSA9XG4gICAgICBgXHUyNkEwXHVGRTBGIFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMFx1NEY0Nlx1NkM5Mlx1NjI5M1x1NTIzMFx1NEVGQlx1NEY1NVx1OENDN1x1NjU5OVx1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5XHUyMDE0IGAgK1xuICAgICAgYFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBzZXNzaW9uIFx1NTNFRlx1ODBGRFx1OTA0RVx1NjcxRlx1RkYwQ1x1OEFDQlx1NTZERVx1OEE3Mlx1NTIwNlx1OTgwMVx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1RkYxQlx1NjIxNlx1NjJDOVx1OTU3N1x1MzAwQ1x1NjVFNVx1NjcxRlx1N0JDNFx1NTcwRFx1MzAwRFx1NTE4RFx1OEE2Nlx1MzAwMmA7XG4gIH0gZWxzZSB7XG4gICAgX3N1bW1hcnlMaW5lID0gYFx1MjcwNSBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTAgXHUwMEI3ICR7X3N1Y2Nlc3NWZXJifSAke3RvdGFsfSBcdTdCNDZcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOSR7X2xvY2FsVGFpbH1gO1xuICB9XG5cbiAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICBydW5uaW5nOiBmYWxzZSxcbiAgICBwcm9ncmVzczogX3N1bW1hcnlMaW5lLFxuICAgIHBoYXNlOiBcImRvbmVcIixcbiAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgIGVsYXBzZWRNczogX2VsYXBzZWRNcyxcbiAgICAvLyBQZXItZW5kcG9pbnQgYnJlYWtkb3duIGZvciB0aGUgcG9wdXAncyAnXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwJyBjb2xsYXBzaWJsZS5cbiAgICAvLyBLZWVwIGFzIGEgcGxhaW4gYXJyYXkgc28gcG9wdXAuanMgY2FuIHJlbmRlciB3aXRoIERPTSBBUEkgKG5vXG4gICAgLy8gaW5uZXJIVE1MIC8gbm8gZXNjYXBpbmcgY29uY2VybnMpLiBJdGVtcyBsb29rIGxpa2VcbiAgICAvLyAnZW5jb3VudGVycz0xMi8xMicgb3IgJ2FkdWx0X3ByZXZlbnRpdmU9MiByb3dzIFx1MjE5MiAzNiBvYnMnLlxuICAgIGJyZWFrZG93bjogX2Z1bGxCcmVha2Rvd24sXG4gICAgZXJyb3JzLFxuICAgIGhpc3RubzogcGF0aWVudE92ZXJyaWRlLmlkX25vLFxuICAgIG1vZGUsXG4gICAgbG9jYWxGaWxlbmFtZTogX2xvY2FsRmlsZW5hbWUsXG4gIH0pO1xuXG4gIC8vIEJlc3QtZWZmb3J0OiB3cml0ZSBhIFN5bmMgSGlzdG9yeSByb3cgdG8gdGhlIGJhY2tlbmQgc28gdGhlIGRhc2hib2FyZFxuICAvLyBjYW4gc2hvdyB3aGVuL3doby9ob3ctbG9uZy93aGF0L3JhbmdlLiBTa2lwcGVkIGluIGxvY2FsIG1vZGUgKHRoZXJlXG4gIC8vIGlzIG5vIGJhY2tlbmQpLiBXcmFwcGVkICsgc3dhbGxvd2VkIHNvIGEgbG9nZ2luZyBmYWlsdXJlIG5ldmVyXG4gIC8vIHByb3BhZ2F0ZXMgYmFjayB0byB0aGUgdXNlci1mYWNpbmcgc3luYyBzdGF0dXMuXG4gIGlmIChtb2RlICE9PSBcImxvY2FsXCIpIHRyeSB7XG4gICAgYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy9sb2dgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc3RhdHVzOiBlcnJvcnMubGVuZ3RoID8gXCJwYXJ0aWFsXCIgOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgcGF0aWVudF9pZDogcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCIsXG4gICAgICAgIC8vIC9zeW5jL2xvZyBsYW5kcyBpbiB0aGUgZGFzaGJvYXJkJ3Mgc3luYy1oaXN0b3J5IHJvdy4gT25seVxuICAgICAgICAvLyBtYXNrIHdoZW4gdGhlIHVzZXIgaGFzIG9wdGVkIGluIFx1MjAxNCBvdGhlcndpc2UgZGFzaGJvYXJkIHNlZXNcbiAgICAgICAgLy8gdGhlIHJhdyBuYW1lIHRoZXkgdHlwZWQgKGNvbnNpc3RlbnQgd2l0aCBcIlx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOFwiIGRlZmF1bHQpLlxuICAgICAgICBwYXRpZW50X25hbWU6IG1hc2tFbmFibGVkXG4gICAgICAgICAgPyBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiKVxuICAgICAgICAgIDogcGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIixcbiAgICAgICAgdG90YWwsXG4gICAgICAgIGJyZWFrZG93bixcbiAgICAgICAgZGF0ZV9yYW5nZTogZGF0ZVJhbmdlTGFiZWwgfHwgXCJcIixcbiAgICAgICAgZWxhcHNlZF9tczogX2VsYXBzZWRNcyxcbiAgICAgICAgc3RhcnRlZF9hdDogbmV3IERhdGUoX3QwKS50b0lTT1N0cmluZygpLFxuICAgICAgICBlcnJvcnMsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gZmFpbGVkIHRvIHdyaXRlIGhpc3RvcnkgbG9nOlwiLCBlKTtcbiAgfVxuICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG59XG5cbi8vIE9uZS10aW1lIG1pZ3JhdGlvbiBmcm9tIGNocm9tZS5zdG9yYWdlLnN5bmMgXHUyMTkyIGNocm9tZS5zdG9yYWdlLmxvY2FsLlxuLy8gUHJldmlvdXMgdmVyc2lvbnMgc3RvcmVkIHN5bmNBcGlLZXkgKyBwYXRpZW50T3ZlcnJpZGUgKGNvbnRhaW5pbmcgdGhlXG4vLyBuYXRpb25hbCBJRCkgdW5kZXIgLnN5bmMsIHdoaWNoIENocm9tZSByZXBsaWNhdGVzIHRvIHRoZSB1c2VyJ3MgR29vZ2xlXG4vLyBhY2NvdW50IGFuZCBwdXNoZXMgdG8gZXZlcnkgZGV2aWNlIHRoZXkgc2lnbiBpbnRvLiBNb3ZlIGV2ZXJ5dGhpbmdcbi8vIHNldHRpbmdzLXJlbGF0ZWQgdG8gLmxvY2FsOyBjbGVhciB0aGUgc3luYyBjb3B5LlxuY29uc3QgU1lOQ19LRVlTX1RPX01JR1JBVEUgPSBbXG4gIFwiYmFja2VuZFVybFwiLFxuICBcInN5bmNBcGlLZXlcIixcbiAgXCJzbWFydEFwcExhdW5jaFVybFwiLFxuICBcInBhdGllbnRPdmVycmlkZVwiLFxuICBcInN5bmNNb2RlXCIsXG4gIFwibWFza05hbWVFbmFibGVkXCIsXG5dO1xuXG5hc3luYyBmdW5jdGlvbiBtaWdyYXRlU3luY1RvTG9jYWwoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3luY2VkID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU1lOQ19LRVlTX1RPX01JR1JBVEUpO1xuICAgIGNvbnN0IHByZXNlbnQgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhzeW5jZWQpLmZpbHRlcigoWywgdl0pID0+IHYgIT09IHVuZGVmaW5lZCksXG4gICAgKTtcbiAgICBpZiAoT2JqZWN0LmtleXMocHJlc2VudCkubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgbG9jYWwgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoT2JqZWN0LmtleXMocHJlc2VudCkpO1xuICAgIC8vIERvbid0IG92ZXJ3cml0ZSBhbnl0aGluZyB0aGUgdXNlciBhbHJlYWR5IHNldCBvbiB0aGlzIG1hY2hpbmUuXG4gICAgY29uc3QgdG9Xcml0ZSA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgIE9iamVjdC5lbnRyaWVzKHByZXNlbnQpLmZpbHRlcigoW2tdKSA9PiBsb2NhbFtrXSA9PT0gdW5kZWZpbmVkKSxcbiAgICApO1xuICAgIGlmIChPYmplY3Qua2V5cyh0b1dyaXRlKS5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQodG9Xcml0ZSk7XG4gICAgfVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMucmVtb3ZlKE9iamVjdC5rZXlzKHByZXNlbnQpKTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gTWlncmF0aW9uIGlzIGJlc3QtZWZmb3J0LiBUaGUgbmV4dCBydW4gZ2V0cyB0byB0cnkgYWdhaW4uXG4gIH1cbn1cblxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoYXN5bmMgKCkgPT4ge1xuICBhd2FpdCBtaWdyYXRlU3luY1RvTG9jYWwoKTtcbn0pO1xuXG4vLyBBbHNvIHJ1biBtaWdyYXRpb24gb24gc2VydmljZS13b3JrZXIgd2FrZS11cCAoY292ZXJzIHJlbG9hZC9yZXN0YXJ0XG4vLyBwYXRocyB3aGVyZSBvbkluc3RhbGxlZCBkb2Vzbid0IGZpcmUpLlxuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwPy5hZGRMaXN0ZW5lcj8uKCgpID0+IHtcbiAgbWlncmF0ZVN5bmNUb0xvY2FsKCk7XG59KTtcbm1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZywgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdGFydE5oaUFwaVN5bmNcIikge1xuICAgIHJ1bk5oaUFwaVN5bmMobXNnLnBheWxvYWQpLnRoZW4oXG4gICAgICAoKSA9PiB7IHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pOyB9IGNhdGNoIHt9IH0sXG4gICAgICBhc3luYyAoZSkgPT4ge1xuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gQ0FOQ0VMX0VSUk9SKSB7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUsIGNhbmNlbGxlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gU0VTU0lPTl9FWFBJUkVEX0VSUk9SKSB7XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REQxMiBOSEkgc2Vzc2lvbiBcdTVERjJcdTc2N0JcdTUxRkEgXHUyMDE0IFx1OEFDQlx1NTcyOCBOSEkgdGFiIFx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1NUY4Q1x1NTE4RFx1OUVERSBTeW5jXCIsXG4gICAgICAgICAgICAgIHBoYXNlOiBcInNlc3Npb25fZXhwaXJlZFwiLFxuICAgICAgICAgICAgICB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGV4cGlyZWQ6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5lcnJvcihcInJ1bk5oaUFwaVN5bmMgZmFpbGVkXCIsIGUpO1xuICAgICAgICBhd2FpdCBzZXRTdGF0dXMoeyBydW5uaW5nOiBmYWxzZSwgcHJvZ3Jlc3M6IGBcdTI3NEMgJHtlLm1lc3NhZ2V9YCwgcGhhc2U6IFwiZXJyb3JcIiB9KTtcbiAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBlcnJvcjogZS5tZXNzYWdlIH0pOyB9IGNhdGNoIHt9XG4gICAgICB9LFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdG9wU3luY1wiKSB7XG4gICAgLy8gU2V0IHRoZSBjYW5jZWxsYXRpb24gZmxhZzsgdGhlIGluLWZsaWdodCBzeW5jIHdpbGwgdGhyb3dcbiAgICAvLyBDQU5DRUxfRVJST1IgYXQgaXRzIG5leHQgY2hlY2tDYW5jZWwoKSBjYWxsLiAgU3RvcmFnZSBpcyBhbHJlYWR5XG4gICAgLy8gdXBkYXRlZCBieSB0aGUgcG9wdXAsIHNvIHdlIGRvbid0IHRvdWNoIGl0IGhlcmUuXG4gICAgX2NhbmNlbGxlZCA9IHRydWU7XG4gICAgLy8gRGlzY2FyZCBhbnkgcGFydGlhbCBkYXRhIHVwbG9hZGVkIHNvIGZhci4gVGhlIHVzZXIncyBzdGF0ZWRcbiAgICAvLyBjb250cmFjdCBpcyAnc3RvcCA9IGFib3J0LCBJJ2xsIHJlc3luYyBmcm9tIHNjcmF0Y2ggbGF0ZXInIFx1MjAxNCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gbGVhdmUgYSBoYWxmLWxvYWRlZCBwYXRpZW50IGluIHRoZSBGSElSIHN0b3JlIHRoYXRcbiAgICAvLyBsb29rcyBjb21wbGV0ZSB0byBkb3duc3RyZWFtIFNNQVJUIGFwcHMuXG4gICAgY29uc3QgY3R4ID0gX2FjdGl2ZVN5bmNDdHg7XG4gICAgaWYgKGN0eD8ucGF0aWVudElkICYmIGN0eC5iYWNrZW5kKSB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYCR7Y3R4LmJhY2tlbmR9L3N5bmMvcGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChjdHgucGF0aWVudElkKX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IGN0eC5zeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGN0eC5zeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBTdXJmYWNlIHRoZSB3aXBlIGluIHRoZSBzdGF0dXMgc28gdXNlciBzZWVzIGl0IGFjdHVhbGx5IGhhcHBlbmVkLlxuICAgICAgICAgIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBbU1RPUkFHRV9LRVldOiB7XG4gICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1REYyXHU1MDVDXHU2QjYyXHU0RTI2XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBjYW5jZWwgd2lwZSBmYWlsZWQ6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG4gICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImdldFN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkudGhlbigoZGF0YSkgPT4gc2VuZFJlc3BvbnNlKGRhdGFbU1RPUkFHRV9LRVldIHx8IG51bGwpKTtcbiAgICByZXR1cm4gdHJ1ZTsgIC8vIGFzeW5jIHJlc3BvbnNlXG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjbGVhclN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShTVE9SQUdFX0tFWSkudGhlbigoKSA9PiBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjaGVja05oaUxvZ2luXCIpIHtcbiAgICBfY2hlY2tOaGlMb2dpblN0YXRlKG1zZy50YWJJZCkudGhlbihcbiAgICAgIChzdGF0ZSkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogc3RhdGUgfSk7IH0gY2F0Y2gge30gfSxcbiAgICAgICgpID0+IHsgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgbG9nZ2VkSW46IG51bGwgfSk7IH0gY2F0Y2gge30gfSxcbiAgICApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcblxuLy8gQmVsdC1hbmQtc3VzcGVuZGVycyBTVyBrZWVwYWxpdmU6IGFuIGFsYXJtIGV2ZXJ5IDIwIHMgd2FrZXMgdGhlIFNXIGlmXG4vLyBpZGxlLiBDb21iaW5lZCB3aXRoIHRoZSByZXR1cm4tdHJ1ZSBwYXR0ZXJuIGFib3ZlLCB0aGlzIHByZXZlbnRzIHRoZVxuLy8gMzAgcyBpZGxlIHNodXRkb3duIGZyb20gZW5kaW5nIGFuIGluLXByb2dyZXNzIHN5bmMuXG5jaHJvbWUuYWxhcm1zLmNyZWF0ZShcInN3LWtlZXBhbGl2ZVwiLCB7IHBlcmlvZEluTWludXRlczogMC4zNCB9KTtcbmNocm9tZS5hbGFybXMub25BbGFybS5hZGRMaXN0ZW5lcigoKSA9PiB7IC8qIG5vLW9wOyBwcmVzZW5jZSBpcyB0aGUgcG9pbnQgKi8gfSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQVNBLE9BQUMsV0FBVztBQUNWO0FBRUEsWUFBSSxjQUFjO0FBQ2xCLFlBQUksaUJBQWlCO0FBQ3JCLFlBQUksU0FBUyxPQUFPLFdBQVc7QUFDL0IsWUFBSSxPQUFPLFNBQVMsU0FBUyxDQUFDO0FBQzlCLFlBQUksS0FBSyxtQkFBbUI7QUFDMUIsbUJBQVM7QUFBQSxRQUNYO0FBQ0EsWUFBSSxhQUFhLENBQUMsVUFBVSxPQUFPLFNBQVM7QUFDNUMsWUFBSSxVQUFVLENBQUMs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QUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9WLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFnQlo7QUFnQk8sTUFBTSxzQkFBMkMsb0JBQUksSUFBSTtBQUFBLElBQzlEO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGLENBQUM7QUFXTSxNQUFNLGtCQUEwRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1yRSxVQUFVO0FBQUE7QUFBQTtBQUFBLE1BR1Isb0JBQW9CO0FBQUE7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LFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBV1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUVWLFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FDRTtBQUFBLElBQ0YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFV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QUFDLFdBQVcsR0FBRztBQUFBLGdCQUNiLEdBQUc7QUFBQSxnQkFDSCxTQUFTO0FBQUEsZ0JBQ1QsVUFBVTtBQUFBLGdCQUNWLE9BQU87QUFBQSxnQkFDUCxJQUFJLEtBQUssSUFBSTtBQUFBLGdCQUNiLFdBQVcsS0FBSyxJQUFJO0FBQUEsY0FDdEI7QUFBQSxZQUNGLENBQUM7QUFBQSxVQUNILFNBQVMsR0FBRztBQUNWLG9CQUFRLEtBQUssa0NBQWtDLENBQUM7QUFBQSxVQUNsRDtBQUFBLFFBQ0YsR0FBRztBQUFBLE1BQ0w7QUFDQSx1QkFBaUI7QUFDakIsVUFBSTtBQUFFLHFCQUFhLEVBQUUsSUFBSSxLQUFLLENBQUM7QUFBQSxNQUFHLFFBQVE7QUFBQSxNQUFDO0FBQzNDLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsaUJBQWlCO0FBQ2pDLGFBQU8sUUFBUSxNQUFNLElBQUksV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUFTLGFBQWEsS0FBSyxXQUFXLEtBQUssSUFBSSxDQUFDO0FBQzVGLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsbUJBQW1CO0FBQ25DLGFBQU8sUUFBUSxNQUFNLE9BQU8sV0FBVyxFQUFFLEtBQUssTUFBTSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQztBQUM5RSxhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLGlCQUFpQjtBQUNqQywwQkFBb0IsSUFBSSxLQUFLLEVBQUU7QUFBQSxRQUM3QixDQUFDLFVBQVU7QUFBRSxjQUFJO0FBQUUseUJBQWEsRUFBRSxVQUFVLE1BQU0sQ0FBQztBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUFFO0FBQUEsUUFDakUsTUFBTTtBQUFFLGNBQUk7QUFBRSx5QkFBYSxFQUFFLFVBQVUsS0FBSyxDQUFDO0FBQUEsVUFBRyxRQUFRO0FBQUEsVUFBQztBQUFBLFFBQUU7QUFBQSxNQUM3RDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBS0QsU0FBTyxPQUFPLE9BQU8sZ0JBQWdCLEVBQUUsaUJBQWlCLEtBQUssQ0FBQztBQUM5RCxTQUFPLE9BQU8sUUFBUSxZQUFZLE1BQU07QUFBQSxFQUFxQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJCdWZmZXIiLCAiYmxvY2tzIiwgImV4cG9ydHMiLCAibWFwU3lzdGVtIiwgImVzY2FwZVJlZ2V4IiwgImNqa0NoYXJzIiwgIm9ic0lkIiwgIm1hcFN5c3RlbSIsICJyIl0KfQo=
