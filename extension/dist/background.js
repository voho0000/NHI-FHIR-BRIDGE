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
          var crypto2 = require_crypto();
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
              return crypto2.createHash("sha1").update(message, "utf8").digest("hex");
            } else {
              if (message === null || message === void 0) {
                throw new Error(INPUT_ERROR);
              } else if (message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
              }
            }
            if (isArray(message) || isView(message) || message.constructor === Buffer2) {
              return crypto2.createHash("sha1").update(bufferFrom(message)).digest("hex");
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
  var _salt = "";
  function setStableIdSalt(salt) {
    _salt = salt ?? "";
  }
  function stableId(patientId, ...parts) {
    const key = [_salt, patientId, ...parts].join("|");
    return (0, import_js_sha1.sha1)(key).slice(0, 32);
  }
  function derivePatientId(nationalId) {
    return (0, import_js_sha1.sha1)([_salt, "patient", nationalId].join("|")).slice(0, 32);
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
  var STABLE_ID_SALT_KEY = "stableIdSalt";
  async function _ensureStableIdSalt() {
    const stored = await chrome.storage.local.get(STABLE_ID_SALT_KEY);
    let salt = stored[STABLE_ID_SALT_KEY];
    if (!salt) {
      const buf = new Uint8Array(32);
      crypto.getRandomValues(buf);
      salt = Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
      await chrome.storage.local.set({ [STABLE_ID_SALT_KEY]: salt });
    }
    setStableIdSalt(salt);
  }
  _ensureStableIdSalt();
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
    await chrome.storage.local.set({ syncRunning: true }).catch(() => {
    });
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
      if (s.status === "rejected") {
        errors.push(`${ep.name}: ${s.reason.message}`);
        breakdown.push(`${ep.name}=ERR`);
        continue;
      }
      const { items, raw_count } = s.value;
      raw_total += raw_count;
      adapted_total += items.length;
      let label;
      if (items.length > raw_count && raw_count > 0) {
        label = `${ep.name}=${raw_count} rows \u2192 ${items.length} obs`;
      } else {
        label = `${ep.name}=${items.length}/${raw_count}`;
      }
      breakdown.push(label);
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
      if (patientOverride.id_no) {
        try {
          await setStatus({ progress: "\u{1F4E6} \u53D6\u5F97\u5F8C\u7AEF\u5B8C\u6574\u8CC7\u6599\u2026", totalResources: total });
          const expUrl = `${backend}/fhir/export?patient=${encodeURIComponent(patientOverride.id_no)}`;
          const r = await fetch(expUrl, {
            headers: syncApiKey ? { "X-Sync-API-Key": syncApiKey } : {}
          });
          if (r.ok) {
            const bundle = await r.json();
            const dl = await _stashFhirBundle(bundle, patientOverride.id_no);
            _localFilename = dl.filename;
            if (Array.isArray(bundle.entry)) total = bundle.entry.length;
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
    const _fullBreakdown = [..._phaseLines, ...breakdown];
    await setStatus({
      running: false,
      progress: errors.length ? `\u26A0\uFE0F \u53D6\u5F97\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF0C${errors.length} \u9805\u5931\u6557\uFF08${_elapsedStr}\uFF09${_localTail}` : `\u2705 \u53D6\u5F97\u5B8C\u6210 \xB7 ${_successVerb} ${total} \u7B46\u5065\u5EB7\u7D00\u9304\uFF08${_elapsedStr}\uFF09${_localTail}`,
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
    chrome.storage.local.set({ syncRunning: false }).catch(() => {
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
    "sidebarEnabled",
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
    let tabs;
    try {
      tabs = await chrome.tabs.query({ url: "https://myhealthbank.nhi.gov.tw/*" });
    } catch {
      return;
    }
    for (const tab of tabs) {
      chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["sidebar.js"] }).catch(() => {
      });
    }
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
          chrome.storage.local.set({ syncRunning: false }).catch(() => {
          });
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2pzLXNoYTEvc3JjL3NoYTEuanMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9zeXN0ZW1zLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvaGVscGVycy50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2FsbGVyZ3kudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9jb25kaXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaWFnbm9zdGljLXJlcG9ydC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2VuY291bnRlci50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL21lZGljYXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9sb2luYy10YWJsZXMudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXJzZXJzLnRzIiwgIi4uLy4uL3BhY2thZ2VzL21hcHBlci9zcmMvb2JzZXJ2YXRpb24udHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wcm9jZWR1cmUudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9kaXNwYXRjaC50cyIsICIuLi8uLi9wYWNrYWdlcy9tYXBwZXIvc3JjL2xpbmsudHMiLCAiLi4vLi4vcGFja2FnZXMvbWFwcGVyL3NyYy9wYXRpZW50LnRzIiwgIi4uL3NyYy9iYWNrZ3JvdW5kLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKlxuICogW2pzLXNoYTFde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtc2hhMX1cbiAqXG4gKiBAdmVyc2lvbiAwLjcuMFxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDI0XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuLypqc2xpbnQgYml0d2lzZTogdHJ1ZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIElOUFVUX0VSUk9SID0gJ2lucHV0IGlzIGludmFsaWQgdHlwZSc7XG4gIHZhciBGSU5BTElaRV9FUlJPUiA9ICdmaW5hbGl6ZSBhbHJlYWR5IGNhbGxlZCc7XG4gIHZhciBXSU5ET1cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JztcbiAgdmFyIHJvb3QgPSBXSU5ET1cgPyB3aW5kb3cgOiB7fTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19XSU5ET1cpIHtcbiAgICBXSU5ET1cgPSBmYWxzZTtcbiAgfVxuICB2YXIgV0VCX1dPUktFUiA9ICFXSU5ET1cgJiYgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnO1xuICB2YXIgTk9ERV9KUyA9ICFyb290LkpTX1NIQTFfTk9fTk9ERV9KUyAmJiB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gIGlmIChOT0RFX0pTKSB7XG4gICAgcm9vdCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChXRUJfV09SS0VSKSB7XG4gICAgcm9vdCA9IHNlbGY7XG4gIH1cbiAgdmFyIENPTU1PTl9KUyA9ICFyb290LkpTX1NIQTFfTk9fQ09NTU9OX0pTICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzO1xuICB2YXIgQU1EID0gdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kO1xuICB2YXIgQVJSQVlfQlVGRkVSID0gIXJvb3QuSlNfU0hBMV9OT19BUlJBWV9CVUZGRVIgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJztcbiAgdmFyIEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG4gIHZhciBFWFRSQSA9IFstMjE0NzQ4MzY0OCwgODM4ODYwOCwgMzI3NjgsIDEyOF07XG4gIHZhciBTSElGVCA9IFsyNCwgMTYsIDgsIDBdO1xuICB2YXIgT1VUUFVUX1RZUEVTID0gWydoZXgnLCAnYXJyYXknLCAnZGlnZXN0JywgJ2FycmF5QnVmZmVyJ107XG5cbiAgdmFyIGJsb2NrcyA9IFtdO1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgaWYgKHJvb3QuSlNfU0hBMV9OT19OT0RFX0pTIHx8ICFpc0FycmF5KSB7XG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuICB9XG5cbiAgdmFyIGlzVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldztcbiAgaWYgKEFSUkFZX0JVRkZFUiAmJiAocm9vdC5KU19TSEExX05PX0FSUkFZX0JVRkZFUl9JU19WSUVXIHx8ICFpc1ZpZXcpKSB7XG4gICAgaXNWaWV3ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5idWZmZXIgJiYgb2JqLmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXI7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFttZXNzYWdlOiBzdHJpbmcsIGlzU3RyaW5nOiBib29sXVxuICB2YXIgZm9ybWF0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbWVzc2FnZTtcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbbWVzc2FnZSwgdHJ1ZV07XG4gICAgfVxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0JyB8fCBtZXNzYWdlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoQVJSQVlfQlVGRkVSICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gW25ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCBmYWxzZV07XG4gICAgfVxuICAgIGlmICghaXNBcnJheShtZXNzYWdlKSAmJiAhaXNWaWV3KG1lc3NhZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gW21lc3NhZ2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBjcmVhdGVPdXRwdXRNZXRob2QgPSBmdW5jdGlvbiAob3V0cHV0VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBTaGExKHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWV0aG9kID0gY3JlYXRlT3V0cHV0TWV0aG9kKCdoZXgnKTtcbiAgICBpZiAoTk9ERV9KUykge1xuICAgICAgbWV0aG9kID0gbm9kZVdyYXAobWV0aG9kKTtcbiAgICB9XG4gICAgbWV0aG9kLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgU2hhMSgpO1xuICAgIH07XG4gICAgbWV0aG9kLnVwZGF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gbWV0aG9kLmNyZWF0ZSgpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT1VUUFVUX1RZUEVTLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdHlwZSA9IE9VVFBVVF9UWVBFU1tpXTtcbiAgICAgIG1ldGhvZFt0eXBlXSA9IGNyZWF0ZU91dHB1dE1ldGhvZCh0eXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICB2YXIgbm9kZVdyYXAgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG4gICAgdmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICB2YXIgYnVmZmVyRnJvbTtcbiAgICBpZiAoQnVmZmVyLmZyb20gJiYgIXJvb3QuSlNfU0hBMV9OT19CVUZGRVJfRlJPTSkge1xuICAgICAgYnVmZmVyRnJvbSA9IEJ1ZmZlci5mcm9tO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXJGcm9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXIobWVzc2FnZSk7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbm9kZU1ldGhvZCA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtZXNzYWdlLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gbnVsbCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5QVVRfRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShtZXNzYWdlKSB8fCBpc1ZpZXcobWVzc2FnZSkgfHxcbiAgICAgICAgbWVzc2FnZS5jb25zdHJ1Y3RvciA9PT0gQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXJGcm9tKG1lc3NhZ2UpKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZChtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBub2RlTWV0aG9kO1xuICB9O1xuXG4gIHZhciBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kID0gZnVuY3Rpb24gKG91dHB1dFR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG5ldyBIbWFjU2hhMShrZXksIHRydWUpLnVwZGF0ZShtZXNzYWdlKVtvdXRwdXRUeXBlXSgpO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUhtYWNNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZCA9IGNyZWF0ZUhtYWNPdXRwdXRNZXRob2QoJ2hleCcpO1xuICAgIG1ldGhvZC5jcmVhdGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IEhtYWNTaGExKGtleSk7XG4gICAgfTtcbiAgICBtZXRob2QudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5jcmVhdGUoa2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9VVFBVVF9UWVBFUy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHR5cGUgPSBPVVRQVVRfVFlQRVNbaV07XG4gICAgICBtZXRob2RbdHlwZV0gPSBjcmVhdGVIbWFjT3V0cHV0TWV0aG9kKHR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFNoYTEoc2hhcmVkTWVtb3J5KSB7XG4gICAgaWYgKHNoYXJlZE1lbW9yeSkge1xuICAgICAgYmxvY2tzWzBdID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICBibG9ja3NbNF0gPSBibG9ja3NbNV0gPSBibG9ja3NbNl0gPSBibG9ja3NbN10gPVxuICAgICAgYmxvY2tzWzhdID0gYmxvY2tzWzldID0gYmxvY2tzWzEwXSA9IGJsb2Nrc1sxMV0gPVxuICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgfVxuXG4gICAgdGhpcy5oMCA9IDB4Njc0NTIzMDE7XG4gICAgdGhpcy5oMSA9IDB4RUZDREFCODk7XG4gICAgdGhpcy5oMiA9IDB4OThCQURDRkU7XG4gICAgdGhpcy5oMyA9IDB4MTAzMjU0NzY7XG4gICAgdGhpcy5oNCA9IDB4QzNEMkUxRjA7XG5cbiAgICB0aGlzLmJsb2NrID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDA7XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3QgPSB0cnVlO1xuICB9XG5cbiAgU2hhMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihGSU5BTElaRV9FUlJPUik7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgbWVzc2FnZSA9IHJlc3VsdFswXTtcbiAgICB2YXIgaXNTdHJpbmcgPSByZXN1bHRbMV07XG4gICAgdmFyIGNvZGUsIGluZGV4ID0gMCwgaSwgbGVuZ3RoID0gbWVzc2FnZS5sZW5ndGggfHwgMCwgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG5cbiAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmhhc2hlZCkge1xuICAgICAgICB0aGlzLmhhc2hlZCA9IGZhbHNlO1xuICAgICAgICBibG9ja3NbMF0gPSB0aGlzLmJsb2NrO1xuICAgICAgICB0aGlzLmJsb2NrID0gYmxvY2tzWzE2XSA9IGJsb2Nrc1sxXSA9IGJsb2Nrc1syXSA9IGJsb2Nrc1szXSA9XG4gICAgICAgIGJsb2Nrc1s0XSA9IGJsb2Nrc1s1XSA9IGJsb2Nrc1s2XSA9IGJsb2Nrc1s3XSA9XG4gICAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgICAgYmxvY2tzWzEyXSA9IGJsb2Nrc1sxM10gPSBibG9ja3NbMTRdID0gYmxvY2tzWzE1XSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmKGlzU3RyaW5nKSB7XG4gICAgICAgIGZvciAoaSA9IHRoaXMuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCA2NDsgKytpbmRleCkge1xuICAgICAgICAgIGNvZGUgPSBtZXNzYWdlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+PiA2KSkgPDwgU0hJRlRbaSsrICYgM107XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+PiAxMikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2RlID0gMHgxMDAwMCArICgoKGNvZGUgJiAweDNmZikgPDwgMTApIHwgKG1lc3NhZ2UuY2hhckNvZGVBdCgrK2luZGV4KSAmIDB4M2ZmKSk7XG4gICAgICAgICAgICBibG9ja3NbaSA+Pj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+Pj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcbiAgICAgICAgICAgIGJsb2Nrc1tpID4+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gdGhpcy5zdGFydDsgaW5kZXggPCBsZW5ndGggJiYgaSA8IDY0OyArK2luZGV4KSB7XG4gICAgICAgICAgYmxvY2tzW2kgPj4+IDJdIHw9IG1lc3NhZ2VbaW5kZXhdIDw8IFNISUZUW2krKyAmIDNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGk7XG4gICAgICB0aGlzLmJ5dGVzICs9IGkgLSB0aGlzLnN0YXJ0O1xuICAgICAgaWYgKGkgPj0gNjQpIHtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2Nrc1sxNl07XG4gICAgICAgIHRoaXMuc3RhcnQgPSBpIC0gNjQ7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgICB0aGlzLmhhc2hlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1KSB7XG4gICAgICB0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwO1xuICAgICAgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHZhciBibG9ja3MgPSB0aGlzLmJsb2NrcywgaSA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICBibG9ja3NbMTZdID0gdGhpcy5ibG9jaztcbiAgICBibG9ja3NbaSA+Pj4gMl0gfD0gRVhUUkFbaSAmIDNdO1xuICAgIHRoaXMuYmxvY2sgPSBibG9ja3NbMTZdO1xuICAgIGlmIChpID49IDU2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzaGVkKSB7XG4gICAgICAgIHRoaXMuaGFzaCgpO1xuICAgICAgfVxuICAgICAgYmxvY2tzWzBdID0gdGhpcy5ibG9jaztcbiAgICAgIGJsb2Nrc1sxNl0gPSBibG9ja3NbMV0gPSBibG9ja3NbMl0gPSBibG9ja3NbM10gPVxuICAgICAgYmxvY2tzWzRdID0gYmxvY2tzWzVdID0gYmxvY2tzWzZdID0gYmxvY2tzWzddID1cbiAgICAgIGJsb2Nrc1s4XSA9IGJsb2Nrc1s5XSA9IGJsb2Nrc1sxMF0gPSBibG9ja3NbMTFdID1cbiAgICAgIGJsb2Nrc1sxMl0gPSBibG9ja3NbMTNdID0gYmxvY2tzWzE0XSA9IGJsb2Nrc1sxNV0gPSAwO1xuICAgIH1cbiAgICBibG9ja3NbMTRdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5O1xuICAgIGJsb2Nrc1sxNV0gPSB0aGlzLmJ5dGVzIDw8IDM7XG4gICAgdGhpcy5oYXNoKCk7XG4gIH07XG5cbiAgU2hhMS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuaDAsIGIgPSB0aGlzLmgxLCBjID0gdGhpcy5oMiwgZCA9IHRoaXMuaDMsIGUgPSB0aGlzLmg0O1xuICAgIHZhciBmLCBqLCB0LCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGZvcihqID0gMTY7IGogPCA4MDsgKytqKSB7XG4gICAgICB0ID0gYmxvY2tzW2ogLSAzXSBeIGJsb2Nrc1tqIC0gOF0gXiBibG9ja3NbaiAtIDE0XSBeIGJsb2Nrc1tqIC0gMTZdO1xuICAgICAgYmxvY2tzW2pdID0gICh0IDw8IDEpIHwgKHQgPj4+IDMxKTtcbiAgICB9XG5cbiAgICBmb3IoaiA9IDA7IGogPCAyMDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE1MTg1MDAyNDkgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYSAmIGIpIHwgKCh+YSkgJiBjKTtcbiAgICAgIHQgPSAoZSA8PCA1KSB8IChlID4+PiAyNyk7XG4gICAgICBkID0gdCArIGYgKyBkICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMV0gPDwgMDtcbiAgICAgIGEgPSAoYSA8PCAzMCkgfCAoYSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZSAmIGEpIHwgKCh+ZSkgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKCh+ZCkgJiBhKTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSAoYyAmIGQpIHwgKCh+YykgJiBlKTtcbiAgICAgIHQgPSAoYiA8PCA1KSB8IChiID4+PiAyNyk7XG4gICAgICBhID0gdCArIGYgKyBhICsgMTUxODUwMDI0OSArIGJsb2Nrc1tqICsgNF0gPDwgMDtcbiAgICAgIGMgPSAoYyA8PCAzMCkgfCAoYyA+Pj4gMik7XG4gICAgfVxuXG4gICAgZm9yKDsgaiA8IDQwOyBqICs9IDUpIHtcbiAgICAgIGYgPSBiIF4gYyBeIGQ7XG4gICAgICB0ID0gKGEgPDwgNSkgfCAoYSA+Pj4gMjcpO1xuICAgICAgZSA9IHQgKyBmICsgZSArIDE4NTk3NzUzOTMgKyBibG9ja3Nbal0gPDwgMDtcbiAgICAgIGIgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cbiAgICAgIGYgPSBhIF4gYiBeIGM7XG4gICAgICB0ID0gKGUgPDwgNSkgfCAoZSA+Pj4gMjcpO1xuICAgICAgZCA9IHQgKyBmICsgZCArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgKyAxODU5Nzc1MzkzICsgYmxvY2tzW2ogKyAyXSA8PCAwO1xuICAgICAgZSA9IChlIDw8IDMwKSB8IChlID4+PiAyKTtcblxuICAgICAgZiA9IGQgXiBlIF4gYTtcbiAgICAgIHQgPSAoYyA8PCA1KSB8IChjID4+PiAyNyk7XG4gICAgICBiID0gdCArIGYgKyBiICsgMTg1OTc3NTM5MyArIGJsb2Nrc1tqICsgM10gPDwgMDtcbiAgICAgIGQgPSAoZCA8PCAzMCkgfCAoZCA+Pj4gMik7XG5cbiAgICAgIGYgPSBjIF4gZCBeIGU7XG4gICAgICB0ID0gKGIgPDwgNSkgfCAoYiA+Pj4gMjcpO1xuICAgICAgYSA9IHQgKyBmICsgYSArIDE4NTk3NzUzOTMgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIGZvcig7IGogPCA2MDsgaiArPSA1KSB7XG4gICAgICBmID0gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgdCA9IChhIDw8IDUpIHwgKGEgPj4+IDI3KTtcbiAgICAgIGUgPSB0ICsgZiArIGUgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gKGEgJiBiKSB8IChhICYgYykgfCAoYiAmIGMpO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyAxXSA8PCAwO1xuICAgICAgYSA9IChhIDw8IDMwKSB8IChhID4+PiAyKTtcblxuICAgICAgZiA9IChlICYgYSkgfCAoZSAmIGIpIHwgKGEgJiBiKTtcbiAgICAgIHQgPSAoZCA8PCA1KSB8IChkID4+PiAyNyk7XG4gICAgICBjID0gdCArIGYgKyBjIC0gMTg5NDAwNzU4OCArIGJsb2Nrc1tqICsgMl0gPDwgMDtcbiAgICAgIGUgPSAoZSA8PCAzMCkgfCAoZSA+Pj4gMik7XG5cbiAgICAgIGYgPSAoZCAmIGUpIHwgKGQgJiBhKSB8IChlICYgYSk7XG4gICAgICB0ID0gKGMgPDwgNSkgfCAoYyA+Pj4gMjcpO1xuICAgICAgYiA9IHQgKyBmICsgYiAtIDE4OTQwMDc1ODggKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gKGMgJiBkKSB8IChjICYgZSkgfCAoZCAmIGUpO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSAxODk0MDA3NTg4ICsgYmxvY2tzW2ogKyA0XSA8PCAwO1xuICAgICAgYyA9IChjIDw8IDMwKSB8IChjID4+PiAyKTtcbiAgICB9XG5cbiAgICBmb3IoOyBqIDwgODA7IGogKz0gNSkge1xuICAgICAgZiA9IGIgXiBjIF4gZDtcbiAgICAgIHQgPSAoYSA8PCA1KSB8IChhID4+PiAyNyk7XG4gICAgICBlID0gdCArIGYgKyBlIC0gODk5NDk3NTE0ICsgYmxvY2tzW2pdIDw8IDA7XG4gICAgICBiID0gKGIgPDwgMzApIHwgKGIgPj4+IDIpO1xuXG4gICAgICBmID0gYSBeIGIgXiBjO1xuICAgICAgdCA9IChlIDw8IDUpIHwgKGUgPj4+IDI3KTtcbiAgICAgIGQgPSB0ICsgZiArIGQgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDFdIDw8IDA7XG4gICAgICBhID0gKGEgPDwgMzApIHwgKGEgPj4+IDIpO1xuXG4gICAgICBmID0gZSBeIGEgXiBiO1xuICAgICAgdCA9IChkIDw8IDUpIHwgKGQgPj4+IDI3KTtcbiAgICAgIGMgPSB0ICsgZiArIGMgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDJdIDw8IDA7XG4gICAgICBlID0gKGUgPDwgMzApIHwgKGUgPj4+IDIpO1xuXG4gICAgICBmID0gZCBeIGUgXiBhO1xuICAgICAgdCA9IChjIDw8IDUpIHwgKGMgPj4+IDI3KTtcbiAgICAgIGIgPSB0ICsgZiArIGIgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDNdIDw8IDA7XG4gICAgICBkID0gKGQgPDwgMzApIHwgKGQgPj4+IDIpO1xuXG4gICAgICBmID0gYyBeIGQgXiBlO1xuICAgICAgdCA9IChiIDw8IDUpIHwgKGIgPj4+IDI3KTtcbiAgICAgIGEgPSB0ICsgZiArIGEgLSA4OTk0OTc1MTQgKyBibG9ja3NbaiArIDRdIDw8IDA7XG4gICAgICBjID0gKGMgPDwgMzApIHwgKGMgPj4+IDIpO1xuICAgIH1cblxuICAgIHRoaXMuaDAgPSB0aGlzLmgwICsgYSA8PCAwO1xuICAgIHRoaXMuaDEgPSB0aGlzLmgxICsgYiA8PCAwO1xuICAgIHRoaXMuaDIgPSB0aGlzLmgyICsgYyA8PCAwO1xuICAgIHRoaXMuaDMgPSB0aGlzLmgzICsgZCA8PCAwO1xuICAgIHRoaXMuaDQgPSB0aGlzLmg0ICsgZSA8PCAwO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG5cbiAgICB2YXIgaDAgPSB0aGlzLmgwLCBoMSA9IHRoaXMuaDEsIGgyID0gdGhpcy5oMiwgaDMgPSB0aGlzLmgzLCBoNCA9IHRoaXMuaDQ7XG5cbiAgICByZXR1cm4gSEVYX0NIQVJTWyhoMCA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgwID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDAgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMCA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDAgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgwID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gwICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgxID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDEgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMSA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgxID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMSA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDEgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDEgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDIgPj4+IDI4KSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMiA+Pj4gMjQpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgyID4+PiAyMCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDIgPj4+IDE2KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gMTIpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgyID4+PiA4KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMiA+Pj4gNCkgJiAweDBGXSArIEhFWF9DSEFSU1toMiAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoMyA+Pj4gMjgpICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGgzID4+PiAyNCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDMgPj4+IDIwKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoMyA+Pj4gMTYpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiAxMikgJiAweDBGXSArIEhFWF9DSEFSU1soaDMgPj4+IDgpICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGgzID4+PiA0KSAmIDB4MEZdICsgSEVYX0NIQVJTW2gzICYgMHgwRl0gK1xuICAgICAgICAgICBIRVhfQ0hBUlNbKGg0ID4+PiAyOCkgJiAweDBGXSArIEhFWF9DSEFSU1soaDQgPj4+IDI0KSAmIDB4MEZdICtcbiAgICAgICAgICAgSEVYX0NIQVJTWyhoNCA+Pj4gMjApICYgMHgwRl0gKyBIRVhfQ0hBUlNbKGg0ID4+PiAxNikgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDEyKSAmIDB4MEZdICsgSEVYX0NIQVJTWyhoNCA+Pj4gOCkgJiAweDBGXSArXG4gICAgICAgICAgIEhFWF9DSEFSU1soaDQgPj4+IDQpICYgMHgwRl0gKyBIRVhfQ0hBUlNbaDQgJiAweDBGXTtcbiAgfTtcblxuICBTaGExLnByb3RvdHlwZS50b1N0cmluZyA9IFNoYTEucHJvdG90eXBlLmhleDtcblxuICBTaGExLnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuXG4gICAgdmFyIGgwID0gdGhpcy5oMCwgaDEgPSB0aGlzLmgxLCBoMiA9IHRoaXMuaDIsIGgzID0gdGhpcy5oMywgaDQgPSB0aGlzLmg0O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIChoMCA+Pj4gMjQpICYgMHhGRiwgKGgwID4+PiAxNikgJiAweEZGLCAoaDAgPj4+IDgpICYgMHhGRiwgaDAgJiAweEZGLFxuICAgICAgKGgxID4+PiAyNCkgJiAweEZGLCAoaDEgPj4+IDE2KSAmIDB4RkYsIChoMSA+Pj4gOCkgJiAweEZGLCBoMSAmIDB4RkYsXG4gICAgICAoaDIgPj4+IDI0KSAmIDB4RkYsIChoMiA+Pj4gMTYpICYgMHhGRiwgKGgyID4+PiA4KSAmIDB4RkYsIGgyICYgMHhGRixcbiAgICAgIChoMyA+Pj4gMjQpICYgMHhGRiwgKGgzID4+PiAxNikgJiAweEZGLCAoaDMgPj4+IDgpICYgMHhGRiwgaDMgJiAweEZGLFxuICAgICAgKGg0ID4+PiAyNCkgJiAweEZGLCAoaDQgPj4+IDE2KSAmIDB4RkYsIChoNCA+Pj4gOCkgJiAweEZGLCBoNCAmIDB4RkZcbiAgICBdO1xuICB9O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5ID0gU2hhMS5wcm90b3R5cGUuZGlnZXN0O1xuXG4gIFNoYTEucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcblxuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigwLCB0aGlzLmgwKTtcbiAgICBkYXRhVmlldy5zZXRVaW50MzIoNCwgdGhpcy5oMSk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDgsIHRoaXMuaDIpO1xuICAgIGRhdGFWaWV3LnNldFVpbnQzMigxMiwgdGhpcy5oMyk7XG4gICAgZGF0YVZpZXcuc2V0VWludDMyKDE2LCB0aGlzLmg0KTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEhtYWNTaGExKGtleSwgc2hhcmVkTWVtb3J5KSB7XG4gICAgdmFyIGksIHJlc3VsdCA9IGZvcm1hdE1lc3NhZ2Uoa2V5KTtcbiAgICBrZXkgPSByZXN1bHRbMF07XG4gICAgaWYgKHJlc3VsdFsxXSkge1xuICAgICAgdmFyIGJ5dGVzID0gW10sIGxlbmd0aCA9IGtleS5sZW5ndGgsIGluZGV4ID0gMCwgY29kZTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb2RlID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlIDwgMHg4MCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGMwIHwgKGNvZGUgPj4+IDYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ZDgwMCB8fCBjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ZTAgfCAoY29kZSA+Pj4gMTIpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKChjb2RlID4+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweDgwIHwgKGNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29kZSA9IDB4MTAwMDAgKyAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHgzZmYpKTtcbiAgICAgICAgICBieXRlc1tpbmRleCsrXSA9ICgweGYwIHwgKGNvZGUgPj4+IDE4KSk7XG4gICAgICAgICAgYnl0ZXNbaW5kZXgrK10gPSAoMHg4MCB8ICgoY29kZSA+Pj4gMTIpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoKGNvZGUgPj4+IDYpICYgMHgzZikpO1xuICAgICAgICAgIGJ5dGVzW2luZGV4KytdID0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAga2V5ID0gYnl0ZXM7XG4gICAgfVxuXG4gICAgaWYgKGtleS5sZW5ndGggPiA2NCkge1xuICAgICAga2V5ID0gKG5ldyBTaGExKHRydWUpKS51cGRhdGUoa2V5KS5hcnJheSgpO1xuICAgIH1cblxuICAgIHZhciBvS2V5UGFkID0gW10sIGlLZXlQYWQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7ICsraSkge1xuICAgICAgdmFyIGIgPSBrZXlbaV0gfHwgMDtcbiAgICAgIG9LZXlQYWRbaV0gPSAweDVjIF4gYjtcbiAgICAgIGlLZXlQYWRbaV0gPSAweDM2IF4gYjtcbiAgICB9XG5cbiAgICBTaGExLmNhbGwodGhpcywgc2hhcmVkTWVtb3J5KTtcblxuICAgIHRoaXMudXBkYXRlKGlLZXlQYWQpO1xuICAgIHRoaXMub0tleVBhZCA9IG9LZXlQYWQ7XG4gICAgdGhpcy5pbm5lciA9IHRydWU7XG4gICAgdGhpcy5zaGFyZWRNZW1vcnkgPSBzaGFyZWRNZW1vcnk7XG4gIH1cbiAgSG1hY1NoYTEucHJvdG90eXBlID0gbmV3IFNoYTEoKTtcblxuICBIbWFjU2hhMS5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgU2hhMS5wcm90b3R5cGUuZmluYWxpemUuY2FsbCh0aGlzKTtcbiAgICBpZiAodGhpcy5pbm5lcikge1xuICAgICAgdGhpcy5pbm5lciA9IGZhbHNlO1xuICAgICAgdmFyIGlubmVySGFzaCA9IHRoaXMuYXJyYXkoKTtcbiAgICAgIFNoYTEuY2FsbCh0aGlzLCB0aGlzLnNoYXJlZE1lbW9yeSk7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLm9LZXlQYWQpO1xuICAgICAgdGhpcy51cGRhdGUoaW5uZXJIYXNoKTtcbiAgICAgIFNoYTEucHJvdG90eXBlLmZpbmFsaXplLmNhbGwodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBleHBvcnRzID0gY3JlYXRlTWV0aG9kKCk7XG4gIGV4cG9ydHMuc2hhMSA9IGV4cG9ydHM7XG4gIGV4cG9ydHMuc2hhMS5obWFjID0gY3JlYXRlSG1hY01ldGhvZCgpO1xuXG4gIGlmIChDT01NT05fSlMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zaGExID0gZXhwb3J0cztcbiAgICBpZiAoQU1EKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsICIvKipcbiAqIENlbnRyYWxpc2VkIEZISVIgQ29kZVN5c3RlbSAvIElkZW50aWZpZXJTeXN0ZW0gVVJJcyB1c2VkIGJ5IHRoZSBtYXBwZXJzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL2ZoaXIvc3lzdGVtcy5weWAuIFdlIHVzZSBVUkwtZm9ybSBzeXN0ZW1zIGluc3RlYWRcbiAqIG9mIE9JRHMgYmVjYXVzZTpcbiAqICAgLSBpdCBkb2Vzbid0IHJlcXVpcmUgbWludGluZy9vd25pbmcgYSByZWFsIE5ISS9UVyBjb3JlIE9JRCxcbiAqICAgLSBpdCdzIHNlbGYtZGVzY3JpYmluZyBpbiB0b29scyB0aGF0IGRvbid0IHJlY29nbmlzZSB0aGUgT0lELFxuICogICAtIGl0IGNsZWFubHkgc3Vydml2ZXMgdGhlIFRXTkhJRkhJUiB2YWxpZGF0b3IncyBzeW50YWN0aWMgY2hlY2suXG4gKlxuICogQWxsIHN5c3RlbXMgbGl2ZSBoZXJlIHNvIGEgc2luZ2xlIGNoYW5nZSByaXBwbGVzIHRvIGV2ZXJ5IG1hcHBlci5cbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDAgTkhJIG5hdGlvbmFsIGNvZGUgc3lzdGVtcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIFx1NTA2NVx1NEZERFx1N0Y3Mlx1OTFBQlx1NEVFNFx1NEVFM1x1NzhCQyAobGFiICsgcHJvY2VkdXJlIG9yZGVyIGNvZGVzIFx1MjAxNCBzYW1lIG5hbWVzcGFjZSkuICovXG5leHBvcnQgY29uc3QgTkhJX01FRElDQUxfT1JERVJfQ09ERSA9XG4gIFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvQ29kZVN5c3RlbS9uaGktbWVkaWNhbC1vcmRlci1jb2RlXCI7XG5cbi8qKiBcdTUwNjVcdTRGRERcdTdGNzJcdTg1RTVcdTU0QzFcdTRFRTNcdTc4QkMgKGRydWcgY29kZSkuICovXG5leHBvcnQgY29uc3QgTkhJX0RSVUdfQ09ERSA9IFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvQ29kZVN5c3RlbS9uaGktZHJ1Zy1jb2RlXCI7XG5cbi8vIFx1MjUwMFx1MjUwMCBUYWl3YW4gcGF0aWVudCBpZGVudGlmaWVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RiAoVGFpd2FuIG5hdGlvbmFsIElEKS4gKi9cbmV4cG9ydCBjb25zdCBUV19OQVRJT05BTF9JRCA9IFwiaHR0cHM6Ly90d2NvcmUubW9ody5nb3YudHcvSWRlbnRpZmllclN5c3RlbS9uYXRpb25hbC1pZFwiO1xuXG4vLyBcdTI1MDBcdTI1MDAgTG9jYWwgZmFsbGJhY2tzIChwZXItZGVwbG95bWVudCwgTk9UIGNyb3NzLXN5c3RlbSBjYW5vbmljYWwpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX0xBQl9DT0RFID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1sYWJcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfTUVESUNBVElPTl9DT0RFID1cbiAgXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1tZWRpY2F0aW9uXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1JFUE9SVF9DT0RFID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9Db2RlU3lzdGVtL2hpcy1sb2NhbC1yZXBvcnRcIjtcbmV4cG9ydCBjb25zdCBISVNfTE9DQUxfQ09ORElUSU9OX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWNvbmRpdGlvblwiO1xuZXhwb3J0IGNvbnN0IEhJU19MT0NBTF9QUk9DRURVUkVfQ09ERSA9XG4gIFwiaHR0cHM6Ly9uaGktZmhpci1icmlkZ2UubG9jYWwvQ29kZVN5c3RlbS9oaXMtbG9jYWwtcHJvY2VkdXJlXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX0FMTEVSR0VOX0NPREUgPVxuICBcImh0dHBzOi8vbmhpLWZoaXItYnJpZGdlLmxvY2FsL0NvZGVTeXN0ZW0vaGlzLWxvY2FsLWFsbGVyZ2VuXCI7XG5leHBvcnQgY29uc3QgSElTX0xPQ0FMX1BBVElFTlRfTVJOID0gXCJodHRwczovL25oaS1maGlyLWJyaWRnZS5sb2NhbC9JZGVudGlmaWVyU3lzdGVtL2hpcy1tcm5cIjtcblxuLy8gXHUyNTAwXHUyNTAwIEludGVybmF0aW9uYWwgY29kZSBzeXN0ZW1zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgY29uc3QgTE9JTkMgPSBcImh0dHA6Ly9sb2luYy5vcmdcIjtcbmV4cG9ydCBjb25zdCBTTk9NRURfQ1QgPSBcImh0dHA6Ly9zbm9tZWQuaW5mby9zY3RcIjtcbi8qKiBJQ0QtMTAtQ00gKFRhaXdhbiAvIFx1NTA2NVx1NEZERCB1c2VzIHRoaXMsIG5vdCBiYXJlIElDRC0xMCkuICovXG5leHBvcnQgY29uc3QgSUNEXzEwX0NNID0gXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtY21cIjtcbmV4cG9ydCBjb25zdCBJQ0RfMTBfUENTID0gXCJodHRwOi8vaGw3Lm9yZy9maGlyL3NpZC9pY2QtMTAtcGNzXCI7XG4iLCAiLyoqXG4gKiBDcm9zcy1tYXBwZXIgaGVscGVycyBzaGFyZWQgYnkgc2V2ZXJhbCBGSElSIHJlc291cmNlIG1hcHBlcnMuXG4gKi9cblxuaW1wb3J0IHsgc2hhMSB9IGZyb20gXCJqcy1zaGExXCI7XG5cbi8qKlxuICogUGVyLWluc3RhbGwgc2FsdCBtaXhlZCBpbnRvIGV2ZXJ5IHN0YWJsZUlkKCkgYW5kIGRlcml2ZVBhdGllbnRJZCgpIGNhbGwuXG4gKlxuICogVGhlIHNhbHQgcHJvdGVjdHMgYWdhaW5zdCBidW5kbGUtbGVhayBkZS1hbm9ueW1pemF0aW9uOiB3aXRob3V0IGl0LFxuICogYHNoYTEobmF0aW9uYWxJZHwuLi4pYCBpcyByZXZlcnNpYmxlIGZvciBhbnkgb2YgdGhlIH4zME0gVGFpd2FuZXNlXG4gKiBuYXRpb25hbCBJRHMgYnkgYnJ1dGUgZm9yY2UuIEJhY2tlbmQgZ2VuZXJhdGVzIG9uZSBhdCBmaXJzdCBzdGFydHVwXG4gKiBhbmQgcGVyc2lzdHMgaXQgaW4gdGhlIHNldHRpbmdzIHRhYmxlOyBleHRlbnNpb24gZ2VuZXJhdGVzIG9uZSBpblxuICogY2hyb21lLnN0b3JhZ2UubG9jYWwgYXQgU1cgaW5pdC5cbiAqXG4gKiBEZWZhdWx0IGVtcHR5IHNvIGxlZ2FjeSBjYWxsZXJzIGFuZCBwdXJlIHVuaXQgdGVzdHMgKHdoaWNoIHdhbnRcbiAqIHJlcHJvZHVjaWJsZSBJRHMgd2l0aG91dCBwZXJzaXN0ZW5jZSkga2VlcCB3b3JraW5nLlxuICovXG5sZXQgX3NhbHQgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0U3RhYmxlSWRTYWx0KHNhbHQ6IHN0cmluZyk6IHZvaWQge1xuICBfc2FsdCA9IHNhbHQgPz8gXCJcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YWJsZUlkU2FsdCgpOiBzdHJpbmcge1xuICByZXR1cm4gX3NhbHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5pc3RpYyAzMi1jaGFyIGhleCBJRCBkZXJpdmVkIGZyb20gdGhlIHBhdGllbnQgSUQgKyBhcmJpdHJhcnlcbiAqIGtleSBwYXJ0cy4gU2FsdGVkIHdpdGggdGhlIGluc3RhbGwtbG9jYWwgc2VjcmV0IHNvIHRoZSBvdXRwdXQgY2FuJ3RcbiAqIGJlIHJldmVyc2VkIGV2ZW4gd2hlbiBidW5kbGVzIGxlYWsuXG4gKlxuICogVXNlcyBganMtc2hhMWAgKHB1cmUgSlMpIGluc3RlYWQgb2YgYG5vZGU6Y3J5cHRvYCBzbyB0aGUgc2FtZSBtYXBwZXJcbiAqIGNvZGUgcnVucyB1bm1vZGlmaWVkIGluIHRoZSBDaHJvbWUgZXh0ZW5zaW9uJ3MgbG9jYWwtb25seSBtb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhYmxlSWQocGF0aWVudElkOiBzdHJpbmcsIC4uLnBhcnRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGNvbnN0IGtleSA9IFtfc2FsdCwgcGF0aWVudElkLCAuLi5wYXJ0c10uam9pbihcInxcIik7XG4gIHJldHVybiBzaGExKGtleSkuc2xpY2UoMCwgMzIpO1xufVxuXG4vKipcbiAqIE1hcCBhIHJhdyBuYXRpb25hbCBJRCAob3IgYW55IHBhdGllbnQgaWRlbnRpZmllcikgdG8gaXRzIDMyLWNoYXIgaGV4XG4gKiBGSElSIGBQYXRpZW50LmlkYC4gVGhlIHJhdyB2YWx1ZSBpcyBrZXB0IGluIGBQYXRpZW50LmlkZW50aWZpZXJbXS52YWx1ZWBcbiAqIFx1MjAxNCBvbmx5IHRoZSBGSElSIGxvZ2ljYWwgaWQgaXMgaGFzaGVkLiBTYW1lIGluc3RhbGwtbG9jYWwgc2FsdCBhc1xuICogc3RhYmxlSWQoKSBzbyBhbGwgcmVmZXJlbmNlcyBzdGF5IGNvbnNpc3RlbnQuXG4gKlxuICogRkhJUiBSNCBcdTAwQTcyLjIwIHNheXMgXCJsb2dpY2FsIGlkIFx1MjAyNiBTSE9VTEQgTk9UIGNvbnRhaW4gaWRlbnRpZnlpbmdcbiAqIGluZm9ybWF0aW9uXCIgXHUyMDE0IHRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXJpdmVQYXRpZW50SWQobmF0aW9uYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoYTEoW19zYWx0LCBcInBhdGllbnRcIiwgbmF0aW9uYWxJZF0uam9pbihcInxcIikpLnNsaWNlKDAsIDMyKTtcbn1cblxuLyoqXG4gKiBQYXJ0aWFsbHktYW5vbnltaXplIGEgcGF0aWVudCBuYW1lLiBBcHBsaWVkIGluIG1hcFBhdGllbnQgc28gZXZlcnlcbiAqIEZISVIgcmVzb3VyY2UgdGhhdCBmbG93cyBvdXQgb2YgdGhpcyBjb2RlYmFzZSAoZG93bmxvYWRlZCBCdW5kbGUsXG4gKiBiYWNrZW5kIEZISVIgc3RvcmUsIGRhc2hib2FyZCwgU01BUlQgYXBwIGxhdW5jaGVzKSBzZWVzIHRoZSBtYXNrZWRcbiAqIGZvcm0uIFRoZSB1c2VyJ3MgcmF3IGlucHV0IGlzIHN0aWxsIGtlcHQgaW4gY2hyb21lLnN0b3JhZ2Ugc28gdGhleVxuICogY2FuIHJldmlldyB3aGF0IHdhcyBlbnRlcmVkLCBidXQgaXQgbmV2ZXIgbGVhdmVzIFBhdGllbnQgY29udGV4dC5cbiAqXG4gKiBSdWxlcyAoVGFpd2FuIC8gQ0pLIGNvbnZlbnRpb24pOlxuICogICAtIDEgY2hhciAgICAgXHUyMTkyIGtlZXAgYXMtaXMgKG5vdGhpbmcgdG8gbWFzaylcbiAqICAgLSAyIGNoYXJzICAgIFx1MjE5MiBrZWVwIGZpcnN0LCByZXBsYWNlIHNlY29uZCB3aXRoIE8gICAgXHU3MzhCXHU2NjBFIFx1MjE5MiBcdTczOEJPXG4gKiAgIC0gMysgY2hhcnMgICBcdTIxOTIga2VlcCBmaXJzdCArIGxhc3QsIG1pZGRsZSBhbGwgTyAgICAgIFx1OTBFRFx1NEUwMFx1NjVCMCBcdTIxOTIgXHU5MEVET1x1NjVCMFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHU2Nzk3XHU5MEVEXHU0RTAwXHU2NUIwIFx1MjE5MiBcdTY3OTdPT1x1NjVCMFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHU0RTJEXHU1Q0Y2XHU1MDY1XHU2QjIxXHU5MENFIFx1MjE5MiBcdTRFMkRPT09cdTkwQ0VcbiAqXG4gKiBXZXN0ZXJuIG5hbWVzIChjb250YWluIHdoaXRlc3BhY2UpOiBzcGxpdCBvbiBzcGFjZSwga2VlcCBmaXJzdCArXG4gKiBsYXN0IHRva2VucywgcGFydGlhbC1tYXNrIHRoZSBsYXN0IGFuZCBtaWRkbGU6XG4gKiAgIEpvaG4gU21pdGggXHUyMTkyIEpvaG4gUyoqKlxuICogICBKb2huIFEgU21pdGggXHUyMTkyIEpvaG4gKioqIFNtaXRoXG4gKi9cbi8qKlxuICogSGFsZi1tYXNrIGEgVGFpd2FuIG5hdGlvbmFsIElEIGZvciBzaG91bGRlci1zdXJmaW5nLXNhZmUgZGlzcGxheS5cbiAqIE1hdGNoZXMgTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSdzIG93biBgaGlkYCBjb252ZW50aW9uIChmaXJzdCA2IHZpc2libGUsIGxhc3RcbiAqIDQgaGlkZGVuKTogYFAxMjA3NDA4NjZgIFx1MjE5MiBgUDEyMDc0KioqKmAuXG4gKlxuICogYGNoYXJgIGRlZmF1bHRzIHRvIGAqYCBmb3IgcG9wdXAvdG9hc3QgZGlzcGxheS4gVXNlIGBYYCBmb3IgZmlsZW5hbWVzXG4gKiBzaW5jZSBgKmAgaXMgaW52YWxpZCBpbiBXaW5kb3dzIHBhdGhzLiBUaGUgYXV0by1nZW5lcmF0ZWRcbiAqIGBhdXRvLVhYWFhYWFhYYCBwbGFjZWhvbGRlcnMgZmxvdyB0aHJvdWdoIHVuY2hhbmdlZCAoYWxyZWFkeVxuICogbm9uLWlkZW50aWZ5aW5nKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hc2tJZChpZDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCwgY2hhciA9IFwiKlwiKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IChpZCA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghcykgcmV0dXJuIHM7XG4gIGlmICgvXltBLVpdWzEyXVxcZHs4fSQvLnRlc3QocykpIHJldHVybiBzLnNsaWNlKDAsIDYpICsgY2hhci5yZXBlYXQoNCk7XG4gIGlmIChzLnN0YXJ0c1dpdGgoXCJhdXRvLVwiKSkgcmV0dXJuIHM7XG4gIGlmIChzLmxlbmd0aCA+IDYpIHJldHVybiBzLnNsaWNlKDAsIDIpICsgY2hhci5yZXBlYXQocy5sZW5ndGggLSA0KSArIHMuc2xpY2UoLTIpO1xuICByZXR1cm4gcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hc2tOYW1lKG5hbWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBjb25zdCB0cmltbWVkID0gKG5hbWUgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIXRyaW1tZWQgfHwgdHJpbW1lZCA9PT0gXCJVbmtub3duXCIpIHJldHVybiB0cmltbWVkO1xuXG4gIGlmICgvXFxzLy50ZXN0KHRyaW1tZWQpKSB7XG4gICAgY29uc3QgcGFydHMgPSB0cmltbWVkLnNwbGl0KC9cXHMrLyk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHBhcnRzWzBdITtcbiAgICBjb25zdCBmaXJzdCA9IHBhcnRzWzBdITtcbiAgICBjb25zdCBsYXN0ID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0hO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIC8vIEZpeGVkIDMgc3RhcnMgcmVnYXJkbGVzcyBvZiBvcmlnaW5hbCBsZW5ndGggXHUyMDE0IGRvbid0IGxlYWsgaG93XG4gICAgICAvLyBsb25nIHRoZSBzdXJuYW1lIHdhcyB2aWEgbWFzayBsZW5ndGguXG4gICAgICBjb25zdCBsYXN0TWFza2VkID0gbGFzdC5sZW5ndGggPD0gMSA/IGxhc3QgOiBgJHtsYXN0WzBdfSoqKmA7XG4gICAgICByZXR1cm4gYCR7Zmlyc3R9ICR7bGFzdE1hc2tlZH1gO1xuICAgIH1cbiAgICBjb25zdCBtaWRkbGVzID0gcGFydHMuc2xpY2UoMSwgLTEpLm1hcCgoKSA9PiBcIioqKlwiKTtcbiAgICByZXR1cm4gW2ZpcnN0LCAuLi5taWRkbGVzLCBsYXN0XS5qb2luKFwiIFwiKTtcbiAgfVxuXG4gIC8vIENKSyAvIHNpbmdsZS10b2tlbiBwYXRoLiBJdGVyYXRlIGNvZGVwb2ludHMgKG5vdCBVVEYtMTYgdW5pdHMpIHNvXG4gIC8vIHN1cnJvZ2F0ZS1wYWlyIGNoYXJhY3RlcnMgY2FuJ3QgZ2V0IHNwbGl0IG1pZC1jaGFyYWN0ZXIuXG4gIGNvbnN0IGNoYXJzID0gQXJyYXkuZnJvbSh0cmltbWVkKTtcbiAgaWYgKGNoYXJzLmxlbmd0aCA8PSAxKSByZXR1cm4gdHJpbW1lZDtcbiAgaWYgKGNoYXJzLmxlbmd0aCA9PT0gMikgcmV0dXJuIGAke2NoYXJzWzBdfU9gO1xuICByZXR1cm4gY2hhcnNbMF0gKyBcIk9cIi5yZXBlYXQoY2hhcnMubGVuZ3RoIC0gMikgKyBjaGFyc1tjaGFycy5sZW5ndGggLSAxXTtcbn1cbiIsICIvKipcbiAqIEFsbGVyZ3lJbnRvbGVyYW5jZSBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2FsbGVyZ3kucHlgLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IEFMTE9XRURfQ0FURUdPUklFUyA9IG5ldyBTZXQoW1wibWVkaWNhdGlvblwiLCBcImZvb2RcIiwgXCJlbnZpcm9ubWVudFwiLCBcImJpb2xvZ2ljXCJdKTtcbmNvbnN0IEFMTE9XRURfQ1JJVElDQUxJVFkgPSBuZXcgU2V0KFtcImhpZ2hcIiwgXCJsb3dcIiwgXCJ1bmFibGUtdG8tYXNzZXNzXCJdKTtcblxuZnVuY3Rpb24gbWFwU3lzdGVtKHN5c3RlbUhpbnQ6IHVua25vd24pOiBzdHJpbmcge1xuICBjb25zdCBzID0gdHlwZW9mIHN5c3RlbUhpbnQgPT09IFwic3RyaW5nXCIgPyBzeXN0ZW1IaW50LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICBpZiAocy5pbmNsdWRlcyhcInNub21lZFwiKSkgcmV0dXJuIHN5c3RlbXMuU05PTUVEX0NUO1xuICBpZiAocy5pbmNsdWRlcyhcInJ4bm9ybVwiKSkgcmV0dXJuIFwiaHR0cDovL3d3dy5ubG0ubmloLmdvdi9yZXNlYXJjaC91bWxzL3J4bm9ybVwiO1xuICByZXR1cm4gc3lzdGVtcy5ISVNfTE9DQUxfQUxMRVJHRU5fQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEFsbGVyZ3lJbnRvbGVyYW5jZShcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgPz8gXCJVbmtub3duIEFsbGVyZ2VuXCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtID0gbWFwU3lzdGVtKHJhdy5zeXN0ZW0gPz8gXCJcIik7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkFsbGVyZ3lJbnRvbGVyYW5jZVwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIGNvZGUgfHwgZGlzcGxheSwgcmF3LnJlY29yZGVkX2RhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHBhdGllbnQ6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY2xpbmljYWxTdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vYWxsZXJneWludG9sZXJhbmNlLWNsaW5pY2FsXCIsXG4gICAgICAgICAgY29kZTogXCJhY3RpdmVcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB2ZXJpZmljYXRpb25TdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vYWxsZXJneWludG9sZXJhbmNlLXZlcmlmaWNhdGlvblwiLFxuICAgICAgICAgIGNvZGU6IFwiY29uZmlybWVkXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgY29kZToge1xuICAgICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICAgIHRleHQ6IGRpc3BsYXksXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBjYXRlZ29yeSA9IHJhdy5jYXRlZ29yeSA/PyBcIlwiO1xuICBpZiAoQUxMT1dFRF9DQVRFR09SSUVTLmhhcyhjYXRlZ29yeSkpIHtcbiAgICByZXNvdXJjZS5jYXRlZ29yeSA9IFtjYXRlZ29yeV07XG4gIH1cblxuICBjb25zdCBjcml0aWNhbGl0eSA9IHJhdy5jcml0aWNhbGl0eSA/PyBcIlwiO1xuICBpZiAoQUxMT1dFRF9DUklUSUNBTElUWS5oYXMoY3JpdGljYWxpdHkpKSB7XG4gICAgcmVzb3VyY2UuY3JpdGljYWxpdHkgPSBjcml0aWNhbGl0eTtcbiAgfVxuXG4gIGlmIChyYXcucmVjb3JkZWRfZGF0ZSkge1xuICAgIHJlc291cmNlLnJlY29yZGVkRGF0ZSA9IGAke3Jhdy5yZWNvcmRlZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBjb25zdCByZWFjdGlvbk5vdGUgPSByYXcucmVhY3Rpb24gPz8gXCJcIjtcbiAgaWYgKHJlYWN0aW9uTm90ZSkge1xuICAgIHJlc291cmNlLnJlYWN0aW9uID0gW3sgZGVzY3JpcHRpb246IHJlYWN0aW9uTm90ZSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIENvbmRpdGlvbiBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2NvbmRpdGlvbi5weWAuIEluY2x1ZGVzIHRoZSBJQ0QtMTAtQ01cbiAqIG5vcm1hbGlzZXIgKFRXTkhJRkhJUiBSb3VuZC0zIGZpeCkgd2hpY2ggaW5zZXJ0cyB0aGUgY2Fub25pY2FsIGRvdFxuICogYmFjayBpbnRvIE5ISSdzIHVuLWRvdHRlZCBjb2RlcyAoXCJFMTEyMlwiIFx1MjE5MiBcIkUxMS4yMlwiKS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcbmltcG9ydCB7IHN0YWJsZUlkIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG4vLyBJQ0QtMTAtQ00gY2Fub25pY2FsIGZvcm0gaXMgJ1hYWC5ZWVlbQS1aXScgKGNhdGVnb3J5IDMgY2hhcnMgKyBvcHRpb25hbFxuLy8gZG90ICsgc3ViZGl2aXNpb24gKyBvcHRpb25hbCA3dGgtY2hhcmFjdGVyIGV4dGVuc2lvbikuIE5ISSBcdTUwNjVcdTRGREQgc2VuZHNcbi8vIGNvZGVzIFdJVEhPVVQgdGhlIGRvdCAoJ0UxMTIyJywgJ000Nzg5MicsICdTMDk5M1hBJywgJ00xOTI3MScpLlxuLy8gVmFsaWRhdG9yIHJlamVjdHMgdW4tZG90dGVkIGNvZGVzIGFzICdVbmtub3duIGNvZGUnLlxuY29uc3QgSUNEMTBfQ0FURUdPUllfUkUgPSAvXltBLVpdWzAtOUEtWl17Mn0kLztcblxuLyoqXG4gKiBJbnNlcnQgdGhlIGRvdCBiYWNrIGludG8gTkhJJ3Mgbm8tZG90IElDRC0xMC1DTSBjb2Rlcy5cbiAqICAgRTExMjIgICAgXHUyMTkyIEUxMS4yMlxuICogICBNNDc4OTIgICBcdTIxOTIgTTQ3Ljg5MlxuICogICBTMDk5M1hBICBcdTIxOTIgUzA5LjkzWEFcbiAqICAgRTExICAgICAgXHUyMTkyIEUxMSAgICAgICAgKG5vIHN1YmRpdmlzaW9uOyBwYXNzIHRocm91Z2gpXG4gKiAgIEUxMS4yMiAgIFx1MjE5MiBFMTEuMjIgICAgIChhbHJlYWR5IGRvdHRlZDsgcGFzcyB0aHJvdWdoKVxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplSWNkMTBDbShjb2RlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFjb2RlIHx8IGNvZGUuaW5jbHVkZXMoXCIuXCIpKSByZXR1cm4gY29kZSA/PyBcIlwiO1xuICBjb25zdCBzID0gY29kZS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgaWYgKHMubGVuZ3RoIDw9IDMpIHJldHVybiBzO1xuICBjb25zdCBoZWFkID0gcy5zbGljZSgwLCAzKTtcbiAgY29uc3QgdGFpbCA9IHMuc2xpY2UoMyk7XG4gIGlmIChJQ0QxMF9DQVRFR09SWV9SRS50ZXN0KGhlYWQpKSB7XG4gICAgcmV0dXJuIGAke2hlYWR9LiR7dGFpbH1gO1xuICB9XG4gIHJldHVybiBzO1xufVxuXG5mdW5jdGlvbiBtYXBTeXN0ZW0oc3lzdGVtSGludDogdW5rbm93bik6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiA/IHN5c3RlbUhpbnQudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChzLmluY2x1ZGVzKFwic25vbWVkXCIpKSByZXR1cm4gc3lzdGVtcy5TTk9NRURfQ1Q7XG4gIGlmIChzLmluY2x1ZGVzKFwiaWNkLTEwXCIpIHx8IHMuaW5jbHVkZXMoXCJpY2QxMFwiKSkge1xuICAgIC8vIE5ISSBcdTUwNjVcdTRGREQgY29kZXMgYXJlIElDRC0xMC1DTSAoVVMvVGFpd2FuIGV4dGVuZGVkIHNldCBcdTIwMTQgZS5nLlxuICAgIC8vIEUxMS4yMikuIFRoZSBiYXNlIElDRC0xMCBWYWx1ZVNldCByZWplY3RzIHRoZXNlIGFzICdVbmtub3duIGNvZGUnLlxuICAgIHJldHVybiBzeXN0ZW1zLklDRF8xMF9DTTtcbiAgfVxuICByZXR1cm4gc3lzdGVtcy5ISVNfTE9DQUxfQ09ORElUSU9OX0NPREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBDb25kaXRpb24ocmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQ29uZGl0aW9uXCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgcmF3LmNvZGUgPz8gXCJcIiwgcmF3Lm9uc2V0X2RhdGUgPz8gXCJcIiksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgY2xpbmljYWxTdGF0dXM6IHtcbiAgICAgIGNvZGluZzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly90ZXJtaW5vbG9neS5obDcub3JnL0NvZGVTeXN0ZW0vY29uZGl0aW9uLWNsaW5pY2FsXCIsXG4gICAgICAgICAgY29kZTogcmF3LmNsaW5pY2FsX3N0YXR1cyA/PyBcImFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHZlcmlmaWNhdGlvblN0YXR1czoge1xuICAgICAgY29kaW5nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9jb25kaXRpb24tdmVyLXN0YXR1c1wiLFxuICAgICAgICAgIGNvZGU6IFwiY29uZmlybWVkXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgZGlzcGxheSA9IHJhdy5kaXNwbGF5ID8/IFwiVW5rbm93biBDb25kaXRpb25cIjtcbiAgbGV0IGNvZGUgPSByYXcuY29kZSBhcyBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzeXN0ZW0gPSBtYXBTeXN0ZW0ocmF3LnN5c3RlbSA/PyBcIlwiKTtcbiAgaWYgKHN5c3RlbSA9PT0gc3lzdGVtcy5JQ0RfMTBfQ00gJiYgY29kZSkge1xuICAgIGNvZGUgPSBub3JtYWxpemVJY2QxMENtKGNvZGUpO1xuICB9XG4gIHJlc291cmNlLmNvZGUgPSB7XG4gICAgY29kaW5nOiBbeyBzeXN0ZW0sIGNvZGU6IGNvZGUgfHwgZGlzcGxheSwgZGlzcGxheSB9XSxcbiAgICB0ZXh0OiBkaXNwbGF5LFxuICB9O1xuXG4gIGNvbnN0IHNldmVyaXR5ID0gcmF3LnNldmVyaXR5ID8/IFwiXCI7XG4gIGlmIChzZXZlcml0eSkge1xuICAgIHJlc291cmNlLnNldmVyaXR5ID0geyB0ZXh0OiBzZXZlcml0eSB9O1xuICB9XG5cbiAgaWYgKHJhdy5vbnNldF9kYXRlKSB7XG4gICAgcmVzb3VyY2Uub25zZXREYXRlVGltZSA9IGAke3Jhdy5vbnNldF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2U7XG59XG4iLCAiLyoqXG4gKiBEaWFnbm9zdGljUmVwb3J0IG1hcHBlci5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZGlhZ25vc3RpY19yZXBvcnQucHlgLiBSZXR1cm5zIG51bGwgZm9yXG4gKiBsaXN0LXBhZ2Ugcm93cyBsYWNraW5nIGEgY29uY2x1c2lvbiwgYW5kIGZvciBsYWItdmFsdWUtb25seSBcInJlcG9ydHNcIlxuICogdGhhdCB3b3VsZCBkdXBsaWNhdGUgYSBwcm9wZXIgT2JzZXJ2YXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuY29uc3QgVjJfMDA3NCA9IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92Mi0wMDc0XCI7XG5cbmNvbnN0IENBVEVHT1JZX01BUDogUmVjb3JkPHN0cmluZywgW3N0cmluZywgc3RyaW5nLCBzdHJpbmddPiA9IHtcbiAgTEFCOiBbVjJfMDA3NCwgXCJMQUJcIiwgXCJMYWJvcmF0b3J5XCJdLFxuICBSQUQ6IFtWMl8wMDc0LCBcIlJBRFwiLCBcIlJhZGlvbG9neVwiXSxcbiAgQ0FSOiBbVjJfMDA3NCwgXCJDQVJcIiwgXCJDYXJkaW9sb2d5XCJdLFxuICBQQVRIOiBbVjJfMDA3NCwgXCJQQVRcIiwgXCJQYXRob2xvZ3lcIl0sXG59O1xuXG4vLyBMYWItcmVzdWx0IHBhdHRlcm5zIHRoYXQgbG9vayBsaWtlIHNpbmdsZS12YWx1ZSBsYWIgcmVhZGluZ3MgcmF0aGVyXG4vLyB0aGFuIGEgbmFycmF0aXZlIHJlcG9ydC5cbmNvbnN0IExBQl9VTklUX1JFID1cbiAgL1xcZCsoPzpcXC5cXGQrKT9cXHMqKD86JXxtZ1xcL2RMfGdcXC9kTHxtbW9sXFwvTHxVXFwvTHxJVVxcL0x8bUlVXFwvTHxuZ1xcL21MfFx1MDNCQ2dcXC9kTHx1Z1xcL2RMfHBnXFwvbUx8Zkx8XFwvdUx8MTBcXF4/XFxkK1xcL3VMfHgxMFxcXj9cXGQrXFwvdUx8c2VjfFx1NzlEMnxjb3BpZXNcXC9tTCkvO1xuXG5mdW5jdGlvbiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghY29uY2x1c2lvbikgcmV0dXJuIHRydWU7XG4gIGNvbnN0IHRleHQgPSBjb25jbHVzaW9uLnRyaW0oKTtcbiAgLy8gUmVhbCBuYXJyYXRpdmUgcmVwb3J0cyBhbG1vc3QgYWx3YXlzIGNvbnRhaW4gbXVsdGlwbGUgc2VudGVuY2VzLlxuICBpZiAodGV4dC5sZW5ndGggPiAxMDApIHJldHVybiBmYWxzZTtcbiAgLy8gU2luZ2xlIHZhbHVlIHBhdHRlcm4gKyBwYXJlbnRoZXRpY2FsIHJlZmVyZW5jZSByYW5nZSA9IGxhYiBsaW5lLlxuICBpZiAoTEFCX1VOSVRfUkUudGVzdCh0ZXh0KSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcERpYWdub3N0aWNSZXBvcnQoXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoKHJhdy5jb25jbHVzaW9uID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoIWNvbmNsdXNpb24pIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGNhdEtleVJhdyA9IFN0cmluZyhyYXcuY2F0ZWdvcnkgPz8gXCJcIikudG9VcHBlckNhc2UoKTtcbiAgaWYgKGNhdEtleVJhdyA9PT0gXCJMQUJcIiAmJiBsb29rc0xpa2VMYWJWYWx1ZU9ubHkoY29uY2x1c2lvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSA/PyBcIlVua25vd24gUmVwb3J0XCI7XG4gIGNvbnN0IGNvZGUgPSByYXcuY29kZTtcbiAgY29uc3Qgc3lzdGVtSGludCA9IHJhdy5zeXN0ZW0gPz8gXCJcIjtcbiAgY29uc3Qgc3lzdGVtID1cbiAgICB0eXBlb2Ygc3lzdGVtSGludCA9PT0gXCJzdHJpbmdcIiAmJiBzeXN0ZW1IaW50LnRvVXBwZXJDYXNlKCkgPT09IFwiTE9JTkNcIlxuICAgICAgPyBzeXN0ZW1zLkxPSU5DXG4gICAgICA6IHN5c3RlbXMuSElTX0xPQ0FMX1JFUE9SVF9DT0RFO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gICAgaWQ6IHN0YWJsZUlkKHBhdGllbnRJZCwgY29kZSB8fCBkaXNwbGF5LCByYXcuZGF0ZSA/PyBcIlwiKSxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiByYXcuc3RhdHVzID8/IFwiZmluYWxcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gICAgY29uY2x1c2lvbixcbiAgfTtcblxuICBjb25zdCBjYXRFbnRyeSA9IENBVEVHT1JZX01BUFtjYXRLZXlSYXddO1xuICBpZiAoY2F0RW50cnkpIHtcbiAgICBjb25zdCBbY2F0U3lzLCBjYXRDb2RlLCBjYXREaXNwbGF5XSA9IGNhdEVudHJ5O1xuICAgIHJlc291cmNlLmNhdGVnb3J5ID0gW3sgY29kaW5nOiBbeyBzeXN0ZW06IGNhdFN5cywgY29kZTogY2F0Q29kZSwgZGlzcGxheTogY2F0RGlzcGxheSB9XSB9XTtcbiAgfVxuXG4gIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfVxuICBpZiAocmF3Lmlzc3VlZCkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5pc3N1ZWR9VDAwOjAwOjAwKzA4OjAwYDtcbiAgfSBlbHNlIGlmIChyYXcuZGF0ZSkge1xuICAgIHJlc291cmNlLmlzc3VlZCA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5wZXJmb3JtZXIgPSBbeyBkaXNwbGF5OiBob3NwaXRhbCB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIEVuY291bnRlciBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL2VuY291bnRlci5weWAuIFN0YWJsZSBJRCBpbmNsdWRlcyBob3NwaXRhbFxuICogc28gc2FtZS1kYXkgdmlzaXRzIHRvIGRpZmZlcmVudCBpbnN0aXR1dGlvbnMgZWFjaCBnZXQgdGhlaXIgb3duXG4gKiBFbmNvdW50ZXIgKHRoZSBwb3N0LW1hcHBpbmcgbGlua2VyIGRlcGVuZHMgb24gdGhpcykuXG4gKi9cblxuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IEFDVENPREVfU1lTVEVNID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YzLUFjdENvZGVcIjtcblxuY29uc3QgQ0xBU1NfTUFQOiBSZWNvcmQ8c3RyaW5nLCBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBBTUI6IFtBQ1RDT0RFX1NZU1RFTSwgXCJBTUJcIiwgXCJhbWJ1bGF0b3J5XCJdLFxuICBJTVA6IFtBQ1RDT0RFX1NZU1RFTSwgXCJJTVBcIiwgXCJpbnBhdGllbnQgZW5jb3VudGVyXCJdLFxuICBFTUVSOiBbQUNUQ09ERV9TWVNURU0sIFwiRU1FUlwiLCBcImVtZXJnZW5jeVwiXSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBFbmNvdW50ZXIocmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBwYXRpZW50SWQ6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCBlbmNDbGFzcyA9IFN0cmluZyhyYXcuY2xhc3MgPz8gXCJBTUJcIikudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2xhc3NFbnRyeSA9IENMQVNTX01BUFtlbmNDbGFzc10gPz8gQ0xBU1NfTUFQLkFNQiE7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIkVuY291bnRlclwiLFxuICAgIGlkOiBzdGFibGVJZChwYXRpZW50SWQsIHJhdy5kYXRlID8/IFwiXCIsIGVuY0NsYXNzLCAoKHJhdy5ob3NwaXRhbCA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKSksXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5pc2hlZFwiLFxuICAgIGNsYXNzOiB7XG4gICAgICBzeXN0ZW06IGNsYXNzRW50cnlbMF0sXG4gICAgICBjb2RlOiBjbGFzc0VudHJ5WzFdLFxuICAgICAgZGlzcGxheTogY2xhc3NFbnRyeVsyXSxcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgLy8gTkhJJ3MgZW5jb3VudGVyIFwidHlwZVwiIG1hcmtlcnMgXHUyMDE0ICdJQ1x1NTM2MVx1OENDN1x1NjU5OScgLyAnXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5JyAvICdcdTRGNEZcdTk2NjInXG4gIC8vIFx1MjAxNCBhcmUgZGF0YS1vcmlnaW4gbGFiZWxzLCBub3QgU05PTUVEIGNsaW5pY2FsIHR5cGVzLiBLZWVwIHRoZW0gYXNcbiAgLy8gQ29kZWFibGVDb25jZXB0LnRleHQgd2l0aG91dCBjbGFpbWluZyBTTk9NRUQuXG4gIGNvbnN0IHR5cGVEaXNwbGF5ID0gKChyYXcudHlwZV9kaXNwbGF5ID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAodHlwZURpc3BsYXkpIHtcbiAgICByZXNvdXJjZS50eXBlID0gW3sgdGV4dDogdHlwZURpc3BsYXkgfV07XG4gIH1cblxuICBjb25zdCBwZXJpb2Q6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgaWYgKHJhdy5kYXRlKSBwZXJpb2Quc3RhcnQgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICBpZiAocmF3LmVuZF9kYXRlKSBwZXJpb2QuZW5kID0gYCR7cmF3LmVuZF9kYXRlfVQwMDowMDowMCswODowMGA7XG4gIGlmIChPYmplY3Qua2V5cyhwZXJpb2QpLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5wZXJpb2QgPSBwZXJpb2Q7XG4gIH1cblxuICBjb25zdCBkZXBhcnRtZW50ID0gcmF3LmRlcGFydG1lbnQgPz8gXCJcIjtcbiAgY29uc3QgcHJvdmlkZXIgPSByYXcucHJvdmlkZXIgPz8gXCJcIjtcbiAgaWYgKGRlcGFydG1lbnQgfHwgcHJvdmlkZXIpIHtcbiAgICBjb25zdCBwYXJ0aWNpcGFudDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChwcm92aWRlcikgcGFydGljaXBhbnQuaW5kaXZpZHVhbCA9IHsgZGlzcGxheTogcHJvdmlkZXIgfTtcbiAgICByZXNvdXJjZS5wYXJ0aWNpcGFudCA9IE9iamVjdC5rZXlzKHBhcnRpY2lwYW50KS5sZW5ndGggPiAwID8gW3BhcnRpY2lwYW50XSA6IFtdO1xuICAgIGlmIChkZXBhcnRtZW50KSB7XG4gICAgICByZXNvdXJjZS5zZXJ2aWNlVHlwZSA9IHsgdGV4dDogZGVwYXJ0bWVudCB9O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhvc3BpdGFsID0gKChyYXcuaG9zcGl0YWwgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGlmIChob3NwaXRhbCkge1xuICAgIHJlc291cmNlLnNlcnZpY2VQcm92aWRlciA9IHsgZGlzcGxheTogaG9zcGl0YWwgfTtcbiAgfVxuXG4gIGNvbnN0IHJlYXNvbiA9IHJhdy5yZWFzb24gPz8gXCJcIjtcbiAgaWYgKHJlYXNvbikge1xuICAgIHJlc291cmNlLnJlYXNvbkNvZGUgPSBbeyB0ZXh0OiByZWFzb24gfV07XG4gIH1cblxuICBjb25zdCBkaXNjaGFyZ2UgPSByYXcuZGlzY2hhcmdlX2Rpc3Bvc2l0aW9uID8/IFwiXCI7XG4gIGlmIChkaXNjaGFyZ2UpIHtcbiAgICByZXNvdXJjZS5ob3NwaXRhbGl6YXRpb24gPSB7IGRpc2NoYXJnZURpc3Bvc2l0aW9uOiB7IHRleHQ6IGRpc2NoYXJnZSB9IH07XG4gIH1cblxuICBjb25zdCBjbGluaWNhbE5vdGUgPSAoKHJhdy5jbGluaWNhbF9ub3RlID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoY2xpbmljYWxOb3RlKSB7XG4gICAgcmVzb3VyY2Uubm90ZSA9IFt7IHRleHQ6IGNsaW5pY2FsTm90ZSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIE1lZGljYXRpb25SZXF1ZXN0IG1hcHBlciArIGJpbGluZ3VhbCBkZWR1cGxpY2F0aW9uLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9tZWRpY2F0aW9uLnB5YC4gTkhJIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QSByZXBvcnRzIHRoZVxuICogU0FNRSBwcmVzY3JpcHRpb24gbXVsdGlwbGUgdGltZXMgKEVuZ2xpc2gtb25seSAvIEVuZytcdTRFMkQgLyBcdTRFMkQrRW5nKS5cbiAqIGBtYXBNZWRpY2F0aW9uc0RlZHVwYCBjb2xsYXBzZXMgdGhlc2UgdG8gb25lIE1lZGljYXRpb25SZXF1ZXN0IHBlclxuICogKGRhdGUsIGNhbm9uaWNhbC1kcnVnLWtleSksIHByZWZlcnJpbmcgdGhlIGZvcm0gd2l0aCBtb3JlIENKSyBjaGFyc1xuICogKGNsaW5pY2lhbnMgcmVhZCBcdTU1NDZcdTU0QzFcdTU0MEQgZmlyc3QpLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgbm9ybWFsaXplSWNkMTBDbSB9IGZyb20gXCIuL2NvbmRpdGlvblwiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmZ1bmN0aW9uIGlzQ2prKGNoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgLy8gXHU0RTAwIChVKzRFMDApIHRvIFx1OUZGRiAoVSs5RkZGKSBjb3ZlcnMgQ0pLIFVuaWZpZWQgSWRlb2dyYXBocy5cbiAgY29uc3QgY3AgPSBjaC5jb2RlUG9pbnRBdCgwKSA/PyAwO1xuICByZXR1cm4gY3AgPj0gMHg0ZTAwICYmIGNwIDw9IDB4OWZmZjtcbn1cblxuZnVuY3Rpb24gY2prQ2hhcnMoczogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IG51bWJlciB7XG4gIGlmICghcykgcmV0dXJuIDA7XG4gIGxldCBuID0gMDtcbiAgZm9yIChjb25zdCBjaCBvZiBzKSBpZiAoaXNDamsoY2gpKSBuKys7XG4gIHJldHVybiBuO1xufVxuXG4vKipcbiAqIE1hdGNoIGEgXCJsb25nXCIgRW5nbGlzaCBjaHVuayAoXHUyMjY1NCBjaGFycyBvZiBBLVovMC05L3B1bmN0dWF0aW9uIGNvbW1vblxuICogdG8gZHJ1ZyBuYW1lcykuIEF2b2lkIG1hdGNoaW5nIHNob3J0IHRva2VucyBsaWtlIFwiRFwiIG9yIFwiUE9cIiB0aGF0XG4gKiBhcHBlYXIgaW5zaWRlIENoaW5lc2UgbmFtZXMuXG4gKi9cbmNvbnN0IEVOX0NIVU5LX0cgPSAvW0EtWl1bQS1aMC05LiUvXFwtXCInXFxzXXszLH0vZztcblxuLyoqXG4gKiBSZWR1Y2UgYSBkcnVnLW5hbWUgc3RyaW5nIHRvIGEgc3RhYmxlIGNhbm9uaWNhbCBrZXkuIEV4dHJhY3QgdGhlXG4gKiBsb25nZXN0IEVuZ2xpc2ggZnJhZ21lbnQsIHRoZW4gdHJ1bmNhdGUgYXQgY29tbW9uIHNlcGFyYXRvcnMgc28gYVxuICogbmFtZSB3aXRoIGV4dHJhIHRyYWlsaW5nIG1vZGlmaWVycyBzdGlsbCBjb2xsYXBzZXMgdG8gYnJhbmQrc3RyZW5ndGguXG4gKlxuICogRXhhbXBsZXMgKGFsbCBtYXAgdG8gXCJ0aW1vcHRvbCB4ZSAwLjUlIG9waHRoYWxtaWMgc29sdXRpb25cIik6XG4gKiAgIFwiVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OXCJcbiAqICAgXCJUSU1PUFRPTCBYRSAwLjUlIE9QSFRIQUxNSUMgU09MVVRJT04gKFx1OTc1Mlx1NzczQ1x1OTczMlx1MjAyNilcIlxuICogICBcIlx1OTc1Mlx1NzczQ1x1OTczMlx1MjAyNiAoVElNT1BUT0wgWEUgMC41JSBPUEhUSEFMTUlDIFNPTFVUSU9OKVwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxEcnVnS2V5KG5hbWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBjb25zdCBzID0gKG5hbWUgPz8gXCJcIikudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgY2h1bmtzID0gWy4uLnMubWF0Y2hBbGwoRU5fQ0hVTktfRyldLm1hcCgobSkgPT4gbVswXSk7XG4gIGlmIChjaHVua3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIChuYW1lID8/IFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIGxldCBsb25nZXN0ID0gY2h1bmtzLnJlZHVjZSgoYSwgYikgPT4gKGIubGVuZ3RoID4gYS5sZW5ndGggPyBiIDogYSkpLnRyaW0oKTtcbiAgZm9yIChjb25zdCBzZXAgb2YgW1wiIC0gXCIsIFwiIFx1MjAxMyBcIiwgXCIgLyBcIl0pIHtcbiAgICBpZiAobG9uZ2VzdC5pbmNsdWRlcyhzZXApKSB7XG4gICAgICBsb25nZXN0ID0gbG9uZ2VzdC5zcGxpdChzZXApWzBdITtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxvbmdlc3QucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogQmVzdC1lZmZvcnQgYWN0aXZlIHZzIGNvbXBsZXRlZCBkZWNpc2lvbiBmb3IgYSBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqIEFjdGl2ZSB3aGlsZSAoYXV0aG9yZWRfZGF0ZSArIGR1cmF0aW9uID4gdG9kYXkpOyBvdGhlcndpc2UgY29tcGxldGVkLlxuICogTWlzc2luZyBkdXJhdGlvbiBcdTIxOTIgYXNzdW1lIDkwLWRheSByZWZpbGwgd2luZG93IChOSEkncyB0eXBpY2FsIGNhZGVuY2UpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVkU3RhdHVzKFxuICBhdXRob3JlZElzbzogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgZHVyYXRpb25EYXlzOiBhbnksXG4pOiBcImFjdGl2ZVwiIHwgXCJjb21wbGV0ZWRcIiB7XG4gIGlmICghYXV0aG9yZWRJc28pIHJldHVybiBcImNvbXBsZXRlZFwiO1xuICBjb25zdCBkYXRlUGFydCA9IFN0cmluZyhhdXRob3JlZElzbykuc2xpY2UoMCwgMTApO1xuICBjb25zdCBwYXJzZWQgPSBuZXcgRGF0ZShgJHtkYXRlUGFydH1UMDA6MDA6MDBaYCk7XG4gIGlmIChOdW1iZXIuaXNOYU4ocGFyc2VkLmdldFRpbWUoKSkpIHJldHVybiBcImNvbXBsZXRlZFwiO1xuXG4gIGxldCBkYXlzOiBudW1iZXIgfCBudWxsO1xuICBpZiAoZHVyYXRpb25EYXlzID09PSBudWxsIHx8IGR1cmF0aW9uRGF5cyA9PT0gdW5kZWZpbmVkIHx8IGR1cmF0aW9uRGF5cyA9PT0gXCJcIikge1xuICAgIGRheXMgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG4gPSBOdW1iZXIucGFyc2VJbnQoU3RyaW5nKGR1cmF0aW9uRGF5cyksIDEwKTtcbiAgICBkYXlzID0gTnVtYmVyLmlzRmluaXRlKG4pID8gbiA6IG51bGw7XG4gIH1cbiAgaWYgKGRheXMgPT09IG51bGwpIGRheXMgPSA5MDtcblxuICBjb25zdCBlbmQgPSBuZXcgRGF0ZShwYXJzZWQuZ2V0VGltZSgpKTtcbiAgZW5kLnNldFVUQ0RhdGUoZW5kLmdldFVUQ0RhdGUoKSArIGRheXMpO1xuICAvLyBDb21wYXJlIGRhdGUtb25seSAodG9kYXkgaW4gVVRDIHNpbmNlIHdlIGF1dGhvcmVkSXNvIGlzIGRhdGUtb25seSkuXG4gIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgdG9kYXkuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBlbmQgPj0gdG9kYXkgPyBcImFjdGl2ZVwiIDogXCJjb21wbGV0ZWRcIjtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IG9uZSBzY3JhcGVkIHByZXNjcmlwdGlvbiBkaWN0IFx1MjE5MiBGSElSIFI0IE1lZGljYXRpb25SZXF1ZXN0LlxuICogUmV0dXJucyBudWxsIHdoZW4gcmF3IGhhcyBubyBgZHJ1Z19uYW1lYCAoY2FsbGVyIGZpbHRlcnMgb3V0KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE1lZGljYXRpb25SZXF1ZXN0KFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwge1xuICBjb25zdCBkcnVnTmFtZSA9ICgocmF3LmRydWdfbmFtZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKCFkcnVnTmFtZSkgcmV0dXJuIG51bGw7XG5cbiAgLy8gQ2Fub25pY2FsIGtleSAobm90IHJhdyBkcnVnX25hbWUpIGZvciBzdGFibGUgaWQgc28gdGhlIHRocmVlIE5ISVxuICAvLyBcdTRFMkRcdTgyRjEgdmFyaWFudHMgb2YgdGhlIHNhbWUgZHJ1ZyBjb2xsYXBzZSB0byBvbmUgRkhJUiByZXNvdXJjZS5cbiAgY29uc3QgbWVkSWQgPSBzdGFibGVJZChwYXRpZW50SWQsIGNhbm9uaWNhbERydWdLZXkoZHJ1Z05hbWUpLCByYXcuZGF0ZSA/PyBcIlwiKTtcblxuICBjb25zdCBkcnVnQ29kZSA9ICgocmF3LmNvZGUgPz8gXCJcIikgYXMgc3RyaW5nKS50cmltKCk7XG4gIGNvbnN0IGNvZGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBzeXN0ZW06IGRydWdDb2RlID8gc3lzdGVtcy5OSElfRFJVR19DT0RFIDogc3lzdGVtcy5ISVNfTE9DQUxfTUVESUNBVElPTl9DT0RFLFxuICAgIGNvZGU6IGRydWdDb2RlIHx8IGRydWdOYW1lLFxuICAgIGRpc3BsYXk6IGRydWdOYW1lLFxuICB9O1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJNZWRpY2F0aW9uUmVxdWVzdFwiLFxuICAgIGlkOiBtZWRJZCxcbiAgICBtZXRhOiB7IHZlcnNpb25JZDogXCIxXCIsIHNvdXJjZTogXCJuaGktZmhpci1icmlkZ2Uvc2NyYXBlclwiIH0sXG4gICAgc3RhdHVzOiBtZWRTdGF0dXMocmF3LmRhdGUgPz8gXCJcIiwgcmF3LmR1cmF0aW9uX2RheXMpLFxuICAgIGludGVudDogXCJvcmRlclwiLFxuICAgIG1lZGljYXRpb25Db2RlYWJsZUNvbmNlcHQ6IHtcbiAgICAgIGNvZGluZzogW2NvZGluZ10sXG4gICAgICB0ZXh0OiBkcnVnTmFtZSxcbiAgICB9LFxuICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UuYXV0aG9yZWRPbiA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBjb25zdCBkcnVnQ2xhc3MgPSAoKHJhdy5kcnVnX2NsYXNzID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoZHJ1Z0NsYXNzKSB7XG4gICAgcmVzb3VyY2UuY2F0ZWdvcnkgPSBbeyB0ZXh0OiBkcnVnQ2xhc3MgfV07XG4gIH1cblxuICBjb25zdCBob3NwaXRhbCA9ICgocmF3Lmhvc3BpdGFsID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBpZiAoaG9zcGl0YWwpIHtcbiAgICByZXNvdXJjZS5yZXF1ZXN0ZXIgPSB7IGRpc3BsYXk6IGhvc3BpdGFsIH07XG4gIH1cblxuICAvLyBEb3NhZ2UgXHUyMDE0IG9ubHkgd2hlbiBzb3VyY2UgYWN0dWFsbHkgaGFzIGl0LiBOSEkncyBtZWRpY2F0aW9uLWxpc3RcbiAgLy8gZW5kcG9pbnQgcHJvdmlkZXMgbm9uZSBvZiB0aGVzZTsgb3RoZXIgSElTIGFkYXB0ZXJzIGdldCBhXG4gIC8vIHN0cnVjdHVyZWQgZG9zYWdlIG91dC5cbiAgY29uc3QgZG9zYWdlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGsgb2YgW1wiZG9zZVwiLCBcInVuaXRcIiwgXCJmcmVxdWVuY3lcIl0gYXMgY29uc3QpIHtcbiAgICBpZiAocmF3W2tdKSBwYXJ0cy5wdXNoKFN0cmluZyhyYXdba10pKTtcbiAgfVxuICBpZiAocGFydHMubGVuZ3RoID4gMCkge1xuICAgIGRvc2FnZS50ZXh0ID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cbiAgaWYgKHJhdy5yb3V0ZSkge1xuICAgIGRvc2FnZS5yb3V0ZSA9IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtOiBcImh0dHA6Ly9zbm9tZWQuaW5mby9zY3RcIiwgZGlzcGxheTogcmF3LnJvdXRlIH1dLFxuICAgIH07XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKGRvc2FnZSkubGVuZ3RoID4gMCkge1xuICAgIHJlc291cmNlLmRvc2FnZUluc3RydWN0aW9uID0gW2Rvc2FnZV07XG4gIH1cblxuICAvLyBkaXNwZW5zZVJlcXVlc3Qgd2l0aCBxdWFudGl0eSArIHN1cHBseSBkdXJhdGlvbiB3aGVuIHByZXNlbnQuXG4gIGNvbnN0IGRyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIGNvbnN0IHF0eVJhdyA9IHJhdy5xdWFudGl0eTtcbiAgaWYgKHF0eVJhdyAhPT0gbnVsbCAmJiBxdHlSYXcgIT09IHVuZGVmaW5lZCAmJiBxdHlSYXcgIT09IFwiXCIpIHtcbiAgICBjb25zdCBxdHlOdW0gPSBOdW1iZXIucGFyc2VGbG9hdChTdHJpbmcocXR5UmF3KS5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHF0eU51bSkpIHtcbiAgICAgIGRyLnF1YW50aXR5ID0geyB2YWx1ZTogcXR5TnVtIH07XG4gICAgfVxuICB9XG4gIGlmIChyYXcuZHVyYXRpb25fZGF5cykge1xuICAgIGNvbnN0IGRheXMgPSBOdW1iZXIucGFyc2VJbnQoU3RyaW5nKHJhdy5kdXJhdGlvbl9kYXlzKSwgMTApO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoZGF5cykpIHtcbiAgICAgIGRyLmV4cGVjdGVkU3VwcGx5RHVyYXRpb24gPSB7XG4gICAgICAgIHZhbHVlOiBkYXlzLFxuICAgICAgICB1bml0OiBcImRheXNcIixcbiAgICAgICAgc3lzdGVtOiBcImh0dHA6Ly91bml0c29mbWVhc3VyZS5vcmdcIixcbiAgICAgICAgY29kZTogXCJkXCIsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoT2JqZWN0LmtleXMoZHIpLmxlbmd0aCA+IDApIHtcbiAgICByZXNvdXJjZS5kaXNwZW5zZVJlcXVlc3QgPSBkcjtcbiAgfVxuXG4gIGNvbnN0IGluZGljYXRpb24gPSAoKHJhdy5pbmRpY2F0aW9uID8/IFwiXCIpIGFzIHN0cmluZykudHJpbSgpO1xuICBjb25zdCBpbmRpY2F0aW9uQ29kZSA9ICgocmF3LmluZGljYXRpb25fY29kZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgaWYgKGluZGljYXRpb24gfHwgaW5kaWNhdGlvbkNvZGUpIHtcbiAgICBjb25zdCByYzogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGlmIChpbmRpY2F0aW9uQ29kZSkge1xuICAgICAgcmMuY29kaW5nID0gW1xuICAgICAgICB7XG4gICAgICAgICAgc3lzdGVtOiBzeXN0ZW1zLklDRF8xMF9DTSxcbiAgICAgICAgICBjb2RlOiBub3JtYWxpemVJY2QxMENtKGluZGljYXRpb25Db2RlKSxcbiAgICAgICAgICBkaXNwbGF5OiBpbmRpY2F0aW9uIHx8IGluZGljYXRpb25Db2RlLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG4gICAgaWYgKGluZGljYXRpb24pIHtcbiAgICAgIHJjLnRleHQgPSBpbmRpY2F0aW9uQ29kZSA/IGAke2luZGljYXRpb25Db2RlfSAke2luZGljYXRpb259YC50cmltKCkgOiBpbmRpY2F0aW9uO1xuICAgIH1cbiAgICByZXNvdXJjZS5yZWFzb25Db2RlID0gW3JjXTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLyoqXG4gKiBHcm91cC1hd2FyZSBtZWRpY2F0aW9uIG1hcHBlciB0aGF0IGRlZHVwZXMgXHU0RTJEXHU4MkYxIFx1OTZEOVx1OEE5RSBkdXBsaWNhdGVzLlxuICpcbiAqIFN0cmF0ZWd5OlxuICogICAxLiBDb21wdXRlIGNhbm9uaWNhbCBrZXkgcGVyIGRydWcgbmFtZSAobG9uZ2VzdCBFbmdsaXNoIGNodW5rKS5cbiAqICAgMi4gR3JvdXAgYnkgKGRhdGUsIGNhbm9uaWNhbF9rZXkpLiBLZWVwIE9ORSBlbnRyeSBwZXIgZ3JvdXAsXG4gKiAgICAgIHByZWZlcnJpbmcgdGhlIGZvcm0gd2l0aCBGRVdFUiBDSksgY2hhcmFjdGVycyAoRW5nbGlzaCBicmFuZFxuICogICAgICBuYW1lIFx1MjAxNCBjbGluaWNpYW5zIHNjYW4gRW5nbGlzaCBmaXJzdCkuXG4gKiAgIDMuIE1hcCBlYWNoIGtlcHQgZW50cnkgdGhyb3VnaCBtYXBNZWRpY2F0aW9uUmVxdWVzdC5cbiAqXG4gKiBOb3RlOiBQeXRob24gY29tbWVudCBzYXlzIFwibW9yZSBDSktcIiBidXQgdGhlIGNvZGUgdXNlcyBgPGAgKGZld2VyKTtcbiAqIHdlIHByZXNlcnZlIHRoZSBhY3R1YWwgY29kZSBiZWhhdmlvdXIgdG8ga2VlcCBwYXJpdHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBNZWRpY2F0aW9uc0RlZHVwKHJhd0l0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+PigpO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgcmF3SXRlbXMpIHtcbiAgICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGRydWdOYW1lID0gKChpdGVtLmRydWdfbmFtZSA/PyBcIlwiKSBhcyBzdHJpbmcpLnRyaW0oKTtcbiAgICBpZiAoIWRydWdOYW1lKSBjb250aW51ZTtcbiAgICBjb25zdCBkYXRlUGFydCA9ICgoaXRlbS5kYXRlID8/IFwiXCIpIGFzIHN0cmluZykuc2xpY2UoMCwgMTApO1xuICAgIGNvbnN0IGtleSA9IGAke2RhdGVQYXJ0fXwke2Nhbm9uaWNhbERydWdLZXkoZHJ1Z05hbWUpfWA7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBieUtleS5nZXQoa2V5KTtcbiAgICBpZiAoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYnlLZXkuc2V0KGtleSwgaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFByZWZlciB0aGUgZm9ybSB3aXRoIEZFV0VSIENKSyBjaGFyYWN0ZXJzIChFbmdsaXNoIGJyYW5kIG5hbWUpLlxuICAgICAgaWYgKGNqa0NoYXJzKGRydWdOYW1lKSA8IGNqa0NoYXJzKGV4aXN0aW5nLmRydWdfbmFtZSA/PyBcIlwiKSkge1xuICAgICAgICBieUtleS5zZXQoa2V5LCBpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgYnlLZXkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBtID0gbWFwTWVkaWNhdGlvblJlcXVlc3QoaXRlbSwgcGF0aWVudElkKTtcbiAgICBpZiAobSAhPT0gbnVsbCkgb3V0LnB1c2gobSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsICIvKipcbiAqIExPSU5DIG1hcHBpbmcgdGFibGVzIGZvciBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBMT0lOQyBSNCBjb2RpbmdzLlxuICpcbiAqIFB1cmUgZGF0YSwgbm8gbG9naWMuIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9fbG9pbmNfdGFibGVzLnB5YC5cbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDAgX05ISV9UT19MT0lOQyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBcdTkxQUJcdTRFRTRcdTRFRTNcdTc4QkMgXHUyMTkyIHByaW1hcnkgTE9JTkMgbWFwcGluZy4gU291cmNlIG9mIHRydXRoOlxuLy8gVFdOSElGSElSIFBBUyBJbXBsZW1lbnRhdGlvbiBHdWlkZSBDb25jZXB0TWFwLW5oaS1sb2luY1xuLy8gaHR0cHM6Ly9idWlsZC5maGlyLm9yZy9pZy9UV05ISUZISVIvcGFzL0NvbmNlcHRNYXAtbmhpLWxvaW5jLmh0bWxcbi8vXG4vLyBUaGF0IENvbmNlcHRNYXAgZGVjbGFyZXMgNTMgTkhJIGNvZGVzIHdpdGggYGVxdWl2YWxlbmNlOiByZWxhdGVkdG9gXG4vLyBhZ2FpbnN0IDgwNiBMT0lOQyB2YXJpYW50cyAoZGlmZmVyZW50IHNwZWNpbWVucyAvIHVuaXRzIC8gbWV0aG9kc1xuLy8gcGVyIE5ISSBjb2RlIFx1MjAxNCBjb25maXJtaW5nIHRoZSBcIk5ISSBpcyBjb2Fyc2UsIExPSU5DIGlzIGZpbmVcIiB2aWV3KS5cbi8vIEZvciBlYWNoIE5ISSBjb2RlIHdlIGhhbmQtcGljayB0aGUgY2Fub25pY2FsIExPSU5DIG1vc3QgY2xpbmljaWFuc1xuLy8gd291bGQgZXhwZWN0IGluIGEgXHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBIGxhYiByZXBvcnQ6IFNlcnVtL1BsYXNtYSArIE1hc3Mtdm9sdW1lXG4vLyAob3IgYXV0by1jb3VudCBmb3IgY2VsbCBjb3VudGVycykuIEVkZ2UgY2FzZXMgbm90ZWQgaW5saW5lLlxuZXhwb3J0IGNvbnN0IE5ISV9UT19MT0lOQzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIEhhZW1hdG9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA4MDAyQ1wiOiBcIjY2OTAtMlwiLCAvLyBcdTc2N0RcdTg4NDBcdTc0MDNcdThBMDhcdTY1NzggXHUyMDE0IExldWtvY3l0ZXMgIy92b2wgQmxvb2QgQXV0b1xuICBcIjA4MDAzQ1wiOiBcIjcxOC03XCIsIC8vIFx1ODg0MFx1ODI3Mlx1N0QyMFx1NkFBMlx1NjdFNSBcdTIwMTQgSGVtb2dsb2JpbiBNYXNzL3ZvbCBCbG9vZFxuICBcIjA4MDA2Q1wiOiBcIjc3Ny0zXCIsIC8vIFx1ODg0MFx1NUMwRlx1Njc3Rlx1OEEwOFx1NjU3OCBcdTIwMTQgUGxhdGVsZXRzICMvdm9sIEJsb29kIEF1dG9cbiAgXCIwODAxM0NcIjogXCI1NzAyMS04XCIsIC8vIFx1NzY3RFx1ODg0MFx1NzQwM1x1NTIwNlx1OTg1RVx1OEEwOFx1NjU3OCBcdTIwMTQgQ0JDIFcgQXV0byBEaWZmIHBhbmVsXG4gIFwiMDgxMjhCXCI6IFwiNDcyODYtMFwiLCAvLyBcdTlBQThcdTlBRDNcdTdEMzBcdTgwREVcdTVGNjJcdTYxNEJcdTUyMjRcdThCODBcdTU0MDhcdTRGNzVcdTdEMzBcdTgwREVcdTUyMDZcdTk4NUVcdThBMDhcdTY1NzhcbiAgLy8gXHUyNTAwXHUyNTAwIENoZW1pc3RyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAxMUNcIjogXCIxNzg2MS02XCIsIC8vIFx1OTIyMyBcdTIwMTQgQ2FsY2l1bSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAxNUNcIjogXCIyMTYwLTBcIiwgLy8gXHU4MDhDXHU5MTc4XHU5MTUwXHUzMDAxXHU4ODQwIFx1MjAxNCBDcmVhdGluaW5lIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDE2Q1wiOiBcIjIxNjEtOFwiLCAvLyBcdTgwOENcdTkxNTBcdTMwMDFcdTVDM0YgXHUyMDE0IENyZWF0aW5pbmUgTWFzcy92b2wgVXJpbmVcbiAgXCIwOTAyNUNcIjogXCIxOTIwLThcIiwgLy8gQVNUL0dPVCBcdTIwMTQgQXNwYXJ0YXRlIGFtaW5vdHJhbnNmZXJhc2UgQWN0IFMvUFxuICBcIjA5MDI2Q1wiOiBcIjE3NDItNlwiLCAvLyBBTFQvR1BUIFx1MjAxNCBBbGFuaW5lIGFtaW5vdHJhbnNmZXJhc2UgQWN0IFMvUFxuICBcIjA5MDI5Q1wiOiBcIjE5NzUtMlwiLCAvLyBcdTgxQkRcdTdEMDVcdTdEMjBcdTdFM0RcdTkxQ0YgXHUyMDE0IEJpbGlydWJpbiB0b3RhbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAzMENcIjogXCIxOTY4LTdcIiwgLy8gXHU3NkY0XHU2M0E1XHU4MUJEXHU3RDA1XHU3RDIwIFx1MjAxNCBCaWxpcnViaW4gZGlyZWN0IE1hc3Mvdm9sIFMvUFxuICBcIjA5MDMzQ1wiOiBcIjI1MzItMFwiLCAvLyBcdTRFNzNcdTkxNzhcdTgxMkJcdTZDMkJcdTgxMjIgXHUyMDE0IExESCBBY3Rpdml0eSBTL1BcbiAgXCIwOTAzOENcIjogXCIxNzUxLTdcIiwgLy8gXHU3NjdEXHU4NkNCXHU3NjdEIFx1MjAxNCBBbGJ1bWluIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTM4Q1wiOiBcIjM1NjcyLTVcIiwgLy8gXHU3NkY0XHU2M0E1L1x1N0UzRFx1ODFCRFx1N0QwNVx1N0QyMFx1NkJENFx1NTAzQ1xuICBcIjEyMTEyQlwiOiBcIjE3NTEtN1wiLCAvLyBcdTc2N0RcdTg2Q0JcdTc2N0QoXHU1MTREXHU3NUFCXHU2QkQ0XHU2RkMxXHU2Q0Q1KSBcdTIwMTQgQWxidW1pbiBNYXNzL3ZvbCBTL1BcbiAgXCIyNDAwN0JcIjogXCIxOTk1LTBcIiwgLy8gXHU4ODQwXHU2RjNGXHU2RTM4XHU5NkUyXHU5MjIzIFx1MjAxNCBDYWxjaXVtIGlvbml6ZWQgTW9sZXMvdm9sIFMvUFxuICAvLyBcdTI1MDBcdTI1MDAgSG9ybW9uZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkxMjFDXCI6IFwiMjk4Ni04XCIsIC8vIFx1Nzc2QVx1NEUzOFx1OTE2Rlx1OTE4N1x1NTE0RFx1NzVBQlx1NTIwNlx1Njc5MCBcdTIwMTQgVGVzdG9zdGVyb25lIE1hc3Mvdm9sIFMvUFxuICBcIjI3MDIxQlwiOiBcIjI5OTEtOFwiLCAvLyBcdTc3NkFcdTRFMzhcdTgxMDJcdTkxODdcdTY1M0VcdTVDMDRcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IFRlc3Rvc3Rlcm9uZSBGcmVlIFMvUFxuICAvLyAwOTEyNUMgLyAwOTEyN0MgY29ycmVjdGVkIGFmdGVyIGR1YWwtcmV2aWV3ZXIgYXVkaXQgXHUyMDE0IHRoZSBlYXJsaWVyXG4gIC8vIHZhbHVlcyAoMzAxNi0zIHdhcyBUU0gsIDEwNTAxLTUgd2FzIExIKSB3ZXJlIGp1c3Qgd3JvbmcgY29weS1cbiAgLy8gcGFzdGVzLiBTb3VyY2UgZm9yIHRoZSBuZXcgdmFsdWVzOiBUV05ISUZISVIgUEFTIENvbmNlcHRNYXAuXG4gIFwiMDkxMjVDXCI6IFwiODMwOTgtNFwiLCAvLyBcdTZGRkVcdTZDRTFcdTUyM0FcdTZGQzBcdTdEMjBcdTUxNERcdTc1QUJcdTUyMDZcdTY3OTAgXHUyMDE0IEZvbGxpdHJvcGluIChGU0gpIEltbXVub2Fzc2F5IFMvUFxuICBcIjA5MTI3Q1wiOiBcIjgzMDk2LThcIiwgLy8gXHU0RThDXHU2QzJCXHU1N0ZBXHU2NjI1XHU2MEM1XHU3RDIwXHU1MTREXHU3NUFCXHU1MjA2XHU2NzkwIFx1MjAxNCBFc3RyYWRpb2wgSW1tdW5vYXNzYXkgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBUdW1vciBtYXJrZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjEyMDA3Q1wiOiBcIjE4MzQtMVwiLCAvLyBcdTAzQjEtXHU4MENFXHU1MTUyXHU4NkNCXHU3NjdEIChBRlApIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIyNzA0OUNcIjogXCIxODM0LTFcIiwgLy8gXHU3NTMyLVx1ODBDRVx1NTE1Mlx1ODZDQlx1NzY3RCAoQUZQLCBSSUEpXG4gIFwiMTIwODFDXCI6IFwiODMxMTItM1wiLCAvLyBQU0EgKEVJQS9MSUEpIFx1MjAxNCBNYXNzL3ZvbCBTL1AgSW1tdW5vYXNzYXlcbiAgXCIxMjE5OENcIjogXCI4MzExMy0xXCIsIC8vIEZyZWUgUFNBIFx1MjAxNCBNYXNzL3ZvbCBTL1AgSW1tdW5vYXNzYXlcbiAgXCIyNzA1MkNcIjogXCIyODU3LTFcIiwgLy8gXHU2NTFEXHU4Qjc3XHU4MTdBXHU3Mjc5XHU3NTcwXHU2Mjk3XHU1MzlGIChQU0EpIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgXCIyNzA4M0JcIjogXCIxMDg4Ni0wXCIsIC8vIFx1NkUzOFx1OTZFMlBTQSAoUklBKVxuICBcIjEyMDUyQlwiOiBcIjEwODczLThcIiwgLy8gXHUwM0IyMi1cdTVGQUVcdTc0MDNcdTg2Q0JcdTc2N0RcbiAgLy8gXHUyNTAwXHUyNTAwIEltbXVub2xvZ3kgLyBwcm90ZWlucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTA2NUJcIjogXCI5MDk5MS0xXCIsIC8vIFx1ODZDQlx1NzY3RFx1OTZGQlx1NkNGM1x1NTIwNlx1Njc5MFxuICBcIjEyMDI4QlwiOiBcIjE0MDAyLTBcIiwgLy8gSWdNIFx1NTVBRVx1NTQxMVx1NTE0RFx1NzVBQlx1NjRGNFx1NjU2M1xuICBcIjEyMDI5QlwiOiBcIjE0MDAyLTBcIiwgLy8gSWdNIFx1NTE0RFx1NzVBQlx1NkJENFx1NkZDMVx1NkNENVxuICBcIjEyMTAzQlwiOiBcIjk1ODAxLTdcIiwgLy8gXHU1MTREXHU3NUFCXHU5NkZCXHU2Q0YzXHU1MjA2XHU2NzkwXG4gIFwiMTIxNjBCXCI6IFwiMTUxODktNFwiLCAvLyBJZ0cgXHUwM0JBL1x1MDNCQlxuICBcIjEyMTcxQlwiOiBcIjE3MzUxLThcIiwgLy8gXHU2Mjk3XHU1NURDXHU0RTJEXHU2MDI3XHU3NDAzXHU3RDMwXHU4MERFXHU4Q0VBXHU2Mjk3XHU5QUQ0IChBTkNBKVxuICBcIjEyMjA0QlwiOiBcIjIwNTg0LTlcIiwgLy8gXHU3NjdEXHU4ODQwXHU3NDAzXHU4ODY4XHU5NzYyXHU2QTE5XHU4QTE4XG4gIFwiMjUwMTNCXCI6IFwiNDQ1OTYtNVwiLCAvLyBcdTg3QTJcdTUxNDlcdTUyMDdcdTcyNDdcdTZBQTJcdTY3RTVcbiAgLy8gXHUyNTAwXHUyNTAwIEhlcGF0aXRpcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNDAzMENcIjogXCI1MTk1LTNcIiwgLy8gSEJzQWdcbiAgXCIxNDAzMUNcIjogXCI1MTk1LTNcIiwgLy8gSEJzQWdcbiAgXCIxNDAzMkNcIjogXCI1MTk2LTFcIiwgLy8gSEJzQWcgKE1hc3Mvdm9sKVxuICBcIjE0MDUxQ1wiOiBcIjEzOTU1LTBcIiwgLy8gSENWIEFiXG4gIFwiMjcwMzNDXCI6IFwiNTE5Ny05XCIsIC8vIEhCc0FnIFJJQVxuICAvLyBcdTI1MDBcdTI1MDAgUGF0aG9sb2d5IC8gY3l0b2xvZ3kgLyBJSEMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIxOTVCXCI6IFwiMTg0NzQtN1wiLCAvLyBIZXItMi9uZXUgSVNIXG4gIFwiMjcwNjFCXCI6IFwiMTQxMzAtOVwiLCAvLyBcdTUyRDVcdTYwQzVcdTZGQzBcdTdEMjBcdTYzQTVcdTUzRDdcdTlBRDQgKEVSKVxuICBcIjI3MDYyQlwiOiBcIjEwODYxLTNcIiwgLy8gXHU5RUMzXHU5QUQ0XHU2RkMwXHU3RDIwXHU2M0E1XHU1M0Q3XHU5QUQ0IChQUilcbiAgXCIzMDEwM0JcIjogXCI4MzA1Mi0xXCIsIC8vIFBELUwxIElIQ1xuICAvLyBcdTI1MDBcdTI1MDAgQXVkaW9sb2d5IC8gcHVsbW9uYXJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE3MDA5QlwiOiBcIjI0MzQxLTBcIiwgLy8gXHU0RTAwXHU2QzI3XHU1MzE2XHU3OEIzXHU4MEJBXHU3MDMwXHU2NTYzXHU5MUNGXG4gIFwiMjIwMDFDXCI6IFwiNDU0OTgtM1wiLCAvLyBcdTdEMTRcdTk3RjNcdTgwN0RcdTUyOUJcdTZBQTJcdTY3RTVcbiAgXCIyMjAxNUJcIjogXCI0NTQ5OC0zXCIsIC8vIFx1OEE1MFx1ODA3RVx1ODA3RFx1NTI5Qlx1NkFBMlx1NjdFNVxuICBcIjIyMDI1QlwiOiBcIjQ2NTMwLTJcIiwgLy8gXHU4MUVBXHU4QTE4XHU4MDdEXHU1MjlCXHU2QUEyXHU2N0U1XG4gIC8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuICAvLyBTVVBQTEVNRU5UQUwgKG5vdCBpbiBQQVMgQ29uY2VwdE1hcCBcdTIwMTQgaGFuZC1jdXJhdGVkIGZyb20gY29tbW9uXG4gIC8vIE5ISSBjb2RlcyBzZWVuIGluIFx1NTA2NVx1NUVCN1x1NUI1OFx1NjQ3QS4gTE9JTkMgdmVyaWZpZWQgYWdhaW5zdCBsb2luYy5vcmdcbiAgLy8gY2Fub25pY2FsIG5hbWVzLiBNZXRob2Qtc3BlY2lmaWMgY29kZXMgKGUuZy4gaHMtQ1JQKSBwaWNrIHRoZVxuICAvLyBzcGVjaWZpYyBMT0lOQzsgZ2VuZXJhbC1tZXRob2QgY29kZXMgcGljayB0aGUgbW9zdCBjb21tb24gZm9ybS5cbiAgLy8gSWYgXHU1MDY1XHU0RkREXHU3RjcyIHB1Ymxpc2hlcyBhbiBhdXRob3JpdGF0aXZlIGJyb2FkZXIgQ29uY2VwdE1hcCBsYXRlcixcbiAgLy8gcmVwbGFjZSB0aGlzIHNlY3Rpb24gaW4gb25lIHBhc3MuXG4gIC8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSAvIEhiQTFjIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDA1Q1wiOiBcIjE1NTgtNlwiLCAvLyBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDYgKEdsdS1BQykgXHUyMDE0IEZhc3RpbmcgZ2x1Y29zZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTE0MENcIjogXCIyMzQ1LTdcIiwgLy8gXHU4ODQwXHU3Q0Q2LVx1OTkxMFx1NUY4Qy9cdTk2QThcdTZBNUYgXHUyMDE0IEdsdWNvc2UgTWFzcy92b2wgUy9QIChnZW5lcmFsKVxuICBcIjA5MDA2Q1wiOiBcIjQ1NDgtNFwiLCAvLyBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjAgKEhiQTFjKSBcdTIwMTQgSGVtb2dsb2JpbiBBMWMvSGdiLnRvdGFsIEJsb29kXG4gIC8vIFx1MjUwMFx1MjUwMCBSZW5hbCAvIGVsZWN0cm9seXRlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAwMkNcIjogXCIzMDk0LTBcIiwgLy8gQlVOIFx1MjAxNCBVcmVhIG5pdHJvZ2VuIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDEzQ1wiOiBcIjMwODQtMVwiLCAvLyBVcmljIEFjaWQgXHUyMDE0IFVyYXRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDIxQ1wiOiBcIjI5NTEtMlwiLCAvLyBOYSBcdTIwMTQgU29kaXVtIE1vbGVzL3ZvbCBTL1BcbiAgXCIwOTAyMkNcIjogXCIyODIzLTNcIiwgLy8gSyAgXHUyMDE0IFBvdGFzc2l1bSBNb2xlcy92b2wgUy9QXG4gIFwiMDkwMjRDXCI6IFwiMjAyOC05XCIsIC8vIENPMiBcdTIwMTQgQ2FyYm9uIGRpb3hpZGUgTW9sZXMvdm9sIFMvUFxuICBcIjA5MDEyQ1wiOiBcIjI3NzctMVwiLCAvLyBJbm9yZ2FuaWMgUCBcdTIwMTQgUGhvc3BoYXRlIE1hc3Mvdm9sIFMvUFxuICBcIjA5MDQ2QlwiOiBcIjE5MTIzLTlcIiwgLy8gTWcgXHUyMDE0IE1hZ25lc2l1bSBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIExpcGlkIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjA5MDAxQ1wiOiBcIjIwOTMtM1wiLCAvLyBULUNob2xlc3Rlcm9sIFx1MjAxNCBDaG9sZXN0ZXJvbCBNYXNzL3ZvbCBTL1BcbiAgXCIwOTAwNENcIjogXCIyNTcxLThcIiwgLy8gVEcgXHUyMDE0IFRyaWdseWNlcmlkZSBNYXNzL3ZvbCBTL1BcbiAgXCIwOTA0M0NcIjogXCIyMDg1LTlcIiwgLy8gSERMIFx1MjAxNCBIREwgY2hvbGVzdGVyb2wgTWFzcy92b2wgUy9QXG4gIFwiMDkwNDRDXCI6IFwiMTM0NTctN1wiLCAvLyBMREwgXHUyMDE0IExETCBjaG9sZXN0ZXJvbCAoY2FsY3VsYXRlZCkgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBMaXZlciBmdW5jdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTAyN0NcIjogXCI2NzY4LTZcIiwgLy8gQUxLLVAgXHUyMDE0IEFsa2FsaW5lIHBob3NwaGF0YXNlIEFjdGl2aXR5IFMvUFxuICBcIjA5MDMxQ1wiOiBcIjIzMjQtMlwiLCAvLyBcdTAzQjMtR1QgXHUyMDE0IEdhbW1hIGdsdXRhbXlsIHRyYW5zZmVyYXNlIEFjdGl2aXR5IFMvUFxuICBcIjA5MDM1Q1wiOiBcIjI1MDAtN1wiLCAvLyBUSUJDIFx1MjAxNCBJcm9uIGJpbmRpbmcgY2FwYWNpdHkgTWFzcy92b2wgUy9QXG4gIFwiMDkwMzdDXCI6IFwiMTgyNy01XCIsIC8vIEFtbW9uaWEgXHUyMDE0IFBsYXNtYVxuICBcIjA5MDY0Q1wiOiBcIjMwNDAtM1wiLCAvLyBMaXBhc2UgXHUyMDE0IEFjdGl2aXR5IFMvUFxuICBcIjA5MDU5QlwiOiBcIjE0MTE4LTRcIiwgLy8gTGFjdGF0ZSBcdTIwMTQgTWFzcy92b2wgUGxhc21hXG4gIC8vIFx1MjUwMFx1MjUwMCBIZW1hdG9sb2d5IGV4dHJhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwODAwNENcIjogXCI0NTQ0LTNcIiwgLy8gSENUIFx1MjAxNCBIZW1hdG9jcml0IHZvbHVtZSBmcmFjdGlvbiBCbG9vZFxuICBcIjA4MDA4Q1wiOiBcIjE0MTk2LTBcIiwgLy8gUmV0aWN1bG9jeXRlIFx1MjAxNCBSZXRpY3Vsb2N5dGVzLzEwMCBSQkNcbiAgXCIwODAxMENcIjogXCI3MTEtMlwiLCAvLyBFb3Npbm9waGlsIGNvdW50IFx1MjAxNCAjL3ZvbCBCbG9vZFxuICBcIjA4MDExQ1wiOiBcIjI0MzE3LTBcIiwgLy8gQ0JDIHBhbmVsIFx1MjAxNCBIZW1hdG9sb2d5IHBhbmVsIEJsb29kXG4gIFwiMDgwMjZDXCI6IFwiNjMwMS02XCIsIC8vIFBUL0lOUiBcdTIwMTQgSU5SIFBsYXRlbGV0IHBvb3IgcGxhc21hXG4gIFwiMDgwMzZDXCI6IFwiMTQ5NzktOVwiLCAvLyBBUFRUIFx1MjAxNCBQbGF0ZWxldCBwb29yIHBsYXNtYVxuICBcIjA4MDc1Q1wiOiBcIjI2OTItN1wiLCAvLyBPc21vbGFsaXR5IFx1MjAxNCBTZXJ1bSBvciBQbGFzbWFcbiAgXCIwODA3OUJcIjogXCIzMDI0MC02XCIsIC8vIEQtZGltZXIgXHUyMDE0IFBsdCBwb29yIHBsYXNtYVxuICAvLyBcdTI1MDBcdTI1MDAgVGh5cm9pZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEwNkNcIjogXCIzMDI0LTdcIiwgLy8gRnJlZSBUNCBcdTIwMTQgVGh5cm94aW5lIGZyZWUgTWFzcy92b2wgUy9QXG4gIFwiMDkxMTJDXCI6IFwiMzAxNi0zXCIsIC8vIFRTSCBcdTIwMTQgVGh5cm90cm9waW4gUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBDYXJkaWFjIG1hcmtlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDkwOTlDXCI6IFwiMTA4MzktOVwiLCAvLyBUcm9wb25pbiBJIFx1MjAxNCBUcm9wb25pbiBJIGNhcmRpYWMgUy9QXG4gIFwiMTIxOTJDXCI6IFwiMzM5NTktOFwiLCAvLyBQcm9jYWxjaXRvbmluIFx1MjAxNCBTL1BcbiAgXCIxMjE5M0NcIjogXCIzMzc2Mi02XCIsIC8vIE5ULXByb0JOUCBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBWaXRhbWlucyAvIGNvZmFjdG9ycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIwOTEyOUNcIjogXCIyMTMyLTlcIiwgLy8gVml0IEIxMiBcdTIwMTQgQ29iYWxhbWluIE1hc3Mvdm9sIFMvUFxuICBcIjA5MTMwQ1wiOiBcIjIyODQtOFwiLCAvLyBGb2xhdGUgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjA5MTEzQ1wiOiBcIjIxNDMtNlwiLCAvLyBDb3J0aXNvbCBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIxMTZDXCI6IFwiMjI3Ni00XCIsIC8vIEZlcnJpdGluIFx1MjAxNCBNYXNzL3ZvbCBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIEFjdXRlIHBoYXNlIC8gaW5mbGFtbWF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxMjAxNUMgaXMgdGhlIGdlbmVyaWMgTkhJIENSUCBvcmRlciBcdTIwMTQgbW9zdCBjbGluaWNhbCBjb250ZXh0cyBpbiBcdTUwNjVcdTRGRERcbiAgLy8gc2VuZCBhIHJlZ3VsYXIgKG5vdCBocy0pIENSUCwgc28gbWFwIHRvIDE5ODgtNS4gSWYgYSBcdTk2NjJcdTYyNDAgc3BlY2lmaWNhbGx5XG4gIC8vIGJpbGxzIGhzLUNSUCBpdCB3aWxsIGxhbmQgb24gYSBkaWZmZXJlbnQgY29kZSAoZS5nLiAxMjE4OUMpLlxuICBcIjEyMDE1Q1wiOiBcIjE5ODgtNVwiLCAvLyBDUlAgXHUyMDE0IEMgcmVhY3RpdmUgcHJvdGVpbiBNYXNzL3ZvbCBTL1BcbiAgXCIxMjA1M0NcIjogXCI1MDQ4LTRcIiwgLy8gQU5BIFx1MjAxNCBBbnRpbnVjbGVhciBBYiBUaXRlciBTL1BcbiAgXCIxMjA1NkJcIjogXCIxNjEyNC0wXCIsIC8vIEFudGktbWl0b2Nob25kcmlhbCBBYiBTL1BcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMDYwMTJDXCI6IFwiNTc3OC02XCIsIC8vIFVyaW5lIGFwcGVhcmFuY2UgXHUyMDE0IENvbG9yXG4gIFwiMDYwMTNDXCI6IFwiMjQzNTYtOFwiLCAvLyBcdTVDM0ZcdTc1MUZcdTUzMTYgcGFuZWwgXHUyMDE0IFVyaW5hbHlzaXMgbWFjcm9zY29waWMgcGFuZWxcbiAgXCIwNzAwMUNcIjogXCIxNDU2My0xXCIsIC8vIFN0b29sIG9jY3VsdCBibG9vZFxuICBcIjA5MTM0Q1wiOiBcIjU4NDUzLTJcIiwgLy8gaUZPQlQgcXVhbnRpdGF0aXZlIFx1MjAxNCBIZW1vZ2xvYmluIE1hc3Mvdm9sIFN0b29sIGJ5IElBXG4gIFwiMTIxMTFDXCI6IFwiMjE2MS04XCIsIC8vIFVyaW5lIENyZWF0aW5pbmUgXHUyMDE0IHNhbWUgTE9JTkMgYXMgMDkwMTZDXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXJvbG9neSAvIGltbXVub2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTIwMDFDXCI6IFwiNTI5Mi04XCIsIC8vIFJQUiBcdTIwMTQgU2VydW0vUGxhc21hXG4gIFwiMTIwMjFDXCI6IFwiMjAzOS02XCIsIC8vIENFQSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMjVCXCI6IFwiMjQ2NS0zXCIsIC8vIElnRyBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMjdCXCI6IFwiMjQ1OC04XCIsIC8vIElnQSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIFwiMTIwMzFDXCI6IFwiMTkxMTMtMFwiLCAvLyBJZ0UgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDY5QlwiOiBcIjUxMzItNlwiLCAvLyBDcnlwdG9jb2NjdXMgQWcgXHUyMDE0IE1hc3Mvdm9sIFMvUFxuICBcIjEyMDc5Q1wiOiBcIjI0MTA4LTNcIiwgLy8gQ0EgMTktOSBcdTIwMTQgTWFzcy92b2wgUy9QXG4gIC8vIFx1MjUwMFx1MjUwMCBCbG9vZCB0eXBlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjExMDAxQ1wiOiBcIjg4Mi0xXCIsIC8vIFx1ODg0MFx1NTc4Qlx1OTQ1MVx1NUI5QSBcdTIwMTQgQUJPICsgUmggZ3JvdXBcbiAgXCIxMTAwM0NcIjogXCI4ODItMVwiLCAvLyBcdTg4NDBcdTU3OEJcdTk0NTFcdTVCOUEgXHUyMDE0IEFCTyArIFJoIGdyb3VwXG4gIFwiMTEwMDRDXCI6IFwiODkwLTRcIiwgLy8gXHU2Mjk3XHU5QUQ0XHU1M0NEXHU2MUM5IFx1MjAxNCBBbnRpYm9keSBzY3JlZW5cbiAgLy8gXHUyNTAwXHUyNTAwIE1pY3JvYmlvbG9neSBjdWx0dXJlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gMTMwMDdDIFx1N0QzMFx1ODNDQ1x1NTdGOVx1OTkwQSBcdTIwMTQgcHJldmlvdXNseSBtYXBwZWQgdG8gTE9JTkMgMTQyMTktMCB3aGljaCBpc1xuICAvLyBhY3R1YWxseSAnSFRMViBJIHAyNiBBYiBpbiBTZXJ1bScgKHZlcmlmaWVkIGF0IGxvaW5jLm9yZykuIFRoZVxuICAvLyByaWdodCBmYW1pbHkgaXMgNjQ2My00IC8gMTEyNjgtMCAoQmFjdGVyaWEgaWRlbnRpZmllZCBieSBhZXJvYmVcbiAgLy8gY3VsdHVyZSkgYnV0IHRoZSBzb3VyY2Ugcm93IGRvZXNuJ3QgdGVsbCB1cyBzcGVjaW1lbiBcdTIwMTQgbGVhdmluZ1xuICAvLyB1bm1hcHBlZCBzbyB3ZSBkb24ndCBsaWUuIEZhbGxzIHRocm91Z2ggdG8gTkhJLWNvZGUtb25seSBjb2RpbmcuXG4gIFwiMTMwMTNDXCI6IFwiMzE5NTItNVwiLCAvLyBUQiBDdWx0dXJlIFx1MjAxNCBNeWNvYmFjdGVyaXVtIHR1YmVyY3Vsb3NpcyBjdWx0dXJlXG4gIFwiMTMwMTZCXCI6IFwiNjAwLTdcIiwgLy8gQmxvb2QgQ3VsdHVyZSBcdTIwMTQgQmFjdGVyaWEgaWRlbnRpZmllZCBpbiBCbG9vZFxuICAvLyBcdTI1MDBcdTI1MDAgVmlyb2xvZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTQwMDRCXCI6IFwiNzg0OS0zXCIsIC8vIENNViBJZ0cgXHUyMDE0IEFiIFMvUFxuICBcIjE0MDQ4QlwiOiBcIjc4NTAtMVwiLCAvLyBDTVYgSWdNIFx1MjAxNCBBYiBTL1BcbiAgXCIxNDA2NkNcIjogXCI4MDM4My0zXCIsIC8vIEluZmx1ZW56YSBBIFx1MjAxNCBBZyBSZXNwaXJhdG9yeVxuICBcIjE0MDg0Q1wiOiBcIjk0NTU4LTRcIiwgLy8gU0FSUy1Db1YtMiBBZyBcdTIwMTQgUmVzcGlyYXRvcnlcbiAgXCIxMjE4NENcIjogXCI4ODE1Ny0zXCIsIC8vIENNViBETkEgcXVhbnQgUENSIFx1MjAxNCBQbGFzbWFcbiAgLy8gXHUyNTAwXHUyNTAwIE15Y29iYWN0ZXJpdW0gLyBhY2lkLWZhc3QgKGFkZGVkIGFmdGVyIGF1ZGl0KSBcdTI1MDBcbiAgXCIxMzAyNUNcIjogXCIyOTI2MC03XCIsIC8vIFx1NjI5N1x1OTE3OFx1NjAyN1x1NkZDM1x1N0UyRVx1NjJCOVx1NzI0N1x1NjdEM1x1ODI3Mlx1NkFBMlx1NjdFNSBcdTIwMTQgTXljb2JhY3Rlcml1bSBBRkIgc3RhaW5cbiAgXCIxMzAyNkNcIjogXCIyOTU1My01XCIsIC8vIFx1NjI5N1x1OTE3OFx1ODNDQ1x1NTdGOVx1OTkwQSBcdTIwMTQgTXljb2JhY3Rlcml1bSBjdWx0dXJlIGxpcXVpZCtzb2xpZFxuICAvLyBcdTI1MDBcdTI1MDAgQUJHIHBhbmVsICgwOTA0MUIpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBJbnRlbnRpb25hbGx5IE5PVCBtYXBwZWQgaGVyZSBcdTIwMTQgMDkwNDFCIGlzIGEgcGFuZWwgb3JkZXIgdGhhdFxuICAvLyB1bmZvbGRzIGludG8gbWFueSBpdGVtcyAocEggLyBwQ08yIC8gcE8yIC8gSENPMyAvIFRDTzIgLyBTQkUgL1xuICAvLyBBQkUgLyBTQkMgLyBTQVQpLiBNYXBwaW5nIHRoZSBwYW5lbCBjb2RlIHRvIFwicEhcIiB3b3VsZCBtaXMtbGFiZWxcbiAgLy8gZXZlcnkgbm9uLXBIIHJvdyB0aGF0IHNoYXJlcyB0aGlzIE5ISSBjb2RlLiBFYWNoIGl0ZW0gaXNcbiAgLy8gcmVzb2x2ZWQgdmlhIF9MT0lOQ19NQVAgZGlzcGxheS1rZXl3b3JkIGZhbGxiYWNrIGJlbG93OyAwOTA0MUJcbiAgLy8gYWxzbyBhcHBlYXJzIGluIF9ESVNQTEFZX0ZJUlNUX0NPREVTIHNvIGRpc3BsYXkgYWx3YXlzIHdpbnMuXG4gIC8vIFx1MjUwMFx1MjUwMCBCb2R5IGZsdWlkIC8gc3lub3ZpYWwgZmx1aWQgcGFuZWwgKDE2MDA4QyB1bmZvbGRzOyB0aGVcbiAgLy8gbWVtYmVyIGl0ZW1zIHJlbHkgb24gZGlzcGxheSBrZXl3b3JkcyBmb3Igc3BlY2ltZW4tYXdhcmVcbiAgLy8gTE9JTkNzKS4gUGFyZW50IGNvZGUgbWFwcyB0byBzeW5vdmlhbCBmbHVpZCBhbmFseXNpcyBwYW5lbC4gXHUyNTAwXHUyNTAwXG4gIC8vIDE2MDA4QyBcdTZFRDFcdTZEQjJcdTZBQTJcdTY3RTUgXHUyMDE0IHByZXZpb3VzbHkgbWFwcGVkIHRvIExPSU5DIDMzOTAzLTYgd2hpY2ggaXNcbiAgLy8gYWN0dWFsbHkgJ0tldG9uZXMgW1ByZXNlbmNlXSBpbiBVcmluZScgKHZlcmlmaWVkIGxvaW5jLm9yZykuXG4gIC8vIExlYXZpbmcgdW5tYXBwZWQ7IHRoZSBwYW5lbCBmYWxscyB0aHJvdWdoIHRvIE5ISS1jb2Rpbmcgb25seVxuICAvLyBhbmQgdGhlIHBlci1pdGVtIGRpc3BsYXlzIGluIF9MT0lOQ19NQVAgY2FycnkgdGhlaXIgb3duIExPSU5Dc1xuICAvLyB3aGVyZSBrbm93bi5cbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfRElTUExBWV9GSVJTVF9DT0RFUyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIE5ISSBjb2RlcyB0aGF0IGFyZSAqcGFuZWxzKiBcdTIwMTQgb25lIGJpbGxpbmcgY29kZSwgbWFueSBpdGVtLXNwZWNpZmljXG4vLyBkaXNwbGF5cy4gRm9yIHRoZXNlLCBkaXNwbGF5IGtleXdvcmQgTVVTVCBiZSB0cmllZCBmaXJzdCAoc28gXCJXQkNcIlxuLy8gdW5kZXIgQ0JDIHBhbmVsIDA4MDExQyBnZXRzIDY2OTAtMiwgbm90IHRoZSBnZW5lcmljIHBhbmVsIExPSU5DKS5cbi8vIEZvciBldmVyeXRoaW5nIGVsc2UgKHNpbmdsZS10ZXN0IGNvZGVzIGxpa2UgMDkwMDVDIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENixcbi8vIDA5MDQ0QyBMREwsIDE0MDMwQyBIQnNBZyksIHRoZSBOSEkgY29kZSBpcyBtb3JlIHNwZWNpZmljIHRoYW4gYW55XG4vLyBkaXNwbGF5IGtleXdvcmQgYW5kIHdpbnMgb3V0cmlnaHQuXG4vL1xuLy8gREVTSUdOIFBISUxPU09QSFk6IHRoZSBicmlkZ2UgaXMgYSAqZmFpdGhmdWwgdHJhbnNwb3J0KiBsYXllciBcdTIwMTQgaXRcbi8vIHRydXN0cyB0aGUgXHU1MDY1XHU0RkREIGJpbGxpbmcgY29kZSBhcyBhdXRob3JpdGF0aXZlIGZvciBjbGluaWNhbCBpbnRlbnRcbi8vIChcdTk2NjJcdTYyNDAgYmlsbGVkIDA5MDA1QyA9IHRoZXkgb3JkZXJlZCBmYXN0aW5nIGdsdWNvc2UsIHJlZ2FyZGxlc3Mgb2Zcbi8vIHdoZXRoZXIgdGhlIG9wZXJhdGlvbmFsIHNwZWNpbWVuIHdhcyBhIGZpbmdlci1zdGljaykuIERpc3BsYXktc3RyaW5nXG4vLyByZS1pbnRlcnByZXRhdGlvbiBvZiBjbGluaWNhbCBjb250ZXh0IChHbHUtQUMgdnMgRklOR0VSIFNVR0FSIHZzXG4vLyByYW5kb20pIGlzIGxlZnQgdG8gdGhlIFNNQVJUIGFwcCwgd2hpY2ggaGFzIG1vcmUgVUkgY29udGV4dC5cbmV4cG9ydCBjb25zdCBESVNQTEFZX0ZJUlNUX0NPREVTOiBSZWFkb25seVNldDxzdHJpbmc+ID0gbmV3IFNldChbXG4gIFwiMDgwMTFDXCIsIC8vIENCQyBwYW5lbFxuICBcIjA4MDEzQ1wiLCAvLyBDQkMgdy8gYXV0byBkaWZmIHBhbmVsXG4gIFwiMDYwMTNDXCIsIC8vIFVyaW5hbHlzaXMgbWFjcm9zY29waWMgcGFuZWxcbiAgXCIwOTA0MUJcIiwgLy8gQUJHIHBhbmVsXG4gIFwiMTYwMDhDXCIsIC8vIFN5bm92aWFsIC8gYm9keS1mbHVpZCBwYW5lbFxuXSk7XG5cbi8vIFx1MjUwMFx1MjUwMCBfUEFORUxfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gUGFuZWwtc3BlY2lmaWMgZGlzcGxheSBcdTIxOTIgTE9JTkMgb3ZlcnJpZGVzLiBUaGVzZSBydW4gQkVGT1JFIHRoZSBnbG9iYWxcbi8vIF9MT0lOQ19NQVAgc28gdGhhdCB1cmluZSBiaWxpcnViaW4gdW5kZXIgMDYwMTNDIG1hcHMgdG8gNTc3MC0zICh1cmluZVxuLy8gc3BlY2ltZW4pIGluc3RlYWQgb2YgYmVpbmcgc2hhZG93ZWQgYnkgdGhlIGdsb2JhbCAnYmlsaXJ1YmluJyB0aGF0XG4vLyB3b3VsZCBpbXBseSBzZXJ1bSwgYW5kIGFuYWxvZ291cyBzcGVjaW1lbi1hd2FyZSBkaXNhbWJpZ3VhdGlvbiBmb3Jcbi8vIG90aGVyIHBhbmVsIHN1Yi1pdGVtcy4gS2V5cyBhcmUgTkhJIHBhbmVsIGNvZGVzIChtdXN0IGFsc28gYmUgaW5cbi8vIF9ESVNQTEFZX0ZJUlNUX0NPREVTKTsgdmFsdWVzIGFyZSBkaXNwbGF5LWtleXdvcmQgXHUyMTkyIExPSU5DIGRpY3RzIHRoYXRcbi8vIGZvbGxvdyB0aGUgc2FtZSBtYXRjaGluZyBzZW1hbnRpY3MgYXMgX0xPSU5DX01BUCAobGVhZGluZyB3b3JkXG4vLyBib3VuZGFyeSBmb3IgQVNDSUksIHN1YnN0cmluZyBmb3IgQ0pLKS5cbmV4cG9ydCBjb25zdCBQQU5FTF9MT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+ID0ge1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gQWxsIHJvdXRpbmUgZGlwc3RpY2sgaXRlbXMgcmVzaWRlIG9uIGEgc2luZ2xlIE5ISSBiaWxsaW5nIGNvZGUuXG4gIC8vIFdpdGhvdXQgdGhpcyB0YWJsZSB0aGV5J2QgYWxsIGNvbGxhcHNlIHRvIHRoZSBwYW5lbCBMT0lOQyAyNDM1Ni04LFxuICAvLyBsb3NpbmcgcGVyLWl0ZW0gZ3JhbnVsYXJpdHkgdGhhdCdzIGNsaW5pY2FsbHkgdXNlZnVsIChlLmcuXG4gIC8vIGJpbGlydWJpbiB2cyB1cm9iaWxpbm9nZW4gZm9yIGxpdmVyIHdvcmt1cCkuXG4gIFwiMDYwMTNDXCI6IHtcbiAgICAvLyBPcmRlciBtYXR0ZXJzOiBsb25nZXIvbW9yZS1zcGVjaWZpYyBrZXlzIGJlZm9yZSBnZW5lcmljIG9uZXNcbiAgICAvLyAobWF0Y2hlcyBfTE9JTkNfTUFQIGl0ZXJhdGlvbiBzZW1hbnRpY3MgXHUyMDE0IGZpcnN0IGhpdCB3aW5zKS5cbiAgICBcInNwZWNpZmljIGdyYXZpdHlcIjogXCI1ODExLTVcIiwgLy8gU3BlY2lmaWMgZ3Jhdml0eSBVcmluZVxuICAgIFwic3AuZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFwic3AgZ3Jhdml0eVwiOiBcIjU4MTEtNVwiLFxuICAgIFx1NkJENFx1OTFDRDogXCI1ODExLTVcIixcbiAgICBcIm1pY3JvLWFsYnVtaW5cIjogXCIxNDk1Ny01XCIsIC8vIE1pY3JvYWxidW1pbiBNYXNzL3ZvbCBVcmluZVxuICAgIG1pY3JvYWxidW1pbjogXCIxNDk1Ny01XCIsXG4gICAgXCJtYWxiKHUpXCI6IFwiMTQ5NTctNVwiLFxuICAgIG1hbGI6IFwiMTQ5NTctNVwiLFxuICAgIFx1NUZBRVx1NUMwRlx1NzY3RFx1ODZDQlx1NzY3RDogXCIxNDk1Ny01XCIsXG4gICAgdWFjcjogXCIxNDk1OS0xXCIsIC8vIE1pY3JvYWxidW1pbi9DcmVhdGluaW5lIHJhdGlvIFVyaW5lXG4gICAgXCJ1cmluZSBnbHVjb3NlXCI6IFwiNTc5Mi03XCIsXG4gICAgc3VnYXI6IFwiNTc5Mi03XCIsIC8vIE5ISSAnXHU1QzNGXHU3Q0Q2JyAvICdTdWdhcicgdW5kZXIgMDYwMTNDXG4gICAgXHU1QzNGXHU3Q0Q2OiBcIjU3OTItN1wiLFxuICAgIHVyb2JpbGlub2dlbjogXCI1ODE4LTBcIiwgLy8gVXJvYmlsaW5vZ2VuIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDIwXHU1MzlGOiBcIjU4MTgtMFwiLFxuICAgIGJpbGlydWJpbjogXCI1NzcwLTNcIiwgLy8gQmlsaXJ1YmluIFVyaW5lIFFsXG4gICAgXHU1QzNGXHU4MUJEXHU3RDA1XHU3RDIwOiBcIjU3NzAtM1wiLFxuICAgIG5pdHJpdGU6IFwiNTgwMi00XCIsIC8vIE5pdHJpdGUgVXJpbmVcbiAgICBcdTRFOUVcdTc4NURcdTkxNzg6IFwiNTgwMi00XCIsXG4gICAga2V0b25lczogXCI1Nzk3LTZcIiwgLy8gS2V0b25lcyBVcmluZVxuICAgIGtldG9uZTogXCI1Nzk3LTZcIixcbiAgICBcdTkxNkVcdTlBRDQ6IFwiNTc5Ny02XCIsXG4gICAgcHJvdGVpbjogXCIyMDQ1NC01XCIsIC8vIFByb3RlaW4gTWFzcy92b2wgVXJpbmVcbiAgICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAgIFx1ODZDQlx1NzY3RDogXCIyMDQ1NC01XCIsXG4gICAgbGV1a29jeXRlOiBcIjU3OTktMlwiLCAvLyBMZXVrb2N5dGVzIFVyaW5lXG4gICAgbGV1OiBcIjU3OTktMlwiLFxuICAgIFx1NzY3RFx1ODg0MFx1NzQwM1x1OTE2Rlx1OTE3NjogXCI1Nzk5LTJcIixcbiAgICBibG9vZDogXCI1Nzk0LTNcIiwgLy8gSGVtb2dsb2JpbiBVcmluZSBRbFxuICAgIFx1NkY1Qlx1ODg0MDogXCI1Nzk0LTNcIixcbiAgICBcdTgyNzI6IFwiNTc3OC02XCIsIC8vIENvbG9yIG9mIFVyaW5lIChDSksgc3Vic3RyaW5nKVxuICAgIGNvbG9yOiBcIjU3NzgtNlwiLFxuICAgIHR1cmJpZGl0eTogXCI1NzY3LTlcIiwgLy8gQXBwZWFyYW5jZSBvZiBVcmluZVxuICAgIGFwcGVhcmFuY2U6IFwiNTc2Ny05XCIsXG4gICAgXHU1OTE2XHU4OUMwOiBcIjU3NjctOVwiLFxuICAgIHBoOiBcIjU4MDMtMlwiLCAvLyBwSCBvZiBVcmluZSAodXJpbmUtc3BlY2lmaWMsIE5PVFxuICAgIC8vIHRoZSBhcnRlcmlhbCAxMTU1OC00IHRoYXQgdGhlXG4gICAgLy8gZ2xvYmFsIG1hcCBwb2ludHMgdG8pXG4gICAgXHU5MTc4XHU5RTdDXHU1RUE2OiBcIjU4MDMtMlwiLFxuICAgIGdsdWNvc2U6IFwiNTc5Mi03XCIsIC8vIExhc3QgaW4gdGhpcyBibG9jayBzbyAndXJpbmVcbiAgfSxcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBfTE9JTkNfTUFQIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ29tbW9uIFRhaXdhbmVzZSBISVMgbGFiIG5hbWVzIFx1MjE5MiBMT0lOQyBjb2RlIG1hcHBpbmdcbmV4cG9ydCBjb25zdCBMT0lOQ19NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBHbHVjb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBEaXNwbGF5LWtleXdvcmQgZmFsbGJhY2sgb25seSBraWNrcyBpbiB3aGVuIE5PIE5ISSBjb2RlIGlzXG4gIC8vIHByZXNlbnQgKGRhc2hib2FyZCByb3dzLCBMTE0tZXh0cmFjdGVkIHRleHQpLiBXaGVuIHRoZSBOSEkgY29kZVxuICAvLyBJUyBwcmVzZW50LCAwOTAwNUMgXHUyMTkyIDE1NTgtNiAoRmFzdGluZykgYW5kIDA5MTQwQyBcdTIxOTIgMjM0NS03XG4gIC8vIChnZW5lcmljKSB3aW5zIGRpcmVjdGx5IHZpYSBfTkhJX1RPX0xPSU5DLlxuICAvL1xuICAvLyBGYWl0aGZ1bC10cmFuc3BvcnQgcHJpbmNpcGxlOiB0aGUgYnJpZGdlIGRvZXMgTk9UIHJlLWludGVycHJldFxuICAvLyBkaXNwbGF5IHN0cmluZ3MgbGlrZSBcIkZJTkdFUiBTVUdBUlwiIGFzIGEgZGlmZmVyZW50IExPSU5DIFx1MjAxNCBpdFxuICAvLyBwcmVzZXJ2ZXMgdGhlIHJhdyBkaXNwbGF5IGluIGBjb2RlLnRleHRgIGFuZCB0aGUgb3JpZ2luYWwgTkhJXG4gIC8vIGNvZGUgaW4gYGNvZGUuY29kaW5nYC4gVGhlIFNNQVJUIGFwcCBkb2VzIHNwZWNpbWVuL21ldGhvZC1hd2FyZVxuICAvLyBncm91cGluZyBvbiB0aGUgY29uc3VtZXIgc2lkZSAoc2VlIFNNQVJUIGFwcCBoYW5kb2ZmIGRvYykuXG4gIFwiZmFzdGluZyBnbHVjb3NlXCI6IFwiMTU1OC02XCIsXG4gIFx1N0E3QVx1ODE3OVx1ODg0MFx1N0NENjogXCIxNTU4LTZcIixcbiAgXCJnbHUtYWNcIjogXCIxNTU4LTZcIixcbiAgXCJnbHVjb3NlIGFjXCI6IFwiMTU1OC02XCIsXG4gIGdsdWNvc2U6IFwiMjM0NS03XCIsXG4gIFx1ODg0MFx1N0NENjogXCIyMzQ1LTdcIixcbiAgZ2x1OiBcIjIzNDUtN1wiLFxuICAvLyBIYkExYyBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyBcImhiXCIgZW50cmllcyBzbyB0aGUgbG9uZ2VzdC1wcmVmaXhcbiAgLy8gbWF0Y2ggd2lucyBmb3IgdGhlIFwiSGJBMWNcIiBkaXNwbGF5IHN0cmluZy4gT3RoZXIgQTFjIHN5bm9ueW1zXHUyMDI2XG4gIGhiYTFjOiBcIjQ1NDgtNFwiLFxuICBcdTkxQTNcdTUzMTZcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNDU0OC00XCIsXG4gIGExYzogXCI0NTQ4LTRcIixcbiAgaGVtb2dsb2JpbjogXCI3MTgtN1wiLFxuICBcdTg4NDBcdTdEMDVcdTdEMjA6IFwiNzE4LTdcIixcbiAgaGdiOiBcIjcxOC03XCIsXG4gIGhiOiBcIjcxOC03XCIsXG4gIC8vIENCQyBkaWZmIFx1MjAxNCBlb3Npbm9waGlsIGNvdW50IG11c3QgcHJlY2VkZSB0aGUgYmFyZSAnd2JjJy8nXHU3NjdEXHU4ODQwXHU3NDAzJ1xuICAvLyBrZXlzICh3aGljaCB3b3VsZCBvdGhlcndpc2Ugd2luIGFzIHN1YnN0cmluZ3MpLlxuICAvLyA3MTEtMiB2ZXJpZmllZCBhdCBsb2luYy5vcmc6ICdFb3Npbm9waGlscyBbIy92b2x1bWVdIGluIEJsb29kXG4gIC8vIGJ5IEF1dG9tYXRlZCBjb3VudCcuXG4gIFx1NTVEQ1x1OTE3OFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCI3MTEtMlwiLFxuICBcdTU1RENcdTRGMEFcdTdEMDVcdTYwMjdcdTc2N0RcdTg4NDBcdTc0MDM6IFwiNzExLTJcIixcbiAgZW9zaW5vcGhpbDogXCI3MTEtMlwiLFxuICBlb3Npbm9waGlsczogXCI3MTEtMlwiLFxuICB3YmM6IFwiNjY5MC0yXCIsXG4gIFx1NzY3RFx1ODg0MFx1NzQwMzogXCI2NjkwLTJcIixcbiAgcGxhdGVsZXQ6IFwiNzc3LTNcIixcbiAgXHU4ODQwXHU1QzBGXHU2NzdGOiBcIjc3Ny0zXCIsXG4gIHBsdDogXCI3NzctM1wiLFxuICAvLyBSQkMgKyBSQkMgaW5kaWNlcyBcdTIwMTQgdmVyaWZpZWQgTE9JTkNzIChsb2luYy5vcmcpOlxuICAvLyA3ODktOCAgRXJ5dGhyb2N5dGVzICMvdm9sIEJsb29kIEF1dG8gICAgICAgICAgICAgIFx1MjE5MiBSQkNcbiAgLy8gNzg1LTYgIEVyeXRocm9jeXRlIG1lYW4gY29ycHVzY3VsYXIgaGVtb2dsb2JpbiAgICBcdTIxOTIgTUNIXG4gIC8vIExvbmcgQ0pLIGZvcm1zIGZpcnN0IChMREwvY2hvbGVzdGVyb2wgcGF0dGVybikgc28gJ1x1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1xuICAvLyBcdTg4NDBcdTgyNzJcdTdEMjAnIHdpbnMgb3ZlciBcdTdEMDVcdTg4NDBcdTc0MDMuXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMDogXCI3ODUtNlwiLFxuICByYmM6IFwiNzg5LThcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzOiBcIjc4OS04XCIsXG4gIG1jaDogXCI3ODUtNlwiLFxuICAvLyBVcmluZSBjcmVhdGluaW5lIFx1MjAxNCBNVVNUIGFwcGVhciBiZWZvcmUgZ2VuZXJpYyAnY3JlYXRpbmluZScgc29cbiAgLy8gcm93cyBsaWtlICdVLUNSRSBcdTVDM0ZcdTZEQjJcdTgwOENcdTkxNzhcdTkxNTAnIG9yICdDcmVhdGluaW5lKFUpJyByZXNvbHZlIHRvIHRoZVxuICAvLyB1cmluZSBMT0lOQyAoMjE2MS04KSBpbnN0ZWFkIG9mIGJlaW5nIHNoYWRvd2VkIGJ5IHRoZSBzZXJ1bVxuICAvLyBkZWZhdWx0ICgyMTYwLTApLiBTYW1lIGxvbmdlc3Qtc3BlY2lmaWMtZmlyc3Qgb3JkZXJpbmcgYXNcbiAgLy8gdGhlIGZhc3RpbmctdnMtcmFuZG9tIGdsdWNvc2UgYmxvY2suXG4gIFwidXJpbmUgY3JlYXRpbmluZVwiOiBcIjIxNjEtOFwiLFxuICBcImNyZWF0aW5pbmUgdXJpbmVcIjogXCIyMTYxLThcIixcbiAgXCJjcmVhdGluaW5lKHUpXCI6IFwiMjE2MS04XCIsXG4gIFwidS1jcmVcIjogXCIyMTYxLThcIixcbiAgXCJ1LWNyZWFcIjogXCIyMTYxLThcIixcbiAgXHU1QzNGXHU2REIyXHU4MDhDXHU5MTc4XHU5MTUwOiBcIjIxNjEtOFwiLFxuICBjcmVhdGluaW5lOiBcIjIxNjAtMFwiLFxuICBcdTgwOENcdTkxNzhcdTkxNTA6IFwiMjE2MC0wXCIsXG4gIFx1ODA4Q1x1OTE1MFx1OTE3ODogXCIyMTYwLTBcIiwgLy8gVGFpd2FuIHZhcmlhbnQgc3BlbGxpbmdcbiAgY3JlYTogXCIyMTYwLTBcIixcbiAgYnVuOiBcIjMwOTQtMFwiLFxuICBcdTVDM0ZcdTdEMjBcdTZDMkU6IFwiMzA5NC0wXCIsXG4gIGFzdDogXCIxOTIwLThcIixcbiAgYWx0OiBcIjE3NDItNlwiLFxuICBmZXJyaXRpbjogXCIyMjc2LTRcIixcbiAgXHU4ODQwXHU2RTA1XHU5NDM1XHU4NkNCXHU3NjdEOiBcIjIyNzYtNFwiLFxuICBmZXJyOiBcIjIyNzYtNFwiLFxuICAvLyBWaXRhbC1zaWducyBmcm9tIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NSAoSUhLRTM0MDIpIFx1MjAxNCBzZXBhcmF0ZSBjb2RlIG5hbWVzcGFjZVxuICAvLyBidXQgdGhlIGxvb2t1cCBpcyBieSBkaXNwbGF5LW5hbWUgc3Vic3RyaW5nLCBzYW1lIGFzIGZvciBsYWJzLlxuICBcImJvZHkgaGVpZ2h0XCI6IFwiODMwMi0yXCIsXG4gIFwiYm9keSB3ZWlnaHRcIjogXCIyOTQ2My03XCIsXG4gIGJtaTogXCIzOTE1Ni01XCIsXG4gIC8vIFdhaXN0IGNpcmN1bWZlcmVuY2UgXHUyMDE0IG1lYXN1cmVtZW50IExPSU5DICg4MjgwLTApLiA1NjA4Ni0yIGlzXG4gIC8vIHRoZSAnQWR1bHQgV2Fpc3QgQ2lyY3VtZmVyZW5jZSBQcm90b2NvbCcgY29kZSwgd2hpY2ggaXMgYVxuICAvLyBzdXJ2ZXkvcHJvdG9jb2wgZGVzY3JpcHRvciwgTk9UIGEgbnVtZXJpYyBtZWFzdXJlbWVudFxuICAvLyAodmVyaWZpZWQgYXQgbG9pbmMub3JnKS4gTkhJIFx1NTA2NVx1NEZERCByZXBvcnRzIGEgc2luZ2xlIHdhaXN0bGluZVxuICAvLyBudW1iZXIgcGVyIHZpc2l0LCBzbyB0aGUgbWVhc3VyZW1lbnQgY29kZSBpcyBjb3JyZWN0LlxuICBcIndhaXN0IGNpcmN1bWZlcmVuY2VcIjogXCI4MjgwLTBcIixcbiAgXCJzeXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0ODAtNlwiLFxuICBcImRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiOiBcIjg0NjItNFwiLFxuICAvLyBMaXBpZCBwYW5lbCBcdTIwMTQgT1JERVIgTUFUVEVSUy4gTERML0hETCB2YXJpYW50cyBNVVNUIHByZWNlZGUgdGhlXG4gIC8vIGdlbmVyaWMgJ2Nob2xlc3Rlcm9sJyBrZXkgc28gYSByb3cgbGFiZWxsZWQgJ0xETCBDSE9MRVNURVJPTCdcbiAgLy8gcmVzb2x2ZXMgdG8gMTM0NTctNyAoTERMIGNhbGN1bGF0ZWQpIGFuZCAnSERMIENIT0xFU1RFUk9MJyB0b1xuICAvLyAyMDg1LTksIGluc3RlYWQgb2YgZmFsbGluZyB0byAyMDkzLTMgKHRvdGFsIGNob2xlc3Rlcm9sKSB2aWEgdGhlXG4gIC8vICdjaG9sZXN0ZXJvbCcgc3Vic3RyaW5nLiBTYW1lIGNhbm9uaWNhbCBvcmRlcmluZyBhcyBfTEFCX1NZTk9OWU1TLlxuICBcImxkbCBjaG9sZXN0ZXJvbFwiOiBcIjEzNDU3LTdcIixcbiAgXCJsZGwtY2hvbGVzdGVyb2xcIjogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIxMzQ1Ny03XCIsXG4gIC8vIDEzNDU3LTcgPSBMREwgY2hvbGVzdGVyb2wgKGNhbGN1bGF0ZWQpIFx1MjAxNCBtYXRjaGVzIHRoZSBOSEkgMDkwNDRDXG4gIC8vIGJpbGxpbmcgY29kZSdzIGludGVudCAoVGFpd2FuIGxhYnMgcHJlZG9taW5hbnRseSByZXBvcnQgY2FsY3VsYXRlZFxuICAvLyBMREwgdmlhIEZyaWVkZXdhbGQpLiBLZWVwIGNvbnNpc3RlbnQgd2l0aCBfTkhJX1RPX0xPSU5DW1wiMDkwNDRDXCJdLlxuICBcImxkbC1jXCI6IFwiMTM0NTctN1wiLFxuICBsZGw6IFwiMTM0NTctN1wiLFxuICBcImhkbCBjaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcImhkbC1jaG9sZXN0ZXJvbFwiOiBcIjIwODUtOVwiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA4NS05XCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCIyMDg1LTlcIixcbiAgXCJoZGwtY1wiOiBcIjIwODUtOVwiLFxuICBoZGw6IFwiMjA4NS05XCIsXG4gIC8vIFRvdGFsIGNob2xlc3Rlcm9sIFx1MjAxNCBiYXJlICdjaG9sZXN0ZXJvbCcgb25seSBmaXJlcyBBRlRFUiB0aGVcbiAgLy8gTERML0hETC1wcmVmaXhlZCB2YXJpYW50cyBhYm92ZSBoYXZlIGJlZW4gY2hlY2tlZC5cbiAgXCJ0b3RhbCBjaG9sZXN0ZXJvbFwiOiBcIjIwOTMtM1wiLFxuICBcInQtY2hvbGVzdGVyb2xcIjogXCIyMDkzLTNcIixcbiAgXHU4ODQwXHU2RTA1XHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIjIwOTMtM1wiLFxuICBcdTdFM0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiMjA5My0zXCIsXG4gIGNob2xlc3Rlcm9sOiBcIjIwOTMtM1wiLFxuICB0cmlnbHljZXJpZGU6IFwiMjU3MS04XCIsXG4gIFx1NEUwOVx1OTE3OFx1NzUxOFx1NkNCOVx1OTE2RjogXCIyNTcxLThcIixcbiAgXCJ1cmljIGFjaWRcIjogXCIzMDg0LTFcIixcbiAgZWdmcjogXCIzMzkxNC0zXCIsXG4gIGhic2FnOiBcIjUxOTYtMVwiLFxuICBcImFudGktaGN2XCI6IFwiMTYxMjgtMVwiLFxuICAvLyBVcmluZSBwcm90ZWluIChkaXNwbGF5IGZhbGxiYWNrIGZvciB0aGUgbm8tTkhJLWNvZGUgcGF0aCB0aGF0XG4gIC8vIGNvbWVzIGZyb20gSUhLRTM0MDIgdml0YWxzICsgYWR1bHQtcHJldmVudGl2ZSBzdXBwbGVtZW50cykuXG4gIFwidXJpbmUgcHJvdGVpblwiOiBcIjIwNDU0LTVcIiwgLy8gUHJvdGVpbiBNYXNzL3ZvbCBVcmluZVxuICBcInUtcHJvXCI6IFwiMjA0NTQtNVwiLFxuICBcdTVDM0ZcdTg2Q0JcdTc2N0Q6IFwiMjA0NTQtNVwiLFxuICAvLyBBQkcgcGFuZWwgY29tcG9uZW50cyBcdTIwMTQgMDkwNDFCIHBhcmVudCBjb2RlIGluIE5ISV9UT19MT0lOQzsgZWFjaFxuICAvLyBtZW1iZXIncyBkaXNwbGF5IChcInBDTzJcIiwgXCJwTzJcIiwgXCJIQ08zXCIsIFwiVENPMlwiLCBcIlNCRS9BQkVcIixcbiAgLy8gXCJTQkNcIiwgXCJTQVRcIiAvIFwiU2FPMlwiKSBmYWxscyB0byBpdHMgb3duIExPSU5DLlxuICAvLyBwSCBNVVNUIGNvbWUgYmVmb3JlIHBjbzIvcG8yIHNvIHRoZSBiYXJlIFwicEhcIiBkaXNwbGF5IGxhbmRzIGhlcmUuXG4gIHBoOiBcIjExNTU4LTRcIiwgLy8gcEggb2YgQXJ0ZXJpYWwgYmxvb2RcbiAgcGNvMjogXCIyMDE5LThcIiwgLy8gQ2FyYm9uIGRpb3hpZGUgcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgcG8yOiBcIjI3MDMtN1wiLCAvLyBPeHlnZW4gcHAgaW4gQXJ0ZXJpYWwgYmxvb2RcbiAgaGNvMzogXCIxOTU5LTZcIiwgLy8gQmljYXJib25hdGUgTW9sZXMvdm9sIEFydGVyaWFsXG4gIGJpY2FyYm9uYXRlOiBcIjE5NTktNlwiLFxuICB0Y28yOiBcIjIwMjgtOVwiLCAvLyBUb3RhbCBDTzIgTW9sZXMvdm9sIEFydGVyaWFsXG4gIHNiZTogXCIxMTU1NS0wXCIsIC8vIFN0YW5kYXJkIGJhc2UgZXhjZXNzIEFydGVyaWFsXG4gIGFiZTogXCIxMTU1NS0wXCIsXG4gIHNiYzogXCIxOTI1LTdcIiwgLy8gU3RhbmRhcmQgYmljYXJib25hdGUgQXJ0ZXJpYWxcbiAgc2F0dXJhdDogXCIyNzEzLTZcIiwgLy8gTzIgc2F0dXJhdGlvbiBBcnRlcmlhbFxuICBzYW8yOiBcIjI3MTMtNlwiLFxuICBzYXQ6IFwiMjcxMy02XCIsIC8vIE5ISSBkaXNwbGF5IHNob3dzIGp1c3QgXCJTQVRcIlxuICAvLyBTeW5vdmlhbCAvIGJvZHktZmx1aWQgY29tcG9uZW50cyAoMTYwMDhDIHBhcmVudCBhYm92ZSkuXG4gIFwic2YuY29sb3JcIjogXCI1Nzc4LTZcIiwgLy8gQ29sb3Igb2YgQm9keSBmbHVpZCAocmV1c2UgVXJpbmUgY29sb3Igc3BlYyBPSylcbiAgLy8gTk9URTogODI1NS0yIC8gMTM5NDgtNSBwcmV2aW91c2x5IGxpc3RlZCBoZXJlIGJvdGggdHVybmVkIG91dFxuICAvLyB0byBiZSB1bnJlbGF0ZWQgTE9JTkNzICh2ZXJpZmllZCBsb2luYy5vcmcgXHUyMDE0IDgyNTUtMiBpc1xuICAvLyAnU2VydmljZSBjb21tZW50IDEzJywgMTM5NDgtNSBpcyAnQ29jY2lkaW9pZGVzIGltbWl0aXMgSWdNXG4gIC8vIEFiJykuIEJvZHktZmx1aWQgQXBwZWFyYW5jZSAvIFJCQyBkb24ndCBoYXZlIHdlbGwtYXR0ZXN0ZWRcbiAgLy8gTE9JTkNzIGluIG91ciB0YWJsZSB5ZXQgXHUyMDE0IGZhbGxpbmcgdGhyb3VnaCB0byBjb2RlLnRleHQtb25seVxuICAvLyBpcyBzYWZlciB0aGFuIGVtaXR0aW5nIGEgbWlzbGVhZGluZyBMT0lOQy4gVG8gYWRkIGxhdGVyLFxuICAvLyB2ZXJpZnkgZWFjaCBhZ2FpbnN0IGxvaW5jLm9yZyBmaXJzdC5cbiAgXCJzZi53YmNcIjogXCIyNjQ2Ni0zXCIsIC8vIFdCQyAjL3ZvbCBCb2R5IGZsdWlkXG4gIFwic2YubmV1dHJvcGhpbFwiOiBcIjEwMzI4LTZcIiwgLy8gTmV1dHJvcGhpbHMvMTAwIGxldWtvY3l0ZXMgaW4gQm9keSBmbHVpZFxuICBcInNmLmx5bXBob1wiOiBcIjEzMDQ2LThcIiwgLy8gTHltcGhvY3l0ZXMgIy92b2wgQm9keSBmbHVpZFxufTtcblxuLy8gXHUyNTAwXHUyNTAwIF9MT0lOQ19ESVNQTEFZIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ2Fub25pY2FsIEVuZ2xpc2ggZGlzcGxheSBuYW1lcyBmb3IgTE9JTkMgY29kZXMgdGhlIGJyaWRnZSBlbWl0cy5cbi8vIEZhbGxzIGJhY2sgdG8gdGhlIHJhdyBpbnB1dCBkaXNwbGF5IHdoZW4gYSBMT0lOQyBpc24ndCBsaXN0ZWQgaGVyZS5cbi8vIFNvdXJjZWQgZnJvbSBsb2luYy5vcmcgY2Fub25pY2FsIHNob3J0IG5hbWVzIHdoZXJlIGFwcGxpY2FibGUuXG4vLyBBZGQgbmV3IGVudHJpZXMgYXMgd2Ugd2lkZW4gTE9JTkMgY292ZXJhZ2UgXHUyMDE0IHRoZSBsb29rdXAgaXMga2V5ZWQgb25cbi8vIExPSU5DIHN0cmluZywgc28gdW5tYXBwZWQgTE9JTkNzIGRlZ3JhZGUgZ3JhY2VmdWxseSB0byB0aGUgTkhJIHRleHQuXG5leHBvcnQgY29uc3QgTE9JTkNfRElTUExBWTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gXHUyNTAwXHUyNTAwIFVyaW5hbHlzaXMgKDA2MDEzQyBwYW5lbCBzdWItaXRlbXMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBNb3N0IGNyaXRpY2FsIGJsb2NrIFx1MjAxNCBOSEkncyBcIkNvbG9yIFx1NUMzRiBcdTk4NEYgIC4uLlwiIHN0eWxlIGxhYmVscyBhcmVcbiAgLy8gd2hhdCB0cmlnZ2VycyBkb3duc3RyZWFtIENoaW5lc2Utc3Vic3RyaW5nIGxhYmVsbGluZyBidWdzLlxuICBcIjU4MDMtMlwiOiBcInBIIG9mIFVyaW5lXCIsXG4gIFwiNTgxMS01XCI6IFwiU3BlY2lmaWMgZ3Jhdml0eSBvZiBVcmluZVwiLFxuICBcIjU3NzAtM1wiOiBcIkJpbGlydWJpbiBVcmluZSBRbFwiLFxuICBcIjU4MDItNFwiOiBcIk5pdHJpdGUgVXJpbmUgUWxcIixcbiAgXCI1Nzc4LTZcIjogXCJDb2xvciBvZiBVcmluZVwiLFxuICBcIjU3NjctOVwiOiBcIkFwcGVhcmFuY2Ugb2YgVXJpbmVcIixcbiAgXCI1ODE4LTBcIjogXCJVcm9iaWxpbm9nZW4gVXJpbmUgUWxcIixcbiAgXCIyMDQ1NC01XCI6IFwiUHJvdGVpbiBNYXNzL1ZvbCBpbiBVcmluZVwiLFxuICBcIjE0OTU3LTVcIjogXCJNaWNyb2FsYnVtaW4gTWFzcy9Wb2wgaW4gVXJpbmVcIixcbiAgXCIxNDk1OS0xXCI6IFwiTWljcm9hbGJ1bWluL0NyZWF0aW5pbmUgUmF0aW8gaW4gVXJpbmVcIixcbiAgXCI1NzkyLTdcIjogXCJHbHVjb3NlIFVyaW5lIFFsXCIsXG4gIFwiNTc5Ny02XCI6IFwiS2V0b25lcyBVcmluZSBRbFwiLFxuICBcIjU3OTQtM1wiOiBcIkhlbW9nbG9iaW4gVXJpbmUgUWxcIixcbiAgXCI1Nzk5LTJcIjogXCJMZXVrb2N5dGVzIFVyaW5lIFFsXCIsXG4gIFwiMjQzNTYtOFwiOiBcIlVyaW5hbHlzaXMgTWFjcm8gUGFuZWxcIixcbiAgLy8gQUxMIGVudHJpZXMgYmVsb3cgdXNlIHRoZSBMT0lOQyBjYW5vbmljYWwgJ0xvbmcgQ29tbW9uIE5hbWUnXG4gIC8vIGFzIGFjY2VwdGVkIGJ5IHRoZSBUV05ISUZISVIgdmFsaWRhdG9yLiBTb3VyY2U6IGxvaW5jLm9yZyBmb3JcbiAgLy8gZWFjaCBjb2RlLCBjcm9zcy1jaGVja2VkIGFnYWluc3QgdGhlIHZhbGlkYXRvcidzIHJlcG9ydGVkXG4gIC8vICdWYWxpZCBkaXNwbGF5IGlzIG9uZSBvZiBOIGNob2ljZXMnIGZvciBkaXNwbGF5cyB3ZSBwcmV2aW91c2x5XG4gIC8vIGdvdCB3cm9uZyAoNDUgTE9JTkNzIGZvdW5kIGluIHRoZSBQMzMzMzMzMzMzIHZhbGlkYXRpb24gcnVuKS5cbiAgLy8gV2hlbiB1cGRhdGluZywgY29weSB0aGUgZXhhY3QgZW4tVVMgbG9uZyBuYW1lIGZyb20gbG9pbmMub3JnIFx1MjAxNFxuICAvLyB0aGUgdmFsaWRhdG9yIGlzIHNlbnNpdGl2ZSB0byBzcGVsbGluZyAvIHB1bmN0dWF0aW9uLlxuICAvL1xuICAvLyBcdTI1MDBcdTI1MDAgVXJpbmFseXNpcyAoMDYwMTNDIHBhbmVsIHN1Yi1pdGVtcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIFx1MjUwMFx1MjUwMCBBQkcgKDA5MDQxQiBwYW5lbCkgXHUyMDE0IG5vdCBpbiB2YWxpZGF0b3Igb3V0cHV0OyBsb2luYy5vcmcgc291cmNlZFxuICBcIjExNTU4LTRcIjogXCJwSCBvZiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMTktOFwiOiBcIkNhcmJvbiBkaW94aWRlIFtQYXJ0aWFsIHByZXNzdXJlXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjI3MDMtN1wiOiBcIk94eWdlbiBbUGFydGlhbCBwcmVzc3VyZV0gaW4gQXJ0ZXJpYWwgYmxvb2RcIixcbiAgXCIxOTU5LTZcIjogXCJCaWNhcmJvbmF0ZSBbTW9sZXMvdm9sdW1lXSBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICBcIjIwMjgtOVwiOiBcIkNhcmJvbiBkaW94aWRlIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjExNTU1LTBcIjogXCJCYXNlIGV4Y2VzcyBpbiBBcnRlcmlhbCBibG9vZCBieSBjYWxjdWxhdGlvblwiLFxuICBcIjE5MjUtN1wiOiBcIkJpY2FyYm9uYXRlIFtNb2xlcy92b2x1bWVdIGluIEFydGVyaWFsIGJsb29kIC0tc3RhbmRhcmRcIixcbiAgXCIyNzEzLTZcIjogXCJPeHlnZW4gc2F0dXJhdGlvbiBpbiBBcnRlcmlhbCBibG9vZFwiLFxuICAvLyBcdTI1MDBcdTI1MDAgR2x1Y29zZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCIxNTU4LTZcIjogXCJGYXN0aW5nIGdsdWNvc2UgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMzQ1LTdcIjogXCJHbHVjb3NlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBIZW1hdG9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjcxOC03XCI6IFwiSGVtb2dsb2JpbiBbTWFzcy92b2x1bWVdIGluIEJsb29kXCIsXG4gIFwiNDU0OC00XCI6IFwiSGVtb2dsb2JpbiBBMWMvSGVtb2dsb2Jpbi50b3RhbCBpbiBCbG9vZFwiLFxuICBcIjY2OTAtMlwiOiBcIkxldWtvY3l0ZXMgWywgIC8vIC92b2x1bWVdIGluIEJsb29kIGJ5IEF1dG9tYXRlZCBjb3VudFwiLFxuICBcIjc3Ny0zXCI6IFwiUGxhdGVsZXRzIFssICAvLyAvdm9sdW1lXSBpbiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI3ODktOFwiOiBcIkVyeXRocm9jeXRlcyBbLCAgLy8gL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzg1LTZcIjogXCJNQ0ggW0VudGl0aWMgbWFzc10gYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNzExLTJcIjogXCJFb3Npbm9waGlscyBbLCAgLy8gL3ZvbHVtZV0gaW4gQmxvb2QgYnkgQXV0b21hdGVkIGNvdW50XCIsXG4gIFwiNDU0NC0zXCI6IFwiSGVtYXRvY3JpdCBbVm9sdW1lIEZyYWN0aW9uXSBvZiBCbG9vZCBieSBBdXRvbWF0ZWQgY291bnRcIixcbiAgXCI1NzAyMS04XCI6IFwiQ0JDIFcgQXV0byBEaWZmZXJlbnRpYWwgcGFuZWwgLSBCbG9vZFwiLFxuICBcIjI0MzE3LTBcIjogXCJIZW1vZ3JhbSBhbmQgcGxhdGVsZXRzIFdPIGRpZmZlcmVudGlhbCBwYW5lbCAtIEJsb29kXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBDaGVtaXN0cnkgLyBsaXZlciAvIHJlbmFsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjE5MjAtOFwiOiBcIkFzcGFydGF0ZSBhbWlub3RyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzQyLTZcIjogXCJBbGFuaW5lIGFtaW5vdHJhbnNmZXJhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIxNjAtMFwiOiBcIkNyZWF0aW5pbmUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMTYxLThcIjogXCJDcmVhdGluaW5lIFtNYXNzL3ZvbHVtZV0gaW4gVXJpbmVcIixcbiAgXCIzMzkxNC0zXCI6XG4gICAgXCJHbG9tZXJ1bGFyIGZpbHRyYXRpb24gcmF0ZSBbVm9sdW1lIFJhdGUvQXJlYV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IENyZWF0aW5pbmUtYmFzZWQgZm9ybXVsYSAoTURSRCkvMS43MyBzcSBNXCIsXG4gIFwiMzA5NC0wXCI6IFwiVXJlYSBuaXRyb2dlbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMwODQtMVwiOiBcIlVyYXRlIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMjk1MS0yXCI6IFwiU29kaXVtIFtNb2xlcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI4MjMtM1wiOiBcIlBvdGFzc2l1bSBbTW9sZXMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTc1LTJcIjogXCJCaWxpcnViaW4udG90YWwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxOTY4LTdcIjogXCJCaWxpcnViaW4uZGlyZWN0IFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTc1MS03XCI6IFwiQWxidW1pbiBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI1MzItMFwiOiBcIkxhY3RhdGUgZGVoeWRyb2dlbmFzZSBbRW56eW1hdGljIGFjdGl2aXR5L3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiNjc2OC02XCI6IFwiQWxrYWxpbmUgcGhvc3BoYXRhc2UgW0VuenltYXRpYyBhY3Rpdml0eS92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjIzMjQtMlwiOiBcIkdhbW1hIGdsdXRhbXlsIHRyYW5zZmVyYXNlIFtFbnp5bWF0aWMgYWN0aXZpdHkvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxNzg2MS02XCI6IFwiQ2FsY2l1bSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgTGlwaWQgcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMjA5My0zXCI6IFwiQ2hvbGVzdGVyb2wgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyNTcxLThcIjogXCJUcmlnbHljZXJpZGUgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIyMDg1LTlcIjogXCJDaG9sZXN0ZXJvbCBpbiBIREwgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgXCIxMzQ1Ny03XCI6IFwiQ2hvbGVzdGVyb2wgaW4gTERMIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hIGJ5IGNhbGN1bGF0aW9uXCIsXG4gIC8vIFx1MjUwMFx1MjUwMCBUaHlyb2lkIC8gaG9ybW9uZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMzAxNi0zXCI6IFwiVGh5cm90cm9waW4gW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzAyNC03XCI6IFwiVGh5cm94aW5lIChUNCkgZnJlZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjI5ODYtOFwiOiBcIlRlc3Rvc3Rlcm9uZSBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjgzMDk4LTRcIjogXCJGb2xsaXRyb3BpbiBbVW5pdHMvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgXCI4MzA5Ni04XCI6IFwiRXN0cmFkaW9sIChFMikgW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWEgYnkgSW1tdW5vYXNzYXlcIixcbiAgLy8gXHUyNTAwXHUyNTAwIENhcmRpYWMgLyBpbmZsYW1tYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiMTA4MzktOVwiOiBcIlRyb3BvbmluIEkuY2FyZGlhYyBbTWFzcy92b2x1bWVdIGluIFNlcnVtIG9yIFBsYXNtYVwiLFxuICBcIjMzNzYyLTZcIjogXCJOYXRyaXVyZXRpYyBwZXB0aWRlLkIgcHJvaG9ybW9uZSBOLVRlcm1pbmFsIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMTk4OC01XCI6IFwiQyByZWFjdGl2ZSBwcm90ZWluIFtNYXNzL3ZvbHVtZV0gaW4gU2VydW0gb3IgUGxhc21hXCIsXG4gIFwiMzM5NTktOFwiOiBcIlByb2NhbGNpdG9uaW4gW01hc3Mvdm9sdW1lXSBpbiBTZXJ1bSBvciBQbGFzbWFcIixcbiAgLy8gXHUyNTAwXHUyNTAwIEhlcGF0aXRpcyAvIHNlcm9sb2d5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBcIjUxOTUtM1wiOiBcIkhlcGF0aXRpcyBCIHZpcnVzIHN1cmZhY2UgQWcgW1ByZXNlbmNlXSBpbiBTZXJ1bVwiLFxuICBcIjUxOTYtMVwiOiBcIkhlcGF0aXRpcyBCIHZpcnVzIHN1cmZhY2UgQWcgW1VuaXRzL3ZvbHVtZV0gaW4gU2VydW1cIixcbiAgXCIxNjEyOC0xXCI6IFwiSGVwYXRpdGlzIEMgdmlydXMgQWIgW1ByZXNlbmNlXSBpbiBTZXJ1bVwiLFxuICBcIjEzOTU1LTBcIjogXCJIZXBhdGl0aXMgQyB2aXJ1cyBBYiBbUHJlc2VuY2VdIGluIFNlcnVtIG9yIFBsYXNtYSBieSBJbW11bm9hc3NheVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgQ29hZ3VsYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIFwiNjMwMS02XCI6IFwiSU5SIGluIFBsYXRlbGV0IHBvb3IgcGxhc21hIGJ5IENvYWd1bGF0aW9uIGFzc2F5XCIsXG4gIFwiMTQ5NzktOVwiOiBcImFQVFQgaW4gUGxhdGVsZXQgcG9vciBwbGFzbWEgYnkgQ29hZ3VsYXRpb24gYXNzYXlcIixcbiAgXCIzMDI0MC02XCI6IFwiRmlicmluIEQtZGltZXIgW01hc3Mvdm9sdW1lXSBpbiBQbGF0ZWxldCBwb29yIHBsYXNtYVwiLFxuICAvLyBcdTI1MDBcdTI1MDAgVml0YWwgc2lnbnMgKElIS0UzNDAyKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgXCI4MzAyLTJcIjogXCJCb2R5IGhlaWdodFwiLFxuICBcIjI5NDYzLTdcIjogXCJCb2R5IHdlaWdodFwiLFxuICBcIjM5MTU2LTVcIjogXCJCb2R5IG1hc3MgaW5kZXggKEJNSSkgW1JhdGlvXVwiLFxuICBcIjgyODAtMFwiOiBcIldhaXN0IENpcmN1bWZlcmVuY2UgYXQgdW1iaWxpY3VzIGJ5IFRhcGUgbWVhc3VyZVwiLFxuICBcIjg0ODAtNlwiOiBcIlN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIsXG4gIFwiODQ2Mi00XCI6IFwiRGlhc3RvbGljIGJsb29kIHByZXNzdXJlXCIsXG4gIFwiODUzNTQtOVwiOiBcIkJsb29kIHByZXNzdXJlIHBhbmVsIHdpdGggYWxsIGNoaWxkcmVuIG9wdGlvbmFsXCIsXG59O1xuIiwgIi8qKlxuICogUHVyZSBwYXJzaW5nIGhlbHBlcnMgXHUyMDE0IHJlZmVyZW5jZSByYW5nZSwgcXVhbnRpdHksIFVDVU0gdW5pdCBub3JtYWxpc2F0aW9uLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9fcGFyc2Vycy5weWAuIFNlbGYtY29udGFpbmVkOiBubyBkZXBlbmRlbmNpZXNcbiAqIG9uIG90aGVyIG9ic2VydmF0aW9uIG1vZHVsZSBwaWVjZXMuXG4gKlxuICogUHVibGljIEFQSTpcbiAqICAgdG9VY3VtKHVuaXQpICAgICAgICAgICAgICAgICAgXHUyMTkyIGNhbm9uaWNhbCBVQ1VNIHVuaXQgc3RyaW5nIChvciBudWxsKVxuICogICBwYXJzZVJhbmdlTXVsdGkocmF3LCB1bml0KSAgICBcdTIxOTIgbGlzdCBvZiBGSElSIHJlZmVyZW5jZVJhbmdlIGVudHJpZXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob25lIHBlciBzZXggd2hlbiBzZXgtc3RyYXRpZmllZClcbiAqICAgcGFyc2VSYW5nZShyYXcsIHVuaXQpICAgICAgICAgXHUyMTkyIHNpbmdsZSByZWZlcmVuY2VSYW5nZSBlbnRyeVxuICogICB0cnlQYXJzZVF1YW50aXR5KHJhdywgdW5pdCkgICBcdTIxOTIgRkhJUiBRdWFudGl0eSBkaWN0IG9yIG51bGxcbiAqL1xuXG5jb25zdCBVQ1VNX1NZU1RFTSA9IFwiaHR0cDovL3VuaXRzb2ZtZWFzdXJlLm9yZ1wiO1xuXG4vLyBGSElSIFI0IFF1YW50aXR5LmNvbXBhcmF0b3IgYWxsb3dlZCB2YWx1ZXMuIE5vcm1hbGlzZSBmdWxsLXdpZHRoIENKS1xuLy8gXHVGRjFFIFx1RkYxQyBcdTIyNjcgXHUyMjY2ICsgQVNDSUkgdmFyaWFudHMgc28gXCJcdUZGMUUgNDAuMFwiIHN0aWxsIHBhcnNlcyBhcyBhIHJlYWwgbnVtYmVyXG4vLyBpbnN0ZWFkIG9mIGZhbGxpbmcgdGhyb3VnaCB0byB2YWx1ZVN0cmluZyAod2hpY2ggbG9zZXMgdGhlIHVuaXQpLlxuY29uc3QgRlVMTFdJRFRIX09QUzogUmVhZG9ubHlBcnJheTxbc3RyaW5nLCBzdHJpbmddPiA9IFtcbiAgW1wiXHVGRjFFXCIsIFwiPlwiXSxcbiAgW1wiXHVGRjFDXCIsIFwiPFwiXSxcbiAgW1wiXHUyMjY3XCIsIFwiPj1cIl0sXG4gIFtcIlx1MjI2NlwiLCBcIjw9XCJdLFxuICBbXCJcdTIyNjVcIiwgXCI+PVwiXSxcbiAgW1wiXHUyMjY0XCIsIFwiPD1cIl0sXG5dO1xuXG5mdW5jdGlvbiB0cmFuc2xhdGVGdWxsd2lkdGgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IG91dCA9IHM7XG4gIGZvciAoY29uc3QgW2Zyb20sIHRvXSBvZiBGVUxMV0lEVEhfT1BTKSB7XG4gICAgaWYgKG91dC5pbmNsdWRlcyhmcm9tKSkge1xuICAgICAgb3V0ID0gb3V0LnNwbGl0KGZyb20pLmpvaW4odG8pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5jb25zdCBDT01QQVJBVE9SX1JFID0gL15cXHMqKDw9fD49fDx8PilcXHMqKC4rKSQvO1xuXG4vLyBSZWZlcmVuY2UtcmFuZ2UgcGFyc2luZy4gTkhJIHNoaXBzIHRoZSByYW5nZSBhcyBwbGFpbiB0ZXh0IGxpa2Vcbi8vIFwiWzMuODldWzI2LjhdXCIsIFwiWzQwXVtdXCIsIFwiW05lZ2F0aXZlXVwiIG9yIFwiQU0gODowMCA2LjItMTkuNFwiLlxuY29uc3QgUlJfTE9XSElHSF9CUkFDS0VUUyA9IC9eXFxzKlxcW1xccyooW15cXF1dKilcXHMqXFxdXFxzKlxcW1xccyooW15cXF1dKilcXHMqXFxdXFxzKiQvO1xuY29uc3QgUlJfREFTSF9SQU5HRSA9IC8oLT9cXGQrKD86XFwuXFxkKyk/KVxccypbLX5cdTIwMTNdXFxzKigtP1xcZCsoPzpcXC5cXGQrKT8pLztcbmNvbnN0IFJSX0NPTVBBUkFUT1IgPSAvXlxccyooPD18Pj18PHw+KVxccyooLT9cXGQrKD86XFwuXFxkKyk/KVxccyokLztcbi8vIFNleC1zdHJhdGlmaWVkIGJyYWNrZXRlZCByYW5nZSwgZS5nLiBcIlx1NzUzNzoxMy43IFx1NTk3MzoxMS4xXCIgXHUyMDE0IHVzZWQgYnkgc29tZVxuLy8gaG9zcGl0YWxzIGZvciBoYWVtYXRvbG9neSAoSGIsIFJCQywgSGN0KS4gUHVsbHMgb3V0IChzZXgsIHZhbHVlKSBwYWlycy5cbi8vIFRvbGVyYXRlcyBvcHRpb25hbCBjb21wYXJhdG9yIChcdTIyNjcvXHUyMjY2Lz4vPCkgYmVmb3JlIHRoZSBudW1iZXIuXG5jb25zdCBSUl9TRVhfTlVNX0cgPSAvKFx1NzUzN1x1NjAyN3xcdTU5NzNcdTYwMjd8XHU3NTM3fFx1NTk3M3xNfEYpXFxzKls6XHVGRjFBXT9cXHMqKD86Wzw+XHUyMjY3XHUyMjY2XT0/KT9cXHMqKC0/XFxkKyg/OlxcLlxcZCspPykvZztcbmNvbnN0IFJSX1NJTkdMRV9CUkFDS0VUID0gL15cXHMqXFxbXFxzKiguKz8pXFxzKlxcXVxccyokLztcbmNvbnN0IFJSX1FVQUxJVEFUSVZFX1BBUkVOID1cbiAgL15cXHMqKE5vcm1hbHxcdTZCNjNcdTVFMzh8Tm9ucmVhY3RpdmV8Tm9uLXJlYWN0aXZlKVxccypcXChcXHMqKC0/XFxkKyg/OlxcLlxcZCspPylcXHMqXFwpXFxzKiQvaTtcblxuY29uc3QgU0VYX1RPX0ZISVI6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBcdTc1MzdcdTYwMjc6IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBcdTc1Mzc6IFtcIm1hbGVcIiwgXCJNYWxlXCJdLFxuICBNOiBbXCJtYWxlXCIsIFwiTWFsZVwiXSxcbiAgXHU1OTczXHU2MDI3OiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG4gIFx1NTk3MzogW1wiZmVtYWxlXCIsIFwiRmVtYWxlXCJdLFxuICBGOiBbXCJmZW1hbGVcIiwgXCJGZW1hbGVcIl0sXG59O1xuXG4vLyBQdWJsaWMgdHlwZXMgXHUyMDE0IEZISVIgUXVhbnRpdHkgLyByZWZlcmVuY2VSYW5nZSBzaGFwZXMgdXNlZCBkb3duc3RyZWFtLlxuZXhwb3J0IGludGVyZmFjZSBRdWFudGl0eSB7XG4gIHZhbHVlOiBudW1iZXI7XG4gIHVuaXQ/OiBzdHJpbmc7XG4gIHN5c3RlbT86IHN0cmluZztcbiAgY29kZT86IHN0cmluZztcbiAgY29tcGFyYXRvcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSYW5nZUVudHJ5IHtcbiAgdGV4dDogc3RyaW5nO1xuICBsb3c/OiBRdWFudGl0eTtcbiAgaGlnaD86IFF1YW50aXR5O1xuICBhcHBsaWVzVG8/OiBBcnJheTx7XG4gICAgY29kaW5nOiBBcnJheTx7IHN5c3RlbTogc3RyaW5nOyBjb2RlOiBzdHJpbmc7IGRpc3BsYXk6IHN0cmluZyB9PjtcbiAgICB0ZXh0OiBzdHJpbmc7XG4gIH0+O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgVUNVTSBub3JtYWxpc2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIE5ISSBsYWJzIHJlcG9ydCB1bml0cyBpbiBhIG1peCBvZiBVQ1VNLWNsZWFuIHN0cmluZ3MgKCdtZy9kTCcpLFxuICogVGFpd2FuLXN0eWxlIGVxdWl2YWxlbnRzICgnbUVxL0wnIHZzIFVDVU0gJ21lcS9MJyksIGZ1bGwtd2lkdGggcHVuY3R1YXRpb25cbiAqICgnXHVGRjA1JyB2cyAnJScpLCBhbmQgcGxhY2Vob2xkZXIgdGV4dCAoJ1x1NzEyMScpLiBUaGUgVFdOSElGSElSIHZhbGlkYXRvclxuICogcmVqZWN0cyBldmVyeXRoaW5nIGV4Y2VwdCBjYW5vbmljYWwgVUNVTSBpbiBRdWFudGl0eS5jb2RlLCBzbyB3ZVxuICogbm9ybWFsaXNlLiBgbnVsbGAgbWVhbnMgXCJvbWl0IFF1YW50aXR5LmNvZGUgZW50aXJlbHlcIi5cbiAqL1xuY29uc3QgVUNVTV9PVkVSUklERVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bGw+ID0ge1xuICAvLyBGdWxsd2lkdGggXHUyMTkyIEFTQ0lJXG4gIFwiXHVGRjA1XCI6IFwiJVwiLFxuICAvLyBDYXNlLXNlbnNpdGl2ZSBVQ1VNIChFcSBpcyAnZXEnLCBub3QgJ0VxJylcbiAgXCJtRXEvTFwiOiBcIm1lcS9MXCIsXG4gIFwibWVxL2xcIjogXCJtZXEvTFwiLFxuICAvLyBCUCBwcm9maWxlIGZpeGVkLXZhbHVlOiBtbVtIZ10gbm90IG1tSGdcbiAgbW1IZzogXCJtbVtIZ11cIixcbiAgTU1IRzogXCJtbVtIZ11cIixcbiAgLy8gQ29tbW9uIENoaW5lc2UgJ25vIHVuaXQnIHBsYWNlaG9sZGVycyBcdTIxOTIgZHJvcCBVQ1VNIGNvZGVcbiAgXHU3MTIxOiBudWxsLFxuICBcIlwiOiBudWxsLFxuICBcIlx1MjAxNFwiOiBudWxsLFxuICBcIi1cIjogbnVsbCxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VjdW0odW5pdDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXVuaXQpIHJldHVybiBudWxsO1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFVDVU1fT1ZFUlJJREVTLCB1bml0KSkge1xuICAgIHJldHVybiBVQ1VNX09WRVJSSURFU1t1bml0XSA/PyBudWxsO1xuICB9XG4gIHJldHVybiB1bml0O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUXVhbnRpdHkgYnVpbGRlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gbWFrZVF1YW50aXR5KHZhbHVlOiBudW1iZXIsIHVuaXQ6IHN0cmluZyk6IFF1YW50aXR5IHtcbiAgY29uc3QgcTogUXVhbnRpdHkgPSB7IHZhbHVlIH07XG4gIGlmICh1bml0KSB7XG4gICAgcS51bml0ID0gdW5pdDtcbiAgICBxLnN5c3RlbSA9IFVDVU1fU1lTVEVNO1xuICAgIHEuY29kZSA9IHVuaXQ7XG4gIH1cbiAgcmV0dXJuIHE7XG59XG5cbmZ1bmN0aW9uIHRyeVBhcnNlRmxvYXQoczogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmIChzID09PSBcIlwiIHx8IHMgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIC8vIE1pcnJvciBQeXRob24ncyBmbG9hdCgpIFx1MjAxNCBhbGxvdyBsZWFkaW5nL3RyYWlsaW5nIHdoaXRlc3BhY2UsXG4gIC8vIG9wdGlvbmFsIHNpZ24sIGRlY2ltYWwuIFJlamVjdCBpZiBOYU4gT1IgaWYgYW55IG5vbi1udW1lcmljIHJlc2lkdWFsXG4gIC8vIChOdW1iZXIoXCIxMmFiY1wiKSByZXR1cm5zIE5hTiwgT0s7IFwiMTIgIGFiY1wiIGFsc28gTmFOLCBPSykuXG4gIGNvbnN0IHRyaW1tZWQgPSBzLnRyaW0oKTtcbiAgaWYgKHRyaW1tZWQgPT09IFwiXCIpIHJldHVybiBudWxsO1xuICBjb25zdCBuID0gTnVtYmVyKHRyaW1tZWQpO1xuICBpZiAoTnVtYmVyLmlzTmFOKG4pKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIG47XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBwYXJzZVJhbmdlTXVsdGkgLyBwYXJzZVJhbmdlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIExpc3QgdmFyaWFudCBvZiBwYXJzZVJhbmdlOiBlbWl0cyBvbmUgZW50cnkgcGVyIHNleCB3aGVuIHRoZSByYW5nZSBpc1xuICogc2V4LXN0cmF0aWZpZWQgKFwiW1x1NzUzNzoxMy43IFx1NTk3MzoxMS4xXVtcdTc1Mzc6MTcuMCBcdTU5NzM6MTUuMF1cIiksIG90aGVyd2lzZSBhXG4gKiBzaW5nbGUtZWxlbWVudCBsaXN0LiBFYWNoIGVudHJ5IHRhZ2dlZCB3aXRoIGFwcGxpZXNUbyBzbyBkb3duc3RyZWFtXG4gKiBjb2RlIGNhbiBwaWNrIHRoZSByaWdodCBvbmUgZm9yIHRoZSBwYXRpZW50J3Mgc2V4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSYW5nZU11bHRpKHJhd1JhbmdlOiBzdHJpbmcsIHVuaXQ6IHN0cmluZyk6IFJhbmdlRW50cnlbXSB7XG4gIGNvbnN0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoKHJhd1JhbmdlIHx8IFwiXCIpLnRyaW0oKSk7XG4gIGlmICghcykgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IGxvd0J5U2V4OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IGhpZ2hCeVNleDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBsZXQgdXNlZE11bHRpID0gZmFsc2U7XG5cbiAgY29uc3QgbSA9IHMubWF0Y2goUlJfTE9XSElHSF9CUkFDS0VUUyk7XG4gIGlmIChtKSB7XG4gICAgY29uc3QgbG93QmxvYiA9IG1bMV0gPz8gXCJcIjtcbiAgICBjb25zdCBoaWdoQmxvYiA9IG1bMl0gPz8gXCJcIjtcbiAgICBmb3IgKGNvbnN0IHNtIG9mIGxvd0Jsb2IubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgaWYgKHNtWzFdICYmIHNtWzJdKSBsb3dCeVNleFtzbVsxXV0gPSBzbVsyXTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzbSBvZiBoaWdoQmxvYi5tYXRjaEFsbChSUl9TRVhfTlVNX0cpKSB7XG4gICAgICBpZiAoc21bMV0gJiYgc21bMl0pIGhpZ2hCeVNleFtzbVsxXV0gPSBzbVsyXTtcbiAgICB9XG4gICAgdXNlZE11bHRpID0gT2JqZWN0LmtleXMobG93QnlTZXgpLmxlbmd0aCA+IDAgfHwgT2JqZWN0LmtleXMoaGlnaEJ5U2V4KS5sZW5ndGggPiAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFNpbmdsZS1icmFja2V0OiBlYWNoIHBlci1zZXggdmFsdWUncyBjb21wYXJhdG9yIGRlY2lkZXMgbG93IHZzIGhpZ2guXG4gICAgY29uc3Qgc2luZ2xlID0gcy5tYXRjaChSUl9TSU5HTEVfQlJBQ0tFVCk7XG4gICAgaWYgKHNpbmdsZSkge1xuICAgICAgY29uc3QgaW5uZXIgPSBzaW5nbGVbMV0gPz8gXCJcIjtcbiAgICAgIGZvciAoY29uc3Qgc20gb2YgaW5uZXIubWF0Y2hBbGwoUlJfU0VYX05VTV9HKSkge1xuICAgICAgICBjb25zdCBzZXhLZXkgPSBzbVsxXSA/PyBcIlwiO1xuICAgICAgICBjb25zdCB2YWxTdHIgPSBzbVsyXSA/PyBcIlwiO1xuICAgICAgICAvLyBGaW5kIHRoZSBjb21wYXJhdG9yIGltbWVkaWF0ZWx5IHByZWNlZGluZyB0aGlzIG51bWJlci5cbiAgICAgICAgLy8gTWlycm9yIHRoZSBQeXRob246IHJlYnVpbGQgYSBwZXItc2V4LWtleSBzZWFyY2guXG4gICAgICAgIGNvbnN0IHBhdCA9IG5ldyBSZWdFeHAoYCR7ZXNjYXBlUmVnZXgoc2V4S2V5KX1cXFxccypbOlx1RkYxQV0/XFxcXHMqKFs8Plx1MjI2N1x1MjI2Nl09Pyk/XFxcXHMqLT9cXFxcZGApO1xuICAgICAgICBjb25zdCBjbSA9IGlubmVyLm1hdGNoKHBhdCk7XG4gICAgICAgIGNvbnN0IG9wID0gY20/LlsxXSA/PyBcIlwiO1xuICAgICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgICBsb3dCeVNleFtzZXhLZXldID0gdmFsU3RyO1xuICAgICAgICB9IGVsc2UgaWYgKG9wID09PSBcIjxcIiB8fCBvcCA9PT0gXCI8PVwiKSB7XG4gICAgICAgICAgaGlnaEJ5U2V4W3NleEtleV0gPSB2YWxTdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG93QnlTZXhbc2V4S2V5XSA9IHZhbFN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdXNlZE11bHRpID0gT2JqZWN0LmtleXMobG93QnlTZXgpLmxlbmd0aCA+IDAgfHwgT2JqZWN0LmtleXMoaGlnaEJ5U2V4KS5sZW5ndGggPiAwO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1c2VkTXVsdGkpIHtcbiAgICBjb25zdCBlbnRyaWVzOiBSYW5nZUVudHJ5W10gPSBbXTtcbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIHVuaW9uIG9mIGtleXMgYWN0dWFsbHkgc2VlbiBcdTIwMTQgcHJlc2VydmUgaW5zZXJ0aW9uIG9yZGVyLlxuICAgIGNvbnN0IGFsbFNleEtleXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBrIG9mIFsuLi5PYmplY3Qua2V5cyhsb3dCeVNleCksIC4uLk9iamVjdC5rZXlzKGhpZ2hCeVNleCldKSB7XG4gICAgICBpZiAoIWFsbFNleEtleXMuaW5jbHVkZXMoaykpIGFsbFNleEtleXMucHVzaChrKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzZXhLZXkgb2YgYWxsU2V4S2V5cykge1xuICAgICAgY29uc3QgbWFwcGluZyA9IFNFWF9UT19GSElSW3NleEtleV07XG4gICAgICBpZiAoIW1hcHBpbmcpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgW2ZoaXJDb2RlLCBmaGlyRGlzcGxheV0gPSBtYXBwaW5nO1xuICAgICAgY29uc3QgZW50cnk6IFJhbmdlRW50cnkgPSB7XG4gICAgICAgIHRleHQ6IHJhd1JhbmdlLFxuICAgICAgICBhcHBsaWVzVG86IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vaGw3Lm9yZy9maGlyL2FkbWluaXN0cmF0aXZlLWdlbmRlclwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IGZoaXJDb2RlLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZoaXJEaXNwbGF5LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHRleHQ6IGZoaXJEaXNwbGF5LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgICAgaWYgKHNleEtleSBpbiBsb3dCeVNleCkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChsb3dCeVNleFtzZXhLZXldISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSBlbnRyeS5sb3cgPSBtYWtlUXVhbnRpdHkodiwgdW5pdCk7XG4gICAgICB9XG4gICAgICBpZiAoc2V4S2V5IGluIGhpZ2hCeVNleCkge1xuICAgICAgICBjb25zdCB2ID0gdHJ5UGFyc2VGbG9hdChoaWdoQnlTZXhbc2V4S2V5XSEpO1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICAgIGVudHJpZXMucHVzaChlbnRyeSk7XG4gICAgfVxuICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIERlLWR1cCBieSBGSElSIHNleCBjb2RlIGluIGNhc2UgaW5wdXQgaGFzIGJvdGggXHU3NTM3IGFuZCBcdTc1MzdcdTYwMjcuXG4gICAgICBjb25zdCBzZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICBjb25zdCBvdXQ6IFJhbmdlRW50cnlbXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBlIG9mIGVudHJpZXMpIHtcbiAgICAgICAgY29uc3QgYyA9IGUuYXBwbGllc1RvPy5bMF0/LmNvZGluZ1swXT8uY29kZTtcbiAgICAgICAgaWYgKCFjIHx8IHNlZW4uaGFzKGMpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoYyk7XG4gICAgICAgIG91dC5wdXNoKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBvbmUgPSBwYXJzZVJhbmdlKHJhd1JhbmdlLCB1bml0KTtcbiAgcmV0dXJuIG9uZSA/IFtvbmVdIDogW107XG59XG5cbi8qKlxuICogQ29udmVydCBhIHJlZmVyZW5jZS1yYW5nZSB0ZXh0IGludG8gYSBGSElSIHJlZmVyZW5jZVJhbmdlIGVudHJ5LlxuICpcbiAqIFN0cmF0ZWd5IGluIG9yZGVyOlxuICogICAxLiBcIltsb3ddW2hpZ2hdXCIgYnJhY2tldGVkIGZvcm1hdCBcdTIwMTQgTkhJJ3MgY2Fub25pY2FsIHNoYXBlLlxuICogICAyLiBcIjMuODktMjYuOFwiIC8gXCIzLjg5fjI2LjhcIiBkYXNoIHJhbmdlLlxuICogICAzLiBcIj4gNDBcIiAvIFwiPCAwLjVcIiBzaW5nbGUtc2lkZWQuXG4gKiAgIDQuIFF1YWxpdGF0aXZlIChcIk5lZ2F0aXZlXCIsIFwiQU0gODowMCA2LjItMTkuNFwiKSBcdTIwMTQgdGV4dC1vbmx5LlxuICpcbiAqIFNleC1zdHJhdGlmaWVkIHNoYXBlcyBnbyB0aHJvdWdoIHBhcnNlUmFuZ2VNdWx0aS4gUmV0dXJucyBudWxsIG9ubHlcbiAqIGZvciBlbXB0eSBpbnB1dC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmFuZ2UocmF3UmFuZ2U6IHN0cmluZywgdW5pdDogc3RyaW5nKTogUmFuZ2VFbnRyeSB8IG51bGwge1xuICBjb25zdCBzID0gdHJhbnNsYXRlRnVsbHdpZHRoKChyYXdSYW5nZSB8fCBcIlwiKS50cmltKCkpO1xuICBpZiAoIXMpIHJldHVybiBudWxsO1xuICBjb25zdCBlbnRyeTogUmFuZ2VFbnRyeSA9IHsgdGV4dDogcmF3UmFuZ2UgfTtcblxuICBjb25zdCBtID0gcy5tYXRjaChSUl9MT1dISUdIX0JSQUNLRVRTKTtcbiAgaWYgKG0pIHtcbiAgICBjb25zdCBsbyA9IChtWzFdID8/IFwiXCIpLnRyaW0oKTtcbiAgICBjb25zdCBoaSA9IChtWzJdID8/IFwiXCIpLnRyaW0oKTtcbiAgICBmb3IgKGNvbnN0IFtzaWRlLCBzaWRlVmFsXSBvZiBbXG4gICAgICBbXCJsb3dcIiwgbG9dLFxuICAgICAgW1wiaGlnaFwiLCBoaV0sXG4gICAgXSBhcyBjb25zdCkge1xuICAgICAgaWYgKCFzaWRlVmFsIHx8IHNpZGVWYWwgPT09IFwiXHU3MTIxXCIgfHwgc2lkZVZhbCA9PT0gXCJcdTdBN0FcdTc2N0RcIikgY29udGludWU7XG5cbiAgICAgIC8vIDEuIFBsYWluIGZsb2F0XG4gICAgICBjb25zdCBhc0Zsb2F0ID0gdHJ5UGFyc2VGbG9hdChzaWRlVmFsKTtcbiAgICAgIGlmIChhc0Zsb2F0ICE9PSBudWxsKSB7XG4gICAgICAgIGVudHJ5W3NpZGVdID0gbWFrZVF1YW50aXR5KGFzRmxvYXQsIHVuaXQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gMi4gRGFzaCByYW5nZSBcdTIwMTQgbWVhbmluZ2Z1bCBvbmx5IGZvciBgbG93YCBzbG90OyBzcGxpdHMgaW50byBsb3craGlnaC5cbiAgICAgIGNvbnN0IGRtID0gc2lkZVZhbC5tYXRjaChSUl9EQVNIX1JBTkdFKTtcbiAgICAgIGlmIChkbSAmJiBzaWRlID09PSBcImxvd1wiICYmIGVudHJ5LmhpZ2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCB2MSA9IHRyeVBhcnNlRmxvYXQoZG1bMV0hKTtcbiAgICAgICAgY29uc3QgdjIgPSB0cnlQYXJzZUZsb2F0KGRtWzJdISk7XG4gICAgICAgIGlmICh2MSAhPT0gbnVsbCAmJiB2MiAhPT0gbnVsbCkge1xuICAgICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2MSwgdW5pdCk7XG4gICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2MiwgdW5pdCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gMy4gQ29tcGFyYXRvciAoXHUyMjY3NjAsIDw9MC4wNCBldGMuKVxuICAgICAgY29uc3QgY20gPSBzaWRlVmFsLm1hdGNoKFJSX0NPTVBBUkFUT1IpO1xuICAgICAgaWYgKGNtKSB7XG4gICAgICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGNtWzJdISk7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3Qgb3AgPSBjbVsxXTtcbiAgICAgICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgICAgIGVudHJ5LmxvdyA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gNC4gXCJOb3JtYWwgKCBYIClcIiAvIFwiTm9ucmVhY3RpdmUgKCBYIClcIiBcdTIwMTQgWCBpcyB0aGUgY3V0b2ZmIChoaWdoIGJvdW5kKS5cbiAgICAgIGNvbnN0IHFtID0gc2lkZVZhbC5tYXRjaChSUl9RVUFMSVRBVElWRV9QQVJFTik7XG4gICAgICBpZiAocW0pIHtcbiAgICAgICAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQocW1bMl0hKTtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgICAgICBlbnRyeS5oaWdoID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIGNvbnN0IGRhc2hNYXRjaCA9IHMubWF0Y2goUlJfREFTSF9SQU5HRSk7XG4gIGlmIChkYXNoTWF0Y2gpIHtcbiAgICBjb25zdCB2MSA9IHRyeVBhcnNlRmxvYXQoZGFzaE1hdGNoWzFdISk7XG4gICAgY29uc3QgdjIgPSB0cnlQYXJzZUZsb2F0KGRhc2hNYXRjaFsyXSEpO1xuICAgIGlmICh2MSAhPT0gbnVsbCAmJiB2MiAhPT0gbnVsbCkge1xuICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYxLCB1bml0KTtcbiAgICAgIGVudHJ5LmhpZ2ggPSBtYWtlUXVhbnRpdHkodjIsIHVuaXQpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBjb25zdCBjbXBNYXRjaCA9IHMubWF0Y2goUlJfQ09NUEFSQVRPUik7XG4gIGlmIChjbXBNYXRjaCkge1xuICAgIGNvbnN0IHYgPSB0cnlQYXJzZUZsb2F0KGNtcE1hdGNoWzJdISk7XG4gICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG9wID0gY21wTWF0Y2hbMV07XG4gICAgICBpZiAob3AgPT09IFwiPlwiIHx8IG9wID09PSBcIj49XCIpIHtcbiAgICAgICAgZW50cnkubG93ID0gbWFrZVF1YW50aXR5KHYsIHVuaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50cnkuaGlnaCA9IG1ha2VRdWFudGl0eSh2LCB1bml0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgLy8gRmFsbCB0aHJvdWdoOiBxdWFsaXRhdGl2ZSBvciBjb21wbGV4IFx1MjAxNCB0ZXh0LW9ubHkgaXMgRkhJUi1jb3JyZWN0LlxuICByZXR1cm4gZW50cnk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCB0cnlQYXJzZVF1YW50aXR5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIFBhcnNlIFwiPiA0MC4wXCIgLyBcIjwwLjAxMFwiIC8gXCIxLDIzNC41XCIgXHUyMTkyIEZISVIgUXVhbnRpdHkgd2l0aCBjb21wYXJhdG9yLlxuICogUmV0dXJucyBudWxsIHdoZW4gdGhlIHJlc2lkdWFsIGFmdGVyIHN0cmlwcGluZyBhIGNvbXBhcmF0b3Igc3RpbGxcbiAqIGlzbid0IG51bWVyaWMgXHUyMDE0IGNhbGxlciBmYWxscyBiYWNrIHRvIHZhbHVlU3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJ5UGFyc2VRdWFudGl0eShcbiAgcmF3VmFsdWU6IHN0cmluZyB8IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHVuaXQ6IHN0cmluZyxcbik6IFF1YW50aXR5IHwgbnVsbCB7XG4gIGlmIChyYXdWYWx1ZSA9PT0gbnVsbCB8fCByYXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcbiAgbGV0IHMgPSB0cmFuc2xhdGVGdWxsd2lkdGgoU3RyaW5nKHJhd1ZhbHVlKS50cmltKCkpO1xuICBsZXQgY29tcGFyYXRvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGNtID0gcy5tYXRjaChDT01QQVJBVE9SX1JFKTtcbiAgaWYgKGNtKSB7XG4gICAgY29tcGFyYXRvciA9IGNtWzFdID8/IG51bGw7XG4gICAgcyA9IChjbVsyXSA/PyBcIlwiKS50cmltKCk7XG4gIH1cbiAgY29uc3QgdiA9IHRyeVBhcnNlRmxvYXQocy5yZXBsYWNlKC8sL2csIFwiXCIpKTtcbiAgaWYgKHYgPT09IG51bGwpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHVjdW1Db2RlID0gdG9VY3VtKHVuaXQpO1xuICBjb25zdCBxdHk6IFF1YW50aXR5ID0ge1xuICAgIHZhbHVlOiB2LFxuICAgIHN5c3RlbTogVUNVTV9TWVNURU0sXG4gIH07XG4gIC8vIFF1YW50aXR5LnVuaXQgKGh1bWFuLXJlYWRhYmxlKSBrZWVwcyB0aGUgb3JpZ2luYWwgTkhJIGxhYmVsIHNvIHVzZXJzXG4gIC8vIHN0aWxsIHNlZSAnXHVGRjA1JyBvciAnbUVxL0wnIHJhdy4gUXVhbnRpdHkuY29kZSBpcyBzdHJpY3QgVUNVTSBtYWNoaW5lXG4gIC8vIGNvZGUuIERyb3AgdW5pdCBkaXNwbGF5IHdoZW4gZW1wdHkgc28gd2UgZG9uJ3QgZW1pdCBcInVuaXRcIjogXCJcIi5cbiAgaWYgKHVuaXQpIHtcbiAgICBxdHkudW5pdCA9IHVuaXQ7XG4gIH1cbiAgaWYgKHVjdW1Db2RlICE9PSBudWxsKSB7XG4gICAgcXR5LmNvZGUgPSB1Y3VtQ29kZTtcbiAgfVxuICBpZiAoY29tcGFyYXRvcikge1xuICAgIHF0eS5jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgfVxuICByZXR1cm4gcXR5O1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuIiwgIi8qKlxuICogT2JzZXJ2YXRpb24gbWFwcGVyIFx1MjAxNCBzaW5nbGUtcm93IGFuZCBwYW5lbC1ncm91cGVkIHZhcmlhbnRzLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9vYnNlcnZhdGlvbi5weWAgKDEyMTIgbGluZXMpLiBJbmNsdWRlczpcbiAqICAgLSBtYXBPYnNlcnZhdGlvbihyYXcsIHBhdGllbnRJZCkgXHUyMTkyIHNpbmdsZSBPYnNlcnZhdGlvblxuICogICAtIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQoaXRlbXMsIHBhdGllbnRJZCkgXHUyMTkyIERpYWdub3N0aWNSZXBvcnQgKyBPYnNlcnZhdGlvbnNcbiAqICAgLSBjYW5vbmljYWxMYWJLZXkoZGlzcGxheSkgXHUyMDE0IGNyb3NzLXBhZ2UgZGVkdXAga2V5XG4gKiAgIC0gZmluZExvaW5jLCBidWlsZENvZGluZ3MsIG1hcEludGVycHJldGF0aW9uLCBkZXJpdmVJbnRlcnByZXRhdGlvblxuICogICAtIGRlZHVwZUNyb3NzRm9ybWF0LCBjb21iaW5lQnBJdGVtcywgZ3JvdXBCeU9yZGVyQ29kZVxuICogICAtIGluZmVyU3BlY2ltZW5cbiAqXG4gKiBGdW5jdGlvbmFsIHBhcml0eSB3aXRoIHRoZSBQeXRob24gaW1wbGVtZW50YXRpb24gaXMgdGhlIGdvYWwuIEZpZWxkXG4gKiBvcmRlciBpbiB0aGUgZW1pdHRlZCByZXNvdXJjZXMgbWF5IGRpZmZlciAoSlMgb2JqZWN0IGxpdGVyYWwgb3JkZXIpXG4gKiBidXQgY29udGVudCBpcyBpZGVudGljYWwuXG4gKi9cblxuaW1wb3J0ICogYXMgc3lzdGVtcyBmcm9tIFwiLi9zeXN0ZW1zXCI7XG5pbXBvcnQgeyBzdGFibGVJZCB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB7XG4gIERJU1BMQVlfRklSU1RfQ09ERVMsXG4gIExPSU5DX0RJU1BMQVksXG4gIExPSU5DX01BUCxcbiAgTkhJX1RPX0xPSU5DLFxuICBQQU5FTF9MT0lOQ19NQVAsXG59IGZyb20gXCIuL2xvaW5jLXRhYmxlc1wiO1xuaW1wb3J0IHtcbiAgdHlwZSBRdWFudGl0eSxcbiAgdHlwZSBSYW5nZUVudHJ5LFxuICBwYXJzZVJhbmdlLFxuICBwYXJzZVJhbmdlTXVsdGksXG4gIHRvVWN1bSxcbiAgdHJ5UGFyc2VRdWFudGl0eSxcbn0gZnJvbSBcIi4vcGFyc2Vyc1wiO1xuXG4vLyBcdTI1MDBcdTI1MDAgSW1hZ2luZyBkZXRlY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IElNQUdJTkdfS0VZV09SRFM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgXCJ1bHRyYXNvdW5kXCIsXG4gIFwic29ub2dyYW1cIixcbiAgXCJzb25vZ3JhcGh5XCIsXG4gIFwiZWNob1wiLFxuICBcImN0IFwiLFxuICBcImN0L1wiLFxuICBcImN0LVwiLFxuICBcImNvbXB1dGVkIHRvbW9ncmFwaHlcIixcbiAgXCJtcmlcIixcbiAgXCJtYWduZXRpYyByZXNvbmFuY2VcIixcbiAgXCJ4LXJheVwiLFxuICBcInhyYXlcIixcbiAgXCJ4IHJheVwiLFxuICBcIm1hbW1vZ3JhcGh5XCIsXG4gIFwibWFtbW9cIixcbiAgXCJla2dcIixcbiAgXCJlY2dcIixcbiAgXCJlbGVjdHJvY2FyZGlvZ3JhbVwiLFxuICBcImVuZG9zY29wXCIsXG4gIFwiY29sb25vc2NvcFwiLFxuICBcImdhc3Ryb3Njb3BcIixcbiAgXCJicm9uY2hvc2NvcFwiLFxuICBcInBldC9jdFwiLFxuICBcInBldCBcIixcbiAgXCJzcGVjdFwiLFxuICBcIlx1NUY3MVx1NTBDRlwiLFxuICBcIlx1OEQ4NVx1OTdGM1x1NkNFMlwiLFxuICBcIlx1OTZGQlx1ODE2Nlx1NjVCN1x1NUM2NFwiLFxuICBcIlx1NjgzOFx1NzhDMVx1NTE3MVx1NjMyRlwiLFxuICBcIlx1NUZDM1x1OTZGQlx1NTcxNlwiLFxuICBcIlx1NTE2N1x1ODk5Nlx1OTNFMVwiLFxuICBcIlx1NEU3M1x1NjIzRlx1NjUxRFx1NUY3MVwiLFxuXTtcblxuZnVuY3Rpb24gbG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5OiBzdHJpbmcsIGNvZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBoYXlzdGFjayA9IGAke2Rpc3BsYXl9ICR7Y29kZX1gLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBJTUFHSU5HX0tFWVdPUkRTLnNvbWUoKGt3KSA9PiBoYXlzdGFjay5pbmNsdWRlcyhrdykpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTE9JTkMgbG9va3VwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBOSElfTEFCX0NPREVfUkUgPSAvXlxcZHs0LDZ9W0EtWl0kLztcblxuZnVuY3Rpb24gaXNBc2NpaU9ubHkoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzLmNoYXJDb2RlQXQoaSkgPiAxMjcpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuXG4vKipcbiAqIFJldHVybiBwcmltYXJ5IExPSU5DIGZvciB0aGlzIGxhYi4gUGFuZWwtYXdhcmUgbG9va3VwOlxuICogICBBLiBTaW5nbGUtdGVzdCBOSEkgY29kZSBcdTIxOTIgdXNlIE5ISV9UT19MT0lOQyBkaXJlY3RseS5cbiAqICAgQi4gUGFuZWwgY29kZSBPUiB1bmtub3duIGNvZGUgXHUyMTkyIHdhbGsgTE9JTkNfTUFQIGJ5IGRpc3BsYXkga2V5d29yZC5cbiAqICAgQy4gRmFsbGJhY2s6IHBhbmVsLWxldmVsIExPSU5DIGZyb20gTkhJX1RPX0xPSU5DIGlmIGF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMb2luYyhjb2RlOiBzdHJpbmcsIGRpc3BsYXk6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAvLyBBLiBTaW5nbGUtdGVzdCBOSEkgY29kZSB3aW5zIG91dHJpZ2h0LlxuICBpZiAoY29kZSAmJiBjb2RlIGluIE5ISV9UT19MT0lOQyAmJiAhRElTUExBWV9GSVJTVF9DT0RFUy5oYXMoY29kZSkpIHtcbiAgICByZXR1cm4gTkhJX1RPX0xPSU5DW2NvZGVdID8/IG51bGw7XG4gIH1cblxuICBjb25zdCBjb21iaW5lZCA9IGAke2NvZGV9ICR7ZGlzcGxheX1gLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gQjEuIFBhbmVsLXNwZWNpZmljIGtleXdvcmQgbWFwIHJ1bnMgQkVGT1JFIHRoZSBnbG9iYWwgb25lLlxuICBpZiAoY29kZSBpbiBQQU5FTF9MT0lOQ19NQVApIHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGxvaW5jXSBvZiBPYmplY3QuZW50cmllcyhQQU5FTF9MT0lOQ19NQVBbY29kZV0hKSkge1xuICAgICAgaWYgKGlzQXNjaWlPbmx5KGtleSkpIHtcbiAgICAgICAgaWYgKG5ldyBSZWdFeHAoYFxcXFxiJHtlc2NhcGVSZWdleChrZXkudG9Mb3dlckNhc2UoKSl9YCkudGVzdChjb21iaW5lZCkpIHtcbiAgICAgICAgICByZXR1cm4gbG9pbmM7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY29tYmluZWQuaW5jbHVkZXMoa2V5LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIHJldHVybiBsb2luYztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBCLiBEaXNwbGF5LWtleXdvcmQgc2VhcmNoLlxuICBmb3IgKGNvbnN0IFtrZXksIGxvaW5jXSBvZiBPYmplY3QuZW50cmllcyhMT0lOQ19NQVApKSB7XG4gICAgaWYgKGlzQXNjaWlPbmx5KGtleSkpIHtcbiAgICAgIGlmIChuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnZXgoa2V5LnRvTG93ZXJDYXNlKCkpfWApLnRlc3QoY29tYmluZWQpKSB7XG4gICAgICAgIHJldHVybiBsb2luYztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNvbWJpbmVkLmluY2x1ZGVzKGtleS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgcmV0dXJuIGxvaW5jO1xuICAgIH1cbiAgfVxuXG4gIC8vIEMuIFBhbmVsIGNvZGUgd2l0aCBubyByZWNvZ25pc2VkIGl0ZW0gZGlzcGxheSBcdTIxOTIgZmFsbCBiYWNrLlxuICBpZiAoY29kZSAmJiBjb2RlIGluIE5ISV9UT19MT0lOQykge1xuICAgIHJldHVybiBOSElfVE9fTE9JTkNbY29kZV0gPz8gbnVsbDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBCdWlsZCB0aGUgT2JzZXJ2YXRpb24uY29kZS5jb2RpbmdbXSBsaXN0LlxuICogUHJpb3JpdHk6IExPSU5DIFx1MjE5MiBOSEkgXHU5MUFCXHU0RUU0XHU0RUUzXHU3OEJDIFx1MjE5MiBsb2NhbCBmYWxsYmFjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29kaW5ncyhcbiAgY29kZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgZGlzcGxheTogc3RyaW5nLFxuICBsb2luYzogc3RyaW5nIHwgbnVsbCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5bXSB7XG4gIGNvbnN0IGNvZGluZ3M6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5bXSA9IFtdO1xuICBpZiAobG9pbmMpIHtcbiAgICBjb2RpbmdzLnB1c2goe1xuICAgICAgc3lzdGVtOiBcImh0dHA6Ly9sb2luYy5vcmdcIixcbiAgICAgIGNvZGU6IGxvaW5jLFxuICAgICAgZGlzcGxheTogTE9JTkNfRElTUExBWVtsb2luY10gPz8gZGlzcGxheSxcbiAgICB9KTtcbiAgfVxuICBjb25zdCBjb2RlU3RyID0gKGNvZGUgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoY29kZVN0ciAmJiBOSElfTEFCX0NPREVfUkUudGVzdChjb2RlU3RyKSkge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IHN5c3RlbXMuTkhJX01FRElDQUxfT1JERVJfQ09ERSxcbiAgICAgIGNvZGU6IGNvZGVTdHIsXG4gICAgICBkaXNwbGF5LFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvZGluZ3MucHVzaCh7XG4gICAgICBzeXN0ZW06IHN5c3RlbXMuSElTX0xPQ0FMX0xBQl9DT0RFLFxuICAgICAgY29kZTogY29kZVN0ciB8fCBkaXNwbGF5LFxuICAgICAgZGlzcGxheSxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gY29kaW5ncztcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEludGVycHJldGF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBJTlRFUlBfU1lTID0gXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL3YzLU9ic2VydmF0aW9uSW50ZXJwcmV0YXRpb25cIjtcblxuZnVuY3Rpb24gaW50ZXJwQ29kaW5nKGNvZGU6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gIHJldHVybiB7IHN5c3RlbTogSU5URVJQX1NZUywgY29kZSwgZGlzcGxheSB9O1xufVxuXG5jb25zdCBJTlRFUlBfVEFCTEU6IFJlY29yZDxzdHJpbmcsIFtzdHJpbmcsIHN0cmluZ10+ID0ge1xuICBoaWdoOiBbXCJIXCIsIFwiSGlnaFwiXSxcbiAgbG93OiBbXCJMXCIsIFwiTG93XCJdLFxuICBub3JtYWw6IFtcIk5cIiwgXCJOb3JtYWxcIl0sXG4gIGNyaXRpY2FsOiBbXCJBQVwiLCBcIkNyaXRpY2FsIGFibm9ybWFsXCJdLFxuICBhYm5vcm1hbDogW1wiQVwiLCBcIkFibm9ybWFsXCJdLFxuICBwb3NpdGl2ZTogW1wiUE9TXCIsIFwiUG9zaXRpdmVcIl0sXG4gIG5lZ2F0aXZlOiBbXCJORUdcIiwgXCJOZWdhdGl2ZVwiXSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBJbnRlcnByZXRhdGlvbihcbiAgaW50ZXJwOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICBjb25zdCBrZXkgPSAoaW50ZXJwID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGVudHJ5ID0gSU5URVJQX1RBQkxFW2tleV07XG4gIGlmICghZW50cnkpIHJldHVybiBudWxsO1xuICByZXR1cm4gaW50ZXJwQ29kaW5nKGVudHJ5WzBdLCBlbnRyeVsxXSk7XG59XG5cbi8vIFBvc2l0aXZlIG1hcmtlcnMgXHUyMDE0IFwidGhpcyBpcyBkZXRlY3RlZCAvIGFibm9ybWFsXCIuXG5jb25zdCBQT1NfTUFSS0VSUyA9XG4gIC9eXFxzKig/OnBvc2l0aXZlfHBvc3xyZWFjdGl2ZXxkZXRlY3RlZHxhYm5vcm1hbHxwcmVzZW50fHRyYWNlfFsxLTRdP1xccypcXCsoPzpcXHMqW1xcK1xcLV0pKilcXHMqKD86XFwoLipcXCkpP1xccyokL2k7XG5cbi8vIE5lZ2F0aXZlIG1hcmtlcnMgXHUyMDE0IGV4cGxpY2l0bHkgbm9ybWFsL2Fic2VudC5cbmNvbnN0IE5FR19NQVJLRVJTID1cbiAgL15cXHMqKD86bmVnYXRpdmV8bmVnfG5vbnJlYWN0aXZlfG5vblstXFxzXT9yZWFjdGl2ZXxub3RbLVxcc10/ZGV0ZWN0ZWR8bmR8YWJzZW50fG5vbmV8bm9ybWFsfDB8Wy1cdTIwMTRcdTIwMTNdKylcXHMqKD86XFwoLipcXCkpP1xccyokL2k7XG5cbmZ1bmN0aW9uIGNsYXNzaWZ5UXVhbGl0YXRpdmUodGV4dDogdW5rbm93bik6IFwicG9zXCIgfCBcIm5lZ1wiIHwgbnVsbCB7XG4gIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XG4gIGxldCBzID0gU3RyaW5nKHRleHQpLnRyaW0oKTtcbiAgaWYgKHMuc3RhcnRzV2l0aChcIltcIikgJiYgcy5lbmRzV2l0aChcIl1cIikpIHtcbiAgICBzID0gcy5zbGljZSgxLCAtMSkudHJpbSgpO1xuICB9XG4gIGlmICghcykgcmV0dXJuIG51bGw7XG4gIGlmIChORUdfTUFSS0VSUy50ZXN0KHMpKSByZXR1cm4gXCJuZWdcIjtcbiAgaWYgKFBPU19NQVJLRVJTLnRlc3QocykpIHJldHVybiBcInBvc1wiO1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZUludGVycHJldGF0aW9uKFxuICB2YWx1ZVJhdzogc3RyaW5nLFxuICBxdHk6IFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICBycjogUmFuZ2VFbnRyeSB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgLy8gMS4gTnVtZXJpYyBwYXRoLlxuICBpZiAocXR5ICYmIHR5cGVvZiBxdHkudmFsdWUgPT09IFwibnVtYmVyXCIgJiYgcnIpIHtcbiAgICBjb25zdCB2ID0gcXR5LnZhbHVlO1xuICAgIGNvbnN0IGxvID0gcnIubG93Py52YWx1ZTtcbiAgICBjb25zdCBoaSA9IHJyLmhpZ2g/LnZhbHVlO1xuICAgIGlmICh0eXBlb2YgaGkgPT09IFwibnVtYmVyXCIgJiYgdiA+IGhpKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiSFwiLCBcIkhpZ2hcIik7XG4gICAgaWYgKHR5cGVvZiBsbyA9PT0gXCJudW1iZXJcIiAmJiB2IDwgbG8pIHJldHVybiBpbnRlcnBDb2RpbmcoXCJMXCIsIFwiTG93XCIpO1xuICAgIGlmICh0eXBlb2YgbG8gPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGhpID09PSBcIm51bWJlclwiKSByZXR1cm4gaW50ZXJwQ29kaW5nKFwiTlwiLCBcIk5vcm1hbFwiKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIDIuIFF1YWxpdGF0aXZlIHBhdGguXG4gIGNvbnN0IHZhbEtpbmQgPSBjbGFzc2lmeVF1YWxpdGF0aXZlKHZhbHVlUmF3KTtcbiAgY29uc3QgcmVmVGV4dCA9IHJyPy50ZXh0ID8/IFwiXCI7XG4gIGNvbnN0IHJlZktpbmQgPSBjbGFzc2lmeVF1YWxpdGF0aXZlKHJlZlRleHQpO1xuICBpZiAodmFsS2luZCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIGlmIChyZWZLaW5kID09PSBcIm5lZ1wiKSB7XG4gICAgaWYgKHZhbEtpbmQgPT09IFwicG9zXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJBXCIsIFwiQWJub3JtYWxcIik7XG4gICAgaWYgKHZhbEtpbmQgPT09IFwibmVnXCIpIHJldHVybiBpbnRlcnBDb2RpbmcoXCJOXCIsIFwiTm9ybWFsXCIpO1xuICB9XG4gIHJldHVybiB2YWxLaW5kID09PSBcInBvc1wiID8gaW50ZXJwQ29kaW5nKFwiUE9TXCIsIFwiUG9zaXRpdmVcIikgOiBpbnRlcnBDb2RpbmcoXCJORUdcIiwgXCJOZWdhdGl2ZVwiKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENhbm9uaWNhbCBsYWIga2V5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBMQUJfU1lOT05ZTVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIERpYWJldGVzXG4gIFx1OTFBM1x1NTMxNlx1ODg0MFx1N0QwNVx1N0QyMDogXCJIQkExQ1wiLFxuICBcdTdDRDZcdTUzMTZcdTg4NDBcdTgyNzJcdTdEMjA6IFwiSEJBMUNcIixcbiAgXHU3Q0Q2XHU1MzE2XHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhCQTFDXCIsXG4gIFwiR0xZQ0FURUQgSEVNT0dMT0JJTlwiOiBcIkhCQTFDXCIsXG4gIEhCQTFDOiBcIkhCQTFDXCIsXG4gIEExQzogXCJIQkExQ1wiLFxuICBcdTdBN0FcdTgxNzlcdTg4NDBcdTdDRDY6IFwiR0xVQ09TRV9GQVNUSU5HXCIsXG4gIFwiRkFTVElORyBHTFVDT1NFXCI6IFwiR0xVQ09TRV9GQVNUSU5HXCIsXG4gIFx1ODQ2MVx1ODQwNFx1N0NENjogXCJHTFVDT1NFXCIsXG4gIFx1ODg0MFx1N0NENjogXCJHTFVDT1NFXCIsXG4gIEdMVUNPU0U6IFwiR0xVQ09TRVwiLFxuICAvLyBDQkNcbiAgXHU3NjdEXHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4OiBcIldCQ1wiLFxuICBcdTc2N0RcdTg4NDBcdTc0MDM6IFwiV0JDXCIsXG4gIFdCQzogXCJXQkNcIixcbiAgXHU3RDA1XHU4ODQwXHU3NDAzXHU4QTA4XHU2NTc4OiBcIlJCQ1wiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDM6IFwiUkJDXCIsXG4gIFJCQzogXCJSQkNcIixcbiAgXHU4ODQwXHU3RDA1XHU3RDIwOiBcIkhFTU9HTE9CSU5cIixcbiAgSEVNT0dMT0JJTjogXCJIRU1PR0xPQklOXCIsXG4gIEhHQjogXCJIRU1PR0xPQklOXCIsXG4gIFx1ODg0MFx1NUJCOVx1N0E0RFx1NkJENDogXCJIRU1BVE9DUklUXCIsXG4gIEhFTUFUT0NSSVQ6IFwiSEVNQVRPQ1JJVFwiLFxuICBIQ1Q6IFwiSEVNQVRPQ1JJVFwiLFxuICBcdTg4NDBcdTVDMEZcdTY3N0Y6IFwiUExBVEVMRVRcIixcbiAgUExBVEVMRVQ6IFwiUExBVEVMRVRcIixcbiAgUExUOiBcIlBMQVRFTEVUXCIsXG4gIC8vIENCQyBpbmRpY2VzICgxMC1jaGFyIGFuZCA3LWNoYXIgQ0pLIGZvcm1zIGJlYXQgYmFyZSBcdTdEMDVcdTg4NDBcdTc0MDMpXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMFx1NkZDM1x1NUVBNjogXCJNQ0hDXCIsXG4gIFx1NUU3M1x1NTc0N1x1N0QwNVx1ODg0MFx1NzQwM1x1ODg0MFx1ODI3Mlx1N0QyMDogXCJNQ0hcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU2RkMzXHU1RUE2OiBcIk1DSENcIixcbiAgXHU1RTczXHU1NzQ3XHU3RDA1XHU4ODQwXHU3NDAzXHU5QUQ0XHU3QTREOiBcIk1DVlwiLFxuICBcdTdEMDVcdTg4NDBcdTc0MDNcdTUyMDZcdTVFMDNcdTVCRUNcdTVFQTY6IFwiUkRXXCIsXG4gIE1DVjogXCJNQ1ZcIixcbiAgTUNIOiBcIk1DSFwiLFxuICBNQ0hDOiBcIk1DSENcIixcbiAgUkRXOiBcIlJEV1wiLFxuICAvLyBDQkMgZGlmZmVyZW50aWFsXG4gIFx1NTVEQ1x1NEUyRFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJORVVUUk9QSElMXCIsXG4gIFx1NTVEQ1x1NEYwQVx1N0QwNVx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJFT1NJTk9QSElMXCIsXG4gIFx1NTVEQ1x1OTE3OFx1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJFT1NJTk9QSElMXCIsXG4gIFx1NTVEQ1x1OUU3Q1x1NjAyN1x1NzY3RFx1ODg0MFx1NzQwMzogXCJCQVNPUEhJTFwiLFxuICBcdTZEQ0JcdTVERjRcdTc0MDM6IFwiTFlNUEhPQ1lURVwiLFxuICBcdTU1QUVcdTY4MzhcdTc0MDM6IFwiTU9OT0NZVEVcIixcbiAgRU9TSU5PUEhJTFM6IFwiRU9TSU5PUEhJTFwiLFxuICBFT1NJTk9QSElMOiBcIkVPU0lOT1BISUxcIixcbiAgTkVVVFJPUEhJTFM6IFwiTkVVVFJPUEhJTFwiLFxuICBORVVUUk9QSElMOiBcIk5FVVRST1BISUxcIixcbiAgQkFTT1BISUxTOiBcIkJBU09QSElMXCIsXG4gIEJBU09QSElMOiBcIkJBU09QSElMXCIsXG4gIExZTVBIT0NZVEVTOiBcIkxZTVBIT0NZVEVcIixcbiAgTFlNUEhPQ1lURTogXCJMWU1QSE9DWVRFXCIsXG4gIE1PTk9DWVRFUzogXCJNT05PQ1lURVwiLFxuICBNT05PQ1lURTogXCJNT05PQ1lURVwiLFxuICAvLyBMaXBpZCBcdTIwMTQgTERML0hETCBtdXN0IHByZWNlZGUgYmFyZSBDSE9MRVNURVJPTC5cbiAgXCJMREwgQ0hPTEVTVEVST0xcIjogXCJMRExfQ1wiLFxuICBcIkxETC1DSE9MRVNURVJPTFwiOiBcIkxETF9DXCIsXG4gIFwiSERMIENIT0xFU1RFUk9MXCI6IFwiSERMX0NcIixcbiAgXCJIREwtQ0hPTEVTVEVST0xcIjogXCJIRExfQ1wiLFxuICBcdTRGNEVcdTVCQzZcdTVFQTZcdTgxQkRcdTU2RkFcdTkxODc6IFwiTERMX0NcIixcbiAgXHU5QUQ4XHU1QkM2XHU1RUE2XHU4MUJEXHU1NkZBXHU5MTg3OiBcIkhETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RFx1ODFCRFx1NTZGQVx1OTE4NzogXCJMRExfQ1wiLFxuICBcdTlBRDhcdTVCQzZcdTVFQTZcdTgxMDJcdTg2Q0JcdTc2N0RcdTgxQkRcdTU2RkFcdTkxODc6IFwiSERMX0NcIixcbiAgXHU4ODQwXHU2RTA1XHU3RTNEXHU4MUJEXHU1NkZBXHU5MTg3OiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFx1N0UzRFx1ODFCRFx1NTZGQVx1OTE4NzogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlQtQ0hPTEVTVEVST0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBcIlQtQ0hPTFwiOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFwiVE9UQUwgQ0hPTEVTVEVST0xcIjogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBDSE9MRVNURVJPTDogXCJUT1RBTF9DSE9MRVNURVJPTFwiLFxuICBDSE9MOiBcIlRPVEFMX0NIT0xFU1RFUk9MXCIsXG4gIFx1NEUwOVx1OTE3OFx1NzUxOFx1NkNCOVx1OTE2RjogXCJUUklHTFlDRVJJREVcIixcbiAgVFJJR0xZQ0VSSURFOiBcIlRSSUdMWUNFUklERVwiLFxuICBcIkhETC1DXCI6IFwiSERMX0NcIixcbiAgSERMOiBcIkhETF9DXCIsXG4gIFx1OUFEOFx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RDogXCJIRExfQ1wiLFxuICBcIkxETC1DKERJUkVDVClcIjogXCJMRExfQ1wiLFxuICBcIkxETC1DXCI6IFwiTERMX0NcIixcbiAgTERMOiBcIkxETF9DXCIsXG4gIFx1NEY0RVx1NUJDNlx1NUVBNlx1ODEwMlx1ODZDQlx1NzY3RDogXCJMRExfQ1wiLFxuICAvLyBSZW5hbCBcdTIwMTQgdXJpbmUgY3JlYXRpbmluZSB2YXJpYW50cyBiZWZvcmUgc2VydW0uXG4gIFx1NUMzRlx1NkRCMlx1ODA4Q1x1OTE3OFx1OTE1MDogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFwiVVJJTkUgQ1JFQVRJTklORVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBVElOSU5FKFUpXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUFUSU5JTkUtVVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJDUkVBKFUpXCI6IFwiVVJJTkVfQ1JFQVRJTklORVwiLFxuICBcIkNSRUEtVVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVLUNSRVwiOiBcIlVSSU5FX0NSRUFUSU5JTkVcIixcbiAgXCJVLUNSRUFcIjogXCJVUklORV9DUkVBVElOSU5FXCIsXG4gIFx1ODA4Q1x1OTE3OFx1OTE1MDogXCJDUkVBVElOSU5FXCIsXG4gIFx1ODA4Q1x1OTE1MFx1OTE3ODogXCJDUkVBVElOSU5FXCIsXG4gIFwiQ1JFQVRJTklORShCKVwiOiBcIkNSRUFUSU5JTkVcIixcbiAgQ1JFQVRJTklORTogXCJDUkVBVElOSU5FXCIsXG4gIENSRUE6IFwiQ1JFQVRJTklORVwiLFxuICBDUlROOiBcIkNSRUFUSU5JTkVcIixcbiAgRUdGUjogXCJFR0ZSXCIsXG4gIFx1NUMzRlx1N0QyMFx1NkMyRTogXCJCVU5cIixcbiAgQlVOOiBcIkJVTlwiLFxuICBcdTVDM0ZcdTkxNzhcdTlFN0NcdTVFQTY6IFwiVVJJTkVfUEhcIixcbiAgXHU1QzNGXHU2REIyXHU5MTc4XHU5RTdDXHU1RUE2OiBcIlVSSU5FX1BIXCIsXG4gIFx1OTE3OFx1OUU3Q1x1NUVBNjogXCJQSFwiLFxuICBcdTVDM0ZcdTkxNzg6IFwiVVJJQ19BQ0lEXCIsXG4gIFwiVVJJQyBBQ0lEXCI6IFwiVVJJQ19BQ0lEXCIsXG4gIFVSSUNfQUNJRDogXCJVUklDX0FDSURcIixcbiAgLy8gTGl2ZXJcbiAgQVNUOiBcIkFTVFwiLFxuICBBTFQ6IFwiQUxUXCIsXG4gIEdPVDogXCJBU1RcIixcbiAgR1BUOiBcIkFMVFwiLFxuICBcdTgxQkRcdTdEMDVcdTdEMjA6IFwiQklMSVJVQklOXCIsXG4gIEJJTElSVUJJTjogXCJCSUxJUlVCSU5cIixcbiAgXHU3NjdEXHU4NkNCXHU3NjdEOiBcIkFMQlVNSU5cIixcbiAgQUxCVU1JTjogXCJBTEJVTUlOXCIsXG4gIC8vIENhcmRpYWNcbiAgXHU1RkMzXHU4MDhDXHU2NUNCXHU4RjQ5XHU4NkNCXHU3NjdEOiBcIlRST1BPTklOXCIsXG4gIFRST1BPTklOOiBcIlRST1BPTklOXCIsXG4gIEJOUDogXCJCTlBcIixcbiAgXHU1RkMzXHU4MURGOiBcIlRST1BPTklOXCIsXG4gIC8vIFRoeXJvaWRcbiAgXHU3NTMyXHU3MkMwXHU4MTdBXHU1MjNBXHU2RkMwXHU3RDIwOiBcIlRTSFwiLFxuICBUU0g6IFwiVFNIXCIsXG4gIFx1NkUzOFx1OTZFMlx1NzUzMlx1NzJDMFx1ODE3QVx1N0QyMDogXCJGUkVFX1Q0XCIsXG4gIFwiRlJFRSBUNFwiOiBcIkZSRUVfVDRcIixcbiAgRlQ0OiBcIkZSRUVfVDRcIixcbiAgLy8gTWlzY1xuICBDXHU1M0NEXHU2MUM5XHU2MDI3XHU4NkNCXHU3NjdEOiBcIkNSUFwiLFxuICBcIkMtUkVBQ1RJVkUgUFJPVEVJTlwiOiBcIkNSUFwiLFxuICBDUlA6IFwiQ1JQXCIsXG4gIFwiSFMtQ1JQXCI6IFwiSFNfQ1JQXCIsXG4gIFx1NjUxRFx1OEI3N1x1ODE3QVx1NzI3OVx1NzU3MFx1NjI5N1x1NTM5RjogXCJQU0FcIixcbiAgUFNBOiBcIlBTQVwiLFxuICBcdTk0MzVcdTg2Q0JcdTc2N0Q6IFwiRkVSUklUSU5cIixcbiAgRkVSUklUSU46IFwiRkVSUklUSU5cIixcbiAgXHU4NDQ5XHU5MTc4OiBcIkZPTEFURVwiLFxuICBGT0xBVEU6IFwiRk9MQVRFXCIsXG4gIFx1N0RBRFx1NzUxRlx1N0QyMEIxMjogXCJWSVRBTUlOX0IxMlwiLFxuICBcIlZJVCBCMTJcIjogXCJWSVRBTUlOX0IxMlwiLFxuICBcIlZJVEFNSU4gQjEyXCI6IFwiVklUQU1JTl9CMTJcIixcbiAgXHU3NkFFXHU4Q0VBXHU3RDIwOiBcIkNPUlRJU09MXCIsXG4gIENPUlRJU09MOiBcIkNPUlRJU09MXCIsXG4gIFx1Njg4NVx1NkJEMjogXCJSUFJcIixcbiAgUlBSOiBcIlJQUlwiLFxuICBcdTk2QjFcdTc0MDNcdTgzQ0NcdTYyOTdcdTUzOUY6IFwiQ1JZUFRPQ09DQ0FMX0FHXCIsXG4gIENSWVBBRzogXCJDUllQVE9DT0NDQUxfQUdcIixcbiAgXHU4ODQwXHU2QzI4OiBcIkFNTU9OSUFcIixcbiAgQU1NT05JQTogXCJBTU1PTklBXCIsXG4gIFx1NTFERFx1ODg0MFx1OTE3Nlx1NTM5Rlx1NjY0Mlx1OTU5MzogXCJQVFwiLFxuICBBUFRUOiBcIkFQVFRcIixcbiAgSU5SOiBcIklOUlwiLFxufTtcblxuLy8gUHJlLXNvcnQga2V5cyBsb25nZXN0LWZpcnN0IHNvIGxvbmdlci9tb3JlLXNwZWNpZmljIG1hdGNoZXMgd2luLlxuY29uc3QgTEFCX1NZTk9OWU1fS0VZU19TT1JURUQgPSBPYmplY3Qua2V5cyhMQUJfU1lOT05ZTVMpLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpO1xuXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsTGFiS2V5KGRpc3BsYXk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWRpc3BsYXkpIHJldHVybiBcIlwiO1xuICBjb25zdCBzID0gZGlzcGxheS50cmltKCk7XG4gIGlmICghcykgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHNVcHBlciA9IHMudG9VcHBlckNhc2UoKTtcbiAgZm9yIChjb25zdCBrZXkgb2YgTEFCX1NZTk9OWU1fS0VZU19TT1JURUQpIHtcbiAgICBjb25zdCBrdSA9IGtleS50b1VwcGVyQ2FzZSgpO1xuICAgIGlmIChpc0FzY2lpT25seShrdSkpIHtcbiAgICAgIC8vIExlYWRpbmcgd29yZC1ib3VuZGFyeSBvbmx5IFx1MjAxNCBcIkFTVFwiIGluc2lkZSBcIkRJQVNUT0xJQ1wiIHNob3VsZCBub3QgbWF0Y2guXG4gICAgICBpZiAobmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ2V4KGt1KX1gKS50ZXN0KHNVcHBlcikpIHtcbiAgICAgICAgcmV0dXJuIExBQl9TWU5PTllNU1trZXldITtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNVcHBlci5pbmNsdWRlcyhrdSkpIHtcbiAgICAgIHJldHVybiBMQUJfU1lOT05ZTVNba2V5XSE7XG4gICAgfVxuICB9XG4gIHJldHVybiBzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikudHJpbSgpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGFuZWwgZ3JvdXBpbmcgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gY2prQ2hhcnMoczogc3RyaW5nKTogbnVtYmVyIHtcbiAgaWYgKCFzKSByZXR1cm4gMDtcbiAgbGV0IG4gPSAwO1xuICBmb3IgKGNvbnN0IGNoIG9mIHMpIHtcbiAgICBjb25zdCBjcCA9IGNoLmNvZGVQb2ludEF0KDApID8/IDA7XG4gICAgaWYgKGNwID49IDB4NGUwMCAmJiBjcCA8PSAweDlmZmYpIG4rKztcbiAgfVxuICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gaXNFbmdsaXNoRG9taW5hbnQoczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGxldCBsYXRpbiA9IDA7XG4gIGZvciAoY29uc3QgY2ggb2Ygcykge1xuICAgIGNvbnN0IGNwID0gY2guY2hhckNvZGVBdCgwKTtcbiAgICBpZiAoY3AgPCAxMjggJiYgL1tBLVphLXpdLy50ZXN0KGNoKSkgbGF0aW4rKztcbiAgfVxuICByZXR1cm4gbGF0aW4gPj0gMiAmJiBjamtDaGFycyhzKSA9PT0gMDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWVGb3JEZWR1cCh2OiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgbGV0IHMgPSBTdHJpbmcodikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIHMgPSBzLnJlcGxhY2UoL1xcKFteKV0qXFwpL2csIFwiXCIpLnRyaW0oKTtcbiAgcyA9IHMucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gIHJldHVybiBzO1xufVxuXG5mdW5jdGlvbiBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4ge1xuICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBzID0gU3RyaW5nKHZhbHVlKS50cmltKCk7XG4gIHJldHVybiBzICE9PSBcIlwiICYmIHMgIT09IFwiXHUyMDE0XCIgJiYgcyAhPT0gXCItXCIgJiYgcyAhPT0gXCJOL0FcIiAmJiBzICE9PSBcIm51bGxcIjtcbn1cblxuY29uc3QgTUVBTklOR0ZVTF9JTlRFUlBTID0gbmV3IFNldChbXG4gIFwibm9ybWFsXCIsXG4gIFwiYWJub3JtYWxcIixcbiAgXCJoaWdoXCIsXG4gIFwibG93XCIsXG4gIFwiY3JpdGljYWxcIixcbiAgXCJwb3NpdGl2ZVwiLFxuICBcIm5lZ2F0aXZlXCIsXG5dKTtcblxuZnVuY3Rpb24gZGVkdXBlUGFuZWxJdGVtcyhpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlWYWx1ZSA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10+KCk7XG4gIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICBjb25zdCBrID0gbm9ybWFsaXplVmFsdWVGb3JEZWR1cChpdC52YWx1ZSk7XG4gICAgY29uc3QgZ3JvdXAgPSBieVZhbHVlLmdldChrKTtcbiAgICBpZiAoZ3JvdXApIGdyb3VwLnB1c2goaXQpO1xuICAgIGVsc2UgYnlWYWx1ZS5zZXQoaywgW2l0XSk7XG4gIH1cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBncm91cCBvZiBieVZhbHVlLnZhbHVlcygpKSB7XG4gICAgaWYgKGdyb3VwLmxlbmd0aCA9PT0gMSkge1xuICAgICAgb3V0LnB1c2goZ3JvdXBbMF0hKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBjamtJdGVtcyA9IGdyb3VwLmZpbHRlcigoZykgPT4gY2prQ2hhcnMoU3RyaW5nKGcuZGlzcGxheSA/PyBcIlwiKSkgPj0gMik7XG4gICAgY29uc3QgZW5JdGVtcyA9IGdyb3VwLmZpbHRlcigoZykgPT4gaXNFbmdsaXNoRG9taW5hbnQoU3RyaW5nKGcuZGlzcGxheSA/PyBcIlwiKSkpO1xuICAgIGlmIChjamtJdGVtcy5sZW5ndGggPiAwICYmIGVuSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgb3V0LnB1c2goZW5JdGVtc1swXSEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQucHVzaCguLi5ncm91cCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGZpbHRlckxhYlJvd3MocmF3SXRlbXM6IGFueVtdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCByYXcgb2YgcmF3SXRlbXMpIHtcbiAgICBpZiAoIXJhdyB8fCB0eXBlb2YgcmF3ICE9PSBcIm9iamVjdFwiKSBjb250aW51ZTtcbiAgICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgICBpZiAobG9va3NMaWtlSW1hZ2luZyhkaXNwbGF5LCByYXcuY29kZSB8fCBcIlwiKSkgY29udGludWU7XG4gICAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gICAgY29uc3QgaW50ZXJwID0gKHJhdy5pbnRlcnByZXRhdGlvbiA/PyBcIlwiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaGFzVmFsdWUgPSBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZSk7XG4gICAgY29uc3QgaGFzTWVhbmluZ2Z1bEludGVycCA9IE1FQU5JTkdGVUxfSU5URVJQUy5oYXMoaW50ZXJwKTtcbiAgICBpZiAoIWhhc1ZhbHVlICYmICFoYXNNZWFuaW5nZnVsSW50ZXJwKSBjb250aW51ZTtcbiAgICBvdXQucHVzaChyYXcpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGRlZHVwZUNyb3NzRm9ybWF0KGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBvcmRlckNvZGUgPSAoaXQ6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcgPT5cbiAgICAoKGl0Lm9yZGVyX2NvZGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCkudG9VcHBlckNhc2UoKTtcblxuICBjb25zdCBieUtleSA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+PigpO1xuICBsZXQgaWR4Q291bnRlciA9IDA7XG4gIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgIGNvbnN0IHYgPSBTdHJpbmcoaXRlbS52YWx1ZSA/PyBcIlwiKS50cmltKCk7XG4gICAgY29uc3QgdW5pdCA9ICgoaXRlbS51bml0IGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICAgIGlmICghdikge1xuICAgICAgYnlLZXkuc2V0KGBfX25vX2RlZHVwX198JHtpZHhDb3VudGVyKyt9YCwgaXRlbSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3Qga2V5ID0gW1xuICAgICAgKGl0ZW0uZGF0ZSBhcyBzdHJpbmcpID8/IFwiXCIsXG4gICAgICB2LnRvTG93ZXJDYXNlKCksXG4gICAgICB1bml0LnRvTG93ZXJDYXNlKCksXG4gICAgICBvcmRlckNvZGUoaXRlbSksXG4gICAgXS5qb2luKFwifFwiKTtcbiAgICBjb25zdCBleGlzdGluZyA9IGJ5S2V5LmdldChrZXkpO1xuICAgIGlmICghZXhpc3RpbmcpIHtcbiAgICAgIGJ5S2V5LnNldChrZXksIGl0ZW0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vIFByZWZlciB0aGUgcm93IHdpdGggRkVXRVIgQ0pLIGNoYXJhY3RlcnMgKEVuZ2xpc2ggY2xpbmljYWwgcmVhZHMpLlxuICAgIGxldCBwcmltYXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgIGxldCBzZWNvbmRhcnk6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgaWYgKGNqa0NoYXJzKGl0ZW0uZGlzcGxheSA/PyBcIlwiKSA8IGNqa0NoYXJzKGV4aXN0aW5nLmRpc3BsYXkgPz8gXCJcIikpIHtcbiAgICAgIHByaW1hcnkgPSBpdGVtO1xuICAgICAgc2Vjb25kYXJ5ID0gZXhpc3Rpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByaW1hcnkgPSBleGlzdGluZztcbiAgICAgIHNlY29uZGFyeSA9IGl0ZW07XG4gICAgfVxuICAgIGNvbnN0IG1lcmdlZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4ucHJpbWFyeSB9O1xuICAgIGZvciAoY29uc3QgZiBvZiBbXCJvcmRlcl9jb2RlXCIsIFwib3JkZXJfbmFtZVwiLCBcImhvc3BpdGFsXCIsIFwiY29kZVwiXSkge1xuICAgICAgaWYgKCFtZXJnZWRbZl0gJiYgc2Vjb25kYXJ5W2ZdKSBtZXJnZWRbZl0gPSBzZWNvbmRhcnlbZl07XG4gICAgfVxuICAgIGJ5S2V5LnNldChrZXksIG1lcmdlZCk7XG4gIH1cbiAgcmV0dXJuIEFycmF5LmZyb20oYnlLZXkudmFsdWVzKCkpO1xufVxuXG5pbnRlcmZhY2UgQnBDb21wb25lbnQge1xuICBsb2luYzogc3RyaW5nO1xuICBkaXNwbGF5OiBzdHJpbmc7XG4gIHZhbHVlOiBudW1iZXI7XG4gIHVuaXQ6IHN0cmluZztcbiAgaW50ZXJwcmV0YXRpb25fdGV4dDogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBjb21iaW5lQnBJdGVtcyhpdGVtczogUmVjb3JkPHN0cmluZywgYW55PltdKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgYnlLZXkgPSBuZXcgTWFwPFxuICAgIHN0cmluZyxcbiAgICB7IHN5c3RvbGljPzogUmVjb3JkPHN0cmluZywgYW55PjsgZGlhc3RvbGljPzogUmVjb3JkPHN0cmluZywgYW55PiB9XG4gID4oKTtcbiAgY29uc3QgcGFzc1Rocm91Z2g6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgY29uc3QgZGlzcCA9IFN0cmluZyhpdC5kaXNwbGF5ID8/IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3Qga2V5ID0gYCR7aXQuZGF0ZSA/PyBcIlwifXwke2l0Lmhvc3BpdGFsID8/IFwiXCJ9YDtcbiAgICBpZiAoZGlzcC5pbmNsdWRlcyhcInN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIpKSB7XG4gICAgICBjb25zdCB2ID0gYnlLZXkuZ2V0KGtleSkgPz8ge307XG4gICAgICB2LnN5c3RvbGljID0gaXQ7XG4gICAgICBieUtleS5zZXQoa2V5LCB2KTtcbiAgICB9IGVsc2UgaWYgKGRpc3AuaW5jbHVkZXMoXCJkaWFzdG9saWMgYmxvb2QgcHJlc3N1cmVcIikpIHtcbiAgICAgIGNvbnN0IHYgPSBieUtleS5nZXQoa2V5KSA/PyB7fTtcbiAgICAgIHYuZGlhc3RvbGljID0gaXQ7XG4gICAgICBieUtleS5zZXQoa2V5LCB2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFzc1Rocm91Z2gucHVzaChpdCk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBwYXJ0cyBvZiBieUtleS52YWx1ZXMoKSkge1xuICAgIGNvbnN0IHMgPSBwYXJ0cy5zeXN0b2xpYztcbiAgICBjb25zdCBkID0gcGFydHMuZGlhc3RvbGljO1xuICAgIGNvbnN0IHByaW1hcnkgPSBzID8/IGQ7XG4gICAgaWYgKCFwcmltYXJ5KSBjb250aW51ZTtcbiAgICBjb25zdCBjb21wb25lbnRzOiBCcENvbXBvbmVudFtdID0gW107XG4gICAgY29uc3QgdHJ5QWRkID0gKHNyYzogUmVjb3JkPHN0cmluZywgYW55PiB8IHVuZGVmaW5lZCwgbG9pbmM6IHN0cmluZywgZGlzcGxheTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoIXNyYykgcmV0dXJuO1xuICAgICAgY29uc3QgdmFsID0gc3JjLnZhbHVlO1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCB8fCB2YWwgPT09IFwiXCIgfHwgdmFsID09PSBcIi1cIiB8fCB2YWwgPT09IFwiXHUyMDE0XCIpIHJldHVybjtcbiAgICAgIGNvbnN0IG51bSA9IE51bWJlci5wYXJzZUZsb2F0KFN0cmluZyh2YWwpLnJlcGxhY2UoLywvZywgXCJcIikpO1xuICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobnVtKSkgcmV0dXJuO1xuICAgICAgY29tcG9uZW50cy5wdXNoKHtcbiAgICAgICAgbG9pbmMsXG4gICAgICAgIGRpc3BsYXksXG4gICAgICAgIHZhbHVlOiBudW0sXG4gICAgICAgIHVuaXQ6IHNyYy51bml0IHx8IFwibW1IZ1wiLFxuICAgICAgICBpbnRlcnByZXRhdGlvbl90ZXh0OiBzcmMucmVmZXJlbmNlX3JhbmdlIHx8IFwiXCIsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHRyeUFkZChzLCBcIjg0ODAtNlwiLCBcIlN5c3RvbGljIGJsb29kIHByZXNzdXJlXCIpO1xuICAgIHRyeUFkZChkLCBcIjg0NjItNFwiLCBcIkRpYXN0b2xpYyBibG9vZCBwcmVzc3VyZVwiKTtcbiAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGNvbnN0IGNvbWJpbmVkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5wcmltYXJ5IH07XG4gICAgY29tYmluZWQuZGlzcGxheSA9IFwiQmxvb2QgUHJlc3N1cmVcIjtcbiAgICBjb21iaW5lZC5jb2RlID0gXCJcIjtcbiAgICBjb21iaW5lZC5vcmRlcl9jb2RlID0gXCJcIjtcbiAgICBjb21iaW5lZC5vcmRlcl9uYW1lID0gXCJCbG9vZCBQcmVzc3VyZVwiO1xuICAgIGNvbWJpbmVkLmNhdGVnb3J5ID0gXCJ2aXRhbC1zaWduc1wiO1xuICAgIGNvbWJpbmVkLmJwX2NvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuICAgIGNvbWJpbmVkLmJwX3BhbmVsX2xvaW5jID0gXCI4NTM1NC05XCI7XG4gICAgY29tYmluZWQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgY29tYmluZWQudW5pdCA9IHVuZGVmaW5lZDtcbiAgICBwYXNzVGhyb3VnaC5wdXNoKGNvbWJpbmVkKTtcbiAgfVxuXG4gIHJldHVybiBwYXNzVGhyb3VnaDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFNwZWNpbWVuIGluZmVyZW5jZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgU1BFQ0lNRU5fUlVMRVM6IFJlYWRvbmx5QXJyYXk8W1JlZ0V4cCwgc3RyaW5nXT4gPSBbXG4gIFsvXHU1QzNGfHVyaW5lfHVyaW5hbHkvaSwgXCJVcmluZVwiXSxcbiAgWy9cdTdDREV8XHU0RkJGXHU2RjVCXHU4ODQwfHN0b29sfGZlY2FsfGZhZWNhbHxvY2N1bHRcXHMqYmxvb2QvaSwgXCJTdG9vbFwiXSxcbiAgWy9cdTc1RjB8c3B1dHVtL2ksIFwiU3B1dHVtXCJdLFxuICBbL1x1ODE2Nlx1ODEwQVx1NkRCMnxjc2Z8Y2VyZWJyb3NwaW5hbC9pLCBcIkNlcmVicm9zcGluYWwgZmx1aWRcIl0sXG4gIFsvXHU4MEY4XHU2QzM0fHBsZXVyYWwvaSwgXCJQbGV1cmFsIGZsdWlkXCJdLFxuICBbL1x1ODE3OVx1NkMzNHxhc2NpdGVzfHBlcml0b25lYWwvaSwgXCJQZXJpdG9uZWFsIGZsdWlkXCJdLFxuICBbL1x1OTY3MFx1OTA1M3xcdTYyQjlcdTcyNDd8Y2VydmljYWx8cGFwXFxzKnNtZWFyfHZhZ2luYWwvaSwgXCJDZXJ2aWNhbC9WYWdpbmFsXCJdLFxuICBbL1x1OTVEQ1x1N0JDMFx1NkRCMnxzeW5vdmlhbHxqb2ludFxccypmbHVpZC9pLCBcIlN5bm92aWFsIGZsdWlkXCJdLFxuICBbL1x1N0Y4QVx1NkMzNHxhbW5pb3RpYy9pLCBcIkFtbmlvdGljIGZsdWlkXCJdLFxuICBbL1x1OUFBOFx1OUFEM3xib25lXFxzKm1hcnJvdy9pLCBcIkJvbmUgbWFycm93XCJdLFxuXTtcblxuZnVuY3Rpb24gaW5mZXJTcGVjaW1lbiguLi5oaW50czogQXJyYXk8c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZD4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgYmxvYiA9IGhpbnRzXG4gICAgLmZpbHRlcigoaCk6IGggaXMgc3RyaW5nID0+IEJvb2xlYW4oaCkpXG4gICAgLmpvaW4oXCIgXCIpXG4gICAgLnRvTG93ZXJDYXNlKCk7XG4gIGlmICghYmxvYikgcmV0dXJuIG51bGw7XG4gIGZvciAoY29uc3QgW3BhdHRlcm4sIGxhYmVsXSBvZiBTUEVDSU1FTl9SVUxFUykge1xuICAgIGlmIChwYXR0ZXJuLnRlc3QoYmxvYikpIHJldHVybiBsYWJlbDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIE1hcCBzaW5nbGUgT2JzZXJ2YXRpb24gKG5vbi1ncm91cGVkIHBhdGgpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZnVuY3Rpb24gbWFwT2JzZXJ2YXRpb24oXG4gIHJhdzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgcGF0aWVudElkOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB7XG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGUgfHwgXCJcIjtcbiAgaWYgKGxvb2tzTGlrZUltYWdpbmcoZGlzcGxheSwgY29kZSkpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHZhbHVlID0gcmF3LnZhbHVlO1xuICBjb25zdCBpbnRlcnAgPSAocmF3LmludGVycHJldGF0aW9uID8/IFwiXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgaGFzVmFsdWUgPSBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZSk7XG4gIGNvbnN0IGhhc01lYW5pbmdmdWxJbnRlcnAgPSBNRUFOSU5HRlVMX0lOVEVSUFMuaGFzKGludGVycCk7XG4gIGlmICghaGFzVmFsdWUgJiYgIWhhc01lYW5pbmdmdWxJbnRlcnApIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBjb2RlLCByYXcuZGF0ZSA/PyBcIlwiKTtcbiAgY29uc3QgbG9pbmMgPSBmaW5kTG9pbmMoY29kZSwgZGlzcGxheSk7XG5cbiAgY29uc3QgcmVzb3VyY2U6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgcmVzb3VyY2VUeXBlOiBcIk9ic2VydmF0aW9uXCIsXG4gICAgaWQ6IG9ic0lkLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IFwiZmluYWxcIixcbiAgICBjYXRlZ29yeTogW1xuICAgICAge1xuICAgICAgICBjb2Rpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgY29kZTogXCJsYWJvcmF0b3J5XCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBcIkxhYm9yYXRvcnlcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogYnVpbGRDb2RpbmdzKGNvZGUsIGRpc3BsYXksIGxvaW5jKSxcbiAgICAgIHRleHQ6IGRpc3BsYXkgfHwgXCJVbmtub3duIExhYlwiLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHtcbiAgICByZXNvdXJjZS5lZmZlY3RpdmVEYXRlVGltZSA9IGAke3Jhdy5kYXRlfVQwMDowMDowMCswODowMGA7XG4gIH1cblxuICBpZiAoaGFzVmFsdWUpIHtcbiAgICBjb25zdCBxdHkgPSB0cnlQYXJzZVF1YW50aXR5KFN0cmluZyh2YWx1ZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChxdHkpIHJlc291cmNlLnZhbHVlUXVhbnRpdHkgPSBxdHk7XG4gICAgZWxzZSByZXNvdXJjZS52YWx1ZVN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBpZiAocmF3LnJlZmVyZW5jZV9yYW5nZSkge1xuICAgIGNvbnN0IHJyID0gcGFyc2VSYW5nZShTdHJpbmcocmF3LnJlZmVyZW5jZV9yYW5nZSksIHJhdy51bml0ID8/IFwiXCIpO1xuICAgIGlmIChycikgcmVzb3VyY2UucmVmZXJlbmNlUmFuZ2UgPSBbcnJdO1xuICB9XG5cbiAgY29uc3QgaW50ZXJwQ29kaW5nUmVzdWx0ID1cbiAgICBtYXBJbnRlcnByZXRhdGlvbihpbnRlcnApIHx8XG4gICAgZGVyaXZlSW50ZXJwcmV0YXRpb24oXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKHZhbHVlKSA6IFwiXCIsXG4gICAgICByZXNvdXJjZS52YWx1ZVF1YW50aXR5IGFzIFF1YW50aXR5IHwgdW5kZWZpbmVkLFxuICAgICAgKHJlc291cmNlLnJlZmVyZW5jZVJhbmdlIGFzIFJhbmdlRW50cnlbXSB8IHVuZGVmaW5lZCk/LlswXSxcbiAgICApO1xuICBpZiAoaW50ZXJwQ29kaW5nUmVzdWx0KSB7XG4gICAgcmVzb3VyY2UuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtpbnRlcnBDb2RpbmdSZXN1bHRdIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQnVpbGQgb2JzZXJ2YXRpb24gd2l0aGluIGEgcGFuZWwgKHdpdGggY2Fub25pY2FsIGxhYiBrZXkgaWQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBidWlsZE9ic2VydmF0aW9uKFxuICByYXc6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuICBwYW5lbENvZGU6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgLy8gQlAgcGFuZWw6IHByZWJ1aWx0IGJ5IGNvbWJpbmVCcEl0ZW1zLlxuICBpZiAocmF3LmJwX2NvbXBvbmVudHMpIHtcbiAgICBjb25zdCBkYXRlID0gcmF3LmRhdGUgPz8gXCJcIjtcbiAgICBjb25zdCBob3NwaXRhbCA9IHJhdy5ob3NwaXRhbCA/PyBcIlwiO1xuICAgIGNvbnN0IG9ic0lkID0gc3RhYmxlSWQocGF0aWVudElkLCBcIm9ic1wiLCBcIkJQX1BBTkVMXCIsIGRhdGUsIGhvc3BpdGFsKTtcbiAgICBjb25zdCBjb21wb25lbnRSZXNvdXJjZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBjIG9mIHJhdy5icF9jb21wb25lbnRzIGFzIEJwQ29tcG9uZW50W10pIHtcbiAgICAgIGNvbnN0IHF0eTogUXVhbnRpdHkgPSB7XG4gICAgICAgIHZhbHVlOiBjLnZhbHVlLFxuICAgICAgICB1bml0OiBjLnVuaXQgfHwgXCJtbUhnXCIsXG4gICAgICAgIHN5c3RlbTogXCJodHRwOi8vdW5pdHNvZm1lYXN1cmUub3JnXCIsXG4gICAgICAgIGNvZGU6IHRvVWN1bShjLnVuaXQpID8/IFwibW1bSGddXCIsXG4gICAgICB9O1xuICAgICAgY29tcG9uZW50UmVzb3VyY2VzLnB1c2goe1xuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgY29kaW5nOiBbeyBzeXN0ZW06IFwiaHR0cDovL2xvaW5jLm9yZ1wiLCBjb2RlOiBjLmxvaW5jLCBkaXNwbGF5OiBjLmRpc3BsYXkgfV0sXG4gICAgICAgICAgdGV4dDogYy5kaXNwbGF5LFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZVF1YW50aXR5OiBxdHksXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgYnBPYnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICAgIGlkOiBvYnNJZCxcbiAgICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgICAgY2F0ZWdvcnk6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS9vYnNlcnZhdGlvbi1jYXRlZ29yeVwiLFxuICAgICAgICAgICAgICBjb2RlOiBcInZpdGFsLXNpZ25zXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiVml0YWwgU2lnbnNcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjb2RlOiB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vbG9pbmMub3JnXCIsXG4gICAgICAgICAgICBjb2RlOiByYXcuYnBfcGFuZWxfbG9pbmMgPz8gXCI4NTM1NC05XCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBcIkJsb29kIHByZXNzdXJlIHBhbmVsXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGV4dDogXCJCbG9vZCBQcmVzc3VyZVwiLFxuICAgICAgfSxcbiAgICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgICBjb21wb25lbnQ6IGNvbXBvbmVudFJlc291cmNlcyxcbiAgICB9O1xuICAgIGlmIChkYXRlKSBicE9icy5lZmZlY3RpdmVEYXRlVGltZSA9IGAke2RhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgICBpZiAoaG9zcGl0YWwpIGJwT2JzLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IGhvc3BpdGFsIH1dO1xuICAgIHJldHVybiBicE9icztcbiAgfVxuXG4gIGNvbnN0IGRpc3BsYXkgPSByYXcuZGlzcGxheSB8fCByYXcuY29kZSB8fCBcIlwiO1xuICBjb25zdCBjb2RlID0gKHBhbmVsQ29kZSA/IFN0cmluZyhwYW5lbENvZGUpIDogXCJcIikgfHwgcmF3Lm9yZGVyX2NvZGUgfHwgcmF3LmNvZGUgfHwgXCJcIjtcbiAgY29uc3QgdmFsdWUgPSByYXcudmFsdWU7XG4gIGNvbnN0IGludGVycCA9IChyYXcuaW50ZXJwcmV0YXRpb24gPz8gXCJcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0IGNhbm9uaWNhbCA9IGNhbm9uaWNhbExhYktleShkaXNwbGF5KSB8fCBkaXNwbGF5O1xuICBjb25zdCBvYnNJZCA9IHN0YWJsZUlkKHBhdGllbnRJZCwgXCJvYnNcIiwgY2Fub25pY2FsLCByYXcuZGF0ZSA/PyBcIlwiLCByYXcuaG9zcGl0YWwgPz8gXCJcIik7XG4gIGNvbnN0IGxvaW5jID0gZmluZExvaW5jKGNvZGUsIGRpc3BsYXkpO1xuXG4gIGNvbnN0IGNhdENvZGUgPSByYXcuY2F0ZWdvcnkgfHwgXCJsYWJvcmF0b3J5XCI7XG4gIGNvbnN0IENBVF9ESVNQTEFZOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIGxhYm9yYXRvcnk6IFwiTGFib3JhdG9yeVwiLFxuICAgIFwidml0YWwtc2lnbnNcIjogXCJWaXRhbCBTaWduc1wiLFxuICAgIGltYWdpbmc6IFwiSW1hZ2luZ1wiLFxuICAgIHByb2NlZHVyZTogXCJQcm9jZWR1cmVcIixcbiAgICBcInNvY2lhbC1oaXN0b3J5XCI6IFwiU29jaWFsIEhpc3RvcnlcIixcbiAgICBzdXJ2ZXk6IFwiU3VydmV5XCIsXG4gICAgZXhhbTogXCJFeGFtXCIsXG4gICAgdGhlcmFweTogXCJUaGVyYXB5XCIsXG4gICAgYWN0aXZpdHk6IFwiQWN0aXZpdHlcIixcbiAgfTtcbiAgY29uc3QgY2F0RGlzcGxheSA9XG4gICAgQ0FUX0RJU1BMQVlbY2F0Q29kZV0gPz8gY2F0Q29kZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNhdENvZGUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiT2JzZXJ2YXRpb25cIixcbiAgICBpZDogb2JzSWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgIGNhdGVnb3J5OiBbXG4gICAgICB7XG4gICAgICAgIGNvZGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN5c3RlbTogXCJodHRwOi8vdGVybWlub2xvZ3kuaGw3Lm9yZy9Db2RlU3lzdGVtL29ic2VydmF0aW9uLWNhdGVnb3J5XCIsXG4gICAgICAgICAgICBjb2RlOiBjYXRDb2RlLFxuICAgICAgICAgICAgZGlzcGxheTogY2F0RGlzcGxheSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogYnVpbGRDb2RpbmdzKGNvZGUsIGRpc3BsYXksIGxvaW5jKSxcbiAgICAgIHRleHQ6IGRpc3BsYXkgfHwgXCJVbmtub3duIExhYlwiLFxuICAgIH0sXG4gICAgc3ViamVjdDogeyByZWZlcmVuY2U6IGBQYXRpZW50LyR7cGF0aWVudElkfWAgfSxcbiAgfTtcblxuICBpZiAocmF3LmRhdGUpIHJlc291cmNlLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7cmF3LmRhdGV9VDAwOjAwOjAwKzA4OjAwYDtcbiAgaWYgKHJhdy5ob3NwaXRhbCkgcmVzb3VyY2UucGVyZm9ybWVyID0gW3sgZGlzcGxheTogcmF3Lmhvc3BpdGFsIH1dO1xuICBjb25zdCBzcGVjaW1lbiA9IGluZmVyU3BlY2ltZW4ocmF3Lm9yZGVyX25hbWUsIHJhdy5kaXNwbGF5LCByYXcuY29kZSk7XG4gIGlmIChzcGVjaW1lbikgcmVzb3VyY2Uuc3BlY2ltZW4gPSB7IGRpc3BsYXk6IHNwZWNpbWVuIH07XG5cbiAgY29uc3QgaGFzVmFsdWUgPSBpc01lYW5pbmdmdWxWYWx1ZSh2YWx1ZSk7XG4gIGlmIChoYXNWYWx1ZSkge1xuICAgIGNvbnN0IHF0eSA9IHRyeVBhcnNlUXVhbnRpdHkoU3RyaW5nKHZhbHVlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHF0eSkgcmVzb3VyY2UudmFsdWVRdWFudGl0eSA9IHF0eTtcbiAgICBlbHNlIHJlc291cmNlLnZhbHVlU3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChyYXcucmVmZXJlbmNlX3JhbmdlKSB7XG4gICAgY29uc3QgcnJzID0gcGFyc2VSYW5nZU11bHRpKFN0cmluZyhyYXcucmVmZXJlbmNlX3JhbmdlKSwgcmF3LnVuaXQgPz8gXCJcIik7XG4gICAgaWYgKHJycy5sZW5ndGggPiAwKSByZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSA9IHJycztcbiAgfVxuXG4gIGNvbnN0IGludGVycENvZGluZ1Jlc3VsdCA9XG4gICAgbWFwSW50ZXJwcmV0YXRpb24oaW50ZXJwKSB8fFxuICAgIGRlcml2ZUludGVycHJldGF0aW9uKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCA/IFN0cmluZyh2YWx1ZSkgOiBcIlwiLFxuICAgICAgcmVzb3VyY2UudmFsdWVRdWFudGl0eSBhcyBRdWFudGl0eSB8IHVuZGVmaW5lZCxcbiAgICAgIChyZXNvdXJjZS5yZWZlcmVuY2VSYW5nZSBhcyBSYW5nZUVudHJ5W10gfCB1bmRlZmluZWQpPy5bMF0sXG4gICAgKTtcbiAgaWYgKGludGVycENvZGluZ1Jlc3VsdCkge1xuICAgIHJlc291cmNlLmludGVycHJldGF0aW9uID0gW3sgY29kaW5nOiBbaW50ZXJwQ29kaW5nUmVzdWx0XSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEdyb3VwIGJ5IChvcmRlcl9jb2RlLCBkYXRlLCBob3NwaXRhbCkgXHUyMTkyIERSICsgT2JzZXJ2YXRpb25zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBncm91cEJ5T3JkZXJDb2RlKFxuICBjbGVhbmVkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4gIHBhdGllbnRJZDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgbGV0IHdvcmtpbmcgPSBkZWR1cGVDcm9zc0Zvcm1hdChjbGVhbmVkKTtcbiAgd29ya2luZyA9IGNvbWJpbmVCcEl0ZW1zKHdvcmtpbmcpO1xuXG4gIGNvbnN0IGdyb3VwcyA9IG5ldyBNYXA8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+W10+KCk7XG4gIGNvbnN0IGtleU1ldGEgPSBuZXcgTWFwPHN0cmluZywgeyBncm91cEtleUNvZGU6IHN0cmluZzsgZGF0ZTogc3RyaW5nOyBob3NwaXRhbDogc3RyaW5nIH0+KCk7XG4gIGZvciAoY29uc3QgcmF3IG9mIHdvcmtpbmcpIHtcbiAgICBjb25zdCBncm91cEtleUNvZGUgPSByYXcub3JkZXJfY29kZSB8fCByYXcuY29kZSB8fCByYXcuZGlzcGxheSB8fCBcIlwiO1xuICAgIGNvbnN0IGRhdGUgPSByYXcuZGF0ZSA/PyBcIlwiO1xuICAgIGNvbnN0IGhvc3BpdGFsID0gcmF3Lmhvc3BpdGFsID8/IFwiXCI7XG4gICAgY29uc3Qga2V5ID0gYCR7Z3JvdXBLZXlDb2RlfXwke2RhdGV9fCR7aG9zcGl0YWx9YDtcbiAgICBjb25zdCBhcnIgPSBncm91cHMuZ2V0KGtleSk7XG4gICAgaWYgKGFycikgYXJyLnB1c2gocmF3KTtcbiAgICBlbHNlIHtcbiAgICAgIGdyb3Vwcy5zZXQoa2V5LCBbcmF3XSk7XG4gICAgICBrZXlNZXRhLnNldChrZXksIHsgZ3JvdXBLZXlDb2RlOiBTdHJpbmcoZ3JvdXBLZXlDb2RlKSwgZGF0ZSwgaG9zcGl0YWwgfSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBba2V5LCBpdGVtc10gb2YgZ3JvdXBzLmVudHJpZXMoKSkge1xuICAgIGNvbnN0IG1ldGEgPSBrZXlNZXRhLmdldChrZXkpITtcbiAgICBjb25zdCBkZWR1cGVkID0gZGVkdXBlUGFuZWxJdGVtcyhpdGVtcyk7XG5cbiAgICBjb25zdCBvYnNSZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdO1xuICAgIGNvbnN0IHNlZW5PYnNJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGRlZHVwZWQpIHtcbiAgICAgIGNvbnN0IG9icyA9IGJ1aWxkT2JzZXJ2YXRpb24oaXQsIHBhdGllbnRJZCwgbWV0YS5ncm91cEtleUNvZGUpO1xuICAgICAgaWYgKCFvYnMpIGNvbnRpbnVlO1xuICAgICAgaWYgKHNlZW5PYnNJZHMuaGFzKG9icy5pZCkpIGNvbnRpbnVlO1xuICAgICAgc2Vlbk9ic0lkcy5hZGQob2JzLmlkKTtcbiAgICAgIG9ic1Jlc291cmNlcy5wdXNoKG9icyk7XG4gICAgfVxuICAgIGlmIChvYnNSZXNvdXJjZXMubGVuZ3RoID09PSAwKSBjb250aW51ZTtcblxuICAgIC8vIEJQIHBhbmVsOiBlbWl0IE9ic2VydmF0aW9uIGRpcmVjdGx5IChubyBEUiB3cmFwcGVyKS5cbiAgICBjb25zdCBpc0JwUGFuZWwgPSBkZWR1cGVkLmV2ZXJ5KChpdCkgPT4gaXQuYnBfY29tcG9uZW50cyB8fCBpdC5kaXNwbGF5ID09PSBcIkJsb29kIFByZXNzdXJlXCIpO1xuICAgIGlmIChpc0JwUGFuZWwpIHtcbiAgICAgIG91dC5wdXNoKC4uLm9ic1Jlc291cmNlcyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBvcmRlck5hbWUgPSBkZWR1cGVkLmZpbmQoKGl0KSA9PiBpdC5vcmRlcl9uYW1lKT8ub3JkZXJfbmFtZSA/PyBudWxsO1xuICAgIGNvbnN0IG1lbWJlcktleXMgPSBBcnJheS5mcm9tKFxuICAgICAgbmV3IFNldChkZWR1cGVkLmZpbHRlcigoaXQpID0+IGl0LmRpc3BsYXkpLm1hcCgoaXQpID0+IGNhbm9uaWNhbExhYktleShpdC5kaXNwbGF5KSkpLFxuICAgICkuc29ydCgpO1xuICAgIGNvbnN0IHBhbmVsU2lnbmF0dXJlID0gbWVtYmVyS2V5cy5qb2luKFwiLFwiKSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIGNvbnN0IGRySWQgPSBzdGFibGVJZChwYXRpZW50SWQsIFwiRFJcIiwgcGFuZWxTaWduYXR1cmUsIG1ldGEuZGF0ZSwgbWV0YS5ob3NwaXRhbCk7XG5cbiAgICBsZXQgcGFuZWxUaXRsZTogc3RyaW5nO1xuICAgIGlmIChkZWR1cGVkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3Qgc2luZ2xlRGlzcGxheSA9IGRlZHVwZWRbMF0hLmRpc3BsYXkgPz8gXCJcIjtcbiAgICAgIHBhbmVsVGl0bGUgPSBzaW5nbGVEaXNwbGF5IHx8IG9yZGVyTmFtZSB8fCBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lbFRpdGxlID0gb3JkZXJOYW1lIHx8IFN0cmluZyhtZXRhLmdyb3VwS2V5Q29kZSk7XG4gICAgfVxuXG4gICAgY29uc3QgZHJDb2RlU3lzdGVtID0gTkhJX0xBQl9DT0RFX1JFLnRlc3QoU3RyaW5nKG1ldGEuZ3JvdXBLZXlDb2RlKSA/PyBcIlwiKVxuICAgICAgPyBzeXN0ZW1zLk5ISV9NRURJQ0FMX09SREVSX0NPREVcbiAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfTEFCX0NPREU7XG5cbiAgICBjb25zdCBkcjogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgIHJlc291cmNlVHlwZTogXCJEaWFnbm9zdGljUmVwb3J0XCIsXG4gICAgICBpZDogZHJJZCxcbiAgICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICAgIHN0YXR1czogXCJmaW5hbFwiLFxuICAgICAgY2F0ZWdvcnk6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvZGluZzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzeXN0ZW06IFwiaHR0cDovL3Rlcm1pbm9sb2d5LmhsNy5vcmcvQ29kZVN5c3RlbS92Mi0wMDc0XCIsXG4gICAgICAgICAgICAgIGNvZGU6IFwiTEFCXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFib3JhdG9yeVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgY29kaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3lzdGVtOiBkckNvZGVTeXN0ZW0sXG4gICAgICAgICAgICBjb2RlOiBTdHJpbmcobWV0YS5ncm91cEtleUNvZGUpIHx8IFwiVU5LTk9XTlwiLFxuICAgICAgICAgICAgZGlzcGxheTogcGFuZWxUaXRsZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0ZXh0OiBwYW5lbFRpdGxlLFxuICAgICAgfSxcbiAgICAgIHN1YmplY3Q6IHsgcmVmZXJlbmNlOiBgUGF0aWVudC8ke3BhdGllbnRJZH1gIH0sXG4gICAgICByZXN1bHQ6IG9ic1Jlc291cmNlcy5tYXAoKG8pID0+ICh7IHJlZmVyZW5jZTogYE9ic2VydmF0aW9uLyR7by5pZH1gIH0pKSxcbiAgICB9O1xuICAgIGlmIChtZXRhLmRhdGUpIGRyLmVmZmVjdGl2ZURhdGVUaW1lID0gYCR7bWV0YS5kYXRlfVQwMDowMDowMCswODowMGA7XG4gICAgaWYgKG1ldGEuaG9zcGl0YWwpIGRyLnBlcmZvcm1lciA9IFt7IGRpc3BsYXk6IG1ldGEuaG9zcGl0YWwgfV07XG5cbiAgICBvdXQucHVzaChkcik7XG4gICAgb3V0LnB1c2goLi4ub2JzUmVzb3VyY2VzKTtcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBPYnNlcnZhdGlvbnNHcm91cGVkKHJhd0l0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10ge1xuICBjb25zdCBjbGVhbmVkID0gZmlsdGVyTGFiUm93cyhyYXdJdGVtcyk7XG4gIHJldHVybiBncm91cEJ5T3JkZXJDb2RlKGNsZWFuZWQsIHBhdGllbnRJZCk7XG59XG4iLCAiLyoqXG4gKiBQcm9jZWR1cmUgbWFwcGVyLlxuICpcbiAqIFBvcnQgb2YgYGJhY2tlbmQvYXBwL21hcHBlci9wcm9jZWR1cmUucHlgLiBSZXR1cm5zIG51bGwgZm9yIGxpc3QtcGFnZVxuICogcm93cyBsYWNraW5nIG5vdGUvYm9keV9zaXRlIFx1MjAxNCB0aGUgYWx0ZXJuYXRpdmUgaXMgdGhlIFNNQVJUIGFwcCBzaG93aW5nXG4gKiAyNSBcInByb2NlZHVyZXNcIiBjYWxsZWQgXCJNeWNvYmFjdGVyaWEgY3VsdHVyZVwiIC8gXCJWYWdpbmFsIHVsdHJhc291bmRcIlxuICogLyBldGMuIHdoaWNoIGFyZSBjbGluaWNhbGx5IHdyb25nLlxuICovXG5cbmltcG9ydCAqIGFzIHN5c3RlbXMgZnJvbSBcIi4vc3lzdGVtc1wiO1xuaW1wb3J0IHsgc3RhYmxlSWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmZ1bmN0aW9uIG1hcFN5c3RlbShzeXN0ZW1IaW50OiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IHR5cGVvZiBzeXN0ZW1IaW50ID09PSBcInN0cmluZ1wiID8gc3lzdGVtSGludC50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgaWYgKHMuaW5jbHVkZXMoXCJzbm9tZWRcIikpIHJldHVybiBzeXN0ZW1zLlNOT01FRF9DVDtcbiAgaWYgKHMuaW5jbHVkZXMoXCJpY2RcIikpIHJldHVybiBzeXN0ZW1zLklDRF8xMF9QQ1M7XG4gIHJldHVybiBzeXN0ZW1zLkhJU19MT0NBTF9QUk9DRURVUkVfQ09ERTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFByb2NlZHVyZShcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHtcbiAgY29uc3Qgbm90ZSA9ICgocmF3Lm5vdGUgYXMgc3RyaW5nKSA/PyBcIlwiKS50cmltKCk7XG4gIGNvbnN0IGJvZHlTaXRlID0gKChyYXcuYm9keV9zaXRlIGFzIHN0cmluZykgPz8gXCJcIikudHJpbSgpO1xuICBpZiAoIW5vdGUgJiYgIWJvZHlTaXRlKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBkaXNwbGF5ID0gcmF3LmRpc3BsYXkgPz8gXCJVbmtub3duIFByb2NlZHVyZVwiO1xuICBjb25zdCBjb2RlID0gcmF3LmNvZGU7XG4gIGNvbnN0IHN5c3RlbSA9IG1hcFN5c3RlbShyYXcuc3lzdGVtID8/IFwiXCIpO1xuXG4gIGNvbnN0IHJlc291cmNlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgIHJlc291cmNlVHlwZTogXCJQcm9jZWR1cmVcIixcbiAgICBpZDogc3RhYmxlSWQocGF0aWVudElkLCBjb2RlIHx8IGRpc3BsYXksIHJhdy5kYXRlID8/IFwiXCIpLFxuICAgIG1ldGE6IHsgdmVyc2lvbklkOiBcIjFcIiwgc291cmNlOiBcIm5oaS1maGlyLWJyaWRnZS9zY3JhcGVyXCIgfSxcbiAgICBzdGF0dXM6IHJhdy5zdGF0dXMgPz8gXCJjb21wbGV0ZWRcIixcbiAgICBzdWJqZWN0OiB7IHJlZmVyZW5jZTogYFBhdGllbnQvJHtwYXRpZW50SWR9YCB9LFxuICAgIGNvZGU6IHtcbiAgICAgIGNvZGluZzogW3sgc3lzdGVtLCBjb2RlOiBjb2RlIHx8IGRpc3BsYXksIGRpc3BsYXkgfV0sXG4gICAgICB0ZXh0OiBkaXNwbGF5LFxuICAgIH0sXG4gIH07XG5cbiAgaWYgKHJhdy5kYXRlKSB7XG4gICAgcmVzb3VyY2UucGVyZm9ybWVkRGF0ZVRpbWUgPSBgJHtyYXcuZGF0ZX1UMDA6MDA6MDArMDg6MDBgO1xuICB9XG4gIGlmIChib2R5U2l0ZSkge1xuICAgIHJlc291cmNlLmJvZHlTaXRlID0gW3sgdGV4dDogYm9keVNpdGUgfV07XG4gIH1cbiAgaWYgKG5vdGUpIHtcbiAgICByZXNvdXJjZS5ub3RlID0gW3sgdGV4dDogbm90ZSB9XTtcbiAgfVxuXG4gIHJldHVybiByZXNvdXJjZTtcbn1cbiIsICIvKipcbiAqIHBhZ2VfdHlwZSBcdTIxOTIgbWFwcGVyIGRpc3BhdGNoIHRhYmxlcy5cbiAqXG4gKiBQb3J0IG9mIGBiYWNrZW5kL2FwcC9tYXBwZXIvZGlzcGF0Y2gucHlgLiBCb3RoIHRoZSBwcmltYXJ5IHN0cnVjdHVyZWRcbiAqIHBhdGggKGAvc3luYy91cGxvYWQtc3RydWN0dXJlZGApIGFuZCB0aGUgTExNIGZhbGxiYWNrIHBhdGhcbiAqIChgL3N5bmMvdXBsb2FkLWh0bWxgKSBjb25zdW1lIHRoZSBzYW1lIHRhYmxlcyBzbyBvdXRwdXQgaXMgaWRlbnRpY2FsLlxuICovXG5cbmltcG9ydCB7IG1hcEFsbGVyZ3lJbnRvbGVyYW5jZSB9IGZyb20gXCIuL2FsbGVyZ3lcIjtcbmltcG9ydCB7IG1hcENvbmRpdGlvbiB9IGZyb20gXCIuL2NvbmRpdGlvblwiO1xuaW1wb3J0IHsgbWFwRGlhZ25vc3RpY1JlcG9ydCB9IGZyb20gXCIuL2RpYWdub3N0aWMtcmVwb3J0XCI7XG5pbXBvcnQgeyBtYXBFbmNvdW50ZXIgfSBmcm9tIFwiLi9lbmNvdW50ZXJcIjtcbmltcG9ydCB7IG1hcE1lZGljYXRpb25SZXF1ZXN0LCBtYXBNZWRpY2F0aW9uc0RlZHVwIH0gZnJvbSBcIi4vbWVkaWNhdGlvblwiO1xuaW1wb3J0IHsgbWFwT2JzZXJ2YXRpb24sIG1hcE9ic2VydmF0aW9uc0dyb3VwZWQgfSBmcm9tIFwiLi9vYnNlcnZhdGlvblwiO1xuaW1wb3J0IHsgbWFwUHJvY2VkdXJlIH0gZnJvbSBcIi4vcHJvY2VkdXJlXCI7XG5cbmV4cG9ydCB0eXBlIFBlclJvd01hcHBlciA9IChcbiAgcmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBwYXRpZW50SWQ6IHN0cmluZyxcbikgPT4gUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGw7XG5cbmV4cG9ydCB0eXBlIEdyb3VwTWFwcGVyID0gKGl0ZW1zOiBhbnlbXSwgcGF0aWVudElkOiBzdHJpbmcpID0+IFJlY29yZDxzdHJpbmcsIGFueT5bXTtcblxuLyoqXG4gKiBwYWdlX3R5cGUgXHUyMTkyIChwZXItcm93IG1hcHBlciwgSlNPTiBsaXN0IGtleSBpbnNpZGUgTExNIHJlc3BvbnNlKS5cbiAqIFVzZWQgYnkgdGhlIExMTSBmYWxsYmFjayBwYXRoIGFmdGVyIGV4dHJhY3Rpb247IHRoZSBzdHJ1Y3R1cmVkIHBhdGhcbiAqIGFsc28gY29uc3VsdHMgaXQgZm9yIHBlci1yb3cgcmVzb3VyY2UgdHlwZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBMSVNUX0hBTkRMRVJTOiBSZWNvcmQ8c3RyaW5nLCBbUGVyUm93TWFwcGVyLCBzdHJpbmddPiA9IHtcbiAgb2JzZXJ2YXRpb25zOiBbbWFwT2JzZXJ2YXRpb24sIFwib2JzZXJ2YXRpb25zXCJdLFxuICBtZWRpY2F0aW9uczogW21hcE1lZGljYXRpb25SZXF1ZXN0LCBcIm1lZGljYXRpb25zXCJdLFxuICBjb25kaXRpb25zOiBbbWFwQ29uZGl0aW9uLCBcImNvbmRpdGlvbnNcIl0sXG4gIGFsbGVyZ2llczogW21hcEFsbGVyZ3lJbnRvbGVyYW5jZSwgXCJhbGxlcmdpZXNcIl0sXG4gIGRpYWdub3N0aWNfcmVwb3J0czogW21hcERpYWdub3N0aWNSZXBvcnQsIFwiZGlhZ25vc3RpY19yZXBvcnRzXCJdLFxuICBwcm9jZWR1cmVzOiBbbWFwUHJvY2VkdXJlLCBcInByb2NlZHVyZXNcIl0sXG4gIGVuY291bnRlcnM6IFttYXBFbmNvdW50ZXIsIFwiZW5jb3VudGVyc1wiXSxcbn07XG5cbi8qKlxuICogcGFnZV90eXBlIFx1MjE5MiBncm91cC1hd2FyZSBtYXBwZXIgdGhhdCB0YWtlcyB0aGUgRlVMTCBsaXN0IGF0IG9uY2UuXG4gKiBVc2VkIHdoZW4gY3Jvc3Mtcm93IGdyb3VwaW5nL2RlZHVwIGlzIHJlcXVpcmVkIChOSEkgbGFiIHBhbmVscyxcbiAqIFx1NEUyRFx1ODJGMSBtZWRpY2F0aW9uIFx1OTZEOVx1OEE5RSBkZWR1cCkuXG4gKi9cbmV4cG9ydCBjb25zdCBHUk9VUF9IQU5ETEVSUzogUmVjb3JkPHN0cmluZywgR3JvdXBNYXBwZXI+ID0ge1xuICBvYnNlcnZhdGlvbnM6IG1hcE9ic2VydmF0aW9uc0dyb3VwZWQsXG4gIG1lZGljYXRpb25zOiBtYXBNZWRpY2F0aW9uc0RlZHVwLFxufTtcbiIsICIvKipcbiAqIEVuY291bnRlciBsaW5rZXIgXHUyMDE0IG1hdGNoIHJlc291cmNlcyB0byBFbmNvdW50ZXJzIGJ5IChob3NwaXRhbCwgZGF0ZSkuXG4gKlxuICogUHVyZSBmdW5jdGlvbjogbXV0YXRlcyBgcmVzb3VyY2VzYCBpbiBwbGFjZSB0byBhZGQgYGVuY291bnRlcmBcbiAqIHJlZmVyZW5jZXMgd2hlbiB0aGVyZSdzIGFuIHVuYW1iaWd1b3VzIG1hdGNoIGluIHRoZSBjYW5kaWRhdGVcbiAqIEVuY291bnRlciBsaXN0LiBTYW1lIGxvZ2ljIGFzIHRoZSBiYWNrZW5kJ3MgREItY291cGxlZCB2ZXJzaW9uLFxuICogbGlmdGVkIG91dCBzbyB0aGUgZXh0ZW5zaW9uJ3MgbG9jYWwgbW9kZSBjYW4gY2FsbCBpdCBvbiBhblxuICogaW4tbWVtb3J5IGFycmF5LlxuICovXG5cbmltcG9ydCB7IGRlcml2ZUludGVycHJldGF0aW9uIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb25cIjtcblxuY29uc3QgRU5DT1VOVEVSX0xJTktBQkxFID0gbmV3IFNldChbXG4gIFwiT2JzZXJ2YXRpb25cIixcbiAgXCJNZWRpY2F0aW9uUmVxdWVzdFwiLFxuICBcIkRpYWdub3N0aWNSZXBvcnRcIixcbiAgXCJQcm9jZWR1cmVcIixcbiAgXCJDb25kaXRpb25cIixcbiAgXCJBbGxlcmd5SW50b2xlcmFuY2VcIixcbl0pO1xuXG5mdW5jdGlvbiByZXNvdXJjZURhdGUocjogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImVmZmVjdGl2ZURhdGVUaW1lXCIsXG4gICAgXCJhdXRob3JlZE9uXCIsXG4gICAgXCJwZXJmb3JtZWREYXRlVGltZVwiLFxuICAgIFwib25zZXREYXRlVGltZVwiLFxuICAgIFwicmVjb3JkZWREYXRlXCIsXG4gICAgXCJpc3N1ZWRcIixcbiAgXSkge1xuICAgIGNvbnN0IHYgPSByW2tleV07XG4gICAgaWYgKHYpIHJldHVybiBTdHJpbmcodikuc2xpY2UoMCwgMTApO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IG9mIFtcImVmZmVjdGl2ZVBlcmlvZFwiLCBcInBlcmZvcm1lZFBlcmlvZFwiXSkge1xuICAgIGNvbnN0IHBlcmlvZCA9IHJba2V5XTtcbiAgICBpZiAocGVyaW9kICYmIHR5cGVvZiBwZXJpb2QgPT09IFwib2JqZWN0XCIgJiYgcGVyaW9kLnN0YXJ0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHBlcmlvZC5zdGFydCkuc2xpY2UoMCwgMTApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gXCJcIjtcbn1cblxuZnVuY3Rpb24gcmVzb3VyY2VIb3NwaXRhbChyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgZm9yIChjb25zdCBwIG9mIHIucGVyZm9ybWVyID8/IFtdKSB7XG4gICAgY29uc3QgZCA9IChwID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgaWYgKGQpIHJldHVybiBkO1xuICB9XG4gIGNvbnN0IHJlcSA9IHIucmVxdWVzdGVyID8/IHt9O1xuICBpZiAocmVxICYmIHR5cGVvZiByZXEgPT09IFwib2JqZWN0XCIgJiYgcmVxLmRpc3BsYXkpIHJldHVybiByZXEuZGlzcGxheTtcbiAgcmV0dXJuIFwiXCI7XG59XG5cbi8qKlxuICogRHJvcCBBTUIgRW5jb3VudGVycyB3aG9zZSAoaG9zcGl0YWwsIHN0YXJ0X2RhdGUpIGlzIGFscmVhZHkgY292ZXJlZFxuICogYnkgYW4gSU1QIEVuY291bnRlcidzIGFkbWlzc2lvbiBkYXkuIE5ISSBlbWl0cyB0aGUgc2FtZSBpbnBhdGllbnRcbiAqIHN0YXkgdHdpY2UgKElIS0UzMzAzIEFNQiBiaWxsaW5nIGVudHJ5ICsgSUhLRTMzMDkgSU1QIGRldGFpbCk7IHRoZVxuICogSU1QIG9uZSBpcyBjYW5vbmljYWwsIHRoZSBBTUIgaXMgYSBiaWxsaW5nIGFydGVmYWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVkdXBBZG1pc3Npb25EYXlBbWIoXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgY29uc3QgaW1wU3RhcnRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGZvciAoY29uc3QgciBvZiByZXNvdXJjZXMpIHtcbiAgICBpZiAoci5yZXNvdXJjZVR5cGUgIT09IFwiRW5jb3VudGVyXCIpIGNvbnRpbnVlO1xuICAgIGlmICgoci5jbGFzcyA/PyB7fSkuY29kZSAhPT0gXCJJTVBcIikgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IChyLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0ID0gU3RyaW5nKChyLnBlcmlvZCA/PyB7fSkuc3RhcnQgPz8gXCJcIikuc2xpY2UoMCwgMTApO1xuICAgIGlmIChob3NwICYmIHN0YXJ0KSBpbXBTdGFydHMuYWRkKGAke2hvc3B9ICR7c3RhcnR9YCk7XG4gIH1cbiAgaWYgKGltcFN0YXJ0cy5zaXplID09PSAwKSByZXR1cm4gcmVzb3VyY2VzO1xuICByZXR1cm4gcmVzb3VyY2VzLmZpbHRlcigocikgPT4ge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSA9PT0gXCJFbmNvdW50ZXJcIiAmJiAoci5jbGFzcyA/PyB7fSkuY29kZSA9PT0gXCJBTUJcIikge1xuICAgICAgY29uc3QgaG9zcCA9IChyLnNlcnZpY2VQcm92aWRlciA/PyB7fSkuZGlzcGxheSA/PyBcIlwiO1xuICAgICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKHIucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgICBpZiAoaW1wU3RhcnRzLmhhcyhgJHtob3NwfSAke3N0YXJ0fWApKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgYGVuY291bnRlcmAgcmVmZXJlbmNlIHRvIGVhY2ggbGlua2FibGUgcmVzb3VyY2Ugd2hlbiBpdHNcbiAqIChob3NwaXRhbCwgZGF0ZSkgbWF0Y2hlcyBleGFjdGx5IE9ORSBFbmNvdW50ZXIgaW4gYGNhbmRpZGF0ZXNgLlxuICogQ29uc2VydmF0aXZlIFx1MjAxNCBsZWF2ZXMgYW1iaWd1b3VzICgwIG9yID4xIG1hdGNoKSBjYXNlcyB1bmxpbmtlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMoXG4gIGNhbmRpZGF0ZXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sXG4pOiB2b2lkIHtcbiAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gIGNvbnN0IGV4YWN0SW5kZXggPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KCk7XG4gIGNvbnN0IGltcEJ5SG9zcCA9IG5ldyBNYXA8c3RyaW5nLCBBcnJheTxbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ10+PigpO1xuXG4gIGZvciAoY29uc3QgZSBvZiBjYW5kaWRhdGVzKSB7XG4gICAgaWYgKGUucmVzb3VyY2VUeXBlICE9PSBcIkVuY291bnRlclwiKSBjb250aW51ZTtcbiAgICBjb25zdCBob3NwID0gKGUuc2VydmljZVByb3ZpZGVyID8/IHt9KS5kaXNwbGF5ID8/IFwiXCI7XG4gICAgY29uc3Qgc3RhcnQgPSBTdHJpbmcoKGUucGVyaW9kID8/IHt9KS5zdGFydCA/PyBcIlwiKS5zbGljZSgwLCAxMCk7XG4gICAgaWYgKCFob3NwIHx8ICFzdGFydCkgY29udGludWU7XG4gICAgY29uc3Qga2V5ID0gYCR7aG9zcH0gJHtzdGFydH1gO1xuICAgIGNvbnN0IGFyciA9IGV4YWN0SW5kZXguZ2V0KGtleSkgPz8gW107XG4gICAgYXJyLnB1c2goZS5pZCk7XG4gICAgZXhhY3RJbmRleC5zZXQoa2V5LCBhcnIpO1xuICAgIGNvbnN0IGNscyA9IChlLmNsYXNzID8/IHt9KS5jb2RlID8/IFwiXCI7XG4gICAgaWYgKGNscyA9PT0gXCJJTVBcIikge1xuICAgICAgY29uc3QgZW5kID0gU3RyaW5nKChlLnBlcmlvZCA/PyB7fSkuZW5kID8/IFwiXCIpLnNsaWNlKDAsIDEwKTtcbiAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IGltcEJ5SG9zcC5nZXQoaG9zcCkgPz8gW107XG4gICAgICAgIGxpc3QucHVzaChbc3RhcnQsIGVuZCwgZS5pZF0pO1xuICAgICAgICBpbXBCeUhvc3Auc2V0KGhvc3AsIGxpc3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChleGFjdEluZGV4LnNpemUgPT09IDAgJiYgaW1wQnlIb3NwLnNpemUgPT09IDApIHJldHVybjtcblxuICBmb3IgKGNvbnN0IHIgb2YgcmVzb3VyY2VzKSB7XG4gICAgaWYgKCFFTkNPVU5URVJfTElOS0FCTEUuaGFzKHIucmVzb3VyY2VUeXBlKSkgY29udGludWU7XG4gICAgaWYgKHIuZW5jb3VudGVyIHx8IHIuY29udGV4dCkgY29udGludWU7XG4gICAgY29uc3QgaG9zcCA9IHJlc291cmNlSG9zcGl0YWwocik7XG4gICAgY29uc3QgZGF0ZSA9IHJlc291cmNlRGF0ZShyKTtcbiAgICBpZiAoIWhvc3AgfHwgIWRhdGUpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1hdGNoZXM6IHN0cmluZ1tdID0gWy4uLihleGFjdEluZGV4LmdldChgJHtob3NwfSAke2RhdGV9YCkgPz8gW10pXTtcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZvciAoY29uc3QgW3N0YXJ0LCBlbmQsIGVpZF0gb2YgaW1wQnlIb3NwLmdldChob3NwKSA/PyBbXSkge1xuICAgICAgICBpZiAoc3RhcnQgPD0gZGF0ZSAmJiBkYXRlIDw9IGVuZCkgbWF0Y2hlcy5wdXNoKGVpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCAhPT0gMSkgY29udGludWU7XG4gICAgci5lbmNvdW50ZXIgPSB7IHJlZmVyZW5jZTogYEVuY291bnRlci8ke21hdGNoZXNbMF19YCB9O1xuICB9XG59XG5cbi8qKlxuICogV2hlbiBhbiBPYnNlcnZhdGlvbiBjYXJyaWVzIG11bHRpcGxlIHJlZmVyZW5jZVJhbmdlIGVudHJpZXMgdGFnZ2VkXG4gKiB3aXRoIGBhcHBsaWVzVG9bKl0uY29kaW5nLmNvZGVgIGluIHttYWxlLCBmZW1hbGV9LCBwaWNrIHRoZSBvbmUgdGhhdFxuICogbWF0Y2hlcyB0aGUgcGF0aWVudCdzIGdlbmRlciBhbmQgcmUtZGVyaXZlIGludGVycHJldGF0aW9uIGFnYWluc3QgaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlU2V4U3RyYXRpZmllZFJhbmdlcyhcbiAgcGF0aWVudDogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwsXG4gIHJlc291cmNlczogUmVjb3JkPHN0cmluZywgYW55PltdLFxuKTogdm9pZCB7XG4gIGlmICghcGF0aWVudCkgcmV0dXJuO1xuICBjb25zdCBnZW5kZXIgPSBTdHJpbmcocGF0aWVudC5nZW5kZXIgPz8gXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGdlbmRlciAhPT0gXCJtYWxlXCIgJiYgZ2VuZGVyICE9PSBcImZlbWFsZVwiKSByZXR1cm47XG5cbiAgZm9yIChjb25zdCByIG9mIHJlc291cmNlcykge1xuICAgIGlmIChyLnJlc291cmNlVHlwZSAhPT0gXCJPYnNlcnZhdGlvblwiKSBjb250aW51ZTtcbiAgICBjb25zdCBycnM6IGFueVtdID0gci5yZWZlcmVuY2VSYW5nZSA/PyBbXTtcbiAgICBpZiAocnJzLmxlbmd0aCA8IDIpIGNvbnRpbnVlO1xuXG4gICAgbGV0IG1hdGNoOiBhbnkgPSBudWxsO1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgcnJzKSB7XG4gICAgICBmb3IgKGNvbnN0IGFwIG9mIGVudHJ5LmFwcGxpZXNUbyA/PyBbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgYXAuY29kaW5nID8/IFtdKSB7XG4gICAgICAgICAgaWYgKFN0cmluZyhjLmNvZGUgPz8gXCJcIikudG9Mb3dlckNhc2UoKSA9PT0gZ2VuZGVyKSB7XG4gICAgICAgICAgICBtYXRjaCA9IGVudHJ5O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaCkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAobWF0Y2gpIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoIW1hdGNoKSBjb250aW51ZTtcblxuICAgIHIucmVmZXJlbmNlUmFuZ2UgPSBbbWF0Y2hdO1xuICAgIGNvbnN0IHZhbFN0ciA9XG4gICAgICBTdHJpbmcoKHIudmFsdWVRdWFudGl0eSA/PyB7fSkudmFsdWUgPz8gXCJcIikgfHwgU3RyaW5nKHIudmFsdWVTdHJpbmcgPz8gXCJcIik7XG4gICAgY29uc3QgbmV3SW50ZXJwID0gZGVyaXZlSW50ZXJwcmV0YXRpb24odmFsU3RyLCByLnZhbHVlUXVhbnRpdHkgPz8gbnVsbCwgbWF0Y2gpO1xuICAgIGlmIChuZXdJbnRlcnApIHtcbiAgICAgIHIuaW50ZXJwcmV0YXRpb24gPSBbeyBjb2Rpbmc6IFtuZXdJbnRlcnBdIH1dO1xuICAgIH1cbiAgfVxufVxuIiwgIi8qKlxuICogUGF0aWVudCBtYXBwZXIuXG4gKlxuICogUG9ydCBvZiBgYmFja2VuZC9hcHAvbWFwcGVyL3BhdGllbnQucHlgLiBTYW1lIHB1YmxpYyBBUEk6XG4gKiAgIC0gbG9va3NMaWtlVHdOYXRpb25hbElkKHZhbHVlKSBcdTIwMTQgZXhwb3NlZCBmb3IgdGVzdHNcbiAqICAgLSBtYXBQYXRpZW50KHJhdykgXHUyMDE0IG1haW4gZW50cnlcbiAqL1xuXG5pbXBvcnQgeyBkZXJpdmVQYXRpZW50SWQgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQgKiBhcyBzeXN0ZW1zIGZyb20gXCIuL3N5c3RlbXNcIjtcblxuLy8gVGFpd2FuIG5hdGlvbmFsIElEOiAxIGxldHRlciArIDkgZGlnaXRzIChBMTIzNDU2Nzg5KS4gVXNlZCB0byBkZWNpZGVcbi8vIHdoZXRoZXIgdGhlIHBvcHVwLXN1cHBsaWVkIHBhdGllbnRfaWQgc2hvdWxkIGJlIGNvZGVkIHVuZGVyIHRoZVxuLy8gY2Fub25pY2FsIG5hdGlvbmFsLWlkIHN5c3RlbSBvciBhcyBhIGxvY2FsIGhvc3BpdGFsIE1STi5cbmNvbnN0IFRXX05BVElPTkFMX0lEX1JFID0gL15bQS1aXVsxMl1cXGR7OH0kLztcblxuZXhwb3J0IGZ1bmN0aW9uIGxvb2tzTGlrZVR3TmF0aW9uYWxJZCh2YWx1ZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBUV19OQVRJT05BTF9JRF9SRS50ZXN0KHZhbHVlLnRyaW0oKS50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFBhdGllbnQocmF3OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGNvbnN0IHJhd0lkID0gU3RyaW5nKHJhdy5pZGVudGlmaWVyID8/IHJhdy5pZCA/PyBcInVua25vd25cIik7XG4gIC8vIEZISVIgUGF0aWVudC5pZCBpcyB0aGUgaGFzaGVkL3NhbHRlZCBmb3JtLiBSZWFsIG5hdGlvbmFsIElEIHN0YXlzXG4gIC8vIG9ubHkgaW4gaWRlbnRpZmllcltdLnZhbHVlIHNvIGEgbGVha2VkIEJ1bmRsZSAob3IgYSBTTUFSVCBhcHAgdG9rZW5cbiAgLy8gcGF5bG9hZCBjb250YWluaW5nIHBhdGllbnRfaWQpIGRvZXNuJ3QgZGlzY2xvc2UgaXQgdmlhIGV2ZXJ5XG4gIC8vIHN1YmplY3QucmVmZXJlbmNlLlxuICBjb25zdCBwYXRpZW50SWQgPSBkZXJpdmVQYXRpZW50SWQocmF3SWQpO1xuXG4gIC8vIFVzZSBgPz9gIChub3QganVzdCBkZWZhdWx0IGFyZykgc28gZXhwbGljaXQgbnVsbCBmcm9tIHRoZSBMTE0gYWxzb1xuICAvLyBmYWxscyBiYWNrLiBMb2NhbCBtb2RlbHMgc29tZXRpbWVzIGVtaXQgbnVsbCBpbnN0ZWFkIG9mIG9taXR0aW5nLlxuICAvLyBUaGUgY2FsbGVyIGRlY2lkZXMgd2hldGhlciBgcmF3Lm5hbWVgIGlzIHRoZSB1c2VyJ3MgcmVhbCBuYW1lIG9yXG4gIC8vIGFscmVhZHktbWFza2VkIFx1MjAxNCBtYXBQYXRpZW50IGp1c3QgdHJhbnNjcmliZXMuIE1hc2tpbmcgcG9saWN5IGxpdmVzXG4gIC8vIGF0IHRoZSBVSSAvIGV4dGVuc2lvbiBsYXllciAoZHJpdmVuIGJ5IHRoZSB1c2VyLXRvZ2dsZWFibGVcbiAgLy8gYG1hc2tOYW1lRW5hYmxlZGAgc2V0dGluZykgc28gdGhlIHNhbWUgbWFwcGVyIGlzIGNvcnJlY3QgZm9yIGJvdGhcbiAgLy8gXCJcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjggPSByZWFsIG5hbWVcIiBhbmQgXCJcdTkxQUJcdTc2NDJcdTRFQkFcdTU0RTFcdTU5MUFcdTc1QzVcdTRFQkEgPSBtYXNrZWRcIiB3b3JrZmxvd3MuXG4gIGNvbnN0IG5hbWVUZXh0ID0gKHJhdy5uYW1lID8/IG51bGwpIHx8IFwiVW5rbm93blwiO1xuICBjb25zdCBwaG9uZSA9IChyYXcucGhvbmUgPz8gbnVsbCkgfHwgXCJcIjtcbiAgY29uc3QgYWRkcmVzcyA9IChyYXcuYWRkcmVzcyA/PyBudWxsKSB8fCBcIlwiO1xuXG4gIGNvbnN0IFtmYW1pbHksIGdpdmVuXSA9IHNwbGl0TmFtZShuYW1lVGV4dCk7XG4gIGNvbnN0IG5hbWVFbnRyeTogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgdXNlOiBcIm9mZmljaWFsXCIsIHRleHQ6IG5hbWVUZXh0IH07XG4gIGlmIChmYW1pbHkpIG5hbWVFbnRyeS5mYW1pbHkgPSBmYW1pbHk7XG4gIGlmIChnaXZlbi5sZW5ndGggPiAwKSBuYW1lRW50cnkuZ2l2ZW4gPSBnaXZlbjtcblxuICBjb25zdCByZXNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICByZXNvdXJjZVR5cGU6IFwiUGF0aWVudFwiLFxuICAgIGlkOiBwYXRpZW50SWQsXG4gICAgbWV0YTogeyB2ZXJzaW9uSWQ6IFwiMVwiLCBzb3VyY2U6IFwibmhpLWZoaXItYnJpZGdlL3NjcmFwZXJcIiB9LFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgIHtcbiAgICAgICAgdXNlOiBcIm9mZmljaWFsXCIsXG4gICAgICAgIHN5c3RlbTogbG9va3NMaWtlVHdOYXRpb25hbElkKHJhd0lkKVxuICAgICAgICAgID8gc3lzdGVtcy5UV19OQVRJT05BTF9JRFxuICAgICAgICAgIDogc3lzdGVtcy5ISVNfTE9DQUxfUEFUSUVOVF9NUk4sXG4gICAgICAgIHZhbHVlOiByYXdJZCxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBuYW1lOiBbbmFtZUVudHJ5XSxcbiAgICBnZW5kZXI6IG1hcEdlbmRlcihyYXcuZ2VuZGVyKSxcbiAgfTtcblxuICBjb25zdCBiaXJ0aERhdGUgPSByYXcuYmlydGhEYXRlO1xuICBpZiAoYmlydGhEYXRlKSByZXNvdXJjZS5iaXJ0aERhdGUgPSBiaXJ0aERhdGU7XG5cbiAgaWYgKHBob25lKSB7XG4gICAgcmVzb3VyY2UudGVsZWNvbSA9IFt7IHN5c3RlbTogXCJwaG9uZVwiLCB1c2U6IFwiaG9tZVwiLCB2YWx1ZTogcGhvbmUgfV07XG4gIH1cblxuICBpZiAoYWRkcmVzcykge1xuICAgIHJlc291cmNlLmFkZHJlc3MgPSBbeyB1c2U6IFwiaG9tZVwiLCB0ZXh0OiBhZGRyZXNzIH1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuXG4vKipcbiAqIFNwbGl0IGEgZnVsbCBuYW1lIGludG8gW2ZhbWlseSwgW2dpdmVuXV0gZm9yIEZISVIgUGF0aWVudC5uYW1lLlxuICpcbiAqIEhldXJpc3RpY3M6XG4gKiAgIC0gQ29udGFpbnMgd2hpdGVzcGFjZSBcdTIxOTIgV2VzdGVybjogbGFzdCB0b2tlbiA9IGZhbWlseSwgcmVzdCA9IGdpdmVuLlxuICogICAtIENKSyAvIHNpbmdsZS10b2tlbiBcdTIxOTIgZmlyc3QgY2hhciA9IGZhbWlseSwgcmVtYWluZGVyID0gZ2l2ZW4uXG4gKiAgIC0gXCJVbmtub3duXCIgb3IgZW1wdHkgXHUyMTkyIFtcIlwiLCBbXV1cbiAqXG4gKiBUd28tY2hhciBDSksgZmFtaWx5IG5hbWVzIChcdTZCNTBcdTk2N0QsIFx1NTNGOFx1OTlBQywgXHUyMDI2KSBhcmUgTk9UIGF1dG8tZGV0ZWN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHNwbGl0TmFtZShmdWxsTmFtZTogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nW11dIHtcbiAgY29uc3QgbmFtZSA9IChmdWxsTmFtZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICghbmFtZSB8fCBuYW1lID09PSBcIlVua25vd25cIikgcmV0dXJuIFtcIlwiLCBbXV07XG4gIGlmICgvXFxzLy50ZXN0KG5hbWUpKSB7XG4gICAgY29uc3QgcGFydHMgPSBuYW1lLnNwbGl0KC9cXHMrLyk7XG4gICAgcmV0dXJuIFtwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSEsIHBhcnRzLnNsaWNlKDAsIC0xKV07XG4gIH1cbiAgLy8gQ0pLIGZhbGxiYWNrIFx1MjAxNCBpdGVyYXRlIGNvZGVwb2ludHMsIG5vdCBVVEYtMTYgY29kZSB1bml0cywgc29cbiAgLy8gc3Vycm9nYXRlLXBhaXIgY2hhcmFjdGVycyAocmFyZSBpbiBDaGluZXNlIG5hbWVzIGJ1dCBwb3NzaWJsZSlcbiAgLy8gZG9uJ3QgZ2V0IHNwbGl0IG1pZC1jaGFyYWN0ZXIuXG4gIGNvbnN0IGNvZGVwb2ludHMgPSBBcnJheS5mcm9tKG5hbWUpO1xuICByZXR1cm4gY29kZXBvaW50cy5sZW5ndGggPiAxID8gW2NvZGVwb2ludHNbMF0hLCBbY29kZXBvaW50cy5zbGljZSgxKS5qb2luKFwiXCIpXV0gOiBbbmFtZSwgW11dO1xufVxuXG5mdW5jdGlvbiBtYXBHZW5kZXIoZ2VuZGVyOiB1bmtub3duKTogc3RyaW5nIHtcbiAgY29uc3QgZyA9IHR5cGVvZiBnZW5kZXIgPT09IFwic3RyaW5nXCIgPyBnZW5kZXIudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gIGlmIChbXCJtYWxlXCIsIFwibVwiLCBcIlx1NzUzN1wiLCBcIlx1NzUzN1x1NjAyN1wiXS5pbmNsdWRlcyhnKSkgcmV0dXJuIFwibWFsZVwiO1xuICBpZiAoW1wiZmVtYWxlXCIsIFwiZlwiLCBcIlx1NTk3M1wiLCBcIlx1NTk3M1x1NjAyN1wiXS5pbmNsdWRlcyhnKSkgcmV0dXJuIFwiZmVtYWxlXCI7XG4gIHJldHVybiBcInVua25vd25cIjtcbn1cbiIsICIvLyBTZXJ2aWNlIHdvcmtlciBmb3IgTkhJLUZISVIgQnJpZGdlIFx1MjAxNCBvd25zIHRoZSBsb25nLXJ1bm5pbmdcbi8vIFwiU3luYyBUaGlzIFBhdGllbnRcIiB3b3JrZmxvdyBzbyB0aGUgcG9wdXAgY2FuIGNsb3NlIG1pZC1zeW5jIHdpdGhvdXRcbi8vIGFib3J0aW5nIGl0LlxuLy9cbi8vIExpZmVjeWNsZTpcbi8vICAgLSBwb3B1cCBwb3N0cyB7dHlwZTogXCJzdGFydE5oaUFwaVN5bmNcIiwgcGF5bG9hZH0gIFx1MjE5MiBOSEkgSlNPTi1BUEkgc3luY1xuLy8gICAtIGJhY2tncm91bmQgcnVucyB0aGUgZnVsbCBzeW5jIHNlcXVlbmNlLCB1cGRhdGluZyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuLy8gICAtIHBvcHVwIHJlYWRzIGNocm9tZS5zdG9yYWdlLmxvY2FsIG9uIHJlb3BlbiB0byBzaG93IHByb2dyZXNzXG4vL1xuLy8gTW9kZXM6XG4vLyAgIC0gXCJsb2NhbFwiICAgXHUyMTkyIGFmdGVyIE5ISSBmZXRjaCwgcnVuIG1hcHBlcnMgaW4tZXh0ZW5zaW9uLCBkb3dubG9hZCBhXG4vLyAgICAgICAgICAgICAgICAgRkhJUiBCdW5kbGUgdG8gdGhlIHVzZXIncyBtYWNoaW5lLiBObyBiYWNrZW5kIHJlcXVpcmVkLlxuLy8gICAtIFwiYmFja2VuZFwiIFx1MjE5MiBQT1NUIHBlci1wYWdlX3R5cGUgaXRlbXMgdG8gL3N5bmMvdXBsb2FkLXN0cnVjdHVyZWRcbi8vICAgICAgICAgICAgICAgICAoZXhpc3RpbmcgYmVoYXZpb3VyKTsgZGFzaGJvYXJkICsgU01BUlQgYXBwIHVzZSB0aGVcbi8vICAgICAgICAgICAgICAgICBiYWNrZW5kJ3MgRkhJUiBzdG9yZS5cblxuaW1wb3J0IHtcbiAgR1JPVVBfSEFORExFUlMsXG4gIExJU1RfSEFORExFUlMsXG4gIGRlZHVwQWRtaXNzaW9uRGF5QW1iLFxuICBkZXJpdmVQYXRpZW50SWQsXG4gIGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMsXG4gIG1hcFBhdGllbnQsXG4gIG1hc2tJZCxcbiAgbWFza05hbWUsXG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzLFxuICBzZXRTdGFibGVJZFNhbHQsXG59IGZyb20gXCJAbmhpLWZoaXItYnJpZGdlL21hcHBlclwiO1xuXG4vLyBJbnN0YWxsLWxvY2FsIHNhbHQgZm9yIHN0YWJsZUlkKCkuIFdpdGhvdXQgdGhpcywgdGhlIFNIQS0xIGhhc2hlc1xuLy8gZGVyaXZlZCBmcm9tIHRoZSBwYXRpZW50J3MgbmF0aW9uYWwgSUQgYXJlIHJldmVyc2libGUgYnkgYnJ1dGUgZm9yY2Vcbi8vIG92ZXIgdGhlIH4zME0gVGFpd2FuZXNlIElEIHNwYWNlLiBMb2FkZWQgb25jZSBvbiBTVyBpbml0LlxuY29uc3QgU1RBQkxFX0lEX1NBTFRfS0VZID0gXCJzdGFibGVJZFNhbHRcIjtcbmFzeW5jIGZ1bmN0aW9uIF9lbnN1cmVTdGFibGVJZFNhbHQoKSB7XG4gIGNvbnN0IHN0b3JlZCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVEFCTEVfSURfU0FMVF9LRVkpO1xuICBsZXQgc2FsdCA9IHN0b3JlZFtTVEFCTEVfSURfU0FMVF9LRVldO1xuICBpZiAoIXNhbHQpIHtcbiAgICBjb25zdCBidWYgPSBuZXcgVWludDhBcnJheSgzMik7XG4gICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpO1xuICAgIHNhbHQgPSBBcnJheS5mcm9tKGJ1ZiwgKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbU1RBQkxFX0lEX1NBTFRfS0VZXTogc2FsdCB9KTtcbiAgfVxuICBzZXRTdGFibGVJZFNhbHQoc2FsdCk7XG59XG5fZW5zdXJlU3RhYmxlSWRTYWx0KCk7XG5cbmNvbnN0IFNUT1JBR0VfS0VZID0gXCJzeW5jU3RhdHVzXCI7XG5jb25zdCBzbGVlcCA9IChtcykgPT4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgbXMpKTtcblxuLy8gQ2FuY2VsbGF0aW9uIGZsYWcgc2V0IGJ5IHBvcHVwJ3Mgc3RvcCBidXR0b24uIENoZWNrZWQgYXQgc3RyYXRlZ2ljIHBvaW50c1xuLy8gaW4gcnVuTmhpQXBpU3luYyAoYmV0d2VlbiBwaGFzZXMsIGJlZm9yZSBlYWNoIGRldGFpbCBwYWdlKSBzbyB0aGVcbi8vIGluLXByb2dyZXNzIHN5bmMgZXhpdHMgcHJvbXB0bHkgd2hlbiB0aGUgdXNlciBoaXRzIFN0b3AuIENsZWFyZWQgYXQgdGhlXG4vLyBzdGFydCBvZiBlYWNoIG5ldyBzeW5jIHJ1bi5cbmxldCBfY2FuY2VsbGVkID0gZmFsc2U7XG4vLyBDb250ZXh0IGZvciB0aGUgaW4tZmxpZ2h0IHN5bmMgc28gdGhlIHN0b3BTeW5jIGhhbmRsZXIgY2FuIHdpcGUgcGFydGlhbFxuLy8gZGF0YSB3aXRob3V0IHRoZSBwb3B1cCBuZWVkaW5nIHRvIHBhc3MgaXQgYmFjay4gU2V0IGF0IHRoZSB0b3Agb2Zcbi8vIHJ1bk5oaUFwaVN5bmM7IGNsZWFyZWQgb24gY29tcGxldGlvbiAoc3VjY2Vzcy9mYWlsdXJlL2NhbmNlbCkuXG5sZXQgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xuY29uc3QgQ0FOQ0VMX0VSUk9SID0gXCJfX1NZTkNfQ0FOQ0VMTEVEX19cIjtcbi8vIFRocm93biB3aGVuIE5ISSBkZXRlY3RzIHRoZSBzZXNzaW9uIGhhcyBleHBpcmVkIChsb2dpbiBwYWdlIHJlbmRlcmVkLCBvclxuLy8gdGFiIHJlZGlyZWN0ZWQgdG8gYXV0aCBuYW1lc3BhY2UpLiBBYm9ydHMgc3luYyBpbW1lZGlhdGVseSBzbyB0aGUgdXNlciBjYW5cbi8vIHJlLWxvZ2luIGFuZCByZXRyeSBpbnN0ZWFkIG9mIHRpbWluZyBvdXQgb24gZXZlcnkgcmVtYWluaW5nIHBhZ2UuXG5jb25zdCBTRVNTSU9OX0VYUElSRURfRVJST1IgPSBcIl9fU0VTU0lPTl9FWFBJUkVEX19cIjtcbi8vIEVycm9ycyB0aGF0IHNob3VsZCBhYm9ydCB0aGUgZW50aXJlIHN5bmMgaW5zdGVhZCBvZiBiZWluZyBzd2FsbG93ZWRcbi8vIHBlci1waGFzZS5cbmNvbnN0IEFCT1JUX0VSUk9SUyA9IG5ldyBTZXQoW0NBTkNFTF9FUlJPUiwgU0VTU0lPTl9FWFBJUkVEX0VSUk9SXSk7XG5mdW5jdGlvbiBjaGVja0NhbmNlbCgpIHtcbiAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRTdGF0dXMocGFydGlhbCkge1xuICAvLyBBZnRlciBjYW5jZWxsYXRpb24sIHRoZSBwb3B1cCBoYXMgYWxyZWFkeSB3cml0dGVuIHRoZSBkZWZpbml0aXZlXG4gIC8vIFwic3RvcHBlZFwiIHN0YXR1cyBcdTIwMTQgc2lsZW5jZSBhbnkgZnVydGhlciBwcm9ncmVzcyB3cml0ZXMgZnJvbSB0aGVcbiAgLy8gaW4tZmxpZ2h0IHN5bmMgY29kZSBzbyB0aGUgVUkgZG9lc24ndCBib3VuY2Ugd2hpbGUgaXQgdW53aW5kcy5cbiAgaWYgKF9jYW5jZWxsZWQpIHJldHVybjtcbiAgY29uc3QgcHJldiA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoU1RPUkFHRV9LRVkpKVtTVE9SQUdFX0tFWV0gfHwge307XG4gIGNvbnN0IG5leHQgPSB7IC4uLnByZXYsIC4uLnBhcnRpYWwsIHRzOiBEYXRlLm5vdygpIH07XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IG5leHQgfSk7XG4gIC8vIEJyb2FkY2FzdCB0byBhbnkgb3BlbiBwb3B1cC4gSWYgbm8gbGlzdGVuZXIgKHBvcHVwIGNsb3NlZCksXG4gIC8vIHNlbmRNZXNzYWdlIHJlamVjdHMgXHUyMDE0IHN3YWxsb3cuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJzeW5jUHJvZ3Jlc3NcIiwgc3RhdHVzOiBuZXh0IH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIE5ISSBBUEktZGlyZWN0IHN5bmMgKHBhcmFsbGVsLCBubyBMTE0pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIEluc3RlYWQgb2YgbmF2aWdhdGluZyB0aGUgdXNlcidzIHRhYiB0byBlYWNoIE5ISSBwYWdlLCB3YWl0aW5nIGZvciBWdWUgdG9cbi8vIHJlbmRlciwgY2FwdHVyaW5nIEhUTUwsIHRoZW4gc2VuZGluZyBpdCB0aHJvdWdoIExMTSBleHRyYWN0aW9uLCB3ZSBjYWxsXG4vLyBOSEkncyB1bmRlcmx5aW5nIEpTT04gQVBJIGVuZHBvaW50cyBkaXJlY3RseS4gVGhlIFx1NTA2NVx1NEZERFx1N0Y3MiBTUEEgZnJvbnRzIGEgc2V0XG4vLyBvZiBSRVNUIGVuZHBvaW50cyB1bmRlciAvYXBpL2loa2UzMDAwLzxwYWdlPi8qIHRoYXQgcmV0dXJuIHdlbGwtZm9ybWVkXG4vLyBKU09OOyBjYWxsaW5nIHRoZW0gaW4gcGFyYWxsZWwgY3V0cyBhIDUtMTAgbWludXRlIHN5bmMgdG8gfjEwIHNlY29uZHMgYW5kXG4vLyByZW1vdmVzIHRoZSBMTE0gY29zdCBlbnRpcmVseS5cblxuY29uc3QgTkhJX0hPU1QgPSBcIm15aGVhbHRoYmFuay5uaGkuZ292LnR3XCI7XG5cbi8vIENvbnZlcnQgTkhJJ3MgXHU2QzExXHU1NzBCIGRhdGUgXCIxMTUvMDUvMDVcIiBcdTIxOTIgSVNPIFwiMjAyNi0wNS0wNVwiLlxuLy8gU29tZSBOSEkgZmllbGRzIGVtYmVkIGJvdGggUk9DIGFuZCBHcmVnb3JpYW46IFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHdlXG4vLyBqdXN0IG1hdGNoIHRoZSBmaXJzdCBzZWdtZW50LlxuZnVuY3Rpb24gcm9jVG9JU08ocm9jRGF0ZSkge1xuICBpZiAoIXJvY0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKHJvY0RhdGUpLm1hdGNoKC9eKFxcZHsyLDN9KVsvLi1dKFxcZHsxLDJ9KVsvLi1dKFxcZHsxLDJ9KS8pO1xuICBpZiAoIW0pIHJldHVybiBcIlwiO1xuICBjb25zdCB5ID0gcGFyc2VJbnQobVsxXSwgMTApICsgMTkxMTtcbiAgcmV0dXJuIGAke3l9LSR7bVsyXS5wYWRTdGFydCgyLCBcIjBcIil9LSR7bVszXS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbn1cblxuLy8gSW52ZXJzZTogSVNPIFwiMjAyMy0wNS0wNVwiIFx1MjE5MiBST0MgXCIxMTIvMDUvMDVcIi4gVXNlZCB0byBidWlsZCBOSEkgZGF0ZS1yYW5nZVxuLy8gcXVlcnkgc3RyaW5ncyAodGhlaXIgZm9ybXMgZXhwZWN0IFx1NkMxMVx1NTcwQiBmb3JtYXQpLlxuZnVuY3Rpb24gaXNvVG9ST0MoaXNvRGF0ZSkge1xuICBpZiAoIWlzb0RhdGUpIHJldHVybiBcIlwiO1xuICBjb25zdCBtID0gU3RyaW5nKGlzb0RhdGUpLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pLyk7XG4gIGlmICghbSkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHkgPSBwYXJzZUludChtWzFdLCAxMCkgLSAxOTExO1xuICBpZiAoeSA8IDEpIHJldHVybiBcIlwiOyAvLyBwcmUtXHU2QzExXHU1NzBCIGRhdGVzIG1ha2Ugbm8gc2Vuc2UgdG8gTkhJXG4gIHJldHVybiBgJHt5fS8ke21bMl0ucGFkU3RhcnQoMiwgXCIwXCIpfS8ke21bM10ucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG59XG5cbi8vIE5ISSBiaWxpbmd1YWwgZmllbGRzIHVzZSBcIlx1NEUyRFx1NjU4N3x8RW5nbGlzaFwiIFx1MjAxNCBjbGluaWNpYW5zIHNjYW4gRW5nbGlzaCBmYXN0ZXIsXG4vLyBzbyBwcmVmZXIgdGhhdCBzaWRlLiBJZiB0aGVyZSdzIG5vIGB8fGAgd2UganVzdCByZXR1cm4gdGhlIGlucHV0IHRyaW1tZWQuXG5mdW5jdGlvbiBwaWNrRW5nbGlzaChzKSB7XG4gIGlmIChzID09PSBudWxsIHx8IHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGNvbnN0IHN0ciA9IFN0cmluZyhzKTtcbiAgY29uc3QgaWR4ID0gc3RyLmluZGV4T2YoXCJ8fFwiKTtcbiAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBzdHIudHJpbSgpO1xuICBjb25zdCBlbiA9IHN0ci5zbGljZShpZHggKyAyKS50cmltKCk7XG4gIHJldHVybiBlbiB8fCBzdHIuc2xpY2UoMCwgaWR4KS50cmltKCk7XG59XG5cbi8vIEFkYXB0ZXIgZm9yIE5ISSBsYWIvb2JzZXJ2YXRpb24gSlNPTiBzaGFwZSAoY29uZmlybWVkIGZvciBJSEtFMzQwOVMwMTtcbi8vIG90aGVyIGxhYiBlbmRwb2ludHMgbGlrZWx5IHVzZSB0aGUgc2FtZSBmaWVsZHMpLlxuZnVuY3Rpb24gYWRhcHRMYWJJdGVtKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFKTtcbiAgY29uc3QgdmFsdWUgPSBpdGVtLmFzc2FZX1ZBTFVFO1xuICBpZiAoIWRhdGUgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIC8vIElNUE9SVEFOVDogYG9yZGVyX3Nob3J0bmFtZWAgaXMgTkhJJ3MgVUktdHJ1bmNhdGVkIGxhYmVsICh+MTUgY2hhcnNcbiAgLy8gKyBcIiAuLi5cIiksIHN1aXRhYmxlIGZvciB0aGVpciBsb25nLXRhYmxlIGRpc3BsYXkgYnV0IE5PVCBmb3IgRkhJUlxuICAvLyBPYnNlcnZhdGlvbi5jb2RlLnRleHQgXHUyMDE0IGRvd25zdHJlYW0gU01BUlQgYXBwcyBlbmQgdXAgc2hvd2luZyBoYWxmXG4gIC8vIG5hbWVzIGxpa2UgXCJQQyBTdWdhciBcdTk4RUZcdTVGOEMgLi4uXCIgd2l0aCBubyBmaWVsZCB0byByZWNvdmVyIHRoZSBmdWxsXG4gIC8vIG5hbWUgZnJvbS4gQWx3YXlzIHByZWZlciBgYXNzYVlfSVRFTV9OQU1FYCAodGhlIGZ1bGwgaXRlbSBuYW1lLFxuICAvLyB0eXBpY2FsbHkgYmlsaW5ndWFsIGxpa2UgXCJQQyBTdWdhciBcdTk4RUZcdTVGOENcdTUxNjlcdTVDMEZcdTY2NDJcdTg4NDBcdTdDRDZcIikgYW5kIG9ubHkgZmFsbFxuICAvLyBiYWNrIHRvIHRoZSBzaG9ydG5hbWUgd2hlbiB0aGUgZnVsbCBuYW1lIGlzIGdlbnVpbmVseSBhYnNlbnQuXG4gIC8vIFNhbWUgcHJpb3JpdHkgYXBwbGllZCB0byBgY29kZWAgYW5kIGBkaXNwbGF5YCBzbyBib3RoXG4gIC8vIE9ic2VydmF0aW9uLmNvZGUudGV4dCBhbmQgY29kaW5nW10uZGlzcGxheSBjYXJyeSB0aGUgZnVsbCBsYWJlbC5cbiAgY29uc3QgZnVsbE5hbWUgPSBpdGVtLmFzc2FZX0lURU1fTkFNRSB8fCBpdGVtLm9yZGVyX3Nob3J0bmFtZSB8fCBcIlwiO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgb3JkZXJfY29kZTogaXRlbS5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgb3JkZXJfbmFtZTogaXRlbS5vcmRlUl9OQU1FIHx8IFwiXCIsXG4gICAgY29kZTogZnVsbE5hbWUsXG4gICAgZGlzcGxheTogZnVsbE5hbWUsXG4gICAgdmFsdWU6IFN0cmluZyh2YWx1ZSksXG4gICAgdW5pdDogaXRlbS51bmlUX0RBVEEgfHwgXCJcIixcbiAgICByZWZlcmVuY2VfcmFuZ2U6IGl0ZW0uY29uc3VsVF9WQUxVRSB8fCBpdGVtLnNob3J0X0NPTlNVTFRfVkFMVUUgfHwgXCJcIixcbiAgICBob3NwaXRhbDogaXRlbS5ob3NQX0FCQlIgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDZTMDEgcmV0dXJucyB2aXNpdC1sZXZlbCByb3dzIE9OTFkgKG5vIGRydWcgbmFtZXMpLiBUaGUgYWN0dWFsIGRydWdcbi8vIGxpc3QgbGl2ZXMgYXQgSUhLRTMzMDZTMDIvcGFnZV9sb2FkP2NyaWQ9PHJvd19JRD4mY3R5cGU9MiwgaW5cbi8vIGBpaGtlMzMwNlMwMl9tYWluX2RhdGFbKl0uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0YC4gV2UgZG8gdGhhdCAyLXN0ZXBcbi8vIGZldGNoIHNlcGFyYXRlbHk7IHRoaXMgZnVuY3Rpb24gYWRhcHRzIGEgc2luZ2xlIGRydWcgZW50cnkgZ2l2ZW4gaXRzXG4vLyBwYXJlbnQgdmlzaXQgY29udGV4dC5cbmZ1bmN0aW9uIGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZHJ1ZywgdmlzaXQpIHtcbiAgaWYgKCFkcnVnIHx8IHR5cGVvZiBkcnVnICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgLy8gdmlzaXQuZnVuY19EQVRFIGlzIFwiMTE1LzA1LzA1fHwyMDI2LzA1LzA1XCIgXHUyMDE0IHJvY1RvSVNPIG1hdGNoZXMgdGhlIFJPQ1xuICAvLyBwcmVmaXggY29ycmVjdGx5LlxuICBjb25zdCBkYXRlID0gcm9jVG9JU08odmlzaXQ/LmZ1bmNfREFURSB8fCB2aXNpdD8uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBjb25zdCBkcnVnX25hbWUgPSBwaWNrRW5nbGlzaChkcnVnLmRydWdfbmFtZSB8fCBkcnVnLmRydUdfTkFNRSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlIHx8ICFkcnVnX25hbWUpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXlzID0gTnVtYmVyKGRydWcub3JkZXJfZHJ1Z19kYXkgfHwgZHJ1Zy5vcmRlcl9EUlVHX0RBWSB8fCAwKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGRydWdfbmFtZSxcbiAgICBjb2RlOiBkcnVnLm9yZGVyX2NvZGUgfHwgZHJ1Zy5vcmRlUl9DT0RFIHx8IFwiXCIsXG4gICAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBkb3NlL2ZyZXF1ZW5jeS9yb3V0ZSBcdTIwMTQgb25seSBkYXlzICsgcXR5LlxuICAgIGRvc2U6IFwiXCIsXG4gICAgZnJlcXVlbmN5OiBcIlwiLFxuICAgIHJvdXRlOiBcIlwiLFxuICAgIHF1YW50aXR5OiBkcnVnLm9yZGVyX3F0eSB8fCBkcnVnLm9yZGVyX1FUWSB8fCBcIlwiLFxuICAgIGR1cmF0aW9uX2RheXM6IE51bWJlci5pc0Zpbml0ZShkYXlzKSA/IGRheXMgOiAwLFxuICAgIC8vIHBpY2tFbmdsaXNoIG9uIGljZF9uYW1lIHR1cm5zIFx1ODI2Rlx1NjAyN1x1NjUxRFx1OEI3N1x1ODE3QS4uLnx8QmVuaWduIHByb3N0YXRpYy4uLiBpbnRvIHRoZSBFTiBzaWRlLlxuICAgIGluZGljYXRpb246IHBpY2tFbmdsaXNoKHZpc2l0Py5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2aXNpdD8uaWNkOWNtX25hbWUgfHwgXCJcIiksXG4gICAgaW5kaWNhdGlvbl9jb2RlOiB2aXNpdD8uaWNkOWNtX0NPREUgfHwgdmlzaXQ/LmljZDljbV9jb2RlIHx8IFwiXCIsXG4gICAgZHJ1Z19jbGFzczogcGlja0VuZ2xpc2goZHJ1Zy5hY3QgfHwgXCJcIiksXG4gICAgaG9zcGl0YWw6IHZpc2l0Py5ob3NwX0FCQlIgfHwgdmlzaXQ/Lmhvc3BfYWJiciB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBTdHViIGtlcHQgZm9yIHRoZSBlbmRwb2ludCByZWdpc3RyeSBcdTIwMTQgSUhLRTMzMDZTMDEgbGlzdCBuZXZlciBoYXMgZHJ1Z3MsXG4vLyBzbyB3ZSBhbHdheXMgcmV0dXJuIG51bGwgYW5kIHJlbHkgb24gdGhlIDItc3RlcCBkZXRhaWwgZmV0Y2ggYWJvdmUuXG5mdW5jdGlvbiBhZGFwdE1lZGljYXRpb24oKSB7IHJldHVybiBudWxsOyB9XG5cbi8vIElIS0UzNDAyUzAxIChcdTYyMTBcdTRFQkFcdTk4MTBcdTk2MzJcdTRGRERcdTUwNjVcdTdENTBcdTY3OUMpIFx1MjAxNCBvbmUgcm93IHBlciBzY3JlZW5pbmcgZXZlbnQsIGZsYXRcbi8vIHNjaGVtYS4gTkhJIHJ1bnMgdGhlIHBhbmVsIGl0c2VsZiBhbmQgcmV0dXJucyB2aXRhbHMgKyBhIGZpeGVkXG4vLyBiYXR0ZXJ5IG9mIGxhYiB2YWx1ZXMgcHJlLWNvbXB1dGVkIChCTUkgLyB3YWlzdCAvIEJQIC8gbGlwaWRzIC8gTEZUXG4vLyAvIFJGVCAvIGZhc3RpbmcgZ2x1Y29zZSAvIEhCc0FnIC8gQW50aS1IQ1YgLyB1cmljIGFjaWQgXHUyMDI2KS5cbi8vIFdlIHVuZm9sZCBvbmUgcm93IGludG8gfjE1IE9ic2VydmF0aW9uczogdml0YWxzIGdvIHRvIGNhdGVnb3J5XG4vLyB2aXRhbC1zaWducyAoc28gU01BUlQgYXBwcycgdml0YWxzIHZpZXdzIHBpY2sgdGhlbSB1cCksIGxhYnMgZ28gdG9cbi8vIGNhdGVnb3J5IGxhYm9yYXRvcnkuIFJldHVybnMgYW4gQVJSQVkgXHUyMDE0IGNhbGxlciBtdXN0IGZsYXQtbWFwLlxuZnVuY3Rpb24gYWRhcHRBZHVsdFByZXZlbnRpdmUocm93KSB7XG4gIGlmICghcm93IHx8IHR5cGVvZiByb3cgIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08ocm93LmZpcnNUX0RJQUdfREFURSB8fCBcIlwiKTtcbiAgaWYgKCFkYXRlKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaG9zcGl0YWwgPSByb3cuaG9zUF9BQkJSIHx8IHJvdy5ob3NwX0FCQlIgfHwgXCJcIjtcbiAgY29uc3Qgb3V0ID0gW107XG4gIC8vIChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBOSEkgY29kZSlcbiAgZnVuY3Rpb24gcHVzaChkaXNwbGF5LCB2YWx1ZSwgdW5pdCwgcmVmUmFuZ2UsIGNhdGVnb3J5LCBjb2RlKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybjtcbiAgICBjb25zdCB2ID0gU3RyaW5nKHZhbHVlKS50cmltKCk7XG4gICAgaWYgKHYgPT09IFwiXCIgfHwgdiA9PT0gXCItXCIgfHwgdiA9PT0gXCJcdTIwMTRcIikgcmV0dXJuO1xuICAgIG91dC5wdXNoKHtcbiAgICAgIGRhdGUsXG4gICAgICBob3NwaXRhbCxcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSB8fCBcImxhYm9yYXRvcnlcIixcbiAgICAgIG9yZGVyX2NvZGU6IGNvZGUgfHwgXCJcIixcbiAgICAgIG9yZGVyX25hbWU6IGRpc3BsYXksXG4gICAgICBjb2RlOiBjb2RlIHx8IGRpc3BsYXksXG4gICAgICBkaXNwbGF5LFxuICAgICAgdmFsdWU6IHYsXG4gICAgICB1bml0OiB1bml0IHx8IFwiXCIsXG4gICAgICByZWZlcmVuY2VfcmFuZ2U6IHJlZlJhbmdlIHx8IFwiXCIsXG4gICAgfSk7XG4gIH1cbiAgLy8gVml0YWwgc2lnbnNcbiAgcHVzaChcIkJvZHkgSGVpZ2h0XCIsIHJvdy5oZWlnaHQsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJvZHkgV2VpZ2h0XCIsIHJvdy53ZWlnaHQsIFwia2dcIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkJNSVwiLCByb3cuYm1pLCBcImtnL20yXCIsIFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIHB1c2goXCJXYWlzdCBDaXJjdW1mZXJlbmNlXCIsIHJvdy53YWlzdGxpbmUsIFwiY21cIiwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIlN5c3RvbGljIEJsb29kIFByZXNzdXJlXCIsIHJvdy5iYXNFX1NCUCwgXCJtbUhnXCIsXG4gICAgICAgcm93LmJsb0RfUFJFU1NfUkVTVUxUX1RFWFQgfHwgXCJcIiwgXCJ2aXRhbC1zaWduc1wiKTtcbiAgcHVzaChcIkRpYXN0b2xpYyBCbG9vZCBQcmVzc3VyZVwiLCByb3cuYmFzRV9FQlAsIFwibW1IZ1wiLFxuICAgICAgIHJvdy5ibG9EX1BSRVNTX1JFU1VMVF9URVhUIHx8IFwiXCIsIFwidml0YWwtc2lnbnNcIik7XG4gIC8vIExpcGlkIHBhbmVsXG4gIHB1c2goXCJDaG9sZXN0ZXJvbFwiLCAgIHJvdy5jaG8sICAgICBcIm1nL2RMXCIpO1xuICBwdXNoKFwiVHJpZ2x5Y2VyaWRlXCIsICByb3cuYmxvRF9URywgXCJtZy9kTFwiKTtcbiAgcHVzaChcIkhETFwiLCAgICAgICAgICAgcm93LmhkbCwgICAgIFwibWcvZExcIik7XG4gIHB1c2goXCJMRExcIiwgICAgICAgICAgIHJvdy5sZGwsICAgICBcIm1nL2RMXCIpO1xuICAvLyBMaXZlciBmdW5jdGlvblxuICBwdXNoKFwiU0dPVCAoQVNUKVwiLCAgICByb3cuc2dvdCwgICAgXCJVL0xcIiwgcm93LmxGX0RJQUdfUkVTVUxUX1RFWFQgfHwgXCJcIik7XG4gIHB1c2goXCJTR1BUIChBTFQpXCIsICAgIHJvdy5zZ3B0LCAgICBcIlUvTFwiLCByb3cubEZfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiKTtcbiAgLy8gRmFzdGluZyBnbHVjb3NlIFx1MjAxNCBOSEkgXHU5MUFCXHU0RUU0XHU3OEJDIDA5MDA1Q1xuICBwdXNoKFwiR2x1LUFDXCIsICAgICAgICByb3cuc18wOTAwNUMsIFwibWcvZExcIixcbiAgICAgICByb3cuc18wOTAwNUNfRElBR19SRVNVTFRfVEVYVCB8fCBcIlwiLCBcImxhYm9yYXRvcnlcIiwgXCIwOTAwNUNcIik7XG4gIC8vIFJlbmFsIGZ1bmN0aW9uXG4gIHB1c2goXCJCVU5cIiwgICAgICAgICAgIHJvdy51cmluRV9CVU4sICAgXCJtZy9kTFwiKTtcbiAgcHVzaChcIkNyZWF0aW5pbmVcIiwgICAgcm93LmJsb0RfQ1JFQVQsICBcIm1nL2RMXCIpO1xuICBwdXNoKFwiZUdGUlwiLCAgICAgICAgICByb3cuZWdmciwgICAgICAgIFwibUwvbWluLzEuNzNtMlwiLFxuICAgICAgIHJvdy5yRl9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICBwdXNoKFwiVXJpbmUgUHJvdGVpblwiLCByb3cudXJpbkVfUFJPVEVJTiwgXCJcIixcbiAgICAgICByb3cudXJpbkVfUFJPVEVJTl9URVhUIHx8IFwiXCIpO1xuICAvLyBIZXBhdGl0aXMgQi9DIHNjcmVlbmluZ1xuICBwdXNoKFwiSEJzQWdcIiwgICAgICAgICByb3cuaGJzYWcsICAgICAgIFwiXCIsIHJvdy5oYnNhR19URVhUIHx8IFwiXCIpO1xuICBwdXNoKFwiQW50aS1IQ1ZcIiwgICAgICByb3cuYW50SV9IQ1YsICAgIFwiXCIsIHJvdy5hbnRJX0hDVl9URVhUIHx8IFwiXCIpO1xuICAvLyBVcmljIGFjaWQgXHUyMDE0IG5vdGU6IE5ISSdzIElIS0UzNDAyIHNjaGVtYSBhbHNvIGhhcyBhIGZpZWxkIGNhbGxlZFxuICAvLyBgdXJpbkVfVUFfRElBR19BQ0lEYCB0aGF0IExPT0tTIGxpa2UgdXJpbmUgVUEgYnV0IHRoZSB2YWx1ZXMgYXJlXG4gIC8vIGlkZW50aWNhbCB0byBgdXJpQ19BQ0lEYCAoc2VydW0sIG1nL2RMKS4gSXQncyBhIG1pc25hbWVkIGR1cGxpY2F0ZVxuICAvLyB3ZSBkZWxpYmVyYXRlbHkgc2tpcCBcdTIwMTQgdXNpbmcgYm90aCB3b3VsZCBjcmVhdGUgdHdvIEZISVJcbiAgLy8gT2JzZXJ2YXRpb25zIHdpdGggdGhlIHNhbWUgdmFsdWUgYnV0IGNvbnRyYWRpY3Rvcnkgc3BlY2ltZW5zLlxuICBwdXNoKFwiVXJpYyBBY2lkXCIsICAgICByb3cudXJpQ19BQ0lELCAgIFwibWcvZExcIik7XG4gIC8vIFVyaW5lIFVBIChxdWFsaXRhdGl2ZSB1cmluZSBkaXBzdGljayB0ZXN0IFx1MjAxNCBkaXN0aW5jdCBmcm9tIHRoZVxuICAvLyBtaXNsYWJlbGVkIHVyaW5FX1VBX0RJQUdfQUNJRCBhYm92ZTsgdGhpcyBgdXJpbkVfVUFgIGlzIHRoZSByZWFsXG4gIC8vIHVyaW5lIFVBIHJlc3VsdCwgdXN1YWxseSBhICsvLSBzdHJpbmcgb3IgZW1wdHkgd2hlbiBub3QgcnVuKS5cbiAgcHVzaChcIlVyaW5lIFVBXCIsICAgICAgcm93LnVyaW5FX1VBLCAgICBcIlwiLFxuICAgICAgIHJvdy51cmluRV9VQV9ESUFHX1JFU1VMVF9URVhUIHx8IFwiXCIpO1xuICAvLyBNZXRhYm9saWMgc3luZHJvbWUgc2NyZWVuaW5nIFx1MjAxNCB2YWx1ZSBpcyBhbiBpbnRlcnByZXRhdGlvbiBzdHJpbmdcbiAgLy8gKCdcdTZCNjNcdTVFMzgnIC8gJ1x1NzU3MFx1NUUzOFx1RkYwQ1x1NUVGQVx1OEI3MFx1RkYxQVx1OEFDQlx1NkQzRFx1OEE2Mlx1OTFBQlx1NUUyQicpLCBub3QgYSBudW1iZXIuIFRoZSBtYXBwZXInc1xuICAvLyBfdHJ5X3BhcnNlX3F1YW50aXR5IHdpbGwgcmV0dXJuIE5vbmUgYW5kIGl0IGZhbGxzIHRocm91Z2ggdG9cbiAgLy8gdmFsdWVTdHJpbmcuIE5vIG1hcHBlZCBMT0lOQyBrZXl3b3JkICh5ZXQpIHNvIHRoaXMgbGFuZHMgYXMgYW5cbiAgLy8gT2JzZXJ2YXRpb24gd2l0aCBjb2RlLnRleHQgb25seTsgZG93bnN0cmVhbSBjb25zdW1lcnMgY2FuIHN0aWxsXG4gIC8vIHN1cmZhY2UgaXQgdW5kZXIgdGhlIHBhdGllbnQncyBzY3JlZW5pbmcgc2VjdGlvbiBieSBjb2RlLnRleHQuXG4gIHB1c2goXCJcdTRFRTNcdThCMURcdTc1QzdcdTUwMTlcdTdGQTRcdTdCRTlcdTZBQTIgKE1ldGFib2xpYyBTeW5kcm9tZSBTY3JlZW5pbmcpXCIsXG4gICAgICAgcm93Lm1ldEFfU1lORFJfUkVTVUxUX1RFWFQsIFwiXCIsIFwiXCIpO1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyBJSEtFMzMwOVMwMSAoXHU0RjRGXHU5NjYyIGlucGF0aWVudCBsaXN0KSBcdTIwMTQgZ2l2ZXMgcHJvcGVyIGFkbWlzc2lvbi9kaXNjaGFyZ2UuXG4vLyBTaGFwZToge2hvc3BfSUQsIGhvc3BfQUJCUiwgaG9zcF91cmwsIGluX0RBVEUsIG91dF9EQVRFLFxuLy8gICAgICAgICBpY2Q5Y21fQ09ERSwgaWNkOWNtX0NPREVfQ05BTUUsIG9yaV9UWVBFKFwiM1wiKSwgcm93X0lELCAuLi59XG4vLyBJSEtFMzMwOFMwMSBoYXMgdGhlIHNhbWUgc2hhcGUgZm9yIGEgc21hbGwgc2V0IG9mIG9sZGVyIFx1NEY0Rlx1OTY2MiByZWNvcmRzO1xuLy8gYGZ1bmNfREFURWAgaW5zdGVhZCBvZiBgaW5fREFURWAgaW4gc29tZSByb3dzIFx1MjAxNCBhZGFwdGVyIGFjY2VwdHMgYm90aC5cbmZ1bmN0aW9uIGFkYXB0SW5wYXRpZW50RW5jb3VudGVyKGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgc3RhcnQgPSByb2NUb0lTTyhpdGVtLmluX0RBVEUgfHwgaXRlbS5mdW5jX0RBVEUgfHwgXCJcIik7XG4gIGNvbnN0IGVuZCA9IHJvY1RvSVNPKGl0ZW0ub3V0X0RBVEUgfHwgXCJcIik7XG4gIGlmICghc3RhcnQpIHJldHVybiBudWxsO1xuICAvLyBpY2Q5Y20gbmFtZSBvbiBcdTRGNEZcdTk2NjIgbGlzdCBpcyBqdXN0IENoaW5lc2UgKG5vIHx8IEVuZ2xpc2ggc3BsaXQgb2JzZXJ2ZWQpLlxuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY2Q5Y21fQ09ERSB8fCBpdGVtLmljZDljbV9jb2RlIHx8IFwiXCI7XG4gIGNvbnN0IGljZE5hbWUgPSBwaWNrRW5nbGlzaChpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IGl0ZW0uaWNkOWNtX25hbWUgfHwgXCJcIik7XG4gIHJldHVybiB7XG4gICAgZGF0ZTogc3RhcnQsXG4gICAgZW5kX2RhdGU6IGVuZCxcbiAgICBjbGFzczogXCJJTVBcIixcbiAgICB0eXBlX2Rpc3BsYXk6IFwiXHU0RjRGXHU5NjYyXCIsXG4gICAgZGVwYXJ0bWVudDogXCJcIixcbiAgICBwcm92aWRlcjogXCJcIixcbiAgICByZWFzb246IGljZE5hbWUgPyAoaWNkQ29kZSA/IGAke2ljZENvZGV9ICR7aWNkTmFtZX1gIDogaWNkTmFtZSkgOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIHJvd19pZDogaXRlbS5yb3dfSUQgfHwgaXRlbS5yb3dfaWQgfHwgXCJcIixcbiAgfTtcbn1cblxuLy8gSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkgaXRlbSBzaGFwZSBcdTIwMTQgZmFyIG1vcmUgY29tcGxldGUgdGhhbiB0aGUgb2xkZXJcbi8vIElIS0UzMzAxUzAyIHZpc2l0IGxpc3QgKDUxIHZpc2l0cyB2cyA2IGZvciB0aGUgdGVzdCBwYXRpZW50KS4gTkhJJ3Ncbi8vIGNhbm9uaWNhbCBzb3VyY2Ugb2YgdHJ1dGggZm9yIFwiZXZlcnkgYmlsbGVkIGVuY291bnRlclwiLlxuLy8gICBob3NQX0lELCBob3NQX0FCQlIsIGhvc3BfdXJsXG4vLyAgIGZ1bkNfREFURSAgICAgICAgICAgICAgKFx1NkMxMVx1NTcwQiBZWVkvTU0vREQpXG4vLyAgIGljRDlDTV9DT0RFIC8gaWNEOUNNX0NPREVfQ05BTUVcbi8vICAgb3JJX1RZUEUgLyBvcmlfdHlwZV9uYW1lICAgKFwiSUNcdTUzNjFcdThDQzdcdTY1OTlcIiAvIFwiXHU3NTMzXHU1ODMxXHU4Q0M3XHU2NTk5XCIpIFx1MjAxNCBvcmlnaW4sIE5PVCBcdTk1ODAvXHU2MDI1L1x1NEY0RlxuLy8gICBwYXJ0X0FNVCwgYXBwbF9ET1QsIFx1MjAyNiAgIChiaWxsaW5nIFx1MjAxNCBkaXNjYXJkZWQpXG4vLyAgIHJvV19JRCAgICAgICAgICAgICAgICAgIGRldGFpbCBrZXkgZm9yIElIS0UzMzAzUzAyIGZhbi1vdXQgKFBoYXNlIEIpXG4vLyBXZSBkb24ndCBoYXZlIHZpc2l0IGNsYXNzIChcdTk1ODAvXHU2MDI1L1x1NEY0RikgYXQgdGhlIGxpc3QgbGV2ZWw7IHRoZSBTMDIgZGV0YWlsXG4vLyBoYXMgaG9zcF9EQVRBX1RZUEVfTkFNRSAoXCJcdTg5N0ZcdTkxQUJcIi9cIlx1NEUyRFx1OTFBQlwiL1wiXHU3MjU5XHU5MUFCXCIpLiBGb3Igbm93IGRlZmF1bHQgQU1CLlxuZnVuY3Rpb24gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZShpdGVtLCBjbGFzc0hpbnQpIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFIHx8IGl0ZW0uZnVuY19EQVRFIHx8IGl0ZW0uZnVuY19kYXRlIHx8IFwiXCIpO1xuICBpZiAoIWRhdGUpIHJldHVybiBudWxsO1xuICBjb25zdCBpY2RDb2RlID0gaXRlbS5pY0Q5Q01fQ09ERSB8fCBpdGVtLmljZDljbV9DT0RFIHx8IGl0ZW0uaWNkOWNtX2NvZGUgfHwgXCJcIjtcbiAgY29uc3QgaWNkTmFtZSA9IHBpY2tFbmdsaXNoKFxuICAgIGl0ZW0uaWNEOUNNX0NPREVfQ05BTUUgfHwgaXRlbS5pY2Q5Y21fQ09ERV9DTkFNRSB8fCBpdGVtLmljZDljbV9uYW1lIHx8IFwiXCJcbiAgKTtcbiAgLy8gY2xhc3MgZGVmYXVsdHMgdG8gQU1COyBJSEtFMzMwM1MwMiBkZXRhaWwgZmFuLW91dCBtYXkgb3ZlcnJpZGUgdG9cbiAgLy8gRU1FUiAvIElNUCBiYXNlZCBvbiBob3NwX0RBVEFfVFlQRV9OQU1FIChcdTYwMjVcdThBM0EgLyBcdTRGNEZcdTk2NjIpLlxuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgZW5kX2RhdGU6IFwiXCIsXG4gICAgY2xhc3M6IGNsYXNzSGludCB8fCBcIkFNQlwiLFxuICAgIC8vIE9yaWdpbiBtYXJrZXIgaXNuJ3QgYSBjbGluaWNhbCBjbGFzcywgYnV0IHN0YXNoIGl0IGFzIHR5cGVfZGlzcGxheVxuICAgIC8vIHNvIGRvd25zdHJlYW0gc2VlcyB0aGUgTkhJIGxhYmVsIHdpdGhvdXQgdXMgaW52ZW50aW5nIG9uZS5cbiAgICB0eXBlX2Rpc3BsYXk6IGl0ZW0ub3JpX3R5cGVfbmFtZSB8fCBpdGVtLm9ySV9UWVBFX05BTUUgfHwgXCJcIixcbiAgICBkZXBhcnRtZW50OiBcIlwiLFxuICAgIHByb3ZpZGVyOiBcIlwiLFxuICAgIHJlYXNvbjogaWNkTmFtZSA/IChpY2RDb2RlID8gYCR7aWNkQ29kZX0gJHtpY2ROYW1lfWAgOiBpY2ROYW1lKSA6IFwiXCIsXG4gICAgaG9zcGl0YWw6IGl0ZW0uaG9zUF9BQkJSIHx8IGl0ZW0uaG9zcF9BQkJSIHx8IGl0ZW0uaG9zcF9hYmJyIHx8IFwiXCIsXG4gICAgLy8gUGFzcyB0aHJvdWdoIGZvciB0aGUgZXZlbnR1YWwgSUhLRTMzMDNTMDIgZGV0YWlsIGZldGNoIChQaGFzZSBCKS5cbiAgICByb3dfaWQ6IGl0ZW0ucm9XX0lEIHx8IGl0ZW0ucm93X2lkIHx8IFwiXCIsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkYXB0QWxsZXJneShpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGFsbGVyZ2VuID1cbiAgICBpdGVtLmFsbGVyZ2VuX25hbWUgfHwgaXRlbS5hbGxlUl9OQU1FIHx8IGl0ZW0ubWVkbmFtZSB8fFxuICAgIGl0ZW0uZHJ1R19OQU1FIHx8IGl0ZW0uYWxsZXJnZW4gfHwgXCJcIjtcbiAgaWYgKCFhbGxlcmdlbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7XG4gICAgcmVjb3JkZWRfZGF0ZTogcm9jVG9JU08oaXRlbS5mdW5DX0RBVEUgfHwgaXRlbS5yZWNvckRfREFURSB8fCBcIlwiKSxcbiAgICBkaXNwbGF5OiBhbGxlcmdlbixcbiAgICBjYXRlZ29yeTogXCJtZWRpY2F0aW9uXCIsXG4gICAgY3JpdGljYWxpdHk6IFwidW5hYmxlLXRvLWFzc2Vzc1wiLFxuICAgIHJlYWN0aW9uOiBpdGVtLnJlYWN0aW9OIHx8IGl0ZW0uc3ltcHRvbSB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzMwMVMwNSAoXHU4NjU1XHU3RjZFL1x1NjI0Qlx1ODg1MyBsaXN0KSBzaGFwZTpcbi8vICAge2hvc3BfaWQsIGhvc3BfYWJiciwgaG9zcF91cmwsIG9yaV90eXBlX25hbWUsIG9yaV90eXBlLCBmdW5jX2RhdGUsXG4vLyAgICBvdXRfZGF0ZSwgaWNkOWNtX2NvZGUsIGljZDljbV9jb2RlX2NuYW1lLCBvcF9jb2RlX2NuYW1lLCByb3dfaWR9XG4vLyBOb3RlOiBubyBwcm9jZWR1cmUgQ09ERSBpbiBsaXN0IFx1MjAxNCBvcF9jb2RlX2NuYW1lIGlzIHRoZSBvbmx5IGxhYmVsLlxuZnVuY3Rpb24gYWRhcHRQcm9jZWR1cmUoaXRlbSkge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHJldHVybiBudWxsO1xuICBjb25zdCBkYXRlID0gcm9jVG9JU08oaXRlbS5mdW5jX2RhdGUgfHwgaXRlbS5mdW5DX0RBVEUpO1xuICBjb25zdCBkaXNwbGF5ID0gcGlja0VuZ2xpc2goXG4gICAgaXRlbS5vcF9jb2RlX2NuYW1lIHx8IGl0ZW0ucHJvQ19OQU1FIHx8IGl0ZW0ub3JkZVJfTkFNRSB8fCBcIlwiXG4gICk7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSkgcmV0dXJuIG51bGw7XG4gIC8vIERpYWdub3NpcyAoaWNkOWNtX2NvZGVfY25hbWUpIGlzIHRoZSAqcmVhc29uKiBmb3IgdGhlIHByb2NlZHVyZSwgbm90XG4gIC8vIHRoZSBwcm9jZWR1cmUgY29kZSBpdHNlbGYuIFN0YXNoIGl0IGluIGBub3RlYCBzbyBpdCBzaG93cyB1cCBpbiB0aGVcbiAgLy8gRkhJUiByZXNvdXJjZSB3aXRob3V0IHBvbGx1dGluZyB0aGUgY29kZSBmaWVsZC5cbiAgY29uc3QgcmVhc29uQ29kZSA9IGl0ZW0uaWNkOWNtX2NvZGUgfHwgaXRlbS5pY2Q5Y21fQ09ERSB8fCBcIlwiO1xuICBjb25zdCByZWFzb25OYW1lID0gcGlja0VuZ2xpc2goaXRlbS5pY2Q5Y21fY29kZV9jbmFtZSB8fCBpdGVtLmljZDljbV9DT0RFX0NOQU1FIHx8IFwiXCIpO1xuICBjb25zdCBub3RlID0gcmVhc29uTmFtZVxuICAgID8gKHJlYXNvbkNvZGUgPyBgUmVhc29uOiAke3JlYXNvbkNvZGV9ICR7cmVhc29uTmFtZX1gIDogYFJlYXNvbjogJHtyZWFzb25OYW1lfWApXG4gICAgOiBcIlwiO1xuICByZXR1cm4ge1xuICAgIGRhdGUsXG4gICAgY29kZTogXCJcIixcbiAgICBkaXNwbGF5LFxuICAgIG5vdGUsXG4gICAgYm9keV9zaXRlOiBcIlwiLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfYWJiciB8fCBpdGVtLmhvc1BfQUJCUiB8fCBcIlwiLFxuICB9O1xufVxuXG4vLyBJSEtFMzQwOFMwMSAoXHU1RjcxXHU1MENGXHU2QUEyXHU2N0U1IGxpc3QpIHNoYXBlOlxuLy8gICB7aG9zcF9JRCwgaG9zcF9BQkJSLCBob3NwX3VybCwgcmVhbF9JTlNQRUNUX0RBVEUsIG9yZGVyX0NPREUsXG4vLyAgICBvcmRlcl9DT0RFXzJXb3JkLCBvcmRlcl9OQU1FLCBvcmlfVFlQRSwgcm93X0lELCBqcEdfU1RBVFVTLCAuLi59XG4vLyBObyBmaW5kaW5ncy9jb25jbHVzaW9uIFx1MjAxNCBsaXN0IGlzIG9yZGVyLWxldmVsIG9ubHkuIFdlIG1hcCB0byBQcm9jZWR1cmVcbi8vIChhbiBleGFtIHdhcyBwZXJmb3JtZWQpIHJhdGhlciB0aGFuIERpYWdub3N0aWNSZXBvcnQgKHdoaWNoIG5lZWRzIGFcbi8vIG5hcnJhdGl2ZSkuIElmL3doZW4gd2UgZmV0Y2ggdGhlIGFjdHVhbCByZXBvcnQgdGhpcyBiZWNvbWVzIGEgRFIuXG4vLyBJSEtFMzQwOFMwMiBkZXRhaWwgcHJvdmlkZXMgdGhlIGZ1bGwgcmFkaW9sb2d5IC8gZW5kb3Njb3B5IHJlcG9ydCBpblxuLy8gYGRlc2NgLiBDb21iaW5lZCB3aXRoIG9yZGVyX05BTUUgKyBmdW5jX0RBVEUgdGhpcyBpcyBhIHByb3BlciBGSElSXG4vLyBEaWFnbm9zdGljUmVwb3J0LiBMaXN0LW9ubHkgZW50cmllcyAod2hlcmUgdGhlIGRldGFpbCBmZXRjaCByZXR1cm5lZFxuLy8gbm8gYGRlc2NgKSBnZXQgZHJvcHBlZCBcdTIwMTQgd2l0aG91dCBhIG5hcnJhdGl2ZSB0aGUgcmVwb3J0IG1hcHBlciB3b3VsZFxuLy8gcmVqZWN0IHRoZW0gYW55d2F5LlxuZnVuY3Rpb24gYWRhcHRJbWFnaW5nUmVwb3J0RnJvbURldGFpbChpdGVtKSB7XG4gIGlmICghaXRlbSB8fCB0eXBlb2YgaXRlbSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGRhdGUgPSByb2NUb0lTTyhpdGVtLmZ1bmNfREFURSB8fCBpdGVtLmZ1bmNfZGF0ZSB8fCBcIlwiKTtcbiAgY29uc3QgZGlzcGxheSA9IHBpY2tFbmdsaXNoKGl0ZW0ub3JkZXJfTkFNRSB8fCBpdGVtLm9yZGVyX25hbWUgfHwgXCJcIik7XG4gIGNvbnN0IGNvbmNsdXNpb24gPSAoaXRlbS5kZXNjIHx8IFwiXCIpLnRyaW0oKTtcbiAgaWYgKCFkYXRlIHx8ICFkaXNwbGF5IHx8ICFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IGl0ZW0ub3JkZXJfQ09ERSB8fCBpdGVtLm9yZGVyX2NvZGUgfHwgXCJcIixcbiAgICBzeXN0ZW06IFwiXCIsXG4gICAgZGlzcGxheSxcbiAgICBjYXRlZ29yeTogXCJSQURcIixcbiAgICBjb25jbHVzaW9uLFxuICAgIGhvc3BpdGFsOiBpdGVtLmhvc3BfQUJCUiB8fCBpdGVtLmhvc3BfYWJiciB8fCBcIlwiLFxuICAgIC8vIE5ISSBzZXBhcmF0ZXMgdGhlIGV4YW0gZGF0ZSAoZnVuY19EQVRFKSBmcm9tIHRoZSByZXBvcnQtdXBsb2FkXG4gICAgLy8gdGltZXN0YW1wIChhc3NheV9VUExPQURfREFURSkuIFRoZSBsYXR0ZXIgaXMgd2hlbiB0aGUgcmVwb3J0XG4gICAgLy8gd2FzIGZpbmFsaXNlZCBpbiBOSEkncyBzeXN0ZW0gXHUyMDE0IG1hcHMgdG8gRGlhZ25vc3RpY1JlcG9ydC5pc3N1ZWQuXG4gICAgLy8gRmFsbHMgYmFjayB0byBOb25lIGlmIE5ISSBkaWRuJ3Qgc2hpcCBvbmUuXG4gICAgaXNzdWVkOiByb2NUb0lTTygoaXRlbS5hc3NheV9VUExPQURfREFURSB8fCBcIlwiKS5zcGxpdCgvXFxzKy8pWzBdKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRhcHREaWFnUmVwb3J0KGl0ZW0pIHtcbiAgaWYgKCFpdGVtIHx8IHR5cGVvZiBpdGVtICE9PSBcIm9iamVjdFwiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgZGF0ZSA9IHJvY1RvSVNPKGl0ZW0uZnVuQ19EQVRFKTtcbiAgY29uc3QgZGlzcGxheSA9IGl0ZW0ub3JkZVJfTkFNRSB8fCBpdGVtLmFzc2FZX0lURU1fTkFNRSB8fCBpdGVtLmV4YW1OYW1lIHx8IFwiXCI7XG4gIGlmICghZGF0ZSB8fCAhZGlzcGxheSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGNvbmNsdXNpb24gPVxuICAgIGl0ZW0ucmVwb3J0IHx8IGl0ZW0uZmluZGluZ1MgfHwgaXRlbS5pbVBfREFUQSB8fCBpdGVtLmNvbnN1bFRfVkFMVUUgfHwgXCJcIjtcbiAgaWYgKCFjb25jbHVzaW9uKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBkYXRlLFxuICAgIGNvZGU6IGl0ZW0ub3JkZVJfQ09ERSB8fCBcIlwiLFxuICAgIHN5c3RlbTogXCJcIixcbiAgICBkaXNwbGF5LFxuICAgIGNhdGVnb3J5OiBcIlJBRFwiLFxuICAgIGNvbmNsdXNpb24sXG4gIH07XG59XG5cbi8vIHBhZ2VfdHlwZSBcdTIxOTIgYmFja2VuZCBwYWdlX3R5cGUgc3RyaW5nIHVzZWQgYnkgbWFwcGVycy5cbi8vIHBhdGggaXMgcmVsYXRpdmUgdG8gbmhpQmFzZS4gbWV0aG9kIGRlZmF1bHQgXCJHRVRcIi5cbi8vIGBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZWAgPSBlbmRwb2ludCBhY2NlcHRzIHNfZGF0ZSAvIGVfZGF0ZSBpbiBcdTZDMTFcdTU3MEIgZm9ybWF0LlxuLy8gQ29uZmlybWVkIHZpYSBVUkxzIG9ic2VydmVkIGluIE5ISSdzIFNQQS4gT3RoZXIgZW5kcG9pbnRzIGVpdGhlciBkb24ndFxuLy8gYWNjZXB0IHJhbmdlIHBhcmFtcywgb3IgTkhJIHJlamVjdHMgdW5rbm93biBwYXJhbXMgXHUyMDE0IHdlIGxlYXZlIHRoZW0gYWxvbmVcbi8vICh0aGV5IGZhbGwgYmFjayB0byB0aGVpciBkZWZhdWx0IHdpbmRvdywgdHlwaWNhbGx5IDEtMiB5ZWFycykuXG5jb25zdCBOSElfQVBJX0VORFBPSU5UUyA9IFtcbiAgLy8gZW5jb3VudGVycyAvIHByb2NlZHVyZXMgZG9uJ3QgaGF2ZSBhIC9zZWFyY2ggdmFyaWFudCAoNDA0KS4gcGFnZV9sb2FkXG4gIC8vIHNpbGVudGx5IGlnbm9yZXMgc19kYXRlIC8gZV9kYXRlIFx1MjAxNCB2ZXJpZmllZCB0aGUgYXJyYXkgbGVuZ3RoIGlzXG4gIC8vIGlkZW50aWNhbCB3aXRoIG9yIHdpdGhvdXQgZGF0ZXMuIERhdGUgZmlsdGVyIGlzIGVmZmVjdGl2ZWx5IHVuc3VwcG9ydGVkXG4gIC8vIGZvciB0aGVzZSBlbmRwb2ludHM7IHRoZXkgcmV0dXJuIGFsbCBkYXRhIGluIE5ISSdzIGxpZmV0aW1lIHdpbmRvdy5cbiAgLy8gRW5jb3VudGVyIHNvdXJjZTogSUhLRTMzMDNTMDEgKFx1OTFBQlx1NzY0Mlx1OENCQlx1NzUyOFx1NzUzM1x1NTgzMSkuIFRoZSAvcGFnZV9sb2FkIHZhcmlhbnRcbiAgLy8gaXMgd2luZG93LWxpbWl0ZWQgdG8gfjEgeWVhciAocmV0dXJuZWQgNTEgdmlzaXRzIGVuZGluZyAxMTQvMDUpO1xuICAvLyAvc2VhcmNoIGFjY2VwdHMgc19kYXRlIC8gZV9kYXRlIGFuZCBnb2VzIGJhY2sgZnVydGhlciAoMTYyIHZpc2l0c1xuICAvLyB0byAxMTIvMDUgZm9yIHRoZSBzYW1lIHBhdGllbnQpLiBTaW5jZSBsYWJzL21lZHMgZXh0ZW5kIHRvIDN5IHZpYVxuICAvLyB0aGVpciBvd24gL3NlYXJjaCBlbmRwb2ludHMsIGVuY291bnRlciBNVVNUIGFsc28gdXNlIC9zZWFyY2ggb3JcbiAgLy8gdGhlIChob3NwaXRhbCwgZGF0ZSkgbGlua2VyIGhhcyBub3RoaW5nIHRvIG1hdGNoIGFnYWluc3QgZm9yIG9sZGVyXG4gIC8vIGxhYiBkYXRlcy5cbiAgeyBuYW1lOiBcImVuY291bnRlcnNcIiwgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzAzczAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT1cIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0RW5jb3VudGVyRnJvbU1lZEV4cGVuc2UsIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIC8vIElucGF0aWVudCAoXHU0RjRGXHU5NjYyKSBcdTIwMTQgSUhLRTMzMDlTMDEgaXMgdGhlIHByaW1hcnkgbGlzdCB3aXRoIGluX0RBVEUvb3V0X0RBVEVcbiAgLy8gc3Bhbi4gSUhLRTMzMDhTMDEgY2FycmllcyBhIHNtYWxsIHNldCBvZiBvbGRlciBcdTRGNEZcdTk2NjIgcmVjb3JkcyB3aXRoIHRoZVxuICAvLyBzYW1lIGZpZWxkcyAoZnVuY19EQVRFIGluIHNvbWUgcm93cyBpbnN0ZWFkIG9mIGluX0RBVEU7IGFkYXB0ZXJcbiAgLy8gaGFuZGxlcyBib3RoKS4gQm90aCBmZWVkIHRoZSBzYW1lIGVuY291bnRlciBtYXBwZXIuXG4gIHsgbmFtZTogXCJpbnBhdGllbnRcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOXMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJpbnBhdGllbnRfbGVnYWN5XCIsICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwOHMwMS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwiZW5jb3VudGVyc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0SW5wYXRpZW50RW5jb3VudGVyIH0sXG4gIHsgbmFtZTogXCJwcm9jZWR1cmVzXCIsICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzMwMXMwNS9wYWdlX2xvYWRcIixcbiAgICBwYWdlX3R5cGU6IFwicHJvY2VkdXJlc1wiLCAgICAgICAgYWRhcHQ6IGFkYXB0UHJvY2VkdXJlIH0sXG4gIC8vIG1lZGljYXRpb25zOiBwYWdlX2xvYWQgb25seSBhY2NlcHRzIGVtcHR5IGRhdGVzIChIVFRQIDQwMCBvdGhlcndpc2UpLlxuICAvLyBUaGUgL3NlYXJjaCBlbmRwb2ludCBpcyB3aGF0IHRoZSBTUEEgaGl0cyB3aGVuIHVzZXIgcGlja3MgYSBjdXN0b21cbiAgLy8gZGF0ZSByYW5nZSBhbmQgYWNjZXB0cyBJU08gXHU4OTdGXHU1MTQzIGRhdGVzIHdpdGggZGFzaGVzICgyMDIzLTAxLTAxKS5cbiAgLy8gQ29uZmlybWVkIHZpYSBEZXZUb29scyBvYnNlcnZhdGlvbiBvZiB0aGUgXHU3QkU5XHU5MDc4IHBhbmVsIHN1Ym1pdC5cbiAgeyBuYW1lOiBcIm1lZGljYXRpb25zXCIsICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzMzA2czAxL3NlYXJjaD9zX2RhdGU9JmVfZGF0ZT0mc19zb3J0PUExJnNfdHlwZT1BXCIsXG4gICAgcGFnZV90eXBlOiBcIm1lZGljYXRpb25zXCIsICAgICAgIGFkYXB0OiBhZGFwdE1lZGljYXRpb24sIHN1cHBvcnRzRGF0ZVJhbmdlOiB0cnVlIH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIHsgbmFtZTogXCJhbGxlcmdpZXNfYlwiLCAgICAgICAgIHBhdGg6IFwiL2FwaS9paGtlMzAwMC9paGtlMzIwMnMwMS9TUF9JSEtFMzIwMlMwNFwiLFxuICAgIHBhZ2VfdHlwZTogXCJhbGxlcmdpZXNcIiwgICAgICAgICBhZGFwdDogYWRhcHRBbGxlcmd5IH0sXG4gIC8vIFx1NjIxMFx1NEVCQVx1OTgxMFx1OTYzMlx1NEZERFx1NTA2NVx1N0Q1MFx1Njc5QyAoSUhLRTM0MDJTMDEpOiBvbmUgcm93IHBlciBzY3JlZW5pbmcsIGNvbnRhaW5zXG4gIC8vIEJNSSAvIHZpdGFscyAvIGxpcGlkIHBhbmVsIC8gTEZUIC8gUkZUIC8gSGVwIEIvQyAvIHVyaWMgYWNpZCBhbGxcbiAgLy8gcHJlLWNvbXB1dGVkIGJ5IE5ISSdzIHNjcmVlbmluZyBwcm9ncmFtbWUuIGFkYXB0QWR1bHRQcmV2ZW50aXZlXG4gIC8vIHJldHVybnMgYW4gYXJyYXkgKG9uZSBPYnNlcnZhdGlvbiBwZXIgbWVhc3VyZW1lbnQpIHNvIHRoZVxuICAvLyBhZGFwdGVyLWNhbGwgbG9vcCBmbGF0dGVucyBpdC5cbiAgeyBuYW1lOiBcImFkdWx0X3ByZXZlbnRpdmVcIiwgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDAyczAxL1NQX0lIS0UzNDAyUzAxXCIsXG4gICAgcGFnZV90eXBlOiBcIm9ic2VydmF0aW9uc1wiLCAgICAgIGFkYXB0OiBhZGFwdEFkdWx0UHJldmVudGl2ZSB9LFxuICB7IG5hbWU6IFwiY2FuY2VyX3NjcmVlbmluZ1wiLCAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDRzMDEvU1BfSUhLRTM0MDRTMDFcIixcbiAgICBwYWdlX3R5cGU6IFwib2JzZXJ2YXRpb25zXCIsICAgICAgYWRhcHQ6IGFkYXB0TGFiSXRlbSB9LFxuICAvLyBnbHVjb3NlIChJSEtFMzQwNlMwMSkgKyBsaXBpZCAoSUhLRTM0MDdTMDEpIGFyZSBzdWJzZXRzIG9mXG4gIC8vIG90aGVyX2xhYnMgKElIS0UzNDA5UzAxKSBwZXIgTkhJJ3MgZGF0YSBtb2RlbCBcdTIwMTQgZmV0Y2hpbmcgdGhlbVxuICAvLyBzZXBhcmF0ZWx5IGp1c3QgY3JlYXRlcyBkdXAgb2JzZXJ2YXRpb25zLCBzbyB3ZSBza2lwIHRoZW0uXG4gIC8vIEltYWdpbmcgbGlzdCAoSUhLRTM0MDhTMDEpIG9ubHkgY2FycmllcyBvcmRlci1sZXZlbCBkYXRhOyBmdWxsXG4gIC8vIG5hcnJhdGl2ZSByZXBvcnQgbGl2ZXMgYXQgSUhLRTM0MDhTMDIuIFdlIGRvIGEgMi1zdGVwIGZldGNoIChzZWVcbiAgLy8gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYikgdG8gZ3JhYiB0aGUgcmVwb3J0LCB0aGVuIG1hcCB0byBhIHJlYWxcbiAgLy8gRGlhZ25vc3RpY1JlcG9ydC4gVGhlIGxpc3QgYWRhcHRlciBpcyBhIG5vLW9wIHN0dWIgbGlrZSBtZWRpY2F0aW9ucy5cbiAgLy8gaW1hZ2luZzogc2VhcmNoIGVuZHBvaW50IGFjY2VwdHMgSVNPIGRhdGUgcmFuZ2UgbGlrZSBtZWRpY2F0aW9ucy5cbiAgeyBuYW1lOiBcImltYWdpbmdcIiwgICAgICAgICAgICAgcGF0aDogXCIvYXBpL2loa2UzMDAwL2loa2UzNDA4czAxL3NlYXJjaD9zX3R5cGU9JnNfZGF0ZT0mZV9kYXRlPSZzX3NvcnQ9QTFcIixcbiAgICBwYWdlX3R5cGU6IFwiZGlhZ25vc3RpY19yZXBvcnRzXCIsIGFkYXB0OiAoKSA9PiBudWxsLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuICAvLyBvdGhlcl9sYWJzIGFscmVhZHkgdXNlcyAvc2VhcmNoOyBzYW1lIElTTy1kYXNoIGRhdGUgZm9ybWF0IHdvcmtzLlxuICB7IG5hbWU6IFwib3RoZXJfbGFic1wiLCAgICAgICAgICBwYXRoOiBcIi9hcGkvaWhrZTMwMDAvaWhrZTM0MDlzMDEvc2VhcmNoP3NfdHlwZT0mc19kYXRlPSZlX2RhdGU9JnNfc29ydD1BMVwiLFxuICAgIHBhZ2VfdHlwZTogXCJvYnNlcnZhdGlvbnNcIiwgICAgICBhZGFwdDogYWRhcHRMYWJJdGVtLCBzdXBwb3J0c0RhdGVSYW5nZTogdHJ1ZSB9LFxuXTtcblxuLy8gQXBwbHkgYSB7c3RhcnQsIGVuZH0gSVNPIGRhdGUgcmFuZ2UgdG8gYW4gZW5kcG9pbnQgcGF0aDpcbi8vICAgLSBJZiBwYXRoIGFscmVhZHkgaGFzIHNfZGF0ZT0gcGxhY2Vob2xkZXJzLCBmaWxsIHRoZW0gaW4uXG4vLyAgIC0gT3RoZXJ3aXNlIGFwcGVuZCBzX2RhdGU9Li4uJmVfZGF0ZT0uLi4gdG8gdGhlIHF1ZXJ5IHN0cmluZy5cbi8vIEVuZHBvaW50cyB3aXRob3V0IGBzdXBwb3J0c0RhdGVSYW5nZWAgcGFzcyB0aHJvdWdoIHVuY2hhbmdlZC5cbmZ1bmN0aW9uIGFwcGx5RGF0ZVJhbmdlVG9QYXRoKHBhdGgsIGRhdGVSYW5nZSkge1xuICBpZiAoIWRhdGVSYW5nZSB8fCAoIWRhdGVSYW5nZS5zdGFydCAmJiAhZGF0ZVJhbmdlLmVuZCkpIHJldHVybiBwYXRoO1xuICAvLyBOSEkgZXhwZWN0cyBcdTg5N0ZcdTUxNDMgSVNPIGRhdGVzIHdpdGggZGFzaGVzOiAyMDIzLTAxLTAxIChub3QgXHU2QzExXHU1NzBCLCBub3RcbiAgLy8gc2xhc2hlcykuIENvbmZpcm1lZCBieSBvYnNlcnZpbmcgdGhlIFNQQSdzIHJlcXVlc3Qgd2hlbiB1c2VyIHBpY2tzXG4gIC8vIGEgY3VzdG9tIGRhdGUgcmFuZ2UuIFVSTC1lbmNvZGluZyB0aGUgZGFzaGVzIGlzIHVubmVjZXNzYXJ5LlxuICBjb25zdCBzID0gKGRhdGVSYW5nZS5zdGFydCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGNvbnN0IGUgPSAoZGF0ZVJhbmdlLmVuZCB8fCBcIlwiKS5zbGljZSgwLCAxMCk7XG4gIGxldCBwID0gcGF0aDtcbiAgaWYgKC9bPyZdc19kYXRlPS8udGVzdChwKSkge1xuICAgIHAgPSBwLnJlcGxhY2UoLyhbPyZdc19kYXRlPSlbXiZdKi8sIGAkMSR7c31gKTtcbiAgfSBlbHNlIHtcbiAgICBwICs9IChwLmluY2x1ZGVzKFwiP1wiKSA/IFwiJlwiIDogXCI/XCIpICsgYHNfZGF0ZT0ke3N9YDtcbiAgfVxuICBpZiAoL1s/Jl1lX2RhdGU9Ly50ZXN0KHApKSB7XG4gICAgcCA9IHAucmVwbGFjZSgvKFs/Jl1lX2RhdGU9KVteJl0qLywgYCQxJHtlfWApO1xuICB9IGVsc2Uge1xuICAgIHAgKz0gYCZlX2RhdGU9JHtlfWA7XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDZTMDIgZGV0YWlsIGZldGNoZXMgaW5zaWRlIHRoZSBOSEkgdGFiIHNvIGNvb2tpZXMgKyBKV1Rcbi8vIGF1dGggZmxvdyBuYXR1cmFsbHkuIFdlIHBhc3MgdGhlIHZpc2l0IGxpc3QgKGp1c3Qgcm93X0lEcyArIHRoZWlyIHBhcmVudFxuLy8gZmllbGRzIG5lZWRlZCBmb3IgYWRhcHRhdGlvbikgaW50byB0aGUgdGFiOyB0aGUgdGFiIHJldHVybnMgcGFyYWxsZWxcbi8vIGZldGNoZWQgYm9kaWVzOyB3ZSBhZGFwdCBiYWNrIGluIHRoZSBTVy5cbmFzeW5jIGZ1bmN0aW9uIF9mZXRjaE1lZGljYXRpb25EZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYpID0+ICh7XG4gICAgICByb3dfSUQ6IHYucm93X0lEIHx8IHYucm93aWQgfHwgdi5yb3dJRCB8fCBcIlwiLFxuICAgICAgLy8gS2VlcCBwYXJlbnQgZmllbGRzIG5lZWRlZCBieSBhZGFwdE1lZGljYXRpb25Gcm9tRGV0YWlsLlxuICAgICAgcGFyZW50OiB7XG4gICAgICAgIGZ1bmNfREFURTogdi5mdW5jX0RBVEUgfHwgdi5mdW5jX2RhdGUgfHwgXCJcIixcbiAgICAgICAgaWNkOWNtX0NPREU6IHYuaWNkOWNtX0NPREUgfHwgdi5pY2Q5Y21fY29kZSB8fCBcIlwiLFxuICAgICAgICBpY2Q5Y21fQ09ERV9DTkFNRTogdi5pY2Q5Y21fQ09ERV9DTkFNRSB8fCB2LmljZDljbV9uYW1lIHx8IFwiXCIsXG4gICAgICAgIGhvc3BfQUJCUjogdi5ob3NwX0FCQlIgfHwgdi5ob3NwX2FiYnIgfHwgXCJcIixcbiAgICAgIH0sXG4gICAgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIGN0eXBlKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9paGtlMzAwMC9JSEtFMzMwNlMwMi9wYWdlX2xvYWQ/Y3JpZD0ke2VuY29kZVVSSUNvbXBvbmVudChyb3dJZCl9JmN0eXBlPSR7Y3R5cGV9YDtcbiAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodCk7XG4gICAgICAgICAgaWYgKHIuc3RhdHVzID09PSA0MDEgfHwgci5zdGF0dXMgPT09IDQwMykgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICBpZiAoIXIub2spIHJldHVybiB7IGVycm9yOiBgSFRUUCAke3Iuc3RhdHVzfWAgfTtcbiAgICAgICAgICByZXR1cm4geyBib2R5OiBhd2FpdCByLmpzb24oKSB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIHJldHVybiB7IGVycm9yOiBlLm5hbWUgPT09IFwiQWJvcnRFcnJvclwiID8gXCJ0aW1lb3V0IDMwc1wiIDogU3RyaW5nKGU/Lm1lc3NhZ2UgfHwgZSkgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTkhJIHVzZXMgZGlmZmVyZW50IGN0eXBlIHZhbHVlcyBmb3IgXHU4OTdGXHU5MUFCL1x1NEUyRFx1OTFBQi9cdTcyNTlcdTkxQUIvXHU4NjU1XHU2NUI5XHU3QjhCLiBXZSBkb24ndFxuICAgICAgLy8gaGF2ZSB0aGUgcHVibGljIG1hcHBpbmcsIHNvIHRyeSBjdHlwZSAxLi40IGluIG9yZGVyIGFuZCBzdG9wIGFzXG4gICAgICAvLyBzb29uIGFzIG9uZSByZXR1cm5zIGRydWdzLiBjdHlwZT0yIGNvdmVyZWQgSUNcdTUzNjEgXHU5NTgwXHU4QTNBIGluIG91ciBzYW1wbGUuXG4gICAgICBhc3luYyBmdW5jdGlvbiBvbmUocm93SWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBjdCBvZiBbMiwgMSwgMywgNF0pIHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2hPbmUocm93SWQsIGN0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keT8uaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICAgICAgICBjb25zdCBoYXNEcnVncyA9IG1haW4uc29tZSgodikgPT5cbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodj8uc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0KSAmJiB2LnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC5sZW5ndGggPiAwXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaGFzRHJ1Z3MpIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIGN0eXBlIHlpZWxkZWQgZHJ1Z3MgXHUyMDE0IHJldHVybiBsYXN0IHN1Y2Nlc3NmdWwgYm9keSBhbnl3YXkgc29cbiAgICAgICAgLy8gZGlhZ25vc3RpY3MgY2FuIHN0aWxsIHNlZSB0aGUgdmlzaXQgbWV0YWRhdGEuXG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaE9uZShyb3dJZCwgMik7XG4gICAgICB9XG4gICAgICBjb25zdCBvdXQgPSBuZXcgQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgIGxldCBuZXh0ID0gMDtcbiAgICAgIGNvbnN0IENPTkMgPSAzO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICB3aGlsZSAobmV4dCA8IGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGkgPSBuZXh0Kys7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgTWF0aC5yYW5kb20oKSAqIDE1MCkpO1xuICAgICAgICAgIG91dFtpXSA9IGF3YWl0IG9uZShpdGVtc1tpXS5yb3dfSUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCBkcnVncyA9IFtdO1xuICBjb25zdCByZXN1bHRzID0gcmVzdWx0Py5yZXN1bHRzIHx8IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByID0gcmVzdWx0c1tpXTtcbiAgICBpZiAoIXIgfHwgci5lcnJvciB8fCAhci5ib2R5KSBjb250aW51ZTtcbiAgICBjb25zdCBtYWluID0gQXJyYXkuaXNBcnJheShyLmJvZHkuaWhrZTMzMDZTMDJfbWFpbl9kYXRhKSA/IHIuYm9keS5paGtlMzMwNlMwMl9tYWluX2RhdGEgOiBbXTtcbiAgICBmb3IgKGNvbnN0IHZpc2l0IG9mIG1haW4pIHtcbiAgICAgIGNvbnN0IGRydWdMaXN0ID0gQXJyYXkuaXNBcnJheSh2aXNpdC5zcF9JSEtFMzMwNlMwM19kYXRhX2xpc3QpID8gdmlzaXQuc3BfSUhLRTMzMDZTMDNfZGF0YV9saXN0IDogW107XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZHJ1Z0xpc3QpIHtcbiAgICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0TWVkaWNhdGlvbkZyb21EZXRhaWwoZCwgdmlzaXQpO1xuICAgICAgICBpZiAoYWRhcHRlZCkgZHJ1Z3MucHVzaChhZGFwdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRydWdzO1xufVxuXG4vLyBGYW4gb3V0IElIS0UzNDA4UzAyIGRldGFpbCBmZXRjaGVzIGZvciBpbWFnaW5nIFx1MjAxNCBzYW1lIHBhdHRlcm4gYXMgdGhlXG4vLyBtZWRpY2F0aW9uIDItc3RlcC4gY3R5cGUgbWlycm9ycyB0aGUgdmlzaXQncyBvcmlfVFlQRSAoQSAvIEUgLyBcdTIwMjYpLlxuYXN5bmMgZnVuY3Rpb24gX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7IHRhYklkLCBiYXNlVXJsLCB2aXNpdHMgfSkge1xuICBjb25zdCByZXFzID0gdmlzaXRzXG4gICAgLm1hcCgodikgPT4gKHtcbiAgICAgIHJvd19JRDogdi5yb3dfSUQgfHwgdi5yb3dpZCB8fCB2LnJvd0lEIHx8IFwiXCIsXG4gICAgICBjdHlwZTogdi5vcmlfVFlQRSB8fCB2Lm9yaV90eXBlIHx8IFwiQVwiLFxuICAgIH0pKVxuICAgIC5maWx0ZXIoKHIpID0+IHIucm93X0lEKTtcbiAgaWYgKHJlcXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgY29uc3QgW3sgcmVzdWx0IH1dID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiBhc3luYyAoYmFzZSwgaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSUhLRTMwMDFTOTlcIikgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklETEVcIikpIHtcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCwgY3R5cGUpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL0lIS0UzNDA4UzAyL3BhZ2VfbG9hZD9jcmlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJvd0lkKX0mY3R5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoY3R5cGUpfWA7XG4gICAgICAgIGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBhYy5hYm9ydCgpLCAzMDAwMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLCBzaWduYWw6IGFjLnNpZ25hbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQXV0aG9yaXphdGlvblwiOiBhdXRoIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHQpO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0KTtcbiAgICAgICAgICByZXR1cm4geyBlcnJvcjogZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIiA/IFwidGltZW91dCAzMHNcIiA6IFN0cmluZyhlPy5tZXNzYWdlIHx8IGUpIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCwgaXRlbXNbaV0uY3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB3cyA9IFtdO1xuICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBDT05DICYmIHcgPCBpdGVtcy5sZW5ndGg7IHcrKykgd3MucHVzaCh3b3JrZXIoKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCh3cyk7XG4gICAgICByZXR1cm4geyByZXN1bHRzOiBvdXQgfTtcbiAgICB9LFxuICAgIGFyZ3M6IFtiYXNlVXJsLCByZXFzXSxcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdD8uZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpIHRocm93IG5ldyBFcnJvcihTRVNTSU9OX0VYUElSRURfRVJST1IpO1xuICBjb25zdCByZXBvcnRzID0gW107XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHIgPSByZXN1bHRzW2ldO1xuICAgIGlmICghciB8fCByLmVycm9yIHx8ICFyLmJvZHkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IG1haW4gPSBBcnJheS5pc0FycmF5KHIuYm9keS5paGtlMzQwOFMwMl9tYWluX2RhdGEpID8gci5ib2R5Lmloa2UzNDA4UzAyX21haW5fZGF0YSA6IFtdO1xuICAgIGZvciAoY29uc3QgdmlzaXQgb2YgbWFpbikge1xuICAgICAgY29uc3QgYWRhcHRlZCA9IGFkYXB0SW1hZ2luZ1JlcG9ydEZyb21EZXRhaWwodmlzaXQpO1xuICAgICAgaWYgKGFkYXB0ZWQpIHJlcG9ydHMucHVzaChhZGFwdGVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcG9ydHM7XG59XG5cbi8vIEZhbiBvdXQgSUhLRTMzMDNTMDIgZGV0YWlsIHRvIGNsYXNzaWZ5IGVhY2ggSUhLRTMzMDNTMDEgdmlzaXQgYXNcbi8vIEFNQiAvIEVNRVIgLyBJTVAgYmFzZWQgb24gaG9zcF9EQVRBX1RZUEVfTkFNRS4gVXNlcyA/cmlkPTxyb3dfSUQ+JnQ9TlxuLy8gd2hlcmUgTiBpcyB0aGUgdmlzaXQgdHlwZSBidWNrZXQ7IHdlIGRvbid0IGtub3cgdGhlIG1hcHBpbmcgYSBwcmlvcmksXG4vLyBzbyBmb3IgZWFjaCB2aXNpdCB3ZSB0cnkgdD0xLi41IHVudGlsIG9uZSByZXR1cm5zIG5vbi1lbXB0eSBtYWluX2RhdGEuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hFbmNvdW50ZXJEZXRhaWxzSW5UYWIoeyB0YWJJZCwgYmFzZVVybCwgdmlzaXRzIH0pIHtcbiAgY29uc3QgcmVxcyA9IHZpc2l0c1xuICAgIC5tYXAoKHYsIGlkeCkgPT4gKHsgaWR4LCByb3dfSUQ6IHYucm9XX0lEIHx8IHYucm93X0lEIHx8IFwiXCIgfSkpXG4gICAgLmZpbHRlcigocikgPT4gci5yb3dfSUQpO1xuICBpZiAocmVxcy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICBjb25zdCBbeyByZXN1bHQgfV0gPSBhd2FpdCBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgIGZ1bmM6IGFzeW5jIChiYXNlLCBpdGVtcykgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gICAgICBpZiAoIXRva2VuKSByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJSEtFMzAwMVM5OVwiKSB8fCBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiSURMRVwiKSkge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJTRVNTSU9OX0VYUElSRURcIiB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYXV0aCA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hPbmUocm93SWQsIHQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7YmFzZX0vYXBpL2loa2UzMDAwL2loa2UzMzAzczAyL3BhZ2VfbG9hZD9yaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocm93SWQpfSZ0PSR7dH1gO1xuICAgICAgICBjb25zdCBhYyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgdG0gPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIDMwMDAwKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJBdXRob3JpemF0aW9uXCI6IGF1dGggfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodG0pO1xuICAgICAgICAgIGlmIChyLnN0YXR1cyA9PT0gNDAxIHx8IHIuc3RhdHVzID09PSA0MDMpIHJldHVybiB7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH07XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4geyBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgcmV0dXJuIHsgYm9keTogYXdhaXQgci5qc29uKCkgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0bSk7XG4gICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IGUubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgPyBcInRpbWVvdXQgMzBzXCIgOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBGb3IgZWFjaCB2aXNpdCwgZmluZCB0aGUgYHRgIHRoYXQgcmV0dXJucyBub24tZW1wdHkgZGF0YS4gTkhJXG4gICAgICAvLyB1c2VzIHQ9MSBmb3Igb3V0cGF0aWVudCBcdTg5N0ZcdTkxQUIsIHQ9MiBtYXliZSBcdTYwMjVcdThBM0EvXHU0RTJEXHU5MUFCLCB0PTMgXHU0RjRGXHU5NjYyLFxuICAgICAgLy8gdD00IFx1NzI1OVx1OTFBQlx1MjAyNiBkb24ndCBoYXZlIGFuIGF1dGhvcml0YXRpdmUgbWFwcGluZyBzbyB3ZSBwcm9iZS5cbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9uZShyb3dJZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgWzEsIDIsIDMsIDQsIDVdKSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoT25lKHJvd0lkLCB0KTtcbiAgICAgICAgICBpZiAoci5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgcmV0dXJuIHI7XG4gICAgICAgICAgaWYgKHIuZXJyb3IpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG1haW4gPSAoci5ib2R5Py5paGtlMzMwM1MwMl9tYWluX2RhdGEpIHx8IFtdO1xuICAgICAgICAgIGlmIChtYWluLmxlbmd0aCA+IDApIHJldHVybiB7IGJvZHk6IHIuYm9keSwgdCB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGJvZHk6IG51bGwgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dCA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgbGV0IG5leHQgPSAwO1xuICAgICAgY29uc3QgQ09OQyA9IDM7XG4gICAgICBhc3luYyBmdW5jdGlvbiB3b3JrZXIoKSB7XG4gICAgICAgIHdoaWxlIChuZXh0IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgaSA9IG5leHQrKztcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBNYXRoLnJhbmRvbSgpICogMTUwKSk7XG4gICAgICAgICAgb3V0W2ldID0gYXdhaXQgb25lKGl0ZW1zW2ldLnJvd19JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdzID0gW107XG4gICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IENPTkMgJiYgdyA8IGl0ZW1zLmxlbmd0aDsgdysrKSB3cy5wdXNoKHdvcmtlcigpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHdzKTtcbiAgICAgIHJldHVybiB7IHJlc3VsdHM6IG91dCB9O1xuICAgIH0sXG4gICAgYXJnczogW2Jhc2VVcmwsIHJlcXNdLFxuICB9KTtcblxuICBpZiAocmVzdWx0Py5lcnJvciA9PT0gXCJTRVNTSU9OX0VYUElSRURcIikgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIC8vIFBhaXIgZWFjaCBkZXRhaWwgYm9keSBiYWNrIHRvIGl0cyB2aXNpdCBwb3NpdGlvbi5cbiAgY29uc3QgYnlJZHggPSBuZXcgTWFwKCk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZXN1bHQ/LnJlc3VsdHMgfHwgW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxcy5sZW5ndGg7IGkrKykge1xuICAgIGJ5SWR4LnNldChyZXFzW2ldLmlkeCwgcmVzdWx0c1tpXT8uYm9keSB8fCBudWxsKTtcbiAgfVxuICByZXR1cm4gYnlJZHg7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0Zyb21TMDJEZXRhaWwoYm9keSkge1xuICBpZiAoIWJvZHkpIHJldHVybiBudWxsO1xuICBjb25zdCBtYWluID0gKGJvZHkuaWhrZTMzMDNTMDJfbWFpbl9kYXRhKSB8fCBbXTtcbiAgaWYgKG1haW4ubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdG4gPSBTdHJpbmcobWFpblswXS5ob3NwX0RBVEFfVFlQRV9OQU1FIHx8IFwiXCIpO1xuICBpZiAodG4uaW5jbHVkZXMoXCJcdTYwMjVcIikpIHJldHVybiBcIkVNRVJcIjsgIC8vIFx1NjAyNVx1OEEzQVxuICBpZiAodG4uaW5jbHVkZXMoXCJcdTRGNEZcdTk2NjJcIikpIHJldHVybiBcIklNUFwiO1xuICAvLyBcdTg5N0ZcdTkxQUIgLyBcdTRFMkRcdTkxQUIgLyBcdTcyNTlcdTkxQUIgLyBcdTg1RTVcdTVDNDAgYWxsIGRlZmF1bHQgdG8gQU1CXG4gIHJldHVybiBcIkFNQlwiO1xufVxuXG5hc3luYyBmdW5jdGlvbiBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgcGF0aWVudE92ZXJyaWRlKSB7XG4gIGNvbnN0IHIgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kfS9zeW5jL3VwbG9hZC1zdHJ1Y3R1cmVkYCwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAuLi4oc3luY0FwaUtleSA/IHsgXCJYLVN5bmMtQVBJLUtleVwiOiBzeW5jQXBpS2V5IH0gOiB7fSksXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBwYWdlX3R5cGUsXG4gICAgICBob3N0OiBOSElfSE9TVCxcbiAgICAgIGl0ZW1zLFxuICAgICAgcGF0aWVudF9vdmVycmlkZTogcGF0aWVudE92ZXJyaWRlIHx8IG51bGwsXG4gICAgfSksXG4gIH0pO1xuICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcihgUE9TVCB1cGxvYWQtc3RydWN0dXJlZCAke3Iuc3RhdHVzfTogJHsoYXdhaXQgci50ZXh0KCkpLnNsaWNlKDAsIDIwMCl9YCk7XG4gIHJldHVybiBhd2FpdCByLmpzb24oKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIExvY2FsIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vL1xuLy8gUnVucyB0aGUgc2FtZSBtYXBwZXJzIHRoZSBiYWNrZW5kIHJ1bnMsIHRoZW4gdHJpZ2dlcnMgYSBkb3dubG9hZCBvZiB0aGVcbi8vIHJlc3VsdGluZyBGSElSIEJ1bmRsZS4gTm90aGluZyBsZWF2ZXMgdGhlIHVzZXIncyBtYWNoaW5lOyBubyBiYWNrZW5kXG4vLyByZXF1aXJlZC4gTWlycm9ycyBiYWNrZW5kL3VwbG9hZC1zdHJ1Y3R1cmVkIG9yZGVyOiBlbmNvdW50ZXJzIGZpcnN0IHNvXG4vLyB0aGF0IGxpbmtFbmNvdW50ZXJzSW5SZXNvdXJjZXMgY2FuIGF0dGFjaCByZWZlcmVuY2VzIHRvIGRvd25zdHJlYW1cbi8vIG9ic2VydmF0aW9ucy9tZWRpY2F0aW9ucy9ldGMuXG5cbmNvbnN0IF9MT0NBTF9QQUdFX1RZUEVfT1JERVIgPSBbXG4gIFwiZW5jb3VudGVyc1wiLFxuICBcIm9ic2VydmF0aW9uc1wiLFxuICBcIm1lZGljYXRpb25zXCIsXG4gIFwiY29uZGl0aW9uc1wiLFxuICBcImFsbGVyZ2llc1wiLFxuICBcImRpYWdub3N0aWNfcmVwb3J0c1wiLFxuICBcInByb2NlZHVyZXNcIixcbl07XG5cbi8vIE5ISSBcdTUwNjVcdTVFQjdcdTVCNThcdTY0N0EgZW5kcG9pbnQgSUhLRTM0MTBTMDEgKFx1NjIxMVx1NjNBNVx1N0EyRVx1N0QwMFx1OTMwNCAvIENPVklEIFx1N0JFOVx1NkFBMlx1N0QwMFx1OTMwNCkgaGFwcGVuc1xuLy8gdG8gY2FycnkgdGhlIGxvZ2dlZC1pbiB1c2VyJ3MgcmVhbCBjaXRpemVuIElEIGluIHRoZSByZXNwb25zZSAoYGNpZGBcbi8vIGZpZWxkLCBlLmcuIFwiUDEyMDc0MDg2NlwiKS4gVXNlIGl0IHRvIGZpbGwgdGhlIHBhdGllbnRfb3ZlcnJpZGUnc1xuLy8gaWRfbm8gd2hlbiB0aGUgdXNlciBsZWZ0IGl0IGJsYW5rIFx1MjAxNCB0aGF0IHdheSB0aGV5IGRvbid0IGhhdmUgdG8gdHlwZVxuLy8gdGhlaXIgb3duIFx1OEVBQlx1NTIwNlx1OEI0OVx1NUI1N1x1ODY1RiBqdXN0IHRvIHNlZWQgRkhJUidzIFBhdGllbnQuaWQuXG4vL1xuLy8gQXV0by1yZXBsYWNlIHBvbGljeTogb25seSBmaWxsIHdoZW4gdGhlIG92ZXJyaWRlIGlkX25vIGlzIG1pc3Npbmcgb3Jcbi8vIGlzIHN0aWxsIGFuIFwiYXV0by1YWFhYWFhYWFwiIHBsYWNlaG9sZGVyIGdlbmVyYXRlZCBieSBhbiBlYXJsaWVyIHNhdmUuXG4vLyBBbnl0aGluZyBlbHNlIChlLmcuIHVzZXIgbWFudWFsbHkgdHlwZWQgYSBmYWtlIElEIGZvciBzY3JlZW4tc2hhcmVcbi8vIG9yIGdyb3VwaW5nKSBpcyByZXNwZWN0ZWQgYXMtaXMuXG5hc3luYyBmdW5jdGlvbiBfbWF5YmVGZXRjaFBhdGllbnRJZEZyb21OaGkodGFiSWQsIHBhdGllbnRPdmVycmlkZSkge1xuICBjb25zdCBjdXJyZW50ID0gcGF0aWVudE92ZXJyaWRlLmlkX25vIHx8IFwiXCI7XG4gIGNvbnN0IGlzUGxhY2Vob2xkZXIgPSAhY3VycmVudCB8fCBjdXJyZW50LnN0YXJ0c1dpdGgoXCJhdXRvLVwiKTtcbiAgaWYgKCFpc1BsYWNlaG9sZGVyKSByZXR1cm4gcGF0aWVudE92ZXJyaWRlO1xuXG4gIGxldCBjaWQgPSBudWxsO1xuICB0cnkge1xuICAgIGNvbnN0IFt7IHJlc3VsdCB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcbiAgICAgICAgaWYgKCF0KSByZXR1cm4gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goXCIvYXBpL2loa2UzMDAwL2loa2UzNDEwczAxL3BhZ2VfbG9hZFwiLCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLCBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dH1gIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgcmV0dXJuIGJvZHk/LmNpZCB8fCBudWxsO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBWYWxpZGF0ZSBpdCBsb29rcyBsaWtlIGEgVGFpd2FuIG5hdGlvbmFsIElEICgxIGxldHRlciArIDkgZGlnaXRzKVxuICAgIC8vIGJlZm9yZSB0cnVzdGluZyBpdC4gQXZvaWRzIGFjY2lkZW50YWxseSBwcm9tb3RpbmcgZ2FyYmFnZSB0byB0aGVcbiAgICAvLyBQYXRpZW50IHJlc291cmNlJ3MgdW5pcXVlIGtleS5cbiAgICBpZiAocmVzdWx0ICYmIC9eW0EtWl1bMTJdXFxkezh9JC8udGVzdChyZXN1bHQpKSBjaWQgPSByZXN1bHQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIElIS0UzNDEwIGNpZCBmZXRjaCBmYWlsZWQ6XCIsIGU/Lm1lc3NhZ2UgPz8gZSk7XG4gIH1cblxuICBpZiAoY2lkICYmIGNpZCAhPT0gY3VycmVudCkge1xuICAgIHBhdGllbnRPdmVycmlkZSA9IHsgLi4ucGF0aWVudE92ZXJyaWRlLCBpZF9ubzogY2lkIH07XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcGF0aWVudE92ZXJyaWRlIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgfVxuICByZXR1cm4gcGF0aWVudE92ZXJyaWRlO1xufVxuXG4vLyBSZWFkIHRoZSBtYXNrLW5hbWUgcHJlZmVyZW5jZSBmcmVzaCBmcm9tIHN0b3JhZ2UuIFdlIGRvbid0IGNhY2hlIFx1MjAxNFxuLy8gcnVuTmhpQXBpU3luYyBpcyBpbnZva2VkIGF0IG1vc3QgYSBmZXcgdGltZXMgcGVyIHNlc3Npb24gYW5kIHRoZSBTV1xuLy8gY2FuIGJlIHRvcm4gZG93biArIHJlc3RhcnRlZCBhbnkgdGltZSwgc28gYSBzaW5nbGUgZ2V0KCkgcGVyIHN5bmMgaXNcbi8vIGNoZWFwZXIgdGhhbiBzeW5jaW5nIHN0YXRlIGFjcm9zcyBTVyBsaWZlY3ljbGVzLlxuYXN5bmMgZnVuY3Rpb24gX2lzTWFza0VuYWJsZWQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBtYXNrTmFtZUVuYWJsZWQgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcIm1hc2tOYW1lRW5hYmxlZFwiKTtcbiAgICByZXR1cm4gbWFza05hbWVFbmFibGVkID09PSB0cnVlO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2J1aWxkT3ZlcnJpZGVQYXRpZW50KG92LCBtYXNrRW5hYmxlZCkge1xuICBjb25zdCBkaXNwbGF5TmFtZSA9IG1hc2tFbmFibGVkID8gbWFza05hbWUob3YubmFtZSB8fCBcIlwiKSA6IG92Lm5hbWUgfHwgXCJcIjtcbiAgY29uc3QgcmF3ID0ge1xuICAgIGlkOiBvdi5pZF9ubyxcbiAgICBpZGVudGlmaWVyOiBvdi5pZF9ubyxcbiAgICBuYW1lOiBkaXNwbGF5TmFtZSB8fCBvdi5pZF9ubyxcbiAgfTtcbiAgaWYgKG92LmJpcnRoX2RhdGUpIHJhdy5iaXJ0aERhdGUgPSBvdi5iaXJ0aF9kYXRlO1xuICBpZiAob3YuZ2VuZGVyKSByYXcuZ2VuZGVyID0gb3YuZ2VuZGVyO1xuICByZXR1cm4gbWFwUGF0aWVudChyYXcpO1xufVxuXG4vLyBXYWxrIGEgSlNPTi1saWtlIHZhbHVlIGFuZCByZXBsYWNlIGV2ZXJ5IHN0cmluZyB0b2tlbiBlcXVhbCB0byBvclxuLy8gY29udGFpbmluZyBgbmVlZGxlYCB3aXRoIGByZXBsYWNlbWVudGAuIFVzZWQgdG8gc2NydWIgdGhlIHJlYWxcbi8vIHBhdGllbnQgbmFtZSBvdXQgb2YgTkhJIG5hcnJhdGl2ZSBmaWVsZHMgKGNsaW5pY2FsX25vdGUsIGNvbmNsdXNpb24sXG4vLyBub3RlLCBldGMuKSBiZWZvcmUgdGhlIGl0ZW1zIHJlYWNoIHRoZSBtYXBwZXIuIE9ubHkgdHJpZ2dlcmVkIHdoZW5cbi8vIHRoZSB1c2VyIGhhcyBvcHRlZCBpbnRvIG1hc2tpbmcgQU5EIHN1cHBsaWVkIGEgbmFtZSBcdTIwMTQgYW5kIHRoZVxuLy8gc3Vic3RpdHV0aW9uIGlzIGV4YWN0LXRva2VuLXJlcGxhY2UsIG5vdCBmdXp6eSwgc28gaXQgY2FuJ3Qgc3VycHJpc2Vcbi8vIHRoZSB1c2VyIGJ5IGNsb2JiZXJpbmcgdW5yZWxhdGVkIGNvbnRlbnQuXG5mdW5jdGlvbiBfcmVwbGFjZU5hbWVEZWVwKHZhbHVlLCBuZWVkbGUsIHJlcGxhY2VtZW50KSB7XG4gIGlmICghbmVlZGxlIHx8IG5lZWRsZSA9PT0gcmVwbGFjZW1lbnQpIHJldHVybiB2YWx1ZTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHZhbHVlLnNwbGl0KG5lZWRsZSkuam9pbihyZXBsYWNlbWVudCk7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkgcmV0dXJuIHZhbHVlLm1hcCgodikgPT4gX3JlcGxhY2VOYW1lRGVlcCh2LCBuZWVkbGUsIHJlcGxhY2VtZW50KSk7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gdmFsdWUpIG91dFtrXSA9IF9yZXBsYWNlTmFtZURlZXAodmFsdWVba10sIG5lZWRsZSwgcmVwbGFjZW1lbnQpO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBfYXNzZW1ibGVMb2NhbEJ1bmRsZShieVR5cGUsIHBhdGllbnRPdmVycmlkZSwgbWFza0VuYWJsZWQpIHtcbiAgY29uc3QgcGF0aWVudCA9IF9idWlsZE92ZXJyaWRlUGF0aWVudChwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKTtcbiAgY29uc3QgcGlkID0gcGF0aWVudC5pZDtcbiAgY29uc3QgYWxsID0gW3BhdGllbnRdO1xuXG4gIGZvciAoY29uc3QgcHQgb2YgX0xPQ0FMX1BBR0VfVFlQRV9PUkRFUikge1xuICAgIGNvbnN0IGl0ZW1zID0gYnlUeXBlW3B0XTtcbiAgICBpZiAoIWl0ZW1zIHx8IGl0ZW1zLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgbGV0IG1hcHBlZDtcbiAgICBpZiAoR1JPVVBfSEFORExFUlNbcHRdKSB7XG4gICAgICBtYXBwZWQgPSBHUk9VUF9IQU5ETEVSU1twdF0oaXRlbXMsIHBpZCk7XG4gICAgfSBlbHNlIGlmIChMSVNUX0hBTkRMRVJTW3B0XSkge1xuICAgICAgY29uc3QgW2ZuXSA9IExJU1RfSEFORExFUlNbcHRdO1xuICAgICAgbWFwcGVkID0gaXRlbXNcbiAgICAgICAgLmZpbHRlcigoaXQpID0+IGl0ICYmIHR5cGVvZiBpdCA9PT0gXCJvYmplY3RcIilcbiAgICAgICAgLm1hcCgoaXQpID0+IGZuKGl0LCBwaWQpKVxuICAgICAgICAuZmlsdGVyKChyKSA9PiByICE9PSBudWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChwdCA9PT0gXCJlbmNvdW50ZXJzXCIpIG1hcHBlZCA9IGRlZHVwQWRtaXNzaW9uRGF5QW1iKG1hcHBlZCk7XG4gICAgYWxsLnB1c2goLi4ubWFwcGVkKTtcbiAgfVxuXG4gIC8vIERlZHVwIGJ5IChyZXNvdXJjZVR5cGUsIGlkKSBiZWZvcmUgYXNzZW1ibGluZyB0aGUgQnVuZGxlLiBNdWx0aXBsZVxuICAvLyBOSEkgZW5kcG9pbnRzIGNhbiBmZWVkIHRoZSBzYW1lIHBhZ2VfdHlwZSAoZS5nLiBlbmNvdW50ZXJzIC9cbiAgLy8gaW5wYXRpZW50IC8gaW5wYXRpZW50X2xlZ2FjeSBhbGwgXHUyMTkyIHBhZ2VfdHlwZT1cImVuY291bnRlcnNcIiksIGFuZCB0aGVcbiAgLy8gbWFwcGVyIHByb2R1Y2VzIGRldGVybWluaXN0aWMgc3RhYmxlIElEcyBcdTIwMTQgc28gdHdvIHJhdyBpdGVtcyB0aGF0XG4gIC8vIGRlc2NyaWJlIHRoZSBzYW1lIG1lZGljYWwgZXZlbnQgY29sbGFwc2UgdG8gb25lIHJlc291cmNlLiBCYWNrZW5kXG4gIC8vIHVwc2VydCBoYW5kbGVzIHRoaXMgYXV0b21hdGljYWxseSAoc2FtZSBzdGFibGUgSUQgPSBzYW1lIERCIHJvdyk7XG4gIC8vIGxvY2FsIG1vZGUgaGFzIHRvIGRvIGl0IGV4cGxpY2l0bHkuIFdpdGhvdXQgdGhpcyBkZWR1cCwgdGhlIGxvY2FsXG4gIC8vIEJ1bmRsZSBlbmRzIHVwIGluZmxhdGVkIHJlbGF0aXZlIHRvIHdoYXQgYmFja2VuZCBzdG9yZXMgZnJvbSB0aGVcbiAgLy8gaWRlbnRpY2FsIE5ISSBpbnB1dC5cbiAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgY29uc3QgdW5pcXVlID0gW107XG4gIGZvciAoY29uc3QgciBvZiBhbGwpIHtcbiAgICBjb25zdCBrZXkgPSBgJHtyLnJlc291cmNlVHlwZX0vJHtyLmlkfWA7XG4gICAgaWYgKHNlZW4uaGFzKGtleSkpIGNvbnRpbnVlO1xuICAgIHNlZW4uYWRkKGtleSk7XG4gICAgdW5pcXVlLnB1c2gocik7XG4gIH1cblxuICAvLyBMaW5rZXIgKyBzZXgtc3RyYXRpZmllZCByZXNvbHZlciBydW4gb25jZSBvdmVyIHRoZSBmdWxsIGFzc2VtYmxlZFxuICAvLyBsaXN0IChzYW1lIHBpcGVsaW5lIGJhY2tlbmQncyAvc3luYy91cGxvYWQtc3RydWN0dXJlZCBydW5zLCBqdXN0XG4gIC8vIGFnYWluc3QgYW4gaW4tbWVtb3J5IGNhbmRpZGF0ZSBhcnJheSBpbnN0ZWFkIG9mIGEgU1FMaXRlIHF1ZXJ5KS5cbiAgbGlua0VuY291bnRlcnNJblJlc291cmNlcyh1bmlxdWUsIHVuaXF1ZSk7XG4gIHJlc29sdmVTZXhTdHJhdGlmaWVkUmFuZ2VzKHBhdGllbnQsIHVuaXF1ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICByZXNvdXJjZVR5cGU6IFwiQnVuZGxlXCIsXG4gICAgdHlwZTogXCJjb2xsZWN0aW9uXCIsXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvXFwuXFxkK1okLywgXCJaXCIpLFxuICAgIGVudHJ5OiB1bmlxdWUubWFwKChyKSA9PiAoe1xuICAgICAgZnVsbFVybDogYCR7ci5yZXNvdXJjZVR5cGV9LyR7ci5pZH1gLFxuICAgICAgcmVzb3VyY2U6IHIsXG4gICAgfSkpLFxuICB9O1xufVxuXG4vLyBMb2NhbCBtb2RlIHN0YXNoZXMgdGhlIGFzc2VtYmxlZCBCdW5kbGUgaW4gY2hyb21lLnN0b3JhZ2UubG9jYWwgdW5kZXJcbi8vIGEgc2luZ2xlIFwicGVuZGluZ0ZoaXJCdW5kbGVcIiBzbG90LiBUaGUgcG9wdXAgc2hvd3MgYSBkb3dubG9hZCBidXR0b25cbi8vIHdoZW4gdGhpcyBzbG90IGlzIG5vbi1lbXB0eTsgdGhlIGFjdHVhbCBjaHJvbWUuZG93bmxvYWRzLmRvd25sb2FkIGNhbGxcbi8vIGhhcHBlbnMgZnJvbSB0aGUgcG9wdXAgKGluIHJlc3BvbnNlIHRvIGEgdXNlciBjbGljaykgc28gdGhlIGZpbGVcbi8vIGRvZXNuJ3QgYXBwZWFyIGluIHRoZSBEb3dubG9hZHMgYmFyIHVuaW52aXRlZC5cbi8vXG4vLyBTaW5nbGUgc2xvdCBtZWFucyBhIG5ldyBzeW5jIG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzIHBlbmRpbmcgYnVuZGxlLlxuLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwgZGVmYXVsdCBxdW90YSBpcyAxMCBNQjsgYSB0eXBpY2FsIE5ISSBzeW5jIGlzXG4vLyB3ZWxsIHVuZGVyIDIgTUIuXG5jb25zdCBQRU5ESU5HX0JVTkRMRV9LRVkgPSBcInBlbmRpbmdGaGlyQnVuZGxlXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIF9zdGFzaEZoaXJCdW5kbGUoYnVuZGxlLCBwYXRpZW50SWQsIGRhdGVSYW5nZSkge1xuICAvLyBGaWxlbmFtZTogbmhpLXtwaWR9LXtzdGFydFlZWVlNTUREfS17ZW5kWVlZWU1NRER9Lmpzb25cbiAgLy8gV2hlbiBubyBleHBsaWNpdCBkYXRlUmFuZ2UgKE5ISSBkZWZhdWx0ID0gXHU4RkQxIDEgXHU1RTc0KSwgc3ludGhlc2l6ZSB0b2RheS0xeSBcdTIxOTIgdG9kYXkuXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IHBhZCA9IChuKSA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgXCIwXCIpO1xuICBjb25zdCBmbXQgPSAoZCkgPT4gYCR7ZC5nZXRGdWxsWWVhcigpfSR7cGFkKGQuZ2V0TW9udGgoKSArIDEpfSR7cGFkKGQuZ2V0RGF0ZSgpKX1gO1xuICAvLyBIYWxmLW1hc2sgdGhlIElEIGluIHRoZSBmaWxlbmFtZSBzbyB0aGUgdXNlcidzIERvd25sb2FkcyBmb2xkZXJcbiAgLy8gZG9lc24ndCBsZWFrIHRoZSBmdWxsIFx1OEVBQlx1NTIwNlx1OEI0OSAod291bGQgYmUgdmlzaWJsZSB0byBhbnlvbmUgc2VlaW5nXG4gIC8vIGEgZmlsZSBsaXN0aW5nIG9yIGRvd25sb2FkLWJhciBwcmV2aWV3KS4gYFhgIGJlY2F1c2UgYCpgIGlzXG4gIC8vIGludmFsaWQgaW4gV2luZG93cyBwYXRocy4gQnVuZGxlIENPTlRFTlRTIHN0aWxsIGNhcnJ5IHRoZSByZWFsXG4gIC8vIElEIHVuZGVyIFBhdGllbnQuaWQgXHUyMDE0IGZpbGUgb3duZXIga25vd3Mgd2hvc2UgZGF0YSBpdCBpcy5cbiAgY29uc3QgbWFza2VkUGlkID0gbWFza0lkKHBhdGllbnRJZCB8fCBcInVua25vd25cIiwgXCJYXCIpO1xuICBjb25zdCBzYWZlUGlkID0gbWFza2VkUGlkLnJlcGxhY2UoL1teQS1aYS16MC05Xy1dL2csIFwiX1wiKTtcbiAgY29uc3QgY29tcGFjdCA9IChkKSA9PiAoZCB8fCBcIlwiKS5zbGljZSgwLCAxMCkucmVwbGFjZSgvLS9nLCBcIlwiKTtcbiAgbGV0IHMsIGU7XG4gIGlmIChkYXRlUmFuZ2UgJiYgKGRhdGVSYW5nZS5zdGFydCB8fCBkYXRlUmFuZ2UuZW5kKSkge1xuICAgIHMgPSBjb21wYWN0KGRhdGVSYW5nZS5zdGFydCkgfHwgZm10KG5vdyk7XG4gICAgZSA9IGNvbXBhY3QoZGF0ZVJhbmdlLmVuZCkgfHwgZm10KG5vdyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb25lWWVhckFnbyA9IG5ldyBEYXRlKG5vdyk7XG4gICAgb25lWWVhckFnby5zZXRGdWxsWWVhcihvbmVZZWFyQWdvLmdldEZ1bGxZZWFyKCkgLSAxKTtcbiAgICBzID0gZm10KG9uZVllYXJBZ28pO1xuICAgIGUgPSBmbXQobm93KTtcbiAgfVxuICBjb25zdCBmaWxlbmFtZSA9IGBuaGktJHtzYWZlUGlkfS0ke3N9LSR7ZX0uanNvbmA7XG4gIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShidW5kbGUsIG51bGwsIDIpO1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIFtQRU5ESU5HX0JVTkRMRV9LRVldOiB7XG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGpzb24sXG4gICAgICBieXRlczoganNvbi5sZW5ndGgsXG4gICAgICBnZW5lcmF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIHBhdGllbnRJZDogcGF0aWVudElkIHx8IG51bGwsXG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiB7IGZpbGVuYW1lLCBieXRlczoganNvbi5sZW5ndGggfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuTmhpQXBpU3luYyh7IHRhYklkLCBtb2RlLCBiYWNrZW5kLCBzeW5jQXBpS2V5LCBuaGlCYXNlLCBwYXRpZW50T3ZlcnJpZGUsIGRhdGVSYW5nZSwgZGF0ZVJhbmdlTGFiZWwgfSkge1xuICBfY2FuY2VsbGVkID0gZmFsc2U7XG4gIGNvbnN0IEJBU0UgPSBuaGlCYXNlIHx8IGBodHRwczovLyR7TkhJX0hPU1R9YDtcblxuICBpZiAoIXBhdGllbnRPdmVycmlkZSkge1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICBzeW5jU3RhdHVzOiB7XG4gICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU4QUNCXHU1MTQ4XHU1NzI4IHBvcHVwIFx1NTg2Qlx1NUJFQlx1NzVDNVx1NEVCQVx1OENDN1x1NjU5OVx1NUY4Q1x1NTE4RFx1OEE2NlwiLFxuICAgICAgICBwaGFzZTogXCJlcnJvclwiLCB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCF0YWJJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkFQSSBzeW5jIHJlcXVpcmVzIE5ISSB0YWIgaWQgKGNvb2tpZXMgYXJlIGZpcnN0LXBhcnR5KVwiKTtcbiAgfVxuXG4gIC8vIEZpcnN0IGNoYW5jZSB0byB1cGdyYWRlIHRoZSBwYXRpZW50IElEOiBpZiB0aGUgcG9wdXAgZ2F2ZSB1cyBhblxuICAvLyBcImF1dG8tWFhYWFhYWFhcIiBwbGFjZWhvbGRlciAodXNlciBkaWRuJ3QgbWFudWFsbHkgdHlwZSBvbmUpLFxuICAvLyBmZXRjaCB0aGUgcmVhbCBvbmUgZnJvbSBOSEkncyBJSEtFMzQxMFMwMSBlbmRwb2ludCAocmVzcG9uc2UuY2lkXG4gIC8vIGlzIHRoZSBjaXRpemVuIElEKS4gUGVyc2lzdCBiYWNrIHRvIHN0b3JhZ2Ugc28gc3Vic2VxdWVudCBzeW5jc1xuICAvLyBhcmUgc3RhYmxlLiBNYW51YWxseS10eXBlZCBJRHMgYXJlIHJlc3BlY3RlZCBhcy1pcy5cbiAgcGF0aWVudE92ZXJyaWRlID0gYXdhaXQgX21heWJlRmV0Y2hQYXRpZW50SWRGcm9tTmhpKHRhYklkLCBwYXRpZW50T3ZlcnJpZGUpO1xuXG4gIC8vIFN0YXNoIGNvbnRleHQgc28gdGhlIHN0b3BTeW5jIG1lc3NhZ2UgaGFuZGxlciBjYW4gd2lwZSBwYXJ0aWFsXG4gIC8vIGRhdGEgKERFTEVURSAvc3luYy9wYXRpZW50L3tpZF9ub30pIHdpdGhvdXQgdXMgaGF2aW5nIHRvIHNlbmQgaXRcbiAgLy8gYmFjayB0aHJvdWdoIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlLlxuICBfYWN0aXZlU3luY0N0eCA9IHsgYmFja2VuZCwgc3luY0FwaUtleSwgcGF0aWVudElkOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8gfTtcblxuICAvLyBTaWRlYmFyIGlmcmFtZSAobWVkaWNhbC1ub3RlIFNNQVJUIGFwcCkgY29tcGV0ZXMgd2l0aCBOSEkgZmFuLW91dFxuICAvLyBmZXRjaGVzIGZvciB0aGUgdGFiJ3MgbmV0d29yayArIEpTIHRocmVhZC4gRXZlbiBpbiBkaXNwbGF5Om5vbmUgaXRcbiAgLy8gY2FuIHRha2UgMTAwLTIwMG1zIHBlciByZXF1ZXN0LiBUZWxsIHNpZGViYXIuanMgdG8gc3VzcGVuZCB0aGVcbiAgLy8gaWZyYW1lIChzZXQgc3JjPWFib3V0OmJsYW5rKSBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBzeW5jLlxuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jUnVubmluZzogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgLy8gV2FsbC1jbG9jayBzdGFydCB0aW1lIFx1MjAxNCB1c2VkIHRvIGNvbXB1dGUgZWxhcHNlZCBzZWNvbmRzIGZvciB0aGVcbiAgLy8gZmluYWwgc3RhdHVzIGxpbmUgKFwiXHU3RTNEXHU4MDE3XHU2NjQyIDEyLjMgXHU3OUQyXCIpLiBTdGFzaCBvbiBhIGxvY2FsIHNvIHdlIGNhblxuICAvLyByZWFjaCBpdCBmcm9tIHRoZSBjb21wbGV0aW9uIG1lc3NhZ2UgYXQgdGhlIHZlcnkgZW5kLlxuICBjb25zdCBfdDAgPSBEYXRlLm5vdygpO1xuICAvLyBQZXItcGhhc2UgdGltaW5ncywgc3VyZmFjZWQgaW50byB0aGUgcG9wdXAncyBcIlx1NjdFNVx1NzcwQlx1NjYwRVx1N0QzMFwiIHNvIHRoZSB1c2VyXG4gIC8vIGNhbiBzZWUgZXhhY3RseSB3aGVyZSB0aW1lIGlzIGdvaW5nLiBFYWNoIGVudHJ5OiB7IG5hbWUsIG1zIH0uXG4gIGNvbnN0IF9waGFzZXMgPSBbXTtcbiAgbGV0IF9waGFzZVN0YXJ0ID0gX3QwO1xuICBjb25zdCBfbWFya1BoYXNlID0gKG5hbWUpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIF9waGFzZXMucHVzaCh7IG5hbWUsIG1zOiBub3cgLSBfcGhhc2VTdGFydCB9KTtcbiAgICBfcGhhc2VTdGFydCA9IG5vdztcbiAgfTtcbiAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICBydW5uaW5nOiB0cnVlLCBwcm9ncmVzczogXCJcdUQ4M0RcdURFODAgXHU5NThCXHU1OUNCXHU1M0Q2XHU1Rjk3XHU1MDY1XHU0RkREXHU1QjU4XHU2NDdBXHU4Q0M3XHU2NTk5XHUyMDI2XCIsIHBoYXNlOiBcImluaXRcIixcbiAgICBzdGFydGVkOiBfdDAsIHRvdGFsUmVzb3VyY2VzOiAwLCBob3N0OiBOSElfSE9TVCwgZXJyb3JzOiBbXSxcbiAgfSk7XG5cbiAgLy8gU3RlcCAxOiBmZXRjaCBhbGwgZW5kcG9pbnRzIGluIFBBUkFMTEVMIGluc2lkZSB0aGUgTkhJIHRhYi4gUnVubmluZyBpblxuICAvLyB0YWIgY29udGV4dCBtZWFucyBzYW1lLW9yaWdpbiBjb29raWVzIGFyZSBzZW50IGF1dG9tYXRpY2FsbHkgXHUyMDE0IGZldGNoXG4gIC8vIGZyb20gdGhlIFNXIHdvdWxkIGJlIGNyb3NzLW9yaWdpbiBhbmQgU2FtZVNpdGUgYmxvY2tzIHRoZSBzZXNzaW9uXG4gIC8vIGNvb2tpZSwgaGVuY2Ugd2UgZ290IFwic2Vzc2lvbiBleHBpcmVkXCIgZXZlbiB3aGVuIGxvZ2dlZCBpbi5cbiAgLy8gUGFzcyBvbmx5IHNlcmlhbGlzYWJsZSBkYXRhIChwYXRocywgbWV0aG9kLCBuYW1lKTsgYWRhcHRlcnMgc3RheSBpbiBTVy5cbiAgLy8gSW5qZWN0IElTTy1kYXRlIHJhbmdlIGludG8gZWFjaCBlbmRwb2ludCB0aGF0IHN1cHBvcnRzIGl0IChjb252ZXJ0c1xuICAvLyB0byBcdTZDMTFcdTU3MEIgZm9ybWF0IHZpYSBpc29Ub1JPQykuIFNraXBwZWQgZW5kcG9pbnRzIGtlZXAgdGhlaXIgZGVmYXVsdFxuICAvLyBOSEktc2lkZSB3aW5kb3cgKDEtMiB5ZWFycyBkZXBlbmRpbmcgb24gdGhlIHBhZ2UpLlxuICBjb25zdCBmZXRjaFNwZWMgPSBOSElfQVBJX0VORFBPSU5UUy5tYXAoKGVwKSA9PiB7XG4gICAgY29uc3QgcGF0aCA9IGVwLnN1cHBvcnRzRGF0ZVJhbmdlID8gYXBwbHlEYXRlUmFuZ2VUb1BhdGgoZXAucGF0aCwgZGF0ZVJhbmdlKSA6IGVwLnBhdGg7XG4gICAgcmV0dXJuIHsgbmFtZTogZXAubmFtZSwgdXJsOiBCQVNFICsgcGF0aCwgbWV0aG9kOiBcIkdFVFwiIH07XG4gIH0pO1xuICBpZiAoZGF0ZVJhbmdlICYmIChkYXRlUmFuZ2Uuc3RhcnQgfHwgZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICBjb25zb2xlLmxvZyhcIltOSEkgQVBJIHN5bmNdIGRhdGUgcmFuZ2U6XCIsXG4gICAgICBgJHtkYXRlUmFuZ2Uuc3RhcnQgfHwgXCIodW5ib3VuZGVkKVwifSBcdTIxOTIgJHtkYXRlUmFuZ2UuZW5kIHx8IFwiKHVuYm91bmRlZClcIn1gKTtcbiAgfVxuXG4gIGxldCBzZXR0bGVkUmF3O1xuICB0cnkge1xuICAgIFt7IHJlc3VsdDogc2V0dGxlZFJhdyB9XSA9IGF3YWl0IGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgIGZ1bmM6IGFzeW5jIChzcGVjcykgPT4ge1xuICAgICAgICAvLyBOSEkgYXV0aDogY29va2llcyArIEpXVCBpbiBzZXNzaW9uU3RvcmFnZS4gVGhlIFNQQSdzIGF4aW9zIHNldHNcbiAgICAgICAgLy8gYEF1dGhvcml6YXRpb246IEJlYXJlciA8dG9rZW4+YCBvbiBldmVyeSBBUEkgY2FsbC4gU2Vzc2lvblxuICAgICAgICAvLyBjb29raWVzIGFsb25lIHJldHVybiA0MDEuXG4gICAgICAgIGNvbnN0IHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAgICAgICBpZiAoIXRva2VuKSByZXR1cm4gW3sgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfV07XG4gICAgICAgIGNvbnN0IGF1dGggPSBgQmVhcmVyICR7dG9rZW59YDtcblxuICAgICAgICAvLyBEZXRlY3QgSURMRS90aW1lb3V0IHBhZ2UgYWxyZWFkeSByZWRpcmVjdGVkIG9uIHRoaXMgdGFiLlxuICAgICAgICBpZiAobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIklIS0UzMDAxUzk5XCIpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJJRExFXCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFt7IGVycm9yOiBcIlNFU1NJT05fRVhQSVJFRFwiIH1dO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gNjAtc2Vjb25kIHRpbWVvdXQgcGVyIGZldGNoIFx1MjAxNCBzb21lIE5ISSBlbmRwb2ludHMgKGVuY291bnRlcnMsXG4gICAgICAgIC8vIG1lZHMpIHRha2UgMjArIHNlY29uZHMuXG4gICAgICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoT25lKHMsIG1zKSB7XG4gICAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGFjLmFib3J0KCksIG1zKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHMudXJsLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogcy5tZXRob2QsXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgICAgIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLCBcIkF1dGhvcml6YXRpb25cIjogYXV0aCB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgY29uc3QgY3QgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPT09IDQwMSB8fCByLnN0YXR1cyA9PT0gNDAzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgZXJyb3I6IFwiU0VTU0lPTl9FWFBJUkVEXCIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghci5vaykgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogYEhUVFAgJHtyLnN0YXR1c31gIH07XG4gICAgICAgICAgICBpZiAoIWN0LmluY2x1ZGVzKFwiYXBwbGljYXRpb24vanNvblwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBgbm9uLUpTT04gKGN0PSR7Y3R9KWAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBib2R5O1xuICAgICAgICAgICAgdHJ5IHsgYm9keSA9IGF3YWl0IHIuanNvbigpOyB9XG4gICAgICAgICAgICBjYXRjaCAoZSkgeyByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBcIkpTT04gcGFyc2U6IFwiICsgZS5tZXNzYWdlIH07IH1cbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IHMubmFtZSwgYm9keSB9O1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICBpZiAoZS5uYW1lID09PSBcIkFib3J0RXJyb3JcIikgcmV0dXJuIHsgbmFtZTogcy5uYW1lLCBlcnJvcjogXCJ0aW1lb3V0IDYwc1wiIH07XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzLm5hbWUsIGVycm9yOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbmN1cnJlbmN5LWxpbWl0ZWQgZXhlY3V0aW9uOiBtYXggMyBpbiBmbGlnaHQgYXQgb25jZS4gTkhJJ3NcbiAgICAgICAgLy8gYWJ1c2UgZGV0ZWN0aW9uIGJsb2NrcyBidXJzdHM7IHdpdGggMTEgcGFyYWxsZWwgZmV0Y2hlcyBpdFxuICAgICAgICAvLyB0aHJvdHRsZWQgdGhlIHNlc3Npb24gYW5kIHJlZGlyZWN0ZWQgdG8gSUhLRTMwMDFTOTlfSURMRS5cbiAgICAgICAgLy8gMyBhdCBhIHRpbWUgKyAyMDBtcyBqaXR0ZXIgaXMgZ2VudGxlIGVub3VnaCBmb3IgMS1zaG90IHN5bmMuXG4gICAgICAgIGNvbnN0IENPTkNVUlJFTkNZID0gMztcbiAgICAgICAgY29uc3QgSklUVEVSX01TID0gMjAwO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gbmV3IEFycmF5KHNwZWNzLmxlbmd0aCk7XG4gICAgICAgIGxldCBuZXh0SWR4ID0gMDtcbiAgICAgICAgYXN5bmMgZnVuY3Rpb24gd29ya2VyKCkge1xuICAgICAgICAgIHdoaWxlIChuZXh0SWR4IDwgc3BlY3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gbmV4dElkeCsrO1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucmFuZG9tKCkgKiBKSVRURVJfTVMpKTtcbiAgICAgICAgICAgIHJlc3VsdHNbaV0gPSBhd2FpdCBmZXRjaE9uZShzcGVjc1tpXSwgNjAwMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3b3JrZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgQ09OQ1VSUkVOQ1kgJiYgdyA8IHNwZWNzLmxlbmd0aDsgdysrKSB7XG4gICAgICAgICAgd29ya2Vycy5wdXNoKHdvcmtlcigpKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCh3b3JrZXJzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9LFxuICAgICAgYXJnczogW2ZldGNoU3BlY10sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGV4ZWN1dGVTY3JpcHQgZmFpbGVkOiAke2UubWVzc2FnZX1gKTtcbiAgfVxuXG4gIC8vIERldGVjdCBzZXNzaW9uIGV4cGlyZWQgYWNyb3NzIHJlc3VsdHMuXG4gIGlmIChzZXR0bGVkUmF3LnNvbWUoKHIpID0+IHIuZXJyb3IgPT09IFwiU0VTU0lPTl9FWFBJUkVEXCIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFNFU1NJT05fRVhQSVJFRF9FUlJPUik7XG4gIH1cblxuICBjb25zdCBlcnJvcnMgPSBbXTtcblxuICAvLyBHZW5lcmljIGxpc3QgZXh0cmFjdGlvbjogaGFuZGxlcyBhbGwgb2JzZXJ2ZWQgTkhJIHNoYXBlcy5cbiAgLy8gICAtIFBsYWluIGFycmF5IChJSEtFMzQwOSBsYWIpXG4gIC8vICAgLSB7c3BfSUhLRTxYPl9kYXRhOiBbLi4uXX0gIChtZWRpY2F0aW9ucywgYWxsZXJnaWVzKVxuICAvLyAgIC0ge3dlc3Rlcm5fZGF0YSwgY2hpbmVzZV9kYXRhLCBkZW50aXN0X2RhdGE6IFsuLi5dfSAoZW5jb3VudGVyIGxpc3QsXG4gIC8vICAgICBzcGxpdCBieSBcdTg5N0ZcdTkxQUIvXHU0RTJEXHU5MUFCL1x1NzI1OVx1OTFBQiBcdTIwMTQgd2Ugd2FudCBhbGwgdGhyZWUpXG4gIC8vIEZvciBtdWx0aS1hcnJheSBzaGFwZXMgd2UgbWVyZ2UgYWxsIGFycmF5cyBhbmQgdGFnIGVhY2ggaXRlbSB3aXRoXG4gIC8vIGBfX3NlY3Rpb25gICh0aGUgc291cmNlIGtleSkgc28gYWRhcHRlcnMgY2FuIGRpc2FtYmlndWF0ZS5cbiAgZnVuY3Rpb24gZXh0cmFjdExpc3QoYm9keSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGJvZHkpKSByZXR1cm4gYm9keTtcbiAgICBpZiAoIWJvZHkgfHwgdHlwZW9mIGJvZHkgIT09IFwib2JqZWN0XCIpIHJldHVybiBbXTtcbiAgICBsZXQgYXJyYXlLZXlzID0gT2JqZWN0LmVudHJpZXMoYm9keSkuZmlsdGVyKChbXywgdl0pID0+IEFycmF5LmlzQXJyYXkodikpO1xuICAgIGlmIChhcnJheUtleXMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gICAgaWYgKGFycmF5S2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBhcnJheUtleXNbMF1bMV07XG4gICAgLy8gTXVsdGlwbGUgYXJyYXlzIFx1MjAxNCBkcm9wIFVJLWhlbHBlciBhcnJheXMgKGRyb3Bkb3duIG9wdGlvbnMsIHNvcnRcbiAgICAvLyBzZWxlY3RvcnMsIGxvb2t1cCB0YWJsZXMpLiBOSEkgbWl4ZXMgdGhlbSBpbnRvIHRoZSBzYW1lIHJlc3BvbnNlXG4gICAgLy8gKGUuZy4gaW1hZ2luZyByZXR1cm5zIHNwX0lIS0UzNDA4UzAxX2RhdGEgKyBpY2Q5Y21fc2VsZWN0KS5cbiAgICBjb25zdCBIRUxQRVJfUkUgPSAvc2VsZWN0fG9wdGlvbnxkcm9wZG93bnxmaWx0ZXJ8c29ydHxsb29rdXAvaTtcbiAgICBjb25zdCBkYXRhS2V5cyA9IGFycmF5S2V5cy5maWx0ZXIoKFtrXSkgPT4gIUhFTFBFUl9SRS50ZXN0KGspKTtcbiAgICBpZiAoZGF0YUtleXMubGVuZ3RoID09PSAxKSByZXR1cm4gZGF0YUtleXNbMF1bMV07XG4gICAgaWYgKGRhdGFLZXlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGFycmF5S2V5c1swXVsxXTsgLy8gZmFsbGJhY2tcbiAgICBhcnJheUtleXMgPSBkYXRhS2V5cztcbiAgICAvLyBNdWx0aXBsZSBkYXRhIGFycmF5cyAoZS5nLiB3ZXN0ZXJuX2RhdGEvY2hpbmVzZV9kYXRhL2RlbnRpc3RfZGF0YSlcbiAgICAvLyBcdTIwMTQgbWVyZ2Ugd2l0aCBfX3NlY3Rpb24gdGFnIHNvIGFkYXB0ZXJzIGNhbiBkaXNhbWJpZ3VhdGUuXG4gICAgY29uc3QgbWVyZ2VkID0gW107XG4gICAgZm9yIChjb25zdCBbaywgdl0gb2YgYXJyYXlLZXlzKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygdikge1xuICAgICAgICBpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgIG1lcmdlZC5wdXNoKHsgLi4uaXRlbSwgX19zZWN0aW9uOiBrIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lcmdlZC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWQ7XG4gIH1cblxuICAvLyBBcHBseSBTVy1zaWRlIGFkYXB0ZXJzIHRvIGVhY2ggZW5kcG9pbnQncyBib2R5LlxuICBjb25zdCBzZXR0bGVkID0gc2V0dGxlZFJhdy5tYXAoKHIsIGkpID0+IHtcbiAgICBjb25zdCBlcCA9IE5ISV9BUElfRU5EUE9JTlRTW2ldO1xuICAgIGlmIChyLmVycm9yKSB7XG4gICAgICByZXR1cm4geyBzdGF0dXM6IFwicmVqZWN0ZWRcIiwgcmVhc29uOiB7IG1lc3NhZ2U6IGAke2VwLm5hbWV9OiAke3IuZXJyb3J9YCB9IH07XG4gICAgfVxuICAgIGNvbnN0IGxpc3QgPSBleHRyYWN0TGlzdChyLmJvZHkpO1xuICAgIC8vIEFkYXB0ZXJzIHJldHVybiBlaXRoZXI6XG4gICAgLy8gICAtIG9uZSBpdGVtICAgKG1vc3QgYWRhcHRlcnMgXHUyMDE0IGxhYnMsIG1lZHMsIGVuY291bnRlcnMsIGltYWdpbmcpXG4gICAgLy8gICAtIG51bGwvdW5kZWZpbmVkIChza2lwKVxuICAgIC8vICAgLSBhcnJheSBvZiBpdGVtcyAoYWRhcHRBZHVsdFByZXZlbnRpdmUgXHUyMDE0IHVuZm9sZHMgb25lIHNjcmVlbmluZ1xuICAgIC8vICAgICByb3cgaW50byB+MTUgT2JzZXJ2YXRpb24gZW50cmllcylcbiAgICAvLyBGbGF0LWhhbmRsZSBib3RoIHNoYXBlcyBzbyBlYWNoIGFkYXB0ZXIgY2FuIHBpY2sgd2hhdGV2ZXIncyBjbGVhcmVzdC5cbiAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgIGZvciAoY29uc3QgaXQgb2YgbGlzdCkge1xuICAgICAgY29uc3QgciA9IGVwLmFkYXB0KGl0KTtcbiAgICAgIGlmIChyID09PSBudWxsIHx8IHIgPT09IHVuZGVmaW5lZCkgY29udGludWU7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHggb2YgcikgaWYgKHgpIGl0ZW1zLnB1c2goeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtcy5wdXNoKHIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBTbmFwc2hvdCBhIGJvZHkgc2FtcGxlIGZvciBzaGFwZXMgd2hlcmUgYWRhcHRlciByZWplY3RlZCBldmVyeXRoaW5nXG4gICAgLy8gXHUyMDE0IHVzZWQgYnkgdGhlIGRpYWdub3N0aWMgYnJlYWtkb3duIGluIHN0ZXAgMi5cbiAgICBsZXQgYm9keVNhbXBsZSA9IG51bGw7XG4gICAgaWYgKGxpc3QubGVuZ3RoID4gMCAmJiBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIEluY2x1ZGUgdGhlIEZJUlNUIElURU0gKGZ1bGwga2V5cyt2YWx1ZXMpIHNvIHdlIGNhbiBidWlsZCB0aGVcbiAgICAgIC8vIGNvcnJlY3QgYWRhcHRlciB3aXRob3V0IGFub3RoZXIgcm91bmQtdHJpcC4gTkhJIGl0ZW1zIG1heSBpbmNsdWRlXG4gICAgICAvLyBQSUk7IHRoZSB1c2VyIGluc3BlY3RzIHRoaXMgbG9jYWxseSB2aWEgc2VydmljZS13b3JrZXIgZGV2dG9vbHMuXG4gICAgICBib2R5U2FtcGxlID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0b3BMZXZlbEtleXM6IEFycmF5LmlzQXJyYXkoci5ib2R5KSA/IG51bGwgOiBPYmplY3Qua2V5cyhyLmJvZHkgfHwge30pLnNsaWNlKDAsIDEwKSxcbiAgICAgICAgd2FzQXJyYXk6IEFycmF5LmlzQXJyYXkoci5ib2R5KSxcbiAgICAgICAgZmlyc3RJdGVtOiBsaXN0WzBdID8/IG51bGwsXG4gICAgICAgIHNlY29uZEl0ZW06IGxpc3RbMV0gPz8gbnVsbCxcbiAgICAgIH0pLnNsaWNlKDAsIDQwMDApO1xuICAgIH1cbiAgICByZXR1cm4geyBzdGF0dXM6IFwiZnVsZmlsbGVkXCIsIHZhbHVlOiB7IGVwLCBpdGVtcywgcmF3X2NvdW50OiBsaXN0Lmxlbmd0aCwgYm9keVNhbXBsZSwgcmF3TGlzdDogbGlzdCB9IH07XG4gIH0pO1xuXG4gIF9tYXJrUGhhc2UoXCJuaGktcGFyYWxsZWxcIik7XG5cbiAgLy8gU3RlcCAxYTogZW5jb3VudGVyIGRldGFpbCBmYW4tb3V0IChJSEtFMzMwM1MwMikgXHUyMTkyIGNsYXNzaWZ5IGVhY2hcbiAgLy8gSUhLRTMzMDNTMDEgdmlzaXQgYXMgQU1CIC8gRU1FUiAvIElNUCB2aWEgaG9zcF9EQVRBX1RZUEVfTkFNRS5cbiAgLy8gTGlzdCBlbmRwb2ludCBkb2Vzbid0IGV4cG9zZSBcdTYwMjVcdThBM0EgZGlzdGluY3Rpb247IGRldGFpbCBkb2VzLiBXZSByZS1cbiAgLy8gYWRhcHQgZWFjaCBlbmNvdW50ZXIgaXRlbSB3aXRoIHRoZSBkaXNjb3ZlcmVkIGNsYXNzIGJlZm9yZSB0aGVcbiAgLy8gYmFja2VuZCB1cGxvYWQgc3RlcC5cbiAgY29uc3QgZW5jSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwiZW5jb3VudGVyc1wiKTtcbiAgaWYgKGVuY0lkeCA+PSAwICYmIHNldHRsZWRbZW5jSWR4XS5zdGF0dXMgPT09IFwiZnVsZmlsbGVkXCIpIHtcbiAgICBjb25zdCB2aXNpdHMgPSBzZXR0bGVkW2VuY0lkeF0udmFsdWUucmF3TGlzdCB8fCBbXTtcbiAgICBpZiAodmlzaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHNldFN0YXR1cyh7XG4gICAgICAgIHByb2dyZXNzOiBgXHVEODNEXHVEQ0U1IFx1NTNENlx1NUY5NyAke3Zpc2l0cy5sZW5ndGh9IFx1N0I0Nlx1NUMzMVx1OTFBQlx1N0QwMFx1OTMwNFx1OEE3M1x1NjBDNVx1MjAyNmAsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRldGFpbE1hcCA9IGF3YWl0IF9mZXRjaEVuY291bnRlckRldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJlLWFkYXB0IHdpdGggY2xhc3NIaW50IGZyb20gZGV0YWlsOyBmYWxsIGJhY2sgdG8gQU1CLlxuICAgICAgICBjb25zdCByZUFkYXB0ZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aXNpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxNYXA/LmdldChpKSB8fCBudWxsO1xuICAgICAgICAgIGNvbnN0IGNscyA9IF9jbGFzc0Zyb21TMDJEZXRhaWwoZGV0YWlsKSB8fCBcIkFNQlwiO1xuICAgICAgICAgIGNvbnN0IGl0ID0gYWRhcHRFbmNvdW50ZXJGcm9tTWVkRXhwZW5zZSh2aXNpdHNbaV0sIGNscyk7XG4gICAgICAgICAgaWYgKGl0KSByZUFkYXB0ZWQucHVzaChpdCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0dGxlZFtlbmNJZHhdLnZhbHVlLml0ZW1zID0gcmVBZGFwdGVkO1xuICAgICAgICBzZXR0bGVkW2VuY0lkeF0udmFsdWUucmF3X2NvdW50ID0gcmVBZGFwdGVkLmxlbmd0aDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYGVuY291bnRlciBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwiZW5jb3VudGVyLWRldGFpbFwiKTtcblxuICAvLyBTdGVwIDFiOiBtZWRpY2F0aW9ucyBuZWVkIGEgMi1zdGVwIGZldGNoIFx1MjAxNCBJSEtFMzMwNlMwMSBvbmx5IHJldHVybnNcbiAgLy8gdmlzaXQgbWV0YWRhdGEgKGRhdGUsIElDRCwgaG9zcGl0YWwpLCBubyBkcnVnIG5hbWVzLiBEcnVncyBsaXZlIGF0XG4gIC8vIElIS0UzMzA2UzAyL3BhZ2VfbG9hZD9jcmlkPTxyb3dfSUQ+JmN0eXBlPTIgdW5kZXJcbiAgLy8gaWhrZTMzMDZTMDJfbWFpbl9kYXRhWypdLnNwX0lIS0UzMzA2UzAzX2RhdGFfbGlzdC4gRmFuIG91dCBkZXRhaWxcbiAgLy8gZmV0Y2hlcyBpbnNpZGUgdGhlIHNhbWUgdGFiIGNvbnRleHQgKGNvb2tpZXMgKyBKV1QpLCBrZWVwaW5nXG4gIC8vIGNvbmN1cnJlbmN5IGxpbWl0ZWQgc28gTkhJIGRvZXNuJ3QgSURMRS1yZWRpcmVjdCB1cy5cbiAgLy8gU3RlcCAxYzogaW1hZ2luZyBuZWVkcyBJSEtFMzQwOFMwMiBmb3IgdGhlIGFjdHVhbCByZXBvcnQgbmFycmF0aXZlLlxuICAvLyBMaXN0IGVuZHBvaW50IG9ubHkgaGFzIG9yZGVyIG1ldGFkYXRhOyBjdHlwZSBwYXJhbSBtaXJyb3JzIHRoZVxuICAvLyB2aXNpdCdzIG9yaV9UWVBFIChBIC8gRSAvIFx1MjAyNikuXG4gIGNvbnN0IGltZ0lkeCA9IE5ISV9BUElfRU5EUE9JTlRTLmZpbmRJbmRleCgoZSkgPT4gZS5uYW1lID09PSBcImltYWdpbmdcIik7XG4gIGlmIChpbWdJZHggPj0gMCAmJiBzZXR0bGVkW2ltZ0lkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTVGNzFcdTUwQ0ZcdTZBQTJcdTY3RTVcdTU4MzFcdTU0NEFcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXBvcnRzID0gYXdhaXQgX2ZldGNoSW1hZ2luZ0RldGFpbHNJblRhYih7XG4gICAgICAgICAgdGFiSWQsIGJhc2VVcmw6IEJBU0UsIHZpc2l0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS5pdGVtcyA9IHJlcG9ydHM7XG4gICAgICAgIHNldHRsZWRbaW1nSWR4XS52YWx1ZS5yYXdfY291bnQgPSByZXBvcnRzLmxlbmd0aDtcbiAgICAgICAgc2V0dGxlZFtpbWdJZHhdLnZhbHVlLnZpc2l0Q291bnQgPSB2aXNpdHMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgaW1hZ2luZyBkZXRhaWw6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfbWFya1BoYXNlKFwiaW1hZ2luZy1kZXRhaWxcIik7XG5cbiAgY29uc3QgbWVkSWR4ID0gTkhJX0FQSV9FTkRQT0lOVFMuZmluZEluZGV4KChlKSA9PiBlLm5hbWUgPT09IFwibWVkaWNhdGlvbnNcIik7XG4gIGlmIChtZWRJZHggPj0gMCAmJiBzZXR0bGVkW21lZElkeF0uc3RhdHVzID09PSBcImZ1bGZpbGxlZFwiKSB7XG4gICAgY29uc3QgdmlzaXRzID0gc2V0dGxlZFttZWRJZHhdLnZhbHVlLnJhd0xpc3QgfHwgW107XG4gICAgaWYgKHZpc2l0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoe1xuICAgICAgICBwcm9ncmVzczogYFx1RDgzRFx1RENFNSBcdTUzRDZcdTVGOTcgJHt2aXNpdHMubGVuZ3RofSBcdTdCNDZcdTc1MjhcdTg1RTVcdTY2MEVcdTdEMzBcdTIwMjZgLFxuICAgICAgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkcnVnSXRlbXMgPSBhd2FpdCBfZmV0Y2hNZWRpY2F0aW9uRGV0YWlsc0luVGFiKHtcbiAgICAgICAgICB0YWJJZCwgYmFzZVVybDogQkFTRSwgdmlzaXRzLFxuICAgICAgICB9KTtcbiAgICAgICAgc2V0dGxlZFttZWRJZHhdLnZhbHVlLml0ZW1zID0gZHJ1Z0l0ZW1zO1xuICAgICAgICAvLyByYXdfY291bnQgbm93IHJlZmxlY3RzIHRoZSAqZHJ1Zy1sZXZlbCogY291bnQgZm9yIHRoZSBicmVha2Rvd25cbiAgICAgICAgLy8gKHZpc2l0cyBcdTIxOTIgZHJ1Z3MpLiBLZWVwIHRoZSB2aXNpdCBjb3VudCBpbiBhIHNpZGUgZmllbGQgZm9yIGRlYnVnLlxuICAgICAgICBzZXR0bGVkW21lZElkeF0udmFsdWUudmlzaXRDb3VudCA9IHZpc2l0cy5sZW5ndGg7XG4gICAgICAgIHNldHRsZWRbbWVkSWR4XS52YWx1ZS5yYXdfY291bnQgPSBkcnVnSXRlbXMubGVuZ3RoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgbWVkaWNhdGlvbnMgZGV0YWlsOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShcIm1lZGljYXRpb24tZGV0YWlsXCIpO1xuXG4gIC8vIFN0ZXAgMjogYWdncmVnYXRlIGl0ZW1zIGJ5IHBhZ2VfdHlwZSwgUE9TVCB0byBiYWNrZW5kLlxuICBjb25zdCBieVR5cGUgPSB7fTtcbiAgbGV0IHJhd190b3RhbCA9IDA7XG4gIGxldCBhZGFwdGVkX3RvdGFsID0gMDtcbiAgLy8gUGVyLWVuZHBvaW50IGJyZWFrZG93biBzbyB0aGUgZmluYWwgc3RhdHVzIGNhbiB0ZWxsIHVzZXIgZXhhY3RseVxuICAvLyB3aGljaCBlbmRwb2ludHMgY2FtZSBiYWNrIGVtcHR5IC8gbWlzLXNoYXBlZCBcdTIwMTQgbXVjaCBtb3JlIHVzZWZ1bCB0aGFuXG4gIC8vIGEgc2luZ2xlIGFnZ3JlZ2F0ZWQgbnVtYmVyLlxuICBjb25zdCBicmVha2Rvd24gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0bGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZXAgPSBOSElfQVBJX0VORFBPSU5UU1tpXTtcbiAgICBjb25zdCBzID0gc2V0dGxlZFtpXTtcbiAgICBpZiAocy5zdGF0dXMgPT09IFwicmVqZWN0ZWRcIikge1xuICAgICAgZXJyb3JzLnB1c2goYCR7ZXAubmFtZX06ICR7cy5yZWFzb24ubWVzc2FnZX1gKTtcbiAgICAgIGJyZWFrZG93bi5wdXNoKGAke2VwLm5hbWV9PUVSUmApO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHsgaXRlbXMsIHJhd19jb3VudCB9ID0gcy52YWx1ZTtcbiAgICByYXdfdG90YWwgKz0gcmF3X2NvdW50O1xuICAgIGFkYXB0ZWRfdG90YWwgKz0gaXRlbXMubGVuZ3RoO1xuICAgIC8vIEZvcm1hdDogYWRhcHRlZF9pdGVtcy9yYXdfTkhJX3Jvd3MuIEZvciBtb3N0IGVuZHBvaW50cyB0aGUgcmF0aW9cbiAgICAvLyBpcyAxOjEgKG9uZSBOSEkgcm93IFx1MjE5MiBvbmUgRkhJUiBpdGVtKSBzbyBcIjUvNVwiIHJlYWRzIG5hdHVyYWxseS5cbiAgICAvLyBGb3IgMS10by1tYW55IGFkYXB0ZXJzIChlLmcuIGFkdWx0X3ByZXZlbnRpdmUgdW5mb2xkcyBvbmVcbiAgICAvLyBzY3JlZW5pbmcgcm93IGludG8gfjE4IE9ic2VydmF0aW9ucyksIHByZWZpeCB0aGUgcmF3IHNpZGUgd2l0aFxuICAgIC8vIGl0cyBub3VuIHNvIHVzZXJzIGRvbid0IHJlYWQgXCIzNi8yXCIgYXMgXCIzNiBvZiAyIGV4cGVjdGVkXCIuXG4gICAgbGV0IGxhYmVsO1xuICAgIGlmIChpdGVtcy5sZW5ndGggPiByYXdfY291bnQgJiYgcmF3X2NvdW50ID4gMCkge1xuICAgICAgbGFiZWwgPSBgJHtlcC5uYW1lfT0ke3Jhd19jb3VudH0gcm93cyBcdTIxOTIgJHtpdGVtcy5sZW5ndGh9IG9ic2A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhYmVsID0gYCR7ZXAubmFtZX09JHtpdGVtcy5sZW5ndGh9LyR7cmF3X2NvdW50fWA7XG4gICAgfVxuICAgIGJyZWFrZG93bi5wdXNoKGxhYmVsKTtcbiAgICAvLyBTYXZlIGJvZHkgc2FtcGxlIGZvciBmaXJzdCBlbmRwb2ludCB3aXRoIHJhdz4wIGJ1dCBhZGFwdGVkPTAgKGFkYXB0ZXJcbiAgICAvLyBtaXNtYXRjaCkgc28gd2UgY2FuIGl0ZXJhdGUuIFN0b3JlZCB1bmRlciBjaHJvbWUuc3RvcmFnZS5sb2NhbCBmb3JcbiAgICAvLyBpbnNwZWN0aW9uIHZpYSBzZXJ2aWNlIHdvcmtlciBEZXZUb29scy5cbiAgICBpZiAocmF3X2NvdW50ID4gMCAmJiBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgW2BfX3NhbXBsZUJvZHlfJHtlcC5uYW1lfWBdOiBzLnZhbHVlLmJvZHlTYW1wbGUgfHwgXCJuL2FcIixcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIChieVR5cGVbZXAucGFnZV90eXBlXSA9IGJ5VHlwZVtlcC5wYWdlX3R5cGVdIHx8IFtdKS5wdXNoKC4uLml0ZW1zKTtcbiAgfVxuXG4gIC8vIE1hc2sgZ2F0ZSBpcyByZWFkIGZyZXNoIHBlciBzeW5jIFx1MjAxNCBkZWZhdWx0cyBPRkYgcGVyIHRoZSBkaXNjdXNzaW9uXG4gIC8vIChjaXRpemVuLXNlbGYtZG93bmxvYWQgZG9lc24ndCBuZWVkIGFub255bWl6YXRpb24pLiBXaGVuIE9OLCBhbHNvXG4gIC8vIHNjcnViIHRoZSB1c2VyJ3MgcmVhbCBuYW1lIG91dCBvZiBhbnkgTkhJIG5hcnJhdGl2ZSBmaWVsZCBiZWZvcmVcbiAgLy8gaXQgZmxvd3MgaW50byB0aGUgbWFwcGVyLlxuICBjb25zdCBtYXNrRW5hYmxlZCA9IGF3YWl0IF9pc01hc2tFbmFibGVkKCk7XG4gIGlmIChtYXNrRW5hYmxlZCAmJiBwYXRpZW50T3ZlcnJpZGUubmFtZSkge1xuICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGJ5VHlwZSkpIHtcbiAgICAgIGJ5VHlwZVtrZXldID0gX3JlcGxhY2VOYW1lRGVlcChieVR5cGVba2V5XSwgcGF0aWVudE92ZXJyaWRlLm5hbWUsIHJlcGxhY2VtZW50KTtcbiAgICB9XG4gIH1cblxuICBsZXQgdG90YWwgPSAwO1xuICBsZXQgX2xvY2FsRmlsZW5hbWUgPSBudWxsO1xuICBpZiAobW9kZSA9PT0gXCJsb2NhbFwiKSB7XG4gICAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xuICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBcIlx1RDgzRVx1RERFQyBcdThGNDlcdTYzREJcdTcwQkFcdTUwNjVcdTVFQjdcdTdEMDBcdTkzMDRcdTZBOTRcdTIwMjZcIiwgdG90YWxSZXNvdXJjZXM6IDAgfSk7XG4gICAgbGV0IGJ1bmRsZTtcbiAgICB0cnkge1xuICAgICAgYnVuZGxlID0gX2Fzc2VtYmxlTG9jYWxCdW5kbGUoYnlUeXBlLCBwYXRpZW50T3ZlcnJpZGUsIG1hc2tFbmFibGVkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvcnMucHVzaChgbG9jYWwgbWFwcGluZzogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICBidW5kbGUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoYnVuZGxlKSB7XG4gICAgICB0b3RhbCA9IGJ1bmRsZS5lbnRyeS5sZW5ndGg7XG4gICAgICBhd2FpdCBzZXRTdGF0dXMoeyBwcm9ncmVzczogYFx1RDgzRFx1RENCRSBcdTZFOTZcdTUwOTkgJHt0b3RhbH0gXHU3QjQ2IEZISVIgXHU4Q0M3XHU2RTkwXHUyMDI2YCwgdG90YWxSZXNvdXJjZXM6IHRvdGFsIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGwgPSBhd2FpdCBfc3Rhc2hGaGlyQnVuZGxlKGJ1bmRsZSwgcGF0aWVudE92ZXJyaWRlLmlkX25vLCBkYXRlUmFuZ2UpO1xuICAgICAgICBfbG9jYWxGaWxlbmFtZSA9IGRsLmZpbGVuYW1lO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvcnMucHVzaChgc3Rhc2ggYnVuZGxlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gQnVpbGQgdGhlIG92ZXJyaWRlIHdlIHNlbmQgdG8gYmFja2VuZCB3aXRoIHRoZSBtYXliZS1tYXNrZWQgbmFtZVxuICAgIC8vIHNvIGJhY2tlbmQncyBhdXRvLWNyZWF0ZWQgUGF0aWVudCArIHRoZSBwZXItaXRlbSBzdWJqZWN0LmRpc3BsYXlcbiAgICAvLyBzZWUgdGhlIHNhbWUgdmFsdWUgdGhlIHVzZXIgb3B0ZWQgaW50by4gSXRlbXMgdGhlbXNlbHZlcyB3ZXJlXG4gICAgLy8gYWxyZWFkeSBzY3J1YmJlZCBhYm92ZSAoYnlUeXBlIHBhc3MpLCBzbyB0aGlzIGp1c3QgY292ZXJzIHRoZVxuICAgIC8vIG92ZXJyaWRlLWRlcml2ZWQgUGF0aWVudC5cbiAgICBjb25zdCB1cGxvYWRPdmVycmlkZSA9IG1hc2tFbmFibGVkICYmIHBhdGllbnRPdmVycmlkZS5uYW1lXG4gICAgICA/IHsgLi4ucGF0aWVudE92ZXJyaWRlLCBuYW1lOiBtYXNrTmFtZShwYXRpZW50T3ZlcnJpZGUubmFtZSkgfVxuICAgICAgOiBwYXRpZW50T3ZlcnJpZGU7XG4gICAgZm9yIChjb25zdCBbcGFnZV90eXBlLCBpdGVtc10gb2YgT2JqZWN0LmVudHJpZXMoYnlUeXBlKSkge1xuICAgICAgaWYgKF9jYW5jZWxsZWQpIHRocm93IG5ldyBFcnJvcihDQU5DRUxfRVJST1IpO1xuICAgICAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICAgICAgcHJvZ3Jlc3M6IGBcdTJCMDZcdUZFMEYgXHU0RTBBXHU1MEIzICR7cGFnZV90eXBlfVx1RkYwOCR7aXRlbXMubGVuZ3RofSBcdTdCNDZcdUZGMDlcdTIwMjZgLFxuICAgICAgICB0b3RhbFJlc291cmNlczogdG90YWwsXG4gICAgICB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBfcG9zdFN0cnVjdHVyZWQoYmFja2VuZCwgcGFnZV90eXBlLCBpdGVtcywgc3luY0FwaUtleSwgdXBsb2FkT3ZlcnJpZGUpO1xuICAgICAgICB0b3RhbCArPSBkYXRhLmNvdW50IHx8IDA7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGB1cGxvYWQgJHtwYWdlX3R5cGV9OiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZnRlciBiYWNrZW5kIHVwbG9hZCwgYWxzbyBmZXRjaCBhIHNuYXBzaG90IG9mIHRoZSBwYXRpZW50J3MgZnVsbFxuICAgIC8vIGN1bXVsYXRpdmUgRkhJUiBCdW5kbGUgYW5kIHN0YXNoIGl0IGZvciB0aGUgcG9wdXAncyBcIlx1RDgzRFx1RENFNSBcdTRFMEJcdThGMDlcIiBidXR0b24uXG4gICAgLy8gVGhpcyBpcyB3aGF0IGAvZmhpci9leHBvcnRgIHJldHVybnMgXHUyMDE0IHRoZSBiYWNrZW5kJ3MgY29tcGxldGUgdmlld1xuICAgIC8vIG9mIHRoaXMgcGF0aWVudCAodGhpcyBzeW5jICsgYW55IHByaW9yIHN5bmNzKSwgYXMgb3Bwb3NlZCB0byBsb2NhbFxuICAgIC8vIG1vZGUncyBcImp1c3QgdGhpcyBzeW5jXCIgYnVuZGxlLlxuICAgIGlmIChwYXRpZW50T3ZlcnJpZGUuaWRfbm8pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHNldFN0YXR1cyh7IHByb2dyZXNzOiBcIlx1RDgzRFx1RENFNiBcdTUzRDZcdTVGOTdcdTVGOENcdTdBRUZcdTVCOENcdTY1NzRcdThDQzdcdTY1OTlcdTIwMjZcIiwgdG90YWxSZXNvdXJjZXM6IHRvdGFsIH0pO1xuICAgICAgICBjb25zdCBleHBVcmwgPSBgJHtiYWNrZW5kfS9maGlyL2V4cG9ydD9wYXRpZW50PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHBhdGllbnRPdmVycmlkZS5pZF9ubyl9YDtcbiAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKGV4cFVybCwge1xuICAgICAgICAgIGhlYWRlcnM6IHN5bmNBcGlLZXkgPyB7IFwiWC1TeW5jLUFQSS1LZXlcIjogc3luY0FwaUtleSB9IDoge30sXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoci5vaykge1xuICAgICAgICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgIGNvbnN0IGRsID0gYXdhaXQgX3N0YXNoRmhpckJ1bmRsZShidW5kbGUsIHBhdGllbnRPdmVycmlkZS5pZF9ubyk7XG4gICAgICAgICAgX2xvY2FsRmlsZW5hbWUgPSBkbC5maWxlbmFtZTtcbiAgICAgICAgICAvLyBBbGlnbiByZXBvcnRlZCBjb3VudCB3aXRoIGxvY2FsIG1vZGU6IGJ1bmRsZS5lbnRyeS5sZW5ndGhcbiAgICAgICAgICAvLyBpbmNsdWRlcyB0aGUgUGF0aWVudCByZXNvdXJjZSAod2hpY2ggdGhlIHBlci1wYWdlLXR5cGUgUE9TVFxuICAgICAgICAgIC8vIGNvdW50cyBoYWQgcHJldmlvdXNseSBvbWl0dGVkIGJlY2F1c2UgUGF0aWVudCBpcyBhdXRvLWNyZWF0ZWRcbiAgICAgICAgICAvLyBzaWxlbnRseSBmcm9tIHBhdGllbnRfb3ZlcnJpZGUpLiBTYW1lIGRhdGEgXHUyMTkyIHNhbWUgbnVtYmVyLlxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJ1bmRsZS5lbnRyeSkpIHRvdGFsID0gYnVuZGxlLmVudHJ5Lmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChgZXhwb3J0IGJ1bmRsZTogSFRUUCAke3Iuc3RhdHVzfWApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBleHBvcnQgYnVuZGxlOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgX21hcmtQaGFzZShtb2RlID09PSBcImxvY2FsXCIgPyBcImFzc2VtYmxlK3N0YXNoXCIgOiBcImJhY2tlbmQtdXBsb2FkXCIpO1xuXG4gIC8vIEZvcm1hdCBlbGFwc2VkIHdhbGwtY2xvY2sgdGltZTogc2Vjb25kcyAoMSBkcCkgZm9yIHNob3J0IHN5bmNzLFxuICAvLyBcIm1tOnNzXCIgb25jZSB3ZSBjcm9zcyB0aGUgbWludXRlIG1hcmsgc28gdGhlIHBvcHVwIHN0YXR1cyBzdGF5cyByZWFkYWJsZS5cbiAgY29uc3QgX2VsYXBzZWRNcyA9IERhdGUubm93KCkgLSBfdDA7XG4gIGNvbnN0IF9lbGFwc2VkU3RyID0gX2VsYXBzZWRNcyA8IDYwXzAwMFxuICAgID8gYCR7KF9lbGFwc2VkTXMgLyAxMDAwKS50b0ZpeGVkKDEpfXNgXG4gICAgOiBgJHtNYXRoLmZsb29yKF9lbGFwc2VkTXMgLyA2MF8wMDApfW0ke01hdGgucm91bmQoKF9lbGFwc2VkTXMgJSA2MF8wMDApIC8gMTAwMCl9c2A7XG4gIC8vIE5vIG1vcmUgXCJcdTZBOTRcdTY4NDhcdTVERjJcdTUwOTlcdTU5QTVcdTIwMjZcIiB0YWlsIFx1MjAxNCB0aGUgXHVEODNEXHVEQ0U1IGRvd25sb2FkIGJ1dHRvbiBzaXRzIHJpZ2h0XG4gIC8vIGJlbG93IHRoZSBzdGF0dXMsIHNvIHNheWluZyBcIlx1OUVERVx1NEUwQlx1NjVCOVx1NjMwOVx1OTIxNVwiIGlzIGp1c3Qgbm9pc2UuXG4gIGNvbnN0IF9sb2NhbFRhaWwgPSBcIlwiO1xuICBjb25zdCBfc3VjY2Vzc1ZlcmIgPSBtb2RlID09PSBcImxvY2FsXCIgPyBcIlx1NURGMlx1NzUyMlx1NzUxRlwiIDogXCJcdTVERjJcdTY2RjRcdTY1QjBcIjtcbiAgLy8gUHJlcGVuZCBwaGFzZSB0aW1pbmdzIHRvIHRoZSBicmVha2Rvd24gc28gdGhlIHVzZXIgY2FuIHNlZSB3aGljaFxuICAvLyBzdGVwIGlzIHNsb3cgKE5ISSBmZXRjaCBpcyB1c3VhbGx5IHRoZSBidWxrOyBiYWNrZW5kIG1vZGUgYWRkcyBhblxuICAvLyB1cGxvYWQgc3RlcCBtZWFzdXJlZCBpbiAxMDBzIG9mIG1zIG5vdCBzZWNvbmRzKS5cbiAgY29uc3QgX3BoYXNlTGluZXMgPSBfcGhhc2VzLm1hcCgocCkgPT4gYFx1MjNGMSAke3AubmFtZX09JHsocC5tcyAvIDEwMDApLnRvRml4ZWQoMSl9c2ApO1xuICBjb25zdCBfZnVsbEJyZWFrZG93biA9IFsuLi5fcGhhc2VMaW5lcywgLi4uYnJlYWtkb3duXTtcbiAgYXdhaXQgc2V0U3RhdHVzKHtcbiAgICBydW5uaW5nOiBmYWxzZSxcbiAgICBwcm9ncmVzczogZXJyb3JzLmxlbmd0aFxuICAgICAgPyBgXHUyNkEwXHVGRTBGIFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgJHtfc3VjY2Vzc1ZlcmJ9ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1RkYwQyR7ZXJyb3JzLmxlbmd0aH0gXHU5ODA1XHU1OTMxXHU2NTU3XHVGRjA4JHtfZWxhcHNlZFN0cn1cdUZGMDkke19sb2NhbFRhaWx9YFxuICAgICAgOiBgXHUyNzA1IFx1NTNENlx1NUY5N1x1NUI4Q1x1NjIxMCBcdTAwQjcgJHtfc3VjY2Vzc1ZlcmJ9ICR7dG90YWx9IFx1N0I0Nlx1NTA2NVx1NUVCN1x1N0QwMFx1OTMwNFx1RkYwOCR7X2VsYXBzZWRTdHJ9XHVGRjA5JHtfbG9jYWxUYWlsfWAsXG4gICAgcGhhc2U6IFwiZG9uZVwiLFxuICAgIHRvdGFsUmVzb3VyY2VzOiB0b3RhbCxcbiAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgZWxhcHNlZE1zOiBfZWxhcHNlZE1zLFxuICAgIC8vIFBlci1lbmRwb2ludCBicmVha2Rvd24gZm9yIHRoZSBwb3B1cCdzICdcdTY3RTVcdTc3MEJcdTY2MEVcdTdEMzAnIGNvbGxhcHNpYmxlLlxuICAgIC8vIEtlZXAgYXMgYSBwbGFpbiBhcnJheSBzbyBwb3B1cC5qcyBjYW4gcmVuZGVyIHdpdGggRE9NIEFQSSAobm9cbiAgICAvLyBpbm5lckhUTUwgLyBubyBlc2NhcGluZyBjb25jZXJucykuIEl0ZW1zIGxvb2sgbGlrZVxuICAgIC8vICdlbmNvdW50ZXJzPTEyLzEyJyBvciAnYWR1bHRfcHJldmVudGl2ZT0yIHJvd3MgXHUyMTkyIDM2IG9icycuXG4gICAgYnJlYWtkb3duOiBfZnVsbEJyZWFrZG93bixcbiAgICBlcnJvcnMsXG4gICAgaGlzdG5vOiBwYXRpZW50T3ZlcnJpZGUuaWRfbm8sXG4gICAgbW9kZSxcbiAgICBsb2NhbEZpbGVuYW1lOiBfbG9jYWxGaWxlbmFtZSxcbiAgfSk7XG5cbiAgLy8gUmVzdW1lIHRoZSBzaWRlYmFyIGlmcmFtZSBub3cgdGhhdCB0aGUgTkhJIHRhYiBpcyBubyBsb25nZXIgYnVzeS5cbiAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc3luY1J1bm5pbmc6IGZhbHNlIH0pLmNhdGNoKCgpID0+IHt9KTtcblxuICAvLyBCZXN0LWVmZm9ydDogd3JpdGUgYSBTeW5jIEhpc3Rvcnkgcm93IHRvIHRoZSBiYWNrZW5kIHNvIHRoZSBkYXNoYm9hcmRcbiAgLy8gY2FuIHNob3cgd2hlbi93aG8vaG93LWxvbmcvd2hhdC9yYW5nZS4gU2tpcHBlZCBpbiBsb2NhbCBtb2RlICh0aGVyZVxuICAvLyBpcyBubyBiYWNrZW5kKS4gV3JhcHBlZCArIHN3YWxsb3dlZCBzbyBhIGxvZ2dpbmcgZmFpbHVyZSBuZXZlclxuICAvLyBwcm9wYWdhdGVzIGJhY2sgdG8gdGhlIHVzZXItZmFjaW5nIHN5bmMgc3RhdHVzLlxuICBpZiAobW9kZSAhPT0gXCJsb2NhbFwiKSB0cnkge1xuICAgIGF3YWl0IGZldGNoKGAke2JhY2tlbmR9L3N5bmMvbG9nYCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIC4uLihzeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IHN5bmNBcGlLZXkgfSA6IHt9KSxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHN0YXR1czogZXJyb3JzLmxlbmd0aCA/IFwicGFydGlhbFwiIDogXCJzdWNjZXNzXCIsXG4gICAgICAgIHBhdGllbnRfaWQ6IHBhdGllbnRPdmVycmlkZS5pZF9ubyB8fCBcIlwiLFxuICAgICAgICAvLyAvc3luYy9sb2cgbGFuZHMgaW4gdGhlIGRhc2hib2FyZCdzIHN5bmMtaGlzdG9yeSByb3cuIE9ubHlcbiAgICAgICAgLy8gbWFzayB3aGVuIHRoZSB1c2VyIGhhcyBvcHRlZCBpbiBcdTIwMTQgb3RoZXJ3aXNlIGRhc2hib2FyZCBzZWVzXG4gICAgICAgIC8vIHRoZSByYXcgbmFtZSB0aGV5IHR5cGVkIChjb25zaXN0ZW50IHdpdGggXCJcdTZDMTFcdTc3M0VcdTgxRUFcdTc1MjhcIiBkZWZhdWx0KS5cbiAgICAgICAgcGF0aWVudF9uYW1lOiBtYXNrRW5hYmxlZFxuICAgICAgICAgID8gbWFza05hbWUocGF0aWVudE92ZXJyaWRlLm5hbWUgfHwgXCJcIilcbiAgICAgICAgICA6IHBhdGllbnRPdmVycmlkZS5uYW1lIHx8IFwiXCIsXG4gICAgICAgIHRvdGFsLFxuICAgICAgICBicmVha2Rvd24sXG4gICAgICAgIGRhdGVfcmFuZ2U6IGRhdGVSYW5nZUxhYmVsIHx8IFwiXCIsXG4gICAgICAgIGVsYXBzZWRfbXM6IF9lbGFwc2VkTXMsXG4gICAgICAgIHN0YXJ0ZWRfYXQ6IG5ldyBEYXRlKF90MCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgZXJyb3JzLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJbTkhJIHN5bmNdIGZhaWxlZCB0byB3cml0ZSBoaXN0b3J5IGxvZzpcIiwgZSk7XG4gIH1cbiAgX2FjdGl2ZVN5bmNDdHggPSBudWxsO1xufVxuXG4vLyBPbiBpbnN0YWxsIC8gdXBkYXRlIC8gY2hyb21lOi8vZXh0ZW5zaW9ucyByZWxvYWQsIHRoZSBuZXcgc2lkZWJhci5qc1xuLy8gaXMgc2hpcHBlZCBpbiB0aGUgYnVuZGxlIGJ1dCBDaHJvbWUgd29uJ3QgcmUtaW5qZWN0IGl0IGludG8gYWxyZWFkeS1cbi8vIG9wZW4gTkhJIHRhYnMgKGNvbnRlbnRfc2NyaXB0cyBvbmx5IGZpcmUgYXQgZG9jdW1lbnRfaWRsZSBvZiBmcmVzaFxuLy8gbG9hZHMpLiBXaXRob3V0IHRoaXMsIHNldHRpbmdzIGludHJvZHVjZWQgaW4gdGhlIG5ldyB2ZXJzaW9uIChlLmcuXG4vLyB0aGUgc2lkZWJhckVuYWJsZWQgdG9nZ2xlKSBhcHBlYXIgaW5lcnQgb24gb3BlbiB0YWJzIHVudGlsIEY1LlxuLy8gRm9yY2UtaW5qZWN0IHNvIHRoZSB0b2dnbGUgdGFrZXMgZWZmZWN0IGltbWVkaWF0ZWx5LlxuLy8gT25lLXRpbWUgbWlncmF0aW9uIGZyb20gY2hyb21lLnN0b3JhZ2Uuc3luYyBcdTIxOTIgY2hyb21lLnN0b3JhZ2UubG9jYWwuXG4vLyBQcmV2aW91cyB2ZXJzaW9ucyBzdG9yZWQgc3luY0FwaUtleSArIHBhdGllbnRPdmVycmlkZSAoY29udGFpbmluZyB0aGVcbi8vIG5hdGlvbmFsIElEKSB1bmRlciAuc3luYywgd2hpY2ggQ2hyb21lIHJlcGxpY2F0ZXMgdG8gdGhlIHVzZXIncyBHb29nbGVcbi8vIGFjY291bnQgYW5kIHB1c2hlcyB0byBldmVyeSBkZXZpY2UgdGhleSBzaWduIGludG8uIE1vdmUgZXZlcnl0aGluZ1xuLy8gc2V0dGluZ3MtcmVsYXRlZCB0byAubG9jYWw7IGNsZWFyIHRoZSBzeW5jIGNvcHkuXG5jb25zdCBTWU5DX0tFWVNfVE9fTUlHUkFURSA9IFtcbiAgXCJiYWNrZW5kVXJsXCIsXG4gIFwic3luY0FwaUtleVwiLFxuICBcInNtYXJ0QXBwTGF1bmNoVXJsXCIsXG4gIFwicGF0aWVudE92ZXJyaWRlXCIsXG4gIFwic3luY01vZGVcIixcbiAgXCJzaWRlYmFyRW5hYmxlZFwiLFxuICBcIm1hc2tOYW1lRW5hYmxlZFwiLFxuXTtcblxuYXN5bmMgZnVuY3Rpb24gbWlncmF0ZVN5bmNUb0xvY2FsKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHN5bmNlZCA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFNZTkNfS0VZU19UT19NSUdSQVRFKTtcbiAgICBjb25zdCBwcmVzZW50ID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgT2JqZWN0LmVudHJpZXMoc3luY2VkKS5maWx0ZXIoKFssIHZdKSA9PiB2ICE9PSB1bmRlZmluZWQpLFxuICAgICk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHByZXNlbnQpLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IGxvY2FsID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KE9iamVjdC5rZXlzKHByZXNlbnQpKTtcbiAgICAvLyBEb24ndCBvdmVyd3JpdGUgYW55dGhpbmcgdGhlIHVzZXIgYWxyZWFkeSBzZXQgb24gdGhpcyBtYWNoaW5lLlxuICAgIGNvbnN0IHRvV3JpdGUgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhwcmVzZW50KS5maWx0ZXIoKFtrXSkgPT4gbG9jYWxba10gPT09IHVuZGVmaW5lZCksXG4gICAgKTtcbiAgICBpZiAoT2JqZWN0LmtleXModG9Xcml0ZSkubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHRvV3JpdGUpO1xuICAgIH1cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLnJlbW92ZShPYmplY3Qua2V5cyhwcmVzZW50KSk7XG4gIH0gY2F0Y2gge1xuICAgIC8vIE1pZ3JhdGlvbiBpcyBiZXN0LWVmZm9ydC4gVGhlIG5leHQgcnVuIGdldHMgdG8gdHJ5IGFnYWluLlxuICB9XG59XG5cbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGFzeW5jICgpID0+IHtcbiAgYXdhaXQgbWlncmF0ZVN5bmNUb0xvY2FsKCk7XG4gIGxldCB0YWJzO1xuICB0cnkge1xuICAgIHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7IHVybDogXCJodHRwczovL215aGVhbHRoYmFuay5uaGkuZ292LnR3LypcIiB9KTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAoY29uc3QgdGFiIG9mIHRhYnMpIHtcbiAgICBjaHJvbWUuc2NyaXB0aW5nXG4gICAgICAuZXhlY3V0ZVNjcmlwdCh7IHRhcmdldDogeyB0YWJJZDogdGFiLmlkIH0sIGZpbGVzOiBbXCJzaWRlYmFyLmpzXCJdIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge30pO1xuICB9XG59KTtcblxuLy8gQWxzbyBydW4gbWlncmF0aW9uIG9uIHNlcnZpY2Utd29ya2VyIHdha2UtdXAgKGNvdmVycyByZWxvYWQvcmVzdGFydFxuLy8gcGF0aHMgd2hlcmUgb25JbnN0YWxsZWQgZG9lc24ndCBmaXJlKS5cbmNocm9tZS5ydW50aW1lLm9uU3RhcnR1cD8uYWRkTGlzdGVuZXI/LigoKSA9PiB7XG4gIG1pZ3JhdGVTeW5jVG9Mb2NhbCgpO1xufSk7XG5taWdyYXRlU3luY1RvTG9jYWwoKTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2csIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gIGlmIChtc2c/LnR5cGUgPT09IFwic3RhcnROaGlBcGlTeW5jXCIpIHtcbiAgICBydW5OaGlBcGlTeW5jKG1zZy5wYXlsb2FkKS50aGVuKFxuICAgICAgKCkgPT4geyB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KTsgfSBjYXRjaCB7fSB9LFxuICAgICAgYXN5bmMgKGUpID0+IHtcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBzaWRlYmFyIGlmcmFtZSBnZXRzIHVuLXBhdXNlZCBvbiBldmVyeSBleGl0IHBhdGhcbiAgICAgICAgLy8gKHN1Y2Nlc3MgcnVucyB0aGlzIGZyb20gaW5zaWRlIHJ1bk5oaUFwaVN5bmM7IGNhbmNlbCArIGVycm9yICtcbiAgICAgICAgLy8gc2Vzc2lvbi1leHBpcmVkIGJhaWwgYmVmb3JlIHJlYWNoaW5nIHRoYXQgcG9pbnQpLlxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzeW5jUnVubmluZzogZmFsc2UgfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gQ0FOQ0VMX0VSUk9SKSB7XG4gICAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUsIGNhbmNlbGxlZDogdHJ1ZSB9KTsgfSBjYXRjaCB7fVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZT8ubWVzc2FnZSA9PT0gU0VTU0lPTl9FWFBJUkVEX0VSUk9SKSB7XG4gICAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICAgIHN5bmNTdGF0dXM6IHtcbiAgICAgICAgICAgICAgcnVubmluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiBcIlx1RDgzRFx1REQxMiBOSEkgc2Vzc2lvbiBcdTVERjJcdTc2N0JcdTUxRkEgXHUyMDE0IFx1OEFDQlx1NTcyOCBOSEkgdGFiIFx1OTFDRFx1NjVCMFx1NzY3Qlx1NTE2NVx1NUY4Q1x1NTE4RFx1OUVERSBTeW5jXCIsXG4gICAgICAgICAgICAgIHBoYXNlOiBcInNlc3Npb25fZXhwaXJlZFwiLFxuICAgICAgICAgICAgICB0czogRGF0ZS5ub3coKSwgY29tcGxldGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cnkgeyBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGV4cGlyZWQ6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5lcnJvcihcInJ1bk5oaUFwaVN5bmMgZmFpbGVkXCIsIGUpO1xuICAgICAgICBhd2FpdCBzZXRTdGF0dXMoeyBydW5uaW5nOiBmYWxzZSwgcHJvZ3Jlc3M6IGBcdTI3NEMgJHtlLm1lc3NhZ2V9YCwgcGhhc2U6IFwiZXJyb3JcIiB9KTtcbiAgICAgICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBlcnJvcjogZS5tZXNzYWdlIH0pOyB9IGNhdGNoIHt9XG4gICAgICB9LFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJzdG9wU3luY1wiKSB7XG4gICAgLy8gU2V0IHRoZSBjYW5jZWxsYXRpb24gZmxhZzsgdGhlIGluLWZsaWdodCBzeW5jIHdpbGwgdGhyb3dcbiAgICAvLyBDQU5DRUxfRVJST1IgYXQgaXRzIG5leHQgY2hlY2tDYW5jZWwoKSBjYWxsLiAgU3RvcmFnZSBpcyBhbHJlYWR5XG4gICAgLy8gdXBkYXRlZCBieSB0aGUgcG9wdXAsIHNvIHdlIGRvbid0IHRvdWNoIGl0IGhlcmUuXG4gICAgX2NhbmNlbGxlZCA9IHRydWU7XG4gICAgLy8gRGlzY2FyZCBhbnkgcGFydGlhbCBkYXRhIHVwbG9hZGVkIHNvIGZhci4gVGhlIHVzZXIncyBzdGF0ZWRcbiAgICAvLyBjb250cmFjdCBpcyAnc3RvcCA9IGFib3J0LCBJJ2xsIHJlc3luYyBmcm9tIHNjcmF0Y2ggbGF0ZXInIFx1MjAxNCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gbGVhdmUgYSBoYWxmLWxvYWRlZCBwYXRpZW50IGluIHRoZSBGSElSIHN0b3JlIHRoYXRcbiAgICAvLyBsb29rcyBjb21wbGV0ZSB0byBkb3duc3RyZWFtIFNNQVJUIGFwcHMuXG4gICAgY29uc3QgY3R4ID0gX2FjdGl2ZVN5bmNDdHg7XG4gICAgaWYgKGN0eD8ucGF0aWVudElkICYmIGN0eC5iYWNrZW5kKSB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYCR7Y3R4LmJhY2tlbmR9L3N5bmMvcGF0aWVudC8ke2VuY29kZVVSSUNvbXBvbmVudChjdHgucGF0aWVudElkKX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IGN0eC5zeW5jQXBpS2V5ID8geyBcIlgtU3luYy1BUEktS2V5XCI6IGN0eC5zeW5jQXBpS2V5IH0gOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBTdXJmYWNlIHRoZSB3aXBlIGluIHRoZSBzdGF0dXMgc28gdXNlciBzZWVzIGl0IGFjdHVhbGx5IGhhcHBlbmVkLlxuICAgICAgICAgIGNvbnN0IHByZXYgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFNUT1JBR0VfS0VZKSlbU1RPUkFHRV9LRVldIHx8IHt9O1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgICAgICBbU1RPUkFHRV9LRVldOiB7XG4gICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgIHJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwcm9ncmVzczogXCJcdTI2RDQgXHU1REYyXHU1MDVDXHU2QjYyXHU0RTI2XHU2RTA1XHU5NjY0XHU5MEU4XHU1MjA2XHU4Q0M3XHU2NTk5IFx1MjAxNCBcdThBQ0JcdTkxQ0RcdTY1QjBcdTUzRDZcdTVGOTdcIixcbiAgICAgICAgICAgICAgcGhhc2U6IFwiY2FuY2VsbGVkXCIsXG4gICAgICAgICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICBjb21wbGV0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW05ISSBzeW5jXSBjYW5jZWwgd2lwZSBmYWlsZWQ6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICBfYWN0aXZlU3luY0N0eCA9IG51bGw7XG4gICAgdHJ5IHsgc2VuZFJlc3BvbnNlKHsgb2s6IHRydWUgfSk7IH0gY2F0Y2gge31cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobXNnPy50eXBlID09PSBcImdldFN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSkudGhlbigoZGF0YSkgPT4gc2VuZFJlc3BvbnNlKGRhdGFbU1RPUkFHRV9LRVldIHx8IG51bGwpKTtcbiAgICByZXR1cm4gdHJ1ZTsgIC8vIGFzeW5jIHJlc3BvbnNlXG4gIH1cbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJjbGVhclN5bmNTdGF0dXNcIikge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShTVE9SQUdFX0tFWSkudGhlbigoKSA9PiBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSB9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuXG4vLyBCZWx0LWFuZC1zdXNwZW5kZXJzIFNXIGtlZXBhbGl2ZTogYW4gYWxhcm0gZXZlcnkgMjAgcyB3YWtlcyB0aGUgU1cgaWZcbi8vIGlkbGUuIENvbWJpbmVkIHdpdGggdGhlIHJldHVybi10cnVlIHBhdHRlcm4gYWJvdmUsIHRoaXMgcHJldmVudHMgdGhlXG4vLyAzMCBzIGlkbGUgc2h1dGRvd24gZnJvbSBlbmRpbmcgYW4gaW4tcHJvZ3Jlc3Mgc3luYy5cbmNocm9tZS5hbGFybXMuY3JlYXRlKFwic3cta2VlcGFsaXZlXCIsIHsgcGVyaW9kSW5NaW51dGVzOiAwLjM0IH0pO1xuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKCgpID0+IHsgLyogbm8tb3A7IHByZXNlbmNlIGlzIHRoZSBwb2ludCAqLyB9KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBU0EsT0FBQyxXQUFXO0FBQ1Y7QUFFQSxZQUFJLGNBQWM7QUFDbEIsWUFBSSxpQkFBaUI7QUFDckIsWUFBSSxTQUFTLE9BQU8sV0FBVztBQUMvQixZQUFJLE9BQU8sU0FBUyxTQUFTLENBQUM7QUFDOUIsWUFBSSxLQUFLLG1CQUFtQjtBQUMxQixtQkFBUztBQUFBLFFBQ1g7QUFDQSxZQUFJLGFBQWEsQ0FBQyxVQUFVLE9BQU8sU0FBUztBQUM1QyxZQUFJLFVBQVUsQ0FBQyxLQUFLLHNCQUFzQixPQUFPLFlBQVksWUFBWSxRQUFRLFlBQVksUUFBUSxTQUFTO0FBQzlHLFlBQUksU0FBUztBQUNYLGlCQUFPO0FBQUEsUUFDVCxXQUFXLFlBQVk7QUFDckIsaUJBQU87QUFBQSxRQUNUO0FBQ0EsWUFBSSxZQUFZLENBQUMsS0FBSyx3QkFBd0IsT0FBTyxXQUFXLFlBQVksT0FBTztBQUNuRixZQUFJLE1BQU0sT0FBTyxXQUFXLGNBQWMsT0FBTztBQUNqRCxZQUFJLGVBQWUsQ0FBQyxLQUFLLDJCQUEyQixPQUFPLGdCQUFnQjtBQUMzRSxZQUFJLFlBQVksbUJBQW1CLE1BQU0sRUFBRTtBQUMzQyxZQUFJLFFBQVEsQ0FBQyxhQUFhLFNBQVMsT0FBTyxHQUFHO0FBQzdDLFlBQUksUUFBUSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7QUFDekIsWUFBSSxlQUFlLENBQUMsT0FBTyxTQUFTLFVBQVUsYUFBYTtBQUUzRCxZQUFJLFNBQVMsQ0FBQztBQUVkLFlBQUksVUFBVSxNQUFNO0FBQ3BCLFlBQUksS0FBSyxzQkFBc0IsQ0FBQyxTQUFTO0FBQ3ZDLG9CQUFVLFNBQVUsS0FBSztBQUN2QixtQkFBTyxPQUFPLFVBQVUsU0FBUyxLQUFLLEdBQUcsTUFBTTtBQUFBLFVBQ2pEO0FBQUEsUUFDRjtBQUVBLFlBQUksU0FBUyxZQUFZO0FBQ3pCLFlBQUksaUJBQWlCLEtBQUssbUNBQW1DLENBQUMsU0FBUztBQUNyRSxtQkFBUyxTQUFVLEtBQUs7QUFDdEIsbUJBQU8sT0FBTyxRQUFRLFlBQVksSUFBSSxVQUFVLElBQUksT0FBTyxnQkFBZ0I7QUFBQSxVQUM3RTtBQUFBLFFBQ0Y7QUFHQSxZQUFJLGdCQUFnQixTQUFVLFNBQVM7QUFDckMsY0FBSSxPQUFPLE9BQU87QUFDbEIsY0FBSSxTQUFTLFVBQVU7QUFDckIsbUJBQU8sQ0FBQyxTQUFTLElBQUk7QUFBQSxVQUN2QjtBQUNBLGNBQUksU0FBUyxZQUFZLFlBQVksTUFBTTtBQUN6QyxrQkFBTSxJQUFJLE1BQU0sV0FBVztBQUFBLFVBQzdCO0FBQ0EsY0FBSSxnQkFBZ0IsUUFBUSxnQkFBZ0IsYUFBYTtBQUN2RCxtQkFBTyxDQUFDLElBQUksV0FBVyxPQUFPLEdBQUcsS0FBSztBQUFBLFVBQ3hDO0FBQ0EsY0FBSSxDQUFDLFFBQVEsT0FBTyxLQUFLLENBQUMsT0FBTyxPQUFPLEdBQUc7QUFDekMsa0JBQU0sSUFBSSxNQUFNLFdBQVc7QUFBQSxVQUM3QjtBQUNBLGlCQUFPLENBQUMsU0FBUyxLQUFLO0FBQUEsUUFDeEI7QUFFQSxZQUFJLHFCQUFxQixTQUFVLFlBQVk7QUFDN0MsaUJBQU8sU0FBVSxTQUFTO0FBQ3hCLG1CQUFPLElBQUksS0FBSyxJQUFJLEVBQUUsT0FBTyxPQUFPLEVBQUUsVUFBVSxFQUFFO0FBQUEsVUFDcEQ7QUFBQSxRQUNGO0FBRUEsWUFBSSxlQUFlLFdBQVk7QUFDN0IsY0FBSSxTQUFTLG1CQUFtQixLQUFLO0FBQ3JDLGNBQUksU0FBUztBQUNYLHFCQUFTLFNBQVMsTUFBTTtBQUFBLFVBQzFCO0FBQ0EsaUJBQU8sU0FBUyxXQUFZO0FBQzFCLG1CQUFPLElBQUksS0FBSztBQUFBLFVBQ2xCO0FBQ0EsaUJBQU8sU0FBUyxTQUFVLFNBQVM7QUFDakMsbUJBQU8sT0FBTyxPQUFPLEVBQUUsT0FBTyxPQUFPO0FBQUEsVUFDdkM7QUFDQSxtQkFBUyxJQUFJLEdBQUcsSUFBSSxhQUFhLFFBQVEsRUFBRSxHQUFHO0FBQzVDLGdCQUFJLE9BQU8sYUFBYSxDQUFDO0FBQ3pCLG1CQUFPLElBQUksSUFBSSxtQkFBbUIsSUFBSTtBQUFBLFVBQ3hDO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBRUEsWUFBSSxXQUFXLFNBQVUsUUFBUTtBQUMvQixjQUFJQSxVQUFTO0FBQ2IsY0FBSUMsVUFBUyxpQkFBa0I7QUFDL0IsY0FBSTtBQUNKLGNBQUlBLFFBQU8sUUFBUSxDQUFDLEtBQUssd0JBQXdCO0FBQy9DLHlCQUFhQSxRQUFPO0FBQUEsVUFDdEIsT0FBTztBQUNMLHlCQUFhLFNBQVUsU0FBUztBQUM5QixxQkFBTyxJQUFJQSxRQUFPLE9BQU87QUFBQSxZQUMzQjtBQUFBLFVBQ0Y7QUFDQSxjQUFJLGFBQWEsU0FBVSxTQUFTO0FBQ2xDLGdCQUFJLE9BQU8sWUFBWSxVQUFVO0FBQy9CLHFCQUFPRCxRQUFPLFdBQVcsTUFBTSxFQUFFLE9BQU8sU0FBUyxNQUFNLEVBQUUsT0FBTyxLQUFLO0FBQUEsWUFDdkUsT0FBTztBQUNMLGtCQUFJLFlBQVksUUFBUSxZQUFZLFFBQVc7QUFDN0Msc0JBQU0sSUFBSSxNQUFNLFdBQVc7QUFBQSxjQUM3QixXQUFXLFFBQVEsZ0JBQWdCLGFBQWE7QUFDOUMsMEJBQVUsSUFBSSxXQUFXLE9BQU87QUFBQSxjQUNsQztBQUFBLFlBQ0Y7QUFDQSxnQkFBSSxRQUFRLE9BQU8sS0FBSyxPQUFPLE9BQU8sS0FDcEMsUUFBUSxnQkFBZ0JDLFNBQVE7QUFDaEMscUJBQU9ELFFBQU8sV0FBVyxNQUFNLEVBQUUsT0FBTyxXQUFXLE9BQU8sQ0FBQyxFQUFFLE9BQU8sS0FBSztBQUFBLFlBQzNFLE9BQU87QUFDTCxxQkFBTyxPQUFPLE9BQU87QUFBQSxZQUN2QjtBQUFBLFVBQ0Y7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxZQUFJLHlCQUF5QixTQUFVLFlBQVk7QUFDakQsaUJBQU8sU0FBVSxLQUFLLFNBQVM7QUFDN0IsbUJBQU8sSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFLE9BQU8sT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUFBLFVBQzdEO0FBQUEsUUFDRjtBQUVBLFlBQUksbUJBQW1CLFdBQVk7QUFDakMsY0FBSSxTQUFTLHVCQUF1QixLQUFLO0FBQ3pDLGlCQUFPLFNBQVMsU0FBVSxLQUFLO0FBQzdCLG1CQUFPLElBQUksU0FBUyxHQUFHO0FBQUEsVUFDekI7QUFDQSxpQkFBTyxTQUFTLFNBQVUsS0FBSyxTQUFTO0FBQ3RDLG1CQUFPLE9BQU8sT0FBTyxHQUFHLEVBQUUsT0FBTyxPQUFPO0FBQUEsVUFDMUM7QUFDQSxtQkFBUyxJQUFJLEdBQUcsSUFBSSxhQUFhLFFBQVEsRUFBRSxHQUFHO0FBQzVDLGdCQUFJLE9BQU8sYUFBYSxDQUFDO0FBQ3pCLG1CQUFPLElBQUksSUFBSSx1QkFBdUIsSUFBSTtBQUFBLFVBQzVDO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBRUEsaUJBQVMsS0FBSyxjQUFjO0FBQzFCLGNBQUksY0FBYztBQUNoQixtQkFBTyxDQUFDLElBQUksT0FBTyxFQUFFLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQ3pELE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUM1QyxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUUsSUFDOUMsT0FBTyxFQUFFLElBQUksT0FBTyxFQUFFLElBQUksT0FBTyxFQUFFLElBQUksT0FBTyxFQUFFLElBQUk7QUFDcEQsaUJBQUssU0FBUztBQUFBLFVBQ2hCLE9BQU87QUFDTCxpQkFBSyxTQUFTLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQUEsVUFDbEU7QUFFQSxlQUFLLEtBQUs7QUFDVixlQUFLLEtBQUs7QUFDVixlQUFLLEtBQUs7QUFDVixlQUFLLEtBQUs7QUFDVixlQUFLLEtBQUs7QUFFVixlQUFLLFFBQVEsS0FBSyxRQUFRLEtBQUssUUFBUSxLQUFLLFNBQVM7QUFDckQsZUFBSyxZQUFZLEtBQUssU0FBUztBQUMvQixlQUFLLFFBQVE7QUFBQSxRQUNmO0FBRUEsYUFBSyxVQUFVLFNBQVMsU0FBVSxTQUFTO0FBQ3pDLGNBQUksS0FBSyxXQUFXO0FBQ2xCLGtCQUFNLElBQUksTUFBTSxjQUFjO0FBQUEsVUFDaEM7QUFFQSxjQUFJLFNBQVMsY0FBYyxPQUFPO0FBQ2xDLG9CQUFVLE9BQU8sQ0FBQztBQUNsQixjQUFJLFdBQVcsT0FBTyxDQUFDO0FBQ3ZCLGNBQUksTUFBTSxRQUFRLEdBQUcsR0FBRyxTQUFTLFFBQVEsVUFBVSxHQUFHRSxVQUFTLEtBQUs7QUFFcEUsaUJBQU8sUUFBUSxRQUFRO0FBQ3JCLGdCQUFJLEtBQUssUUFBUTtBQUNmLG1CQUFLLFNBQVM7QUFDZCxjQUFBQSxRQUFPLENBQUMsSUFBSSxLQUFLO0FBQ2pCLG1CQUFLLFFBQVFBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUMxREEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQzVDQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFDOUNBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUFJO0FBQUEsWUFDdEQ7QUFFQSxnQkFBRyxVQUFVO0FBQ1gsbUJBQUssSUFBSSxLQUFLLE9BQU8sUUFBUSxVQUFVLElBQUksSUFBSSxFQUFFLE9BQU87QUFDdEQsdUJBQU8sUUFBUSxXQUFXLEtBQUs7QUFDL0Isb0JBQUksT0FBTyxLQUFNO0FBQ2Ysa0JBQUFBLFFBQU8sTUFBTSxDQUFDLEtBQUssUUFBUSxNQUFNLE1BQU0sQ0FBQztBQUFBLGdCQUMxQyxXQUFXLE9BQU8sTUFBTztBQUN2QixrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFRLFNBQVMsTUFBTyxNQUFNLE1BQU0sQ0FBQztBQUN6RCxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFRLE9BQU8sT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUFBLGdCQUM1RCxXQUFXLE9BQU8sU0FBVSxRQUFRLE9BQVE7QUFDMUMsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUSxTQUFTLE9BQVEsTUFBTSxNQUFNLENBQUM7QUFDMUQsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUyxTQUFTLElBQUssT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUNsRSxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFRLE9BQU8sT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUFBLGdCQUM1RCxPQUFPO0FBQ0wseUJBQU8sVUFBYSxPQUFPLFNBQVUsS0FBTyxRQUFRLFdBQVcsRUFBRSxLQUFLLElBQUk7QUFDMUUsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUSxTQUFTLE9BQVEsTUFBTSxNQUFNLENBQUM7QUFDMUQsa0JBQUFBLFFBQU8sTUFBTSxDQUFDLE1BQU0sTUFBUyxTQUFTLEtBQU0sT0FBVSxNQUFNLE1BQU0sQ0FBQztBQUNuRSxrQkFBQUEsUUFBTyxNQUFNLENBQUMsTUFBTSxNQUFTLFNBQVMsSUFBSyxPQUFVLE1BQU0sTUFBTSxDQUFDO0FBQ2xFLGtCQUFBQSxRQUFPLE1BQU0sQ0FBQyxNQUFNLE1BQVEsT0FBTyxPQUFVLE1BQU0sTUFBTSxDQUFDO0FBQUEsZ0JBQzVEO0FBQUEsY0FDRjtBQUFBLFlBQ0YsT0FBTztBQUNMLG1CQUFLLElBQUksS0FBSyxPQUFPLFFBQVEsVUFBVSxJQUFJLElBQUksRUFBRSxPQUFPO0FBQ3RELGdCQUFBQSxRQUFPLE1BQU0sQ0FBQyxLQUFLLFFBQVEsS0FBSyxLQUFLLE1BQU0sTUFBTSxDQUFDO0FBQUEsY0FDcEQ7QUFBQSxZQUNGO0FBRUEsaUJBQUssZ0JBQWdCO0FBQ3JCLGlCQUFLLFNBQVMsSUFBSSxLQUFLO0FBQ3ZCLGdCQUFJLEtBQUssSUFBSTtBQUNYLG1CQUFLLFFBQVFBLFFBQU8sRUFBRTtBQUN0QixtQkFBSyxRQUFRLElBQUk7QUFDakIsbUJBQUssS0FBSztBQUNWLG1CQUFLLFNBQVM7QUFBQSxZQUNoQixPQUFPO0FBQ0wsbUJBQUssUUFBUTtBQUFBLFlBQ2Y7QUFBQSxVQUNGO0FBQ0EsY0FBSSxLQUFLLFFBQVEsWUFBWTtBQUMzQixpQkFBSyxVQUFVLEtBQUssUUFBUSxjQUFjO0FBQzFDLGlCQUFLLFFBQVEsS0FBSyxRQUFRO0FBQUEsVUFDNUI7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxhQUFLLFVBQVUsV0FBVyxXQUFZO0FBQ3BDLGNBQUksS0FBSyxXQUFXO0FBQ2xCO0FBQUEsVUFDRjtBQUNBLGVBQUssWUFBWTtBQUNqQixjQUFJQSxVQUFTLEtBQUssUUFBUSxJQUFJLEtBQUs7QUFDbkMsVUFBQUEsUUFBTyxFQUFFLElBQUksS0FBSztBQUNsQixVQUFBQSxRQUFPLE1BQU0sQ0FBQyxLQUFLLE1BQU0sSUFBSSxDQUFDO0FBQzlCLGVBQUssUUFBUUEsUUFBTyxFQUFFO0FBQ3RCLGNBQUksS0FBSyxJQUFJO0FBQ1gsZ0JBQUksQ0FBQyxLQUFLLFFBQVE7QUFDaEIsbUJBQUssS0FBSztBQUFBLFlBQ1o7QUFDQSxZQUFBQSxRQUFPLENBQUMsSUFBSSxLQUFLO0FBQ2pCLFlBQUFBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUM3Q0EsUUFBTyxDQUFDLElBQUlBLFFBQU8sQ0FBQyxJQUFJQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQzVDQSxRQUFPLENBQUMsSUFBSUEsUUFBTyxDQUFDLElBQUlBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFDOUNBLFFBQU8sRUFBRSxJQUFJQSxRQUFPLEVBQUUsSUFBSUEsUUFBTyxFQUFFLElBQUlBLFFBQU8sRUFBRSxJQUFJO0FBQUEsVUFDdEQ7QUFDQSxVQUFBQSxRQUFPLEVBQUUsSUFBSSxLQUFLLFVBQVUsSUFBSSxLQUFLLFVBQVU7QUFDL0MsVUFBQUEsUUFBTyxFQUFFLElBQUksS0FBSyxTQUFTO0FBQzNCLGVBQUssS0FBSztBQUFBLFFBQ1o7QUFFQSxhQUFLLFVBQVUsT0FBTyxXQUFZO0FBQ2hDLGNBQUksSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLO0FBQ2pFLGNBQUksR0FBRyxHQUFHLEdBQUdBLFVBQVMsS0FBSztBQUUzQixlQUFJLElBQUksSUFBSSxJQUFJLElBQUksRUFBRSxHQUFHO0FBQ3ZCLGdCQUFJQSxRQUFPLElBQUksQ0FBQyxJQUFJQSxRQUFPLElBQUksQ0FBQyxJQUFJQSxRQUFPLElBQUksRUFBRSxJQUFJQSxRQUFPLElBQUksRUFBRTtBQUNsRSxZQUFBQSxRQUFPLENBQUMsSUFBTSxLQUFLLElBQU0sTUFBTTtBQUFBLFVBQ2pDO0FBRUEsZUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRztBQUN6QixnQkFBSyxJQUFJLElBQU8sQ0FBQyxJQUFLO0FBQ3RCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sQ0FBQyxLQUFLO0FBQzFDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTyxDQUFDLElBQUs7QUFDdEIsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU8sQ0FBQyxJQUFLO0FBQ3RCLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUssSUFBSSxJQUFPLENBQUMsSUFBSztBQUN0QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFLLElBQUksSUFBTyxDQUFDLElBQUs7QUFDdEIsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUFBLFVBQ3pCO0FBRUEsaUJBQU0sSUFBSSxJQUFJLEtBQUssR0FBRztBQUNwQixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLENBQUMsS0FBSztBQUMxQyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLGFBQWFBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDOUMsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzlDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBQUEsVUFDekI7QUFFQSxpQkFBTSxJQUFJLElBQUksS0FBSyxHQUFHO0FBQ3BCLGdCQUFLLElBQUksSUFBTSxJQUFJLElBQU0sSUFBSTtBQUM3QixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxhQUFhQSxRQUFPLENBQUMsS0FBSztBQUMxQyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU0sSUFBSSxJQUFNLElBQUk7QUFDN0IsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU0sSUFBSSxJQUFNLElBQUk7QUFDN0IsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU0sSUFBSSxJQUFNLElBQUk7QUFDN0IsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSyxJQUFJLElBQU0sSUFBSSxJQUFNLElBQUk7QUFDN0IsZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksYUFBYUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM5QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUFBLFVBQ3pCO0FBRUEsaUJBQU0sSUFBSSxJQUFJLEtBQUssR0FBRztBQUNwQixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxZQUFZQSxRQUFPLENBQUMsS0FBSztBQUN6QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxZQUFZQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzdDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBRXZCLGdCQUFJLElBQUksSUFBSTtBQUNaLGdCQUFLLEtBQUssSUFBTSxNQUFNO0FBQ3RCLGdCQUFJLElBQUksSUFBSSxJQUFJLFlBQVlBLFFBQU8sSUFBSSxDQUFDLEtBQUs7QUFDN0MsZ0JBQUssS0FBSyxLQUFPLE1BQU07QUFFdkIsZ0JBQUksSUFBSSxJQUFJO0FBQ1osZ0JBQUssS0FBSyxJQUFNLE1BQU07QUFDdEIsZ0JBQUksSUFBSSxJQUFJLElBQUksWUFBWUEsUUFBTyxJQUFJLENBQUMsS0FBSztBQUM3QyxnQkFBSyxLQUFLLEtBQU8sTUFBTTtBQUV2QixnQkFBSSxJQUFJLElBQUk7QUFDWixnQkFBSyxLQUFLLElBQU0sTUFBTTtBQUN0QixnQkFBSSxJQUFJLElBQUksSUFBSSxZQUFZQSxRQUFPLElBQUksQ0FBQyxLQUFLO0FBQzdDLGdCQUFLLEtBQUssS0FBTyxNQUFNO0FBQUEsVUFDekI7QUFFQSxlQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFDekIsZUFBSyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQ3pCLGVBQUssS0FBSyxLQUFLLEtBQUssS0FBSztBQUN6QixlQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFDekIsZUFBSyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQUEsUUFDM0I7QUFFQSxhQUFLLFVBQVUsTUFBTSxXQUFZO0FBQy9CLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLO0FBRXRFLGlCQUFPLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUksSUFDbEQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxLQUFNLEVBQUksSUFDNUQsVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUFJLFVBQVcsT0FBTyxJQUFLLEVBQUksSUFDM0QsVUFBVyxPQUFPLElBQUssRUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFJLElBQ2xELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQzVELFVBQVcsT0FBTyxLQUFNLEVBQUksSUFBSSxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQzNELFVBQVcsT0FBTyxJQUFLLEVBQUksSUFBSSxVQUFVLEtBQUssRUFBSSxJQUNsRCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLEtBQU0sRUFBSSxJQUM1RCxVQUFXLE9BQU8sS0FBTSxFQUFJLElBQUksVUFBVyxPQUFPLElBQUssRUFBSSxJQUMzRCxVQUFXLE9BQU8sSUFBSyxFQUFJLElBQUksVUFBVSxLQUFLLEVBQUk7QUFBQSxRQUMzRDtBQUVBLGFBQUssVUFBVSxXQUFXLEtBQUssVUFBVTtBQUV6QyxhQUFLLFVBQVUsU0FBUyxXQUFZO0FBQ2xDLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLO0FBRXRFLGlCQUFPO0FBQUEsWUFDSixPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sS0FBTTtBQUFBLFlBQU8sT0FBTyxJQUFLO0FBQUEsWUFBTSxLQUFLO0FBQUEsWUFDL0QsT0FBTyxLQUFNO0FBQUEsWUFBTyxPQUFPLEtBQU07QUFBQSxZQUFPLE9BQU8sSUFBSztBQUFBLFlBQU0sS0FBSztBQUFBLFlBQy9ELE9BQU8sS0FBTTtBQUFB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SUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBLElBRVYsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9WLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUNWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQSxJQUVWLFVBQVU7QUFBQTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFnQlo7QUFnQk8sTUFBTSxzQkFBMkMsb0JBQUksSUFBSTtBQUFBLElBQzlEO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGLENBQUM7QUFXTSxNQUFNLGtCQUEwRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1yRSxVQUFVO0FBQUE7QUFBQTtBQUFBLE1BR1Isb0JBQW9CO0FBQUE7QUFBQSxNQUNwQixjQUFjO0FBQUEsTUFD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QSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBV1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBO0FBQUEsSUFFVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUE7QUFBQSxJQUVWLFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FDRTtBQUFBLElBQ0YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixXQUFXO0FBQUE7QUFBQSxJQUVYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBRVgsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBO0FBQUEsSUFFWCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFD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LFNBQVM7QUFBQSxnQkFDVCxVQUFVO0FBQUEsZ0JBQ1YsT0FBTztBQUFBLGdCQUNQLElBQUksS0FBSyxJQUFJO0FBQUEsZ0JBQ2IsV0FBVyxLQUFLLElBQUk7QUFBQSxjQUN0QjtBQUFBLFlBQ0YsQ0FBQztBQUFBLFVBQ0gsU0FBUyxHQUFHO0FBQ1Ysb0JBQVEsS0FBSyxrQ0FBa0MsQ0FBQztBQUFBLFVBQ2xEO0FBQUEsUUFDRixHQUFHO0FBQUEsTUFDTDtBQUNBLHVCQUFpQjtBQUNqQixVQUFJO0FBQUUscUJBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQztBQUFBLE1BQUcsUUFBUTtBQUFBLE1BQUM7QUFDM0MsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxpQkFBaUI7QUFDakMsYUFBTyxRQUFRLE1BQU0sSUFBSSxXQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsYUFBYSxLQUFLLFdBQVcsS0FBSyxJQUFJLENBQUM7QUFDNUYsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLEtBQUssU0FBUyxtQkFBbUI7QUFDbkMsYUFBTyxRQUFRLE1BQU0sT0FBTyxXQUFXLEVBQUUsS0FBSyxNQUFNLGFBQWEsRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDO0FBQzlFLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBS0QsU0FBTyxPQUFPLE9BQU8sZ0JBQWdCLEVBQUUsaUJBQWlCLEtBQUssQ0FBQztBQUM5RCxTQUFPLE9BQU8sUUFBUSxZQUFZLE1BQU07QUFBQSxFQUFxQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJjcnlwdG8iLCAiQnVmZmVyIiwgImJsb2NrcyIsICJleHBvcnRzIiwgIm1hcFN5c3RlbSIsICJlc2NhcGVSZWdleCIsICJjamtDaGFycyIsICJvYnNJZCIsICJtYXBTeXN0ZW0iLCAiciJdCn0K
