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
    const end_date = rocToISO(visit?.cure_E_DATE || visit?.cure_e_date || "");
    const days = Number(drug.order_drug_day || drug.order_DRUG_DAY || 0);
    return {
      date,
      // Only emit when meaningfully populated AND different from start.
      // Suppressing the same-day case keeps OPD / 藥局 resources tight.
      end_date: end_date && end_date !== date ? end_date : "",
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
  function adaptProcedureListStub() {
    return null;
  }
  function adaptProcedureFromDetail(item) {
    if (!item || typeof item !== "object") return null;
    const subList = Array.isArray(item.sp_IHKE3308S04_data_list) ? item.sp_IHKE3308S04_data_list : [];
    const exeDate = subList.length > 0 ? subList[0].exe_S_DATE || subList[0].exe_s_date || "" : "";
    const date = rocToISO(exeDate || item.func_DATE || item.func_date || "");
    const opCode = item.op_CODE || item.op_code || "";
    const opName = pickEnglish(item.op_CODE_CNAME || item.op_code_cname || "");
    const display = (opName.replace(/^[A-Z0-9]+\//, "") || "").trim() || opName.trim();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9uaGktYWRhcHRlcnMuanMiLCAiLi4vc3JjL25oaS1lbmRwb2ludHMuanMiLCAiLi4vc3JjL2JhY2tncm91bmQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qXG4gKiBbanMtc2hhMV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1zaGExfVxuICpcbiAqIEB2ZXJzaW9uIDAuNy4wXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMjRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4vKmpzbGludCBiaXR3aXNlOiB0cnVlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgSU5QVVRfRVJST1IgPSAnaW5wdXQgaXMgaW52YWxpZCB0eXBlJztcbiAgdmFyIEZJTkFMSVpFX0VSUk9SID0gJ2ZpbmFsaXplIGFscmVhZHkgY2FsbGVkJztcbiAgdmFyIFdJTkRPVyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnO1xuICB2YXIgcm9vdCA9IFdJTkRPVyA/IHdpbmRvdyA6IHt9O1xuICBpZiAocm9vdC5KU19TSEExX05PX1dJTkRPVykge1xuICAgIFdJTkRPVyA9IGZhbHNlO1xuICB9XG4gIHZhciBXRUJfV09SS0VSID0gIVdJTkRPVyAmJiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCc7XG4gIHZhciBOT0RFX0pTID0gIXJvb3QuSlNfU0hBMV9OT19OT0RFX0pTICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbiAgaWYgKE5PREVfSlMpIHtcbiAgICByb290ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFdFQl9XT1JLRVIpIHtcbiAgICByb290ID0gc2VsZjtcbiAgfVxuICB2YXIgQ09NTU9OX0pTID0gIXJvb3QuSlNfU0hBMV9OT19DT01NT05fSlMgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHM7XG4gIHZhciBBTUQgPSB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQ7XG4gIHZhciBBUlJBWV9CVUZGRVIgPSAhcm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUiAmJiB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcbiAgdmFyIEVYVFJBID0gWy0yMTQ3NDgzNjQ4LCA4Mzg4NjA4LCAzMjc2OCwgMTI4XTtcbiAgdmFyIFNISUZUID0gWzI0LCAxNiwgOCwgMF07XG4gIHZhciBPVVRQVVRfVFlQRVMgPSBbJ2hleCcsICdhcnJheScsICdkaWdlc3QnLCAnYXJyYXlCdWZmZXInXTtcblxuICB2YXIgYmxvY2tzID0gW107XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICBpZiAocm9vdC5KU19TSEExX05PX05PREVfSlMgfHwgIWlzQXJyYXkpIHtcbiAgICBpc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG4gIH1cblxuICB2YXIgaXNWaWV3ID0gQXJyYXlCdWZmZXIuaXNWaWV3O1xuICBpZiAoQVJSQVlfQlVGRkVSICYmIChyb290LkpTX1NIQTFfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgfHwgIWlzVmlldykpIHtcbiAgICBpc1ZpZXcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmJ1ZmZlciAmJiBvYmouYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcjtcbiAgICB9O1xuICB9XG5cbiAgLy8gW21lc3NhZ2U6IHN0cmluZywgaXNTdHJpbmc6IGJvb2xdXG4gIHZhciBmb3JtYXRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXNzYWdlO1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIFttZXNzYWdlLCB0cnVlXTtcbiAgICB9XG4gICAgaWYgKHR5cGUgIT09ICdvYmplY3QnIHx8IG1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChBUlJBWV9CVUZGRVIgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBbbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSksIGZhbHNlXTtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5KG1lc3NhZ2UpICYmICFpc1ZpZXcobWVzc2FnZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiBbbWVzc2FnZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGNyZWF0ZU91dHB1dE1ldGhvZCA9IGZ1bmN0aW9uIChvdXRwdXRUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IFNoYTEodHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2QgPSBjcmVhdGVPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIGlmIChOT0RFX0pTKSB7XG4gICAgICBtZXRob2QgPSBub2RlV3JhcChtZXRob2QpO1xuICAgIH1cbiAgICBtZXRob2QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKCk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXRob2QuY3JlYXRlKCkudXBkYXRlKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPVVRQVVRfVFlQRVMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0eXBlID0gT1VUUFVUX1RZUEVTW2ldO1xuICAgICAgbWV0aG9kW3R5cGVdID0gY3JlYXRlT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIHZhciBub2RlV3JhcCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgICB2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgIHZhciBidWZmZXJGcm9tO1xuICAgIGlmIChCdWZmZXIuZnJvbSAmJiAhcm9vdC5KU19TSEExX05PX0JVRkZFUl9GUk9NKSB7XG4gICAgICBidWZmZXJGcm9tID0gQnVmZmVyLmZyb207XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlckZyb20gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IEJ1ZmZlcihtZXNzYWdlKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBub2RlTWV0aG9kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKG1lc3NhZ2UsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09PSBudWxsIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlBVVF9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG1lc3NhZ2UpIHx8IGlzVmlldyhtZXNzYWdlKSB8fFxuICAgICAgICBtZXNzYWdlLmNvbnN0cnVjdG9yID09PSBCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ1ZmZlckZyb20obWVzc2FnZSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5vZGVNZXRob2Q7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSwgdHJ1ZSkudXBkYXRlKG1lc3NhZ2UpW291dHB1dFR5cGVdKCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgY3JlYXRlSG1hY01ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlSG1hY091dHB1dE1ldGhvZCgnaGV4Jyk7XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgSG1hY1NoYTEoa2V5KTtcbiAgICB9O1xuICAgIG1ldGhvZC51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZShrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QodHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRob2Q7XG4gIH07XG5cbiAgZnVuY3Rpb24gU2hhMShzaGFyZWRNZW1vcnkpIHtcbiAgICBpZiAoc2hhcmVkTWVtb3J5KSB7XG4gICAgICBibG9ja3NbMF0gPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICBibG9ja3NbOF0gPSBibG9ja3NbOV0gPSBibG9ja3NbMTBdID0gYmxvY2tzWzExXSA9XG4gICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICB9XG5cbiAgICB0aGlzLmgwID0gMHg2NzQ1MjMwMTtcbiAgICB0aGlzLmgxID0gMHhFRkNEQUI4OTtcbiAgICB0aGlzLmgyID0gMHg5OEJBRENGRTtcbiAgICB0aGlzLmgzID0gMHgxMDMyNTQ3NjtcbiAgICB0aGlzLmg0ID0gMHhDM0QyRTFGMDtcblxuICAgIHRoaXMuYmxvY2sgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMDtcbiAgICB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJzdCA9IHRydWU7XG4gIH1cblxuICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEZJTkFMSVpFX0VSUk9SKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShtZXNzYWdlKTtcbiAgICBtZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgIHZhciBpc1N0cmluZyA9IHJlc3VsdFsxXTtcbiAgICB2YXIgY29kZSwgaW5kZXggPSAwLCBpLCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCB8fCAwLCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gZmFsc2U7XG4gICAgICAgIGJsb2Nrc1swXSA9IHRoaXMuYmxvY2s7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdID0gYmxvY2tzWzFdID0gYmxvY2tzWzJdID0gYmxvY2tzWzNdID1cbiAgICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgICBibG9ja3NbMTJdID0gYmxvY2tzWzEzXSA9IGJsb2Nrc1sxNF0gPSBibG9ja3NbMTVdID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYoaXNTdHJpbmcpIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gY29kZSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvZGUgPSAweDEwMDAwICsgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhmMCB8IChjb2RlID4+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSB0aGlzLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgNjQ7ICsraW5kZXgpIHtcbiAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaTtcbiAgICAgIHRoaXMuYnl0ZXMgKz0gaSAtIHRoaXMuc3RhcnQ7XG4gICAgICBpZiAoaSA+PSA2NCkge1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGkgLSA2NDtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICAgIHRoaXMuaGFzaGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDA7XG4gICAgICB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgdmFyIGJsb2NrcyA9IHRoaXMuYmxvY2tzLCBpID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgIGJsb2Nrc1sxNl0gPSB0aGlzLmJsb2NrO1xuICAgIGJsb2Nrc1tpID4+PiAyXSB8PSBFWFRSQVtpICYgM107XG4gICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgaWYgKGkgPj0gNTYpIHtcbiAgICAgIGlmICghdGhpcy5oYXNoZWQpIHtcbiAgICAgICAgdGhpcy5oYXNoKCk7XG4gICAgICB9XG4gICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgfVxuICAgIGJsb2Nrc1sxNF0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjk7XG4gICAgYmxvY2tzWzE1XSA9IHRoaXMuYnl0ZXMgPDwgMztcbiAgICB0aGlzLmhhc2goKTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhID0gdGhpcy5oMCwgYiA9IHRoaXMuaDEsIGMgPSB0aGlzLmgyLCBkID0gdGhpcy5oMywgZSA9IHRoaXMuaDQ7XG4gICAgdmFyIGYsIGosIHQsIGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgZm9yKGogPSAxNjsgaiA8IDgwOyArK2opIHtcbiAgICAgIHQgPSBibG9ja3NbaiAtIDNdIF4gYmxvY2tzW2ogLSA4XSBeIGJsb2Nrc1tqIC0gMTRdIF4gYmxvY2tzW2ogLSAxNl07XG4gICAgICBibG9ja3Nbal0gPSAgKHQgPDwgMSkgfCAodCA+Pj4gMzEpO1xuICAgIH1cblxuICAgIGZvcihqID0gMDsgaiA8IDIwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IChhICYgYikgfCAoKH5hKSAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoKH5lKSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoKH5kKSAmIGEpO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IChjICYgZCkgfCAoKH5jKSAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgKyAxNTE4NTAwMjQ5ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgNDA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqXSA8PCAwO1xuICAgICAgYiA9IChiIDw8IDMwKSB8IChiID4+PiAyKTtcblxuICAgICAgZiA9IGEgXiBiIF4gYztcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAzXSA8PCAwO1xuICAgICAgZCA9IChkIDw8IDMwKSB8IChkID4+PiAyKTtcblxuICAgICAgZiA9IGMgXiBkIF4gZTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDYwOyBqICs9IDUpIHtcbiAgICAgIGYgPSAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSAtIDE4OTQwMDc1ODggKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKGEgJiBjKSB8IChiICYgYyk7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gKGUgJiBhKSB8IChlICYgYikgfCAoYSAmIGIpO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IChkICYgZSkgfCAoZCAmIGEpIHwgKGUgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKGMgJiBlKSB8IChkICYgZSk7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA4MDsgaiArPSA1KSB7XG4gICAgICBmID0gYiBeIGMgXiBkO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSA4OTk0OTc1MTQgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSBlIF4gYSBeIGI7XG4gICAgICB0ID0gKGQgPDwgNSkgfCAoZCA+Pj4gMjcpO1xuICAgICAgYyA9IHQgKyBmICsgYyAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSBkIF4gZSBeIGE7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSAtIDg5OTQ5NzUxNCArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IHRoaXMuaDAgKyBhIDw8IDA7XG4gICAgdGhpcy5oMSA9IHRoaXMuaDEgKyBiIDw8IDA7XG4gICAgdGhpcy5oMiA9IHRoaXMuaDIgKyBjIDw8IDA7XG4gICAgdGhpcy5oMyA9IHRoaXMuaDMgKyBkIDw8IDA7XG4gICAgdGhpcy5oNCA9IHRoaXMuaDQgKyBlIDw8IDA7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBoMCA9IHRoaXMuaDAsIGgxID0gdGhpcy5oMSwgaDIgPSB0aGlzLmgyLCBoMyA9IHRoaXMuaDMsIGg0ID0gdGhpcy5oNDtcblxuICAgIHJldHVybiBIRVhfQ0hBUlNbKGgwID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDAgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gyICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDMgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toNCAmIDB4MEZdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLnRvU3RyaW5nID0gU2hhMS5wcm90b3R5cGUuaGV4O1xuXG4gIFNoYTEucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gW1xuICAgICAgKGgwID4+PiAyNCkgJiAweEZGLCAoaDAgPj4+IDE2KSAmIDB4RkYsIChoMCA+Pj4gOCkgJiAweEZGLCBoMCAmIDB4RkYsXG4gICAgICAoaDEgPj4+IDI0KSAmIDB4RkYsIChoMSA+Pj4gMTYpICYgMHhGRiwgKGgxID4+PiA4KSAmIDB4RkYsIGgxICYgMHhGRixcbiAgICAgIChoMiA+Pj4gMjQpICYgMHhGRiwgKGgyID4+PiAxNikgJiAweEZGLCAoaDIgPj4+IDgpICYgMHhGRiwgaDIgJiAweEZGLFxuICAgICAgKGgzID4+PiAyNCkgJiAweEZGLCAoaDMgPj4+IDE2KSAmIDB4RkYsIChoMyA+Pj4gOCkgJiAweEZGLCBoMyAmIDB4RkYsXG4gICAgICAoaDQgPj4+IDI0KSAmIDB4RkYsIChoNCA+Pj4gMTYpICYgMHhGRiwgKGg0ID4+PiA4KSAmIDB4RkYsIGg0ICYgMHhGRlxuICAgIF07XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXkgPSBTaGExLnByb3RvdHlwZS5kaWdlc3Q7XG5cbiAgU2hhMS5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG4gICAgdmFyIGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDAsIHRoaXMuaDApO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMig0LCB0aGlzLmgxKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoOCwgdGhpcy5oMik7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDEyLCB0aGlzLmgzKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoMTYsIHRoaXMuaDQpO1xuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgZnVuY3Rpb24gSG1hY1NoYTEoa2V5LCBzaGFyZWRNZW1vcnkpIHtcbiAgICB2YXIgaSwgcmVzdWx0ID0gZm9ybWF0TWVzc2FnZShrZXkpO1xuICAgIGtleSA9IHJlc3VsdFswXTtcbiAgICBpZiAocmVzdWx0WzFdKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgbGVuZ3RoID0ga2V5Lmxlbmd0aCwgaW5kZXggPSAwLCBjb2RlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvZGUgPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4YzAgfCAoY29kZSA+Pj4gNikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHhlMCB8IChjb2RlID4+PiAxMikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweDNmZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiAxMikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gNikgJiAweDNmKSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8IChjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBrZXkgPSBieXRlcztcbiAgICB9XG5cbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDY0KSB7XG4gICAgICBrZXkgPSAobmV3IFNoYTEodHJ1ZSkpLnVwZGF0ZShrZXkpLmFycmF5KCk7XG4gICAgfVxuXG4gICAgdmFyIG9LZXlQYWQgPSBbXSwgaUtleVBhZCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgKytpKSB7XG4gICAgICB2YXIgYiA9IGtleVtpXSB8fCAwO1xuICAgICAgb0tleVBhZFtpXSA9IDB4NWMgXiBiO1xuICAgICAgaUtleVBhZFtpXSA9IDB4MzYgXiBiO1xuICAgIH1cblxuICAgIFNoYTEuY2FsbCh0aGlzLCBzaGFyZWRNZW1vcnkpO1xuXG4gICAgdGhpcy51cGRhdGUoaUtleVBhZCk7XG4gICAgdGhpcy5vS2V5UGFkID0gb0tleVBhZDtcbiAgICB0aGlzLmlubmVyID0gdHJ1ZTtcbiAgICB0aGlzLnNoYXJlZE1lbW9yeSA9IHNoYXJlZE1lbW9yeTtcbiAgfVxuICBIbWFjU2hhMS5wcm90b3R5cGUgPSBuZXcgU2hhMSgpO1xuXG4gIEhtYWNTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZS5jYWxsKHRoaXMpO1xuICAgIGlmICh0aGlzLmlubmVyKSB7XG4gICAgICB0aGlzLmlubmVyID0gZmFsc2U7XG4gICAgICB2YXIgaW5uZXJIYXNoID0gdGhpcy5hcnJheSgpO1xuICAgICAgU2hhMS5jYWxsKHRoaXMsIHRoaXMuc2hhcmVkTWVtb3J5KTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMub0tleVBhZCk7XG4gICAgICB0aGlzLnVwZGF0ZShpbm5lckhhc2gpO1xuICAgICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV4cG9ydHMgPSBjcmVhdGVNZXRob2QoKTtcbiAgZXhwb3J0cy5zaGExID0gZXhwb3J0cztcbiAgZXhwb3J0cy5zaGExLmhtYWMgPSBjcmVhdGVIbWFjTWV0aG9kKCk7XG5cbiAgaWYgKENPTU1PTl9KUykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiAgfSBlbHNlIHtcbiAgICByb290LnNoYTEgPSBleHBvcnRzO1xuICAgIGlmIChBTUQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwgIi8qKlxuICogQ2VudHJhbGlzZWQgRkhJUiBDb2RlU3lzdGVtIC8gSWRlbnRpZmllclN5c3RlbSBVUklzIHVzZWQgYnkgdGhlIG1hcHBlcnMuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvZmhpci9zeXN0ZW1zLnB5YC4gV2UgdXNlIFVSTC1mb3JtIHN5c3RlbXMgaW5zdGVhZFxuICogb2YgT0lEcyBiZWNhdXNlOlxuICogICAtIGl0IGRvZXNuJ3QgcmVxdWlyZSBtaW50aW5nL293bmluZyBhIHJlYWwgTkhJL1RXIGNvcmUgT0lELFxuICogICAtIGl0J3Mgc2VsZi1kZXNjcmliaW5nIGluIHRvb2xzIHRoYXQgZG9uJ3QgcmVjb2duaXNlIHRoZSBPSUQsXG4gKiAgIC0gaXQgY2xlYW5seSBzdXJ2aXZlcyB0aGUgVFdOSElGSElSIHZhbGlkYXRvcidzIHN5bnRhY3RpYyBjaGVjay5cbiAqXG4gKiBBbGwgc3lzdGVtcyBsaXZlIGhlcmUgc28gYSBzaW5nbGUgY2hhbmdlIHJpcHBsZXMgdG8gZXZlcnkgbWFwcGVyLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgbmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU1MDY1XHU0RkREXHU3RjcyXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIChsYWIgKyBwcm9jZWR1cmUgb3JkZXIgY29kZXMgXHUyMDE0IHNhbWUgbmFtZXNwYWNlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfTUVESUNBTF9PUkRFUl9DT0RFID1cbiAgXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1tZWRpY2FsLW9yZGVyLWNvZGVcIjtcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1ODVFNVx1NTRDMVx1NEVFM1x1NzhCQyAoZHJ1ZyBjb2RlKS4gKi9cbmV4cG9ydCBjb25zdCBOSElfRFJVR19DT0RFID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9Db2RlU3lzdGVtL25oaS1kcnVnLWNvZGVcIjtcblxuLy8gXHUyNTAwXHUyNTAwIFRhaXdhbiBwYXRpZW50IGlkZW50aWZpZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogXHU4RUFCXHU1MjA2XHU4QjQ5XHU1QjU3XHU4NjVGIChUYWl3YW4gbmF0aW9uYWwgSUQpLiAqL1xuZXhwb3J0IGNvbnN0IFRXX05BVElPTkFMX0lEID0gXCJodHRwczovL3R3Y29yZS5tb2h3Lmdvdi50dy9JZGVudGlmaWVyU3lzdGVtL25hdGlvbmFsLWlkXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBmYWxsYmFja3MgKHBlci1kZXBsb3ltZW50LCBOT1QgY3Jvc3Mtc3lzdGVtIGNhbm9uaWNhbCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTEFCX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWxhYlwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9NRURJQ0FUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLW1lZGljYXRpb25cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUkVQT1JUX0NPREUgPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLXJlcG9ydFwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9DT05ESVRJT05fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtY29uZGl0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BST0NFRFVSRV9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1wcm9jZWR1cmVcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQUxMRVJHRU5fQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtYWxsZXJnZW5cIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfUEFUSUVOVF9NUk4gPSBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0lkZW50aWZpZXJTeXN0ZW0vaGlzLW1yblwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW50ZXJuYXRpb25hbCBjb2RlIHN5c3RlbXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBjb25zdCBMT0lOQyA9IFwiaHR0cDovL2xvaW5jLm9yZ1wiO1xuZXhwb3J0IGNvbnN0IFNOT01FRF9DVCA9IFwiaHR0cDovL3Nub21lZC5pbmZvL3NjdFwiO1xuLyoqIElDRC0xMC1DTSAoVGFpd2FuIC8gXHU1MDY1XHU0RkREIHVzZXMgdGhpcywgbm90IGJhcmUgSUNELTEwKS4gKi9cbmV4cG9ydCBjb25zdCBJQ0RfMTBfQ00gPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1jbVwiO1xuZXhwb3J0IGNvbnN0IElDRF8xMF9QQ1MgPSBcImh0dHA6Ly9obDcub3JnL2ZoaXIvc2lkL2ljZC0xMC1wY3NcIjtcbiIsICIvKipcbiAqIENyb3NzLW1hcHBlciBoZWxwZXJzIHNoYXJlZCBieSBzZXZlcmFsIEZISVIgcmVzb3VyY2UgbWFwcGVycy5cbiAqL1xuXG5pbXBvcnQgeyBzaGExIH0gZnJvbSBcImpzLXNoYTFcIjtcblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljIDMyLWNoYXIgaGV4IElEIGRlcml2ZWQgZnJvbSB0aGUgcGF0aWVudCBJRCArIGFyYml0cmFyeVxuICoga2V5IHBhcnRzLiBTYW1lIFNIQS0xICsgdHJ1bmNhdGUtMzIgYWxnb3JpdGhtIHVzZWQgaW4gYm90aCBiYWNrZW5kXG4gKiBhbmQgZXh0ZW5zaW9uIHNvIHRoZSB0d28gcHJvZHVjZSBpZGVudGljYWwgSURzIGZvciB0aGUgc2FtZSBpbnB1dCBcdTIwMTRcbiAqIHRoaXMgaXMgd2hhdCBtYWtlcyBcImV4dGVuc2lvbiBsb2NhbCBidW5kbGUgXHUyMTkyIGJhY2tlbmQgL2ZoaXIvaW1wb3J0XCJcbiAqIHdvcmsgd2l0aG91dCBwcm9kdWNpbmcgZHVwbGljYXRlIFBhdGllbnQgcm93cy5cbiAqXG4gKiBOb3RlOiBkZXRlcm1pbmlzdGljICsgbm8gc2FsdCBtZWFucyBhbiBhdHRhY2tlciB3aG8gb2J0YWlucyBPTkxZIGFcbiAqIGhhc2hlZCBQYXRpZW50LmlkIChlLmcuIHZpYSBhbiBIVFRQIGFjY2VzcyBsb2cpIGNhbiBicnV0ZS1mb3JjZSB0aGVcbiAqIH4zME0gVGFpd2FuZXNlIG5hdGlvbmFsIElEIHNwYWNlIGFuZCByZWNvdmVyIHRoZSByYXcgSUQuIFdlIGFjY2VwdFxuICogdGhpcyBiZWNhdXNlIFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlIGFscmVhZHkgY2FycmllcyB0aGUgcmF3XG4gKiBuYXRpb25hbCBJRCBpbiBhbnkgbGVha2VkIEJ1bmRsZSBcdTIwMTQgdGhlIHJlYWxpc3RpYyBCdW5kbGUtbGVha1xuICogc2NlbmFyaW9zIGRpc2Nsb3NlIGJvdGggZmllbGRzIHRvZ2V0aGVyLCBzbyBhIHNhbHQgd291bGQgbm90IG1vdmVcbiAqIHRoZSBuZWVkbGUgdGhlcmUuIFRoZSByZW1haW5pbmcgc2luZ2xlLWZpZWxkIGxlYWsgdmVjdG9yIGlzIEhUVFBcbiAqIGFjY2VzcyBsb2dzOyBkZXBsb3ltZW50cyBzaG91bGQgc2NydWIgYC9maGlyL1BhdGllbnQvW14vXStgIHBhdGhzXG4gKiBhbmQgYD9wYXRpZW50PWAgcXVlcnkgc3RyaW5ncyBhdCB0aGUgcmV2ZXJzZS1wcm94eSBsYXllciAoc2VlXG4gKiBBUkNISVRFQ1RVUkUubWQgXHUwMEE3XCJQYXRpZW50LmlkIFx1NTNDRFx1NjNBOFx1OThBOFx1OTZBQVx1ODIwN1x1N0RFOVx1ODlFM1wiKS5cbiAqXG4gKiBVc2VzIGBqcy1zaGExYCAocHVyZSBKUykgaW5zdGVhZCBvZiBgbm9kZTpjcnlwdG9gIHNvIHRoZSBzYW1lIG1hcHBlclxuICogY29kZSBydW5zIHVubW9kaWZpZWQgaW4gdGhlIENocm9tZSBleHRlbnNpb24ncyBsb2NhbC1vbmx5IG1vZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVJZChwYXRpZW50SWQ6IHN0cmluZywgLi4ucGFydHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW3BhdGllbnRJZCwgLi4ucGFydHNdLmpvaW4oXCJ8XCIpKS5zbGljZSgwLCAzMik7XG59XG5cbi8qKlxuICogTWFwIGEgcmF3IG5hdGlvbmFsIElEIChvciBhbnkgcGF0aWVudCBpZGVudGlmaWVyKSB0byBpdHMgMzItY2hhciBoZXhcbiAqIEZISVIgYFBhdGllbnQuaWRgLiBUaGUgcmF3IHZhbHVlIGlzIGtlcHQgaW4gYFBhdGllbnQuaWRlbnRpZmllcltdLnZhbHVlYFxuICogXHUyMDE0IG9ubHkgdGhlIEZISVIgbG9naWNhbCBpZCBpcyBoYXNoZWQgc28gaXQgZG9lc24ndCBsZWFrIGludG8gVVJMcyxcbiAqIHN1YmplY3QucmVmZXJlbmNlIGZpZWxkcywgYXVkaXQgbG9ncywgb3IgU01BUlQgdG9rZW4gcGF5bG9hZHMuXG4gKlxuICogRkhJUiBSNCBcdTAwQTcyLjIwIHNheXMgXCJsb2dpY2FsIGlkIFx1MjAyNiBTSE9VTEQgTk9UIGNvbnRhaW4gaWRlbnRpZnlpbmdcbiAqIGluZm9ybWF0aW9uXCIgXHUyMDE0IHRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVQYXRpZW50SWQobmF0aW9uYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW1wicGF0aWVudFwiLCBuYXRpb25hbElkXS5qb2luKFwifFwiKSkuc2xpY2UoMCwgMzIpO1xufVxuXG4vKipcbiAqIFBhcnRpYWxseS1hbm9ueW1pemUgYSBwYXRpZW50IG5hbWUuIEFwcGxpZWQgaW4gbWFwUGF0aWVudCBzbyBldmVyeVxuICogRkhJUiByZXNvdXJjZSB0aGF0IGZsb3dzIG91dCBvZiB0aGlzIGNvZGViYXNlIChkb3dubG9hZGVkIEJ1bmRsZSxcbiAqIGJhY2tlbmQgRkhJUiBzdG9yZSwgZGFzaGJvYXJkLCBTTUFSVCBhcHAgbGF1bmNoZXMpIHNlZXMgdGhlIG1hc2tlZFxuICogZm9ybS4gVGhlIHVzZXIncyByYXcgaW5wdXQgaXMgc3RpbGwga2VwdCBpbiBjaHJvbWUuc3RvcmFnZSBzbyB0aGV5XG4gKiBjYW4gcmV2aWV3IHdoYXQgd2FzIGVudGVyZWQsIGJ1dCBpdCBuZXZlciBsZWF2ZXMgUGF0aWVudCBjb250ZXh0LlxuICpcbiAqIFJ1bGVzIChUYWl3YW4gLyBDSksgY29udmVudGlvbik6XG4gKiAgIC0gMSBjaGFyICAgICBcdTIxOTIga2VlcCBhcy1pcyAobm90aGluZyB0byBtYXNrKVxuICogICAtIDIgY2hhcnMgICAgXHUyMTkyIGtlZXAgZmlyc3QsIHJlcGxhY2Ugc2Vjb25kIHdpdGggTyAgICBcdTczOEJcdTY2MEUgXHUyMTkyIFx1NzM4Qk9cbiAqICAgLSAzKyBjaGFycyAgIFx1MjE5MiBrZWVwIGZpcnN0ICsgbGFzdCwgbWlkZGxlIGFsbCBPICAgICAgXHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTkwRURPXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTY3OTdcdTkwRURcdTRFMDBcdTY1QjAgXHUyMTkyIFx1Njc5N09PXHU2NUIwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTRFMkRcdTVDRjZcdTUwNjVcdTZCMjFcdTkwQ0UgXHUyMTkyIFx1NEUyRE9PT1x1OTBDRVxuICpcbiAqIFdlc3Rlcm4gbmFtZXMgKGNvbnRhaW4gd2hpdGVzcGFjZSk6IHNwbGl0IG9uIHNwYWNlLCBrZWVwIGZpcnN0ICtcbiAqIGxhc3QgdG9rZW5zLCBwYXJ0aWFsLW1hc2sgdGhlIGxhc3QgYW5kIG1pZGRsZTpcbiAqICAgSm9obiBTbWl0aCBcdTIxOTIgSm9obiBTKioqXG4gKiAgIEpvaG4gUSBTbWl0aCBcdTIxOTIgSm9obiAqKiogU21pdGhcbiAqL1xuLyoqXG4gKiBIYWxmLW1hc2sgYSBUYWl3YW4gbmF0aW9uYWwgSUQgZm9yIHNob3VsZGVyLXN1cmZpbmctc2FmZSBkaXNwbGF5LlxuICogTWF0Y2hlcyBOSEkgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBJ3Mgb3duIGBoaWRgIGNvbnZlbnRpb24gKGZpcnN0IDYgdmlzaWJsZSwgbGFzdFxuICogNCBoaWRkZW4pOiBgUDEyMzQ1MDg2NmAgXHUyMTkyIGBQMTIzNDUqKioqYC5cbiAqXG4gKiBgY2hhcmAgZGVmYXVsdHMgdG8gYCpgIGZvciBwb3B1cC90b2FzdCBkaXNwbGF5LiBVc2UgYFhgIGZvciBmaWxlbmFtZXNcbiAqIHNpbmNlIGAqYCBpcyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIFRoZSBhdXRvLWdlbmVyYXRlZFxuICogYGF1dG8tWFhYWFhYWFhgIHBsYWNlaG9sZGVycyBmbG93IHRocm91Z2ggdW5jaGFuZ2VkIChhbHJlYWR5XG4gKiBub24taWRlbnRpZnlpbmcpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFza0lkKGlkOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjaGFyID0gXCIqXCIpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKGlkID8/IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFzKSByZXR1cm4gcztcbiAgaWYgKC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChzKSkgcmV0dXJuIHMuc2xpY2UoMCwgNikgKyBjaGFyLnJlcGVhdCg0KTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcImF1dG8tXCIpKSByZXR1cm4gcztcbiAgaWYgKHMubGVuZ3RoID4gNikgcmV0dXJuIHMuc2xpY2UoMCwgMikgKyBjaGFyLnJlcGVhdChzLmxlbmd0aCAtIDQpICsgcy5zbGljZSgtMik7XG4gIHJldHVybiBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFza05hbWUobmFtZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSAobmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghdHJpbW1lZCB8fCB0cmltbWVkID09PSBcIlVua25vd25cIikgcmV0dXJuIHRyaW1tZWQ7XG5cbiAgaWYgKC9cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoL1xccysvKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSByZXR1cm4gcGFydHNbMF0hO1xuICAgIGNvbnN0IGZpcnN0ID0gcGFydHNbMF0hO1xuICAgIGNvbnN0IGxhc3QgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSE7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gRml4ZWQgMyBzdGFycyByZWdhcmRsZXNzIG9mIG9yaWdpbmFsIGxlbmd0aCBcdTIwMTQgZG9uJ3QgbGVhayBob3dcbiAgICAgIC8vIGxvbmcgdGhlIHN1cm5hbWUgd2FzIHZpYSBtYXNrIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxhc3RNYXNrZWQgPSBsYXN0Lmxlbmd0aCA8PSAxID8gbGFzdCA6IGAke2xhc3RbMF19KioqYDtcbiAgICAgIHJldHVybiBgJHtmaXJzdH0gJHtsYXN0TWFza2VkfWA7XG4gICAgfVxuICAgIGNvbnN0IG1pZGRsZXMgPSBwYXJ0cy5zbGljZSgxLCAtMSkubWFwKCgpID0+IFwiKioqXCIpO1xuICAgIHJldHVybiBbZmlyc3QsIC4uLm1pZGRsZXMsIGxhc3RdLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgLy8gQ0pLIC8gc2luZ2xlLXRva2VuIHBhdGguIEl0ZXJhdGUgY29kZXBvaW50cyAobm90IFVURi0xNiB1bml0cykgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyBjYW4ndCBnZXQgc3BsaXQgbWlkLWNoYXJhY3Rlci5cbiAgY29uc3QgY2hhcnMgPSBBcnJheS5mcm9tKHRyaW1tZWQpO1xuICBpZiAoY2hhcnMubGVuZ3RoIDw9IDEpIHJldHVybiB0cmltbWVkO1xuICBpZiAoY2hhcnMubGVuZ3RoID09PSAyKSByZXR1cm4gYCR7Y2hhcnNbMF19T2A7XG4gIHJldHVybiBjaGFyc1swXSArIFwiT1wiLnJlcGVhdChjaGFycy5sZW5ndGggLSAyKSArIGNoYXJzW2NoYXJzLmxlbmd0aCAtIDFdO1xufVxuIiwgIi8qKlxuICogQWxsZXJneUludG9sZXJhbmNlIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvYWxsZXJneS5weWAuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgQUxMT1dFRF9DQVRFR09SSUVTID0gbmV3IFNldChbXCJtZWRpY2F0aW9uXCIsIFwiZm9vZFwiLCBcImVudmlyb25tZW50XCIsIFwiYmlvbG9naWNcIl0pO1xuY29uc3QgQUxMT1dFRF9DUklUSUNBTElUWSA9IG5ldyBTZXQoW1wiaGlnaFwiLCBcImxvd1wiLCBcInVuYWJsZS10by1hc3Nlc3NcIl0pO1xuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwicnhub3JtXCIpKSByZXR1cm4gXCJodHRwOi8vd3d3Lm5sbS5uaWguZ292L3Jlc2VhcmNoL3VtbHMvcnhub3JtXCI7XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9BTExFUkdFTl9DT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwQWxsZXJneUludG9sZXJhbmNlKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQWxsZXJnZW5cIjtcbiAgY29uc3QgY29kZSA9IHJhdy5jb2RlO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQWxsZXJneUludG9sZXJhbmNlXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcucmVjb3JkZWRfZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgcGF0aWVudDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgICBjbGluaWNhbFN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtY2xpbmljYWxcIixcbiAgICAgICAgICBjb2RlOiBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9hbGxlcmd5aW50b2xlcmFuY2UtdmVyaWZpY2F0aW9uXCIsXG4gICAgICAgICAgY29kZTogXCJjb25maXJtZWRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBjb2RlOiB7XG4gICAgICBjb2Rpbmc6IFt7IHN5c3RlbSwgY29kZTogY29kZSB8fCBkaXNwbGF5LCBkaXNwbGF5IH1dLFxuICAgICAgdGV4dDogZGlzcGxheSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGNhdGVnb3J5ID0gcmF3LmNhdGVnb3J5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NBVEVHT1JJRVMuaGFzKGNhdGVnb3J5KSkge1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW2NhdGVnb3J5XTtcbiAgfVxuXG4gIGNvbnN0IGNyaXRpY2FsaXR5ID0gcmF3LmNyaXRpY2FsaXR5ID8/IFwiXCI7XG4gIGlmIChBTExPV0VEX0NSSVRJQ0FMSVRZLmhhcyhjcml0aWNhbGl0eSkpIHtcbiAgICByZXNvdXJjZS5jcml0aWNhbGl0eSA9IGNyaXRpY2FsaXR5O1xuICB9XG5cbiAgaWYgKHJhdy5yZWNvcmRlZF9kYXRlKSB7XG4gICAgcmVzb3VyY2UucmVjb3JkZWREYXRlID0gYCR7cmF3LnJlY29yZGVkX2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuXG4gIGNvbnN0IHJlYWN0aW9uTm90ZSA9IHJhdy5yZWFjdGlvbiA/PyBcIlwiO1xuICBpZiAocmVhY3Rpb25Ob3RlKSB7XG4gICAgcmVzb3VyY2UucmVhY3Rpb24gPSBbeyBkZXNjcmlwdGlvbjogcmVhY3Rpb25Ob3RlIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIiwgIi8qKlxuICogQ29uZGl0aW9uIG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvY29uZGl0aW9uLnB5YC4gSW5jbHVkZXMgdGhlIElDRC0xMC1DTVxuICogbm9ybWFsaXNlciAoVFdOSElGSElSIFJvdW5kLTMgZml4KSB3aGljaCBpbnNlcnRzIHRoZSBjYW5vbmljYWwgZG90XG4gKiBiYWNrIGludG8gTkhJJ3MgdW4tZG90dGVkIGNvZGVzIChcIkUxMTIyXCIgXHUyMTkyIFwiRTExLjIyXCIpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbi8vIElDRC0xMC1DTSBjYW5vbmljYWwgZm9ybSBpcyAnWFhYLllZWVtBLVpdJyAoY2F0ZWdvcnkgMyBjaGFycyArIG9wdGlvbmFsXG4vLyBkb3QgKyBzdWJkaXZpc2lvbiArIG9wdGlvbmFsIDd0aC1jaGFyYWN0ZXIgZXh0ZW5zaW9uKS4gTkhJIFx1NTA2NVx1NEZERCBzZW5kc1xuLy8gY29kZXMgV0lUSE9VVCB0aGUgZG90ICgnRTExMjInLCAnTTQ3ODkyJywgJ1MwOTkzWEEnLCAnTTE5MjcxJykuXG4vLyBWYWxpZGF0b3IgcmVqZWN0cyB1bi1kb3R0ZWQgY29kZXMgYXMgJ1Vua25vd24gY29kZScuXG5jb25zdCBJQ0QxMF9DQVRFR09SWV9SRSA9IC9eW0EtWl1bMC05QS1aXXsyfSQvO1xuXG4vKipcbiAqIEluc2VydCB0aGUgZG90IGJhY2sgaW50byBOSEkncyBuby1kb3QgSUNELTEwLUNNIGNvZGVzLlxuICogICBFMTEyMiAgICBcdTIxOTIgRTExLjIyXG4gKiAgIE00Nzg5MiAgIFx1MjE5MiBNNDcuODkyXG4gKiAgIFMwOTkzWEEgIFx1MjE5MiBTMDkuOTNYQVxuICogICBFMTEgICAgICBcdTIxOTIgRTExICAgICAgICAobm8gc3ViZGl2aXNpb247IHBhc3MgdGhyb3VnaClcbiAqICAgRTExLjIyICAgXHUyMTkyIEUxMS4yMiAgICAgKGFscmVhZHkgZG90dGVkOyBwYXNzIHRocm91Z2gpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVJY2QxMENtKGNvZGU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWNvZGUgfHwgY29kZS5pbmNsdWRlcyhcIi5cIikpIHJldHVybiBjb2RlID8/IFwiXCI7XG4gIGNvbnN0IHMgPSBjb2RlLnRyaW0oKS50b1VwcGVyQ2FzZSgpO1xuICBpZiAocy5sZW5ndGggPD0gMykgcmV0dXJuIHM7XG4gIGNvbnN0IGhlYWQgPSBzLnNsaWNlKDAsIDMpO1xuICBjb25zdCB0YWlsID0gcy5zbGljZSgzKTtcbiAgaWYgKElDRDEwX0NBVEVHT1JZX1JFLnRlc3QoaGVhZCkpIHtcbiAgICByZXR1cm4gYCR7aGVhZH0uJHt0YWlsfWA7XG4gIH1cbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJpY2QtMTBcIikgfHwgcy5pbmNsdWRlcyhcImljZDEwXCIpKSB7XG4gICAgLy8gTkhJIFx1NTA2NVx1NEZERCBjb2RlcyBhcmUgSUNELTEwLUNNIChVUy9UYWl3YW4gZXh0ZW5kZWQgc2V0IFx1MjAxNCBlLmcuXG4gICAgLy8gRTExLjIyKS4gVGhlIGJhc2UgSUNELTEwIFZhbHVlU2V0IHJlamVjdHMgdGhlc2UgYXMgJ1Vua25vd24gY29kZScuXG4gICAgcmV0dXJuIHN5c3RlbXMuSUNEXzEwX0NNO1xuICB9XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9DT05ESVRJT05fQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcENvbmRpdGlvbihyYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhdGllbnRJZDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gQ29uZGl0aW9uXCI7XG4gIGxldCBjb2RlID0gcmF3LmNvZGUgYXMgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG4gIGlmIChzeXN0ZW0gPT09IHN5c3RlbXMuSUNEXzEwX0NNICYmIGNvZGUpIHtcbiAgICBjb2RlID0gbm9ybWFsaXplSWNkMTBDbShjb2RlKTtcbiAgfVxuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJDb25kaXRpb25cIixcbiAgICAvLyBTdGFibGUgaWQgZmFsbHMgYmFjayB0byBkaXNwbGF5IHdoZW4gbm8gY29kZSBpcyBwcmVzZW50IChjYXRhc3Ryb3BoaWNcbiAgICAvLyBpbGxuZXNzIHJvd3MgZnJvbSBJSEtFMzIwOSBjYXJyeSB0aGUgQ2hpbmVzZSBuYXJyYXRpdmUgb25seSkuIE1pcnJvcnNcbiAgICAvLyB0aGUgc2FtZSBgY29kZSB8fCBkaXNwbGF5YCBwYXR0ZXJuIGluIGRpYWdub3N0aWMtcmVwb3J0LnRzIGFuZFxuICAgIC8vIGFsbGVyZ3kudHMgXHUyMDE0IGF2b2lkcyBoYXNoIGNvbGxpc2lvbnMgYmV0d2VlbiB0d28gc2FtZS1kYXkgY29kZS1sZXNzXG4gICAgLy8gY29uZGl0aW9ucy5cbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5vbnNldF9kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNsaW5pY2FsU3RhdHVzOiB7XG4gICAgICBjb2Rpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jbGluaWNhbFwiLFxuICAgICAgICAgIGNvZGU6IHJhdy5jbGluaWNhbF9zdGF0dXMgPz8gXCJhY3RpdmVcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB2ZXJpZmljYXRpb25TdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLXZlci1zdGF0dXNcIixcbiAgICAgICAgICBjb2RlOiBcImNvbmZpcm1lZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9O1xuXG4gIC8vIENhdGVnb3J5IHJvdXRlcyB0aGUgQ29uZGl0aW9uIGludG8gdGhlIHJpZ2h0IGRvd25zdHJlYW0gdmlldy5cbiAgLy8gLSBcInByb2JsZW0tbGlzdC1pdGVtXCIgXHUyMTkyIFNNQVJUIC8gSVBTIFByb2JsZW0gTGlzdCBzZWN0aW9uXG4gIC8vIC0gXCJlbmNvdW50ZXItZGlhZ25vc2lzXCIgXHUyMTkyIHBlci1lbmNvdW50ZXIgZGlhZ25vc2VzXG4gIC8vIC0gXCJoZWFsdGgtY29uY2VyblwiIFx1MjE5MiBJUFMgSGVhbHRoIENvbmNlcm5zXG4gIC8vIEFkYXB0ZXItbGV2ZWwgZGVjaXNpb246IFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSByb3dzIG1hcmsgY2F0ZWdvcnk9XCJwcm9ibGVtLWxpc3QtaXRlbVwiO1xuICAvLyBnZW5lcmljIGVuY291bnRlci1kZXJpdmVkIGNvbmRpdGlvbnMgY2FuIG9taXQsIGRlZmF1bHRpbmcgdG8gbm9cbiAgLy8gZXhwbGljaXQgY2F0ZWdvcnkgKFNNQVJUIGFwcHMgZmFsbCB0aHJvdWdoIHRvIGFsbC1jb25kaXRpb25zIHZpZXcpLlxuICBpZiAocmF3LmNhdGVnb3J5KSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL2NvbmRpdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogcmF3LmNhdGVnb3J5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICByZXNvdXJjZS5jb2RlID0ge1xuICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgdGV4dDogZGlzcGxheSxcbiAgfTtcblxuICBjb25zdCBzZXZlcml0eSA9IHJhdy5zZXZlcml0eSA/PyBcIlwiO1xuICBpZiAoc2V2ZXJpdHkpIHtcbiAgICByZXNvdXJjZS5zZXZlcml0eSA9IHsgdGV4dDogc2V2ZXJpdHkgfTtcbiAgfVxuXG4gIGlmIChyYXcub25zZXRfZGF0ZSkge1xuICAgIHJlc291cmNlLm9uc2V0RGF0ZVRpbWUgPSBgJHtyYXcub25zZXRfZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChyYXcucmVjb3JkZWRfZGF0ZSkge1xuICAgIHJlc291cmNlLnJlY29yZGVkRGF0ZSA9IGAke3Jhdy5yZWNvcmRlZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBEaWFnbm9zdGljUmVwb3J0IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZGlhZ25vc3RpY19yZXBvcnQucHlgLiBSZXR1cm5zIG51bGwgZm9yXG4gKiBsaXN0LXBhZ2Ugcm93cyBsYWNraW5nIGEgY29uY2x1c2lvbiwgYW5kIGZvciBsYWItdmFsdWUtb25seSBcInJlcG9ydHNcIlxuICogdGhhdCB3b3VsZCBkdXBsaWNhdGUgYSBwcm9wZXIgT2JzZXJ2YXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgVjJfMDA3NCA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92Mi0wMDc0XCI7XG5cbmNvbnN0IENBVEVHT1JZX01BUDogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgTEFCOiBbVjJfMDA3NCwgXCJMQUJcIiwgXCJMYWJvcmF0b3J5XCJdLFxuICBSQUQ6IFtWMl8wMDc0LCBcIlJBRFwiLCBcIlJhZGlvbG9neVwiXSxcbiAgQ0FSOiBbVjJfMDA3NCwgXCJDQVJcIiwgXCJDYXJkaW9sb2d5XCJdLFxuICBQQVRIOiBbVjJfMDA3NCwgXCJQQVRcIiwgXCJQYXRob2xvZ3lcIl0sXG59O1xuXG4vLyBMYWItcmVzdWx0IHBhdHRlcm5zIHRoYXQgbG9vayBsaWtlIHNpbmdsZS12YWx1ZSBsYWIgcmVhZGluZ3MgcmF0aGVyXG4vLyB0aGFuIGEgbmFycmF0aXZlIHJlcG9ydC5cbmNvbnN0IExBQl9VTklUX1JFID1cbiAgL1xcZCsoPzpcXC5cXGQrKT9cXHMqKD86JXxtZ1xcL2RMfGdcXC9kTHxtbW9sXFwvTHxVXFwvTHxJVVxcL0x8bUlVXFwvTHxuZ1xcL21MfFx1MDNCQ2dcXC9kTHx1Z1xcL2RMfHBnXFwvbUx8Zkx8XFwvdUx8MTBcXF4/XFxkK1xcL3VMfHgxMFxcXj9cXGQrXFwvdUx8c2VjfFx1NzlEMnxjb3BpZXNcXC9tTCkvO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIHRydWU7XG4gIGNvbnN0IHRleHQgPSBjb25jbHVzaW9uLnRyaW0oKTtcbiAgLy8gUmVhbCBuYXJyYXRpdmUgcmVwb3J0cyBhbG1vc3QgYWx3YXlzIGNvbnRhaW4gbXVsdGlwbGUgc2VudGVuY2VzLlxuICBpZiAodGV4dC5sZW5ndGggPiAxMDApIHJldHVybiBmYWxzZTtcbiAgLy8gU2luZ2xlIHZhbHVlIHBhdHRlcm4gKyBwYXJlbnRoZXRpY2FsIHJlZmVyZW5jZSByYW5nZSA9IGxhYiBsaW5lLlxuICBpZiAoTEFCX1VOSVRfUkUudGVzdCh0ZXh0KSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcERpYWdub3N0aWNSZXBvcnQoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoKHJhdy5jb25jbHVzaW9uID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWNvbmNsdXNpb24pIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGNhdEtleVJhdyA9IFN0cmluZyhyYXcuY2F0ZWdvcnkgPz8gXCJcIikudG9VcHBlckNhc2UoKTtcbiAgaWYgKGNhdEtleVJhdyA9PT0gXCJMQUJcIiAmJiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUmVwb3J0XCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtSGludCA9IHJhdy5zeXN0ZW0gPz8gXCJcIjtcbiAgY29uc3Qgc3lzdGVtID1cbiAgICB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiAmJiBzeXN0ZW1IaW50LnRvVXBwZXJDYXNlKCkgPT09IFwiTE9JTkNcIlxuICAgICAgPyBzeXN0ZW1zLkxPSU5DXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1JFUE9SVF9DT0RFO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcuZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiByYXcuc3RhdHVzID8/IFwiZmluYWxcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gICAgY29uY2x1c2lvbixcbiAgfTtcblxuICBjb25zdCBjYXRFbnRyeSA9IENBVEVHT1JZX01BUFtjYXRLZXlSYXddO1xuICBpZiAoY2F0RW50cnkpIHtcbiAgICBjb25zdCBbY2F0U3lzLCBjYXRDb2RlLCBjYXREaXNwbGF5XSA9IGNhdEVudHJ5O1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW3sgY29kaW5nOiBbeyBzeXN0ZW06IGNhdFN5cywgY29kZTogY2F0Q29kZSwgZGlzcGxheTogY2F0RGlzcGxheSB9XSB9XTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAocmF3Lmlzc3VlZCkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5pc3N1ZWR9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfSBlbHNlIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIEVuY291bnRlciBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2VuY291bnRlci5weWAuIFN0YWJsZSBJRCBpbmNsdWRlcyBob3NwaXRhbFxuICogc28gc2FtZS1kYXkgdmlzaXRzIHRvIGRpZmZlcmVudCBpbnN0aXR1dGlvbnMgZWFjaCBnZXQgdGhlaXIgb3duXG4gKiBFbmNvdW50ZXIgKHRoZSBwb3N0LW1hcHBpbmcgbGlua2VyIGRlcGVuZHMgb24gdGhpcykuXG4gKi9cblxuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IEFDVENPREVfU1lTVEVNID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YzLUFjdENvZGVcIjtcblxuY29uc3QgQ0xBU1NfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBBTUI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJBTUJcIiwgXCJhbWJ1bGF0b3J5XCJdLFxuICBJTVA6IFtBQ1RDT0RFX1NZU1RFTSwgXCJJTVBcIiwgXCJpbnBhdGllbnQgZW5jb3VudGVyXCJdLFxuICBFTUVSOiBbQUNUQ09ERV9TWVNURU0sIFwiRU1FUlwiLCBcImVtZXJnZW5jeVwiXSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBFbmNvdW50ZXIocmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCBlbmNDbGFzcyA9IFN0cmluZyhyYXcuY2xhc3MgPz8gXCJBTUJcIikudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2xhc3NFbnRyeSA9IENMQVNTX01BUFtlbmNDbGFzc10gPz8gQ0xBU1NfTUFQLkFNQiE7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkVuY291bnRlclwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIHJhdy5kYXRlID8/IFwiXCIsIGVuY0NsYXNzLCAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKSksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5pc2hlZFwiLFxuICAgIGNsYXNzOiB7XG4gICAgICBzeXN0ZW06IGNsYXNzRW50cnlbMF0sXG4gICAgICBjb2RlOiBjbGFzc0VudHJ5WzFdLFxuICAgICAgZGlzcGxheTogY2xhc3NFbnRyeVsyXSxcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgLy8gTkhJJ3MgZW5jb3VudGVyIFwidHlwZVwiIG1hcmtlcnMgXHUyMDE0ICdJQ1x1NTM2MVx1OENDN1x1NjU5OScgLyAnXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5JyAvICdcdTRGNEZcdTk2NjInXG4gIC8vIFx1MjAxNCBhcmUgZGF0YS1vcmlnaW4gbGFiZWxzLCBub3QgU05PTUVEIGNsaW5pY2FsIHR5cGVzLiBLZWVwIHRoZW0gYXNcbiAgLy8gQ29kZWFibGVDb25jZXB0LnRleHQgd2l0aG91dCBjbGFpbWluZyBTTk9NRUQuXG4gIGNvbnN0IHR5cGVEaXNwbGF5ID0gKChyYXcudHlwZV9kaXNwbGF5ID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAodHlwZURpc3BsYXkpIHtcbiAgICByZXNvdXJjZS50eXBlID0gW3sgdGV4dDogdHlwZURpc3BsYXkgfV07XG4gIH1cblxuICBjb25zdCBwZXJpb2Q6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgaWYgKHJhdy5kYXRlKSBwZXJpb2Quc3RhcnQgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3LmVuZF9kYXRlKSBwZXJpb2QuZW5kID0gYCR7cmF3LmVuZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChPYmplY3Qua2V5cyhwZXJpb2QpLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5wZXJpb2QgPSBwZXJpb2Q7XG4gIH1cblxuICBjb25zdCBkZXBhcnRtZW50ID0gcmF3LmRlcGFydG1lbnQgPz8gXCJcIjtcbiAgY29uc3QgcHJvdmlkZXIgPSByYXcucHJvdmlkZXIgPz8gXCJcIjtcbiAgaWYgKGRlcGFydG1lbnQgfHwgcHJvdmlkZXIpIHtcbiAgICBjb25zdCBwYXJ0aWNpcGFudDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChwcm92aWRlcikgcGFydGljaXBhbnQuaW5kaXZpZHVhbCA9IHsgZGlzcGxheTogcHJvdmlkZXIgfTtcbiAgICByZXNvdXJjZS5wYXJ0aWNpcGFudCA9IE9iamVjdC5rZXlzKHBhcnRpY2lwYW50KS5sZW5ndGggPiAwID8gW3BhcnRpY2lwYW50XSA6IFtdO1xuICAgIGlmIChkZXBhcnRtZW50KSB7XG4gICAgICByZXNvdXJjZS5zZXJ2aWNlVHlwZSA9IHsgdGV4dDogZGVwYXJ0bWVudCB9O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnNlcnZpY2VQcm92aWRlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIGNvbnN0IHJlYXNvbiA9IHJhdy5yZWFzb24gPz8gXCJcIjtcbiAgaWYgKHJlYXNvbikge1xuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbeyB0ZXh0OiByZWFzb24gfV07XG4gIH1cblxuICBjb25zdCBkaXNjaGFyZ2UgPSByYXcuZGlzY2hhcmdlX2Rpc3Bvc2l0aW9uID8/IFwiXCI7XG4gIGlmIChkaXNjaGFyZ2UpIHtcbiAgICByZXNvdXJjZS5ob3NwaXRhbGl6YXRpb24gPSB7IGRpc2NoYXJnZURpc3Bvc2l0aW9uOiB7IHRleHQ6IGRpc2NoYXJnZSB9IH07XG4gIH1cblxuICBjb25zdCBjbGluaWNhbE5vdGUgPSAoKHJhdy5jbGluaWNhbF9ub3RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoY2xpbmljYWxOb3RlKSB7XG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IGNsaW5pY2FsTm90ZSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIE1lZGljYXRpb25SZXF1ZXN0IG1hcHBlciArIGJpbGluZ3VhbCBkZWR1cGxpY2F0aW9uLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9tZWRpY2F0aW9uLnB5YC4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSByZXBvcnRzIHRoZVxuICogU0FNRSBwcmVzY3JpcHRpb24gbXVsdGlwbGUgdGltZXMgKEVuZ2xpc2gtb25seSAvIEVuZytcdTRFMkQgLyBcdTRFMkQrRW5nKS5cbiAqIGBtYXBNZWRpY2F0aW9uc0RlZHVwYCBjb2xsYXBzZXMgdGhlc2UgdG8gb25lIE1lZGljYXRpb25SZXF1ZXN0IHBlclxuICogKGRhdGUsIGNhbm9uaWNhbC1kcnVnLWtleSksIHByZWZlcnJpbmcgdGhlIGZvcm0gd2l0aCBtb3JlIENKSyBjaGFyc1xuICogKGNsaW5pY2lhbnMgcmVhZCBcdTU1NDZcdTU0QzFcdTU0MEQgZmlyc3QpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgbm9ybWFsaXplSWNkMTBDbSB9IGZyb20gXCIuL2NvbmRpdGlvblwiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmZ1bmN0aW9uIGlzQ2prKGNoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gXHU0RTAwIChVKzRFMDApIHRvIFx1OUZGRiAoVSs5RkZGKSBjb3ZlcnMgQ0pLIFVuaWZpZWQgSWRlb2dyYXBocy5cbiAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICByZXR1cm4gY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZjtcbn1cblxuZnVuY3Rpb24gY2prQ2hhcnMoczogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSBpZiAoaXNDamsoY2gpKSBuKys7XG4gIHJldHVybiBuO1xufVxuXG4vKipcbiAqIE1hdGNoIGEgXCJsb25nXCIgRW5nbGlzaCBjaHVuayAoXHUyMjY1NCBjaGFycyBvZiBBLVovMC05L3B1bmN0dWF0aW9uIGNvbW1vblxuICogdG8gZHJ1ZyBuYW1lcykuIEF2b2lkIG1hdGNoaW5nIHNob3J0IHRva2VucyBsaWtlIFwiRFwiIG9yIFwiUE9cIiB0aGF0XG4gKiBhcHBlYXIgaW5zaWRlIENoaW5lc2UgbmFtZXMuXG4gKi9cbmNvbnN0IEVOX0NIVU5LX0cgPSAvW0EtWl1bQS1aMC05LiUvXFwtXCInXFxzXXszLH0vZztcblxuLyoqXG4gKiBSZWR1Y2UgYSBkcnVnLW5hbWUgc3RyaW5nIHRvIGEgc3RhYmxlIGNhbm9uaWNhbCBrZXkuIEV4dHJhY3QgdGhlXG4gKiBsb25nZXN0IEVuZ2xpc2ggZnJhZ21lbnQsIHRoZW4gdHJ1bmNhdGUgYXQgY29tbW9uIHNlcGFyYXRvcnMgc28gYVxuICogbmFtZSB3aXRoIGV4dHJhIHRyYWlsaW5nIG1vZGlmaWVycyBzdGlsbCBjb2xsYXBzZXMgdG8gYnJhbmQrc3RyZW5ndGguXG4gKlxuICogRXhhbXBsZXMgKGFsbCBtYXAgdG8gXCJ0aW1vcHRvbCB4ZSAwLjUlIG9waHRoYWxtaWMgc29sdXRpb25cIik6XG4gKiAgIFwiVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OXCJcbiAqICAgXCJUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT04gKFx1OTc1Mlx1NzczQ1x1OTczMlx1MjAyNilcIlxuICogICBcIlx1OTc1Mlx1NzczQ1x1OTczMlx1MjAyNiAoVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OKVwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxEcnVnS2V5KG5hbWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKG5hbWUgPz8gXCJcIikudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2h1bmtzID0gWy4uLnMubWF0Y2hBbGwoRU5fQ0hVTktfRyldLm1hcCgobSkgPT4gbVswXSk7XG4gIGlmIChjaHVua3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIChuYW1lID8/IFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIGxldCBsb25nZXN0ID0gY2h1bmtzLnJlZHVjZSgoYSwgYikgPT4gKGIubGVuZ3RoID4gYS5sZW5ndGggPyBiIDogYSkpLnRyaW0oKTtcbiAgZm9yIChjb25zdCBzZXAgb2YgW1wiIC0gXCIsIFwiIFx1MjAxMyBcIiwgXCIgLyBcIl0pIHtcbiAgICBpZiAobG9uZ2VzdC5pbmNsdWRlcyhzZXApKSB7XG4gICAgICBsb25nZXN0ID0gbG9uZ2VzdC5zcGxpdChzZXApWzBdITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxvbmdlc3QucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogQmVzdC1lZmZvcnQgYWN0aXZlIHZzIGNvbXBsZXRlZCBkZWNpc2lvbiBmb3IgYSBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqIEFjdGl2ZSB3aGlsZSAoYXV0aG9yZWRfZGF0ZSArIGR1cmF0aW9uID4gdG9kYXkpOyBvdGhlcndpc2UgY29tcGxldGVkLlxuICogTWlzc2luZyBkdXJhdGlvbiBcdTIxOTIgYXNzdW1lIDkwLWRheSByZWZpbGwgd2luZG93IChOSEkncyB0eXBpY2FsIGNhZGVuY2UpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVkU3RhdHVzKFxuICBhdXRob3JlZElzbzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgZHVyYXRpb25EYXlzOiBhbnksXG4pOiBcImFjdGl2ZVwiIHwgXCJjb21wbGV0ZWRcIiB7XG4gIGlmICghYXV0aG9yZWRJc28pIHJldHVybiBcImNvbXBsZXRlZFwiO1xuICBjb25zdCBkYXRlUGFydCA9IFN0cmluZyhhdXRob3JlZElzbykuc2xpY2UoMCwgMTApO1xuICBjb25zdCBwYXJzZWQgPSBuZXcgRGF0ZShgJHtkYXRlUGFydH1UMDA6MDA6MDBaYCk7XG4gIGlmIChOdW1iZXIuaXNOYU4ocGFyc2VkLmdldFRpbWUoKSkpIHJldHVybiBcImNvbXBsZXRlZFwiO1xuXG4gIGxldCBkYXlzOiBudW1iZXIgfCBudWxsO1xuICBpZiAoZHVyYXRpb25EYXlzID09PSBudWxsIHx8IGR1cmF0aW9uRGF5cyA9PT0gdW5kZWZpbmVkIHx8IGR1cmF0aW9uRGF5cyA9PT0gXCJcIikge1xuICAgIGRheXMgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG4gPSBOdW1iZXIucGFyc2VJbnQoU3RyaW5nKGR1cmF0aW9uRGF5cyksIDEwKTtcbiAgICBkYXlzID0gTnVtYmVyLmlzRmluaXRlKG4pID8gbiA6IG51bGw7XG4gIH1cbiAgaWYgKGRheXMgPT09IG51bGwpIGRheXMgPSA5MDtcblxuICBjb25zdCBlbmQgPSBuZXcgRGF0ZShwYXJzZWQuZ2V0VGltZSgpKTtcbiAgZW5kLnNldFVUQ0RhdGUoZW5kLmdldFVUQ0RhdGUoKSArIGRheXMpO1xuICAvLyBDb21wYXJlIGRhdGUtb25seSAodG9kYXkgaW4gVVRDIHNpbmNlIHdlIGF1dGhvcmVkSXNvIGlzIGRhdGUtb25seSkuXG4gIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgdG9kYXkuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBlbmQgPj0gdG9kYXkgPyBcImFjdGl2ZVwiIDogXCJjb21wbGV0ZWRcIjtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IG9uZSBzY3JhcGVkIHByZXNjcmlwdGlvbiBkaWN0IFx1MjE5MiBGSElSIFI0IE1lZGljYXRpb25SZXF1ZXN0LlxuICogUmV0dXJucyBudWxsIHdoZW4gcmF3IGhhcyBubyBgZHJ1Z19uYW1lYCAoY2FsbGVyIGZpbHRlcnMgb3V0KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25SZXF1ZXN0KFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkcnVnTmFtZSA9ICgocmF3LmRydWdfbmFtZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKCFkcnVnTmFtZSkgcmV0dXJuIG51bGw7XG5cbiAgLy8gQ2Fub25pY2FsIGtleSAobm90IHJhdyBkcnVnX25hbWUpIGZvciBzdGFibGUgaWQgc28gdGhlIHRocmVlIE5ISVxuICAvLyBcdTRFMkRcdTgyRjEgdmFyaWFudHMgb2YgdGhlIHNhbWUgZHJ1ZyBjb2xsYXBzZSB0byBvbmUgRkhJUiByZXNvdXJjZS5cbiAgY29uc3QgbWVkSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNhbm9uaWNhbERydWdLZXkoZHJ1Z05hbWUpLCByYXcuZGF0ZSA/PyBcIlwiKTtcblxuICBjb25zdCBkcnVnQ29kZSA9ICgocmF3LmNvZGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGNvZGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBzeXN0ZW06IGRydWdDb2RlID8gc3lzdGVtcy5OSElfRFJVR19DT0RFIDogc3lzdGVtcy5ISVNfTE9DQUxfTUVESUNBVElPTl9DT0RFLFxuICAgIGNvZGU6IGRydWdDb2RlIHx8IGRydWdOYW1lLFxuICAgIGRpc3BsYXk6IGRydWdOYW1lLFxuICB9O1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJNZWRpY2F0aW9uUmVxdWVzdFwiLFxuICAgIGlkOiBtZWRJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBtZWRTdGF0dXMocmF3LmRhdGUgPz8gXCJcIiwgcmF3LmR1cmF0aW9uX2RheXMpLFxuICAgIGludGVudDogXCJvcmRlclwiLFxuICAgIG1lZGljYXRpb25Db2RlYWJsZUNvbmNlcHQ6IHtcbiAgICAgIGNvZGluZzogW2NvZGluZ10sXG4gICAgICB0ZXh0OiBkcnVnTmFtZSxcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuYXV0aG9yZWRPbiA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBjb25zdCBkcnVnQ2xhc3MgPSAoKHJhdy5kcnVnX2NsYXNzID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoZHJ1Z0NsYXNzKSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbeyB0ZXh0OiBkcnVnQ2xhc3MgfV07XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5yZXF1ZXN0ZXIgPSB7IGRpc3BsYXk6IGhvc3BpdGFsIH07XG4gIH1cblxuICAvLyBEb3NhZ2UgXHUyMDE0IG9ubHkgd2hlbiBzb3VyY2UgYWN0dWFsbHkgaGFzIGl0LiBOSEkncyBtZWRpY2F0aW9uLWxpc3RcbiAgLy8gZW5kcG9pbnQgcHJvdmlkZXMgbm9uZSBvZiB0aGVzZTsgb3RoZXIgSElTIGFkYXB0ZXJzIGdldCBhXG4gIC8vIHN0cnVjdHVyZWQgZG9zYWdlIG91dC5cbiAgY29uc3QgZG9zYWdlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGsgb2YgW1wiZG9zZVwiLCBcInVuaXRcIiwgXCJmcmVxdWVuY3lcIl0gYXMgY29uc3QpIHtcbiAgICBpZiAocmF3W2tdKSBwYXJ0cy5wdXNoKFN0cmluZyhyYXdba10pKTtcbiAgfVxuICBpZiAocGFydHMubGVuZ3RoID4gMCkge1xuICAgIGRvc2FnZS50ZXh0ID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cbiAgaWYgKHJhdy5yb3V0ZSkge1xuICAgIGRvc2FnZS5yb3V0ZSA9IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9zbm9tZWQuaW5mby9zY3RcIiwgZGlzcGxheTogcmF3LnJvdXRlIH1dLFxuICAgIH07XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKGRvc2FnZSkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRvc2FnZUluc3RydWN0aW9uID0gW2Rvc2FnZV07XG4gIH1cblxuICAvLyBkaXNwZW5zZVJlcXVlc3Qgd2l0aCBxdWFudGl0eSArIHN1cHBseSBkdXJhdGlvbiB3aGVuIHByZXNlbnQuXG4gIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHF0eVJhdyA9IHJhdy5xdWFudGl0eTtcbiAgaWYgKHF0eVJhdyAhPT0gbnVsbCAmJiBxdHlSYXcgIT09IHVuZGVmaW5lZCAmJiBxdHlSYXcgIT09IFwiXCIpIHtcbiAgICBjb25zdCBxdHlOdW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcocXR5UmF3KS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHF0eU51bSkpIHtcbiAgICAgIGRyLnF1YW50aXR5ID0geyB2YWx1ZTogcXR5TnVtIH07XG4gICAgfVxuICB9XG4gIGlmIChyYXcuZHVyYXRpb25fZGF5cykge1xuICAgIGNvbnN0IGRheXMgPSBOdW1iZXIucGFyc2VJbnQoU3RyaW5nKHJhdy5kdXJhdGlvbl9kYXlzKSwgMTApO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoZGF5cykpIHtcbiAgICAgIGRyLmV4cGVjdGVkU3VwcGx5RHVyYXRpb24gPSB7XG4gICAgICAgIHZhbHVlOiBkYXlzLFxuICAgICAgICB1bml0OiBcImRheXNcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogXCJkXCIsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICAvLyBJbnBhdGllbnQgZHJ1Z3M6IE5ISSBidW5kbGVzIGV2ZXJ5IGRydWcgdXNlZCBkdXJpbmcgYW4gYWRtaXNzaW9uIGludG9cbiAgLy8gb25lIHJvdyBkYXRlZCB0byB0aGUgYWRtaXNzaW9uIGRheS4gYXV0aG9yZWRPbiBjYXJyaWVzIHRoYXQgYW5jaG9yO1xuICAvLyB2YWxpZGl0eVBlcmlvZCBleHByZXNzZXMgdGhlIGFjdHVhbCB1c2FnZSB3aW5kb3cgW2FkbWl0LCBkaXNjaGFyZ2VdXG4gIC8vIHNvIFNNQVJUIGFwcHMgZGlzcGxheSBcInVzZWQgZHVyaW5nIHN0YXkgNS8xOC01LzIyXCIgaW5zdGVhZCBvZlxuICAvLyBcImFsbCAxNCBkcnVncyBwcmVzY3JpYmVkIG9uIDUvMThcIi4gT1BEIC8gXHU4NUU1XHU1QzQwIHJvd3MgbGVhdmUgZW5kX2RhdGVcbiAgLy8gZW1wdHkgc28gdGhpcyBibG9jayBkb2Vzbid0IGZpcmUgXHUyMDE0IHNpbmdsZS1kYXkgcHJlc2NyaXB0aW9ucyByZW1haW5cbiAgLy8gdW5jaGFuZ2VkLiBUaGUgTWVkaWNhdGlvblJlcXVlc3QuZGlzcGVuc2VSZXF1ZXN0LnZhbGlkaXR5UGVyaW9kIGZpZWxkXG4gIC8vIGlzIGEgc2VtYW50aWMgc3RyZXRjaCAoaXRzIHN0cmljdCBkZWZpbml0aW9uIGlzIHRoZSBwcmVzY3JpcHRpb24nc1xuICAvLyBzdGFsZS1kYXRpbmcgd2luZG93KSBidXQgaXMgdGhlIGNsb3Nlc3QgZXhpc3RpbmcgZmllbGQ7IHdlIGRvbid0XG4gIC8vIGVtaXQgTWVkaWNhdGlvbkFkbWluaXN0cmF0aW9uIHJlc291cmNlcy5cbiAgY29uc3QgZW5kRGF0ZSA9ICgocmF3LmVuZF9kYXRlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAocmF3LmRhdGUgJiYgZW5kRGF0ZSAmJiBlbmREYXRlICE9PSByYXcuZGF0ZSkge1xuICAgIGRyLnZhbGlkaXR5UGVyaW9kID0ge1xuICAgICAgc3RhcnQ6IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGAsXG4gICAgICBlbmQ6IGAke2VuZERhdGV9VDIzOjU5OjU5KzA4OjAwYCxcbiAgICB9O1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhkcikubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRpc3BlbnNlUmVxdWVzdCA9IGRyO1xuICB9XG5cbiAgY29uc3QgaW5kaWNhdGlvbiA9ICgocmF3LmluZGljYXRpb24gPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGluZGljYXRpb25Db2RlID0gKChyYXcuaW5kaWNhdGlvbl9jb2RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaW5kaWNhdGlvbiB8fCBpbmRpY2F0aW9uQ29kZSkge1xuICAgIGNvbnN0IHJjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgaWYgKGluZGljYXRpb25Db2RlKSB7XG4gICAgICByYy5jb2RpbmcgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IHN5c3RlbXMuSUNEXzEwX0NNLFxuICAgICAgICAgIGNvZGU6IG5vcm1hbGl6ZUljZDEwQ20oaW5kaWNhdGlvbkNvZGUpLFxuICAgICAgICAgIGRpc3BsYXk6IGluZGljYXRpb24gfHwgaW5kaWNhdGlvbkNvZGUsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgICBpZiAoaW5kaWNhdGlvbikge1xuICAgICAgcmMudGV4dCA9IGluZGljYXRpb25Db2RlID8gYCR7aW5kaWNhdGlvbkNvZGV9ICR7aW5kaWNhdGlvbn1gLnRyaW0oKSA6IGluZGljYXRpb247XG4gICAgfVxuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbcmNdO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIEdyb3VwLWF3YXJlIG1lZGljYXRpb24gbWFwcGVyIHRoYXQgZGVkdXBlcyBcdTRFMkRcdTgyRjEgXHU5NkQ5XHU4QTlFIGR1cGxpY2F0ZXMuXG4gKlxuICogU3RyYXRlZ3k6XG4gKiAgIDEuIENvbXB1dGUgY2Fub25pY2FsIGtleSBwZXIgZHJ1ZyBuYW1lIChsb25nZXN0IEVuZ2xpc2ggY2h1bmspLlxuICogICAyLiBHcm91cCBieSAoZGF0ZSwgY2Fub25pY2FsX2tleSkuIEtlZXAgT05FIGVudHJ5IHBlciBncm91cCxcbiAqICAgICAgcHJlZmVycmluZyB0aGUgZm9ybSB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGJyYW5kXG4gKiAgICAgIG5hbWUgXHUyMDE0IGNsaW5pY2lhbnMgc2NhbiBFbmdsaXNoIGZpcnN0KS5cbiAqICAgMy4gTWFwIGVhY2gga2VwdCBlbnRyeSB0aHJvdWdoIG1hcE1lZGljYXRpb25SZXF1ZXN0LlxuICpcbiAqIE5vdGU6IFB5dGhvbiBjb21tZW50IHNheXMgXCJtb3JlIENKS1wiIGJ1dCB0aGUgY29kZSB1c2VzIGA8YCAoZmV3ZXIpO1xuICogd2UgcHJlc2VydmUgdGhlIGFjdHVhbCBjb2RlIGJlaGF2aW91ciB0byBrZWVwIHBhcml0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25zRGVkdXAocmF3SXRlbXM6IGFueVtdLCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGJ5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIGFueT4+KCk7XG4gIGZvciAoY29uc3QgaXRlbSBvZiByYXdJdGVtcykge1xuICAgIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgY29udGludWU7XG4gICAgY29uc3QgZHJ1Z05hbWUgPSAoKGl0ZW0uZHJ1Z19uYW1lID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICAgIGlmICghZHJ1Z05hbWUpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRhdGVQYXJ0ID0gKChpdGVtLmRhdGUgPz8gXCJcIikgYXMgc3RyaW5nKS5zbGljZSgwLCAxMCk7XG4gICAgY29uc3Qga2V5ID0gYCR7ZGF0ZVBhcnR9fCR7Y2Fub25pY2FsRHJ1Z0tleShkcnVnTmFtZSl9YDtcbiAgICBjb25zdCBleGlzdGluZyA9IGJ5S2V5LmdldChrZXkpO1xuICAgIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUHJlZmVyIHRoZSBmb3JtIHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggYnJhbmQgbmFtZSkuXG4gICAgICBpZiAoY2prQ2hhcnMoZHJ1Z05hbWUpIDwgY2prQ2hhcnMoZXhpc3RpbmcuZHJ1Z19uYW1lID8/IFwiXCIpKSB7XG4gICAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBieUtleS52YWx1ZXMoKSkge1xuICAgIGNvbnN0IG0gPSBtYXBNZWRpY2F0aW9uUmVxdWVzdChpdGVtLCBwYXRpZW50SWQpO1xuICAgIGlmIChtICE9PSBudWxsKSBvdXQucHVzaChtKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwgIi8qKlxuICogTE9JTkMgbWFwcGluZyB0YWJsZXMgZm9yIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIExPSU5DIFI0IGNvZGluZ3MuXG4gKlxuICogUHVyZSBkYXRhLCBubyBsb2dpYy4gUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL19sb2luY190YWJsZXMucHlgLlxuICovXG5cbi8vIFx1MjUwMFx1MjUwMCBfTkhJX1RPX0xPSU5DIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTkhJIFx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyBcdTIxOTIgcHJpbWFyeSBMT0lOQyBtYXBwaW5nLiBTb3VyY2Ugb2YgdHJ1dGg6XG4vLyBUV05ISUZISVIgUEFTIEltcGxlbWVudGF0aW9uIEd1aWRlIENvbmNlcHRNYXAtbmhpLWxvaW5jXG4vLyBodHRwczovL2J1aWxkLmZoaXIub3JnL2lnL1RXTkhJRkhJUi9wYXMvQ29uY2VwdE1hcC1uaGktbG9pbmMuaHRtbFxuLy9cbi8vIFRoYXQgQ29uY2VwdE1hcCBkZWNsYXJlcyA1MyBOSEkgY29kZXMgd2l0aCBgZXF1aXZhbGVuY2U6IHJlbGF0ZWR0b2Bcbi8vIGFnYWluc3QgODA2IExPSU5DIHZhcmlhbnRzIChkaWZmZXJlbnQgc3BlY2ltZW5zIC8gdW5pdHMgLyBtZXRob2RzXG4vLyBwZXIgTkhJIGNvZGUgXHUyMDE0IGNvbmZpcm1pbmcgdGhlIFwiTkhJIGlzIGNvYXJzZSwgTE9JTkMgaXMgZmluZVwiIHZpZXcpLlxuLy8gRm9yIGVhY2ggTkhJIGNvZGUgd2UgaGFuZC1waWNrIHRoZSBjYW5vbmljYWwgTE9JTkMgbW9zdCBjbGluaWNpYW5zXG4vLyB3b3VsZCBleHBlY3QgaW4gYSBcdTUwNjVcdTRGRERcdTVCNThcdTY0N0EgbGFiIHJlcG9ydDogU2VydW0vUGxhc21hICsgTWFzcy12b2x1bWVcbi8vIChvciBhdXRvLWNvdW50IGZvciBjZWxsIGNvdW50ZXJzKS4gRWRnZSBjYXNlcyBub3RlZCBpbmxpbmUuXG5leHBvcnQgY29uc3QgTkhJX1RPX0xPSU5DOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgSGFlbWF0b2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDgwMDJDXCI6IFwiNjY5MC0yXCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1OEEwOFx1NjU3OCBcdTIwMTQgTGV1a29jeXRlcyAjL3ZvbCBCbG9vZCBBdXRvXG4gIFwiMDgwMDNDXCI6IFwiNzE4LTdcIiwgLy8gXHU4ODQwXHU4MjcyXHU3RDIwXHU2QUEyXHU2N0U1IFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIEJsb29kXG4gIFwiMDgwMDZDXCI6IFwiNzc3LTNcIiwgLy8gXHU4ODQwXHU1QzBGXHU2NzdGXHU4QTA4XHU2NTc4IFx1MjAxNCBQbGF0ZWxldHMgIy92b2wgQmxvb2QgQXV0b1xuICBcIjA4MDEzQ1wiOiBcIjU3MDIxLThcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU1MjA2XHU5ODVFXHU4QTA4XHU2NTc4IFx1MjAxNCBDQkMgVyBBdXRvIERpZmYgcGFuZWxcbiAgXCIwODEyOEJcIjogXCI0NzI4Ni0wXCIsIC8vIFx1OUFBOFx1OUFEM1x1N0QzMFx1ODBERVx1NUY2Mlx1NjE0Qlx1NTIyNFx1OEI4MFx1NTQwOFx1NEY3NVx1N0QzMFx1ODBERVx1NTIwNlx1OTg1RVx1OEEwOFx1NjU3OFxuICAvLyBcdTI1MDBcdTI1MDAgQ2hlbWlzdHJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDExQ1wiOiBcIjE3ODYxLTZcIiwgLy8gXHU5MjIzIFx1MjAxNCBDYWxjaXVtIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDE1Q1wiOiBcIjIxNjAtMFwiLCAvLyBcdTgwOENcdTkxNzhcdTkxNTBcdTMwMDFcdTg4NDAgXHUyMDE0IENyZWF0aW5pbmUgTWFzcy92b2wgUy9QXG4gIFwiMDkwMTZDXCI6IFwiMjE2MS04XCIsIC8vIFx1ODA4Q1x1OTE1MFx1MzAwMVx1NUMzRiBcdTIwMTQgQ3JlYXRpbmluZSBNYXNzL3ZvbCBVcmluZVxuICBcIjA5MDI1Q1wiOiBcIjE5MjAtOFwiLCAvLyBBU1QvR09UIFx1MjAxNCBBc3BhcnRhdGUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjZDXCI6IFwiMTc0Mi02XCIsIC8vIEFMVC9HUFQgXHUyMDE0IEFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBBY3QgUy9QXG4gIFwiMDkwMjlDXCI6IFwiMTk3NS0yXCIsIC8vIFx1ODFCRFx1N0QwNVx1N0QyMFx1N0UzRFx1OTFDRiBcdTIwMTQgQmlsaXJ1YmluIHRvdGFsIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDMwQ1wiOiBcIjE5NjgtN1wiLCAvLyBcdTc2RjRcdTYzQTVcdTgxQkRcdTdEMDVcdTdEMjAgXHUyMDE0IEJpbGlydWJpbiBkaXJlY3QgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzNDXCI6IFwiMjUzMi0wXCIsIC8vIFx1NEU3M1x1OTE3OFx1ODEyQlx1NkMyQlx1ODEyMiBcdTIwMTQgTERIIEFjdGl2aXR5IFMvUFxuICBcIjA5MDM4Q1wiOiBcIjE3NTEtN1wiLCAvLyBcdTc2N0RcdTg2Q0JcdTc2N0QgXHUyMDE0IEFsYnVtaW4gTWFzcy92b2wgUy9QXG4gIFwiMDkxMzhDXCI6IFwiMzU2NzItNVwiLCAvLyBcdTc2RjRcdTYzQTUvXHU3RTNEXHU4MUJEXHU3RDA1XHU3RDIwXHU2QkQ0XHU1MDNDXG4gIFwiMTIxMTJCXCI6IFwiMTc1MS03XCIsIC8vIFx1NzY3RFx1ODZDQlx1NzY3RChcdTUxNERcdTc1QUJcdTZCRDRcdTZGQzFcdTZDRDUpIFx1MjAxNCBBbGJ1bWluIE1hc3Mvdm9sIFMvUFxuICBcIjI0MDA3QlwiOiBcIjE5OTUtMFwiLCAvLyBcdTg4NDBcdTZGM0ZcdTZFMzhcdTk2RTJcdTkyMjMgXHUyMDE0IENhbGNpdW0gaW9uaXplZCBNb2xlcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBIb3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyMUNcIjogXCIyOTg2LThcIiwgLy8gXHU3NzZBXHU0RTM4XHU5MTZGXHU5MTg3XHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBUZXN0b3N0ZXJvbmUgTWFzcy92b2wgUy9QXG4gIFwiMjcwMjFCXCI6IFwiMjk5MS04XCIsIC8vIFx1Nzc2QVx1NEUzOFx1ODEwMlx1OTE4N1x1NjUzRVx1NUMwNFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgVGVzdG9zdGVyb25lIEZyZWUgUy9QXG4gIC8vIDA5MTI1QyAvIDA5MTI3QyBjb3JyZWN0ZWQgYWZ0ZXIgZHVhbC1yZXZpZXdlciBhdWRpdCBcdTIwMTQgdGhlIGVhcmxpZXJcbiAgLy8gdmFsdWVzICgzMDE2LTMgd2FzIFRTSCwgMTA1MDEtNSB3YXMgTEgpIHdlcmUganVzdCB3cm9uZyBjb3B5LVxuICAvLyBwYXN0ZXMuIFNvdXJjZSBmb3IgdGhlIG5ldyB2YWx1ZXM6IFRXTkhJRkhJUiBQQVMgQ29uY2VwdE1hcC5cbiAgXCIwOTEyNUNcIjogXCI4MzA5OC00XCIsIC8vIFx1NkZGRVx1NkNFMVx1NTIzQVx1NkZDMFx1N0QyMFx1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgRm9sbGl0cm9waW4gKEZTSCkgSW1tdW5vYXNzYXkgUy9QXG4gIFwiMDkxMjdDXCI6IFwiODMwOTYtOFwiLCAvLyBcdTRFOENcdTZDMkJcdTU3RkFcdTY2MjVcdTYwQzVcdTdEMjBcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IEVzdHJhZGlvbCBJbW11bm9hc3NheSBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFR1bW9yIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDdDXCI6IFwiMTgzNC0xXCIsIC8vIFx1MDNCMS1cdTgwQ0VcdTUxNTJcdTg2Q0JcdTc2N0QgKEFGUCkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDQ5Q1wiOiBcIjE4MzQtMVwiLCAvLyBcdTc1MzItXHU4MENFXHU1MTUyXHU4NkNCXHU3NjdEIChBRlAsIFJJQSlcbiAgXCIxMjA4MUNcIjogXCI4MzExMi0zXCIsIC8vIFBTQSAoRUlBL0xJQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjEyMTk4Q1wiOiBcIjgzMTEzLTFcIiwgLy8gRnJlZSBQU0EgXHUyMDE0IE1hc3Mvdm9sIFMvUCBJbW11bm9hc3NheVxuICBcIjI3MDUyQ1wiOiBcIjI4NTctMVwiLCAvLyBcdTY1MURcdThCNzdcdTgxN0FcdTcyNzlcdTc1NzBcdTYyOTdcdTUzOUYgKFBTQSkgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjI3MDgzQlwiOiBcIjEwODg2LTBcIiwgLy8gXHU2RTM4XHU5NkUyUFNBIChSSUEpXG4gIC8vIDEyMDUyQiBcdTAzQjIyLVx1NUZBRVx1NzQwM1x1ODZDQlx1NzY3RCBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gMTA4NzMtOCB3aGljaCBpcyBhY3R1YWxseVxuICAvLyAnQmV0YS0yLU1pY3JvZ2xvYnVsaW4gW01hc3MvdGltZV0gaW4gMjQgaG91ciBVcmluZScgKHRpbWVkIHVyaW5lXG4gIC8vIGNvbGxlY3Rpb24sIHZlcmlmaWVkIGxvaW5jLm9yZy8xMDg3My04LykuIFRhaXdhbiAxMjA1MkIgYmlsbGluZyBpc1xuICAvLyB0eXBpY2FsbHkgYSBzZXJ1bSBvcmRlcjsgMTk1Mi0xIGlzIHRoZSB2ZXJpZmllZCBzZXJ1bS1vci1wbGFzbWEgTE9JTkNcbiAgLy8gKENvbXBvbmVudD1CZXRhLTItTWljcm9nbG9idWxpbiwgUHJvcGVydHk9TUNuYykgXHUyMDE0IGxvaW5jLm9yZy8xOTUyLTEvLlxuICBcIjEyMDUyQlwiOiBcIjE5NTItMVwiLCAvLyBcdTAzQjIyLW1pY3JvZ2xvYnVsaW4gXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgSW1tdW5vbG9neSAvIHByb3RlaW5zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDY1QlwiOiBcIjkwOTkxLTFcIiwgLy8gXHU4NkNCXHU3NjdEXHU5NkZCXHU2Q0YzXHU1MjA2XHU2NzkwXG4gIC8vIDEyMDI4QiAvIDEyMDI5QiBJZ00gKHNlcnVtLCBpbW11bm9kaWZmdXNpb24gLyBuZXBoZWxvbWV0cnkpIFx1MjAxNCBwcmV2aW91c2x5XG4gIC8vIGJvdGggbWFwcGVkIHRvIExPSU5DIDE0MDAyLTAgd2hpY2ggaXMgYWN0dWFsbHkgJ0lnTSBbVW5pdHMvdm9sdW1lXSBpblxuICAvLyBDb3JkIGJsb29kJyAobmVvbmF0YWwgc3BlY2ltZW4sIHZlcmlmaWVkIGxvaW5jLm9yZy8xNDAwMi0wLykuIFdyb25nXG4gIC8vIHNwZWNpbWVuIGZvciBhbiBhZHVsdCBzZXJ1bSBvcmRlci4gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0b1xuICAvLyBOSEktY29kZS1vbmx5IGNvZGluZy4gU2VlIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxMjEwM0JcIjogXCI5NTgwMS03XCIsIC8vIFx1NTE0RFx1NzVBQlx1OTZGQlx1NkNGM1x1NTIwNlx1Njc5MFxuICBcIjEyMTYwQlwiOiBcIjE1MTg5LTRcIiwgLy8gSWdHIFx1MDNCQS9cdTAzQkJcbiAgXCIxMjE3MUJcIjogXCIxNzM1MS04XCIsIC8vIFx1NjI5N1x1NTVEQ1x1NEUyRFx1NjAyN1x1NzQwM1x1N0QzMFx1ODBERVx1OENFQVx1NjI5N1x1OUFENCAoQU5DQSlcbiAgXCIxMjIwNEJcIjogXCIyMDU4NC05XCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1ODg2OFx1OTc2Mlx1NkExOVx1OEExOFxuICBcIjI1MDEzQlwiOiBcIjQ0NTk2LTVcIiwgLy8gXHU4N0EyXHU1MTQ5XHU1MjA3XHU3MjQ3XHU2QUEyXHU2N0U1XG4gIC8vIFx1MjUwMFx1MjUwMCBIZXBhdGl0aXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTQwMzBDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzFDXCI6IFwiNTE5NS0zXCIsIC8vIEhCc0FnXG4gIFwiMTQwMzJDXCI6IFwiNTE5Ni0xXCIsIC8vIEhCc0FnIChNYXNzL3ZvbClcbiAgXCIxNDA1MUNcIjogXCIxMzk1NS0wXCIsIC8vIEhDViBBYlxuICBcIjI3MDMzQ1wiOiBcIjUxOTctOVwiLCAvLyBIQnNBZyBSSUFcbiAgLy8gXHUyNTAwXHUyNTAwIFBhdGhvbG9neSAvIGN5dG9sb2d5IC8gSUhDIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMTk1QlwiOiBcIjE4NDc0LTdcIiwgLy8gSGVyLTIvbmV1IElTSFxuICBcIjI3MDYxQlwiOiBcIjE0MTMwLTlcIiwgLy8gXHU1MkQ1XHU2MEM1XHU2RkMwXHU3RDIwXHU2M0E1XHU1M0Q3XHU5QUQ0IChFUilcbiAgXCIyNzA2MkJcIjogXCIxMDg2MS0zXCIsIC8vIFx1OUVDM1x1OUFENFx1NkZDMFx1N0QyMFx1NjNBNVx1NTNEN1x1OUFENCAoUFIpXG4gIFwiMzAxMDNCXCI6IFwiODMwNTItMVwiLCAvLyBQRC1MMSBJSENcbiAgLy8gXHUyNTAwXHUyNTAwIEF1ZGlvbG9neSAvIHB1bG1vbmFyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNzAwOUJcIjogXCIyNDM0MS0wXCIsIC8vIFx1NEUwMFx1NkMyN1x1NTMxNlx1NzhCM1x1ODBCQVx1NzAzMFx1NjU2M1x1OTFDRlxuICBcIjIyMDAxQ1wiOiBcIjQ1NDk4LTNcIiwgLy8gXHU3RDE0XHU5N0YzXHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIFwiMjIwMTVCXCI6IFwiNDU0OTgtM1wiLCAvLyBcdThBNTBcdTgwN0VcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgXCIyMjAyNUJcIjogXCI0NjUzMC0yXCIsIC8vIFx1ODFFQVx1OEExOFx1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gU1VQUExFTUVOVEFMIChub3QgaW4gUEFTIENvbmNlcHRNYXAgXHUyMDE0IGhhbmQtY3VyYXRlZCBmcm9tIGNvbW1vblxuICAvLyBOSEkgY29kZXMgc2VlbiBpbiBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EuIExPSU5DIHZlcmlmaWVkIGFnYWluc3QgbG9pbmMub3JnXG4gIC8vIGNhbm9uaWNhbCBuYW1lcy4gTWV0aG9kLXNwZWNpZmljIGNvZGVzIChlLmcuIGhzLUNSUCkgcGljayB0aGVcbiAgLy8gc3BlY2lmaWMgTE9JTkM7IGdlbmVyYWwtbWV0aG9kIGNvZGVzIHBpY2sgdGhlIG1vc3QgY29tbW9uIGZvcm0uXG4gIC8vIElmIFx1NTA2NVx1NEZERFx1N0Y3MiBwdWJsaXNoZXMgYW4gYXV0aG9yaXRhdGl2ZSBicm9hZGVyIENvbmNlcHRNYXAgbGF0ZXIsXG4gIC8vIHJlcGxhY2UgdGhpcyBzZWN0aW9uIGluIG9uZSBwYXNzLlxuICAvLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgLyBIYkExYyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwNUNcIjogXCIxNTU4LTZcIiwgLy8gXHU3QTdBXHU4MTc5XHU4ODQwXHU3Q0Q2IChHbHUtQUMpIFx1MjAxNCBGYXN0aW5nIGdsdWNvc2UgTWFzcy92b2wgUy9QXG4gIFwiMDkxNDBDXCI6IFwiMjM0NS03XCIsIC8vIFx1ODg0MFx1N0NENi1cdTk5MTBcdTVGOEMvXHU5NkE4XHU2QTVGIFx1MjAxNCBHbHVjb3NlIE1hc3Mvdm9sIFMvUCAoZ2VuZXJhbClcbiAgXCIwOTAwNkNcIjogXCI0NTQ4LTRcIiwgLy8gXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwIChIYkExYykgXHUyMDE0IEhlbW9nbG9iaW4gQTFjL0hnYi50b3RhbCBCbG9vZFxuICAvLyBcdTI1MDBcdTI1MDAgUmVuYWwgLyBlbGVjdHJvbHl0ZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMDJDXCI6IFwiMzA5NC0wXCIsIC8vIEJVTiBcdTIwMTQgVXJlYSBuaXRyb2dlbiBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxM0NcIjogXCIzMDg0LTFcIiwgLy8gVXJpYyBBY2lkIFx1MjAxNCBVcmF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAyMUNcIjogXCIyOTUxLTJcIiwgLy8gTmEgXHUyMDE0IFNvZGl1bSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMjJDXCI6IFwiMjgyMy0zXCIsIC8vIEsgIFx1MjAxNCBQb3Rhc3NpdW0gTW9sZXMvdm9sIFMvUFxuICBcIjA5MDI0Q1wiOiBcIjIwMjgtOVwiLCAvLyBDTzIgXHUyMDE0IENhcmJvbiBkaW94aWRlIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAxMkNcIjogXCIyNzc3LTFcIiwgLy8gSW5vcmdhbmljIFAgXHUyMDE0IFBob3NwaGF0ZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0NkJcIjogXCIxOTEyMy05XCIsIC8vIE1nIFx1MjAxNCBNYWduZXNpdW0gTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXBpZCBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwMUNcIjogXCIyMDkzLTNcIiwgLy8gVC1DaG9sZXN0ZXJvbCBcdTIwMTQgQ2hvbGVzdGVyb2wgTWFzcy92b2wgUy9QXG4gIFwiMDkwMDRDXCI6IFwiMjU3MS04XCIsIC8vIFRHIFx1MjAxNCBUcmlnbHljZXJpZGUgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDNDXCI6IFwiMjA4NS05XCIsIC8vIEhETCBcdTIwMTQgSERMIGNob2xlc3Rlcm9sIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQ0Q1wiOiBcIjEzNDU3LTdcIiwgLy8gTERMIFx1MjAxNCBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIE1hc3Mvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgTGl2ZXIgZnVuY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwMjdDXCI6IFwiNjc2OC02XCIsIC8vIEFMSy1QIFx1MjAxNCBBbGthbGluZSBwaG9zcGhhdGFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzMUNcIjogXCIyMzI0LTJcIiwgLy8gXHUwM0IzLUdUIFx1MjAxNCBHYW1tYSBnbHV0YW15bCB0cmFuc2ZlcmFzZSBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzNUNcIjogXCIyNTAwLTdcIiwgLy8gVElCQyBcdTIwMTQgSXJvbiBiaW5kaW5nIGNhcGFjaXR5IE1hc3Mvdm9sIFMvUFxuICAvLyAwOTAzN0MgXHU4ODQwXHU2QzI4IFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAxODI3LTUgd2hpY2ggaXMgYWN0dWFsbHlcbiAgLy8gJ0FscGhhIDEgYW50aXRyeXBzaW4gTVMgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEnICh2ZXJpZmllZFxuICAvLyBsb2luYy5vcmcvMTgyNy01LykuIFdyb25nIGFuYWx5dGUgZW50aXJlbHkuIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzXG4gIC8vIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuIFNlZSBkb2NzL0xPSU5DX0FVRElUXzIwMjZfMDVfMTkubWQuXG4gIFwiMDkwNjRDXCI6IFwiMzA0MC0zXCIsIC8vIExpcGFzZSBcdTIwMTQgQWN0aXZpdHkgUy9QXG4gIFwiMDkwNTlCXCI6IFwiMTQxMTgtNFwiLCAvLyBMYWN0YXRlIFx1MjAxNCBNYXNzL3ZvbCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIEhlbWF0b2xvZ3kgZXh0cmFzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA4MDA0Q1wiOiBcIjQ1NDQtM1wiLCAvLyBIQ1QgXHUyMDE0IEhlbWF0b2NyaXQgdm9sdW1lIGZyYWN0aW9uIEJsb29kXG4gIFwiMDgwMDhDXCI6IFwiMTQxOTYtMFwiLCAvLyBSZXRpY3Vsb2N5dGUgXHUyMDE0IFJldGljdWxvY3l0ZXMvMTAwIFJCQ1xuICBcIjA4MDEwQ1wiOiBcIjcxMS0yXCIsIC8vIEVvc2lub3BoaWwgY291bnQgXHUyMDE0ICMvdm9sIEJsb29kXG4gIFwiMDgwMTFDXCI6IFwiMjQzMTctMFwiLCAvLyBDQkMgcGFuZWwgXHUyMDE0IEhlbWF0b2xvZ3kgcGFuZWwgQmxvb2RcbiAgXCIwODAyNkNcIjogXCI2MzAxLTZcIiwgLy8gUFQvSU5SIFx1MjAxNCBJTlIgUGxhdGVsZXQgcG9vciBwbGFzbWFcbiAgXCIwODAzNkNcIjogXCIxNDk3OS05XCIsIC8vIEFQVFQgXHUyMDE0IFBsYXRlbGV0IHBvb3IgcGxhc21hXG4gIFwiMDgwNzVDXCI6IFwiMjY5Mi03XCIsIC8vIE9zbW9sYWxpdHkgXHUyMDE0IFNlcnVtIG9yIFBsYXNtYVxuICBcIjA4MDc5QlwiOiBcIjMwMjQwLTZcIiwgLy8gRC1kaW1lciBcdTIwMTQgUGx0IHBvb3IgcGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBGcmVlIFQ0IGhhcyBUV08gdmFsaWQgTE9JTkNzIHRoYXQgZGlmZmVyIG9ubHkgaW4gdW5pdC1zeXN0ZW06XG4gIC8vICAgMzAyNC03ICBDb21wb25lbnQ9VGh5cm94aW5lLmZyZWUsIFByb3BlcnR5PU1DbmMgKE1hc3MgY29uYywgbmcvZEwpXG4gIC8vICAgMTQ5MjAtMyBDb21wb25lbnQ9VGh5cm94aW5lLmZyZWUsIFByb3BlcnR5PVNDbmMgKE1vbGFyIGNvbmMsIHBtb2wvTClcbiAgLy8gQm90aCBhcmUgRnJlZSBUNCBcdTIwMTQgbmVpdGhlciBpcyBUb3RhbCBUNC4gRWFybGllciBoaXN0b3J5OlxuICAvLyAgIC0gT3JpZ2luYWwgbWFwcGluZyB3YXMgMzAyNC03IChjb3JyZWN0OiBtYXRjaGVzIFRhaXdhbiBuZy9kTCBsYWJzKS5cbiAgLy8gICAtIENvbW1pdCA5ZGE1ZTViIGNoYW5nZWQgaXQgdG8gMTQ5MjAtMyBvbiB0aGUgcHJlbWlzZSB0aGF0IDMwMjQtN1xuICAvLyAgICAgd2FzIFRvdGFsIFQ0LiBUaGF0IHByZW1pc2Ugd2FzIGludmVydGVkICh2ZXJpZmllZCBsb2luYy5vcmcvMzAyNC03L1xuICAvLyAgICAgXHUyMDE0IENvbXBvbmVudCBpcyBcIlRoeXJveGluZS5mcmVlXCIpOyB0aGUgY2hhbmdlIGludHJvZHVjZWQgYSBMT0lOQ1x1MjE5NHVuaXRcbiAgLy8gICAgIG1pc21hdGNoIChtb2xhciBMT0lOQyBwYWlyZWQgd2l0aCBhIG5nL2RMIHZhbHVlKS5cbiAgLy8gICAtIFJlc3RvcmluZyAzMDI0LTcgaGVyZSBzbyB0aGUgTE9JTkMncyBwcm9wZXJ0eSBjbGFzcyAoTUNuYykgbWF0Y2hlc1xuICAvLyAgICAgdGhlIHVuaXQgZmllbGQgKG5nL2RMKSBUYWl3YW4gbGFicyBzaGlwLiBTZWUgZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kXG4gIC8vICAgICBzZWN0aW9uIEYgZm9yIGZ1bGwgZXZpZGVuY2UuXG4gIFwiMDkxMDZDXCI6IFwiMzAyNC03XCIsIC8vIEZyZWUgVDQgXHUyMDE0IFRoeXJveGluZSAoVDQpIGZyZWUgW01hc3Mvdm9sdW1lXSBTL1BcbiAgXCIwOTExMkNcIjogXCIzMDE2LTNcIiwgIC8vIFRTSCBcdTIwMTQgVGh5cm90cm9waW4gUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkaWFjIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwOTlDXCI6IFwiMTA4MzktOVwiLCAvLyBUcm9wb25pbiBJIFx1MjAxNCBUcm9wb25pbiBJIGNhcmRpYWMgUy9QXG4gIFwiMTIxOTJDXCI6IFwiMzM5NTktOFwiLCAvLyBQcm9jYWxjaXRvbmluIFx1MjAxNCBTL1BcbiAgXCIxMjE5M0NcIjogXCIzMzc2Mi02XCIsIC8vIE5ULXByb0JOUCBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXRhbWlucyAvIGNvZmFjdG9ycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyOUNcIjogXCIyMTMyLTlcIiwgLy8gVml0IEIxMiBcdTIwMTQgQ29iYWxhbWluIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTMwQ1wiOiBcIjIyODQtOFwiLCAvLyBGb2xhdGUgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjA5MTEzQ1wiOiBcIjIxNDMtNlwiLCAvLyBDb3J0aXNvbCBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIxMTZDXCI6IFwiMjI3Ni00XCIsIC8vIEZlcnJpdGluIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEFjdXRlIHBoYXNlIC8gaW5mbGFtbWF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxMjAxNUMgaXMgdGhlIGdlbmVyaWMgTkhJIENSUCBvcmRlciBcdTIwMTQgbW9zdCBjbGluaWNhbCBjb250ZXh0cyBpbiBcdTUwNjVcdTRGRERcbiAgLy8gc2VuZCBhIHJlZ3VsYXIgKG5vdCBocy0pIENSUCwgc28gbWFwIHRvIDE5ODgtNS4gSWYgYSBcdTk2NjJcdTYyNDAgc3BlY2lmaWNhbGx5XG4gIC8vIGJpbGxzIGhzLUNSUCBpdCB3aWxsIGxhbmQgb24gYSBkaWZmZXJlbnQgY29kZSAoZS5nLiAxMjE4OUMpLlxuICBcIjEyMDE1Q1wiOiBcIjE5ODgtNVwiLCAvLyBDUlAgXHUyMDE0IEMgcmVhY3RpdmUgcHJvdGVpbiBNYXNzL3ZvbCBTL1BcbiAgXCIxMjA1M0NcIjogXCI1MDQ4LTRcIiwgLy8gQU5BIFx1MjAxNCBBbnRpbnVjbGVhciBBYiBUaXRlciBTL1BcbiAgXCIxMjA1NkJcIjogXCIxNjEyNC0wXCIsIC8vIEFudGktbWl0b2Nob25kcmlhbCBBYiBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDYwMTJDXCI6IFwiNTc3OC02XCIsIC8vIFVyaW5lIGFwcGVhcmFuY2UgXHUyMDE0IENvbG9yXG4gIFwiMDYwMTNDXCI6IFwiMjQzNTYtOFwiLCAvLyBcdTVDM0ZcdTc1MUZcdTUzMTYgcGFuZWwgXHUyMDE0IFVyaW5hbHlzaXMgbWFjcm9zY29waWMgcGFuZWxcbiAgXCIwNzAwMUNcIjogXCIxNDU2My0xXCIsIC8vIFN0b29sIG9jY3VsdCBibG9vZFxuICBcIjA5MTM0Q1wiOiBcIjU4NDUzLTJcIiwgLy8gaUZPQlQgcXVhbnRpdGF0aXZlIFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIFN0b29sIGJ5IElBXG4gIFwiMTIxMTFDXCI6IFwiMjE2MS04XCIsIC8vIFVyaW5lIENyZWF0aW5pbmUgXHUyMDE0IHNhbWUgTE9JTkMgYXMgMDkwMTZDXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXJvbG9neSAvIGltbXVub2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDFDXCI6IFwiNTI5Mi04XCIsIC8vIFJQUiBcdTIwMTQgU2VydW0vUGxhc21hXG4gIFwiMTIwMjFDXCI6IFwiMjAzOS02XCIsIC8vIENFQSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMjVCXCI6IFwiMjQ2NS0zXCIsIC8vIElnRyBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMjdCXCI6IFwiMjQ1OC04XCIsIC8vIElnQSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMzFDXCI6IFwiMTkxMTMtMFwiLCAvLyBJZ0UgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICAvLyAxMjA2OUIgQ3J5cHRvY29jY3VzIEFnIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyA1MTMyLTYgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0ROQSBzaW5nbGUgc3RyYW5kIEFiIFtVbml0cy92b2x1bWVdIGluIFNlcnVtJyAoYW50aS1zc0ROQSxcbiAgLy8gbHVwdXMgc2Vyb2xvZ3kgXHUyMDE0IHZlcmlmaWVkIGxvaW5jLm9yZy81MTMyLTYvKS4gQ29tcGxldGVseSB3cm9uZ1xuICAvLyBhbmFseXRlLiBMZWF2aW5nIHVubWFwcGVkOyBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2RlLW9ubHkgY29kaW5nLlxuICAvLyBTZWUgZG9jcy9MT0lOQ19BVURJVF8yMDI2XzA1XzE5Lm1kLlxuICBcIjEyMDc5Q1wiOiBcIjI0MTA4LTNcIiwgLy8gQ0EgMTktOSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBCbG9vZCB0eXBlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjExMDAxQ1wiOiBcIjg4Mi0xXCIsIC8vIFx1ODg0MFx1NTc4Qlx1OTQ1MVx1NUI5QSBcdTIwMTQgQUJPICsgUmggZ3JvdXBcbiAgXCIxMTAwM0NcIjogXCI4ODItMVwiLCAvLyBcdTg4NDBcdTU3OEJcdTk0NTFcdTVCOUEgXHUyMDE0IEFCTyArIFJoIGdyb3VwXG4gIFwiMTEwMDRDXCI6IFwiODkwLTRcIiwgLy8gXHU2Mjk3XHU5QUQ0XHU1M0NEXHU2MUM5IFx1MjAxNCBBbnRpYm9keSBzY3JlZW5cbiAgLy8gXHUyNTAwXHUyNTAwIE1pY3JvYmlvbG9neSBjdWx0dXJlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTMwMDdDIFx1N0QzMFx1ODNDQ1x1NTdGOVx1OTkwQSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMTQyMTktMCB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnSFRMViBJIHAyNiBBYiBpbiBTZXJ1bScgKHZlcmlmaWVkIGF0IGxvaW5jLm9yZykuIFRoZVxuICAvLyByaWdodCBmYW1pbHkgaXMgNjQ2My00IC8gMTEyNjgtMCAoQmFjdGVyaWEgaWRlbnRpZmllZCBieSBhZXJvYmVcbiAgLy8gY3VsdHVyZSkgYnV0IHRoZSBzb3VyY2Ugcm93IGRvZXNuJ3QgdGVsbCB1cyBzcGVjaW1lbiBcdTIwMTQgbGVhdmluZ1xuICAvLyB1bm1hcHBlZCBzbyB3ZSBkb24ndCBsaWUuIEZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuXG4gIC8vIDEzMDEzQyBUQiBDdWx0dXJlIFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAzMTk1Mi01IHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdSaW5kZXJwZXN0IHZpcnVzIEFnIFtQcmVzZW5jZV0gaW4gRXh1ZGF0ZScgKGNhdHRsZVxuICAvLyBtb3JiaWxsaXZpcnVzLCB2ZXJpZmllZCBsb2luYy5vcmcvMzE5NTItNS8pLiBXcm9uZyBvcmdhbmlzbSBlbnRpcmVseS5cbiAgLy8gTGVhdmluZyB1bm1hcHBlZDsgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kZS1vbmx5IGNvZGluZy4gU2VlXG4gIC8vIGRvY3MvTE9JTkNfQVVESVRfMjAyNl8wNV8xOS5tZC5cbiAgXCIxMzAxNkJcIjogXCI2MDAtN1wiLCAvLyBCbG9vZCBDdWx0dXJlIFx1MjAxNCBCYWN0ZXJpYSBpZGVudGlmaWVkIGluIEJsb29kXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXJvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTQwMDRCIENNViBJZ0cgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDc4NDktMyB3aGljaCBpcyBhY3R1YWxseVxuICAvLyAnVGFlbmlhIHNvbGl1bSBsYXJ2YSBJZ00gQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bScgKHBvcmsgdGFwZXdvcm0sXG4gIC8vIHZlcmlmaWVkIGxvaW5jLm9yZy83ODQ5LTMvKS4gTm8gdmVyaWZpZWQgY2Fub25pY2FsIHJlcGxhY2VtZW50IGZvdW5kXG4gIC8vIGluIHRoaXMgcGFzcyAoY2FuZGlkYXRlcyA1MTI2LTggLyA1MTI1LTAgYXJlIElnTSBvciBtZXRob2Qtc3BlY2lmaWMsXG4gIC8vIDIyNTkyLTkgLyAyMjU5MS0xIC8gMTYxMjUtNSByZXR1cm5lZCBIVFRQIDUwMCBvbiBldmVyeSByZXRyeSkuXG4gIC8vIExlYXZpbmcgdW5tYXBwZWQ7IGZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuXG4gIFwiMTQwNDhCXCI6IFwiNzg1My01XCIsIC8vIENNViBJZ00gXHUyMDE0IEN5dG9tZWdhbG92aXJ1cyBJZ00gQWIgW1VuaXRzL3ZvbHVtZV0gUy9QXG4gIC8vICAgcmVzdG9yZWQgYWZ0ZXIgYXVkaXQ6IDE0MDQ4QiBwcmV2aW91c2x5IG1hcHBlZCB0byA3ODUwLTEgd2hpY2ggaXNcbiAgLy8gICAnVGFlbmlhIHNvbGl1bSBsYXJ2YSBBYicgKHZlcmlmaWVkIGxvaW5jLm9yZy83ODUwLTEvKS4gNzg1My01XG4gIC8vICAgdmVyaWZpZWQgYXMgdGhlIGNhbm9uaWNhbCBDTVYgSWdNIExPSU5DIChDb21wb25lbnQ9Q3l0b21lZ2Fsb3ZpcnVzXG4gIC8vICAgQWIuSWdNLCBQcm9wZXJ0eT1BQ25jKSBcdTIwMTQgbG9pbmMub3JnLzc4NTMtNS8uXG4gIFwiMTQwNjZDXCI6IFwiODAzODMtM1wiLCAvLyBJbmZsdWVuemEgQSBcdTIwMTQgQWcgUmVzcGlyYXRvcnlcbiAgXCIxNDA4NENcIjogXCI5NDU1OC00XCIsIC8vIFNBUlMtQ29WLTIgQWcgXHUyMDE0IFJlc3BpcmF0b3J5XG4gIFwiMTIxODRDXCI6IFwiODgxNTctM1wiLCAvLyBDTVYgRE5BIHF1YW50IFBDUiBcdTIwMTQgUGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBNeWNvYmFjdGVyaXVtIC8gYWNpZC1mYXN0IChhZGRlZCBhZnRlciBhdWRpdCkgXHUyNTAwXG4gIFwiMTMwMjVDXCI6IFwiMjkyNjAtN1wiLCAvLyBcdTYyOTdcdTkxNzhcdTYwMjdcdTZGQzNcdTdFMkVcdTYyQjlcdTcyNDdcdTY3RDNcdTgyNzJcdTZBQTJcdTY3RTUgXHUyMDE0IE15Y29iYWN0ZXJpdW0gQUZCIHN0YWluXG4gIFwiMTMwMjZDXCI6IFwiMjk1NTMtNVwiLCAvLyBcdTYyOTdcdTkxNzhcdTgzQ0NcdTU3RjlcdTk5MEEgXHUyMDE0IE15Y29iYWN0ZXJpdW0gY3VsdHVyZSBsaXF1aWQrc29saWRcbiAgLy8gXHUyNTAwXHUyNTAwIEFCRyBwYW5lbCAoMDkwNDFCKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gSW50ZW50aW9uYWxseSBOT1QgbWFwcGVkIGhlcmUgXHUyMDE0IDA5MDQxQiBpcyBhIHBhbmVsIG9yZGVyIHRoYXRcbiAgLy8gdW5mb2xkcyBpbnRvIG1hbnkgaXRlbXMgKHBIIC8gcENPMiAvIHBPMiAvIEhDTzMgLyBUQ08yIC8gU0JFIC9cbiAgLy8gQUJFIC8gU0JDIC8gU0FUKS4gTWFwcGluZyB0aGUgcGFuZWwgY29kZSB0byBcInBIXCIgd291bGQgbWlzLWxhYmVsXG4gIC8vIGV2ZXJ5IG5vbi1wSCByb3cgdGhhdCBzaGFyZXMgdGhpcyBOSEkgY29kZS4gRWFjaCBpdGVtIGlzXG4gIC8vIHJlc29sdmVkIHZpYSBfTE9JTkNfTUFQIGRpc3BsYXkta2V5d29yZCBmYWxsYmFjayBiZWxvdzsgMDkwNDFCXG4gIC8vIGFsc28gYXBwZWFycyBpbiBfRElTUExBWV9GSVJTVF9DT0RFUyBzbyBkaXNwbGF5IGFsd2F5cyB3aW5zLlxuICAvLyBcdTI1MDBcdTI1MDAgQm9keSBmbHVpZCAvIHN5bm92aWFsIGZsdWlkIHBhbmVsICgxNjAwOEMgdW5mb2xkczsgdGhlXG4gIC8vIG1lbWJlciBpdGVtcyByZWx5IG9uIGRpc3BsYXkga2V5d29yZHMgZm9yIHNwZWNpbWVuLWF3YXJlXG4gIC8vIExPSU5DcykuIFBhcmVudCBjb2RlIG1hcHMgdG8gc3lub3ZpYWwgZmx1aWQgYW5hbHlzaXMgcGFuZWwuIFx1MjUwMFx1MjUwMFxuICAvLyAxNjAwOEMgXHU2RUQxXHU2REIyXHU2QUEyXHU2N0U1IFx1MjAxNCBwcmV2aW91c2x5IG1hcHBlZCB0byBMT0lOQyAzMzkwMy02IHdoaWNoIGlzXG4gIC8vIGFjdHVhbGx5ICdLZXRvbmVzIFtQcmVzZW5jZV0gaW4gVXJpbmUnICh2ZXJpZmllZCBsb2luYy5vcmcpLlxuICAvLyBMZWF2aW5nIHVubWFwcGVkOyB0aGUgcGFuZWwgZmFsbHMgdGhyb3VnaCB0byBOSEktY29kaW5nIG9ubHlcbiAgLy8gYW5kIHRoZSBwZXItaXRlbSBkaXNwbGF5cyBpbiBfTE9JTkNfTUFQIGNhcnJ5IHRoZWlyIG93biBMT0lOQ3NcbiAgLy8gd2hlcmUga25vd24uXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0RJU1BMQVlfRklSU1RfQ09ERVMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOSEkgY29kZXMgdGhhdCBhcmUgKnBhbmVscyogXHUyMDE0IG9uZSBiaWxsaW5nIGNvZGUsIG1hbnkgaXRlbS1zcGVjaWZpY1xuLy8gZGlzcGxheXMuIEZvciB0aGVzZSwgZGlzcGxheSBrZXl3b3JkIE1VU1QgYmUgdHJpZWQgZmlyc3QgKHNvIFwiV0JDXCJcbi8vIHVuZGVyIENCQyBwYW5lbCAwODAxMUMgZ2V0cyA2NjkwLTIsIG5vdCB0aGUgZ2VuZXJpYyBwYW5lbCBMT0lOQykuXG4vLyBGb3IgZXZlcnl0aGluZyBlbHNlIChzaW5nbGUtdGVzdCBjb2RlcyBsaWtlIDA5MDA1QyBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDYsXG4vLyAwOTA0NEMgTERMLCAxNDAzMEMgSEJzQWcpLCB0aGUgTkhJIGNvZGUgaXMgbW9yZSBzcGVjaWZpYyB0aGFuIGFueVxuLy8gZGlzcGxheSBrZXl3b3JkIGFuZCB3aW5zIG91dHJpZ2h0LlxuLy9cbi8vIERFU0lHTiBQSElMT1NPUEhZOiB0aGUgYnJpZGdlIGlzIGEgKmZhaXRoZnVsIHRyYW5zcG9ydCogbGF5ZXIgXHUyMDE0IGl0XG4vLyB0cnVzdHMgdGhlIFx1NTA2NVx1NEZERCBiaWxsaW5nIGNvZGUgYXMgYXV0aG9yaXRhdGl2ZSBmb3IgY2xpbmljYWwgaW50ZW50XG4vLyAoXHU5NjYyXHU2MjQwIGJpbGxlZCAwOTAwNUMgPSB0aGV5IG9yZGVyZWQgZmFzdGluZyBnbHVjb3NlLCByZWdhcmRsZXNzIG9mXG4vLyB3aGV0aGVyIHRoZSBvcGVyYXRpb25hbCBzcGVjaW1lbiB3YXMgYSBmaW5nZXItc3RpY2spLiBEaXNwbGF5LXN0cmluZ1xuLy8gcmUtaW50ZXJwcmV0YXRpb24gb2YgY2xpbmljYWwgY29udGV4dCAoR2x1LUFDIHZzIEZJTkdFUiBTVUdBUiB2c1xuLy8gcmFuZG9tKSBpcyBsZWZ0IHRvIHRoZSBTTUFSVCBhcHAsIHdoaWNoIGhhcyBtb3JlIFVJIGNvbnRleHQuXG5leHBvcnQgY29uc3QgRElTUExBWV9GSVJTVF9DT0RFUzogUmVhZG9ubHlTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoW1xuICBcIjA4MDExQ1wiLCAvLyBDQkMgcGFuZWxcbiAgXCIwODAxM0NcIiwgLy8gQ0JDIHcvIGF1dG8gZGlmZiBwYW5lbFxuICBcIjA2MDEzQ1wiLCAvLyBVcmluYWx5c2lzIG1hY3Jvc2NvcGljIHBhbmVsXG4gIFwiMDkwNDFCXCIsIC8vIEFCRyBwYW5lbFxuICBcIjE2MDA4Q1wiLCAvLyBTeW5vdmlhbCAvIGJvZHktZmx1aWQgcGFuZWxcbl0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgX1BBTkVMX0xPSU5DX01BUCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFBhbmVsLXNwZWNpZmljIGRpc3BsYXkgXHUyMTkyIExPSU5DIG92ZXJyaWRlcy4gVGhlc2UgcnVuIEJFRk9SRSB0aGUgZ2xvYmFsXG4vLyBfTE9JTkNfTUFQIHNvIHRoYXQgdXJpbmUgYmlsaXJ1YmluIHVuZGVyIDA2MDEzQyBtYXBzIHRvIDU3NzAtMyAodXJpbmVcbi8vIHNwZWNpbWVuKSBpbnN0ZWFkIG9mIGJlaW5nIHNoYWRvd2VkIGJ5IHRoZSBnbG9iYWwgJ2JpbGlydWJpbicgdGhhdFxuLy8gd291bGQgaW1wbHkgc2VydW0sIGFuZCBhbmFsb2dvdXMgc3BlY2ltZW4tYXdhcmUgZGlzYW1iaWd1YXRpb24gZm9yXG4vLyBvdGhlciBwYW5lbCBzdWItaXRlbXMuIEtleXMgYXJlIE5ISSBwYW5lbCBjb2RlcyAobXVzdCBhbHNvIGJlIGluXG4vLyBfRElTUExBWV9GSVJTVF9DT0RFUyk7IHZhbHVlcyBhcmUgZGlzcGxheS1rZXl3b3JkIFx1MjE5MiBMT0lOQyBkaWN0cyB0aGF0XG4vLyBmb2xsb3cgdGhlIHNhbWUgbWF0Y2hpbmcgc2VtYW50aWNzIGFzIF9MT0lOQ19NQVAgKGxlYWRpbmcgd29yZFxuLy8gYm91bmRhcnkgZm9yIEFTQ0lJLCBzdWJzdHJpbmcgZm9yIENKSykuXG5leHBvcnQgY29uc3QgUEFORUxfTE9JTkNfTUFQOiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEFsbCByb3V0aW5lIGRpcHN0aWNrIGl0ZW1zIHJlc2lkZSBvbiBhIHNpbmdsZSBOSEkgYmlsbGluZyBjb2RlLlxuICAvLyBXaXRob3V0IHRoaXMgdGFibGUgdGhleSdkIGFsbCBjb2xsYXBzZSB0byB0aGUgcGFuZWwgTE9JTkMgMjQzNTYtOCxcbiAgLy8gbG9zaW5nIHBlci1pdGVtIGdyYW51bGFyaXR5IHRoYXQncyBjbGluaWNhbGx5IHVzZWZ1bCAoZS5nLlxuICAvLyBiaWxpcnViaW4gdnMgdXJvYmlsaW5vZ2VuIGZvciBsaXZlciB3b3JrdXApLlxuICBcIjA2MDEzQ1wiOiB7XG4gICAgLy8gT3JkZXIgbWF0dGVyczogbG9uZ2VyL21vcmUtc3BlY2lmaWMga2V5cyBiZWZvcmUgZ2VuZXJpYyBvbmVzXG4gICAgLy8gKG1hdGNoZXMgX0xPSU5DX01BUCBpdGVyYXRpb24gc2VtYW50aWNzIFx1MjAxNCBmaXJzdCBoaXQgd2lucykuXG4gICAgXCJzcGVjaWZpYyBncmF2aXR5XCI6IFwiNTgxMS01XCIsIC8vIFNwZWNpZmljIGdyYXZpdHkgVXJpbmVcbiAgICBcInNwLmdyYXZpdHlcIjogXCI1ODExLTVcIixcbiAgICBcInNwIGdyYXZpdHlcIjogXCI1ODExLTVcIixcbiAgICBcdTZCRDRcdTkxQ0Q6IFwiNTgxMS01XCIsXG4gICAgXCJtaWNyby1hbGJ1bWluXCI6IFwiMTQ5NTctNVwiLCAvLyBNaWNyb2FsYnVtaW4gTWFzcy92b2wgVXJpbmVcbiAgICBtaWNyb2FsYnVtaW46IFwiMTQ5NTctNVwiLFxuICAgIFwibWFsYih1KVwiOiBcIjE0OTU3LTVcIixcbiAgICBtYWxiOiBcIjE0OTU3LTVcIixcbiAgICBcdTVGQUVcdTVDMEZcdTc2N0RcdTg2Q0JcdTc2N0Q6IFwiMTQ5NTctNVwiLFxuICAgIHVhY3I6IFwiMTQ5NTktMVwiLCAvLyBNaWNyb2FsYnVtaW4vQ3JlYXRpbmluZSByYXRpbyBVcmluZVxuICAgIFwidXJpbmUgZ2x1Y29zZVwiOiBcIjU3OTItN1wiLFxuICAgIHN1Z2FyOiBcIjU3OTItN1wiLCAvLyBOSEkgJ1x1NUMzRlx1N0NENicgLyAnU3VnYXInIHVuZGVyIDA2MDEzQ1xuICAgIFx1NUMzRlx1N0NENjogXCI1NzkyLTdcIixcbiAgICB1cm9iaWxpbm9nZW46IFwiNTgxOC0wXCIsIC8vIFVyb2JpbGlub2dlbiBVcmluZSBRbFxuICAgIFx1NUMzRlx1ODFCRFx1N0QyMFx1NTM5RjogXCI1ODE4LTBcIixcbiAgICBiaWxpcnViaW46IFwiNTc3MC0zXCIsIC8vIEJpbGlydWJpbiBVcmluZSBRbFxuICAgIFx1NUMzRlx1ODFCRFx1N0QwNVx1N0QyMDogXCI1NzcwLTNcIixcbiAgICBuaXRyaXRlOiBcIjU4MDItNFwiLCAvLyBOaXRyaXRlIFVyaW5lXG4gICAgXHU0RTlFXHU3ODVEXHU5MTc4OiBcIjU4MDItNFwiLFxuICAgIGtldG9uZXM6IFwiNTc5Ny02XCIsIC8vIEtldG9uZXMgVXJpbmVcbiAgICBrZXRvbmU6IFwiNTc5Ny02XCIsXG4gICAgXHU5MTZFXHU5QUQ0OiBcIjU3OTctNlwiLFxuICAgIHByb3RlaW46IFwiMjA0NTQtNVwiLCAvLyBQcm90ZWluIE1hc3Mvdm9sIFVyaW5lXG4gICAgXHU1QzNGXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgICBcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAgIGxldWtvY3l0ZTogXCI1Nzk5LTJcIiwgLy8gTGV1a29jeXRlcyBVcmluZVxuICAgIGxldTogXCI1Nzk5LTJcIixcbiAgICBcdTc2N0RcdTg4NDBcdTc0MDNcdTkxNkZcdTkxNzY6IFwiNTc5OS0yXCIsXG4gICAgYmxvb2Q6IFwiNTc5NC0zXCIsIC8vIEhlbW9nbG9iaW4gVXJpbmUgUWxcbiAgICBcdTZGNUJcdTg4NDA6IFwiNTc5NC0zXCIsXG4gICAgXHU4MjcyOiBcIjU3NzgtNlwiLCAvLyBDb2xvciBvZiBVcmluZSAoQ0pLIHN1YnN0cmluZylcbiAgICBjb2xvcjogXCI1Nzc4LTZcIixcbiAgICB0dXJiaWRpdHk6IFwiNTc2Ny05XCIsIC8vIEFwcGVhcmFuY2Ugb2YgVXJpbmVcbiAgICBhcHBlYXJhbmNlOiBcIjU3NjctOVwiLFxuICAgIFx1NTkxNlx1ODlDMDogXCI1NzY3LTlcIixcbiAgICBwaDogXCI1ODAzLTJcIiwgLy8gcEggb2YgVXJpbmUgKHVyaW5lLXNwZWNpZmljLCBOT1RcbiAgICAvLyB0aGUgYXJ0ZXJpYWwgMTE1NTgtNCB0aGF0IHRoZVxuICAgIC8vIGdsb2JhbCBtYXAgcG9pbnRzIHRvKVxuICAgIFx1OTE3OFx1OUU3Q1x1NUVBNjogXCI1ODAzLTJcIixcbiAgICBnbHVjb3NlOiBcIjU3OTItN1wiLCAvLyBMYXN0IGluIHRoaXMgYmxvY2sgc28gJ3VyaW5lXG4gIH0sXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgX0xPSU5DX01BUCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIENvbW1vbiBUYWl3YW5lc2UgSElTIGxhYiBuYW1lcyBcdTIxOTIgTE9JTkMgY29kZSBtYXBwaW5nXG5leHBvcnQgY29uc3QgTE9JTkNfTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gRGlzcGxheS1rZXl3b3JkIGZhbGxiYWNrIG9ubHkga2lja3MgaW4gd2hlbiBOTyBOSEkgY29kZSBpc1xuICAvLyBwcmVzZW50IChkYXNoYm9hcmQgcm93cywgTExNLWV4dHJhY3RlZCB0ZXh0KS4gV2hlbiB0aGUgTkhJIGNvZGVcbiAgLy8gSVMgcHJlc2VudCwgMDkwMDVDIFx1MjE5MiAxNTU4LTYgKEZhc3RpbmcpIGFuZCAwOTE0MEMgXHUyMTkyIDIzNDUtN1xuICAvLyAoZ2VuZXJpYykgd2lucyBkaXJlY3RseSB2aWEgX05ISV9UT19MT0lOQy5cbiAgLy9cbiAgLy8gRmFpdGhmdWwtdHJhbnNwb3J0IHByaW5jaXBsZTogdGhlIGJyaWRnZSBkb2VzIE5PVCByZS1pbnRlcnByZXRcbiAgLy8gZGlzcGxheSBzdHJpbmdzIGxpa2UgXCJGSU5HRVIgU1VHQVJcIiBhcyBhIGRpZmZlcmVudCBMT0lOQyBcdTIwMTQgaXRcbiAgLy8gcHJlc2VydmVzIHRoZSByYXcgZGlzcGxheSBpbiBgY29kZS50ZXh0YCBhbmQgdGhlIG9yaWdpbmFsIE5ISVxuICAvLyBjb2RlIGluIGBjb2RlLmNvZGluZ2AuIFRoZSBTTUFSVCBhcHAgZG9lcyBzcGVjaW1lbi9tZXRob2QtYXdhcmVcbiAgLy8gZ3JvdXBpbmcgb24gdGhlIGNvbnN1bWVyIHNpZGUgKHNlZSBTTUFSVCBhcHAgaGFuZG9mZiBkb2MpLlxuICBcImZhc3RpbmcgZ2x1Y29zZVwiOiBcIjE1NTgtNlwiLFxuICBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDY6IFwiMTU1OC02XCIsXG4gIFwiZ2x1LWFjXCI6IFwiMTU1OC02XCIsXG4gIFwiZ2x1Y29zZSBhY1wiOiBcIjE1NTgtNlwiLFxuICBnbHVjb3NlOiBcIjIzNDUtN1wiLFxuICBcdTg4NDBcdTdDRDY6IFwiMjM0NS03XCIsXG4gIGdsdTogXCIyMzQ1LTdcIixcbiAgLy8gSGJBMWMgTVVTVCBhcHBlYXIgYmVmb3JlIGdlbmVyaWMgXCJoYlwiIGVudHJpZXMgc28gdGhlIGxvbmdlc3QtcHJlZml4XG4gIC8vIG1hdGNoIHdpbnMgZm9yIHRoZSBcIkhiQTFjXCIgZGlzcGxheSBzdHJpbmcuIE90aGVyIEExYyBzeW5vbnltc1x1MjAyNlxuICBoYmExYzogXCI0NTQ4LTRcIixcbiAgXHU5MUEzXHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIjQ1NDgtNFwiLFxuICBhMWM6IFwiNDU0OC00XCIsXG4gIGhlbW9nbG9iaW46IFwiNzE4LTdcIixcbiAgXHU4ODQwXHU3RDA1XHU3RDIwOiBcIjcxOC03XCIsXG4gIGhnYjogXCI3MTgtN1wiLFxuICBoYjogXCI3MTgtN1wiLFxuICAvLyBDQkMgZGlmZiBcdTIwMTQgZW9zaW5vcGhpbCBjb3VudCBtdXN0IHByZWNlZGUgdGhlIGJhcmUgJ3diYycvJ1x1NzY3RFx1ODg0MFx1NzQwMydcbiAgLy8ga2V5cyAod2hpY2ggd291bGQgb3RoZXJ3aXNlIHdpbiBhcyBzdWJzdHJpbmdzKS5cbiAgLy8gNzExLTIgdmVyaWZpZWQgYXQgbG9pbmMub3JnOiAnRW9zaW5vcGhpbHMgWyMvdm9sdW1lXSBpbiBCbG9vZFxuICAvLyBieSBBdXRvbWF0ZWQgY291bnQnLlxuICBcdTU1RENcdTkxNzhcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNzExLTJcIixcbiAgXHU1NURDXHU0RjBBXHU3RDA1XHU2MDI3XHU3NjdEXHU4ODQwXHU3NDAzOiBcIjcxMS0yXCIsXG4gIGVvc2lub3BoaWw6IFwiNzExLTJcIixcbiAgZW9zaW5vcGhpbHM6IFwiNzExLTJcIixcbiAgd2JjOiBcIjY2OTAtMlwiLFxuICBcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNjY5MC0yXCIsXG4gIHBsYXRlbGV0OiBcIjc3Ny0zXCIsXG4gIFx1ODg0MFx1NUMwRlx1Njc3RjogXCI3NzctM1wiLFxuICBwbHQ6IFwiNzc3LTNcIixcbiAgLy8gUkJDICsgUkJDIGluZGljZXMgXHUyMDE0IHZlcmlmaWVkIExPSU5DcyAobG9pbmMub3JnKTpcbiAgLy8gNzg5LTggIEVyeXRocm9jeXRlcyAjL3ZvbCBCbG9vZCBBdXRvICAgICAgICAgICAgICBcdTIxOTIgUkJDXG4gIC8vIDc4NS02ICBFcnl0aHJvY3l0ZSBtZWFuIGNvcnB1c2N1bGFyIGhlbW9nbG9iaW4gICAgXHUyMTkyIE1DSFxuICAvLyBMb25nIENKSyBmb3JtcyBmaXJzdCAoTERML2Nob2xlc3Rlcm9sIHBhdHRlcm4pIHNvICdcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcbiAgLy8gXHU4ODQwXHU4MjcyXHU3RDIwJyB3aW5zIG92ZXIgXHU3RDA1XHU4ODQwXHU3NDAzLlxuICBcdTVFNzNcdTU3NDdcdTdEMDVcdTg4NDBcdTc0MDNcdTg4NDBcdTgyNzJcdTdEMjA6IFwiNzg1LTZcIixcbiAgcmJjOiBcIjc4OS04XCIsXG4gIFx1N0QwNVx1ODg0MFx1NzQwMzogXCI3ODktOFwiLFxuICBtY2g6IFwiNzg1LTZcIixcbiAgLy8gVXJpbmUgY3JlYXRpbmluZSBcdTIwMTQgTVVTVCBhcHBlYXIgYmVmb3JlIGdlbmVyaWMgJ2NyZWF0aW5pbmUnIHNvXG4gIC8vIHJvd3MgbGlrZSAnVS1DUkUgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwJyBvciAnQ3JlYXRpbmluZShVKScgcmVzb2x2ZSB0byB0aGVcbiAgLy8gdXJpbmUgTE9JTkMgKDIxNjEtOCkgaW5zdGVhZCBvZiBiZWluZyBzaGFkb3dlZCBieSB0aGUgc2VydW1cbiAgLy8gZGVmYXVsdCAoMjE2MC0wKS4gU2FtZSBsb25nZXN0LXNwZWNpZmljLWZpcnN0IG9yZGVyaW5nIGFzXG4gIC8vIHRoZSBmYXN0aW5nLXZzLXJhbmRvbSBnbHVjb3NlIGJsb2NrLlxuICBcInVyaW5lIGNyZWF0aW5pbmVcIjogXCIyMTYxLThcIixcbiAgXCJjcmVhdGluaW5lIHVyaW5lXCI6IFwiMjE2MS04XCIsXG4gIFwiY3JlYXRpbmluZSh1KVwiOiBcIjIxNjEtOFwiLFxuICBcInUtY3JlXCI6IFwiMjE2MS04XCIsXG4gIFwidS1jcmVhXCI6IFwiMjE2MS04XCIsXG4gIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MDogXCIyMTYxLThcIixcbiAgY3JlYXRpbmluZTogXCIyMTYwLTBcIixcbiAgXHU4MDhDXHU5MTc4XHU5MTUwOiBcIjIxNjAtMFwiLFxuICBcdTgwOENcdTkxNTBcdTkxNzg6IFwiMjE2MC0wXCIsIC8vIFRhaXdhbiB2YXJpYW50IHNwZWxsaW5nXG4gIGNyZWE6IFwiMjE2MC0wXCIsXG4gIGJ1bjogXCIzMDk0LTBcIixcbiAgXHU1QzNGXHU3RDIwXHU2QzJFOiBcIjMwOTQtMFwiLFxuICBhc3Q6IFwiMTkyMC04XCIsXG4gIGFsdDogXCIxNzQyLTZcIixcbiAgZmVycml0aW46IFwiMjI3Ni00XCIsXG4gIFx1ODg0MFx1NkUwNVx1OTQzNVx1ODZDQlx1NzY3RDogXCIyMjc2LTRcIixcbiAgZmVycjogXCIyMjc2LTRcIixcbiAgLy8gVml0YWwtc2lnbnMgZnJvbSBcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjUgKElIS0UzNDAyKSBcdTIwMTQgc2VwYXJhdGUgY29kZSBuYW1lc3BhY2VcbiAgLy8gYnV0IHRoZSBsb29rdXAgaXMgYnkgZGlzcGxheS1uYW1lIHN1YnN0cmluZywgc2FtZSBhcyBmb3IgbGFicy5cbiAgXCJib2R5IGhlaWdodFwiOiBcIjgzMDItMlwiLFxuICBcImJvZHkgd2VpZ2h0XCI6IFwiMjk0NjMtN1wiLFxuICBibWk6IFwiMzkxNTYtNVwiLFxuICAvLyBXYWlzdCBjaXJjdW1mZXJlbmNlIFx1MjAxNCBtZWFzdXJlbWVudCBMT0lOQyAoODI4MC0wKS4gNTYwODYtMiBpc1xuICAvLyB0aGUgJ0FkdWx0IFdhaXN0IENpcmN1bWZlcmVuY2UgUHJvdG9jb2wnIGNvZGUsIHdoaWNoIGlzIGFcbiAgLy8gc3VydmV5L3Byb3RvY29sIGRlc2NyaXB0b3IsIE5PVCBhIG51bWVyaWMgbWVhc3VyZW1lbnRcbiAgLy8gKHZlcmlmaWVkIGF0IGxvaW5jLm9yZykuIE5ISSBcdTUwNjVcdTRGREQgcmVwb3J0cyBhIHNpbmdsZSB3YWlzdGxpbmVcbiAgLy8gbnVtYmVyIHBlciB2aXNpdCwgc28gdGhlIG1lYXN1cmVtZW50IGNvZGUgaXMgY29ycmVjdC5cbiAgXCJ3YWlzdCBjaXJjdW1mZXJlbmNlXCI6IFwiODI4MC0wXCIsXG4gIFwic3lzdG9saWMgYmxvb2QgcHJlc3N1cmVcIjogXCI4NDgwLTZcIixcbiAgXCJkaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIjogXCI4NDYyLTRcIixcbiAgLy8gTGlwaWQgcGFuZWwgXHUyMDE0IE9SREVSIE1BVFRFUlMuIExETC9IREwgdmFyaWFudHMgTVVTVCBwcmVjZWRlIHRoZVxuICAvLyBnZW5lcmljICdjaG9sZXN0ZXJvbCcga2V5IHNvIGEgcm93IGxhYmVsbGVkICdMREwgQ0hPTEVTVEVST0wnXG4gIC8vIHJlc29sdmVzIHRvIDEzNDU3LTcgKExETCBjYWxjdWxhdGVkKSBhbmQgJ0hETCBDSE9MRVNURVJPTCcgdG9cbiAgLy8gMjA4NS05LCBpbnN0ZWFkIG9mIGZhbGxpbmcgdG8gMjA5My0zICh0b3RhbCBjaG9sZXN0ZXJvbCkgdmlhIHRoZVxuICAvLyAnY2hvbGVzdGVyb2wnIHN1YnN0cmluZy4gU2FtZSBjYW5vbmljYWwgb3JkZXJpbmcgYXMgX0xBQl9TWU5PTllNUy5cbiAgXCJsZGwgY2hvbGVzdGVyb2xcIjogXCIxMzQ1Ny03XCIsXG4gIFwibGRsLWNob2xlc3Rlcm9sXCI6IFwiMTM0NTctN1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiMTM0NTctN1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMTM0NTctN1wiLFxuICAvLyAxMzQ1Ny03ID0gTERMIGNob2xlc3Rlcm9sIChjYWxjdWxhdGVkKSBcdTIwMTQgbWF0Y2hlcyB0aGUgTkhJIDA5MDQ0Q1xuICAvLyBiaWxsaW5nIGNvZGUncyBpbnRlbnQgKFRhaXdhbiBsYWJzIHByZWRvbWluYW50bHkgcmVwb3J0IGNhbGN1bGF0ZWRcbiAgLy8gTERMIHZpYSBGcmllZGV3YWxkKS4gS2VlcCBjb25zaXN0ZW50IHdpdGggX05ISV9UT19MT0lOQ1tcIjA5MDQ0Q1wiXS5cbiAgXCJsZGwtY1wiOiBcIjEzNDU3LTdcIixcbiAgbGRsOiBcIjEzNDU3LTdcIixcbiAgXCJoZGwgY2hvbGVzdGVyb2xcIjogXCIyMDg1LTlcIixcbiAgXCJoZGwtY2hvbGVzdGVyb2xcIjogXCIyMDg1LTlcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwODUtOVwiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA4NS05XCIsXG4gIFwiaGRsLWNcIjogXCIyMDg1LTlcIixcbiAgaGRsOiBcIjIwODUtOVwiLFxuICAvLyBUb3RhbCBjaG9sZXN0ZXJvbCBcdTIwMTQgYmFyZSAnY2hvbGVzdGVyb2wnIG9ubHkgZmlyZXMgQUZURVIgdGhlXG4gIC8vIExETC9IREwtcHJlZml4ZWQgdmFyaWFudHMgYWJvdmUgaGF2ZSBiZWVuIGNoZWNrZWQuXG4gIFwidG90YWwgY2hvbGVzdGVyb2xcIjogXCIyMDkzLTNcIixcbiAgXCJ0LWNob2xlc3Rlcm9sXCI6IFwiMjA5My0zXCIsXG4gIFx1ODg0MFx1NkUwNVx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDkzLTNcIixcbiAgXHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwOTMtM1wiLFxuICBjaG9sZXN0ZXJvbDogXCIyMDkzLTNcIixcbiAgdHJpZ2x5Y2VyaWRlOiBcIjI1NzEtOFwiLFxuICBcdTRFMDlcdTkxNzhcdTc1MThcdTZDQjlcdTkxNkY6IFwiMjU3MS04XCIsXG4gIFwidXJpYyBhY2lkXCI6IFwiMzA4NC0xXCIsXG4gIGVnZnI6IFwiMzM5MTQtM1wiLFxuICBoYnNhZzogXCI1MTk2LTFcIixcbiAgXCJhbnRpLWhjdlwiOiBcIjE2MTI4LTFcIixcbiAgLy8gVXJpbmUgcHJvdGVpbiAoZGlzcGxheSBmYWxsYmFjayBmb3IgdGhlIG5vLU5ISS1jb2RlIHBhdGggdGhhdFxuICAvLyBjb21lcyBmcm9tIElIS0UzNDAyIHZpdGFscyArIGFkdWx0LXByZXZlbnRpdmUgc3VwcGxlbWVudHMpLlxuICBcInVyaW5lIHByb3RlaW5cIjogXCIyMDQ1NC01XCIsIC8vIFByb3RlaW4gTWFzcy92b2wgVXJpbmVcbiAgXCJ1LXByb1wiOiBcIjIwNDU0LTVcIixcbiAgXHU1QzNGXHU4NkNCXHU3NjdEOiBcIjIwNDU0LTVcIixcbiAgLy8gQUJHIHBhbmVsIGNvbXBvbmVudHMgXHUyMDE0IDA5MDQxQiBwYXJlbnQgY29kZSBpbiBOSElfVE9fTE9JTkM7IGVhY2hcbiAgLy8gbWVtYmVyJ3MgZGlzcGxheSAoXCJwQ08yXCIsIFwicE8yXCIsIFwiSENPM1wiLCBcIlRDTzJcIiwgXCJTQkUvQUJFXCIsXG4gIC8vIFwiU0JDXCIsIFwiU0FUXCIgLyBcIlNhTzJcIikgZmFsbHMgdG8gaXRzIG93biBMT0lOQy5cbiAgLy8gcEggTVVTVCBjb21lIGJlZm9yZSBwY28yL3BvMiBzbyB0aGUgYmFyZSBcInBIXCIgZGlzcGxheSBsYW5kcyBoZXJlLlxuICBwaDogXCIxMTU1OC00XCIsIC8vIHBIIG9mIEFydGVyaWFsIGJsb29kXG4gIHBjbzI6IFwiMjAxOS04XCIsIC8vIENhcmJvbiBkaW94aWRlIHBwIGluIEFydGVyaWFsIGJsb29kXG4gIHBvMjogXCIyNzAzLTdcIiwgLy8gT3h5Z2VuIHBwIGluIEFydGVyaWFsIGJsb29kXG4gIGhjbzM6IFwiMTk1OS02XCIsIC8vIEJpY2FyYm9uYXRlIE1vbGVzL3ZvbCBBcnRlcmlhbFxuICBiaWNhcmJvbmF0ZTogXCIxOTU5LTZcIixcbiAgdGNvMjogXCIyMDI4LTlcIiwgLy8gVG90YWwgQ08yIE1vbGVzL3ZvbCBBcnRlcmlhbFxuICBzYmU6IFwiMTE1NTUtMFwiLCAvLyBTdGFuZGFyZCBiYXNlIGV4Y2VzcyBBcnRlcmlhbFxuICBhYmU6IFwiMTE1NTUtMFwiLFxuICBzYmM6IFwiMTkyNS03XCIsIC8vIFN0YW5kYXJkIGJpY2FyYm9uYXRlIEFydGVyaWFsXG4gIHNhdHVyYXQ6IFwiMjcxMy02XCIsIC8vIE8yIHNhdHVyYXRpb24gQXJ0ZXJpYWxcbiAgc2FvMjogXCIyNzEzLTZcIixcbiAgc2F0OiBcIjI3MTMtNlwiLCAvLyBOSEkgZGlzcGxheSBzaG93cyBqdXN0IFwiU0FUXCJcbiAgLy8gU3lub3ZpYWwgLyBib2R5LWZsdWlkIGNvbXBvbmVudHMgKDE2MDA4QyBwYXJlbnQgYWJvdmUpLlxuICBcInNmLmNvbG9yXCI6IFwiNTc3OC02XCIsIC8vIENvbG9yIG9mIEJvZHkgZmx1aWQgKHJldXNlIFVyaW5lIGNvbG9yIHNwZWMgT0spXG4gIC8vIE5PVEU6IDgyNTUtMiAvIDEzOTQ4LTUgcHJldmlvdXNseSBsaXN0ZWQgaGVyZSBib3RoIHR1cm5lZCBvdXRcbiAgLy8gdG8gYmUgdW5yZWxhdGVkIExPSU5DcyAodmVyaWZpZWQgbG9pbmMub3JnIFx1MjAxNCA4MjU1LTIgaXNcbiAgLy8gJ1NlcnZpY2UgY29tbWVudCAxMycsIDEzOTQ4LTUgaXMgJ0NvY2NpZGlvaWRlcyBpbW1pdGlzIElnTVxuICAvLyBBYicpLiBCb2R5LWZsdWlkIEFwcGVhcmFuY2UgLyBSQkMgZG9uJ3QgaGF2ZSB3ZWxsLWF0dGVzdGVkXG4gIC8vIExPSU5DcyBpbiBvdXIgdGFibGUgeWV0IFx1MjAxNCBmYWxsaW5nIHRocm91Z2ggdG8gY29kZS50ZXh0LW9ubHlcbiAgLy8gaXMgc2FmZXIgdGhhbiBlbWl0dGluZyBhIG1pc2xlYWRpbmcgTE9JTkMuIFRvIGFkZCBsYXRlcixcbiAgLy8gdmVyaWZ5IGVhY2ggYWdhaW5zdCBsb2luYy5vcmcgZmlyc3QuXG4gIFwic2Yud2JjXCI6IFwiMjY0NjYtM1wiLCAvLyBXQkMgIy92b2wgQm9keSBmbHVpZFxuICBcInNmLm5ldXRyb3BoaWxcIjogXCIxMDMyOC02XCIsIC8vIE5ldXRyb3BoaWxzLzEwMCBsZXVrb2N5dGVzIGluIEJvZHkgZmx1aWRcbiAgXCJzZi5seW1waG9cIjogXCIxMzA0Ni04XCIsIC8vIEx5bXBob2N5dGVzICMvdm9sIEJvZHkgZmx1aWRcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfTE9JTkNfRElTUExBWSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIENhbm9uaWNhbCBFbmdsaXNoIGRpc3BsYXkgbmFtZXMgZm9yIExPSU5DIGNvZGVzIHRoZSBicmlkZ2UgZW1pdHMuXG4vLyBGYWxscyBiYWNrIHRvIHRoZSByYXcgaW5wdXQgZGlzcGxheSB3aGVuIGEgTE9JTkMgaXNuJ3QgbGlzdGVkIGhlcmUuXG4vLyBTb3VyY2VkIGZyb20gbG9pbmMub3JnIGNhbm9uaWNhbCBzaG9ydCBuYW1lcyB3aGVyZSBhcHBsaWNhYmxlLlxuLy8gQWRkIG5ldyBlbnRyaWVzIGFzIHdlIHdpZGVuIExPSU5DIGNvdmVyYWdlIFx1MjAxNCB0aGUgbG9va3VwIGlzIGtleWVkIG9uXG4vLyBMT0lOQyBzdHJpbmcsIHNvIHVubWFwcGVkIExPSU5DcyBkZWdyYWRlIGdyYWNlZnVsbHkgdG8gdGhlIE5ISSB0ZXh0LlxuZXhwb3J0IGNvbnN0IExPSU5DX0RJU1BMQVk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBVcmluYWx5c2lzICgwNjAxM0MgcGFuZWwgc3ViLWl0ZW1zKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gTW9zdCBjcml0aWNhbCBibG9jayBcdTIwMTQgTkhJJ3MgXCJDb2xvciBcdTVDM0YgXHU5ODRGICAuLi5cIiBzdHlsZSBsYWJlbHMgYXJlXG4gIC8vIHdoYXQgdHJpZ2dlcnMgZG93bnN0cmVhbSBDaGluZXNlLXN1YnN0cmluZyBsYWJlbGxpbmcgYnVncy5cbiAgXCI1ODAzLTJcIjogXCJwSCBvZiBVcmluZVwiLFxuICBcIjU4MTEtNVwiOiBcIlNwZWNpZmljIGdyYXZpdHkgb2YgVXJpbmVcIixcbiAgXCI1NzcwLTNcIjogXCJCaWxpcnViaW4gVXJpbmUgUWxcIixcbiAgXCI1ODAyLTRcIjogXCJOaXRyaXRlIFVyaW5lIFFsXCIsXG4gIFwiNTc3OC02XCI6IFwiQ29sb3Igb2YgVXJpbmVcIixcbiAgXCI1NzY3LTlcIjogXCJBcHBlYXJhbmNlIG9mIFVyaW5lXCIsXG4gIFwiNTgxOC0wXCI6IFwiVXJvYmlsaW5vZ2VuIFVyaW5lIFFsXCIsXG4gIFwiMjA0NTQtNVwiOiBcIlByb3RlaW4gTWFzcy9Wb2wgaW4gVXJpbmVcIixcbiAgXCIxNDk1Ny01XCI6IFwiTWljcm9hbGJ1bWluIE1hc3MvVm9sIGluIFVyaW5lXCIsXG4gIFwiMTQ5NTktMVwiOiBcIk1pY3JvYWxidW1pbi9DcmVhdGluaW5lIFJhdGlvIGluIFVyaW5lXCIsXG4gIFwiNTc5Mi03XCI6IFwiR2x1Y29zZSBVcmluZSBRbFwiLFxuICBcIjU3OTctNlwiOiBcIktldG9uZXMgVXJpbmUgUWxcIixcbiAgXCI1Nzk0LTNcIjogXCJIZW1vZ2xvYmluIFVyaW5lIFFsXCIsXG4gIFwiNTc5OS0yXCI6IFwiTGV1a29jeXRlcyBVcmluZSBRbFwiLFxuICBcIjI0MzU2LThcIjogXCJVcmluYWx5c2lzIE1hY3JvIFBhbmVsXCIsXG4gIC8vIEFMTCBlbnRyaWVzIGJlbG93IHVzZSB0aGUgTE9JTkMgY2Fub25pY2FsICdMb25nIENvbW1vbiBOYW1lJ1xuICAvLyBhcyBhY2NlcHRlZCBieSB0aGUgVFdOSElGSElSIHZhbGlkYXRvci4gU291cmNlOiBsb2luYy5vcmcgZm9yXG4gIC8vIGVhY2ggY29kZSwgY3Jvc3MtY2hlY2tlZCBhZ2FpbnN0IHRoZSB2YWxpZGF0b3IncyByZXBvcnRlZFxuICAvLyAnVmFsaWQgZGlzcGxheSBpcyBvbmUgb2YgTiBjaG9pY2VzJyBmb3IgZGlzcGxheXMgd2UgcHJldmlvdXNseVxuICAvLyBnb3Qgd3JvbmcgKDQ1IExPSU5DcyBmb3VuZCBpbiB0aGUgUDMzMzMzMzMzMyB2YWxpZGF0aW9uIHJ1bikuXG4gIC8vIFdoZW4gdXBkYXRpbmcsIGNvcHkgdGhlIGV4YWN0IGVuLVVTIGxvbmcgbmFtZSBmcm9tIGxvaW5jLm9yZyBcdTIwMTRcbiAgLy8gdGhlIHZhbGlkYXRvciBpcyBzZW5zaXRpdmUgdG8gc3BlbGxpbmcgLyBwdW5jdHVhdGlvbi5cbiAgLy9cbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQyBwYW5lbCBzdWItaXRlbXMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBcdTI1MDBcdTI1MDAgQUJHICgwOTA0MUIgcGFuZWwpIFx1MjAxNCBub3QgaW4gdmFsaWRhdG9yIG91dHB1dDsgbG9pbmMub3JnIHNvdXJjZWRcbiAgXCIxMTU1OC00XCI6IFwicEggb2YgQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIyMDE5LThcIjogXCJDYXJib24gZGlveGlkZSBbUGFydGlhbCBwcmVzc3VyZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIyNzAzLTdcIjogXCJPeHlnZW4gW1BhcnRpYWwgcHJlc3N1cmVdIGluIEFydGVyaWFsIGJsb29kXCIsXG4gIFwiMTk1OS02XCI6IFwiQmljYXJib25hdGUgW01vbGVzL3ZvbHVtZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIyMDI4LTlcIjogXCJDYXJib24gZGlveGlkZSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxMTU1NS0wXCI6IFwiQmFzZSBleGNlc3MgaW4gQXJ0ZXJpYWwgYmxvb2QgYnkgY2FsY3VsYXRpb25cIixcbiAgXCIxOTI1LTdcIjogXCJCaWNhcmJvbmF0ZSBbTW9sZXMvdm9sdW1lXSBpbiBBcnRlcmlhbCBibG9vZCAtLXN0YW5kYXJkXCIsXG4gIFwiMjcxMy02XCI6IFwiT3h5Z2VuIHNhdHVyYXRpb24gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEdsdWNvc2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTU1OC02XCI6IFwiRmFzdGluZyBnbHVjb3NlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjM0NS03XCI6IFwiR2x1Y29zZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgSGVtYXRvbG9neSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI3MTgtN1wiOiBcIkhlbW9nbG9iaW4gW01hc3Mvdm9sdW1lXSBpbiBCbG9vZFwiLFxuICBcIjQ1NDgtNFwiOiBcIkhlbW9nbG9iaW4gQTFjL0hlbW9nbG9iaW4udG90YWwgaW4gQmxvb2RcIixcbiAgXCI2NjkwLTJcIjogXCJMZXVrb2N5dGVzIFsjL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzc3LTNcIjogXCJQbGF0ZWxldHMgWyMvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3ODktOFwiOiBcIkVyeXRocm9jeXRlcyBbIy92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc4NS02XCI6IFwiTUNIIFtFbnRpdGljIG1hc3NdIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjcxMS0yXCI6IFwiRW9zaW5vcGhpbHMgWyMvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI0NTQ0LTNcIjogXCJIZW1hdG9jcml0IFtWb2x1bWUgRnJhY3Rpb25dIG9mIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjU3MDIxLThcIjogXCJDQkMgVyBBdXRvIERpZmZlcmVudGlhbCBwYW5lbCAtIEJsb29kXCIsXG4gIFwiMjQzMTctMFwiOiBcIkhlbW9ncmFtIGFuZCBwbGF0ZWxldHMgV08gZGlmZmVyZW50aWFsIHBhbmVsIC0gQmxvb2RcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENoZW1pc3RyeSAvIGxpdmVyIC8gcmVuYWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTkyMC04XCI6IFwiQXNwYXJ0YXRlIGFtaW5vdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3NDItNlwiOiBcIkFsYW5pbmUgYW1pbm90cmFuc2ZlcmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjE2MC0wXCI6IFwiQ3JlYXRpbmluZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIxNjEtOFwiOiBcIkNyZWF0aW5pbmUgW01hc3Mvdm9sdW1lXSBpbiBVcmluZVwiLFxuICBcIjMzOTE0LTNcIjpcbiAgICBcIkdsb21lcnVsYXIgZmlsdHJhdGlvbiByYXRlIFtWb2x1bWUgUmF0ZS9BcmVhXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgQ3JlYXRpbmluZS1iYXNlZCBmb3JtdWxhIChNRFJEKS8xLjczIHNxIE1cIixcbiAgXCIzMDk0LTBcIjogXCJVcmVhIG5pdHJvZ2VuIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzA4NC0xXCI6IFwiVXJhdGUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyOTUxLTJcIjogXCJTb2RpdW0gW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjgyMy0zXCI6IFwiUG90YXNzaXVtIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5NzUtMlwiOiBcIkJpbGlydWJpbi50b3RhbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE5NjgtN1wiOiBcIkJpbGlydWJpbi5kaXJlY3QgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzUxLTdcIjogXCJBbGJ1bWluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjUzMi0wXCI6IFwiTGFjdGF0ZSBkZWh5ZHJvZ2VuYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCI2NzY4LTZcIjogXCJBbGthbGluZSBwaG9zcGhhdGFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjMyNC0yXCI6IFwiR2FtbWEgZ2x1dGFteWwgdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjE3ODYxLTZcIjogXCJDYWxjaXVtIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXBpZCBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIyMDkzLTNcIjogXCJDaG9sZXN0ZXJvbCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI1NzEtOFwiOiBcIlRyaWdseWNlcmlkZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIwODUtOVwiOiBcIkNob2xlc3Rlcm9sIGluIEhETCBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjEzNDU3LTdcIjogXCJDaG9sZXN0ZXJvbCBpbiBMREwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgY2FsY3VsYXRpb25cIixcbiAgLy8gXHUyNTAwXHUyNTAwIFRoeXJvaWQgLyBob3Jtb25lcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIzMDE2LTNcIjogXCJUaHlyb3Ryb3BpbiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMDI0LTdcIjogXCJUaHlyb3hpbmUgKFQ0KSBmcmVlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTQ5MjAtM1wiOiBcIlRoeXJveGluZSAoVDQpIGZyZWUgW01vbGVzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjk4Ni04XCI6IFwiVGVzdG9zdGVyb25lIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiODMwOTgtNFwiOiBcIkZvbGxpdHJvcGluIFtVbml0cy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICBcIjgzMDk2LThcIjogXCJFc3RyYWRpb2wgKEUyKSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ2FyZGlhYyAvIGluZmxhbW1hdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxMDgzOS05XCI6IFwiVHJvcG9uaW4gSS5jYXJkaWFjIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzM3NjItNlwiOiBcIk5hdHJpdXJldGljIHBlcHRpZGUuQiBwcm9ob3Jtb25lIE4tVGVybWluYWwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTg4LTVcIjogXCJDIHJlYWN0aXZlIHByb3RlaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIzMzk1OS04XCI6IFwiUHJvY2FsY2l0b25pbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgSGVwYXRpdGlzIC8gc2Vyb2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNTE5NS0zXCI6IFwiSGVwYXRpdGlzIEIgdmlydXMgc3VyZmFjZSBBZyBbUHJlc2VuY2VdIGluIFNlcnVtXCIsXG4gIFwiNTE5Ni0xXCI6IFwiSGVwYXRpdGlzIEIgdmlydXMgc3VyZmFjZSBBZyBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bVwiLFxuICBcIjE2MTI4LTFcIjogXCJIZXBhdGl0aXMgQyB2aXJ1cyBBYiBbUHJlc2VuY2VdIGluIFNlcnVtXCIsXG4gIFwiMTM5NTUtMFwiOiBcIkhlcGF0aXRpcyBDIHZpcnVzIEFiIFtQcmVzZW5jZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IEltbXVub2Fzc2F5XCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXJvbG9neSAoYXVkaXQgMjAyNi0wNS0xOSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNzg1My01XCI6IFwiQ3l0b21lZ2Fsb3ZpcnVzIElnTSBBYiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIFR1bW9yIG1hcmtlcnMgLyBwcm90ZWlucyAoYXVkaXQgMjAyNi0wNS0xOSkgXHUyNTAwXHUyNTAwXG4gIFwiMTk1Mi0xXCI6IFwiQmV0YS0yLU1pY3JvZ2xvYnVsaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENvYWd1bGF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjYzMDEtNlwiOiBcIklOUiBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYSBieSBDb2FndWxhdGlvbiBhc3NheVwiLFxuICBcIjE0OTc5LTlcIjogXCJhUFRUIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hIGJ5IENvYWd1bGF0aW9uIGFzc2F5XCIsXG4gIFwiMzAyNDAtNlwiOiBcIkZpYnJpbiBELWRpbWVyIFtNYXNzL3ZvbHVtZV0gaW4gUGxhdGVsZXQgcG9vciBwbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIFZpdGFsIHNpZ25zIChJSEtFMzQwMikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiODMwMi0yXCI6IFwiQm9keSBoZWlnaHRcIixcbiAgXCIyOTQ2My03XCI6IFwiQm9keSB3ZWlnaHRcIixcbiAgXCIzOTE1Ni01XCI6IFwiQm9keSBtYXNzIGluZGV4IChCTUkpIFtSYXRpb11cIixcbiAgXCI4MjgwLTBcIjogXCJXYWlzdCBDaXJjdW1mZXJlbmNlIGF0IHVtYmlsaWN1cyBieSBUYXBlIG1lYXN1cmVcIixcbiAgXCI4NDgwLTZcIjogXCJTeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiLFxuICBcIjg0NjItNFwiOiBcIkRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiLFxuICBcIjg1MzU0LTlcIjogXCJCbG9vZCBwcmVzc3VyZSBwYW5lbCB3aXRoIGFsbCBjaGlsZHJlbiBvcHRpb25hbFwiLFxufTtcbiIsICIvKipcbiAqIFB1cmUgcGFyc2luZyBoZWxwZXJzIFx1MjAxNCByZWZlcmVuY2UgcmFuZ2UsIHF1YW50aXR5LCBVQ1VNIHVuaXQgbm9ybWFsaXNhdGlvbi5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvX3BhcnNlcnMucHlgLiBTZWxmLWNvbnRhaW5lZDogbm8gZGVwZW5kZW5jaWVzXG4gKiBvbiBvdGhlciBvYnNlcnZhdGlvbiBtb2R1bGUgcGllY2VzLlxuICpcbiAqIFB1YmxpYyBBUEk6XG4gKiAgIHRvVWN1bSh1bml0KSAgICAgICAgICAgICAgICAgIFx1MjE5MiBjYW5vbmljYWwgVUNVTSB1bml0IHN0cmluZyAob3IgbnVsbClcbiAqICAgcGFyc2VSYW5nZU11bHRpKHJhdywgdW5pdCkgICAgXHUyMTkyIGxpc3Qgb2YgRkhJUiByZWZlcmVuY2VSYW5nZSBlbnRyaWVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9uZSBwZXIgc2V4IHdoZW4gc2V4LXN0cmF0aWZpZWQpXG4gKiAgIHBhcnNlUmFuZ2UocmF3LCB1bml0KSAgICAgICAgIFx1MjE5MiBzaW5nbGUgcmVmZXJlbmNlUmFuZ2UgZW50cnlcbiAqICAgdHJ5UGFyc2VRdWFudGl0eShyYXcsIHVuaXQpICAgXHUyMTkyIEZISVIgUXVhbnRpdHkgZGljdCBvciBudWxsXG4gKi9cblxuY29uc3QgVUNVTV9TWVNURU0gPSBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIjtcblxuLy8gRkhJUiBSNCBRdWFudGl0eS5jb21wYXJhdG9yIGFsbG93ZWQgdmFsdWVzLiBOb3JtYWxpc2UgZnVsbC13aWR0aCBDSktcbi8vIFx1RkYxRSBcdUZGMUMgXHUyMjY3IFx1MjI2NiArIEFTQ0lJIHZhcmlhbnRzIHNvIFwiXHVGRjFFIDQwLjBcIiBzdGlsbCBwYXJzZXMgYXMgYSByZWFsIG51bWJlclxuLy8gaW5zdGVhZCBvZiBmYWxsaW5nIHRocm91Z2ggdG8gdmFsdWVTdHJpbmcgKHdoaWNoIGxvc2VzIHRoZSB1bml0KS5cbmNvbnN0IEZVTExXSURUSF9PUFM6IFJlYWRvbmx5QXJyYXk8W3N0cmluZywgc3RyaW5nXT4gPSBbXG4gIFtcIlx1RkYxRVwiLCBcIj5cIl0sXG4gIFtcIlx1RkYxQ1wiLCBcIjxcIl0sXG4gIFtcIlx1MjI2N1wiLCBcIj49XCJdLFxuICBbXCJcdTIyNjZcIiwgXCI8PVwiXSxcbiAgW1wiXHUyMjY1XCIsIFwiPj1cIl0sXG4gIFtcIlx1MjI2NFwiLCBcIjw9XCJdLFxuXTtcblxuZnVuY3Rpb24gdHJhbnNsYXRlRnVsbHdpZHRoKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBvdXQgPSBzO1xuICBmb3IgKGNvbnN0IFtmcm9tLCB0b10gb2YgRlVMTFdJRFRIX09QUykge1xuICAgIGlmIChvdXQuaW5jbHVkZXMoZnJvbSkpIHtcbiAgICAgIG91dCA9IG91dC5zcGxpdChmcm9tKS5qb2luKHRvKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuY29uc3QgQ09NUEFSQVRPUl9SRSA9IC9eXFxzKig8PXw+PXw8fD4pXFxzKiguKykkLztcblxuLy8gUmVmZXJlbmNlLXJhbmdlIHBhcnNpbmcuIE5ISSBzaGlwcyB0aGUgcmFuZ2UgYXMgcGxhaW4gdGV4dCBsaWtlXG4vLyBcIlszLjg5XVsyNi44XVwiLCBcIls0MF1bXVwiLCBcIltOZWdhdGl2ZV1cIiBvciBcIkFNIDg6MDAgNi4yLTE5LjRcIi5cbmNvbnN0IFJSX0xPV0hJR0hfQlJBQ0tFVFMgPSAvXlxccypcXFtcXHMqKFteXFxdXSopXFxzKlxcXVxccypcXFtcXHMqKFteXFxdXSopXFxzKlxcXVxccyokLztcbmNvbnN0IFJSX0RBU0hfUkFOR0UgPSAvKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqWy1+XHUyMDEzXVxccyooLT9cXGQrKD86XFwuXFxkKyk/KS87XG5jb25zdCBSUl9DT01QQVJBVE9SID0gL15cXHMqKDw9fD49fDx8PilcXHMqKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqJC87XG4vLyBTZXgtc3RyYXRpZmllZCBicmFja2V0ZWQgcmFuZ2UsIGUuZy4gXCJcdTc1Mzc6MTMuNyBcdTU5NzM6MTEuMVwiIFx1MjAxNCB1c2VkIGJ5IHNvbWVcbi8vIGhvc3BpdGFscyBmb3IgaGFlbWF0b2xvZ3kgKEhiLCBSQkMsIEhjdCkuIFB1bGxzIG91dCAoc2V4LCB2YWx1ZSkgcGFpcnMuXG4vLyBUb2xlcmF0ZXMgb3B0aW9uYWwgY29tcGFyYXRvciAoXHUyMjY3L1x1MjI2Ni8+LzwpIGJlZm9yZSB0aGUgbnVtYmVyLlxuY29uc3QgUlJfU0VYX05VTV9HID0gLyhcdTc1MzdcdTYwMjd8XHU1OTczXHU2MDI3fFx1NzUzN3xcdTU5NzN8TXxGKVxccypbOlx1RkYxQV0/XFxzKig/Ols8Plx1MjI2N1x1MjI2Nl09Pyk/XFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pL2c7XG5jb25zdCBSUl9TSU5HTEVfQlJBQ0tFVCA9IC9eXFxzKlxcW1xccyooLis/KVxccypcXF1cXHMqJC87XG5jb25zdCBSUl9RVUFMSVRBVElWRV9QQVJFTiA9XG4gIC9eXFxzKihOb3JtYWx8XHU2QjYzXHU1RTM4fE5vbnJlYWN0aXZlfE5vbi1yZWFjdGl2ZSlcXHMqXFwoXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pXFxzKlxcKVxccyokL2k7XG5cbmNvbnN0IFNFWF9UT19GSElSOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgXHU3NTM3XHU2MDI3OiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgXHU3NTM3OiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgTTogW1wibWFsZVwiLCBcIk1hbGVcIl0sXG4gIFx1NTk3M1x1NjAyNzogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxuICBcdTU5NzM6IFtcImZlbWFsZVwiLCBcIkZlbWFsZVwiXSxcbiAgRjogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxufTtcblxuLy8gUHVibGljIHR5cGVzIFx1MjAxNCBGSElSIFF1YW50aXR5IC8gcmVmZXJlbmNlUmFuZ2Ugc2hhcGVzIHVzZWQgZG93bnN0cmVhbS5cbmV4cG9ydCBpbnRlcmZhY2UgUXVhbnRpdHkge1xuICB2YWx1ZTogbnVtYmVyO1xuICB1bml0Pzogc3RyaW5nO1xuICBzeXN0ZW0/OiBzdHJpbmc7XG4gIGNvZGU/OiBzdHJpbmc7XG4gIGNvbXBhcmF0b3I/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmFuZ2VFbnRyeSB7XG4gIHRleHQ6IHN0cmluZztcbiAgbG93PzogUXVhbnRpdHk7XG4gIGhpZ2g/OiBRdWFudGl0eTtcbiAgYXBwbGllc1RvPzogQXJyYXk8e1xuICAgIGNvZGluZzogQXJyYXk8eyBzeXN0ZW06IHN0cmluZzsgY29kZTogc3RyaW5nOyBkaXNwbGF5OiBzdHJpbmcgfT47XG4gICAgdGV4dDogc3RyaW5nO1xuICB9Pjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFVDVU0gbm9ybWFsaXNhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBOSEkgbGFicyByZXBvcnQgdW5pdHMgaW4gYSBtaXggb2YgVUNVTS1jbGVhbiBzdHJpbmdzICgnbWcvZEwnKSxcbiAqIFRhaXdhbi1zdHlsZSBlcXVpdmFsZW50cyAoJ21FcS9MJyB2cyBVQ1VNICdtZXEvTCcpLCBmdWxsLXdpZHRoIHB1bmN0dWF0aW9uXG4gKiAoJ1x1RkYwNScgdnMgJyUnKSwgYW5kIHBsYWNlaG9sZGVyIHRleHQgKCdcdTcxMjEnKS4gVGhlIFRXTkhJRkhJUiB2YWxpZGF0b3JcbiAqIHJlamVjdHMgZXZlcnl0aGluZyBleGNlcHQgY2Fub25pY2FsIFVDVU0gaW4gUXVhbnRpdHkuY29kZSwgc28gd2VcbiAqIG5vcm1hbGlzZS4gYG51bGxgIG1lYW5zIFwib21pdCBRdWFudGl0eS5jb2RlIGVudGlyZWx5XCIuXG4gKi9cbmNvbnN0IFVDVU1fT1ZFUlJJREVTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudWxsPiA9IHtcbiAgLy8gRnVsbHdpZHRoIFx1MjE5MiBBU0NJSVxuICBcIlx1RkYwNVwiOiBcIiVcIixcbiAgLy8gQ2FzZS1zZW5zaXRpdmUgVUNVTSAoRXEgaXMgJ2VxJywgbm90ICdFcScpXG4gIFwibUVxL0xcIjogXCJtZXEvTFwiLFxuICBcIm1lcS9sXCI6IFwibWVxL0xcIixcbiAgLy8gQlAgcHJvZmlsZSBmaXhlZC12YWx1ZTogbW1bSGddIG5vdCBtbUhnXG4gIG1tSGc6IFwibW1bSGddXCIsXG4gIE1NSEc6IFwibW1bSGddXCIsXG4gIC8vIENvbW1vbiBDaGluZXNlICdubyB1bml0JyBwbGFjZWhvbGRlcnMgXHUyMTkyIGRyb3AgVUNVTSBjb2RlXG4gIFx1NzEyMTogbnVsbCxcbiAgXCJcIjogbnVsbCxcbiAgXCJcdTIwMTRcIjogbnVsbCxcbiAgXCItXCI6IG51bGwsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdG9VY3VtKHVuaXQ6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF1bml0KSByZXR1cm4gbnVsbDtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChVQ1VNX09WRVJSSURFUywgdW5pdCkpIHtcbiAgICByZXR1cm4gVUNVTV9PVkVSUklERVNbdW5pdF0gPz8gbnVsbDtcbiAgfVxuICByZXR1cm4gdW5pdDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFF1YW50aXR5IGJ1aWxkZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIG1ha2VRdWFudGl0eSh2YWx1ZTogbnVtYmVyLCB1bml0OiBzdHJpbmcpOiBRdWFudGl0eSB7XG4gIGNvbnN0IHE6IFF1YW50aXR5ID0geyB2YWx1ZSB9O1xuICBpZiAodW5pdCkge1xuICAgIHEudW5pdCA9IHVuaXQ7XG4gICAgcS5zeXN0ZW0gPSBVQ1VNX1NZU1RFTTtcbiAgICBxLmNvZGUgPSB1bml0O1xuICB9XG4gIHJldHVybiBxO1xufVxuXG5mdW5jdGlvbiB0cnlQYXJzZUZsb2F0KHM6IHN0cmluZyk6IG51bWJlciB8IG51bGwge1xuICBpZiAocyA9PT0gXCJcIiB8fCBzID09IG51bGwpIHJldHVybiBudWxsO1xuICAvLyBNaXJyb3IgUHl0aG9uJ3MgZmxvYXQoKSBcdTIwMTQgYWxsb3cgbGVhZGluZy90cmFpbGluZyB3aGl0ZXNwYWNlLFxuICAvLyBvcHRpb25hbCBzaWduLCBkZWNpbWFsLiBSZWplY3QgaWYgTmFOIE9SIGlmIGFueSBub24tbnVtZXJpYyByZXNpZHVhbFxuICAvLyAoTnVtYmVyKFwiMTJhYmNcIikgcmV0dXJucyBOYU4sIE9LOyBcIjEyICBhYmNcIiBhbHNvIE5hTiwgT0spLlxuICBjb25zdCB0cmltbWVkID0gcy50cmltKCk7XG4gIGlmICh0cmltbWVkID09PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbiA9IE51bWJlcih0cmltbWVkKTtcbiAgaWYgKE51bWJlci5pc05hTihuKSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBuO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgcGFyc2VSYW5nZU11bHRpIC8gcGFyc2VSYW5nZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBMaXN0IHZhcmlhbnQgb2YgcGFyc2VSYW5nZTogZW1pdHMgb25lIGVudHJ5IHBlciBzZXggd2hlbiB0aGUgcmFuZ2UgaXNcbiAqIHNleC1zdHJhdGlmaWVkIChcIltcdTc1Mzc6MTMuNyBcdTU5NzM6MTEuMV1bXHU3NTM3OjE3LjAgXHU1OTczOjE1LjBdXCIpLCBvdGhlcndpc2UgYVxuICogc2luZ2xlLWVsZW1lbnQgbGlzdC4gRWFjaCBlbnRyeSB0YWdnZWQgd2l0aCBhcHBsaWVzVG8gc28gZG93bnN0cmVhbVxuICogY29kZSBjYW4gcGljayB0aGUgcmlnaHQgb25lIGZvciB0aGUgcGF0aWVudCdzIHNleC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmFuZ2VNdWx0aShyYXdSYW5nZTogc3RyaW5nLCB1bml0OiBzdHJpbmcpOiBSYW5nZUVudHJ5W10ge1xuICBjb25zdCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKChyYXdSYW5nZSB8fCBcIlwiKS50cmltKCkpO1xuICBpZiAoIXMpIHJldHVybiBbXTtcblxuICBjb25zdCBsb3dCeVNleDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBjb25zdCBoaWdoQnlTZXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgbGV0IHVzZWRNdWx0aSA9IGZhbHNlO1xuXG4gIGNvbnN0IG0gPSBzLm1hdGNoKFJSX0xPV0hJR0hfQlJBQ0tFVFMpO1xuICBpZiAobSkge1xuICAgIGNvbnN0IGxvd0Jsb2IgPSBtWzFdID8/IFwiXCI7XG4gICAgY29uc3QgaGlnaEJsb2IgPSBtWzJdID8/IFwiXCI7XG4gICAgZm9yIChjb25zdCBzbSBvZiBsb3dCbG9iLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgIGlmIChzbVsxXSAmJiBzbVsyXSkgbG93QnlTZXhbc21bMV1dID0gc21bMl07XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc20gb2YgaGlnaEJsb2IubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgaWYgKHNtWzFdICYmIHNtWzJdKSBoaWdoQnlTZXhbc21bMV1dID0gc21bMl07XG4gICAgfVxuICAgIHVzZWRNdWx0aSA9IE9iamVjdC5rZXlzKGxvd0J5U2V4KS5sZW5ndGggPiAwIHx8IE9iamVjdC5rZXlzKGhpZ2hCeVNleCkubGVuZ3RoID4gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBTaW5nbGUtYnJhY2tldDogZWFjaCBwZXItc2V4IHZhbHVlJ3MgY29tcGFyYXRvciBkZWNpZGVzIGxvdyB2cyBoaWdoLlxuICAgIGNvbnN0IHNpbmdsZSA9IHMubWF0Y2goUlJfU0lOR0xFX0JSQUNLRVQpO1xuICAgIGlmIChzaW5nbGUpIHtcbiAgICAgIGNvbnN0IGlubmVyID0gc2luZ2xlWzFdID8/IFwiXCI7XG4gICAgICBmb3IgKGNvbnN0IHNtIG9mIGlubmVyLm1hdGNoQWxsKFJSX1NFWF9OVU1fRykpIHtcbiAgICAgICAgY29uc3Qgc2V4S2V5ID0gc21bMV0gPz8gXCJcIjtcbiAgICAgICAgY29uc3QgdmFsU3RyID0gc21bMl0gPz8gXCJcIjtcbiAgICAgICAgLy8gRmluZCB0aGUgY29tcGFyYXRvciBpbW1lZGlhdGVseSBwcmVjZWRpbmcgdGhpcyBudW1iZXIuXG4gICAgICAgIC8vIE1pcnJvciB0aGUgUHl0aG9uOiByZWJ1aWxkIGEgcGVyLXNleC1rZXkgc2VhcmNoLlxuICAgICAgICBjb25zdCBwYXQgPSBuZXcgUmVnRXhwKGAke2VzY2FwZVJlZ2V4KHNleEtleSl9XFxcXHMqWzpcdUZGMUFdP1xcXFxzKihbPD5cdTIyNjdcdTIyNjZdPT8pP1xcXFxzKi0/XFxcXGRgKTtcbiAgICAgICAgY29uc3QgY20gPSBpbm5lci5tYXRjaChwYXQpO1xuICAgICAgICBjb25zdCBvcCA9IGNtPy5bMV0gPz8gXCJcIjtcbiAgICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgICAgbG93QnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfSBlbHNlIGlmIChvcCA9PT0gXCI8XCIgfHwgb3AgPT09IFwiPD1cIikge1xuICAgICAgICAgIGhpZ2hCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvd0J5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHVzZWRNdWx0aSA9IE9iamVjdC5rZXlzKGxvd0J5U2V4KS5sZW5ndGggPiAwIHx8IE9iamVjdC5rZXlzKGhpZ2hCeVNleCkubGVuZ3RoID4gMDtcbiAgICB9XG4gIH1cblxuICBpZiAodXNlZE11bHRpKSB7XG4gICAgY29uc3QgZW50cmllczogUmFuZ2VFbnRyeVtdID0gW107XG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSB1bmlvbiBvZiBrZXlzIGFjdHVhbGx5IHNlZW4gXHUyMDE0IHByZXNlcnZlIGluc2VydGlvbiBvcmRlci5cbiAgICBjb25zdCBhbGxTZXhLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgayBvZiBbLi4uT2JqZWN0LmtleXMobG93QnlTZXgpLCAuLi5PYmplY3Qua2V5cyhoaWdoQnlTZXgpXSkge1xuICAgICAgaWYgKCFhbGxTZXhLZXlzLmluY2x1ZGVzKGspKSBhbGxTZXhLZXlzLnB1c2goayk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc2V4S2V5IG9mIGFsbFNleEtleXMpIHtcbiAgICAgIGNvbnN0IG1hcHBpbmcgPSBTRVhfVE9fRkhJUltzZXhLZXldO1xuICAgICAgaWYgKCFtYXBwaW5nKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IFtmaGlyQ29kZSwgZmhpckRpc3BsYXldID0gbWFwcGluZztcbiAgICAgIGNvbnN0IGVudHJ5OiBSYW5nZUVudHJ5ID0ge1xuICAgICAgICB0ZXh0OiByYXdSYW5nZSxcbiAgICAgICAgYXBwbGllc1RvOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL2hsNy5vcmcvZmhpci9hZG1pbmlzdHJhdGl2ZS1nZW5kZXJcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBmaGlyQ29kZSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmaGlyRGlzcGxheSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB0ZXh0OiBmaGlyRGlzcGxheSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfTtcbiAgICAgIGlmIChzZXhLZXkgaW4gbG93QnlTZXgpIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQobG93QnlTZXhbc2V4S2V5XSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfVxuICAgICAgaWYgKHNleEtleSBpbiBoaWdoQnlTZXgpIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQoaGlnaEJ5U2V4W3NleEtleV0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgICBlbnRyaWVzLnB1c2goZW50cnkpO1xuICAgIH1cbiAgICBpZiAoZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBEZS1kdXAgYnkgRkhJUiBzZXggY29kZSBpbiBjYXNlIGlucHV0IGhhcyBib3RoIFx1NzUzNyBhbmQgXHU3NTM3XHU2MDI3LlxuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgY29uc3Qgb3V0OiBSYW5nZUVudHJ5W10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgZSBvZiBlbnRyaWVzKSB7XG4gICAgICAgIGNvbnN0IGMgPSBlLmFwcGxpZXNUbz8uWzBdPy5jb2RpbmdbMF0/LmNvZGU7XG4gICAgICAgIGlmICghYyB8fCBzZWVuLmhhcyhjKSkgY29udGludWU7XG4gICAgICAgIHNlZW4uYWRkKGMpO1xuICAgICAgICBvdXQucHVzaChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb25lID0gcGFyc2VSYW5nZShyYXdSYW5nZSwgdW5pdCk7XG4gIHJldHVybiBvbmUgPyBbb25lXSA6IFtdO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSByZWZlcmVuY2UtcmFuZ2UgdGV4dCBpbnRvIGEgRkhJUiByZWZlcmVuY2VSYW5nZSBlbnRyeS5cbiAqXG4gKiBTdHJhdGVneSBpbiBvcmRlcjpcbiAqICAgMS4gXCJbbG93XVtoaWdoXVwiIGJyYWNrZXRlZCBmb3JtYXQgXHUyMDE0IE5ISSdzIGNhbm9uaWNhbCBzaGFwZS5cbiAqICAgMi4gXCIzLjg5LTI2LjhcIiAvIFwiMy44OX4yNi44XCIgZGFzaCByYW5nZS5cbiAqICAgMy4gXCI+IDQwXCIgLyBcIjwgMC41XCIgc2luZ2xlLXNpZGVkLlxuICogICA0LiBRdWFsaXRhdGl2ZSAoXCJOZWdhdGl2ZVwiLCBcIkFNIDg6MDAgNi4yLTE5LjRcIikgXHUyMDE0IHRleHQtb25seS5cbiAqXG4gKiBTZXgtc3RyYXRpZmllZCBzaGFwZXMgZ28gdGhyb3VnaCBwYXJzZVJhbmdlTXVsdGkuIFJldHVybnMgbnVsbCBvbmx5XG4gKiBmb3IgZW1wdHkgaW5wdXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlKHJhd1JhbmdlOiBzdHJpbmcsIHVuaXQ6IHN0cmluZyk6IFJhbmdlRW50cnkgfCBudWxsIHtcbiAgY29uc3QgcyA9IHRyYW5zbGF0ZUZ1bGx3aWR0aCgocmF3UmFuZ2UgfHwgXCJcIikudHJpbSgpKTtcbiAgaWYgKCFzKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZW50cnk6IFJhbmdlRW50cnkgPSB7IHRleHQ6IHJhd1JhbmdlIH07XG5cbiAgY29uc3QgbSA9IHMubWF0Y2goUlJfTE9XSElHSF9CUkFDS0VUUyk7XG4gIGlmIChtKSB7XG4gICAgY29uc3QgbG8gPSAobVsxXSA/PyBcIlwiKS50cmltKCk7XG4gICAgY29uc3QgaGkgPSAobVsyXSA/PyBcIlwiKS50cmltKCk7XG4gICAgZm9yIChjb25zdCBbc2lkZSwgc2lkZVZhbF0gb2YgW1xuICAgICAgW1wibG93XCIsIGxvXSxcbiAgICAgIFtcImhpZ2hcIiwgaGldLFxuICAgIF0gYXMgY29uc3QpIHtcbiAgICAgIGlmICghc2lkZVZhbCB8fCBzaWRlVmFsID09PSBcIlx1NzEyMVwiIHx8IHNpZGVWYWwgPT09IFwiXHU3QTdBXHU3NjdEXCIpIGNvbnRpbnVlO1xuXG4gICAgICAvLyAxLiBQbGFpbiBmbG9hdFxuICAgICAgY29uc3QgYXNGbG9hdCA9IHRyeVBhcnNlRmxvYXQoc2lkZVZhbCk7XG4gICAgICBpZiAoYXNGbG9hdCAhPT0gbnVsbCkge1xuICAgICAgICBlbnRyeVtzaWRlXSA9IG1ha2VRdWFudGl0eShhc0Zsb2F0LCB1bml0KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIDIuIERhc2ggcmFuZ2UgXHUyMDE0IG1lYW5pbmdmdWwgb25seSBmb3IgYGxvd2Agc2xvdDsgc3BsaXRzIGludG8gbG93K2hpZ2guXG4gICAgICBjb25zdCBkbSA9IHNpZGVWYWwubWF0Y2goUlJfREFTSF9SQU5HRSk7XG4gICAgICBpZiAoZG0gJiYgc2lkZSA9PT0gXCJsb3dcIiAmJiBlbnRyeS5oaWdoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgdjEgPSB0cnlQYXJzZUZsb2F0KGRtWzFdISk7XG4gICAgICAgIGNvbnN0IHYyID0gdHJ5UGFyc2VGbG9hdChkbVsyXSEpO1xuICAgICAgICBpZiAodjEgIT09IG51bGwgJiYgdjIgIT09IG51bGwpIHtcbiAgICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodjEsIHVuaXQpO1xuICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodjIsIHVuaXQpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDMuIENvbXBhcmF0b3IgKFx1MjI2NzYwLCA8PTAuMDQgZXRjLilcbiAgICAgIGNvbnN0IGNtID0gc2lkZVZhbC5tYXRjaChSUl9DT01QQVJBVE9SKTtcbiAgICAgIGlmIChjbSkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChjbVsyXSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IG9wID0gY21bMV07XG4gICAgICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgICAgICBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIFwiTm9ybWFsICggWCApXCIgLyBcIk5vbnJlYWN0aXZlICggWCApXCIgXHUyMDE0IFggaXMgdGhlIGN1dG9mZiAoaGlnaCBib3VuZCkuXG4gICAgICBjb25zdCBxbSA9IHNpZGVWYWwubWF0Y2goUlJfUVVBTElUQVRJVkVfUEFSRU4pO1xuICAgICAgaWYgKHFtKSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KHFtWzJdISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBjb25zdCBkYXNoTWF0Y2ggPSBzLm1hdGNoKFJSX0RBU0hfUkFOR0UpO1xuICBpZiAoZGFzaE1hdGNoKSB7XG4gICAgY29uc3QgdjEgPSB0cnlQYXJzZUZsb2F0KGRhc2hNYXRjaFsxXSEpO1xuICAgIGNvbnN0IHYyID0gdHJ5UGFyc2VGbG9hdChkYXNoTWF0Y2hbMl0hKTtcbiAgICBpZiAodjEgIT09IG51bGwgJiYgdjIgIT09IG51bGwpIHtcbiAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2MSwgdW5pdCk7XG4gICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYyLCB1bml0KTtcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgY29uc3QgY21wTWF0Y2ggPSBzLm1hdGNoKFJSX0NPTVBBUkFUT1IpO1xuICBpZiAoY21wTWF0Y2gpIHtcbiAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChjbXBNYXRjaFsyXSEpO1xuICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBvcCA9IGNtcE1hdGNoWzFdO1xuICAgICAgaWYgKG9wID09PSBcIj5cIiB8fCBvcCA9PT0gXCI+PVwiKSB7XG4gICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIC8vIEZhbGwgdGhyb3VnaDogcXVhbGl0YXRpdmUgb3IgY29tcGxleCBcdTIwMTQgdGV4dC1vbmx5IGlzIEZISVItY29ycmVjdC5cbiAgcmV0dXJuIGVudHJ5O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgdHJ5UGFyc2VRdWFudGl0eSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBQYXJzZSBcIj4gNDAuMFwiIC8gXCI8MC4wMTBcIiAvIFwiMSwyMzQuNVwiIFx1MjE5MiBGSElSIFF1YW50aXR5IHdpdGggY29tcGFyYXRvci5cbiAqIFJldHVybnMgbnVsbCB3aGVuIHRoZSByZXNpZHVhbCBhZnRlciBzdHJpcHBpbmcgYSBjb21wYXJhdG9yIHN0aWxsXG4gKiBpc24ndCBudW1lcmljIFx1MjAxNCBjYWxsZXIgZmFsbHMgYmFjayB0byB2YWx1ZVN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyeVBhcnNlUXVhbnRpdHkoXG4gIHJhd1ZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkLFxuICB1bml0OiBzdHJpbmcsXG4pOiBRdWFudGl0eSB8IG51bGwge1xuICBpZiAocmF3VmFsdWUgPT09IG51bGwgfHwgcmF3VmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XG4gIGxldCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKFN0cmluZyhyYXdWYWx1ZSkudHJpbSgpKTtcbiAgbGV0IGNvbXBhcmF0b3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjb25zdCBjbSA9IHMubWF0Y2goQ09NUEFSQVRPUl9SRSk7XG4gIGlmIChjbSkge1xuICAgIGNvbXBhcmF0b3IgPSBjbVsxXSA/PyBudWxsO1xuICAgIHMgPSAoY21bMl0gPz8gXCJcIikudHJpbSgpO1xuICB9XG4gIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KHMucmVwbGFjZSgvLC9nLCBcIlwiKSk7XG4gIGlmICh2ID09PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCB1Y3VtQ29kZSA9IHRvVWN1bSh1bml0KTtcbiAgY29uc3QgcXR5OiBRdWFudGl0eSA9IHtcbiAgICB2YWx1ZTogdixcbiAgICBzeXN0ZW06IFVDVU1fU1lTVEVNLFxuICB9O1xuICAvLyBRdWFudGl0eS51bml0IChodW1hbi1yZWFkYWJsZSkga2VlcHMgdGhlIG9yaWdpbmFsIE5ISSBsYWJlbCBzbyB1c2Vyc1xuICAvLyBzdGlsbCBzZWUgJ1x1RkYwNScgb3IgJ21FcS9MJyByYXcuIFF1YW50aXR5LmNvZGUgaXMgc3RyaWN0IFVDVU0gbWFjaGluZVxuICAvLyBjb2RlLiBEcm9wIHVuaXQgZGlzcGxheSB3aGVuIGVtcHR5IHNvIHdlIGRvbid0IGVtaXQgXCJ1bml0XCI6IFwiXCIuXG4gIGlmICh1bml0KSB7XG4gICAgcXR5LnVuaXQgPSB1bml0O1xuICB9XG4gIGlmICh1Y3VtQ29kZSAhPT0gbnVsbCkge1xuICAgIHF0eS5jb2RlID0gdWN1bUNvZGU7XG4gIH1cbiAgaWYgKGNvbXBhcmF0b3IpIHtcbiAgICBxdHkuY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gIH1cbiAgcmV0dXJuIHF0eTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cbiIsICIvKipcbiAqIE9ic2VydmF0aW9uIG1hcHBlciBcdTIwMTQgc2luZ2xlLXJvdyBhbmQgcGFuZWwtZ3JvdXBlZCB2YXJpYW50cy5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvb2JzZXJ2YXRpb24ucHlgICgxMjEyIGxpbmVzKS4gSW5jbHVkZXM6XG4gKiAgIC0gbWFwT2JzZXJ2YXRpb24ocmF3LCBwYXRpZW50SWQpIFx1MjE5MiBzaW5nbGUgT2JzZXJ2YXRpb25cbiAqICAgLSBtYXBPYnNlcnZhdGlvbnNHcm91cGVkKGl0ZW1zLCBwYXRpZW50SWQpIFx1MjE5MiBEaWFnbm9zdGljUmVwb3J0ICsgT2JzZXJ2YXRpb25zXG4gKiAgIC0gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXkpIFx1MjAxNCBjcm9zcy1wYWdlIGRlZHVwIGtleVxuICogICAtIGZpbmRMb2luYywgYnVpbGRDb2RpbmdzLCBtYXBJbnRlcnByZXRhdGlvbiwgZGVyaXZlSW50ZXJwcmV0YXRpb25cbiAqICAgLSBkZWR1cGVDcm9zc0Zvcm1hdCwgY29tYmluZUJwSXRlbXMsIGdyb3VwQnlPcmRlckNvZGVcbiAqICAgLSBpbmZlclNwZWNpbWVuXG4gKlxuICogRnVuY3Rpb25hbCBwYXJpdHkgd2l0aCB0aGUgUHl0aG9uIGltcGxlbWVudGF0aW9uIGlzIHRoZSBnb2FsLiBGaWVsZFxuICogb3JkZXIgaW4gdGhlIGVtaXR0ZWQgcmVzb3VyY2VzIG1heSBkaWZmZXIgKEpTIG9iamVjdCBsaXRlcmFsIG9yZGVyKVxuICogYnV0IGNvbnRlbnQgaXMgaWRlbnRpY2FsLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQge1xuICBESVNQTEFZX0ZJUlNUX0NPREVTLFxuICBMT0lOQ19ESVNQTEFZLFxuICBMT0lOQ19NQVAsXG4gIE5ISV9UT19MT0lOQyxcbiAgUEFORUxfTE9JTkNfTUFQLFxufSBmcm9tIFwiLi9sb2luYy10YWJsZXNcIjtcbmltcG9ydCB7XG4gIHR5cGUgUXVhbnRpdHksXG4gIHR5cGUgUmFuZ2VFbnRyeSxcbiAgcGFyc2VSYW5nZSxcbiAgcGFyc2VSYW5nZU11bHRpLFxuICB0b1VjdW0sXG4gIHRyeVBhcnNlUXVhbnRpdHksXG59IGZyb20gXCIuL3BhcnNlcnNcIjtcblxuLy8gXHUyNTAwXHUyNTAwIEltYWdpbmcgZGV0ZWN0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBJTUFHSU5HX0tFWVdPUkRTOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBbXG4gIFwidWx0cmFzb3VuZFwiLFxuICBcInNvbm9ncmFtXCIsXG4gIFwic29ub2dyYXBoeVwiLFxuICBcImVjaG9cIixcbiAgXCJjdCBcIixcbiAgXCJjdC9cIixcbiAgXCJjdC1cIixcbiAgXCJjb21wdXRlZCB0b21vZ3JhcGh5XCIsXG4gIFwibXJpXCIsXG4gIFwibWFnbmV0aWMgcmVzb25hbmNlXCIsXG4gIFwieC1yYXlcIixcbiAgXCJ4cmF5XCIsXG4gIFwieCByYXlcIixcbiAgXCJtYW1tb2dyYXBoeVwiLFxuICBcIm1hbW1vXCIsXG4gIFwiZWtnXCIsXG4gIFwiZWNnXCIsXG4gIFwiZWxlY3Ryb2NhcmRpb2dyYW1cIixcbiAgXCJlbmRvc2NvcFwiLFxuICBcImNvbG9ub3Njb3BcIixcbiAgXCJnYXN0cm9zY29wXCIsXG4gIFwiYnJvbmNob3Njb3BcIixcbiAgXCJwZXQvY3RcIixcbiAgXCJwZXQgXCIsXG4gIFwic3BlY3RcIixcbiAgXCJcdTVGNzFcdTUwQ0ZcIixcbiAgXCJcdThEODVcdTk3RjNcdTZDRTJcIixcbiAgXCJcdTk2RkJcdTgxNjZcdTY1QjdcdTVDNjRcIixcbiAgXCJcdTY4MzhcdTc4QzFcdTUxNzFcdTYzMkZcIixcbiAgXCJcdTVGQzNcdTk2RkJcdTU3MTZcIixcbiAgXCJcdTUxNjdcdTg5OTZcdTkzRTFcIixcbiAgXCJcdTRFNzNcdTYyM0ZcdTY1MURcdTVGNzFcIixcbl07XG5cbmZ1bmN0aW9uIGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheTogc3RyaW5nLCBjb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgaGF5c3RhY2sgPSBgJHtkaXNwbGF5fSAke2NvZGV9YC50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gSU1BR0lOR19LRVlXT1JEUy5zb21lKChrdykgPT4gaGF5c3RhY2suaW5jbHVkZXMoa3cpKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExPSU5DIGxvb2t1cCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgTkhJX0xBQl9DT0RFX1JFID0gL15cXGR7NCw2fVtBLVpdJC87XG5cbmZ1bmN0aW9uIGlzQXNjaWlPbmx5KHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocy5jaGFyQ29kZUF0KGkpID4gMTI3KSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cblxuLy8gQ2hlY2sgd2hldGhlciBhIHNpbmdsZSBMT0lOQ19NQVAga2V5IG1hdGNoZXMgdGhlIGxhYidzIGNvbWJpbmVkXG4vLyAoY29kZSArIGRpc3BsYXkpIHN0cmluZy4gVHdvIHJ1bGVzOlxuLy9cbi8vIDEuIEFTQ0lJIGtleXM6IGBcXGI8a2V5PlxcYmAgXHUyMDE0IHdvcmQgYm91bmRhcmllcyBvbiBCT1RIIHNpZGVzLiBUaGVcbi8vICAgIG5vLXRyYWlsaW5nLWJvdW5kYXJ5IHNlbWFudGljIG9mIHRoZSBvbGRlciBgXFxiPGtleT5gIG1hdGNoZXJcbi8vICAgIGNhdXNlZCBzaG9ydCBrZXlzIGxpa2UgXCJoYlwiIChIZW1vZ2xvYmluKSB0byBpbmNvcnJlY3RseSBtYXRjaFxuLy8gICAgbG9uZ2VyIHRlcm1zIGxpa2UgXCJoYnNhZ1wiIChIQnNBZykgYW5kIFwicGhvc3BoYXRlXCIgKG1hdGNoZWQgYnlcbi8vICAgIFwicGhcIikuIFJlcXVpcmluZyBhbiBlbmQgYm91bmRhcnkgbWVhbnMgXCJoYlwiIG9ubHkgbWF0Y2hlcyB3aGVuXG4vLyAgICBpdCBzdGFuZHMgYXMgaXRzIG93biB3b3JkLlxuLy9cbi8vIDIuIENKSyAvIG5vbi1BU0NJSSBrZXlzOiBwbGFpbiBzdWJzdHJpbmcgaW5jbHVkZXMoKS4gXFxiIGRvZXNuJ3Rcbi8vICAgIHNlbWFudGljYWxseSB3b3JrIGZvciBDSksgKG5vIHdvcmQtY2hhcmFjdGVyIGNsYXNzIGNvbmNlcHQpLlxuZnVuY3Rpb24gX2tleXdvcmRNYXRjaGVzKGtleTogc3RyaW5nLCBjb21iaW5lZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGsgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGlzQXNjaWlPbmx5KGtleSkpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGspfVxcXFxiYCkudGVzdChjb21iaW5lZCk7XG4gIH1cbiAgcmV0dXJuIGNvbWJpbmVkLmluY2x1ZGVzKGspO1xufVxuXG4vLyBQaWNrIHRoZSBMT05HRVNUIG1hdGNoaW5nIGtleSBmcm9tIHRoZSB0YWJsZSwgbm90IHRoZSBmaXJzdC4gQXZvaWRzXG4vLyB0aGUgc2FtZSBidWcgZmFtaWx5IGZyb20gYSBzZWNvbmQgYW5nbGU6IGh5cGhlbmF0ZWQga2V5cyBsaWtlXG4vLyBcImxkbC1jaG9sZXN0ZXJvbFwiIHNoYXJlIGEgYFxcYi4uLlxcYmAgYm91bmRhcnkgYXQgdGhlIGh5cGhlbiwgc28gXCJsZGxcIlxuLy8gKDMgY2hhcnMpIGFsc28gbWF0Y2hlcyBhIFwibGRsLWNob2xlc3Rlcm9sXCIgc3RyaW5nLiBMb25nZXN0LW1hdGNoXG4vLyBtYWtlcyB0aGUgbW9yZSBzcGVjaWZpYyBrZXkgd2luIHJlZ2FyZGxlc3Mgb2YgaW5zZXJ0aW9uIG9yZGVyLCBzb1xuLy8gdGhlIGJyaXR0bGUgXCJsb25nIG11c3QgYXBwZWFyIGJlZm9yZSBzaG9ydFwiIGNvbW1lbnRzIHNjYXR0ZXJlZFxuLy8gdGhyb3VnaCBMT0lOQ19NQVAgYmVjb21lIHVubmVjZXNzYXJ5LlxuZnVuY3Rpb24gX2ZpbmRMb25nZXN0TWF0Y2goXG4gIGNvbWJpbmVkOiBzdHJpbmcsXG4gIHRhYmxlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGxldCBiZXN0TG9pbmM6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgYmVzdEtleUxlbiA9IDA7XG4gIGZvciAoY29uc3QgW2tleSwgbG9pbmNdIG9mIE9iamVjdC5lbnRyaWVzKHRhYmxlKSkge1xuICAgIGlmIChrZXkubGVuZ3RoID4gYmVzdEtleUxlbiAmJiBfa2V5d29yZE1hdGNoZXMoa2V5LCBjb21iaW5lZCkpIHtcbiAgICAgIGJlc3RMb2luYyA9IGxvaW5jO1xuICAgICAgYmVzdEtleUxlbiA9IGtleS5sZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiBiZXN0TG9pbmM7XG59XG5cbi8qKlxuICogUmV0dXJuIHByaW1hcnkgTE9JTkMgZm9yIHRoaXMgbGFiLiBQYW5lbC1hd2FyZSBsb29rdXA6XG4gKiAgIEEuIFNpbmdsZS10ZXN0IE5ISSBjb2RlIFx1MjE5MiB1c2UgTkhJX1RPX0xPSU5DIGRpcmVjdGx5LlxuICogICBCLiBQYW5lbCBjb2RlIE9SIHVua25vd24gY29kZSBcdTIxOTIgd2FsayBMT0lOQ19NQVAgYnkgZGlzcGxheSBrZXl3b3JkXG4gKiAgICAgIChsb25nZXN0LWtleSBtYXRjaCB3aW5zLCBib3RoLXNpZGUgd29yZCBib3VuZGFyaWVzIGVuZm9yY2VkKS5cbiAqICAgQy4gRmFsbGJhY2s6IHBhbmVsLWxldmVsIExPSU5DIGZyb20gTkhJX1RPX0xPSU5DIGlmIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMb2luYyhjb2RlOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAvLyBBLiBTaW5nbGUtdGVzdCBOSEkgY29kZSB3aW5zIG91dHJpZ2h0LlxuICBpZiAoY29kZSAmJiBjb2RlIGluIE5ISV9UT19MT0lOQyAmJiAhRElTUExBWV9GSVJTVF9DT0RFUy5oYXMoY29kZSkpIHtcbiAgICByZXR1cm4gTkhJX1RPX0xPSU5DW2NvZGVdID8/IG51bGw7XG4gIH1cblxuICBjb25zdCBjb21iaW5lZCA9IGAke2NvZGV9ICR7ZGlzcGxheX1gLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gQjEuIFBhbmVsLXNwZWNpZmljIGtleXdvcmQgbWFwIHJ1bnMgQkVGT1JFIHRoZSBnbG9iYWwgb25lLlxuICBpZiAoY29kZSBpbiBQQU5FTF9MT0lOQ19NQVApIHtcbiAgICBjb25zdCBoaXQgPSBfZmluZExvbmdlc3RNYXRjaChjb21iaW5lZCwgUEFORUxfTE9JTkNfTUFQW2NvZGVdISk7XG4gICAgaWYgKGhpdCkgcmV0dXJuIGhpdDtcbiAgfVxuXG4gIC8vIEIuIERpc3BsYXkta2V5d29yZCBzZWFyY2guXG4gIGNvbnN0IGhpdCA9IF9maW5kTG9uZ2VzdE1hdGNoKGNvbWJpbmVkLCBMT0lOQ19NQVApO1xuICBpZiAoaGl0KSByZXR1cm4gaGl0O1xuXG4gIC8vIEMuIFBhbmVsIGNvZGUgd2l0aCBubyByZWNvZ25pc2VkIGl0ZW0gZGlzcGxheSBcdTIxOTIgZmFsbCBiYWNrLlxuICBpZiAoY29kZSAmJiBjb2RlIGluIE5ISV9UT19MT0lOQykge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBCdWlsZCB0aGUgT2JzZXJ2YXRpb24uY29kZS5jb2RpbmdbXSBsaXN0LlxuICogUHJpb3JpdHk6IExPSU5DIFx1MjE5MiBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBsb2NhbCBmYWxsYmFjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29kaW5ncyhcbiAgY29kZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgZGlzcGxheTogc3RyaW5nLFxuICBsb2luYzogc3RyaW5nIHwgbnVsbCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5bXSB7XG4gIGNvbnN0IGNvZGluZ3M6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5bXSA9IFtdO1xuICBpZiAobG9pbmMpIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgIGNvZGU6IGxvaW5jLFxuICAgICAgZGlzcGxheTogTE9JTkNfRElTUExBWVtsb2luY10gPz8gZGlzcGxheSxcbiAgICB9KTtcbiAgfVxuICBjb25zdCBjb2RlU3RyID0gKGNvZGUgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoY29kZVN0ciAmJiBOSElfTEFCX0NPREVfUkUudGVzdChjb2RlU3RyKSkge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERSxcbiAgICAgIGNvZGU6IGNvZGVTdHIsXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IHN5c3RlbXMuSElTX0xPQ0FMX0xBQl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0ciB8fCBkaXNwbGF5LFxuICAgICAgZGlzcGxheSxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gY29kaW5ncztcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEludGVycHJldGF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBJTlRFUlBfU1lTID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YzLU9ic2VydmF0aW9uSW50ZXJwcmV0YXRpb25cIjtcblxuZnVuY3Rpb24gaW50ZXJwQ29kaW5nKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gIHJldHVybiB7IHN5c3RlbTogSU5URVJQX1NZUywgY29kZSwgZGlzcGxheSB9O1xufVxuXG5jb25zdCBJTlRFUlBfVEFCTEU6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBoaWdoOiBbXCJIXCIsIFwiSGlnaFwiXSxcbiAgbG93OiBbXCJMXCIsIFwiTG93XCJdLFxuICBub3JtYWw6IFtcIk5cIiwgXCJOb3JtYWxcIl0sXG4gIGNyaXRpY2FsOiBbXCJBQVwiLCBcIkNyaXRpY2FsIGFibm9ybWFsXCJdLFxuICBhYm5vcm1hbDogW1wiQVwiLCBcIkFibm9ybWFsXCJdLFxuICBwb3NpdGl2ZTogW1wiUE9TXCIsIFwiUG9zaXRpdmVcIl0sXG4gIG5lZ2F0aXZlOiBbXCJORUdcIiwgXCJOZWdhdGl2ZVwiXSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBJbnRlcnByZXRhdGlvbihcbiAgaW50ZXJwOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICBjb25zdCBrZXkgPSAoaW50ZXJwID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGVudHJ5ID0gSU5URVJQX1RBQkxFW2tleV07XG4gIGlmICghZW50cnkpIHJldHVybiBudWxsO1xuICByZXR1cm4gaW50ZXJwQ29kaW5nKGVudHJ5WzBdLCBlbnRyeVsxXSk7XG59XG5cbi8vIFBvc2l0aXZlIG1hcmtlcnMgXHUyMDE0IFwidGhpcyBpcyBkZXRlY3RlZCAvIGFibm9ybWFsXCIuXG5jb25zdCBQT1NfTUFSS0VSUyA9XG4gIC9eXFxzKig/OnBvc2l0aXZlfHBvc3xyZWFjdGl2ZXxkZXRlY3RlZHxhYm5vcm1hbHxwcmVzZW50fHRyYWNlfFsxLTRdP1xccypcXCsoPzpcXHMqW1xcK1xcLV0pKilcXHMqKD86XFwoLipcXCkpP1xccyokL2k7XG5cbi8vIE5lZ2F0aXZlIG1hcmtlcnMgXHUyMDE0IGV4cGxpY2l0bHkgbm9ybWFsL2Fic2VudC5cbmNvbnN0IE5FR19NQVJLRVJTID1cbiAgL15cXHMqKD86bmVnYXRpdmV8bmVnfG5vbnJlYWN0aXZlfG5vblstXFxzXT9yZWFjdGl2ZXxub3RbLVxcc10/ZGV0ZWN0ZWR8bmR8YWJzZW50fG5vbmV8bm9ybWFsfDB8Wy1cdTIwMTRcdTIwMTNdKylcXHMqKD86XFwoLipcXCkpP1xccyokL2k7XG5cbmZ1bmN0aW9uIGNsYXNzaWZ5UXVhbGl0YXRpdmUodGV4dDogdW5rbm93bik6IFwicG9zXCIgfCBcIm5lZ1wiIHwgbnVsbCB7XG4gIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XG4gIGxldCBzID0gU3RyaW5nKHRleHQpLnRyaW0oKTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcIltcIikgJiYgcy5lbmRzV2l0aChcIl1cIikpIHtcbiAgICBzID0gcy5zbGljZSgxLCAtMSkudHJpbSgpO1xuICB9XG4gIGlmICghcykgcmV0dXJuIG51bGw7XG4gIGlmIChORUdfTUFSS0VSUy50ZXN0KHMpKSByZXR1cm4gXCJuZWdcIjtcbiAgaWYgKFBPU19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcInBvc1wiO1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZUludGVycHJldGF0aW9uKFxuICB2YWx1ZVJhdzogc3RyaW5nLFxuICBxdHk6IFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICBycjogUmFuZ2VFbnRyeSB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgLy8gMS4gTnVtZXJpYyBwYXRoLlxuICBpZiAocXR5ICYmIHR5cGVvZiBxdHkudmFsdWUgPT09IFwibnVtYmVyXCIgJiYgcnIpIHtcbiAgICBjb25zdCB2ID0gcXR5LnZhbHVlO1xuICAgIGNvbnN0IGxvID0gcnIubG93Py52YWx1ZTtcbiAgICBjb25zdCBoaSA9IHJyLmhpZ2g/LnZhbHVlO1xuICAgIGlmICh0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIgJiYgdiA+IGhpKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiSFwiLCBcIkhpZ2hcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiAmJiB2IDwgbG8pIHJldHVybiBpbnRlcnBDb2RpbmcoXCJMXCIsIFwiTG93XCIpO1xuICAgIGlmICh0eXBlb2YgbG8gPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGhpID09PSBcIm51bWJlclwiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTlwiLCBcIk5vcm1hbFwiKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIDIuIFF1YWxpdGF0aXZlIHBhdGguXG4gIGNvbnN0IHZhbEtpbmQgPSBjbGFzc2lmeVF1YWxpdGF0aXZlKHZhbHVlUmF3KTtcbiAgY29uc3QgcmVmVGV4dCA9IHJyPy50ZXh0ID8/IFwiXCI7XG4gIGNvbnN0IHJlZktpbmQgPSBjbGFzc2lmeVF1YWxpdGF0aXZlKHJlZlRleHQpO1xuICBpZiAodmFsS2luZCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIGlmIChyZWZLaW5kID09PSBcIm5lZ1wiKSB7XG4gICAgaWYgKHZhbEtpbmQgPT09IFwicG9zXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJBXCIsIFwiQWJub3JtYWxcIik7XG4gICAgaWYgKHZhbEtpbmQgPT09IFwibmVnXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICB9XG4gIHJldHVybiB2YWxLaW5kID09PSBcInBvc1wiID8gaW50ZXJwQ29kaW5nKFwiUE9TXCIsIFwiUG9zaXRpdmVcIikgOiBpbnRlcnBDb2RpbmcoXCJORUdcIiwgXCJOZWdhdGl2ZVwiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENhbm9uaWNhbCBsYWIga2V5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBMQUJfU1lOT05ZTVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIERpYWJldGVzXG4gIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTgyNzJcdTdEMjA6IFwiSEJBMUNcIixcbiAgXHU3Q0Q2XHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFwiR0xZQ0FURUQgSEVNT0dMT0JJTlwiOiBcIkhCQTFDXCIsXG4gIEhCQTFDOiBcIkhCQTFDXCIsXG4gIEExQzogXCJIQkExQ1wiLFxuICBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDY6IFwiR0xVQ09TRV9GQVNUSU5HXCIsXG4gIFwiRkFTVElORyBHTFVDT1NFXCI6IFwiR0xVQ09TRV9GQVNUSU5HXCIsXG4gIFx1ODQ2MVx1ODQwNFx1N0NENjogXCJHTFVDT1NFXCIsXG4gIFx1ODg0MFx1N0NENjogXCJHTFVDT1NFXCIsXG4gIEdMVUNPU0U6IFwiR0xVQ09TRVwiLFxuICAvLyBDQkNcbiAgXHU3NjdEXHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4OiBcIldCQ1wiLFxuICBcdTc2N0RcdTg4NDBcdTc0MDM6IFwiV0JDXCIsXG4gIFdCQzogXCJXQkNcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4OiBcIlJCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDM6IFwiUkJDXCIsXG4gIFJCQzogXCJSQkNcIixcbiAgXHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhFTU9HTE9CSU5cIixcbiAgSEVNT0dMT0JJTjogXCJIRU1PR0xPQklOXCIsXG4gIEhHQjogXCJIRU1PR0xPQklOXCIsXG4gIFx1ODg0MFx1NUJCOVx1N0E0RFx1NkJENDogXCJIRU1BVE9DUklUXCIsXG4gIEhFTUFUT0NSSVQ6IFwiSEVNQVRPQ1JJVFwiLFxuICBIQ1Q6IFwiSEVNQVRPQ1JJVFwiLFxuICBcdTg4NDBcdTVDMEZcdTY3N0Y6IFwiUExBVEVMRVRcIixcbiAgUExBVEVMRVQ6IFwiUExBVEVMRVRcIixcbiAgUExUOiBcIlBMQVRFTEVUXCIsXG4gIC8vIENCQyBpbmRpY2VzICgxMC1jaGFyIGFuZCA3LWNoYXIgQ0pLIGZvcm1zIGJlYXQgYmFyZSBcdTdEMDVcdTg4NDBcdTc0MDMpXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMFx1NkZDM1x1NUVBNjogXCJNQ0hDXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMDogXCJNQ0hcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU5QUQ0XHU3QTREOiBcIk1DVlwiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdTUyMDZcdTVFMDNcdTVCRUNcdTVFQTY6IFwiUkRXXCIsXG4gIE1DVjogXCJNQ1ZcIixcbiAgTUNIOiBcIk1DSFwiLFxuICBNQ0hDOiBcIk1DSENcIixcbiAgUkRXOiBcIlJEV1wiLFxuICAvLyBDQkMgZGlmZmVyZW50aWFsXG4gIFx1NTVEQ1x1NEUyRFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJORVVUUk9QSElMXCIsXG4gIFx1NTVEQ1x1NEYwQVx1N0QwNVx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJFT1NJTk9QSElMXCIsXG4gIFx1NTVEQ1x1OTE3OFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJFT1NJTk9QSElMXCIsXG4gIFx1NTVEQ1x1OUU3Q1x1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJCQVNPUEhJTFwiLFxuICBcdTZEQ0JcdTVERjRcdTc0MDM6IFwiTFlNUEhPQ1lURVwiLFxuICBcdTU1QUVcdTY4MzhcdTc0MDM6IFwiTU9OT0NZVEVcIixcbiAgRU9TSU5PUEhJTFM6IFwiRU9TSU5PUEhJTFwiLFxuICBFT1NJTk9QSElMOiBcIkVPU0lOT1BISUxcIixcbiAgTkVVVFJPUEhJTFM6IFwiTkVVVFJPUEhJTFwiLFxuICBORVVUUk9QSElMOiBcIk5FVVRST1BISUxcIixcbiAgQkFTT1BISUxTOiBcIkJBU09QSElMXCIsXG4gIEJBU09QSElMOiBcIkJBU09QSElMXCIsXG4gIExZTVBIT0NZVEVTOiBcIkxZTVBIT0NZVEVcIixcbiAgTFlNUEhPQ1lURTogXCJMWU1QSE9DWVRFXCIsXG4gIE1PTk9DWVRFUzogXCJNT05PQ1lURVwiLFxuICBNT05PQ1lURTogXCJNT05PQ1lURVwiLFxuICAvLyBMaXBpZCBcdTIwMTQgTERML0hETCBtdXN0IHByZWNlZGUgYmFyZSBDSE9MRVNURVJPTC5cbiAgXCJMREwgQ0hPTEVTVEVST0xcIjogXCJMRExfQ1wiLFxuICBcIkxETC1DSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiSERMIENIT0xFU1RFUk9MXCI6IFwiSERMX0NcIixcbiAgXCJIREwtQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiTERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU4ODQwXHU2RTA1XHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlQtQ0hPTEVTVEVST0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlQtQ0hPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVE9UQUwgQ0hPTEVTVEVST0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBDSE9MRVNURVJPTDogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBDSE9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFx1NEUwOVx1OTE3OFx1NzUxOFx1NkNCOVx1OTE2RjogXCJUUklHTFlDRVJJREVcIixcbiAgVFJJR0xZQ0VSSURFOiBcIlRSSUdMWUNFUklERVwiLFxuICBcIkhETC1DXCI6IFwiSERMX0NcIixcbiAgSERMOiBcIkhETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RDogXCJIRExfQ1wiLFxuICBcIkxETC1DKERJUkVDVClcIjogXCJMRExfQ1wiLFxuICBcIkxETC1DXCI6IFwiTERMX0NcIixcbiAgTERMOiBcIkxETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RDogXCJMRExfQ1wiLFxuICAvLyBSZW5hbCBcdTIwMTQgdXJpbmUgY3JlYXRpbmluZSB2YXJpYW50cyBiZWZvcmUgc2VydW0uXG4gIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MDogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVVJJTkUgQ1JFQVRJTklORVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKFUpXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUtVVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBKFUpXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEtVVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVLUNSRVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVLUNSRUFcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFx1ODA4Q1x1OTE3OFx1OTE1MDogXCJDUkVBVElOSU5FXCIsXG4gIFx1ODA4Q1x1OTE1MFx1OTE3ODogXCJDUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORShCKVwiOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQVRJTklORTogXCJDUkVBVElOSU5FXCIsXG4gIENSRUE6IFwiQ1JFQVRJTklORVwiLFxuICBDUlROOiBcIkNSRUFUSU5JTkVcIixcbiAgRUdGUjogXCJFR0ZSXCIsXG4gIFx1NUMzRlx1N0QyMFx1NkMyRTogXCJCVU5cIixcbiAgQlVOOiBcIkJVTlwiLFxuICBcdTVDM0ZcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU1QzNGXHU2REIyXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlVSSU5FX1BIXCIsXG4gIFx1OTE3OFx1OUU3Q1x1NUVBNjogXCJQSFwiLFxuICBcdTVDM0ZcdTkxNzg6IFwiVVJJQ19BQ0lEXCIsXG4gIFwiVVJJQyBBQ0lEXCI6IFwiVVJJQ19BQ0lEXCIsXG4gIFVSSUNfQUNJRDogXCJVUklDX0FDSURcIixcbiAgLy8gTGl2ZXJcbiAgQVNUOiBcIkFTVFwiLFxuICBBTFQ6IFwiQUxUXCIsXG4gIEdPVDogXCJBU1RcIixcbiAgR1BUOiBcIkFMVFwiLFxuICBcdTgxQkRcdTdEMDVcdTdEMjA6IFwiQklMSVJVQklOXCIsXG4gIEJJTElSVUJJTjogXCJCSUxJUlVCSU5cIixcbiAgXHU3NjdEXHU4NkNCXHU3NjdEOiBcIkFMQlVNSU5cIixcbiAgQUxCVU1JTjogXCJBTEJVTUlOXCIsXG4gIC8vIENhcmRpYWNcbiAgXHU1RkMzXHU4MDhDXHU2NUNCXHU4RjQ5XHU4NkNCXHU3NjdEOiBcIlRST1BPTklOXCIsXG4gIFRST1BPTklOOiBcIlRST1BPTklOXCIsXG4gIEJOUDogXCJCTlBcIixcbiAgXHU1RkMzXHU4MURGOiBcIlRST1BPTklOXCIsXG4gIC8vIFRoeXJvaWRcbiAgXHU3NTMyXHU3MkMwXHU4MTdBXHU1MjNBXHU2RkMwXHU3RDIwOiBcIlRTSFwiLFxuICBUU0g6IFwiVFNIXCIsXG4gIFx1NkUzOFx1OTZFMlx1NzUzMlx1NzJDMFx1ODE3QVx1N0QyMDogXCJGUkVFX1Q0XCIsXG4gIFwiRlJFRSBUNFwiOiBcIkZSRUVfVDRcIixcbiAgRlQ0OiBcIkZSRUVfVDRcIixcbiAgLy8gTWlzY1xuICBDXHU1M0NEXHU2MUM5XHU2MDI3XHU4NkNCXHU3NjdEOiBcIkNSUFwiLFxuICBcIkMtUkVBQ1RJVkUgUFJPVEVJTlwiOiBcIkNSUFwiLFxuICBDUlA6IFwiQ1JQXCIsXG4gIFwiSFMtQ1JQXCI6IFwiSFNfQ1JQXCIsXG4gIFx1NjUxRFx1OEI3N1x1ODE3QVx1NzI3OVx1NzU3MFx1NjI5N1x1NTM5RjogXCJQU0FcIixcbiAgUFNBOiBcIlBTQVwiLFxuICBcdTk0MzVcdTg2Q0JcdTc2N0Q6IFwiRkVSUklUSU5cIixcbiAgRkVSUklUSU46IFwiRkVSUklUSU5cIixcbiAgXHU4NDQ5XHU5MTc4OiBcIkZPTEFURVwiLFxuICBGT0xBVEU6IFwiRk9MQVRFXCIsXG4gIFx1N0RBRFx1NzUxRlx1N0QyMEIxMjogXCJWSVRBTUlOX0IxMlwiLFxuICBcIlZJVCBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcIlZJVEFNSU4gQjEyXCI6IFwiVklUQU1JTl9CMTJcIixcbiAgXHU3NkFFXHU4Q0VBXHU3RDIwOiBcIkNPUlRJU09MXCIsXG4gIENPUlRJU09MOiBcIkNPUlRJU09MXCIsXG4gIFx1Njg4NVx1NkJEMjogXCJSUFJcIixcbiAgUlBSOiBcIlJQUlwiLFxuICBcdTk2QjFcdTc0MDNcdTgzQ0NcdTYyOTdcdTUzOUY6IFwiQ1JZUFRPQ09DQ0FMX0FHXCIsXG4gIENSWVBBRzogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgXHU4ODQwXHU2QzI4OiBcIkFNTU9OSUFcIixcbiAgQU1NT05JQTogXCJBTU1PTklBXCIsXG4gIFx1NTFERFx1ODg0MFx1OTE3Nlx1NTM5Rlx1NjY0Mlx1OTU5MzogXCJQVFwiLFxuICBBUFRUOiBcIkFQVFRcIixcbiAgSU5SOiBcIklOUlwiLFxufTtcblxuLy8gUHJlLXNvcnQga2V5cyBsb25nZXN0LWZpcnN0IHNvIGxvbmdlci9tb3JlLXNwZWNpZmljIG1hdGNoZXMgd2luLlxuY29uc3QgTEFCX1NZTk9OWU1fS0VZU19TT1JURUQgPSBPYmplY3Qua2V5cyhMQUJfU1lOT05ZTVMpLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpO1xuXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWRpc3BsYXkpIHJldHVybiBcIlwiO1xuICBjb25zdCBzID0gZGlzcGxheS50cmltKCk7XG4gIGlmICghcykgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHNVcHBlciA9IHMudG9VcHBlckNhc2UoKTtcbiAgZm9yIChjb25zdCBrZXkgb2YgTEFCX1NZTk9OWU1fS0VZU19TT1JURUQpIHtcbiAgICBjb25zdCBrdSA9IGtleS50b1VwcGVyQ2FzZSgpO1xuICAgIGlmIChpc0FzY2lpT25seShrdSkpIHtcbiAgICAgIC8vIExlYWRpbmcgd29yZC1ib3VuZGFyeSBvbmx5IFx1MjAxNCBcIkFTVFwiIGluc2lkZSBcIkRJQVNUT0xJQ1wiIHNob3VsZCBub3QgbWF0Y2guXG4gICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGt1KX1gKS50ZXN0KHNVcHBlcikpIHtcbiAgICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNVcHBlci5pbmNsdWRlcyhrdSkpIHtcbiAgICAgIHJldHVybiBMQUJfU1lOT05ZTVNba2V5XSE7XG4gICAgfVxuICB9XG4gIHJldHVybiBzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGFuZWwgZ3JvdXBpbmcgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gY2prQ2hhcnMoczogc3RyaW5nKTogbnVtYmVyIHtcbiAgaWYgKCFzKSByZXR1cm4gMDtcbiAgbGV0IG4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIHtcbiAgICBjb25zdCBjcCA9IGNoLmNvZGVQb2ludEF0KDApID8/IDA7XG4gICAgaWYgKGNwID49IDB4NGUwMCAmJiBjcCA8PSAweDlmZmYpIG4rKztcbiAgfVxuICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gaXNFbmdsaXNoRG9taW5hbnQoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGxldCBsYXRpbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY2hhckNvZGVBdCgwKTtcbiAgICBpZiAoY3AgPCAxMjggJiYgL1tBLVphLXpdLy50ZXN0KGNoKSkgbGF0aW4rKztcbiAgfVxuICByZXR1cm4gbGF0aW4gPj0gMiAmJiBjamtDaGFycyhzKSA9PT0gMDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWVGb3JEZWR1cCh2OiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgbGV0IHMgPSBTdHJpbmcodikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIHMgPSBzLnJlcGxhY2UoL1xcKFteKV0qXFwpL2csIFwiXCIpLnRyaW0oKTtcbiAgcyA9IHMucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gIHJldHVybiBzO1xufVxuXG5mdW5jdGlvbiBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4ge1xuICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBzID0gU3RyaW5nKHZhbHVlKS50cmltKCk7XG4gIHJldHVybiBzICE9PSBcIlwiICYmIHMgIT09IFwiXHUyMDE0XCIgJiYgcyAhPT0gXCItXCIgJiYgcyAhPT0gXCJOL0FcIiAmJiBzICE9PSBcIm51bGxcIjtcbn1cblxuY29uc3QgTUVBTklOR0ZVTF9JTlRFUlBTID0gbmV3IFNldChbXG4gIFwibm9ybWFsXCIsXG4gIFwiYWJub3JtYWxcIixcbiAgXCJoaWdoXCIsXG4gIFwibG93XCIsXG4gIFwiY3JpdGljYWxcIixcbiAgXCJwb3NpdGl2ZVwiLFxuICBcIm5lZ2F0aXZlXCIsXG5dKTtcblxuZnVuY3Rpb24gZGVkdXBlUGFuZWxJdGVtcyhpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlWYWx1ZSA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10+KCk7XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBrID0gbm9ybWFsaXplVmFsdWVGb3JEZWR1cChpdC52YWx1ZSk7XG4gICAgY29uc3QgZ3JvdXAgPSBieVZhbHVlLmdldChrKTtcbiAgICBpZiAoZ3JvdXApIGdyb3VwLnB1c2goaXQpO1xuICAgIGVsc2UgYnlWYWx1ZS5zZXQoaywgW2l0XSk7XG4gIH1cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBncm91cCBvZiBieVZhbHVlLnZhbHVlcygpKSB7XG4gICAgaWYgKGdyb3VwLmxlbmd0aCA9PT0gMSkge1xuICAgICAgb3V0LnB1c2goZ3JvdXBbMF0hKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBjamtJdGVtcyA9IGdyb3VwLmZpbHRlcigoZykgPT4gY2prQ2hhcnMoU3RyaW5nKGcuZGlzcGxheSA/PyBcIlwiKSkgPj0gMik7XG4gICAgY29uc3QgZW5JdGVtcyA9IGdyb3VwLmZpbHRlcigoZykgPT4gaXNFbmdsaXNoRG9taW5hbnQoU3RyaW5nKGcuZGlzcGxheSA/PyBcIlwiKSkpO1xuICAgIGlmIChjamtJdGVtcy5sZW5ndGggPiAwICYmIGVuSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgb3V0LnB1c2goZW5JdGVtc1swXSEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQucHVzaCguLi5ncm91cCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGZpbHRlckxhYlJvd3MocmF3SXRlbXM6IGFueVtdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCByYXcgb2YgcmF3SXRlbXMpIHtcbiAgICBpZiAoIXJhdyB8fCB0eXBlb2YgcmF3ICE9PSBcIm9iamVjdFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCByYXcuY29kZSB8fCBcIlwiKSkgY29udGludWU7XG4gICAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gICAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaGFzVmFsdWUgPSBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZSk7XG4gICAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgICBpZiAoIWhhc1ZhbHVlICYmICFoYXNNZWFuaW5nZnVsSW50ZXJwKSBjb250aW51ZTtcbiAgICBvdXQucHVzaChyYXcpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGRlZHVwZUNyb3NzRm9ybWF0KGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvcmRlckNvZGUgPSAoaXQ6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcgPT5cbiAgICAoKGl0Lm9yZGVyX2NvZGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCkudG9VcHBlckNhc2UoKTtcblxuICBjb25zdCBieUtleSA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+PigpO1xuICBsZXQgaWR4Q291bnRlciA9IDA7XG4gIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgIGNvbnN0IHYgPSBTdHJpbmcoaXRlbS52YWx1ZSA/PyBcIlwiKS50cmltKCk7XG4gICAgY29uc3QgdW5pdCA9ICgoaXRlbS51bml0IGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICAgIGlmICghdikge1xuICAgICAgYnlLZXkuc2V0KGBfX25vX2RlZHVwX198JHtpZHhDb3VudGVyKyt9YCwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3Qga2V5ID0gW1xuICAgICAgKGl0ZW0uZGF0ZSBhcyBzdHJpbmcpID8/IFwiXCIsXG4gICAgICB2LnRvTG93ZXJDYXNlKCksXG4gICAgICB1bml0LnRvTG93ZXJDYXNlKCksXG4gICAgICBvcmRlckNvZGUoaXRlbSksXG4gICAgXS5qb2luKFwifFwiKTtcbiAgICBjb25zdCBleGlzdGluZyA9IGJ5S2V5LmdldChrZXkpO1xuICAgIGlmICghZXhpc3RpbmcpIHtcbiAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vIFByZWZlciB0aGUgcm93IHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggY2xpbmljYWwgcmVhZHMpLlxuICAgIGxldCBwcmltYXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIGxldCBzZWNvbmRhcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgaWYgKGNqa0NoYXJzKGl0ZW0uZGlzcGxheSA/PyBcIlwiKSA8IGNqa0NoYXJzKGV4aXN0aW5nLmRpc3BsYXkgPz8gXCJcIikpIHtcbiAgICAgIHByaW1hcnkgPSBpdGVtO1xuICAgICAgc2Vjb25kYXJ5ID0gZXhpc3Rpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByaW1hcnkgPSBleGlzdGluZztcbiAgICAgIHNlY29uZGFyeSA9IGl0ZW07XG4gICAgfVxuICAgIGNvbnN0IG1lcmdlZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4ucHJpbWFyeSB9O1xuICAgIGZvciAoY29uc3QgZiBvZiBbXCJvcmRlcl9jb2RlXCIsIFwib3JkZXJfbmFtZVwiLCBcImhvc3BpdGFsXCIsIFwiY29kZVwiXSkge1xuICAgICAgaWYgKCFtZXJnZWRbZl0gJiYgc2Vjb25kYXJ5W2ZdKSBtZXJnZWRbZl0gPSBzZWNvbmRhcnlbZl07XG4gICAgfVxuICAgIGJ5S2V5LnNldChrZXksIG1lcmdlZCk7XG4gIH1cbiAgcmV0dXJuIEFycmF5LmZyb20oYnlLZXkudmFsdWVzKCkpO1xufVxuXG5pbnRlcmZhY2UgQnBDb21wb25lbnQge1xuICBsb2luYzogc3RyaW5nO1xuICBkaXNwbGF5OiBzdHJpbmc7XG4gIHZhbHVlOiBudW1iZXI7XG4gIHVuaXQ6IHN0cmluZztcbiAgaW50ZXJwcmV0YXRpb25fdGV4dDogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBjb21iaW5lQnBJdGVtcyhpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPFxuICAgIHN0cmluZyxcbiAgICB7IHN5c3RvbGljPzogUmVjb3JkPHN0cmluZywgYW55PjsgZGlhc3RvbGljPzogUmVjb3JkPHN0cmluZywgYW55PiB9XG4gID4oKTtcbiAgY29uc3QgcGFzc1Rocm91Z2g6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgZGlzcCA9IFN0cmluZyhpdC5kaXNwbGF5ID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3Qga2V5ID0gYCR7aXQuZGF0ZSA/PyBcIlwifXwke2l0Lmhvc3BpdGFsID8/IFwiXCJ9YDtcbiAgICBpZiAoZGlzcC5pbmNsdWRlcyhcInN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIpKSB7XG4gICAgICBjb25zdCB2ID0gYnlLZXkuZ2V0KGtleSkgPz8ge307XG4gICAgICB2LnN5c3RvbGljID0gaXQ7XG4gICAgICBieUtleS5zZXQoa2V5LCB2KTtcbiAgICB9IGVsc2UgaWYgKGRpc3AuaW5jbHVkZXMoXCJkaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuZGlhc3RvbGljID0gaXQ7XG4gICAgICBieUtleS5zZXQoa2V5LCB2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFzc1Rocm91Z2gucHVzaChpdCk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBwYXJ0cyBvZiBieUtleS52YWx1ZXMoKSkge1xuICAgIGNvbnN0IHMgPSBwYXJ0cy5zeXN0b2xpYztcbiAgICBjb25zdCBkID0gcGFydHMuZGlhc3RvbGljO1xuICAgIGNvbnN0IHByaW1hcnkgPSBzID8/IGQ7XG4gICAgaWYgKCFwcmltYXJ5KSBjb250aW51ZTtcbiAgICBjb25zdCBjb21wb25lbnRzOiBCcENvbXBvbmVudFtdID0gW107XG4gICAgY29uc3QgdHJ5QWRkID0gKHNyYzogUmVjb3JkPHN0cmluZywgYW55PiB8IHVuZGVmaW5lZCwgbG9pbmM6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoIXNyYykgcmV0dXJuO1xuICAgICAgY29uc3QgdmFsID0gc3JjLnZhbHVlO1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCB8fCB2YWwgPT09IFwiXCIgfHwgdmFsID09PSBcIi1cIiB8fCB2YWwgPT09IFwiXHUyMDE0XCIpIHJldHVybjtcbiAgICAgIGNvbnN0IG51bSA9IE51bWJlci5wYXJzZUZsb2F0KFN0cmluZyh2YWwpLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobnVtKSkgcmV0dXJuO1xuICAgICAgY29tcG9uZW50cy5wdXNoKHtcbiAgICAgICAgbG9pbmMsXG4gICAgICAgIGRpc3BsYXksXG4gICAgICAgIHZhbHVlOiBudW0sXG4gICAgICAgIHVuaXQ6IHNyYy51bml0IHx8IFwibW1IZ1wiLFxuICAgICAgICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzcmMucmVmZXJlbmNlX3JhbmdlIHx8IFwiXCIsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHRyeUFkZChzLCBcIjg0ODAtNlwiLCBcIlN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIHRyeUFkZChkLCBcIjg0NjItNFwiLCBcIkRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKTtcbiAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbWJpbmVkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgY29tYmluZWQuZGlzcGxheSA9IFwiQmxvb2QgUHJlc3N1cmVcIjtcbiAgICBjb21iaW5lZC5jb2RlID0gXCJcIjtcbiAgICBjb21iaW5lZC5vcmRlcl9jb2RlID0gXCJcIjtcbiAgICBjb21iaW5lZC5vcmRlcl9uYW1lID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNhdGVnb3J5ID0gXCJ2aXRhbC1zaWduc1wiO1xuICAgIGNvbWJpbmVkLmJwX2NvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuICAgIGNvbWJpbmVkLmJwX3BhbmVsX2xvaW5jID0gXCI4NTM1NC05XCI7XG4gICAgY29tYmluZWQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgY29tYmluZWQudW5pdCA9IHVuZGVmaW5lZDtcbiAgICBwYXNzVGhyb3VnaC5wdXNoKGNvbWJpbmVkKTtcbiAgfVxuXG4gIHJldHVybiBwYXNzVGhyb3VnaDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFNwZWNpbWVuIGluZmVyZW5jZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgU1BFQ0lNRU5fUlVMRVM6IFJlYWRvbmx5QXJyYXk8W1JlZ0V4cCwgc3RyaW5nXT4gPSBbXG4gIFsvXHU1QzNGfHVyaW5lfHVyaW5hbHkvaSwgXCJVcmluZVwiXSxcbiAgWy9cdTdDREV8XHU0RkJGXHU2RjVCXHU4ODQwfHN0b29sfGZlY2FsfGZhZWNhbHxvY2N1bHRcXHMqYmxvb2QvaSwgXCJTdG9vbFwiXSxcbiAgWy9cdTc1RjB8c3B1dHVtL2ksIFwiU3B1dHVtXCJdLFxuICBbL1x1ODE2Nlx1ODEwQVx1NkRCMnxjc2Z8Y2VyZWJyb3NwaW5hbC9pLCBcIkNlcmVicm9zcGluYWwgZmx1aWRcIl0sXG4gIFsvXHU4MEY4XHU2QzM0fHBsZXVyYWwvaSwgXCJQbGV1cmFsIGZsdWlkXCJdLFxuICBbL1x1ODE3OVx1NkMzNHxhc2NpdGVzfHBlcml0b25lYWwvaSwgXCJQZXJpdG9uZWFsIGZsdWlkXCJdLFxuICBbL1x1OTY3MFx1OTA1M3xcdTYyQjlcdTcyNDd8Y2VydmljYWx8cGFwXFxzKnNtZWFyfHZhZ2luYWwvaSwgXCJDZXJ2aWNhbC9WYWdpbmFsXCJdLFxuICBbL1x1OTVEQ1x1N0JDMFx1NkRCMnxzeW5vdmlhbHxqb2ludFxccypmbHVpZC9pLCBcIlN5bm92aWFsIGZsdWlkXCJdLFxuICBbL1x1N0Y4QVx1NkMzNHxhbW5pb3RpYy9pLCBcIkFtbmlvdGljIGZsdWlkXCJdLFxuICBbL1x1OUFBOFx1OUFEM3xib25lXFxzKm1hcnJvdy9pLCBcIkJvbmUgbWFycm93XCJdLFxuXTtcblxuZnVuY3Rpb24gaW5mZXJTcGVjaW1lbiguLi5oaW50czogQXJyYXk8c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZD4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgYmxvYiA9IGhpbnRzXG4gICAgLmZpbHRlcigoaCk6IGggaXMgc3RyaW5nID0+IEJvb2xlYW4oaCkpXG4gICAgLmpvaW4oXCIgXCIpXG4gICAgLnRvTG93ZXJDYXNlKCk7XG4gIGlmICghYmxvYikgcmV0dXJuIG51bGw7XG4gIGZvciAoY29uc3QgW3BhdHRlcm4sIGxhYmVsXSBvZiBTUEVDSU1FTl9SVUxFUykge1xuICAgIGlmIChwYXR0ZXJuLnRlc3QoYmxvYikpIHJldHVybiBsYWJlbDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIE1hcCBzaW5nbGUgT2JzZXJ2YXRpb24gKG5vbi1ncm91cGVkIHBhdGgpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZnVuY3Rpb24gbWFwT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGUgfHwgXCJcIjtcbiAgaWYgKGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheSwgY29kZSkpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgaGFzVmFsdWUgPSBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZSk7XG4gIGNvbnN0IGhhc01lYW5pbmdmdWxJbnRlcnAgPSBNRUFOSU5HRlVMX0lOVEVSUFMuaGFzKGludGVycCk7XG4gIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBjb2RlLCByYXcuZGF0ZSA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgaWQ6IG9ic0lkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICBjYXRlZ29yeTogW1xuICAgICAge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogXCJsYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBcIkxhYm9yYXRvcnlcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogYnVpbGRDb2RpbmdzKGNvZGUsIGRpc3BsYXksIGxvaW5jKSxcbiAgICAgIHRleHQ6IGRpc3BsYXkgfHwgXCJVbmtub3duIExhYlwiLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICAvLyBTb3VyY2UtcHJvZ3JhbW1lIHRhZyBcdTIwMTQgc2V0IHdoZW4gdGhlIGFkYXB0ZXIgcHVsbGVkIHRoaXMgb2JzZXJ2YXRpb25cbiAgLy8gb3V0IG9mIGEgc3BlY2lmaWMgTkhJIHNjcmVlbmluZyBwcm9ncmFtbWUgKGUuZy4gYWRhcHRBZHVsdFByZXZlbnRpdmVcbiAgLy8gc2V0cyBzb3VyY2VfcHJvZ3JhbT1cImFkdWx0LXByZXZlbnRpdmVcIikuIFN1cmZhY2VkIHZpYSBPYnNlcnZhdGlvbi5cbiAgLy8gbWV0YS50YWcgc28gZG93bnN0cmVhbSBTTUFSVCBhcHBzIGNhbiBmaWx0ZXIgYnkgX3RhZyB3aXRob3V0IG5lZWRpbmdcbiAgLy8gdG8ga25vdyBhYm91dCBvdXIgaW50ZXJuYWwgZmllbGQgbmFtZXMuXG4gIGlmIChyYXcuc291cmNlX3Byb2dyYW0pIHtcbiAgICByZXNvdXJjZS5tZXRhLnRhZyA9IFtcbiAgICAgIHtcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly9uaGktZmhpci1icmlkZ2Uvc291cmNlLXByb2dyYW1cIixcbiAgICAgICAgY29kZTogU3RyaW5nKHJhdy5zb3VyY2VfcHJvZ3JhbSksXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBpZiAoaGFzVmFsdWUpIHtcbiAgICBjb25zdCBxdHkgPSB0cnlQYXJzZVF1YW50aXR5KFN0cmluZyh2YWx1ZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChxdHkpIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgPSBxdHk7XG4gICAgZWxzZSByZXNvdXJjZS52YWx1ZVN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBpZiAocmF3LnJlZmVyZW5jZV9yYW5nZSkge1xuICAgIGNvbnN0IHJyID0gcGFyc2VSYW5nZShTdHJpbmcocmF3LnJlZmVyZW5jZV9yYW5nZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChycikgcmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgPSBbcnJdO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQnVpbGQgb2JzZXJ2YXRpb24gd2l0aGluIGEgcGFuZWwgKHdpdGggY2Fub25pY2FsIGxhYiBrZXkgaWQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBidWlsZE9ic2VydmF0aW9uKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuICBwYW5lbENvZGU6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgLy8gQlAgcGFuZWw6IHByZWJ1aWx0IGJ5IGNvbWJpbmVCcEl0ZW1zLlxuICBpZiAocmF3LmJwX2NvbXBvbmVudHMpIHtcbiAgICBjb25zdCBkYXRlID0gcmF3LmRhdGUgPz8gXCJcIjtcbiAgICBjb25zdCBob3NwaXRhbCA9IHJhdy5ob3NwaXRhbCA/PyBcIlwiO1xuICAgIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBcIkJQX1BBTkVMXCIsIGRhdGUsIGhvc3BpdGFsKTtcbiAgICBjb25zdCBjb21wb25lbnRSZXNvdXJjZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBjIG9mIHJhdy5icF9jb21wb25lbnRzIGFzIEJwQ29tcG9uZW50W10pIHtcbiAgICAgIGNvbnN0IHF0eTogUXVhbnRpdHkgPSB7XG4gICAgICAgIHZhbHVlOiBjLnZhbHVlLFxuICAgICAgICB1bml0OiBjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIHN5c3RlbTogXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCIsXG4gICAgICAgIGNvZGU6IHRvVWN1bShjLnVuaXQpID8/IFwibW1bSGddXCIsXG4gICAgICB9O1xuICAgICAgY29tcG9uZW50UmVzb3VyY2VzLnB1c2goe1xuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgY29kaW5nOiBbeyBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLCBjb2RlOiBjLmxvaW5jLCBkaXNwbGF5OiBjLmRpc3BsYXkgfV0sXG4gICAgICAgICAgdGV4dDogYy5kaXNwbGF5LFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZVF1YW50aXR5OiBxdHksXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgYnBPYnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICAgIGlkOiBvYnNJZCxcbiAgICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgICAgY2F0ZWdvcnk6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgICBjb2RlOiBcInZpdGFsLXNpZ25zXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiVml0YWwgU2lnbnNcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjb2RlOiB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsXG4gICAgICAgICAgICBjb2RlOiByYXcuYnBfcGFuZWxfbG9pbmMgPz8gXCI4NTM1NC05XCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBcIkJsb29kIHByZXNzdXJlIHBhbmVsXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogXCJCbG9vZCBQcmVzc3VyZVwiLFxuICAgICAgfSxcbiAgICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgICBjb21wb25lbnQ6IGNvbXBvbmVudFJlc291cmNlcyxcbiAgICB9O1xuICAgIGlmIChkYXRlKSBicE9icy5lZmZlY3RpdmVEYXRlVGltZSA9IGAke2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAoaG9zcGl0YWwpIGJwT2JzLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IGhvc3BpdGFsIH1dO1xuICAgIHJldHVybiBicE9icztcbiAgfVxuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCBjb2RlID0gKHBhbmVsQ29kZSA/IFN0cmluZyhwYW5lbENvZGUpIDogXCJcIikgfHwgcmF3Lm9yZGVyX2NvZGUgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IGNhbm9uaWNhbCA9IGNhbm9uaWNhbExhYktleShkaXNwbGF5KSB8fCBkaXNwbGF5O1xuICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJvYnNcIiwgY2Fub25pY2FsLCByYXcuZGF0ZSA/PyBcIlwiLCByYXcuaG9zcGl0YWwgPz8gXCJcIik7XG4gIGNvbnN0IGxvaW5jID0gZmluZExvaW5jKGNvZGUsIGRpc3BsYXkpO1xuXG4gIGNvbnN0IGNhdENvZGUgPSByYXcuY2F0ZWdvcnkgfHwgXCJsYWJvcmF0b3J5XCI7XG4gIGNvbnN0IENBVF9ESVNQTEFZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIGxhYm9yYXRvcnk6IFwiTGFib3JhdG9yeVwiLFxuICAgIFwidml0YWwtc2lnbnNcIjogXCJWaXRhbCBTaWduc1wiLFxuICAgIGltYWdpbmc6IFwiSW1hZ2luZ1wiLFxuICAgIHByb2NlZHVyZTogXCJQcm9jZWR1cmVcIixcbiAgICBcInNvY2lhbC1oaXN0b3J5XCI6IFwiU29jaWFsIEhpc3RvcnlcIixcbiAgICBzdXJ2ZXk6IFwiU3VydmV5XCIsXG4gICAgZXhhbTogXCJFeGFtXCIsXG4gICAgdGhlcmFweTogXCJUaGVyYXB5XCIsXG4gICAgYWN0aXZpdHk6IFwiQWN0aXZpdHlcIixcbiAgfTtcbiAgY29uc3QgY2F0RGlzcGxheSA9XG4gICAgQ0FUX0RJU1BMQVlbY2F0Q29kZV0gPz8gY2F0Q29kZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNhdENvZGUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBjYXRDb2RlLFxuICAgICAgICAgICAgZGlzcGxheTogY2F0RGlzcGxheSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogYnVpbGRDb2RpbmdzKGNvZGUsIGRpc3BsYXksIGxvaW5jKSxcbiAgICAgIHRleHQ6IGRpc3BsYXkgfHwgXCJVbmtub3duIExhYlwiLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKHJhdy5ob3NwaXRhbCkgcmVzb3VyY2UucGVyZm9ybWVyID0gW3sgZGlzcGxheTogcmF3Lmhvc3BpdGFsIH1dO1xuICBjb25zdCBzcGVjaW1lbiA9IGluZmVyU3BlY2ltZW4ocmF3Lm9yZGVyX25hbWUsIHJhdy5kaXNwbGF5LCByYXcuY29kZSk7XG4gIGlmIChzcGVjaW1lbikgcmVzb3VyY2Uuc3BlY2ltZW4gPSB7IGRpc3BsYXk6IHNwZWNpbWVuIH07XG5cbiAgY29uc3QgaGFzVmFsdWUgPSBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZSk7XG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnJzID0gcGFyc2VSYW5nZU11bHRpKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJycy5sZW5ndGggPiAwKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IHJycztcbiAgfVxuXG4gIGNvbnN0IGludGVycENvZGluZ1Jlc3VsdCA9XG4gICAgbWFwSW50ZXJwcmV0YXRpb24oaW50ZXJwKSB8fFxuICAgIGRlcml2ZUludGVycHJldGF0aW9uKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCA/IFN0cmluZyh2YWx1ZSkgOiBcIlwiLFxuICAgICAgcmVzb3VyY2UudmFsdWVRdWFudGl0eSBhcyBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgICAgIChyZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSBhcyBSYW5nZUVudHJ5W10gfCB1bmRlZmluZWQpPy5bMF0sXG4gICAgKTtcbiAgaWYgKGludGVycENvZGluZ1Jlc3VsdCkge1xuICAgIHJlc291cmNlLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbaW50ZXJwQ29kaW5nUmVzdWx0XSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEdyb3VwIGJ5IChvcmRlcl9jb2RlLCBkYXRlLCBob3NwaXRhbCkgXHUyMTkyIERSICsgT2JzZXJ2YXRpb25zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBncm91cEJ5T3JkZXJDb2RlKFxuICBjbGVhbmVkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgbGV0IHdvcmtpbmcgPSBkZWR1cGVDcm9zc0Zvcm1hdChjbGVhbmVkKTtcbiAgd29ya2luZyA9IGNvbWJpbmVCcEl0ZW1zKHdvcmtpbmcpO1xuXG4gIGNvbnN0IGdyb3VwcyA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10+KCk7XG4gIGNvbnN0IGtleU1ldGEgPSBuZXcgTWFwPHN0cmluZywgeyBncm91cEtleUNvZGU6IHN0cmluZzsgZGF0ZTogc3RyaW5nOyBob3NwaXRhbDogc3RyaW5nIH0+KCk7XG4gIGZvciAoY29uc3QgcmF3IG9mIHdvcmtpbmcpIHtcbiAgICBjb25zdCBncm91cEtleUNvZGUgPSByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCByYXcuZGlzcGxheSB8fCBcIlwiO1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qga2V5ID0gYCR7Z3JvdXBLZXlDb2RlfXwke2RhdGV9fCR7aG9zcGl0YWx9YDtcbiAgICBjb25zdCBhcnIgPSBncm91cHMuZ2V0KGtleSk7XG4gICAgaWYgKGFycikgYXJyLnB1c2gocmF3KTtcbiAgICBlbHNlIHtcbiAgICAgIGdyb3Vwcy5zZXQoa2V5LCBbcmF3XSk7XG4gICAgICBrZXlNZXRhLnNldChrZXksIHsgZ3JvdXBLZXlDb2RlOiBTdHJpbmcoZ3JvdXBLZXlDb2RlKSwgZGF0ZSwgaG9zcGl0YWwgfSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBba2V5LCBpdGVtc10gb2YgZ3JvdXBzLmVudHJpZXMoKSkge1xuICAgIGNvbnN0IG1ldGEgPSBrZXlNZXRhLmdldChrZXkpITtcbiAgICBjb25zdCBkZWR1cGVkID0gZGVkdXBlUGFuZWxJdGVtcyhpdGVtcyk7XG5cbiAgICBjb25zdCBvYnNSZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICAgIGNvbnN0IHNlZW5PYnNJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGRlZHVwZWQpIHtcbiAgICAgIGNvbnN0IG9icyA9IGJ1aWxkT2JzZXJ2YXRpb24oaXQsIHBhdGllbnRJZCwgbWV0YS5ncm91cEtleUNvZGUpO1xuICAgICAgaWYgKCFvYnMpIGNvbnRpbnVlO1xuICAgICAgaWYgKHNlZW5PYnNJZHMuaGFzKG9icy5pZCkpIGNvbnRpbnVlO1xuICAgICAgc2Vlbk9ic0lkcy5hZGQob2JzLmlkKTtcbiAgICAgIG9ic1Jlc291cmNlcy5wdXNoKG9icyk7XG4gICAgfVxuICAgIGlmIChvYnNSZXNvdXJjZXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcblxuICAgIC8vIEJQIHBhbmVsOiBlbWl0IE9ic2VydmF0aW9uIGRpcmVjdGx5IChubyBEUiB3cmFwcGVyKS5cbiAgICBjb25zdCBpc0JwUGFuZWwgPSBkZWR1cGVkLmV2ZXJ5KChpdCkgPT4gaXQuYnBfY29tcG9uZW50cyB8fCBpdC5kaXNwbGF5ID09PSBcIkJsb29kIFByZXNzdXJlXCIpO1xuICAgIGlmIChpc0JwUGFuZWwpIHtcbiAgICAgIG91dC5wdXNoKC4uLm9ic1Jlc291cmNlcyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBvcmRlck5hbWUgPSBkZWR1cGVkLmZpbmQoKGl0KSA9PiBpdC5vcmRlcl9uYW1lKT8ub3JkZXJfbmFtZSA/PyBudWxsO1xuICAgIGNvbnN0IG1lbWJlcktleXMgPSBBcnJheS5mcm9tKFxuICAgICAgbmV3IFNldChkZWR1cGVkLmZpbHRlcigoaXQpID0+IGl0LmRpc3BsYXkpLm1hcCgoaXQpID0+IGNhbm9uaWNhbExhYktleShpdC5kaXNwbGF5KSkpLFxuICAgICkuc29ydCgpO1xuICAgIGNvbnN0IHBhbmVsU2lnbmF0dXJlID0gbWVtYmVyS2V5cy5qb2luKFwiLFwiKSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIGNvbnN0IGRySWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwiRFJcIiwgcGFuZWxTaWduYXR1cmUsIG1ldGEuZGF0ZSwgbWV0YS5ob3NwaXRhbCk7XG5cbiAgICBsZXQgcGFuZWxUaXRsZTogc3RyaW5nO1xuICAgIGlmIChkZWR1cGVkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3Qgc2luZ2xlRGlzcGxheSA9IGRlZHVwZWRbMF0hLmRpc3BsYXkgPz8gXCJcIjtcbiAgICAgIHBhbmVsVGl0bGUgPSBzaW5nbGVEaXNwbGF5IHx8IG9yZGVyTmFtZSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lbFRpdGxlID0gb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfVxuXG4gICAgY29uc3QgZHJDb2RlU3lzdGVtID0gTkhJX0xBQl9DT0RFX1JFLnRlc3QoU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKSA/PyBcIlwiKVxuICAgICAgPyBzeXN0ZW1zLk5ISV9NRURJQ0FMX09SREVSX0NPREVcbiAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREU7XG5cbiAgICBjb25zdCBkcjogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gICAgICBpZDogZHJJZCxcbiAgICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgICAgY2F0ZWdvcnk6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92Mi0wMDc0XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwiTEFCXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBkckNvZGVTeXN0ZW0sXG4gICAgICAgICAgICBjb2RlOiBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpIHx8IFwiVU5LTk9XTlwiLFxuICAgICAgICAgICAgZGlzcGxheTogcGFuZWxUaXRsZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBwYW5lbFRpdGxlLFxuICAgICAgfSxcbiAgICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgICByZXN1bHQ6IG9ic1Jlc291cmNlcy5tYXAoKG8pID0+ICh7IHJlZmVyZW5jZTogYE9ic2VydmF0aW9uLyR7by5pZH1gIH0pKSxcbiAgICB9O1xuICAgIGlmIChtZXRhLmRhdGUpIGRyLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7bWV0YS5kYXRlfVQwMDowMDowMCswODowMGA7XG4gICAgaWYgKG1ldGEuaG9zcGl0YWwpIGRyLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IG1ldGEuaG9zcGl0YWwgfV07XG5cbiAgICBvdXQucHVzaChkcik7XG4gICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbnNHcm91cGVkKHJhd0l0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBjbGVhbmVkID0gZmlsdGVyTGFiUm93cyhyYXdJdGVtcyk7XG4gIHJldHVybiBncm91cEJ5T3JkZXJDb2RlKGNsZWFuZWQsIHBhdGllbnRJZCk7XG59XG4iLCAiLyoqXG4gKiBQcm9jZWR1cmUgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9wcm9jZWR1cmUucHlgLiBSZXR1cm5zIG51bGwgZm9yIGxpc3QtcGFnZVxuICogcm93cyBsYWNraW5nIG5vdGUvYm9keV9zaXRlIFx1MjAxNCB0aGUgYWx0ZXJuYXRpdmUgaXMgdGhlIFNNQVJUIGFwcCBzaG93aW5nXG4gKiAyNSBcInByb2NlZHVyZXNcIiBjYWxsZWQgXCJNeWNvYmFjdGVyaWEgY3VsdHVyZVwiIC8gXCJWYWdpbmFsIHVsdHJhc291bmRcIlxuICogLyBldGMuIHdoaWNoIGFyZSBjbGluaWNhbGx5IHdyb25nLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJpY2RcIikpIHJldHVybiBzeXN0ZW1zLklDRF8xMF9QQ1M7XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9QUk9DRURVUkVfQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFByb2NlZHVyZShcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3Qgbm90ZSA9ICgocmF3Lm5vdGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gIGNvbnN0IGJvZHlTaXRlID0gKChyYXcuYm9keV9zaXRlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIW5vdGUgJiYgIWJvZHlTaXRlKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgPz8gXCJVbmtub3duIFByb2NlZHVyZVwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJQcm9jZWR1cmVcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJjb21wbGV0ZWRcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UucGVyZm9ybWVkRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChib2R5U2l0ZSkge1xuICAgIHJlc291cmNlLmJvZHlTaXRlID0gW3sgdGV4dDogYm9keVNpdGUgfV07XG4gIH1cbiAgaWYgKG5vdGUpIHtcbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogbm90ZSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgbWFwcGVyIGRpc3BhdGNoIHRhYmxlcy5cbiAqXG4gKiBDb25zdW1lZCBieSBiYWNrZW5kJ3MgYC9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCBhbmQgdGhlIGV4dGVuc2lvbidzXG4gKiBsb2NhbC1tb2RlIGJ1bmRsZSBhc3NlbWJsZXIgc28gYm90aCBwcm9kdWNlIGlkZW50aWNhbCBGSElSIG91dHB1dC5cbiAqL1xuXG5pbXBvcnQgeyBtYXBBbGxlcmd5SW50b2xlcmFuY2UgfSBmcm9tIFwiLi9hbGxlcmd5XCI7XG5pbXBvcnQgeyBtYXBDb25kaXRpb24gfSBmcm9tIFwiLi9jb25kaXRpb25cIjtcbmltcG9ydCB7IG1hcERpYWdub3N0aWNSZXBvcnQgfSBmcm9tIFwiLi9kaWFnbm9zdGljLXJlcG9ydFwiO1xuaW1wb3J0IHsgbWFwRW5jb3VudGVyIH0gZnJvbSBcIi4vZW5jb3VudGVyXCI7XG5pbXBvcnQgeyBtYXBNZWRpY2F0aW9uUmVxdWVzdCwgbWFwTWVkaWNhdGlvbnNEZWR1cCB9IGZyb20gXCIuL21lZGljYXRpb25cIjtcbmltcG9ydCB7IG1hcE9ic2VydmF0aW9uLCBtYXBPYnNlcnZhdGlvbnNHcm91cGVkIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb25cIjtcbmltcG9ydCB7IG1hcFByb2NlZHVyZSB9IGZyb20gXCIuL3Byb2NlZHVyZVwiO1xuXG5leHBvcnQgdHlwZSBQZXJSb3dNYXBwZXIgPSAoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pID0+IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsO1xuXG5leHBvcnQgdHlwZSBHcm91cE1hcHBlciA9IChpdGVtczogYW55W10sIHBhdGllbnRJZDogc3RyaW5nKSA9PiBSZWNvcmQ8c3RyaW5nLCBhbnk+W107XG5cbi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiAocGVyLXJvdyBtYXBwZXIsIEpTT04gbGlzdCBrZXkgaW5zaWRlIExMTSByZXNwb25zZSkuXG4gKiBVc2VkIGJ5IHRoZSBMTE0gZmFsbGJhY2sgcGF0aCBhZnRlciBleHRyYWN0aW9uOyB0aGUgc3RydWN0dXJlZCBwYXRoXG4gKiBhbHNvIGNvbnN1bHRzIGl0IGZvciBwZXItcm93IHJlc291cmNlIHR5cGVzLlxuICovXG5leHBvcnQgY29uc3QgTElTVF9IQU5ETEVSUzogUmVjb3JkPHN0cmluZywgW1BlclJvd01hcHBlciwgc3RyaW5nXT4gPSB7XG4gIG9ic2VydmF0aW9uczogW21hcE9ic2VydmF0aW9uLCBcIm9ic2VydmF0aW9uc1wiXSxcbiAgbWVkaWNhdGlvbnM6IFttYXBNZWRpY2F0aW9uUmVxdWVzdCwgXCJtZWRpY2F0aW9uc1wiXSxcbiAgY29uZGl0aW9uczogW21hcENvbmRpdGlvbiwgXCJjb25kaXRpb25zXCJdLFxuICBhbGxlcmdpZXM6IFttYXBBbGxlcmd5SW50b2xlcmFuY2UsIFwiYWxsZXJnaWVzXCJdLFxuICBkaWFnbm9zdGljX3JlcG9ydHM6IFttYXBEaWFnbm9zdGljUmVwb3J0LCBcImRpYWdub3N0aWNfcmVwb3J0c1wiXSxcbiAgcHJvY2VkdXJlczogW21hcFByb2NlZHVyZSwgXCJwcm9jZWR1cmVzXCJdLFxuICBlbmNvdW50ZXJzOiBbbWFwRW5jb3VudGVyLCBcImVuY291bnRlcnNcIl0sXG59O1xuXG4vKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgZ3JvdXAtYXdhcmUgbWFwcGVyIHRoYXQgdGFrZXMgdGhlIEZVTEwgbGlzdCBhdCBvbmNlLlxuICogVXNlZCB3aGVuIGNyb3NzLXJvdyBncm91cGluZy9kZWR1cCBpcyByZXF1aXJlZCAoTkhJIGxhYiBwYW5lbHMsXG4gKiBcdTRFMkRcdTgyRjEgbWVkaWNhdGlvbiBcdTk2RDlcdThBOUUgZGVkdXApLlxuICovXG5leHBvcnQgY29uc3QgR1JPVVBfSEFORExFUlM6IFJlY29yZDxzdHJpbmcsIEdyb3VwTWFwcGVyPiA9IHtcbiAgb2JzZXJ2YXRpb25zOiBtYXBPYnNlcnZhdGlvbnNHcm91cGVkLFxuICBtZWRpY2F0aW9uczogbWFwTWVkaWNhdGlvbnNEZWR1cCxcbn07XG4iLCAiLyoqXG4gKiBFbmNvdW50ZXIgbGlua2VyIFx1MjAxNCBtYXRjaCByZXNvdXJjZXMgdG8gRW5jb3VudGVycyBieSAoaG9zcGl0YWwsIGRhdGUpLlxuICpcbiAqIFB1cmUgZnVuY3Rpb246IG11dGF0ZXMgYHJlc291cmNlc2AgaW4gcGxhY2UgdG8gYWRkIGBlbmNvdW50ZXJgXG4gKiByZWZlcmVuY2VzIHdoZW4gdGhlcmUncyBhbiB1bmFtYmlndW91cyBtYXRjaCBpbiB0aGUgY2FuZGlkYXRlXG4gKiBFbmNvdW50ZXIgbGlzdC4gU2FtZSBsb2dpYyBhcyB0aGUgYmFja2VuZCdzIERCLWNvdXBsZWQgdmVyc2lvbixcbiAqIGxpZnRlZCBvdXQgc28gdGhlIGV4dGVuc2lvbidzIGxvY2FsIG1vZGUgY2FuIGNhbGwgaXQgb24gYW5cbiAqIGluLW1lbW9yeSBhcnJheS5cbiAqL1xuXG5pbXBvcnQgeyBkZXJpdmVJbnRlcnByZXRhdGlvbiB9IGZyb20gXCIuL29ic2VydmF0aW9uXCI7XG5cbmNvbnN0IEVOQ09VTlRFUl9MSU5LQUJMRSA9IG5ldyBTZXQoW1xuICBcIk9ic2VydmF0aW9uXCIsXG4gIFwiTWVkaWNhdGlvblJlcXVlc3RcIixcbiAgXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gIFwiUHJvY2VkdXJlXCIsXG4gIFwiQ29uZGl0aW9uXCIsXG4gIFwiQWxsZXJneUludG9sZXJhbmNlXCIsXG5dKTtcblxuZnVuY3Rpb24gcmVzb3VyY2VEYXRlKHI6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBmb3IgKGNvbnN0IGtleSBvZiBbXG4gICAgXCJlZmZlY3RpdmVEYXRlVGltZVwiLFxuICAgIFwiYXV0aG9yZWRPblwiLFxuICAgIFwicGVyZm9ybWVkRGF0ZVRpbWVcIixcbiAgICBcIm9uc2V0RGF0ZVRpbWVcIixcbiAgICBcInJlY29yZGVkRGF0ZVwiLFxuICAgIFwiaXNzdWVkXCIsXG4gIF0pIHtcbiAgICBjb25zdCB2ID0gcltrZXldO1xuICAgIGlmICh2KSByZXR1cm4gU3RyaW5nKHYpLnNsaWNlKDAsIDEwKTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBvZiBbXCJlZmZlY3RpdmVQZXJpb2RcIiwgXCJwZXJmb3JtZWRQZXJpb2RcIl0pIHtcbiAgICBjb25zdCBwZXJpb2QgPSByW2tleV07XG4gICAgaWYgKHBlcmlvZCAmJiB0eXBlb2YgcGVyaW9kID09PSBcIm9iamVjdFwiICYmIHBlcmlvZC5zdGFydCkge1xuICAgICAgcmV0dXJuIFN0cmluZyhwZXJpb2Quc3RhcnQpLnNsaWNlKDAsIDEwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFwiXCI7XG59XG5cbmZ1bmN0aW9uIHJlc291cmNlSG9zcGl0YWwocjogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIGZvciAoY29uc3QgcCBvZiByLnBlcmZvcm1lciA/PyBbXSkge1xuICAgIGNvbnN0IGQgPSAocCA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGlmIChkKSByZXR1cm4gZDtcbiAgfVxuICBjb25zdCByZXEgPSByLnJlcXVlc3RlciA/PyB7fTtcbiAgaWYgKHJlcSAmJiB0eXBlb2YgcmVxID09PSBcIm9iamVjdFwiICYmIHJlcS5kaXNwbGF5KSByZXR1cm4gcmVxLmRpc3BsYXk7XG4gIHJldHVybiBcIlwiO1xufVxuXG4vKipcbiAqIERyb3AgQU1CIEVuY291bnRlcnMgd2hvc2UgKGhvc3BpdGFsLCBzdGFydF9kYXRlKSBpcyBhbHJlYWR5IGNvdmVyZWRcbiAqIGJ5IGFuIElNUCBFbmNvdW50ZXIncyBhZG1pc3Npb24gZGF5LiBOSEkgZW1pdHMgdGhlIHNhbWUgaW5wYXRpZW50XG4gKiBzdGF5IHR3aWNlIChJSEtFMzMwMyBBTUIgYmlsbGluZyBlbnRyeSArIElIS0UzMzA5IElNUCBkZXRhaWwpOyB0aGVcbiAqIElNUCBvbmUgaXMgY2Fub25pY2FsLCB0aGUgQU1CIGlzIGEgYmlsbGluZyBhcnRlZmFjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwQWRtaXNzaW9uRGF5QW1iKFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IFJlY29yZDxzdHJpbmcsIGFueT5bXSB7XG4gIGNvbnN0IGltcFN0YXJ0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKHIucmVzb3VyY2VUeXBlICE9PSBcIkVuY291bnRlclwiKSBjb250aW51ZTtcbiAgICBpZiAoKHIuY2xhc3MgPz8ge30pLmNvZGUgIT09IFwiSU1QXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICBjb25zdCBzdGFydCA9IFN0cmluZygoci5wZXJpb2QgPz8ge30pLnN0YXJ0ID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICBpZiAoaG9zcCAmJiBzdGFydCkgaW1wU3RhcnRzLmFkZChgJHtob3NwfSAke3N0YXJ0fWApO1xuICB9XG4gIGlmIChpbXBTdGFydHMuc2l6ZSA9PT0gMCkgcmV0dXJuIHJlc291cmNlcztcbiAgcmV0dXJuIHJlc291cmNlcy5maWx0ZXIoKHIpID0+IHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgPT09IFwiRW5jb3VudGVyXCIgJiYgKHIuY2xhc3MgPz8ge30pLmNvZGUgPT09IFwiQU1CXCIpIHtcbiAgICAgIGNvbnN0IGhvc3AgPSAoci5zZXJ2aWNlUHJvdmlkZXIgPz8ge30pLmRpc3BsYXkgPz8gXCJcIjtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChyLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgICAgaWYgKGltcFN0YXJ0cy5oYXMoYCR7aG9zcH0gJHtzdGFydH1gKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkIGBlbmNvdW50ZXJgIHJlZmVyZW5jZSB0byBlYWNoIGxpbmthYmxlIHJlc291cmNlIHdoZW4gaXRzXG4gKiAoaG9zcGl0YWwsIGRhdGUpIG1hdGNoZXMgZXhhY3RseSBPTkUgRW5jb3VudGVyIGluIGBjYW5kaWRhdGVzYC5cbiAqIENvbnNlcnZhdGl2ZSBcdTIwMTQgbGVhdmVzIGFtYmlndW91cyAoMCBvciA+MSBtYXRjaCkgY2FzZXMgdW5saW5rZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzKFxuICBjYW5kaWRhdGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogdm9pZCB7XG4gIGlmIChjYW5kaWRhdGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICBjb25zdCBleGFjdEluZGV4ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBjb25zdCBpbXBCeUhvc3AgPSBuZXcgTWFwPHN0cmluZywgQXJyYXk8W3N0cmluZywgc3RyaW5nLCBzdHJpbmddPj4oKTtcblxuICBmb3IgKGNvbnN0IGUgb2YgY2FuZGlkYXRlcykge1xuICAgIGlmIChlLnJlc291cmNlVHlwZSAhPT0gXCJFbmNvdW50ZXJcIikgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IChlLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChlLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgIGlmICghaG9zcCB8fCAhc3RhcnQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGtleSA9IGAke2hvc3B9ICR7c3RhcnR9YDtcbiAgICBjb25zdCBhcnIgPSBleGFjdEluZGV4LmdldChrZXkpID8/IFtdO1xuICAgIGFyci5wdXNoKGUuaWQpO1xuICAgIGV4YWN0SW5kZXguc2V0KGtleSwgYXJyKTtcbiAgICBjb25zdCBjbHMgPSAoZS5jbGFzcyA/PyB7fSkuY29kZSA/PyBcIlwiO1xuICAgIGlmIChjbHMgPT09IFwiSU1QXCIpIHtcbiAgICAgIGNvbnN0IGVuZCA9IFN0cmluZygoZS5wZXJpb2QgPz8ge30pLmVuZCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgICBpZiAoZW5kKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBpbXBCeUhvc3AuZ2V0KGhvc3ApID8/IFtdO1xuICAgICAgICBsaXN0LnB1c2goW3N0YXJ0LCBlbmQsIGUuaWRdKTtcbiAgICAgICAgaW1wQnlIb3NwLnNldChob3NwLCBsaXN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZXhhY3RJbmRleC5zaXplID09PSAwICYmIGltcEJ5SG9zcC5zaXplID09PSAwKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmICghRU5DT1VOVEVSX0xJTktBQkxFLmhhcyhyLnJlc291cmNlVHlwZSkpIGNvbnRpbnVlO1xuICAgIGlmIChyLmVuY291bnRlciB8fCByLmNvbnRleHQpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGhvc3AgPSByZXNvdXJjZUhvc3BpdGFsKHIpO1xuICAgIGNvbnN0IGRhdGUgPSByZXNvdXJjZURhdGUocik7XG4gICAgaWYgKCFob3NwIHx8ICFkYXRlKSBjb250aW51ZTtcbiAgICBjb25zdCBtYXRjaGVzOiBzdHJpbmdbXSA9IFsuLi4oZXhhY3RJbmRleC5nZXQoYCR7aG9zcH0gJHtkYXRlfWApID8/IFtdKV07XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmb3IgKGNvbnN0IFtzdGFydCwgZW5kLCBlaWRdIG9mIGltcEJ5SG9zcC5nZXQoaG9zcCkgPz8gW10pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDw9IGRhdGUgJiYgZGF0ZSA8PSBlbmQpIG1hdGNoZXMucHVzaChlaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggIT09IDEpIGNvbnRpbnVlO1xuICAgIHIuZW5jb3VudGVyID0geyByZWZlcmVuY2U6IGBFbmNvdW50ZXIvJHttYXRjaGVzWzBdfWAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFdoZW4gYW4gT2JzZXJ2YXRpb24gY2FycmllcyBtdWx0aXBsZSByZWZlcmVuY2VSYW5nZSBlbnRyaWVzIHRhZ2dlZFxuICogd2l0aCBgYXBwbGllc1RvWypdLmNvZGluZy5jb2RlYCBpbiB7bWFsZSwgZmVtYWxlfSwgcGljayB0aGUgb25lIHRoYXRcbiAqIG1hdGNoZXMgdGhlIHBhdGllbnQncyBnZW5kZXIgYW5kIHJlLWRlcml2ZSBpbnRlcnByZXRhdGlvbiBhZ2FpbnN0IGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMoXG4gIHBhdGllbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsLFxuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbik6IHZvaWQge1xuICBpZiAoIXBhdGllbnQpIHJldHVybjtcbiAgY29uc3QgZ2VuZGVyID0gU3RyaW5nKHBhdGllbnQuZ2VuZGVyID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChnZW5kZXIgIT09IFwibWFsZVwiICYmIGdlbmRlciAhPT0gXCJmZW1hbGVcIikgcmV0dXJuO1xuXG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgIT09IFwiT2JzZXJ2YXRpb25cIikgY29udGludWU7XG4gICAgY29uc3QgcnJzOiBhbnlbXSA9IHIucmVmZXJlbmNlUmFuZ2UgPz8gW107XG4gICAgaWYgKHJycy5sZW5ndGggPCAyKSBjb250aW51ZTtcblxuICAgIGxldCBtYXRjaDogYW55ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJycykge1xuICAgICAgZm9yIChjb25zdCBhcCBvZiBlbnRyeS5hcHBsaWVzVG8gPz8gW10pIHtcbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGFwLmNvZGluZyA/PyBbXSkge1xuICAgICAgICAgIGlmIChTdHJpbmcoYy5jb2RlID8/IFwiXCIpLnRvTG93ZXJDYXNlKCkgPT09IGdlbmRlcikge1xuICAgICAgICAgICAgbWF0Y2ggPSBlbnRyeTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2gpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKG1hdGNoKSBicmVhaztcbiAgICB9XG4gICAgaWYgKCFtYXRjaCkgY29udGludWU7XG5cbiAgICByLnJlZmVyZW5jZVJhbmdlID0gW21hdGNoXTtcbiAgICBjb25zdCB2YWxTdHIgPVxuICAgICAgU3RyaW5nKChyLnZhbHVlUXVhbnRpdHkgPz8ge30pLnZhbHVlID8/IFwiXCIpIHx8IFN0cmluZyhyLnZhbHVlU3RyaW5nID8/IFwiXCIpO1xuICAgIGNvbnN0IG5ld0ludGVycCA9IGRlcml2ZUludGVycHJldGF0aW9uKHZhbFN0ciwgci52YWx1ZVF1YW50aXR5ID8/IG51bGwsIG1hdGNoKTtcbiAgICBpZiAobmV3SW50ZXJwKSB7XG4gICAgICByLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbbmV3SW50ZXJwXSB9XTtcbiAgICB9XG4gIH1cbn1cbiIsICIvKipcbiAqIFBhdGllbnQgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9wYXRpZW50LnB5YC4gU2FtZSBwdWJsaWMgQVBJOlxuICogICAtIGxvb2tzTGlrZVR3TmF0aW9uYWxJZCh2YWx1ZSkgXHUyMDE0IGV4cG9zZWQgZm9yIHRlc3RzXG4gKiAgIC0gbWFwUGF0aWVudChyYXcpIFx1MjAxNCBtYWluIGVudHJ5XG4gKi9cblxuaW1wb3J0IHsgZGVyaXZlUGF0aWVudElkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5cbi8vIFRhaXdhbiBuYXRpb25hbCBJRDogMSBsZXR0ZXIgKyA5IGRpZ2l0cyAoQTEyMzQ1Njc4OSkuIFVzZWQgdG8gZGVjaWRlXG4vLyB3aGV0aGVyIHRoZSBwb3B1cC1zdXBwbGllZCBwYXRpZW50X2lkIHNob3VsZCBiZSBjb2RlZCB1bmRlciB0aGVcbi8vIGNhbm9uaWNhbCBuYXRpb25hbC1pZCBzeXN0ZW0gb3IgYXMgYSBsb2NhbCBob3NwaXRhbCBNUk4uXG5jb25zdCBUV19OQVRJT05BTF9JRF9SRSA9IC9eW0EtWl1bMTJdXFxkezh9JC87XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rc0xpa2VUd05hdGlvbmFsSWQodmFsdWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gVFdfTkFUSU9OQUxfSURfUkUudGVzdCh2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQYXRpZW50KHJhdzogUmVjb3JkPHN0cmluZywgYW55Pik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCByYXdJZCA9IFN0cmluZyhyYXcuaWRlbnRpZmllciA/PyByYXcuaWQgPz8gXCJ1bmtub3duXCIpO1xuICAvLyBGSElSIFBhdGllbnQuaWQgaXMgdGhlIGhhc2hlZC9zYWx0ZWQgZm9ybS4gUmVhbCBuYXRpb25hbCBJRCBzdGF5c1xuICAvLyBvbmx5IGluIGlkZW50aWZpZXJbXS52YWx1ZSBzbyBhIGxlYWtlZCBCdW5kbGUgKG9yIGEgU01BUlQgYXBwIHRva2VuXG4gIC8vIHBheWxvYWQgY29udGFpbmluZyBwYXRpZW50X2lkKSBkb2Vzbid0IGRpc2Nsb3NlIGl0IHZpYSBldmVyeVxuICAvLyBzdWJqZWN0LnJlZmVyZW5jZS5cbiAgY29uc3QgcGF0aWVudElkID0gZGVyaXZlUGF0aWVudElkKHJhd0lkKTtcblxuICAvLyBVc2UgYD8/YCAobm90IGp1c3QgZGVmYXVsdCBhcmcpIHNvIGV4cGxpY2l0IG51bGwgZnJvbSB0aGUgTExNIGFsc29cbiAgLy8gZmFsbHMgYmFjay4gTG9jYWwgbW9kZWxzIHNvbWV0aW1lcyBlbWl0IG51bGwgaW5zdGVhZCBvZiBvbWl0dGluZy5cbiAgLy8gVGhlIGNhbGxlciBkZWNpZGVzIHdoZXRoZXIgYHJhdy5uYW1lYCBpcyB0aGUgdXNlcidzIHJlYWwgbmFtZSBvclxuICAvLyBhbHJlYWR5LW1hc2tlZCBcdTIwMTQgbWFwUGF0aWVudCBqdXN0IHRyYW5zY3JpYmVzLiBNYXNraW5nIHBvbGljeSBsaXZlc1xuICAvLyBhdCB0aGUgVUkgLyBleHRlbnNpb24gbGF5ZXIgKGRyaXZlbiBieSB0aGUgdXNlci10b2dnbGVhYmxlXG4gIC8vIGBtYXNrTmFtZUVuYWJsZWRgIHNldHRpbmcpIHNvIHRoZSBzYW1lIG1hcHBlciBpcyBjb3JyZWN0IGZvciBib3RoXG4gIC8vIFwiXHU2QzExXHU3NzNFXHU4MUVBXHU3NTI4ID0gcmVhbCBuYW1lXCIgYW5kIFwiXHU5MUFCXHU3NjQyXHU0RUJBXHU1NEUxXHU1OTFBXHU3NUM1XHU0RUJBID0gbWFza2VkXCIgd29ya2Zsb3dzLlxuICBjb25zdCBuYW1lVGV4dCA9IChyYXcubmFtZSA/PyBudWxsKSB8fCBcIlVua25vd25cIjtcbiAgY29uc3QgcGhvbmUgPSAocmF3LnBob25lID8/IG51bGwpIHx8IFwiXCI7XG4gIGNvbnN0IGFkZHJlc3MgPSAocmF3LmFkZHJlc3MgPz8gbnVsbCkgfHwgXCJcIjtcblxuICBjb25zdCBbZmFtaWx5LCBnaXZlbl0gPSBzcGxpdE5hbWUobmFtZVRleHQpO1xuICBjb25zdCBuYW1lRW50cnk6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IHVzZTogXCJvZmZpY2lhbFwiLCB0ZXh0OiBuYW1lVGV4dCB9O1xuICBpZiAoZmFtaWx5KSBuYW1lRW50cnkuZmFtaWx5ID0gZmFtaWx5O1xuICBpZiAoZ2l2ZW4ubGVuZ3RoID4gMCkgbmFtZUVudHJ5LmdpdmVuID0gZ2l2ZW47XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIlBhdGllbnRcIixcbiAgICBpZDogcGF0aWVudElkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICB7XG4gICAgICAgIHVzZTogXCJvZmZpY2lhbFwiLFxuICAgICAgICBzeXN0ZW06IGxvb2tzTGlrZVR3TmF0aW9uYWxJZChyYXdJZClcbiAgICAgICAgICA/IHN5c3RlbXMuVFdfTkFUSU9OQUxfSURcbiAgICAgICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1BBVElFTlRfTVJOLFxuICAgICAgICB2YWx1ZTogcmF3SWQsXG4gICAgICB9LFxuICAgIF0sXG4gICAgbmFtZTogW25hbWVFbnRyeV0sXG4gICAgZ2VuZGVyOiBtYXBHZW5kZXIocmF3LmdlbmRlciksXG4gIH07XG5cbiAgY29uc3QgYmlydGhEYXRlID0gcmF3LmJpcnRoRGF0ZTtcbiAgaWYgKGJpcnRoRGF0ZSkgcmVzb3VyY2UuYmlydGhEYXRlID0gYmlydGhEYXRlO1xuXG4gIGlmIChwaG9uZSkge1xuICAgIHJlc291cmNlLnRlbGVjb20gPSBbeyBzeXN0ZW06IFwicGhvbmVcIiwgdXNlOiBcImhvbWVcIiwgdmFsdWU6IHBob25lIH1dO1xuICB9XG5cbiAgaWYgKGFkZHJlc3MpIHtcbiAgICByZXNvdXJjZS5hZGRyZXNzID0gW3sgdXNlOiBcImhvbWVcIiwgdGV4dDogYWRkcmVzcyB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLyoqXG4gKiBTcGxpdCBhIGZ1bGwgbmFtZSBpbnRvIFtmYW1pbHksIFtnaXZlbl1dIGZvciBGSElSIFBhdGllbnQubmFtZS5cbiAqXG4gKiBIZXVyaXN0aWNzOlxuICogICAtIENvbnRhaW5zIHdoaXRlc3BhY2UgXHUyMTkyIFdlc3Rlcm46IGxhc3QgdG9rZW4gPSBmYW1pbHksIHJlc3QgPSBnaXZlbi5cbiAqICAgLSBDSksgLyBzaW5nbGUtdG9rZW4gXHUyMTkyIGZpcnN0IGNoYXIgPSBmYW1pbHksIHJlbWFpbmRlciA9IGdpdmVuLlxuICogICAtIFwiVW5rbm93blwiIG9yIGVtcHR5IFx1MjE5MiBbXCJcIiwgW11dXG4gKlxuICogVHdvLWNoYXIgQ0pLIGZhbWlseSBuYW1lcyAoXHU2QjUwXHU5NjdELCBcdTUzRjhcdTk5QUMsIFx1MjAyNikgYXJlIE5PVCBhdXRvLWRldGVjdGVkLlxuICovXG5mdW5jdGlvbiBzcGxpdE5hbWUoZnVsbE5hbWU6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ1tdXSB7XG4gIGNvbnN0IG5hbWUgPSAoZnVsbE5hbWUgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIW5hbWUgfHwgbmFtZSA9PT0gXCJVbmtub3duXCIpIHJldHVybiBbXCJcIiwgW11dO1xuICBpZiAoL1xccy8udGVzdChuYW1lKSkge1xuICAgIGNvbnN0IHBhcnRzID0gbmFtZS5zcGxpdCgvXFxzKy8pO1xuICAgIHJldHVybiBbcGFydHNbcGFydHMubGVuZ3RoIC0gMV0hLCBwYXJ0cy5zbGljZSgwLCAtMSldO1xuICB9XG4gIC8vIENKSyBmYWxsYmFjayBcdTIwMTQgaXRlcmF0ZSBjb2RlcG9pbnRzLCBub3QgVVRGLTE2IGNvZGUgdW5pdHMsIHNvXG4gIC8vIHN1cnJvZ2F0ZS1wYWlyIGNoYXJhY3RlcnMgKHJhcmUgaW4gQ2hpbmVzZSBuYW1lcyBidXQgcG9zc2libGUpXG4gIC8vIGRvbid0IGdldCBzcGxpdCBtaWQtY2hhcmFjdGVyLlxuICBjb25zdCBjb2RlcG9pbnRzID0gQXJyYXkuZnJvbShuYW1lKTtcbiAgcmV0dXJuIGNvZGVwb2ludHMubGVuZ3RoID4gMSA/IFtjb2RlcG9pbnRzWzBdISwgW2NvZGVwb2ludHMuc2xpY2UoMSkuam9pbihcIlwiKV1dIDogW25hbWUsIFtdXTtcbn1cblxuZnVuY3Rpb24gbWFwR2VuZGVyKGdlbmRlcjogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IGcgPSB0eXBlb2YgZ2VuZGVyID09PSBcInN0cmluZ1wiID8gZ2VuZGVyLnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAoW1wibWFsZVwiLCBcIm1cIiwgXCJcdTc1MzdcIiwgXCJcdTc1MzdcdTYwMjdcIl0uaW5jbHVkZXMoZykpIHJldHVybiBcIm1hbGVcIjtcbiAgaWYgKFtcImZlbWFsZVwiLCBcImZcIiwgXCJcdTU5NzNcIiwgXCJcdTU5NzNcdTYwMjdcIl0uaW5jbHVkZXMoZykpIHJldHVybiBcImZlbWFsZVwiO1xuICByZXR1cm4gXCJ1bmtub3duXCI7XG59XG4iLCAiLy8gTkhJIEpTT04gXHUyMTkyIG5vcm1hbGl6ZWQgc2hhcGUgYWRhcHRlcnMuXG4vL1xuLy8gRXh0cmFjdGVkIGZyb20gYmFja2dyb3VuZC5qcyBzbyBlYWNoIGFkYXB0ZXIgY2FuIGJlIHVuaXQtdGVzdGVkIGluXG4vLyBpc29sYXRpb24uIGJhY2tncm91bmQuanMgaW1wb3J0cyBldmVyeXRoaW5nIGJlbG93OyB0aGUgbGl2ZSBTVyBnbHVlc1xuLy8gdGhlc2Ugb250byBmZXRjaGVkIHBheWxvYWRzIHZpYSB0aGUgZW5kcG9pbnQgcmVnaXN0cnkuXG4vL1xuLy8gV2h5IGV4dHJhY3Q6IHRoZSB2MC42LjEgbGFiK2ltYWdpbmcgZGF0ZS1maWVsZCBidWdzIChjb21taXRzIGIzNzg4NWYgL1xuLy8gOGMxOTkwMSkgc2hpcHBlZCBiZWNhdXNlIHRoZXNlIGZ1bmN0aW9ucyBoYWQgWkVSTyB0ZXN0IGNvdmVyYWdlIFx1MjAxNFxuLy8gYmFja2dyb3VuZC5qcyBjYW4ndCBiZSBsb2FkZWQgaW4gYSB0ZXN0IGVudmlyb25tZW50IChjaHJvbWUuKiBBUElzLFxuLy8gU1cgZ2xvYmFscyksIHNvIHRoZSBhZGFwdCogbG9naWMgcm9kZSBhbG9uZyB1bnRlc3RlZC4gUHVsbGluZyB0aGVtXG4vLyBpbnRvIGEgcHVyZS1mdW5jdGlvbiBtb2R1bGUgbGV0cyB2aXRlc3QgdmVyaWZ5IGZpZWxkLXByaW9yaXR5XG4vLyBkZWNpc2lvbnMgcm93LWJ5LXJvdy5cblxuLy8gQ29udmVydCBOSEkncyBcdTZDMTFcdTU3MEIgZGF0ZSBcIjExNS8wNS8wNVwiIFx1MjE5MiBJU08gXCIyMDI2LTA1LTA1XCIuXG4vLyBTb21lIE5ISSBmaWVsZHMgZW1iZWQgYm90aCBST0MgYW5kIEdyZWdvcmlhbjogXCIxMTUvMDUvMDV8fDIwMjYvMDUvMDVcIiBcdTIwMTQgd2Vcbi8vIGp1c3QgbWF0Y2ggdGhlIGZpcnN0IHNlZ21lbnQuXG5leHBvcnQgZnVuY3Rpb24gcm9jVG9JU08ocm9jRGF0ZSkge1xuICBpZiAoIXJvY0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKHJvY0RhdGUpLm1hdGNoKC9eKFxcZHsyLDN9KVsvLi1dKFxcZHsxLDJ9KVsvLi1dKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApICsgMTkxMTtcbiAgcmV0dXJuIGAke3l9LSR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LSR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gSW52ZXJzZTogSVNPIFwiMjAyMy0wNS0wNVwiIFx1MjE5MiBST0MgXCIxMTIvMDUvMDVcIi4gVXNlZCB0byBidWlsZCBOSEkgZGF0ZS1yYW5nZVxuLy8gcXVlcnkgc3RyaW5ncyAodGhlaXIgZm9ybXMgZXhwZWN0IFx1NkMxMVx1NTcwQiBmb3JtYXQpLlxuZXhwb3J0IGZ1bmN0aW9uIGlzb1RvUk9DKGlzb0RhdGUpIHtcbiAgaWYgKCFpc29EYXRlKSByZXR1cm4gXCJcIjtcbiAgY29uc3QgbSA9IFN0cmluZyhpc29EYXRlKS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApIC0gMTkxMTtcbiAgaWYgKHkgPCAxKSByZXR1cm4gXCJcIjsgLy8gcHJlLVx1NkMxMVx1NTcwQiBkYXRlcyBtYWtlIG5vIHNlbnNlIHRvIE5ISVxuICByZXR1cm4gYCR7eX0vJHttWzJdLnBhZFN0YXJ0KDIsIFwiMFwiKX0vJHttWzNdLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xufVxuXG4vLyBOSEkgYmlsaW5ndWFsIGZpZWxkcyB1c2UgXCJcdTRFMkRcdTY1ODd8fEVuZ2xpc2hcIiBcdTIwMTQgY2xpbmljaWFucyBzY2FuIEVuZ2xpc2ggZmFzdGVyLFxuLy8gc28gcHJlZmVyIHRoYXQgc2lkZS4gSWYgdGhlcmUncyBubyBgfHxgIHdlIGp1c3QgcmV0dXJuIHRoZSBpbnB1dCB0cmltbWVkLlxuZXhwb3J0IGZ1bmN0aW9uIHBpY2tFbmdsaXNoKHMpIHtcbiAgaWYgKHMgPT09IG51bGwgfHwgcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc3RyID0gU3RyaW5nKHMpO1xuICBjb25zdCBpZHggPSBzdHIuaW5kZXhPZihcInx8XCIpO1xuICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuIHN0ci50cmltKCk7XG4gIGNvbnN0IGVuID0gc3RyLnNsaWNlKGlkeCArIDIpLnRyaW0oKTtcbiAgcmV0dXJuIGVuIHx8IHN0ci5zbGljZSgwLCBpZHgpLnRyaW0oKTtcbn1cblxuLy8gU3RyaXAgdHJhaWxpbmcgcHVuY3R1YXRpb24gLyB3aGl0ZXNwYWNlIGp1bmsgdGhhdCBzb21lIGhvc3BpdGFscyBsZWF2ZVxuLy8gb24gdGhlaXIgZnJlZS10ZXh0IGxhYiBsYWJlbHMgKGUuZy4gTkhJIHJldHVybnMgXCJDcmVhLFwiIGZyb20gb25lIHNpdGVcbi8vIGFuZCBcIkNyZWFcIiBmcm9tIGFub3RoZXIgZm9yIHRoZSBzYW1lIHBoeXNpY2FsIHRlc3QpLiBQcmUtbm9ybWFsaXppbmdcbi8vIGhlcmUgbWVhbnMgdGhlIE9ic2VydmF0aW9uLmNvZGUudGV4dCBkb3duc3RyZWFtIHJlYWRzIGNsZWFubHkgZXZlblxuLy8gd2hlbiBkb3duc3RyZWFtIFVJcyBzdGlsbCBoYXBwZW4gdG8gcmVuZGVyIGBjb2RlLnRleHRgIGluc3RlYWQgb2Zcbi8vIHB1bGxpbmcgZGlzcGxheSBmcm9tIHRoZSBMT0lOQyAvIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgY29kaW5nLlxuZnVuY3Rpb24gX2NsZWFuTGFiTmFtZShzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIHJldHVybiBTdHJpbmcocylcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1ssXHVGRjBDO1x1RkYxQl0rXFxzKiQvLCBcIlwiKSAgLy8gdHJhaWxpbmcgXHU1MzRBXHU1RjYyIC8gXHU1MTY4XHU1RjYyIHB1bmN0dWF0aW9uXG4gICAgLnRyaW0oKTtcbn1cblxuLy8gQWRhcHRlciBmb3IgTkhJIGxhYi9vYnNlcnZhdGlvbiBKU09OIHNoYXBlIChjb25maXJtZWQgZm9yIElIS0UzNDA5UzAxO1xuLy8gb3RoZXIgbGFiIGVuZHBvaW50cyBsaWtlbHkgdXNlIHRoZSBzYW1lIGZpZWxkcykuXG4vL1xuLy8gRGF0ZSBmaWVsZCBjaG9pY2UgXHUyMDE0IElIS0UzNDA5IHJldHVybnMgdGhyZWUgZGF0ZS1pc2ggZmllbGRzIHBlciByb3c6XG4vLyAgIC0gZnVuQ19EQVRFICAgICAgICAgIFx1NUMzMVx1OEEzQVx1NjVFNSAvIFx1NTE2NVx1OTY2Mlx1NjVFNSAodmlzaXQgcmVnaXN0cmF0aW9uIC8gYWRtaXNzaW9uKVxuLy8gICAtIHJlYUxfSU5TUEVDVF9EQVRFICBcdTVCRTZcdTk2OUJcdTYzQTFcdTZBQTJcdTY1RTUgKGFjdHVhbCBzYW1wbGUtY29sbGVjdGlvbiBkYXRlKVxuLy8gICAtIGFzc2FZX1VQTE9BRF9EQVRFICBcdTRFMEFcdTUwQjNcdTY1RTUgKHdoZW4gdGhlIHJlc3VsdCBoaXQgTkhJJ3Mgc2VydmVyKVxuLy8gRm9yIGFuIGlucGF0aWVudCwgZnVuQ19EQVRFIGlzIHRoZSBhZG1pc3Npb24gZGF5IGFuZCBldmVyeSBsYWIgZHJhd25cbi8vIGR1cmluZyB0aGUgc3RheSBjYXJyaWVzIHRoZSBzYW1lIGZ1bkNfREFURSBcdTIwMTQgdXNpbmcgaXQgYXMgT2JzZXJ2YXRpb24uXG4vLyBlZmZlY3RpdmVEYXRlVGltZSBtYWRlIGFsbCBcdTRGNEZcdTk2NjJcdTY3MUZcdTk1OTMgbGFicyBsb29rIGxpa2UgdGhleSB3ZXJlIGRyYXduXG4vLyBvbiBkYXkgMS4gRkhJUidzIFwicGh5c2lvbG9naWNhbGx5IHJlbGV2YW50IHRpbWVcIiBmb3IgYSBsYWIgT2JzZXJ2YXRpb25cbi8vIGlzIHRoZSBzYW1wbGUtY29sbGVjdGlvbiBkYXRlLCBzbyBwcmVmZXIgcmVhTF9JTlNQRUNUX0RBVEUgd2hlbiBOSElcbi8vIHJldHVybnMgaXQ7IGZhbGwgYmFjayB0byBmdW5DX0RBVEUgb25seSB3aGVuIHRoZSBpbnNwZWN0IGZpZWxkIGlzXG4vLyBtaXNzaW5nIChvbGRlciByb3dzIC8gZW5kcG9pbnRzIHRoYXQgZG9uJ3QgY2FycnkgaXQpLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0TGFiSXRlbShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhcbiAgICBpdGVtLnJlYUxfSU5TUEVDVF9EQVRFIHx8IGl0ZW0ucmVhbF9pbnNwZWN0X2RhdGUgfHwgaXRlbS5mdW5DX0RBVEUsXG4gICk7XG4gIGNvbnN0IHZhbHVlID0gaXRlbS5hc3NhWV9WQUxVRTtcbiAgaWYgKCFkYXRlIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IFwiXCIpIHJldHVybiBudWxsO1xuICAvLyBEaXNwbGF5IG5hbWUgZmFsbGJhY2sgY2hhaW4gKGFsbCBub3JtYWxpemVkIGZvciB0cmFpbGluZyBwdW5jdHVhdGlvbik6XG4gIC8vICAgMS4gYXNzYVlfSVRFTV9OQU1FIFx1MjAxNCBob3NwaXRhbCdzIGZ1bGwgZnJlZS10ZXh0IGxhYmVsXG4gIC8vICAgMi4gb3JkZXJfc2hvcnRuYW1lIFx1MjAxNCBOSEkncyBVSS10cnVuY2F0ZWQgbGFiZWwgKG9mdGVuIGVuZHMgXCIuLi5cIilcbiAgLy8gICAzLiBvcmRlUl9OQU1FICAgICAgXHUyMDE0IE5ISSdzIGNhbm9uaWNhbCBcdTkxQUJcdTRFRTRcdTc4QkMgZGljdGlvbmFyeSBuYW1lXG4gIC8vIGFzc2FZX0lURU1fTkFNRSB3aW5zIGJ5IGRlZmF1bHQgYmVjYXVzZSBvcmRlcl9zaG9ydG5hbWUgY2FuIGJlIGN1dFxuICAvLyBvZmYgbWlkLXdvcmQgKFwiUEMgU3VnYXIgXHU5OEVGXHU1RjhDIC4uLlwiKSwgd2hpY2ggaXMgd29yc2UgdGhhbiBhIHRyYWlsaW5nLVxuICAvLyBjb21tYSBjb3NtZXRpYyBpc3N1ZS4gb3JkZVJfTkFNRSBpcyB0aGUgbGFzdC1yZXNvcnQgQ2hpbmVzZSBmb3JtYWxcbiAgLy8gbGFiZWwuXG4gIGNvbnN0IGZ1bGxOYW1lID0gX2NsZWFuTGFiTmFtZShpdGVtLmFzc2FZX0lURU1fTkFNRSlcbiAgICAgICAgICAgICAgICB8fCBfY2xlYW5MYWJOYW1lKGl0ZW0ub3JkZXJfc2hvcnRuYW1lKVxuICAgICAgICAgICAgICAgIHx8IF9jbGVhbkxhYk5hbWUoaXRlbS5vcmRlUl9OQU1FKTtcbiAgY29uc3Qgb3JkZXJDb2RlID0gU3RyaW5nKGl0ZW0ub3JkZVJfQ09ERSB8fCBcIlwiKS50cmltKCk7XG4gIHJldHVybiB7XG4gICAgZGF0ZSxcbiAgICBvcmRlcl9jb2RlOiBvcmRlckNvZGUsXG4gICAgb3JkZXJfbmFtZTogaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCIsXG4gICAgLy8gUHJlZmVyIHRoZSBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIChcIjA5MTQwQ1wiKSBhcyB0aGUgRkhJUiBjb2RpbmcgY29kZSBzbyB0aGVcbiAgICAvLyBkb3duc3RyZWFtIG9ic2VydmF0aW9uIG1hcHBlciByb3V0ZXMgaXQgdW5kZXIgTkhJX01FRElDQUxfT1JERVJfXG4gICAgLy8gQ09ERSBzeXN0ZW0uIFNNQVJUIGFwcHMgZ3JvdXAgbGFiIHRlc3RzIGJ5IGNvZGluZyBjb2RlOyB1c2luZ1xuICAgIC8vIGZyZWUtdGV4dCBoZXJlIGlzIHdoYXQgY2F1c2VzIFwiQ3JlYVwiIGFuZCBcIkNyZWEsXCIgdG8gYmUgc3BsaXRcbiAgICAvLyBpbnRvIHR3byBkaXN0aW5jdCB0ZXN0cy4gRmFsbGJhY2sgdG8gdGhlIGNsZWFuZWQgZGlzcGxheSB3aGVuXG4gICAgLy8gTkhJIGRvZXNuJ3Qgc3VwcGx5IGFuIG9yZGVyIGNvZGUgKG9sZGVyIC8gZWRnZS1jYXNlIHJvd3MpLlxuICAgIGNvZGU6IG9yZGVyQ29kZSB8fCBmdWxsTmFtZSxcbiAgICBkaXNwbGF5OiBmdWxsTmFtZSxcbiAgICB2YWx1ZTogU3RyaW5nKHZhbHVlKSxcbiAgICB1bml0OiBpdGVtLnVuaVRfREFUQSB8fCBcIlwiLFxuICAgIHJlZmVyZW5jZV9yYW5nZTogaXRlbS5jb25zdWxUX1ZBTFVFIHx8IGl0ZW0uc2hvcnRfQ09OU1VMVF9WQUxVRSB8fCBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwNlMwMSByZXR1cm5zIHZpc2l0LWxldmVsIHJvd3MgT05MWSAobm8gZHJ1ZyBuYW1lcykuIFRoZSBhY3R1YWwgZHJ1Z1xuLy8gbGlzdCBsaXZlcyBhdCBJSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD08cm93X0lEPiZjdHlwZT0yLCBpblxuLy8gYGloa2UzMzA2UzAyX21haW5fZGF0YVsqXS5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3RgLiBXZSBkbyB0aGF0IDItc3RlcFxuLy8gZmV0Y2ggc2VwYXJhdGVseTsgdGhpcyBmdW5jdGlvbiBhZGFwdHMgYSBzaW5nbGUgZHJ1ZyBlbnRyeSBnaXZlbiBpdHNcbi8vIHBhcmVudCB2aXNpdCBjb250ZXh0LlxuLy9cbi8vIERhdGUgc2VtYW50aWNzICh2YXJpZXMgYnkgdmlzaXQgdHlwZSBcdTIwMTQgdmlzaWJsZSB2aWEgdmlzaXQub3JpX1RZUEVfTkFNRSk6XG4vLyAgIC0gT1BEIC8gXHU4NUU1XHU1QzQwOiBmdW5jX0RBVEUgaXMgdGhlIG9ubHkgbWVhbmluZ2Z1bCBkYXRlLiBjdXJlX0VfREFURSBpc1xuLy8gICAgIGVtcHR5LiBhdXRob3JlZE9uID0gZnVuY19EQVRFIGlzIGFjY3VyYXRlLlxuLy8gICAtIFx1NEY0Rlx1OTY2MiAoaW5wYXRpZW50KTogTkhJIHJldHVybnMgT05FIHJvdyBwZXIgYWRtaXNzaW9uIHN1bW1hcmlzaW5nXG4vLyAgICAgZXZlcnkgZHJ1ZyB1c2VkIGR1cmluZyB0aGUgc3RheS4gZnVuY19EQVRFID0gYWRtaXNzaW9uIGRheSxcbi8vICAgICBjdXJlX0VfREFURSA9IGRpc2NoYXJnZSBkYXkuIE5ISSBkb2VzIG5vdCBwcmVzZXJ2ZSB0aGUgYWN0dWFsXG4vLyAgICAgYXV0aG9yZWQgZGF0ZSBvZiBlYWNoIGRydWcgXHUyMDE0IGEgUFBJIHN0YXJ0ZWQgb24gc3RheS1kYXkgMyBsb29rc1xuLy8gICAgIGlkZW50aWNhbCB0byBvbmUgcHJlc2NyaWJlZCBvbiBhZG1pc3Npb24gZGF5LlxuLy8gICAgIFdlIHN1cmZhY2UgZnVuY19EQVRFIFx1MjE5MiBhdXRob3JlZE9uIGFzIGEgYmVzdC1lZmZvcnQgYW5jaG9yIGFuZFxuLy8gICAgIEFERElUSU9OQUxMWSBlbWl0IGVuZF9kYXRlIHNvIHRoZSBkb3duc3RyZWFtIG1hcHBlciBjYW4gYXR0YWNoXG4vLyAgICAgZGlzcGVuc2VSZXF1ZXN0LnZhbGlkaXR5UGVyaW9kID0ge3N0YXJ0OiBmdW5jX0RBVEUsIGVuZDogY3VyZV9FX0RBVEV9LlxuLy8gICAgIENvbnN1bWVycyB0aGVuIHNlZSBcInRoaXMgZHJ1ZyB3YXMgdXNlZCBkdXJpbmcgYWRtaXNzaW9uIDUvMTgtNS8yMlwiXG4vLyAgICAgaW5zdGVhZCBvZiBcIjE0IGRydWdzIGFsbCBwcmVzY3JpYmVkIG9uIDUvMThcIi5cbi8vXG4vLyBEcnVnLXJvdyBvcmRlcl9kcnVnX2RheSBub3RlOiBpbnBhdGllbnQgcm93cyBzaGlwIFwiXHVGRjBEXCIgKGVtLWRhc2ggc2VudGluZWxcbi8vIGZvciBcIm5vIGRhdGFcIikgYmVjYXVzZSBOSEkgZG9lc24ndCB0cmFjayBwZXItZHJ1ZyBkYXktc3VwcGx5IGZvclxuLy8gaW5wYXRpZW50cy4gTnVtYmVyKFwiXHVGRjBEXCIpIGlzIE5hTjsgdGhlICFpc0Zpbml0ZSBicmFuY2ggc2VuZHMgaXQgdG8gMCxcbi8vIHdoaWNoIHRoZSBtYXBwZXIgdHJlYXRzIGFzIGZhbHN5IGFuZCBzbyBvbWl0cyBleHBlY3RlZFN1cHBseUR1cmF0aW9uIFx1MjAxNFxuLy8gY29ycmVjdDogYmV0dGVyIHNpbGVudCB0aGFuIGZhYnJpY2F0aW5nIGEgc3VwcGx5IGNvdW50LlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZHJ1ZywgdmlzaXQpIHtcbiAgaWYgKCFkcnVnIHx8IHR5cGVvZiBkcnVnICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgLy8gdmlzaXQuZnVuY19EQVRFIGlzIFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHJvY1RvSVNPIG1hdGNoZXMgdGhlIFJPQ1xuICAvLyBwcmVmaXggY29ycmVjdGx5LlxuICBjb25zdCBkYXRlID0gcm9jVG9JU08odmlzaXQ/LmZ1bmNfREFURSB8fCB2aXNpdD8uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBjb25zdCBkcnVnX25hbWUgPSBwaWNrRW5nbGlzaChkcnVnLmRydWdfbmFtZSB8fCBkcnVnLmRydUdfTkFNRSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlIHx8ICFkcnVnX25hbWUpIHJldHVybiBudWxsO1xuICAvLyBjdXJlX0VfREFURSBvbmx5IHBvcHVsYXRlZCBmb3IgaW5wYXRpZW50IHN1bW1hcnkgcm93czsgUk9DIGJpbGluZ3VhbFxuICAvLyB3aXRoIGVtcHR5IGhhbHZlcyAoXCJ8fFwiKSBwYXJzZXMgdG8gXCJcIiB3aGljaCB3ZSB3YW50LlxuICBjb25zdCBlbmRfZGF0ZSA9IHJvY1RvSVNPKHZpc2l0Py5jdXJlX0VfREFURSB8fCB2aXNpdD8uY3VyZV9lX2RhdGUgfHwgXCJcIik7XG4gIGNvbnN0IGRheXMgPSBOdW1iZXIoZHJ1Zy5vcmRlcl9kcnVnX2RheSB8fCBkcnVnLm9yZGVyX0RSVUdfREFZIHx8IDApO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgLy8gT25seSBlbWl0IHdoZW4gbWVhbmluZ2Z1bGx5IHBvcHVsYXRlZCBBTkQgZGlmZmVyZW50IGZyb20gc3RhcnQuXG4gICAgLy8gU3VwcHJlc3NpbmcgdGhlIHNhbWUtZGF5IGNhc2Uga2VlcHMgT1BEIC8gXHU4NUU1XHU1QzQwIHJlc291cmNlcyB0aWdodC5cbiAgICBlbmRfZGF0ZTogZW5kX2RhdGUgJiYgZW5kX2RhdGUgIT09IGRhdGUgPyBlbmRfZGF0ZSA6IFwiXCIsXG4gICAgZHJ1Z19uYW1lLFxuICAgIGNvZGU6IGRydWcub3JkZXJfY29kZSB8fCBkcnVnLm9yZGVSX0NPREUgfHwgXCJcIixcbiAgICAvLyBMaXN0IGVuZHBvaW50IGRvZXNuJ3QgZXhwb3NlIGRvc2UvZnJlcXVlbmN5L3JvdXRlIFx1MjAxNCBvbmx5IGRheXMgKyBxdHkuXG4gICAgZG9zZTogXCJcIixcbiAgICBmcmVxdWVuY3k6IFwiXCIsXG4gICAgcm91dGU6IFwiXCIsXG4gICAgcXVhbnRpdHk6IGRydWcub3JkZXJfcXR5IHx8IGRydWcub3JkZXJfUVRZIHx8IFwiXCIsXG4gICAgZHVyYXRpb25fZGF5czogTnVtYmVyLmlzRmluaXRlKGRheXMpID8gZGF5cyA6IDAsXG4gICAgLy8gcGlja0VuZ2xpc2ggb24gaWNkX25hbWUgdHVybnMgXHU4MjZGXHU2MDI3XHU2NTFEXHU4Qjc3XHU4MTdBLi4ufHxCZW5pZ24gcHJvc3RhdGljLi4uIGludG8gdGhlIEVOIHNpZGUuXG4gICAgaW5kaWNhdGlvbjogcGlja0VuZ2xpc2godmlzaXQ/LmljZDljbV9DT0RFX0NOQU1FIHx8IHZpc2l0Py5pY2Q5Y21fbmFtZSB8fCBcIlwiKSxcbiAgICBpbmRpY2F0aW9uX2NvZGU6IHZpc2l0Py5pY2Q5Y21fQ09ERSB8fCB2aXNpdD8uaWNkOWNtX2NvZGUgfHwgXCJcIixcbiAgICBkcnVnX2NsYXNzOiBwaWNrRW5nbGlzaChkcnVnLmFjdCB8fCBcIlwiKSxcbiAgICBob3NwaXRhbDogdmlzaXQ/Lmhvc3BfQUJCUiB8fCB2aXNpdD8uaG9zcF9hYmJyIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIFN0dWIga2VwdCBmb3IgdGhlIGVuZHBvaW50IHJlZ2lzdHJ5IFx1MjAxNCBJSEtFMzMwNlMwMSBsaXN0IG5ldmVyIGhhcyBkcnVncyxcbi8vIHNvIHdlIGFsd2F5cyByZXR1cm4gbnVsbCBhbmQgcmVseSBvbiB0aGUgMi1zdGVwIGRldGFpbCBmZXRjaCBhYm92ZS5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdE1lZGljYXRpb24oKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIFNhbWUgc2hhcGUgYXMgYWRhcHRNZWRpY2F0aW9uOiBJSEtFMzQwOFMwMSAoaW1hZ2luZyBsaXN0KSBvbmx5IGNhcnJpZXNcbi8vIG9yZGVyLWxldmVsIGRhdGE7IHRoZSBhY3R1YWwgcmVwb3J0IG5hcnJhdGl2ZSBjb21lcyBmcm9tIHRoZSBJSEtFMzQwOFMwMlxuLy8gZGV0YWlsIGZhbi1vdXQgKHNlZSBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsKS4gUmV0dXJuaW5nIG51bGwgZnJvbVxuLy8gdGhlIGxpc3QgYWRhcHRlciBlbnN1cmVzIG5vIGhhbGYtZm9ybWVkIERpYWdub3N0aWNSZXBvcnRzIGxlYWsgdGhyb3VnaC5cbmV4cG9ydCBmdW5jdGlvbiBhZGFwdEltYWdpbmdMaXN0U3R1YigpIHsgcmV0dXJuIG51bGw7IH1cblxuLy8gSUhLRTMyMDlTMDEgKFx1OTFDRFx1NTkyN1x1NTBCN1x1NzVDNSkgXHUyMDE0IE5ISSdzIG9mZmljaWFsbHktdmV0dGVkIGNhdGFzdHJvcGhpYy1pbGxuZXNzXG4vLyByZWdpc3RyeS4gRWFjaCByb3cgaXMgYSBzZXJpb3VzIGNocm9uaWMgY29uZGl0aW9uIChjYW5jZXIsIGF1dG9pbW11bmUsXG4vLyB0cmFuc3BsYW50IGZvbGxvdy11cCwgZGlhbHlzaXMsIGV0Yy4pIHRoZSBwYXRpZW50IGlzIGN1cnJlbnRseVxuLy8gcmVnaXN0ZXJlZCBmb3IuIFRoaXMgaXMgdGhlIGNsb3Nlc3QgdGhpbmcgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGV4cG9zZXMgdG8gYVxuLy8gY3VyYXRlZCBwcm9ibGVtIGxpc3QgXHUyMDE0IGZhciBzdHJvbmdlciBzaWduYWwgdGhhbiByZXZlcnNlLWVuZ2luZWVyaW5nXG4vLyBjaHJvbmljIGNvbmRpdGlvbnMgZnJvbSBlbmNvdW50ZXIgSUNEcy5cbi8vXG4vLyBNYXBzIHRvIEZISVIgQ29uZGl0aW9uIHdpdGggY2F0ZWdvcnk9cHJvYmxlbS1saXN0LWl0ZW0gc28gZG93bnN0cmVhbVxuLy8gU01BUlQgYXBwcyAvIElQUyBwcm9maWxlcyBzdXJmYWNlIGl0IGluIHRoZWlyIHByb2JsZW0tbGlzdCB2aWV3LlxuLy9cbi8vIFBheWxvYWQgc2hhcGUgKGxpdmUgY2FwdHVyZSk6XG4vLyAgIHNQX0lIS0UzMjA5UzAxOiBbXG4vLyAgICAgeyBob3NQX0lELCBob3NQX0FCQlIsIGhvc1BfVVJMLFxuLy8gICAgICAgaWNEMTBDTV9DTkFNRTogXCJcdTY1MURcdThCNzdcdTgxN0FcdTYwRTFcdTYwMjdcdTgxNkJcdTc2MjRcIiwgIFx1MjE5MCBDaGluZXNlIG5hcnJhdGl2ZSBvbmx5XG4vLyAgICAgICB2YWxpRF9TX0RBVEU6ICBcIjExMS8xMS8xNlwiLCAgICAgICBcdTIxOTAgY2VydGlmaWNhdGlvbiB2YWxpZC1mcm9tIChST0MpXG4vLyAgICAgICB2YWxpRF9FX0RBVEU6ICBcIjExNi8xMS8xNVwiIH0gICAgICBcdTIxOTAgY2VydGlmaWNhdGlvbiB2YWxpZC11bnRpbCAoUk9DLCB+NXkpXG4vLyAgIF1cbi8vXG4vLyBDYXZlYXRzIGRlbGliZXJhdGVseSBlbmNvZGVkOlxuLy8gICAtIE5ISSBkb2Vzbid0IHJldHVybiB0aGUgSUNELTEwLUNNIGNvZGUgaW4gdGhpcyBlbmRwb2ludCwgb25seSB0aGVcbi8vICAgICBDaGluZXNlIGxhYmVsLiBXZSBsZWF2ZSBgY29kZWAgZW1wdHk7IG1hcENvbmRpdGlvbiBmYWxscyBiYWNrIHRvXG4vLyAgICAgZGlzcGxheS1hcy1pZCBmb3Igc3RhYmxlSWQgKG1pcnJvcmluZyBkaWFnbm9zdGljLXJlcG9ydC50cykuXG4vLyAgIC0gdmFsaURfRV9EQVRFIGlzIHdoZW4gdGhlIENBUkQgZXhwaXJlcyAocmVuZXdlZCBldmVyeSB+NXkpLCBOT1Rcbi8vICAgICB3aGVuIHRoZSBkaXNlYXNlIHJlc29sdmVkLiBXZSBkZWxpYmVyYXRlbHkgZG8gTk9UIG1hcCBpdCB0b1xuLy8gICAgIGFiYXRlbWVudERhdGVUaW1lIFx1MjAxNCB0aGF0IHdvdWxkIGZhbHNlbHkgaW1wbHkgdGhlIGNvbmRpdGlvbiBzdG9wcGVkLlxuLy8gICAtIEFsbCByb3dzIGhlcmUgYXJlIGN1cnJlbnRseSBhY3RpdmUgYnkgZGVmaW5pdGlvbjsgTkhJIG9ubHkgcmV0dXJuc1xuLy8gICAgIHZhbGlkIGNlcnRpZmljYXRpb25zLiBjbGluaWNhbF9zdGF0dXMgaGFyZC1jb2RlZCB0byBcImFjdGl2ZVwiLlxuLy8gICAtIHNldmVyaXR5IHN0b3JlZCBhcyB0ZXh0IChcIlNldmVyZSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KVwiKSBiZWNhdXNlIHRoZSBmb3JtYWxcbi8vICAgICBzZXZlcml0eSBjb2RlIG1hcHBpbmcgKFNOT01FRCAyNDQ4NDAwMCBldGMuKSBuZWVkcyBtb3JlIHRob3VnaHQuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRDYXRhc3Ryb3BoaWNJbGxuZXNzKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGlzcGxheSA9IHBpY2tFbmdsaXNoKGl0ZW0uaWNEMTBDTV9DTkFNRSB8fCBpdGVtLmljZDEwY21fY25hbWUgfHwgXCJcIik7XG4gIGlmICghZGlzcGxheSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgZGlzcGxheSxcbiAgICBjb2RlOiBcIlwiLFxuICAgIHN5c3RlbTogXCJcIixcbiAgICBvbnNldF9kYXRlOiByb2NUb0lTTyhpdGVtLnZhbGlEX1NfREFURSB8fCBpdGVtLnZhbGlkX3NfZGF0ZSB8fCBcIlwiKSxcbiAgICByZWNvcmRlZF9kYXRlOiByb2NUb0lTTyhpdGVtLnZhbGlEX1NfREFURSB8fCBpdGVtLnZhbGlkX3NfZGF0ZSB8fCBcIlwiKSxcbiAgICBjYXRlZ29yeTogXCJwcm9ibGVtLWxpc3QtaXRlbVwiLFxuICAgIHNldmVyaXR5OiBcIlNldmVyZSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KVwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIGNsaW5pY2FsX3N0YXR1czogXCJhY3RpdmVcIixcbiAgfTtcbn1cblxuLy8gSUhLRTM0MDJTMDEgKFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NVx1N0Q1MFx1Njc5QykgXHUyMDE0IG9uZSByb3cgcGVyIHNjcmVlbmluZyBldmVudCwgZmxhdFxuLy8gc2NoZW1hLiBOSEkgcnVucyB0aGUgcGFuZWwgaXRzZWxmIGFuZCByZXR1cm5zIHZpdGFscyArIGEgZml4ZWRcbi8vIGJhdHRlcnkgb2YgbGFiIHZhbHVlcyBwcmUtY29tcHV0ZWQgKEJNSSAvIHdhaXN0IC8gQlAgLyBsaXBpZHMgLyBMRlRcbi8vIC8gUkZUIC8gZmFzdGluZyBnbHVjb3NlIC8gSEJzQWcgLyBBbnRpLUhDViAvIHVyaWMgYWNpZCBcdTIwMjYpLlxuLy8gV2UgdW5mb2xkIG9uZSByb3cgaW50byB+MTUgT2JzZXJ2YXRpb25zOiB2aXRhbHMgZ28gdG8gY2F0ZWdvcnlcbi8vIHZpdGFsLXNpZ25zIChzbyBTTUFSVCBhcHBzJyB2aXRhbHMgdmlld3MgcGljayB0aGVtIHVwKSwgbGFicyBnbyB0b1xuLy8gY2F0ZWdvcnkgbGFib3JhdG9yeS4gUmV0dXJucyBhbiBBUlJBWSBcdTIwMTQgY2FsbGVyIG11c3QgZmxhdC1tYXAuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRBZHVsdFByZXZlbnRpdmUocm93KSB7XG4gIGlmICghcm93IHx8IHR5cGVvZiByb3cgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08ocm93LmZpcnNUX0RJQUdfREFURSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaG9zcGl0YWwgPSByb3cuaG9zUF9BQkJSIHx8IHJvdy5ob3NwX0FCQlIgfHwgXCJcIjtcbiAgY29uc3Qgb3V0ID0gW107XG4gIC8vIChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBOSEkgY29kZSlcbiAgLy8gKGRpc3BsYXksIHZhbHVlLCB1bml0LCByZWZSYW5nZSwgY2F0ZWdvcnksIGNvZGUpXG4gIC8vIEV2ZXJ5IG9ic2VydmF0aW9uIGVtaXR0ZWQgZnJvbSB0aGlzIGFkYXB0ZXIgY2FycmllcyBzb3VyY2VfcHJvZ3JhbT1cbiAgLy8gXCJhZHVsdC1wcmV2ZW50aXZlXCIgc28gZG93bnN0cmVhbSBGSElSIGNvbnN1bWVycyBjYW4gaWRlbnRpZnkgdGhlXG4gIC8vIG9yaWdpbiBwcm9ncmFtbWUgdmlhIE9ic2VydmF0aW9uLm1ldGEudGFnIChzZXBhcmF0ZSBmcm9tIHRoZVxuICAvLyBzeW5jLXBhZ2UtdHlwZSAvIHN5bmMtcnVuLWlkIHN5bmMtdHJhY2tpbmcgdGFncykuXG4gIGZ1bmN0aW9uIHB1c2goZGlzcGxheSwgdmFsdWUsIHVuaXQsIHJlZlJhbmdlLCBjYXRlZ29yeSwgY29kZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm47XG4gICAgY29uc3QgdiA9IFN0cmluZyh2YWx1ZSkudHJpbSgpO1xuICAgIC8vIEVtLWRhc2ggXCJcdTIwMTRcIiAoVSsyMDE0KSBpcyBOSEkncyBzZW50aW5lbCBcIm5vIGRhdGFcIiBtYXJrZXIgXHUyMDE0IGRyb3AuXG4gICAgLy8gUGxhaW4gaHlwaGVuIFwiLVwiIGlzIE5PVCBhIG5vLWRhdGEgbWFya2VyIHBlci1maWVsZCBcdTIwMTQgaXQncyB0aGVcbiAgICAvLyBjbGluaWNhbCBkaXBzdGljayBjb252ZW50aW9uIGZvciBcIm5lZ2F0aXZlXCIgKFVyaW5lIFByb3RlaW4pLlxuICAgIC8vIE5ISSdzIG5vLWRhdGEgZmxhZyBmb3IgYW4gZW50aXJlIHJvdyBpcyBzaWduYWxsZWQgYnlcbiAgICAvLyBmaXJzVF9ESUFHX0RBVEUgPSBcIi1cIiB3aGljaCB0aGUgcm93LWxldmVsIGRhdGUgZ3VhcmQgYXQgdGhlIHRvcFxuICAgIC8vIG9mIGFkYXB0QWR1bHRQcmV2ZW50aXZlIGFscmVhZHkgcmVqZWN0cywgc28gXCItXCIgcmVhY2hpbmcgcHVzaCgpXG4gICAgLy8gYWx3YXlzIG1lYW5zIFwidGhlIGNsaW5pY2lhbiB3cm90ZSBpdCBkb3duIGFzIGEgbmVnYXRpdmUgcmVzdWx0XCIuXG4gICAgaWYgKHYgPT09IFwiXCIgfHwgdiA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgIG91dC5wdXNoKHtcbiAgICAgIGRhdGUsXG4gICAgICBob3NwaXRhbCxcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIixcbiAgICAgIG9yZGVyX2NvZGU6IGNvZGUgfHwgXCJcIixcbiAgICAgIG9yZGVyX25hbWU6IGRpc3BsYXksXG4gICAgICBjb2RlOiBjb2RlIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgICAgdmFsdWU6IHYsXG4gICAgICB1bml0OiB1bml0IHx8IFwiXCIsXG4gICAgICByZWZlcmVuY2VfcmFuZ2U6IHJlZlJhbmdlIHx8IFwiXCIsXG4gICAgICAvLyBTb3VyY2UtcHJvZ3JhbW1lIHRhZyBcdTIwMTQgYWRkZWQgdG8gT2JzZXJ2YXRpb24ubWV0YS50YWcgYnkgdGhlXG4gICAgICAvLyBtYXBwZXI7IGxldHMgU01BUlQgYXBwcyBmaWx0ZXIgLyBjYXRlZ29yaXplIFwidGhpcyBjYW1lIGZyb21cbiAgICAgIC8vIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NSBzY3JlZW5pbmdcIi5cbiAgICAgIHNvdXJjZV9wcm9ncmFtOiBcImFkdWx0LXByZXZlbnRpdmVcIixcbiAgICB9KTtcbiAgfVxuICAvLyBWaXRhbCBzaWducyAobm8gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBcdTIwMTQgdGhlc2UgYXJlIHNjcmVlbmluZyBtZWFzdXJlbWVudHMsIG5vdFxuICAvLyBsYWIgb3JkZXJzOyB0aGV5IGhhdmUgY2Fub25pY2FsIExPSU5DcyB3aGljaCBmaW5kTG9pbmMncyBrZXl3b3JkXG4gIC8vIHNlYXJjaCByZXNvbHZlcyBjbGVhbmx5IHZpYSB1bmlxdWUgdGVybXMgbGlrZSBcImJvZHkgaGVpZ2h0XCIgLyBcImJtaVwiXG4gIC8vIFx1MjAxNCBubyBwcmVmaXgtY29sbGlzaW9uIHJpc2sgd2l0aCBvdGhlciBMT0lOQ19NQVAga2V5cykuXG4gIHB1c2goXCJCb2R5IEhlaWdodFwiLCByb3cuaGVpZ2h0LCBcImNtXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJCb2R5IFdlaWdodFwiLCByb3cud2VpZ2h0LCBcImtnXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJCTUlcIiwgcm93LmJtaSwgXCJrZy9tMlwiLCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICBwdXNoKFwiV2Fpc3QgQ2lyY3VtZmVyZW5jZVwiLCByb3cud2Fpc3RsaW5lLCBcImNtXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJTeXN0b2xpYyBCbG9vZCBQcmVzc3VyZVwiLCByb3cuYmFzRV9TQlAsIFwibW1IZ1wiLFxuICAgICAgIHJvdy5ibG9EX1BSRVNTX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJEaWFzdG9saWMgQmxvb2QgUHJlc3N1cmVcIiwgcm93LmJhc0VfRUJQLCBcIm1tSGdcIixcbiAgICAgICByb3cuYmxvRF9QUkVTU19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcInZpdGFsLXNpZ25zXCIpO1xuICAvLyBBbGwgY2hlbWlzdHJ5IC8gaGVwIHBhbmVsIHJvd3MgcGluIHRoZSBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIHNvIGZpbmRMb2luYyB0YWtlc1xuICAvLyB0aGUgTkhJX1RPX0xPSU5DIGRpcmVjdC1sb29rdXAgcGF0aCBcdTIwMTQgYnlwYXNzZXMgdGhlIGtleXdvcmQgc2VhcmNoXG4gIC8vIGVudGlyZWx5LiBNYXBwaW5nIGNyb3NzLXZlcmlmaWVkIGFnYWluc3QgdGhyZWUgc291cmNlczogdGhlIE5ISSBVSVxuICAvLyBzZWN0aW9uIGxhYmVscyAoXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NSksIHRoZSBJSEtFMzQwMiBKU09OIGZpZWxkXG4gIC8vIG5hbWVzLCBhbmQgdGhlIGV4aXN0aW5nIE5ISV9UT19MT0lOQyB0YWJsZSBjb21tZW50cy5cbiAgLy9cbiAgLy8gTGlwaWQgcGFuZWxcbiAgcHVzaChcIkNob2xlc3Rlcm9sXCIsICAgcm93LmNobywgICAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDFDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDIwOTMtM1xuICBwdXNoKFwiVHJpZ2x5Y2VyaWRlXCIsICByb3cuYmxvRF9URywgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwNENcIik7ICAvLyBcdTIxOTIgTE9JTkMgMjU3MS04XG4gIHB1c2goXCJIRExcIiwgICAgICAgICAgIHJvdy5oZGwsICAgICBcIm1nL2RMXCIsIFwiXCIsIFwibGFib3JhdG9yeVwiLCBcIjA5MDQzQ1wiKTsgIC8vIFx1MjE5MiBMT0lOQyAyMDg1LTlcbiAgcHVzaChcIkxETFwiLCAgICAgICAgICAgcm93LmxkbCwgICAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwNDRDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDEzNDU3LTcgKGNhbGMpXG4gIC8vIExpdmVyIGZ1bmN0aW9uXG4gIHB1c2goXCJTR09UIChBU1QpXCIsICAgIHJvdy5zZ290LCAgICBcIlUvTFwiLCByb3cubEZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAyNUNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMTkyMC04XG4gIHB1c2goXCJTR1BUIChBTFQpXCIsICAgIHJvdy5zZ3B0LCAgICBcIlUvTFwiLCByb3cubEZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAyNkNcIik7ICAvLyBcdTIxOTIgTE9JTkMgMTc0Mi02XG4gIC8vIEZhc3RpbmcgZ2x1Y29zZVxuICBwdXNoKFwiR2x1LUFDXCIsICAgICAgICByb3cuc18wOTAwNUMsIFwibWcvZExcIixcbiAgICAgICByb3cuc18wOTAwNUNfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwNUNcIik7ICAgICAgICAvLyBcdTIxOTIgTE9JTkMgMTU1OC02XG4gIC8vIFJlbmFsIGZ1bmN0aW9uIFx1MjAxNCBgdXJpbkVfQlVOYCBpcyBOSEkncyBtaXNsZWFkaW5nIGZpZWxkIG5hbWU7IHRoZVxuICAvLyB2YWx1ZSBJUyBzZXJ1bSBCVU4gKEJsb29kIFVyZWEgTml0cm9nZW4pLCBub3QgYSB1cmluZSB0ZXN0LlxuICBwdXNoKFwiQlVOXCIsICAgICAgICAgICByb3cudXJpbkVfQlVOLCAgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMDJDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDMwOTQtMFxuICBwdXNoKFwiQ3JlYXRpbmluZVwiLCAgICByb3cuYmxvRF9DUkVBVCwgIFwibWcvZExcIiwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMDkwMTVDXCIpOyAgLy8gXHUyMTkyIExPSU5DIDIxNjAtMFxuICAvLyBlR0ZSIFx1MjAxNCBkZXJpdmVkIGZyb20gQ3JlYXRpbmluZSwgbm8gb3duIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMuIERpc3BsYXkga2V5d29yZFxuICAvLyBcImVnZnJcIiByZXNvbHZlcyB0byBMT0lOQyAzMzkxNC0zIHZpYSBmaW5kTG9pbmMuXG4gIHB1c2goXCJlR0ZSXCIsICAgICAgICAgIHJvdy5lZ2ZyLCAgICAgICAgXCJtTC9taW4vMS43M20yXCIsXG4gICAgICAgcm93LnJGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIC8vIFVyaW5lIFByb3RlaW4gZGlwc3RpY2sgXHUyMDE0IHF1YWxpdGF0aXZlIChcIi1cIiAvIFwiXHUwMEIxXCIgLyBcIjErXCIgLi4uKS5cbiAgLy8gdXJpbkVfUFJPVEVJTiBpcyB0aGUgc3RhdHVzIGNvZGUsIHVyaW5FX1BST1RFSU5fVEVYVCBpcyB0aGVcbiAgLy8gZGlzcGxheWFibGUgcmVzdWx0IChwYXNzZWQgYXMgdmFsdWUpLiBUaGUgc3BlY2lmaWMgTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBmb3JcbiAgLy8gcHJldmVudGl2ZS1zY3JlZW5pbmcgdXJpbmUgcHJvdGVpbiBpc24ndCBpbiBvdXIgTkhJX1RPX0xPSU5DIHRhYmxlXG4gIC8vIHlldDsgdGhlIGtleXdvcmQgXCJ1cmluZSBwcm90ZWluXCIgcmVzb2x2ZXMgdG8gTE9JTkMgMjA0NTQtNSB2aWFcbiAgLy8gZmluZExvaW5jIChhZnRlciB0aGUgdjAuNi43IGxvbmdlc3QtbWF0Y2ggZml4KS5cbiAgcHVzaChcIlVyaW5lIFByb3RlaW5cIiwgcm93LnVyaW5FX1BST1RFSU5fVEVYVCB8fCBcIlwiLCBcIlwiLCBcIlwiKTtcbiAgLy8gSGVwYXRpdGlzIEIvQyBzY3JlZW5pbmcgXHUyMDE0IHN0YXR1cyBjb2RlIHZzIF9URVhUIHRyYXAgZG9jdW1lbnRlZCBhdFxuICAvLyBsZW5ndGggYmVsb3cuIE5ISSBcdTkxQUJcdTRFRTRcdTc4QkMgcGlubmVkIHNvIGZpbmRMb2luYyB0YWtlcyB0aGUgTkhJX1RPX0xPSU5DXG4gIC8vIHBhdGggKG90aGVyd2lzZSB0aGUga2V5d29yZCBcImhiXCIgcHJlZml4LWNvbGxpZGVzIHdpdGggdGhlIG1vcmVcbiAgLy8gc3BlY2lmaWMgXCJoYnNhZ1wiIFx1MjAxNCB0aGUgYnVnIG9yaWdpbmFsbHkgcmVwb3J0ZWQgaW4gdjAuNi41KS5cbiAgLy8gICAxNDAzMkMgXHUyMTkyIExPSU5DIDUxOTYtMSAgKEhCc0FnLCBNYXNzL3ZvbClcbiAgLy8gICAxNDA1MUMgXHUyMTkyIExPSU5DIDEzOTU1LTAgKEhDViBhbnRpYm9keSwgU2VydW0gb3IgUGxhc21hKVxuICAvLyBIaXN0b3J5OiByZWdyZXNzZWQgaW4gdjAuNi4zLCBmaXggbG9zdCB1bnRpbCB2MC42LjU7IE5ISSBcdTkxQUJcdTRFRTRcdTc4QkNcbiAgLy8gcGlubmluZyBhZGRlZCB2MC42LjYgKyB2MC42LjguXG4gIHB1c2goXCJIQnNBZ1wiLCAgICByb3cuaGJzYUdfVEVYVCAgIHx8IFwiXCIsIFwiXCIsIHJvdy5oYlZfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJsYWJvcmF0b3J5XCIsIFwiMTQwMzJDXCIpO1xuICBwdXNoKFwiQW50aS1IQ1ZcIiwgcm93LmFudElfSENWX1RFWFQgfHwgXCJcIiwgXCJcIiwgcm93LmhjVl9SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIxNDA1MUNcIik7XG4gIC8vIFVyaWMgYWNpZCAoYmxvb2QpIFx1MjAxNCBgdXJpQ19BQ0lEYCBmaWVsZC4gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyAwOTAxM0MgXHUyMTkyIExPSU5DXG4gIC8vIDMwODQtMSAoVXJhdGUgTWFzcy92b2wgUy9QKS5cbiAgLy9cbiAgLy8gTkhJJ3MgSUhLRTM0MDIgc2NoZW1hIEFMU08gY2FycmllcyB0d28gcmVsYXRlZC1sb29raW5nLWJ1dC1kaXN0aW5jdFxuICAvLyBmaWVsZHMgd2UgZGVsaWJlcmF0ZWx5IHNraXA6XG4gIC8vICAgLSB1cmluRV9VQV9ESUFHX0FDSUQgXHUyMDE0IGVtcGlyaWNhbGx5IGR1cGxpY2F0ZXMgc2VydW0gdXJpYyBhY2lkO1xuICAvLyAgICAgZW1pdHRpbmcgaXQgd291bGQgY3JlYXRlIGEgZHVwbGljYXRlIE9ic2VydmF0aW9uLlxuICAvLyAgIC0gdXJpbkVfVUEgLyB1cmluRV9VQV9ESUFHX1JFU1VMVF9URVhUIFx1MjAxNCBjbGFpbSB0byBiZSBhIHVyaW5lIFVBXG4gIC8vICAgICBkaXBzdGljayBidXQgRE9OJ1QgYXBwZWFyIGFueXdoZXJlIGluIE5ISSdzIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSBVSSBmb3JcbiAgLy8gICAgIGFkdWx0IHByZXZlbnRpdmUgc2NyZWVuaW5nICh0aGUgXHU1QzNGXHU2REIyXHU2QUEyXHU2N0U1IHNlY3Rpb24gb25seSBzaG93c1xuICAvLyAgICAgXHU1QzNGXHU2REIyXHU4NkNCXHU3NjdEXHU4Q0VBKS4gQWx3YXlzIGVtcHR5IC8gXCItXCIgaW4gb2JzZXJ2ZWQgcGF5bG9hZHMuIExlZ2FjeVxuICAvLyAgICAgc2NoZW1hIGZpZWxkIHdpdGggbm8gY2xpbmljYWwgcmVhbGl0eSBcdTIwMTQgZG8gTk9UIGVtaXQuXG4gIHB1c2goXCJVcmljIEFjaWRcIiwgICAgIHJvdy51cmlDX0FDSUQsICAgXCJtZy9kTFwiLCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAxM0NcIik7XG4gIC8vIE1ldGFib2xpYyBzeW5kcm9tZSBzY3JlZW5pbmcgXHUyMDE0IHZhbHVlIGlzIGFuIGludGVycHJldGF0aW9uIHN0cmluZ1xuICAvLyAoJ1x1NkI2M1x1NUUzOCcgLyAnXHU3NTcwXHU1RTM4XHVGRjBDXHU1RUZBXHU4QjcwXHVGRjFBXHU4QUNCXHU2RDNEXHU4QTYyXHU5MUFCXHU1RTJCJyksIG5vdCBhIG51bWJlci4gVGhlIG1hcHBlcidzXG4gIC8vIF90cnlfcGFyc2VfcXVhbnRpdHkgd2lsbCByZXR1cm4gTm9uZSBhbmQgaXQgZmFsbHMgdGhyb3VnaCB0b1xuICAvLyB2YWx1ZVN0cmluZy4gTm8gbWFwcGVkIExPSU5DIGtleXdvcmQgKHlldCkgc28gdGhpcyBsYW5kcyBhcyBhblxuICAvLyBPYnNlcnZhdGlvbiB3aXRoIGNvZGUudGV4dCBvbmx5OyBkb3duc3RyZWFtIGNvbnN1bWVycyBjYW4gc3RpbGxcbiAgLy8gc3VyZmFjZSBpdCB1bmRlciB0aGUgcGF0aWVudCdzIHNjcmVlbmluZyBzZWN0aW9uIGJ5IGNvZGUudGV4dC5cbiAgcHVzaChcIlx1NEVFM1x1OEIxRFx1NzVDN1x1NTAxOVx1N0ZBNFx1N0JFOVx1NkFBMiAoTWV0YWJvbGljIFN5bmRyb21lIFNjcmVlbmluZylcIixcbiAgICAgICByb3cubWV0QV9TWU5EUl9SRVNVTFRfVEVYVCwgXCJcIiwgXCJcIik7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8vIElIS0UzMzA5UzAxIChcdTRGNEZcdTk2NjIgaW5wYXRpZW50IGxpc3QpIFx1MjAxNCBnaXZlcyBwcm9wZXIgYWRtaXNzaW9uL2Rpc2NoYXJnZS5cbi8vIFNoYXBlOiB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgaW5fREFURSwgb3V0X0RBVEUsXG4vLyAgICAgICAgIGljZDljbV9DT0RFLCBpY2Q5Y21fQ09ERV9DTkFNRSwgb3JpX1RZUEUoXCIzXCIpLCByb3dfSUQsIC4uLn1cbi8vIElIS0UzMzA4UzAxIGhhcyB0aGUgc2FtZSBzaGFwZSBmb3IgYSBzbWFsbCBzZXQgb2Ygb2xkZXIgXHU0RjRGXHU5NjYyIHJlY29yZHM7XG4vLyBgZnVuY19EQVRFYCBpbnN0ZWFkIG9mIGBpbl9EQVRFYCBpbiBzb21lIHJvd3MgXHUyMDE0IGFkYXB0ZXIgYWNjZXB0cyBib3RoLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0SW5wYXRpZW50RW5jb3VudGVyKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc3RhcnQgPSByb2NUb0lTTyhpdGVtLmluX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgXCJcIik7XG4gIGNvbnN0IGVuZCA9IHJvY1RvSVNPKGl0ZW0ub3V0X0RBVEUgfHwgXCJcIik7XG4gIGlmICghc3RhcnQpIHJldHVybiBudWxsO1xuICAvLyBpY2Q5Y20gbmFtZSBvbiBcdTRGNEZcdTk2NjIgbGlzdCBpcyBqdXN0IENoaW5lc2UgKG5vIHx8IEVuZ2xpc2ggc3BsaXQgb2JzZXJ2ZWQpLlxuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX25hbWUgfHwgXCJcIik7XG4gIHJldHVybiB7XG4gICAgZGF0ZTogc3RhcnQsXG4gICAgZW5kX2RhdGU6IGVuZCxcbiAgICBjbGFzczogXCJJTVBcIixcbiAgICB0eXBlX2Rpc3BsYXk6IFwiXHU0RjRGXHU5NjYyXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIHJvd19pZDogaXRlbS5yb3dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkgaXRlbSBzaGFwZSBcdTIwMTQgZmFyIG1vcmUgY29tcGxldGUgdGhhbiB0aGUgb2xkZXJcbi8vIElIS0UzMzAxUzAyIHZpc2l0IGxpc3QgKDUxIHZpc2l0cyB2cyA2IGZvciB0aGUgdGVzdCBwYXRpZW50KS4gTkhJJ3Ncbi8vIGNhbm9uaWNhbCBzb3VyY2Ugb2YgdHJ1dGggZm9yIFwiZXZlcnkgYmlsbGVkIGVuY291bnRlclwiLlxuLy8gICBob3NQX0lELCBob3NQX0FCQlIsIGhvc3BfdXJsXG4vLyAgIGZ1bkNfREFURSAgICAgICAgICAgICAgKFx1NkMxMVx1NTcwQiBZWVkvTU0vREQpXG4vLyAgIGljRDlDTV9DT0RFIC8gaWNEOUNNX0NPREVfQ05BTUVcbi8vICAgb3JJX1RZUEUgLyBvcmlfdHlwZV9uYW1lICAgKFwiSUNcdTUzNjFcdThDQzdcdTY1OTlcIiAvIFwiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIpIFx1MjAxNCBvcmlnaW4sIE5PVCBcdTk1ODAvXHU2MDI1L1x1NEY0RlxuLy8gICBwYXJ0X0FNVCwgYXBwbF9ET1QsIFx1MjAyNiAgIChiaWxsaW5nIFx1MjAxNCBkaXNjYXJkZWQpXG4vLyAgIHJvV19JRCAgICAgICAgICAgICAgICAgIGRldGFpbCBrZXkgZm9yIElIS0UzMzAzUzAyIGZhbi1vdXQgKFBoYXNlIEIpXG4vLyBXZSBkb24ndCBoYXZlIHZpc2l0IGNsYXNzIChcdTk1ODAvXHU2MDI1L1x1NEY0RikgYXQgdGhlIGxpc3QgbGV2ZWw7IHRoZSBTMDIgZGV0YWlsXG4vLyBoYXMgaG9zcF9EQVRBX1RZUEVfTkFNRSAoXCJcdTg5N0ZcdTkxQUJcIi9cIlx1NEUyRFx1OTFBQlwiL1wiXHU3MjU5XHU5MUFCXCIpLiBGb3Igbm93IGRlZmF1bHQgQU1CLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UoaXRlbSwgY2xhc3NIaW50KSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaWNkQ29kZSA9IGl0ZW0uaWNEOUNNX0NPREUgfHwgaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChcbiAgICBpdGVtLmljRDlDTV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fbmFtZSB8fCBcIlwiXG4gICk7XG4gIC8vIGNsYXNzIGRlZmF1bHRzIHRvIEFNQjsgSUhLRTMzMDNTMDIgZGV0YWlsIGZhbi1vdXQgbWF5IG92ZXJyaWRlIHRvXG4gIC8vIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRSAoXHU2MDI1XHU4QTNBIC8gXHU0RjRGXHU5NjYyKS5cbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGVuZF9kYXRlOiBcIlwiLFxuICAgIGNsYXNzOiBjbGFzc0hpbnQgfHwgXCJBTUJcIixcbiAgICAvLyBPcmlnaW4gbWFya2VyIGlzbid0IGEgY2xpbmljYWwgY2xhc3MsIGJ1dCBzdGFzaCBpdCBhcyB0eXBlX2Rpc3BsYXlcbiAgICAvLyBzbyBkb3duc3RyZWFtIHNlZXMgdGhlIE5ISSBsYWJlbCB3aXRob3V0IHVzIGludmVudGluZyBvbmUuXG4gICAgdHlwZV9kaXNwbGF5OiBpdGVtLm9yaV90eXBlX25hbWUgfHwgaXRlbS5vcklfVFlQRV9OQU1FIHx8IFwiXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc1BfQUJCUiB8fCBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIFBhc3MgdGhyb3VnaCBmb3IgdGhlIGV2ZW50dWFsIElIS0UzMzAzUzAyIGRldGFpbCBmZXRjaCAoUGhhc2UgQikuXG4gICAgcm93X2lkOiBpdGVtLnJvV19JRCB8fCBpdGVtLnJvd19pZCB8fCBcIlwiLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRhcHRBbGxlcmd5KGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgYWxsZXJnZW4gPVxuICAgIGl0ZW0uYWxsZXJnZW5fbmFtZSB8fCBpdGVtLmFsbGVSX05BTUUgfHwgaXRlbS5tZWRuYW1lIHx8XG4gICAgaXRlbS5kcnVHX05BTUUgfHwgaXRlbS5hbGxlcmdlbiB8fCBcIlwiO1xuICBpZiAoIWFsbGVyZ2VuKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICByZWNvcmRlZF9kYXRlOiByb2NUb0lTTyhpdGVtLmZ1bkNfREFURSB8fCBpdGVtLnJlY29yRF9EQVRFIHx8IFwiXCIpLFxuICAgIGRpc3BsYXk6IGFsbGVyZ2VuLFxuICAgIGNhdGVnb3J5OiBcIm1lZGljYXRpb25cIixcbiAgICBjcml0aWNhbGl0eTogXCJ1bmFibGUtdG8tYXNzZXNzXCIsXG4gICAgcmVhY3Rpb246IGl0ZW0ucmVhY3Rpb04gfHwgaXRlbS5zeW1wdG9tIHx8IFwiXCIsXG4gIH07XG59XG5cbi8vIElIS0UzMzAxUzA1IChcdTg2NTVcdTdGNkUvXHU2MjRCXHU4ODUzIGxpc3QpIGlzIG1ldGFkYXRhLW9ubHk6XG4vLyAgIHtob3NwX2lkLCBob3NwX2FiYnIsIGhvc3BfdXJsLCBvcmlfdHlwZV9uYW1lLCBvcmlfdHlwZSwgZnVuY19kYXRlLFxuLy8gICAgb3V0X2RhdGUsIGljZDljbV9jb2RlLCBpY2Q5Y21fY29kZV9jbmFtZSwgb3BfY29kZV9jbmFtZSwgcm93X2lkfVxuLy8gTm8gcHJvY2VkdXJlIENPREUgKElDRC0xMC1QQ1MpIGFuZCBubyBhY3R1YWwgZXhhbS1kYXRlLiBUaGUgcHJvY2VkdXJlXG4vLyBDT0RFICsgZXhlX1NfREFURSBvbmx5IHNob3cgdXAgb24gdGhlIElIS0UzMzA4UzAyIGRldGFpbCBlbmRwb2ludFxuLy8gKGFuYWxvZ291cyB0byBJSEtFMzQwOFMwMSBpbWFnaW5nIGxpc3QgXHUyMTkyIFMwMiBkZXRhaWwpLiBXZSBkbyBhIDItc3RlcFxuLy8gZmFuLW91dCBmcm9tIHRoZSBsaXN0J3Mgcm93X0lEOyB0aGUgbGlzdCBhZGFwdGVyIHRoZXJlZm9yZSByZXR1cm5zXG4vLyBudWxsIGFuZCB0aGUgcmVhbCB3b3JrIGhhcHBlbnMgaW4gYWRhcHRQcm9jZWR1cmVGcm9tRGV0YWlsIGJlbG93LlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0UHJvY2VkdXJlTGlzdFN0dWIoKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIElIS0UzMzA4UzAyIChcdTg2NTVcdTdGNkUvXHU2MjRCXHU4ODUzIGRldGFpbCkgc2hhcGUgKHBlciByb3cgaW4gaWhrZTMzMDhTMDJfbWFpbl9kYXRhKTpcbi8vICAge3Jvd2lkLCBtYWluX3RpdCAoXCIxMDUvMDkvMjMgfiAxMDUvMDkvMjZcdUZGNUNcdTRGNEZcdTk2NjJcIiBvciBcIjEwNS8wMS8xNFx1RkY1Q1x1OTU4MFx1OEEzQVwiKSxcbi8vICAgIGhvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIG9yaV9UWVBFX05BTUUsIG9yaV9UWVBFLFxuLy8gICAgaWNkOWNtX0NPREUsIGljZDljbV9DT0RFX0NOQU1FLCAgICAgICAgIFx1MjE5MCByZWFzb24gZm9yIHByb2NlZHVyZVxuLy8gICAgb3BfQ09ERSwgICAgb3BfQ09ERV9DTkFNRSwgICAgICAgICAgICAgIFx1MjE5MCBJQ0QtMTAtUENTICsgYmlsaW5ndWFsIGxhYmVsXG4vLyAgICBmdW5jX0RBVEUsIGZ1bmNfU0VRX05PLCBwYXJ0X0FNVCwgYXBwbF9ET1QsXG4vLyAgICBzcF9JSEtFMzMwOFMwNF9kYXRhX2xpc3Q6IFt7XG4vLyAgICAgICBleGVfU19EQVRFIChcIllZWS9NTS9ERHx8WVlZWS9NTS9ERFwiKSwgIFx1MjE5MCBhY3R1YWwgZXhlY3V0aW9uIGRhdGVcbi8vICAgICAgIG9yZGVyX0NPREVfTkFNRSAoYmlsaW5ndWFsKSwgICAgICAgICAgIFx1MjE5MCBOSEkgYmlsbGluZy1pdGVtIG5hbWVcbi8vICAgICAgIG9yZGVyX0NPREUsICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1MjE5MCBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDXG4vLyAgICB9LCAuLi5dfVxuLy9cbi8vIERhdGUgZmllbGQgY2hvaWNlIFx1MjAxNCBJSEtFMzMwOFMwMiBkZXRhaWwgZXhwb3Nlczpcbi8vICAgLSBzcF9JSEtFMzMwOFMwNF9kYXRhX2xpc3RbXS5leGVfU19EQVRFIFx1MjAxNCBcdTU3RjdcdTg4NENcdThENzdcdTU5Q0JcdTY1RTU7IHRoaXMgaXMgdGhlXG4vLyAgICAgICAgICAgICAgICAgICAgICBhY3R1YWwgZGF5IHRoZSBwYXRpZW50IGhhZCB0aGUgcHJvY2VkdXJlLiBGb3Jcbi8vICAgICAgICAgICAgICAgICAgICAgIGlucGF0aWVudCBwcm9jZWR1cmVzIChhZG1pdCBNLzAxLCBzdXJnZXJ5IE0vMDUsXG4vLyAgICAgICAgICAgICAgICAgICAgICBkaXNjaGFyZ2UgTS8xMCkgZXhlX1NfREFURSA9IE0vMDUgXHUyMDE0IGNvcnJlY3QuXG4vLyAgIC0gZnVuY19EQVRFICAgICAgIFx1MjAxNCBvcmRlci92aXNpdCBhbmNob3IgZGF5IChcdTk1ODBcdThBM0FcdTk1OEJcdTU1QUVcdTY1RTUgLyBcdTUxNjVcdTk2NjJcdTY1RTUpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgc2FtZSB3cm9uZy1hbmNob3IgcGF0dGVybiBhcyBpbWFnaW5nIFx1MjAxNCB1c2luZyBpdFxuLy8gICAgICAgICAgICAgICAgICAgICAgZm9yIGlucGF0aWVudCBwcm9jZWR1cmVzIHNoaWZ0cyB0aGUgZXhhbSBiYWNrXG4vLyAgICAgICAgICAgICAgICAgICAgICB0byB0aGUgYWRtaXNzaW9uIGRheS5cbi8vIEZhbGxiYWNrIGNoYWluOiBmaXJzdCBzdWItbGlzdCBlbnRyeSdzIGV4ZV9TX0RBVEUgXHUyMTkyIGZ1bmNfREFURS5cbi8vXG4vLyBGSElSIGNvZGluZyBzdHJhdGVneTpcbi8vICAgLSBQcm9jZWR1cmUuY29kZSBjb2RpbmcgdXNlcyBvcF9DT0RFIChJQ0QtMTAtUENTKSBhcyB0aGUgcHJpbWFyeVxuLy8gICAgIGNvZGVkIHZhbHVlIHdpdGggc3lzdGVtPWljZC0xMC1wY3MgXHUyMDE0IHdhcyBwcmV2aW91c2x5IHRoZSBlbXB0eVxuLy8gICAgIHN0cmluZyBiZWNhdXNlIHRoZSBsaXN0IGVuZHBvaW50IG5ldmVyIGNhcnJpZXMgaXQuXG4vLyAgIC0gaWNkOWNtX0NPREUgKyBDTkFNRSBtYXAgdG8gYSBSZWFzb246IHByZWZpeCBpbiB0aGUgbm90ZSAoc2FtZVxuLy8gICAgIHBhdHRlcm4gdGhlIG9sZCBhZGFwdGVyIHVzZWQpIHNvIHRoZSBtYXBwZXIncyBcIm5vIG5vdGUgXHUyMTkyIGRyb3BcIlxuLy8gICAgIGZpbHRlciBrZWVwcyBiZW5pZ24gcm93cyBvdXQgd2hpbGUgbGV0dGluZyBnZW51aW5lIHByb2NlZHVyZXNcbi8vICAgICBwYXNzLlxuLy8gICAtIFN1Yi1saXN0IGVudHJpZXMnIG9yZGVyX0NPREVfTkFNRSArIG9yZGVyX0NPREUgZ28gaW50byB0aGUgbm90ZVxuLy8gICAgIGFzIFx1NjVCRFx1NEY1QzogbGluZXMgc28gU01BUlQgYXBwcyBjYW4gc2hvdyB0aGUgTkhJIGJpbGxpbmcgYnJlYWtkb3duLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0UHJvY2VkdXJlRnJvbURldGFpbChpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHN1Ykxpc3QgPSBBcnJheS5pc0FycmF5KGl0ZW0uc3BfSUhLRTMzMDhTMDRfZGF0YV9saXN0KVxuICAgID8gaXRlbS5zcF9JSEtFMzMwOFMwNF9kYXRhX2xpc3RcbiAgICA6IFtdO1xuICAvLyBleGVfU19EQVRFIGZvcm1hdCBpcyBcIjExNS8wOS8yM3x8MjAyNi8wOS8yM1wiOyByb2NUb0lTTyBhbHJlYWR5XG4gIC8vIG1hdGNoZXMgdGhlIGZpcnN0IFJPQyBzZWdtZW50LCBzbyBmZWVkaW5nIHRoZSB3aG9sZSBzdHJpbmcgd29ya3MuXG4gIGNvbnN0IGV4ZURhdGUgPSBzdWJMaXN0Lmxlbmd0aCA+IDBcbiAgICA/IChzdWJMaXN0WzBdLmV4ZV9TX0RBVEUgfHwgc3ViTGlzdFswXS5leGVfc19kYXRlIHx8IFwiXCIpXG4gICAgOiBcIlwiO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oZXhlRGF0ZSB8fCBpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgLy8gb3BfQ09ERV9DTkFNRSBpcyBcIjxDT0RFPi88XHU0RTJEXHU2NTg3Pnx8PENPREU+LzxFbmdsaXNoPlwiLiBUYWtlIHRoZVxuICAvLyBFbmdsaXNoIGhhbGYsIHN0cmlwIHRoZSBsZWFkaW5nIFwiPENPREU+L1wiIHNvIHRoZSBkaXNwbGF5IHJlYWRzXG4gIC8vIGxpa2UgXCJFeGNpc2lvbiBvZiBMZWZ0IFZpdHJlb3VzLCBQZXJjdXRhbmVvdXMgQXBwcm9hY2hcIiByYXRoZXJcbiAgLy8gdGhhbiBcIjA4QjUzWlovRXhjaXNpb24gb2YgTGVmdCBWaXRyZW91c1x1MjAyNlwiLlxuICBjb25zdCBvcENvZGUgPSBpdGVtLm9wX0NPREUgfHwgaXRlbS5vcF9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IG9wTmFtZSA9IHBpY2tFbmdsaXNoKGl0ZW0ub3BfQ09ERV9DTkFNRSB8fCBpdGVtLm9wX2NvZGVfY25hbWUgfHwgXCJcIik7XG4gIGNvbnN0IGRpc3BsYXkgPSAob3BOYW1lLnJlcGxhY2UoL15bQS1aMC05XStcXC8vLCBcIlwiKSB8fCBcIlwiKS50cmltKCkgfHwgb3BOYW1lLnRyaW0oKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5KSByZXR1cm4gbnVsbDtcblxuICBjb25zdCByZWFzb25Db2RlID0gaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IHJlYXNvbk5hbWUgPVxuICAgIChwaWNrRW5nbGlzaChpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX2NvZGVfY25hbWUgfHwgXCJcIikgfHwgXCJcIilcbiAgICAgIC5yZXBsYWNlKC9eW0EtWjAtOV0rXFwvLywgXCJcIilcbiAgICAgIC50cmltKCk7XG4gIGNvbnN0IG5vdGVQYXJ0cyA9IFtdO1xuICBpZiAocmVhc29uTmFtZSkge1xuICAgIG5vdGVQYXJ0cy5wdXNoKHJlYXNvbkNvZGUgPyBgUmVhc29uOiAke3JlYXNvbkNvZGV9ICR7cmVhc29uTmFtZX1gIDogYFJlYXNvbjogJHtyZWFzb25OYW1lfWApO1xuICB9XG4gIGZvciAoY29uc3Qgc3ViIG9mIHN1Ykxpc3QpIHtcbiAgICBjb25zdCBzdWJOYW1lID0gcGlja0VuZ2xpc2goc3ViLm9yZGVyX0NPREVfTkFNRSB8fCBzdWIub3JkZXJfY29kZV9uYW1lIHx8IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCBzdWJDb2RlID0gc3ViLm9yZGVyX0NPREUgfHwgc3ViLm9yZGVyX2NvZGUgfHwgXCJcIjtcbiAgICBpZiAoc3ViTmFtZSkge1xuICAgICAgbm90ZVBhcnRzLnB1c2goc3ViQ29kZSA/IGBcdTY1QkRcdTRGNUM6ICR7c3ViTmFtZX0gKE5ISSAke3N1YkNvZGV9KWAgOiBgXHU2NUJEXHU0RjVDOiAke3N1Yk5hbWV9YCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IG9wQ29kZSxcbiAgICAvLyBIaW50IGZvciBtYXBQcm9jZWR1cmUubWFwU3lzdGVtIFx1MjAxNCBcImljZC0xMC1wY3NcIiBzdHJpbmcgY29udGFpbnNcbiAgICAvLyBcImljZFwiLCBzbyB0aGUgbWFwcGVyIGFzc2lnbnMgc3lzdGVtcy5JQ0RfMTBfUENTLlxuICAgIHN5c3RlbTogb3BDb2RlID8gXCJpY2QtMTAtcGNzXCIgOiBcIlwiLFxuICAgIGRpc3BsYXksXG4gICAgbm90ZTogbm90ZVBhcnRzLmpvaW4oXCIgLyBcIiksXG4gICAgYm9keV9zaXRlOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzQwOFMwMSAoXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1IGxpc3QpIHNoYXBlOlxuLy8gICB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgcmVhbF9JTlNQRUNUX0RBVEUsIG9yZGVyX0NPREUsXG4vLyAgICBvcmRlcl9DT0RFXzJXb3JkLCBvcmRlcl9OQU1FLCBvcmlfVFlQRSwgcm93X0lELCBqcEdfU1RBVFVTLCAuLi59XG4vLyBObyBmaW5kaW5ncy9jb25jbHVzaW9uIFx1MjAxNCBsaXN0IGlzIG9yZGVyLWxldmVsIG9ubHkuIFdlIG1hcCB0byBQcm9jZWR1cmVcbi8vIChhbiBleGFtIHdhcyBwZXJmb3JtZWQpIHJhdGhlciB0aGFuIERpYWdub3N0aWNSZXBvcnQgKHdoaWNoIG5lZWRzIGFcbi8vIG5hcnJhdGl2ZSkuIElmL3doZW4gd2UgZmV0Y2ggdGhlIGFjdHVhbCByZXBvcnQgdGhpcyBiZWNvbWVzIGEgRFIuXG4vLyBJSEtFMzQwOFMwMiBkZXRhaWwgcHJvdmlkZXMgdGhlIGZ1bGwgcmFkaW9sb2d5IC8gZW5kb3Njb3B5IHJlcG9ydCBpblxuLy8gYGRlc2NgLiBDb21iaW5lZCB3aXRoIG9yZGVyX05BTUUgKyB0aGUgZXhhbSBkYXRlIHRoaXMgaXMgYSBwcm9wZXIgRkhJUlxuLy8gRGlhZ25vc3RpY1JlcG9ydC4gTGlzdC1vbmx5IGVudHJpZXMgKHdoZXJlIHRoZSBkZXRhaWwgZmV0Y2ggcmV0dXJuZWRcbi8vIG5vIGBkZXNjYCkgZ2V0IGRyb3BwZWQgXHUyMDE0IHdpdGhvdXQgYSBuYXJyYXRpdmUgdGhlIHJlcG9ydCBtYXBwZXIgd291bGRcbi8vIHJlamVjdCB0aGVtIGFueXdheS5cbi8vXG4vLyBEYXRlIGZpZWxkIGNob2ljZSBcdTIwMTQgSUhLRTM0MDhTMDIgZGV0YWlsIHBheWxvYWQgZXhwb3NlcyAoaW4gb3JkZXJcbi8vIG9mIGFjY3VyYWN5IGZvciBcIndoZW4gZGlkIHRoZSBwYXRpZW50IGFjdHVhbGx5IGhhdmUgdGhlIGV4YW1cIik6XG4vLyAgIC0gcmVhbF9JTlNQRUNUX0RBVEUgIFx1NUJFNlx1OTY5Qlx1NjNBMVx1NkFBMi9cdTUwNUFcdTVGNzFcdTUwQ0ZcdTY1RTUgXHUyMDE0IG1vc3QgYWNjdXJhdGUgYnV0IE5ISVxuLy8gICAgICAgICAgICAgICAgICAgICAgICBjb21tb25seSBzaGlwcyB0aGlzIGFzIG51bGwgb24gUzAyIGRldGFpbFxuLy8gICAtIG1haW5fdGl0ICAgICAgICAgICBcdTdDM0RcdTY1MzZcdTY1RTUgXHUyMDE0IHRoZSBjYXJkJ3MgcHJvbWluZW50IGhlYWRlciBkYXRlXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGluIE5ISSdzIG93biBVSS4gU2VtYW50aWNhbGx5IHRoaXMgaXMgd2hlblxuLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXhhbSB3YXMgcGVyZm9ybWVkIGFuZCBzaWduZWQgb2ZmIChOT1Rcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdGhlIG9yZGVyIGRheSkuIENsb3Nlc3QgcHJveHkgd2hlblxuLy8gICAgICAgICAgICAgICAgICAgICAgICByZWFsX0lOU1BFQ1RfREFURSBpcyBudWxsLlxuLy8gICAtIGZ1bmNfREFURSAgICAgICAgICBcdTk1ODBcdThBM0FcdTk1OEJcdTU1QUVcdTY1RTUgKE9QRCkgLyBcdTUxNjVcdTk2NjJcdTY1RTUgKGlucGF0aWVudCkgXHUyMDE0IHRoZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICBkYXRlIHRoZSBvcmRlciB3YXMgd3JpdHRlbiwgTk9UIHRoZSBkYXRlXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBleGFtIGhhcHBlbmVkLiBGb3IgT1BEIGltYWdpbmcgdGhhdCBpc1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZWQgbGF0ZXIgKGUuZy4gZWNobyBvcmRlcmVkIDEvMzEsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgMi8yOSkgdXNpbmcgZnVuY19EQVRFIHNoaWZ0cyB0aGUgZXhhbVxuLy8gICAgICAgICAgICAgICAgICAgICAgICBiYWNrIHRvIHRoZSBvcmRlciBkYXkgXHUyMDE0IHdyb25nLlxuLy8gICAtIGFzc2F5X1VQTE9BRF9EQVRFICBOSEkgXHU2NTM2XHU2QTk0XHU2NjQyXHU5NTkzIFx1MjAxNCBpbnRlcm5hbCBkYXRhLXBpcGVsaW5lXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDsgYmVsb25ncyB0byBEaWFnbm9zdGljUmVwb3J0Lmlzc3VlZC5cbi8vIEZhbGxiYWNrIGNoYWluOiByZWFsX0lOU1BFQ1RfREFURSBcdTIxOTIgbWFpbl90aXQgXHUyMTkyIGZ1bmNfREFURS4gbWFpbl90aXRcbi8vIGdvZXMgYWJvdmUgZnVuY19EQVRFIGJlY2F1c2UgbWFpbl90aXQgSVMgd2hhdCBOSEkgaXRzZWxmIGRpc3BsYXlzXG4vLyB0byB0aGUgcGF0aWVudCBhcyBcInRoaXMgcmVwb3J0J3MgZGF0ZVwiIGFuZCByZWZsZWN0cyB0aGUgc2lnbi1vZmYgL1xuLy8gZXhhbSBkYXkuIGZ1bmNfREFURSByZW1haW5zIGFzIGxhc3QgcmVzb3J0IHNvIGEgbWFsZm9ybWVkIHJvd1xuLy8gd2l0aG91dCBtYWluX3RpdCBzdGlsbCBwcm9kdWNlcyBzb21lIGRhdGUgaW5zdGVhZCBvZiBiZWluZyBkcm9wcGVkLlxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oXG4gICAgaXRlbS5yZWFsX0lOU1BFQ1RfREFURSB8fCBpdGVtLnJlYWxfaW5zcGVjdF9kYXRlIHx8XG4gICAgaXRlbS5tYWluX3RpdCB8fCBpdGVtLm1haW5fVElUIHx8XG4gICAgaXRlbS5mdW5jX0RBVEUgfHwgaXRlbS5mdW5jX2RhdGUgfHwgXCJcIixcbiAgKTtcbiAgY29uc3QgZGlzcGxheSA9IHBpY2tFbmdsaXNoKGl0ZW0ub3JkZXJfTkFNRSB8fCBpdGVtLm9yZGVyX25hbWUgfHwgXCJcIik7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoaXRlbS5kZXNjIHx8IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5IHx8ICFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IGl0ZW0ub3JkZXJfQ09ERSB8fCBpdGVtLm9yZGVyX2NvZGUgfHwgXCJcIixcbiAgICBzeXN0ZW06IFwiXCIsXG4gICAgZGlzcGxheSxcbiAgICBjYXRlZ29yeTogXCJSQURcIixcbiAgICBjb25jbHVzaW9uLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIE5ISSBzZXBhcmF0ZXMgdGhlIGV4YW0gZGF0ZSAoZnVuY19EQVRFKSBmcm9tIHRoZSByZXBvcnQtdXBsb2FkXG4gICAgLy8gdGltZXN0YW1wIChhc3NheV9VUExPQURfREFURSkuIFRoZSBsYXR0ZXIgaXMgd2hlbiB0aGUgcmVwb3J0XG4gICAgLy8gd2FzIGZpbmFsaXNlZCBpbiBOSEkncyBzeXN0ZW0gXHUyMDE0IG1hcHMgdG8gRGlhZ25vc3RpY1JlcG9ydC5pc3N1ZWQuXG4gICAgLy8gRmFsbHMgYmFjayB0byBOb25lIGlmIE5ISSBkaWRuJ3Qgc2hpcCBvbmUuXG4gICAgaXNzdWVkOiByb2NUb0lTTygoaXRlbS5hc3NheV9VUExPQURfREFURSB8fCBcIlwiKS5zcGxpdCgvXFxzKy8pWzBdKSxcbiAgfTtcbn1cbiIsICIvLyBOSEkgQVBJIGVuZHBvaW50IHJlZ2lzdHJ5IFx1MjAxNCB3aGF0IHdlIGZldGNoLCB3aGVyZSBlYWNoIHJvdyBnb2VzLFxuLy8gd2hpY2ggYWRhcHRlciB0byBjYWxsIG9uIGl0LlxuLy9cbi8vIEV4dHJhY3RlZCBmcm9tIGJhY2tncm91bmQuanMgc28gd2UgY2FuOlxuLy8gICAxLiBVbml0LXRlc3QgXCJldmVyeSBlbmRwb2ludCBuYW1lIGhhcyBhIENoaW5lc2UgbGFiZWxcIiBcdTIwMTQgaGlzdG9yaWNhbGx5XG4vLyAgICAgIGl0IHdhcyBlYXN5IHRvIGFkZCBhIG5ldyBlbmRwb2ludCBhbmQgZm9yZ2V0IHRvIHVwZGF0ZVxuLy8gICAgICBFTkRQT0lOVF9MQUJFTF9aSCwgbGVhdmluZyB0aGUgcG9wdXAncyBcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzAgcm93IGxhYmVsbGVkIHdpdGhcbi8vICAgICAgdGhlIGRldi1mbGF2b3VyZWQgcmF3IGtleSAoXCJvdGhlcl9sYWJzXCIgaW5zdGVhZCBvZiBcIlx1NkFBMlx1OUE1N1wiKS5cbi8vICAgMi4gS2VlcCBiYWNrZ3JvdW5kLmpzIGZvY3VzZWQgb24gZmxvdyBjb250cm9sICsgdGFiL0lPIGxvZ2ljLlxuLy9cbi8vIEFkYXB0ZXIgcmVmZXJlbmNlcyBsaXZlIGluIC4vbmhpLWFkYXB0ZXJzLmpzLiBTZWUgdGhhdCBtb2R1bGUgZm9yIHRoZVxuLy8gcGVyLWFkYXB0ZXIgZmllbGQtcHJpb3JpdHkgZGVjaXNpb25zIChkYXRlIHNlbGVjdGlvbiwgbmFtZSBmYWxsYmFja3MsXG4vLyBiaWxpbmd1YWwgc3BsaXR0aW5nLCBldGMuKS5cblxuaW1wb3J0IHtcbiAgYWRhcHRBZHVsdFByZXZlbnRpdmUsXG4gIGFkYXB0QWxsZXJneSxcbiAgYWRhcHRDYXRhc3Ryb3BoaWNJbGxuZXNzLFxuICBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlLFxuICBhZGFwdEltYWdpbmdMaXN0U3R1YixcbiAgYWRhcHRJbnBhdGllbnRFbmNvdW50ZXIsXG4gIGFkYXB0TGFiSXRlbSxcbiAgYWRhcHRNZWRpY2F0aW9uLFxuICBhZGFwdFByb2NlZHVyZUxpc3RTdHViLFxufSBmcm9tIFwiLi9uaGktYWRhcHRlcnMuanNcIjtcblxuLy8gVXNlci1mYWNpbmcgbGFiZWwgZm9yIGVhY2ggZW5kcG9pbnQgbmFtZS4gVGhlIGJyZWFrZG93biBjb2xsYXBzaWJsZVxuLy8gaW4gdGhlIHBvcHVwIChcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiKSByZWFkcyBmcm9tIHRoaXMgc28gdXNlcnMgc2VlIFwiXHU1QzMxXHU5MUFCIDEyIFx1N0I0NlwiXG4vLyBpbnN0ZWFkIG9mIHRoZSBkZXYtZmxhdm91cmVkIFwiZW5jb3VudGVycz0xMi8xMlwiLiBVbmtub3duIG5hbWVzIGZhbGxcbi8vIHRocm91Z2ggdG8gdGhlIHJhdyBrZXksIHdoaWNoIGtlZXBzIGl0IG9idmlvdXMgZHVyaW5nIGRldmVsb3BtZW50XG4vLyB3aGVuIHdlIGFkZCBhIG5ldyBlbmRwb2ludCBhbmQgaGF2ZW4ndCBsYWJlbGxlZCBpdCB5ZXQuXG5leHBvcnQgY29uc3QgRU5EUE9JTlRfTEFCRUxfWkggPSB7XG4gIGVuY291bnRlcnM6IFwiXHU1QzMxXHU5MUFCXCIsXG4gIGlucGF0aWVudDogXCJcdTRGNEZcdTk2NjJcIixcbiAgaW5wYXRpZW50X2xlZ2FjeTogXCJcdTRGNEZcdTk2NjJcdUZGMDhcdTgyMEFcdUZGMDlcIixcbiAgcHJvY2VkdXJlczogXCJcdTYyNEJcdTg4NTMgLyBcdTg2NTVcdTdGNkVcIixcbiAgbWVkaWNhdGlvbnM6IFwiXHU4NjU1XHU2NUI5XHU4NUU1XHU1NEMxXCIsXG4gIGFsbGVyZ2llczogXCJcdTg1RTVcdTcyNjlcdTkwNEVcdTY1NEZcIixcbiAgYWxsZXJnaWVzX2I6IFwiXHU4NUU1XHU3MjY5XHU5MDRFXHU2NTRGXHVGRjA4Qlx1RkYwOVwiLFxuICBhZHVsdF9wcmV2ZW50aXZlOiBcIlx1NjIxMFx1NEVCQVx1NTA2NVx1NkFBMlwiLFxuICBjYW5jZXJfc2NyZWVuaW5nOiBcIlx1NzY0Q1x1NzVDN1x1N0JFOVx1NkFBMlwiLFxuICBpbWFnaW5nOiBcIlx1NUY3MVx1NTBDRlx1NkFBMlx1NjdFNVwiLFxuICBvdGhlcl9sYWJzOiBcIlx1NkFBMlx1OUE1N1wiLFxuICBjYXRhc3Ryb3BoaWNfaWxsbmVzczogXCJcdTkxQ0RcdTU5MjdcdTUwQjdcdTc1QzVcIixcbn07XG5cbi8vIHBhZ2VfdHlwZSBcdTIxOTIgYmFja2VuZCBwYWdlX3R5cGUgc3RyaW5nIHVzZWQgYnkgbWFwcGVycy5cbi8vIHBhdGggaXMgcmVsYXRpdmUgdG8gbmhpQmFzZS4gbWV0aG9kIGRlZmF1bHQgXCJHRVRcIi5cbi8vIGBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZWAgPSBlbmRwb2ludCBhY2NlcHRzIHNfZGF0ZSAvIGVfZGF0ZSBpbiBcdTZDMTFcdTU3MEIgZm9ybWF0LlxuLy8gQ29uZmlybWVkIHZpYSBVUkxzIG9ic2VydmVkIGluIE5ISSdzIFNQQS4gT3RoZXIgZW5kcG9pbnRzIGVpdGhlciBkb24ndFxuLy8gYWNjZXB0IHJhbmdlIHBhcmFtcywgb3IgTkhJIHJlamVjdHMgdW5rbm93biBwYXJhbXMgXHUyMDE0IHdlIGxlYXZlIHRoZW0gYWxvbmVcbi8vICh0aGV5IGZhbGwgYmFjayB0byB0aGVpciBkZWZhdWx0IHdpbmRvdywgdHlwaWNhbGx5IDEtMiB5ZWFycykuXG5leHBvcnQgY29uc3QgTkhJX0FQSV9FTkRQT0lOVFMgPSBbXG4gIC8vIGVuY291bnRlcnMgLyBwcm9jZWR1cmVzIGRvbid0IGhhdmUgYSAvc2VhcmNoIHZhcmlhbnQgKDQwNCkuIHBhZ2VfbG9hZFxuICAvLyBzaWxlbnRseSBpZ25vcmVzIHNfZGF0ZSAvIGVfZGF0ZSBcdTIwMTQgdmVyaWZpZWQgdGhlIGFycmF5IGxlbmd0aCBpc1xuICAvLyBpZGVudGljYWwgd2l0aCBvciB3aXRob3V0IGRhdGVzLiBEYXRlIGZpbHRlciBpcyBlZmZlY3RpdmVseSB1bnN1cHBvcnRlZFxuICAvLyBmb3IgdGhlc2UgZW5kcG9pbnRzOyB0aGV5IHJldHVybiBhbGwgZGF0YSBpbiBOSEkncyBsaWZldGltZSB3aW5kb3cuXG4gIC8vIEVuY291bnRlciBzb3VyY2U6IElIS0UzMzAzUzAxIChcdTkxQUJcdTc2NDJcdThDQkJcdTc1MjhcdTc1MzNcdTU4MzEpLiBUaGUgL3BhZ2VfbG9hZCB2YXJpYW50XG4gIC8vIGlzIHdpbmRvdy1saW1pdGVkIHRvIH4xIHllYXIgKHJldHVybmVkIDUxIHZpc2l0cyBlbmRpbmcgMTE0LzA1KTtcbiAgLy8gL3NlYXJjaCBhY2NlcHRzIHNfZGF0ZSAvIGVfZGF0ZSBhbmQgZ29lcyBiYWNrIGZ1cnRoZXIgKDE2MiB2aXNpdHNcbiAgLy8gdG8gMTEyLzA1IGZvciB0aGUgc2FtZSBwYXRpZW50KS4gU2luY2UgbGFicy9tZWRzIGV4dGVuZCB0byAzeSB2aWFcbiAgLy8gdGhlaXIgb3duIC9zZWFyY2ggZW5kcG9pbnRzLCBlbmNvdW50ZXIgTVVTVCBhbHNvIHVzZSAvc2VhcmNoIG9yXG4gIC8vIHRoZSAoaG9zcGl0YWwsIGRhdGUpIGxpbmtlciBoYXMgbm90aGluZyB0byBtYXRjaCBhZ2FpbnN0IGZvciBvbGRlclxuICAvLyBsYWIgZGF0ZXMuXG4gIHsgbmFtZTogXCJlbmNvdW50ZXJzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwM3MwMS9zZWFyY2g/c19kYXRlPSZlX2RhdGU9XCIsXG4gICAgcGFnZV90eXBlOiBcImVuY291bnRlcnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBJbnBhdGllbnQgKFx1NEY0Rlx1OTY2MikgXHUyMDE0IElIS0UzMzA5UzAxIGlzIHRoZSBwcmltYXJ5IGxpc3Qgd2l0aCBpbl9EQVRFL291dF9EQVRFXG4gIC8vIHNwYW4uIElIS0UzMzA4UzAxIGNhcnJpZXMgYSBzbWFsbCBzZXQgb2Ygb2xkZXIgXHU0RjRGXHU5NjYyIHJlY29yZHMgd2l0aCB0aGVcbiAgLy8gc2FtZSBmaWVsZHMgKGZ1bmNfREFURSBpbiBzb21lIHJvd3MgaW5zdGVhZCBvZiBpbl9EQVRFOyBhZGFwdGVyXG4gIC8vIGhhbmRsZXMgYm90aCkuIEJvdGggZmVlZCB0aGUgc2FtZSBlbmNvdW50ZXIgbWFwcGVyLlxuICB7IG5hbWU6IFwiaW5wYXRpZW50XCIsICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDlzMDEvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcImVuY291bnRlcnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdElucGF0aWVudEVuY291bnRlciB9LFxuICB7IG5hbWU6IFwiaW5wYXRpZW50X2xlZ2FjeVwiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDhzMDEvcGFnZV9sb2FkXCIsXG4gICAgcGFnZV90eXBlOiBcImVuY291bnRlcnNcIiwgICAgICAgIGFkYXB0OiBhZGFwdElucGF0aWVudEVuY291bnRlciB9LFxuICAvLyBQcm9jZWR1cmVzIChJSEtFMzMwMVMwNSkgbGlzdCBvbmx5IGhhcyBvcmRlci1sZXZlbCBtZXRhZGF0YSBcdTIwMTRcbiAgLy8gbm8gSUNELTEwLVBDUyBjb2RlIGFuZCBubyBhY3R1YWwgcGVyZm9ybWVkLWRhdGUuIFRoZSBmdWxsXG4gIC8vIHJlY29yZCBsaXZlcyBhdCBJSEtFMzMwOFMwMiAoc3ViLWxpc3QgY2FycmllcyBleGVfU19EQVRFICtcbiAgLy8gTkhJIFx1OTFBQlx1NEVFNFx1NzhCQyBwZXIgZXhlY3V0aW9uKS4gU2FtZSAyLXN0ZXAgZmFuLW91dCBwYXR0ZXJuIGFzXG4gIC8vIGltYWdpbmc7IHNlZSBfZmV0Y2hQcm9jZWR1cmVEZXRhaWxzSW5UYWIuXG4gIHsgbmFtZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwMXMwNS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0UHJvY2VkdXJlTGlzdFN0dWIgfSxcbiAgLy8gbWVkaWNhdGlvbnM6IHBhZ2VfbG9hZCBvbmx5IGFjY2VwdHMgZW1wdHkgZGF0ZXMgKEhUVFAgNDAwIG90aGVyd2lzZSkuXG4gIC8vIFRoZSAvc2VhcmNoIGVuZHBvaW50IGlzIHdoYXQgdGhlIFNQQSBoaXRzIHdoZW4gdXNlciBwaWNrcyBhIGN1c3RvbVxuICAvLyBkYXRlIHJhbmdlIGFuZCBhY2NlcHRzIElTTyBcdTg5N0ZcdTUxNDMgZGF0ZXMgd2l0aCBkYXNoZXMgKDIwMjMtMDEtMDEpLlxuICAvLyBDb25maXJtZWQgdmlhIERldlRvb2xzIG9ic2VydmF0aW9uIG9mIHRoZSBcdTdCRTlcdTkwNzggcGFuZWwgc3VibWl0LlxuICB7IG5hbWU6IFwibWVkaWNhdGlvbnNcIiwgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTMzMDZzMDEvc2VhcmNoP3NfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTEmc190eXBlPUFcIixcbiAgICBwYWdlX3R5cGU6IFwibWVkaWNhdGlvbnNcIiwgICAgICAgYWRhcHQ6IGFkYXB0TWVkaWNhdGlvbiwgc3VwcG9ydHNEYXRlUmFuZ2U6IHRydWUgfSxcbiAgeyBuYW1lOiBcImFsbGVyZ2llc1wiLCAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAyczAxL1NQX0lIS0UzMjAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcImFsbGVyZ2llc1wiLCAgICAgICAgIGFkYXB0OiBhZGFwdEFsbGVyZ3kgfSxcbiAgeyBuYW1lOiBcImFsbGVyZ2llc19iXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMjAyczAxL1NQX0lIS0UzMjAyUzA0XCIsXG4gICAgcGFnZV90eXBlOiBcImFsbGVyZ2llc1wiLCAgICAgICAgIGFkYXB0OiBhZGFwdEFsbGVyZ3kgfSxcbiAgLy8gXHU2MjEwXHU0RUJBXHU5ODEwXHU5NjMyXHU0RkREXHU1MDY1XHU3RDUwXHU2NzlDIChJSEtFMzQwMlMwMSk6IG9uZSByb3cgcGVyIHNjcmVlbmluZywgY29udGFpbnNcbiAgLy8gQk1JIC8gdml0YWxzIC8gbGlwaWQgcGFuZWwgLyBMRlQgLyBSRlQgLyBIZXAgQi9DIC8gdXJpYyBhY2lkIGFsbFxuICAvLyBwcmUtY29tcHV0ZWQgYnkgTkhJJ3Mgc2NyZWVuaW5nIHByb2dyYW1tZS4gYWRhcHRBZHVsdFByZXZlbnRpdmVcbiAgLy8gcmV0dXJucyBhbiBhcnJheSAob25lIE9ic2VydmF0aW9uIHBlciBtZWFzdXJlbWVudCkgc28gdGhlXG4gIC8vIGFkYXB0ZXItY2FsbCBsb29wIGZsYXR0ZW5zIGl0LlxuICB7IG5hbWU6IFwiYWR1bHRfcHJldmVudGl2ZVwiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDJzMDEvU1BfSUhLRTM0MDJTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0QWR1bHRQcmV2ZW50aXZlIH0sXG4gIHsgbmFtZTogXCJjYW5jZXJfc2NyZWVuaW5nXCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzQwNHMwMS9TUF9JSEtFMzQwNFMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtIH0sXG4gIC8vIGdsdWNvc2UgKElIS0UzNDA2UzAxKSArIGxpcGlkIChJSEtFMzQwN1MwMSkgYXJlIHN1YnNldHMgb2ZcbiAgLy8gb3RoZXJfbGFicyAoSUhLRTM0MDlTMDEpIHBlciBOSEkncyBkYXRhIG1vZGVsIFx1MjAxNCBmZXRjaGluZyB0aGVtXG4gIC8vIHNlcGFyYXRlbHkganVzdCBjcmVhdGVzIGR1cCBvYnNlcnZhdGlvbnMsIHNvIHdlIHNraXAgdGhlbS5cbiAgLy8gSW1hZ2luZyBsaXN0IChJSEtFMzQwOFMwMSkgb25seSBjYXJyaWVzIG9yZGVyLWxldmVsIGRhdGE7IGZ1bGxcbiAgLy8gbmFycmF0aXZlIHJlcG9ydCBsaXZlcyBhdCBJSEtFMzQwOFMwMi4gV2UgZG8gYSAyLXN0ZXAgZmV0Y2ggKHNlZVxuICAvLyBfZmV0Y2hJbWFnaW5nRGV0YWlsc0luVGFiKSB0byBncmFiIHRoZSByZXBvcnQsIHRoZW4gbWFwIHRvIGEgcmVhbFxuICAvLyBEaWFnbm9zdGljUmVwb3J0LiBUaGUgbGlzdCBhZGFwdGVyIGlzIGEgbm8tb3Agc3R1YiBsaWtlIG1lZGljYXRpb25zLlxuICAvLyBpbWFnaW5nOiBzZWFyY2ggZW5kcG9pbnQgYWNjZXB0cyBJU08gZGF0ZSByYW5nZSBsaWtlIG1lZGljYXRpb25zLlxuICB7IG5hbWU6IFwiaW1hZ2luZ1wiLCAgICAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDhzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJkaWFnbm9zdGljX3JlcG9ydHNcIiwgYWRhcHQ6IGFkYXB0SW1hZ2luZ0xpc3RTdHViLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBvdGhlcl9sYWJzIGFscmVhZHkgdXNlcyAvc2VhcmNoOyBzYW1lIElTTy1kYXNoIGRhdGUgZm9ybWF0IHdvcmtzLlxuICB7IG5hbWU6IFwib3RoZXJfbGFic1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDlzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBJSEtFMzIwOVMwMSAoXHU5MUNEXHU1OTI3XHU1MEI3XHU3NUM1KSBcdTIwMTQgTkhJLXZldHRlZCBjYXRhc3Ryb3BoaWMtaWxsbmVzcyByZWdpc3RyeS5cbiAgLy8gRWFjaCByb3cgXHUyMTkyIGEgRkhJUiBDb25kaXRpb24gd2l0aCBjYXRlZ29yeT1wcm9ibGVtLWxpc3QtaXRlbSwgdGhlXG4gIC8vIGNsb3Nlc3QgXHU1MDY1XHU1RUI3XHU1QjU4XHU2NDdBIGVxdWl2YWxlbnQgdG8gYSBjdXJhdGVkIHByb2JsZW0gbGlzdC4gRW5kcG9pbnRcbiAgLy8gZG9lc24ndCBhY2NlcHQgZGF0ZSBwYXJhbXMgKE5ISSByZXR1cm5zIGN1cnJlbnRseS12YWxpZCBjZXJ0cyBvbmx5KS5cbiAgeyBuYW1lOiBcImNhdGFzdHJvcGhpY19pbGxuZXNzXCIsIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwOXMwMS9TUF9JSEtFMzIwOVMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJjb25kaXRpb25zXCIsICAgICAgICBhZGFwdDogYWRhcHRDYXRhc3Ryb3BoaWNJbGxuZXNzIH0sXG5dO1xuIiwgIi8vIFNlcnZpY2Ugd29ya2VyIGZvciBOSEktRkhJUiBCcmlkZ2UgXHUyMDE0IG93bnMgdGhlIGxvbmctcnVubmluZ1xuLy8gXCJTeW5jIFRoaXMgUGF0aWVudFwiIHdvcmtmbG93IHNvIHRoZSBwb3B1cCBjYW4gY2xvc2UgbWlkLXN5bmMgd2l0aG91dFxuLy8gYWJvcnRpbmcgaXQuXG4vL1xuLy8gTGlmZWN5Y2xlOlxuLy8gICAtIHBvcHVwIHBvc3RzIHt0eXBlOiBcInN0YXJ0TmhpQXBpU3luY1wiLCBwYXlsb2FkfSAgXHUyMTkyIE5ISSBKU09OLUFQSSBzeW5jXG4vLyAgIC0gYmFja2dyb3VuZCBydW5zIHRoZSBmdWxsIHN5bmMgc2VxdWVuY2UsIHVwZGF0aW5nIGNocm9tZS5zdG9yYWdlLmxvY2FsXG4vLyAgIC0gcG9wdXAgcmVhZHMgY2hyb21lLnN0b3JhZ2UubG9jYWwgb24gcmVvcGVuIHRvIHNob3cgcHJvZ3Jlc3Ncbi8vXG4vLyBNb2Rlczpcbi8vICAgLSBcImxvY2FsXCIgICBcdTIxOTIgYWZ0ZXIgTkhJIGZldGNoLCBydW4gbWFwcGVycyBpbi1leHRlbnNpb24sIGRvd25sb2FkIGFcbi8vICAgICAgICAgICAgICAgICBGSElSIEJ1bmRsZSB0byB0aGUgdXNlcidzIG1hY2hpbmUuIE5vIGJhY2tlbmQgcmVxdWlyZWQuXG4vLyAgIC0gXCJiYWNrZW5kXCIgXHUyMTkyIFBPU1QgcGVyLXBhZ2VfdHlwZSBpdGVtcyB0byAvc3luYy91cGxvYWQtc3RydWN0dXJlZFxuLy8gICAgICAgICAgICAgICAgIChleGlzdGluZyBiZWhhdmlvdXIpOyBkYXNoYm9hcmQgKyBTTUFSVCBhcHAgdXNlIHRoZVxuLy8gICAgICAgICAgICAgICAgIGJhY2tlbmQncyBGSElSIHN0b3JlLlxuXG5pbXBvcnQge1xuICBHUk9VUF9IQU5ETEVSUyxcbiAgTElTVF9IQU5ETEVSUyxcbiAgZGVkdXBBZG1pc3Npb25EYXlBbWIsXG4gIGRlcml2ZVBhdGllbnRJZCxcbiAgbGlua0VuY291bnRlcnNJblJlc291cmNlcyxcbiAgbWFwUGF0aWVudCxcbiAgbWFza0lkLFxuICBtYXNrTmFtZSxcbiAgcmVzb2x2ZVNleFN0cmF0aWZpZWRSYW5nZXMsXG59IGZyb20gXCJAbmhpLWZoaXItYnJpZGdlL21hcHBlclwiO1xuaW1wb3J0IHtcbiAgLy8gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSBpcyBpbnZva2VkIGRpcmVjdGx5IGZyb20gdGhlXG4gIC8vIElIS0UzMzAzUzAyIGRldGFpbCBmYW4tb3V0IChvdmVycmlkZXMgdGhlIHJlZ2lzdHJ5J3MgY2xhc3NIaW50XG4gIC8vIHdpdGggXHU2MDI1XHU4QTNBL1x1NEY0Rlx1OTY2MiBkZXJpdmVkIGZyb20gdGhlIGRldGFpbCBib2R5KSwgc28gaXQgbmVlZHMgdG8gYmVcbiAgLy8gYSBuYW1lZCBpbXBvcnQgXHUyMDE0IG5vdCBvbmx5IHJlYWNoYWJsZSB2aWEgTkhJX0FQSV9FTkRQT0lOVFNbaV0uYWRhcHQuXG4gIC8vIEZvcmdldHRpbmcgdGhpcyByZS1pbXBvcnQgYWZ0ZXIgZXh0cmFjdGluZyB0aGUgZW5kcG9pbnQgcmVnaXN0cnlcbiAgLy8gaW4gdjAuNi4zIHNoaXBwZWQgYSBSZWZlcmVuY2VFcnJvciB0aGF0IG9ubHkgZmlyZWQgaW4gcHJvZHVjdGlvblxuICAvLyBzeW5jcyB3aXRoIG5vbi1lbXB0eSBlbmNvdW50ZXJzLiBUZXN0cyBkb24ndCBleGVyY2lzZSB0aGF0IHBhdGhcbiAgLy8gXHUyMDE0IHNlZSBUT0RPX0ZPTExPV1VQIGZvciBhIFNXLWZsb3cgaW50ZWdyYXRpb24gdGVzdCBpZGVhLlxuICBhZGFwdEVuY291bnRlckZyb21NZWRFeHBlbnNlLFxuICBhZGFwdEltYWdpbmdSZXBvcnRGcm9tRGV0YWlsLFxuICBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsLFxuICBhZGFwdFByb2NlZHVyZUZyb21EZXRhaWwsXG4gIGlzb1RvUk9DLFxuICBwaWNrRW5nbGlzaCxcbiAgcm9jVG9JU08sXG59IGZyb20gXCIuL25oaS1hZGFwdGVycy5qc1wiO1xuaW1wb3J0IHsgRU5EUE9JTlRfTEFCRUxfWkgsIE5ISV9BUElfRU5EUE9JTlRTIH0gZnJvbSBcIi4vbmhpLWVuZHBvaW50cy5qc1wiO1xuXG5jb25zdCBTVE9SQUdFX0tFWSA9IFwic3luY1N0YXR1c1wiO1xuY29uc3Qgc2xlZXAgPSAobXMpID0+IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIG1zKSk7XG5cbi8vIENhbmNlbGxhdGlvbiBmbGFnIHNldCBieSBwb3B1cCdzIHN0b3AgYnV0dG9uLiBDaGVja2VkIGF0IHN0cmF0ZWdpYyBwb2ludHNcbi8vIGluIHJ1bk5oaUFwaVN5bmMgKGJldHdlZW4gcGhhc2VzLCBiZWZvcmUgZWFjaCBkZXRhaWwgcGFnZSkgc28gdGhlXG4vLyBpbi1wcm9ncmVzcyBzeW5jIGV4aXRzIHByb21wdGx5IHdoZW4gdGhlIHVzZXIgaGl0cyBTdG9wLiBDbGVhcmVkIGF0IHRoZVxuLy8gc3RhcnQgb2YgZWFjaCBuZXcgc3luYyBydW4uXG5sZXQgX2NhbmNlbGxlZCA9IGZhbHNlO1xuLy8gQ29udGV4dCBmb3IgdGhlIGluLWZsaWdodCBzeW5jIHNvIHRoZSBzdG9wU3luYyBoYW5kbGVyIGNhbiB3aXBlIHBhcnRpYWxcbi8vIGRhdGEgd2l0aG91dCB0aGUgcG9wdXAgbmVlZGluZyB0byBwYXNzIGl0IGJhY2suIFNldCBhdCB0aGUgdG9wIG9mXG4vLyBydW5OaGlBcGlTeW5jOyBjbGVhcmVkIG9uIGNvbXBsZXRpb24gKHN1Y2Nlc3MvZmFpbHVyZS9jYW5jZWwpLlxubGV0IF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbmNvbnN0IENBTkNFTF9FUlJPUiA9IFwiX19TWU5DX0NBTkNFTExFRF9fXCI7XG4vLyBUaHJvd24gd2hlbiBOSEkgZGV0ZWN0cyB0aGUgc2Vzc2lvbiBoYXMgZXhwaXJlZCAobG9naW4gcGFnZSByZW5kZXJlZCwgb3Jcbi8vIHRhYiByZWRpcmVjdGVkIHRvIGF1dGggbmFtZXNwYWNlKS4gQWJvcnRzIHN5bmMgaW1tZWRpYXRlbHkgc28gdGhlIHVzZXIgY2FuXG4vLyByZS1sb2dpbiBhbmQgcmV0cnkgaW5zdGVhZCBvZiB0aW1pbmcgb3V0IG9uIGV2ZXJ5IHJlbWFpbmluZyBwYWdlLlxuY29uc3QgU0VTU0lPTl9FWFBJUkVEX0VSUk9SID0gXCJfX1NFU1NJT05fRVhQSVJFRF9fXCI7XG4vLyBFcnJvcnMgdGhhdCBzaG91bGQgYWJvcnQgdGhlIGVudGlyZSBzeW5jIGluc3RlYWQgb2YgYmVpbmcgc3dhbGxvd2VkXG4vLyBwZXItcGhhc2UuXG5jb25zdCBBQk9SVF9FUlJPUlMgPSBuZXcgU2V0KFtDQU5DRUxfRVJST1IsIFNFU1NJT05fRVhQSVJFRF9FUlJPUl0pO1xuZnVuY3Rpb24gY2hlY2tDYW5jZWwoKSB7XG4gIGlmIChfY2FuY2VsbGVkKSB0aHJvdyBuZXcgRXJyb3IoQ0FOQ0VMX0VSUk9SKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2V0U3RhdHVzKHBhcnRpYWwpIHtcbiAgLy8gQWZ0ZXIgY2FuY2VsbGF0aW9uLCB0aGUgcG9wdXAgaGFzIGFscmVhZHkgd3JpdHRlbiB0aGUgZGVmaW5pdGl2ZVxuICAvLyBcInN0b3BwZWRcIiBzdGF0dXMgXHUyMDE0IHNpbGVuY2UgYW55IGZ1cnRoZXIgcHJvZ3Jlc3Mgd3JpdGVzIGZyb20gdGhlXG4gIC8vIGluLWZsaWdodCBzeW5jIGNvZGUgc28gdGhlIFVJIGRvZXNuJ3QgYm91bmNlIHdoaWxlIGl0IHVud2luZHMuXG4gIGlmIChfY2FuY2VsbGVkKSByZXR1cm47XG4gIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICBjb25zdCBuZXh0ID0geyAuLi5wcmV2LCAuLi5wYXJ0aWFsLCB0czogRGF0ZS5ub3coKSB9O1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbU1RPUkFHRV9LRVldOiBuZXh0IH0pO1xuICAvLyBCcm9hZGNhc3QgdG8gYW55IG9wZW4gcG9wdXAuIElmIG5vIGxpc3RlbmVyIChwb3B1cCBjbG9zZWQpLFxuICAvLyBzZW5kTWVzc2FnZSByZWplY3RzIFx1MjAxNCBzd2FsbG93LlxuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6IFwic3luY1Byb2dyZXNzXCIsIHN0YXR1czogbmV4dCB9KS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBOSEkgQVBJLWRpcmVjdCBzeW5jIChwYXJhbGxlbCwgbm8gTExNKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBJbnN0ZWFkIG9mIG5hdmlnYXRpbmcgdGhlIHVzZXIncyB0YWIgdG8gZWFjaCBOSEkgcGFnZSwgd2FpdGluZyBmb3IgVnVlIHRvXG4vLyByZW5kZXIsIGNhcHR1cmluZyBIVE1MLCB0aGVuIHNlbmRpbmcgaXQgdGhyb3VnaCBMTE0gZXh0cmFjdGlvbiwgd2UgY2FsbFxuLy8gTkhJJ3MgdW5kZXJseWluZyBKU09OIEFQSSBlbmRwb2ludHMgZGlyZWN0bHkuIFRoZSBcdTUwNjVcdTRGRERcdTdGNzIgU1BBIGZyb250cyBhIHNldFxuLy8gb2YgUkVTVCBlbmRwb2ludHMgdW5kZXIgL2FwaS9paGtlMzAwMC88cGFnZT4vKiB0aGF0IHJldHVybiB3ZWxsLWZvcm1lZFxuLy8gSlNPTjsgY2FsbGluZyB0aGVtIGluIHBhcmFsbGVsIGN1dHMgYSA1LTEwIG1pbnV0ZSBzeW5jIHRvIH4xMCBzZWNvbmRzIGFuZFxuLy8gcmVtb3ZlcyB0aGUgTExNIGNvc3QgZW50aXJlbHkuXG5cbmNvbnN0IE5ISV9IT1NUID0gXCJteWhlYWx0aGJhbmsubmhpLmdvdi50d1wiO1xuXG5cbi8vIE5ISSBKU09OIGFkYXB0ZXJzICsgZGF0ZS9zdHJpbmcgaGVscGVycyBsaXZlIGluIC4vbmhpLWFkYXB0ZXJzLmpzXG4vLyBzbyB0aGV5IGNhbiBiZSB1bml0LXRlc3RlZCBpbiBpc29sYXRpb24gKGJhY2tncm91bmQuanMgY2FuJ3QgYmVcbi8vIGxvYWRlZCB1bmRlciB2aXRlc3QgXHUyMDE0IGNocm9tZS4qIEFQSXMsIFNXIGdsb2JhbHMpLiBTZWUgdGhhdCBtb2R1bGVcbi8vIGZvciB0aGUgZmllbGQtcHJpb3JpdHkgZGVjaXNpb25zIHBlciBhZGFwdGVyLlxuLy9cbi8vIFRoZSBOSEkgQVBJIGVuZHBvaW50IHJlZ2lzdHJ5ICsgXHU0RTJEXHU2NTg3IGxhYmVsIG1hcHBpbmcgbGl2ZSBpblxuLy8gLi9uaGktZW5kcG9pbnRzLmpzIFx1MjAxNCBleHRyYWN0ZWQgc28gYSB1bml0IHRlc3QgY2FuIGd1YXJhbnRlZSBldmVyeVxuLy8gZW5kcG9pbnQgbmFtZSBoYXMgYSBsYWJlbCAod2UgdXNlZCB0byBzaGlwIHJhdyBwYWdlX3R5cGUga2V5cyBsaWtlXG4vLyBcIm90aGVyX2xhYnNcIiBpbnRvIHRoZSBwb3B1cCdzIFx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMCB3aGVuIHNvbWVvbmUgZm9yZ290IHRvXG4vLyByZWdpc3RlciB0aGUgQ2hpbmVzZSB2ZXJzaW9uKS5cblxuLy8gQXBwbHkgYSB7c3RhcnQsIGVuZH0gSVNPIGRhdGUgcmFuZ2UgdG8gYW4gZW5kcG9pbnQgcGF0aDpcbi8vICAgLSBJZiBwYXRoIGFscmVhZHkgaGFzIHNfZGF0ZT0gcGxhY2Vob2xkZXJzLCBmaWxsIHRoZW0gaW4uXG4vLyAgIC0gT3RoZXJ3aXNlIGFwcGVuZCBzX2RhdGU9Li4uJmVfZGF0ZT0uLi4gdG8gdGhlIHF1ZXJ5IHN0cmluZy5cbi8vIEVuZHBvaW50cyB3aXRob3V0IGBzdXBwb3J0c0RhdGVSYW5nZWAgcGFzcyB0aHJvdWdoIHVuY2hhbmdlZC5cbmZ1bmN0aW9uIGFwcGx5RGF0ZVJhbmdlVG9QYXRoKHBhdGgsIGRhdGVSYW5nZSkge1xuICBpZiAoIWRhdGVSYW5nZSB8fCAoIWRhdGVSYW5nZS5zdGFydCAmJiAhZGF0ZVJhbmdlLmVuZCkpIHJldHVybiBwYXRoO1xuICAvLyBOSEkgZXhwZWN0cyBcdTg5N0ZcdTUxNDMgSVNPIGRhdGVzIHdpdGggZGFzaGVzOiAyMDIzLTAxLTAxIChub3QgXHU2QzExXHU1NzBCLCBub3RcbiAgLy8gc2xhc2hlcykuIENvbmZpcm1lZCBieSBvYnNlcnZpbmcgdGhlIFNQQSdzIHJlcXVlc3Qgd2hlbiB1c2VyIHBpY2tzXG4gIC8vIGEgY3VzdG9tIGRhdGUgcmFuZ2UuIFVSTC1lbmNvZGluZyB0aGUgZGFzaGVzIGlzIHVubmVjZXNzYXJ5LlxuICBjb25zdCBzID0gKGRhdGVSYW5nZS5zdGFydCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IGUgPSAoZGF0ZVJhbmdlLmVuZCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGxldCBwID0gcGF0aDtcbiAgaWYgKC9bPyZdc19kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdc19kYXRlPSlbXiZdKi8sIGAkMSR7c31gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IChwLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCIpICsgYHNfZGF0ZT0ke3N9YDtcbiAgfVxuICBpZiAoL1s/Jl1lX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1lX2RhdGU9KVteJl0qLywgYCQxJHtlfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gYCZlX2RhdGU9JHtlfWA7XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDZTMDIgZGV0YWlsIGZldGNoZXMgaW5zaWRlIHRoZSBOSEkgdGFiIHNvIGNvb2tpZXMgKyBKV1Rcbi8vIGF1dGggZmxvdyBuYXR1cmFsbHkuIFdlIHBhc3MgdGhlIHZpc2l0IGxpc3QgKGp1c3Qgcm93X0lEcyArIHRoZWlyIHBhcmVudFxuLy8gZmllbGRzIG5lZWRlZCBmb3IgYWRhcHRhdGlvbikgaW50byB0aGUgdGFiOyB0aGUgdGFiIHJldHVybnMgcGFyYWxsZWxcbi8vIGZldGNoZWQgYm9kaWVzOyB3ZSBhZGFwdCBiYWNrIGluIHRoZSBTVy5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgLy8gS2VlcCBwYXJlbnQgZmllbGRzIG5lZWRlZCBieSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsLlxuICAgICAgcGFyZW50OiB7XG4gICAgICAgIGZ1bmNfREFURTogdi5mdW5jX0RBVEUgfHwgdi5mdW5jX2RhdGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREU6IHYuaWNkOWNtX0NPREUgfHwgdi5pY2Q5Y21fY29kZSB8fCBcIlwiLFxuICAgICAgICBpY2Q5Y21fQ09ERV9DTkFNRTogdi5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2LmljZDljbV9uYW1lIHx8IFwiXCIsXG4gICAgICAgIGhvc3BfQUJCUjogdi5ob3NwX0FCQlIgfHwgdi5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAgIH0sXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTkhJIHVzZXMgZGlmZmVyZW50IGN0eXBlIHZhbHVlcyBmb3IgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIvXHU4NjU1XHU2NUI5XHU3QjhCLiBXZSBkb24ndFxuICAgICAgLy8gaGF2ZSB0aGUgcHVibGljIG1hcHBpbmcsIHNvIHRyeSBjdHlwZSAxLi40IGluIG9yZGVyIGFuZCBzdG9wIGFzXG4gICAgICAvLyBzb29uIGFzIG9uZSByZXR1cm5zIGRydWdzLiBjdHlwZT0yIGNvdmVyZWQgSUNcdTUzNjEgXHU5NTgwXHU4QTNBIGluIG91ciBzYW1wbGUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNF0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keT8uaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICAgICAgICBjb25zdCBoYXNEcnVncyA9IG1haW4uc29tZSgodikgPT5cbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodj8uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSAmJiB2LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC5sZW5ndGggPiAwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIGN0eXBlIHlpZWxkZWQgZHJ1Z3MgXHUyMDE0IHJldHVybiBsYXN0IHN1Y2Nlc3NmdWwgYm9keSBhbnl3YXkgc29cbiAgICAgICAgLy8gZGlhZ25vc3RpY3MgY2FuIHN0aWxsIHNlZSB0aGUgdmlzaXQgbWV0YWRhdGEuXG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaE9uZShyb3dJZCwgMik7XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBkcnVncyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGRydWdMaXN0ID0gQXJyYXkuaXNBcnJheSh2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpID8gdmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0IDogW107XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZHJ1Z0xpc3QpIHtcbiAgICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZCwgdmlzaXQpO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzNDA4UzAyIGRldGFpbCBmZXRjaGVzIGZvciBpbWFnaW5nIFx1MjAxNCBzYW1lIHBhdHRlcm4gYXMgdGhlXG4vLyBtZWRpY2F0aW9uIDItc3RlcC4gY3R5cGUgbWlycm9ycyB0aGUgdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICBjdHlwZTogdi5vcmlfVFlQRSB8fCB2Lm9yaV90eXBlIHx8IFwiQVwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzNDA4UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoY3R5cGUpfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCByZXBvcnRzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwodmlzaXQpO1xuICAgICAgaWYgKGFkYXB0ZWQpIHJlcG9ydHMucHVzaChhZGFwdGVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcG9ydHM7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDhTMDIgZGV0YWlsIGZldGNoZXMgZm9yIHByb2NlZHVyZXMgXHUyMDE0IHNhbWUgMi1zdGVwXG4vLyBwYXR0ZXJuIGFzIGltYWdpbmcgSUhLRTM0MDhTMDEgXHUyMTkyIFMwMi4gVGhlIGxpc3QgKElIS0UzMzAxUzA1KSBvbmx5XG4vLyBjYXJyaWVzIG1ldGFkYXRhOyB0aGUgYWN0dWFsIElDRC0xMC1QQ1MgY29kZSAob3BfQ09ERSkgYW5kIHRoZSByZWFsXG4vLyBwZXJmb3JtYW5jZSBkYXRlIChleGVfU19EQVRFIG9uIHN1Yi1saXN0IGVudHJpZXMpIGxpdmUgaW4gdGhlIGRldGFpbC5cbi8vIGN0eXBlIG1pcnJvcnMgdGhlIGxpc3Qgcm93J3Mgb3JpX3R5cGUgKDM9XHU0RjRGXHU5NjYyIC8gNT1cdTk1ODBcdThBM0Egb2JzZXJ2ZWRcbi8vIGFnYWluc3QgbGl2ZSBwYXlsb2FkcykuIE5ISSBkb2Vzbid0IHB1Ymxpc2ggdGhlIG1hcHBpbmcgc28gd2Vcbi8vIGJydXRlLWZvcmNlIG9uIG1pc3MgbGlrZSB0aGUgbWVkaWNhdGlvbiBmYW4tb3V0LCBqdXN0IGluIGNhc2UuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hQcm9jZWR1cmVEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93X2lkIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgY3R5cGU6IHYub3JpX3R5cGUgfHwgdi5vcmlfVFlQRSB8fCBcIlwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCBjdHlwZSkge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvaWhrZTMwMDAvSUhLRTMzMDhTMDIvcGFnZV9sb2FkP2NyaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZjdHlwZT0ke2VuY29kZVVSSUNvbXBvbmVudChjdHlwZSl9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gUHJlZmVyIHRoZSByb3cncyBvd24gb3JpX3R5cGUuIElmIHRoYXQgcmV0dXJucyBlbXB0eSAoTkhJXG4gICAgICAvLyBzb21ldGltZXMgc2hpcHMgcm93cyB3aGVyZSBjdHlwZSBleHBlY3RzIGEgZGlmZmVyZW50IHZhbHVlKSxcbiAgICAgIC8vIGJydXRlLWZvcmNlIDEuLjUgdW50aWwgc29tZXRoaW5nIGNvbWVzIGJhY2suXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQsIHByZWZlcnJlZCkge1xuICAgICAgICBjb25zdCBjYW5kaWRhdGVzID0gW107XG4gICAgICAgIGlmIChwcmVmZXJyZWQpIGNhbmRpZGF0ZXMucHVzaChwcmVmZXJyZWQpO1xuICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIFtcIjNcIiwgXCI1XCIsIFwiMVwiLCBcIjJcIiwgXCI0XCJdKSB7XG4gICAgICAgICAgaWYgKCFjYW5kaWRhdGVzLmluY2x1ZGVzKGN0KSkgY2FuZGlkYXRlcy5wdXNoKGN0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGFzdE9rID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCBjdCk7XG4gICAgICAgICAgaWYgKHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHJldHVybiByO1xuICAgICAgICAgIGlmIChyLmVycm9yKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHk/Lmloa2UzMzA4UzAyX21haW5fZGF0YSlcbiAgICAgICAgICAgID8gci5ib2R5Lmloa2UzMzA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiByO1xuICAgICAgICAgIGxhc3RPayA9IHI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhc3RPayB8fCB7IGVycm9yOiBcIm5vIGRldGFpbCBib2R5XCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBwcm9jZWR1cmVzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzMwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzMzA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3Qgcm93IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGFkYXB0ZWQgPSBhZGFwdFByb2NlZHVyZUZyb21EZXRhaWwocm93KTtcbiAgICAgIGlmIChhZGFwdGVkKSBwcm9jZWR1cmVzLnB1c2goYWRhcHRlZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwcm9jZWR1cmVzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzMzAzUzAyIGRldGFpbCB0byBjbGFzc2lmeSBlYWNoIElIS0UzMzAzUzAxIHZpc2l0IGFzXG4vLyBBTUIgLyBFTUVSIC8gSU1QIGJhc2VkIG9uIGhvc3BfREFUQV9UWVBFX05BTUUuIFVzZXMgP3JpZD08cm93X0lEPiZ0PU5cbi8vIHdoZXJlIE4gaXMgdGhlIHZpc2l0IHR5cGUgYnVja2V0OyB3ZSBkb24ndCBrbm93IHRoZSBtYXBwaW5nIGEgcHJpb3JpLFxuLy8gc28gZm9yIGVhY2ggdmlzaXQgd2UgdHJ5IHQ9MS4uNSB1bnRpbCBvbmUgcmV0dXJucyBub24tZW1wdHkgbWFpbl9kYXRhLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoRW5jb3VudGVyRGV0YWlsc0luVGFiKHsgdGFiSWQsIGJhc2VVcmwsIHZpc2l0cyB9KSB7XG4gIGNvbnN0IHJlcXMgPSB2aXNpdHNcbiAgICAubWFwKCh2LCBpZHgpID0+ICh7IGlkeCwgcm93X0lEOiB2LnJvV19JRCB8fCB2LnJvd19JRCB8fCBcIlwiIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHJvd0lkLCB0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9paGtlMzMwM3MwMi9wYWdlX2xvYWQ/cmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mdD0ke3R9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHRtID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRtKTtcbiAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgZXJyb3I6IGBIVFRQICR7ci5zdGF0dXN9YCB9O1xuICAgICAgICAgIHJldHVybiB7IGJvZHk6IGF3YWl0IHIuanNvbigpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRm9yIGVhY2ggdmlzaXQsIGZpbmQgdGhlIGB0YCB0aGF0IHJldHVybnMgbm9uLWVtcHR5IGRhdGEuIE5ISVxuICAgICAgLy8gdXNlcyB0PTEgZm9yIG91dHBhdGllbnQgXHU4OTdGXHU5MUFCLCB0PTIgbWF5YmUgXHU2MDI1XHU4QTNBL1x1NEUyRFx1OTFBQiwgdD0zIFx1NEY0Rlx1OTY2MixcbiAgICAgIC8vIHQ9NCBcdTcyNTlcdTkxQUJcdTIwMjYgZG9uJ3QgaGF2ZSBhbiBhdXRob3JpdGF0aXZlIG1hcHBpbmcgc28gd2UgcHJvYmUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIFsxLCAyLCAzLCA0LCA1XSkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaE9uZShyb3dJZCwgdCk7XG4gICAgICAgICAgaWYgKHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHJldHVybiByO1xuICAgICAgICAgIGlmIChyLmVycm9yKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBtYWluID0gKHIuYm9keT8uaWhrZTMzMDNTMDJfbWFpbl9kYXRhKSB8fCBbXTtcbiAgICAgICAgICBpZiAobWFpbi5sZW5ndGggPiAwKSByZXR1cm4geyBib2R5OiByLmJvZHksIHQgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBib2R5OiBudWxsIH07XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICAvLyBQYWlyIGVhY2ggZGV0YWlsIGJvZHkgYmFjayB0byBpdHMgdmlzaXQgcG9zaXRpb24uXG4gIGNvbnN0IGJ5SWR4ID0gbmV3IE1hcCgpO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcXMubGVuZ3RoOyBpKyspIHtcbiAgICBieUlkeC5zZXQocmVxc1tpXS5pZHgsIHJlc3VsdHNbaV0/LmJvZHkgfHwgbnVsbCk7XG4gIH1cbiAgcmV0dXJuIGJ5SWR4O1xufVxuXG5mdW5jdGlvbiBfY2xhc3NGcm9tUzAyRGV0YWlsKGJvZHkpIHtcbiAgaWYgKCFib2R5KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbWFpbiA9IChib2R5Lmloa2UzMzAzUzAyX21haW5fZGF0YSkgfHwgW107XG4gIGlmIChtYWluLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHRuID0gU3RyaW5nKG1haW5bMF0uaG9zcF9EQVRBX1RZUEVfTkFNRSB8fCBcIlwiKTtcbiAgaWYgKHRuLmluY2x1ZGVzKFwiXHU2MDI1XCIpKSByZXR1cm4gXCJFTUVSXCI7ICAvLyBcdTYwMjVcdThBM0FcbiAgaWYgKHRuLmluY2x1ZGVzKFwiXHU0RjRGXHU5NjYyXCIpKSByZXR1cm4gXCJJTVBcIjtcbiAgLy8gXHU4OTdGXHU5MUFCIC8gXHU0RTJEXHU5MUFCIC8gXHU3MjU5XHU5MUFCIC8gXHU4NUU1XHU1QzQwIGFsbCBkZWZhdWx0IHRvIEFNQlxuICByZXR1cm4gXCJBTUJcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gX3Bvc3RTdHJ1Y3R1cmVkKGJhY2tlbmQsIHBhZ2VfdHlwZSwgaXRlbXMsIHN5bmNBcGlLZXksIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCByID0gYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy91cGxvYWQtc3RydWN0dXJlZGAsIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcGFnZV90eXBlLFxuICAgICAgaG9zdDogTkhJX0hPU1QsXG4gICAgICBpdGVtcyxcbiAgICAgIHBhdGllbnRfb3ZlcnJpZGU6IHBhdGllbnRPdmVycmlkZSB8fCBudWxsLFxuICAgIH0pLFxuICB9KTtcbiAgaWYgKCFyLm9rKSB0aHJvdyBuZXcgRXJyb3IoYFBPU1QgdXBsb2FkLXN0cnVjdHVyZWQgJHtyLnN0YXR1c306ICR7KGF3YWl0IHIudGV4dCgpKS5zbGljZSgwLCAyMDApfWApO1xuICByZXR1cm4gYXdhaXQgci5qc29uKCk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBMb2NhbCBtb2RlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFJ1bnMgdGhlIHNhbWUgbWFwcGVycyB0aGUgYmFja2VuZCBydW5zLCB0aGVuIHRyaWdnZXJzIGEgZG93bmxvYWQgb2YgdGhlXG4vLyByZXN1bHRpbmcgRkhJUiBCdW5kbGUuIE5vdGhpbmcgbGVhdmVzIHRoZSB1c2VyJ3MgbWFjaGluZTsgbm8gYmFja2VuZFxuLy8gcmVxdWlyZWQuIE1pcnJvcnMgYmFja2VuZC91cGxvYWQtc3RydWN0dXJlZCBvcmRlcjogZW5jb3VudGVycyBmaXJzdCBzb1xuLy8gdGhhdCBsaW5rRW5jb3VudGVyc0luUmVzb3VyY2VzIGNhbiBhdHRhY2ggcmVmZXJlbmNlcyB0byBkb3duc3RyZWFtXG4vLyBvYnNlcnZhdGlvbnMvbWVkaWNhdGlvbnMvZXRjLlxuXG5jb25zdCBfTE9DQUxfUEFHRV9UWVBFX09SREVSID0gW1xuICBcImVuY291bnRlcnNcIixcbiAgXCJvYnNlcnZhdGlvbnNcIixcbiAgXCJtZWRpY2F0aW9uc1wiLFxuICBcImNvbmRpdGlvbnNcIixcbiAgXCJhbGxlcmdpZXNcIixcbiAgXCJkaWFnbm9zdGljX3JlcG9ydHNcIixcbiAgXCJwcm9jZWR1cmVzXCIsXG5dO1xuXG4vLyBDaGVhcCBwcmUtZmxpZ2h0OiBkb2VzIHRoaXMgTkhJIHRhYiBoYXZlIGFuIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbj9cbi8vIFVzZXMgdGhlIHNhbWUgc2Vzc2lvblN0b3JhZ2UudG9rZW4gKyBsaWdodHdlaWdodCBBUEkgY2FsbCBwYXR0ZXJuIGFzXG4vLyBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkuIERvZXNuJ3QgcmV0dXJuIGFueXRoaW5nIFBJSSBcdTIwMTQganVzdCBhXG4vLyBib29sZWFuIGZvciB0aGUgcG9wdXAgdG8gZGVjaWRlIHdoZXRoZXIgdG8gc3VyZmFjZSBhIFwibG9nIGluIGZpcnN0XCJcbi8vIGJhbm5lci4gUmV0dXJucyBudWxsIHdoZW4gd2UgY2FuJ3QgdGVsbCAoc2NyaXB0LWluamVjdGlvbiBibG9ja2VkLFxuLy8gdGltZW91dCwgZXRjLikgc28gdGhlIHBvcHVwIGNhbiBmYWxsIGJhY2sgdG8gXCJlbmFibGVkXCIgcmF0aGVyIHRoYW5cbi8vIHNjYXJpbmcgdGhlIHVzZXIgd2l0aCBhIGZhbHNlIG5lZ2F0aXZlLlxuYXN5bmMgZnVuY3Rpb24gX2NoZWNrTmhpTG9naW5TdGF0ZSh0YWJJZCkge1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU2FtZSBlbmRwb2ludCBhcyB0aGUgY2lkIGF1dG8tZmV0Y2ggXHUyMDE0IGtub3duIHRvIG5lZWQgYW5cbiAgICAgICAgICAvLyBhdXRoZW50aWNhdGVkIHNlc3Npb24gYW5kIHRvIGJlIGNoZWFwLlxuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MTBzMDEvcGFnZV9sb2FkXCIsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0fWAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyA0MDEvNDAzIFx1MjE5MiBzZXNzaW9uIHRva2VuIHJlamVjdGVkLiAyMDAgXHUyMTkyIGxvZ2dlZCBpbi5cbiAgICAgICAgICByZXR1cm4gci5vaztcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09PSBcImJvb2xlYW5cIiA/IHJlc3VsdCA6IG51bGw7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8vIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZW5kcG9pbnQgSUhLRTM0MTBTMDEgKFx1NjIxMVx1NjNBNVx1N0EyRVx1N0QwMFx1OTMwNCAvIENPVklEIFx1N0JFOVx1NkFBMlx1N0QwMFx1OTMwNCkgaGFwcGVuc1xuLy8gdG8gY2FycnkgdGhlIGxvZ2dlZC1pbiB1c2VyJ3MgcmVhbCBjaXRpemVuIElEIGluIHRoZSByZXNwb25zZSAoYGNpZGBcbi8vIGZpZWxkLCBlLmcuIFwiUDEyMzQ1MDg2NlwiKS4gVXNlIGl0IHRvIHNlZWQgLyByZWZyZXNoIHRoZSBwYXRpZW50X1xuLy8gb3ZlcnJpZGUncyBpZF9ubyBzbyBpdCBhbHdheXMgdHJhY2tzIFwid2hvc2Ugc2Vzc2lvbiBpcyBjdXJyZW50bHlcbi8vIGFjdGl2ZSBpbiB0aGUgTkhJIHRhYlwiLlxuLy9cbi8vIEhpc3Rvcnkgbm90ZTogdGhpcyBmdW5jdGlvbiB1c2VkIHRvIGVhcmx5LXJldHVybiB3aGVuZXZlciBpZF9ubyB3YXNcbi8vIGFscmVhZHkgYSByZWFsLWxvb2tpbmcgY2lkIChcImRvbid0IHRvdWNoIGEgbWFudWFsbHktZW50ZXJlZCBJRFwiKS5cbi8vIFRoYXQgc2hvcnQtY2lyY3VpdCBwcmUtZGF0ZWQgdjAuNi4wIHdoaWNoIHJlbW92ZWQgaWRfbm8gZnJvbSB0aGUgVUlcbi8vIFx1MjAxNCB0aGVyZSdzIG5vIFwibWFudWFsXCIgcGF0aCBhbnltb3JlLCB0aGUgZmllbGQgaXMgcHVyZWx5IGludGVybmFsLlxuLy8gVGhlIHNob3J0LWNpcmN1aXQgYWxzbyBwcm9kdWNlZCB0aGUgYnVnIHBhdHRlcm46IHVzZXIgc3RhcnRzIHN5bmNcbi8vIHdpdGggUGF0aWVudCBCIGxvZ2dlZCBpbiAoY2lkX0Igd3JpdHRlbiB0byBvdmVycmlkZSksIHJlYWxpc2VzIHdyb25nXG4vLyB0YWIsIHN3aXRjaGVzIE5ISSB0YWIgdG8gUGF0aWVudCBBLCByZS1zeW5jcyBcdTIwMTQgaWRfbm8gc3RheXMgY2lkX0Jcbi8vIGJlY2F1c2UgXCJhbHJlYWR5IGEgcmVhbCBjaWRcIi4gTm93IHdlIGFsd2F5cyBwcm9iZSBhbmQgZm9sbG93IHRoZVxuLy8gc2Vzc2lvbidzIHRydXRoLiBNYW51YWwgb3ZlcnJpZGUgaXMgZ29uZSwgTkhJIHNlc3Npb24gaXMgYXV0aG9yaXRhdGl2ZS5cbmFzeW5jIGZ1bmN0aW9uIF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaSh0YWJJZCwgcGF0aWVudE92ZXJyaWRlKSB7XG4gIGNvbnN0IGN1cnJlbnQgPSBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfHwgXCJcIjtcblxuICBsZXQgY2lkID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgdGFyZ2V0OiB7IHRhYklkIH0sXG4gICAgICBmdW5jOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICAgIGlmICghdCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKFwiL2FwaS9paGtlMzAwMC9paGtlMzQxMHMwMS9wYWdlX2xvYWRcIiwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIiwgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3R9YCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIG51bGw7XG4gICAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgIHJldHVybiBib2R5Py5jaWQgfHwgbnVsbDtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gVmFsaWRhdGUgaXQgbG9va3MgbGlrZSBhIFRhaXdhbiBuYXRpb25hbCBJRCAoMSBsZXR0ZXIgKyA5IGRpZ2l0cylcbiAgICAvLyBiZWZvcmUgdHJ1c3RpbmcgaXQuIEF2b2lkcyBhY2NpZGVudGFsbHkgcHJvbW90aW5nIGdhcmJhZ2UgdG8gdGhlXG4gICAgLy8gUGF0aWVudCByZXNvdXJjZSdzIHVuaXF1ZSBrZXkuXG4gICAgaWYgKHJlc3VsdCAmJiAvXltBLVpdWzEyXVxcZHs4fSQvLnRlc3QocmVzdWx0KSkgY2lkID0gcmVzdWx0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBJSEtFMzQxMCBjaWQgZmV0Y2ggZmFpbGVkOlwiLCBlPy5tZXNzYWdlID8/IGUpO1xuICB9XG5cbiAgaWYgKGNpZCAmJiBjaWQgIT09IGN1cnJlbnQpIHtcbiAgICBwYXRpZW50T3ZlcnJpZGUgPSB7IC4uLnBhdGllbnRPdmVycmlkZSwgaWRfbm86IGNpZCB9O1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHBhdGllbnRPdmVycmlkZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICAvLyBQYXRpZW50LXN3aXRjaCBjbGVhbnVwLiBJZiB0aGUgY2lkIGp1c3QgY2hhbmdlZCBmcm9tIG9uZSByZWFsXG4gICAgLy8gY2lkIHRvIGFub3RoZXIgKG5vdCBqdXN0IFwiYXV0by1YWFhYIFx1MjE5MiByZWFsIGNpZFwiIGZpcnN0LXN5bmMgc3dhcCksXG4gICAgLy8gdGhlIHByZXZpb3VzbHktc3Rhc2hlZCBGSElSIGJ1bmRsZSBiZWxvbmdzIHRvIHRoZSBPVEhFUiBwYXRpZW50LlxuICAgIC8vIERyb3AgaXQgc28gdGhlIHBvcHVwJ3MgZG93bmxvYWQgYnV0dG9uIGRvZXNuJ3Qga2VlcCBvZmZlcmluZyB0aGVcbiAgICAvLyB3cm9uZyBwYXRpZW50J3MgZmlsZS4gU2FtZSBzZXQgb2Ygd2lwZXMgcG9wdXAuanMgZG9lcyBpblxuICAgIC8vIHNhdmVQYXRpZW50T3ZlcnJpZGUgd2hlbiBpdCBkZXRlY3RzIHBhdGllbnRDaGFuZ2VkLlxuICAgIGNvbnN0IHN3aXRjaGVkUmVhbFBhdGllbnRzID1cbiAgICAgIGN1cnJlbnQgJiYgIWN1cnJlbnQuc3RhcnRzV2l0aChcImF1dG8tXCIpICYmIGN1cnJlbnQgIT09IGNpZDtcbiAgICBpZiAoc3dpdGNoZWRSZWFsUGF0aWVudHMpIHtcbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShQRU5ESU5HX0JVTkRMRV9LRVkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhdGllbnRPdmVycmlkZTtcbn1cblxuLy8gUmVhZCB0aGUgbWFzay1uYW1lIHByZWZlcmVuY2UgZnJlc2ggZnJvbSBzdG9yYWdlLiBXZSBkb24ndCBjYWNoZSBcdTIwMTRcbi8vIHJ1bk5oaUFwaVN5bmMgaXMgaW52b2tlZCBhdCBtb3N0IGEgZmV3IHRpbWVzIHBlciBzZXNzaW9uIGFuZCB0aGUgU1dcbi8vIGNhbiBiZSB0b3JuIGRvd24gKyByZXN0YXJ0ZWQgYW55IHRpbWUsIHNvIGEgc2luZ2xlIGdldCgpIHBlciBzeW5jIGlzXG4vLyBjaGVhcGVyIHRoYW4gc3luY2luZyBzdGF0ZSBhY3Jvc3MgU1cgbGlmZWN5Y2xlcy5cbmFzeW5jIGZ1bmN0aW9uIF9pc01hc2tFbmFibGVkKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgbWFza05hbWVFbmFibGVkIH0gPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJtYXNrTmFtZUVuYWJsZWRcIik7XG4gICAgcmV0dXJuIG1hc2tOYW1lRW5hYmxlZCA9PT0gdHJ1ZTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZE92ZXJyaWRlUGF0aWVudChvdiwgbWFza0VuYWJsZWQpIHtcbiAgY29uc3QgZGlzcGxheU5hbWUgPSBtYXNrRW5hYmxlZCA/IG1hc2tOYW1lKG92Lm5hbWUgfHwgXCJcIikgOiBvdi5uYW1lIHx8IFwiXCI7XG4gIGNvbnN0IHJhdyA9IHtcbiAgICBpZDogb3YuaWRfbm8sXG4gICAgaWRlbnRpZmllcjogb3YuaWRfbm8sXG4gICAgbmFtZTogZGlzcGxheU5hbWUgfHwgb3YuaWRfbm8sXG4gIH07XG4gIGlmIChvdi5iaXJ0aF9kYXRlKSByYXcuYmlydGhEYXRlID0gb3YuYmlydGhfZGF0ZTtcbiAgaWYgKG92LmdlbmRlcikgcmF3LmdlbmRlciA9IG92LmdlbmRlcjtcbiAgcmV0dXJuIG1hcFBhdGllbnQocmF3KTtcbn1cblxuLy8gV2FsayBhIEpTT04tbGlrZSB2YWx1ZSBhbmQgcmVwbGFjZSBldmVyeSBzdHJpbmcgdG9rZW4gZXF1YWwgdG8gb3Jcbi8vIGNvbnRhaW5pbmcgYG5lZWRsZWAgd2l0aCBgcmVwbGFjZW1lbnRgLiBVc2VkIHRvIHNjcnViIHRoZSByZWFsXG4vLyBwYXRpZW50IG5hbWUgb3V0IG9mIE5ISSBuYXJyYXRpdmUgZmllbGRzIChjbGluaWNhbF9ub3RlLCBjb25jbHVzaW9uLFxuLy8gbm90ZSwgZXRjLikgYmVmb3JlIHRoZSBpdGVtcyByZWFjaCB0aGUgbWFwcGVyLiBPbmx5IHRyaWdnZXJlZCB3aGVuXG4vLyB0aGUgdXNlciBoYXMgb3B0ZWQgaW50byBtYXNraW5nIEFORCBzdXBwbGllZCBhIG5hbWUgXHUyMDE0IGFuZCB0aGVcbi8vIHN1YnN0aXR1dGlvbiBpcyBleGFjdC10b2tlbi1yZXBsYWNlLCBub3QgZnV6enksIHNvIGl0IGNhbid0IHN1cnByaXNlXG4vLyB0aGUgdXNlciBieSBjbG9iYmVyaW5nIHVucmVsYXRlZCBjb250ZW50LlxuZnVuY3Rpb24gX3JlcGxhY2VOYW1lRGVlcCh2YWx1ZSwgbmVlZGxlLCByZXBsYWNlbWVudCkge1xuICBpZiAoIW5lZWRsZSB8fCBuZWVkbGUgPT09IHJlcGxhY2VtZW50KSByZXR1cm4gdmFsdWU7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHJldHVybiB2YWx1ZS5zcGxpdChuZWVkbGUpLmpvaW4ocmVwbGFjZW1lbnQpO1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHJldHVybiB2YWx1ZS5tYXAoKHYpID0+IF9yZXBsYWNlTmFtZURlZXAodiwgbmVlZGxlLCByZXBsYWNlbWVudCkpO1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHZhbHVlKSBvdXRba10gPSBfcmVwbGFjZU5hbWVEZWVwKHZhbHVlW2tdLCBuZWVkbGUsIHJlcGxhY2VtZW50KTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKSB7XG4gIGNvbnN0IHBhdGllbnQgPSBfYnVpbGRPdmVycmlkZVBhdGllbnQocGF0aWVudE92ZXJyaWRlLCBtYXNrRW5hYmxlZCk7XG4gIGNvbnN0IHBpZCA9IHBhdGllbnQuaWQ7XG4gIGNvbnN0IGFsbCA9IFtwYXRpZW50XTtcblxuICBmb3IgKGNvbnN0IHB0IG9mIF9MT0NBTF9QQUdFX1RZUEVfT1JERVIpIHtcbiAgICBjb25zdCBpdGVtcyA9IGJ5VHlwZVtwdF07XG4gICAgaWYgKCFpdGVtcyB8fCBpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGxldCBtYXBwZWQ7XG4gICAgaWYgKEdST1VQX0hBTkRMRVJTW3B0XSkge1xuICAgICAgbWFwcGVkID0gR1JPVVBfSEFORExFUlNbcHRdKGl0ZW1zLCBwaWQpO1xuICAgIH0gZWxzZSBpZiAoTElTVF9IQU5ETEVSU1twdF0pIHtcbiAgICAgIGNvbnN0IFtmbl0gPSBMSVNUX0hBTkRMRVJTW3B0XTtcbiAgICAgIG1hcHBlZCA9IGl0ZW1zXG4gICAgICAgIC5maWx0ZXIoKGl0KSA9PiBpdCAmJiB0eXBlb2YgaXQgPT09IFwib2JqZWN0XCIpXG4gICAgICAgIC5tYXAoKGl0KSA9PiBmbihpdCwgcGlkKSlcbiAgICAgICAgLmZpbHRlcigocikgPT4gciAhPT0gbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAocHQgPT09IFwiZW5jb3VudGVyc1wiKSBtYXBwZWQgPSBkZWR1cEFkbWlzc2lvbkRheUFtYihtYXBwZWQpO1xuICAgIGFsbC5wdXNoKC4uLm1hcHBlZCk7XG4gIH1cblxuICAvLyBEZWR1cCBieSAocmVzb3VyY2VUeXBlLCBpZCkgYmVmb3JlIGFzc2VtYmxpbmcgdGhlIEJ1bmRsZS4gTXVsdGlwbGVcbiAgLy8gTkhJIGVuZHBvaW50cyBjYW4gZmVlZCB0aGUgc2FtZSBwYWdlX3R5cGUgKGUuZy4gZW5jb3VudGVycyAvXG4gIC8vIGlucGF0aWVudCAvIGlucGF0aWVudF9sZWdhY3kgYWxsIFx1MjE5MiBwYWdlX3R5cGU9XCJlbmNvdW50ZXJzXCIpLCBhbmQgdGhlXG4gIC8vIG1hcHBlciBwcm9kdWNlcyBkZXRlcm1pbmlzdGljIHN0YWJsZSBJRHMgXHUyMDE0IHNvIHR3byByYXcgaXRlbXMgdGhhdFxuICAvLyBkZXNjcmliZSB0aGUgc2FtZSBtZWRpY2FsIGV2ZW50IGNvbGxhcHNlIHRvIG9uZSByZXNvdXJjZS4gQmFja2VuZFxuICAvLyB1cHNlcnQgaGFuZGxlcyB0aGlzIGF1dG9tYXRpY2FsbHkgKHNhbWUgc3RhYmxlIElEID0gc2FtZSBEQiByb3cpO1xuICAvLyBsb2NhbCBtb2RlIGhhcyB0byBkbyBpdCBleHBsaWNpdGx5LiBXaXRob3V0IHRoaXMgZGVkdXAsIHRoZSBsb2NhbFxuICAvLyBCdW5kbGUgZW5kcyB1cCBpbmZsYXRlZCByZWxhdGl2ZSB0byB3aGF0IGJhY2tlbmQgc3RvcmVzIGZyb20gdGhlXG4gIC8vIGlkZW50aWNhbCBOSEkgaW5wdXQuXG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gIGNvbnN0IHVuaXF1ZSA9IFtdO1xuICBmb3IgKGNvbnN0IHIgb2YgYWxsKSB7XG4gICAgY29uc3Qga2V5ID0gYCR7ci5yZXNvdXJjZVR5cGV9LyR7ci5pZH1gO1xuICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICBzZWVuLmFkZChrZXkpO1xuICAgIHVuaXF1ZS5wdXNoKHIpO1xuICB9XG5cbiAgLy8gTGlua2VyICsgc2V4LXN0cmF0aWZpZWQgcmVzb2x2ZXIgcnVuIG9uY2Ugb3ZlciB0aGUgZnVsbCBhc3NlbWJsZWRcbiAgLy8gbGlzdCAoc2FtZSBwaXBlbGluZSBiYWNrZW5kJ3MgL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWQgcnVucywganVzdFxuICAvLyBhZ2FpbnN0IGFuIGluLW1lbW9yeSBjYW5kaWRhdGUgYXJyYXkgaW5zdGVhZCBvZiBhIFNRTGl0ZSBxdWVyeSkuXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXModW5pcXVlLCB1bmlxdWUpO1xuICByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyhwYXRpZW50LCB1bmlxdWUpO1xuXG4gIHJldHVybiB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkJ1bmRsZVwiLFxuICAgIHR5cGU6IFwiY29sbGVjdGlvblwiLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLlxcZCtaJC8sIFwiWlwiKSxcbiAgICBlbnRyeTogdW5pcXVlLm1hcCgocikgPT4gKHtcbiAgICAgIGZ1bGxVcmw6IGAke3IucmVzb3VyY2VUeXBlfS8ke3IuaWR9YCxcbiAgICAgIHJlc291cmNlOiByLFxuICAgIH0pKSxcbiAgfTtcbn1cblxuLy8gTG9jYWwgbW9kZSBzdGFzaGVzIHRoZSBhc3NlbWJsZWQgQnVuZGxlIGluIGNocm9tZS5zdG9yYWdlLmxvY2FsIHVuZGVyXG4vLyBhIHNpbmdsZSBcInBlbmRpbmdGaGlyQnVuZGxlXCIgc2xvdC4gVGhlIHBvcHVwIHNob3dzIGEgZG93bmxvYWQgYnV0dG9uXG4vLyB3aGVuIHRoaXMgc2xvdCBpcyBub24tZW1wdHk7IHRoZSBhY3R1YWwgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCBjYWxsXG4vLyBoYXBwZW5zIGZyb20gdGhlIHBvcHVwIChpbiByZXNwb25zZSB0byBhIHVzZXIgY2xpY2spIHNvIHRoZSBmaWxlXG4vLyBkb2Vzbid0IGFwcGVhciBpbiB0aGUgRG93bmxvYWRzIGJhciB1bmludml0ZWQuXG4vL1xuLy8gU2luZ2xlIHNsb3QgbWVhbnMgYSBuZXcgc3luYyBvdmVyd3JpdGVzIHRoZSBwcmV2aW91cyBwZW5kaW5nIGJ1bmRsZS5cbi8vIGNocm9tZS5zdG9yYWdlLmxvY2FsIGRlZmF1bHQgcXVvdGEgaXMgMTAgTUI7IGEgdHlwaWNhbCBOSEkgc3luYyBpc1xuLy8gd2VsbCB1bmRlciAyIE1CLlxuY29uc3QgUEVORElOR19CVU5ETEVfS0VZID0gXCJwZW5kaW5nRmhpckJ1bmRsZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudElkLCBkYXRlUmFuZ2UpIHtcbiAgLy8gRmlsZW5hbWU6IG5oaS17cGlkfS17c3RhcnRZWVlZTU1ERH0te2VuZFlZWVlNTUREfS5qc29uXG4gIC8vIFdoZW4gbm8gZXhwbGljaXQgZGF0ZVJhbmdlIChOSEkgZGVmYXVsdCA9IFx1OEZEMSAxIFx1NUU3NCksIHN5bnRoZXNpemUgdG9kYXktMXkgXHUyMTkyIHRvZGF5LlxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBwYWQgPSAobikgPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgY29uc3QgZm10ID0gKGQpID0+IGAke2QuZ2V0RnVsbFllYXIoKX0ke3BhZChkLmdldE1vbnRoKCkgKyAxKX0ke3BhZChkLmdldERhdGUoKSl9YDtcbiAgLy8gSGFsZi1tYXNrIHRoZSBJRCBpbiB0aGUgZmlsZW5hbWUgc28gdGhlIHVzZXIncyBEb3dubG9hZHMgZm9sZGVyXG4gIC8vIGRvZXNuJ3QgbGVhayB0aGUgZnVsbCBcdThFQUJcdTUyMDZcdThCNDkgKHdvdWxkIGJlIHZpc2libGUgdG8gYW55b25lIHNlZWluZ1xuICAvLyBhIGZpbGUgbGlzdGluZyBvciBkb3dubG9hZC1iYXIgcHJldmlldykuIGBYYCBiZWNhdXNlIGAqYCBpc1xuICAvLyBpbnZhbGlkIGluIFdpbmRvd3MgcGF0aHMuIEJ1bmRsZSBDT05URU5UUyBzdGlsbCBjYXJyeSB0aGUgcmVhbFxuICAvLyBJRCB1bmRlciBQYXRpZW50LmlkIFx1MjAxNCBmaWxlIG93bmVyIGtub3dzIHdob3NlIGRhdGEgaXQgaXMuXG4gIGNvbnN0IG1hc2tlZFBpZCA9IG1hc2tJZChwYXRpZW50SWQgfHwgXCJ1bmtub3duXCIsIFwiWFwiKTtcbiAgY29uc3Qgc2FmZVBpZCA9IG1hc2tlZFBpZC5yZXBsYWNlKC9bXkEtWmEtejAtOV8tXS9nLCBcIl9cIik7XG4gIGNvbnN0IGNvbXBhY3QgPSAoZCkgPT4gKGQgfHwgXCJcIikuc2xpY2UoMCwgMTApLnJlcGxhY2UoLy0vZywgXCJcIik7XG4gIGxldCBzLCBlO1xuICBpZiAoZGF0ZVJhbmdlICYmIChkYXRlUmFuZ2Uuc3RhcnQgfHwgZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICBzID0gY29tcGFjdChkYXRlUmFuZ2Uuc3RhcnQpIHx8IGZtdChub3cpO1xuICAgIGUgPSBjb21wYWN0KGRhdGVSYW5nZS5lbmQpIHx8IGZtdChub3cpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG9uZVllYXJBZ28gPSBuZXcgRGF0ZShub3cpO1xuICAgIG9uZVllYXJBZ28uc2V0RnVsbFllYXIob25lWWVhckFnby5nZXRGdWxsWWVhcigpIC0gMSk7XG4gICAgcyA9IGZtdChvbmVZZWFyQWdvKTtcbiAgICBlID0gZm10KG5vdyk7XG4gIH1cbiAgY29uc3QgZmlsZW5hbWUgPSBgbmhpLSR7c2FmZVBpZH0tJHtzfS0ke2V9Lmpzb25gO1xuICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoYnVuZGxlLCBudWxsLCAyKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBbUEVORElOR19CVU5ETEVfS0VZXToge1xuICAgICAgZmlsZW5hbWUsXG4gICAgICBqc29uLFxuICAgICAgYnl0ZXM6IGpzb24ubGVuZ3RoLFxuICAgICAgZ2VuZXJhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICBwYXRpZW50SWQ6IHBhdGllbnRJZCB8fCBudWxsLFxuICAgIH0sXG4gIH0pO1xuICByZXR1cm4geyBmaWxlbmFtZSwgYnl0ZXM6IGpzb24ubGVuZ3RoIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bk5oaUFwaVN5bmMoeyB0YWJJZCwgbW9kZSwgYmFja2VuZCwgc3luY0FwaUtleSwgbmhpQmFzZSwgcGF0aWVudE92ZXJyaWRlLCBkYXRlUmFuZ2UsIGRhdGVSYW5nZUxhYmVsIH0pIHtcbiAgX2NhbmNlbGxlZCA9IGZhbHNlO1xuICBjb25zdCBCQVNFID0gbmhpQmFzZSB8fCBgaHR0cHM6Ly8ke05ISV9IT1NUfWA7XG5cbiAgaWYgKCFwYXRpZW50T3ZlcnJpZGUpIHtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgc3luY1N0YXR1czoge1xuICAgICAgICBydW5uaW5nOiBmYWxzZSxcbiAgICAgICAgcHJvZ3Jlc3M6IFwiXHUyNkQ0IFx1OEFDQlx1NTE0OFx1NTcyOCBwb3B1cCBcdTU4NkJcdTVCRUJcdTc1QzVcdTRFQkFcdThDQzdcdTY1OTlcdTVGOENcdTUxOERcdThBNjZcIixcbiAgICAgICAgcGhhc2U6IFwiZXJyb3JcIiwgdHM6IERhdGUubm93KCksIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghdGFiSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBUEkgc3luYyByZXF1aXJlcyBOSEkgdGFiIGlkIChjb29raWVzIGFyZSBmaXJzdC1wYXJ0eSlcIik7XG4gIH1cblxuICAvLyBGaXJzdCBjaGFuY2UgdG8gdXBncmFkZSB0aGUgcGF0aWVudCBJRDogaWYgdGhlIHBvcHVwIGdhdmUgdXMgYW5cbiAgLy8gXCJhdXRvLVhYWFhYWFhYXCIgcGxhY2Vob2xkZXIgKHVzZXIgZGlkbid0IG1hbnVhbGx5IHR5cGUgb25lKSxcbiAgLy8gZmV0Y2ggdGhlIHJlYWwgb25lIGZyb20gTkhJJ3MgSUhLRTM0MTBTMDEgZW5kcG9pbnQgKHJlc3BvbnNlLmNpZFxuICAvLyBpcyB0aGUgY2l0aXplbiBJRCkuIFBlcnNpc3QgYmFjayB0byBzdG9yYWdlIHNvIHN1YnNlcXVlbnQgc3luY3NcbiAgLy8gYXJlIHN0YWJsZS4gTWFudWFsbHktdHlwZWQgSURzIGFyZSByZXNwZWN0ZWQgYXMtaXMuXG4gIHBhdGllbnRPdmVycmlkZSA9IGF3YWl0IF9tYXliZUZldGNoUGF0aWVudElkRnJvbU5oaSh0YWJJZCwgcGF0aWVudE92ZXJyaWRlKTtcblxuICAvLyBTdGFzaCBjb250ZXh0IHNvIHRoZSBzdG9wU3luYyBtZXNzYWdlIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuICAvLyBkYXRhIChERUxFVEUgL3N5bmMvcGF0aWVudC97aWRfbm99KSB3aXRob3V0IHVzIGhhdmluZyB0byBzZW5kIGl0XG4gIC8vIGJhY2sgdGhyb3VnaCBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZS5cbiAgX2FjdGl2ZVN5bmNDdHggPSB7IGJhY2tlbmQsIHN5bmNBcGlLZXksIHBhdGllbnRJZDogcGF0aWVudE92ZXJyaWRlLmlkX25vIH07XG5cbiAgLy8gV2FsbC1jbG9jayBzdGFydCB0aW1lIFx1MjAxNCB1c2VkIHRvIGNvbXB1dGUgZWxhcHNlZCBzZWNvbmRzIGZvciB0aGVcbiAgLy8gZmluYWwgc3RhdHVzIGxpbmUgKFwiXHU3RTNEXHU4MDE3XHU2NjQyIDEyLjMgXHU3OUQyXCIpLiBTdGFzaCBvbiBhIGxvY2FsIHNvIHdlIGNhblxuICAvLyByZWFjaCBpdCBmcm9tIHRoZSBjb21wbGV0aW9uIG1lc3NhZ2UgYXQgdGhlIHZlcnkgZW5kLlxuICBjb25zdCBfdDAgPSBEYXRlLm5vdygpO1xuICAvLyBQZXItcGhhc2UgdGltaW5ncywgc3VyZmFjZWQgaW50byB0aGUgcG9wdXAncyBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiIHNvIHRoZSB1c2VyXG4gIC8vIGNhbiBzZWUgZXhhY3RseSB3aGVyZSB0aW1lIGlzIGdvaW5nLiBFYWNoIGVudHJ5OiB7IG5hbWUsIG1zIH0uXG4gIGNvbnN0IF9waGFzZXMgPSBbXTtcbiAgbGV0IF9waGFzZVN0YXJ0ID0gX3QwO1xuICBjb25zdCBfbWFya1BoYXNlID0gKG5hbWUpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIF9waGFzZXMucHVzaCh7IG5hbWUsIG1zOiBub3cgLSBfcGhhc2VTdGFydCB9KTtcbiAgICBfcGhhc2VTdGFydCA9IG5vdztcbiAgfTtcbiAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICBydW5uaW5nOiB0cnVlLCBwcm9ncmVzczogXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIHBoYXNlOiBcImluaXRcIixcbiAgICBzdGFydGVkOiBfdDAsIHRvdGFsUmVzb3VyY2VzOiAwLCBob3N0OiBOSElfSE9TVCwgZXJyb3JzOiBbXSxcbiAgfSk7XG5cbiAgLy8gU3RlcCAxOiBmZXRjaCBhbGwgZW5kcG9pbnRzIGluIFBBUkFMTEVMIGluc2lkZSB0aGUgTkhJIHRhYi4gUnVubmluZyBpblxuICAvLyB0YWIgY29udGV4dCBtZWFucyBzYW1lLW9yaWdpbiBjb29raWVzIGFyZSBzZW50IGF1dG9tYXRpY2FsbHkgXHUyMDE0IGZldGNoXG4gIC8vIGZyb20gdGhlIFNXIHdvdWxkIGJlIGNyb3NzLW9yaWdpbiBhbmQgU2FtZVNpdGUgYmxvY2tzIHRoZSBzZXNzaW9uXG4gIC8vIGNvb2tpZSwgaGVuY2Ugd2UgZ290IFwic2Vzc2lvbiBleHBpcmVkXCIgZXZlbiB3aGVuIGxvZ2dlZCBpbi5cbiAgLy8gUGFzcyBvbmx5IHNlcmlhbGlzYWJsZSBkYXRhIChwYXRocywgbWV0aG9kLCBuYW1lKTsgYWRhcHRlcnMgc3RheSBpbiBTVy5cbiAgLy8gSW5qZWN0IElTTy1kYXRlIHJhbmdlIGludG8gZWFjaCBlbmRwb2ludCB0aGF0IHN1cHBvcnRzIGl0IChjb252ZXJ0c1xuICAvLyB0byBcdTZDMTFcdTU3MEIgZm9ybWF0IHZpYSBpc29Ub1JPQykuIFNraXBwZWQgZW5kcG9pbnRzIGtlZXAgdGhlaXIgZGVmYXVsdFxuICAvLyBOSEktc2lkZSB3aW5kb3cgKDEtMiB5ZWFycyBkZXBlbmRpbmcgb24gdGhlIHBhZ2UpLlxuICBjb25zdCBmZXRjaFNwZWMgPSBOSElfQVBJX0VORFBPSU5UUy5tYXAoKGVwKSA9PiB7XG4gICAgY29uc3QgcGF0aCA9IGVwLnN1cHBvcnRzRGF0ZVJhbmdlID8gYXBwbHlEYXRlUmFuZ2VUb1BhdGgoZXAucGF0aCwgZGF0ZVJhbmdlKSA6IGVwLnBhdGg7XG4gICAgcmV0dXJuIHsgbmFtZTogZXAubmFtZSwgdXJsOiBCQVNFICsgcGF0aCwgbWV0aG9kOiBcIkdFVFwiIH07XG4gIH0pO1xuICBpZiAoZGF0ZVJhbmdlICYmIChkYXRlUmFuZ2Uuc3RhcnQgfHwgZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICBjb25zb2xlLmxvZyhcIltOSEkgQVBJIHN5bmNdIGRhdGUgcmFuZ2U6XCIsXG4gICAgICBgJHtkYXRlUmFuZ2Uuc3RhcnQgfHwgXCIodW5ib3VuZGVkKVwifSBcdTIxOTIgJHtkYXRlUmFuZ2UuZW5kIHx8IFwiKHVuYm91bmRlZClcIn1gKTtcbiAgfVxuXG4gIGxldCBzZXR0bGVkUmF3O1xuICB0cnkge1xuICAgIFt7IHJlc3VsdDogc2V0dGxlZFJhdyB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jIChzcGVjcykgPT4ge1xuICAgICAgICAvLyBOSEkgYXV0aDogY29va2llcyArIEpXVCBpbiBzZXNzaW9uU3RvcmFnZS4gVGhlIFNQQSdzIGF4aW9zIHNldHNcbiAgICAgICAgLy8gYEF1dGhvcml6YXRpb246IEJlYXJlciA8dG9rZW4+YCBvbiBldmVyeSBBUEkgY2FsbC4gU2Vzc2lvblxuICAgICAgICAvLyBjb29raWVzIGFsb25lIHJldHVybiA0MDEuXG4gICAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXRva2VuKSByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcblxuICAgICAgICAvLyBEZXRlY3QgSURMRS90aW1lb3V0IHBhZ2UgYWxyZWFkeSByZWRpcmVjdGVkIG9uIHRoaXMgdGFiLlxuICAgICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFt7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH1dO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gNjAtc2Vjb25kIHRpbWVvdXQgcGVyIGZldGNoIFx1MjAxNCBzb21lIE5ISSBlbmRwb2ludHMgKGVuY291bnRlcnMsXG4gICAgICAgIC8vIG1lZHMpIHRha2UgMjArIHNlY29uZHMuXG4gICAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHMsIG1zKSB7XG4gICAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIG1zKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHMudXJsLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogcy5tZXRob2QsXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICAgIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgY29uc3QgY3QgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgICBpZiAoIWN0LmluY2x1ZGVzKFwiYXBwbGljYXRpb24vanNvblwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgbm9uLUpTT04gKGN0PSR7Y3R9KWAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBib2R5O1xuICAgICAgICAgICAgdHJ5IHsgYm9keSA9IGF3YWl0IHIuanNvbigpOyB9XG4gICAgICAgICAgICBjYXRjaCAoZSkgeyByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcIkpTT04gcGFyc2U6IFwiICsgZS5tZXNzYWdlIH07IH1cbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgYm9keSB9O1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBpZiAoZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIikgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJ0aW1lb3V0IDYwc1wiIH07XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbmN1cnJlbmN5LWxpbWl0ZWQgZXhlY3V0aW9uOiBtYXggMyBpbiBmbGlnaHQgYXQgb25jZS4gTkhJJ3NcbiAgICAgICAgLy8gYWJ1c2UgZGV0ZWN0aW9uIGJsb2NrcyBidXJzdHM7IHdpdGggMTEgcGFyYWxsZWwgZmV0Y2hlcyBpdFxuICAgICAgICAvLyB0aHJvdHRsZWQgdGhlIHNlc3Npb24gYW5kIHJlZGlyZWN0ZWQgdG8gSUhLRTMwMDFTOTlfSURMRS5cbiAgICAgICAgLy8gMyBhdCBhIHRpbWUgKyAyMDBtcyBqaXR0ZXIgaXMgZ2VudGxlIGVub3VnaCBmb3IgMS1zaG90IHN5bmMuXG4gICAgICAgIGNvbnN0IENPTkNVUlJFTkNZID0gMztcbiAgICAgICAgY29uc3QgSklUVEVSX01TID0gMjAwO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gbmV3IEFycmF5KHNwZWNzLmxlbmd0aCk7XG4gICAgICAgIGxldCBuZXh0SWR4ID0gMDtcbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICAgIHdoaWxlIChuZXh0SWR4IDwgc3BlY3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gbmV4dElkeCsrO1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiBKSVRURVJfTVMpKTtcbiAgICAgICAgICAgIHJlc3VsdHNbaV0gPSBhd2FpdCBmZXRjaE9uZShzcGVjc1tpXSwgNjAwMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3b3JrZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQ1VSUkVOQ1kgJiYgdyA8IHNwZWNzLmxlbmd0aDsgdysrKSB7XG4gICAgICAgICAgd29ya2Vycy5wdXNoKHdvcmtlcigpKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCh3b3JrZXJzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9LFxuICAgICAgYXJnczogW2ZldGNoU3BlY10sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGV4ZWN1dGVTY3JpcHQgZmFpbGVkOiAke2UubWVzc2FnZX1gKTtcbiAgfVxuXG4gIC8vIERldGVjdCBzZXNzaW9uIGV4cGlyZWQgYWNyb3NzIHJlc3VsdHMuXG4gIGlmIChzZXR0bGVkUmF3LnNvbWUoKHIpID0+IHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIH1cblxuICBjb25zdCBlcnJvcnMgPSBbXTtcblxuICAvLyBHZW5lcmljIGxpc3QgZXh0cmFjdGlvbjogaGFuZGxlcyBhbGwgb2JzZXJ2ZWQgTkhJIHNoYXBlcy5cbiAgLy8gICAtIFBsYWluIGFycmF5IChJSEtFMzQwOSBsYWIpXG4gIC8vICAgLSB7c3BfSUhLRTxYPl9kYXRhOiBbLi4uXX0gIChtZWRpY2F0aW9ucywgYWxsZXJnaWVzKVxuICAvLyAgIC0ge3dlc3Rlcm5fZGF0YSwgY2hpbmVzZV9kYXRhLCBkZW50aXN0X2RhdGE6IFsuLi5dfSAoZW5jb3VudGVyIGxpc3QsXG4gIC8vICAgICBzcGxpdCBieSBcdTg5N0ZcdTkxQUIvXHU0RTJEXHU5MUFCL1x1NzI1OVx1OTFBQiBcdTIwMTQgd2Ugd2FudCBhbGwgdGhyZWUpXG4gIC8vIEZvciBtdWx0aS1hcnJheSBzaGFwZXMgd2UgbWVyZ2UgYWxsIGFycmF5cyBhbmQgdGFnIGVhY2ggaXRlbSB3aXRoXG4gIC8vIGBfX3NlY3Rpb25gICh0aGUgc291cmNlIGtleSkgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgZnVuY3Rpb24gZXh0cmFjdExpc3QoYm9keSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGJvZHkpKSByZXR1cm4gYm9keTtcbiAgICBpZiAoIWJvZHkgfHwgdHlwZW9mIGJvZHkgIT09IFwib2JqZWN0XCIpIHJldHVybiBbXTtcbiAgICBsZXQgYXJyYXlLZXlzID0gT2JqZWN0LmVudHJpZXMoYm9keSkuZmlsdGVyKChbXywgdl0pID0+IEFycmF5LmlzQXJyYXkodikpO1xuICAgIGlmIChhcnJheUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBhcnJheUtleXNbMF1bMV07XG4gICAgLy8gTXVsdGlwbGUgYXJyYXlzIFx1MjAxNCBkcm9wIFVJLWhlbHBlciBhcnJheXMgKGRyb3Bkb3duIG9wdGlvbnMsIHNvcnRcbiAgICAvLyBzZWxlY3RvcnMsIGxvb2t1cCB0YWJsZXMpLiBOSEkgbWl4ZXMgdGhlbSBpbnRvIHRoZSBzYW1lIHJlc3BvbnNlXG4gICAgLy8gKGUuZy4gaW1hZ2luZyByZXR1cm5zIHNwX0lIS0UzNDA4UzAxX2RhdGEgKyBpY2Q5Y21fc2VsZWN0KS5cbiAgICBjb25zdCBIRUxQRVJfUkUgPSAvc2VsZWN0fG9wdGlvbnxkcm9wZG93bnxmaWx0ZXJ8c29ydHxsb29rdXAvaTtcbiAgICBjb25zdCBkYXRhS2V5cyA9IGFycmF5S2V5cy5maWx0ZXIoKFtrXSkgPT4gIUhFTFBFUl9SRS50ZXN0KGspKTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAxKSByZXR1cm4gZGF0YUtleXNbMF1bMV07XG4gICAgaWYgKGRhdGFLZXlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTsgLy8gZmFsbGJhY2tcbiAgICBhcnJheUtleXMgPSBkYXRhS2V5cztcbiAgICAvLyBNdWx0aXBsZSBkYXRhIGFycmF5cyAoZS5nLiB3ZXN0ZXJuX2RhdGEvY2hpbmVzZV9kYXRhL2RlbnRpc3RfZGF0YSlcbiAgICAvLyBcdTIwMTQgbWVyZ2Ugd2l0aCBfX3NlY3Rpb24gdGFnIHNvIGFkYXB0ZXJzIGNhbiBkaXNhbWJpZ3VhdGUuXG4gICAgY29uc3QgbWVyZ2VkID0gW107XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgYXJyYXlLZXlzKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygdikge1xuICAgICAgICBpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgIG1lcmdlZC5wdXNoKHsgLi4uaXRlbSwgX19zZWN0aW9uOiBrIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lcmdlZC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWQ7XG4gIH1cblxuICAvLyBBcHBseSBTVy1zaWRlIGFkYXB0ZXJzIHRvIGVhY2ggZW5kcG9pbnQncyBib2R5LlxuICBjb25zdCBzZXR0bGVkID0gc2V0dGxlZFJhdy5tYXAoKHIsIGkpID0+IHtcbiAgICBjb25zdCBlcCA9IE5ISV9BUElfRU5EUE9JTlRTW2ldO1xuICAgIGlmIChyLmVycm9yKSB7XG4gICAgICByZXR1cm4geyBzdGF0dXM6IFwicmVqZWN0ZWRcIiwgcmVhc29uOiB7IG1lc3NhZ2U6IGAke2VwLm5hbWV9OiAke3IuZXJyb3J9YCB9IH07XG4gICAgfVxuICAgIGNvbnN0IGxpc3QgPSBleHRyYWN0TGlzdChyLmJvZHkpO1xuICAgIC8vIEFkYXB0ZXJzIHJldHVybiBlaXRoZXI6XG4gICAgLy8gICAtIG9uZSBpdGVtICAgKG1vc3QgYWRhcHRlcnMgXHUyMDE0IGxhYnMsIG1lZHMsIGVuY291bnRlcnMsIGltYWdpbmcpXG4gICAgLy8gICAtIG51bGwvdW5kZWZpbmVkIChza2lwKVxuICAgIC8vICAgLSBhcnJheSBvZiBpdGVtcyAoYWRhcHRBZHVsdFByZXZlbnRpdmUgXHUyMDE0IHVuZm9sZHMgb25lIHNjcmVlbmluZ1xuICAgIC8vICAgICByb3cgaW50byB+MTUgT2JzZXJ2YXRpb24gZW50cmllcylcbiAgICAvLyBGbGF0LWhhbmRsZSBib3RoIHNoYXBlcyBzbyBlYWNoIGFkYXB0ZXIgY2FuIHBpY2sgd2hhdGV2ZXIncyBjbGVhcmVzdC5cbiAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgIGZvciAoY29uc3QgaXQgb2YgbGlzdCkge1xuICAgICAgY29uc3QgciA9IGVwLmFkYXB0KGl0KTtcbiAgICAgIGlmIChyID09PSBudWxsIHx8IHIgPT09IHVuZGVmaW5lZCkgY29udGludWU7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHggb2YgcikgaWYgKHgpIGl0ZW1zLnB1c2goeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtcy5wdXNoKHIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBTbmFwc2hvdCBhIGJvZHkgc2FtcGxlIGZvciBzaGFwZXMgd2hlcmUgYWRhcHRlciByZWplY3RlZCBldmVyeXRoaW5nXG4gICAgLy8gXHUyMDE0IHVzZWQgYnkgdGhlIGRpYWdub3N0aWMgYnJlYWtkb3duIGluIHN0ZXAgMi5cbiAgICBsZXQgYm9keVNhbXBsZSA9IG51bGw7XG4gICAgaWYgKGxpc3QubGVuZ3RoID4gMCAmJiBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIEluY2x1ZGUgdGhlIEZJUlNUIElURU0gKGZ1bGwga2V5cyt2YWx1ZXMpIHNvIHdlIGNhbiBidWlsZCB0aGVcbiAgICAgIC8vIGNvcnJlY3QgYWRhcHRlciB3aXRob3V0IGFub3RoZXIgcm91bmQtdHJpcC4gTkhJIGl0ZW1zIG1heSBpbmNsdWRlXG4gICAgICAvLyBQSUk7IHRoZSB1c2VyIGluc3BlY3RzIHRoaXMgbG9jYWxseSB2aWEgc2VydmljZS13b3JrZXIgZGV2dG9vbHMuXG4gICAgICBib2R5U2FtcGxlID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0b3BMZXZlbEtleXM6IEFycmF5LmlzQXJyYXkoci5ib2R5KSA/IG51bGwgOiBPYmplY3Qua2V5cyhyLmJvZHkgfHwge30pLnNsaWNlKDAsIDEwKSxcbiAgICAgICAgd2FzQXJyYXk6IEFycmF5LmlzQXJyYXkoci5ib2R5KSxcbiAgICAgICAgZmlyc3RJdGVtOiBsaXN0WzBdID8/IG51bGwsXG4gICAgICAgIHNlY29uZEl0ZW06IGxpc3RbMV0gPz8gbnVsbCxcbiAgICAgIH0pLnNsaWNlKDAsIDQwMDApO1xuICAgIH1cbiAgICByZXR1cm4geyBzdGF0dXM6IFwiZnVsZmlsbGVkXCIsIHZhbHVlOiB7IGVwLCBpdGVtcywgcmF3X2NvdW50OiBsaXN0Lmxlbmd0aCwgYm9keVNhbXBsZSwgcmF3TGlzdDogbGlzdCB9IH07XG4gIH0pO1xuXG4gIF9tYXJrUGhhc2UoXCJuaGktcGFyYWxsZWxcIik7XG5cbiAgLy8gU3RlcCAxYTogZW5jb3VudGVyIGRldGFpbCBmYW4tb3V0IChJSEtFMzMwM1MwMikgXHUyMTkyIGNsYXNzaWZ5IGVhY2hcbiAgLy8gSUhLRTMzMDNTMDEgdmlzaXQgYXMgQU1CIC8gRU1FUiAvIElNUCB2aWEgaG9zcF9EQVRBX1RZUEVfTkFNRS5cbiAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBcdTYwMjVcdThBM0EgZGlzdGluY3Rpb247IGRldGFpbCBkb2VzLiBXZSByZS1cbiAgLy8gYWRhcHQgZWFjaCBlbmNvdW50ZXIgaXRlbSB3aXRoIHRoZSBkaXNjb3ZlcmVkIGNsYXNzIGJlZm9yZSB0aGVcbiAgLy8gYmFja2VuZCB1cGxvYWQgc3RlcC5cbiAgY29uc3QgZW5jSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwiZW5jb3VudGVyc1wiKTtcbiAgaWYgKGVuY0lkeCA+PSAwICYmIHNldHRsZWRbZW5jSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW2VuY0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUMzMVx1OTFBQlx1N0QwMFx1OTMwNFx1OEE3M1x1NjBDNVx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRldGFpbE1hcCA9IGF3YWl0IF9mZXRjaEVuY291bnRlckRldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJlLWFkYXB0IHdpdGggY2xhc3NIaW50IGZyb20gZGV0YWlsOyBmYWxsIGJhY2sgdG8gQU1CLlxuICAgICAgICBjb25zdCByZUFkYXB0ZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aXNpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxNYXA/LmdldChpKSB8fCBudWxsO1xuICAgICAgICAgIGNvbnN0IGNscyA9IF9jbGFzc0Zyb21TMDJEZXRhaWwoZGV0YWlsKSB8fCBcIkFNQlwiO1xuICAgICAgICAgIGNvbnN0IGl0ID0gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSh2aXNpdHNbaV0sIGNscyk7XG4gICAgICAgICAgaWYgKGl0KSByZUFkYXB0ZWQucHVzaChpdCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0dGxlZFtlbmNJZHhdLnZhbHVlLml0ZW1zID0gcmVBZGFwdGVkO1xuICAgICAgICBzZXR0bGVkW2VuY0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVBZGFwdGVkLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGVuY291bnRlciBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwiZW5jb3VudGVyLWRldGFpbFwiKTtcblxuICAvLyBTdGVwIDFiOiBtZWRpY2F0aW9ucyBuZWVkIGEgMi1zdGVwIGZldGNoIFx1MjAxNCBJSEtFMzMwNlMwMSBvbmx5IHJldHVybnNcbiAgLy8gdmlzaXQgbWV0YWRhdGEgKGRhdGUsIElDRCwgaG9zcGl0YWwpLCBubyBkcnVnIG5hbWVzLiBEcnVncyBsaXZlIGF0XG4gIC8vIElIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPTxyb3dfSUQ+JmN0eXBlPTIgdW5kZXJcbiAgLy8gaWhrZTMzMDZTMDJfbWFpbl9kYXRhWypdLnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC4gRmFuIG91dCBkZXRhaWxcbiAgLy8gZmV0Y2hlcyBpbnNpZGUgdGhlIHNhbWUgdGFiIGNvbnRleHQgKGNvb2tpZXMgKyBKV1QpLCBrZWVwaW5nXG4gIC8vIGNvbmN1cnJlbmN5IGxpbWl0ZWQgc28gTkhJIGRvZXNuJ3QgSURMRS1yZWRpcmVjdCB1cy5cbiAgLy8gU3RlcCAxYzogaW1hZ2luZyBuZWVkcyBJSEtFMzQwOFMwMiBmb3IgdGhlIGFjdHVhbCByZXBvcnQgbmFycmF0aXZlLlxuICAvLyBMaXN0IGVuZHBvaW50IG9ubHkgaGFzIG9yZGVyIG1ldGFkYXRhOyBjdHlwZSBwYXJhbSBtaXJyb3JzIHRoZVxuICAvLyB2aXNpdCdzIG9yaV9UWVBFIChBIC8gRSAvIFx1MjAyNikuXG4gIGNvbnN0IGltZ0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcImltYWdpbmdcIik7XG4gIGlmIChpbWdJZHggPj0gMCAmJiBzZXR0bGVkW2ltZ0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTVcdTU4MzFcdTU0NEFcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXBvcnRzID0gYXdhaXQgX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS5pdGVtcyA9IHJlcG9ydHM7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZXBvcnRzLmxlbmd0aDtcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgaW1hZ2luZyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwiaW1hZ2luZy1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAxZDogcHJvY2VkdXJlcyBuZWVkIElIS0UzMzA4UzAyIGZvciB0aGUgYWN0dWFsIElDRC0xMC1QQ1NcbiAgLy8gb3BfQ09ERSBhbmQgdGhlIHJlYWwgZXhlY3V0aW9uIGRhdGUgKGV4ZV9TX0RBVEUgb24gc3ViLWxpc3RcbiAgLy8gZW50cmllcykuIFRoZSBsaXN0IGVuZHBvaW50IElIS0UzMzAxUzA1IG9ubHkgZXhwb3NlcyBtZXRhZGF0YTtcbiAgLy8gd2l0aG91dCB0aGlzIGZhbi1vdXQsIGlucGF0aWVudCBwcm9jZWR1cmVzIGdldCBhbmNob3JlZCB0byB0aGVcbiAgLy8gYWRtaXNzaW9uIGRheSAoZnVuY19kYXRlKSBhbmQgZW1pdHRlZCB3aXRoIGNvZGU6XCJcIiAobm8gUENTIGNvZGUpLlxuICBjb25zdCBwcm9jSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwicHJvY2VkdXJlc1wiKTtcbiAgaWYgKHByb2NJZHggPj0gMCAmJiBzZXR0bGVkW3Byb2NJZHhdLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgIGNvbnN0IHZpc2l0cyA9IHNldHRsZWRbcHJvY0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1ODY1NVx1N0Y2RS9cdTYyNEJcdTg4NTNcdThBNzNcdTYwQzVcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwcm9jcyA9IGF3YWl0IF9mZXRjaFByb2NlZHVyZURldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldHRsZWRbcHJvY0lkeF0udmFsdWUuaXRlbXMgPSBwcm9jcztcbiAgICAgICAgc2V0dGxlZFtwcm9jSWR4XS52YWx1ZS5yYXdfY291bnQgPSBwcm9jcy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbcHJvY0lkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBwcm9jZWR1cmVzIGRldGFpbDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9tYXJrUGhhc2UoXCJwcm9jZWR1cmVzLWRldGFpbFwiKTtcblxuICBjb25zdCBtZWRJZHggPSBOSElfQVBJX0VORFBPSU5UUy5maW5kSW5kZXgoKGUpID0+IGUubmFtZSA9PT0gXCJtZWRpY2F0aW9uc1wiKTtcbiAgaWYgKG1lZElkeCA+PSAwICYmIHNldHRsZWRbbWVkSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW21lZElkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NzUyOFx1ODVFNVx1NjYwRVx1N0QzMFx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRydWdJdGVtcyA9IGF3YWl0IF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoe1xuICAgICAgICAgIHRhYklkLCBiYXNlVXJsOiBCQVNFLCB2aXNpdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUuaXRlbXMgPSBkcnVnSXRlbXM7XG4gICAgICAgIC8vIHJhd19jb3VudCBub3cgcmVmbGVjdHMgdGhlICpkcnVnLWxldmVsKiBjb3VudCBmb3IgdGhlIGJyZWFrZG93blxuICAgICAgICAvLyAodmlzaXRzIFx1MjE5MiBkcnVncykuIEtlZXAgdGhlIHZpc2l0IGNvdW50IGluIGEgc2lkZSBmaWVsZCBmb3IgZGVidWcuXG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS52aXNpdENvdW50ID0gdmlzaXRzLmxlbmd0aDtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLnJhd19jb3VudCA9IGRydWdJdGVtcy5sZW5ndGg7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBtZWRpY2F0aW9ucyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwibWVkaWNhdGlvbi1kZXRhaWxcIik7XG5cbiAgLy8gU3RlcCAyOiBhZ2dyZWdhdGUgaXRlbXMgYnkgcGFnZV90eXBlLCBQT1NUIHRvIGJhY2tlbmQuXG4gIGNvbnN0IGJ5VHlwZSA9IHt9O1xuICBsZXQgcmF3X3RvdGFsID0gMDtcbiAgbGV0IGFkYXB0ZWRfdG90YWwgPSAwO1xuICAvLyBQZXItZW5kcG9pbnQgYnJlYWtkb3duIHNvIHRoZSBmaW5hbCBzdGF0dXMgY2FuIHRlbGwgdXNlciBleGFjdGx5XG4gIC8vIHdoaWNoIGVuZHBvaW50cyBjYW1lIGJhY2sgZW1wdHkgLyBtaXMtc2hhcGVkIFx1MjAxNCBtdWNoIG1vcmUgdXNlZnVsIHRoYW5cbiAgLy8gYSBzaW5nbGUgYWdncmVnYXRlZCBudW1iZXIuXG4gIC8vIEJyZWFrZG93biBzaG93biB0byB0aGUgdXNlciB1bmRlciBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiLiBVc2UgdGhlIENoaW5lc2UgbGFiZWxcbiAgLy8gd2hlbiBrbm93bjsgb25seSBmYWxsIGJhY2sgdG8gdGhlIHJhdyBlbmRwb2ludCBuYW1lIGZvciB1bm1hcHBlZFxuICAvLyAobmV3bHkgYWRkZWQpIGVuZHBvaW50cy4gRW1wdHktcmVzdWx0IGVuZHBvaW50cyBhcmUgb21pdHRlZCBmcm9tXG4gIC8vIHRoZSBzdWNjZXNzIHN1bW1hcnkgZW50aXJlbHkgXHUyMDE0IHRoZXkgYWRkIG5vaXNlLiBFcnJvcnMgYWx3YXlzIHNob3dcbiAgLy8gc28gdGhlIHVzZXIga25vd3Mgc29tZXRoaW5nIGRpZG4ndCBjb21lIHRocm91Z2guXG4gIGNvbnN0IGJyZWFrZG93biA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNldHRsZWQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBlcCA9IE5ISV9BUElfRU5EUE9JTlRTW2ldO1xuICAgIGNvbnN0IHMgPSBzZXR0bGVkW2ldO1xuICAgIGNvbnN0IGxhYmVsID0gRU5EUE9JTlRfTEFCRUxfWkhbZXAubmFtZV0gPz8gZXAubmFtZTtcbiAgICBpZiAocy5zdGF0dXMgPT09IFwicmVqZWN0ZWRcIikge1xuICAgICAgZXJyb3JzLnB1c2goYCR7ZXAubmFtZX06ICR7cy5yZWFzb24ubWVzc2FnZX1gKTtcbiAgICAgIGJyZWFrZG93bi5wdXNoKGBcdTI3NEMgJHtsYWJlbH1cdUZGMUFcdTUzRDZcdTVGOTdcdTU5MzFcdTY1NTdgKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCB7IGl0ZW1zLCByYXdfY291bnQgfSA9IHMudmFsdWU7XG4gICAgcmF3X3RvdGFsICs9IHJhd19jb3VudDtcbiAgICBhZGFwdGVkX3RvdGFsICs9IGl0ZW1zLmxlbmd0aDtcbiAgICBpZiAocmF3X2NvdW50ID09PSAwKSBjb250aW51ZTsgLy8gbm90aGluZyB0byBzaG93XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA+IHJhd19jb3VudCAmJiByYXdfY291bnQgPiAwKSB7XG4gICAgICAvLyAxLXRvLW1hbnkgYWRhcHRlciAoZS5nLiBhZHVsdF9wcmV2ZW50aXZlOiBvbmUgc2NyZWVuaW5nIHJvdyBcdTIxOTJcbiAgICAgIC8vIH4xOCBPYnNlcnZhdGlvbnMpLiBTaG93IGJvdGggbnVtYmVycyBzbyB0aGUgdXNlciB1bmRlcnN0YW5kc1xuICAgICAgLy8gd2h5IG9uZSByZWNvcmQgcHJvZHVjZWQgbWFueS5cbiAgICAgIGJyZWFrZG93bi5wdXNoKGAke2xhYmVsfVx1RkYxQSR7cmF3X2NvdW50fSBcdTdCNDYgXHUyMTkyICR7aXRlbXMubGVuZ3RofSBcdTk4MDVgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWtkb3duLnB1c2goYCR7bGFiZWx9XHVGRjFBJHtpdGVtcy5sZW5ndGh9IFx1N0I0NmApO1xuICAgIH1cbiAgICAvLyBTYXZlIGJvZHkgc2FtcGxlIGZvciBmaXJzdCBlbmRwb2ludCB3aXRoIHJhdz4wIGJ1dCBhZGFwdGVkPTAgKGFkYXB0ZXJcbiAgICAvLyBtaXNtYXRjaCkgc28gd2UgY2FuIGl0ZXJhdGUuIFN0b3JlZCB1bmRlciBjaHJvbWUuc3RvcmFnZS5sb2NhbCBmb3JcbiAgICAvLyBpbnNwZWN0aW9uIHZpYSBzZXJ2aWNlIHdvcmtlciBEZXZUb29scy5cbiAgICBpZiAocmF3X2NvdW50ID4gMCAmJiBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgW2BfX3NhbXBsZUJvZHlfJHtlcC5uYW1lfWBdOiBzLnZhbHVlLmJvZHlTYW1wbGUgfHwgXCJuL2FcIixcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIChieVR5cGVbZXAucGFnZV90eXBlXSA9IGJ5VHlwZVtlcC5wYWdlX3R5cGVdIHx8IFtdKS5wdXNoKC4uLml0ZW1zKTtcbiAgfVxuXG4gIC8vIE1hc2sgZ2F0ZSBpcyByZWFkIGZyZXNoIHBlciBzeW5jIFx1MjAxNCBkZWZhdWx0cyBPRkYgcGVyIHRoZSBkaXNjdXNzaW9uXG4gIC8vIChjaXRpemVuLXNlbGYtZG93bmxvYWQgZG9lc24ndCBuZWVkIGFub255bWl6YXRpb24pLiBXaGVuIE9OLCBhbHNvXG4gIC8vIHNjcnViIHRoZSB1c2VyJ3MgcmVhbCBuYW1lIG91dCBvZiBhbnkgTkhJIG5hcnJhdGl2ZSBmaWVsZCBiZWZvcmVcbiAgLy8gaXQgZmxvd3MgaW50byB0aGUgbWFwcGVyLlxuICBjb25zdCBtYXNrRW5hYmxlZCA9IGF3YWl0IF9pc01hc2tFbmFibGVkKCk7XG4gIGlmIChtYXNrRW5hYmxlZCAmJiBwYXRpZW50T3ZlcnJpZGUubmFtZSkge1xuICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGJ5VHlwZSkpIHtcbiAgICAgIGJ5VHlwZVtrZXldID0gX3JlcGxhY2VOYW1lRGVlcChieVR5cGVba2V5XSwgcGF0aWVudE92ZXJyaWRlLm5hbWUsIHJlcGxhY2VtZW50KTtcbiAgICB9XG4gIH1cblxuICBsZXQgdG90YWwgPSAwO1xuICBsZXQgX2xvY2FsRmlsZW5hbWUgPSBudWxsO1xuICBpZiAobW9kZSA9PT0gXCJsb2NhbFwiKSB7XG4gICAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xuICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBcIlx1RDgzRVx1RERFQyBcdThGNDlcdTYzREJcdTcwQkFcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdTZBOTRcdTIwMjZcIiwgdG90YWxSZXNvdXJjZXM6IDAgfSk7XG4gICAgbGV0IGJ1bmRsZTtcbiAgICB0cnkge1xuICAgICAgYnVuZGxlID0gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvcnMucHVzaChgbG9jYWwgbWFwcGluZzogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICBidW5kbGUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoYnVuZGxlKSB7XG4gICAgICB0b3RhbCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogYFx1RDgzRFx1RENCRSBcdTZFOTZcdTUwOTkgJHt0b3RhbH0gXHU3QjQ2IEZISVIgXHU4Q0M3XHU2RTkwXHUyMDI2YCwgdG90YWxSZXNvdXJjZXM6IHRvdGFsIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGwgPSBhd2FpdCBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudE92ZXJyaWRlLmlkX25vLCBkYXRlUmFuZ2UpO1xuICAgICAgICBfbG9jYWxGaWxlbmFtZSA9IGRsLmZpbGVuYW1lO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgc3Rhc2ggYnVuZGxlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gQnVpbGQgdGhlIG92ZXJyaWRlIHdlIHNlbmQgdG8gYmFja2VuZCB3aXRoIHRoZSBtYXliZS1tYXNrZWQgbmFtZVxuICAgIC8vIHNvIGJhY2tlbmQncyBhdXRvLWNyZWF0ZWQgUGF0aWVudCArIHRoZSBwZXItaXRlbSBzdWJqZWN0LmRpc3BsYXlcbiAgICAvLyBzZWUgdGhlIHNhbWUgdmFsdWUgdGhlIHVzZXIgb3B0ZWQgaW50by4gSXRlbXMgdGhlbXNlbHZlcyB3ZXJlXG4gICAgLy8gYWxyZWFkeSBzY3J1YmJlZCBhYm92ZSAoYnlUeXBlIHBhc3MpLCBzbyB0aGlzIGp1c3QgY292ZXJzIHRoZVxuICAgIC8vIG92ZXJyaWRlLWRlcml2ZWQgUGF0aWVudC5cbiAgICBjb25zdCB1cGxvYWRPdmVycmlkZSA9IG1hc2tFbmFibGVkICYmIHBhdGllbnRPdmVycmlkZS5uYW1lXG4gICAgICA/IHsgLi4ucGF0aWVudE92ZXJyaWRlLCBuYW1lOiBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSkgfVxuICAgICAgOiBwYXRpZW50T3ZlcnJpZGU7XG4gICAgZm9yIChjb25zdCBbcGFnZV90eXBlLCBpdGVtc10gb2YgT2JqZWN0LmVudHJpZXMoYnlUeXBlKSkge1xuICAgICAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdTJCMDZcdUZFMEYgXHU0RTBBXHU1MEIzICR7cGFnZV90eXBlfVx1RkYwOCR7aXRlbXMubGVuZ3RofSBcdTdCNDZcdUZGMDlcdTIwMjZgLFxuICAgICAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgdXBsb2FkT3ZlcnJpZGUpO1xuICAgICAgICB0b3RhbCArPSBkYXRhLmNvdW50IHx8IDA7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGB1cGxvYWQgJHtwYWdlX3R5cGV9OiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZnRlciBiYWNrZW5kIHVwbG9hZCwgYWxzbyBmZXRjaCBhIHNuYXBzaG90IG9mIHRoZSBwYXRpZW50J3MgZnVsbFxuICAgIC8vIGN1bXVsYXRpdmUgRkhJUiBCdW5kbGUgYW5kIHN0YXNoIGl0IGZvciB0aGUgcG9wdXAncyBcIlx1RDgzRFx1RENFNSBcdTRFMEJcdThGMDlcIiBidXR0b24uXG4gICAgLy8gVGhpcyBpcyB3aGF0IGAvZmhpci9leHBvcnRgIHJldHVybnMgXHUyMDE0IHRoZSBiYWNrZW5kJ3MgY29tcGxldGUgdmlld1xuICAgIC8vIG9mIHRoaXMgcGF0aWVudCAodGhpcyBzeW5jICsgYW55IHByaW9yIHN5bmNzKSwgYXMgb3Bwb3NlZCB0byBsb2NhbFxuICAgIC8vIG1vZGUncyBcImp1c3QgdGhpcyBzeW5jXCIgYnVuZGxlLlxuICAgIC8vXG4gICAgLy8gU2tpcCBzdGFzaGluZyBlbnRpcmVseSB3aGVuIHRoZSB1cGxvYWQgcGFzcyBwcm9kdWNlZCBubyByZXNvdXJjZXNcbiAgICAvLyBcdTIwMTQgZXhwb3J0aW5nIDAgZW50cmllcyB0aGVuIHN0YXNoaW5nIHRoZW0gY3JlYXRlcyBhIG1pc2xlYWRpbmdcbiAgICAvLyBcIlx1NjcyQ1x1NTczMCBcdTI3MTMgMCBcdTdCNDZcIiBpbmRpY2F0b3IgYW5kIGEgdXNlbGVzcyBcdUQ4M0RcdURDRTQgXHU0RTBBXHU1MEIzIGJ1dHRvbi5cbiAgICBpZiAocGF0aWVudE92ZXJyaWRlLmlkX25vICYmIHRvdGFsID4gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc2V0U3RhdHVzKHsgcHJvZ3Jlc3M6IFwiXHVEODNEXHVEQ0U2IFx1NTNENlx1NUY5N1x1NUY4Q1x1N0FFRlx1NUI4Q1x1NjU3NFx1OENDN1x1NjU5OVx1MjAyNlwiLCB0b3RhbFJlc291cmNlczogdG90YWwgfSk7XG4gICAgICAgIC8vIEJhY2tlbmQgc3RvcmVzIFBhdGllbnQgdW5kZXIgZGVyaXZlUGF0aWVudElkKHJhd0lkKSwgc28gdGhlXG4gICAgICAgIC8vIGV4cG9ydCBmaWx0ZXIgbXVzdCB1c2UgdGhlIGhhc2hlZCBmb3JtIFx1MjAxNCBxdWVyeWluZyB3aXRoIHRoZVxuICAgICAgICAvLyByYXcgbmF0aW9uYWwgSUQgbWF0Y2hlcyB6ZXJvIHJvd3MgZXZlbiB3aGVuIGRhdGEgaXMgdGhlcmUuXG4gICAgICAgIGNvbnN0IGZoaXJQaWQgPSBkZXJpdmVQYXRpZW50SWQocGF0aWVudE92ZXJyaWRlLmlkX25vKTtcbiAgICAgICAgY29uc3QgZXhwVXJsID0gYCR7YmFja2VuZH0vZmhpci9leHBvcnQ/cGF0aWVudD0ke2VuY29kZVVSSUNvbXBvbmVudChmaGlyUGlkKX1gO1xuICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goZXhwVXJsLCB7XG4gICAgICAgICAgaGVhZGVyczogc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyLm9rKSB7XG4gICAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgLy8gUGFzcyB0aGUgc2FtZSBkYXRlUmFuZ2UgdGhlIHVzZXIgcGlja2VkIHRocm91Z2ggc28gdGhlXG4gICAgICAgICAgLy8gZG93bmxvYWRlZCBmaWxlbmFtZSByZWZsZWN0cyBcIlx1NjcwMFx1OEZEMSAzIFx1NUU3NFwiIFx1MjE5MiAyMDIzLTIwMjYgaW5zdGVhZFxuICAgICAgICAgIC8vIG9mIGFsd2F5cyBzeW50aGVzaXppbmcgdG9kYXktMXkgXHUyMTkyIHRvZGF5LlxuICAgICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubywgZGF0ZVJhbmdlKTtcbiAgICAgICAgICBfbG9jYWxGaWxlbmFtZSA9IGRsLmZpbGVuYW1lO1xuICAgICAgICAgIC8vIEFsaWduIHJlcG9ydGVkIGNvdW50IHdpdGggbG9jYWwgbW9kZTogYnVuZGxlLmVudHJ5Lmxlbmd0aFxuICAgICAgICAgIC8vIGluY2x1ZGVzIHRoZSBQYXRpZW50IHJlc291cmNlICh3aGljaCB0aGUgcGVyLXBhZ2UtdHlwZSBQT1NUXG4gICAgICAgICAgLy8gY291bnRzIGhhZCBwcmV2aW91c2x5IG9taXR0ZWQgYmVjYXVzZSBQYXRpZW50IGlzIGF1dG8tY3JlYXRlZFxuICAgICAgICAgIC8vIHNpbGVudGx5IGZyb20gcGF0aWVudF9vdmVycmlkZSkuIFNhbWUgZGF0YSBcdTIxOTIgc2FtZSBudW1iZXIuXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBEZWZlbnNpdmU6IG9ubHkgT1ZFUldSSVRFIHRvdGFsIHdoZW4gZXhwb3J0IGFjdHVhbGx5IHJldHVybmVkXG4gICAgICAgICAgLy8gc29tZXRoaW5nLiBJZiBleHBvcnQgcmV0dXJucyAwIGVudHJpZXMgZGVzcGl0ZSBhIHN1Y2Nlc3NmdWxcbiAgICAgICAgICAvLyB1cGxvYWQgKGNvdWxkIGhhcHBlbiB3aXRoIGEgc3RhbGUtREIgaGFzaCBtaXNtYXRjaCB3ZSBoYXZlbid0XG4gICAgICAgICAgLy8gZml4ZWQgeWV0KSwgZG9uJ3QgY2xvYmJlciB0aGUgdHJ1dGhmdWwgdXBsb2FkIGNvdW50IFx1MjAxNCB0aGF0J3NcbiAgICAgICAgICAvLyBleGFjdGx5IHRoZSBidWcgdGhhdCBtYWRlIFwiXHU1REYyXHU2NkY0XHU2NUIwIDgxIFx1N0I0NlwiIHNpbGVudGx5IGJlY29tZVxuICAgICAgICAgIC8vIFwiXHU1REYyXHU2NkY0XHU2NUIwIDAgXHU3QjQ2XCIuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYnVuZGxlLmVudHJ5KSAmJiBidW5kbGUuZW50cnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdG90YWwgPSBidW5kbGUuZW50cnkubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChgZXhwb3J0IGJ1bmRsZTogSFRUUCAke3Iuc3RhdHVzfWApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBleHBvcnQgYnVuZGxlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShtb2RlID09PSBcImxvY2FsXCIgPyBcImFzc2VtYmxlK3N0YXNoXCIgOiBcImJhY2tlbmQtdXBsb2FkXCIpO1xuXG4gIC8vIEZvcm1hdCBlbGFwc2VkIHdhbGwtY2xvY2sgdGltZTogc2Vjb25kcyAoMSBkcCkgZm9yIHNob3J0IHN5bmNzLFxuICAvLyBcIm1tOnNzXCIgb25jZSB3ZSBjcm9zcyB0aGUgbWludXRlIG1hcmsgc28gdGhlIHBvcHVwIHN0YXR1cyBzdGF5cyByZWFkYWJsZS5cbiAgY29uc3QgX2VsYXBzZWRNcyA9IERhdGUubm93KCkgLSBfdDA7XG4gIGNvbnN0IF9lbGFwc2VkU3RyID0gX2VsYXBzZWRNcyA8IDYwXzAwMFxuICAgID8gYCR7KF9lbGFwc2VkTXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgXG4gICAgOiBgJHtNYXRoLmZsb29yKF9lbGFwc2VkTXMgLyA2MF8wMDApfW0ke01hdGgucm91bmQoKF9lbGFwc2VkTXMgJSA2MF8wMDApIC8gMTAwMCl9c2A7XG4gIC8vIE5vIG1vcmUgXCJcdTZBOTRcdTY4NDhcdTVERjJcdTUwOTlcdTU5QTVcdTIwMjZcIiB0YWlsIFx1MjAxNCB0aGUgXHVEODNEXHVEQ0U1IGRvd25sb2FkIGJ1dHRvbiBzaXRzIHJpZ2h0XG4gIC8vIGJlbG93IHRoZSBzdGF0dXMsIHNvIHNheWluZyBcIlx1OUVERVx1NEUwQlx1NjVCOVx1NjMwOVx1OTIxNVwiIGlzIGp1c3Qgbm9pc2UuXG4gIGNvbnN0IF9sb2NhbFRhaWwgPSBcIlwiO1xuICBjb25zdCBfc3VjY2Vzc1ZlcmIgPSBtb2RlID09PSBcImxvY2FsXCIgPyBcIlx1NURGMlx1NzUyMlx1NzUxRlwiIDogXCJcdTVERjJcdTY2RjRcdTY1QjBcIjtcbiAgLy8gUGhhc2UgdGltaW5ncyAoYG5oaS1wYXJhbGxlbD04c2AsIGBiYWNrZW5kLXVwbG9hZD0wLjhzYCkgYXJlIGRldlxuICAvLyBpbmZvIFx1MjAxNCB1c2VmdWwgd2hlbiBpbnZlc3RpZ2F0aW5nIGEgc2xvdyBzeW5jIGJ1dCBub2lzZSBmb3IgYW4gZW5kXG4gIC8vIHVzZXIuIEtlZXAgdGhlbSwgYnV0IHRhZyB3aXRoIHRoZSBcIlx1MjNGMVwiIHByZWZpeCB0aGUgcG9wdXAgdXNlcyB0b1xuICAvLyB0dWNrIHRoZW0gaW50byBhIGRlZXBlciBcIlx1NjI4MFx1ODg1M1x1N0QzMFx1N0JDMFwiIHN1Yi10b2dnbGUuXG4gIGNvbnN0IF9waGFzZUxpbmVzID0gX3BoYXNlcy5tYXAoKHApID0+IGBcdTIzRjEgJHtwLm5hbWV9PSR7KHAubXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgKTtcbiAgY29uc3QgX2Z1bGxCcmVha2Rvd24gPSBbLi4uYnJlYWtkb3duLCAuLi5fcGhhc2VMaW5lc107XG5cbiAgLy8gUGljayB0aGUgcmlnaHQgc3VtbWFyeSBsaW5lLiBaZXJvLXJlc3VsdCBpcyB0aGUgdHJpY2tpZXN0IGNhc2U6XG4gIC8vIHdlIGRvbid0IHdhbnQgYSBncmVlbiBcdTI3MDUgc2F5aW5nIFwiMCBcdTdCNDZcIiBiZWNhdXNlIHRoYXQgcmVhZHMgYXNcbiAgLy8gXCJzdWNjZWVkZWQgd2l0aCB6ZXJvIGRhdGFcIi4gVGhhdCdzIGFsbW9zdCBhbHdheXMgb25lIG9mOlxuICAvLyAgIC0gTkhJIHNlc3Npb24gZXhwaXJlZCBiZXR3ZWVuIHRoZSBsb2dpbiBwcm9iZSBhbmQgdGhlIHN5bmNcbiAgLy8gICAgICh0aGUgSUhLRTM0MTAgcHJvYmUgY2FuIHN0aWxsIHN1Y2NlZWQgd2hpbGUgZGF0YSBlbmRwb2ludHNcbiAgLy8gICAgIHJlc3BvbmQgd2l0aCBlbXB0eSBhcnJheXMpO1xuICAvLyAgIC0gdGhlIHVzZXIgdHJ1bHkgaGFzIG5vIHJlY29yZHMgaW4gdGhlIHNlbGVjdGVkIGRhdGUgcmFuZ2UuXG4gIC8vIEVpdGhlciB3YXkgdGhlIGFjdGlvbmFibGUgbmV4dCBzdGVwIGlzIFwiXHU5MUNEXHU2NUIwXHU3NjdCXHU1MTY1IE5ISSBcdTUxOERcdThBNjZcdTRFMDBcdTZCMjFcIi5cbiAgbGV0IF9zdW1tYXJ5TGluZTtcbiAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICBfc3VtbWFyeUxpbmUgPSBgXHUyNkEwXHVGRTBGIFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgJHtfc3VjY2Vzc1ZlcmJ9ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1RkYwQyR7ZXJyb3JzLmxlbmd0aH0gXHU5ODA1XHU1OTMxXHU2NTU3XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDkke19sb2NhbFRhaWx9YDtcbiAgfSBlbHNlIGlmICh0b3RhbCA9PT0gMCkge1xuICAgIF9zdW1tYXJ5TGluZSA9XG4gICAgICBgXHUyNkEwXHVGRTBGIFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMFx1NEY0Nlx1NkM5Mlx1NjI5M1x1NTIzMFx1NEVGQlx1NEY1NVx1OENDN1x1NjU5OVx1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5XHUyMDE0IGAgK1xuICAgICAgYFx1NTA2NVx1NEZERFx1NUI1OFx1NjQ3QSBzZXNzaW9uIFx1NTNFRlx1ODBGRFx1OTA0RVx1NjcxRlx1RkYwQ1x1OEFDQlx1NTZERVx1OEE3Mlx1NTIwNlx1OTgwMVx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1RkYxQlx1NjIxNlx1NjJDOVx1OTU3N1x1MzAwQ1x1NjVFNVx1NjcxRlx1N0JDNFx1NTcwRFx1MzAwRFx1NTE4RFx1OEE2Nlx1MzAwMmA7XG4gIH0gZWxzZSB7XG4gICAgX3N1bW1hcnlMaW5lID0gYFx1MjcwNSBcdTUzRDZcdTVGOTdcdTVCOENcdTYyMTAgXHUwMEI3ICR7X3N1Y2Nlc3NWZXJifSAke3RvdGFsfSBcdTdCNDZcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdUZGMDgke19lbGFwc2VkU3RyfVx1RkYwOSR7X2xvY2FsVGFpbH1gO1xuICB9XG5cbiAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICBydW5uaW5nOiBmYWxzZSxcbiAgICBwcm9ncmVzczogX3N1bW1hcnlMaW5lLFxuICAgIHBoYXNlOiBcImRvbmVcIixcbiAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgIGVsYXBzZWRNczogX2VsYXBzZWRNcyxcbiAgICAvLyBQZXItZW5kcG9pbnQgYnJlYWtkb3duIGZvciB0aGUgcG9wdXAncyAnXHU2N0U1XHU3NzBCXHU2NjBFXHU3RDMwJyBjb2xsYXBzaWJsZS5cbiAgICAvLyBLZWVwIGFzIGEgcGxhaW4gYXJyYXkgc28gcG9wdXAuanMgY2FuIHJlbmRlciB3aXRoIERPTSBBUEkgKG5vXG4gICAgLy8gaW5uZXJIVE1MIC8gbm8gZXNjYXBpbmcgY29uY2VybnMpLiBJdGVtcyBsb29rIGxpa2VcbiAgICAvLyAnZW5jb3VudGVycz0xMi8xMicgb3IgJ2FkdWx0X3ByZXZlbnRpdmU9MiByb3dzIFx1MjE5MiAzNiBvYnMnLlxuICAgIGJyZWFrZG93bjogX2Z1bGxCcmVha2Rvd24sXG4gICAgZXJyb3JzLFxuICAgIGhpc3RubzogcGF0aWVudE92ZXJyaWRlLmlkX25vLFxuICAgIG1vZGUsXG4gICAgbG9jYWxGaWxlbmFtZTogX2xvY2FsRmlsZW5hbWUsXG4gIH0pO1xuXG4gIC8vIEJlc3QtZWZmb3J0OiB3cml0ZSBhIFN5bmMgSGlzdG9yeSByb3cgdG8gdGhlIGJhY2tlbmQgc28gdGhlIGRhc2hib2FyZFxuICAvLyBjYW4gc2hvdyB3aGVuL3doby9ob3ctbG9uZy93aGF0L3JhbmdlLiBTa2lwcGVkIGluIGxvY2FsIG1vZGUgKHRoZXJlXG4gIC8vIGlzIG5vIGJhY2tlbmQpLiBXcmFwcGVkICsgc3dhbGxvd2VkIHNvIGEgbG9nZ2luZyBmYWlsdXJlIG5ldmVyXG4gIC8vIHByb3BhZ2F0ZXMgYmFjayB0byB0aGUgdXNlci1mYWNpbmcgc3luYyBzdGF0dXMuXG4gIGlmIChtb2RlICE9PSBcImxvY2FsXCIpIHRyeSB7XG4gICAgYXdhaXQgZmV0Y2goYCR7YmFja2VuZH0vc3luYy9sb2dgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgLi4uKHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30pLFxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc3RhdHVzOiBlcnJvcnMubGVuZ3RoID8gXCJwYXJ0aWFsXCIgOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgcGF0aWVudF9pZDogcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCIsXG4gICAgICAgIC8vIC9zeW5jL2xvZyBsYW5kcyBpbiB0aGUgZGFzaGJvYXJkJ3Mgc3luYy1oaXN0b3J5IHJvdy4gT25seVxuICAgICAgICAvLyBtYXNrIHdoZW4gdGhlIHVzZXIgaGFzIG9wdGVkIGluIFx1MjAxNCBvdGhlcndpc2UgZGFzaGJvYXJkIHNlZXNcbiAgICAgICAgLy8gdGhlIHJhdyBuYW1lIHRoZXkgdHlwZWQgKGNvbnNpc3RlbnQgd2l0aCBcIlx1NkMxMVx1NzczRVx1ODFFQVx1NzUyOFwiIGRlZmF1bHQpLlxuICAgICAgICBwYXRpZW50X25hbWU6IG1hc2tFbmFibGVkXG4gICAgICAgICAgPyBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSB8fCBcIlwiKVxuICAgICAgICAgIDogcGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIixcbiAgICAgICAgdG90YWwsXG4gICAgICAgIGJyZWFrZG93bixcbiAgICAgICAgZGF0ZV9yYW5nZTogZGF0ZVJhbmdlTGFiZWwgfHwgXCJcIixcbiAgICAgICAgZWxhcHNlZF9tczogX2VsYXBzZWRNcyxcbiAgICAgICAgc3RhcnRlZF9hdDogbmV3IERhdGUoX3QwKS50b0lTT1N0cmluZygpLFxuICAgICAgICBlcnJvcnMsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltOSEkgc3luY10gZmFpbGVkIHRvIHdyaXRlIGhpc3RvcnkgbG9nOlwiLCBlKTtcbiAgfVxuICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG59XG5cbi8vIE9uZS10aW1lIG1pZ3JhdGlvbiBmcm9tIGNocm9tZS5zdG9yYWdlLnN5bmMgXHUyMTkyIGNocm9tZS5zdG9yYWdlLmxvY2FsLlxuLy8gUHJldmlvdXMgdmVyc2lvbnMgc3RvcmVkIHN5bmNBcGlLZXkgKyBwYXRpZW50T3ZlcnJpZGUgKGNvbnRhaW5pbmcgdGhlXG4vLyBuYXRpb25hbCBJRCkgdW5kZXIgLnN5bmMsIHdoaWNoIENocm9tZSByZXBsaWNhdGVzIHRvIHRoZSB1c2VyJ3MgR29vZ2xlXG4vLyBhY2NvdW50IGFuZCBwdXNoZXMgdG8gZXZlcnkgZGV2aWNlIHRoZXkgc2lnbiBpbnRvLiBNb3ZlIGV2ZXJ5dGhpbmdcbi8vIHNldHRpbmdzLXJlbGF0ZWQgdG8gLmxvY2FsOyBjbGVhciB0aGUgc3luYyBjb3B5LlxuY29uc3QgU1lOQ19LRVlTX1RPX01JR1JBVEUgPSBbXG4gIFwiYmFja2VuZFVybFwiLFxuICBcInN5bmNBcGlLZXlcIixcbiAgXCJzbWFydEFwcExhdW5jaFVybFwiLFxuICBcInBhdGllbnRPdmVycmlkZVwiLFxuICBcInN5bmNNb2RlXCIsXG4gIFwibWFza05hbWVFbmFibGVkXCIsXG5dO1xuXG5hc3luYyBmdW5jdGlvbiBtaWdyYXRlU3luY1RvTG9jYWwoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3luY2VkID0gYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU1lOQ19LRVlTX1RPX01JR1JBVEUpO1xuICAgIGNvbnN0IHByZXNlbnQgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhzeW5jZWQpLmZpbHRlcigoWywgdl0pID0+IHYgIT09IHVuZGVmaW5lZCksXG4gICAgKTtcbiAgICBpZiAoT2JqZWN0LmtleXMocHJlc2VudCkubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgbG9jYWwgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoT2JqZWN0LmtleXMocHJlc2VudCkpO1xuICAgIC8vIERvbid0IG92ZXJ3cml0ZSBhbnl0aGluZyB0aGUgdXNlciBhbHJlYWR5IHNldCBvbiB0aGlzIG1hY2hpbmUuXG4gICAgY29uc3QgdG9Xcml0ZSA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgIE9iamVjdC5lbnRyaWVzKHByZXNlbnQpLmZpbHRlcigoW2tdKSA9PiBsb2NhbFtrXSA9PT0gdW5kZWZpbmVkKSxcbiAgICApO1xuICAgIGlmIChPYmplY3Qua2V5cyh0b1dyaXRlKS5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQodG9Xcml0ZSk7XG4gICAgfVxuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMucmVtb3ZlKE9iamVjdC5rZXlzKHByZXNlbnQpKTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gTWlncmF0aW9uIGlzIGJlc3QtZWZmb3J0LiBUaGUgbmV4dCBydW4gZ2V0cyB0byB0cnkgYWdhaW4uXG4gIH1cbn1cblxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoYXN5bmMgKCkgPT4ge1xuICBhd2FpdCBtaWdyYXRlU3luY1RvTG9jYWwoKTtcbn0pO1xuXG4vLyBBbHNvIHJ1biBtaWdyYXRpb24gb24gc2VydmljZS13b3JrZXIgd2FrZS11cCAoY292ZXJzIHJlbG9hZC9yZXN0YXJ0XG4vLyBwYXRocyB3aGVyZSBvbkluc3RhbGxlZCBkb2Vzbid0IGZpcmUpLlxuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwPy5hZGRMaXN0ZW5lcj8uKCgpID0+IHtcbiAgbWlncmF0ZVN5bmNUb0xvY2FsKCk7XG59KTtcbm1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZywgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdGFydE5oaUFwaVN5bmNcIikge1xuICAgIHJ1bk5oaUFwaVN5bmMobXNnLnBheWxvYWQpLnRoZW4oXG4gICAgICAoKSA9PiB7IHRyeSB7IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pOyB9IGNhdGNoIHt9IH0sXG4gICAgICBhc3luYyAoZSkgPT4ge1xuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gQ0FOQ0VMX0VSUk9SKSB7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUsIGNhbmNlbGxlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gU0VTU0lPTl9FWFBJUkVEX0VSUk9SKSB7XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REQxMiBOSEkgc2Vzc2lvbiBcdTVERjJcdTc2N0JcdTUxRkEgXHUyMDE0IFx1OEFDQlx1NTcyOCBOSEkgdGFiIFx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1NUY4Q1x1NTE4RFx1OUVERSBTeW5jXCIsXG4gICAgICAgICAgICAgIHBoYXNlOiBcInNlc3Npb25fZXhwaXJlZFwiLFxuICAgICAgICAgICAgICB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGV4cGlyZWQ6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5lcnJvcihcInJ1bk5oaUFwaVN5bmMgZmFpbGVkXCIsIGUpO1xuICAgICAgICBhd2FpdCBzZXRTdGF0dXMoeyBydW5uaW5nOiBmYWxzZSwgcHJvZ3Jlc3M6IGBcdTI3NEMgJHtlLm1lc3NhZ2V9YCwgcGhhc2U6IFwiZXJyb3JcIiB9KTtcbiAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBlcnJvcjogZS5tZXNzYWdlIH0pOyB9IGNhdGNoIHt9XG4gICAgICB9LFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdG9wU3luY1wiKSB7XG4gICAgLy8gU2V0IHRoZSBjYW5jZWxsYXRpb24gZmxhZzsgdGhlIGluLWZsaWdodCBzeW5jIHdpbGwgdGhyb3dcbiAgICAvLyBDQU5DRUxfRVJST1IgYXQgaXRzIG5leHQgY2hlY2tDYW5jZWwoKSBjYWxsLiAgU3RvcmFnZSBpcyBhbHJlYWR5XG4gICAgLy8gdXBkYXRlZCBieSB0aGUgcG9wdXAsIHNvIHdlIGRvbid0IHRvdWNoIGl0IGhlcmUuXG4gICAgX2NhbmNlbGxlZCA9IHRydWU7XG4gICAgLy8gRGlzY2FyZCBhbnkgcGFydGlhbCBkYXRhIHVwbG9hZGVkIHNvIGZhci4gVGhlIHVzZXIncyBzdGF0ZWRcbiAgICAvLyBjb250cmFjdCBpcyAnc3RvcCA9IGFib3J0LCBJJ2xsIHJlc3luYyBmcm9tIHNjcmF0Y2ggbGF0ZXInIFx1MjAxNCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gbGVhdmUgYSBoYWxmLWxvYWRlZCBwYXRpZW50IGluIHRoZSBGSElSIHN0b3JlIHRoYXRcbiAgICAvLyBsb29rcyBjb21wbGV0ZSB0byBkb3duc3RyZWFtIFNNQVJUIGFwcHMuXG4gICAgY29uc3QgY3R4ID0gX2FjdGl2ZVN5bmNDdHg7XG4gICAgaWYgKGN0eD8ucGF0aWVudElkICYmIGN0eC5iYWNrZW5kKSB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIEJhY2tlbmQgc3RvcmVzIFBhdGllbnQgdW5kZXIgZGVyaXZlUGF0aWVudElkKHJhd0lkKSwgc28gdGhlXG4gICAgICAgICAgLy8gREVMRVRFIHBhdGggbXVzdCB1c2UgdGhlIGhhc2hlZCBmb3JtIFx1MjAxNCBzZW5kaW5nIHRoZSByYXcgSURcbiAgICAgICAgICAvLyBtYXRjaGVzIG5vdGhpbmcgYW5kIGxlYXZlcyB0aGUgcGFydGlhbCB1cGxvYWQgaW4gdGhlIHN0b3JlLlxuICAgICAgICAgIGNvbnN0IGZoaXJQaWQgPSBkZXJpdmVQYXRpZW50SWQoY3R4LnBhdGllbnRJZCk7XG4gICAgICAgICAgYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICBgJHtjdHguYmFja2VuZH0vc3luYy9wYXRpZW50LyR7ZW5jb2RlVVJJQ29tcG9uZW50KGZoaXJQaWQpfWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgaGVhZGVyczogY3R4LnN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogY3R4LnN5bmNBcGlLZXkgfSA6IHt9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIFN1cmZhY2UgdGhlIHdpcGUgaW4gdGhlIHN0YXR1cyBzbyB1c2VyIHNlZXMgaXQgYWN0dWFsbHkgaGFwcGVuZWQuXG4gICAgICAgICAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIFtTVE9SQUdFX0tFWV06IHtcbiAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1MjZENCBcdTVERjJcdTUwNUNcdTZCNjJcdTRFMjZcdTZFMDVcdTk2NjRcdTkwRThcdTUyMDZcdThDQzdcdTY1OTkgXHUyMDE0IFx1OEFDQlx1OTFDRFx1NjVCMFx1NTNENlx1NUY5N1wiLFxuICAgICAgICAgICAgICBwaGFzZTogXCJjYW5jZWxsZWRcIixcbiAgICAgICAgICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICAgICAgICAgIGNvbXBsZXRlZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIGNhbmNlbCB3aXBlIGZhaWxlZDpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfVxuICAgIF9hY3RpdmVTeW5jQ3R4ID0gbnVsbDtcbiAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChtc2c/LnR5cGUgPT09IFwiZ2V0U3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKS50aGVuKChkYXRhKSA9PiBzZW5kUmVzcG9uc2UoZGF0YVtTVE9SQUdFX0tFWV0gfHwgbnVsbCkpO1xuICAgIHJldHVybiB0cnVlOyAgLy8gYXN5bmMgcmVzcG9uc2VcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImNsZWFyU3luY1N0YXR1c1wiKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFNUT1JBR0VfS0VZKS50aGVuKCgpID0+IHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlIH0pKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImNoZWNrTmhpTG9naW5cIikge1xuICAgIF9jaGVja05oaUxvZ2luU3RhdGUobXNnLnRhYklkKS50aGVuKFxuICAgICAgKHN0YXRlKSA9PiB7IHRyeSB7IHNlbmRSZXNwb25zZSh7IGxvZ2dlZEluOiBzdGF0ZSB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICAgKCkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBsb2dnZWRJbjogbnVsbCB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuXG4vLyBCZWx0LWFuZC1zdXNwZW5kZXJzIFNXIGtlZXBhbGl2ZTogYW4gYWxhcm0gZXZlcnkgMjAgcyB3YWtlcyB0aGUgU1cgaWZcbi8vIGlkbGUuIENvbWJpbmVkIHdpdGggdGhlIHJldHVybi10cnVlIHBhdHRlcm4gYWJvdmUsIHRoaXMgcHJldmVudHMgdGhlXG4vLyAzMCBzIGlkbGUgc2h1dGRvd24gZnJvbSBlbmRpbmcgYW4gaW4tcHJvZ3Jlc3Mgc3luYy5cbmNocm9tZS5hbGFybXMuY3JlYXRlKFwic3cta2VlcGFsaXZlXCIsIHsgcGVyaW9kSW5NaW51dGVzOiAwLjM0IH0pO1xuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKCgpID0+IHsgLyogbm8tb3A7IHByZXNlbmNlIGlzIHRoZSBwb2ludCAqLyB9KTtcbiJdLAog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LFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxV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VUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTVYsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1WLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1Ys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QTtBQUFBO0FBQUE7QUFBQSxJQVdYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFFVixTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQ0U7QUFBQSxJQUNGLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxXQUFXO0FBQUE7QUFBQSxJQUVYLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFB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QVMsaUJBQWlCO0FBQ2pDLGFBQU8sUUFBUSxNQUFNLElBQUksV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUFTLGFBQWEsS0FBSyxXQUFXLEtBQUssSUFBSSxDQUFDO0FBQzVGLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLFNBQVMsbUJBQW1CO0FBQ25DLGFBQU8sUUFBUSxNQUFNLE9BQU8sV0FBVyxFQUFFLEtBQUssTUFBTSxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQztBQUM5RSxhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksS0FBSyxTQUFTLGlCQUFpQjtBQUNqQywwQkFBb0IsSUFBSSxLQUFLLEVBQUU7QUFBQSxRQUM3QixDQUFDLFVBQVU7QUFBRSxjQUFJO0FBQUUseUJBQWEsRUFBRSxVQUFVLE1BQU0sQ0FBQztBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUFFO0FBQUEsUUFDakUsTUFBTTtBQUFFLGNBQUk7QUFBRSx5QkFBYSxFQUFFLFVBQVUsS0FBSyxDQUFDO0FBQUEsVUFBRyxRQUFRO0FBQUEsVUFBQztBQUFBLFFBQUU7QUFBQSxNQUM3RDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBS0QsU0FBTyxPQUFPLE9BQU8sZ0JBQWdCLEVBQUUsaUJBQWlCLEtBQUssQ0FBQztBQUM5RCxTQUFPLE9BQU8sUUFBUSxZQUFZLE1BQU07QUFBQSxFQUFxQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJCdWZmZXIiLCAiYmxvY2tzIiwgImV4cG9ydHMiLCAibWFwU3lzdGVtIiwgImVzY2FwZVJlZ2V4IiwgImhpdCIsICJjamtDaGFycyIsICJvYnNJZCIsICJtYXBTeXN0ZW0iLCAiciJdCn0K
